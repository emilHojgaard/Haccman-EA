import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://yqroigcevcoddsmangyg.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlxcm9pZ2NldmNvZGRzbWFuZ3lnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2NzgwMTEsImV4cCI6MjA3MTI1NDAxMX0.Gw0B0Ak05P_q1Ty0gLZXmibiyaWEMjPwcGwXxkwrmdc";

export const supabase = createClient(supabaseUrl, supabaseKey);
