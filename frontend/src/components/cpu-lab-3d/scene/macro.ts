/**
 * THẾ GIỚI VĨ MÔ (đơn vị: cm, tỉ lệ thật): bàn làm việc → cây máy → bo mạch chủ → gói CPU → die → một lõi.
 * Toàn bộ dựng bằng mã (hình khối + hoạ tiết canvas) — không tải mô hình/ảnh ngoài.
 *
 * Bo mạch dựng trong toạ độ RIÊNG (x 0..24.4 từ mép I/O, y 0..30.5 từ mép dưới, linh kiện mọc theo +z) rồi xoay vào thùng:
 *   world = (9.2 − z, 13 + y, −21 + x)  ⇒ nhìn qua kính hông (camera ở phía −x) thấy bo mạch chính diện.
 */
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { boardTex, cellTex, dieTex, gradientTex, ihsTex, screenTex, textTex, woodTex, type Q } from './tex';
import { frameMaterial, pulseMaterial, ribbon, tube } from './shaders';
import { clamp01, easeOut, rng, sstep } from './util';
import type { FocusId } from './data';

export interface Params { panel: number; ihs: number; rise: number }
export interface Pose { T: THREE.Vector3; d: number; az: number; el: number; fov: number; fitW: number; params: Params }
export interface MacroState extends Params {
  t: number;
  hl: Record<string, number>;
  /** 0..1 lệnh "Add Y" chạy trong lõi; < 0 = ẩn */
  instr: number;
}

const HALF_PI = Math.PI / 2;
const Z0 = 0.16; // mặt trên PCB bo mạch chủ (toạ độ riêng của bo)
const SC = new THREE.Vector2(8.6, 22.0); // tâm socket CPU

/* ── vùng trên die (u trái→phải, v dưới→trên) ── */
function dieRegions() {
  const R: Record<string, [number, number, number, number]> = {
    imc: [0.012, 0.1, 0.07, 0.9],
    io: [0.905, 0.1, 0.988, 0.9],
    l3: [0.085, 0.425, 0.89, 0.575],
  };
  const x0 = 0.085, w = (0.805 - 0.03) / 4;
  for (let k = 0; k < 8; k++) {
    const top = k < 4, col = k % 4;
    const [v0, v1] = top ? [0.6, 0.97] : [0.03, 0.4];
    const u = x0 + col * (w + 0.01);
    R[`core${k}`] = [u, v0, u + w * 0.64, v1];
    R[`l2_${k}`] = [u + w * 0.66, v0, u + w, v1];
  }
  return { R, w, x0 };
}

/** Khối trong lõi (toạ độ chuẩn hoá 0..1 của vùng lõi + L2), chiều cao (cm), loại hoạ tiết, sắc độ. */
const CITY: Record<string, { r: [number, number, number, number]; h: number; kind: 'logic' | 'sram'; hue: number; glow: string }> = {
  l1i: { r: [0.03, 0.7, 0.3, 0.96], h: 0.006, kind: 'sram', hue: 280, glow: '#c084fc' },
  fetch: { r: [0.34, 0.7, 0.64, 0.96], h: 0.011, kind: 'logic', hue: 190, glow: '#38bdf8' },
  decode: { r: [0.34, 0.44, 0.64, 0.66], h: 0.012, kind: 'logic', hue: 160, glow: '#34d399' },
  regs: { r: [0.03, 0.4, 0.3, 0.66], h: 0.009, kind: 'sram', hue: 42, glow: '#fbbf24' },
  alu: { r: [0.34, 0.17, 0.64, 0.4], h: 0.013, kind: 'logic', hue: 22, glow: '#fb923c' },
  l1d: { r: [0.03, 0.04, 0.3, 0.36], h: 0.006, kind: 'sram', hue: 300, glow: '#e879f9' },
  mmu: { r: [0.34, 0.03, 0.64, 0.13], h: 0.008, kind: 'logic', hue: 340, glow: '#fb7185' },
  l2: { r: [0.68, 0.04, 0.97, 0.96], h: 0.005, kind: 'sram', hue: 250, glow: '#818cf8' },
};

