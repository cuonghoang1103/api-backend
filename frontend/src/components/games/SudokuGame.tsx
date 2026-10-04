'use client';

/**
 * Sudoku — đề sinh tại chỗ, LUÔN đúng một lời giải.
 *
 * Sinh: điền kín lưới bằng quay lui với thứ tự chữ số xáo trộn, rồi khoét dần từng ô
 * (thứ tự ngẫu nhiên); mỗi lần khoét đếm nghiệm tới 2 — ra 2 nghiệm thì trả ô lại.
 * Số ô gợi ý theo mức: Dễ 40 · Vừa 33 · Khó 28 · Siêu khó 24.
 *
 * Chơi: tô hàng/cột/khối của ô chọn + mọi ô cùng số; ô điền trùng luật tô đỏ; ghi nháp
 * (bút chì, phím N); gợi ý điền đúng ô đang chọn; hoàn tác. Sai 3 lần thì thua.
 * Điểm = gốc theo mức − thời gian − 150/lỗi − 250/gợi ý (tối thiểu 100), báo một lần.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Eraser, Lightbulb, Pencil, Undo2, Heart } from 'lucide-react';
import type { GameProps } from './registry';
import s from './sudoku.module.css';

type Muc = 'de' | 'vua' | 'kho' | 'sieu';
const MUC: Record<Muc, { ten: string; en: string; goiY: number; goc: number }> = {
  de: { ten: 'Dễ', en: 'Easy', goiY: 40, goc: 1200 },
  vua: { ten: 'Vừa', en: 'Medium', goiY: 33, goc: 2200 },
  kho: { ten: 'Khó', en: 'Hard', goiY: 28, goc: 3500 },
  sieu: { ten: 'Siêu khó', en: 'Expert', goiY: 24, goc: 5000 },
};
const MANG = 3;

const coDuoc = (g: number[], i: number, v: number) => {
  const r = Math.floor(i / 9), c = i % 9;
  for (let k = 0; k < 9; k++) if (g[r * 9 + k] === v || g[k * 9 + c] === v) return false;
  const br = r - (r % 3), bc = c - (c % 3);
  for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) if (g[(br + a) * 9 + bc + b] === v) return false;
  return true;
};
const tron = (a: number[]) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j]!, a[i]!]; } return a; };

function dienKin(g: number[]): boolean {
  const i = g.indexOf(0);
  if (i < 0) return true;
  for (const v of tron([1, 2, 3, 4, 5, 6, 7, 8, 9])) {
    if (coDuoc(g, i, v)) { g[i] = v; if (dienKin(g)) return true; g[i] = 0; }
  }
  return false;
}
/** Đếm nghiệm, dừng ở `tran` — chọn ô ít khả năng nhất trước cho nhanh. */
function demNghiem(g: number[], tran = 2): number {
  let best = -1, bestN = 10;
  for (let i = 0; i < 81; i++) {
    if (g[i]) continue;
    let n = 0;
    for (let v = 1; v <= 9; v++) if (coDuoc(g, i, v)) n++;
    if (n < bestN) { best = i; bestN = n; if (n <= 1) break; }
  }
  if (best < 0) return 1;
  let dem = 0;
  for (let v = 1; v <= 9 && dem < tran; v++) {
    if (!coDuoc(g, best, v)) continue;
    g[best] = v; dem += demNghiem(g, tran - dem); g[best] = 0;
  }
  return dem;
}
function sinhDe(soGoiY: number): { de: number[]; giai: number[] } {
  const giai = new Array<number>(81).fill(0);
  dienKin(giai);
  const de = [...giai];
  let con = 81;
  for (const i of tron(Array.from({ length: 81 }, (_, k) => k))) {
    if (con <= soGoiY) break;
    const cu = de[i]!;
    de[i] = 0;
    if (demNghiem([...de]) !== 1) de[i] = cu; else con--;
  }
  return { de, giai };
}

type Buoc = { i: number; v: number; nhap: number[] };

