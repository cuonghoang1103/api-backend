/**
 * PFP191 — Programming Fundamentals with Python (Cơ sở lập trình với Python).
 * Ngành IT/AI FPTU, môn NỀN, Kỳ 1. Giáo trình FLM (sylID 12224): 7 CLO / 11 chương —
 * vì sao lập trình → biến/biểu thức → rẽ nhánh → vòng lặp → hàm → chuỗi → tệp →
 * list → dict → tuple → OOP. Sách CHÍNH: "Python for Everybody" (Charles Severance,
 * miễn phí py4e.com). Công cụ: VS Code, Google Colab, Python 3. Song ngữ EN+VI,
 * code Python chạy được. Song song với PRF192 (bằng C).
 * Giữ NGUYÊN slug/semester/courseCode/thumbnailUrl; syncOrder + pruneSections.
 * ⚠️ code: KHÔNG backtick, KHÔNG ${ }; escape của Python viết đôi ("\n" → \\n);
 *    "<"/">" → &lt;/&gt;, "&" → &amp; (CHỈ trong content HTML). shortDescription dùng & thường.
 * Seed: node scripts/academy-seed-course.mjs --file ./content/academy/PFP191.mjs --apply
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

/* ═══════════════ 📚 TÀI LIỆU THAM KHẢO ═══════════════ */
const taiLieu = doc('pfp191-tai-lieu-tham-khao', 'Course materials & references|||Trung tâm tài liệu tham khảo',
  'Sách chính Python for Everybody (py4e.com, PDF miễn phí) + Coursera Specialization, docs.python.org tutorial, Berkeley Numerical Methods, công cụ VS Code/Colab/Python 3, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">PFP191 · Materials</span>
<h2>Course materials &amp; references</h2>
<p class="lead">Everything you need to learn <strong>Programming Fundamentals with Python</strong> in one place. The full FPTU slides &amp; official syllabus live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Main textbook &amp; slides</h3>
<p>Official FPTU slides &amp; syllabus for PFP191 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<ul>
<li><strong>Python for Everybody</strong> — Charles Severance <em>(the MAIN textbook, free PDF at</em> <a href="https://www.py4e.com/book" target="_blank" rel="noopener">py4e.com/book</a><em>)</em>. Every chapter of this course maps to a py4e chapter.</li>
<li><a href="https://www.coursera.org/specializations/python" target="_blank" rel="noopener">Python for Everybody Specialization</a> — the same author's video course on Coursera (audit for free).</li>
</ul>
<h3>🌐 Free reference docs</h3>
<ul>
<li><a href="https://docs.python.org/3/tutorial/" target="_blank" rel="noopener">docs.python.org/3/tutorial</a> — the official Python tutorial (the authoritative source).</li>
<li><a href="https://pythonnumericalmethods.studentorg.berkeley.edu/notebooks/Index.html" target="_blank" rel="noopener">Python Numerical Methods</a> — UC Berkeley, free online (for AI/data readiness).</li>
<li><a href="https://www.w3schools.com/python/" target="_blank" rel="noopener">W3Schools Python</a> — quick, searchable syntax reference.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@Dr_Chuck" target="_blank" rel="noopener">Dr. Chuck (Charles Severance)</a> — the py4e author, lecture by lecture.</li>
<li><a href="https://www.youtube.com/@coreyms" target="_blank" rel="noopener">Corey Schafer</a> — clear, practical Python tutorials.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.python.org/downloads/" target="_blank" rel="noopener">Python 3</a> — the interpreter; install it first (tick "Add to PATH" on Windows).</li>
<li><a href="https://code.visualstudio.com/" target="_blank" rel="noopener">VS Code</a> + the Python extension — the editor FPTU uses.</li>
<li><a href="https://colab.research.google.com/" target="_blank" rel="noopener">Google Colab</a> — run Python in the browser, nothing to install.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — why programming, variables &amp; expressions, conditionals, loops (CLO1–CLO3).</li>
<li><strong>Practice</strong> — retype every example and run it; solve the auto-graded exercises on CodeLab.</li>
<li><strong>Go deeper</strong> — functions, strings, files, then lists/dicts/tuples (CLO3–CLO6).</li>
<li><strong>Job-ready</strong> — write a small program using classes (OOP) and clean it up (CLO7).</li>
</ol></div>`,
    `<span class="eyebrow">PFP191 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Cơ sở lập trình với Python</strong> gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình chính &amp; slide</h3>
<p>Slide &amp; giáo trình FPTU chính thức của PFP191 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<ul>
<li><strong>Python for Everybody</strong> — Charles Severance <em>(giáo trình CHÍNH, PDF miễn phí tại</em> <a href="https://www.py4e.com/book" target="_blank" rel="noopener">py4e.com/book</a><em>)</em>. Mỗi chương môn này ứng với một chương py4e.</li>
<li><a href="https://www.coursera.org/specializations/python" target="_blank" rel="noopener">Python for Everybody Specialization</a> — khoá video cùng tác giả trên Coursera (học miễn phí dạng audit).</li>
</ul>
<h3>🌐 Tài liệu tra cứu miễn phí</h3>
<ul>
<li><a href="https://docs.python.org/3/tutorial/" target="_blank" rel="noopener">docs.python.org/3/tutorial</a> — tài liệu Python chính thức (nguồn chuẩn nhất).</li>
<li><a href="https://pythonnumericalmethods.studentorg.berkeley.edu/notebooks/Index.html" target="_blank" rel="noopener">Python Numerical Methods</a> — UC Berkeley, miễn phí (nền cho AI/khoa học dữ liệu).</li>
<li><a href="https://www.w3schools.com/python/" target="_blank" rel="noopener">W3Schools Python</a> — tra cú pháp nhanh, có thanh tìm.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@Dr_Chuck" target="_blank" rel="noopener">Dr. Chuck (Charles Severance)</a> — chính tác giả py4e, giảng từng bài.</li>
<li><a href="https://www.youtube.com/@coreyms" target="_blank" rel="noopener">Corey Schafer</a> — hướng dẫn Python rõ ràng, thực tế.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.python.org/downloads/" target="_blank" rel="noopener">Python 3</a> — trình thông dịch; cài đầu tiên (Windows nhớ tick "Add to PATH").</li>
<li><a href="https://code.visualstudio.com/" target="_blank" rel="noopener">VS Code</a> + tiện ích Python — trình soạn thảo trường dùng.</li>
<li><a href="https://colab.research.google.com/" target="_blank" rel="noopener">Google Colab</a> — chạy Python trên trình duyệt, không cần cài gì.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — vì sao lập trình, biến &amp; biểu thức, rẽ nhánh, vòng lặp (CLO1–CLO3).</li>
<li><strong>Luyện tập</strong> — gõ lại mọi ví dụ và chạy thử; làm bài chấm tự động trên CodeLab.</li>
<li><strong>Đào sâu</strong> — hàm, chuỗi, tệp, rồi list/dict/tuple (CLO3–CLO6).</li>
<li><strong>Sẵn sàng đi làm</strong> — viết một chương trình nhỏ dùng lớp (OOP) và dọn code sạch (CLO7).</li>
</ol></div>
<div class="callout"><span class="badge">Lưu ý</span> Đây là trung tâm liên kết nguyên gốc — không nhúng slide/sách có bản quyền. Link đổi thì vào FLM hoặc py4e.com để tìm.</div>`,
  ]]);

/* ═══════════════ GIỚI THIỆU MÔN HỌC ═══════════════ */
const intro = { ...doc('pfp191-gioi-thieu', 'Course intro: 7 CLOs, grading & roadmap|||Giới thiệu môn: 7 CLO, cấu trúc điểm & lộ trình',
  'Python là gì và vì sao học lập trình, 7 chuẩn đầu ra (CLO), cơ cấu điểm, và lộ trình 11 chương bám giáo trình FLM (Python for Everybody).',
  [[
    `<span class="eyebrow">PFP191 · Course introduction</span>
<h2>Programming Fundamentals — with Python</h2>
<p class="lead">PFP191 is the <strong>first</strong> programming course of the IT / AI track. The goal is not to memorize syntax but to <strong>think like a programmer</strong>: take a real problem and break it into steps a computer can carry out.</p>
<p>The language is <strong>Python</strong> — a small, readable language that lets you focus on ideas instead of fighting the compiler. It is also the language of <strong>data science and AI</strong>, so what you learn here carries straight into later courses. The whole course follows the free textbook <strong>"Python for Everybody"</strong> by Charles Severance.</p>
<h3>7 Course Learning Outcomes (CLOs)</h3>
<p>A CLO is what you <strong>must be able to do</strong> after the course. The exams follow the CLOs closely, so this map tells you what you'll be tested on.</p>
<table>
<thead><tr><th>CLO</th><th>You will be able to</th><th>Chapters</th></tr></thead>
<tbody>
<tr><td>CLO1</td><td>Explain what a program is, how a computer runs it, and the idea of interpreting vs compiling</td><td>1</td></tr>
<tr><td>CLO2</td><td>Use variables, values, types, expressions and statements</td><td>2</td></tr>
<tr><td>CLO3</td><td>Control the flow: conditionals, loops and functions</td><td>3, 4, 5</td></tr>
<tr><td>CLO4</td><td>Process text with strings</td><td>6</td></tr>
<tr><td>CLO5</td><td>Read from and write to files</td><td>7</td></tr>
<tr><td>CLO6</td><td>Use collections: lists, dictionaries and tuples</td><td>8, 9, 10</td></tr>
<tr><td>CLO7</td><td>Use classes &amp; objects (object-oriented programming)</td><td>11</td></tr>
</tbody>
</table>
<h3>Grade structure</h3>
<table>
<thead><tr><th>Component</th><th>Weight</th><th>Note</th></tr></thead>
<tbody>
<tr><td>Assignment</td><td>15%</td><td>Done at home</td></tr>
<tr><td>Lab</td><td>10%</td><td>In-class practice</td></tr>
<tr><td>Practical Exam</td><td>30%</td><td>Live on a computer</td></tr>
<tr><td>Progress Test</td><td>15%</td><td>In class</td></tr>
<tr><td><strong>Final Exam</strong></td><td><strong>30%</strong></td><td><strong>50 multiple-choice questions</strong></td></tr>
</tbody>
</table>
<div class="callout warn">The Practical Exam (30%) and the Final (30%) make up 60% — one is taken <strong>live on a computer</strong>, the other is <strong>multiple choice</strong>, so rote learning won't help. Retype every example and practise on CodeLab so your hands get used to typing code.</div>
<h3>Roadmap — 11 chapters</h3>
<div class="lz-map">
<div class="lz-stage">Foundations</div>
<div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Why program?</div><div class="lz-nsub">Hardware, interpreter vs compiler, debugging</div></div></div>
<div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Variables &amp; expressions</div><div class="lz-nsub">Types, operators, input(), comments</div></div></div>
<div class="lz-stage">Control flow</div>
<div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Conditionals</div><div class="lz-nsub">if/elif/else, try/except</div></div></div>
<div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Iteration</div><div class="lz-nsub">while, for, break/continue</div></div></div>
<div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Functions</div><div class="lz-nsub">def, parameters, return</div></div></div>
<div class="lz-stage">Data &amp; storage</div>
<div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Strings</div><div class="lz-nsub">Slicing, methods, parsing</div></div></div>
<div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Files</div><div class="lz-nsub">open, read, write</div></div></div>
<div class="lz-stage">Collections</div>
<div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Lists</div><div class="lz-nsub">Mutable sequences</div></div></div>
<div class="lz-node"><div class="lz-badge">9</div><div class="lz-nbody"><div class="lz-ntitle">Dictionaries</div><div class="lz-nsub">Key → value, counters</div></div></div>
<div class="lz-node"><div class="lz-badge">10</div><div class="lz-nbody"><div class="lz-ntitle">Tuples</div><div class="lz-nsub">Immutable, unpacking</div></div></div>
<div class="lz-stage">Objects</div>
<div class="lz-node"><div class="lz-badge">11</div><div class="lz-nbody"><div class="lz-ntitle">OOP</div><div class="lz-nsub">Classes, inheritance, polymorphism</div></div></div>
</div>
<div class="callout ok">The most effective way to study this course: <strong>retype every example and run it</strong>. Programming is a skill — like swimming, watching won't teach you.</div>`,
    `<span class="eyebrow">PFP191 · Giới thiệu môn học</span>
<h2>Cơ sở lập trình — với Python</h2>
<p class="lead">PFP191 là môn lập trình <strong>đầu tiên</strong> của lộ trình IT / AI. Mục tiêu không phải học thuộc cú pháp, mà là <strong>tập tư duy như lập trình viên</strong>: nhìn một bài toán thực tế và chia nhỏ thành các bước máy tính làm được.</p>
<p>Ngôn ngữ dùng là <strong>Python</strong> — nhỏ gọn, dễ đọc, giúp bạn tập trung vào ý tưởng thay vì vật lộn với trình biên dịch. Đây cũng là ngôn ngữ của <strong>khoa học dữ liệu và AI</strong>, nên kiến thức ở đây đi thẳng vào các môn sau. Cả môn bám theo giáo trình miễn phí <strong>"Python for Everybody"</strong> của Charles Severance.</p>
<h3>7 chuẩn đầu ra (CLO)</h3>
<p>CLO là những gì bạn <strong>phải làm được</strong> sau môn. Đề thi bám sát CLO, nên bản đồ này cho biết bạn sẽ bị hỏi gì.</p>
<table>
<thead><tr><th>CLO</th><th>Bạn sẽ làm được</th><th>Chương</th></tr></thead>
<tbody>
<tr><td>CLO1</td><td>Giải thích chương trình là gì, máy tính chạy nó ra sao, và ý niệm thông dịch vs biên dịch</td><td>1</td></tr>
<tr><td>CLO2</td><td>Dùng biến, giá trị, kiểu, biểu thức và câu lệnh</td><td>2</td></tr>
<tr><td>CLO3</td><td>Điều khiển luồng: rẽ nhánh, vòng lặp và hàm</td><td>3, 4, 5</td></tr>
<tr><td>CLO4</td><td>Xử lý văn bản với chuỗi (string)</td><td>6</td></tr>
<tr><td>CLO5</td><td>Đọc/ghi tệp tin</td><td>7</td></tr>
<tr><td>CLO6</td><td>Dùng tập hợp: list, dictionary và tuple</td><td>8, 9, 10</td></tr>
<tr><td>CLO7</td><td>Dùng lớp &amp; đối tượng (lập trình hướng đối tượng)</td><td>11</td></tr>
</tbody>
</table>
<h3>Cơ cấu điểm</h3>
<table>
<thead><tr><th>Thành phần</th><th>Trọng số</th><th>Ghi chú</th></tr></thead>
<tbody>
<tr><td>Assignment</td><td>15%</td><td>Làm ở nhà</td></tr>
<tr><td>Lab</td><td>10%</td><td>Thực hành tại lớp</td></tr>
<tr><td>Practical Exam</td><td>30%</td><td>Thi trực tiếp trên máy</td></tr>
<tr><td>Progress Test</td><td>15%</td><td>Kiểm tra tại lớp</td></tr>
<tr><td><strong>Final Exam</strong></td><td><strong>30%</strong></td><td><strong>Trắc nghiệm 50 câu</strong></td></tr>
</tbody>
</table>
<div class="callout warn">Practical Exam (30%) và Final (30%) chiếm 60% — một cái thi <strong>trực tiếp trên máy</strong>, một cái <strong>trắc nghiệm</strong>, không học vẹt được. Hãy gõ lại mọi ví dụ và luyện trên CodeLab để tay quen gõ code.</div>
<h3>Lộ trình — 11 chương</h3>
<div class="lz-map">
<div class="lz-stage">Nền tảng</div>
<div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Vì sao học lập trình?</div><div class="lz-nsub">Phần cứng, thông dịch vs biên dịch, gỡ lỗi</div></div></div>
<div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Biến &amp; biểu thức</div><div class="lz-nsub">Kiểu, toán tử, input(), chú thích</div></div></div>
<div class="lz-stage">Điều khiển luồng</div>
<div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Rẽ nhánh</div><div class="lz-nsub">if/elif/else, try/except</div></div></div>
<div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Vòng lặp</div><div class="lz-nsub">while, for, break/continue</div></div></div>
<div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Hàm</div><div class="lz-nsub">def, tham số, return</div></div></div>
<div class="lz-stage">Dữ liệu &amp; lưu trữ</div>
<div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Chuỗi</div><div class="lz-nsub">Cắt lát, method, tách/phân tích</div></div></div>
<div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Tệp tin</div><div class="lz-nsub">open, đọc, ghi</div></div></div>
<div class="lz-stage">Tập hợp</div>
<div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Danh sách (list)</div><div class="lz-nsub">Chuỗi tuần tự thay đổi được</div></div></div>
<div class="lz-node"><div class="lz-badge">9</div><div class="lz-nbody"><div class="lz-ntitle">Từ điển (dict)</div><div class="lz-nsub">Khoá → giá trị, đếm</div></div></div>
<div class="lz-node"><div class="lz-badge">10</div><div class="lz-nbody"><div class="lz-ntitle">Tuple</div><div class="lz-nsub">Bất biến, gán tháo</div></div></div>
<div class="lz-stage">Đối tượng</div>
<div class="lz-node"><div class="lz-badge">11</div><div class="lz-nbody"><div class="lz-ntitle">OOP</div><div class="lz-nsub">Lớp, kế thừa, đa hình</div></div></div>
</div>
<div class="callout ok">Cách học hiệu quả nhất: <strong>gõ lại mọi ví dụ và chạy thử</strong>. Lập trình là kỹ năng — như tập bơi, xem không làm bạn biết bơi.</div>`,
  ]]), isFreePreview: true };

