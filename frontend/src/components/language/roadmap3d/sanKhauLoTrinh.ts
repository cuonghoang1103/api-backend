/**
 * 🗺️ Cảnh 3D lộ trình: con đường uốn lượn đi qua các ĐẢO BAY (mỗi chặng một đảo, cao dần lên), mỗi bài
 * là một bệ tròn trên đường; bài kiểm tra có cờ, thi thử có cổng (torii đỏ cho tiếng Nhật), đích có cúp.
 * Bài đã xong sáng vàng và đoạn đường đã đi được "thắp" vàng; bài đang học có gấu Bíp đứng.
 *
 * Máy quay trượt theo tiến độ `datTienDo(p)` (trang cuộn danh sách 2D ⇒ p đổi) và kéo ngang để xoay nhẹ.
 * Nhãn chữ KHÔNG vẽ trong WebGL (mờ, tốn texture) — cảnh chiếu toạ độ ra màn hình mỗi khung hình qua
 * `onViTri`, React đặt nhãn HTML lên trên (sắc nét, chọn được, đọc được bằng trình đọc màn hình).
 *
 * Vẽ toon, không bóng đổ thật (bóng mềm giả), cây/mây instanced ⇒ ~150 draw call cho 56 bài.
 */
import * as THREE from 'three';
import type { ChangLoTrinh, NutLoTrinh } from './loTrinhData';

/** `bx/by`: chân bệ (chỗ đặt gấu SVG overlay) — chỉ điền cho bài đang học. */
export type ViTriNhan = { n: number; x: number; y: number; sau: number; an: boolean; bx: number; by: number };
export type ViTriChang = { idx: number; x: number; y: number; an: boolean };

export interface SanKhauLoTrinh {
  /** 0…1 dọc lộ trình — máy quay trượt tới. */
  datTienDo(p: number): void;
  /** Cập nhật trạng thái bài (xong / hiện tại) mà không dựng lại cảnh. */
  capNhatNut(nut: NutLoTrinh[]): void;
  datTheme(toi: boolean): void;
  chay(on: boolean): void;
  huy(): void;
}

const BUOC = 2.3;        // khoảng cách giữa hai bài dọc đường
const CAO_CHANG = 1.35;  // mỗi chặng cao hơn chặng trước
const RONG_SONG = 3.0;   // biên độ uốn

/* toon dùng chung */
let gradient: THREE.DataTexture | null = null;
function grad() {
  if (gradient) return gradient;
  gradient = new THREE.DataTexture(new Uint8Array([120, 190, 255]), 3, 1, THREE.RedFormat);
  gradient.minFilter = gradient.magFilter = THREE.NearestFilter;
  gradient.needsUpdate = true;
  return gradient;
}
const toon = (color: THREE.ColorRepresentation, o: Partial<THREE.MeshToonMaterialParameters> = {}) => new THREE.MeshToonMaterial({ color, gradientMap: grad(), ...o });

