/**
 * Câu hỏi tiếng Anh kiểu đề FE cho 15 bài kiểm tra chương + đề tổng hợp cuối khoá (21/11/2026).
 *   FE[n]      ⇒ 10 câu nối SAU các câu cũ của quiz chương n (giữ nguyên vị trí câu cũ ⇒ id q1…q10 không đổi)
 *   FE_CUOI    ⇒ 45 câu của bài wf-final-exam
 *   phanFE(n)  ⇒ đoạn HTML (ml-en + ml-vi) giới thiệu phần câu hỏi tiếng Anh, nối cuối content bài quiz
 *   FE_THO / FE_CUOI_THO ⇒ bản còn trường `chay` (đặc tả chạy thật) cho bộ kiểm
 */
import { xuat } from './fe-khung.mjs';
import { C1, C2, C3, C4, C5 } from './fe-c01-05.mjs';
import { C6, C7, C8, C9, C10 } from './fe-c06-10.mjs';
import { C11, C12, C13, C14, C15 } from './fe-c11-15.mjs';
import { CUOI } from './fe-cuoi-khoa.mjs';

export const FE_THO = { 1: C1, 2: C2, 3: C3, 4: C4, 5: C5, 6: C6, 7: C7, 8: C8, 9: C9, 10: C10, 11: C11, 12: C12, 13: C13, 14: C14, 15: C15 };
export const FE = Object.fromEntries(Object.entries(FE_THO).map(([k, v]) => [k, xuat(v)]));
export const FE_CUOI_THO = CUOI;
export const FE_CUOI = xuat(CUOI);

export function phanFE(n) {
  const so = FE[n].length;
  return '\n<div class="ml-en"><h3>🇬🇧 Part B — FE-style questions in English</h3>' +
    '<p>After the review questions above, the last ' + so + ' questions are written the way the final exams (FE) of FPT University are: English only, four options, one correct answer, often “What is the output of the following code?”. Every code answer was checked by running the code. Read the whole question before the options, and for code questions trace it line by line on paper first — that habit is what the real exam rewards. Each answer comes with a short explanation after you submit.</p></div>\n' +
    '<div class="ml-vi"><h3>🇬🇧 Phần B — câu hỏi tiếng Anh kiểu đề FE</h3>' +
    '<p>Sau các câu ôn tập ở trên, ' + so + ' câu cuối được viết theo đúng kiểu đề thi cuối kỳ (FE) của trường FPT: chỉ tiếng Anh, bốn phương án, một đáp án đúng, hay gặp dạng “What is the output of the following code?”. Mọi đáp án về mã đều đã được kiểm bằng cách chạy thật. Đọc hết câu hỏi trước khi nhìn phương án, và với câu về mã hãy dò từng dòng ra giấy trước — đó là thói quen đề thật thưởng điểm. Nộp bài xong mỗi câu có giải thích ngắn (song ngữ).</p></div>\n';
}

/** Bài đề tổng hợp cuối khoá (cuối Chương 15, trước bài bảo vệ dự án). */
export function baiThiCuoi() {
  const n = FE_CUOI.length;
  const en = '\n<div class="ml-en"><span class="eyebrow">Final exam · FE style</span><h2>Final exam — ' + n + ' questions in English</h2>' +
    '<p class="lead">A mock final exam covering all fifteen chapters, written the way FPT University’s FE papers are: English only, four options, one correct answer, ' + n + ' questions in 60 minutes. Three questions come from each chapter and none of them repeats a chapter quiz, so a good score means you understand the ideas, not that you remember the answers.</p>' +
    '<h3>How to use it</h3><ul><li>Do it in one sitting with the timer on, without notes or a browser — exactly like the real exam.</li>' +
    '<li>For “What is the output of the following code?” trace the code on paper line by line; every answer was checked by running the code (Node 22, Chromium, SQLite, tsc).</li>' +
    '<li>After submitting, read the explanation of every question you missed and reopen the lesson it comes from (the questions are grouped by chapter, 1 → 15).</li>' +
    '<li>Aim for 36/' + n + ' (80%) before you call the course done; below 30, revise the chapters with the most mistakes and try again in a few days.</li></ul>' +
    '<div class="callout ok"><p><strong>🎯 Done when</strong></p><ul><li>You scored at least 80% in one timed attempt.</li><li>For every question you missed, you can explain in one sentence why the correct option is correct.</li></ul></div></div>\n';
  const vi = '<div class="ml-vi"><span class="eyebrow">Thi cuối khoá · kiểu FE</span><h2>Đề tổng hợp cuối khoá — ' + n + ' câu tiếng Anh</h2>' +
    '<p class="lead">Một đề thi thử cuối khoá phủ đủ mười lăm chương, viết đúng kiểu đề FE của trường FPT: chỉ tiếng Anh, bốn phương án, một đáp án đúng, ' + n + ' câu trong 60 phút. Mỗi chương ba câu và không câu nào lặp lại bài kiểm tra chương, nên điểm cao nghĩa là bạn hiểu ý, không phải bạn nhớ đáp án.</p>' +
    '<h3>Cách làm</h3><ul><li>Làm một mạch, bật giờ, không xem tài liệu hay mở trình duyệt — y như thi thật.</li>' +
    '<li>Với câu “What is the output of the following code?” hãy dò mã ra giấy từng dòng; mọi đáp án đều đã được kiểm bằng cách chạy thật (Node 22, Chromium, SQLite, tsc).</li>' +
    '<li>Nộp xong, đọc giải thích của mọi câu sai và mở lại bài học tương ứng (các câu xếp theo chương, 1 → 15).</li>' +
    '<li>Nhắm 36/' + n + ' (80%) rồi mới coi là xong khoá; dưới 30 thì ôn lại các chương sai nhiều nhất và làm lại sau vài ngày.</li></ul>' +
    '<div class="callout ok"><p><strong>🎯 Đạt khi</strong></p><ul><li>Bạn đạt ít nhất 80% trong một lượt làm có bấm giờ.</li><li>Với mỗi câu sai, bạn giải thích được trong một câu vì sao phương án đúng là đúng.</li></ul></div></div>\n';
  return {
    title: '🏁 Final exam — ' + n + ' FE-style questions in English|||🏁 Đề tổng hợp cuối khoá — ' + n + ' câu tiếng Anh kiểu FE',
    slug: 'wf-final-exam',
    type: 'QUIZ',
    isFreePreview: false,
    description: 'Đề thi thử cuối khoá kiểu FE: ' + n + ' câu tiếng Anh (3 câu/chương, không lặp quiz chương), 60 phút, đáp án đã chạy thật.',
    content: en + vi,
    quiz: { timeLimitSeconds: 3600, questions: FE_CUOI },
  };
}