/* ═══════════════ CHƯƠNG 1 — VÌ SAO HỌC LẬP TRÌNH? (CLO1) ═══════════════ */
const c1 = { ...doc('pfp191-1-1-vi-sao-lap-trinh', '1.1 — Why should you learn to program?|||1.1 — Vì sao bạn nên học lập trình?',
  'Máy tính là gì, kiến trúc phần cứng (CPU/RAM/đĩa/vào-ra), lập trình là gì, thông dịch vs biên dịch, khối xây dựng chương trình, debugging và IDE.',
  [[
    `<span class="eyebrow">PFP191 · Chapter 1 · Lesson 1.1</span>
<h2>Why learn to program?</h2>
<p class="lead">A <strong>program</strong> is a sequence of instructions that tells the computer what to do. Programming is <strong>creative</strong> and <strong>useful</strong> — it lets you make the computer do the repetitive work so you can solve the interesting part.</p>
<h3>Computer hardware architecture</h3>
<ul>
<li><strong>CPU</strong> — the brain; runs instructions, one after another, very fast.</li>
<li><strong>Main memory (RAM)</strong> — fast, temporary; holds your program &amp; data while it runs, then forgets.</li>
<li><strong>Secondary storage (disk)</strong> — slower but permanent; keeps files after power off.</li>
<li><strong>Input / output devices</strong> — keyboard, screen: how you and the program talk.</li>
</ul>
<h3>Interpreter vs compiler</h3>
<p>Python is <strong>interpreted</strong>: the interpreter reads your source and runs it line by line. A <strong>compiled</strong> language (like C) first translates the whole file into machine code, then runs that. Interpreted = quick to try, easy to learn; compiled = usually faster to run.</p>
<h3>The building blocks of a program</h3>
<p>Almost every program is made of just a few kinds of instruction: <strong>input</strong>, <strong>output</strong>, <strong>sequential execution</strong>, <strong>conditional execution</strong>, <strong>repeated execution</strong>, and <strong>reuse</strong> (functions). This whole course is really learning these six ideas in Python.</p>
<pre><code class="language-python"># Your first program
print("Hello, PFP191!")
</code></pre>
<div class="out"><b>Output:</b> Hello, PFP191!</div>
<h3>Debugging &amp; the IDE</h3>
<p>Errors are normal. There are three kinds: <strong>syntax</strong> (wrong grammar), <strong>runtime</strong> (crashes while running), and <strong>logic</strong> (runs but gives the wrong answer). Fixing them is called <strong>debugging</strong>. You'll write code in an <strong>IDE</strong> (VS Code) or a notebook (<strong>Google Colab</strong>) that highlights errors as you type.</p>
<div class="pitfall">The computer does <em>exactly</em> what you say, not what you mean. A misspelled word (<code>Print</code> instead of <code>print</code>) or a missing quote is enough to stop the program — read the error message; it usually names the line.</div>`,
    `<span class="eyebrow">PFP191 · Chương 1 · Bài 1.1</span>
<h2>Vì sao học lập trình?</h2>
<p class="lead">Một <strong>chương trình</strong> là dãy chỉ thị bảo máy tính làm gì. Lập trình vừa <strong>sáng tạo</strong> vừa <strong>hữu ích</strong> — nó để máy làm phần lặp đi lặp lại, còn bạn lo phần thú vị.</p>
<h3>Kiến trúc phần cứng máy tính</h3>
<ul>
<li><strong>CPU</strong> — bộ não; chạy lệnh, cái này nối cái kia, rất nhanh.</li>
<li><strong>Bộ nhớ chính (RAM)</strong> — nhanh, tạm thời; giữ chương trình &amp; dữ liệu lúc chạy, tắt là quên.</li>
<li><strong>Bộ nhớ phụ (đĩa)</strong> — chậm hơn nhưng lâu dài; giữ tệp sau khi tắt máy.</li>
<li><strong>Thiết bị vào / ra</strong> — bàn phím, màn hình: cách bạn và chương trình nói chuyện.</li>
</ul>
<h3>Thông dịch vs biên dịch</h3>
<p>Python là ngôn ngữ <strong>thông dịch</strong>: trình thông dịch đọc mã nguồn và chạy từng dòng. Ngôn ngữ <strong>biên dịch</strong> (như C) dịch cả file ra mã máy trước rồi mới chạy. Thông dịch = thử nhanh, dễ học; biên dịch = thường chạy nhanh hơn.</p>
<h3>Các khối xây dựng chương trình</h3>
<p>Gần như mọi chương trình chỉ gồm vài loại chỉ thị: <strong>nhập</strong>, <strong>xuất</strong>, <strong>chạy tuần tự</strong>, <strong>rẽ nhánh</strong>, <strong>lặp lại</strong>, và <strong>tái sử dụng</strong> (hàm). Cả môn này thực chất là học sáu ý niệm đó bằng Python.</p>
<pre><code class="language-python"># Chương trình đầu tiên
print("Hello, PFP191!")
</code></pre>
<div class="out"><b>Kết quả:</b> Hello, PFP191!</div>
<h3>Gỡ lỗi &amp; IDE</h3>
<p>Lỗi là bình thường. Có ba loại: <strong>cú pháp</strong> (sai ngữ pháp), <strong>lúc chạy</strong> (vỡ giữa chừng), và <strong>logic</strong> (chạy được nhưng sai kết quả). Sửa chúng gọi là <strong>debug</strong>. Bạn sẽ gõ code trong <strong>IDE</strong> (VS Code) hoặc notebook (<strong>Google Colab</strong>), nơi tô sáng lỗi ngay khi gõ.</p>
<div class="pitfall">Máy làm <em>đúng y</em> lời bạn nói, không phải ý bạn muốn. Gõ sai một chữ (<code>Print</code> thay vì <code>print</code>) hay thiếu một dấu nháy là đủ để chương trình dừng — hãy đọc thông báo lỗi; nó thường chỉ đúng dòng.</div>`,
  ]]), isFreePreview: true };

