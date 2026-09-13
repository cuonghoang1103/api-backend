/**
 * PRF192 — Programming Fundamentals (ngôn ngữ C). Kỳ 1. Giáo trình FLM (syl 12223):
 * 9 CLO/9 chương — nhập môn & công cụ → biến/kiểu/bộ nhớ/IO/biểu thức → rẽ nhánh &
 * vòng lặp → module & hàm → con trỏ → thư viện chuẩn → mảng & struct → chuỗi → tệp.
 * Sách CHÍNH: "Foundations of Programming Using C" (Evan Weaver) + K&R + MOOC
 * intro2c.sdds.ca. Công cụ: DevC++ / VS Code + GCC. Song ngữ, code C chạy được.
 * Giữ NGUYÊN slug/semester/courseCode/thumbnailUrl; syncOrder: true.
 * ⚠️ code: KHÔNG backtick, KHÔNG ${ }; escape của C viết đôi ("\n" → \\n, "\0" → \\0);
 *    "<"/">" → &lt;/&gt;, "&" → &amp;.
 * Seed: node scripts/academy-seed-course.mjs --file ./content/academy/PRF192.mjs --apply
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

/* ═══════════════ 📚 TÀI LIỆU THAM KHẢO ═══════════════ */
const taiLieu = doc('prf192-tai-lieu-tham-khao', 'Course materials & references|||Trung tâm tài liệu tham khảo',
  'Sách chính (Evan Weaver) + K&R, MOOC intro2c.sdds.ca, tài liệu chuẩn C, YouTube, công cụ DevC++/VS Code, lộ trình tự học.',
  [[
    `<span class="eyebrow">PRF192 · Materials</span>
<h2>Course materials &amp; references</h2>
<p class="lead">Everything you need to learn <strong>Programming Fundamentals in C</strong> in one place. The full FPTU slides &amp; official syllabus live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbooks &amp; slides</h3>
<p>Official FPTU textbook &amp; lecture slides for PRF192 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<ul>
<li><strong>Foundations of Programming Using C</strong> — Evan Weaver <em>(the main textbook, free)</em>.</li>
<li><strong>The C Programming Language</strong> — Kernighan &amp; Ritchie ("K&amp;R", the classic reference; read it gradually).</li>
<li>MOOC: <a href="https://intro2c.sdds.ca" target="_blank" rel="noopener"><em>Introduction to C</em> — intro2c.sdds.ca</a> (Chris Szalwinski, Seneca College).</li>
</ul>
<h3>🌐 Free reference docs</h3>
<ul>
<li><a href="https://en.cppreference.com/w/c" target="_blank" rel="noopener">cppreference — C standard library</a> (the authoritative function reference).</li>
<li><a href="https://www.learn-c.org/" target="_blank" rel="noopener">learn-c.org</a> — interactive C tutorial in the browser.</li>
<li><a href="https://beej.us/guide/bgc/" target="_blank" rel="noopener">Beej's Guide to C Programming</a> — friendly, thorough, free.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@mycodeschool" target="_blank" rel="noopener">mycodeschool</a> — C &amp; data structures, drawn out step by step.</li>
<li><a href="https://www.youtube.com/@ProgrammingKnowledge" target="_blank" rel="noopener">ProgrammingKnowledge</a> — C from zero, DevC++/GCC setup.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.embarcadero.com/free-tools/dev-cpp" target="_blank" rel="noopener">Embarcadero Dev-C++ 6.3</a> — the IDE FPTU uses (compiler + editor in one).</li>
<li><a href="https://code.visualstudio.com/" target="_blank" rel="noopener">VS Code</a> + <a href="https://gcc.gnu.org/" target="_blank" rel="noopener">GCC</a> (MinGW-w64 on Windows) — the professional long-term setup.</li>
<li><a href="https://www.onlinegdb.com/online_c_compiler" target="_blank" rel="noopener">OnlineGDB</a> — compile &amp; run C in the browser, no install.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — program structure, variables &amp; types, expressions, <code>if</code>/loops (CLO1–CLO3).</li>
<li><strong>Practice</strong> — retype every example and run it; solve the auto-graded exercises on CodeLab.</li>
<li><strong>Go deeper</strong> — functions, pointers &amp; memory, arrays/structs, strings, files (CLO4–CLO9).</li>
<li><strong>Job-ready</strong> — build a small end-to-end C program (a menu-driven manager) and debug it cleanly.</li>
</ol></div>`,
    `<span class="eyebrow">PRF192 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Cơ sở lập trình bằng C</strong> gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của PRF192 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<ul>
<li><strong>Foundations of Programming Using C</strong> — Evan Weaver <em>(giáo trình chính, miễn phí)</em>.</li>
<li><strong>The C Programming Language</strong> — Kernighan &amp; Ritchie ("K&amp;R", kinh điển; nên đọc dần).</li>
<li>MOOC: <a href="https://intro2c.sdds.ca" target="_blank" rel="noopener"><em>Introduction to C</em> — intro2c.sdds.ca</a> (Chris Szalwinski, Seneca College).</li>
</ul>
<h3>🌐 Tài liệu tra cứu miễn phí</h3>
<ul>
<li><a href="https://en.cppreference.com/w/c" target="_blank" rel="noopener">cppreference — thư viện chuẩn C</a> (tra cứu hàm chính xác nhất).</li>
<li><a href="https://www.learn-c.org/" target="_blank" rel="noopener">learn-c.org</a> — học C tương tác ngay trên trình duyệt.</li>
<li><a href="https://beej.us/guide/bgc/" target="_blank" rel="noopener">Beej's Guide to C Programming</a> — dễ đọc, đầy đủ, miễn phí.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@mycodeschool" target="_blank" rel="noopener">mycodeschool</a> — C &amp; cấu trúc dữ liệu, vẽ từng bước.</li>
<li><a href="https://www.youtube.com/@ProgrammingKnowledge" target="_blank" rel="noopener">ProgrammingKnowledge</a> — C từ số 0, cài DevC++/GCC.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.embarcadero.com/free-tools/dev-cpp" target="_blank" rel="noopener">Embarcadero Dev-C++ 6.3</a> — IDE trường dùng (gộp trình biên dịch + soạn thảo).</li>
<li><a href="https://code.visualstudio.com/" target="_blank" rel="noopener">VS Code</a> + <a href="https://gcc.gnu.org/" target="_blank" rel="noopener">GCC</a> (MinGW-w64 trên Windows) — bộ công cụ chuyên nghiệp, dùng lâu dài.</li>
<li><a href="https://www.onlinegdb.com/online_c_compiler" target="_blank" rel="noopener">OnlineGDB</a> — biên dịch &amp; chạy C trên trình duyệt, không cần cài.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — cấu trúc chương trình, biến &amp; kiểu, biểu thức, <code>if</code>/vòng lặp (CLO1–CLO3).</li>
<li><strong>Luyện tập</strong> — gõ lại mọi ví dụ và chạy thử; làm bài chấm tự động trên CodeLab.</li>
<li><strong>Đào sâu</strong> — hàm, con trỏ &amp; bộ nhớ, mảng/struct, chuỗi, tệp (CLO4–CLO9).</li>
<li><strong>Sẵn sàng đi làm</strong> — viết trọn một chương trình C nhỏ (quản lý theo menu) và debug sạch.</li>
</ol></div>
<div class="callout"><span class="badge">Lưu ý</span> Đây là trung tâm liên kết nguyên gốc — không nhúng slide/sách có bản quyền. Link đổi thì vào FLM hoặc trang chủ chính thức để tìm.</div>`,
  ]]);

/* ═══════════════ GIỚI THIỆU MÔN HỌC ═══════════════ */
const intro = { ...doc('prf192-gioi-thieu', 'Course intro: 9 CLOs, grading & roadmap|||Giới thiệu môn: 9 CLO, cấu trúc điểm & lộ trình',
  'Môn học là gì, vì sao học C, 9 chuẩn đầu ra (CLO), cơ cấu điểm, và lộ trình 9 chương bám giáo trình FLM.',
  [[
    `<span class="eyebrow">PRF192 · Course introduction</span>
<h2>Programming Fundamentals — with the C language</h2>
<p class="lead">PRF192 is the <strong>first</strong> programming course of the Software Engineering track. The goal is not to memorize syntax but to <strong>think like a programmer</strong>: look at a real problem and break it into steps a computer can carry out.</p>
<p>The language is <strong>C</strong> — a small language close to how the machine really works. After C you understand what lies "underneath" every modern language (Java, C#, Python…): memory, pointers, data types. That is why the university puts C first. PRF192 is the prerequisite for <span class="badge">PRO192</span> (OOP) and <span class="badge">LAB211</span>.</p>
<h3>9 Course Learning Outcomes (CLOs)</h3>
<p>A CLO is what you <strong>must be able to do</strong> after the course. The exams follow the CLOs closely, so this map tells you what you'll be tested on.</p>
<table>
<thead><tr><th>CLO</th><th>You will be able to</th><th>Chapter</th></tr></thead>
<tbody>
<tr><td>CLO1</td><td>Explain the computer system, the software-development steps, and the structure of a simple C program</td><td>1</td></tr>
<tr><td>CLO2</td><td>Use variables/constants, data types, memory, I/O (<code>scanf</code>/<code>printf</code>) and expressions</td><td>2</td></tr>
<tr><td>CLO3</td><td>Use structured programming: selection (<code>if</code>/<code>switch</code>) and loops</td><td>3</td></tr>
<tr><td>CLO4</td><td>Design modules and write &amp; use functions</td><td>4</td></tr>
<tr><td>CLO5</td><td>Understand and use pointers</td><td>5</td></tr>
<tr><td>CLO6</td><td>Use the C standard library</td><td>6</td></tr>
<tr><td>CLO7</td><td>Use arrays (1-D, 2-D) and structs</td><td>7</td></tr>
<tr><td>CLO8</td><td>Process strings</td><td>8</td></tr>
<tr><td>CLO9</td><td>Read from and write to files</td><td>9</td></tr>
</tbody>
</table>
<h3>Grade structure</h3>
<table>
<thead><tr><th>Component</th><th>Weight</th><th>Note</th></tr></thead>
<tbody>
<tr><td>Assignment</td><td>15%</td><td>Done at home (CLO2–CLO9)</td></tr>
<tr><td>Practical Exam</td><td>30%</td><td>On a computer (CLO2–CLO8)</td></tr>
<tr><td>Progress Test <small>2 parts</small></td><td>15%</td><td>In class (CLO1, CLO5, CLO6, CLO9)</td></tr>
<tr><td>Workshop <small>5 parts</small></td><td>10%</td><td>In class (CLO1–CLO9)</td></tr>
<tr><td><strong>Final Exam</strong></td><td><strong>30%</strong></td><td><strong>50 multiple-choice questions</strong> (CLO1–CLO9)</td></tr>
</tbody>
</table>
<div class="callout warn">The Practical Exam (30%) and the Final (30%) make up 60% — both are taken <strong>live on a computer / as multiple choice</strong>, so rote learning won't help. Finish every Workshop and practise on CodeLab so your hands get used to typing code.</div>
<h3>Roadmap — 9 chapters + a deep-dive</h3>
<div class="lz-map">
<div class="lz-stage">Foundations</div>
<div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Intro &amp; tools</div><div class="lz-nsub">Computer system, dev steps, structure of a C program</div></div></div>
<div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Variables, types &amp; expressions</div><div class="lz-nsub">Memory, scanf/printf, operators &amp; precedence</div></div></div>
<div class="lz-stage">Control &amp; structure</div>
<div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Structured programming</div><div class="lz-nsub">if/switch · for/while/do-while</div></div></div>
<div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Modules &amp; functions</div><div class="lz-nsub">Split a problem into functions</div></div></div>
<div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Pointers</div><div class="lz-nsub">Addresses &amp; memory — the key to C</div></div></div>
<div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Standard library</div><div class="lz-nsub">stdlib, time, math, ctype</div></div></div>
<div class="lz-stage">Data</div>
<div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Arrays &amp; structs</div><div class="lz-nsub">Lists, matrices, search/sort, records</div></div></div>
<div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Strings</div><div class="lz-nsub">char arrays &amp; string.h</div></div></div>
<div class="lz-node"><div class="lz-badge">9</div><div class="lz-nbody"><div class="lz-ntitle">Files</div><div class="lz-nsub">Reading/writing data on disk</div></div></div>
<div class="lz-stage">Beyond the syllabus</div>
<div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Pointers &amp; memory deep · errors &amp; debugging</div><div class="lz-nsub">Stack/heap, segfault, buffer overflow, debug tips</div></div></div>
</div>
<div class="callout ok">The most effective way to study this course: <strong>retype every example and run it</strong>. Programming is a skill — like swimming, watching won't teach you.</div>`,
    `<span class="eyebrow">PRF192 · Giới thiệu môn học</span>
<h2>Cơ sở lập trình — với ngôn ngữ C</h2>
<p class="lead">PRF192 là môn lập trình <strong>đầu tiên</strong> của lộ trình Kỹ thuật phần mềm. Mục tiêu không phải học thuộc cú pháp, mà là <strong>tập tư duy như lập trình viên</strong>: nhìn một bài toán thực tế và chia nhỏ thành các bước máy tính làm được.</p>
<p>Ngôn ngữ dùng là <strong>C</strong> — một ngôn ngữ nhỏ, gần với cách máy tính thật sự hoạt động. Học C xong bạn hiểu được "bên dưới" của mọi ngôn ngữ hiện đại (Java, C#, Python…): bộ nhớ, con trỏ, kiểu dữ liệu. Đó là lý do trường đặt C ở môn mở đầu. PRF192 là tiên quyết của <span class="badge">PRO192</span> (OOP) và <span class="badge">LAB211</span>.</p>
<h3>9 chuẩn đầu ra (CLO)</h3>
<p>CLO là những gì bạn <strong>phải làm được</strong> sau môn. Đề thi bám sát CLO, nên bản đồ này cho biết bạn sẽ bị hỏi gì.</p>
<table>
<thead><tr><th>CLO</th><th>Bạn sẽ làm được</th><th>Chương</th></tr></thead>
<tbody>
<tr><td>CLO1</td><td>Giải thích hệ thống máy tính, các bước phát triển phần mềm và cấu trúc một chương trình C đơn giản</td><td>1</td></tr>
<tr><td>CLO2</td><td>Dùng biến/hằng, kiểu dữ liệu, bộ nhớ, nhập/xuất (<code>scanf</code>/<code>printf</code>) và biểu thức</td><td>2</td></tr>
<tr><td>CLO3</td><td>Dùng lập trình cấu trúc: rẽ nhánh (<code>if</code>/<code>switch</code>) và vòng lặp</td><td>3</td></tr>
<tr><td>CLO4</td><td>Thiết kế module và viết &amp; dùng hàm</td><td>4</td></tr>
<tr><td>CLO5</td><td>Hiểu và dùng con trỏ</td><td>5</td></tr>
<tr><td>CLO6</td><td>Dùng thư viện chuẩn C</td><td>6</td></tr>
<tr><td>CLO7</td><td>Dùng mảng (1 chiều, 2 chiều) và struct</td><td>7</td></tr>
<tr><td>CLO8</td><td>Xử lý chuỗi (string)</td><td>8</td></tr>
<tr><td>CLO9</td><td>Đọc/ghi tệp tin</td><td>9</td></tr>
</tbody>
</table>
<h3>Cơ cấu điểm</h3>
<table>
<thead><tr><th>Thành phần</th><th>Trọng số</th><th>Ghi chú</th></tr></thead>
<tbody>
<tr><td>Assignment</td><td>15%</td><td>Làm ở nhà (CLO2–CLO9)</td></tr>
<tr><td>Practical Exam</td><td>30%</td><td>Thi trên máy (CLO2–CLO8)</td></tr>
<tr><td>Progress Test <small>2 phần</small></td><td>15%</td><td>Kiểm tra tại lớp (CLO1, CLO5, CLO6, CLO9)</td></tr>
<tr><td>Workshop <small>5 phần</small></td><td>10%</td><td>Làm tại lớp (CLO1–CLO9)</td></tr>
<tr><td><strong>Final Exam</strong></td><td><strong>30%</strong></td><td><strong>Trắc nghiệm 50 câu</strong> (CLO1–CLO9)</td></tr>
</tbody>
</table>
<div class="callout warn">Practical Exam (30%) và Final (30%) chiếm 60% — đều thi <strong>trực tiếp trên máy / trắc nghiệm</strong>, không học vẹt được. Hãy làm hết Workshop và luyện trên CodeLab để tay quen gõ code.</div>
<h3>Lộ trình — 9 chương + phần chuyên sâu</h3>
<div class="lz-map">
<div class="lz-stage">Nền tảng</div>
<div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Nhập môn &amp; công cụ</div><div class="lz-nsub">Hệ thống máy tính, các bước phát triển, cấu trúc chương trình C</div></div></div>
<div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Biến, kiểu &amp; biểu thức</div><div class="lz-nsub">Bộ nhớ, scanf/printf, toán tử &amp; độ ưu tiên</div></div></div>
<div class="lz-stage">Điều khiển &amp; cấu trúc</div>
<div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Lập trình cấu trúc</div><div class="lz-nsub">if/switch · for/while/do-while</div></div></div>
<div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Module &amp; hàm</div><div class="lz-nsub">Chia bài toán thành hàm</div></div></div>
<div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Con trỏ</div><div class="lz-nsub">Địa chỉ &amp; bộ nhớ — chìa khoá của C</div></div></div>
<div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Thư viện chuẩn</div><div class="lz-nsub">stdlib, time, math, ctype</div></div></div>
<div class="lz-stage">Dữ liệu</div>
<div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Mảng &amp; struct</div><div class="lz-nsub">Danh sách, ma trận, tìm/sắp, bản ghi</div></div></div>
<div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Chuỗi</div><div class="lz-nsub">mảng char &amp; string.h</div></div></div>
<div class="lz-node"><div class="lz-badge">9</div><div class="lz-nbody"><div class="lz-ntitle">Tệp tin</div><div class="lz-nsub">Đọc/ghi dữ liệu ra ổ đĩa</div></div></div>
<div class="lz-stage">Ngoài giáo trình</div>
<div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Con trỏ &amp; bộ nhớ sâu · lỗi &amp; debug</div><div class="lz-nsub">Stack/heap, segfault, buffer overflow, mẹo debug</div></div></div>
</div>
<div class="callout ok">Cách học hiệu quả nhất: <strong>gõ lại mọi ví dụ và chạy thử</strong>. Lập trình là kỹ năng — như tập bơi, xem không làm bạn biết bơi.</div>`,
  ]]), isFreePreview: true };

