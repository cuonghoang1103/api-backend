/** Node.js 15.3 — Log tốn bao nhiêu (byte × lưu lượng × thời hạn × bản sao), tìm một dòng trong một triệu, p95 mù, lấy mẫu theo request id. */
import { modul, cs, q, qn, tn, jsBai, nguon, goi } from './_node-c15-18.mjs';

const E1 = cs({
  ten: 'What a log line costs, and what a percentile cannot see', kho: 'EASY', phut: 7,
  en: 'Questions on lesson 15.3: compression, grep vs jq, the blind p95, sampling and levels, rotation.',
  vi: 'Câu hỏi về bài 15.3: nén, grep vs jq, p95 mù, lấy mẫu và cấp độ, xoay vòng log.',
  cau: [
    q('c1', ['/api/v1/feed has p95 = 114.2 ms, like every other route, and max = 8,241 ms. What does the p95 tell you about that 8-second request?', '/api/v1/feed có p95 = 114,2 ms như mọi route khác, và max = 8.241 ms. p95 cho bạn biết gì về request 8 giây đó?'],
      ['Nothing: one request in 250,000 is far beyond the 95th percentile, by design', 'That it was caused by the network, because the server-side p95 stayed healthy', 'That it never happened, because a real outlier always moves the p95 a little', 'That the route is broken, because p95 and max must be within 10× of each other'],
      ['Percentiles are designed to hide outliers — that makes them stable, and blind. Alert on percentiles, investigate with max.', 'Bách phân vị được thiết kế để giấu ngoại lệ — nhờ thế mà ổn định, và mù. Cảnh báo theo bách phân vị, điều tra bằng max.']),
    q('c2', ['Sampling 1% with Math.random() < 0.01 per LINE kept the same number of bytes as hashing the request id. Why is it still worse?', 'Lấy mẫu 1% bằng Math.random() < 0.01 cho mỗi DÒNG giữ số byte bằng cách băm request id. Vì sao vẫn tệ hơn?'],
      ['It keeps scattered fragments of every request, so no kept request is a complete story', 'Math.random() is slow, so it costs more CPU than the logging it saves', 'It drops every 5xx line, because errors are rarer than one in a hundred', 'Two lines of the same request always get the same random number in Node'],
      ['Hash a value identical on every line of the request and in every process — the request id — so a request is entirely in or entirely out.', 'Băm một giá trị giống nhau trên mọi dòng của request và ở mọi tiến trình — request id — để một request hoặc vào trọn hoặc ra trọn.']),
    q('c3', ['Which log level fits “refresh token expired, the client got 401 and logged in again”?', 'Cấp độ log nào hợp với “refresh token hết hạn, client nhận 401 rồi đăng nhập lại”?'],
      ['Not error: it is routine, handled, and nobody has to act on it', 'error: every 4xx response is an error by definition of HTTP', 'error: security events must always be at the highest level', 'fatal: authentication problems should wake the on-call engineer'],
      ['error means someone has to act. An error nobody acts on trains everyone to ignore errors; within a month a real outage scrolls past unnoticed.', 'error nghĩa là có người phải hành động. Một error không ai xử lý dạy mọi người lờ error đi; trong một tháng, sự cố thật trôi qua không ai thấy.']),
    q('c4', ['A container printed 100,000 lines with --log-opt max-size=1m --log-opt max-file=2. What did docker logs show?', 'Một container in 100.000 dòng với --log-opt max-size=1m --log-opt max-file=2. docker logs hiện gì?'],
      ['Only 12,492 lines (87,509 → 100,000); the rest rotated away silently', 'All 100,000 lines, because docker logs reads from the image layer', 'An error “log file full”, and the container stopped writing to stdout', 'The first 12,492 lines; newer lines are dropped once the cap is reached'],
      ['Rotation protects the disk; shipping the logs elsewhere protects history. You need both.', 'Xoay vòng bảo vệ ổ đĩa; chuyển log đi nơi khác bảo vệ lịch sử. Cần cả hai.']),
    qn('c5', ['Which statements match the lesson’s numbers? (choose all that apply)', 'Những câu nào khớp số liệu của bài? (chọn mọi câu đúng)'],
      ['The fattest line (pino-http default, 642 B) compressed best, 18.3×', 'grep -F found the request id in 1.66 s, jq needed 3.06 s', 'Retention can be shortened later and it also applies to old data', 'Compact JSON costs about 5× the bytes of the plain string line'],
      [0, 1, 2],
      ['Structure costs about 21% (121 B → 147 B). Never estimate the bill from raw size; grep cuts, jq decides; retention is the knob you can turn later.', 'Cấu trúc tốn khoảng 21% (121 B → 147 B). Đừng ước hoá đơn từ kích thước thô; grep để lọc, jq để quyết; thời hạn lưu là núm vặn chỉnh được về sau.']),
  ],
  goiY: [['One bad request in 250,000 is the 99.9996th percentile.', 'Một request tệ trên 250.000 là bách phân vị 99,9996.'], ['Ask of each sampling scheme: is a kept request still complete?', 'Hỏi mỗi cách lấy mẫu: request được giữ có còn trọn vẹn không?']],
  loi: [['Concluding “everything is fine” from a healthy p95 alone.', 'Kết luận “mọi thứ ổn” chỉ từ một p95 khoẻ.'], ['Raising the level to warn to log less — and losing the info lines around the error.', 'Nâng cấp độ lên warn để log ít đi — và mất các dòng info quanh lỗi.']],
  tns: [tn('retention', 'thời hạn lưu'), tn('sampling', 'lấy mẫu', 'keep only part of the normal traffic'), tn('rotation', 'xoay vòng log', 'cap the file size, drop the oldest')],
  kn: ['logging', 'percentiles', 'sampling'],
});

