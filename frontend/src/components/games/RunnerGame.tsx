'use client';

/**
 * CuongMini chạy — game HÀNH ĐỘNG 3D (three.js, tải lười) — nâng cấp 05/10/2026.
 *
 * Robot CuongMini (thân trứng, đầu tròn, mặt kính phát sáng) chạy trên đường ba làn giữa
 * trời. Cảnh có NHIỀU LỚP chiều sâu cuộn theo tốc độ: cột đèn sát đường → hàng cây → đồi
 * giữa → mây → núi xa ⇒ parallax tự nhiên của phối cảnh. Mỗi CẤP đổi bầu trời (hoàng hôn,
 * đêm cực quang, bình minh đào, đại dương, rừng ngọc — chuyển màu mượt) và mở chướng ngại mới:
 *   cấp 1 đá pha lê (né) · 2 rào thấp (nhảy) · 3 cổng thấp (trượt ↓) · 4 bóng lăn đổi làn ·
 *   5 cột cao (chỉ né được) · 6+ dày hơn, nhanh hơn — vô tận.
 * Vật phẩm (từ cấp 2): khiên (đỡ một cú), nam châm (hút sao 7 s), tim (+1 mạng, tối đa 3).
 * Sao liên tiếp không bỏ sót = chuỗi; hệ số ×1…×5 (mỗi 8 sao lên một bậc).
 * Va chạm mềm: chướng ngại bị hất văng, chậm thời gian 0,4 s, rung máy quay, nháy bất tử.
 *
 * Điểm = mét chạy + Σ(10 × hệ số) mỗi sao + 100 mỗi lần lên cấp. Báo một lần khi hết mạng.
 * Điều khiển: ←/→ A/D đổi làn · ↑/W/Space nhảy · ↓/S trượt (trên không: đáp nhanh) · vuốt.
 *
 * Mọi vật thể dùng lại từ bể (pool) — không tạo/huỷ mesh trong vòng lặp khung hình.
 */
import { useEffect, useRef, useState } from 'react';
import { Heart, Star, Gauge, Shield, Magnet, Flag } from 'lucide-react';
import type * as T3 from 'three';
import type { GameProps } from './registry';
import { sfx } from './shared/amThanh';
import { phaoGiay, diemBay, rung } from './shared/hieuUng';
import s from './runner.module.css';

type Hud = { diem: number; m: number; sao: number; mang: number; tocDo: number; cap: number; tienDo: number; heSo: number; chuoi: number; khien: boolean; nam: number };
type Bang = { cap: number; chu: string; id: number } | null;

const doDaiCap = (n: number) => 250 + n * 60;
const MOC: number[] = [0, 0];
for (let n = 1; n < 200; n++) MOC[n + 1] = MOC[n]! + doDaiCap(n);
const tocDoCap = (n: number) => Math.min(34, 12 + (n - 1) * 1.9);

const CHU_CAP: Record<number, [string, string]> = {
  1: ['Né đá pha lê · ăn sao', 'Dodge crystals · grab stars'],
  2: ['Rào thấp — nhảy qua ↑ · có vật phẩm', 'Low bars — jump ↑ · power-ups'],
  3: ['Cổng thấp — trượt dưới ↓', 'Low gates — slide ↓'],
  4: ['Bóng lăn đổi làn — né hoặc nhảy', 'Rolling balls switch lanes'],
  5: ['Cột cao — chỉ né được', 'Tall pillars — dodge only'],
};

type Theme = { troi: [string, string, string]; suong: string; duong: string; mep: string; nui: [string, string]; la: string; mt: string };
const THEMES: Theme[] = [
  { troi: ['#1e1b4b', '#f472b6', '#fdba74'], suong: '#c084fc', duong: '#312e81', mep: '#f0abfc', nui: ['#6d28d9', '#8b5cf6'], la: '#a855f7', mt: '#fde68a' },
  { troi: ['#020617', '#0f766e', '#134e4a'], suong: '#115e59', duong: '#1e293b', mep: '#5eead4', nui: ['#0f3d3a', '#155e75'], la: '#14b8a6', mt: '#e0f2fe' },
  { troi: ['#3b82f6', '#fecdd3', '#fde68a'], suong: '#f9a8d4', duong: '#7c2d6b', mep: '#fde68a', nui: ['#be185d', '#f472b6'], la: '#fb7185', mt: '#fff7ed' },
  { troi: ['#0c4a6e', '#38bdf8', '#a5f3fc'], suong: '#7dd3fc', duong: '#1e3a8a', mep: '#a5f3fc', nui: ['#0369a1', '#0ea5e9'], la: '#22d3ee', mt: '#fef9c3' },
  { troi: ['#052e16', '#22c55e', '#bbf7d0'], suong: '#4ade80', duong: '#14532d', mep: '#bef264', nui: ['#166534', '#15803d'], la: '#4ade80', mt: '#fef08a' },
];

/** Đo khung GameShell để game co giãn (kể cả toàn màn hình). */
function useRongKhung(ref: React.RefObject<HTMLDivElement | null>, tiLe: number, phu: number) {
  const [rong, setRong] = useState<number | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const vung = el.parentElement?.parentElement ?? el.parentElement;
    const tinh = () => {
      const w = Math.max(280, (vung?.clientWidth ?? window.innerWidth) - 4);
      const caoMax = document.fullscreenElement ? window.innerHeight - 90 : Math.min(window.innerHeight - 120, 820);
      setRong(Math.floor(Math.max(280, Math.min(w, (caoMax - phu) * tiLe))));
    };
    tinh();
    const ro = new ResizeObserver(tinh);
    if (vung) ro.observe(vung);
    window.addEventListener('resize', tinh);
    document.addEventListener('fullscreenchange', tinh);
    return () => { ro.disconnect(); window.removeEventListener('resize', tinh); document.removeEventListener('fullscreenchange', tinh); };
  }, [ref, tiLe, phu]);
  return rong;
}

