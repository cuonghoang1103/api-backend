/** API Design · 3.1 — Phân trang offset: thứ tự ổn định, trang + Link, trùng/sót khi dữ liệu đổi (số đo thật của bài 3.1). */
import { doiDau, KHOA, cs, q, tn, jsBai, nguon, goi } from './_api.mjs';

/* ── 1. Những điều đã đo ── */
const E1 = cs({
  ten: 'Offset 1 — What lesson 3.1 measured', kho: 'EASY', phut: 10,
  en: 'Facts from lesson 3.1 (LabFlow with SEED_BOOKINGS=200, PostgreSQL 18.4 with one million rows).',
  vi: 'Những điều từ bài 3.1 (LabFlow với SEED_BOOKINGS=200, PostgreSQL 18.4 với một triệu dòng).',
  cau: [
    q('c1', ['Lan reads page 1 (limit=5): bk_200 … bk_196. An creates bk_201. Lan reads offset=5. What did she get?', 'Cô Lan đọc trang 1 (limit=5): bk_200 … bk_196. An tạo bk_201. Cô Lan đọc offset=5. Cô nhận được gì?'], ['bk_196 again, then bk_195 … bk_192', 'bk_195 … bk_191, exactly the next five', 'an empty page, because the total changed', 'a 409, because the list changed while paging'], ['The new row took position 1, everything moved down one place, and “skip 5” skipped one old row fewer — bk_196 repeated.', 'Dòng mới chiếm vị trí 1, mọi thứ tụt một bậc, và "bỏ qua 5" bỏ qua ít hơn một dòng cũ — bk_196 bị lặp.']),
    q('c2', ['OFFSET 900000 LIMIT 20 took 78.316 ms. How many index entries did PostgreSQL read?', 'OFFSET 900000 LIMIT 20 mất 78,316 ms. PostgreSQL đã đọc bao nhiêu mục index?'], ['900 020 — it walks every skipped row', '20 — the index jumps to position 900 000', '1 000 000 — it always reads the whole table', '900 000 — the 20 returned rows are cached'], ['rows=900020.00 in the plan. An index finds the start of an order, not the n-th position.', 'rows=900020.00 trong kế hoạch. Index tìm được điểm đầu của thứ tự, không phải vị trí thứ n.']),
    q('c3', ['Why does LabFlow compare the NUMBER of the id as tie-breaker, not the string?', 'Vì sao LabFlow so CON SỐ của id làm khoá phụ, không so chuỗi?'], ['As strings "bk_10" sorts before "bk_9"', 'Strings cannot be compared in JavaScript', 'Numbers sort faster than strings in V8', 'The database stores ids as numbers only'], ['localeCompare puts "bk_10" before "bk_9" (character 1 < 9). idNum("bk_10") = 10 fixes the order.', 'localeCompare đặt "bk_10" trước "bk_9" (ký tự 1 < 9). idNum("bk_10") = 10 sửa thứ tự.']),
    q('c4', ['GET /bookings?limit=500 on LabFlow returns …', 'GET /bookings?limit=500 trên LabFlow trả …'], ['400 with a detail that the maximum is 100', '200 with the first 100 bookings, silently cut', '200 with all 200 bookings', '413 Payload Too Large'], ['A silent cut hides a bug in the client; 400 tells the developer at once. 413 is about request bodies.', 'Cắt lặng lẽ giấu lỗi của client; 400 báo cho lập trình viên ngay. 413 nói về body của request.']),
    q('c5', ['SELECT count(*) on the million-row table took 25.178 ms. What is the lesson for page.total?', 'SELECT count(*) trên bảng một triệu dòng mất 25,178 ms. Bài học cho page.total là gì?'], ['An exact total costs a full count on every request — send it only where the UI needs it', 'Totals are free because PostgreSQL caches count(*)', 'Never send any paging metadata', 'Compute the total in JavaScript instead, which is free'], ['About 500× the first page. Options: total only on page 1, an estimate, or only “is there a next page” (lesson 3.2).', 'Khoảng 500 lần trang đầu. Lựa chọn: total chỉ ở trang 1, số ước lượng, hoặc chỉ "còn trang sau không" (bài 3.2).']),
  ],
  goiY: [['Every answer is a number or output printed in lesson 3.1.', 'Mọi đáp án là một con số hay output in trong bài 3.1.'], ['Think of a position versus a person in a queue.', 'Nghĩ tới vị trí so với một người trong hàng.']],
  loi: [['Believing an index makes any OFFSET cheap.', 'Tin rằng có index thì OFFSET nào cũng rẻ.'], ['Silently capping limit instead of answering 400.', 'Lặng lẽ cắt limit thay vì trả 400.']],
  tns: [tn('offset', 'số dòng bỏ qua'), tn('tie-breaker', 'khoá phụ phân xử khi bằng nhau')],
  kn: ['pagination'],
});

