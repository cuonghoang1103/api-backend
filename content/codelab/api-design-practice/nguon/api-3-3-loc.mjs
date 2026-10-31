/** API Design · 3.3 — Bộ lọc: AND, danh sách, khoảng "chồng lên", tìm bỏ dấu; con trỏ gắn với truy vấn; mã lỗi đúng (output thật bài 3.3). */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi } from './_api.mjs';

/* ── 1. Tình huống ── */
const E1 = cs({
  ten: 'Filters 1 — Rules and surprises', kho: 'EASY', phut: 10,
  en: 'Facts from lesson 3.3 (real LabFlow runs, PostgreSQL 18.4 with one million rows).',
  vi: 'Những điều từ bài 3.3 (chạy thật trên LabFlow, PostgreSQL 18.4 với một triệu dòng).',
  cau: [
    q('c1', ['from=07:00 and to=11:00 (Hanoi) returned the 07:00–09:00 and 09:00–11:00 slots. Which test does LabFlow apply?', 'from=07:00 và to=11:00 (giờ Hà Nội) trả các ca 07:00–09:00 và 09:00–11:00. LabFlow áp phép thử nào?'], ['endAt &gt; from AND startAt &lt; to (the booking overlaps the window)', 'startAt ≥ from AND startAt &lt; to (the booking starts in the window)', 'startAt ≥ from AND endAt ≤ to (the booking lies fully inside)', 'createdAt between from and to'], ['“Who is in the lab between 7 and 11?” is an overlap question: each interval starts before the other ends.', '"Ai ở trong lab từ 7 tới 11?" là câu hỏi chồng lên: mỗi khoảng bắt đầu trước khi khoảng kia kết thúc.']),
    q('c2', ['?from=2026-11-03T07:00:00+07:00 (raw +) returned 400 “Invalid ISO datetime”. Why?', '?from=2026-11-03T07:00:00+07:00 (dấu + trần) trả 400 "Invalid ISO datetime". Vì sao?'], ['A raw + in a query string means a space; send %2B', 'Offsets are not allowed in query strings', 'from must always be in UTC', 'Colons must be percent-encoded'], ['The server sees "07:00:00 07:00". Encode the plus as %2B, or send UTC with Z.', 'Server thấy "07:00:00 07:00". Mã hoá dấu cộng thành %2B, hoặc gửi giờ UTC với Z.']),
    q('c3', ['?status=PENDING,DONE&from=…04&to=…03&q=x listed errors for status and q, but none for to. Why?', '?status=PENDING,DONE&from=…04&to=…03&q=x báo lỗi cho status và q, nhưng không có lỗi to. Vì sao?'], ['After the failed status pipe, Zod skipped the object-level refine', 'from after to is allowed in LabFlow', 'Zod reports at most two errors', 'q=x stops validation of the other fields'], ['Errors may come in two rounds; the second request (valid fields) showed “to must be after from”.', 'Lỗi có thể tới thành hai đợt; request thứ hai (các trường hợp lệ) mới hiện "to must be after from".']),
    q('c4', ['“lab_7, overlapping 10 November” took 36.183 ms, then 0.242 ms. What changed?', '"lab_7, chồng lên ngày 10/11" mất 36,183 ms, rồi 0,242 ms. Điều gì đã đổi?'], ['CREATE INDEX on (lab_id, start_at)', 'The query result was cached', 'LIMIT 20 was added', 'The filter moved into JavaScript'], ['Without it PostgreSQL walked the newest-first index and removed ~1 million rows by filter; with it it read 324 candidates.', 'Không có nó PostgreSQL đi theo index mới-nhất-trước và loại ~1 triệu dòng bằng bộ lọc; có nó thì đọc 324 ứng viên.']),
    q('c5', ['A student sends ?userId=usr_2. Why can she never see Bin’s bookings?', 'Một sinh viên gửi ?userId=usr_2. Vì sao cô không bao giờ thấy lượt đặt của Bin?'], ['The handler narrows to her own bookings BEFORE applying any filter', 'userId values are encrypted in the database, so they never match', 'Express drops every query parameter it does not recognise', 'Zod removes other users’ data from the response automatically'], ['Access first, filters second — a filter can only narrow what the caller may see. (In LabFlow the strict schema also rejects userId as unknown.)', 'Quyền truy cập trước, bộ lọc sau — bộ lọc chỉ thu hẹp thứ người gọi được thấy. (Ở LabFlow schema strict còn từ chối userId vì là tham số lạ.)']),
  ],
  goiY: [['Every answer was printed in lesson 3.3.', 'Mọi đáp án đã được in trong bài 3.3.'], ['Think about what the browser actually sends.', 'Nghĩ xem trình duyệt thật sự gửi gì.']],
  loi: [['Using “starts in the window” for an occupancy question.', 'Dùng "bắt đầu trong khung" cho câu hỏi về chiếm phòng.'], ['Publishing a filter without an index.', 'Công bố bộ lọc mà không có index.']],
  tns: [tn('overlap', 'chồng lên (hai khoảng thời gian)'), tn('percent-encoding', 'mã hoá phần trăm')],
  kn: ['filtering'],
});

