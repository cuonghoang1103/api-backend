/** API Design · 4.3 — Khai tử: dựng header Deprecation/Sunset/Link đúng RFC, báo cáo ai còn gọi, thứ tự kế hoạch khai tử. */
import { doiDau, KHOA, cs, q, ord, tn, jsBai, nguon, goi } from './_api.mjs';

/* ── 1. Tình huống ── */
const E1 = cs({
  ten: 'Deprecation 1 — Headers and dates', kho: 'EASY', phut: 10,
  en: 'Facts from lesson 4.3 (LabFlow’s old paths, real runs; RFC 9745 and RFC 8594).',
  vi: 'Những điều từ bài 4.3 (các đường cũ của LabFlow, chạy thật; RFC 9745 và RFC 8594).',
  cau: [
    q('c1', ['Deprecation: @1793491200 means …', 'Deprecation: @1793491200 nghĩa là …'], ['deprecated since 2026-11-01T00:00:00Z (Unix seconds)', 'the endpoint stops responding at that moment', 'version 1793491200 of the API', 'deprecated for 1 793 491 200 milliseconds'], ['RFC 9745: a structured-field Date, @ followed by Unix seconds. Stopping is what Sunset announces.', 'RFC 9745: kiểu Date của structured field, @ rồi số giây Unix. Ngừng hẳn là việc của Sunset.']),
    q('c2', ['Which pair breaks the rule of RFC 9745?', 'Cặp nào vi phạm luật của RFC 9745?'], ['Deprecation 1 May 2027, Sunset 1 Nov 2026', 'Deprecation 1 Nov 2026, Sunset 1 May 2027', 'Deprecation 1 Nov 2026, Sunset 1 Nov 2026', 'Deprecation in the future, Sunset later still'], ['The Sunset time must not be earlier than the Deprecation time; equal is allowed, and Deprecation may lie in the future.', 'Thời điểm Sunset không được sớm hơn Deprecation; bằng nhau thì được, và Deprecation có thể nằm ở tương lai.']),
    q('c3', ['On 2 May 2027 GET /bookings (old path) answered 410. Why not 404?', 'Ngày 2/5/2027 GET /bookings (đường cũ) trả 410. Sao không phải 404?'], ['410 says it was removed on purpose; the problem names the successor', '404 is reserved for databases', '410 is cached by browsers, 404 is not', 'Express cannot send 404 for known paths'], ['404 looks like a typo in the URL; 410 + successor tells the developer exactly what to do.', '404 trông như gõ sai URL; 410 + đường thay thế nói rõ lập trình viên phải làm gì.']),
    q('c4', ['The usage report showed android/1.2.0 and node on the old paths. What is it for?', 'Báo cáo mức dùng hiện android/1.2.0 và node trên đường cũ. Nó để làm gì?'], ['To contact the owners of those clients before the sunset date', 'To block those clients immediately', 'To bill clients per request', 'To decide which version number comes next'], ['Retiring an API is about people: you email the owners of Android 1.2.0, months ahead.', 'Khai tử API là chuyện con người: bạn email cho chủ của Android 1.2.0, trước nhiều tháng.']),
    q('c5', ['After the sunset, the unchanged client-v1.mjs crashed with “page.data is not iterable”. What does that teach?', 'Sau sunset, client-v1.mjs không sửa sập với “page.data is not iterable”. Điều đó dạy gì?'], ['No header saves a client that never checks res.ok — communicate early', 'The server should keep answering 200 forever', '410 responses must contain a data array', 'The Sunset header was formatted wrongly'], ['Headers inform developers and tools; only months of communication reach clients that ignore responses.', 'Header báo cho lập trình viên và công cụ; chỉ những tháng truyền đạt mới tới được client bỏ qua response.']),
  ],
  goiY: [['Deprecated = still works; sunset = stops.', 'Deprecated = vẫn chạy; sunset = ngừng.'], ['Check the formats: @seconds vs HTTP-date.', 'Kiểm định dạng: @giây và HTTP-date.']],
  loi: [['Mixing up the two dates.', 'Lẫn hai ngày với nhau.'], ['Answering 404 after removal.', 'Trả 404 sau khi gỡ.']],
  tns: [tn('Deprecation', 'header khai tử (RFC 9745)'), tn('Sunset', 'header ngày ngừng (RFC 8594)')],
  kn: ['deprecation'],
});

