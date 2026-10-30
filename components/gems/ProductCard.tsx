import Link from 'next/link';
import { mediaUrl } from '@/lib/supabase/public';
import StatusBadge from '@/components/gems/StatusBadge';
import { KIND_LABEL, type Product, type Media } from '@/lib/products/types';

/** Card for a real product uploaded from the admin panel. */
export default function ProductCard({ p }: { p: Product & { media: Media[] } }) {
  const cover = p.media.find(m => m.kind === 'image');
  const tags = [p.carat != null ? `${p.carat} ct` : null, p.origin, p.model_kind !== 'none' ? '3D view' : null].filter(Boolean) as string[];
  return (
    <Link className="ag-card" href={`/redesign/products/${p.slug}`}>
      <div className="ag-thumb ag-thumb-photo" style={{ ['--w' as string]: '120,90,200' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {cover ? <img src={mediaUrl(cover.path)} alt={cover.alt || p.name} loading="lazy" /> : <span className="ag-mono">Photo coming soon</span>}
      </div>
      <div className="ag-c-body">
        <span className="ag-mono">{KIND_LABEL[p.kind]}</span>
        <h3>{p.name}</h3>
        <StatusBadge status={p.stock_status} />
        {p.seo_description && <p>{p.seo_description}</p>}
        {tags.length > 0 && <div className="ag-tags">{tags.map(t => <span className="ag-tag" key={t}>{t}</span>)}</div>}
        <span className="ag-more">View piece <span aria-hidden="true">→</span></span>
      </div>
    </Link>
  );
}
