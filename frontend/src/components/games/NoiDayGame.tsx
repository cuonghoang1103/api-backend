'use client';

/**
 * Nối dây (kiểu Flow) — TƯ DUY KHÔNG GIAN: nối các cặp chấm cùng màu bằng đường đi
 * theo ô, dây không cắt nhau, và PHỦ KÍN cả lưới.
 *
 * Sinh đề luôn giải được: tạo một đường Hamilton ngẫu nhiên phủ mọi ô (bắt đầu từ
 * đường rắn bò, rồi trộn bằng phép "backbite" vài nghìn lần), sau đó cắt thành các
 * đoạn dài ≥ 3 — hai đầu mỗi đoạn là một cặp chấm. Lời giải người chơi tìm ra có thể
 * khác lời giải gốc; miễn đúng luật là thắng.
 *
 * Thao tác chuẩn của thể loại: kéo từ chấm (hoặc từ giữa một dây để sửa); kéo lùi để
 * xoá; kéo vào dây màu khác thì cắt dây đó. 5 màn: 5×5 → 6×6 → 6×6 → 7×7 → 8×8.
 * Điểm mỗi màn = 200 × (N − 3) + thưởng nhanh; báo một lần sau màn cuối.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { GameProps } from './registry';
import s from './noiDay.module.css';

const MAN = [5, 6, 6, 7, 8];
const MAU = ['#f43f5e', '#3b82f6', '#22c55e', '#facc15', '#f97316', '#a855f7', '#06b6d4', '#ec4899', '#84cc16', '#e2e8f0', '#8b5cf6', '#14b8a6'];

/** Đường Hamilton ngẫu nhiên trên lưới n×n (thuật toán backbite). */
function duongHamilton(n: number): number[] {
  let p: number[] = [];
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) p.push(r * n + (r % 2 ? n - 1 - c : c));
  const ke = (a: number) => {
    const r = Math.floor(a / n), c = a % n, k: number[] = [];
    if (r > 0) k.push(a - n); if (r < n - 1) k.push(a + n); if (c > 0) k.push(a - 1); if (c < n - 1) k.push(a + 1);
    return k;
  };
  for (let lap = 0; lap < n * n * 40; lap++) {
    const dau = Math.random() < 0.5;
    if (!dau) p.reverse();
    const x = p[0]!;
    const cac = ke(x).filter((y) => y !== p[1]);
    const y = cac[Math.floor(Math.random() * cac.length)]!;
    const j = p.indexOf(y);
    // Nối đầu x vào y rồi đảo đoạn trước y: đường vẫn phủ đủ, hình dạng đổi.
    p = [...p.slice(0, j).reverse(), ...p.slice(j)];
  }
  return p;
}

function sinhDe(n: number): { cap: [number, number][]; } {
  for (;;) {
    const d = duongHamilton(n);
    const soDay = Math.min(MAU.length, n + Math.floor(Math.random() * 2));
    // Cắt thành soDay đoạn, mỗi đoạn ≥ 3 ô.
    const cat: number[] = [];
    let con = d.length - soDay * 3;
    if (con < 0) continue;
    const them = Array.from({ length: soDay }, () => 3);
    while (con-- > 0) them[Math.floor(Math.random() * soDay)]!++;
    let i = 0;
    for (const len of them) { cat.push(i); i += len; }
    const cap: [number, number][] = them.map((len, k) => [d[cat[k]!]!, d[cat[k]! + len - 1]!]);
    // Đoạn mà hai đầu sát nhau thì quá dễ — bốc lại.
    const de = cap.filter(([a, b]) => Math.abs(a - b) === 1 || Math.abs(a - b) === n).length;
    if (de <= 1) return { cap };
  }
}

