/** API Design · 4.2 — Chiến lược phiên bản: chọn phiên bản cho request, chuỗi biến đổi kiểu Stripe, so sánh các cách. */
import { doiDau, KHOA, cs, q, tn, jsBai, nguon, goi } from './_api.mjs';

/* ── 1. Tình huống ── */
const E1 = cs({
  ten: 'Versions 1 — Where the version goes', kho: 'EASY', phut: 10,
  en: 'Facts and choices from lesson 4.2 (LabFlow /v1, /v2 and the LabFlow-Version header, real runs).',
  vi: 'Sự thật và lựa chọn từ bài 4.2 (LabFlow /v1, /v2 và header LabFlow-Version, chạy thật).',
  cau: [
    q('c1', ['A booking created with POST /v2/bookings was then read with GET /v1/bookings/bk_9. LabFlow returned …', 'Một lượt đặt tạo bằng POST /v2/bookings rồi đọc bằng GET /v1/bookings/bk_9. LabFlow trả …'], ['the same booking in the v1 shape, with startAt and endAt', '404 — v1 cannot see bookings created in v2', '410 — the booking belongs to a newer version', 'the v2 shape, because it was created in v2'], ['One database, one model; only the representation is versioned at the edge.', 'Một cơ sở dữ liệu, một mô hình; chỉ cách biểu diễn được đánh phiên bản ở mép.']),
    q('c2', ['Why does LabFlow set Vary: LabFlow-Version on the unversioned paths?', 'Vì sao LabFlow đặt Vary: LabFlow-Version trên các đường không số phiên bản?'], ['The body depends on that request header, so caches must key on it', 'Browsers require Vary on every JSON response', 'It tells the client which version to upgrade to', 'Vary makes the response smaller'], ['Without it a cache may serve the v1 body to a client that asked for v2.', 'Thiếu nó, cache có thể trả body v1 cho client xin v2.']),
    q('c3', ['What is the main cost of Stripe’s date-based versions?', 'Cái giá chính của phiên bản theo ngày kiểu Stripe là gì?'], ['Every change needs a backwards transform, kept forever', 'Clients must change their URLs every month', 'Responses cannot be cached at all', 'Only one version can exist at a time'], ['The newest shape is transformed back for each pinned version — powerful, and a permanent maintenance load.', 'Hình dạng mới nhất được biến đổi ngược cho từng phiên bản được ghim — mạnh, và là gánh bảo trì vĩnh viễn.']),
    q('c4', ['When should LabFlow publish /v3?', 'Khi nào LabFlow nên ra /v3?'], ['When breaking changes cannot be avoided, batched together', 'For every new endpoint the team adds', 'Every semester, so the API looks current', 'Whenever a new optional member is added'], ['Additive changes stay in the current version; a major version is rare and batches breaking changes.', 'Thay đổi chỉ-thêm ở lại phiên bản hiện tại; phiên bản lớn là hiếm và gom các thay đổi phá vỡ.']),
    q('c5', ['GET /bookings/bk_8 with LabFlow-Version: 3 returned …', 'GET /bookings/bk_8 với LabFlow-Version: 3 trả …'], ['400 UNKNOWN_VERSION, listing versions 1, 2', '200 in the newest version', '404 ROUTE_NOT_FOUND', '200 in version 1, ignoring the header'], ['An unknown version is a client error with a helpful list; silently falling back hides the mistake.', 'Phiên bản lạ là lỗi phía client kèm danh sách hữu ích; lặng lẽ lùi về bản khác che mất sai lầm.']),
  ],
  goiY: [['Remember: one router, versioned edges.', 'Nhớ: một router, mép theo phiên bản.'], ['Look at the real outputs of lesson 4.2.', 'Xem lại output thật của bài 4.2.']],
  loi: [['A new major version for every change.', 'Mỗi thay đổi một phiên bản lớn.'], ['Header versioning without Vary.', 'Phiên bản bằng header mà thiếu Vary.']],
  tns: [tn('major version', 'phiên bản lớn'), tn('version pinning', 'ghim phiên bản')],
  kn: ['versioning'],
});

