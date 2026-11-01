/** API Design · Lab 8 — Báo cáo dùng phòng: một lượt quét cho cùng câu trả lời, cache 60 s kèm Age (output thật Lab 8). */
import { doiDau, KHOA, cs, q, tn, jsBai, nguon, goi } from './_api.mjs';

const E1 = cs({
  ten: 'Lab 8 · 1 — Reading the measurements', kho: 'EASY', phut: 8,
  en: 'GET /v2/reports/usage?from=2026-11-02&days=30 with 20,000 seeded bookings, five managers in parallel (Lab 8).',
  vi: 'GET /v2/reports/usage?from=2026-11-02&days=30 với 20.000 lượt đặt mẫu, năm quản lý cùng lúc (Lab 8).',
  cau: [
    q('c1', ['The starter took 335 ms per report and the lab list’s p50 became 3.1 s. Why did the lab list suffer?', 'Bản khởi đầu tốn 335 ms mỗi báo cáo và p50 của danh sách phòng thành 3,1 giây. Vì sao danh sách phòng bị ảnh hưởng?'],
      ['The report loops synchronously 2.4 million times and holds the event loop', 'Both endpoints share the same rate limit', 'The report locks the bookings table in PostgreSQL', 'The proxy sends both to the same instance'],
      ['30 days × 4 labs × 20,000 bookings, each creating Date objects — the event loop is busy, everyone queues.', '30 ngày × 4 phòng × 20.000 lượt đặt, mỗi lần tạo đối tượng Date — event loop bận, mọi người xếp hàng.']),
    q('c2', ['Adding limitInflight(2) to the starter gave non-2xx 0 and no improvement. Why?', 'Thêm limitInflight(2) vào bản khởi đầu cho non-2xx 0 và không khá hơn. Vì sao?'],
      ['A synchronous handler finishes before the next request is read, so in-flight never exceeds one', 'The limit only works when it is set to 1, because 2 lets every request through', 'limitInflight only applies to POST routes, and the report is a GET request', 'autocannon ignores 503 answers and keeps counting them as 2xx responses'],
      ['Shedding protects work that waits (threadpool, database). Fix the blocking first.', 'Bỏ bớt tải bảo vệ việc có chờ (threadpool, CSDL). Gỡ chặn trước.']),
    q('c3', ['One pass gave 516 reports/s; adding a 60 s cache gave 4,532/s. Why fix the algorithm first?', 'Một lượt quét cho 516 báo cáo/s; thêm cache 60 s cho 4.532/s. Vì sao sửa thuật toán trước?'],
      ['A cache in front of the 335 ms version still freezes LabFlow on every miss (each new query, every minute)', 'Caches do not work on JSON bodies larger than 10 KB, so the report would never be cached', 'The cache would serve wrong numbers, because bookings change between two requests', 'The algorithm fix makes the cache unnecessary, so the cache is only added for the rubric'],
      ['A cache hides the cost only on hits; misses still pay it in full.', 'Cache chỉ giấu cái giá khi trúng; trượt vẫn trả đủ.']),
  ],
  goiY: [['Ask: does this work wait, or burn CPU?', 'Hỏi: việc này có chờ, hay đốt CPU?'], ['Look at the bystander, not only the report.', 'Nhìn người đứng ngoài, không chỉ báo cáo.']],
  loi: [['Adding a cache before fixing a blocking algorithm.', 'Thêm cache trước khi sửa thuật toán chặn luồng.'], ['Expecting load shedding to fix CPU-bound handlers.', 'Mong bỏ bớt tải chữa được handler tốn CPU.']],
  tns: [tn('bystander', 'người đứng ngoài bị ảnh hưởng'), tn('cache miss', 'trượt cache')],
  kn: ['performance'],
});

