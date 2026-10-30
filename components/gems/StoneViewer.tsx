'use client';

import { useEffect, useRef } from 'react';
import { thumbSrc } from '@/lib/gems/stones';
import type { ViewerModel, ViewerOptions } from '@/lib/gems/viewer';

interface Props extends ViewerOptions {
  id: ViewerModel;
  name: string;
  /** "r,g,b" glow behind the stone */
  wash: string;
  /** small caption in the corner; null hides it */
  hint?: string | null;
  /** image shown when WebGL is not available (defaults to the built-in thumbnail) */
  fallbackSrc?: string;
  /** extra overlay content (a tagline on the auth pages) */
  children?: React.ReactNode;
}

/** Draggable 3D stone. Falls back to an image when WebGL is unavailable. */
export default function StoneViewer({ id, name, wash, hint = 'Drag to rotate · 3D render', fallbackSrc, fit, fitPhone, offsetY, children }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const key = JSON.stringify(id);
  useEffect(() => {
    let v: { dispose(): void } | null = null;
    let cancelled = false;
    const model = JSON.parse(key) as ViewerModel;
    import('@/lib/gems/viewer').then(m => { if (!cancelled && host.current) v = m.createStoneViewer(host.current, model, { fit, fitPhone, offsetY }); });
    return () => { cancelled = true; v?.dispose(); };
  }, [key, fit, fitPhone, offsetY]);
  const fallback = fallbackSrc ?? (typeof id === 'string' ? thumbSrc(id === 'rough' ? 'emerald' : id) : undefined);
  return (
    <div className="ag-pv-stage" style={{ ['--w' as string]: wash }} role="img" aria-label={`3D view of ${name}, drag to rotate`}>
      <div className="ag-gl" ref={host} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {fallback && <img className="ag-pv-fallback" src={fallback} alt="" />}
      {hint && <span className="ag-mono ag-pv-hint">{hint}</span>}
      {children}
    </div>
  );
}
