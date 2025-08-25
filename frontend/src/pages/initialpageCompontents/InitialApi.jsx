import { supabase } from "../../theLeftoverFiles/SupabaseClient.jsx";

export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) throw error;
  return user; // may be null
}

export async function getProfile(userId) {
  if (!userId) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return data; // { username } | null
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function signInAnon() {
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  return data.user;
}

export async function upsertProfile(userId, payload) {
  const { error } = await supabase
    .from("profiles")
    .upsert({ id: userId, ...payload, updated_at: new Date().toISOString() })
    .select()
    .single();
  if (error) throw error;
}
