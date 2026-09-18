/**
 * CSI106 — Introduction to Computer Science. Giáo trình FLM (sylID 11585). Sách
 * CHÍNH = Forouzan, "Foundations of Computer Science" (Cengage, 4th, 2017),
 * ch1→ch16. Khung 12 chương THẬT + 1 chương AI nhập môn (Additional "AI For
 * Everyone" — Andrew Ng): Computer Organization (ch1&5) · Numbering systems (ch2)
 * · Data storage & Operations on data (ch3&4) · Networks & Internet (ch6) ·
 * Operating System (ch7) · Algorithms (ch8) · Programming (ch9) · Software
 * Engineering (ch10) · Data structures (ch11) · File structure (ch13) · Database
 * (ch14) · Security & Ethics (ch16&20). Song ngữ EN+VI + ví dụ/bảng/sơ đồ text/
 * pseudocode + quiz. Giữ NGUYÊN slug/semester(KY1)/courseCode/thumb(v3).
 * ⚠️ KHÔNG backtick lồng, KHÔNG ${ } trong chuỗi HTML; "&" trong text HTML là &amp;.
 */
import ch1aSlides from './csi106/ch1a-slides.mjs';
import ch1bSlides from './csi106/ch1b-slides.mjs';
import ch2Slides from './csi106/ch2-slides.mjs';
import ch3aSlides from './csi106/ch3a-slides.mjs';
import ch3bSlides from './csi106/ch3b-slides.mjs';
import ch4Slides from './csi106/ch4-slides.mjs';
import ch5Slides from './csi106/ch5-slides.mjs';
import ch6Slides from './csi106/ch6-slides.mjs';
import ch7Slides from './csi106/ch7-slides.mjs';
import ch8Slides from './csi106/ch8-slides.mjs';
import ch9aSlides from './csi106/ch9a-slides.mjs';
import ch9bSlides from './csi106/ch9b-slides.mjs';
import ch10Slides from './csi106/ch10-slides.mjs';
import ch11aSlides from './csi106/ch11a-slides.mjs';
import ch11bSlides from './csi106/ch11b-slides.mjs';
import ch12Slides from './csi106/ch12-slides.mjs';

const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

/* ─────────────────────────  Tài liệu tham khảo  ───────────────────────── */
const taiLieu = doc('csi106-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách CHÍNH Forouzan + sách tham khảo, tài liệu miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">CSI106 · 📚 Resource hub</span>
<h2>Course materials &amp; references</h2>
<p class="lead">One hub for the big picture of computer science, the way Forouzan tells it — computer organization, number systems, data storage &amp; operations, networks, the operating system, algorithms, programming, software engineering, data structures, file structures, databases, and security. The official slides &amp; syllabus live on <strong>FLM</strong>; below are the course books and free, legal resources.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>Sign in to <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) with your FPTU account to read the official CSI106 syllabus and lecture slides.</p>
<h3>📗 Textbook &amp; reference books</h3>
<ul>
<li><strong>Main textbook —</strong> <a href="https://www.cengage.com/c/foundations-of-computer-science-4e-forouzan/9781473751040/" target="_blank" rel="noopener"><em>Foundations of Computer Science</em>, 4th ed. (2017)</a> — Behrouz Forouzan &amp; Firouz Mosharraf, Cengage. The course follows chapters 1–16.</li>
<li><a href="https://www.jblearning.com/catalog/productdetails/9781284116458" target="_blank" rel="noopener"><em>Fundamentals of Information Systems Security</em></a> — Kim &amp; Solomon (security &amp; ethics chapter).</li>
<li><a href="https://www.elsevier.com/books/computer-organization-and-design/patterson/978-0-12-820109-1" target="_blank" rel="noopener"><em>Computer Organization and Design</em></a> — Hennessy &amp; Patterson (deeper on CPU &amp; architecture).</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.coursera.org/learn/ai-for-everyone" target="_blank" rel="noopener">AI For Everyone (Coursera)</a> — Andrew Ng: the additional-learning course for the AI chapter (audit for free).</li>
<li><a href="https://cs50.harvard.edu/x/" target="_blank" rel="noopener">CS50 (Harvard)</a> — a free, complete intro-to-CS course with lectures &amp; labs.</li>
<li><a href="https://www.geeksforgeeks.org/" target="_blank" rel="noopener">GeeksforGeeks</a> — number systems, OS, networks, DSA, DBMS references.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/playlist?list=PL8dPuuaLjXtNlUrzyH5r6jN9ulIgZBpdo" target="_blank" rel="noopener">CrashCourse — Computer Science</a> — the whole field in ~40 short episodes.</li>
<li><a href="https://www.youtube.com/@Computerphile" target="_blank" rel="noopener">Computerphile</a> — deep, friendly explainers on CS topics.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.rapidtables.com/convert/number/binary-to-decimal.html" target="_blank" rel="noopener">Binary / octal / hex converter</a> — practise number-base conversion.</li>
<li><a href="https://logic.ly/demo/" target="_blank" rel="noopener">Logic.ly demo</a> — build and test logic-gate circuits in the browser.</li>
<li><a href="https://sqliteonline.com/" target="_blank" rel="noopener">SQLite Online</a> — try SQL on the relational model in your browser.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation (Progress Test 1, ch1–7)</strong> — computer organization &amp; von Neumann, number systems, data storage &amp; operations, networks, the OS, algorithms, programming.</li>
<li><strong>Systems (Progress Test 2, ch8–12)</strong> — software engineering, data structures.</li>
<li><strong>Data &amp; safety (Progress Test 3, ch13–20)</strong> — file structures, databases, security &amp; ethics.</li>
<li><strong>Bonus</strong> — a first, hands-on look at AI with <em>AI For Everyone</em>.</li>
</ol></div>`,
    `<span class="eyebrow">CSI106 · 📚 Trung tâm tài liệu</span>
<h2>Tài liệu tham khảo môn học</h2>
<p class="lead">Một nơi gom để nắm bức tranh lớn của khoa học máy tính theo cách Forouzan trình bày — tổ chức máy tính, hệ đếm, lưu trữ &amp; thao tác dữ liệu, mạng, hệ điều hành, thuật toán, lập trình, công nghệ phần mềm, cấu trúc dữ liệu, cấu trúc tệp, cơ sở dữ liệu, và an toàn thông tin. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là sách của môn và nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Đăng nhập <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) bằng tài khoản FPTU để đọc giáo trình và slide bài giảng chính thức của CSI106.</p>
<h3>📗 Giáo trình chính &amp; sách tham khảo</h3>
<ul>
<li><strong>Sách chính —</strong> <a href="https://www.cengage.com/c/foundations-of-computer-science-4e-forouzan/9781473751040/" target="_blank" rel="noopener"><em>Foundations of Computer Science</em>, ấn bản 4 (2017)</a> — Behrouz Forouzan &amp; Firouz Mosharraf, Cengage. Môn bám chương 1–16.</li>
<li><a href="https://www.jblearning.com/catalog/productdetails/9781284116458" target="_blank" rel="noopener"><em>Fundamentals of Information Systems Security</em></a> — Kim &amp; Solomon (phần an toàn &amp; đạo đức).</li>
<li><a href="https://www.elsevier.com/books/computer-organization-and-design/patterson/978-0-12-820109-1" target="_blank" rel="noopener"><em>Computer Organization and Design</em></a> — Hennessy &amp; Patterson (đào sâu CPU &amp; kiến trúc).</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.coursera.org/learn/ai-for-everyone" target="_blank" rel="noopener">AI For Everyone (Coursera)</a> — Andrew Ng: khoá học bổ trợ cho chương AI (học miễn phí ở chế độ audit).</li>
<li><a href="https://cs50.harvard.edu/x/" target="_blank" rel="noopener">CS50 (Harvard)</a> — khoá nhập môn KHMT miễn phí, đầy đủ bài giảng &amp; lab.</li>
<li><a href="https://www.geeksforgeeks.org/" target="_blank" rel="noopener">GeeksforGeeks</a> — tra cứu hệ đếm, OS, mạng, DSA, CSDL.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/playlist?list=PL8dPuuaLjXtNlUrzyH5r6jN9ulIgZBpdo" target="_blank" rel="noopener">CrashCourse — Computer Science</a> — cả ngành trong ~40 tập ngắn.</li>
<li><a href="https://www.youtube.com/@Computerphile" target="_blank" rel="noopener">Computerphile</a> — giải thích sâu, dễ nghe về các chủ đề CS.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.rapidtables.com/convert/number/binary-to-decimal.html" target="_blank" rel="noopener">Bộ đổi nhị phân / bát phân / hex</a> — luyện đổi hệ đếm.</li>
<li><a href="https://logic.ly/demo/" target="_blank" rel="noopener">Logic.ly demo</a> — dựng và thử mạch cổng logic trên trình duyệt.</li>
<li><a href="https://sqliteonline.com/" target="_blank" rel="noopener">SQLite Online</a> — thử SQL trên mô hình quan hệ ngay trên trình duyệt.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền (Progress Test 1, ch1–7)</strong> — tổ chức máy tính &amp; von Neumann, hệ đếm, lưu trữ &amp; thao tác dữ liệu, mạng, hệ điều hành, thuật toán, lập trình.</li>
<li><strong>Hệ thống (Progress Test 2, ch8–12)</strong> — công nghệ phần mềm, cấu trúc dữ liệu.</li>
<li><strong>Dữ liệu &amp; an toàn (Progress Test 3, ch13–20)</strong> — cấu trúc tệp, cơ sở dữ liệu, an toàn &amp; đạo đức.</li>
<li><strong>Bổ trợ</strong> — một cái nhìn thực hành đầu tiên về AI với <em>AI For Everyone</em>.</li>
</ol></div>`,
  ]]);

/* ─────────────────────────────  Giới thiệu  ───────────────────────────── */
const intro = doc('csi106-0-1-overview', 'Course overview: Introduction to Computer Science|||Tổng quan: Nhập môn Khoa học Máy tính',
  'KHMT là gì; bức tranh lớn theo Forouzan; 13 chuẩn đầu ra (CLO); cơ cấu điểm (Presentation 10% · Lab 20% · Progress test 30% · Final 40%); lộ trình 12 chương + AI.',
  [[
    `<span class="eyebrow">CSI106 · Lesson 0.1 · Overview</span>
