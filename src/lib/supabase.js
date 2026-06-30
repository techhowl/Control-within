import { createClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client using the SERVICE ROLE key.
 *
 * The service role bypasses Row Level Security, so this MUST never be imported
 * into a Client Component or any code that ships to the browser. It is only
 * used inside route handlers (src/app/api/**).
 *
 * Lazily created so a missing env var fails at request time with a clear error
 * rather than at module load (which would break `next build`).
 */
let client = null;

export function getSupabase() {
  if (client) return client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local (see .env.example)."
    );
  }

  client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
