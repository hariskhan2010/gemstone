/**
 * Draggable 3D viewer for one stone page. Client-only.
 */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import {
  D2R, clamp, TCFG, startTier, setupRenderer, buildEnv, addLights, createRenderer, makeStone, applyTierToStones, disposeScene, getCuts, roughMaterial, makeStoneWith, opticsFromColor,
  type StoneRecord, type Tier, type CutKey, type OpticsKey, type StoneEnv,
} from './core';
import type { ModelKey } from './stones';

export interface StoneViewer { dispose(): void }
/** A built-in stone, a gem from the admin panel (cut + colour), or a photo-to-3D model file. */
export type ViewerModel = ModelKey | 'rough' | { cut: CutKey; color: string } | { glb: string };
/** fit scales the model inside its stage (fitPhone below 760 px); offsetY moves it up as a share of the stage height. */
export interface ViewerOptions { fit?: number; fitPhone?: number; offsetY?: number }

function gold(env: StoneEnv) { return new THREE.MeshPhysicalMaterial({ color: 0xe7b65e, metalness: 1, roughness: 0.22, clearcoat: 0.3, envMap: env.envTex }); }

function loadGlb(url: string): THREE.Group {
  const holder = new THREE.Group();
  new GLTFLoader().load(url, gltf => {
    const obj = gltf.scene; const box = new THREE.Box3().setFromObject(obj);
    const size = box.getSize(new THREE.Vector3()), center = box.getCenter(new THREE.Vector3());
    obj.position.sub(center); const k = 2.2 / Math.max(size.x, size.y, size.z, 1e-6);
    holder.scale.setScalar(k); holder.add(obj);
  }, undefined, () => { /* a failed model leaves the fallback image visible */ });
  return holder;
}

