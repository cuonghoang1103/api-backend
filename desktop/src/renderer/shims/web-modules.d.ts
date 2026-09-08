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
  /* Mã web nhập nó theo CẢ HAI cách — `import api from` và `import { api } from`
     — vì `lib/api.ts` vừa `export { api }` vừa `export default api` (CÙNG một
     object). Khai thiếu bản có tên thì `tsc` của desktop đỏ ở những tệp web
     hoàn toàn hợp lệ, ví dụ `lib/anhTuyetDoi.ts`. */
  export { api };
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

/* ────────────────────────────────────────────────────────────────────────────
 * Bốn trang web dùng lại nguyên: Thuật toán · Mô phỏng · Lộ trình · Ngoại ngữ.
 *
 * Hơn 51.000 dòng tính năng, đổi lấy khối khai báo này. Tất cả đều là component
 * React không nhận props và `export default` — nên khai báo giống hệt nhau, và
 * bề mặt tiếp xúc hẹp đúng như luật ở đầu tệp.
 *
 * ⚠️ Danh sách này phải khớp `TUYEN_WEB` trong `features/web/dinhTuyenWeb.ts`.
 * Thiếu một dòng thì `tsc` báo TS2307 ngay, nên nó không lệch âm thầm được —
 * khác với những khai báo khác trong tệp này, vốn chỉ hỏng lúc CHẠY.
 * ──────────────────────────────────────────────────────────────────────────── */

declare module '@/components/roadmap/RoadmapLanding' {
  import type { ComponentType } from 'react';
  const Trang: ComponentType;
  export default Trang;
}

/* Hai trang không có đường dẫn động nên không nằm trong `TUYEN_WEB`; chúng
   được `TrangWebDon` nạp thẳng. Cùng hình dạng: component không props. */
declare module '@/components/algorithms/AlgorithmVisualizer' {
  import type { ComponentType } from 'react';
  const Trang: ComponentType;
  export default Trang;
}

declare module '@/components/simulation/SimulationStudio' {
  import type { ComponentType } from 'react';
  const Trang: ComponentType;
  export default Trang;
}

/* ── MỌI module TRANG của Next, khai gộp (22/08/2026) ─────────
 *
 * Trước đây mỗi trang một khối năm dòng. Tới 35 khối thì nó chỉ còn là tiếng
 * ồn: cả 35 giống hệt nhau, vì mọi tệp `page.tsx` của Next đều có CÙNG một
 * hợp đồng — `export default` một component không nhận prop. Tham số động
 * (`[id]`) đi qua `useParams()` của shim chứ không qua prop, nên chữ ký không
 * đổi theo trang. Nay còn 39 trang nữa phải thêm; 74 khối lặp là không nuôi nổi.
 *
 * ⚠️ CÁI GIÁ, đo thật trước khi đổi — phải biết mà chấp nhận:
 * `tsc` KHÔNG còn bắt được đường dẫn import BỊA. Thử `@/app/khong-co-that-dau/page`
 * → typecheck XANH. Lưới đỡ chuyển sang `vite build`, và nó bắt được thật
 * (rollup không đọc nổi file, build ĐỎ). Cả hai bước đều chạy trong
 * `desktop-release.yml`, nên vẫn có chốt trước khi ra bản cài — chỉ là chốt
 * nằm ở bước sau.
 *
 * ⚠️ Wildcard này CỐ Ý chỉ khớp đuôi `/page`, không phải `@/app/*` trần: chỉ
 * module trang của Next mới có hợp đồng trên. Thứ khác trong `@/app` mà
 * desktop cần dùng thì vẫn phải khai riêng, đúng như trước.
 */
declare module '@/app/*/page' {
  import type { ComponentType } from 'react';
  const Trang: ComponentType;
  export default Trang;
}

/* Provider react-query của web. `VoWeb` dựng nó cho MỌI cây web dùng lại —
   `/creator` và `/saved` gọi `useQuery`, và thiếu nó thì chúng nổ ngay lúc vẽ
   với "No QueryClient set". Khai riêng vì wildcard trên chỉ phủ module TRANG. */
declare module '@/components/providers/TanStackQueryProvider' {
  import type { ComponentType, ReactNode } from 'react';
  const P: ComponentType<{ children: ReactNode }>;
  export default P;
}

/**
 * Gia sư AI của Học viện — dùng lại thẳng component web.
 *
 * Khai ở đây thay vì thêm `@/*` vào `paths`: một alias bao trùm sẽ mở cửa cho
 * MỌI file của web nhập vào renderer, kể cả những file kéo theo `next/*` mà
 * app không có shim — và lỗi đó chỉ lộ ra lúc chạy, dưới dạng màn hình trắng.
 * Khai từng module là mỗi lần dùng lại đều là một quyết định có cân nhắc.
 */
declare module '@/components/academy/CourseTutor' {
  export function CourseTutor(props: {
    lessonId: number;
    courseCode?: string;
    courseTitle?: string;
    lessonTitle?: string;
    quizContext?: unknown[];
  }): JSX.Element;
}

/** Đề luyện cuối chương — cùng lý do dùng lại như `CourseTutor`. */
declare module '@/components/academy/ChapterQuiz' {
  export function ChapterQuiz(props: {
    sectionId: number;
    sectionTitle?: string;
    count: number;
    lessonId?: number;
  }): JSX.Element;
}
