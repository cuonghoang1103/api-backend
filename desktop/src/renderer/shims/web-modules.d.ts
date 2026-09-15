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

declare module '@/lib/socket' {
  /**
   * Cửa để app desktop cắm socket CỦA NÓ vào cây messenger dùng lại từ web.
   *
   * Chỉ khai `datNguonSocket` vì đó là thứ duy nhất desktop gọi. Kiểu socket
   * để lỏng (`unknown`) có chủ đích: buộc nó vào `Socket` của socket.io-client
   * sẽ kéo cả cây kiểu ấy qua ranh giới này, và ranh giới càng rộng càng dễ
   * lệch — xem chú thích ở `@/lib/api` ngay dưới.
   */
  export function datNguonSocket(
    f: (() => unknown | Promise<unknown> | null) | null,
  ): void;
}

/**
 * Những mảnh của cây messenger mà PHÉP KIỂM gắn thẳng.
 *
 * ⚠️ Khai báo môi trường chứ KHÔNG ánh xạ đường dẫn tới `../frontend`. Ánh xạ
 * sẽ kéo cả cây web thật vào chương trình TypeScript của desktop, và ở đó nó
 * đụng ngay với những khai báo rút gọn có chủ đích ở tệp này (`@/lib/api` khai
 * đúng phần desktop cần, không khai cả 4.994 dòng). Đã thử 16/09/2026: hơn
 * chục lỗi "không có thành viên xuất" cho những thứ desktop không bao giờ gọi.
 */
declare module '@/components/messaging/MessageInput' {
  import type { ComponentType } from 'react';
  const C: ComponentType<{ disabled?: boolean }>;
  export default C;
}
declare module '@/components/messaging/ThreadList' {
  import type { ComponentType } from 'react';
  const C: ComponentType<Record<string, never>>;
  export default C;
}
declare module '@/components/messaging/MessageList' {
  import type { ComponentType } from 'react';
  const C: ComponentType<Record<string, never>>;
  export default C;
}
declare module '@/components/messaging/ChatInfoPanel' {
  import type { ComponentType } from 'react';
  const C: ComponentType<{ thread: unknown; onClose?: () => void }>;
  export default C;
}
declare module '@/components/messaging/CuocGoiOverlay' {
  import type { ComponentType } from 'react';
  const C: ComponentType<{
    threadId?: number; peerId?: number; peerName?: string;
    peerAvatar?: string | null; goiDi: number; goiVideo?: number;
  }>;
  export default C;
}
declare module '@/components/messaging/useGhiAm' {
  export const GIAY_TOI_DA: number;
  export function kieuGhiDuoc(hoTro?: (t: string) => boolean): string;
  export function duoiTheoKieu(mime: string): string;
  export function dongHo(giay: number): string;
}
declare module '@/store/messagingStore' {
  /** Chỉ `setState` — phép kiểm đặt sẵn hội thoại đang mở rồi dựng component. */
  export const useMessagingStore: { setState(s: unknown): void };
}

