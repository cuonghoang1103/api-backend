/**
 * 7.2 — Kết quả sai: logic NULL, JOIN nhân dòng, GROUP BY, collation, timestamptz (soạn 24/11/2026, máy nhà Linux).
 * Output THẬT: psql 16.16 trên DB labflow (seed tất định của 7.1), Prisma 6.19.3 — scratchpad/dbg/lab/ch7
 * (tools/c72-null.sql, c72-join.sql, c72-chu-gio.sql, node/thu/null-prisma.ts, node/thu/tiem.mts; o-72-*.txt).
 */
import { nguon, lienKet } from '../_chung.mjs';
import { NULL as RA_NULL, NOT_IN, NULL_SUM, PRISMA_NULL, FANOUT, FANOUT_SUA, LEFT_WHERE, COUNT_SAO, COLLATE, TZ, TIEM } from './_ra-7.mjs';

const ma = (s, lang = 'js') => `<pre><code class="language-${lang}">${s}</code></pre>`;
const ra = (s) => `<div class="out">${s}</div>`;

const MA_PRISMA_NULL = ma(`// Prisma dịch { not: 20 } thành "giamGia" &lt;&gt; $1 — dòng NULL bị loại, đúng theo SQL nhưng sai theo ý người viết
await prisma.datLich.count({ where: { giamGia: { not: 20 } } });                                  // 300
await prisma.datLich.count({ where: { OR: [{ giamGia: { not: 20 } }, { giamGia: null }] } });     // 2700`);

const MA_JPA_NULL = ma(`// JPA/Spring Data: tham số null KHÔNG thành "IS NULL" trong @Query viết tay
@Query("select d from DatCho d where d.ghiChu = :g")   // g = null ⇒ "ghi_chu = NULL" ⇒ luôn 0 dòng
List&lt;DatCho&gt; theoGhiChu(String g);
List&lt;DatCho&gt; findByGhiChuIsNull();                      // dùng hàm dẫn xuất riêng cho trường hợp null`, 'java');

const MA_VN = ma(`-- Cột cần sắp xếp/so sánh đúng tiếng Việt: khai báo collation ICU cho cột (hoặc cho cả database khi tạo)
ALTER TABLE "NguoiDung" ALTER COLUMN ten TYPE text COLLATE "vi-x-icu";
-- Tìm không dấu: unaccent + chỉ mục biểu thức (cần hàm IMMUTABLE bọc unaccent) hoặc pg_trgm; xem khoá PostgreSQL 13.3`, 'sql');

const BANG_NULL_EN = `<table>
<thead><tr><th>Expression</th><th>Result when x is NULL</th><th>Write instead</th></tr></thead>
<tbody>
<tr><td><code>x = NULL</code>, <code>x &lt;&gt; NULL</code></td><td>NULL (row filtered out)</td><td><code>x IS NULL</code>, <code>x IS NOT NULL</code></td></tr>
<tr><td><code>x &lt;&gt; 20</code></td><td>NULL — NULL rows disappear</td><td><code>x IS DISTINCT FROM 20</code></td></tr>
<tr><td><code>a NOT IN (subquery)</code> with one NULL inside</td><td>never TRUE — zero rows</td><td><code>NOT EXISTS (…)</code></td></tr>
<tr><td><code>price * (100 - x) / 100</code></td><td>NULL, and <code>SUM</code> silently skips it</td><td><code>COALESCE(x, 0)</code> — or make the column <code>NOT NULL DEFAULT 0</code></td></tr>
<tr><td><code>count(x)</code></td><td>does not count NULLs</td><td><code>count(*)</code> when you mean rows</td></tr>
</tbody></table>`;

