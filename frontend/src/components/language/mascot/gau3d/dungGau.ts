/**
 * 🐼 Gấu trúc Bíp 3D — dựng HOÀN TOÀN bằng mã (three.js), không tải mô hình.
 *
 * Vì sao không .glb từ Blender: app desktop không gói `frontend/public` và chạy ở origin `app://` (CSP
 * riêng), một tệp mô hình sẽ phải xin đường qua đó và tải thêm ~1 MB; dựng tại chỗ thì 0 byte tài
 * nguyên, sắc nét ở mọi cỡ, đổi màu theo giao diện được — đúng cách CuongMini (sach-hoc/goi/sanKhau3D.ts)
 * đã làm. Gấu trúc là nhân vật "toàn hình cầu" nên dựng thủ tục lại ra đẹp hơn mô hình nén.
 *
 * Nhận diện theo /public/mascots/bip.png: đầu to tròn, thân trắng, tai – vành mắt – tay chân xám đá
 * (#4a5565, KHÔNG đen tuyền), tai trong hồng san hô, má hồng, mắt to long lanh hai đốm sáng, miệng cười
 * có lưỡi hồng, bàn chân có đệm sáng. Đổ bóng toon 3 bậc + viền tối mảnh (inverted hull).
 *
 * KHUÔN MẶT là một canvas 2D dán lên đầu (texture equirect): vành mắt, mắt, mũi, miệng, má, kính — mọi
 * biểu cảm vẽ lại khi tham số đổi. Mọi tham số TIẾN DẦN tới đích mỗi khung hình (lerp) ⇒ đổi cảm xúc
 * không bao giờ giật.
 *
 * Dùng hai cách: `taoSanKhauGau(canvas)` — sân khấu đứng riêng (renderer + vòng vẽ); hoặc `dungGau()` —
 * chỉ trả về Group để cắm vào cảnh khác (lộ trình 3D) mà không mở thêm WebGL context.
 */
import * as THREE from 'three';

export type CamXucGau = 'happy' | 'cheer' | 'sad' | 'think' | 'surprised' | 'sleep';
export type VariantGau = 'bip' | 'sensei' | 'zippy' | 'grumpy' | 'sage';

export interface Gau {
  nhom: THREE.Group;
  datCamXuc(c: CamXucGau): void;
  datVariant(v: VariantGau): void;
  /** Vẫy tay chào một lượt (~1,6 s). */
  vay(): void;
  /** Bung sao lấp lánh (mừng). */
  sao(): void;
  /**
   * Mỗi khung hình. `mieng`: độ mở miệng 0–1 từ giọng nói; `-1` = tự mấp máy khi `dangNoi`.
   * `nhinX/nhinY` −1…1: hướng nhìn (con trỏ). Trả `true` nếu có gì đổi (cần vẽ lại).
   */
  capNhat(dt: number, o: { mieng: number; dangNoi: boolean; nhinX: number; nhinY: number }): boolean;
  huy(): void;
}

/* ── Màu nhận diện ── */
const MAU = {
  trang: '#fbfcfe',
  xam: '#4a5565',
  xamDam: '#3b4452',
  vien: '#273040',
  hong: '#f0637a',
  hongMa: '#f9a8c9',
  luoi: '#f472b6',
  mieng: '#5b1d2e',
  demChan: '#cfd6df',
};

/* ── Tham số biểu cảm (0–1 trừ khi ghi khác) ── */
type ThamSo = {
  mo: number;      // mắt mở
  to: number;      // cỡ mắt (ngạc nhiên 1.3)
  vuiMat: number;  // mắt ^^ cong
  cuoi: number;    // miệng: -1 mếu … 1 cười
  mieng: number;   // miệng mở
  ma: number;      // má hồng
  lo: number;      // lông mày lo (buồn)
  nuoc: number;    // giọt nước mắt
  ngu: number;     // ngủ (mắt nhắm thành vạch cong, zzz)
  nghiMat: number; // mắt liếc lên (suy nghĩ)
  nhinX: number; nhinY: number; // −1…1
  // thân
  nghieng: number; // đầu nghiêng (rad)
  gat: number;     // đầu gật/ngửa (rad, + = cúi)
  quay: number;    // đầu quay (rad)
  tayP: number; tayT: number; // tay 0 buông … 1 giơ cao
  tayCam: number;  // tay phải gập vào cằm (suy nghĩ)
  nhay: number;    // biên độ nhảy
  xep: number;     // xẹp (buồn)
  taiXe: number;   // tai cụp
};

