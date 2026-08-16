/**
 * Ranh giới kiểu giữa app desktop và cây nguồn của web.
 *
 * ─── Vấn đề ───
 * App desktop bật một bộ cờ TypeScript nghiêm ngặt hơn hẳn frontend:
 * `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`, `noUnusedLocals`,
 * `verbatimModuleSyntax`. Mã web chưa bao giờ được viết dưới những cờ đó, nên
 * khi desktop import vào, `tsc` đi theo và báo hàng chục lỗi — mà KHÔNG lỗi nào
 * là lỗi thật: mã đó đang chạy tốt trên production và tự kiểm sạch bằng
 * `tsconfig` riêng của nó.
 *
 * ─── Hai cách sai ───
 *  1. Sửa mã web cho hết lỗi: sửa 1.260 dòng của người khác để chiều cấu hình
 *     của mình, và mỗi lần web đổi lại phải sửa tiếp.
 *  2. Hạ cờ của desktop: vứt bỏ những phép kiểm đã bắt được lỗi thật trong
 *     chính mã desktop (`exactOptionalPropertyTypes` đã bắt hai lần).
 *
 * ─── Cách ở đây ───
 * Khai báo TƯỜNG MINH đúng phần bề mặt mà desktop dùng tới. TypeScript thấy
 * khai báo ambient thì dừng, không đi vào file thật; Vite vẫn gộp file thật
 * lúc dựng. Hai bên giữ bộ cờ riêng, và điểm tiếp xúc giữa chúng được viết ra
 * thành văn bản thay vì ngầm định.
 *
 * ⚠️ Khai báo ở đây KHÔNG được `tsc` đối chiếu với mã thật. Nếu web đổi hình
 * dạng những thứ này, lỗi sẽ hiện ra lúc CHẠY chứ không lúc dịch. Vì vậy chỉ
 * khai báo phần tối thiểu, và giữ nó thật nhỏ.
 */

declare module '@/app/notes/page' {
  import type { ComponentType } from 'react';
  /** Trang Notes đầy đủ của web — tự quản lý sidebar, soạn thảo, panel phụ. */
  const NotesPage: ComponentType;
  export default NotesPage;
}

declare module '@/store/authStore' {
  /**
   * Chỉ khai báo `setAuth` vì đó là thứ duy nhất desktop gọi tới: nạp phiên
   * đăng nhập của app vào store mà cây Notes đọc.
   */
  interface AuthStoreApi {
    getState(): {
      setAuth(auth: Record<string, unknown>): void;
    };
  }
  export const useAuthStore: AuthStoreApi;
}

declare module '@/lib/api' {
  /**
   * Instance axios của web. Desktop chỉ đụng vào `defaults` và `interceptors`
   * để trỏ nó về máy chủ thật và gắn Bearer — xem shims/web-api-adapter.ts.
   *
   * Kiểu để lỏng có chủ đích: buộc nó vào kiểu axios đầy đủ sẽ kéo cả cây kiểu
   * của axios qua ranh giới này, và ranh giới càng rộng thì càng dễ lệch.
   */
  const api: {
    defaults: {
      baseURL?: string;
      withCredentials?: boolean;
    };
    interceptors: {
      request: {
        use(
          onFulfilled: (config: {
            headers: Record<string, unknown>;
          }) => unknown,
        ): number;
      };
    };
  };
  export default api;
}
