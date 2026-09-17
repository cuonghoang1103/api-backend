'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import { socialUserApi } from '@/lib/api';

/**
 * Báo "người này đang dùng web" cho máy chủ để làm mới `users.lastActiveAt`.
 *
 * ⛔ VÌ SAO CẦN: đo thật trên production 17/09/2026 — **70 người dùng, đúng
 * 1 người có `last_active_at`**, và người đó chỉ có vì app iOS vừa được vá
 * sáng cùng ngày. Cột đã tồn tại từ lâu, `POST /users/status` đã tồn tại từ
 * lâu, và `usersApi.updateStatus` cũng đã được ĐỊNH NGHĨA ở `lib/api.ts` —
 * nhưng không một dòng nào trong toàn bộ web GỌI nó. Định nghĩa một hàm
 * không làm nó chạy.
 *
 * Hậu quả suốt thời gian đó: chấm xanh và "hoạt động N phút trước" không thể
 * hiện cho bất kỳ ai, ở cả web lẫn app, vì không có dữ liệu nào để hiện.
 *
 * ⚠️ KHÔNG khoá vào `isHydrated`. Cờ đó có lúc không lật `true`, và nếu nó
 * kẹt thì người dùng vĩnh viễn hiện ngoại tuyến mà không có lỗi nào để thấy.
 * `isAuthenticated` + có `userId` là đủ điều kiện.
 */
export default function BaoHoatDong() {
  const userId = useAuthStore((s) => s.user?.id ?? null);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const dangGui = useRef(false);

  useEffect(() => {
    if (!isAuthenticated || userId == null) return;

    const gui = () => {
      // Tab nằm ở nền thì KHÔNG báo — không thì mở một tab rồi quên suốt đêm
      // là cả đêm hiện "đang hoạt động".
      if (document.visibilityState !== 'visible') return;
      if (dangGui.current) return;
      dangGui.current = true;
      // Hỏng thì im: việc nền, nhịp sau bù. Báo lỗi ra màn hình cho việc này
      // là quấy rầy người dùng vì thứ họ không yêu cầu.
      socialUserApi.updateStatus().catch(() => {}).finally(() => { dangGui.current = false; });
    };

    gui();
    // 45 giây, PHẢI nhỏ hơn ngưỡng 60s ở `follow.service.ts`. Đặt đúng 60 thì
    // có lúc mốc quá hạn trước nhịp kế và người khác thấy mình nhấp nháy
    // online/offline.
    const dong = setInterval(gui, 45_000);
    // Quay lại tab thì báo NGAY, không đợi hết nhịp.
    document.addEventListener('visibilitychange', gui);
    return () => {
      clearInterval(dong);
      document.removeEventListener('visibilitychange', gui);
    };
  }, [isAuthenticated, userId]);

  return null;
}
