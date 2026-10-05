'use client';

/**
 * Sudoku — đề sinh tại chỗ, LUÔN đúng một lời giải.
 *
 * Nâng cấp 05/10/2026: 10 CẤP (cấp 1–2 là 6×6 nhập môn, cấp 3–10 là 9×9 bớt dần ô gợi ý
 * 46 → 24), bàn "giấy cao cấp" nổi khối, tô sáng hàng/cột/khối + số trùng + ô xung đột,
 * ghi chú đẹp, sóng sáng khi hoàn thành hàng/cột/khối, chuỗi điền đúng, âm thanh mọi thao tác,
 * băng "Cấp N", tiến độ từng cấp nhớ ở máy (localStorage `game:sudoku:tien-do`).
 *
 * Sinh: điền kín lưới bằng quay lui với thứ tự chữ số xáo trộn, rồi khoét dần từng ô
 * (thứ tự ngẫu nhiên); mỗi lần khoét đếm nghiệm tới 2 — ra 2 nghiệm thì trả ô lại.
 * Ô đã điền ĐÚNG thì khoá (đỡ xoá nhầm); ô sai tô đỏ, sai 3 lần thì thua (0 điểm).
 *
 * Điểm (thắng) = gốc theo cấp − thời gian × gốc/1500 mỗi giây − 8% gốc mỗi lỗi − 10% gốc mỗi
 * gợi ý, tối thiểu 20% gốc. Gốc cấp 10 = 5 000 = trần máy chủ; không có khoản cộng nào ⇒
 * không bao giờ vượt trần.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Eraser, Lightbulb, Pencil, Undo2, Heart, Flame, Check, Lock } from 'lucide-react';
import type { GameProps } from './registry';
import { sfx } from './shared/amThanh';
import { phaoGiay, diemBay, rung } from './shared/hieuUng';
import s from './sudoku.module.css';

type CapSdk = { n: 6 | 9; goiY: number; goc: number; ten: string; en: string };
const CAP: CapSdk[] = [
  { n: 6, goiY: 22, goc: 800, ten: 'Nhập môn', en: 'Intro' },
  { n: 6, goiY: 17, goc: 1100, ten: 'Khởi động', en: 'Warm-up' },
  { n: 9, goiY: 46, goc: 1400, ten: 'Dễ', en: 'Easy' },
  { n: 9, goiY: 41, goc: 1800, ten: 'Dễ+', en: 'Easy+' },
  { n: 9, goiY: 37, goc: 2200, ten: 'Vừa', en: 'Medium' },
  { n: 9, goiY: 34, goc: 2700, ten: 'Vừa+', en: 'Medium+' },
  { n: 9, goiY: 31, goc: 3200, ten: 'Khó', en: 'Hard' },
  { n: 9, goiY: 28, goc: 3700, ten: 'Khó+', en: 'Hard+' },
  { n: 9, goiY: 26, goc: 4300, ten: 'Chuyên gia', en: 'Expert' },
  { n: 9, goiY: 24, goc: 5000, ten: 'Bậc thầy', en: 'Master' },
];
const MANG = 3;
const KHOA_TIEN_DO = 'game:sudoku:tien-do';

/* ── Bản đồ lưới: hàng/cột/khối + "hàng xóm" của từng ô ── */
type BanDo = { n: number; br: number; bc: number; hang: number[][]; cot: number[][]; khoi: number[][]; cua: number[][]; peers: number[][] };
const BD: Record<number, BanDo> = {};
function banDo(n: number): BanDo {
  if (BD[n]) return BD[n]!;
  const br = n === 9 ? 3 : 2, bc = 3;
  const hang = Array.from({ length: n }, (_, r) => Array.from({ length: n }, (_, c) => r * n + c));
  const cot = Array.from({ length: n }, (_, c) => Array.from({ length: n }, (_, r) => r * n + c));
  const khoi: number[][] = Array.from({ length: n }, () => []);
  const cua: number[][] = [];
  for (let i = 0; i < n * n; i++) {
    const r = Math.floor(i / n), c = i % n;
    const k = Math.floor(r / br) * (n / bc) + Math.floor(c / bc);
    khoi[k]!.push(i);
    cua.push([r, c, k]);
  }
  const peers = Array.from({ length: n * n }, (_, i) => {
    const [r, c, k] = cua[i]!;
    return [...new Set([...hang[r!]!, ...cot[c!]!, ...khoi[k!]!])].filter((x) => x !== i);
  });
  return (BD[n] = { n, br, bc, hang, cot, khoi, cua, peers });
}