function usageReport(bookings, labIds, from, days) {
  const dayList = Array.from({ length: days }, (_, d) => new Date(Date.parse(from) + d * 86400000).toISOString().slice(0, 10));
  const cell = new Map();
  for (const day of dayList) for (const lab of labIds) cell.set(day + '|' + lab, { bookings: 0, hours: 0 });
  for (const b of bookings) {
    if (b.status === 'CANCELLED') continue;
    const c = cell.get(b.startAt.slice(0, 10) + '|' + b.labId);
    if (!c) continue;
    c.bookings++;
    c.hours += (Date.parse(b.endAt) - Date.parse(b.startAt)) / 3600000;
  }
  const rows = [];
  for (const day of dayList) for (const lab of labIds) rows.push({ day, labId: lab, ...cell.get(day + '|' + lab) });
  return rows;
}
const B = [
  { labId: 'lab_1', status: 'PENDING', startAt: '2026-11-02T00:00:00.000Z', endAt: '2026-11-02T02:00:00.000Z' },
  { labId: 'lab_1', status: 'CANCELLED', startAt: '2026-11-02T02:00:00.000Z', endAt: '2026-11-02T04:00:00.000Z' },
  { labId: 'lab_2', status: 'PENDING', startAt: '2026-11-02T04:00:00.000Z', endAt: '2026-11-02T05:30:00.000Z' },
  { labId: 'lab_1', status: 'PENDING', startAt: '2026-11-03T08:00:00.000Z', endAt: '2026-11-03T10:00:00.000Z' },
  { labId: 'lab_2', status: 'PENDING', startAt: '2026-10-31T08:00:00.000Z', endAt: '2026-10-31T10:00:00.000Z' },
];
const E2 = jsBai({
  ten: 'Lab 8 · 2 — Write usageReport(bookings, labIds, from, days) in one pass', kho: 'MEDIUM', phut: 20,
  en: `<p>The fixed report. For each day from <code>from</code> (a UTC date, <code>YYYY-MM-DD</code>) for <code>days</code> days, and for each lab in <code>labIds</code> (in that order: day by day, labs inside), return <code>{ day, labId, bookings, hours }</code>: the number of non-cancelled bookings that start on that UTC day in that lab, and their total hours. Bookings outside the range are ignored. Scan <code>bookings</code> only once.</p>`,
  vi: `<p>Báo cáo đã sửa. Với mỗi ngày từ <code>from</code> (ngày UTC, <code>YYYY-MM-DD</code>) trong <code>days</code> ngày, và mỗi phòng trong <code>labIds</code> (theo thứ tự: từng ngày, các phòng bên trong), trả <code>{ day, labId, bookings, hours }</code>: số lượt đặt không bị huỷ bắt đầu trong ngày UTC đó ở phòng đó, và tổng số giờ của chúng. Lượt đặt ngoài khoảng thì bỏ qua. Chỉ quét <code>bookings</code> một lần.</p>`,
  dauVao: ['bookings — [{ labId, status, startAt, endAt }] (ISO UTC); labIds — string[]; from — date; days — number', 'bookings — [{ labId, status, startAt, endAt }] (ISO UTC); labIds — string[]; from — ngày; days — số'],
  dauRa: ['[{ day, labId, bookings, hours }] — days × labs rows', '[{ day, labId, bookings, hours }] — days × labs dòng'],
  goiY: [['Create every (day, lab) cell first, with zeros.', 'Tạo sẵn mọi ô (ngày, phòng) với số 0.'], ['startAt.slice(0, 10) is the UTC day — no Date object needed.', 'startAt.slice(0, 10) là ngày UTC — không cần tạo Date.']],
  loi: [['Filtering all bookings inside the day × lab loop (the starter: O(days·labs·N)).', 'Lọc mọi lượt đặt bên trong vòng ngày × phòng (bản khởi đầu: O(days·labs·N)).'], ['Counting cancelled bookings, or leaving out empty cells.', 'Đếm cả lượt đã huỷ, hoặc bỏ sót các ô rỗng.']],
  gt: ['Same answer byte for byte as the starter (cmp before.json after.json), in one pass: 335 ms → 3–4 ms in Lab 8.', 'Câu trả lời giống hệt từng byte với bản khởi đầu (cmp before.json after.json), trong một lượt quét: 335 ms → 3–4 ms ở Lab 8.'],
  kn: ['performance', 'algorithms'],
  tns: [tn('one pass', 'một lượt quét'), tn('group by', 'gom nhóm')],
  dau: `/** usage per (day, lab) — must scan bookings only once */
function usageReport(bookings, labIds, from, days) {
  // Write your solution here
  const rows = [];
  for (let d = 0; d < days; d++) {
    const day = new Date(Date.parse(from) + d * 86400000).toISOString().slice(0, 10);
    for (const lab of labIds) {
      const mine = bookings.filter((b) => b.labId === lab && b.startAt.slice(0, 10) === day);
      rows.push({ day, labId: lab, bookings: mine.length, hours: mine.length * 2 });
    }
  }
  return rows;
}
`,
  giai: '// Reference solution\n' + nguon(usageReport),
  cases: [
    { goi: goi('usageReport', B, ['lab_1', 'lab_2'], '2026-11-02', 2), moTa: ['Two days, two labs', 'Hai ngày, hai phòng'] },
    { goi: goi('usageReport', [], ['lab_1'], '2026-11-02', 1), moTa: ['No bookings — the cell still exists', 'Không có lượt đặt — ô vẫn tồn tại'] },
    { goi: goi('usageReport', B, ['lab_2', 'lab_1'], '2026-10-31', 3), an: true },
    { goi: goi('usageReport', B, ['lab_3'], '2026-11-02', 1), an: true },
    { goi: goi('usageReport', B, ['lab_1'], '2026-12-30', 3), an: true },
  ],
});

