'use client';
/**
 * 🐼 Gấu trúc Bíp — vector SVG phong cách Duolingo (làm lại 09/11/2026 sau khi bản 3D bị chê "đáng sợ").
 *
 * Một khối thân–đầu liền hình hạt đậu (đầu chiếm ~60%, không cổ), mảng màu phẳng + một lớp bóng nhạt, không viền
 * đen dày. Mắt RẤT TO đặt thấp, cách xa nhau; mảng đen quanh mắt là giọt nước nghiêng xuống ngoài; tai tròn nhỏ;
 * má hồng; mũi tam giác bo; miệng nhỏ. Tay là hai mẩu ngắn mập dính sườn (vẫy như cánh Duo), chân hai mẩu ngắn.
 * Khuôn mặt chọn sau khi so 4 phương án (KHUON_THU, ảnh scratchpad anh2/thu-*.png): B — mắt to nhất, đặt thấp.
 *
 * Chuyển động = CSS (GauBip.module.css) trên từng nhóm SVG: nhún thở (squash & stretch), chớp mắt ngẫu nhiên, đồng
 * tử nhìn theo con trỏ, vẫy tay, cheer nhảy + sao, sad cụp tai + nước mắt, think nghiêng + liếc lên + "…",
 * surprised mắt tròn + miệng O + nhảy lùi, sleep mắt ⌒ + Zzz, talking miệng mở–khép theo lịch âm tiết của
 * giongGau.ts. `prefers-reduced-motion` ⇒ chỉ chớp mắt. Không canvas, không WebGL, không tệp ảnh — chạy y hệt
 * trong app desktop. (Không dùng framer-motion cho SVG: bản 11 không ghi transform cho <g> ở đây — xem CSS.)
 *
 * API giữ nguyên bản cũ: emotion · talking · size · variant · vayKey · saoKey · onClick · className · nhinTheoTro.
 */
import { useEffect, useRef, useState } from 'react';
import { dangNoi, docMieng } from './giongGau';
import s from './GauBip.module.css';

export type CamXucGau = 'happy' | 'cheer' | 'sad' | 'think' | 'surprised' | 'sleep';
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
export const KHUON_THU: Record<'A' | 'B' | 'C' | 'D', KhuonMat> = {
  A: { matX: 26, matY: 94, matRx: 12.5, matRy: 14.5, nguoi: 9, vanhRx: 21, vanhRy: 27, vanhGoc: 22, vanhDx: -1, vanhDy: -4, tai: 19, taiX: 48, taiY: 38, mui: 1 },
  B: { matX: 27, matY: 98, matRx: 14, matRy: 16.5, nguoi: 10.5, vanhRx: 24, vanhRy: 30, vanhGoc: 28, vanhDx: -1, vanhDy: -5, tai: 20, taiX: 50, taiY: 38, mui: 0.9 },
  C: { matX: 25, matY: 92, matRx: 13, matRy: 15, nguoi: 9.5, vanhRx: 19, vanhRy: 24, vanhGoc: 15, vanhDx: 0, vanhDy: -3, tai: 22, taiX: 46, taiY: 40, mui: 1 },
  D: { matX: 30, matY: 96, matRx: 13.5, matRy: 16, nguoi: 10, vanhRx: 22, vanhRy: 29, vanhGoc: 32, vanhDx: -2, vanhDy: -5, tai: 18, taiX: 52, taiY: 36, mui: 0.8 },
};
/** Chọn 09/11/2026: B nới khoảng cách mắt thêm 1. */
const KHUON_MAC_DINH: KhuonMat = { ...KHUON_THU.B, matX: 28 };

/* Thân: hạt đậu — đầu rộng (y≈80), hơi thắt ở y≈140, đáy tròn. */
const THAN_D = 'M100 20 C146 20 176 50 176 82 C176 108 170 124 168 140 C166 166 142 184 100 184 C58 184 34 166 32 140 C30 124 24 108 24 82 C24 50 54 20 100 20 Z';
/* Giọt nước quanh mắt (toạ độ cục bộ, tâm 0,0; đáy hơi nhọn). */
const vanhD = (rx: number, ry: number) =>
  `M0 ${-ry} C${rx * 0.62} ${-ry} ${rx} ${-ry * 0.38} ${rx * 0.95} ${ry * 0.2} C${rx * 0.9} ${ry * 0.78} ${rx * 0.55} ${ry * 1.08} 0 ${ry * 1.08} C${-rx * 0.55} ${ry * 1.08} ${-rx * 0.9} ${ry * 0.78} ${-rx * 0.95} ${ry * 0.2} C${-rx} ${-ry * 0.38} ${-rx * 0.62} ${-ry} 0 ${-ry} Z`;

