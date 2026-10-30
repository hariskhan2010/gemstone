import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { signOut } from '@/lib/auth/actions';
import { getAdmin } from '@/lib/auth/admin';
import { CONTACT_URL } from '@/lib/gems/stones';

export const metadata: Metadata = { title: 'Your account · Asian Gemstone', robots: { index: false } };

export default async function AccountPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await connection(); // always render per request: this page depends on who is signed in
  const supabase = await createClient();
  if (!supabase) {
    return (
      <div className="ag-page-hero ag-view"><div className="ag-glow" />
        <h1 className="ag-d">Accounts<br /><span className="ag-grad">coming soon</span></h1>
        {/* Supabase env vars are missing: see REDESIGN_README.md */}
        <p className="ag-lede">Sign-in is not available yet. Please check back soon.</p>
      </div>
    );
  }
  // getUser() asks Supabase, so this check cannot be faked with an edited cookie.
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/redesign/sign-in?next=/redesign/account');
  const sp = await searchParams;
  const name = typeof user.user_metadata?.full_name === 'string' ? user.user_metadata.full_name : '';
  const since = new Date(user.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  return (
    <div className="ag-page-hero ag-view"><div className="ag-glow" />
      <div className="ag-account">
        <p className="ag-eyebrow-l"><span className="ag-grad">Your account</span></p>
        <h1 className="ag-d">{name ? <>Hello,<br /><span className="ag-grad">{name.split(' ')[0]}.</span></> : 'Welcome.'}</h1>
        {sp.not_admin && <p className="ag-alert ag-bad" role="alert" style={{ marginTop: 24 }}>The admin panel is only for the shop owner.</p>}
        {sp.updated && <p className="ag-alert ag-good" role="status" style={{ marginTop: 24 }}>Your password was changed.</p>}
        <dl>
          {name && <div><dt>Name</dt><dd>{name}</dd></div>}
          <div><dt>Email</dt><dd>{user.email}</dd></div>
          <div><dt>Member since</dt><dd>{since}</dd></div>
        </dl>
        <div className="ag-acts">
          <Link className="ag-btn ag-pri" href="/redesign/collection">Explore Collection</Link>
          <Link className="ag-btn" href={CONTACT_URL}>Request a stone</Link>
          {(await getAdmin()) && <Link className="ag-btn ag-pri" href="/redesign/admin">Open admin panel</Link>}
          <form action={signOut}><button className="ag-btn" type="submit">Sign out</button></form>
        </div>
      </div>
    </div>
  );
}