function cacheDecision(entry, now, ttlMs) {
  if (!entry || now - entry.at > ttlMs) return { hit: false };
  return { hit: true, age: Math.floor((now - entry.at) / 1000) };
}
const E3 = jsBai({
  ten: 'Lab 8 · 3 — Write cacheDecision(entry, now, ttlMs)', kho: 'EASY', phut: 8,
  en: `<p>The cache of Lab 8 keeps <code>{ at }</code> (ms) for each query. Return <code>{ hit: false }</code> if there is no entry or it is older than <code>ttlMs</code> (exactly <code>ttlMs</code> old still counts as a hit). Otherwise <code>{ hit: true, age }</code> with <code>age</code> = whole seconds since <code>at</code>, rounded down — the value of the <code>Age</code> header.</p>`,
  vi: `<p>Cache của Lab 8 giữ <code>{ at }</code> (ms) cho mỗi truy vấn. Trả <code>{ hit: false }</code> nếu không có mục nào hoặc mục cũ hơn <code>ttlMs</code> (cũ đúng <code>ttlMs</code> vẫn tính là trúng). Ngược lại <code>{ hit: true, age }</code> với <code>age</code> = số giây tròn kể từ <code>at</code>, làm tròn xuống — giá trị của header <code>Age</code>.</p>`,
  dauVao: ['entry — { at } | null; now, ttlMs — numbers (ms)', 'entry — { at } | null; now, ttlMs — số (ms)'],
  dauRa: ['{ hit: false } | { hit: true, age }', '{ hit: false } | { hit: true, age }'],
  goiY: [['Compare now − at with ttlMs.', 'So now − at với ttlMs.'], ['Math.floor for whole seconds.', 'Math.floor để lấy giây tròn.']],
  loi: [['Age in milliseconds.', 'Age tính bằng mili giây.'], ['Off by one at exactly ttlMs.', 'Lệch một đúng tại ttlMs.']],
  gt: ['Inside the handler, after requireAuth and requireRole: a hit costs 0.7 ms; Age tells the client how old the numbers are.', 'Bên trong handler, sau requireAuth và requireRole: trúng cache tốn 0,7 ms; Age cho client biết số liệu cũ bao lâu.'],
  kn: ['caching'],
  tns: [tn('TTL', 'thời gian sống của mục cache'), tn('Age', 'tuổi của câu trả lời')],
  dau: `/** is the cached report still fresh? */
function cacheDecision(entry, now, ttlMs) {
  // Write your solution here
  return { hit: !!entry, age: entry ? now - entry.at : 0 };
}
`,
  giai: '// Reference solution\n' + nguon(cacheDecision),
  cases: [
    { goi: goi('cacheDecision', { at: 1000 }, 3500, 60000), moTa: ['2.5 s old', 'Cũ 2,5 giây'] },
    { goi: goi('cacheDecision', null, 3500, 60000), moTa: ['First request', 'Request đầu tiên'] },
    { goi: goi('cacheDecision', { at: 0 }, 60001, 60000), an: true },
    { goi: goi('cacheDecision', { at: 0 }, 60000, 60000), an: true },
  ],
});

export default doiDau({ slug: 'api-8-7-lab', ten: 'Lab 8 — Usage report: measure, fix, protect', khoa: KHOA, baiHoc: 'api-8-7-lab', de: [E1, E2, E3] });