/* ── 2. Tự viết: matchBooking ── */
function fold(s) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
}
function matchBooking(b, f) {
  return (!f.labId || b.labId === f.labId)
    && (!f.status || f.status.includes(b.status))
    && (!f.from || Date.parse(b.endAt) > Date.parse(f.from))
    && (!f.to || Date.parse(b.startAt) < Date.parse(f.to))
    && (!f.q || fold(b.purpose ?? '').includes(fold(f.q)));
}
const BK = { id: 'bk_19', labId: 'lab_1', status: 'PENDING', startAt: '2026-11-03T02:00:00.000Z', endAt: '2026-11-03T04:00:00.000Z', purpose: 'CLB IoT' };
const E2 = jsBai({
  ten: 'Filters 2 — Write matchBooking(b, f): AND, lists, overlap, search', kho: 'MEDIUM', phut: 15,
  en: `<p>Return <code>true</code> when booking <code>b</code> passes <b>every</b> filter present in <code>f</code> (absent filters are ignored):</p><ul>
<li><code>labId</code> — equal</li><li><code>status</code> — an array; the booking’s status is one of them</li>
<li><code>from</code>, <code>to</code> — ISO strings with offsets; the booking <b>overlaps</b> <code>[from, to)</code>: it ends after <code>from</code> and starts before <code>to</code></li>
<li><code>q</code> — the folded <code>purpose</code> contains the folded <code>q</code> (a missing purpose is <code>""</code>). <code>fold</code> (lesson 2.4: no accents, đ → d, lower case) is given.</li></ul>`,
  vi: `<p>Trả <code>true</code> khi lượt đặt <code>b</code> qua <b>mọi</b> bộ lọc có mặt trong <code>f</code> (bộ lọc vắng mặt thì bỏ qua):</p><ul>
<li><code>labId</code> — bằng nhau</li><li><code>status</code> — một mảng; trạng thái của lượt đặt là một trong số đó</li>
<li><code>from</code>, <code>to</code> — chuỗi ISO có độ lệch múi giờ; lượt đặt <b>chồng lên</b> <code>[from, to)</code>: kết thúc sau <code>from</code> và bắt đầu trước <code>to</code></li>
<li><code>q</code> — <code>purpose</code> đã gấp chứa <code>q</code> đã gấp (thiếu purpose thì là <code>""</code>). Hàm <code>fold</code> (bài 2.4: bỏ dấu, đ → d, chữ thường) có sẵn.</li></ul>`,
  dauVao: ['b — { labId, status, startAt, endAt, purpose? }; f — { labId?, status?, from?, to?, q? }', 'b — { labId, status, startAt, endAt, purpose? }; f — { labId?, status?, from?, to?, q? }'],
  dauRa: ['boolean', 'boolean'],
  goiY: [['Compare instants with Date.parse — "07:00+07:00" and "00:00Z" are the same moment but different strings.', 'So thời điểm bằng Date.parse — "07:00+07:00" và "00:00Z" là cùng một lúc nhưng khác chuỗi.'], ['Write each filter as (!f.x || test) and join them with &amp;&amp;.', 'Viết mỗi bộ lọc dạng (!f.x || phép thử) rồi nối bằng &amp;&amp;.']],
  loi: [['startAt ≥ from — a 06:00–08:00 booking is missing from “who is in the lab at 07:00”.', 'startAt ≥ from — lượt 06:00–08:00 vắng mặt ở câu "ai đang ở lab lúc 07:00".'], ['Comparing ISO strings with different offsets as text.', 'So chuỗi ISO khác độ lệch múi giờ như văn bản.']],
  gt: ['The lesson’s handler: filters joined by AND, a status list, the overlap test shared with booking conflicts, and a search that ignores accents and case.', 'Handler của bài: bộ lọc nối bằng AND, danh sách trạng thái, phép thử chồng lên dùng chung với xung đột lịch, và tìm kiếm bỏ qua dấu và hoa thường.'],
  kn: ['filtering', 'time intervals'],
  tns: [tn('overlap test', 'phép thử chồng lên'), tn('fold', 'gấp chữ: bỏ dấu, đ → d, chữ thường')],
  dau: `function fold(s) {
  return s.normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
}

/** booking + filters ⇒ does it pass all of them? */
function matchBooking(b, f) {
  // Write your solution here
  return (!f.labId || b.labId === f.labId)
    && (!f.status || f.status.includes(b.status))
    && (!f.from || b.startAt >= f.from)
    && (!f.to || b.startAt < f.to)
    && (!f.q || (b.purpose || '').includes(f.q));
}
`,
  giai: '// Reference solution\n' + nguon(fold, matchBooking),
  cases: [
    { goi: goi('matchBooking', BK, { labId: 'lab_1', status: ['PENDING', 'CANCELLED'] }), moTa: ['Lab and a status list', 'Phòng và danh sách trạng thái'] },
    { goi: goi('matchBooking', { ...BK, startAt: '2026-11-02T23:00:00.000Z', endAt: '2026-11-03T01:00:00.000Z' }, { from: '2026-11-03T07:00:00+07:00', to: '2026-11-03T11:00:00+07:00' }), moTa: ['06:00–08:00 Hanoi overlaps 07:00–11:00', '06:00–08:00 giờ Hà Nội chồng lên 07:00–11:00'] },
    { goi: goi('matchBooking', BK, { q: 'clb iot' }) },
    { goi: goi('matchBooking', { ...BK, startAt: '2026-11-03T04:00:00.000Z', endAt: '2026-11-03T06:00:00.000Z' }, { from: '2026-11-03T07:00:00+07:00', to: '2026-11-03T11:00:00+07:00' }), an: true, moTa: ['Starts exactly at to ⇒ outside [from, to)', 'Bắt đầu đúng lúc to ⇒ ngoài [from, to)'] },
    { goi: goi('matchBooking', { ...BK, purpose: 'Ôn thi Đồ án' }, { q: 'do an' }), an: true },
    { goi: goi('matchBooking', { ...BK, purpose: undefined, status: 'CANCELLED' }, { status: ['CANCELLED'], q: 'iot' }), an: true },
    { goi: goi('matchBooking', BK, { labId: 'lab_2', q: 'iot' }), an: true },
  ],
});

