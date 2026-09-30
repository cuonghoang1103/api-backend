'use client';

/**
 * Vòng quy trình 3D — thuần CSS 3D transforms + framer-motion (KHÔNG three.js:
 * trang phải nhẹ, xem sự cố "trang 1 MB làm Safari treo").
 *
 * Cách dựng: không xoay cả khối (chữ ở nửa sau sẽ bị lật ngược, khó đọc) mà
 * tính vị trí từng thẻ trên vòng tròn theo góc hiện tại `rot`:
 *     x = R·sin(θ + rot),  z = R·cos(θ + rot)
 * rồi `translate3d(x, 0, z)` bên trong một khung `perspective` có nghiêng
 * `rotateX`. Thẻ luôn quay mặt về người xem; độ sâu do trình duyệt tự tính.
 *
 * - Tự xoay chậm khi đang trong màn hình, dừng khi rê chuột / kéo / ngoài màn hình.
 * - Kéo ngang (chuột hoặc cảm ứng) để xoay; bấm thẻ để chọn.
 * - `prefers-reduced-motion`: không tự xoay, chọn thì nhảy thẳng tới vị trí.
 */
import { useEffect, useRef } from 'react';
import {
  animate,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { phaseOf, pick, type Stage } from './data';

const RADIUS = 360;

interface Props {
  stages: Stage[];
  selected: number;
  onSelect: (n: number) => void;
  lang: 'vi' | 'en';
  reduced: boolean;
}

export default function ProcessRing({ stages, selected, onSelect, lang, reduced }: Props) {
  const step = 360 / stages.length;
  const rot = useMotionValue(-selected * step);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { amount: 0.2 });
  const paused = useRef(false);
  /** Người xem đã tự điều khiển (kéo / chọn) ⇒ thôi tự xoay, kẻo thẻ vừa chọn trôi mất. */
  const tookOver = useRef(false);
  const drag = useRef<{ x: number; moved: number } | null>(null);

  // Tự xoay (6°/giây).
  useAnimationFrame((_, delta) => {
    if (reduced || !inView || paused.current || tookOver.current || drag.current) return;
    rot.set(rot.get() - delta * 0.006);
  });

  // Chọn thẻ → đưa thẻ đó ra chính diện theo đường ngắn nhất.
  useEffect(() => {
    const cur = rot.get();
    let target = -selected * step;
    target += Math.round((cur - target) / 360) * 360;
    if (reduced) {
      rot.set(target);
      return;
    }
    const ctl = animate(rot, target, { type: 'spring', stiffness: 60, damping: 18 });
    return () => ctl.stop();
  }, [selected, step, reduced, rot]);

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, moved: 0 };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    d.x = e.clientX;
    d.moved += Math.abs(dx);
    if (d.moved > 6) {
      tookOver.current = true;
      rot.set(rot.get() + dx * 0.35);
    }
  };
  const endDrag = () => {
    // Giữ lại một nhịp để onClick của thẻ biết vừa rồi là kéo, không phải bấm.
    const d = drag.current;
    setTimeout(() => {
      if (drag.current === d) drag.current = null;
    }, 0);
  };

  const L = (vi: string, en: string) => (lang === 'en' ? en : vi);
  const n = stages.length;
  const choose = (k: number) => {
    tookOver.current = true;
    onSelect(k);
  };

  return (
    <div className="relative w-full select-none">
      <div
        ref={wrapRef}
        className="relative h-[280px] sm:h-[370px] lg:h-[440px] w-full overflow-hidden touch-pan-y cursor-grab active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={() => {
          paused.current = false;
          endDrag();
        }}
        onPointerEnter={(e) => {
          if (e.pointerType === 'mouse') paused.current = true;
        }}
        role="group"
        aria-label={L('Vòng quy trình 15 giai đoạn — kéo để xoay, bấm để chọn', '15-stage process ring — drag to rotate, click to select')}
      >
        <div className="absolute inset-0 flex items-center justify-center [perspective:1100px]">
          <div className="relative scale-[0.52] sm:scale-[0.7] lg:scale-[0.9] xl:scale-100 [transform-style:preserve-3d]">
            <div className="relative [transform-style:preserve-3d] [transform:translateY(-34px)_rotateX(-22deg)]">
              {/* Quỹ đạo */}
              <div
                aria-hidden
                className="absolute left-1/2 top-1/2 rounded-full"
                style={{
                  width: RADIUS * 2 + 40,
                  height: RADIUS * 2 + 40,
                  marginLeft: -(RADIUS + 20),
                  marginTop: -(RADIUS + 20),
                  transform: 'rotateX(90deg) translateZ(-58px)',
                  border: '1px dashed color-mix(in srgb, var(--text-muted) 45%, transparent)',
                  background:
                    'radial-gradient(circle, color-mix(in srgb, #8b5cf6 14%, transparent) 0%, transparent 62%)',
                }}
              />
              {/* Lõi */}
              <div
                aria-hidden
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full flex flex-col items-center justify-center text-center"
                style={{
                  background:
                    'radial-gradient(circle at 35% 30%, color-mix(in srgb, #a78bfa 55%, transparent), color-mix(in srgb, #6366f1 30%, transparent) 55%, transparent 72%)',
                  transform: 'translateZ(-40px)',
                }}
              >
                <span className="font-heading text-5xl font-bold text-text-primary tabular-nums">{n}</span>
                <span className="text-[11px] uppercase tracking-[0.2em] text-text-secondary">{L('giai đoạn', 'stages')}</span>
              </div>

              {stages.map((s, i) => (
                <RingCard
                  key={s.slug}
                  stage={s}
                  index={i}
                  step={step}
                  rot={rot}
                  active={s.n === selected}
                  lang={lang}
                  onClick={() => {
                    if (drag.current && drag.current.moved > 6) return;
                    choose(s.n);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-center gap-3 px-1">
        <button
          type="button"
          onClick={() => choose((selected - 1 + n) % n)}
          className="shrink-0 w-9 h-9 rounded-full border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
          style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
          aria-label={L('Giai đoạn trước', 'Previous stage')}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 max-w-xs text-center min-w-0" aria-live="polite">
          <p className="text-sm font-semibold text-text-primary leading-snug">
            <span className="tabular-nums" style={{ color: phaseOf(stages[selected].phase).color }}>
              {String(selected).padStart(2, '0')}
            </span>{' '}
            · {pick(stages[selected].title, lang)}
          </p>
          <p className="text-[11px] text-text-muted mt-0.5">
            {reduced ? L('Bấm thẻ hoặc mũi tên để chọn', 'Tap a card or arrow to pick') : L('Kéo để xoay · bấm để chọn', 'Drag to rotate · tap to pick')}
          </p>
        </div>
        <button
          type="button"
          onClick={() => choose((selected + 1) % n)}
          className="shrink-0 w-9 h-9 rounded-full border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
          style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
          aria-label={L('Giai đoạn sau', 'Next stage')}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function RingCard({
  stage,
  index,
  step,
  rot,
  active,
  lang,
  onClick,
}: {
  stage: Stage;
  index: number;
  step: number;
  rot: MotionValue<number>;
  active: boolean;
  lang: 'vi' | 'en';
  onClick: () => void;
}) {
  const color = phaseOf(stage.phase).color;
  const base = index * step;
  const transform = useTransform(rot, (r) => {
    const a = ((base + r) * Math.PI) / 180;
    const x = Math.sin(a) * RADIUS;
    const z = Math.cos(a) * RADIUS;
    return `translate(-50%, -50%) translate3d(${x.toFixed(1)}px, 0px, ${z.toFixed(1)}px)`;
  });
  // Mặt trước sáng, mặt sau mờ — cho cảm giác chiều sâu và giữ chữ đọc được.
  const opacity = useTransform(rot, (r) => {
    const c = Math.cos(((base + r) * Math.PI) / 180);
    return 0.16 + 0.84 * ((c + 1) / 2) ** 1.6;
  });

  return (
    <motion.button
      type="button"
      onClick={onClick}
      style={{
        transform,
        opacity,
        borderColor: active ? color : 'var(--border-color)',
        background: active
          ? `linear-gradient(160deg, color-mix(in srgb, ${color} 22%, var(--bg-card)), var(--bg-card))`
          : 'var(--bg-card)',
        boxShadow: active ? `0 10px 30px -8px ${color}99` : '0 6px 18px -10px rgba(0,0,0,0.45)',
      }}
      className="absolute left-1/2 top-1/2 w-[132px] h-[96px] rounded-2xl border-2 px-3 py-2.5 text-left flex flex-col justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-0"
      aria-pressed={active}
      aria-label={`${stage.n}. ${pick(stage.title, lang)}`}
    >
      <span className="flex items-center justify-between">
        <span className="font-heading text-xl font-bold tabular-nums" style={{ color }}>
          {String(stage.n).padStart(2, '0')}
        </span>
        <span className="w-2 h-2 rounded-full" style={{ background: color }} />
      </span>
      <span className="text-[12px] leading-tight font-semibold text-text-primary line-clamp-2">
        {pick(stage.title, lang)}
      </span>
    </motion.button>
  );
}
