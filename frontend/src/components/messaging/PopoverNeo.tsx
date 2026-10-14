'use client';

/**
 * Popover NEO vào một phần tử, vẽ qua portal ra `document.body`.
 *
 * Vì sao không `absolute` như menu cũ: khung chat là một ô `overflow-y-auto`,
 * nên menu của tin ở mép trên/dưới bị CẮT mất nửa — đúng chỗ người ta hay bấm
 * nhất (tin mới nhất nằm sát khung soạn tin). `position: fixed` qua portal
 * thoát khỏi mọi ô cắt.
 *
 * Đặt phía trên neo nếu đủ chỗ, không thì phía dưới; kẹp trong màn hình.
 * Đóng khi: bấm ra ngoài, Esc, cuộn khung chat, đổi cỡ cửa sổ.
 */
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { MAU_TOI } from '@/lib/tinNhan/mauToi';

export default function PopoverNeo({
  neo,
  mo,
  onDong,
  canh = 'giua',
  children,
  nhan,
}: {
  neo: RefObject<HTMLElement | null>;
  mo: boolean;
  onDong: () => void;
  /** Căn theo chiều ngang so với neo. */
  canh?: 'trai' | 'phai' | 'giua';
  children: ReactNode;
  /** aria-label cho vùng popover. */
  nhan?: string;
}) {
  const hop = useRef<HTMLDivElement>(null);
  const [viTri, datViTri] = useState<{ left: number; top: number } | null>(null);

  useLayoutEffect(() => {
    if (!mo) { datViTri(null); return; }
    const tinh = () => {
      const n = neo.current;
      const h = hop.current;
      if (!n || !h) return;
      const r = n.getBoundingClientRect();
      const w = h.offsetWidth;
      const ht = h.offsetHeight;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      let left = canh === 'trai' ? r.left : canh === 'phai' ? r.right - w : r.left + r.width / 2 - w / 2;
      left = Math.max(8, Math.min(left, vw - w - 8));
      let top = r.top - ht - 6;
      if (top < 8) top = Math.min(r.bottom + 6, vh - ht - 8);
      datViTri({ left, top });
    };
    tinh();
    // Đo lần hai sau khi nội dung (emoji, chữ) dựng xong kích thước thật.
    const id = requestAnimationFrame(tinh);
    return () => cancelAnimationFrame(id);
  }, [mo, neo, canh]);

  useEffect(() => {
    if (!mo) return;
    const ngoai = (e: Event) => {
      const t = e.target as Node;
      if (hop.current?.contains(t) || neo.current?.contains(t)) return;
      onDong();
    };
    const phim = (e: KeyboardEvent) => { if (e.key === 'Escape') onDong(); };
    const cuon = (e: Event) => {
      if (hop.current && e.target instanceof Node && hop.current.contains(e.target)) return;
      onDong();
    };
    document.addEventListener('pointerdown', ngoai, true);
    document.addEventListener('keydown', phim);
    window.addEventListener('scroll', cuon, true);
    window.addEventListener('resize', onDong);
    return () => {
      document.removeEventListener('pointerdown', ngoai, true);
      document.removeEventListener('keydown', phim);
      window.removeEventListener('scroll', cuon, true);
      window.removeEventListener('resize', onDong);
    };
  }, [mo, neo, onDong]);

  if (!mo || typeof document === 'undefined') return null;
  return createPortal(
    <div
      ref={hop}
      role="dialog"
      aria-label={nhan}
      className="fixed z-[260]"
      style={{ ...MAU_TOI, ...(viTri ? { left: viTri.left, top: viTri.top } : { left: -9999, top: -9999, visibility: 'hidden' }) }}
    >
      {children}
    </div>,
    document.body,
  );
}