const c1q = quiz('pfp191-1-quiz', 'Quiz 1 — Why program|||Quiz 1 — Vì sao lập trình', [
  { id: 'q1', question: 'What kind of language is Python?|||Python là ngôn ngữ loại nào?', options: ['Compiled|||Biên dịch', 'Interpreted|||Thông dịch', 'It needs no translation|||Không cần dịch', 'Only runs in a browser|||Chỉ chạy trên trình duyệt'], correctIndex: 1, explanation: 'Python được thông dịch — chạy từng dòng qua trình thông dịch.' },
  { id: 'q2', question: 'Which part of the computer runs instructions?|||Bộ phận nào của máy tính chạy các lệnh?', options: ['RAM', 'The disk|||Ổ đĩa', 'The CPU|||CPU', 'The keyboard|||Bàn phím'], correctIndex: 2, explanation: 'CPU là bộ xử lý trung tâm, thực thi từng lệnh.' },
  { id: 'q3', question: 'A program runs but gives the wrong answer. This is a...|||Chương trình chạy được nhưng cho kết quả sai. Đây là lỗi...', options: ['Syntax error|||Lỗi cú pháp', 'Logic error|||Lỗi logic', 'Runtime crash|||Lỗi vỡ lúc chạy', 'Hardware fault|||Hỏng phần cứng'], correctIndex: 1, explanation: 'Chạy được nhưng sai kết quả là lỗi logic — khó tìm nhất.' },
]);

/* ═══════════════ CHƯƠNG 2 — BIẾN, BIỂU THỨC & CÂU LỆNH (CLO2) ═══════════════ */
const c2 = doc('pfp191-2-1-bien-bieu-thuc', '2.1 — Variables, expressions & statements|||2.1 — Biến, biểu thức & câu lệnh',
  'Giá trị & kiểu, biến và quy tắc đặt tên/từ khoá, toán tử & toán hạng, biểu thức & độ ưu tiên, modulo, thao tác chuỗi, input() và chú thích.',
  [[
    `<span class="eyebrow">PFP191 · Chapter 2 · Lesson 2.1</span>
<h2>Variables, expressions &amp; statements</h2>
<p class="lead">A <strong>value</strong> is a basic piece of data (a number, a piece of text). A <strong>variable</strong> is a name that refers to a value. Unlike C, you don't declare a type — Python figures it out.</p>
<pre><code class="language-python">age = 20          # int   (whole number)
gpa = 8.5         # float (real number)
name = "An"       # str   (text)
is_pass = True    # bool  (True / False)
print(type(gpa))  # &lt;class 'float'&gt;
</code></pre>
<h3>Naming &amp; keywords</h3>
<p>A variable name may use letters, digits and <code>_</code>, but cannot start with a digit or be a <strong>keyword</strong> (<code>if</code>, <code>for</code>, <code>while</code>, <code>class</code>...). Use meaningful lowercase names: <code>total_price</code>, not <code>x</code>.</p>
<h3>Operators, operands &amp; precedence</h3>
<table>
<thead><tr><th>Operator</th><th>Meaning</th><th>Example</th></tr></thead>
<tbody>
<tr><td><code>+ - * /</code></td><td>arithmetic (/ always gives float)</td><td><code>7 / 2</code> → 3.5</td></tr>
<tr><td><code>//</code></td><td>integer division</td><td><code>7 // 2</code> → 3</td></tr>
<tr><td><code>%</code></td><td>modulo (remainder)</td><td><code>7 % 2</code> → 1</td></tr>
<tr><td><code>**</code></td><td>power</td><td><code>2 ** 3</code> → 8</td></tr>
</tbody>
</table>
<p>Precedence follows <strong>PEMDAS</strong>: parentheses, then <code>**</code>, then <code>* / // %</code>, then <code>+ -</code>. When unsure, add parentheses.</p>
<h3>Input &amp; string operations</h3>
<pre><code class="language-python">name = input("Your name: ")     # input() ALWAYS returns a str
age = int(input("Your age: "))  # convert text to a number
print("Hi", name, "- next year:", age + 1)
print("ab" * 3)                 # ababab  (string repeat)
</code></pre>
<p>Comments start with <code>#</code> and are ignored by Python — use them to explain <em>why</em>, not <em>what</em>.</p>
<div class="pitfall"><code>input()</code> returns a <strong>string</strong>, so <code>age + 1</code> without <code>int(...)</code> raises a <em>TypeError</em>. Convert with <code>int()</code> or <code>float()</code> before doing maths.</div>`,
    `<span class="eyebrow">PFP191 · Chương 2 · Bài 2.1</span>
<h2>Biến, biểu thức &amp; câu lệnh</h2>
<p class="lead">Một <strong>giá trị</strong> là mẩu dữ liệu cơ bản (con số, đoạn chữ). Một <strong>biến</strong> là cái tên trỏ tới một giá trị. Khác C, bạn không khai báo kiểu — Python tự nhận.</p>
<pre><code class="language-python">age = 20          # int   (số nguyên)
gpa = 8.5         # float (số thực)
name = "An"       # str   (chuỗi)
is_pass = True    # bool  (True / False)
print(type(gpa))  # &lt;class 'float'&gt;
</code></pre>
<h3>Đặt tên &amp; từ khoá</h3>
<p>Tên biến gồm chữ, số và <code>_</code>, nhưng không được bắt đầu bằng số hay là một <strong>từ khoá</strong> (<code>if</code>, <code>for</code>, <code>while</code>, <code>class</code>...). Nên đặt tên thường, có nghĩa: <code>total_price</code>, đừng <code>x</code>.</p>
<h3>Toán tử, toán hạng &amp; độ ưu tiên</h3>
<table>
<thead><tr><th>Toán tử</th><th>Ý nghĩa</th><th>Ví dụ</th></tr></thead>
<tbody>
<tr><td><code>+ - * /</code></td><td>số học (/ luôn ra float)</td><td><code>7 / 2</code> → 3.5</td></tr>
<tr><td><code>//</code></td><td>chia lấy nguyên</td><td><code>7 // 2</code> → 3</td></tr>
<tr><td><code>%</code></td><td>modulo (số dư)</td><td><code>7 % 2</code> → 1</td></tr>
<tr><td><code>**</code></td><td>luỹ thừa</td><td><code>2 ** 3</code> → 8</td></tr>
</tbody>
</table>
<p>Độ ưu tiên theo <strong>PEMDAS</strong>: ngoặc, rồi <code>**</code>, rồi <code>* / // %</code>, rồi <code>+ -</code>. Không chắc thì thêm ngoặc.</p>
<h3>Nhập &amp; thao tác chuỗi</h3>
<pre><code class="language-python">name = input("Ten cua ban: ")    # input() LUON tra ve str
age = int(input("Tuoi cua ban: "))  # doi chuoi sang so
print("Chao", name, "- sang nam:", age + 1)
print("ab" * 3)                  # ababab  (lap chuoi)
</code></pre>
<p>Chú thích bắt đầu bằng <code>#</code> và bị Python bỏ qua — dùng để giải thích <em>vì sao</em>, không phải <em>làm gì</em>.</p>
<div class="pitfall"><code>input()</code> trả về <strong>chuỗi</strong>, nên <code>age + 1</code> mà không <code>int(...)</code> sẽ báo <em>TypeError</em>. Hãy đổi bằng <code>int()</code> hay <code>float()</code> trước khi tính toán.</div>`,
  ]]);

const c2q = quiz('pfp191-2-quiz', 'Quiz 2 — Variables & expressions|||Quiz 2 — Biến & biểu thức', [
  { id: 'q1', question: 'In Python, what does 7 // 2 give?|||Trong Python, 7 // 2 cho kết quả gì?', options: ['3.5', '3', '1', '14'], correctIndex: 1, explanation: '// là chia lấy phần nguyên → 3. (7 / 2 mới ra 3.5, 7 % 2 ra 1.)' },
  { id: 'q2', question: 'What type does input() always return?|||input() luôn trả về kiểu gì?', options: ['int', 'float', 'str (string)|||str (chuỗi)', 'bool'], correctIndex: 2, explanation: 'input() luôn trả về chuỗi; phải int()/float() nếu muốn tính toán.' },
  { id: 'q3', question: 'Which is a VALID variable name?|||Tên biến nào HỢP LỆ?', options: ['2age', 'total_price', 'for', 'my-name'], correctIndex: 1, explanation: 'Không được bắt đầu bằng số, không dùng từ khoá (for), không có dấu -.' },
]);

