'use client';
/**
 * 🐼 Gấu trúc Bíp — vector SVG phong cách Duolingo (09/11/2026; người dùng duyệt "cute hơn rồi, phải như này chứ").
 *
 * Một khối thân–đầu liền hình hạt đậu (đầu ~60 %, không cổ), mảng màu phẳng + một lớp bóng nhạt, không viền đen dày.
 * Mắt RẤT TO đặt thấp, cách xa nhau; mảng đen quanh mắt là giọt nước nghiêng xuống ngoài; tai tròn nhỏ; má hồng;
 * mũi tam giác bo; miệng nhỏ. Tay là hai mẩu ngắn mập dính sườn vẽ TRƯỚC thân (vẫy như cánh Duo), chân hai mẩu.
 *
 * BIỂU CẢM (bảng `EMO`): mỗi cảm xúc = kiểu thân (CSS data-than) + kiểu mắt + kiểu miệng + góc hai tay (CSS var) +
 * đạo cụ (nhóm SVG ẩn/hiện: kính lúp, mũ cử nhân, bút + tick, ngọn lửa, mũ tiệc + pháo giấy, tim, sao, Zzz, "…",
 * nước mắt, giọt mồ hôi). Nhóm "vắng lâu": miss (mắt long lanh ngấn nước, ôm mình), lonely (ngồi thu lu, nhìn xuống),
 * comeback (bật dậy mừng rỡ).
 *
 * Chuyển động = CSS (GauBip.module.css); không dùng framer-motion cho SVG (bản 11 không ghi transform cho <g> ở
 * đây). Chớp mắt ngẫu nhiên, đồng tử theo con trỏ, miệng mấp máy theo lịch âm tiết của giongGau.ts.
 * `prefers-reduced-motion` ⇒ chỉ chớp mắt + tư thế tĩnh. Không canvas, không ảnh — chạy y hệt trong app desktop.
 *
 * API: emotion · talking · size · variant · vayKey · saoKey · onClick · className · nhinTheoTro (giữ từ bản cũ).
 */
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { dangNoi, docMieng } from './giongGau';
import s from './GauBip.module.css';

export type CamXucGau =
  | 'happy' | 'cheer' | 'sad' | 'think' | 'surprised' | 'sleep'
  | 'inspect' | 'grade' | 'correct' | 'wrong' | 'encourage' | 'love' | 'streak' | 'celebrate' | 'sleepy'
  | 'miss' | 'lonely' | 'comeback';
export type VariantGau = 'bip' | 'sensei' | 'zippy' | 'grumpy' | 'sage';

/* ── Màu ── */
const NGA = '#F7F5F0';
const NGA_BONG = '#E3DED2';
const THAN = '#2B2D35';
const THAN_SANG = '#3A3D47';
const MA = '#FF9EB5';
const MIENG = '#4A2530';
const LUOI = '#F472B6';
const KHAN: Record<VariantGau, string> = { bip: '#F59E0B', sensei: '#8B5CF6', zippy: '#22D3EE', grumpy: '#94A3B8', sage: '#EAB308' };

/** Tỉ lệ khuôn mặt. */
export type KhuonMat = {
  matX: number; matY: number; matRx: number; matRy: number; nguoi: number;
  vanhRx: number; vanhRy: number; vanhGoc: number; vanhDx: number; vanhDy: number;
  tai: number; taiX: number; taiY: number; mui: number;
};
/** Các phương án đã so (ảnh scratchpad): B = bản người dùng duyệt 09/11; F/G = mắt to hơn, mặt mềm hơn (đợt 2). */
export const KHUON_THU: Record<'B' | 'F' | 'G', KhuonMat> = {
  B: { matX: 28, matY: 98, matRx: 14, matRy: 16.5, nguoi: 10.5, vanhRx: 24, vanhRy: 30, vanhGoc: 28, vanhDx: -1, vanhDy: -5, tai: 20, taiX: 50, taiY: 38, mui: 0.9 },
  F: { matX: 28.5, matY: 100, matRx: 15.5, matRy: 18, nguoi: 11.8, vanhRx: 25.5, vanhRy: 32, vanhGoc: 27, vanhDx: -1, vanhDy: -5, tai: 20, taiX: 50, taiY: 38, mui: 0.85 },
  G: { matX: 29, matY: 101, matRx: 16.5, matRy: 19.5, nguoi: 12.6, vanhRx: 26.5, vanhRy: 33.5, vanhGoc: 30, vanhDx: -1.5, vanhDy: -5.5, tai: 21, taiX: 51, taiY: 37, mui: 0.8 },
};
const KHUON_MAC_DINH: KhuonMat = KHUON_THU.F;

