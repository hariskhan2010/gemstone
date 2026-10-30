'use client';

import { useEffect, useRef, useState, useActionState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { BUCKET, mediaUrl } from '@/lib/supabase/public';
import { saveProduct, addMedia, deleteMedia, moveMedia, deleteProduct, generateCopy, start3D, check3D, saveCopy } from '@/lib/products/actions';
import { GEM_CUTS, STOCK_STATUS, type StockStatus, type Product, type Media, type Article } from '@/lib/products/types';
import StoneViewer from '@/components/gems/StoneViewer';

type Step = { label: string; state: 'wait' | 'run' | 'ok' | 'bad'; note?: string };
const MAX = 50 * 1024 * 1024;

export default function ProductEditor({ product, media = [], article = null }: { product?: Product; media?: Media[]; article?: Article | null }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [kind, setKind] = useState(product?.kind ?? 'gemstone');
  const [cut, setCut] = useState(product?.gem_cut ?? 'oval');
  const [color, setColor] = useState(product?.gem_color ?? '#7a3fd0');
  const [files, setFiles] = useState<File[]>([]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [busy, setBusy] = useState(false);
  const [rewrite, setRewrite] = useState(!product);
  const set = (i: number, s: Partial<Step>) => setSteps(a => a.map((x, k) => (k === i ? { ...x, ...s } : x)));

  async function run(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); if (busy) return;
    const fd = new FormData(e.currentTarget);
    const big = files.find(f => f.size > MAX);
    if (big) { setSteps([{ label: `${big.name} is over 50 MB. Compress it or raise the storage limit.`, state: 'bad' }]); return; }
    const willMesh = kind !== 'gemstone' && fd.get('want_3d') === 'on' && (files.some(f => f.type.startsWith('image/')) || media.some(m => m.kind === 'image'));
    const plan: Step[] = [{ label: 'Save details', state: 'wait' }];
    if (files.length) plan.push({ label: `Upload ${files.length} file${files.length > 1 ? 's' : ''}`, state: 'wait' });
    if (rewrite) plan.push({ label: 'Write description, SEO and article (AI) and publish', state: 'wait' });
    if (willMesh && product?.model_status !== 'working') plan.push({ label: 'Start 3D model from photos', state: 'wait' });
    setSteps(plan); setBusy(true);
    let i = 0;
    try {
      set(i, { state: 'run' });
      const r = await saveProduct(null, fd);
      if (!r?.ok || !r.id) throw Object.assign(new Error(r?.error ?? 'Could not save.'), { step: i });
      const id = r.id; set(i++, { state: 'ok' });
      if (files.length) {
        set(i, { state: 'run' });
        const sb = createClient(); if (!sb) throw new Error('Supabase is not configured.');
        const done: { path: string; kind: 'image' | 'video' }[] = [];
        for (const [n, f] of files.entries()) {
          set(i, { note: `${n + 1} of ${files.length}: ${f.name}` });
          const ext = (f.name.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '');
          const path = `products/${id}/${crypto.randomUUID()}.${ext}`;
          const { error } = await sb.storage.from(BUCKET).upload(path, f, { contentType: f.type, upsert: false });
          if (error) throw new Error(`${f.name}: ${error.message}`);
          done.push({ path, kind: f.type.startsWith('video/') ? 'video' : 'image' });
        }
        await addMedia(id, done); setFiles([]); set(i++, { state: 'ok', note: undefined });
      }
      if (rewrite) {
        set(i, { state: 'run', note: 'This takes about a minute.' });
        const g = await generateCopy(id);
        set(i++, g?.ok ? { state: 'ok', note: g.message } : { state: 'bad', note: g?.error });
      }
      if (willMesh && product?.model_status !== 'working') {
        set(i, { state: 'run' });
        const t = await start3D(id);
        set(i++, t?.ok ? { state: 'ok', note: t.message } : { state: 'bad', note: t?.error });
      }
      if (!product) router.replace(`/redesign/admin/products/${id}`); else router.refresh();
    } catch (err) {
      set(i, { state: 'bad', note: err instanceof Error ? err.message : 'Error' });
    } finally { setBusy(false); setRewrite(false); }
  }

  return (
    <div className="ag-editor">
      <form ref={formRef} className="ag-form-card ag-wide" onSubmit={run} noValidate>
        <h2 className="ag-d">{product ? 'Product details' : 'New product'}</h2>
        {product && <input type="hidden" name="id" value={product.id} />}
        <div className="ag-grid2">
          <div className="ag-field"><label htmlFor="pe-name">Name</label><input id="pe-name" name="name" required defaultValue={product?.name} placeholder="Swat emerald, 2.1 ct" /></div>
          <div className="ag-field"><label htmlFor="pe-kind">Type</label>
            <select id="pe-kind" name="kind" value={kind} onChange={e => setKind(e.target.value as typeof kind)}>
              <option value="gemstone">Gemstone (loose stone)</option><option value="jewelry">Jewelry (ring, pendant…)</option><option value="carved">Carved / engraved stone</option>
            </select></div>
          <div className="ag-field"><label htmlFor="pe-family">Family</label><input id="pe-family" name="family" defaultValue={product?.family ?? ''} placeholder="Beryl, corundum, quartz…" /></div>
          <div className="ag-field"><label htmlFor="pe-stock">Stock status</label>
            <select id="pe-stock" name="stock_status" defaultValue={product?.stock_status ?? 'in'}>{(Object.keys(STOCK_STATUS) as StockStatus[]).map(k => <option key={k} value={k}>{STOCK_STATUS[k].label}</option>)}</select></div>
          <div className="ag-field"><label htmlFor="pe-carat">Weight (carat)</label><input id="pe-carat" name="carat" inputMode="decimal" defaultValue={product?.carat ?? ''} /></div>
          <div className="ag-field"><label htmlFor="pe-origin">Origin</label><input id="pe-origin" name="origin" defaultValue={product?.origin ?? ''} placeholder="Swat, Pakistan" /></div>
          <div className="ag-field"><label htmlFor="pe-treat">Treatment</label><input id="pe-treat" name="treatment" defaultValue={product?.treatment ?? ''} placeholder="None / minor oil / heated…" /></div>
          <div className="ag-field"><label htmlFor="pe-dim">Size</label><input id="pe-dim" name="dimensions" defaultValue={product?.dimensions ?? ''} placeholder="9.1 × 7.0 × 4.8 mm" /></div>
          <div className="ag-field"><label htmlFor="pe-price">Price (optional)</label><input id="pe-price" name="price" inputMode="decimal" defaultValue={product?.price ?? ''} /></div>
          <div className="ag-field"><label htmlFor="pe-cur">Currency</label><input id="pe-cur" name="currency" maxLength={3} defaultValue={product?.currency ?? 'USD'} /></div>
        </div>
        <div className="ag-field"><label htmlFor="pe-details">Details for the AI writer</label>
          <textarea id="pe-details" name="details" defaultValue={product?.details} placeholder="Everything true about this piece: colour, clarity, what makes it special, setting metal, ring size, engraving text… The AI only uses what you write here." />
          <span className="ag-mono">The AI never adds facts you did not give it.</span></div>

        {kind === 'gemstone' ? (
          <fieldset className="ag-fieldset"><legend>3D gem</legend>
            <div className="ag-grid2">
              <div className="ag-field"><label htmlFor="pe-cut">Cut</label><select id="pe-cut" name="gem_cut" value={cut} onChange={e => setCut(e.target.value as typeof cut)}>{GEM_CUTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></div>
              <div className="ag-field"><label htmlFor="pe-color">Body colour</label><input id="pe-color" name="gem_color" type="color" value={color} onChange={e => setColor(e.target.value)} /></div>
            </div>
            <div className="ag-preview3d"><StoneViewer id={{ cut, color }} name="preview" wash="120,90,200" hint="Live preview · drag to rotate" fit={0.9} /></div>
          </fieldset>
        ) : (
          <label className="ag-check"><input type="checkbox" name="want_3d" defaultChecked={product ? product.model_kind === 'mesh' : true} /> Build a 3D model from the photos (Meshy, uses credits; 2–4 angles, first photo = front)</label>
        )}

        <div className="ag-field"><label htmlFor="pe-files">Add photos and videos</label>
          <input id="pe-files" type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm,video/quicktime" onChange={e => setFiles(Array.from(e.target.files ?? []))} />
          {files.length > 0 && <span className="ag-mono">{files.length} selected · {(files.reduce((s, f) => s + f.size, 0) / 1048576).toFixed(1)} MB</span>}</div>
        <label className="ag-check"><input type="checkbox" checked={rewrite} onChange={e => setRewrite(e.target.checked)} /> {product ? 'Rewrite description, SEO and article with AI' : 'Write description, SEO and article with AI (published automatically)'}</label>
        <label className="ag-check"><input type="checkbox" name="hidden" defaultChecked={product?.status === 'hidden'} /> Hide from the shop</label>
        <button className="ag-btn ag-pri" type="submit" disabled={busy}>{busy ? 'Working…' : product ? 'Save' : 'Create product'}</button>
        {steps.length > 0 && (
          <ol className="ag-steps-run" aria-live="polite">
            {steps.map((s, k) => <li key={k} className={`ag-s-${s.state}`}><b>{s.label}</b>{s.note && <span>{s.note}</span>}</li>)}
          </ol>
        )}
      </form>

      {product && (
        <aside className="ag-side">
          <MediaPanel media={media} />
          {product.model_kind === 'mesh' && <MeshPanel product={product} />}
          <CopyPanel product={product} article={article} />
          <form action={deleteProduct.bind(null, product.id)} onSubmit={e => { if (!confirm(`Delete "${product.name}" with all its photos and videos?`)) e.preventDefault(); }}>
            <button className="ag-btn ag-danger" type="submit">Delete product</button>
          </form>
        </aside>
      )}
    </div>
  );
}

function MediaPanel({ media }: { media: Media[] }) {
  const router = useRouter();
  const act = async (f: () => Promise<void>) => { await f(); router.refresh(); };
  return (
    <section className="ag-perk">
      <h3>Photos and videos</h3>
      {media.length === 0 && <p>None yet. Add some with the form.</p>}
      <ul className="ag-media-list">
        {media.map((m, k) => (
          <li key={m.id}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {m.kind === 'image' ? <img src={mediaUrl(m.path)} alt="" /> : <video src={mediaUrl(m.path)} muted playsInline preload="metadata" />}
            <span className="ag-mono">{k === 0 ? 'Cover' : `#${k + 1}`} · {m.kind}</span>
            <span className="ag-media-acts">
              <button type="button" aria-label="Move earlier" disabled={k === 0} onClick={() => act(() => moveMedia(m.id, -1))}>↑</button>
              <button type="button" aria-label="Move later" disabled={k === media.length - 1} onClick={() => act(() => moveMedia(m.id, 1))}>↓</button>
              <button type="button" aria-label="Delete" onClick={() => { if (confirm('Delete this file?')) act(() => deleteMedia(m.id)); }}>✕</button>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function MeshPanel({ product }: { product: Product }) {
  const router = useRouter();
  const [st, setSt] = useState<{ status: string; progress?: number; error?: string }>({ status: product.model_status });
  const [msg, setMsg] = useState('');
  useEffect(() => {
    if (st.status !== 'working') return;
    const t = setInterval(async () => { const r = await check3D(product.id); setSt(r); if (r.status !== 'working') { clearInterval(t); router.refresh(); } }, 8000);
    return () => clearInterval(t);
  }, [st.status, product.id, router]);
  return (
    <section className="ag-perk">
      <h3>3D model from photos</h3>
      {st.status === 'working' && <p>Building… {st.progress ? `${st.progress}%` : ''} (checks every few seconds)</p>}
      {st.status === 'failed' && <p className="ag-err">The 3D build failed{st.error ? `: ${st.error}` : ''}. Try clearer photos on a plain background.</p>}
      {st.status === 'done' && product.model_path && <div className="ag-preview3d"><StoneViewer id={{ glb: mediaUrl(product.model_path) }} name={product.name} wash="200,170,90" hint="3D model · drag to rotate" /></div>}
      {st.status !== 'working' && (
        <button type="button" className="ag-btn" onClick={async () => { const r = await start3D(product.id); setMsg(r?.message ?? r?.error ?? ''); if (r?.ok) setSt({ status: 'working' }); }}>
          {st.status === 'done' ? 'Rebuild 3D model' : 'Build 3D model'}
        </button>
      )}
      {msg && <p className="ag-mono">{msg}</p>}
    </section>
  );
}

function CopyPanel({ product, article }: { product: Product; article: Article | null }) {
  const [state, action, pending] = useActionState(saveCopy, null);
  return (
    <section className="ag-perk">
      <h3>Text and SEO <span className={`ag-badge ag-b-${product.ai_status}`}>{product.ai_status}</span></h3>
      {product.ai_error && <p className="ag-err">{product.ai_error}</p>}
      <form action={action} className="ag-copy-form">
        <input type="hidden" name="id" value={product.id} />
        <div className="ag-field"><label htmlFor="cp-d">Description</label><textarea id="cp-d" name="description" defaultValue={product.description ?? ''} rows={8} /></div>
        <div className="ag-field"><label htmlFor="cp-t">SEO title</label><input id="cp-t" name="seo_title" defaultValue={product.seo_title ?? ''} maxLength={70} /></div>
        <div className="ag-field"><label htmlFor="cp-s">SEO description</label><textarea id="cp-s" name="seo_description" defaultValue={product.seo_description ?? ''} rows={3} maxLength={170} /></div>
        <div className="ag-field"><label htmlFor="cp-k">Keywords (comma separated)</label><input id="cp-k" name="keywords" defaultValue={product.keywords.join(', ')} /></div>
        <button className="ag-btn" type="submit" disabled={pending}>{pending ? 'Saving…' : 'Save text'}</button>
        {state?.message && <p className="ag-alert ag-good">{state.message}</p>}{state?.error && <p className="ag-alert ag-bad">{state.error}</p>}
      </form>
      {article && <p className="ag-mono">Article: <Link href={`/redesign/articles/${article.slug}`} target="_blank">{article.title} ↗</Link></p>}
    </section>
  );
}
