'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * Hai viên gạch dựng nên cả tháp lẫn bậc thang: một SÂN KHẤU 3D (perspective + nghiêng nhẹ
 * theo con trỏ) và một KHỐI hộp CSS 3D (mặt trước là nút bấm, mặt trên + hai mặt bên).
 *
 * Bẫy đã tính tới:
 *  - `opacity < 1` trên một phần tử `preserve-3d` làm nó BẸP về 2D (đặc tả CSS Transforms 2,
 *    "grouping property"). Nên hiệu ứng hiện dần chỉ đặt `opacity` lên các MẶT (phần tử lá),
 *    còn khung chứa chỉ dịch chuyển bằng transform.
 *  - Hiệu ứng vào trang là keyframe CSS ở khung ngoài; transform của framer (nổi lên khi rê,
 *    tiến ra khi chọn) ở khung trong — hai nguồn transform không giẫm lên nhau.
 *  - Màn hẹp / giảm chuyển động: `la3D=false` ⇒ chỉ còn mặt trước, độ dày giả bằng bóng đổ.
 */

export const KEYFRAMES_3D = `
@keyframes lt-roi { from { transform: translate3d(0,-46px,0); } to { transform: translate3d(0,0,0); } }
@keyframes lt-hien { from { opacity: 0; } to { opacity: 1; } }
@keyframes lt-nhip { 0%,100% { transform: scale(1); opacity: .75; } 50% { transform: scale(1.9); opacity: 0; } }
.lt-roi { animation: lt-roi .7s cubic-bezier(.22,1,.36,1) both; }
.lt-hien { animation: lt-hien .55s ease-out both; }
.lt-nhip { animation: lt-nhip 1.8s ease-out infinite; }
.lt-luoi::before {
  content: ''; position: absolute; inset: 0; pointer-events: none;
  background-image:
    linear-gradient(color-mix(in srgb, var(--border-color) 70%, transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in srgb, var(--border-color) 70%, transparent) 1px, transparent 1px);
  background-size: 28px 28px;
  -webkit-mask-image: radial-gradient(ellipse 75% 70% at 50% 55%, #000 30%, transparent 100%);
  mask-image: radial-gradient(ellipse 75% 70% at 50% 55%, #000 30%, transparent 100%);
}
@media (prefers-reduced-motion: reduce) {
  .lt-roi, .lt-hien, .lt-nhip { animation: none !important; }
}
`;

export function San3D({
  la3D,
  children,
  gocX = -16,
  gocY = 0,
  className = '',
}: {
  la3D: boolean;
  children: React.ReactNode;
  gocX?: number;
  gocY?: number;
  className?: string;
}) {
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const ry = useSpring(useTransform(px, [-0.5, 0.5], [gocY - 8, gocY + 8]), { stiffness: 110, damping: 18 });
  const rx = useSpring(useTransform(py, [-0.5, 0.5], [gocX + 3, gocX - 3]), { stiffness: 110, damping: 18 });

  if (!la3D) return <div className={`relative ${className}`}>{children}</div>;
  return (
    <div
      className={`relative ${className}`}
      style={{ perspective: 1600, perspectiveOrigin: '50% 20%' }}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse') return;
        const r = e.currentTarget.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width - 0.5);
        py.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
    >
      <motion.div style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}>{children}</motion.div>
    </div>
  );
}

function sang(hex: string, a: number) {
  return `linear-gradient(0deg, rgba(255,255,255,${a}), rgba(255,255,255,${a})), ${hex}`;
}
function toi(hex: string, a: number) {
  return `linear-gradient(0deg, rgba(0,0,0,${a}), rgba(0,0,0,${a})), ${hex}`;
}

