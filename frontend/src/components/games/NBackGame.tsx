'use client';

/**
 * N-back kép — luyện TRÍ NHỚ LÀM VIỆC (dual n-back, Jaeggi 2008: bài tập trí nhớ
 * làm việc được nghiên cứu nhiều nhất).
 *
 * Mỗi lượt: một ô trên lưới 3×3 sáng (bỏ ô giữa — 8 vị trí) KÈM một chữ cái (hiện
 * trong ô và đọc to nếu máy có giọng). Bấm "Vị trí" khi ô trùng ô của N lượt trước,
 * "Chữ" khi chữ trùng. Một ván 3 khối; mỗi khối 20 + N lượt.
 *
 * Tự điều chỉnh như bản chuẩn: khối đạt ≥ 85% ⇒ N + 1; < 60% ⇒ N − 1 (tối thiểu 1).
 * Chấm theo hit/false-alarm của TỪNG kênh: bỏ lỡ một lần trùng và bấm bừa khi không
 * trùng đều trừ — không thể ăn điểm bằng cách bấm liên tục.
 *
 * Điểm = Σ khối round(N × độ chính xác × 300). Báo một lần khi xong 3 khối.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { MapPin, Type, Volume2, VolumeX } from 'lucide-react';
import type { GameProps } from './registry';
import s from './nBack.module.css';

const VI_TRI = [0, 1, 2, 3, 5, 6, 7, 8]; // ô của lưới 3×3, bỏ ô giữa
const CHU = ['C', 'H', 'K', 'L', 'Q', 'R', 'S', 'T']; // phụ âm đọc to dễ phân biệt
const SO_KHOI = 3;
const NHIP_MS = 2600;
const HIEN_MS = 700;

type Luot = { o: number; chu: string };
type Ket = { trungViTri: boolean; trungChu: boolean; bamViTri: boolean; bamChu: boolean };

/** Sinh dãy có ~30% trùng mỗi kênh (độc lập), phần còn lại cố ý KHÔNG trùng. */
function sinhKhoi(n: number): Luot[] {
  const dai = 20 + n;
  const d: Luot[] = [];
  for (let i = 0; i < dai; i++) {
    const coTruoc = i >= n;
    const oTruoc = coTruoc ? d[i - n]!.o : -1;
    const chuTruoc = coTruoc ? d[i - n]!.chu : '';
    const trungO = coTruoc && Math.random() < 0.3;
    const trungChu = coTruoc && Math.random() < 0.3;
    const chonKhac = <T,>(ds: T[], tranh: T) => { let x: T; do x = ds[Math.floor(Math.random() * ds.length)]!; while (x === tranh); return x; };
    d.push({ o: trungO ? oTruoc : chonKhac(VI_TRI, oTruoc), chu: trungChu ? chuTruoc : chonKhac(CHU, chuTruoc) });
  }
  return d;
}

