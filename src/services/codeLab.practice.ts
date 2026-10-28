/**
 * ============================================================
 * Code Lab — bộ luyện tập gắn bài học (đợt 1, 14/10/2026)
 * ============================================================
 *
 * Phần THUẦN (không đụng CSDL) của nút "🏋️ Luyện tập trên Code Lab" dưới video
 * bài giảng — tách riêng để test được mà không cần Postgres
 * (`codeLab.practice.test.ts`). Phần đọc CSDL nằm ở `getPracticeSet` trong
 * `codeLab.service.ts`.
 *
 * Quy ước (KE-HOACH-CODELAB.md §0b-2, không migration):
 *   - mỗi khoá có MỘT track luyện tập: `PRACTICE_TRACK_BY_COURSE[courseSlug]`,
 *     không khai thì theo quy ước `<courseSlug>-practice`;
 *   - module slug = slug bài học (vd `wf-3-3-flexbox`); `@@unique([trackId, slug])`
 *     nên (track, lessonSlug) là duy nhất sẵn;
 *   - bài slide "N.0" (`wf-3-0-slides`) chưa có module riêng ⇒ gộp mọi module cùng
 *     chương (tiền tố `wf-3-`);
 *   - thứ tự "từ dễ đến khó" là LUẬT của endpoint (EASY→MEDIUM→HARD→EXPERT, rồi
 *     thứ tự module, rồi sortOrder) — không phụ thuộc người soạn nhớ đặt sortOrder.
 */

/** Khoá học → track luyện tập. Thêm khoá mới = thêm một dòng. */
export const PRACTICE_TRACK_BY_COURSE: Readonly<Record<string, string>> = Object.freeze({
  'web-foundations': 'web-foundations-practice',
  // FER202 học ở /courses/front-end-web-development-with-react/learn (Academy dùng chung LearnPageClient).
  'front-end-web-development-with-react': 'fer202-practice',
  fer202: 'fer202-practice',
  // Academy ôn thi kỳ này (28/10/2026) — track tạo khi bộ đề đầu tiên lên; trước đó thẻ dưới video ghi "đang soạn".
  'software-testing': 'swt301-practice',
  'software-requirements': 'swr302-practice',
  // Kỹ năng nghề (28/10/2026): thuyết trình + báo cáo kỹ thuật, gắn SSG105 Ch3/Ch4 (content/codelab/ky-nang-practice).
  'ssg105-communication-and-in-group-working-skills': 'ky-nang-practice',
});

/**
 * Danh mục LỐI VÀO trang chủ Code Lab (đợt Academy 28/10/2026): "Môn học (Academy)" và
 * "Khoá học (Courses)". Track không có ở đây ⇒ "Kho mở rộng" (kho đề AI cũ — không chắn lộ trình).
 * Thứ tự = thứ tự hiện (FER202 → SWT301 → SWR302 → PRO192 + DBI202 → CSD201 → PRJ301 → OSG202 — KE-HOACH-CODELAB §8).
 * Track chưa tạo ⇒ thẻ "Đang soạn" (người học thấy lộ trình sắp tới, không bấm được).
 */
export interface MucDanhMuc {
  loai: 'academy' | 'course';
  /** Mã môn trường (FER202…) — chỉ Academy. */
  ma?: string;
  ten: string;
  courseSlug: string;
  trackSlug: string;
}
export const PRACTICE_CATALOG: readonly MucDanhMuc[] = Object.freeze([
  { loai: 'academy', ma: 'FER202', ten: 'Front-End Web Development with React', courseSlug: 'front-end-web-development-with-react', trackSlug: 'fer202-practice' },
  { loai: 'academy', ma: 'SWT301', ten: 'Software Testing', courseSlug: 'software-testing', trackSlug: 'swt301-practice' },
  { loai: 'academy', ma: 'SWR302', ten: 'Software Requirements', courseSlug: 'software-requirements', trackSlug: 'swr302-practice' },
  { loai: 'academy', ma: 'SSG105', ten: 'Kỹ năng nghề: Thuyết trình & Báo cáo kỹ thuật', courseSlug: 'ssg105-communication-and-in-group-working-skills', trackSlug: 'ky-nang-practice' },
  { loai: 'academy', ma: 'PRO192', ten: 'Object-Oriented Programming (Java)', courseSlug: 'object-oriented-programming', trackSlug: 'pro192-practice' },
  { loai: 'academy', ma: 'DBI202', ten: 'Database Systems', courseSlug: 'introduction-to-databases', trackSlug: 'dbi202-practice' },
  { loai: 'academy', ma: 'LAB211', ten: 'OOP with Java Lab', courseSlug: 'oop-with-java-lab', trackSlug: 'lab211' },
  { loai: 'academy', ma: 'CSD201', ten: 'Data Structures and Algorithms', courseSlug: 'data-structures-and-algorithms', trackSlug: 'csd201-practice' },
  { loai: 'academy', ma: 'PRJ301', ten: 'Java Web Application Development', courseSlug: 'java-web-application-development', trackSlug: 'prj301-practice' },
  { loai: 'academy', ma: 'OSG202', ten: 'Operating Systems', courseSlug: 'operating-systems', trackSlug: 'osg202-practice' },
  { loai: 'course', ten: 'Nền tảng Web', courseSlug: 'web-foundations', trackSlug: 'web-foundations-practice' },
] as MucDanhMuc[]);

