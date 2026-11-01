/** API Design · 12.6 — Đo tải lại bằng script Chương 8, đọc kết quả có biên độ, hợp đồng 2.4.0 (output thật bài 12.6). */
import { doiDau, KHOA, cs, q, tn, jsBai, nguon, goi } from './_api.mjs';

const E1 = cs({
  ten: 'Load 1 — Reading the re-measured table', kho: 'EASY', phut: 8,
  en: 'Facts from lesson 12.6: the Chapter 8 scripts on four setups, rounds 1 and 3, and the final contract.',
  vi: 'Những điều từ bài 12.6: script Chương 8 trên bốn cấu hình, lượt 1 và 3, và hợp đồng cuối cùng.',
  cau: [
    q('c1', ['GET /v2/bookings?limit=20 for a manager went from ~1,300 req/s (RAM) to ~2,900 (PostgreSQL) in round 1. Why faster?', 'GET /v2/bookings?limit=20 của quản lý từ ~1.300 req/s (RAM) lên ~2.900 (PostgreSQL) ở lượt 1. Vì sao nhanh hơn?'],
      ['RAM filters and sorts 10,000 objects per request; PostgreSQL reads 21 rows of an index', 'PostgreSQL caches every response in memory after the first request', 'The RAM store compresses every response, which costs CPU per request', 'PostgreSQL answers on a separate core, so Node never waits for it'],
      ['An index beats an array scan even across a network hop (EXPLAIN: Index Scan, 0.028 ms).', 'Index thắng quét mảng kể cả khi phải qua mạng (EXPLAIN: Index Scan, 0,028 ms).']),
    q('c2', ['Round 2 was left out of the table. Why?', 'Lượt 2 bị loại khỏi bảng. Vì sao?'],
      ['It started at load average 53 from outside work, so its numbers measured the machine, not LabFlow', 'Its numbers were higher than the others and looked too good to publish', 'autocannon crashed during the round and printed partial output only', 'Round 2 used a different number of seeded bookings than rounds 1 and 3'],
      ['Record uptime around every run, discard runs under heavy outside load, publish ranges.', 'Ghi uptime quanh mỗi lần đo, bỏ lượt đo khi máy bị tải nặng từ ngoài, công bố khoảng.']),
    q('c3', ['Two instances behind the proxy on the same laptop were not reliably faster. The right conclusion?', 'Hai instance sau proxy trên cùng một máy không chắc nhanh hơn. Kết luận đúng?'],
      ['They share the same CPU cores and add a hop: instances add availability here, capacity needs separate machines', 'Node.js cannot use more than one process per machine, so the second is idle', 'The proxy limits throughput to one instance at a time by design', 'PostgreSQL serialises all connections from the same host'],
      ['The spread between rounds (2,339–3,392 for one endpoint) was larger than any gain.', 'Độ dao động giữa các lượt (2.339–3.392 cho một endpoint) lớn hơn mọi phần lợi.']),
    q('c4', ['Drift check: 40/40 on PostgreSQL and also 40/40 on two RAM instances that double-booked. What does that teach?', 'Kiểm trôi: 40/40 trên PostgreSQL và cũng 40/40 trên hai instance RAM đặt trùng. Điều đó dạy gì?'],
      ['Contract checks validate shapes, not truth — behaviour tests catch double bookings', 'The drift checker has a bug and should be removed from CI', 'Double bookings are allowed by the OpenAPI contract of LabFlow', 'RAM and PostgreSQL stores are interchangeable in production'],
      ['A 201 for Bình’s duplicate slot matches the schema perfectly. 12.3’s tests check what happened.', 'Câu 201 cho khung giờ trùng của Bình khớp lược đồ hoàn hảo. Test của 12.3 kiểm chuyện gì đã xảy ra.']),
  ],
  goiY: [['Ask what work each request does in each store.', 'Hỏi: mỗi request làm việc gì trong mỗi kho.'], ['A number without its conditions is not evidence.', 'Một con số thiếu điều kiện đo không phải bằng chứng.']],
  loi: [['Publishing one run as “the” number.', 'Công bố một lần đo như con số “chuẩn”.'], ['Expecting two instances on one laptop to double throughput.', 'Mong hai instance trên một máy gấp đôi thông lượng.']],
  tns: [tn('throughput', 'thông lượng'), tn('load average', 'tải trung bình'), tn('behaviour test', 'test hành vi')],
  kn: ['performance', 'testing'],
});

