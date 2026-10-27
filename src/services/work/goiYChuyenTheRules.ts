/**
 * CT Work 27/10/2026 — CuongMini "hỏi nhanh": gợi ý chuyển trạng thái thẻ. Phần THUẦN (test: goiYChuyenThe.test.ts).
 *
 * Lý do (chủ app): thành viên làm xong — nhất là thẻ cơ bản (cài môi trường, đọc tài liệu đã làm trên lớp) — nhưng không
 * kéo thẻ ⇒ bảng sai tiến độ. CuongMini hỏi "xong chưa? chuyển sang …?"; người bấm Có thì mới chuyển (đúng quyền người đó).
 */

export type NudgeKind = 'CODE_MERGED' | 'CODE_PUSHED' | 'CHECKLIST_DONE' | 'SUBTASKS_DONE' | 'BASIC_STALE';

export interface StatusLite { id: number; name: string; category: string }

/** Tên cột review (giống REVIEW_NAME của issueView). */
const REVIEW_NAME = /review|qa\b|verify|kiểm|duyệt|test/i;

/** Thẻ "cơ bản" (cài đặt / setup / đọc / tìm hiểu…) — hỏi được khi nằm im lâu. */
const BASIC_WORDS = /\b(setup|set up|install|installation|config(ure)?|environment|env|onboard(ing)?|read|reading|research|learn|study|clone|prepare|account|sign ?up)\b|cài|cài đặt|môi trường|cấu hình|đọc|tìm hiểu|làm quen|chuẩn bị|đăng ký|tạo tài khoản|nghiên cứu|học\b/i;

export function isBasicIssue(title: string, labels: string[] = []): boolean {
  return BASIC_WORDS.test(title) || labels.some((l) => /setup|basic|cơ bản|onboard|cài|install|read|đọc/i.test(l));
}

/** Số ngày thẻ cơ bản nằm im trước khi hỏi. */
export const BASIC_STALE_DAYS = 2;
/** Hỏi lại tối đa mỗi 3 ngày; một lần hiện kéo dài 24 giờ (ở mọi nơi: Việc của tôi, Board, CLI). */
export const NUDGE_WINDOW_MS = 3 * 86_400_000;
export const NUDGE_VISIBLE_MS = 86_400_000;

/**
 * Gợi ý của thẻ này có được HIỆN bây giờ không, và có phải "mở cửa sổ hỏi mới" (ghi lastShownAt) không.
 *   - "Chưa" ⇒ ẩn tới snoozedUntil.
 *   - Đã hiện: hiện tiếp trong 24 giờ, rồi ẩn cho tới đủ 3 ngày kể từ lần hiện ⇒ hỏi lại (mở cửa sổ mới).
 */
export function nudgeVisible(row: { lastShownAt: Date | null; snoozedUntil: Date | null } | null, now: Date): { show: boolean; openWindow: boolean } {
  if (!row) return { show: true, openWindow: true };
  if (row.snoozedUntil && row.snoozedUntil > now) return { show: false, openWindow: false };
  if (!row.lastShownAt) return { show: true, openWindow: true };
  const age = now.getTime() - row.lastShownAt.getTime();
  if (age < NUDGE_VISIBLE_MS) return { show: true, openWindow: false };
  if (age >= NUDGE_WINDOW_MS) return { show: true, openWindow: true };
  return { show: false, openWindow: false };
}

/**
 * Trạng thái đích theo workflow THẬT của thẻ:
 *   - code (PR merge / commit lên nhánh mặc định): cấu hình "PR merged ⇒ trạng thái" của dự án nếu có; không thì cột
 *     Review; không có Review ⇒ Done. Thẻ ĐANG ở Review ⇒ không gợi ý (người review quyết định).
 *   - checklist / thẻ con xong / thẻ cơ bản: Done.
 * Đích phải chuyển tới được từ trạng thái hiện tại (luật transition của workflow); không được ⇒ thử trạng thái cùng loại
 * chuyển được; vẫn không ⇒ null (không gợi ý). Trạng thái hiện tại đã DONE ⇒ null.
 */
export function chonDich(input: {
  statuses: StatusLite[]; current: StatusLite; allowed: StatusLite[]; kind: NudgeKind;
  reviewStatusId?: number | null; prMergedStatusId?: number | null;
}): StatusLite | null {
  const { statuses, current, allowed, kind } = input;
  if (current.category === 'DONE') return null;
  const done = statuses.find((s) => s.category === 'DONE') ?? null;
  const review = (input.reviewStatusId ? statuses.find((s) => s.id === input.reviewStatusId) : undefined)
    ?? statuses.find((s) => s.category === 'IN_PROGRESS' && REVIEW_NAME.test(s.name)) ?? null;
  // Thẻ đã ở cột Review ⇒ việc tiếp theo là của người review (trưởng nhóm/mentor), không hỏi người làm.
  if (review && current.id === review.id) return null;
  let want: StatusLite | null;
  if (kind === 'CODE_MERGED' || kind === 'CODE_PUSHED') {
    const cfg = input.prMergedStatusId ? statuses.find((s) => s.id === input.prMergedStatusId) ?? null : null;
    if (cfg && cfg.id !== current.id && kind === 'CODE_MERGED') want = cfg;
    else want = review ?? done;
  } else {
    want = done;
  }
  if (!want || want.id === current.id) return null;
  if (allowed.some((s) => s.id === want!.id)) return want;
  return allowed.find((s) => s.category === want!.category && s.id !== current.id) ?? null;
}
