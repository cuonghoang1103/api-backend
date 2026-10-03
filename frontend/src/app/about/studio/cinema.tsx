'use client';

/**
 * Bộ máy "cắt cảnh 3D" của /about/studio (macrostructure Feature Stack).
 *
 * Mỗi cảnh nằm trong một `track` cao 115svh (rút từ 170svh 01/10 — trang dài 19,6 màn); bên trong có `stage` dính
 * (sticky). Tiến độ cuộn của track (0 = mép trên track chạm đáy màn hình,
 * 1 = mép dưới track rời đỉnh màn hình) điều khiển:
 *   - vào cảnh  [0.04 → 0.30]: cảnh nhô lên từ dưới — rotateX 14° → 0, z −220 → 0
 *   - giữ cảnh  [0.30 → 0.50]
 *   - ra cảnh   [0.50 → 0.70]: lùi sâu — z 0 → −380, rotateX 0 → 9°, mờ dần
 * Track kế tiếp chồng lên 35svh (CSS `.track + .track`) nên cảnh sau nhô lên
 * đúng lúc cảnh trước đang lùi — như một cú cắt cảnh phim.
 *
 * Ba chế độ (`mode`), chốt sau khi mount để SSR và lần render đầu khớp nhau:
 *   - 'flat'   : màn < 48rem hoặc thấp < 42rem — không sticky, không chuyển động
 *   - 'calm'   : prefers-reduced-motion — chỉ đổi opacity (140ms), KHÔNG 3D
 *   - 'cinema' : đầy đủ; nghiêng theo chuột chỉ khi con trỏ là chuột thật
 * Chỉ animate transform + opacity. Không hook nào nằm sau return sớm.
 */
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import s from './broadsheet.module.css';

type Mode = 'flat' | 'calm' | 'cinema';

interface CinemaState {
  mode: Mode;
  tiltX: MotionValue<number>;
  tiltY: MotionValue<number>;
}

const CinemaCtx = createContext<CinemaState | null>(null);

/** Cùng điều kiện với media query sticky trong broadsheet.module.css. */
const STAGE_QUERY = '(min-width: 48rem) and (min-height: 42rem)';
const FINE_POINTER = '(hover: hover) and (pointer: fine)';

export function CinemaProvider({ children, enabled = false }: { children: React.ReactNode; enabled?: boolean }) {
  const reduce = useReducedMotion();
  const [wide, setWide] = useState(false);
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const mqStage = window.matchMedia(STAGE_QUERY);
    const mqFine = window.matchMedia(FINE_POINTER);
    const sync = () => {
      setWide(mqStage.matches);
      setFine(mqFine.matches);
    };
    sync();
    mqStage.addEventListener('change', sync);
    mqFine.addEventListener('change', sync);
    return () => {
      mqStage.removeEventListener('change', sync);
      mqFine.removeEventListener('change', sync);
    };
  }, []);

  // Keep reading sections static; reserve spatial motion for the product exhibit.
  const mode: Mode = !enabled || !wide || reduce ? 'flat' : 'cinema';

  // Nghiêng theo chuột: ±2.5° quanh X, ±3.5° quanh Y, làm mượt bằng lò xo
  // không nảy (stiffness 50 / damping 20 — "gần như một đường ease").
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const tiltX = useSpring(rawX, { stiffness: 50, damping: 20 });
  const tiltY = useSpring(rawY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    if (mode !== 'cinema' || !fine) {
      rawX.set(0);
      rawY.set(0);
      return;
    }
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      rawX.set(-ny * 5);
      rawY.set(nx * 7);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [mode, fine, rawX, rawY]);

  return <CinemaCtx.Provider value={{ mode, tiltX, tiltY }}>{children}</CinemaCtx.Provider>;
}

function useCinema(): CinemaState {
  const ctx = useContext(CinemaCtx);
  if (!ctx) throw new Error('Scene phải nằm trong <CinemaProvider>');
  return ctx;
}

/**
 * Một cảnh. `opening` = cảnh đầu trang: đã ở đúng chỗ khi trang mở, không có
 * pha "vào". `closing` = cảnh cuối của một chương: lùi muộn hơn, trong lúc nó
 * cuộn đi cùng cột chữ, để không bỏ trống cột phải.
 */
export function Scene({
  children,
  label,
  opening = false,
  closing = false,
}: {
  children: React.ReactNode;
  label: string;
  opening?: boolean;
  closing?: boolean;
}) {
  const { mode, tiltX, tiltY } = useCinema();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  const exitA = closing ? 0.66 : 0.5;
  const exitB = closing ? 0.9 : 0.7;
  const inKeys = opening ? [0, 0.01] : [0.04, 0.3];
  const keys = [inKeys[0], inKeys[1], exitA, exitB];

  const opacity = useTransform(p, keys, [opening ? 1 : 0, 1, 1, 0]);
  const z = useTransform(p, keys, [opening ? 0 : -220, 0, 0, -380]);
  const rotateX = useTransform(p, keys, [opening ? 0 : 14, 0, 0, 9]);
  const y = useTransform(p, keys, [opening ? '0%' : '10%', '0%', '0%', '-3%']);

  // Chế độ calm: cảnh hiện/ẩn theo cùng mốc, chỉ bằng opacity (CSS 140ms).
  const visibleAt = (v: number) => (opening || v > inKeys[1] * 0.6) && v < exitA + (exitB - exitA) * 0.6;
  const [on, setOn] = useState(true);
  useMotionValueEvent(p, 'change', (v) => {
    if (mode === 'calm') setOn(visibleAt(v));
  });
  useEffect(() => {
    if (mode !== 'calm') setOn(true);
    else setOn(visibleAt(p.get()));
    // visibleAt chỉ phụ thuộc hằng số của cảnh; p là MotionValue ổn định.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const cinema = mode === 'cinema';

  return (
    <div ref={ref} className={s.track}>
      <div className={s.stage}>
        <motion.figure
          className={s.scene}
          aria-label={label}
          data-calm={mode === 'calm' ? (on ? 'on' : 'off') : undefined}
          style={cinema ? { opacity, z, rotateX, y } : undefined}
        >
          <motion.div className={s.sceneBody} style={cinema ? { rotateX: tiltX, rotateY: tiltY } : undefined}>
            {children}
          </motion.div>
        </motion.figure>
      </div>
    </div>
  );
}
