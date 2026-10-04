'use client';

/**
 * 2048 — chiến lược gộp số. Trượt cả bảng; hai ô cùng số chạm nhau thì gộp.
 *
 * Mỗi ô là một ĐỐI TƯỢNG có id riêng, vẽ bằng `transform: translate` theo hàng/cột —
 * nhờ vậy CSS tự trượt mượt từ chỗ cũ sang chỗ mới (vẽ lại theo mảng 4×4 thì ô
 * "nhảy" chứ không trượt). Ô vừa gộp nảy lên, ô mới mọc ra.
 *
 * Điểm = tổng giá trị các lần gộp (luật gốc). Hết nước đi ⇒ báo điểm một lần.
 * Chạm 2048 có màn mừng nhưng được chơi tiếp.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Trophy } from 'lucide-react';
import type { GameProps } from './registry';
import s from './game2048.module.css';

type O = { id: number; v: number; r: number; c: number; moi?: boolean; gop?: boolean; xoa?: boolean };
type Huong = 'trai' | 'phai' | 'len' | 'xuong';
const N = 4;
let demId = 1;

function themNgauNhien(ds: O[]): O[] {
  const trong: [number, number][] = [];
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (!ds.some((o) => !o.xoa && o.r === r && o.c === c)) trong.push([r, c]);
  if (!trong.length) return ds;
  const [r, c] = trong[Math.floor(Math.random() * trong.length)]!;
  return [...ds, { id: demId++, v: Math.random() < 0.9 ? 2 : 4, r, c, moi: true }];
}

/** Trượt theo một hướng. Trả về bảng mới, điểm cộng, và có gì di chuyển không. */
function truot(ds0: O[], h: Huong): { ds: O[]; cong: number; doi: boolean } {
  const ds = ds0.filter((o) => !o.xoa).map((o) => ({ ...o, moi: false, gop: false }));
  let cong = 0, doi = false;
  const ra: O[] = [];
  for (let k = 0; k < N; k++) {
    // Lấy một hàng/cột theo thứ tự "đầu" của hướng trượt.
    const dong = ds
      .filter((o) => (h === 'trai' || h === 'phai' ? o.r === k : o.c === k))
      .sort((a, b) => {
        const ka = h === 'trai' || h === 'phai' ? a.c : a.r;
        const kb = h === 'trai' || h === 'phai' ? b.c : b.r;
        return h === 'trai' || h === 'len' ? ka - kb : kb - ka;
      });
    let viTri = 0;
    for (let i = 0; i < dong.length; i++) {
      const o = dong[i]!;
      const sau = dong[i + 1];
      const dat = (x: O, p: number) => {
        const col = h === 'trai' ? p : h === 'phai' ? N - 1 - p : x.c;
        const row = h === 'len' ? p : h === 'xuong' ? N - 1 - p : x.r;
        if (x.r !== row || x.c !== col) doi = true;
        x.r = row; x.c = col;
      };
      if (sau && sau.v === o.v) {
        dat(o, viTri); dat(sau, viTri);
        o.xoa = true; sau.xoa = true; // hai ô cũ trượt vào chỗ rồi biến mất…
        const gop: O = { id: demId++, v: o.v * 2, r: o.r, c: o.c, gop: true }; // …ô mới nảy lên
        ra.push(o, sau, gop);
        cong += gop.v; doi = true; i++;
      } else {
        dat(o, viTri);
        ra.push(o);
      }
      viTri++;
    }
  }
  return { ds: ra, cong, doi };
}

function conNuoc(ds: O[]): boolean {
  const song = ds.filter((o) => !o.xoa);
  if (song.length < N * N) return true;
  const o = (r: number, c: number) => song.find((x) => x.r === r && x.c === c)?.v;
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (o(r, c) === o(r, c + 1) || o(r, c) === o(r + 1, c)) return true;
  return false;
}

const MAU: Record<number, [string, string]> = {
  2: ['#312e81', '#c7d2fe'], 4: ['#3730a3', '#e0e7ff'], 8: ['#7c3aed', '#fff'], 16: ['#9333ea', '#fff'],
  32: ['#c026d3', '#fff'], 64: ['#db2777', '#fff'], 128: ['#f59e0b', '#fff'], 256: ['#f97316', '#fff'],
  512: ['#ef4444', '#fff'], 1024: ['#10b981', '#fff'], 2048: ['#facc15', '#422006'],
};

