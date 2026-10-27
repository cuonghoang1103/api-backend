'use client';

/**
 * iframe AN TOÀN để hiện trang do người học / đề tạo ra (Live demo của đề lớn, Xem trước trang của bài
 * HTML/React) — `sandbox="allow-scripts allow-forms"`, KHÔNG allow-same-origin ⇒ gốc mờ: không đọc
 * được cookie/localStorage/DOM của cuongthai.com, không mở được hộp thoại hay điều hướng trang mẹ.
 * Web: `srcdoc` (thừa kế CSP trang — cho script nội tuyến + cdn.jsdelivr.net). App desktop: CSP cấm
 * script nội tuyến ⇒ nạp trang hộp cát `__CT_HOP_CAT_KHUNG__` (CSP riêng) rồi gửi HTML vào bằng postMessage.
 */
import { useEffect, useRef } from 'react';

export function hopCatKhung(): string | undefined {
  return typeof window !== 'undefined' ? (globalThis as { __CT_HOP_CAT_KHUNG__?: string }).__CT_HOP_CAT_KHUNG__ : undefined;
}

export function KhungAnToan({ html, title, className }: { html: string; title: string; className?: string }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const hopCat = hopCatKhung();
  useEffect(() => {
    const f = ref.current;
    if (!f || !hopCat) return;
    const nap = () => f.contentWindow?.postMessage({ __napTrang: html }, '*');
    f.addEventListener('load', nap, { once: true });
    f.src = hopCat; // nạp lại mỗi lần html đổi
    return () => f.removeEventListener('load', nap);
  }, [html, hopCat]);
  return hopCat
    ? <iframe ref={ref} title={title} sandbox="allow-scripts allow-forms" className={className} />
    : <iframe ref={ref} srcDoc={html} title={title} sandbox="allow-scripts allow-forms" className={className} />;
}