/* ═══════════════ CHƯƠNG 3 — THỰC THI CÓ ĐIỀU KIỆN (CLO3) ═══════════════ */
const c3 = doc('pfp191-3-1-re-nhanh', '3.1 — Conditional execution|||3.1 — Thực thi có điều kiện',
  'Biểu thức boolean & toán tử so sánh, toán tử logic and/or/not, if/elif/else, điều kiện lồng & nối chuỗi, try/except, short-circuit.',
  [[
    `<span class="eyebrow">PFP191 · Chapter 3 · Lesson 3.1</span>
<h2>Conditional execution</h2>
<p class="lead">A <strong>boolean expression</strong> is either <code>True</code> or <code>False</code>. Conditions let the program choose which code to run.</p>
<pre><code class="language-python">score = 7
if score &gt;= 8:
    print("Gioi")
elif score &gt;= 5:
    print("Dat")
else:
    print("Truot")
</code></pre>
<div class="out"><b>Output:</b> Dat</div>
<p>Note the <strong>colon</strong> and the <strong>indentation</strong> — in Python, indentation (usually 4 spaces) is how a block is defined; there are no <code>{ }</code> braces.</p>
<h3>Comparison &amp; logical operators</h3>
<ul>
<li>Comparison: <code>==</code> <code>!=</code> <code>&lt;</code> <code>&gt;</code> <code>&lt;=</code> <code>&gt;=</code></li>
<li>Logical: <code>and</code>, <code>or</code>, <code>not</code> — e.g. <code>if 0 &lt; x and x &lt; 10:</code></li>
</ul>
<p>Python allows <strong>chained</strong> comparisons: <code>if 0 &lt; x &lt; 10:</code> means the same thing.</p>
<h3>try / except — catching errors</h3>
<pre><code class="language-python">try:
    n = int(input("So: "))
    print(100 / n)
except ValueError:
    print("Ban phai nhap mot so")
except ZeroDivisionError:
    print("Khong chia cho 0 duoc")
</code></pre>
<p><strong>Short-circuit:</strong> in <code>a and b</code>, if <code>a</code> is False, Python never even looks at <code>b</code> — useful to guard against errors, e.g. <code>if n != 0 and 100 / n &gt; 5:</code>.</p>
<div class="pitfall">A single <code>=</code> is <em>assignment</em>; comparison needs <code>==</code>. And every <code>if</code>/<code>elif</code>/<code>else</code> line ends with <code>:</code> — forgetting the colon or mixing tabs and spaces is the #1 beginner error in Python.</div>`,
    `<span class="eyebrow">PFP191 · Chương 3 · Bài 3.1</span>
<h2>Thực thi có điều kiện</h2>
<p class="lead">Một <strong>biểu thức boolean</strong> chỉ nhận <code>True</code> hoặc <code>False</code>. Điều kiện cho phép chương trình chọn đoạn code nào để chạy.</p>
<pre><code class="language-python">score = 7
if score &gt;= 8:
    print("Gioi")
elif score &gt;= 5:
    print("Dat")
else:
    print("Truot")
</code></pre>
<div class="out"><b>Kết quả:</b> Dat</div>
<p>Chú ý <strong>dấu hai chấm</strong> và <strong>thụt lề</strong> — trong Python, thụt lề (thường 4 dấu cách) là cách xác định một khối lệnh; không có ngoặc <code>{ }</code>.</p>
<h3>Toán tử so sánh &amp; logic</h3>
<ul>
<li>So sánh: <code>==</code> <code>!=</code> <code>&lt;</code> <code>&gt;</code> <code>&lt;=</code> <code>&gt;=</code></li>
<li>Logic: <code>and</code>, <code>or</code>, <code>not</code> — vd <code>if 0 &lt; x and x &lt; 10:</code></li>
</ul>
<p>Python cho phép so sánh <strong>nối chuỗi</strong>: <code>if 0 &lt; x &lt; 10:</code> mang cùng ý nghĩa.</p>
<h3>try / except — bắt lỗi</h3>
<pre><code class="language-python">try:
    n = int(input("So: "))
    print(100 / n)
except ValueError:
    print("Ban phai nhap mot so")
except ZeroDivisionError:
    print("Khong chia cho 0 duoc")
</code></pre>
<p><strong>Short-circuit (đoản mạch):</strong> trong <code>a and b</code>, nếu <code>a</code> là False, Python không thèm xét <code>b</code> — hữu ích để chặn lỗi, vd <code>if n != 0 and 100 / n &gt; 5:</code>.</p>
<div class="pitfall">Một dấu <code>=</code> là <em>gán</em>; so sánh phải dùng <code>==</code>. Và mọi dòng <code>if</code>/<code>elif</code>/<code>else</code> kết thúc bằng <code>:</code> — quên dấu hai chấm hay trộn tab với dấu cách là lỗi số 1 của người mới học Python.</div>`,
  ]]);

const c3q = quiz('pfp191-3-quiz', 'Quiz 3 — Conditionals|||Quiz 3 — Rẽ nhánh', [
  { id: 'q1', question: 'In Python, how is a block of code (after if:) defined?|||Trong Python, một khối lệnh (sau if:) được xác định bằng gì?', options: ['Curly braces { }|||Ngoặc nhọn { }', 'Indentation|||Thụt lề', 'The word "end"|||Từ khoá "end"', 'A semicolon ;|||Dấu chấm phẩy ;'], correctIndex: 1, explanation: 'Python dùng thụt lề (thường 4 dấu cách) để xác định khối, không dùng { }.' },
  { id: 'q2', question: 'Which keyword handles the case when no earlier condition matched?|||Từ khoá nào xử lý trường hợp không điều kiện nào trước đó đúng?', options: ['elif', 'else', 'except', 'end'], correctIndex: 1, explanation: 'else chạy khi mọi if/elif phía trên đều sai.' },
  { id: 'q3', question: 'What does try/except do?|||try/except dùng để làm gì?', options: ['Repeat code|||Lặp lại code', 'Catch and handle runtime errors|||Bắt và xử lý lỗi lúc chạy', 'Define a function|||Định nghĩa hàm', 'Print faster|||In nhanh hơn'], correctIndex: 1, explanation: 'try chạy code có thể lỗi; except bắt lỗi để chương trình không vỡ.' },
]);

/* ═══════════════ CHƯƠNG 4 — VÒNG LẶP (CLO3) ═══════════════ */
const c4 = doc('pfp191-4-1-vong-lap', '4.1 — Iteration (loops)|||4.1 — Vòng lặp (Iteration)',
  'while và vòng lặp vô hạn, continue/break, for duyệt dãy, các mẫu vòng lặp (đếm, tổng, min/max) và biến tích luỹ.',
  [[
    `<span class="eyebrow">PFP191 · Chapter 4 · Lesson 4.1</span>
<h2>Iteration — doing something many times</h2>
<p class="lead"><strong>Loops</strong> repeat a block. Use <code>while</code> when you don't know how many times; use <code>for</code> to walk through a sequence.</p>
<pre><code class="language-python"># while: repeat while a condition holds
n = 5
while n &gt; 0:
    print(n, end=" ")   # 5 4 3 2 1
    n = n - 1

# for: walk through a range
for i in range(1, 6):
    print(i, end=" ")   # 1 2 3 4 5
</code></pre>
<h3>break &amp; continue</h3>
<ul>
<li><code>break</code> — leave the loop immediately.</li>
<li><code>continue</code> — skip to the next iteration.</li>
</ul>
<pre><code class="language-python">while True:            # an intentional infinite loop
    line = input("&gt; ")
    if line == "done":
        break          # the only way out
    print(line)
</code></pre>
<h3>Loop patterns</h3>
<pre><code class="language-python">total = 0              # accumulator: start empty
count = 0
for x in [3, 41, 12, 9]:
    total = total + x  # running sum
    count = count + 1
print("Average:", total / count)   # 16.25
</code></pre>
<p>These patterns — <strong>counting</strong>, <strong>summing</strong>, and finding <strong>max/min</strong> — appear again and again. Learn them once and reuse them.</p>
<div class="pitfall">An <strong>infinite loop</strong> happens when the condition never becomes false — forgetting <code>n = n - 1</code> above loops forever. Always make sure something inside the loop moves it toward the exit.</div>`,
    `<span class="eyebrow">PFP191 · Chương 4 · Bài 4.1</span>
<h2>Vòng lặp — làm một việc nhiều lần</h2>
<p class="lead"><strong>Vòng lặp</strong> lặp lại một khối lệnh. Dùng <code>while</code> khi chưa biết lặp bao nhiêu lần; dùng <code>for</code> để duyệt qua một dãy.</p>
<pre><code class="language-python"># while: lap khi dieu kien con dung
n = 5
while n &gt; 0:
    print(n, end=" ")   # 5 4 3 2 1
    n = n - 1

# for: duyet qua range
for i in range(1, 6):
    print(i, end=" ")   # 1 2 3 4 5
</code></pre>
<h3>break &amp; continue</h3>
<ul>
<li><code>break</code> — thoát vòng lặp ngay lập tức.</li>
<li><code>continue</code> — bỏ qua, sang vòng lặp kế tiếp.</li>
</ul>
<pre><code class="language-python">while True:            # vong lap vo han co chu dinh
    line = input("&gt; ")
    if line == "done":
        break          # loi thoat duy nhat
    print(line)
</code></pre>
<h3>Các mẫu vòng lặp</h3>
<pre><code class="language-python">total = 0              # bien tich luy: bat dau rong
count = 0
for x in [3, 41, 12, 9]:
    total = total + x  # cong don
    count = count + 1
print("Trung binh:", total / count)   # 16.25
</code></pre>
<p>Các mẫu này — <strong>đếm</strong>, <strong>tính tổng</strong>, và tìm <strong>max/min</strong> — xuất hiện đi xuất hiện lại. Học một lần rồi dùng mãi.</p>
<div class="pitfall">Một <strong>vòng lặp vô hạn</strong> xảy ra khi điều kiện không bao giờ sai — quên <code>n = n - 1</code> ở trên là lặp mãi. Luôn đảm bảo có gì đó bên trong đẩy vòng lặp tiến về lối thoát.</div>`,
  ]]);

const c4q = quiz('pfp191-4-quiz', 'Quiz 4 — Loops|||Quiz 4 — Vòng lặp', [
  { id: 'q1', question: 'Which loop is best when you know the number of repetitions in advance?|||Vòng lặp nào hợp nhất khi đã biết trước số lần lặp?', options: ['while', 'for', 'if', 'try'], correctIndex: 1, explanation: 'for (thường với range) hợp khi biết trước số lần; while hợp khi chưa biết.' },
  { id: 'q2', question: 'What does break do inside a loop?|||break làm gì trong vòng lặp?', options: ['Skips to the next iteration|||Bỏ qua sang vòng kế', 'Exits the loop immediately|||Thoát vòng lặp ngay', 'Restarts the loop|||Bắt đầu lại vòng lặp', 'Prints a value|||In một giá trị'], correctIndex: 1, explanation: 'break thoát hẳn vòng lặp; continue mới là bỏ qua sang vòng kế.' },
  { id: 'q3', question: 'How many numbers does range(1, 6) produce?|||range(1, 6) sinh ra bao nhiêu số?', options: ['6 (1..6)', '5 (1..5)', '4 (2..5)', '7 (0..6)'], correctIndex: 1, explanation: 'range(1, 6) cho 1,2,3,4,5 — dừng TRƯỚC 6, tất cả 5 số.' },
]);

