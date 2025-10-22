import { supabase, supabaseAdmin } from "./theLeftoverFiles/SupabaseClient.jsx";

//for Supabase AI-connection/edge-function
const FN_URL =
  (import.meta.env ? import.meta.env.VITE_SUPABASE_URL : undefined);

export async function sendPromptToAI(
  message,
  systemPrompt,
  constrain,
  guardrail,
  previousPrompts
) {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  console.log("Session in sendPromptToAI:", session);

  const resp = await fetch(`${FN_URL}/functions/v1/ai`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(session?.access_token
        ? { Authorization: `Bearer ${session.access_token}` }
        : {}),
    },
    body: JSON.stringify({
      message,
      systemPrompt,
      constrain,
      guardrail,
      previousPrompts,
    }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`AI function failed: ${resp.status} ${text}`);
  }
  const { mode, aiResponsetext, sources, document, titles } = await resp.json();

  return { mode, aiResponsetext, sources, document, titles };
}

export async function startConversation(botId) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No user");

  const bot_id = String(botId);

  const { data, error } = await supabase
    .from("Sessions")
    .insert({ user_id: user.id, bot_id: bot_id ?? null })
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function insertPrompt(sessionId, text) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No user");

  const { data: prompt, error } = await supabase
    .from("Prompt")
    .insert({ session_id: sessionId, user_id: user.id, content: text })
    .select()
    .single();

  if (error) throw error;
  return prompt; // { id, content, ... }
}

export async function insertResponse(promptId, aiText, sources) {
  const { error } = await supabase
    .from("Responses")
    .insert({ prompt_id: promptId, content: aiText, sources: sources });
  if (error) throw error;
}

export async function loadHistory(sessionId) {
  const { data, error } = await supabase
    .from("Prompt")
    .select("id, content, created_at, responses(content, created_at)")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}

export async function endConversation(sessionId) {
  const { error } = await supabase
    .from("Sessions")
    .update({ ended_at: new Date().toISOString() })
    .eq("id", sessionId);
  if (error) throw error;
}
// Flattened messages for a session (user + assistant)
// Does not work right now, because it takes the newly entered session, which is by defualt empty...
export async function loadMessages(sessionId) {
  console.log("Loading messages for sessionId:", sessionId);
  const { data, error } = await supabase
    .from("Prompt")
    .select(
      // prompt fields + embed matching responses
      "id, content, created_at, Responses(content, created_at)"
    )
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true }); // order prompts

  if (error) throw error;

  console.log("Loaded prompts with responses:", data);

  // Flatten into thread: prompt → user, each response → assistant
  const flat = [];
  for (const p of data ?? []) {
    flat.push({
      role: "user",
      content: p.content,
      created_at: p.created_at,
      session_id: p.session_id,
    });
    for (const r of p.Responses ?? []) {
      flat.push({
        role: "assistant",
        content: r.content,
        created_at: r.created_at,
        session_id: p.session_id,
      });
    }
  }

  // Make sure overall order is chronological
  flat.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  return flat;
}

//------------------FOR DATA RETRIEVAL (ADMIN)----------------------

// All usernames (sorted). Requires RLS to allow read for this page.
export async function getAllUsernames() {
  const admin = supabaseAdmin();
  const { data, error } = await admin
    .from("Players")
    .select("id, username")
    .order("username", { ascending: true });
  if (error) throw error;
  return data;
}

// All sessions for a user, newest first
export async function getSessionsByUser(userId) {
  const admin = supabaseAdmin();
  const { data, error } = await admin
    .from("Sessions")
    .select("id, bot_id, started_at, ended_at, Prompt!inner(id)")
    .eq("user_id", userId)
    .order("started_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

// CHECK OM BLIVER BRUGT: Flattened messages for a session (user + assistant)
export async function loadMessagesAdmin(sessionId) {
  const admin = supabaseAdmin();
  const { data, error } = await admin
    .from("Prompt")
    .select(
      // prompt fields + embed matching responses
      "id, content, created_at, Responses(content, created_at)"
    )
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true }); // order prompts

  if (error) throw error;

  // Flatten into thread: prompt → user, each response → assistant
  const flat = [];
  for (const p of data ?? []) {
    flat.push({
      role: "user",
      content: p.content,
      created_at: p.created_at,
      session_id: p.session_id,
    });
    for (const r of p.Responses ?? []) {
      flat.push({
        role: "assistant",
        content: r.content,
        created_at: r.created_at,
        session_id: p.session_id,
      });
    }
  }

  // Make sure overall order is chronological
  flat.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  return flat;
}
