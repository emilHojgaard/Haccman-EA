import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  db: { schema: "Haccman" },
  // keeps player signed in across reloads
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Call this once on app startup
export async function ensureAnonymousSession() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    const { error } = await supabase.auth.signInAnonymously();
    if (error) throw error;
  }
}

//------------------Admin client for supabase------------------

export function supabaseAdmin() {
  const token = sessionStorage.getItem("token");
  return createClient(supabaseUrl, supabaseKey, {
    db: { schema: "Haccman" },
    // keeps admin signed in across reloads
    global: {
      headers: { Authorization: token ? `Bearer ${token}` : undefined },
    },
  });
}
