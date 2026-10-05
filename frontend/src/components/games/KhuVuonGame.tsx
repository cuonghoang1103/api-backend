'use client';

/**
 * Khu vườn CuongMini — game THƯ GIÃN có MÀN (nâng cấp 05/10/2026).
 *
 * 12 "ngày" (màn), mỗi ngày một MỤC TIÊU thu hoạch trong một khoảng giờ. Bầu trời trôi từ
 * bình minh → trưa → hoàng hôn → đêm (sao, đom đóm) theo đồng hồ của ngày. Đạt mục tiêu là
 * sang ngày mới ngay (thưởng giây còn dư), hết giờ mà chưa đạt thì kết thúc. Mỗi ngày mở
 * thêm luống đất, thêm giống cây, thêm thử thách: sâu (ngày 2), cây héo nếu khô lâu + mưa
 * rào (ngày 3), nắng gắt (ngày 5).
 *
 * Chạm luống = hành động theo ngữ cảnh: trống → gieo hạt đang chọn · khô → tưới · có sâu →
 * bắt · chín → thu hoạch (thu liên tiếp trong 2 giây = combo, thưởng thêm) · héo → dọn.
 * Robot CuongMini lướt tới luống vừa chạm. Bàn phím: 1–5 chọn hạt, 6/X cái xẻng, mũi tên
 * di con trỏ, Space/Enter hành động.
 *
 * Điểm = tổng xu THU HOẠCH (kể cả thưởng combo) + thưởng giây dư mỗi ngày (≤30) + 150 nếu
 * qua trọn 12 ngày. Tổng mục tiêu 1.895; thực tế giỏi ~2.300–2.500 < SCORE_CAPS 3.000.
 *
 * Trạng thái sống trong MỘT ref (đồng hồ 200 ms + sự kiện chuột/phím cùng sửa nó), rồi
 * `setNhip` để vẽ lại — không có side effect nào trong updater của setState.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Coins, Shovel, Timer, Sparkles, CloudRain, Sun, Lock, Star } from 'lucide-react';
import type { GameProps } from './registry';
import { sfx } from './shared/amThanh';
import { phaoGiay, diemBay, rung } from './shared/hieuUng';
import s from './khuVuon.module.css';

const N = 4;
const SO_NGAY = 12;
type LoaiCay = 'carot' | 'cachua' | 'dau' | 'huongduong' | 'bingo';
const CAY: Record<LoaiCay, { ten: string; en: string; gia: number; ban: number; giay: number; mo: number; mau: string }> = {
  carot: { ten: 'Cà rốt', en: 'Carrot', gia: 2, ban: 6, giay: 8, mo: 1, mau: '#fb923c' },
  cachua: { ten: 'Cà chua', en: 'Tomato', gia: 4, ban: 11, giay: 12, mo: 2, mau: '#ef4444' },
  dau: { ten: 'Dâu tây', en: 'Strawberry', gia: 6, ban: 17, giay: 16, mo: 4, mau: '#f43f5e' },
  huongduong: { ten: 'Hướng dương', en: 'Sunflower', gia: 9, ban: 26, giay: 21, mo: 6, mau: '#facc15' },
  bingo: { ten: 'Bí ngô', en: 'Pumpkin', gia: 14, ban: 42, giay: 28, mo: 8, mau: '#f97316' },
};
const DS_CAY = Object.keys(CAY) as LoaiCay[];
const MUC_TIEU = [0, 30, 45, 65, 85, 110, 135, 160, 190, 220, 250, 285, 320];
/** Thứ tự mở luống: từ giữa ra ngoài để vườn luôn cân. */
const THU_TU_MO = [5, 6, 9, 10, 1, 4, 2, 8, 7, 13, 11, 14, 0, 3, 12, 15];

function capDo(n: number) {
  return {
    giay: 58 + n * 4,
    mucTieu: MUC_TIEU[n] ?? 320,
    soO: Math.min(16, 5 + n),
    sau: n >= 2 ? 1 / Math.max(24, 60 - n * 3) : 0, // xác suất/giây/cây
    heo: n >= 3,
    mua: n >= 3,
    gat: n >= 5,
  };
}
const ngayMoO = (i: number) => { const k = THU_TU_MO.indexOf(i); return Math.max(1, k - 4); };

type O = { loai: LoaiCay; tienDo: number; nuoc: number; kho: number; sau: boolean; vang: boolean; chet: boolean } | null;
type Cong = 'xeng' | LoaiCay;
type Pha = 'chuyen' | 'choi' | 'het';
type TrangThai = {
  luong: O[]; xu: number; diem: number; ngay: number; thu: number; conLai: number; pha: Pha; chuyenCon: number;
  cong: Cong; combo: number; lanThu: number; tongGiay: number; troi: 'quang' | 'mua' | 'gat'; troiCon: number; henTroi: number;
  robot: number; viec: { loai: 'tuoi' | 'thu' | 'gieo' | 'bat'; den: number } | null; vui: number; troChuot: number; banPhim: boolean;
  thongBao: { chu: string; den: number } | null; thang: boolean; dongHo: number;
};
const taoMoi = (): TrangThai => ({
  luong: Array.from({ length: N * N }, () => null), xu: 20, diem: 0, ngay: 1, thu: 0, conLai: capDo(1).giay, pha: 'chuyen', chuyenCon: 2.6,
  cong: 'carot', combo: 0, lanThu: -9, tongGiay: 0, troi: 'quang', troiCon: 0, henTroi: 16,
  robot: 5, viec: null, vui: 0, troChuot: 5, banPhim: false, thongBao: null, thang: false, dongHo: 0,
});

const tamO = (i: number) => {
  const r = Math.floor(i / N), c = i % N;
  return { x: 500 + (c - r) * 86, y: 231 + (c + r) * 43 };
};

/* ── Màu trời: nội suy hex (không dựa vào color-mix trong thuộc tính SVG) ── */
const hex = (h: string) => [1, 3, 5].map((k) => parseInt(h.slice(k, k + 2), 16));
const tron = (a: string, b: string, k: number) => {
  const A = hex(a), B = hex(b);
  return `rgb(${A.map((v, i) => Math.round(v + (B[i]! - v) * k)).join(',')})`;
};
const MOC_TROI: [number, string, string][] = [
  [0, '#f9a8d4', '#fde68a'], [0.18, '#7dd3fc', '#e0f2fe'], [0.55, '#38bdf8', '#bae6fd'], [0.76, '#fb923c', '#fcd34d'],
  [0.88, '#7c3aed', '#f472b6'], [1, '#1e1b4b', '#4338ca'],
];
function mauTroi(t: number): [string, string] {
  for (let i = 1; i < MOC_TROI.length; i++) {
    const [t1, a1, b1] = MOC_TROI[i]!;
    if (t <= t1) {
      const [t0, a0, b0] = MOC_TROI[i - 1]!;
      const k = (t - t0) / (t1 - t0);
      return [tron(a0, a1, k), tron(b0, b1, k)];
    }
  }
  return ['#1e1b4b', '#4338ca'];
}
const muot = (a: number, b: number, x: number) => { const k = Math.max(0, Math.min(1, (x - a) / (b - a))); return k * k * (3 - 2 * k); };