/* ═══════════════ CHƯƠNG 1 — NHẬP MÔN & CÔNG CỤ (CLO1) ═══════════════ */
const c1a = { ...doc('prf192-1-1-may-tinh-phan-mem', '1.1 — The computer system & software-development steps|||1.1 — Hệ thống máy tính & các bước phát triển phần mềm',
  'Máy tính chạy chương trình thế nào, các bước phát triển phần mềm, biên dịch vs thông dịch, chuỗi 4 bước của compiler.',
  [[
    `<span class="eyebrow">PRF192 · Chapter 1 · Lesson 1.1</span>
<h2>How a computer runs a program</h2>
<p class="lead"><strong>Programming</strong> is writing a clear, ordered sequence of instructions for a computer to carry out a task. A computer is very fast but "can't think" — it does <em>exactly</em> what you tell it, even when you tell it something wrong.</p>
<h3>The computer system</h3>
<ul>
<li><strong>CPU</strong> — executes instructions; only understands <strong>machine code</strong> (0/1).</li>
<li><strong>Main memory (RAM)</strong> — holds your program and its data while it runs.</li>
<li><strong>Storage (disk)</strong> — keeps files after the power is off.</li>
<li><strong>I/O devices</strong> — keyboard/screen: how the program talks to you.</li>
</ul>
<h3>Steps to develop a program</h3>
<div class="lz-flow">
<div class="lz-step"><div class="lz-k">01</div><div class="lz-t">Analyze</div><div class="lz-d">Understand the problem, the input/output</div></div>
<div class="lz-step"><div class="lz-k">02</div><div class="lz-t">Design</div><div class="lz-d">Think of the algorithm, the steps</div></div>
<div class="lz-step"><div class="lz-k">03</div><div class="lz-t">Code</div><div class="lz-d">Write C code</div></div>
<div class="lz-step"><div class="lz-k">04</div><div class="lz-t">Compile</div><div class="lz-d">Fix syntax errors</div></div>
<div class="lz-step"><div class="lz-k">05</div><div class="lz-t">Test</div><div class="lz-d">Run it, fix logic errors</div></div>
</div>
<h3>Compiled vs interpreted</h3>
<table>
<thead><tr><th></th><th>Compiled — C</th><th>Interpreted — Python</th></tr></thead>
<tbody>
<tr><td>How it runs</td><td>Translate the whole file to an <code>.exe</code> first, then run</td><td>Read &amp; run line by line at execution</td></tr>
<tr><td>Speed</td><td>Fast</td><td>Slower</td></tr>
<tr><td>Errors</td><td>Every syntax error is caught at compile time; the program never runs until they're fixed</td><td>A syntax error stops it before line 1; a runtime error surfaces only when execution reaches the faulty line</td></tr>
</tbody>
</table>
<p>C is a <strong>compiled</strong> language, so every change means recompiling before running.</p>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> "Compile" is really <b>4 steps</b>: <b>preprocessing</b> (expand <code>#include</code>/<code>#define</code>) → <b>compiling</b> (C → assembly) → <b>assembling</b> (assembly → machine code <code>.o</code>) → <b>linking</b> (combine your <code>.o</code> with the library into one <code>.exe</code>). A "compile error" and a "linker error" are different stages failing.</div>`,
    `<span class="eyebrow">PRF192 · Chương 1 · Bài 1.1</span>
<h2>Máy tính chạy chương trình thế nào</h2>
<p class="lead"><strong>Lập trình</strong> là viết một dãy chỉ thị rõ ràng, tuần tự để máy tính thực hiện một công việc. Máy tính rất nhanh nhưng "không biết suy nghĩ" — nó làm <em>đúng y</em> những gì bạn bảo, kể cả khi bạn bảo sai.</p>
<h3>Hệ thống máy tính</h3>
<ul>
<li><strong>CPU</strong> — thực thi lệnh; chỉ hiểu <strong>mã máy</strong> (0/1).</li>
<li><strong>Bộ nhớ chính (RAM)</strong> — chứa chương trình và dữ liệu trong lúc chạy.</li>
<li><strong>Ổ đĩa (storage)</strong> — giữ tệp sau khi tắt máy.</li>
<li><strong>Thiết bị vào/ra</strong> — bàn phím/màn hình: cách chương trình nói chuyện với bạn.</li>
</ul>
<h3>Các bước phát triển một chương trình</h3>
<div class="lz-flow">
<div class="lz-step"><div class="lz-k">01</div><div class="lz-t">Phân tích</div><div class="lz-d">Hiểu đề, dữ liệu vào/ra</div></div>
<div class="lz-step"><div class="lz-k">02</div><div class="lz-t">Thiết kế</div><div class="lz-d">Nghĩ thuật toán, các bước</div></div>
<div class="lz-step"><div class="lz-k">03</div><div class="lz-t">Viết mã</div><div class="lz-d">Gõ code C</div></div>
<div class="lz-step"><div class="lz-k">04</div><div class="lz-t">Biên dịch</div><div class="lz-d">Sửa lỗi cú pháp</div></div>
<div class="lz-step"><div class="lz-k">05</div><div class="lz-t">Kiểm thử</div><div class="lz-d">Chạy thử, sửa lỗi logic</div></div>
</div>
<h3>Biên dịch (compile) vs Thông dịch (interpret)</h3>
<table>
<thead><tr><th></th><th>Biên dịch — C</th><th>Thông dịch — Python</th></tr></thead>
<tbody>
<tr><td>Cách chạy</td><td>Dịch cả file ra <code>.exe</code> trước, rồi mới chạy</td><td>Đọc &amp; chạy từng dòng lúc thực thi</td></tr>
<tr><td>Tốc độ</td><td>Nhanh</td><td>Chậm hơn</td></tr>
<tr><td>Lỗi</td><td>Bắt mọi lỗi cú pháp lúc biên dịch; chưa sửa xong thì chưa chạy</td><td>Lỗi cú pháp dừng trước dòng 1; lỗi lúc chạy chỉ lộ khi thực thi tới dòng sai</td></tr>
</tbody>
</table>
<p>C là ngôn ngữ <strong>biên dịch</strong>, nên mỗi lần đổi code là phải biên dịch lại trước khi chạy.</p>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> "Biên dịch" thực ra là <b>4 bước</b>: <b>tiền xử lý</b> (bung <code>#include</code>/<code>#define</code>) → <b>compile</b> (C → assembly) → <b>assemble</b> (assembly → mã máy <code>.o</code>) → <b>link</b> (gộp <code>.o</code> của bạn với thư viện thành một <code>.exe</code>). "Lỗi biên dịch" và "lỗi liên kết" là hai giai đoạn khác nhau hỏng.</div>`,
  ]]), isFreePreview: true };

const c1b = doc('prf192-1-2-cau-truc-chuong-trinh-c', '1.2 — The structure of a C program & tools|||1.2 — Cấu trúc một chương trình C & công cụ',
  'Mổ xẻ chương trình C đầu tiên: #include, main(), comment, dấu ;. Cài & dùng DevC++ / VS Code + GCC.',
  [[
    `<span class="eyebrow">PRF192 · Chapter 1 · Lesson 1.2</span>
<h2>The structure of a C program</h2>
<p class="lead">Every C program has the same skeleton. Here is your first one — type it, compile it, run it.</p>
<pre><code class="language-c">#include &lt;stdio.h&gt;   // 1. include the standard I/O library

int main() {          // 2. execution starts here
    printf("Xin chao PRF192!\\n");  // 3. print a line
    return 0;         // 4. tell the OS: finished, no error
}
</code></pre>
<div class="out"><b>Output:</b> Xin chao PRF192!</div>
<h3>Line by line</h3>
<ul>
<li><code>#include &lt;stdio.h&gt;</code> — a <strong>preprocessor directive</strong> that loads the Standard Input/Output library so <code>printf</code>/<code>scanf</code> exist. No <code>;</code> after it.</li>
<li><code>int main()</code> — the <strong>main function</strong>; a C program <em>always starts at</em> <code>main</code>. The <code>{ }</code> braces hold its body.</li>
<li><code>printf(...)</code> — a statement that prints text. <code>\\n</code> means "newline".</li>
<li><code>return 0;</code> — ends <code>main</code> and returns 0 = "success" to the operating system.</li>
<li><strong>Comments</strong> — <code>// one line</code> or <code>/* many lines */</code>; ignored by the compiler, they explain the code.</li>
<li><strong>Every statement ends with <code>;</code></strong> — the semicolon is how C knows one instruction is finished.</li>
</ul>
<div class="pitfall">Beginners forget the <code>;</code>, or write <code>Printf</code> (capital P). C is <strong>case-sensitive</strong> and requires <code>;</code> — missing either is an immediate compile error. And save the file with a <code>.c</code> extension (not <code>.cpp</code>).</div>
<h3>Your tools</h3>
<p>You need a <strong>compiler</strong> (GCC) and an <strong>editor</strong>. Two options:</p>
<ul>
<li><strong>DevC++ 6.3</strong> — the compiler + editor in one. File → New → Source File, save as <code>.c</code>, press <kbd>F11</kbd> (Compile &amp; Run).</li>
<li><strong>VS Code + GCC</strong> — install VS Code, install GCC (MinGW-w64 on Windows, <code>xcode-select --install</code> on macOS, <code>sudo apt install gcc</code> on Linux), then compile in a terminal.</li>
</ul>
<pre><code class="language-c">gcc hello.c -o hello   // compile hello.c into a program "hello"
./hello                // run it (Windows: .\\hello)
</code></pre>
<div class="pitfall">If the DevC++ result window opens then closes instantly, add <code>getchar();</code> before <code>return 0;</code>. If a terminal says <code>'gcc' is not recognized</code>, GCC isn't on the PATH — add it and <strong>reopen</strong> the terminal (PATH is read only when a new window opens).</div>`,
    `<span class="eyebrow">PRF192 · Chương 1 · Bài 1.2</span>
<h2>Cấu trúc một chương trình C</h2>
<p class="lead">Mọi chương trình C đều có chung một khung. Đây là chương trình đầu tiên của bạn — gõ, biên dịch, chạy.</p>
<pre><code class="language-c">#include &lt;stdio.h&gt;   // 1. nạp thư viện nhập/xuất chuẩn

int main() {          // 2. chương trình bắt đầu chạy từ đây
    printf("Xin chao PRF192!\\n");  // 3. in một dòng
    return 0;         // 4. báo hệ điều hành: xong, không lỗi
}
</code></pre>
<div class="out"><b>Kết quả:</b> Xin chao PRF192!</div>
<h3>Giải thích từng dòng</h3>
<ul>
<li><code>#include &lt;stdio.h&gt;</code> — <strong>chỉ thị tiền xử lý</strong>, nạp thư viện Nhập/Xuất chuẩn để có <code>printf</code>/<code>scanf</code>. Không có <code>;</code> ở cuối.</li>
<li><code>int main()</code> — <strong>hàm main</strong>; chương trình C <em>luôn bắt đầu từ</em> <code>main</code>. Cặp ngoặc <code>{ }</code> chứa thân hàm.</li>
<li><code>printf(...)</code> — câu lệnh in chữ. <code>\\n</code> nghĩa là "xuống dòng".</li>
<li><code>return 0;</code> — kết thúc <code>main</code>, trả về 0 = "thành công" cho hệ điều hành.</li>
<li><strong>Chú thích</strong> — <code>// một dòng</code> hoặc <code>/* nhiều dòng */</code>; compiler bỏ qua, dùng để giải thích.</li>
<li><strong>Mỗi câu lệnh kết thúc bằng <code>;</code></strong> — dấu chấm phẩy để C biết một chỉ thị đã xong.</li>
</ul>
<div class="pitfall">Người mới hay quên <code>;</code>, hoặc viết <code>Printf</code> (P hoa). C <strong>phân biệt hoa–thường</strong> và bắt buộc <code>;</code> — thiếu là báo lỗi biên dịch ngay. Và lưu file đuôi <code>.c</code> (không phải <code>.cpp</code>).</div>
<h3>Công cụ</h3>
<p>Bạn cần một <strong>trình biên dịch</strong> (GCC) và một <strong>trình soạn thảo</strong>. Hai lựa chọn:</p>
<ul>
<li><strong>DevC++ 6.3</strong> — gộp trình biên dịch + soạn thảo. File → New → Source File, lưu đuôi <code>.c</code>, nhấn <kbd>F11</kbd> (Compile &amp; Run).</li>
<li><strong>VS Code + GCC</strong> — cài VS Code, cài GCC (MinGW-w64 trên Windows, <code>xcode-select --install</code> trên macOS, <code>sudo apt install gcc</code> trên Linux), rồi biên dịch trong terminal.</li>
</ul>
<pre><code class="language-c">gcc hello.c -o hello   // dịch hello.c thành chương trình "hello"
./hello                // chạy (Windows: .\\hello)
</code></pre>
<div class="pitfall">Nếu cửa sổ kết quả DevC++ hiện rồi tắt ngay, thêm <code>getchar();</code> trước <code>return 0;</code>. Nếu terminal báo <code>'gcc' is not recognized</code>, GCC chưa vào PATH — thêm vào rồi <strong>mở lại</strong> terminal (PATH chỉ đọc khi mở cửa sổ mới).</div>`,
  ]]);

