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

/** Phần tử position:fixed chứa `el` (hoặc chính nó); null nếu không có. */
function goiCoDinh(el: Element | null): HTMLElement | null {
  for (let n = el as HTMLElement | null; n && n !== document.body && n !== document.documentElement; n = n.parentElement) {
    if (getComputedStyle(n).position === 'fixed') return n;
  }
  return null;
}

/**
 * Đo "khung" của trang từ DOM thật, không đoán số:
 *  · dinh — mép dưới thanh điều hướng trên;
 *  · day — chiều cao các thanh CỐ ĐỊNH rộng ở đáy (thanh tab di động, trình nhạc kéo ngang…);
 *  · tranhPhai / tranhTrai — mép trên của NÚT NỔI ở góc dưới phải / trái (robot CuongMini, "Ask CuongMini",
 *    bong bóng chat…), tìm bằng elementsFromPoint trên một lưới điểm ở hai góc dưới. Canvas có
 *    pointer-events:none nên không tự bắt chính nó. Lớp phủ toàn màn (splash, modal) bị bỏ qua.
 */
function doChrome(w: number, h: number) {
  const nav = document.querySelector('.app-top-nav') as HTMLElement | null;
  const r = nav?.getBoundingClientRect();
  const dinh = r ? Math.max(0, Math.min(r.bottom, 120)) : 64;
  let thanhDay = h;
  let tranhPhai = Infinity;
  let tranhTrai = Infinity;
  const daXet = new Set<HTMLElement>();
  const vung = Math.min(260, w * 0.45);
  const quet = (x0: number, x1: number) => {
    for (let yi = 0; yi < 7; yi++) {
      const y = h * 0.5 + ((h * 0.5) * (yi + 0.5)) / 7;
      for (let xi = 0; xi < 5; xi++) {
        const x = x0 + ((x1 - x0) * (xi + 0.5)) / 5;
        for (const el of document.elementsFromPoint(x, y)) {
          const f = goiCoDinh(el);
          if (!f || daXet.has(f)) continue;
          daXet.add(f);
          const b = f.getBoundingClientRect();
          if (b.height > h * 0.5 || b.width < 8 || b.height < 8) continue; // lớp phủ toàn màn / rác
          if (b.top < h * 0.35) continue;
          if (b.width > w * 0.6) { thanhDay = Math.min(thanhDay, b.top); continue; }
          // Thuộc góc nào thì góc đó tránh (phần tử ở giữa đáy thì cả hai).
          if (b.right > w - vung) tranhPhai = Math.min(tranhPhai, b.top);
          if (b.left < vung) tranhTrai = Math.min(tranhTrai, b.top);
        }
      }
    }
  };
  quet(w - vung, w);
  quet(0, vung);
  return { dinh, day: Math.max(0, h - thanhDay), tranhPhai, tranhTrai };
}

export default function NenMuaCanvas({ mua, toi, chay, tocDo = 1, trongAdmin = false }: {
  mua: Mua; toi: boolean; chay: boolean; tocDo?: number;
  /** Admin: vẽ TẠI CHỖ (trong .admin-root), không portal ra body, không né thanh điều hướng của site. */
  trongAdmin?: boolean;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    let w = 0, h = 0, dpr = 1;
    let chrome = { dinh: 64, day: 0, tranhPhai: Infinity, tranhTrai: Infinity };
    let raf = 0, truoc = 0;
    const goc = performance.now();

    const coLai = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      chrome = trongAdmin ? { dinh: 0, day: 0, tranhPhai: Infinity, tranhTrai: Infinity } : doChrome(w, h);
    };
    const ve = (t: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      veMua(ctx, { w, h, t, mua, kieu: 'trang', toi, chay, ...chrome });
    };
    const vongLap = (bayGio: number) => {
      raf = requestAnimationFrame(vongLap);
      if (bayGio - truoc < KHUNG_MS) return;
      truoc = bayGio;
      ve((((bayGio - goc) / 1000) * tocDo) % 36_000);
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
    // Nút nổi xuất hiện / đổi chỗ sau khi trang hydrate (robot, trình nhạc mở…) ⇒ đo lại mỗi 1,5 s (≈70 lần
    // elementsFromPoint — rẻ); khác thì vẽ lại (cần cho chế độ đứng yên, vốn chỉ vẽ một khung).
    const doLai = setInterval(() => {
      if (document.visibilityState === 'hidden' || trongAdmin) return;
      const m = doChrome(w, h);
      if (m.dinh !== chrome.dinh || m.day !== chrome.day || m.tranhPhai !== chrome.tranhPhai || m.tranhTrai !== chrome.tranhTrai) {
        chrome = m;
        if (!chay) ve(1234.5);
      }
    }, 1500);
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(henCo);
      clearInterval(doLai);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [mua, toi, chay, tocDo, trongAdmin]);

  // Lớp ánh sáng loang trôi chậm SAU canvas (27/10/2026, "động như iPad"): chỉ CSS transform/opacity ⇒ chạy trên
  // compositor (GPU), không tốn luồng chính; đứng yên khi tắt hiệu ứng (data-chay="0").
  const lop = (
    <>
      <div className="nen-mua-quang" data-chay={chay ? '1' : '0'} aria-hidden="true"><i /><i /><i /></div>
      <canvas ref={ref} className="nen-mua-canvas" aria-hidden="true" />
    </>
  );
  if (trongAdmin) return <div className="nen-mua-admin" aria-hidden="true">{lop}</div>;
  return createPortal(lop, document.body);
}
