/**
 * Shared 3D core for the Asian Gemstone redesign: facet geometry, the ray-traced
 * stone shader, the studio environment and quality tiers. Client-only (uses WebGL).
 */
import * as THREE from 'three';

export const D2R = Math.PI / 180;
export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const seg = (s: number, a: number, b: number) => clamp((s - a) / (b - a));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const eOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const eIn = (t: number) => t * t * t;
export const eIO = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const eBack = (t: number) => { const c1 = 1.25, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
export const win = (s: number, a: number, b: number, c: number, d: number) => eOut(seg(s, a, b)) * (1 - eIn(seg(s, c, d)));

/* ---------------- facet geometry ---------------- */
type V3 = THREE.Vector3;
export interface Plane { n: V3; d: number }
export interface Cut { geo: THREE.BufferGeometry; planes: THREE.Vector4[]; count: number }

const vec = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
const polar = (a: number, phi: number, up: number) => vec(Math.sin(a) * Math.cos(phi), up * Math.cos(a), Math.sin(a) * Math.sin(phi));
const through = (n: V3, p: V3): Plane => { const m = n.clone().normalize(); return { n: m, d: m.dot(p) }; };
export const stretch = (planes: Plane[], sx: number, sy: number, sz: number): Plane[] =>
  planes.map(({ n, d }) => { const m = vec(n.x / sx, n.y / sy, n.z / sz), l = m.length(); return { n: m.divideScalar(l), d: d / l }; });

export const GT = 0.035, GB = -0.035;
export const TOP_Y = GT + (1 - 0.53 / Math.cos(Math.PI / 8)) * Math.tan(34.5 * D2R);

/** Round brilliant, 73 planes: table, 8 bezel, 8 star, 8 pavilion mains, 16 upper + 16 lower girdle, 16 girdle. */
export function brilliantPlanes(): Plane[] {
  const P: Plane[] = [], tableA = 0.53, crownA = 34.5 * D2R, pavA = 40.8 * D2R;
  const top = TOP_Y;
  P.push(through(vec(0, 1, 0), vec(0, top, 0)));
  for (let k = 0; k < 8; k++) {
    const phi = k * Math.PI / 4, ps = phi + Math.PI / 8;
    P.push(through(polar(crownA, phi, 1), vec(Math.cos(phi), GT, Math.sin(phi))));
    P.push(through(polar(21.5 * D2R, ps, 1), vec(tableA * Math.cos(ps), top, tableA * Math.sin(ps))));
    P.push(through(polar(pavA, phi, -1), vec(Math.cos(phi), GB, Math.sin(phi))));
  }
  for (let j = 0; j < 16; j++) {
    const phi = (j + 0.5) * Math.PI / 8;
    P.push(through(polar(42 * D2R, phi, 1), vec(Math.cos(phi), GT, Math.sin(phi))));
    P.push(through(polar(43 * D2R, phi, -1), vec(Math.cos(phi), GB, Math.sin(phi))));
  }
  for (let j = 0; j < 16; j++) { const phi = j * Math.PI / 8, n = vec(Math.cos(phi), 0, Math.sin(phi)); P.push(through(n, n.clone())); }
  return P;
}

/** Emerald (step) cut, 57 planes: octagonal girdle, 3 crown steps, table, 3 pavilion steps. */
export function emeraldPlanes(): Plane[] {
  const P: Plane[] = [], L = 1.32, Wd = 1, c = 0.26, gt = 0.04, gb = -0.04, cd = (L + Wd - c) / Math.SQRT2;
  const dirs: { u: V3; d: number }[] = [[1, 0, L], [-1, 0, L], [0, 1, Wd], [0, -1, Wd]].map(([x, z, d]) => ({ u: vec(x, 0, z), d }));
  for (const sx of [1, -1]) for (const sz of [1, -1]) dirs.push({ u: vec(sx, 0, sz).normalize(), d: cd });
  const crown = [[0, gt], [0.14, gt + 0.1], [0.27, gt + 0.18], [0.38, gt + 0.23]];
  const pav = [[0, gb], [0.24, gb - 0.24], [0.5, gb - 0.47], [1.1, gb - 0.86]];
  for (const { u, d } of dirs) {
    P.push({ n: u.clone(), d });
    for (let i = 0; i < 3; i++) {
      const [i0, y0] = crown[i], [i1, y1] = crown[i + 1];
      const n = u.clone().multiplyScalar(y1 - y0).add(vec(0, i1 - i0, 0)).normalize();
      P.push({ n, d: n.dot(u.clone().multiplyScalar(d - i0).add(vec(0, y0, 0))) });
    }
    for (let i = 0; i < 3; i++) {
      const [i0, y0] = pav[i], [i1, y1] = pav[i + 1];
      const n = u.clone().multiplyScalar(y0 - y1).add(vec(0, -(i1 - i0), 0)).normalize();
      P.push({ n, d: n.dot(u.clone().multiplyScalar(d - i0).add(vec(0, y0, 0))) });
    }
  }
  P.push({ n: vec(0, 1, 0), d: crown[3][1] });
  return P;
}

export function roughPlanes(seed: number): Plane[] {
  let x = seed; const rnd = () => { x = (x * 16807) % 2147483647; return (x - 1) / 2147483646; };
  const P: Plane[] = [];
  // hexagonal beryl prism, big enough to hold the emerald cut (girdle corners reach 1.51 from the axis)
  for (let j = 0; j < 6; j++) { const a = j * Math.PI / 3 + (rnd() - 0.5) * 0.12; P.push({ n: vec(Math.cos(a), (rnd() - 0.5) * 0.08, Math.sin(a)).normalize(), d: 1.62 + rnd() * 0.12 }); }
  P.push({ n: vec((rnd() - 0.5) * 0.35, 1, (rnd() - 0.5) * 0.35).normalize(), d: 1.08 + rnd() * 0.1 });
  P.push({ n: vec((rnd() - 0.5) * 0.35, -1, (rnd() - 0.5) * 0.35).normalize(), d: 1.1 + rnd() * 0.1 });
  for (let j = 0; j < 24; j++) { const th = rnd() * Math.PI * 2, ph = Math.acos(2 * rnd() - 1); P.push({ n: vec(Math.sin(ph) * Math.cos(th), Math.cos(ph), Math.sin(ph) * Math.sin(th)), d: 1.58 + rnd() * 0.24 }); }
  return P;
}

/** Clip a cube by every plane; faces keep the plane's outward normal; only planes that become facets are kept. */
export function buildCut(planes: Plane[], uv = false): Cut {
  const E = 1e-6, S = 4;
  const cv = [[-S, -S, -S], [S, -S, -S], [S, S, -S], [-S, S, -S], [-S, -S, S], [S, -S, S], [S, S, S], [-S, S, S]].map(a => vec(a[0], a[1], a[2]));
  type Face = { pts: V3[]; plane: number };
  let faces: Face[] = [[0, 3, 2, 1], [4, 5, 6, 7], [0, 1, 5, 4], [2, 3, 7, 6], [1, 2, 6, 5], [0, 4, 7, 3]].map(f => ({ pts: f.map(i => cv[i].clone()), plane: -1 }));
  const uniq = (p: V3[]) => { const o: V3[] = []; for (const a of p) if (!o.some(q => q.distanceToSquared(a) < 1e-12)) o.push(a); return o; };
  planes.forEach(({ n, d }, pi) => {
    const next: Face[] = [], cap: V3[] = [];
    for (const f of faces) {
      const out: V3[] = [], P = f.pts;
      for (let i = 0; i < P.length; i++) {
        const a = P[i], b = P[(i + 1) % P.length], da = n.dot(a) - d, db = n.dot(b) - d;
        if (da <= E) { out.push(a); if (da >= -E) cap.push(a); }
        if ((da < -E && db > E) || (da > E && db < -E)) { const p = a.clone().lerp(b, da / (da - db)); out.push(p); cap.push(p); }
      }
      const o = uniq(out); if (o.length >= 3) next.push({ pts: o, plane: f.plane });
    }
    const c = uniq(cap);
    if (c.length >= 3) {
      const ctr = c.reduce((s, p) => s.add(p), vec(0, 0, 0)).divideScalar(c.length);
      const u = new THREE.Vector3().crossVectors(n, Math.abs(n.y) < 0.9 ? vec(0, 1, 0) : vec(1, 0, 0)).normalize(), v = new THREE.Vector3().crossVectors(n, u);
      const ang = (p: V3) => Math.atan2(v.dot(p.clone().sub(ctr)), u.dot(p.clone().sub(ctr)));
      c.sort((p, q) => ang(p) - ang(q)); next.push({ pts: c, plane: pi });
    }
    faces = next;
  });
  const pos: number[] = [], nor: number[] = [], uvs: number[] = [], kept: Plane[] = [], map = new Map<number, number>();
  for (const f of faces) {
    if (f.plane < 0) continue;
    const P = f.pts; let area = 0;
    for (let i = 1; i < P.length - 1; i++) area += new THREE.Vector3().subVectors(P[i], P[0]).cross(new THREE.Vector3().subVectors(P[i + 1], P[0])).length() / 2;
    if (area < 1e-7) continue;
    if (!map.has(f.plane)) { map.set(f.plane, kept.length); kept.push(planes[f.plane]); }
    const n = planes[f.plane].n;
    for (let i = 1; i < P.length - 1; i++) {
      const a = P[0]; let b = P[i], c = P[i + 1];
      if (new THREE.Vector3().subVectors(b, a).cross(new THREE.Vector3().subVectors(c, a)).dot(n) < 0) { const t = b; b = c; c = t; }
      for (const q of [a, b, c]) { pos.push(q.x, q.y, q.z); nor.push(n.x, n.y, n.z); if (uv) uvs.push((Math.atan2(q.z, q.x) / (2 * Math.PI) + 0.5) * 3, q.y * 0.9 + 0.5); }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  if (uv) g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  g.computeBoundingSphere();
  const arr: THREE.Vector4[] = [];
  for (let i = 0; i < 80; i++) { const p = kept[i]; arr.push(p ? new THREE.Vector4(p.n.x, p.n.y, p.n.z, p.d) : new THREE.Vector4()); }
  return { geo: g, planes: arr, count: kept.length };
}

export type CutKey = 'round' | 'oval' | 'emerald' | 'emeraldLong' | 'cushion' | 'crown' | 'pav' | 'emCrown' | 'emPav' | 'rough';
let cutsCache: Record<CutKey, Cut> | null = null;
export function getCuts(): Record<CutKey, Cut> {
  if (cutsCache) return cutsCache;
  const BR = brilliantPlanes(), OV = stretch(BR, 1.32, 1, 1);
  const CUSH = [...BR, ...[[1, 0], [-1, 0], [0, 1], [0, -1]].map(([x, z]) => ({ n: vec(x, 0, z), d: 0.9 }))];
  const capDown = (y: number): Plane => ({ n: vec(0, -1, 0), d: -y }), capUp = (y: number): Plane => ({ n: vec(0, 1, 0), d: y }), EMP = emeraldPlanes();
  cutsCache = {
    round: buildCut(BR), oval: buildCut(OV), emerald: buildCut(emeraldPlanes()), emeraldLong: buildCut(stretch(emeraldPlanes(), 1.1, 1, 0.92)),
    cushion: buildCut(CUSH), crown: buildCut([...OV, capDown(0.036)]), pav: buildCut([...OV, capUp(0.036)]),
    emCrown: buildCut([...EMP, capDown(0.045)]), emPav: buildCut([...EMP, capUp(0.045)]), rough: buildCut(roughPlanes(11), true),
  };
  return cutsCache;
}

/* ---------------- optics ---------------- */
export interface Optics { ior: number; disp: number; sigma: [number, number, number] }
export type OpticsKey = 'ruby' | 'sapphire' | 'emerald' | 'amethyst' | 'aquamarine' | 'topaz' | 'tourmaline';
export const OPT: Record<OpticsKey, Optics> = {
  ruby: { ior: 1.766, disp: 0.012, sigma: [0.38, 6.5, 4.6] },
  sapphire: { ior: 1.766, disp: 0.012, sigma: [5.6, 2.5, 0.22] },
  emerald: { ior: 1.58, disp: 0.009, sigma: [4.4, 0.32, 2.0] },
  amethyst: { ior: 1.544, disp: 0.008, sigma: [1.1, 3.2, 0.9] },
  aquamarine: { ior: 1.577, disp: 0.009, sigma: [2.4, 0.45, 0.28] },
  topaz: { ior: 1.62, disp: 0.01, sigma: [0.12, 0.85, 3.2] },
  tourmaline: { ior: 1.63, disp: 0.01, sigma: [0.28, 3.4, 1.25] },
};
/** Absorption multiplier. 1 for the black & green studio (the light direction used 1.75). */
export const SIGMA_SCALE = 1;

/* ---------------- quality tiers ---------------- */
export type Tier = 'A' | 'B' | 'C' | 'D';
export const TCFG: Record<Tier, { dpr: number; b: [number, number, number]; cube: number }> = {
  A: { dpr: 1.75, b: [5, 4, 3], cube: 512 },
  B: { dpr: 1.5, b: [4, 3, 2], cube: 256 },
  C: { dpr: 1, b: [0, 0, 0], cube: 256 },
  D: { dpr: 1, b: [0, 0, 0], cube: 256 },
};
export function startTier(): Tier {
  const q = typeof location !== 'undefined' ? (location.hash.match(/tier-([ABCD])/) || [])[1] : undefined;
  if (q) return q as Tier;
  if (typeof window === 'undefined') return 'D';
  if (matchMedia('(prefers-reduced-data: reduce)').matches) return 'D';
  return innerWidth < 760 || (navigator.hardwareConcurrency || 8) <= 4 ? 'B' : 'A';
}

/* ---------------- shaders + materials ---------------- */
const VS = /* glsl */`varying vec3 vObj,vCam,vN; varying mat3 vRot; varying float vWy;
void main(){ mat4 M=modelMatrix;
#ifdef USE_INSTANCING
M=modelMatrix*instanceMatrix;
#endif
vObj=position; vN=normal; vCam=(inverse(M)*vec4(cameraPosition,1.)).xyz; vRot=mat3(M); vWy=(M*vec4(position,1.)).y;
gl_Position=projectionMatrix*viewMatrix*M*vec4(position,1.); }`;
const FS = /* glsl */`#define MAXP 80
uniform vec4 uPlanes[MAXP]; uniform int uCount,uBounces; uniform samplerCube envMap;
uniform float uIor,uDisp,uExposure,uCutY; uniform vec3 uSigma;
varying vec3 vObj,vCam,vN; varying mat3 vRot; varying float vWy;
vec3 envW(vec3 d){ return textureCube(envMap,normalize(vRot*d)).rgb; }
float schlick(float c,float f0){ return f0+(1.-f0)*pow(1.-c,5.); }
void main(){
  if(vWy<uCutY) discard;
  vec3 rd=normalize(vObj-vCam), N=normalize(vN); float f0=pow((uIor-1.)/(uIor+1.),2.);
  float Fr=schlick(clamp(-dot(rd,N),0.,1.),f0); vec3 col=Fr*envW(reflect(rd,N));
  vec3 T=refract(rd,N,1./uIor), p=vObj, thr=vec3(1.-Fr);
  for(int b=0;b<6;b++){ if(b>=uBounces)break; float tmin=1e9; vec3 ne=vec3(0,1,0);
    for(int i=0;i<MAXP;i++){ if(i>=uCount)break; vec4 pl=uPlanes[i]; float den=dot(pl.xyz,T);
      if(den>1e-5){ float t=(pl.w-dot(pl.xyz,p))/den; if(t>1e-4&&t<tmin){tmin=t;ne=pl.xyz;} } }
    if(tmin>1e8)break; p+=T*tmin; thr*=exp(-uSigma*tmin);
    vec3 tg=refract(T,-ne,uIor); if(dot(tg,tg)<1e-6){ T=reflect(T,ne); continue; }
    vec3 tr=refract(T,-ne,uIor-uDisp); if(dot(tr,tr)<1e-6)tr=tg; vec3 tb=refract(T,-ne,uIor+uDisp); if(dot(tb,tb)<1e-6)tb=tg;
    float Fe=schlick(clamp(dot(tg,ne),0.,1.),f0);
    col+=thr*(1.-Fe)*vec3(envW(tr).r,envW(tg).g,envW(tb).b); thr*=Fe; T=reflect(T,ne); }
  col+=thr*envW(T)*.6; gl_FragColor=vec4(col*uExposure,1.);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

export interface StoneEnv { cubeRT: THREE.WebGLCubeRenderTarget; envTex: THREE.Texture }
export interface StoneRecord { mesh: THREE.Mesh; rank: 0 | 1 | 2; ray: THREE.ShaderMaterial; phys: THREE.MeshPhysicalMaterial | null; opt: Optics }

export function rayMat(cut: Cut, o: Optics, bounces: number, env: StoneEnv): THREE.ShaderMaterial {
  const s = o.sigma.map(v => v * SIGMA_SCALE) as [number, number, number];
  return new THREE.ShaderMaterial({
    vertexShader: VS, fragmentShader: FS, precision: 'highp',
    uniforms: {
      uPlanes: { value: cut.planes }, uCount: { value: cut.count }, uBounces: { value: bounces }, envMap: { value: env.cubeRT.texture },
      uIor: { value: o.ior }, uDisp: { value: o.disp }, uExposure: { value: 1.35 }, uSigma: { value: new THREE.Vector3(...s) }, uCutY: { value: -1e9 },
    },
  });
}
/** Tier C stand-in: tinted, glossy, faceted; keeps the stone's colour without the ray tracer. */
export function physMat(o: Optics, env: StoneEnv): THREE.MeshPhysicalMaterial {
  const c = new THREE.Color(Math.exp(-o.sigma[0] * 0.8), Math.exp(-o.sigma[1] * 0.8), Math.exp(-o.sigma[2] * 0.8));
  c.multiplyScalar(0.85 / Math.max(c.r, c.g, c.b));
  return new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.08, metalness: 0.55, clearcoat: 0.6, clearcoatRoughness: 0.05, iridescence: 0.2, envMap: env.envTex, envMapIntensity: 2, emissive: c.clone().multiplyScalar(0.12) });
}
export function makeStone(registry: StoneRecord[], key: CutKey, optKey: OpticsKey, rank: 0 | 1 | 2, env: StoneEnv): THREE.Mesh {
  const cut = getCuts()[key], o = OPT[optKey];
  const ray = rayMat(cut, o, TCFG.A.b[rank], env);
  const mesh = new THREE.Mesh(cut.geo, ray);
  registry.push({ mesh, rank, ray, phys: null, opt: o });
  return mesh;
}
/** Same as makeStone but with optics built from a colour picked in the admin panel. */
export function makeStoneWith(registry: StoneRecord[], key: CutKey, o: Optics, rank: 0 | 1 | 2, env: StoneEnv): THREE.Mesh {
  const cut = getCuts()[key];
  const ray = rayMat(cut, o, TCFG.A.b[rank], env);
  const mesh = new THREE.Mesh(cut.geo, ray);
  registry.push({ mesh, rank, ray, phys: null, opt: o });
  return mesh;
}
/** Turns the stone's body colour (hex) into absorption: deeper colours absorb more of the other channels. */
export function opticsFromColor(hex: string, ior = 1.6): Optics {
  const c = new THREE.Color(hex); // three.js converts sRGB hex to linear
  const s = (v: number) => Math.min(7, -Math.log(Math.max(0.02, v)) * 1.1);
  return { ior, disp: 0.01, sigma: [s(c.r), s(c.g), s(c.b)] };
}
export function applyTierToStones(registry: StoneRecord[], tier: Tier, env: StoneEnv) {
  for (const r of registry) {
    if (tier === 'C') { if (!r.phys) r.phys = physMat(r.opt, env); r.mesh.material = r.phys; }
    else { r.mesh.material = r.ray; r.ray.uniforms.uBounces.value = TCFG[tier].b[r.rank]; }
  }
}

/* ---------------- studio environment (black & green) ---------------- */
export function setupRenderer(renderer: THREE.WebGLRenderer) {
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.localClippingEnabled = true;
}
export function buildEnv(renderer: THREE.WebGLRenderer, cubeSize: number): StoneEnv {
  const env = new THREE.Scene();
  const sg = new THREE.SphereGeometry(50, 48, 24), col: number[] = [];
  const top = new THREE.Color('#13301f'), mid = new THREE.Color('#07100b'), bot = new THREE.Color('#010302');
  const pa = sg.attributes.position;
  for (let i = 0; i < pa.count; i++) { const y = pa.getY(i) / 50, c = y > 0 ? mid.clone().lerp(top, y) : mid.clone().lerp(bot, -y); col.push(c.r, c.g, c.b); }
  sg.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  env.add(new THREE.Mesh(sg, new THREE.MeshBasicMaterial({ side: THREE.BackSide, vertexColors: true })));
  const panel = (w: number, h: number, c: string, k: number, p: [number, number, number]) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(k), side: THREE.DoubleSide }));
    m.position.set(...p); m.lookAt(0, 0, 0); env.add(m);
  };
  for (const [x, z, k] of [[-4, 2, 7], [0, 4, 8], [4.5, 1, 6.5]]) { // narrow strips, not one big softbox: no flat white facets
    const m = new THREE.Mesh(new THREE.PlaneGeometry(14, 0.9), new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffffff').multiplyScalar(k * 0.6), side: THREE.DoubleSide }));
    m.position.set(x, 15, z); m.lookAt(0, 0, 0); m.rotateZ(0.5); env.add(m);
  }
  panel(4, 14, '#2fe39a', 6, [-15, 1, 4]); panel(4, 14, '#c6f56a', 4.5, [15, 1, 2]);
  panel(12, 1.6, '#ffffff', 3, [0, 6, 16]); panel(2.6, 2.6, '#ffffff', 5.5, [-7, 8, 12]); panel(2.2, 2.2, '#ffffff', 5.5, [8, 6, 12]);
  panel(18, 3, '#7de0b5', 2.5, [0, -13, 6]); panel(6, 10, '#0f7a4f', 4, [0, 2, -16]);
  let sd = 7; const r = () => { sd = (sd * 16807) % 2147483647; return (sd - 1) / 2147483646; };
  const pg = new THREE.SphereGeometry(0.24, 10, 8);
  for (let i = 0; i < 28; i++) {
    const th = r() * Math.PI * 2, ph = Math.acos(2 * r() - 1), R = 21;
    const m = new THREE.Mesh(pg, new THREE.MeshBasicMaterial({ color: new THREE.Color(1, 1, 1).multiplyScalar(6 + r() * 10) }));
    m.position.set(R * Math.sin(ph) * Math.cos(th), R * Math.cos(ph), R * Math.sin(ph) * Math.sin(th)); env.add(m);
  }
  const cubeRT = new THREE.WebGLCubeRenderTarget(cubeSize, { type: THREE.HalfFloatType, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter });
  new THREE.CubeCamera(0.1, 100, cubeRT).update(renderer, env);
  const pm = new THREE.PMREMGenerator(renderer);
  const envTex = pm.fromScene(env, 0.03).texture;
  pm.dispose();
  return { cubeRT, envTex };
}
export function addLights(scene: THREE.Scene) {
  scene.add(new THREE.HemisphereLight(0x9ff0c8, 0x030805, 0.3));
  const key = new THREE.DirectionalLight(0xffffff, 1.3); key.position.set(2, 6, 7); scene.add(key);
  const b = new THREE.DirectionalLight(0x2fe39a, 3.0); b.position.set(-7, 2, -3); scene.add(b);
  const p = new THREE.DirectionalLight(0xc6f56a, 2.2); p.position.set(7, 1, -3); scene.add(p);
}
/** Matte, bumpy skin for the rough beryl crystal (home film and About page). */
export function roughMaterial(clip?: THREE.Plane[]): THREE.MeshPhysicalMaterial {
  const c = document.createElement('canvas'); c.width = c.height = 512; const x = c.getContext('2d')!;
  x.fillStyle = '#808080'; x.fillRect(0, 0, 512, 512); let sd = 3; const r = () => { sd = (sd * 16807) % 2147483647; return (sd - 1) / 2147483646; };
  for (let i = 0; i < 900; i++) { const cx = r() * 512, cy = r() * 512, rr = 2 + r() * 14; x.fillStyle = `rgba(${r() < 0.5 ? 255 : 0},${r() < 0.5 ? 255 : 0},${r() < 0.5 ? 255 : 0},${0.04 + r() * 0.1})`; x.beginPath(); x.ellipse(cx, cy, rr, rr * (0.4 + r() * 0.6), r() * 3, 0, 6.3); x.fill(); }
  const id = x.getImageData(0, 0, 512, 512); for (let i = 0; i < id.data.length; i += 4) { const n = (r() - 0.5) * 70; id.data[i] += n; id.data[i + 1] += n; id.data[i + 2] += n; } x.putImageData(id, 0, 0);
  const tex = new THREE.CanvasTexture(c); tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return new THREE.MeshPhysicalMaterial({ color: 0x1b4a30, emissive: 0x031009, roughness: 0.85, roughnessMap: tex, bumpMap: tex, bumpScale: 2.6, clearcoat: 0.35, clearcoatRoughness: 0.5, sheen: 0.4, sheenColor: new THREE.Color(0x58d39a), sheenRoughness: 0.6, side: THREE.DoubleSide, clippingPlanes: clip });
}
export function createRenderer(): THREE.WebGLRenderer | null {
  try { return new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' }); }
  catch { return null; }
}
export function disposeScene(scene: THREE.Scene) {
  scene.traverse(o => {
    const m = o as THREE.Mesh;
    if (m.geometry) m.geometry.dispose();
    const mat = m.material as THREE.Material | THREE.Material[] | undefined;
    if (Array.isArray(mat)) mat.forEach(x => x.dispose()); else if (mat) mat.dispose();
  });
}