type KieuMat = 'thuong' | 'cuoi' | 'buon' | 'ngu' | 'to';
const MAT: Record<CamXucGau, KieuMat> = { happy: 'thuong', cheer: 'cuoi', sad: 'buon', think: 'thuong', surprised: 'to', sleep: 'ngu' };
const MIENG_NEN: Record<CamXucGau, number> = { happy: 0.08, cheer: 0.75, sad: 0, think: 0, surprised: 1, sleep: 0 };
const SAO_MAU = ['#FBBF24', '#F472B6', '#A78BFA', '#34D399'];

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
  const goc = useRef<HTMLDivElement>(null);
  const nguoiT = useRef<SVGGElement>(null);
  const nguoiP = useRef<SVGGElement>(null);
  const miengMo = useRef<SVGEllipseElement>(null);
  const luoi = useRef<SVGEllipseElement>(null);
  const miengCuoi = useRef<SVGPathElement>(null);
  const [nham, setNham] = useState(false);
  const [vayLan, setVayLan] = useState(0);
  const [saoLan, setSaoLan] = useState(0);
  const talkingRef = useRef(talking); talkingRef.current = talking;
  const camRef = useRef(emotion); camRef.current = emotion;

  /* Chớp mắt ngẫu nhiên 2,5–5,5 s (giữ cả khi giảm chuyển động — thứ duy nhất còn lại). */
  useEffect(() => {
    if (emotion === 'sleep') return;
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
  }, [emotion]);

  /* Đồng tử nhìn theo con trỏ — ghi thẳng attribute, không qua state. */
  useEffect(() => {
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
      const nghi = camRef.current === 'think';
      const dx = nx * 4.2 + (nghi ? 3 : 0), dy = ny * 3.2 + (nghi ? -5 : 0);
      const t = `translate(${dx.toFixed(2)} ${dy.toFixed(2)})`;
      nguoiT.current?.setAttribute('transform', t);
      nguoiP.current?.setAttribute('transform', t);
      if (Math.abs(mx - nx) > 0.002 || Math.abs(my - ny) > 0.002) raf = requestAnimationFrame(buoc);
    };
    window.addEventListener('pointermove', onTro, { passive: true });
    return () => { window.removeEventListener('pointermove', onTro); if (raf) cancelAnimationFrame(raf); };
  }, [nhinTheoTro]);
  /* Đang nghĩ ⇒ liếc lên (kể cả khi không theo con trỏ). */
  useEffect(() => {
    const t = emotion === 'think' ? 'translate(3 -5)' : 'translate(0 0)';
    nguoiT.current?.setAttribute('transform', t);
    nguoiP.current?.setAttribute('transform', t);
  }, [emotion]);

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
      miengCuoi.current?.setAttribute('opacity', m > 0.12 ? '0' : '1');
    };
    const buoc = (now: number) => {
      raf = requestAnimationFrame(buoc);
      const nen = MIENG_NEN[camRef.current];
      if (dangNoi()) dat(Math.max(nen * 0.3, docMieng()));
      else if (talkingRef.current) { const t = (now - t0) / 1000; dat(0.2 + 0.5 * Math.abs(Math.sin(t * 11) * Math.sin(t * 3.3 + 1))); }
      else { dat(nen); cancelAnimationFrame(raf); raf = 0; }
    };
    if (talking || dangNoi()) { t0 = performance.now(); raf = requestAnimationFrame(buoc); } else dat(MIENG_NEN[emotion]);
    return () => { if (raf) cancelAnimationFrame(raf); };
  }, [talking, emotion]);

  /* Vẫy tay: đổi key của nhóm tay ⇒ animation CSS chạy lại từ đầu. */
  useEffect(() => { if (vayKey) setVayLan((n) => n + 1); }, [vayKey]);
  useEffect(() => { if (saoKey) setSaoLan((n) => n + 1); }, [saoKey]);

  const kieuMat: KieuMat = MAT[emotion];
  const kich = size > 0 ? { width: size, height: size } : undefined;
  const mauKhan = KHAN[variant];
  const coSao = emotion === 'cheer' || saoLan > 0;

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
        <ellipse className={s.bong} data-cam={emotion} cx="100" cy="193" rx="52" ry="6.5" fill="#000" opacity="0.13" />

        <g className={s.than} data-cam={emotion}>
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

          {/* Tay trái (người xem: trái) — dính sườn, vẽ TRƯỚC thân như cánh Duo để giơ lên không bị khuất; gốc xoay ở vai */}
          <g className={s.tayT}>
            <ellipse cx="36" cy="138" rx="10.5" ry="20" fill={THAN} stroke="currentColor" strokeWidth="1.5" transform="rotate(16 36 138)" />
          </g>
          {/* Tay phải — vẫy (key đổi ⇒ chạy lại animation) */}
          <g key={vayLan} className={`${s.tayP} ${vayLan > 0 ? s.vay : ''}`}>
            <ellipse cx="164" cy="138" rx="10.5" ry="20" fill={THAN} stroke="currentColor" strokeWidth="1.5" transform="rotate(-16 164 138)" />
          </g>

          {/* Má */}
          <ellipse cx={100 - K.matX - 18} cy={K.matY + 19} rx="9.5" ry="6" fill={MA} opacity="0.85" />
          <ellipse cx={100 + K.matX + 18} cy={K.matY + 19} rx="9.5" ry="6" fill={MA} opacity="0.85" />

          {/* Vành mắt — giọt nước nghiêng xuống ngoài */}
          <path d={vanhD(K.vanhRx, K.vanhRy)} fill={THAN} transform={`translate(${100 - K.matX + K.vanhDx} ${K.matY + K.vanhDy}) rotate(${K.vanhGoc})`} />
          <path d={vanhD(K.vanhRx, K.vanhRy)} fill={THAN} transform={`translate(${100 + K.matX - K.vanhDx} ${K.matY + K.vanhDy}) rotate(${-K.vanhGoc})`} />

          {/* Lông mày (buồn / nghĩ) */}
          {emotion === 'sad' && (
            <g stroke={THAN} strokeWidth="4" strokeLinecap="round" fill="none">
              <path d={`M${100 - K.matX - 2} ${K.matY - K.vanhRy - 12} L${100 - K.matX - 16} ${K.matY - K.vanhRy - 4}`} />
              <path d={`M${100 + K.matX + 2} ${K.matY - K.vanhRy - 12} L${100 + K.matX + 16} ${K.matY - K.vanhRy - 4}`} />
            </g>
          )}
          {emotion === 'think' && (
            <path d={`M${100 + K.matX - 12} ${K.matY - K.vanhRy - 14} Q${100 + K.matX} ${K.matY - K.vanhRy - 20} ${100 + K.matX + 12} ${K.matY - K.vanhRy - 12}`} stroke={THAN} strokeWidth="4" strokeLinecap="round" fill="none" />
          )}

          {/* Mắt */}
          {[-1, 1].map((sg) => {
            const ex = 100 + sg * K.matX, ey = K.matY;
            const ref = sg < 0 ? nguoiT : nguoiP;
            const mo = kieuMat === 'thuong' || kieuMat === 'to' || kieuMat === 'buon';
            return (
              <g key={sg}>
                <g className={s.mat} data-kieu={kieuMat} data-nham={nham && mo ? '1' : '0'} opacity={mo ? 1 : 0}>
                  <ellipse cx={ex} cy={ey} rx={K.matRx} ry={K.matRy} fill="#fff" />
                  <g ref={ref}>
                    <circle cx={ex} cy={ey + 1} r={K.nguoi * (kieuMat === 'to' ? 0.85 : 1)} fill={THAN} />
                    <circle cx={ex - K.nguoi * 0.38} cy={ey - K.nguoi * 0.42} r={K.nguoi * 0.42} fill="#fff" />
                    <circle cx={ex + K.nguoi * 0.35} cy={ey + K.nguoi * 0.4} r={K.nguoi * 0.2} fill="#fff" />
                  </g>
                  {kieuMat === 'buon' && <ellipse cx={ex} cy={ey - K.matRy * 0.55} rx={K.matRx + 1} ry={K.matRy * 0.55} fill={THAN} />}
                </g>
                {/* mắt cười ^^ */}
                <path className={s.matMo} d={`M${ex - 11} ${ey + 4} Q${ex} ${ey - 11} ${ex + 11} ${ey + 4}`} stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" opacity={kieuMat === 'cuoi' ? 1 : 0} />
                {/* mắt nhắm ⌒ (ngủ) */}
                <path className={s.matMo} d={`M${ex - 10} ${ey - 2} Q${ex} ${ey + 8} ${ex + 10} ${ey - 2}`} stroke="#fff" strokeWidth="4.5" strokeLinecap="round" fill="none" opacity={kieuMat === 'ngu' ? 1 : 0} />
              </g>
            );
          })}

          {/* Nước mắt */}
          {emotion === 'sad' && [-1, 1].map((sg) => (
            <g key={sg} transform={`translate(${100 + sg * (K.matX + K.matRx + 4)} ${K.matY + 10})`}>
              <path className={`${s.le} ${sg > 0 ? s.le2 : ''}`} d="M0 -6 C3 -1 4 2 0 5 C-4 2 -3 -1 0 -6 Z" fill="#7DD3FC" />
            </g>
          ))}

          {/* Kính (Sensei) */}
          {variant === 'sensei' && (
            <g stroke="#3F4654" strokeWidth="3" fill="none">
              <circle cx={100 - K.matX} cy={K.matY} r={K.matRx + 7} />
              <circle cx={100 + K.matX} cy={K.matY} r={K.matRx + 7} />
              <path d={`M${100 - K.matX + K.matRx + 7} ${K.matY - 2} Q100 ${K.matY - 8} ${100 + K.matX - K.matRx - 7} ${K.matY - 2}`} />
            </g>
          )}

          {/* Mũi */}
          <path d={`M${100 - 7 * K.mui} ${K.matY + 18} Q100 ${K.matY + 15} ${100 + 7 * K.mui} ${K.matY + 18} Q${100 + 4 * K.mui} ${K.matY + 27} 100 ${K.matY + 28} Q${100 - 4 * K.mui} ${K.matY + 27} ${100 - 7 * K.mui} ${K.matY + 18} Z`} fill={THAN} />
          <ellipse cx={100 - 2.5 * K.mui} cy={K.matY + 19.5} rx="2.2" ry="1.2" fill="#fff" opacity="0.5" />

          {/* Miệng: cười / mếu (nét) và miệng mở (nói) */}
          <path ref={miengCuoi}
            d={emotion === 'sad' ? `M93 ${K.matY + 38} Q100 ${K.matY + 31} 107 ${K.matY + 38}` : emotion === 'think' || emotion === 'sleep' ? `M95 ${K.matY + 35} L105 ${K.matY + 35}` : `M92 ${K.matY + 32} Q100 ${K.matY + 41} 108 ${K.matY + 32}`}
            stroke={THAN} strokeWidth="3.2" strokeLinecap="round" fill="none" />
          <ellipse ref={miengMo} cx="100" cy={K.matY + 36} rx="6" ry="2" fill={MIENG} opacity="0" />
          <ellipse ref={luoi} cx="100" cy={K.matY + 40} rx="4.5" ry="3" fill={LUOI} opacity="0" />

          {/* Phụ kiện đầu theo vai */}
          {variant === 'zippy' && <path d="M38 62 Q100 44 162 62 Q100 54 38 62 Z" fill={mauKhan} />}
          {variant === 'sage' && (
            <path d="M74 36 L82 18 L92 32 L100 12 L108 32 L118 18 L126 36 Q100 44 74 36 Z" fill="#F5C518" stroke="#D4A015" strokeWidth="1.5" strokeLinejoin="round" />
          )}
          {variant === 'grumpy' && (
            <g>
              <path d="M60 46 Q100 10 150 20 Q160 60 130 42 Q100 36 60 46 Z" fill={mauKhan} />
              <circle cx="152" cy="20" r="7" fill="#fff" />
            </g>
          )}
        </g>

        {/* "…" khi nghĩ */}
        {emotion === 'think' && [0, 1, 2].map((i) => (
          <circle key={i} className={s.cham} cx={152 + i * 11} cy={40} r="3.6" fill={THAN} style={{ animationDelay: `${i * 0.18}s` }} />
        ))}

        {/* Zzz khi ngủ */}
        {emotion === 'sleep' && [0, 1, 2].map((i) => (
          <text key={i} className={s.z} x={150 + i * 10} y={50} fontSize={12 + i * 5} fontWeight="800" fill="#38BDF8"
            fontFamily="ui-rounded, 'SF Pro Rounded', system-ui, sans-serif" style={{ animationDelay: `${i * 0.8}s` }}>z</text>
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
              style={{ ['--dx' as string]: `${(Math.cos(a) * 88).toFixed(1)}px`, ['--dy' as string]: `${(Math.sin(a) * 78).toFixed(1)}px`, animationIterationCount: emotion === 'cheer' ? 'infinite' : 1 }}
            />
          );
        })}
      </svg>
    </div>
  );
}
