/**
 * Lớp chủ cho MỌI trang app dùng lại nguyên của web.
 *
 * Gộp ba việc mà `NotesPage` đã phải làm, để bốn trang sau không phải chép lại:
 *  1. Trỏ axios của web vào máy chủ thật (web dựa vào proxy cùng origin của
 *     Next; desktop không có).
 *  2. Nạp phiên đăng nhập của desktop vào `authStore` của web — cây web đọc
 *     `user`/`token` từ đó, rỗng thì mọi lời gọi API bay đi không có ai đăng
 *     nhập và trang hiện ra trống trơn dù người dùng ĐÃ đăng nhập.
 *  3. Chỉ dựng trang SAU KHI hai việc trên xong. Dựng trước thì lượt gọi API
 *     đầu tiên nhận 401.
 *
 * ─── Vì sao lại có `khoaPhien` ───
 * Trang được nạp chậm bằng `import()`. Đổi ngôn ngữ (`/language/ja` →
 * `/language/zh`) thì cùng MỘT module được dùng lại và React giữ nguyên
 * component — trạng thái của ngôn ngữ cũ ở lại, và người dùng thấy từ vựng
 * tiếng Nhật dưới lá cờ Trung Quốc. `key` theo đường dẫn buộc gắn lại.
 *
 * ─── `notes-theme-root` ───
 * Cây web dùng biến thể `dark:` của Tailwind. Chủ đề tối TOÀN CỤC của dự án
 * dùng lớp `theme-dark` trên <html>, KHÔNG phải `dark` (đặt nhầm đã phá Notes
 * trên web ngày 02/07/2026). Nên lớp bọc này tự đặt `.dark` khi app đang ở chủ
 * đề tối, phạm vi đúng trong cây web.
 */
import { Suspense, lazy, useEffect, useMemo, useState, type ComponentType } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useAppState } from '../../app-state';
import { useSession } from '../../auth/session';
import { configureWebApi } from '../../shims/web-api-adapter';
import { ThamSoTuyen } from '../../shims/next-navigation';
import { khopTuyenWeb } from './dinhTuyenWeb';

function DangMo({ ten }: { ten: string }) {
  return (
    <div className="ct-boot">
      <div className="ct-empty">
        <Loader2 size={22} className="ct-spin" aria-hidden />
        <p style={{ marginTop: 10 }}>Đang mở {ten}…</p>
      </div>
    </div>
  );
}

/**
 * Chuẩn bị cầu nối web ↔ desktop. Trả `true` khi đã sẵn sàng dựng trang.
 *
 * Tách thành hook riêng để bốn trang dùng chung; gọi nhiều lần vô hại vì
 * `configureWebApi` và `setAuth` đều là đặt-đè, không tích luỹ.
 */
export function useCauNoiWeb(): boolean {
  const { api, user } = useSession();
  const [xong, datXong] = useState(false);

  useEffect(() => {
    if (!api || !user) return;
    configureWebApi({ apiBase: api.baseUrlForForms(), getToken: () => api.getToken() });
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
      // Rỗng CÓ CHỦ ĐÍCH: backend không có endpoint nhận refresh token, điền
      // vào chỉ tạo ảo giác là nó dùng được.
      refreshToken: '',
    } as never);
    datXong(true);
  }, [api, user]);

  return xong;
}

/** Bọc chung: đặt `.dark` cho biến thể Tailwind của cây web. */
export function VoWeb({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useAppState();
  return (
    <div className={`ct-web-host${resolvedTheme === 'dark' ? ' dark' : ''}`}>
      {children}
    </div>
  );
}

/**
 * Dựng MỘT component web cố định (không có đường dẫn động).
 * Dùng cho Thuật toán và Mô phỏng — hai trang không có trang con nào.
 */
export function TrangWebDon({
  nap, ten, canPhien = false,
}: {
  nap: () => Promise<{ default: ComponentType }>;
  ten: string;
  /**
   * Trang này có GỌI API không.
   *
   * ⚠️ Mặc định `false`, và đó là chỗ đã suýt sai. Bản đầu chặn dựng cho tới
   * khi cầu nối web sẵn sàng — mà cầu nối cần một phiên đăng nhập. Thuật toán
   * và Mô phỏng KHÔNG gọi API nào (mã chạy ngay trong máy người dùng), nên
   * người chưa đăng nhập sẽ nhìn "Đang mở…" vĩnh viễn ở một trang vốn không
   * cần máy chủ. Bộ kiểm bố cục bắt được vì nó chạy không có phiên.
   */
  canPhien?: boolean;
}) {
  // Vẫn gọi để cầu nối được cấu hình sẵn — chỉ không CHẶN dựng vì nó.
  const san = useCauNoiWeb();
  // `useMemo` chứ không gọi `lazy` thẳng trong thân: gọi thẳng sẽ tạo một
  // component MỚI ở mỗi lần vẽ, React tháo cây cũ rồi dựng lại từ đầu — với
  // Mô phỏng là dựng lại cả canvas và Web Audio ở mỗi lần vẽ.
  const Lazy = useMemo(() => lazy(nap), [nap]);
  if (canPhien && !san) return <DangMo ten={ten} />;
  return (
    <VoWeb>
      <Suspense fallback={<DangMo ten={ten} />}>
        <Lazy />
      </Suspense>
    </VoWeb>
  );
}

/**
 * Dựng trang web theo ĐƯỜNG DẪN HIỆN TẠI, kèm tham số động.
 * Dùng cho Ngoại ngữ và Lộ trình — hai cây có trang con.
 */
export function TrangWebTheoTuyen({ ten }: { ten: string }) {
  const { route, navigate } = useAppState();
  const san = useCauNoiWeb();
  const khop = useMemo(() => khopTuyenWeb(route), [route]);
  const Lazy = useMemo(() => (khop ? lazy(khop.tuyen.nap) : null), [khop]);

  if (!khop || !Lazy) {
    /* Đường dẫn thuộc cây này nhưng không có trang — chỉ xảy ra với deep link
       hỏng. Nói thẳng ra và cho một đường về, đừng dựng màn hình trống. */
    const goc = `/${route.split('/').filter(Boolean)[0] ?? ''}`;
    return (
      <div className="ct-page">
        <div className="ct-empty">
          <h1>Không tìm thấy</h1>
          <p>Không có trang cho đường dẫn <code>{route}</code>.</p>
          <button type="button" className="ct-btn ct-btn-ghost" onClick={() => navigate(goc)}>
            Về {ten}
          </button>
        </div>
      </div>
    );
  }

  if (!san) return <DangMo ten={ten} />;

  return (
    <VoWeb>
      {/* `key` buộc gắn lại khi đổi đường dẫn — xem chú thích đầu tệp. */}
      <ThamSoTuyen.Provider value={khop.thamSo}>
        <Suspense fallback={<DangMo ten={ten} />}>
          <Lazy key={route} />
        </Suspense>
      </ThamSoTuyen.Provider>
    </VoWeb>
  );
}
