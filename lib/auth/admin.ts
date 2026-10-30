import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

/**
 * Server-side gate for the admin panel and every admin action.
 * The real check is the database function public.is_admin() (owner email in public.admins, email confirmed),
 * so the same rule protects the API, storage uploads and these pages.
 */
export async function getAdmin() {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: ok } = await supabase.rpc('is_admin');
  return ok === true ? { supabase, user } : null;
}
export async function requireAdmin() {
  const a = await getAdmin();
  if (!a) redirect('/redesign/account?not_admin=1');
  return a;
}
