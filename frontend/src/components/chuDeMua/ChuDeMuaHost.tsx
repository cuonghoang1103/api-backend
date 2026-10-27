'use client';

/**
 * Giữ `data-mua` / `data-mua-yen` trên <html> đúng khi điều hướng phía client (script chống nháy chỉ chạy một
 * lần lúc tải trang), và chỉ NẠP lớp canvas khi thật sự cần.
 *
 * Mặc định (không chọn mùa) ⇒ trả về null và không tải gì thêm — web y nguyên như trước.
 */

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { apChuDeLenDom, napChuDeWeb, useChuDeMua, useDomChuDe } from '@/lib/chuDeMua/useChuDeMua';
import type { Mua } from '@/lib/chuDeMua/logic';

const NenMuaCanvas = dynamic(() => import('./NenMuaCanvas'), { ssr: false });

/** `prefers-reduced-motion` của hệ điều hành (class `reduce-motion` là công tắc của web, đọc ở useDomChuDe). */
function useGiamHeDieuHanh() {
  const [v, setV] = useState(false);
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setV(mql.matches);
    const f = () => setV(mql.matches);
    mql.addEventListener?.('change', f);
    return () => mql.removeEventListener?.('change', f);
  }, []);
  return v;
}

export default function ChuDeMuaHost() {
  const pathname = usePathname() || '/';
  const { chuDe, hieuUngDong } = useChuDeMua();
  const { mua, yen, toi, giamClass } = useDomChuDe();
  const giamHdh = useGiamHeDieuHanh();

  // Đổi trang / đổi lựa chọn ⇒ gắn lại. Quay lại tab (có thể đã qua nửa đêm 31/10 → 1/11) ⇒ tính lại "Tự động".
  useEffect(() => { apChuDeLenDom(pathname); }, [pathname, chuDe]);
  // Chủ đề mặc định do admin đặt (27/10/2026) — nạp lúc rảnh, không chặn lần vẽ đầu.
  useEffect(() => { napChuDeWeb(); }, []);
  useEffect(() => {
    const f = () => { if (document.visibilityState === 'visible') apChuDeLenDom(window.location.pathname); };
    document.addEventListener('visibilitychange', f);
    return () => document.removeEventListener('visibilitychange', f);
  }, []);

  if (!mua || yen) return null;
  // 27/10/2026: "Giảm chuyển động" của HỆ ĐIỀU HÀNH (nhiều Mac bật sẵn để tiết kiệm pin) không còn làm đứng yên hẳn —
  // chỉ chậm còn một nửa. Đứng yên khi người dùng tắt "Hiệu ứng động" hoặc bật Giảm chuyển động của CHÍNH web.
  const chay = hieuUngDong && !giamClass;
  return <NenMuaCanvas mua={mua as Mua} toi={toi} chay={chay} tocDo={giamHdh ? 0.5 : 1} />;
}