/* ── 2. Tự viết: pickVersion ── */
function pickVersion(path, headers) {
  const known = [1, 2];
  const m = /^\/v(\d+)(\/.*)$/.exec(path);
  if (m) {
    const v = Number(m[1]);
    return known.includes(v) ? { version: v, path: m[2] } : { error: 'ROUTE_NOT_FOUND' };
  }
  const h = headers['labflow-version'];
  if (h === undefined) return { version: 1, path };
  return known.map(String).includes(h) ? { version: Number(h), path } : { error: 'UNKNOWN_VERSION' };
}
const E2 = jsBai({
  ten: 'Versions 2 — Write pickVersion(path, headers)', kho: 'MEDIUM', phut: 12,
  en: `<p>Decide which version serves a request, as LabFlow does (known versions: 1 and 2). <code>headers</code> has lower-case names.</p><ul>
<li>Path starts with <code>/v&lt;n&gt;/</code>: known ⇒ <code>{ version: n, path: &lt;rest&gt; }</code> (e.g. <code>/v2/bookings</code> ⇒ <code>/bookings</code>); unknown ⇒ <code>{ error: 'ROUTE_NOT_FOUND' }</code> (it is just a path that does not exist)</li>
<li>Otherwise read <code>labflow-version</code>: absent ⇒ version 1; <code>"1"</code>/<code>"2"</code> ⇒ that version; anything else ⇒ <code>{ error: 'UNKNOWN_VERSION' }</code>. The path stays as it is.</li></ul>`,
  vi: `<p>Quyết định phiên bản nào phục vụ một request, như LabFlow (phiên bản đã biết: 1 và 2). Tên trong <code>headers</code> là chữ thường.</p><ul>
<li>Đường dẫn bắt đầu bằng <code>/v&lt;n&gt;/</code>: đã biết ⇒ <code>{ version: n, path: &lt;phần còn lại&gt; }</code> (ví dụ <code>/v2/bookings</code> ⇒ <code>/bookings</code>); không biết ⇒ <code>{ error: 'ROUTE_NOT_FOUND' }</code> (chỉ là một đường không tồn tại)</li>
<li>Ngược lại đọc <code>labflow-version</code>: vắng ⇒ phiên bản 1; <code>"1"</code>/<code>"2"</code> ⇒ phiên bản đó; giá trị khác ⇒ <code>{ error: 'UNKNOWN_VERSION' }</code>. Đường dẫn giữ nguyên.</li></ul>`,
  dauVao: ['path — string; headers — { name: value } with lower-case names', 'path — chuỗi; headers — { tên: giá trị } tên chữ thường'],
  dauRa: ['{ version, path } | { error }', '{ version, path } | { error }'],
  goiY: [['/^\\/v(\\d+)(\\/.*)$/ captures the number and the rest.', '/^\\/v(\\d+)(\\/.*)$/ bắt con số và phần còn lại.'], ['The URL wins over the header when both exist.', 'URL thắng header khi có cả hai.']],
  loi: [['Treating /v3/bookings as UNKNOWN_VERSION — in LabFlow it is a 404.', 'Coi /v3/bookings là UNKNOWN_VERSION — ở LabFlow nó là 404.'], ['Falling back to version 1 for LabFlow-Version: 3.', 'Lùi về phiên bản 1 khi LabFlow-Version: 3.']],
  gt: ['inVersion and fromHeader of lesson 4.2 in one function: the URL is explicit; the header is only read on the old unversioned paths, defaulting to 1 so existing clients keep working.', 'inVersion và fromHeader của bài 4.2 trong một hàm: URL là rõ ràng; header chỉ được đọc ở các đường cũ không số phiên bản, mặc định 1 để client đang có vẫn chạy.'],
  kn: ['versioning'],
  tns: [tn('URL versioning', 'phiên bản trong URL'), tn('header versioning', 'phiên bản bằng header')],
  dau: `/** request path + headers ⇒ which version serves it */
function pickVersion(path, headers) {
  // Write your solution here
  const m = /^\\/v(\\d+)/.exec(path);
  return m ? { version: Number(m[1]), path } : { version: Number(headers['labflow-version'] || 1), path };
}
`,
  giai: '// Reference solution\n' + nguon(pickVersion),
  cases: [
    { goi: goi('pickVersion', '/v2/bookings/bk_8', {}), moTa: ['/v2 in the URL', '/v2 trong URL'] },
    { goi: goi('pickVersion', '/bookings/bk_8', { 'labflow-version': '2' }), moTa: ['Old path + header', 'Đường cũ + header'] },
    { goi: goi('pickVersion', '/bookings/bk_8', {}), an: true },
    { goi: goi('pickVersion', '/bookings/bk_8', { 'labflow-version': '3' }), an: true },
    { goi: goi('pickVersion', '/v3/bookings', {}), an: true },
    { goi: goi('pickVersion', '/v1/labs', { 'labflow-version': '2' }), an: true, moTa: ['The URL wins', 'URL thắng'] },
  ],
});