const BANG_NULL_VI = `<table>
<thead><tr><th>Biểu thức</th><th>Kết quả khi x là NULL</th><th>Nên viết</th></tr></thead>
<tbody>
<tr><td><code>x = NULL</code>, <code>x &lt;&gt; NULL</code></td><td>NULL (dòng bị lọc mất)</td><td><code>x IS NULL</code>, <code>x IS NOT NULL</code></td></tr>
<tr><td><code>x &lt;&gt; 20</code></td><td>NULL — các dòng NULL biến mất</td><td><code>x IS DISTINCT FROM 20</code></td></tr>
<tr><td><code>a NOT IN (truy vấn con)</code> có một NULL bên trong</td><td>không bao giờ TRUE — 0 dòng</td><td><code>NOT EXISTS (…)</code></td></tr>
<tr><td><code>gia * (100 - x) / 100</code></td><td>NULL, và <code>SUM</code> lặng lẽ bỏ qua</td><td><code>COALESCE(x, 0)</code> — hoặc đặt cột <code>NOT NULL DEFAULT 0</code></td></tr>
<tr><td><code>count(x)</code></td><td>không đếm NULL</td><td><code>count(*)</code> khi bạn muốn đếm dòng</td></tr>
</tbody></table>`;

const NGUON = [
  nguon('🐘', 'PostgreSQL 16 — Comparison Functions and Operators', 'IS DISTINCT FROM, IS NULL và vì sao "= NULL" trả NULL.', 'https://www.postgresql.org/docs/16/functions-comparison.html'),
  nguon('🐘', 'PostgreSQL 16 — Collation Support', 'Collation libc và ICU, khai báo theo cột, theo database, theo biểu thức.', 'https://www.postgresql.org/docs/16/collation.html'),
  nguon('🐘', 'PostgreSQL 16 — Date/Time Types', 'timestamp vs timestamptz, AT TIME ZONE, ảnh hưởng của tham số TimeZone.', 'https://www.postgresql.org/docs/16/datatype-datetime.html'),
  nguon('📘', 'Prisma ORM — Raw queries ($queryRaw, $queryRawUnsafe)', 'Tagged template tự tham số hoá; bản Unsafe ghép chuỗi — cảnh báo SQL injection.', 'https://www.prisma.io/docs/orm/prisma-client/using-raw-sql/raw-queries'),
  nguon('🛡', 'CISA AA23-158A — CL0P exploits MOVEit Transfer SQL injection (CVE-2023-34362)', 'Một lỗi SQL injection trong phần mềm truyền tệp; hàng nghìn tổ chức bị lấy dữ liệu năm 2023.', 'https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-158a'),
  lienKet({ khoa: 'postgresql', bai: 'postgresql-6-4-tong-hop-tren-join', title: 'PostgreSQL 6.4 — Tổng hợp trên JOIN: thuần hoá fan-out', sub: 'Đầy đủ các cách gộp trước khi JOIN, kèm bài tập.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'postgresql', bai: 'postgresql-5-2-outer-join', title: 'PostgreSQL 5.2 — OUTER JOIN: giữ lại các dòng không khớp', sub: 'ON khác WHERE thế nào với LEFT JOIN — nền của mục 3.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'postgresql', bai: 'postgresql-7-2-correlated-exists', title: 'PostgreSQL 7.2 — Subquery tương quan, EXISTS & bẫy NOT IN', sub: 'NOT IN gặp NULL, giải thích bằng logic ba trị.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-6-3-du-lieu', title: 'Bài 6.3 — Lỗi dữ liệu gửi nhận: ngày giờ và múi giờ', sub: 'Phía HTTP/JSON của cùng lỗi múi giờ: giờ không có độ lệch, lệch 7 tiếng.', cta: 'Mở bài →' }),
].join('\n');

