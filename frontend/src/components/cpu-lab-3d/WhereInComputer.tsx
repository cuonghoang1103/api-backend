'use client';
/**
 * <WhereInComputer focus="cpu.alu" /> — mini-map "Bạn đang ở đâu trong máy tính".
 * Đặt cạnh bất kỳ mô phỏng nào: camera bay tới chỗ khái niệm đó NẰM hoặc XẢY RA trong máy thật, khung sáng + một dòng giải thích.
 *
 *   focus   — id điểm đến (FOCUS_IDS trong scene/data.ts: 'cpu.registers', 'ram.cells', 'ssd.nand'…)
 *             HOẶC tên khái niệm ('page-table', 'tlb', 'scheduler', 'packet'… — CONCEPTS trong scene/data.ts)
 *   lang    — 'vi' (mặc định) | 'en'
 *   height  — chiều cao px (mặc định 260); bề rộng = 100% khung chứa
 *   caption — hiện chú thích dưới (mặc định true)
 *
 * Hiệu năng: chỉ nạp three.js khi khung hiện trên màn hình; chỉ dựng thế giới vĩ mô; hoạ tiết độ nét thấp; vẽ lúc đang bay +
 * 8 giây xoay chậm sau đó rồi NGỪNG vẽ (rê chuột vào để xoay tiếp). Giảm chuyển động / không WebGL ⇒ sơ đồ 2D.
 * Một trang chỉ nên có MỘT mini-map (mỗi cái giữ một ngữ cảnh WebGL).
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { CONCEPTS, FOCUS, t2, type FocusId, type Lang } from './scene/data';
import type { Journey } from './scene/journey';
import { MiniMap2D } from './Fallback2D';
import s from './cpu3d.module.css';

function resolve(x: string): { focus: FocusId; also: FocusId[]; note?: { vi: string; en: string } } {
  if (x in FOCUS) return { focus: x as FocusId, also: [] };
  const c = CONCEPTS[x];
  return c ? { focus: c.focus, also: c.also ?? [], note: c.note } : { focus: 'pc', also: [] };
}

export interface WhereInComputerProps { focus: string; lang?: Lang; height?: number; caption?: boolean; className?: string }

export default function WhereInComputer({ focus, lang = 'vi', height = 260, caption = true, className }: WhereInComputerProps) {
  const r = useMemo(() => resolve(focus), [focus]);
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const [flat, setFlat] = useState(false);
  const [near, setNear] = useState(false);
  const st = useRef({ from: r.focus as FocusId, to: r.focus as FocusId, also: r.also, start: 0, dur: 1800, idleUntil: 0, reduced: false });
  const kick = useRef<() => void>(() => {});

  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    st.current.reduced = reduced;
    let ok = false;
    try { const c = document.createElement('canvas'); ok = !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { /* không WebGL */ }
    if (!ok) setFlat(true);
    const io = new IntersectionObserver((e) => { if (e[0]?.isIntersecting) { setNear(true); io.disconnect(); } }, { rootMargin: '200px' });
    if (boxRef.current) io.observe(boxRef.current);
    return () => io.disconnect();
  }, []);

  // đổi focus ⇒ bay từ chỗ cũ tới chỗ mới
  useEffect(() => {
    const S = st.current;
    if (S.to !== r.focus) { S.from = S.to; S.to = r.focus; S.start = performance.now(); }
    S.also = r.also;
    S.idleUntil = performance.now() + S.dur + 8000;
    kick.current();
  }, [r]);

  useEffect(() => {
    if (flat || !near) return;
    let alive = true, raf = 0, j: Journey | null = null;
    const box = boxRef.current!, canvas = canvasRef.current!;
    let cleanup = () => {};
    (async () => {
      const { createJourney, FOCUS_HL } = await import('./scene/journey');
      if (!alive) return;
      const b = box.getBoundingClientRect();
      try {
        j = createJourney(canvas, { quality: 'high', texQ: 'low', macroOnly: true, width: b.width, height: b.height, dpr: Math.min(window.devicePixelRatio || 1, 1.5) });
      } catch { setFlat(true); return; }
      const ro = new ResizeObserver(() => { const c = box.getBoundingClientRect(); j?.resize(c.width, c.height); kick.current(); });
      ro.observe(box);
      const t0 = performance.now();
      const draw = (now: number) => {
        if (!alive || !j) return;
        const S = st.current;
        const k = S.reduced ? 1 : Math.min(1, (now - S.start) / S.dur);
        const t = (now - t0) / 1000;
        const hl: Record<string, number> = {};
        for (const a of S.also) for (const h of FOCUS_HL[a]) hl[h] = Math.max(hl[h] ?? 0, 0.55 * k);
        j.setState({ mode: 'focus', from: k < 1 ? S.from : undefined, to: S.to, k, t, hl, orbit: S.reduced ? 0 : 0.12 * Math.sin(t * 0.35), noBlur: S.reduced });
        j.render();
        const p = j.focusPoint();
        if (pinRef.current) {
          pinRef.current.style.opacity = k >= 1 && p.inFront ? '1' : '0';
          pinRef.current.style.transform = `translate(${p.x}px, ${p.y}px)`;
        }
        if (now < S.idleUntil && !S.reduced) raf = requestAnimationFrame(draw);
      };
      kick.current = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(draw); };
      const wake = () => { st.current.idleUntil = performance.now() + 8000; kick.current(); };
      box.addEventListener('pointerenter', wake);
      kick.current();
      cleanup = () => { ro.disconnect(); box.removeEventListener('pointerenter', wake); };
    })();
    return () => { alive = false; cancelAnimationFrame(raf); cleanup(); j?.dispose(); kick.current = () => {}; };
  }, [flat, near]);

  const f = FOCUS[r.focus];
  return (
    <div ref={boxRef} className={`${s.mini} ${className ?? ''}`} style={{ height }} role="img"
      aria-label={`${lang === 'en' ? 'Where in the computer' : 'Vị trí trong máy tính'}: ${t2(f.name, lang)}. ${t2(r.note ?? f.what, lang)}`}>
      {flat ? <MiniMap2D focus={r.focus} also={r.also} /> : <canvas ref={canvasRef} />}
      <div ref={pinRef} className={s.pin} style={{ opacity: 0 }} />
      <span className={s.miniTag}>{lang === 'en' ? 'Where is it?' : 'Ở đâu trong máy?'}</span>
      {caption && (
        <div className={s.miniCap}>
          <b>{t2(f.name, lang)}</b>
          <span>{t2(r.note ?? f.what, lang)}</span>
          {r.also.length > 0 && <div className="also" style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 5 }}>{r.also.map((a) => <i key={a} style={{ fontStyle: 'normal', font: '600 11px/1 system-ui', padding: '3px 7px', borderRadius: 999, border: '1px solid rgba(125,211,252,.4)', color: '#bae6fd' }}>+ {t2(FOCUS[a].name, lang)}</i>)}</div>}
        </div>
      )}
    </div>
  );
}