<h2>What is Computer Science?</h2>
<p class="lead"><strong>Computer science (CS)</strong> is the study of <em>computation</em> — how information is represented, how problems are solved step by step (algorithms), and how machines are built to carry those steps out. This course follows Behrouz Forouzan's <em>Foundations of Computer Science</em>: a guided tour of the whole field, from the wires up to databases, networks and security.</p>
<h3>The layers of a computer</h3>
<p>A modern computer is a stack of layers, each built on the one below. This course walks the whole stack:</p>
<pre><code>Applications / AI            &lt;- what users see
Software engineering & databases
Programming & algorithms
Operating system & networks
Computer organization (CPU, memory, I/O)
Data as bits, numbers & operations   &lt;- the foundation
</code></pre>
<h3>Course learning outcomes (13 CLOs)</h3>
<ol>
<li><strong>CLO1</strong> — Explain computer organization &amp; the von Neumann model, computer generations, the subsystems (CPU, memory, I/O) and different architectures.</li>
<li><strong>CLO2</strong> — Convert numbers between positional systems (decimal, binary, octal, hexadecimal).</li>
<li><strong>CLO3</strong> — Store numbers (integer, floating-point / IEEE 754, two's complement), text, image, audio and video as bits.</li>
<li><strong>CLO4</strong> — Perform operations on data: logic, shift, and arithmetic operations.</li>
<li><strong>CLO5</strong> — Describe computer networks &amp; the Internet: LAN/WAN, the TCP/IP suite, and layered models.</li>
<li><strong>CLO6</strong> — Explain the operating system and its components: user interface, memory manager, file manager, device manager.</li>
<li><strong>CLO7</strong> — Design and represent algorithms (the three constructs; flowchart / UML / pseudocode) and analyse search algorithms.</li>
<li><strong>CLO8</strong> — Explain program translation (compilation vs interpretation) and the main programming paradigms.</li>
<li><strong>CLO9</strong> — Describe the software-engineering lifecycle: analysis, design, implementation, testing.</li>
<li><strong>CLO10</strong> — Use core data structures &amp; abstract data types (array, record, linked list, stack, queue, tree, BST, graph).</li>
<li><strong>CLO11</strong> — Explain file structures and access methods (sequential, indexed, hashed).</li>
<li><strong>CLO12</strong> — Describe database concepts, architecture, the relational model, and database design.</li>
<li><strong>CLO13</strong> — Explain security goals, cryptography, professional ethics &amp; privacy — and the basics of AI.</li>
</ol>
<h3>Assessment structure</h3>
<table><thead><tr><th>Component</th><th>Weight</th><th>Note</th></tr></thead><tbody>
<tr><td>Group presentation</td><td>10%</td><td>a team topic</td></tr>
<tr><td>Lab</td><td>20%</td><td>hands-on exercises</td></tr>
<tr><td>Progress test</td><td>30%</td><td>3 tests: ch1–7 / ch8–12 / ch13–20</td></tr>
<tr><td>Final exam</td><td>40%</td><td>whole course</td></tr>
</tbody></table>
<h3>Roadmap — 12 chapters + AI</h3>
<p>Computer organization → number systems → data storage &amp; operations → networks &amp; the Internet → the operating system → algorithms → programming → software engineering → data structures → file structure → databases → security &amp; ethics → a first look at AI. Each chapter has a bilingual lesson plus a short quiz.</p>
<div class="callout"><span class="badge">Big idea</span> Everything a computer does reduces to storing and transforming <strong>bits</strong> according to <strong>logic</strong>, driven by a stored <strong>program</strong>. Hold on to that sentence — the whole course is its expansion.</div>`,
    `<span class="eyebrow">CSI106 · Bài 0.1 · Tổng quan</span>
<h2>Khoa học Máy tính là gì?</h2>
<p class="lead"><strong>Khoa học máy tính (KHMT)</strong> nghiên cứu về <em>tính toán</em> — thông tin được biểu diễn ra sao, bài toán được giải từng bước thế nào (thuật toán), và máy móc được dựng ra sao để thực thi. Môn này bám sách <em>Foundations of Computer Science</em> của Behrouz Forouzan: một chuyến đi có dẫn đường qua cả ngành, từ mạch điện lên tới cơ sở dữ liệu, mạng và an toàn.</p>
<h3>Các tầng của một máy tính</h3>
<p>Máy tính hiện đại là một chồng tầng, mỗi tầng dựng trên tầng dưới. Môn này đi hết cả chồng đó:</p>
<pre><code>Ứng dụng / AI                &lt;- thứ người dùng thấy
Công nghệ phần mềm & CSDL
Lập trình & thuật toán
Hệ điều hành & mạng
Tổ chức máy tính (CPU, bộ nhớ, I/O)
Dữ liệu là bit, số & thao tác   &lt;- nền móng
</code></pre>
<h3>Chuẩn đầu ra môn học (13 CLO)</h3>
<ol>
<li><strong>CLO1</strong> — Giải thích tổ chức máy tính &amp; mô hình von Neumann, các thế hệ máy tính, các phân hệ (CPU, bộ nhớ, I/O) và các kiến trúc khác nhau.</li>
<li><strong>CLO2</strong> — Đổi số giữa các hệ vị trí (thập phân, nhị phân, bát phân, thập lục phân).</li>
<li><strong>CLO3</strong> — Lưu trữ số (nguyên, dấu phẩy động / IEEE 754, bù 2), chữ, ảnh, âm thanh và video dưới dạng bit.</li>
<li><strong>CLO4</strong> — Thực hiện thao tác trên dữ liệu: phép logic, phép dịch, phép số học.</li>
<li><strong>CLO5</strong> — Mô tả mạng máy tính &amp; Internet: LAN/WAN, bộ giao thức TCP/IP, và các mô hình phân tầng.</li>
<li><strong>CLO6</strong> — Giải thích hệ điều hành và các thành phần: giao diện người dùng, quản lý bộ nhớ, quản lý tệp, quản lý thiết bị.</li>
<li><strong>CLO7</strong> — Thiết kế và biểu diễn thuật toán (ba cấu trúc; lưu đồ / UML / mã giả) và phân tích thuật toán tìm kiếm.</li>
<li><strong>CLO8</strong> — Giải thích dịch chương trình (biên dịch vs thông dịch) và các mô thức lập trình chính.</li>
<li><strong>CLO9</strong> — Mô tả vòng đời công nghệ phần mềm: phân tích, thiết kế, cài đặt, kiểm thử.</li>
<li><strong>CLO10</strong> — Dùng các cấu trúc dữ liệu &amp; kiểu dữ liệu trừu tượng lõi (mảng, bản ghi, danh sách liên kết, ngăn xếp, hàng đợi, cây, BST, đồ thị).</li>
<li><strong>CLO11</strong> — Giải thích cấu trúc tệp và phương pháp truy cập (tuần tự, chỉ mục, băm).</li>
<li><strong>CLO12</strong> — Mô tả khái niệm CSDL, kiến trúc, mô hình quan hệ, và thiết kế CSDL.</li>
<li><strong>CLO13</strong> — Giải thích mục tiêu an toàn, mật mã, đạo đức nghề &amp; quyền riêng tư — và kiến thức nền về AI.</li>
</ol>
<h3>Cơ cấu đánh giá</h3>
<table><thead><tr><th>Thành phần</th><th>Trọng số</th><th>Ghi chú</th></tr></thead><tbody>
<tr><td>Thuyết trình nhóm</td><td>10%</td><td>một chủ đề theo nhóm</td></tr>
<tr><td>Lab</td><td>20%</td><td>bài thực hành</td></tr>
<tr><td>Progress test</td><td>30%</td><td>3 bài: ch1–7 / ch8–12 / ch13–20</td></tr>
<tr><td>Thi cuối kỳ</td><td>40%</td><td>toàn môn</td></tr>
</tbody></table>
<h3>Lộ trình — 12 chương + AI</h3>
<p>Tổ chức máy tính → hệ đếm → lưu trữ &amp; thao tác dữ liệu → mạng &amp; Internet → hệ điều hành → thuật toán → lập trình → công nghệ phần mềm → cấu trúc dữ liệu → cấu trúc tệp → cơ sở dữ liệu → an toàn &amp; đạo đức → cái nhìn đầu tiên về AI. Mỗi chương có một bài song ngữ kèm một quiz ngắn.</p>
<div class="callout"><span class="badge">Ý lớn</span> Mọi việc máy tính làm đều quy về lưu và biến đổi <strong>bit</strong> theo <strong>logic</strong>, được điều khiển bởi một <strong>chương trình</strong> lưu sẵn. Nhớ câu này — cả môn học là phần khai triển của nó.</div>`,
  ]]);

/* ───────────────  Chương 1 — Computer Organization (ch1&5)  ─────────────── */
const c1a = doc('csi106-1-1-computer-organization', '1.1 — Computer organization & the von Neumann model|||1.1 — Tổ chức máy tính & mô hình von Neumann',
  'Máy tính là gì; ba phân hệ (CPU / bộ nhớ / I/O) và vai trò; mô hình von Neumann (chương trình lưu sẵn, thực thi tuần tự); các thế hệ máy tính.',
  [[
    `<span class="eyebrow">CSI106 · Chapter 1 · Lesson 1.1</span>
<h2>Computer organization &amp; the von Neumann model</h2>
<h3>What is a computer?</h3>
<p>A <strong>computer</strong> is a machine that stores data and follows a <strong>program</strong> (a list of instructions) to process that data into useful output. Forouzan describes any computer as a <strong>black box</strong> that accepts input data, processes it, and produces output — under the control of a program.</p>
<h3>The three subsystems</h3>
<p>A computer is built from three interacting <strong>subsystems</strong>:</p>
<ul>
<li><strong>Central Processing Unit (CPU)</strong> — performs arithmetic/logic operations and controls the whole machine.</li>
<li><strong>Main memory</strong> — a set of storage locations that holds the program and its data while running.</li>
<li><strong>Input/Output (I/O) subsystem</strong> — moves data in and out (keyboard, screen, disk, network).</li>
</ul>
<h3>The von Neumann model</h3>
<p>Almost every computer follows the <strong>von Neumann architecture</strong>, which rests on four ideas:</p>
<ol>
<li><strong>Memory holds both</strong> program and data (the <strong>stored-program</strong> concept).</li>
<li>Programs and data are represented as <strong>binary</strong> patterns — memory does not know which is which.</li>
<li>Instructions are executed <strong>sequentially</strong>, one after another, unless a jump changes the order.</li>
<li>A single CPU fetches and runs those instructions.</li>
</ol>
<pre><code>            +--------- Memory ---------+
            |  program  |    data      |
            +------------^-------------+
                         | bus
     Input --> +--- CPU (ALU + Control + Registers) ---+ --> Output
</code></pre>
<h3>A short history — the generations</h3>
<table><thead><tr><th>Generation</th><th>Technology</th><th>Marker</th></tr></thead><tbody>
<tr><td>Before (mechanical)</td><td>gears, relays</td><td>Pascaline, Babbage's engine</td></tr>
<tr><td>1st (1950–1959)</td><td>vacuum tubes</td><td>ENIAC, UNIVAC — huge, hot</td></tr>
<tr><td>2nd (1959–1965)</td><td>transistors</td><td>smaller, cheaper, cooler</td></tr>
<tr><td>3rd (1965–1975)</td><td>integrated circuits (IC)</td><td>many transistors on a chip</td></tr>
<tr><td>4th (1975–1985)</td><td>microprocessor</td><td>whole CPU on one chip → the PC</td></tr>
<tr><td>5th (1985–now)</td><td>VLSI, networks, AI</td><td>laptops, mobiles, the cloud</td></tr>
</tbody></table>
<div class="callout"><span class="badge">Key idea</span> The <strong>stored-program</strong> idea — instructions live in the same memory as data — is why a computer is general-purpose. Loading a new program, not rewiring the machine, changes what it does.</div>`,
    `<span class="eyebrow">CSI106 · Chương 1 · Bài 1.1</span>
<h2>Tổ chức máy tính &amp; mô hình von Neumann</h2>
<h3>Máy tính là gì?</h3>
<p>Một <strong>máy tính</strong> là cỗ máy lưu dữ liệu và làm theo một <strong>chương trình</strong> (danh sách lệnh) để biến dữ liệu đó thành kết quả hữu ích. Forouzan mô tả mọi máy tính như một <strong>hộp đen</strong> nhận dữ liệu vào, xử lý, và cho ra kết quả — dưới sự điều khiển của một chương trình.</p>
<h3>Ba phân hệ</h3>
<p>Một máy tính được dựng từ ba <strong>phân hệ</strong> tương tác:</p>
<ul>
<li><strong>Bộ xử lý trung tâm (CPU)</strong> — thực hiện phép số học/logic và điều khiển cả máy.</li>
<li><strong>Bộ nhớ chính</strong> — tập các ô lưu trữ, giữ chương trình và dữ liệu khi đang chạy.</li>
<li><strong>Phân hệ vào/ra (I/O)</strong> — đưa dữ liệu vào và ra (bàn phím, màn hình, đĩa, mạng).</li>
</ul>
<h3>Mô hình von Neumann</h3>
<p>Gần như mọi máy tính đều theo <strong>kiến trúc von Neumann</strong>, dựa trên bốn ý:</p>
<ol>
<li><strong>Bộ nhớ chứa cả</strong> chương trình lẫn dữ liệu (ý <strong>chương trình lưu sẵn</strong>).</li>
<li>Chương trình và dữ liệu đều được biểu diễn dạng <strong>nhị phân</strong> — bộ nhớ không biết cái nào là cái nào.</li>
<li>Lệnh được thực thi <strong>tuần tự</strong>, lệnh này sau lệnh kia, trừ khi có lệnh nhảy đổi thứ tự.</li>
<li>Một CPU duy nhất lấy và chạy các lệnh đó.</li>
</ol>
<pre><code>            +-------- Bộ nhớ ---------+
            | chương trình | dữ liệu  |
            +------------^------------+
                         | bus
     Nhập --> +--- CPU (ALU + Điều khiển + Thanh ghi) ---+ --> Xuất
</code></pre>
<h3>Một lịch sử ngắn — các thế hệ</h3>
<table><thead><tr><th>Thế hệ</th><th>Công nghệ</th><th>Dấu mốc</th></tr></thead><tbody>
<tr><td>Trước đó (cơ khí)</td><td>bánh răng, rơ-le</td><td>Pascaline, máy Babbage</td></tr>
<tr><td>Thế hệ 1 (1950–1959)</td><td>ống chân không</td><td>ENIAC, UNIVAC — to, nóng</td></tr>
<tr><td>Thế hệ 2 (1959–1965)</td><td>transistor</td><td>nhỏ hơn, rẻ hơn, mát hơn</td></tr>
<tr><td>Thế hệ 3 (1965–1975)</td><td>mạch tích hợp (IC)</td><td>nhiều transistor trên một chip</td></tr>
<tr><td>Thế hệ 4 (1975–1985)</td><td>vi xử lý</td><td>cả CPU trên một chip → máy PC</td></tr>
<tr><td>Thế hệ 5 (1985–nay)</td><td>VLSI, mạng, AI</td><td>laptop, di động, điện toán đám mây</td></tr>
</tbody></table>
<div class="callout"><span class="badge">Ý chính</span> Ý tưởng <strong>chương trình lưu sẵn</strong> — lệnh nằm chung bộ nhớ với dữ liệu — là lý do máy tính đa dụng. Nạp chương trình mới, chứ không phải đấu lại dây, mới đổi việc nó làm.</div>`,
  ]]);

const c1b = doc('csi106-1-2-cpu-memory-io', '1.2 — CPU, main memory, I/O & different architectures|||1.2 — CPU, bộ nhớ chính, I/O & các kiến trúc',
  'Bên trong CPU (ALU, thanh ghi, control unit, PC); tổ chức bộ nhớ chính (địa chỉ, RAM/ROM, phân cấp); phân hệ I/O; chu trình lệnh; các kiến trúc khác (CISC/RISC, pipeline, đa nhân, von Neumann vs Harvard).',
  [[
    `<span class="eyebrow">CSI106 · Chapter 1 · Lesson 1.2</span>
<h2>CPU, main memory, I/O &amp; different architectures</h2>
<h3>Inside the CPU</h3>
<ul>
<li><strong>ALU</strong> (Arithmetic Logic Unit) — arithmetic, logic and shift operations.</li>
<li><strong>Registers</strong> — a few ultra-fast slots the CPU works in; the <strong>Program Counter (PC)</strong> holds the address of the next instruction, the <strong>Instruction Register (IR)</strong> holds the one being run.</li>
<li><strong>Control unit</strong> — decodes instructions and directs every other part.</li>
</ul>
<h3>Main memory &amp; the hierarchy</h3>
<p>Main memory is a numbered array of cells; each has a unique <strong>address</strong>. <strong>RAM</strong> is read/write and volatile; <strong>ROM</strong> is read-only and keeps its contents when powered off. Because fast memory is small and costly, computers use a <strong>hierarchy</strong>:</p>
<pre><code>Registers  : tiny,  ~1 cycle     (fastest)
Cache L1/L2: small, a few cycles
RAM        : GBs,   ~100 cycles
SSD / disk : TBs,   very slow     (largest)
</code></pre>
<h3>The I/O subsystem</h3>
<p>I/O devices are non-volatile storage (disks, SSD) and communication devices (keyboard, screen, network card). They are far slower than the CPU, so they connect through <strong>controllers</strong> and buses; the CPU is not tied up waiting on every byte.</p>
<h3>The fetch–decode–execute cycle</h3>
<pre><code>1. FETCH   : read the instruction at address in PC
2. DECODE  : the control unit works out the operation
3. EXECUTE : ALU op, move data, or jump; advance PC; repeat
</code></pre>
<h3>Different architectures</h3>
<table><thead><tr><th>Choice</th><th>Options</th><th>Idea</th></tr></thead><tbody>
<tr><td>Program/data path</td><td>von Neumann vs <strong>Harvard</strong></td><td>Harvard splits instruction &amp; data memory</td></tr>
<tr><td>Instruction set</td><td><strong>CISC</strong> vs <strong>RISC</strong></td><td>rich complex instructions vs few simple, fast ones</td></tr>
<tr><td>Parallelism</td><td><strong>pipeline</strong>, multi-core, SIMD</td><td>overlap or duplicate work</td></tr>
</tbody></table>
<div class="callout"><span class="badge">Key idea</span> A CPU is not "smart" — it just repeats fetch → decode → execute billions of times a second. Speed comes from a fast clock, caches that hide slow RAM, pipelining and multiple cores.</div>`,
    `<span class="eyebrow">CSI106 · Chương 1 · Bài 1.2</span>
<h2>CPU, bộ nhớ chính, I/O &amp; các kiến trúc</h2>
<h3>Bên trong CPU</h3>
<ul>
<li><strong>ALU</strong> (khối số học-logic) — phép số học, logic và dịch bit.</li>
<li><strong>Thanh ghi (registers)</strong> — vài ô cực nhanh CPU làm việc trực tiếp; <strong>bộ đếm chương trình (PC)</strong> giữ địa chỉ lệnh kế tiếp, <strong>thanh ghi lệnh (IR)</strong> giữ lệnh đang chạy.</li>
<li><strong>Khối điều khiển</strong> — giải mã lệnh và chỉ huy mọi bộ phận khác.</li>
</ul>
<h3>Bộ nhớ chính &amp; phân cấp</h3>
<p>Bộ nhớ chính là một mảng ô được đánh số; mỗi ô có một <strong>địa chỉ</strong> riêng. <strong>RAM</strong> đọc/ghi được và mất dữ liệu khi tắt điện; <strong>ROM</strong> chỉ đọc và giữ nội dung khi mất điện. Vì bộ nhớ nhanh thì nhỏ và đắt, máy dùng một <strong>phân cấp</strong>:</p>
<pre><code>Thanh ghi : tí hon, ~1 chu kỳ     (nhanh nhất)
Cache L1/L2: nhỏ,   vài chu kỳ
RAM        : hàng GB, ~100 chu kỳ
SSD / đĩa  : hàng TB, rất chậm    (lớn nhất)
</code></pre>
<h3>Phân hệ I/O</h3>
<p>Thiết bị I/O gồm bộ nhớ ngoài không bay hơi (đĩa, SSD) và thiết bị truyền thông (bàn phím, màn hình, card mạng). Chúng chậm hơn CPU rất nhiều, nên nối qua các <strong>bộ điều khiển (controller)</strong> và bus; CPU không bị trói chờ từng byte.</p>
<h3>Chu trình lấy–giải mã–thực thi</h3>
<pre><code>1. FETCH   : đọc lệnh ở địa chỉ trong PC
2. DECODE  : khối điều khiển xác định phép toán
3. EXECUTE : phép ALU, chuyển dữ liệu, hoặc nhảy; tăng PC; lặp lại
</code></pre>
<h3>Các kiến trúc khác nhau</h3>
<table><thead><tr><th>Lựa chọn</th><th>Phương án</th><th>Ý tưởng</th></tr></thead><tbody>
<tr><td>Đường chương trình/dữ liệu</td><td>von Neumann vs <strong>Harvard</strong></td><td>Harvard tách riêng bộ nhớ lệnh &amp; dữ liệu</td></tr>
<tr><td>Tập lệnh</td><td><strong>CISC</strong> vs <strong>RISC</strong></td><td>lệnh phức tạp phong phú vs ít lệnh đơn giản, nhanh</td></tr>
<tr><td>Song song</td><td><strong>pipeline</strong>, đa nhân, SIMD</td><td>chồng lấn hoặc nhân đôi công việc</td></tr>
</tbody></table>
<div class="callout"><span class="badge">Ý chính</span> CPU không "thông minh" — nó chỉ lặp fetch → decode → execute hàng tỉ lần mỗi giây. Tốc độ đến từ xung nhịp nhanh, cache che RAM chậm, pipeline và nhiều nhân.</div>`,
  ]]);

const c1q = quiz('csi106-quiz-1', 'Quiz 1 — Computer organization|||Quiz 1 — Tổ chức máy tính', [
  { id: 'q1', question: 'Điểm cốt lõi của mô hình von Neumann là?', options: ['Chương trình và dữ liệu nằm chung một bộ nhớ (chương trình lưu sẵn)', 'Không có CPU', 'Mỗi lệnh cần một chip riêng', 'Dữ liệu chỉ ở đĩa'], correctIndex: 0, explanation: 'Ý "chương trình lưu sẵn": lệnh và dữ liệu chung bộ nhớ, thực thi tuần tự → máy đa dụng.' },
  { id: 'q2', question: 'Ba phân hệ chính của một máy tính là?', options: ['ALU, ROM, USB', 'CPU, bộ nhớ chính, phân hệ I/O', 'Cache, đĩa, mạng', 'PC, IR, bus'], correctIndex: 1, explanation: 'Forouzan: CPU (xử lý), bộ nhớ chính (lưu chương trình/dữ liệu), I/O (vào/ra).' },
  { id: 'q3', question: 'Công nghệ đặc trưng cho máy tính thế hệ 1?', options: ['Vi xử lý', 'Transistor', 'Ống chân không (vacuum tube)', 'Mạch tích hợp'], correctIndex: 2, explanation: 'Thế hệ 1 (1950–1959) dùng ống chân không, vd ENIAC/UNIVAC.' },
]);

/* ─────────────────  Chương 2 — Numbering systems (ch2)  ─────────────────── */
const c2 = doc('csi106-2-1-number-systems', '2.1 — Numbering systems & base conversion|||2.1 — Hệ đếm & chuyển đổi cơ số',
  'Hệ vị trí (giá trị = chữ số × cơ số^vị trí); bốn hệ (thập phân/nhị phân/bát phân/thập lục phân); đổi qua lại (kể cả phần thập phân); mẹo nhóm bit bin↔oct↔hex.',
  [[
    `<span class="eyebrow">CSI106 · Chapter 2 · Lesson 2.1</span>
<h2>Numbering systems &amp; base conversion</h2>
<h3>Positional number systems</h3>
<p>In a <strong>positional system</strong>, a symbol's value depends on its position. The value of a number is the sum of each digit times the <strong>base</strong> raised to the position's power:</p>
<pre><code>value = Σ (digit × base^position)     positions count 0,1,2,... from the right
</code></pre>
<table><thead><tr><th>System</th><th>Base</th><th>Digits</th></tr></thead><tbody>
<tr><td>Decimal</td><td>10</td><td>0–9</td></tr>
<tr><td>Binary</td><td>2</td><td>0, 1</td></tr>
<tr><td>Octal</td><td>8</td><td>0–7</td></tr>
<tr><td>Hexadecimal</td><td>16</td><td>0–9, A–F</td></tr>
</tbody></table>
<h3>Any base → decimal</h3>
<pre><code>1011.1 (binary) = 1·8 + 0·4 + 1·2 + 1·1 + 1·(1/2) = 11.5 (decimal)
2AF   (hex)     = 2·256 + 10·16 + 15·1            = 687 (decimal)
</code></pre>
<h3>Decimal → any base</h3>
<p>For the <strong>integer part</strong>, repeatedly divide by the base and read remainders bottom-up. For the <strong>fraction</strong>, repeatedly multiply by the base and read the whole parts top-down.</p>
<pre><code>178 -> binary:  178/2=89 r0, 89/2=44 r1, 44/2=22 r0, 22/2=11 r0,
                11/2=5 r1, 5/2=2 r1, 2/2=1 r0, 1/2=0 r1
   read up  ->  1011 0010  (binary) = B2 (hex)
</code></pre>
<h3>Shortcut: binary ↔ octal ↔ hex</h3>
<p>Because 8 = 2³ and 16 = 2⁴, you can convert by <strong>grouping bits</strong> — no decimal detour needed. Group from the right: 3 bits per octal digit, 4 bits per hex digit.</p>
<pre><code>1011 0010 (binary)
= 1011 | 0010  -> B  2   -> B2   (hex)
= 010 110 010  -> 2 6 2  -> 262  (octal)
</code></pre>
<div class="callout"><span class="badge">Key idea</span> There is nothing special about base 10 — it is just what we grew up with. A computer thinks in base 2; hex and octal are compact shorthands programmers use to read long strings of bits.</div>`,
    `<span class="eyebrow">CSI106 · Chương 2 · Bài 2.1</span>
<h2>Hệ đếm &amp; chuyển đổi cơ số</h2>
<h3>Hệ đếm theo vị trí</h3>
<p>Trong một <strong>hệ vị trí</strong>, giá trị của một ký hiệu phụ thuộc vào vị trí của nó. Giá trị một con số là tổng của mỗi chữ số nhân với <strong>cơ số</strong> luỹ thừa vị trí:</p>
<pre><code>giá trị = Σ (chữ số × cơ số^vị trí)   vị trí đếm 0,1,2,... từ phải sang
</code></pre>
<table><thead><tr><th>Hệ</th><th>Cơ số</th><th>Chữ số</th></tr></thead><tbody>
<tr><td>Thập phân</td><td>10</td><td>0–9</td></tr>
<tr><td>Nhị phân</td><td>2</td><td>0, 1</td></tr>
<tr><td>Bát phân</td><td>8</td><td>0–7</td></tr>
<tr><td>Thập lục phân (hex)</td><td>16</td><td>0–9, A–F</td></tr>
</tbody></table>
<h3>Hệ bất kỳ → thập phân</h3>
<pre><code>1011.1 (nhị phân) = 1·8 + 0·4 + 1·2 + 1·1 + 1·(1/2) = 11.5 (thập phân)
2AF   (hex)       = 2·256 + 10·16 + 15·1            = 687 (thập phân)
</code></pre>
<h3>Thập phân → hệ bất kỳ</h3>
<p><strong>Phần nguyên</strong>: chia liên tiếp cho cơ số, đọc số dư từ dưới lên. <strong>Phần thập phân</strong>: nhân liên tiếp với cơ số, đọc phần nguyên từ trên xuống.</p>
<pre><code>178 -> nhị phân:  178/2=89 dư0, 89/2=44 dư1, 44/2=22 dư0, 22/2=11 dư0,
                  11/2=5 dư1, 5/2=2 dư1, 2/2=1 dư0, 1/2=0 dư1
   đọc lên   ->  1011 0010  (nhị phân) = B2 (hex)
</code></pre>
<h3>Mẹo: nhị phân ↔ bát phân ↔ hex</h3>
<p>Vì 8 = 2³ và 16 = 2⁴, có thể đổi bằng cách <strong>nhóm bit</strong> — không cần vòng qua thập phân. Nhóm từ phải sang: 3 bit mỗi chữ bát phân, 4 bit mỗi chữ hex.</p>
<pre><code>1011 0010 (nhị phân)
= 1011 | 0010  -> B  2   -> B2   (hex)
= 010 110 010  -> 2 6 2  -> 262  (bát phân)
</code></pre>
<div class="callout"><span class="badge">Ý chính</span> Cơ số 10 không có gì đặc biệt — chỉ là thứ ta lớn lên cùng. Máy tính nghĩ bằng cơ số 2; hex và bát phân là cách viết gọn lập trình viên dùng để đọc chuỗi bit dài.</div>`,
  ]]);

const c2q = quiz('csi106-quiz-2', 'Quiz 2 — Numbering systems|||Quiz 2 — Hệ đếm', [
  { id: 'q1', question: 'Số nhị phân 1011 0010 bằng bao nhiêu ở hệ thập phân?', options: ['160', '178', '182', '210'], correctIndex: 1, explanation: '128+32+16+2 = 178 (và bằng B2 hex).' },
  { id: 'q2', question: 'Vì sao có thể đổi nhị phân sang hex bằng cách nhóm 4 bit?', options: ['Vì 16 = 2⁴', 'Vì hex có 16 chữ số', 'Vì byte có 8 bit', 'Ngẫu nhiên'], correctIndex: 0, explanation: '16 = 2⁴ nên mỗi chữ hex tương ứng đúng 4 bit; tương tự 8=2³ cho bát phân.' },
  { id: 'q3', question: 'Để đổi PHẦN NGUYÊN thập phân sang nhị phân, ta?', options: ['Nhân liên tiếp với 2, đọc phần nguyên từ trên xuống', 'Chia liên tiếp cho 2, đọc số dư từ dưới lên', 'Cộng các luỹ thừa của 10', 'Nhóm 4 bit'], correctIndex: 1, explanation: 'Phần nguyên: chia cho cơ số, đọc dư ngược lên. (Nhân là cho phần thập phân.)' },
]);

/* ─────────  Chương 3 — Data storage & Operations on data (ch3&4)  ────────── */
const c3a = doc('csi106-3-1-storing-numbers', '3.1 — Storing numbers: integers & floating point|||3.1 — Lưu số: số nguyên & dấu phẩy động',
  'Số nguyên không dấu; số nguyên có dấu (dấu-độ lớn, bù 1, BÙ 2); tràn số; số thực dấu phẩy động và chuẩn IEEE 754 (dấu/mũ có bias/định trị) với ví dụ chi tiết.',
  [[
    `<span class="eyebrow">CSI106 · Chapter 3 · Lesson 3.1</span>
<h2>Storing numbers: integers &amp; floating point</h2>
<h3>Unsigned integers</h3>
<p>An <strong>unsigned integer</strong> is a non-negative whole number stored directly in binary. In <em>n</em> bits it ranges from 0 to 2ⁿ−1 (8 bits → 0…255). If a result needs more bits than available, it <strong>overflows</strong>.</p>
<h3>Signed integers — three methods</h3>
<table><thead><tr><th>Method</th><th>Idea</th><th>Snag</th></tr></thead><tbody>
<tr><td>Sign-and-magnitude</td><td>leftmost bit = sign, rest = value</td><td>two zeros (+0 and −0)</td></tr>
<tr><td>One's complement</td><td>negative = invert all bits</td><td>still two zeros</td></tr>
<tr><td><strong>Two's complement</strong></td><td>negative = invert, then add 1</td><td>the standard; one zero, easy add</td></tr>
</tbody></table>
<pre><code>+5 in 8 bits    = 0000 0101
invert          = 1111 1010
add 1  -> -5    = 1111 1011
</code></pre>
<p>Two's complement wins because normal binary addition "just works" for negatives, and there is only one representation of zero. In <em>n</em> bits it stores −2ⁿ⁻¹ … +2ⁿ⁻¹−1 (8 bits → −128…+127).</p>
<h3>Real numbers &amp; IEEE 754</h3>
<p>Real numbers use <strong>floating point</strong> — binary scientific notation, <code>± mantissa × 2^exponent</code>. The <strong>IEEE 754</strong> single-precision format packs one into 32 bits:</p>
<pre><code>| sign (1) | exponent (8, bias 127) | mantissa/fraction (23) |
</code></pre>
<p>Steps to store a number (example, −5.75):</p>
<ol>
<li>Sign = 1 (negative).</li>
<li>5.75 in binary = <code>101.11</code>; normalise to <code>1.0111 × 2²</code>.</li>
<li>Exponent field = 2 + bias 127 = 129 = <code>1000 0001</code>.</li>
<li>Mantissa = the bits after the point = <code>0111000...</code> (23 bits).</li>
</ol>
<p>Floating point trades <strong>exactness for range</strong>: many decimals (like 0.1) have no finite binary form, so rounding error is normal — never compare floats with strict equality.</p>
<div class="callout"><span class="badge">Key idea</span> The same 32 bits mean different numbers under different rules. Two's complement makes integer subtraction free; IEEE 754 buys a vast range at the cost of tiny rounding errors.</div>`,
    `<span class="eyebrow">CSI106 · Chương 3 · Bài 3.1</span>
<h2>Lưu số: số nguyên &amp; dấu phẩy động</h2>
<h3>Số nguyên không dấu</h3>
<p>Một <strong>số nguyên không dấu</strong> là số nguyên không âm, lưu trực tiếp dạng nhị phân. Trong <em>n</em> bit nó chạy từ 0 tới 2ⁿ−1 (8 bit → 0…255). Nếu kết quả cần nhiều bit hơn số bit có, nó bị <strong>tràn (overflow)</strong>.</p>
<h3>Số nguyên có dấu — ba cách</h3>
<table><thead><tr><th>Cách</th><th>Ý tưởng</th><th>Nhược</th></tr></thead><tbody>
<tr><td>Dấu-độ lớn</td><td>bit trái = dấu, còn lại = giá trị</td><td>hai số 0 (+0 và −0)</td></tr>
<tr><td>Bù 1</td><td>số âm = đảo mọi bit</td><td>vẫn hai số 0</td></tr>
<tr><td><strong>Bù 2</strong></td><td>số âm = đảo bit, rồi cộng 1</td><td>chuẩn; một số 0, cộng dễ</td></tr>
</tbody></table>
<pre><code>+5 trong 8 bit  = 0000 0101
đảo bit         = 1111 1010
cộng 1  -> -5   = 1111 1011
</code></pre>
<p>Bù 2 thắng vì phép cộng nhị phân thường "chạy đúng" cả với số âm, và chỉ có một cách biểu diễn số 0. Trong <em>n</em> bit nó lưu −2ⁿ⁻¹ … +2ⁿ⁻¹−1 (8 bit → −128…+127).</p>
<h3>Số thực &amp; IEEE 754</h3>
<p>Số thực dùng <strong>dấu phẩy động</strong> — ký hiệu khoa học nhị phân, <code>± định trị × 2^mũ</code>. Chuẩn <strong>IEEE 754</strong> độ chính xác đơn gói một số vào 32 bit:</p>
<pre><code>| dấu (1) | mũ (8, bias 127) | định trị/phần lẻ (23) |
</code></pre>
<p>Các bước lưu một số (ví dụ −5.75):</p>
<ol>
<li>Dấu = 1 (âm).</li>
<li>5.75 nhị phân = <code>101.11</code>; chuẩn hoá thành <code>1.0111 × 2²</code>.</li>
<li>Trường mũ = 2 + bias 127 = 129 = <code>1000 0001</code>.</li>
<li>Định trị = các bit sau dấu phẩy = <code>0111000...</code> (23 bit).</li>
</ol>
<p>Dấu phẩy động đổi <strong>độ chính xác lấy dải giá trị</strong>: nhiều số thập phân (như 0.1) không có dạng nhị phân hữu hạn, nên sai số làm tròn là bình thường — đừng bao giờ so sánh float bằng dấu bằng chặt.</p>
<div class="callout"><span class="badge">Ý chính</span> Cùng 32 bit mang nghĩa khác nhau dưới các luật khác nhau. Bù 2 làm phép trừ số nguyên trở nên miễn phí; IEEE 754 mua một dải cực rộng với cái giá là sai số làm tròn tí xíu.</div>`,
  ]]);