/* ── 2. Tự viết: deprecationHeaders ── */
function deprecationHeaders({ since, sunset, docs, successor }) {
  const a = Date.parse(since), b = Date.parse(sunset);
  if (Number.isNaN(a) || Number.isNaN(b) || b < a) throw new RangeError('Sunset must not be earlier than Deprecation');
  return {
    Deprecation: `@${Math.floor(a / 1000)}`,
    Sunset: new Date(b).toUTCString(),
    Link: `<${docs}>; rel="deprecation", <${successor}>; rel="successor-version"`,
  };
}
const OLD = { since: '2026-11-01T00:00:00Z', sunset: '2027-05-01T00:00:00Z', docs: 'https://labflow.example/docs/migrate-to-v1', successor: '/v1/bookings' };
const E2 = jsBai({
  ten: 'Deprecation 2 — Write deprecationHeaders(plan)', kho: 'MEDIUM', phut: 12,
  en: `<p>Build the three headers LabFlow sends on a deprecated path, from <code>{ since, sunset, docs, successor }</code> (ISO strings and URLs):</p><ul>
<li><code>Deprecation</code>: <code>@</code> + whole Unix <b>seconds</b> of <code>since</code> (RFC 9745)</li>
<li><code>Sunset</code>: the HTTP-date of <code>sunset</code> — <code>Date.prototype.toUTCString()</code> gives it (RFC 8594)</li>
<li><code>Link</code>: <code>&lt;docs&gt;; rel="deprecation", &lt;successor&gt;; rel="successor-version"</code></li></ul>
<p>If a date does not parse, or <code>sunset</code> is earlier than <code>since</code>, throw a <code>RangeError</code>.</p>`,
  vi: `<p>Dựng ba header LabFlow gửi trên một đường bị khai tử, từ <code>{ since, sunset, docs, successor }</code> (chuỗi ISO và URL):</p><ul>
<li><code>Deprecation</code>: <code>@</code> + số <b>giây</b> Unix nguyên của <code>since</code> (RFC 9745)</li>
<li><code>Sunset</code>: HTTP-date của <code>sunset</code> — <code>Date.prototype.toUTCString()</code> cho ra nó (RFC 8594)</li>
<li><code>Link</code>: <code>&lt;docs&gt;; rel="deprecation", &lt;successor&gt;; rel="successor-version"</code></li></ul>
<p>Nếu một ngày không đọc được, hoặc <code>sunset</code> sớm hơn <code>since</code>, ném <code>RangeError</code>.</p>`,
  dauVao: ['{ since, sunset, docs, successor }', '{ since, sunset, docs, successor }'],
  dauRa: ['{ Deprecation, Sunset, Link } or a RangeError', '{ Deprecation, Sunset, Link } hoặc RangeError'],
  goiY: [['Date.parse gives milliseconds — divide by 1000 and floor.', 'Date.parse cho mili giây — chia 1000 rồi lấy phần nguyên.'], ['Check the order before building anything.', 'Kiểm thứ tự trước khi dựng gì.']],
  loi: [['Deprecation: @1793491200000 — milliseconds instead of seconds.', 'Deprecation: @1793491200000 — mili giây thay vì giây.'], ['Sunset in ISO format — RFC 8594 uses an HTTP-date.', 'Sunset dạng ISO — RFC 8594 dùng HTTP-date.']],
  gt: ['Exactly the headers of lesson 4.3: Deprecation @1793491200, Sunset Sat, 01 May 2027 00:00:00 GMT, and a Link with both relations. The RangeError is the check Lab 4’s contract test makes.', 'Đúng các header của bài 4.3: Deprecation @1793491200, Sunset Sat, 01 May 2027 00:00:00 GMT, và một Link có cả hai quan hệ. RangeError chính là phép kiểm mà test hợp đồng của Lab 4 làm.'],
  kn: ['deprecation', 'HTTP headers'],
  tns: [tn('HTTP-date', 'định dạng ngày của HTTP'), tn('successor-version', 'quan hệ liên kết tới bản thay thế')],
  dau: `/** retirement plan ⇒ the three headers */
function deprecationHeaders({ since, sunset, docs, successor }) {
  // Write your solution here
  return { Deprecation: '@' + Date.parse(since), Sunset: sunset, Link: '<' + successor + '>; rel="successor-version"' };
}
`,
  giai: '// Reference solution\n' + nguon(deprecationHeaders),
  cases: [
    { goi: goi('deprecationHeaders', OLD), moTa: ['LabFlow’s old paths', 'Các đường cũ của LabFlow'] },
    { goi: goi('deprecationHeaders', { ...OLD, since: '2026-11-01T00:00:00Z', sunset: '2026-10-01T00:00:00Z' }), nem: 'RangeError', moTa: ['Sunset before Deprecation', 'Sunset trước Deprecation'] },
    { goi: goi('deprecationHeaders', { since: '2026-11-15T00:00:00Z', sunset: '2027-06-01T00:00:00Z', docs: 'https://labflow.example/docs/devices-v2', successor: '/v2/devices/dev_1' }), an: true, moTa: ['Lab 4: /v1/devices', 'Lab 4: /v1/devices'] },
    { goi: goi('deprecationHeaders', { ...OLD, since: '2026-11-01T07:00:00+07:00', sunset: '2026-11-01T00:00:00Z' }), an: true, moTa: ['Same instant, two notations', 'Cùng thời điểm, hai cách viết'] },
    { goi: goi('deprecationHeaders', { ...OLD, sunset: 'next semester' }), nem: 'RangeError', an: true },
  ],
});

