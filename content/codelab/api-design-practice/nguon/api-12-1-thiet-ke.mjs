/** API Design · 12.1 — Kế hoạch dự án cuối khoá: kiểm kê trạng thái trong RAM, lược đồ giữ luật, timestamptz(3) (output thật bài 12.1: 2 instance RAM, perf/precision.mjs). */
import { doiDau, KHOA, cs, q, tn, jsBai, nguon, goi } from './_api.mjs';

const E1 = cs({
  ten: 'Capstone 1 — What still lives in RAM, measured', kho: 'EASY', phut: 8,
  en: 'Facts from lesson 12.1: two LabFlow instances with the RAM store behind a health-checking proxy, then the schema decisions.',
  vi: 'Những điều từ bài 12.1: hai instance LabFlow kho RAM sau proxy kiểm sức khoẻ, rồi các quyết định lược đồ.',
  cau: [
    q('c1', ['A booking was made on B. Instance A answered 304 Not Modified to a list request carrying an older ETag. Why?', 'Một lượt đặt được tạo ở B. Instance A trả 304 Not Modified cho request danh sách mang ETag cũ. Vì sao?'],
      ['A’s list version lived in A’s memory, so A never saw B’s write', 'The proxy cached the response and replayed it for 60 seconds', 'B forgot to send the booking to PostgreSQL before answering', 'ETags are only valid on the instance that issued them, by design'],
      ['versions.bookings++ ran in B’s process only; 12.4 moves the version into a shared PostgreSQL sequence.', 'versions.bookings++ chỉ chạy trong tiến trình B; bài 12.4 chuyển số phiên bản vào sequence PostgreSQL dùng chung.']),
    q('c2', ['Where should LabFlow keep realtime tickets (30-second, one-use) once there are two instances?', 'Khi có hai instance, LabFlow nên giữ vé realtime (30 giây, dùng một lần) ở đâu?'],
      ['Redis with a 30-second TTL — shared, short-lived, losing it costs only a retry', 'A PostgreSQL table with a nightly cleanup job and a foreign key to users', 'Each instance’s memory, with sticky sessions so the same user hits it', 'Inside the JWT itself, so no storage at all is needed for tickets'],
      ['Rule of thumb: truth ⇒ PostgreSQL, shared but disposable ⇒ Redis, tolerant caches ⇒ local.', 'Luật nhớ: sự thật ⇒ PostgreSQL, dùng chung nhưng bỏ được ⇒ Redis, cache chịu được cũ ⇒ tại chỗ.']),
    q('c3', ['Paging 1,000 bulk-inserted rows with a millisecond cursor over a timestamptz column found only 100. What fixed it?', 'Lật trang 1.000 dòng nhập lô bằng con trỏ mili giây trên cột timestamptz chỉ thấy 100 dòng. Cái gì sửa được?'],
      ['Declaring the column timestamptz(3), so the database stores exactly what the cursor carries', 'Adding an index on created_at alone, so the keyset query stops skipping', 'Switching to OFFSET pagination, which does not depend on timestamps', 'Sorting by created_at only and removing the seq tie-breaker'],
      ['µs in the column, ms in the cursor: rows of the edge millisecond fell before the cursor. 900 lost, then 0.', 'Cột giữ µs, con trỏ giữ ms: các dòng cùng mili giây ở mép bị rơi ra trước con trỏ. Mất 900, rồi 0.']),
    q('c4', ['Why does the bookings table keep id text GENERATED ALWAYS AS (’bk_’ || seq)?', 'Vì sao bảng bookings giữ id text GENERATED ALWAYS AS (’bk_’ || seq)?'],
      ['Clients were promised opaque ids like bk_42; the move to a database must not change them', 'PostgreSQL cannot use a bigint as a primary key together with an EXCLUDE constraint', 'Text keys are faster to index than numbers in every PostgreSQL version', 'The generated column is what makes the sequence gapless after a failed insert'],
      ['Keep the contract; the numeric seq still drives keyset paging. Ids have gaps (a failed insert burned bk_10003).', 'Giữ hợp đồng; seq dạng số vẫn lo phân trang keyset. Id có lỗ (một INSERT hỏng đốt mất bk_10003).']),
  ],
  goiY: [['Ask where each value lives when there are two processes.', 'Hỏi: khi có hai tiến trình, mỗi giá trị nằm ở đâu.'], ['JavaScript Date keeps milliseconds.', 'Date của JavaScript chỉ giữ mili giây.']],
  loi: [['Believing ETags or tickets are shared just because data is.', 'Tin rằng ETag hay vé dùng chung chỉ vì dữ liệu dùng chung.'], ['Using timestamptz with microseconds under a millisecond cursor.', 'Dùng timestamptz micro giây dưới con trỏ mili giây.']],
  tns: [tn('in-memory state', 'trạng thái trong bộ nhớ'), tn('source of truth', 'nguồn sự thật'), tn('timestamp precision', 'độ mịn thời gian')],
  kn: ['databases', 'scalability'],
});