const c3b = doc('csi106-3-2-text-media-operations', '3.2 — Storing text/media & operations on data|||3.2 — Lưu chữ/media & thao tác trên dữ liệu',
  'Lưu chữ (ASCII/Unicode/UTF-8), ảnh (bitmap RGB, vector), âm thanh (lấy mẫu), video; thao tác trên dữ liệu: phép logic (AND/OR/XOR/NOT + mặt nạ), phép dịch (logic vs số học), phép số học (cộng bù 2).',
  [[
    `<span class="eyebrow">CSI106 · Chapter 3 · Lesson 3.2</span>
<h2>Storing text &amp; media, and operations on data</h2>
<h3>Storing text</h3>
<p>Text maps characters to numbers via a <strong>code</strong>. <strong>ASCII</strong> uses 7 bits (128 symbols, English). <strong>Unicode</strong> gives every character in every language (plus emoji) a code point, usually stored as variable-length <strong>UTF-8</strong>.</p>
<h3>Storing image, audio, video</h3>
<ul>
<li><strong>Image (bitmap)</strong> — a grid of pixels; each pixel stores colour, e.g. three bytes for R, G, B. <strong>Vector</strong> images store shapes/formulas instead.</li>
<li><strong>Audio</strong> — a sound wave is <strong>sampled</strong> many times per second (e.g. 44,100 Hz) and each sample quantised to a number.</li>
<li><strong>Video</strong> — a sequence of images (frames) plus an audio track; compression removes redundancy.</li>
</ul>
<h3>Operations on data</h3>
<p><strong>Logic operations</strong> apply a Boolean op bit by bit. A common trick is <strong>masking</strong> with AND (force bits to 0), OR (force bits to 1), and XOR (flip bits):</p>
<pre><code>  A     = 1010 1100
  mask  = 0000 1111
A AND m = 0000 1100   (keep only the low 4 bits)
A OR  m = 1010 1111   (set the low 4 bits)
A XOR m = 1010 0011   (flip the low 4 bits)
</code></pre>
<p><strong>Shift operations</strong> move all bits left or right:</p>
<ul>
<li><strong>Logical shift</strong> — fills with 0; a left shift by 1 multiplies an unsigned number by 2, a right shift divides by 2.</li>
<li><strong>Arithmetic shift</strong> — preserves the sign bit, so it works for signed (two's complement) numbers.</li>
</ul>
<p><strong>Arithmetic operations</strong> (add, subtract) use two's complement, so subtraction is just "add the negative" — the ALU needs only an adder.</p>
<div class="callout"><span class="badge">Key idea</span> There is only one kind of thing in memory — a pattern of bits. What it <em>means</em> (a number, a letter, a colour, a sound) depends entirely on the operation the program chooses to apply to it.</div>`,
    `<span class="eyebrow">CSI106 · Chương 3 · Bài 3.2</span>
<h2>Lưu chữ &amp; media, và thao tác trên dữ liệu</h2>
<h3>Lưu chữ</h3>
<p>Chữ ánh xạ ký tự sang số qua một <strong>bảng mã</strong>. <strong>ASCII</strong> dùng 7 bit (128 ký hiệu, tiếng Anh). <strong>Unicode</strong> gán cho mọi ký tự của mọi ngôn ngữ (kèm emoji) một điểm mã, thường lưu dạng <strong>UTF-8</strong> độ dài thay đổi.</p>
<h3>Lưu ảnh, âm thanh, video</h3>
<ul>
<li><strong>Ảnh (bitmap)</strong> — lưới điểm ảnh; mỗi điểm lưu màu, vd ba byte cho R, G, B. Ảnh <strong>vector</strong> lưu hình/công thức thay vì điểm ảnh.</li>
<li><strong>Âm thanh</strong> — sóng âm được <strong>lấy mẫu</strong> nhiều lần mỗi giây (vd 44.100 Hz) và mỗi mẫu được lượng tử hoá thành một số.</li>
<li><strong>Video</strong> — một chuỗi ảnh (khung hình) cộng một dải âm thanh; nén loại bỏ phần dư thừa.</li>
</ul>
<h3>Thao tác trên dữ liệu</h3>
<p><strong>Phép logic</strong> áp một phép Boole lên từng bit. Một mẹo hay dùng là <strong>mặt nạ (mask)</strong>: AND (ép bit về 0), OR (ép bit lên 1), XOR (đảo bit):</p>
<pre><code>  A     = 1010 1100
  mask  = 0000 1111
A AND m = 0000 1100   (giữ đúng 4 bit thấp)
A OR  m = 1010 1111   (đặt 4 bit thấp lên 1)
A XOR m = 1010 0011   (đảo 4 bit thấp)
</code></pre>
<p><strong>Phép dịch (shift)</strong> đẩy toàn bộ bit sang trái hoặc phải:</p>
<ul>
<li><strong>Dịch logic</strong> — chèn 0; dịch trái 1 bit nhân đôi số không dấu, dịch phải 1 bit chia đôi.</li>
<li><strong>Dịch số học</strong> — giữ nguyên bit dấu, nên dùng được cho số có dấu (bù 2).</li>
</ul>
<p><strong>Phép số học</strong> (cộng, trừ) dùng bù 2, nên phép trừ chỉ là "cộng số âm" — ALU chỉ cần một bộ cộng.</p>
<div class="callout"><span class="badge">Ý chính</span> Trong bộ nhớ chỉ có một loại thứ — một chuỗi bit. Nó <em>nghĩa là gì</em> (một số, một chữ, một màu, một âm) hoàn toàn phụ thuộc vào phép toán mà chương trình chọn áp lên nó.</div>`,
  ]]);

