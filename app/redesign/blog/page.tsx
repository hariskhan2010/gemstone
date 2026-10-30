import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { postMediaUrl } from '@/lib/supabase/public';
import { thumbSrc, type ModelKey } from '@/lib/gems/stones';
import { listArticles, listPosts } from '@/lib/products/queries';

export const metadata: Metadata = {
  title: 'Gemstone guides · Asian Gemstone',
  description: 'Meanings, care, and custom carving: practical gemstone guides.',
};

/** The articles themselves live on your existing /blog routes; this page is the redesigned index. */
const POSTS: { slug: string; title: string; excerpt: string; kicker: string; thumb: ModelKey; wash: string; feature?: boolean }[] = [
  { slug: 'custom-engraved-stones', title: 'Custom Engraved Stones: Ideas & How to Order', kicker: 'Custom carving', thumb: 'carved', wash: '60,170,120', feature: true,
    excerpt: 'Custom engraved stones make unforgettable personalized gifts. Explore engraving ideas, the best stones to carve, and how to order your piece from Asian artisans.' },
  { slug: 'how-to-clean-gemstone-jewelry', title: 'How to Clean Gemstone Jewelry Safely', kicker: 'Care · 21 Aug 2026', thumb: 'rings', wash: '240,180,90',
    excerpt: 'Learn how to clean gemstone jewelry at home without damage. Safe methods for soft stones like opal, turquoise, and pearl versus hardy stones.' },
  { slug: 'gemstone-meanings', title: 'Gemstone Meanings by Stone & Birth Month', kicker: 'Meanings · 21 Aug 2026', thumb: 'amethyst', wash: '160,90,255',
    excerpt: 'Discover what each gemstone means — from amethyst to turquoise — and find your birthstone. A plain-English guide to gemstone symbolism and gifting.' },
];

export const revalidate = 300;

export default async function BlogPage() {
  const [articles, posts] = await Promise.all([listArticles(), listPosts()]);
  return (
    <div className="ag-view">
      <div className="ag-page-hero"><div className="ag-glow" />
        <p className="ag-eyebrow-l"><span className="ag-grad">Journal</span></p>
        <h1 className="ag-d">Gemstone<br />guides</h1>
        <p className="ag-lede">Meanings, care, and custom carving: practical guides written by the same people who source, cut, and carve every stone we sell.</p>
      </div>
      {posts.length > 0 && (
        <section className="ag-band" style={{ paddingTop: 8 }} aria-label="Latest posts">
          <div className="ag-wrap ag-posts">
            {posts.map(p => (
              <Link key={p.id} className="ag-post" href={`/redesign/blog/${p.slug}`}>
                <div className="ag-thumb">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {p.cover_path ? <img src={postMediaUrl(p.cover_path)} alt="" loading="lazy" /> : null}
                </div>
                <div className="ag-c-body">
                  <span className="ag-mono">{[p.topic, p.published_at ? new Date(p.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : null].filter(Boolean).join(' · ')}</span>
                  <h3>{p.title}</h3>
                  <p>{p.summary}</p>
                  <span className="ag-more">Read post <span aria-hidden="true">→</span></span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
      {articles.length > 0 && (
        <section className="ag-band" style={{ paddingTop: 8 }} aria-label="New articles">
          <div className="ag-wrap ag-art-list">
            {articles.map(a => (
              <Link key={a.id} className="ag-art-row" href={`/redesign/articles/${a.slug}`}>
                <span className="ag-mono">{new Date(a.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                <h3>{a.title}</h3><p>{a.excerpt}</p><span className="ag-more">Read <span aria-hidden="true">→</span></span>
              </Link>
            ))}
          </div>
        </section>
      )}
      <section className="ag-band" style={{ paddingTop: 8 }} aria-label="Articles">
        <div className="ag-wrap ag-posts">
          {POSTS.map(p => (
            <Link key={p.slug} className={`ag-post${p.feature ? ' ag-feature' : ''}`} href={`/blog/${p.slug}`}>
              <div className="ag-thumb" style={{ ['--w' as string]: p.wash }}><Image src={thumbSrc(p.thumb)} alt="" width={800} height={600} /></div>
              <div className="ag-c-body">
                {p.feature ? <span className="ag-kicker"><span className="ag-pill">Latest</span><span className="ag-mono">{p.kicker}</span></span> : <span className="ag-mono">{p.kicker}</span>}
                <h3>{p.title}</h3>
                <p>{p.excerpt}</p>
                <span className="ag-more">Read article <span aria-hidden="true">→</span></span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