/* ── Vẽ cây: 4 giai đoạn × 5 loại, gradient + điểm sáng ── */
function La({ x, y, r, d = 15, kho }: { x: number; y: number; r: number; d?: number; kho: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r})`}>
      <path d={`M0 0 C${d * 0.35} ${-d * 0.42} ${d * 0.8} ${-d * 0.38} ${d} 0 C${d * 0.8} ${d * 0.34} ${d * 0.35} ${d * 0.36} 0 0Z`} fill={kho ? 'url(#kv-la-kho)' : 'url(#kv-la)'} />
      <path d={`M1 0 L${d * 0.86} 0`} stroke="#fff" strokeOpacity="0.28" strokeWidth="1" strokeLinecap="round" />
    </g>
  );
}
function Qua({ x, y, r, mau, vang }: { x: number; y: number; r: number; mau: string; vang: boolean }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={vang ? 'url(#kv-q-vang)' : mau} />
      <ellipse cx={x - r * 0.35} cy={y - r * 0.38} rx={r * 0.3} ry={r * 0.2} fill="#fff" opacity="0.6" />
    </g>
  );
}

function VeCay({ l }: { l: NonNullable<O> }) {
  const g = l.chet ? -1 : l.tienDo >= 1 ? 3 : l.tienDo >= 0.55 ? 2 : l.tienDo >= 0.2 ? 1 : 0;
  const kho = l.nuoc <= 0;
  const bong = <ellipse cx="0" cy="2" rx="17" ry="5" fill="#1c0f05" opacity="0.28" />;
  if (g === -1) {
    return (<g>{bong}<path d="M0 0 Q2 -14 10 -18" stroke="#78716c" strokeWidth="3.4" fill="none" strokeLinecap="round" /><La x={9} y={-17} r={60} d={10} kho /><La x={2} y={-8} r={150} d={9} kho /></g>);
  }
  if (g === 0) {
    return (<g>{bong}<ellipse cx="0" cy="-1" rx="10" ry="4.5" fill="#6b4423" /><ellipse cx="-2" cy="-2.5" rx="5" ry="1.6" fill="#a47148" opacity="0.6" />
      <path d="M0 -2 q-1 -6 0 -9" stroke="#4ade80" strokeWidth="2.4" fill="none" strokeLinecap="round" /><La x={0} y={-10} r={-150} d={7} kho={kho} /><La x={0} y={-10} r={-30} d={7} kho={kho} /></g>);
  }
  if (g === 1) {
    return (<g>{bong}<path d="M0 0 q-1.5 -9 0 -17" stroke={kho ? '#a8a29e' : '#4d7c0f'} strokeWidth="3" fill="none" strokeLinecap="round" />
      <La x={0} y={-15} r={-155} d={12} kho={kho} /><La x={0} y={-16} r={-25} d={12} kho={kho} /><La x={0} y={-7} r={200} d={9} kho={kho} /></g>);
  }
  const chin = g === 3;
  const qua = l.vang ? 'url(#kv-q-vang)' : chin ? `url(#kv-q-${l.loai})` : 'url(#kv-q-xanh)';
  const than = (cao: number) => <path d={`M0 0 Q-3 ${-cao / 2} 0 ${-cao}`} stroke={kho ? '#a8a29e' : '#3f6212'} strokeWidth="3.6" fill="none" strokeLinecap="round" />;
  switch (l.loai) {
    case 'carot':
      return (<g>{bong}
        {chin && <><path d="M-8 -2 Q0 4 8 -2 L2 10 Q0 13 -2 10Z" fill={qua} /><ellipse cx="0" cy="-2" rx="8.5" ry="4.2" fill={qua} /><path d="M-4 -1 h5 M-3 3 h4" stroke="#9a3412" strokeOpacity="0.45" strokeWidth="1.2" strokeLinecap="round" /></>}
        {[-58, -78, -100, -122, -140].slice(0, chin ? 5 : 3).map((r, k) => <La key={k} x={0} y={-3} r={r} d={chin ? 22 : 16} kho={kho} />)}
      </g>);
    case 'cachua': {
      const cao = chin ? 38 : 30;
      return (<g>{bong}{than(cao)}
        <La x={0} y={-cao * 0.3} r={-160} d={15} kho={kho} /><La x={0} y={-cao * 0.45} r={-20} d={15} kho={kho} /><La x={0} y={-cao * 0.8} r={-140} d={13} kho={kho} /><La x={0} y={-cao} r={-60} d={12} kho={kho} />
        {(chin ? [[-9, -cao * 0.5, 7], [10, -cao * 0.66, 7.5], [-2, -cao * 0.92, 6.5]] : [[-8, -cao * 0.55, 4.5], [8, -cao * 0.75, 4]]).map(([x, y, r], k) => (
          <g key={k}><Qua x={x!} y={y!} r={r!} mau={qua} vang={l.vang} /><path d={`M${x! - 3} ${y! - r! + 1} l3 2 l3 -2`} stroke="#166534" strokeWidth="1.8" fill="none" strokeLinecap="round" /></g>
        ))}
      </g>);
    }
    case 'dau':
      return (<g>{bong}
        {[-170, -130, -90, -50, -10].map((r, k) => <La key={k} x={0} y={-2} r={r} d={chin ? 19 : 15} kho={kho} />)}
        {!chin && <g><circle cx="-6" cy="-14" r="3.4" fill="#fff" /><circle cx="-6" cy="-14" r="1.3" fill="#facc15" /><circle cx="7" cy="-10" r="3" fill="#fff" /><circle cx="7" cy="-10" r="1.2" fill="#facc15" /></g>}
        {chin && [[-11, -5], [11, -4], [0, -15]].map(([x, y], k) => (
          <g key={k} transform={`translate(${x} ${y})`}><path d="M0 -6 q8 1 7 7 q-2 7 -7 9 q-5 -2 -7 -9 q-1 -6 7 -7z" fill={qua} />
            <g fill="#fef9c3" opacity="0.85"><circle cx="-2.5" cy="0" r="0.8" /><circle cx="2.5" cy="1" r="0.8" /><circle cx="0" cy="4" r="0.8" /></g>
            <path d="M-3 -6 l3 2 l3 -2" stroke="#15803d" strokeWidth="2" fill="none" strokeLinecap="round" /></g>
        ))}
      </g>);
    case 'huongduong': {
      const cao = chin ? 50 : 38;
      return (<g>{bong}{than(cao)}
        <La x={0} y={-cao * 0.3} r={-165} d={17} kho={kho} /><La x={0} y={-cao * 0.42} r={-15} d={17} kho={kho} /><La x={0} y={-cao * 0.7} r={-150} d={12} kho={kho} />
        <g transform={`translate(0 ${-cao})`}>
          {chin ? (<>
            {Array.from({ length: 14 }, (_, i) => <ellipse key={i} cx="0" cy="-13" rx="4.2" ry="9" fill={l.vang ? 'url(#kv-q-vang)' : 'url(#kv-canh)'} transform={`rotate(${i * (360 / 14)})`} />)}
            <circle r="8.5" fill="#78350f" /><circle r="5.5" fill="#92400e" />
            <g fill="#451a03" opacity="0.7"><circle cx="-2.5" cy="-2" r="1" /><circle cx="2.5" cy="-1" r="1" /><circle cx="0" cy="2.5" r="1" /></g>
          </>) : (<><circle r="6" fill="url(#kv-q-xanh)" /><path d="M-5 -2 l5 -6 l5 6" fill="#4d7c0f" /></>)}
        </g>
      </g>);
    }
    case 'bingo':
      return (<g>{bong}
        <La x={-4} y={-2} r={-165} d={20} kho={kho} /><La x={2} y={-4} r={-120} d={17} kho={kho} /><La x={0} y={-3} r={-40} d={18} kho={kho} />
        <g transform={`translate(10 -4) scale(${chin ? 1 : 0.55})`}>
          <ellipse cx="-8" cy="0" rx="9" ry="12" fill={qua} /><ellipse cx="8" cy="0" rx="9" ry="12" fill={qua} /><ellipse cx="0" cy="0" rx="10" ry="13" fill={qua} />
          <path d="M-5 -11 q-2 11 0 22 M5 -11 q2 11 0 22" stroke="#9a3412" strokeOpacity="0.35" strokeWidth="1.4" fill="none" />
          <ellipse cx="-4" cy="-6" rx="3" ry="2" fill="#fff" opacity="0.45" />
          <path d="M0 -12 q1 -6 5 -7" stroke="#4d7c0f" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      </g>);
  }
}