export default function RunnerGame({ onScore, locale = 'vi', paused = false }: Partial<GameProps>) {
  const vi = locale !== 'en';
  const gocRef = useRef<HTMLDivElement>(null);
  const khungRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hud, setHud] = useState<Hud>({ diem: 0, m: 0, sao: 0, mang: 3, tocDo: 0, cap: 1, tienDo: 0, heSo: 1, chuoi: 0, khien: false, nam: 0 });
  const [loi, setLoi] = useState(false);
  const [ketThuc, setKetThuc] = useState<number | null>(null);
  const [bang, setBang] = useState<Bang>({ cap: 1, chu: (CHU_CAP[1]!)[vi ? 0 : 1], id: 0 });
  const [dau, setDau] = useState(0);
  const onScoreRef = useRef(onScore);
  onScoreRef.current = onScore;
  const dungRef = useRef(paused);
  dungRef.current = paused;
  const rong = useRongKhung(gocRef, 16 / 9, 96);

  useEffect(() => {
    let huy = false;
    let donDep = () => {};
    const henGio: number[] = [];
    const hen = (fn: () => void, ms: number) => { henGio.push(window.setTimeout(fn, ms)); };
    hen(() => setBang(null), 2600);
    const tamDung = () => dungRef.current;

    void import('three').then((THREE) => {
      if (huy || !canvasRef.current) return;
      const canvas = canvasRef.current;
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
      } catch { setLoi(true); return; }
      renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      const C = (h: string) => new THREE.Color(h);
      const scene = new THREE.Scene();
      const th0 = THEMES[0]!;

      /* ── Bầu trời: shader gradient 3 màu, đổi theo cấp ── */
      const troiU = { top: { value: C(th0.troi[0]) }, mid: { value: C(th0.troi[1]) }, bot: { value: C(th0.troi[2]) } };
      const troi = new THREE.Mesh(
        new THREE.SphereGeometry(220, 32, 16),
        new THREE.ShaderMaterial({
          uniforms: troiU, side: THREE.BackSide, depthWrite: false, fog: false,
          vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
          fragmentShader: `uniform vec3 top; uniform vec3 mid; uniform vec3 bot; varying vec3 vP;
            void main(){ float h = vP.y; vec3 c = h > 0.0 ? mix(mid, top, smoothstep(0.0, 0.55, h)) : mix(mid, bot, smoothstep(0.0, 0.2, -h));
            gl_FragColor = vec4(c, 1.0);
            #include <colorspace_fragment>
            }`,
        }),
      );
      scene.add(troi);
      scene.fog = new THREE.Fog(th0.suong, 38, 125);

      const camera = new THREE.PerspectiveCamera(58, 16 / 9, 0.1, 500);
      camera.position.set(0, 4.2, 8.5);
      camera.lookAt(0, 1.2, -6);

      const hemi = new THREE.HemisphereLight('#fdf4ff', '#4c1d95', 1.15);
      scene.add(hemi);
      const nang = new THREE.DirectionalLight('#fff7ed', 2.1);
      nang.position.set(-6, 12, 6);
      nang.castShadow = true;
      nang.shadow.mapSize.set(1024, 1024);
      nang.shadow.radius = 4;
      Object.assign(nang.shadow.camera, { left: -9, right: 9, top: 12, bottom: -14, near: 1, far: 40 });
      scene.add(nang);

      /* ── Kết cấu dùng chung: đốm sáng tròn (glow, hạt) ── */
      const dom = (() => {
        const c = document.createElement('canvas'); c.width = c.height = 64;
        const g = c.getContext('2d')!;
        const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
        gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.35, 'rgba(255,255,255,0.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
        g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
        return new THREE.CanvasTexture(c);
      })();
      const vang = (mau: string, sc: number, op = 0.9) => {
        const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: dom, color: mau, transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false }));
        sp.scale.setScalar(sc);
        return sp;
      };

      /* ── Lớp xa: mặt trời + núi (tĩnh) ── */
      const mtMat = new THREE.MeshBasicMaterial({ color: th0.mt, fog: false });
      const mt = new THREE.Mesh(new THREE.CircleGeometry(15, 48), mtMat);
      mt.position.set(0, 9, -190);
      scene.add(mt);
      const mtVang = vang(th0.mt, 70, 0.55); mtVang.position.set(0, 9, -189); (mtVang.material as T3.SpriteMaterial).fog = false; scene.add(mtVang);
      const nuiXa = new THREE.MeshStandardMaterial({ color: th0.nui[1], roughness: 1 });
      const nuiGan = new THREE.MeshStandardMaterial({ color: th0.nui[0], roughness: 1 });
      for (let i = 0; i < 18; i++) {
        const xa = i < 10;
        const h = (xa ? 22 : 12) + Math.random() * (xa ? 26 : 14);
        const m = new THREE.Mesh(new THREE.ConeGeometry((xa ? 16 : 9) + Math.random() * 10, h, 32, 1), xa ? nuiXa : nuiGan);
        m.scale.z = 0.6;
        m.position.set((i % 2 ? 1 : -1) * ((xa ? 20 : 26) + Math.random() * 50), h / 2 - 7, xa ? -120 - Math.random() * 50 : -70 - Math.random() * 40);
        scene.add(m);
      }

      /* ── Đường: tấm có kết cấu làn cuộn + bệ dày + mép phát sáng ── */
      const LAN = [-2.2, 0, 2.2];
      const DAI = 170;
      const duongTex = (() => {
        const c = document.createElement('canvas'); c.width = 256; c.height = 256;
        const g = c.getContext('2d')!;
        const gr = g.createLinearGradient(0, 0, 256, 0);
        gr.addColorStop(0, '#9ca3af'); gr.addColorStop(0.08, '#ffffff'); gr.addColorStop(0.5, '#e5e7eb'); gr.addColorStop(0.92, '#ffffff'); gr.addColorStop(1, '#9ca3af');
        g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
        g.fillStyle = 'rgba(0,0,0,0.06)';
        for (let y = 0; y < 256; y += 32) g.fillRect(0, y, 256, 2);
        const t = new THREE.CanvasTexture(c);
        t.colorSpace = THREE.SRGBColorSpace; t.wrapS = THREE.ClampToEdgeWrapping; t.wrapT = THREE.RepeatWrapping;
        t.repeat.set(1, DAI / 8); t.anisotropy = 4;
        return t;
      })();
      const vachTex = (() => {
        const c = document.createElement('canvas'); c.width = 256; c.height = 256;
        const g = c.getContext('2d')!;
        g.fillStyle = '#000'; g.fillRect(0, 0, 256, 256);
        g.fillStyle = '#fff';
        for (const u of [0.355, 0.645]) { g.beginPath(); g.roundRect(u * 256 - 3, 30, 6, 120, 3); g.fill(); }
        const t = new THREE.CanvasTexture(c);
        t.wrapS = THREE.ClampToEdgeWrapping; t.wrapT = THREE.RepeatWrapping; t.repeat.set(1, DAI / 8); t.anisotropy = 4;
        return t;
      })();
      const duongMat = new THREE.MeshStandardMaterial({ color: th0.duong, map: duongTex, emissiveMap: vachTex, emissive: th0.mep, emissiveIntensity: 0.55, roughness: 0.5, metalness: 0.15 });
      const datMat = new THREE.MeshStandardMaterial({ color: C(th0.nui[0]).multiplyScalar(0.42), roughness: 1 });
      const dat = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), datMat);
      dat.rotation.x = -Math.PI / 2; dat.position.set(0, -1.25, -150); dat.receiveShadow = false;
      scene.add(dat);
      const duong = new THREE.Mesh(new THREE.PlaneGeometry(7.6, DAI), duongMat);
      duong.rotation.x = -Math.PI / 2;
      duong.position.set(0, 0, -DAI / 2 + 12);
      duong.receiveShadow = true;
      scene.add(duong);
      const beMat = new THREE.MeshStandardMaterial({ color: th0.nui[0], roughness: 0.8 });
      const be0 = new THREE.Mesh(new THREE.BoxGeometry(8.2, 1.2, DAI), beMat);
      be0.position.set(0, -0.62, -DAI / 2 + 12);
      scene.add(be0);
      const mepMat = new THREE.MeshStandardMaterial({ color: th0.mep, emissive: th0.mep, emissiveIntensity: 1.2, roughness: 0.3 });
      for (const x of [-3.95, 3.95]) {
        const mep = new THREE.Mesh(new THREE.CapsuleGeometry(0.13, DAI, 6, 12), mepMat);
        mep.rotation.x = Math.PI / 2;
        mep.position.set(x, 0.08, -DAI / 2 + 12);
        scene.add(mep);
      }

      /* ── Lớp gần: cột đèn + cây hai bên đường (tái chế liên tục) ── */
      type Canh = { o: T3.Object3D; heSo: number; tam: number };
      const canhVat: Canh[] = [];
      const cotMat = new THREE.MeshStandardMaterial({ color: '#e2e8f0', roughness: 0.4, metalness: 0.6 });
      const denMat = new THREE.MeshStandardMaterial({ color: '#fff7ed', emissive: '#fde68a', emissiveIntensity: 2.2 });
      const cotGeo = new THREE.CylinderGeometry(0.05, 0.08, 3.2, 10);
      const denGeo = new THREE.SphereGeometry(0.17, 16, 12);
      for (let i = 0; i < 20; i++) {
        const ben = i % 2 ? 1 : -1;
        const g = new THREE.Group();
        const cot = new THREE.Mesh(cotGeo, cotMat); cot.position.y = 1.6; g.add(cot);
        const den = new THREE.Mesh(denGeo, denMat); den.position.set(-ben * 0.25, 3.25, 0); g.add(den);
        const v = vang('#fde68a', 1.8, 0.7); v.position.copy(den.position); g.add(v);
        g.position.set(ben * 4.6, 0, 10 - Math.floor(i / 2) * 17);
        scene.add(g); canhVat.push({ o: g, heSo: 1, tam: 170 });
      }
      const laMat = new THREE.MeshStandardMaterial({ color: th0.la, roughness: 0.75, emissive: th0.la, emissiveIntensity: 0.12 });
      const thanCayMat = new THREE.MeshStandardMaterial({ color: '#5b3a29', roughness: 0.9 });
      const tanGeo = new THREE.SphereGeometry(1, 20, 14);
      const thanCayGeo = new THREE.CylinderGeometry(0.12, 0.18, 1.4, 10);
      for (let i = 0; i < 26; i++) {
        const ben = i % 2 ? 1 : -1;
        const g = new THREE.Group();
        const than = new THREE.Mesh(thanCayGeo, thanCayMat); than.position.y = 0.7; g.add(than);
        const k = 0.8 + Math.random() * 0.7;
        for (let j = 0; j < 3; j++) {
          const t = new THREE.Mesh(tanGeo, laMat);
          t.scale.setScalar(k * (j === 0 ? 0.95 : 0.65));
          t.position.set((j - 1) * 0.45 * k, 1.6 * k + (j === 0 ? 0.35 : 0), (j % 2 ? 0.2 : -0.2));
          t.castShadow = false; g.add(t);
        }
        g.position.set(ben * (6.5 + Math.random() * 6), -0.1, 8 - Math.floor(i / 2) * 13 - Math.random() * 6);
        scene.add(g); canhVat.push({ o: g, heSo: 1, tam: 169 });
      }
      /* Lớp giữa: đồi tròn lớn (cùng tốc độ thế giới — xa hơn nên trông chậm hơn) */
      const doiMat = new THREE.MeshStandardMaterial({ color: th0.nui[0], roughness: 1 });
      for (let i = 0; i < 12; i++) {
        const ben = i % 2 ? 1 : -1;
        const m = new THREE.Mesh(tanGeo, doiMat);
        const r = 3.5 + Math.random() * 4;
        m.scale.set(r * 1.5, r * 0.55, r);
        m.position.set(ben * (24 + Math.random() * 16), -1.8, 5 - Math.floor(i / 2) * 30 - Math.random() * 10);
        scene.add(m); canhVat.push({ o: m, heSo: 1, tam: 180 });
      }
      /* Lớp mây: trôi chậm (0,15×) */
      const mayMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 1, transparent: true, opacity: 0.85, emissive: '#ffffff', emissiveIntensity: 0.25 });
      for (let i = 0; i < 9; i++) {
        const g = new THREE.Group();
        for (let j = 0; j < 4; j++) {
          const c = new THREE.Mesh(tanGeo, mayMat);
          c.scale.set(2.4 + Math.random() * 1.5, 1 + Math.random() * 0.6, 1.6);
          c.position.set(j * 2 - 3, Math.random() * 0.8, Math.random());
          g.add(c);
        }
        g.position.set((Math.random() - 0.5) * 90, 15 + Math.random() * 10, -40 - i * 16);
        scene.add(g); canhVat.push({ o: g, heSo: 0.15, tam: 150 });
      }

      /* ── Robot CuongMini ── */
      const robot = new THREE.Group();
      scene.add(robot);
      const nguoi = new THREE.Group(); robot.add(nguoi); // nhóm để co giãn (nhún, trượt)
      const trang = new THREE.MeshPhysicalMaterial({ color: '#fbf9ff', roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.18 });
      const tim = new THREE.MeshPhysicalMaterial({ color: '#a78bfa', roughness: 0.3, clearcoat: 1, emissive: '#7c3aed', emissiveIntensity: 0.15 });
      const than = new THREE.Mesh(new THREE.SphereGeometry(0.62, 40, 28), trang);
      than.scale.set(1, 0.85, 0.95); than.position.y = 0.66; than.castShadow = true;
      nguoi.add(than);
      const bung = new THREE.Mesh(new THREE.SphereGeometry(0.3, 24, 16), new THREE.MeshStandardMaterial({ color: '#c4b5fd', emissive: '#8b5cf6', emissiveIntensity: 0.5, roughness: 0.3 }));
      bung.scale.set(1, 0.8, 0.3); bung.position.set(0, 0.62, 0.55); nguoi.add(bung);
      const dau = new THREE.Group(); dau.position.y = 1.66; nguoi.add(dau);
      const so = new THREE.Mesh(new THREE.SphereGeometry(0.6, 48, 32), trang);
      so.scale.set(1.12, 0.92, 0.98); so.castShadow = true; dau.add(so);
      const matCv = document.createElement('canvas'); matCv.width = 256; matCv.height = 128;
      const mg = matCv.getContext('2d')!;
      const matTex = new THREE.CanvasTexture(matCv); matTex.colorSpace = THREE.SRGBColorSpace;
      let matHienTai = '';
      const veMat = (kieu: 'thuong' | 'vui' | 'buon') => {
        if (kieu === matHienTai) return;
        matHienTai = kieu;
        mg.clearRect(0, 0, 256, 128);
        mg.fillStyle = '#141a3c'; mg.beginPath(); mg.roundRect(8, 8, 240, 112, 56); mg.fill();
        const mau = kieu === 'buon' ? '#fda4af' : '#5eeefc';
        mg.strokeStyle = mg.fillStyle = mau; mg.shadowColor = mau; mg.shadowBlur = 12; mg.lineWidth = 10; mg.lineCap = 'round';
        for (const x of [88, 168]) {
          mg.beginPath();
          if (kieu === 'vui') { mg.arc(x, 72, 18, Math.PI * 1.15, Math.PI * 1.85); mg.stroke(); }
          else if (kieu === 'buon') { mg.moveTo(x - 16, 50); mg.lineTo(x + 16, 66); mg.moveTo(x - 16, 66); mg.lineTo(x + 16, 50); mg.stroke(); }
          else { mg.ellipse(x, 60, 13, 20, 0, 0, Math.PI * 2); mg.fill(); }
        }
        mg.beginPath();
        if (kieu === 'buon') mg.arc(128, 100, 12, 1.15 * Math.PI, 1.85 * Math.PI); else mg.arc(128, 82, 14, 0.15 * Math.PI, 0.85 * Math.PI);
        mg.stroke();
        matTex.needsUpdate = true;
      };
      const kinh = new THREE.Mesh(
        new THREE.SphereGeometry(0.606, 48, 24, Math.PI / 2 - 0.95, 1.9, Math.PI / 2 - 0.55, 1.15),
        new THREE.MeshStandardMaterial({ map: matTex, emissiveMap: matTex, emissive: '#ffffff', emissiveIntensity: 0.85, transparent: true, roughness: 0.35 }),
      );
      so.add(kinh); // mặt kính quay về máy quay: luôn thấy biểu cảm
      veMat('thuong');
      for (const sx of [-1, 1]) {
        const tai = new THREE.Mesh(new THREE.SphereGeometry(0.17, 24, 16), tim);
        tai.scale.set(0.55, 1, 1); tai.position.set(sx * 0.66, 0, 0); dau.add(tai);
      }
      const angTen = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 12), new THREE.MeshStandardMaterial({ color: '#fde68a', emissive: '#fbbf24', emissiveIntensity: 2.4 }));
      angTen.position.set(0.1, 0.74, 0); dau.add(angTen);
      const angTenVang = vang('#fbbf24', 0.6, 0.8); angTenVang.position.copy(angTen.position); dau.add(angTenVang);
      const tay: T3.Mesh[] = [];
      for (const sx of [-1, 1]) {
        const t = new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.26, 8, 16), trang);
        t.position.set(sx * 0.72, 0.74, 0); t.castShadow = true; nguoi.add(t); tay.push(t);
      }
      const chan: T3.Mesh[] = [];
      for (const sx of [-1, 1]) {
        const c = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 0.12, 6, 12), tim);
        c.position.set(sx * 0.26, 0.12, 0); c.castShadow = true; nguoi.add(c); chan.push(c);
      }
      const khienMesh = new THREE.Mesh(new THREE.SphereGeometry(1.25, 32, 20), new THREE.MeshBasicMaterial({ color: '#67e8f9', transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false }));
      khienMesh.position.y = 1.1; khienMesh.visible = false; robot.add(khienMesh);
      const bong = new THREE.Mesh(new THREE.CircleGeometry(0.7, 32), new THREE.MeshBasicMaterial({ color: '#0f0a2a', transparent: true, opacity: 0.38, depthWrite: false }));
      bong.rotation.x = -Math.PI / 2; bong.position.y = 0.02; scene.add(bong);

      /* ── Hạt: bụi chân, bụi sao, mảnh va chạm (một Points, bể 320 hạt) ── */
      const SO_HAT = 320;
      const hatPos = new Float32Array(SO_HAT * 3), hatMau = new Float32Array(SO_HAT * 3), hatGoc = new Float32Array(SO_HAT * 3);
      const hatV = new Float32Array(SO_HAT * 3), hatSong = new Float32Array(SO_HAT), hatTho = new Float32Array(SO_HAT);
      for (let i = 0; i < SO_HAT; i++) hatPos[i * 3 + 1] = -50;
      const hatGeo = new THREE.BufferGeometry();
      hatGeo.setAttribute('position', new THREE.BufferAttribute(hatPos, 3));
      hatGeo.setAttribute('color', new THREE.BufferAttribute(hatMau, 3));
      const hatPts = new THREE.Points(hatGeo, new THREE.PointsMaterial({ size: 0.32, map: dom, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true }));
      hatPts.frustumCulled = false;
      scene.add(hatPts);
      let hatKe = 0;
      const tmpC = new THREE.Color();
      const phun = (x: number, y: number, z: number, n: number, mau: string, toc: number, len = 0.5, tho = 0.8) => {
        tmpC.set(mau);
        for (let k = 0; k < n; k++) {
          const i = hatKe; hatKe = (hatKe + 1) % SO_HAT;
          hatPos[i * 3] = x; hatPos[i * 3 + 1] = y; hatPos[i * 3 + 2] = z;
          const a = Math.random() * Math.PI * 2, b = Math.random() * Math.PI - Math.PI / 2;
          hatV[i * 3] = Math.cos(a) * Math.cos(b) * toc; hatV[i * 3 + 1] = Math.abs(Math.sin(b)) * toc * len + toc * 0.3; hatV[i * 3 + 2] = Math.sin(a) * Math.cos(b) * toc;
          hatGoc[i * 3] = tmpC.r; hatGoc[i * 3 + 1] = tmpC.g; hatGoc[i * 3 + 2] = tmpC.b;
          hatSong[i] = tho * (0.6 + Math.random() * 0.4); hatTho[i] = hatSong[i]!;
        }
      };

      /* ── Bể chướng ngại + vật phẩm ── */
      type Loai = 'da' | 'rao' | 'cong' | 'lan' | 'cot' | 'sao' | 'khien' | 'nam' | 'tim';
      type Vat = { m: T3.Object3D; loai: Loai; x: number; xDich: number; y: number; z: number; song: boolean; xet: boolean; bay: { vx: number; vy: number; vz: number; t: number } | null };
      const daMat = new THREE.MeshPhysicalMaterial({ color: '#67e8f9', roughness: 0.12, metalness: 0.1, clearcoat: 1, emissive: '#0891b2', emissiveIntensity: 0.55, flatShading: true });
      const raoMat = new THREE.MeshPhysicalMaterial({ color: '#f472b6', roughness: 0.28, clearcoat: 1, emissive: '#be185d', emissiveIntensity: 0.35 });
      const congMat = new THREE.MeshPhysicalMaterial({ color: '#fb923c', roughness: 0.3, clearcoat: 1, emissive: '#c2410c', emissiveIntensity: 0.35 });
      const bongLanMat = new THREE.MeshPhysicalMaterial({ color: '#a3e635', roughness: 0.25, clearcoat: 1, emissive: '#4d7c0f', emissiveIntensity: 0.35 });
      const cotMat2 = new THREE.MeshPhysicalMaterial({ color: '#c4b5fd', roughness: 0.25, clearcoat: 1, emissive: '#6d28d9', emissiveIntensity: 0.4 });
      const saoMat = new THREE.MeshStandardMaterial({ color: '#fde047', emissive: '#facc15', emissiveIntensity: 1.5, metalness: 0.35, roughness: 0.25 });
      const viTri = new THREE.MeshStandardMaterial({ color: '#e2e8f0', metalness: 0.8, roughness: 0.25 });
      const ngoiSao = (r1: number, r2: number) => {
        const sh = new THREE.Shape();
        for (let i = 0; i < 10; i++) { const r = i % 2 ? r2 : r1, a = (i / 10) * Math.PI * 2 - Math.PI / 2; if (i) sh.lineTo(Math.cos(a) * r, Math.sin(a) * r); else sh.moveTo(Math.cos(a) * r, Math.sin(a) * r); }
        return new THREE.ExtrudeGeometry(sh, { depth: 0.12, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05, bevelSegments: 3 });
      };
      const saoGeo = ngoiSao(0.4, 0.17);
      saoGeo.center();
      const timGeo = (() => {
        const h = new THREE.Shape();
        h.moveTo(0, -0.35); h.bezierCurveTo(-0.55, 0.05, -0.32, 0.45, 0, 0.2); h.bezierCurveTo(0.32, 0.45, 0.55, 0.05, 0, -0.35);
        const g = new THREE.ExtrudeGeometry(h, { depth: 0.14, bevelEnabled: true, bevelSize: 0.06, bevelThickness: 0.06, bevelSegments: 4 });
        g.center(); return g;
      })();
      const be: Vat[] = [];
      const taoMesh = (loai: Loai): T3.Object3D => {
        const g = new THREE.Group();
        const add = (m: T3.Mesh, bongDo = true) => { m.castShadow = bongDo; g.add(m); return m; };
        switch (loai) {
          case 'da': {
            const m = add(new THREE.Mesh(new THREE.OctahedronGeometry(0.72, 0), daMat)); m.scale.set(1, 1.45, 1); m.position.y = 1.05;
            const m2 = add(new THREE.Mesh(new THREE.OctahedronGeometry(0.4, 0), daMat)); m2.scale.set(1, 1.5, 1); m2.position.set(0.55, 0.55, 0.2); m2.rotation.z = -0.4;
            const sp = vang('#22d3ee', 2.6, 0.35); sp.position.y = 1; g.add(sp);
            break;
          }
          case 'rao': {
            const b = add(new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 1.5, 8, 20), raoMat)); b.rotation.z = Math.PI / 2; b.position.y = 0.5;
            for (const sx of [-0.85, 0.85]) { const c = add(new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.5, 10), viTri)); c.position.set(sx, 0.25, 0); }
            break;
          }
          case 'cong': {
            const b = add(new THREE.Mesh(new THREE.CapsuleGeometry(0.24, 1.55, 8, 20), congMat)); b.rotation.z = Math.PI / 2; b.position.y = 1.55;
            for (const sx of [-0.95, 0.95]) { const c = add(new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 1.5, 6, 12), viTri)); c.position.set(sx, 0.85, 0); }
            const sp = vang('#fb923c', 2.2, 0.35); sp.position.y = 1.55; g.add(sp);
            break;
          }
          case 'lan': {
            const m = add(new THREE.Mesh(new THREE.SphereGeometry(0.58, 32, 20), bongLanMat)); m.position.y = 0.58; m.name = 'qua';
            const vong = new THREE.Mesh(new THREE.TorusGeometry(0.585, 0.06, 8, 32), viTri); vong.rotation.y = Math.PI / 2; m.add(vong);
            break;
          }
          case 'cot': {
            const m = add(new THREE.Mesh(new THREE.CapsuleGeometry(0.5, 2.1, 10, 24), cotMat2)); m.position.y = 1.55;
            const v = new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.07, 8, 32), viTri); v.rotation.x = Math.PI / 2; v.position.y = 1.1; m.add(v);
            break;
          }
          case 'sao': { const m = add(new THREE.Mesh(saoGeo, saoMat), false); m.name = 'quay'; g.add(vang('#facc15', 1.4, 0.5)); break; }
          case 'khien': {
            const m = add(new THREE.Mesh(new THREE.IcosahedronGeometry(0.42, 3), new THREE.MeshPhysicalMaterial({ color: '#67e8f9', emissive: '#0891b2', emissiveIntensity: 0.8, roughness: 0.1, clearcoat: 1, transparent: true, opacity: 0.85 })), false);
            m.name = 'quay';
            const v = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.05, 8, 40), viTri); m.add(v);
            g.add(vang('#22d3ee', 2.4, 0.6));
            break;
          }
          case 'nam': {
            const m = add(new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.12, 12, 28, Math.PI), new THREE.MeshStandardMaterial({ color: '#ef4444', emissive: '#b91c1c', emissiveIntensity: 0.6, roughness: 0.3 })), false);
            m.name = 'quay';
            for (const sx of [-0.32, 0.32]) { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.2, 14), viTri); c.position.set(sx, -0.1, 0); m.add(c); }
            g.add(vang('#f87171', 2.2, 0.55));
            break;
          }
          case 'tim': {
            const m = add(new THREE.Mesh(timGeo, new THREE.MeshStandardMaterial({ color: '#fb7185', emissive: '#e11d48', emissiveIntensity: 0.9, roughness: 0.3 })), false);
            m.name = 'quay'; m.rotation.z = Math.PI;
            g.add(vang('#fb7185', 2.2, 0.6));
            break;
          }
        }
        scene.add(g);
        return g;
      };
      const lay = (loai: Loai, lan: number, z: number, y = 0): Vat => {
        let v = be.find((q) => !q.song && q.loai === loai);
        if (!v) { v = { m: taoMesh(loai), loai, x: 0, xDich: 0, y: 0, z: 0, song: false, xet: false, bay: null }; be.push(v); }
        v.song = true; v.xet = false; v.bay = null; v.m.visible = true; v.m.rotation.set(0, 0, 0); v.m.scale.setScalar(1);
        v.x = v.xDich = LAN[lan]!; v.z = z; v.y = y;
        return v;
      };
      const tat = (v: Vat) => { v.song = false; v.m.visible = false; };

      /* ── Trạng thái chơi ── */
      let lan = 1, x = 0, yNhay = 0, vNhay = 0, truot = 0, henTruot = false, ep = 0;
      let quang = 0, saoSo = 0, saoDiem = 0, thuongCap = 0, chuoi = 0, mang = 3, batTu = 0, khien = false, nam = 0;
      let cap = 1, tocDo = tocDoCap(1), zSau = -30, xong = false, cham = 0, rungMay = 0, tKet = 1, tg = 0, buocChan = 0, demBui = 0;
      let theme = 0;
      const doi = THEMES.map((t) => ({ top: C(t.troi[0]), mid: C(t.troi[1]), bot: C(t.troi[2]), suong: C(t.suong), duong: C(t.duong), mep: C(t.mep), nui0: C(t.nui[0]), nui1: C(t.nui[1]), la: C(t.la), mt: C(t.mt), dat: C(t.nui[0]).multiplyScalar(0.42) }));

      const manHinh = (p: T3.Vector3) => {
        const v = p.clone().project(camera);
        return { x: (v.x * 0.5 + 0.5) * canvas.clientWidth, y: (-v.y * 0.5 + 0.5) * canvas.clientHeight };
      };
      const tmpV = new THREE.Vector3();
      const bayChu = (chu: string, mau: string, yTren = 2.6) => {
        const p = manHinh(tmpV.set(x, yNhay + yTren, 0));
        diemBay(khungRef.current, p.x, p.y, chu, mau);
      };

      const doiLan = (d: number) => {
        if (xong) return;
        const moi = Math.max(0, Math.min(2, lan + d));
        if (moi !== lan) { lan = moi; sfx('bam'); }
      };
      const nhay = () => {
        if (xong) return;
        if (yNhay <= 0.001) { vNhay = 9.6; truot = 0; ep = -0.35; sfx('nhay'); }
      };
      const xuong = () => {
        if (xong) return;
        if (yNhay > 0.05) { vNhay = -16; henTruot = true; }
        else if (truot <= 0) { truot = 0.62; sfx('truot'); }
      };
      const phim = (e: KeyboardEvent) => {
        if (tamDung()) return;
        if (['ArrowLeft', 'a', 'A'].includes(e.key)) { e.preventDefault(); doiLan(-1); }
        else if (['ArrowRight', 'd', 'D'].includes(e.key)) { e.preventDefault(); doiLan(1); }
        else if (['ArrowUp', 'w', 'W', ' '].includes(e.key)) { e.preventDefault(); nhay(); }
        else if (['ArrowDown', 's', 'S'].includes(e.key)) { e.preventDefault(); xuong(); }
      };
      window.addEventListener('keydown', phim);
      let cham0: { x: number; y: number } | null = null;
      const tro = (e: PointerEvent) => { cham0 = { x: e.clientX, y: e.clientY }; };
      const tha = (e: PointerEvent) => {
        if (!cham0 || tamDung()) { cham0 = null; return; }
        const dx = e.clientX - cham0.x, dy = e.clientY - cham0.y; cham0 = null;
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 22) { nhay(); return; }
        if (Math.abs(dx) > Math.abs(dy)) doiLan(dx > 0 ? 1 : -1); else if (dy < 0) nhay(); else xuong();
      };
      canvas.addEventListener('pointerdown', tro);
      canvas.addEventListener('pointerup', tha);

      const doKhung = () => {
        const w = canvas.clientWidth, h = canvas.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
      };
      const ro = new ResizeObserver(doKhung); ro.observe(canvas); doKhung();

      const sinhHang = (z: number) => {
        const loaiCo: Loai[] = ['da'];
        if (cap >= 2) loaiCo.push('rao', 'rao');
        if (cap >= 3) loaiCo.push('cong', 'cong');
        if (cap >= 4) loaiCo.push('lan');
        if (cap >= 5) loaiCo.push('cot');
        const pVat = Math.min(0.82, 0.42 + cap * 0.04);
        const lanTrong = Math.floor(Math.random() * 3);
        for (let l = 0; l < 3; l++) {
          if (l === lanTrong) {
            const r = Math.random();
            if (cap >= 2 && r < 0.07) {
              const lo: Loai = mang < 3 && Math.random() < 0.35 ? 'tim' : Math.random() < 0.5 ? 'khien' : 'nam';
              lay(lo, l, z, 1);
            } else if (r < 0.72) {
              const n = 3 + Math.floor(Math.random() * 3);
              for (let k = 0; k < n; k++) lay('sao', l, z - k * 1.7, 0.95);
            }
            continue;
          }
          if (Math.random() < pVat) {
            const lo = loaiCo[Math.floor(Math.random() * loaiCo.length)]!;
            const v = lay(lo, l, z);
            if (lo === 'lan') { const ke = l === 0 ? 1 : l === 2 ? 1 : Math.random() < 0.5 ? 0 : 2; v.xDich = LAN[ke]!; }
            if (lo === 'rao' && Math.random() < 0.5) for (let k = -1; k <= 1; k++) lay('sao', l, z + k * 1.3, 2.1 - Math.abs(k) * 0.35);
          }
        }
      };

      const capNhatHud = () => setHud({
        diem: Math.round(quang) + saoDiem + thuongCap, m: Math.round(quang), sao: saoSo, mang, tocDo: Math.round(tocDo * 3.6), cap,
        tienDo: Math.min(1, (quang - MOC[cap]!) / doDaiCap(cap)), heSo: Math.min(5, 1 + Math.floor(chuoi / 8)), chuoi, khien, nam,
      });

      const lenCap = () => {
        cap++;
        thuongCap += 100;
        theme = (cap - 1) % THEMES.length;
        sfx('lenCap');
        const chu = CHU_CAP[cap] ?? ['Nhanh hơn, dày hơn!', 'Faster and denser!'];
        setBang({ cap, chu: chu[vi ? 0 : 1], id: cap });
        hen(() => setBang((b) => (b && b.id === cap ? null : b)), 2400);
        const el = khungRef.current;
        if (el) phaoGiay(el, { x: el.clientWidth / 2, y: el.clientHeight * 0.3, it: true, mau: ['#fde047', '#f472b6', '#67e8f9', '#ffffff'] });
        bayChu('+100', '#fde68a', 3.2);
      };

      const trung = (v: Vat) => {
        // Hất chướng ngại văng ra mềm mại.
        v.xet = true;
        v.bay = { vx: (v.x >= x ? 1 : -1) * (3 + Math.random() * 2), vy: 5 + Math.random() * 2, vz: -2, t: 1.1 };
        if (khien) {
          khien = false; batTu = 0.9; sfx('no');
          phun(x, 1.2, 0, 40, '#67e8f9', 6, 0.6, 0.9);
          bayChu(vi ? 'Khiên vỡ!' : 'Shield!', '#67e8f9');
          return;
        }
        mang--; batTu = 1.5; chuoi = 0; cham = 0.42; rungMay = 0.55;
        veMat('buon');
        hen(() => { if (!xong) veMat('thuong'); }, 900);
        sfx('sai');
        phun(v.x, 1, 0, 30, '#fda4af', 5, 0.7, 0.8);
        setDau((d) => d + 1);
        rung(khungRef.current);
        if (mang <= 0) {
          xong = true; cham = 0;
          const diem = Math.round(quang) + saoDiem + thuongCap;
          const giay = Math.round(tg);
          sfx('no');
          setKetThuc(diem);
          capNhatHud();
          hen(() => onScoreRef.current?.(diem, giay), 1700);
        }
      };

      let truoc = performance.now(), raf = 0, demHud = 0;
      const khung = (bayGio: number) => {
        raf = requestAnimationFrame(khung);
        const dtThat = Math.max(0, Math.min(0.05, (bayGio - truoc) / 1000)); // dấu RAF có thể cũ hơn performance.now() ⇒ chặn âm
        truoc = bayGio;
        if (document.hidden || tamDung()) return;
        if (cham > 0) cham -= dtThat;
        if (xong) tKet = Math.max(0.05, tKet - dtThat * 0.8);
        const dt = dtThat * (cham > 0 ? 0.3 : 1) * (xong ? tKet : 1);
        tg += dt;

        if (!xong) {
          const dich = tocDoCap(cap) + Math.min(1.8, ((quang - MOC[cap]!) / doDaiCap(cap)) * 1.8);
          tocDo += (dich - tocDo) * Math.min(1, dt * 0.7);
          quang += tocDo * dt;
          if (quang >= MOC[cap + 1]!) lenCap();
        }
        const buoc = tocDo * dt;

        // Màu theo cấp — chuyển mượt.
        const d = doi[theme]!, k = Math.min(1, dtThat * 1.4);
        troiU.top.value.lerp(d.top, k); troiU.mid.value.lerp(d.mid, k); troiU.bot.value.lerp(d.bot, k);
        (scene.fog as T3.Fog).color.lerp(d.suong, k);
        duongMat.color.lerp(d.duong, k); duongMat.emissive.lerp(d.mep, k); datMat.color.lerp(d.dat, k); mepMat.color.lerp(d.mep, k); mepMat.emissive.lerp(d.mep, k);
        nuiGan.color.lerp(d.nui0, k); nuiXa.color.lerp(d.nui1, k); beMat.color.lerp(d.nui0, k); doiMat.color.lerp(d.nui0, k);
        laMat.color.lerp(d.la, k); laMat.emissive.lerp(d.la, k); mtMat.color.lerp(d.mt, k); (mtVang.material as T3.SpriteMaterial).color.lerp(d.mt, k);
        hemi.groundColor.lerp(d.nui0, k);

        // Robot: trượt làn mượt, nhảy theo trọng lực, nhún/ép khi đáp, tư thế trượt.
        x += (LAN[lan]! - x) * Math.min(1, dt * 13);
        const trenKhong = yNhay > 0.001 || vNhay > 0;
        vNhay -= 27 * dt; yNhay += vNhay * dt;
        if (yNhay <= 0) {
          if (trenKhong && vNhay < -3) { ep = 0.45; phun(x, 0.1, 0.2, 10, '#e9d5ff', 2.5, 0.3, 0.5); if (henTruot) { truot = 0.55; sfx('truot'); } }
          henTruot = false; yNhay = 0; vNhay = 0;
        }
        if (truot > 0) truot -= dt;
        ep += (0 - ep) * Math.min(1, dt * 10);
        buocChan += dt * (6 + tocDo * 0.32);
        const sb = Math.sin(buocChan * 2);
        const dangTruot = truot > 0;
        robot.position.set(x, yNhay + (yNhay > 0 || dangTruot ? 0 : Math.abs(Math.sin(buocChan * 2)) * 0.09), 0);
        robot.rotation.z = (x - LAN[lan]!) * 0.22;
        const nghieng = dangTruot ? -0.55 : yNhay > 0 ? -0.08 : -0.12;
        nguoi.rotation.x += (nghieng - nguoi.rotation.x) * Math.min(1, dt * 14);
        const sy = dangTruot ? 0.62 : 1 - ep * 0.35, sxz = dangTruot ? 1.12 : 1 + ep * 0.25;
        nguoi.scale.set(sxz, sy, sxz);
        dau.rotation.x = Math.sin(buocChan * 2) * 0.05;
        dau.rotation.z = Math.sin(buocChan) * 0.04;
        const vungTay = yNhay > 0 ? 2.4 : 0.95;
        tay[0]!.rotation.x = yNhay > 0 ? -vungTay : sb * vungTay; tay[1]!.rotation.x = yNhay > 0 ? -vungTay : -sb * vungTay;
        tay[0]!.rotation.z = yNhay > 0 ? -0.6 : 0; tay[1]!.rotation.z = yNhay > 0 ? 0.6 : 0;
        chan[0]!.position.z = yNhay > 0 || dangTruot ? 0.15 : sb * 0.22; chan[1]!.position.z = yNhay > 0 || dangTruot ? -0.05 : -sb * 0.22;
        chan[0]!.position.y = 0.12 + Math.max(0, sb) * 0.12; chan[1]!.position.y = 0.12 + Math.max(0, -sb) * 0.12;
        bong.position.set(x, 0.02, 0); bong.scale.setScalar(1 / (1 + yNhay * 0.4)); (bong.material as T3.MeshBasicMaterial).opacity = 0.38 / (1 + yNhay * 0.6);
        robot.visible = batTu <= 0 || xong || Math.floor(batTu * 14) % 2 === 0;
        if (batTu > 0) batTu -= dt;
        khienMesh.visible = khien;
        if (khien) { khienMesh.rotation.y += dt; (khienMesh.material as T3.MeshBasicMaterial).opacity = 0.16 + Math.sin(tg * 5) * 0.06; }
        if (nam > 0) nam = Math.max(0, nam - dt);
        angTen.scale.setScalar(1 + Math.sin(tg * 8) * 0.18);
        if (!xong && yNhay === 0 && !dangTruot && (demBui += dt) > 0.1) { demBui = 0; phun(x + (Math.random() - 0.5) * 0.4, 0.08, 0.35, 1, '#8b7fc4', 1, 0.2, 0.35); }

        // Cảnh cuộn (đường + các lớp).
        duongTex.offset.y += buoc / 8; vachTex.offset.y = duongTex.offset.y;
        for (const c of canhVat) { c.o.position.z += buoc * c.heSo; if (c.o.position.z > 14) c.o.position.z -= c.tam; }

        // Sinh hàng mới: khoảng cách theo THỜI GIAN phản xạ (nhanh hơn ⇒ hàng cách xa hơn trong không gian).
        zSau += buoc;
        while (zSau > -100) {
          sinhHang(zSau);
          const giayPhanXa = Math.max(0.56, 1.18 - cap * 0.055);
          zSau -= tocDo * giayPhanXa + Math.random() * tocDo * 0.32 + 4;
        }

        const ySao = yNhay + (dangTruot ? 1.1 : 2.0);
        for (const v of be) {
          if (!v.song) continue;
          const zTruoc = v.z;
          v.z += buoc;
          if (v.bay) {
            v.bay.t -= dt; v.bay.vy -= 18 * dt;
            v.x += v.bay.vx * dt; v.y += v.bay.vy * dt; v.z += v.bay.vz * dt;
            v.m.rotation.x += dt * 6; v.m.rotation.z += dt * 4;
            v.m.scale.setScalar(Math.max(0.01, Math.min(1, v.bay.t * 1.4)));
            v.m.position.set(v.x, v.y, v.z);
            if (v.bay.t <= 0) tat(v);
            continue;
          }
          if (v.loai === 'lan' && v.z > -32) { v.x += Math.sign(v.xDich - v.x) * Math.min(Math.abs(v.xDich - v.x), dt * 2.4); const q = v.m.getObjectByName('qua'); if (q) { q.rotation.x += buoc / 0.58; q.rotation.z = (v.x - v.xDich) * 0.6; } }
          const laVatPham = v.loai === 'sao' || v.loai === 'khien' || v.loai === 'nam' || v.loai === 'tim';
          if (laVatPham) {
            if (v.loai === 'sao' && nam > 0 && v.z > -16 && v.z < 1.5) {
              v.x += (x - v.x) * Math.min(1, dt * 9); v.y += (yNhay + 1 - v.y) * Math.min(1, dt * 9); v.z += (0 - v.z) * Math.min(1, dt * 5);
            }
            const q = v.m.getObjectByName('quay');
            if (q) q.rotation.y += dt * 3.2;
            v.m.position.set(v.x, v.y + Math.sin(tg * 4 + v.z * 0.5) * 0.12, v.z);
            const gan = Math.abs(v.x - x) < 0.95 && v.y > yNhay - 0.3 && v.y < ySao + 0.2 && v.z > -0.8 && zTruoc < 0.8;
            if (gan && !xong) {
              tat(v);
              if (v.loai === 'sao') {
                saoSo++; chuoi++;
                const heSo = Math.min(5, 1 + Math.floor(chuoi / 8));
                saoDiem += 10 * heSo;
                sfx('nhat');
                if (chuoi % 8 === 0 && heSo <= 5 && chuoi <= 32) { hen(() => sfx('combo', { muc: heSo }), 70); bayChu(`×${heSo}`, '#f9a8d4', 3.1); }
                else bayChu(`+${10 * heSo}`, '#fde047');
                phun(v.x, v.y + 0.2, v.z, 12, '#fde047', 3.5, 0.6, 0.55);
                veMat('vui'); hen(() => { if (!xong && batTu <= 0) veMat('thuong'); }, 450);
              } else {
                sfx('sao');
                const el = khungRef.current;
                if (el) { const p = manHinh(tmpV.set(v.x, v.y, v.z)); phaoGiay(el, { x: p.x, y: p.y, it: true, mau: v.loai === 'tim' ? ['#fb7185', '#fda4af', '#fff'] : v.loai === 'khien' ? ['#67e8f9', '#a5f3fc', '#fff'] : ['#f87171', '#e2e8f0', '#fff'] }); }
                if (v.loai === 'khien') { khien = true; bayChu(vi ? 'Khiên!' : 'Shield!', '#67e8f9'); }
                else if (v.loai === 'nam') { nam = 7; bayChu(vi ? 'Nam châm 7s' : 'Magnet 7s', '#fca5a5'); }
                else { mang = Math.min(3, mang + 1); bayChu('+1 ♥', '#fb7185'); }
              }
              continue;
            }
            if (v.z > 2.2) { if (v.loai === 'sao' && chuoi > 0 && !xong) chuoi = 0; tat(v); }
            continue;
          }
          // Chướng ngại
          v.m.position.set(v.x, 0, v.z);
          if (v.loai === 'da') v.m.rotation.y += dt * 0.7;
          if (v.z > 12) { tat(v); continue; }
          if (!v.xet && !xong && v.z > -0.6 && zTruoc < 0.6 && Math.abs(v.x - x) < 0.98) {
            const qua = v.loai === 'rao' ? yNhay > 0.68
              : v.loai === 'lan' ? yNhay > 1.0
                : v.loai === 'da' ? yNhay > 1.5
                  : v.loai === 'cong' ? dangTruot && yNhay < 0.2
                    : false;
            if (qua) { v.xet = true; if (v.loai !== 'da') { saoDiem += 5; } }
            else if (batTu > 0) v.xet = true;
            else trung(v);
          }
        }

        // Hạt
        for (let i = 0; i < SO_HAT; i++) {
          if (hatSong[i]! <= 0) continue;
          hatSong[i] = hatSong[i]! - dtThat;
          const j = i * 3;
          hatV[j + 1] = hatV[j + 1]! - 6 * dtThat;
          hatPos[j] = hatPos[j]! + hatV[j]! * dtThat; hatPos[j + 1] = hatPos[j + 1]! + hatV[j + 1]! * dtThat; hatPos[j + 2] = hatPos[j + 2]! + (hatV[j + 2]! + (xong ? 0 : tocDo * 0.9)) * dtThat;
          const a = Math.max(0, hatSong[i]! / hatTho[i]!);
          hatMau[j] = hatGoc[j]! * a; hatMau[j + 1] = hatGoc[j + 1]! * a; hatMau[j + 2] = hatGoc[j + 2]! * a;
          if (hatSong[i]! <= 0) hatPos[j + 1] = -50;
        }
        hatGeo.attributes.position!.needsUpdate = true;
        hatGeo.attributes.color!.needsUpdate = true;

        // Máy quay: bám làn, FOV mở theo tốc độ, rung tắt dần khi va chạm.
        if (rungMay > 0) rungMay = Math.max(0, rungMay - dtThat);
        const rx = (Math.random() - 0.5) * rungMay * 0.6, ry = (Math.random() - 0.5) * rungMay * 0.4;
        camera.position.x += (x * 0.45 - camera.position.x) * Math.min(1, dtThat * 4);
        camera.position.y = 4.2 + yNhay * 0.18 + ry;
        const fov = 58 + (tocDo - 12) * 0.32;
        if (Math.abs(camera.fov - fov) > 0.05) { camera.fov += (fov - camera.fov) * Math.min(1, dtThat * 2); camera.updateProjectionMatrix(); }
        camera.lookAt(camera.position.x * 0.5 + rx, 1.2, -6);
        renderer.render(scene, camera);
        if (!xong && (demHud += dtThat) > 0.1) { demHud = 0; capNhatHud(); }
      };
      raf = requestAnimationFrame(khung);

      donDep = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        window.removeEventListener('keydown', phim);
        canvas.removeEventListener('pointerdown', tro);
        canvas.removeEventListener('pointerup', tha);
        scene.traverse((o) => {
          const m = o as T3.Mesh;
          m.geometry?.dispose();
          const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
          for (const mt2 of mats) { for (const v of Object.values(mt2)) if (v instanceof THREE.Texture) v.dispose(); mt2.dispose(); }
        });
        dom.dispose(); duongTex.dispose(); vachTex.dispose(); matTex.dispose();
        renderer.dispose();
      };
    }).catch(() => setLoi(true));
    return () => { huy = true; henGio.forEach((id) => window.clearTimeout(id)); donDep(); };
  }, [vi]);

  return (
    <div ref={gocRef} className={s.goc} style={{ width: rong ?? undefined }}>
      <div className={s.hud}>
        <span className={s.chip} data-loai="diem"><b>{hud.diem.toLocaleString('vi-VN')}</b><small>{vi ? 'điểm' : 'pts'}</small></span>
        <div className={s.capBoc} title={vi ? 'Tiến độ tới cấp kế' : 'Progress to next level'}>
          <span className={s.capSo}><Flag size={12} /> {vi ? 'Cấp' : 'Lv'} <b>{hud.cap}</b></span>
          <div className={s.capThanh}><div style={{ transform: `scaleX(${hud.tienDo})` }} /></div>
        </div>
        <span className={s.chip}><Star size={14} className={s.icSao} /> <b>{hud.sao}</b>{hud.heSo > 1 && <em className={s.heSo} key={hud.heSo}>×{hud.heSo}</em>}</span>
        <span className={s.chip} data-an-hep><Gauge size={14} /> <b>{hud.tocDo}</b><small>km/h</small></span>
        {hud.khien && <span className={s.chip} data-loai="khien"><Shield size={14} /></span>}
        {hud.nam > 0 && <span className={s.chip} data-loai="nam"><Magnet size={14} /> <b>{Math.ceil(hud.nam)}</b></span>}
        <span className={s.tim}>{[0, 1, 2].map((i) => <Heart key={i} size={19} data-con={i < hud.mang} />)}</span>
      </div>
      <div ref={khungRef} className={s.khung}>
        <canvas ref={canvasRef} className={s.canvas} />
        {dau > 0 && <div key={dau} className={s.dau} />}
        {bang && !ketThuc && (
          <div key={bang.id} className={s.bang}>
            <small>{bang.cap === 1 ? (vi ? 'Sẵn sàng' : 'Ready') : (vi ? 'Lên cấp!' : 'Level up!')}</small>
            <b>{vi ? 'Cấp' : 'Level'} {bang.cap}</b>
            <span>{bang.chu}</span>
          </div>
        )}
        {loi && <div className={s.lop}>{vi ? 'Máy này chưa chạy được đồ hoạ 3D (WebGL).' : 'WebGL is not available on this device.'}</div>}
        {ketThuc !== null && <div className={s.lop}><small>{vi ? 'Hết mạng' : 'Out of lives'}</small><b>{ketThuc.toLocaleString('vi-VN')}</b><span>{vi ? `điểm · ${hud.m} m · cấp ${hud.cap}` : `points · ${hud.m} m · level ${hud.cap}`}</span></div>}
      </div>
      <p className={s.goiY}>
        <kbd>←</kbd><kbd>→</kbd> {vi ? 'đổi làn' : 'lanes'} · <kbd>↑</kbd>/<kbd>Space</kbd> {vi ? 'nhảy' : 'jump'} · <kbd>↓</kbd> {vi ? 'trượt' : 'slide'} · {vi ? 'cảm ứng: vuốt' : 'touch: swipe'}
      </p>
    </div>
  );
}
