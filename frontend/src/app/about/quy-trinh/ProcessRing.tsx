'use client';

/**
 * Vòng quy trình 3D — thuần CSS 3D transforms + framer-motion (KHÔNG three.js:
 * trang phải nhẹ, xem sự cố "trang 1 MB làm Safari treo").
 *
 * Cách dựng: không xoay cả khối (chữ ở nửa sau sẽ bị lật ngược) mà tính vị trí
 * từng giai đoạn trên vòng theo góc hiện tại `rot`:
 *     x = R·sin(θ + rot),  z = R·cos(θ + rot)
 * rồi `translate3d(x, 0, z)` trong một khung `perspective` nghiêng `rotateX`.
 *
 * ─── BẢN 2 (01/10/2026): SỬA THẺ HAI BÊN CHỒNG NHAU ─────────────────────────
 * Bản 1 vẽ MỌI giai đoạn thành thẻ 132×96 trên vòng R=360. Ở hai bên vòng, hai
 * thẻ kề nhau chỉ cách nhau R·(1−cos 24°) ≈ 31px theo chiều ngang ⇒ chồng nhau
 * (03/04, 13/14) ở mọi góc xoay. Không có bán kính nào cứu được điều đó khi mọi
 * nút đều là thẻ to. Bản 2:
 *   · CHỈ cung trước (|góc| ≤ FULL°) hiện thẻ đầy đủ; phần còn lại của vòng là
 *     nút tròn đánh số. Giữa FULL° và FADE° hai lớp cross-fade.
 *   · R = max(520, 26·N), perspective 2000px (bản 1: 1100 — phóng to cung trước
 *     quá đà), nghiêng −20° (màn hẹp −34° để các nút tách nhau theo chiều dọc).
 *   · Co giãn bằng `scale3d(k,k,k)` theo bề rộng khung đo bằng ResizeObserver
 *     (bản 1 dùng `scale()` 2D: không co trục z ⇒ phối cảnh méo trên màn nhỏ).
 *   · Màn < 640px: không hiện thẻ trên vòng (thẻ ~90px không đọc được và chồng
 *     nhau khi đang xoay) — chỉ nút số + chú thích bên dưới.
 * Đã đo bằng Chrome headless (Playwright) trên bản dựng tĩnh cùng công thức:
 * quét góc xoay từng 1,5° × N ∈ {15, 20, 21} × bề rộng 360→1440px, đếm cặp
 * hình chữ nhật hiển thị (opacity > 0,35) giao nhau > 2px ⇒ 0 cặp.
 *
 * - Tự xoay chậm khi trong màn hình; dừng khi rê chuột / kéo / ngoài màn hình.
 * - Kéo ngang để xoay; bấm thẻ hoặc nút để đưa giai đoạn đó ra trước.
 * - `prefers-reduced-motion`: không tự xoay, chọn thì nhảy thẳng tới vị trí.
 */
import Link from 'next/link';
import cinema from './cinema.module.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  animate,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { phaseOf, pick, stageHref, type Stage } from './data';

const PERSP = 2000;

interface RingParams {
  k: number;
  /** Góc (độ) tới đó thẻ hiện đầy đủ; < 0 = không hiện thẻ (màn hẹp). */
  full: number;
  fade: number;
  /** Phóng thẻ (màn vừa) / nút (màn hẹp) để bù cho k nhỏ. */
  boost: number;
  chip: number;
  tilt: number;
  R: number;
  /** Dời lên để vòng nằm giữa khung theo chiều dọc. */
  off: number;
  height: number;
}

