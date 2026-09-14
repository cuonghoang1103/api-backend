/**
 * BCP201 — Business Computing. Khối Quản trị Kinh doanh (BBA), FPTU.
 * Giáo trình tham khảo: "Microsoft Office" (Shelly Cashman series), Microsoft 365
 * docs, "Excel for Business" tài liệu, Google Workspace docs. 8 chương: hệ thống
 * thông tin & phần cứng/phần mềm; Word; Excel cơ bản; Excel nâng cao; PowerPoint;
 * cơ sở dữ liệu; cộng tác đám mây; an toàn thông tin & đạo đức số. Song ngữ.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('bcp201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), tài liệu chính thức Microsoft/Google, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">BCP201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Business Computing — information systems, Microsoft Office (Word, Excel, PowerPoint), databases and cloud collaboration — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, official resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for BCP201 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account. Reference textbook series: <em>Shelly Cashman Series — Microsoft Office</em>.</p>
<h3>🌐 Official Microsoft &amp; Google documentation</h3>
<ul>
<li><a href="https://support.microsoft.com/en-us/word" target="_blank" rel="noopener">Microsoft Word support &amp; training</a></li>
<li><a href="https://support.microsoft.com/en-us/excel" target="_blank" rel="noopener">Microsoft Excel support &amp; training</a></li>
<li><a href="https://support.microsoft.com/en-us/powerpoint" target="_blank" rel="noopener">Microsoft PowerPoint support &amp; training</a></li>
<li><a href="https://support.microsoft.com/en-us/access" target="_blank" rel="noopener">Microsoft Access support &amp; training</a></li>
<li><a href="https://workspace.google.com/learning/" target="_blank" rel="noopener">Google Workspace Learning Center</a></li>
<li><a href="https://edu.gcfglobal.org/en/" target="_blank" rel="noopener">GCFGlobal — free Office &amp; computer skills courses</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@ExcelCampus" target="_blank" rel="noopener">Excel Campus</a> — practical Excel tutorials</li>
<li><a href="https://www.youtube.com/@KevinStratvert" target="_blank" rel="noopener">Kevin Stratvert</a> — Microsoft 365 &amp; productivity walkthroughs</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.microsoft365.com/" target="_blank" rel="noopener">Microsoft 365 (Word/Excel/PowerPoint/Access online)</a></li>
<li><a href="https://workspace.google.com/" target="_blank" rel="noopener">Google Workspace (Docs/Sheets/Slides/Drive)</a></li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — information systems concepts, hardware/software categories.</li>
<li><strong>Documents &amp; spreadsheets</strong> — Word styles/mail merge, Excel formulas/functions.</li>
<li><strong>Analysis &amp; presenting</strong> — PivotTables, what-if analysis, PowerPoint design.</li>
<li><strong>Data &amp; cloud</strong> — database basics, Microsoft 365/Google Workspace collaboration, digital security.</li>
</ol></div>`,
    `<span class="eyebrow">BCP201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Tin học ứng dụng trong kinh doanh — hệ thống thông tin, bộ Microsoft Office (Word, Excel, PowerPoint), cơ sở dữ liệu và cộng tác đám mây — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, chính thức.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của BCP201 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU. Bộ sách tham khảo: <em>Shelly Cashman Series — Microsoft Office</em>.</p>
<h3>🌐 Tài liệu chính thức Microsoft &amp; Google</h3>
<ul>
<li><a href="https://support.microsoft.com/en-us/word" target="_blank" rel="noopener">Hỗ trợ &amp; đào tạo Microsoft Word</a></li>
<li><a href="https://support.microsoft.com/en-us/excel" target="_blank" rel="noopener">Hỗ trợ &amp; đào tạo Microsoft Excel</a></li>
<li><a href="https://support.microsoft.com/en-us/powerpoint" target="_blank" rel="noopener">Hỗ trợ &amp; đào tạo Microsoft PowerPoint</a></li>
<li><a href="https://support.microsoft.com/en-us/access" target="_blank" rel="noopener">Hỗ trợ &amp; đào tạo Microsoft Access</a></li>
<li><a href="https://workspace.google.com/learning/" target="_blank" rel="noopener">Google Workspace Learning Center</a></li>
<li><a href="https://edu.gcfglobal.org/en/" target="_blank" rel="noopener">GCFGlobal — khoá học Office &amp; kỹ năng máy tính miễn phí</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@ExcelCampus" target="_blank" rel="noopener">Excel Campus</a> — hướng dẫn Excel thực hành</li>
<li><a href="https://www.youtube.com/@KevinStratvert" target="_blank" rel="noopener">Kevin Stratvert</a> — Microsoft 365 &amp; năng suất làm việc</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.microsoft365.com/" target="_blank" rel="noopener">Microsoft 365 (Word/Excel/PowerPoint/Access trực tuyến)</a></li>
<li><a href="https://workspace.google.com/" target="_blank" rel="noopener">Google Workspace (Docs/Sheets/Slides/Drive)</a></li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — khái niệm hệ thống thông tin, phân loại phần cứng/phần mềm.</li>
<li><strong>Văn bản &amp; bảng tính</strong> — style/mail merge trong Word, công thức/hàm trong Excel.</li>
<li><strong>Phân tích &amp; trình bày</strong> — PivotTable, phân tích what-if, thiết kế PowerPoint.</li>
<li><strong>Dữ liệu &amp; đám mây</strong> — cơ sở dữ liệu cơ bản, cộng tác Microsoft 365/Google Workspace, an toàn thông tin.</li>
</ol></div>`,
  ]]);

const intro = doc('bcp201-0-1-overview', 'Course overview: Business Computing|||Tổng quan: Tin học ứng dụng trong kinh doanh',
  'Kỹ năng tin học kinh doanh cần thiết mỗi ngày; lộ trình: hệ thống thông tin → Word → Excel cơ bản/nâng cao → PowerPoint → cơ sở dữ liệu → đám mây → an toàn thông tin.',
  [[
    `<span class="eyebrow">BCP201 · Lesson 0.1 · Overview</span>
<h2>Business Computing</h2>
<p class="lead">This course builds the <strong>practical computer skills a business professional needs every day</strong>: understanding how information systems support a company, and using Microsoft Office (or Google Workspace) to produce professional documents, analyze data and present ideas.</p>
<h3>Why it matters</h3>
<ul>
<li>Every business function — accounting, marketing, HR, operations — runs on documents, spreadsheets and shared data.</li>
<li>Employers expect graduates to be fluent in <strong>Word, Excel, PowerPoint</strong> and basic <strong>database</strong> and <strong>cloud collaboration</strong> tools from day one.</li>
</ul>
<h3>Roadmap</h3>
<p>Information systems &amp; hardware/software → Word (documents) → Excel basics → Excel advanced (analysis) → PowerPoint (presenting) → databases → cloud collaboration → digital security &amp; ethics.</p>
<div class="callout"><span class="badge">How to study</span> Each chapter pairs a concept with a hands-on Office example — open Word/Excel/PowerPoint (desktop, Microsoft 365, or Google Workspace) alongside the lesson and try each formula/step yourself.</div>`,
    `<span class="eyebrow">BCP201 · Bài 0.1 · Tổng quan</span>
<h2>Tin học ứng dụng trong kinh doanh</h2>
<p class="lead">Môn này xây <strong>kỹ năng máy tính thực dụng mà người làm kinh doanh cần mỗi ngày</strong>: hiểu hệ thống thông tin vận hành một doanh nghiệp thế nào, và dùng Microsoft Office (hoặc Google Workspace) để tạo văn bản chuyên nghiệp, phân tích dữ liệu và trình bày ý tưởng.</p>
<h3>Vì sao quan trọng</h3>
<ul>
<li>Mọi chức năng kinh doanh — kế toán, marketing, nhân sự, vận hành — đều chạy trên văn bản, bảng tính và dữ liệu chia sẻ.</li>
<li>Nhà tuyển dụng kỳ vọng sinh viên thành thạo <strong>Word, Excel, PowerPoint</strong> và các công cụ <strong>cơ sở dữ liệu</strong>, <strong>cộng tác đám mây</strong> cơ bản ngay từ ngày đầu.</li>
</ul>
<h3>Lộ trình</h3>
<p>Hệ thống thông tin &amp; phần cứng/phần mềm → Word (văn bản) → Excel cơ bản → Excel nâng cao (phân tích) → PowerPoint (trình bày) → cơ sở dữ liệu → cộng tác đám mây → an toàn thông tin &amp; đạo đức số.</p>
<div class="callout"><span class="badge">Cách học</span> Mỗi chương ghép một khái niệm với một ví dụ thực hành trên Office — mở Word/Excel/PowerPoint (bản cài, Microsoft 365, hoặc Google Workspace) song song với bài học và tự tay thử từng công thức/bước.</div>`,
  ]]);

const c1 = doc('bcp201-1-1-information-systems', '1.1 — Information systems & hardware/software|||1.1 — Hệ thống thông tin & phần cứng/phần mềm',
  '5 thành phần hệ thống thông tin; phân loại phần cứng (input/processing/output/storage); phần mềm hệ thống vs ứng dụng; TPS/MIS/DSS.',
  [[
    `<span class="eyebrow">BCP201 · Chapter 1 · Lesson 1.1</span>
<h2>Information systems in business &amp; hardware/software</h2>
<h3>What is an information system?</h3>
<p>An <strong>information system (IS)</strong> turns raw data into useful information for decisions. It has five parts: <strong>hardware</strong>, <strong>software</strong>, <strong>data</strong>, <strong>people</strong>, and <strong>procedures</strong>. Take away any one and the system stops working.</p>
<h3>Hardware categories</h3>
<ul>
<li><strong>Input</strong> — keyboard, mouse, scanner, barcode reader.</li>
<li><strong>Processing</strong> — the CPU, plus RAM (temporary working memory).</li>
<li><strong>Output</strong> — monitor, printer.</li>
<li><strong>Storage</strong> — SSD/HDD (local), cloud storage (OneDrive, Google Drive).</li>
</ul>
<h3>Software categories</h3>
<ul>
<li><strong>System software</strong> — the operating system (Windows, macOS) that manages hardware and runs other programs.</li>
<li><strong>Application software</strong> — programs that do a job for the user: Word (documents), Excel (spreadsheets), PowerPoint (presentations), an ERP or accounting system.</li>
</ul>
<h3>Types of business information systems</h3>
<ul>
<li><strong>TPS (Transaction Processing System)</strong> — records day-to-day transactions (sales, payroll).</li>
<li><strong>MIS (Management Information System)</strong> — summarizes TPS data into reports for managers.</li>
<li><strong>DSS (Decision Support System)</strong> — models "what-if" scenarios to support non-routine decisions.</li>
</ul>
<div class="callout"><span class="badge">Why this course</span> Word, Excel and PowerPoint are the application-software tools you will use daily to feed and read these systems — this course builds fluency in them.</div>`,
    `<span class="eyebrow">BCP201 · Chương 1 · Bài 1.1</span>
<h2>Hệ thống thông tin trong doanh nghiệp &amp; phần cứng/phần mềm</h2>
<h3>Hệ thống thông tin là gì?</h3>
<p>Một <strong>hệ thống thông tin (IS)</strong> biến dữ liệu thô thành thông tin hữu ích cho ra quyết định. Nó có 5 thành phần: <strong>phần cứng</strong>, <strong>phần mềm</strong>, <strong>dữ liệu</strong>, <strong>con người</strong>, và <strong>quy trình</strong>. Thiếu một thành phần, hệ thống ngừng hoạt động.</p>
<h3>Phân loại phần cứng</h3>
<ul>
<li><strong>Đầu vào (Input)</strong> — bàn phím, chuột, máy quét, đầu đọc mã vạch.</li>
<li><strong>Xử lý (Processing)</strong> — CPU, cộng với RAM (bộ nhớ tạm khi làm việc).</li>
<li><strong>Đầu ra (Output)</strong> — màn hình, máy in.</li>
<li><strong>Lưu trữ (Storage)</strong> — SSD/HDD (cục bộ), lưu trữ đám mây (OneDrive, Google Drive).</li>
</ul>
<h3>Phân loại phần mềm</h3>
<ul>
<li><strong>Phần mềm hệ thống</strong> — hệ điều hành (Windows, macOS) quản lý phần cứng và chạy các chương trình khác.</li>
<li><strong>Phần mềm ứng dụng</strong> — chương trình phục vụ một việc cụ thể cho người dùng: Word (văn bản), Excel (bảng tính), PowerPoint (trình chiếu), hệ thống ERP hay kế toán.</li>
</ul>
<h3>Các loại hệ thống thông tin doanh nghiệp</h3>
<ul>
<li><strong>TPS (Hệ xử lý giao dịch)</strong> — ghi nhận giao dịch hằng ngày (bán hàng, lương).</li>
<li><strong>MIS (Hệ thông tin quản lý)</strong> — tổng hợp dữ liệu TPS thành báo cáo cho quản lý.</li>
<li><strong>DSS (Hệ hỗ trợ ra quyết định)</strong> — mô phỏng kịch bản "nếu...thì" để hỗ trợ quyết định không thường xuyên.</li>
</ul>
<div class="callout"><span class="badge">Vì sao học môn này</span> Word, Excel, PowerPoint chính là các phần mềm ứng dụng bạn dùng hằng ngày để nạp và đọc các hệ thống trên — môn học xây sự thành thạo với chúng.</div>`,
  ]]);

const c1q = quiz('bcp201-quiz-1', 'Quiz 1 — Information systems|||Quiz 1 — Hệ thống thông tin', [
  { id: 'q1', question: '5 thành phần của hệ thống thông tin gồm phần cứng, phần mềm, dữ liệu, con người và?', options: ['Ngân sách', 'Quy trình (thủ tục)', 'Mạng internet', 'Bảo hiểm'], correctIndex: 1, explanation: 'Năm thành phần: phần cứng, phần mềm, dữ liệu, con người, quy trình.' },
  { id: 'q2', question: 'Hệ điều hành như Windows, macOS thuộc loại phần mềm nào?', options: ['Phần mềm ứng dụng', 'Phần mềm hệ thống', 'Phần mềm kế toán', 'Phần mềm diệt virus'], correctIndex: 1, explanation: 'Hệ điều hành là phần mềm hệ thống, quản lý phần cứng và chạy phần mềm khác.' },
  { id: 'q3', question: 'Hệ thống nào tổng hợp dữ liệu giao dịch (TPS) thành báo cáo cho quản lý?', options: ['DSS', 'MIS', 'TPS', 'CPU'], correctIndex: 1, explanation: 'MIS (Management Information System) tổng hợp dữ liệu TPS thành báo cáo.' },
]);

const c2 = doc('bcp201-2-1-word-processing', '2.1 — Professional word processing|||2.1 — Xử lý văn bản chuyên nghiệp',
  'Style & template trong Word; mail merge (văn bản chính + nguồn dữ liệu); mục lục tự động, header/footer; track changes.',
  [[
    `<span class="eyebrow">BCP201 · Chapter 2 · Lesson 2.1</span>
<h2>Professional word processing (Microsoft Word)</h2>
<h3>Styles &amp; templates</h3>
<p>A <strong>style</strong> is a saved set of formatting (font, size, color, spacing) applied with one click — change the style once and every paragraph using it updates. A <strong>template</strong> (.dotx) is a reusable starting document (e.g. a report or invoice) with styles, headers and placeholder text already set up.</p>
<h3>Mail merge</h3>
<p><strong>Mail merge</strong> combines a <strong>main document</strong> (a letter template with placeholders like &laquo;Name&raquo;, &laquo;Company&raquo;) with a <strong>data source</strong> (an Excel sheet or list, one row per recipient) to generate one personalized document per row.</p>
<pre><code>Mail merge steps (Word):
 1. Mailings tab -&gt; Start Mail Merge -&gt; Letters
 2. Select Recipients -&gt; Use an Existing List (pick the Excel sheet)
 3. Insert Merge Field -&gt; place «FirstName», «Company» in the letter
 4. Preview Results -&gt; check a few records
 5. Finish &amp; Merge -&gt; Print Documents (or Edit Individual Documents)
</code></pre>
<h3>Long-document tools</h3>
<ul>
<li><strong>Table of Contents</strong> — auto-generated from Heading styles; updates with one click when headings change.</li>
<li><strong>Headers/footers, page numbers</strong> — consistent across a long report.</li>
<li><strong>Track Changes &amp; Comments</strong> — collaborate: every edit is marked and can be accepted/rejected.</li>
</ul>
<div class="callout"><span class="badge">Business use</span> Mail merge turns one letter into hundreds of personalized customer letters, invoices or certificates — a core office-productivity skill.</div>`,
    `<span class="eyebrow">BCP201 · Chương 2 · Bài 2.1</span>
<h2>Xử lý văn bản chuyên nghiệp (Microsoft Word)</h2>
<h3>Style &amp; template</h3>
<p>Một <strong>style</strong> là một bộ định dạng đã lưu (font, cỡ chữ, màu, giãn dòng) áp một lần bằng một cú nhấp — đổi style một lần thì mọi đoạn dùng nó tự cập nhật. Một <strong>template</strong> (.dotx) là văn bản mẫu tái dùng (vd báo cáo hay hoá đơn) đã có sẵn style, header và chữ giữ chỗ.</p>
<h3>Mail merge (trộn thư)</h3>
<p><strong>Mail merge</strong> kết hợp một <strong>văn bản chính</strong> (mẫu thư với chỗ giữ chỗ như &laquo;Tên&raquo;, &laquo;Công ty&raquo;) với một <strong>nguồn dữ liệu</strong> (một sheet Excel hay danh sách, mỗi dòng một người nhận) để sinh ra một văn bản cá nhân hoá cho mỗi dòng.</p>
<pre><code>Các bước mail merge (Word):
 1. Tab Mailings -&gt; Start Mail Merge -&gt; Letters
 2. Select Recipients -&gt; Use an Existing List (chọn sheet Excel)
 3. Insert Merge Field -&gt; chèn «FirstName», «Company» vào thư
 4. Preview Results -&gt; xem thử vài bản ghi
 5. Finish &amp; Merge -&gt; Print Documents (hoặc Edit Individual Documents)
</code></pre>
<h3>Công cụ cho văn bản dài</h3>
<ul>
<li><strong>Mục lục (Table of Contents)</strong> — tự sinh từ các style Heading; cập nhật bằng một cú nhấp khi tiêu đề đổi.</li>
<li><strong>Header/footer, số trang</strong> — nhất quán xuyên suốt một báo cáo dài.</li>
<li><strong>Track Changes &amp; Comments</strong> — cộng tác: mọi chỉnh sửa được đánh dấu và có thể chấp nhận/từ chối.</li>
</ul>
<div class="callout"><span class="badge">Ứng dụng kinh doanh</span> Mail merge biến một lá thư thành hàng trăm thư khách hàng, hoá đơn hay chứng chỉ cá nhân hoá — kỹ năng văn phòng cốt lõi.</div>`,
  ]]);

const c2q = quiz('bcp201-quiz-2', 'Quiz 2 — Word processing|||Quiz 2 — Xử lý văn bản', [
  { id: 'q1', question: 'Mail merge kết hợp văn bản chính với thứ gì?', options: ['Một font chữ khác', 'Nguồn dữ liệu (danh sách người nhận)', 'Một template trống', 'Bộ kiểm tra chính tả'], correctIndex: 1, explanation: 'Mail merge = văn bản chính + nguồn dữ liệu (mỗi dòng một người nhận).' },
  { id: 'q2', question: 'Mục lục (Table of Contents) trong Word tự sinh dựa vào đâu?', options: ['Các Heading style đã áp dụng', 'Số trang gõ tay', 'Track Changes', 'Kích thước file'], correctIndex: 0, explanation: 'TOC đọc các đoạn dùng Heading style để tự dựng mục lục.' },
  { id: 'q3', question: 'Track Changes dùng để làm gì?', options: ['Nén file văn bản', 'Đánh dấu chỉnh sửa để người khác chấp nhận/từ chối', 'Trộn nhiều file thành một', 'Đổi font toàn bộ tài liệu'], correctIndex: 1, explanation: 'Track Changes ghi lại mọi sửa đổi, người xem có thể Accept/Reject.' },
]);

const c3 = doc('bcp201-3-1-excel-basics', '3.1 — Spreadsheet basics|||3.1 — Bảng tính Excel cơ bản',
  'Tham chiếu tương đối/tuyệt đối; hàm SUM/AVERAGE/COUNT/IF; định dạng số & định dạng có điều kiện; sắp xếp/lọc.',
  [[
    `<span class="eyebrow">BCP201 · Chapter 3 · Lesson 3.1</span>
<h2>Spreadsheet basics (Microsoft Excel)</h2>
<h3>Cells, formulas &amp; references</h3>
<p>A worksheet is a grid of <strong>cells</strong> (column letter + row number, e.g. B3). A <strong>formula</strong> starts with <code>=</code> and can reference other cells so results update automatically when inputs change.</p>
<ul>
<li><strong>Relative reference</strong> (<code>A1</code>) — shifts when the formula is copied to another cell.</li>
<li><strong>Absolute reference</strong> (<code>$A$1</code>) — stays fixed when copied; use it to lock a tax rate or exchange rate cell.</li>
</ul>
<h3>Everyday functions</h3>
<pre><code>=SUM(B2:B10)                  total of a range
=AVERAGE(B2:B10)              mean of a range
=COUNT(B2:B10)                 how many cells hold numbers
=IF(B2&gt;=50,"Pass","Fail")     conditional result
</code></pre>
<h3>Formatting &amp; organizing data</h3>
<ul>
<li><strong>Number formats</strong> — currency, percentage, date — change how a value displays, not its underlying value.</li>
<li><strong>Conditional formatting</strong> — auto-highlight cells that meet a rule (e.g. sales below target turn red).</li>
<li><strong>Sort &amp; Filter</strong> — reorder rows or show only rows matching a criterion, without changing the underlying data.</li>
</ul>
<div class="callout"><span class="badge">Golden rule</span> Never hard-code a number you might need to change later — put it in a cell and reference it, so the whole sheet updates in one edit.</div>`,
    `<span class="eyebrow">BCP201 · Chương 3 · Bài 3.1</span>
<h2>Bảng tính cơ bản (Microsoft Excel)</h2>
<h3>Ô, công thức &amp; tham chiếu</h3>
<p>Một trang tính là lưới các <strong>ô</strong> (chữ cột + số dòng, vd B3). <strong>Công thức</strong> bắt đầu bằng <code>=</code> và có thể tham chiếu ô khác để kết quả tự cập nhật khi dữ liệu đầu vào đổi.</p>
<ul>
<li><strong>Tham chiếu tương đối</strong> (<code>A1</code>) — dịch chuyển khi sao chép công thức sang ô khác.</li>
<li><strong>Tham chiếu tuyệt đối</strong> (<code>$A$1</code>) — giữ cố định khi sao chép; dùng để khoá ô thuế suất hay tỷ giá.</li>
</ul>
<h3>Hàm dùng hằng ngày</h3>
<pre><code>=SUM(B2:B10)                  tổng một vùng
=AVERAGE(B2:B10)              trung bình một vùng
=COUNT(B2:B10)                 đếm số ô chứa số
=IF(B2&gt;=50,"Đạt","Rớt")      kết quả có điều kiện
</code></pre>
<h3>Định dạng &amp; tổ chức dữ liệu</h3>
<ul>
<li><strong>Định dạng số</strong> — tiền tệ, phần trăm, ngày tháng — chỉ đổi cách hiển thị, không đổi giá trị gốc.</li>
<li><strong>Định dạng có điều kiện</strong> — tự tô màu ô thoả điều kiện (vd doanh số dưới chỉ tiêu chuyển đỏ).</li>
<li><strong>Sắp xếp &amp; Lọc</strong> — sắp lại dòng hoặc chỉ hiện dòng thoả tiêu chí, không đổi dữ liệu gốc.</li>
</ul>
<div class="callout"><span class="badge">Nguyên tắc vàng</span> Đừng gõ cứng một con số có thể phải đổi sau — đặt nó vào một ô và tham chiếu tới, để cả trang tính chỉ cần sửa một chỗ.</div>`,
  ]]);

const c3q = quiz('bcp201-quiz-3', 'Quiz 3 — Excel basics|||Quiz 3 — Excel cơ bản', [
  { id: 'q1', question: 'Tham chiếu nào giữ cố định khi sao chép công thức sang ô khác?', options: ['A1', '$A$1', 'A$1B', 'Không loại nào'], correctIndex: 1, explanation: 'Ký hiệu $ trước cột/dòng tạo tham chiếu tuyệt đối, giữ nguyên khi sao chép.' },
  { id: 'q2', question: 'Hàm nào đếm số ô chứa giá trị số trong một vùng?', options: ['SUM', 'AVERAGE', 'COUNT', 'IF'], correctIndex: 2, explanation: 'COUNT đếm số ô chứa số trong vùng được chọn.' },
  { id: 'q3', question: 'Định dạng có điều kiện (Conditional Formatting) dùng để?', options: ['Đổi giá trị ô', 'Tự động tô màu/nổi bật ô thoả điều kiện', 'Sắp xếp lại dữ liệu', 'Khoá công thức'], correctIndex: 1, explanation: 'Nó chỉ đổi hiển thị (màu, biểu tượng...) của ô thoả một quy tắc, không đổi giá trị.' },
]);

const c4 = doc('bcp201-4-1-excel-advanced', '4.1 — Advanced Excel: lookups, PivotTable & what-if|||4.1 — Excel nâng cao: VLOOKUP, PivotTable & what-if',
  'VLOOKUP/XLOOKUP; PivotTable tổng hợp dữ liệu; chọn loại biểu đồ; Goal Seek/Data Table/Scenario Manager.',
  [[
    `<span class="eyebrow">BCP201 · Chapter 4 · Lesson 4.1</span>
<h2>Advanced Excel: lookups, PivotTables &amp; what-if analysis</h2>
<h3>VLOOKUP &amp; XLOOKUP</h3>
<p><strong>VLOOKUP</strong> finds a value in the first column of a table and returns a value from another column in the same row — the classic way to pull a price or a name from a lookup table.</p>
<pre><code>=VLOOKUP(A2, PriceList!A:C, 3, FALSE)
  A2            value to find (e.g. product code)
  PriceList!A:C table to search (product code in column A)
  3             return the value from the 3rd column
  FALSE         exact match only
</code></pre>
<p><strong>XLOOKUP</strong> (newer) does the same job without the "count columns from the left" limitation.</p>
<h3>PivotTable</h3>
<p>A <strong>PivotTable</strong> summarizes hundreds or thousands of rows into a compact table — drag a field to Rows (e.g. Region), a field to Columns (e.g. Quarter), and a field to Values (e.g. Sum of Sales) to instantly see totals by category, no formulas needed.</p>
<h3>Charts</h3>
<p>Pick the chart that matches the message: a <strong>column/bar chart</strong> compares categories, a <strong>line chart</strong> shows a trend over time, a <strong>pie chart</strong> shows parts of a whole (best with 5 or fewer slices).</p>
<h3>What-if analysis</h3>
<ul>
<li><strong>Goal Seek</strong> — "what input do I need to hit this target output?" (e.g. what price hits a $10,000 profit target).</li>
<li><strong>Data Table</strong> — recalculates a formula across a range of possible input values at once.</li>
<li><strong>Scenario Manager</strong> — saves and compares several named sets of input assumptions (best case / worst case / expected).</li>
</ul>
<div class="callout"><span class="badge">Business use</span> PivotTables + VLOOKUP turn raw transaction exports into the summary reports managers actually read.</div>`,
    `<span class="eyebrow">BCP201 · Chương 4 · Bài 4.1</span>
<h2>Excel nâng cao: hàm tra cứu, PivotTable &amp; phân tích what-if</h2>
<h3>VLOOKUP &amp; XLOOKUP</h3>
<p><strong>VLOOKUP</strong> tìm một giá trị ở cột đầu tiên của bảng và trả về giá trị ở cột khác trên cùng dòng — cách kinh điển để lấy giá hoặc tên từ một bảng tra cứu.</p>
<pre><code>=VLOOKUP(A2, PriceList!A:C, 3, FALSE)
  A2            giá trị cần tìm (vd mã sản phẩm)
  PriceList!A:C bảng cần tìm (mã sản phẩm ở cột A)
  3             trả về giá trị ở cột thứ 3
  FALSE         chỉ khớp chính xác (exact match)
</code></pre>
<p><strong>XLOOKUP</strong> (mới hơn) làm việc tương tự mà không bị giới hạn "đếm cột từ trái sang".</p>
<h3>PivotTable</h3>
<p>Một <strong>PivotTable</strong> tổng hợp hàng trăm, hàng nghìn dòng thành một bảng gọn — kéo một trường vào Rows (vd Khu vực), một trường vào Columns (vd Quý), và một trường vào Values (vd Tổng doanh số) để thấy ngay tổng theo từng nhóm, không cần viết công thức.</p>
<h3>Biểu đồ</h3>
<p>Chọn loại biểu đồ khớp với thông điệp: <strong>biểu đồ cột</strong> so sánh các nhóm, <strong>biểu đồ đường</strong> thể hiện xu hướng theo thời gian, <strong>biểu đồ tròn</strong> thể hiện tỉ lệ các phần trong tổng thể (tốt nhất khi ≤5 phần).</p>
<h3>Phân tích what-if</h3>
<ul>
<li><strong>Goal Seek</strong> — "cần đầu vào bao nhiêu để đạt kết quả mục tiêu này?" (vd giá bán nào để đạt lợi nhuận 10.000$).</li>
<li><strong>Data Table</strong> — tính lại một công thức trên cả một dải giá trị đầu vào khả dĩ cùng lúc.</li>
<li><strong>Scenario Manager</strong> — lưu và so sánh nhiều bộ giả định đầu vào có tên (tốt nhất / xấu nhất / kỳ vọng).</li>
</ul>
<div class="callout"><span class="badge">Ứng dụng kinh doanh</span> PivotTable + VLOOKUP biến dữ liệu giao dịch thô thành các báo cáo tổng hợp mà quản lý thực sự đọc.</div>`,
  ]]);

const c4q = quiz('bcp201-quiz-4', 'Quiz 4 — Advanced Excel|||Quiz 4 — Excel nâng cao', [
  { id: 'q1', question: 'Trong VLOOKUP, tham số cuối là FALSE nghĩa là gì?', options: ['Bỏ qua ô trống', 'Chỉ khớp chính xác (exact match)', 'Sắp xếp lại bảng', 'Tìm từ phải sang trái'], correctIndex: 1, explanation: 'FALSE (hoặc 0) ép VLOOKUP chỉ trả kết quả khi khớp chính xác.' },
  { id: 'q2', question: 'Công cụ nào tổng hợp hàng nghìn dòng dữ liệu thành bảng tóm tắt bằng kéo-thả?', options: ['PivotTable', 'Track Changes', 'Mail Merge', 'Slide Master'], correctIndex: 0, explanation: 'PivotTable tổng hợp dữ liệu theo Rows/Columns/Values không cần công thức.' },
  { id: 'q3', question: 'Công cụ nào trả lời câu hỏi "cần đầu vào bao nhiêu để đạt một kết quả mục tiêu"?', options: ['Scenario Manager', 'Goal Seek', 'Conditional Formatting', 'VLOOKUP'], correctIndex: 1, explanation: 'Goal Seek dò ngược đầu vào cần thiết để công thức ra đúng kết quả mục tiêu.' },
]);

const c5 = doc('bcp201-5-1-powerpoint', '5.1 — Professional presentations|||5.1 — Trình chiếu chuyên nghiệp',
  'Nguyên tắc thiết kế slide (quy tắc 6x6), Slide Master & theme, dùng transition/animation tiết chế, Presenter View.',
  [[
    `<span class="eyebrow">BCP201 · Chapter 5 · Lesson 5.1</span>
<h2>Professional presentations (Microsoft PowerPoint)</h2>
<h3>Design principles</h3>
<ul>
<li><strong>One idea per slide</strong> — a slide supports what you say, it does not replace it.</li>
<li><strong>6x6 guideline</strong> — aim for no more than about 6 bullet points per slide, 6 words per bullet; put detail in your speech, not the slide.</li>
<li><strong>Visual hierarchy</strong> — consistent title size/position, one accent color for emphasis, plenty of white space.</li>
</ul>
<h3>Slide Master &amp; themes</h3>
<p>The <strong>Slide Master</strong> defines fonts, colors and layout once for the whole deck — edit it and every slide using that layout updates, instead of reformatting slide by slide.</p>
<h3>Transitions &amp; animation</h3>
<p>Use <strong>transitions</strong> (between slides) and <strong>animations</strong> (within a slide) sparingly, and only when they clarify an idea (e.g. revealing one bullet at a time) — not as decoration, which distracts from the message.</p>
<h3>Delivering the presentation</h3>
<ul>
<li><strong>Presenter View</strong> — shows your notes and the next slide on your screen while the audience sees only the current slide.</li>
<li><strong>Rehearse Timings</strong> — records how long each slide actually takes so you can trim before presenting live.</li>
</ul>
<div class="callout"><span class="badge">Business use</span> A pitch deck, a quarterly business review, a training session — all live or die on slides that support, rather than replace, the speaker.</div>`,
    `<span class="eyebrow">BCP201 · Chương 5 · Bài 5.1</span>
<h2>Trình chiếu chuyên nghiệp (Microsoft PowerPoint)</h2>
<h3>Nguyên tắc thiết kế</h3>
<ul>
<li><strong>Một ý mỗi slide</strong> — slide hỗ trợ điều bạn nói, không thay thế nó.</li>
<li><strong>Quy tắc 6x6</strong> — tối đa khoảng 6 gạch đầu dòng/slide, 6 từ/gạch đầu dòng; chi tiết để trong lời nói, không nhồi vào slide.</li>
<li><strong>Phân cấp thị giác</strong> — cỡ/vị trí tiêu đề nhất quán, một màu nhấn để làm nổi bật, nhiều khoảng trắng.</li>
</ul>
<h3>Slide Master &amp; theme</h3>
<p><strong>Slide Master</strong> đặt font, màu và bố cục một lần cho cả bài — sửa nó thì mọi slide dùng layout đó tự cập nhật, thay vì phải chỉnh từng slide.</p>
<h3>Transition &amp; animation</h3>
<p>Dùng <strong>transition</strong> (giữa các slide) và <strong>animation</strong> (trong một slide) tiết chế, chỉ khi nó làm rõ ý (vd hiện từng gạch đầu dòng một) — không phải để trang trí, vì sẽ làm sao nhãng thông điệp.</p>
<h3>Trình bày</h3>
<ul>
<li><strong>Presenter View</strong> — hiện ghi chú và slide kế tiếp trên màn hình của bạn, trong khi khán giả chỉ thấy slide hiện tại.</li>
<li><strong>Rehearse Timings</strong> — ghi lại thời gian thực tế mỗi slide để bạn cắt bớt trước khi trình bày thật.</li>
</ul>
<div class="callout"><span class="badge">Ứng dụng kinh doanh</span> Một bài pitch, một báo cáo quý, một buổi đào tạo — đều sống hay chết nhờ slide hỗ trợ chứ không thay thế người thuyết trình.</div>`,
  ]]);

const c5q = quiz('bcp201-quiz-5', 'Quiz 5 — PowerPoint|||Quiz 5 — PowerPoint', [
  { id: 'q1', question: 'Slide Master dùng để làm gì?', options: ['Ghi âm bài thuyết trình', 'Đặt font/màu/bố cục một lần, áp dụng cho mọi slide theo layout đó', 'Kiểm tra chính tả', 'Xuất file PDF'], correctIndex: 1, explanation: 'Slide Master định nghĩa định dạng chung; sửa nó cập nhật mọi slide liên quan.' },
  { id: 'q2', question: 'Quy tắc 6x6 trong thiết kế slide gợi ý điều gì?', options: ['Tối đa 6 slide mỗi bài', 'Tối đa khoảng 6 gạch đầu dòng/slide và 6 từ/gạch đầu dòng', '6 màu trên mỗi slide', '6 phông chữ khác nhau'], correctIndex: 1, explanation: 'Quy tắc 6x6 giữ slide gọn: ít bullet, ít từ, để lời nói mang chi tiết.' },
  { id: 'q3', question: 'Presenter View giúp gì khi trình bày trực tiếp?', options: ['Ẩn toàn bộ slide khỏi khán giả', 'Hiện ghi chú + slide kế tiếp cho người thuyết trình, khán giả chỉ thấy slide hiện tại', 'Tự động dịch slide', 'Xoá animation'], correctIndex: 1, explanation: 'Presenter View tách màn hình diễn giả (có ghi chú) khỏi màn hình khán giả.' },
]);

const c6 = doc('bcp201-6-1-database-basics', '6.1 — Database basics|||6.1 — Cơ sở dữ liệu cơ bản',
  'Bảng/trường/bản ghi, khoá chính; quan hệ một-nhiều & khoá ngoại; truy vấn (query); form & report.',
  [[
    `<span class="eyebrow">BCP201 · Chapter 6 · Lesson 6.1</span>
<h2>Database basics (tables, queries, forms &amp; reports)</h2>
<h3>Tables, fields &amp; records</h3>
<p>A <strong>database</strong> (e.g. Microsoft Access) organizes data in <strong>tables</strong>: each column is a <strong>field</strong> (e.g. CustomerName), each row is a <strong>record</strong> (one customer). A <strong>primary key</strong> (e.g. CustomerID) uniquely identifies each record — no two records may share one.</p>
<h3>Relationships</h3>
<p>Splitting data into related tables avoids repeating the same customer name on every order. A <strong>one-to-many relationship</strong> links one Customer to many Orders through a shared key (CustomerID appears once in Customers, and again as a <strong>foreign key</strong> in Orders).</p>
<h3>Queries</h3>
<p>A <strong>query</strong> asks a question of the data — "which orders were placed after May, sorted by amount?" — instead of scrolling through every record by hand. It can also join data from several related tables into one result.</p>
<h3>Forms &amp; reports</h3>
<ul>
<li><strong>Forms</strong> — a friendly on-screen layout for entering or editing one record at a time (used by data-entry staff).</li>
<li><strong>Reports</strong> — a formatted, printable summary of query results (used by management).</li>
</ul>
<div class="callout"><span class="badge">Why not just Excel?</span> A spreadsheet duplicates data and gets messy at scale; a database with related tables and a primary key keeps each fact in exactly one place.</div>`,
    `<span class="eyebrow">BCP201 · Chương 6 · Bài 6.1</span>
<h2>Cơ sở dữ liệu cơ bản (bảng, truy vấn, form &amp; report)</h2>
<h3>Bảng, trường &amp; bản ghi</h3>
<p>Một <strong>cơ sở dữ liệu</strong> (vd Microsoft Access) tổ chức dữ liệu thành <strong>bảng</strong>: mỗi cột là một <strong>trường</strong> (vd TenKhachHang), mỗi dòng là một <strong>bản ghi</strong> (một khách hàng). <strong>Khoá chính</strong> (vd MaKhachHang) định danh duy nhất mỗi bản ghi — không hai bản ghi nào được trùng khoá chính.</p>
<h3>Quan hệ</h3>
<p>Tách dữ liệu thành các bảng có quan hệ tránh việc lặp lại tên khách hàng ở mọi đơn hàng. <strong>Quan hệ một-nhiều</strong> nối một Khách hàng với nhiều Đơn hàng qua một khoá chung (MaKhachHang xuất hiện một lần ở bảng Khách hàng, và lại xuất hiện làm <strong>khoá ngoại</strong> ở bảng Đơn hàng).</p>
<h3>Truy vấn (Query)</h3>
<p>Một <strong>truy vấn</strong> đặt câu hỏi cho dữ liệu — "những đơn hàng nào đặt sau tháng 5, sắp theo số tiền?" — thay vì lướt tay qua từng bản ghi. Nó cũng có thể ghép dữ liệu từ nhiều bảng có quan hệ thành một kết quả duy nhất.</p>
<h3>Form &amp; Report</h3>
<ul>
<li><strong>Form</strong> — giao diện thân thiện để nhập/sửa từng bản ghi một (dùng bởi nhân viên nhập liệu).</li>
<li><strong>Report</strong> — bản tóm tắt kết quả truy vấn đã định dạng, in được (dùng bởi quản lý).</li>
</ul>
<div class="callout"><span class="badge">Vì sao không chỉ dùng Excel?</span> Bảng tính lặp dữ liệu và rối khi dữ liệu lớn; cơ sở dữ liệu với các bảng có quan hệ và khoá chính giữ mỗi thông tin đúng một nơi duy nhất.</div>`,
  ]]);

const c6q = quiz('bcp201-quiz-6', 'Quiz 6 — Databases|||Quiz 6 — Cơ sở dữ liệu', [
  { id: 'q1', question: 'Trong một bảng dữ liệu, mỗi dòng gọi là gì?', options: ['Trường (field)', 'Bản ghi (record)', 'Truy vấn (query)', 'Khoá chính'], correctIndex: 1, explanation: 'Mỗi dòng trong bảng là một bản ghi (record), mỗi cột là một trường (field).' },
  { id: 'q2', question: 'Khoá chính (primary key) dùng để làm gì?', options: ['Định danh duy nhất mỗi bản ghi, không được trùng', 'Sắp xếp bảng theo bảng chữ cái', 'Định dạng số tiền', 'Tạo mục lục tự động'], correctIndex: 0, explanation: 'Khoá chính đảm bảo mỗi bản ghi có một định danh duy nhất.' },
  { id: 'q3', question: 'Quan hệ một-nhiều giữa hai bảng được nối qua đâu?', options: ['Một style dùng chung', 'Khoá ngoại (foreign key) tham chiếu khoá chính bảng kia', 'Một PivotTable', 'Một template chung'], correctIndex: 1, explanation: 'Khoá ngoại ở bảng "nhiều" trỏ tới khoá chính ở bảng "một".' },
]);

const c7 = doc('bcp201-7-1-cloud-collaboration', '7.1 — Cloud collaboration|||7.1 — Cộng tác & đám mây',
  'Lưu trữ đám mây (OneDrive/Google Drive), đồng biên soạn thời gian thực, quyền chia sẻ (view/comment/edit), version history.',
  [[
    `<span class="eyebrow">BCP201 · Chapter 7 · Lesson 7.1</span>
<h2>Cloud collaboration (Microsoft 365 &amp; Google Workspace)</h2>
<h3>Cloud storage vs local files</h3>
<p>Saving to <strong>OneDrive</strong> or <strong>Google Drive</strong> instead of only a local disk means the file is backed up automatically, reachable from any device, and shareable with a link instead of an email attachment.</p>
<h3>Real-time co-authoring</h3>
<p>Word/Excel/PowerPoint on Microsoft 365, and Docs/Sheets/Slides on Google Workspace, let several people edit the <strong>same file at the same time</strong> — each person's cursor and changes appear live, with no more "final_v3_FINAL.docx" email chains.</p>
<h3>Sharing &amp; permissions</h3>
<ul>
<li><strong>View only</strong> — read the file, no edits.</li>
<li><strong>Comment</strong> — suggest changes without altering the content directly.</li>
<li><strong>Edit</strong> — full read/write access.</li>
</ul>
<p><strong>Version history</strong> keeps every earlier save, so an accidental deletion or a bad edit can always be rolled back.</p>
<h3>Microsoft 365 vs Google Workspace</h3>
<p>Both suites cover the same core jobs — documents, spreadsheets, slides, cloud drive, email/calendar — with Microsoft favoring desktop-app power (Word/Excel/PowerPoint) and Google favoring browser-first simplicity (Docs/Sheets/Slides); most companies standardize on one.</p>
<div class="callout"><span class="badge">Business use</span> A shared budget spreadsheet edited by finance and department heads at once, with full history, is the everyday face of cloud collaboration.</div>`,
    `<span class="eyebrow">BCP201 · Chương 7 · Bài 7.1</span>
<h2>Cộng tác đám mây (Microsoft 365 &amp; Google Workspace)</h2>
<h3>Lưu trữ đám mây so với file cục bộ</h3>
<p>Lưu vào <strong>OneDrive</strong> hay <strong>Google Drive</strong> thay vì chỉ lưu ổ đĩa máy có nghĩa file được sao lưu tự động, truy cập được từ mọi thiết bị, và chia sẻ bằng đường link thay vì đính kèm email.</p>
<h3>Đồng biên soạn thời gian thực</h3>
<p>Word/Excel/PowerPoint trên Microsoft 365, và Docs/Sheets/Slides trên Google Workspace, cho phép nhiều người sửa <strong>cùng một file cùng lúc</strong> — con trỏ và thay đổi của mỗi người hiện trực tiếp, không còn chuỗi email "final_v3_FINAL.docx".</p>
<h3>Chia sẻ &amp; phân quyền</h3>
<ul>
<li><strong>Chỉ xem (View)</strong> — đọc file, không sửa được.</li>
<li><strong>Bình luận (Comment)</strong> — đề xuất sửa mà không đổi trực tiếp nội dung.</li>
<li><strong>Chỉnh sửa (Edit)</strong> — toàn quyền đọc/ghi.</li>
</ul>
<p><strong>Lịch sử phiên bản (Version history)</strong> giữ lại mọi lần lưu trước đó, nên một lần xoá nhầm hay sửa sai luôn có thể khôi phục.</p>
<h3>Microsoft 365 so với Google Workspace</h3>
<p>Cả hai bộ đều phủ cùng các việc cốt lõi — văn bản, bảng tính, slide, ổ đĩa đám mây, email/lịch — Microsoft thiên về sức mạnh ứng dụng cài đặt (Word/Excel/PowerPoint), Google thiên về sự đơn giản trên trình duyệt (Docs/Sheets/Slides); hầu hết công ty chọn chuẩn hoá theo một bộ.</p>
<div class="callout"><span class="badge">Ứng dụng kinh doanh</span> Một bảng ngân sách được tài chính và trưởng phòng cùng sửa một lúc, có đầy đủ lịch sử, là bộ mặt hằng ngày của cộng tác đám mây.</div>`,
  ]]);

const c7q = quiz('bcp201-quiz-7', 'Quiz 7 — Cloud collaboration|||Quiz 7 — Cộng tác đám mây', [
  { id: 'q1', question: 'Đồng biên soạn thời gian thực (real-time co-authoring) nghĩa là gì?', options: ['Chỉ một người sửa file mỗi lần', 'Nhiều người sửa cùng một file cùng lúc, thấy thay đổi trực tiếp', 'File tự động dịch ngôn ngữ', 'File được nén nhỏ hơn'], correctIndex: 1, explanation: 'Co-authoring cho phép nhiều người sửa đồng thời và thấy thay đổi của nhau ngay.' },
  { id: 'q2', question: 'Quyền chia sẻ nào chỉ cho phép đề xuất sửa mà không đổi trực tiếp nội dung?', options: ['View', 'Edit', 'Comment', 'Owner'], correctIndex: 2, explanation: 'Comment cho phép góp ý/đề xuất mà không sửa trực tiếp vào nội dung gốc.' },
  { id: 'q3', question: 'Version history (lịch sử phiên bản) dùng để làm gì?', options: ['Tăng tốc độ mở file', 'Khôi phục lại phiên bản cũ khi bị sửa/xoá nhầm', 'Mã hoá file', 'Tự động sao lưu ra email'], correctIndex: 1, explanation: 'Version history lưu các lần lưu trước, cho phép quay lại một phiên bản cũ.' },
]);

const c8 = doc('bcp201-8-1-security-ethics', '8.1 — Personal information security & digital ethics|||8.1 — An toàn thông tin cá nhân & đạo đức số',
  'Vệ sinh mật khẩu & 2FA; nhận diện phishing; bản quyền/đạo văn/quyền riêng tư dữ liệu; năng suất làm việc cá nhân.',
  [[
    `<span class="eyebrow">BCP201 · Chapter 8 · Lesson 8.1</span>
<h2>Personal information security, digital ethics &amp; productivity</h2>
<h3>Account &amp; password hygiene</h3>
<ul>
<li>Use a <strong>unique, long password</strong> per account (a password manager makes this practical) — reused passwords mean one breach compromises every account.</li>
<li>Turn on <strong>two-factor authentication (2FA)</strong> — a stolen password alone is no longer enough to log in.</li>
</ul>
<h3>Phishing awareness</h3>
<p><strong>Phishing</strong> emails/messages impersonate a trusted sender (a bank, IT support, a boss) to trick you into clicking a link or revealing credentials. Warning signs: urgency ("act now"), a mismatched sender address, and a request for a password or payment.</p>
<h3>Data privacy &amp; digital ethics</h3>
<ul>
<li><strong>Copyright</strong> — do not copy text, images or code into business documents without permission or a proper license/citation.</li>
<li><strong>Plagiarism</strong> — presenting someone else's work as your own, in a report or a slide deck, is an academic and professional violation.</li>
<li><strong>Data privacy</strong> — customer and employee data should only be accessed and shared on a need-to-know basis.</li>
</ul>
<h3>Personal productivity</h3>
<p>A shared <strong>calendar</strong>, a <strong>task list</strong> (Microsoft To Do, Google Tasks) and consistent <strong>file naming/folder structure</strong> are small habits that scale into real time saved across a whole team.</p>
<div class="callout"><span class="badge">Closing the loop</span> The tools from this course — Word, Excel, PowerPoint, databases, cloud collaboration — are only as safe and effective as the habits of the person using them.</div>`,
    `<span class="eyebrow">BCP201 · Chương 8 · Bài 8.1</span>
<h2>An toàn thông tin cá nhân, đạo đức số &amp; năng suất</h2>
<h3>Vệ sinh tài khoản &amp; mật khẩu</h3>
<ul>
<li>Dùng <strong>mật khẩu dài, riêng biệt</strong> cho mỗi tài khoản (một trình quản lý mật khẩu giúp việc này khả thi) — dùng lại mật khẩu nghĩa là một lần lộ sẽ hại mọi tài khoản.</li>
<li>Bật <strong>xác thực hai lớp (2FA)</strong> — mật khẩu bị đánh cắp một mình sẽ không đủ để đăng nhập.</li>
</ul>
<h3>Nhận diện phishing</h3>
<p>Email/tin nhắn <strong>phishing (lừa đảo)</strong> giả danh người gửi đáng tin (ngân hàng, IT, sếp) để dụ bạn bấm link hoặc lộ thông tin đăng nhập. Dấu hiệu cảnh báo: sự khẩn cấp ("hành động ngay"), địa chỉ gửi không khớp, và yêu cầu mật khẩu hay thanh toán.</p>
<h3>Quyền riêng tư dữ liệu &amp; đạo đức số</h3>
<ul>
<li><strong>Bản quyền</strong> — không sao chép văn bản, hình ảnh hay mã nguồn vào tài liệu kinh doanh khi chưa được phép hoặc chưa trích dẫn/xin giấy phép đúng cách.</li>
<li><strong>Đạo văn (plagiarism)</strong> — trình bày lại nội dung của người khác như của mình, trong báo cáo hay slide, là vi phạm học thuật và nghề nghiệp.</li>
<li><strong>Quyền riêng tư dữ liệu</strong> — dữ liệu khách hàng và nhân viên chỉ nên được truy cập và chia sẻ theo nguyên tắc cần biết mới được biết.</li>
</ul>
<h3>Năng suất cá nhân</h3>
<p>Một <strong>lịch dùng chung</strong>, một <strong>danh sách việc cần làm</strong> (Microsoft To Do, Google Tasks) và <strong>cách đặt tên file/cấu trúc thư mục</strong> nhất quán là những thói quen nhỏ nhưng nhân lên thành thời gian tiết kiệm thật sự cho cả một nhóm.</p>
<div class="callout"><span class="badge">Khép lại vòng lặp</span> Các công cụ trong môn này — Word, Excel, PowerPoint, cơ sở dữ liệu, cộng tác đám mây — chỉ an toàn và hiệu quả bằng đúng thói quen của người dùng chúng.</div>`,
  ]]);

const c8q = quiz('bcp201-quiz-8', 'Quiz 8 — Security & ethics|||Quiz 8 — An toàn & đạo đức số', [
  { id: 'q1', question: 'Bật xác thực hai lớp (2FA) giúp gì?', options: ['File tải nhanh hơn', 'Mật khẩu bị lộ vẫn không đủ để đăng nhập', 'Tự động sao lưu dữ liệu', 'Tăng dung lượng lưu trữ'], correctIndex: 1, explanation: '2FA yêu cầu thêm một yếu tố xác thực, nên chỉ có mật khẩu là chưa đủ đăng nhập.' },
  { id: 'q2', question: 'Đâu là dấu hiệu cảnh báo của một email phishing?', options: ['Được gửi vào giờ hành chính', 'Yêu cầu khẩn cấp, địa chỉ gửi không khớp, đòi mật khẩu/thanh toán', 'Có chữ ký công ty', 'Viết bằng tiếng Việt'], correctIndex: 1, explanation: 'Phishing thường tạo áp lực khẩn cấp và giả danh người gửi để đòi thông tin nhạy cảm.' },
  { id: 'q3', question: 'Trình bày lại nội dung của người khác như của mình mà không ghi nguồn gọi là gì?', options: ['Mail merge', 'Đạo văn (plagiarism)', 'Version history', 'Conditional formatting'], correctIndex: 1, explanation: 'Đạo văn là nhận nội dung/ý tưởng người khác làm của mình mà không trích dẫn.' },
]);

export default {
  semester: { code: 'KY2', name: 'Kỳ 2', ordinal: 2 },
  course: {
    courseCode: 'BCP201',
    slug: 'bcp201-business-computing',
    title: 'Business Computing',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/BCP201.webp',
    shortDescription: 'Business computing for BBA students — information systems & hardware/software, Word (mail merge, styles), Excel (formulas, VLOOKUP, PivotTable, what-if), PowerPoint, databases, cloud collaboration & digital security. Bilingual, with quizzes.|||Tin học ứng dụng kinh doanh cho khối QTKD — hệ thống thông tin & phần cứng/phần mềm, Word (mail merge, style), Excel (công thức, VLOOKUP, PivotTable, what-if), PowerPoint, cơ sở dữ liệu, cộng tác đám mây & an toàn thông tin. Song ngữ, có quiz.',
    description: 'Môn <strong>BCP201 — Business Computing</strong> (kỳ 2, khối Quản trị Kinh doanh) xây kỹ năng tin học ứng dụng kinh doanh: <strong>hệ thống thông tin</strong> &amp; phần cứng/phần mềm → <strong>Word</strong> (mail merge, style, template) → <strong>Excel cơ bản</strong> (công thức, hàm, định dạng) → <strong>Excel nâng cao</strong> (VLOOKUP, PivotTable, biểu đồ, what-if) → <strong>PowerPoint</strong> chuyên nghiệp → <strong>cơ sở dữ liệu</strong> cơ bản → <strong>cộng tác đám mây</strong> (Microsoft 365, Google Workspace) → <strong>an toàn thông tin &amp; đạo đức số</strong>. Song ngữ, có ví dụ thực hành và quiz mỗi chương.',
    whatYouLearn: 'Thành phần hệ thống thông tin, phần cứng/phần mềm; Word: style, template, mail merge, mục lục, track changes; Excel: tham chiếu tương đối/tuyệt đối, hàm SUM/AVERAGE/IF, định dạng có điều kiện, VLOOKUP/XLOOKUP, PivotTable, biểu đồ, Goal Seek/Scenario Manager; PowerPoint: Slide Master, nguyên tắc 6x6, Presenter View; cơ sở dữ liệu: bảng/trường/bản ghi, khoá chính/khoá ngoại, truy vấn, form/report; cộng tác Microsoft 365 & Google Workspace: đồng biên soạn, quyền chia sẻ, version history; an toàn mật khẩu/2FA, nhận diện phishing, đạo đức số.',
    requirements: 'Biết dùng máy tính cơ bản (bàn phím, chuột, quản lý file). Nên cài Microsoft Office hoặc dùng Microsoft 365/Google Workspace trên trình duyệt để thực hành theo bài.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, tài liệu chính thức Microsoft/Google, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Tin học ứng dụng kinh doanh, lộ trình môn học.', lessons: [intro] },
    { title: 'Chương 1 — Hệ thống thông tin & phần cứng/phần mềm|||Chapter 1 — Information systems & hardware/software', description: '5 thành phần IS, phần cứng, phần mềm, TPS/MIS/DSS.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Xử lý văn bản chuyên nghiệp|||Chapter 2 — Professional word processing', description: 'Style, template, mail merge, mục lục, track changes.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Bảng tính Excel cơ bản|||Chapter 3 — Excel basics', description: 'Tham chiếu, hàm cơ bản, định dạng, sắp xếp/lọc.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Excel nâng cao|||Chapter 4 — Advanced Excel', description: 'VLOOKUP/XLOOKUP, PivotTable, biểu đồ, what-if.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Trình chiếu chuyên nghiệp|||Chapter 5 — Professional presentations', description: 'Nguyên tắc thiết kế, Slide Master, Presenter View.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Cơ sở dữ liệu cơ bản|||Chapter 6 — Database basics', description: 'Bảng, khoá chính/ngoại, truy vấn, form/report.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Cộng tác & đám mây|||Chapter 7 — Cloud collaboration', description: 'OneDrive/Drive, đồng biên soạn, chia sẻ, version history.', lessons: [c7, c7q] },
    { title: 'Chương 8 — An toàn thông tin & đạo đức số|||Chapter 8 — Digital security & ethics', description: 'Mật khẩu/2FA, phishing, bản quyền/đạo văn, năng suất.', lessons: [c8, c8q] },
  ],
};
