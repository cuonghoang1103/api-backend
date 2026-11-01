/** API Design · 8.1 — Ngân sách độ trễ: bảng độ trễ tự đo, phân vị, đọc header Server-Timing (output thật bài 8.1). */
import { doiDau, KHOA, cs, q, tn, jsBai, nguon, goi } from './_api.mjs';

const E1 = cs({
  ten: 'Latency 1 — Orders of magnitude on LabFlow', kho: 'EASY', phut: 8,
  en: 'Facts from the latency table measured in lesson 8.1 (Node 22, PostgreSQL 18, one laptop).',
  vi: 'Những điều từ bảng độ trễ đo ở bài 8.1 (Node 22, PostgreSQL 18, một laptop).',
  cau: [
    q('c1', ['Server-Timing on login said validate;dur=0.11, scrypt;dur=31.19, total;dur=32.00. What is the biggest leg?', 'Server-Timing của đăng nhập ghi validate;dur=0.11, scrypt;dur=31.19, total;dur=32.00. Chặng lớn nhất là gì?'],
      ['scrypt — 97% of the request', 'validate — it runs on every request', 'The network, because total is larger than scrypt', 'JSON serialisation, which Server-Timing does not show'],
      ['31.19 of 32.00 ms. Optimising anything else in login is pointless; scrypt is slow on purpose (6.1).', '31,19 trong 32,00 ms. Tối ưu thứ khác trong đăng nhập là vô ích; scrypt cố ý chậm (6.1).']),
    q('c2', ['A home screen calls 5 endpoints in parallel; each is slow 1% of the time. About how many screen loads are slow?', 'Màn hình chính gọi song song 5 endpoint; mỗi cái chậm 1% số lần. Khoảng bao nhiêu lần mở màn hình bị chậm?'],
      ['About 4.9% (1 − 0.99⁵)', 'Exactly 1%, the same as each endpoint', 'About 0.2% (1% ÷ 5)', '5% exactly, because 5 × 1%'],
      ['The screen is slow when ANY call is slow: 1 − 0.99⁵ ≈ 4.9%. That is why APIs promise p99, not averages.', 'Màn hình chậm khi BẤT KỲ lời gọi nào chậm: 1 − 0,99⁵ ≈ 4,9%. Vì thế API hứa theo p99, không theo trung bình.']),
    q('c3', ['Which measured number is the most expensive single step?', 'Số đo nào là bước đơn lẻ đắt nhất?'],
      ['A first request to a far server (DNS + TCP + TLS): 197 ms', 'A PostgreSQL primary-key query: 110 µs', 'Signing a JWT with HMAC: 2 µs', 'Filtering 10,000 bookings in RAM: 82 µs'],
      ['New connections are expensive: 197 ms vs 37 ms on a reused connection — open them early and keep them alive.', 'Kết nối mới thì đắt: 197 ms so với 37 ms trên kết nối dùng lại — mở sớm và giữ sống.']),
  ],
  goiY: [['Compare units first: ns, µs, ms.', 'So đơn vị trước: ns, µs, ms.'], ['A screen is as slow as its slowest call.', 'Một màn hình chậm như lời gọi chậm nhất của nó.']],
  loi: [['Reading µs as ms.', 'Đọc µs thành ms.'], ['Averaging percentiles across calls.', 'Lấy trung bình các phân vị của nhiều lời gọi.']],
  tns: [tn('percentile', 'phân vị'), tn('Server-Timing', 'header báo thời gian từng bước ở server')],
  kn: ['latency'],
});

function percentile(samples, p) {
  if (samples.length === 0) return null;
  const s = [...samples].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.floor(s.length * p))];
}
const E2 = jsBai({
  ten: 'Latency 2 — Write percentile(samples, p)', kho: 'EASY', phut: 10,
  en: `<p>Return the p-th percentile of a list of times, exactly as LabFlow’s perf scripts do: sort a <em>copy</em> ascending, take the element at index <code>floor(n × p)</code>, but never past the last element. <code>p</code> is a fraction (0.5 = median, 0.99 = p99). Empty list ⇒ <code>null</code>.</p>`,
  vi: `<p>Trả về phân vị thứ p của một danh sách thời gian, đúng như các script perf của LabFlow: sắp một <em>bản sao</em> tăng dần, lấy phần tử ở chỉ số <code>floor(n × p)</code>, nhưng không vượt quá phần tử cuối. <code>p</code> là phân số (0.5 = median, 0.99 = p99). Danh sách rỗng ⇒ <code>null</code>.</p>`,
  dauVao: ['samples — number[] (ms); p — number in [0, 1]', 'samples — number[] (ms); p — số trong [0, 1]'],
  dauRa: ['a number from samples, or null', 'một số trong samples, hoặc null'],
  goiY: [['sort() without a compare function sorts numbers as text.', 'sort() không có hàm so sánh sắp số như chuỗi.'], ['Copy before sorting: [...samples].', 'Sao chép trước khi sắp: [...samples].']],
  loi: [['Returning the average instead of a percentile.', 'Trả trung bình thay vì phân vị.'], ['Index n × p without the cap ⇒ undefined at p = 1.', 'Chỉ số n × p không chặn ⇒ undefined khi p = 1.']],
  gt: ['Sorted [1, 2, 3, 1000] at p = 0.5 gives index 2 ⇒ 3; the average would be 251.5, a number no request had.', 'Sắp [1, 2, 3, 1000] với p = 0.5 cho chỉ số 2 ⇒ 3; trung bình là 251,5, con số không request nào có.'],
  kn: ['latency', 'percentile'],
  tns: [tn('median (p50)', 'trung vị'), tn('tail latency', 'độ trễ phần đuôi')],
  dau: `/** p-th percentile of response times (p is a fraction) */
function percentile(samples, p) {
  // Write your solution here
  return samples.reduce((a, b) => a + b, 0) / samples.length;
}
`,
  giai: '// Reference solution\n' + nguon(percentile),
  cases: [
    { goi: goi('percentile', [3, 1, 1000, 2], 0.5), moTa: ['The average would lie', 'Trung bình sẽ nói dối'] },
    { goi: goi('percentile', [5, 9, 1, 7, 3], 0.99), moTa: ['p99 of five samples', 'p99 của năm mẫu'] },
    { goi: goi('percentile', [], 0.5), an: true },
    { goi: goi('percentile', [10, 2, 33, 4, 5, 6, 7, 8, 9, 100], 1), an: true },
    { goi: goi('percentile', [100, 25, 9], 0), an: true },
  ],
});