const c1q = quiz('prf192-1-quiz', 'Quiz 1 — Intro & tools|||Quiz 1 — Nhập môn & công cụ', [
  { id: 'q1', question: 'Where does a C program start running?|||Chương trình C bắt đầu chạy từ đâu?', options: ['The first #include line|||Dòng #include đầu tiên', 'The main() function|||Hàm main()', 'The return 0 line|||Dòng return 0', 'The last line of the file|||Dòng cuối file'], correctIndex: 1, explanation: 'Mọi chương trình C luôn bắt đầu thực thi tại hàm main().' },
  { id: 'q2', question: 'What kind of language is C?|||C là ngôn ngữ loại nào?', options: ['Interpreted|||Thông dịch', 'Compiled|||Biên dịch', 'Needs no translation|||Không cần dịch', 'Runs only on the web|||Chỉ chạy trên web'], correctIndex: 1, explanation: 'C được biên dịch ra mã máy (.exe) trước khi chạy.' },
  { id: 'q3', question: 'Which character ends each C statement?|||Mỗi câu lệnh C kết thúc bằng ký tự nào?', options: ['Comma ,|||Dấu phẩy ,', 'Period .|||Dấu chấm .', 'Semicolon ;|||Dấu chấm phẩy ;', 'Newline|||Ký tự xuống dòng'], correctIndex: 2, explanation: 'Dấu ; báo cho C biết một câu lệnh đã kết thúc.' },
]);

/* ═══════════════ CHƯƠNG 2 — BIẾN, KIỂU, BỘ NHỚ, I/O & BIỂU THỨC (CLO2) ═══════════════ */
const c2a = doc('prf192-2-1-bien-kieu-io', '2.1 — Variables, constants, types, memory & I/O|||2.1 — Biến, hằng, kiểu dữ liệu, bộ nhớ & nhập/xuất',
  'Khai báo biến/hằng, các kiểu cơ bản và kích thước bộ nhớ, nhập/xuất bằng scanf & printf, bảng chỉ định định dạng.',
  [[
    `<span class="eyebrow">PRF192 · Chapter 2 · Lesson 2.1</span>
<h2>Variables, constants, data types &amp; memory</h2>
<p class="lead">A <strong>variable</strong> is a named box in memory that holds a value you can change. You must declare its <strong>type</strong> so C knows how many bytes to reserve and how to interpret them.</p>
<pre><code class="language-c">int age = 20;            // whole number
float gpa = 8.5f;        // real number (single precision)
double pi = 3.14159;     // real number (double precision)
char grade = 'A';        // one character (stored as a number)
const float VAT = 0.1f;  // a CONSTANT — cannot be changed later
</code></pre>
<h3>Basic types &amp; memory (typical sizes)</h3>
<table>
<thead><tr><th>Type</th><th>Meaning</th><th>Size</th><th>printf/scanf</th></tr></thead>
<tbody>
<tr><td><code>int</code></td><td>whole number</td><td>4 bytes</td><td><code>%d</code></td></tr>
<tr><td><code>long</code></td><td>large whole number</td><td>4–8 bytes</td><td><code>%ld</code></td></tr>
<tr><td><code>float</code></td><td>real, ~7 digits</td><td>4 bytes</td><td><code>%f</code></td></tr>
<tr><td><code>double</code></td><td>real, ~15 digits</td><td>8 bytes</td><td><code>%lf</code></td></tr>
<tr><td><code>char</code></td><td>one character</td><td>1 byte</td><td><code>%c</code></td></tr>
</tbody>
</table>
<p>A <code>char</code> is really a small integer holding the character's ASCII code — <code>'A'</code> is 65. That is why <code>'A' + 1</code> gives <code>'B'</code>.</p>
<h3>Output &amp; input</h3>
<pre><code class="language-c">#include &lt;stdio.h&gt;
int main() {
    int age;
    float gpa;
    printf("Nhap tuoi va GPA: ");
    scanf("%d %f", &amp;age, &amp;gpa);          // note the &amp; before each variable
    printf("Tuoi=%d, GPA=%.2f\\n", age, gpa);  // %.2f = 2 decimals
    return 0;
}
</code></pre>
<div class="pitfall"><code>scanf</code> needs the <strong>address</strong> of the variable, so you write <code>&amp;age</code> (the <code>&amp;</code> operator). Forgetting the <code>&amp;</code> is the #1 beginner crash. Also match the specifier to the type: reading an <code>int</code> with <code>%f</code> corrupts the value.</div>`,
    `<span class="eyebrow">PRF192 · Chương 2 · Bài 2.1</span>
<h2>Biến, hằng, kiểu dữ liệu &amp; bộ nhớ</h2>
<p class="lead"><strong>Biến</strong> là một ô nhớ có tên, chứa giá trị bạn có thể thay đổi. Phải khai báo <strong>kiểu</strong> để C biết cấp bao nhiêu byte và diễn giải chúng ra sao.</p>
<pre><code class="language-c">int age = 20;            // số nguyên
float gpa = 8.5f;        // số thực (độ chính xác đơn)
double pi = 3.14159;     // số thực (độ chính xác kép)
char grade = 'A';        // một ký tự (lưu dưới dạng số)
const float VAT = 0.1f;  // HẰNG SỐ — không sửa được về sau
</code></pre>
<h3>Các kiểu cơ bản &amp; bộ nhớ (kích thước điển hình)</h3>
<table>
<thead><tr><th>Kiểu</th><th>Ý nghĩa</th><th>Kích thước</th><th>printf/scanf</th></tr></thead>
<tbody>
<tr><td><code>int</code></td><td>số nguyên</td><td>4 byte</td><td><code>%d</code></td></tr>
<tr><td><code>long</code></td><td>số nguyên lớn</td><td>4–8 byte</td><td><code>%ld</code></td></tr>
<tr><td><code>float</code></td><td>số thực, ~7 chữ số</td><td>4 byte</td><td><code>%f</code></td></tr>
<tr><td><code>double</code></td><td>số thực, ~15 chữ số</td><td>8 byte</td><td><code>%lf</code></td></tr>
<tr><td><code>char</code></td><td>một ký tự</td><td>1 byte</td><td><code>%c</code></td></tr>
</tbody>
</table>
<p><code>char</code> thực ra là số nguyên nhỏ chứa mã ASCII của ký tự — <code>'A'</code> là 65. Vì thế <code>'A' + 1</code> cho <code>'B'</code>.</p>
<h3>Xuất &amp; nhập</h3>
<pre><code class="language-c">#include &lt;stdio.h&gt;
int main() {
    int age;
    float gpa;
    printf("Nhap tuoi va GPA: ");
    scanf("%d %f", &amp;age, &amp;gpa);          // chú ý dấu &amp; trước mỗi biến
    printf("Tuoi=%d, GPA=%.2f\\n", age, gpa);  // %.2f = 2 chữ số thập phân
    return 0;
}
</code></pre>
<div class="pitfall"><code>scanf</code> cần <strong>địa chỉ</strong> của biến, nên viết <code>&amp;age</code> (toán tử <code>&amp;</code>). Quên <code>&amp;</code> là lỗi vỡ chương trình số 1 của người mới. Cũng phải khớp chỉ định với kiểu: đọc <code>int</code> bằng <code>%f</code> sẽ hỏng giá trị.</div>`,
  ]]);

const c2b = doc('prf192-2-2-bieu-thuc-toan-tu', '2.2 — Expressions, operators & precedence|||2.2 — Biểu thức, toán tử & độ ưu tiên',
  'Toán tử số học/quan hệ/logic/bit/gán rút gọn, trộn kiểu & ép kiểu, và bảng độ ưu tiên toán tử.',
  [[
    `<span class="eyebrow">PRF192 · Chapter 2 · Lesson 2.2</span>
<h2>Expressions &amp; operators</h2>
<p class="lead">An <strong>expression</strong> combines values and operators to produce a new value. C has several operator groups.</p>
<table>
<thead><tr><th>Group</th><th>Operators</th><th>Example</th></tr></thead>
<tbody>
<tr><td>Arithmetic</td><td><code>+ - * / %</code></td><td><code>7 % 3</code> → 1 (remainder)</td></tr>
<tr><td>Relational</td><td><code>== != &lt; &gt; &lt;= &gt;=</code></td><td><code>a &gt;= 5</code> → 1 or 0</td></tr>
<tr><td>Logical</td><td><code>&amp;&amp; || !</code></td><td><code>(a&gt;0) &amp;&amp; (a&lt;10)</code></td></tr>
<tr><td>Bitwise</td><td><code>&amp; | ^ ~ &lt;&lt; &gt;&gt;</code></td><td><code>5 &amp; 3</code> → 1</td></tr>
<tr><td>Shorthand assign</td><td><code>+= -= *= /= %=</code></td><td><code>x += 2</code> is <code>x = x + 2</code></td></tr>
<tr><td>Increment/decrement</td><td><code>++ --</code></td><td><code>i++</code> adds 1</td></tr>
</tbody>
</table>
<h3>Integer division &amp; type mixing</h3>
<pre><code class="language-c">int a = 7, b = 2;
printf("%d\\n", a / b);          // 3  (integer division drops the fraction!)
printf("%f\\n", (float)a / b);   // 3.500000  (cast a to float first)
printf("%d\\n", 7 % 2);          // 1  (modulo = remainder)
</code></pre>
<p><strong>Casting</strong> <code>(float)a</code> converts a value's type on the fly. When you mix an <code>int</code> and a <code>float</code>, C promotes the <code>int</code> to <code>float</code> — but <code>a / b</code> above is computed as <em>int</em> before any promotion, which is why the cast must come first.</p>
<h3>Operator precedence (high → low)</h3>
<table>
<thead><tr><th>Level</th><th>Operators</th></tr></thead>
<tbody>
<tr><td>1 (highest)</td><td><code>()</code> <code>[]</code> — grouping, indexing</td></tr>
<tr><td>2</td><td><code>!</code> <code>++</code> <code>--</code> <code>(type)</code> unary <code>-</code></td></tr>
<tr><td>3</td><td><code>* / %</code></td></tr>
<tr><td>4</td><td><code>+ -</code></td></tr>
<tr><td>5</td><td><code>&lt; &lt;= &gt; &gt;=</code></td></tr>
<tr><td>6</td><td><code>== !=</code></td></tr>
<tr><td>7</td><td><code>&amp;&amp;</code></td></tr>
<tr><td>8</td><td><code>||</code></td></tr>
<tr><td>9 (lowest)</td><td><code>= += -= *= /=</code></td></tr>
</tbody>
</table>
<div class="callout"><span class="badge">Workshop</span> Compute a bill: <code>total = price * qty; if (total &gt; 1000000) total *= 0.9;</code> — <code>*</code> binds tighter than <code>=</code>, and <code>*=</code> applies the 10% discount in place.</div>
<div class="pitfall">Confusing <code>=</code> (assign) with <code>==</code> (compare) is a classic bug: <code>if (x = 5)</code> <em>assigns</em> 5 to x and is always true. Use <code>==</code> to compare.</div>`,
    `<span class="eyebrow">PRF192 · Chương 2 · Bài 2.2</span>
<h2>Biểu thức &amp; toán tử</h2>
<p class="lead"><strong>Biểu thức</strong> kết hợp các giá trị và toán tử để tạo ra giá trị mới. C có nhiều nhóm toán tử.</p>
<table>
<thead><tr><th>Nhóm</th><th>Toán tử</th><th>Ví dụ</th></tr></thead>
<tbody>
<tr><td>Số học</td><td><code>+ - * / %</code></td><td><code>7 % 3</code> → 1 (số dư)</td></tr>
<tr><td>Quan hệ</td><td><code>== != &lt; &gt; &lt;= &gt;=</code></td><td><code>a &gt;= 5</code> → 1 hoặc 0</td></tr>
<tr><td>Logic</td><td><code>&amp;&amp; || !</code></td><td><code>(a&gt;0) &amp;&amp; (a&lt;10)</code></td></tr>
<tr><td>Bit</td><td><code>&amp; | ^ ~ &lt;&lt; &gt;&gt;</code></td><td><code>5 &amp; 3</code> → 1</td></tr>
<tr><td>Gán rút gọn</td><td><code>+= -= *= /= %=</code></td><td><code>x += 2</code> là <code>x = x + 2</code></td></tr>
<tr><td>Tăng/giảm</td><td><code>++ --</code></td><td><code>i++</code> cộng 1</td></tr>
</tbody>
</table>
<h3>Chia nguyên &amp; trộn kiểu</h3>
<pre><code class="language-c">int a = 7, b = 2;
printf("%d\\n", a / b);          // 3  (chia nguyên bỏ phần lẻ!)
printf("%f\\n", (float)a / b);   // 3.500000  (ép a sang float trước)
printf("%d\\n", 7 % 2);          // 1  (modulo = số dư)
</code></pre>
<p><strong>Ép kiểu</strong> <code>(float)a</code> đổi kiểu của giá trị ngay tại chỗ. Khi trộn <code>int</code> với <code>float</code>, C nâng <code>int</code> lên <code>float</code> — nhưng <code>a / b</code> ở trên tính theo <em>int</em> trước khi nâng, nên phải ép kiểu trước.</p>
<h3>Độ ưu tiên toán tử (cao → thấp)</h3>
<table>
<thead><tr><th>Mức</th><th>Toán tử</th></tr></thead>
<tbody>
<tr><td>1 (cao nhất)</td><td><code>()</code> <code>[]</code> — gom nhóm, chỉ số</td></tr>
<tr><td>2</td><td><code>!</code> <code>++</code> <code>--</code> <code>(kiểu)</code> dấu <code>-</code> một ngôi</td></tr>
<tr><td>3</td><td><code>* / %</code></td></tr>
<tr><td>4</td><td><code>+ -</code></td></tr>
<tr><td>5</td><td><code>&lt; &lt;= &gt; &gt;=</code></td></tr>
<tr><td>6</td><td><code>== !=</code></td></tr>
<tr><td>7</td><td><code>&amp;&amp;</code></td></tr>
<tr><td>8</td><td><code>||</code></td></tr>
<tr><td>9 (thấp nhất)</td><td><code>= += -= *= /=</code></td></tr>
</tbody>
</table>
<div class="callout"><span class="badge">Workshop</span> Tính hoá đơn: <code>total = price * qty; if (total &gt; 1000000) total *= 0.9;</code> — <code>*</code> ưu tiên hơn <code>=</code>, còn <code>*=</code> giảm giá 10% ngay tại chỗ.</div>
<div class="pitfall">Nhầm <code>=</code> (gán) với <code>==</code> (so sánh) là lỗi kinh điển: <code>if (x = 5)</code> <em>gán</em> 5 cho x và luôn đúng. Muốn so sánh phải dùng <code>==</code>.</div>`,
  ]]);

