import { createBrowserClient } from '@supabase/ssr';
import { SUPABASE_URL, SUPABASE_KEY, supabaseConfigured } from './env';

/** Browser client, used only to show "Account" instead of "Sign in" in the nav. Never trust it for access control. */
export function createClient() {
  if (!supabaseConfigured()) return null;
  return createBrowserClient(SUPABASE_URL, SUPABASE_KEY);
}
