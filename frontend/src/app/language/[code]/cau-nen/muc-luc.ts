/**
 * Mục lục 30 ngày của "1000 câu nền — dịch 2 chiều". Nhẹ (không kèm câu) để trang tổng quan mở ngay;
 * nội dung từng ngày tải theo yêu cầu (`du-lieu/index.ts`). `soCau` phải khớp số câu thật của ngày —
 * `scripts/cau-nen-kiem.mts` chặn lệch.
 *
 * Thứ tự sư phạm (chỉnh từ đề xuất ban đầu, 28/11/2026): mỗi 5 ngày một ngày ÔN (5 · 10 · 15 · 20 · 25),
 * và ngày ôn không chỉ lặp lại câu cũ mà GHÉP các khung vừa học vào một tình huống thật — nhờ vậy năm chủ đề
 * tình huống (giới thiệu bản thân, làm quen, kể chuyện ngày thường, gọi món – mua sắm, ở trường – đường đi –
 * lịch hẹn) nằm đúng ở ngày ôn mà không phải bỏ khung ngữ pháp nào. Ngày 29 ôn tổng, ngày 30 kiểm tra cuối.
 */
import type { MucNgay } from './kieu';

export const MUC_LUC: MucNgay[] = [
  { n: 1, ten: 'be + danh từ / tính từ', khung: 'I\'m a student. · She\'s tired.', soCau: 34, anh: 'student' },
  { n: 2, ten: 'this / that / these / those + my / your…', khung: 'This is my laptop.', soCau: 34, anh: 'laptop' },
  { n: 3, ten: 'there is / there are', khung: 'There\'s a bug in my code.', soCau: 34, anh: 'house-with-garden' },
  { n: 4, ten: 'Hiện tại đơn — khẳng định (đuôi -s)', khung: 'She works from home.', soCau: 34, anh: 'alarm-clock' },
  { n: 5, ten: 'ÔN 1–4 · Giới thiệu bản thân', khung: 'Ghép be + this/my + there is + hiện tại đơn', on: true, soCau: 34, anh: 'waving-hand' },
  { n: 6, ten: 'Phủ định & câu hỏi với do / does', khung: 'I don\'t know. · Does he work here?', soCau: 34, anh: 'thinking-face' },
  { n: 7, ten: 'Câu hỏi Wh-', khung: 'Where do you live? · What\'s your name?', soCau: 34, anh: 'red-question-mark' },
  { n: 8, ten: 'can / can\'t', khung: 'I can\'t hear you. · Can you help me?', soCau: 34, anh: 'flexed-biceps' },
  { n: 9, ten: 'like / want / need + to V / V-ing', khung: 'I want to learn English.', soCau: 34, anh: 'red-heart' },
  { n: 10, ten: 'ÔN 6–9 · Làm quen, hỏi chuyện', khung: 'Ghép câu hỏi + can + want/like', on: true, soCau: 34, anh: 'handshake' },
  { n: 11, ten: 'Hiện tại tiếp diễn', khung: 'I\'m working on it.', soCau: 34, anh: 'technologist' },
  { n: 12, ten: 'Giới từ thời gian & nơi chốn', khung: 'at 9 · on Monday · in the office', soCau: 34, anh: 'round-pushpin' },
  { n: 13, ten: 'Quá khứ của be: was / were', khung: 'I was sick yesterday.', soCau: 34, anh: 'face-with-thermometer' },
  { n: 14, ten: 'Quá khứ đơn', khung: 'I fixed the bug last night.', soCau: 34, anh: 'bug' },
  { n: 15, ten: 'ÔN 11–14 · Kể chuyện ngày thường', khung: 'Hôm nay đang làm gì · hôm qua đã làm gì', on: true, soCau: 34, anh: 'open-book' },
  { n: 16, ten: 'Tương lai: will / be going to', khung: 'I\'ll call you. · I\'m going to study.', soCau: 34, anh: 'rocket' },
  { n: 17, ten: 'have to / should', khung: 'I have to go. · You should rest.', soCau: 34, anh: 'light-bulb' },
  { n: 18, ten: 'So sánh', khung: 'faster than · the best', soCau: 34, anh: 'bar-chart' },
  { n: 19, ten: 'Lượng từ: some / any / much / many', khung: 'Do you have any questions?', soCau: 34, anh: 'shopping-cart' },
  { n: 20, ten: 'ÔN 16–19 · Gọi món, mua sắm', khung: 'I\'ll have… · How much is…?', on: true, soCau: 34, anh: 'hamburger' },
  { n: 21, ten: 'Mệnh lệnh & lời đề nghị lịch sự', khung: 'Could you…? · Would you like…?', soCau: 34, anh: 'folded-hands' },
  { n: 22, ten: 'Hiện tại hoàn thành cơ bản', khung: 'I\'ve finished. · Have you ever…?', soCau: 34, anh: 'check-mark-button' },
  { n: 23, ten: 'Nối câu: because / so / but / when / if', khung: 'If it rains, I\'ll stay home.', soCau: 34, anh: 'puzzle-piece' },
  { n: 24, ten: 'Câu hỏi đuôi & câu trả lời ngắn', khung: 'It\'s late, isn\'t it? · Yes, I do.', soCau: 34, anh: 'speech-balloon' },
  { n: 25, ten: 'ÔN 21–24 · Ở trường: đường đi, lịch hẹn', khung: 'Where\'s room 302? · Can we meet at 3?', on: true, soCau: 34, anh: 'school' },
  { n: 26, ten: 'Thực tập IT (1): họp & daily standup', khung: 'Yesterday I… Today I\'ll… No blockers.', soCau: 34, anh: 'office-worker' },
  { n: 27, ten: 'Thực tập IT (2): báo lỗi & xin giúp', khung: 'The app crashes when… · Could you take a look?', soCau: 34, anh: 'hammer-and-wrench' },
  { n: 28, ten: 'Email & chat công việc ngắn', khung: 'Just a quick update… · Let me know if…', soCau: 34, anh: 'e-mail' },
  { n: 29, ten: 'ÔN TỔNG 1–28', khung: 'Mọi khung câu, câu dài hơn', on: true, soCau: 34, anh: 'books' },
  { n: 30, ten: 'KIỂM TRA CUỐI · Một ngày bằng tiếng Anh', khung: 'Từ sáng tới tối: trường, công việc, bạn bè', on: true, soCau: 34, anh: 'trophy' },
];

export const TONG_CAU = MUC_LUC.reduce((t, m) => t + m.soCau, 0);
export const SO_NGAY = MUC_LUC.length;
