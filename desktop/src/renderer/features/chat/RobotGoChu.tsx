/**
 * ============================================================
 * GẤU PIXEL NGỒI GÕ câu chào tiếng Anh — đầu trang AI (11/11/2026)
 * ============================================================
 *
 * Thay con robot SVG cũ (26/09/2026) bằng Gấu pixel {@link GauPixel} — ngang với web /chat. Gấu gõ nhanh,
 * câu chào TIẾNG ANH hiện ra từng chữ, con trỏ nháy; gõ xong đứng im 5–8s rồi xoá, đổi câu, lặp mãi.
 *
 * ─── LUẬT GIỮ ───
 *   · Ghi chữ thẳng vào DOM (ref.textContent), KHÔNG setState mỗi khung ⇒ không re-render 60fps.
 *   · Chỉ đổi state `typing` khi chuyển chặng (gõ ↔ nghỉ) để Gấu đổi tư thế — hiếm, nhẹ.
 *   · `prefers-reduced-motion` ⇒ hiện sẵn câu đầu, Gấu đứng yên.
 */
import { useEffect, useRef, useState } from 'react';
import { GauPixel } from './GauPixel';

const LINES = [
  'Welcome to CuongThai — I\'m CuongMini, CuongHoangDev\'s assistant.',
  'Glad you dropped by my ecosystem. Make yourself at home.',
  'Ask me about code, learning, or anything on your mind.',
  'Let\'s build something great today.',
  'From web to desktop to CLI — one assistant, everywhere.',
];

export function RobotGoChu({ title }: { title?: string }) {
  const sayRef = useRef<HTMLSpanElement>(null);
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { if (sayRef.current) sayRef.current.textContent = LINES[0] ?? ''; setTyping(false); return; }
    const s = { li: 0, ci: 0, mode: 'type' as 'type' | 'hold' | 'erase', hold: 0, last: 0, wait: 6000 };
    let raf = 0;
    const put = (txt: string, cur: boolean) => { if (sayRef.current) sayRef.current.textContent = txt + (cur ? '▋' : ' '); };
    const tick = (now: number) => {
      if (!s.last) s.last = now;
      const dt = now - s.last; s.last = now;
      const full = LINES[s.li];
      if (!full) { s.li = 0; raf = requestAnimationFrame(tick); return; }
      const cur = Math.floor(now / 500) % 2 === 0;
      if (s.mode === 'type') {
        s.ci += dt / 42; const n = Math.floor(s.ci);
        if (n >= full.length) { put(full, cur); s.mode = 'hold'; s.hold = 0; s.wait = 5500 + Math.random() * 2500; setTyping(false); }
        else put(full.slice(0, n), cur);
      } else if (s.mode === 'hold') {
        s.hold += dt; put(full, cur); if (s.hold > s.wait) { s.mode = 'erase'; setTyping(true); }
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
    <div className="ct-rgc" title={title} style={{ display: 'flex', alignItems: 'center', gap: 9, height: 40, flex: '0 0 auto' }}>
      <GauPixel size={34} state={typing ? 'thinking' : 'idle'} mode="face" />
      {/* Ô chữ BỀ RỘNG CỐ ĐỊNH ⇒ khối không đổi kích thước khi gõ ⇒ Gấu ĐỨNG YÊN, chữ hiện trong ô. */}
      <span
        ref={sayRef}
        style={{
          fontFamily: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace',
          fontSize: 13, lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden',
          textOverflow: 'clip', color: 'var(--ct-muted, #8a93a3)',
          width: '27rem', maxWidth: '46vw', flex: '0 0 auto',
        }}
      />
    </div>
  );
}