/* ═══════════════ CHƯƠNG 5 — HÀM (CLO3) ═══════════════ */
const c5 = doc('pfp191-5-1-ham', '5.1 — Functions|||5.1 — Hàm (Functions)',
  'Gọi hàm, hàm dựng sẵn, module math/random, định nghĩa hàm với def, tham số & đối số, hàm có/không trả về (fruitful vs void), vì sao dùng hàm.',
  [[
    `<span class="eyebrow">PFP191 · Chapter 5 · Lesson 5.1</span>
<h2>Functions — package and reuse code</h2>
<p class="lead">A <strong>function</strong> is a named block of code you can call by name. You've already used built-ins: <code>print()</code>, <code>input()</code>, <code>len()</code>, <code>int()</code>.</p>
<h3>Built-in functions &amp; modules</h3>
<pre><code class="language-python">import math, random
print(len("hello"))       # 5
print(max(3, 41, 12))     # 41
print(math.sqrt(16))      # 4.0
print(random.randint(1, 6))  # a dice roll
</code></pre>
<p>A <strong>module</strong> is a library of ready-made functions; <code>import</code> it, then call <code>module.function()</code>.</p>
<h3>Defining your own function</h3>
<pre><code class="language-python">def greet(name):          # name is a PARAMETER
    return "Xin chao, " + name

message = greet("An")     # "An" is the ARGUMENT
print(message)            # Xin chao, An
</code></pre>
<ul>
<li><strong>Parameter</strong> — the name in the definition. <strong>Argument</strong> — the value you pass in.</li>
<li>A <strong>fruitful</strong> function <code>return</code>s a value; a <strong>void</strong> function just does something (and returns <code>None</code>).</li>
</ul>
<pre><code class="language-python">def area(w, h):
    return w * h          # fruitful

def banner(text):
    print("=== " + text + " ===")   # void
</code></pre>
<h3>Why use functions?</h3>
<p>They <strong>remove repetition</strong>, give a chunk of code a <strong>meaningful name</strong>, and let you <strong>debug once</strong>. Break a big problem into small functions — that is the heart of programming.</p>
<div class="pitfall">A variable created inside a function is <strong>local</strong> — it disappears when the function returns and can't be seen outside. To get a result out, <code>return</code> it.</div>`,
    `<span class="eyebrow">PFP191 · Chương 5 · Bài 5.1</span>
<h2>Hàm — đóng gói và tái sử dụng code</h2>
<p class="lead">Một <strong>hàm</strong> là khối code có tên, bạn gọi bằng tên đó. Bạn đã dùng hàm dựng sẵn rồi: <code>print()</code>, <code>input()</code>, <code>len()</code>, <code>int()</code>.</p>
<h3>Hàm dựng sẵn &amp; module</h3>
<pre><code class="language-python">import math, random
print(len("hello"))       # 5
print(max(3, 41, 12))     # 41
print(math.sqrt(16))      # 4.0
print(random.randint(1, 6))  # tung xuc xac
</code></pre>
<p>Một <strong>module</strong> là thư viện hàm làm sẵn; <code>import</code> vào, rồi gọi <code>module.ham()</code>.</p>
<h3>Tự định nghĩa hàm</h3>
<pre><code class="language-python">def greet(name):          # name la THAM SO
    return "Xin chao, " + name

message = greet("An")     # "An" la DOI SO
print(message)            # Xin chao, An
</code></pre>
<ul>
<li><strong>Tham số</strong> — cái tên trong định nghĩa. <strong>Đối số</strong> — giá trị bạn truyền vào.</li>
<li>Hàm <strong>có trả về (fruitful)</strong> dùng <code>return</code> trả một giá trị; hàm <strong>void</strong> chỉ làm việc gì đó (và trả về <code>None</code>).</li>
</ul>
<pre><code class="language-python">def area(w, h):
    return w * h          # co tra ve

def banner(text):
    print("=== " + text + " ===")   # void
</code></pre>
<h3>Vì sao dùng hàm?</h3>
<p>Hàm <strong>xoá lặp lại</strong>, đặt <strong>tên có nghĩa</strong> cho một mảng code, và cho phép <strong>debug một lần</strong>. Chia bài toán lớn thành các hàm nhỏ — đó là cốt lõi của lập trình.</p>
<div class="pitfall">Biến tạo bên trong hàm là <strong>cục bộ (local)</strong> — nó biến mất khi hàm kết thúc và không thấy được từ bên ngoài. Muốn lấy kết quả ra, phải <code>return</code> nó.</div>`,
  ]]);

const c5q = quiz('pfp191-5-quiz', 'Quiz 5 — Functions|||Quiz 5 — Hàm', [
  { id: 'q1', question: 'Which keyword defines a function in Python?|||Từ khoá nào định nghĩa một hàm trong Python?', options: ['function', 'def', 'func', 'define'], correctIndex: 1, explanation: 'Python dùng def để định nghĩa hàm.' },
  { id: 'q2', question: 'What does a "fruitful" function do that a "void" one does not?|||Hàm "có trả về" khác hàm "void" ở chỗ nào?', options: ['It prints|||Nó in ra', 'It returns a value with return|||Nó trả về giá trị bằng return', 'It runs faster|||Nó chạy nhanh hơn', 'It takes no arguments|||Nó không nhận đối số'], correctIndex: 1, explanation: 'Hàm fruitful dùng return trả giá trị; hàm void chỉ làm việc, trả None.' },
  { id: 'q3', question: 'In def greet(name):, what is "name"?|||Trong def greet(name):, "name" là gì?', options: ['An argument|||Một đối số', 'A parameter|||Một tham số', 'A module|||Một module', 'A return value|||Giá trị trả về'], correctIndex: 1, explanation: 'name là tham số (trong định nghĩa); giá trị truyền vào lúc gọi mới là đối số.' },
]);

/* ═══════════════ CHƯƠNG 6 — CHUỖI (CLO4) ═══════════════ */
const c6 = doc('pfp191-6-1-chuoi', '6.1 — Strings|||6.1 — Chuỗi (Strings)',
  'Chuỗi là dãy ký tự, len, chỉ số & cắt lát (slice), tính bất biến (immutable), toán tử in, so sánh, các method chuỗi, tách/phân tích và định dạng.',
  [[
    `<span class="eyebrow">PFP191 · Chapter 6 · Lesson 6.1</span>
<h2>Strings — working with text</h2>
<p class="lead">A <strong>string</strong> is a sequence of characters. You can index it, slice it, loop over it, and search it — but you cannot change it in place (it is <strong>immutable</strong>).</p>
<pre><code class="language-python">s = "Python"
print(len(s))      # 6
print(s[0])        # P   (index starts at 0)
print(s[-1])       # n   (negative = from the end)
print(s[0:3])      # Pyt (slice: from 0 up to, not including, 3)
</code></pre>
<h3>Immutable, in, and comparison</h3>
<pre><code class="language-python">print("th" in "Python")   # True  (the "in" operator)
print("apple" &lt; "banana") # True  (dictionary order)
# s[0] = "J"   -&gt; ERROR: strings can't be changed in place
</code></pre>
<h3>String methods</h3>
<pre><code class="language-python">t = "  Hello World  "
print(t.strip())          # "Hello World"  (trim spaces)
print(t.upper())          # "  HELLO WORLD  "
print("Hello".replace("l", "L"))  # HeLLo
print("a,b,c".split(","))         # ['a', 'b', 'c']
</code></pre>
<h3>Parsing &amp; format</h3>
<pre><code class="language-python">line = "name: An"
value = line.split(":")[1].strip()   # "An"
name, age = "An", 20
print(f"{name} is {age}")            # f-string -&gt; An is 20
</code></pre>
<div class="pitfall">A slice <code>s[a:b]</code> includes <code>a</code> but <strong>stops before</strong> <code>b</code>. And since strings are immutable, methods like <code>.upper()</code> return a <em>new</em> string — the original is unchanged unless you reassign it.</div>`,
    `<span class="eyebrow">PFP191 · Chương 6 · Bài 6.1</span>
<h2>Chuỗi — làm việc với văn bản</h2>
<p class="lead">Một <strong>chuỗi</strong> là dãy ký tự. Bạn có thể lấy theo chỉ số, cắt lát, duyệt qua, và tìm kiếm — nhưng không sửa tại chỗ được (nó <strong>bất biến</strong>).</p>
<pre><code class="language-python">s = "Python"
print(len(s))      # 6
print(s[0])        # P   (chi so bat dau tu 0)
print(s[-1])       # n   (so am = tinh tu cuoi)
print(s[0:3])      # Pyt (cat lat: tu 0 den truoc 3)
</code></pre>
<h3>Bất biến, in, và so sánh</h3>
<pre><code class="language-python">print("th" in "Python")   # True  (toan tu "in")
print("apple" &lt; "banana") # True  (thu tu tu dien)
# s[0] = "J"   -&gt; LOI: khong sua chuoi tai cho duoc
</code></pre>
<h3>Các method của chuỗi</h3>
<pre><code class="language-python">t = "  Hello World  "
print(t.strip())          # "Hello World"  (cat khoang trang)
print(t.upper())          # "  HELLO WORLD  "
print("Hello".replace("l", "L"))  # HeLLo
print("a,b,c".split(","))         # ['a', 'b', 'c']
</code></pre>
<h3>Tách/phân tích &amp; định dạng</h3>
<pre><code class="language-python">line = "name: An"
value = line.split(":")[1].strip()   # "An"
name, age = "An", 20
print(f"{name} is {age}")            # f-string -&gt; An is 20
</code></pre>
<div class="pitfall">Cắt lát <code>s[a:b]</code> lấy từ <code>a</code> nhưng <strong>dừng trước</strong> <code>b</code>. Và vì chuỗi bất biến, các method như <code>.upper()</code> trả về chuỗi <em>mới</em> — bản gốc không đổi trừ khi bạn gán lại.</div>`,
  ]]);

const c6q = quiz('pfp191-6-quiz', 'Quiz 6 — Strings|||Quiz 6 — Chuỗi', [
  { id: 'q1', question: 'For s = "Python", what is s[0]?|||Với s = "Python", s[0] là gì?', options: ['"P"', '"y"', '"n"', 'Error|||Lỗi'], correctIndex: 0, explanation: 'Chỉ số bắt đầu từ 0, nên s[0] là ký tự đầu tiên "P".' },
  { id: 'q2', question: 'What does it mean that strings are "immutable"?|||"Bất biến (immutable)" của chuỗi nghĩa là gì?', options: ['They are very fast|||Chúng rất nhanh', 'They cannot be changed in place|||Không sửa tại chỗ được', 'They hold only numbers|||Chỉ chứa số', 'They must be short|||Phải ngắn'], correctIndex: 1, explanation: 'Không thể sửa một ký tự tại chỗ; method như .upper() trả về chuỗi mới.' },
  { id: 'q3', question: 'What does "a,b,c".split(",") return?|||"a,b,c".split(",") trả về gì?', options: ['"abc"', "['a', 'b', 'c']", '3', '"a b c"'], correctIndex: 1, explanation: 'split cắt chuỗi theo dấu phân cách thành một list các phần.' },
]);

