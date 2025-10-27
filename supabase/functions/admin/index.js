import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { create, getNumericDate } from "https://deno.land/x/djwt@v3.0.2/mod.ts";

// Supabase client (service role key)
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const supabase = createClient(supabaseUrl, supabaseKey, {
  // db: { schema: "Haccman" },
  db: { schema: "Pilot_Test" },
  // db: { schema: "KEA" },
  // db: { schema: "PWC" },
});

// CORS headers (for at kunne lave cross site scripting)
const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey",
};

serve(async (req) => {
  // 🔎 Debug envs and request
  console.log("envs", {
    url: !!Deno.env.get("SUPABASE_URL"),
    srk: !!Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
    jwt: !!Deno.env.get("JWT_SECRET"),
  });

  console.log("Request method:", req.method);

  // Handle preflight request
  if (req.method === "OPTIONS") {
    console.log("Handling CORS preflight (OPTIONS)");
    return new Response(null, { status: 200, headers });
  }

  try {
    console.log("inside try/catch");
    // Read Authorization header (if any)
    const authHeader = req.headers.get("Authorization");
    console.log("Authorization header:", authHeader);

    // Parse request body
    const { name, password } = await req.json();
    console.log("Request body:", { name, password });

    // Query the Admin table
    const { data: rows, error } = await supabase
      .from("Admin")
      .select("*")
      .eq("name", name)
      .limit(1);

    const admin = rows[0];

    if (error || !rows || rows.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
        headers,
      });
    }

    // Compare passwords (if you are using plain text, simple check)
    if (password !== admin.password) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
        headers,
      });
    }

    // JWT secret (token der gør at admin bliver authorized)
    const JWT_LEGACY_SECRET = Deno.env.get("LEGACY_SECRET");
    // decrypting the JWT
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(JWT_LEGACY_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    // creating a payload for our token :
    const payload = {
      sub: String(admin.id), // stable identifier (string is fine)
      role: "authenticated", // keep standard DB role
      is_admin: true, // <-- custom claim we’ll use in RLS
      exp: getNumericDate(60 * 60 * 8),
    };

    const token = await create({ alg: "HS256", typ: "JWT" }, payload, key);

    console.log("Login successful, token generated");

    return new Response(JSON.stringify({ token }), { status: 200, headers });
  } catch (err) {
    console.error("Server error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers,
    });
  }
});
