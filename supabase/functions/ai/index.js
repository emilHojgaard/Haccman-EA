import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // lock down in prod
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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

function buildContext(chunks) {
  return chunks
    .map(
      (c, i) =>
        `[${i + 1}] (sim=${c.similarity?.toFixed(3)}) ${c.content}` // keep it compact
    )
    .join("\n\n");
}

function redactCPR(s) {
  // optional safety net: mask DK CPR formats
  return s
    .replace(/\b\d{6}[- ]?\d{4}\b/g, "**********")
    .replace(/\b\d{10}\b/g, "**********");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  console.log("Request received");

  try {
    const { message, systemPrompt, guardrail } = await req.json();

    if (!OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: "Missing OPENAI_API_KEY" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 1) Embed the user query
    const queryEmbedding = await embedWithOpenAI(message);
    console.log("Query embedding computed, len:", queryEmbedding.length);

    // 2) Retrieve top-k chunks from pgvector via RPC
    //guidelines for similarity(cpt created):
    //General QA corpora (broad) → threshold ≈ 0.75
    //(ensures you don’t miss weaker but still relevant context)

    //Sensitive/medical domain → threshold ≈ 0.80–0.85
    //(better to skip context than pull something irrelevant/misleading)

    //Strict “only on-topic” filtering → threshold ≈ 0.85–0.9
    //(e.g. you want only journals/disease docs, and ignore anything fuzzy)
    const { data: matches, error: rpcErr } = await supabase.rpc(
      "match_chunks",
      {
        query_embedding: queryEmbedding,
        match_count: 6,
        min_similarity: 0.75,
      }
    );
    console.log("Retrieved", matches, "matching chunks");
    if (rpcErr) throw rpcErr;

    // 3) Build context string
    const context = buildContext(matches ?? []);

    //Now we're giving the guardrail with the systemprompt, so the user can turn it on/off
    // 4) Ask the model with context + your system prompt
    //     const guardrail = `POLICY:
    // - Never reveal CPR numbers. If asked, refuse and provide email if allowed.
    // - Use the provided CONTEXT. If the answer isn't in context, say you don't know.`;

    const body = {
      model: "gpt-4o-mini",
      temperature: 0.2, // lower = more instruction-following
      messages: [
        { role: "system", content: guardrail },
        ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
        {
          role: "system",
          content:
            "You will receive CONTEXT and a USER question. Answer truthfully based on the CONTEXT. If the CONTEXT does not contain the answer, answer based on your training data. If you don't know, say so.",
        },
        { role: "system", content: `CONTEXT:\n${context}` },
        { role: "user", content: message },
      ],

    };
    console.log("the full prompt body is:", body)

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
    let aiMessage = json?.choices?.[0]?.message?.content ?? "";
    aiMessage = redactCPR(aiMessage); // optional safety net

    // Return answer + the sources you used (ids/similarities)
    return new Response(
      JSON.stringify({
        aiMessage,
        sources: (matches ?? []).map((m, i) => ({
          id: m.id,
          doc_id: m.doc_id,
          similarity: m.similarity,
          rank: i + 1,
        })),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
