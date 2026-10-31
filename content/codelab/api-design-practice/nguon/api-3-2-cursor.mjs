/** API Design · 3.2 — Phân trang con trỏ: "sau vị trí này", keyset SQL, chọn offset hay con trỏ (số đo thật của bài 3.2). */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi } from './_api.mjs';

/* ── 1. Tình huống ── */
const E1 = cs({
  ten: 'Cursor 1 — Bookmarks, not page numbers', kho: 'EASY', phut: 10,
  en: 'Facts from lesson 3.2 (real LabFlow runs and PostgreSQL 18.4 plans).',
  vi: 'Những điều từ bài 3.2 (chạy thật trên LabFlow và kế hoạch PostgreSQL 18.4).',
  cau: [
    q('c1', ['Page 1 ends at bk_196, An inserts bk_201, the client sends page.next. Page 2 starts with …', 'Trang 1 kết thúc ở bk_196, An chèn bk_201, client gửi page.next. Trang 2 bắt đầu bằng …'], ['bk_195 — the row right after the bookmark', 'bk_196 — the new row pushed it down', 'bk_201 — new rows always come first', 'an INVALID_CURSOR error, because the list changed'], ['The cursor says “after (createdAt, id) of bk_196”; inserts above that position do not move it.', 'Con trỏ nói "sau (createdAt, id) của bk_196"; dòng chèn phía trên vị trí đó không làm nó lệch.']),
    q('c2', ['Decoded, LabFlow’s 3.2 cursor is {"createdAt":"2026-10-01T03:19:00.000Z","id":"bk_199"}. Why is it documented as opaque?', 'Giải mã ra, con trỏ 3.2 của LabFlow là {"createdAt":"2026-10-01T03:19:00.000Z","id":"bk_199"}. Vì sao tài liệu ghi nó là "mờ"?'], ['Once clients parse it, the server can never change its format', 'Because it contains secrets that clients must not see', 'Because base64url cannot be decoded in browsers', 'Because the HTTP standard forbids JSON in query strings'], ['Nothing secret inside. “Opaque” is a contract: copy it back, never read or build it — so the server stays free to change it (lesson 3.4 does).', 'Bên trong chẳng có gì bí mật. "Mờ" là một hợp đồng: chép gửi lại, không đọc hay tự dựng — để server còn được đổi nó (bài 3.4 đã đổi).']),
    q('c3', ['A cursor holding only createdAt fails when …', 'Con trỏ chỉ chứa createdAt hỏng khi …'], ['two rows share the same createdAt — “after this time” skips the twin', 'the list grows beyond 100 rows and the limit has to be raised', 'the client sends the same cursor twice in a row by accident', 'createdAt is stored in UTC instead of Hanoi time'], ['The position must be unique: every sort key plus a unique tie-breaker (the id).', 'Vị trí phải là duy nhất: mọi khoá sắp xếp cộng một khoá phụ duy nhất (id).']),
    q('c4', ['Keyset at depth 900 000 took 0.064 ms; OFFSET took 78.316 ms. What does the keyset plan show?', 'Keyset ở độ sâu 900 000 mất 0,064 ms; OFFSET mất 78,316 ms. Kế hoạch keyset cho thấy gì?'], ['An Index Cond on (created_at, id) and rows=20', 'A sequential scan of the whole table', 'rows=900020, but read from cache', 'A sort of one million rows in memory'], ['The row comparison lets the index seek straight to the bookmark — 20 rows read at any depth.', 'Phép so sánh cả hàng cho index tìm thẳng tới bookmark — đọc 20 dòng ở mọi độ sâu.']),
    q('c5', ['After 3.2 a client still sends ?offset=5. LabFlow answers …', 'Sau bài 3.2 một client vẫn gửi ?offset=5. LabFlow trả …'], ['400 — offset is now an unknown parameter of the strict schema', '200, silently ignoring the unknown offset parameter', '200 with page 2, because offset still works as before', '410 Gone, because offset pagination was retired'], ['A breaking change. Fine before release; after release keep offset working for a while (Chapter 4).', 'Một thay đổi phá vỡ. Ổn trước khi phát hành; sau khi phát hành phải giữ offset chạy thêm một thời gian (Chương 4).']),
  ],
  goiY: [['A cursor is the position of the LAST item you received.', 'Con trỏ là vị trí của phần tử CUỐI bạn đã nhận.'], ['Look at the measured plans again.', 'Xem lại các kế hoạch đã đo.']],
  loi: [['Thinking the cursor must be secret.', 'Nghĩ rằng con trỏ phải bí mật.'], ['Leaving the tie-breaker out of the cursor.', 'Bỏ khoá phụ khỏi con trỏ.']],
  tns: [tn('cursor', 'con trỏ phân trang'), tn('keyset / seek pagination', 'phân trang theo khoá')],
  kn: ['cursor pagination'],
});