export default function NBackGame({ onScore, locale = 'vi' }: Partial<GameProps>) {
  const vi = locale === 'vi';
  const [n, setN] = useState(2);
  const [khoi, setKhoi] = useState(1);
  const [day, setDay] = useState<Luot[]>(() => sinhKhoi(2));
  const [i, setI] = useState(-1);
  const [hien, setHien] = useState(false);
  const [bamVT, setBamVT] = useState(false);
  const [bamC, setBamC] = useState(false);
  const [phanHoi, setPhanHoi] = useState<{ vt?: 'dung' | 'sai'; c?: 'dung' | 'sai' }>({});
  const [diem, setDiem] = useState(0);
  const [tongKet, setTongKet] = useState<string | null>(null);
  const [nCao, setNCao] = useState(2);
  const [tat, setTat] = useState(() => { try { return localStorage.getItem('game:tieng') === '0'; } catch { return false; } });

  const ket = useRef<Ket[]>([]);
  const bamRef = useRef({ vt: false, c: false });
  const t0 = useRef(Date.now());
  const daBao = useRef(false);
  const hen = useRef<ReturnType<typeof setTimeout>[]>([]);
  const sau = (ms: number, f: () => void) => { hen.current.push(setTimeout(f, ms)); };

  const doc = useCallback((c: string) => {
    if (tat) return;
    try {
      const u = new SpeechSynthesisUtterance(c);
      u.lang = 'en-US';
      u.rate = 1.1;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch { /* không giọng: chữ vẫn hiện trong ô */ }
  }, [tat]);

  /** Chấm lượt vừa xong (đọc từ ref — trạng thái bấm có thể đổi ngay trước mốc). */
  const cham = useCallback((idx: number, d: Luot[], nn: number) => {
    if (idx < 0) return;
    const coTruoc = idx >= nn;
    const tVT = coTruoc && d[idx]!.o === d[idx - nn]!.o;
    const tC = coTruoc && d[idx]!.chu === d[idx - nn]!.chu;
    ket.current.push({ trungViTri: tVT, trungChu: tC, bamViTri: bamRef.current.vt, bamChu: bamRef.current.c });
  }, []);

  // Nhịp chính: mỗi NHIP_MS một lượt mới.
  useEffect(() => {
    if (tongKet !== null && i === -1) return; // đang xem tổng kết khối
    const id = setTimeout(() => {
      cham(i, day, n);
      const tiep = i + 1;
      if (tiep >= day.length) { xongKhoi(); return; }
      bamRef.current = { vt: false, c: false };
      setBamVT(false); setBamC(false); setPhanHoi({});
      setI(tiep);
      setHien(true);
      doc(day[tiep]!.chu);
      sau(HIEN_MS, () => setHien(false));
    }, i === -1 ? 1200 : NHIP_MS);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, day, n, tongKet]);

  useEffect(() => () => { for (const h of hen.current) clearTimeout(h); try { window.speechSynthesis.cancel(); } catch { /* bỏ qua */ } }, []);

  function xongKhoi() {
    const k = ket.current;
    // Độ chính xác kiểu "đúng mọi quyết định": mỗi lượt có 2 quyết định (bấm/không bấm).
    let dung = 0;
    for (const x of k) { if (x.trungViTri === x.bamViTri) dung++; if (x.trungChu === x.bamChu) dung++; }
    const tl = k.length ? dung / (k.length * 2) : 0;
    const cong = Math.round(n * tl * 300);
    const moi = diem + cong;
    setDiem(moi);
    const nMoi = tl >= 0.85 ? n + 1 : tl < 0.6 ? Math.max(1, n - 1) : n;
    const loi = vi
      ? `Khối ${khoi}: đúng ${Math.round(tl * 100)}% ở ${n}-back · +${cong} điểm${nMoi > n ? ' · Lên ' + nMoi + '-back!' : nMoi < n ? ' · Lùi về ' + nMoi + '-back' : ''}`
      : `Block ${khoi}: ${Math.round(tl * 100)}% at ${n}-back · +${cong}${nMoi > n ? ' · Up to ' + nMoi + '-back!' : nMoi < n ? ' · Down to ' + nMoi + '-back' : ''}`;
    ket.current = [];
    setI(-1);
    if (khoi >= SO_KHOI) {
      setTongKet(loi);
      if (!daBao.current && onScore) { daBao.current = true; onScore(moi, Math.round((Date.now() - t0.current) / 1000)); }
      return;
    }
    setTongKet(loi);
    setNCao((x) => Math.max(x, nMoi));
    sau(2600, () => { setN(nMoi); setKhoi(khoi + 1); setDay(sinhKhoi(nMoi)); setTongKet(null); });
  }

  const bam = useCallback((kenh: 'vt' | 'c') => {
    if (i < n || i < 0) return; // chưa đủ N lượt thì chưa có gì để so
    if (kenh === 'vt' ? bamRef.current.vt : bamRef.current.c) return;
    bamRef.current[kenh] = true;
    const dung = kenh === 'vt' ? day[i]!.o === day[i - n]!.o : day[i]!.chu === day[i - n]!.chu;
    if (kenh === 'vt') setBamVT(true); else setBamC(true);
    setPhanHoi((p) => ({ ...p, [kenh]: dung ? 'dung' : 'sai' }));
  }, [i, n, day]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') bam('vt');
      if (e.key === 'l' || e.key === 'L' || e.key === 'ArrowRight') bam('c');
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [bam]);

  const luot = day[i];
  const doiTieng = () => setTat((x) => { try { localStorage.setItem('game:tieng', x ? '1' : '0'); } catch { /* bỏ qua */ } return !x; });

  return (
    <div className={s.goc}>
      <div className={s.hud}>
        <div className={s.nBadge}><b>{n}</b>-back</div>
        <div className={s.thongSo}>
          <span>{vi ? 'Khối' : 'Block'} <b>{khoi}/{SO_KHOI}</b></span>
          <span>{vi ? 'Điểm' : 'Score'} <b>{diem}</b></span>
          <span>{vi ? 'N cao nhất' : 'Best N'} <b>{nCao}</b></span>
        </div>
        <button type="button" className={s.nutTieng} onClick={doiTieng} aria-label={tat ? 'Bật tiếng' : 'Tắt tiếng'}>
          {tat ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>

      <div className={s.thanh}><i style={{ width: `${Math.max(0, ((i + 1) / day.length) * 100)}%` }} /></div>

      <div className={s.ban}>
        {Array.from({ length: 9 }, (_, o) => (
          <div key={o} className={s.o} data-giua={o === 4} data-sang={hien && luot?.o === o}>
            {hien && luot?.o === o && <span className={s.chu}>{luot.chu}</span>}
            {o === 4 && <span className={s.tam} />}
          </div>
        ))}
        {tongKet !== null && (
          <div className={s.tongKet}>
            <p>{tongKet}</p>
            {khoi < SO_KHOI && <small>{vi ? 'Khối tiếp theo bắt đầu ngay…' : 'Next block starting…'}</small>}
          </div>
        )}
      </div>

      <div className={s.nut2}>
        <button type="button" className={s.nut} data-kq={phanHoi.vt} data-da={bamVT} onPointerDown={(e) => { e.preventDefault(); bam('vt'); }}>
          <MapPin size={20} /> {vi ? 'Vị trí trùng' : 'Position'} <kbd>A</kbd>
        </button>
        <button type="button" className={s.nut} data-kq={phanHoi.c} data-da={bamC} onPointerDown={(e) => { e.preventDefault(); bam('c'); }}>
          <Type size={20} /> {vi ? 'Chữ trùng' : 'Letter'} <kbd>L</kbd>
        </button>
      </div>
      <p className={s.goiY}>
        {vi
          ? `So với ${n} lượt TRƯỚC: ô sáng giống ⇒ "Vị trí", chữ giống ⇒ "Chữ". Không giống thì đừng bấm.`
          : `Compare with ${n} turns BACK: same square ⇒ Position, same letter ⇒ Letter. Otherwise don't press.`}
      </p>
    </div>
  );
}
