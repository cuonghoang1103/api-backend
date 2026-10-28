/**
 * THẾ GIỚI VI MÔ (đơn vị tự do, đã PHÓNG ĐẠI & ĐƠN GIẢN HOÁ): mạch cộng 4 bit của ALU → bên trong một cổng AND (6 transistor
 * CMOS) → mặt cắt một transistor NMOS với electron chạy qua kênh dẫn.
 * Mặt silicon là mặt phẳng y = 0; mạch trải trên XZ, đầu vào ở phía −z (xa), đầu ra ở +z (gần người xem).
 */
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { gradientTex, siliconTex, textTex, type Q } from './tex';
import { frameMaterial, signalMaterial, tube } from './shaders';
import { clamp01, fract, hash1, lerp, sstep } from './util';
import type { Pose } from './macro';

export interface MicroState {
  t: number;
  /** a, b: số 4 bit; at: giây kể từ lúc đặt đầu vào (< 0 = chưa đặt, mọi dây tối) */
  adder: { a: number; b: number; at: number };
  /** 0..1: vỏ cổng AND hoá kính để lộ 6 transistor */
  glass: number;
  /** 0..1: đã chui hẳn vào trong cổng (ẩn vỏ + đường nguồn) */
  deep: number;
  /** 0..1: điện áp cực cổng của transistor */
  gateV: number;
  /** 0..1 độ hiện của mạch cộng (ẩn bớt khi đã ở rất sâu) */
  hl: Record<string, number>;
}

type Kind = 'AND' | 'OR' | 'XOR';
const V = 14; // tốc độ tín hiệu (đơn vị/giây) — chỉ để nhìn
const GD = 0.16; // trễ cổng
const CELL_X = (i: number) => 15 - 10 * i;

function gateShape(kind: Kind) {
  const s = new THREE.Shape();
  if (kind === 'AND') {
    s.moveTo(-0.8, 0.9); s.lineTo(0.8, 0.9); s.lineTo(0.8, 0); s.absarc(0, 0, 0.8, 0, -Math.PI, true); s.lineTo(-0.8, 0.9);
  } else {
    s.moveTo(-0.8, 0.9); s.quadraticCurveTo(0, 0.55, 0.8, 0.9); s.quadraticCurveTo(0.78, -0.25, 0, -0.95); s.quadraticCurveTo(-0.78, -0.25, -0.8, 0.9);
  }
  const shapes = [s];
  if (kind === 'XOR') {
    const b = new THREE.Shape();
    b.moveTo(-0.8, 1.2); b.quadraticCurveTo(0, 0.85, 0.8, 1.2); b.lineTo(0.8, 1.08); b.quadraticCurveTo(0, 0.73, -0.8, 1.08); b.lineTo(-0.8, 1.2);
    shapes.push(b);
  }
  // hình trong mặt phẳng XY, ngõ ra hướng −y ⇒ xoay −90° quanh X: −y → +z (về phía người xem), bề dày đùn → +y (lên trên)
  const g = new THREE.ExtrudeGeometry(shapes, { depth: 0.5, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.04, bevelSegments: 3, curveSegments: 24 });
  g.rotateX(-Math.PI / 2);
  return g;
}

/** Mặt cắt NMOS (đơn vị gốc ~10 × 6 × 6; gốc toạ độ = tâm mặt silicon). */
function buildMosfet(full: boolean, mats: Record<string, THREE.Material>, nElec: number) {
  const g = new THREE.Group();
  const bx = (w: number, h: number, d: number, m: THREE.Material, x: number, y: number, z: number) => {
    const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
    o.position.set(x, y, z);
    o.castShadow = o.receiveShadow = true;
    g.add(o);
    return o;
  };
  bx(10, 3, 6, mats.sub!, 0, -1.5, 0);
  bx(2.8, 1.25, 6.02, mats.well!, -3.3, -0.62, 0);
  bx(2.8, 1.25, 6.02, mats.well!, 3.3, -0.62, 0);
  bx(4.0, 0.16, 5.2, mats.oxide!, 0, 0.08, 0);
  const gate = bx(3.8, 1.2, 5.2, mats.gate!, 0, 0.76, 0);
  for (const x of [-3.3, 3.3]) {
    const c = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 2.5, 16), mats.w!);
    c.position.set(x, 1.25, 0);
    g.add(c);
    bx(1.4, 0.3, 3.2, mats.cu!, x, 2.6, 0);
  }
  const gc = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 1.2, 16), mats.w!);
  gc.position.set(0, 1.95, 0);
  g.add(gc);
  bx(1.4, 0.3, 3.2, mats.cu!, 0, 2.6, 0);
  let channel: THREE.Mesh | null = null, elec: THREE.InstancedMesh | null = null;
  if (full) {
    channel = bx(3.7, 0.32, 5.0, mats.chan!, 0, -0.17, 0);
    channel.castShadow = false;
    elec = new THREE.InstancedMesh(new THREE.SphereGeometry(0.15, 10, 8), mats.elec!, nElec);
    g.add(elec);
  }
  return { g, gate, channel, elec };
}