function ringParams(w: number, n: number): RingParams {
  const k = Math.min(1, Math.max(0.3, w / 1180));
  const mode = w < 640 ? 's' : w < 1024 ? 'm' : 'l';
  const full = mode === 's' ? -1 : mode === 'm' ? 20 : 30;
  const fade = mode === 's' ? 0 : full + 12;
  const boost = mode === 'm' ? 1.15 : 1;
  const chip = Math.max(1, 0.62 / k);
  const tilt = mode === 's' ? -34 : -20;
  const R = Math.max(520, n * 26);
  const ts = Math.sin((-tilt * Math.PI) / 180);
  const tc = Math.cos((-tilt * Math.PI) / 180);
  const fy = (R * ts * PERSP) / (PERSP - R * tc);
  const by = (R * ts * PERSP) / (PERSP + R * tc);
  return {
    k,
    full,
    fade,
    boost,
    chip,
    tilt,
    R,
    off: Math.round((fy - by) / 2),
    height: Math.round((fy + by) * k + 130 * Math.max(k, 0.6)),
  };
}

/** Khoảng cách góc tới chính diện, 0..180. */
const angleFromFront = (deg: number) => Math.abs((((deg % 360) + 540) % 360) - 180);

interface Props {
  stages: Stage[];
  selected: number;
  onSelect: (n: number) => void;
  lang: 'vi' | 'en';
  reduced: boolean;
}

