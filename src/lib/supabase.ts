import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env?.VITE_SUPABASE_URL ||
  import.meta.env?.NEXT_PUBLIC_SUPABASE_URL ||
  import.meta.env?.SUPABASE_URL ||
  (typeof process !== "undefined"
    ? process.env?.VITE_SUPABASE_URL ||
      process.env?.NEXT_PUBLIC_SUPABASE_URL ||
      process.env?.SUPABASE_URL
    : "") ||
  "https://placeholder-project-id.supabase.co";

const supabaseAnonKey =
  import.meta.env?.VITE_SUPABASE_ANON_KEY ||
  import.meta.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  import.meta.env?.SUPABASE_ANON_KEY ||
  (typeof process !== "undefined"
    ? process.env?.VITE_SUPABASE_ANON_KEY ||
      process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env?.SUPABASE_ANON_KEY
    : "") ||
  "placeholder-key";

if (
  !supabaseUrl ||
  !supabaseAnonKey ||
  supabaseUrl.includes("placeholder-project-id") ||
  supabaseAnonKey === "placeholder-key"
) {
  console.warn(
    "Supabase configuration warning: Using placeholder environment variables or missing configuration. " +
      "Please make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your Vercel deployment variables.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