/* ── 3. Tự viết: usageReport ── */
function usageReport(log) {
  const m = new Map();
  for (const e of log) {
    const k = `${e.route} · ${e.client}`;
    const u = m.get(k) ?? { route: e.route, client: e.client, count: 0, lastSeen: '' };
    u.count++;
    if (e.at > u.lastSeen) u.lastSeen = e.at;
    m.set(k, u);
  }
  return [...m.values()].sort((a, b) => b.count - a.count || a.route.localeCompare(b.route) || a.client.localeCompare(b.client));
}
const LOG = [
  { route: 'GET /labs', client: 'android/1.2.0', at: '2026-10-31T20:03:18.484Z' },
  { route: 'GET /bookings', client: 'curl/8.7.1', at: '2026-10-31T20:03:18.408Z' },
  { route: 'GET /bookings', client: 'android/1.2.0', at: '2026-10-31T20:03:18.497Z' },
  { route: 'GET /bookings', client: 'android/1.2.0', at: '2026-10-31T20:03:18.512Z' },
  { route: 'GET /bookings', client: 'node', at: '2026-10-31T20:03:18.582Z' },
  { route: 'POST /bookings', client: 'node', at: '2026-10-31T20:03:18.604Z' },
];
const E3 = jsBai({
  ten: 'Deprecation 3 — Write usageReport(log): who still calls?', kho: 'MEDIUM', phut: 15,
  en: `<p>Each call to a deprecated route was logged as <code>{ route, client, at }</code> (<code>at</code> = ISO time in UTC). Return one row per (route, client): <code>{ route, client, count, lastSeen }</code>, where <code>lastSeen</code> is the latest <code>at</code>. Order: most calls first; ties by route, then client, alphabetically. The log is not sorted.</p>`,
  vi: `<p>Mỗi lần gọi một route bị khai tử được ghi thành <code>{ route, client, at }</code> (<code>at</code> = giờ ISO theo UTC). Trả mỗi cặp (route, client) một dòng: <code>{ route, client, count, lastSeen }</code>, với <code>lastSeen</code> là <code>at</code> muộn nhất. Thứ tự: nhiều lượt gọi nhất trước; bằng nhau thì theo route, rồi client, theo bảng chữ cái. Nhật ký chưa được sắp.</p>`,
  dauVao: ['log — [{ route, client, at }]', 'log — [{ route, client, at }]'],
  dauRa: ['[{ route, client, count, lastSeen }]', '[{ route, client, count, lastSeen }]'],
  goiY: [['A Map keyed by route + client collects the rows.', 'Một Map có khoá là route + client gom các dòng.'], ['UTC ISO strings compare correctly as text.', 'Chuỗi ISO cùng UTC so như chữ là đúng.']],
  loi: [['Taking the last entry in the log as lastSeen — the log is not sorted.', 'Lấy mục cuối nhật ký làm lastSeen — nhật ký chưa sắp.'], ['Grouping by route only — the decision needs the client.', 'Chỉ gom theo route — quyết định cần biết client.']],
  gt: ['This is LabFlow’s GET /v1/admin/deprecations. With names on every row, the sunset decision becomes a list of people to contact.', 'Đây là GET /v1/admin/deprecations của LabFlow. Có tên ở mỗi dòng, quyết định sunset thành danh sách người cần liên hệ.'],
  kn: ['deprecation', 'observability'],
  tns: [tn('usage report', 'báo cáo mức dùng'), tn('last seen', 'lần cuối thấy')],
  dau: `/** call log ⇒ one row per route and client */
function usageReport(log) {
  // Write your solution here
  const m = {};
  for (const e of log) m[e.route] = { route: e.route, client: e.client, count: (m[e.route]?.count || 0) + 1, lastSeen: e.at };
  return Object.values(m);
}
`,
  giai: '// Reference solution\n' + nguon(usageReport),
  cases: [
    { goi: goi('usageReport', LOG), moTa: ['The calls of lesson 4.3', 'Các lượt gọi của bài 4.3'] },
    { goi: goi('usageReport', []) },
    { goi: goi('usageReport', [LOG[3], LOG[2], LOG[0]].reverse()), an: true },
    { goi: goi('usageReport', [{ route: 'GET /v1/devices', client: 'ios/1.4.0', at: '2027-01-02T00:00:00.000Z' }, { route: 'GET /v1/devices', client: 'ios/1.4.0', at: '2026-12-01T00:00:00.000Z' }, { route: 'GET /v1/devices', client: 'android/1.4.0', at: '2026-12-05T00:00:00.000Z' }, { route: 'GET /v1/devices', client: 'android/1.4.0', at: '2026-12-04T00:00:00.000Z' }]), an: true },
  ],
});

