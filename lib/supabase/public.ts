import { createClient as createSupabase } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_KEY, supabaseConfigured } from './env';

/** Cookie-free client for public pages (products, articles, approved reviews). Lets those pages be cached. */
export function createPublicClient() {
  if (!supabaseConfigured()) return null;
  return createSupabase(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
}
export const BUCKET = 'product-media';
export const mediaUrl = (path: string) => `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path.split('/').map(encodeURIComponent).join('/')}`;
export const POST_BUCKET = 'post-media';
export const postMediaUrl = (path: string) => `${SUPABASE_URL}/storage/v1/object/public/${POST_BUCKET}/${path.split('/').map(encodeURIComponent).join('/')}`;
