/**
 * Kiểu dữ liệu của "Hướng dẫn từng bước" (tour). Một tour là KỊCH BẢN thuần dữ liệu, gắn với một mô phỏng:
 *   • mỗi bước tô sáng một vùng (`target` = giá trị data-tour="…" trong mô phỏng) và giải thích ngắn VI/EN;
 *   • `do`: tour tự bấm hộ (đặt bit, nạp chương trình, nhảy tới vi bước…) — dùng hành động mô phỏng đã đăng ký
 *     qua useLabBridge (labs/bus.tsx), tên dạng 'cpu.load' / 'player.seek';
 *   • `task`: người học tự làm, tour CHỜ tới khi trạng thái thoả `until`; `solve` là lời giải bấm hộ (nút "Làm giúp
 *     tôi", chế độ quay video, và bộ kiểm tự động dùng chính lời giải này);
 *   • cuối tour là một câu hỏi kiểm tra nhỏ.
 * Bài học chọn tour bằng class `<ns>-t-<id>` (content/_labs.mjs), nên MỌI kịch bản phải nằm trong mã, không trong HTML.
 */
import type { LabState } from '../bus';
import type { LabNs } from '../selector';

/** [tiếng Anh, tiếng Việt] */
export type L = readonly [string, string];

export interface TourAct {
  /** 'id.action' — vd. 'cpu.load', 'player.seek', 'bits.tab' */
  a: string;
  v?: unknown;
  /** chờ thêm (ms, ở tốc độ 1×) TRƯỚC khi làm hành động này — để người xem kịp thấy từng thay đổi */
  delay?: number;
  /** lặp tối đa N lần (mỗi lần cách `delay`), dừng sớm ngay khi việc của bước đã đạt — kiểu "bấm Bước tới khi…" */
  upTo?: number;
}

export interface TourTask {
  text: L;
  until: (s: LabState) => boolean;
  solve: TourAct[];
  /** gợi ý khi người học loay hoay */
  hint?: L;
}

export interface TourStep {
  /** giá trị data-tour="…" của vùng cần tô sáng; bỏ trống ⇒ không tô, thẻ hướng dẫn nằm đầu khung */
  target?: string;
  title: L;
  body: L;
  do?: TourAct[];
  task?: TourTask;
  /** thời lượng bước trong chế độ quay video (ms) — bỏ trống ⇒ tính theo độ dài chữ */
  ms?: number;
  /** chỉ hiện bước khi điều kiện đúng (vd. mô phỏng có bộ phát) */
  when?: (s: LabState) => boolean;
}

export interface TourQuiz { q: L; options: L[]; answer: number; why: L }

export interface Tour {
  id: string;
  ns: LabNs;
  sim: string;
  /** preset gần nhất — dùng để chọn tour mặc định khi mô phỏng mở ở preset này */
  presets: string[];
  title: L;
  /** một câu: tour này dạy gì */
  summary: L;
  steps: TourStep[];
  quiz: TourQuiz;
}

/** Thời lượng một bước ở chế độ quay (ms, tốc độ 1×): đọc ~16 ký tự/giây, tối thiểu 3,5 s, tối đa 11 s. */
export function stepMs(st: TourStep, lang: 'en' | 'vi'): number {
  if (st.ms) return st.ms;
  const n = (lang === 'vi' ? st.body[1] : st.body[0]).length + (lang === 'vi' ? st.title[1] : st.title[0]).length;
  return Math.max(3500, Math.min(11000, Math.round(1200 + n * 62)));
}
/** tổng thời gian các hành động tự bấm của một bước */
export const actsMs = (acts?: TourAct[]) => (acts ?? []).reduce((t, a) => t + ((a.delay ?? 0) + ACT_GAP) * (a.upTo ?? 1), 0);
/** khoảng nghỉ tối thiểu giữa hai hành động (để React kịp vẽ) */
export const ACT_GAP = 120;
/** thời lượng câu hỏi cuối trong chế độ quay */
export const QUIZ_MS = 7000;