export default function ProcessRing({ stages, selected, onSelect, lang, reduced }: Props) {
  const n = stages.length;
  const step = 360 / n;
  const L = (vi: string, en: string) => (lang === 'en' ? en : vi);

  const idxOf = (stageN: number) => Math.max(0, stages.findIndex((s) => s.n === stageN));
  const rot = useMotionValue(-idxOf(selected) * step);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { amount: 0.2 });
  const paused = useRef(false);
  /** Người xem đã tự điều khiển ⇒ thôi tự xoay, kẻo giai đoạn vừa chọn trôi mất. */
  const tookOver = useRef(false);
  const drag = useRef<{ x: number; moved: number } | null>(null);

  // Bề rộng khung — giá trị đầu giống nhau ở server và client (tránh lệch hydrate).
  const [w, setW] = useState(1180);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(([e]) => setW(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const prm = useMemo(() => ringParams(w, n), [w, n]);
  // Đưa tham số vào MotionValue để mọi useTransform tính lại khi khung đổi cỡ.
  const prmMV = useMotionValue<RingParams>(prm);
  useEffect(() => {
    prmMV.set(prm);
  }, [prm, prmMV]);

  // Giai đoạn đang ở chính diện — cho dòng chú thích dưới vòng.
  const [front, setFront] = useState(idxOf(selected));
  useMotionValueEvent(rot, 'change', (r) => {
    const i = (((Math.round(-r / step) % n) + n) % n) | 0;
    setFront((cur) => (cur === i ? cur : i));
  });

  // Tự xoay (5°/giây).
  useAnimationFrame((_, delta) => {
    if (reduced || !inView || document.hidden || paused.current || tookOver.current || drag.current) return;
    rot.set(rot.get() - Math.min(delta, 50) * 0.005);
  });

  // Chọn → đưa giai đoạn đó ra chính diện theo đường ngắn nhất.
  useEffect(() => {
    const cur = rot.get();
    let target = -idxOf(selected) * step;
    target += Math.round((cur - target) / 360) * 360;
    if (reduced) {
      rot.set(target);
      return;
    }
    const ctl = animate(rot, target, { type: 'spring', stiffness: 60, damping: 18 });
    return () => ctl.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      rot.set(rot.get() + dx * 0.3);
    }
  };
  const endDrag = () => {
    // Giữ một nhịp để onClick biết vừa rồi là kéo, không phải bấm.
    const d = drag.current;
    setTimeout(() => {
      if (drag.current === d) drag.current = null;
    }, 0);
  };

  const choose = (i: number) => {
    tookOver.current = true;
    onSelect(stages[((i % n) + n) % n].n);
  };
  const fs = stages[front] ?? stages[0];
  const fColor = phaseOf(fs.phase).color;

  return (
    <div className={`relative w-full select-none ${cinema.scene}`}>
      <div
        ref={wrapRef}
        style={{ height: prm.height }}
        className="relative w-full overflow-hidden touch-pan-y cursor-grab active:cursor-grabbing"
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
        aria-label={L(`Vòng quy trình ${n} giai đoạn — kéo để xoay, bấm để chọn`, `${n}-stage process ring — drag to rotate, click to select`)}
      >
        <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: PERSP }}>
          <div className="relative [transform-style:preserve-3d]" style={{ transform: `scale3d(${prm.k},${prm.k},${prm.k})` }}>
            <div
              className="relative [transform-style:preserve-3d]"
              style={{ transform: `translateY(${-prm.off}px) rotateX(${prm.tilt}deg)` }}
            >
              {/* Quỹ đạo */}
              <div
                aria-hidden
                className="absolute left-0 top-0 rounded-full"
                style={{
                  width: prm.R * 2,
                  height: prm.R * 2,
                  transform: 'translate(-50%, -50%) rotateX(90deg)',
                  border: '1px solid #74c7ed66',
                  background: 'radial-gradient(circle, color-mix(in srgb, var(--s-ink) 5%, transparent) 0%, transparent 70%)',
                }}
              />
              {[0.72, 1.12].map((scale) => (
                <div
                  key={scale}
                  aria-hidden
                  className={`absolute left-0 top-0 rounded-full ${cinema.orbit}`}
                  style={{ width: prm.R * 2 * scale, height: prm.R * 2 * scale, transform: 'translate(-50%, -50%) rotateX(90deg) translateZ(-24px)', pointerEvents: 'none' }}
                />
              ))}
              {/* Lõi */}
              <div
                aria-hidden
                className={`absolute left-0 top-0 w-48 h-48 flex flex-col items-center justify-center text-center ${cinema.core}`}
                style={{ transform: 'translate(-50%, -50%) translateZ(-60px)' }}
              >
                <span className="font-editorial text-[5rem] leading-none text-[color:var(--s-ink)] tabular-nums">{n}</span>
                <span className="mt-1 text-sm text-[color:var(--s-muted)]">{L('giai đoạn', 'stages')}</span>
              </div>

              {stages.map((s, i) => (
                <RingNode
                  key={s.slug}
                  stage={s}
                  index={i}
                  step={step}
                  rot={rot}
                  prm={prmMV}
                  active={s.n === selected}
                  isFront={i === front}
                  lang={lang}
                  onClick={() => {
                    if (drag.current && drag.current.moved > 6) return;
                    choose(i);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chú thích: giai đoạn ở chính diện */}
      <div className="mt-3 flex items-center justify-center gap-3 px-1">
        <button
          type="button"
          onClick={() => choose(front - 1)}
          className="shrink-0 w-10 h-10 rounded-full border border-[color:var(--s-line-strong)] flex items-center justify-center text-[color:var(--s-ink)] hover:border-[color:var(--s-ink)] transition-colors"
          aria-label={L('Giai đoạn trước', 'Previous stage')}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 max-w-md text-center min-w-0" aria-live="polite">
          <p className="text-[0.95rem] font-semibold text-[color:var(--s-ink)] leading-snug">
            <span className="tabular-nums mr-1.5" style={{ color: fColor }}>
              {String(fs.n).padStart(2, '0')}
            </span>
            {pick(fs.title, lang)}
          </p>
          <Link
            href={stageHref(fs)}
            className="mt-1 inline-flex items-center gap-1 text-[0.8rem] font-semibold text-[color:var(--s-accent)] hover:underline underline-offset-4"
          >
            {L('Mở tài liệu giai đoạn', 'Open the stage document')} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <button
          type="button"
          onClick={() => choose(front + 1)}
          className="shrink-0 w-10 h-10 rounded-full border border-[color:var(--s-line-strong)] flex items-center justify-center text-[color:var(--s-ink)] hover:border-[color:var(--s-ink)] transition-colors"
          aria-label={L('Giai đoạn sau', 'Next stage')}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <p className="mt-1 text-center text-[0.75rem] text-[color:var(--s-muted)]">
        {reduced ? L('Bấm nút hoặc mũi tên để chọn', 'Tap a node or an arrow to choose') : L('Kéo để xoay · bấm để chọn', 'Drag to rotate · tap to choose')}
      </p>
    </div>
  );
}

function RingNode({
  stage,
  index,
  step,
  rot,
  prm,
  active,
  isFront,
  lang,
  onClick,
}: {
  stage: Stage;
  index: number;
  step: number;
  rot: MotionValue<number>;
  prm: MotionValue<RingParams>;
  active: boolean;
  isFront: boolean;
  lang: 'vi' | 'en';
  onClick: () => void;
}) {
  const color = phaseOf(stage.phase).color;
  const base = index * step;

  const pos = (r: number, p: RingParams) => {
    const a = ((base + r) * Math.PI) / 180;
    return `translate(-50%, -50%) translate3d(${(Math.sin(a) * p.R).toFixed(1)}px, 0px, ${(Math.cos(a) * p.R).toFixed(1)}px)`;
  };
  /** f = 1 ở cung trước (thẻ), 0 ở phần còn lại (nút số). */
  const fOf = (r: number, p: RingParams) => {
    if (p.full < 0) return 0;
    const d = angleFromFront(base + r);
    return d <= p.full ? 1 : d >= p.fade ? 0 : 1 - (d - p.full) / (p.fade - p.full);
  };
  /** Mờ dần về phía sau để có chiều sâu và giữ phía trước dễ đọc. */
  const depthOf = (r: number) => 0.22 + 0.78 * ((Math.cos(((base + r) * Math.PI) / 180) + 1) / 2) ** 1.3;

  const cardTransform = useTransform([rot, prm] as MotionValue[], ([r, p]) => `${pos(r as number, p as RingParams)} scale(${(p as RingParams).boost})`);
  const chipTransform = useTransform([rot, prm] as MotionValue[], ([r, p]) => `${pos(r as number, p as RingParams)} scale(${(p as RingParams).chip})`);
  const cardOpacity = useTransform([rot, prm] as MotionValue[], ([r, p]) => fOf(r as number, p as RingParams) * depthOf(r as number));
  const chipOpacity = useTransform([rot, prm] as MotionValue[], ([r, p]) => (1 - fOf(r as number, p as RingParams)) * depthOf(r as number));
  const cardVis = useTransform(cardOpacity, (o) => (o < 0.02 ? 'hidden' : 'visible'));
  const chipVis = useTransform(chipOpacity, (o) => (o < 0.02 ? 'hidden' : 'visible'));

  const title = pick(stage.title, lang);
  const num = String(stage.n).padStart(2, '0');
  const strong = active || isFront;

  return (
    <>
      <motion.button
        type="button"
        onClick={onClick}
        tabIndex={-1}
        aria-hidden
        style={{ transform: cardTransform, opacity: cardOpacity, visibility: cardVis }}
        className={`${cinema.node} absolute left-0 top-0 w-[124px] h-[80px] rounded-[10px] border px-3 py-2 text-left flex flex-col justify-between ${
          active
            ? 'bg-[var(--s-ink)] border-[color:var(--s-ink)] text-[color:var(--s-on-ink)]'
            : 'bg-[var(--s-raise)] border-[color:var(--s-line-strong)] text-[color:var(--s-ink)]'
        }`}
      >
        <span className="flex items-center justify-between w-full">
          <span className="font-editorial text-[1.2rem] leading-none tabular-nums">{num}</span>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
        </span>
        <span className="text-[11px] leading-[1.25] font-semibold line-clamp-2">{title}</span>
      </motion.button>
      <motion.button
        type="button"
        onClick={onClick}
        style={{ transform: chipTransform, opacity: chipOpacity, visibility: chipVis }}
        aria-pressed={active}
        aria-label={`${stage.n}. ${title}`}
        className={`${cinema.node} absolute left-0 top-0 w-[34px] h-[34px] rounded-full border-[1.5px] flex items-center justify-center text-[12px] font-semibold tabular-nums ${
          strong
            ? 'bg-[var(--s-ink)] border-[color:var(--s-ink)] text-[color:var(--s-on-ink)]'
            : 'bg-[var(--s-raise)] border-[color:var(--s-ink-2)] text-[color:var(--s-ink)]'
        }`}
      >
        {stage.n}
      </motion.button>
    </>
  );
}