export default function SudokuGame({ onScore, locale = 'vi' }: Partial<GameProps>) {
  const vi = locale === 'vi';
  const [muc, setMuc] = useState<Muc | null>(null);
  const [cau, setCau] = useState<{ de: number[]; giai: number[] } | null>(null);
  const [o, setO] = useState<number[]>([]);
  const [nhap, setNhap] = useState<number[][]>([]); // ghi nháp: bitmask kiểu mảng số
  const [chon, setChon] = useState(-1);
  const [butChi, setButChi] = useState(false);
  const [loi, setLoi] = useState(0);
  const [goiYDung, setGoiYDung] = useState(0);
  const [lichSu, setLichSu] = useState<Buoc[]>([]);
  const [giay, setGiay] = useState(0);
  const [xong, setXong] = useState<'thang' | 'thua' | null>(null);
  const [saiO, setSaiO] = useState(-1);
  const daBao = useRef(false);

  const batDau = (m: Muc) => {
    setMuc(m);
    // Sinh đề có thể mất ~50–200 ms ở mức khó — để trình duyệt vẽ màn "đang tạo" trước.
    setTimeout(() => {
      const c = sinhDe(MUC[m].goiY);
      setCau(c); setO([...c.de]); setNhap(Array.from({ length: 81 }, () => []));
    }, 30);
  };

  useEffect(() => {
    if (!cau || xong) return;
    const id = setInterval(() => setGiay((g) => g + 1), 1000);
    return () => clearInterval(id);
  }, [cau, xong]);

  const ketThuc = useCallback((kq: 'thang' | 'thua', loiCuoi: number) => {
    setXong(kq);
    if (daBao.current || !onScore || !muc) return;
    daBao.current = true;
    const diem = kq === 'thang' ? Math.max(100, MUC[muc].goc - giay * 2 - loiCuoi * 150 - goiYDung * 250) : 0;
    onScore(diem, giay);
  }, [onScore, muc, giay, goiYDung]);

  const dien = useCallback((v: number) => {
    if (!cau || xong || chon < 0 || cau.de[chon]) return;
    if (butChi && v) {
      setNhap((n) => { const m = [...n]; const x = m[chon]!; m[chon] = x.includes(v) ? x.filter((y) => y !== v) : [...x, v].sort(); return m; });
      return;
    }
    if (o[chon] === v) return;
    setLichSu((l) => [...l, { i: chon, v: o[chon]!, nhap: nhap[chon]! }]);
    const moi = [...o]; moi[chon] = v; setO(moi);
    setNhap((n) => {
      const m = [...n]; m[chon] = [];
      // Điền đúng một số ⇒ gạch số đó khỏi nháp của hàng/cột/khối (đỡ phải dọn tay).
      if (v) for (let k = 0; k < 81; k++) if (k !== chon && (Math.floor(k / 9) === Math.floor(chon / 9) || k % 9 === chon % 9 || (Math.floor(k / 27) === Math.floor(chon / 27) && Math.floor((k % 9) / 3) === Math.floor((chon % 9) / 3)))) m[k] = m[k]!.filter((y) => y !== v);
      return m;
    });
    if (v && v !== cau.giai[chon]) {
      const l = loi + 1; setLoi(l); setSaiO(chon); setTimeout(() => setSaiO(-1), 500);
      if (l >= MANG) ketThuc('thua', l);
      return;
    }
    if (v && moi.every((x, k) => x === cau.giai[k])) ketThuc('thang', loi);
  }, [cau, xong, chon, butChi, o, nhap, loi, ketThuc]);

  const hoanTac = () => {
    const b = lichSu[lichSu.length - 1];
    if (!b || xong) return;
    setLichSu((l) => l.slice(0, -1));
    setO((x) => { const m = [...x]; m[b.i] = b.v; return m; });
    setNhap((n) => { const m = [...n]; m[b.i] = b.nhap; return m; });
    setChon(b.i);
  };
  const goiY = () => {
    if (!cau || xong) return;
    let i = chon >= 0 && o[chon] !== cau.giai[chon] ? chon : o.findIndex((x, k) => x !== cau.giai[k]);
    if (i < 0) return;
    setGoiYDung((g) => g + 1);
    setChon(i);
    const moi = [...o]; moi[i] = cau.giai[i]!; setO(moi);
    if (moi.every((x, k) => x === cau.giai[k])) ketThuc('thang', loi);
  };

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (!cau) return;
      const k = Number(e.key);
      if (k >= 1 && k <= 9) { dien(k); return; }
      if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') { dien(0); return; }
      if (e.key === 'n' || e.key === 'N') { setButChi((b) => !b); return; }
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') { hoanTac(); return; }
      const d: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -9, ArrowDown: 9 };
      if (d[e.key] !== undefined) { e.preventDefault(); setChon((c) => (c < 0 ? 40 : Math.min(80, Math.max(0, c + d[e.key]!)))); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  });

  const conLai = useMemo(() => {
    const d = new Array(10).fill(9) as number[];
    for (let i = 0; i < o.length; i++) if (o[i] && cau && o[i] === cau.giai[i]) d[o[i]!]--;
    return d;
  }, [o, cau]);

  if (!muc) {
    return (
      <div className={s.goc}>
        <h3 className={s.chonTieuDe}>{vi ? 'Chọn độ khó' : 'Choose difficulty'}</h3>
        <div className={s.chonMuc}>
          {(Object.keys(MUC) as Muc[]).map((m, i) => (
            <button key={m} type="button" onClick={() => batDau(m)} style={{ ['--i' as string]: i }}>
              <b>{vi ? MUC[m].ten : MUC[m].en}</b>
              <span>{MUC[m].goiY} {vi ? 'ô gợi ý' : 'givens'}</span>
              <small>{'★'.repeat(i + 1)}</small>
            </button>
          ))}
        </div>
      </div>
    );
  }
  if (!cau) return <div className={s.goc}><p className={s.dangTao}>{vi ? 'Đang tạo đề có lời giải duy nhất…' : 'Generating a unique puzzle…'}</p></div>;

  const vChon = chon >= 0 ? o[chon] : 0;
  const cungVung = (k: number) => chon >= 0 && (Math.floor(k / 9) === Math.floor(chon / 9) || k % 9 === chon % 9 || (Math.floor(k / 27) === Math.floor(chon / 27) && Math.floor((k % 9) / 3) === Math.floor((chon % 9) / 3)));
  const trung = (k: number) => !!o[k] && o[k] !== cau.giai[k];

  return (
    <div className={s.goc}>
      <div className={s.hud}>
        <span className={s.chip}>{vi ? MUC[muc].ten : MUC[muc].en}</span>
        <span className={s.chip}>⏱ <b>{Math.floor(giay / 60)}:{String(giay % 60).padStart(2, '0')}</b></span>
        <span className={s.tim}>{Array.from({ length: MANG }, (_, i) => <Heart key={i} size={16} data-con={i < MANG - loi} />)}</span>
        {goiYDung > 0 && <span className={s.chip}>💡 {goiYDung}</span>}
      </div>

      <div className={s.luoi} data-xong={xong ?? undefined}>
        {o.map((v, k) => (
          <button
            key={k}
            type="button"
            className={s.o}
            data-goc={!!cau.de[k]}
            data-chon={k === chon}
            data-vung={cungVung(k)}
            data-cungso={!!vChon && v === vChon}
            data-sai={trung(k)}
            data-rung={k === saiO}
            data-phai={k % 9 === 2 || k % 9 === 5}
            data-duoi={Math.floor(k / 9) === 2 || Math.floor(k / 9) === 5}
            onClick={() => setChon(k)}
          >
            {v ? <span className={s.so}>{v}</span> : nhap[k]!.length > 0 && (
              <span className={s.nhap}>{[1, 2, 3, 4, 5, 6, 7, 8, 9].map((x) => <i key={x}>{nhap[k]!.includes(x) ? x : ''}</i>)}</span>
            )}
          </button>
        ))}
        {xong && (
          <div className={s.lop} data-kq={xong}>
            <b>{xong === 'thang' ? (vi ? 'Giải xong!' : 'Solved!') : (vi ? 'Sai quá 3 lần' : 'Too many mistakes')}</b>
          </div>
        )}
      </div>

      <div className={s.congCu}>
        <button type="button" onClick={hoanTac} disabled={!lichSu.length}><Undo2 size={18} /><span>{vi ? 'Hoàn tác' : 'Undo'}</span></button>
        <button type="button" onClick={() => dien(0)}><Eraser size={18} /><span>{vi ? 'Xoá' : 'Erase'}</span></button>
        <button type="button" onClick={() => setButChi((b) => !b)} data-bat={butChi}><Pencil size={18} /><span>{vi ? 'Nháp' : 'Notes'} {butChi ? 'ON' : 'OFF'}</span></button>
        <button type="button" onClick={goiY}><Lightbulb size={18} /><span>{vi ? 'Gợi ý' : 'Hint'}</span></button>
      </div>
      <div className={s.banSo}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((v) => (
          <button key={v} type="button" onClick={() => dien(v)} disabled={conLai[v] === 0}>
            <b>{v}</b><small>{conLai[v]}</small>
          </button>
        ))}
      </div>
    </div>
  );
}