function logBill(bytesPerLine, rps, retentionDays, replicas) {
  // Byte mỗi dòng × request/giây × 86.400 giây = byte mỗi ngày; GB/TB thập phân (10^9 / 10^12) như bài học.
  const perDay = bytesPerLine * rps * 86400;
  const round2 = (x) => Math.round(x * 100) / 100;
  return {
    perDayGB: round2(perDay / 1e9),
    storedTB: round2((perDay * retentionDays * replicas) / 1e12),   // trước khi nén
  };
}
const E2 = await jsBai({
  ten: 'logBill(bytesPerLine, rps, retentionDays, replicas): the multiplier nobody budgets for', kho: 'EASY', phut: 6,
  en: '<p>The cost of a log line is <b>bytes per line × traffic × retention × replicas</b>. Write <code>logBill(bytesPerLine, rps, retentionDays, replicas)</code> (one line per request) returning <code>{ perDayGB, storedTB }</code>: raw (uncompressed) GB per day, and the TB kept in the store after <code>retentionDays</code> with <code>replicas</code> copies. Use decimal units (1 GB = 10<sup>9</sup> B, 1 TB = 10<sup>12</sup> B) and round each to 2 decimals.</p>',
  vi: '<p>Giá của một dòng log là <b>byte mỗi dòng × lưu lượng × thời hạn lưu × số bản sao</b>. Viết <code>logBill(bytesPerLine, rps, retentionDays, replicas)</code> (mỗi request một dòng) trả về <code>{ perDayGB, storedTB }</code>: GB thô (chưa nén) mỗi ngày, và số TB nằm trong kho sau <code>retentionDays</code> ngày với <code>replicas</code> bản sao. Dùng đơn vị thập phân (1 GB = 10<sup>9</sup> B, 1 TB = 10<sup>12</sup> B) và làm tròn mỗi số tới 2 chữ số thập phân.</p>',
  goiY: [['A day has 86,400 seconds.', 'Một ngày có 86.400 giây.'], ['Math.round(x * 100) / 100 rounds to two decimals.', 'Math.round(x * 100) / 100 làm tròn hai chữ số thập phân.']],
  loi: [['Forgetting the replicas: a 3-replica store keeps every byte three times.', 'Quên số bản sao: kho 3 bản sao giữ mỗi byte ba lần.'], ['Using 1024-based units while the lesson (and most invoices) count in powers of ten.', 'Dùng đơn vị cơ số 1024 trong khi bài (và đa số hoá đơn) tính theo luỹ thừa 10.']],
  gt: ['486 B × 1,000 req/s × 86,400 s ≈ 42 GB a day before compression: the pino-http default is a decision with a price. The bill arrives months after the field was added, so do this arithmetic while you are still deciding.', '486 B × 1.000 req/s × 86.400 s ≈ 42 GB mỗi ngày trước khi nén: mặc định của pino-http là một quyết định có giá. Hoá đơn tới vài tháng sau khi thêm trường, nên hãy làm phép tính này lúc còn đang quyết định.'],
  kn: ['logging', 'capacity planning'],
  tns: [tn('replica', 'bản sao'), tn('raw size', 'kích thước thô', 'before compression')],
  dau: `/** raw GB per day and TB stored */
function logBill(bytesPerLine, rps, retentionDays, replicas) {
  // Write your solution here
  const perDay = bytesPerLine * rps * 86400;
  return { perDayGB: perDay / 1e9, storedTB: perDay * retentionDays / 1e12 };
}
`,
  giai: '// Reference solution\n' + nguon(logBill),
  cases: [
    { goi: goi('logBill', 247, 300, 30, 2), moTa: ['The lesson’s exercise: 247 B, 300 req/s, 30 days, 2 replicas', 'Bài tập của bài: 247 B, 300 req/s, 30 ngày, 2 bản sao'] },
    { goi: goi('logBill', 486, 1000, 1, 1), moTa: ['pino-http default at 1,000 req/s', 'Mặc định pino-http ở 1.000 req/s'] },
    { goi: goi('logBill', 121, 1000, 90, 3), an: true },
    { goi: goi('logBill', 642, 50, 7, 1), an: true },
  ],
});