const DICH: Record<CamXucGau, Partial<ThamSo>> = {
  happy:     { mo: 1, to: 1, vuiMat: 0, cuoi: 0.75, ma: 0.55, lo: 0, nuoc: 0, ngu: 0, nghiMat: 0, nghieng: 0.03, gat: 0, quay: 0, tayP: 0, tayT: 0, tayCam: 0, nhay: 0, xep: 0, taiXe: 0 },
  cheer:     { mo: 1, to: 1, vuiMat: 1, cuoi: 1, ma: 1, lo: 0, nuoc: 0, ngu: 0, nghiMat: 0, nghieng: 0.08, gat: -0.1, quay: 0, tayP: 1, tayT: 1, tayCam: 0, nhay: 1, xep: 0, taiXe: 0 },
  sad:       { mo: 0.8, to: 1, vuiMat: 0, cuoi: -0.8, ma: 0.35, lo: 1, nuoc: 1, ngu: 0, nghiMat: 0, nghieng: -0.14, gat: 0.22, quay: 0, tayP: 0, tayT: 0, tayCam: 0, nhay: 0, xep: 1, taiXe: 1 },
  think:     { mo: 0.9, to: 1, vuiMat: 0, cuoi: 0.1, ma: 0.3, lo: 0.25, nuoc: 0, ngu: 0, nghiMat: 1, nghieng: 0.14, gat: -0.06, quay: -0.12, tayP: 0.55, tayT: 0, tayCam: 1, nhay: 0, xep: 0, taiXe: 0 },
  surprised: { mo: 1, to: 1.35, vuiMat: 0, cuoi: 0.1, ma: 0.9, lo: 0, nuoc: 0, ngu: 0, nghiMat: 0, nghieng: 0, gat: -0.18, quay: 0, tayP: 0.75, tayT: 0.75, tayCam: 0, nhay: 0.35, xep: 0, taiXe: 0 },
  sleep:     { mo: 0.05, to: 1, vuiMat: 0, cuoi: 0.25, ma: 0.4, lo: 0, nuoc: 0, ngu: 1, nghiMat: 0, nghieng: 0.26, gat: 0.2, quay: 0.1, tayP: 0, tayT: 0, tayCam: 0, nhay: 0, xep: 0.6, taiXe: 0.5 },
};
/** Độ mở miệng riêng theo cảm xúc (khi không nói). */
const MIENG_NEN: Record<CamXucGau, number> = { happy: 0.12, cheer: 0.6, sad: 0.05, think: 0.04, surprised: 0.85, sleep: 0.08 };

const tien = (a: number, b: number, k: number) => a + (b - a) * k;

/* ── Vật liệu toon dùng chung ── */
let gradientMap: THREE.DataTexture | null = null;
function layGradient(): THREE.DataTexture {
  if (gradientMap) return gradientMap;
  // 3 bậc sáng: bóng – trung – sáng. Bậc tối không quá sâu để gấu trắng vẫn trắng trên nền tối.
  gradientMap = new THREE.DataTexture(new Uint8Array([128, 196, 255]), 3, 1, THREE.RedFormat);
  gradientMap.minFilter = THREE.NearestFilter;
  gradientMap.magFilter = THREE.NearestFilter;
  gradientMap.generateMipmaps = false;
  gradientMap.needsUpdate = true;
  return gradientMap;
}
function toon(color: string, extra: Partial<THREE.MeshToonMaterialParameters> = {}) {
  return new THREE.MeshToonMaterial({ color, gradientMap: layGradient(), ...extra });
}
/** Viền tối: vỏ lộn mặt sau, đẩy đỉnh theo pháp tuyến một khoảng CỐ ĐỊNH (không phụ thuộc cỡ bộ phận). */
function vienMat(doDay: number) {
  const m = new THREE.MeshBasicMaterial({ color: MAU.vien, side: THREE.BackSide });
  m.onBeforeCompile = (sh) => {
    sh.vertexShader = sh.vertexShader.replace('#include <begin_vertex>', `vec3 transformed = position + normalize(normal) * ${doDay.toFixed(4)};`);
  };
  return m;
}

function khoi(geo: THREE.BufferGeometry, mat: THREE.Material, vien: THREE.Material | null, pos: [number, number, number], scale?: [number, number, number]) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(...pos);
  if (scale) m.scale.set(...scale);
  if (vien) {
    const v = new THREE.Mesh(geo, vien);
    v.renderOrder = -1;
    m.add(v);
  }
  return m;
}

/* ── Khuôn mặt (canvas equirect dán lên đầu) ── */
const MW = 1024, MH = 512, TL = 0.75; // vẽ ở hệ 1024×512, canvas thật 768×384
const px = (deg: number) => (deg * MW) / 360; // độ kinh → điểm ảnh ngang
const CX = MW * 0.25; // mặt trước của SphereGeometry nằm ở u = 0.25
const CY = MH * 0.5;  // xích đạo

