'use client';

import { useState } from 'react';
import StoneCard from './StoneCard';
import { STONES, type StoneCategory } from '@/lib/gems/stones';

type Filter = 'all' | StoneCategory;
const CHIPS: [Filter, string][] = [['all', 'All products'], ['gemstone', 'Gemstones'], ['jewelry', 'Jewelry'], ['carved', 'Carved stone']];

export default function CollectionGrid({ initial = 'all' }: { initial?: Filter }) {
  const [cat, setCat] = useState<Filter>(initial);
  const n = STONES.filter(s => cat === 'all' || s.cat === cat).length;
  return (
    <>
      <div className="ag-chips" role="group" aria-label="Filter by category">
        {CHIPS.map(([k, label]) => (
          <button type="button" key={k} aria-pressed={cat === k} onClick={() => setCat(k)}>{label}</button>
        ))}
      </div>
      <p className="ag-mono" aria-live="polite" style={{ margin: '0 0 16px' }}>{n} {n === 1 ? 'item' : 'items'} · 3D renders, ask for current stones</p>
      <div className="ag-grid">
        {STONES.map(s => <StoneCard key={s.id} s={s} hidden={!(cat === 'all' || s.cat === cat)} />)}
      </div>
    </>
  );
}