/* ── 3. Tự viết: canonicalQuery (thứ được băm thành dấu vân tay) ── */
function canonicalQuery(params) {
  return Object.keys(params)
    .filter((k) => k !== 'limit' && k !== 'cursor' && params[k] !== undefined && params[k] !== null)
    .sort()
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(Array.isArray(params[k]) ? params[k].join(',') : params[k])}`)
    .join('&');
}
const E3 = jsBai({
  ten: 'Filters 3 — Write canonicalQuery(params): what a cursor fingerprint hashes', kho: 'MEDIUM', phut: 12,
  en: `<p>LabFlow binds a cursor to its query by hashing the filters. The hash only works if the <b>same query always gives the same text</b>. Write <code>canonicalQuery(params)</code>:</p><ul>
<li>drop <code>limit</code> and <code>cursor</code> (changing the page size between pages is allowed) and every value that is <code>undefined</code> or <code>null</code></li>
<li>sort the remaining keys alphabetically</li>
<li>arrays become comma-joined strings; encode key and value with <code>encodeURIComponent</code></li>
<li>join as <code>key=value</code> pairs with <code>&amp;</code></li></ul>`,
  vi: `<p>LabFlow gắn con trỏ với truy vấn bằng cách băm bộ lọc. Phép băm chỉ đúng khi <b>cùng một truy vấn luôn cho cùng một chuỗi</b>. Viết <code>canonicalQuery(params)</code>:</p><ul>