const c3q = quiz('csi106-quiz-3', 'Quiz 3 — Data storage & operations|||Quiz 3 — Lưu trữ & thao tác dữ liệu', [
  { id: 'q1', question: 'Máy tính biểu diễn số nguyên ÂM chuẩn nhất bằng?', options: ['Dấu-độ lớn', 'Bù 1', 'Bù 2 (two\'s complement)', 'IEEE 754'], correctIndex: 2, explanation: 'Bù 2: đảo bit rồi +1; chỉ một số 0 và phép cộng chạy đúng cho cả số âm.' },
  { id: 'q2', question: 'Trong IEEE 754 đơn (32 bit), trường mũ 8 bit được lưu theo?', options: ['Bù 2', 'Dạng có bias (cộng 127)', 'ASCII', 'Nhóm 4 bit'], correctIndex: 1, explanation: 'Mũ lưu dạng thừa/bias: giá trị thật + 127 (single precision).' },
  { id: 'q3', question: 'Muốn GIỮ đúng 4 bit thấp của một byte, dùng phép nào với mặt nạ 0000 1111?', options: ['OR', 'AND', 'XOR', 'NOT'], correctIndex: 1, explanation: 'AND với mask giữ các bit ứng với 1 và ép các bit ứng với 0 về 0.' },
]);

/* ─────────────  Chương 4 — Networks & the Internet (ch6)  ────────────── */
const c4 = doc('csi106-4-1-networks-internet', '4.1 — Computer networks & the Internet|||4.1 — Mạng máy tính & Internet',
  'Mạng là gì; LAN vs WAN; mô hình phân tầng (TCP/IP 5 tầng, so với OSI 7 tầng); bộ giao thức TCP/IP; địa chỉ IP & DNS; gói tin, TCP vs UDP; web/HTTP.',
  [[
    `<span class="eyebrow">CSI106 · Chapter 4 · Lesson 4.1</span>
<h2>Computer networks &amp; the Internet</h2>
<h3>Networks: LAN &amp; WAN</h3>
<p>A <strong>network</strong> connects computers so they can exchange data. A <strong>LAN</strong> (Local Area Network) covers a small area — a room, a building. A <strong>WAN</strong> (Wide Area Network) spans cities or countries. The <strong>Internet</strong> is a WAN of WANs — a network of networks.</p>
<h3>Layered models: TCP/IP and OSI</h3>
<p>To stay manageable, networking is split into <strong>layers</strong>, each with one job and each trusting the layer below. Forouzan uses the 5-layer <strong>TCP/IP model</strong>; the 7-layer <strong>OSI model</strong> is the classic reference:</p>
<table><thead><tr><th>TCP/IP (5)</th><th>OSI (7)</th><th>Job / example</th></tr></thead><tbody>
<tr><td>Application</td><td>Application + Presentation + Session</td><td>the service: HTTP, DNS, SMTP</td></tr>
<tr><td>Transport</td><td>Transport</td><td>end-to-end delivery, ports: TCP, UDP</td></tr>
<tr><td>Network</td><td>Network</td><td>addressing &amp; routing: IP</td></tr>
<tr><td>Data-link</td><td>Data-link</td><td>frames on one hop: Ethernet, Wi-Fi</td></tr>
<tr><td>Physical</td><td>Physical</td><td>bits on the wire/radio</td></tr>
</tbody></table>
<h3>Addresses &amp; names</h3>
<p>Every device has an <strong>IP address</strong> (e.g. 142.250.72.14). Because numbers are hard to remember, <strong>DNS</strong> (the Domain Name System) translates <code>example.com</code> into its IP — the Internet's phone book.</p>
<h3>Packets: TCP vs UDP</h3>
<p>Data is chopped into <strong>packets</strong>, each labelled with source and destination IP. <strong>IP</strong> routes each packet hop by hop. On top, <strong>TCP</strong> gives a reliable, ordered stream (it re-sends lost packets); <strong>UDP</strong> is fast and connectionless (used for video calls and games, where speed beats retries).</p>
<h3>The web</h3>
<p>The <strong>World Wide Web</strong> runs on the Internet. A browser (<strong>client</strong>) sends an <strong>HTTP</strong> request to a <strong>server</strong>, which replies with a page. A <strong>URL</strong> (<code>https://site.com/page</code>) names the protocol, host and path.</p>
<div class="callout"><span class="badge">Key idea</span> Layering is what lets a global network stay understandable: an app just says "send this to that IP", and each lower layer handles addressing, retries and the physical medium beneath it.</div>`,
    `<span class="eyebrow">CSI106 · Chương 4 · Bài 4.1</span>
<h2>Mạng máy tính &amp; Internet</h2>
<h3>Mạng: LAN &amp; WAN</h3>
<p>Một <strong>mạng</strong> nối các máy tính để chúng trao đổi dữ liệu. <strong>LAN</strong> (mạng cục bộ) phủ một vùng nhỏ — một phòng, một toà nhà. <strong>WAN</strong> (mạng diện rộng) trải khắp thành phố hay quốc gia. <strong>Internet</strong> là WAN của các WAN — mạng của các mạng.</p>
<h3>Mô hình phân tầng: TCP/IP và OSI</h3>
<p>Để dễ quản lý, mạng được chia thành các <strong>tầng</strong>, mỗi tầng một việc và tin tầng dưới. Forouzan dùng mô hình <strong>TCP/IP 5 tầng</strong>; mô hình <strong>OSI 7 tầng</strong> là chuẩn tham chiếu kinh điển:</p>
<table><thead><tr><th>TCP/IP (5)</th><th>OSI (7)</th><th>Việc / ví dụ</th></tr></thead><tbody>
<tr><td>Ứng dụng</td><td>Ứng dụng + Trình diễn + Phiên</td><td>dịch vụ: HTTP, DNS, SMTP</td></tr>
<tr><td>Giao vận</td><td>Giao vận</td><td>giao đầu-cuối, cổng: TCP, UDP</td></tr>
<tr><td>Mạng</td><td>Mạng</td><td>đánh địa chỉ &amp; định tuyến: IP</td></tr>
<tr><td>Liên kết dữ liệu</td><td>Liên kết dữ liệu</td><td>khung trên một chặng: Ethernet, Wi-Fi</td></tr>
<tr><td>Vật lý</td><td>Vật lý</td><td>bit trên dây/sóng</td></tr>
</tbody></table>
<h3>Địa chỉ &amp; tên</h3>
<p>Mỗi thiết bị có một <strong>địa chỉ IP</strong> (vd 142.250.72.14). Vì số khó nhớ, <strong>DNS</strong> (hệ thống tên miền) dịch <code>example.com</code> ra IP của nó — cuốn danh bạ của Internet.</p>
<h3>Gói tin: TCP vs UDP</h3>
<p>Dữ liệu được cắt thành các <strong>gói tin</strong>, mỗi gói ghi IP nguồn và đích. <strong>IP</strong> định tuyến từng gói qua từng chặng. Bên trên, <strong>TCP</strong> cho một luồng tin cậy, đúng thứ tự (gửi lại gói mất); <strong>UDP</strong> nhanh và phi kết nối (dùng cho gọi video và game, nơi tốc độ hơn việc gửi lại).</p>
<h3>Web</h3>
<p><strong>World Wide Web</strong> chạy trên Internet. Trình duyệt (<strong>client</strong>) gửi yêu cầu <strong>HTTP</strong> tới một <strong>server</strong>, server trả về trang. Một <strong>URL</strong> (<code>https://site.com/page</code>) nêu giao thức, máy chủ và đường dẫn.</p>
<div class="callout"><span class="badge">Ý chính</span> Phân tầng là thứ giữ cho một mạng toàn cầu vẫn hiểu được: app chỉ nói "gửi cái này tới IP kia", và mỗi tầng dưới lo đánh địa chỉ, gửi lại và môi trường vật lý bên dưới.</div>`,
  ]]);

const c4q = quiz('csi106-quiz-4', 'Quiz 4 — Networks & Internet|||Quiz 4 — Mạng & Internet', [
  { id: 'q1', question: 'DNS làm nhiệm vụ gì?', options: ['Cắt dữ liệu thành gói', 'Dịch tên miền (example.com) sang địa chỉ IP', 'Mã hoá mật khẩu', 'Chạy hệ điều hành'], correctIndex: 1, explanation: 'DNS là "danh bạ": tên miền → IP.' },
  { id: 'q2', question: 'Giao thức nào đảm bảo dữ liệu tới ĐỦ và ĐÚNG thứ tự (gửi lại gói mất)?', options: ['IP', 'TCP', 'UDP', 'DNS'], correctIndex: 1, explanation: 'TCP tin cậy, đúng thứ tự; IP lo định tuyến; UDP nhanh nhưng không đảm bảo.' },
  { id: 'q3', question: 'Mô hình TCP/IP của Forouzan có mấy tầng?', options: ['4 tầng', '5 tầng', '7 tầng', '3 tầng'], correctIndex: 1, explanation: 'TCP/IP 5 tầng: vật lý, liên kết dữ liệu, mạng, giao vận, ứng dụng (OSI có 7).' },
]);

/* ─────────────────  Chương 5 — Operating System (ch7)  ──────────────────── */
const c5 = doc('csi106-5-1-operating-system', '5.1 — The operating system & its components|||5.1 — Hệ điều hành & các thành phần',
  'HĐH là gì (lớp giữa phần cứng & ứng dụng); tiến hoá (theo lô → chia thời gian → cá nhân → phân tán); bốn thành phần: giao diện người dùng, quản lý bộ nhớ (bộ nhớ ảo/phân trang), quản lý tệp, quản lý thiết bị (+ quản lý tiến trình).',
  [[
    `<span class="eyebrow">CSI106 · Chapter 5 · Lesson 5.1</span>
<h2>The operating system &amp; its components</h2>
<h3>What an OS does</h3>
<p>An <strong>operating system (OS)</strong> sits between hardware and your apps. It shares the machine's resources fairly and safely, and hides messy hardware behind clean services — so every program can be written as if it owns the machine.</p>
<h3>Evolution</h3>
<table><thead><tr><th>Era</th><th>OS style</th></tr></thead><tbody>
<tr><td>1950s</td><td><strong>Batch</strong> — jobs queued and run one at a time</td></tr>
<tr><td>1960s–70s</td><td><strong>Time-sharing</strong> — many users share the CPU by turns</td></tr>
<tr><td>1980s</td><td><strong>Personal</strong> — one user, one machine (DOS, early Windows/Mac)</td></tr>
<tr><td>1990s+</td><td><strong>Distributed / network</strong> — many machines cooperate; mobile &amp; cloud</td></tr>
</tbody></table>
<h3>The components</h3>
<ul>
<li><strong>User interface</strong> — the shell: a command line or a GUI, plus system calls apps use to ask for services.</li>
<li><strong>Memory manager</strong> — allocates RAM to programs. Modern OSes give each process <strong>virtual memory</strong> (the illusion of private, contiguous memory) via <strong>paging</strong>, and protect processes from each other.</li>
<li><strong>File manager</strong> — organises raw disk blocks into <strong>files &amp; folders</strong>, tracks where each file lives, and enforces permissions.</li>
<li><strong>Device manager</strong> — controls I/O devices through <strong>drivers</strong>, queues requests and manages buffers.</li>
</ul>
<p>Underlying all of this, the <strong>process manager</strong> runs many programs at once by <strong>scheduling</strong> — giving each a CPU time slice and switching rapidly, so they appear simultaneous even on one core.</p>
<pre><code>          Applications (browser, editor, games)
        -----------------------------------------
        OS: user interface | memory | file | device
        -----------------------------------------
          Hardware (CPU, RAM, disk, devices)
</code></pre>
<p>Common OSes: <strong>Windows</strong>, <strong>macOS</strong>, and <strong>Linux</strong> (which also powers most servers and Android phones).</p>
<div class="callout"><span class="badge">Key idea</span> The OS is a <em>resource manager</em> and an <em>illusionist</em>: it makes one CPU look like many, scattered disk blocks look like tidy files, and shared RAM look private.</div>`,
    `<span class="eyebrow">CSI106 · Chương 5 · Bài 5.1</span>
<h2>Hệ điều hành &amp; các thành phần</h2>
<h3>Hệ điều hành làm gì</h3>
<p>Một <strong>hệ điều hành (HĐH)</strong> nằm giữa phần cứng và ứng dụng. Nó chia sẻ tài nguyên máy công bằng, an toàn, và giấu phần cứng rối rắm sau những dịch vụ gọn gàng — để mỗi chương trình viết ra như thể nó sở hữu cả máy.</p>
<h3>Tiến hoá</h3>
<table><thead><tr><th>Thời kỳ</th><th>Kiểu HĐH</th></tr></thead><tbody>
<tr><td>Thập niên 1950</td><td><strong>Theo lô (batch)</strong> — công việc xếp hàng, chạy lần lượt</td></tr>
<tr><td>1960–70</td><td><strong>Chia thời gian</strong> — nhiều người dùng chung CPU theo lượt</td></tr>
<tr><td>Thập niên 1980</td><td><strong>Cá nhân</strong> — một người, một máy (DOS, Windows/Mac đời đầu)</td></tr>
<tr><td>1990 trở đi</td><td><strong>Phân tán / mạng</strong> — nhiều máy hợp tác; di động &amp; đám mây</td></tr>
</tbody></table>
<h3>Các thành phần</h3>
<ul>
<li><strong>Giao diện người dùng</strong> — vỏ shell: dòng lệnh hoặc GUI, cùng các lời gọi hệ thống mà app dùng để xin dịch vụ.</li>
<li><strong>Quản lý bộ nhớ</strong> — cấp RAM cho chương trình. HĐH hiện đại cho mỗi tiến trình một <strong>bộ nhớ ảo</strong> (ảo giác vùng nhớ riêng, liền mạch) nhờ <strong>phân trang</strong>, và bảo vệ các tiến trình khỏi nhau.</li>
<li><strong>Quản lý tệp</strong> — tổ chức các khối đĩa thô thành <strong>tệp &amp; thư mục</strong>, theo dõi mỗi tệp nằm đâu, và áp quyền truy cập.</li>
<li><strong>Quản lý thiết bị</strong> — điều khiển thiết bị I/O qua <strong>trình điều khiển (driver)</strong>, xếp hàng yêu cầu và quản lý vùng đệm.</li>
</ul>
<p>Bên dưới tất cả, <strong>quản lý tiến trình</strong> chạy nhiều chương trình cùng lúc bằng <strong>lập lịch</strong> — cho mỗi cái một lát thời gian CPU rồi chuyển rất nhanh, nên chúng trông như đồng thời dù chỉ một nhân.</p>
<pre><code>          Ứng dụng (trình duyệt, soạn thảo, game)
        -----------------------------------------
        HĐH: giao diện | bộ nhớ | tệp | thiết bị
        -----------------------------------------
          Phần cứng (CPU, RAM, đĩa, thiết bị)
</code></pre>
<p>HĐH phổ biến: <strong>Windows</strong>, <strong>macOS</strong>, và <strong>Linux</strong> (cũng chạy phần lớn máy chủ và điện thoại Android).</p>
<div class="callout"><span class="badge">Ý chính</span> HĐH là <em>người quản lý tài nguyên</em> và <em>nhà ảo thuật</em>: biến một CPU thành nhiều, biến các khối đĩa rải rác thành tệp gọn, biến RAM chung thành riêng.</div>`,
  ]]);

