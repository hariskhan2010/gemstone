import Link from 'next/link';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import { requireAdmin } from '@/lib/auth/admin';
import ProductEditor from '@/components/gems/admin/ProductEditor';
import type { Product, Media, Article } from '@/lib/products/types';

export default async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  const { supabase } = await requireAdmin();
  const [{ data: p }, { data: media }, { data: article }] = await Promise.all([
    supabase.from('products').select('*').eq('id', id).maybeSingle(),
    supabase.from('product_media').select('*').eq('product_id', id).order('position'),
    supabase.from('articles').select('*').eq('product_id', id).maybeSingle(),
  ]);
  if (!p) notFound();
  const product = p as Product;
  return (
    <>
      <p className="ag-crumbs"><Link href="/redesign/admin">Products</Link> / {product.name} · <Link href={`/redesign/products/${product.slug}`} target="_blank">View live page ↗</Link></p>
      <ProductEditor product={product} media={(media ?? []) as Media[]} article={article as Article | null} />
    </>
  );
}
