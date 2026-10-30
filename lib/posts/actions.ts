'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/admin';
import { POST_BUCKET } from '@/lib/supabase/public';
import { slugify } from '@/lib/products/types';

export type PostState = { ok?: boolean; error?: string; id?: string; message?: string } | null;
const str = (fd: FormData, k: string) => String(fd.get(k) ?? '').trim();
const refresh = (slug?: string) => {
  revalidatePath('/redesign/blog'); revalidatePath('/redesign/admin/posts'); revalidatePath('/redesign/sitemap.xml');
  if (slug) revalidatePath(`/redesign/blog/${slug}`);
};

/** Every post action calls requireAdmin() first; the database policies (public.is_admin()) enforce the same rule again. */
export async function savePost(_: PostState, fd: FormData): Promise<PostState> {
  const { supabase } = await requireAdmin();
  const id = str(fd, 'id') || undefined;
  const title = str(fd, 'title');
  if (title.length < 3) return { error: 'Add a title (at least 3 characters).' };
  const status = str(fd, 'status') === 'published' ? 'published' : 'draft';
  const cover = str(fd, 'cover_path');
  if (cover && !/^posts\/[A-Za-z0-9._-]+\.[a-z0-9]+$/.test(cover)) return { error: 'Invalid cover photo path.' };
  const productId = str(fd, 'product_id');
  if (productId && !/^[0-9a-f-]{36}$/i.test(productId)) return { error: 'Invalid linked stock item.' };

  let existing: { slug: string; status: string; published_at: string | null; cover_path: string | null } | null = null;
  if (id) {
    const { data } = await supabase.from('posts').select('slug, status, published_at, cover_path').eq('id', id).maybeSingle();
    if (!data) return { error: 'Post not found.' };
    existing = data;
  }
  const row = {
    title, topic: str(fd, 'topic').slice(0, 60) || null, summary: str(fd, 'summary').slice(0, 400), body: str(fd, 'body').slice(0, 60000),
    cover_path: cover || null, product_id: productId || null, status,
    published_at: status === 'published' ? (existing?.published_at ?? new Date().toISOString()) : existing?.published_at ?? null,
    updated_at: new Date().toISOString(),
  };
  if (existing) {
    const { error } = await supabase.from('posts').update(row).eq('id', id!);
    if (error) return { error: `Could not save: ${error.message}` };
    if (existing.cover_path && existing.cover_path !== row.cover_path) await supabase.storage.from(POST_BUCKET).remove([existing.cover_path]);
    refresh(existing.slug); return { ok: true, id, message: status === 'published' ? 'Saved and published.' : 'Saved as draft.' };
  }
  let slug = slugify(title);
  for (let i = 2; i < 50; i++) {
    const { data } = await supabase.from('posts').select('id').eq('slug', slug).maybeSingle();
    if (!data) break;
    slug = `${slugify(title)}-${i}`;
  }
  const { data, error } = await supabase.from('posts').insert({ ...row, slug }).select('id').single();
  if (error || !data) return { error: `Could not create: ${error?.message ?? 'unknown error'}` };
  refresh(slug); return { ok: true, id: data.id, message: status === 'published' ? 'Published.' : 'Saved as draft.' };
}

export async function deletePost(id: string) {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from('posts').select('cover_path, slug').eq('id', id).maybeSingle();
  if (data?.cover_path) await supabase.storage.from(POST_BUCKET).remove([data.cover_path]);
  await supabase.from('posts').delete().eq('id', id);
  refresh(data?.slug); redirect('/redesign/admin/posts');
}
