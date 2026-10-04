'use client';

/**
 * Màu chữ (Stroop) — luyện KIỂM SOÁT ỨC CHẾ: não đọc chữ tự động, nên chọn MÀU MỰC
 * của chữ "ĐỎ" tô xanh là phải ghìm phản xạ đọc lại (hiệu ứng Stroop, 1935).
 *
 * 60 giây. ~70% câu "lệch" (chữ ≠ màu), 30% "khớp" — khớp nhiều thì thành trò bấm
 * theo chữ. Cứ 12 câu đúng đổi luật một lần sang "chọn theo NGHĨA chữ" (rồi đổi về)
 * — luyện CHUYỂN LUẬT (task switching), có băng rôn báo rõ để không phải đoán.
 *
 * Nút trả lời chỉ là ô màu, KHÔNG có chữ — có chữ thì người chơi so chữ với chữ và
 * bài tập mất tác dụng. Đúng: 10 × hệ số chuỗi (3 đúng ×2, 8 ×3, 15 ×4); sai: mất chuỗi.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import type { GameProps } from './registry';
import s from './stroop.module.css';

const THOI_GIAN = 60;
const MAU = [
  { vi: 'ĐỎ', en: 'RED', hex: '#ef4444' },
  { vi: 'XANH', en: 'BLUE', hex: '#3b82f6' },
  { vi: 'VÀNG', en: 'YELLOW', hex: '#facc15' },
  { vi: 'LỤC', en: 'GREEN', hex: '#22c55e' },
  { vi: 'TÍM', en: 'PURPLE', hex: '#a855f7' },
];
type Cau = { chu: number; muc: number };
type Luat = 'muc' | 'nghia';

const ngauNhien = (n: number) => Math.floor(Math.random() * n);
function taoCau(truoc?: Cau): Cau {
  for (;;) {
    const chu = ngauNhien(MAU.length);
    const muc = Math.random() < 0.3 ? chu : (chu + 1 + ngauNhien(MAU.length - 1)) % MAU.length;
    if (!truoc || truoc.chu !== chu || truoc.muc !== muc) return { chu, muc };
  }
}
const heSo = (chuoi: number) => (chuoi >= 15 ? 4 : chuoi >= 8 ? 3 : chuoi >= 3 ? 2 : 1);

export default function StroopGame({ onScore, locale = 'vi' }: Partial<GameProps>) {
  const vi = locale === 'vi';
  const [cau, setCau] = useState<Cau>(() => taoCau());
  const [luat, setLuat] = useState<Luat>('muc');
  const [dung, setDung] = useState(0);
  const [sai, setSai] = useState(0);
  const [chuoi, setChuoi] = useState(0);
  const [diem, setDiem] = useState(0);
  const [con, setCon] = useState(THOI_GIAN);
  const [loe, setLoe] = useState<'dung' | 'sai' | null>(null);
  const [doiLuat, setDoiLuat] = useState(false);
  const [xong, setXong] = useState(false);
  const daBao = useRef(false);
  const henLoe = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (xong) return;
    const id = setInterval(() => setCon((c) => { if (c <= 1) { clearInterval(id); setXong(true); return 0; } return c - 1; }), 1000);
    return () => clearInterval(id);
  }, [xong]);

  useEffect(() => {
    if (!xong || daBao.current || !onScore) return;
    daBao.current = true;
    onScore(diem, THOI_GIAN);
  }, [xong, diem, onScore]);
  useEffect(() => () => clearTimeout(henLoe.current), []);

  const tra = useCallback((m: number) => {
    if (xong) return;
    const dapAn = luat === 'muc' ? cau.muc : cau.chu;
    if (m === dapAn) {
      const c = chuoi + 1;
      setChuoi(c);
      setDiem((d) => d + 10 * heSo(c));
      const dd = dung + 1;
      setDung(dd);
      setLoe('dung');
      if (dd % 12 === 0) { setLuat((l) => (l === 'muc' ? 'nghia' : 'muc')); setDoiLuat(true); setTimeout(() => setDoiLuat(false), 1400); }
    } else {
      setChuoi(0); setSai((x) => x + 1); setLoe('sai');
    }
    clearTimeout(henLoe.current);
    henLoe.current = setTimeout(() => setLoe(null), 220);
    setCau((c) => taoCau(c));
  }, [xong, luat, cau, chuoi, dung]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { const k = Number(e.key); if (k >= 1 && k <= MAU.length) tra(k - 1); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [tra]);

  const hs = heSo(chuoi);
  return (
    <div className={s.goc} data-luat={luat}>
      <div className={s.hud}>
        <div className={s.dongHo} data-gap={con <= 10}><b>{con}</b>s</div>
        <span className={s.thongSo}>{vi ? 'Điểm' : 'Score'} <b>{diem}</b></span>
        <span className={s.thongSo}>✓ <b>{dung}</b> · ✗ <b>{sai}</b></span>
        {hs > 1 && <span className={s.heSo} key={hs}>×{hs}</span>}
      </div>
      <div className={s.thanh}><i style={{ width: `${(con / THOI_GIAN) * 100}%` }} /></div>

      <div className={s.luat} data-doi={doiLuat}>
        {luat === 'muc'
          ? (vi ? 'Chọn MÀU MỰC của chữ' : 'Pick the INK colour')
          : (vi ? 'Đổi luật! Chọn theo NGHĨA của chữ' : 'Rule switch! Pick what the WORD says')}
      </div>

      <div className={s.the} data-loe={loe}>
        <span key={`${cau.chu}-${cau.muc}-${dung + sai}`} className={s.chu} style={{ color: MAU[cau.muc]!.hex }}>
          {vi ? MAU[cau.chu]!.vi : MAU[cau.chu]!.en}
        </span>
      </div>

      <div className={s.nut}>
        {MAU.map((m, i) => (
          <button key={m.hex} type="button" style={{ ['--m' as string]: m.hex }} onPointerDown={(e) => { e.preventDefault(); tra(i); }} aria-label={vi ? m.vi : m.en}>
            <kbd>{i + 1}</kbd>
          </button>
        ))}
      </div>
      <p className={s.goiY}>{vi ? 'Bấm ô màu (hoặc phím 1–5). Đúng liền tay để nhân điểm; sai mất chuỗi.' : 'Tap a colour (or keys 1–5). Build streaks to multiply; a miss resets it.'}</p>
    </div>
  );
}
