import type { Metadata } from 'next';
import Link from 'next/link';
import { connection } from 'next/server';
import { requireAdmin } from '@/lib/auth/admin';

export const metadata: Metadata = { title: 'Admin · Asian Gemstone', robots: { index: false, follow: false } };
/** AI writing and 3D downloads can take a while. */
export const maxDuration = 300;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await connection(); // always render per request, never prerender the gate
  const { user } = await requireAdmin(); // server-side: non-admins are redirected before any admin UI renders
  return (
    <div className="ag-admin ag-view">
      <header className="ag-admin-head">
        <div><p className="ag-mono">Admin · {user.email}</p><h1 className="ag-d">Shop admin</h1></div>
        <nav className="ag-admin-nav" aria-label="Admin">
          <Link className="ag-btn" href="/redesign/admin">Stock</Link>
          <Link className="ag-btn" href="/redesign/admin/posts">Blog posts</Link>
          <Link className="ag-btn" href="/redesign/admin/reviews">Reviews</Link>
          <Link className="ag-btn ag-pri" href="/redesign/admin/products/new">+ New product</Link>
          <Link className="ag-btn ag-pri" href="/redesign/admin/posts/new">+ New post</Link>
        </nav>
      </header>
      {children}
    </div>
  );
}