/* ── 2. Tự viết: afterCursor ── */
function afterCursor(rows, cursor, limit) {
  const idNum = (id) => Number(id.slice(id.indexOf('_') + 1));
  const newestFirst = (a, b) => b.createdAt.localeCompare(a.createdAt) || idNum(b.id) - idNum(a.id);
  let list = [...rows].sort(newestFirst);
  if (cursor) list = list.filter((r) => newestFirst(cursor, r) < 0);
  const page = list.slice(0, limit);
  const last = page[page.length - 1];
  return { ids: page.map((r) => r.id), next: list.length > limit ? { createdAt: last.createdAt, id: last.id } : null };
}
const T = '2026-10-01T03:';
const R = [196, 197, 198, 199, 200].map((n) => ({ id: `bk_${n}`, createdAt: `${T}${n - 180}:00.000Z` }));
const TW = [{ id: 'bk_7', createdAt: `${T}05:00.000Z` }, { id: 'bk_8', createdAt: `${T}05:00.000Z` }, { id: 'bk_9', createdAt: `${T}05:00.000Z` }, { id: 'bk_6', createdAt: `${T}04:00.000Z` }];
const E2 = jsBai({
  ten: 'Cursor 2 — Write afterCursor(rows, cursor, limit)', kho: 'MEDIUM', phut: 15,
  en: `<p>Sort <code>rows</code> newest first (createdAt, then the id’s number, both descending). If <code>cursor</code> (<code>{ createdAt, id }</code>) is given, keep only the rows that come <b>after</b> it in that order. Return <code>{ ids, next }</code>: the ids of the first <code>limit</code> rows, and <code>next</code> = <code>{ createdAt, id }</code> of the last returned row when more rows remain, otherwise <code>null</code>.</p><p>Use <b>the same comparator</b> for sorting and for “after” — then the two can never disagree.</p>`,
  vi: `<p>Sắp <code>rows</code> mới nhất trước (createdAt, rồi con số của id, cả hai giảm dần). Nếu có <code>cursor</code> (<code>{ createdAt, id }</code>), chỉ giữ các dòng đứng <b>sau</b> nó theo thứ tự đó. Trả <code>{ ids, next }</code>: id của <code>limit</code> dòng đầu, và <code>next</code> = <code>{ createdAt, id }</code> của dòng cuối được trả khi còn dòng, ngược lại <code>null</code>.</p><p>Dùng <b>cùng một bộ so sánh</b> cho việc sắp và cho "sau" — khi đó hai việc không bao giờ lệch nhau.</p>`,
  dauVao: ['rows — [{ id, createdAt }]; cursor — { createdAt, id } | null; limit ≥ 1', 'rows — [{ id, createdAt }]; cursor — { createdAt, id } | null; limit ≥ 1'],
  dauRa: ['{ ids: string[], next: { createdAt, id } | null }', '{ ids: mảng chuỗi, next: { createdAt, id } | null }'],
  goiY: [['The cursor is shaped like a row, so newestFirst(cursor, r) &lt; 0 means “r comes after the cursor”.', 'Con trỏ có dạng giống một dòng, nên newestFirst(cursor, r) &lt; 0 nghĩa là "r đứng sau con trỏ".'], ['More rows remain ⇔ list.length &gt; limit — no total needed.', 'Còn dòng ⇔ list.length &gt; limit — không cần total.']],
  loi: [['Filtering by createdAt &lt; cursor.createdAt only — the twins with the same time disappear.', 'Chỉ lọc createdAt &lt; cursor.createdAt — các dòng sinh đôi cùng thời điểm biến mất.'], ['Returning a next cursor on the last page.', 'Trả con trỏ next ở trang cuối.']],
  gt: ['This is LabFlow’s handler from lesson 3.2. Twins (bk_9, bk_8, bk_7 at 03:05) page correctly only because the id is part of the position.', 'Đây là handler của LabFlow ở bài 3.2. Các dòng sinh đôi (bk_9, bk_8, bk_7 lúc 03:05) chỉ phân trang đúng vì id là một phần của vị trí.'],
  kn: ['cursor pagination'],
  tns: [tn('after', 'đứng sau (theo thứ tự sắp)'), tn('next cursor', 'con trỏ trang sau')],
  dau: `/** rows ⇒ the page after the cursor + the next cursor */
function afterCursor(rows, cursor, limit) {
  // Write your solution here
  let list = [...rows].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  if (cursor) list = list.filter((r) => r.createdAt < cursor.createdAt);
  const page = list.slice(0, limit), last = page[page.length - 1];
  return { ids: page.map((r) => r.id), next: last ? { createdAt: last.createdAt, id: last.id } : null };
}
`,
  giai: '// Reference solution\n' + nguon(afterCursor),
  cases: [
    { goi: goi('afterCursor', R, null, 2), moTa: ['First page', 'Trang đầu'] },
    { goi: goi('afterCursor', R, { createdAt: `${T}19:00.000Z`, id: 'bk_199' }, 2), moTa: ['After bk_199', 'Sau bk_199'] },
    { goi: goi('afterCursor', TW, { createdAt: `${T}05:00.000Z`, id: 'bk_9' }, 2), an: true, moTa: ['Twins at 03:05', 'Các dòng sinh đôi lúc 03:05'] },
    { goi: goi('afterCursor', R, { createdAt: `${T}17:00.000Z`, id: 'bk_197' }, 5), an: true, moTa: ['The last page', 'Trang cuối'] },
    { goi: goi('afterCursor', [...R, { id: 'bk_201', createdAt: '2026-10-31T19:20:34.129Z' }], { createdAt: `${T}18:00.000Z`, id: 'bk_198' }, 3), an: true, moTa: ['A row inserted at the top', 'Một dòng chèn lên đầu'] },
  ],
});