function slowRequests(lines, ms) {
  // Mỗi dòng là một bản ghi JSON — hỏi bằng KIỂU DỮ LIỆU, không bằng regex trên chữ.
  const ids = [];
  for (const line of lines) {
    let r;
    try { r = JSON.parse(line); } catch { continue; }       // dòng hỏng / chữ thuần: bỏ qua, đừng làm chết cả lượt tìm
    if (r && typeof r.durationMs === 'number' && r.durationMs > ms) ids.push(r.requestId);
  }
  return ids;
}
const LINES = [
  '{"time":"02:14:07.101","requestId":"r1","url":"/api/v1/feed","status":200,"durationMs":114}',
  '{"time":"02:14:07.140","requestId":"r2","url":"/api/v1/feed","status":500,"durationMs":8241}',
  'GET /api/v1/notes 200 duration=1234ms',
  '{"time":"02:14:07.190","requestId":"r3","url":"/api/v1/notes","status":200,"durationMs":1000}',
  '{"time":"02:14:07.230","requestId":"r4","url":"/api/v1/notes","status":200,"durationMs":1001}',
];
const E3 = await jsBai({
  ten: 'slowRequests(lines, ms): “every request slower than 1000 ms” as a question, not a regex', kho: 'MEDIUM', phut: 10,
  en: '<p><code>lines</code> are raw lines of a log file. Most are JSON records <code>{ time, requestId, url, status, durationMs }</code>; a few are old plain-text lines or broken JSON. Return the <code>requestId</code> of every JSON record whose <code>durationMs</code> is a <b>number strictly greater</b> than <code>ms</code>, in file order. Skip any line that is not valid JSON, and records whose <code>durationMs</code> is not a number.</p>',
  vi: '<p><code>lines</code> là các dòng thô của một file log. Đa số là bản ghi JSON <code>{ time, requestId, url, status, durationMs }</code>; vài dòng là chữ thuần kiểu cũ hoặc JSON hỏng. Trả về <code>requestId</code> của mọi bản ghi JSON có <code>durationMs</code> là <b>số lớn hơn hẳn</b> <code>ms</code>, theo thứ tự trong file. Bỏ qua dòng không phải JSON hợp lệ, và bản ghi có <code>durationMs</code> không phải số.</p>',
  goiY: [['Wrap JSON.parse in try/catch and continue on failure.', 'Bọc JSON.parse trong try/catch và bỏ qua khi lỗi.'], ['Check typeof r.durationMs === "number" before comparing — "1500" > 1000 is true in JavaScript.', 'Kiểm typeof r.durationMs === "number" trước khi so — "1500" > 1000 là true trong JavaScript.']],
  loi: [['A regex for “a number above 1000” (\\d{4,}) also matches exactly 1000 and breaks the day the field is renamed or reformatted.', 'Regex cho “số lớn hơn 1000” (\\d{4,}) khớp cả đúng 1000 và vỡ vào ngày trường bị đổi tên hay đổi định dạng.'], ['Letting one broken line throw and abort the whole search.', 'Để một dòng hỏng ném lỗi làm hỏng cả lượt tìm.']],
  gt: ['With text, “slower than 1000 ms” cannot really be expressed; with JSON it is .durationMs > 1000, a typed number compared as a number. That question is what the ~21% extra bytes of structure buy.', 'Với chữ thuần, “chậm hơn 1000 ms” gần như không diễn đạt được; với JSON nó là .durationMs > 1000, một số có kiểu được so như số. Câu hỏi đó là thứ ~21% byte thêm của cấu trúc mua được.'],
  kn: ['logging', 'JSON'],
  tns: [tn('typed field', 'trường có kiểu'), tn('JSON lines', 'JSON lines', 'one JSON object per line')],
  dau: `/** request ids slower than ms */
function slowRequests(lines, ms) {
  // Write your solution here
  const ids = [];
  for (const line of lines) {
    const m = /"durationMs":(\\d{4,})/.exec(line);
    if (m) ids.push(JSON.parse(line).requestId);
  }
  return ids;
}
`,
  giai: '// Reference solution\n' + nguon(slowRequests),
  cases: [
    { goi: goi('slowRequests', LINES, 1000), moTa: ['Mixed lines, threshold 1000 ms', 'Dòng trộn lẫn, ngưỡng 1000 ms'] },
    { goi: goi('slowRequests', LINES, 100), moTa: ['Threshold 100 ms', 'Ngưỡng 100 ms'] },
    { goi: goi('slowRequests', [...LINES, '{"requestId":"r5","durationMs":"1500"}', '{"requestId":"r6",', '{"requestId":"r7","durationMs":15000}'], 1000), an: true },
    { goi: goi('slowRequests', [], 1000), an: true },
    { goi: goi('slowRequests', ['{"requestId":"q","durationMs":999}', '{"requestId":"w","durationMs":12345}'], 999), an: true },
  ],
});

