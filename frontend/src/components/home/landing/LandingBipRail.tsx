'use client';

/**
 * Gấu Bíp pixel NGỒI GÕ trên thanh header trang chủ (11/11/2026) — thay robot SVG `LandingRobotRail`
 * (hoạt cảnh đá bóng + gõ code 48s) bằng Gấu pixel {@link GauPixel} mode="desk": ngoảnh sang trái lấy máy
 * ra gõ, câu chào TIẾNG ANH hiện dần bên cạnh, nghỉ 5–8s rồi đổi câu, lặp. Ngang với app desktop.
 *
 * Giữ `.landing-robot-rail` + `.landing-rail-line` cho đường ray; Gấu + chữ đặt giữa. Ghi chữ thẳng DOM
 * (ref.textContent) nên không re-render 60fps. prefers-reduced-motion ⇒ hiện sẵn câu đầu.
 */
import { useEffect, useRef } from 'react';
import { GauPixel } from '@/components/chat/claude/GauPixel';

const LINES = [
  'Welcome to CuongThai — I\'m CuongMini, CuongHoangDev\'s assistant.',
  'Glad you dropped by my ecosystem. Make yourself at home.',
  'Ask me about code, learning, or anything on your mind.',
  'Let\'s build something great today.',
  'From web to desktop to CLI — one assistant, everywhere.',
];

export default function LandingBipRail() {
  const sayRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { if (sayRef.current) sayRef.current.textContent = LINES[0] ?? ''; return; }
    const s = { li: 0, ci: 0, mode: 'type' as 'type' | 'hold' | 'erase', hold: 0, last: 0, wait: 6000 };
    let raf = 0;
    const put = (txt: string, cur: boolean) => { if (sayRef.current) sayRef.current.textContent = txt + (cur ? '▋' : ' '); };
    const tick = (now: number) => {
      if (!s.last) s.last = now;
      const dt = now - s.last; s.last = now;
      const full = LINES[s.li] ?? '';
      const cur = Math.floor(now / 500) % 2 === 0;
      if (s.mode === 'type') {
        s.ci += dt / 42; const n = Math.floor(s.ci);
        if (n >= full.length) { put(full, cur); s.mode = 'hold'; s.hold = 0; s.wait = 5500 + Math.random() * 2500; }
        else put(full.slice(0, n), cur);
      } else if (s.mode === 'hold') {
        s.hold += dt; put(full, cur); if (s.hold > s.wait) s.mode = 'erase';
      } else {
        s.ci -= dt / 22; const n = Math.max(0, Math.floor(s.ci)); put(full.slice(0, n), cur);
        if (n <= 0) { s.li = (s.li + 1) % LINES.length; s.ci = 0; s.mode = 'type'; }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="landing-robot-rail landing-bip-rail" aria-label="CuongMini đang chào">
      <span className="landing-rail-line" />
      <div className="landing-bip-row">
        <GauPixel mode="desk" state="thinking" size={46} title="CuongMini" />
        <span ref={sayRef} className="landing-bip-say" />
      </div>
    </div>
  );
}