export function buildMacro(q: Q, textures: { anisotropy: number }) {
  const scene = new THREE.Scene();
  scene.background = gradientTex('#0d1424', '#04060b');
  const anchors: Record<string, THREE.Vector3> = {};
  const r = rng(5);


  /* ───────── vật liệu ───────── */
  const M = {
    steel: new THREE.MeshStandardMaterial({ color: '#1a1e26', metalness: 0.75, roughness: 0.42 }),
    steelIn: new THREE.MeshStandardMaterial({ color: '#1d2129', metalness: 0.5, roughness: 0.75 }),
    plastic: new THREE.MeshStandardMaterial({ color: '#0f1115', metalness: 0.1, roughness: 0.6 }),
    plasticGrey: new THREE.MeshStandardMaterial({ color: '#2b303a', metalness: 0.15, roughness: 0.55 }),
    alu: new THREE.MeshStandardMaterial({ color: '#3a3f48', metalness: 0.9, roughness: 0.35 }),
    aluLight: new THREE.MeshStandardMaterial({ color: '#9aa3ad', metalness: 0.95, roughness: 0.28 }),
    gold: new THREE.MeshStandardMaterial({ color: '#d4a64a', metalness: 1, roughness: 0.25 }),
    chip: new THREE.MeshStandardMaterial({ color: '#111216', metalness: 0.2, roughness: 0.45 }),
    capTop: new THREE.MeshStandardMaterial({ color: '#8d939b', metalness: 0.85, roughness: 0.4 }),
    pcbGreen: new THREE.MeshStandardMaterial({ color: '#123826', metalness: 0.1, roughness: 0.5 }),
    edge: new THREE.MeshStandardMaterial({ color: '#2f3a2b', roughness: 0.7 }),
    rubber: new THREE.MeshStandardMaterial({ color: '#08090b', roughness: 0.9 }),
  };
  const glowMat = (c: string, k = 3) => new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(k) });
  const add = <T extends THREE.Object3D>(parent: THREE.Object3D, o: T, x = 0, y = 0, z = 0) => {
    o.position.set(x, y, z);
    parent.add(o);
    return o;
  };
  const box = (parent: THREE.Object3D, w: number, h: number, d: number, mat: THREE.Material | THREE.Material[], x: number, y: number, z: number, shadow = true) => {
    const m = add(parent, new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat), x, y, z);
    m.castShadow = shadow;
    m.receiveShadow = true;
    return m;
  };
  /** hộp có một mặt in chữ/hoạ tiết: face 0..5 = +x −x +y −y +z −z */
  const faceMats = (base: THREE.Material, face: number, top: THREE.Material) => Array.from({ length: 6 }, (_, i) => (i === face ? top : base));
  const chipMat = (lines: string[], hueBg = '#16181d') =>
    new THREE.MeshStandardMaterial({
      map: textTex(lines.map((t, i) => ({ t, size: i ? 46 : 64, color: 'rgba(200,205,212,0.85)', w: i ? 500 : 700 })), { w: 512, h: 512, bg: hueBg, radius: 0 }),
      roughness: 0.45, metalness: 0.2,
    });

  /* ───────── phòng & bàn ───────── */
  const room = new THREE.Group();
  scene.add(room);
  const wood = woodTex(q);
  wood.repeat.set(2, 1);
  box(room, 170, 3, 80, new THREE.MeshStandardMaterial({ map: wood, roughness: 0.55, metalness: 0.05 }), 28, -1.5, 4);
  box(room, 4, 72, 4, M.alu, -50, -38, 38);
  box(room, 4, 72, 4, M.alu, 106, -38, 38);
  const wall = add(room, new THREE.Mesh(new THREE.PlaneGeometry(520, 260), new THREE.MeshStandardMaterial({ color: '#0f1520', roughness: 0.95 })), 30, 40, -70);
  wall.receiveShadow = true;
  // màn hình
  const mon = add(room, new THREE.Group(), 50, 0, -14);
  mon.rotation.y = -0.38;
  box(mon, 20, 1, 14, M.alu, 0, 0.5, 0);
  box(mon, 3.2, 16, 2.2, M.alu, 0, 8, -2);
  box(mon, 62, 36, 1.6, M.plastic, 0, 30, 0);
  const scr = add(mon, new THREE.Mesh(new THREE.PlaneGeometry(59.6, 33.5), new THREE.MeshStandardMaterial({ color: '#000', emissive: '#ffffff', emissiveMap: screenTex(q), emissiveIntensity: 1.25, roughness: 0.2 })), 0, 30.2, 0.81);
  anchors['pc.monitor'] = scr.getWorldPosition(new THREE.Vector3());
  // bàn phím + chuột + cốc
  const kb = add(room, new THREE.Group(), 46, 0, 24);
  kb.rotation.y = -0.12;
  box(kb, 44, 1.4, 14, M.plasticGrey, 0, 0.7, 0);
  const keyGeo = new RoundedBoxGeometry(1.6, 0.8, 1.6, 2, 0.25);
  const keys = new THREE.InstancedMesh(keyGeo, M.plastic, 6 * 14);
  let ki = 0;
  const mtx = new THREE.Matrix4();
  for (let row = 0; row < 6; row++) for (let col = 0; col < 14; col++) {
    mtx.makeTranslation(-19.5 + col * 3 + (row % 2) * 0.6, 1.6, -5.2 + row * 2.08);
    keys.setMatrixAt(ki++, mtx);
  }
  keys.castShadow = true;
  kb.add(keys);
  add(room, new THREE.Mesh(new THREE.SphereGeometry(3.2, 24, 16).scale(1, 0.45, 1.6), M.plasticGrey), 80, 1.2, 26).castShadow = true;
  /* ───────── thùng máy ───────── */
  const pc = new THREE.Group();
  scene.add(pc);
  box(pc, 0.4, 46, 45, M.steel, 10.3, 23.6, 0); // hông phải
  box(pc, 21, 0.5, 45, M.steel, 0, 46.35, 0); // nóc
  box(pc, 21, 0.8, 45, M.steel, 0, 1.0, 0); // đáy
  box(pc, 21, 46, 0.5, M.steel, 0, 23.6, -22.3); // lưng
  const front = box(pc, 21, 46, 1.4, M.plastic, 0, 23.6, 22.4);
  front.material = new THREE.MeshStandardMaterial({ color: '#0c0d10', roughness: 0.75, metalness: 0.2 });
  for (const [x, z] of [[-8, -19], [8, -19], [-8, 19], [8, 19]]) add(pc, new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.6, 0.8, 20), M.rubber), x, 0.4, z);
  const rgbFront = box(pc, 0.5, 40, 0.3, glowMat('#38bdf8', 2.5), -10.1, 23.6, 23.15, false);
  const pwr = add(pc, new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.12, 8, 24), glowMat('#e0f2fe', 3)), 6, 44.5, 23.2);
  pwr.rotation.x = 0;
  // tấm che nguồn (PSU shroud)
  box(pc, 19.8, 12.2, 44, M.steelIn, -0.2, 7.1, 0);
  const shroudLogo = add(pc, new THREE.Mesh(new THREE.PlaneGeometry(9, 1.6), new THREE.MeshBasicMaterial({ map: textTex([{ t: 'CUONGTHAI', size: 70, color: '#cbd5e1', w: 800 }], { w: 512, h: 96 }), transparent: true })), -10.12, 9.5, 4);
  shroudLogo.rotation.y = -HALF_PI;
  // quạt
  const fans: THREE.Object3D[] = [];
  const quat = (x: number, y: number, z: number, ry: number, rgb: string) => {
    const g = add(pc, new THREE.Group(), x, y, z);
    g.rotation.y = ry;
    add(g, new THREE.Mesh(new THREE.TorusGeometry(5.6, 0.35, 8, 40), M.plastic));
    add(g, new THREE.Mesh(new THREE.TorusGeometry(5.3, 0.12, 8, 48), glowMat(rgb, 3)), 0, 0, 0.3);
    const rot = add(g, new THREE.Group());
    add(rot, new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 1.2, 24).rotateX(HALF_PI), M.plasticGrey));
    for (let i = 0; i < 7; i++) {
      const bl = add(rot, new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.7, 0.08), new THREE.MeshStandardMaterial({ color: '#1d2129', roughness: 0.4, transparent: true, opacity: 0.92 })));
      const a = (i / 7) * Math.PI * 2;
      bl.position.set(Math.cos(a) * 3.3, Math.sin(a) * 3.3, 0);
      bl.rotation.set(0.5, 0, a);
    }
    fans.push(rot);
    return g;
  };
  quat(0, 35, 20.6, 0, '#a78bfa');
  quat(0, 22.5, 20.6, 0, '#38bdf8');
  quat(-0.5, 36, -21.4, 0, '#f472b6');
  // kính hông (mở được)
  const glass = add(pc, new THREE.Group(), -10.55, 23.6, 0);
  const glassMat = new THREE.MeshPhysicalMaterial({ color: '#9fb4c8', metalness: 0, roughness: 0.04, transparent: true, opacity: 0.1, envMapIntensity: 1.3, clearcoat: 1, depthWrite: false });
  const gPane = add(glass, new THREE.Mesh(new THREE.PlaneGeometry(44, 45), glassMat));
  gPane.rotation.y = -HALF_PI;
  for (const [y, h, z, d] of [[22.6, 0.8, 0, 45], [-22.6, 0.8, 0, 45], [0, 46, 22.3, 0.6], [0, 46, -22.3, 0.6]] as const) box(glass, 0.3, h, d, M.steel, 0, y, z);
  anchors['pc.case'] = new THREE.Vector3(-10.5, 30, 6);

  /* ───────── bo mạch chủ (toạ độ riêng) ───────── */
  const board = add(pc, new THREE.Group(), 9.2, 13, -21);
  board.rotation.y = -HALF_PI;
  const B = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z); // tiện ghi toạ độ bo

  // bus: đường đi (toạ độ bo, mặt z = Z0)
  const memTraces: Array<Array<[number, number]>> = [];
  const slotsX = [15.8, 16.7, 17.6, 18.5];
  for (let i = 0; i < 24; i++) {
    const y0 = 19.6 + (i / 23) * 5.0;
    const y1 = 15.6 + (i / 23) * 12.6;
    const xs = slotsX[(i % 2) * 2 + 1]!;
    const pts: Array<[number, number]> = [[11.05, y0], [11.9, y0]];
    const amp = 0.09, n = 3 + (i % 4);
    for (let k = 0; k < n; k++) {
      const x = 12.0 + k * 0.42;
      pts.push([x, y0 + amp], [x + 0.21, y0 + amp], [x + 0.21, y0 - amp], [x + 0.42, y0 - amp]);
    }
    const xe = 12.0 + n * 0.42 + 0.2;
    pts.push([xe, y0], [14.6, y0], [15.2, y1], [xs, y1]);
    memTraces.push(pts);
  }
  const pcieTraces: Array<Array<[number, number]>> = [];
  for (let i = 0; i < 16; i++) {
    const x0 = 6.6 + i * 0.26, x1 = 5.0 + i * 0.5;
    pcieTraces.push([[x0, 20.0], [x0, 19.3], [x1, 17.8], [x1, 15.5]]);
  }
  for (let i = 0; i < 4; i++) pcieTraces.push([[6.2, 20.3 + i * 0.25], [5.4, 20.3 + i * 0.25], [4.8, 19.4 + i * 0.25], [4.8, 18.1 + i * 0.2]]);
  const dmiTraces: Array<Array<[number, number]>> = [];
  for (let i = 0; i < 6; i++) dmiTraces.push([[10.8 + i * 0.12, 19.9], [10.8 + i * 0.12, 19.3], [13.9 + i * 0.16, 16.4], [13.9 + i * 0.16, 10.0], [16.2 + i * 0.16, 7.7], [16.2 + i * 0.16, 7.2]]);

  const marks = [
    { label: 'CPU1', x: 5.8, y: 25.5, size: 0.36 },
    { label: 'DIMM_A1', x: 15.55, y: 13.9, size: 0.24 }, { label: 'DIMM_A2', x: 16.45, y: 13.9, size: 0.24 },
    { label: 'DIMM_B1', x: 17.35, y: 13.4, size: 0.24 }, { label: 'DIMM_B2', x: 18.25, y: 13.4, size: 0.24 },
    { label: 'PCIE_X16_1', x: 4.0, y: 16.0, size: 0.28 }, { label: 'M2_1  (PCIe 5.0 x4)', x: 5.6, y: 19.0, size: 0.24 },
    { label: 'ATX_PWR1', x: 22.4, y: 22.6, size: 0.26 }, { label: 'PCH', x: 16.0, y: 8.6, size: 0.3 },
    { label: 'CUONGTHAI  B-01  ·  ATX', x: 2.5, y: 3.0, size: 0.5 }, { label: 'LAN', x: 5.4, y: 30.0, size: 0.26 },
    { label: 'SATA6G_1234', x: 21.6, y: 6.2, size: 0.22 }, { label: 'BAT', x: 19.6, y: 12.6, size: 0.26 },
    { label: 'DDR5 CH_A / CH_B', x: 12.0, y: 25.1, size: 0.22 },
  ];
  const bt = boardTex(q, marks, [...memTraces, ...pcieTraces, ...dmiTraces]);
  bt.map.anisotropy = bt.roughnessMap.anisotropy = textures.anisotropy;
  const pcbTop = new THREE.MeshStandardMaterial({ map: bt.map, roughnessMap: bt.roughnessMap, roughness: 1, metalness: 0.15 });
  box(board, 24.4, 30.5, 0.16, faceMats(M.edge, 4, pcbTop), 12.2, 15.25, 0.08);

  // xung bus (lưới 3D phẳng sát mặt bo)
  const busGeo = (tr: Array<Array<[number, number]>>, w: number) => mergeGeometries(tr.map((p, i) => ribbon(p, w, Z0 + 0.004, r() + i * 0.13)));
  const busMat = {
    'b.mem': pulseMaterial('#1a2a3a', '#4fd1ff', { spacing: 2.4, speed: 5 }),
    'b.pcie': pulseMaterial('#1a2a3a', '#a78bfa', { spacing: 2.2, speed: 6 }),
    'b.dmi': pulseMaterial('#1a2a3a', '#34d399', { spacing: 2.6, speed: 4 }),
  };
  add(board, new THREE.Mesh(busGeo(memTraces, 0.07), busMat['b.mem']));
  add(board, new THREE.Mesh(busGeo(pcieTraces, 0.07), busMat['b.pcie']));
  add(board, new THREE.Mesh(busGeo(dmiTraces, 0.07), busMat['b.dmi']));

  // vầng sáng quanh linh kiện (khung trên mặt bo)
  const halos: Record<string, THREE.ShaderMaterial> = {};
  const halo = (id: string, x0: number, y0: number, x1: number, y1: number, color: string, z = Z0 + 0.012, parent: THREE.Object3D = board) => {
    const m = frameMaterial(color, 0.06);
    m.uniforms.uAspect!.value = (x1 - x0) / (y1 - y0);
    const pl = add(parent, new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, y1 - y0), m), (x0 + x1) / 2, (y0 + y1) / 2, z);
    pl.renderOrder = 5;
    halos[id] = m;
    return pl;
  };

  // I/O + VRM (khối trái) và tản nhiệt VRM trên
  const ioBlock = box(board, 3.8, 14.3, 3.6, M.alu, 2.1, 22.65, Z0 + 1.8);
  ioBlock.material = new THREE.MeshStandardMaterial({ color: '#2c3138', metalness: 0.85, roughness: 0.38 });
  const ioLabel = add(board, new THREE.Mesh(new THREE.PlaneGeometry(2.6, 9), new THREE.MeshStandardMaterial({ map: textTex([{ t: 'CUONGTHAI', size: 64, color: '#e2e8f0', w: 800 }], { w: 512, h: 96 }), transparent: true, roughness: 0.4, metalness: 0.5 })), 2.1, 23, Z0 + 3.61);
  ioLabel.rotation.z = HALF_PI;
  box(board, 0.2, 13.4, 0.3, glowMat('#22d3ee', 2.4), 4.05, 22.7, Z0 + 3.3, false);
  const vrm = add(board, new THREE.Group(), 8.75, 27.1, Z0);
  box(vrm, 9.5, 3.0, 0.8, M.alu, 0, 0, 0.4);
  const finGeo = new THREE.BoxGeometry(0.12, 2.8, 2.4);
  const fins = new THREE.InstancedMesh(finGeo, new THREE.MeshStandardMaterial({ color: '#3b4049', metalness: 0.9, roughness: 0.32 }), 26);
  for (let i = 0; i < 26; i++) { mtx.makeTranslation(-4.6 + i * 0.37, 0, 2.0); fins.setMatrixAt(i, mtx); }
  fins.castShadow = true;
  vrm.add(fins);
  // tụ điện
  const capGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.7, 16).rotateX(HALF_PI);
  const capPos: Array<[number, number]> = [];
  for (let i = 0; i < 9; i++) capPos.push([5.0 + i * 0.78, 25.0]);
  for (let i = 0; i < 7; i++) capPos.push([4.55, 18.0 + i * 0.85]);
  for (let i = 0; i < 6; i++) capPos.push([1.2 + (i % 3) * 0.75, 2.0 + Math.floor(i / 3) * 0.9]);
  const caps = new THREE.InstancedMesh(capGeo, [new THREE.MeshStandardMaterial({ color: '#23262c', metalness: 0.6, roughness: 0.45 }), M.capTop, M.capTop] as unknown as THREE.Material, capPos.length);
  capPos.forEach(([x, y], i) => { mtx.makeTranslation(x, y, Z0 + 0.36); caps.setMatrixAt(i, mtx); });
  caps.castShadow = true;
  board.add(caps);

  // socket + gói CPU
  const sockShape = new THREE.Shape();
  sockShape.moveTo(-2.7, -2.3); sockShape.lineTo(2.7, -2.3); sockShape.lineTo(2.7, 2.3); sockShape.lineTo(-2.7, 2.3); sockShape.lineTo(-2.7, -2.3);
  const hole = new THREE.Path();
  hole.moveTo(-2.3, -1.93); hole.lineTo(-2.3, 1.93); hole.lineTo(2.3, 1.93); hole.lineTo(2.3, -1.93); hole.lineTo(-2.3, -1.93);
  sockShape.holes.push(hole);
  add(board, new THREE.Mesh(new THREE.ExtrudeGeometry(sockShape, { depth: 0.32, bevelEnabled: false }), M.plasticGrey), SC.x, SC.y, Z0).castShadow = true;
  box(board, 0.12, 4.2, 0.12, M.aluLight, SC.x + 3.0, SC.y, Z0 + 0.25); // cần gạt
  const pkg = add(board, new THREE.Group(), SC.x, SC.y, Z0 + 0.12);
  const subMat = new THREE.MeshStandardMaterial({ color: '#1e3a2a', roughness: 0.42, metalness: 0.25 });
  box(pkg, 4.5, 3.75, 0.12, subMat, 0, 0, 0.06);
  const smd = new THREE.InstancedMesh(new THREE.BoxGeometry(0.1, 0.05, 0.05), M.gold, 40);
  for (let i = 0; i < 40; i++) {
    const side = i % 2 ? 1 : -1;
    mtx.makeTranslation(-1.9 + (i >> 1) * 0.2, side * 1.7, 0.145);
    smd.setMatrixAt(i, mtx);
  }
  pkg.add(smd);
  // die + vùng sáng
  const { R: DR } = dieRegions();
  const dt = dieTex(q, DR);
  dt.map.anisotropy = textures.anisotropy;
  const dieTop = new THREE.MeshPhysicalMaterial({ map: dt.map, roughnessMap: dt.roughnessMap, roughness: 1, metalness: 0.55, iridescence: 0.55, iridescenceIOR: 1.6, iridescenceThicknessRange: [180, 620], clearcoat: 0.4, clearcoatRoughness: 0.2 });
  box(pkg, 2.2, 1.2, 0.03, M.chip, 0, 0, 0.135); // keo lót (underfill)
  const DW = 2.05, DH = 1.05, DZ = 0.19;
  box(pkg, DW, DH, 0.07, faceMats(new THREE.MeshStandardMaterial({ color: '#3c4150', metalness: 0.6, roughness: 0.3 }), 4, dieTop), 0, 0, 0.155);
  const dieUV = (u: number, v: number, z = DZ) => new THREE.Vector3(-DW / 2 + u * DW, -DH / 2 + v * DH, z);
  const dieHl: Record<string, THREE.ShaderMaterial[]> = { 'd.cores': [], 'd.core1': [], 'd.l3': [], 'd.l2': [], 'd.imc': [], 'd.io': [] };
  const dieCol: Record<string, string> = { core: '#38bdf8', l2: '#a78bfa', l3: '#818cf8', imc: '#fbbf24', io: '#f472b6' };
  for (const [k, [u0, v0, u1, v1]] of Object.entries(DR)) {
    const kind = k.startsWith('core') ? 'core' : k.startsWith('l2') ? 'l2' : k;
    const m = frameMaterial(dieCol[kind]!, 0.05);
    m.uniforms.uAspect!.value = ((u1 - u0) * DW) / ((v1 - v0) * DH);
    const c = dieUV((u0 + u1) / 2, (v0 + v1) / 2, DZ + 0.0006);
    const pl = add(pkg, new THREE.Mesh(new THREE.PlaneGeometry((u1 - u0) * DW, (v1 - v0) * DH), m), c.x, c.y, c.z);
    pl.renderOrder = 6;
    if (kind === 'core') dieHl['d.cores']!.push(m);
    if (k === 'core1') dieHl['d.core1']!.push(m);
    if (kind === 'l2') dieHl['d.l2']!.push(m);
    if (kind === 'l3') dieHl['d.l3']!.push(m);
    if (kind === 'imc') dieHl['d.imc']!.push(m);
    if (kind === 'io') dieHl['d.io']!.push(m);
  }
  // nắp IHS
  const ihs = add(pkg, new THREE.Group());
  const it = ihsTex(q);
  const nickel = new THREE.MeshStandardMaterial({ color: '#d5d9de', metalness: 1, roughness: 0.3, map: it.map, bumpMap: it.bumpMap, bumpScale: 0.6 });
  const flange = add(ihs, new THREE.Mesh(new RoundedBoxGeometry(3.95, 3.3, 0.1, 2, 0.04), new THREE.MeshStandardMaterial({ color: '#c9ced4', metalness: 1, roughness: 0.32 })), 0, 0, 0.17);
  flange.castShadow = true;
  const plate = add(ihs, new THREE.Mesh(new RoundedBoxGeometry(3.35, 2.8, 0.17, 3, 0.05), nickel), 0, 0, 0.3);
  plate.castShadow = true;
  // vùng lõi phóng to: "thành phố" mọc lên trên mặt die
  const c1 = DR.core1!, l21 = DR.l2_1!;
  const cu0 = c1[0], cu1 = l21[2], cv0 = c1[1], cv1 = c1[3];
  const cityO = dieUV(cu0, cv0, DZ);
  const CW = (cu1 - cu0) * DW, CH = (cv1 - cv0) * DH;
  const city = add(pkg, new THREE.Group(), cityO.x, cityO.y, cityO.z);
  const cityP = (u: number, v: number, z = 0) => new THREE.Vector3(u * CW, v * CH, z);
  const blocks: Record<string, { mesh: THREE.Mesh; mat: THREE.MeshStandardMaterial; frame: THREE.Mesh; fm: THREE.ShaderMaterial; h: number; c: THREE.Vector3 }> = {};
  for (const [k, b] of Object.entries(CITY)) {
    const [u0, v0, u1, v1] = b.r;
    const w = (u1 - u0) * CW, h = (v1 - v0) * CH;
    const tx = cellTex(b.kind, b.hue, 30 + k.length);
    tx.repeat.set(w / 0.06, h / 0.06);
    const mat = new THREE.MeshStandardMaterial({ map: tx, color: '#a3acbd', roughness: 0.32, metalness: 0.55, emissive: new THREE.Color(b.glow), emissiveIntensity: 0.02 });
    const side = new THREE.MeshStandardMaterial({ color: new THREE.Color(b.glow).multiplyScalar(0.18), roughness: 0.45, metalness: 0.6 });
    const c = cityP((u0 + u1) / 2, (v0 + v1) / 2);
    const mesh = add(city, new THREE.Mesh(new THREE.BoxGeometry(w, h, b.h), faceMats(side, 4, mat)), c.x, c.y, b.h / 2);
    const fm = frameMaterial(b.glow, 0.06);
    fm.uniforms.uAspect!.value = w / h;
    const frame = add(city, new THREE.Mesh(new THREE.PlaneGeometry(w, h), fm), c.x, c.y, b.h + 0.0004);
    frame.renderOrder = 7;
    blocks[k] = { mesh, mat, frame, fm, h: b.h, c };
  }
  // dây nối giữa các khối (vòm trên mặt khối)
  const linkMat = pulseMaterial('#16304a', '#7dd3fc', { spacing: 0.06, speed: 0.12, sharp: 7 });
  const arch = (a: string, b: string, lift = 0.02) => {
    const A = blocks[a]!.c, Bc = blocks[b]!.c;
    const za = CITY[a]!.h, zb = CITY[b]!.h;
    const mid = A.clone().lerp(Bc, 0.5);
    const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(A.x, A.y, za), new THREE.Vector3(mid.x, mid.y, Math.max(za, zb) + lift), new THREE.Vector3(Bc.x, Bc.y, zb));
    const pts = curve.getPoints(24);
    return tube(pts, 0.0016, { aSeed: r(), aLen: curve.getLength() }).g;
  };
  const links = add(city, new THREE.Mesh(mergeGeometries([arch('l1i', 'fetch', 0.006), arch('fetch', 'decode', 0.006), arch('decode', 'alu', 0.006), arch('regs', 'alu', 0.007), arch('l1d', 'alu', 0.012)]), linkMat));
  // thẻ lệnh + toán hạng (sprite, luôn quay về camera)
  const sprite = (tex: THREE.Texture, w: number, h: number) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true }));
    s.scale.set(w, h, 1);
    s.renderOrder = 20;
    city.add(s);
    return s;
  };
  const tTok = sprite(textTex([{ t: 'Add Y', size: 92, color: '#fff7ed', w: 800 }, { t: '0011 0000 0000 0110', size: 40, color: '#fde68a', w: 600 }], { w: 640, h: 260, bg: 'rgba(124,45,18,0.92)', border: '#fdba74', radius: 40 }), 0.085, 0.0345);
  const tAC = sprite(textTex([{ t: 'AC = 5', size: 92, color: '#fffbeb', w: 800 }], { w: 512, h: 170, bg: 'rgba(120,83,9,0.92)', border: '#fcd34d', radius: 40 }), 0.06, 0.02);
  const tY = sprite(textTex([{ t: 'Y = 7', size: 92, color: '#f0fdf4', w: 800 }], { w: 512, h: 170, bg: 'rgba(20,83,45,0.92)', border: '#86efac', radius: 40 }), 0.06, 0.02);
  const tRes = sprite(textTex([{ t: 'AC = 12', size: 92, color: '#fffbeb', w: 800 }], { w: 512, h: 170, bg: 'rgba(146,64,14,0.95)', border: '#fde047', radius: 40 }), 0.062, 0.0206);
  const above = (k: string, dz = 0.016) => blocks[k]!.c.clone().setZ(CITY[k]!.h + dz);

  // RAM: 2 thanh trong khe 2 & 4
  for (const x of slotsX) {
    box(board, 0.62, 14.2, 0.9, M.plasticGrey, x, 21.7, Z0 + 0.45);
    box(board, 0.62, 0.6, 1.2, M.aluLight, x, 14.4, Z0 + 0.6, false);
    box(board, 0.62, 0.6, 1.2, M.aluLight, x, 29.0, Z0 + 0.6, false);
  }
  const ramChip = chipMat(['D5', '16Gb', 'X8 · 5600']);
  let cellsChip = new THREE.Vector3();
  for (const x of [slotsX[1]!, slotsX[3]!]) {
    box(board, 0.13, 13.3, 3.1, M.pcbGreen, x, 21.7, Z0 + 2.15);
    for (const s of [1, -1]) for (let i = 0; i < 8; i++) {
      const cy = 15.9 + i * 1.62 + (i >= 4 ? 0.4 : 0);
      box(board, 0.08, 1.15, 0.95, faceMats(M.chip, s > 0 ? 0 : 1, ramChip), x + s * 0.105, cy, Z0 + 2.45);
      if (x === slotsX[3] && s > 0 && i === 3) cellsChip = B(x + 0.15, cy, Z0 + 2.45);
    }
    box(board, 0.135, 2.2, 0.5, M.chip, x, 22.4, Z0 + 3.35); // SPD/PMIC
  }
  // lưới ô nhớ DRAM (hiện khi focus ram.cells)
  const cellCanvas = (() => {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const g = c.getContext('2d')!;
    g.fillStyle = '#05080f';
    g.fillRect(0, 0, 256, 256);
    for (let yy = 0; yy < 16; yy++) for (let xx = 0; xx < 16; xx++) {
      const on = ((xx * 7 + yy * 13) % 5) < 2;
      g.fillStyle = on ? '#7dd3fc' : '#1e3a5f';
      g.beginPath();
      g.arc(8 + xx * 16, 8 + yy * 16, 5, 0, 7);
      g.fill();
    }
    g.strokeStyle = 'rgba(148,163,184,0.5)';
    for (let i = 0; i <= 16; i++) { g.beginPath(); g.moveTo(i * 16, 0); g.lineTo(i * 16, 256); g.stroke(); g.beginPath(); g.moveTo(0, i * 16); g.lineTo(256, i * 16); g.stroke(); }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  })();
  const cellsMat = new THREE.MeshBasicMaterial({ map: cellCanvas, transparent: true, opacity: 0, depthWrite: false, color: new THREE.Color(2, 2, 2) });
  const cellsPl = add(board, new THREE.Mesh(new THREE.PlaneGeometry(1.05, 0.85), cellsMat), cellsChip.x + 0.001, cellsChip.y, cellsChip.z);
  cellsPl.rotation.y = HALF_PI;
  cellsPl.renderOrder = 8;

  // 24 pin, pin CMOS, SATA, header
  box(board, 1.3, 5.2, 1.4, M.plastic, 23.4, 19.6, Z0 + 0.7);
  add(board, new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.32, 32).rotateX(HALF_PI), M.capTop), 19.8, 11.2, Z0 + 0.16);
  for (let i = 0; i < 4; i++) box(board, 0.9, 0.7, 0.9, M.plastic, 23.4, 2.4 + i * 0.95, Z0 + 0.45);
  for (let i = 0; i < 3; i++) box(board, 1.6, 0.5, 0.7, M.plastic, 8 + i * 3.4, 0.6, Z0 + 0.35);
  // chip mạng (LAN) + codec âm thanh ở mép trên
  box(board, 0.9, 0.9, 0.12, faceMats(M.chip, 4, chipMat(['LAN', '2.5G'])), 6.1, 29.5, Z0 + 0.06);
  box(board, 0.7, 0.7, 0.1, faceMats(M.chip, 4, chipMat(['AUDIO'])), 10.5, 29.6, Z0 + 0.05);
  halo('h.nic', 5.35, 28.75, 6.85, 30.25, '#22d3ee');

  // khe PCIe + card đồ hoạ
  box(board, 8.9, 0.75, 1.0, M.plasticGrey, 8.45, 15.0, Z0 + 0.5);
  box(board, 8.9, 0.75, 1.0, M.plasticGrey, 8.45, 7.0, Z0 + 0.5);
  box(board, 2.4, 0.75, 1.0, M.plasticGrey, 5.2, 10.0, Z0 + 0.5);
  const gpu = add(board, new THREE.Group());
  box(gpu, 26, 0.16, 11.4, M.pcbGreen, 12.2, 15.28, 6.3);
  const bp = box(gpu, 26, 0.2, 11.4, new THREE.MeshStandardMaterial({ color: '#15181e', metalness: 0.85, roughness: 0.35 }), 12.2, 15.46, 6.3);
  bp.castShadow = true;
  const shroud = box(gpu, 25.6, 3.6, 11.1, new THREE.MeshStandardMaterial({ color: '#1b1e25', metalness: 0.5, roughness: 0.45 }), 12.4, 13.4, 6.45);
  shroud.castShadow = true;
  box(gpu, 25.6, 0.2, 0.2, glowMat('#a78bfa', 2.6), 12.4, 15.18, 12.05, false);
  const gpuName = add(gpu, new THREE.Mesh(new THREE.PlaneGeometry(9, 1.6), new THREE.MeshBasicMaterial({ map: textTex([{ t: 'CT GRAPHICS', size: 70, color: '#e9d5ff', w: 800 }], { w: 640, h: 110 }), transparent: true })), 17, 13.6, 12.02);
  gpuName.rotation.z = 0;
  box(gpu, 0.12, 4.4, 12, M.aluLight, -1.0, 13.4, 6.0); // tấm chặn
  for (let i = 0; i < 2; i++) box(gpu, 0.6, 1.2, 2.2, M.plastic, 22 + i * 1.6, 15.9, 6, false); // đầu nguồn
  // SSD M.2
  const ssd = add(board, new THREE.Group(), 0, 0, Z0 + 0.42);
  box(board, 0.7, 2.4, 0.5, M.plasticGrey, 5.2, 17.6, Z0 + 0.25);
  box(ssd, 8.0, 2.2, 0.08, M.pcbGreen, 9.6, 17.6, 0);
  box(ssd, 1.2, 1.2, 0.12, faceMats(M.chip, 4, chipMat(['CTRL', 'NVMe'])), 7.0, 17.6, 0.1);
  box(ssd, 1.55, 1.4, 0.14, faceMats(M.chip, 4, chipMat(['NAND', '512GB'])), 9.35, 17.6, 0.11);
  box(ssd, 1.55, 1.4, 0.14, faceMats(M.chip, 4, chipMat(['NAND', '512GB'])), 11.6, 17.6, 0.11);
  box(ssd, 0.5, 2.0, 0.02, M.gold, 5.85, 17.6, 0);
  add(ssd, new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.2, 12).rotateX(HALF_PI), M.aluLight), 13.4, 17.6, 0.1);
  halo('h.ssd', 5.5, 16.3, 13.8, 18.9, '#a78bfa', Z0 + 0.012);
  halo('h.ssd.ctrl', 6.3, 16.9, 7.7, 18.3, '#fbbf24', Z0 + 0.42 + 0.17, board);
  halo('h.ssd.nand', 8.5, 16.8, 12.45, 18.4, '#34d399', Z0 + 0.42 + 0.19, board);
  // chipset (PCH) có tản nhiệt
  box(board, 5.0, 4.6, 1.0, new THREE.MeshStandardMaterial({ color: '#2a2f37', metalness: 0.9, roughness: 0.3 }), 18.5, 5.6, Z0 + 0.5);
  const chipsetCap = box(board, 4.4, 4.0, 0.06, new THREE.MeshStandardMaterial({ map: textTex([{ t: 'CHIPSET', size: 70, color: '#e2e8f0', w: 800 }, { t: 'B-01 PCH', size: 44, color: '#94a3b8' }], { w: 512, h: 400, bg: '#1b2028', radius: 30 }), metalness: 0.6, roughness: 0.35 }), 18.5, 5.6, Z0 + 1.03, false);
  void chipsetCap;
  halo('h.chipset', 15.6, 3.0, 21.4, 8.2, '#34d399');
  halo('h.socket', SC.x - 2.9, SC.y - 2.5, SC.x + 2.9, SC.y + 2.5, '#38bdf8');
  halo('h.ram', 15.2, 14.1, 19.1, 29.3, '#4fd1ff');
  halo('h.gpu', 3.6, 14.3, 13.3, 15.7, '#a78bfa');
  // khung sáng quanh chip DRAM được chọn
  const hc = frameMaterial('#7dd3fc', 0.08);
  const hcPl = add(board, new THREE.Mesh(new THREE.PlaneGeometry(1.35, 1.15), hc), cellsChip.x + 0.004, cellsChip.y, cellsChip.z);
  hcPl.rotation.y = HALF_PI;
  hcPl.renderOrder = 9;
  halos['h.ram.cells'] = hc;

  /* ───────── đèn ───────── */
  const hemi = new THREE.HemisphereLight('#bcd4ff', '#20140c', 0.35);
  scene.add(hemi);
  const key = new THREE.DirectionalLight('#fff4e6', 2.6);
  key.position.set(-70, 95, 60);
  key.target.position.set(4, 22, 0);
  scene.add(key, key.target);
  key.castShadow = q === 'high';
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -45; key.shadow.camera.right = 45; key.shadow.camera.top = 45; key.shadow.camera.bottom = -45;
  key.shadow.camera.near = 40; key.shadow.camera.far = 260;
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.04;
  key.shadow.radius = 4;
  const rim = new THREE.DirectionalLight('#7aa7ff', 1.3);
  rim.position.set(60, 40, -80);
  scene.add(rim);
  const inner = new THREE.PointLight('#67e8f9', 70, 70, 1.2);
  inner.position.set(-6, 32, 6);
  scene.add(inner);
  const inner2 = new THREE.PointLight('#c084fc', 45, 50, 1.2);
  inner2.position.set(-4, 18, 14);
  scene.add(inner2);
  const lamp = new THREE.PointLight('#ffd8a8', 900, 200, 1.1);
  lamp.position.set(40, 70, -30);
  scene.add(lamp);
  // đèn "kính hiển vi" cho cận cảnh die/lõi: bám theo camera (journey.ts đặt vị trí)
  const scope = new THREE.PointLight('#ffffff', 0, 0, 2);
  scene.add(scope);

  /* ───────── điểm neo (toạ độ thế giới) ───────── */
  scene.updateMatrixWorld(true);
  const W = (o: THREE.Object3D, v: THREE.Vector3) => o.localToWorld(v.clone());
  Object.assign(anchors, {
    'b.socket': W(board, B(SC.x, SC.y + 2.4, Z0 + 0.5)),
    'b.ram': W(board, B(18.5, 28.6, Z0 + 3.4)),
    'b.ssd': W(board, B(12.6, 18.2, Z0 + 0.6)),
    'b.gpu': W(board, B(20, 14.2, 12.0)),
    'b.chipset': W(board, B(18.5, 7.8, Z0 + 1.1)),
    'b.bus': W(board, B(13.6, 24.6, Z0)),
    'c.ihs': W(pkg, new THREE.Vector3(0.8, 1.2, 0.4)),
    'c.substrate': W(pkg, new THREE.Vector3(-2.1, -1.7, 0.12)),
    'd.cores': W(pkg, dieUV(DR.core2![0] + 0.04, 0.96)),
    'd.l3': W(pkg, dieUV(0.6, 0.5)),
    'd.imc': W(pkg, dieUV(0.04, 0.3)),
    'd.io': W(pkg, dieUV(0.95, 0.7)),
    'd.l2': W(pkg, dieUV((DR.l2_6![0] + DR.l2_6![2]) / 2, 0.08)),
  });
  for (const [k, id] of [['fetch', 'k.fetch'], ['decode', 'k.decode'], ['regs', 'k.regs'], ['alu', 'k.alu'], ['l1i', 'k.l1i'], ['l1d', 'k.l1d'], ['l2', 'k.l2'], ['mmu', 'k.mmu']] as const) {
    anchors[id] = W(city, blocks[k]!.c.clone().setZ(CITY[k]!.h));
  }

  /* ───────── tư thế camera cho từng điểm đến ───────── */
  const P = (T: THREE.Vector3, d: number, az: number, el: number, fitW: number, params: Partial<Params> = {}, fov = 34): Pose => ({ T, d, az, el, fov, fitW, params: { panel: 1, ihs: 0, rise: 0, ...params } });
  const side = -HALF_PI;
  const blockT = (k: string) => W(city, blocks[k]!.c.clone().setZ(CITY[k]!.h * 0.6));
  const core = { ihs: 1, rise: 1 };
  const dieP = { ihs: 1, rise: 0 };
  const poses: Record<FocusId, Pose> = {
    pc: P(new THREE.Vector3(8, 23, 2), 118, -0.9, 0.2, 62, { panel: 0 }),
    board: P(W(board, B(12.2, 17.5, 2)), 52, side + 0.34, 0.12, 31),
    cpu: P(W(board, B(SC.x, SC.y, Z0 + 0.5)), 10.5, side + 0.42, 0.42, 6.8),
    'cpu.die': P(W(pkg, dieUV(0.5, 0.5)), 3.0, side + 0.3, 0.32, 2.35, dieP, 32),
    'cpu.core': P(W(city, cityP(0.5, 0.5, 0.004)), 0.85, side + 0.4, 0.42, 0.62, core, 32),
    'cpu.fetch': P(blockT('fetch'), 0.4, side + 0.4, 0.45, 0.34, core, 32),
    'cpu.decode': P(blockT('decode'), 0.4, side + 0.4, 0.45, 0.34, core, 32),
    'cpu.registers': P(blockT('regs'), 0.4, side + 0.4, 0.45, 0.34, core, 32),
    'cpu.alu': P(blockT('alu'), 0.4, side + 0.4, 0.45, 0.34, core, 32),
    'cpu.mmu': P(blockT('mmu'), 0.4, side + 0.4, 0.42, 0.34, core, 32),
    'cpu.l1': P(W(city, cityP(0.165, 0.5, 0.004)), 0.38, side + 0.4, 0.45, 0.32, core, 32),
    'cpu.l2': P(blockT('l2'), 0.42, side + 0.45, 0.42, 0.34, core, 32),
    'cpu.l3': P(W(pkg, dieUV(0.49, 0.5)), 2.4, side + 0.3, 0.32, 2.3, dieP, 32),
    'cpu.imc': P(W(pkg, dieUV(0.2, 0.5)), 1.9, side + 0.4, 0.32, 1.5, dieP, 32),
    'bus.memory': P(W(board, B(13.6, 22.2, Z0)), 11, side + 0.3, 0.55, 8.6),
    ram: P(W(board, B(17.6, 21.7, 2.4)), 19, side + 0.62, 0.3, 12.5),
    'ram.cells': P(W(board, cellsChip.clone().setX(cellsChip.x + 0.05)), 8, side + 1.05, 0.25, 6.5),
    'bus.pcie': P(W(board, B(7.8, 17.6, Z0)), 9.5, side + 0.25, 0.55, 7.5),
    ssd: P(W(board, B(9.6, 17.6, Z0 + 0.6)), 11, side + 0.25, 0.5, 9.4),
    'ssd.controller': P(W(board, B(8.4, 17.6, Z0 + 0.7)), 6.5, side + 0.3, 0.55, 6),
    'ssd.nand': P(W(board, B(10.0, 17.6, Z0 + 0.7)), 7, side + 0.3, 0.55, 6.5),
    gpu: P(W(board, B(12.4, 13.6, 6.5)), 42, side + 0.42, 0.32, 30),
    chipset: P(W(board, B(17.5, 6.5, Z0 + 1.0)), 17, side + 0.42, 0.12, 13),
    nic: P(W(board, B(6.5, 28.8, Z0 + 0.1)), 10, side + 0.35, 0.12, 8),
  };
  /** điểm lao vào ALU (chuyển sang thế giới vi mô) */
  const aluDive = P(W(city, blocks.alu!.c.clone().setZ(CITY.alu!.h)), 0.012, side + 0.15, 0.25, 0.01, core, 32);

  /* ───────── cập nhật theo trạng thái (thuần hàm của state) ───────── */
  const hue = new THREE.Color();
  function update(s: MacroState) {
    const t = s.t;
    // kính hông
    const pOpen = clamp01(s.panel);
    glass.position.x = -10.55 - 3.2 * sstep(0, 0.35, pOpen);
    glass.position.z = -58 * sstep(0.3, 1, pOpen);
    glassMat.opacity = 0.1 * (1 - sstep(0.7, 1, pOpen));
    glass.visible = pOpen < 0.995;
    // quạt, đèn RGB
    fans.forEach((f, i) => (f.rotation.z = t * (2.6 + i * 0.3)));
    hue.setHSL((0.55 + t * 0.03) % 1, 0.85, 0.6).multiplyScalar(2.5);
    (rgbFront.material as THREE.MeshBasicMaterial).color.copy(hue);
    // IHS nhấc lên rồi bay ra khỏi khung
    const lift = easeOut(sstep(0, 0.45, s.ihs)), away = sstep(0.4, 1, s.ihs);
    ihs.position.set(0, away * 9, lift * 1.6 + away * 3);
    ihs.rotation.x = -away * 0.9;
    ihs.visible = s.ihs < 0.995;
    // lõi mọc lên
    const rise = clamp01(s.rise);
    city.visible = rise > 0.01;
    for (const [k, b] of Object.entries(blocks)) {
      b.mesh.scale.z = Math.max(rise, 0.001);
      b.mesh.position.z = (b.h * rise) / 2;
      b.frame.position.z = b.h * rise + 0.0004;
      const hl = s.hl[`c.${k}`] ?? 0;
      b.fm.uniforms.uA!.value = rise * (0.08 + hl * 0.9);
      b.mat.emissiveIntensity = 0.02 + hl * 0.4;
    }
    links.visible = rise > 0.6;
    linkMat.uniforms.uTime!.value = t;
    linkMat.uniforms.uOn!.value = sstep(0.6, 1, rise);
    // bus
    for (const [k, m] of Object.entries(busMat)) {
      m.uniforms.uTime!.value = t;
      m.uniforms.uOn!.value = 0.35 + (s.hl[k] ?? 0) * 1.9;
    }
    for (const [k, m] of Object.entries(halos)) m.uniforms.uA!.value = s.hl[k] ?? 0;
    cellsMat.opacity = clamp01(s.hl['h.ram.cells'] ?? 0);
    for (const [key, list] of Object.entries(dieHl)) {
      if (key === 'd.cores' || key === 'd.core1') continue;
      for (const m of list) m.uniforms.uA!.value = (s.hl[key] ?? 0) * (1 - rise * 0.8);
    }
    // core1 dùng chung khung với "cores": lấy giá trị lớn hơn
    const vc = s.hl['d.cores'] ?? 0, v1 = s.hl['d.core1'] ?? 0;
    for (const m of dieHl['d.cores']!) m.uniforms.uA!.value = Math.max(vc, dieHl['d.core1']!.includes(m) ? v1 : 0) * (1 - rise * 0.8);
    // lệnh Add Y chạy qua lõi
    const k = s.instr;
    const show = k >= 0 && rise > 0.6;
    tTok.visible = tAC.visible = tY.visible = tRes.visible = show;
    if (show) {
      const P0 = above('l1i'), P1 = above('fetch'), P2 = above('decode'), P3 = above('alu');
      const seg = (a: number, b: number) => clamp01((k - a) / (b - a));
      const pos = k < 0.25 ? P0.clone().lerp(P1, easeOut(seg(0.05, 0.25))) : k < 0.45 ? P1.clone().lerp(P2, easeOut(seg(0.27, 0.45))) : P2.clone().lerp(P3, easeOut(seg(0.47, 0.62)));
      tTok.position.copy(pos);
      tTok.position.z += 0.012;
      (tTok.material as THREE.SpriteMaterial).opacity = sstep(0, 0.05, k) * (1 - sstep(0.7, 0.78, k));
      const op = sstep(0.55, 0.62, k);
      tAC.position.copy(above('regs').lerp(above('alu'), easeOut(seg(0.6, 0.72))));
      tY.position.copy(above('l1d').lerp(above('alu'), easeOut(seg(0.6, 0.72))));
      tY.position.x += 0.012;
      tAC.position.y += 0.01;
      (tAC.material as THREE.SpriteMaterial).opacity = (tY.material as THREE.SpriteMaterial).opacity = op * (1 - sstep(0.76, 0.8, k));
      tRes.position.copy(above('alu', 0.03).lerp(above('regs', 0.02), easeOut(seg(0.82, 0.96))));
      (tRes.material as THREE.SpriteMaterial).opacity = sstep(0.77, 0.82, k);
      // khối đang làm việc sáng lên
      const busy = (a: number, b: number) => sstep(a, a + 0.03, k) * (1 - sstep(b, b + 0.05, k));
      blocks.fetch!.mat.emissiveIntensity += busy(0.2, 0.32) * 0.8;
      blocks.decode!.mat.emissiveIntensity += busy(0.42, 0.55) * 0.8;
      blocks.alu!.mat.emissiveIntensity += busy(0.68, 0.84) * 1.4;
      blocks.regs!.mat.emissiveIntensity += busy(0.9, 1.0) * 0.9;
    }
  }

  return { scene, anchors, poses, aluDive, update, key, scope, board, city };
}
export type Macro = ReturnType<typeof buildMacro>;