/* Thân: hạt đậu — đầu rộng (y≈80), hơi thắt ở y≈140, đáy tròn. */
const THAN_D = 'M100 20 C146 20 176 50 176 82 C176 108 170 124 168 140 C166 166 142 184 100 184 C58 184 34 166 32 140 C30 124 24 108 24 82 C24 50 54 20 100 20 Z';
/* Giọt nước quanh mắt (toạ độ cục bộ, tâm 0,0; đáy hơi nhọn). */
const vanhD = (rx: number, ry: number) =>
  `M0 ${-ry} C${rx * 0.62} ${-ry} ${rx} ${-ry * 0.38} ${rx * 0.95} ${ry * 0.2} C${rx * 0.9} ${ry * 0.78} ${rx * 0.55} ${ry * 1.08} 0 ${ry * 1.08} C${-rx * 0.55} ${ry * 1.08} ${-rx * 0.9} ${ry * 0.78} ${-rx * 0.95} ${ry * 0.2} C${-rx} ${-ry * 0.38} ${-rx * 0.62} ${-ry} 0 ${-ry} Z`;
/* Tim (tâm 0,0, cao ~2r). */
const timD = (r: number) => `M0 ${r * 0.9} C${-r * 1.3} ${r * 0.1} ${-r * 1.1} ${-r} 0 ${-r * 0.45} C${r * 1.1} ${-r} ${r * 1.3} ${r * 0.1} 0 ${r * 0.9} Z`;

type KieuMat = 'thuong' | 'cuoi' | 'buon' | 'ngu' | 'to' | 'nheo' | 'tim' | 'longlanh' | 'xuong';
type KieuMieng = 'cuoi' | 'meu' | 'thang' | 'nho';
type Dao = 'kinhlup' | 'mucunhan' | 'but' | 'tick' | 'lua' | 'nontiec' | 'confetti' | 'timbay' | 'sao' | 'zzz' | 'cham' | 'nuocmat' | 'mohoi' | 'lapLanh';
type May = 'buon' | 'nhuong' | 'none';

type CauHinh = { than: string; mat: KieuMat; mieng: KieuMieng; mo: number; tp: number; tt: number; dao: Dao[]; may: May };
/** Bảng cảm xúc. `tp/tt`: góc tay phải/trái (độ, âm = vung ra ngoài-lên với tay phải). `mo`: miệng mở nền 0–1. */
const EMO: Record<CamXucGau, CauHinh> = {
  happy:     { than: 'tho',    mat: 'thuong',   mieng: 'cuoi',  mo: 0.08, tp: 0,    tt: 0,    dao: [], may: 'none' },
  cheer:     { than: 'nhay',   mat: 'cuoi',     mieng: 'cuoi',  mo: 0.75, tp: -135, tt: 135,  dao: ['sao'], may: 'none' },
  sad:       { than: 'ru',     mat: 'buon',     mieng: 'meu',   mo: 0,    tp: 8,    tt: -8,   dao: ['nuocmat'], may: 'buon' },
  think:     { than: 'nghieng', mat: 'thuong',  mieng: 'thang', mo: 0,    tp: 100,  tt: 0,    dao: ['cham'], may: 'nhuong' },
  surprised: { than: 'giat',   mat: 'to',       mieng: 'cuoi',  mo: 1,    tp: -60,  tt: 60,   dao: ['lapLanh'], may: 'none' },
  sleep:     { than: 'ngu',    mat: 'ngu',      mieng: 'thang', mo: 0,    tp: 0,    tt: 0,    dao: ['zzz'], may: 'none' },
  inspect:   { than: 'cui',    mat: 'nheo',     mieng: 'nho',   mo: 0,    tp: 100,  tt: 0,    dao: ['kinhlup'], may: 'none' },
  grade:     { than: 'tho',    mat: 'thuong',   mieng: 'nho',   mo: 0,    tp: 0,    tt: 0,    dao: ['mucunhan'], may: 'none' },
  correct:   { than: 'yeu',    mat: 'cuoi',     mieng: 'cuoi',  mo: 0.3,  tp: -60,  tt: 0,    dao: ['but', 'tick'], may: 'none' },
  wrong:     { than: 'nghieng2', mat: 'thuong', mieng: 'nho',   mo: 0.15, tp: -50,  tt: 0,    dao: ['mohoi'], may: 'buon' },
  encourage: { than: 'nghieng2', mat: 'thuong', mieng: 'cuoi',  mo: 0.1,  tp: -50,  tt: 0,    dao: [], may: 'none' },
  love:      { than: 'yeu',    mat: 'tim',      mieng: 'cuoi',  mo: 0.35, tp: 35,   tt: -35,  dao: ['timbay'], may: 'none' },
  streak:    { than: 'tho',    mat: 'cuoi',     mieng: 'cuoi',  mo: 0.4,  tp: -60,  tt: 0,    dao: ['lua'], may: 'none' },
  celebrate: { than: 'nhay',   mat: 'cuoi',     mieng: 'cuoi',  mo: 0.8,  tp: -135, tt: 135,  dao: ['nontiec', 'confetti'], may: 'none' },
  sleepy:    { than: 'lac',    mat: 'buon',     mieng: 'cuoi',  mo: 0.9,  tp: 0,    tt: 0,    dao: ['zzz'], may: 'none' },
  miss:      { than: 'om',     mat: 'longlanh', mieng: 'meu',   mo: 0,    tp: 42,   tt: -42,  dao: [], may: 'buon' },
  lonely:    { than: 'ngoi',   mat: 'xuong',    mieng: 'thang', mo: 0,    tp: 38,   tt: -38,  dao: [], may: 'buon' },
  comeback:  { than: 'batday', mat: 'cuoi',     mieng: 'cuoi',  mo: 0.7,  tp: -135, tt: 135,  dao: ['lapLanh', 'sao'], may: 'none' },
};
const SAO_MAU = ['#FBBF24', '#F472B6', '#A78BFA', '#34D399'];
const CONFETTI_MAU = ['#F472B6', '#FBBF24', '#34D399', '#60A5FA', '#A78BFA', '#F97316'];

