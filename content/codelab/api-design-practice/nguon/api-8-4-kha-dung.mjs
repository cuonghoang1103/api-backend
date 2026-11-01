/** API Design · 8.5 — SLO, ngân sách lỗi, sụp vì nghẽn và bỏ bớt tải 503 + Retry-After (output thật bài 8.5). */
import { doiDau, KHOA, cs, q, tn, jsBai, nguon, goi } from './_api.mjs';

const E1 = cs({
  ten: 'Availability 1 — Budgets and overload', kho: 'EASY', phut: 8,
  en: 'Facts from lesson 8.5 (perf/budget.mjs, perf/probe.mjs, perf/shed.mjs on LabFlow).',
  vi: 'Những điều từ bài 8.5 (perf/budget.mjs, perf/probe.mjs, perf/shed.mjs trên LabFlow).',
  cau: [
    q('c1', ['What is the error budget of a 99.9% SLO over 30 days?', 'Ngân sách lỗi của SLO 99,9% trong 30 ngày là bao nhiêu?'],
      ['43.2 minutes', '4.3 minutes', '7.2 hours', '0.1 minutes'],
      ['30 × 24 × 60 × 0.001 = 43.2. Each extra 9 divides it by ten: 99.99% leaves 4.3 minutes.', '30 × 24 × 60 × 0,001 = 43,2. Mỗi chữ 9 thêm vào chia nó cho mười: 99,99% còn 4,3 phút.']),
    q('c2', ['Without shedding, 200 users gave 12 answered logins/s and 1,990 timeouts. What is that called?', 'Không bỏ bớt tải, 200 người cho 12 lượt được trả lời mỗi giây và 1.990 lần hết giờ chờ. Hiện tượng đó tên gì?'],
      ['Congestion collapse: throughput stays high, goodput falls', 'A memory leak in Express under sustained load', 'The per-user login limit blocking new emails', 'A deadlock between threadpool and event loop'],
      ['The server kept hashing passwords for clients that had left; Lan waited 13 s after the test ended.', 'Server vẫn băm mật khẩu cho những client đã bỏ đi; cô Lan chờ 13 giây sau khi bài test kết thúc.']),
    q('c3', ['Which status tells a client that the SERVICE (not its own quota) cannot take the request right now?', 'Mã nào nói với client rằng DỊCH VỤ (không phải hạn mức của nó) lúc này không nhận được request?'],
      ['503 with Retry-After', '429 with Retry-After', '500', '408'],
      ['429 = you are over your quota (5.3); 503 = nobody can be served right now. Both may carry Retry-After (RFC 9110).', '429 = bạn vượt hạn mức (5.3); 503 = lúc này không phục vụ được ai. Cả hai đều có thể kèm Retry-After (RFC 9110).']),
  ],
  goiY: [['Minutes in 30 days = 43,200.', 'Số phút trong 30 ngày = 43.200.'], ['Goodput counts only answers someone still waits for.', 'Goodput chỉ đếm câu trả lời còn người chờ.']],
  loi: [['Confusing 429 and 503.', 'Nhầm 429 với 503.'], ['Measuring availability only from server logs.', 'Chỉ đo tính sẵn sàng từ log server.']],
  tns: [tn('SLO', 'mục tiêu mức dịch vụ'), tn('goodput', 'phần việc tới tay người còn chờ')],
  kn: ['availability'],
});

function budget(sloPercent, days) {
  const minutes = days * 24 * 60 * (1 - sloPercent / 100);
  return Math.round(minutes * 10) / 10;
}
function chainAvailability(parts) {
  const all = parts.reduce((p, a) => p * (a / 100), 1);
  return Math.round(all * 100 * 1000) / 1000;
}
const E2 = jsBai({
  ten: 'Availability 2 — Write budget(slo, days) and chainAvailability(parts)', kho: 'EASY', phut: 12,
  en: `<p>Two helpers for an SLO page. <code>budget(sloPercent, days)</code> returns the minutes that may go wrong in <code>days</code> days, rounded to 1 decimal. <code>chainAvailability(parts)</code> takes the availabilities (in %) of components that a request needs <em>one after another</em> and returns the availability of the whole chain in %, rounded to 3 decimals. An empty chain is 100.</p>`,
  vi: `<p>Hai hàm phụ cho trang SLO. <code>budget(sloPercent, days)</code> trả số phút được phép hỏng trong <code>days</code> ngày, làm tròn 1 chữ số. <code>chainAvailability(parts)</code> nhận tính sẵn sàng (%) của các thành phần mà một request cần <em>nối tiếp nhau</em> và trả tính sẵn sàng của cả chuỗi tính bằng %, làm tròn 3 chữ số. Chuỗi rỗng là 100.</p>`,
  dauVao: ['sloPercent, days — numbers; parts — number[] (%)', 'sloPercent, days — số; parts — number[] (%)'],
  dauRa: ['minutes (1 decimal); percent (3 decimals)', 'phút (1 chữ số); phần trăm (3 chữ số)'],
  goiY: [['1 − 99.9/100 = 0.001.', '1 − 99,9/100 = 0,001.'], ['Availabilities in a chain multiply as fractions.', 'Tính sẵn sàng nối tiếp nhân với nhau dưới dạng phân số.']],
  loi: [['Taking the minimum of the chain instead of the product.', 'Lấy giá trị nhỏ nhất của chuỗi thay vì tích.'], ['Multiplying percentages directly (99.9 × 99.9).', 'Nhân thẳng phần trăm (99,9 × 99,9).']],
  gt: ['budget(99.9, 30) = 43.2; the four-part booking chain of lesson 8.5 = 99.79 — about 1.5 hours a month, worse than any part.', 'budget(99.9, 30) = 43,2; chuỗi đặt phòng bốn thành phần của bài 8.5 = 99,79 — khoảng 1,5 giờ mỗi tháng, tệ hơn mọi thành phần.'],
  kn: ['availability'],
  tns: [tn('error budget', 'ngân sách lỗi'), tn('serial dependencies', 'phụ thuộc nối tiếp')],
  dau: `/** minutes allowed to fail */
function budget(sloPercent, days) {
  // Write your solution here
  return days * (100 - sloPercent);
}
/** availability of components needed one after another, in % */
function chainAvailability(parts) {
  return Math.min(...parts);
}
`,
  giai: '// Reference solution\n' + nguon(budget, chainAvailability),
  cases: [
    { goi: goi('budget', 99.9, 30), moTa: ['99.9% over 30 days', '99,9% trong 30 ngày'] },
    { goi: 'chainAvailability([99.99, 99.95, 99.95, 99.9])', moTa: ['The booking chain of lesson 8.5', 'Chuỗi đặt phòng của bài 8.5'] },
    { goi: goi('budget', 99.99, 30), an: true },
    { goi: goi('budget', 99.5, 7), an: true },
    { goi: 'chainAvailability([99.99, 99.95, 99.95])', an: true },
    { goi: 'chainAvailability([])', an: true },
  ],
});

