import { createClient } from "@supabase/supabase-js";

// Reads your keys from .env.local (see .env.local.example).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Friendly nudge if you forgot to set up .env.local
  console.warn(
    "Supabase keys are missing. Copy .env.local.example to .env.local and fill it in."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