/* ═══════════════ CHƯƠNG 7 — TỆP (CLO5) ═══════════════ */
const c7 = doc('pfp191-7-1-tep', '7.1 — Files|||7.1 — Tệp (Files)',
  'Tính bền vững (persistence), mở tệp với open, đọc từng dòng, tìm kiếm trong tệp, ghi tệp, và dùng try/except quanh open.',
  [[
    `<span class="eyebrow">PFP191 · Chapter 7 · Lesson 7.1</span>
<h2>Files — data that survives</h2>
<p class="lead">Variables live in memory and vanish when the program ends. <strong>Files</strong> give <strong>persistence</strong>: data written to disk stays there for next time.</p>
<h3>Opening &amp; reading</h3>
<pre><code class="language-python">f = open("data.txt")        # open for reading (default)
for line in f:              # read line by line
    print(line.rstrip())    # rstrip() drops the trailing newline
f.close()

# The modern, safer way: with (auto-closes the file)
with open("data.txt") as f:
    text = f.read()         # read the WHOLE file into one string
</code></pre>
<h3>Searching a file</h3>
<pre><code class="language-python">with open("mbox.txt") as f:
    for line in f:
        if line.startswith("From:"):
            print(line.rstrip())
</code></pre>
<h3>Writing</h3>
<pre><code class="language-python">with open("out.txt", "w") as f:   # "w" = write (overwrites!)
    f.write("Line 1\\n")
    f.write("Line 2\\n")
# "a" = append (adds to the end without erasing)
</code></pre>
<h3>Guarding with try / except</h3>
<pre><code class="language-python">name = input("File name: ")
try:
    with open(name) as f:
        print(len(f.read()), "characters")
except FileNotFoundError:
    print("Cannot open", name)
</code></pre>
<div class="pitfall">Opening with <code>"w"</code> <strong>erases</strong> the file first — use <code>"a"</code> to append instead. And a file that doesn't exist raises <code>FileNotFoundError</code>; wrap <code>open</code> in <code>try/except</code> when the name comes from the user.</div>`,
    `<span class="eyebrow">PFP191 · Chương 7 · Bài 7.1</span>
<h2>Tệp — dữ liệu sống sót</h2>
<p class="lead">Biến sống trong bộ nhớ và biến mất khi chương trình kết thúc. <strong>Tệp</strong> mang lại <strong>tính bền vững</strong>: dữ liệu ghi ra đĩa còn đó cho lần sau.</p>
<h3>Mở &amp; đọc</h3>
<pre><code class="language-python">f = open("data.txt")        # mo de doc (mac dinh)
for line in f:              # doc tung dong
    print(line.rstrip())    # rstrip() bo ky tu xuong dong o cuoi
f.close()

# Cach hien dai, an toan hon: with (tu dong dong tep)
with open("data.txt") as f:
    text = f.read()         # doc CA tep vao mot chuoi
</code></pre>
<h3>Tìm kiếm trong tệp</h3>
<pre><code class="language-python">with open("mbox.txt") as f:
    for line in f:
        if line.startswith("From:"):
            print(line.rstrip())
</code></pre>
<h3>Ghi tệp</h3>
<pre><code class="language-python">with open("out.txt", "w") as f:   # "w" = ghi (GHI DE!)
    f.write("Line 1\\n")
    f.write("Line 2\\n")
# "a" = append (them vao cuoi, khong xoa)
</code></pre>
<h3>Chặn lỗi bằng try / except</h3>
<pre><code class="language-python">name = input("Ten tep: ")
try:
    with open(name) as f:
        print(len(f.read()), "ky tu")
except FileNotFoundError:
    print("Khong mo duoc", name)
</code></pre>
<div class="pitfall">Mở bằng <code>"w"</code> sẽ <strong>xoá</strong> tệp trước — muốn thêm vào cuối thì dùng <code>"a"</code>. Và tệp không tồn tại sẽ báo <code>FileNotFoundError</code>; hãy bọc <code>open</code> trong <code>try/except</code> khi tên tệp do người dùng nhập.</div>`,
  ]]);

const c7q = quiz('pfp191-7-quiz', 'Quiz 7 — Files|||Quiz 7 — Tệp', [
  { id: 'q1', question: 'What does open("out.txt", "w") do if the file already exists?|||open("out.txt", "w") làm gì nếu tệp đã tồn tại?', options: ['Appends to it|||Thêm vào cuối', 'Erases it and starts fresh|||Xoá sạch và ghi mới', 'Raises an error|||Báo lỗi', 'Reads it|||Đọc nó'], correctIndex: 1, explanation: 'Chế độ "w" ghi đè, xoá nội dung cũ. Muốn thêm vào cuối phải dùng "a".' },
  { id: 'q2', question: 'Why is using "with open(...) as f:" preferred?|||Vì sao nên dùng "with open(...) as f:"?', options: ['It reads faster|||Đọc nhanh hơn', 'It closes the file automatically|||Tự động đóng tệp', 'It never errors|||Không bao giờ lỗi', 'It writes in binary|||Ghi nhị phân'], correctIndex: 1, explanation: 'with tự đóng tệp khi xong, kể cả khi có lỗi giữa chừng.' },
  { id: 'q3', question: 'Opening a file that does not exist raises which error?|||Mở một tệp không tồn tại sẽ báo lỗi nào?', options: ['ValueError', 'FileNotFoundError', 'ZeroDivisionError', 'IndexError'], correctIndex: 1, explanation: 'FileNotFoundError — nên bọc open trong try/except khi tên do người dùng nhập.' },
]);

/* ═══════════════ CHƯƠNG 8 — DANH SÁCH (CLO6) ═══════════════ */
const c8 = doc('pfp191-8-1-list', '8.1 — Lists|||8.1 — Danh sách (Lists)',
  'List là dãy tuần tự thay đổi được (mutable), các phép toán/cắt lát/method, xoá phần tử, aliasing (bí danh), và truyền list vào hàm.',
  [[
    `<span class="eyebrow">PFP191 · Chapter 8 · Lesson 8.1</span>
<h2>Lists — an ordered, changeable collection</h2>
<p class="lead">A <strong>list</strong> holds many values in order, in a single variable. Unlike a string, a list is <strong>mutable</strong> — you can change its items.</p>
<pre><code class="language-python">nums = [3, 41, 12, 9]
print(nums[0])       # 3
nums[0] = 100        # mutable: change an item in place
nums.append(7)       # [100, 41, 12, 9, 7]
print(len(nums))     # 5
print(nums[1:3])     # [41, 12]  (slice, like strings)
</code></pre>
<h3>Operations &amp; methods</h3>
<pre><code class="language-python">a = [1, 2] + [3, 4]   # [1, 2, 3, 4]  (concatenate)
a.append(5)           # add one item to the end
a.sort()              # sort in place
total = sum(a)        # built-in sum works on lists
print("th" in "Python", 3 in a)   # membership test
</code></pre>
<h3>Deleting items</h3>
<pre><code class="language-python">nums.remove(12)       # remove the first 12 by VALUE
last = nums.pop()     # remove &amp; return the last item
del nums[0]           # remove by INDEX
</code></pre>
<h3>Aliasing &amp; passing to functions</h3>
<pre><code class="language-python">b = nums              # NOT a copy: b is another name for the SAME list
b.append(99)          # this also changes nums!
c = nums[:]           # a real copy (slice of the whole list)

def add_bonus(scores):
    scores.append(10)  # a function CAN change the caller's list
</code></pre>
<div class="pitfall"><code>b = nums</code> makes an <strong>alias</strong>, not a copy — both names point to one list, so a change through either is seen by both. To copy, use <code>nums[:]</code> or <code>list(nums)</code>.</div>`,
    `<span class="eyebrow">PFP191 · Chương 8 · Bài 8.1</span>
<h2>Danh sách — tập hợp có thứ tự, đổi được</h2>
<p class="lead">Một <strong>list</strong> giữ nhiều giá trị theo thứ tự trong một biến. Khác chuỗi, list <strong>thay đổi được (mutable)</strong> — bạn sửa được các phần tử.</p>
<pre><code class="language-python">nums = [3, 41, 12, 9]
print(nums[0])       # 3
nums[0] = 100        # mutable: sua tai cho
nums.append(7)       # [100, 41, 12, 9, 7]
print(len(nums))     # 5
print(nums[1:3])     # [41, 12]  (cat lat, giong chuoi)
</code></pre>
<h3>Phép toán &amp; method</h3>
<pre><code class="language-python">a = [1, 2] + [3, 4]   # [1, 2, 3, 4]  (noi)
a.append(5)           # them mot phan tu vao cuoi
a.sort()              # sap xep tai cho
total = sum(a)        # ham sum chay duoc tren list
print("th" in "Python", 3 in a)   # kiem tra thanh vien
</code></pre>
<h3>Xoá phần tử</h3>
<pre><code class="language-python">nums.remove(12)       # xoa so 12 dau tien theo GIA TRI
last = nums.pop()     # xoa &amp; tra ve phan tu cuoi
del nums[0]           # xoa theo CHI SO
</code></pre>
<h3>Aliasing &amp; truyền vào hàm</h3>
<pre><code class="language-python">b = nums              # KHONG phai ban sao: b la ten khac cua CUNG list
b.append(99)          # cai nay cung doi nums!
c = nums[:]           # ban sao that (cat lat ca list)

def add_bonus(scores):
    scores.append(10)  # ham CO THE doi list cua ben goi
</code></pre>
<div class="pitfall"><code>b = nums</code> tạo <strong>bí danh (alias)</strong>, không phải bản sao — hai tên trỏ vào một list, nên đổi qua tên nào cũng thấy ở cả hai. Muốn sao chép, dùng <code>nums[:]</code> hoặc <code>list(nums)</code>.</div>`,
  ]]);

const c8q = quiz('pfp191-8-quiz', 'Quiz 8 — Lists|||Quiz 8 — Danh sách', [
  { id: 'q1', question: 'How do lists differ from strings?|||List khác chuỗi ở điểm nào?', options: ['Lists are immutable|||List bất biến', 'Lists are mutable (items can change)|||List thay đổi được (sửa phần tử)', 'Lists hold only text|||List chỉ chứa chữ', 'Lists have no order|||List không có thứ tự'], correctIndex: 1, explanation: 'List thay đổi được: bạn gán lại phần tử, thêm, xoá; chuỗi thì không.' },
  { id: 'q2', question: 'What does nums.append(7) do?|||nums.append(7) làm gì?', options: ['Removes 7|||Xoá số 7', 'Adds 7 to the end of the list|||Thêm 7 vào cuối list', 'Sorts the list|||Sắp xếp list', 'Returns the length|||Trả về độ dài'], correctIndex: 1, explanation: 'append thêm một phần tử vào cuối list.' },
  { id: 'q3', question: 'After b = nums; b.append(99), what happens to nums?|||Sau b = nums; b.append(99), nums thế nào?', options: ['Unchanged|||Không đổi', 'It also gets 99 (they are the same list)|||Cũng có 99 (cùng một list)', 'It is emptied|||Bị xoá sạch', 'Error|||Lỗi'], correctIndex: 1, explanation: 'b là bí danh của nums (cùng một list), nên đổi qua b thì nums cũng đổi.' },
]);