/* ── 3. Tự viết: chuỗi biến đổi kiểu Stripe ── */
function renderFor(booking, version) {
  // Newest first: each change knows how to turn its version's shape into the previous one
  const CHANGES = [
    { date: '2026-11-01', down: (b) => { const { period, ...r } = b; return { ...r, startAt: period.start, endAt: period.end }; } },
    { date: '2026-06-01', down: (b) => ({ ...b, status: b.status === 'CANCELLED' ? 'CANCELED' : b.status }) },
  ];
  let b = { ...booking };
  for (const c of CHANGES) if (version < c.date) b = c.down(b);
  return b;
}
const NEWEST = { id: 'bk_8', period: { start: '2026-11-02T04:00:00.000Z', end: '2026-11-02T06:00:00.000Z' }, status: 'CANCELLED' };
const E3 = jsBai({
  ten: 'Versions 3 — Write renderFor(booking, version): Stripe-style transforms', kho: 'HARD', phut: 20,
  en: `<p>The code knows only the <b>newest</b> booking shape. Versions are dates (<code>"2026-11-01"</code>); a client pinned to an older date must get the older shape. Two changes happened:</p><ul>
<li><b>2026-11-01</b>: <code>startAt</code>/<code>endAt</code> became <code>period: { start, end }</code></li>
<li><b>2026-06-01</b>: the status spelling <code>CANCELED</code> became <code>CANCELLED</code></li></ul>
<p>For every change whose date is <b>later</b> than the requested version, apply its backwards transform, newest change first. Return a new object; do not modify the input. (ISO dates compare correctly as strings.)</p>`,
  vi: `<p>Code chỉ biết hình dạng lượt đặt <b>mới nhất</b>. Phiên bản là ngày (<code>"2026-11-01"</code>); client ghim vào một ngày cũ hơn phải nhận hình dạng cũ hơn. Đã có hai thay đổi:</p><ul>
<li><b>2026-11-01</b>: <code>startAt</code>/<code>endAt</code> thành <code>period: { start, end }</code></li>
<li><b>2026-06-01</b>: cách viết trạng thái <code>CANCELED</code> thành <code>CANCELLED</code></li></ul>
<p>Với mọi thay đổi có ngày <b>muộn hơn</b> phiên bản được xin, áp phép biến đổi ngược của nó, thay đổi mới nhất trước. Trả object mới; không sửa đầu vào. (Ngày ISO so như chuỗi là đúng.)</p>`,
  dauVao: ['booking — newest shape; version — "YYYY-MM-DD"', 'booking — hình dạng mới nhất; version — "YYYY-MM-DD"'],
  dauRa: ['the booking in that version’s shape', 'lượt đặt theo hình dạng của phiên bản đó'],
  goiY: [['Keep the changes in an array, newest first, each with date and down(b).', 'Giữ các thay đổi trong một mảng, mới nhất trước, mỗi cái có date và down(b).'], ['version &lt; change.date ⇒ the client predates that change ⇒ undo it.', 'version &lt; change.date ⇒ client có trước thay đổi đó ⇒ đảo ngược nó.']],
  loi: [['Applying the transforms oldest first — later transforms expect the newer shape.', 'Áp các phép biến đổi từ cũ tới mới — phép sau mong hình dạng mới hơn.'], ['Using ≤ — a client pinned exactly to 2026-11-01 already has period.', 'Dùng ≤ — client ghim đúng 2026-11-01 đã có period.']],
  gt: ['This is the mechanism behind date-based versions: one current model, and a small reversible step per change. It also shows the cost: every future change adds a step that must live as long as any client is pinned before it.', 'Đây là cơ chế phía sau phiên bản theo ngày: một mô hình hiện tại, và mỗi thay đổi một bước nhỏ đảo ngược được. Nó cũng cho thấy cái giá: mỗi thay đổi tương lai thêm một bước phải sống chừng nào còn client ghim trước nó.'],
  kn: ['versioning', 'Stripe'],
  tns: [tn('version change', 'một bước thay đổi phiên bản'), tn('backwards transform', 'phép biến đổi ngược')],
  dau: `/** newest booking + pinned date version ⇒ that version's shape */
function renderFor(booking, version) {
  // Write your solution here
  if (version < '2026-11-01') return { ...booking, startAt: booking.period.start, endAt: booking.period.end };
  return booking;
}
`,
  giai: '// Reference solution\n' + nguon(renderFor),
  cases: [
    { goi: goi('renderFor', NEWEST, '2026-11-01'), moTa: ['Pinned to the newest version', 'Ghim vào phiên bản mới nhất'] },
    { goi: goi('renderFor', NEWEST, '2026-08-15'), moTa: ['Before period', 'Trước khi có period'] },
    { goi: goi('renderFor', NEWEST, '2026-01-10'), an: true, moTa: ['Before both changes', 'Trước cả hai thay đổi'] },
    { goi: goi('renderFor', { ...NEWEST, status: 'PENDING' }, '2025-12-31'), an: true },
    { goi: `(function () { var b = ${JSON.stringify(NEWEST)}; renderFor(b, '2026-01-01'); return b; })()`, an: true, moTa: ['The input is not modified', 'Đầu vào không bị sửa'] },
  ],
});

export default doiDau({ slug: 'api-4-2-chien-luoc', ten: '4.2 Versioning strategies', khoa: KHOA, baiHoc: 'api-4-2-chien-luoc', de: [E1, E2, E3] });
