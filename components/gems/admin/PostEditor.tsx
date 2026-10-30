'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { POST_BUCKET, postMediaUrl } from '@/lib/supabase/public';
import { savePost, deletePost } from '@/lib/posts/actions';
import type { Post } from '@/lib/products/types';

const MAX = 10 * 1024 * 1024;

export default function PostEditor({ post, products }: { post?: Post; products: { id: string; name: string }[] }) {
  const router = useRouter();
  const [cover, setCover] = useState(post?.cover_path ?? '');
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); if (busy) return;
    const fd = new FormData(e.currentTarget);
    setBusy(true); setMsg(null);
    try {
      let path = cover;
      if (file) {
        if (file.size > MAX) throw new Error(`${file.name} is over 10 MB.`);
        const sb = createClient(); if (!sb) throw new Error('Supabase is not configured.');
        const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
        path = `posts/${crypto.randomUUID()}.${ext}`;
        const { error } = await sb.storage.from(POST_BUCKET).upload(path, file, { contentType: file.type, upsert: false });
        if (error) throw new Error(`Photo upload failed: ${error.message}`);
      }
      fd.set('cover_path', path);
      const r = await savePost(null, fd);
      if (!r?.ok || !r.id) throw new Error(r?.error ?? 'Could not save.');
      setCover(path); setFile(null); setMsg({ ok: true, text: r.message ?? 'Saved.' });
      if (!post) router.replace(`/redesign/admin/posts/${r.id}`); else router.refresh();
    } catch (err) { setMsg({ ok: false, text: err instanceof Error ? err.message : 'Error' }); }
    finally { setBusy(false); }
  }

  return (
    <div className="ag-editor">
      <form className="ag-form-card ag-wide" onSubmit={submit} noValidate>
        <h2 className="ag-d">{post ? 'Edit post' : 'New post'}</h2>
        {post && <input type="hidden" name="id" value={post.id} />}
        <div className="ag-grid2">
          <div className="ag-field"><label htmlFor="po-title">Title</label><input id="po-title" name="title" required defaultValue={post?.title} /></div>
          <div className="ag-field"><label htmlFor="po-topic">Topic</label><input id="po-topic" name="topic" defaultValue={post?.topic ?? ''} placeholder="Care, Meanings, Sourcing…" /></div>
        </div>
        <div className="ag-field"><label htmlFor="po-sum">Summary</label><textarea id="po-sum" name="summary" rows={3} maxLength={400} defaultValue={post?.summary} /></div>
        <div className="ag-field"><label htmlFor="po-body">Body (markdown: ## headings, - lists, **bold**, [links](https://…))</label><textarea id="po-body" name="body" rows={16} defaultValue={post?.body} /></div>
        <div className="ag-field"><label htmlFor="po-cover">Cover photo</label>
          <input id="po-cover" type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={e => setFile(e.target.files?.[0] ?? null)} />
          {cover && !file && (/* eslint-disable-next-line @next/next/no-img-element */
            <img src={postMediaUrl(cover)} alt="" style={{ maxWidth: 240, borderRadius: 12 }} />
          )}
          {cover && <label className="ag-check"><input type="checkbox" onChange={e => { if (e.target.checked) setCover(''); }} /> Remove current cover</label>}
        </div>
        <div className="ag-grid2">
          <div className="ag-field"><label htmlFor="po-prod">Linked stock item</label>
            <select id="po-prod" name="product_id" defaultValue={post?.product_id ?? ''}><option value="">None</option>{products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
          <div className="ag-field"><label htmlFor="po-status">Status</label>
            <select id="po-status" name="status" defaultValue={post?.status ?? 'draft'}><option value="draft">Draft (not public)</option><option value="published">Published</option></select></div>
        </div>
        <button className="ag-btn ag-pri" type="submit" disabled={busy}>{busy ? 'Saving…' : post ? 'Save' : 'Create post'}</button>
        {msg && <p className={`ag-alert ${msg.ok ? 'ag-good' : 'ag-bad'}`} aria-live="polite">{msg.text}</p>}
      </form>
      {post && (
        <aside className="ag-side">
          <form action={deletePost.bind(null, post.id)} onSubmit={e => { if (!confirm(`Delete "${post.title}"?`)) e.preventDefault(); }}>
            <button className="ag-btn ag-danger" type="submit">Delete post</button>
          </form>
        </aside>
      )}
    </div>
  );
}
