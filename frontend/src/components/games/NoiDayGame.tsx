'use client';

/**
 * Nối dây (kiểu Flow) — TƯ DUY KHÔNG GIAN: nối các cặp chấm cùng màu bằng đường đi
 * theo ô, dây không cắt nhau, và PHỦ KÍN cả lưới.
 *
 * Nâng cấp 05/10/2026: 12 MÀN lưới lớn dần 5×5 → 9×9, ống dây bóng (thân màu + vệt sáng
 * + quầng mờ) bo tròn, dây nối xong có dòng sáng chảy dọc ống, chấm là viên bi gradient,
 * lấp đầy bàn thì sóng sáng chạy dọc từng ống + pháo giấy. Âm thanh khi cầm dây, nối xong một
 * cặp, cắt dây khác, qua màn, lên màn. Gợi ý (≤3/màn, đặt một dây theo lời giải gốc) và Bỏ qua.
 *
 * Sinh đề luôn giải được: tạo một đường Hamilton ngẫu nhiên phủ mọi ô (bắt đầu từ
 * đường rắn bò, rồi trộn bằng phép "backbite" vài nghìn lần), sau đó cắt thành các
 * đoạn dài ≥ 3 — hai đầu mỗi đoạn là một cặp chấm. Lời giải người chơi tìm ra có thể
 * khác lời giải gốc; miễn đúng luật là thắng.
 *
 * Thao tác chuẩn của thể loại: kéo từ chấm (hoặc từ giữa một dây để sửa); kéo lùi để
 * xoá; kéo vào dây màu khác thì cắt dây đó. Phím: R làm lại · H gợi ý · N bỏ qua màn.
 *
 * Điểm mỗi màn = 30×N + 10×số màn + max(0, 150 − 2×giây − 60×gợi ý); bỏ qua = 0.
 * Tối đa lý thuyết ≈ 5 130 (< trần 6 000). Báo một lần sau màn cuối.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RotateCcw, Lightbulb, SkipForward, Clock } from 'lucide-react';
import type { GameProps } from './registry';
import { sfx } from './shared/amThanh';
import { phaoGiay, diemBay } from './shared/hieuUng';
import s from './noiDay.module.css';

const MAN = [5, 5, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9];
const GOI_Y_MAN = 3;
const MAU = ['#f43f5e', '#3b82f6', '#22c55e', '#facc15', '#f97316', '#a855f7', '#06b6d4', '#ec4899', '#84cc16', '#e2e8f0', '#8b5cf6', '#14b8a6'];
const MAU_SANG = ['#fda4af', '#93c5fd', '#86efac', '#fef08a', '#fdba74', '#d8b4fe', '#a5f3fc', '#f9a8d4', '#d9f99d', '#ffffff', '#c4b5fd', '#99f6e4'];

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
    if (Math.random() < 0.5) p.reverse();
    const x = p[0]!;
    const cac = ke(x).filter((y) => y !== p[1]);
    const y = cac[Math.floor(Math.random() * cac.length)]!;
    const j = p.indexOf(y);
    // Nối đầu x vào y rồi đảo đoạn trước y: đường vẫn phủ đủ, hình dạng đổi.
    p = [...p.slice(0, j).reverse(), ...p.slice(j)];
  }
  return p;
}

function sinhDe(n: number): { cap: [number, number][]; giai: number[][] } {
  for (;;) {
    const d = duongHamilton(n);
    const soDay = Math.min(MAU.length, n + Math.floor(Math.random() * 2));
    let con = d.length - soDay * 3;
    if (con < 0) continue;
    const dai = Array.from({ length: soDay }, () => 3);
    while (con-- > 0) dai[Math.floor(Math.random() * soDay)]!++;
    const giai: number[][] = [];
    let i = 0;
    for (const len of dai) { giai.push(d.slice(i, i + len)); i += len; }
    const cap = giai.map((g) => [g[0]!, g[g.length - 1]!] as [number, number]);
    // Đoạn mà hai đầu sát nhau thì quá dễ — bốc lại.
    const de = cap.filter(([a, b]) => Math.abs(a - b) === n || (Math.abs(a - b) === 1 && Math.floor(a / n) === Math.floor(b / n))).length;
    if (de <= 1) return { cap, giai };
  }
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
      const h = Math.floor(fs ? window.innerHeight - 84 : Math.min(720, Math.max(400, window.innerHeight - 170)));
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

export default function NoiDayGame({ onScore, locale = 'vi', paused = false }: Partial<GameProps>) {
  const vi = locale === 'vi';
  const gocRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const kh = useKhung(gocRef);

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
  const [giay, setGiay] = useState(0);
  const [goiY, setGoiY] = useState(0);
  const [bang, setBang] = useState<{ man: number; k: number } | null>({ man: 1, k: 0 });
  const t0 = useRef(Date.now());
  const daBao = useRef(false);
  const henGio = useRef<number[]>([]);
  const hen = (fn: () => void, ms: number) => { henGio.current.push(window.setTimeout(fn, ms)); };
  useEffect(() => () => henGio.current.forEach((t) => clearTimeout(t)), []);

  const dayRef = useRef(day);
  dayRef.current = day;
  const xongRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    const rong = de.cap.map(() => [] as number[]);
    dayRef.current = rong;
    xongRef.current = new Set();
    setDay(rong); setThang(false); setGiay(0); setGoiY(0);
  }, [de]);

  useEffect(() => {
    if (!bang) return;
    const t = window.setTimeout(() => setBang(null), 1700);
    return () => clearTimeout(t);
  }, [bang]);

  // Đồng hồ màn — đứng yên khi GameShell tạm dừng (prop `paused`).
  const dungRef = useRef(paused);
  dungRef.current = paused;
  const dangDung = () => dungRef.current;
  useEffect(() => {
    if (thang) return;
    const id = window.setInterval(() => { if (!dangDung()) setGiay((g) => g + 1); }, 1000);
    return () => clearInterval(id);
  }, [thang, man]);

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

  const xongDay = useCallback((d: number[], k: number) => {
    const [a, b] = de.cap[k]!;
    const z = d[d.length - 1];
    return d.length >= 2 && ((d[0] === a && z === b) || (d[0] === b && z === a));
  }, [de]);
  const kiemThang = useCallback((ds: number[][]) => ds.every((d, k) => xongDay(d, k)) && new Set(ds.flat()).size === n * n, [xongDay, n]);

  /** Toạ độ tâm ô `o` trong khung gốc (cho bụi sao / điểm bay). */
  const tamO = (o: number) => {
    const g = gocRef.current?.getBoundingClientRect(), r = svgRef.current?.getBoundingClientRect();
    if (!g || !r) return null;
    return { x: r.left - g.left + ((o % n) + 0.5) * (r.width / n), y: r.top - g.top + (Math.floor(o / n) + 0.5) * (r.height / n) };
  };

  /** Ghi bộ dây mới + âm thanh: nối xong một cặp, hay vừa cắt dây khác. */
  const capNhat = (ds: number[][], kDang: number | null) => {
    const cu = dayRef.current;
    dayRef.current = ds;
    setDay(ds);
    let cat = false;
    ds.forEach((d, k) => { if (k !== kDang && d.length < cu[k]!.length) cat = true; });
    const moi = new Set<number>();
    ds.forEach((d, k) => { if (xongDay(d, k)) moi.add(k); });
    let vuaXong = -1;
    for (const k of moi) if (!xongRef.current.has(k)) vuaXong = k;
    xongRef.current = moi;
    if (vuaXong >= 0) {
      sfx('nhat');
      const d = ds[vuaXong]!;
      const p = tamO(d[d.length - 1]!);
      if (p) phaoGiay(gocRef.current, { x: p.x, y: p.y, it: true, mau: [MAU[vuaXong]!, MAU_SANG[vuaXong]!, '#ffffff'] });
    } else if (cat) sfx('truot');
  };

  const oTaiDiem = (x: number, y: number) => {
    const r = svgRef.current?.getBoundingClientRect();
    if (!r) return -1;
    const c = Math.floor(((x - r.left) / r.width) * n), h = Math.floor(((y - r.top) / r.height) * n);
    return c < 0 || h < 0 || c >= n || h >= n ? -1 : h * n + c;
  };

  const xuong = (e: React.PointerEvent) => {
    if (thang) return;
    const o = oTaiDiem(e.clientX, e.clientY);
    if (o < 0) return;
    svgRef.current?.setPointerCapture?.(e.pointerId);
    const k = chamMau.get(o);
    if (k !== undefined) { setDang(k); sfx('chon'); capNhat(dayRef.current.map((d, j) => (j === k ? [o] : d)), k); return; }
    const j = chuO.get(o);
    if (j !== undefined) {
      setDang(j); sfx('bam');
      capNhat(dayRef.current.map((d, i) => (i === j ? d.slice(0, d.indexOf(o) + 1) : d)), j);
    }
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
    const kDang = dangRef.current;
    if (kDang === null || thang) return;
    const o = oTaiDiem(e.clientX, e.clientY);
    if (o < 0) return;
    // Kéo nhanh có thể nhảy cóc qua vài ô — đi lần lượt từng ô ở giữa (theo hàng rồi cột).
    let ds = dayRef.current;
    for (let lap = 0; lap < 2 * n; lap++) {
      const d = ds[kDang]!;
      const cuoi = d[d.length - 1];
      if (cuoi === undefined || cuoi === o) break;
      const rc = Math.floor(cuoi / n), cc = cuoi % n, ro = Math.floor(o / n), co = o % n;
      const tiep = cc !== co ? cuoi + Math.sign(co - cc) : cuoi + Math.sign(ro - rc) * n;
      const moi = buoc(ds, kDang, tiep);
      if (moi === ds) break;
      ds = moi;
    }
    if (ds !== dayRef.current) capNhat(ds, kDang);
  };

  const sangMan = (cong: number) => {
    const tong = diem + cong;
    setDiem(tong);
    hen(() => {
      if (man + 1 >= MAN.length) {
        if (!daBao.current && onScore) { daBao.current = true; onScore(tong, Math.round((Date.now() - t0.current) / 1000)); }
      } else {
        setMan(man + 1);
        setBang({ man: man + 2, k: Date.now() });
        sfx('lenCap');
      }
    }, 1700);
  };

  const thangMan = (ds: number[][], goiYThem = 0) => {
    if (thang || !kiemThang(ds)) return;
    setThang(true);
    const cong = 30 * n + 10 * (man + 1) + Math.max(0, 150 - giay * 2 - (goiY + goiYThem) * 60);
    sfx('combo', { muc: 6 });
    hen(() => sfx('dung'), 160);
    const goc = gocRef.current;
    const p = tamO(Math.floor((n * n) / 2));
    if (goc && p) { diemBay(goc, p.x, p.y, `+${cong}`, '#fde047'); hen(() => phaoGiay(goc), 200); }
    sangMan(cong);
  };

  const len = () => {
    if (dangRef.current === null) return;
    setDang(null);
    thangMan(dayRef.current);
  };

  const lamLai = () => {
    if (thang) return;
    sfx('lat');
    xongRef.current = new Set();
    const rong = de.cap.map(() => [] as number[]);
    dayRef.current = rong;
    setDay(rong);
  };

  const dungGoiY = () => {
    if (thang || goiY >= GOI_Y_MAN) return;
    // Dây đầu tiên chưa khớp lời giải gốc ⇒ đặt đúng như lời giải, cắt các dây đang đè lên nó.
    const k = de.giai.findIndex((g, i) => dayRef.current[i]!.join() !== g.join() && dayRef.current[i]!.join() !== [...g].reverse().join());
    if (k < 0) return;
    const g = de.giai[k]!;
    const ds = dayRef.current.map((d, j) => {
      if (j === k) return [...g];
      const cat = d.findIndex((o) => g.includes(o));
      return cat >= 0 ? d.slice(0, cat) : d;
    });
    setGoiY((x) => x + 1);
    sfx('sao');
    capNhat(ds, k);
    thangMan(ds, 1);
  };

  const boQua = () => {
    if (thang) return;
    sfx('truot');
    setThang(true);
    sangMan(0);
  };

  const phimRef = useRef({ lamLai, dungGoiY, boQua });
  phimRef.current = { lamLai, dungGoiY, boQua };
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (dangDung() || e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (k === 'r') phimRef.current.lamLai();
      else if (k === 'h') phimRef.current.dungGoiY();
      else if (k === 'n') phimRef.current.boQua();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  /* ── Bố cục ── */
  const W = Math.min(kh.w, 1000);
  const H = Math.max(260, kh.h - 52 - 40);
  const ban = Math.floor(Math.max(240, Math.min(W, H, 760)));

  const phu = new Set(day.flat()).size;
  const xy = (o: number) => [(o % n) * 100 + 50, Math.floor(o / n) * 100 + 50] as const;
  const diemDay = (d: number[]) => d.map((o) => xy(o).join(',')).join(' ');
  // Thứ tự ô dọc theo ống (cho sóng sáng khi thắng).
  const thuTu = useMemo(() => {
    const m = new Map<number, number>();
    day.forEach((d) => d.forEach((o, i) => m.set(o, i)));
    return m;
  }, [day]);

  return (
    <div ref={gocRef} className={s.goc} style={{ width: Math.min(W, Math.max(ban, 440)) }}>
      <div className={s.hud}>
        <span className={s.chip}>{vi ? 'Màn' : 'Level'} <b>{man + 1}</b><i>/{MAN.length}</i></span>
        <span className={s.chip}><b>{n}×{n}</b></span>
        <span className={s.chip}><Clock size={13} /> <b>{giay}s</b></span>
        <span className={s.chip}>{vi ? 'Điểm' : 'Score'} <b>{diem}</b></span>
        <span className={s.phu} title={vi ? 'Đã phủ' : 'Filled'}>
          <i style={{ transform: `scaleX(${phu / (n * n)})` }} />
          <b>{Math.round((phu / (n * n)) * 100)}%</b>
        </span>
      </div>

      <svg
        ref={svgRef}
        className={s.ban}
        style={{ width: ban, height: ban }}
        data-thang={thang}
        viewBox={`-8 -8 ${n * 100 + 16} ${n * 100 + 16}`}
        onPointerDown={xuong}
        onPointerMove={di}
        onPointerUp={len}
        onPointerCancel={len}
      >
        <defs>
          {MAU.map((m, k) => (
            <radialGradient key={k} id={`nd-bi${k}`} cx="0.36" cy="0.32" r="0.75">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="0.28" stopColor={MAU_SANG[k]} />
              <stop offset="0.75" stopColor={m} />
              <stop offset="1" stopColor={m} stopOpacity="0.85" />
            </radialGradient>
          ))}
        </defs>
        {Array.from({ length: n * n }, (_, o) => {
          const k = chuO.get(o);
          return (
            <rect
              key={o}
              x={(o % n) * 100 + 4} y={Math.floor(o / n) * 100 + 4} width={92} height={92} rx={18}
              className={s.o}
              data-co={k !== undefined}
              data-song={thang && k !== undefined}
              style={{ fill: k !== undefined ? MAU[k] : undefined, animationDelay: thang ? `${(thuTu.get(o) ?? 0) * 45}ms` : undefined }}
            />
          );
        })}
        {day.map((d, k) => d.length > 1 && (
          <g key={k} className={s.ong} data-dang={dang === k}>
            <polyline points={diemDay(d)} fill="none" stroke={MAU[k]} strokeOpacity={0.2} strokeWidth={52} strokeLinecap="round" strokeLinejoin="round" />
            <polyline points={diemDay(d)} fill="none" stroke={MAU[k]} strokeWidth={34} strokeLinecap="round" strokeLinejoin="round" />
            <polyline points={diemDay(d)} fill="none" stroke="#000" strokeOpacity={0.16} strokeWidth={34} strokeLinecap="round" strokeLinejoin="round" transform="translate(0 5)" />
            <polyline points={diemDay(d)} fill="none" stroke={MAU_SANG[k]} strokeOpacity={0.75} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" transform="translate(-3 -5)" />
            {xongDay(d, k) && <polyline points={diemDay(d)} fill="none" stroke="#fff" strokeOpacity={0.7} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 34" className={s.chay} />}
          </g>
        ))}
        {de.cap.flatMap(([a, b], k) => [a, b].map((o) => {
          const [x, y] = xy(o);
          const xong = xongDay(day[k] ?? [], k);
          return (
            <g key={`${k}-${o}`} className={s.cham} data-xong={xong} data-dang={dang === k}>
              <circle cx={x} cy={y + 4} r={31} fill="#000" fillOpacity={0.28} />
              <circle cx={x} cy={y} r={31} fill={`url(#nd-bi${k})`} />
              <circle cx={x} cy={y} r={31} fill="none" stroke="#fff" strokeOpacity={xong ? 0.95 : 0.35} strokeWidth={xong ? 5 : 3} />
            </g>
          );
        }))}
      </svg>

      <div className={s.chan}>
        <p className={s.goiY}>
          {thang
            ? (man + 1 >= MAN.length ? (vi ? 'Hoàn thành tất cả các màn!' : 'All levels done!') : (vi ? 'Tuyệt! Sang màn tiếp…' : 'Nice! Next level…'))
            : (vi ? 'Kéo từ chấm tới chấm cùng màu · phủ kín mọi ô' : 'Drag between twin dots · fill every cell')}
        </p>
        <div className={s.nutNhom}>
          <button type="button" className={s.nut} onClick={lamLai} disabled={thang} title="R"><RotateCcw size={15} /> {vi ? 'Làm lại' : 'Reset'} <kbd>R</kbd></button>
          <button type="button" className={s.nut} onClick={dungGoiY} disabled={thang || goiY >= GOI_Y_MAN} title="H"><Lightbulb size={15} /> {GOI_Y_MAN - goiY} <kbd>H</kbd></button>
          <button type="button" className={s.nut} onClick={boQua} disabled={thang} title="N"><SkipForward size={15} /> <kbd>N</kbd></button>
        </div>
      </div>

      {bang && (
        <div key={bang.k} className={s.bang} aria-live="polite">
          <small>{vi ? 'Màn' : 'Level'}</small>
          <b>{bang.man}</b>
          <span>{MAN[bang.man - 1]}×{MAN[bang.man - 1]}</span>
        </div>
      )}
    </div>
  );
}