const c5q = quiz('csi106-quiz-5', 'Quiz 5 — Operating system|||Quiz 5 — Hệ điều hành', [
  { id: 'q1', question: 'Thành phần nào của HĐH tổ chức khối đĩa thô thành tệp & thư mục, áp quyền?', options: ['Quản lý bộ nhớ', 'Quản lý tệp (file manager)', 'Quản lý thiết bị', 'Giao diện người dùng'], correctIndex: 1, explanation: 'File manager tổ chức tệp/thư mục, theo dõi vị trí và quyền truy cập.' },
  { id: 'q2', question: 'HĐH tạo cảm giác nhiều chương trình chạy "cùng lúc" trên một nhân nhờ?', options: ['Bộ nhớ ảo', 'Lập lịch (chia lát thời gian CPU, chuyển nhanh)', 'Phân trang', 'Driver'], correctIndex: 1, explanation: 'Scheduling cấp lát thời gian CPU luân phiên rất nhanh.' },
  { id: 'q3', question: 'Kiểu HĐH cho NHIỀU người dùng chia sẻ CPU theo lượt (thập niên 60–70) gọi là?', options: ['Theo lô (batch)', 'Chia thời gian (time-sharing)', 'Cá nhân', 'Phân tán'], correctIndex: 1, explanation: 'Time-sharing: nhiều người dùng luân phiên dùng chung một máy.' },
]);

/* ─────────────────────  Chương 6 — Algorithms (ch8)  ────────────────────── */
const c6 = doc('csi106-6-1-algorithms', '6.1 — Algorithms: concept, constructs & search|||6.1 — Thuật toán: khái niệm, cấu trúc & tìm kiếm',
  'Thuật toán là gì (đầu vào/xử lý/đầu ra); ba cấu trúc cơ bản (tuần tự/rẽ nhánh/lặp); biểu diễn (lưu đồ UML, mã giả); tìm kiếm tuyến tính vs nhị phân; độ phức tạp Big-O (bổ sung chuyên sâu).',
  [[
    `<span class="eyebrow">CSI106 · Chapter 6 · Lesson 6.1</span>
<h2>Algorithms: concept, constructs &amp; search</h2>
<h3>Algorithm = a precise recipe</h3>
<p>An <strong>algorithm</strong> is a finite, ordered, unambiguous set of steps that takes <strong>input</strong>, applies <strong>processing</strong>, and produces <strong>output</strong>. It must be effective (each step doable) and terminate. A <strong>program</strong> is an algorithm written in a language a computer runs.</p>
<h3>The three basic constructs</h3>
<p>Any algorithm can be built from just three control constructs:</p>
<ul>
<li><strong>Sequence</strong> — do steps in order.</li>
<li><strong>Decision (selection)</strong> — choose a path (<code>if / else</code>).</li>
<li><strong>Repetition (iteration)</strong> — repeat while a condition holds (loops).</li>
</ul>
<h3>Representing an algorithm</h3>
<p>Two common notations: a <strong>flowchart / UML activity diagram</strong> (boxes and arrows) and <strong>pseudocode</strong> (English-like steps). Pseudocode for finding the largest value:</p>
<pre><code>Algorithm findMax(list):
    max &lt;- list[0]
    for each item in list:        # repetition
        if item &gt; max:            # decision
            max &lt;- item           # sequence
    return max
</code></pre>
<h3>Searching a list</h3>
<table><thead><tr><th>Method</th><th>Idea</th><th>Needs sorted?</th><th>Cost</th></tr></thead><tbody>
<tr><td>Linear (sequential) search</td><td>check items one by one</td><td>no</td><td>O(n)</td></tr>
<tr><td>Binary search</td><td>halve the range each step</td><td>yes</td><td>O(log n)</td></tr>
</tbody></table>
<h3>How fast? Big-O (going deeper)</h3>
<p>We compare algorithms by how their work grows with input size <em>n</em>, written <strong>Big-O</strong> — ignoring hardware and constants. For a million items, linear search may check ~1,000,000; binary search checks only ~20. Common orders, best to worst: O(1) &lt; O(log n) &lt; O(n) &lt; O(n log n) &lt; O(n²) &lt; O(2ⁿ).</p>
<div class="callout"><span class="badge">Key idea</span> Correctness first, then efficiency. Choosing the right algorithm (and its Big-O) matters far more than a faster CPU — an O(log n) search on a billion items beats an O(n) one by a factor of tens of millions.</div>`,
    `<span class="eyebrow">CSI106 · Chương 6 · Bài 6.1</span>
<h2>Thuật toán: khái niệm, cấu trúc &amp; tìm kiếm</h2>
<h3>Thuật toán = công thức chính xác</h3>
<p>Một <strong>thuật toán</strong> là tập bước hữu hạn, có thứ tự, rõ ràng, nhận <strong>đầu vào</strong>, áp <strong>xử lý</strong>, và cho ra <strong>đầu ra</strong>. Nó phải khả thi (mỗi bước làm được) và dừng. Một <strong>chương trình</strong> là thuật toán viết bằng ngôn ngữ máy chạy được.</p>
<h3>Ba cấu trúc cơ bản</h3>
<p>Mọi thuật toán đều dựng được từ đúng ba cấu trúc điều khiển:</p>
<ul>
<li><strong>Tuần tự</strong> — làm các bước theo thứ tự.</li>
<li><strong>Rẽ nhánh (quyết định)</strong> — chọn hướng đi (<code>if / else</code>).</li>
<li><strong>Lặp</strong> — lặp lại khi điều kiện còn đúng (vòng lặp).</li>
</ul>
<h3>Biểu diễn thuật toán</h3>
<p>Hai cách thông dụng: <strong>lưu đồ / sơ đồ hoạt động UML</strong> (hộp và mũi tên) và <strong>mã giả (pseudocode)</strong> (các bước như tiếng Anh). Mã giả tìm giá trị lớn nhất:</p>
<pre><code>Algorithm timMax(list):
    max &lt;- list[0]
    for mỗi phần tử trong list:   # lặp
        if phần tử &gt; max:         # rẽ nhánh
            max &lt;- phần tử        # tuần tự
    return max
</code></pre>
<h3>Tìm kiếm trong danh sách</h3>
<table><thead><tr><th>Cách</th><th>Ý tưởng</th><th>Cần sắp?</th><th>Chi phí</th></tr></thead><tbody>
<tr><td>Tìm tuyến tính</td><td>xét từng phần tử một</td><td>không</td><td>O(n)</td></tr>
<tr><td>Tìm nhị phân</td><td>chia đôi khoảng mỗi bước</td><td>có</td><td>O(log n)</td></tr>
</tbody></table>
<h3>Nhanh cỡ nào? Big-O (đào sâu)</h3>
<p>Ta so thuật toán theo cách khối lượng việc tăng theo cỡ đầu vào <em>n</em>, ký hiệu <strong>Big-O</strong> — bỏ qua phần cứng và hằng số. Với một triệu phần tử, tìm tuyến tính có thể xét ~1.000.000; tìm nhị phân chỉ xét ~20. Các bậc thường gặp, tốt tới xấu: O(1) &lt; O(log n) &lt; O(n) &lt; O(n log n) &lt; O(n²) &lt; O(2ⁿ).</p>
<div class="callout"><span class="badge">Ý chính</span> Đúng trước, rồi mới nhanh. Chọn đúng thuật toán (và Big-O của nó) quan trọng hơn nhiều so với một CPU nhanh hơn — tìm O(log n) trên một tỉ phần tử thắng O(n) tới hàng chục triệu lần.</div>`,
  ]]);

const c6q = quiz('csi106-quiz-6', 'Quiz 6 — Algorithms|||Quiz 6 — Thuật toán', [
  { id: 'q1', question: 'Ba cấu trúc điều khiển cơ bản đủ để diễn đạt mọi thuật toán là?', options: ['Cộng, trừ, nhân', 'Tuần tự, rẽ nhánh, lặp', 'Biến, hàm, lớp', 'Nhập, xử lý, xuất'], correctIndex: 1, explanation: 'Tuần tự (sequence), rẽ nhánh (decision/selection), lặp (repetition).' },
  { id: 'q2', question: 'Độ phức tạp của tìm kiếm NHỊ PHÂN trên danh sách đã sắp là?', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], correctIndex: 1, explanation: 'Mỗi bước chia đôi khoảng → O(log n); nhưng đòi hỏi danh sách đã sắp.' },
  { id: 'q3', question: 'Cách biểu diễn thuật toán bằng "các bước gần như tiếng Anh" gọi là?', options: ['Lưu đồ', 'Mã giả (pseudocode)', 'Mã máy', 'Bảng chân trị'], correctIndex: 1, explanation: 'Pseudocode: mô tả bước bằng ngôn ngữ tự nhiên có cấu trúc; lưu đồ dùng hộp/mũi tên.' },
]);

/* ────────────────────  Chương 7 — Programming (ch9)  ────────────────────── */
const c7 = doc('csi106-7-1-programming', '7.1 — Programming: translation & paradigms|||7.1 — Lập trình: dịch & mô thức',
  'Ba mức ngôn ngữ (máy/hợp ngữ/bậc cao); dịch: hợp dịch, biên dịch vs thông dịch (kèm bytecode/JIT); bốn mô thức lập trình (thủ tục/hướng đối tượng/hàm/logic) và ví dụ.',
  [[
    `<span class="eyebrow">CSI106 · Chapter 7 · Lesson 7.1</span>
<h2>Programming: translation &amp; paradigms</h2>
<h3>Three levels of language</h3>
<ul>
<li><strong>Machine language</strong> — pure binary the CPU runs directly; fast but unreadable.</li>
<li><strong>Assembly language</strong> — short mnemonics (<code>MOV</code>, <code>ADD</code>) for machine instructions; an <strong>assembler</strong> translates it 1-to-1.</li>
<li><strong>High-level language</strong> — human-friendly (Python, Java, C); one statement expands into many machine instructions.</li>
</ul>
<h3>Translation: compilation vs interpretation</h3>
<table><thead><tr><th></th><th>Compiler</th><th>Interpreter</th></tr></thead><tbody>
<tr><td>When</td><td>whole program translated first, then run</td><td>translate &amp; run line by line</td></tr>
<tr><td>Speed</td><td>fast at run time</td><td>slower, but flexible</td></tr>
<tr><td>Example</td><td>C, C++</td><td>Python, JavaScript</td></tr>
</tbody></table>
<p>Many modern languages mix both: Java compiles to <strong>bytecode</strong>, which a virtual machine interprets — and a <strong>JIT</strong> compiler turns hot paths into machine code at run time.</p>
<h3>Programming paradigms</h3>
<ul>
<li><strong>Procedural</strong> — a sequence of procedures/functions acting on data (C, Pascal).</li>
<li><strong>Object-oriented</strong> — data + behaviour bundled into <strong>objects</strong>; inheritance, encapsulation (Java, C++, Python).</li>
<li><strong>Functional</strong> — computation as evaluating pure functions, avoiding mutable state (Haskell, Lisp).</li>
<li><strong>Logic (declarative)</strong> — state facts and rules; the system infers answers (Prolog, SQL).</li>
</ul>
<pre><code>Same task, two styles:
 procedural : total = 0; for x in list: total = total + x
 functional : total = sum(list)          # describe WHAT, not HOW
</code></pre>
<div class="callout"><span class="badge">Key idea</span> A paradigm is a way of <em>thinking</em> about a problem, not just a syntax. The CPU only ever runs machine code — every language and paradigm is a more human layer that a translator brings back down to bits.</div>`,
    `<span class="eyebrow">CSI106 · Chương 7 · Bài 7.1</span>
<h2>Lập trình: dịch &amp; mô thức</h2>
<h3>Ba mức ngôn ngữ</h3>
<ul>
<li><strong>Ngôn ngữ máy</strong> — nhị phân thuần CPU chạy trực tiếp; nhanh nhưng không đọc nổi.</li>
<li><strong>Hợp ngữ (assembly)</strong> — các từ gợi nhớ ngắn (<code>MOV</code>, <code>ADD</code>) cho lệnh máy; một <strong>trình hợp dịch (assembler)</strong> dịch 1-đối-1.</li>
<li><strong>Ngôn ngữ bậc cao</strong> — thân thiện người (Python, Java, C); một câu lệnh nở ra nhiều lệnh máy.</li>
</ul>
<h3>Dịch: biên dịch vs thông dịch</h3>
<table><thead><tr><th></th><th>Trình biên dịch</th><th>Trình thông dịch</th></tr></thead><tbody>
<tr><td>Khi nào</td><td>dịch cả chương trình trước, rồi chạy</td><td>dịch &amp; chạy từng dòng</td></tr>
<tr><td>Tốc độ</td><td>chạy nhanh</td><td>chậm hơn, nhưng linh hoạt</td></tr>
<tr><td>Ví dụ</td><td>C, C++</td><td>Python, JavaScript</td></tr>
</tbody></table>
<p>Nhiều ngôn ngữ hiện đại trộn cả hai: Java biên dịch ra <strong>bytecode</strong>, được máy ảo thông dịch — và trình <strong>JIT</strong> biến các đoạn chạy nhiều thành mã máy ngay lúc chạy.</p>
<h3>Các mô thức lập trình</h3>
<ul>
<li><strong>Thủ tục (procedural)</strong> — một dãy thủ tục/hàm tác động lên dữ liệu (C, Pascal).</li>
<li><strong>Hướng đối tượng</strong> — dữ liệu + hành vi gói vào <strong>đối tượng</strong>; kế thừa, đóng gói (Java, C++, Python).</li>
<li><strong>Hàm (functional)</strong> — tính toán là tính giá trị các hàm thuần, tránh trạng thái thay đổi (Haskell, Lisp).</li>
<li><strong>Logic (khai báo)</strong> — nêu sự kiện và luật; hệ thống suy ra đáp án (Prolog, SQL).</li>
</ul>
<pre><code>Cùng một việc, hai kiểu:
 thủ tục : total = 0; for x in list: total = total + x
 hàm     : total = sum(list)          # mô tả CÁI GÌ, không phải LÀM SAO
</code></pre>
<div class="callout"><span class="badge">Ý chính</span> Một mô thức là một cách <em>tư duy</em> về bài toán, không chỉ là cú pháp. CPU rốt cuộc chỉ chạy mã máy — mọi ngôn ngữ và mô thức đều là một tầng người-hơn mà trình dịch đưa trở lại thành bit.</div>`,
  ]]);

const c7q = quiz('csi106-quiz-7', 'Quiz 7 — Programming|||Quiz 7 — Lập trình', [
  { id: 'q1', question: 'Khác biệt chính giữa biên dịch (compiler) và thông dịch (interpreter)?', options: ['Compiler dịch cả chương trình trước rồi chạy; interpreter dịch & chạy từng dòng', 'Interpreter luôn nhanh hơn', 'Compiler không cần mã nguồn', 'Không có khác biệt'], correctIndex: 0, explanation: 'Compiler dịch toàn bộ ra mã máy trước; interpreter dịch và thực thi từng dòng lúc chạy.' },
  { id: 'q2', question: 'Mô thức "gói dữ liệu + hành vi vào đối tượng, có kế thừa/đóng gói" là?', options: ['Thủ tục', 'Hướng đối tượng (OOP)', 'Hàm (functional)', 'Logic'], correctIndex: 1, explanation: 'OOP: đối tượng gắn dữ liệu với phương thức; kế thừa, đóng gói.' },
  { id: 'q3', question: 'Trình dịch hợp ngữ (assembly) sang mã máy gọi là?', options: ['Compiler', 'Interpreter', 'Assembler', 'Linker'], correctIndex: 2, explanation: 'Assembler dịch hợp ngữ 1-đối-1 sang lệnh máy.' },
]);