const c2q = quiz('prf192-2-quiz', 'Quiz 2 — Variables & expressions|||Quiz 2 — Biến & biểu thức', [
  { id: 'q1', question: 'In C, what does 7 / 2 evaluate to?|||Trong C, 7 / 2 cho kết quả bao nhiêu?', options: ['3.5', '3', '4', 'Error|||Báo lỗi'], correctIndex: 1, explanation: 'Chia hai số nguyên là chia nguyên, bỏ phần lẻ → 3. Muốn 3.5 phải ép kiểu (float).' },
  { id: 'q2', question: 'Why must you write &amp;age in scanf("%d", &amp;age)?|||Vì sao phải viết &amp;age trong scanf("%d", &amp;age)?', options: ['To make it faster|||Để chạy nhanh hơn', 'scanf needs the memory ADDRESS of the variable|||scanf cần ĐỊA CHỈ ô nhớ của biến', 'It is optional|||Có cũng được không cũng được', 'To print the value|||Để in giá trị'], correctIndex: 1, explanation: 'scanf ghi giá trị vào biến nên cần địa chỉ của nó (&amp;).' },
  { id: 'q3', question: 'What is the value of the expression (3 > 2) && (5 == 5)?|||Biểu thức (3 > 2) && (5 == 5) có giá trị?', options: ['0 (false)|||0 (sai)', '1 (true)|||1 (đúng)', '5', 'Error|||Lỗi'], correctIndex: 1, explanation: 'Cả hai vế đều đúng (1), AND của 1 và 1 là 1 (true).' },
]);

/* ═══════════════ CHƯƠNG 3 — LẬP TRÌNH CẤU TRÚC (CLO3) [Workshop 1] ═══════════════ */
const c3 = doc('prf192-3-1-re-nhanh-vong-lap', '3.1 — Structured programming: selection & loops|||3.1 — Lập trình cấu trúc: rẽ nhánh & vòng lặp',
  'if-else, switch-case; vòng lặp for/while/do-while; break/continue; ví dụ Workshop 1 (menu máy tính).',
  [[
    `<span class="eyebrow">PRF192 · Chapter 3 · Lesson 3.1</span>
<h2>Selection: if / else / switch</h2>
<p class="lead">By default a program runs top to bottom. <strong>Selection</strong> lets it choose a branch based on a condition.</p>
<pre><code class="language-c">int score = 7;
if (score &gt;= 8)        printf("Gioi\\n");
else if (score &gt;= 5)   printf("Dat\\n");
else                   printf("Truot\\n");
</code></pre>
<p>When you branch on one variable equal to fixed values, <code>switch</code> is cleaner. Each <code>case</code> needs a <code>break</code> or it "falls through" to the next.</p>
<pre><code class="language-c">int choice = 2;
switch (choice) {
    case 1: printf("Cong\\n"); break;
    case 2: printf("Tru\\n");  break;
    default: printf("Sai lua chon\\n");
}
</code></pre>
<h3>Loops: for / while / do-while</h3>
<table>
<thead><tr><th>Loop</th><th>Use when</th></tr></thead>
<tbody>
<tr><td><code>for</code></td><td>You know how many times (a counter)</td></tr>
<tr><td><code>while</code></td><td>Repeat while a condition holds (0..N times)</td></tr>
<tr><td><code>do-while</code></td><td>Run at least once, then check</td></tr>
</tbody>
</table>
<pre><code class="language-c">for (int i = 1; i &lt;= 5; i++) printf("%d ", i);   // 1 2 3 4 5

int n = 5;
while (n &gt; 0) { printf("%d ", n); n--; }         // 5 4 3 2 1

int x;
do { printf("Nhap so &gt; 0: "); scanf("%d", &amp;x); } while (x &lt;= 0);
</code></pre>
<p><code>break</code> exits a loop early; <code>continue</code> skips to the next iteration.</p>
<div class="callout"><span class="badge">Workshop 1</span> A menu calculator: loop showing +, −, ×, ÷ and Quit; read the choice with <code>switch</code>; keep looping with <code>do-while</code> until the user picks Quit. Guard division by zero with an <code>if</code>.</div>
<div class="pitfall">An <strong>infinite loop</strong> happens when the condition never becomes false — forgetting <code>n--</code> above loops forever. And a stray <code>;</code> right after <code>for(...)</code> makes an empty loop body. Watch <strong>off-by-one</strong>: <code>i &lt;= 5</code> runs 5 times, <code>i &lt; 5</code> runs 4.</div>`,
    `<span class="eyebrow">PRF192 · Chương 3 · Bài 3.1</span>
<h2>Rẽ nhánh: if / else / switch</h2>
<p class="lead">Mặc định chương trình chạy từ trên xuống. <strong>Rẽ nhánh</strong> cho phép chọn một hướng đi tuỳ điều kiện.</p>
<pre><code class="language-c">int score = 7;
if (score &gt;= 8)        printf("Gioi\\n");
else if (score &gt;= 5)   printf("Dat\\n");
else                   printf("Truot\\n");
</code></pre>
<p>Khi rẽ theo một biến bằng các giá trị cố định, <code>switch</code> gọn hơn. Mỗi <code>case</code> cần <code>break</code>, thiếu là "rơi" xuống case kế.</p>
<pre><code class="language-c">int choice = 2;
switch (choice) {
    case 1: printf("Cong\\n"); break;
    case 2: printf("Tru\\n");  break;
    default: printf("Sai lua chon\\n");
}
</code></pre>
<h3>Vòng lặp: for / while / do-while</h3>
<table>
<thead><tr><th>Vòng lặp</th><th>Dùng khi</th></tr></thead>
<tbody>
<tr><td><code>for</code></td><td>Biết trước số lần (có biến đếm)</td></tr>
<tr><td><code>while</code></td><td>Lặp khi điều kiện còn đúng (0..N lần)</td></tr>
<tr><td><code>do-while</code></td><td>Chạy ít nhất một lần rồi mới kiểm</td></tr>
</tbody>
</table>
<pre><code class="language-c">for (int i = 1; i &lt;= 5; i++) printf("%d ", i);   // 1 2 3 4 5

int n = 5;
while (n &gt; 0) { printf("%d ", n); n--; }         // 5 4 3 2 1

int x;
do { printf("Nhap so &gt; 0: "); scanf("%d", &amp;x); } while (x &lt;= 0);
</code></pre>
<p><code>break</code> thoát vòng lặp sớm; <code>continue</code> nhảy sang vòng kế.</p>
<div class="callout"><span class="badge">Workshop 1</span> Máy tính có menu: lặp hiển thị +, −, ×, ÷ và Thoát; đọc lựa chọn bằng <code>switch</code>; giữ lặp bằng <code>do-while</code> tới khi người dùng chọn Thoát. Chặn chia cho 0 bằng <code>if</code>.</div>
<div class="pitfall"><strong>Vòng lặp vô tận</strong> xảy ra khi điều kiện không bao giờ sai — quên <code>n--</code> ở trên là lặp mãi. Một dấu <code>;</code> lạc ngay sau <code>for(...)</code> tạo thân lặp rỗng. Coi chừng <strong>lệch một đơn vị</strong>: <code>i &lt;= 5</code> chạy 5 lần, <code>i &lt; 5</code> chạy 4.</div>`,
  ]]);

const c3q = quiz('prf192-3-quiz', 'Quiz 3 — Selection & loops|||Quiz 3 — Rẽ nhánh & vòng lặp', [
  { id: 'q1', question: 'Which loop always runs its body at least once?|||Vòng lặp nào luôn chạy thân ít nhất một lần?', options: ['for', 'while', 'do-while', 'None|||Không cái nào'], correctIndex: 2, explanation: 'do-while kiểm điều kiện SAU khi chạy thân, nên chạy ít nhất một lần.' },
  { id: 'q2', question: 'What happens if a switch case has no break?|||Nếu một case trong switch thiếu break thì sao?', options: ['Compile error|||Lỗi biên dịch', 'It falls through into the next case|||Nó rơi xuống case kế tiếp', 'It skips the case|||Bỏ qua case đó', 'Nothing runs|||Không chạy gì'], correctIndex: 1, explanation: 'Thiếu break, luồng "rơi" (fall-through) và chạy tiếp case bên dưới.' },
  { id: 'q3', question: 'How many times does for(int i=0; i<5; i++) run?|||for(int i=0; i<5; i++) chạy bao nhiêu lần?', options: ['4', '5', '6', 'Infinite|||Vô tận'], correctIndex: 1, explanation: 'i chạy 0,1,2,3,4 → 5 lần (điều kiện i<5).' },
]);

/* ═══════════════ CHƯƠNG 4 — MODULE & HÀM (CLO4) [Workshop 2] ═══════════════ */
const c4 = doc('prf192-4-1-module-ham', '4.1 — Modules & functions|||4.1 — Module & hàm',
  'Tư duy chia module, định nghĩa/prototype/gọi hàm, truyền tham số theo giá trị, hàm dựng sẵn vs tự viết, phạm vi biến.',
  [[
    `<span class="eyebrow">PRF192 · Chapter 4 · Lesson 4.1</span>
<h2>Modules &amp; functions</h2>
<p class="lead">A <strong>function</strong> is a named block of code that does one job. Splitting a big problem into small functions (<strong>modular design</strong>) makes code easier to read, test, reuse and debug. Good functions do <em>one thing</em>, have a clear name, and hide their details behind their signature.</p>
<pre><code class="language-c">#include &lt;stdio.h&gt;

int add(int a, int b);   // 1. prototype (declaration)

int main() {
    int s = add(3, 4);   // 3. call
    printf("Tong = %d\\n", s);   // Tong = 7
    return 0;
}

int add(int a, int b) { // 2. definition
    return a + b;        // returns a value to the caller
}
</code></pre>
<ul>
<li><strong>Prototype</strong> — tells the compiler the function's shape before <code>main</code> uses it.</li>
<li><strong>Definition</strong> — the actual body.</li>
<li><strong>Parameters</strong> <code>a, b</code> receive a <strong>copy</strong> of the arguments — this is <strong>pass by value</strong>.</li>
<li><strong>Return</strong> value goes back to the caller; a function that returns nothing is <code>void</code>.</li>
</ul>
<h3>Pass by value — the copy trap</h3>
<pre><code class="language-c">void tryChange(int x) { x = 99; }   // changes only the LOCAL copy

int main() {
    int a = 5;
    tryChange(a);
    printf("%d\\n", a);   // still 5 — the original is untouched
    return 0;
}
</code></pre>
<p>To let a function modify the caller's variable you must pass its <strong>address</strong> (a pointer) — that's Chapter 5.</p>
<h3>Built-in vs user-defined &amp; variable scope</h3>
<p><strong>Built-in</strong> functions come from libraries (<code>printf</code>, <code>sqrt</code>, <code>strlen</code>). <strong>User-defined</strong> ones you write yourself. A variable declared inside a function is <strong>local</strong> — it exists only there; a variable declared outside all functions is <strong>global</strong> — visible everywhere (use sparingly).</p>
<div class="callout"><span class="badge">Workshop 2</span> Write a small library: <code>int isPrime(int n)</code>, <code>long factorial(int n)</code>, <code>int gcd(int a, int b)</code>. Test each from <code>main</code> with a menu. Every function does one job and returns a value.</div>
<div class="pitfall">Calling a function before the compiler has seen its prototype gives a warning and can pass arguments wrongly. Put prototypes above <code>main</code> (or in a header). And don't return the address of a <em>local</em> variable — it dies when the function ends.</div>`,
    `<span class="eyebrow">PRF192 · Chương 4 · Bài 4.1</span>
<h2>Module &amp; hàm</h2>
<p class="lead"><strong>Hàm</strong> là một khối lệnh có tên, làm một việc. Chia bài toán lớn thành các hàm nhỏ (<strong>thiết kế module</strong>) giúp code dễ đọc, dễ kiểm thử, dễ tái dùng và dễ debug. Hàm tốt làm <em>một việc</em>, tên rõ ràng, và giấu chi tiết sau chữ ký của nó.</p>
<pre><code class="language-c">#include &lt;stdio.h&gt;

int add(int a, int b);   // 1. prototype (khai báo)

int main() {
    int s = add(3, 4);   // 3. lời gọi
    printf("Tong = %d\\n", s);   // Tong = 7
    return 0;
}

int add(int a, int b) { // 2. định nghĩa
    return a + b;        // trả giá trị về nơi gọi
}
</code></pre>
<ul>
<li><strong>Prototype</strong> — báo cho compiler hình dạng hàm trước khi <code>main</code> dùng.</li>
<li><strong>Định nghĩa</strong> — phần thân thật.</li>
<li><strong>Tham số</strong> <code>a, b</code> nhận một <strong>bản sao</strong> của đối số — đây là <strong>truyền theo giá trị</strong>.</li>
<li><strong>Giá trị trả về</strong> quay lại nơi gọi; hàm không trả gì là <code>void</code>.</li>
</ul>
<h3>Truyền theo giá trị — cái bẫy bản sao</h3>
<pre><code class="language-c">void tryChange(int x) { x = 99; }   // chỉ đổi bản sao CỤC BỘ

int main() {
    int a = 5;
    tryChange(a);
    printf("%d\\n", a);   // vẫn là 5 — biến gốc không đổi
    return 0;
}
</code></pre>
<p>Muốn hàm sửa được biến của nơi gọi thì phải truyền <strong>địa chỉ</strong> (con trỏ) — đó là Chương 5.</p>
<h3>Hàm dựng sẵn vs tự viết &amp; phạm vi biến</h3>
<p>Hàm <strong>dựng sẵn</strong> đến từ thư viện (<code>printf</code>, <code>sqrt</code>, <code>strlen</code>). Hàm <strong>tự viết</strong> do bạn viết ra. Biến khai báo trong một hàm là <strong>cục bộ (local)</strong> — chỉ tồn tại ở đó; biến khai báo ngoài mọi hàm là <strong>toàn cục (global)</strong> — thấy ở mọi nơi (hạn chế dùng).</p>
<div class="callout"><span class="badge">Workshop 2</span> Viết một thư viện nhỏ: <code>int isPrime(int n)</code>, <code>long factorial(int n)</code>, <code>int gcd(int a, int b)</code>. Gọi thử từ <code>main</code> qua menu. Mỗi hàm làm một việc và trả về một giá trị.</div>
<div class="pitfall">Gọi hàm trước khi compiler thấy prototype sẽ có cảnh báo và có thể truyền sai đối số. Đặt prototype trên <code>main</code> (hoặc trong header). Và đừng trả về địa chỉ của biến <em>cục bộ</em> — nó chết khi hàm kết thúc.</div>`,
  ]]);

