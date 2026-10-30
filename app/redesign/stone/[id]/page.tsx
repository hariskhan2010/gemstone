import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import StoneViewer from '@/components/gems/StoneViewer';
import StoneCard, { WaysGrid } from '@/components/gems/StoneCard';
import { STONES, CATNAME, CERT_NOTE, CONTACT_URL, stoneById } from '@/lib/gems/stones';

export function generateStaticParams() {
  return STONES.map(s => ({ id: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const s = stoneById(id);
  return s ? { title: `${s.name} · Asian Gemstone`, description: s.desc } : {};
}

export default async function StonePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = stoneById(id);
  if (!s) notFound();
  const req = s.cat === 'gemstone' ? 'Request this stone' : s.cat === 'jewelry' ? 'Request a piece' : 'Request a carving';
  return (
    <>
      <div className="ag-pv">
        <StoneViewer id={s.id} name={s.name} wash={s.wash} />
        <div className="ag-pv-info">
          <Link className="ag-mono ag-crumb" href="/redesign/collection">Collection / {CATNAME[s.cat]}</Link>
          <h1 className={`ag-d ag-pv-title${s.name.length > 14 ? ' ag-long' : ''}`}>{s.name}</h1>
          <p className="ag-mono">{s.family}{s.origin ? ` · Origin: ${s.origin}` : ''}</p>
          <p className="ag-pv-desc">{s.desc}</p>
          <dl className="ag-spec">{s.spec.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
          <div className="ag-pv-cta">
            {/* When real listings exist, replace this with your cart: const { addToCart } = useCart(); addToCart(product) */}
            <Link className="ag-btn ag-pri" href={CONTACT_URL}>{req}</Link>
            <Link className="ag-btn" href="/redesign/collection">Back to collection</Link>
          </div>
          <p className="ag-small ag-pv-note">{s.note || CERT_NOTE}</p>
          <p className="ag-small ag-pv-note"><b style={{ color: 'var(--ag-fg)', fontWeight: 500 }}>How a request works:</b> contact us with your requirements and our team will help you find or custom-source the right stone.</p>
        </div>
      </div>
      <section className="ag-band" aria-labelledby="ag-h-pways">
        <div className="ag-wrap">
          <div className="ag-sec-head"><div><h2 className="ag-d" id="ag-h-pways">Ways to wear it</h2></div><p>Loose, set by hand in silver, gold or brass, or carved to order.</p></div>
          <WaysGrid />
        </div>
      </section>
      <section className="ag-band ag-wash-c" aria-labelledby="ag-h-care">
        <div className="ag-wrap">
          <div className="ag-sec-head"><div><h2 className="ag-d" id="ag-h-care">Care and trust</h2></div><p /></div>
          <div className="ag-perks">
            <div className="ag-perk"><span className="ag-mono">Natural</span><h3>100% natural</h3><p>Every stone we sell is 100% natural and untreated unless clearly stated. We never sell synthetics or simulants as natural.</p></div>
            <div className="ag-perk"><span className="ag-mono">Certificates</span><h3>GIA / IGI on request</h3><p>Independent gemological certificates are available on request for an additional fee.</p></div>
            <div className="ag-perk"><span className="ag-mono">Cleaning</span><h3>Gentle care</h3><p>Use mild soap, lukewarm water, and a soft brush. Never use ultrasonic cleaners.</p></div>
            <div className="ag-perk"><span className="ag-mono">Shipping</span><h3>Worldwide</h3><p>Tracked delivery to most countries, typically in 7 to 14 days.</p></div>
          </div>
        </div>
      </section>
      <section className="ag-band" aria-labelledby="ag-h-more">
        <div className="ag-wrap">
          <div className="ag-sec-head"><div><h2 className="ag-d" id="ag-h-more">More from the collection</h2></div><p /></div>
          <div className="ag-grid">{STONES.filter(o => o.id !== s.id).slice(0, 4).map(o => <StoneCard key={o.id} s={o} />)}</div>
        </div>
      </section>
    </>
  );
}
