import { supabase } from "./theLeftoverFiles/SupabaseClient.jsx";

// Save a user prompt
export const sendPromptToMemory = async (message, sessionId, model) => {
  const { data, error } = await supabase
    .from("Prompts")
    .insert([{ text: message, model }])
    .select();

  if (error) throw error;
  return data[0];
};

// Fetch old prompts/responses
export const fetchOldPromptResponse = async (message, sessionId, model) => {
  const { data, error } = await supabase
    .from("Prompts")
    .select("*")
    .order("timestamp", { ascending: true });

  if (error) throw error;
  return data; // returns array of previous prompts
};

// Store a message (user or AI)
export const storeInteraction = async (message, username, time, sessionId) => {
  const { data, error } = await supabase
    .from("Responses")
    .insert([{ text: message, username, timestamp: time }])
    .select();

  if (error) throw error;
  return data[0];
};
