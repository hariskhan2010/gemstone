import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/proxy';

/** Next.js 16 proxy (formerly middleware). If you already have a proxy.ts or middleware.ts, call updateSession from it instead. */
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = { matcher: ['/redesign/:path*'] };
