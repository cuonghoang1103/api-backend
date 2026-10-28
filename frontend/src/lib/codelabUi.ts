/**
 * Code Lab — phụ trợ GIAO DIỆN dùng chung cho trang track / làm bài / tìm kiếm
 * (đợt 1, 14/10/2026). Cố ý tách khỏi `lib/code-lab-api.ts` và `lib/api.ts`
 * (nhiều nhánh cùng sửa frontend — tránh giẫm nhau khi gộp).
 *
 * Phần đầu là hàm thuần + hằng hiển thị (test chạy bằng `npx tsx --test`, xem
 * components/code-lab/problemParse.test.ts). Hai hàm gọi mạng ở cuối nạp
 * `./api` LƯỜI (dynamic import) để test thuần không kéo axios/store theo.
 *
 * ⚠️ `layBoLuyenTapUi` / `layLoiGiaiUi` TƯƠNG ĐƯƠNG `layBoLuyenTap` / `layLoiGiai`
 * của `lib/codelabPractice.ts` (nhánh codelab-be) — khi gộp hai nhánh thì giữ MỘT bản.
 */
import type { CodeDifficulty } from '@/types/code-lab';

/** Chip độ khó tiếng Việt: Dễ xanh · Vừa vàng · Khó đỏ (· Chuyên gia tím). */
export const DIFF_UI: Record<CodeDifficulty, { label: string; color: string; bg: string; border: string; rank: number }> = {
  EASY: { label: 'Dễ', color: '#15803d', bg: '#dcfce7', border: '#86efac', rank: 0 },
  MEDIUM: { label: 'Vừa', color: '#a16207', bg: '#fef9c3', border: '#fde047', rank: 1 },
  HARD: { label: 'Khó', color: '#b91c1c', bg: '#fee2e2', border: '#fca5a5', rank: 2 },
  EXPERT: { label: 'Chuyên gia', color: '#6d28d9', bg: '#ede9fe', border: '#c4b5fd', rank: 3 },
};

export const DIFF_ORDER: CodeDifficulty[] = ['EASY', 'MEDIUM', 'HARD', 'EXPERT'];

/** Sắp Dễ → Vừa → Khó → Chuyên gia; cùng mức thì theo `sortOrder` rồi thứ tự gốc (ổn định). */
export function sortEasyToHard<T extends { difficulty: CodeDifficulty; sortOrder?: number | null }>(list: readonly T[]): T[] {
  return list
    .map((x, i) => ({ x, i }))
    .sort((a, b) =>
      (DIFF_UI[a.x.difficulty]?.rank ?? 9) - (DIFF_UI[b.x.difficulty]?.rank ?? 9)
      || (a.x.sortOrder ?? 0) - (b.x.sortOrder ?? 0)
      || a.i - b.i)
    .map((p) => p.x);
}

/**
 * Tham số được MANG THEO giữa trang track ↔ trang làm bài:
 * `ref`/`reflabel` (nút "Quay lại" về bài học), `bai` + `khoa` (bộ luyện của một
 * bài học: slug bài + slug khoá, để gọi lại `GET /code-lab/practice/:khoa/:bai`).
 * Trả chuỗi bắt đầu bằng `?`, hoặc '' nếu không có gì.
 */
export function carryQS(sp: { get(name: string): string | null }): string {
  const qs = new URLSearchParams();
  for (const k of ['ref', 'reflabel', 'bai', 'khoa']) {
    const v = sp.get(k);
    if (v) qs.set(k, v);
  }
  const s = qs.toString();
  return s ? `?${s}` : '';
}

/** Bộ lọc trạng thái trên trang track. */
export type StatusFilter = 'all' | 'done' | 'todo';
export type DiffFilter = 'all' | CodeDifficulty;

/** Cờ lời giải mà backend đợt 1 gắn vào payload đề (khách: không có trường lời giải). */
export interface SolutionFlags {
  hasSolution?: boolean;
  solutionLocked?: boolean;
  /** Đề "lời giải mở sau khi đạt" (testsJson.loiGiaiSauKhiDat): chưa có lượt Nộp đạt 100% ⇒ 'accepted'. */
  solutionGate?: 'accepted';
  /** Starter = lời giải bước trước, đang khoá tới khi đạt module này (testsJson.khoiDauSauKhiDat). */
  starterGate?: { moduleSlug: string };
}

// ─── Gọi mạng (nạp `./api` lười) ───────────────────────────────────────

export interface BaiLuyenUi {
  id: number;
  slug: string;
  title: string;
  difficulty: CodeDifficulty;
  estimatedMinutes: number | null;
  points: number;
  moduleSlug: string;
  /** Chỉ có khi đã đăng nhập. */
  solved?: boolean;
}

/** Hình dạng của `GET /code-lab/practice/:courseSlug/:lessonSlug` (src/services/codeLab.practice.ts). */
export interface BoLuyenTapUi {
  courseSlug: string;
  lessonSlug: string;
  coBoLuyen: boolean;
  trackSlug: string;
  trackName: string | null;
  moduleSlugs: string[];
  /** `chapter`: bài slide N.0 — gộp cả chương, `bai` không trùng module nào. */
  scope: 'lesson' | 'chapter' | 'none';
  /** Đã sắp EASY → MEDIUM → HARD → EXPERT (luật của backend). */
  items: BaiLuyenUi[];
  total: number;
  byDifficulty: Record<CodeDifficulty, number>;
  estimatedMinutes: number;
  solvedCount: number | null;
  dangSoan: boolean;
  banNhap?: boolean;
  goiY: {
    trackSlug: string;
    trackName: string;
    /** Module của bài gợi ý đầu (backend 14/10/2026 trở đi; bản cũ không có). */
    moduleSlug?: string | null;
    moduleName?: string | null;
    items: Array<{ slug: string; title: string; difficulty: CodeDifficulty; moduleSlug?: string }>;
  } | null;
}

export async function layBoLuyenTapUi(courseSlug: string, lessonSlug: string): Promise<BoLuyenTapUi> {
  const { api } = await import('./api');
  const r = await api.get<{ success: boolean; data: BoLuyenTapUi }>(
    `/code-lab/practice/${encodeURIComponent(courseSlug)}/${encodeURIComponent(lessonSlug)}`,
  );
  return r.data.data;
}

export interface LoiGiaiUi {
  id: number;
  slug: string;
  solutionCodeJson: Array<{ name: string; language: string; code: string }> | null;
  solutionExplanationHtml: string | null;
  solutionExplanationHtmlVi: string | null;
}

/** Lời giải chính thức — BẮT BUỘC đăng nhập (`GET /code-lab/exercises/:id/solution`). */
export async function layLoiGiaiUi(exerciseId: number): Promise<LoiGiaiUi> {
  const { api } = await import('./api');
  const r = await api.get<{ success: boolean; data: LoiGiaiUi }>(`/code-lab/exercises/${exerciseId}/solution`);
  return r.data.data;
}

/** Đường tới trang đăng nhập, đăng nhập xong quay lại đúng trang đang xem (`/login?redirect=`). */
export function duongDangNhap(hienTai: string): string {
  return `/login?redirect=${encodeURIComponent(hienTai)}`;
}