<li>bỏ <code>limit</code> và <code>cursor</code> (đổi cỡ trang giữa các trang là được phép) và mọi giá trị <code>undefined</code> hoặc <code>null</code></li>
<li>sắp các khoá còn lại theo bảng chữ cái</li>
<li>mảng thành chuỗi nối bằng dấu phẩy; mã hoá khoá và giá trị bằng <code>encodeURIComponent</code></li>
<li>nối thành các cặp <code>khoá=giá_trị</code> bằng <code>&amp;</code></li></ul>`,
  dauVao: ['params — an object of validated query values', 'params — object các giá trị query đã kiểm'],
  dauRa: ['string — e.g. "labId=lab_1&status=PENDING%2CCANCELLED"', 'chuỗi — ví dụ "labId=lab_1&status=PENDING%2CCANCELLED"'],
  goiY: [['Object.keys(params).filter(…).sort().map(…).join("&amp;").', 'Object.keys(params).filter(…).sort().map(…).join("&amp;").'], ['encodeURIComponent turns "," into %2C, " " into %20 and "+" into %2B.', 'encodeURIComponent đổi "," thành %2C, " " thành %20 và "+" thành %2B.']],
  loi: [['Keeping limit — a client that changes the page size then gets CURSOR_MISMATCH.', 'Giữ limit — client đổi cỡ trang khi đó bị CURSOR_MISMATCH.'], ['Not sorting — {a, b} and {b, a} give different fingerprints for the same query.', 'Không sắp — {a, b} và {b, a} cho dấu vân tay khác nhau với cùng một truy vấn.']],
  gt: ['A canonical form makes equal queries equal text. Hash it (sha256, first 8 hex characters in LabFlow) and store it in the cursor; another filter set gives other text ⇒ 400 CURSOR_MISMATCH.', 'Dạng chuẩn tắc làm các truy vấn bằng nhau thành chuỗi bằng nhau. Băm nó (sha256, 8 ký tự hex đầu ở LabFlow) và cất vào con trỏ; bộ lọc khác cho chuỗi khác ⇒ 400 CURSOR_MISMATCH.'],
  kn: ['canonicalization', 'cursor pagination'],
  tns: [tn('canonical form', 'dạng chuẩn tắc'), tn('fingerprint', 'dấu vân tay (giá trị băm ngắn)')],
  dau: `/** validated query ⇒ canonical text (to be hashed into the cursor) */