/* ── 4. Thứ tự kế hoạch ── */
const E4 = cs({
  ten: 'Deprecation 4 — A retirement plan in order', kho: 'EASY', phut: 6, loai: 'order',
  en: 'Put the steps for retiring LabFlow’s unversioned paths in the right order.',
  vi: 'Sắp các bước khai tử những đường không số phiên bản của LabFlow theo đúng thứ tự.',
  cau: [ord('o1', ['Order the steps', 'Sắp các bước'], [
    'Ship /v1 and the migration guide',
    'Send Deprecation + Link and a Sunset one semester away',
    'Announce in the changelog and email every client in the usage report',
    'Watch the report shrink; run short planned brownouts',
    'On the sunset date answer 410 with the successor',
    'Later, remove the route entirely',
  ], ['Replacement first, then signals, then people, then evidence, then 410 — and only after the 410 has done its job, removal.', 'Bản thay thế trước, rồi tín hiệu, rồi con người, rồi bằng chứng, rồi 410 — và chỉ khi 410 đã làm xong việc mới gỡ hẳn.'])],
  goiY: [['Nobody can migrate before the successor exists.', 'Không ai chuyển được khi chưa có bản thay thế.'], ['Removal is the very last step.', 'Gỡ hẳn là bước cuối cùng.']],
  loi: [['Announcing a date before /v1 exists.', 'Báo ngày khi /v1 chưa có.'], ['Removing the route on the sunset date (404 instead of 410).', 'Gỡ route đúng ngày sunset (404 thay vì 410).']],
  tns: [tn('brownout', 'cố ý tắt ngắn theo lịch'), tn('migration guide', 'hướng dẫn chuyển đổi')],
  kn: ['deprecation'],
});

export default doiDau({ slug: 'api-4-3-deprecation', ten: '4.3 Deprecation and sunset', khoa: KHOA, baiHoc: 'api-4-3-deprecation', de: [E1, E2, E3, E4] });
