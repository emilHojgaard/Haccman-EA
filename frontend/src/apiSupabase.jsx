import { supabase } from "./theLeftoverFiles/SupabaseClient.jsx";

//for Supabase AI-connection/edge-function
const FN_URL =
  (import.meta.env ? import.meta.env.VITE_SUPABASE_URL : undefined) ||
  "https://yqroigcevcoddsmangyg.supabase.co";

export async function sendPromptToMemory(message, systemPrompt) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const resp = await fetch(`${FN_URL}/functions/v1/ai`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(session?.access_token
        ? { Authorization: `Bearer ${session.access_token}` }
        : {}),
    },
    body: JSON.stringify({ message, systemPrompt }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`AI function failed: ${resp.status} ${text}`);
  }

  const { aiMessage } = await resp.json();
  return aiMessage;
}

export async function startConversation(botId) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No user");

  const bot_id = String(botId);

  const { data, error } = await supabase
    .from("sessions")
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
    .from("prompts")
    .insert({ session_id: sessionId, user_id: user.id, content: text })
    .select()
    .single();

  if (error) throw error;
  return prompt; // { id, content, ... }
}

export async function insertResponse(promptId, aiText) {
  const { error } = await supabase
    .from("responses")
    .insert({ prompt_id: promptId, content: aiText });
  if (error) throw error;
}

export async function loadHistory(sessionId) {
  const { data, error } = await supabase
    .from("prompts")
    .select("id, content, created_at, responses(content, created_at)")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}

export async function endConversation(sessionId) {
  const { error } = await supabase
    .from("sessions")
    .update({ ended_at: new Date().toISOString() })
    .eq("id", sessionId);
  if (error) throw error;
}

// --- Nice-to-have: flat loader via SQL view (if you created it)
export async function loadMessages(sessionId) {
  const { data, error } = await supabase
    .from("conversation_messages")
    .select("role, content, created_at")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
}

//------------------FOR DATA RETRIEVAL----------------------

// All usernames (sorted). Requires RLS to allow read for this page.
export async function getAllUsernames() {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username")
    .order("username", { ascending: true });
  if (error) throw error;
  return data || [];
}

// All sessions for a user, newest first
export async function getSessionsByUser(userId) {
  const { data, error } = await supabase
    .from("sessions")
    .select("id, bot_id, started_at, ended_at")
    .eq("user_id", userId)
    .order("started_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

// Flattened messages for a session (user + assistant)
export async function loadMessagesData(sessionId) {
  // Get prompts with nested responses
  const { data, error } = await supabase
    .from("prompts")
    .select("id, content, created_at, responses(content, created_at)")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  // Flatten into a single chronological array with roles
  const flat = [];
  for (const p of data || []) {
    flat.push({ role: "user", content: p.content, created_at: p.created_at });
    for (const r of p.responses || []) {
      flat.push({
        role: "assistant",
        content: r.content,
        created_at: r.created_at,
      });
    }
  }
  // Sort again in case response timestamps interleave
  flat.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  return flat;
}
