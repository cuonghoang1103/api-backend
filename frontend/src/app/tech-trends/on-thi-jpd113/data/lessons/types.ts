/**
 * Bài giảng gắn vào từng việc của lộ trình 5 ngày.
 *
 * Vì sao tách khỏi `plan.ts`: plan.ts trả lời "hôm nay làm gì, bao lâu",
 * còn ở đây trả lời "làm thế nào" — dạy thẳng nội dung để người học không
 * phải mở YouTube hay sách khác giữa chừng. Trộn hai thứ vào một file thì
 * lịch trình chìm nghỉm trong hàng nghìn dòng nội dung.
 *
 * Khoá của `LESSONS` là `StudyTask.id`, nên bài giảng gắn vào việc nào là
 * tự khớp; việc chưa có bài thì UI đơn giản không hiện nút "Học ngay".
 */

export interface LessonExample {
  /** Dạng viết như trong đề (kanji + kana) */
  jp: string;
  /** Cách đọc bằng kana — bỏ trống nếu `jp` đã toàn kana */
  read?: string;
  /** Romaji, cho người còn đang dò từng chữ */
  romaji?: string;
  vi: string;
  /** Vì sao ví dụ này đáng nhớ / bẫy nằm ở đâu */
  note?: string;
  /** true = ví dụ minh hoạ CÁI SAI, UI tô đỏ và gạch */
  wrong?: boolean;
}

export type LessonPart =
  | { type: 'text'; h?: string; body: string }
  | { type: 'steps'; h?: string; items: string[] }
  | { type: 'table'; h?: string; headers: string[]; rows: string[][]; note?: string; dangerRows?: number[] }
  | { type: 'examples'; h?: string; items: LessonExample[] }
  | { type: 'warn'; h?: string; body: string }
  | { type: 'tip'; h?: string; body: string }
  /** Tự kiểm: câu hỏi hiện trước, bấm mới lộ đáp án */
  | { type: 'quiz'; h?: string; items: { q: string; a: string; why?: string }[] };

export interface TaskLesson {
  /** Học xong thì LÀM ĐƯỢC gì — viết theo hành vi, không viết "hiểu về…" */
  goal: string;
  parts: LessonPart[];
}

export type LessonMap = Record<string, TaskLesson>;
