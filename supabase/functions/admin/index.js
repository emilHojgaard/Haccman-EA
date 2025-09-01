import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import jwt from "https://cdn.skypack.dev/jsonwebtoken";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const supabase = createClient(supabaseUrl, supabaseKey);

const JWT_SECRET = Deno.env.get("JWT_SECRET");

serve(async (req) => {
  const { name, password } = await req.json();

  // Hent admin fra DB
  const { data: admins, error } = await supabase
    .from("admins")
    .select("*")
    .eq("name", name)
    .limit(1);

  if (error || !admins || admins.length === 0) {
    return new Response(JSON.stringify({ error: "Invalid credentials" }), {
      status: 401,
    });
  }

  const admin = admins[0];

  // Tjek password
  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) {
    return new Response(JSON.stringify({ error: "Invalid credentials" }), {
      status: 401,
    });
  }

  // Generer JWT med admin role claim
  const token = jwt.sign({ sub: admin.id, role: "admin" }, JWT_SECRET, {
    expiresIn: "8h",
  });

  return new Response(JSON.stringify({ token }), { status: 200 });
});