export default function GauBip({
  emotion = 'happy',
  talking = false,
  size = 200,
  variant = 'bip',
  vayKey,
  saoKey,
  className = '',
  nhinTheoTro = true,
  onClick,
  ariaLabel,
  khuon,
}: {
  emotion?: CamXucGau;
  talking?: boolean;
  /** Cạnh khung vuông (px); `0` = lấp đầy khối cha. */
  size?: number;
  variant?: VariantGau;
  /** Đổi giá trị ⇒ vẫy tay một lượt. */
  vayKey?: number;
  /** Đổi giá trị ⇒ bung sao một lượt (ngoài cheer). */
  saoKey?: number;
  className?: string;
  nhinTheoTro?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
  /** Tinh chỉnh khuôn mặt — chỉ dùng khi so phương án. */
  khuon?: KhuonMat;
}) {
  const K = khuon ?? KHUON_MAC_DINH;
  const E = EMO[emotion] ?? EMO.happy;
  const goc = useRef<HTMLDivElement>(null);
  const nguoiT = useRef<SVGGElement>(null);
  const nguoiP = useRef<SVGGElement>(null);
  const miengMo = useRef<SVGEllipseElement>(null);
  const luoi = useRef<SVGEllipseElement>(null);
  const miengNet = useRef<SVGPathElement>(null);
  const [nham, setNham] = useState(false);
  const [vayLan, setVayLan] = useState(0);
  const [saoLan, setSaoLan] = useState(0);
  const talkingRef = useRef(talking); talkingRef.current = talking;
  const camRef = useRef(emotion); camRef.current = emotion;

  /* Chớp mắt ngẫu nhiên 2,5–5,5 s (giữ cả khi giảm chuyển động — thứ duy nhất còn lại). */
  useEffect(() => {
    if (E.mat === 'ngu' || E.mat === 'cuoi' || E.mat === 'tim') return;
    let hen: ReturnType<typeof setTimeout>;
    let song = true;
    const lap = () => {
      hen = setTimeout(() => {
        if (!song) return;
        setNham(true);
        setTimeout(() => { if (song) setNham(false); }, 110);
        lap();
      }, 2500 + Math.random() * 3000);
    };
    lap();
    return () => { song = false; clearTimeout(hen); };
  }, [E.mat]);

  /* Đồng tử: theo con trỏ (ghi thẳng attribute) + lệch theo cảm xúc (nghĩ: liếc lên; cô đơn: nhìn xuống). */
  useEffect(() => {
    const lech = (): [number, number] => {
      const c = camRef.current;
      if (c === 'think') return [3, -5];
      if (c === 'lonely') return [0, 5];
      if (c === 'inspect') return [2, 2];
      return [0, 0];
    };
    const dat = (dx: number, dy: number) => {
      const t = `translate(${dx.toFixed(2)} ${dy.toFixed(2)})`;
      nguoiT.current?.setAttribute('transform', t);
      nguoiP.current?.setAttribute('transform', t);
    };
    const [lx, ly] = lech();
    dat(lx, ly);
    const giam = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    if (giam || !nhinTheoTro) return;
    let nx = 0, ny = 0, mx = 0, my = 0, raf = 0;
    const onTro = (e: PointerEvent) => {
      const r = goc.current?.getBoundingClientRect();
      if (!r) return;
      mx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (window.innerWidth * 0.45)));
      my = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height * 0.45)) / (window.innerHeight * 0.45)));
      if (!raf) raf = requestAnimationFrame(buoc);
    };
    const buoc = () => {
      raf = 0;
      nx += (mx - nx) * 0.18; ny += (my - ny) * 0.18;
      const [ax, ay] = lech();
      dat(nx * 4.2 + ax, ny * 3.2 + ay);
      if (Math.abs(mx - nx) > 0.002 || Math.abs(my - ny) > 0.002) raf = requestAnimationFrame(buoc);
    };
    window.addEventListener('pointermove', onTro, { passive: true });
    return () => { window.removeEventListener('pointermove', onTro); if (raf) cancelAnimationFrame(raf); };
  }, [nhinTheoTro, emotion]);

  /* Miệng: theo giọng (lịch âm tiết) hoặc tự mấp máy khi talking, không thì theo cảm xúc. */
  useEffect(() => {
    let raf = 0, t0 = performance.now();
    const dat = (mo: number) => {
      const m = Math.max(0, Math.min(1, mo));
      miengMo.current?.setAttribute('ry', (1.5 + 8.5 * m).toFixed(2));
      miengMo.current?.setAttribute('rx', (5.5 + 3 * m).toFixed(2));
      miengMo.current?.setAttribute('opacity', m > 0.12 ? '1' : '0');
      luoi.current?.setAttribute('opacity', m > 0.35 ? '1' : '0');
      luoi.current?.setAttribute('ry', (2 + 3.5 * m).toFixed(2));
      miengNet.current?.setAttribute('opacity', m > 0.12 ? '0' : '1');
    };
    const buoc = (now: number) => {
      raf = requestAnimationFrame(buoc);
      const nen = EMO[camRef.current]?.mo ?? 0.08;
      if (dangNoi()) dat(Math.max(nen * 0.3, docMieng()));
      else if (talkingRef.current) { const t = (now - t0) / 1000; dat(0.2 + 0.5 * Math.abs(Math.sin(t * 11) * Math.sin(t * 3.3 + 1))); }
      else { dat(nen); cancelAnimationFrame(raf); raf = 0; }
    };
    if (talking || dangNoi()) { t0 = performance.now(); raf = requestAnimationFrame(buoc); } else dat(E.mo);
    return () => { if (raf) cancelAnimationFrame(raf); };
  }, [talking, emotion, E.mo]);

  useEffect(() => { if (vayKey) setVayLan((n) => n + 1); }, [vayKey]);
  useEffect(() => { if (saoKey) setSaoLan((n) => n + 1); }, [saoKey]);

  const kieuMat: KieuMat = E.mat;
  const kich = size > 0 ? { width: size, height: size } : undefined;
  const mauKhan = KHAN[variant];
  const co = (d: Dao) => E.dao.includes(d);
  const coSao = co('sao') || saoLan > 0;
  const ey = K.matY;

  /* Miệng nét theo kiểu. */
  const miengD =
    E.mieng === 'meu' ? `M93 ${ey + 38} Q100 ${ey + 31} 107 ${ey + 38}`
      : E.mieng === 'thang' ? `M95 ${ey + 35} L105 ${ey + 35}`
        : E.mieng === 'nho' ? `M96 ${ey + 33} Q100 ${ey + 37} 104 ${ey + 33}`
          : `M92 ${ey + 32} Q100 ${ey + 41} 108 ${ey + 32}`;

  return (
    <div
      ref={goc}
      className={`relative inline-block select-none ${onClick ? s.bam : ''} ${className}`}
      style={{ ...kich, color: 'var(--border-color, transparent)' }}
      onClick={onClick}
      role={onClick ? 'button' : 'img'}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
      aria-label={ariaLabel ?? 'Gấu trúc Bíp'}
    >
      <svg viewBox="0 0 200 200" width="100%" height="100%" className={s.svg}>
        <defs>
          <clipPath id="gau-than"><path d={THAN_D} /></clipPath>
        </defs>
        {/* Bóng dưới chân */}
        <ellipse className={s.bong} data-than={E.than} cx="100" cy="193" rx="52" ry="6.5" fill="#000" opacity="0.13" />

        {/* Pháo giấy rơi (celebrate) — ngoài thân để không nhún theo */}
        {co('confetti') && Array.from({ length: 14 }, (_, i) => (
          <rect key={i} className={s.confetti} x={14 + ((i * 37) % 172)} y={-10} width={i % 3 === 0 ? 5 : 7} height={i % 2 ? 4 : 9} rx="1"
            fill={CONFETTI_MAU[i % CONFETTI_MAU.length]} style={{ animationDelay: `${(i % 7) * 0.33}s`, animationDuration: `${2.4 + (i % 4) * 0.4}s` }} />
        ))}

        <g className={s.than} data-than={E.than} style={{ ['--tp' as string]: `${E.tp}deg`, ['--tt' as string]: `${E.tt}deg` } as CSSProperties}>
          {/* Tai */}
          <g className={s.tai}>
            <circle cx={K.taiX} cy={K.taiY} r={K.tai} fill={THAN} stroke="currentColor" strokeWidth="1.5" />
            <circle cx={K.taiX + 1} cy={K.taiY + 2} r={K.tai * 0.5} fill={THAN_SANG} opacity="0.6" />
          </g>
          <g className={`${s.tai} ${s.taiP}`}>
            <circle cx={200 - K.taiX} cy={K.taiY} r={K.tai} fill={THAN} stroke="currentColor" strokeWidth="1.5" />
            <circle cx={200 - K.taiX - 1} cy={K.taiY + 2} r={K.tai * 0.5} fill={THAN_SANG} opacity="0.6" />
          </g>

          {/* Chân */}
          <ellipse cx="74" cy="183" rx="17" ry="9" fill={THAN} stroke="currentColor" strokeWidth="1.5" />
          <ellipse cx="126" cy="183" rx="17" ry="9" fill={THAN} stroke="currentColor" strokeWidth="1.5" />

          {/* Thân + lớp bóng nhạt */}
          <g clipPath="url(#gau-than)">
            <path d={THAN_D} fill={NGA_BONG} />
            <path d={THAN_D} fill={NGA} transform="translate(-5 -7)" />
          </g>

          {/* Khăn cổ theo vai (Gấu Lười đội mũ ngủ thay khăn) */}
          {variant !== 'grumpy' && (
            <g>
              <path d="M62 141 Q100 158 138 141 Q100 167 62 141 Z" fill={mauKhan} />
              <path d="M62 141 Q100 158 138 141 Q100 163 62 141 Z" fill="#000" opacity="0.1" />
              <path d="M127 150 Q141 160 135 175 Q123 166 127 150 Z" fill={mauKhan} />
              <circle cx="128" cy="150" r="5.2" fill={mauKhan} stroke="#000" strokeOpacity="0.15" strokeWidth="1.5" />
            </g>
          )}

          {/* Tay — vẽ TRƯỚC thân như cánh Duo; góc theo CSS var --tt/--tp, gốc xoay ở vai */}
          <g className={s.tayT}>
            <ellipse cx="36" cy="138" rx="10.5" ry="20" fill={THAN} stroke="currentColor" strokeWidth="1.5" transform="rotate(16 36 138)" />
          </g>
          <g key={vayLan} className={`${s.tayP} ${vayLan > 0 ? s.vay : ''}`}>
            <ellipse cx="164" cy="138" rx="10.5" ry="20" fill={THAN} stroke="currentColor" strokeWidth="1.5" transform="rotate(-16 164 138)" />
          </g>

          {/* Má */}
          <ellipse cx={100 - K.matX - 18} cy={ey + 19} rx="9.5" ry="6" fill={MA} opacity="0.85" />
          <ellipse cx={100 + K.matX + 18} cy={ey + 19} rx="9.5" ry="6" fill={MA} opacity="0.85" />

          {/* Vành mắt — giọt nước nghiêng xuống ngoài */}
          <path d={vanhD(K.vanhRx, K.vanhRy)} fill={THAN} transform={`translate(${100 - K.matX + K.vanhDx} ${ey + K.vanhDy}) rotate(${K.vanhGoc})`} />
          <path d={vanhD(K.vanhRx, K.vanhRy)} fill={THAN} transform={`translate(${100 + K.matX - K.vanhDx} ${ey + K.vanhDy}) rotate(${-K.vanhGoc})`} />

          {/* Lông mày */}
          {E.may === 'buon' && (
            <g className={s.dao} stroke={THAN} strokeWidth="4" strokeLinecap="round" fill="none">
              <path d={`M${100 - K.matX - 2} ${ey - K.vanhRy - 12} L${100 - K.matX - 16} ${ey - K.vanhRy - 4}`} />
              <path d={`M${100 + K.matX + 2} ${ey - K.vanhRy - 12} L${100 + K.matX + 16} ${ey - K.vanhRy - 4}`} />
            </g>
          )}
          {E.may === 'nhuong' && (
            <path className={s.dao} d={`M${100 + K.matX - 12} ${ey - K.vanhRy - 14} Q${100 + K.matX} ${ey - K.vanhRy - 20} ${100 + K.matX + 12} ${ey - K.vanhRy - 12}`} stroke={THAN} strokeWidth="4" strokeLinecap="round" fill="none" />
          )}

          {/* Mắt */}
          {[-1, 1].map((sg) => {
            const ex = 100 + sg * K.matX;
            const ref = sg < 0 ? nguoiT : nguoiP;
            const mo = kieuMat === 'thuong' || kieuMat === 'to' || kieuMat === 'buon' || kieuMat === 'nheo' || kieuMat === 'longlanh' || kieuMat === 'xuong';
            const nguoiR = K.nguoi * (kieuMat === 'to' ? 0.85 : kieuMat === 'longlanh' ? 1.08 : 1);
            return (
              <g key={sg}>
                <g className={s.mat} data-kieu={kieuMat} data-nham={nham && mo ? '1' : '0'} opacity={mo ? 1 : 0}>
                  <ellipse cx={ex} cy={ey} rx={K.matRx} ry={K.matRy} fill="#fff" />
                  <g ref={ref}>
                    <circle cx={ex} cy={ey + 1} r={nguoiR} fill={THAN} />
                    <circle cx={ex - nguoiR * 0.38} cy={ey - nguoiR * 0.42} r={nguoiR * (kieuMat === 'longlanh' ? 0.5 : 0.42)} fill="#fff" />
                    <circle cx={ex + nguoiR * 0.35} cy={ey + nguoiR * 0.4} r={nguoiR * (kieuMat === 'longlanh' ? 0.26 : 0.2)} fill="#fff" />
                  </g>
                  {/* mí trên: buồn / nheo */}
                  {(kieuMat === 'buon' || kieuMat === 'nheo') && <ellipse cx={ex} cy={ey - K.matRy * 0.6} rx={K.matRx + 1} ry={K.matRy * (kieuMat === 'nheo' ? 0.62 : 0.55)} fill={THAN} />}
                  {kieuMat === 'nheo' && <ellipse cx={ex} cy={ey + K.matRy * 0.75} rx={K.matRx + 1} ry={K.matRy * 0.3} fill={THAN} />}
                  {/* ngấn nước (nhớ) */}
                  {kieuMat === 'longlanh' && <path d={`M${ex - K.matRx * 0.8} ${ey + K.matRy * 0.55} Q${ex} ${ey + K.matRy * 1.05} ${ex + K.matRx * 0.8} ${ey + K.matRy * 0.55}`} stroke="#7DD3FC" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.9" />}
                </g>
                {/* mắt cười ^^ */}
                <path d={`M${ex - 11} ${ey + 4} Q${ex} ${ey - 11} ${ex + 11} ${ey + 4}`} stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" opacity={kieuMat === 'cuoi' ? 1 : 0} className={s.matMo} />
                {/* mắt nhắm ⌒ (ngủ) */}
                <path d={`M${ex - 10} ${ey - 2} Q${ex} ${ey + 8} ${ex + 10} ${ey - 2}`} stroke="#fff" strokeWidth="4.5" strokeLinecap="round" fill="none" opacity={kieuMat === 'ngu' ? 1 : 0} className={s.matMo} />
                {/* mắt tim (love) */}
                {kieuMat === 'tim' && (
                  <g transform={`translate(${ex} ${ey})`}><g className={s.timMat}>
                    <path d={timD(13)} fill="#FF4D7D" />
                    <circle cx="-4" cy="-5" r="2.6" fill="#fff" opacity="0.9" />
                  </g></g>
                )}
              </g>
            );
          })}

          {/* Nước mắt (buồn) */}
          {co('nuocmat') && [-1, 1].map((sg) => (
            <g key={sg} transform={`translate(${100 + sg * (K.matX + K.matRx + 4)} ${ey + 10})`}>
              <path className={`${s.le} ${sg > 0 ? s.le2 : ''}`} d="M0 -6 C3 -1 4 2 0 5 C-4 2 -3 -1 0 -6 Z" fill="#7DD3FC" />
            </g>
          ))}
          {/* Giọt mồ hôi (sai rồi) */}
          {co('mohoi') && <path className={`${s.dao} ${s.mohoi}`} d="M152 58 C156 65 158 69 152 73 C146 69 148 65 152 58 Z" fill="#7DD3FC" />}

          {/* Kính (Sensei) */}
          {variant === 'sensei' && (
            <g stroke="#3F4654" strokeWidth="3" fill="none">
              <circle cx={100 - K.matX} cy={ey} r={K.matRx + 7} />
              <circle cx={100 + K.matX} cy={ey} r={K.matRx + 7} />
              <path d={`M${100 - K.matX + K.matRx + 7} ${ey - 2} Q100 ${ey - 8} ${100 + K.matX - K.matRx - 7} ${ey - 2}`} />
            </g>
          )}

          {/* Mũi */}
          <path d={`M${100 - 7 * K.mui} ${ey + 18} Q100 ${ey + 15} ${100 + 7 * K.mui} ${ey + 18} Q${100 + 4 * K.mui} ${ey + 27} 100 ${ey + 28} Q${100 - 4 * K.mui} ${ey + 27} ${100 - 7 * K.mui} ${ey + 18} Z`} fill={THAN} />
          <ellipse cx={100 - 2.5 * K.mui} cy={ey + 19.5} rx="2.2" ry="1.2" fill="#fff" opacity="0.5" />

          {/* Miệng: nét (cười / mếu / thẳng / nhỏ) và miệng mở (nói, ngạc nhiên, ngáp) */}
          <path ref={miengNet} d={miengD} stroke={THAN} strokeWidth="3.2" strokeLinecap="round" fill="none" />
          <ellipse ref={miengMo} cx="100" cy={ey + 36} rx="6" ry="2" fill={MIENG} opacity="0" />
          <ellipse ref={luoi} cx="100" cy={ey + 40} rx="4.5" ry="3" fill={LUOI} opacity="0" />

          {/* ── Đạo cụ cầm tay (vị trí = đầu bàn tay phải ở góc tay của cảm xúc đó) ── */}
          {co('kinhlup') && (
            <g className={s.dao}>
              <line x1="141" y1="121" x2="153" y2="136" stroke="#8B5CF6" strokeWidth="5.5" strokeLinecap="round" />
              <circle cx="132" cy="111" r="13.5" fill="#BFE3FF" fillOpacity="0.4" stroke="#3F4654" strokeWidth="3.5" />
              <path d="M124 105 Q128 100 134 101" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.9" />
            </g>
          )}
          {co('but') && (
            <g transform="translate(190 141) rotate(14)"><g className={s.dao}>
              <rect x="-3.5" y="-46" width="7" height="38" fill="#FBBF24" />
              <rect x="-3.5" y="-46" width="7" height="6" fill="#F472B6" />
              <path d="M-3.5 -8 L0 0 L3.5 -8 Z" fill="#F7E3B5" />
              <path d="M-1.4 -3.2 L0 0 L1.4 -3.2 Z" fill={THAN} />
            </g></g>
          )}
          {co('lua') && (
            <g transform="translate(190 128)"><g className={`${s.dao} ${s.lua}`}>
              <path d="M0 10 C-12 2 -10 -12 -2 -20 C-2 -12 3 -10 3 -16 C9 -10 13 0 6 9 C4 12 -3 12 0 10 Z" fill="#F97316" />
              <path d="M0 8 C-6 3 -5 -5 0 -9 C0 -4 3 -3 3 -7 C6 -3 6 3 3 7 C2 9 -2 9 0 8 Z" fill="#FDE047" />
            </g></g>
          )}
          {co('tick') && (
            <g className={`${s.dao} ${s.tick}`}>
              <circle cx="168" cy="50" r="12" fill="#22C55E" stroke="#fff" strokeWidth="2.5" />
              <path d="M161 50 L166 55 L175 45" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </g>
          )}

          {/* ── Đồ đội đầu ── */}
          {co('mucunhan') && (
            <g className={s.dao}>
              <path d="M66 40 Q100 50 134 40 L134 28 Q100 40 66 28 Z" fill="#1F2937" />
              <path d="M100 6 L156 24 L100 42 L44 24 Z" fill="#111827" />
              <path d="M100 10 L146 24 L100 38 L54 24 Z" fill="#1F2937" />
              <path d="M100 24 L134 30 L136 48" stroke="#FBBF24" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <circle cx="136" cy="51" r="3.5" fill="#FBBF24" />
            </g>
          )}
          {co('nontiec') && (
            <g transform="rotate(8 118 30)"><g className={s.dao}>
              <path d="M118 -2 L98 44 L138 44 Z" fill="#A78BFA" />
              <path d="M110 16 L104 30 L128 30 Z" fill="#F472B6" opacity="0.9" />
              <path d="M104 30 L98 44 L138 44 L132 30 Z" fill="#FBBF24" opacity="0.9" />
              <circle cx="118" cy="-2" r="5" fill="#F472B6" />
            </g></g>
          )}
          {variant === 'zippy' && !co('mucunhan') && !co('nontiec') && <path d="M38 62 Q100 44 162 62 Q100 54 38 62 Z" fill={mauKhan} />}
          {variant === 'sage' && !co('mucunhan') && !co('nontiec') && (
            <path d="M74 36 L82 18 L92 32 L100 12 L108 32 L118 18 L126 36 Q100 44 74 36 Z" fill="#F5C518" stroke="#D4A015" strokeWidth="1.5" strokeLinejoin="round" />
          )}
          {variant === 'grumpy' && !co('mucunhan') && !co('nontiec') && (
            <g>
              <path d="M60 46 Q100 10 150 20 Q160 60 130 42 Q100 36 60 46 Z" fill={mauKhan} />
              <circle cx="152" cy="20" r="7" fill="#fff" />
            </g>
          )}
        </g>

        {/* "…" khi nghĩ */}
        {co('cham') && [0, 1, 2].map((i) => (
          <circle key={i} className={s.cham} cx={152 + i * 11} cy={40} r="3.6" fill={THAN} style={{ animationDelay: `${i * 0.18}s` }} />
        ))}
        {/* Zzz */}
        {co('zzz') && [0, 1, 2].map((i) => (
          <text key={i} className={s.z} x={150 + i * 10} y={50} fontSize={12 + i * 5} fontWeight="800" fill="#38BDF8"
            fontFamily="ui-rounded, 'SF Pro Rounded', system-ui, sans-serif" style={{ animationDelay: `${i * 0.8}s` }}>z</text>
        ))}
        {/* Lấp lánh "!" quanh đầu (ngạc nhiên / quay lại) */}
        {co('lapLanh') && [[-1, 0], [0, -1], [1, 0]].map(([dx, dy], i) => (
          <g key={i} transform={`translate(${100 + dx * 62} ${18 + dy * 14 + Math.abs(dx) * 14})`}><g className={s.lapLanh} style={{ animationDelay: `${i * 0.15}s` }}>
            <path d="M0 -8 L2 -2 L8 0 L2 2 L0 8 L-2 2 L-8 0 L-2 -2 Z" fill="#FBBF24" />
          </g></g>
        ))}
        {/* Tim bay (love) */}
        {co('timbay') && [0, 1, 2, 3].map((i) => (
          <path key={i} className={s.timBay} d={timD(6 + (i % 2) * 2)} fill={i % 2 ? '#FF4D7D' : '#FF9EB5'}
            style={{ animationDelay: `${i * 0.55}s`, ['--x' as string]: `${[150, 168, 40, 56][i]}px`, ['--y' as string]: `${[70, 48, 66, 44][i]}px` } as CSSProperties} />
        ))}
        {/* Sao / confetti mừng — bay từ giữa ra 8 hướng */}
        {coSao && [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
          return (
            <path
              key={`${saoLan}-${i}`}
              className={s.sao}
              d="M0 -7 L2 -2 L7 -2 L3 1.5 L4.5 7 L0 3.5 L-4.5 7 L-3 1.5 L-7 -2 L-2 -2 Z"
              fill={SAO_MAU[i % 4]}
              style={{ ['--dx' as string]: `${(Math.cos(a) * 88).toFixed(1)}px`, ['--dy' as string]: `${(Math.sin(a) * 78).toFixed(1)}px`, animationIterationCount: co('sao') ? 'infinite' : 1 } as CSSProperties}
            />
          );
        })}
      </svg>
    </div>
  );
}