/* ═══════════════ CHƯƠNG 9 — TỪ ĐIỂN (CLO6) ═══════════════ */
const c9 = doc('pfp191-9-1-dict', '9.1 — Dictionaries|||9.1 — Từ điển (Dictionaries)',
  'Dict ánh xạ khoá → giá trị, dùng làm bộ đếm, dict với tệp, duyệt dict, và mẫu phân tích văn bản nâng cao (đếm tần suất từ).',
  [[
    `<span class="eyebrow">PFP191 · Chapter 9 · Lesson 9.1</span>
<h2>Dictionaries — key → value</h2>
<p class="lead">A <strong>list</strong> is indexed by position (0, 1, 2...). A <strong>dictionary</strong> is indexed by a <strong>key</strong> you choose — a name, a word, an id — mapping it to a value.</p>
<pre><code class="language-python">age = {"An": 20, "Binh": 21}
print(age["An"])       # 20
age["Chi"] = 19        # add a new key
print("An" in age)     # True  (checks KEYS)
print(len(age))        # 3
</code></pre>
<h3>Dictionaries as counters</h3>
<pre><code class="language-python">counts = {}
for word in ["a", "b", "a", "c", "a"]:
    counts[word] = counts.get(word, 0) + 1
print(counts)          # {'a': 3, 'b': 1, 'c': 1}
</code></pre>
<p><code>counts.get(word, 0)</code> returns the current count, or <code>0</code> if the key isn't there yet — the classic counting idiom.</p>
<h3>Looping over a dictionary</h3>
<pre><code class="language-python">for key in age:
    print(key, age[key])       # key then its value
for key, value in age.items(): # both at once
    print(key, "->", value)
</code></pre>
<h3>Advanced: word frequency from a file</h3>
<pre><code class="language-python">counts = {}
with open("speech.txt") as f:
    for line in f:
        for word in line.split():
            counts[word] = counts.get(word, 0) + 1
# counts now maps every word to how many times it appears
</code></pre>
<div class="pitfall">Looking up a key that doesn't exist raises <code>KeyError</code>. Use <code>d.get(key, default)</code> or check <code>if key in d:</code> first. And keys must be unique — assigning the same key again <em>overwrites</em> the old value.</div>`,
    `<span class="eyebrow">PFP191 · Chương 9 · Bài 9.1</span>
<h2>Từ điển — khoá → giá trị</h2>
<p class="lead">Một <strong>list</strong> đánh chỉ số theo vị trí (0, 1, 2...). Một <strong>dictionary</strong> đánh chỉ số theo <strong>khoá</strong> bạn chọn — một cái tên, một từ, một id — ánh xạ nó tới một giá trị.</p>
<pre><code class="language-python">age = {"An": 20, "Binh": 21}
print(age["An"])       # 20
age["Chi"] = 19        # them mot khoa moi
print("An" in age)     # True  (kiem tra KHOA)
print(len(age))        # 3
</code></pre>
<h3>Dùng dict làm bộ đếm</h3>
<pre><code class="language-python">counts = {}
for word in ["a", "b", "a", "c", "a"]:
    counts[word] = counts.get(word, 0) + 1
print(counts)          # {'a': 3, 'b': 1, 'c': 1}
</code></pre>
<p><code>counts.get(word, 0)</code> trả về số đếm hiện tại, hoặc <code>0</code> nếu khoá chưa có — thành ngữ đếm kinh điển.</p>
<h3>Duyệt qua một dictionary</h3>
<pre><code class="language-python">for key in age:
    print(key, age[key])       # khoa roi gia tri
for key, value in age.items(): # lay ca hai cung luc
    print(key, "->", value)
</code></pre>
<h3>Nâng cao: đếm tần suất từ trong tệp</h3>
<pre><code class="language-python">counts = {}
with open("speech.txt") as f:
    for line in f:
        for word in line.split():
            counts[word] = counts.get(word, 0) + 1
# counts gio anh xa moi tu toi so lan xuat hien
</code></pre>
<div class="pitfall">Tra một khoá không tồn tại sẽ báo <code>KeyError</code>. Dùng <code>d.get(key, default)</code> hoặc kiểm <code>if key in d:</code> trước. Và khoá phải duy nhất — gán lại cùng một khoá sẽ <em>ghi đè</em> giá trị cũ.</div>`,
  ]]);

const c9q = quiz('pfp191-9-quiz', 'Quiz 9 — Dictionaries|||Quiz 9 — Từ điển', [
  { id: 'q1', question: 'How is a dictionary indexed?|||Dictionary được đánh chỉ số theo gì?', options: ['By position (0, 1, 2)|||Theo vị trí (0, 1, 2)', 'By a key you choose|||Theo khoá bạn chọn', 'Alphabetically only|||Chỉ theo bảng chữ cái', 'It cannot be indexed|||Không đánh chỉ số được'], correctIndex: 1, explanation: 'Dict ánh xạ khoá → giá trị; bạn tra theo khoá, không theo vị trí.' },
  { id: 'q2', question: 'What does counts.get(word, 0) return if word is not a key yet?|||counts.get(word, 0) trả về gì nếu word chưa là khoá?', options: ['KeyError', '0', 'None', 'An empty list|||List rỗng'], correctIndex: 1, explanation: 'get trả về giá trị mặc định thứ hai (0) khi khoá chưa tồn tại — nên dùng để đếm.' },
  { id: 'q3', question: 'Looking up a missing key with d[key] raises which error?|||Tra khoá không có bằng d[key] báo lỗi nào?', options: ['ValueError', 'KeyError', 'IndexError', 'TypeError'], correctIndex: 1, explanation: 'KeyError — dùng d.get(key, default) hoặc if key in d để tránh.' },
]);

/* ═══════════════ CHƯƠNG 10 — TUPLE (CLO6) ═══════════════ */
const c10 = doc('pfp191-10-1-tuple', '10.1 — Tuples|||10.1 — Tuple',
  'Tuple là dãy bất biến, so sánh tuple, gán tuple (unpacking), và dùng tuple cùng dictionary (items, sắp xếp theo giá trị).',
  [[
    `<span class="eyebrow">PFP191 · Chapter 10 · Lesson 10.1</span>
<h2>Tuples — like a list, but frozen</h2>
<p class="lead">A <strong>tuple</strong> is an ordered sequence like a list, but <strong>immutable</strong> — once made, it cannot change. Use round brackets.</p>
<pre><code class="language-python">point = (3, 4)
print(point[0])     # 3
print(len(point))   # 2
# point[0] = 9      -&gt; ERROR: tuples are immutable
</code></pre>
<p>Because they can't change, tuples are a little faster and can be used as <strong>dictionary keys</strong> (lists cannot).</p>
<h3>Tuple assignment (unpacking)</h3>
<pre><code class="language-python">x, y = (3, 4)          # x=3, y=4
a, b = b, a            # swap two variables in ONE line
name, age = "An", 20   # the brackets are optional
</code></pre>
<h3>Comparison</h3>
<pre><code class="language-python">print((0, 1, 2) &lt; (0, 3, 0))   # True: compares item by item, left to right
</code></pre>
<h3>Tuples &amp; dictionaries</h3>
<pre><code class="language-python">age = {"An": 20, "Binh": 21}
for key, value in age.items():   # items() yields (key, value) tuples
    print(key, value)

# sort a dictionary by value using tuples
pairs = [(v, k) for k, v in age.items()]
pairs.sort(reverse=True)         # highest value first
print(pairs[0])                  # (21, 'Binh')
</code></pre>
<div class="pitfall">A one-item tuple needs a trailing comma: <code>(5,)</code> is a tuple, but <code>(5)</code> is just the number 5 in brackets. And unpacking must match: <code>a, b = (1, 2, 3)</code> raises a ValueError (too many values).</div>`,
    `<span class="eyebrow">PFP191 · Chương 10 · Bài 10.1</span>
<h2>Tuple — giống list nhưng đông cứng</h2>
<p class="lead">Một <strong>tuple</strong> là dãy có thứ tự như list, nhưng <strong>bất biến</strong> — đã tạo là không đổi được. Dùng ngoặc tròn.</p>
<pre><code class="language-python">point = (3, 4)
print(point[0])     # 3
print(len(point))   # 2
# point[0] = 9      -&gt; LOI: tuple bat bien
</code></pre>
<p>Vì không đổi được, tuple nhanh hơn chút và dùng được làm <strong>khoá của dictionary</strong> (list thì không).</p>
<h3>Gán tuple (unpacking)</h3>
<pre><code class="language-python">x, y = (3, 4)          # x=3, y=4
a, b = b, a            # hoan doi hai bien trong MOT dong
name, age = "An", 20   # ngoac co the bo
</code></pre>
<h3>So sánh</h3>
<pre><code class="language-python">print((0, 1, 2) &lt; (0, 3, 0))   # True: so tung phan tu, trai sang phai
</code></pre>
<h3>Tuple &amp; dictionary</h3>
<pre><code class="language-python">age = {"An": 20, "Binh": 21}
for key, value in age.items():   # items() sinh ra cac tuple (key, value)
    print(key, value)

# sap xep dictionary theo gia tri bang tuple
pairs = [(v, k) for k, v in age.items()]
pairs.sort(reverse=True)         # gia tri lon nhat truoc
print(pairs[0])                  # (21, 'Binh')
</code></pre>
<div class="pitfall">Tuple một phần tử cần dấu phẩy ở cuối: <code>(5,)</code> là tuple, còn <code>(5)</code> chỉ là số 5 trong ngoặc. Và unpacking phải khớp: <code>a, b = (1, 2, 3)</code> báo ValueError (quá nhiều giá trị).</div>`,
  ]]);

const c10q = quiz('pfp191-10-quiz', 'Quiz 10 — Tuples|||Quiz 10 — Tuple', [
  { id: 'q1', question: 'What is the key difference between a tuple and a list?|||Khác biệt then chốt giữa tuple và list là gì?', options: ['A tuple is immutable|||Tuple bất biến', 'A tuple holds only numbers|||Tuple chỉ chứa số', 'A tuple has no order|||Tuple không có thứ tự', 'A tuple is always longer|||Tuple luôn dài hơn'], correctIndex: 0, explanation: 'Tuple bất biến (không sửa được sau khi tạo); list thay đổi được.' },
  { id: 'q2', question: 'What does a, b = b, a do?|||a, b = b, a làm gì?', options: ['Deletes a and b|||Xoá a và b', 'Swaps the values of a and b|||Hoán đổi giá trị a và b', 'Sets both to 0|||Đặt cả hai bằ 0', 'Raises an error|||Báo lỗi'], correctIndex: 1, explanation: 'Gán tuple cho phép hoán đổi hai biến trong một dòng.' },
  { id: 'q3', question: 'Which of these can be a dictionary key?|||Cái nào dùng làm khoá của dictionary được?', options: ['A list [1, 2]|||Một list [1, 2]', 'A tuple (1, 2)|||Một tuple (1, 2)', 'Both|||Cả hai', 'Neither|||Không cái nào'], correctIndex: 1, explanation: 'Tuple bất biến nên làm khoá được; list thay đổi được nên không.' },
]);

