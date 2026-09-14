/**
 * ICS101 — Introduction to Computer Science. Khung 8 chương song ngữ VI+EN,
 * ngành Khoa học Máy tính, kỳ 1 (FPTU). Bám giáo trình chuẩn: Brookshear
 * "Computer Science: An Overview"; Abelson/Sussman "SICP"; CS50 (Harvard);
 * Nisan/Schocken "The Elements of Computing Systems".
 * Giữ NGUYÊN semester/slug/courseCode/thumbnailUrl.
 * ⚠️ KHÔNG backtick lồng / ${...} / nháy đơn thừa. HTML: & -> &amp;, < -> &lt;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('ics101-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách kinh điển (kèm link), khoá học miễn phí (CS50), YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">ICS101 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Introduction to Computer Science</strong> — from how a computer represents data to algorithms, programming, networks, databases and AI — in one place. The official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for ICS101 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li>Brookshear &amp; Brylow — <em>Computer Science: An Overview</em> (the classic breadth-first survey; this course follows its shape)</li>
<li><a href="https://mitpress.mit.edu/9780262510875/structure-and-interpretation-of-computer-programs/" target="_blank" rel="noopener">Abelson &amp; Sussman — <em>Structure and Interpretation of Computer Programs</em> (SICP)</a> — free full text online</li>
<li><a href="https://www.nand2tetris.org/" target="_blank" rel="noopener">Nisan &amp; Schocken — <em>The Elements of Computing Systems</em> (Nand2Tetris)</a> — build a computer from logic gates up</li>
</ul>
<h3>🌐 Free courses &amp; documentation</h3>
<ul>
<li><a href="https://cs50.harvard.edu/x/" target="_blank" rel="noopener">CS50x — Harvard's Introduction to Computer Science</a> (free, with problem sets)</li>
<li><a href="https://developer.mozilla.org/" target="_blank" rel="noopener">MDN Web Docs</a> — reference for the web &amp; programming basics</li>
<li><a href="https://roadmap.sh/computer-science" target="_blank" rel="noopener">roadmap.sh — Computer Science</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@crashcourse" target="_blank" rel="noopener">CrashCourse — Computer Science</a> (40-episode overview)</li>
<li><a href="https://www.youtube.com/@Computerphile" target="_blank" rel="noopener">Computerphile</a> — CS concepts explained</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://replit.com/" target="_blank" rel="noopener">Replit</a> — write &amp; run code in the browser (Python, C, JS…)</li>
<li><a href="https://pythontutor.com/" target="_blank" rel="noopener">Python Tutor</a> — visualise how code runs, step by step</li>
<li><a href="https://scratch.mit.edu/" target="_blank" rel="noopener">Scratch</a> — block-based intro to programming logic</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — what CS is, how data becomes binary, and how a CPU runs instructions.</li>
<li><strong>Think in algorithms</strong> — break problems into clear steps; practise on small puzzles.</li>
<li><strong>Write code</strong> — start with Python or C on Replit; make Python Tutor show you each step.</li>
<li><strong>See the big picture</strong> — operating systems, networks, databases, and the ethics of the field.</li>
</ol></div>`,
    `<span class="eyebrow">ICS101 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Nhập môn Khoa học Máy tính</strong> — từ cách máy biểu diễn dữ liệu đến thuật toán, lập trình, mạng, cơ sở dữ liệu và AI — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của ICS101 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li>Brookshear &amp; Brylow — <em>Computer Science: An Overview</em> (sách khảo sát rộng kinh điển; môn này bám theo bố cục của nó)</li>
<li><a href="https://mitpress.mit.edu/9780262510875/structure-and-interpretation-of-computer-programs/" target="_blank" rel="noopener">Abelson &amp; Sussman — <em>SICP</em></a> — đọc toàn văn miễn phí trên mạng</li>
<li><a href="https://www.nand2tetris.org/" target="_blank" rel="noopener">Nisan &amp; Schocken — <em>The Elements of Computing Systems</em> (Nand2Tetris)</a> — tự dựng một máy tính từ cổng logic lên</li>
</ul>
<h3>🌐 Khoá học &amp; tài liệu miễn phí</h3>
<ul>
<li><a href="https://cs50.harvard.edu/x/" target="_blank" rel="noopener">CS50x — Nhập môn KHMT của Harvard</a> (miễn phí, có bài tập)</li>
<li><a href="https://developer.mozilla.org/" target="_blank" rel="noopener">MDN Web Docs</a> — tra cứu web &amp; lập trình cơ bản</li>
<li><a href="https://roadmap.sh/computer-science" target="_blank" rel="noopener">roadmap.sh — Computer Science</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@crashcourse" target="_blank" rel="noopener">CrashCourse — Computer Science</a> (loạt 40 tập tổng quan)</li>
<li><a href="https://www.youtube.com/@Computerphile" target="_blank" rel="noopener">Computerphile</a> — giảng khái niệm KHMT</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://replit.com/" target="_blank" rel="noopener">Replit</a> — viết &amp; chạy code ngay trên trình duyệt (Python, C, JS…)</li>
<li><a href="https://pythontutor.com/" target="_blank" rel="noopener">Python Tutor</a> — xem code chạy từng bước một</li>
<li><a href="https://scratch.mit.edu/" target="_blank" rel="noopener">Scratch</a> — làm quen tư duy lập trình bằng khối kéo-thả</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — KHMT là gì, dữ liệu thành nhị phân ra sao, và CPU chạy lệnh thế nào.</li>
<li><strong>Tư duy thuật toán</strong> — chia bài toán thành các bước rõ ràng; luyện trên các câu đố nhỏ.</li>
<li><strong>Viết code</strong> — bắt đầu với Python hoặc C trên Replit; để Python Tutor chỉ từng bước.</li>
<li><strong>Nhìn bức tranh lớn</strong> — hệ điều hành, mạng, cơ sở dữ liệu và đạo đức nghề nghiệp.</li>
</ol></div>`,
  ]]);

const intro = doc('ics101-0-1-overview', 'Course overview: what is computer science?|||Tổng quan: Khoa học máy tính là gì?',
  'KHMT nghiên cứu cái gì (không chỉ là máy tính); ba ý lớn: biểu diễn, thuật toán, trừu tượng hoá; lộ trình 8 chương.',
  [[
    `<span class="eyebrow">ICS101 · Lesson 0.1 · Overview</span>
<h2>What is computer science?</h2>
<p class="lead">Computer science is the study of <strong>problems, problem-solving, and the processes that solve them</strong> — not just computers. As Dijkstra put it, "computer science is no more about computers than astronomy is about telescopes." The computer is the tool; the idea is the <strong>algorithm</strong>.</p>
<h3>Three big ideas you'll meet everywhere</h3>
<ul>
<li><strong>Representation</strong> — everything (numbers, text, images, sound) is encoded as <strong>bits</strong> (0s and 1s).</li>
<li><strong>Algorithm</strong> — a precise, finite sequence of steps that turns input into output.</li>
<li><strong>Abstraction</strong> — hiding detail behind a simple interface, so we can build huge systems out of small, understandable parts.</li>
</ul>
<h3>Roadmap — 8 chapters</h3>
<p>What CS is &amp; history → data representation (binary) → computer architecture (CPU/memory) → operating systems → algorithms &amp; problem-solving → programming → networks &amp; the Internet → databases, AI &amp; professional ethics. Bilingual, with worked examples and a quiz per chapter.</p>
<div class="callout"><span class="badge">Breadth-first</span> This course follows Brookshear's <em>Computer Science: An Overview</em> — a wide tour of the whole field, so later courses (programming, data structures, networks) each feel familiar.</div>`,
    `<span class="eyebrow">ICS101 · Bài 0.1 · Tổng quan</span>
<h2>Khoa học máy tính là gì?</h2>
<p class="lead">Khoa học máy tính (KHMT) nghiên cứu <strong>vấn đề, cách giải quyết vấn đề, và các tiến trình giải quyết chúng</strong> — không chỉ là cái máy tính. Như Dijkstra nói, "khoa học máy tính bàn về máy tính chẳng khác gì thiên văn học bàn về kính viễn vọng." Máy tính là công cụ; ý tưởng cốt lõi là <strong>thuật toán</strong>.</p>
<h3>Ba ý lớn gặp ở khắp nơi</h3>
<ul>
<li><strong>Biểu diễn</strong> — mọi thứ (số, chữ, ảnh, âm thanh) đều được mã hoá thành <strong>bit</strong> (0 và 1).</li>
<li><strong>Thuật toán</strong> — một chuỗi bước chính xác, hữu hạn biến đầu vào thành đầu ra.</li>
<li><strong>Trừu tượng hoá</strong> — giấu chi tiết sau một giao diện đơn giản, để dựng hệ thống lớn từ những mảnh nhỏ dễ hiểu.</li>
</ul>
<h3>Lộ trình — 8 chương</h3>
<p>KHMT là gì &amp; lịch sử → biểu diễn dữ liệu (nhị phân) → kiến trúc máy tính (CPU/bộ nhớ) → hệ điều hành → thuật toán &amp; giải quyết vấn đề → lập trình → mạng &amp; Internet → cơ sở dữ liệu, AI &amp; đạo đức nghề nghiệp. Song ngữ, có ví dụ mẫu và một quiz mỗi chương.</p>
<div class="callout"><span class="badge">Khảo sát rộng</span> Môn này bám theo <em>Computer Science: An Overview</em> của Brookshear — một chuyến đi rộng khắp toàn ngành, để các môn sau (lập trình, cấu trúc dữ liệu, mạng) đều thấy quen thuộc.</div>`,
  ]]);

const c1 = doc('ics101-1-1-what-and-history', '1.1 — What CS is & the history of computing|||1.1 — KHMT là gì & lịch sử máy tính',
  'Định nghĩa KHMT & khác biệt với CNTT; các thế hệ máy tính (cơ khí → đèn → transistor → IC → vi xử lý); những tên tuổi (Babbage, Turing, von Neumann).',
  [[
    `<span class="eyebrow">ICS101 · Chapter 1 · Lesson 1.1</span>
<h2>What CS is &amp; the history of computing</h2>
<h3>CS vs IT vs software engineering</h3>
<ul>
<li><strong>Computer science</strong> — the theory: algorithms, computation, what can (and cannot) be computed.</li>
<li><strong>Software engineering</strong> — building reliable software at scale, using CS ideas.</li>
<li><strong>Information technology (IT)</strong> — deploying and operating systems for organisations.</li>
</ul>
<h3>A short history</h3>
<ul>
<li><strong>Abacus &amp; mechanical calculators</strong> — counting aids for millennia.</li>
<li><strong>Charles Babbage</strong> (1830s) — the Analytical Engine, a mechanical general-purpose computer; <strong>Ada Lovelace</strong> wrote the first algorithm for it.</li>
<li><strong>Alan Turing</strong> (1936) — the Turing machine: a model of what any computer can compute.</li>
<li><strong>Generations of hardware</strong>: vacuum tubes → transistors → integrated circuits → microprocessors.</li>
<li><strong>John von Neumann</strong> (1945) — the stored-program architecture almost every computer still uses.</li>
</ul>
<pre><code>Hardware generations
  1st  vacuum tubes     (ENIAC, 1945)   room-sized, hot
  2nd  transistors      (1950s)         smaller, reliable
  3rd  integrated circuits (1960s)      many transistors on one chip
  4th  microprocessors  (1971, Intel 4004) a whole CPU on one chip
</code></pre>
<div class="callout"><span class="badge">Moore's Law</span> The number of transistors on a chip roughly doubled every ~2 years for decades — which is why the phone in your pocket dwarfs the room-sized computers of the 1960s.</div>`,
    `<span class="eyebrow">ICS101 · Chương 1 · Bài 1.1</span>
<h2>KHMT là gì &amp; lịch sử máy tính</h2>
<h3>KHMT vs CNTT vs kỹ thuật phần mềm</h3>
<ul>
<li><strong>Khoa học máy tính</strong> — phần lý thuyết: thuật toán, tính toán, cái gì tính được (và không tính được).</li>
<li><strong>Kỹ thuật phần mềm</strong> — xây phần mềm đáng tin ở quy mô lớn, dùng các ý tưởng của KHMT.</li>
<li><strong>Công nghệ thông tin (CNTT/IT)</strong> — triển khai và vận hành hệ thống cho tổ chức.</li>
</ul>
<h3>Lịch sử tóm tắt</h3>
<ul>
<li><strong>Bàn tính &amp; máy tính cơ khí</strong> — công cụ đếm suốt hàng nghìn năm.</li>
<li><strong>Charles Babbage</strong> (1830s) — Analytical Engine, máy tính cơ khí đa dụng; <strong>Ada Lovelace</strong> viết thuật toán đầu tiên cho nó.</li>
<li><strong>Alan Turing</strong> (1936) — máy Turing: mô hình về những gì mọi máy tính có thể tính.</li>
<li><strong>Các thế hệ phần cứng</strong>: đèn điện tử → transistor → mạch tích hợp → vi xử lý.</li>
<li><strong>John von Neumann</strong> (1945) — kiến trúc chương trình-lưu-sẵn mà hầu hết máy tính vẫn dùng.</li>
</ul>
<pre><code>Các thế hệ phần cứng
  1  đèn điện tử       (ENIAC, 1945)   to bằng cả phòng, nóng
  2  transistor        (1950s)         nhỏ hơn, đáng tin hơn
  3  mạch tích hợp (IC) (1960s)         nhiều transistor trên một chip
  4  vi xử lý          (1971, Intel 4004) cả một CPU trên một chip
</code></pre>
<div class="callout"><span class="badge">Định luật Moore</span> Số transistor trên một chip cứ ~2 năm lại tăng gấp đôi suốt nhiều thập kỷ — vì thế chiếc điện thoại trong túi bạn mạnh hơn hẳn những máy tính to bằng cả phòng của thập niên 1960.</div>`,
  ]]);

const c1q = quiz('ics101-quiz-1', 'Quiz 1 — What CS is & history|||Quiz 1 — KHMT & lịch sử', [
  { id: 'q1', question: 'Khoa học máy tính chủ yếu nghiên cứu về?', options: ['Cách sửa máy tính', 'Vấn đề, thuật toán và tiến trình giải quyết chúng', 'Cách bán phần cứng', 'Chỉ ngôn ngữ lập trình'], correctIndex: 1, explanation: 'KHMT bàn về vấn đề, thuật toán và cách giải quyết — máy tính chỉ là công cụ.' },
  { id: 'q2', question: 'Kiến trúc "chương trình lưu sẵn" mà hầu hết máy tính dùng gắn với tên ai?', options: ['Ada Lovelace', 'John von Neumann', 'Tim Berners-Lee', 'Linus Torvalds'], correctIndex: 1, explanation: 'Kiến trúc von Neumann (1945): chương trình và dữ liệu cùng nằm trong bộ nhớ.' },
  { id: 'q3', question: 'Thế hệ máy tính thứ nhất dùng linh kiện nào?', options: ['Transistor', 'Mạch tích hợp', 'Đèn điện tử (vacuum tube)', 'Vi xử lý'], correctIndex: 2, explanation: 'Thế hệ 1 (vd ENIAC) dùng đèn điện tử — to, nóng; sau đó mới tới transistor.' },
]);

const c2 = doc('ics101-2-1-data-representation', '2.1 — Data representation: binary, hex, text & images|||2.1 — Biểu diễn dữ liệu: nhị phân, hex, chữ & ảnh',
  'Bit & byte; hệ nhị phân và thập lục phân (hex); chuyển đổi cơ số; mã ký tự (ASCII/Unicode); ảnh thành pixel & màu RGB.',
  [[
    `<span class="eyebrow">ICS101 · Chapter 2 · Lesson 2.1</span>
<h2>Data representation</h2>
<p>Inside a computer <em>everything</em> is <strong>bits</strong> — a 0 or a 1. Eight bits make a <strong>byte</strong>. The meaning of the bits depends on how we agree to interpret them.</p>
<h3>Binary &amp; hexadecimal</h3>
<p>Decimal uses base 10; computers use <strong>base 2 (binary)</strong>. <strong>Hexadecimal (base 16)</strong> is a compact shorthand — one hex digit equals exactly four bits.</p>
<pre><code>Binary to decimal (place values are powers of 2):
  1011 (binary) = 1&times;8 + 0&times;4 + 1&times;2 + 1&times;1 = 11 (decimal)

Byte 0 to 255:
  1111 1111 (binary) = FF (hex) = 255 (decimal)
</code></pre>
<h3>Text — ASCII &amp; Unicode</h3>
<p><strong>ASCII</strong> maps characters to numbers (e.g. capital A = 65). <strong>Unicode</strong> (usually stored as <strong>UTF-8</strong>) extends this to every writing system and emoji — that is how "Xin chào" and "😀" fit in one file.</p>
<h3>Images — pixels &amp; RGB</h3>
<p>An image is a grid of <strong>pixels</strong>; each pixel is a colour, often three bytes: Red, Green, Blue (0–255 each). More bits per pixel = more colours; more pixels = higher resolution.</p>
<pre><code>Pixel colour (RGB):
  (255, 0, 0)   = pure red
  (0, 255, 0)   = pure green
  (255,255,255) = white,  (0,0,0) = black
</code></pre>
<div class="callout"><span class="badge">One rule</span> Bits carry no meaning by themselves — the same 0101 0100 is the number 84, the letter "T", or part of a pixel, depending only on the agreed encoding.</div>`,
    `<span class="eyebrow">ICS101 · Chương 2 · Bài 2.1</span>
<h2>Biểu diễn dữ liệu</h2>
<p>Bên trong máy tính, <em>mọi thứ</em> đều là <strong>bit</strong> — 0 hoặc 1. Tám bit tạo thành một <strong>byte</strong>. Ý nghĩa của các bit tuỳ vào cách ta thống nhất diễn giải chúng.</p>
<h3>Nhị phân &amp; thập lục phân (hex)</h3>
<p>Hệ thập phân dùng cơ số 10; máy tính dùng <strong>cơ số 2 (nhị phân)</strong>. <strong>Hex (cơ số 16)</strong> là cách viết gọn — một chữ số hex bằng đúng bốn bit.</p>
<pre><code>Nhị phân sang thập phân (trị theo vị trí là luỹ thừa của 2):
  1011 (nhị phân) = 1&times;8 + 0&times;4 + 1&times;2 + 1&times;1 = 11 (thập phân)

Một byte từ 0 đến 255:
  1111 1111 (nhị phân) = FF (hex) = 255 (thập phân)
</code></pre>
<h3>Chữ — ASCII &amp; Unicode</h3>
<p><strong>ASCII</strong> ánh xạ ký tự sang số (vd chữ A hoa = 65). <strong>Unicode</strong> (thường lưu dạng <strong>UTF-8</strong>) mở rộng cho mọi hệ chữ viết và emoji — nhờ đó "Xin chào" và "😀" cùng nằm gọn trong một tệp.</p>
<h3>Ảnh — pixel &amp; RGB</h3>
<p>Một tấm ảnh là lưới các <strong>pixel</strong>; mỗi pixel là một màu, thường là ba byte: Đỏ, Lục, Lam (mỗi kênh 0–255). Càng nhiều bit/pixel = càng nhiều màu; càng nhiều pixel = độ phân giải càng cao.</p>
<pre><code>Màu pixel (RGB):
  (255, 0, 0)   = đỏ nguyên
  (0, 255, 0)   = lục nguyên
  (255,255,255) = trắng,  (0,0,0) = đen
</code></pre>
<div class="callout"><span class="badge">Một nguyên tắc</span> Bản thân bit không mang nghĩa — cùng dãy 0101 0100 có thể là số 84, chữ "T", hay một phần pixel, chỉ tuỳ vào cách mã hoá đã thống nhất.</div>`,
  ]]);

const c2q = quiz('ics101-quiz-2', 'Quiz 2 — Data representation|||Quiz 2 — Biểu diễn dữ liệu', [
  { id: 'q1', question: 'Số nhị phân 1011 bằng bao nhiêu trong hệ thập phân?', options: ['9', '11', '13', '15'], correctIndex: 1, explanation: '1×8 + 0×4 + 1×2 + 1×1 = 11.' },
  { id: 'q2', question: 'Một byte gồm mấy bit và biểu diễn được các giá trị nào?', options: ['4 bit, 0–15', '8 bit, 0–255', '16 bit, 0–255', '8 bit, 0–512'], correctIndex: 1, explanation: '1 byte = 8 bit = 2^8 = 256 giá trị, tức 0 đến 255.' },
  { id: 'q3', question: 'Chuẩn nào cho phép lưu mọi hệ chữ viết và emoji trong một tệp?', options: ['ASCII', 'Unicode (UTF-8)', 'Chỉ nhị phân', 'RGB'], correctIndex: 1, explanation: 'Unicode (thường mã hoá UTF-8) bao trùm mọi ký tự; ASCII chỉ có ký tự Latinh cơ bản.' },
]);

const c3 = doc('ics101-3-1-architecture', '3.1 — Computer architecture: CPU & memory|||3.1 — Kiến trúc máy tính: CPU & bộ nhớ',
  'Kiến trúc von Neumann; CPU (ALU, control unit, thanh ghi) & chu trình fetch–decode–execute; phân cấp bộ nhớ (thanh ghi → cache → RAM → đĩa); vai trò xung nhịp.',
  [[
    `<span class="eyebrow">ICS101 · Chapter 3 · Lesson 3.1</span>
<h2>Computer architecture: CPU &amp; memory</h2>
<h3>The von Neumann model</h3>
<p>A computer has a <strong>CPU</strong>, <strong>memory</strong> (holding both program and data), and <strong>input/output</strong>, all connected by a <strong>bus</strong>.</p>
<h3>Inside the CPU</h3>
<ul>
<li><strong>ALU</strong> (Arithmetic Logic Unit) — does the maths and logic (add, compare, AND/OR).</li>
<li><strong>Control unit</strong> — directs traffic, decoding each instruction.</li>
<li><strong>Registers</strong> — tiny, ultra-fast storage the CPU works in directly.</li>
</ul>
<h3>The fetch–decode–execute cycle</h3>
<pre><code>repeat forever:
  FETCH   the next instruction from memory
  DECODE  what it means
  EXECUTE it (maths, move data, or jump)
</code></pre>
<p>The <strong>clock</strong> paces this cycle; 3 GHz means about 3 billion ticks per second.</p>
<h3>The memory hierarchy</h3>
<pre><code>Fast &amp; small  ->  Slow &amp; big
  Registers   (bytes,    ~1 CPU cycle)
  Cache L1/L2 (KB-MB,    a few cycles)
  RAM         (GB,       ~100 cycles)   volatile
  SSD / disk  (TB,       very slow)     persistent
</code></pre>
<div class="callout"><span class="badge">Why the pyramid</span> Fast memory is expensive and small; big memory is cheap and slow. Layering them lets the CPU feel fast while still having lots of storage.</div>`,
    `<span class="eyebrow">ICS101 · Chương 3 · Bài 3.1</span>
<h2>Kiến trúc máy tính: CPU &amp; bộ nhớ</h2>
<h3>Mô hình von Neumann</h3>
<p>Một máy tính có <strong>CPU</strong>, <strong>bộ nhớ</strong> (chứa cả chương trình lẫn dữ liệu), và <strong>vào/ra (I/O)</strong>, tất cả nối với nhau qua <strong>bus</strong>.</p>
<h3>Bên trong CPU</h3>
<ul>
<li><strong>ALU</strong> (Khối số học-logic) — làm toán và logic (cộng, so sánh, AND/OR).</li>
<li><strong>Khối điều khiển</strong> — điều phối, giải mã từng lệnh.</li>
<li><strong>Thanh ghi (register)</strong> — ô nhớ cực nhỏ, cực nhanh mà CPU làm việc trực tiếp.</li>
</ul>
<h3>Chu trình lấy–giải mã–thực thi</h3>
<pre><code>lặp mãi:
  FETCH   lấy lệnh kế tiếp từ bộ nhớ
  DECODE  giải mã lệnh đó nghĩa là gì
  EXECUTE thực thi (làm toán, chuyển dữ liệu, hoặc nhảy)
</code></pre>
<p><strong>Xung nhịp (clock)</strong> đặt nhịp cho chu trình này; 3 GHz nghĩa là khoảng 3 tỉ nhịp mỗi giây.</p>
<h3>Phân cấp bộ nhớ</h3>
<pre><code>Nhanh &amp; nhỏ  ->  Chậm &amp; lớn
  Thanh ghi   (byte,   ~1 nhịp CPU)
  Cache L1/L2 (KB-MB,  vài nhịp)
  RAM         (GB,     ~100 nhịp)    dễ bay (mất khi tắt)
  SSD / đĩa   (TB,     rất chậm)     lưu bền
</code></pre>
<div class="callout"><span class="badge">Vì sao có kim tự tháp</span> Bộ nhớ nhanh thì đắt và nhỏ; bộ nhớ lớn thì rẻ và chậm. Xếp tầng chúng giúp CPU thấy nhanh mà vẫn có nhiều dung lượng.</div>`,
  ]]);

const c3q = quiz('ics101-quiz-3', 'Quiz 3 — Architecture|||Quiz 3 — Kiến trúc máy tính', [
  { id: 'q1', question: 'Ba bước lặp lại của CPU khi chạy một lệnh là?', options: ['Nhập–Xử lý–Xuất', 'Fetch–Decode–Execute (Lấy–Giải mã–Thực thi)', 'Lưu–Xoá–Sao chép', 'Bật–Chờ–Tắt'], correctIndex: 1, explanation: 'Chu trình fetch–decode–execute lặp mãi để chạy từng lệnh.' },
  { id: 'q2', question: 'Loại bộ nhớ nào NHANH nhất nhưng NHỎ nhất trong phân cấp?', options: ['Đĩa cứng', 'RAM', 'Thanh ghi (register)', 'SSD'], correctIndex: 2, explanation: 'Thanh ghi nằm ngay trong CPU: nhanh nhất nhưng dung lượng nhỏ nhất.' },
  { id: 'q3', question: 'RAM khác đĩa/SSD ở điểm quan trọng nào?', options: ['RAM lưu bền khi tắt máy', 'RAM dễ bay — mất dữ liệu khi mất điện', 'RAM lớn hơn đĩa', 'RAM chậm hơn đĩa'], correctIndex: 1, explanation: 'RAM là bộ nhớ dễ bay (volatile): mất nội dung khi tắt nguồn; đĩa/SSD lưu bền.' },
]);

const c4 = doc('ics101-4-1-os-software', '4.1 — Operating systems & basic software|||4.1 — Hệ điều hành & phần mềm cơ bản',
  'Phần mềm hệ thống vs ứng dụng; vai trò hệ điều hành (quản lý tiến trình, bộ nhớ, tệp, thiết bị); tiến trình & đa nhiệm; hệ thống tệp; các HĐH phổ biến.',
  [[
    `<span class="eyebrow">ICS101 · Chapter 4 · Lesson 4.1</span>
<h2>Operating systems &amp; basic software</h2>
<h3>System software vs application software</h3>
<ul>
<li><strong>System software</strong> — the operating system and utilities that run the machine.</li>
<li><strong>Application software</strong> — the programs you use (browser, editor, games).</li>
</ul>
<h3>What an operating system does</h3>
<p>The <strong>OS</strong> sits between hardware and your apps and manages the shared resources:</p>
<ul>
<li><strong>Process management</strong> — running many programs at once by rapidly switching the CPU between them (multitasking).</li>
<li><strong>Memory management</strong> — giving each program its own space, using virtual memory.</li>
<li><strong>File system</strong> — organising data into files and folders on disk.</li>
<li><strong>Device management</strong> — talking to keyboard, screen, disk and network through drivers.</li>
</ul>
<pre><code>A process has states:
  NEW -> READY -> RUNNING -> WAITING -> ... -> TERMINATED
  (the OS scheduler decides who runs next)
</code></pre>
<p>Common OSes: <strong>Windows, macOS, Linux</strong> (desktops/servers) and <strong>Android, iOS</strong> (mobile). Linux powers most servers and the cloud.</p>
<div class="callout"><span class="badge">The illusion</span> Your computer feels like it runs everything at once. Really the OS is switching the CPU between tasks thousands of times a second — an abstraction that hides the sharing.</div>`,
    `<span class="eyebrow">ICS101 · Chương 4 · Bài 4.1</span>
<h2>Hệ điều hành &amp; phần mềm cơ bản</h2>
<h3>Phần mềm hệ thống vs phần mềm ứng dụng</h3>
<ul>
<li><strong>Phần mềm hệ thống</strong> — hệ điều hành và các tiện ích vận hành máy.</li>
<li><strong>Phần mềm ứng dụng</strong> — các chương trình bạn dùng (trình duyệt, trình soạn thảo, game).</li>
</ul>
<h3>Hệ điều hành làm gì</h3>
<p><strong>Hệ điều hành (OS)</strong> nằm giữa phần cứng và ứng dụng, quản lý tài nguyên dùng chung:</p>
<ul>
<li><strong>Quản lý tiến trình</strong> — chạy nhiều chương trình cùng lúc bằng cách chuyển CPU giữa chúng cực nhanh (đa nhiệm).</li>
<li><strong>Quản lý bộ nhớ</strong> — cấp cho mỗi chương trình không gian riêng, dùng bộ nhớ ảo.</li>
<li><strong>Hệ thống tệp</strong> — sắp xếp dữ liệu thành tệp và thư mục trên đĩa.</li>
<li><strong>Quản lý thiết bị</strong> — giao tiếp với bàn phím, màn hình, đĩa, mạng thông qua trình điều khiển (driver).</li>
</ul>
<pre><code>Một tiến trình có các trạng thái:
  MỚI -> SẴN SÀNG -> ĐANG CHẠY -> CHỜ -> ... -> KẾT THÚC
  (bộ định thời của OS quyết định ai chạy tiếp)
</code></pre>
<p>Các HĐH phổ biến: <strong>Windows, macOS, Linux</strong> (máy bàn/máy chủ) và <strong>Android, iOS</strong> (di động). Linux chạy phần lớn máy chủ và đám mây.</p>
<div class="callout"><span class="badge">Ảo giác</span> Máy tính có vẻ chạy mọi thứ cùng lúc. Thực ra OS chuyển CPU giữa các tác vụ hàng nghìn lần mỗi giây — một trừu tượng che đi sự chia sẻ đó.</div>`,
  ]]);

const c4q = quiz('ics101-quiz-4', 'Quiz 4 — Operating systems|||Quiz 4 — Hệ điều hành', [
  { id: 'q1', question: 'Nhiệm vụ nào KHÔNG phải của hệ điều hành?', options: ['Quản lý tiến trình', 'Quản lý bộ nhớ', 'Thiết kế logo cho ứng dụng', 'Quản lý tệp'], correctIndex: 2, explanation: 'HĐH quản lý tiến trình, bộ nhớ, tệp, thiết bị — không thiết kế đồ hoạ ứng dụng.' },
  { id: 'q2', question: 'Đa nhiệm (multitasking) trên một CPU thực chất là?', options: ['Nhiều CPU chạy song song', 'OS chuyển CPU giữa các tiến trình cực nhanh', 'Mỗi chương trình có một máy riêng', 'Tắt bớt chương trình'], correctIndex: 1, explanation: 'Trên một lõi, OS luân phiên CPU giữa các tiến trình rất nhanh, tạo cảm giác chạy đồng thời.' },
  { id: 'q3', question: 'Hệ điều hành nào chạy phần lớn máy chủ và đám mây?', options: ['Windows', 'Linux', 'iOS', 'DOS'], correctIndex: 1, explanation: 'Linux thống trị mảng máy chủ và hạ tầng đám mây.' },
]);

const c5 = doc('ics101-5-1-algorithms', '5.1 — Algorithms & problem-solving|||5.1 — Thuật toán & tư duy giải quyết vấn đề',
  'Thuật toán là gì (3 tính chất); pseudocode & lưu đồ; ba khối điều khiển (tuần tự/rẽ nhánh/lặp); ví dụ tìm kiếm tuyến tính vs nhị phân; ý niệm độ phức tạp Big-O.',
  [[
    `<span class="eyebrow">ICS101 · Chapter 5 · Lesson 5.1</span>
<h2>Algorithms &amp; problem-solving</h2>
<h3>What makes an algorithm</h3>
<p>An <strong>algorithm</strong> is a finite set of clear steps that solves a problem. Good algorithms are: <strong>unambiguous</strong> (each step precise), <strong>finite</strong> (they stop), and <strong>effective</strong> (they actually produce the right answer).</p>
<h3>The three control structures</h3>
<p>Any algorithm is built from just three: <strong>sequence</strong> (do steps in order), <strong>selection</strong> (if/else), and <strong>repetition</strong> (loops).</p>
<pre><code>Pseudocode — largest of a list:
  max = first item
  for each item in list:
      if item &gt; max:
          max = item
  return max
</code></pre>
<h3>Searching: linear vs binary</h3>
<pre><code>Linear search: check items one by one        -> up to N checks
Binary search: on a SORTED list, halve each time -> about log2(N) checks
  1,000,000 items: linear ~1,000,000 ; binary ~20
</code></pre>
<h3>Complexity — Big-O</h3>
<p><strong>Big-O</strong> describes how work grows with input size N: <code>O(1)</code> constant, <code>O(log N)</code> (binary search), <code>O(N)</code> (linear search), <code>O(N&sup2;)</code> (many simple sorts). It is the language for saying "which algorithm scales".</p>
<div class="callout"><span class="badge">Divide &amp; conquer</span> Break a big problem into smaller ones you can solve, then combine — the core habit of computational thinking.</div>`,
    `<span class="eyebrow">ICS101 · Chương 5 · Bài 5.1</span>
<h2>Thuật toán &amp; tư duy giải quyết vấn đề</h2>
<h3>Điều gì làm nên một thuật toán</h3>
<p>Một <strong>thuật toán</strong> là tập hữu hạn các bước rõ ràng để giải một bài toán. Thuật toán tốt phải: <strong>không nhập nhằng</strong> (mỗi bước chính xác), <strong>hữu hạn</strong> (có dừng), và <strong>hiệu quả</strong> (thực sự cho ra đáp án đúng).</p>
<h3>Ba cấu trúc điều khiển</h3>
<p>Mọi thuật toán chỉ dựng từ ba thứ: <strong>tuần tự</strong> (làm theo thứ tự), <strong>rẽ nhánh</strong> (if/else), và <strong>lặp</strong> (vòng lặp).</p>
<pre><code>Pseudocode — tìm phần tử lớn nhất:
  max = phần tử đầu
  với mỗi phần tử trong danh sách:
      nếu phần tử &gt; max:
          max = phần tử
  trả về max
</code></pre>
<h3>Tìm kiếm: tuyến tính vs nhị phân</h3>
<pre><code>Tìm tuyến tính: xét từng phần tử một      -> tối đa N lần
Tìm nhị phân: trên danh sách ĐÃ SẮP, chia đôi mỗi lần -> khoảng log2(N) lần
  1.000.000 phần tử: tuyến tính ~1.000.000 ; nhị phân ~20
</code></pre>
<h3>Độ phức tạp — Big-O</h3>
<p><strong>Big-O</strong> mô tả khối lượng việc tăng thế nào theo cỡ dữ liệu N: <code>O(1)</code> hằng, <code>O(log N)</code> (tìm nhị phân), <code>O(N)</code> (tìm tuyến tính), <code>O(N&sup2;)</code> (nhiều thuật toán sắp xếp đơn giản). Đây là ngôn ngữ để nói "thuật toán nào mở rộng tốt".</p>
<div class="callout"><span class="badge">Chia để trị</span> Chia bài toán lớn thành các bài nhỏ giải được rồi ghép lại — thói quen cốt lõi của tư duy máy tính.</div>`,
  ]]);

const c5q = quiz('ics101-quiz-5', 'Quiz 5 — Algorithms|||Quiz 5 — Thuật toán', [
  { id: 'q1', question: 'Tính chất nào KHÔNG bắt buộc với một thuật toán?', options: ['Hữu hạn (có dừng)', 'Không nhập nhằng', 'Viết bằng tiếng Anh', 'Hiệu quả (cho đáp án đúng)'], correctIndex: 2, explanation: 'Thuật toán cần hữu hạn, rõ ràng, hiệu quả — không phụ thuộc ngôn ngữ trình bày.' },
  { id: 'q2', question: 'Tìm kiếm nhị phân yêu cầu điều kiện gì về dữ liệu?', options: ['Dữ liệu phải đã được sắp xếp', 'Dữ liệu phải là số', 'Danh sách phải rất ngắn', 'Không cần điều kiện gì'], correctIndex: 0, explanation: 'Tìm nhị phân chia đôi mỗi bước nên chỉ đúng khi danh sách đã sắp xếp.' },
  { id: 'q3', question: 'Với 1.000.000 phần tử đã sắp, tìm nhị phân cần khoảng bao nhiêu lần so sánh?', options: ['~1.000.000', '~1.000', '~20', '~100.000'], correctIndex: 2, explanation: 'log2(1.000.000) ≈ 20 — đó là sức mạnh của O(log N).' },
]);

const c6 = doc('ics101-6-1-programming', '6.1 — Introduction to programming & languages|||6.1 — Nhập môn lập trình & ngôn ngữ',
  'Mã nguồn → máy hiểu (biên dịch vs thông dịch); biến, kiểu, biểu thức; câu lệnh điều khiển & hàm; các họ ngôn ngữ; ví dụ Python nhỏ.',
  [[
    `<span class="eyebrow">ICS101 · Chapter 6 · Lesson 6.1</span>
<h2>Introduction to programming</h2>
<h3>From source code to running program</h3>
<ul>
<li><strong>Compiled</strong> (C, C++, Rust) — a compiler translates the whole program to machine code once; it then runs fast.</li>
<li><strong>Interpreted</strong> (Python, JavaScript) — an interpreter runs the source line by line; slower but flexible and easy to try.</li>
</ul>
<h3>The core building blocks</h3>
<ul>
<li><strong>Variables &amp; types</strong> — named boxes holding values (int, float, string, boolean).</li>
<li><strong>Expressions</strong> — combine values with operators (<code>+ - * /</code>, comparisons).</li>
<li><strong>Control flow</strong> — <code>if/else</code> and loops (the same three structures from Chapter 5).</li>
<li><strong>Functions</strong> — named, reusable blocks of steps — abstraction in action.</li>
</ul>
<pre><code>Python — is a year a leap year?
  def is_leap(year):
      if year % 4 == 0 and (year % 100 != 0 or year % 400 == 0):
          return True
      return False

  print(is_leap(2024))   # True
  print(is_leap(1900))   # False
</code></pre>
<h3>Families of languages</h3>
<p><strong>Low-level</strong> (assembly) is close to hardware; <strong>high-level</strong> (Python, Java) is close to humans. Paradigms include <strong>procedural</strong>, <strong>object-oriented</strong>, and <strong>functional</strong> (the style SICP teaches).</p>
<div class="callout"><span class="badge">Start small</span> Every large program is just variables, conditions, loops and functions combined. Master these four and the rest is vocabulary.</div>`,
    `<span class="eyebrow">ICS101 · Chương 6 · Bài 6.1</span>
<h2>Nhập môn lập trình</h2>
<h3>Từ mã nguồn tới chương trình chạy được</h3>
<ul>
<li><strong>Biên dịch</strong> (C, C++, Rust) — trình biên dịch dịch cả chương trình sang mã máy một lần; sau đó chạy nhanh.</li>
<li><strong>Thông dịch</strong> (Python, JavaScript) — trình thông dịch chạy mã nguồn từng dòng; chậm hơn nhưng linh hoạt, dễ thử.</li>
</ul>
<h3>Các khối xây dựng cốt lõi</h3>
<ul>
<li><strong>Biến &amp; kiểu</strong> — hộp có tên chứa giá trị (số nguyên, số thực, chuỗi, luận lý).</li>
<li><strong>Biểu thức</strong> — kết hợp giá trị bằng toán tử (<code>+ - * /</code>, phép so sánh).</li>
<li><strong>Luồng điều khiển</strong> — <code>if/else</code> và vòng lặp (chính ba cấu trúc ở Chương 5).</li>
<li><strong>Hàm</strong> — khối bước có tên, tái sử dụng — trừu tượng hoá trong thực tế.</li>
</ul>
<pre><code>Python — năm có phải năm nhuận không?
  def is_leap(year):
      if year % 4 == 0 and (year % 100 != 0 or year % 400 == 0):
          return True
      return False

  print(is_leap(2024))   # True
  print(is_leap(1900))   # False
</code></pre>
<h3>Các họ ngôn ngữ</h3>
<p><strong>Bậc thấp</strong> (assembly) sát phần cứng; <strong>bậc cao</strong> (Python, Java) sát con người. Các trường phái gồm <strong>thủ tục</strong>, <strong>hướng đối tượng</strong>, và <strong>hàm</strong> (phong cách mà SICP dạy).</p>
<div class="callout"><span class="badge">Bắt đầu từ nhỏ</span> Mọi chương trình lớn chỉ là biến, điều kiện, vòng lặp và hàm ghép lại. Nắm chắc bốn thứ này thì phần còn lại chỉ là từ vựng.</div>`,
  ]]);

const c6q = quiz('ics101-quiz-6', 'Quiz 6 — Programming|||Quiz 6 — Lập trình', [
  { id: 'q1', question: 'Khác biệt chính giữa ngôn ngữ biên dịch và thông dịch là?', options: ['Biên dịch dịch cả chương trình trước, thông dịch chạy từng dòng', 'Biên dịch luôn chậm hơn', 'Thông dịch không cần mã nguồn', 'Chúng giống hệt nhau'], correctIndex: 0, explanation: 'Biên dịch (C) dịch toàn bộ sang mã máy một lần; thông dịch (Python) chạy từng dòng.' },
  { id: 'q2', question: 'Bốn khối xây dựng cốt lõi của mọi chương trình là?', options: ['Ảnh, âm thanh, mạng, đĩa', 'Biến, điều kiện, vòng lặp, hàm', 'CPU, RAM, đĩa, màn hình', 'HTML, CSS, JS, SQL'], correctIndex: 1, explanation: 'Biến, điều kiện (rẽ nhánh), vòng lặp và hàm là nền của mọi chương trình.' },
  { id: 'q3', question: 'Trong ví dụ, hàm is_leap(2024) trả về?', options: ['False', 'True', 'Lỗi', '2024'], correctIndex: 1, explanation: '2024 chia hết cho 4 và không chia hết cho 100 → là năm nhuận → True.' },
]);

const c7 = doc('ics101-7-1-networks-internet', '7.1 — Networks & the Internet|||7.1 — Mạng & Internet',
  'Mạng là gì; gói tin & chuyển mạch gói; địa chỉ IP & DNS; mô hình phân tầng (TCP/IP); giao thức web (HTTP/HTTPS); client–server.',
  [[
    `<span class="eyebrow">ICS101 · Chapter 7 · Lesson 7.1</span>
<h2>Networks &amp; the Internet</h2>
<h3>What a network is</h3>
<p>A <strong>network</strong> connects computers so they can exchange data. The <strong>Internet</strong> is a network of networks — no single owner, held together by shared <strong>protocols</strong> (agreed rules).</p>
<h3>Packets &amp; addresses</h3>
<p>Data is split into small <strong>packets</strong> that travel independently and are reassembled at the destination (packet switching). Every device has an <strong>IP address</strong>; <strong>DNS</strong> is the "phone book" that turns a name like <code>cs.harvard.edu</code> into an IP address.</p>
<h3>Layers — the TCP/IP model</h3>
<pre><code>Application  HTTP, DNS, email     (what the app speaks)
Transport    TCP / UDP            (reliable vs fast delivery)
Internet     IP                   (addressing &amp; routing)
Link         Ethernet, Wi-Fi      (the physical hop)
</code></pre>
<p>Each layer talks only to the one below — an <strong>abstraction</strong> so a web app never worries about Wi-Fi voltages.</p>
<h3>The web</h3>
<p>The <strong>World Wide Web</strong> runs on the Internet using <strong>HTTP/HTTPS</strong>. Your browser (a <strong>client</strong>) requests a page; a <strong>server</strong> replies. HTTPS adds encryption so no one in between can read it.</p>
<div class="callout"><span class="badge">Internet ≠ Web</span> The Internet is the infrastructure (cables, IP, packets); the Web is one service that runs on top of it — email, video calls and games are others.</div>`,
    `<span class="eyebrow">ICS101 · Chương 7 · Bài 7.1</span>
<h2>Mạng &amp; Internet</h2>
<h3>Mạng là gì</h3>
<p>Một <strong>mạng</strong> nối các máy tính để chúng trao đổi dữ liệu. <strong>Internet</strong> là mạng của các mạng — không ai sở hữu riêng, được giữ với nhau bằng các <strong>giao thức</strong> (quy tắc đã thống nhất).</p>
<h3>Gói tin &amp; địa chỉ</h3>
<p>Dữ liệu được chia thành các <strong>gói tin (packet)</strong> nhỏ đi độc lập rồi ghép lại ở đích (chuyển mạch gói). Mỗi thiết bị có một <strong>địa chỉ IP</strong>; <strong>DNS</strong> là "danh bạ" biến một tên như <code>cs.harvard.edu</code> thành địa chỉ IP.</p>
<h3>Phân tầng — mô hình TCP/IP</h3>
<pre><code>Ứng dụng    HTTP, DNS, email     (thứ ứng dụng nói)
Giao vận    TCP / UDP            (tin cậy vs nhanh)
Internet    IP                   (địa chỉ &amp; định tuyến)
Liên kết    Ethernet, Wi-Fi      (chặng vật lý)
</code></pre>
<p>Mỗi tầng chỉ nói chuyện với tầng ngay dưới — một <strong>trừu tượng</strong> để ứng dụng web không phải lo về điện áp Wi-Fi.</p>
<h3>Web</h3>
<p><strong>World Wide Web</strong> chạy trên Internet dùng <strong>HTTP/HTTPS</strong>. Trình duyệt (một <strong>client</strong>) xin một trang; <strong>máy chủ (server)</strong> trả lời. HTTPS thêm mã hoá để không ai ở giữa đọc được.</p>
<div class="callout"><span class="badge">Internet ≠ Web</span> Internet là hạ tầng (cáp, IP, gói tin); Web chỉ là một dịch vụ chạy trên đó — email, gọi video và game là những dịch vụ khác.</div>`,
  ]]);

const c7q = quiz('ics101-quiz-7', 'Quiz 7 — Networks & Internet|||Quiz 7 — Mạng & Internet', [
  { id: 'q1', question: 'DNS làm nhiệm vụ gì?', options: ['Mã hoá dữ liệu', 'Biến tên miền (vd example.com) thành địa chỉ IP', 'Chia dữ liệu thành gói tin', 'Cấp điện cho router'], correctIndex: 1, explanation: 'DNS như danh bạ: ánh xạ tên miền dễ nhớ sang địa chỉ IP.' },
  { id: 'q2', question: 'Phát biểu nào ĐÚNG về Internet và Web?', options: ['Internet và Web là một', 'Web là hạ tầng, Internet là dịch vụ', 'Internet là hạ tầng, Web là một dịch vụ chạy trên đó', 'Cả hai đều chỉ là cáp mạng'], correctIndex: 2, explanation: 'Internet là hạ tầng (IP, gói tin); Web (HTTP) chỉ là một trong nhiều dịch vụ trên đó.' },
  { id: 'q3', question: 'HTTPS thêm gì so với HTTP?', options: ['Tốc độ cao hơn', 'Mã hoá để bảo mật dữ liệu truyền', 'Địa chỉ IP mới', 'Nhiều gói tin hơn'], correctIndex: 1, explanation: 'HTTPS mã hoá kết nối, giúp bên thứ ba ở giữa không đọc được nội dung.' },
]);

const c8 = doc('ics101-8-1-databases-ai-ethics', '8.1 — Databases, AI & professional ethics|||8.1 — Cơ sở dữ liệu, AI & đạo đức nghề nghiệp',
  'Cơ sở dữ liệu quan hệ & SQL cơ bản; ý niệm trí tuệ nhân tạo/máy học; đạo đức nghề nghiệp (quyền riêng tư, thiên lệch, sở hữu trí tuệ, an ninh).',
  [[
    `<span class="eyebrow">ICS101 · Chapter 8 · Lesson 8.1</span>
<h2>Databases, AI &amp; professional ethics</h2>
<h3>Databases</h3>
<p>A <strong>database</strong> stores data so it can be queried reliably. In a <strong>relational database</strong> data lives in <strong>tables</strong> (rows &amp; columns); we ask questions with <strong>SQL</strong>. A <strong>primary key</strong> uniquely identifies each row.</p>
<pre><code>SQL — students with a high GPA:
  SELECT name, gpa
  FROM students
  WHERE gpa &gt;= 3.5
  ORDER BY gpa DESC;
</code></pre>
<h3>Artificial intelligence</h3>
<p><strong>AI</strong> is software that performs tasks needing "intelligence". Most modern AI is <strong>machine learning</strong>: instead of hand-coding rules, we <em>train</em> a model on data so it learns patterns (spam filters, recommendations, image recognition, chatbots). It predicts from patterns — it does not "understand" like a person.</p>
<h3>Professional ethics</h3>
<ul>
<li><strong>Privacy</strong> — collect only what you need; protect personal data.</li>
<li><strong>Bias &amp; fairness</strong> — models trained on biased data make biased decisions.</li>
<li><strong>Intellectual property</strong> — respect licences and copyright; credit sources.</li>
<li><strong>Security &amp; honesty</strong> — do not misuse access; report flaws responsibly (see the ACM Code of Ethics).</li>
</ul>
<div class="callout"><span class="badge">Power &amp; responsibility</span> Code you write can affect millions. A CS professional weighs not just "can we build it?" but "should we, and who might it harm?"</div>`,
    `<span class="eyebrow">ICS101 · Chương 8 · Bài 8.1</span>
<h2>Cơ sở dữ liệu, AI &amp; đạo đức nghề nghiệp</h2>
<h3>Cơ sở dữ liệu</h3>
<p>Một <strong>cơ sở dữ liệu (CSDL)</strong> lưu dữ liệu để truy vấn một cách tin cậy. Trong <strong>CSDL quan hệ</strong>, dữ liệu nằm trong các <strong>bảng</strong> (hàng &amp; cột); ta đặt câu hỏi bằng <strong>SQL</strong>. <strong>Khoá chính (primary key)</strong> định danh duy nhất mỗi hàng.</p>
<pre><code>SQL — sinh viên có GPA cao:
  SELECT name, gpa
  FROM students
  WHERE gpa &gt;= 3.5
  ORDER BY gpa DESC;
</code></pre>
<h3>Trí tuệ nhân tạo</h3>
<p><strong>AI</strong> là phần mềm làm các việc cần "trí thông minh". Phần lớn AI hiện đại là <strong>máy học (machine learning)</strong>: thay vì viết tay luật, ta <em>huấn luyện</em> một mô hình trên dữ liệu để nó học ra quy luật (lọc thư rác, gợi ý, nhận dạng ảnh, chatbot). Nó dự đoán từ quy luật — không "hiểu" như con người.</p>
<h3>Đạo đức nghề nghiệp</h3>
<ul>
<li><strong>Quyền riêng tư</strong> — chỉ thu thập thứ cần; bảo vệ dữ liệu cá nhân.</li>
<li><strong>Thiên lệch &amp; công bằng</strong> — mô hình huấn luyện trên dữ liệu thiên lệch sẽ ra quyết định thiên lệch.</li>
<li><strong>Sở hữu trí tuệ</strong> — tôn trọng giấy phép và bản quyền; ghi nguồn.</li>
<li><strong>An ninh &amp; trung thực</strong> — không lạm dụng quyền truy cập; báo lỗi có trách nhiệm (xem Bộ quy tắc đạo đức ACM).</li>
</ul>
<div class="callout"><span class="badge">Quyền lực &amp; trách nhiệm</span> Mã bạn viết có thể ảnh hưởng hàng triệu người. Người làm KHMT cân nhắc không chỉ "làm được không?" mà cả "có nên không, và ai có thể bị hại?"</div>`,
  ]]);

const c8q = quiz('ics101-quiz-8', 'Quiz 8 — Databases, AI & ethics|||Quiz 8 — CSDL, AI & đạo đức', [
  { id: 'q1', question: 'Trong CSDL quan hệ, ta truy vấn dữ liệu bằng ngôn ngữ nào?', options: ['HTML', 'SQL', 'Python', 'HTTP'], correctIndex: 1, explanation: 'SQL là ngôn ngữ chuẩn để truy vấn cơ sở dữ liệu quan hệ (bảng hàng/cột).' },
  { id: 'q2', question: 'Phần lớn AI hiện đại hoạt động theo cách nào?', options: ['Lập trình viên viết tay mọi luật', 'Máy học từ dữ liệu để tìm ra quy luật', 'Máy tính tự có ý thức', 'Chỉ tra bảng cố định'], correctIndex: 1, explanation: 'AI hiện đại chủ yếu là machine learning: huấn luyện mô hình trên dữ liệu, không viết tay luật.' },
  { id: 'q3', question: 'Vì sao mô hình AI có thể đưa ra quyết định thiên lệch?', options: ['Vì máy tính quá chậm', 'Vì được huấn luyện trên dữ liệu vốn đã thiên lệch', 'Vì thiếu RAM', 'Vì dùng SQL'], correctIndex: 1, explanation: 'Mô hình học từ dữ liệu; nếu dữ liệu thiên lệch thì quyết định cũng thiên lệch (vấn đề công bằng).' },
]);

export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'ICS101',
    slug: 'ics101-introduction-to-computer-science',
    title: 'Introduction to Computer Science',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/ICS101.webp',
    shortDescription: 'What computer science is — binary data, computer architecture (CPU/memory), operating systems, algorithms, programming, networks, databases, AI & ethics. Bilingual, with examples & quizzes.|||Khoa học máy tính là gì — dữ liệu nhị phân, kiến trúc máy tính (CPU/bộ nhớ), hệ điều hành, thuật toán, lập trình, mạng, cơ sở dữ liệu, AI & đạo đức. Song ngữ, có ví dụ & quiz.',
    description: 'Môn <strong>ICS101 — Introduction to Computer Science</strong> (kỳ 1, ngành Khoa học Máy tính) là chuyến khảo sát rộng toàn ngành. Từ <strong>KHMT là gì &amp; lịch sử máy tính</strong> → <strong>biểu diễn dữ liệu</strong> (nhị phân, hex, ký tự, ảnh) → <strong>kiến trúc máy tính</strong> (CPU/bộ nhớ) → <strong>hệ điều hành</strong> → <strong>thuật toán &amp; giải quyết vấn đề</strong> → <strong>lập trình</strong> → <strong>mạng &amp; Internet</strong> → <strong>cơ sở dữ liệu, AI &amp; đạo đức nghề nghiệp</strong>. Bám giáo trình chuẩn (Brookshear, SICP, CS50, Nand2Tetris), song ngữ, có ví dụ và quiz mỗi chương.',
    whatYouLearn: 'KHMT là gì &amp; lịch sử (Babbage, Turing, von Neumann, Moore); bit/byte, nhị phân &amp; hex, ASCII/Unicode, pixel &amp; RGB; kiến trúc von Neumann, CPU (ALU/control/register), chu trình fetch–decode–execute, phân cấp bộ nhớ; hệ điều hành (tiến trình, đa nhiệm, bộ nhớ, tệp); thuật toán, pseudocode, tìm tuyến tính/nhị phân, Big-O; lập trình (biến, điều khiển, hàm, biên dịch vs thông dịch, Python); mạng, gói tin, IP/DNS, TCP/IP, HTTP/HTTPS; CSDL &amp; SQL, máy học, đạo đức nghề nghiệp.',
    requirements: 'Không cần nền lập trình. Chỉ cần toán phổ thông cơ bản và một trình duyệt để thử code trực tuyến (Replit).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách kinh điển, CS50, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'KHMT là gì; biểu diễn, thuật toán, trừu tượng hoá.', lessons: [intro] },
    { title: 'Chương 1 — KHMT & lịch sử|||Chapter 1 — CS & history', description: 'Định nghĩa KHMT, các thế hệ máy tính, Turing & von Neumann.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Biểu diễn dữ liệu|||Chapter 2 — Data representation', description: 'Bit/byte, nhị phân & hex, ASCII/Unicode, ảnh & RGB.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Kiến trúc máy tính|||Chapter 3 — Architecture', description: 'CPU, fetch–decode–execute, phân cấp bộ nhớ.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Hệ điều hành|||Chapter 4 — Operating systems', description: 'Tiến trình, đa nhiệm, bộ nhớ, hệ thống tệp.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Thuật toán|||Chapter 5 — Algorithms', description: 'Pseudocode, ba cấu trúc điều khiển, tìm kiếm, Big-O.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Lập trình|||Chapter 6 — Programming', description: 'Biến, điều khiển, hàm, biên dịch vs thông dịch, Python.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Mạng & Internet|||Chapter 7 — Networks & Internet', description: 'Gói tin, IP/DNS, TCP/IP, HTTP/HTTPS, client–server.', lessons: [c7, c7q] },
    { title: 'Chương 8 — CSDL, AI & đạo đức|||Chapter 8 — Databases, AI & ethics', description: 'SQL, máy học, đạo đức nghề nghiệp.', lessons: [c8, c8q] },
  ],
};
