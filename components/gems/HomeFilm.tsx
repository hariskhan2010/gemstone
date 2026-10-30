'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

/** Pinned ten-screen 3D film. Markup here; motion and WebGL in lib/gems/homeFilm.ts. */
export default function HomeFilm() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let film: { dispose(): void } | null = null;
    let cancelled = false;
    import('@/lib/gems/homeFilm').then(m => {
      if (!cancelled && ref.current) film = m.createHomeFilm(ref.current);
    });
    return () => { cancelled = true; film?.dispose(); };
  }, []);

  const poster = (n: number, r: string) => (
    <picture data-r={r} key={n}>
      <source media="(max-width:759px)" srcSet={`/gems/posters/p${n}m.webp`} />
      <img alt="" src={`/gems/posters/p${n}.webp`} loading="lazy" />
    </picture>
  );

  return (
    <div className="ag-film" ref={ref}>
      <div className="ag-scroller" data-ag="scroller">
        <div className="ag-stage" data-ag="stage">
          <div className="ag-bgl" data-ag="bg" />
          <div className="ag-poster" aria-hidden="true">
            {poster(1, '-1,0,.9,1.4')}{poster(2, '1.3,1.9,3.1,3.5')}{poster(3, '3.4,4.0,7.6,8.1')}{poster(4, '7.9,8.6,99,100')}
          </div>
          <div className="ag-back" aria-hidden="true">
            <p className="ag-d ag-h-tl" data-r="-1,0,0.85,1.35" data-i="0.25">Timeless<br />beauty</p>
            <p className="ag-d ag-h-br" data-r="-1,0,0.85,1.35" data-i="0.45">From<br />earth.</p>
            <div className="ag-words" data-w="3.4,4.0,4.75,5.3"><div className="ag-ln"><span>Verified</span></div><div className="ag-ln"><span>quality</span></div></div>
            <div className="ag-words" data-w="4.85,5.45,6.2,6.75"><div className="ag-ln"><span>Real</span></div><div className="ag-ln"><span>artisans</span></div></div>
            <div className="ag-words" data-w="6.3,6.9,7.65,8.2"><div className="ag-ln"><span>Chosen in</span></div><div className="ag-ln"><span>person</span></div></div>
          </div>
          <div className="ag-gl" data-ag="gl" />
          <div className="ag-front">
            <h1 className="ag-sr">Asian Gemstone: timeless beauty from earth</h1>
            <p className="ag-mono ag-h-cap" data-r="-1,0,0.8,1.3" data-i="0.6">Rendered model<br />Emerald, step cut</p>
            <p className="ag-h-tr" data-r="-1,0,0.8,1.3" data-i="0.55"><span className="ag-grad">Every piece starts<br />as a rough stone.</span></p>
            <p className="ag-small ag-h-b1" data-r="-1,0,0.8,1.3" data-i="0.7">Exquisite gemstones, carefully sourced and crafted for those who appreciate true quality.</p>
            <p className="ag-small ag-h-b2" data-r="-1,0,0.8,1.3" data-i="0.8">Bought from licensed dealers and trusted mines across Pakistan, Thailand and India.</p>
            <div className="ag-h-btn" data-r="-1,0,0.6,1.1" data-i="0.95">
              <Link className="ag-btn ag-pri" href="/redesign/collection">Explore Collection</Link>
              <button type="button" className="ag-btn" data-s="2.6">Scroll to explore</button>
            </div>
            <h2 className="ag-d ag-an-t" data-r="1.45,2.05,3.05,3.5">Anatomy of<br /><span className="ag-grad">an emerald cut</span></h2>
            <p className="ag-small ag-an-c" data-r="1.55,2.15,3.05,3.5">Every stone is inspected by hand for color, clarity, and cut. Only the best stones reach our shop.</p>
            <svg className="ag-leaders" data-ag="leaders" aria-hidden="true" />
            <div className="ag-lab" data-r="1.95,2.35,3.0,3.4" data-side="r" data-a="table"><h4>Table</h4><p>The flat top facet. Light enters here first.</p><span className="ag-mono">1 facet</span></div>
            <div className="ag-lab" data-r="2.0,2.4,3.0,3.4" data-side="r" data-a="crown"><h4>Crown</h4><p>Stepped facets that frame the stone&apos;s colour.</p><span className="ag-mono">24 step facets + table</span></div>
            <div className="ag-lab" data-r="2.05,2.45,3.0,3.4" data-side="l" data-a="girdle"><h4>Girdle</h4><p>The thin outer rim that a setting holds.</p><span className="ag-mono">The edge</span></div>
            <div className="ag-lab" data-r="2.1,2.5,3.0,3.4" data-side="l" data-a="pav"><h4>Pavilion</h4><p>Steps underneath that send light back up through the top.</p><span className="ag-mono">24 step facets</span></div>
            <p className="ag-eyebrow" data-r="3.4,3.95,7.7,8.15"><span className="ag-grad">What you get with every order</span></p>
            <div className="ag-wsub" data-r="3.55,4.05,4.7,5.1"><p>Every stone is checked for clarity and cut before it reaches you.</p><span className="ag-mono">Emerald · Beryl · Mohs 7.5–8 · RI 1.565–1.602</span></div>
            <div className="ag-wsub" data-r="5.0,5.5,6.15,6.55"><p>A small team of carvers, not a factory line, behind every piece.</p><span className="ag-mono">Ruby · Corundum · Mohs 9 · RI 1.762–1.770</span></div>
            <div className="ag-wsub" data-r="6.45,6.95,7.6,8.0"><p>Bought from licensed dealers and trusted mines across Pakistan, Thailand and India.</p><span className="ag-mono">Sapphire · Corundum · Mohs 9 · RI 1.762–1.770</span></div>
            <h2 className="ag-d ag-f-t" data-r="7.95,8.6,99,100">100% natural.<br /><span className="ag-grad">Set by hand.</span></h2>
            <p className="ag-small ag-f-c" data-r="8.05,8.7,99,100">Tracked delivery to most countries, typically in 7 to 14 days. Each stone ships with details on origin, carat, and treatment.</p>
            <div className="ag-f-cta" data-r="8.6,9.2,99,100">
              <Link className="ag-btn ag-pri" href="/redesign/collection">Explore Collection</Link>
              <Link className="ag-btn" href="/redesign/about">Discover Our Story</Link>
            </div>
            <ol className="ag-f-cats" data-r="8.75,9.35,99,100">
              <li><Link href="/redesign/collection?category=gemstone">Natural gemstones <span className="ag-mono">01</span></Link></li>
              <li><Link href="/redesign/stone/rings">Gemstone rings <span className="ag-mono">02</span></Link></li>
              <li><Link href="/redesign/stone/carved">Carved stone jewelry <span className="ag-mono">03</span></Link></li>
            </ol>
          </div>
          <div className="ag-fx" />
        </div>
      </div>
    </div>
  );
}
