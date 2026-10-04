'use client';

/**
 * Bảng Schulte — luyện TẬP TRUNG và TẦM NHÌN NGOẠI VI (bài tập kinh điển của tâm lý
 * học, dùng để luyện đọc nhanh): bấm các số theo thứ tự tăng dần nhanh nhất có thể,
 * mắt giữ ở chấm giữa bảng thay vì đảo khắp nơi.
 *
 * Ván 3 vòng: 4×4 → 5×5 → 6×6. Bấm sai cộng 1 giây phạt (không dừng vòng — bấm bừa
 * phải tốn hơn bấm cẩn thận). Điểm mỗi vòng = số ô × 600 / số giây (nhanh gấp đôi
 * thì điểm gấp đôi); cộng 3 vòng, báo một lần.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Timer } from 'lucide-react';
import type { GameProps } from './registry';
import s from './schulte.module.css';

const VONG = [4, 5, 6];
const PHAT_S = 1;

const tron = (n: number) => { const a = Array.from({ length: n }, (_, i) => i + 1); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j]!, a[i]!]; } return a; };

export default function SchulteGame({ onScore, locale = 'vi' }: Partial<GameProps>) {
  const vi = locale === 'vi';
  const [vong, setVong] = useState(0);
  const kich = VONG[vong]!;
  const so = useMemo(() => tron(kich * kich), [kich]);
  const [can, setCan] = useState(1);
  const [phat, setPhat] = useState(0);
  const [sai, setSai] = useState<number | null>(null);
  const [batDau, setBatDau] = useState(() => performance.now());
  const [bayGio, setBayGio] = useState(performance.now());
  const [diem, setDiem] = useState(0);
  const [ketVong, setKetVong] = useState<string[]>([]);
  const [nghi, setNghi] = useState(false);
  const t0 = useRef(Date.now());
  const daBao = useRef(false);

  useEffect(() => {
    let raf = 0;
    const vong2 = () => { setBayGio(performance.now()); raf = requestAnimationFrame(vong2); };
    raf = requestAnimationFrame(vong2);
    return () => cancelAnimationFrame(raf);
  }, []);

  const giay = nghi ? 0 : (bayGio - batDau) / 1000 + phat;

  const bam = (x: number) => {
    if (nghi) return;
    if (x !== can) {
      setPhat((p) => p + PHAT_S);
      setSai(x);
      setTimeout(() => setSai((v) => (v === x ? null : v)), 300);
      return;
    }
    const tiep = can + 1;
    setCan(tiep);
    if (tiep <= kich * kich) return;
    const tg = (performance.now() - batDau) / 1000 + phat;
    const cong = Math.round((kich * kich * 600) / Math.max(1, tg));
    const tong = diem + cong;
    setDiem(tong);
    setKetVong((k) => [...k, `${kich}×${kich}: ${tg.toFixed(1)}s (+${cong})`]);
    if (vong + 1 >= VONG.length) {
      setNghi(true);
      if (!daBao.current && onScore) { daBao.current = true; onScore(tong, Math.round((Date.now() - t0.current) / 1000)); }
      return;
    }
    setNghi(true);
    setTimeout(() => { setVong(vong + 1); setCan(1); setPhat(0); setNghi(false); setBatDau(performance.now()); }, 1600);
  };

  return (
    <div className={s.goc}>
      <div className={s.hud}>
        <div className={s.dongHo}><Timer size={18} /> <b>{giay.toFixed(1)}</b>s</div>
        <div className={s.can}>{vi ? 'Tìm số' : 'Find'} <b key={can}>{can <= kich * kich ? can : '✓'}</b></div>
        <div className={s.phu}>
          <span>{vi ? 'Vòng' : 'Round'} <b>{vong + 1}/{VONG.length}</b></span>
          <span>{vi ? 'Điểm' : 'Score'} <b>{diem}</b></span>
        </div>
      </div>
      <div className={s.ban} style={{ ['--n' as string]: kich }} data-nghi={nghi}>
        {so.map((x, i) => (
          <button
            key={`${kich}-${x}`}
            type="button"
            className={s.o}
            style={{ ['--hue' as string]: (i * 47) % 360 }}
            data-xong={x < can}
            data-sai={sai === x}
            onPointerDown={(e) => { e.preventDefault(); bam(x); }}
          >
            {x}
          </button>
        ))}
        <span className={s.tam} aria-hidden="true" />
        {nghi && ketVong.length > 0 && (
          <div className={s.lop}>
            <b>{vong + 1 >= VONG.length && ketVong.length === VONG.length ? (vi ? 'Hoàn thành!' : 'Done!') : (vi ? 'Tốt lắm!' : 'Nice!')}</b>
            {ketVong.map((k) => <span key={k}>{k}</span>)}
          </div>
        )}
      </div>
      <p className={s.goiY}>
        {vi ? 'Giữ mắt ở chấm giữa, dùng tầm nhìn ngoại vi để tìm số. Bấm sai +1 giây.' : 'Keep your eyes on the centre dot and use peripheral vision. Wrong tap = +1s.'}
      </p>
    </div>
  );
}