const c4q = quiz('prf192-4-quiz', 'Quiz 4 — Functions|||Quiz 4 — Hàm', [
  { id: 'q1', question: 'C passes arguments to a function by default using...|||Mặc định C truyền đối số vào hàm theo...', options: ['Pass by reference|||Truyền theo tham chiếu', 'Pass by value (a copy)|||Truyền theo giá trị (bản sao)', 'Global variables|||Biến toàn cục', 'Pointers only|||Chỉ con trỏ'], correctIndex: 1, explanation: 'Hàm nhận bản sao đối số, nên sửa tham số không đổi biến gốc.' },
  { id: 'q2', question: 'A function that returns no value has return type...|||Hàm không trả về giá trị có kiểu trả về là...', options: ['int', 'void', 'null', 'empty'], correctIndex: 1, explanation: 'void nghĩa là hàm không trả về giá trị nào.' },
  { id: 'q3', question: 'A variable declared inside a function is...|||Biến khai báo bên trong một hàm là...', options: ['Global|||Toàn cục', 'Local — visible only in that function|||Cục bộ — chỉ thấy trong hàm đó', 'Constant|||Hằng số', 'Static to the whole program|||Tĩnh toàn chương trình'], correctIndex: 1, explanation: 'Biến cục bộ chỉ tồn tại và nhìn thấy trong hàm khai báo nó.' },
]);

/* ═══════════════ CHƯƠNG 5 — CON TRỎ (CLO5) ═══════════════ */
const c5 = doc('prf192-5-1-con-tro', '5.1 — Pointers: address, dereference, pass-by-reference & malloc|||5.1 — Con trỏ: địa chỉ, truy xuất, pass-by-reference & malloc',
  'Khai báo con trỏ, toán tử & và *, truyền tham chiếu để hàm sửa biến gốc, cấp phát động malloc/free.',
  [[
    `<span class="eyebrow">PRF192 · Chapter 5 · Lesson 5.1</span>
<h2>Pointers — the key idea of C</h2>
<p class="lead">Every variable lives at an <strong>address</strong> in memory. A <strong>pointer</strong> is a variable that stores an address. This is the hardest but most important idea in C.</p>
<pre><code class="language-c">int x = 10;
int *p = &amp;x;     // p holds the ADDRESS of x  (&amp; = "address of")
printf("%d\\n", *p);   // 10  (*p = "the value AT that address" = dereference)
*p = 20;         // write through the pointer
printf("%d\\n", x);    // 20  (x changed via p!)
</code></pre>
<ul>
<li><code>&amp;x</code> — the <strong>address of</strong> x.</li>
<li><code>int *p</code> — p is a <strong>pointer to int</strong>.</li>
<li><code>*p</code> — <strong>dereference</strong>: the value stored at the address p holds.</li>
</ul>
<h3>Pass by reference — let a function change your variable</h3>
<p>In Chapter 4, <code>tryChange</code> couldn't change the original because C passes copies. Pass the <strong>address</strong> and the function can reach the real variable:</p>
<pre><code class="language-c">void swap(int *a, int *b) {   // receive addresses
    int tmp = *a; *a = *b; *b = tmp;   // work through the pointers
}
int main() {
    int x = 1, y = 2;
    swap(&amp;x, &amp;y);       // pass addresses
    printf("%d %d\\n", x, y);   // 2 1  — really swapped
    return 0;
}
</code></pre>
<p>This is exactly why <code>scanf("%d", &amp;age)</code> needs the <code>&amp;</code>: <code>scanf</code> receives the address so it can write into your variable.</p>
<h3>Dynamic allocation — memory you ask for at runtime</h3>
<pre><code class="language-c">#include &lt;stdlib.h&gt;
int n = 5;
int *arr = (int*) malloc(n * sizeof(int));  // ask for n ints on the HEAP
if (arr == NULL) return 1;                  // always check!
for (int i = 0; i &lt; n; i++) arr[i] = i * i;
free(arr);                                  // give it back — no leaks
arr = NULL;                                 // avoid a dangling pointer
</code></pre>
<div class="pitfall">Three classic pointer crashes: (1) using an <strong>uninitialized</strong> pointer (points nowhere → segfault); (2) forgetting <code>free</code> → a <strong>memory leak</strong>; (3) using memory <em>after</em> <code>free</code> → a <strong>dangling pointer</strong>. Set a pointer to <code>NULL</code> after freeing, and never dereference <code>NULL</code>.</div>`,
    `<span class="eyebrow">PRF192 · Chương 5 · Bài 5.1</span>
<h2>Con trỏ — ý tưởng cốt lõi của C</h2>
<p class="lead">Mọi biến đều nằm ở một <strong>địa chỉ</strong> trong bộ nhớ. <strong>Con trỏ</strong> là biến chứa một địa chỉ. Đây là phần khó nhất nhưng quan trọng nhất của C.</p>
<pre><code class="language-c">int x = 10;
int *p = &amp;x;     // p giữ ĐỊA CHỈ của x  (&amp; = "địa chỉ của")
printf("%d\\n", *p);   // 10  (*p = "giá trị TẠI địa chỉ đó" = truy xuất)
*p = 20;         // ghi thông qua con trỏ
printf("%d\\n", x);    // 20  (x đổi qua p!)
</code></pre>
<ul>
<li><code>&amp;x</code> — <strong>địa chỉ của</strong> x.</li>
<li><code>int *p</code> — p là <strong>con trỏ tới int</strong>.</li>
<li><code>*p</code> — <strong>truy xuất (dereference)</strong>: giá trị lưu ở địa chỉ mà p giữ.</li>
</ul>
<h3>Truyền tham chiếu — cho hàm sửa được biến của bạn</h3>
<p>Ở Chương 4, <code>tryChange</code> không đổi được biến gốc vì C truyền bản sao. Truyền <strong>địa chỉ</strong> thì hàm chạm được biến thật:</p>
<pre><code class="language-c">void swap(int *a, int *b) {   // nhận địa chỉ
    int tmp = *a; *a = *b; *b = tmp;   // làm việc qua con trỏ
}
int main() {
    int x = 1, y = 2;
    swap(&amp;x, &amp;y);       // truyền địa chỉ
    printf("%d %d\\n", x, y);   // 2 1  — hoán đổi thật
    return 0;
}
</code></pre>
<p>Đây đúng là lý do <code>scanf("%d", &amp;age)</code> cần <code>&amp;</code>: <code>scanf</code> nhận địa chỉ để ghi được vào biến của bạn.</p>
<h3>Cấp phát động — xin bộ nhớ lúc chạy</h3>
<pre><code class="language-c">#include &lt;stdlib.h&gt;
int n = 5;
int *arr = (int*) malloc(n * sizeof(int));  // xin n số nguyên trên HEAP
if (arr == NULL) return 1;                  // luôn kiểm tra!
for (int i = 0; i &lt; n; i++) arr[i] = i * i;
free(arr);                                  // trả lại — không rò rỉ
arr = NULL;                                 // tránh con trỏ treo
</code></pre>
<div class="pitfall">Ba lỗi con trỏ kinh điển: (1) dùng con trỏ <strong>chưa khởi tạo</strong> (trỏ lung tung → segfault); (2) quên <code>free</code> → <strong>rò rỉ bộ nhớ</strong>; (3) dùng bộ nhớ <em>sau khi</em> <code>free</code> → <strong>con trỏ treo</strong>. Gán <code>NULL</code> sau khi free, và không bao giờ truy xuất <code>NULL</code>.</div>`,
  ]]);

const c5q = quiz('prf192-5-quiz', 'Quiz 5 — Pointers|||Quiz 5 — Con trỏ', [
  { id: 'q1', question: 'What does the & operator give you?|||Toán tử & cho bạn cái gì?', options: ['The value of a variable|||Giá trị của biến', 'The address of a variable|||Địa chỉ của biến', 'The type of a variable|||Kiểu của biến', 'A copy of a variable|||Bản sao của biến'], correctIndex: 1, explanation: '& là "địa chỉ của" — cho địa chỉ ô nhớ của biến.' },
  { id: 'q2', question: 'If int *p = &x, what is *p?|||Nếu int *p = &x, thì *p là gì?', options: ['The address of p|||Địa chỉ của p', 'The value stored at x|||Giá trị lưu tại x', 'A new variable|||Một biến mới', 'NULL'], correctIndex: 1, explanation: '*p truy xuất giá trị tại địa chỉ p giữ, tức giá trị của x.' },
  { id: 'q3', question: 'After free(arr), what should you do to avoid a dangling pointer?|||Sau free(arr), nên làm gì để tránh con trỏ treo?', options: ['Call malloc again|||Gọi malloc lại', 'Set arr = NULL|||Gán arr = NULL', 'Nothing|||Không cần làm gì', 'free(arr) again|||free(arr) lần nữa'], correctIndex: 1, explanation: 'Gán NULL để con trỏ không còn trỏ vào vùng đã giải phóng.' },
]);

/* ═══════════════ CHƯƠNG 6 — THƯ VIỆN CHUẨN (CLO6) [Progress Test 1] ═══════════════ */
const c6 = doc('prf192-6-1-thu-vien-chuan', '6.1 — The C standard library|||6.1 — Thư viện chuẩn C',
  'stdlib.h, time.h, math.h, ctype.h và nhập/xuất định dạng — dùng lại thay vì viết lại.',
  [[
    `<span class="eyebrow">PRF192 · Chapter 6 · Lesson 6.1</span>
<h2>The C standard library</h2>
<p class="lead">You rarely write everything yourself. The <strong>standard library</strong> ships ready-made functions — include the right header and call them.</p>
<table>
<thead><tr><th>Header</th><th>Gives you</th><th>Examples</th></tr></thead>
<tbody>
<tr><td><code>stdlib.h</code></td><td>utilities</td><td><code>rand</code>, <code>srand</code>, <code>atoi</code>, <code>abs</code>, <code>malloc</code>, <code>free</code></td></tr>
<tr><td><code>time.h</code></td><td>time</td><td><code>time</code>, <code>clock</code></td></tr>
<tr><td><code>math.h</code></td><td>math</td><td><code>sqrt</code>, <code>pow</code>, <code>fabs</code>, <code>ceil</code>, <code>floor</code></td></tr>
<tr><td><code>ctype.h</code></td><td>character tests</td><td><code>isdigit</code>, <code>isalpha</code>, <code>toupper</code>, <code>tolower</code></td></tr>
</tbody>
</table>
<pre><code class="language-c">#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;time.h&gt;
#include &lt;math.h&gt;
#include &lt;ctype.h&gt;

int main() {
    srand(time(NULL));            // seed the RNG from the clock (once)
    int dice = rand() % 6 + 1;    // random 1..6
    printf("Dice: %d\\n", dice);

    printf("sqrt(2) = %.4f\\n", sqrt(2.0));   // 1.4142
    printf("2^10 = %.0f\\n", pow(2, 10));      // 1024

    char c = 'a';
    printf("%c -&gt; %c\\n", c, toupper(c));      // a -> A
    printf("isdigit('7') = %d\\n", isdigit('7')); // non-zero (true)
    return 0;
}
</code></pre>
<h3>Formatted I/O</h3>
<p>Format specifiers control how values print: <code>%d</code> integer, <code>%f</code> float, <code>%.2f</code> two decimals, <code>%5d</code> right-align in 5 columns, <code>%c</code> char, <code>%s</code> string, <code>%x</code> hex.</p>
<div class="callout"><span class="badge">Progress Test 1</span> This is where the first progress test lands (CLO1/CLO5/CLO6). Be able to: seed and use <code>rand()</code> for a range, call <code>sqrt</code>/<code>pow</code> from <code>math.h</code>, and classify characters with <code>ctype.h</code>.</div>
<div class="pitfall">On some compilers <code>math.h</code> needs linking with <code>-lm</code> (<code>gcc prog.c -o prog -lm</code>). And call <code>srand(time(NULL))</code> <strong>once</strong> at startup — seeding inside a loop makes <code>rand()</code> repeat.</div>`,
    `<span class="eyebrow">PRF192 · Chương 6 · Bài 6.1</span>
<h2>Thư viện chuẩn C</h2>
<p class="lead">Bạn hiếm khi tự viết mọi thứ. <strong>Thư viện chuẩn</strong> có sẵn hàm dùng ngay — nạp đúng header rồi gọi.</p>
<table>
<thead><tr><th>Header</th><th>Cho bạn</th><th>Ví dụ</th></tr></thead>
<tbody>
<tr><td><code>stdlib.h</code></td><td>tiện ích</td><td><code>rand</code>, <code>srand</code>, <code>atoi</code>, <code>abs</code>, <code>malloc</code>, <code>free</code></td></tr>
<tr><td><code>time.h</code></td><td>thời gian</td><td><code>time</code>, <code>clock</code></td></tr>
<tr><td><code>math.h</code></td><td>toán học</td><td><code>sqrt</code>, <code>pow</code>, <code>fabs</code>, <code>ceil</code>, <code>floor</code></td></tr>
<tr><td><code>ctype.h</code></td><td>kiểm tra ký tự</td><td><code>isdigit</code>, <code>isalpha</code>, <code>toupper</code>, <code>tolower</code></td></tr>
</tbody>
</table>
<pre><code class="language-c">#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;time.h&gt;
#include &lt;math.h&gt;
#include &lt;ctype.h&gt;

int main() {
    srand(time(NULL));            // gieo hạt RNG từ đồng hồ (một lần)
    int dice = rand() % 6 + 1;    // ngẫu nhiên 1..6
    printf("Dice: %d\\n", dice);

    printf("sqrt(2) = %.4f\\n", sqrt(2.0));   // 1.4142
    printf("2^10 = %.0f\\n", pow(2, 10));      // 1024

    char c = 'a';
    printf("%c -&gt; %c\\n", c, toupper(c));      // a -> A
    printf("isdigit('7') = %d\\n", isdigit('7')); // khác 0 (đúng)
    return 0;
}
</code></pre>
<h3>Nhập/xuất định dạng</h3>
<p>Chỉ định định dạng điều khiển cách in: <code>%d</code> số nguyên, <code>%f</code> số thực, <code>%.2f</code> hai chữ số lẻ, <code>%5d</code> canh phải trong 5 cột, <code>%c</code> ký tự, <code>%s</code> chuỗi, <code>%x</code> hệ 16.</p>
<div class="callout"><span class="badge">Progress Test 1</span> Bài progress test đầu tiên rơi vào đây (CLO1/CLO5/CLO6). Cần làm được: gieo và dùng <code>rand()</code> trong một khoảng, gọi <code>sqrt</code>/<code>pow</code> từ <code>math.h</code>, phân loại ký tự với <code>ctype.h</code>.</div>
<div class="pitfall">Một số trình biên dịch cần liên kết <code>math.h</code> bằng <code>-lm</code> (<code>gcc prog.c -o prog -lm</code>). Và gọi <code>srand(time(NULL))</code> <strong>một lần</strong> lúc khởi động — gieo hạt trong vòng lặp làm <code>rand()</code> lặp lại giá trị.</div>`,
  ]]);