function veMat(g: CanvasRenderingContext2D, p: ThamSo, variant: VariantGau, t: number) {
  g.setTransform(TL, 0, 0, TL, 0, 0);
  g.fillStyle = MAU.trang;
  g.fillRect(0, 0, MW, MH);

  const ey = CY + 20 - p.nhinY * 4; // tầm mắt hơi dưới xích đạo (trán cao = chibi)

  // Má hồng — vẽ trước để nằm dưới vành mắt.
  if (p.ma > 0.02) {
    for (const s of [-1, 1]) {
      const mx = CX + s * px(44), my = ey + 48;
      const gr = g.createRadialGradient(mx, my, 2, mx, my, 44);
      gr.addColorStop(0, `rgba(249,168,201,${0.85 * p.ma})`);
      gr.addColorStop(1, 'rgba(249,168,201,0)');
      g.fillStyle = gr;
      g.beginPath(); g.ellipse(mx, my, 48, 34, 0, 0, Math.PI * 2); g.fill();
    }
  }

  // Vành mắt xám đá, nghiêng: mép ngoài cao hơn (giống ảnh gốc).
  g.fillStyle = MAU.xam;
  for (const s of [-1, 1]) {
    g.save();
    g.translate(CX + s * px(29), ey + 4);
    g.rotate(s * 0.42);
    g.beginPath(); g.ellipse(0, 0, 50, 64 * (1 - p.xep * 0.08), 0, 0, Math.PI * 2); g.fill();
    g.restore();
  }

  // Lông mày lo (buồn / nghĩ): hai vạch ngắn chếch vào trong, trên vành mắt.
  if (p.lo > 0.03) {
    g.strokeStyle = MAU.xamDam; g.lineCap = 'round'; g.lineWidth = 9; g.globalAlpha = p.lo;
    for (const s of [-1, 1]) {
      g.beginPath();
      g.moveTo(CX + s * px(13), ey - 104 - 6 * p.lo);
      g.lineTo(CX + s * px(31), ey - 92 + 8 * p.lo);
      g.stroke();
    }
    g.globalAlpha = 1;
  }

  // Mắt.
  for (const s of [-1, 1]) {
    const ex = CX + s * px(27) + p.nhinX * 6, eyy = ey + 6;
    const r = 34 * p.to;
    const mo = Math.max(0.04, p.mo);
    const ngu = p.ngu;
    const vui = p.vuiMat * (1 - ngu);
    // 1) Mắt thường (tròng trắng + con ngươi + hai đốm sáng)
    const aThuong = (1 - vui) * (1 - ngu);
    if (aThuong > 0.02) {
      g.save();
      g.globalAlpha = aThuong;
      // tròng trắng, cắt theo độ mở
      g.fillStyle = '#ffffff';
      g.beginPath(); g.ellipse(ex, eyy, r, Math.max(3, r * 1.12 * mo), 0, 0, Math.PI * 2); g.fill();
      g.save();
      g.clip();
      // con ngươi (nhìn theo con trỏ / liếc lên khi nghĩ)
      const dx = p.nhinX * 9 + (p.nghiMat * 8 * -s), dy = -p.nhinY * 7 - p.nghiMat * 12;
      g.fillStyle = '#1f2630';
      g.beginPath(); g.ellipse(ex + dx, eyy + dy + 3, r * 0.66, r * 0.74, 0, 0, Math.PI * 2); g.fill();
      // đốm sáng
      g.fillStyle = '#ffffff';
      g.beginPath(); g.arc(ex + dx - r * 0.26, eyy + dy - r * 0.3, r * 0.3, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.arc(ex + dx + r * 0.3, eyy + dy + r * 0.28, r * 0.13, 0, Math.PI * 2); g.fill();
      g.restore();
      // mí trên (viền mềm)
      g.strokeStyle = MAU.xamDam; g.lineWidth = 3;
      g.beginPath(); g.ellipse(ex, eyy, r, Math.max(3, r * 1.12 * mo), 0, Math.PI * 1.15, Math.PI * 1.85); g.stroke();
      g.restore();
    }
    // 2) Mắt cười ^^ — vòng cung trắng dày trên nền vành tối.
    if (vui > 0.02) {
      g.save(); g.globalAlpha = vui;
      g.strokeStyle = '#ffffff'; g.lineCap = 'round'; g.lineWidth = 11;
      g.beginPath(); g.arc(ex, eyy + 16, 26, Math.PI * 1.15, Math.PI * 1.85); g.stroke();
      g.restore();
    }
    // 3) Mắt ngủ — vạch cong úp xuống + lông mi.
    if (ngu > 0.02) {
      g.save(); g.globalAlpha = ngu;
      g.strokeStyle = '#ffffff'; g.lineCap = 'round'; g.lineWidth = 9;
      g.beginPath(); g.arc(ex, eyy - 10, 24, Math.PI * 0.15, Math.PI * 0.85); g.stroke();
      g.restore();
    }
    // 4) Giọt nước mắt (buồn) — chảy ở khoé ngoài, lặp theo thời gian.
    if (p.nuoc > 0.03) {
      const ph = (t * 0.6 + (s > 0 ? 0.5 : 0)) % 1;
      g.save(); g.globalAlpha = p.nuoc * (1 - ph) * 0.95;
      g.fillStyle = '#7dd3fc';
      const tx = ex + s * (r + 10), ty = eyy + 18 + ph * 70;
      g.beginPath(); g.moveTo(tx, ty - 14); g.quadraticCurveTo(tx + 9, ty + 4, tx, ty + 8); g.quadraticCurveTo(tx - 9, ty + 4, tx, ty - 14); g.fill();
      g.restore();
    }
  }

  // Kính tròn (Sensei).
  if (variant === 'sensei') {
    g.strokeStyle = '#2d3a4b'; g.lineWidth = 7; g.lineCap = 'round';
    for (const s of [-1, 1]) { g.beginPath(); g.arc(CX + s * px(26), ey + 2, 44, 0, Math.PI * 2); g.stroke(); }
    g.beginPath(); g.moveTo(CX - px(26) + 44, ey - 2); g.quadraticCurveTo(CX, ey - 14, CX + px(26) - 44, ey - 2); g.stroke();
    g.strokeStyle = 'rgba(255,255,255,0.55)'; g.lineWidth = 5;
    for (const s of [-1, 1]) { g.beginPath(); g.arc(CX + s * px(26) - 12, ey - 12, 18, Math.PI * 1.05, Math.PI * 1.55); g.stroke(); }
  }

  // Mũi: tam giác bo góc.
  const ny = ey + 58;
  g.fillStyle = MAU.xamDam;
  g.beginPath();
  g.moveTo(CX - 20, ny - 10); g.lineTo(CX + 20, ny - 10);
  g.quadraticCurveTo(CX + 18, ny + 6, CX, ny + 14);
  g.quadraticCurveTo(CX - 18, ny + 6, CX - 20, ny - 10);
  g.fill();
  g.fillStyle = 'rgba(255,255,255,0.35)';
  g.beginPath(); g.ellipse(CX - 7, ny - 4, 6, 3.5, -0.3, 0, Math.PI * 2); g.fill();

  // Miệng: cười / mếu + độ mở (nói).
  const my = ny + 36;
  const w = 36 + 10 * Math.max(0, p.cuoi);
  const mo = Math.max(0, Math.min(1, p.mieng));
  g.strokeStyle = MAU.xamDam; g.lineCap = 'round'; g.lineJoin = 'round'; g.lineWidth = 7;
  if (mo > 0.08) {
    // Miệng mở: hình hạt đậu, lưỡi hồng bên trong.
    const h = 10 + 34 * mo, ww = w * (0.8 + 0.2 * mo);
    g.fillStyle = MAU.mieng;
    g.beginPath();
    g.moveTo(CX - ww, my - 2 - 8 * p.cuoi);
    g.quadraticCurveTo(CX, my + h * 1.15 + 10 * p.cuoi, CX + ww, my - 2 - 8 * p.cuoi);
    g.quadraticCurveTo(CX, my + 6 - 4 * p.cuoi, CX - ww, my - 2 - 8 * p.cuoi);
    g.closePath(); g.fill(); g.stroke();
    g.save(); g.clip();
    g.fillStyle = MAU.luoi;
    g.beginPath(); g.ellipse(CX, my + h * 1.05, ww * 0.62, h * 0.55, 0, 0, Math.PI * 2); g.fill();
    g.restore();
  } else {
    g.beginPath();
    g.moveTo(CX - w, my - 6 * p.cuoi);
    g.quadraticCurveTo(CX, my + 26 * p.cuoi, CX + w, my - 6 * p.cuoi);
    g.stroke();
    // nhân trung nối mũi → miệng
    g.lineWidth = 5;
    g.beginPath(); g.moveTo(CX, ny + 12); g.lineTo(CX, my - 2 + 6 * Math.max(0, p.cuoi)); g.stroke();
  }
}

/* ── Dựng gấu ── */
export function dungGau(o: { variant?: VariantGau; giamChuyenDong?: boolean } = {}): Gau {
  let variant: VariantGau = o.variant ?? 'bip';
  const cham = o.giamChuyenDong ? 0 : 1;

  const nhom = new THREE.Group();
  nhom.name = 'gau-truc';
  const nhun = new THREE.Group(); // nhảy / xẹp — mọi thứ trừ bóng
  nhom.add(nhun);

  const vien = vienMat(0.028);
  const vienMong = vienMat(0.02);
  const trang = toon(MAU.trang);
  const xam = toon(MAU.xam);
  const hong = toon(MAU.hong);
  const dem = toon(MAU.demChan);

  const gCau = new THREE.SphereGeometry(1, 48, 32);
  const gCauNho = new THREE.SphereGeometry(1, 28, 20);

  /* Thân */
  const than = khoi(gCau, trang, vien, [0, -0.3, 0], [0.95, 1.02, 0.88]);
  nhun.add(than);
  /* Đuôi */
  nhun.add(khoi(gCauNho, trang, vienMong, [0, -0.95, -0.78], [0.22, 0.22, 0.22]));
  /* Chân (ngồi, bàn chân hướng ra trước) + đệm chân */
  for (const s of [-1, 1]) {
    const chan = khoi(gCauNho, xam, vien, [s * 0.58, -1.18, 0.38], [0.44, 0.34, 0.46]);
    nhun.add(chan);
    const demLon = khoi(gCauNho, dem, null, [0, 0.05, 0.86], [0.5, 0.56, 0.24]);
    chan.add(demLon);
    for (let i = -1; i <= 1; i++) chan.add(khoi(gCauNho, dem, null, [i * 0.3, 0.62, 0.72], [0.14, 0.16, 0.12]));
  }

  /* Tay — pivot ở vai để giơ/vẫy. */
  const gTay = new THREE.CapsuleGeometry(0.24, 0.42, 8, 18);
  const vaiP = new THREE.Group(); vaiP.position.set(0.86, 0.3, 0.32); nhun.add(vaiP);
  const vaiT = new THREE.Group(); vaiT.position.set(-0.86, 0.3, 0.32); nhun.add(vaiT);
  const tayP = khoi(gTay, xam, vien, [0, -0.4, 0]); vaiP.add(tayP);
  const tayT = khoi(gTay, xam, vien, [0, -0.4, 0]); vaiT.add(tayT);
  // đệm tay (lòng bàn tay) — thấy khi vẫy
  tayP.add(khoi(gCauNho, dem, null, [0, -0.5, 0.17], [0.12, 0.14, 0.06]));

  /* Đầu */
  const co = new THREE.Group(); co.position.set(0, 0.62, 0); nhun.add(co);
  const dau = new THREE.Group(); dau.position.set(0, 0.72, 0); co.add(dau);
  const cvMat = document.createElement('canvas');
  cvMat.width = MW * TL; cvMat.height = MH * TL;
  const gMat = cvMat.getContext('2d')!;
  const texMat = new THREE.CanvasTexture(cvMat);
  texMat.colorSpace = THREE.SRGBColorSpace;
  texMat.anisotropy = 4;
  const matDau = toon('#ffffff', { map: texMat });
  const dauMesh = khoi(gCau, matDau, vien, [0, 0, 0], [1.02, 0.98, 1]);
  dau.add(dauMesh);
  /* Tai */
  const taiNhom: THREE.Group[] = [];
  for (const s of [-1, 1]) {
    const goc = new THREE.Group(); goc.position.set(s * 0.74, 0.74, -0.08); dau.add(goc);
    goc.add(khoi(gCauNho, xam, vien, [0, 0, 0], [0.36, 0.36, 0.3]));
    goc.add(khoi(gCauNho, hong, null, [s * 0.02, -0.02, 0.17], [0.2, 0.21, 0.09]));
    taiNhom.push(goc);
  }
  /* Chỏm lông */
  const gChom = new THREE.ConeGeometry(0.09, 0.26, 10);
  const chom1 = khoi(gChom, trang, vienMong, [0.04, 1.02, 0.16]); chom1.rotation.z = -0.35; dau.add(chom1);
  const chom2 = khoi(gChom, trang, vienMong, [-0.12, 1.0, 0.12]); chom2.rotation.z = 0.45; dau.add(chom2);

  /* Phụ kiện theo vai */
  const phuKien = new THREE.Group(); nhun.add(phuKien);
  const phuKienDau = new THREE.Group(); dau.add(phuKienDau);
  const dungPhuKien = () => {
    for (const g of [phuKien, phuKienDau]) while (g.children.length) g.remove(g.children[0]);
    const gKhan = new THREE.TorusGeometry(0.74, 0.1, 10, 36);
    if (variant === 'zippy') {
      // Khăn cổ xanh ngọc + băng đô.
      const khan = khoi(gKhan, toon('#22d3ee'), vienMong, [0, 0.42, 0.05]); khan.rotation.x = Math.PI / 2; khan.scale.set(1, 1, 0.8); phuKien.add(khan);
      const bang = khoi(new THREE.TorusGeometry(0.98, 0.08, 8, 40), toon('#22d3ee'), null, [0, 0.42, 0]); bang.rotation.x = Math.PI / 2 - 0.25; phuKienDau.add(bang);
    } else if (variant === 'sage') {
      // Vương miện vàng.
      const vang = toon('#f5c518');
      const vanh = khoi(new THREE.CylinderGeometry(0.42, 0.5, 0.22, 24, 1, true), new THREE.MeshToonMaterial({ color: '#f5c518', gradientMap: layGradient(), side: THREE.DoubleSide }), null, [0, 0.98, 0.1]);
      vanh.rotation.x = -0.15; phuKienDau.add(vanh);
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        const rang = khoi(new THREE.ConeGeometry(0.09, 0.22, 6), vang, null, [Math.sin(a) * 0.42, 1.16, 0.1 + Math.cos(a) * 0.42]);
        rang.rotation.x = -0.15; vanh.add(rang); rang.position.y = 0.18;
      }
      const khan = khoi(gKhan, toon('#eab308'), vienMong, [0, 0.42, 0.05]); khan.rotation.x = Math.PI / 2; khan.scale.set(1, 1, 0.8); phuKien.add(khan);
    } else if (variant === 'sensei') {
      const khan = khoi(gKhan, toon('#8b5cf6'), vienMong, [0, 0.42, 0.05]); khan.rotation.x = Math.PI / 2; khan.scale.set(1, 1, 0.8); phuKien.add(khan);
    } else if (variant === 'grumpy') {
      // Mũ ngủ xám xanh với chỏm bông.
      const mu = khoi(new THREE.ConeGeometry(0.62, 0.9, 20), toon('#94a3b8'), vienMong, [0.1, 1.12, 0]); mu.rotation.z = -0.5; phuKienDau.add(mu);
      mu.add(khoi(gCauNho, trang, vienMong, [0, 0.5, 0], [0.16, 0.16, 0.16]));
    } else {
      const khan = khoi(gKhan, toon('#f59e0b'), vienMong, [0, 0.42, 0.05]); khan.rotation.x = Math.PI / 2; khan.scale.set(1, 1, 0.8); phuKien.add(khan);
    }
  };
  dungPhuKien();

  /* Bóng đổ mềm dưới chân */
  const cvBong = document.createElement('canvas'); cvBong.width = cvBong.height = 128;
  const gb = cvBong.getContext('2d')!;
  const grB = gb.createRadialGradient(64, 64, 4, 64, 64, 62);
  grB.addColorStop(0, 'rgba(20,24,40,0.55)'); grB.addColorStop(1, 'rgba(20,24,40,0)');
  gb.fillStyle = grB; gb.fillRect(0, 0, 128, 128);
  const texBong = new THREE.CanvasTexture(cvBong);
  const bong = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.5), new THREE.MeshBasicMaterial({ map: texBong, transparent: true, depthWrite: false }));
  bong.rotation.x = -Math.PI / 2; bong.position.y = -1.52; bong.renderOrder = -2;
  nhom.add(bong);

  /* Sao lấp lánh (mừng) */
  const hinhSao = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? 0.16 : 0.07, a = (i / 10) * Math.PI * 2 - Math.PI / 2;
    if (i === 0) hinhSao.moveTo(Math.cos(a) * r, Math.sin(a) * r); else hinhSao.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  hinhSao.closePath();
  const gSao = new THREE.ShapeGeometry(hinhSao);
  const saoDs: { m: THREE.Mesh; v: THREE.Vector3; t: number }[] = [];
  const saoNhom = new THREE.Group(); nhom.add(saoNhom);
  for (let i = 0; i < 10; i++) {
    const m = new THREE.Mesh(gSao, new THREE.MeshBasicMaterial({ color: i % 3 === 0 ? '#fbbf24' : i % 3 === 1 ? '#f472b6' : '#a78bfa', transparent: true, opacity: 0, depthWrite: false }));
    m.visible = false; saoNhom.add(m); saoDs.push({ m, v: new THREE.Vector3(), t: 9 });
  }

  /* Zzz khi ngủ — sprite chữ z */
  const cvZ = document.createElement('canvas'); cvZ.width = cvZ.height = 128;
  const gz = cvZ.getContext('2d')!;
  gz.font = 'bold 96px ui-rounded, "SF Pro Rounded", system-ui, sans-serif'; gz.textAlign = 'center'; gz.textBaseline = 'middle';
  gz.lineWidth = 14; gz.strokeStyle = '#1f2630'; gz.lineJoin = 'round'; gz.strokeText('z', 64, 70);
  gz.fillStyle = '#38bdf8'; gz.fillText('z', 64, 70);
  const texZ = new THREE.CanvasTexture(cvZ); texZ.colorSpace = THREE.SRGBColorSpace;
  const zzz: THREE.Sprite[] = [];
  for (let i = 0; i < 3; i++) {
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: texZ, transparent: true, opacity: 0, depthWrite: false }));
    sp.visible = false; nhom.add(sp); zzz.push(sp);
  }

  /* Trạng thái */
  const p: ThamSo = { mo: 1, to: 1, vuiMat: 0, cuoi: 0.75, mieng: 0.12, ma: 0.55, lo: 0, nuoc: 0, ngu: 0, nghiMat: 0, nhinX: 0, nhinY: 0, nghieng: 0, gat: 0, quay: 0, tayP: 0, tayT: 0, tayCam: 0, nhay: 0, xep: 0, taiXe: 0 };
  let camXuc: CamXucGau = 'happy';
  let t = 0;
  let chopDen = 2.2, chop = 0; // chớp mắt: đếm ngược tới lần kế, pha chớp 0–1
  let vayCon = 0;              // thời gian vẫy còn lại
  let mieuTaCu = '';
  let camMoi = 0;              // thời điểm đổi cảm xúc (nhảy cheer đếm từ đây)

  const veMatNeuDoi = () => {
    const key = [p.mo, p.to, p.vuiMat, p.cuoi, p.mieng, p.ma, p.lo, p.ngu, p.nghiMat, p.nhinX, p.nhinY].map((x) => Math.round(x * 40)).join(',') + variant + (p.nuoc > 0.03 ? Math.round(t * 12) : '');
    if (key === mieuTaCu) return false;
    mieuTaCu = key;
    veMat(gMat, p, variant, t);
    texMat.needsUpdate = true;
    return true;
  };
  veMatNeuDoi();

  const capNhat: Gau['capNhat'] = (dt, o2) => {
    t += dt;
    const k = 1 - Math.pow(0.004, dt);      // lerp mượt, không phụ thuộc fps
    const kNhanh = 1 - Math.pow(0.0005, dt);
    const d = DICH[camXuc];
    for (const key of Object.keys(d) as (keyof ThamSo)[]) p[key] = tien(p[key], d[key] as number, k);

    // Hướng nhìn: theo con trỏ, giảm khi ngủ.
    p.nhinX = tien(p.nhinX, o2.nhinX * (1 - p.ngu), kNhanh);
    p.nhinY = tien(p.nhinY, o2.nhinY * (1 - p.ngu), kNhanh);

    // Chớp mắt.
    if (camXuc !== 'sleep' && cham) {
      chopDen -= dt;
      if (chopDen <= 0) { chop = 1; chopDen = 2.4 + Math.random() * 3; }
      if (chop > 0) {
        chop = Math.max(0, chop - dt * 7);
        const nham = Math.sin(chop * Math.PI);
        p.mo = tien(p.mo, 0.04, nham);
      }
    }

    // Miệng: theo giọng nếu có, không thì theo cảm xúc (+ mấp máy tự động khi "đang nói" không có tiếng).
    let miengDich = MIENG_NEN[camXuc];
    if (o2.mieng >= 0) miengDich = Math.max(miengDich * 0.3, o2.mieng);
    else if (o2.dangNoi) miengDich = 0.25 + 0.45 * Math.abs(Math.sin(t * 11) * Math.sin(t * 3.3 + 1));
    p.mieng = tien(p.mieng, miengDich, kNhanh);

    // Thở + đung đưa.
    const tho = Math.sin(t * 2.1) * 0.018 * cham;
    than.scale.set(0.95 - tho * 0.4, 1.02 + tho, 0.88 - tho * 0.4);
    const dua = Math.sin(t * 1.3) * 0.025 * cham;
    // Đầu.
    dau.rotation.z = p.nghieng + dua + Math.sin(t * 0.9) * 0.02 * cham;
    dau.rotation.x = p.gat + Math.sin(t * 1.7) * 0.012 * cham;
    dau.rotation.y = p.quay + p.nhinX * 0.18;
    co.position.y = 0.62 - p.xep * 0.06;
    // Tai: đung đưa nhẹ, cụp khi buồn.
    for (let i = 0; i < 2; i++) {
      const s = i === 0 ? -1 : 1;
      const ve = Math.sin(t * 2.6 + i * 1.7) * 0.06 * cham;
      taiNhom[i].rotation.z = s * (0.1 + p.taiXe * 0.55) + ve;
      taiNhom[i].position.y = 0.74 - p.taiXe * 0.12;
    }
    // Tay.
    // Giơ tay chéo lên ngoài (\o/) chứ không thẳng đứng — thẳng đứng thì khuất sau cái đầu to.
    // Tay phải ở +x: quay z DƯƠNG mới vung ra ngoài (âm là vắt chéo qua ngực, khuất sau đầu).
    let gocP = 0.3 + p.tayP * 1.95 + p.tayCam * 1.2, gocT = -0.3 - p.tayT * 1.95;
    if (vayCon > 0) {
      vayCon -= dt;
      gocP = 2.05 + Math.sin(t * 13) * 0.42;
      vaiP.rotation.x = -0.4;
    } else {
      vaiP.rotation.x = tien(vaiP.rotation.x, p.tayCam * -0.85 + (1 - p.tayP) * (1 - p.tayCam) * 0.55 - p.tayP * 0.4, k);
    }
    vaiT.rotation.x = tien(vaiT.rotation.x, (1 - p.tayT) * 0.55 - p.tayT * 0.4, k);
    if (camXuc === 'cheer' && cham) { gocP += Math.sin(t * 9) * 0.25; gocT -= Math.sin(t * 9 + 0.6) * 0.25; }
    vaiP.rotation.z = tien(vaiP.rotation.z, gocP, kNhanh);
    vaiT.rotation.z = tien(vaiT.rotation.z, gocT, kNhanh);
    vaiP.rotation.y = tien(vaiP.rotation.y, p.tayCam * -1.25, k);
    tayP.position.y = -0.4 - p.tayCam * 0.05;

    // Nhảy mừng (squash & stretch) — vài nhịp đầu sau khi đổi cảm xúc rồi dịu dần.
    const tuDoi = t - camMoi;
    let y = 0, sxz = 1, sy = 1;
    if (p.nhay > 0.02 && cham) {
      const bien = p.nhay * Math.max(0.25, 1 - tuDoi / 4.5);
      const ph = Math.abs(Math.sin(tuDoi * 5.2));
      y = ph * 0.42 * bien;
      sy = 1 + (ph - 0.5) * 0.14 * bien;
      sxz = 1 - (ph - 0.5) * 0.1 * bien;
    }
    nhun.position.y = y + Math.sin(t * 2.1) * 0.012 * cham;
    nhun.scale.set(sxz * (1 + p.xep * 0.03), sy * (1 - p.xep * 0.05), sxz * (1 + p.xep * 0.03));
    bong.scale.setScalar(1 - y * 0.25);
    (bong.material as THREE.MeshBasicMaterial).opacity = 1 - y * 0.4;

    // Sao.
    for (const s of saoDs) {
      if (s.t >= 1.2) { s.m.visible = false; continue; }
      s.t += dt;
      s.m.position.addScaledVector(s.v, dt);
      s.v.y -= dt * 1.5;
      s.m.rotation.z += dt * 3;
      const a = Math.min(1, s.t * 6) * Math.max(0, 1 - s.t / 1.2);
      (s.m.material as THREE.MeshBasicMaterial).opacity = a;
      s.m.scale.setScalar(0.6 + s.t * 0.9);
      s.m.lookAt(s.m.position.x, s.m.position.y, 50);
    }
    // Zzz.
    for (let i = 0; i < zzz.length; i++) {
      const sp = zzz[i];
      if (p.ngu < 0.05) { sp.visible = false; continue; }
      sp.visible = true;
      const ph = ((t * 0.45 + i / 3) % 1);
      sp.position.set(0.95 + ph * 0.5 + i * 0.08, 1.9 + ph * 1.1, 0.4);
      const c = 0.28 + ph * 0.32;
      sp.scale.set(c, c, 1);
      (sp.material as THREE.SpriteMaterial).opacity = p.ngu * Math.sin(ph * Math.PI);
    }

    const doiMat = veMatNeuDoi();
    return doiMat || cham > 0 || vayCon > 0;
  };

  return {
    nhom,
    datCamXuc(c) { if (c !== camXuc) { camXuc = c; camMoi = t; if (c === 'cheer') this.sao(); } },
    datVariant(v) { if (v !== variant) { variant = v; dungPhuKien(); mieuTaCu = ''; } },
    vay() { vayCon = 1.7; },
    sao() {
      for (const s of saoDs) {
        s.t = Math.random() * -0.25;
        s.m.visible = true;
        s.m.position.set((Math.random() - 0.5) * 1.6, 1.4 + Math.random() * 0.8, 0.9);
        s.v.set((Math.random() - 0.5) * 3.2, 1.6 + Math.random() * 2.2, 0.4);
        s.m.scale.setScalar(0.6);
      }
    },
    capNhat,
    huy() {
      texMat.dispose(); texBong.dispose(); texZ.dispose();
      nhom.traverse((ob) => {
        if (ob instanceof THREE.Mesh || ob instanceof THREE.Sprite) {
          ob.geometry?.dispose?.();
          const m = ob.material as THREE.Material | THREE.Material[];
          if (Array.isArray(m)) m.forEach((x) => x.dispose()); else m?.dispose?.();
        }
      });
    },
  };
}