/** Robot CuongMini (SVG) — gốc toạ độ ở chân. */
function CuongMini({ vui, viec }: { vui: boolean; viec: TrangThai['viec'] }) {
  return (
    <g>
      <ellipse cx="0" cy="2" rx="20" ry="6" fill="#1c0f05" opacity="0.28" />
      <g className={s.robotNay}>
        <ellipse cx="-18" cy="-27" rx="5" ry="9" fill="url(#kv-rb)" transform="rotate(25 -18 -27)" />
        <g transform={viec?.loai === 'tuoi' ? 'rotate(-40 18 -30)' : viec?.loai === 'thu' ? 'rotate(-70 18 -30)' : 'rotate(-25 18 -27)'}>
          <ellipse cx="18" cy="-27" rx="5" ry="9" fill="url(#kv-rb)" />
          {viec?.loai === 'tuoi' && (
            <g transform="translate(20 -14)">
              <path d="M-7 -6 h12 v10 a3 3 0 0 1 -3 3 h-6 a3 3 0 0 1 -3 -3z" fill="#38bdf8" /><path d="M5 -3 l10 -6" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
              <g fill="#7dd3fc" className={s.giot}><circle cx="17" cy="-4" r="1.8" /><circle cx="20" cy="1" r="1.5" /><circle cx="16" cy="4" r="1.4" /></g>
            </g>
          )}
        </g>
        <ellipse cx="0" cy="-24" rx="17" ry="19" fill="url(#kv-rb)" />
        <ellipse cx="0" cy="-19" rx="8" ry="7" fill="#c4b5fd" opacity="0.45" />
        <g transform="translate(0 -54)">
          <path d="M3 -18 q2 -9 6 -12" stroke="#a78bfa" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <circle cx="9" cy="-31" r="4" fill="#fde047" className={s.angTen} />
          <ellipse cx="-24" cy="1" rx="4.5" ry="7" fill="#a78bfa" /><ellipse cx="24" cy="1" rx="4.5" ry="7" fill="#a78bfa" />
          <ellipse rx="24" ry="20" fill="url(#kv-rb)" />
          <rect x="-18" y="-11" width="36" height="22" rx="11" fill="#141a3c" />
          {vui ? (
            <g stroke="#5eeefc" strokeWidth="2.6" fill="none" strokeLinecap="round"><path d="M-11 0 q4 -5 8 0" /><path d="M3 0 q4 -5 8 0" /><path d="M-4 4 q4 4 8 0" /></g>
          ) : (
            <g className={s.chop}><ellipse cx="-7" cy="-1" rx="2.8" ry="4" fill="#5eeefc" /><ellipse cx="7" cy="-1" rx="2.8" ry="4" fill="#5eeefc" /><path d="M-3 6 q3 2 6 0" stroke="#5eeefc" strokeWidth="2" fill="none" strokeLinecap="round" /></g>
          )}
          <ellipse cx="-10" cy="-14" rx="7" ry="3" fill="#fff" opacity="0.7" />
        </g>
      </g>
    </g>
  );
}

