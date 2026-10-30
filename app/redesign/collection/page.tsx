import type { Metadata } from 'next';
import Link from 'next/link';
import CollectionGrid from '@/components/gems/CollectionGrid';
import ProductCard from '@/components/gems/ProductCard';
import { listProducts } from '@/lib/products/queries';
import { CONTACT_URL, type StoneCategory } from '@/lib/gems/stones';

export const metadata: Metadata = {
  title: 'Our collection · Asian Gemstone',
  description: 'Loose emerald, ruby, sapphire and amethyst, rings made to order, and stones carved by hand.',
};

const CATS: StoneCategory[] = ['gemstone', 'jewelry', 'carved'];

export default async function CollectionPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const initial = CATS.includes(category as StoneCategory) ? (category as StoneCategory) : 'all';
  const products = (await listProducts()).filter(p => initial === 'all' || p.kind === initial);
  return (
    <>
      <header className="ag-col-head">
        <p className="ag-eyebrow-l"><span className="ag-grad">100% natural gemstones, hand-selected from Asian mines</span></p>
        <h1 className="ag-d">Our collection</h1>
        <p className="ag-lede">Loose emerald, ruby, sapphire and amethyst, rings made to order, and stones carved by hand.</p>
      </header>
      {products.length > 0 && (
        <section className="ag-band" style={{ paddingTop: 8 }} aria-labelledby="ag-h-avail">
          <div className="ag-wrap">
            <div className="ag-sec-head"><div><h2 className="ag-d" id="ag-h-avail">Available now</h2></div><p>Real pieces in the shop, with photos, videos and 3D.</p></div>
            <div className="ag-grid">{products.map(p => <ProductCard key={p.id} p={p} />)}</div>
          </div>
        </section>
      )}
      <div className="ag-band" style={{ paddingTop: 8 }}>
        <div className="ag-wrap">{products.length > 0 && <h2 className="ag-d" style={{ fontSize: 'clamp(28px,3.4vw,52px)', marginBottom: 24 }}>Stones we work with</h2>}<CollectionGrid initial={initial} /></div>
      </div>
      <section className="ag-band">
        <div className="ag-wrap ag-cta-band">
          <div>
            <h2 className="ag-d">Can I request a<br /><span className="ag-grad">specific stone or size?</span></h2>
            <p className="ag-small" style={{ maxWidth: '52ch', marginTop: 14 }}>Absolutely. Contact us with your requirements and our team will help you find or custom-source the right stone.</p>
          </div>
          <div className="ag-acts"><Link className="ag-btn ag-pri" href={CONTACT_URL}>Request a stone</Link></div>
        </div>
      </section>
    </>
  );
}