/* ── 2. Tự viết: sortNewest ── */
function sortNewest(rows) {
  const idNum = (id) => Number(id.slice(id.indexOf('_') + 1));
  return [...rows]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt) || idNum(b.id) - idNum(a.id))
    .map((r) => r.id);
}
const T = '2026-10-01T03:';
const E2 = jsBai({
  ten: 'Offset 2 — Write sortNewest(rows): a stable order', kho: 'EASY', phut: 10,
  en: `<p>Return the <b>ids</b> of <code>rows</code> ordered newest first by <code>createdAt</code> (ISO strings), and — when two rows have the same <code>createdAt</code> — by the <b>number</b> in the id, highest first (<code>bk_10</code> before <code>bk_9</code>). Do not modify <code>rows</code>.</p><p>This is LabFlow’s <code>newestFirst</code>: without a unique tie-breaker two rows may swap places between calls and paging repeats or loses them.</p>`,
  vi: `<p>Trả <b>id</b> của <code>rows</code> theo thứ tự mới nhất trước theo <code>createdAt</code> (chuỗi ISO), và — khi hai dòng cùng <code>createdAt</code> — theo <b>con số</b> trong id, lớn trước (<code>bk_10</code> trước <code>bk_9</code>). Không sửa <code>rows</code>.</p><p>Đây là <code>newestFirst</code> của LabFlow: không có khoá phụ duy nhất thì hai dòng có thể đổi chỗ giữa các lần gọi và phân trang lặp hoặc mất chúng.</p>`,
  dauVao: ['rows — [{ id, createdAt }]', 'rows — [{ id, createdAt }]'],
  dauRa: ['string[] — ids, newest first', 'mảng chuỗi — id, mới nhất trước'],
  goiY: [['ISO strings in the same time zone compare correctly as text: b.createdAt.localeCompare(a.createdAt).', 'Chuỗi ISO cùng múi giờ so như chữ là đúng: b.createdAt.localeCompare(a.createdAt).'], ['a || b in a comparator: use the second rule only when the first gives 0.', 'a || b trong bộ so sánh: chỉ dùng luật thứ hai khi luật đầu cho 0.']],
  loi: [['Comparing ids as strings: "bk_9" ends up before "bk_10".', 'So id như chuỗi: "bk_9" đứng trước "bk_10".'], ['rows.sort(…) without a copy — it modifies the caller’s array.', 'rows.sort(…) không sao chép — nó sửa mảng của người gọi.']],
  gt: ['createdAt first, then the id’s number in the same direction: every row has exactly one position, on every call. The copy ([...rows]) keeps the database array untouched.', 'createdAt trước, rồi con số của id cùng chiều: mỗi dòng có đúng một vị trí, ở mọi lần gọi. Bản sao ([...rows]) giữ nguyên mảng dữ liệu.'],
  kn: ['stable ordering'],
  tns: [tn('comparator', 'hàm so sánh'), tn('stable order', 'thứ tự ổn định')],
  dau: `/** rows ⇒ ids, newest first; ties by the id's number, highest first */
function sortNewest(rows) {
  // Write your solution here
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id.localeCompare(a.id)).map((r) => r.id);
}
`,
  giai: '// Reference solution\n' + nguon(sortNewest),
  cases: [
    { goi: goi('sortNewest', [{ id: 'bk_198', createdAt: `${T}18:00.000Z` }, { id: 'bk_200', createdAt: `${T}20:00.000Z` }, { id: 'bk_199', createdAt: `${T}19:00.000Z` }]), moTa: ['Three seeded bookings', 'Ba lượt đặt mẫu'] },
    { goi: goi('sortNewest', [{ id: 'bk_9', createdAt: `${T}00:00.000Z` }, { id: 'bk_10', createdAt: `${T}00:00.000Z` }, { id: 'bk_11', createdAt: `${T}00:00.000Z` }]), moTa: ['Same createdAt: bk_10 vs bk_9', 'Cùng createdAt: bk_10 với bk_9'] },
    { goi: goi('sortNewest', [{ id: 'iss_2', createdAt: '2026-10-07T10:00:00.000Z' }, { id: 'iss_100', createdAt: '2026-10-07T10:00:00.000Z' }, { id: 'iss_3', createdAt: '2026-10-08T00:00:00.000Z' }]), an: true },
    { goi: goi('sortNewest', []), an: true },
    { goi: `(function () { var r = [{ id: 'bk_1', createdAt: '${T}01:00.000Z' }, { id: 'bk_2', createdAt: '${T}02:00.000Z' }]; sortNewest(r); return r.map(function (x) { return x.id; }); })()`, an: true, moTa: ['The input array is not modified', 'Mảng đầu vào không bị sửa'] },
  ],
});

