'use client';

/**
 * Lớp hạt rơi + trang trí 4 góc của chủ đề mùa — MỘT <canvas> cố định, NẰM SAU nội dung
 * (`.nen-mua-canvas`: z-index âm, pointer-events:none, aria-hidden). Chỉ được nạp qua next/dynamic(ssr:false)
 * khi đã chọn một mùa và không ở màn tập trung (ChuDeMuaHost).
 *
 * Hiệu năng: trần 30 khung/giây · dừng hẳn khi tab ẩn (visibilitychange) · `chay=false` (Giảm chuyển động / tắt
 * Hiệu ứng động) ⇒ vẽ MỘT khung tĩnh, không vòng lặp · DPR trần 2 · số hạt nhỏ trên màn nhỏ (trong veMua).
 */

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { Mua } from '@/lib/chuDeMua/logic';
import { veMua } from './veMua';

const KHUNG_MS = 1000 / 30;

function doChrome() {
  const nav = document.querySelector('.app-top-nav') as HTMLElement | null;
  const r = nav?.getBoundingClientRect();
  // Thanh điều hướng có thể ẩn (trang trần) ⇒ 0; không tìm thấy ⇒ 64px như --app-nav-h.
  const dinh = r ? Math.max(0, Math.min(r.bottom, 120)) : 64;
  const day = window.matchMedia('(max-width: 639.98px)').matches ? 58 : 0;
  return { dinh, day };
}

export default function NenMuaCanvas({ mua, toi, chay }: { mua: Mua; toi: boolean; chay: boolean }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    let w = 0, h = 0, dpr = 1, chrome = { dinh: 64, day: 0 };
    let raf = 0, truoc = 0;
    const goc = performance.now();

    const coLai = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      chrome = doChrome();
    };
    const ve = (t: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      veMua(ctx, { w, h, t, mua, kieu: 'trang', toi, chay, dinh: chrome.dinh, day: chrome.day });
    };
    const vongLap = (bayGio: number) => {
      raf = requestAnimationFrame(vongLap);
      if (bayGio - truoc < KHUNG_MS) return;
      truoc = bayGio;
      ve(((bayGio - goc) / 1000) % 36_000);
    };
    const batDau = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      if (!chay) { ve(1234.5); return; }
      if (document.visibilityState === 'hidden') return;
      raf = requestAnimationFrame(vongLap);
    };

    coLai();
    batDau();

    let henCo: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => {
      clearTimeout(henCo);
      henCo = setTimeout(() => { coLai(); batDau(); }, 120);
    };
    const onVis = () => {
      if (document.visibilityState === 'hidden') { cancelAnimationFrame(raf); raf = 0; }
      else batDau();
    };
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(henCo);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [mua, toi, chay]);

  return createPortal(<canvas ref={ref} className="nen-mua-canvas" aria-hidden="true" />, document.body);
}
