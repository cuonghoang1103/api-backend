/** Node.js 6.4 — Phân trang, lọc, sắp xếp: luôn có trần, OFFSET là đếm-rồi-bỏ, trôi dòng khi có insert, cursor (createdAt, id) mờ, sort theo danh sách cho phép. */
import { modul, cs, q, tn, jsBai, goi, APP_ERROR, TRO_GIUP_HMAC } from './_node-c6-8.mjs';

/* ── 1. Trắc nghiệm ── */
const E1 = cs({
  ten: '6.4 · 1 — Offset, cursor and the cost nobody sees', kho: 'EASY', phut: 8,
  en: 'Lesson 6.4 measured a real 1,000,000-row PostgreSQL table. Six questions about what those numbers mean for your list endpoint.',
  vi: 'Bài 6.4 đo trên một bảng PostgreSQL thật 1.000.000 dòng. Sáu câu hỏi về ý nghĩa của các con số đó với endpoint danh sách của bạn.',
  cau: [
    q('c1', ['<code>LIMIT 20 OFFSET 999980</code> took 166.8 ms and scanned 1,000,000 rows. Why?', '<code>LIMIT 20 OFFSET 999980</code> mất 166,8 ms và quét 1.000.000 dòng. Vì sao?'],
      ['OFFSET is a count-and-discard, not a seek: the database reads every skipped row in order and throws them away', 'The index on id was not used because the table was too big', 'PostgreSQL caches only the first 500,000 rows', 'LIMIT is applied before OFFSET, so all rows are returned to Node first'],
      ['Cost of page N grows linearly with N — your heaviest queries serve your least valuable traffic. Cursor: 0.015 ms, 20 rows scanned.', 'Chi phí trang N tăng tuyến tính theo N — truy vấn nặng nhất phục vụ lượt truy cập ít giá trị nhất. Cursor: 0,015 ms, quét 20 dòng.']),
    q('c2', ['A user reads page 1 (ids 1000000, 999999, 999998) of a newest-first feed; someone posts note 1000001; the user opens page 2 with OFFSET 3. What do they see first?', 'Người dùng đọc trang 1 (id 1000000, 999999, 999998) của bảng tin mới nhất trước; có người đăng ghi chú 1000001; người dùng mở trang 2 với OFFSET 3. Họ thấy gì đầu tiên?'],
      ['999998 again — the insert pushed every row down by one position', '999997 — OFFSET always skips exactly what was shown', '1000001 — new rows are appended to the current page', 'An error, because the result set changed between queries'],
      ['The cursor version (WHERE id < 999998) anchors to a ROW, not a position, so no duplicate. Deletes cause the mirror image: a row is skipped.', 'Bản cursor (WHERE id < 999998) neo vào một DÒNG, không phải vị trí, nên không trùng. Xoá gây hiện tượng ngược lại: một dòng bị bỏ qua.']),
    q('c3', ['A feed sorted by <code>createdAt</code> alone uses <code>WHERE "createdAt" &lt; $cursor</code>. What goes wrong?', 'Bảng tin chỉ sắp theo <code>createdAt</code> dùng <code>WHERE "createdAt" &lt; $cursor</code>. Cái gì hỏng?'],
      ['Rows sharing a timestamp can be skipped or repeated', 'Nothing: timestamps are unique to the millisecond', 'The query cannot use any index', 'The cursor must be a page number instead'],
      ['Always a tie-breaker: WHERE (created_at, id) &lt; ($1, $2) ORDER BY created_at DESC, id DESC.', 'Luôn có cột phá hoà: WHERE (created_at, id) &lt; ($1, $2) ORDER BY created_at DESC, id DESC.']),
    q('c4', ['<code>SELECT count(*)</code> took 45 ms on every list request to show “page 3 of 500”. What does the lesson prefer?', '<code>SELECT count(*)</code> tốn 45 ms ở mọi request danh sách chỉ để hiện "trang 3 / 500". Bài ưu tiên gì?'],
      ['Drop total and return hasMore, computed by fetching limit + 1 rows', 'Cache the whole table in Node memory', 'Run count(*) in a setTimeout so it does not block', 'Use OFFSET to count instead of count(*)'],
      ['Then the estimate (reltuples, 0.025 ms) for a “~1.2M results” label, or cache the exact count for a minute.', 'Sau đó là ước lượng (reltuples, 0,025 ms) cho nhãn "~1,2 triệu kết quả", hoặc cache số đếm đúng trong một phút.']),
    q('c5', ['<code>$queryRawUnsafe(`SELECT * FROM notes ORDER BY ${req.query.sort}`)</code>. Why can you not fix this with a placeholder?', '<code>$queryRawUnsafe(`SELECT * FROM notes ORDER BY ${req.query.sort}`)</code>. Vì sao không sửa bằng placeholder được?'],
      ['Placeholders bind VALUES, never identifiers like column names', 'Placeholders are slower than string concatenation', 'PostgreSQL does not support placeholders in SELECT', 'Because sort is always a number'],
      ['Anything not on the list never reaches the query. And every sortable column needs an index.', 'Thứ gì không có trong danh sách thì không bao giờ tới truy vấn. Và mọi cột cho sắp xếp cần chỉ mục.']),
    q('c6', ['Which endpoint should stay on offset pagination?', 'Endpoint nào nên giữ phân trang offset?'],
      ['An admin table where people expect page numbers, rows are few and nobody inserts mid-scroll', 'An infinite-scroll feed with new posts every second', 'A chat history with millions of messages', 'A notification stream ordered by time'],
      ['cuongthai.com: feed and messenger are cursor; admin tables stay offset on purpose. Two mechanisms, chosen per use case.', 'cuongthai.com: bảng tin và tin nhắn dùng cursor; bảng quản trị cố ý giữ offset. Hai cơ chế, chọn theo từng trường hợp.']),
  ],
  goiY: [['Ask whether the data changes WHILE the user pages through it.', 'Hỏi xem dữ liệu có thay đổi TRONG LÚC người dùng lật trang không.'], ['OFFSET = “walk N rows, then start”; cursor = “jump to this key, then start”.', 'OFFSET = "đi qua N dòng rồi mới bắt đầu"; cursor = "nhảy tới khoá này rồi bắt đầu".']],
  loi: [['Thinking OFFSET is a cheap seek because it is backed by an index.', 'Nghĩ OFFSET là phép nhảy rẻ vì có chỉ mục.'], ['A cursor on createdAt alone, without the id tie-breaker.', 'Cursor chỉ có createdAt, thiếu cột phá hoà id.']],
  tns: [tn('offset drift', 'trôi offset', 'Insert/xoá giữa hai trang làm trùng hoặc sót dòng.'), tn('keyset / cursor pagination', 'phân trang theo khoá', 'Lấy các dòng sau một khoá ổn định.'), tn('tie-breaker', 'cột phá hoà', 'id thêm vào thứ tự để khoá là duy nhất.')],
  kn: ['pagination'],
});