export default function Game2048({ onScore, locale = 'vi' }: Partial<GameProps>) {
  const vi = locale === 'vi';
  const [ds, setDs] = useState<O[]>(() => themNgauNhien(themNgauNhien([])));
  const [diem, setDiem] = useState(0);
  const [congNoi, setCongNoi] = useState<{ v: number; k: number } | null>(null);
  const [het, setHet] = useState(false);
  const [mung, setMung] = useState(false);
  const daMung = useRef(false);
  const daBao = useRef(false);
  const t0 = useRef(Date.now());
  const best = useRef(0);
  try { best.current = Math.max(best.current, Number(localStorage.getItem('game:2048:best') || 0)); } catch { /* bỏ qua */ }

  // Bảng hiện tại qua ref: tính nước đi NGOÀI hàm cập nhật state (hàm cập nhật phải thuần —
  // gọi setDiem trong đó thì StrictMode chạy hai lần và cộng điểm gấp đôi).
  const dsRef = useRef(ds);
  dsRef.current = ds;
  const di = useCallback((h: Huong) => {
    if (het) return;
    const kq = truot(dsRef.current, h);
    if (!kq.doi) return;
    const moi = themNgauNhien(kq.ds);
    dsRef.current = moi;
    setDs(moi);
    if (kq.cong) {
      setDiem((d) => d + kq.cong);
      setCongNoi({ v: kq.cong, k: Date.now() });
    }
    if (!daMung.current && moi.some((o) => !o.xoa && o.v >= 2048)) { daMung.current = true; setMung(true); }
    if (!conNuoc(moi)) setHet(true);
  }, [het]);

  // Dọn ô đã gộp sau khi hoạt cảnh trượt xong — không thì mảng phình mãi.
  useEffect(() => {
    if (!ds.some((o) => o.xoa)) return;
    const t = setTimeout(() => setDs((x) => x.filter((o) => !o.xoa)), 160);
    return () => clearTimeout(t);
  }, [ds]);

  useEffect(() => {
    if (!het || daBao.current) return;
    daBao.current = true;
    try { if (diem > best.current) localStorage.setItem('game:2048:best', String(diem)); } catch { /* bỏ qua */ }
    onScore?.(diem, Math.round((Date.now() - t0.current) / 1000));
  }, [het, diem, onScore]);

  useEffect(() => {
    const m: Record<string, Huong> = { ArrowLeft: 'trai', ArrowRight: 'phai', ArrowUp: 'len', ArrowDown: 'xuong', a: 'trai', d: 'phai', w: 'len', s: 'xuong' };
    const h = (e: KeyboardEvent) => { const x = m[e.key]; if (x) { e.preventDefault(); di(x); } };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [di]);

  // Vuốt trên màn cảm ứng / kéo chuột.
  const cham = useRef<{ x: number; y: number } | null>(null);
  const batDauVuot = (e: React.PointerEvent) => { cham.current = { x: e.clientX, y: e.clientY }; };
  const ketVuot = (e: React.PointerEvent) => {
    const a = cham.current; cham.current = null;
    if (!a) return;
    const dx = e.clientX - a.x, dy = e.clientY - a.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
    di(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'phai' : 'trai') : (dy > 0 ? 'xuong' : 'len'));
  };

  const lon = ds.filter((o) => !o.xoa).reduce((m, o) => Math.max(m, o.v), 0);
  return (
    <div className={s.goc}>
      <div className={s.hud}>
        <div className={s.tieuDe}>2048</div>
        <div className={s.hop}><span>{vi ? 'Điểm' : 'Score'}</span><b>{diem}</b>{congNoi && <i key={congNoi.k} className={s.bay}>+{congNoi.v}</i>}</div>
        <div className={s.hop}><span>{vi ? 'Kỷ lục máy' : 'Best'}</span><b>{Math.max(best.current, diem)}</b></div>
        <div className={s.hop}><span>{vi ? 'Ô lớn nhất' : 'Top tile'}</span><b>{lon}</b></div>
      </div>
      <div className={s.ban} onPointerDown={batDauVuot} onPointerUp={ketVuot} style={{ touchAction: 'none' }}>
        {Array.from({ length: N * N }, (_, i) => <div key={i} className={s.nen} />)}
        {ds.map((o) => {
          const [nen, chu] = MAU[o.v] ?? ['#0f172a', '#facc15'];
          return (
            <div
              key={o.id}
              className={s.o}
              data-moi={o.moi}
              data-gop={o.gop}
              data-xoa={o.xoa}
              style={{ ['--r' as string]: o.r, ['--c' as string]: o.c, ['--nen' as string]: nen, color: chu, zIndex: o.xoa ? 1 : 2 }}
            >
              <span style={{ fontSize: o.v >= 1024 ? '0.62em' : o.v >= 128 ? '0.78em' : '1em' }}>{o.v}</span>
            </div>
          );
        })}
        {mung && (
          <div className={s.lop}>
            <Trophy size={44} />
            <b>2048!</b>
            <button type="button" onClick={() => setMung(false)}>{vi ? 'Chơi tiếp để phá kỷ lục' : 'Keep going'}</button>
          </div>
        )}
      </div>
      <p className={s.goiY}>{vi ? 'Phím mũi tên / WASD, hoặc vuốt. Gộp hai ô cùng số để lên 2048.' : 'Arrow keys / WASD or swipe. Merge equal tiles to reach 2048.'}</p>
    </div>
  );
}
