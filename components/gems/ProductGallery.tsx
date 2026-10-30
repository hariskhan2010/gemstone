'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import StoneViewer from '@/components/gems/StoneViewer';
import type { ViewerModel } from '@/lib/gems/viewer';

export interface GalleryItem { kind: 'image' | 'video' | '3d'; src: string; alt: string; model?: ViewerModel }

/** Photos with hover zoom (desktop) and a full-screen view with pinch, wheel and double-tap zoom; videos; the 3D model as one more slide. */
export default function ProductGallery({ items, name }: { items: GalleryItem[]; name: string }) {
  const [i, setI] = useState(0);
  const [lens, setLens] = useState<{ x: number; y: number } | null>(null);
  const [full, setFull] = useState(false);
  const cur = items[i];
  if (!cur) return null;
  return (
    <div className="ag-gallery">
      <div className="ag-g-main">
        {cur.kind === 'image' && (
          <button type="button" className="ag-g-zoom" aria-label={`Open ${cur.alt} full screen to zoom`} onClick={() => setFull(true)}
            onPointerMove={e => { if (e.pointerType !== 'mouse') return; const r = e.currentTarget.getBoundingClientRect(); setLens({ x: (e.clientX - r.left) / r.width * 100, y: (e.clientY - r.top) / r.height * 100 }); }}
            onPointerLeave={() => setLens(null)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cur.src} alt={cur.alt} style={lens ? { transform: 'scale(2.4)', transformOrigin: `${lens.x}% ${lens.y}%` } : undefined} />
            <span className="ag-mono ag-g-hint">{lens ? 'Click for full screen' : 'Hover to zoom · tap to enlarge'}</span>
          </button>
        )}
        {cur.kind === 'video' && <video key={cur.src} src={cur.src} controls playsInline preload="metadata" aria-label={cur.alt} />}
        {cur.kind === '3d' && cur.model && <StoneViewer id={cur.model} name={name} wash="140,110,230" />}
      </div>
      {items.length > 1 && (
        <div className="ag-g-thumbs" role="tablist" aria-label="Product media">
          {items.map((it, k) => (
            <button key={k} type="button" role="tab" aria-selected={k === i} aria-label={it.kind === '3d' ? '3D view' : it.alt} onClick={() => { setI(k); setLens(null); }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {it.kind === 'image' && <img src={it.src} alt="" loading="lazy" />}
              {it.kind === 'video' && <><video src={it.src} muted playsInline preload="metadata" /><span className="ag-g-badge">▶</span></>}
              {it.kind === '3d' && <span className="ag-g-3d">3D</span>}
            </button>
          ))}
        </div>
      )}
      {full && cur.kind === 'image' && <Lightbox images={items.filter(x => x.kind === 'image')} start={items.filter(x => x.kind === 'image').indexOf(cur)} onClose={() => setFull(false)} />}
    </div>
  );
}

function Lightbox({ images, start, onClose }: { images: GalleryItem[]; start: number; onClose: () => void }) {
  const [k, setK] = useState(Math.max(0, start));
  const [z, setZ] = useState({ s: 1, x: 0, y: 0 });
  const pts = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ d: number; s: number } | null>(null);
  const reset = () => setZ({ s: 1, x: 0, y: 0 });
  const go = useCallback((d: number) => { setK(v => (v + d + images.length) % images.length); setZ({ s: 1, x: 0, y: 0 }); }, [images.length]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); };
    addEventListener('keydown', onKey); const prev = document.body.style.overflow; document.body.style.overflow = 'hidden';
    return () => { removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [go, onClose]);
  const clampS = (s: number) => Math.min(5, Math.max(1, s));
  return (
    <div className="ag-lightbox" role="dialog" aria-modal="true" aria-label="Zoomed photo">
      <div className="ag-lb-stage"
        onWheel={e => setZ(v => ({ ...v, s: clampS(v.s * (e.deltaY < 0 ? 1.15 : 0.87)) }))}
        onDoubleClick={() => setZ(v => (v.s > 1 ? { s: 1, x: 0, y: 0 } : { ...v, s: 2.5 }))}
        onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY }); if (pts.current.size === 2) { const [a, b] = [...pts.current.values()]; pinch.current = { d: Math.hypot(a.x - b.x, a.y - b.y), s: z.s }; } }}
        onPointerMove={e => {
          const p = pts.current.get(e.pointerId); if (!p) return;
          const dx = e.clientX - p.x, dy = e.clientY - p.y; pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
          if (pts.current.size === 2 && pinch.current) { const [a, b] = [...pts.current.values()]; const s = clampS(pinch.current.s * Math.hypot(a.x - b.x, a.y - b.y) / pinch.current.d); setZ(v => ({ ...v, s })); }
          else if (z.s > 1) setZ(v => ({ ...v, x: v.x + dx, y: v.y + dy }));
        }}
        onPointerUp={e => { pts.current.delete(e.pointerId); if (pts.current.size < 2) pinch.current = null; }}
        onPointerCancel={e => { pts.current.delete(e.pointerId); pinch.current = null; }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images[k].src} alt={images[k].alt} draggable={false} style={{ transform: `translate(${z.x}px, ${z.y}px) scale(${z.s})` }} />
      </div>
      <div className="ag-lb-bar">
        {images.length > 1 && <button type="button" className="ag-btn" onClick={() => go(-1)} aria-label="Previous photo">←</button>}
        <button type="button" className="ag-btn" onClick={() => setZ(v => ({ ...v, s: clampS(v.s / 1.5) }))} aria-label="Zoom out">−</button>
        <span className="ag-mono">{Math.round(z.s * 100)}%</span>
        <button type="button" className="ag-btn" onClick={() => setZ(v => ({ ...v, s: clampS(v.s * 1.5) }))} aria-label="Zoom in">+</button>
        <button type="button" className="ag-btn" onClick={reset}>Reset</button>
        {images.length > 1 && <button type="button" className="ag-btn" onClick={() => go(1)} aria-label="Next photo">→</button>}
        <button type="button" className="ag-btn ag-pri" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