function speedupRange(before, after) {
  const r = before.map((b, i) => after[i] / b);
  const f = (x) => Math.round(x * 10) / 10;
  return [f(Math.min(...r)), f(Math.max(...r))];
}
const E2 = jsBai({
  ten: 'Load 2 — Write speedupRange(before, after): honest ratios', kho: 'MEDIUM', phut: 10,
  en: `<p>Each array holds one throughput per round, paired by index. Return <code>[min, max]</code> of <code>after[i] / before[i]</code>, each rounded to one decimal. Below 1 means slower.</p>`,
  vi: `<p>Mỗi mảng chứa một thông lượng cho mỗi lượt, ghép theo chỉ số. Trả <code>[min, max]</code> của <code>after[i] / before[i]</code>, mỗi số làm tròn một chữ số lẻ. Dưới 1 là chậm hơn.</p>`,
  dauVao: ['before, after — number[] of equal length', 'before, after — mảng số cùng độ dài'], dauRa: ['[number, number]', '[số, số]'],
  goiY: [['Pair round 1 with round 1, never best with best.', 'Ghép lượt 1 với lượt 1, đừng ghép tốt nhất với tốt nhất.'], ['Math.round(x * 10) / 10 rounds to one decimal.', 'Math.round(x * 10) / 10 làm tròn một chữ số lẻ.']],
  loi: [['Comparing the best “after” with the worst “before”.', 'So “sau” tốt nhất với “trước” tệ nhất.'], ['Averaging first and hiding the spread.', 'Lấy trung bình trước rồi giấu biên độ.']],
  gt: ['12.6, An’s list: RAM 1,734 · 1,910, PostgreSQL 2,798 · 2,593 ⇒ 1.4–1.6×; Lan’s list 1.7–2.2× — published together as 1.4–2.2×.', '12.6, danh sách của An: RAM 1.734 · 1.910, PostgreSQL 2.798 · 2.593 ⇒ 1,4–1,6 lần; của Lan 1,7–2,2 lần — công bố chung là 1,4–2,2 lần.'],
  kn: ['performance'], tns: [tn('speed-up', 'hệ số tăng tốc')],
  dau: `/** paired speed-up range */
function speedupRange(before, after) {
  // Write your solution here
  const r = Math.max(...after) / Math.min(...before);
  return [Math.round(r * 10) / 10, Math.round(r * 10) / 10];
}
`,
  giai: '// Reference solution\n' + nguon(speedupRange),
  cases: [
    { goi: goi('speedupRange', [1734, 1910], [2798, 2593]), moTa: ['An’s list, rounds 1 and 3', 'Danh sách của An, lượt 1 và 3'] },
    { goi: goi('speedupRange', [7851, 8091], [5549, 5093]), moTa: ['Labs list — slower', 'Danh sách phòng — chậm hơn'] },
    { goi: goi('speedupRange', [644, 621], [2028, 1705]), an: true },
    { goi: goi('speedupRange', [1318], [2865]), an: true },
  ],
});