function truncateToMs(ts) {
  const m = /^(\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d)(?:\.(\d+))?Z$/.exec(ts);
  if (!m) return null;
  return `${m[1]}.${((m[2] || '') + '000').slice(0, 3)}Z`;
}
const E2 = jsBai({
  ten: 'Capstone 2 — Write truncateToMs(ts): what the cursor really carries', kho: 'MEDIUM', phut: 10,
  en: `<p>PostgreSQL prints <code>timestamptz</code> with up to 6 fractional digits; a JavaScript <code>Date</code> keeps 3. Write <code>truncateToMs(ts)</code> for UTC ISO strings ending in <code>Z</code>: keep the first three fractional digits (pad with zeros), always return <code>YYYY-MM-DDTHH:MM:SS.mmmZ</code>. Anything else ⇒ <code>null</code>.</p>`,
  vi: `<p>PostgreSQL in <code>timestamptz</code> tới 6 chữ số lẻ; <code>Date</code> của JavaScript giữ 3. Viết <code>truncateToMs(ts)</code> cho chuỗi ISO UTC kết thúc bằng <code>Z</code>: giữ ba chữ số lẻ đầu (thiếu thì thêm 0), luôn trả <code>YYYY-MM-DDTHH:MM:SS.mmmZ</code>. Dạng khác ⇒ <code>null</code>.</p>`,
  dauVao: ['ts — string', 'ts — chuỗi'], dauRa: ['string | null', 'chuỗi | null'],
  goiY: [['A regex can capture the seconds part and the fraction separately.', 'Một regex bắt riêng phần giây và phần lẻ.'], ['Truncate, do not round: .1239 ⇒ .123.', 'Cắt, không làm tròn: .1239 ⇒ .123.']],
  loi: [['Rounding instead of truncating.', 'Làm tròn thay vì cắt.'], ['Forgetting a timestamp with no fraction at all.', 'Quên trường hợp không có phần lẻ.']],
  gt: ['Two rows at .123456 and .123789 both become .123 in the cursor — the same millisecond. With a µs column, the next page asks for rows “before .123” and skips both; with timestamptz(3) the column itself is .123 and the seq tie-breaker decides (12.1: 900 of 1,000 lost, then 0).', 'Hai dòng .123456 và .123789 đều thành .123 trong con trỏ — cùng một mili giây. Với cột µs, trang sau hỏi các dòng “trước .123” và bỏ qua cả hai; với timestamptz(3) chính cột là .123 và seq quyết định (12.1: mất 900/1.000, rồi 0).'],
  kn: ['pagination', 'databases'], tns: [tn('truncate', 'cắt bớt'), tn('fractional seconds', 'phần lẻ của giây')],
  dau: `/** keep milliseconds only */
function truncateToMs(ts) {
  // Write your solution here
  return new Date(ts).toISOString();
}
`,
  giai: '// Reference solution\n' + nguon(truncateToMs),
  cases: [
    { goi: goi('truncateToMs', '2026-11-01T10:00:00.123456Z'), moTa: ['Six fractional digits', 'Sáu chữ số lẻ'] },
    { goi: goi('truncateToMs', '2026-11-01T10:00:00Z'), moTa: ['No fraction', 'Không có phần lẻ'] },
    { goi: goi('truncateToMs', '2026-11-01T10:00:00.1239Z'), an: true },
    { goi: goi('truncateToMs', '2026-11-01T10:00:00.5Z'), an: true },
    { goi: goi('truncateToMs', 'not a date'), an: true },
  ],
});

