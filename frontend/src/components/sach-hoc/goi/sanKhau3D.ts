/**
 * 🤖 Sân khấu 3D của "Bông" — bạn luyện nói trong Gọi gia sư (04/10/2026).
 *
 * Dựng hoàn toàn bằng mã, không tải mô hình: mọi khối là mặt cong trơn (cầu, quả
 * trứng tiện bằng LatheGeometry, viên nang) — không có hộp bo góc nào. Một tệp
 * .glb sẽ phải đi qua CSP của app desktop (origin `app://`) và tải thêm vài trăm KB;
 * dựng tại chỗ thì nhẹ, sắc nét ở mọi kích thước, và đổi màu theo giao diện được.
 *
 * Cảm xúc nằm trên MÀN HÌNH MẶT: một canvas 2D vẽ mắt/miệng/má hồng phát sáng, dán
 * làm texture lên tấm kính cong phía trước đầu. Mắt chớp, nhìn theo con trỏ, cong
 * thành ^^ khi vui; miệng mấp máy theo tiếng gia sư; tai sáng theo âm lượng micro.
 *
 * Mọi tham số (mắt mở, cười, nghiêng đầu, tay…) tiến DẦN tới đích mỗi khung hình
 * (lerp) — đổi cảm xúc không bao giờ giật cục.
 */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export type CamXuc = 'cho' | 'chao' | 'noi' | 'nghe' | 'nghi' | 'vui' | 'kha' | 'buon' | 'loi';

export interface SanKhau {
  datCamXuc(c: CamXuc): void;
  /** Bung pháo sao (điểm cao). */
  phaoSao(): void;
  huy(): void;
}

type ThamSo = {
  mo: number; to: number; vui: number; buon: number; boi: number;
  nhinX: number; nhinY: number; mieng: number; cuoi: number; ma: number; nghi: number;
  nghieng: number; gat: number; nhay: number; tayP: number; tayT: number; vay: number; tai: number;
};

const DICH: Record<CamXuc, Partial<ThamSo>> = {
  cho: { to: 1, vui: 0, buon: 0, boi: 0, cuoi: 0.55, ma: 0.3, nghi: 0, nghieng: 0, tayP: 0, tayT: 0, vay: 0, nhay: 0 },
  chao: { to: 1, vui: 1, buon: 0, boi: 0, cuoi: 1, ma: 0.75, nghi: 0, nghieng: 0.08, tayP: 2.5, tayT: 0, vay: 1, nhay: 0 },
  noi: { to: 1, vui: 0, buon: 0, boi: 0, cuoi: 0.65, ma: 0.35, nghi: 0, nghieng: 0, tayP: 0.35, tayT: 0.2, vay: 0, nhay: 0 },
  nghe: { to: 1.16, vui: 0, buon: 0, boi: 0, cuoi: 0.3, ma: 0.3, nghi: 0, nghieng: 0.16, tayP: 0, tayT: 0.15, vay: 0, nhay: 0 },
  nghi: { to: 0.9, vui: 0, buon: 0, boi: 0, cuoi: 0.15, ma: 0.15, nghi: 1, nghieng: -0.1, tayP: 0.45, tayT: 0, vay: 0, nhay: 0 },
  vui: { to: 1, vui: 1, buon: 0, boi: 0, cuoi: 1, ma: 1, nghi: 0, nghieng: 0.06, tayP: 2.7, tayT: 2.7, vay: 0, nhay: 1 },
  kha: { to: 1, vui: 1, buon: 0, boi: 0, cuoi: 0.7, ma: 0.55, nghi: 0, nghieng: 0.1, tayP: 0.9, tayT: 0, vay: 0, nhay: 0 },
  buon: { to: 0.96, vui: 0, buon: 1, boi: 0, cuoi: 0.15, ma: 0.35, nghi: 0, nghieng: -0.12, tayP: 0.7, tayT: 0.7, vay: 0, nhay: 0 },
  loi: { to: 1, vui: 0, buon: 0, boi: 1, cuoi: 0, ma: 0.2, nghi: 0, nghieng: 0.18, tayP: 0.2, tayT: 0.2, vay: 0, nhay: 0 },
};