/* ────────────────  Chương 8 — Software Engineering (ch10)  ──────────────── */
const c8 = doc('csi106-8-1-software-engineering', '8.1 — Software engineering: lifecycle & testing|||8.1 — Công nghệ phần mềm: vòng đời & kiểm thử',
  'Vòng đời phần mềm & mô hình phát triển (thác nước, gia tăng); pha phân tích (yêu cầu, mô hình hoá); pha thiết kế (mô-đun hoá, coupling/cohesion); cài đặt; kiểm thử hộp trắng (glass-box) vs hộp đen (black-box).',
  [[
    `<span class="eyebrow">CSI106 · Chapter 8 · Lesson 8.1</span>
<h2>Software engineering: lifecycle &amp; testing</h2>
<h3>The software lifecycle</h3>
<p>Big software is not "just coding" — it follows a <strong>lifecycle</strong>. A classic <strong>development process</strong>:</p>
<pre><code>Analysis -> Design -> Implementation -> Testing -> Maintenance
</code></pre>
<p>Process <strong>models</strong> arrange these phases differently: the <strong>waterfall</strong> model runs them once in strict order; the <strong>incremental</strong> model builds the system in growing slices.</p>
<h3>Analysis phase</h3>
<p>Understand the problem and capture <strong>requirements</strong> (what the system must do). Analysts model the system — data flow diagrams, entity-relationship diagrams, use cases — before any code is written.</p>
<h3>Design phase</h3>
<p>Decide <strong>how</strong> to build it. The key principle is <strong>modularity</strong>: break the system into modules that are <strong>loosely coupled</strong> (few dependencies between them) and <strong>highly cohesive</strong> (each does one clear job).</p>
<h3>Implementation phase</h3>
<p>Write the code in the chosen language, following the design, with good style and documentation so it can be maintained.</p>
<h3>Testing phase</h3>
<table><thead><tr><th>Glass-box (white-box)</th><th>Black-box</th></tr></thead><tbody>
<tr><td>tests based on the internal code</td><td>tests based on the specification only</td></tr>
<tr><td>aims to exercise every path/branch</td><td>checks inputs → expected outputs</td></tr>
<tr><td>e.g. basis-path, loop testing</td><td>e.g. boundary values, equivalence classes</td></tr>
</tbody></table>
<div class="callout"><span class="badge">Key idea</span> The earlier a defect is caught, the cheaper it is to fix. Good analysis and modular design prevent bugs; glass-box and black-box testing catch the ones that slip through, from two independent angles.</div>`,
    `<span class="eyebrow">CSI106 · Chương 8 · Bài 8.1</span>
<h2>Công nghệ phần mềm: vòng đời &amp; kiểm thử</h2>
<h3>Vòng đời phần mềm</h3>
<p>Phần mềm lớn không chỉ là "viết mã" — nó theo một <strong>vòng đời</strong>. Một <strong>quy trình phát triển</strong> kinh điển:</p>
<pre><code>Phân tích -> Thiết kế -> Cài đặt -> Kiểm thử -> Bảo trì
</code></pre>
<p>Các <strong>mô hình</strong> quy trình sắp xếp các pha này khác nhau: mô hình <strong>thác nước</strong> chạy một lần theo thứ tự chặt; mô hình <strong>gia tăng</strong> dựng hệ thống theo từng lát lớn dần.</p>
<h3>Pha phân tích</h3>
<p>Hiểu bài toán và nắm bắt <strong>yêu cầu</strong> (hệ thống phải làm gì). Người phân tích mô hình hoá hệ thống — sơ đồ luồng dữ liệu, sơ đồ thực thể-quan hệ, use case — trước khi viết bất kỳ dòng mã nào.</p>
<h3>Pha thiết kế</h3>
<p>Quyết định <strong>làm sao</strong> dựng nó. Nguyên tắc then chốt là <strong>mô-đun hoá</strong>: chia hệ thống thành các mô-đun <strong>kết dính lỏng (loosely coupled)</strong> (ít phụ thuộc nhau) và <strong>cố kết cao (highly cohesive)</strong> (mỗi mô-đun làm một việc rõ ràng).</p>
<h3>Pha cài đặt</h3>
<p>Viết mã bằng ngôn ngữ đã chọn, bám thiết kế, với phong cách tốt và tài liệu để có thể bảo trì.</p>
<h3>Pha kiểm thử</h3>
<table><thead><tr><th>Hộp trắng (glass-box)</th><th>Hộp đen (black-box)</th></tr></thead><tbody>
<tr><td>kiểm dựa trên mã bên trong</td><td>kiểm chỉ dựa trên đặc tả</td></tr>
<tr><td>cố phủ mọi đường đi/nhánh</td><td>xét đầu vào → đầu ra mong đợi</td></tr>
<tr><td>vd basis-path, kiểm vòng lặp</td><td>vd giá trị biên, lớp tương đương</td></tr>
</tbody></table>
<div class="callout"><span class="badge">Ý chính</span> Bắt lỗi càng sớm, sửa càng rẻ. Phân tích tốt và thiết kế mô-đun ngăn lỗi; kiểm thử hộp trắng và hộp đen bắt những lỗi lọt qua, từ hai góc độc lập.</div>`,
  ]]);

const c8q = quiz('csi106-quiz-8', 'Quiz 8 — Software engineering|||Quiz 8 — Công nghệ phần mềm', [
  { id: 'q1', question: 'Kiểm thử dựa trên MÃ BÊN TRONG, cố phủ mọi đường đi/nhánh gọi là?', options: ['Hộp đen (black-box)', 'Hộp trắng / glass-box (white-box)', 'Kiểm chấp nhận', 'Kiểm tải'], correctIndex: 1, explanation: 'Glass-box/white-box: dựa vào cấu trúc mã; black-box chỉ dựa đặc tả.' },
  { id: 'q2', question: 'Nguyên tắc thiết kế tốt là các mô-đun nên?', options: ['Kết dính chặt, cố kết thấp', 'Kết dính lỏng (loose coupling), cố kết cao (high cohesion)', 'Càng nhiều phụ thuộc càng tốt', 'Gộp tất cả vào một mô-đun'], correctIndex: 1, explanation: 'Loose coupling + high cohesion: ít phụ thuộc giữa mô-đun, mỗi mô-đun một việc rõ.' },
  { id: 'q3', question: 'Thứ tự đúng của các pha vòng đời phần mềm cổ điển?', options: ['Thiết kế → Phân tích → Kiểm thử → Cài đặt', 'Phân tích → Thiết kế → Cài đặt → Kiểm thử', 'Cài đặt → Phân tích → Thiết kế → Kiểm thử', 'Kiểm thử → Cài đặt → Thiết kế → Phân tích'], correctIndex: 1, explanation: 'Phân tích → Thiết kế → Cài đặt → Kiểm thử (→ Bảo trì).' },
]);

/* ─────────────────  Chương 9 — Data structures (ch11)  ──────────────────── */
const c9 = doc('csi106-9-1-data-structures', '9.1 — Data structures & abstract data types|||9.1 — Cấu trúc dữ liệu & kiểu dữ liệu trừu tượng',
  'Mảng (truy cập theo chỉ số) & bản ghi (record); danh sách liên kết (nút + con trỏ); ADT là gì; ngăn xếp (LIFO), hàng đợi (FIFO), cây & cây nhị phân tìm kiếm (BST), đồ thị (graph).',
  [[
    `<span class="eyebrow">CSI106 · Chapter 9 · Lesson 9.1</span>
<h2>Data structures &amp; abstract data types</h2>
<h3>Arrays &amp; records</h3>
<ul>
<li><strong>Array</strong> — a fixed row of same-type slots; instant access by <strong>index</strong> (O(1)), but a fixed size.</li>
<li><strong>Record (struct)</strong> — a group of related fields of <em>different</em> types (e.g. a student: id, name, gpa).</li>
</ul>
<h3>Linked list</h3>
<p>A <strong>linked list</strong> is a chain of <strong>nodes</strong>; each node holds data plus a <strong>pointer</strong> to the next. Inserting or deleting is easy (re-link pointers), but there is no instant index — you must walk the chain.</p>
<pre><code>[10|●] -> [20|●] -> [30|●] -> null
</code></pre>
<h3>Abstract data types (ADT)</h3>
<p>An <strong>ADT</strong> defines <em>what</em> operations a structure supports, hiding <em>how</em> it is implemented. The classic ADTs:</p>
<table><thead><tr><th>ADT</th><th>Rule</th><th>Good at</th></tr></thead><tbody>
<tr><td>Stack</td><td><strong>LIFO</strong> — push/pop at one end</td><td>undo, function-call history</td></tr>
<tr><td>Queue</td><td><strong>FIFO</strong> — add at back, remove at front</td><td>print/task lines, buffering</td></tr>
<tr><td>Tree</td><td>a branching hierarchy (root → children)</td><td>folders, parsing, sorted data</td></tr>
<tr><td>BST</td><td>tree where left &lt; node &lt; right</td><td>search/insert in O(log n)</td></tr>
<tr><td>Graph</td><td>nodes joined by edges (any links)</td><td>maps, social networks, the web</td></tr>
</tbody></table>
<p>A <strong>binary search tree (BST)</strong> keeps every left subtree smaller and every right subtree larger than a node, so searching halves the tree at each step — O(log n) when balanced.</p>
<div class="callout"><span class="badge">Key idea</span> Choosing the right structure is how an algorithm hits its Big-O: a hash table turns a slow O(n) search into ~O(1); a balanced BST keeps sorted data searchable in O(log n). The ADT lets you swap implementations without rewriting the users.</div>`,
    `<span class="eyebrow">CSI106 · Chương 9 · Bài 9.1</span>
<h2>Cấu trúc dữ liệu &amp; kiểu dữ liệu trừu tượng</h2>
<h3>Mảng &amp; bản ghi</h3>
<ul>
<li><strong>Mảng (array)</strong> — hàng ô cùng kiểu, cố định; truy cập tức thì theo <strong>chỉ số</strong> (O(1)), nhưng kích thước cố định.</li>
<li><strong>Bản ghi (record/struct)</strong> — nhóm các trường liên quan có kiểu <em>khác nhau</em> (vd sinh viên: id, tên, gpa).</li>
</ul>
<h3>Danh sách liên kết</h3>
<p>Một <strong>danh sách liên kết</strong> là chuỗi các <strong>nút</strong>; mỗi nút giữ dữ liệu cộng một <strong>con trỏ</strong> tới nút kế. Chèn hay xoá dễ (nối lại con trỏ), nhưng không có chỉ số tức thì — phải đi dọc chuỗi.</p>
<pre><code>[10|●] -> [20|●] -> [30|●] -> null
</code></pre>
<h3>Kiểu dữ liệu trừu tượng (ADT)</h3>
<p>Một <strong>ADT</strong> định nghĩa <em>những</em> thao tác một cấu trúc hỗ trợ, giấu <em>cách</em> nó được cài đặt. Các ADT kinh điển:</p>
<table><thead><tr><th>ADT</th><th>Luật</th><th>Giỏi việc</th></tr></thead><tbody>
<tr><td>Ngăn xếp (stack)</td><td><strong>LIFO</strong> — push/pop ở một đầu</td><td>undo, lịch sử gọi hàm</td></tr>
<tr><td>Hàng đợi (queue)</td><td><strong>FIFO</strong> — thêm ở cuối, lấy ở đầu</td><td>hàng chờ in/tác vụ, đệm</td></tr>
<tr><td>Cây (tree)</td><td>phân cấp phân nhánh (gốc → con)</td><td>thư mục, phân tích cú pháp, dữ liệu sắp</td></tr>
<tr><td>BST</td><td>cây với trái &lt; nút &lt; phải</td><td>tìm/chèn O(log n)</td></tr>
<tr><td>Đồ thị (graph)</td><td>nút nối bởi cạnh (liên kết bất kỳ)</td><td>bản đồ, mạng xã hội, web</td></tr>
</tbody></table>
<p>Một <strong>cây nhị phân tìm kiếm (BST)</strong> giữ mọi cây con trái nhỏ hơn và mọi cây con phải lớn hơn một nút, nên tìm kiếm chia đôi cây mỗi bước — O(log n) khi cân bằng.</p>
<div class="callout"><span class="badge">Ý chính</span> Chọn đúng cấu trúc là cách thuật toán đạt Big-O: bảng băm biến tìm chậm O(n) thành ~O(1); BST cân bằng giữ dữ liệu sắp xếp tìm được trong O(log n). ADT cho phép đổi cách cài đặt mà không phải viết lại nơi dùng.</div>`,
  ]]);

const c9q = quiz('csi106-quiz-9', 'Quiz 9 — Data structures|||Quiz 9 — Cấu trúc dữ liệu', [
  { id: 'q1', question: 'Cấu trúc "vào trước ra trước" (FIFO) là?', options: ['Ngăn xếp (stack)', 'Hàng đợi (queue)', 'Mảng', 'Cây'], correctIndex: 1, explanation: 'Queue = FIFO; stack = LIFO (vào sau ra trước).' },
  { id: 'q2', question: 'Trong cây nhị phân tìm kiếm (BST), quy luật sắp xếp là?', options: ['Trái > nút > phải', 'Trái < nút < phải', 'Mọi nút bằng nhau', 'Không có thứ tự'], correctIndex: 1, explanation: 'BST: cây con trái < nút < cây con phải → tìm O(log n) khi cân bằng.' },
  { id: 'q3', question: 'Ưu điểm của danh sách liên kết so với mảng là?', options: ['Truy cập tức thì theo chỉ số', 'Chèn/xoá dễ (chỉ nối lại con trỏ)', 'Luôn nhỏ hơn', 'Không cần bộ nhớ'], correctIndex: 1, explanation: 'Danh sách liên kết chèn/xoá dễ; đổi lại không có truy cập chỉ số tức thì.' },
]);