const c6q = quiz('prf192-progress-test-1', 'Progress Test 1 — Standard library|||Progress Test 1 — Thư viện chuẩn', [
  { id: 'q1', question: 'Which header do sqrt() and pow() come from?|||sqrt() và pow() đến từ header nào?', options: ['stdlib.h', 'math.h', 'stdio.h', 'ctype.h'], correctIndex: 1, explanation: 'Các hàm toán học nằm trong math.h.' },
  { id: 'q2', question: 'How do you get a random number 1..6?|||Làm sao lấy số ngẫu nhiên 1..6?', options: ['rand() % 6|||rand() % 6', 'rand() % 6 + 1|||rand() % 6 + 1', 'rand(6)|||rand(6)', 'random(1,6)|||random(1,6)'], correctIndex: 1, explanation: 'rand()%6 cho 0..5, cộng 1 thành 1..6.' },
  { id: 'q3', question: 'srand(time(NULL)) should be called...|||srand(time(NULL)) nên gọi...', options: ['Inside every loop|||Trong mỗi vòng lặp', 'Once at program start|||Một lần lúc bắt đầu chương trình', 'After each rand()|||Sau mỗi lần rand()', 'Never|||Không bao giờ'], correctIndex: 1, explanation: 'Gieo hạt một lần; gieo lại liên tục làm rand() lặp giá trị.' },
]);

/* ═══════════════ CHƯƠNG 7 — MẢNG & STRUCT (CLO7) [Workshop 3] ═══════════════ */
const c7a = doc('prf192-7-1-mang', '7.1 — Arrays: 1-D, 2-D, search & sort|||7.1 — Mảng: 1 chiều, 2 chiều, tìm kiếm & sắp xếp',
  'Mảng 1 chiều, ma trận 2 chiều, tìm kiếm tuyến tính và sắp xếp chọn (selection sort).',
  [[
    `<span class="eyebrow">PRF192 · Chapter 7 · Lesson 7.1</span>
<h2>Arrays — many values under one name</h2>
<p class="lead">An <strong>array</strong> stores many values of the same type in a row. Index starts at <strong>0</strong>: an array of size N has indices <code>0 .. N-1</code>.</p>
<pre><code class="language-c">int a[5] = {10, 20, 30, 40, 50};
int sum = 0;
for (int i = 0; i &lt; 5; i++) sum += a[i];
printf("Sum = %d\\n", sum);   // 150
</code></pre>
<h3>2-D arrays (matrices)</h3>
<pre><code class="language-c">int m[2][3] = {{1,2,3}, {4,5,6}};
for (int i = 0; i &lt; 2; i++) {
    for (int j = 0; j &lt; 3; j++) printf("%d ", m[i][j]);
    printf("\\n");
}
</code></pre>
<h3>Linear search &amp; selection sort</h3>
<pre><code class="language-c">// linear search: return the index of key, or -1
int find(int a[], int n, int key) {
    for (int i = 0; i &lt; n; i++) if (a[i] == key) return i;
    return -1;
}
// selection sort: repeatedly pick the smallest and swap it to the front
void selectionSort(int a[], int n) {
    for (int i = 0; i &lt; n - 1; i++) {
        int min = i;
        for (int j = i + 1; j &lt; n; j++) if (a[j] &lt; a[min]) min = j;
        int t = a[i]; a[i] = a[min]; a[min] = t;
    }
}
</code></pre>
<div class="pitfall">C does <strong>not</strong> check array bounds. Writing <code>a[5]</code> in a size-5 array (valid indices 0..4) is a <strong>buffer overflow</strong> — it corrupts nearby memory and may crash. Always loop <code>i &lt; n</code>, never <code>i &lt;= n</code>. When you pass an array to a function you must also pass its length <code>n</code> — the array "decays" to a pointer and loses its size.</div>`,
    `<span class="eyebrow">PRF192 · Chương 7 · Bài 7.1</span>
<h2>Mảng — nhiều giá trị dưới một tên</h2>
<p class="lead"><strong>Mảng</strong> lưu nhiều giá trị cùng kiểu liền nhau. Chỉ số bắt đầu từ <strong>0</strong>: mảng cỡ N có chỉ số <code>0 .. N-1</code>.</p>
<pre><code class="language-c">int a[5] = {10, 20, 30, 40, 50};
int sum = 0;
for (int i = 0; i &lt; 5; i++) sum += a[i];
printf("Sum = %d\\n", sum);   // 150
</code></pre>
<h3>Mảng 2 chiều (ma trận)</h3>
<pre><code class="language-c">int m[2][3] = {{1,2,3}, {4,5,6}};
for (int i = 0; i &lt; 2; i++) {
    for (int j = 0; j &lt; 3; j++) printf("%d ", m[i][j]);
    printf("\\n");
}
</code></pre>
<h3>Tìm kiếm tuyến tính &amp; sắp xếp chọn</h3>
<pre><code class="language-c">// tìm tuyến tính: trả chỉ số của key, hoặc -1
int find(int a[], int n, int key) {
    for (int i = 0; i &lt; n; i++) if (a[i] == key) return i;
    return -1;
}
// sắp xếp chọn: liên tục chọn phần tử nhỏ nhất và đưa lên đầu
void selectionSort(int a[], int n) {
    for (int i = 0; i &lt; n - 1; i++) {
        int min = i;
        for (int j = i + 1; j &lt; n; j++) if (a[j] &lt; a[min]) min = j;
        int t = a[i]; a[i] = a[min]; a[min] = t;
    }
}
</code></pre>
<div class="pitfall">C <strong>không</strong> kiểm biên mảng. Ghi <code>a[5]</code> trong mảng cỡ 5 (chỉ số hợp lệ 0..4) là <strong>tràn bộ đệm</strong> — làm hỏng ô nhớ kế bên và có thể sập. Luôn lặp <code>i &lt; n</code>, không bao giờ <code>i &lt;= n</code>. Khi truyền mảng vào hàm phải truyền kèm độ dài <code>n</code> — mảng "suy biến" thành con trỏ và mất kích thước.</div>`,
  ]]);

const c7b = doc('prf192-7-2-struct', '7.2 — Structs: composite data|||7.2 — Struct: dữ liệu phức hợp',
  'Định nghĩa struct, mảng struct, và ví dụ Workshop 3 (quản lý sinh viên).',
  [[
    `<span class="eyebrow">PRF192 · Chapter 7 · Lesson 7.2</span>
<h2>Structs — group related fields</h2>
<p class="lead">An array holds many of the <em>same</em> type. A <strong>struct</strong> groups fields of <em>different</em> types into one record — like a student with a name, an id and a GPA.</p>
<pre><code class="language-c">struct Student {
    char name[30];
    int  id;
    float gpa;
};

int main() {
    struct Student s = {"An", 1001, 8.5f};
    printf("%s (#%d) GPA %.1f\\n", s.name, s.id, s.gpa);  // access with .
    s.gpa = 9.0f;   // update a field
    return 0;
}
</code></pre>
<h3>Array of structs — a list of records</h3>
<pre><code class="language-c">struct Student list[3];
for (int i = 0; i &lt; 3; i++) {
    printf("Nhap ten, id, gpa: ");
    scanf("%s %d %f", list[i].name, &amp;list[i].id, &amp;list[i].gpa);
}
// note: list[i].name is already an address (an array), so no &amp;
</code></pre>
<div class="callout"><span class="badge">Workshop 3</span> Build a <strong>student manager</strong>: an array of <code>struct Student</code> plus a menu (add / list / search by id / sort by GPA / delete). Each action is its own function taking the array and its size. This is the exact pattern the Practical Exam rehearses.</div>
<div class="pitfall">Use <code>.</code> for a struct variable (<code>s.gpa</code>) but <code>-&gt;</code> for a <em>pointer</em> to a struct (<code>p-&gt;gpa</code>, short for <code>(*p).gpa</code>). Reading a string field with <code>scanf("%s", ...)</code> takes no <code>&amp;</code> because the field name is already an array address.</div>`,
    `<span class="eyebrow">PRF192 · Chương 7 · Bài 7.2</span>
<h2>Struct — gom các trường liên quan</h2>
<p class="lead">Mảng chứa nhiều phần tử <em>cùng</em> kiểu. <strong>Struct</strong> gom các trường <em>khác</em> kiểu thành một bản ghi — như một sinh viên có tên, mã và GPA.</p>
<pre><code class="language-c">struct Student {
    char name[30];
    int  id;
    float gpa;
};

int main() {
    struct Student s = {"An", 1001, 8.5f};
    printf("%s (#%d) GPA %.1f\\n", s.name, s.id, s.gpa);  // truy cập bằng .
    s.gpa = 9.0f;   // sửa một trường
    return 0;
}
</code></pre>
<h3>Mảng struct — một danh sách bản ghi</h3>
<pre><code class="language-c">struct Student list[3];
for (int i = 0; i &lt; 3; i++) {
    printf("Nhap ten, id, gpa: ");
    scanf("%s %d %f", list[i].name, &amp;list[i].id, &amp;list[i].gpa);
}
// lưu ý: list[i].name đã là địa chỉ (một mảng), nên không cần &amp;
</code></pre>
<div class="callout"><span class="badge">Workshop 3</span> Dựng <strong>quản lý sinh viên</strong>: một mảng <code>struct Student</code> cùng menu (thêm / liệt kê / tìm theo id / sắp theo GPA / xoá). Mỗi thao tác là một hàm riêng nhận mảng và kích thước. Đây đúng là mẫu mà Practical Exam luyện.</div>
<div class="pitfall">Dùng <code>.</code> cho biến struct (<code>s.gpa</code>) nhưng <code>-&gt;</code> cho <em>con trỏ</em> tới struct (<code>p-&gt;gpa</code>, viết tắt của <code>(*p).gpa</code>). Đọc trường chuỗi bằng <code>scanf("%s", ...)</code> không cần <code>&amp;</code> vì tên trường đã là địa chỉ mảng.</div>`,
  ]]);

const c7q = quiz('prf192-7-quiz', 'Quiz 7 — Arrays & structs|||Quiz 7 — Mảng & struct', [
  { id: 'q1', question: 'The valid indices of int a[5] are...|||Chỉ số hợp lệ của int a[5] là...', options: ['1 to 5|||1 đến 5', '0 to 5|||0 đến 5', '0 to 4|||0 đến 4', '1 to 4|||1 đến 4'], correctIndex: 2, explanation: 'Mảng cỡ 5 có chỉ số 0..4; a[5] là tràn bộ đệm.' },
  { id: 'q2', question: 'To access field gpa of struct variable s, you write...|||Để truy cập trường gpa của biến struct s, viết...', options: ['s->gpa', 's.gpa', 's[gpa]', 'gpa(s)'], correctIndex: 1, explanation: 'Dùng dấu chấm cho biến struct: s.gpa. Dấu -> dành cho con trỏ struct.' },
  { id: 'q3', question: 'Selection sort works by...|||Sắp xếp chọn hoạt động bằng cách...', options: ['Splitting the array in half|||Chia đôi mảng', 'Repeatedly picking the smallest and moving it to the front|||Liên tục chọn phần tử nhỏ nhất và đưa lên đầu', 'Swapping adjacent pairs only|||Chỉ đổi chỗ cặp kề nhau', 'Using a hash table|||Dùng bảng băm'], correctIndex: 1, explanation: 'Mỗi lượt tìm phần tử nhỏ nhất còn lại rồi đưa về đầu đoạn chưa sắp.' },
]);

