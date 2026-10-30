import Link from 'next/link';
import { connection } from 'next/server';
import { requireAdmin } from '@/lib/auth/admin';
import type { Post } from '@/lib/products/types';

export default async function AdminPosts() {
  await connection();
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
  const posts = (data ?? []) as Post[];
  if (!posts.length) return <div className="ag-empty"><h2 className="ag-d">No posts yet</h2><p>Write your first blog post. Drafts stay private until you publish.</p><Link className="ag-btn ag-pri" href="/redesign/admin/posts/new">+ New post</Link></div>;
  return (
    <div className="ag-table" role="table" aria-label="Blog posts">
      <div className="ag-tr ag-th" role="row"><span role="columnheader">Title</span><span role="columnheader">Topic</span><span role="columnheader">Status</span><span role="columnheader">Updated</span><span role="columnheader">Live</span></div>
      {posts.map(p => (
        <Link className="ag-tr" role="row" key={p.id} href={`/redesign/admin/posts/${p.id}`}>
          <span role="cell" className="ag-prod"><b>{p.title}</b></span>
          <span role="cell">{p.topic ?? '—'}</span>
          <span role="cell"><span className={`ag-badge ag-b-${p.status === 'published' ? 'published' : 'pending'}`}>{p.status}</span></span>
          <span role="cell">{new Date(p.updated_at).toLocaleDateString('en-GB')}</span>
          <span role="cell">{p.status === 'published' ? 'Yes' : '—'}</span>
        </Link>
      ))}
    </div>
  );
}