declare module '@/app/messages/page' {
  import type { ComponentType } from 'react';
  /** Trang tin nhắn của web, dùng lại nguyên si — xem features/messages. */
  const Page: ComponentType;
  export default Page;
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
    /** HTML của bài — để gia sư đọc ra danh sách slide và hiện mục "Hỏi theo slide". */
    noiDungHtml?: string;
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

/**
 * Kho gia sư bài học.
 *
 * Desktop KHÔNG gọi thẳng kho này — `CourseTutor` (đã khai ở trên) tự ghi vào
 * nó. Khai ở đây là để phép kiểm `giaSuBaiStore.test.ts` có kiểu: web không có
 * bộ chạy kiểm nào, nên vitest của desktop là chỗ duy nhất trong kho chạy được
 * một phép kiểm cho mã đó.
 *
 * ⚠️ Như cả file này: khai báo dưới đây KHÔNG được `tsc` đối chiếu với mã thật.
 * Nhưng vitest thì nạp FILE THẬT, nên phép kiểm vẫn chạy trên mã thật — sai
 * lệch giữa khai báo và thực tế sẽ lộ ra ngay ở đó.
 */
declare module '@/store/giaSuBaiStore' {
  export interface LuotGiaSu {
    role: 'user' | 'assistant';
    content: string;
    srcQuestion?: string;
    srcCacheKey?: string;
    english?: boolean;
    streaming?: boolean;
    enDone?: boolean;
    cached?: boolean;
    anh?: string[];
  }
  export interface BaiDangHoc {
    lessonId: number;
    courseCode?: string;
    courseTitle?: string;
    lessonTitle?: string;
    duongDan?: string;
  }
  export function khoaGiaSu(lessonId: number, trongDe?: boolean): string;
  interface GiaSuBaiState {
    bai: BaiDangHoc | null;
    datBai: (b: BaiDangHoc | null) => void;
    cuoc: Record<string, LuotGiaSu[]>;
    datCuoc: (khoa: string, f: (cu: LuotGiaSu[]) => LuotGiaSu[]) => void;
    xoaCuoc: (khoa: string) => void;
  }
  export const useGiaSuBaiStore: {
    (): GiaSuBaiState;
    <T>(sel: (s: GiaSuBaiState) => T): T;
    getState(): GiaSuBaiState;
    setState(s: Partial<GiaSuBaiState>): void;
  };
}

/**
 * Đọc danh sách slide từ nội dung bài.
 *
 * Desktop không gọi thẳng — `CourseTutor` (đã khai ở trên) tự dùng. Khai ở đây
 * để phép kiểm `docSlide.test.ts` có kiểu; vitest vẫn nạp FILE THẬT nên phép
 * kiểm chạy trên mã thật, sai lệch giữa khai báo và thực tế lộ ra ngay ở đó.
 */
declare module '@/components/academy/docSlide' {
  export interface Slide { so: number; tong: number; bo: string; ten: string }
  export function docSlide(html: string | null | undefined): Slide[];
  export function cauHoiSlide(s: Slide): string;
  export function khoaCacheSlide(s: Slide): string;
}

/**
 * Trình chơi đề của bài dạng QUIZ, và trình đọc PDF nhúng — cả hai của web.
 *
 * App dùng lại thẳng (xem `monHoc.tsx`): không cái nào import `next/*`, và
 * Tailwind của app quét cả cây nguồn web nên lớp riêng của web vẫn có CSS.
 */
declare module '@/app/courses/[slug]/learn/LessonQuizPlayer' {
  import type { ComponentType } from 'react';
  export interface QuizQuestion {
    id: string;
    type?: 'MC' | 'ESSAY';
    question: string;
    code?: string;
    codeLang?: string;
    options: string[];
    correctIndex?: number;
    correctIndexes?: number[];
    sampleAnswer?: string;
    explanation?: string;
    points: number;
  }
  export interface QuizData { timeLimitSeconds: number; questions: QuizQuestion[] }
  const LessonQuizPlayer: ComponentType<{
    quiz: QuizData;
    onSubmitted?: () => void;
    locale?: 'en' | 'vi';
  }>;
  export default LessonQuizPlayer;
}

declare module '@/app/courses/[slug]/learn/LessonPdfViewer' {
  import type { ComponentType } from 'react';
  const LessonPdfViewer: ComponentType<{ url: string; title?: string }>;
  export default LessonPdfViewer;
}

/**
 * Lộ trình khoá học — dùng lại của web.
 *
 * `locale` là tham số thêm cho app: app KHÔNG bọc `LocaleProvider` (ngữ cảnh
 * của Next) nên hook bên trong rơi về `'en'`, và lộ trình sẽ hiện tiêu đề
 * tiếng Anh giữa màn hình tiếng Việt. Truyền thẳng ngôn ngữ của app vào.
 */
declare module '@/components/academy/CourseRoadmap' {
  import type { ComponentType } from 'react';
  export const CourseRoadmapPanel: ComponentType<{
    sections: unknown[];
    isCompleted: (lessonId: number) => boolean;
    currentLessonId?: number;
    overallProgress: number;
    courseId: number;
    courseCode?: string;
    onJump: (lesson: { id: number }) => void;
    locale?: 'vi' | 'en';
    defaultOpen?: boolean;
  }>;
}

/**
 * Chọn ngành + lọc theo ngành hẹp — dùng lại của web.
 *
 * `useAcademyProfile` nhớ câu trả lời ở localStorage VÀ đồng bộ lên máy chủ,
 * nên chọn ngành trên web thì app cũng biết, và ngược lại.
 */
declare module '@/components/academy/AcademyOnboarding' {
  import type { ComponentType } from 'react';
  const AcademyOnboarding: ComponentType<{
    open: boolean;
    onClose: () => void;
    startAtMajor?: boolean;
  }>;
  export default AcademyOnboarding;
}

declare module '@/hooks/useAcademyProfile' {
  export interface AcademyProfile {
    isStudent?: boolean | null;
    faculty?: string | null;
    major?: string | null;
    combo?: string | null;
    chosenAt?: string | null;
  }
  export function useAcademyProfile(): {
    profile: AcademyProfile;
    needsOnboarding: boolean;
    save: (p: Partial<AcademyProfile>) => void;
    reset: () => void;
  };
}

declare module '@/data/academyCatalog' {
  export function getFaculty(id?: string | null): { id: string; name: string } | undefined;
  export function getCatMajor(faculty?: string | null, major?: string | null): { id: string; name: string } | undefined;
  export function getCatCombo(faculty?: string | null, major?: string | null, combo?: string | null): { id: string; name: string } | undefined;
  export function leafSemesterPlan(faculty?: string | null, major?: string | null, combo?: string | null): Array<{ codes: string[] }>;
}

declare module '@/components/academy/locTheoNganh' {
  export interface HoSoNganh {
    isStudent?: boolean | null;
    faculty?: string | null;
    major?: string | null;
    combo?: string | null;
  }
  export interface MonHien { course: { id: number }; isOld: boolean; isProject: boolean }
  export function daChonNganhHep(ho: HoSoNganh, coMajor: boolean, coCombo: boolean): boolean;
  export function maCuaKhung(ho: HoSoNganh, coLoc: boolean): Set<string> | null;
  export function locMonMotKy<T extends { id: number; courseCode?: string | null; title?: string | null }>(
    ds: T[], khung: Set<string> | null, ho: HoSoNganh,
  ): Array<{ course: T; isOld: boolean; isProject: boolean }>;
  export function tenChuan(t?: string | null): string;
}