/* ── 2. Kế hoạch offset — và cái giá của nó ── */
function offsetPlan(query) {
  // everything in req.query is a string; missing/garbage -> defaults
  const page = Math.max(1, Math.trunc(Number(query.page)) || 1);
  const asked = Math.trunc(Number(query.limit)) || 20;
  const limit = Math.min(50, Math.max(1, asked));            // rule zero: a list endpoint ALWAYS has a limit (clamped here)
  const offset = (page - 1) * limit;
  return {
    page, limit, offset,
    sql: 'SELECT * FROM notes ORDER BY id LIMIT ' + limit + ' OFFSET ' + offset,
    rowsScanned: offset + limit,                               // OFFSET is count-and-discard: O(offset + limit)
  };
}
const E2 = jsBai({
  ten: '6.4 · 2 — Write offsetPlan(query): page/limit → SQL, with the cap and the real cost', kho: 'EASY', phut: 10,
  en: `<p>Rule zero of lesson 6.4: a list endpoint always has a limit. Write <code>offsetPlan(query)</code> for <code>GET /notes?page=3&amp;limit=20</code> (values are strings or absent) returning <code>{ page, limit, offset, sql, rowsScanned }</code>:</p>
<ul><li><code>page</code>: the integer part of <code>Number(query.page)</code>; missing, NaN, 0 or negative ⇒ <code>1</code>.</li>
<li><code>limit</code>: the integer part of <code>Number(query.limit)</code>; missing/NaN/0 ⇒ <code>20</code>; then <b>clamp</b> to <code>1…50</code> (this endpoint serves your own browser app, so it clamps instead of rejecting).</li>
<li><code>offset = (page − 1) × limit</code>; <code>sql = "SELECT * FROM notes ORDER BY id LIMIT &lt;limit&gt; OFFSET &lt;offset&gt;"</code>.</li>
<li><code>rowsScanned = offset + limit</code> — what EXPLAIN ANALYZE showed: the database walks every skipped row.</li></ul>`,
  vi: `<p>Luật số 0 của bài 6.4: endpoint danh sách luôn có giới hạn. Viết <code>offsetPlan(query)</code> cho <code>GET /notes?page=3&amp;limit=20</code> (giá trị là chuỗi hoặc vắng) trả <code>{ page, limit, offset, sql, rowsScanned }</code>:</p>
<ul><li><code>page</code>: phần nguyên của <code>Number(query.page)</code>; vắng, NaN, 0 hay âm ⇒ <code>1</code>.</li>
<li><code>limit</code>: phần nguyên của <code>Number(query.limit)</code>; vắng/NaN/0 ⇒ <code>20</code>; rồi <b>kẹp</b> vào <code>1…50</code> (endpoint này phục vụ app trình duyệt của chính bạn, nên kẹp thay vì từ chối).</li>
<li><code>offset = (page − 1) × limit</code>; <code>sql = "SELECT * FROM notes ORDER BY id LIMIT &lt;limit&gt; OFFSET &lt;offset&gt;"</code>.</li>
<li><code>rowsScanned = offset + limit</code> — đúng như EXPLAIN ANALYZE cho thấy: CSDL đi qua mọi dòng bị bỏ.</li></ul>`,
  yc: [['Never produce a limit above 50 or below 1.', 'Không bao giờ cho limit trên 50 hay dưới 1.'], ['Numbers in the result are numbers, not strings.', 'Số trong kết quả là số, không phải chuỗi.']],
  goiY: [['<code>Math.trunc(Number(x)) || default</code> handles missing, NaN and 0 in one go.', '<code>Math.trunc(Number(x)) || mặc định</code> xử lý cùng lúc vắng, NaN và 0.'], ['Clamp: <code>Math.min(50, Math.max(1, asked))</code>.', 'Kẹp: <code>Math.min(50, Math.max(1, asked))</code>.']],
  loi: [['No maximum: <code>?limit=1000000</code> loads the table into RAM and blocks the event loop in JSON.stringify.', 'Không có trần: <code>?limit=1000000</code> nạp cả bảng vào RAM và chặn event loop trong JSON.stringify.'], ['<code>offset = page × limit</code> — page 1 skips the first page.', '<code>offset = page × limit</code> — trang 1 bỏ mất trang đầu.']],
  gt: ['The cap protects the process; the rowsScanned number explains why offset pages get slower the deeper you go: 20 rows on page 1, 500,020 rows on page 25,001 — for the same 20 rows of output.', 'Trần bảo vệ tiến trình; con số rowsScanned giải thích vì sao trang offset càng sâu càng chậm: 20 dòng ở trang 1, 500.020 dòng ở trang 25.001 — cho cùng 20 dòng kết quả.'],
  kn: ['pagination', 'limit cap'],
  tns: [tn('clamp', 'kẹp', 'Đưa giá trị về trong khoảng cho phép.'), tn('OFFSET', 'OFFSET', 'Bỏ qua N dòng — vẫn phải đọc chúng.')],
  dau: `function offsetPlan(query) {
  // Write your solution here
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 20);
  const offset = page * limit;
  return { page, limit, offset, sql: 'SELECT * FROM notes ORDER BY id LIMIT ' + limit + ' OFFSET ' + offset, rowsScanned: limit };
}
`,
  giai: offsetPlan,
  cases: [
    { goi: goi('offsetPlan', { page: '3', limit: '20' }) },
    { goi: goi('offsetPlan', {}), moTa: ['No query ⇒ page 1, limit 20', 'Không có query ⇒ trang 1, limit 20'] },
    { goi: goi('offsetPlan', { page: '25001', limit: '1000000' }), moTa: ['Huge limit is clamped to 50', 'limit khổng lồ bị kẹp về 50'] },
    { goi: goi('offsetPlan', { page: '-4', limit: 'abc' }), an: true },
    { goi: goi('offsetPlan', { page: '2.9', limit: '-5' }), an: true },
    { goi: goi('offsetPlan', { page: '50001', limit: '20' }), an: true },
  ],
});

