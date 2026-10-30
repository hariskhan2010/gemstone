import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProduct, approvedReviews } from '@/lib/products/queries';
import { mediaUrl } from '@/lib/supabase/public';
import { KIND_LABEL, GEM_CUTS } from '@/lib/products/types';
import { CONTACT_URL, CERT_NOTE } from '@/lib/gems/stones';
import { Markdown } from '@/lib/products/markdown';
import ProductGallery, { type GalleryItem } from '@/components/gems/ProductGallery';
import StatusBadge from '@/components/gems/StatusBadge';
import ReviewForm from '@/components/gems/ReviewForm';

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = await getProduct((await params).slug);
  if (!p) return {};
  const img = p.media.find(m => m.kind === 'image');
  const title = p.seo_title || `${p.name} · Asian Gemstone`, description = p.seo_description || p.description?.slice(0, 155) || undefined;
  return {
    title, description, keywords: p.keywords,
    alternates: { canonical: `/redesign/products/${p.slug}` },
    openGraph: { title, description, type: 'website', images: img ? [{ url: mediaUrl(img.path) }] : undefined },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = await getProduct((await params).slug);
  if (!p) notFound();
  const reviews = await approvedReviews(p.id);
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  const items: GalleryItem[] = p.media.map((m, k) => ({ kind: m.kind, src: mediaUrl(m.path), alt: m.alt || `${p.name}, ${m.kind} ${k + 1}` }));
  if (p.model_kind === 'gem' && p.gem_cut && p.gem_color) items.splice(Math.min(1, items.length), 0, { kind: '3d', src: '', alt: '3D view', model: { cut: p.gem_cut, color: p.gem_color } });
  if (p.model_kind === 'mesh' && p.model_status === 'done' && p.model_path) items.splice(Math.min(1, items.length), 0, { kind: '3d', src: '', alt: '3D view', model: { glb: mediaUrl(p.model_path) } });

  const spec: [string, string][] = ([
    ['Type', KIND_LABEL[p.kind]], ['Family', p.family], ['Weight', p.carat != null ? `${p.carat} ct` : null], ['Origin', p.origin], ['Treatment', p.treatment],
    ['Size', p.dimensions], ['Cut', p.gem_cut ? GEM_CUTS.find(c => c[0] === p.gem_cut)?.[1] ?? null : null],
  ] as [string, string | null][]).filter((r): r is [string, string] => Boolean(r[1]));

  // Google rich results: only real data. No offer without a price, no rating without approved reviews.
  const ld = {
    '@context': 'https://schema.org', '@type': 'Product', name: p.name, description: p.seo_description || p.description || undefined,
    image: p.media.filter(m => m.kind === 'image').map(m => mediaUrl(m.path)), brand: { '@type': 'Brand', name: 'Asian Gemstone' }, sku: p.slug,
    ...(p.price != null ? { offers: { '@type': 'Offer', price: p.price, priceCurrency: p.currency, url: `/redesign/products/${p.slug}` } } : {}),
    ...(reviews.length ? {
      aggregateRating: { '@type': 'AggregateRating', ratingValue: avg.toFixed(1), reviewCount: reviews.length },
      review: reviews.slice(0, 10).map(r => ({ '@type': 'Review', author: { '@type': 'Person', name: r.author_name }, reviewRating: { '@type': 'Rating', ratingValue: r.rating }, reviewBody: r.body, datePublished: r.created_at.slice(0, 10) })),
    } : {}),
  };

  return (
    <div className="ag-view">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, '\\u003c') }} />
      <div className="ag-pv ag-pv-product">
        {items.length ? <ProductGallery items={items} name={p.name} /> : <div className="ag-pv-stage" />}
        <div className="ag-pv-info">
          <Link className="ag-mono ag-crumb" href="/redesign/collection">Collection / {KIND_LABEL[p.kind]}</Link>
          <h1 className={`ag-d ag-pv-title${p.name.length > 14 ? ' ag-long' : ''}`}>{p.name}</h1>
          <p className="ag-status-row"><StatusBadge status={p.stock_status} /></p>
          {reviews.length > 0 && <p className="ag-mono"><span className="ag-stars">{'★'.repeat(Math.round(avg))}<i>{'★'.repeat(5 - Math.round(avg))}</i></span> {avg.toFixed(1)} · {reviews.length} review{reviews.length > 1 ? 's' : ''}</p>}
          {p.price != null && <p className="ag-price">{new Intl.NumberFormat('en-US', { style: 'currency', currency: p.currency }).format(p.price)}</p>}
          <div className="ag-pv-desc ag-prose">{p.description ? <Markdown text={p.description} /> : <p>{p.details}</p>}</div>
          {spec.length > 0 && <dl className="ag-spec">{spec.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>}
          <div className="ag-pv-cta">
            <Link className="ag-btn ag-pri" href={CONTACT_URL}>Ask about this piece</Link>
            <Link className="ag-btn" href="/redesign/collection">Back to collection</Link>
          </div>
          <p className="ag-small ag-pv-note">{CERT_NOTE}</p>
        </div>
      </div>
      <section className="ag-band" aria-labelledby="ag-h-rev">
        <div className="ag-wrap ag-reviews">
          <div className="ag-sec-head"><div><h2 className="ag-d" id="ag-h-rev">Reviews</h2></div><p>{reviews.length ? `${avg.toFixed(1)} out of 5 from ${reviews.length} customer${reviews.length > 1 ? 's' : ''}.` : 'No reviews yet.'}</p></div>
          <div className="ag-rev-grid">
            <div className="ag-rev-list">
              {reviews.map(r => (
                <article className="ag-rev ag-perk" key={r.id}>
                  <span className="ag-stars" aria-label={`${r.rating} out of 5`}>{'★'.repeat(r.rating)}<i>{'★'.repeat(5 - r.rating)}</i></span>
                  {r.title && <h3>{r.title}</h3>}
                  <p>{r.body}</p>
                  <p className="ag-mono">{r.author_name} · {new Date(r.created_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</p>
                </article>
              ))}
            </div>
            <div className="ag-form-card"><h3 className="ag-d" style={{ fontSize: 30 }}>Write a review</h3><ReviewForm productId={p.id} slug={p.slug} /></div>
          </div>
        </div>
      </section>
    </div>
  );
}
