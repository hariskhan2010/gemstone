import type { NextRequest } from 'next/server';
import { redirect } from 'next/navigation';
import type { EmailOtpType } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';

/**
 * Landing point for the links in Supabase emails (confirm sign-up, reset password).
 * Handles both link styles: ?code=… (default templates, PKCE) and ?token_hash=…&type=… (custom templates).
 * Add https://YOUR-DOMAIN/redesign/auth/confirm to Supabase → Authentication → URL Configuration → Redirect URLs.
 */
export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const code = sp.get('code'), tokenHash = sp.get('token_hash'), type = sp.get('type') as EmailOtpType | null;
  const nextRaw = sp.get('next') ?? '/redesign/account';
  const next = nextRaw.startsWith('/redesign/') && !nextRaw.startsWith('//') ? nextRaw : '/redesign/account';
  const supabase = await createClient();
  let ok = false;
  if (supabase && code) ok = !(await supabase.auth.exchangeCodeForSession(code)).error;
  else if (supabase && tokenHash && type) ok = !(await supabase.auth.verifyOtp({ type, token_hash: tokenHash })).error;
  redirect(ok ? next : '/redesign/sign-in?error=link');
}