/* ── 3. Tự viết: offsetPage ── */
function offsetPage(ids, limit, offset) {
  const data = ids.slice(offset, offset + limit);
  const next = offset + limit < ids.length ? `/bookings?limit=${limit}&offset=${offset + limit}` : null;
  return { data, page: { limit, offset, total: ids.length }, next };
}
const IDS = Array.from({ length: 12 }, (_, i) => `bk_${200 - i}`);
const E3 = jsBai({
  ten: 'Offset 3 — Write offsetPage(ids, limit, offset): data, page and next', kho: 'EASY', phut: 10,
  en: `<p><code>ids</code> is the already-sorted list. Return <code>{ data, page: { limit, offset, total }, next }</code>:</p><ul>
<li><code>data</code> — the ids from position <code>offset</code>, at most <code>limit</code> of them</li>
<li><code>total</code> — the length of the whole list</li>
<li><code>next</code> — <code>"/bookings?limit=L&amp;offset=O"</code> for the next page, or <code>null</code> when there is none (exactly like LabFlow’s <code>Link: rel="next"</code>)</li></ul>`,
  vi: `<p><code>ids</code> là danh sách đã sắp. Trả <code>{ data, page: { limit, offset, total }, next }</code>:</p><ul>
<li><code>data</code> — các id từ vị trí <code>offset</code>, tối đa <code>limit</code> phần tử</li>
<li><code>total</code> — độ dài cả danh sách</li>
<li><code>next</code> — <code>"/bookings?limit=L&amp;offset=O"</code> cho trang sau, hoặc <code>null</code> khi hết (đúng như <code>Link: rel="next"</code> của LabFlow)</li></ul>`,
  dauVao: ['ids — string[], limit ≥ 1, offset ≥ 0 (already validated)', 'ids — mảng chuỗi, limit ≥ 1, offset ≥ 0 (đã được kiểm)'],
  dauRa: ['{ data, page: { limit, offset, total }, next }', '{ data, page: { limit, offset, total }, next }'],
  goiY: [['slice(offset, offset + limit) never throws, even past the end.', 'slice(offset, offset + limit) không bao giờ ném lỗi, kể cả quá cuối.'], ['There is a next page only if offset + limit &lt; total.', 'Chỉ còn trang sau nếu offset + limit &lt; total.']],
  loi: [['offset + limit &lt;= total — produces a link to an empty page.', 'offset + limit &lt;= total — sinh link tới một trang rỗng.'], ['slice(offset, limit) — the second argument is an end position, not a count.', 'slice(offset, limit) — đối số thứ hai là vị trí kết thúc, không phải số lượng.']],
  gt: ['The lesson’s handler in miniature. A page that ends exactly at the end of the list has no next link; a page past the end is empty with no next.', 'Handler của bài thu nhỏ. Trang kết thúc đúng cuối danh sách thì không có link sau; trang vượt quá cuối thì rỗng và không có link sau.'],
  kn: ['offset pagination'],
  tns: [tn('Link header', 'header Link (RFC 8288)'), tn('total', 'tổng số phần tử')],
  dau: `/** sorted ids ⇒ one page + where the next one is */
function offsetPage(ids, limit, offset) {
  // Write your solution here
  return { data: ids.slice(offset, limit), page: { limit, offset, total: ids.length }, next: \`/bookings?limit=\${limit}&offset=\${offset + limit}\` };
}
`,
  giai: '// Reference solution\n' + nguon(offsetPage),
  cases: [
    { goi: goi('offsetPage', IDS, 3, 0), moTa: ['First page, limit=3', 'Trang đầu, limit=3'] },
    { goi: goi('offsetPage', IDS, 3, 3), moTa: ['Second page', 'Trang hai'] },
    { goi: goi('offsetPage', IDS, 5, 10), an: true },
    { goi: goi('offsetPage', IDS, 4, 8), an: true, moTa: ['The last page ends exactly at the end', 'Trang cuối kết thúc đúng cuối danh sách'] },
    { goi: goi('offsetPage', IDS, 5, 40), an: true },
  ],
});