function MauHat({ loai }: { loai: LoaiCay }) {
  return (
    <svg viewBox="-16 -16 32 32" width="30" height="30" aria-hidden>
      <circle r="11" cy="2" fill={`url(#kv-q-${loai})`} />
      <ellipse cx="-4" cy="-3" rx="3.5" ry="2.2" fill="#fff" opacity="0.6" />
      <path d="M0 -9 q-5 -6 -9 -4 M0 -9 q5 -6 9 -4" stroke="#16a34a" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

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

export default function KhuVuonGame({ onScore, locale = 'vi', paused = false }: Partial<GameProps>) {
  const vi = locale !== 'en';
  const t = (a: string, b: string) => (vi ? a : b);
  const gRef = useRef<TrangThai | null>(null);
  if (!gRef.current) gRef.current = taoMoi();
  const [, setNhip] = useState(0);
  const ve = useCallback(() => setNhip((n) => (n + 1) % 1e9), []);
  const gocRef = useRef<HTMLDivElement>(null);
  const canhRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const onScoreRef = useRef(onScore);
  onScoreRef.current = onScore;
  const daBao = useRef(false);
  const henGio = useRef<number[]>([]);
  const rong = useRongKhung(gocRef, 1000 / 640, 170);

  const dungRef = useRef(paused);
  dungRef.current = paused;
  const tamDung = () => dungRef.current;

  /** Toạ độ SVG → toạ độ trong khung cảnh (cho chữ bay + bụi sao). */
  const manHinh = (x: number, y: number) => {
    const sv = svgRef.current, ca = canhRef.current;
    if (!sv || !ca) return { x: 0, y: 0 };
    const a = sv.getBoundingClientRect(), b = ca.getBoundingClientRect();
    return { x: a.left - b.left + (x / 1000) * a.width, y: a.top - b.top + (y / 640) * a.height };
  };
  const bay = (i: number, chu: string, mau: string, dy = -40) => {
    const o = tamO(i);
    const p = manHinh(o.x, o.y + dy);
    diemBay(canhRef.current, p.x, p.y, chu, mau);
  };
  const bao = (chu: string) => { gRef.current!.thongBao = { chu, den: gRef.current!.dongHo + 2.2 }; };

  const ketThuc = useCallback((thang: boolean) => {
    const G = gRef.current!;
    if (G.pha === 'het') return;
    G.pha = 'het';
    G.thang = thang;
    if (thang) { G.diem += 150; phaoGiay(canhRef.current); }
    const id = window.setTimeout(() => {
      if (daBao.current) return;
      daBao.current = true;
      onScoreRef.current?.(Math.round(G.diem), Math.round(G.tongGiay));
    }, 1900);
    henGio.current.push(id);
  }, []);

  const lenNgay = () => {
    const G = gRef.current!;
    const thuong = Math.min(30, Math.ceil(G.conLai));
    G.diem += thuong;
    if (G.ngay >= SO_NGAY) { ketThuc(true); return; }
    G.ngay++;
    const cd = capDo(G.ngay);
    G.conLai = cd.giay; G.thu = 0; G.pha = 'chuyen'; G.chuyenCon = 2.8; G.combo = 0;
    G.troi = 'quang'; G.troiCon = 0; G.henTroi = 12 + Math.random() * 8;
    sfx('lenCap');
    phaoGiay(canhRef.current);
    if (thuong > 0) { const p = manHinh(500, 120); diemBay(canhRef.current, p.x, p.y, `+${thuong} ${t('thưởng giờ', 'time bonus')}`, '#fde68a'); }
  };

  const hanhDong = (i: number) => {
    const G = gRef.current!;
    if (G.pha !== 'choi' || tamDung()) return;
    const cd = capDo(G.ngay);
    if (!THU_TU_MO.slice(0, cd.soO).includes(i)) { sfx('bam'); bay(i, `${t('Mở ngày', 'Opens day')} ${ngayMoO(i)}`, '#e2e8f0', -10); return; }
    G.robot = i;
    const l = G.luong[i] ?? null;
    if (G.cong === 'xeng') {
      if (l) { G.luong[i] = null; sfx('truot'); bay(i, t('Đã nhổ', 'Dug up'), '#d6d3d1'); }
      ve(); return;
    }
    if (l?.chet) { G.luong[i] = null; sfx('truot'); bay(i, t('Dọn luống', 'Cleared'), '#d6d3d1'); ve(); return; }
    if (l?.sau) {
      l.sau = false; G.xu += 1; G.viec = { loai: 'bat', den: G.dongHo + 0.5 };
      sfx('nhat');
      const o = tamO(i), p = manHinh(o.x - 20, o.y - 40);
      phaoGiay(canhRef.current, { x: p.x, y: p.y, it: true, mau: ['#a3e635', '#4ade80', '#fef08a'] });
      bay(i, t('+1 bắt sâu', '+1 bug'), '#bef264');
      ve(); return;
    }
    if (l && l.tienDo >= 1) {
      const gia = CAY[l.loai].ban * (l.vang ? 2 : 1);
      G.combo = G.dongHo - G.lanThu <= 2 ? G.combo + 1 : 1;
      G.lanThu = G.dongHo;
      const them = G.combo >= 2 ? Math.min(G.combo - 1, 5) : 0;
      G.luong[i] = null;
      G.xu += gia + them; G.diem += gia + them; G.thu += gia + them;
      G.viec = { loai: 'thu', den: G.dongHo + 0.5 }; G.vui = G.dongHo + 1.2;
      sfx(l.vang ? 'sao' : 'dung');
      if (G.combo >= 2) window.setTimeout(() => sfx('combo', { muc: G.combo - 1 }), 90);
      const o = tamO(i), p = manHinh(o.x, o.y - 40);
      phaoGiay(canhRef.current, { x: p.x, y: p.y, it: true, mau: l.vang ? ['#fde047', '#fef9c3', '#facc15', '#ffffff'] : [CAY[l.loai].mau, '#fde68a', '#ffffff', '#86efac'] });
      bay(i, `+${gia}${them ? ` +${them}` : ''}`, l.vang ? '#fde047' : '#fef3c7');
      if (G.thu >= cd.mucTieu) lenNgay();
      ve(); return;
    }
    if (l) {
      if (l.nuoc < 0.9) {
        l.nuoc = 1; l.kho = 0; G.viec = { loai: 'tuoi', den: G.dongHo + 0.7 };
        sfx('lat'); bay(i, t('Tưới', 'Water'), '#7dd3fc', -20);
      } else sfx('bam');
      ve(); return;
    }
    const c = CAY[G.cong];
    if (c.mo > G.ngay) return;
    if (G.xu < c.gia) { sfx('sai'); rung(canhRef.current); bay(i, t('Thiếu xu', 'Not enough coins'), '#fca5a5'); return; }
    G.xu -= c.gia;
    G.luong[i] = { loai: G.cong, tienDo: 0, nuoc: 1, kho: 0, sau: false, vang: Math.random() < 0.06, chet: false };
    G.viec = { loai: 'gieo', den: G.dongHo + 0.4 };
    sfx('chon');
    ve();
  };
  const hanhDongRef = useRef(hanhDong);
  hanhDongRef.current = hanhDong;

  const chonCong = (k: Cong) => {
    const G = gRef.current!;
    if (k !== 'xeng' && CAY[k].mo > G.ngay) { sfx('sai'); return; }
    G.cong = G.cong === k && k === 'xeng' ? 'carot' : k;
    sfx('bam'); ve();
  };
  const chonCongRef = useRef(chonCong);
  chonCongRef.current = chonCong;

  // Đồng hồ ngày + sinh trưởng + thời tiết: mỗi 200 ms.
  useEffect(() => {
    let truoc = performance.now();
    const id = window.setInterval(() => {
      const bayGio = performance.now();
      const dt = Math.max(0, Math.min(0.5, (bayGio - truoc) / 1000));
      truoc = bayGio;
      const G = gRef.current!;
      if (G.pha === 'het' || document.hidden || tamDung()) return;
      G.dongHo += dt;
      if (G.pha === 'chuyen') {
        G.chuyenCon -= dt;
        if (G.chuyenCon <= 0) G.pha = 'choi';
        ve(); return;
      }
      G.tongGiay += dt;
      G.conLai = Math.max(0, G.conLai - dt);
      const cd = capDo(G.ngay);
      // Thời tiết
      if (G.troi !== 'quang') { G.troiCon -= dt; if (G.troiCon <= 0) G.troi = 'quang'; }
      else if (cd.mua) {
        G.henTroi -= dt;
        if (G.henTroi <= 0) {
          G.henTroi = 14 + Math.random() * 10;
          if (cd.gat && Math.random() < 0.45) { G.troi = 'gat'; G.troiCon = 9; bao(t('Nắng gắt! Đất khô nhanh gấp đôi', 'Heatwave! Soil dries twice as fast')); sfx('dem'); }
          else { G.troi = 'mua'; G.troiCon = 7; bao(t('Mưa rào — cả vườn được tưới', 'Rain shower — the whole garden is watered')); sfx('truot'); }
        }
      }
      const mua = G.troi === 'mua', gat = G.troi === 'gat';
      let song = 0;
      G.luong.forEach((l, i) => {
        if (!l || l.chet) return;
        song++;
        if (l.tienDo >= 1) return;
        if (mua) { l.nuoc = 1; l.kho = 0; }
        l.nuoc = Math.max(0, l.nuoc - (dt / 12) * (gat ? 2 : 1));
        if (l.nuoc <= 0) {
          l.kho += dt;
          if (cd.heo && l.kho > 7) {
            l.chet = true; l.sau = false;
            sfx('sai'); rung(canhRef.current); bay(i, t('Héo mất rồi…', 'Withered…'), '#fca5a5');
            return;
          }
        }
        if (!l.sau && l.tienDo > 0.12 && Math.random() < dt * cd.sau) l.sau = true;
        if (l.nuoc > 0 && !l.sau) {
          l.tienDo = Math.min(1, l.tienDo + (dt / CAY[l.loai].giay) * (mua ? 1.25 : 1));
          if (l.tienDo >= 1) sfx('gop');
        }
      });
      // Cứu kẹt: hết xu và không còn cây nào ⇒ CuongMini tặng xu.
      if (song === 0 && G.xu < 2) { G.xu += 4; bao(t('CuongMini tặng bạn 4 xu 💜', 'CuongMini gifts you 4 coins 💜')); sfx('nhat'); }
      if (G.conLai <= 0) ketThuc(false);
      else if (G.conLai < 5.2 && Math.ceil(G.conLai) !== Math.ceil(G.conLai + dt)) sfx('dem');
      ve();
    }, 200);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Bàn phím.
  useEffect(() => {
    const phim = (e: KeyboardEvent) => {
      if (tamDung()) return;
      const G = gRef.current!;
      if (e.key >= '1' && e.key <= '5') { chonCongRef.current(DS_CAY[Number(e.key) - 1]!); return; }
      if (e.key === '6' || e.key === 'x' || e.key === 'X') { chonCongRef.current('xeng'); return; }
      const r = Math.floor(G.troChuot / N), c = G.troChuot % N;
      const di: Record<string, [number, number]> = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
      if (di[e.key]) {
        e.preventDefault();
        const [dr, dc] = di[e.key]!;
        G.troChuot = Math.max(0, Math.min(N - 1, r + dr)) * N + Math.max(0, Math.min(N - 1, c + dc));
        G.banPhim = true; ve(); return;
      }
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); G.banPhim = true; hanhDongRef.current(G.troChuot); }
    };
    window.addEventListener('keydown', phim);
    return () => window.removeEventListener('keydown', phim);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => () => { henGio.current.forEach((id) => window.clearTimeout(id)); }, []);

  /* ── Vẽ ── */
  const G = gRef.current;
  const cd = capDo(G.ngay);
  const moO = new Set(THU_TU_MO.slice(0, cd.soO));
  const tg = G.pha === 'chuyen' ? 0 : 1 - G.conLai / cd.giay;
  const [troiTren, troiDuoi] = mauTroi(tg);
  const dem = muot(0.84, 0.97, tg);
  const gocMt = Math.PI * (1 - Math.min(1, tg / 0.9));
  const mx = 500 + Math.cos(gocMt) * 430, my = 250 - Math.sin(gocMt) * 200;
  const vui = G.vui > G.dongHo;
  const viec = G.viec && G.viec.den > G.dongHo ? G.viec : null;
  const rb = tamO(G.robot);
  const tienDo = Math.min(1, G.thu / cd.mucTieu);
  const moi = DS_CAY.filter((k) => CAY[k].mo === G.ngay);
  const ngayMoiCoGi = [
    ...moi.map((k) => `${t('hạt', 'seed')} ${vi ? CAY[k].ten : CAY[k].en}`),
    ...(G.ngay === 2 ? [t('sâu bắt đầu xuất hiện', 'bugs appear')] : []),
    ...(G.ngay === 3 ? [t('cây khô lâu sẽ héo · có mưa rào', 'dry plants wither · rain showers')] : []),
    ...(G.ngay === 5 ? [t('nắng gắt', 'heatwaves')] : []),
  ];

  return (
    <div ref={gocRef} className={s.goc} style={{ width: rong ?? undefined }}>
      <div className={s.hud}>
        <span className={s.chip} data-loai="ngay"><Sun size={14} /> {t('Ngày', 'Day')} <b>{G.ngay}</b><i>/{SO_NGAY}</i></span>
        <div className={s.mucTieu} title={t('Mục tiêu thu hoạch của ngày', 'Harvest goal for the day')}>
          <div className={s.vach} style={{ transform: `scaleX(${tienDo})` }} />
          <span>{t('Thu hoạch', 'Harvest')} <b>{Math.min(G.thu, cd.mucTieu)}</b> / {cd.mucTieu}</span>
        </div>
        <span className={s.chip}><Coins size={14} /> <b>{G.xu}</b></span>
        <span className={s.chip} data-loai="diem"><Star size={14} /> <b>{Math.round(G.diem)}</b></span>
        <span className={s.chip} data-gap={G.pha === 'choi' && G.conLai < 10}><Timer size={14} /> <b>{Math.ceil(G.conLai)}</b>s</span>
      </div>

      <div ref={canhRef} className={s.canhBoc}>
        <svg ref={svgRef} className={s.canh} viewBox="0 0 1000 640" role="img" aria-label={t('Khu vườn', 'Garden')}>
          <defs>
            <linearGradient id="kv-troi" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={troiTren} /><stop offset="1" stopColor={troiDuoi} /></linearGradient>
            <radialGradient id="kv-mt"><stop offset="0" stopColor="#fffbeb" /><stop offset="0.35" stopColor="#fde68a" stopOpacity="0.9" /><stop offset="1" stopColor="#fde68a" stopOpacity="0" /></radialGradient>
            <radialGradient id="kv-co" cx="0.5" cy="0.35" r="0.7"><stop offset="0" stopColor="#bef264" /><stop offset="0.55" stopColor="#4ade80" /><stop offset="1" stopColor="#16a34a" /></radialGradient>
            <linearGradient id="kv-ben" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4d7c0f" /><stop offset="0.25" stopColor="#7c4a1e" /><stop offset="1" stopColor="#3b2410" /></linearGradient>
            <linearGradient id="kv-dat" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#a47148" /><stop offset="1" stopColor="#6b4423" /></linearGradient>
            <linearGradient id="kv-dat-uot" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#6b4423" /><stop offset="1" stopColor="#3f2611" /></linearGradient>
            <linearGradient id="kv-co-khoa" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#65a30d" /><stop offset="1" stopColor="#3f6212" /></linearGradient>
            <linearGradient id="kv-la" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#86efac" /><stop offset="1" stopColor="#15803d" /></linearGradient>
            <linearGradient id="kv-la-kho" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#e7e5a3" /><stop offset="1" stopColor="#a8a29e" /></linearGradient>
            <radialGradient id="kv-q-carot" cx="0.35" cy="0.3"><stop offset="0" stopColor="#fed7aa" /><stop offset="0.5" stopColor="#fb923c" /><stop offset="1" stopColor="#c2410c" /></radialGradient>
            <radialGradient id="kv-q-cachua" cx="0.35" cy="0.3"><stop offset="0" stopColor="#fecaca" /><stop offset="0.45" stopColor="#ef4444" /><stop offset="1" stopColor="#991b1b" /></radialGradient>
            <radialGradient id="kv-q-dau" cx="0.35" cy="0.3"><stop offset="0" stopColor="#fecdd3" /><stop offset="0.45" stopColor="#f43f5e" /><stop offset="1" stopColor="#9f1239" /></radialGradient>
            <radialGradient id="kv-q-huongduong" cx="0.35" cy="0.3"><stop offset="0" stopColor="#fef9c3" /><stop offset="0.5" stopColor="#facc15" /><stop offset="1" stopColor="#a16207" /></radialGradient>
            <radialGradient id="kv-q-bingo" cx="0.35" cy="0.3"><stop offset="0" stopColor="#fed7aa" /><stop offset="0.5" stopColor="#f97316" /><stop offset="1" stopColor="#9a3412" /></radialGradient>
            <radialGradient id="kv-q-vang" cx="0.35" cy="0.3"><stop offset="0" stopColor="#ffffff" /><stop offset="0.4" stopColor="#fde047" /><stop offset="1" stopColor="#ca8a04" /></radialGradient>
            <radialGradient id="kv-q-xanh" cx="0.35" cy="0.3"><stop offset="0" stopColor="#ecfccb" /><stop offset="0.5" stopColor="#a3e635" /><stop offset="1" stopColor="#4d7c0f" /></radialGradient>
            <linearGradient id="kv-canh" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#f59e0b" /><stop offset="1" stopColor="#fef08a" /></linearGradient>
            <radialGradient id="kv-rb" cx="0.38" cy="0.3" r="0.75"><stop offset="0" stopColor="#ffffff" /><stop offset="0.7" stopColor="#ede9fe" /><stop offset="1" stopColor="#c4b5fd" /></radialGradient>
            <radialGradient id="kv-chin"><stop offset="0" stopColor="#fef08a" stopOpacity="0.75" /><stop offset="1" stopColor="#fef08a" stopOpacity="0" /></radialGradient>
            <linearGradient id="kv-ao" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7dd3fc" /><stop offset="1" stopColor="#0284c7" /></linearGradient>
          </defs>

          {/* Trời + thiên thể */}
          <rect width="1000" height="640" fill="url(#kv-troi)" />
          <g opacity={dem} fill="#fff">
            {[[80, 60], [190, 120], [310, 50], [420, 140], [610, 70], [720, 130], [860, 50], [940, 150], [260, 200], [780, 210]].map(([x, y], k) => (
              <circle key={k} cx={x} cy={y} r={k % 3 ? 1.6 : 2.4} className={s.saoDem} style={{ animationDelay: `${k * 0.37}s` }} />
            ))}
          </g>
          {tg < 0.92 && <g opacity={1 - dem}><circle cx={mx} cy={my} r="90" fill="url(#kv-mt)" /><circle cx={mx} cy={my} r="28" fill="#fff7d6" /></g>}
          {dem > 0 && <g opacity={dem} transform="translate(820 110)"><circle r="26" fill="#f1f5f9" /><circle cx="10" cy="-6" r="24" fill={troiTren} /></g>}
          {/* Đồi xa hai lớp (parallax tĩnh) */}
          <path d="M0 330 Q120 250 240 300 T480 290 T720 280 T1000 300 V640 H0Z" fill="#4c9a6a" opacity="0.45" />
          <path d="M0 380 Q160 310 320 360 T640 350 T1000 360 V640 H0Z" fill="#2f7d55" opacity="0.55" />
          <g className={s.may} opacity={0.9 - dem * 0.5}>
            <g fill="#fff"><ellipse cx="150" cy="95" rx="62" ry="18" /><ellipse cx="190" cy="82" rx="38" ry="22" /><ellipse cx="128" cy="86" rx="26" ry="16" /></g>
            <g fill="#fff" opacity="0.85" transform="translate(600 46)"><ellipse cx="0" cy="40" rx="74" ry="17" /><ellipse cx="38" cy="28" rx="42" ry="21" /></g>
          </g>
          {G.troi === 'mua' && <g fill="#64748b" opacity="0.75"><ellipse cx="300" cy="70" rx="160" ry="40" /><ellipse cx="700" cy="60" rx="180" ry="44" /><ellipse cx="500" cy="40" rx="140" ry="38" /></g>}

          {/* Đảo: bệ đất bo tròn + mặt cỏ */}
          <path d="M500 196 L920 406 L500 616 L80 406 Z" fill="url(#kv-ben)" stroke="#3b2410" strokeWidth="40" strokeLinejoin="round" />
          <path d="M500 150 L920 360 L500 570 L80 360 Z" fill="url(#kv-co)" stroke="#4ade80" strokeWidth="40" strokeLinejoin="round" />
          {/* Trang trí: cây tán tròn, ao, hoa, bụi */}
          {[[312, 262, 0], [690, 262, -1.4]].map(([tx, ty, d], k) => (
            <g key={k} className={s.tan} style={{ animationDelay: `${d}s` }}>
              <ellipse cx={tx} cy={ty! + 4} rx="26" ry="8" fill="#14532d" opacity="0.35" />
              <rect x={tx! - 5} y={ty! - 34} width="10" height="38" rx="4" fill="#7c4a1e" />
              <circle cx={tx} cy={ty! - 50} r="30" fill="#16a34a" /><circle cx={tx! - 18} cy={ty! - 38} r="20" fill="#22c55e" /><circle cx={tx! + 18} cy={ty! - 40} r="19" fill="#15803d" />
              <circle cx={tx! - 8} cy={ty! - 62} r="12" fill="#4ade80" opacity="0.8" />
              {k === 1 && <g fill="#f43f5e"><circle cx={tx! - 10} cy={ty! - 54} r="4" /><circle cx={tx! + 12} cy={ty! - 42} r="4" /><circle cx={tx! - 20} cy={ty! - 34} r="3.5" /></g>}
            </g>
          ))}
          <ellipse cx="852" cy="366" rx="46" ry="18" fill="#0c4a6e" opacity="0.35" />
          <ellipse cx="850" cy="362" rx="44" ry="17" fill="url(#kv-ao)" />
          <ellipse cx="840" cy="357" rx="16" ry="4" fill="#e0f2fe" opacity="0.7" className={s.song} />
          <g transform="translate(866 358)"><ellipse rx="8" ry="3.5" fill="#4ade80" /><circle cx="2" cy="-1" r="2.6" fill="#f9a8d4" /></g>
          {[[150, 372], [190, 400], [262, 440], [380, 500], [620, 500], [740, 440], [800, 410], [470, 538], [540, 540]].map(([fx, fy], k) => (
            <g key={k} transform={`translate(${fx} ${fy})`}>
              <path d="M0 0 v-8" stroke="#15803d" strokeWidth="2" />
              {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx="0" cy="-12" rx="2.6" ry="4" fill={['#f9a8d4', '#fde047', '#c4b5fd', '#fda4af'][k % 4]} transform={`rotate(${a} 0 -8)`} />)}
              <circle cy="-8" r="2" fill="#fff7ed" />
            </g>
          ))}

          <g stroke="#15803d" strokeOpacity="0.5" strokeWidth="2.2" strokeLinecap="round" fill="none">
            {[[230, 330], [180, 380], [300, 430], [420, 520], [600, 520], [700, 450], [790, 330], [640, 200], [380, 205], [250, 410], [760, 400], [500, 175]].map(([x, y], k) => (
              <path key={k} d={`M${x} ${y} q-2 -7 -6 -10 M${x} ${y} q0 -8 1 -12 M${x} ${y} q2 -6 6 -9`} />
            ))}
          </g>
          {/* Luống đất */}
          {G.luong.map((l, i) => {
            const { x, y } = tamO(i);
            const mo = moO.has(i);
            const chon = G.banPhim && G.troChuot === i;
            const P = (a: number, b: number) => `${x + (a + b) * 36} ${y + (b - a) * 18}`;
            return (
              <g key={i} className={s.o} data-mo={mo} onPointerDown={(e) => { e.preventDefault(); gRef.current!.banPhim = false; hanhDong(i); }}>
                {mo ? (<>
                  <path d={`M${x - 72} ${y} L${x} ${y + 36} L${x} ${y + 47} L${x - 72} ${y + 11}Z`} fill="#5b3a1a" />
                  <path d={`M${x + 72} ${y} L${x} ${y + 36} L${x} ${y + 47} L${x + 72} ${y + 11}Z`} fill="#45290f" />
                  <path className={s.mat} d={`M${x} ${y - 36} L${x + 72} ${y} L${x} ${y + 36} L${x - 72} ${y}Z`} fill={l && !l.chet && l.nuoc > 0 ? 'url(#kv-dat-uot)' : 'url(#kv-dat)'} stroke="#3b2410" strokeOpacity="0.35" strokeWidth="1.5" strokeLinejoin="round" />
                  {[-0.5, 0, 0.5].map((b) => <path key={b} d={`M${P(-0.75, b)} L${P(0.75, b)}`} stroke="#2a1708" strokeOpacity="0.22" strokeWidth="3" strokeLinecap="round" />)}
                  {[-0.5, 0, 0.5].map((b) => <path key={`h${b}`} d={`M${P(-0.7, b + 0.1)} L${P(0.7, b + 0.1)}`} stroke="#fff" strokeOpacity="0.08" strokeWidth="2" strokeLinecap="round" />)}
                </>) : (<>
                  <path d={`M${x} ${y - 34} L${x + 68} ${y} L${x} ${y + 34} L${x - 68} ${y}Z`} fill="url(#kv-co-khoa)" opacity="0.55" stroke="#ecfccb" strokeOpacity="0.4" strokeWidth="2" strokeDasharray="7 7" />
                  <g transform={`translate(${x} ${y})`} opacity="0.85">
                    <ellipse cx="-14" cy="4" rx="9" ry="5" fill="#a8a29e" /><ellipse cx="-16" cy="2" rx="4" ry="2" fill="#e7e5e4" />
                    <path d="M10 6 q2 -10 6 -12 M14 6 q0 -9 -4 -12" stroke="#4d7c0f" strokeWidth="2.4" fill="none" strokeLinecap="round" />
                    <text y="-6" textAnchor="middle" className={s.nhanKhoa}>{t('Ngày', 'Day')} {ngayMoO(i)}</text>
                  </g>
                </>)}
                {l && mo && (
                  <g transform={`translate(${x} ${y + 6})`}>
                    {l.tienDo >= 1 && !l.chet && <ellipse cx="0" cy="-2" rx="52" ry="24" fill="url(#kv-chin)" className={s.haoQuang} />}
                    <g className={s.cay} data-chin={l.tienDo >= 1} data-kho={l.nuoc <= 0 && !l.chet}>
                      <g transform="scale(1.9)"><VeCay l={l} /></g>
                    </g>
                    {!l.chet && l.tienDo < 1 && (<g>
                      <rect x="-24" y="18" width="48" height="6" rx="3" fill="#1c0f05" opacity="0.45" />
                      <rect x="-24" y="18" width={48 * l.tienDo} height="6" rx="3" fill={l.sau ? '#facc15' : '#4ade80'} />
                      <rect x="-24" y="25.5" width={48 * l.nuoc} height="2.6" rx="1.3" fill="#38bdf8" />
                    </g>)}
                    {!l.chet && l.nuoc <= 0 && l.tienDo < 1 && (
                      <g transform="translate(30 -58)"><g className={s.nhay} data-gap={l.kho > 3}>
                        <circle r="13" fill="#0c4a6e" opacity="0.55" /><path d="M0 -8 q7 9 0 14 q-7 -5 0 -14z" fill={l.kho > 3 ? '#fb7185' : '#7dd3fc'} />
                      </g></g>
                    )}
                    {l.sau && (
                      <g transform="translate(-22 -36)"><g className={s.sau}>
                        <circle cx="-9" cy="0" r="5.5" fill="#84cc16" /><circle cx="-2" cy="-1" r="6" fill="#65a30d" /><circle cx="6" cy="-3" r="6.5" fill="#84cc16" />
                        <circle cx="8" cy="-5" r="1.8" fill="#fff" /><circle cx="8.5" cy="-5" r="0.9" fill="#111" /><path d="M7 -9 l-1 -5 M10 -9 l2 -5" stroke="#3f6212" strokeWidth="1.4" strokeLinecap="round" />
                      </g></g>
                    )}
                    {l.tienDo >= 1 && !l.chet && <g className={s.lap} fill="#fff"><path d="M24 -66 l2 6 6 2 -6 2 -2 6 -2 -6 -6 -2 6 -2z" /><path d="M-26 -50 l1.5 4 4 1.5 -4 1.5 -1.5 4 -1.5 -4 -4 -1.5 4 -1.5z" /></g>}
                  </g>
                )}
                {chon && <path d={`M${x} ${y - 41} L${x + 80} ${y} L${x} ${y + 41} L${x - 80} ${y}Z`} fill="none" stroke="#fde047" strokeWidth="4" strokeLinejoin="round" className={s.troChuot} />}
              </g>
            );
          })}

          {/* CuongMini lướt tới luống vừa chạm */}
          <g className={s.robot} style={{ transform: `translate(${rb.x - 46}px, ${rb.y - 6}px)` }} pointerEvents="none">
            <g transform="scale(0.85)"><CuongMini vui={vui} viec={viec} /></g>
          </g>

          {/* Bướm, mưa, đêm, đom đóm */}
          <g className={s.buom} pointerEvents="none"><g className={s.vay}><path d="M0 0 q-14 -16 -18 0 q4 12 18 0 q14 -16 18 0 q-4 12 -18 0z" fill="#f0abfc" /><circle r="2" fill="#701a75" /></g></g>
          <g className={s.buom2} pointerEvents="none"><g className={s.vay}><path d="M0 0 q-11 -13 -14 0 q3 10 14 0 q11 -13 14 0 q-3 10 -14 0z" fill="#fde68a" /></g></g>
          {G.troi === 'gat' && <rect width="1000" height="640" fill="#f97316" opacity="0.13" pointerEvents="none" className={s.gat} />}
          {dem > 0 && <rect width="1000" height="640" fill="#0b1033" opacity={dem * 0.38} pointerEvents="none" />}
          {G.troi === 'mua' && (
            <g className={s.mua} pointerEvents="none" stroke="#e0f2fe" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round">
              {Array.from({ length: 46 }, (_, k) => { const x = (k * 97) % 1040 - 20, y = (k * 151) % 640; return <path key={k} d={`M${x} ${y} l-8 22 M${x} ${y - 640} l-8 22`} />; })}
            </g>
          )}
          {dem > 0.05 && (
            <g opacity={dem} pointerEvents="none">
              {[[220, 330], [400, 260], [640, 300], [780, 420], [300, 470], [560, 430], [720, 250], [150, 420]].map(([x, y], k) => (
                <circle key={k} cx={x} cy={y} r="3" fill="#fef08a" className={s.domDom} style={{ animationDelay: `${k * -0.7}s` }} />
              ))}
            </g>
          )}
        </svg>

        {G.thongBao && G.thongBao.den > G.dongHo && <div key={G.thongBao.chu + Math.floor(G.thongBao.den)} className={s.thongBao}>{G.troi === 'mua' ? <CloudRain size={15} /> : G.troi === 'gat' ? <Sun size={15} /> : <Sparkles size={15} />} {G.thongBao.chu}</div>}
        {G.combo >= 2 && G.dongHo - G.lanThu < 2 && G.pha === 'choi' && <div key={`c${G.combo}`} className={s.combo}>Combo ×{G.combo}</div>}

        {G.pha === 'chuyen' && (
          <div key={`n${G.ngay}`} className={s.bang}>
            <small>{G.ngay === 1 ? t('Bắt đầu', 'Start') : t('Lên cấp!', 'Level up!')}</small>
            <b>{t('Ngày', 'Day')} {G.ngay}</b>
            <span>{t('Mục tiêu', 'Goal')}: <strong>{cd.mucTieu}</strong> {t('xu thu hoạch trong', 'coins harvested in')} <strong>{cd.giay}</strong>s</span>
            {ngayMoiCoGi.length > 0 && <em>{t('Mới', 'New')}: {ngayMoiCoGi.join(' · ')}</em>}
          </div>
        )}
        {G.pha === 'het' && (
          <div className={s.bang} data-het>
            <small>{G.thang ? t('Xuất sắc!', 'Amazing!') : t('Hết giờ', 'Time’s up')}</small>
            <b>{G.thang ? t('Trọn 12 ngày!', 'All 12 days!') : `${t('Dừng ở ngày', 'Stopped on day')} ${G.ngay}`}</b>
            <span>{t('Điểm', 'Score')}: <strong>{Math.round(G.diem)}</strong></span>
          </div>
        )}
      </div>

      <div className={s.congCu}>
        {DS_CAY.map((k, idx) => {
          const khoa = CAY[k].mo > G.ngay;
          return (
            <button key={k} type="button" data-chon={G.cong === k} data-khoa={khoa} data-thieu={!khoa && G.xu < CAY[k].gia} onClick={() => chonCong(k)} style={{ ['--m' as string]: CAY[k].mau }}>
              <kbd>{idx + 1}</kbd>
              {khoa ? <span className={s.khoaIcon}><Lock size={16} /></span> : <MauHat loai={k} />}
              <b>{vi ? CAY[k].ten : CAY[k].en}</b>
              <small>{khoa ? `${t('Ngày', 'Day')} ${CAY[k].mo}` : <>{CAY[k].gia}→{CAY[k].ban} · {CAY[k].giay}s</>}</small>
            </button>
          );
        })}
        <button type="button" data-chon={G.cong === 'xeng'} onClick={() => chonCong('xeng')} style={{ ['--m' as string]: '#a8a29e' }}>
          <kbd>6</kbd><span className={s.khoaIcon}><Shovel size={18} /></span><b>{t('Nhổ', 'Dig')}</b><small>{t('dọn luống', 'clear plot')}</small>
        </button>
      </div>
      <p className={s.goiY}>
        {t('Chạm luống: trống → gieo · khô → tưới · có sâu → bắt · lấp lánh → thu hoạch (liên tiếp = combo). Phím 1–6 chọn công cụ, mũi tên + Space.',
          'Tap a plot: empty → sow · dry → water · bug → catch · sparkling → harvest (quick chain = combo). Keys 1–6 pick tools, arrows + Space.')}
      </p>
    </div>
  );
}