function buildModel(id: ViewerModel, stones: StoneRecord[], env: StoneEnv, font: { display: string; mono: string }): THREE.Group {
  if (typeof id === 'object' && 'glb' in id) return loadGlb(id.glb);
  if (typeof id === 'object') {
    const g = new THREE.Group(); g.add(makeStoneWith(stones, id.cut, opticsFromColor(id.color), 0, env)); g.rotation.x = 1.05; return g;
  }
  const one = (ck: CutKey, ok: OpticsKey, s = 1) => { const g = new THREE.Group(); g.add(makeStone(stones, ck, ok, 0, env)); g.scale.setScalar(s); g.rotation.x = 1.05; return g; };
  switch (id) {
    case 'rough': { const g = new THREE.Group(); g.add(new THREE.Mesh(getCuts().rough.geo, roughMaterial())); g.scale.setScalar(0.82); g.rotation.set(0.25, 0, 0.1); return g; }
    case 'ruby': return one('oval', 'ruby');
    case 'sapphire': return one('round', 'sapphire', 1.1);
    case 'emerald': return one('emerald', 'emerald');
    case 'aquamarine': return one('emeraldLong', 'aquamarine');
    case 'amethyst': return one('cushion', 'amethyst', 1.08);
    case 'topaz-tourmaline': {
      const g = new THREE.Group();
      const ga = new THREE.Group(); ga.add(makeStone(stones, 'oval', 'topaz', 1, env)); ga.position.set(-0.72, 0.12, 0); ga.scale.setScalar(0.66); ga.rotation.set(1.05, 0, 0.25);
      const gb = new THREE.Group(); gb.add(makeStone(stones, 'emerald', 'tourmaline', 1, env)); gb.position.set(0.78, -0.12, 0); gb.scale.setScalar(0.6); gb.rotation.set(1.0, 0, -0.3);
      g.add(ga, gb); return g;
    }
    case 'rings': {
      const g = new THREE.Group();
      const band = new THREE.Mesh(new THREE.TorusGeometry(1, 0.06, 40, 180), gold(env)); band.scale.set(1, 1, 1.5); g.add(band);
      const head = new THREE.Group(); head.position.set(0, 1.14, 0); g.add(head);
      const bez = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.2, 0.09, 48, 1, true), gold(env)); bez.position.y = -0.07; bez.scale.z = 0.8; head.add(bez);
      for (let i = 0; i < 4; i++) {
        const a = i * Math.PI / 2 + Math.PI / 4;
        const B = new THREE.Vector3(Math.cos(a) * 0.46, -0.05, Math.sin(a) * 0.35), T = new THREE.Vector3(Math.cos(a) * 0.3, 0.26, Math.sin(a) * 0.23);
        const d = T.clone().sub(B), L = d.length();
        const pr = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.034, L, 12), gold(env)); pr.position.copy(B).add(T).multiplyScalar(0.5);
        pr.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); head.add(pr);
        const tip = new THREE.Mesh(new THREE.SphereGeometry(0.036, 14, 10), gold(env)); tip.position.copy(T); tip.scale.set(1.35, 0.5, 1.35); head.add(tip);
      }
      const sg = new THREE.Group(); sg.add(makeStone(stones, 'oval', 'ruby', 0, env)); sg.scale.setScalar(0.36); sg.position.y = 0.17; head.add(sg);
      g.rotation.set(0.18, 0, 0); g.scale.setScalar(1.05); g.position.y = -0.35; return g;
    }
    case 'carved': {
      const g = new THREE.Group();
      const vc = document.createElement('canvas'); vc.width = vc.height = 512; const vx = vc.getContext('2d')!; vx.fillStyle = '#ffffff'; vx.fillRect(0, 0, 512, 512);
      let vs = 21; const vr = () => { vs = (vs * 16807) % 2147483647; return (vs - 1) / 2147483646; };
      for (let i = 0; i < 26; i++) {
        vx.strokeStyle = `rgba(${20 + vr() * 30},${60 + vr() * 40},${40 + vr() * 30},${0.05 + vr() * 0.1})`; vx.lineWidth = 1 + vr() * 7; vx.beginPath();
        let px = vr() * 512, py = vr() * 512; vx.moveTo(px, py);
        for (let k = 0; k < 6; k++) { px += (vr() - 0.5) * 220; py += (vr() - 0.3) * 160; vx.quadraticCurveTo(px + (vr() - 0.5) * 80, py + (vr() - 0.5) * 80, px, py); }
        vx.stroke();
      }
      const vt = new THREE.CanvasTexture(vc); vt.colorSpace = THREE.SRGBColorSpace;
      const jade = new THREE.MeshPhysicalMaterial({ color: 0x1d5a42, map: vt, roughness: 0.34, clearcoat: 0.7, clearcoatRoughness: 0.2, sheen: 0.25, sheenColor: new THREE.Color(0x7fd0a8), envMap: env.envTex, envMapIntensity: 0.8 });
      const geo = new RoundedBoxGeometry(2.6, 1.6, 0.42, 6, 0.07), p = geo.attributes.position;
      for (let i = 0; i < p.count; i++) { const X = p.getX(i), Y = p.getY(i), Z = p.getZ(i), n = Math.sin(X * 3.1 + Y * 1.3) * Math.cos(Y * 2.7 - X * 0.8); p.setXYZ(i, X * (1 + 0.03 * n) + 0.035 * Math.sin(Y * 2.2), Y * (1 + 0.03 * Math.sin(X * 2.4)), Z * (1 + 0.02 * n)); }
      geo.computeVertexNormals(); g.add(new THREE.Mesh(geo, jade));
      const c = document.createElement('canvas'); c.width = 1024; c.height = 640; const x = c.getContext('2d')!;
      x.textAlign = 'center'; x.textBaseline = 'middle';
      const line = (txt: string, y: number, f: string, ls: string) => { x.font = f; if ('letterSpacing' in x) (x as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = ls;
        x.fillStyle = 'rgba(255,255,255,.3)'; x.fillText(txt, 512, y + 3); x.fillStyle = 'rgba(18,45,34,.9)'; x.fillText(txt, 512, y); };
      line('SWAT VALLEY', 280, `600 76px ${font.display}`, '10px'); line('35.22° N · 72.42° E', 385, `600 46px ${font.mono}`, '4px');
      x.strokeStyle = 'rgba(8,30,20,.45)'; x.lineWidth = 3; x.strokeRect(130, 150, 764, 340);
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
      const decal = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.5), new THREE.MeshStandardMaterial({ transparent: true, roughness: 0.6, metalness: 0, map: t }));
      decal.position.z = 0.232; decal.scale.set(0.92, 0.92, 1); g.add(decal);
      g.rotation.set(-0.15, 0, 0); return g;
    }
  }
}