function routeStats(records) {
  // Nhóm theo url, rồi tính n, p50, p95, max — bách phân vị theo "hạng gần nhất": sắp tăng, lấy phần tử thứ ceil(p·n).
  const groups = {};
  for (const r of records) (groups[r.url] ||= []).push(r.durationMs);
  const out = {};
  for (const [url, ds] of Object.entries(groups)) {
    const s = [...ds].sort((a, b) => a - b);                      // so SỐ — sort() mặc định so chữ: 1000 < 200
    const pct = (p) => s[Math.ceil((p / 100) * s.length) - 1];
    out[url] = { n: s.length, p50: pct(50), p95: pct(95), max: s[s.length - 1] };
  }
  return out;
}
const mk = (url, ds) => ds.map((d, i) => ({ requestId: `${url}#${i}`, url, durationMs: d }));
const FEED = mk('/api/v1/feed', [90, 95, 100, 101, 102, 104, 105, 107, 108, 110, 111, 112, 113, 114, 114, 115, 117, 120, 8241, 99]);
const E4 = await jsBai({
  ten: 'routeStats(records): n, p50, p95 and max per URL — the log file as a database', kho: 'MEDIUM', phut: 14,
  en: '<p>Because every line is a typed record, one jq expression grouped a million lines by URL. Do the same: <code>records</code> are <code>{ requestId, url, durationMs }</code>. Return an object keyed by <code>url</code> with <code>{ n, p50, p95, max }</code>. Use the <b>nearest-rank</b> percentile: sort the durations ascending (as numbers); p<sub>k</sub> is the element at position <code>ceil(k/100 × n)</code> counting from 1.</p>',
  vi: '<p>Vì mỗi dòng là một bản ghi có kiểu, một biểu thức jq đã nhóm một triệu dòng theo URL. Hãy làm y vậy: <code>records</code> là <code>{ requestId, url, durationMs }</code>. Trả về object khoá theo <code>url</code> với <code>{ n, p50, p95, max }</code>. Dùng bách phân vị <b>hạng gần nhất</b>: sắp thời lượng tăng dần (theo số); p<sub>k</sub> là phần tử ở vị trí <code>ceil(k/100 × n)</code> tính từ 1.</p>',
  goiY: [['Group first: (groups[url] ||= []).push(durationMs).', 'Nhóm trước: (groups[url] ||= []).push(durationMs).'], ['Index in a 0-based array: Math.ceil(k / 100 * n) - 1. Sort with (a, b) => a - b.', 'Chỉ số trong mảng đếm từ 0: Math.ceil(k / 100 * n) - 1. Sắp bằng (a, b) => a - b.']],
  loi: [['Using .sort() without a comparator: it sorts as strings, so 8241 comes before 90.', 'Dùng .sort() không có hàm so sánh: nó sắp như chuỗi, nên 8241 đứng trước 90.'], ['Reporting the average: one 8,241 ms request drags the mean up while p95 stays put — two different lies.', 'Báo cáo trung bình: một request 8.241 ms kéo trung bình lên trong khi p95 đứng yên — hai kiểu nói dối khác nhau.']],
  gt: ['Run it on the feed sample: p95 is 120 ms while max is 8,241 ms. The percentile is stable precisely because it ignores the tail, so it can alert you, but only max (and the log line behind it) can tell you a user waited eight seconds.', 'Chạy trên mẫu feed: p95 là 120 ms trong khi max là 8.241 ms. Bách phân vị ổn định chính vì nó bỏ qua phần đuôi, nên nó cảnh báo được, nhưng chỉ max (và dòng log đằng sau) mới cho biết một người dùng đã chờ tám giây.'],
  kn: ['percentiles', 'grouping'],
  tns: [tn('p50 / median', 'trung vị', 'half the requests were faster'), tn('p95', 'bách phân vị 95', '95% of requests were faster than this'), tn('nearest rank', 'hạng gần nhất')],
  dau: `/** per-URL n, p50, p95, max */
function routeStats(records) {
  // Write your solution here
  const out = {};
  for (const r of records) {
    const g = out[r.url] || (out[r.url] = { n: 0, p50: 0, p95: 0, max: 0, sum: 0 });
    g.n++; g.sum += r.durationMs; g.max = Math.max(g.max, r.durationMs);
  }
  for (const g of Object.values(out)) { g.p50 = g.p95 = g.sum / g.n; delete g.sum; }
  return out;
}
`,
  giai: '// Reference solution\n' + nguon(routeStats),
  cases: [
    { goi: goi('routeStats', FEED), moTa: ['20 feed requests, one of 8,241 ms', '20 request feed, một cái 8.241 ms'] },
    { goi: goi('routeStats', mk('/api/v1/notes', [30, 10, 20])), moTa: ['Three requests, unsorted input', 'Ba request, đầu vào chưa sắp'] },
    { goi: goi('routeStats', [...mk('/a', [5]), ...mk('/b', [1000, 200, 30, 4])]), an: true },
    { goi: goi('routeStats', []), an: true },
    { goi: goi('routeStats', mk('/c', [7, 7, 7, 7, 7, 7, 7, 7, 7, 900])), an: true },
  ],
});

