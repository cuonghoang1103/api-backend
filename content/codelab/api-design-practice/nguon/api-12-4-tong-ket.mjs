/** API Design · 12.8 — Rà soát, tài liệu và câu chuyện phỏng vấn: bảng bằng chứng, STAR, dòng CV (số liệu thật của bài 12.1–12.7). */
import { doiDau, KHOA, cs, q, ord, tn, jsBai, nguon, goi } from './_api.mjs';

const E1 = cs({
  ten: 'Story 1 — Evidence, STAR and CV lines', kho: 'EASY', phut: 8,
  en: 'Lesson 12.8: turning the chapter’s measurements into a README, three STAR stories and CV lines.',
  vi: 'Bài 12.8: biến số đo của chương thành README, ba câu chuyện STAR và dòng CV.',
  cau: [
    q('c1', ['MIT’s career office suggests how to split a STAR answer. Where should most of the time go?', 'Phòng hướng nghiệp MIT gợi ý chia câu trả lời STAR. Phần lớn thời gian nên dành cho đâu?'],
      ['Action, about 60% — what you personally did', 'Situation, about 60% — so the interviewer understands the project', 'Result, about 60% — the numbers are what they remember', 'Task, about 60% — the responsibility you were given'],
      ['~20% situation, ~10% task, ~60% action, ~10% result with numbers; prepare 3–5 stories.', '~20% bối cảnh, ~10% nhiệm vụ, ~60% hành động, ~10% kết quả có số; chuẩn bị 3–5 câu chuyện.']),
    q('c2', ['Which CV line follows lesson 12.8?', 'Dòng CV nào theo đúng bài 12.8?'],
      ['Moved email out of the request path with an outbox and BullMQ: booking p50 311 ms → 3.6 ms', 'Built a scalable, high-performance, enterprise-grade booking platform', 'Handled 10,000 concurrent users with 99.99% uptime on a laptop', 'Used Node.js, PostgreSQL, Redis, BullMQ, Docker and Prometheus'],
      ['Stack, guarantee, a number you can reproduce. The 10,000-users line cannot survive “how did you measure it?”.', 'Công nghệ, điều được bảo đảm, một con số tái tạo được. Dòng 10.000 người dùng không qua nổi câu “em đo thế nào?”.']),
    q('c3', ['“What would break first at 10× load?” — the measured answer from Chapter 12?', '“Tải gấp 10 thì cái gì hỏng trước?” — câu trả lời có số đo từ Chương 12?'],
      ['Logins: scrypt is CPU-bound at ~100–125/s per instance, then database connections', 'The labs list, because it is the slowest endpoint on PostgreSQL', 'Redis, because the rate limiter runs a Lua script per request', 'The outbox relay, because it polls the table every second'],
      ['You know where to look because you measured: mixed.mjs logins in 12.6, pool limits in 12.3.', 'Bạn biết nhìn vào đâu vì đã đo: đăng nhập của mixed.mjs ở 12.6, giới hạn pool ở 12.3.']),
  ],
  goiY: [['Numbers beat adjectives.', 'Con số thắng tính từ.'], ['Say what you did not test.', 'Nói ra cái bạn chưa thử.']],
  loi: [['A CV number you cannot reproduce.', 'Con số trên CV mà bạn không tái tạo được.'], ['A STAR answer that is mostly situation.', 'Câu trả lời STAR toàn bối cảnh.']],
  tns: [tn('STAR', 'Bối cảnh · Nhiệm vụ · Hành động · Kết quả'), tn('evidence sheet', 'bảng bằng chứng')],
  kn: ['career', 'interview'],
});

const E2 = cs({
  ten: 'Story 2 — Order a five-minute demo', kho: 'EASY', phut: 5, loai: 'order',
  en: 'Put the five-minute LabFlow demo of lesson 12.8 in order.',
  vi: 'Xếp buổi demo năm phút của bài 12.8 theo đúng thứ tự.',
  cau: [
    ord('o1', ['The demo', 'Buổi demo'], [
      'one sentence of problem and the architecture diagram',
      'node ops/smoke.mjs: twelve green lines',
      'node perf/race-api.mjs slot 50: fifty clicks, one booking',
      'stop Redis, keep booking; start it, watch the outbox drain',
      'the OpenAPI page and the breaking-change diff',
      'honest limits: one PostgreSQL, no PITR, a fake mail provider',
    ], ['Problem first, proof in the middle, limits last — every step a script, nothing typed live.', 'Vấn đề trước, bằng chứng ở giữa, giới hạn cuối cùng — bước nào cũng là script, không gõ trực tiếp.']),
  ],
  goiY: [['Start with why it exists.', 'Bắt đầu bằng lý do nó tồn tại.'], ['End before they ask about limits.', 'Kết thúc trước khi bị hỏi về giới hạn.']],
  loi: [['Opening with the code.', 'Mở đầu bằng mã nguồn.'], ['Typing long commands live.', 'Gõ lệnh dài trực tiếp.']],
  tns: [tn('demo script', 'kịch bản demo')],
  kn: ['career'],
});

