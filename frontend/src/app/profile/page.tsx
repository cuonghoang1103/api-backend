'use client';

/**
 * /profile — chuyển tiếp sang trang cá nhân của chính mình.
 *
 * Trang này KHÔNG hiển thị gì, nó chỉ tìm ra id của người đang đăng nhập rồi
 * chuyển sang `/profile/[id]/v2` — nơi có đủ tab và danh sách bài viết.
 *
 * ⛔ SỰ CỐ 19/08/2026: người dùng đăng nhập bằng Google xong vào đây thì trang
 * QUAY MÃI, không bao giờ đi đâu. Bản cũ chỉ có HAI nhánh:
 *
 *     if (user?.id) → chuyển trang
 *     sau 400ms, nếu !isAuthenticated → về /login
 *
 * Thiếu đúng nhánh thứ ba, và đó lại là nhánh người dùng rơi vào: **đã đăng
 * nhập nhưng KHÔNG có `user.id`**. Lúc đó không nhánh nào chạy, `useEffect`
 * cũng không chạy lại (deps là `user?.id`, mà nó vẫn `undefined`), nên vòng
 * quay chạy vĩnh viễn — không lỗi, không thông báo, không lối ra.
 *
 * Gốc rễ nằm ở luồng OAuth (xem `lib/backendServer.ts`), nhưng trang này vẫn
 * phải tự đứng vững: MỌI trang chờ đều cần một nhánh "chờ quá lâu thì nói ra
 * và cho người dùng một lối đi", không được để trạng thái nào quay vô hạn.
 */

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/lib/api';

/** Chờ quá ngần này mà chưa đi đâu thì thôi quay, nói thẳng ra. */
const TRAN_CHO_MS = 8000;

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [loi, setLoi] = useState<string | null>(null);
  const [dangSua, setDangSua] = useState(false);

  /** Không có id trong store thì hỏi thẳng máy chủ — nó biết ta là ai qua cookie. */
  const layIdTuMayChu = useCallback(async () => {
    setDangSua(true);
    setLoi(null);
    try {
      const res = await authApi.getProfile();
      const hoSo = res.data?.data as { id?: number } | undefined;
      if (hoSo?.id) {
        // Ghi lại vào store để lần sau không phải hỏi nữa.
        useAuthStore.getState().updateProfile({ id: hoSo.id } as never);
        router.replace(`/profile/${hoSo.id}/v2`);
        return;
      }
      setLoi('Máy chủ không nhận ra tài khoản này.');
    } catch {
      setLoi('Không lấy được thông tin tài khoản.');
    } finally {
      setDangSua(false);
    }
  }, [router]);

  useEffect(() => {
    if (user?.id) {
      router.replace(`/profile/${user.id}/v2`);
      return;
    }

    /* Khách: trạng thái đăng nhập được khôi phục đồng bộ từ localStorage, nhưng
     * `isHydrated` KHÔNG lật với người vào lần đầu (chưa có khoá auth-storage),
     * nên chờ nó là chờ mãi. Cho một nhịp rồi đọc thẳng store. */
    const t1 = setTimeout(() => {
      const tt = useAuthStore.getState();
      if (!tt.isAuthenticated) {
        router.replace('/login?next=/profile');
        return;
      }
      // ĐÃ đăng nhập mà vẫn không có id ⇒ chính là cái hố cũ. Tự đi lấy id.
      if (!tt.user?.id) void layIdTuMayChu();
    }, 400);

    // Lưới cuối: dù có nhánh nào chưa lường trước, cũng không quay quá 8 giây.
    const t2 = setTimeout(() => {
      if (!useAuthStore.getState().user?.id) {
        setLoi((cu) => cu ?? 'Không mở được trang cá nhân.');
      }
    }, TRAN_CHO_MS);

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [user?.id, router, layIdTuMayChu]);

  if (loi) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 text-text-muted">
        <div className="flex max-w-md flex-col items-center gap-3 text-center">
          <p className="text-sm text-red-400">{loi}</p>
          <p className="text-xs">
            Nếu bạn vừa đăng nhập bằng Google hoặc GitHub, phiên có thể chưa được
            tạo xong ở máy chủ. Thử lại, hoặc đăng nhập lại một lần nữa.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => void layIdTuMayChu()}
              disabled={dangSua}
              className="rounded-lg bg-neon-violet px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {dangSua ? 'Đang thử…' : 'Thử lại'}
            </button>
            <button
              type="button"
              onClick={() => router.replace('/login?next=/profile')}
              className="rounded-lg border border-white/15 px-4 py-2 text-sm"
            >
              Đăng nhập lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center text-text-muted">
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neon-violet/20 border-t-neon-violet" />
        <span className="text-sm">Đang mở trang cá nhân…</span>
      </div>
    </div>
  );
}
