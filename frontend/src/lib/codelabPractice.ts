/**
 * Code Lab — bộ luyện tập gắn bài học (đợt 1, 14/10/2026).
 *
 * Tệp RIÊNG (không nhét vào `lib/api.ts` / `lib/code-lab-api.ts`) để nhiều nhánh
 * cùng sửa frontend không giẫm nhau. Backend: `GET /api/v1/code-lab/practice/
 * :courseSlug/:lessonSlug` (src/routes/codeLab.routes.ts → getPracticeSet).
 *
 * Quy ước: track luyện tập của khoá = `PRACTICE_TRACK_BY_COURSE` ở backend
 * (`src/services/codeLab.practice.ts`), module slug = slug bài học.
 */
import { api } from './api';

export type DoKho = 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';

export interface BaiLuyen {
  id: number;
  slug: string;
  title: string;
  difficulty: DoKho;
  estimatedMinutes: number | null;
  points: number;
  moduleSlug: string;
  /** Chỉ có khi đã đăng nhập. */
  solved?: boolean;
}

export interface BoLuyenTap {
  courseSlug: string;
  lessonSlug: string;
  /** Khoá thuộc chương trình luyện tập ⇒ thẻ phải hiện kể cả khi bài chưa có bộ. */
  coBoLuyen: boolean;
  trackSlug: string;
  trackName: string | null;
  moduleSlugs: string[];
  scope: 'lesson' | 'chapter' | 'none';
  /** Đã sắp EASY → MEDIUM → HARD → EXPERT (luật của backend). */
  items: BaiLuyen[];
  total: number;
  byDifficulty: Record<DoKho, number>;
  estimatedMinutes: number;
  solvedCount: number | null;
  dangSoan: boolean;
  banNhap: boolean;
  goiY: {
    trackSlug: string;
    trackName: string;
    items: Array<{ slug: string; title: string; difficulty: DoKho }>;
  } | null;
}

/**
 * Khoá có bộ luyện — BẢN SAO của `PRACTICE_TRACK_BY_COURSE` (backend), chỉ dùng
 * khi API chưa trả/lỗi mạng để thẻ vẫn hiện ("giọng video đã nói link ngay dưới
 * bài giảng"). Nguồn sự thật vẫn là backend (`coBoLuyen`).
 */
export const KHOA_CO_BO_LUYEN: ReadonlySet<string> = new Set([
  'web-foundations',
  'front-end-web-development-with-react',
  'fer202',
]);

export async function layBoLuyenTap(courseSlug: string, lessonSlug: string): Promise<BoLuyenTap> {
  const r = await api.get<{ success: boolean; data: BoLuyenTap }>(
    `/code-lab/practice/${encodeURIComponent(courseSlug)}/${encodeURIComponent(lessonSlug)}`,
  );
  return r.data.data;
}

/** Lời giải chính thức (chỉ người đã đăng nhập) — payload đề của khách không còn mang lời giải. */
export async function layLoiGiai(exerciseId: number) {
  const r = await api.get<{
    success: boolean;
    data: {
      id: number;
      slug: string;
      solutionCodeJson: Array<{ name: string; language: string; code: string }> | null;
      solutionExplanationHtml: string | null;
      solutionExplanationHtmlVi: string | null;
    };
  }>(`/code-lab/exercises/${exerciseId}/solution`);
  return r.data.data;
}

/** Tham số "đường về bài học" mà `CourseBackLink` của Code Lab hiểu (`?ref=` nội bộ + `reflabel`). */
export function thamSoVe(duongVe: string, nhan: string): string {
  const q = new URLSearchParams();
  q.set('ref', duongVe);
  if (nhan) q.set('reflabel', nhan.slice(0, 120));
  return q.toString();
}

/**
 * Trang track lọc theo bộ của bài: `/code-lab/<track>?bai=<lessonSlug>&khoa=<courseSlug>&ref=…`.
 * `khoa` để trang track (nếu cần) gọi lại đúng endpoint /practice và nhận cùng thứ tự/phạm vi
 * (bài slide N.0 gộp cả chương — `bai` khi đó không trùng module nào).
 */
export function duongBoLuyen(bo: Pick<BoLuyenTap, 'trackSlug' | 'lessonSlug' | 'courseSlug'>, duongVe: string, nhan: string): string {
  const q = new URLSearchParams(thamSoVe(duongVe, nhan));
  q.set('bai', bo.lessonSlug);
  q.set('khoa', bo.courseSlug);
  return `/code-lab/${encodeURIComponent(bo.trackSlug)}?${q.toString()}`;
}

/** Thẳng vào một bài trong bộ, giữ `bai`/`khoa`/`ref` để Prev/Next + nút quay lại hoạt động. */
export function duongBaiTrongBo(
  bo: Pick<BoLuyenTap, 'trackSlug' | 'lessonSlug' | 'courseSlug'>,
  exerciseSlug: string,
  duongVe: string,
  nhan: string,
): string {
  const q = new URLSearchParams(thamSoVe(duongVe, nhan));
  q.set('bai', bo.lessonSlug);
  q.set('khoa', bo.courseSlug);
  return `/code-lab/${encodeURIComponent(bo.trackSlug)}/${encodeURIComponent(exerciseSlug)}?${q.toString()}`;
}
