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

/* ────────────────────────────────────────────────────────────────────────────
 * Kho Mẫu AI (`/ai-templates`).
 *
 * Dữ liệu và logic dùng CHUNG với web, không chép sang đây. Mười tệp JSON là
 * 780 KB cho 1.877 mẫu — nhỏ hơn một ảnh bìa, và đổi lại trang tra cứu được
 * khi mất mạng, đúng thứ app desktop phải hơn một tab trình duyệt.
 *
 * ⚠️ Khai `unknown[]` cho JSON là CÓ CHỦ ĐÍCH, đừng "sửa" thành kiểu thật.
 * Với `resolveJsonModule`, TypeScript suy ra kiểu chữ cho TỪNG phần tử — 871
 * object literal chỉ riêng skills.json — và `tsc` chậm đi thấy rõ để đổi lấy
 * một kiểu không ai dùng tới. Trang tự ép về `BanGhiMau` ngay chỗ nhận.
 * ──────────────────────────────────────────────────────────────────────────── */

declare module '@/data/ai-templates/skills.json' { const v: unknown[]; export default v; }
declare module '@/data/ai-templates/agents.json' { const v: unknown[]; export default v; }
declare module '@/data/ai-templates/commands.json' { const v: unknown[]; export default v; }
declare module '@/data/ai-templates/mcps.json' { const v: unknown[]; export default v; }
declare module '@/data/ai-templates/settings.json' { const v: unknown[]; export default v; }
declare module '@/data/ai-templates/hooks.json' { const v: unknown[]; export default v; }
declare module '@/data/ai-templates/loops.json' { const v: unknown[]; export default v; }
declare module '@/data/ai-templates/sandbox.json' { const v: unknown[]; export default v; }
declare module '@/data/ai-templates/templates.json' { const v: unknown[]; export default v; }
declare module '@/data/ai-templates/plugins.json' { const v: unknown[]; export default v; }

declare module '@/lib/ai-templates/catalog' {
  /** Mô tả một trong 10 loại mẫu. Chỉ khai phần app desktop đụng tới. */
  export interface TypeMeta {
    slug: string;
    type: string;
    label: string;
    tagline: string;
    blurb: string;
    /** Cờ CLI (`--skill`…). Rỗng = loại này không cài bằng CLI. */
    flag: string;
    color: string;
    dir: string;
    contentMode: 'file' | 'folder' | 'none';
  }
  export const TYPES: readonly TypeMeta[];
  export const SOURCE_REPO: string;
  /** `security/auditor.md` → `security/auditor` (bỏ đuôi tệp). */
  export function toRef(path: string): string;
  /** `ai-ethics-advisor` → `AI Ethics Advisor` (giữ hoa cho từ viết tắt). */
  export function prettyName(raw: string): string;
  /** Đường tệp trong repo gốc, hoặc `null` nếu loại này không có tệp. */
  export function sourceFilePath(meta: TypeMeta, path: string): string | null;
}

declare module '@/lib/ai-templates/labels' {
  /** Nhãn tiếng Việt cho slug danh mục; chưa dịch thì trả dạng đọc được. */
  export function categoryLabel(slug: string): string;
}

declare module '@/lib/ai-templates/install' {
  export interface InstallRecipe {
    /** `shell` chạy trong terminal; `claude` gõ trong chính phiên Claude Code. */
    kind: 'shell' | 'claude';
    lines: string[];
    hint: string;
  }
  /**
   * Dựng lệnh cài. Tham số khai lỏng đúng phần hàm thật đọc tới — buộc nó vào
   * `ComponentRecord` đầy đủ chỉ làm ranh giới này rộng ra mà không thêm gì.
   */
  export function installRecipe(item: {
    type: string;
    path: string;
    repo: string;
    installCommand?: string;
  }): InstallRecipe;
}
