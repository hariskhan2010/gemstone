'use client';

import { useActionState, useEffect, useState } from 'react';
import Link from 'next/link';
import { submitReview } from '@/lib/products/actions';

/** Signed-in customers only; the review waits for the owner's approval. */
export default function ReviewForm({ productId, slug }: { productId: string; slug: string }) {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [rating, setRating] = useState(0);
  const [state, action, pending] = useActionState(submitReview, null);
  useEffect(() => {
    let alive = true;
    import('@/lib/supabase/client').then(({ createClient }) => { const sb = createClient(); if (!sb) { setSignedIn(false); return; } sb.auth.getSession().then(({ data }) => alive && setSignedIn(Boolean(data.session))); });
    return () => { alive = false; };
  }, []);
  if (state?.ok) return <p className="ag-alert ag-good" role="status">{state.message}</p>;
  if (signedIn === false) return <p className="ag-alt"><Link href={`/redesign/sign-in?next=${encodeURIComponent(`/redesign/products/${slug}`)}`}>Sign in</Link> to write a review.</p>;
  if (signedIn === null) return null;
  return (
    <form action={action} className="ag-review-form">
      <input type="hidden" name="product_id" value={productId} />
      <input type="hidden" name="rating" value={rating || ''} />
      <fieldset className="ag-stars-in"><legend>Your rating</legend>
        {[1, 2, 3, 4, 5].map(n => <button key={n} type="button" aria-label={`${n} star${n > 1 ? 's' : ''}`} aria-pressed={rating === n} className={n <= rating ? 'on' : ''} onClick={() => setRating(n)}>★</button>)}
      </fieldset>
      <div className="ag-field"><label htmlFor="rv-n">Name shown</label><input id="rv-n" name="author_name" maxLength={60} placeholder="First name and initial" /></div>
      <div className="ag-field"><label htmlFor="rv-t">Title (optional)</label><input id="rv-t" name="title" maxLength={100} /></div>
      <div className="ag-field"><label htmlFor="rv-b">Review</label><textarea id="rv-b" name="body" required minLength={10} maxLength={2000} /></div>
      {state?.error && <p className="ag-alert ag-bad" role="alert">{state.error}</p>}
      <button className="ag-btn ag-pri" type="submit" disabled={pending}>{pending ? 'Sending…' : 'Send review'}</button>
      <p className="ag-mono">Reviews appear after the shop checks them.</p>
    </form>
  );
}