/* ═══════════════ CHƯƠNG 8 — CHUỖI (CLO8) [Workshop 4] ═══════════════ */
const c8 = doc('prf192-8-1-chuoi', '8.1 — Strings: char arrays & string.h|||8.1 — Chuỗi: mảng char & string.h',
  'Chuỗi là mảng char kết thúc bằng \\0; nhập/xuất chuỗi, mảng chuỗi, thư viện string.h; ví dụ Workshop 4.',
  [[
    `<span class="eyebrow">PRF192 · Chapter 8 · Lesson 8.1</span>
<h2>Strings are char arrays</h2>
<p class="lead">C has no built-in string type. A <strong>string</strong> is just a <code>char</code> array that ends with a special <strong>null terminator</strong> <code>'\\0'</code>. The word "Hi" needs 3 chars: <code>'H'</code>, <code>'i'</code>, <code>'\\0'</code>.</p>
<pre><code class="language-c">char name[20] = "PRF192";   // compiler adds '\\0' automatically
printf("%s\\n", name);        // print with %s
printf("First char: %c\\n", name[0]);   // P
</code></pre>
<h3>Reading strings safely</h3>
<pre><code class="language-c">char line[50];
scanf("%s", line);          // reads ONE word (stops at space)
// better for a whole line (keeps spaces, limits length):
fgets(line, sizeof(line), stdin);
</code></pre>
<h3>The string.h library</h3>
<table>
<thead><tr><th>Function</th><th>Does</th></tr></thead>
<tbody>
<tr><td><code>strlen(s)</code></td><td>length (not counting <code>'\\0'</code>)</td></tr>
<tr><td><code>strcpy(dst, src)</code></td><td>copy src into dst</td></tr>
<tr><td><code>strcmp(a, b)</code></td><td>compare: 0 if equal</td></tr>
<tr><td><code>strcat(dst, src)</code></td><td>append src onto dst</td></tr>
</tbody>
</table>
<pre><code class="language-c">#include &lt;string.h&gt;
char a[20] = "Hello", b[] = "World";
printf("len=%lu\\n", strlen(a));   // 5
strcat(a, b);                      // a = "HelloWorld"
if (strcmp(a, "HelloWorld") == 0) printf("equal\\n");
</code></pre>
<h3>Array of strings</h3>
<pre><code class="language-c">char days[3][10] = {"Mon", "Tue", "Wed"};
for (int i = 0; i &lt; 3; i++) printf("%s\\n", days[i]);
</code></pre>
<div class="callout"><span class="badge">Workshop 4</span> Read a full name with <code>fgets</code>, then: count its length, convert to UPPERCASE, count the words, and reverse it — all without extra libraries beyond <code>string.h</code>/<code>ctype.h</code>.</div>
<div class="pitfall">Never compare strings with <code>==</code> (that compares addresses, not text) — use <code>strcmp</code>. And <code>strcpy</code>/<code>strcat</code> do <strong>no</strong> bounds check: copying a long string into a short buffer is a <strong>buffer overflow</strong>. Make the destination big enough (include room for <code>'\\0'</code>).</div>`,
    `<span class="eyebrow">PRF192 · Chương 8 · Bài 8.1</span>
<h2>Chuỗi là mảng ký tự</h2>
<p class="lead">C không có kiểu chuỗi sẵn. <strong>Chuỗi</strong> chỉ là mảng <code>char</code> kết thúc bằng <strong>ký tự null</strong> <code>'\\0'</code>. Chữ "Hi" cần 3 ký tự: <code>'H'</code>, <code>'i'</code>, <code>'\\0'</code>.</p>
<pre><code class="language-c">char name[20] = "PRF192";   // compiler tự thêm '\\0'
printf("%s\\n", name);        // in bằng %s
printf("First char: %c\\n", name[0]);   // P
</code></pre>
<h3>Đọc chuỗi an toàn</h3>
<pre><code class="language-c">char line[50];
scanf("%s", line);          // đọc MỘT từ (dừng ở dấu cách)
// tốt hơn cho cả dòng (giữ dấu cách, giới hạn độ dài):
fgets(line, sizeof(line), stdin);
</code></pre>
<h3>Thư viện string.h</h3>
<table>
<thead><tr><th>Hàm</th><th>Làm gì</th></tr></thead>
<tbody>
<tr><td><code>strlen(s)</code></td><td>độ dài (không tính <code>'\\0'</code>)</td></tr>
<tr><td><code>strcpy(dst, src)</code></td><td>chép src vào dst</td></tr>
<tr><td><code>strcmp(a, b)</code></td><td>so sánh: 0 nếu bằng</td></tr>
<tr><td><code>strcat(dst, src)</code></td><td>nối src vào cuối dst</td></tr>
</tbody>
</table>
<pre><code class="language-c">#include &lt;string.h&gt;
char a[20] = "Hello", b[] = "World";
printf("len=%lu\\n", strlen(a));   // 5
strcat(a, b);                      // a = "HelloWorld"
if (strcmp(a, "HelloWorld") == 0) printf("equal\\n");
</code></pre>
<h3>Mảng chuỗi</h3>
<pre><code class="language-c">char days[3][10] = {"Mon", "Tue", "Wed"};
for (int i = 0; i &lt; 3; i++) printf("%s\\n", days[i]);
</code></pre>
<div class="callout"><span class="badge">Workshop 4</span> Đọc họ tên đầy đủ bằng <code>fgets</code>, rồi: đếm độ dài, đổi sang IN HOA, đếm số từ, và đảo ngược chuỗi — chỉ dùng <code>string.h</code>/<code>ctype.h</code>.</div>
<div class="pitfall">Không bao giờ so sánh chuỗi bằng <code>==</code> (nó so địa chỉ, không so chữ) — dùng <code>strcmp</code>. Và <code>strcpy</code>/<code>strcat</code> <strong>không</strong> kiểm biên: chép chuỗi dài vào bộ đệm ngắn là <strong>tràn bộ đệm</strong>. Hãy để đích đủ lớn (chừa chỗ cho <code>'\\0'</code>).</div>`,
  ]]);

const c8q = quiz('prf192-8-quiz', 'Quiz 8 — Strings|||Quiz 8 — Chuỗi', [
  { id: 'q1', question: 'What marks the end of a C string?|||Cái gì đánh dấu kết thúc một chuỗi C?', options: ["A space ' '|||Dấu cách ' '", "The null terminator '\\0'|||Ký tự null '\\0'", 'A newline|||Ký tự xuống dòng', 'The number 0 stored as int|||Số 0 kiểu int'], correctIndex: 1, explanation: "Chuỗi C kết thúc bằng ký tự null '\\0'." },
  { id: 'q2', question: 'How do you correctly compare two strings for equality?|||So sánh hai chuỗi bằng nhau đúng cách là?', options: ['a == b', 'strcmp(a, b) == 0', 'a = b', 'strlen(a) == strlen(b)'], correctIndex: 1, explanation: 'strcmp trả 0 khi hai chuỗi giống nhau; == chỉ so địa chỉ.' },
  { id: 'q3', question: 'strlen("PRF") returns...|||strlen("PRF") trả về...', options: ['2', '3', '4', '0'], correctIndex: 1, explanation: "strlen đếm ký tự không kể '\\0' → 3." },
]);

/* ═══════════════ CHƯƠNG 9 — TỆP TIN (CLO9) [Workshop 5 · Progress Test 2] ═══════════════ */
const c9 = doc('prf192-9-1-tep', '9.1 — Files: text/binary, read & write|||9.1 — Tệp tin: text/binary, đọc & ghi',
  'Khái niệm tệp, text vs binary, cách truy cập; fopen/fclose/fprintf/fscanf/fgets/fwrite/fread; Workshop 5.',
  [[
    `<span class="eyebrow">PRF192 · Chapter 9 · Lesson 9.1</span>
<h2>Files — keep data after the program ends</h2>
<p class="lead">Variables vanish when a program stops. To <strong>persist</strong> data you write it to a <strong>file</strong> on disk. In C you work through a <code>FILE *</code> handle.</p>
<h3>Text vs binary</h3>
<ul>
<li><strong>Text files</strong> — human-readable characters (<code>.txt</code>, <code>.csv</code>); use <code>fprintf</code>/<code>fscanf</code>/<code>fgets</code>.</li>
<li><strong>Binary files</strong> — raw bytes exactly as in memory; use <code>fwrite</code>/<code>fread</code>. Compact and fast, but not human-readable.</li>
</ul>
<h3>The four steps: open → work → check → close</h3>
<pre><code class="language-c">#include &lt;stdio.h&gt;
int main() {
    // WRITE
    FILE *f = fopen("diem.txt", "w");   // "w"=write (overwrites), "a"=append
    if (f == NULL) { printf("Khong mo duoc file\\n"); return 1; }
    fprintf(f, "An 8.5\\n");
    fprintf(f, "Binh 7.0\\n");
    fclose(f);                          // ALWAYS close

    // READ
    char name[30]; float gpa;
    f = fopen("diem.txt", "r");         // "r"=read
    if (f == NULL) return 1;
    while (fscanf(f, "%s %f", name, &amp;gpa) == 2)  // 2 = both fields read
        printf("%s -&gt; %.1f\\n", name, gpa);
    fclose(f);
    return 0;
}
</code></pre>
<p>Read modes: <code>"r"</code> read, <code>"w"</code> write (truncates), <code>"a"</code> append, add <code>"b"</code> for binary (<code>"rb"</code>, <code>"wb"</code>). Detect end-of-file with <code>EOF</code> / <code>feof</code>, or (better) by checking that <code>fscanf</code> returned the expected field count.</p>
<div class="callout"><span class="badge">Workshop 5</span> Extend the student manager: <strong>save</strong> the array of structs to <code>students.txt</code> and <strong>load</strong> it back on startup, so data survives between runs. Use <code>fprintf</code>/<code>fscanf</code> (text) or <code>fwrite</code>/<code>fread</code> (binary).</div>
<div class="callout"><span class="badge">Progress Test 2</span> The second progress test covers CLO9 (files): opening in the right mode, checking <code>NULL</code>, reading until end-of-file, and always closing.</div>
<div class="pitfall">Two must-dos: always check <code>fopen</code> for <code>NULL</code> (the file may not exist or be locked), and always <code>fclose</code> (unclosed files can lose the last buffered writes). Opening with <code>"w"</code> <strong>erases</strong> the file — use <code>"a"</code> to add to it.</div>`,
    `<span class="eyebrow">PRF192 · Chương 9 · Bài 9.1</span>
<h2>Tệp tin — giữ dữ liệu sau khi chương trình kết thúc</h2>
<p class="lead">Biến biến mất khi chương trình dừng. Muốn <strong>lưu bền</strong> dữ liệu thì ghi ra <strong>tệp</strong> trên ổ đĩa. Trong C bạn làm việc qua một tay cầm <code>FILE *</code>.</p>
<h3>Text vs binary</h3>
<ul>
<li><strong>Tệp văn bản</strong> — ký tự đọc được bằng mắt (<code>.txt</code>, <code>.csv</code>); dùng <code>fprintf</code>/<code>fscanf</code>/<code>fgets</code>.</li>
<li><strong>Tệp nhị phân</strong> — byte thô đúng như trong bộ nhớ; dùng <code>fwrite</code>/<code>fread</code>. Gọn và nhanh, nhưng không đọc được bằng mắt.</li>
</ul>
<h3>Bốn bước: mở → làm việc → kiểm → đóng</h3>
<pre><code class="language-c">#include &lt;stdio.h&gt;
int main() {
    // GHI
    FILE *f = fopen("diem.txt", "w");   // "w"=ghi (đè), "a"=ghi nối
    if (f == NULL) { printf("Khong mo duoc file\\n"); return 1; }
    fprintf(f, "An 8.5\\n");
    fprintf(f, "Binh 7.0\\n");
    fclose(f);                          // LUÔN đóng

    // ĐỌC
    char name[30]; float gpa;
    f = fopen("diem.txt", "r");         // "r"=đọc
    if (f == NULL) return 1;
    while (fscanf(f, "%s %f", name, &amp;gpa) == 2)  // 2 = đọc đủ hai trường
        printf("%s -&gt; %.1f\\n", name, gpa);
    fclose(f);
    return 0;
}
</code></pre>
<p>Chế độ mở: <code>"r"</code> đọc, <code>"w"</code> ghi (xoá trắng), <code>"a"</code> ghi nối, thêm <code>"b"</code> cho nhị phân (<code>"rb"</code>, <code>"wb"</code>). Nhận biết hết tệp bằng <code>EOF</code> / <code>feof</code>, hoặc (tốt hơn) kiểm số trường mà <code>fscanf</code> trả về.</p>
<div class="callout"><span class="badge">Workshop 5</span> Mở rộng quản lý sinh viên: <strong>lưu</strong> mảng struct ra <code>students.txt</code> và <strong>nạp</strong> lại lúc khởi động, để dữ liệu còn giữa các lần chạy. Dùng <code>fprintf</code>/<code>fscanf</code> (văn bản) hoặc <code>fwrite</code>/<code>fread</code> (nhị phân).</div>
<div class="callout"><span class="badge">Progress Test 2</span> Bài progress test thứ hai kiểm CLO9 (tệp): mở đúng chế độ, kiểm <code>NULL</code>, đọc tới hết tệp, và luôn đóng.</div>
<div class="pitfall">Hai điều bắt buộc: luôn kiểm <code>fopen</code> có <code>NULL</code> không (tệp có thể không tồn tại hoặc bị khoá), và luôn <code>fclose</code> (không đóng có thể mất phần ghi còn trong bộ đệm). Mở bằng <code>"w"</code> sẽ <strong>xoá trắng</strong> tệp — dùng <code>"a"</code> để ghi thêm.</div>`,
  ]]);

const c9q = quiz('prf192-progress-test-2', 'Progress Test 2 — Files|||Progress Test 2 — Tệp tin', [
  { id: 'q1', question: 'Which fopen mode ERASES the file if it exists?|||Chế độ fopen nào XOÁ trắng tệp nếu đã tồn tại?', options: ['"r"', '"a"', '"w"', '"rb"'], correctIndex: 2, explanation: '"w" mở để ghi và cắt trắng nội dung cũ; "a" ghi nối, "r" chỉ đọc.' },
  { id: 'q2', question: 'After fopen, what must you always check?|||Sau fopen, luôn phải kiểm điều gì?', options: ['That it returned NULL (open failed)|||Nó có trả về NULL (mở thất bại) không', 'The file size|||Kích thước tệp', 'The disk letter|||Ký tự ổ đĩa', 'Nothing|||Không cần kiểm gì'], correctIndex: 0, explanation: 'fopen trả NULL khi thất bại; dùng tiếp con trỏ NULL sẽ sập.' },
  { id: 'q3', question: 'Why must you call fclose()?|||Vì sao phải gọi fclose()?', options: ['It is optional|||Không bắt buộc', 'To flush buffered writes and release the file|||Để đẩy nốt phần ghi trong bộ đệm và trả tệp', 'To delete the file|||Để xoá tệp', 'To make it read-only|||Để đặt chỉ đọc'], correctIndex: 1, explanation: 'Không đóng có thể mất dữ liệu còn nằm trong bộ đệm và giữ khoá tệp.' },
]);