function evidenceRow(claim, before, after, unit) {
  const f = (x) => (Number.isInteger(x) ? x.toLocaleString('en-US') : String(x));
  const r = before > after ? before / after : after / before;
  const k = r >= 10 ? Math.round(r) : Math.round(r * 10) / 10;
  return `${claim}: ${f(before)} ${unit} ⇒ ${f(after)} ${unit} (${k}×)`;
}
const E3 = jsBai({
  ten: 'Story 3 — Write evidenceRow(claim, before, after, unit)', kho: 'MEDIUM', phut: 10,
  en: `<p>One line of the evidence sheet: <code>'&lt;claim&gt;: &lt;before&gt; &lt;unit&gt; ⇒ &lt;after&gt; &lt;unit&gt; (&lt;k&gt;×)'</code>. Integers get thousands separators (<code>1,318</code>), other numbers stay as written. <code>k</code> = the larger over the smaller; if <code>k ≥ 10</code> round to an integer, else to one decimal.</p>`,
  vi: `<p>Một dòng của bảng bằng chứng: <code>'&lt;claim&gt;: &lt;before&gt; &lt;unit&gt; ⇒ &lt;after&gt; &lt;unit&gt; (&lt;k&gt;×)'</code>. Số nguyên có dấu phẩy hàng nghìn (<code>1,318</code>), số khác giữ nguyên. <code>k</code> = số lớn chia số nhỏ; nếu <code>k ≥ 10</code> làm tròn thành số nguyên, không thì một chữ số lẻ.</p>`,
  dauVao: ['claim — string; before, after — numbers; unit — string', 'claim — chuỗi; before, after — số; unit — chuỗi'], dauRa: ['string', 'chuỗi'],
  goiY: [['toLocaleString(\'en-US\') adds the commas.', 'toLocaleString(\'en-US\') thêm dấu phẩy.'], ['Faster and slower both use larger ÷ smaller.', 'Nhanh hơn hay chậm hơn đều dùng lớn ÷ nhỏ.']],
  loi: [['Dividing in the wrong direction and printing 0.0×.', 'Chia ngược chiều rồi in 0.0×.'], ['Formatting 3.6 as 4.', 'Làm tròn 3.6 thành 4.']],
  gt: ['Each row of the 12.8 sheet comes from a script you can rerun: 311 ms ⇒ 3.6 ms is 86×; 1,318 ⇒ 2,865 req/s is 2.2×.', 'Mỗi dòng của bảng 12.8 đến từ một script chạy lại được: 311 ms ⇒ 3.6 ms là 86 lần; 1.318 ⇒ 2.865 req/s là 2,2 lần.'],
  kn: ['career', 'performance'], tns: [tn('quantified result', 'kết quả định lượng')],
  dau: `/** one evidence row */
function evidenceRow(claim, before, after, unit) {
  // Write your solution here
  return claim + ': ' + before + ' ' + unit + ' ⇒ ' + after + ' ' + unit + ' (' + (after / before).toFixed(1) + '×)';
}
`,
  giai: '// Reference solution\n' + nguon(evidenceRow),
  cases: [
    { goi: goi('evidenceRow', 'Booking with email', 311, 3.6, 'ms'), moTa: ['Sync vs queue', 'Đồng bộ và hàng đợi'] },
    { goi: goi('evidenceRow', 'Bookings list', 1318, 2865, 'req/s'), moTa: ['RAM vs PostgreSQL', 'RAM và PostgreSQL'] },
    { goi: goi('evidenceRow', 'Lost edits', 11, 1, 'of 20'), an: true },
    { goi: goi('evidenceRow', 'Labs list', 7851, 5549, 'req/s'), an: true },
  ],
});

export default doiDau({ slug: 'api-12-4-tong-ket', ten: '12.8 Review, documentation and your interview story', khoa: KHOA, baiHoc: 'api-12-4-tong-ket', de: [E1, E2, E3] });
