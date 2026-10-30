'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/admin';
import { createClient } from '@/lib/supabase/server';
import { BUCKET, mediaUrl } from '@/lib/supabase/public';
import { aiConfigured } from '@/lib/ai';
import { writeProductCopy } from './writer';
import { startMeshy, getMeshy, meshyConfigured } from './meshy';
import { slugify, GEM_CUTS, type Product, type Kind, type GemCut } from './types';

export type AdminState = { ok?: boolean; error?: string; id?: string; message?: string } | null;
const str = (fd: FormData, k: string) => String(fd.get(k) ?? '').trim();
const num = (fd: FormData, k: string) => { const v = str(fd, k); if (!v) return null; const n = Number(v); return Number.isFinite(n) && n >= 0 ? n : null; };
const refresh = (slug?: string) => {
  revalidatePath('/redesign/collection'); revalidatePath('/redesign/blog'); revalidatePath('/redesign/admin');
  if (slug) revalidatePath(`/redesign/products/${slug}`);
};

async function uniqueSlug(sb: NonNullable<Awaited<ReturnType<typeof createClient>>>, table: 'products' | 'articles', base: string, exceptId?: string) {
  let slug = slugify(base);
  for (let i = 2; i < 50; i++) {
    const { data } = await sb.from(table).select('id').eq('slug', slug).maybeSingle();
    if (!data || data.id === exceptId) return slug;
    slug = `${slugify(base)}-${i}`;
  }
  return `${slugify(base)}-${Date.now().toString(36)}`;
}

/* ---------------- products ---------------- */
export async function saveProduct(_: AdminState, fd: FormData): Promise<AdminState> {
  const { supabase } = await requireAdmin();
  const id = str(fd, 'id') || undefined;
  const name = str(fd, 'name'), kind = str(fd, 'kind') as Kind;
  if (name.length < 2) return { error: 'Add a product name.' };
  if (!['gemstone', 'jewelry', 'carved'].includes(kind)) return { error: 'Choose a product type.' };
  const cut = str(fd, 'gem_cut') as GemCut, color = str(fd, 'gem_color');
  const want3d = fd.get('want_3d') === 'on';
  const isGem = kind === 'gemstone' && GEM_CUTS.some(([c]) => c === cut);
  const stock = str(fd, 'stock_status');
  const row = {
    name, kind, family: str(fd, 'family').slice(0, 80) || null, stock_status: ['in', 'res', 'sold', 'mto'].includes(stock) ? stock : 'in', details: str(fd, 'details').slice(0, 6000),
    carat: num(fd, 'carat'), origin: str(fd, 'origin') || null, treatment: str(fd, 'treatment') || null,
    dimensions: str(fd, 'dimensions') || null, price: num(fd, 'price'), currency: (str(fd, 'currency') || 'USD').toUpperCase().slice(0, 3),
    status: fd.get('hidden') === 'on' ? 'hidden' : 'published',
    model_kind: isGem ? 'gem' : want3d ? 'mesh' : 'none',
    gem_cut: isGem ? cut : null, gem_color: isGem && /^#[0-9a-fA-F]{6}$/.test(color) ? color : null,
    updated_at: new Date().toISOString(),
  };
  if (id) {
    const { error } = await supabase.from('products').update(row).eq('id', id);
    if (error) return { error: `Could not save: ${error.message}` };
    refresh(); return { ok: true, id, message: 'Saved.' };
  }
  const slug = await uniqueSlug(supabase, 'products', name);
  const { data, error } = await supabase.from('products').insert({ ...row, slug, ai_status: 'pending' }).select('id').single();
  if (error || !data) return { error: `Could not create: ${error?.message ?? 'unknown error'}` };
  refresh(); return { ok: true, id: data.id, message: 'Created.' };
}

export async function addMedia(productId: string, items: { path: string; kind: 'image' | 'video' }[]) {
  const { supabase } = await requireAdmin();
  const { data: last } = await supabase.from('product_media').select('position').eq('product_id', productId).order('position', { ascending: false }).limit(1).maybeSingle();
  let pos = (last?.position ?? -1) + 1;
  const rows = items.filter(i => i.path.startsWith(`products/${productId}/`)).map(i => ({ product_id: productId, kind: i.kind, path: i.path, position: pos++ }));
  if (rows.length) { const { error } = await supabase.from('product_media').insert(rows); if (error) throw new Error(error.message); }
  refresh();
}