/* ═══════════════ CHƯƠNG 11 — LẬP TRÌNH HƯỚNG ĐỐI TƯỢNG (CLO7) ═══════════════ */
const c11 = doc('pfp191-11-1-oop', '11.1 — Object-oriented programming (OOP)|||11.1 — Lập trình hướng đối tượng (OOP)',
  'Lớp & đối tượng, đóng gói/ẩn dữ liệu, trừu tượng hoá, kế thừa, đa hình & nạp chồng, vòng đời đối tượng và ý niệm mẫu thiết kế.',
  [[
    `<span class="eyebrow">PFP191 · Chapter 11 · Lesson 11.1</span>
<h2>Object-oriented programming</h2>
<p class="lead">A <strong>class</strong> is a blueprint; an <strong>object</strong> is a thing built from it. OOP bundles <em>data</em> and the <em>functions</em> that work on it into one unit.</p>
<pre><code class="language-python">class Dog:
    def __init__(self, name):   # constructor: runs when you create one
        self.name = name        # an attribute (data)

    def speak(self):            # a method (behavior)
        return self.name + " says Woof"

d = Dog("Rex")                  # d is an OBJECT of class Dog
print(d.speak())                # Rex says Woof
</code></pre>
<h3>Four pillars</h3>
<ul>
<li><strong>Encapsulation / data hiding</strong> — keep data inside the object; touch it through methods.</li>
<li><strong>Abstraction</strong> — expose <em>what</em> it does, hide <em>how</em>.</li>
<li><strong>Inheritance</strong> — a class can reuse and extend another.</li>
<li><strong>Polymorphism</strong> — the same method name behaves correctly for different classes.</li>
</ul>
<pre><code class="language-python">class Animal:
    def speak(self):
        return "..."

class Cat(Animal):              # Cat INHERITS from Animal
    def speak(self):            # OVERRIDES speak (polymorphism)
        return "Meow"

for a in [Cat(), Animal()]:
    print(a.speak())            # Meow, then ...
</code></pre>
<h3>Object lifecycle &amp; design patterns</h3>
<p>An object is <strong>created</strong> (<code>__init__</code>), <strong>used</strong>, then <strong>destroyed</strong> when nothing refers to it (Python cleans it up automatically). As programs grow, reusable arrangements of classes — <strong>design patterns</strong> — give proven solutions to common problems.</p>
<div class="pitfall">Every method's first parameter is <code>self</code> — the object it's called on. Forgetting <code>self</code>, or forgetting to set attributes in <code>__init__</code>, is the classic first-class bug.</div>`,
    `<span class="eyebrow">PFP191 · Chương 11 · Bài 11.1</span>
<h2>Lập trình hướng đối tượng</h2>
<p class="lead">Một <strong>lớp (class)</strong> là bản thiết kế; một <strong>đối tượng (object)</strong> là vật dựng từ nó. OOP gói <em>dữ liệu</em> và các <em>hàm</em> thao tác lên nó vào một khối.</p>
<pre><code class="language-python">class Dog:
    def __init__(self, name):   # ham dung: chay khi tao doi tuong
        self.name = name        # mot thuoc tinh (du lieu)

    def speak(self):            # mot method (hanh vi)
        return self.name + " says Woof"

d = Dog("Rex")                  # d la DOI TUONG cua lop Dog
print(d.speak())                # Rex says Woof
</code></pre>
<h3>Bốn trụ cột</h3>
<ul>
<li><strong>Đóng gói / ẩn dữ liệu</strong> — giữ dữ liệu bên trong đối tượng; chạm vào qua method.</li>
<li><strong>Trừu tượng hoá</strong> — phơi ra <em>làm gì</em>, giấu <em>làm thế nào</em>.</li>
<li><strong>Kế thừa</strong> — một lớp dùng lại và mở rộng lớp khác.</li>
<li><strong>Đa hình</strong> — cùng một tên method hoạt động đúng cho các lớp khác nhau.</li>
</ul>
<pre><code class="language-python">class Animal:
    def speak(self):
        return "..."

class Cat(Animal):              # Cat KE THUA tu Animal
    def speak(self):            # GHI DE speak (da hinh)
        return "Meow"

for a in [Cat(), Animal()]:
    print(a.speak())            # Meow, roi ...
</code></pre>
<h3>Vòng đời đối tượng &amp; mẫu thiết kế</h3>
<p>Một đối tượng được <strong>tạo</strong> (<code>__init__</code>), <strong>dùng</strong>, rồi <strong>huỷ</strong> khi không còn gì trỏ tới nó (Python tự dọn). Khi chương trình lớn dần, các cách sắp xếp lớp tái sử dụng được — <strong>mẫu thiết kế (design pattern)</strong> — cho lời giải đã được kiểm chứng cho những bài toán thường gặp.</p>
<div class="pitfall">Tham số đầu tiên của mọi method là <code>self</code> — chính đối tượng đang gọi. Quên <code>self</code>, hoặc quên gán thuộc tính trong <code>__init__</code>, là lỗi kinh điển của bài OOP đầu tiên.</div>`,
  ]]);

const c11q = quiz('pfp191-11-quiz', 'Quiz 11 — OOP|||Quiz 11 — Hướng đối tượng', [
  { id: 'q1', question: 'What is the relationship between a class and an object?|||Quan hệ giữa lớp (class) và đối tượng (object) là gì?', options: ['They are the same thing|||Chúng là một', 'A class is a blueprint; an object is built from it|||Lớp là bản thiết kế; đối tượng dựng từ nó', 'An object is a blueprint for a class|||Đối tượng là bản thiết kế của lớp', 'A class is a kind of loop|||Lớp là một loại vòng lặp'], correctIndex: 1, explanation: 'Lớp là khuôn/bản thiết kế; đối tượng là thực thể cụ thể tạo ra từ lớp.' },
  { id: 'q2', question: 'When a subclass provides its own version of a parent method, this is...|||Khi lớp con tự viết lại một method của lớp cha, đó là...', options: ['Encapsulation|||Đóng gói', 'Inheritance only|||Chỉ là kế thừa', 'Polymorphism (overriding)|||Đa hình (ghi đè)', 'Abstraction|||Trừu tượng hoá'], correctIndex: 2, explanation: 'Ghi đè method để cùng tên chạy đúng cho từng lớp là đa hình.' },
  { id: 'q3', question: 'What is the first parameter of an instance method usually called?|||Tham số đầu tiên của method thường tên là gì?', options: ['this', 'self', 'me', 'obj'], correctIndex: 1, explanation: 'Trong Python là self — tham chiếu tới chính đối tượng đang gọi method.' },
]);

/* ═══════════════ EXPORT ═══════════════ */
export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'PFP191',
    slug: 'pfp191-programming-fundamentals-with-python',
    title: 'Programming Fundamentals with Python',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/PFP191.webp',
    shortDescription: 'Intro to programming with Python (FLM syllabus, Python for Everybody): why programming, variables, conditionals, loops, functions, strings, files, lists, dicts, tuples & OOP. Bilingual, runnable Python & quizzes.|||Nhập môn lập trình Python (giáo trình FLM, Python for Everybody): vì sao lập trình, biến, điều kiện, vòng lặp, hàm, chuỗi, tệp, list, dict, tuple & OOP. Song ngữ, code Python chạy được & quiz.',
    description: 'Môn <strong>PFP191 — Programming Fundamentals with Python</strong> (Cơ sở lập trình với Python) là môn lập trình <strong>nền</strong> đầu tiên của ngành IT/AI, kỳ 1. Từ <strong>vì sao học lập trình</strong> (phần cứng, thông dịch vs biên dịch) → <strong>biến, biểu thức &amp; câu lệnh</strong> → <strong>rẽ nhánh</strong> (if/elif/else, try/except) → <strong>vòng lặp</strong> → <strong>hàm</strong> → <strong>chuỗi</strong> → <strong>tệp</strong> → <strong>list, dictionary &amp; tuple</strong> → <strong>lập trình hướng đối tượng (OOP)</strong>. Bám giáo trình FLM (sách chính <em>Python for Everybody</em> — Charles Severance, miễn phí py4e.com), 7 CLO, song ngữ EN+VI, code Python chạy được và quiz mỗi chương. Công cụ: VS Code, Google Colab, Python 3.',
    whatYouLearn: 'Máy tính chạy chương trình thế nào, thông dịch vs biên dịch, các khối xây dựng chương trình; biến/giá trị/kiểu, toán tử &amp; độ ưu tiên (//, %, **), input() &amp; ép kiểu, chú thích; biểu thức boolean, and/or/not, if/elif/else, try/except, short-circuit; vòng lặp while/for, break/continue, các mẫu đếm/tổng/min-max; định nghĩa hàm (def), tham số vs đối số, fruitful vs void, module math/random; chuỗi (chỉ số, cắt lát, immutable, method, split, f-string); tệp (open/read/write, with, try/except); list (mutable, method, aliasing); dictionary (khoá→giá trị, get làm bộ đếm, đếm tần suất từ); tuple (bất biến, unpacking, làm khoá dict); và OOP (class/object, __init__, self, kế thừa, đa hình, đóng gói).',
    requirements: 'Không có môn tiên quyết. Cần máy cài được Python 3 (VS Code + tiện ích Python), hoặc dùng Google Colab chạy Python trên trình duyệt, không cần cài gì.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Python for Everybody (py4e.com), Coursera, docs.python.org, Berkeley; công cụ VS Code/Colab/Python 3, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: '7 CLO, cơ cấu điểm, lộ trình 11 chương.', lessons: [intro] },
    { title: 'Chương 1 — Vì sao học lập trình? (CLO1)|||Chapter 1 — Why program? (CLO1)', description: 'Phần cứng máy tính, thông dịch vs biên dịch, khối xây dựng chương trình, debugging, IDE.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Biến, biểu thức & câu lệnh (CLO2)|||Chapter 2 — Variables, expressions & statements (CLO2)', description: 'Giá trị & kiểu, toán tử & độ ưu tiên, modulo, input(), chú thích.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Thực thi có điều kiện (CLO3)|||Chapter 3 — Conditional execution (CLO3)', description: 'Boolean, and/or/not, if/elif/else, điều kiện lồng, try/except, short-circuit.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Vòng lặp (CLO3)|||Chapter 4 — Iteration (CLO3)', description: 'while, vòng lặp vô hạn, continue/break, for, các mẫu vòng lặp.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Hàm (CLO3)|||Chapter 5 — Functions (CLO3)', description: 'Gọi hàm, hàm dựng sẵn, math/random, def, tham số & đối số, fruitful vs void.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Chuỗi (CLO4)|||Chapter 6 — Strings (CLO4)', description: 'Sequence, len, slice, immutable, in, so sánh, method, parsing, format.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Tệp (CLO5)|||Chapter 7 — Files (CLO5)', description: 'Persistence, open, đọc, tìm kiếm, ghi, try/except/open.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Danh sách (CLO6)|||Chapter 8 — Lists (CLO6)', description: 'Sequence, mutable, phép toán/slice/method, xoá phần tử, aliasing, truyền vào hàm.', lessons: [c8, c8q] },
    { title: 'Chương 9 — Từ điển (CLO6)|||Chapter 9 — Dictionaries (CLO6)', description: 'Dict làm bộ đếm, dict & tệp, duyệt, phân tích văn bản nâng cao.', lessons: [c9, c9q] },
    { title: 'Chương 10 — Tuple (CLO6)|||Chapter 10 — Tuples (CLO6)', description: 'Bất biến, so sánh, gán tuple (unpacking), dict & tuple.', lessons: [c10, c10q] },
    { title: 'Chương 11 — Lập trình hướng đối tượng (CLO7)|||Chapter 11 — OOP (CLO7)', description: 'Class & object, đóng gói/ẩn dữ liệu, trừu tượng, kế thừa, đa hình, vòng đời, design pattern.', lessons: [c11, c11q] },
  ],
};