export function buildMicro(q: Q) {
  const scene = new THREE.Scene();
  scene.background = gradientTex('#0b1733', '#02040a');
  const anchors: Record<string, THREE.Vector3> = {};
  const hi = q === 'high';

  // nền silicon
  const st = siliconTex(q);
  st.repeat.set(6, 4.4);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(64, 46), new THREE.MeshStandardMaterial({ map: st, roughness: 0.35, metalness: 0.55, color: '#9fb3d1' }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  // khung từng bộ cộng đầy đủ
  const faFrames: THREE.ShaderMaterial[] = [];
  for (let i = 0; i < 4; i++) {
    const m = frameMaterial('#38bdf8', 0.012);
    m.uniforms.uAspect!.value = 9.2 / 13.2;
    const pl = new THREE.Mesh(new THREE.PlaneGeometry(9.2, 13.2), m);
    pl.rotation.x = -Math.PI / 2;
    pl.position.set(CELL_X(i), 0.01, 0);
    pl.renderOrder = 3;
    scene.add(pl);
    faFrames.push(m);
  }

  /* ── cổng ── */
  const geo: Record<Kind, THREE.ExtrudeGeometry> = { AND: gateShape('AND'), OR: gateShape('OR'), XOR: gateShape('XOR') };
  const kCol: Record<Kind, string> = { AND: '#38bdf8', OR: '#34d399', XOR: '#f472b6' };
  const labelTex: Record<Kind, THREE.Texture> = {
    AND: textTex([{ t: 'AND', size: 120, color: '#e0f2fe', w: 800 }], { w: 320, h: 160 }),
    OR: textTex([{ t: 'OR', size: 120, color: '#dcfce7', w: 800 }], { w: 320, h: 160 }),
    XOR: textTex([{ t: 'XOR', size: 120, color: '#fce7f3', w: 800 }], { w: 320, h: 160 }),
  };
  type Gate = { kind: Kind; x: number; z: number; mat: THREE.MeshPhysicalMaterial; lbl: THREE.MeshBasicMaterial; out: number; tOut: number; mesh: THREE.Mesh; lblMesh: THREE.Mesh };
  const gates: Gate[][] = [];
  // vị trí cổng trong một ô (x, z) và chân vào/ra
  const L = {
    xor1: { kind: 'XOR' as Kind, x: 0, z: -3.2 }, and1: { kind: 'AND' as Kind, x: -2.6, z: -0.4 },
    xor2: { kind: 'XOR' as Kind, x: 1.8, z: 1.4 }, and2: { kind: 'AND' as Kind, x: -0.4, z: 1.4 }, or: { kind: 'OR' as Kind, x: -2.6, z: 3.9 },
  };
  const pinIn = (g: { x: number; z: number }, k: 0 | 1): [number, number] => [g.x + (k ? 0.45 : -0.45), g.z - 0.9];
  const pinOut = (g: { x: number; z: number }): [number, number] => [g.x, g.z + 0.9];
  for (let i = 0; i < 4; i++) {
    const row: Gate[] = [];
    for (const gg of Object.values(L)) {
      const mat = new THREE.MeshPhysicalMaterial({ color: '#1b2435', metalness: 0.35, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.15, emissive: new THREE.Color(kCol[gg.kind]), emissiveIntensity: 0.05, transparent: true });
      const m = new THREE.Mesh(geo[gg.kind], mat);
      m.position.set(CELL_X(i) + gg.x, 0.02, gg.z);
      m.castShadow = m.receiveShadow = true;
      scene.add(m);
      const lbl = new THREE.MeshBasicMaterial({ map: labelTex[gg.kind], transparent: true, depthWrite: false });
      const p = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.5).rotateX(-Math.PI / 2), lbl);
      p.position.set(CELL_X(i) + gg.x, 0.6, gg.z + 0.1);
      scene.add(p);
      row.push({ kind: gg.kind, x: gg.x, z: gg.z, mat, lbl, out: 0, tOut: 0, mesh: m, lblMesh: p });
    }
    gates.push(row);
  }
  const target = gates[1]![1]!; // AND1 của bit 1 — cổng ta chui vào
  const targetMesh = target.mesh;
  const TG = new THREE.Vector3(CELL_X(1) + target.x, 0, target.z);

  /* ── chân đệm + chữ số ── */
  const padMat = new THREE.MeshStandardMaterial({ color: '#d4a64a', metalness: 1, roughness: 0.3 });
  const digit = (t: string, c: string) => textTex([{ t, size: 200, color: c, w: 800 }], { w: 256, h: 256, bg: 'rgba(5,10,20,0.75)', radius: 60, border: c });
  const DIG = { a0: digit('0', '#93c5fd'), a1: digit('1', '#fbbf24'), b0: digit('0', '#93c5fd'), b1: digit('1', '#fbbf24'), s0: digit('0', '#93c5fd'), s1: digit('1', '#fde047') };
  const pads: Array<{ sp: THREE.Sprite; kind: 'a' | 'b' | 's' | 'c' | 'cin'; i: number }> = [];
  const pad = (x: number, z: number, kind: 'a' | 'b' | 's' | 'c' | 'cin', i: number, above = 1.15) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.22, 0.9), padMat);
    m.position.set(x, 0.11, z);
    m.receiveShadow = true;
    scene.add(m);
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: DIG.a0, transparent: true, depthWrite: false }));
    sp.scale.set(1.15, 1.15, 1);
    sp.position.set(x, above, z);
    sp.renderOrder = 10;
    scene.add(sp);
    pads.push({ sp, kind, i });
    return m;
  };
  for (let i = 0; i < 4; i++) {
    pad(CELL_X(i) - 1.2, -6.4, 'a', i);
    pad(CELL_X(i) + 1.2, -6.4, 'b', i);
    pad(CELL_X(i) + 1.8, 6.5, 's', i);
  }
  pad(CELL_X(3) - 6.4, 5.3, 'c', 3);
  pad(CELL_X(0) + 5.8, -1.6, 'cin', 0);

  /* ── dây + thời điểm tín hiệu ── */
  const wireMat = signalMaterial();
  const wireMesh = new THREE.Mesh(new THREE.BufferGeometry(), wireMat);
  scene.add(wireMesh);
  const H = { a: 0.36, b: 0.2, n: 0.28, c: 0.14 };
  let lastKey = '';
  const outT: number[] = new Array(4).fill(0), sVal: number[] = new Array(4).fill(0);
  let coutT = 0, coutV = 0;
  function rebuildWires(A: number, Bn: number) {
    const key = `${A}-${Bn}`;
    if (key === lastKey) return;
    lastKey = key;
    const parts: THREE.BufferGeometry[] = [];
    const w = (cx: number, pts: Array<[number, number]>, h: number, t0: number, val: number) => {
      const v3 = pts.map(([x, z]) => new THREE.Vector3(cx + x, h, z));
      const len = v3.reduce((s, p, k) => (k ? s + p.distanceTo(v3[k - 1]!) : 0), 0);
      const dur = len / V;
      parts.push(tube(v3, 0.075, { aT0: t0, aDur: dur, aVal: val }, hi ? 8 : 5).g);
      return t0 + dur;
    };
    let tc = 0, cv = 0;
    for (let i = 0; i < 4; i++) {
      const X = CELL_X(i);
      const a = (A >> i) & 1, b = (Bn >> i) & 1;
      const row = gates[i]!;
      const [x1, a1, x2, a2, o] = row as [Gate, Gate, Gate, Gate, Gate];
      const tA1 = w(X, [[-1.2, -6], [-1.2, -4.8], [-0.45, -4.8], pinIn(L.xor1, 0)], H.a, 0, a);
      const tB1 = w(X, [[1.2, -6], [1.2, -4.8], [0.45, -4.8], pinIn(L.xor1, 1)], H.b, 0, b);
      const tA2 = w(X, [[-1.2, -6], [-1.2, -5.4], [-3.05, -5.4], pinIn(L.and1, 0)], H.a, 0, a);
      const tB2 = w(X, [[1.2, -6], [1.2, -5.0], [-2.15, -5.0], pinIn(L.and1, 1)], H.b, 0, b);
      const p = a ^ b, gv = a & b;
      x1.out = p; x1.tOut = Math.max(tA1, tB1) + GD;
      a1.out = gv; a1.tOut = Math.max(tA2, tB2) + GD;
      const tp1 = w(X, [pinOut(L.xor1), [0, -0.6], [1.35, -0.6], pinIn(L.xor2, 0)], H.n, x1.tOut, p);
      const tp2 = w(X, [pinOut(L.xor1), [0, -0.6], [-0.85, -0.6], pinIn(L.and2, 0)], H.n, x1.tOut, p);
      const sx = i === 0 ? 5.8 : 5;
      const tc1 = w(X, [[sx, -1.6], [3.4, -1.6], [3.4, -0.2], [2.25, -0.2], pinIn(L.xor2, 1)], H.c, tc, cv);
      const tc2 = w(X, [[sx, -1.6], [3.4, -1.6], [3.4, -0.2], [0.05, -0.2], pinIn(L.and2, 1)], H.c, tc, cv);
      const s = p ^ cv, t = p & cv;
      x2.out = s; x2.tOut = Math.max(tp1, tc1) + GD;
      a2.out = t; a2.tOut = Math.max(tp2, tc2) + GD;
      const tg = w(X, [pinOut(L.and1), [-2.6, 1.9], [-3.05, 1.9], pinIn(L.or, 0)], H.n, a1.tOut, gv);
      const tt = w(X, [pinOut(L.and2), [-0.4, 2.65], [-2.15, 2.65], pinIn(L.or, 1)], H.n, a2.tOut, t);
      const co = gv | t;
      o.out = co; o.tOut = Math.max(tg, tt) + GD;
      outT[i] = w(X, [pinOut(L.xor2), [1.8, 6.1]], H.n, x2.tOut, s);
      sVal[i] = s;
      const end: Array<[number, number]> = i < 3 ? [[-5, 5.3], [-5, -1.6]] : [[-6.0, 5.3]];
      tc = w(X, [pinOut(L.or), [-2.6, 5.3], ...end], H.c, o.tOut, co);
      cv = co;
    }
    coutT = tc; coutV = cv;
    wireMesh.geometry.dispose();
    wireMesh.geometry = mergeGeometries(parts);
  }
  rebuildWires(5, 7);

  /* ── bên trong cổng AND: 6 transistor + đường nguồn ── */
  const mats: Record<string, THREE.Material> = {
    sub: new THREE.MeshPhysicalMaterial({ color: '#4b3d6e', roughness: 0.5, metalness: 0.15, clearcoat: 0.4 }),
    subP: new THREE.MeshPhysicalMaterial({ color: '#2c5577', roughness: 0.5, metalness: 0.15, clearcoat: 0.4 }),
    well: new THREE.MeshStandardMaterial({ color: '#1e4fc4', roughness: 0.45, emissive: '#1d4ed8', emissiveIntensity: 0.18 }),
    wellP: new THREE.MeshStandardMaterial({ color: '#b8325a', roughness: 0.45, emissive: '#be123c', emissiveIntensity: 0.18 }),
    oxide: new THREE.MeshPhysicalMaterial({ color: '#e0f2fe', roughness: 0.1, transparent: true, opacity: 0.55, depthWrite: false }),
    gate: new THREE.MeshStandardMaterial({ color: '#6b7380', metalness: 0.9, roughness: 0.32, emissive: '#f59e0b', emissiveIntensity: 0 }),
    w: new THREE.MeshStandardMaterial({ color: '#a1a1aa', metalness: 0.9, roughness: 0.35 }),
    cu: new THREE.MeshStandardMaterial({ color: '#c97b3d', metalness: 1, roughness: 0.3 }),
    chan: new THREE.MeshBasicMaterial({ color: new THREE.Color(0.15, 0.9, 1.7), transparent: true, opacity: 0, depthWrite: false }),
    subGlass: new THREE.MeshPhysicalMaterial({ color: '#5a4a86', roughness: 0.35, metalness: 0.1, transparent: true, opacity: 0.55, depthWrite: false }),
    wellGlass: new THREE.MeshStandardMaterial({ color: '#2a5fe0', roughness: 0.4, emissive: '#1d4ed8', emissiveIntensity: 0.25, transparent: true, opacity: 0.6, depthWrite: false }),
    elec: new THREE.MeshBasicMaterial({ color: new THREE.Color(0.9, 2.2, 5.0) }),
  };
  const inside = new THREE.Group();
  inside.position.copy(TG);
  scene.add(inside);
  const S = 0.042;
  const nElec = hi ? 170 : 90;
  const minis: THREE.Group[] = [];
  let main: ReturnType<typeof buildMosfet> | null = null;
  for (const [row, zz] of [[0, -0.42], [1, 0.3]] as const) {
    for (const xx of [-0.48, 0, 0.48]) {
      const isMain = row === 1 && xx === 0;
      const pm = row === 0 ? { ...mats, sub: mats.subP!, well: mats.wellP! } : isMain ? { ...mats, sub: mats.subGlass!, well: mats.wellGlass! } : mats;
      const m = buildMosfet(isMain, pm, nElec);
      m.g.scale.setScalar(S);
      m.g.position.set(xx, 0.06 + 3 * S, zz);
      inside.add(m.g);
      minis.push(m.g);
      if (isMain) main = m;
    }
  }
  const rail = (z: number, c: THREE.Color) => {
    const o = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.012, 0.05), new THREE.MeshBasicMaterial({ color: c }));
    o.position.set(0, 0.075, z);
    inside.add(o);
    return o;
  };
  const rails = [rail(-0.66, new THREE.Color(2.2, 0.45, 0.55)), rail(0.55, new THREE.Color(0.35, 0.8, 2.2))];
  const M0 = main!;

  /* ── đèn ── */
  scene.add(new THREE.HemisphereLight('#c7d8ff', '#0b0f1a', 0.6));
  const key = new THREE.DirectionalLight('#fff3e0', 2.4);
  key.position.set(-18, 30, 22);
  key.castShadow = q === 'high';
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -32, right: 32, top: 24, bottom: -24, near: 5, far: 90 });
  key.shadow.bias = -0.0005;
  key.shadow.radius = 3;
  scene.add(key);
  const rim = new THREE.DirectionalLight('#7dd3fc', 1.4);
  rim.position.set(20, 10, -30);
  scene.add(rim);
  const scope = new THREE.PointLight('#ffffff', 0, 0, 2);
  scene.add(scope);

  /* ── điểm neo ── */
  scene.updateMatrixWorld(true);
  const mw = (v: THREE.Vector3) => M0.g.localToWorld(v.clone());
  Object.assign(anchors, {
    'a.A': new THREE.Vector3(CELL_X(3) - 1.2, 1.6, -6.4),
    'a.B': new THREE.Vector3(CELL_X(0) + 1.2, 1.6, -6.4),
    'a.S': new THREE.Vector3(CELL_X(1) + 1.8, 1.6, 6.5),
    'a.fa': new THREE.Vector3(CELL_X(2) - 4.4, 0.1, 6.4),
    'a.carry': new THREE.Vector3(CELL_X(0) - 5, 0.2, 2.0),
    'g.p': inside.localToWorld(new THREE.Vector3(-0.48, 0.3, -0.42)),
    'g.n': inside.localToWorld(new THREE.Vector3(0.48, 0.3, 0.3)),
    't.gate': mw(new THREE.Vector3(0, 2.75, 0)),
    't.source': mw(new THREE.Vector3(-3.3, 2.75, 0)),
    't.drain': mw(new THREE.Vector3(3.3, 2.75, 0)),
    't.oxide': mw(new THREE.Vector3(1.6, 0.1, 2.6)),
    't.channel': mw(new THREE.Vector3(-0.6, -0.15, 2.6)),
    't.sub': mw(new THREE.Vector3(-1.5, -2.2, 3.0)),
  });

  const P = (T: THREE.Vector3, d: number, az: number, el: number, fitW: number, fov = 34): Pose => ({ T, d, az, el, fov, fitW, params: { panel: 1, ihs: 1, rise: 1 } });
  const poses = {
    alu: P(new THREE.Vector3(0, 0, 0.4), 40, 0, 0.98, 41),
    aluPre: P(new THREE.Vector3(0, 0, 0.4), 170, 0, 1.45, 160),
    gate: P(TG.clone().setY(0.25), 3.4, 0.32, 0.86, 2.5),
    transistor: P(mw(new THREE.Vector3(0, -0.5, 1.5)), 0.95, 0.28, 0.24, 0.64),
  };

  /* ── cập nhật ── */
  const m4 = new THREE.Matrix4(), q4 = new THREE.Quaternion(), s4 = new THREE.Vector3(1, 1, 1), p4 = new THREE.Vector3();
  function update(s: MicroState) {
    const { a, b, at } = s.adder;
    rebuildWires(a & 15, b & 15);
    wireMat.uniforms.uT!.value = at;
    for (const row of gates) for (const g of row) {
      const on = at >= g.tOut && g.out === 1 ? 1 : 0;
      g.mat.emissiveIntensity = 0.05 + on * 0.9;
    }
    for (const m of faFrames) m.uniforms.uA!.value = 0.25 + (s.hl['a.fa'] ?? 0) * 0.8;
    for (const p of pads) {
      p.sp.visible = s.deep < 0.5;
      const mat = p.sp.material as THREE.SpriteMaterial;
      if (p.kind === 'a') mat.map = (a >> p.i) & 1 ? DIG.a1 : DIG.a0;
      else if (p.kind === 'b') mat.map = (b >> p.i) & 1 ? DIG.b1 : DIG.b0;
      else if (p.kind === 's') { mat.map = sVal[p.i] ? DIG.s1 : DIG.s0; mat.opacity = at >= outT[p.i]! ? 1 : 0.0; }
      else if (p.kind === 'c') { mat.map = coutV ? DIG.s1 : DIG.s0; mat.opacity = at >= coutT ? 1 : 0; }
      else mat.map = DIG.a0;
    }
    // vỏ cổng hoá kính
    const gl = clamp01(s.glass);
    target.mat.opacity = 1 - 0.9 * gl;
    target.mat.depthWrite = gl < 0.5;
    target.lbl.opacity = 1 - gl;
    targetMesh.visible = s.deep < 0.5;
    // đã chui hẳn vào trong cổng: ẩn các cổng/dây của mạch cộng xung quanh cho khỏi che
    const ngoai = s.deep < 0.5;
    wireMesh.visible = ngoai;
    for (const row of gates) for (const g of row) if (g !== target) { g.mesh.visible = ngoai; g.lblMesh.visible = ngoai; }
    for (const r2 of rails) r2.visible = s.deep < 0.5;
    inside.visible = gl > 0.02;
    for (const m of minis) m.visible = gl > 0.02;
    // transistor chính
    const gv = clamp01(s.gateV);
    (mats.gate as THREE.MeshStandardMaterial).emissiveIntensity = gv * 1.4;
    (mats.chan as THREE.MeshBasicMaterial).opacity = gv * 0.4;
    if (M0.elec) {
      const t = s.t;
      for (let i = 0; i < nElec; i++) {
        const h1 = hash1(i), h2 = hash1(i + 101), h3 = hash1(i + 211), h4 = hash1(i + 307);
        const sideX = i % 2 ? 1 : -1;
        const ix = sideX * lerp(2.1, 4.5, h3) + 0.08 * Math.sin(t * 6 + i);
        const iy = -0.18 - h4 * 0.9 + 0.06 * Math.cos(t * 5 + i * 1.7);
        const zIdle = (h2 - 0.5) * 4.6, zFlow = 1.0 + h2 * 1.3;
        const fx = -4.4 + 8.8 * fract(h1 + t * 0.32);
        const fy = Math.abs(fx) < 1.9 ? -0.13 + 0.05 * Math.sin(t * 9 + i) : -0.13 - (Math.abs(fx) - 1.9) * 0.28;
        const k = sstep(h1 * 0.35, h1 * 0.35 + 0.65, gv);
        p4.set(lerp(ix, fx, k), lerp(iy, fy, k), lerp(zIdle, zFlow, k));
        m4.compose(p4, q4, s4);
        M0.elec.setMatrixAt(i, m4);
      }
      M0.elec.instanceMatrix.needsUpdate = true;
    }
  }

  return { scene, anchors, poses, update, key, scope, gateCenter: TG };
}
export type Micro = ReturnType<typeof buildMicro>;
