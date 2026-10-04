'use client';

/**
 * CuongMini chạy — game HÀNH ĐỘNG 3D (three.js, tải lười như nhân vật Gọi gia sư).
 *
 * Robot CuongMini (thân trứng, đầu tròn lơ lửng, mặt kính phát sáng — cùng dáng với
 * nhân vật luyện nói) chạy trên đường ba làn lơ lửng giữa trời hoàng hôn. Né chướng
 * ngại (đá pha lê, rào bo tròn), nhảy qua rào thấp, ăn sao. Tốc độ tăng dần; 3 mạng,
 * va chạm thì nháy bất tử 1,2 giây.
 *
 * Điểm = quãng đường (m) + 25 × số sao. Báo một lần khi hết mạng.
 * Điều khiển: ←/→ hoặc A/D đổi làn, ↑/W/Space nhảy; cảm ứng: vuốt.
 *
 * Mọi vật thể dùng lại từ bể (pool) — không tạo/huỷ mesh trong vòng lặp khung hình.
 */
import { useEffect, useRef, useState } from 'react';
import { Heart, Star } from 'lucide-react';
import type * as T3 from 'three';
import type { GameProps } from './registry';
import s from './runner.module.css';

type Hud = { m: number; sao: number; mang: number; tocDo: number };

export default function RunnerGame({ onScore, locale = 'vi' }: Partial<GameProps>) {
  const vi = locale === 'vi';
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hud, setHud] = useState<Hud>({ m: 0, sao: 0, mang: 3, tocDo: 0 });
  const [loi, setLoi] = useState(false);
  const [ketThuc, setKetThuc] = useState(false);
  const onScoreRef = useRef(onScore);
  onScoreRef.current = onScore;

  useEffect(() => {
    let huy = false;
    let donDep = () => {};
    void import('three').then((THREE) => {
      if (huy || !canvasRef.current) return;
      const canvas = canvasRef.current;
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
      } catch { setLoi(true); return; }
      renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.shadowMap.enabled = true;

      const scene = new THREE.Scene();
      // Trời hoàng hôn bằng một quả cầu lớn tô gradient từ trong ra.
      const troiTex = (() => {
        const c = document.createElement('canvas'); c.width = 4; c.height = 256;
        const g = c.getContext('2d')!;
        const gr = g.createLinearGradient(0, 0, 0, 256);
        gr.addColorStop(0, '#1e1b4b'); gr.addColorStop(0.45, '#7c3aed'); gr.addColorStop(0.7, '#f472b6'); gr.addColorStop(1, '#fdba74');
        g.fillStyle = gr; g.fillRect(0, 0, 4, 256);
        const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
      })();
      const troi = new THREE.Mesh(new THREE.SphereGeometry(200, 32, 16), new THREE.MeshBasicMaterial({ map: troiTex, side: THREE.BackSide, fog: false }));
      scene.add(troi);
      scene.fog = new THREE.Fog('#c084fc', 40, 120);

      const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 400);
      camera.position.set(0, 4.2, 8.5);
      camera.lookAt(0, 1.2, -6);

      scene.add(new THREE.HemisphereLight('#fdf4ff', '#4c1d95', 1.1));
      const nang = new THREE.DirectionalLight('#fff7ed', 2.2);
      nang.position.set(-6, 12, 6);
      nang.castShadow = true;
      nang.shadow.mapSize.set(1024, 1024);
      Object.assign(nang.shadow.camera, { left: -10, right: 10, top: 10, bottom: -10 });
      scene.add(nang);

      // Mặt trời to ở chân trời + núi xa (nón tròn mượt, không góc cạnh).
      const mt = new THREE.Mesh(new THREE.CircleGeometry(16, 48), new THREE.MeshBasicMaterial({ color: '#fde68a', fog: false }));
      mt.position.set(0, 6, -150);
      scene.add(mt);
      const nui = new THREE.MeshStandardMaterial({ color: '#5b21b6', roughness: 1, flatShading: false });
      for (let i = 0; i < 14; i++) {
        const h = 12 + Math.random() * 22;
        const m = new THREE.Mesh(new THREE.ConeGeometry(10 + Math.random() * 10, h, 24), nui);
        m.position.set((i % 2 ? 1 : -1) * (24 + Math.random() * 40), h / 2 - 6, -60 - Math.random() * 70);
        scene.add(m);
      }

      // Đường: 3 làn, dải phát sáng hai mép, vạch chia làn chạy.
      const LAN = [-2.2, 0, 2.2];
      const DUONG_DAI = 160;
      const duong = new THREE.Mesh(new THREE.BoxGeometry(7.6, 0.4, DUONG_DAI), new THREE.MeshStandardMaterial({ color: '#312e81', roughness: 0.55, metalness: 0.2 }));
      duong.position.set(0, -0.2, -DUONG_DAI / 2 + 10);
      duong.receiveShadow = true;
      scene.add(duong);
      for (const x of [-3.85, 3.85]) {
        const mep = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.18, DUONG_DAI), new THREE.MeshBasicMaterial({ color: '#f0abfc' }));
        mep.position.set(x, 0.05, -DUONG_DAI / 2 + 10);
        scene.add(mep);
      }
      const vach: T3.Mesh[] = [];
      const vachMat = new THREE.MeshBasicMaterial({ color: '#a5b4fc', transparent: true, opacity: 0.55 });
      for (let i = 0; i < 40; i++) for (const x of [-1.1, 1.1]) {
        const v = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 1.4), vachMat);
        v.rotation.x = -Math.PI / 2;
        v.position.set(x, 0.01, 10 - i * 4);
        scene.add(v); vach.push(v);
      }

      /* ── Robot CuongMini (rút gọn từ nhân vật Gọi gia sư) ── */
      const robot = new THREE.Group();
      scene.add(robot);
      const trang = new THREE.MeshPhysicalMaterial({ color: '#fbf9ff', roughness: 0.35, clearcoat: 1, clearcoatRoughness: 0.2 });
      const tim = new THREE.MeshPhysicalMaterial({ color: '#a78bfa', roughness: 0.3, clearcoat: 1 });
      const than = new THREE.Mesh(new THREE.SphereGeometry(0.62, 40, 28), trang);
      than.scale.set(1, 0.85, 0.95); than.position.y = 0.62; than.castShadow = true;
      robot.add(than);
      const dau = new THREE.Group(); dau.position.y = 1.62; robot.add(dau);
      const so = new THREE.Mesh(new THREE.SphereGeometry(0.6, 48, 32), trang);
      so.scale.set(1.12, 0.92, 0.98); so.castShadow = true; dau.add(so);
      const matCv = document.createElement('canvas'); matCv.width = 256; matCv.height = 128;
      const mg = matCv.getContext('2d')!;
      const veMat = (vui: boolean) => {
        mg.clearRect(0, 0, 256, 128);
        mg.fillStyle = '#141a3c'; mg.beginPath(); mg.roundRect(8, 8, 240, 112, 56); mg.fill();
        mg.strokeStyle = mg.fillStyle = '#5eeefc'; mg.shadowColor = '#22d3ee'; mg.shadowBlur = 10; mg.lineWidth = 10; mg.lineCap = 'round';
        for (const x of [88, 168]) {
          mg.beginPath();
          if (vui) mg.arc(x, 72, 18, Math.PI * 1.15, Math.PI * 1.85); else mg.ellipse(x, 60, 13, 20, 0, 0, Math.PI * 2);
          if (vui) mg.stroke(); else mg.fill();
        }
        mg.beginPath(); mg.arc(128, 82, 14, 0.15 * Math.PI, 0.85 * Math.PI); mg.stroke();
        matTex.needsUpdate = true;
      };
      const matTex = new THREE.CanvasTexture(matCv); matTex.colorSpace = THREE.SRGBColorSpace;
      const kinh = new THREE.Mesh(
        new THREE.SphereGeometry(0.606, 48, 24, Math.PI / 2 - 0.95, 1.9, Math.PI / 2 - 0.55, 1.15),
        new THREE.MeshStandardMaterial({ map: matTex, emissiveMap: matTex, emissive: '#ffffff', emissiveIntensity: 0.8, transparent: true, roughness: 0.4 }),
      );
      so.add(kinh); // mặt kính ở +z = hướng máy quay: người chơi luôn thấy biểu cảm của CuongMini
      veMat(false);
      for (const sx of [-1, 1]) {
        const tai = new THREE.Mesh(new THREE.SphereGeometry(0.17, 24, 16), tim);
        tai.scale.set(0.55, 1, 1); tai.position.set(sx * 0.66, 0, 0); dau.add(tai);
      }
      const angTen = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 12), new THREE.MeshStandardMaterial({ color: '#fde68a', emissive: '#fbbf24', emissiveIntensity: 2 }));
      angTen.position.set(0.1, 0.72, 0); dau.add(angTen);
      const tay: T3.Mesh[] = [];
      for (const sx of [-1, 1]) {
        const t = new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.26, 8, 16), trang);
        t.position.set(sx * 0.72, 0.7, 0); robot.add(t); tay.push(t);
      }
      const bong = new THREE.Mesh(new THREE.CircleGeometry(0.7, 32), new THREE.MeshBasicMaterial({ color: '#1e1b4b', transparent: true, opacity: 0.35 }));
      bong.rotation.x = -Math.PI / 2; bong.position.y = 0.02; scene.add(bong);

      /* ── Bể chướng ngại + sao ── */
      type Vat = { m: T3.Object3D; loai: 'da' | 'rao' | 'sao'; lan: number; z: number; song: boolean };
      const daMat = new THREE.MeshPhysicalMaterial({ color: '#22d3ee', roughness: 0.15, metalness: 0.1, transmission: 0.2, clearcoat: 1, emissive: '#0e7490', emissiveIntensity: 0.4 });
      const raoMat = new THREE.MeshPhysicalMaterial({ color: '#f472b6', roughness: 0.3, clearcoat: 1, emissive: '#9d174d', emissiveIntensity: 0.3 });
      const saoMat = new THREE.MeshStandardMaterial({ color: '#fde047', emissive: '#facc15', emissiveIntensity: 1.6, metalness: 0.3, roughness: 0.3 });
      const saoGeo = (() => {
        const sh = new THREE.Shape();
        for (let i = 0; i < 10; i++) { const r = i % 2 ? 0.16 : 0.38, a = (i / 10) * Math.PI * 2 - Math.PI / 2; if (i) sh.lineTo(Math.cos(a) * r, Math.sin(a) * r); else sh.moveTo(Math.cos(a) * r, Math.sin(a) * r); }
        return new THREE.ExtrudeGeometry(sh, { depth: 0.12, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.04, bevelSegments: 3 });
      })();
      const be: Vat[] = [];
      const lay = (loai: Vat['loai']): Vat => {
        let v = be.find((x) => !x.song && x.loai === loai);
        if (!v) {
          const m = loai === 'da' ? new THREE.Mesh(new THREE.IcosahedronGeometry(0.75, 1), daMat)
            : loai === 'rao' ? new THREE.Mesh(new THREE.CapsuleGeometry(0.28, 1.5, 8, 24), raoMat)
              : new THREE.Mesh(saoGeo, saoMat);
          if (loai === 'rao') m.rotation.z = Math.PI / 2;
          m.castShadow = loai !== 'sao';
          scene.add(m);
          v = { m, loai, lan: 0, z: 0, song: false };
          be.push(v);
        }
        v.song = true; v.m.visible = true;
        return v;
      };

      /* ── Trạng thái chơi ── */
      let lan = 1, x = 0, yNhay = 0, vNhay = 0, quang = 0, sao = 0, mang = 3, batTu = 0, tocDo = 13, zSinh = -30, vui = 0, xong = false;
      const t0 = performance.now();
      const doiLan = (d: number) => { if (!xong) lan = Math.max(0, Math.min(2, lan + d)); };
      const nhay = () => { if (!xong && yNhay <= 0.001) vNhay = 9.5; };
      const phim = (e: KeyboardEvent) => {
        if (['ArrowLeft', 'a', 'A'].includes(e.key)) doiLan(-1);
        else if (['ArrowRight', 'd', 'D'].includes(e.key)) doiLan(1);
        else if (['ArrowUp', 'w', 'W', ' '].includes(e.key)) { e.preventDefault(); nhay(); }
      };
      window.addEventListener('keydown', phim);
      let cham: { x: number; y: number } | null = null;
      const xuong = (e: PointerEvent) => { cham = { x: e.clientX, y: e.clientY }; };
      const len = (e: PointerEvent) => {
        if (!cham) return;
        const dx = e.clientX - cham.x, dy = e.clientY - cham.y; cham = null;
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) { nhay(); return; }
        if (Math.abs(dx) > Math.abs(dy)) doiLan(dx > 0 ? 1 : -1); else if (dy < 0) nhay();
      };
      canvas.addEventListener('pointerdown', xuong);
      canvas.addEventListener('pointerup', len);

      const doKhung = () => {
        const w = canvas.clientWidth, h = canvas.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
      };
      const ro = new ResizeObserver(doKhung); ro.observe(canvas); doKhung();

      const sinhHang = (z: number) => {
        // Mỗi hàng: 1–2 chướng ngại, luôn chừa ít nhất một làn trống; sao ở làn trống.
        const lanTrong = Math.floor(Math.random() * 3);
        for (let l = 0; l < 3; l++) {
          if (l === lanTrong) {
            if (Math.random() < 0.7) for (let k = 0; k < 3; k++) { const v = lay('sao'); v.lan = l; v.z = z - k * 1.6; }
            continue;
          }
          if (Math.random() < 0.55) { const v = lay(Math.random() < 0.45 ? 'rao' : 'da'); v.lan = l; v.z = z; }
        }
      };

      let truoc = performance.now(), raf = 0, demHud = 0;
      const khung = (bayGio: number) => {
        raf = requestAnimationFrame(khung);
        if (document.hidden) { truoc = bayGio; return; }
        const dt = Math.min(0.05, (bayGio - truoc) / 1000);
        truoc = bayGio;
        const t = (bayGio - t0) / 1000;
        if (!xong) {
          tocDo = Math.min(30, 13 + t * 0.18);
          quang += tocDo * dt;
        }
        const buoc = xong ? 0 : tocDo * dt;
        // Robot: trượt mượt sang làn đích, nhảy theo trọng lực, lắc khi chạy.
        x += (LAN[lan]! - x) * Math.min(1, dt * 12);
        vNhay -= 26 * dt; yNhay = Math.max(0, yNhay + vNhay * dt); if (yNhay === 0) vNhay = Math.max(0, vNhay);
        robot.position.set(x, yNhay + Math.abs(Math.sin(t * 12)) * (yNhay > 0 ? 0 : 0.08), 0);
        robot.rotation.z = (x - LAN[lan]!) * 0.25;
        dau.rotation.x = Math.sin(t * 12) * 0.05;
        tay[0]!.rotation.x = Math.sin(t * 12) * 0.9; tay[1]!.rotation.x = -Math.sin(t * 12) * 0.9;
        bong.position.set(x, 0.02, 0); (bong.material as T3.MeshBasicMaterial).opacity = 0.35 / (1 + yNhay);
        robot.visible = batTu <= 0 || Math.floor(batTu * 12) % 2 === 0;
        if (batTu > 0) batTu -= dt;
        if (vui > 0) { vui -= dt; if (vui <= 0) veMat(false); }
        angTen.scale.setScalar(1 + Math.sin(t * 8) * 0.15);

        for (const v of vach) { v.position.z += buoc; if (v.position.z > 12) v.position.z -= 160; }
        zSinh += buoc;
        while (zSinh > -110) { sinhHang(zSinh - 100); zSinh -= 9 + Math.random() * 5 - Math.min(4, t * 0.03); }
        for (const v of be) {
          if (!v.song) continue;
          v.z += buoc;
          v.m.position.set(LAN[v.lan]!, v.loai === 'sao' ? 0.9 + Math.sin(t * 4 + v.z) * 0.15 : v.loai === 'rao' ? 0.45 : 0.7, v.z);
          if (v.loai === 'sao') v.m.rotation.y += dt * 3; else if (v.loai === 'da') v.m.rotation.y += dt * 0.6;
          if (v.z > 10) { v.song = false; v.m.visible = false; continue; }
          // Va chạm (chỉ khi cùng làn và robot đã dời gần hết sang làn đó).
          if (Math.abs(v.z) < 0.8 && Math.abs(LAN[v.lan]! - x) < 0.9 && !xong) {
            if (v.loai === 'sao') { sao++; v.song = false; v.m.visible = false; vui = 0.6; veMat(true); continue; }
            const quaDuoc = v.loai === 'rao' ? yNhay > 0.75 : yNhay > 1.35;
            if (!quaDuoc && batTu <= 0) {
              mang--; batTu = 1.2; v.song = false; v.m.visible = false;
              if (mang <= 0) {
                xong = true;
                const diem = Math.round(quang) + sao * 25;
                setKetThuc(true);
                onScoreRef.current?.(diem, Math.round(t));
              }
            }
          }
        }
        camera.position.x += (x * 0.45 - camera.position.x) * Math.min(1, dt * 4);
        camera.lookAt(camera.position.x * 0.5, 1.2, -6);
        renderer.render(scene, camera);
        if ((demHud += dt) > 0.12) { demHud = 0; setHud({ m: Math.round(quang), sao, mang, tocDo: Math.round(tocDo * 3.6) }); }
      };
      raf = requestAnimationFrame(khung);

      donDep = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        window.removeEventListener('keydown', phim);
        canvas.removeEventListener('pointerdown', xuong);
        canvas.removeEventListener('pointerup', len);
        scene.traverse((o) => {
          const m = o as T3.Mesh;
          m.geometry?.dispose();
          const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
          for (const mt2 of mats) { for (const v of Object.values(mt2)) if (v instanceof THREE.Texture) v.dispose(); mt2.dispose(); }
        });
        renderer.dispose();
      };
    }).catch(() => setLoi(true));
    return () => { huy = true; donDep(); };
  }, []);

  return (
    <div className={s.goc}>
      <div className={s.hud}>
        <span className={s.chip}><b>{hud.m}</b> m</span>
        <span className={s.chip}><Star size={15} /> <b>{hud.sao}</b></span>
        <span className={s.chip}>{hud.tocDo} km/h</span>
        <span className={s.tim}>{[0, 1, 2].map((i) => <Heart key={i} size={18} data-con={i < hud.mang} />)}</span>
      </div>
      <div className={s.khung}>
        <canvas ref={canvasRef} className={s.canvas} />
        {loi && <div className={s.lop}>{vi ? 'Máy này chưa chạy được đồ hoạ 3D (WebGL).' : 'WebGL is not available on this device.'}</div>}
        {ketThuc && <div className={s.lop}><b>{hud.m + hud.sao * 25}</b><span>{vi ? 'điểm' : 'points'}</span></div>}
      </div>
      <p className={s.goiY}>{vi ? '←/→ hoặc A/D đổi làn · ↑/W/Space nhảy · màn cảm ứng: vuốt. Nhảy qua rào hồng; tránh đá pha lê; ăn sao +25.' : '←/→ or A/D to switch lanes · ↑/W/Space to jump · swipe on touch. Jump pink bars, dodge crystals, grab stars.'}</p>
    </div>
  );
}