function sampleLogs(records, rate) {
  // Giữ MỌI thứ bất thường (5xx, > 1000 ms) + một tỉ lệ `rate` của phần còn lại, chọn theo BĂM REQUEST ID
  // ⇒ mọi dòng của một request cùng một quyết định, ở mọi tiến trình (đúng hàm băm của bài).
  const keep = [];
  for (const r of records) {
    let h = 0;
    const s = r.requestId;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    const sampled = h % 10000 < rate * 10000;
    if (r.status >= 500 || r.durationMs > 1000 || sampled) keep.push(r);
  }
  return keep;
}
const REQS = [];
['mJumRwAigpAO', 'f360ef6b', '4a4c9b4c', 'jM3OZ73RMcKa', 'a1b2c3d4', 'zzzz0001', 'q9w8e7r6', 'n0t3s-42'].forEach((id, k) => {
  ['received', 'query', 'reply'].forEach((msg, j) => REQS.push({ requestId: id, time: `02:14:0${k}.${100 + j * 7}`, msg, status: k === 3 ? 500 : 200, durationMs: k === 5 ? 1800 : 40 + k }));
});
const E5 = await jsBai({
  ten: 'sampleLogs(records, rate): keep every incident, 1% of the rest, whole requests only', kho: 'HARD', phut: 18,
  en: '<p>Implement the sampler of the lesson. For each record <code>{ requestId, time, msg, status, durationMs }</code> compute the hash of <code>requestId</code> exactly as the lesson does:</p><pre>let h = 0;\nfor (let i = 0; i &lt; s.length; i++) h = (h * 31 + s.charCodeAt(i)) &gt;&gt;&gt; 0;\nconst sampled = (h % 10000) &lt; rate * 10000;</pre><p>Keep the record if <code>status &gt;= 500</code>, or <code>durationMs &gt; 1000</code>, or <code>sampled</code>. Return the kept records in their original order. Every line of a request must get the same decision.</p>',
  vi: '<p>Cài đặt bộ lấy mẫu của bài. Với mỗi bản ghi <code>{ requestId, time, msg, status, durationMs }</code> tính hàm băm của <code>requestId</code> đúng như bài:</p><pre>let h = 0;\nfor (let i = 0; i &lt; s.length; i++) h = (h * 31 + s.charCodeAt(i)) &gt;&gt;&gt; 0;\nconst sampled = (h % 10000) &lt; rate * 10000;</pre><p>Giữ bản ghi nếu <code>status &gt;= 500</code>, hoặc <code>durationMs &gt; 1000</code>, hoặc <code>sampled</code>. Trả về các bản ghi được giữ theo thứ tự ban đầu. Mọi dòng của một request phải nhận cùng một quyết định.</p>',
  goiY: [['The >>> 0 keeps h an unsigned 32-bit integer; without it h becomes a huge float and % gives different answers.', '>>> 0 giữ h là số nguyên 32 bit không dấu; thiếu nó h thành số thực khổng lồ và % cho kết quả khác.'], ['Hash r.requestId — not r.time, not a line counter, not Math.random().', 'Băm r.requestId — không phải r.time, không phải bộ đếm dòng, không phải Math.random().']],
  loi: [['Hashing the timestamp: each line has a different one, so you are back to orphan fragments.', 'Băm dấu thời gian: mỗi dòng một giá trị, nên lại quay về các mảnh vụn mồ côi.'], ['Sampling errors too: the one 500 of the night is exactly the line you must never drop.', 'Lấy mẫu cả lỗi: một lỗi 500 duy nhất trong đêm chính là dòng không bao giờ được bỏ.']],
  gt: ['On the lesson’s million lines this kept 1.00% of the bytes (100× smaller) and still kept 1/1 of the 5xx and 1/1 of the slow requests. The request id from 15.2 is what makes it possible: one id, two jobs — correlation and sampling.', 'Trên một triệu dòng của bài, cách này giữ 1,00% dung lượng (nhỏ hơn 100 lần) mà vẫn giữ 1/1 lỗi 5xx và 1/1 request chậm. Request id của bài 15.2 làm điều đó khả thi: một id, hai việc — nối dòng và lấy mẫu.'],
  kn: ['sampling', 'hashing', 'logging'],
  tns: [tn('deterministic', 'tất định', 'the same input always gives the same decision'), tn('head sampling', 'lấy mẫu từ đầu', 'decide per request, before looking at its lines')],
  dau: `/** keep incidents + a sample of normal requests */
function sampleLogs(records, rate) {
  // Write your solution here
  return records.filter((r) => {
    let h = 0;
    const s = r.time;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return r.status >= 500 || (h % 10000) < rate * 10000;
  });
}
`,
  giai: '// Reference solution\n' + nguon(sampleLogs),
  cases: [
    { goi: goi('sampleLogs', REQS, 0.3), moTa: ['8 requests × 3 lines, rate 30%', '8 request × 3 dòng, tỉ lệ 30%'] },
    { goi: `sampleLogs(${JSON.stringify(REQS)}, 0).map((r) => r.requestId + ":" + r.msg)`, moTa: ['rate 0: only the incidents survive', 'tỉ lệ 0: chỉ còn sự cố'] },
    { goi: `(() => { const k = sampleLogs(${JSON.stringify(REQS)}, 0.5); const per = {}; for (const r of k) per[r.requestId] = (per[r.requestId] || 0) + 1; return Object.values(per).every((n) => n === 3); })()`, an: true, moTa: ['Every kept request is complete', 'Mọi request được giữ đều trọn vẹn'] },
    { goi: `sampleLogs(${JSON.stringify(REQS)}, 1).length`, an: true },
    { goi: `sampleLogs(${JSON.stringify(REQS.map((r) => ({ ...r, requestId: r.requestId.toUpperCase() })))}, 0.3).map((r) => r.requestId)`, an: true },
  ],
});

export default modul('nodejs-15-3-chi-phi-va-tim-kiem', '15.3 Log cost, search, percentiles and sampling', [E1, E2, E3, E4, E5]);
