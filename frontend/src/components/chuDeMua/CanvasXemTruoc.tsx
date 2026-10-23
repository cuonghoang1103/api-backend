'use client';

/**
 * Canvas thu nhỏ trong thẻ xem trước (Cài đặt → Giao diện) — chạy ĐÚNG bộ vẽ của nền web (veMua, kiểu 'xemThu').
 * Nạp qua next/dynamic ⇒ chỉ trang Cài đặt tải bộ vẽ. Dừng khi thẻ ra khỏi màn / tab ẩn; `chay=false` ⇒ một khung tĩnh.
 */

import { useEffect, useRef } from 'react';
import type { Mua } from '@/lib/chuDeMua/logic';
import { veMua } from './veMua';

export default function CanvasXemTruoc({ mua, toi, chay }: { mua: Mua; toi: boolean; chay: boolean }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext('2d');
    if (!cv || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, raf = 0, truoc = 0, hien = true;
    const goc = performance.now();
    const coLai = () => {
      const r = cv.getBoundingClientRect();
      w = Math.max(1, r.width); h = Math.max(1, r.height);
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
    };
    const ve = (t: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      veMua(ctx, { w, h, t, mua, kieu: 'xemThu', toi, chay, dinh: 0, day: 0 });
    };
    const vong = (now: number) => {
      raf = requestAnimationFrame(vong);
      if (now - truoc < 1000 / 30) return;
      truoc = now;
      ve((now - goc) / 1000 + 40);
    };
    const chayLai = () => {
      cancelAnimationFrame(raf); raf = 0;
      if (!chay || !hien || document.visibilityState === 'hidden') { if (!chay) ve(1234.5); return; }
      raf = requestAnimationFrame(vong);
    };
    coLai();
    ve(1234.5);
    const io = new IntersectionObserver(([e]) => { hien = e.isIntersecting; chayLai(); });
    io.observe(cv);
    const onVis = () => chayLai();
    document.addEventListener('visibilitychange', onVis);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [mua, toi, chay]);

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
}
