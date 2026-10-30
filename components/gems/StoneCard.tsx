import Link from 'next/link';
import Image from 'next/image';
import { CATNAME, thumbSrc, type StoneInfo } from '@/lib/gems/stones';

export default function StoneCard({ s, hidden = false }: { s: StoneInfo; hidden?: boolean }) {
  const tags = [s.family, ...(s.origin ? [`Origin: ${s.origin}`] : [])];
  return (
    <Link className="ag-card" href={`/redesign/stone/${s.id}`} data-cat={s.cat} hidden={hidden}>
      <div className="ag-thumb" style={{ ['--w' as string]: s.wash }}>
        <Image src={thumbSrc(s.id)} alt={`3D render: ${s.name}`} width={800} height={600} />
      </div>
      <div className="ag-c-body">
        <span className="ag-mono">{CATNAME[s.cat]}</span>
        <h3>{s.name}</h3>
        <p>{s.desc}</p>
        <div className="ag-tags">{tags.map(t => <span className="ag-tag" key={t}>{t}</span>)}</div>
        <span className="ag-more">View {s.cat === 'gemstone' ? 'stone' : 'details'} <span aria-hidden="true">→</span></span>
      </div>
    </Link>
  );
}

const WAYS = [
  { t: 'Loose natural gemstones', k: 'Gemstones', p: 'Precious and semi-precious stones, hand-picked for clarity, color, and character.', id: 'sapphire' as const, wash: '70,100,255', href: '/redesign/collection?category=gemstone', cta: 'Browse gemstones' },
  { t: 'Handmade gemstone jewelry', k: 'Handmade jewel', p: 'Rings, pendants, and bracelets, set by hand in silver, gold, and brass.', id: 'rings' as const, wash: '240,180,90', href: '/redesign/stone/rings', cta: 'View details' },
  { t: 'Custom engraved stone', k: 'Engraved stone', p: 'Custom carvings and personalized messages, cut into natural stone.', id: 'carved' as const, wash: '60,170,120', href: '/redesign/stone/carved', cta: 'View details' },
];
export function WaysGrid() {
  return (
    <div className="ag-ways">
      {WAYS.map(w => (
        <Link className="ag-card" href={w.href} key={w.t}>
          <div className="ag-thumb" style={{ ['--w' as string]: w.wash }}><Image src={thumbSrc(w.id)} alt={`3D render: ${w.t}`} width={800} height={600} /></div>
          <div className="ag-c-body"><span className="ag-mono">{w.k}</span><h3>{w.t}</h3><p>{w.p}</p><span className="ag-more">{w.cta} <span aria-hidden="true">→</span></span></div>
        </Link>
      ))}
    </div>
  );
}