/* ─────────────────  Chương 10 — File structure (ch13)  ──────────────────── */
const c10 = doc('csi106-10-1-file-structure', '10.1 — File structure & access methods|||10.1 — Cấu trúc tệp & phương pháp truy cập',
  'Tệp là gì; tệp văn bản (text) vs tệp nhị phân (binary); ba phương pháp truy cập: tuần tự (sequential), chỉ mục (indexed), băm (hashed); khi nào dùng cái nào.',
  [[
    `<span class="eyebrow">CSI106 · Chapter 10 · Lesson 10.1</span>
<h2>File structure &amp; access methods</h2>
<h3>Text vs binary files</h3>
<p>A <strong>file</strong> is a named collection of records stored on non-volatile media. Two kinds:</p>
<ul>
<li><strong>Text file</strong> — a sequence of characters (encoded ASCII/Unicode), organised into lines; human-readable in an editor (<code>.txt</code>, <code>.csv</code>, source code).</li>
<li><strong>Binary file</strong> — raw bytes in a program-defined format; compact and exact, but not readable as plain text (<code>.jpg</code>, <code>.mp3</code>, <code>.exe</code>, a database file).</li>
</ul>
<h3>Access methods</h3>
<table><thead><tr><th>Method</th><th>How you reach a record</th><th>Best for</th></tr></thead><tbody>
<tr><td><strong>Sequential</strong></td><td>read from the start, record after record</td><td>process every record (payroll, logs)</td></tr>
<tr><td><strong>Indexed</strong></td><td>an index maps a key → position; jump there</td><td>fast lookup + ordered scans (databases)</td></tr>
<tr><td><strong>Hashed</strong></td><td>a hash of the key computes the position directly</td><td>fastest single-record lookup (~O(1))</td></tr>
</tbody></table>
<pre><code>Indexed file:
  INDEX                 DATA
  key 105 -> block 3    block 3: [ ...record 105... ]
  key 240 -> block 7    block 7: [ ...record 240... ]
</code></pre>
<h3>Choosing a method</h3>
<p><strong>Sequential</strong> is simplest and ideal when you touch all records in order, but slow for finding one. <strong>Indexed</strong> adds an index so you can both jump to a key and scan in order — at the cost of maintaining the index. <strong>Hashed</strong> gives near-instant access to a single record, but no natural order and possible <strong>collisions</strong> (two keys hashing to the same slot) to resolve.</p>
<div class="callout"><span class="badge">Key idea</span> The access method is chosen from the <em>usage pattern</em>: scan-everything → sequential; look-up-by-key-and-range → indexed; look-up-one-fast → hashed. This is exactly the file-level echo of choosing a data structure in memory.</div>`,
    `<span class="eyebrow">CSI106 · Chương 10 · Bài 10.1</span>
<h2>Cấu trúc tệp &amp; phương pháp truy cập</h2>
<h3>Tệp văn bản vs tệp nhị phân</h3>
<p>Một <strong>tệp (file)</strong> là tập bản ghi có tên, lưu trên phương tiện không bay hơi. Hai loại:</p>
<ul>
<li><strong>Tệp văn bản (text)</strong> — chuỗi ký tự (mã ASCII/Unicode), tổ chức thành dòng; đọc được trong trình soạn thảo (<code>.txt</code>, <code>.csv</code>, mã nguồn).</li>
<li><strong>Tệp nhị phân (binary)</strong> — byte thô theo định dạng do chương trình quy định; gọn và chính xác, nhưng không đọc được như văn bản thường (<code>.jpg</code>, <code>.mp3</code>, <code>.exe</code>, tệp CSDL).</li>
</ul>
<h3>Phương pháp truy cập</h3>
<table><thead><tr><th>Cách</th><th>Đến một bản ghi thế nào</th><th>Hợp cho</th></tr></thead><tbody>
<tr><td><strong>Tuần tự</strong></td><td>đọc từ đầu, bản ghi này sau bản ghi kia</td><td>xử lý mọi bản ghi (bảng lương, log)</td></tr>
<tr><td><strong>Chỉ mục</strong></td><td>một chỉ mục ánh xạ khoá → vị trí; nhảy tới đó</td><td>tra nhanh + quét theo thứ tự (CSDL)</td></tr>
<tr><td><strong>Băm (hash)</strong></td><td>băm khoá tính thẳng ra vị trí</td><td>tra một bản ghi nhanh nhất (~O(1))</td></tr>
</tbody></table>
<pre><code>Tệp chỉ mục:
  CHỈ MỤC               DỮ LIỆU
  khoá 105 -> khối 3    khối 3: [ ...bản ghi 105... ]
  khoá 240 -> khối 7    khối 7: [ ...bản ghi 240... ]
</code></pre>
<h3>Chọn phương pháp</h3>
<p><strong>Tuần tự</strong> đơn giản nhất và lý tưởng khi bạn chạm mọi bản ghi theo thứ tự, nhưng chậm khi tìm một cái. <strong>Chỉ mục</strong> thêm một chỉ mục để vừa nhảy tới khoá vừa quét theo thứ tự — đổi lại phải duy trì chỉ mục. <strong>Băm</strong> cho truy cập gần tức thì một bản ghi, nhưng không có thứ tự tự nhiên và có thể <strong>đụng độ (collision)</strong> (hai khoá băm về cùng ô) cần xử lý.</p>
<div class="callout"><span class="badge">Ý chính</span> Phương pháp truy cập được chọn theo <em>kiểu sử dụng</em>: quét-hết → tuần tự; tra-theo-khoá-và-khoảng → chỉ mục; tra-một-cái-nhanh → băm. Đây đúng là tiếng vọng ở mức tệp của việc chọn cấu trúc dữ liệu trong bộ nhớ.</div>`,
  ]]);

const c10q = quiz('csi106-quiz-10', 'Quiz 10 — File structure|||Quiz 10 — Cấu trúc tệp', [
  { id: 'q1', question: 'Phương pháp truy cập nào băm khoá để tính THẲNG ra vị trí bản ghi (~O(1))?', options: ['Tuần tự', 'Chỉ mục', 'Băm (hashed)', 'Ngẫu nhiên'], correctIndex: 2, explanation: 'Hashed: hàm băm của khoá cho vị trí trực tiếp, tra nhanh nhất (có thể đụng độ).' },
  { id: 'q2', question: 'Tệp .jpg, .mp3, .exe thuộc loại?', options: ['Tệp văn bản', 'Tệp nhị phân (binary)', 'Tệp chỉ mục', 'Tệp tuần tự'], correctIndex: 1, explanation: 'Đó là byte thô theo định dạng riêng — tệp nhị phân, không đọc được như văn bản.' },
  { id: 'q3', question: 'Truy cập tuần tự (sequential) hợp nhất khi?', options: ['Cần tra một bản ghi cực nhanh', 'Cần xử lý MỌI bản ghi theo thứ tự (vd bảng lương)', 'Cần thứ tự ngẫu nhiên', 'Không bao giờ dùng'], correctIndex: 1, explanation: 'Sequential lý tưởng khi chạm mọi bản ghi lần lượt; chậm khi tìm một cái.' },
]);

/* ────────────────────  Chương 11 — Database (ch14)  ─────────────────────── */
const c11 = doc('csi106-11-1-database', '11.1 — Databases & the relational model|||11.1 — Cơ sở dữ liệu & mô hình quan hệ',
  'CSDL vs tệp; DBMS; kiến trúc CSDL ba mức (trong/khái niệm/ngoài — ANSI/SPARC); mô hình quan hệ (bảng/hàng/cột, khoá chính/ngoại); nhập môn thiết kế CSDL (ER, chuẩn hoá) & SQL.',
  [[
    `<span class="eyebrow">CSI106 · Chapter 11 · Lesson 11.1</span>
<h2>Databases &amp; the relational model</h2>
<h3>Why a database?</h3>
<p>Storing data in scattered files leads to duplication and inconsistency. A <strong>database</strong> stores data once, centrally, and a <strong>DBMS</strong> (Database Management System) lets many users query and update it safely and consistently.</p>
<h3>Database architecture — three levels</h3>
<p>The ANSI/SPARC architecture separates concerns into three levels, so one can change without breaking the others (<strong>data independence</strong>):</p>
<table><thead><tr><th>Level</th><th>What it describes</th></tr></thead><tbody>
<tr><td><strong>Internal</strong></td><td>how data is physically stored (files, indexes)</td></tr>
<tr><td><strong>Conceptual</strong></td><td>the whole logical structure (all tables &amp; relationships)</td></tr>
<tr><td><strong>External</strong></td><td>the view each user/app sees (a subset)</td></tr>
</tbody></table>
<h3>The relational model</h3>
<p>Data is organised into <strong>relations (tables)</strong>: rows = <strong>records/tuples</strong>, columns = <strong>fields/attributes</strong>. A <strong>primary key</strong> uniquely identifies each row; a <strong>foreign key</strong> in one table references the primary key of another, linking them.</p>
<pre><code>Students                    Enrollments
+----+-------+              +-----------+--------+
| id | name  |              | studentId | course |
+----+-------+              +-----------+--------+
|  1 | An    |   &lt;--- link ---   1        | CSI106 |
|  2 | Binh  |              |    2        | MAE101 |
+----+-------+              +-----------+--------+
</code></pre>
<p>We query with <strong>SQL</strong>: <code>SELECT name FROM Students WHERE id = 1;</code> asks for An's name.</p>
<h3>Database design</h3>
<p>Design usually starts with an <strong>entity-relationship (ER) diagram</strong> (entities, attributes, relationships), which is turned into tables and then <strong>normalised</strong> — split to remove redundancy and update anomalies, so each fact is stored in exactly one place.</p>
<div class="callout"><span class="badge">Key idea</span> Data structures make one program fast; databases make data <em>shared, persistent and consistent</em> across many programs and users. Keys, the three-level architecture and normalisation are how the relational model keeps that data tidy.</div>`,
    `<span class="eyebrow">CSI106 · Chương 11 · Bài 11.1</span>
<h2>Cơ sở dữ liệu &amp; mô hình quan hệ</h2>
<h3>Vì sao cần CSDL?</h3>
<p>Lưu dữ liệu trong các tệp rải rác dẫn tới trùng lặp và thiếu nhất quán. Một <strong>cơ sở dữ liệu (CSDL)</strong> lưu dữ liệu một lần, tập trung, và một <strong>DBMS</strong> (hệ quản trị CSDL) cho nhiều người truy vấn và cập nhật an toàn, nhất quán.</p>
<h3>Kiến trúc CSDL — ba mức</h3>
<p>Kiến trúc ANSI/SPARC tách quan tâm thành ba mức, để một mức đổi mà không phá mức khác (<strong>độc lập dữ liệu</strong>):</p>
<table><thead><tr><th>Mức</th><th>Mô tả điều gì</th></tr></thead><tbody>
<tr><td><strong>Trong (internal)</strong></td><td>dữ liệu được lưu vật lý thế nào (tệp, chỉ mục)</td></tr>
<tr><td><strong>Khái niệm (conceptual)</strong></td><td>toàn bộ cấu trúc logic (mọi bảng &amp; quan hệ)</td></tr>
<tr><td><strong>Ngoài (external)</strong></td><td>khung nhìn mỗi người dùng/app thấy (một phần)</td></tr>
</tbody></table>
<h3>Mô hình quan hệ</h3>
<p>Dữ liệu tổ chức thành <strong>quan hệ (bảng)</strong>: hàng = <strong>bản ghi/bộ (tuple)</strong>, cột = <strong>trường/thuộc tính</strong>. <strong>Khoá chính</strong> định danh duy nhất mỗi hàng; <strong>khoá ngoại</strong> ở một bảng tham chiếu khoá chính của bảng khác, nối chúng lại.</p>
<pre><code>Students                    Enrollments
+----+-------+              +-----------+--------+
| id | name  |              | studentId | course |
+----+-------+              +-----------+--------+
|  1 | An    |   &lt;--- nối ---    1        | CSI106 |
|  2 | Binh  |              |    2        | MAE101 |
+----+-------+              +-----------+--------+
</code></pre>
<p>Ta truy vấn bằng <strong>SQL</strong>: <code>SELECT name FROM Students WHERE id = 1;</code> hỏi tên của An.</p>
<h3>Thiết kế CSDL</h3>
<p>Thiết kế thường bắt đầu từ một <strong>sơ đồ thực thể-quan hệ (ER)</strong> (thực thể, thuộc tính, quan hệ), rồi chuyển thành bảng và <strong>chuẩn hoá</strong> — tách ra để loại trùng lặp và bất thường khi cập nhật, sao cho mỗi sự kiện được lưu đúng một chỗ.</p>
<div class="callout"><span class="badge">Ý chính</span> Cấu trúc dữ liệu làm một chương trình nhanh; CSDL làm dữ liệu <em>được chia sẻ, bền và nhất quán</em> qua nhiều chương trình và người dùng. Khoá, kiến trúc ba mức và chuẩn hoá là cách mô hình quan hệ giữ dữ liệu gọn gàng.</div>`,
  ]]);

const c11q = quiz('csi106-quiz-11', 'Quiz 11 — Database|||Quiz 11 — Cơ sở dữ liệu', [
  { id: 'q1', question: 'Trong CSDL quan hệ, thứ định danh DUY NHẤT mỗi hàng gọi là?', options: ['Khoá ngoại', 'Khoá chính (primary key)', 'Chỉ mục', 'Thuộc tính'], correctIndex: 1, explanation: 'Khoá chính định danh duy nhất một bản ghi; khoá ngoại nối các bảng.' },
  { id: 'q2', question: 'Ba mức trong kiến trúc CSDL (ANSI/SPARC) là?', options: ['Nhanh, chậm, trung bình', 'Trong (internal), khái niệm (conceptual), ngoài (external)', 'Bảng, hàng, cột', 'SELECT, INSERT, DELETE'], correctIndex: 1, explanation: 'Ba mức: internal (vật lý), conceptual (logic tổng thể), external (khung nhìn người dùng).' },
  { id: 'q3', question: 'Chuẩn hoá (normalization) nhằm?', options: ['Tăng tốc CPU', 'Loại trùng lặp & bất thường cập nhật (mỗi sự kiện một chỗ)', 'Mã hoá dữ liệu', 'Nén tệp'], correctIndex: 1, explanation: 'Chuẩn hoá tách bảng để giảm dư thừa và anomaly, lưu mỗi sự kiện đúng một nơi.' },
]);

/* ────────────  Chương 12 — Security & Ethics (ch16&20)  ──────────────── */
const c12 = doc('csi106-12-1-security-ethics', '12.1 — Security, cryptography & professional ethics|||12.1 — An toàn, mật mã & đạo đức nghề',
  'Mục tiêu an toàn (CIA: bí mật/toàn vẹn/sẵn sàng); tấn công; bí mật bằng mật mã: mã đối xứng (DES/AES) vs bất đối xứng (RSA, khoá công khai/riêng); tin tặc (hacker) & mối đe doạ; đạo đức nghề (quyền riêng tư, bản quyền, bộ quy tắc ACM).',
  [[
    `<span class="eyebrow">CSI106 · Chapter 12 · Lesson 12.1</span>
<h2>Security, cryptography &amp; professional ethics</h2>
<h3>Security goals: the CIA triad</h3>
<ul>
<li><strong>Confidentiality</strong> — only authorised people can read the data.</li>
<li><strong>Integrity</strong> — data is not altered without permission.</li>
<li><strong>Availability</strong> — the system is up when needed.</li>
</ul>
<p>Attacks target these goals: <strong>snooping</strong> (confidentiality), <strong>modification</strong> (integrity), <strong>denial of service</strong> (availability), plus malware and phishing.</p>
<h3>Confidentiality with cryptography</h3>
<p><strong>Encryption</strong> scrambles plaintext into ciphertext that only a key can reverse. Two families:</p>
<table><thead><tr><th></th><th>Symmetric-key</th><th>Asymmetric-key</th></tr></thead><tbody>
<tr><td>Keys</td><td>one shared secret key</td><td>a public + a private key pair</td></tr>
<tr><td>Encrypt / decrypt</td><td>same key for both</td><td>encrypt with public, decrypt with private</td></tr>
<tr><td>Speed</td><td>fast</td><td>slower</td></tr>
<tr><td>Example</td><td>DES, AES</td><td>RSA</td></tr>
</tbody></table>
<p>The snag with symmetric ciphers is <strong>sharing the key safely</strong>; asymmetric keys solve it — anyone can encrypt with your public key, but only your private key decrypts. In practice HTTPS uses asymmetric keys to exchange a fast symmetric key.</p>
<h3>Hackers &amp; threats</h3>
<p>"<strong>Hacker</strong>" ranges from ethical (<strong>white-hat</strong>) testers to criminal (<strong>black-hat</strong>) attackers. Core defences: strong unique passwords + <strong>multi-factor authentication</strong>, encryption, patching, and <strong>least privilege</strong>.</p>
<h3>Professional ethics</h3>
<p>Computing power comes with responsibility. A professional respects <strong>privacy</strong>, honours <strong>intellectual property</strong> (licences, no plagiarism), avoids harm and bias, and is honest about what software can and can't do. The <strong>ACM Code of Ethics</strong> puts this in writing.</p>
<div class="callout"><span class="badge">Key idea</span> Security is not a feature bolted on at the end — it is confidentiality, integrity and availability designed in from the start, with cryptography as its core tool and professional ethics as its human boundary.</div>`,
    `<span class="eyebrow">CSI106 · Chương 12 · Bài 12.1</span>
<h2>An toàn, mật mã &amp; đạo đức nghề</h2>
<h3>Mục tiêu an toàn: bộ ba CIA</h3>
<ul>
<li><strong>Bí mật (Confidentiality)</strong> — chỉ người được phép mới đọc được dữ liệu.</li>
<li><strong>Toàn vẹn (Integrity)</strong> — dữ liệu không bị sửa trái phép.</li>
<li><strong>Sẵn sàng (Availability)</strong> — hệ thống hoạt động khi cần.</li>
</ul>
<p>Tấn công nhắm vào các mục tiêu này: <strong>nghe lén (snooping)</strong> (bí mật), <strong>sửa đổi</strong> (toàn vẹn), <strong>từ chối dịch vụ (DoS)</strong> (sẵn sàng), cùng mã độc và lừa đảo.</p>
<h3>Bí mật bằng mật mã</h3>
<p><strong>Mã hoá (encryption)</strong> xáo bản rõ thành bản mã mà chỉ có khoá mới đảo lại được. Hai họ:</p>
<table><thead><tr><th></th><th>Mã đối xứng</th><th>Mã bất đối xứng</th></tr></thead><tbody>
<tr><td>Khoá</td><td>một khoá bí mật dùng chung</td><td>một cặp khoá công khai + riêng</td></tr>
<tr><td>Mã / giải</td><td>cùng một khoá cho cả hai</td><td>mã bằng khoá công khai, giải bằng khoá riêng</td></tr>
<tr><td>Tốc độ</td><td>nhanh</td><td>chậm hơn</td></tr>
<tr><td>Ví dụ</td><td>DES, AES</td><td>RSA</td></tr>
</tbody></table>
<p>Nhược của mã đối xứng là <strong>chia sẻ khoá an toàn</strong>; khoá bất đối xứng giải quyết điều đó — ai cũng mã được bằng khoá công khai của bạn, nhưng chỉ khoá riêng của bạn giải được. Thực tế HTTPS dùng khoá bất đối xứng để trao đổi một khoá đối xứng nhanh.</p>
<h3>Tin tặc &amp; mối đe doạ</h3>
<p>"<strong>Hacker</strong>" trải từ người kiểm thử có đạo đức (<strong>mũ trắng</strong>) tới kẻ tấn công tội phạm (<strong>mũ đen</strong>). Phòng vệ cốt lõi: mật khẩu mạnh không trùng + <strong>xác thực đa yếu tố</strong>, mã hoá, vá lỗi, và <strong>đặc quyền tối thiểu</strong>.</p>
<h3>Đạo đức nghề nghiệp</h3>
<p>Sức mạnh tính toán đi kèm trách nhiệm. Người làm nghề tôn trọng <strong>quyền riêng tư</strong>, tôn trọng <strong>sở hữu trí tuệ</strong> (giấy phép, không đạo văn), tránh gây hại và thiên lệch, và trung thực về việc phần mềm làm được và không làm được gì. <strong>Bộ quy tắc đạo đức ACM</strong> ghi rõ điều này.</p>
<div class="callout"><span class="badge">Ý chính</span> An toàn không phải tính năng gắn thêm ở cuối — nó là bí mật, toàn vẹn và sẵn sàng được thiết kế ngay từ đầu, với mật mã là công cụ lõi và đạo đức nghề là ranh giới con người.</div>`,
  ]]);

