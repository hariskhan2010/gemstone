import Link from 'next/link';
import { connection } from 'next/server';
import { requireAdmin } from '@/lib/auth/admin';
import { setReviewStatus, deleteReview } from '@/lib/products/actions';
import type { Review } from '@/lib/products/types';

export default async function ReviewsAdmin({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  await connection();
  const { supabase } = await requireAdmin();
  const tab = (await searchParams).tab === 'all' ? 'all' : 'pending';
  let q = supabase.from('reviews').select('*, product:products(name, slug)').order('created_at', { ascending: false }).limit(200);
  if (tab === 'pending') q = q.eq('status', 'pending');
  const { data } = await q;
  const reviews = (data ?? []) as (Review & { product: { name: string; slug: string } | null })[];
  return (
    <section>
      <div className="ag-chips" style={{ marginTop: 8 }}>
        <Link className="ag-chip" href="/redesign/admin/reviews" aria-current={tab === 'pending' ? 'page' : undefined}>Waiting</Link>
        <Link className="ag-chip" href="/redesign/admin/reviews?tab=all" aria-current={tab === 'all' ? 'page' : undefined}>All</Link>
      </div>
      {reviews.length === 0 && <p className="ag-lede">No reviews {tab === 'pending' ? 'waiting' : 'yet'}.</p>}
      <div className="ag-rev-list">
        {reviews.map(r => (
          <article className="ag-rev ag-perk" key={r.id}>
            <div className="ag-row"><span className="ag-stars" aria-label={`${r.rating} out of 5`}>{'★'.repeat(r.rating)}<i>{'★'.repeat(5 - r.rating)}</i></span><span className={`ag-badge ag-b-${r.status}`}>{r.status}</span></div>
            {r.title && <h3>{r.title}</h3>}
            <p>{r.body}</p>
            <p className="ag-mono">{r.author_name} · {new Date(r.created_at).toLocaleDateString('en-GB')} · {r.product ? <Link href={`/redesign/products/${r.product.slug}`}>{r.product.name}</Link> : 'deleted product'}</p>
            <div className="ag-acts">
              {r.status !== 'approved' && <form action={setReviewStatus.bind(null, r.id, 'approved')}><button className="ag-btn ag-pri" type="submit">Approve</button></form>}
              {r.status !== 'rejected' && <form action={setReviewStatus.bind(null, r.id, 'rejected')}><button className="ag-btn" type="submit">Reject</button></form>}
              <form action={deleteReview.bind(null, r.id)}><button className="ag-btn" type="submit">Delete</button></form>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
