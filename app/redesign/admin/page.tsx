import Link from 'next/link';
import { connection } from 'next/server';
import { requireAdmin } from '@/lib/auth/admin';
import { mediaUrl } from '@/lib/supabase/public';
import { aiConfigured } from '@/lib/ai';
import { meshyConfigured } from '@/lib/products/meshy';
import StatusBadge from '@/components/gems/StatusBadge';
import { KIND_LABEL, type Product, type Media } from '@/lib/products/types';

const badge = (s: string) => <span className={`ag-badge ag-b-${s}`}>{s}</span>;

export default async function AdminHome() {
  await connection();
  const { supabase } = await requireAdmin();
  const [{ data }, { count }] = await Promise.all([
    supabase.from('products').select('*, media:product_media(path, kind, position)').order('created_at', { ascending: false }),
    supabase.from('reviews').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
  ]);
  const products = (data ?? []) as (Product & { media: Pick<Media, 'path' | 'kind' | 'position'>[] })[];
  const ai = aiConfigured();
  return (
    <>
      <div className="ag-admin-alerts">
        {!ai.ok && <p className="ag-alert ag-bad">AI writing is off: {ai.reason}</p>}
        {!meshyConfigured() && <p className="ag-alert ag-bad">Photo-to-3D for rings and carvings is off: MESHY_API_KEY is not set. Gemstones still get 3D from the gem engine.</p>}
        {!!count && <p className="ag-alert ag-good"><Link href="/redesign/admin/reviews">{count} review{count > 1 ? 's' : ''} waiting for approval →</Link></p>}
      </div>
      {products.length === 0 ? (
        <div className="ag-empty"><h2 className="ag-d">No products yet</h2><p>Add your first stone: photos, videos and details. The description, SEO and an article are written for you.</p><Link className="ag-btn ag-pri" href="/redesign/admin/products/new">+ New product</Link></div>
      ) : (
        <div className="ag-table" role="table" aria-label="Products">
          <div className="ag-tr ag-th" role="row"><span role="columnheader">Product</span><span role="columnheader">Type</span><span role="columnheader">Text</span><span role="columnheader">3D</span><span role="columnheader">Stock</span></div>
          {products.map(p => {
            const cover = [...p.media].sort((a, b) => a.position - b.position).find(m => m.kind === 'image');
            return (
              <Link className="ag-tr" role="row" key={p.id} href={`/redesign/admin/products/${p.id}`}>
                <span role="cell" className="ag-prod">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {cover ? <img src={mediaUrl(cover.path)} alt="" width={56} height={56} /> : <i className="ag-noimg" />}
                  <b>{p.name}</b>
                </span>
                <span role="cell">{KIND_LABEL[p.kind]}</span>
                <span role="cell">{badge(p.ai_status)}</span>
                <span role="cell">{p.model_kind === 'gem' ? badge('gem') : p.model_kind === 'mesh' ? badge(p.model_status) : '—'}</span>
                <span role="cell"><StatusBadge status={p.stock_status} /> {p.status === 'hidden' && badge('hidden')}</span>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
