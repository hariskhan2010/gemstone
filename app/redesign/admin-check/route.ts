import { NextResponse } from 'next/server';
import { getAdmin } from '@/lib/auth/admin';

/** Server-side admin check used only to decide whether the nav shows the Admin link. The admin pages and actions enforce access themselves. */
export async function GET() {
  const a = await getAdmin();
  return NextResponse.json({ admin: Boolean(a) }, { headers: { 'Cache-Control': 'no-store' } });
}