function nextPage(rows, cursor, limit) {
  const before = (r) => r.createdAt < cursor.createdAt || (r.createdAt === cursor.createdAt && r.seq < cursor.seq);
  const sorted = rows.slice().sort((a, b) => (a.createdAt === b.createdAt ? b.seq - a.seq : (a.createdAt < b.createdAt ? 1 : -1)));
  return (cursor ? sorted.filter(before) : sorted).slice(0, limit).map((r) => r.seq);
}
const ROWS = [
  { seq: 1, createdAt: '2026-11-01T10:00:00.123Z' }, { seq: 2, createdAt: '2026-11-01T10:00:00.123Z' },
  { seq: 3, createdAt: '2026-11-01T10:00:00.123Z' }, { seq: 4, createdAt: '2026-11-01T10:00:00.124Z' },
  { seq: 5, createdAt: '2026-11-01T10:00:00.125Z' },
];
const E3 = jsBai({
  ten: 'Capstone 3 — Write nextPage(rows, cursor, limit): keyset on (createdAt, seq)', kho: 'HARD', phut: 15,
  en: `<p>Newest first, like <code>ORDER BY created_at DESC, seq DESC</code>. <code>rows</code> are <code>{ seq, createdAt }</code> with millisecond ISO strings (they compare correctly as strings). <code>cursor</code> is <code>null</code> (first page) or <code>{ createdAt, seq }</code> of the last row already shown. Return the <code>seq</code> values of the next page, at most <code>limit</code>, in order. A row comes after the cursor when its <code>createdAt</code> is older, or equal with a smaller <code>seq</code>.</p>`,
  vi: `<p>Mới nhất trước, như <code>ORDER BY created_at DESC, seq DESC</code>. <code>rows</code> là <code>{ seq, createdAt }</code> với chuỗi ISO mili giây (so chuỗi là đúng). <code>cursor</code> là <code>null</code> (trang đầu) hoặc <code>{ createdAt, seq }</code> của dòng cuối đã hiện. Trả các <code>seq</code> của trang kế, tối đa <code>limit</code>, đúng thứ tự. Một dòng đứng sau con trỏ khi <code>createdAt</code> cũ hơn, hoặc bằng nhau mà <code>seq</code> nhỏ hơn.</p>`,
  dauVao: ['rows — {seq, createdAt}[]; cursor — object | null; limit — number', 'rows — {seq, createdAt}[]; cursor — object | null; limit — số'],
  dauRa: ['number[]', 'mảng số'],
  goiY: [['Compare the pair (createdAt, seq), not createdAt alone.', 'So cặp (createdAt, seq), không chỉ createdAt.'], ['Sort a copy; do not sort the input in place.', 'Sắp một bản sao; đừng sắp tại chỗ mảng đầu vào.']],
  loi: [['Using only createdAt < cursor: rows of the same millisecond vanish.', 'Chỉ dùng createdAt < con trỏ: các dòng cùng mili giây biến mất.'], ['Sorting seq ascending inside equal timestamps.', 'Sắp seq tăng dần trong các mốc bằng nhau.']],
  gt: ['The tie-breaker makes every row’s position unique, so a page edge inside one millisecond loses nothing — exactly the SQL of store/pg.js: (created_at, seq) &lt; ($1, $2).', 'Khoá phụ làm vị trí mỗi dòng là duy nhất, nên mép trang nằm giữa một mili giây không mất gì — đúng câu SQL của store/pg.js: (created_at, seq) &lt; ($1, $2).'],
  kn: ['pagination'], tns: [tn('keyset pagination', 'phân trang theo khoá'), tn('tie-breaker', 'khoá phụ phá hoà')],
  dau: `/** next page, newest first */
function nextPage(rows, cursor, limit) {
  // Write your solution here
  const sorted = rows.slice().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return sorted.filter((r) => !cursor || r.createdAt < cursor.createdAt).slice(0, limit).map((r) => r.seq);
}
`,
  giai: '// Reference solution\n' + nguon(nextPage),
  cases: [
    { goi: goi('nextPage', ROWS, null, 2), moTa: ['First page', 'Trang đầu'] },
    { goi: goi('nextPage', ROWS, { createdAt: '2026-11-01T10:00:00.123Z', seq: 3 }, 2), moTa: ['Edge inside one millisecond', 'Mép trang giữa một mili giây'] },
    { goi: goi('nextPage', ROWS, { createdAt: '2026-11-01T10:00:00.124Z', seq: 4 }, 10), an: true },
    { goi: goi('nextPage', ROWS, { createdAt: '2026-11-01T10:00:00.123Z', seq: 1 }, 5), an: true },
    { goi: goi('nextPage', [], null, 3), an: true },
  ],
});

export default doiDau({ slug: 'api-12-1-thiet-ke', ten: '12.1 The capstone plan: RAM inventory and a schema that keeps the rules', khoa: KHOA, baiHoc: 'api-12-1-thiet-ke', de: [E1, E2, E3] });
