import type { Metadata } from 'next';
import Link from 'next/link';
import StoneViewer from '@/components/gems/StoneViewer';
import { CONTACT_URL } from '@/lib/gems/stones';

export const metadata: Metadata = {
  title: 'About · Asian Gemstone',
  description: 'Founded in 2003, Asian Gemstone began as a small family business with a passion for rare and beautiful gemstones.',
};

export default function AboutPage() {
  return (
    <div className="ag-view">
      <div className="ag-page-hero"><div className="ag-glow" />
        <div className="ag-split">
          <div>
            <p className="ag-eyebrow-l"><span className="ag-grad">About Asian Gemstone</span></p>
            <h1 className="ag-d">A family<br />business<br /><span className="ag-grad">since 2003</span></h1>
            <p className="ag-lede">Founded in 2003, Asian Gemstone began as a small family business with a passion for rare and beautiful gemstones.</p>
            <div className="ag-acts" style={{ marginTop: 24 }}>
              <Link className="ag-btn ag-pri" href="/redesign/collection">Explore Collection</Link>
              <Link className="ag-btn" href={CONTACT_URL}>Contact us</Link>
            </div>
          </div>
          <StoneViewer id="rough" name="a rough beryl crystal" wash="40,200,130" hint="Rough beryl crystal · 3D render" fit={0.6} />
        </div>
      </div>
      <section className="ag-band" aria-label="Numbers">
        <div className="ag-wrap ag-stats">
          <div className="ag-stat"><b className="ag-grad">2003</b><span className="ag-mono">Founded</span></div>
          <div className="ag-stat"><b className="ag-grad">3</b><span className="ag-mono">Sourcing countries: Pakistan, Thailand, India</span></div>
          <div className="ag-stat"><b className="ag-grad">2–4 wk</b><span className="ag-mono">Custom carving</span></div>
          <div className="ag-stat"><b className="ag-grad">7–14 d</b><span className="ag-mono">Tracked shipping</span></div>
        </div>
      </section>
      <section className="ag-band ag-wash-a" aria-labelledby="ag-h-stand">
        <div className="ag-wrap">
          <div className="ag-sec-head"><div><h2 className="ag-d" id="ag-h-stand">What we stand for</h2></div><p>Integrity, authenticity, craftsmanship, and customer satisfaction guide every decision we make.</p></div>
          <div className="ag-values">
            <div className="ag-perk"><span className="ag-mono">Mission</span><h3>Our mission</h3><p>To provide the finest quality gemstones and jewelry while holding to the highest standards of authenticity, craftsmanship, and service.</p></div>
            <div className="ag-perk"><span className="ag-mono">Knowledge</span><h3>Gemological knowledge</h3><p>Our team includes certified gemologists with decades of combined experience.</p></div>
            <div className="ag-perk"><span className="ag-mono">Craft</span><h3>Craftsmanship</h3><p>Jewelry pieces are crafted by master artisans who combine traditional techniques with modern innovation.</p></div>
          </div>
        </div>
      </section>
      <section className="ag-band ag-wash-b" aria-labelledby="ag-h-asource">
        <div className="ag-wrap">
          <div className="ag-sec-head"><div><p className="ag-eyebrow-l"><span className="ag-grad">Sourcing</span></p><h2 className="ag-d" id="ag-h-asource">From mine to you</h2></div><p>We maintain direct relationships with miners and suppliers worldwide to keep sourcing ethical and traceable.</p></div>
          <div className="ag-steps">
            <div className="ag-step"><span className="ag-mono">Step 01</span><h3>Mine-direct sourcing</h3><p>We buy from trusted mines and licensed dealers across Asia — Pakistan, Thailand, and India — cutting out middlemen.</p></div>
            <div className="ag-step"><span className="ag-mono">Step 02</span><h3>Hand selection</h3><p>Every stone is inspected by hand for color, clarity, and cut. Only the best stones reach our shop.</p></div>
            <div className="ag-step"><span className="ag-mono">Step 03</span><h3>Transparent pricing</h3><p>Natural stones at fair prices, with honest information about origin, treatment, and carat weight.</p></div>
          </div>
        </div>
      </section>
      <section className="ag-band">
        <div className="ag-wrap ag-cta-band">
          <h2 className="ag-d">Every piece starts<br /><span className="ag-grad">as a rough stone.</span></h2>
          <div className="ag-acts"><Link className="ag-btn ag-pri" href="/redesign/collection">Explore Collection</Link><Link className="ag-btn" href={CONTACT_URL}>Request a stone</Link></div>
        </div>
      </section>
    </div>
  );
}