function canonicalQuery(params) {
  // Write your solution here
  return Object.keys(params).map((k) => k + '=' + params[k]).join('&');
}
`,
  giai: '// Reference solution\n' + nguon(canonicalQuery),
  cases: [
    { goi: goi('canonicalQuery', { limit: 2, labId: 'lab_1' }), moTa: ['Lesson 3.3: labId=lab_1&limit=2', 'Bài 3.3: labId=lab_1&limit=2'] },
    { goi: goi('canonicalQuery', { status: ['PENDING', 'CANCELLED'], labId: 'lab_2', q: 'clb iot' }) },
    { goi: goi('canonicalQuery', { q: 'clb iot', status: ['PENDING', 'CANCELLED'], labId: 'lab_2', limit: 50, cursor: 'eyJ…' }), an: true, moTa: ['Same query, other order and page size', 'Cùng truy vấn, khác thứ tự và cỡ trang'] },
    { goi: goi('canonicalQuery', { from: '2026-11-03T07:00:00+07:00', to: undefined, labId: null }), an: true },
    { goi: goi('canonicalQuery', { limit: 20 }), an: true },
  ],
});

/* ── 4. Mã trạng thái + code ── */
const ST = ['200', '400'];
const CODE = ['—', 'INVALID_QUERY', 'INVALID_CURSOR', 'CURSOR_MISMATCH'];
const E4 = cs({
  ten: 'Filters 4 — Which answer, which code?', kho: 'MEDIUM', phut: 8, loai: 'table',
  en: 'Each request goes to LabFlow at the end of lesson 3.3 (Lan’s token). Choose the status and the problem code (— for success).',
  vi: 'Mỗi request gửi tới LabFlow ở cuối bài 3.3 (token của cô Lan). Chọn mã trạng thái và code của problem (— nếu thành công).',
  bang: [bang1('b1', ['Request → status + code', 'Request → mã + code'], [{ ma: 'x', ten: 'Request' }, { ma: 's', ten: 'Status', luaChon: ST }, { ma: 'c', ten: 'code', luaChon: CODE }], [
    { o: { x: '?labId=lab_2&status=CANCELLED&limit=3' }, a: { s: '200', c: '—' } },
    { o: { x: '?status=PENDING,DONE' }, a: { s: '400', c: 'INVALID_QUERY' } },
    { o: { x: '?from=2026-11-03T07:00:00+07:00 (raw +)' }, a: { s: '400', c: 'INVALID_QUERY' } },
    { o: { x: '?cursor=hello' }, a: { s: '400', c: 'INVALID_CURSOR' } },
    { o: { x: '?labId=lab_2&cursor=<page.next of a labId=lab_1 list>' }, a: { s: '400', c: 'CURSOR_MISMATCH' } },
    { o: { x: '?labId=lab_1&limit=5&cursor=<page.next of labId=lab_1&limit=2>' }, a: { s: '200', c: '—' } },
  ], ['Bad query values ⇒ INVALID_QUERY with every parameter listed; an unreadable cursor ⇒ INVALID_CURSOR; a readable cursor made for other filters ⇒ CURSOR_MISMATCH. limit is not part of the fingerprint.', 'Giá trị query sai ⇒ INVALID_QUERY kèm đủ mọi tham số; con trỏ không đọc được ⇒ INVALID_CURSOR; con trỏ đọc được nhưng làm cho bộ lọc khác ⇒ CURSOR_MISMATCH. limit không thuộc dấu vân tay.'])],
  goiY: [['Ask: is the cursor unreadable, or readable but for another query?', 'Hỏi: con trỏ không đọc được, hay đọc được nhưng của truy vấn khác?'], ['A raw + becomes a space before validation.', 'Dấu + trần thành dấu cách trước khi kiểm.']],
  loi: [['Answering 200 with page 1 for a mismatched cursor.', 'Trả 200 với trang 1 cho con trỏ lệch.'], ['Treating a page-size change as a different query.', 'Coi việc đổi cỡ trang là một truy vấn khác.']],
  tns: [tn('INVALID_QUERY', 'query không hợp lệ'), tn('CURSOR_MISMATCH', 'con trỏ không khớp bộ lọc')],
  kn: ['error codes'],
});

export default doiDau({ slug: 'api-3-3-loc', ten: '3.3 Filtering and search parameters', khoa: KHOA, baiHoc: 'api-3-3-loc', de: [E1, E2, E3, E4] });