export async function deleteMedia(mediaId: string) {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from('product_media').select('path').eq('id', mediaId).maybeSingle();
  if (data?.path) await supabase.storage.from(BUCKET).remove([data.path]);
  await supabase.from('product_media').delete().eq('id', mediaId);
  refresh();
}

export async function moveMedia(mediaId: string, dir: -1 | 1) {
  const { supabase } = await requireAdmin();
  const { data: m } = await supabase.from('product_media').select('id, product_id, position').eq('id', mediaId).maybeSingle();
  if (!m) return;
  const { data: all } = await supabase.from('product_media').select('id, position').eq('product_id', m.product_id).order('position');
  const list = all ?? []; const i = list.findIndex(x => x.id === mediaId), j = i + dir;
  if (j < 0 || j >= list.length) return;
  [list[i], list[j]] = [list[j], list[i]];
  await Promise.all(list.map((x, k) => supabase.from('product_media').update({ position: k }).eq('id', x.id)));
  refresh();
}

export async function deleteProduct(productId: string) {
  const { supabase } = await requireAdmin();
  const { data: media } = await supabase.from('product_media').select('path').eq('product_id', productId);
  const { data: p } = await supabase.from('products').select('model_path').eq('id', productId).maybeSingle();
  const paths = [...(media ?? []).map(m => m.path), ...(p?.model_path ? [p.model_path] : [])];
  if (paths.length) await supabase.storage.from(BUCKET).remove(paths);
  await supabase.from('products').delete().eq('id', productId);
  refresh(); redirect('/redesign/admin');
}

/** Owner edits to the AI text. */
export async function saveCopy(_: AdminState, fd: FormData): Promise<AdminState> {
  const { supabase } = await requireAdmin();
  const id = str(fd, 'id');
  const { error } = await supabase.from('products').update({
    description: str(fd, 'description'), seo_title: str(fd, 'seo_title').slice(0, 70), seo_description: str(fd, 'seo_description').slice(0, 170),
    keywords: str(fd, 'keywords').split(',').map(s => s.trim()).filter(Boolean).slice(0, 12), updated_at: new Date().toISOString(),
  }).eq('id', id);
  if (error) return { error: error.message };
  refresh(); return { ok: true, message: 'Text saved.' };
}

/* ---------------- AI writing (published automatically) ---------------- */
export async function generateCopy(productId: string): Promise<AdminState> {
  const { supabase } = await requireAdmin();
  const ai = aiConfigured();
  if (!ai.ok) { await supabase.from('products').update({ ai_status: 'off', ai_error: ai.reason }).eq('id', productId); return { error: ai.reason }; }
  const { data } = await supabase.from('products').select('*').eq('id', productId).single();
  if (!data) return { error: 'Product not found.' };
  const p = data as Product;
  await supabase.from('products').update({ ai_status: 'working', ai_error: null }).eq('id', productId);
  try {
    const c = await writeProductCopy(p);
    await supabase.from('products').update({ description: c.description, seo_title: c.seo_title, seo_description: c.seo_description, keywords: c.keywords, ai_status: 'done', updated_at: new Date().toISOString() }).eq('id', productId);
    const { data: existing } = await supabase.from('articles').select('id').eq('product_id', productId).maybeSingle();
    const art = { title: c.article.title, excerpt: c.article.excerpt, body: c.article.body, seo_title: c.article.seo_title, seo_description: c.article.seo_description, status: 'published', updated_at: new Date().toISOString() };
    if (existing) await supabase.from('articles').update(art).eq('id', existing.id);
    else await supabase.from('articles').insert({ ...art, product_id: productId, slug: await uniqueSlug(supabase, 'articles', c.article.slug_hint || c.article.title) });
    refresh(p.slug);
    return { ok: true, message: 'Description, SEO and article written and published.' };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'AI error';
    await supabase.from('products').update({ ai_status: 'failed', ai_error: msg.slice(0, 500) }).eq('id', productId);
    return { error: msg };
  }
}