/** Ngẫu nhiên lặp lại được (cây mọc cùng chỗ mỗi lần mở trang). */
function rnd(seed: number) {
  let s = seed >>> 0 || 1;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

export function taoSanKhauLoTrinh(canvas: HTMLCanvasElement, o: {
  code: string;
  chang: ChangLoTrinh[];
  nut: NutLoTrinh[];
  toi: boolean;
  giamChuyenDong: boolean;
  onViTri: (nhan: ViTriNhan[], chang: ViTriChang[]) => void;
  onChon: (n: number) => void;
  onTro?: (n: number | null) => void;
}): SanKhauLoTrinh {
  const dpr0 = Math.min(2, window.devicePixelRatio || 1);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: dpr0 < 1.5, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(dpr0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 120);

  const key = new THREE.DirectionalLight('#ffffff', 2.2); key.position.set(-6, 10, 8);
  const rim = new THREE.DirectionalLight('#a5b4fc', 0.8); rim.position.set(6, 4, -8);
  const troi = new THREE.HemisphereLight('#ffffff', '#94a3b8', 1.0);
  scene.add(key, rim, troi);

  /* ── Vị trí bài dọc đường ── */
  let nut = o.nut;
  const N = nut.length;
  const viTri: THREE.Vector3[] = [];
  const caoChang = (ci: number) => ci * CAO_CHANG;
  for (let i = 0; i < N; i++) {
    const x = Math.sin(i * 0.62) * RONG_SONG + Math.sin(i * 0.21) * 0.8;
    const z = -i * BUOC;
    // Độ cao: theo chặng, chuyển mượt trong 2 bài đầu chặng mới.
    const ci = nut[i].chang;
    let y = caoChang(ci);
    if (i > 0 && nut[i - 1].chang !== ci) y = caoChang(ci) - CAO_CHANG * 0.45;
    viTri.push(new THREE.Vector3(x, y, z));
  }
  const duong = new THREE.CatmullRomCurve3(viTri, false, 'centripetal', 0.6);

  /* ── Đảo bay cho từng chặng ── */
  const daoNhom = new THREE.Group(); scene.add(daoNhom);
  const tamChang: THREE.Vector3[] = [];
  const gDao = new THREE.CylinderGeometry(1, 1, 0.5, 40);
  const gDay = new THREE.ConeGeometry(1, 1.6, 40);
  const gDat = new THREE.CylinderGeometry(1, 0.96, 0.55, 40);
  for (const c of o.chang) {
    const idx = c.nut.map((x) => nut.indexOf(x)).filter((i) => i >= 0);
    if (!idx.length) continue;
    const z0 = viTri[idx[0]].z, z1 = viTri[idx[idx.length - 1]].z;
    const zc = (z0 + z1) / 2, dai = (z0 - z1) / 2 + 2.6;
    const y = caoChang(c.idx) - 0.45;
    const tam = new THREE.Vector3(0.2, y, zc);
    tamChang.push(new THREE.Vector3(viTri[idx[0]].x, caoChang(c.idx), z0 + 1.4));
    const co = toon(new THREE.Color(c.mau).lerp(new THREE.Color('#a8dc8e'), 0.68));
    const mat = new THREE.Mesh(gDao, co); mat.position.copy(tam); mat.scale.set(RONG_SONG + 2.4, 1, dai);
    const dat = new THREE.Mesh(gDat, toon('#8a6a4f')); dat.position.set(tam.x, y - 0.5, zc); dat.scale.set(RONG_SONG + 2.3, 1, dai - 0.05);
    const day = new THREE.Mesh(gDay, toon('#6b4f3a')); day.rotation.x = Math.PI; day.position.set(tam.x, y - 1.55, zc); day.scale.set(RONG_SONG + 1.9, 1, dai - 0.3);
    daoNhom.add(mat, dat, day);
  }

  /* ── Con đường (ống) + đoạn đã đi (vàng) ── */
  const gDuong = new THREE.TubeGeometry(duong, Math.max(64, N * 6), 0.26, 10, false);
  const duongMesh = new THREE.Mesh(gDuong, toon('#e9dcc3'));
  duongMesh.position.y = 0.02;
  scene.add(duongMesh);
  let daDi: THREE.Mesh | null = null;
  const dungDaDi = () => {
    if (daDi) { scene.remove(daDi); daDi.geometry.dispose(); daDi = null; }
    const cuoi = nut.findIndex((x) => x.hienTai);
    const toi = cuoi < 0 ? N - 1 : cuoi;
    if (toi < 1) return;
    const pts: THREE.Vector3[] = [];
    const t1 = toi / (N - 1);
    const so = Math.max(8, toi * 6);
    for (let i = 0; i <= so; i++) pts.push(duong.getPointAt((i / so) * t1));
    const c = new THREE.CatmullRomCurve3(pts);
    daDi = new THREE.Mesh(new THREE.TubeGeometry(c, so, 0.29, 10, false), toon('#fbbf24', { emissive: '#f59e0b', emissiveIntensity: 0.35 }));
    daDi.position.y = 0.03;
    scene.add(daDi);
  };

  /* ── Bệ từng bài ── */
  const gBe = new THREE.CylinderGeometry(0.64, 0.7, 0.26, 28);
  const gBeLon = new THREE.CylinderGeometry(0.9, 0.98, 0.3, 32);
  const gVong = new THREE.TorusGeometry(0.84, 0.05, 8, 40);
  const mXong = toon('#fbbf24', { emissive: '#d97706', emissiveIntensity: 0.25 });
  const mChua = toon('#b8c0cc');
  const mChuaSan = toon('#d5dae2', { transparent: true, opacity: 0.6 });
  const beDs: THREE.Mesh[] = [];
  const mocDs: THREE.Group[] = [];
  const vongHienTai = new THREE.Mesh(gVong, new THREE.MeshBasicMaterial({ color: '#a78bfa', transparent: true, opacity: 0.9 }));
  vongHienTai.rotation.x = Math.PI / 2; scene.add(vongHienTai);
  const mauChang = (i: number) => o.chang[nut[i].chang]?.mau ?? '#8b5cf6';

  for (let i = 0; i < N; i++) {
    const x = nut[i];
    const lon = x.loai !== 'bai';
    const be = new THREE.Mesh(lon ? gBeLon : gBe, mChua);
    be.position.copy(viTri[i]); be.position.y += 0.1;
    be.userData.n = x.n;
    scene.add(be); beDs.push(be);

    // Cột mốc.
    const moc = new THREE.Group(); moc.position.copy(viTri[i]); moc.position.y += 0.25; scene.add(moc); mocDs.push(moc);
    if (x.loai === 'kiemtra') {
      const cot = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.7, 8), toon('#f8fafc')); cot.position.set(0.35, 0.85, -0.3); moc.add(cot);
      const co = new THREE.Shape(); co.moveTo(0, 0); co.lineTo(0.9, -0.28); co.lineTo(0, -0.56); co.closePath();
      const laCo = new THREE.Mesh(new THREE.ShapeGeometry(co), new THREE.MeshToonMaterial({ color: mauChang(i), gradientMap: grad(), side: THREE.DoubleSide }));
      laCo.position.set(0.37, 1.7, -0.3); moc.add(laCo);
    } else if (x.loai === 'thithu') {
      const cuoiCung = i === N - 1 || nut.slice(i + 1).every((y) => y.loai === 'khotu');
      if (o.code === 'ja') {
        // Torii đỏ.
        const do_ = toon('#dc2626');
        for (const s of [-1, 1]) { const cot = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 2.0, 10), do_); cot.position.set(s * 0.72, 1.0, -0.2); moc.add(cot); }
        const xa1 = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.16, 0.22), toon('#1f2937')); xa1.position.set(0, 2.05, -0.2); moc.add(xa1);
        const xa2 = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.12, 0.18), do_); xa2.position.set(0, 1.72, -0.2); moc.add(xa2);
      } else {
        // Cổng vòm.
        const mauC = toon(mauChang(i));
        for (const s of [-1, 1]) { const cot = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 1.8, 10), mauC); cot.position.set(s * 0.7, 0.9, -0.2); moc.add(cot); }
        const vom = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.1, 8, 24, Math.PI), mauC); vom.position.set(0, 1.8, -0.2); moc.add(vom);
      }
      if (cuoiCung) {
        // Cúp vàng trên đích.
        const vang = toon('#f5c518', { emissive: '#b45309', emissiveIntensity: 0.2 });
        const chan = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.36, 0.12, 16), vang); chan.position.set(0, 0.2, 0.35);
        const than = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.1, 0.35, 10), vang); than.position.set(0, 0.42, 0.35);
        const coc = new THREE.Mesh(new THREE.SphereGeometry(0.34, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.6), vang); coc.rotation.x = Math.PI; coc.position.set(0, 0.86, 0.35);
        moc.add(chan, than, coc);
      }
    } else if (x.loai === 'khotu') {
      // Chồng sách.
      const mauS = ['#60a5fa', '#f472b6', '#34d399'];
      for (let k = 0; k < 3; k++) { const s = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.14, 0.5), toon(mauS[k])); s.position.set(0, 0.07 + k * 0.15, 0); s.rotation.y = (k - 1) * 0.25; moc.add(s); }
    }
  }

  /* ── Cây + bụi (instanced) ── */
  const r = rnd(7 + o.code.charCodeAt(0));
  const soCay = Math.min(90, N * 2);
  const gLa = new THREE.ConeGeometry(0.42, 1.0, 8);
  const gThan = new THREE.CylinderGeometry(0.08, 0.1, 0.4, 6);
  const la = new THREE.InstancedMesh(gLa, toon('#4ade80'), soCay);
  const than = new THREE.InstancedMesh(gThan, toon('#92643f'), soCay);
  const mau = new THREE.Color();
  const dm = new THREE.Object3D();
  for (let k = 0; k < soCay; k++) {
    const i = Math.floor(r() * N);
    const ben = r() < 0.5 ? -1 : 1;
    const tp = Math.min(1, Math.max(0, (i + r() - 0.5) / (N - 1)));
    const p = duong.getPointAt(tp);
    const huong = duong.getTangentAt(tp);
    // vuông góc với đường trên mặt phẳng ngang
    p.x += ben * (1.9 + r() * 1.7) * -huong.z;
    p.z += ben * (1.9 + r() * 1.7) * huong.x;
    const c = r() * 0.5 + 0.7;
    dm.position.set(p.x, p.y + 0.2 + 0.5 * c, p.z); dm.scale.setScalar(c); dm.rotation.y = r() * 6; dm.updateMatrix();
    la.setMatrixAt(k, dm.matrix);
    mau.set(mauChang(i)).lerp(new THREE.Color('#22c55e'), 0.75); la.setColorAt(k, mau);
    dm.position.y = p.y + 0.0; dm.scale.set(c, c, c); dm.updateMatrix(); than.setMatrixAt(k, dm.matrix);
  }
  la.instanceMatrix.needsUpdate = true; than.instanceMatrix.needsUpdate = true;
  if (la.instanceColor) la.instanceColor.needsUpdate = true;
  scene.add(la, than);

  /* ── Mây ── */
  const soMay = 6;
  const gMay = new THREE.SphereGeometry(1, 14, 10);
  const may = new THREE.InstancedMesh(gMay, new THREE.MeshToonMaterial({ color: '#ffffff', gradientMap: grad(), transparent: true, opacity: 0.92 }), soMay * 3);
  const mayGoc: { x: number; y: number; z: number; s: number; toc: number }[] = [];
  for (let k = 0; k < soMay; k++) {
    const i = Math.floor((k / soMay) * N);
    const p = viTri[i];
    const ben = k % 2 === 0 ? -1 : 1;
    const goc = { x: p.x + ben * (7.5 + r() * 5), y: p.y + 0.8 + r() * 2.4, z: p.z - 3 + (r() - 0.5) * 6, s: 0.7 + r() * 0.6, toc: 0.12 + r() * 0.15 };
    mayGoc.push(goc);
  }
  const veMay = (t: number) => {
    for (let k = 0; k < soMay; k++) {
      const g = mayGoc[k];
      const x = g.x + Math.sin(t * g.toc + k) * 1.2;
      for (let j = 0; j < 3; j++) {
        dm.position.set(x + (j - 1) * g.s * 0.95, g.y + (j === 1 ? g.s * 0.35 : 0), g.z + (j - 1) * 0.1);
        dm.scale.set(g.s * (j === 1 ? 1.25 : 0.9), g.s * (j === 1 ? 0.95 : 0.72), g.s * 0.9);
        dm.rotation.set(0, 0, 0);
        dm.updateMatrix();
        may.setMatrixAt(k * 3 + j, dm.matrix);
      }
    }
    may.instanceMatrix.needsUpdate = true;
  };
  veMay(0);
  scene.add(may);

  /* ── Vòng nhịp ở bài đang học (gấu Bíp là SVG overlay do React đặt theo `bx/by`) ── */
  const datGau = () => {
    const i = Math.max(0, nut.findIndex((x) => x.hienTai));
    vongHienTai.position.copy(viTri[i]); vongHienTai.position.y += 0.26;
  };

  const capNhatNut = (moi: NutLoTrinh[]) => {
    nut = moi;
    for (let i = 0; i < N && i < nut.length; i++) {
      const x = nut[i];
      beDs[i].material = x.xong ? mXong : x.hienTai ? toon(mauChang(i), { emissive: mauChang(i), emissiveIntensity: 0.3 }) : x.sanSang ? mChua : mChuaSan;
      mocDs[i].visible = true;
    }
    dungDaDi();
    datGau();
  };
  capNhatNut(nut);

  /* ── Máy quay ── */
  let tienDo = 0, tienDoMuon = 0;
  let goc = 0, gocMuon = 0; // xoay ngang khi kéo
  const nhinDiem = new THREE.Vector3(), camMuon = new THREE.Vector3(), tmp = new THREE.Vector3();
  const datCamera = (tucThi = false) => {
    const t = THREE.MathUtils.clamp(tienDo, 0, 1);
    const p = duong.getPointAt(t);
    const truoc = duong.getPointAt(Math.min(1, t + 0.04));
    nhinDiem.set(p.x * 0.6 + truoc.x * 0.4, p.y + 0.7, p.z - 1.4);
    const kc = camera.aspect < 1 ? 12.5 : 9.8;
    camMuon.set(nhinDiem.x + Math.sin(goc) * kc * 0.6 + 1.8, nhinDiem.y + 4.6, nhinDiem.z + Math.cos(goc) * kc);
    if (tucThi) camera.position.copy(camMuon);
    else camera.position.lerp(camMuon, 0.08);
    camera.lookAt(nhinDiem);
  };

  /* ── Con trỏ: kéo để xoay, chạm để chọn ── */
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let keo = false, keoX = 0, keoDi = 0, gocLucKeo = 0;
  let troCu: number | null = null;
  const toaDo = (e: PointerEvent) => {
    const rc = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - rc.left) / rc.width) * 2 - 1, -((e.clientY - rc.top) / rc.height) * 2 + 1);
  };
  const doTro = (e: PointerEvent): number | null => {
    toaDo(e);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(beDs, false)[0];
    return hit ? (hit.object.userData.n as number) : null;
  };
  const onDown = (e: PointerEvent) => { keo = true; keoX = e.clientX; keoDi = 0; gocLucKeo = gocMuon; canvas.setPointerCapture(e.pointerId); };
  const onMove = (e: PointerEvent) => {
    if (keo) {
      keoDi += Math.abs(e.clientX - keoX);
      gocMuon = THREE.MathUtils.clamp(gocLucKeo + (e.clientX - keoX) * 0.004, -0.75, 0.75);
      return;
    }
    const n = doTro(e);
    if (n !== troCu) { troCu = n; canvas.style.cursor = n ? 'pointer' : 'grab'; o.onTro?.(n); }
  };
  const onUp = (e: PointerEvent) => {
    if (!keo) return;
    keo = false;
    try { canvas.releasePointerCapture(e.pointerId); } catch { /* đã nhả */ }
    if (keoDi < 6) { const n = doTro(e); if (n) o.onChon(n); }
  };
  canvas.style.cursor = 'grab';
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onUp);

  /* ── Kích thước ── */
  let wCu = 0, hCu = 0;
  const doKhung = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h || (w === wCu && h === hCu)) return;
    wCu = w; hCu = h;
    const dpr = Math.max(1, Math.min(dpr0, Math.sqrt(3_600_000 / (w * h)) || dpr0));
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    datCamera(true);
    renderer.render(scene, camera);
  };
  const ro = new ResizeObserver(doKhung);
  ro.observe(canvas);
  doKhung();

  /* ── Chiếu nhãn ── */
  const nhanRa: ViTriNhan[] = nut.map((x) => ({ n: x.n, x: 0, y: 0, sau: 0, an: true, bx: 0, by: 0 }));
  const changRa: ViTriChang[] = tamChang.map((_, i) => ({ idx: i, x: 0, y: 0, an: true }));
  const chieu = () => {
    const w = wCu, h = hCu;
    const iTam = tienDo * (N - 1);
    for (let i = 0; i < N; i++) {
      const r = nhanRa[i];
      if (Math.abs(i - iTam) > 5.5) { r.an = true; continue; }
      tmp.copy(viTri[i]); tmp.y += nut[i].hienTai ? 2.45 : nut[i].loai === 'bai' ? 0.55 : 2.4;
      tmp.project(camera);
      r.an = tmp.z > 1 || tmp.x < -1.1 || tmp.x > 1.1 || tmp.y < -1.1 || tmp.y > 1.1;
      r.x = (tmp.x * 0.5 + 0.5) * w; r.y = (-tmp.y * 0.5 + 0.5) * h; r.sau = tmp.z;
      if (nut[i].hienTai) {
        tmp.copy(viTri[i]); tmp.y += 0.3; tmp.project(camera);
        r.bx = (tmp.x * 0.5 + 0.5) * w; r.by = (-tmp.y * 0.5 + 0.5) * h;
      }
    }
    for (let i = 0; i < tamChang.length; i++) {
      const r = changRa[i];
      tmp.copy(tamChang[i]); tmp.y += 1.1; tmp.project(camera);
      r.an = tmp.z > 1 || Math.abs(tmp.x) > 1.05 || Math.abs(tmp.y) > 1.05;
      r.x = (tmp.x * 0.5 + 0.5) * w; r.y = (-tmp.y * 0.5 + 0.5) * h;
    }
    o.onViTri(nhanRa, changRa);
  };

  /* ── Vòng vẽ ── */
  let raf = 0, dangChay = true, truoc = 0, lanVe = 0, t = 0, yenTu = 0;
  const cham = o.giamChuyenDong ? 0 : 1;
  const khung = (bay: number) => {
    raf = requestAnimationFrame(khung);
    if (!dangChay) return;
    if (bay - lanVe < 12) return;
    const dt = truoc ? Math.min(0.05, Math.max(0, (bay - truoc) / 1000)) : 1 / 60;
    truoc = bay; lanVe = bay; t += dt;

    const dTien = tienDoMuon - tienDo, dGoc = gocMuon - goc;
    tienDo += dTien * Math.min(1, dt * 4.5);
    goc += dGoc * Math.min(1, dt * 6);
    const dangDoi = Math.abs(dTien) > 0.0005 || Math.abs(dGoc) > 0.001;
    datCamera();

    if (cham) {
      veMay(t);
      vongHienTai.scale.setScalar(1 + Math.sin(t * 3) * 0.06);
      (vongHienTai.material as THREE.MeshBasicMaterial).opacity = 0.6 + Math.sin(t * 3) * 0.3;
    }

    if (!dangDoi && !cham) { if (yenTu++ > 60) return; } else yenTu = 0;
    renderer.render(scene, camera);
    chieu();
  };
  raf = requestAnimationFrame(khung);

  return {
    datTienDo(p) { tienDoMuon = THREE.MathUtils.clamp(p, 0, 1); yenTu = 0; },
    capNhatNut(moi) { capNhatNut(moi); yenTu = 0; },
    datTheme(toi) {
      troi.groundColor.set(toi ? '#475569' : '#94a3b8');
      troi.intensity = toi ? 0.8 : 1.0;
      key.intensity = toi ? 1.9 : 2.2;
      yenTu = 0;
    },
    chay(on) { dangChay = on; if (on) { truoc = 0; yenTu = 0; } },
    huy() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
      scene.traverse((ob) => {
        if (ob instanceof THREE.Mesh) {
          ob.geometry?.dispose?.();
          const m = ob.material as THREE.Material | THREE.Material[];
          if (Array.isArray(m)) m.forEach((x) => x.dispose()); else m?.dispose?.();
        }
      });
      renderer.dispose();
    },
  };
}