/* ── 3. Trôi offset vs cursor — tái hiện lỗi ── */
function pageByOffset(ids, page, limit) {
  const sorted = [...ids].sort((a, b) => b - a);          // newest first: ORDER BY id DESC
  return sorted.slice((page - 1) * limit, page * limit);  // LIMIT limit OFFSET (page-1)*limit — a POSITION
}
function pageByCursor(ids, before, limit) {
  const sorted = [...ids].sort((a, b) => b - a);
  // WHERE id < before ORDER BY id DESC LIMIT limit — anchored to a ROW (null = first page)
  return sorted.filter((id) => before == null || id < before).slice(0, limit);
}
function scroll(mode, ids, limit, changeAfterPage1) {
  // read page 1, let the world change, read page 2 — exactly the lesson's experiment
  const p1 = mode === 'offset' ? pageByOffset(ids, 1, limit) : pageByCursor(ids, null, limit);
  const now = changeAfterPage1(ids);
  const p2 = mode === 'offset' ? pageByOffset(now, 2, limit) : pageByCursor(now, p1[p1.length - 1], limit);
  return { page1: p1, page2: p2, duplicates: p2.filter((id) => p1.includes(id)) };
}
const IDS = [999995, 999996, 999997, 999998, 999999, 1000000];
const E3 = jsBai({
  ten: '6.4 · 3 — Reproduce offset drift: pageByOffset, pageByCursor and scroll()', kho: 'MEDIUM', phut: 18,
  en: `<p>Reproduce lesson 6.4’s bug on plain arrays of ids (a newest-first feed = sorted by id descending). Write:</p>
<ul><li><code>pageByOffset(ids, page, limit)</code> — the page at position <code>(page − 1) × limit</code> of the sorted ids.</li>
<li><code>pageByCursor(ids, before, limit)</code> — the first <code>limit</code> sorted ids that are <code>&lt; before</code>; <code>before = null</code> means the first page.</li>
<li><code>scroll(mode, ids, limit, change)</code> — <code>mode</code> is <code>"offset"</code> or <code>"cursor"</code>: read page 1, then <code>const now = change(ids)</code> (a function that returns the ids after someone inserts or deletes), then read page 2 from <code>now</code> (cursor mode: <code>before</code> = the last id of page 1). Return <code>{ page1, page2, duplicates }</code>, where <code>duplicates</code> = ids of page 2 already shown on page 1.</li></ul>
<p>Do not mutate <code>ids</code>. With the lesson’s data the offset scroll shows <code>999998</code> twice; the cursor scroll shows <code>999997, 999996, 999995</code>.</p>`,
  vi: `<p>Tái hiện lỗi của bài 6.4 trên mảng id thường (bảng tin mới nhất trước = sắp theo id giảm dần). Viết:</p>
<ul><li><code>pageByOffset(ids, page, limit)</code> — trang ở vị trí <code>(page − 1) × limit</code> của các id đã sắp.</li>
<li><code>pageByCursor(ids, before, limit)</code> — <code>limit</code> id đầu tiên (đã sắp) mà <code>&lt; before</code>; <code>before = null</code> nghĩa là trang đầu.</li>
<li><code>scroll(mode, ids, limit, change)</code> — <code>mode</code> là <code>"offset"</code> hoặc <code>"cursor"</code>: đọc trang 1, rồi <code>const now = change(ids)</code> (hàm trả về các id sau khi có người thêm hay xoá), rồi đọc trang 2 từ <code>now</code> (chế độ cursor: <code>before</code> = id cuối của trang 1). Trả <code>{ page1, page2, duplicates }</code>, với <code>duplicates</code> = các id của trang 2 đã hiện ở trang 1.</li></ul>
<p>Không sửa <code>ids</code>. Với dữ liệu của bài, cuộn offset hiện <code>999998</code> hai lần; cuộn cursor hiện <code>999997, 999996, 999995</code>.</p>`,
  yc: [['Sort a copy, never the input array.', 'Sắp một bản sao, không sắp mảng đầu vào.'], ['Cursor pages are anchored to the last id shown, not to a position.', 'Trang cursor neo vào id cuối đã hiện, không neo vào vị trí.']],
  goiY: [['<code>[...ids].sort((a, b) => b - a)</code> then <code>slice</code> for offset, <code>filter</code> + <code>slice</code> for cursor.', '<code>[...ids].sort((a, b) => b - a)</code> rồi <code>slice</code> cho offset, <code>filter</code> + <code>slice</code> cho cursor.'], ['In <code>scroll</code>, call <code>change(ids)</code> only once, between the two page reads.', 'Trong <code>scroll</code>, gọi <code>change(ids)</code> đúng một lần, giữa hai lần đọc trang.']],
  loi: [['<code>ids.sort()</code> without a comparator sorts as strings and mutates the input: "1000000" sorts before "999995".', '<code>ids.sort()</code> không có hàm so sánh sắp theo chuỗi và sửa luôn đầu vào: "1000000" đứng trước "999995".'], ['Using the page number in cursor mode — then it is just offset with extra steps.', 'Dùng số trang ở chế độ cursor — khi đó nó chỉ là offset đi đường vòng.']],
  gt: ['OFFSET names a position in a result set that is recomputed on every request, so any insert above the window shifts it (duplicate) and any delete shifts it the other way (skip). A cursor names a row: the next page is “rows after this one”, which no insert or delete elsewhere can move. That is why the bug never reproduces on a test database where nothing is written.', 'OFFSET gọi tên một vị trí trong tập kết quả được tính lại ở mỗi request, nên insert phía trên cửa sổ làm nó dịch (trùng) và xoá làm nó dịch ngược (sót). Cursor gọi tên một dòng: trang sau là "các dòng sau dòng này", không insert hay xoá nào ở chỗ khác dời được nó. Vì thế lỗi không bao giờ tái hiện trên CSDL thử nghiệm không ai ghi.'],
  kn: ['pagination', 'offset drift'],
  tns: [tn('anchor', 'mỏ neo', 'Cursor neo vào một dòng.'), tn('result set', 'tập kết quả', 'Các dòng một truy vấn trả về.')],
  dau: `function pageByOffset(ids, page, limit) {
  // Write your solution here
  return ids.sort().slice(page * limit, page * limit + limit);
}
function pageByCursor(ids, before, limit) {
  return pageByOffset(ids, 1, limit);
}
function scroll(mode, ids, limit, change) {
  return { page1: [], page2: [], duplicates: [] };
}
`,
  giai: [pageByOffset, pageByCursor, scroll],
  cases: [
    { goi: `scroll('offset', ${JSON.stringify(IDS)}, 3, (ids) => [...ids, 1000001])`, moTa: ['Offset + an insert ⇒ 999998 twice', 'Offset + một insert ⇒ 999998 hai lần'] },
    { goi: `scroll('cursor', ${JSON.stringify(IDS)}, 3, (ids) => [...ids, 1000001])`, moTa: ['Cursor + the same insert ⇒ no duplicate', 'Cursor + cùng insert ⇒ không trùng'] },
    { goi: `[pageByOffset(${JSON.stringify(IDS)}, 2, 4), pageByCursor(${JSON.stringify(IDS)}, null, 2)]` },
    { goi: `scroll('offset', ${JSON.stringify(IDS)}, 2, (ids) => ids.filter((id) => id !== 999999))`, an: true, moTa: ['Offset + a delete ⇒ a row is skipped', 'Offset + một lần xoá ⇒ một dòng bị sót'] },
    { goi: `scroll('cursor', ${JSON.stringify(IDS)}, 2, (ids) => ids.filter((id) => id !== 999999))`, an: true },
    { goi: `(() => { const ids = [3, 10, 2, 100]; const r = pageByOffset(ids, 1, 2); return [r, ids]; })()`, an: true, moTa: ['Numeric sort, input untouched', 'Sắp theo số, đầu vào giữ nguyên'] },
    { goi: `scroll('cursor', [5, 4, 3, 2, 1], 2, (ids) => [...ids, 6, 7, 8])`, an: true },
  ],
});