export default {
  title: '7.2 — Wrong results: NULL logic, JOIN multiplying rows, GROUP BY, collation, timestamptz|||7.2 — Kết quả sai: logic NULL, JOIN nhân dòng, GROUP BY, collation, timestamptz',
  slug: 'dbg-7-2-ket-qua-sai',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Truy vấn chạy không lỗi mà số sai — sáu họ lỗi chạy thật trên PostgreSQL 16: "giamGia <> 20" bỏ mất 2.400 dòng NULL (Prisma { not: 20 } cũng vậy: 300 thay vì 2.700), NOT IN gặp một NULL trả 0 dòng, SUM gặp NULL làm doanh thu còn 69,6 triệu thay vì 225,6 triệu; JOIN hai bảng con thổi tiền phòng từ 234 lên 273 triệu và tiền thiết bị gấp đôi; LEFT JOIN thành INNER vì điều kiện để ở WHERE (2 phòng thay vì 25); ORDER BY tên tiếng Việt theo collation C/en_US/vi ICU; Prisma lưu DateTime thành timestamp không múi giờ nên "ngày 02/11" ra 114 hay 100 tuỳ cách viết. Góc hacker: $queryRawUnsafe ghép chuỗi trả cả 300 dòng.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2</span>
<h2>No error, wrong number</h2>
<p class="lead">The worst database bugs do not throw. The query runs, the page renders, the report goes to the accountant — and the number is wrong. There is no stack trace to read, so the method changes: shrink the question to one row you can check by hand, compare the query's answer with an independent count, and look for the six usual suspects below. Every output here is a real psql run on the 7.1 seed.</p>

<h3>An everyday picture: counting votes in class</h3>
<p>"Who did not vote for Lan?" — you count every paper that does not say Lan, and forget the blank papers. "How many people came to the party?" — you join the guest list with the photo list and count rows; everyone who appears in two photos is counted twice. SQL does exactly what you wrote; the bug is the gap between what you wrote and what you meant.</p>

<h3>1. NULL is not a value, it is "unknown"</h3>
${ra(RA_NULL)}
<p>Any comparison with NULL is NULL, and <code>WHERE</code> keeps only TRUE. So <code>"giamGia" = NULL</code> matches nothing, and "discount is not 20" silently drops the 2,400 bookings that have no discount at all. Note the last line: even <code>NOT (NULL = 1)</code> is NULL.</p>
${ra(NOT_IN)}
<p>One empty row typed into a lookup table and <code>NOT IN</code> returns <strong>zero</strong> students — a classic "the list is empty since yesterday" ticket. <code>x NOT IN (a, NULL)</code> means <code>x &lt;&gt; a AND x &lt;&gt; NULL</code>, and the second half is never TRUE. <code>NOT EXISTS</code> does not have this problem.</p>
${ra(NULL_SUM)}
<p>Revenue drops from 225.6 to 69.6 million because every booking without a discount turns the whole expression into NULL and <code>SUM</code> skips it without warning. ORMs inherit all of this:</p>
${ra(PRISMA_NULL)}
${MA_PRISMA_NULL}
${MA_JPA_NULL}
${BANG_NULL_EN}

<h3>2. JOIN multiplies rows (fan-out)</h3>
<p>Revenue per building = room payments (<code>ThanhToan</code>, two rows per approved booking: 30% deposit + 70%) plus equipment rentals (<code>ThueThietBi</code>, two rows for every third booking). The natural query joins both child tables at once:</p>
${ra(FANOUT)}
<p>The independent check says 234,000,000 for room money; the report says 69.3 + 68.6 + 67.2 + 67.9 = 273 million, and equipment is exactly doubled. The single-booking query shows why: booking 6 has 2 payments × 2 rentals = <strong>4 rows</strong>, so each payment is summed twice and each rental twice. The method that finds it in one minute: pick one parent row and look at the raw joined rows before any <code>GROUP BY</code>.</p>
${ra(FANOUT_SUA)}
<p>The fix is to aggregate each child table down to one row per booking <em>before</em> joining (CTEs or subqueries in <code>FROM</code>). <code>count(DISTINCT …)</code> or <code>sum(DISTINCT …)</code> only hide the problem — two different payments of the same amount would be merged.</p>

<h3>3. LEFT JOIN that quietly became INNER JOIN</h3>
${ra(LEFT_WHERE)}
<p>"All 25 rooms of building Alpha with their bookings on 30/11" returned 2 rooms. A condition on the right-hand table in <code>WHERE</code> runs after the join and throws away the rows where that table is NULL — the very rows LEFT JOIN was supposed to keep. Put conditions on the optional table in <code>ON</code>.</p>

<h3>4. GROUP BY and count(*)</h3>
${ra(COUNT_SAO)}
<p>After a LEFT JOIN, a room with no bookings still has one row (with NULLs), so <code>count(*)</code> says 1. Count the column of the optional table: <code>count(d.id)</code> gives 0. When a report total disagrees with the detail page, check which count it uses.</p>

<h3>5. Collation: how Vietnamese is sorted and compared</h3>
${ra(COLLATE)}
<p>Three orders for the same eight names. The Docker image creates databases with <code>en_US.utf8</code> (glibc); <code>"C"</code> compares bytes, so every accented letter lands after Z; only the ICU Vietnamese collation puts Đ after D as Vietnamese readers expect. <code>ILIKE '%anh%'</code> finds 0 of the 55 people named Ánh — matching is by character, not by "letter without tone". <code>unaccent</code> fixes the search (and turns Đ into D).</p>
${MA_VN}

<h3>6. timestamp vs timestamptz: "how many bookings on 2 November?"</h3>
${ra(TZ)}
<p>Prisma maps <code>DateTime</code> to <code>timestamp(3) without time zone</code> and stores UTC in it. A booking at 06:00 in Việt Nam is 23:00 UTC of the previous day, so <code>"batDau"::date = '2026-11-02'</code> counts by the UTC calendar: 114 instead of 100. With a real <code>timestamptz</code> column it is worse: <code>::date</code> uses the <em>session</em> time zone, so psql (UTC) and DBeaver on a Vietnamese laptop give different answers to the same query. Rules: store <code>timestamptz</code> (Prisma: <code>@db.Timestamptz(3)</code>), compute day boundaries in the user's zone, and filter by a half-open range on the raw column — it also keeps the index usable (lesson 7.3).</p>

<h3>Hacker corner: when input rewrites your query</h3>
<p>The most dangerous "wrong result" is the one an attacker chooses. Searching by name with string concatenation:</p>
${ra(TIEM)}
<p><code>x' OR '1'='1</code> turns a lookup into "everyone": 300 rows with e-mails. The query log from 7.1 shows the difference instantly: the unsafe version has the value inside the SQL text and <code>params=[]</code>; the safe one has <code>$1</code>. In 2023 the CL0P group used a SQL injection in MOVEit Transfer (CVE-2023-34362) to steal data from thousands of organisations (CISA advisory AA23-158A). In Prisma use the tagged template <code>$queryRaw\`…\${x}\`</code>, never <code>$queryRawUnsafe</code> with user input; in JPA use parameters (<code>:name</code>), never string concatenation in <code>@Query</code> or <code>createNativeQuery</code>.</p>

<h3>On the job</h3>
<p>"Báo cáo lệch với số kế toán" is one of the most common tickets in outsourcing projects for Japanese clients — and they will ask for the exact difference and its cause. Answer with a reconciliation: the report's number, the independent number (each child table summed separately), the difference, and one example row that explains it. That table is the bug report; the fix comes after.</p>

<h3>🧪 Practice (40 min)</h3>
<div class="callout ok">
<ol>
<li>Run <code>tools/c72-null.sql</code>; rewrite each wrong query so the counts become 2,700, 248 and 225,600,000 — without looking at the fixes above.</li>
<li>Run the fan-out query, then the single-booking query for <code>id = 6</code>. Explain the 273 vs 234 million in two sentences.</li>
<li>Move the date condition of the Alpha query from <code>WHERE</code> to <code>ON</code> and check you get 25 rooms with 23 empty.</li>
<li>Sort the eight names with three collations; decide which one your project's name column needs.</li>
<li>Count bookings of 02/11 in Việt Nam time with a half-open UTC range. Then <code>SET TIME ZONE</code> to UTC and to Asia/Ho_Chi_Minh and show which query changes its answer.</li>
</ol>
<p><strong>Done when:</strong> for each wrong number you have an independent count, the difference, and one row that explains it.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Three-valued logic</span><span class="v">TRUE, FALSE, NULL (unknown); <code>WHERE</code> keeps only TRUE.</span></div>
  <div class="kv"><span class="k">IS DISTINCT FROM</span><span class="v">Inequality that treats NULL as a comparable value.</span></div>
  <div class="kv"><span class="k">Fan-out</span><span class="v">Rows multiplied by joining two or more one-to-many children.</span></div>
  <div class="kv"><span class="k">Collation</span><span class="v">Rules for sorting and comparing text (libc, ICU, "C").</span></div>
  <div class="kv"><span class="k">timestamptz</span><span class="v">A point in time; shown in the session time zone.</span></div>
  <div class="kv"><span class="k">Reconciliation</span><span class="v">Comparing a report with an independent count, row by row.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A wrong number with no error: shrink to one row, compare with an independent count.</li>
<li>NULL breaks <code>=</code>, <code>&lt;&gt;</code>, <code>NOT IN</code> and arithmetic; ORMs translate faithfully into the same traps.</li>
<li>Never join two one-to-many children and sum; aggregate each first.</li>
<li>Conditions on the optional side of a LEFT JOIN belong in <code>ON</code>.</li>
<li>Choose collation deliberately for Vietnamese text; search without tones needs <code>unaccent</code>.</li>
<li>Store <code>timestamptz</code>, filter by half-open ranges, compute "a day" in the user's zone.</li>
</ul>
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2</span>
<h2>Không lỗi, mà số sai</h2>
<p class="lead">Những lỗi cơ sở dữ liệu tệ nhất không ném ngoại lệ. Truy vấn chạy, trang hiện ra, báo cáo gửi tới kế toán — và con số sai. Không có stack trace để đọc, nên phương pháp phải đổi: thu câu hỏi về một dòng kiểm được bằng tay, so câu trả lời của truy vấn với một phép đếm độc lập, và soát sáu nghi phạm quen thuộc dưới đây. Mọi output là lần chạy psql thật trên dữ liệu mẫu của bài 7.1.</p>

<h3>Liên tưởng đời thường: kiểm phiếu bầu lớp trưởng</h3>
<p>"Ai không bầu Lan?" — bạn đếm mọi phiếu không ghi Lan, và quên mất phiếu trắng. "Bao nhiêu người tới dự tiệc?" — bạn ghép danh sách khách với danh sách ảnh rồi đếm dòng; ai xuất hiện trong hai tấm ảnh bị đếm hai lần. SQL làm đúng y điều bạn viết; lỗi nằm ở khoảng cách giữa điều bạn viết và điều bạn muốn.</p>

<h3>1. NULL không phải một giá trị, nó là "không biết"</h3>
${ra(RA_NULL)}
<p>So sánh gì với NULL cũng ra NULL, mà <code>WHERE</code> chỉ giữ TRUE. Vì vậy <code>"giamGia" = NULL</code> không khớp dòng nào, và "giảm giá khác 20" lặng lẽ bỏ mất 2.400 lượt không có giảm giá. Để ý dòng cuối: ngay cả <code>NOT (NULL = 1)</code> cũng là NULL.</p>
${ra(NOT_IN)}
<p>Chỉ một dòng trống ai đó gõ vào bảng tra cứu, và <code>NOT IN</code> trả về <strong>0</strong> sinh viên — ticket kinh điển "danh sách trống trơn từ hôm qua". <code>x NOT IN (a, NULL)</code> nghĩa là <code>x &lt;&gt; a AND x &lt;&gt; NULL</code>, và vế sau không bao giờ TRUE. <code>NOT EXISTS</code> không mắc lỗi này.</p>
${ra(NULL_SUM)}
<p>Doanh thu tụt từ 225,6 xuống 69,6 triệu vì mọi lượt không có giảm giá biến cả biểu thức thành NULL và <code>SUM</code> bỏ qua mà không báo gì. ORM thừa hưởng hết những điều này:</p>
${ra(PRISMA_NULL)}
${MA_PRISMA_NULL}
${MA_JPA_NULL}
${BANG_NULL_VI}

<h3>2. JOIN nhân dòng (fan-out)</h3>
<p>Doanh thu theo toà = tiền phòng đã thu (<code>ThanhToan</code>, hai dòng mỗi lượt đã duyệt: cọc 30% + 70% còn lại) cộng tiền thuê thiết bị (<code>ThueThietBi</code>, hai dòng cho mỗi lượt thứ ba). Truy vấn "tự nhiên" JOIN cả hai bảng con một lúc:</p>
${ra(FANOUT)}
<p>Phép kiểm độc lập nói tiền phòng là 234.000.000; báo cáo nói 69,3 + 68,6 + 67,2 + 67,9 = 273 triệu, còn tiền thiết bị gấp đúng đôi. Truy vấn soi một lượt đặt chỉ ra lý do: lượt 6 có 2 lần thanh toán × 2 món thuê = <strong>4 dòng</strong>, nên mỗi khoản thanh toán bị cộng hai lần và mỗi món thuê cũng hai lần. Cách tìm ra trong một phút: chọn một dòng cha và xem các dòng đã JOIN thô trước khi <code>GROUP BY</code>.</p>
${ra(FANOUT_SUA)}
<p>Cách sửa là gộp từng bảng con về một dòng mỗi lượt đặt <em>trước</em> khi JOIN (CTE hoặc truy vấn con trong <code>FROM</code>). <code>count(DISTINCT …)</code> hay <code>sum(DISTINCT …)</code> chỉ che lỗi — hai khoản thanh toán khác nhau mà cùng số tiền sẽ bị gộp làm một.</p>

<h3>3. LEFT JOIN lặng lẽ thành INNER JOIN</h3>
${ra(LEFT_WHERE)}
<p>"Cả 25 phòng toà Alpha kèm lượt đặt ngày 30/11" trả về 2 phòng. Điều kiện trên bảng bên phải đặt ở <code>WHERE</code> chạy sau phép JOIN và vứt bỏ các dòng mà bảng đó là NULL — chính những dòng LEFT JOIN đáng lẽ phải giữ. Điều kiện trên bảng "có thể không có" phải để trong <code>ON</code>.</p>

<h3>4. GROUP BY và count(*)</h3>
${ra(COUNT_SAO)}
<p>Sau LEFT JOIN, phòng không có lượt đặt nào vẫn có một dòng (toàn NULL), nên <code>count(*)</code> ra 1. Hãy đếm cột của bảng tuỳ chọn: <code>count(d.id)</code> ra 0. Khi tổng của báo cáo không khớp trang chi tiết, xem nó dùng kiểu đếm nào.</p>

<h3>5. Collation: tiếng Việt được sắp xếp và so sánh thế nào</h3>
${ra(COLLATE)}
<p>Ba thứ tự cho cùng tám cái tên. Image Docker tạo database với <code>en_US.utf8</code> (glibc); <code>"C"</code> so từng byte nên mọi chữ có dấu nằm sau Z; chỉ collation ICU tiếng Việt xếp Đ sau D đúng như người Việt đọc. <code>ILIKE '%anh%'</code> tìm được 0 trong 55 người tên Ánh — so khớp theo ký tự, không theo "chữ bỏ dấu". <code>unaccent</code> giải quyết việc tìm (và biến Đ thành D).</p>
${MA_VN}

<h3>6. timestamp và timestamptz: "ngày 2 tháng 11 có bao nhiêu lượt?"</h3>
${ra(TZ)}
<p>Prisma ánh xạ <code>DateTime</code> thành <code>timestamp(3) without time zone</code> và cất giờ UTC vào đó. Một lượt lúc 06:00 giờ Việt Nam là 23:00 UTC hôm trước, nên <code>"batDau"::date = '2026-11-02'</code> đếm theo lịch UTC: 114 thay vì 100. Với cột <code>timestamptz</code> thật còn tệ hơn: <code>::date</code> dùng múi giờ của <em>phiên</em>, nên psql (UTC) và DBeaver trên laptop Việt Nam cho hai đáp án khác nhau cho cùng một câu. Luật: lưu <code>timestamptz</code> (Prisma: <code>@db.Timestamptz(3)</code>), tính ranh giới ngày theo múi giờ của người dùng, và lọc bằng khoảng nửa mở trên cột gốc — cách này còn giữ được chỉ mục (bài 7.3).</p>

<h3>Góc hacker: khi dữ liệu nhập viết lại truy vấn của bạn</h3>
<p>"Kết quả sai" nguy hiểm nhất là cái do kẻ tấn công chọn. Tìm theo tên bằng cách ghép chuỗi:</p>
${ra(TIEM)}
<p><code>x' OR '1'='1</code> biến một phép tra cứu thành "tất cả mọi người": 300 dòng kèm email. Log truy vấn của bài 7.1 cho thấy khác biệt ngay: bản không an toàn có giá trị nằm trong chữ SQL và <code>params=[]</code>; bản an toàn có <code>$1</code>. Năm 2023 nhóm CL0P dùng một lỗi SQL injection trong MOVEit Transfer (CVE-2023-34362) để lấy dữ liệu của hàng nghìn tổ chức (khuyến cáo CISA AA23-158A). Trong Prisma, dùng tagged template <code>$queryRaw\`…\${x}\`</code>, không bao giờ dùng <code>$queryRawUnsafe</code> với dữ liệu người dùng; trong JPA, dùng tham số (<code>:ten</code>), không bao giờ ghép chuỗi trong <code>@Query</code> hay <code>createNativeQuery</code>.</p>

<h3>Tình huống đi làm</h3>
<p>"Báo cáo lệch với số kế toán" là một trong những ticket hay gặp nhất ở dự án outsourcing cho khách Nhật — và họ sẽ hỏi chính xác lệch bao nhiêu, vì sao. Trả lời bằng một bảng đối chiếu: số của báo cáo, số độc lập (cộng riêng từng bảng con), phần chênh, và một dòng ví dụ giải thích được phần chênh. Bảng đó chính là bug report; bản sửa đến sau.</p>

<h3>🧪 Thực hành (40 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>tools/c72-null.sql</code>; viết lại từng truy vấn sai để ra 2.700, 248 và 225.600.000 — không nhìn các bản sửa ở trên.</li>
<li>Chạy truy vấn fan-out, rồi truy vấn soi một lượt với <code>id = 6</code>. Giải thích con số 273 so với 234 triệu trong hai câu.</li>
<li>Chuyển điều kiện ngày của truy vấn toà Alpha từ <code>WHERE</code> sang <code>ON</code>, kiểm bạn được 25 phòng, 23 phòng trống.</li>
<li>Sắp tám cái tên với ba collation; quyết định cột tên trong dự án của bạn cần cái nào.</li>
<li>Đếm lượt đặt ngày 02/11 theo giờ Việt Nam bằng khoảng UTC nửa mở. Sau đó <code>SET TIME ZONE</code> sang UTC và Asia/Ho_Chi_Minh, chỉ ra truy vấn nào đổi đáp án.</li>
</ol>
<p><strong>Đạt khi:</strong> với mỗi con số sai, bạn có một phép đếm độc lập, phần chênh, và một dòng giải thích được nó.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Logic ba trị</span><span class="v">TRUE, FALSE, NULL (không biết); <code>WHERE</code> chỉ giữ TRUE.</span></div>
  <div class="kv"><span class="k">IS DISTINCT FROM</span><span class="v">Phép "khác" coi NULL là một giá trị so sánh được.</span></div>
  <div class="kv"><span class="k">Fan-out</span><span class="v">Dòng bị nhân lên khi JOIN từ hai bảng con một-nhiều trở lên.</span></div>
  <div class="kv"><span class="k">Collation</span><span class="v">Luật sắp xếp và so sánh chữ (libc, ICU, "C").</span></div>
  <div class="kv"><span class="k">timestamptz</span><span class="v">Một thời điểm; hiển thị theo múi giờ của phiên.</span></div>
  <div class="kv"><span class="k">Đối chiếu</span><span class="v">So báo cáo với một phép đếm độc lập, từng dòng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Số sai mà không lỗi: thu về một dòng, so với phép đếm độc lập.</li>
<li>NULL phá <code>=</code>, <code>&lt;&gt;</code>, <code>NOT IN</code> và phép tính; ORM dịch trung thành vào đúng những cái bẫy đó.</li>
<li>Đừng JOIN hai bảng con một-nhiều rồi cộng; gộp từng bảng trước.</li>
<li>Điều kiện trên phía tuỳ chọn của LEFT JOIN thuộc về <code>ON</code>.</li>
<li>Chọn collation có chủ đích cho chữ tiếng Việt; tìm không dấu cần <code>unaccent</code>.</li>
<li>Lưu <code>timestamptz</code>, lọc bằng khoảng nửa mở, tính "một ngày" theo múi giờ người dùng.</li>
</ul>
${NGUON}
</div>
`,
};
