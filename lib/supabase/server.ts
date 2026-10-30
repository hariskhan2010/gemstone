import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { SUPABASE_URL, SUPABASE_KEY, supabaseConfigured } from './env';

/** Supabase client for Server Components, Server Actions and Route Handlers. Create one per request. Returns null when Supabase is not configured. */
export async function createClient() {
  if (!supabaseConfigured()) return null;
  const store = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll() { return store.getAll(); },
      setAll(toSet) {
        try { toSet.forEach(({ name, value, options }) => store.set(name, value, options)); }
        catch { /* Server Components cannot set cookies; proxy.ts refreshes the session instead. */ }
      },
    },
  });
}
