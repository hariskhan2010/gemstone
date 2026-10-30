/**
 * Supabase settings. Both values are public by design (they ship to the browser);
 * row level security in supabase/schema.sql is what protects the data.
 * Newer Supabase projects call the key "publishable"; older ones call it "anon". Either works.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
/** False until the env vars are set, so the site still builds and runs without accounts. */
export const supabaseConfigured = () => Boolean(SUPABASE_URL && SUPABASE_KEY);