/* ── 4. Tự viết: notShown — đo trùng/sót ── */
function pagingAudit(before, after, limit) {
  const page1 = before.slice(0, limit);
  const page2 = after.slice(limit, 2 * limit);
  const duplicates = page1.filter((id) => page2.includes(id));
  const notShown = after.slice(0, 2 * limit).filter((id) => !page1.includes(id) && !page2.includes(id));
  return { duplicates, notShown };
}
const B = Array.from({ length: 10 }, (_, i) => `bk_${200 - i}`);
const E4 = jsBai({
  ten: 'Offset 4 — Write pagingAudit(before, after, limit): duplicates and rows never shown', kho: 'MEDIUM', phut: 15,
  en: `<p>A client reads page 1 with offset 0 from the list <code>before</code>; then the data changes; then it reads page 2 with <code>offset=limit</code> from the list <code>after</code>. Return:</p><ul>
<li><code>duplicates</code> — ids that appear on both pages (in page-1 order)</li>
<li><code>notShown</code> — ids among the first <code>2 × limit</code> of <code>after</code> that the client saw on neither page (in <code>after</code> order)</li></ul>
<p>Lesson 3.1’s real run: <code>before</code> = bk_200…bk_191, An inserts bk_201 at the top ⇒ bk_196 is a duplicate. Delete a row instead, and one row is never shown.</p>`,
  vi: `<p>Một client đọc trang 1 với offset 0 từ danh sách <code>before</code>; rồi dữ liệu đổi; rồi nó đọc trang 2 với <code>offset=limit</code> từ danh sách <code>after</code>. Trả:</p><ul>
<li><code>duplicates</code> — các id xuất hiện ở cả hai trang (theo thứ tự trang 1)</li>
<li><code>notShown</code> — các id trong <code>2 × limit</code> phần tử đầu của <code>after</code> mà client không thấy ở trang nào (theo thứ tự <code>after</code>)</li></ul>
<p>Lần chạy thật của bài 3.1: <code>before</code> = bk_200…bk_191, An chèn bk_201 lên đầu ⇒ bk_196 bị trùng. Xoá một dòng thì ngược lại: có một dòng không bao giờ được hiện.</p>`,
  dauVao: ['before, after — string[] (sorted lists); limit ≥ 1', 'before, after — mảng chuỗi (đã sắp); limit ≥ 1'],
  dauRa: ['{ duplicates: string[], notShown: string[] }', '{ duplicates: mảng chuỗi, notShown: mảng chuỗi }'],
  goiY: [['Build page1 and page2 first, exactly as the server would.', 'Dựng page1 và page2 trước, đúng như server sẽ làm.'], ['includes() is enough for lists this small.', 'includes() là đủ cho danh sách nhỏ thế này.']],
  loi: [['Taking page 2 from before — the client really gets it from the changed list.', 'Lấy trang 2 từ before — client thật sự nhận nó từ danh sách đã đổi.'], ['Reporting a row as not shown although it is simply on page 3.', 'Báo một dòng "không được hiện" trong khi nó chỉ nằm ở trang 3.']],
  gt: ['Insert above the client’s position ⇒ duplicates; delete above it ⇒ a row slides from page 2 onto page 1’s positions and is never shown. Neither depends on a bug — it is what “skip N” means on a moving list, and why lesson 3.2 uses cursors.', 'Chèn phía trên vị trí của client ⇒ trùng; xoá phía trên ⇒ một dòng trượt từ trang 2 lên vị trí của trang 1 và không bao giờ được hiện. Cả hai không do bug nào — đó là nghĩa của "bỏ qua N" trên một danh sách đang chuyển động, và là lý do bài 3.2 dùng con trỏ.'],
  kn: ['offset pagination', 'consistency'],
  tns: [tn('duplicate', 'bản ghi lặp'), tn('skipped row', 'dòng bị bỏ sót')],
  dau: `/** page 1 from before, page 2 (offset = limit) from after ⇒ what went wrong */
function pagingAudit(before, after, limit) {
  // Write your solution here
  const page1 = before.slice(0, limit), page2 = before.slice(limit, 2 * limit);
  return { duplicates: page1.filter((id) => page2.includes(id)), notShown: [] };
}
`,
  giai: '// Reference solution\n' + nguon(pagingAudit),
  cases: [
    { goi: goi('pagingAudit', B, ['bk_201', ...B], 5), moTa: ['Lesson 3.1: An inserts bk_201', 'Bài 3.1: An chèn bk_201'] },
    { goi: goi('pagingAudit', B, B.filter((x) => x !== 'bk_198'), 5), moTa: ['bk_198 is deleted between the pages', 'bk_198 bị xoá giữa hai trang'] },
    { goi: goi('pagingAudit', B, B, 5), an: true, moTa: ['Nothing changed', 'Không có gì thay đổi'] },
    { goi: goi('pagingAudit', B, ['bk_202', 'bk_201', ...B], 3), an: true },
    { goi: goi('pagingAudit', B, B.filter((x) => x !== 'bk_200' && x !== 'bk_199'), 4), an: true },
  ],
});

export default doiDau({ slug: 'api-3-1-offset', ten: '3.1 Offset pagination and its problems', khoa: KHOA, baiHoc: 'api-3-1-offset', de: [E1, E2, E3, E4] });