const coDuoc = (g: number[], i: number, v: number, bd: BanDo) => bd.peers[i]!.every((k) => g[k] !== v);
const tron = (a: number[]) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j]!, a[i]!]; } return a; };
const soTu1 = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

function dienKin(g: number[], bd: BanDo): boolean {
  const i = g.indexOf(0);
  if (i < 0) return true;
  for (const v of tron(soTu1(bd.n))) {
    if (coDuoc(g, i, v, bd)) { g[i] = v; if (dienKin(g, bd)) return true; g[i] = 0; }
  }
  return false;
}
/** Đếm nghiệm, dừng ở `tran` — chọn ô ít khả năng nhất trước cho nhanh. */
function demNghiem(g: number[], bd: BanDo, tran = 2): number {
  let best = -1, bestN = 99;
  for (let i = 0; i < g.length; i++) {
    if (g[i]) continue;
    let k = 0;
    for (let v = 1; v <= bd.n; v++) if (coDuoc(g, i, v, bd)) k++;
    if (k < bestN) { best = i; bestN = k; if (k <= 1) break; }
  }
  if (best < 0) return 1;
  let dem = 0;
  for (let v = 1; v <= bd.n && dem < tran; v++) {
    if (!coDuoc(g, best, v, bd)) continue;
    g[best] = v; dem += demNghiem(g, bd, tran - dem); g[best] = 0;
  }
  return dem;
}
function sinhDe(n: number, soGoiY: number): { de: number[]; giai: number[] } {
  const bd = banDo(n);
  const giai = new Array<number>(n * n).fill(0);
  dienKin(giai, bd);
  const de = [...giai];
  let con = n * n;
  for (const i of tron(Array.from({ length: n * n }, (_, k) => k))) {
    if (con <= soGoiY) break;
    const cu = de[i]!;
    de[i] = 0;
    if (demNghiem([...de], bd) !== 1) de[i] = cu; else con--;
  }
  return { de, giai };
}

/* ── Khung co giãn ── */
function useKhung(ref: React.RefObject<HTMLElement | null>) {
  const [k, setK] = useState({ w: 640, h: 460 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const san = el.parentElement?.parentElement ?? null;
    const doLai = () => {
      const fs = !!document.fullscreenElement;
      const w = Math.floor(san?.clientWidth || Math.min(window.innerWidth - 32, 900));
      const h = Math.floor(fs ? window.innerHeight - 84 : Math.min(760, Math.max(420, window.innerHeight - 170)));
      setK((p) => (p.w === w && p.h === h ? p : { w, h }));
    };
    doLai();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(doLai) : null;
    if (san) ro?.observe(san);
    window.addEventListener('resize', doLai);
    document.addEventListener('fullscreenchange', doLai);
    return () => { ro?.disconnect(); window.removeEventListener('resize', doLai); document.removeEventListener('fullscreenchange', doLai); };
  }, [ref]);
  return k;
}

type Buoc = { i: number; v: number; nhap: number[] };
type Song = { k: number; tre: Record<number, number> };