export function createStoneViewer(host: HTMLElement, id: ViewerModel, opts: ViewerOptions = {}): StoneViewer {
  const renderer = createRenderer();
  let tier: Tier = renderer ? startTier() : 'D';
  const root = host.closest('.ag-pv-stage') as HTMLElement | null;
  root?.classList.toggle('ag-tierD', tier === 'D');
  if (!renderer || tier === 'D') return { dispose() { /* nothing rendered */ } };
  setupRenderer(renderer); host.appendChild(renderer.domElement);
  const env = buildEnv(renderer, TCFG[tier].cube);
  const scene = new THREE.Scene(); scene.environment = env.envTex; scene.environmentIntensity = 0.7; addLights(scene);
  const cs = getComputedStyle(host);
  const font = { display: cs.getPropertyValue('--ag-font-display').trim() || 'Arial, sans-serif', mono: cs.getPropertyValue('--ag-font-mono').trim() || 'monospace' };
  const stones: StoneRecord[] = [];
  const g = new THREE.Group(); g.rotation.order = 'YXZ'; scene.add(g); g.add(buildModel(id, stones, env, font));
  applyTierToStones(stones, tier, env);
  const cam = new THREE.PerspectiveCamera(30, 1, 0.1, 100); cam.position.set(0, 0, 10);
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let rx = -0.32, ry = 0.6, vx = 0, vy = 0, drag = false, lx = 0, ly = 0, fit = 1.2, oy = 0, raf = 0, last = performance.now(), visible = true, slow = 0;
  const t0 = last;
  function layout() {
    const r = host.getBoundingClientRect(); const w = Math.max(1, r.width), h = Math.max(1, r.height);
    renderer!.setPixelRatio(Math.min(devicePixelRatio || 1, TCFG[tier].dpr)); renderer!.setSize(w, h, false);
    cam.aspect = w / h; cam.updateProjectionMatrix();
    const fitH = 2 * Math.tan(15 * D2R) * 10, k = (innerWidth < 760 && opts.fitPhone) || opts.fit || 1;
    fit = Math.min(fitH * cam.aspect * 0.27, fitH * 0.3) * k; oy = (opts.offsetY || 0) * fitH;
  }
  const area = root || host;
  const down = (e: PointerEvent) => { drag = true; lx = e.clientX; ly = e.clientY; area.setPointerCapture(e.pointerId); };
  const move = (e: PointerEvent) => { if (!drag) return; const dx = e.clientX - lx, dy = e.clientY - ly; lx = e.clientX; ly = e.clientY; ry += dx * 0.01; rx += dy * 0.006; vy = dx * 0.0006; vx = dy * 0.0003; };
  const up = () => { drag = false; };
  area.addEventListener('pointerdown', down); area.addEventListener('pointermove', move); area.addEventListener('pointerup', up); area.addEventListener('pointercancel', up);
  const io = new IntersectionObserver(es => { for (const e of es) visible = e.isIntersecting; }); io.observe(host);
  const ro = new ResizeObserver(layout); ro.observe(host);
  function tick(now: number) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now; const t = (now - t0) / 1000;
    if (!drag) { ry += vy * dt * 60; rx += vx * dt * 60; vy *= Math.pow(0.92, dt * 60); vx *= Math.pow(0.92, dt * 60); if (Math.abs(vy) < 0.0005) ry += (RM ? 0.08 : 0.28) * dt; }
    rx = clamp(rx, -0.9, 0.6); g.rotation.set(rx, ry, 0); g.scale.setScalar(fit); g.position.y = oy + Math.sin(t * 0.9) * 0.04;
    if (visible) renderer!.render(scene, cam);
    slow = dt > 0.024 ? slow + 1 : 0;
    if (slow > 45 && tier !== 'C') { slow = 0; const pr = renderer!.getPixelRatio(); if (pr > 1.01) { renderer!.setPixelRatio(Math.max(1, pr - 0.25)); layout(); } else { tier = tier === 'A' ? 'B' : 'C'; applyTierToStones(stones, tier, env); } }
    raf = requestAnimationFrame(tick);
  }
  layout();
  renderer.compileAsync(scene, cam).catch(() => undefined).finally(() => { root?.classList.add('ag-ready'); raf = requestAnimationFrame(tick); });
  return {
    dispose() {
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect();
      area.removeEventListener('pointerdown', down); area.removeEventListener('pointermove', move); area.removeEventListener('pointerup', up); area.removeEventListener('pointercancel', up);
      disposeScene(scene); env.cubeRT.dispose(); env.envTex.dispose(); renderer.dispose(); renderer.domElement.remove();
    },
  };
}