export default function NoiDayGame({ onScore, locale = 'vi' }: Partial<GameProps>) {
  const vi = locale === 'vi';
  const [man, setMan] = useState(0);
  const n = MAN[man]!;
  const de = useMemo(() => sinhDe(n), [man]); // eslint-disable-line react-hooks/exhaustive-deps
  const [day, setDay] = useState<number[][]>(() => de.cap.map(() => []));
  const [dang, setDangState] = useState<number | null>(null);
  // Dây đang kéo — đọc qua ref: chuỗi pointermove tới dồn dập trước khi React kịp vẽ lại.
  const dangRef = useRef<number | null>(null);
  const setDang = (k: number | null) => { dangRef.current = k; setDangState(k); };
  const [diem, setDiem] = useState(0);
  const [thang, setThang] = useState(false);
  const [batDau, setBatDau] = useState(() => Date.now());
  const svgRef = useRef<SVGSVGElement>(null);
  const t0 = useRef(Date.now());
  const daBao = useRef(false);

  useEffect(() => { setDay(de.cap.map(() => [])); setThang(false); setBatDau(Date.now()); }, [de]);

  const chamMau = useMemo(() => {
    const m = new Map<number, number>();
    de.cap.forEach(([a, b], k) => { m.set(a, k); m.set(b, k); });
    return m;
  }, [de]);
  const chuO = useMemo(() => {
    const m = new Map<number, number>();
    day.forEach((d, k) => d.forEach((o) => m.set(o, k)));
    return m;
  }, [day]);

  const kiemThang = useCallback((ds: number[][]) => {
    const du = ds.every((d, k) => {
      const [a, b] = de.cap[k]!;
      return d.length >= 2 && ((d[0] === a && d[d.length - 1] === b) || (d[0] === b && d[d.length - 1] === a));
    });
    const phu = new Set(ds.flat()).size === n * n;
    return du && phu;
  }, [de, n]);

  const oTaiDiem = (x: number, y: number) => {
    const r = svgRef.current?.getBoundingClientRect();
    if (!r) return -1;
    const c = Math.floor(((x - r.left) / r.width) * n), h = Math.floor(((y - r.top) / r.height) * n);
    return c < 0 || h < 0 || c >= n || h >= n ? -1 : h * n + c;
  };

  const dayRef = useRef(day);
  dayRef.current = day;

  const xuong = (e: React.PointerEvent) => {
    if (thang) return;
    const o = oTaiDiem(e.clientX, e.clientY);
    if (o < 0) return;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    // Cập nhật ref NGAY: pointermove đầu tiên có thể tới trước lượt vẽ lại.
    const dat = (ds: number[][]) => { dayRef.current = ds; setDay(ds); };
    const k = chamMau.get(o);
    if (k !== undefined) { setDang(k); dat(dayRef.current.map((d, j) => (j === k ? [o] : d))); return; }
    const j = chuO.get(o);
    if (j !== undefined) { setDang(j); dat(dayRef.current.map((d, i) => (i === j ? d.slice(0, d.indexOf(o) + 1) : d))); }
  };

  /** Một bước kéo sang ô kề `o` — hàm THUẦN, trả về bộ dây mới. */
  const buoc = useCallback((ds: number[][], k: number, o: number): number[][] => {
    const d = ds[k]!;
    const cuoi = d[d.length - 1];
    if (cuoi === undefined || o === cuoi) return ds;
    const keNhau = Math.abs(o - cuoi) === n || (Math.abs(o - cuoi) === 1 && Math.floor(o / n) === Math.floor(cuoi / n));
    if (!keNhau) return ds;
    const [a, b] = de.cap[k]!;
    const daXong = d.length >= 2 && (d[d.length - 1] === a || d[d.length - 1] === b) && d[0] !== d[d.length - 1];
    const viTri = d.indexOf(o);
    if (viTri >= 0) return ds.map((x, j) => (j === k ? x.slice(0, viTri + 1) : x)); // kéo lùi
    if (daXong) return ds;
    const kCham = chamMau.get(o);
    if (kCham !== undefined && kCham !== k) return ds; // không đi qua chấm màu khác
    return ds.map((x, j) => {
      if (j === k) return [...x, o];
      const cat = x.indexOf(o);
      return cat >= 0 ? x.slice(0, cat) : x; // cắt dây màu khác bị đè
    });
  }, [n, de, chamMau]);

  const di = (e: React.PointerEvent) => {
    const dang = dangRef.current;
    if (dang === null || thang) return;
    const o = oTaiDiem(e.clientX, e.clientY);
    if (o < 0) return;
    // Kéo nhanh có thể nhảy cóc qua vài ô — đi lần lượt từng ô ở giữa (theo hàng rồi cột).
    let ds = dayRef.current;
    for (let lap = 0; lap < 2 * n; lap++) {
      const d = ds[dang]!;
      const cuoi = d[d.length - 1];
      if (cuoi === undefined || cuoi === o) break;
      const rc = Math.floor(cuoi / n), cc = cuoi % n, ro = Math.floor(o / n), co = o % n;
      const tiep = cc !== co ? cuoi + Math.sign(co - cc) : cuoi + Math.sign(ro - rc) * n;
      const moi = buoc(ds, dang, tiep);
      if (moi === ds) break;
      ds = moi;
    }
    if (ds !== dayRef.current) { dayRef.current = ds; setDay(ds); }
  };

  const len = () => {
    if (dangRef.current === null) return;
    setDang(null);
    const ds = dayRef.current;
    if (thang || !kiemThang(ds)) return;
    setThang(true);
    const giay = (Date.now() - batDau) / 1000;
    const cong = 200 * (n - 3) + Math.max(0, Math.round(300 - giay * 4));
    const tong = diem + cong;
    setDiem(tong);
    setTimeout(() => {
      if (man + 1 >= MAN.length) {
        if (!daBao.current && onScore) { daBao.current = true; onScore(tong, Math.round((Date.now() - t0.current) / 1000)); }
      } else setMan(man + 1);
    }, 1400);
  };

  const phu = new Set(day.flat()).size;
  const xy = (o: number) => [(o % n) * 100 + 50, Math.floor(o / n) * 100 + 50];

  return (
    <div className={s.goc}>
      <div className={s.hud}>
        <span className={s.chip}>{vi ? 'Màn' : 'Level'} <b>{man + 1}/{MAN.length}</b></span>
        <span className={s.chip}>{n}×{n}</span>
        <span className={s.chip}>{vi ? 'Phủ' : 'Filled'} <b>{Math.round((phu / (n * n)) * 100)}%</b></span>
        <span className={s.chip}>{vi ? 'Điểm' : 'Score'} <b>{diem}</b></span>
        <button type="button" className={s.nut} onClick={() => setDay(de.cap.map(() => []))}>{vi ? 'Làm lại' : 'Reset'}</button>
      </div>
      <svg
        ref={svgRef}
        className={s.ban}
        data-thang={thang}
        viewBox={`0 0 ${n * 100} ${n * 100}`}
        onPointerDown={xuong}
        onPointerMove={di}
        onPointerUp={len}
        onPointerCancel={len}
      >
        {Array.from({ length: n * n }, (_, o) => {
          const k = chuO.get(o);
          return <rect key={o} x={(o % n) * 100 + 3} y={Math.floor(o / n) * 100 + 3} width={94} height={94} rx={14} fill={k !== undefined ? MAU[k] : '#ffffff'} fillOpacity={k !== undefined ? 0.16 : 0.04} />;
        })}
        {day.map((d, k) => d.length > 1 && (
          <polyline key={k} points={d.map((o) => xy(o).join(',')).join(' ')} fill="none" stroke={MAU[k]} strokeWidth={34} strokeLinecap="round" strokeLinejoin="round" className={s.day} />
        ))}
        {de.cap.flatMap(([a, b], k) => [a, b].map((o) => {
          const [x, y] = xy(o);
          return <circle key={`${k}-${o}`} cx={x} cy={y} r={32} fill={MAU[k]} className={s.cham} style={{ ['--m' as string]: MAU[k] }} />;
        }))}
      </svg>
      <p className={s.goiY}>
        {thang
          ? (man + 1 >= MAN.length ? (vi ? 'Hoàn thành tất cả các màn!' : 'All levels done!') : (vi ? 'Tuyệt! Sang màn tiếp…' : 'Nice! Next level…'))
          : (vi ? 'Kéo từ một chấm tới chấm cùng màu. Nối hết các cặp và phủ kín mọi ô.' : 'Drag from a dot to its twin. Connect all pairs and fill every cell.')}
      </p>
    </div>
  );
}
