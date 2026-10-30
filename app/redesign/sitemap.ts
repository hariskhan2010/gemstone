import type { MetadataRoute } from 'next';
import { listProducts, listArticles, listPosts } from '@/lib/products/queries';
import { STONES } from '@/lib/gems/stones';

export const revalidate = 3600;
/** /redesign/sitemap.xml. Set NEXT_PUBLIC_SITE_URL to your domain and add this URL in Google Search Console. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://asiangemstone.vercel.app').replace(/\/$/, '');
  const [products, articles, posts] = await Promise.all([listProducts(), listArticles(), listPosts()]);
  const fixed = ['', '/collection', '/about', '/blog', '/contact'].map(p => ({ url: `${base}/redesign${p}`, changeFrequency: 'weekly' as const }));
  return [
    ...fixed,
    ...STONES.map(s => ({ url: `${base}/redesign/stone/${s.id}` })),
    ...products.map(p => ({ url: `${base}/redesign/products/${p.slug}`, lastModified: p.updated_at })),
    ...posts.map(a => ({ url: `${base}/redesign/blog/${a.slug}`, lastModified: a.updated_at })),
    ...articles.map(a => ({ url: `${base}/redesign/articles/${a.slug}`, lastModified: a.updated_at })),
  ];
}
