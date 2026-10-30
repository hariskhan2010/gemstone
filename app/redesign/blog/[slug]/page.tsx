import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPost } from '@/lib/products/queries';
import { Markdown } from '@/lib/products/markdown';
import { postMediaUrl } from '@/lib/supabase/public';
import StatusBadge from '@/components/gems/StatusBadge';

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = await getPost((await params).slug);
  if (!p) return {};
  return {
    title: `${p.title} · Asian Gemstone`, description: p.summary || undefined, alternates: { canonical: `/redesign/blog/${p.slug}` },
    openGraph: { type: 'article', title: p.title, description: p.summary, images: p.cover_path ? [{ url: postMediaUrl(p.cover_path) }] : undefined },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = await getPost((await params).slug);
  if (!p) notFound();
  const ld = { '@context': 'https://schema.org', '@type': 'Article', headline: p.title, description: p.summary, datePublished: p.published_at, dateModified: p.updated_at, image: p.cover_path ? postMediaUrl(p.cover_path) : undefined, author: { '@type': 'Organization', name: 'Asian Gemstone' }, publisher: { '@type': 'Organization', name: 'Asian Gemstone' } };
  return (
    <article className="ag-page-hero ag-view ag-article">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, '\\u003c') }} />
      <div className="ag-glow" />
      <p className="ag-eyebrow-l"><Link href="/redesign/blog"><span className="ag-grad">Journal</span></Link>{p.topic ? ` · ${p.topic}` : ''}</p>
      <h1 className="ag-d">{p.title}</h1>
      {p.published_at && <p className="ag-mono">{new Date(p.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>}
      {p.summary && <p className="ag-lede">{p.summary}</p>}
      {p.cover_path && (/* eslint-disable-next-line @next/next/no-img-element */
        <img className="ag-post-cover" src={postMediaUrl(p.cover_path)} alt="" />
      )}
      <div className="ag-prose"><Markdown text={p.body} /></div>
      {p.product && (
        <div className="ag-cta-band" style={{ marginTop: 48 }}>
          <div><span className="ag-mono">Featured stone</span><h2 className="ag-d">{p.product.name}</h2><p className="ag-status-row" style={{ marginTop: 12 }}><StatusBadge status={p.product.stock_status} /></p></div>
          <div className="ag-acts"><Link className="ag-btn ag-pri" href={`/redesign/products/${p.product.slug}`}>See the stone</Link></div>
        </div>
      )}
    </article>
  );
}