/* ── 4. ORDER BY an toàn ── */
function orderByClause(query) {
  // the set of sortable fields is a deliberate API decision — and the mapping to SQL identifiers is OURS
  const SORTABLE = { createdAt: '"createdAt"', title: 'title', updatedAt: '"updatedAt"' };
  const sort = query.sort ?? 'createdAt';                     // a stable default: without ORDER BY, pagination is lossy
  const order = (query.order ?? 'desc').toLowerCase();
  if (!Object.prototype.hasOwnProperty.call(SORTABLE, sort)) throw new AppError(422, 'INVALID_SORT', 'sort must be one of ' + Object.keys(SORTABLE).join(', '));
  if (order !== 'asc' && order !== 'desc') throw new AppError(422, 'INVALID_ORDER', 'order must be asc or desc');
  const dir = order.toUpperCase();
  // the id tie-breaker goes in the SAME direction, so the order is total and a cursor can be built on it
  return 'ORDER BY ' + SORTABLE[sort] + ' ' + dir + ', id ' + dir;
}
const E4 = jsBai({
  ten: '6.4 · 4 — Write orderByClause(query): sorting from the query string without SQL injection', kho: 'MEDIUM', phut: 12,
  en: `<p>“Column names cannot be passed as query parameters — a placeholder works for values, never for identifiers.” So a sort field from the URL must go through an <b>allow-list</b>. Write <code>orderByClause(query)</code>:</p>
<ul><li>Sortable fields and their SQL identifiers: <code>createdAt → "createdAt"</code>, <code>title → title</code>, <code>updatedAt → "updatedAt"</code> (Prisma’s camelCase columns need double quotes).</li>
<li>Defaults: <code>sort = "createdAt"</code>, <code>order = "desc"</code>; <code>order</code> is case-insensitive (<code>ASC</code> is fine).</li>
<li>A sort not on the list ⇒ throw <code>new AppError(422, 'INVALID_SORT', …)</code>; an order other than asc/desc ⇒ <code>AppError(422, 'INVALID_ORDER', …)</code>.</li>
<li>Always add the tie-breaker in the same direction: <code>ORDER BY "createdAt" DESC, id DESC</code>.</li></ul>
<p>Be careful with “is it on the list?”: <code>query.sort = "constructor"</code> or <code>"toString"</code> exist on every plain object.</p>`,
  vi: `<p>"Tên cột không truyền được dưới dạng tham số truy vấn — placeholder dùng cho giá trị, không bao giờ cho định danh." Vì vậy trường sắp xếp lấy từ URL phải đi qua <b>danh sách cho phép</b>. Viết <code>orderByClause(query)</code>:</p>
<ul><li>Trường cho sắp xếp và định danh SQL: <code>createdAt → "createdAt"</code>, <code>title → title</code>, <code>updatedAt → "updatedAt"</code> (cột camelCase của Prisma cần ngoặc kép).</li>
<li>Mặc định: <code>sort = "createdAt"</code>, <code>order = "desc"</code>; <code>order</code> không phân biệt hoa thường (<code>ASC</code> được).</li>
<li>sort không có trong danh sách ⇒ ném <code>new AppError(422, 'INVALID_SORT', …)</code>; order khác asc/desc ⇒ <code>AppError(422, 'INVALID_ORDER', …)</code>.</li>
<li>Luôn thêm cột phá hoà cùng chiều: <code>ORDER BY "createdAt" DESC, id DESC</code>.</li></ul>
<p>Cẩn thận với phép "có trong danh sách không?": <code>query.sort = "constructor"</code> hay <code>"toString"</code> có sẵn trên mọi object thường.</p>`,
  yc: [['The client value never appears in the returned SQL — only your own identifiers do.', 'Giá trị của client không bao giờ xuất hiện trong SQL trả về — chỉ có định danh của bạn.'], ['Always end with the id tie-breaker.', 'Luôn kết thúc bằng cột phá hoà id.']],
  goiY: [['Keep a map <code>{ createdAt: \'"createdAt"\', … }</code> and check it with <code>Object.prototype.hasOwnProperty.call(map, sort)</code>.', 'Giữ một bảng <code>{ createdAt: \'"createdAt"\', … }</code> và kiểm bằng <code>Object.prototype.hasOwnProperty.call(map, sort)</code>.'], ['Lower-case the order before comparing, upper-case it when writing SQL.', 'Hạ chữ thường order trước khi so, viết hoa khi ghi vào SQL.']],
  loi: [['<code>"ORDER BY " + query.sort</code> — SQL injection with extra steps.', '<code>"ORDER BY " + query.sort</code> — SQL injection đi đường vòng.'], ['<code>if (map[sort])</code> — <code>"constructor"</code> passes because every object inherits it.', '<code>if (map[sort])</code> — <code>"constructor"</code> lọt qua vì object nào cũng thừa kế nó.'], ['Forgetting the tie-breaker: two rows with the same createdAt come back in any order, and pagination silently loses rows.', 'Quên cột phá hoà: hai dòng cùng createdAt trả về thứ tự tuỳ ý, và phân trang lặng lẽ mất dòng.']],
  gt: ['Escaping is the wrong tool for identifiers; choosing is the right one. Because the returned SQL only ever contains strings you wrote, no client input can change its meaning. The tie-breaker makes the order total, which is what both offset and cursor pagination silently rely on.', 'Thoát ký tự là công cụ sai cho định danh; chọn mới là công cụ đúng. Vì SQL trả về chỉ chứa chuỗi do bạn viết, không input nào của client đổi được nghĩa của nó. Cột phá hoà làm thứ tự thành toàn phần — điều mà cả phân trang offset lẫn cursor đều ngầm dựa vào.'],
  kn: ['SQL injection', 'sorting'],
  tns: [tn('identifier', 'định danh', 'Tên bảng/cột trong SQL.'), tn('allow-list', 'danh sách cho phép')],
  tro: `// provided — the AppError of lesson 5.4\n${APP_ERROR}\n`,
  dau: `function orderByClause(query) {
  // Write your solution here
  return 'ORDER BY ' + (query.sort || 'createdAt') + ' ' + (query.order || 'desc');
}
`,
  giai: orderByClause,
  chung: `const tryIt = (q) => { try { return orderByClause(q); } catch (e) { return { thrown: e.name, status: e.status, code: e.code }; } };`,
  cases: [
    { goi: `tryIt({})`, moTa: ['Defaults', 'Mặc định'] },
    { goi: `tryIt({ sort: 'title', order: 'ASC' })` },
    { goi: `tryIt({ sort: 'title; DROP TABLE "Note"' })`, moTa: ['Injection attempt ⇒ 422', 'Thử chèn mã ⇒ 422'] },
    { goi: `[tryIt({ sort: 'constructor' }), tryIt({ sort: 'toString' }), tryIt({ sort: '__proto__' })]`, an: true },
    { goi: `[tryIt({ sort: 'updatedAt', order: 'Desc' }), tryIt({ order: 'sideways' })]`, an: true },
    { goi: `tryIt({ sort: 'createdAt', order: 'asc' })`, an: true },
  ],
  saiMau: [
    orderByClause.toString().replace("if (!Object.prototype.hasOwnProperty.call(SORTABLE, sort))", 'if (!SORTABLE[sort])'),
    orderByClause.toString().replace(" + ', id ' + dir", ''),
  ],
});