function changeKind(c) {
  if (c.change === 'remove-field') return c.dir === 'res' ? 'breaking' : 'warn';
  if (c.change === 'add-required') return c.dir === 'req' ? 'breaking' : 'safe';
  if (c.change === 'add-enum-value') return c.dir === 'res' ? 'warn' : 'safe';
  if (c.change === 'add-optional' || c.change === 'add-error-response' || c.change === 'add-header') return 'safe';
  if (c.change === 'change-type') return 'breaking';
  return 'review';
}
const E3 = jsBai({
  ten: 'Load 3 — Write changeKind(change): is 2.4.0 safe?', kho: 'MEDIUM', phut: 12,
  en: `<p>A pocket version of <code>openapi/diff.mjs</code>. <code>change = { dir: 'req' | 'res', change }</code>. Return <code>'breaking'</code>, <code>'warn'</code>, <code>'safe'</code> or <code>'review'</code>: removing a field breaks responses (warn for requests); a new <b>required</b> field breaks requests (safe in responses); a new enum value is a warning in responses, safe in requests; a new optional field, a new error response or a new header are safe; changing a type breaks; anything else needs review.</p>`,
  vi: `<p>Bản bỏ túi của <code>openapi/diff.mjs</code>. <code>change = { dir: 'req' | 'res', change }</code>. Trả <code>'breaking'</code>, <code>'warn'</code>, <code>'safe'</code> hoặc <code>'review'</code>: bỏ trường phá vỡ câu trả lời (cảnh báo với request); trường <b>bắt buộc</b> mới phá vỡ request (an toàn trong câu trả lời); giá trị enum mới là cảnh báo trong câu trả lời, an toàn trong request; trường tuỳ chọn mới, câu trả lời lỗi mới hay header mới là an toàn; đổi kiểu thì phá vỡ; còn lại cần xem xét.</p>`,
  dauVao: ['change — { dir, change }', 'change — { dir, change }'], dauRa: ['string', 'chuỗi'],
  goiY: [['The same change has opposite rules for what clients send and receive.', 'Cùng một thay đổi có luật ngược nhau cho thứ client gửi và nhận.'], ['2.4.0 added X-Request-Id and 503 responses.', '2.4.0 thêm X-Request-Id và câu trả lời 503.']],
  loi: [['Treating every addition as safe (enum values in responses!).', 'Coi mọi thứ thêm vào là an toàn (giá trị enum trong câu trả lời!).'], ['Treating a new required request field as additive.', 'Coi trường bắt buộc mới trong request là thêm vào an toàn.']],
  gt: ['Rules of 4.1 and 7.4. The 2.3.0 ⇒ 2.4.0 diff printed “no breaking change”: an added header and added 503 responses are safe; clients must still handle the 503.', 'Luật của 4.1 và 7.4. Diff 2.3.0 ⇒ 2.4.0 in “không có thay đổi phá vỡ”: header mới và câu 503 mới là an toàn; client vẫn phải xử lý 503.'],
  kn: ['versioning', 'openapi'], tns: [tn('breaking change', 'thay đổi phá vỡ'), tn('additive change', 'thay đổi thêm vào')],
  dau: `/** classify one contract change */
function changeKind(c) {
  // Write your solution here
  return c.change.startsWith('add') ? 'safe' : 'breaking';
}
`,
  giai: '// Reference solution\n' + nguon(changeKind),
  cases: [
    { goi: goi('changeKind', { dir: 'res', change: 'add-header' }), moTa: ['X-Request-Id', 'X-Request-Id'] },
    { goi: goi('changeKind', { dir: 'res', change: 'add-enum-value' }), moTa: ['CHECKED_IN for old clients', 'CHECKED_IN cho client cũ'] },
    { goi: goi('changeKind', { dir: 'req', change: 'add-required' }), an: true },
    { goi: goi('changeKind', { dir: 'res', change: 'add-error-response' }), an: true },
    { goi: goi('changeKind', { dir: 'req', change: 'remove-field' }), an: true },
    { goi: goi('changeKind', { dir: 'res', change: 'rename-path' }), an: true },
  ],
});

export default doiDau({ slug: 'api-12-6-do-tai', ten: '12.6 Re-measuring the load, and the final contract', khoa: KHOA, baiHoc: 'api-12-6-do-tai', de: [E1, E2, E3] });
