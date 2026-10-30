'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CONTACT_URL } from '@/lib/gems/stones';

const LINKS: [string, string][] = [['/redesign', 'Home'], ['/redesign/collection', 'Collection'], ['/redesign/about', 'About'], ['/redesign/blog', 'Blog'], [CONTACT_URL, 'Contact']];

export default function RedesignNav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const on = () => {
      const film = document.querySelector<HTMLElement>('.ag-scroller');
      setSolid(!film || scrollY > film.offsetHeight - innerHeight);
    };
    on(); addEventListener('scroll', on, { passive: true });
    return () => removeEventListener('scroll', on);
  }, [path]);
  useEffect(() => { setOpen(false); }, [path]);
  // Display only: shows "Account" instead of "Sign in". Loaded lazily so pages without accounts stay light.
  useEffect(() => {
    let unsub: (() => void) | undefined; let alive = true;
    import('@/lib/supabase/client').then(({ createClient }) => {
      const sb = createClient(); if (!sb || !alive) return;
      // The Admin link is asked of the server (is_admin() in the database). Cosmetic only: /redesign/admin re-checks on the server.
      const check = (signed: boolean) => {
        if (!signed) { setIsAdmin(false); return; }
        fetch('/redesign/admin-check', { cache: 'no-store' }).then(r => r.json()).then(j => { if (alive) setIsAdmin(j?.admin === true); }).catch(() => { if (alive) setIsAdmin(false); });
      };
      sb.auth.getSession().then(({ data }) => { if (alive) { setSignedIn(Boolean(data.session)); check(Boolean(data.session)); } });
      const { data } = sb.auth.onAuthStateChange((_e, session) => { setSignedIn(Boolean(session)); check(Boolean(session)); });
      unsub = () => data.subscription.unsubscribe();
    });
    return () => { alive = false; unsub?.(); };
  }, [path]);
  const acct: [string, string] = signedIn ? ['/redesign/account', 'Account'] : ['/redesign/sign-in', 'Sign in'];
  return (
    <nav className={`ag-nav${solid ? ' ag-solid' : ''}${open ? ' ag-open' : ''}`} aria-label="Main">
      <Link className="ag-logo" href="/redesign">Asian <b>Gemstone</b></Link>
      <div className="ag-links" id="ag-nav-links">
        {LINKS.map(([href, label]) => (
          <Link key={label} href={href} aria-current={path === href ? 'page' : undefined}>{label}</Link>
        ))}
        <Link className="ag-menu-only" href={CONTACT_URL}>Request a stone</Link>
      </div>
      <button type="button" className="ag-btn ag-menu-btn" aria-expanded={open} aria-controls="ag-nav-links" onClick={() => setOpen(o => !o)}>{open ? 'Close' : 'Menu'}</button>
      {isAdmin && <Link className="ag-btn" href="/redesign/admin" aria-current={path.startsWith('/redesign/admin') ? 'page' : undefined}>Admin</Link>}
      <Link className="ag-btn" href={acct[0]} aria-current={path === acct[0] ? 'page' : undefined}>{acct[1]}</Link>
      <Link className="ag-btn ag-nav-req" href={CONTACT_URL}><span className="ag-dot" /><span className="ag-bl">Request a stone</span><span className="ag-bs">Request</span></Link>
    </nav>
  );
}