/* Màn hình mặt: vẽ trong hệ toạ độ 1024×512, canvas thật 768×384 (đủ nét, tải lên GPU nhẹ). */
const MW = 1024, MH = 512, TL = 0.75;

function veMat(g: CanvasRenderingContext2D, p: ThamSo, t: number) {
  g.setTransform(TL, 0, 0, TL, 0, 0);
  g.clearRect(0, 0, MW, MH);
  // Tấm kính tối hình viên thuốc, mép mờ dần — dán lên mặt cầu không lộ cạnh thẳng.
  const vx = 70, vy = 40, vw = MW - 140, vh = MH - 80;
  g.save();
  g.shadowColor = 'rgba(6, 8, 24, 0.9)';
  g.shadowBlur = 12;
  const nen = g.createLinearGradient(0, vy, 0, vy + vh);
  nen.addColorStop(0, '#1b2147');
  nen.addColorStop(1, '#0a0d22');
  g.fillStyle = nen;
  g.beginPath();
  g.roundRect(vx, vy, vw, vh, vh / 2);
  g.fill();
  g.restore();
  // Ánh kính: một dải sáng cong mờ ở góc trên trái.
  g.save();
  g.beginPath();
  g.roundRect(vx, vy, vw, vh, vh / 2);
  g.clip();
  const bong = g.createLinearGradient(vx, vy, vx + vw * 0.45, vy + vh * 0.5);
  bong.addColorStop(0, 'rgba(255, 255, 255, 0.16)');
  bong.addColorStop(1, 'rgba(255, 255, 255, 0)');
  g.fillStyle = bong;
  g.beginPath();
  g.ellipse(vx + vw * 0.3, vy + 10, vw * 0.36, vh * 0.3, -0.12, 0, Math.PI * 2);
  g.fill();
  g.restore();

  const cx = MW / 2 + p.nhinX * 34, cy = MH / 2 - 18 - p.nhinY * 26;
  const kc = 172; // nửa khoảng cách hai mắt
  const xanh = '#5eeefc';
  g.save();
  g.shadowColor = '#22d3ee';
  g.shadowBlur = 20;
  g.fillStyle = xanh;
  g.strokeStyle = xanh;
  g.lineCap = 'round';
  g.lineJoin = 'round';

  for (const s of [-1, 1]) {
    const ex = cx + s * kc;
    // 1) Mắt thường: bầu dục đứng + hai đốm sáng (kiểu mắt hoạt hình).
    const aThuong = (1 - p.vui) * (1 - p.boi);
    if (aThuong > 0.02) {
      g.globalAlpha = aThuong;
      const rw = 54 * p.to, rh = Math.max(6, 78 * p.to * p.mo);
      g.beginPath();
      g.ellipse(ex, cy, rw, rh, 0, 0, Math.PI * 2);
      g.fill();
      if (p.buon > 0.02) {
        // Mắt buồn: mí trên xệ xuống phía ngoài — cắt bằng nền tối.
        g.save();
        g.shadowBlur = 0;
        g.globalAlpha = aThuong * p.buon;
        g.fillStyle = '#141a3c';
        g.beginPath();
        g.moveTo(ex - s * 70, cy - rh - 10);
        g.lineTo(ex + s * 70, cy - rh - 10);
        g.lineTo(ex + s * 70, cy - rh * 0.05);
        g.lineTo(ex - s * 70, cy - rh * 0.75);
        g.closePath();
        g.fill();
        g.restore();
      }
      if (p.mo > 0.45 && p.buon < 0.5) {
        g.save();
        g.shadowBlur = 0;
        g.fillStyle = '#ffffff';
        g.globalAlpha = aThuong * Math.min(1, (p.mo - 0.45) * 3) * (1 - p.buon * 2);
        g.beginPath(); g.arc(ex + 17, cy - rh * 0.38, 15 * p.to, 0, Math.PI * 2); g.fill();
        g.beginPath(); g.arc(ex - 19, cy + rh * 0.3, 7.5 * p.to, 0, Math.PI * 2); g.fill();
        g.restore();
      }
    }
    // 2) Mắt cười: vòng cung ^^.
    if (p.vui > 0.02) {
      g.globalAlpha = p.vui * (1 - p.boi);
      g.lineWidth = 26;
      g.beginPath();
      g.arc(ex, cy + 30, 54, Math.PI * 1.12, Math.PI * 1.88);
      g.stroke();
    }
    // 3) Bối rối: > <
    if (p.boi > 0.02) {
      g.globalAlpha = p.boi;
      g.lineWidth = 22;
      g.beginPath();
      g.moveTo(ex - s * 38, cy - 34);
      g.lineTo(ex + s * 30, cy);
      g.lineTo(ex - s * 38, cy + 34);
      g.stroke();
    }
  }

  // Miệng: nói thì há (bầu dục, có lưỡi hồng); im thì một nét cười.
  const my = cy + 122;
  g.globalAlpha = 1;
  if (p.mieng > 0.06) {
    const w = 30 + 26 * p.mieng, h = 8 + 44 * p.mieng;
    g.beginPath();
    g.ellipse(cx, my + h * 0.3, w, h, 0, 0, Math.PI * 2);
    g.fill();
    g.save();
    g.shadowBlur = 0;
    g.fillStyle = '#ff8fb8';
    g.globalAlpha = Math.min(1, p.mieng * 1.6);
    g.beginPath();
    g.ellipse(cx, my + h * 0.3 + h * 0.48, w * 0.6, h * 0.42, 0, Math.PI, Math.PI * 2);
    g.fill();
    g.restore();
  } else {
    g.lineWidth = 15;
    const cong = (p.cuoi - p.buon * 0.8) * 34;
    g.beginPath();
    g.moveTo(cx - 40, my);
    g.quadraticCurveTo(cx, my + cong, cx + 40, my);
    g.stroke();
  }

  // Đang nghĩ: ba chấm lần lượt sáng.
  if (p.nghi > 0.02) {
    for (let i = 0; i < 3; i++) {
      const pha = (Math.sin(t * 5 - i * 0.9) + 1) / 2;
      g.globalAlpha = p.nghi * (0.25 + 0.75 * pha);
      g.beginPath();
      g.arc(cx + 110 + i * 34, my - 6 - pha * 8, 11, 0, Math.PI * 2);
      g.fill();
    }
  }
  g.restore();

  // Má hồng.
  if (p.ma > 0.02) {
    g.save();
    g.filter = 'blur(10px)';
    g.fillStyle = `rgba(255, 120, 175, ${0.6 * p.ma})`;
    for (const s of [-1, 1]) {
      g.beginPath();
      g.ellipse(cx + s * (kc + 62), cy + 82, 44, 24, 0, 0, Math.PI * 2);
      g.fill();
    }
    g.restore();
  }
}