/** Track luyện tập của một khoá (bảng trên, không có thì `<courseSlug>-practice`). */
export function practiceTrackSlugFor(courseSlug: string): string {
  return PRACTICE_TRACK_BY_COURSE[courseSlug] ?? `${courseSlug}-practice`;
}

/** Khoá có nằm trong chương trình luyện tập (nút phải hiện kể cả khi bài chưa có bộ)? */
export function isPracticeCourse(courseSlug: string): boolean {
  return Object.prototype.hasOwnProperty.call(PRACTICE_TRACK_BY_COURSE, courseSlug);
}

/** Slug hợp lệ cho tham số URL (khớp slugify của Code Lab + slug bài học trong content/). */
export function isSafeSlug(s: string): boolean {
  return /^[a-z0-9][a-z0-9-]{0,149}$/i.test(s);
}

/**
 * Bài slide mở chương ("wf-3-0-slides") ⇒ tiền tố chương "wf-3-" để gộp bộ của cả
 * chương. Bài khác ⇒ null.
 */
export function chapterPrefixOf(lessonSlug: string): string | null {
  const m = /^(.+?-\d+-)0-slides$/.exec(lessonSlug);
  return m ? m[1] : null;
}

/**
 * Track "gần nhất" để luyện tạm khi bài chưa có bộ riêng — theo bảng §4.1/§4.2 của
 * kế hoạch (Ch1 → git, Ch2/3 → html-css, Ch4/5 → javascript, Ch6/7 → nodejs-express,
 * Ch8 → sql, Ch9 → typescript, Ch10 → git; FER202: ES6 → javascript, Bootstrap →
 * html-css, còn lại → react). Không biết ⇒ null.
 */
export function fallbackTrackFor(courseSlug: string, lessonSlug: string): string | null {
  const wf = /^wf-(\d+)-/.exec(lessonSlug);
  if (courseSlug === 'web-foundations' || wf) {
    const ch = wf ? Number(wf[1]) : NaN;
    if (!Number.isFinite(ch)) return 'html-css';
    if (ch === 1) return 'git';
    if (ch === 0 || ch === 2 || ch === 3) return 'html-css';
    if (ch === 4 || ch === 5) return 'javascript';
    if (ch === 6 || ch === 7) return 'nodejs-express';
    if (ch === 8) return 'sql';
    if (ch === 9) return 'typescript';
    if (ch === 10) return 'git';
    return 'javascript';
  }
  const fer = /^fer202-(\d+)-/.exec(lessonSlug);
  if (fer || courseSlug === 'front-end-web-development-with-react' || courseSlug === 'fer202') {
    const ch = fer ? Number(fer[1]) : NaN;
    if (ch === 0 || ch === 1 || ch === 2) return 'javascript';
    if (ch === 4) return 'html-css';
    return 'react';
  }
  return null;
}

export const DIFFICULTY_RANK: Readonly<Record<string, number>> = Object.freeze({
  EASY: 0,
  MEDIUM: 1,
  HARD: 2,
  EXPERT: 3,
});

export interface PracticeSortable {
  id: number;
  difficulty: string;
  sortOrder: number;
  moduleSortOrder?: number;
}

/** EASY→MEDIUM→HARD→EXPERT, rồi thứ tự module (khi gộp chương), rồi sortOrder, rồi id. Không đổi mảng gốc. */
export function sortPracticeItems<T extends PracticeSortable>(items: readonly T[]): T[] {
  const rank = (d: string) => DIFFICULTY_RANK[d] ?? 99;
  return [...items].sort(
    (a, b) =>
      rank(a.difficulty) - rank(b.difficulty) ||
      (a.moduleSortOrder ?? 0) - (b.moduleSortOrder ?? 0) ||
      a.sortOrder - b.sortOrder ||
      a.id - b.id,
  );
}

export function countByDifficulty(items: readonly { difficulty: string }[]) {
  const out = { EASY: 0, MEDIUM: 0, HARD: 0, EXPERT: 0 } as Record<'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT', number>;
  for (const it of items) {
    if (it.difficulty in out) out[it.difficulty as keyof typeof out]++;
  }
  return out;
}

/** Ước lượng phút cả bộ; bài không khai phút tính 10 phút. */
export function estimateMinutes(items: readonly { estimatedMinutes?: number | null }[]): number {
  return items.reduce((n, it) => n + (it.estimatedMinutes && it.estimatedMinutes > 0 ? it.estimatedMinutes : 10), 0);
}

// ─── Lời giải: không lộ cho khách chưa đăng nhập ───────────────

/** Các trường "đáp án" — không trả cho khách, không trả trong danh sách. */
export const SOLUTION_FIELDS = [
  'solutionCodeJson',
  'solutionExplanationHtml',
  'solutionExplanationHtmlVi',
  'aiExplanationJson',
] as const;

