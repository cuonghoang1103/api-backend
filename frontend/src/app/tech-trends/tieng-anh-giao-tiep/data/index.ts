/**
 * Gom toàn bộ dữ liệu khoá "Tiếng Anh Giao Tiếp".
 *
 * Tách theo tuần để mỗi tệp còn đọc/sửa được bằng tay; tệp này chỉ ghép lại
 * và tính vài con số cho phần tóm tắt trên đầu trang.
 */
import type { DayLesson, WeekBlock } from './types';
import { WEEK_1 } from './week1';
import { WEEK_2 } from './week2';
import { WEEK_3 } from './week3';
import { WEEK_4 } from './week4';
import { WEEK_5 } from './week5';
import { WEEK_6 } from './week6';

export * from './types';
export * from './dev';

/**
 * Tuần 1–4 là phần CƠ BẢN (nói được), tuần 5 trở đi là NÂNG CAO (nói có
 * trọng lượng). Thêm tuần mới chỉ cần viết `weekN.ts` theo cùng interface rồi
 * nối vào mảng này — mọi số liệu, sơ đồ lộ trình, tra cứu và bài kiểm tra tự
 * nhận ngày mới.
 */
export const WEEKS: WeekBlock[] = [WEEK_1, WEEK_2, WEEK_3, WEEK_4, WEEK_5, WEEK_6];

/** Mốc chia hai phần — dùng để hiện nhãn "Nâng cao" trên sơ đồ. */
export const BASIC_WEEKS = 4;

export const ALL_DAYS: DayLesson[] = WEEKS.flatMap((w) => w.days);

/** Khoá localStorage — đổi hậu tố khi cấu trúc tiến độ thay đổi. */
export const PROGRESS_KEY = 'english-speaking:progress:v1';

/** Số liệu hiện ở đầu trang. Tính từ dữ liệu thật nên không bao giờ lệch. */
export const STATS = {
  days: ALL_DAYS.length,
  /** Tổng số câu: mỗi cặp tính 1 câu hỏi + số câu trả lời. */
  phrases: ALL_DAYS.reduce(
    (sum, d) => sum + d.qa.reduce((s, p) => s + 1 + p.answers.length, 0),
    0,
  ),
  vocab: ALL_DAYS.reduce((sum, d) => sum + d.vocab.length, 0),
  grammar: ALL_DAYS.reduce((sum, d) => sum + d.grammar.length, 0),
  dialogues: ALL_DAYS.reduce((sum, d) => sum + d.dialogues.length, 0),
  sounds: ALL_DAYS.filter((d) => d.sound).length,
};