/** Ảnh mờ tròn làm bóng đổ dưới chân — rẻ hơn hẳn bóng thật và mềm hơn. */
function texBong(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d')!;
  const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, 'rgba(20, 10, 60, 0.55)');
  r.addColorStop(1, 'rgba(20, 10, 60, 0)');
  g.fillStyle = r;
  g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

function texSao(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d')!;
  g.translate(32, 32);
  g.fillStyle = '#fff';
  g.shadowColor = '#fde68a';
  g.shadowBlur = 10;
  g.beginPath();
  for (let i = 0; i < 8; i++) {
    const r = i % 2 ? 7 : 22, a = (i * Math.PI) / 4 - Math.PI / 2;
    g.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  g.closePath();
  g.fill();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Quả trứng tiện tròn (thân). */
function hinhTrung(rong: number, cao: number): THREE.LatheGeometry {
  const pts: THREE.Vector2[] = [];
  const N = 40;
  for (let i = 0; i <= N; i++) {
    const a = -Math.PI / 2 + (i / N) * Math.PI;
    const r = rong * Math.cos(a) * (1 - 0.13 * Math.sin(a));
    pts.push(new THREE.Vector2(Math.max(0.0001, r), cao * Math.sin(a)));
  }
  return new THREE.LatheGeometry(pts, 72);
}

const tien = (a: number, b: number, k: number) => a + (b - a) * k;

export function taoSanKhau(canvas: HTMLCanvasElement, o: {
  giamChuyenDong: boolean;
  /** Mức micro 0–1, đọc mỗi khung hình. */
  docMucMic: () => number;
  /** Gia sư đang phát tiếng — miệng mấp máy. */
  docDangNoi: () => boolean;
}): SanKhau {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = envRT.texture;
  scene.environmentIntensity = 0.85;

  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50);
  // Nhìn hơi cao hơn tâm ⇒ nhân vật nằm thấp trong khung, chừa chỗ cho bong bóng lời phía trên.
  camera.position.set(0, 0.45, 9.6);
  camera.lookAt(0, 0.38, 0);

  const key = new THREE.DirectionalLight('#ffffff', 1.5);
  key.position.set(-3, 4, 5);
  const rim = new THREE.DirectionalLight('#c084fc', 2.2);
  rim.position.set(3, 2, -4);
  const rim2 = new THREE.DirectionalLight('#67e8f9', 1.2);
  rim2.position.set(-4, -1, -3);
  scene.add(key, rim, rim2, new THREE.HemisphereLight('#f5f3ff', '#4c1d95', 0.5));

  /* ── Vật liệu ── */
  const voTrang = new THREE.MeshPhysicalMaterial({
    color: '#fbf9ff', roughness: 0.34, metalness: 0,
    clearcoat: 1, clearcoatRoughness: 0.16, sheen: 0.5, sheenColor: new THREE.Color('#ddd6fe'), sheenRoughness: 0.6,
  });
  const voTim = new THREE.MeshPhysicalMaterial({ color: '#a78bfa', roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.2 });
  const phatSang = new THREE.MeshStandardMaterial({ color: '#0e7490', emissive: new THREE.Color('#5eead4'), emissiveIntensity: 1.4, roughness: 0.4 });
  const bongDen = new THREE.MeshStandardMaterial({ color: '#fde68a', emissive: new THREE.Color('#fbbf24'), emissiveIntensity: 1.6, roughness: 0.3 });
  const timHong = new THREE.MeshStandardMaterial({ color: '#f9a8d4', emissive: new THREE.Color('#f472b6'), emissiveIntensity: 1.1, roughness: 0.35 });

  const matCanvas = document.createElement('canvas');
  matCanvas.width = MW * TL;
  matCanvas.height = MH * TL;
  const matG = matCanvas.getContext('2d')!;
  const matTex = new THREE.CanvasTexture(matCanvas);
  matTex.colorSpace = THREE.SRGBColorSpace;
  matTex.anisotropy = 4;
  const kinh = new THREE.MeshPhysicalMaterial({
    map: matTex, emissiveMap: matTex, emissive: new THREE.Color('#ffffff'), emissiveIntensity: 0.7,
    transparent: true, roughness: 0.5,
    // KHÔNG phản chiếu môi trường: "căn phòng mẫu" hiện thành ô vuông trắng mờ giữa mặt.
    // Ánh kính được VẼ sẵn trên canvas (veMat) — luôn đẹp, không phụ thuộc góc nhìn.
    envMapIntensity: 0,
  });

  /* ── Hình khối ── */
  const goc = new THREE.Group(); // cả nhân vật (nhảy, lắc)
  scene.add(goc);

  const than = new THREE.Mesh(hinhTrung(0.8, 0.6), voTrang);
  than.position.y = -0.9;
  goc.add(than);
  const timNguc = new THREE.Mesh(new THREE.SphereGeometry(0.1, 32, 16), timHong);
  timNguc.scale.set(1, 1, 0.38);
  timNguc.position.set(0, -0.82, 0.76);
  goc.add(timNguc);

  const dau = new THREE.Group(); // đầu lơ lửng phía trên thân
  dau.position.y = 0.62;
  goc.add(dau);
  const soDau = new THREE.Mesh(new THREE.SphereGeometry(1, 72, 56), voTrang);
  soDau.scale.set(1.1, 0.93, 0.98);
  dau.add(soDau);
  // Tấm kính mặt: mảnh cầu phía trước, cùng tỉ lệ với sọ (con của sọ) nên ôm khít.
  const wPhi = 1.95, hTheta = 1.2;
  const matKinh = new THREE.Mesh(
    new THREE.SphereGeometry(1.012, 72, 40, Math.PI / 2 - wPhi / 2, wPhi, Math.PI / 2 - hTheta / 2 + 0.06, hTheta),
    kinh,
  );
  soDau.add(matKinh);

  // Tai: hai "nút tai nghe" tròn + vòng sáng nghe micro.
  const tai: THREE.Mesh[] = [];
  for (const s of [-1, 1]) {
    const nut = new THREE.Mesh(new THREE.SphereGeometry(0.3, 40, 24), voTim);
    nut.scale.set(0.55, 1, 1);
    nut.position.set(s * 1.1, 0, 0);
    dau.add(nut);
    const vong = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.035, 16, 48), phatSang);
    vong.rotation.y = Math.PI / 2;
    vong.position.set(s * 1.27, 0, 0);
    dau.add(vong);
    tai.push(vong);
  }

  // Ăng-ten: cuống cong + bóng đèn đổi màu theo cảm xúc.
  const angTen = new THREE.Group();
  angTen.position.set(0.18, 0.86, 0);
  dau.add(angTen);
  const cuong = new THREE.Mesh(
    new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.02, 0.2, 0), new THREE.Vector3(0.14, 0.34, 0)), 16, 0.028, 10),
    voTim,
  );
  angTen.add(cuong);
  const den = new THREE.Mesh(new THREE.SphereGeometry(0.1, 32, 16), bongDen);
  den.position.set(0.14, 0.36, 0);
  angTen.add(den);

  // Tay: viên nang tròn lơ lửng hai bên, xoay quanh "vai".
  const vai: THREE.Group[] = [];
  for (const s of [-1, 1]) {
    const v = new THREE.Group();
    v.position.set(s * 0.88, -0.6, 0.05);
    const tay = new THREE.Mesh(new THREE.CapsuleGeometry(0.14, 0.3, 10, 24), voTrang);
    tay.position.y = -0.24;
    v.add(tay);
    goc.add(v);
    vai.push(v);
  }

  const bong = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 2.6), new THREE.MeshBasicMaterial({ map: texBong(), transparent: true, depthWrite: false }));
  bong.rotation.x = -Math.PI / 2;
  bong.position.y = -1.62;
  scene.add(bong);

  // Pháo sao (điểm cao): bể sprite dùng lại.
  const saoTex = texSao();
  const sao = Array.from({ length: 18 }, () => {
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: saoTex, transparent: true, depthWrite: false }));
    sp.visible = false;
    scene.add(sp);
    return { sp, v: new THREE.Vector3(), song: 0 };
  });

  /* ── Trạng thái ── */
  let camXuc: CamXuc = 'cho';
  const p: ThamSo = { mo: 1, to: 1, vui: 0, buon: 0, boi: 0, nhinX: 0, nhinY: 0, mieng: 0, cuoi: 0.55, ma: 0.3, nghi: 0, nghieng: 0, gat: 0, nhay: 0, tayP: 0, tayT: 0, vay: 0, tai: 0 };
  let chopLuc = 1.5, chopCon = 0;
  let nhinDichX = 0, nhinDichY = 0, doiNhinLuc = 2;
  let troX = 0, troY = 0, coTro = false;
  const mauDen: Record<CamXuc, string> = { cho: '#fbbf24', chao: '#f472b6', noi: '#fbbf24', nghe: '#f43f5e', nghi: '#60a5fa', vui: '#4ade80', kha: '#a3e635', buon: '#93c5fd', loi: '#fb923c' };
  const denDich = new THREE.Color(mauDen.cho);
  let angTenV = 0, angTenGoc = 0; // lò xo ăng-ten

  const onTro = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    if (!r.width) return;
    troX = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2));
    troY = Math.max(-1, Math.min(1, -((e.clientY - r.top) / r.height - 0.45) * 2));
    coTro = true;
  };
  window.addEventListener('pointermove', onTro, { passive: true });

  const doKhung = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Khung hẹp mà cao (điện thoại): lùi máy quay để nhân vật không tràn hai bên.
    camera.position.z = camera.aspect < 0.8 ? 9.6 / Math.max(0.55, camera.aspect / 0.8) : 9.6;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(doKhung);
  ro.observe(canvas);
  doKhung();

  const dongHo = new THREE.Clock();
  let t = 0, raf = 0, dangChay = true;
  const cham = o.giamChuyenDong ? 0.4 : 1;

  const khung = () => {
    raf = requestAnimationFrame(khung);
    if (!dangChay) return;
    const dt = Math.min(0.05, dongHo.getDelta());
    t += dt;
    const k = 1 - Math.pow(0.0025, dt); // mượt, không phụ thuộc tốc độ khung
    const d = DICH[camXuc];
    for (const key of Object.keys(d) as (keyof ThamSo)[]) p[key] = tien(p[key], d[key] as number, k);

    // Chớp mắt ngẫu nhiên (thỉnh thoảng chớp đôi).
    chopLuc -= dt;
    if (chopLuc <= 0) { chopCon = 0.16; chopLuc = 2 + Math.random() * 3.5; if (Math.random() < 0.2) chopLuc = 0.28; }
    if (chopCon > 0) chopCon -= dt;
    const moDich = chopCon > 0 ? 0.08 : camXuc === 'nghi' ? 0.82 : 1;
    p.mo = tien(p.mo, moDich, chopCon > 0 ? 0.6 : 0.25);

    // Ánh mắt: theo con trỏ nếu có, không thì liếc ngẫu nhiên; đang nghĩ thì nhìn lên.
    doiNhinLuc -= dt;
    if (doiNhinLuc <= 0) { nhinDichX = (Math.random() - 0.5) * 0.9; nhinDichY = (Math.random() - 0.5) * 0.5; doiNhinLuc = 1.5 + Math.random() * 2.5; }
    let nx = coTro ? troX * 0.8 : nhinDichX, ny = coTro ? troY * 0.6 : nhinDichY;
    if (camXuc === 'nghi') { nx = 0.75; ny = 0.8; }
    if (camXuc === 'nghe') { nx *= 0.4; ny = ny * 0.4 + 0.1; }
    p.nhinX = tien(p.nhinX, nx, k * 0.6);
    p.nhinY = tien(p.nhinY, ny, k * 0.6);

    // Miệng: mấp máy theo nhịp âm tiết khi có tiếng gia sư.
    const noi = o.docDangNoi();
    const mieng = noi ? 0.18 + 0.7 * Math.abs(Math.sin(t * 10.5) * Math.sin(t * 3.7 + 1.3)) : camXuc === 'nghe' ? 0.1 : 0;
    p.mieng = tien(p.mieng, mieng, noi ? 0.45 : 0.2);

    // Micro: tai sáng + ăng-ten nhún theo giọng người học.
    const mic = camXuc === 'nghe' ? o.docMucMic() : 0;
    p.tai = tien(p.tai, mic, 0.35);
    const sangTai = 0.6 + (camXuc === 'nghe' ? 1.2 + p.tai * 5 : 0.25 * Math.sin(t * 2) + 0.25);
    phatSang.emissiveIntensity = sangTai;
    for (const v of tai) v.scale.setScalar(1 + p.tai * 0.35);

    veMat(matG, p, t);
    matTex.needsUpdate = true;

    // Thân: lơ lửng, thở; nhảy cẫng khi vui.
    const nhip = Math.sin(t * 1.8 * cham);
    const nhayCao = p.nhay * Math.max(0, Math.sin(t * 7 * cham)) * 0.32 * cham;
    goc.position.y = nhip * 0.06 * cham + nhayCao;
    than.scale.set(1 + nhip * 0.012, 1 - nhip * 0.012, 1 + nhip * 0.012);
    const sb = 1 - (goc.position.y + 0.1) * 0.35;
    bong.scale.setScalar(Math.max(0.6, sb));
    (bong.material as THREE.MeshBasicMaterial).opacity = Math.max(0.35, sb);

    // Đầu: nghiêng theo cảm xúc, nhìn theo ánh mắt, gật khi nói / khi khá.
    const gat = noi ? Math.sin(t * 4.2) * 0.035 : camXuc === 'kha' ? Math.max(0, Math.sin(t * 6)) * 0.12 : 0;
    dau.rotation.z = tien(dau.rotation.z, p.nghieng + Math.sin(t * 0.9) * 0.03 * cham, k);
    dau.rotation.y = tien(dau.rotation.y, p.nhinX * 0.32, k * 0.5);
    dau.rotation.x = tien(dau.rotation.x, -p.nhinY * 0.16 + gat, k * 0.6);
    dau.position.y = 0.62 + Math.sin(t * 1.8 * cham + 0.6) * 0.035;
    goc.rotation.y = tien(goc.rotation.y, p.nhinX * 0.12, k * 0.3);

    // Ăng-ten: lò xo — cái đầu xoay thì nó lắc theo rồi tự đứng lại.
    const luc = -angTenGoc * 60 - angTenV * 6 + (dau.rotation.z - p.nghieng) * -40 + nhayCao * 20;
    angTenV += luc * dt;
    angTenGoc += angTenV * dt;
    angTen.rotation.z = angTenGoc * 0.5 - 0.1;
    denDich.set(mauDen[camXuc]);
    bongDen.emissive.lerp(denDich, k);
    bongDen.emissiveIntensity = camXuc === 'nghi' ? 1 + Math.max(0, Math.sin(t * 8)) * 1.6 : camXuc === 'nghe' ? 1.4 + p.tai * 3 : 1.6;

    // Tay: phải vẫy chào / giơ lên, trái giơ khi vui.
    const vay = p.vay * Math.sin(t * 11) * 0.35;
    const lacNoi = noi ? Math.sin(t * 3.1) * 0.12 : 0;
    vai[1].rotation.z = tien(vai[1].rotation.z, p.tayP + vay + 0.12 + lacNoi + nhip * 0.04, k);
    vai[0].rotation.z = tien(vai[0].rotation.z, -(p.tayT + 0.12 - lacNoi * 0.6 + nhip * 0.04), k);
    vai[1].rotation.x = tien(vai[1].rotation.x, camXuc === 'nghi' ? -0.6 : 0, k);

    // Pháo sao.
    for (const s of sao) {
      if (!s.sp.visible) continue;
      s.song -= dt;
      if (s.song <= 0) { s.sp.visible = false; continue; }
      s.v.y -= 2.2 * dt;
      s.sp.position.addScaledVector(s.v, dt);
      s.sp.material.opacity = Math.min(1, s.song * 2);
      s.sp.material.rotation += dt * 3;
    }

    renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(khung);

  const onAn = () => { dangChay = !document.hidden; if (dangChay) dongHo.getDelta(); };
  document.addEventListener('visibilitychange', onAn);

  const phaoSao = () => {
      if (o.giamChuyenDong) return;
      for (const s of sao) {
        s.sp.visible = true;
        s.sp.position.set((Math.random() - 0.5) * 0.6, 1.1 + Math.random() * 0.3, 0.6);
        const a = Math.random() * Math.PI * 2;
        const v = 1.6 + Math.random() * 1.8;
        s.v.set(Math.cos(a) * v, 1.5 + Math.random() * 2.2, Math.sin(a) * 0.4);
        s.song = 0.9 + Math.random() * 0.7;
        const c = 0.16 + Math.random() * 0.16;
        s.sp.scale.set(c, c, c);
        s.sp.material.color.set(['#fde68a', '#f9a8d4', '#a5f3fc', '#c4b5fd'][Math.floor(Math.random() * 4)]);
      }
  };

  const api: SanKhau = {
    datCamXuc(c) {
      if (c === camXuc) return;
      camXuc = c;
      if (c === 'vui') phaoSao();
    },
    phaoSao,
    huy() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointermove', onTro);
      document.removeEventListener('visibilitychange', onAn);
      scene.traverse((x) => {
        const m = x as THREE.Mesh;
        m.geometry?.dispose();
        const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
        for (const mt of mats) {
          for (const v of Object.values(mt)) if (v instanceof THREE.Texture) v.dispose();
          mt.dispose();
        }
      });
      envRT.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
  return api;
}
