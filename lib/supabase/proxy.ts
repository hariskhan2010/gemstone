import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { SUPABASE_URL, SUPABASE_KEY, supabaseConfigured } from './env';

/** Pages that need a signed-in user. */
const PROTECTED = ['/redesign/account', '/redesign/reset-password', '/redesign/admin'];
/** Pages a signed-in user does not need. */
const GUEST_ONLY = ['/redesign/sign-in', '/redesign/sign-up'];

/** Refreshes the Supabase session cookie on every /redesign request and guards the account pages. */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  if (!supabaseConfigured()) return response;

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll() { return request.cookies.getAll(); },
      setAll(toSet, headers) {
        toSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        toSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers ?? {}).forEach(([k, v]) => response.headers.set(k, String(v)));
      },
    },
  });

  // Do not run code between createServerClient and getClaims: it can log users out at random.
  const { data } = await supabase.auth.getClaims();
  const signedIn = Boolean(data?.claims);
  const path = request.nextUrl.pathname;

  const go = (pathname: string, search = '') => {
    const url = request.nextUrl.clone(); url.pathname = pathname; url.search = search;
    const res = NextResponse.redirect(url);
    response.cookies.getAll().forEach(c => res.cookies.set(c));
    return res;
  };
  if (!signedIn && PROTECTED.some(p => path.startsWith(p))) return go('/redesign/sign-in', `?next=${encodeURIComponent(path)}`);
  if (signedIn && GUEST_ONLY.some(p => path.startsWith(p))) return go('/redesign/account');
  return response;
}
