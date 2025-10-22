import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { detectIntent } from "./detectIntent.js";
import { journalTextToMarkdown } from "./journalTextToMarkdown.js";
import messageHistory from "./messageHistory.js";
import { buildContext } from "./buildContext.js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // lock down in prod
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

// Init Supabase (service key so RLS won't block the RPC)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// --- Helpers ---
async function embedWithOpenAI(text) {
  const r = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "text-embedding-3-small", // 1536 dims
      input: text,
    }),
  });
  if (!r.ok) {
    throw new Error(`embed error: ${r.status} ${await r.text()}`);
  }
  const j = await r.json();
  return j.data[0].embedding; // number[]
}


function redactCPR(s) {
  // optional safety net: mask DK CPR formats
  return s
    .replace(/\b\d{6}[- ]?\d{4}\b/g, "**********")
    .replace(/\b\d{10}\b/g, "**********");
}

// --- Main handler ---
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  console.log("Request received");

  try {
    const { message, systemPrompt, constrain, guardrail, previousPrompts } = await req.json();

    if (!OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: "Missing OPENAI_API_KEY" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    //--- Organize previous prompts ---
    const chatHistory = messageHistory(previousPrompts, 20);


    // --- Detect intent to know retrieval methode ---
    const { mode, journalId, cpr, nameInit, knownDoc } = detectIntent(message);
    const fullname = nameInit ? `${nameInit.first} ${nameInit.last}` : null;
    console.log("Entities detected:", { mode, journalId, cpr, fullname, knownDoc });

    // --- different retrieval methods ---
    if (mode === "full") {

      // --- Supabase Edge Call (getting document )
      const { data, error: rpcErr } = await supabase.rpc("full_text_search", { query_text: `journal${journalId}, ${cpr}, ${fullname}, ${knownDoc}` });
      if (rpcErr) {
        return new Response(
          JSON.stringify({ error: rpcErr.message ?? rpcErr }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const doc = Array.isArray(data) ? data[0] : data;
      const docTitle = doc?.title ?? "";
      const docText = doc?.full_text ?? "";
      const confidential = false; //doc?.confidential ?? false;

      // --- OpenAI Call (creating prompt + getting generated answer ) --
      const body = {
        model: "gpt-4o-mini",
        temperature: 0.2, // lower = more instruction-following
        messages: [
          { role: "system", content: systemPrompt + constrain },
          {
            role: "system",
            content: "" +
            confidential
              ? `The document below is confidential. Politely inform the user you cannot share the contents, and suggest they request access through authorized channels.`
              : `
Your task is to present the retrieved document.

You will receive:
- A **DOC TITLE** (the name of the retrieved document)
- A **DOCUMENT** (the content of the retrieved document)
- A **USER question**

Your task:
1. If the DOC TITLE and DOCUMENT is NOT empty, present the FULL DOCUMENT without changes.
2. If the DOC TITLE or DOCUMENT is empty or missing, respond exactly with: "Document not found."
3. Do **not** invent a title or hallucinate content that is not given.
`.trim(),
          },
          { role: "system", content: `DOC TITLE:\n${docTitle ?? ""} ` },
          { role: "system", content: `DOCUMENT:\n${docText ?? ""}` },
          ...chatHistory,
          { role: "user", content: message },
        ],
      };
      console.log("the full prompt body is:", body);
      console.log("the document is:", docTitle);

      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!r.ok) {
        const text = await r.text();
        return new Response(JSON.stringify({ error: text }), {
          status: r.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const json = await r.json();
      let aiResponsetext = json?.choices?.[0]?.message?.content ?? "";

      // Return answer 
      return new Response(JSON.stringify({
        mode: "full",
        aiResponsetext,
        sources: [],
        document: doc ? { title: docTitle, full_text: docText } : null,
        titles: docTitle ? [docTitle] : [],
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

    } else if (mode === "summary") {
      // --- Supabase Edge Call (getting document ) ---
      const { data, error: rpcErr } = await supabase.rpc("full_text_search", { query_text: `journal${journalId}, ${cpr}, ${fullname}, ${knownDoc}` });
      if (rpcErr) {
        return new Response(
          JSON.stringify({ error: rpcErr.message ?? rpcErr }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const doc = Array.isArray(data) ? data[0] : data;
      const docTitle = doc?.title ?? "";
      const docText = doc?.full_text ?? "";

      // --- OpenAI Call (creating prompt + getting generated answer ) --

      const body = {
        model: "gpt-4o-mini",
        temperature: 0.2, // lower = more instruction-following
        messages: [
          { role: "system", content: systemPrompt + constrain },
          {
            role: "system",
            content: `
You are an assistant designed to introduce a retrieved document.

You will receive:
- A **DOC TITLE** (the name of the retrieved document)
- A **DOCUMENT** (the content of the retrieved document)
- A **USER question**

Your task:
1. If the DOC TITLE and DOCUMENT is NOT empty, summarize the DOCUMENT in a concise manner according to the USER question.
2. If the DOC TITLE or DOCUMENT is empty or missing, respond exactly with: "Document not found."
3. Do **not** invent a title or hallucinate content that is not given.
    `.trim(),
          },
          {
            role: "system",
            content: `DOC TITLE:\n${docTitle ?? ""}`,
          },
          { role: "system", content: `DOCUMENT:\n${docText ?? ""}` },
          ...chatHistory,
          { role: "user", content: message },
        ],
      };
      console.log("the full prompt body is:", body);
      console.log("the document is:", docTitle);

      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!r.ok) {
        const text = await r.text();
        return new Response(JSON.stringify({ error: text }), {
          status: r.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const json = await r.json();
      let aiResponsetext = json?.choices?.[0]?.message?.content ?? "";

      // --- Return answer ---
      return new Response(
        JSON.stringify({
          mode: "summary",
          aiResponsetext,
          sources: [],
          document: doc ? { title: docTitle, full_text: docText } : null,
          titles: docTitle ? [docTitle] : [],
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    // fall back mode: Hybrid
    else {
      //--- normalizing message for querying ---
      function normalizeForFTS(input) {
        return (input ?? "")
          .normalize("NFD")                         // split accents
          .replace(/\p{Diacritic}/gu, "")          // remove accents (Søren -> Soren)
          .toLowerCase()
          .replace(/[^\p{L}\p{N}\s]+/gu, " ")      // strip punctuation (quotes, commas, parens…)
          .replace(/\s+/g, " ")                    // collapse whitespace
          .trim();
      }
      const normalizedMessage = normalizeForFTS(message);
      // --- embedding the query ---
      // const queryEmbedding = await embedWithOpenAI(message);
      // console.log("Query embedding computed");
      const normEmbedding = await embedWithOpenAI(normalizedMessage);
      console.log("Normalized query embedding computed");
      // --- Supabase Edge Call (getting chunks ) ---
      const { data: matches, error: rpcErr } = await supabase.rpc(
        "hybrid_search_chunks_rrf",
        {
          query_text: normalizedMessage,
          query_embedding: normEmbedding,
          match_count: 12,
          min_rrf: 0.017,
        }
      );
      if (rpcErr) {
        return new Response(
          JSON.stringify({ error: rpcErr.message ?? rpcErr }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      console.log("Retrieved matches: ", matches, "matching chunks");

      // --- Building context string ---
      const context = buildContext(matches ?? []);
      console.log("Context built:", context);

      // --- OpenAI Call (creating prompt + getting generated answer ) ---
      const body = {
        model: "gpt-4o-mini",
        temperature: 0.2, // lower = more instruction-following
        messages: [
          { role: "system", content: systemPrompt + constrain},
          {
            role: "system",
            content:
              "You will receive CONTEXT retrieved from the hospital RAG and a CHAT HISTORY ending with the USER QUERY. Answer truthfully based on the CONTEXT. If the CONTEXT does not contain the answer, answer based on your training data. If you don't know, say so."
          },
          { role: "system", content: `Context:\n${context}` },
          ...chatHistory,
          { role: "user", content: message },
        ],
      };
      console.log("context: ", context);
      console.log("chatHistory: ", [...chatHistory]);
      console.log("message: ", message);

      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!r.ok) {
        const text = await r.text();
        return new Response(JSON.stringify({ error: text }), {
          status: r.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // --- OpenAI response ---
      const json = await r.json();
      const aiResponsetext = json?.choices?.[0]?.message?.content ?? "";
      // aiResponsetext = redactCPR(aiResponsetext); // optional safety net

      // --- Return answer + the sources you used (ids/similarities) ---
      return new Response(
        JSON.stringify({
          mode: "hybrid",
          aiResponsetext: aiResponsetext,
          sources: (matches ?? []).map((m, i) => ({
            id: m.chunk_id,
            doc_id: m.doc_id,
            doc_title: m.doc_title,
            doc_type: m.doc_type,
            embedding_score: m.embedding_score,
            keyword_score: m.keyword_score,
            rrf_score: m.rrf_score,
            rank: i + 1,
          })),
          document: null,
          titles: (matches ?? []).map((m) => m.doc_title),
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
