/**
 * SAP341 — SAP Application Development with ABAP. Ngành Hệ thống thông tin, kỳ 8.
 * Khung 8 chương song ngữ VI+EN, mỗi chương = 1 DOCUMENT + 1 QUIZ 3 câu.
 * Bám giáo trình: SAP Press "ABAP Development" (Keller/Krüger); SAP official
 * ABAP documentation (help.sap.com); "Beginner's Guide to SAP ABAP" (Peter
 * Moxon); openSAP.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG ${...}/backtick lồng;
 * escape & -> &amp;, < -> &lt;, > -> &gt; (field-symbol ABAP viết &lt;fs&gt;).
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('sap341-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách SAP Press/Moxon, tài liệu chính thức help.sap.com, openSAP, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">SAP341 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>SAP Application Development with ABAP</strong> — the SAP ERP platform, ABAP language, Data Dictionary, database access and reporting — in one place. The official FPTU slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU syllabus &amp; lecture slides for SAP341 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><em>ABAP Development for SAP</em> — Horst Keller &amp; Wolf Hagen Thümmel / Keller &amp; Krüger (SAP Press) — the standard ABAP reference.</li>
<li><em>Beginner's Guide to SAP ABAP</em> — Peter Moxon — hands-on first steps.</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://help.sap.com/docs/abap-cloud/abap-keyword-documentation" target="_blank" rel="noopener">SAP ABAP Keyword Documentation (help.sap.com)</a> — the authoritative language reference.</li>
<li><a href="https://open.sap.com/" target="_blank" rel="noopener">openSAP</a> — free courses on ABAP &amp; the SAP platform.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@PeterMoxon" target="_blank" rel="noopener">Peter Moxon</a> — SAP ABAP programming tutorials.</li>
<li><a href="https://www.youtube.com/results?search_query=abap+tutorial" target="_blank" rel="noopener">ABAP tutorials on YouTube</a> — worked examples end to end.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><strong>SAP GUI</strong> + transaction <code>SE80</code> (ABAP Workbench) / <code>SE38</code> (editor).</li>
<li><strong>ABAP Development Tools (ADT)</strong> for Eclipse — the modern IDE.</li>
<li>A free <strong>SAP BTP ABAP trial</strong> or a training system to practise on.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — what SAP ERP &amp; NetWeaver are, the Workbench, and basic ABAP syntax.</li>
<li><strong>Data layer</strong> — Data Dictionary objects, internal tables, Open SQL &amp; CDS Views.</li>
<li><strong>Structure</strong> — modularization with subroutines, function modules and ABAP OO classes.</li>
<li><strong>Job-ready</strong> — build ALV reports with selection screens, then Dynpro, BAPIs and enhancements.</li>
</ol></div>`,
    `<span class="eyebrow">SAP341 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Phát triển ứng dụng SAP với ABAP</strong> — nền tảng SAP ERP, ngôn ngữ ABAP, Data Dictionary, truy cập CSDL và báo cáo — gom về một chỗ. Slide &amp; giáo trình chính thức của FPTU nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của SAP341 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><em>ABAP Development for SAP</em> — Keller &amp; Krüger (SAP Press) — tài liệu ABAP chuẩn mực.</li>
<li><em>Beginner's Guide to SAP ABAP</em> — Peter Moxon — thực hành từ những bước đầu.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://help.sap.com/docs/abap-cloud/abap-keyword-documentation" target="_blank" rel="noopener">SAP ABAP Keyword Documentation (help.sap.com)</a> — tài liệu ngôn ngữ chính thống.</li>
<li><a href="https://open.sap.com/" target="_blank" rel="noopener">openSAP</a> — khoá học miễn phí về ABAP &amp; nền tảng SAP.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@PeterMoxon" target="_blank" rel="noopener">Peter Moxon</a> — hướng dẫn lập trình SAP ABAP.</li>
<li><a href="https://www.youtube.com/results?search_query=abap+tutorial" target="_blank" rel="noopener">ABAP tutorials trên YouTube</a> — ví dụ chạy từ đầu đến cuối.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><strong>SAP GUI</strong> + giao dịch <code>SE80</code> (ABAP Workbench) / <code>SE38</code> (trình soạn thảo).</li>
<li><strong>ABAP Development Tools (ADT)</strong> cho Eclipse — IDE hiện đại.</li>
<li>Bản <strong>SAP BTP ABAP trial</strong> miễn phí hoặc hệ thống đào tạo để luyện tập.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — SAP ERP &amp; NetWeaver là gì, Workbench, và cú pháp ABAP cơ bản.</li>
<li><strong>Tầng dữ liệu</strong> — đối tượng Data Dictionary, internal table, Open SQL &amp; CDS View.</li>
<li><strong>Cấu trúc</strong> — modul hoá bằng subroutine, function module và class ABAP OO.</li>
<li><strong>Sẵn sàng đi làm</strong> — dựng báo cáo ALV có selection screen, rồi Dynpro, BAPI và enhancement.</li>
</ol></div>`,
  ]]);

const intro = doc('sap341-0-1-overview', 'Course overview: SAP application development with ABAP|||Tổng quan: Phát triển ứng dụng SAP với ABAP',
  'SAP là gì, ABAP làm gì; luồng học: nền tảng & Workbench → cú pháp → Data Dictionary → internal table → Open SQL/CDS → modul hoá & OO → báo cáo → Dynpro/BAPI/enhancement.',
  [[
    `<span class="eyebrow">SAP341 · Lesson 0.1 · Overview</span>
<h2>SAP application development with ABAP</h2>
<p class="lead">This course teaches you to <strong>build and extend business applications on the SAP platform</strong> using <strong>ABAP</strong> (Advanced Business Application Programming) — the language SAP's own ERP is written in. You will read and write ABAP, model data in the Data Dictionary, query the database, structure code into reusable units, and produce reports and screens.</p>
<h3>What is SAP, and where does ABAP fit?</h3>
<ul>
<li><strong>SAP ERP</strong> — integrated business software (finance, logistics, HR, sales) used by large organisations.</li>
<li><strong>SAP NetWeaver</strong> — the application server that runs the ABAP programs.</li>
<li><strong>ABAP</strong> — the high-level 4GL you use to customise and extend that software.</li>
</ul>
<h3>Roadmap</h3>
<p>Platform &amp; ABAP Workbench → core syntax → Data Dictionary → internal tables → Open SQL &amp; CDS Views → modularization &amp; ABAP OO → classical/ALV reports &amp; selection screens → Dynpro/Web Dynpro, BAPIs &amp; enhancements. Bilingual, with runnable ABAP examples and a quiz per chapter.</p>
<div class="callout"><span class="badge">Why it matters</span> SAP runs a huge share of the world's largest companies. Knowing ABAP means you can build and maintain the software that keeps those businesses running.</div>`,
    `<span class="eyebrow">SAP341 · Bài 0.1 · Tổng quan</span>
<h2>Phát triển ứng dụng SAP với ABAP</h2>
<p class="lead">Môn này dạy bạn <strong>xây dựng và mở rộng ứng dụng nghiệp vụ trên nền tảng SAP</strong> bằng <strong>ABAP</strong> (Advanced Business Application Programming) — ngôn ngữ mà chính ERP của SAP được viết bằng. Bạn sẽ đọc và viết ABAP, mô hình hoá dữ liệu trong Data Dictionary, truy vấn CSDL, cấu trúc mã thành các đơn vị dùng lại, và tạo báo cáo, màn hình.</p>
<h3>SAP là gì, và ABAP nằm ở đâu?</h3>
<ul>
<li><strong>SAP ERP</strong> — phần mềm nghiệp vụ tích hợp (tài chính, logistics, nhân sự, bán hàng) mà các tổ chức lớn dùng.</li>
<li><strong>SAP NetWeaver</strong> — máy chủ ứng dụng chạy các chương trình ABAP.</li>
<li><strong>ABAP</strong> — ngôn ngữ 4GL bậc cao bạn dùng để tuỳ biến và mở rộng phần mềm đó.</li>
</ul>
<h3>Lộ trình</h3>
<p>Nền tảng &amp; ABAP Workbench → cú pháp cơ bản → Data Dictionary → internal table → Open SQL &amp; CDS View → modul hoá &amp; ABAP OO → báo cáo classical/ALV &amp; selection screen → Dynpro/Web Dynpro, BAPI &amp; enhancement. Song ngữ, có ví dụ ABAP chạy được và quiz mỗi chương.</p>
<div class="callout"><span class="badge">Vì sao quan trọng</span> SAP vận hành một phần rất lớn các doanh nghiệp lớn nhất thế giới. Biết ABAP nghĩa là bạn có thể xây và bảo trì phần mềm giữ cho các doanh nghiệp đó chạy.</div>`,
  ]]);

const c1 = doc('sap341-1-1-platform-workbench', '1.1 — SAP ERP, NetWeaver & the ABAP Workbench|||1.1 — SAP ERP, NetWeaver & môi trường ABAP Workbench',
  'Kiến trúc SAP 3 lớp; SAP NetWeaver Application Server; ABAP Workbench (SE80) và các giao dịch: SE38, SE11, SE37, SE24; chương trình "Hello World" đầu tiên.',
  [[
    `<span class="eyebrow">SAP341 · Chapter 1 · Lesson 1.1</span>
<h2>SAP ERP, NetWeaver &amp; the ABAP Workbench</h2>
<h3>The three-tier architecture</h3>
<ul>
<li><strong>Presentation</strong> — SAP GUI (or a browser) where the user works.</li>
<li><strong>Application</strong> — the <strong>NetWeaver Application Server (AS ABAP)</strong> that runs your programs and holds the business logic.</li>
<li><strong>Database</strong> — one central database (HANA, or older systems) holding all business data.</li>
</ul>
<h3>The ABAP Workbench</h3>
<p>You develop inside the <strong>ABAP Workbench</strong>, reached by transaction <code>SE80</code>. Key transactions:</p>
<ul>
<li><code>SE38</code> / <code>SE80</code> — the ABAP Editor (write programs).</li>
<li><code>SE11</code> — the Data Dictionary (tables, data elements, domains).</li>
<li><code>SE37</code> — Function Builder (function modules); <code>SE24</code> — Class Builder (ABAP OO).</li>
</ul>
<p>Every object lives in a <strong>package</strong> and is moved between systems by a <strong>transport request</strong>.</p>
<pre><code>REPORT z_hello.

START-OF-SELECTION.
  WRITE 'Hello, ABAP world!'.
</code></pre>
<div class="callout"><span class="badge">Convention</span> Customer/student objects start with <strong>Y</strong> or <strong>Z</strong> — SAP reserves all other names for its own code, so your programs never clash with a system upgrade.</div>`,
    `<span class="eyebrow">SAP341 · Chương 1 · Bài 1.1</span>
<h2>SAP ERP, NetWeaver &amp; môi trường ABAP Workbench</h2>
<h3>Kiến trúc ba lớp</h3>
<ul>
<li><strong>Trình bày (Presentation)</strong> — SAP GUI (hoặc trình duyệt) nơi người dùng làm việc.</li>
<li><strong>Ứng dụng (Application)</strong> — <strong>NetWeaver Application Server (AS ABAP)</strong> chạy chương trình và chứa logic nghiệp vụ.</li>
<li><strong>Cơ sở dữ liệu (Database)</strong> — một CSDL trung tâm (HANA, hoặc hệ cũ) chứa toàn bộ dữ liệu nghiệp vụ.</li>
</ul>
<h3>ABAP Workbench</h3>
<p>Bạn phát triển trong <strong>ABAP Workbench</strong>, mở bằng giao dịch <code>SE80</code>. Các giao dịch chính:</p>
<ul>
<li><code>SE38</code> / <code>SE80</code> — trình soạn ABAP (viết chương trình).</li>
<li><code>SE11</code> — Data Dictionary (bảng, data element, domain).</li>
<li><code>SE37</code> — Function Builder (function module); <code>SE24</code> — Class Builder (ABAP OO).</li>
</ul>
<p>Mỗi đối tượng nằm trong một <strong>package</strong> và được chuyển giữa các hệ thống bằng một <strong>transport request</strong>.</p>
<pre><code>REPORT z_hello.

START-OF-SELECTION.
  WRITE 'Hello, ABAP world!'.
</code></pre>
<div class="callout"><span class="badge">Quy ước</span> Đối tượng của khách hàng/sinh viên bắt đầu bằng <strong>Y</strong> hoặc <strong>Z</strong> — SAP giữ mọi tên khác cho mã của hãng, nên chương trình của bạn không đụng độ khi hệ thống nâng cấp.</div>`,
  ]]);

const c1q = quiz('sap341-quiz-1', 'Quiz 1 — Platform & Workbench|||Quiz 1 — Nền tảng & Workbench', [
  { id: 'q1', question: 'Trong kiến trúc SAP ba lớp, chương trình ABAP chạy ở lớp nào?', options: ['Lớp Trình bày (SAP GUI)', 'Lớp Ứng dụng (NetWeaver AS ABAP)', 'Lớp Cơ sở dữ liệu', 'Trên máy người dùng'], correctIndex: 1, explanation: 'ABAP chạy trên máy chủ ứng dụng NetWeaver (AS ABAP), giữa lớp trình bày và CSDL.' },
  { id: 'q2', question: 'Giao dịch nào mở Data Dictionary để tạo bảng/data element?', options: ['SE38', 'SE37', 'SE11', 'SE24'], correctIndex: 2, explanation: 'SE11 là Data Dictionary. SE38 là editor, SE37 function module, SE24 class.' },
  { id: 'q3', question: 'Tên đối tượng do sinh viên/khách hàng tạo thường bắt đầu bằng?', options: ['A hoặc B', 'Y hoặc Z', 'SAP_', 'X'], correctIndex: 1, explanation: 'Namespace khách hàng là Y/Z; SAP giữ các tên khác cho mã của hãng để tránh đụng độ khi nâng cấp.' },
]);

const c2 = doc('sap341-2-1-syntax', '2.1 — Core ABAP syntax: data, types, operators, flow|||2.1 — Cú pháp ABAP cơ bản: biến, kiểu, toán tử, luồng',
  'Khai báo DATA & kiểu (i, p, c, string, d, f); toán tử & phép gán; điều kiện IF/CASE; vòng lặp DO/WHILE; chú ý so sánh dùng &lt;, &gt;, &lt;= trong ABAP.',
  [[
    `<span class="eyebrow">SAP341 · Chapter 2 · Lesson 2.1</span>
<h2>Core ABAP syntax</h2>
<h3>Data &amp; types</h3>
<p>Declare variables with <code>DATA</code>. Common built-in types: <code>i</code> (integer), <code>p</code> (packed decimal — for money), <code>c</code> (character), <code>string</code>, <code>d</code> (date), <code>f</code> (float).</p>
<pre><code>DATA lv_count TYPE i VALUE 0.
DATA lv_price TYPE p LENGTH 8 DECIMALS 2.
DATA lv_name  TYPE string.

lv_count = 5.
lv_name  = 'ABAP'.
</code></pre>
<h3>Operators &amp; flow control</h3>
<p>Arithmetic <code>+ - * /</code>; comparison uses <code>=</code>, <code>&lt;&gt;</code> (not equal), <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code> (or the word forms <code>EQ NE LT GT LE GE</code>).</p>
<pre><code>IF lv_count &gt; 3 AND lv_count &lt;= 10.
  WRITE 'in range'.
ELSEIF lv_count = 0.
  WRITE 'empty'.
ELSE.
  WRITE 'other'.
ENDIF.

DO 3 TIMES.
  WRITE / sy-index.   &quot;sy-index = loop counter&quot;
ENDDO.
</code></pre>
<div class="callout"><span class="badge">System fields</span> ABAP fills special <code>sy-*</code> fields automatically: <code>sy-subrc</code> (0 = last operation OK), <code>sy-index</code> (loop counter), <code>sy-datum</code> (today). Checking <code>sy-subrc</code> after an operation is a core ABAP habit.</div>`,
    `<span class="eyebrow">SAP341 · Chương 2 · Bài 2.1</span>
<h2>Cú pháp ABAP cơ bản</h2>
<h3>Biến &amp; kiểu</h3>
<p>Khai báo biến bằng <code>DATA</code>. Các kiểu dựng sẵn hay dùng: <code>i</code> (số nguyên), <code>p</code> (packed decimal — cho tiền), <code>c</code> (ký tự), <code>string</code>, <code>d</code> (ngày), <code>f</code> (số thực).</p>
<pre><code>DATA lv_count TYPE i VALUE 0.
DATA lv_price TYPE p LENGTH 8 DECIMALS 2.
DATA lv_name  TYPE string.

lv_count = 5.
lv_name  = 'ABAP'.
</code></pre>
<h3>Toán tử &amp; điều khiển luồng</h3>
<p>Số học <code>+ - * /</code>; so sánh dùng <code>=</code>, <code>&lt;&gt;</code> (khác), <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code> (hoặc dạng chữ <code>EQ NE LT GT LE GE</code>).</p>
<pre><code>IF lv_count &gt; 3 AND lv_count &lt;= 10.
  WRITE 'trong khoảng'.
ELSEIF lv_count = 0.
  WRITE 'rỗng'.
ELSE.
  WRITE 'khác'.
ENDIF.

DO 3 TIMES.
  WRITE / sy-index.   &quot;sy-index = biến đếm vòng lặp&quot;
ENDDO.
</code></pre>
<div class="callout"><span class="badge">Trường hệ thống</span> ABAP tự điền các trường <code>sy-*</code>: <code>sy-subrc</code> (0 = thao tác trước OK), <code>sy-index</code> (biến đếm vòng lặp), <code>sy-datum</code> (hôm nay). Kiểm <code>sy-subrc</code> sau mỗi thao tác là thói quen cốt lõi trong ABAP.</div>`,
  ]]);

const c2q = quiz('sap341-quiz-2', 'Quiz 2 — ABAP syntax|||Quiz 2 — Cú pháp ABAP', [
  { id: 'q1', question: 'Kiểu dữ liệu nào phù hợp nhất để lưu số tiền (có phần thập phân, tránh sai số)?', options: ['i (integer)', 'p (packed decimal)', 'c (character)', 'f (float)'], correctIndex: 1, explanation: 'Kiểu p (packed decimal) lưu số thập phân chính xác, dùng cho tiền tệ; f (float) có thể sai số.' },
  { id: 'q2', question: 'Sau một thao tác, trường hệ thống nào cho biết nó thành công (giá trị 0)?', options: ['sy-index', 'sy-datum', 'sy-subrc', 'sy-tabix'], correctIndex: 2, explanation: 'sy-subrc = 0 nghĩa là thao tác trước đó thành công; giá trị khác 0 là có vấn đề.' },
  { id: 'q3', question: 'Trong ABAP, toán tử so sánh "khác nhau" được viết là?', options: ['!=', '<>', '=/=', '~='], correctIndex: 1, explanation: 'ABAP dùng <> (hoặc dạng chữ NE) cho "khác"; = (hoặc EQ) cho "bằng".' },
]);

const c3 = doc('sap341-3-1-data-dictionary', '3.1 — The ABAP Data Dictionary|||3.1 — Data Dictionary của ABAP',
  'Domain (kiểu kỹ thuật + giá trị hợp lệ) → data element (nghĩa nghiệp vụ + nhãn) → bảng transparent (khoá, field); view; kiểm tra & activation trong SE11.',
  [[
    `<span class="eyebrow">SAP341 · Chapter 3 · Lesson 3.1</span>
<h2>The ABAP Data Dictionary (DDIC)</h2>
<p>The <strong>Data Dictionary</strong> (transaction <code>SE11</code>) is where you define data centrally — once defined, a field's type and help texts are reused everywhere.</p>
<h3>The three layers</h3>
<ul>
<li><strong>Domain</strong> — the pure technical definition: data type, length, and an optional list/range of allowed values.</li>
<li><strong>Data element</strong> — a business meaning built on a domain, plus the field labels shown on screens.</li>
<li><strong>Table</strong> — a set of fields; each field's type comes from a data element. A <strong>transparent table</strong> maps 1:1 to a real database table.</li>
</ul>
<pre><code>Domain      ZDO_AMOUNT   -&gt; type CURR, length 15, 2 decimals
Data elem.  ZDE_AMOUNT   -&gt; uses ZDO_AMOUNT, label 'Amount'
Table       ZORDERS
   ORDER_ID   (key)  ZDE_ORDER_ID
   CUST_ID           ZDE_CUST_ID
   AMOUNT            ZDE_AMOUNT
</code></pre>
<p>A <strong>view</strong> joins columns from several tables into one read-only projection. After any change you must <strong>activate</strong> the object before it exists in the database.</p>
<div class="callout"><span class="badge">Why the layers</span> Define an amount's rules once in a domain; every table and screen that uses it inherits the same type, checks and labels — change it in one place and it changes everywhere.</div>`,
    `<span class="eyebrow">SAP341 · Chương 3 · Bài 3.1</span>
<h2>Data Dictionary của ABAP (DDIC)</h2>
<p><strong>Data Dictionary</strong> (giao dịch <code>SE11</code>) là nơi bạn định nghĩa dữ liệu tập trung — đã định nghĩa một lần thì kiểu và văn bản trợ giúp của một field được dùng lại ở mọi nơi.</p>
<h3>Ba tầng</h3>
<ul>
<li><strong>Domain</strong> — định nghĩa kỹ thuật thuần: kiểu dữ liệu, độ dài, và (tuỳ chọn) danh sách/khoảng giá trị hợp lệ.</li>
<li><strong>Data element</strong> — nghĩa nghiệp vụ dựng trên một domain, kèm nhãn field hiển thị trên màn hình.</li>
<li><strong>Bảng (table)</strong> — một tập field; kiểu mỗi field lấy từ một data element. <strong>Bảng transparent</strong> ánh xạ 1:1 với một bảng CSDL thật.</li>
</ul>
<pre><code>Domain      ZDO_AMOUNT   -&gt; kiểu CURR, dài 15, 2 chữ số thập phân
Data elem.  ZDE_AMOUNT   -&gt; dùng ZDO_AMOUNT, nhãn 'Amount'
Bảng        ZORDERS
   ORDER_ID   (khoá) ZDE_ORDER_ID
   CUST_ID           ZDE_CUST_ID
   AMOUNT            ZDE_AMOUNT
</code></pre>
<p>Một <strong>view</strong> ghép các cột từ nhiều bảng thành một phép chiếu chỉ đọc. Sau mọi thay đổi bạn phải <strong>activate</strong> đối tượng thì nó mới tồn tại trong CSDL.</p>
<div class="callout"><span class="badge">Vì sao chia tầng</span> Định nghĩa quy tắc của một số tiền một lần trong domain; mọi bảng và màn hình dùng nó đều thừa hưởng cùng kiểu, kiểm tra và nhãn — sửa một chỗ là đổi khắp nơi.</div>`,
  ]]);

const c3q = quiz('sap341-quiz-3', 'Quiz 3 — Data Dictionary|||Quiz 3 — Data Dictionary', [
  { id: 'q1', question: 'Đối tượng DDIC nào chứa định nghĩa KỸ THUẬT thuần (kiểu, độ dài, giá trị hợp lệ)?', options: ['Data element', 'Domain', 'Bảng transparent', 'View'], correctIndex: 1, explanation: 'Domain giữ kiểu/độ dài/giá trị hợp lệ; data element thêm nghĩa nghiệp vụ và nhãn dựa trên domain.' },
  { id: 'q2', question: 'Một "bảng transparent" trong DDIC?', options: ['Chỉ tồn tại trong bộ nhớ', 'Ánh xạ 1:1 với một bảng CSDL thật', 'Là một view chỉ đọc', 'Không lưu dữ liệu'], correctIndex: 1, explanation: 'Bảng transparent tương ứng 1:1 với một bảng vật lý trong cơ sở dữ liệu.' },
  { id: 'q3', question: 'Sau khi tạo/sửa một đối tượng DDIC, bước bắt buộc để nó có hiệu lực là?', options: ['Xoá cache', 'Activate (kích hoạt)', 'Khởi động lại SAP GUI', 'Tạo transport'], correctIndex: 1, explanation: 'Phải activate thì đối tượng mới được tạo/cập nhật trong CSDL và dùng được.' },
]);

const c4 = doc('sap341-4-1-internal-tables', '4.1 — Internal tables & data processing|||4.1 — Internal table & xử lý dữ liệu',
  'Structure vs internal table; TYPES/DATA khai báo; APPEND/INSERT; LOOP AT ... INTO; READ TABLE với key; work area; xoá & sắp xếp SORT; field-symbols &lt;fs&gt;.',
  [[
    `<span class="eyebrow">SAP341 · Chapter 4 · Lesson 4.1</span>
<h2>Internal tables &amp; data processing</h2>
<p>An <strong>internal table</strong> is ABAP's in-memory table — rows of a structure, held in the program while it runs. It is how you hold and process sets of records (e.g. all orders read from the database).</p>
<h3>Declare, fill, read</h3>
<pre><code>TYPES: BEGIN OF ty_order,
         id     TYPE i,
         amount TYPE p LENGTH 8 DECIMALS 2,
       END OF ty_order.

DATA lt_orders TYPE STANDARD TABLE OF ty_order.
DATA ls_order  TYPE ty_order.       &quot;work area (one row)&quot;

ls_order-id = 1.  ls_order-amount = '99.90'.
APPEND ls_order TO lt_orders.

LOOP AT lt_orders INTO ls_order.
  WRITE: / ls_order-id, ls_order-amount.
ENDLOOP.

READ TABLE lt_orders INTO ls_order WITH KEY id = 1.
IF sy-subrc = 0.
  WRITE / 'found order 1'.
ENDIF.
</code></pre>
<h3>Field-symbols — process rows in place</h3>
<p>A <strong>field-symbol</strong> (written <code>&lt;fs&gt;</code>) is a pointer to a row; assigning into it changes the table directly, with no copy:</p>
<pre><code>FIELD-SYMBOLS &lt;fs_order&gt; TYPE ty_order.
LOOP AT lt_orders ASSIGNING &lt;fs_order&gt;.
  &lt;fs_order&gt;-amount = &lt;fs_order&gt;-amount * 2.   &quot;updates the table row&quot;
ENDLOOP.
</code></pre>
<div class="callout"><span class="badge">INTO vs ASSIGNING</span> <code>LOOP ... INTO wa</code> copies each row into a work area (safe, slower); <code>LOOP ... ASSIGNING &lt;fs&gt;</code> works on the row directly (fast, and lets you modify it). Use <code>SORT</code> before <code>DELETE ADJACENT DUPLICATES</code>.</div>`,
    `<span class="eyebrow">SAP341 · Chương 4 · Bài 4.1</span>
<h2>Internal table &amp; xử lý dữ liệu</h2>
<p><strong>Internal table</strong> là bảng trong bộ nhớ của ABAP — các dòng của một structure, giữ trong chương trình khi nó chạy. Đây là cách bạn giữ và xử lý tập bản ghi (vd toàn bộ đơn hàng đọc từ CSDL).</p>
<h3>Khai báo, đổ dữ liệu, đọc</h3>
<pre><code>TYPES: BEGIN OF ty_order,
         id     TYPE i,
         amount TYPE p LENGTH 8 DECIMALS 2,
       END OF ty_order.

DATA lt_orders TYPE STANDARD TABLE OF ty_order.
DATA ls_order  TYPE ty_order.       &quot;work area (một dòng)&quot;

ls_order-id = 1.  ls_order-amount = '99.90'.
APPEND ls_order TO lt_orders.

LOOP AT lt_orders INTO ls_order.
  WRITE: / ls_order-id, ls_order-amount.
ENDLOOP.

READ TABLE lt_orders INTO ls_order WITH KEY id = 1.
IF sy-subrc = 0.
  WRITE / 'tìm thấy đơn 1'.
ENDIF.
</code></pre>
<h3>Field-symbol — xử lý dòng tại chỗ</h3>
<p><strong>Field-symbol</strong> (viết <code>&lt;fs&gt;</code>) là con trỏ tới một dòng; gán vào nó là đổi trực tiếp trong bảng, không sao chép:</p>
<pre><code>FIELD-SYMBOLS &lt;fs_order&gt; TYPE ty_order.
LOOP AT lt_orders ASSIGNING &lt;fs_order&gt;.
  &lt;fs_order&gt;-amount = &lt;fs_order&gt;-amount * 2.   &quot;cập nhật thẳng dòng bảng&quot;
ENDLOOP.
</code></pre>
<div class="callout"><span class="badge">INTO vs ASSIGNING</span> <code>LOOP ... INTO wa</code> sao chép mỗi dòng vào work area (an toàn, chậm hơn); <code>LOOP ... ASSIGNING &lt;fs&gt;</code> làm việc thẳng trên dòng (nhanh, và cho phép sửa). Dùng <code>SORT</code> trước <code>DELETE ADJACENT DUPLICATES</code>.</div>`,
  ]]);

const c4q = quiz('sap341-quiz-4', 'Quiz 4 — Internal tables|||Quiz 4 — Internal table', [
  { id: 'q1', question: 'Internal table trong ABAP được lưu ở đâu?', options: ['Trong CSDL vĩnh viễn', 'Trong bộ nhớ, chỉ tồn tại khi chương trình chạy', 'Trên đĩa của SAP GUI', 'Trong transport request'], correctIndex: 1, explanation: 'Internal table là bảng trong bộ nhớ (runtime), mất đi khi chương trình kết thúc.' },
  { id: 'q2', question: 'Muốn SỬA trực tiếp từng dòng của internal table (không sao chép), nên dùng?', options: ['LOOP ... INTO wa', 'LOOP ... ASSIGNING <fs>', 'READ TABLE', 'SELECT SINGLE'], correctIndex: 1, explanation: 'ASSIGNING <fs> trỏ thẳng vào dòng, mọi thay đổi cập nhật ngay vào bảng; INTO thì làm trên bản sao.' },
  { id: 'q3', question: 'Sau READ TABLE ... WITH KEY, làm sao biết có tìm thấy dòng?', options: ['Kiểm sy-index', 'Kiểm sy-subrc = 0', 'Kiểm sy-datum', 'Đếm số dòng'], correctIndex: 1, explanation: 'sy-subrc = 0 nghĩa là READ TABLE tìm thấy; khác 0 là không có dòng khớp key.' },
]);

const c5 = doc('sap341-5-1-open-sql-cds', '5.1 — Open SQL & CDS Views|||5.1 — Truy vấn Open SQL & CDS View',
  'SELECT ... INTO TABLE / SELECT SINGLE; WHERE, INTO CORRESPONDING FIELDS OF; JOIN; sy-subrc & sy-dbcnt; giới thiệu Core Data Services (CDS) View định nghĩa trên server CSDL.',
  [[
    `<span class="eyebrow">SAP341 · Chapter 5 · Lesson 5.1</span>
<h2>Open SQL &amp; CDS Views</h2>
<h3>Open SQL — one syntax, any database</h3>
<p><strong>Open SQL</strong> is ABAP's database-independent SELECT. SAP translates it to the native SQL of whatever database runs underneath, so the same code works on HANA or any other.</p>
<pre><code>DATA lt_orders TYPE STANDARD TABLE OF zorders.

SELECT order_id, cust_id, amount
  FROM zorders
  WHERE amount &gt; 100
  INTO TABLE @lt_orders.

IF sy-subrc = 0.
  WRITE / sy-dbcnt.        &quot;number of rows read&quot;
ENDIF.

SELECT SINGLE amount FROM zorders
  WHERE order_id = 1 INTO @DATA(lv_amount).
</code></pre>
<p>Read only the columns and rows you need — a narrow <code>WHERE</code> and column list beats reading a whole table and filtering in ABAP.</p>
<h3>CDS Views — model logic on the database</h3>
<p><strong>Core Data Services (CDS)</strong> lets you define rich, reusable views <em>on the database server</em> — joins, calculated fields, associations — so the heavy work runs where the data lives (code push-down), not in the application server.</p>
<pre><code>define view Z_SALES as select from zorders
  association [0..1] to zcust as _cust
    on zorders.cust_id = _cust.id
{
  key order_id,
      cust_id,
      amount
}
</code></pre>
<div class="callout"><span class="badge">Push down to the data</span> The golden rule of modern ABAP on HANA: do set operations and aggregation in SQL/CDS on the database, and move only the result to ABAP — never loop row-by-row over a table you could have filtered in the SELECT.</div>`,
    `<span class="eyebrow">SAP341 · Chương 5 · Bài 5.1</span>
<h2>Truy vấn Open SQL &amp; CDS View</h2>
<h3>Open SQL — một cú pháp, mọi CSDL</h3>
<p><strong>Open SQL</strong> là câu SELECT độc lập CSDL của ABAP. SAP dịch nó sang SQL gốc của bất kỳ CSDL nào bên dưới, nên cùng một đoạn mã chạy trên HANA hay CSDL khác.</p>
<pre><code>DATA lt_orders TYPE STANDARD TABLE OF zorders.

SELECT order_id, cust_id, amount
  FROM zorders
  WHERE amount &gt; 100
  INTO TABLE @lt_orders.

IF sy-subrc = 0.
  WRITE / sy-dbcnt.        &quot;số dòng đã đọc&quot;
ENDIF.

SELECT SINGLE amount FROM zorders
  WHERE order_id = 1 INTO @DATA(lv_amount).
</code></pre>
<p>Chỉ đọc đúng cột và dòng cần dùng — một <code>WHERE</code> hẹp và danh sách cột gọn tốt hơn đọc cả bảng rồi lọc trong ABAP.</p>
<h3>CDS View — mô hình logic ngay trên CSDL</h3>
<p><strong>Core Data Services (CDS)</strong> cho phép định nghĩa view giàu, dùng lại được <em>trên server CSDL</em> — join, field tính toán, association — để phần việc nặng chạy ở nơi dữ liệu nằm (code push-down), thay vì ở máy chủ ứng dụng.</p>
<pre><code>define view Z_SALES as select from zorders
  association [0..1] to zcust as _cust
    on zorders.cust_id = _cust.id
{
  key order_id,
      cust_id,
      amount
}
</code></pre>
<div class="callout"><span class="badge">Đẩy việc xuống dữ liệu</span> Quy tắc vàng của ABAP hiện đại trên HANA: làm phép tập hợp và gộp trong SQL/CDS trên CSDL, chỉ chuyển kết quả về ABAP — đừng lặp từng dòng trên một bảng lẽ ra đã lọc được ngay trong SELECT.</div>`,
  ]]);

const c5q = quiz('sap341-quiz-5', 'Quiz 5 — Open SQL & CDS|||Quiz 5 — Open SQL & CDS', [
  { id: 'q1', question: 'Vì sao Open SQL "độc lập cơ sở dữ liệu"?', options: ['Nó không dùng SQL', 'SAP dịch nó sang SQL gốc của CSDL bên dưới', 'Nó chỉ chạy trên HANA', 'Nó lưu dữ liệu trong bộ nhớ'], correctIndex: 1, explanation: 'Open SQL được SAP dịch sang SQL native của CSDL đang chạy, nên cùng mã chạy trên nhiều CSDL.' },
  { id: 'q2', question: 'Ý tưởng "code push-down" với CDS View nghĩa là?', options: ['Đẩy phép tính/gộp xuống server CSDL, chỉ mang kết quả về ABAP', 'Đọc cả bảng rồi lọc trong ABAP', 'Tắt mọi WHERE', 'Chạy ABAP trên máy khách'], correctIndex: 0, explanation: 'Push-down: làm việc nặng (join, aggregate) ngay trên CSDL/HANA, ABAP chỉ nhận kết quả — nhanh hơn nhiều.' },
  { id: 'q3', question: 'Sau một câu SELECT ... INTO TABLE, trường nào cho biết số dòng đã đọc?', options: ['sy-index', 'sy-dbcnt', 'sy-datum', 'sy-uname'], correctIndex: 1, explanation: 'sy-dbcnt chứa số dòng thao tác CSDL vừa xử lý; sy-subrc cho biết có đọc được hay không.' },
]);

const c6 = doc('sap341-6-1-modularization-oo', '6.1 — Modularization: subroutines, function modules & ABAP OO|||6.1 — Modul hoá: subroutine, function module & ABAP OO',
  'Vì sao modul hoá; FORM/PERFORM (subroutine); function module (SE37, giao diện IMPORTING/EXPORTING); class ABAP OO (SE24): attribute, method, CREATE OBJECT, -&gt; và =&gt;.',
  [[
    `<span class="eyebrow">SAP341 · Chapter 6 · Lesson 6.1</span>
<h2>Modularization &amp; ABAP OO</h2>
<p>Splitting code into named, reusable units makes it readable, testable and shareable. ABAP offers three levels, from oldest to modern.</p>
<h3>Subroutine (FORM / PERFORM) — legacy</h3>
<pre><code>PERFORM add_two USING 3 4 CHANGING lv_sum.

FORM add_two USING p_a TYPE i p_b TYPE i
             CHANGING p_result TYPE i.
  p_result = p_a + p_b.
ENDFORM.
</code></pre>
<h3>Function module — reusable across programs</h3>
<p>Built in <code>SE37</code>, a function module has a formal interface (<code>IMPORTING</code>, <code>EXPORTING</code>, <code>CHANGING</code>, <code>EXCEPTIONS</code>) and lives in a function group so any program can call it.</p>
<h3>ABAP OO — the modern default</h3>
<pre><code>CLASS lcl_calc DEFINITION.
  PUBLIC SECTION.
    METHODS add IMPORTING iv_a TYPE i iv_b TYPE i
                RETURNING VALUE(rv_sum) TYPE i.
ENDCLASS.

CLASS lcl_calc IMPLEMENTATION.
  METHOD add.
    rv_sum = iv_a + iv_b.
  ENDMETHOD.
ENDCLASS.

DATA(lo_calc) = NEW lcl_calc( ).
DATA(lv_total) = lo_calc-&gt;add( iv_a = 3 iv_b = 4 ).   &quot;instance method -&gt;&quot;
</code></pre>
<div class="callout"><span class="badge">-&gt; vs =&gt;</span> Use <code>-&gt;</code> to call an <em>instance</em> member through an object reference, and <code>=&gt;</code> to call a <em>static</em> member through the class name. New code should be object-oriented (classes), not FORM subroutines.</div>`,
    `<span class="eyebrow">SAP341 · Chương 6 · Bài 6.1</span>
<h2>Modul hoá &amp; ABAP OO</h2>
<p>Chia mã thành các đơn vị có tên, dùng lại được giúp mã dễ đọc, dễ kiểm thử và dễ chia sẻ. ABAP có ba mức, từ cũ đến hiện đại.</p>
<h3>Subroutine (FORM / PERFORM) — kiểu cũ</h3>
<pre><code>PERFORM add_two USING 3 4 CHANGING lv_sum.

FORM add_two USING p_a TYPE i p_b TYPE i
             CHANGING p_result TYPE i.
  p_result = p_a + p_b.
ENDFORM.
</code></pre>
<h3>Function module — dùng lại giữa nhiều chương trình</h3>
<p>Tạo trong <code>SE37</code>, function module có giao diện hình thức (<code>IMPORTING</code>, <code>EXPORTING</code>, <code>CHANGING</code>, <code>EXCEPTIONS</code>) và nằm trong một function group để mọi chương trình gọi được.</p>
<h3>ABAP OO — mặc định hiện đại</h3>
<pre><code>CLASS lcl_calc DEFINITION.
  PUBLIC SECTION.
    METHODS add IMPORTING iv_a TYPE i iv_b TYPE i
                RETURNING VALUE(rv_sum) TYPE i.
ENDCLASS.

CLASS lcl_calc IMPLEMENTATION.
  METHOD add.
    rv_sum = iv_a + iv_b.
  ENDMETHOD.
ENDCLASS.

DATA(lo_calc) = NEW lcl_calc( ).
DATA(lv_total) = lo_calc-&gt;add( iv_a = 3 iv_b = 4 ).   &quot;method instance -&gt;&quot;
</code></pre>
<div class="callout"><span class="badge">-&gt; và =&gt;</span> Dùng <code>-&gt;</code> để gọi thành viên <em>instance</em> qua tham chiếu đối tượng, và <code>=&gt;</code> để gọi thành viên <em>static</em> qua tên class. Mã mới nên hướng đối tượng (class), không dùng FORM subroutine.</div>`,
  ]]);

const c6q = quiz('sap341-quiz-6', 'Quiz 6 — Modularization & OO|||Quiz 6 — Modul hoá & OO', [
  { id: 'q1', question: 'Trong ABAP OO, gọi một method của instance qua tham chiếu đối tượng dùng toán tử?', options: ['=> (mũi tên đôi)', '-> (mũi tên đơn)', '.', '::'], correctIndex: 1, explanation: '-> gọi thành viên instance qua object reference; => gọi thành viên static qua tên class.' },
  { id: 'q2', question: 'Đơn vị mã dùng lại được giữa NHIỀU chương trình, tạo trong SE37, có giao diện IMPORTING/EXPORTING là?', options: ['FORM subroutine', 'Function module', 'Macro', 'Include'], correctIndex: 1, explanation: 'Function module (SE37) có giao diện hình thức và nằm trong function group để mọi chương trình gọi.' },
  { id: 'q3', question: 'Với mã ABAP MỚI, cách modul hoá được khuyến nghị là?', options: ['FORM/PERFORM', 'Hướng đối tượng (class/method)', 'Macro', 'Viết tất cả trong một REPORT'], correctIndex: 1, explanation: 'ABAP hiện đại khuyến nghị dùng class/method (ABAP OO); FORM subroutine là di sản.' },
]);

const c7 = doc('sap341-7-1-reports-selection-screen', '7.1 — Reports (classical/ALV) & Selection Screens|||7.1 — Báo cáo (classical/ALV) & Selection Screen',
  'Executable report & sự kiện (INITIALIZATION, START-OF-SELECTION); PARAMETERS & SELECT-OPTIONS tạo selection screen; báo cáo classical (WRITE) vs ALV Grid (CL_SALV_TABLE) chuẩn công nghiệp.',
  [[
    `<span class="eyebrow">SAP341 · Chapter 7 · Lesson 7.1</span>
<h2>Reports &amp; selection screens</h2>
<h3>Selection screen — ask the user for input</h3>
<p>An executable report can generate an input screen automatically from <code>PARAMETERS</code> (single fields) and <code>SELECT-OPTIONS</code> (ranges, e.g. "amount from … to …").</p>
<pre><code>REPORT z_order_list.

PARAMETERS p_cust TYPE zorders-cust_id.
SELECT-OPTIONS s_amt FOR zorders-amount.

START-OF-SELECTION.
  SELECT * FROM zorders
    WHERE cust_id = @p_cust
      AND amount IN @s_amt
    INTO TABLE @DATA(lt_orders).
</code></pre>
<p>Reports run through <strong>events</strong> in order: <code>INITIALIZATION</code> → <code>AT SELECTION-SCREEN</code> → <code>START-OF-SELECTION</code> → <code>END-OF-SELECTION</code>.</p>
<h3>Classical list vs ALV</h3>
<ul>
<li><strong>Classical list</strong> — plain output with <code>WRITE</code>; fine for quick tests.</li>
<li><strong>ALV Grid</strong> — the professional, interactive table (sort, filter, total, export to Excel). The modern way is the SALV class:</li>
</ul>
<pre><code>cl_salv_table=&gt;factory(
  IMPORTING r_salv_table = DATA(lo_alv)
  CHANGING  t_table      = lt_orders ).
lo_alv-&gt;display( ).
</code></pre>
<div class="callout"><span class="badge">Use ALV</span> For any real report, use ALV (SALV) rather than raw <code>WRITE</code> — users get sorting, filtering, totals and Excel export for free, and it looks consistent with the rest of SAP.</div>`,
    `<span class="eyebrow">SAP341 · Chương 7 · Bài 7.1</span>
<h2>Báo cáo &amp; selection screen</h2>
<h3>Selection screen — hỏi dữ liệu vào từ người dùng</h3>
<p>Một executable report có thể tự sinh màn hình nhập từ <code>PARAMETERS</code> (field đơn) và <code>SELECT-OPTIONS</code> (khoảng, vd "số tiền từ … đến …").</p>
<pre><code>REPORT z_order_list.

PARAMETERS p_cust TYPE zorders-cust_id.
SELECT-OPTIONS s_amt FOR zorders-amount.

START-OF-SELECTION.
  SELECT * FROM zorders
    WHERE cust_id = @p_cust
      AND amount IN @s_amt
    INTO TABLE @DATA(lt_orders).
</code></pre>
<p>Report chạy theo <strong>sự kiện</strong> có thứ tự: <code>INITIALIZATION</code> → <code>AT SELECTION-SCREEN</code> → <code>START-OF-SELECTION</code> → <code>END-OF-SELECTION</code>.</p>
<h3>Danh sách classical vs ALV</h3>
<ul>
<li><strong>Classical list</strong> — xuất thô bằng <code>WRITE</code>; ổn cho thử nhanh.</li>
<li><strong>ALV Grid</strong> — bảng tương tác chuyên nghiệp (sắp xếp, lọc, tính tổng, xuất Excel). Cách hiện đại là dùng class SALV:</li>
</ul>
<pre><code>cl_salv_table=&gt;factory(
  IMPORTING r_salv_table = DATA(lo_alv)
  CHANGING  t_table      = lt_orders ).
lo_alv-&gt;display( ).
</code></pre>
<div class="callout"><span class="badge">Dùng ALV</span> Với báo cáo thực tế, hãy dùng ALV (SALV) thay vì <code>WRITE</code> thô — người dùng có sẵn sắp xếp, lọc, tính tổng và xuất Excel, và giao diện đồng nhất với phần còn lại của SAP.</div>`,
  ]]);

const c7q = quiz('sap341-quiz-7', 'Quiz 7 — Reports & selection screen|||Quiz 7 — Báo cáo & selection screen', [
  { id: 'q1', question: 'Muốn cho người dùng nhập một KHOẢNG giá trị (từ … đến …) trên selection screen, dùng?', options: ['PARAMETERS', 'SELECT-OPTIONS', 'DATA', 'CONSTANTS'], correctIndex: 1, explanation: 'SELECT-OPTIONS tạo khoảng/nhiều giá trị (dùng với IN); PARAMETERS chỉ một field đơn.' },
  { id: 'q2', question: 'Sự kiện nào là nơi chính để xử lý logic sau khi người dùng chạy report?', options: ['INITIALIZATION', 'START-OF-SELECTION', 'AT SELECTION-SCREEN OUTPUT', 'LOAD-OF-PROGRAM'], correctIndex: 1, explanation: 'START-OF-SELECTION chạy sau selection screen, là nơi đọc dữ liệu và xử lý chính.' },
  { id: 'q3', question: 'Để tạo báo cáo bảng tương tác (sắp xếp, lọc, xuất Excel) nên dùng?', options: ['WRITE thô (classical list)', 'ALV / class CL_SALV_TABLE', 'MESSAGE', 'Chỉ SELECT'], correctIndex: 1, explanation: 'ALV (SALV) cho bảng tương tác chuẩn công nghiệp; WRITE chỉ là danh sách thô.' },
]);

const c8 = doc('sap341-8-1-dynpro-bapi-enhancement', '8.1 — Dynpro/Web Dynpro, BAPIs, enhancements & best practices|||8.1 — Dynpro/Web Dynpro, BAPI, enhancement & best practices',
  'Dynpro (màn hình + PBO/PAI) & Web Dynpro; BAPI — giao diện nghiệp vụ chuẩn của SAP; enhancement (BAdI, user-exit) để mở rộng mà không sửa mã gốc; best practices & Clean ABAP.',
  [[
    `<span class="eyebrow">SAP341 · Chapter 8 · Lesson 8.1</span>
<h2>Dynpro, BAPIs, enhancements &amp; best practices</h2>
<h3>Screens: Dynpro &amp; Web Dynpro</h3>
<p>A <strong>Dynpro</strong> (dynamic program) is a classic SAP GUI screen with a layout plus two logic blocks — <strong>PBO</strong> (Process Before Output, prepare the screen) and <strong>PAI</strong> (Process After Input, react to the user). <strong>Web Dynpro ABAP</strong> is the browser-based, model-driven UI framework for the same idea.</p>
<h3>BAPI — the standard business interface</h3>
<p>A <strong>BAPI</strong> (Business Application Programming Interface) is a released, stable method on a SAP business object (e.g. <code>BAPI_SALESORDER_CREATEFROMDAT2</code>). Call BAPIs to create/read business data safely — they enforce SAP's own checks — and remember to call <code>BAPI_TRANSACTION_COMMIT</code> to save.</p>
<h3>Enhancements — extend without modifying</h3>
<ul>
<li><strong>BAdI</strong> (Business Add-In) — an object-oriented enhancement spot where you plug in your own class.</li>
<li><strong>User-exit / customer-exit</strong> — older hook points SAP leaves for your code.</li>
</ul>
<p>They let you add behaviour <em>without changing SAP's original source</em>, so upgrades stay clean.</p>
<pre><code>Best practices (Clean ABAP):
  - New code: ABAP OO (classes), not FORM subroutines
  - Push data-heavy logic into Open SQL / CDS (code push-down)
  - Extend via BAdI/enhancement, never modify SAP standard code
  - Always check sy-subrc; handle exceptions
  - Descriptive names; keep methods short
</code></pre>
<div class="callout"><span class="badge">Golden rule</span> Never modify SAP standard objects directly — use enhancements (BAdI/exits). A direct modification breaks at the next upgrade and is hard to maintain; an enhancement survives it.</div>`,
    `<span class="eyebrow">SAP341 · Chương 8 · Bài 8.1</span>
<h2>Dynpro, BAPI, enhancement &amp; best practices</h2>
<h3>Màn hình: Dynpro &amp; Web Dynpro</h3>
<p><strong>Dynpro</strong> (dynamic program) là màn hình SAP GUI kinh điển, gồm bố cục cộng hai khối logic — <strong>PBO</strong> (Process Before Output, chuẩn bị màn hình) và <strong>PAI</strong> (Process After Input, phản hồi người dùng). <strong>Web Dynpro ABAP</strong> là framework UI trên trình duyệt, hướng mô hình, cho cùng ý tưởng đó.</p>
<h3>BAPI — giao diện nghiệp vụ chuẩn</h3>
<p><strong>BAPI</strong> (Business Application Programming Interface) là một method đã phát hành, ổn định trên một business object của SAP (vd <code>BAPI_SALESORDER_CREATEFROMDAT2</code>). Gọi BAPI để tạo/đọc dữ liệu nghiệp vụ an toàn — chúng thực thi đúng các kiểm tra của SAP — và nhớ gọi <code>BAPI_TRANSACTION_COMMIT</code> để lưu.</p>
<h3>Enhancement — mở rộng mà không sửa gốc</h3>
<ul>
<li><strong>BAdI</strong> (Business Add-In) — điểm mở rộng hướng đối tượng, nơi bạn cắm class của mình vào.</li>
<li><strong>User-exit / customer-exit</strong> — các điểm móc cũ hơn mà SAP để lại cho mã của bạn.</li>
</ul>
<p>Chúng cho phép thêm hành vi <em>mà không đổi mã gốc của SAP</em>, nên nâng cấp vẫn sạch.</p>
<pre><code>Best practices (Clean ABAP):
  - Mã mới: ABAP OO (class), không dùng FORM subroutine
  - Đẩy logic nặng dữ liệu vào Open SQL / CDS (code push-down)
  - Mở rộng qua BAdI/enhancement, không sửa mã chuẩn của SAP
  - Luôn kiểm sy-subrc; xử lý exception
  - Đặt tên mô tả rõ; giữ method ngắn
</code></pre>
<div class="callout"><span class="badge">Quy tắc vàng</span> Đừng sửa trực tiếp đối tượng chuẩn của SAP — hãy dùng enhancement (BAdI/exit). Sửa trực tiếp sẽ vỡ ở lần nâng cấp kế và khó bảo trì; enhancement thì sống sót qua nâng cấp.</div>`,
  ]]);

const c8q = quiz('sap341-quiz-8', 'Quiz 8 — Dynpro, BAPI & enhancement|||Quiz 8 — Dynpro, BAPI & enhancement', [
  { id: 'q1', question: 'Trong một Dynpro, khối logic nào chạy TRƯỚC khi màn hình hiển thị để chuẩn bị dữ liệu?', options: ['PAI (Process After Input)', 'PBO (Process Before Output)', 'START-OF-SELECTION', 'INITIALIZATION'], correctIndex: 1, explanation: 'PBO chạy trước khi hiện màn hình (chuẩn bị); PAI chạy sau khi người dùng nhập (phản hồi).' },
  { id: 'q2', question: 'Cách được khuyến nghị để MỞ RỘNG chức năng SAP mà không phá nâng cấp là?', options: ['Sửa trực tiếp mã chuẩn của SAP', 'Dùng enhancement như BAdI/user-exit', 'Xoá đối tượng gốc', 'Sao chép toàn bộ chương trình chuẩn'], correctIndex: 1, explanation: 'BAdI/enhancement cắm mã của bạn mà không đụng mã gốc, nên sống sót qua nâng cấp; sửa trực tiếp thì vỡ.' },
  { id: 'q3', question: 'BAPI là gì?', options: ['Một kiểu dữ liệu ABAP', 'Giao diện nghiệp vụ chuẩn, ổn định trên business object của SAP', 'Một giao dịch để xoá bảng', 'Một loại internal table'], correctIndex: 1, explanation: 'BAPI là method đã phát hành, ổn định trên business object của SAP để tạo/đọc dữ liệu nghiệp vụ an toàn.' },
]);

export default {
  semester: { code: 'FPTU_Hola8', name: 'Kỳ 8', ordinal: 10 },
  course: {
    courseCode: 'SAP341',
    slug: 'sap341-sap-application-development-with-abap',
    title: 'SAP Application Development with ABAP',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/SAP341.webp',
    shortDescription: 'Build SAP business apps in ABAP — SAP ERP & NetWeaver, ABAP Workbench, syntax, Data Dictionary, internal tables, Open SQL & CDS Views, modularization & ABAP OO, ALV reports, Dynpro, BAPIs & enhancements. Bilingual, with ABAP examples & quizzes.|||Xây ứng dụng SAP bằng ABAP — SAP ERP & NetWeaver, ABAP Workbench, cú pháp, Data Dictionary, internal table, Open SQL & CDS View, modul hoá & ABAP OO, báo cáo ALV, Dynpro, BAPI & enhancement. Song ngữ, có ví dụ & quiz.',
    description: 'Môn <strong>SAP341 — SAP Application Development with ABAP</strong> (ngành Hệ thống thông tin, kỳ 8) dạy bạn <strong>xây dựng và mở rộng ứng dụng nghiệp vụ trên nền tảng SAP</strong> bằng ngôn ngữ <strong>ABAP</strong>. Từ <strong>nền tảng &amp; Workbench</strong> (SAP ERP, NetWeaver, SE80) → <strong>cú pháp ABAP</strong> (biến, kiểu, luồng) → <strong>Data Dictionary</strong> (domain, data element, bảng) → <strong>internal table</strong> → <strong>Open SQL &amp; CDS View</strong> → <strong>modul hoá &amp; ABAP OO</strong> → <strong>báo cáo classical/ALV &amp; selection screen</strong> → <strong>Dynpro/Web Dynpro, BAPI &amp; enhancement</strong>. Bám giáo trình SAP Press, help.sap.com, Peter Moxon và openSAP; song ngữ, nhiều ví dụ ABAP và quiz mỗi chương.',
    whatYouLearn: 'Kiến trúc SAP ba lớp & ABAP Workbench (SE80/SE38/SE11/SE37/SE24); cú pháp ABAP (DATA, kiểu i/p/c/string, IF/CASE/DO/WHILE, sy-subrc); Data Dictionary (domain → data element → bảng → view); internal table (APPEND, LOOP, READ TABLE, field-symbol); Open SQL & CDS View (code push-down); modul hoá (FORM, function module, class ABAP OO); báo cáo classical & ALV (CL_SALV_TABLE) với PARAMETERS/SELECT-OPTIONS; Dynpro (PBO/PAI), Web Dynpro, BAPI, enhancement (BAdI) & Clean ABAP.',
    requirements: 'Đã học lập trình cơ bản (biến, vòng lặp, hàm) và cơ sở dữ liệu quan hệ/SQL. Nên có tài khoản truy cập một hệ thống SAP (SAP GUI/ADT) hoặc bản trial để luyện tập.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách SAP Press/Moxon, help.sap.com, openSAP, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'SAP, ABAP, lộ trình học.', lessons: [intro] },
    { title: 'Chương 1 — Nền tảng & Workbench|||Chapter 1 — Platform & Workbench', description: 'SAP ERP, NetWeaver, ABAP Workbench (SE80).', lessons: [c1, c1q] },
    { title: 'Chương 2 — Cú pháp ABAP|||Chapter 2 — ABAP syntax', description: 'Biến, kiểu, toán tử, luồng, sy-subrc.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Data Dictionary|||Chapter 3 — Data Dictionary', description: 'Domain, data element, bảng, view.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Internal table|||Chapter 4 — Internal tables', description: 'APPEND, LOOP, READ TABLE, field-symbol.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Open SQL & CDS|||Chapter 5 — Open SQL & CDS', description: 'SELECT, WHERE, JOIN, CDS View, push-down.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Modul hoá & OO|||Chapter 6 — Modularization & OO', description: 'Subroutine, function module, class ABAP OO.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Báo cáo & Selection Screen|||Chapter 7 — Reports & Selection Screen', description: 'Classical/ALV report, PARAMETERS, SELECT-OPTIONS.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Dynpro, BAPI & enhancement|||Chapter 8 — Dynpro, BAPI & enhancement', description: 'Dynpro/Web Dynpro, BAPI, BAdI, best practices.', lessons: [c8, c8q] },
  ],
};