/* ── 5. Bảng tin cursor mờ (createdAt, id) ── */
function encodeCursor(row) {
  // opaque to the client: base64url of JSON — the shape stays ours to change
  return b64url(utf8(JSON.stringify({ createdAt: row.createdAt, id: row.id })));
}
function decodeCursor(text) {
  const bytes = unb64url(text);
  let c = null;
  try { c = bytes && JSON.parse(fromUtf8(bytes)); } catch { c = null; }
  if (!c || typeof c.createdAt !== 'string' || !Number.isInteger(c.id)) throw new AppError(400, 'INVALID_CURSOR', 'cursor is not valid');
  return c;
}
function feedPage(rows, query) {
  const limit = Math.min(50, Math.max(1, Math.trunc(Number(query.limit)) || 20));
  // newest first, with id as the tie-breaker: ORDER BY "createdAt" DESC, id DESC
  const ordered = [...rows].sort((a, b) => (a.createdAt === b.createdAt ? b.id - a.id : (a.createdAt < b.createdAt ? 1 : -1)));
  let after = ordered;
  if (query.cursor) {
    const c = decodeCursor(query.cursor);
    // WHERE ("createdAt", id) < ($1, $2) — a row-value comparison, both columns together
    after = ordered.filter((r) => r.createdAt < c.createdAt || (r.createdAt === c.createdAt && r.id < c.id));
  }
  const window = after.slice(0, limit + 1);                 // one extra row answers "is there more?" — no count(*)
  const hasMore = window.length > limit;
  const items = hasMore ? window.slice(0, limit) : window;
  return { items, nextCursor: hasMore ? encodeCursor(items[items.length - 1]) : null, hasMore };
}
const FEED = [
  { id: 1, createdAt: '2026-07-27T09:00:00.000Z' }, { id: 2, createdAt: '2026-07-27T10:00:00.000Z' }, { id: 3, createdAt: '2026-07-27T10:00:00.000Z' },
  { id: 4, createdAt: '2026-07-28T08:30:00.000Z' }, { id: 5, createdAt: '2026-07-28T09:00:00.000Z' }, { id: 6, createdAt: '2026-07-28T09:00:00.000Z' },
  { id: 7, createdAt: '2026-07-28T09:00:00.000Z' }, { id: 8, createdAt: '2026-07-29T07:00:00.000Z' },
];
const E5 = jsBai({
  ten: '6.4 · 5 — Write feedPage(rows, query): an opaque (createdAt, id) cursor with hasMore and no count', kho: 'HARD', phut: 30,
  en: `<p>Lesson 6.4’s final design for a newest-first feed, on an in-memory array of rows <code>{ id, createdAt }</code> (ISO strings — they sort correctly as text). Write <code>feedPage(rows, query)</code> returning <code>{ items, nextCursor, hasMore }</code>:</p>
<ul><li>Order: <code>createdAt</code> descending, then <code>id</code> descending (several rows share a timestamp).</li>
<li><code>limit</code>: integer part of <code>Number(query.limit)</code>; missing/NaN/0 ⇒ 20; then clamped to 1…50.</li>
<li><code>query.cursor</code> (optional) is an <b>opaque</b> string: base64url of <code>JSON.stringify({ createdAt, id })</code> of the last row of the previous page. The next page = rows strictly after it in the order above — i.e. <code>(createdAt, id) &lt; (cursor.createdAt, cursor.id)</code>.</li>
<li>A cursor that is not valid base64url, not JSON, or lacks a string <code>createdAt</code> / integer <code>id</code> ⇒ throw <code>new AppError(400, 'INVALID_CURSOR', 'cursor is not valid')</code>.</li>
<li>Fetch <code>limit + 1</code> rows: if you got the extra one, <code>hasMore = true</code> and <code>nextCursor</code> = cursor of the last returned item; otherwise <code>hasMore = false</code>, <code>nextCursor = null</code>.</li></ul>
<p><code>helpers.js</code> gives you <code>utf8(str)</code>, <code>fromUtf8(bytes)</code>, <code>b64url(bytes)</code>, <code>unb64url(text)</code> (null if invalid) and <code>AppError</code> — the grader has no <code>Buffer</code>. Hidden checks walk the whole feed page by page and require every row exactly once.</p>`,
  vi: `<p>Thiết kế cuối của bài 6.4 cho bảng tin mới nhất trước, trên mảng dòng <code>{ id, createdAt }</code> trong bộ nhớ (chuỗi ISO — sắp theo chữ là đúng thứ tự). Viết <code>feedPage(rows, query)</code> trả <code>{ items, nextCursor, hasMore }</code>:</p>
<ul><li>Thứ tự: <code>createdAt</code> giảm dần, rồi <code>id</code> giảm dần (nhiều dòng cùng thời điểm).</li>
<li><code>limit</code>: phần nguyên của <code>Number(query.limit)</code>; vắng/NaN/0 ⇒ 20; rồi kẹp vào 1…50.</li>
<li><code>query.cursor</code> (tuỳ chọn) là chuỗi <b>mờ</b>: base64url của <code>JSON.stringify({ createdAt, id })</code> của dòng cuối trang trước. Trang sau = các dòng đứng sau nó theo thứ tự trên — tức <code>(createdAt, id) &lt; (cursor.createdAt, cursor.id)</code>.</li>
<li>Cursor không phải base64url hợp lệ, không phải JSON, hay thiếu <code>createdAt</code> chuỗi / <code>id</code> số nguyên ⇒ ném <code>new AppError(400, 'INVALID_CURSOR', 'cursor is not valid')</code>.</li>
<li>Lấy <code>limit + 1</code> dòng: có dòng thừa thì <code>hasMore = true</code> và <code>nextCursor</code> = cursor của phần tử cuối được trả; không thì <code>hasMore = false</code>, <code>nextCursor = null</code>.</li></ul>
<p><code>helpers.js</code> cho sẵn <code>utf8(str)</code>, <code>fromUtf8(bytes)</code>, <code>b64url(bytes)</code>, <code>unb64url(text)</code> (null nếu sai) và <code>AppError</code> — máy chấm không có <code>Buffer</code>. Kiểm ẩn đi hết bảng tin từng trang và đòi mỗi dòng xuất hiện đúng một lần.</p>`,
  yc: [['Compare (createdAt, id) together — never createdAt alone.', 'So (createdAt, id) cùng nhau — không bao giờ chỉ createdAt.'], ['No total and no count: hasMore comes from the extra row.', 'Không total và không đếm: hasMore đến từ dòng thừa.'], ['The cursor is built by the server; a client-invented one is rejected with 400.', 'Cursor do server dựng; cursor client bịa bị từ chối với 400.']],
  goiY: [['Sort a copy with a comparator that falls back to <code>b.id - a.id</code> when the timestamps are equal.', 'Sắp một bản sao với hàm so sánh rơi về <code>b.id - a.id</code> khi thời điểm bằng nhau.'], ['After the cursor filter: <code>const w = after.slice(0, limit + 1)</code>; <code>hasMore = w.length > limit</code>; return the first <code>limit</code>.', 'Sau bộ lọc cursor: <code>const w = after.slice(0, limit + 1)</code>; <code>hasMore = w.length > limit</code>; trả <code>limit</code> phần tử đầu.'], ['Decoding: <code>unb64url</code> → null check → <code>JSON.parse(fromUtf8(bytes))</code> in try/catch → validate both fields.', 'Giải mã: <code>unb64url</code> → kiểm null → <code>JSON.parse(fromUtf8(bytes))</code> trong try/catch → kiểm cả hai trường.']],
  loi: [['<code>r.createdAt &lt; cursor.createdAt</code> alone: rows 6 and 5 share 09:00 with row 7, so a page boundary there skips them.', 'Chỉ <code>r.createdAt &lt; cursor.createdAt</code>: dòng 6 và 5 cùng 09:00 với dòng 7, nên ranh giới trang ở đó bỏ sót chúng.'], ['<code>&lt;=</code> instead of <code>&lt;</code> on id: the last row of a page reappears as the first row of the next.', '<code>&lt;=</code> thay vì <code>&lt;</code> trên id: dòng cuối trang này xuất hiện lại ở đầu trang sau.'], ['Computing hasMore as <code>items.length === limit</code>: a final page of exactly <code>limit</code> rows promises a next page that is empty.', 'Tính hasMore bằng <code>items.length === limit</code>: trang cuối có đúng <code>limit</code> dòng hứa một trang sau trống rỗng.']],
  gt: ['The pair (createdAt, id) is unique, so “strictly after this pair” is a well-defined position that inserts and deletes cannot shift — the property that makes a cursor correct, not just fast. Encoding it as opaque base64url keeps the shape yours: you can add a field later without touching any client. And limit + 1 answers hasMore with zero extra queries — the 45 ms count(*) disappears.', 'Cặp (createdAt, id) là duy nhất, nên "ngay sau cặp này" là một vị trí xác định mà insert hay xoá không dời được — tính chất làm cursor ĐÚNG, không chỉ nhanh. Mã hoá thành base64url mờ giữ hình dạng là của bạn: sau này thêm trường không phải sửa client nào. Và limit + 1 trả lời hasMore mà không cần truy vấn thêm — count(*) 45 ms biến mất.'],
  kn: ['cursor pagination', 'keyset'],
  tns: [tn('opaque cursor', 'cursor mờ', 'Chuỗi client chỉ gửi lại, không tự dựng.'), tn('row-value comparison', 'so sánh bộ giá trị', '(a, b) < (x, y) trong SQL.'), tn('hasMore', 'còn nữa', 'Có trang sau hay không.')],
  tro: `${TRO_GIUP_HMAC}\n// provided — the AppError of lesson 5.4\n${APP_ERROR}\n`,
  dau: `function feedPage(rows, query) {
  // Write your solution here
  const limit = Number(query.limit) || 20;
  const ordered = [...rows].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  const start = query.cursor ? Number(query.cursor) : 0;
  const items = ordered.slice(start, start + limit);
  return { items, nextCursor: String(start + limit), hasMore: items.length === limit };
}
`,
  giai: [encodeCursor, decodeCursor, feedPage],
  chung: `const FEED = ${JSON.stringify(FEED)};
const walk = (rows, limit) => { const seen = []; let cursor; for (let i = 0; i < 20; i++) { const p = feedPage(rows, { limit: String(limit), cursor }); seen.push(p.items.map((r) => r.id)); if (!p.hasMore) return { pages: seen, last: p }; cursor = p.nextCursor; } return { pages: seen, stuck: true }; };
const tryIt = (q) => { try { return feedPage(FEED, q); } catch (e) { return { thrown: e.name, status: e.status, code: e.code }; } };`,
  cases: [
    { goi: `feedPage(FEED, { limit: '3' })`, moTa: ['First page, limit 3', 'Trang đầu, limit 3'] },
    { goi: `(() => { const p1 = feedPage(FEED, { limit: '3' }); return feedPage(FEED, { limit: '3', cursor: p1.nextCursor }).items.map((r) => r.id); })()`, moTa: ['Second page crosses the 09:00 tie', 'Trang hai đi qua chỗ hoà 09:00'] },
    { goi: `tryIt({ cursor: '%%%not-base64%%%' })`, moTa: ['Invented cursor ⇒ 400', 'Cursor bịa ⇒ 400'] },
    { goi: `[walk(FEED, 2).pages, walk(FEED, 4).pages, walk(FEED, 8).pages]`, an: true, moTa: ['Walk the feed: every row exactly once', 'Đi hết bảng tin: mỗi dòng đúng một lần'] },
    { goi: `[tryIt({ cursor: b64url(utf8('{"createdAt":5,"id":1}')) }), tryIt({ cursor: b64url(utf8('not json')) }), tryIt({ cursor: b64url(utf8('{"createdAt":"2026-07-28T09:00:00.000Z","id":"6"}')) })]`, an: true },
    { goi: `[feedPage(FEED, { limit: '0' }).items.length, feedPage(FEED, { limit: '1000' }).hasMore, feedPage([], {})]`, an: true },
    { goi: `feedPage(FEED, { limit: '2', cursor: b64url(utf8(JSON.stringify({ createdAt: '2026-07-28T09:00:00.000Z', id: 6 }))) })`, an: true },
  ],
  saiMau: [
    feedPage.toString().replace('r.createdAt < c.createdAt || (r.createdAt === c.createdAt && r.id < c.id)', 'r.createdAt < c.createdAt'),
    feedPage.toString().replace('r.id < c.id', 'r.id <= c.id'),
  ].map((f) => `${encodeCursor}\n${decodeCursor}\n${f}`),
});

export default modul('nodejs-6-4-phan-trang', '6.4 Pagination, filtering and sorting', [E1, E2, E3, E4, E5]);
