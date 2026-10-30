import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticle } from '@/lib/products/queries';
import { Markdown } from '@/lib/products/markdown';

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const a = await getArticle((await params).slug);
  if (!a) return {};
  return { title: a.seo_title || `${a.title} · Asian Gemstone`, description: a.seo_description || a.excerpt, alternates: { canonical: `/redesign/articles/${a.slug}` }, openGraph: { type: 'article', title: a.title, description: a.excerpt } };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const a = await getArticle((await params).slug);
  if (!a) notFound();
  const ld = { '@context': 'https://schema.org', '@type': 'Article', headline: a.title, description: a.excerpt, datePublished: a.published_at, dateModified: a.updated_at, author: { '@type': 'Organization', name: 'Asian Gemstone' }, publisher: { '@type': 'Organization', name: 'Asian Gemstone' } };
  return (
    <article className="ag-page-hero ag-view ag-article">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, '\\u003c') }} />
      <div className="ag-glow" />
      <p className="ag-eyebrow-l"><Link href="/redesign/blog"><span className="ag-grad">Journal</span></Link></p>
      <h1 className="ag-d">{a.title}</h1>
      <p className="ag-mono">{new Date(a.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      <div className="ag-prose"><Markdown text={a.body} /></div>
      {a.product && <div className="ag-cta-band" style={{ marginTop: 48 }}><h2 className="ag-d">{a.product.name}</h2><div className="ag-acts"><Link className="ag-btn ag-pri" href={`/redesign/products/${a.product.slug}`}>See the piece</Link></div></div>}
    </article>
  );
}
