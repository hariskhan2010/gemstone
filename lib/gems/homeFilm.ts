/**
 * Home film engine: a pinned stage whose scroll position `s` (0..SPAN) plays the
 * rough beryl laser-cut into an emerald, the exploded anatomy, three benefit scenes
 * (emerald, ruby, sapphire) and the box finale. Black & green studio.
 * The DOM lives in components/gems/HomeFilm.tsx; this module drives it.
 */
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import {
  D2R, clamp, seg, lerp, eOut, eIn, eIO, eBack, win, getCuts, OPT, TCFG, startTier,
  setupRenderer, buildEnv, addLights, createRenderer, makeStone, applyTierToStones, rayMat, disposeScene, roughMaterial,
  type StoneEnv, type StoneRecord, type Tier, type CutKey, type OpticsKey,
} from './core';

const SPAN = 10, CAMZ = 12;
type Group3 = { g: THREE.Group; sp: THREE.Group };
type State = { x: number; y: number; sc: number; rx: number; ry: number; rz: number; dx?: number };
interface Fx { el: HTMLElement; r: number[]; i: number | null; lab: boolean; v?: number; ty?: number }

export interface HomeFilm { dispose(): void }

export function createHomeFilm(root: HTMLElement): HomeFilm {
  const q = <T extends Element = HTMLElement>(sel: string) => root.querySelector(sel) as T;
  const qa = <T extends Element = HTMLElement>(sel: string) => Array.from(root.querySelectorAll(sel)) as T[];
  const stage = q('[data-ag="stage"]'), scroller = q('[data-ag="scroller"]'), bgEl = q('[data-ag="bg"]');
  const host = q('[data-ag="gl"]'), svg = q<SVGSVGElement>('[data-ag="leaders"]');
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderer = createRenderer();
  let tier: Tier = renderer ? startTier() : 'D';
  root.classList.toggle('ag-tierD', tier === 'D');

  // ---------- DOM timeline ----------
  const fx: Fx[] = qa('[data-r]').map(el => ({ el, r: (el.dataset.r || '').split(',').map(Number), i: el.dataset.i !== undefined ? +el.dataset.i : null, lab: el.classList.contains('ag-lab') }));
  const words = qa('[data-w]').map(el => ({ el, w: (el.dataset.w || '').split(',').map(Number), spans: Array.from(el.querySelectorAll<HTMLElement>('.ag-ln span')) }));
  const htl = q('.ag-h-tl');
  function updDom(s: number, t: number) {
    const introDone = RM || t > 2.2;
    for (const o of fx) {
      const [a, b, c, d] = o.r; const vin = a < 0 ? 1 : eOut(seg(s, a, b)), vout = eIn(seg(s, c, d));
      let v = vin * (1 - vout), ty = (1 - vin) * 26 - vout * 26;
      if (o.i !== null && !introDone) { const k = eOut(seg(t, o.i, o.i + 0.9)); v *= k; ty += (1 - k) * 22; }
      if (o.v !== undefined && Math.abs(o.v - v) < 1e-4 && o.ty === ty) continue;
      o.el.style.opacity = v.toFixed(3); o.el.style.setProperty('--ty', ty.toFixed(1) + 'px');
      o.el.style.visibility = v < 0.003 ? 'hidden' : 'visible'; o.el.classList.toggle('ag-live', v > 0.6); o.v = v; o.ty = ty;
    }
    for (const w of words) {
      const [a, b, c, d] = w.w; const on = s > a - 0.02 && s < d + 0.02; w.el.style.visibility = on ? 'visible' : 'hidden'; if (!on) continue;
      w.spans.forEach((sp, i) => { const lag = i * 0.09; const pin = eOut(seg(s, a + lag, b + lag)), pout = eIn(seg(s, c + lag * 0.6, d + lag * 0.6)); sp.style.setProperty('--y', ((1 - pin) * 105 - pout * 105).toFixed(2) + '%'); });
    }
    if (htl) {
      if (!RM && t < 1.6) { const k = eOut(seg(t, 0.25, 1.35)); htl.style.fontVariationSettings = `'wdth' ${(62 + 22 * k).toFixed(1)}, 'wght' ${(300 + 200 * k).toFixed(0)}`; }
      else if (htl.style.fontVariationSettings) htl.style.fontVariationSettings = '';
    }
  }
  function bgUpdate(s: number) {
    const hero = seg(s, 0.3, 1) * (1 - seg(s, 1.15, 1.8)), ana = seg(s, 1.2, 1.9) * (1 - seg(s, 3.05, 3.6));
    const r = win(s, 3.4, 4, 4.75, 5.3), sa = win(s, 4.85, 5.45, 6.2, 6.75), em = win(s, 6.3, 6.9, 7.65, 8.2), fin = seg(s, 7.85, 8.8);
    const g = (w: number, h: number, x: number, y: number, c: string, a: number) => `radial-gradient(${w}% ${h}% at ${x}% ${y}%, rgba(${c},${a.toFixed(3)}), rgba(${c},0) 72%)`;
    bgEl.style.background = [
      g(60, 48, 62, 108, '40,220,140', 0.5 * hero), g(62, 52, 24, 106, '10,120,80', 0.65 * hero), g(40, 40, 50, -10, '170,240,110', 0.12 * hero),
      g(42, 62, 86, 52, '30,200,130', 0.42 * ana), g(36, 52, 6, 62, '130,230,90', 0.22 * ana), g(50, 40, 44, 100, '15,140,95', 0.35 * ana),
      g(58, 42, 50, 104, '30,210,130', 0.42 * r), g(40, 30, 50, 0, '30,210,130', 0.08 * r),
      g(58, 42, 50, 104, '255,70,100', 0.16 * sa), g(58, 42, 50, 104, '20,170,110', 0.3 * sa),
      g(58, 42, 50, 104, '60,110,255', 0.16 * em), g(58, 42, 50, 104, '20,170,110', 0.3 * em),
      g(55, 45, 38, 104, '30,200,130', 0.55 * fin), g(48, 42, 76, 104, '170,240,110', 0.25 * fin), 'var(--ag-bg)',
    ].join(',');
  }

  // ---------- scroll + layout ----------
  let sTarget = 0, sCur = 0, time = 0, last = performance.now(), t0 = last, raf = 0, stageVisible = true, phone = false;
  let vw = 1, vh = 1, W = 1, H = 1;
  const Lo: Record<string, { x: number; y: number; sc: number }> = {};
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100); camera.position.set(0, 0, CAMZ);
  const px2w = (x: number, y: number) => [(x - 0.5) * W, -(y - 0.5) * H];
  function readScroll() {
    const range = scroller.offsetHeight - stage.offsetHeight;
    const top = scroller.getBoundingClientRect().top + scrollY;
    sTarget = clamp((scrollY - top) / Math.max(1, range)) * SPAN;
  }
  function layout() {
    phone = innerWidth < 760; vw = stage.clientWidth || innerWidth; vh = stage.clientHeight || innerHeight;
    H = 2 * Math.tan(15 * D2R) * CAMZ; W = H * vw / vh; camera.aspect = vw / vh; camera.updateProjectionMatrix();
    svg.setAttribute('viewBox', `0 0 ${vw} ${vh}`);
    Lo.hero = { x: 0.5, y: 0.5, sc: Math.min(W * 0.17, H * 0.15) };
    Lo.ana = phone ? { x: 0.44, y: 0.53, sc: Math.min(W * 0.153, H * 0.13) } : { x: 0.42, y: 0.57, sc: Math.min(W * 0.16, H * 0.19) };
    Lo.word = { x: 0.5, y: 0.505, sc: Math.min(W * (phone ? 0.1 : 0.11), H * 0.105) };
    Lo.box = phone ? { x: 0.5, y: 0.62, sc: W * 0.84 / 4.4 } : { x: 0.535, y: 0.585, sc: Math.min(W * 0.37 / 4.4, H * 0.52 / 4.4) };
    if (renderer) { renderer.setPixelRatio(Math.min(devicePixelRatio || 1, TCFG[tier].dpr)); renderer.setSize(vw, vh, false); }
  }

  // ---------- 3D scene ----------
  const scene = new THREE.Scene();
  const stones: StoneRecord[] = [];
  let env: StoneEnv | null = null;
  const mk = (): Group3 => { const g = new THREE.Group(); g.rotation.order = 'ZXY'; const sp = new THREE.Group(); g.add(sp); scene.add(g); return { g, sp }; };
  const ruby = mk(), saph = mk(), emer = mk();
  let rFull!: THREE.Mesh, rCrown!: THREE.Mesh, rPav!: THREE.Mesh, rough!: THREE.Mesh, sFull!: THREE.Mesh, eFull!: THREE.Mesh;
  let laser!: THREE.Mesh, laserCore!: THREE.Mesh, sparks!: THREE.Points, lidPivot!: THREE.Group, lidTexMat!: THREE.MeshStandardMaterial, lineTexMat!: THREE.MeshPhysicalMaterial;
  const clipRough = new THREE.Plane(new THREE.Vector3(0, -1, 0), 1e9), clipCut = new THREE.Plane(new THREE.Vector3(0, 1, 0), 1e9);
  const box = new THREE.Group(); const slots: { g: THREE.Group; sm: THREE.Mesh }[] = [];
  const PART: { m: THREE.InstancedMesh; items: { nx: number; ny: number; z: number; sz: number; ax: number; ay: number; sp: number }[]; winR: number[] }[] = [];
  let rubyEx = 0;

  function build(e: StoneEnv) {
    scene.environment = e.envTex; scene.environmentIntensity = 0.55; addLights(scene);
    const st = (k: CutKey, o: OpticsKey, rank: 0 | 1 | 2) => makeStone(stones, k, o, rank, e);
    // hero: emerald cut (plus crown/pavilion halves for the exploded anatomy)
    rFull = st('emerald', 'emerald', 0); rCrown = st('emCrown', 'emerald', 0); rPav = st('emPav', 'emerald', 0); ruby.sp.add(rFull, rCrown, rPav);
    // rough beryl crystal, cut away by the laser
    rough = new THREE.Mesh(getCuts().rough.geo, roughMaterial([clipRough]));
    ruby.sp.add(rough);
    // benefit scenes 2 and 3 (the hero emerald plays scene 1)
    sFull = st('oval', 'ruby', 1); saph.sp.add(sFull);
    eFull = st('round', 'sapphire', 1); emer.sp.add(eFull);
    // laser + sparks
    const lc = document.createElement('canvas'); lc.width = 512; lc.height = 64; const lx = lc.getContext('2d')!;
    const gr = lx.createRadialGradient(256, 256, 0, 256, 256, 256);
    gr.addColorStop(0, 'rgba(240,255,245,1)'); gr.addColorStop(0.25, 'rgba(120,255,180,.8)'); gr.addColorStop(0.6, 'rgba(30,200,120,.35)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
    lx.setTransform(1, 0, 0, 0.125, 0, 0); lx.fillStyle = gr; lx.fillRect(0, 0, 512, 512);
    laser = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(lc), transparent: true, blending: THREE.AdditiveBlending, depthTest: false, depthWrite: false })); laser.renderOrder = 10; scene.add(laser);
    laserCore = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, blending: THREE.AdditiveBlending, depthTest: false, depthWrite: false })); laserCore.renderOrder = 11; scene.add(laserCore);
    const pos = new Float32Array(44 * 3), pgeo = new THREE.BufferGeometry(); pgeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const sc = document.createElement('canvas'); sc.width = sc.height = 64; const sx = sc.getContext('2d')!; const sg = sx.createRadialGradient(32, 32, 0, 32, 32, 32);
    sg.addColorStop(0, 'rgba(255,255,255,1)'); sg.addColorStop(0.4, 'rgba(120,255,180,.7)'); sg.addColorStop(1, 'rgba(120,255,180,0)'); sx.fillStyle = sg; sx.fillRect(0, 0, 64, 64);
    sparks = new THREE.Points(pgeo, new THREE.PointsMaterial({ map: new THREE.CanvasTexture(sc), size: 0.09, transparent: true, depthTest: false, depthWrite: false })); sparks.renderOrder = 12; sparks.visible = false; scene.add(sparks);
    // particles
    const particles = (k: CutKey, o: OpticsKey, winR: number[], seed: number) => {
      const cut = getCuts()[k], N = 10, m = new THREE.InstancedMesh(cut.geo, rayMat(cut, OPT[o], 3, e), N); m.frustumCulled = false; scene.add(m);
      let s = seed; const rr = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; const items = [];
      while (items.length < N) { const nx = rr() * 2 - 1, ny = rr() * 1.35 - 0.85; if (Math.abs(nx) < 0.62 && Math.abs(ny) < 0.6) continue; if (Math.abs(nx) < 0.8 && Math.abs(ny) < 0.42) continue; if (Math.abs(nx) < 0.55 && ny < -0.5) continue; items.push({ nx, ny, z: -1 - rr() * 4, sz: 0.03 + rr() * 0.05, ax: rr() * 6, ay: rr() * 6, sp: 0.3 + rr() * 0.7 }); }
      PART.push({ m, items, winR });
    };
    particles('emerald', 'emerald', [3.35, 3.95, 4.75, 5.3], 5); particles('oval', 'ruby', [4.8, 5.4, 6.2, 6.75], 9); particles('round', 'sapphire', [6.25, 6.85, 7.65, 8.2], 13);
    // box finale
    scene.add(box);
    const velvet = new THREE.MeshPhysicalMaterial({ color: 0x070b08, roughness: 0.88, sheen: 1, sheenRoughness: 0.45, sheenColor: new THREE.Color(0x3c9a72) });
    const satin = new THREE.MeshPhysicalMaterial({ color: 0x0b1610, roughness: 0.5, sheen: 1, sheenRoughness: 0.3, sheenColor: new THREE.Color(0x6fd6a6) });
    const silver = new THREE.MeshStandardMaterial({ color: 0xd4d6e2, metalness: 1, roughness: 0.26 });
    box.add(new THREE.Mesh(new RoundedBoxGeometry(4.4, 0.7, 2.3, 4, 0.07), velvet));
    const tray = new THREE.Mesh(new THREE.PlaneGeometry(4.18, 2.08), satin); tray.rotation.x = -Math.PI / 2; tray.position.y = 0.352; box.add(tray);
    for (const [w, h, d, px, py, pz] of [[4.3, 0.04, 0.04, 0, 0.36, 1.13], [4.3, 0.04, 0.04, 0, 0.36, -1.13], [0.04, 0.04, 2.3, 2.13, 0.36, 0], [0.04, 0.04, 2.3, -2.13, 0.36, 0]]) { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), silver); m.position.set(px, py, pz); box.add(m); }
    const cush = new THREE.CylinderGeometry(0.33, 0.36, 0.08, 48);
    ([['emerald', 'emerald'], ['oval', 'ruby'], ['round', 'sapphire']] as [CutKey, OpticsKey][]).forEach(([ck, ok], i) => {
      const xx = -1.25 + i * 1.25; const cm = new THREE.Mesh(cush, velvet); cm.position.set(xx, 0.39, 0); box.add(cm);
      const g = new THREE.Group(); g.position.set(xx, 0.5, 0); const sm = st(ck, ok, 2); g.add(sm); g.scale.setScalar(ck === 'oval' || ck === 'emerald' ? 0.3 : 0.36); box.add(g); slots.push({ g, sm });
    });
    lidPivot = new THREE.Group(); lidPivot.position.set(0, 0.35, -1.15); box.add(lidPivot);
    const lid = new THREE.Mesh(new RoundedBoxGeometry(4.44, 0.3, 2.34, 4, 0.07), velvet); lid.position.set(0, 0.15, 1.15); lidPivot.add(lid);
    lidTexMat = new THREE.MeshStandardMaterial({ transparent: true, metalness: 0.85, roughness: 0.3, color: 0xffffff });
    const dec = new THREE.Mesh(new THREE.PlaneGeometry(3.8, 1.0), lidTexMat); dec.rotation.x = -Math.PI / 2; dec.position.set(0, 0.302, 1.15); lidPivot.add(dec);
    lineTexMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.45, sheen: 1, sheenColor: new THREE.Color(0x5fc896) });
    const lin = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 2.12), lineTexMat); lin.rotation.x = Math.PI / 2; lin.position.set(0, -0.002, 1.15); lidPivot.add(lin);
    drawDecals();
  }
  function drawDecals() {
    if (!lidTexMat) return;
    const font = getComputedStyle(root).getPropertyValue('--ag-font-display').trim() || 'Arial, sans-serif';
    const mono = getComputedStyle(root).getPropertyValue('--ag-font-mono').trim() || 'monospace';
    const c = document.createElement('canvas'); c.width = 2048; c.height = 540; const x = c.getContext('2d')!;
    x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#e6e8f2';
    let fs = 150; x.font = `600 ${fs}px ${font}`; if ('letterSpacing' in x) (x as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = '38px';
    while (x.measureText('ASIAN GEMSTONE').width > 1860 && fs > 60) { fs -= 4; x.font = `600 ${fs}px ${font}`; }
    x.fillText('ASIAN GEMSTONE', 1024, 230); x.font = `500 46px ${mono}`; if ('letterSpacing' in x) (x as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = '16px';
    x.fillStyle = 'rgba(230,232,242,.7)'; x.fillText('PREMIUM NATURAL GEMSTONES', 1024, 400);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; lidTexMat.map?.dispose(); lidTexMat.map = t; lidTexMat.needsUpdate = true;
    const c2 = document.createElement('canvas'); c2.width = 2048; c2.height = 1036; const y = c2.getContext('2d')!;
    y.fillStyle = '#0b1a12'; y.fillRect(0, 0, 2048, 1036); y.textAlign = 'center'; y.textBaseline = 'middle'; y.fillStyle = 'rgba(150,235,190,.62)';
    y.font = `500 54px ${mono}`; if ('letterSpacing' in y) (y as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = '18px'; y.fillText('TIMELESS BEAUTY FROM EARTH', 1024, 518);
    const t2 = new THREE.CanvasTexture(c2); t2.colorSpace = THREE.SRGBColorSpace; lineTexMat.map?.dispose(); lineTexMat.map = t2; lineTexMat.needsUpdate = true;
  }

  const mix = (a: State, b: State, k: number): State => ({ x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), sc: lerp(a.sc, b.sc, k), rx: lerp(a.rx, b.rx, k), ry: lerp(a.ry, b.ry, k), rz: lerp(a.rz, b.rz, k) });
  function place(S: Group3, st: State, yOff: number, spin: number) {
    const [wx, wy] = px2w(st.x, st.y); S.g.position.set(wx + (st.dx || 0), wy + yOff, 0); S.g.scale.setScalar(st.sc); S.g.rotation.set(st.rx, st.ry, st.rz); S.sp.rotation.y = spin;
  }
  const tmp = new THREE.Vector3(), m4 = new THREE.Matrix4(), qq = new THREE.Quaternion(), ee = new THREE.Euler(), sv = new THREE.Vector3();
  function updSparks(cutY: number, cx: number, R: number, t: number, lv: number) {
    const p = sparks.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) { const h = Math.sin(i * 12.9898) * 43758.5453, f = h - Math.floor(h), ph = (t * 1.6 + f) % 1;
      p.setXYZ(i, cx + (f * 2 - 1) * R * 0.62 * (1 - 0.25 * ph), cutY + ph * R * 0.22 * (f > 0.5 ? 1 : -0.6) + Math.sin(i * 3.1 + t * 9) * 0.01, 0.2); }
    p.needsUpdate = true; (sparks.material as THREE.PointsMaterial).opacity = lv; (sparks.material as THREE.PointsMaterial).size = 0.06 + 0.05 * lv;
  }
  function update3D(s: number, t: number) {
    const fall = RM ? 0 : 1 - eOut(seg(t, 0, 2.3));
    let st: State = { x: Lo.hero.x, y: Lo.hero.y, sc: Lo.hero.sc, rx: 1.0, ry: 0.32, rz: -0.52 };
    st = mix(st, { x: Lo.ana.x, y: Lo.ana.y, sc: Lo.ana.sc, rx: 0.24, ry: 0, rz: 0 }, eIO(seg(s, 1.0, 2.0)));
    st = mix(st, { x: Lo.word.x, y: Lo.word.y, sc: Lo.word.sc * 0.92, rx: 0.5, ry: 0.45, rz: -0.12 }, eIO(seg(s, 3.15, 4.1)));
    st.rx += Math.sin(t * 1.3) * 0.3 * fall; st.rz += Math.sin(t * 1.7 + 0.5) * 0.55 * fall; st.dx = Math.sin(t * 2.1) * 0.5 * fall * st.sc;
    const yOff = fall * H * 0.78 + eIn(seg(s, 4.75, 5.35)) * H * 0.95 + Math.sin(t * 0.9) * 0.035 * st.sc;
    place(ruby, st, yOff, (RM ? t * 0.12 : t * 0.35) + s * 1.4); ruby.g.visible = s < 5.4;
    const cp = eIO(seg(s, 0.12, 0.95)), R = 2.2 * st.sc, cy = ruby.g.position.y;
    const cutY = cp <= 0 ? 1e9 : cp >= 1 ? -1e9 : lerp(cy + R, cy - R, cp);
    const mat = rFull.material as THREE.ShaderMaterial & THREE.Material;
    if ((mat as THREE.ShaderMaterial).uniforms) (mat as THREE.ShaderMaterial).uniforms.uCutY.value = cutY;
    clipCut.constant = -cutY; if (tier === 'C') (rFull.material as THREE.Material).clippingPlanes = cp < 1 ? [clipCut] : null;
    clipRough.constant = cutY; rough.visible = cp < 1;
    const lv = cp > 0 && cp < 1 ? Math.pow(Math.sin(cp * Math.PI), 0.5) : 0; laser.visible = laserCore.visible = lv > 0.002;
    if (!laser.visible) sparks.visible = false;
    else {
      laser.position.set(ruby.g.position.x, cutY, 0); laser.scale.set(R * 2.6, R * 0.2, 1); (laser.material as THREE.MeshBasicMaterial).opacity = lv;
      laserCore.position.copy(laser.position); laserCore.scale.set(R * 1.9, 0.0035 * H, 1); (laserCore.material as THREE.MeshBasicMaterial).opacity = lv * 0.9;
      sparks.visible = true; updSparks(cutY, ruby.g.position.x, R, t, lv);
    }
    const ex = eIO(seg(s, 1.6, 2.3)) * (1 - eIO(seg(s, 3.0, 3.45))), pieces = ex > 0.0005;
    rFull.visible = !pieces; rCrown.visible = rPav.visible = pieces; rCrown.position.y = 0.8 * ex; rPav.position.y = -0.7 * ex; rubyEx = ex;
    const conv = (S: Group3, a: number, b: number, c: number, d: number, rz: number, ry: number, rx: number, scK: number) => {
      const pin = eOut(seg(s, a, b)), pout = eIn(seg(s, c, d)); S.g.visible = pin > 0 && pout < 1; if (!S.g.visible) return;
      place(S, { x: Lo.word.x, y: Lo.word.y, sc: Lo.word.sc * scK, rx, ry, rz }, -(1 - pin) * H * 0.95 + pout * H * 0.95 + Math.sin(t * 0.9 + a) * 0.035 * Lo.word.sc, (RM ? t * 0.12 : t * 0.35) + s * 1.4 + a);
    };
    conv(saph, 4.85, 5.5, 6.2, 6.8, 0.14, -0.2, 0.46, 1); conv(emer, 6.3, 6.95, 7.65, 8.25, -0.2, 0.45, 0.46, 1.05);
    const ps = Math.min(H, W * 1.15);
    for (const P of PART) {
      const [a, b, c, d] = P.winR; const v = win(s, a, b, c, d); P.m.visible = v > 0.002 && tier !== 'C'; if (!P.m.visible) continue; const mid = (b + c) / 2;
      P.items.forEach((it, i) => {
        const k = (CAMZ - it.z) / CAMZ; const show = (tier === 'A' || i < 6) && (!phone || (i < 6 && Math.abs(it.ny) < 0.5));
        ee.set(it.ax + t * it.sp * 0.6, it.ay + t * it.sp, 0); qq.setFromEuler(ee);
        tmp.set(it.nx * W * 0.5 * k, it.ny * H * 0.5 * k - (s - mid) * (0.9 + -it.z * 0.25) + (1 - eOut(seg(s, a, b))) * -0.6, it.z);
        sv.setScalar(show ? it.sz * ps * v : 0); m4.compose(tmp, qq, sv); P.m.setMatrixAt(i, m4);
      });
      P.m.instanceMatrix.needsUpdate = true;
    }
    const rise = eOut(seg(s, 7.8, 8.75)), open = eIO(seg(s, 8.55, 9.15)); box.visible = s > 7.7;
    if (box.visible) {
      const [bx, by] = px2w(Lo.box.x, Lo.box.y); box.position.set(bx, by - (1 - rise) * H * 1.05 + Math.sin(t * 0.8) * 0.02, 0); box.scale.setScalar(Lo.box.sc);
      box.rotation.set(0.62 + (1 - rise) * 0.55, (phone ? -0.18 : -0.34) + (1 - rise) * 0.35, 0.03 * (1 - rise)); lidPivot.rotation.x = -1.95 * open;
      slots.forEach((sl, i) => { const d = seg(s, 8.95 + i * 0.12, 9.45 + i * 0.12); sl.g.visible = d > 0; sl.g.position.y = 0.5 + (1 - eBack(d)) * 4.2; sl.sm.rotation.set(0, t * 0.3 + i * 1.3 + (1 - d) * 3, 0); });
    }
  }
  const anchors: Record<string, THREE.Vector3> = { table: new THREE.Vector3(0, 0.27, 0), crown: new THREE.Vector3(0.74, 0.16, 0), girdle: new THREE.Vector3(-0.98, 0, 0), pav: new THREE.Vector3(-0.4, -0.42, 0) };
  function updLeaders() {
    const labs = fx.filter(o => o.lab), vis = labs.some(o => (o.v || 0) > 0.003);
    if (!vis || !renderer || tier === 'D') { if (svg.firstChild) svg.innerHTML = ''; return; }
    ruby.g.updateMatrixWorld(true); const sr = stage.getBoundingClientRect(); let html = '';
    for (const o of labs) {
      if ((o.v || 0) <= 0.003) continue; const key = o.el.dataset.a || 'table'; const a = anchors[key].clone();
      if (key === 'table' || key === 'crown') a.y += 0.8 * rubyEx; else a.y -= 0.7 * rubyEx;
      a.applyMatrix4(ruby.g.matrixWorld).project(camera); const ax = (a.x + 1) / 2 * vw, ay = (1 - a.y) / 2 * vh;
      const r = o.el.getBoundingClientRect(), h = (o.el.querySelector('h4') as HTMLElement).getBoundingClientRect(), ly = h.bottom - sr.top + 5, right = o.el.dataset.side === 'r';
      const x0 = (right ? r.left : r.right) - sr.left + (right ? -10 : 10), x1 = right ? Math.min(r.right - sr.left, x0 + h.width + 40) : Math.max(r.left - sr.left, x0 - h.width - 40);
      html += `<g style="opacity:${(o.v || 0).toFixed(3)}"><polyline points="${ax.toFixed(1)},${ay.toFixed(1)} ${x0.toFixed(1)},${ly.toFixed(1)} ${x1.toFixed(1)},${ly.toFixed(1)}"/><circle cx="${ax.toFixed(1)}" cy="${ay.toFixed(1)}" r="3"/><circle cx="${ax.toFixed(1)}" cy="${ay.toFixed(1)}" r="8" class="ag-ring"/></g>`;
    }
    svg.innerHTML = html;
  }

  // ---------- tiers, governor, debug ----------
  function setTier(t: Tier) {
    tier = t; root.classList.toggle('ag-tierD', t === 'D');
    if (renderer && env) { applyTierToStones(stones, t, env); for (const P of PART) (P.m.material as THREE.ShaderMaterial).uniforms.uBounces.value = TCFG[t].b[2]; }
    layout();
  }
  const dts: number[] = []; let slow = 0, compileMs = 0;
  function governor(dt: number) {
    if (!renderer || tier === 'C' || tier === 'D') return; slow = dt > 0.024 ? slow + 1 : 0;
    if (slow > 45) { slow = 0; const pr = renderer.getPixelRatio(); if (pr > 1.01) { renderer.setPixelRatio(Math.max(1, pr - 0.25)); renderer.setSize(vw, vh, false); } else setTier(tier === 'A' ? 'B' : 'C'); }
  }
  const debugOn = location.hash === '#debug';
  let dbg: HTMLDivElement | null = null, test: { start: number; bins: number[][]; done: boolean; report?: string } | null = null;
  if (debugOn) { dbg = document.createElement('div'); dbg.className = 'ag-debug'; document.body.appendChild(dbg); }
  function gpuName() { try { const gl = renderer!.getContext(); const ext = gl.getExtension('WEBGL_debug_renderer_info'); return String(ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER)); } catch { return 'hidden'; } }
  const gpu = renderer ? gpuName() : 'none';
  function drawDebug() {
    if (!dbg) return; const avg = dts.reduce((a, b) => a + b, 0) / Math.max(1, dts.length), worst = Math.max(0, ...dts);
    dbg.textContent = `fps ${(1 / avg).toFixed(0)}  worst ${(worst * 1000).toFixed(0)} ms\ntier ${tier}  dpr ${renderer ? renderer.getPixelRatio().toFixed(2) : '-'}  bounces ${TCFG[tier].b.join('/')}\ncompile ${compileMs.toFixed(0)} ms  ${renderer ? 'WebGL2' : 'no WebGL'}\ngpu ${gpu.slice(0, 46)}\ns ${sCur.toFixed(2)}${test?.done ? '\n' + test.report : ''}\n`;
    const b = document.createElement('button'); b.type = 'button'; b.textContent = 'Scroll test (20 s)'; b.onclick = () => { test = { start: performance.now(), bins: [[], [], [], []], done: false }; }; dbg.appendChild(b);
  }
  function runTest(now: number) {
    if (!test || test.done) return; const T = (now - test.start) / 20000;
    if (T >= 1) { const names = ['hero', 'anatomy', 'words', 'box']; test.report = test.bins.map((b, i) => { if (!b.length) return names[i] + ' -'; const a = b.reduce((x, y) => x + y, 0) / b.length; return `${names[i]} avg ${(1 / a).toFixed(0)} min ${(1 / Math.max(...b)).toFixed(0)} fps`; }).join('\n'); test.done = true; return; }
    const range = scroller.offsetHeight - stage.offsetHeight, top = scroller.getBoundingClientRect().top + scrollY; scrollTo(0, top + T * range);
    test.bins[sCur < 1.4 ? 0 : sCur < 3.4 ? 1 : sCur < 8 ? 2 : 3].push(dts[dts.length - 1] || 0.016);
  }

  // ---------- loop ----------
  function tick(now: number) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now; time = (now - t0) / 1000;
    runTest(now);
    sCur = sCur + (sTarget - sCur) * (1 - Math.exp(-dt * 7)); if (Math.abs(sTarget - sCur) < 1e-4) sCur = sTarget;
    updDom(sCur, time); bgUpdate(sCur);
    if (renderer && env && tier !== 'D' && stageVisible) { update3D(sCur, time); updLeaders(); renderer.render(scene, camera); }
    dts.push(dt); if (dts.length > 60) dts.shift(); governor(dt);
    if (dbg && Math.round(time * 6) % 2 === 0) drawDebug();
    raf = requestAnimationFrame(tick);
  }
  const onScroll = () => readScroll(), onResize = () => { layout(); readScroll(); };
  addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onResize);
  const io = new IntersectionObserver(es => { for (const e of es) stageVisible = e.isIntersecting; }); io.observe(stage);
  const jumpers = qa<HTMLButtonElement>('[data-s]');
  const onJump = (e: Event) => { const v = +((e.currentTarget as HTMLElement).dataset.s || 0); const range = scroller.offsetHeight - stage.offsetHeight, top = scroller.getBoundingClientRect().top + scrollY; scrollTo({ top: top + v / SPAN * range + 1, behavior: RM ? 'auto' : 'smooth' }); };
  jumpers.forEach(b => b.addEventListener('click', onJump));
  const onLost = (e: Event) => { e.preventDefault(); setTier('D'); }, onRestored = () => location.reload();

  let disposed = false;
  (async () => {
    if (renderer) {
      setupRenderer(renderer); host.appendChild(renderer.domElement);
      renderer.domElement.addEventListener('webglcontextlost', onLost); renderer.domElement.addEventListener('webglcontextrestored', onRestored);
      env = buildEnv(renderer, TCFG[tier].cube); build(env); applyTierToStones(stones, tier === 'D' ? 'A' : tier, env);
    }
    layout(); readScroll();
    try { await document.fonts.ready; } catch { /* fonts are optional */ }
    if (disposed) return;
    drawDecals();
    if (renderer && tier !== 'D') {
      const c0 = performance.now(); try { await renderer.compileAsync(scene, camera); } catch { /* compile errors surface on first render */ }
      compileMs = performance.now() - c0; if (compileMs > 3000 && tier !== 'C') setTier('C');
    }
    if (disposed) return;
    root.classList.add('ag-ready'); t0 = performance.now(); last = t0; raf = requestAnimationFrame(tick);
  })();

  return {
    dispose() {
      disposed = true; cancelAnimationFrame(raf); removeEventListener('scroll', onScroll); removeEventListener('resize', onResize); io.disconnect();
      jumpers.forEach(b => b.removeEventListener('click', onJump)); dbg?.remove();
      if (renderer) { renderer.domElement.removeEventListener('webglcontextlost', onLost); renderer.domElement.removeEventListener('webglcontextrestored', onRestored);
        disposeScene(scene); env?.cubeRT.dispose(); env?.envTex.dispose(); renderer.dispose(); renderer.domElement.remove(); }
    },
  };
}