/* ═══════════════ NÂNG CAO — CHUYÊN SÂU (ngoài giáo trình) ═══════════════ */
const adv1 = doc('prf192-nc-1-con-tro-bo-nho', '★ Pointers & memory in depth: stack vs heap|||★ Con trỏ & bộ nhớ chuyên sâu: stack vs heap',
  'Stack và heap, số học con trỏ, con trỏ đa cấp, rò rỉ & con trỏ treo — hiểu sâu hơn ở trường.',
  [[
    `<span class="eyebrow">PRF192 · Deep dive ★</span>
<h2>Where your memory actually lives</h2>
<p class="lead">A running C program splits memory into regions. The two you must understand are the <strong>stack</strong> and the <strong>heap</strong>.</p>
<table>
<thead><tr><th></th><th>Stack</th><th>Heap</th></tr></thead>
<tbody>
<tr><td>Holds</td><td>local variables, function calls</td><td>memory from <code>malloc</code></td></tr>
<tr><td>Lifetime</td><td>freed automatically when the function returns</td><td>lives until you <code>free</code> it</td></tr>
<tr><td>Speed / size</td><td>fast, small (overflow if too deep)</td><td>large, slightly slower</td></tr>
</tbody>
</table>
<pre><code class="language-c">int* makeLocal() {
    int x = 42;      // x is on the STACK
    return &amp;x;       // BUG: x dies when the function returns → dangling
}
int* makeHeap() {
    int *p = malloc(sizeof(int));  // on the HEAP
    *p = 42;
    return p;        // OK: heap memory outlives the function (caller frees)
}
</code></pre>
<h3>Pointer arithmetic &amp; array–pointer duality</h3>
<pre><code class="language-c">int a[4] = {10, 20, 30, 40};
int *p = a;          // an array name IS a pointer to its first element
printf("%d\\n", *(p + 2));   // 30 — p+2 moves by 2 ints, not 2 bytes
printf("%d\\n", a[2]);       // 30 — a[i] is just *(a + i)
</code></pre>
<h3>Pointer to pointer</h3>
<pre><code class="language-c">int x = 5;
int *p = &amp;x;       // p points to x
int **pp = &amp;p;     // pp points to p
printf("%d\\n", **pp);   // 5 — double dereference
</code></pre>
<div class="pitfall">The three memory bugs to internalise: <strong>leak</strong> (malloc without free — memory grows forever), <strong>dangling</strong> (using a pointer after free or returning a stack address), and <strong>double free</strong> (free the same block twice — undefined behaviour). Tools like <code>valgrind</code> catch all three.</div>`,
    `<span class="eyebrow">PRF192 · Chuyên sâu ★</span>
<h2>Bộ nhớ của bạn thực sự nằm ở đâu</h2>
<p class="lead">Một chương trình C đang chạy chia bộ nhớ thành nhiều vùng. Hai vùng bạn phải hiểu là <strong>stack</strong> và <strong>heap</strong>.</p>
<table>
<thead><tr><th></th><th>Stack</th><th>Heap</th></tr></thead>
<tbody>
<tr><td>Chứa</td><td>biến cục bộ, lời gọi hàm</td><td>bộ nhớ từ <code>malloc</code></td></tr>
<tr><td>Vòng đời</td><td>tự giải phóng khi hàm trả về</td><td>sống tới khi bạn <code>free</code></td></tr>
<tr><td>Tốc độ / dung lượng</td><td>nhanh, nhỏ (tràn nếu đệ quy quá sâu)</td><td>lớn, hơi chậm hơn</td></tr>
</tbody>
</table>
<pre><code class="language-c">int* makeLocal() {
    int x = 42;      // x nằm trên STACK
    return &amp;x;       // LỖI: x chết khi hàm trả về → con trỏ treo
}
int* makeHeap() {
    int *p = malloc(sizeof(int));  // trên HEAP
    *p = 42;
    return p;        // OK: bộ nhớ heap sống lâu hơn hàm (nơi gọi tự free)
}
</code></pre>
<h3>Số học con trỏ &amp; mảng–con trỏ là một</h3>
<pre><code class="language-c">int a[4] = {10, 20, 30, 40};
int *p = a;          // tên mảng CHÍNH là con trỏ tới phần tử đầu
printf("%d\\n", *(p + 2));   // 30 — p+2 nhích 2 int, không phải 2 byte
printf("%d\\n", a[2]);       // 30 — a[i] chỉ là *(a + i)
</code></pre>
<h3>Con trỏ tới con trỏ</h3>
<pre><code class="language-c">int x = 5;
int *p = &amp;x;       // p trỏ tới x
int **pp = &amp;p;     // pp trỏ tới p
printf("%d\\n", **pp);   // 5 — truy xuất hai lần
</code></pre>
<div class="pitfall">Ba lỗi bộ nhớ phải thuộc nằm lòng: <strong>rò rỉ</strong> (malloc mà không free — bộ nhớ phình mãi), <strong>treo</strong> (dùng con trỏ sau free hoặc trả địa chỉ stack), và <strong>free hai lần</strong> (giải phóng cùng khối hai lần — hành vi không xác định). Công cụ như <code>valgrind</code> bắt cả ba.</div>`,
  ]]);

const adv2 = doc('prf192-nc-2-loi-debug', '★ Common errors & debugging tips|||★ Lỗi thường gặp & mẹo debug',
  'Segfault, buffer overflow, biến chưa khởi tạo, lệch một đơn vị; đọc thông báo lỗi, debug bằng printf/gdb, bật -Wall.',
  [[
    `<span class="eyebrow">PRF192 · Deep dive ★</span>
<h2>The errors that bite every beginner</h2>
<table>
<thead><tr><th>Error</th><th>Symptom</th><th>Cause &amp; fix</th></tr></thead>
<tbody>
<tr><td>Segmentation fault</td><td>program crashes</td><td>dereferencing a bad/NULL/uninitialized pointer, or writing out of an array — check pointers and bounds</td></tr>
<tr><td>Buffer overflow</td><td>corrupt data / crash</td><td>writing past an array or string buffer — size the buffer, loop <code>i &lt; n</code>, use <code>fgets</code></td></tr>
<tr><td>Uninitialized variable</td><td>random results</td><td>reading a variable before assigning it — always initialise</td></tr>
<tr><td>Off-by-one</td><td>misses first/last item</td><td><code>&lt;=</code> vs <code>&lt;</code>, wrong start index — trace the loop by hand</td></tr>
<tr><td><code>= vs ==</code></td><td>condition always true</td><td>assignment inside <code>if</code> — use <code>==</code> to compare</td></tr>
<tr><td>scanf without <code>&amp;</code></td><td>crash / garbage</td><td>pass the address: <code>scanf("%d", &amp;x)</code></td></tr>
</tbody>
</table>
<h3>How to debug</h3>
<ol>
<li><strong>Read the compiler message</strong> — it names the file and line. Fix the <em>first</em> error first; later ones are often just fallout.</li>
<li><strong>Turn on warnings:</strong> <code>gcc -Wall -Wextra prog.c -o prog</code>. Warnings catch uninitialised variables and wrong format specifiers before they crash.</li>
<li><strong>printf debugging</strong> — print a variable's value at key points to see where reality diverges from your expectation.</li>
<li><strong>A real debugger</strong> — set a breakpoint (<kbd>F5</kbd> in VS Code, or <code>gdb ./prog</code>), step line by line, and watch each variable change.</li>
</ol>
<pre><code class="language-c">// printf debugging: find WHERE the value goes wrong
int total = 0;
for (int i = 0; i &lt;= n; i++) {          // bug: should be i &lt; n
    printf("[debug] i=%d a[i]=%d\\n", i, a[i]);  // reveals the out-of-range read
    total += a[i];
}
</code></pre>
<div class="callout ok">Golden rule: <strong>compile early, compile often</strong>. Write a few lines, compile, run. A bug found in 5 new lines is easy; a bug hidden in 200 untested lines is misery.</div>`,
    `<span class="eyebrow">PRF192 · Chuyên sâu ★</span>
<h2>Những lỗi cắn mọi người mới</h2>
<table>
<thead><tr><th>Lỗi</th><th>Triệu chứng</th><th>Nguyên nhân &amp; cách sửa</th></tr></thead>
<tbody>
<tr><td>Segmentation fault</td><td>chương trình sập</td><td>truy xuất con trỏ sai/NULL/chưa khởi tạo, hoặc ghi ngoài mảng — kiểm con trỏ và biên</td></tr>
<tr><td>Buffer overflow</td><td>hỏng dữ liệu / sập</td><td>ghi vượt mảng hay bộ đệm chuỗi — cấp đủ chỗ, lặp <code>i &lt; n</code>, dùng <code>fgets</code></td></tr>
<tr><td>Biến chưa khởi tạo</td><td>kết quả loạn</td><td>đọc biến trước khi gán — luôn khởi tạo</td></tr>
<tr><td>Lệch một đơn vị</td><td>sót phần tử đầu/cuối</td><td><code>&lt;=</code> vs <code>&lt;</code>, sai chỉ số bắt đầu — dò vòng lặp bằng tay</td></tr>
<tr><td><code>= vs ==</code></td><td>điều kiện luôn đúng</td><td>gán trong <code>if</code> — dùng <code>==</code> để so sánh</td></tr>
<tr><td>scanf thiếu <code>&amp;</code></td><td>sập / rác</td><td>truyền địa chỉ: <code>scanf("%d", &amp;x)</code></td></tr>
</tbody>
</table>
<h3>Cách debug</h3>
<ol>
<li><strong>Đọc thông báo của compiler</strong> — nó nêu tên tệp và số dòng. Sửa lỗi <em>đầu tiên</em> trước; lỗi sau thường chỉ là hệ quả.</li>
<li><strong>Bật cảnh báo:</strong> <code>gcc -Wall -Wextra prog.c -o prog</code>. Cảnh báo bắt biến chưa khởi tạo và sai chỉ định định dạng trước khi sập.</li>
<li><strong>Debug bằng printf</strong> — in giá trị biến ở các điểm mấu chốt để thấy chỗ thực tế lệch khỏi kỳ vọng.</li>
<li><strong>Debugger thật</strong> — đặt breakpoint (<kbd>F5</kbd> trong VS Code, hoặc <code>gdb ./prog</code>), chạy từng dòng và theo dõi từng biến đổi giá trị.</li>
</ol>
<pre><code class="language-c">// debug bằng printf: tìm CHỖ giá trị bắt đầu sai
int total = 0;
for (int i = 0; i &lt;= n; i++) {          // lỗi: đáng lẽ i &lt; n
    printf("[debug] i=%d a[i]=%d\\n", i, a[i]);  // lộ ra chỗ đọc quá biên
    total += a[i];
}
</code></pre>
<div class="callout ok">Quy tắc vàng: <strong>biên dịch sớm, biên dịch thường xuyên</strong>. Viết vài dòng, biên dịch, chạy. Lỗi trong 5 dòng mới rất dễ tìm; lỗi giấu trong 200 dòng chưa test là cực hình.</div>`,
  ]]);

export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'PRF192',
    slug: 'programming-fundamentals',
    title: 'Programming Fundamentals',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/prf192-1781716106298-116ce9c6.jfif',
    shortDescription: 'Intro to programming in C (FLM syllabus, 9 CLOs): program structure, variables/types & expressions, loops, functions, pointers & memory, standard library, arrays & structs, strings, files. Bilingual, runnable C & quizzes.|||Nhập môn lập trình C (giáo trình FLM, 9 CLO): cấu trúc chương trình, biến/kiểu & biểu thức, vòng lặp, hàm, con trỏ & bộ nhớ, thư viện chuẩn, mảng & struct, chuỗi, tệp. Song ngữ, code C chạy được & quiz.',
    description: 'Môn <strong>PRF192 — Programming Fundamentals</strong> (kỳ 1) là môn lập trình đầu tiên của ngành, dạy bằng ngôn ngữ <strong>C</strong> theo hướng lập trình thủ tục, bám sát 9 CLO của giáo trình FLM. Từ <strong>hệ thống máy tính &amp; cấu trúc chương trình</strong> (CLO1) → <strong>biến, kiểu, bộ nhớ, nhập/xuất &amp; biểu thức</strong> (CLO2) → <strong>rẽ nhánh &amp; vòng lặp</strong> (CLO3) → <strong>module &amp; hàm</strong> (CLO4) → <strong>con trỏ</strong> (CLO5) → <strong>thư viện chuẩn</strong> (CLO6) → <strong>mảng &amp; struct</strong> (CLO7) → <strong>chuỗi</strong> (CLO8) → <strong>tệp tin</strong> (CLO9), kèm phần chuyên sâu về con trỏ/bộ nhớ và gỡ lỗi. Sách chính: <em>Foundations of Programming Using C</em> (Evan Weaver) + K&amp;R. Song ngữ, code C chạy được, quiz mỗi chương. Là tiên quyết của PRO192 và LAB211.',
    whatYouLearn: 'Đọc–hiểu–viết chương trình C cỡ vừa; cấu trúc một file C; biến/kiểu/bộ nhớ, scanf/printf, biểu thức &amp; độ ưu tiên toán tử; if/switch, for/while/do-while; chia bài toán thành hàm (truyền giá trị vs tham chiếu); con trỏ, &amp; và *, malloc/free, stack vs heap; thư viện chuẩn (stdlib/time/math/ctype); mảng 1-2 chiều, tìm kiếm & sắp xếp, struct & mảng struct; chuỗi & string.h; đọc/ghi tệp; và gỡ lỗi (segfault, buffer overflow, dùng -Wall/printf/gdb).',
    requirements: 'Không có môn tiên quyết. Cần máy cài được trình biên dịch C (DevC++ 6.3 hoặc VS Code + GCC), hoặc dùng trình biên dịch trực tuyến (OnlineGDB).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách chính (Evan Weaver) + K&R, MOOC, tài liệu chuẩn C, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: '9 CLO, cơ cấu điểm, lộ trình 9 chương.', lessons: [intro] },
    { title: 'Chương 1 — Nhập môn & công cụ (CLO1)|||Chapter 1 — Intro & tools (CLO1)', description: 'Hệ thống máy tính, các bước phát triển phần mềm, cấu trúc chương trình C, compiler.', lessons: [c1a, c1b, c1q] },
    { title: 'Chương 2 — Biến, kiểu, bộ nhớ, I/O & biểu thức (CLO2)|||Chapter 2 — Variables, types, memory, I/O & expressions (CLO2)', description: 'Biến/hằng, kiểu & bộ nhớ, scanf/printf, toán tử & độ ưu tiên, ép kiểu.', lessons: [c2a, c2b, c2q] },
    { title: 'Chương 3 — Lập trình cấu trúc (CLO3) · Workshop 1|||Chapter 3 — Structured programming (CLO3) · Workshop 1', description: 'if/switch, for/while/do-while, break/continue.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Module & Hàm (CLO4) · Workshop 2|||Chapter 4 — Modules & functions (CLO4) · Workshop 2', description: 'Thiết kế module, định nghĩa/gọi hàm, truyền giá trị, phạm vi biến.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Con trỏ (CLO5)|||Chapter 5 — Pointers (CLO5)', description: 'Địa chỉ & *, truyền tham chiếu, cấp phát động malloc/free.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Thư viện chuẩn (CLO6) · Progress Test 1|||Chapter 6 — Standard library (CLO6) · Progress Test 1', description: 'stdlib.h, time.h, math.h, ctype.h, nhập/xuất định dạng.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Mảng & Struct (CLO7) · Workshop 3|||Chapter 7 — Arrays & structs (CLO7) · Workshop 3', description: 'Mảng 1-2 chiều, tìm kiếm tuyến tính & sắp xếp chọn, struct & mảng struct.', lessons: [c7a, c7b, c7q] },
    { title: 'Chương 8 — Chuỗi (CLO8) · Workshop 4|||Chapter 8 — Strings (CLO8) · Workshop 4', description: 'Mảng char & \\0, nhập/xuất chuỗi, mảng chuỗi, string.h.', lessons: [c8, c8q] },
    { title: 'Chương 9 — Tệp tin (CLO9) · Workshop 5 · Progress Test 2|||Chapter 9 — Files (CLO9) · Workshop 5 · Progress Test 2', description: 'Text/binary, fopen/fclose/fprintf/fscanf/fwrite/fread.', lessons: [c9, c9q] },
    { title: '★ Chuyên sâu — Con trỏ/bộ nhớ & Gỡ lỗi|||★ Deep dive — Pointers/memory & Debugging', description: 'Stack vs heap, số học con trỏ, segfault/buffer overflow, mẹo debug (-Wall/printf/gdb).', lessons: [adv1, adv2] },
  ],
};