function shed(requests, max) {
  const accepted = [];                                       // [start, end] của các request đã nhận
  return requests.map(({ start, dur }) => {
    const inflight = accepted.filter(([s, e]) => s <= start && start < e).length;
    if (inflight >= max) return 503;
    accepted.push([start, start + dur]);
    return 200;
  });
}
const E3 = jsBai({
  ten: 'Availability 3 — Write shed(requests, max): limitInflight on paper', kho: 'MEDIUM', phut: 15,
  en: `<p>Model LabFlow’s <code>limitInflight(max)</code>. Requests arrive in order of <code>start</code> (ms); an accepted request is in flight from <code>start</code> until <code>start + dur</code> (it no longer counts at exactly its end time). When a request arrives, count the <em>accepted</em> requests in flight at that moment: if that is <code>max</code> or more, answer <code>503</code> (and it never runs); otherwise accept it with <code>200</code>. Return the status of each request.</p>`,
  vi: `<p>Mô phỏng <code>limitInflight(max)</code> của LabFlow. Request tới theo thứ tự <code>start</code> (ms); request được nhận thì đang xử lý từ <code>start</code> tới <code>start + dur</code> (đúng lúc kết thúc thì không còn tính). Khi một request tới, đếm các request <em>đã nhận</em> đang xử lý lúc đó: từ <code>max</code> trở lên thì trả <code>503</code> (và nó không chạy); ngược lại nhận với <code>200</code>. Trả mã của từng request.</p>`,
  dauVao: ['requests — [{ start, dur }] sorted by start; max — number', 'requests — [{ start, dur }] đã sắp theo start; max — số'],
  dauRa: ['(200 | 503)[]', '(200 | 503)[]'],
  goiY: [['Keep the [start, end) of accepted requests only.', 'Chỉ giữ [start, end) của request đã nhận.'], ['A rejected request never occupies a slot.', 'Request bị từ chối không chiếm chỗ.']],
  loi: [['Counting rejected requests as in flight.', 'Đếm cả request bị từ chối là đang xử lý.'], ['Treating end time as still busy (≤ instead of <).', 'Coi đúng lúc kết thúc vẫn bận (≤ thay vì <).']],
  gt: ['With max = 8 and 31 ms jobs, the 9th simultaneous login gets 503 in microseconds instead of waiting — goodput 12 → 123/s in lesson 8.5.', 'Với max = 8 và việc 31 ms, lượt đăng nhập thứ 9 cùng lúc nhận 503 trong vài micro giây thay vì chờ — goodput 12 → 123/s ở bài 8.5.'],
  kn: ['availability', 'load shedding'],
  tns: [tn('load shedding', 'bỏ bớt tải'), tn('in flight', 'đang xử lý')],
  dau: `/** 200 or 503 for each request under an in-flight limit */
function shed(requests, max) {
  // Write your solution here
  return requests.map((r, i) => (i < max ? 200 : 503));
}
`,
  giai: '// Reference solution\n' + nguon(shed),
  cases: [
    { goi: goi('shed', [{ start: 0, dur: 31 }, { start: 1, dur: 31 }, { start: 2, dur: 31 }, { start: 40, dur: 31 }], 2), moTa: ['max 2: the third gets 503 at once', 'max 2: cái thứ ba nhận 503 ngay'] },
    { goi: goi('shed', [{ start: 0, dur: 10 }, { start: 10, dur: 10 }], 1), moTa: ['Ends exactly when the next starts', 'Kết thúc đúng lúc cái sau bắt đầu'] },
    { goi: goi('shed', [], 8), an: true },
    { goi: goi('shed', [{ start: 0, dur: 5 }, { start: 1, dur: 1 }, { start: 2, dur: 1 }, { start: 3, dur: 9 }, { start: 4, dur: 1 }], 2), an: true },
    { goi: goi('shed', [{ start: 0, dur: 100 }, { start: 0, dur: 100 }, { start: 50, dur: 1 }], 1), an: true },
  ],
});

export default doiDau({ slug: 'api-8-4-kha-dung', ten: '8.5 SLOs, error budgets and load shedding', khoa: KHOA, baiHoc: 'api-8-4-kha-dung', de: [E1, E2, E3] });
