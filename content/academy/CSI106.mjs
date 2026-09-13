/**
 * CSI106 — Introduction to Computer Science. Giáo trình FLM (syl): nhập môn KHMT
 * — máy tính & lịch sử, biểu diễn dữ liệu (nhị phân/hex/bù 2/Unicode), đại số
 * Boole & mạch logic, kiến trúc CPU, hệ điều hành, mạng & Internet, thuật toán,
 * cấu trúc dữ liệu & CSDL, an toàn thông tin & đạo đức, AI nhập môn. Song ngữ +
 * ví dụ/bảng/sơ đồ text + quiz. Giữ NGUYÊN slug/semester/thumb(v3).
 * ⚠️ KHÔNG backtick lồng, KHÔNG ${ } trong chuỗi HTML; "\n" literal viết \\n;
 * viết "&" trong text là &amp;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('csi106-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (kèm link), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">CSI106 · 📚 Resource hub</span>
<h2>Course materials &amp; references</h2>
<p class="lead">One hub for learning the big picture of computer science: how a computer works, how data is represented, logic circuits, the CPU, operating systems, networks, algorithms, data structures &amp; databases, and security. The official slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>Sign in to <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) with your FPTU account to read the official CSI106 syllabus and lecture slides.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/computer-science-an-overview/P200000003351" target="_blank" rel="noopener"><em>Computer Science: An Overview</em></a> — Brookshear &amp; Brylow: the standard intro-to-CS survey (matches this course's scope).</li>
<li><a href="https://www.buthowdoitknow.com/" target="_blank" rel="noopener"><em>But How Do It Know?</em></a> — J. Clark Scott: builds a whole CPU from logic gates, in plain language.</li>
<li><a href="https://www.nand2tetris.org/book" target="_blank" rel="noopener"><em>The Elements of Computing Systems</em> (Nand2Tetris)</a> — Nisan &amp; Schocken: from NAND gates to a working computer.</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.khanacademy.org/computing" target="_blank" rel="noopener">Khan Academy — Computing</a> (CS principles, algorithms, information theory).</li>
<li><a href="https://cs50.harvard.edu/x/" target="_blank" rel="noopener">CS50 (Harvard)</a> — a free, complete intro-to-CS course with lectures &amp; labs.</li>
<li><a href="https://www.geeksforgeeks.org/computer-science-projects/" target="_blank" rel="noopener">GeeksforGeeks</a> — CS fundamentals, number systems, OS, networks, DSA.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/playlist?list=PL8dPuuaLjXtNlUrzyH5r6jN9ulIgZBpdo" target="_blank" rel="noopener">CrashCourse — Computer Science</a> — the whole field in ~40 short episodes.</li>
<li><a href="https://www.youtube.com/@Computerphile" target="_blank" rel="noopener">Computerphile</a> — deep, friendly explainers on CS topics.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://logic.ly/demo/" target="_blank" rel="noopener">Logic.ly demo</a> — build and test logic-gate circuits in the browser.</li>
<li><a href="https://www.rapidtables.com/convert/number/binary-to-decimal.html" target="_blank" rel="noopener">Binary / hex converter</a> — practise number-base conversion.</li>
<li><a href="https://cpulse.walnut.io/" target="_blank" rel="noopener">CPU / digital simulators</a> and any online Python REPL for trying algorithms.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — hardware vs software &amp; von Neumann, number systems (binary/hex/two's complement), Boolean logic &amp; gates.</li>
<li><strong>Practice</strong> — convert numbers by hand, fill in truth tables, trace how one instruction runs.</li>
<li><strong>Go deeper</strong> — CPU &amp; memory, operating systems, networking &amp; the web, algorithms &amp; complexity.</li>
<li><strong>Job-ready</strong> — data structures &amp; databases, security &amp; professional ethics, and a first look at AI.</li>
</ol></div>`,
    `<span class="eyebrow">CSI106 · 📚 Trung tâm tài liệu</span>
<h2>Tài liệu tham khảo môn học</h2>
<p class="lead">Một nơi gom để nắm bức tranh lớn của khoa học máy tính: máy tính hoạt động ra sao, dữ liệu được biểu diễn thế nào, mạch logic, CPU, hệ điều hành, mạng, thuật toán, cấu trúc dữ liệu &amp; CSDL, và an toàn thông tin. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Đăng nhập <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) bằng tài khoản FPTU để đọc giáo trình và slide bài giảng chính thức của CSI106.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/computer-science-an-overview/P200000003351" target="_blank" rel="noopener"><em>Computer Science: An Overview</em></a> — Brookshear &amp; Brylow: sách khảo sát nhập môn KHMT chuẩn (khớp phạm vi môn này).</li>
<li><a href="https://www.buthowdoitknow.com/" target="_blank" rel="noopener"><em>But How Do It Know?</em></a> — J. Clark Scott: dựng cả một CPU từ cổng logic, giải thích rất bình dân.</li>
<li><a href="https://www.nand2tetris.org/book" target="_blank" rel="noopener"><em>The Elements of Computing Systems</em> (Nand2Tetris)</a> — Nisan &amp; Schocken: từ cổng NAND tới một máy tính chạy được.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.khanacademy.org/computing" target="_blank" rel="noopener">Khan Academy — Computing</a> (nguyên lý CS, thuật toán, lý thuyết thông tin).</li>
<li><a href="https://cs50.harvard.edu/x/" target="_blank" rel="noopener">CS50 (Harvard)</a> — khoá nhập môn KHMT miễn phí, đầy đủ bài giảng &amp; lab.</li>
<li><a href="https://www.geeksforgeeks.org/computer-science-projects/" target="_blank" rel="noopener">GeeksforGeeks</a> — nền tảng CS, hệ đếm, OS, mạng, DSA.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/playlist?list=PL8dPuuaLjXtNlUrzyH5r6jN9ulIgZBpdo" target="_blank" rel="noopener">CrashCourse — Computer Science</a> — cả ngành trong ~40 tập ngắn.</li>
<li><a href="https://www.youtube.com/@Computerphile" target="_blank" rel="noopener">Computerphile</a> — giải thích sâu, dễ nghe về các chủ đề CS.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://logic.ly/demo/" target="_blank" rel="noopener">Logic.ly demo</a> — dựng và thử mạch cổng logic trên trình duyệt.</li>
<li><a href="https://www.rapidtables.com/convert/number/binary-to-decimal.html" target="_blank" rel="noopener">Bộ đổi nhị phân / hex</a> — luyện đổi hệ đếm.</li>
<li><a href="https://cpulse.walnut.io/" target="_blank" rel="noopener">Mô phỏng CPU / mạch số</a> và một REPL Python trực tuyến để thử thuật toán.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — phần cứng vs phần mềm &amp; von Neumann, hệ đếm (nhị phân/hex/bù 2), đại số Boole &amp; cổng logic.</li>
<li><strong>Luyện tập</strong> — đổi số bằng tay, điền bảng chân trị, lần theo cách một lệnh chạy.</li>
<li><strong>Đào sâu</strong> — CPU &amp; bộ nhớ, hệ điều hành, mạng &amp; web, thuật toán &amp; độ phức tạp.</li>
<li><strong>Sẵn sàng đi làm</strong> — cấu trúc dữ liệu &amp; CSDL, an toàn thông tin &amp; đạo đức nghề, và cái nhìn đầu tiên về AI.</li>
</ol></div>`,
  ]]);

const intro = doc('csi106-0-1-overview', 'Course overview: Introduction to Computer Science|||Tổng quan: Nhập môn Khoa học Máy tính',
  'KHMT là gì (không chỉ là lập trình); học gì trong môn; chuẩn đầu ra (CLO); lộ trình 9 chương từ phần cứng tới AI.',
  [[
    `<span class="eyebrow">CSI106 · Lesson 0.1 · Overview</span>
<h2>What is Computer Science?</h2>
<p class="lead"><strong>Computer science (CS)</strong> is the study of <em>computation</em> — how information is represented, how problems are solved step by step (algorithms), and how machines are built to carry those steps out. It is far more than coding: coding is one tool used to express ideas that come from maths, logic and engineering.</p>
<h3>The layers of a computer</h3>
<p>A modern computer is a stack of layers, each built on the one below. This course walks the whole stack, bottom to top:</p>
<pre><code>Applications / AI        <- what users see
Algorithms & programs
Operating system
CPU + memory (architecture)
Logic gates (Boolean algebra)
Data as bits (0/1)       <- the foundation
</code></pre>
<h3>What you'll learn (course outcomes)</h3>
<ul>
<li>Describe how a computer is organised (the <strong>von Neumann</strong> model) and how hardware and software relate.</li>
<li>Represent numbers, text and media as <strong>bits</strong>, and convert between number systems.</li>
<li>Read simple <strong>logic circuits</strong> and truth tables, and connect them to how a CPU computes.</li>
<li>Explain the role of the <strong>operating system</strong>, of <strong>networks</strong> and the Internet.</li>
<li>Reason about <strong>algorithms</strong>, basic <strong>complexity</strong>, core <strong>data structures</strong> and databases.</li>
<li>Recognise <strong>security</strong> risks, <strong>professional ethics</strong>, and the basics of <strong>AI</strong>.</li>
</ul>
<h3>Roadmap — 9 chapters</h3>
<p>Computers &amp; history → data representation → Boolean logic → CPU &amp; memory → operating systems → networks &amp; the Internet → algorithms → data structures &amp; databases → security, ethics &amp; AI. Each chapter has a bilingual lesson plus a short quiz.</p>
<div class="callout"><span class="badge">Big idea</span> Everything a computer does reduces to moving and transforming <strong>bits</strong> according to <strong>logic</strong>, driven by a stored <strong>program</strong>. Hold on to that sentence — the whole course is its expansion.</div>`,
    `<span class="eyebrow">CSI106 · Bài 0.1 · Tổng quan</span>
<h2>Khoa học Máy tính là gì?</h2>
<p class="lead"><strong>Khoa học máy tính (KHMT)</strong> nghiên cứu về <em>tính toán</em> — thông tin được biểu diễn ra sao, bài toán được giải từng bước thế nào (thuật toán), và máy móc được dựng ra sao để thực thi các bước đó. Nó rộng hơn lập trình rất nhiều: lập trình chỉ là một công cụ để diễn đạt các ý tưởng đến từ toán học, logic và kỹ thuật.</p>
<h3>Các tầng của một máy tính</h3>
<p>Máy tính hiện đại là một chồng tầng, mỗi tầng dựng trên tầng dưới. Môn này đi hết cả chồng đó, từ dưới lên:</p>
<pre><code>Ứng dụng / AI            <- thứ người dùng thấy
Thuật toán & chương trình
Hệ điều hành
CPU + bộ nhớ (kiến trúc)
Cổng logic (đại số Boole)
Dữ liệu là bit (0/1)     <- nền móng
</code></pre>
<h3>Bạn sẽ học gì (chuẩn đầu ra)</h3>
<ul>
<li>Mô tả cách máy tính được tổ chức (mô hình <strong>von Neumann</strong>) và quan hệ giữa phần cứng — phần mềm.</li>
<li>Biểu diễn số, chữ và media thành <strong>bit</strong>, và đổi qua lại giữa các hệ đếm.</li>
<li>Đọc <strong>mạch logic</strong> đơn giản và bảng chân trị, nối chúng với cách CPU tính toán.</li>
<li>Giải thích vai trò của <strong>hệ điều hành</strong>, của <strong>mạng</strong> và Internet.</li>
<li>Lập luận về <strong>thuật toán</strong>, <strong>độ phức tạp</strong> cơ bản, các <strong>cấu trúc dữ liệu</strong> lõi và CSDL.</li>
<li>Nhận biết rủi ro <strong>an toàn thông tin</strong>, <strong>đạo đức nghề</strong>, và kiến thức nền về <strong>AI</strong>.</li>
</ul>
<h3>Lộ trình — 9 chương</h3>
<p>Máy tính &amp; lịch sử → biểu diễn dữ liệu → đại số Boole → CPU &amp; bộ nhớ → hệ điều hành → mạng &amp; Internet → thuật toán → cấu trúc dữ liệu &amp; CSDL → an toàn, đạo đức &amp; AI. Mỗi chương có một bài song ngữ kèm một quiz ngắn.</p>
<div class="callout"><span class="badge">Ý lớn</span> Mọi việc máy tính làm đều quy về di chuyển và biến đổi <strong>bit</strong> theo <strong>logic</strong>, được điều khiển bởi một <strong>chương trình</strong> lưu sẵn. Nhớ câu này — cả môn học là phần khai triển của nó.</div>`,
  ]]);

const c1 = doc('csi106-1-1-computers-history', '1.1 — Computers, history & the von Neumann model|||1.1 — Máy tính, lịch sử & mô hình von Neumann',
  'Máy tính là gì; lịch sử ngắn (cơ khí → ống chân không → transistor → IC → vi xử lý); phần cứng vs phần mềm; mô hình von Neumann (CPU/bộ nhớ/I/O, chương trình lưu trong bộ nhớ).',
  [[
    `<span class="eyebrow">CSI106 · Chapter 1 · Lesson 1.1</span>
<h2>Computers, a short history &amp; the von Neumann model</h2>
<h3>What is a computer?</h3>
<p>A <strong>computer</strong> is a machine that stores data and follows a <strong>program</strong> (a list of instructions) to process that data into useful output. Its power comes from being <em>general-purpose</em>: change the program and the same hardware does an entirely different job.</p>
<h3>A very short history</h3>
<table><thead><tr><th>Era</th><th>Technology</th><th>Example</th></tr></thead><tbody>
<tr><td>Mechanical</td><td>gears, relays</td><td>Babbage's Analytical Engine (design)</td></tr>
<tr><td>1st gen</td><td>vacuum tubes</td><td>ENIAC (1945)</td></tr>
<tr><td>2nd gen</td><td>transistors</td><td>smaller, cooler machines</td></tr>
<tr><td>3rd gen</td><td>integrated circuits (IC)</td><td>many transistors on one chip</td></tr>
<tr><td>4th gen</td><td>microprocessor</td><td>whole CPU on one chip → the PC</td></tr>
</tbody></table>
<h3>Hardware vs software</h3>
<ul>
<li><strong>Hardware</strong> — the physical parts you can touch: CPU, memory, disk, screen.</li>
<li><strong>Software</strong> — the instructions and data: the operating system, apps, your programs.</li>
</ul>
<h3>The von Neumann model</h3>
<p>Almost every computer follows the <strong>von Neumann architecture</strong>: one memory holds <em>both</em> the program and its data, and a CPU fetches and runs instructions one after another.</p>
<pre><code>            +--------- Memory ---------+
            |  program  |    data      |
            +------------^-------------+
                         | bus
     Input --> +---- CPU (ALU + Control) ----+ --> Output
</code></pre>
<div class="callout"><span class="badge">Key idea</span> The <strong>stored-program</strong> idea — instructions live in the same memory as data — is why a computer is general-purpose. Loading a new program, not rewiring the machine, changes what it does.</div>`,
    `<span class="eyebrow">CSI106 · Chương 1 · Bài 1.1</span>
<h2>Máy tính, lịch sử ngắn &amp; mô hình von Neumann</h2>
<h3>Máy tính là gì?</h3>
<p>Một <strong>máy tính</strong> là cỗ máy lưu dữ liệu và làm theo một <strong>chương trình</strong> (danh sách lệnh) để biến dữ liệu đó thành kết quả hữu ích. Sức mạnh của nó đến từ tính <em>đa dụng</em>: đổi chương trình thì cùng phần cứng làm một việc hoàn toàn khác.</p>
<h3>Một lịch sử rất ngắn</h3>
<table><thead><tr><th>Thời kỳ</th><th>Công nghệ</th><th>Ví dụ</th></tr></thead><tbody>
<tr><td>Cơ khí</td><td>bánh răng, rơ-le</td><td>Máy Giải tích của Babbage (thiết kế)</td></tr>
<tr><td>Thế hệ 1</td><td>ống chân không</td><td>ENIAC (1945)</td></tr>
<tr><td>Thế hệ 2</td><td>transistor</td><td>máy nhỏ hơn, mát hơn</td></tr>
<tr><td>Thế hệ 3</td><td>mạch tích hợp (IC)</td><td>nhiều transistor trên một chip</td></tr>
<tr><td>Thế hệ 4</td><td>vi xử lý</td><td>cả CPU trên một chip → máy PC</td></tr>
</tbody></table>
<h3>Phần cứng vs phần mềm</h3>
<ul>
<li><strong>Phần cứng</strong> — các bộ phận vật lý sờ được: CPU, bộ nhớ, đĩa, màn hình.</li>
<li><strong>Phần mềm</strong> — lệnh và dữ liệu: hệ điều hành, ứng dụng, chương trình của bạn.</li>
</ul>
<h3>Mô hình von Neumann</h3>
<p>Gần như mọi máy tính đều theo <strong>kiến trúc von Neumann</strong>: một bộ nhớ chứa <em>cả</em> chương trình lẫn dữ liệu, và một CPU lấy rồi chạy các lệnh lần lượt.</p>
<pre><code>            +-------- Bộ nhớ ---------+
            | chương trình | dữ liệu  |
            +------------^------------+
                         | bus
     Nhập --> +--- CPU (ALU + Điều khiển) ---+ --> Xuất
</code></pre>
<div class="callout"><span class="badge">Ý chính</span> Ý tưởng <strong>chương trình lưu sẵn</strong> — lệnh nằm chung bộ nhớ với dữ liệu — là lý do máy tính đa dụng. Nạp chương trình mới, chứ không phải đấu lại dây, mới đổi việc nó làm.</div>`,
  ]]);

const c1q = quiz('csi106-quiz-1', 'Quiz 1 — Computers & von Neumann|||Quiz 1 — Máy tính & von Neumann', [
  { id: 'q1', question: 'Điểm cốt lõi của mô hình von Neumann là?', options: ['Chương trình và dữ liệu nằm chung một bộ nhớ', 'Không có CPU', 'Mỗi lệnh cần một chip riêng', 'Dữ liệu chỉ ở đĩa'], correctIndex: 0, explanation: 'Ý "chương trình lưu sẵn": lệnh và dữ liệu chung bộ nhớ → máy đa dụng.' },
  { id: 'q2', question: 'Đâu là PHẦN MỀM?', options: ['CPU', 'RAM', 'Hệ điều hành', 'Ổ đĩa'], correctIndex: 2, explanation: 'Phần mềm là lệnh/dữ liệu (OS, app); CPU/RAM/đĩa là phần cứng.' },
  { id: 'q3', question: 'Công nghệ đặc trưng cho máy tính thế hệ 1?', options: ['Vi xử lý', 'Transistor', 'Ống chân không', 'Mạch tích hợp'], correctIndex: 2, explanation: 'Thế hệ 1 dùng ống chân không (vd ENIAC).' },
]);

const c2 = doc('csi106-2-1-data-representation', '2.1 — Number systems & data representation|||2.1 — Hệ đếm & biểu diễn dữ liệu',
  'Bit/byte; nhị phân & hex; đổi hệ đếm; số âm bằng bù 2; số thực (dấu phẩy động, ý niệm); ký tự ASCII/Unicode; ảnh/âm thanh là số.',
  [[
    `<span class="eyebrow">CSI106 · Chapter 2 · Lesson 2.1</span>
<h2>Number systems &amp; data representation</h2>
<h3>Bits, bytes and bases</h3>
<p>A computer stores everything as <strong>bits</strong> (0 or 1). Eight bits make a <strong>byte</strong>. We write bits in <strong>binary</strong> (base 2) and, for shorthand, <strong>hexadecimal</strong> (base 16, digits 0-9 then A-F, where one hex digit = 4 bits).</p>
<pre><code>Binary place values:  128  64  32  16   8   4   2   1
1011 0010 (binary) = 128 + 32 + 16 + 2   = 178 (decimal) = B2 (hex)
</code></pre>
<h3>Converting</h3>
<p>Decimal → binary: repeatedly divide by 2 and read remainders bottom-up. Binary → hex: group bits in fours from the right and translate each group.</p>
<h3>Negative numbers: two's complement</h3>
<p>To store a negative number, computers use <strong>two's complement</strong>: invert every bit of the positive value, then add 1. The top bit becomes the sign, and normal addition "just works" for negatives too.</p>
<pre><code>+5 in 8 bits        = 0000 0101
invert              = 1111 1010
add 1  -> -5        = 1111 1011
</code></pre>
<h3>Real numbers, text &amp; media</h3>
<ul>
<li><strong>Real numbers</strong> use <strong>floating point</strong> (a sign, an exponent and a fraction) — like scientific notation in binary; it trades exactness for range.</li>
<li><strong>Text</strong> maps characters to numbers: <strong>ASCII</strong> (128 symbols, English) grew into <strong>Unicode</strong> (every language, emoji), usually stored as <strong>UTF-8</strong>.</li>
<li><strong>Images</strong> are grids of pixels (each a number for R,G,B); <strong>sound</strong> is samples of a wave. All media is ultimately numbers.</li>
</ul>
<div class="callout"><span class="badge">Key idea</span> There is only one kind of thing in memory — a pattern of bits. What it <em>means</em> (a number, a letter, a colour) depends entirely on how the program chooses to interpret it.</div>`,
    `<span class="eyebrow">CSI106 · Chương 2 · Bài 2.1</span>
<h2>Hệ đếm &amp; biểu diễn dữ liệu</h2>
<h3>Bit, byte và hệ đếm</h3>
<p>Máy tính lưu mọi thứ dưới dạng <strong>bit</strong> (0 hoặc 1). Tám bit là một <strong>byte</strong>. Ta viết bit theo <strong>nhị phân</strong> (cơ số 2) và, cho gọn, <strong>thập lục phân (hex)</strong> (cơ số 16, chữ số 0-9 rồi A-F, mỗi chữ hex = 4 bit).</p>
<pre><code>Trọng số nhị phân:   128  64  32  16   8   4   2   1
1011 0010 (nhị phân) = 128 + 32 + 16 + 2  = 178 (thập phân) = B2 (hex)
</code></pre>
<h3>Chuyển đổi</h3>
<p>Thập phân → nhị phân: chia liên tiếp cho 2, đọc số dư từ dưới lên. Nhị phân → hex: gom bit thành nhóm 4 từ phải sang, dịch mỗi nhóm.</p>
<h3>Số âm: bù 2</h3>
<p>Để lưu số âm, máy dùng <strong>bù 2 (two's complement)</strong>: đảo mọi bit của giá trị dương rồi cộng 1. Bit cao nhất thành dấu, và phép cộng thường "chạy đúng" cả với số âm.</p>
<pre><code>+5 trong 8 bit      = 0000 0101
đảo bit             = 1111 1010
cộng 1  -> -5       = 1111 1011
</code></pre>
<h3>Số thực, chữ &amp; media</h3>
<ul>
<li><strong>Số thực</strong> dùng <strong>dấu phẩy động (floating point)</strong> (dấu, số mũ, phần định trị) — như ký hiệu khoa học ở dạng nhị phân; đổi độ chính xác lấy dải giá trị.</li>
<li><strong>Chữ</strong> ánh xạ ký tự sang số: <strong>ASCII</strong> (128 ký hiệu, tiếng Anh) lớn lên thành <strong>Unicode</strong> (mọi ngôn ngữ, emoji), thường lưu dạng <strong>UTF-8</strong>.</li>
<li><strong>Ảnh</strong> là lưới điểm ảnh (mỗi điểm là số R,G,B); <strong>âm thanh</strong> là các mẫu của một sóng. Mọi media rốt cuộc đều là số.</li>
</ul>
<div class="callout"><span class="badge">Ý chính</span> Trong bộ nhớ chỉ có một loại thứ — một chuỗi bit. Nó <em>nghĩa là gì</em> (một số, một chữ, một màu) hoàn toàn phụ thuộc vào cách chương trình chọn diễn giải nó.</div>`,
  ]]);

const c2q = quiz('csi106-quiz-2', 'Quiz 2 — Data representation|||Quiz 2 — Biểu diễn dữ liệu', [
  { id: 'q1', question: 'Số nhị phân 1011 0010 bằng bao nhiêu ở hệ thập phân?', options: ['160', '178', '182', '210'], correctIndex: 1, explanation: '128+32+16+2 = 178 (và bằng B2 hex).' },
  { id: 'q2', question: 'Máy tính biểu diễn số nguyên ÂM chủ yếu bằng?', options: ['Dấu chấm động', 'Mã ASCII', 'Bù 2 (two\'s complement)', 'Hex'], correctIndex: 2, explanation: 'Bù 2: đảo bit rồi +1; phép cộng chạy đúng cho cả số âm.' },
  { id: 'q3', question: 'Chuẩn mã hoá ký tự bao trùm mọi ngôn ngữ & emoji là?', options: ['ASCII', 'Unicode', 'Nhị phân', 'Bù 2'], correctIndex: 1, explanation: 'Unicode (thường lưu UTF-8) mở rộng từ ASCII cho mọi ngôn ngữ.' },
]);

const c3 = doc('csi106-3-1-boolean-logic', '3.1 — Boolean algebra & logic circuits|||3.1 — Đại số Boole & mạch logic',
  'Giá trị đúng/sai; phép AND/OR/NOT (và NAND/XOR); bảng chân trị; cổng logic; ghép cổng thành mạch (vd bộ cộng); vì sao logic là nền của CPU.',
  [[
    `<span class="eyebrow">CSI106 · Chapter 3 · Lesson 3.1</span>
<h2>Boolean algebra &amp; logic circuits</h2>
<h3>Truth, and three operations</h3>
<p><strong>Boolean algebra</strong> works with just two values — <strong>true (1)</strong> and <strong>false (0)</strong> — and three basic operations:</p>
<table><thead><tr><th>A</th><th>B</th><th>A AND B</th><th>A OR B</th><th>NOT A</th></tr></thead><tbody>
<tr><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td></tr>
<tr><td>0</td><td>1</td><td>0</td><td>1</td><td>1</td></tr>
<tr><td>1</td><td>0</td><td>0</td><td>1</td><td>0</td></tr>
<tr><td>1</td><td>1</td><td>1</td><td>1</td><td>0</td></tr>
</tbody></table>
<p><strong>AND</strong> is true only when both inputs are true; <strong>OR</strong> when at least one is; <strong>NOT</strong> flips a value. <strong>XOR</strong> (exclusive-or) is true when inputs <em>differ</em>.</p>
<h3>Gates &amp; circuits</h3>
<p>Each operation is a physical <strong>logic gate</strong> (built from transistors). Wire gates together and you build anything a CPU does. For example, a <strong>half-adder</strong> adds two bits: the SUM is <code>A XOR B</code> and the CARRY is <code>A AND B</code>.</p>
<pre><code>Half-adder:
  A --+--[XOR]-- Sum
  B --+
  A --+--[AND]-- Carry
  B --+
  (1 + 1 -> Sum 0, Carry 1)
</code></pre>
<div class="callout"><span class="badge">Key idea</span> From three tiny rules (AND, OR, NOT) you can build addition, comparison, memory — an entire processor. Boolean logic is the bridge from "bits" to "a machine that computes".</div>`,
    `<span class="eyebrow">CSI106 · Chương 3 · Bài 3.1</span>
<h2>Đại số Boole &amp; mạch logic</h2>
<h3>Đúng/sai, và ba phép toán</h3>
<p><strong>Đại số Boole</strong> chỉ làm việc với hai giá trị — <strong>đúng (1)</strong> và <strong>sai (0)</strong> — cùng ba phép cơ bản:</p>
<table><thead><tr><th>A</th><th>B</th><th>A AND B</th><th>A OR B</th><th>NOT A</th></tr></thead><tbody>
<tr><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td></tr>
<tr><td>0</td><td>1</td><td>0</td><td>1</td><td>1</td></tr>
<tr><td>1</td><td>0</td><td>0</td><td>1</td><td>0</td></tr>
<tr><td>1</td><td>1</td><td>1</td><td>1</td><td>0</td></tr>
</tbody></table>
<p><strong>AND</strong> chỉ đúng khi cả hai đầu vào đúng; <strong>OR</strong> đúng khi ít nhất một đúng; <strong>NOT</strong> đảo giá trị. <strong>XOR</strong> (hoặc-loại-trừ) đúng khi hai đầu vào <em>khác nhau</em>.</p>
<h3>Cổng &amp; mạch</h3>
<p>Mỗi phép toán là một <strong>cổng logic</strong> vật lý (dựng từ transistor). Ghép các cổng lại là dựng được mọi việc CPU làm. Ví dụ, một <strong>bộ cộng bán phần (half-adder)</strong> cộng hai bit: TỔNG là <code>A XOR B</code> và NHỚ là <code>A AND B</code>.</p>
<pre><code>Bộ cộng bán phần:
  A --+--[XOR]-- Tổng
  B --+
  A --+--[AND]-- Nhớ
  B --+
  (1 + 1 -> Tổng 0, Nhớ 1)
</code></pre>
<div class="callout"><span class="badge">Ý chính</span> Từ ba quy tắc bé xíu (AND, OR, NOT) bạn dựng được phép cộng, so sánh, bộ nhớ — cả một bộ xử lý. Logic Boole là cây cầu từ "bit" tới "cỗ máy biết tính".</div>`,
  ]]);

const c3q = quiz('csi106-quiz-3', 'Quiz 3 — Boolean logic|||Quiz 3 — Logic Boole', [
  { id: 'q1', question: 'Cổng AND cho đầu ra 1 khi nào?', options: ['Khi ít nhất một đầu vào là 1', 'Chỉ khi CẢ hai đầu vào là 1', 'Khi hai đầu vào khác nhau', 'Luôn luôn'], correctIndex: 1, explanation: 'AND = 1 chỉ khi mọi đầu vào = 1.' },
  { id: 'q2', question: 'Phép cho ra 1 khi hai đầu vào KHÁC nhau là?', options: ['AND', 'OR', 'XOR', 'NOT'], correctIndex: 2, explanation: 'XOR (hoặc-loại-trừ) đúng khi A và B khác nhau.' },
  { id: 'q3', question: 'Trong bộ cộng bán phần, bit TỔNG (sum) tính bằng?', options: ['A AND B', 'A OR B', 'A XOR B', 'NOT A'], correctIndex: 2, explanation: 'Sum = A XOR B; Carry (nhớ) = A AND B.' },
]);

const c4 = doc('csi106-4-1-cpu-memory', '4.1 — CPU, memory & instruction execution|||4.1 — CPU, bộ nhớ & thực thi lệnh',
  'Bên trong CPU (ALU, thanh ghi, control unit, PC); phân cấp bộ nhớ (thanh ghi→cache→RAM→đĩa); chu trình fetch-decode-execute; xung nhịp.',
  [[
    `<span class="eyebrow">CSI106 · Chapter 4 · Lesson 4.1</span>
<h2>CPU, memory &amp; how an instruction runs</h2>
<h3>Inside the CPU</h3>
<ul>
<li><strong>ALU</strong> (Arithmetic Logic Unit) — does the maths and logic (add, compare, AND/OR).</li>
<li><strong>Registers</strong> — a handful of tiny, ultra-fast storage slots the CPU works in.</li>
<li><strong>Control unit</strong> — directs everything; the <strong>Program Counter (PC)</strong> holds the address of the next instruction.</li>
</ul>
<h3>The memory hierarchy</h3>
<p>Faster memory is smaller and costlier, so computers use a <strong>hierarchy</strong> — hot data sits close to the CPU:</p>
<pre><code>Registers  : tiny,  ~1 cycle     (fastest)
L1/L2 cache: small, a few cycles
RAM        : GBs,   ~100 cycles
SSD / disk : TBs,   very slow     (largest)
</code></pre>
<h3>The fetch-decode-execute cycle</h3>
<p>The CPU runs one instruction at a time, forever, in three steps:</p>
<pre><code>1. FETCH   : read the instruction at address in PC
2. DECODE  : work out what it means (which operation, which data)
3. EXECUTE : do it (ALU op, move data, or jump)
           : advance PC, then repeat
</code></pre>
<p>A <strong>clock</strong> paces these steps; its speed (e.g. 3&nbsp;GHz = 3 billion ticks/second) roughly sets how many steps per second the CPU can take. Modern CPUs also use several <strong>cores</strong> to run cycles in parallel.</p>
<div class="callout"><span class="badge">Key idea</span> A CPU is not "smart" — it just repeats fetch → decode → execute billions of times a second. Speed comes from a fast clock, caches that avoid slow RAM, and multiple cores.</div>`,
    `<span class="eyebrow">CSI106 · Chương 4 · Bài 4.1</span>
<h2>CPU, bộ nhớ &amp; cách một lệnh chạy</h2>
<h3>Bên trong CPU</h3>
<ul>
<li><strong>ALU</strong> (khối số học-logic) — làm toán và logic (cộng, so sánh, AND/OR).</li>
<li><strong>Thanh ghi (registers)</strong> — vài ô nhớ tí hon, cực nhanh mà CPU làm việc trực tiếp trong đó.</li>
<li><strong>Khối điều khiển</strong> — chỉ huy mọi thứ; <strong>bộ đếm chương trình (PC)</strong> giữ địa chỉ lệnh kế tiếp.</li>
</ul>
<h3>Phân cấp bộ nhớ</h3>
<p>Bộ nhớ nhanh hơn thì nhỏ và đắt hơn, nên máy dùng một <strong>phân cấp</strong> — dữ liệu nóng nằm gần CPU:</p>
<pre><code>Thanh ghi : tí hon, ~1 chu kỳ     (nhanh nhất)
Cache L1/L2: nhỏ,   vài chu kỳ
RAM        : hàng GB, ~100 chu kỳ
SSD / đĩa  : hàng TB, rất chậm    (lớn nhất)
</code></pre>
<h3>Chu trình fetch-decode-execute</h3>
<p>CPU chạy từng lệnh một, mãi mãi, theo ba bước:</p>
<pre><code>1. FETCH   : đọc lệnh ở địa chỉ trong PC
2. DECODE  : hiểu nó nghĩa gì (phép nào, dữ liệu nào)
3. EXECUTE : thực hiện (phép ALU, chuyển dữ liệu, hoặc nhảy)
           : tăng PC, rồi lặp lại
</code></pre>
<p>Một <strong>xung nhịp (clock)</strong> điều nhịp các bước này; tốc độ của nó (vd 3&nbsp;GHz = 3 tỉ nhịp/giây) quyết định thô số bước mỗi giây CPU làm được. CPU hiện đại còn dùng nhiều <strong>nhân (core)</strong> để chạy song song.</p>
<div class="callout"><span class="badge">Ý chính</span> CPU không "thông minh" — nó chỉ lặp fetch → decode → execute hàng tỉ lần mỗi giây. Tốc độ đến từ xung nhịp nhanh, cache tránh RAM chậm, và nhiều nhân.</div>`,
  ]]);

const c4q = quiz('csi106-quiz-4', 'Quiz 4 — CPU & memory|||Quiz 4 — CPU & bộ nhớ', [
  { id: 'q1', question: 'Ba bước của chu trình lệnh CPU theo đúng thứ tự?', options: ['Decode → Fetch → Execute', 'Fetch → Decode → Execute', 'Execute → Fetch → Decode', 'Fetch → Execute → Decode'], correctIndex: 1, explanation: 'Fetch (lấy) → Decode (giải mã) → Execute (thực thi), rồi lặp.' },
  { id: 'q2', question: 'Bộ phận nào của CPU thực hiện phép cộng và so sánh?', options: ['Thanh ghi', 'ALU', 'PC (bộ đếm chương trình)', 'Cache'], correctIndex: 1, explanation: 'ALU (khối số học-logic) làm toán và logic.' },
  { id: 'q3', question: 'Sắp theo tốc độ NHANH → CHẬM là?', options: ['RAM → cache → thanh ghi → đĩa', 'Thanh ghi → cache → RAM → đĩa', 'Đĩa → RAM → cache → thanh ghi', 'Cache → thanh ghi → đĩa → RAM'], correctIndex: 1, explanation: 'Phân cấp: thanh ghi (nhanh nhất, nhỏ nhất) → cache → RAM → đĩa.' },
]);

const c5 = doc('csi106-5-1-operating-systems', '5.1 — Operating systems|||5.1 — Hệ điều hành',
  'HĐH làm gì (lớp giữa phần cứng & ứng dụng); quản lý tiến trình (đa nhiệm, lập lịch); quản lý bộ nhớ (ảo hoá); hệ thống tệp; ví dụ Windows/Linux/macOS.',
  [[
    `<span class="eyebrow">CSI106 · Chapter 5 · Lesson 5.1</span>
<h2>Operating systems</h2>
<h3>What an OS does</h3>
<p>An <strong>operating system (OS)</strong> sits between hardware and your apps. It shares the machine's resources fairly and safely, and hides messy hardware details behind clean services. Its three big jobs:</p>
<h3>1. Process management</h3>
<p>A running program is a <strong>process</strong>. The OS runs many at once by <strong>scheduling</strong> — giving each a slice of CPU time and switching rapidly, so they appear to run "simultaneously" even on one core.</p>
<h3>2. Memory management</h3>
<p>The OS gives each process its own <strong>virtual memory</strong> — the illusion of a private, contiguous memory — while mapping it to real RAM and protecting processes from reading each other's data.</p>
<h3>3. File systems</h3>
<p>Disks store raw blocks; the OS organises them into <strong>files and folders</strong>, tracks where each file lives, and enforces permissions (who may read/write).</p>
<pre><code>          Applications (browser, editor, games)
        -----------------------------------------
        Operating system: processes | memory | files
        -----------------------------------------
          Hardware (CPU, RAM, disk, devices)
</code></pre>
<p>Common OSes: <strong>Windows</strong>, <strong>macOS</strong>, and <strong>Linux</strong> (which also powers most servers and Android phones).</p>
<div class="callout"><span class="badge">Key idea</span> The OS is a <em>resource manager</em> and an <em>illusionist</em>: it makes one CPU look like many, scattered disk blocks look like tidy files, and shared RAM look private — so every app can be written as if it owns the machine.</div>`,
    `<span class="eyebrow">CSI106 · Chương 5 · Bài 5.1</span>
<h2>Hệ điều hành</h2>
<h3>Hệ điều hành làm gì</h3>
<p>Một <strong>hệ điều hành (HĐH)</strong> nằm giữa phần cứng và ứng dụng của bạn. Nó chia sẻ tài nguyên máy một cách công bằng, an toàn, và giấu các chi tiết phần cứng rối rắm sau những dịch vụ gọn gàng. Ba việc lớn:</p>
<h3>1. Quản lý tiến trình</h3>
<p>Một chương trình đang chạy là một <strong>tiến trình (process)</strong>. HĐH chạy nhiều tiến trình cùng lúc bằng <strong>lập lịch (scheduling)</strong> — cho mỗi cái một lát thời gian CPU rồi chuyển rất nhanh, nên chúng trông như chạy "đồng thời" dù chỉ một nhân.</p>
<h3>2. Quản lý bộ nhớ</h3>
<p>HĐH cho mỗi tiến trình một <strong>bộ nhớ ảo</strong> riêng — ảo giác về một vùng nhớ liền mạch, riêng tư — trong khi ánh xạ nó vào RAM thật và ngăn các tiến trình đọc dữ liệu của nhau.</p>
<h3>3. Hệ thống tệp</h3>
<p>Đĩa lưu các khối thô; HĐH tổ chức chúng thành <strong>tệp và thư mục</strong>, theo dõi mỗi tệp nằm ở đâu, và áp quyền (ai được đọc/ghi).</p>
<pre><code>          Ứng dụng (trình duyệt, soạn thảo, game)
        -----------------------------------------
        Hệ điều hành: tiến trình | bộ nhớ | tệp
        -----------------------------------------
          Phần cứng (CPU, RAM, đĩa, thiết bị)
</code></pre>
<p>HĐH phổ biến: <strong>Windows</strong>, <strong>macOS</strong>, và <strong>Linux</strong> (cũng chạy phần lớn máy chủ và điện thoại Android).</p>
<div class="callout"><span class="badge">Ý chính</span> HĐH là <em>người quản lý tài nguyên</em> và <em>nhà ảo thuật</em>: biến một CPU thành nhiều, biến các khối đĩa rải rác thành tệp gọn, biến RAM chung thành riêng — để mỗi app viết ra như thể nó sở hữu cả máy.</div>`,
  ]]);

const c5q = quiz('csi106-quiz-5', 'Quiz 5 — Operating systems|||Quiz 5 — Hệ điều hành', [
  { id: 'q1', question: 'Một chương trình ĐANG CHẠY được HĐH gọi là?', options: ['Một tệp', 'Một tiến trình (process)', 'Một thanh ghi', 'Một cổng logic'], correctIndex: 1, explanation: 'Tiến trình = chương trình đang chạy, có tài nguyên riêng.' },
  { id: 'q2', question: 'HĐH tạo cảm giác nhiều chương trình chạy "cùng lúc" trên một nhân nhờ?', options: ['Bộ nhớ ảo', 'Lập lịch (chia lát thời gian CPU, chuyển nhanh)', 'Hệ thống tệp', 'Cache'], correctIndex: 1, explanation: 'Scheduling cấp lát thời gian CPU luân phiên rất nhanh.' },
  { id: 'q3', question: '"Bộ nhớ ảo" mang lại điều gì cho mỗi tiến trình?', options: ['Xoá dữ liệu khi tắt máy', 'Ảo giác vùng nhớ riêng, liền mạch, được bảo vệ', 'Tăng xung nhịp CPU', 'Nén tệp'], correctIndex: 1, explanation: 'Mỗi tiến trình thấy không gian nhớ riêng, cách ly nhau.' },
]);

const c6 = doc('csi106-6-1-networks-internet', '6.1 — Networks & the Internet|||6.1 — Mạng & Internet',
  'Mạng là gì; mô hình phân tầng (link/internet/transport/application); địa chỉ IP & DNS; TCP/IP & gói tin; web (HTTP, URL, client-server).',
  [[
    `<span class="eyebrow">CSI106 · Chapter 6 · Lesson 6.1</span>
<h2>Networks &amp; the Internet</h2>
<h3>What is a network?</h3>
<p>A <strong>network</strong> connects computers so they can exchange data. The <strong>Internet</strong> is a network of networks. To keep it manageable, networking is split into <strong>layers</strong>, each with one job:</p>
<table><thead><tr><th>Layer</th><th>Job</th><th>Example</th></tr></thead><tbody>
<tr><td>Application</td><td>the actual service</td><td>HTTP, email, DNS</td></tr>
<tr><td>Transport</td><td>reliable delivery, ports</td><td>TCP, UDP</td></tr>
<tr><td>Internet</td><td>addressing &amp; routing</td><td>IP</td></tr>
<tr><td>Link</td><td>the physical hop</td><td>Wi-Fi, Ethernet</td></tr>
</tbody></table>
<h3>Addresses &amp; names</h3>
<p>Every device has an <strong>IP address</strong> (e.g. 142.250.72.14). Because numbers are hard to remember, <strong>DNS</strong> (the Domain Name System) translates a name like <code>example.com</code> into its IP — the Internet's phone book.</p>
<h3>Packets &amp; TCP/IP</h3>
<p>Data is chopped into small <strong>packets</strong>, each labelled with source and destination IP. <strong>IP</strong> routes each packet hop by hop; <strong>TCP</strong> reassembles them in order and re-sends any that are lost, giving a reliable stream.</p>
<h3>The web</h3>
<p>The <strong>World Wide Web</strong> runs on the Internet. Your browser (a <strong>client</strong>) sends an <strong>HTTP</strong> request to a <strong>server</strong>; the server replies with a page. A <strong>URL</strong> (<code>https://site.com/page</code>) names the protocol, host and path.</p>
<div class="callout"><span class="badge">Key idea</span> The Internet works because each layer trusts the one below: an app just says "send this to that IP", and lower layers handle routing, retries and the physical wire. Layering is what lets a global network stay understandable.</div>`,
    `<span class="eyebrow">CSI106 · Chương 6 · Bài 6.1</span>
<h2>Mạng &amp; Internet</h2>
<h3>Mạng là gì?</h3>
<p>Một <strong>mạng</strong> nối các máy tính để chúng trao đổi dữ liệu. <strong>Internet</strong> là mạng của các mạng. Để dễ quản lý, mạng được chia thành các <strong>tầng</strong>, mỗi tầng một việc:</p>
<table><thead><tr><th>Tầng</th><th>Việc</th><th>Ví dụ</th></tr></thead><tbody>
<tr><td>Ứng dụng</td><td>dịch vụ thực tế</td><td>HTTP, email, DNS</td></tr>
<tr><td>Giao vận</td><td>giao tin cậy, cổng</td><td>TCP, UDP</td></tr>
<tr><td>Internet</td><td>đánh địa chỉ &amp; định tuyến</td><td>IP</td></tr>
<tr><td>Liên kết</td><td>chặng vật lý</td><td>Wi-Fi, Ethernet</td></tr>
</tbody></table>
<h3>Địa chỉ &amp; tên</h3>
<p>Mỗi thiết bị có một <strong>địa chỉ IP</strong> (vd 142.250.72.14). Vì số khó nhớ, <strong>DNS</strong> (hệ thống tên miền) dịch một cái tên như <code>example.com</code> ra IP của nó — cuốn danh bạ của Internet.</p>
<h3>Gói tin &amp; TCP/IP</h3>
<p>Dữ liệu được cắt thành các <strong>gói tin (packet)</strong> nhỏ, mỗi gói ghi IP nguồn và đích. <strong>IP</strong> định tuyến từng gói qua từng chặng; <strong>TCP</strong> ghép chúng lại đúng thứ tự và gửi lại gói nào bị mất, cho ra một luồng tin cậy.</p>
<h3>Web</h3>
<p><strong>World Wide Web</strong> chạy trên Internet. Trình duyệt của bạn (một <strong>client</strong>) gửi yêu cầu <strong>HTTP</strong> tới một <strong>server</strong>; server trả về trang. Một <strong>URL</strong> (<code>https://site.com/page</code>) nêu giao thức, máy chủ và đường dẫn.</p>
<div class="callout"><span class="badge">Ý chính</span> Internet chạy được vì mỗi tầng tin tầng dưới: app chỉ nói "gửi cái này tới IP kia", các tầng dưới lo định tuyến, gửi lại và dây vật lý. Phân tầng là thứ giữ cho một mạng toàn cầu vẫn hiểu được.</div>`,
  ]]);

const c6q = quiz('csi106-quiz-6', 'Quiz 6 — Networks & Internet|||Quiz 6 — Mạng & Internet', [
  { id: 'q1', question: 'DNS làm nhiệm vụ gì?', options: ['Cắt dữ liệu thành gói', 'Dịch tên miền (example.com) sang địa chỉ IP', 'Mã hoá mật khẩu', 'Chạy hệ điều hành'], correctIndex: 1, explanation: 'DNS là "danh bạ": tên → IP.' },
  { id: 'q2', question: 'Giao thức nào đảm bảo dữ liệu tới ĐỦ và ĐÚNG thứ tự (gửi lại gói mất)?', options: ['IP', 'TCP', 'DNS', 'HTTP'], correctIndex: 1, explanation: 'TCP ghép gói đúng thứ tự và gửi lại gói bị mất; IP lo định tuyến.' },
  { id: 'q3', question: 'Trong web, trình duyệt đóng vai trò?', options: ['Server', 'Client gửi yêu cầu HTTP', 'Router', 'DNS'], correctIndex: 1, explanation: 'Mô hình client-server: trình duyệt (client) yêu cầu, server trả trang.' },
]);

const c7 = doc('csi106-7-1-algorithms', '7.1 — Programming concepts & algorithms|||7.1 — Khái niệm lập trình & thuật toán',
  'Thuật toán là gì; biến & kiểu; ba cấu trúc điều khiển (tuần tự/rẽ nhánh/lặp); pseudocode; độ phức tạp Big-O cơ bản (tìm kiếm tuyến tính vs nhị phân).',
  [[
    `<span class="eyebrow">CSI106 · Chapter 7 · Lesson 7.1</span>
<h2>Programming concepts &amp; algorithms</h2>
<h3>Algorithm = a precise recipe</h3>
<p>An <strong>algorithm</strong> is a finite, unambiguous sequence of steps that solves a problem. A <strong>program</strong> is an algorithm written in a language a computer runs.</p>
<h3>The building blocks</h3>
<ul>
<li><strong>Variables</strong> hold values; each has a <strong>type</strong> (integer, text, boolean).</li>
<li><strong>Sequence</strong> — do steps in order.</li>
<li><strong>Selection</strong> — choose a path (<code>if / else</code>).</li>
<li><strong>Iteration</strong> — repeat (<code>while / for</code> loops).</li>
</ul>
<p>Remarkably, those three control structures are enough to express <em>any</em> computation.</p>
<pre><code>function findMax(list):
    max = list[0]
    for each item in list:        # iteration
        if item &gt; max:            # selection
            max = item
    return max
</code></pre>
<h3>How fast? Big-O</h3>
<p>We compare algorithms by how their work grows with input size <em>n</em>, written <strong>Big-O</strong>. Example: searching a sorted list.</p>
<table><thead><tr><th>Method</th><th>Idea</th><th>Cost</th></tr></thead><tbody>
<tr><td>Linear search</td><td>check items one by one</td><td>O(n)</td></tr>
<tr><td>Binary search</td><td>halve the range each step (sorted)</td><td>O(log n)</td></tr>
</tbody></table>
<p>For a million items, linear search may check ~1,000,000; binary search checks only ~20. Choosing the right algorithm matters far more than a faster CPU.</p>
<div class="callout"><span class="badge">Key idea</span> Correctness first, then efficiency. Big-O ignores hardware and constants to answer one question: as the data grows, does the work grow gently (O(log n), O(n)) or explosively (O(n²))?</div>`,
    `<span class="eyebrow">CSI106 · Chương 7 · Bài 7.1</span>
<h2>Khái niệm lập trình &amp; thuật toán</h2>
<h3>Thuật toán = công thức chính xác</h3>
<p>Một <strong>thuật toán</strong> là dãy bước hữu hạn, rõ ràng, không mập mờ, giải một bài toán. Một <strong>chương trình</strong> là thuật toán viết bằng ngôn ngữ máy chạy được.</p>
<h3>Các khối dựng</h3>
<ul>
<li><strong>Biến</strong> giữ giá trị; mỗi biến có một <strong>kiểu</strong> (số nguyên, chữ, boolean).</li>
<li><strong>Tuần tự</strong> — làm các bước theo thứ tự.</li>
<li><strong>Rẽ nhánh</strong> — chọn hướng đi (<code>if / else</code>).</li>
<li><strong>Lặp</strong> — làm lại (<code>while / for</code>).</li>
</ul>
<p>Đáng kinh ngạc là ba cấu trúc điều khiển đó đủ để diễn đạt <em>mọi</em> phép tính.</p>
<pre><code>function timMax(list):
    max = list[0]
    for mỗi phần tử trong list:   # lặp
        if phần tử &gt; max:         # rẽ nhánh
            max = phần tử
    return max
</code></pre>
<h3>Nhanh cỡ nào? Big-O</h3>
<p>Ta so thuật toán theo cách khối lượng việc tăng theo cỡ đầu vào <em>n</em>, ký hiệu <strong>Big-O</strong>. Ví dụ: tìm trong danh sách đã sắp.</p>
<table><thead><tr><th>Cách</th><th>Ý tưởng</th><th>Chi phí</th></tr></thead><tbody>
<tr><td>Tìm tuyến tính</td><td>xét từng phần tử một</td><td>O(n)</td></tr>
<tr><td>Tìm nhị phân</td><td>chia đôi khoảng mỗi bước (đã sắp)</td><td>O(log n)</td></tr>
</tbody></table>
<p>Với một triệu phần tử, tìm tuyến tính có thể xét ~1.000.000; tìm nhị phân chỉ xét ~20. Chọn đúng thuật toán quan trọng hơn nhiều so với một CPU nhanh hơn.</p>
<div class="callout"><span class="badge">Ý chính</span> Đúng trước, rồi mới nhanh. Big-O bỏ qua phần cứng và hằng số để trả lời một câu: khi dữ liệu lớn lên, việc tăng nhẹ nhàng (O(log n), O(n)) hay bùng nổ (O(n²))?</div>`,
  ]]);

const c7q = quiz('csi106-quiz-7', 'Quiz 7 — Algorithms|||Quiz 7 — Thuật toán', [
  { id: 'q1', question: 'Ba cấu trúc điều khiển cơ bản đủ để diễn đạt mọi phép tính là?', options: ['Cộng, trừ, nhân', 'Tuần tự, rẽ nhánh, lặp', 'Biến, hàm, lớp', 'Nhập, xử lý, xuất'], correctIndex: 1, explanation: 'Tuần tự (sequence), rẽ nhánh (selection), lặp (iteration).' },
  { id: 'q2', question: 'Độ phức tạp của tìm kiếm NHỊ PHÂN trên danh sách đã sắp là?', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], correctIndex: 1, explanation: 'Mỗi bước chia đôi khoảng → O(log n).' },
  { id: 'q3', question: 'Big-O đo điều gì?', options: ['Giá tiền CPU', 'Cách khối lượng việc TĂNG theo cỡ đầu vào n', 'Dung lượng đĩa', 'Số dòng mã'], correctIndex: 1, explanation: 'Big-O mô tả tốc độ tăng của công việc theo n, bỏ hằng số/phần cứng.' },
]);

const c8 = doc('csi106-8-1-data-structures-databases', '8.1 — Data structures & intro to databases|||8.1 — Cấu trúc dữ liệu & nhập môn CSDL',
  'Cấu trúc dữ liệu cơ bản (mảng, danh sách liên kết, ngăn xếp, hàng đợi, cây, bảng băm) và khi nào dùng; CSDL quan hệ, bảng/khoá, SQL nhập môn.',
  [[
    `<span class="eyebrow">CSI106 · Chapter 8 · Lesson 8.1</span>
<h2>Data structures &amp; a first look at databases</h2>
<h3>Organising data in memory</h3>
<p>A <strong>data structure</strong> is a way of arranging data so certain operations are fast. Common ones:</p>
<table><thead><tr><th>Structure</th><th>Shape</th><th>Good at</th></tr></thead><tbody>
<tr><td>Array</td><td>fixed row of slots</td><td>instant access by index</td></tr>
<tr><td>Linked list</td><td>nodes pointing to the next</td><td>easy insert/remove</td></tr>
<tr><td>Stack</td><td>last-in first-out (LIFO)</td><td>undo, call history</td></tr>
<tr><td>Queue</td><td>first-in first-out (FIFO)</td><td>task/print lines</td></tr>
<tr><td>Tree</td><td>branching hierarchy</td><td>sorted data, files</td></tr>
<tr><td>Hash table</td><td>key → value by hashing</td><td>near-instant lookup</td></tr>
</tbody></table>
<p>Choosing the right one is how algorithms hit their Big-O: a hash table turns a slow O(n) search into ~O(1).</p>
<h3>Databases: data that outlives the program</h3>
<p>A <strong>database</strong> stores data permanently and lets many users query it safely. The <strong>relational</strong> model organises data into <strong>tables</strong> (rows = records, columns = fields). A <strong>primary key</strong> uniquely identifies each row; a <strong>foreign key</strong> links tables together.</p>
<pre><code>Students                    Enrollments
+----+-------+              +-----------+--------+
| id | name  |              | studentId | course |
+----+-------+              +-----------+--------+
|  1 | An    |   &lt;--- link ---   1        | CSI106 |
|  2 | Bình  |              |    2        | MAE101 |
+----+-------+              +-----------+--------+
</code></pre>
<p>We query with <strong>SQL</strong>: <code>SELECT name FROM Students WHERE id = 1;</code> asks for An's name.</p>
<div class="callout"><span class="badge">Key idea</span> Data structures make one program fast; databases make data <em>shared, persistent and consistent</em> across many programs and users. Keys and tables are how the relational model keeps that data tidy.</div>`,
    `<span class="eyebrow">CSI106 · Chương 8 · Bài 8.1</span>
<h2>Cấu trúc dữ liệu &amp; cái nhìn đầu tiên về CSDL</h2>
<h3>Tổ chức dữ liệu trong bộ nhớ</h3>
<p>Một <strong>cấu trúc dữ liệu</strong> là cách sắp xếp dữ liệu để một số thao tác nhanh. Vài loại thường gặp:</p>
<table><thead><tr><th>Cấu trúc</th><th>Hình dạng</th><th>Giỏi việc</th></tr></thead><tbody>
<tr><td>Mảng (array)</td><td>hàng ô cố định</td><td>truy cập tức thì theo chỉ số</td></tr>
<tr><td>Danh sách liên kết</td><td>các nút trỏ tới nút kế</td><td>chèn/xoá dễ</td></tr>
<tr><td>Ngăn xếp (stack)</td><td>vào sau ra trước (LIFO)</td><td>undo, lịch sử gọi hàm</td></tr>
<tr><td>Hàng đợi (queue)</td><td>vào trước ra trước (FIFO)</td><td>hàng chờ in/tác vụ</td></tr>
<tr><td>Cây (tree)</td><td>phân cấp phân nhánh</td><td>dữ liệu sắp xếp, tệp</td></tr>
<tr><td>Bảng băm (hash)</td><td>khoá → giá trị nhờ băm</td><td>tra cứu gần tức thì</td></tr>
</tbody></table>
<p>Chọn đúng loại là cách thuật toán đạt Big-O của nó: bảng băm biến tìm kiếm chậm O(n) thành ~O(1).</p>
<h3>Cơ sở dữ liệu: dữ liệu sống lâu hơn chương trình</h3>
<p>Một <strong>cơ sở dữ liệu (CSDL)</strong> lưu dữ liệu lâu dài và cho nhiều người truy vấn an toàn. Mô hình <strong>quan hệ</strong> tổ chức dữ liệu thành <strong>bảng</strong> (hàng = bản ghi, cột = trường). <strong>Khoá chính</strong> định danh duy nhất mỗi hàng; <strong>khoá ngoại</strong> nối các bảng với nhau.</p>
<pre><code>Students                    Enrollments
+----+-------+              +-----------+--------+
| id | name  |              | studentId | course |
+----+-------+              +-----------+--------+
|  1 | An    |   &lt;--- nối ---    1        | CSI106 |
|  2 | Bình  |              |    2        | MAE101 |
+----+-------+              +-----------+--------+
</code></pre>
<p>Ta truy vấn bằng <strong>SQL</strong>: <code>SELECT name FROM Students WHERE id = 1;</code> hỏi tên của An.</p>
<div class="callout"><span class="badge">Ý chính</span> Cấu trúc dữ liệu làm một chương trình nhanh; CSDL làm dữ liệu <em>được chia sẻ, bền và nhất quán</em> qua nhiều chương trình và người dùng. Khoá và bảng là cách mô hình quan hệ giữ dữ liệu gọn gàng.</div>`,
  ]]);

const c8q = quiz('csi106-quiz-8', 'Quiz 8 — Data structures & DB|||Quiz 8 — Cấu trúc dữ liệu & CSDL', [
  { id: 'q1', question: 'Cấu trúc "vào trước ra trước" (FIFO) là?', options: ['Ngăn xếp (stack)', 'Hàng đợi (queue)', 'Mảng', 'Cây'], correctIndex: 1, explanation: 'Queue = FIFO; stack = LIFO (vào sau ra trước).' },
  { id: 'q2', question: 'Trong CSDL quan hệ, thứ định danh DUY NHẤT mỗi hàng gọi là?', options: ['Khoá ngoại', 'Khoá chính (primary key)', 'Chỉ số mảng', 'Con trỏ'], correctIndex: 1, explanation: 'Khoá chính định danh duy nhất một bản ghi; khoá ngoại nối bảng.' },
  { id: 'q3', question: 'Cấu trúc cho tra cứu key→value gần như O(1) là?', options: ['Danh sách liên kết', 'Bảng băm (hash table)', 'Hàng đợi', 'Mảng chưa sắp'], correctIndex: 1, explanation: 'Bảng băm băm khoá tới vị trí → tra cứu gần tức thì.' },
]);

const c9 = doc('csi106-9-1-security-ethics-ai', '9.1 — Security, professional ethics & intro to AI|||9.1 — An toàn thông tin, đạo đức nghề & nhập môn AI',
  'Bộ ba CIA (bí mật/toàn vẹn/sẵn sàng); mối đe doạ & phòng vệ (mật khẩu, mã hoá, xác thực); đạo đức nghề (quyền riêng tư, bản quyền, bộ quy tắc); AI/ML là gì.',
  [[
    `<span class="eyebrow">CSI106 · Chapter 9 · Lesson 9.1</span>
<h2>Security, ethics &amp; a first look at AI</h2>
<h3>Information security: the CIA triad</h3>
<ul>
<li><strong>Confidentiality</strong> — only authorised people can read the data.</li>
<li><strong>Integrity</strong> — data isn't altered without permission.</li>
<li><strong>Availability</strong> — the system is up when needed.</li>
</ul>
<h3>Threats &amp; defences</h3>
<p>Common threats: <strong>malware</strong>, <strong>phishing</strong> (tricking you into giving credentials), and <strong>weak passwords</strong>. Core defences:</p>
<ul>
<li><strong>Strong, unique passwords</strong> + <strong>multi-factor authentication</strong>.</li>
<li><strong>Encryption</strong> — scramble data so only a key can read it (this is what the padlock/HTTPS gives you).</li>
<li><strong>Updates &amp; least privilege</strong> — patch holes, give each account only the access it needs.</li>
</ul>
<h3>Professional ethics</h3>
<p>Computing power comes with responsibility. A professional respects <strong>privacy</strong>, honours <strong>intellectual property</strong> (licences, no plagiarism), avoids harm and bias, and is honest about what software can and can't do. Bodies like the <strong>ACM Code of Ethics</strong> put this in writing.</p>
<h3>A first look at AI</h3>
<p><strong>Artificial Intelligence (AI)</strong> builds systems that perform tasks needing "intelligence" — recognising speech, translating, recommending. Most modern AI is <strong>machine learning (ML)</strong>: instead of hand-writing rules, the program <em>learns patterns from data</em>. Feed it many labelled examples; it adjusts an internal model to predict on new inputs.</p>
<pre><code>Traditional:  rules + data  -> program -> answers
Machine learning: data + answers -> [training] -> a model
                  then: model + new data -> prediction
</code></pre>
<div class="callout"><span class="badge">Key idea</span> Security is not a feature you bolt on at the end — it's confidentiality, integrity and availability designed in from the start. And AI is powerful but only as good, and as fair, as the data it learns from — which is exactly why ethics matters.</div>`,
    `<span class="eyebrow">CSI106 · Chương 9 · Bài 9.1</span>
<h2>An toàn thông tin, đạo đức &amp; cái nhìn đầu tiên về AI</h2>
<h3>An toàn thông tin: bộ ba CIA</h3>
<ul>
<li><strong>Bí mật (Confidentiality)</strong> — chỉ người được phép mới đọc được dữ liệu.</li>
<li><strong>Toàn vẹn (Integrity)</strong> — dữ liệu không bị sửa trái phép.</li>
<li><strong>Sẵn sàng (Availability)</strong> — hệ thống hoạt động khi cần.</li>
</ul>
<h3>Mối đe doạ &amp; phòng vệ</h3>
<p>Đe doạ thường gặp: <strong>mã độc (malware)</strong>, <strong>lừa đảo (phishing)</strong> (dụ bạn khai thông tin đăng nhập), và <strong>mật khẩu yếu</strong>. Phòng vệ cốt lõi:</p>
<ul>
<li><strong>Mật khẩu mạnh, không trùng</strong> + <strong>xác thực đa yếu tố</strong>.</li>
<li><strong>Mã hoá</strong> — xáo dữ liệu để chỉ có khoá mới đọc được (đây là thứ ổ khoá/HTTPS mang lại).</li>
<li><strong>Cập nhật &amp; đặc quyền tối thiểu</strong> — vá lỗ hổng, cấp cho mỗi tài khoản đúng quyền nó cần.</li>
</ul>
<h3>Đạo đức nghề nghiệp</h3>
<p>Sức mạnh tính toán đi kèm trách nhiệm. Người làm nghề tôn trọng <strong>quyền riêng tư</strong>, tôn trọng <strong>sở hữu trí tuệ</strong> (giấy phép, không đạo văn), tránh gây hại và thiên lệch, và trung thực về việc phần mềm làm được và không làm được gì. Các tổ chức như <strong>Bộ quy tắc đạo đức ACM</strong> ghi rõ điều này.</p>
<h3>Cái nhìn đầu tiên về AI</h3>
<p><strong>Trí tuệ nhân tạo (AI)</strong> dựng hệ thống làm các việc cần "trí thông minh" — nhận diện giọng nói, dịch, gợi ý. Phần lớn AI hiện đại là <strong>học máy (ML)</strong>: thay vì viết tay luật, chương trình <em>học quy luật từ dữ liệu</em>. Cho nó nhiều ví dụ có nhãn; nó điều chỉnh một mô hình nội bộ để dự đoán trên đầu vào mới.</p>
<pre><code>Truyền thống:  luật + dữ liệu  -> chương trình -> đáp án
Học máy:       dữ liệu + đáp án -> [huấn luyện] -> một mô hình
               rồi: mô hình + dữ liệu mới -> dự đoán
</code></pre>
<div class="callout"><span class="badge">Ý chính</span> An toàn không phải tính năng gắn thêm ở cuối — nó là bí mật, toàn vẹn và sẵn sàng được thiết kế ngay từ đầu. Và AI mạnh nhưng chỉ tốt, và công bằng, đúng bằng dữ liệu nó học — chính vì thế đạo đức mới quan trọng.</div>`,
  ]]);

const c9q = quiz('csi106-quiz-9', 'Quiz 9 — Security, ethics & AI|||Quiz 9 — An toàn, đạo đức & AI', [
  { id: 'q1', question: 'Bộ ba CIA trong an toàn thông tin gồm?', options: ['Chi phí, Tốc độ, Dung lượng', 'Bí mật, Toàn vẹn, Sẵn sàng', 'Client, Internet, Application', 'CPU, IC, ALU'], correctIndex: 1, explanation: 'CIA = Confidentiality (bí mật), Integrity (toàn vẹn), Availability (sẵn sàng).' },
  { id: 'q2', question: 'Học máy (machine learning) khác lập trình truyền thống ở chỗ?', options: ['Không cần máy tính', 'Học quy luật TỪ DỮ LIỆU thay vì viết tay mọi luật', 'Luôn đúng 100%', 'Không dùng dữ liệu'], correctIndex: 1, explanation: 'ML học mô hình từ dữ liệu có nhãn rồi dự đoán trên đầu vào mới.' },
  { id: 'q3', question: 'Biện pháp nào "xáo" dữ liệu để chỉ có khoá mới đọc được?', options: ['Nén', 'Mã hoá (encryption)', 'Sao lưu', 'Lập lịch'], correctIndex: 1, explanation: 'Mã hoá biến dữ liệu thành dạng chỉ khoá mới giải được (HTTPS/ổ khoá).' },
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
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CSI106.webp',
    shortDescription: 'The big picture of CS — the von Neumann model, data as bits, Boolean logic, CPU & memory, operating systems, networks, algorithms, data structures, databases, security & ethics. Bilingual, with examples & quizzes.|||Bức tranh lớn của KHMT — mô hình von Neumann, dữ liệu là bit, logic Boole, CPU & bộ nhớ, hệ điều hành, mạng, thuật toán, cấu trúc dữ liệu, CSDL, an toàn & đạo đức. Song ngữ, có ví dụ & quiz.',
    description: 'Môn <strong>CSI106 — Introduction to Computer Science</strong> (kỳ 1) cho bạn <strong>bức tranh lớn của khoa học máy tính</strong> — nền tảng cho mọi môn sau. Đi hết cả chồng tầng: <strong>máy tính &amp; lịch sử</strong> (phần cứng/phần mềm, von Neumann) → <strong>biểu diễn dữ liệu</strong> (nhị phân, hex, bù 2, Unicode) → <strong>đại số Boole &amp; mạch logic</strong> → <strong>CPU &amp; bộ nhớ</strong> (fetch-decode-execute) → <strong>hệ điều hành</strong> → <strong>mạng &amp; Internet</strong> → <strong>thuật toán &amp; độ phức tạp</strong> → <strong>cấu trúc dữ liệu &amp; CSDL</strong> → <strong>an toàn thông tin, đạo đức nghề &amp; AI nhập môn</strong>. Bám giáo trình FLM, song ngữ, có ví dụ, bảng, sơ đồ và quiz mỗi chương.',
    whatYouLearn: 'Phần cứng vs phần mềm & mô hình von Neumann; bit/byte, nhị phân/hex, bù 2, dấu phẩy động, ASCII/Unicode; đại số Boole, cổng AND/OR/NOT/XOR, bảng chân trị, bộ cộng; kiến trúc CPU (ALU/thanh ghi/PC), phân cấp bộ nhớ, chu trình fetch-decode-execute; hệ điều hành (tiến trình, lập lịch, bộ nhớ ảo, hệ thống tệp); mạng phân tầng, IP/DNS, TCP/IP, HTTP & web; thuật toán, ba cấu trúc điều khiển, Big-O (tuyến tính vs nhị phân); cấu trúc dữ liệu (mảng/liên kết/stack/queue/cây/băm), CSDL quan hệ & SQL; bộ ba CIA, mã hoá, đạo đức nghề, và học máy nhập môn.',
    requirements: 'Không cần kiến thức lập trình trước. Chỉ cần toán phổ thông và sự tò mò về cách máy tính hoạt động.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'KHMT là gì, học gì, chuẩn đầu ra, lộ trình 9 chương.', lessons: [intro] },
    { title: 'Chương 1 — Máy tính & von Neumann|||Chapter 1 — Computers & von Neumann', description: 'Lịch sử, phần cứng/phần mềm, chương trình lưu sẵn.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Biểu diễn dữ liệu|||Chapter 2 — Data representation', description: 'Nhị phân/hex, bù 2, số thực, Unicode, media là số.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Đại số Boole & mạch logic|||Chapter 3 — Boolean logic & circuits', description: 'AND/OR/NOT/XOR, bảng chân trị, cổng, bộ cộng.', lessons: [c3, c3q] },
    { title: 'Chương 4 — CPU & bộ nhớ|||Chapter 4 — CPU & memory', description: 'ALU/thanh ghi/PC, phân cấp bộ nhớ, fetch-decode-execute.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Hệ điều hành|||Chapter 5 — Operating systems', description: 'Tiến trình, lập lịch, bộ nhớ ảo, hệ thống tệp.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Mạng & Internet|||Chapter 6 — Networks & Internet', description: 'Phân tầng, IP/DNS, TCP/IP, HTTP & web.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Thuật toán|||Chapter 7 — Algorithms', description: 'Biến, điều khiển, pseudocode, Big-O.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Cấu trúc dữ liệu & CSDL|||Chapter 8 — Data structures & databases', description: 'Mảng/liên kết/stack/queue/cây/băm, CSDL quan hệ, SQL.', lessons: [c8, c8q] },
    { title: 'Chương 9 — An toàn, đạo đức & AI|||Chapter 9 — Security, ethics & AI', description: 'CIA, mã hoá, đạo đức nghề, học máy nhập môn.', lessons: [c9, c9q] },
  ],
};
