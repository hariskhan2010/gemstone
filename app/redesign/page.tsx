import Link from 'next/link';
import HomeFilm from '@/components/gems/HomeFilm';
import StoneCard, { WaysGrid } from '@/components/gems/StoneCard';
import { STONES, CONTACT_URL } from '@/lib/gems/stones';

const FAQ: [string, string][] = [
  ['Are your gemstones natural?', 'Yes. Our gemstones are 100% natural stones, hand-selected from Asian mines, including emerald, ruby, sapphire, amethyst, and more.'],
  ['Do you provide certificates?', 'Each stone ships with details on origin, carat, and treatment. Independent gemological certificates (GIA/IGI) are available on request for an additional fee.'],
  ['What is a custom engraved stone?', 'A natural stone with a name, date, coordinate, or symbol carved by hand by our artisans. It makes a one-of-a-kind personalized gift.'],
  ['How long does a custom carving take?', 'Most hand-carved pieces are ready in 2 to 4 weeks, depending on complexity.'],
  ['Do you ship worldwide?', 'Yes. We ship securely to customers worldwide.'],
  ['How do I clean gemstone jewelry safely?', 'Use mild soap, lukewarm water, and a soft brush. Avoid soaking soft stones like opal, turquoise, and pearl, and never use ultrasonic cleaners.'],
];

export default function RedesignHome() {
  return (
    <>
      <HomeFilm />
      <section className="ag-band ag-wash-a" aria-labelledby="ag-h-stones">
        <div className="ag-wrap">
          <div className="ag-sec-head">
            <div><p className="ag-eyebrow-l"><span className="ag-grad">Natural gemstones</span></p><h2 className="ag-d" id="ag-h-stones">Stones we carry</h2></div>
            <p>Every gemstone we sell is natural, ethically sourced, and hand-picked from trusted mines across Asia.</p>
          </div>
          <div className="ag-grid ag-grid-3">{STONES.filter(s => s.cat === 'gemstone').map(s => <StoneCard key={s.id} s={s} />)}</div>
        </div>
      </section>
      <section className="ag-band" aria-labelledby="ag-h-ways">
        <div className="ag-wrap">
          <div className="ag-sec-head">
            <div><p className="ag-eyebrow-l"><span className="ag-grad">Our premium collections</span></p><h2 className="ag-d" id="ag-h-ways">Three ways to wear a stone</h2></div>
            <p>Sourced, graded, cut and set by people we know by name.</p>
          </div>
          <WaysGrid />
        </div>
      </section>
      <section className="ag-band ag-wash-b" aria-labelledby="ag-h-source">
        <div className="ag-wrap">
          <div className="ag-sec-head"><div><p className="ag-eyebrow-l"><span className="ag-grad">From mine to you</span></p><h2 className="ag-d" id="ag-h-source">How we source</h2></div>
            <p>We maintain direct relationships with miners and suppliers worldwide to keep sourcing ethical and traceable.</p></div>
          <div className="ag-steps">
            <div className="ag-step"><span className="ag-mono">Step 01</span><h3>Mine-direct sourcing</h3><p>We buy from trusted mines and licensed dealers across Asia — Pakistan, Thailand, and India — cutting out middlemen.</p></div>
            <div className="ag-step"><span className="ag-mono">Step 02</span><h3>Hand selection</h3><p>Every stone is inspected by hand for color, clarity, and cut. Only the best stones reach our shop.</p></div>
            <div className="ag-step"><span className="ag-mono">Step 03</span><h3>Transparent pricing</h3><p>Natural stones at fair prices, with honest information about origin, treatment, and carat weight.</p></div>
          </div>
        </div>
      </section>
      <section className="ag-band ag-wash-c" aria-labelledby="ag-h-perks">
        <div className="ag-wrap">
          <div className="ag-sec-head"><div><h2 className="ag-d" id="ag-h-perks">What you get with every order</h2></div><p>Since 2003, a small family business with a passion for rare and beautiful gemstones.</p></div>
          <div className="ag-perks">
            <div className="ag-perk"><span className="ag-mono">Quality</span><h3>Verified quality</h3><p>Every stone is checked for clarity and cut before it reaches you.</p></div>
            <div className="ag-perk"><span className="ag-mono">Certificates</span><h3>Details with every stone</h3><p>Origin, carat, and treatment, with GIA/IGI certificates available on request.</p></div>
            <div className="ag-perk"><span className="ag-mono">7–14 days</span><h3>Worldwide shipping</h3><p>Tracked delivery to most countries, typically in 7 to 14 days.</p></div>
            <div className="ag-perk"><span className="ag-mono">By hand</span><h3>Real artisans</h3><p>A small team of carvers, not a factory line, behind every piece.</p></div>
          </div>
        </div>
      </section>
      <section className="ag-band ag-wash-a" aria-labelledby="ag-h-faq">
        <div className="ag-wrap">
          <div className="ag-sec-head"><div><h2 className="ag-d" id="ag-h-faq">Frequently asked questions</h2></div><p>Still unsure? Contact us with your requirements and our team will help you find or custom-source the right stone.</p></div>
          <div className="ag-faq">{FAQ.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div>
        </div>
      </section>
      <section className="ag-band">
        <div className="ag-wrap ag-cta-band">
          <h2 className="ag-d">Every piece starts<br /><span className="ag-grad">as a rough stone.</span></h2>
          <div className="ag-acts"><Link className="ag-btn ag-pri" href="/redesign/collection">Explore Collection</Link><Link className="ag-btn" href={CONTACT_URL}>Request a stone</Link></div>
        </div>
      </section>
    </>
  );
}