/* ═══════════════════════ Sân khấu đứng riêng (một canvas) ═══════════════════════ */

export interface SanKhauGau {
  datCamXuc(c: CamXucGau): void;
  datVariant(v: VariantGau): void;
  vay(): void;
  sao(): void;
  /** Bật/tắt vòng vẽ (ngoài màn hình / tab ẩn). */
  chay(on: boolean): void;
  huy(): void;
}

export function taoSanKhauGau(canvas: HTMLCanvasElement, o: {
  variant?: VariantGau;
  giamChuyenDong: boolean;
  /** Độ mở miệng 0–1 từ giọng; trả −1 khi không có lịch nói. */
  docMieng: () => number;
  docDangNoi: () => boolean;
  nhinTheoTro?: boolean;
}): SanKhauGau {
  const dpr0 = Math.min(2, window.devicePixelRatio || 1);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: dpr0 < 1.5, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(dpr0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 40);
  camera.position.set(0, 0.8, 8.3);
  camera.lookAt(0, 0.3, 0);

  // Ánh sáng: chính chếch trái-trên, phụ tím lạnh phía sau, bầu trời mềm — toon chia 3 bậc rõ mà không gắt.
  const key = new THREE.DirectionalLight('#ffffff', 2.4); key.position.set(-3, 5, 6);
  const rim = new THREE.DirectionalLight('#c4b5fd', 0.9); rim.position.set(4, 2, -4);
  scene.add(key, rim, new THREE.HemisphereLight('#ffffff', '#b6bfd1', 1.1));

  const gau = dungGau({ variant: o.variant, giamChuyenDong: o.giamChuyenDong });
  gau.nhom.position.y = -0.1;
  scene.add(gau.nhom);

  /* Con trỏ — theo toàn cửa sổ (gấu liếc theo chuột dù chuột không ở trên canvas). */
  let troX = 0, troY = 0, muonX = 0, muonY = 0;
  const onTro = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    if (!r.width) return;
    const cx = r.left + r.width / 2, cy = r.top + r.height * 0.45;
    muonX = Math.max(-1, Math.min(1, (e.clientX - cx) / (window.innerWidth * 0.5)));
    muonY = Math.max(-1, Math.min(1, -(e.clientY - cy) / (window.innerHeight * 0.5)));
  };
  if (o.nhinTheoTro !== false && !o.giamChuyenDong) window.addEventListener('pointermove', onTro, { passive: true });

  /* Kích thước: chỉ setSize khi điểm ảnh thật đổi, và vẽ lại ngay sau đó (chống nháy — xem sanKhau3D.ts). */
  let wCu = 0, hCu = 0;
  const doKhung = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h || (w === wCu && h === hCu)) return;
    wCu = w; hCu = h;
    // Trần ~2,5 triệu điểm ảnh cho một linh vật nhỏ.
    const dpr = Math.min(dpr0, Math.sqrt(2_500_000 / (w * h)) || dpr0);
    renderer.setPixelRatio(Math.max(1, dpr));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.z = camera.aspect < 0.9 ? 8.3 / Math.max(0.6, camera.aspect / 0.9) : 8.3;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
  };
  const ro = new ResizeObserver(doKhung);
  ro.observe(canvas);
  doKhung();

  let raf = 0, dangChay = true, truoc = 0, lanVe = 0, conYen = 0;
  const khung = (bay: number) => {
    raf = requestAnimationFrame(khung);
    if (!dangChay) return;
    if (bay - lanVe < 12) return; // màn 120 Hz: vẽ 60 là đủ
    const dt = truoc ? Math.min(0.05, Math.max(0, (bay - truoc) / 1000)) : 1 / 60;
    truoc = bay; lanVe = bay;
    troX += (muonX - troX) * Math.min(1, dt * 6);
    troY += (muonY - troY) * Math.min(1, dt * 6);
    const doi = gau.capNhat(dt, { mieng: o.docMieng(), dangNoi: o.docDangNoi(), nhinX: troX, nhinY: troY });
    // Giảm chuyển động: chỉ vẽ khi còn gì đang tiến tới đích (vài khung sau khi đổi cảm xúc).
    if (!doi) { if (conYen++ > 90) return; } else conYen = 0;
    renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(khung);

  return {
    datCamXuc: (c) => { gau.datCamXuc(c); conYen = 0; },
    datVariant: (v) => { gau.datVariant(v); conYen = 0; },
    vay: () => { gau.vay(); conYen = 0; },
    sao: () => { gau.sao(); conYen = 0; },
    chay(on) { dangChay = on; if (on) { truoc = 0; conYen = 0; } },
    huy() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointermove', onTro);
      gau.huy();
      renderer.dispose();
    },
  };
}
