import Link from 'next/link';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import { requireAdmin } from '@/lib/auth/admin';
import PostEditor from '@/components/gems/admin/PostEditor';
import type { Post } from '@/lib/products/types';

export default async function EditPost({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  const { supabase } = await requireAdmin();
  const [{ data: p }, { data: prods }] = await Promise.all([
    supabase.from('posts').select('*').eq('id', id).maybeSingle(),
    supabase.from('products').select('id, name').order('name'),
  ]);
  if (!p) notFound();
  const post = p as Post;
  return (
    <>
      <p className="ag-crumbs"><Link href="/redesign/admin/posts">Blog posts</Link> / {post.title}{post.status === 'published' && <> · <Link href={`/redesign/blog/${post.slug}`} target="_blank">View live post ↗</Link></>}</p>
      <PostEditor post={post} products={prods ?? []} />
    </>
  );
}
