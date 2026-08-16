/**
 * Notes trên desktop — DÙNG LẠI nguyên trang Notes của web.
 *
 * ─── Vì sao không viết lại ───
 * Bản web đã là một Notion hoàn chỉnh: 22 component, 6.332 dòng, có slash menu,
 * database (bảng/board/lịch), trang lồng nhau, bình luận, lịch sử phiên bản,
 * backlink, mục lục, chia sẻ, flashcard. Viết lại từng ấy thứ ở đây là làm lại
 * nhiều tháng công việc, rồi phải nuôi hai bản song song mãi mãi — mỗi tính
 * năng mới phải làm hai lần, mỗi lỗi phải sửa hai chỗ.
 *
 * Hai điều khiến việc dùng lại khả thi (đã kiểm, không đoán):
 *   • Cả cây Notes chỉ dính Next.js đúng MỘT chỗ (`next/dynamic`), và trang
 *     không dùng router/link/image của Next. Xem shims/next-dynamic.tsx.
 *   • `lib/api.ts` export ra chính instance axios, nên đổi `baseURL` + gắn
 *     Bearer là 4.994 dòng gọi API chạy nguyên xi. Xem shims/web-api-adapter.ts.
 *
 * ─── Ba thứ lớp bọc này phải làm ───
 *  1. Trỏ axios của web vào máy chủ thật (web dựa vào proxy Next cùng origin,
 *     desktop thì không có).
 *  2. Nạp phiên desktop vào `authStore` của web — cây Notes đọc `user`/`token`
 *     từ đó, và nếu nó rỗng thì mọi lời gọi API đi ra mà không có ai đăng nhập.
 *  3. Chờ cả hai xong RỒI mới dựng trang. Dựng trước sẽ khiến lượt gọi API đầu
 *     tiên bay đi khi chưa có token — nhận 401, và trang hiện ra trống trơn
 *     dù người dùng đã đăng nhập.
 */
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import WebNotesPage from '@/app/notes/page';
import { useAuthStore } from '@/store/authStore';
import { useSession } from '../../auth/session';
import { configureWebApi } from '../../shims/web-api-adapter';

export function NotesPage() {
  const { api, user } = useSession();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!api || !user) return;

    // 1. Gốc API. Ở dev đây là chuỗi rỗng — proxy của Vite lo chuyển tiếp.
    configureWebApi({
      apiBase: api.baseUrlForForms(),
      getToken: () => api.getToken(),
    });

    // 2. Nạp phiên vào store của web.
    //
    // Dựng lại hình dạng `AuthResponse` mà `setAuth` mong đợi. `refreshToken`
    // để rỗng CÓ CHỦ ĐÍCH: backend không có endpoint nào nhận nó (xem
    // shared/ipc.ts), nên điền vào chỉ tạo ảo giác là nó dùng được.
    useAuthStore.getState().setAuth({
      userId: user.userId,
      username: user.username,
      email: user.email,
      fullName: user.fullName ?? '',
      avatarUrl: user.avatarUrl ?? '',
      roles: user.roles,
      role: user.role,
      roleVersion: 0,
      token: api.getToken() ?? '',
      refreshToken: '',
    } as never);

    setReady(true);
  }, [api, user]);

  if (!ready) {
    return (
      <div className="ct-boot">
        <div className="ct-empty">
          <Loader2 size={22} className="ct-spin" aria-hidden />
          <p style={{ marginTop: 10 }}>Đang mở Ghi chú…</p>
        </div>
      </div>
    );
  }

  /**
   * `notes-theme-root` là BẮT BUỘC.
   *
   * Notes có bộ chuyển chủ đề riêng (sáng/tối/nâu) và nó gắn lớp `.dark` lên
   * đúng phần tử này. Toàn bộ biến thể `dark:` của Tailwind trong cây Notes
   * treo vào đó. Thiếu lớp bọc thì chủ đề tối của Notes không bao giờ áp, và
   * giao diện ra chữ đen trên nền trắng ngay giữa app đang ở chủ đề tối.
   *
   * Ngược lại cũng nguy hiểm: chủ đề tối TOÀN CỤC của dự án dùng lớp
   * `theme-dark` trên <html>, KHÔNG phải `dark` — đặt nhầm `dark` lên <html>
   * sẽ kích hoạt mọi `dark:` của Tailwind trong Notes và phá chính bộ chuyển
   * chủ đề của nó. Đây là lỗi đã xảy ra thật trên web ngày 02/07/2026.
   */
  return (
    <div className="ct-notes-host notes-theme-root">
      <WebNotesPage />
    </div>
  );
}