export default function SudokuGame({ onScore, locale = 'vi', paused = false }: Partial<GameProps>) {
  const vi = locale === 'vi';
  const gocRef = useRef<HTMLDivElement>(null);
  const banRef = useRef<HTMLDivElement>(null);
  const oRef = useRef<(HTMLButtonElement | null)[]>([]);
  const kh = useKhung(gocRef);

  const [capI, setCapI] = useState<number | null>(null);
  const [cau, setCau] = useState<{ de: number[]; giai: number[] } | null>(null);
  const [o, setO] = useState<number[]>([]);
  const [nhap, setNhap] = useState<number[][]>([]);
  const [chon, setChon] = useState(-1);
  const [butChi, setButChi] = useState(false);
  const [loi, setLoi] = useState(0);
  const [goiYDung, setGoiYDung] = useState(0);
  const [lichSu, setLichSu] = useState<Buoc[]>([]);
  const [giay, setGiay] = useState(0);
  const [xong, setXong] = useState<'thang' | 'thua' | null>(null);
  const [saiO, setSaiO] = useState({ i: -1, k: 0 });
  const [song, setSong] = useState<Song | null>(null);
  const [chuoi, setChuoi] = useState(0);
  const [bang, setBang] = useState<{ cap: number; k: number } | null>(null);
  const [daQua, setDaQua] = useState<number[]>([]);
  const daBao = useRef(false);
  const henGio = useRef<number[]>([]);
  const hen = (fn: () => void, ms: number) => { henGio.current.push(window.setTimeout(fn, ms)); };
  useEffect(() => () => henGio.current.forEach((t) => clearTimeout(t)), []);

  useEffect(() => {
    try { const x = JSON.parse(localStorage.getItem(KHOA_TIEN_DO) || '[]'); if (Array.isArray(x)) setDaQua(x.filter((v) => typeof v === 'number')); } catch { /* bỏ qua */ }
  }, []);

  const cap = capI !== null ? CAP[capI]! : null;
  const n = cap?.n ?? 9;
  const bd = banDo(n);

  const batDau = (i: number) => {
    sfx('chon');
    setCapI(i);
    // Sinh đề có thể mất ~50–300 ms ở cấp khó — để trình duyệt vẽ màn "đang tạo" trước.
    hen(() => {
      const c = sinhDe(CAP[i]!.n, CAP[i]!.goiY);
      setCau(c); setO([...c.de]); setNhap(Array.from({ length: c.de.length }, () => []));
      setChon(-1); setBang({ cap: i + 1, k: Date.now() });
      sfx('lenCap');
    }, 60);
  };

  useEffect(() => {
    if (!bang) return;
    const t = window.setTimeout(() => setBang(null), 1800);
    return () => clearTimeout(t);
  }, [bang]);

  // Đồng hồ đứng yên khi GameShell tạm dừng (prop `paused`).
  const dungRef = useRef(paused);
  dungRef.current = paused;
  const dangDung = () => dungRef.current;
  useEffect(() => {
    if (!cau || xong) return;
    const id = window.setInterval(() => { if (!dangDung()) setGiay((g) => g + 1); }, 1000);
    return () => clearInterval(id);
  }, [cau, xong]);

  const viTriO = (i: number) => {
    const goc = gocRef.current, el = oRef.current[i];
    if (!goc || !el) return null;
    const a = goc.getBoundingClientRect(), b = el.getBoundingClientRect();
    return { x: b.left - a.left + b.width / 2, y: b.top - a.top + b.height / 2 };
  };

  const ketThuc = useCallback((kq: 'thang' | 'thua', loiCuoi: number, goiYCuoi: number) => {
    setXong(kq);
    if (daBao.current || !cap || capI === null) return;
    daBao.current = true;
    const g = cap.goc;
    const diem = kq === 'thang' ? Math.round(Math.max(g * 0.2, g - giay * (g / 1500) - loiCuoi * g * 0.08 - goiYCuoi * g * 0.1)) : 0;
    if (kq === 'thang') {
      try {
        const moi = [...new Set([...daQua, capI])].sort((a, b) => a - b);
        localStorage.setItem(KHOA_TIEN_DO, JSON.stringify(moi));
      } catch { /* bỏ qua */ }
      // Sóng sáng chéo khắp bàn + pháo giấy, rồi mới báo điểm (GameShell chuyển màn kết quả).
      const tre: Record<number, number> = {};
      for (let i = 0; i < n * n; i++) tre[i] = (Math.floor(i / n) + (i % n)) * 45;
      setSong({ k: Date.now(), tre });
      sfx('combo', { muc: 8 });
      hen(() => phaoGiay(gocRef.current), 250);
      hen(() => onScore?.(diem, giay), 1900);
    } else {
      hen(() => onScore?.(0, giay), 1700);
    }
  }, [onScore, cap, capI, giay, daQua, n]);

  /** Hàng/cột/khối vừa hoàn chỉnh chứa ô i ⇒ sóng sáng lan từ ô đó. */
  const kiemHoanThanh = (moi: number[], i: number) => {
    if (!cau) return 0;
    const [r, c, k] = bd.cua[i]!;
    const xong3 = [bd.hang[r!]!, bd.cot[c!]!, bd.khoi[k!]!].map((ds) => ds.every((x) => moi[x] === cau.giai[x]));
    const dem = xong3.filter(Boolean).length;
    if (!dem) return 0;
    const tre: Record<number, number> = {};
    [bd.hang[r!]!, bd.cot[c!]!, bd.khoi[k!]!].forEach((ds, j) => {
      if (!xong3[j]) return;
      for (const x of ds) { const [r2, c2] = bd.cua[x]!; tre[x] = (Math.abs(r2! - r!) + Math.abs(c2! - c!)) * 55; }
    });
    setSong({ k: Date.now(), tre });
    const p = viTriO(i);
    if (p) {
      const ten = [vi ? 'Hàng' : 'Row', vi ? 'Cột' : 'Col', vi ? 'Khối' : 'Box'].filter((_, j) => xong3[j]).join(' + ');
      diemBay(gocRef.current, p.x, p.y - 26, `${ten} ✓`, '#fbbf24');
    }
    return dem;
  };

  const dien = (v: number) => {
    if (!cau || xong || chon < 0 || cau.de[chon]) return;
    if (o[chon] && o[chon] === cau.giai[chon]) return; // ô đã đúng thì khoá
    if (butChi && v) {
      setNhap((nh) => { const m = [...nh]; const x = m[chon]!; m[chon] = x.includes(v) ? x.filter((y) => y !== v) : [...x, v].sort((a, b) => a - b); return m; });
      sfx('lat');
      return;
    }
    if (o[chon] === v) return;
    setLichSu((l) => [...l.slice(-199), { i: chon, v: o[chon]!, nhap: nhap[chon]! }]);
    const moi = [...o]; moi[chon] = v; setO(moi);
    if (!v) { sfx('bam'); return; }
    if (v !== cau.giai[chon]) {
      const l = loi + 1;
      setLoi(l); setChuoi(0); setSaiO({ i: chon, k: Date.now() });
      sfx('sai'); rung(banRef.current);
      if (l >= MANG) ketThuc('thua', l, goiYDung);
      return;
    }
    // Đúng: gạch số đó khỏi ghi chú của hàng xóm (đỡ phải dọn tay).
    const c = chon;
    setNhap((nh) => { const m = [...nh]; m[c] = []; for (const k of bd.peers[c]!) m[k] = m[k]!.filter((y) => y !== v); return m; });
    const ch = chuoi + 1;
    setChuoi(ch);
    const p = viTriO(c);
    if (p) phaoGiay(gocRef.current, { x: p.x, y: p.y, it: true, mau: ['#fbbf24', '#60a5fa', '#f472b6', '#34d399'] });
    if (moi.every((x, k) => x === cau.giai[k])) { ketThuc('thang', loi, goiYDung); return; }
    const dem = kiemHoanThanh(moi, c);
    if (dem) sfx('combo', { muc: Math.min(8, dem + Math.floor(ch / 4)) });
    else sfx(ch >= 5 && ch % 5 === 0 ? 'nhat' : 'gop');
  };

  const hoanTac = () => {
    const b = lichSu[lichSu.length - 1];
    if (!b || xong) return;
    sfx('lat');
    setLichSu((l) => l.slice(0, -1));
    setO((x) => { const m = [...x]; m[b.i] = b.v; return m; });
    setNhap((nh) => { const m = [...nh]; m[b.i] = b.nhap; return m; });
    setChon(b.i);
  };
  const goiY = () => {
    if (!cau || xong) return;
    const i = chon >= 0 && o[chon] !== cau.giai[chon] ? chon : o.findIndex((x, k) => x !== cau.giai[k]);
    if (i < 0) return;
    const g = goiYDung + 1;
    setGoiYDung(g);
    setChon(i);
    const moi = [...o]; moi[i] = cau.giai[i]!; setO(moi);
    setNhap((nh) => { const m = [...nh]; m[i] = []; for (const k of bd.peers[i]!) m[k] = m[k]!.filter((y) => y !== cau.giai[i]); return m; });
    sfx('sao');
    const p = viTriO(i);
    if (p) phaoGiay(gocRef.current, { x: p.x, y: p.y, it: true, mau: ['#fde68a', '#fbbf24', '#ffffff'] });
    if (moi.every((x, k) => x === cau.giai[k])) { ketThuc('thang', loi, g); return; }
    kiemHoanThanh(moi, i);
  };
  const doiBut = () => { setButChi((b) => !b); sfx('chon'); };
  const chonO = (k: number) => { if (k !== chon) sfx('bam'); setChon(k); };

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (!cau || dangDung()) return;
      const k = Number(e.key);
      if (k >= 1 && k <= n) { dien(k); return; }
      if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') { dien(0); return; }
      const kk = e.key.toLowerCase();
      if ((e.metaKey || e.ctrlKey) && kk === 'z') { e.preventDefault(); hoanTac(); return; }
      if (kk === 'n') { doiBut(); return; }
      if (kk === 'u') { hoanTac(); return; }
      if (kk === 'h') { goiY(); return; }
      const d: Record<string, [number, number]> = { ArrowLeft: [0, -1], ArrowRight: [0, 1], ArrowUp: [-1, 0], ArrowDown: [1, 0] };
      const dd = d[e.key];
      if (dd) {
        e.preventDefault();
        setChon((c) => {
          if (c < 0) return Math.floor((n * n) / 2);
          const r = (Math.floor(c / n) + dd[0] + n) % n, cc = ((c % n) + dd[1] + n) % n;
          return r * n + cc;
        });
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  });

  useEffect(() => {
    if (!song) return;
    const t = window.setTimeout(() => setSong(null), 1400);
    return () => clearTimeout(t);
  }, [song]);

  const conLai = useMemo(() => {
    const d = new Array<number>(10).fill(n);
    for (let i = 0; i < o.length; i++) if (o[i] && cau && o[i] === cau.giai[i]) d[o[i]!]!--;
    return d;
  }, [o, cau, n]);

  /* ── Bố cục ── */
  const W = Math.min(kh.w, 1120);
  const H = Math.max(300, kh.h - 52);
  const rong = W >= H * 1.25 && W >= 560;
  let ban = rong ? Math.min(H, W - 250 - 28) : Math.min(W, H - 140);
  ban = Math.floor(Math.max(250, ban));
  const panelW = rong ? Math.floor(Math.min(360, W - ban - 28)) : ban;
  const oPx = (ban - 12 - (n - 1)) / n;

  /* ── Màn chọn cấp ── */
  if (capI === null || !cap) {
    const deXuat = Math.min(CAP.length - 1, daQua.length ? Math.max(...daQua) + 1 : 0);
    return (
      <div ref={gocRef} className={s.goc} style={{ width: W }}>
        <div className={s.chonDau}>
          <h3>{vi ? 'Chọn cấp Sudoku' : 'Choose a Sudoku level'}</h3>
          <p>{vi ? `Đã qua ${daQua.length}/${CAP.length} cấp · cấp 1–2 là lưới 6×6 để làm quen` : `${daQua.length}/${CAP.length} cleared · levels 1–2 are 6×6 warm-ups`}</p>
        </div>
        <div className={s.chonCap} data-rong={W >= 620}>
          {CAP.map((c, i) => (
            <button key={i} type="button" onClick={() => batDau(i)} data-qua={daQua.includes(i)} data-dexuat={i === deXuat} style={{ ['--i' as string]: i }}>
              <span className={s.capSo}>{i + 1}</span>
              <b>{vi ? c.ten : c.en}</b>
              <small>{c.n}×{c.n} · {c.goiY} {vi ? 'gợi ý' : 'givens'}</small>
              <span className={s.doKho}>{Array.from({ length: 5 }, (_, k) => <i key={k} data-bat={k < Math.ceil((i + 1) / 2)} />)}</span>
              {daQua.includes(i) && <Check className={s.daQua} size={16} />}
              {i === deXuat && !daQua.includes(i) && <em className={s.nhan}>{vi ? 'Tiếp theo' : 'Next'}</em>}
            </button>
          ))}
        </div>
        <p className={s.goiYPhim}>{vi ? 'Phím: ' : 'Keys: '}<kbd>1</kbd>–<kbd>9</kbd> · <kbd>←↑→↓</kbd> · <kbd>N</kbd> {vi ? 'ghi chú' : 'notes'} · <kbd>U</kbd> {vi ? 'hoàn tác' : 'undo'} · <kbd>H</kbd> {vi ? 'gợi ý' : 'hint'}</p>
      </div>
    );
  }

  if (!cau) {
    return (
      <div ref={gocRef} className={s.goc} style={{ width: W }}>
        <div className={s.dangTao}><span className={s.vong} /><p>{vi ? 'Đang tạo đề có lời giải duy nhất…' : 'Generating a unique puzzle…'}</p></div>
      </div>
    );
  }

  const vChon = chon >= 0 ? o[chon] : 0;
  const cuaChon = chon >= 0 ? bd.cua[chon]! : null;
  const cungVung = (k: number) => {
    if (!cuaChon) return false;
    const [r, c, b] = bd.cua[k]!;
    return r === cuaChon[0] || c === cuaChon[1] || b === cuaChon[2];
  };
  const sai = (k: number) => !!o[k] && o[k] !== cau.giai[k];
  // Ô hàng xóm cùng số với ô sai đang chọn ⇒ chỉ ra chỗ xung đột.
  const xungDot = (k: number) => chon >= 0 && sai(chon) && bd.peers[chon]!.includes(k) && o[k] === o[chon];
  const phut = `${Math.floor(giay / 60)}:${String(giay % 60).padStart(2, '0')}`;

  return (
    <div ref={gocRef} className={s.goc} style={{ width: W, ['--o' as string]: `${oPx}px` }}>
      <div className={s.hud}>
        <span className={s.chip}>{vi ? 'Cấp' : 'Lv'} <b>{capI + 1}</b> · {vi ? cap.ten : cap.en}</span>
        <span className={s.chip}>⏱ <b>{phut}</b></span>
        <span className={s.chip} data-nong={chuoi >= 3}><Flame size={14} /> <b>×{chuoi}</b></span>
        {goiYDung > 0 && <span className={s.chip}><Lightbulb size={14} /> <b>{goiYDung}</b></span>}
        <span className={s.tim} aria-label={`${MANG - loi}/${MANG}`}>{Array.from({ length: MANG }, (_, i) => <Heart key={i} size={17} data-con={i < MANG - loi} />)}</span>
      </div>

      <div className={s.than} data-rong={rong}>
        <div ref={banRef} className={s.ban} style={{ width: ban, height: ban }} data-xong={xong ?? undefined}>
          <div className={s.luoi} style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
            {o.map((v, k) => (
              <button
                key={k}
                ref={(el) => { oRef.current[k] = el; }}
                type="button"
                className={s.o}
                data-goc={!!cau.de[k]}
                data-chon={k === chon}
                data-vung={cungVung(k)}
                data-cungso={!!vChon && v === vChon && !sai(k)}
                data-sai={sai(k)}
                data-xungdot={xungDot(k)}
                data-song={song?.tre[k] !== undefined ? (song.k % 2 ? 'a' : 'b') : undefined}
                style={song?.tre[k] !== undefined ? { animationDelay: `${song.tre[k]}ms` } : undefined}
                onClick={() => chonO(k)}
                aria-label={`${Math.floor(k / n) + 1}-${(k % n) + 1}`}
              >
                {v ? <span key={`${v}-${k === saiO.i ? saiO.k : 0}`} className={s.so} data-rung={k === saiO.i}>{v}</span> : nhap[k]!.length > 0 && (
                  <span className={s.nhap} style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                    {soTu1(n).map((x) => <i key={x} data-trung={!!vChon && x === vChon}>{nhap[k]!.includes(x) ? x : ''}</i>)}
                  </span>
                )}
              </button>
            ))}
          </div>
          {/* Đường khối 3×3 (2×3) vẽ đè, không bắt chuột. */}
          <div className={s.khoi} style={{ gridTemplateColumns: `repeat(${n / bd.bc}, 1fr)`, gridTemplateRows: `repeat(${n / bd.br}, 1fr)` }} aria-hidden="true">
            {Array.from({ length: n }, (_, i) => <i key={i} />)}
          </div>
          {xong && (
            <div className={s.lop} data-kq={xong}>
              <b>{xong === 'thang' ? (vi ? 'Giải xong!' : 'Solved!') : (vi ? 'Sai quá 3 lần' : 'Too many mistakes')}</b>
              <span>{xong === 'thang' ? `${vi ? 'Cấp' : 'Level'} ${capI + 1} · ${phut}` : (vi ? 'Thử lại nhé — lần sau sẽ tốt hơn' : 'Have another go')}</span>
            </div>
          )}
        </div>

        <div className={s.panel} style={{ width: panelW }} data-rong={rong}>
          <div className={s.congCu}>
            <button type="button" onClick={hoanTac} disabled={!lichSu.length}><Undo2 size={18} /><span>{vi ? 'Hoàn tác' : 'Undo'}</span></button>
            <button type="button" onClick={() => dien(0)}><Eraser size={18} /><span>{vi ? 'Xoá' : 'Erase'}</span></button>
            <button type="button" onClick={doiBut} data-bat={butChi}><Pencil size={18} /><span>{vi ? 'Ghi chú' : 'Notes'} <em>{butChi ? 'ON' : 'OFF'}</em></span></button>
            <button type="button" onClick={goiY}><Lightbulb size={18} /><span>{vi ? 'Gợi ý' : 'Hint'}</span></button>
          </div>
          <div className={s.banSo} data-rong={rong} style={{ gridTemplateColumns: rong ? 'repeat(3, 1fr)' : `repeat(${n}, 1fr)` }}>
            {soTu1(n).map((v) => (
              <button key={v} type="button" onClick={() => dien(v)} disabled={conLai[v] === 0} data-but={butChi} data-chon={!!vChon && vChon === v}>
                <b>{v}</b>{conLai[v] === 0 ? <Lock size={10} className={s.khoa} /> : <small>{conLai[v]}</small>}
              </button>
            ))}
          </div>
          {rong && <p className={s.goiYPhim}><kbd>N</kbd> {vi ? 'ghi chú' : 'notes'} · <kbd>U</kbd> {vi ? 'hoàn tác' : 'undo'} · <kbd>H</kbd> {vi ? 'gợi ý' : 'hint'}</p>}
        </div>
      </div>

      {bang && (
        <div key={bang.k} className={s.bang} aria-live="polite">
          <small>{vi ? 'Cấp' : 'Level'}</small>
          <b>{bang.cap}</b>
          <span>{vi ? CAP[bang.cap - 1]!.ten : CAP[bang.cap - 1]!.en} · {CAP[bang.cap - 1]!.n}×{CAP[bang.cap - 1]!.n}</span>
        </div>
      )}
    </div>
  );
}