function nonEmpty(v: unknown): boolean {
  if (v == null) return false;
  if (typeof v === 'string') return v.trim().length > 0;
  if (Array.isArray(v)) return v.length > 0;
  return true;
}

/**
 * Bỏ lời giải khỏi payload một bài. Giữ cờ `hasSolution` để giao diện vẫn biết
 * có lời giải (hiện "Đăng nhập để xem lời giải") và `solutionLocked` = true.
 */
export function withoutSolution<T extends Record<string, unknown>>(
  ex: T,
): Omit<T, (typeof SOLUTION_FIELDS)[number]> & { hasSolution: boolean; solutionLocked: true } {
  const hasSolution = nonEmpty(ex.solutionCodeJson) || nonEmpty(ex.solutionExplanationHtml);
  const out: Record<string, unknown> = { ...ex };
  for (const f of SOLUTION_FIELDS) delete out[f];
  return { ...(out as Omit<T, (typeof SOLUTION_FIELDS)[number]>), hasSolution, solutionLocked: true };
}

/**
 * Người đã đăng nhập: GIỮ NGUYÊN các trường lời giải cũ (bản app desktop đã phát
 * hành gói sẵn trang bài tập của web và đọc thẳng `solutionCodeJson`/
 * `solutionExplanationHtml`), thêm cờ. Chỉ bỏ `aiExplanationJson` — không client
 * nào đọc nó từ payload này (đọc qua `GET /exercises/:id/ai/explain`), mà nó nặng
 * ~29KB/bài.
 */
export function withSolutionFlags<T extends Record<string, unknown>>(
  ex: T,
): Omit<T, 'aiExplanationJson'> & { hasSolution: boolean; solutionLocked: false } {
  const hasSolution = nonEmpty(ex.solutionCodeJson) || nonEmpty(ex.solutionExplanationHtml);
  const { aiExplanationJson: _drop, ...rest } = ex;
  void _drop;
  return { ...rest, hasSolution, solutionLocked: false };
}

// ─── Lời giải / starter MỞ SAU KHI ĐẠT (assignment CodeLearn, 28/10/2026) ───────────────
//
// Đề khai trong testsJson (cột JSON sẵn có — KHÔNG migration):
//   loiGiaiSauKhiDat: true            ⇒ lời giải (code + giải thích) chỉ trả cho người đã SOLVED đề này.
//                                       SOLVED chỉ đến từ một lượt Nộp đạt 100% (upsertProgress chặn tự đánh dấu
//                                       với đề có máy chấm).
//   khoiDauSauKhiDat: '<module slug>' ⇒ starter chỉ trả cho người đã SOLVED ít nhất một đề của module đó (cùng
//                                       track) — dự án làm dần: starter của Fk chính là lời giải F(k−1).
// Admin/editor luôn thấy đủ. Đây là khoá TỰ GIÁC cho người học (máy chấm chạy ở trình duyệt nên kết quả Nộp do
// client báo), đủ để lời giải không nằm sẵn trước mắt — không phải cơ chế bảo mật.

export interface ChotLoiGiai {
  sauKhiDat: boolean;
  khoiDauSau: string | null;
}

export function chotLoiGiai(testsJson: unknown): ChotLoiGiai {
  const tj = testsJson && typeof testsJson === 'object' && !Array.isArray(testsJson) ? (testsJson as Record<string, unknown>) : {};
  const k = tj.khoiDauSauKhiDat;
  return { sauKhiDat: tj.loiGiaiSauKhiDat === true, khoiDauSau: typeof k === 'string' && k.trim() ? k.trim() : null };
}

/** Starter thay thế khi người học chưa đạt bước trước (editor mở tệp này, nút ⬇ Starter tải tệp này). */
export function starterBiKhoa(moduleSlug: string) {
  return [{
    name: 'README.md',
    language: 'text',
    code: `# Starter locked\n\nThis starter is the reference solution of the previous step (${moduleSlug}).\n`
      + 'It unlocks after an Accepted submission of that step.\n'
      + 'Keep building on YOUR OWN code from the previous step — paste your files here to run the checks.\n\n'
      + `Starter đang khoá: nó chính là lời giải của bước trước (${moduleSlug}).\n`
      + 'Nộp bước trước đạt 100% (Accepted) thì mở. Cứ làm tiếp trên code của chính bạn — dán tệp vào đây để chạy kiểm.\n',
  }];
}

/**
 * Áp khoá lên payload một đề (đã qua withSolutionFlags / withoutSolution).
 * daDat: người xem đã SOLVED đề này · daDatTruoc: đã SOLVED module `khoiDauSau`.
 */
export function apChotLoiGiai<T extends Record<string, unknown>>(ex: T, chot: ChotLoiGiai, daDat: boolean, daDatTruoc: boolean): Record<string, unknown> {
  let out: Record<string, unknown> = ex;
  if (chot.sauKhiDat && !daDat) out = { ...withoutSolution(out), solutionGate: 'accepted' };
  if (chot.khoiDauSau && !daDatTruoc) out = { ...out, starterCodeJson: starterBiKhoa(chot.khoiDauSau), starterGate: { moduleSlug: chot.khoiDauSau } };
  return out;
}