/* ---------------- 3D for rings and carvings (Meshy) ---------------- */
export async function start3D(productId: string): Promise<AdminState> {
  const { supabase } = await requireAdmin();
  if (!meshyConfigured()) return { error: 'MESHY_API_KEY is not set, so photo-to-3D is off.' };
  const { data: imgs } = await supabase.from('product_media').select('path').eq('product_id', productId).eq('kind', 'image').order('position').limit(4);
  if (!imgs?.length) return { error: 'Upload at least one photo first (2–4 angles work best; the first is the front).' };
  try {
    const task = await startMeshy(imgs.map(i => mediaUrl(i.path)));
    await supabase.from('products').update({ meshy_task_id: task, model_status: 'working', model_kind: 'mesh' }).eq('id', productId);
    refresh(); return { ok: true, message: '3D model started. It usually takes a few minutes.' };
  } catch (e) { return { error: e instanceof Error ? e.message : 'Could not start 3D.' }; }
}

/** Polled by the admin page while a model is being built. Saves the finished GLB into storage (Meshy links expire). */
export async function check3D(productId: string): Promise<{ status: string; progress?: number; error?: string }> {
  const { supabase } = await requireAdmin();
  const { data: p } = await supabase.from('products').select('slug, meshy_task_id, model_status').eq('id', productId).maybeSingle();
  if (!p?.meshy_task_id || p.model_status !== 'working') return { status: p?.model_status ?? 'none' };
  try {
    const t = await getMeshy(p.meshy_task_id);
    if (t.status === 'SUCCEEDED' && t.model_urls?.glb) {
      const glb = await fetch(t.model_urls.glb);
      if (!glb.ok) throw new Error('Could not download the model.');
      const path = `models/${productId}.glb`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, await glb.arrayBuffer(), { contentType: 'model/gltf-binary', upsert: true });
      if (error) throw new Error(error.message);
      await supabase.from('products').update({ model_path: path, model_status: 'done' }).eq('id', productId);
      refresh(p.slug); return { status: 'done' };
    }
    if (t.status === 'FAILED' || t.status === 'CANCELED') {
      await supabase.from('products').update({ model_status: 'failed' }).eq('id', productId);
      return { status: 'failed', error: t.task_error?.message };
    }
    return { status: 'working', progress: t.progress };
  } catch (e) { return { status: 'working', error: e instanceof Error ? e.message : 'error' }; }
}

/* ---------------- reviews ---------------- */
export async function setReviewStatus(reviewId: string, status: 'approved' | 'rejected') {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from('reviews').update({ status }).eq('id', reviewId).select('product:products(slug)').maybeSingle();
  const slug = (data?.product as unknown as { slug?: string } | null)?.slug;
  refresh(slug); revalidatePath('/redesign/admin/reviews');
}
export async function deleteReview(reviewId: string) {
  const { supabase } = await requireAdmin();
  await supabase.from('reviews').delete().eq('id', reviewId);
  revalidatePath('/redesign/admin/reviews');
}

/** Customers: one review per product, shown after the owner approves it. */
export async function submitReview(_: AdminState, fd: FormData): Promise<AdminState> {
  const supabase = await createClient();
  if (!supabase) return { error: 'Reviews are not available yet.' };
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Please sign in to write a review.' };
  const productId = str(fd, 'product_id'), rating = Number(str(fd, 'rating')), title = str(fd, 'title'), body = str(fd, 'body');
  const author = str(fd, 'author_name') || (typeof user.user_metadata?.full_name === 'string' ? user.user_metadata.full_name : '') || 'Customer';
  if (!(rating >= 1 && rating <= 5)) return { error: 'Choose a star rating.' };
  if (body.length < 10) return { error: 'Write at least a sentence about the stone.' };
  if (body.length > 2000) return { error: 'Keep the review under 2,000 characters.' };
  const { error } = await supabase.from('reviews').insert({ product_id: productId, rating, title: title.slice(0, 100) || null, body, author_name: author.slice(0, 60) });
  if (error) return { error: error.code === '23505' ? 'You have already reviewed this product.' : 'Could not send your review. Please try again.' };
  return { ok: true, message: 'Thank you. Your review will appear once the shop approves it.' };
}
