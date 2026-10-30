import { createPublicClient } from '@/lib/supabase/public';
import type { Product, Media, Article, Review, Post } from './types';

/** Public reads. Row level security only returns published items and approved reviews. All return empty when Supabase is not configured. */
export async function listProducts(): Promise<(Product & { media: Media[] })[]> {
  const sb = createPublicClient(); if (!sb) return [];
  const { data } = await sb.from('products').select('*, media:product_media(*)').eq('status', 'published').order('created_at', { ascending: false });
  return ((data ?? []) as (Product & { media: Media[] })[]).map(p => ({ ...p, media: [...p.media].sort((a, b) => a.position - b.position) }));
}
export async function getProduct(slug: string) {
  const sb = createPublicClient(); if (!sb) return null;
  const { data } = await sb.from('products').select('*, media:product_media(*)').eq('slug', slug).eq('status', 'published').maybeSingle();
  if (!data) return null;
  const p = data as Product & { media: Media[] };
  p.media = [...p.media].sort((a, b) => a.position - b.position);
  return p;
}
export async function approvedReviews(productId: string): Promise<Review[]> {
  const sb = createPublicClient(); if (!sb) return [];
  const { data } = await sb.from('reviews').select('id, product_id, author_name, rating, title, body, status, created_at').eq('product_id', productId).eq('status', 'approved').order('created_at', { ascending: false });
  return (data ?? []) as Review[];
}
export async function listArticles(): Promise<Article[]> {
  const sb = createPublicClient(); if (!sb) return [];
  const { data } = await sb.from('articles').select('*').eq('status', 'published').order('published_at', { ascending: false }).limit(60);
  return (data ?? []) as Article[];
}
export async function getArticle(slug: string) {
  const sb = createPublicClient(); if (!sb) return null;
  const { data } = await sb.from('articles').select('*, product:products(slug, name)').eq('slug', slug).eq('status', 'published').maybeSingle();
  return data as (Article & { product: { slug: string; name: string } | null }) | null;
}

/** Blog posts written in the admin panel. RLS returns published rows only for the public client. */
export async function listPosts(): Promise<Post[]> {
  const sb = createPublicClient(); if (!sb) return [];
  const { data } = await sb.from('posts').select('*').eq('status', 'published').order('published_at', { ascending: false }).limit(60);
  return (data ?? []) as Post[];
}
export async function getPost(slug: string) {
  const sb = createPublicClient(); if (!sb) return null;
  const { data } = await sb.from('posts').select('*, product:products(slug, name, stock_status)').eq('slug', slug).eq('status', 'published').maybeSingle();
  return data as (Post & { product: { slug: string; name: string; stock_status: Product['stock_status'] } | null }) | null;
}