export function Khoi({
  la3D,
  rong,
  cao,
  sau = 64,
  sauTren,
  lui = 0,
  hex,
  chon = false,
  tre = 0,
  vienDut = false,
  onClick,
  ariaLabel,
  ariaPressed,
  viTri,
  children,
}: {
  la3D: boolean;
  /** Bề rộng CSS (vd "70%"). */
  rong: string;
  cao: number;
  /** Chiều sâu hộp (px). */
  sau?: number;
  /** Độ sâu riêng của MẶT TRÊN (mặc định = sau). Tháp: tầng dưới chỉ lộ một gờ bằng đúng bước lùi — sâu hơn thì
   *  mặt trên đâm xuyên mặt trước của tầng trên ⇒ hai mặt tranh nhau hiển thị thành vạch răng cưa (01/10/2026). */
  sauTren?: number;
  /** Dịch ra sau (px, âm = lùi vào trong). */
  lui?: number;
  hex: [string, string];
  chon?: boolean;
  /** Trễ hiệu ứng vào trang (giây). */
  tre?: number;
  /** Nhánh tuỳ chọn: khối mỏng, viền đứt. */
  vienDut?: boolean;
  onClick: () => void;
  ariaLabel: string;
  ariaPressed?: boolean;
  /** Định vị tuyệt đối (bậc thang). Không truyền ⇒ khối nằm trong dòng chảy (tháp). */
  viTri?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const nenTruoc = vienDut
    ? `linear-gradient(160deg, ${hex[0]}d9, ${hex[1]}c7)`
    : `linear-gradient(165deg, ${hex[0]} 0%, ${hex[1]} 100%)`;
  const doTre = { animationDelay: `${tre}s` };

  const matTruoc = (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
      className={`lt-hien absolute inset-0 rounded-[7px] text-left text-white outline-none focus-visible:ring-4 focus-visible:ring-white/70 ${
        vienDut ? 'border-2 border-dashed border-white/80' : ''
      }`}
      style={{
        ...doTre,
        background: nenTruoc,
        boxShadow: chon
          ? `0 0 0 2px rgba(255,255,255,.85), 0 0 0 5px ${hex[0]}88, 0 18px 40px -12px ${hex[1]}`
          : la3D
            ? 'inset 0 1px 0 rgba(255,255,255,.35), inset 0 -10px 18px -10px rgba(0,0,0,.35)'
            : `inset 0 1px 0 rgba(255,255,255,.35), 0 5px 0 ${hex[1]}, 0 10px 18px -8px ${hex[1]}`,
        textShadow: '0 1px 2px rgba(0,0,0,.35)',
      }}
    >
      {children}
    </button>
  );

  if (!la3D) {
    return (
      <motion.div
        className="relative"
        style={{ width: rong, height: cao, ...viTri }}
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: tre * 0.6 }}
      >
        {matTruoc}
      </motion.div>
    );
  }

  return (
    <div className="lt-roi relative" style={{ width: rong, height: cao, transformStyle: 'preserve-3d', ...doTre, ...viTri }}>
      <motion.div
        className="absolute inset-0"
        style={{ transformStyle: 'preserve-3d' }}
        initial={false}
        animate={{ z: lui + (chon ? 26 : 0) }}
        whileHover={{ y: -6 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      >
        {/* Mặt trên: xoay quanh mép trên, ngả ra sau. */}
        {!vienDut && (
          <div
            aria-hidden
            className="lt-hien absolute left-0 top-0 w-full rounded-[3px] pointer-events-none"
            style={{
              ...doTre,
              height: sauTren ?? sau,
              transformOrigin: 'top center',
              transform: 'rotateX(-90deg)',
              background: sang(hex[0], chon ? 0.45 : 0.3),
            }}
          />
        )}
        {/* Hai mặt bên. */}
        {!vienDut && (
          <>
            <div
              aria-hidden
              className="lt-hien absolute right-0 top-0 h-full pointer-events-none"
              style={{ ...doTre, width: sau, transformOrigin: 'right center', transform: 'rotateY(-90deg)', background: toi(hex[1], 0.28) }}
            />
            <div
              aria-hidden
              className="lt-hien absolute left-0 top-0 h-full pointer-events-none"
              style={{ ...doTre, width: sau, transformOrigin: 'left center', transform: 'rotateY(90deg)', background: toi(hex[1], 0.38) }}
            />
          </>
        )}
        {matTruoc}
      </motion.div>
    </div>
  );
}

/** Ghim "Bạn đang ở đây" — chấm đập nhịp + nhãn trắng. */
export function GhimODay({ nhan }: { nhan: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded-full bg-white text-gray-900 shadow-sm whitespace-nowrap [text-shadow:none]">
      <span className="relative flex w-2 h-2">
        <span className="lt-nhip absolute inset-0 rounded-full bg-emerald-500" />
        <span className="relative w-2 h-2 rounded-full bg-emerald-500" />
      </span>
      {nhan}
    </span>
  );
}