/* ── 3. Tự viết: keysetSql ── */
function keysetSql(sort) {
  const desc = sort.startsWith('-');
  const col = sort.replace('-', '').replace(/[A-Z]/g, (ch) => '_' + ch.toLowerCase());
  const dir = desc ? 'DESC' : 'ASC';
  return `WHERE (${col}, id) ${desc ? '<' : '>'} ($1, $2) ORDER BY ${col} ${dir}, id ${dir} LIMIT $3`;
}
const E3 = jsBai({
  ten: 'Cursor 3 — Write keysetSql(sort): the query behind a cursor', kho: 'MEDIUM', phut: 12,
  en: `<p>For a sort value like <code>-createdAt</code> or <code>startAt</code> (a leading <code>-</code> means descending), return the PostgreSQL text that fetches the page after a cursor:</p>
<pre>WHERE (created_at, id) &lt; ($1, $2) ORDER BY created_at DESC, id DESC LIMIT $3</pre>
<ul><li>column = the field in snake_case (<code>startAt</code> → <code>start_at</code>)</li>
<li>descending ⇒ <code>&lt;</code> and <code>DESC</code>; ascending ⇒ <code>&gt;</code> and <code>ASC</code></li>
<li>the id is always the second column, in the same direction</li></ul>
<p>Values stay in <code>$1 $2 $3</code> placeholders — never glued into the text.</p>`,
  vi: `<p>Với một giá trị sort như <code>-createdAt</code> hay <code>startAt</code> (dấu <code>-</code> ở đầu nghĩa là giảm dần), trả đoạn PostgreSQL lấy trang sau một con trỏ:</p>
<pre>WHERE (created_at, id) &lt; ($1, $2) ORDER BY created_at DESC, id DESC LIMIT $3</pre>
<ul><li>cột = tên trường dạng snake_case (<code>startAt</code> → <code>start_at</code>)</li>
<li>giảm dần ⇒ <code>&lt;</code> và <code>DESC</code>; tăng dần ⇒ <code>&gt;</code> và <code>ASC</code></li>
<li>id luôn là cột thứ hai, cùng chiều</li></ul>
<p>Giá trị nằm ở các chỗ giữ <code>$1 $2 $3</code> — không bao giờ dán thẳng vào chuỗi.</p>`,
  dauVao: ['sort — "-createdAt" | "createdAt" | "-startAt" | "startAt" | …', 'sort — "-createdAt" | "createdAt" | "-startAt" | "startAt" | …'],
  dauRa: ['string — WHERE … ORDER BY … LIMIT $3', 'chuỗi — WHERE … ORDER BY … LIMIT $3'],
  goiY: [['replace(/[A-Z]/g, (ch) =&gt; "_" + ch.toLowerCase()) turns camelCase into snake_case.', 'replace(/[A-Z]/g, (ch) =&gt; "_" + ch.toLowerCase()) đổi camelCase sang snake_case.'], ['Descending order ⇒ the next rows are SMALLER than the bookmark.', 'Thứ tự giảm dần ⇒ các dòng tiếp theo NHỎ HƠN bookmark.']],
  loi: [['Always using &lt; — an ascending list then goes backwards.', 'Luôn dùng &lt; — danh sách tăng dần khi đó đi lùi.'], ['ORDER BY start_at only — without id the row comparison and the order disagree on ties.', 'Chỉ ORDER BY start_at — thiếu id thì phép so sánh cả hàng và thứ tự lệch nhau khi bằng nhau.']],
  gt: ['The row comparison and the ORDER BY must describe the same order, tie-breaker included; then an index on (column, id) lets PostgreSQL seek to the bookmark — the 0.064 ms plan of lesson 3.2.', 'Phép so sánh cả hàng và ORDER BY phải mô tả cùng một thứ tự, kể cả khoá phụ; khi đó index trên (cột, id) cho PostgreSQL tìm thẳng tới bookmark — kế hoạch 0,064 ms của bài 3.2.'],
  kn: ['keyset pagination', 'SQL'],
  tns: [tn('row comparison', 'so sánh cả hàng (a, b) &lt; (x, y)'), tn('placeholder', 'chỗ giữ tham số $1')],
  dau: `/** sort ⇒ keyset SQL text */
function keysetSql(sort) {
  // Write your solution here
  const col = sort.replace('-', '');
  return \`WHERE (\${col}, id) < ($1, $2) ORDER BY \${col} DESC, id DESC LIMIT $3\`;
}
`,
  giai: '// Reference solution\n' + nguon(keysetSql),
  cases: [
    { goi: goi('keysetSql', '-createdAt'), moTa: ['Newest first (lesson 3.2)', 'Mới nhất trước (bài 3.2)'] },
    { goi: goi('keysetSql', 'startAt') },
    { goi: goi('keysetSql', '-startAt'), an: true },
    { goi: goi('keysetSql', 'createdAt'), an: true },
    { goi: goi('keysetSql', '-resolvedAt'), an: true },
  ],
});