const c12q = quiz('csi106-quiz-12', 'Quiz 12 — Security & ethics|||Quiz 12 — An toàn & đạo đức', [
  { id: 'q1', question: 'Bộ ba CIA trong an toàn thông tin gồm?', options: ['Chi phí, Tốc độ, Dung lượng', 'Bí mật, Toàn vẹn, Sẵn sàng', 'Client, Internet, Application', 'CPU, IC, ALU'], correctIndex: 1, explanation: 'CIA = Confidentiality (bí mật), Integrity (toàn vẹn), Availability (sẵn sàng).' },
  { id: 'q2', question: 'Mã hoá BẤT ĐỐI XỨNG (asymmetric, vd RSA) dùng?', options: ['Một khoá bí mật dùng chung', 'Một cặp khoá: công khai để mã, riêng để giải', 'Không cần khoá', 'Chỉ để nén dữ liệu'], correctIndex: 1, explanation: 'Bất đối xứng: mã bằng khoá công khai, giải bằng khoá riêng — giải bài toán chia sẻ khoá.' },
  { id: 'q3', question: 'Ưu điểm chính của mã ĐỐI XỨNG (vd AES) so với bất đối xứng là?', options: ['Không cần khoá', 'Nhanh hơn', 'Không thể bị bẻ', 'Tự chia sẻ khoá an toàn'], correctIndex: 1, explanation: 'Mã đối xứng nhanh; nhược là phải chia sẻ khoá bí mật an toàn.' },
]);

/* ────────────────  Chương 13 — Intro to AI (Additional)  ────────────────── */
const c13 = doc('csi106-13-1-intro-ai', '13.1 — A first look at Artificial Intelligence|||13.1 — Cái nhìn đầu tiên về Trí tuệ nhân tạo',
  'AI là gì; AI vs học máy (ML) vs học sâu; ba kiểu học (giám sát/không giám sát/tăng cường); quy trình ML; ứng dụng & hạn chế; bổ trợ "AI For Everyone" (Andrew Ng).',
  [[
    `<span class="eyebrow">CSI106 · Chapter 13 · Additional learning</span>
<h2>A first look at Artificial Intelligence</h2>
<h3>AI, ML and deep learning</h3>
<p><strong>Artificial Intelligence (AI)</strong> builds systems that perform tasks needing "intelligence" — recognising speech, translating, recommending, driving. Most modern AI is <strong>machine learning (ML)</strong>: instead of hand-writing rules, the program <em>learns patterns from data</em>. <strong>Deep learning</strong> is ML using many-layered neural networks.</p>
<pre><code>Traditional:  rules + data      -> program -> answers
Machine learning: data + answers -> [training] -> a model
                  then: model + new data -> prediction
</code></pre>
<h3>Three kinds of learning</h3>
<table><thead><tr><th>Type</th><th>Data</th><th>Example</th></tr></thead><tbody>
<tr><td>Supervised</td><td>labelled examples (input → answer)</td><td>spam detection, image labels</td></tr>
<tr><td>Unsupervised</td><td>unlabelled data; find structure</td><td>customer clustering</td></tr>
<tr><td>Reinforcement</td><td>reward/penalty from trying</td><td>game-playing, robotics</td></tr>
</tbody></table>
<h3>The ML workflow</h3>
<pre><code>collect data -> clean/prepare -> train a model -> evaluate -> deploy -> monitor
</code></pre>
<h3>Applications &amp; limits</h3>
<p>AI powers search, recommendations, translation, medical imaging and voice assistants. But a model is <strong>only as good, and as fair, as the data it learns from</strong>: biased data → biased predictions; it can be confidently wrong, and it does not truly "understand". That is exactly why the ethics of the previous chapter matter here.</p>
<div class="callout"><span class="badge">Go further</span> Andrew Ng's free <a href="https://www.coursera.org/learn/ai-for-everyone" target="_blank" rel="noopener"><em>AI For Everyone</em></a> (the course's additional learning) explains what AI realistically can and cannot do, and how it changes work — no maths required.</div>`,
    `<span class="eyebrow">CSI106 · Chương 13 · Học bổ trợ</span>
<h2>Cái nhìn đầu tiên về Trí tuệ nhân tạo</h2>
<h3>AI, ML và học sâu</h3>
<p><strong>Trí tuệ nhân tạo (AI)</strong> dựng hệ thống làm các việc cần "trí thông minh" — nhận diện giọng nói, dịch, gợi ý, lái xe. Phần lớn AI hiện đại là <strong>học máy (ML)</strong>: thay vì viết tay luật, chương trình <em>học quy luật từ dữ liệu</em>. <strong>Học sâu (deep learning)</strong> là ML dùng mạng nơ-ron nhiều tầng.</p>
<pre><code>Truyền thống:  luật + dữ liệu      -> chương trình -> đáp án
Học máy:       dữ liệu + đáp án     -> [huấn luyện] -> một mô hình
               rồi: mô hình + dữ liệu mới -> dự đoán
</code></pre>
<h3>Ba kiểu học</h3>
<table><thead><tr><th>Kiểu</th><th>Dữ liệu</th><th>Ví dụ</th></tr></thead><tbody>
<tr><td>Có giám sát</td><td>ví dụ có nhãn (đầu vào → đáp án)</td><td>lọc thư rác, gán nhãn ảnh</td></tr>
<tr><td>Không giám sát</td><td>dữ liệu không nhãn; tìm cấu trúc</td><td>gom cụm khách hàng</td></tr>
<tr><td>Tăng cường</td><td>thưởng/phạt từ việc thử</td><td>chơi game, robot</td></tr>
</tbody></table>
<h3>Quy trình ML</h3>
<pre><code>thu thập dữ liệu -> làm sạch/chuẩn bị -> huấn luyện -> đánh giá -> triển khai -> giám sát
</code></pre>
<h3>Ứng dụng &amp; hạn chế</h3>
<p>AI đứng sau tìm kiếm, gợi ý, dịch thuật, ảnh y khoa và trợ lý giọng nói. Nhưng một mô hình <strong>chỉ tốt, và công bằng, đúng bằng dữ liệu nó học</strong>: dữ liệu thiên lệch → dự đoán thiên lệch; nó có thể sai một cách tự tin, và không thật sự "hiểu". Chính vì thế đạo đức ở chương trước mới quan trọng ở đây.</p>
<div class="callout"><span class="badge">Đi xa hơn</span> Khoá miễn phí <a href="https://www.coursera.org/learn/ai-for-everyone" target="_blank" rel="noopener"><em>AI For Everyone</em></a> của Andrew Ng (phần học bổ trợ của môn) giải thích AI thực tế làm được và không làm được gì, và nó thay đổi công việc ra sao — không cần toán.</div>`,
  ]]);

const c13q = quiz('csi106-quiz-13', 'Quiz 13 — Intro to AI|||Quiz 13 — Nhập môn AI', [
  { id: 'q1', question: 'Học máy (machine learning) khác lập trình truyền thống ở chỗ?', options: ['Không cần máy tính', 'Học quy luật TỪ DỮ LIỆU thay vì viết tay mọi luật', 'Luôn đúng 100%', 'Không dùng dữ liệu'], correctIndex: 1, explanation: 'ML học mô hình từ dữ liệu rồi dự đoán trên đầu vào mới, thay vì lập trình tay mọi luật.' },
  { id: 'q2', question: 'Kiểu học dùng dữ liệu CÓ NHÃN (đầu vào → đáp án) là?', options: ['Không giám sát', 'Có giám sát (supervised)', 'Tăng cường', 'Học sâu'], correctIndex: 1, explanation: 'Supervised learning: huấn luyện từ cặp (đầu vào, nhãn/đáp án).' },
  { id: 'q3', question: 'Vì sao một mô hình AI có thể đưa ra dự đoán THIÊN LỆCH?', options: ['Vì CPU chậm', 'Vì nó chỉ tốt và công bằng bằng dữ liệu nó học', 'Vì thiếu RAM', 'AI không bao giờ thiên lệch'], correctIndex: 1, explanation: 'Dữ liệu thiên lệch → mô hình thiên lệch; đó là lý do đạo đức dữ liệu quan trọng.' },
]);

export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'CSI106',
    slug: 'csi106-introduction-to-computer-science',
    title: 'Introduction to Computer Science',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CSI106.webp',
    shortDescription: 'The big picture of CS (Forouzan) — computer organization & von Neumann, number systems, data storage & operations, networks, the OS, algorithms, programming, software engineering, data structures, files, databases, security & AI. Bilingual, with quizzes.|||Bức tranh lớn của KHMT (Forouzan) — tổ chức máy tính & von Neumann, hệ đếm, lưu trữ & thao tác dữ liệu, mạng, HĐH, thuật toán, lập trình, CNPM, cấu trúc dữ liệu, cấu trúc tệp, CSDL, an toàn & AI. Song ngữ, có quiz.',
    description: 'Môn <strong>CSI106 — Introduction to Computer Science</strong> (kỳ 1) cho bạn <strong>bức tranh lớn của khoa học máy tính</strong> — nền tảng cho mọi môn sau. Bám sách chính <strong>Forouzan, "Foundations of Computer Science"</strong> (Cengage, 4th, ch1–16): <strong>tổ chức máy tính &amp; von Neumann</strong> → <strong>hệ đếm</strong> → <strong>lưu trữ &amp; thao tác dữ liệu</strong> (bù 2, IEEE 754, phép logic/dịch) → <strong>mạng &amp; Internet</strong> (TCP/IP, OSI) → <strong>hệ điều hành</strong> → <strong>thuật toán</strong> (Big-O) → <strong>lập trình</strong> (dịch &amp; mô thức) → <strong>công nghệ phần mềm</strong> → <strong>cấu trúc dữ liệu</strong> → <strong>cấu trúc tệp</strong> → <strong>cơ sở dữ liệu</strong> → <strong>an toàn thông tin, mật mã &amp; đạo đức</strong> → <strong>AI nhập môn</strong>. Song ngữ, có ví dụ, bảng, sơ đồ, mã giả và quiz mỗi chương.',
    whatYouLearn: 'Tổ chức máy tính (CPU/bộ nhớ/I/O), mô hình von Neumann, các thế hệ, kiến trúc CISC/RISC/Harvard; hệ đếm (thập phân/nhị phân/bát phân/hex) & chuyển đổi; lưu số (bù 2, dấu phẩy động IEEE 754), lưu chữ/ảnh/âm thanh/video, phép logic/dịch/số học; mạng LAN/WAN, TCP/IP & OSI, IP/DNS, TCP vs UDP; hệ điều hành (giao diện, quản lý bộ nhớ/tệp/thiết bị, lập lịch); thuật toán, ba cấu trúc, lưu đồ/mã giả, tìm kiếm & Big-O; lập trình (biên dịch vs thông dịch, mô thức); công nghệ phần mềm (vòng đời, phân tích/thiết kế, kiểm thử hộp trắng/đen); cấu trúc dữ liệu (mảng/liên kết/stack/queue/cây/BST/đồ thị); cấu trúc tệp (text/binary, tuần tự/chỉ mục/băm); CSDL quan hệ & SQL, kiến trúc ba mức, chuẩn hoá; an toàn (CIA), mật mã đối xứng/bất đối xứng, đạo đức nghề; và AI/ML nhập môn.',
    requirements: 'Không cần kiến thức lập trình trước. Chỉ cần toán phổ thông và sự tò mò về cách máy tính hoạt động.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách CHÍNH Forouzan, tài liệu miễn phí, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'KHMT là gì, 13 CLO, cơ cấu điểm, lộ trình 12 chương + AI.', lessons: [intro] },
    { title: 'Chương 1 — Tổ chức máy tính|||Chapter 1 — Computer organization', description: 'von Neumann, thế hệ, phân hệ, CPU/bộ nhớ/I/O, kiến trúc.', lessons: [ch1aSlides, ch1bSlides, c1a, c1b, c1q] },
    { title: 'Chương 2 — Hệ đếm|||Chapter 2 — Numbering systems', description: 'Hệ vị trí, đổi thập phân/nhị phân/bát phân/hex.', lessons: [ch2Slides, c2, c2q] },
    { title: 'Chương 3 — Lưu trữ & thao tác dữ liệu|||Chapter 3 — Data storage & operations', description: 'Bù 2, IEEE 754, chữ/media, phép logic/dịch/số học.', lessons: [ch3aSlides, ch3bSlides, c3a, c3b, c3q] },
    { title: 'Chương 4 — Mạng & Internet|||Chapter 4 — Networks & Internet', description: 'LAN/WAN, TCP/IP & OSI, IP/DNS, TCP vs UDP, web.', lessons: [ch4Slides, c4, c4q] },
    { title: 'Chương 5 — Hệ điều hành|||Chapter 5 — Operating system', description: 'Tiến hoá, giao diện/bộ nhớ/tệp/thiết bị, lập lịch.', lessons: [ch5Slides, c5, c5q] },
    { title: 'Chương 6 — Thuật toán|||Chapter 6 — Algorithms', description: 'Ba cấu trúc, lưu đồ/mã giả, tìm kiếm, Big-O.', lessons: [ch6Slides, c6, c6q] },
    { title: 'Chương 7 — Lập trình|||Chapter 7 — Programming', description: 'Mức ngôn ngữ, biên dịch vs thông dịch, mô thức.', lessons: [ch7Slides, c7, c7q] },
    { title: 'Chương 8 — Công nghệ phần mềm|||Chapter 8 — Software engineering', description: 'Vòng đời, phân tích/thiết kế, kiểm thử hộp trắng/đen.', lessons: [ch8Slides, c8, c8q] },
    { title: 'Chương 9 — Cấu trúc dữ liệu|||Chapter 9 — Data structures', description: 'Mảng/bản ghi/liên kết, stack/queue/cây/BST/đồ thị.', lessons: [ch9aSlides, ch9bSlides, c9, c9q] },
    { title: 'Chương 10 — Cấu trúc tệp|||Chapter 10 — File structure', description: 'Text vs binary, truy cập tuần tự/chỉ mục/băm.', lessons: [ch10Slides, c10, c10q] },
    { title: 'Chương 11 — Cơ sở dữ liệu|||Chapter 11 — Database', description: 'DBMS, kiến trúc ba mức, mô hình quan hệ, thiết kế & SQL.', lessons: [ch11aSlides, ch11bSlides, c11, c11q] },
    { title: 'Chương 12 — An toàn & đạo đức|||Chapter 12 — Security & ethics', description: 'CIA, mật mã đối xứng/bất đối xứng, tin tặc, đạo đức nghề.', lessons: [ch12Slides, c12, c12q] },
    { title: 'Chương 13 — Nhập môn AI|||Chapter 13 — Intro to AI', description: 'AI/ML/học sâu, ba kiểu học, ứng dụng & hạn chế, AI For Everyone.', lessons: [c13, c13q] },
  ],
};
