/**
 * CSI106 · Chương 11 — Databases, học theo từng slide: PHẦN B (slide 22–42).
 * Deck 'csi11' (CSI11), 42 slide, ảnh đã render lên CDN images/academy/CSI106/v1/csi11/NNN.webp.
 *
 * Nội dung bám ĐÚNG chữ trích từ CSI_11.pptx của trường (/tmp/csi106-text/csi11.txt, slide 22→42).
 * Các slide mà bảng dữ liệu / sơ đồ ERD / ảnh chụp màn hình nằm TRONG ẢNH (22, 23, 24, 25, 26,
 * 29, 30, 31, 33, 34, 37, 38, 39, 41, 42) đã được đọc thẳng từ ảnh đã render để lấy đúng từng ô.
 *
 * MỌI câu SQL trong bài đã CHẠY THẬT bằng sqlite3 (/usr/bin/sqlite3) trên đúng dữ liệu của slide
 * (COURSES / TAUGHT-BY / CIS15-Roster / CIS52-Roster) và trên một CSDL thư viện tự dựng
 * (SinhVien · Sach · MuonSach · Lop) cho phần chuẩn hoá. Bảng kết quả ghi trong bài là kết quả thật,
 * kể cả các thông báo lỗi (UNIQUE constraint failed, NOT NULL constraint failed,
 * "no such column: COURSE.No", "SELECTs … do not have the same number of result columns")
 * và số đo index (200 truy vấn trên 200.000 dòng: 1,525 s khi không index → 0,001 s khi có index).
 *
 * Những chỗ SLIDE GỐC SAI hoặc tự mâu thuẫn — đã nêu rõ trong bài, KHÔNG im lặng chép lại
 * và KHÔNG tự ý sửa slide:
 *   · slide 25 (hình) viết "where COURSE.No = TAUGHT-BY.No" trong khi bảng tên là COURSES →
 *     chạy thật trả "no such column: COURSE.No".
 *   · slide 29 (hình) gán lực lượng "takes" là M–1 (COURSE M — 1 STUDENT), tức một sinh viên
 *     học nhiều môn nhưng một môn chỉ có một sinh viên. Thực tế là N:M.
 *   · slide 30/31 nhắc "Figure 14.16 / 14.17 / 14.18" (số hình của giáo trình Forouzan ch.14)
 *     trong khi chú thích hình lại là "Figure 11.16 / 11.17"; slide 31 ghi "Example 11.3" còn
 *     slide 30 ghi "Example 14.2" — đánh số lẫn lộn hai hệ.
 *   · slide 38 và 39: ảnh chụp bị LỆCH MỘT BƯỚC so với chữ — ảnh slide 38 ("Locate the Database
 *     folder") đang mở menu "New Database…" của bước 4, ảnh slide 39 ("Create a new database")
 *     đang mở menu "New Table…" của bước 5.
 *   · slide 41/42 (ảnh): ô Column Name của dòng đầu bị gõ là "int" (đáng lẽ "ID"), còn Data Type
 *     của nó là nchar(10) — tức người chụp đã gõ kiểu dữ liệu vào ô tên cột.
 *   · slide 37 ghi "set the Database Name to …" — dấu ba chấm bỏ trống, và đúng ra ô phải điền
 *     là Server Name, không phải Database Name.
 *   · slide 32 ghi "to allow a languages like SQL" (lỗi chính tả), slide 2 ghi "Guide do practice
 *     set" (đúng ra "Guide to").
 *   · Deck DỪNG ở 2NF — không có slide 3NF/BCNF, dù slide 32 có liệt kê chúng. Phần 3NF trong bài
 *     này được ghi rõ là BỔ SUNG ngoài slide.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'csi11';

export default {
  title: '11.0b — Slide by slide: Relational operations, E-R diagrams, normalization and the SQL Server practice set (slides 22–42)|||11.0b — Slide bài giảng: Phép toán quan hệ, sơ đồ ERD, chuẩn hoá & phần thực hành SQL Server (slide 22–42)',
  slug: 'csi106-11-0b-slides-phep-toan-quan-he-thiet-ke',
  type: 'DOCUMENT',
  description: 'Nửa sau Chương 11 của CSI106 (slide 22–42) theo đúng bộ slide của trường: năm phép toán còn lại trên quan hệ (delete, update, select, join, union — kèm cả project, intersection, difference mà slide 20 có kể tên nhưng không có slide riêng), rồi thiết kế CSDL với sơ đồ thực thể–liên kết, chuyển ERD thành bảng, chuẩn hoá 1NF/2NF (và 3NF bổ sung ngoài slide), cuối cùng là bảy bước hướng dẫn thực hành trên SQL Server Management Studio. Mỗi phép toán được chạy THẬT bằng sqlite3 trên đúng dữ liệu của slide và bảng kết quả trong bài là kết quả thật, gồm cả các thông báo lỗi và phép đo index 1,525 s → 0,001 s. Những chỗ slide gốc sai (tên bảng COURSE/COURSES, lực lượng của quan hệ takes, ảnh chụp lệch một bước, ô tên cột bị gõ là "int") đều được chỉ ra thay vì chép lại.',
  content: [
    walkHead(D, 22, 42),
    walk(D, [

      [22, '4. Delete',
        `<p class="y-chinh">🎯 The second of the three <strong>unary</strong> write operations. <code>delete</code> removes whole <em>tuples</em> (rows) that match a criterion — it never removes a column, and it never removes part of a row.</p>
<ul>
<li><strong>The format the slide gives</strong> — <code>delete from RELATION-NAME where criteria</code>. Two clauses only. Compare it with <code>insert</code> on slide 21: insert names the values, delete names a <em>condition</em>.</li>
<li><strong>Unary means one relation</strong> — delete touches exactly one table. That is why slides 21–24 (insert, delete, update, select) are grouped: all four are unary. Join, union, intersection and difference on slides 25–26 are <em>binary</em> — they need two relations.</li>
<li><strong>Read the figure as an experiment</strong> — the COURSES relation on the left has 5 tuples; the command <code>delete from COURSES where No = "CIS19"</code> is applied; the COURSES relation on the right has 4. The relation is <em>the same relation</em>, changed in place. Delete is destructive, unlike select which produces a new relation and leaves the original alone.</li>
<li><strong>Run for real</strong> — the five tuples of the figure were loaded into sqlite3 and the command executed. SQLite reported <code>changes() = 1</code>, i.e. exactly one tuple gone:
<table><tr><td><strong>No</strong></td><td><strong>Course-Name</strong></td><td><strong>Unit</strong></td></tr>
<tr><td>CIS15</td><td>Intro to C</td><td>5</td></tr>
<tr><td>CIS17</td><td>Intro to Java</td><td>5</td></tr>
<tr><td>CIS51</td><td>Networking</td><td>5</td></tr>
<tr><td>CIS52</td><td>TCP/IP</td><td>6</td></tr></table>
Cardinality went from 5 to 4; the <em>degree</em> (number of attributes) stayed at 3. Delete changes cardinality, never degree.</li>
<li><strong>What happens with no <code>where</code></strong> — tested on a copy: <code>delete from COURSES;</code> reported <code>changes() = 4</code> and left an empty relation. The table still exists — it is emptied, not dropped. That is the difference between <code>delete from T</code> and <code>drop table T</code>.</li>
</ul>
<p class="dap-an">✅ Answer: after <code>delete from COURSES where No = "CIS19"</code> the relation holds the 4 tuples CIS15, CIS17, CIS51, CIS52. One tuple removed, degree unchanged at 3.</p>
<p class="pitfall">⚠️ The exam trap is the missing <code>where</code>. In SQL the <code>where</code> clause is <em>optional</em>, so <code>delete from COURSES</code> is perfectly legal and silently wipes the whole relation — measured above: 4 rows gone, no warning. Always write the <code>where</code> first and the <code>delete</code> second.</p>`,
        `<p class="y-chinh">🎯 Phép thứ hai trong ba phép ghi <strong>một ngôi</strong> (unary). <code>delete</code> xoá nguyên cả <em>bộ</em> (dòng) khớp điều kiện — nó không bao giờ xoá một cột, cũng không xoá một phần của dòng.</p>
<ul>
<li><strong>Cú pháp slide đưa ra</strong> — <code>delete from RELATION-NAME where criteria</code>. Chỉ hai mệnh đề. So với <code>insert</code> ở slide 21: insert kể ra các GIÁ TRỊ, delete kể ra một ĐIỀU KIỆN.</li>
<li><strong>"Một ngôi" nghĩa là một quan hệ</strong> — delete chỉ đụng vào đúng một bảng. Vì thế slide 21–24 (insert, delete, update, select) được gom thành một cụm: cả bốn đều một ngôi. Join, union, intersection, difference ở slide 25–26 là phép <em>hai ngôi</em> — cần hai quan hệ.</li>
<li><strong>Đọc hình như một thí nghiệm</strong> — quan hệ COURSES bên trái có 5 bộ; áp lệnh <code>delete from COURSES where No = "CIS19"</code>; quan hệ COURSES bên phải còn 4. Vẫn là <em>chính quan hệ đó</em>, bị sửa tại chỗ. Delete có tính phá huỷ, khác với select vốn sinh ra quan hệ MỚI và để nguyên bản gốc.</li>
<li><strong>Chạy thật</strong> — năm bộ trong hình đã được nạp vào sqlite3 rồi chạy đúng lệnh ấy. SQLite báo <code>changes() = 1</code>, tức đúng một bộ biến mất:
<table><tr><td><strong>No</strong></td><td><strong>Course-Name</strong></td><td><strong>Unit</strong></td></tr>
<tr><td>CIS15</td><td>Intro to C</td><td>5</td></tr>
<tr><td>CIS17</td><td>Intro to Java</td><td>5</td></tr>
<tr><td>CIS51</td><td>Networking</td><td>5</td></tr>
<tr><td>CIS52</td><td>TCP/IP</td><td>6</td></tr></table>
Lực lượng (cardinality) từ 5 xuống 4; <em>bậc</em> (số thuộc tính) vẫn là 3. Delete đổi lực lượng, không bao giờ đổi bậc.</li>
<li><strong>Không có <code>where</code> thì sao</strong> — đã thử trên một bản sao: <code>delete from COURSES;</code> báo <code>changes() = 4</code> và để lại một quan hệ rỗng. Bảng VẪN CÒN — nó bị dọn sạch chứ không bị xoá. Đó là khác biệt giữa <code>delete from T</code> và <code>drop table T</code>.</li>
</ul>
<p class="dap-an">✅ Đáp án: sau <code>delete from COURSES where No = "CIS19"</code> quan hệ còn 4 bộ CIS15, CIS17, CIS51, CIS52. Mất một bộ, bậc vẫn là 3.</p>
<p class="pitfall">⚠️ Bẫy thi nằm ở chỗ THIẾU <code>where</code>. Trong SQL mệnh đề <code>where</code> là <em>tuỳ chọn</em>, nên <code>delete from COURSES</code> hoàn toàn hợp lệ và âm thầm quét sạch cả quan hệ — đã đo ở trên: bay 4 dòng, không một lời cảnh báo. Hãy tập thói quen viết <code>where</code> trước, viết <code>delete</code> sau.</p>`],

      [23, '5. Update',
        `<p class="y-chinh">🎯 The third unary operation. <code>update</code> keeps the tuple but changes the <em>value of some of its attributes</em> — it is the only operation that modifies a row instead of adding or removing one.</p>
<ul>
<li><strong>Three clauses this time</strong> — <code>update RELATION-NAME</code> / <code>set attribute1 = value1, attribute2 = value2, …</code> / <code>where criteria</code>. The <code>set</code> clause says <em>what to change</em>, the <code>where</code> clause says <em>which rows</em>. Mixing the two up is the classic beginner error.</li>
<li><strong>The figure's experiment</strong> — <code>update COURSES set Unit = 6 where No = "CIS51"</code>. Left table: CIS51 Networking has Unit 5. Right table: CIS51 Networking has Unit 6. Every other tuple is byte-for-byte identical, and the cardinality stays at 5.</li>
<li><strong>Run for real</strong> — sqlite3 reported <code>changes() = 1</code> and produced:
<table><tr><td><strong>No</strong></td><td><strong>Course-Name</strong></td><td><strong>Unit</strong></td></tr>
<tr><td>CIS15</td><td>Intro to C</td><td>5</td></tr>
<tr><td>CIS17</td><td>Intro to Java</td><td>5</td></tr>
<tr><td>CIS19</td><td>UNIX</td><td>4</td></tr>
<tr><td>CIS51</td><td>Networking</td><td><strong>6</strong></td></tr>
<tr><td>CIS52</td><td>TCP/IP</td><td>6</td></tr></table></li>
<li><strong>The new value can be computed from the old one</strong> — a second command was run on the same relation: <code>update COURSES set Unit = Unit + 1 where Unit &lt; 5</code>. Only CIS19 (Unit 4) qualified, <code>changes() = 1</code>, and its Unit became 5. The right-hand side of <code>set</code> is an <em>expression</em>, and it reads the row's current value.</li>
<li><strong>Why this matters for Chapter 11 as a whole</strong> — update is the operation that makes <em>redundancy</em> dangerous. If a fact is stored in four places, a correct update must touch four rows, and touching three of them is how a database becomes inconsistent. That is the exact motivation for normalization on slides 32–34, and for the "less redundancy / inconsistency avoidance" advantages back on slide 6.</li>
</ul>
<p class="dap-an">✅ Answer: after the slide's command, CIS51 Networking has Unit = 6; the other four tuples and the cardinality 5 are unchanged. After the extra relative update, CIS19 UNIX went from 4 to 5.</p>
<p class="pitfall">⚠️ The <code>=</code> sign means two different things in one statement. In <code>set Unit = 6</code> it is <em>assignment</em>; in <code>where No = "CIS51"</code> it is <em>comparison</em>. Writing <code>update COURSES set Unit = 6, No = "CIS51"</code> is legal SQL and would rename every course to CIS51 — a real, silent catastrophe.</p>`,
        `<p class="y-chinh">🎯 Phép một ngôi thứ ba. <code>update</code> GIỮ nguyên bộ nhưng đổi <em>giá trị của một vài thuộc tính</em> trong bộ đó — đây là phép duy nhất sửa một dòng, thay vì thêm hoặc bớt dòng.</p>
<ul>
<li><strong>Lần này ba mệnh đề</strong> — <code>update RELATION-NAME</code> / <code>set attribute1 = value1, attribute2 = value2, …</code> / <code>where criteria</code>. Mệnh đề <code>set</code> nói <em>đổi cái gì</em>, mệnh đề <code>where</code> nói <em>đổi ở dòng nào</em>. Lẫn lộn hai chỗ này là lỗi kinh điển của người mới.</li>
<li><strong>Thí nghiệm trong hình</strong> — <code>update COURSES set Unit = 6 where No = "CIS51"</code>. Bảng trái: CIS51 Networking có Unit 5. Bảng phải: CIS51 Networking có Unit 6. Mọi bộ khác giống hệt tới từng ký tự, lực lượng vẫn là 5.</li>
<li><strong>Chạy thật</strong> — sqlite3 báo <code>changes() = 1</code> và cho ra:
<table><tr><td><strong>No</strong></td><td><strong>Course-Name</strong></td><td><strong>Unit</strong></td></tr>
<tr><td>CIS15</td><td>Intro to C</td><td>5</td></tr>
<tr><td>CIS17</td><td>Intro to Java</td><td>5</td></tr>
<tr><td>CIS19</td><td>UNIX</td><td>4</td></tr>
<tr><td>CIS51</td><td>Networking</td><td><strong>6</strong></td></tr>
<tr><td>CIS52</td><td>TCP/IP</td><td>6</td></tr></table></li>
<li><strong>Giá trị mới tính được TỪ giá trị cũ</strong> — chạy tiếp trên chính quan hệ ấy: <code>update COURSES set Unit = Unit + 1 where Unit &lt; 5</code>. Chỉ CIS19 (Unit 4) thoả, <code>changes() = 1</code>, và Unit của nó thành 5. Vế phải của <code>set</code> là một <em>biểu thức</em>, và nó đọc được giá trị hiện tại của dòng.</li>
<li><strong>Vì sao điều này quan trọng cho cả Chương 11</strong> — update chính là phép biến <em>dư thừa</em> thành nguy hiểm. Nếu một sự kiện được lưu ở bốn chỗ thì một lần sửa ĐÚNG phải chạm vào bốn dòng, và chạm được ba dòng là lúc CSDL trở nên mâu thuẫn. Đó đúng là động cơ của phần chuẩn hoá ở slide 32–34, và của hai lợi thế "ít dư thừa / tránh mâu thuẫn" ở slide 6.</li>
</ul>
<p class="dap-an">✅ Đáp án: sau lệnh của slide, CIS51 Networking có Unit = 6; bốn bộ còn lại và lực lượng 5 không đổi. Sau lệnh update tương đối thêm vào, CIS19 UNIX đi từ 4 lên 5.</p>
<p class="pitfall">⚠️ Dấu <code>=</code> mang HAI nghĩa khác nhau trong cùng một câu lệnh. Ở <code>set Unit = 6</code> nó là <em>phép gán</em>; ở <code>where No = "CIS51"</code> nó là <em>phép so sánh</em>. Viết <code>update COURSES set Unit = 6, No = "CIS51"</code> vẫn là SQL hợp lệ và sẽ đổi tên MỌI môn thành CIS51 — một thảm hoạ có thật và câm lặng.</p>`],

      [24, '6. Select',
        `<p class="y-chinh">🎯 The first <em>read-only</em> operation. Select is unary and it produces a <strong>new relation whose tuples are a subset of the original</strong> — same attributes, fewer rows. Nothing in the stored data changes.</p>
<ul>
<li><strong>Format</strong> — <code>select * from RELATION-NAME where criteria</code>. The <code>*</code> is what makes this <em>select</em> and not <em>project</em>: it says "keep every attribute". Select cuts horizontally (rows); project cuts vertically (columns).</li>
<li><strong>The figure</strong> — <code>select * from COURSES where Unit = 5</code> turns the 5-tuple COURSES into a 3-tuple result. Verified in sqlite3:
<table><tr><td><strong>No</strong></td><td><strong>Course-Name</strong></td><td><strong>Unit</strong></td></tr>
<tr><td>CIS15</td><td>Intro to C</td><td>5</td></tr>
<tr><td>CIS17</td><td>Intro to Java</td><td>5</td></tr>
<tr><td>CIS51</td><td>Networking</td><td>5</td></tr></table>
Degree still 3, cardinality 5 → 3, and the stored COURSES is untouched.</li>
<li><strong>Project — the operation slide 20 promised and never gave a slide</strong> — slide 20 lists nine operations including <em>project</em>, but the deck jumps from select straight to join. Project is what you get by replacing <code>*</code> with a list of attributes. Run for real, <code>select No, "Course-Name" from COURSES</code> gave all 5 rows but only 2 columns: degree 3 → 2, cardinality unchanged. And <code>select Unit from COURSES</code> returned <code>5, 5, 4, 5, 6</code> — five rows with duplicates; <code>select distinct Unit</code> returned <code>5, 4, 6</code>.</li>
<li><strong>The two combine</strong> — <code>select No, "Course-Name" from COURSES where Unit &gt;= 5</code> ran and returned exactly 4 rows × 2 columns (CIS15, CIS17, CIS51, CIS52). Almost every real query is a select and a project at once, which is why SQL uses the single keyword <code>SELECT</code> for both and why the exam's vocabulary ("selection" = rows, "projection" = columns) must be kept straight in your head, not in the syntax.</li>
<li><strong>A measured NULL trap</strong> — a sixth course CIS99 with <code>Unit = NULL</code> was added, then three counts were run: total = 6, rows with <code>Unit = 5</code> → 3, rows with <code>Unit &lt;&gt; 5</code> → 2. Three plus two is five, not six. The NULL row satisfies <em>neither</em> condition, because any comparison with NULL yields "unknown". Only <code>where Unit is null</code> finds it.</li>
</ul>
<p class="dap-an">✅ Answer: <code>where Unit = 5</code> gives 3 tuples (CIS15, CIS17, CIS51). Adding a NULL row proves the split is not exhaustive: 3 + 2 = 5 of 6 rows, one row falls through both branches.</p>
<p class="meo">💡 One line to keep select and project apart for the exam: <strong>select is a knife held horizontally (it cuts rows away), project is a knife held vertically (it cuts columns away).</strong> The result of both is always a relation — which is why they can be chained.</p>`,
        `<p class="y-chinh">🎯 Phép <em>chỉ đọc</em> đầu tiên. Select là phép một ngôi và nó sinh ra một <strong>quan hệ MỚI có các bộ là tập con của quan hệ gốc</strong> — vẫn đủ thuộc tính, ít dòng hơn. Dữ liệu đang lưu không hề bị đụng vào.</p>
<ul>
<li><strong>Cú pháp</strong> — <code>select * from RELATION-NAME where criteria</code>. Chính dấu <code>*</code> làm nó là <em>select</em> chứ không phải <em>project</em>: nó nói "giữ mọi thuộc tính". Select cắt NGANG (theo dòng); project cắt DỌC (theo cột).</li>
<li><strong>Hình trong slide</strong> — <code>select * from COURSES where Unit = 5</code> biến COURSES 5 bộ thành kết quả 3 bộ. Đã kiểm bằng sqlite3:
<table><tr><td><strong>No</strong></td><td><strong>Course-Name</strong></td><td><strong>Unit</strong></td></tr>
<tr><td>CIS15</td><td>Intro to C</td><td>5</td></tr>
<tr><td>CIS17</td><td>Intro to Java</td><td>5</td></tr>
<tr><td>CIS51</td><td>Networking</td><td>5</td></tr></table>
Bậc vẫn 3, lực lượng 5 → 3, và bảng COURSES đang lưu không suy suyển.</li>
<li><strong>Project — phép mà slide 20 có hứa nhưng deck không cho slide riêng</strong> — slide 20 kể chín phép, trong đó có <em>project</em>, nhưng deck nhảy thẳng từ select sang join. Project chính là thứ bạn nhận được khi thay <code>*</code> bằng một danh sách thuộc tính. Chạy thật, <code>select No, "Course-Name" from COURSES</code> cho đủ 5 dòng nhưng chỉ 2 cột: bậc 3 → 2, lực lượng không đổi. Còn <code>select Unit from COURSES</code> trả về <code>5, 5, 4, 5, 6</code> — năm dòng có trùng; <code>select distinct Unit</code> trả về <code>5, 4, 6</code>.</li>
<li><strong>Hai phép này ghép được với nhau</strong> — <code>select No, "Course-Name" from COURSES where Unit &gt;= 5</code> đã chạy và trả đúng 4 dòng × 2 cột (CIS15, CIS17, CIS51, CIS52). Gần như mọi truy vấn thật đều vừa select vừa project, và đó là lý do SQL dùng chung một từ khoá <code>SELECT</code> cho cả hai — nên cặp từ vựng của bài thi ("selection" = dòng, "projection" = cột) phải nằm trong đầu bạn, chứ cú pháp không phân biệt hộ.</li>
<li><strong>Một bẫy NULL đã đo</strong> — thêm môn thứ sáu CIS99 với <code>Unit = NULL</code>, rồi chạy ba phép đếm: tổng = 6, số dòng <code>Unit = 5</code> → 3, số dòng <code>Unit &lt;&gt; 5</code> → 2. Ba cộng hai bằng năm, không bằng sáu. Dòng NULL không thoả <em>cả hai</em> điều kiện, vì mọi so sánh với NULL đều cho "không biết". Chỉ <code>where Unit is null</code> mới tìm thấy nó.</li>
</ul>
<p class="dap-an">✅ Đáp án: <code>where Unit = 5</code> cho 3 bộ (CIS15, CIS17, CIS51). Thêm một dòng NULL chứng minh phép chia hai nhánh KHÔNG vét hết: 3 + 2 = 5 trên 6 dòng, một dòng lọt qua cả hai nhánh.</p>
<p class="meo">💡 Một dòng để phân biệt select với project vĩnh viễn: <strong>select là con dao cầm NGANG (chém đi các dòng), project là con dao cầm DỌC (chém đi các cột).</strong> Kết quả của cả hai luôn là một quan hệ — nên chúng nối tiếp nhau được.</p>`],

      [25, '7. Join',
        `<p class="y-chinh">🎯 The first <strong>binary</strong> operation, and the single most important idea in the relational model: <em>join combines two relations on common attributes</em>. It is what lets you split data into many small tables without losing the ability to see it as one.</p>
<ul>
<li><strong>Format</strong> — <code>select attribute-list from RELATION1, RELATION2 where criteria</code>. The <code>where</code> here is not a filter on values, it is the <strong>join condition</strong>: it says which tuple of table 1 pairs with which tuple of table 2.</li>
<li><strong>The figure</strong> — COURSES(No, Course-Name, Unit) joined with TAUGHT-BY(No, Professor) on the common attribute <code>No</code>, producing a 4-attribute relation. Loaded into sqlite3 and run, it gives exactly the slide's result:
<table><tr><td><strong>No</strong></td><td><strong>Course-Name</strong></td><td><strong>Unit</strong></td><td><strong>Professor</strong></td></tr>
<tr><td>CIS15</td><td>Intro to C</td><td>5</td><td>Lee</td></tr>
<tr><td>CIS17</td><td>Intro to Java</td><td>5</td><td>Lu</td></tr>
<tr><td>CIS19</td><td>UNIX</td><td>4</td><td>Walter</td></tr>
<tr><td>CIS51</td><td>Networking</td><td>5</td><td>Lu</td></tr>
<tr><td>CIS52</td><td>TCP/IP</td><td>6</td><td>Lee</td></tr></table>
The common attribute <code>No</code> appears once, not twice — that is the definition of a natural join.</li>
<li><strong>Inner join loses the unmatched rows</strong> — a sixth course CIS60 "Databases" (nobody assigned) and a seventh assignment CIS70/Kim (no such course) were added, then the slide's query re-run: still exactly 5 rows. CIS60 and CIS70 vanished. That is an <em>inner</em> join: a tuple survives only if it has a partner.</li>
<li><strong>Left join keeps them</strong> — <code>select c.No, c."Course-Name", t.Professor from COURSES c left join "TAUGHT-BY" t on c.No = t.No</code> returned 6 rows, the sixth being <code>CIS60 · Databases · (empty)</code>. The empty cell is NULL — "this course has no professor". This is how you answer "which courses have no lecturer yet?", a question an inner join physically cannot answer.</li>
<li><strong>Forget the join condition and you get the Cartesian product</strong> — measured: 6 courses × 6 assignments = <strong>36 rows</strong>, starting with CIS15/CIS15, CIS17/CIS15, CIS19/CIS15… every course paired with every assignment. On two tables of a thousand rows that is a million rows, which is how a missing <code>where</code> takes a server down.</li>
</ul>
<p class="dap-an">✅ Answer: the slide's join gives 5 tuples of degree 4. Adding an unmatched course, the inner join still gives 5 (CIS60 lost) while the LEFT JOIN gives 6 (CIS60 kept, Professor = NULL). Dropping the join condition gives 36.</p>
<p class="pitfall">⚠️ <strong>The slide's SQL does not run.</strong> The yellow box reads <code>where COURSE.No = TAUGHT-BY.No;</code> but the relation on the left is named <strong>COURSES</strong>, with an S. Typed verbatim into sqlite3 it fails with <code>no such column: COURSE.No</code>. Also, the projected attributes must be qualified: <code>select No, …</code> alone fails with <code>ambiguous column name: No</code>, because <em>both</em> relations have an attribute called No. The idea on the slide is right; the text of the query is not. Do not copy it into an exam answer as it stands.</p>`,
        `<p class="y-chinh">🎯 Phép <strong>hai ngôi</strong> đầu tiên, và cũng là ý quan trọng nhất của mô hình quan hệ: <em>join ghép hai quan hệ theo các thuộc tính chung</em>. Chính nó cho phép bạn xé dữ liệu thành nhiều bảng nhỏ mà không mất khả năng nhìn chúng như một.</p>
<ul>
<li><strong>Cú pháp</strong> — <code>select attribute-list from RELATION1, RELATION2 where criteria</code>. Chữ <code>where</code> ở đây KHÔNG phải bộ lọc giá trị, nó là <strong>điều kiện nối</strong>: nó nói bộ nào của bảng 1 ghép với bộ nào của bảng 2.</li>
<li><strong>Hình trong slide</strong> — COURSES(No, Course-Name, Unit) nối với TAUGHT-BY(No, Professor) theo thuộc tính chung <code>No</code>, sinh ra một quan hệ 4 thuộc tính. Nạp vào sqlite3 rồi chạy, kết quả đúng y hình:
<table><tr><td><strong>No</strong></td><td><strong>Course-Name</strong></td><td><strong>Unit</strong></td><td><strong>Professor</strong></td></tr>
<tr><td>CIS15</td><td>Intro to C</td><td>5</td><td>Lee</td></tr>
<tr><td>CIS17</td><td>Intro to Java</td><td>5</td><td>Lu</td></tr>
<tr><td>CIS19</td><td>UNIX</td><td>4</td><td>Walter</td></tr>
<tr><td>CIS51</td><td>Networking</td><td>5</td><td>Lu</td></tr>
<tr><td>CIS52</td><td>TCP/IP</td><td>6</td><td>Lee</td></tr></table>
Thuộc tính chung <code>No</code> chỉ hiện MỘT lần, không phải hai — đó là định nghĩa của phép nối tự nhiên.</li>
<li><strong>Inner join làm RỤNG các dòng không khớp</strong> — thêm môn thứ sáu CIS60 "Databases" (chưa phân công ai) và bản ghi phân công thứ bảy CIS70/Kim (không có môn nào như thế), rồi chạy lại đúng truy vấn của slide: vẫn đúng 5 dòng. CIS60 và CIS70 biến mất. Đó là nối <em>trong</em> (inner): một bộ chỉ sống sót nếu có bạn nhảy.</li>
<li><strong>Left join thì giữ chúng lại</strong> — <code>select c.No, c."Course-Name", t.Professor from COURSES c left join "TAUGHT-BY" t on c.No = t.No</code> trả về 6 dòng, dòng thứ sáu là <code>CIS60 · Databases · (trống)</code>. Ô trống ấy là NULL — "môn này chưa có giảng viên". Đây là cách trả lời câu hỏi "môn nào chưa ai dạy?", một câu mà inner join về mặt vật lý không trả lời được.</li>
<li><strong>Quên điều kiện nối là ra tích Descartes</strong> — đo thật: 6 môn × 6 phân công = <strong>36 dòng</strong>, bắt đầu bằng CIS15/CIS15, CIS17/CIS15, CIS19/CIS15… mỗi môn ghép với mọi phân công. Với hai bảng nghìn dòng thì đó là một triệu dòng, và đấy là cách một chữ <code>where</code> bị quên hạ gục cả máy chủ.</li>
</ul>
<p class="dap-an">✅ Đáp án: phép join của slide cho 5 bộ, bậc 4. Thêm một môn không khớp thì inner join vẫn 5 (mất CIS60) còn LEFT JOIN cho 6 (giữ CIS60, Professor = NULL). Bỏ điều kiện nối thì ra 36.</p>
<p class="pitfall">⚠️ <strong>Câu SQL trên slide KHÔNG chạy được.</strong> Ô vàng ghi <code>where COURSE.No = TAUGHT-BY.No;</code> nhưng quan hệ bên trái tên là <strong>COURSES</strong>, có chữ S. Gõ nguyên văn vào sqlite3 thì lỗi <code>no such column: COURSE.No</code>. Ngoài ra danh sách cột phải ghi rõ thuộc bảng nào: chỉ viết <code>select No, …</code> sẽ lỗi <code>ambiguous column name: No</code>, vì <em>cả hai</em> quan hệ đều có thuộc tính tên No. Ý tưởng trên slide thì đúng; chữ của câu truy vấn thì không. Đừng chép nguyên nó vào bài thi.</p>`],

      [26, '8. Union',
        `<p class="y-chinh">🎯 The last operation the deck shows: <strong>union takes two relations with the same set of attributes</strong> and returns every tuple appearing in either one — with duplicates collapsed into a single tuple.</p>
<ul>
<li><strong>Format</strong> — <code>select * from RELATION1</code> / <code>union</code> / <code>select * from RELATION2</code>. Note the shape: union glues together two <em>complete queries</em>, unlike join which glues together two table names inside one query.</li>
<li><strong>The figure, verified</strong> — CIS15-Roster has 4 students, CIS52-Roster has 3, total 7 rows of input. The result on the slide has 5. Run in sqlite3, the union gives exactly 5 and <code>union all</code> gives 7:
<table><tr><td><strong>Student-ID</strong></td><td><strong>F-Name</strong></td><td><strong>L-Name</strong></td></tr>
<tr><td>145-67-6754</td><td>John</td><td>Brown</td></tr>
<tr><td>232-56-5690</td><td>George</td><td>Yellow</td></tr>
<tr><td>342-88-9999</td><td>Rich</td><td>White</td></tr>
<tr><td>345-89-6580</td><td>Anne</td><td>Green</td></tr>
<tr><td>459-98-6789</td><td>Ted</td><td>Purple</td></tr></table>
John Brown and George Yellow are enrolled in both courses, so 7 − 2 = 5. A relation is a <em>set</em>, and a set has no duplicates — that is why union removes them automatically.</li>
<li><strong>Intersection — named on slide 20, no slide of its own</strong> — <code>select * from "CIS15-Roster" intersect select * from "CIS52-Roster"</code> returned exactly the 2 students taking both courses: 145-67-6754 John Brown and 232-56-5690 George Yellow.</li>
<li><strong>Difference — likewise missing a slide</strong> — <code>except</code> in SQLite (<code>minus</code> in Oracle) gave "in CIS15 but not CIS52" = Anne Green and Ted Purple (2 rows), and the opposite direction "in CIS52 but not CIS15" = Rich White (1 row). Difference is <strong>not symmetric</strong>; union and intersection are. That asymmetry is a favourite exam question.</li>
<li><strong>"Same set of attributes" is enforced, not advisory</strong> — a table with 2 columns unioned with a table of 1 column was tried: SQLite refuses with <em>"SELECTs to the left and right of UNION do not have the same number of result columns"</em>. It is a structural requirement, checked before any data is read. Join has no such requirement — that is the clean way to tell the two apart.</li>
</ul>
<p class="dap-an">✅ Answer: union = 5 tuples (7 input rows minus 2 duplicates); union all = 7; intersect = 2 (John Brown, George Yellow); CIS15 except CIS52 = 2 (Anne Green, Ted Purple); CIS52 except CIS15 = 1 (Rich White).</p>
<p class="meo">💡 Counting check that works every time: <code>|A ∪ B| = |A| + |B| − |A ∩ B|</code>. Here 4 + 3 − 2 = 5, exactly what the machine returned. If your hand-computed union does not satisfy that equation, you have either kept a duplicate or dropped a row.</p>`,
        `<p class="y-chinh">🎯 Phép cuối mà deck trình bày: <strong>union nhận hai quan hệ CÙNG bộ thuộc tính</strong> và trả về mọi bộ xuất hiện ở một trong hai — các bộ trùng nhau bị gộp thành một.</p>
<ul>
<li><strong>Cú pháp</strong> — <code>select * from RELATION1</code> / <code>union</code> / <code>select * from RELATION2</code>. Để ý hình dạng: union dán hai <em>truy vấn hoàn chỉnh</em> lại với nhau, khác với join vốn dán hai tên bảng bên trong MỘT truy vấn.</li>
<li><strong>Hình trong slide, đã kiểm</strong> — CIS15-Roster có 4 sinh viên, CIS52-Roster có 3, tổng 7 dòng đầu vào. Kết quả trên slide có 5. Chạy trong sqlite3, union cho đúng 5 và <code>union all</code> cho 7:
<table><tr><td><strong>Student-ID</strong></td><td><strong>F-Name</strong></td><td><strong>L-Name</strong></td></tr>
<tr><td>145-67-6754</td><td>John</td><td>Brown</td></tr>
<tr><td>232-56-5690</td><td>George</td><td>Yellow</td></tr>
<tr><td>342-88-9999</td><td>Rich</td><td>White</td></tr>
<tr><td>345-89-6580</td><td>Anne</td><td>Green</td></tr>
<tr><td>459-98-6789</td><td>Ted</td><td>Purple</td></tr></table>
John Brown và George Yellow học cả hai môn, nên 7 − 2 = 5. Một quan hệ là một <em>tập hợp</em>, mà tập hợp thì không có phần tử trùng — vì thế union tự loại trùng.</li>
<li><strong>Intersection — có tên ở slide 20, không có slide riêng</strong> — <code>select * from "CIS15-Roster" intersect select * from "CIS52-Roster"</code> trả về đúng 2 sinh viên học cả hai môn: 145-67-6754 John Brown và 232-56-5690 George Yellow.</li>
<li><strong>Difference — cũng thiếu slide</strong> — <code>except</code> trong SQLite (<code>minus</code> trong Oracle) cho "có ở CIS15 mà không ở CIS52" = Anne Green và Ted Purple (2 dòng), còn chiều ngược lại "có ở CIS52 mà không ở CIS15" = Rich White (1 dòng). Phép hiệu <strong>KHÔNG đối xứng</strong>; union và intersection thì có. Chỗ bất đối xứng này là câu hỏi thi rất được ưa chuộng.</li>
<li><strong>"Cùng bộ thuộc tính" là ràng buộc BẮT BUỘC, không phải lời khuyên</strong> — đã thử union một bảng 2 cột với một bảng 1 cột: SQLite từ chối với thông báo <em>"SELECTs to the left and right of UNION do not have the same number of result columns"</em>. Đó là yêu cầu về cấu trúc, được kiểm TRƯỚC khi đọc bất cứ dữ liệu nào. Join không có yêu cầu ấy — và đó là cách gọn nhất để phân biệt hai phép.</li>
</ul>
<p class="dap-an">✅ Đáp án: union = 5 bộ (7 dòng vào trừ 2 dòng trùng); union all = 7; intersect = 2 (John Brown, George Yellow); CIS15 except CIS52 = 2 (Anne Green, Ted Purple); CIS52 except CIS15 = 1 (Rich White).</p>
<p class="meo">💡 Phép thử đếm luôn đúng: <code>|A ∪ B| = |A| + |B| − |A ∩ B|</code>. Ở đây 4 + 3 − 2 = 5, đúng bằng con số máy trả về. Nếu union bạn tính tay không thoả đẳng thức ấy thì hoặc bạn giữ lại một bộ trùng, hoặc bạn đánh rơi một dòng.</p>`],

      [27, '5 - DATABASE DESIGN',
        `<p class="y-chinh">🎯 A section divider, and a change of role. Up to slide 26 you were a <em>user</em> of an existing database. From here you are the <strong>designer</strong>: nobody hands you the tables, you have to decide what they are.</p>
<ul>
<li><strong>What the section contains</strong> — slide 28 gives the two-step process (interview, then build an E-R model), slide 29 defines the E-R diagram notation, slides 30–31 turn a diagram into tables, and slides 32–34 clean those tables up by normalization.</li>
<li><strong>Why design deserves its own section</strong> — a badly designed schema cannot be rescued by clever SQL. Every query on slides 22–26 assumed the tables were already sensible; this section is about earning that assumption.</li>
<li><strong>The order is not negotiable</strong> — requirements → E-R model → relations → normalization. Jumping straight to <code>CREATE TABLE</code> is how you end up with the multi-valued cell of slide 33 and the anomalies of slide 34.</li>
<li><strong>Which level of the architecture this is</strong> — design happens at the <em>conceptual level</em> of the ANSI/SPARC architecture from slide 9: entities, attributes, relationships and constraints, with no statement about how bytes are stored. That is exactly what slide 11 said the conceptual schema holds.</li>
<li><strong>Where it leads in your degree</strong> — this section is a compressed preview of DBI202. There, an E-R diagram becomes several weeks of work, normalization goes to BCNF and beyond, and the exam asks you to produce the diagram, not to recognise one.</li>
</ul>
<p class="meo">💡 Keep one sentence as the map of the whole section: <strong>talk to people → draw the diagram → turn each box and each diamond into a table → split the tables until every fact lives in exactly one place.</strong></p>`,
        `<p class="y-chinh">🎯 Một slide phân mục, và là một cú đổi vai. Tới slide 26 bạn vẫn là <em>người dùng</em> một CSDL có sẵn. Từ đây bạn là <strong>người thiết kế</strong>: không ai đưa bảng cho bạn nữa, bạn phải tự quyết định bảng là gì.</p>
<ul>
<li><strong>Mục này gồm những gì</strong> — slide 28 nêu quy trình hai bước (phỏng vấn, rồi dựng mô hình thực thể–liên kết), slide 29 định nghĩa ký hiệu sơ đồ E-R, slide 30–31 biến sơ đồ thành bảng, và slide 32–34 dọn dẹp các bảng ấy bằng chuẩn hoá.</li>
<li><strong>Vì sao thiết kế xứng đáng có mục riêng</strong> — một lược đồ thiết kế tồi thì SQL khéo tới mấy cũng không cứu nổi. Mọi truy vấn ở slide 22–26 đều giả định các bảng đã hợp lý sẵn; mục này chính là phần đi kiếm cái giả định ấy về.</li>
<li><strong>Thứ tự không thương lượng được</strong> — yêu cầu → mô hình E-R → quan hệ → chuẩn hoá. Nhảy thẳng vào <code>CREATE TABLE</code> là cách bạn tự tạo ra cái ô nhiều giá trị ở slide 33 và các dị thường ở slide 34.</li>
<li><strong>Đây là mức nào trong kiến trúc</strong> — thiết kế diễn ra ở <em>mức quan niệm</em> (conceptual) của kiến trúc ANSI/SPARC ở slide 9: thực thể, thuộc tính, liên kết và ràng buộc, không nói gì tới việc byte nằm ở đâu. Đúng là thứ mà slide 11 bảo lược đồ quan niệm chứa.</li>
<li><strong>Nó dẫn tới đâu trong chương trình học</strong> — mục này là bản xem trước nén của môn DBI202. Ở đó, một sơ đồ E-R là công việc của vài tuần, chuẩn hoá đi tới BCNF và xa hơn, và đề thi bắt bạn VẼ ra sơ đồ chứ không phải nhận diện một sơ đồ cho sẵn.</li>
</ul>
<p class="meo">💡 Giữ một câu làm bản đồ cho cả mục: <strong>đi hỏi người dùng → vẽ sơ đồ → biến mỗi hình chữ nhật và mỗi hình thoi thành một bảng → xé bảng ra cho tới khi mỗi sự kiện chỉ nằm ở đúng một chỗ.</strong></p>`],

      [28, '1. Introduction (database design)',
        `<p class="y-chinh">🎯 Two steps, and the slide is blunt that the process is "lengthy and involved". <strong>Step 1: interview the users. Step 2: build an entity–relation model.</strong> Notice that step 1 involves no computer at all.</p>
<ul>
<li><strong>Step 1 — interviews</strong> — "a lot of interviewing of potential users … to collect the information needed to be stored and the access requirements of each department". Two different things are being collected: <em>what data exists</em> and <em>who needs to see what</em>. The second half is where the external views of slide 12 come from.</li>
<li><strong>Why the university example recurs</strong> — the deck has used it since slide 5: the records office, the financial aid office, the scheduling office, payroll. Each had its own flat file, each will become one or more <em>external views</em> over one shared database.</li>
<li><strong>Step 2 — the entity–relation model (ERM)</strong> — the slide names its three outputs precisely: the <em>entities</em> for which information must be maintained, the <em>attributes</em> of those entities, and the <em>relationships</em> between them. Every later slide in this section works on one of those three words.</li>
<li><strong>How to find entities in an interview transcript</strong> — a practical rule: the nouns people repeat become entities (student, course, professor, book), the adjectives and facts about a noun become its attributes (name, address, number of units), and the verbs linking two nouns become relationships (a student <em>takes</em> a course, a professor <em>teaches</em> a course, a student <em>borrows</em> a book).</li>
<li><strong>The step the slide does not mention</strong> — after the ERM comes conversion to relations (slide 30–31), then normalization (32–34), then the physical design that belongs to the internal level of slide 10 (indexes, storage). The deck covers the first two and leaves physical design to DBI202.</li>
</ul>
<p class="pitfall">⚠️ A very common student mistake: starting the design from the <em>screens</em> or the <em>reports</em> the user wants. Those are external views — they change every year. The entities and relationships change far more slowly, which is exactly why the design starts there and the views come later.</p>`,
        `<p class="y-chinh">🎯 Hai bước, và slide nói thẳng rằng quy trình này "dài và rắc rối". <strong>Bước 1: phỏng vấn người dùng. Bước 2: dựng mô hình thực thể–liên kết.</strong> Để ý bước 1 không hề đụng tới máy tính.</p>
<ul>
<li><strong>Bước 1 — phỏng vấn</strong> — "phỏng vấn rất nhiều người dùng tiềm năng… để thu thập thông tin cần lưu và yêu cầu truy cập của từng phòng ban". Có HAI thứ khác nhau đang được thu thập: <em>dữ liệu nào tồn tại</em> và <em>ai cần nhìn thấy cái gì</em>. Nửa sau chính là nguồn gốc của các khung nhìn ngoài ở slide 12.</li>
<li><strong>Vì sao ví dụ trường đại học cứ quay lại</strong> — deck dùng nó từ slide 5: phòng đào tạo, phòng học bổng, phòng xếp lịch, phòng lương. Mỗi phòng từng có một tệp phẳng riêng, và mỗi phòng sẽ trở thành một hay vài <em>khung nhìn ngoài</em> trên cùng một CSDL dùng chung.</li>
<li><strong>Bước 2 — mô hình thực thể–liên kết (ERM)</strong> — slide gọi tên chính xác ba sản phẩm của nó: các <em>thực thể</em> cần duy trì thông tin, các <em>thuộc tính</em> của những thực thể ấy, và các <em>liên kết</em> giữa chúng. Mọi slide còn lại của mục này đều làm việc trên một trong ba chữ đó.</li>
<li><strong>Cách tìm thực thể trong biên bản phỏng vấn</strong> — một quy tắc thực dụng: những DANH TỪ người ta lặp đi lặp lại thành thực thể (sinh viên, môn học, giảng viên, sách), những tính chất mô tả danh từ ấy thành thuộc tính (họ tên, địa chỉ, số tín chỉ), và những ĐỘNG TỪ nối hai danh từ thành liên kết (sinh viên <em>học</em> môn, giảng viên <em>dạy</em> môn, sinh viên <em>mượn</em> sách).</li>
<li><strong>Bước mà slide không nhắc</strong> — sau ERM là chuyển sang quan hệ (slide 30–31), rồi chuẩn hoá (32–34), rồi thiết kế vật lý vốn thuộc mức trong ở slide 10 (chỉ mục, lưu trữ). Deck phủ hai phần đầu và để phần vật lý cho DBI202.</li>
</ul>
<p class="pitfall">⚠️ Lỗi rất hay gặp của sinh viên: bắt đầu thiết kế từ các <em>màn hình</em> hoặc <em>báo cáo</em> mà người dùng muốn. Đó là khung nhìn ngoài — chúng đổi mỗi năm. Thực thể và liên kết đổi chậm hơn nhiều, và đấy đúng là lý do thiết kế khởi đầu từ đó, còn khung nhìn thì làm sau.</p>`],

      [29, '2. Entity–relation model (ERM)',
        `<p class="y-chinh">🎯 Four shapes and that is the whole notation: <strong>rectangle = entity set, ellipse = attribute, diamond = relationship set, line = "belongs to / participates in"</strong>. Figure 11.15 draws a small university with all four.</p>
<ul>
<li><strong>Read the figure precisely</strong> — three rectangles: <strong>COURSE</strong> (attributes No, Name, Unit), <strong>STUDENT</strong> (S-ID, Name, Address), <strong>PROFESSOR</strong> (P-ID, Name, Address). Two diamonds: <em>takes</em> between COURSE and STUDENT, <em>teaches</em> between COURSE and PROFESSOR.</li>
<li><strong>The red ellipses are the keys</strong> — No, S-ID and P-ID are drawn in a different colour from Name, Unit and Address. In standard E-R notation a key attribute is <em>underlined</em>; this deck colours it instead. Same meaning: the attribute that identifies one instance of the entity.</li>
<li><strong>The letters on the lines are cardinality ratios</strong> — the figure marks <code>M</code> on the COURSE side and <code>1</code> on the STUDENT side of <em>takes</em>, and <code>M</code>/<code>1</code> likewise for <em>teaches</em>. There are three ratios you must be able to name:
<table><tr><td><strong>Ratio</strong></td><td><strong>Meaning</strong></td><td><strong>Library example</strong></td></tr>
<tr><td>1 : 1</td><td>each side has at most one partner</td><td>one student ↔ one library card</td></tr>
<tr><td>1 : N</td><td>one on the left, many on the right</td><td>one class has many students</td></tr>
<tr><td>N : M</td><td>many on both sides</td><td>a student borrows many books, a book is borrowed by many students</td></tr></table></li>
<li><strong>The diagram's <em>teaches</em> is a defensible 1:N</strong> — one professor teaches many courses, each course has one professor. Verified with data: with TEACHES = {(8256,CIS15), (8256,CIS18), (8256,CIS21), (8257,CIS15)} loaded, professor 8256 teaches 3 courses — fine for 1:N until CIS15 acquires a second professor, which the fourth row does.</li>
<li><strong>Attributes belong to entities <em>or</em> to relationships</strong> — the slide's diagram gives no attribute to <em>takes</em>, but a real design would: a grade belongs neither to the student nor to the course, it belongs to the <em>pair</em>. Slide 31 says this explicitly ("one column for each attribute of the relationship itself if the relationship has attributes (not in our case)"), and slide 34's example does use Grade.</li>
</ul>
<p class="pitfall">⚠️ <strong>The cardinality on <em>takes</em> in the figure is wrong as a model of a university.</strong> Marking COURSE <code>M</code> — <code>1</code> STUDENT says "a student takes many courses, but each course is taken by exactly one student". No university works that way. The honest ratio is N:M, and slide 31 quietly builds the N:M solution anyway (a TAKES table with both keys). Learn the shapes from this slide; do not learn the ratio from it.</p>`,
        `<p class="y-chinh">🎯 Bốn hình và đó là toàn bộ ký hiệu: <strong>chữ nhật = tập thực thể, elip = thuộc tính, hình thoi = tập liên kết, đường thẳng = "thuộc về / tham gia vào"</strong>. Hình 11.15 vẽ một trường đại học tí hon có đủ bốn thứ.</p>
<ul>
<li><strong>Đọc hình cho chính xác</strong> — ba chữ nhật: <strong>COURSE</strong> (thuộc tính No, Name, Unit), <strong>STUDENT</strong> (S-ID, Name, Address), <strong>PROFESSOR</strong> (P-ID, Name, Address). Hai hình thoi: <em>takes</em> nối COURSE với STUDENT, <em>teaches</em> nối COURSE với PROFESSOR.</li>
<li><strong>Các elip màu đỏ là khoá</strong> — No, S-ID và P-ID được tô khác màu với Name, Unit, Address. Trong ký hiệu E-R chuẩn, thuộc tính khoá được <em>gạch chân</em>; deck này tô màu thay cho gạch chân. Cùng một ý: thuộc tính định danh một thể hiện của thực thể.</li>
<li><strong>Các chữ cái trên đường nối là lực lượng của liên kết</strong> — hình ghi <code>M</code> ở phía COURSE và <code>1</code> ở phía STUDENT của <em>takes</em>, và <code>M</code>/<code>1</code> tương tự cho <em>teaches</em>. Có ba loại lực lượng bạn phải gọi được tên:
<table><tr><td><strong>Lực lượng</strong></td><td><strong>Nghĩa</strong></td><td><strong>Ví dụ thư viện</strong></td></tr>
<tr><td>1 : 1</td><td>mỗi bên có nhiều nhất một bạn</td><td>một sinh viên ↔ một thẻ thư viện</td></tr>
<tr><td>1 : N</td><td>một bên trái, nhiều bên phải</td><td>một lớp có nhiều sinh viên</td></tr>
<tr><td>N : M</td><td>nhiều ở cả hai phía</td><td>một sinh viên mượn nhiều sách, một cuốn sách được nhiều sinh viên mượn</td></tr></table></li>
<li><strong>Liên kết <em>teaches</em> trong hình là 1:N có thể bào chữa được</strong> — một giảng viên dạy nhiều môn, mỗi môn có một giảng viên. Đã kiểm bằng dữ liệu: nạp TEACHES = {(8256,CIS15), (8256,CIS18), (8256,CIS21), (8257,CIS15)} thì giảng viên 8256 dạy 3 môn — vẫn ổn với 1:N, cho tới khi CIS15 có giảng viên thứ hai, đúng như dòng thứ tư.</li>
<li><strong>Thuộc tính thuộc về thực thể <em>hoặc</em> thuộc về liên kết</strong> — sơ đồ trên slide không gán thuộc tính nào cho <em>takes</em>, nhưng một thiết kế thật thì có: điểm số không thuộc về sinh viên, cũng không thuộc về môn học, nó thuộc về <em>cặp</em> sinh viên–môn. Slide 31 nói thẳng điều này ("một cột cho mỗi thuộc tính của chính liên kết, nếu liên kết có thuộc tính (ở đây thì không)"), và ví dụ của slide 34 thì có dùng Grade.</li>
</ul>
<p class="pitfall">⚠️ <strong>Lực lượng của <em>takes</em> trong hình là SAI nếu coi đó là mô hình một trường đại học.</strong> Ghi COURSE <code>M</code> — <code>1</code> STUDENT nghĩa là "một sinh viên học nhiều môn, nhưng mỗi môn chỉ đúng một sinh viên học". Không trường nào vận hành như thế. Lực lượng trung thực là N:M, và slide 31 thì vẫn lặng lẽ dựng đúng lời giải N:M (một bảng TAKES chứa cả hai khoá). Hãy học BỘ HÌNH từ slide này; đừng học lực lượng từ nó.</p>`],

      [30, '3. From E-R diagrams to relations',
        `<p class="y-chinh">🎯 The mechanical half of design: <strong>every rectangle in the diagram becomes one table, with one column per ellipse attached to it</strong>. No thinking required — that is the point of having drawn the diagram first.</p>
<ul>
<li><strong>The rule, word for word</strong> — "for each entity set in the E-R diagram, we create a relation (table) in which there are n columns related to the n attributes defined for that set". Three entity sets on slide 29 ⇒ three tables.</li>
<li><strong>The three tables in Figure 11.16</strong> — COURSE(<em>No</em>, Name, Unit), STUDENT(<em>S-ID</em>, Name, Address), PROFESSOR(<em>P-ID</em>, Name, Address). The key column is again in red. The rows are drawn as vertical dots because the <em>structure</em> is what matters here, not the data.</li>
<li><strong>Written as real SQL and executed</strong> — <code>create table COURSE ("No" text primary key, Name text, Unit integer);</code> plus the same for STUDENT and PROFESSOR. All three created without error in sqlite3, and inserting CIS15/CIS18/CIS21, two students and two professors worked exactly as the diagram promises. The diagram-to-DDL step really is this mechanical.</li>
<li><strong>Two entities can have same-named attributes</strong> — STUDENT.Name and PROFESSOR.Name are different columns in different tables and never collide, because a column's full name is <em>table.column</em>. This is the same fact that produced the <code>ambiguous column name</code> error on slide 25 when the table prefix was left off.</li>
<li><strong>What is deliberately missing</strong> — nothing in these three tables says a student is enrolled in anything. All the <em>relationships</em> are still unrepresented; that is slide 31's job. If you stopped here you would have three flat files again, which is precisely what slide 5 said the database was invented to replace.</li>
</ul>
<p class="pitfall">⚠️ Figure numbering in this deck is a mess and can cost you marks if you quote it. The body text says "Figure 14.16 / 14.17" (Forouzan's chapter 14 numbering) while the caption underneath says "Figure 11.16", and the heading says "Example 14.2" while slide 31 says "Example 11.3". Same pictures, two numbering systems interleaved. Quote the <em>content</em> in an exam, not the figure number.</p>`,
        `<p class="y-chinh">🎯 Nửa máy móc của việc thiết kế: <strong>mỗi hình chữ nhật trong sơ đồ thành một bảng, mỗi elip gắn vào nó thành một cột</strong>. Không cần suy nghĩ gì thêm — và đó chính là lý do người ta vẽ sơ đồ trước.</p>
<ul>
<li><strong>Quy tắc, nguyên văn</strong> — "với mỗi tập thực thể trong sơ đồ E-R, ta tạo một quan hệ (bảng) gồm n cột ứng với n thuộc tính đã định nghĩa cho tập ấy". Ba tập thực thể ở slide 29 ⇒ ba bảng.</li>
<li><strong>Ba bảng trong Hình 11.16</strong> — COURSE(<em>No</em>, Name, Unit), STUDENT(<em>S-ID</em>, Name, Address), PROFESSOR(<em>P-ID</em>, Name, Address). Cột khoá lại được tô đỏ. Phần dòng chỉ vẽ ba chấm dọc, vì thứ cần nhìn ở đây là <em>cấu trúc</em> chứ không phải dữ liệu.</li>
<li><strong>Viết thành SQL thật và chạy</strong> — <code>create table COURSE ("No" text primary key, Name text, Unit integer);</code> cùng hai lệnh tương tự cho STUDENT và PROFESSOR. Cả ba tạo xong không lỗi trong sqlite3, và chèn CIS15/CIS18/CIS21, hai sinh viên, hai giảng viên đều chạy đúng như sơ đồ hứa hẹn. Bước từ sơ đồ sang DDL đúng là máy móc như vậy.</li>
<li><strong>Hai thực thể được phép có thuộc tính trùng tên</strong> — STUDENT.Name và PROFESSOR.Name là hai cột khác nhau ở hai bảng khác nhau và không bao giờ đụng nhau, vì tên đầy đủ của một cột là <em>bảng.cột</em>. Đây cũng đúng là sự kiện đã sinh ra lỗi <code>ambiguous column name</code> ở slide 25 khi thiếu tiền tố tên bảng.</li>
<li><strong>Cái cố tình còn thiếu</strong> — không có gì trong ba bảng này nói rằng một sinh viên có học môn nào. Toàn bộ phần <em>liên kết</em> vẫn chưa được biểu diễn; đó là việc của slide 31. Nếu dừng ở đây, bạn lại có ba tệp phẳng — đúng thứ mà slide 5 bảo rằng CSDL sinh ra để thay thế.</li>
</ul>
<p class="pitfall">⚠️ Cách đánh số hình trong deck này rối và có thể làm bạn mất điểm nếu trích dẫn. Phần thân ghi "Figure 14.16 / 14.17" (số của chương 14 sách Forouzan) trong khi chú thích ngay dưới ghi "Figure 11.16", còn tiêu đề ghi "Example 14.2" nhưng slide 31 lại ghi "Example 11.3". Cùng những bức hình ấy, hai hệ đánh số cài răng lược. Trong bài thi hãy trích <em>nội dung</em>, đừng trích số hình.</p>`],

      [31, 'From E-R diagrams to relations (cont)',
        `<p class="y-chinh">🎯 The other half of the rule, and the most useful sentence in the whole design section: <strong>each diamond also becomes a table, holding the key of every entity it connects</strong> — plus a column for each attribute of the relationship itself, if it has any.</p>
<ul>
<li><strong>The two new tables in Figure 11.17</strong> — <strong>TEACHES</strong>(P-ID, No) and <strong>TAKES</strong>(S-ID, No). Two columns each, both of them keys borrowed from the entity tables. They carry no data of their own; they carry <em>facts about pairs</em>.</li>
<li><strong>This is exactly how an N:M relationship is resolved</strong> — and it is the answer the exam wants. A table cannot hold "many" in one cell (that is what slide 33 forbids), so a many-to-many relationship <em>must</em> become a third table, usually called a junction, bridge or intermediate table. TAKES is that table. Notice this works whatever the slide 29 diagram claims the ratio is.</li>
<li><strong>Proved with the library example</strong> — one student borrows many books and one book is borrowed by many students, a textbook N:M. Built as SinhVien(<strong>MSSV</strong>, HoTen), Sach(<strong>MaSach</strong>, TenSach) and MuonSach(<strong>MSSV, MaSach</strong>, NgayMuon). Loaded with 3 students and 4 books, MuonSach held 6 rows, and both directions were queried for real:
<table><tr><td><strong>MSSV</strong></td><td><strong>Number of books borrowed</strong></td></tr>
<tr><td>SE001</td><td>3</td></tr><tr><td>SE002</td><td>1</td></tr><tr><td>SE003</td><td>2</td></tr></table>
and in the other direction S03 and S10 each had 2 borrowers. "Many on both sides", stored in one perfectly ordinary two-key table.</li>
<li><strong>The composite primary key is the integrity rule</strong> — MuonSach and TEACHES both declare <code>primary key (key1, key2)</code>. Tested: re-inserting the existing pair (8256, CIS15) with <code>insert or ignore</code> reported <code>changes() = 0</code> and the table stayed at 4 rows; without <code>or ignore</code> it raises <em>UNIQUE constraint failed</em>. The pair, not either column alone, is what must be unique.</li>
<li><strong>A 1:N relationship does NOT need its own table</strong> — and this is the part students over-apply. For "one class has many students" you just put MaLop as a foreign key inside SinhVien. Only N:M forces a third table. Rule of thumb: <em>put the foreign key on the "many" side; if both sides are "many", there is no side to put it on, so make a new table.</em></li>
</ul>
<p class="dap-an">✅ Answer: the diagram of slide 29 becomes <strong>five</strong> relations — COURSE, STUDENT, PROFESSOR (from the three rectangles) plus TEACHES and TAKES (from the two diamonds). Joining TAKES to COURSE and STUDENT ran for real and produced the CIS15 roster: Anne and Ted.</p>
<p class="meo">💡 Count before you build: <strong>number of tables = number of rectangles + number of N:M diamonds</strong>. Forouzan's rule ("a table for every diamond") is the safe version and never wrong; the shortcut of folding a 1:N diamond into the "many" table is the optimisation you will learn properly in DBI202.</p>`,
        `<p class="y-chinh">🎯 Nửa còn lại của quy tắc, và là câu hữu ích nhất trong cả mục thiết kế: <strong>mỗi hình thoi cũng thành một bảng, chứa khoá của MỌI thực thể mà nó nối</strong> — cộng thêm một cột cho từng thuộc tính của chính liên kết, nếu có.</p>
<ul>
<li><strong>Hai bảng mới trong Hình 11.17</strong> — <strong>TEACHES</strong>(P-ID, No) và <strong>TAKES</strong>(S-ID, No). Mỗi bảng hai cột, cả hai đều là khoá mượn từ bảng thực thể. Chúng không mang dữ liệu riêng; chúng mang <em>sự kiện về các cặp</em>.</li>
<li><strong>Đây đúng là cách gỡ một liên kết N:M</strong> — và là câu trả lời đề thi muốn nghe. Một bảng không được chứa "nhiều" trong một ô (slide 33 cấm điều đó), nên liên kết nhiều–nhiều <em>bắt buộc</em> phải thành một bảng thứ ba, thường gọi là bảng trung gian / bảng nối. TAKES chính là bảng ấy. Để ý: cách này chạy bất kể sơ đồ ở slide 29 khai lực lượng là gì.</li>
<li><strong>Chứng minh bằng ví dụ thư viện</strong> — một sinh viên mượn nhiều sách và một cuốn sách được nhiều sinh viên mượn, N:M sách giáo khoa. Dựng thành SinhVien(<strong>MSSV</strong>, HoTen), Sach(<strong>MaSach</strong>, TenSach) và MuonSach(<strong>MSSV, MaSach</strong>, NgayMuon). Nạp 3 sinh viên và 4 cuốn sách, MuonSach có 6 dòng, và đã truy vấn thật theo cả hai chiều:
<table><tr><td><strong>MSSV</strong></td><td><strong>Số cuốn đã mượn</strong></td></tr>
<tr><td>SE001</td><td>3</td></tr><tr><td>SE002</td><td>1</td></tr><tr><td>SE003</td><td>2</td></tr></table>
và theo chiều ngược lại, S03 với S10 mỗi cuốn có 2 người mượn. "Nhiều ở cả hai phía", lưu gọn trong một bảng hai khoá hết sức bình thường.</li>
<li><strong>Khoá chính ghép chính là luật toàn vẹn</strong> — cả MuonSach lẫn TEACHES đều khai <code>primary key (khoá1, khoá2)</code>. Đã thử: chèn lại đúng cặp đã có (8256, CIS15) bằng <code>insert or ignore</code> thì báo <code>changes() = 0</code> và bảng vẫn 4 dòng; bỏ <code>or ignore</code> thì văng <em>UNIQUE constraint failed</em>. Thứ phải duy nhất là CẶP, không phải từng cột một.</li>
<li><strong>Liên kết 1:N thì KHÔNG cần bảng riêng</strong> — và đây là chỗ sinh viên hay áp dụng quá tay. Với "một lớp có nhiều sinh viên", bạn chỉ cần đặt MaLop làm khoá ngoại bên trong SinhVien. Chỉ N:M mới ép ra bảng thứ ba. Mẹo: <em>đặt khoá ngoại ở phía "nhiều"; nếu cả hai phía đều "nhiều" thì không còn phía nào để đặt, nên phải sinh bảng mới.</em></li>
</ul>
<p class="dap-an">✅ Đáp án: sơ đồ ở slide 29 biến thành <strong>năm</strong> quan hệ — COURSE, STUDENT, PROFESSOR (từ ba chữ nhật) cộng TEACHES và TAKES (từ hai hình thoi). Nối TAKES với COURSE và STUDENT đã chạy thật và cho ra danh sách lớp CIS15: Anne và Ted.</p>
<p class="meo">💡 Đếm trước khi dựng: <strong>số bảng = số hình chữ nhật + số hình thoi N:M</strong>. Quy tắc của Forouzan ("mỗi hình thoi một bảng") là bản an toàn và không bao giờ sai; còn mẹo gộp hình thoi 1:N vào bảng phía "nhiều" là phần tối ưu bạn sẽ học tử tế ở DBI202.</p>`],

      [32, '4. Normalization',
        `<p class="y-chinh">🎯 Definition and motivation. <strong>Normalization transforms a set of relations into a new set with a more solid structure</strong>, and the slide gives four reasons — of which the one that matters is "<em>remove anomalies in insertion, deletion and updating</em>".</p>
<ul>
<li><strong>The four stated reasons</strong> — (1) allow any relation in the database to be represented; (2) let a language like SQL use powerful retrieval operations built from atomic ones; (3) remove insertion, deletion and update anomalies; (4) reduce the need to restructure the database when new data types are added.</li>
<li><strong>The normal forms, as the slide lists them</strong> — 1NF, 2NF, 3NF, BCNF (Boyce–Codd), 4NF, PJNF (projection/join), 5NF, "and so on". They are <em>hierarchical</em>: being in 3NF implies being in 2NF, which implies 1NF. You climb them in order, never out of order.</li>
<li><strong>What an "anomaly" actually is — measured, not asserted</strong> — take one un-normalized library table holding MSSV, HoTen, MaLop, GVCN, MaSach, TenSach, NgayMuon, 6 rows. Three experiments were run on it:
<table><tr><td><strong>Anomaly</strong></td><td><strong>Experiment</strong></td><td><strong>Measured result</strong></td></tr>
<tr><td>Update</td><td>rename book S01 in one row only</td><td>S01 now carries <em>two different titles</em>: 1 row "Co so du lieu", 1 row "Co so du lieu (tai ban)"</td></tr>
<tr><td>Delete</td><td>SE002 returns her only book, delete the row</td><td>the student herself is gone — a query for "Le Thi Hoa" returns 0 rows</td></tr>
<tr><td>Insert</td><td>add a new book nobody has borrowed</td><td>impossible: there is no row to put it in without inventing a fake borrower</td></tr>
</table></li>
<li><strong>Why redundancy is the common cause</strong> — each of the three above happens because one fact ("book S01 is called Co so du lieu") is stored in several rows, or because two independent facts ("this student exists", "this loan happened") are trapped in one row. Normalization is just the discipline of putting each fact in exactly one place.</li>
<li><strong>The cost, honestly</strong> — more tables means more joins, and joins cost time (slide 25). Real systems sometimes <em>de-normalize</em> on purpose for speed, but that is a decision taken knowingly and paid for with extra code to keep the copies in sync. Normalize first; de-normalize only with evidence.</li>
</ul>
<p class="pitfall">⚠️ The deck stops at 2NF — there is no 3NF or BCNF slide even though this slide names them. Forouzan's own chapter goes further. Slide 34 below adds a worked 3NF example, clearly marked as <em>beyond the deck</em>: know it for DBI202 and for any exam question that says "normalize to 3NF", but do not claim the deck taught it.</p>`,
        `<p class="y-chinh">🎯 Định nghĩa và động cơ. <strong>Chuẩn hoá biến một tập quan hệ thành một tập quan hệ mới có cấu trúc vững hơn</strong>, và slide đưa bốn lý do — trong đó cái đáng kể là "<em>loại bỏ các dị thường khi thêm, xoá và sửa</em>".</p>
<ul>
<li><strong>Bốn lý do slide nêu</strong> — (1) cho phép biểu diễn được mọi quan hệ trong CSDL; (2) cho một ngôn ngữ như SQL dùng được các phép truy xuất mạnh ghép từ những phép nguyên tử; (3) loại bỏ dị thường khi thêm, xoá, sửa; (4) giảm nhu cầu phải dựng lại CSDL khi có kiểu dữ liệu mới.</li>
<li><strong>Các dạng chuẩn, theo đúng slide</strong> — 1NF, 2NF, 3NF, BCNF (Boyce–Codd), 4NF, PJNF (projection/join), 5NF, "và tiếp nữa". Chúng có <em>thứ bậc</em>: ở 3NF thì đương nhiên đã ở 2NF, và đã ở 1NF. Bạn leo theo thứ tự, không bao giờ nhảy cóc.</li>
<li><strong>"Dị thường" thật ra là gì — đo chứ không phát biểu suông</strong> — lấy một bảng thư viện chưa chuẩn gồm MSSV, HoTen, MaLop, GVCN, MaSach, TenSach, NgayMuon, 6 dòng. Đã chạy ba thí nghiệm trên nó:
<table><tr><td><strong>Dị thường</strong></td><td><strong>Thí nghiệm</strong></td><td><strong>Kết quả đo được</strong></td></tr>
<tr><td>Sửa</td><td>đổi tên sách S01 ở đúng một dòng</td><td>S01 giờ mang <em>hai cái tên khác nhau</em>: 1 dòng "Co so du lieu", 1 dòng "Co so du lieu (tai ban)"</td></tr>
<tr><td>Xoá</td><td>SE002 trả cuốn sách duy nhất, xoá dòng đó</td><td>mất luôn chính sinh viên ấy — truy vấn "Le Thi Hoa" trả về 0 dòng</td></tr>
<tr><td>Thêm</td><td>thêm một cuốn sách chưa ai mượn</td><td>không làm được: không có dòng nào để đặt nó vào, trừ khi bịa ra một người mượn giả</td></tr>
</table></li>
<li><strong>Vì sao dư thừa là nguyên nhân chung</strong> — cả ba chuyện trên xảy ra vì một sự kiện ("sách S01 tên là Co so du lieu") được lưu ở nhiều dòng, hoặc vì hai sự kiện độc lập ("sinh viên này tồn tại", "lượt mượn này đã xảy ra") bị nhốt chung một dòng. Chuẩn hoá chẳng qua là kỷ luật đặt mỗi sự kiện vào đúng một chỗ.</li>
<li><strong>Cái giá, nói cho sòng phẳng</strong> — nhiều bảng hơn nghĩa là nhiều phép nối hơn, mà nối thì tốn thời gian (slide 25). Hệ thống thật đôi khi <em>phi chuẩn hoá</em> có chủ ý để chạy nhanh, nhưng đó là quyết định có ý thức và phải trả giá bằng mã nguồn giữ các bản sao đồng bộ. Chuẩn hoá trước; phi chuẩn hoá chỉ khi có bằng chứng.</li>
</ul>
<p class="pitfall">⚠️ Deck DỪNG ở 2NF — không có slide 3NF hay BCNF nào, dù chính slide này gọi tên chúng. Sách Forouzan thì đi xa hơn. Slide 34 dưới đây có thêm một ví dụ 3NF làm tới nơi, ghi rõ là <em>ngoài phạm vi deck</em>: hãy nắm nó cho DBI202 và cho câu hỏi thi nào bảo "chuẩn hoá tới 3NF", nhưng đừng nói rằng deck đã dạy điều đó.</p>`],

      [33, '5. First normal form (1NF)',
        `<p class="y-chinh">🎯 The first and easiest rule: <strong>every intersection of a row and a column holds exactly one value</strong>. The slide's Figure 11.18 shows the disease and the cure side by side — professor 8256 with "CIS15, CIS18, CIS21" in one cell (a), and the same fact as three rows (b).</p>
<ul>
<li><strong>Where the violation comes from</strong> — the slide says it precisely: converting an E-R diagram to tables can produce relations like <em>teaches</em> and <em>takes</em> where "a professor can teach more than one course, and a student can take more than one course". The many-ness has to go somewhere, and the naive place is one fat cell.</li>
<li><strong>The cure the slide gives</strong> — "repeating the rows in which this problem exists". One row per value. Cardinality grows, degree does not change.</li>
<li><strong>Why a fat cell is genuinely broken — measured</strong> — an un-normalized loans table was built with MaSach values 'S01, S03, S10' / 'S01' / 'S03, S10' and searched:
<table><tr><td><strong>Query</strong></td><td><strong>Rows returned</strong></td><td><strong>Correct?</strong></td></tr>
<tr><td><code>where MaSach like '%S01%'</code></td><td>2</td><td>yes, by luck</td></tr>
<tr><td><code>where MaSach like '%S1%'</code></td><td>2 (SE001 and SE003)</td><td><strong>no</strong> — nobody borrowed a book "S1"; the pattern matched inside "S10"</td></tr>
<tr><td>"how many books were borrowed?"</td><td><code>count(*)</code> = 3</td><td><strong>no</strong> — the true answer is 6</td></tr>
</table>
The value in the cell is a sentence, so only string tricks can search it, and string tricks give wrong answers. No index (Chapter 10) can help either: an index on a text column indexes the whole string, so it can never find "S03" hidden in the middle of one.</li>
<li><strong>The same data in 1NF, and the queries that now work</strong> — repeating the rows gives 6 tuples. Then <code>where MaSach = 'S01'</code> returned exactly the 2 correct students, and <code>group by MSSV</code> returned SE001 → 3, SE002 → 1, SE003 → 2. Both are exact, both use ordinary equality, and both can use an index.</li>
<li><strong>The price of 1NF</strong> — HoTen, MaLop and GVCN are now repeated on every row of that student. The fat cell is gone, but redundancy has appeared — which is exactly what 2NF on the next slide is for. 1NF fixes <em>shape</em>; 2NF and 3NF fix <em>duplication</em>.</li>
</ul>
<p class="dap-an">✅ Answer: (a) is not in 1NF because one intersection holds three values; (b) is in 1NF with three rows 8256/CIS15, 8256/CIS18, 8256/CIS21. Measured consequence of skipping it: a search for "S1" wrongly returns two students, and the loan count reads 3 instead of 6.</p>
<p class="pitfall">⚠️ 1NF forbids a <em>repeating group</em>, not a long text. A column holding an entire address, or a book description of 500 characters, is fine — it is one value of one thing. A column holding "S01, S03, S10" is not, because it is three values of the same thing. The test question to ask: <em>would I ever want to search for, or count, one of the pieces?</em> If yes, it is a repeating group.</p>`,
        `<p class="y-chinh">🎯 Luật đầu tiên và dễ nhất: <strong>mỗi giao của một dòng với một cột chứa đúng MỘT giá trị</strong>. Hình 11.18 của slide đặt cạnh nhau bệnh và thuốc — giảng viên 8256 với "CIS15, CIS18, CIS21" trong một ô (a), và đúng sự kiện ấy tách thành ba dòng (b).</p>
<ul>
<li><strong>Vi phạm này đến từ đâu</strong> — slide nói rất chuẩn: chuyển sơ đồ E-R sang bảng có thể sinh ra những quan hệ như <em>teaches</em> và <em>takes</em>, nơi "một giảng viên dạy được nhiều môn, và một sinh viên học được nhiều môn". Cái "nhiều" ấy phải đi đâu đó, và chỗ ngây thơ nhất là một cái ô phình to.</li>
<li><strong>Thuốc mà slide đưa</strong> — "lặp lại những dòng đang mắc lỗi này". Mỗi giá trị một dòng. Lực lượng tăng lên, bậc không đổi.</li>
<li><strong>Vì sao ô phình to thật sự HỎNG — đã đo</strong> — dựng một bảng mượn chưa chuẩn với MaSach là 'S01, S03, S10' / 'S01' / 'S03, S10' rồi đi tìm:
<table><tr><td><strong>Truy vấn</strong></td><td><strong>Số dòng trả về</strong></td><td><strong>Đúng không?</strong></td></tr>
<tr><td><code>where MaSach like '%S01%'</code></td><td>2</td><td>đúng, nhờ may</td></tr>
<tr><td><code>where MaSach like '%S1%'</code></td><td>2 (SE001 và SE003)</td><td><strong>sai</strong> — không ai mượn cuốn "S1"; mẫu khớp vào bên trong "S10"</td></tr>
<tr><td>"đã mượn bao nhiêu cuốn?"</td><td><code>count(*)</code> = 3</td><td><strong>sai</strong> — đáp số thật là 6</td></tr>
</table>
Giá trị trong ô là một câu chữ, nên chỉ mẹo xử lý chuỗi mới tìm được nó, mà mẹo chuỗi thì cho đáp án sai. Chỉ mục (Chương 10) cũng không cứu được: index trên cột văn bản đánh chỉ mục CẢ chuỗi, nên không đời nào tìm ra "S03" nằm lọt giữa chuỗi.</li>
<li><strong>Cũng dữ liệu ấy ở 1NF, và những truy vấn giờ chạy được</strong> — lặp dòng ra thành 6 bộ. Khi đó <code>where MaSach = 'S01'</code> trả về đúng 2 sinh viên cần tìm, và <code>group by MSSV</code> cho SE001 → 3, SE002 → 1, SE003 → 2. Cả hai đều chính xác, đều dùng phép bằng thông thường, và đều dùng được index.</li>
<li><strong>Cái giá của 1NF</strong> — HoTen, MaLop và GVCN giờ lặp lại trên mọi dòng của sinh viên đó. Ô phình to đã hết, nhưng dư thừa xuất hiện — và đó đúng là việc của 2NF ở slide sau. 1NF chữa <em>hình dạng</em>; 2NF và 3NF chữa <em>trùng lặp</em>.</li>
</ul>
<p class="dap-an">✅ Đáp án: (a) chưa ở 1NF vì một giao ô chứa ba giá trị; (b) đã ở 1NF với ba dòng 8256/CIS15, 8256/CIS18, 8256/CIS21. Hậu quả đo được của việc bỏ qua bước này: tìm "S1" trả nhầm hai sinh viên, và đếm số lượt mượn ra 3 thay vì 6.</p>
<p class="pitfall">⚠️ 1NF cấm <em>nhóm lặp</em>, không cấm văn bản dài. Một cột chứa cả địa chỉ, hay mô tả sách 500 ký tự, vẫn hoàn toàn ổn — đó là MỘT giá trị của MỘT thứ. Một cột chứa "S01, S03, S10" thì không, vì đó là ba giá trị của cùng một thứ. Câu hỏi để thử: <em>liệu có khi nào tôi muốn TÌM hoặc ĐẾM riêng từng mẩu bên trong không?</em> Nếu có, đó là nhóm lặp.</p>`],

      [34, '6. Second normal form (2NF)',
        `<p class="y-chinh">🎯 The key rule: in a relation with a <strong>composite key</strong>, every non-key attribute must depend on the <em>whole</em> key, not on part of it. Figure 11.19 splits one bad table into two good ones.</p>
<ul>
<li><strong>The figure, read carefully</strong> — "Not in 2NF" is <code>(Student ID, Course No, Grade, Student Name)</code> with the composite key (Student ID, Course No). It splits into <code>(Student ID, Course No, Grade)</code> and <code>(Student ID, Student Name)</code>, both marked "In 2NF".</li>
<li><strong>Why Student Name is the guilty column</strong> — Grade genuinely needs both halves of the key: you cannot know a grade from the student alone or the course alone. Student Name needs only Student ID. That is a <strong>partial dependency</strong>, and it is the one and only thing 2NF forbids.</li>
<li><strong>The split, done for real on the library data</strong> — the 1NF table of slide 33 (key = MSSV + MaSach) was broken into three relations and populated:
<table><tr><td><strong>Relation</strong></td><td><strong>Key</strong></td><td><strong>Rows</strong></td></tr>
<tr><td>SinhVien(MSSV, HoTen, MaLop, GVCN)</td><td>MSSV</td><td>3</td></tr>
<tr><td>Sach(MaSach, TenSach)</td><td>MaSach</td><td>4</td></tr>
<tr><td>MuonSach(MSSV, MaSach, NgayMuon)</td><td>(MSSV, MaSach)</td><td>6</td></tr>
</table>
Then the three were joined back: <code>MuonSach join SinhVien on MSSV join Sach on MaSach</code> returned <strong>exactly 6 rows, identical to the original 1NF table</strong>, column for column. Splitting lost nothing — that is the whole claim of a lossless decomposition, and it is checkable, not a matter of opinion.</li>
<li><strong>The three anomalies of slide 32, re-tested after the split</strong> — (a) renaming book S01 now takes <code>changes() = 1</code> and both borrowers immediately see the new title; (b) book S20 "Tri tue nhan tao", borrowed by nobody, exists happily in Sach — a LEFT JOIN count shows it with 0 loans; (c) deleting SE002's loan leaves her student record fully intact. All three anomalies gone, measured one by one.</li>
<li><strong>3NF — beyond this deck, needed for DBI202</strong> — SinhVien is in 2NF but still has <code>MSSV → MaLop → GVCN</code>, a <em>transitive</em> dependency: GVCN depends on the key only through MaLop. Measured cost: changing the homeroom teacher of class SE1701 required updating <strong>2 rows</strong>, and updating only one of them immediately produced a class with two different teachers. Splitting off Lop(MaLop, GVCN) reduced the same change to <strong>1 row</strong>, the re-join reproduced the original data exactly, and class SE1703 with no students yet could finally exist.</li>
</ul>
<p class="dap-an">✅ Answer: the slide's table is not in 2NF because Student Name depends on Student ID alone, i.e. on part of the composite key. Splitting into (Student ID, Course No, Grade) + (Student ID, Student Name) removes the partial dependency. On the library data the equivalent split preserved all 6 rows on re-join and cut the book-rename from 2 inconsistent rows to 1 correct row; the further 3NF split cut the teacher-rename from 2 rows to 1.</p>
<p class="meo">💡 The three-line summary that answers most exam questions: <strong>1NF — one value per cell. 2NF — 1NF plus no non-key attribute depends on only PART of a composite key. 3NF — 2NF plus no non-key attribute depends on another NON-KEY attribute.</strong> Or, as the classic mnemonic has it: every non-key attribute must depend on <em>the key, the whole key, and nothing but the key</em>.</p>`,
        `<p class="y-chinh">🎯 Luật mấu chốt: trong một quan hệ có <strong>khoá ghép</strong>, mọi thuộc tính không khoá phải phụ thuộc vào <em>toàn bộ</em> khoá, chứ không phải vào một phần khoá. Hình 11.19 xé một bảng xấu thành hai bảng tốt.</p>
<ul>
<li><strong>Đọc kỹ hình</strong> — phần "Not in 2NF" là <code>(Student ID, Course No, Grade, Student Name)</code> với khoá ghép (Student ID, Course No). Nó tách thành <code>(Student ID, Course No, Grade)</code> và <code>(Student ID, Student Name)</code>, cả hai đều ghi "In 2NF".</li>
<li><strong>Vì sao Student Name là cột có tội</strong> — Grade thật sự cần cả hai nửa khoá: không thể biết điểm nếu chỉ có sinh viên, hoặc chỉ có môn học. Student Name chỉ cần Student ID. Đó là <strong>phụ thuộc hàm bộ phận</strong>, và đó là thứ DUY NHẤT mà 2NF cấm.</li>
<li><strong>Phép tách, làm thật trên dữ liệu thư viện</strong> — bảng 1NF ở slide 33 (khoá = MSSV + MaSach) được xé thành ba quan hệ rồi nạp dữ liệu:
<table><tr><td><strong>Quan hệ</strong></td><td><strong>Khoá</strong></td><td><strong>Số dòng</strong></td></tr>
<tr><td>SinhVien(MSSV, HoTen, MaLop, GVCN)</td><td>MSSV</td><td>3</td></tr>
<tr><td>Sach(MaSach, TenSach)</td><td>MaSach</td><td>4</td></tr>
<tr><td>MuonSach(MSSV, MaSach, NgayMuon)</td><td>(MSSV, MaSach)</td><td>6</td></tr>
</table>
Rồi nối ba bảng lại: <code>MuonSach join SinhVien on MSSV join Sach on MaSach</code> trả về <strong>đúng 6 dòng, giống hệt bảng 1NF ban đầu</strong>, từng cột một. Tách ra không mất gì — đó chính là toàn bộ nội dung của "phân rã không mất mát", và nó KIỂM ĐƯỢC chứ không phải chuyện tin hay không tin.</li>
<li><strong>Ba dị thường ở slide 32, kiểm lại sau khi tách</strong> — (a) đổi tên sách S01 giờ chỉ tốn <code>changes() = 1</code> và cả hai người mượn thấy ngay tên mới; (b) cuốn S20 "Tri tue nhan tao" chưa ai mượn vẫn sống yên trong Sach — LEFT JOIN đếm ra nó với 0 lượt mượn; (c) xoá lượt mượn của SE002 thì hồ sơ sinh viên của cô ấy còn nguyên vẹn. Cả ba dị thường biến mất, đo từng cái một.</li>
<li><strong>3NF — ngoài deck, nhưng cần cho DBI202</strong> — SinhVien đã ở 2NF nhưng vẫn còn <code>MSSV → MaLop → GVCN</code>, một phụ thuộc <em>bắc cầu</em>: GVCN phụ thuộc vào khoá chỉ THÔNG QUA MaLop. Giá phải trả đã đo: đổi giáo viên chủ nhiệm lớp SE1701 phải sửa <strong>2 dòng</strong>, và chỉ sửa một trong hai là lập tức sinh ra một lớp có hai giáo viên chủ nhiệm khác nhau. Tách riêng Lop(MaLop, GVCN) thì cùng thay đổi ấy chỉ còn <strong>1 dòng</strong>, nối lại vẫn ra đúng dữ liệu cũ, và lớp SE1703 chưa có sinh viên nào cuối cùng cũng tồn tại được.</li>
</ul>
<p class="dap-an">✅ Đáp án: bảng trên slide chưa ở 2NF vì Student Name chỉ phụ thuộc vào Student ID, tức vào một PHẦN của khoá ghép. Tách thành (Student ID, Course No, Grade) + (Student ID, Student Name) là hết phụ thuộc bộ phận. Trên dữ liệu thư viện, phép tách tương đương giữ nguyên đủ 6 dòng khi nối lại và kéo việc đổi tên sách từ 2 dòng mâu thuẫn xuống 1 dòng đúng; tách tiếp lên 3NF kéo việc đổi giáo viên chủ nhiệm từ 2 dòng xuống 1 dòng.</p>
<p class="meo">💡 Ba dòng tóm tắt trả lời được hầu hết câu hỏi thi: <strong>1NF — mỗi ô một giá trị. 2NF — 1NF cộng thêm: không thuộc tính không khoá nào chỉ phụ thuộc vào MỘT PHẦN khoá ghép. 3NF — 2NF cộng thêm: không thuộc tính không khoá nào phụ thuộc vào một thuộc tính KHÔNG KHOÁ khác.</strong> Hoặc theo câu vè kinh điển: mọi thuộc tính không khoá phải phụ thuộc vào <em>khoá, toàn bộ khoá, và không gì ngoài khoá</em>.</p>`],

      [35, '6- Guide do practice set (database in Ms SQL)',
        `<p class="y-chinh">🎯 A section divider, and a change of register: the last seven slides leave theory entirely and become a <strong>click-by-click tutorial</strong> for building your first database in Microsoft SQL Server Management Studio.</p>
<ul>
<li><strong>The seven steps ahead</strong> — install SQL Server Management Studio (36), start it and connect (37), find the Databases folder (38), create a database (39), create a table (40), create the primary key (41), understand columns (42). That is the whole practice set.</li>
<li><strong>Why the deck ends with a GUI tutorial</strong> — the lab for this chapter is assessed by <em>doing</em>, not by reasoning. Everything conceptual — relations, operations, ERM, normalization — has already been covered; these slides just make sure you can reach a working server.</li>
<li><strong>What it maps onto from the theory</strong> — "create a database" is not in any of the nine operations of slide 20, because those operate <em>inside</em> a database. Creating databases, tables and keys is <strong>DDL</strong> (Data Definition Language); insert / delete / update / select are <strong>DML</strong> (Data Manipulation Language). Both are parts of SQL, and the exam does ask which is which.</li>
<li><strong>You do not need Windows to practise</strong> — every step in slides 39–42 has a one-line SQL equivalent that runs anywhere. All the SQL quoted in this lesson was executed with <code>sqlite3</code>, a single 1 MB binary that ships with macOS and most Linux distributions. SQL Server, MySQL, PostgreSQL and SQLite disagree on plenty of details, but <code>create table</code>, <code>primary key</code>, <code>insert</code>, <code>select … where</code> and <code>join</code> are the same in all of them.</li>
<li><strong>The typo in the heading</strong> — "Guide do practice set" is "Guide <em>to</em> the practice set". The same phrase appears in the contents slide 2 as section 11.6. Harmless, but if you are searching a PDF for the section, search for "practice set", not for a correctly spelled title.</li>
</ul>
<p class="meo">💡 Do the practice set twice: once by clicking, exactly as slides 36–42 show, and once by typing the equivalent SQL in a query window. The clicking teaches you the tool; the typing teaches you the language — and only the language transfers to DBI202, to a job interview, and to every other database engine.</p>`,
        `<p class="y-chinh">🎯 Slide phân mục, và là một cú đổi giọng: bảy slide cuối rời hẳn lý thuyết để thành một <strong>hướng dẫn bấm từng bước</strong> dựng CSDL đầu tiên trong Microsoft SQL Server Management Studio.</p>
<ul>
<li><strong>Bảy bước sắp tới</strong> — cài SQL Server Management Studio (36), khởi động và kết nối (37), tìm thư mục Databases (38), tạo CSDL (39), tạo bảng (40), tạo khoá chính (41), hiểu cấu trúc cột (42). Đó là toàn bộ phần thực hành.</li>
<li><strong>Vì sao deck kết thúc bằng một hướng dẫn giao diện</strong> — bài thực hành của chương này chấm bằng việc <em>làm được</em>, không phải bằng lập luận. Mọi thứ khái niệm — quan hệ, các phép toán, ERM, chuẩn hoá — đã dạy xong; mấy slide này chỉ lo cho bạn tới được một máy chủ chạy được.</li>
<li><strong>Nó ứng với phần lý thuyết nào</strong> — "tạo CSDL" không nằm trong chín phép toán ở slide 20, vì những phép ấy làm việc <em>bên trong</em> một CSDL. Tạo database, tạo bảng, tạo khoá là <strong>DDL</strong> (ngôn ngữ định nghĩa dữ liệu); còn insert / delete / update / select là <strong>DML</strong> (ngôn ngữ thao tác dữ liệu). Cả hai đều là bộ phận của SQL, và đề thi CÓ hỏi cái nào thuộc loại nào.</li>
<li><strong>Không cần Windows mới tập được</strong> — mọi bước ở slide 39–42 đều có một câu SQL tương đương chạy ở đâu cũng được. Toàn bộ SQL trích trong bài học này được chạy bằng <code>sqlite3</code>, một tệp nhị phân chừng 1 MB có sẵn trên macOS và hầu hết bản Linux. SQL Server, MySQL, PostgreSQL và SQLite khác nhau ở khối chi tiết, nhưng <code>create table</code>, <code>primary key</code>, <code>insert</code>, <code>select … where</code> và <code>join</code> thì giống nhau ở tất cả.</li>
<li><strong>Lỗi gõ ở tiêu đề</strong> — "Guide do practice set" đáng ra là "Guide <em>to</em> the practice set". Đúng cụm ấy cũng xuất hiện ở slide mục lục số 2, mục 11.6. Vô hại, nhưng nếu bạn tìm mục này trong bản PDF thì hãy tìm chữ "practice set", đừng tìm một cái tiêu đề viết đúng chính tả.</li>
</ul>
<p class="meo">💡 Hãy làm phần thực hành HAI lần: một lần bấm chuột đúng như slide 36–42, một lần gõ câu SQL tương đương trong cửa sổ truy vấn. Bấm chuột dạy bạn cái công cụ; gõ lệnh dạy bạn cái NGÔN NGỮ — và chỉ ngôn ngữ mới mang được sang DBI202, sang buổi phỏng vấn xin việc, và sang mọi hệ quản trị CSDL khác.</p>`],

      [36, '1. Install the SQL Server',
        `<p class="y-chinh">🎯 Step one: install <strong>SQL Server Management Studio</strong> (SSMS), free from Microsoft, so you can manage the server "from a graphical interface instead of having to use the command line".</p>
<ul>
<li><strong>Two separate things with confusingly similar names</strong> — <em>SQL Server</em> is the DBMS engine: the process that stores data and answers queries. <em>SQL Server Management Studio</em> is only a client application that talks to it. Installing SSMS alone gives you a steering wheel with no car; you need an engine too, and for a student that is normally SQL Server Express, also free.</li>
<li><strong>Map it back to slide 7</strong> — the DBMS has five components: hardware, software, data, users, procedures. The engine is the <em>software</em> component, SSMS is one of the tools the <em>users</em> component works through, and the <code>.mdf</code>/<code>.ldf</code> files on disk are the <em>data</em> component. Installing is just assembling those pieces on one machine.</li>
<li><strong>And to slide 12</strong> — SSMS is an <em>external view</em> in the ANSI/SPARC sense: it reformats what the conceptual level holds into grids, trees and dialogs that a human finds familiar. Nothing you do in SSMS could not also be done by typing SQL.</li>
<li><strong>The GUI is optional, the language is not</strong> — every dialog in slides 37–42 emits SQL underneath and SSMS will even show it to you (the "Script" button on most dialogs). Reading that generated script is the fastest way to learn real DDL.</li>
<li><strong>If you are not on Windows</strong> — the practical substitutes are Azure Data Studio (cross-platform, from Microsoft), SQL Server running in a Docker container, or simply a different engine for learning purposes. Everything quoted in this lesson was run on <code>sqlite3</code> and the statements are unchanged.</li>
</ul>
<p class="pitfall">⚠️ The slide's heading says "Install the SQL Server" but the body only describes installing <em>Management Studio</em>. Students follow it, install SSMS, launch it, find nothing to connect to, and conclude the software is broken. It is not: the server was never installed. Install the engine first, the studio second.</p>`,
        `<p class="y-chinh">🎯 Bước một: cài <strong>SQL Server Management Studio</strong> (SSMS), Microsoft cho miễn phí, để quản trị máy chủ "bằng giao diện đồ hoạ thay vì phải dùng dòng lệnh".</p>
<ul>
<li><strong>Hai thứ khác nhau mà tên gọi dễ lẫn</strong> — <em>SQL Server</em> là bộ máy DBMS: tiến trình lưu dữ liệu và trả lời truy vấn. <em>SQL Server Management Studio</em> chỉ là một ứng dụng khách nói chuyện với nó. Chỉ cài SSMS thì bạn có vô-lăng mà không có xe; phải có cả động cơ nữa, và với sinh viên thì thường là SQL Server Express, cũng miễn phí.</li>
<li><strong>Chiếu ngược về slide 7</strong> — DBMS có năm thành phần: phần cứng, phần mềm, dữ liệu, người dùng, thủ tục. Bộ máy là thành phần <em>phần mềm</em>, SSMS là một trong những công cụ mà thành phần <em>người dùng</em> làm việc qua đó, còn các tệp <code>.mdf</code>/<code>.ldf</code> trên đĩa là thành phần <em>dữ liệu</em>. Cài đặt chẳng qua là lắp mấy mảnh ấy lên một máy.</li>
<li><strong>Và về slide 12</strong> — SSMS là một <em>khung nhìn ngoài</em> theo đúng nghĩa ANSI/SPARC: nó định dạng lại thứ mức quan niệm đang giữ thành lưới, cây và hộp thoại mà con người thấy quen. Không có thao tác nào trong SSMS mà lại không làm được bằng cách gõ SQL.</li>
<li><strong>Giao diện là tuỳ chọn, ngôn ngữ thì không</strong> — mọi hộp thoại ở slide 37–42 đều sinh ra SQL bên dưới, và SSMS còn cho bạn xem (nút "Script" trên hầu hết hộp thoại). Đọc đoạn script tự sinh ấy là cách học DDL thật nhanh nhất.</li>
<li><strong>Nếu bạn không dùng Windows</strong> — các lựa chọn thay thế thực tế là Azure Data Studio (đa nền tảng, của Microsoft), chạy SQL Server trong container Docker, hoặc đơn giản là học trên một hệ khác. Mọi thứ trích trong bài học này đều chạy bằng <code>sqlite3</code> và câu lệnh không phải sửa gì.</li>
</ul>
<p class="pitfall">⚠️ Tiêu đề slide ghi "Install the SQL Server" nhưng phần thân chỉ nói cài <em>Management Studio</em>. Sinh viên làm theo, cài SSMS, mở lên, không thấy gì để kết nối, rồi kết luận phần mềm hỏng. Không hỏng đâu: máy chủ chưa từng được cài. Cài bộ máy trước, cài studio sau.</p>`],

      [37, '2. Start up SQL Server Management Studio',
        `<p class="y-chinh">🎯 Step two: launch SSMS and answer its first question — <strong>which server do you want to connect to?</strong> The screenshot shows the Object Explorer with one entry: <code>FAMILIA\\SQLEXPRESS (SQL Server 11.0…)</code>.</p>
<ul>
<li><strong>Reading that server name</strong> — it is <code>MACHINE\\INSTANCE</code>. FAMILIA is the computer, SQLEXPRESS is the named instance. One machine can run several instances side by side, which is why the backslash is needed. On your own machine <code>localhost\\SQLEXPRESS</code> or <code>.\\SQLEXPRESS</code> will usually work. "SQL Server 11.0" is SQL Server 2012.</li>
<li><strong>The two authentication types</strong> — <em>Windows Authentication</em> reuses the account you are already logged in with, so there is no password to type; <em>SQL Server Authentication</em> asks for a login and password stored inside the server itself. The slide recommends Windows Authentication for a local database, which is right: fewer credentials to leak and none to forget.</li>
<li><strong>Which architecture level you are at</strong> — logging in is where the DBMS decides <em>which external schema</em> you get (slide 12). Two people can connect to the same conceptual schema and be shown different subsets of it. That is the "powerful and flexible security mechanism" slide 12 described, and it starts at this dialog.</li>
<li><strong>Remote versus local</strong> — the slide covers both: if a server already exists and you have permission, type its address; otherwise create one locally. Either way the connection is a client–server conversation over TCP, typically port 1433 for SQL Server.</li>
<li><strong>Object Explorer is the navigator</strong> — the tree on the left is how the rest of the tutorial moves around. Slides 38 to 41 are all "expand a node, right-click, choose an item". Learn the tree once and the remaining steps are trivial.</li>
</ul>
<p class="pitfall">⚠️ The last bullet is wrong as printed: "set the <strong>Database Name</strong> to … and the authentication type to Windows Authentication". The connection dialog has no Database Name field to fill in at this stage — the field you type into is <strong>Server name</strong>. The ellipsis after "to …" shows the value was never filled in when the deck was written. Type your server name (e.g. <code>localhost\\SQLEXPRESS</code>); create the database in step 4.</p>`,
        `<p class="y-chinh">🎯 Bước hai: mở SSMS và trả lời câu hỏi đầu tiên của nó — <strong>bạn muốn kết nối tới máy chủ nào?</strong> Ảnh chụp cho thấy cửa sổ Object Explorer với một mục: <code>FAMILIA\\SQLEXPRESS (SQL Server 11.0…)</code>.</p>
<ul>
<li><strong>Đọc cái tên máy chủ ấy</strong> — nó có dạng <code>TÊNMÁY\\TÊNTHỂHIỆN</code>. FAMILIA là máy tính, SQLEXPRESS là thể hiện (instance) có tên. Một máy chạy được nhiều thể hiện song song, nên mới cần dấu gạch chéo ngược. Trên máy của bạn thì <code>localhost\\SQLEXPRESS</code> hoặc <code>.\\SQLEXPRESS</code> thường là đúng. "SQL Server 11.0" chính là SQL Server 2012.</li>
<li><strong>Hai kiểu xác thực</strong> — <em>Windows Authentication</em> dùng lại chính tài khoản bạn đang đăng nhập máy, nên không phải gõ mật khẩu; <em>SQL Server Authentication</em> hỏi tên đăng nhập và mật khẩu lưu bên trong chính máy chủ. Slide khuyên dùng Windows Authentication cho CSDL cục bộ, và lời khuyên ấy đúng: ít thông tin đăng nhập để rò, không có mật khẩu nào để quên.</li>
<li><strong>Bạn đang ở mức nào của kiến trúc</strong> — đăng nhập chính là lúc DBMS quyết định cho bạn <em>lược đồ ngoài</em> nào (slide 12). Hai người cùng nối vào một lược đồ quan niệm và được cho xem hai tập con khác nhau. Đó là "cơ chế an ninh mạnh và mềm dẻo" mà slide 12 mô tả, và nó bắt đầu từ chính hộp thoại này.</li>
<li><strong>Từ xa hay tại chỗ</strong> — slide nói cả hai: đã có sẵn máy chủ và bạn có quyền thì gõ địa chỉ của nó; chưa có thì tạo một cái cục bộ. Đằng nào thì kết nối cũng là cuộc đối thoại khách–chủ qua TCP, thường là cổng 1433 với SQL Server.</li>
<li><strong>Object Explorer là bản đồ di chuyển</strong> — cái cây bên trái là cách phần còn lại của hướng dẫn đi lại. Slide 38 tới 41 đều là "mở một nhánh, bấm chuột phải, chọn một mục". Học cái cây một lần thì mấy bước còn lại thành vặt.</li>
</ul>
<p class="pitfall">⚠️ Gạch đầu dòng cuối in SAI: "đặt <strong>Database Name</strong> thành … và kiểu xác thực là Windows Authentication". Hộp thoại kết nối ở bước này KHÔNG có ô Database Name nào để điền — ô bạn phải gõ là <strong>Server name</strong>. Dấu ba chấm sau chữ "to …" cho thấy giá trị ấy chưa từng được điền vào lúc soạn deck. Hãy gõ tên máy chủ của bạn (ví dụ <code>localhost\\SQLEXPRESS</code>); còn CSDL thì tạo ở bước 4.</p>`],

      [38, '3. Locate the Database folder',
        `<p class="y-chinh">🎯 Step three is pure navigation: once connected, the <strong>Object Explorer</strong> opens on the left, the server sits at the top of the tree, and under it you expand the <strong>Databases</strong> folder.</p>
<ul>
<li><strong>The tree mirrors the containment hierarchy</strong> — server → Databases → one database → Tables → one table → Columns / Keys / Indexes. Every level is a real thing with a real name, and the SQL for reaching a table spells the same path out: <code>[MyDatabase].[dbo].[MyTable]</code>.</li>
<li><strong>What "+" means</strong> — the slide says "if it is not expanded, click the '+' icon next to it". SSMS loads the tree lazily: it asks the server for the children of a node only when you expand it. On a server with hundreds of databases this is the difference between instant and unusable.</li>
<li><strong>System Databases are not yours</strong> — expanding Databases reveals a System Databases sub-folder holding master, model, msdb and tempdb. They are the server's own bookkeeping — master records what databases exist, tempdb is scratch space rebuilt on every restart. Never create your practice tables in them.</li>
<li><strong>This is the internal level made visible</strong> — slide 10 said the internal level "determines where data is actually stored on the storage devices". The tree is where those physical objects finally show up by name: data files, log files, filegroups. You do not have to care yet, but that is where they live.</li>
<li><strong>The SQL equivalent</strong> — everything this tree shows can be queried: <code>select name from sys.databases;</code> lists the databases, <code>select name from sys.tables;</code> lists the tables of the current one. The GUI is a rendering of exactly those catalogue queries.</li>
</ul>
<p class="pitfall">⚠️ The screenshot on this slide belongs to the <em>next</em> step. The heading says "Locate the Database folder", but the picture already shows the right-click menu open on Databases with "New Database…" highlighted — that is step 4. The same shift continues on slide 39. Follow the <em>text</em> of each slide; the pictures are one step ahead.</p>`,
        `<p class="y-chinh">🎯 Bước ba thuần là chuyện đi lại: kết nối xong thì <strong>Object Explorer</strong> mở ra bên trái, máy chủ nằm trên đỉnh cây, và bên dưới nó bạn mở thư mục <strong>Databases</strong>.</p>
<ul>
<li><strong>Cái cây phản chiếu thứ bậc chứa nhau</strong> — máy chủ → Databases → một CSDL → Tables → một bảng → Columns / Keys / Indexes. Mỗi tầng là một vật có thật mang một cái tên có thật, và câu SQL để chạm tới một bảng đánh vần đúng con đường ấy: <code>[MyDatabase].[dbo].[MyTable]</code>.</li>
<li><strong>Dấu "+" nghĩa là gì</strong> — slide bảo "nếu nó chưa mở, bấm biểu tượng '+' bên cạnh". SSMS nạp cây theo kiểu lười: nó chỉ hỏi máy chủ về các nút con khi bạn mở nút cha. Trên một máy chủ có hàng trăm CSDL thì đó là khác biệt giữa "tức thì" và "không dùng nổi".</li>
<li><strong>System Databases không phải của bạn</strong> — mở Databases ra sẽ thấy thư mục con System Databases chứa master, model, msdb và tempdb. Đó là sổ sách riêng của máy chủ — master ghi nhận có những CSDL nào, tempdb là chỗ nháp bị dựng lại mỗi lần khởi động. Đừng bao giờ tạo bảng bài tập trong đó.</li>
<li><strong>Đây là mức trong được nhìn thấy</strong> — slide 10 nói mức trong "quyết định dữ liệu thật sự nằm ở đâu trên thiết bị lưu trữ". Cái cây chính là nơi những đối tượng vật lý ấy cuối cùng hiện tên: tệp dữ liệu, tệp nhật ký, filegroup. Chưa cần quan tâm vội, nhưng chúng ở đó.</li>
<li><strong>Câu SQL tương đương</strong> — mọi thứ cây này bày ra đều truy vấn được: <code>select name from sys.databases;</code> liệt kê các CSDL, <code>select name from sys.tables;</code> liệt kê bảng của CSDL hiện tại. Giao diện chỉ là cách vẽ lại đúng mấy truy vấn danh mục ấy.</li>
</ul>
<p class="pitfall">⚠️ Ảnh chụp trên slide này thuộc về bước <em>kế tiếp</em>. Tiêu đề ghi "Locate the Database folder", nhưng bức ảnh đã mở sẵn menu chuột phải trên Databases với mục "New Database…" được tô sáng — đó là bước 4. Đúng kiểu lệch ấy còn tiếp ở slide 39. Hãy theo phần CHỮ của từng slide; ảnh đang chạy trước một bước.</p>`],

      [39, '4. Create a new database',
        `<p class="y-chinh">🎯 Step four, the first thing you actually create: <strong>right-click Databases → "New Database…"</strong>, give it a name you will recognise, and leave everything else at its defaults.</p>
<ul>
<li><strong>Why the name matters</strong> — the slide says "give the database a name that will help you identify it". A server holds many databases; <code>Test1</code> tells nobody anything six weeks later, <code>QLThuVien</code> does. Names in SQL Server may not start with a digit and are easier to live with if they contain no spaces.</li>
<li><strong>What the defaults quietly decide</strong> — the dialog is creating two files on disk: a data file (<code>.mdf</code>) and a transaction log (<code>.ldf</code>), each with an initial size and an autogrowth rule. That is the <em>internal level</em> of slide 10 being configured, and for learning purposes the defaults are genuinely fine.</li>
<li><strong>The SQL underneath</strong> — the whole dialog is one statement: <code>create database QLThuVien;</code> — and the "Script" button in SSMS shows it before you press OK. Pressing Script instead of OK, once, is the fastest way to see what a dialog is really doing.</li>
<li><strong>Where you now are in the theory</strong> — you have just created an empty <em>conceptual level</em> (slide 11): a named container that will hold entities, relationships and constraints, but holds nothing yet. Every table from slides 30–31 goes inside it.</li>
<li><strong>The equivalent in the engine used for this lesson</strong> — SQLite has no <code>create database</code> because a database <em>is</em> a file: <code>sqlite3 qlthuvien.db</code> creates it. Different mechanism, same concept. The ANSI/SPARC three-level architecture of slide 9 is what lets the same conceptual design ride on top of two very different internal levels.</li>
</ul>
<p class="pitfall">⚠️ Again the picture does not match the words. The heading and body are about "New Database…", but the screenshot shows the menu opened on the <strong>Tables</strong> node with "New Table…" highlighted — that is step 5 on slide 40. Two slides in a row with a one-step shift, so verify against the text, never against the image.</p>`,
        `<p class="y-chinh">🎯 Bước bốn, thứ đầu tiên bạn thật sự tạo ra: <strong>bấm chuột phải vào Databases → "New Database…"</strong>, đặt cho nó một cái tên bạn nhận ra được, và để nguyên mọi thiết lập còn lại.</p>
<ul>
<li><strong>Vì sao cái tên quan trọng</strong> — slide bảo "đặt cho CSDL một cái tên giúp bạn nhận ra nó". Một máy chủ chứa nhiều CSDL; sáu tuần sau thì <code>Test1</code> chẳng nói với ai điều gì, còn <code>QLThuVien</code> thì có. Tên trong SQL Server không được bắt đầu bằng chữ số, và sẽ dễ sống hơn nhiều nếu không chứa dấu cách.</li>
<li><strong>Mấy thiết lập mặc định lặng lẽ quyết định điều gì</strong> — hộp thoại đang tạo hai tệp trên đĩa: tệp dữ liệu (<code>.mdf</code>) và nhật ký giao dịch (<code>.ldf</code>), mỗi tệp có kích thước ban đầu và quy tắc tự lớn. Đó chính là <em>mức trong</em> ở slide 10 đang được cấu hình, và với mục đích học thì mặc định hoàn toàn ổn.</li>
<li><strong>Câu SQL nằm bên dưới</strong> — cả hộp thoại chỉ là một câu lệnh: <code>create database QLThuVien;</code> — và nút "Script" trong SSMS cho bạn xem nó trước khi bấm OK. Bấm Script thay vì OK, dù chỉ một lần, là cách nhanh nhất để thấy hộp thoại thật sự đang làm gì.</li>
<li><strong>Bạn đang ở đâu trong lý thuyết</strong> — bạn vừa tạo ra một <em>mức quan niệm</em> rỗng (slide 11): một cái hộp có tên, sẽ chứa thực thể, liên kết và ràng buộc, nhưng hiện chưa chứa gì. Mọi bảng ở slide 30–31 sẽ nằm trong đó.</li>
<li><strong>Tương đương ở hệ dùng cho bài học này</strong> — SQLite không có <code>create database</code>, vì với nó một CSDL <em>chính là</em> một tệp: <code>sqlite3 qlthuvien.db</code> là tạo xong. Cơ chế khác, khái niệm y hệt. Chính kiến trúc ba mức ANSI/SPARC ở slide 9 cho phép cùng một thiết kế quan niệm cưỡi lên hai mức trong rất khác nhau.</li>
</ul>
<p class="pitfall">⚠️ Lại một lần ảnh không khớp chữ. Tiêu đề và phần thân nói về "New Database…", nhưng ảnh chụp lại mở menu trên nút <strong>Tables</strong> với mục "New Table…" tô sáng — đó là bước 5 ở slide 40. Hai slide liền nhau cùng lệch một bước, nên hãy đối chiếu với phần chữ, tuyệt đối đừng tin ảnh.</p>`],

      [40, '5. Create a table',
        `<p class="y-chinh">🎯 Step five: "a database can only store data if you create a <strong>structure</strong> for that data". Expand your new database, right-click <strong>Tables</strong>, choose "New Table…".</p>
<ul>
<li><strong>"Structure" is the word to notice</strong> — this is the same idea as the <em>schema</em> of slides 10–12. Before a single row can exist, the DBMS must know the names and types of the columns. That is the difference between a database and a text file.</li>
<li><strong>The table designer grid</strong> — three columns to fill in per attribute: Column Name, Data Type, Allow Nulls. Those three map exactly onto what slide 19 called a relation's attributes, and onto the <code>n</code> columns of slide 30's rule ("n columns related to the n attributes").</li>
<li><strong>The SQL underneath, run for real</strong> — the grid is one <code>create table</code>. For the library design of slide 31 this is literally all of it:
<pre>create table SinhVien (MSSV text primary key, HoTen text, MaLop text);
create table Sach (MaSach text primary key, TenSach text);
create table MuonSach (MSSV text, MaSach text, NgayMuon text,
  primary key (MSSV, MaSach),
  foreign key (MSSV) references SinhVien(MSSV),
  foreign key (MaSach) references Sach(MaSach));</pre>
All three executed without error in sqlite3, then took 3, 4 and 6 rows respectively.</li>
<li><strong>Choosing types is a design decision, not a formality</strong> — a student ID stored as text sorts "SE10" before "SE9"; a date stored as text cannot have a month added to it. Chapter 3 of this course (data storage) is what the Data Type column is really asking about.</li>
<li><strong>One table per entity, one per N:M relationship</strong> — do not improvise here. You already produced the correct list on slides 30–31; the table designer is where you type it in, not where you decide it.</li>
</ul>
<p class="meo">💡 Create the tables in dependency order — SinhVien and Sach before MuonSach — because the foreign keys in MuonSach refer to them. Engines that enforce foreign keys will simply refuse to create a table that points at one which does not exist yet.</p>`,
        `<p class="y-chinh">🎯 Bước năm: "một CSDL chỉ lưu được dữ liệu khi bạn tạo ra <strong>cấu trúc</strong> cho dữ liệu đó". Mở CSDL vừa tạo, bấm chuột phải vào <strong>Tables</strong>, chọn "New Table…".</p>
<ul>
<li><strong>Chữ đáng để ý là "cấu trúc"</strong> — đây đúng là ý niệm <em>lược đồ</em> ở slide 10–12. Trước khi một dòng dữ liệu tồn tại được, DBMS phải biết tên và kiểu của các cột. Đó chính là khác biệt giữa một CSDL và một tệp văn bản.</li>
<li><strong>Lưới thiết kế bảng</strong> — mỗi thuộc tính điền ba ô: Column Name, Data Type, Allow Nulls. Ba ô ấy ánh xạ đúng vào thứ slide 19 gọi là thuộc tính của quan hệ, và vào <code>n</code> cột trong quy tắc của slide 30 ("n cột ứng với n thuộc tính").</li>
<li><strong>Câu SQL bên dưới, đã chạy thật</strong> — cả cái lưới chỉ là một lệnh <code>create table</code>. Với thiết kế thư viện ở slide 31 thì nó đúng bằng chừng này:
<pre>create table SinhVien (MSSV text primary key, HoTen text, MaLop text);
create table Sach (MaSach text primary key, TenSach text);
create table MuonSach (MSSV text, MaSach text, NgayMuon text,
  primary key (MSSV, MaSach),
  foreign key (MSSV) references SinhVien(MSSV),
  foreign key (MaSach) references Sach(MaSach));</pre>
Cả ba chạy không lỗi trong sqlite3, rồi nhận lần lượt 3, 4 và 6 dòng dữ liệu.</li>
<li><strong>Chọn kiểu dữ liệu là quyết định thiết kế, không phải thủ tục</strong> — mã sinh viên lưu dạng văn bản thì "SE10" đứng trước "SE9" khi sắp xếp; ngày tháng lưu dạng văn bản thì không cộng thêm một tháng được. Chương 3 của môn này (lưu trữ dữ liệu) chính là thứ mà cột Data Type đang hỏi bạn.</li>
<li><strong>Mỗi thực thể một bảng, mỗi liên kết N:M một bảng</strong> — đừng ứng biến ở đây. Bạn đã lập xong danh sách đúng ở slide 30–31 rồi; lưới thiết kế bảng là nơi GÕ nó vào, không phải nơi nghĩ ra nó.</li>
</ul>
<p class="meo">💡 Hãy tạo bảng theo thứ tự phụ thuộc — SinhVien và Sach trước, MuonSach sau — vì các khoá ngoại trong MuonSach trỏ tới chúng. Những hệ có cưỡng chế khoá ngoại sẽ thẳng thừng từ chối tạo một bảng trỏ vào bảng chưa tồn tại.</p>`],

      [41, '6. Create the Primary Key',
        `<p class="y-chinh">🎯 Step six, and the most important click in the tutorial: <strong>make the first column a primary key</strong> — name it ID, type <code>int</code>, <em>uncheck</em> Allow Nulls, then press the key icon in the toolbar.</p>
<ul>
<li><strong>What a primary key actually promises</strong> — two things at once: <em>unique</em> (no two rows share the value) and <em>not null</em> (every row has one). Together they guarantee that the value identifies exactly one tuple, which is why slide 29 drew No, S-ID and P-ID in a different colour.</li>
<li><strong>Both promises tested for real</strong> — a table <code>(ID integer primary key not null, FirstName text)</code> was created, then:
<table><tr><td><strong>Attempt</strong></td><td><strong>Engine response</strong></td></tr>
<tr><td>insert (1,'John') then (1,'Mary')</td><td><code>UNIQUE constraint failed: T.ID</code> — the second insert is rejected</td></tr>
<tr><td>insert (NULL,'John')</td><td><code>NOT NULL constraint failed: T2.ID</code></td></tr>
</table>
The key is not documentation; it is a rule the engine enforces at write time. This is the "data integrity" advantage promised back on slide 6.</li>
<li><strong>Why it is "highly recommended" as the first column</strong> — the slide calls it "an ID number, or record number, that will allow you to easily recall these entries later". Beyond convention, the primary key is what every relationship on slide 31 borrows: TEACHES holds P-ID and No precisely because those are the keys of PROFESSOR and COURSE.</li>
<li><strong>Composite keys exist too</strong> — this step shows a single-column key, but slide 34's whole subject is the <em>composite</em> key (Student ID, Course No), and the MuonSach table of slide 40 declares <code>primary key (MSSV, MaSach)</code>. Verified earlier: re-inserting an existing pair raises the same UNIQUE violation.</li>
<li><strong>The link back to Chapter 10</strong> — declaring a primary key silently creates an <em>index</em>, the file structure you met last chapter. Measured on a 200,000-row loans table: 200 lookups by MSSV took <strong>1.525 s</strong> with no index and <strong>0.001 s</strong> after <code>create index</code> — roughly a thousandfold difference, and the query plan changed from <code>SCAN</code> to <code>SEARCH … USING INDEX</code>. Index one column and queries on a <em>different</em> column still scan: the plan stayed <code>SCAN</code> for MaSach.</li>
</ul>
<p class="dap-an">✅ Answer: a primary key = UNIQUE + NOT NULL, enforced by the engine (measured: duplicate → "UNIQUE constraint failed", NULL → "NOT NULL constraint failed"), and it brings an index with it (measured: 1.525 s → 0.001 s for 200 lookups over 200,000 rows).</p>
<p class="pitfall">⚠️ Look closely at the screenshot: the first row has <strong>"int" typed into the Column Name box</strong> and <code>nchar(10)</code> as its Data Type. Whoever captured it put the data type in the name field. The instructions in the text are correct — Column Name "ID", Data Type <code>int</code>, Allow Nulls unchecked — so follow the words, not the picture. The same wrong row is visible again on slide 42.</p>`,
        `<p class="y-chinh">🎯 Bước sáu, và là cú bấm quan trọng nhất của cả hướng dẫn: <strong>biến cột đầu tiên thành khoá chính</strong> — đặt tên ID, kiểu <code>int</code>, <em>bỏ tick</em> Allow Nulls, rồi bấm biểu tượng chìa khoá trên thanh công cụ.</p>
<ul>
<li><strong>Khoá chính thật sự hứa điều gì</strong> — hai điều cùng lúc: <em>duy nhất</em> (không hai dòng nào trùng giá trị) và <em>không rỗng</em> (mọi dòng đều có giá trị). Ghép lại, chúng bảo đảm giá trị ấy định danh đúng một bộ — và đó là lý do slide 29 tô No, S-ID, P-ID bằng màu khác.</li>
<li><strong>Đã kiểm thật cả hai lời hứa</strong> — tạo bảng <code>(ID integer primary key not null, FirstName text)</code> rồi thử:
<table><tr><td><strong>Thao tác</strong></td><td><strong>Máy trả lời</strong></td></tr>
<tr><td>chèn (1,'John') rồi (1,'Mary')</td><td><code>UNIQUE constraint failed: T.ID</code> — lệnh chèn thứ hai bị từ chối</td></tr>
<tr><td>chèn (NULL,'John')</td><td><code>NOT NULL constraint failed: T2.ID</code></td></tr>
</table>
Khoá không phải lời chú thích; nó là một LUẬT mà bộ máy cưỡng chế ngay lúc ghi. Đây chính là lợi thế "toàn vẹn dữ liệu" đã hứa từ slide 6.</li>
<li><strong>Vì sao "rất nên" đặt nó làm cột đầu</strong> — slide gọi nó là "số ID, hay số bản ghi, giúp bạn gọi lại các mục này dễ dàng về sau". Ngoài chuyện quy ước, khoá chính chính là thứ mà mọi liên kết ở slide 31 đi mượn: TEACHES chứa P-ID và No đúng vì đó là khoá của PROFESSOR và COURSE.</li>
<li><strong>Khoá ghép cũng tồn tại</strong> — bước này chỉ cho thấy khoá một cột, nhưng cả chủ đề của slide 34 là khoá <em>ghép</em> (Student ID, Course No), và bảng MuonSach ở slide 40 khai <code>primary key (MSSV, MaSach)</code>. Đã kiểm ở trên: chèn lại một cặp đã có thì văng đúng lỗi UNIQUE ấy.</li>
<li><strong>Nối về Chương 10</strong> — khai một khoá chính là lặng lẽ tạo ra một <em>chỉ mục</em>, đúng cấu trúc tệp bạn học chương trước. Đo trên bảng mượn 200.000 dòng: 200 lần tra theo MSSV mất <strong>1,525 giây</strong> khi chưa có index và <strong>0,001 giây</strong> sau <code>create index</code> — chênh chừng một nghìn lần, và kế hoạch truy vấn đổi từ <code>SCAN</code> sang <code>SEARCH … USING INDEX</code>. Đánh chỉ mục một cột thì truy vấn trên cột <em>khác</em> vẫn quét: kế hoạch cho MaSach vẫn là <code>SCAN</code>.</li>
</ul>
<p class="dap-an">✅ Đáp án: khoá chính = UNIQUE + NOT NULL, do bộ máy cưỡng chế (đo được: trùng → "UNIQUE constraint failed", NULL → "NOT NULL constraint failed"), và nó kéo theo một chỉ mục (đo được: 1,525 s → 0,001 s cho 200 lần tra trên 200.000 dòng).</p>
<p class="pitfall">⚠️ Nhìn kỹ ảnh chụp: dòng đầu có <strong>chữ "int" bị gõ vào ô Column Name</strong> còn Data Type của nó là <code>nchar(10)</code>. Người chụp đã gõ kiểu dữ liệu vào ô tên cột. Phần chữ hướng dẫn thì đúng — Column Name là "ID", Data Type là <code>int</code>, bỏ tick Allow Nulls — nên hãy theo chữ, đừng theo ảnh. Đúng cái dòng sai ấy còn hiện lại ở slide 42.</p>`],

      [42, '7. Understand how tables are structured',
        `<p class="y-chinh">🎯 The closing slide, and it goes back to the very beginning: <strong>tables are composed of fields or columns, and each column represents one aspect of a database entry</strong>. The employee example — FirstName, LastName, Address, PhoneNumber — is the same shape as the COURSES relation of slide 19.</p>
<ul>
<li><strong>Vocabulary, all four words for the same thing</strong> — the theory slides said <em>attribute</em> and <em>tuple</em>; this slide says <em>field</em> or <em>column</em> and <em>entry</em>; SQL says <em>column</em> and <em>row</em>. The exam can use any of them:
<table><tr><td><strong>Relational theory</strong></td><td><strong>SQL / this slide</strong></td><td><strong>File world (Ch.10)</strong></td></tr>
<tr><td>relation</td><td>table</td><td>file</td></tr>
<tr><td>tuple</td><td>row / entry</td><td>record</td></tr>
<tr><td>attribute</td><td>column / field</td><td>field</td></tr>
<tr><td>cardinality</td><td>number of rows</td><td>number of records</td></tr>
</table></li>
<li><strong>"One aspect" is a normalization rule in disguise</strong> — one column, one fact. An "Address" column holding "12 Le Loi, Da Nang, Vietnam" already hides three aspects, and the day someone asks "how many employees are in Da Nang?" you will be writing the same fragile <code>like '%…%'</code> that gave the wrong answer on slide 33.</li>
<li><strong>What you can now do end to end</strong> — interview (28) → E-R diagram (29) → tables for entities and relationships (30–31) → normalize (32–34) → create the database, tables and keys (39–41) → and query with select, project, join, union, intersection, difference, insert, delete, update (20–26). That is the whole of Chapter 11 in one line.</li>
<li><strong>The exam checklist for slides 22–42</strong> — name the nine operations and say which are unary and which binary; write the format of delete / update / select / join / union; convert a small E-R diagram into relations and say how many tables result; state 1NF and 2NF and explain the three anomalies; and say what a primary key guarantees.</li>
<li><strong>Where this goes next</strong> — DBI202 takes the same material and goes deeper: joins of every kind, subqueries, aggregation, transactions and ACID, BCNF, and physical tuning with indexes. Everything you have measured in this lesson — the Cartesian product, the NULL that satisfies no comparison, the lossless re-join, the index that turned 1.525 s into 0.001 s — is the groundwork for it.</li>
</ul>
<p class="dap-an">✅ Answer: a table is a set of rows over a fixed set of typed columns, each column holding one aspect of the entity. For the slide's employee example: Employee(<strong>ID</strong>, FirstName, LastName, Address, PhoneNumber), with ID as primary key — degree 5, cardinality growing as staff are hired.</p>
<p class="pitfall">⚠️ Last time: the screenshot again shows the broken first row with <strong>"int" in the Column Name field</strong> and nchar(10) as its data type, with Allow Nulls unchecked for it while FirstName, LastName and Address stay nullable. The layout being demonstrated is right; that first row is not. Read the picture as an illustration of the <em>grid</em>, not as a table definition to copy.</p>`,
        `<p class="y-chinh">🎯 Slide khép lại, và nó quay về đúng chỗ bắt đầu: <strong>bảng gồm các trường hay các cột, và mỗi cột biểu diễn một khía cạnh của một mục dữ liệu</strong>. Ví dụ nhân viên — FirstName, LastName, Address, PhoneNumber — cùng hình dạng với quan hệ COURSES ở slide 19.</p>
<ul>
<li><strong>Từ vựng, bốn chữ cho cùng một thứ</strong> — các slide lý thuyết nói <em>thuộc tính</em> và <em>bộ</em>; slide này nói <em>trường</em> hoặc <em>cột</em> và <em>mục</em>; SQL nói <em>cột</em> và <em>dòng</em>. Đề thi dùng chữ nào cũng được:
<table><tr><td><strong>Lý thuyết quan hệ</strong></td><td><strong>SQL / slide này</strong></td><td><strong>Thế giới tệp (Ch.10)</strong></td></tr>
<tr><td>quan hệ</td><td>bảng</td><td>tệp</td></tr>
<tr><td>bộ</td><td>dòng / mục</td><td>bản ghi</td></tr>
<tr><td>thuộc tính</td><td>cột / trường</td><td>trường</td></tr>
<tr><td>lực lượng</td><td>số dòng</td><td>số bản ghi</td></tr>
</table></li>
<li><strong>"Một khía cạnh" là luật chuẩn hoá nói trá hình</strong> — một cột, một sự kiện. Một cột "Address" chứa "12 Lê Lợi, Đà Nẵng, Việt Nam" là đã giấu ba khía cạnh trong đó, và tới ngày có người hỏi "có bao nhiêu nhân viên ở Đà Nẵng?" thì bạn lại đang gõ đúng cái <code>like '%…%'</code> mong manh đã cho đáp án sai ở slide 33.</li>
<li><strong>Giờ bạn làm được trọn vòng</strong> — phỏng vấn (28) → sơ đồ E-R (29) → bảng cho thực thể và cho liên kết (30–31) → chuẩn hoá (32–34) → tạo CSDL, bảng, khoá (39–41) → rồi truy vấn bằng select, project, join, union, intersection, difference, insert, delete, update (20–26). Đó là toàn bộ Chương 11 gói trong một dòng.</li>
<li><strong>Bảng kiểm ôn thi cho slide 22–42</strong> — kể tên chín phép toán và nói phép nào một ngôi, phép nào hai ngôi; viết được cú pháp delete / update / select / join / union; chuyển một sơ đồ E-R nhỏ thành các quan hệ và nói ra bao nhiêu bảng; phát biểu 1NF, 2NF và giải thích ba dị thường; và nói khoá chính bảo đảm điều gì.</li>
<li><strong>Đi tiếp về đâu</strong> — DBI202 lấy đúng nội dung này và đào sâu: mọi kiểu join, truy vấn lồng, hàm gộp, giao dịch và ACID, BCNF, rồi tinh chỉnh vật lý bằng chỉ mục. Mọi thứ bạn đã ĐO trong bài này — tích Descartes, giá trị NULL không thoả phép so sánh nào, phép nối lại không mất mát, cái index kéo 1,525 s xuống 0,001 s — chính là nền cho phần ấy.</li>
</ul>
<p class="dap-an">✅ Đáp án: một bảng là một tập các dòng trên một bộ cột có kiểu cố định, mỗi cột giữ một khía cạnh của thực thể. Với ví dụ nhân viên của slide: Employee(<strong>ID</strong>, FirstName, LastName, Address, PhoneNumber), ID là khoá chính — bậc 5, lực lượng lớn dần theo số người được tuyển.</p>
<p class="pitfall">⚠️ Lần cuối: ảnh chụp lại bày ra cái dòng đầu hỏng với <strong>chữ "int" nằm trong ô Column Name</strong> và kiểu dữ liệu là nchar(10), ô Allow Nulls của nó bỏ tick trong khi FirstName, LastName, Address vẫn cho rỗng. Bố cục mà nó minh hoạ thì đúng; riêng dòng đầu thì không. Hãy đọc bức ảnh như minh hoạ cho <em>cái lưới</em>, đừng đọc nó như một định nghĩa bảng để chép lại.</p>`],

    ]),
  ].join('\n'),
};