/* ── 4. Offset hay con trỏ ── */
const OC = ['offset', 'cursor'];
const E4 = cs({
  ten: 'Cursor 4 — Offset or cursor?', kho: 'EASY', phut: 8, loai: 'table',
  en: 'For each screen or job, choose the pagination that fits — the decision table of lesson 3.2.',
  vi: 'Với mỗi màn hình hay công việc, chọn kiểu phân trang phù hợp — bảng quyết định của bài 3.2.',
  bang: [bang1('b1', ['Screen / job → pagination', 'Màn hình / công việc → kiểu phân trang'], [{ ma: 'x', ten: 'Screen / job' }, { ma: 'p', ten: 'Pagination', luaChon: OC }], [
    { o: { x: 'Admin table of 4 labs with “page 1 of 1”' }, a: { p: 'offset' } },
    { o: { x: 'Infinite-scroll feed of new bookings' }, a: { p: 'cursor' } },
    { o: { x: 'Nightly export of one million bookings' }, a: { p: 'cursor' } },
    { o: { x: 'Mobile app syncing issues changed since last time' }, a: { p: 'cursor' } },
    { o: { x: 'Class list of 30 students where the teacher jumps to page 3' }, a: { p: 'offset' } },
  ], ['Offset: small, slow-changing lists where page numbers matter. Cursor: anything that changes while read, is long, or is read to the end.', 'Offset: danh sách nhỏ, ít đổi, cần số trang. Con trỏ: thứ thay đổi trong lúc đọc, dài, hoặc được đọc tới cuối.'])],
  goiY: [['Does the list change while someone reads it?', 'Danh sách có đổi trong lúc có người đọc không?'], ['Does the UI really need to jump to page N?', 'Giao diện có thật sự cần nhảy tới trang N?']],
  loi: [['Using offset for exports — rows are duplicated or lost.', 'Dùng offset cho xuất dữ liệu — dòng bị trùng hoặc mất.'], ['Forcing cursors on a tiny admin table that needs page numbers.', 'Ép dùng con trỏ cho bảng quản trị nhỏ cần số trang.']],
  tns: [tn('infinite scroll', 'cuộn vô hạn'), tn('export', 'xuất dữ liệu')],
  kn: ['pagination'],
});

export default doiDau({ slug: 'api-3-2-cursor', ten: '3.2 Cursor pagination done right', khoa: KHOA, baiHoc: 'api-3-2-cursor', de: [E1, E2, E3, E4] });
