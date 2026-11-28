/**
 * Bộ khuôn dùng chung cho các đề TỰ SOẠN của NWC204 (Progress Test, Practical Exam).
 *
 * Mọi chuỗi hiển thị song ngữ: prompt và option dạng ống "EN|||VI" (đúng MỘT dấu ống — đừng gõ
 * ba dấu | liền nhau trong nội dung), giải thích và hướng dẫn dạng hai khối `.ml-en` / `.ml-vi`.
 *
 * Câu trắc nghiệm được soạn với đáp án ĐÚNG ĐỨNG ĐẦU; `mcq()` đặt nó vào vị trí do băm nội dung câu
 * quyết định (không theo chu kỳ đều), rồi tự ghi dòng "Đáp án đúng: …" vào đầu giải thích — nên lời
 * giải thích viết tay KHÔNG BAO GIỜ được nhắc chữ cái A/B/C/D (thứ tự hiện là do máy đặt).
 *
 * Con số trong đề (subnet, VLSM, nhị phân, khớp tiền tố dài nhất…) lấy từ bộ mô phỏng của Code Lab
 * NWC204 (`content/codelab/nwc204-practice/nguon/_sim.mjs`, có phép kiểm `_kiem-sim.mjs`) — không tính nhẩm.
 */

/** Chuỗi song ngữ dạng ống — đúng MỘT dấu ống. */
export const B = (en, vi) => `${en}|||${vi}`;
/** Giải thích / hướng dẫn song ngữ dạng hai khối HTML. */
export const EX = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
/** Khối mã / kết xuất lệnh trong đề — tự thoát ký tự. */
export const code = (src) => `<pre><code>${esc(src)}</code></pre>`;
/** Mã inline trong câu văn. */
export const c = (src) => `<code>${esc(src)}</code>`;

/** Băm FNV-1a 32 bit của một chuỗi — để đặt vị trí đáp án đúng một cách xác định mà không theo chu kỳ. */
function bam(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h >>> 0;
}

/**
 * Một câu trắc nghiệm một đáp án. `opts` = [[en, vi], …] với phương án ĐÚNG đứng đầu.
 * `ex` = [en, vi] — vì sao đúng, và vì sao phương án sai hấp dẫn nhất lại sai (gọi bằng nội dung, không bằng chữ cái).
 */
export function mcq({ p, opts, ex, points = 0.2 }) {
  const n = opts.length;
  const pos = bam(p[0]) % n;
  const order = opts.slice(1);
  order.splice(pos, 0, opts[0]);
  return {
    kind: 'MCQ',
    points,
    prompt: B(p[0], p[1]),
    imageUrl: null,
    options: order.map(([en, vi]) => ({ text: B(en, vi) })),
    correctIndexes: [pos],
    explanation: EX(
      `<p><strong>Correct: ${esc(opts[0][0])}</strong></p><p>${ex[0]}</p>`,
      `<p><strong>Đáp án đúng: ${esc(opts[0][1])}</strong></p><p>${ex[1]}</p>`,
    ),
  };
}

/** Rubric cho câu thực hành viết lệnh cấu hình (PE dạng WRITE, AI chấm theo đáp án mẫu). */
export const rubric = (items) => items.map(([id, en, vi, maxScore]) => ({ id, criterion: B(en, vi), weight: 1, maxScore }));