function parseServerTiming(header) {
  const out = {};
  if (!header) return out;
  for (const metric of header.split(',')) {
    const [name, ...params] = metric.split(';').map((x) => x.trim());
    if (!name) continue;
    let dur = null;
    for (const p of params) {
      const [k, v] = p.split('=').map((x) => x.trim());
      if (k.toLowerCase() === 'dur' && v !== undefined && v !== '' && Number.isFinite(Number(v))) dur = Number(v);
    }
    out[name] = dur;
  }
  return out;
}
const E3 = jsBai({
  ten: 'Latency 3 — Write parseServerTiming(header)', kho: 'MEDIUM', phut: 15,
  en: `<p>Turn a <code>Server-Timing</code> header into an object <code>{ name: dur }</code>. Metrics are separated by commas; inside a metric, parameters are separated by <code>;</code>. Keep only <code>dur</code> (as a number; the parameter name is case-insensitive). A metric without a valid <code>dur</code> maps to <code>null</code>; <code>desc</code> and other parameters are ignored. Spaces around parts are allowed. Empty or missing header ⇒ <code>{}</code>.</p>`,
  vi: `<p>Đổi header <code>Server-Timing</code> thành object <code>{ tên: dur }</code>. Các metric cách nhau bởi dấu phẩy; trong một metric, tham số cách nhau bởi <code>;</code>. Chỉ giữ <code>dur</code> (dạng số; tên tham số không phân biệt hoa thường). Metric không có <code>dur</code> hợp lệ ⇒ <code>null</code>; <code>desc</code> và tham số khác bỏ qua. Cho phép khoảng trắng quanh các phần. Header rỗng hoặc thiếu ⇒ <code>{}</code>.</p>`,
  dauVao: ['header — string | undefined', 'header — chuỗi | undefined'],
  dauRa: ['object name ⇒ number | null', 'object tên ⇒ số | null'],
  goiY: [['split(",") then split(";") then split("=").', 'split(",") rồi split(";") rồi split("=").'], ['Number("abc") is NaN — check with Number.isFinite.', 'Number("abc") là NaN — kiểm bằng Number.isFinite.']],
  loi: [['Keeping dur as a string "31.19".', 'Giữ dur dạng chuỗi "31.19".'], ['Assuming dur is always the second part — desc may come first.', 'Coi dur luôn ở vị trí thứ hai — desc có thể đứng trước.']],
  gt: ['Lesson 8.1’s login header becomes { validate: 0.11, scrypt: 31.19, total: 32 } — and a dashboard can now say “scrypt is 97% of login”.', 'Header đăng nhập ở bài 8.1 thành { validate: 0.11, scrypt: 31.19, total: 32 } — và một bảng theo dõi giờ nói được “scrypt chiếm 97% đăng nhập”.'],
  kn: ['HTTP', 'observability'],
  tns: [tn('Server-Timing', 'header thời gian phía server'), tn('metric', 'một số đo có tên')],
  dau: `/** Server-Timing header ⇒ { name: dur } */
function parseServerTiming(header) {
  // Write your solution here
  const out = {};
  for (const m of header.split(', ')) { const [n, d] = m.split(';dur='); out[n] = d; }
  return out;
}
`,
  giai: '// Reference solution\n' + nguon(parseServerTiming),
  cases: [
    { goi: goi('parseServerTiming', 'validate;dur=0.11, scrypt;dur=31.19, total;dur=32.00'), moTa: ['Login in lesson 8.1', 'Đăng nhập ở bài 8.1'] },
    { goi: goi('parseServerTiming', 'cache;desc="Cache Read";dur=23.2, missedCache'), moTa: ['desc first; a metric without dur', 'desc đứng trước; metric không có dur'] },
    { goi: goi('parseServerTiming', ''), an: true },
    { goi: goi('parseServerTiming', ' db ; DUR=3.2 ,total;dur=4.79'), an: true },
    { goi: goi('parseServerTiming', 'auth;dur=abc'), an: true },
  ],
});

export default doiDau({ slug: 'api-8-1-so-lieu', ten: '8.1 Latency budgets for an API call', khoa: KHOA, baiHoc: 'api-8-1-so-lieu', de: [E1, E2, E3] });
