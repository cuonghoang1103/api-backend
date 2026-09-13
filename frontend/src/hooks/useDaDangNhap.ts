'use client';

/**
 * "Người này đã đăng nhập chưa?" — dùng cho các trang gác toàn bộ nội dung.
 * ─────────────────────────────────────────────────────────────────────────
 * ⚠️ ĐỪNG gác trang bằng mỗi `useAuthStore().isAuthenticated`.
 *
 * Đo thật 13/09/2026: `/wallet` và `/llm-key` hiện "Đăng nhập để…" cho một
 * người ĐANG đăng nhập — navbar ngay phía trên vẫn hiện avatar của họ. Không
 * lỗi nào, không cảnh báo nào; trang chỉ đơn giản từ chối phục vụ.
 *
 * Nguyên nhân: `zustand/persist` nạp lại localStorage BẤT ĐỒNG BỘ. Lần render
 * đầu (và đôi khi mãi mãi — xem [[feedback_authstore_ishydrated_unreliable]],
 * `onRehydrateStorage` có thể không bao giờ lật `isHydrated`) thì store còn
 * rỗng, trong khi `auth-storage` trong localStorage đã có đủ `user`.
 *
 * Cách đúng, và là cách `app/dashboard` + `app/profile` đã né từ trước:
 * đọc THẲNG localStorage, hợp với cờ của store.
 *
 * `mounted` là bắt buộc: đọc localStorage ngay lần render đầu sẽ khác với
 * kết quả render ở máy chủ và gây lỗi hydration của React. Lần render đầu
 * luôn trả `false` cho khớp máy chủ, rồi effect lật lên.
 */
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export interface TrangThaiDangNhap {
  /** true = chắc chắn đã đăng nhập. */
  daDangNhap: boolean;
  /**
   * false ở lần render đầu (khớp máy chủ). Trang nên hiện khung chờ khi
   * `!sanSang` thay vì hiện ngay lời mời đăng nhập — nháy một cái "Đăng
   * nhập" rồi biến mất trông như lỗi.
   */
  sanSang: boolean;
}

export function useDaDangNhap(): TrangThaiDangNhap {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  let luuTru = false;
  if (mounted && typeof window !== 'undefined') {
    try {
      const raw = window.localStorage.getItem('auth-storage');
      luuTru = !!(raw && (JSON.parse(raw) as { state?: { user?: unknown } })?.state?.user);
    } catch {
      // localStorage bị chặn (cửa sổ ẩn danh, chặn cookie bên thứ ba…).
      // Lúc đó chỉ còn trông vào store — đúng hành vi cũ, không tệ hơn.
      luuTru = false;
    }
  }

  return {
    daDangNhap: (isAuthenticated && user != null) || luuTru,
    sanSang: mounted,
  };
}
