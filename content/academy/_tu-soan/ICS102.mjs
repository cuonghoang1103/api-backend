// Khoá TỰ SOẠN cho ICS102 — trường chưa công bố syllabus trên FLM (dò 09/11/2026). Soạn theo _HOP-DONG-TU-SOAN.md.
// Khung bám thứ tự giáo trình chuẩn: Bryant & O'Hallaron "Computer Systems: A Programmer's Perspective" 3e (CS:APP3e,
// Pearson, ISBN 978-0-13-409266-9) và khoá CMU 15-213; phần hệ điều hành đối chiếu OSTEP (Arpaci-Dusseau, v1.10).
// Mọi đoạn C/assembly đã chạy thật ngày 09/11/2026 trên Mac Apple M1 Max (Apple clang 21, arm64 + x86-64 qua Rosetta);
// assembly x86-64 sinh bằng clang -target x86_64-pc-linux-gnu -O1 -S (cú pháp AT&T, đúng kiểu CS:APP). Output dán nguyên văn.
// Mọi link ngoài đã mở thử (HTTP 200 + tiêu đề trang đúng chủ đề).
// ⚠️ File này KHÔNG dùng chuỗi nội suy (dấu đô-la + ngoặc nhọn) và không backtick lồng. Mã nguồn để trong String.raw
// rồi tự escape HTML lúc nạp (hàm code/out), nên không phải gõ tay &lt; &gt; &amp; trong code.

const bi = (en, vi) => '<div class="ml-en">' + en + '</div>\n<div class="ml-vi">' + vi + '</div>';
const L = (slug, title, description, en, vi) => ({ title, slug, type: 'DOCUMENT', description, content: bi(en, vi) });
const Q = (id, question, options, correctIndex, explanation) => ({ id, question, options, correctIndex, points: 1, explanation });
const QZ = (ch, title, description, questions) => ({
  title, slug: 'ics102-ts-quiz-' + ch, type: 'QUIZ', description,
  quiz: { timeLimitSeconds: 900, questions },
});
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const tidy = (s) => s.replace(/^\n+/, '').replace(/\s+$/, '');
const code = (lang, src) => '<pre><code class="language-' + lang + '">' + esc(tidy(src)) + '</code></pre>';
const C = (src) => code('c', src);
const ASM = (src) => code('text', src);
const SH = (src) => code('bash', src);
const out = (s) => '<div class="out">' + esc(tidy(s)) + '</div>';

// ───────────────────────────── Mục 0 ─────────────────────────────
const m01 = L('ics102-ts-0-1',
  '0.1 — Welcome to ICS102: how a computer really runs your program|||0.1 — Giới thiệu ICS102: máy tính thật sự chạy chương trình của bạn thế nào',
  'ICS102 học gì, để làm gì (debug, hiệu năng, bảo mật, đi làm backend/hệ thống), 8 chuẩn đầu ra tự soạn, môn liên quan, cảnh báo: trường chưa công bố syllabus trên FLM.',
  `<span class="eyebrow">ICS102 · Section 0 · Lesson 0.1</span>
<h2>Welcome to Introduction to Computer Systems</h2>
<p class="lead">You already write programs. This course opens the box underneath: how the bits of an <code>int</code> are laid out, what the compiler turns your C into, how the CPU executes it, why one loop is eight times faster than another, how a program is linked and loaded, and how the operating system juggles processes, memory, files and network connections. It is the course that turns “it works, I don't know why” into “I know exactly what the machine is doing”.</p>
<div class="callout"><p>⚠️ <strong>Important.</strong> FPT University has <strong>not published the ICS102 syllabus on FLM</strong> (we searched the code, its variants and the course name on 09/11/2026). This course framework is therefore <strong>self-authored</strong>, following the chapter order of the international standard textbook for this subject — Bryant &amp; O'Hallaron, <em>Computer Systems: A Programmer's Perspective</em> (CS:APP, 3rd ed.), the book written for Carnegie Mellon's course 15-213 “Introduction to Computer Systems”. <strong>Grading weights, assessment format and exam dates are decided by your lecturer</strong> — always follow the course outline your lecturer gives in class.</p></div>
<h3>What is this course about?</h3>
<p>Most computer-architecture courses look at the machine from the hardware designer's side. ICS102 takes the <strong>programmer's perspective</strong>: we study exactly those parts of hardware and operating system that change how you write, debug and speed up programs. Every chapter answers a practical question:</p>
<ul>
<li>Why does <code>0.1 + 0.2 == 0.3</code> print false, and why can <code>x + 1 &lt; x</code> be true?</li>
<li>What does <code>x = *p</code> look like in machine code, and what is a “stack frame”?</li>
<li>Why does sorting the data first make an <code>if</code> inside a loop four times faster?</li>
<li>Why is walking a 2-D array row by row much faster than column by column?</li>
<li>What does “undefined reference to …” from the linker really mean?</li>
<li>What happens when you press Ctrl+C, or when a program “segfaults”?</li>
<li>How can two programs both use address <code>0x400000</code> without clashing?</li>
<li>How does a web server talk to a browser, and why does a shared counter go wrong with two threads?</li>
</ul>
<h3>Why does a software / AI student need it?</h3>
<ul>
<li><strong>Debugging:</strong> crashes, memory corruption and “impossible” bugs only make sense once you know the stack, the heap and how values are encoded.</li>
<li><strong>Performance:</strong> caches, pipelines and memory layout often matter more than the big-O of the algorithm. Data-science and AI code (NumPy, PyTorch) is fast precisely because it respects these rules.</li>
<li><strong>Security:</strong> buffer overflows, integer overflows and use-after-free are still among the most exploited bugs. You cannot defend what you cannot see.</li>
<li><strong>Back-end &amp; DevOps work:</strong> processes, signals, file descriptors, sockets and threads are the vocabulary of servers, containers and cloud systems.</li>
<li><strong>Later courses:</strong> operating systems, networking, compilers, embedded systems and parallel programming all build on this one.</li>
</ul>
<h3>Learning outcomes (self-authored)</h3>
<p>After this course you should be able to:</p>
<ol>
<li>Explain how source code becomes a running process (preprocess, compile, assemble, link, load) and describe the hardware organisation of a computer.</li>
<li>Represent and manipulate data at the bit level: hexadecimal, byte order, unsigned and two's-complement integers, integer overflow and IEEE 754 floating point.</li>
<li>Read x86-64 assembly generated from C: data movement, arithmetic, condition codes, loops, switch statements, procedure calls and the run-time stack.</li>
<li>Explain how a processor executes instructions (sequential and pipelined), identify hazards, and use this to reason about program performance.</li>
<li>Describe the memory hierarchy and cache organisation, and write cache-friendly code.</li>
<li>Explain static and dynamic linking: symbols, relocation, static libraries and shared libraries.</li>
<li>Use exceptions, processes and signals: <code>fork</code>, <code>execve</code>, <code>waitpid</code>, signal handlers; explain virtual memory, page tables, TLBs and dynamic memory allocation.</li>
<li>Write simple programs with Unix I/O, sockets (client–server) and threads, and protect shared data with mutexes and condition variables.</li>
</ol>
<h3>Related courses on this site</h3>
<p>ICS102 sits in <strong>semester 1</strong>. It works best alongside <strong>PRF192</strong> (programming fundamentals in C — you need basic C: variables, loops, functions, arrays, pointers). Courses that go deeper into the topics opened here: <strong>CEA201</strong> (computer organisation and architecture), <strong>OSG202</strong> (operating systems) and <strong>NWC203c</strong> (computer networking). The exact position of these courses in your programme depends on your major — check your own curriculum.</p>
<h3>How to study this course</h3>
<ul>
<li>Every lesson has objectives, a lecture, real C/assembly that we compiled and ran (with the real output), common mistakes, a 📌 summary, 🔗 further learning and 🧪 practice with answers. Each chapter ends with a quiz.</li>
<li><strong>Type and run the examples yourself.</strong> Any Linux machine, WSL on Windows, or macOS with the command-line tools works: <code>gcc file.c -o prog &amp;&amp; ./prog</code>. To see assembly, use <code>gcc -O1 -S file.c</code> or the online Compiler Explorer.</li>
<li>Our outputs come from an Apple M1 Max (arm64). A Linux x86-64 machine gives the same results for everything that the C standard defines; where the platform matters (page size, signal numbers, file formats) the lesson says so.</li>
<li>Do the practice problems on paper first, then check the answer — exactly like CMU students do with the CS:APP “practice problems”.</li>
</ul>`,
  `<span class="eyebrow">ICS102 · Mục 0 · Bài 0.1</span>
<h2>Chào mừng đến với Nhập môn Hệ thống máy tính</h2>
<p class="lead">Bạn đã biết viết chương trình. Môn này mở chiếc hộp bên dưới: các bit của một biến <code>int</code> nằm thế nào, trình biên dịch biến mã C của bạn thành gì, CPU thực thi nó ra sao, vì sao vòng lặp này nhanh gấp tám lần vòng lặp kia, chương trình được liên kết và nạp thế nào, và hệ điều hành điều phối tiến trình, bộ nhớ, tệp, kết nối mạng ra sao. Đây là môn biến “chạy được mà không hiểu vì sao” thành “tôi biết chính xác máy đang làm gì”.</p>
<div class="callout"><p>⚠️ <strong>Lưu ý quan trọng.</strong> Trường <strong>chưa công bố syllabus của ICS102 trên FLM</strong> (đã dò mã môn, mã biến thể và tên môn ngày 09/11/2026). Vì vậy khung môn này là <strong>khung tự soạn</strong>, bám thứ tự chương của giáo trình chuẩn quốc tế cho đúng môn này — Bryant &amp; O'Hallaron, <em>Computer Systems: A Programmer's Perspective</em> (CS:APP, bản 3), cuốn sách viết cho chính môn 15-213 “Introduction to Computer Systems” của Đại học Carnegie Mellon. <strong>Cách tính điểm, hình thức đánh giá và lịch thi theo giảng viên</strong> — luôn theo đề cương giảng viên phát trên lớp.</p></div>
<h3>Môn này học gì?</h3>
<p>Phần lớn môn kiến trúc máy tính nhìn máy từ phía người thiết kế phần cứng. ICS102 đứng ở <strong>góc nhìn lập trình viên</strong>: ta học đúng những phần của phần cứng và hệ điều hành làm thay đổi cách bạn viết, gỡ lỗi và tăng tốc chương trình. Mỗi chương trả lời một câu hỏi thực tế:</p>
<ul>
<li>Vì sao <code>0.1 + 0.2 == 0.3</code> ra sai, và vì sao <code>x + 1 &lt; x</code> có thể đúng?</li>
<li><code>x = *p</code> trông thế nào trong mã máy, và “khung ngăn xếp” (stack frame) là gì?</li>
<li>Vì sao sắp xếp dữ liệu trước lại làm một lệnh <code>if</code> trong vòng lặp nhanh gấp bốn?</li>
<li>Vì sao duyệt mảng 2 chiều theo hàng nhanh hơn hẳn theo cột?</li>
<li>Lỗi “undefined reference to …” của bộ liên kết thật ra nghĩa là gì?</li>
<li>Chuyện gì xảy ra khi bạn bấm Ctrl+C, hay khi chương trình bị “segfault”?</li>
<li>Vì sao hai chương trình cùng dùng địa chỉ <code>0x400000</code> mà không đụng nhau?</li>
<li>Web server nói chuyện với trình duyệt thế nào, và vì sao một biến đếm dùng chung bị sai khi có hai luồng?</li>
</ul>
<h3>Sinh viên phần mềm / AI cần nó để làm gì?</h3>
<ul>
<li><strong>Gỡ lỗi:</strong> crash, hỏng bộ nhớ, lỗi “không thể xảy ra” chỉ hiểu được khi bạn biết ngăn xếp, heap và cách giá trị được mã hoá.</li>
<li><strong>Hiệu năng:</strong> cache, pipeline và cách sắp dữ liệu trong bộ nhớ nhiều khi quan trọng hơn cả big-O của thuật toán. Code khoa học dữ liệu và AI (NumPy, PyTorch) nhanh chính vì tôn trọng các quy luật này.</li>
<li><strong>Bảo mật:</strong> tràn bộ đệm, tràn số nguyên, dùng sau khi giải phóng vẫn là các lỗi bị khai thác nhiều nhất. Không nhìn thấy thì không phòng được.</li>
<li><strong>Đi làm back-end &amp; DevOps:</strong> tiến trình, tín hiệu, file descriptor, socket, luồng là ngôn ngữ hằng ngày của server, container và hệ thống cloud.</li>
<li><strong>Các môn sau:</strong> hệ điều hành, mạng, trình biên dịch, hệ nhúng, lập trình song song đều xây trên môn này.</li>
</ul>
<h3>Chuẩn đầu ra (tự soạn)</h3>
<p>Học xong môn, bạn cần làm được:</p>
<ol>
<li>Giải thích mã nguồn trở thành tiến trình đang chạy thế nào (tiền xử lý, biên dịch, hợp dịch, liên kết, nạp) và mô tả tổ chức phần cứng của máy tính.</li>
<li>Biểu diễn và thao tác dữ liệu ở mức bit: hệ 16, thứ tự byte, số nguyên không dấu và bù hai, tràn số, số thực dấu phẩy động IEEE 754.</li>
<li>Đọc được assembly x86-64 sinh ra từ C: di chuyển dữ liệu, số học, cờ điều kiện, vòng lặp, switch, gọi hàm và ngăn xếp lúc chạy.</li>
<li>Giải thích bộ xử lý thực thi lệnh thế nào (tuần tự và đường ống), nhận ra các xung đột (hazard), và dùng điều đó để suy luận về hiệu năng chương trình.</li>
<li>Mô tả phân cấp bộ nhớ và tổ chức cache, viết code thân thiện với cache.</li>
<li>Giải thích liên kết tĩnh và động: ký hiệu, định vị lại (relocation), thư viện tĩnh, thư viện dùng chung.</li>
<li>Dùng ngoại lệ, tiến trình và tín hiệu: <code>fork</code>, <code>execve</code>, <code>waitpid</code>, bộ xử lý tín hiệu; giải thích bộ nhớ ảo, bảng trang, TLB và cấp phát bộ nhớ động.</li>
<li>Viết chương trình đơn giản với Unix I/O, socket (client–server) và luồng, bảo vệ dữ liệu dùng chung bằng mutex và biến điều kiện.</li>
</ol>
<h3>Môn liên quan trên trang này</h3>
<p>ICS102 nằm ở <strong>kỳ 1</strong>. Nên học song song với <strong>PRF192</strong> (lập trình C cơ bản — bạn cần biết C căn bản: biến, vòng lặp, hàm, mảng, con trỏ). Các môn đi sâu hơn vào những chủ đề mở ra ở đây: <strong>CEA201</strong> (tổ chức và kiến trúc máy tính), <strong>OSG202</strong> (hệ điều hành) và <strong>NWC203c</strong> (mạng máy tính). Vị trí chính xác của các môn này tuỳ chuyên ngành — xem khung chương trình của bạn.</p>
<h3>Học môn này thế nào cho hiệu quả</h3>
<ul>
<li>Mỗi bài có mục tiêu, bài giảng, code C/assembly đã biên dịch và chạy thật (kèm output thật), lỗi hay gặp, 📌 tóm tắt, 🔗 học thêm và 🧪 tự luyện có đáp án. Cuối mỗi chương có quiz.</li>
<li><strong>Tự gõ và chạy lại ví dụ.</strong> Máy Linux, WSL trên Windows, hoặc macOS có command-line tools đều được: <code>gcc file.c -o prog &amp;&amp; ./prog</code>. Muốn xem assembly: <code>gcc -O1 -S file.c</code> hoặc Compiler Explorer trên mạng.</li>
<li>Output trong bài lấy từ máy Apple M1 Max (arm64). Máy Linux x86-64 cho cùng kết quả với mọi thứ chuẩn C quy định; chỗ nào phụ thuộc nền tảng (kích thước trang, số hiệu tín hiệu, định dạng tệp) bài sẽ nói rõ.</li>
<li>Làm bài tự luyện ra giấy trước rồi mới xem đáp án — đúng như sinh viên CMU làm với các “practice problem” của CS:APP.</li>
</ul>`);


const m02 = L('ics102-ts-0-2',
  '0.2 — Textbooks, open courses & tools (verified)|||0.2 — Giáo trình, khoá học mở & công cụ (đã kiểm)',
  'Giáo trình chính CS:APP 3e (ISBN đã kiểm trên trang CMU), Patterson & Hennessy RISC-V 2e, OSTEP v1.10 (miễn phí), K&R 2e; CMU 15-213, MIT OCW, CS61C, Nand2Tetris; công cụ gcc/clang, Compiler Explorer, gdb.',
  `<span class="eyebrow">ICS102 · Section 0 · Lesson 0.2</span>
<h2>Textbooks, open courses &amp; tools</h2>
<p class="lead">This course follows the chapter order of CS:APP. You do not have to buy anything to pass: every lesson here is self-contained, and the free resources below (OSTEP, CMU and MIT course pages, man pages) cover the same ground. If you buy or borrow one book, make it CS:APP.</p>
<h3>📘 Textbooks</h3>
<ol>
<li><strong>Randal E. Bryant, David R. O'Hallaron — <em>Computer Systems: A Programmer's Perspective</em>, 3rd edition (CS:APP3e).</strong> Pearson, © 2016. ISBN-13 978-0-13-409266-9 (ISBN-10 0-13-409266-X). <a href="https://csapp.cs.cmu.edu/3e/about.html" target="_blank" rel="noopener">Book page at CMU (ISBN, contents)</a>. <em>The</em> textbook for this subject; our chapters 1–10 follow its chapters 1–12. The CMU site also has the famous labs (Data Lab, Bomb Lab, Attack Lab, Cache Lab, Shell Lab, Malloc Lab, Proxy Lab).</li>
<li><strong>David A. Patterson, John L. Hennessy — <em>Computer Organization and Design: The Hardware/Software Interface, RISC-V Edition</em>, 2nd edition.</strong> Morgan Kaufmann (Elsevier), 2020 (published 11 Dec 2020). ISBN 978-0-12-820331-6. <a href="https://shop.elsevier.com/books/computer-organization-and-design-risc-v-edition/patterson/978-0-12-820331-6" target="_blank" rel="noopener">Publisher page</a>. The hardware side: datapath, pipelining and caches explained by the inventors of RISC. Use it with chapters 5–6.</li>
<li><strong>Remzi H. Arpaci-Dusseau, Andrea C. Arpaci-Dusseau — <em>Operating Systems: Three Easy Pieces</em> (OSTEP), version 1.10 (November 2023).</strong> Arpaci-Dusseau Books; <strong>free online</strong>. <a href="https://pages.cs.wisc.edu/~remzi/OSTEP/" target="_blank" rel="noopener">Read free online</a>. Excellent, friendly chapters on processes, virtual memory, threads and locks — use it with chapters 8–10.</li>
<li><strong>Brian W. Kernighan, Dennis M. Ritchie — <em>The C Programming Language</em>, 2nd edition.</strong> Prentice Hall, 1988. ISBN-13 978-0-13-110362-7 (ISBN-10 0-13-110362-8). <a href="https://www.informit.com/store/c-programming-language-9780131103627" target="_blank" rel="noopener">Publisher page</a>. The short classic for the C you need in this course.</li>
</ol>
<h3>🎓 Open courses</h3>
<ul>
<li><a href="https://www.cs.cmu.edu/~213/" target="_blank" rel="noopener">CMU 15-213/15-513 — Introduction to Computer Systems</a> (the course CS:APP was written for) and its <a href="https://www.cs.cmu.edu/~213/schedule.html" target="_blank" rel="noopener">schedule with lecture slides</a>.</li>
<li><a href="https://csapp.cs.cmu.edu/3e/labs.html" target="_blank" rel="noopener">CS:APP lab assignments (free to download for self-study)</a> and <a href="https://csapp.cs.cmu.edu/3e/waside.html" target="_blank" rel="noopener">CS:APP web asides</a>.</li>
<li><a href="https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/" target="_blank" rel="noopener">MIT OpenCourseWare 6.004 — Computation Structures</a>: from logic gates to a pipelined processor and caches.</li>
<li><a href="https://ocw.mit.edu/courses/6-172-performance-engineering-of-software-systems-fall-2018/" target="_blank" rel="noopener">MIT OpenCourseWare 6.172 — Performance Engineering of Software Systems</a>: for chapters 5–6.</li>
<li><a href="https://cs61c.org/" target="_blank" rel="noopener">UC Berkeley CS61C — Great Ideas in Computer Architecture</a>: C, RISC-V assembly, caches, parallelism.</li>
<li><a href="https://www.nand2tetris.org/" target="_blank" rel="noopener">Nand2Tetris</a> and its <a href="https://www.coursera.org/learn/build-a-computer" target="_blank" rel="noopener">Coursera course “Build a Modern Computer from First Principles”</a>: build a computer from NAND gates.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><strong>A C compiler:</strong> <code>gcc</code> or <code>clang</code> on Linux / WSL / macOS. Useful flags: <code>-O1 -S</code> (show assembly), <code>-g</code> (debug info), <code>-Wall</code> (warnings), <code>-fsanitize=address</code> (catch memory bugs).</li>
<li><a href="https://godbolt.org/" target="_blank" rel="noopener">Compiler Explorer (godbolt.org)</a> — type C on the left, see x86-64 or ARM assembly on the right, live.</li>
<li><a href="https://pythontutor.com/c.html" target="_blank" rel="noopener">C Tutor</a> — step through C and watch the stack, heap and pointers.</li>
<li><a href="https://float.exposed/" target="_blank" rel="noopener">float.exposed</a> — see the sign, exponent and fraction bits of any float or double.</li>
<li><strong>gdb / lldb</strong> (debuggers), <strong>objdump</strong> (disassemble), <strong>nm</strong> (list symbols), <strong>valgrind</strong> (memory checker on Linux).</li>
<li><a href="https://man7.org/linux/man-pages/man2/syscalls.2.html" target="_blank" rel="noopener">Linux man pages (man7.org)</a> — the official reference for every system call used in chapters 8–10.</li>
</ul>
<h3>🗺️ Course map (CS:APP chapter in brackets)</h3>
<ol>
<li>A tour of computer systems [1]</li>
<li>Representing and manipulating information: bits, integers, floating point [2]</li>
<li>Machine-level programs I: basics, data movement, arithmetic [3.1–3.5]</li>
<li>Machine-level programs II: control, procedures, data, buffer overflow [3.6–3.10]</li>
<li>Processor architecture and program performance [4–5]</li>
<li>The memory hierarchy and caches [6]</li>
<li>Linking [7]</li>
<li>Exceptional control flow: exceptions, processes, signals [8]</li>
<li>Virtual memory and dynamic memory allocation [9]</li>
<li>System I/O, network programming and concurrency [10–12]</li>
</ol>
<div class="meo"><p><strong>Study plan.</strong> For each lesson: read the lesson → run every code example yourself → read the matching CS:APP section (or the OSTEP chapter) → do the 🧪 practice → take the chapter quiz. About 6–8 hours per chapter. If you want a real challenge, try the CS:APP Data Lab after chapter 2 and the Bomb Lab after chapter 4.</p></div>`,
  `<span class="eyebrow">ICS102 · Mục 0 · Bài 0.2</span>
<h2>Giáo trình, khoá học mở &amp; công cụ</h2>
<p class="lead">Khoá này bám thứ tự chương của CS:APP. Bạn không bắt buộc phải mua sách: mỗi bài ở đây tự đủ, và các nguồn miễn phí dưới đây (OSTEP, trang môn của CMU và MIT, man page) phủ cùng nội dung. Nếu mua hay mượn một cuốn, hãy chọn CS:APP.</p>
<h3>📘 Giáo trình</h3>
<ol>
<li><strong>Randal E. Bryant, David R. O'Hallaron — <em>Computer Systems: A Programmer's Perspective</em>, bản 3 (CS:APP3e).</strong> Pearson, © 2016. ISBN-13 978-0-13-409266-9 (ISBN-10 0-13-409266-X). <a href="https://csapp.cs.cmu.edu/3e/about.html" target="_blank" rel="noopener">Trang sách ở CMU (ISBN, mục lục)</a>. Giáo trình <em>chuẩn</em> của môn này; chương 1–10 của khoá bám chương 1–12 của sách. Trang CMU còn có các bài lab nổi tiếng (Data Lab, Bomb Lab, Attack Lab, Cache Lab, Shell Lab, Malloc Lab, Proxy Lab).</li>
<li><strong>David A. Patterson, John L. Hennessy — <em>Computer Organization and Design: The Hardware/Software Interface, RISC-V Edition</em>, bản 2.</strong> Morgan Kaufmann (Elsevier), 2020 (phát hành 11/12/2020). ISBN 978-0-12-820331-6. <a href="https://shop.elsevier.com/books/computer-organization-and-design-risc-v-edition/patterson/978-0-12-820331-6" target="_blank" rel="noopener">Trang nhà xuất bản</a>. Phía phần cứng: đường dữ liệu, đường ống, cache do chính cha đẻ RISC giảng. Dùng kèm chương 5–6.</li>
<li><strong>Remzi H. Arpaci-Dusseau, Andrea C. Arpaci-Dusseau — <em>Operating Systems: Three Easy Pieces</em> (OSTEP), phiên bản 1.10 (11/2023).</strong> Arpaci-Dusseau Books; <strong>đọc miễn phí</strong>. <a href="https://pages.cs.wisc.edu/~remzi/OSTEP/" target="_blank" rel="noopener">Đọc miễn phí</a>. Các chương về tiến trình, bộ nhớ ảo, luồng, khoá viết rất dễ hiểu — dùng kèm chương 8–10.</li>
<li><strong>Brian W. Kernighan, Dennis M. Ritchie — <em>The C Programming Language</em>, bản 2.</strong> Prentice Hall, 1988. ISBN-13 978-0-13-110362-7 (ISBN-10 0-13-110362-8). <a href="https://www.informit.com/store/c-programming-language-9780131103627" target="_blank" rel="noopener">Trang nhà xuất bản</a>. Cuốn kinh điển ngắn gọn cho phần C bạn cần trong môn.</li>
</ol>
<h3>🎓 Khoá học mở</h3>
<ul>
<li><a href="https://www.cs.cmu.edu/~213/" target="_blank" rel="noopener">CMU 15-213/15-513 — Introduction to Computer Systems</a> (môn mà CS:APP được viết cho) và <a href="https://www.cs.cmu.edu/~213/schedule.html" target="_blank" rel="noopener">lịch học kèm slide bài giảng</a>.</li>
<li><a href="https://csapp.cs.cmu.edu/3e/labs.html" target="_blank" rel="noopener">Các bài lab CS:APP (tải miễn phí để tự học)</a> và <a href="https://csapp.cs.cmu.edu/3e/waside.html" target="_blank" rel="noopener">các phần bổ sung trên web của CS:APP</a>.</li>
<li><a href="https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/" target="_blank" rel="noopener">MIT OpenCourseWare 6.004 — Computation Structures</a>: từ cổng logic tới bộ xử lý đường ống và cache.</li>
<li><a href="https://ocw.mit.edu/courses/6-172-performance-engineering-of-software-systems-fall-2018/" target="_blank" rel="noopener">MIT OpenCourseWare 6.172 — Kỹ thuật hiệu năng phần mềm</a>: dùng cho chương 5–6.</li>
<li><a href="https://cs61c.org/" target="_blank" rel="noopener">UC Berkeley CS61C — Great Ideas in Computer Architecture</a>: C, assembly RISC-V, cache, song song.</li>
<li><a href="https://www.nand2tetris.org/" target="_blank" rel="noopener">Nand2Tetris</a> và <a href="https://www.coursera.org/learn/build-a-computer" target="_blank" rel="noopener">khoá Coursera “Build a Modern Computer from First Principles”</a>: tự dựng máy tính từ cổng NAND.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><strong>Trình biên dịch C:</strong> <code>gcc</code> hoặc <code>clang</code> trên Linux / WSL / macOS. Cờ hay dùng: <code>-O1 -S</code> (xem assembly), <code>-g</code> (thông tin gỡ lỗi), <code>-Wall</code> (cảnh báo), <code>-fsanitize=address</code> (bắt lỗi bộ nhớ).</li>
<li><a href="https://godbolt.org/" target="_blank" rel="noopener">Compiler Explorer (godbolt.org)</a> — gõ C bên trái, thấy ngay assembly x86-64 hoặc ARM bên phải.</li>
<li><a href="https://pythontutor.com/c.html" target="_blank" rel="noopener">C Tutor</a> — chạy từng bước code C, nhìn ngăn xếp, heap và con trỏ.</li>
<li><a href="https://float.exposed/" target="_blank" rel="noopener">float.exposed</a> — xem bit dấu, số mũ, phần định trị của bất kỳ số float/double nào.</li>
<li><strong>gdb / lldb</strong> (gỡ lỗi), <strong>objdump</strong> (dịch ngược mã máy), <strong>nm</strong> (liệt kê ký hiệu), <strong>valgrind</strong> (kiểm bộ nhớ trên Linux).</li>
<li><a href="https://man7.org/linux/man-pages/man2/syscalls.2.html" target="_blank" rel="noopener">Man page Linux (man7.org)</a> — tài liệu chính thức cho mọi lời gọi hệ thống dùng ở chương 8–10.</li>
</ul>
<h3>🗺️ Bản đồ môn học (chương CS:APP trong ngoặc)</h3>
<ol>
<li>Dạo một vòng hệ thống máy tính [1]</li>
<li>Biểu diễn và thao tác thông tin: bit, số nguyên, số thực [2]</li>
<li>Chương trình mức máy I: cơ bản, di chuyển dữ liệu, số học [3.1–3.5]</li>
<li>Chương trình mức máy II: điều khiển, thủ tục, dữ liệu, tràn bộ đệm [3.6–3.10]</li>
<li>Kiến trúc bộ xử lý và hiệu năng chương trình [4–5]</li>
<li>Phân cấp bộ nhớ và cache [6]</li>
<li>Liên kết [7]</li>
<li>Luồng điều khiển ngoại lệ: ngoại lệ, tiến trình, tín hiệu [8]</li>
<li>Bộ nhớ ảo và cấp phát bộ nhớ động [9]</li>
<li>Vào/ra hệ thống, lập trình mạng và đồng thời [10–12]</li>
</ol>
<div class="meo"><p><strong>Kế hoạch học.</strong> Mỗi bài: đọc bài → tự chạy mọi ví dụ code → đọc mục CS:APP tương ứng (hoặc chương OSTEP) → làm 🧪 tự luyện → làm quiz chương. Khoảng 6–8 giờ mỗi chương. Muốn thử thách thật: làm Data Lab của CS:APP sau chương 2 và Bomb Lab sau chương 4.</p></div>`);

const muc0 = {
  title: 'Section 0 — Course framework (self-authored, no FLM syllabus)|||Mục 0 — Khung môn học (tự soạn, trường chưa công bố syllabus)',
  description: 'Giới thiệu môn, chuẩn đầu ra tự soạn, giáo trình chuẩn (CS:APP 3e) có ISBN đã kiểm, khoá học mở, công cụ, bản đồ 10 chương. Trường chưa công bố syllabus ICS102 trên FLM.',
  lessons: [m01, m02],
};

// ───────────────────────────── Chương 1 — Dạo một vòng hệ thống ─────────────────────────────
const SRC_HELLO = String.raw`
#include <stdio.h>
int main(void) { printf("hello, world\n"); return 0; }
`;
const SH_HELLO = String.raw`
$ cc -E hello.c | wc -l          # 1. preprocess: #include pasted in
     568
$ cc -S hello.c -o hello.s       # 2. compile to assembly
$ wc -l hello.s
      30 hello.s
$ cc -c hello.c -o hello.o       # 3. assemble to a relocatable object file
$ file hello.o
hello.o: Mach-O 64-bit object arm64
$ nm hello.o                     # symbols: main defined (T), printf undefined (U)
0000000000000000 T _main
                 U _printf
$ cc hello.o -o hello            # 4. link with the C library
$ ./hello
hello, world
`;
const ASM_HELLO = String.raw`
main:                         # clang -target x86_64-pc-linux-gnu -O1 -S
	pushq	%rax
	movl	$.Lstr, %edi          # argument 1 = address of the string
	callq	puts@PLT              # printf("...\n") was turned into puts("...")
	xorl	%eax, %eax            # return 0
	popq	%rcx
	retq
.Lstr:
	.asciz	"hello, world"
`;

const c11 = L('ics102-ts-1-1',
  '1.1 — Information is bits + context; from hello.c to an executable|||1.1 — Thông tin là bit + ngữ cảnh; từ hello.c tới tệp thực thi',
  'Mọi thứ trong máy là bit, ý nghĩa do ngữ cảnh; bốn pha của hệ thống biên dịch (tiền xử lý, biên dịch, hợp dịch, liên kết) chạy thật trên hello.c; vì sao lập trình viên cần hiểu trình biên dịch.',
  `<span class="eyebrow">ICS102 · Chapter 1 · Lesson 1.1</span>
<h2>Information is bits + context; from hello.c to an executable</h2>
<p class="lead">CS:APP begins with the smallest program in the world, <code>hello.c</code>, and follows it all the way through the system. In this lesson we do the first half of that trip: what the program <em>is</em> inside the machine, and how the compiler toolchain turns it into something the CPU can run.</p>
<h3>🎯 Objectives</h3>
<ul><li>Explain why “information = bits + context”.</li><li>Name the four phases of the compilation system and the file each produces.</li><li>Run each phase yourself and inspect the result.</li><li>Give three reasons a programmer should understand how compilation works.</li></ul>
<h3>📖 Lecture</h3>
<h4>Bits + context</h4>
<p>The source file <code>hello.c</code> is just a sequence of bytes. Each byte holds a number from 0 to 255; in a text file each number is the ASCII code of a character: <code>#</code> is 35, <code>i</code> is 105, the newline is 10. The very same bytes could be read as integers, as a floating-point number, as a machine instruction or as a pixel colour. <strong>Nothing in the bytes says which</strong> — the meaning comes from the context in which a program reads them. This is the first big idea of the course, and it explains many bugs: printing a <code>float</code> with <code>%d</code>, reading past the end of a string, or treating a pointer as an integer all reinterpret the same bits in the wrong context.</p>
<h4>The compilation system</h4>
<p>One command, <code>gcc hello.c -o hello</code>, actually runs four programs in a pipeline:</p>
<div class="formula"><span class="lbl">Compilation pipeline</span>hello.c → <b>preprocessor</b> (cpp) → hello.i → <b>compiler</b> (cc1) → hello.s → <b>assembler</b> (as) → hello.o → <b>linker</b> (ld) + printf.o → hello</div>
<ol>
<li><strong>Preprocessing</strong> handles lines that start with <code>#</code>. <code>#include &lt;stdio.h&gt;</code> literally pastes the header file in, so the two-line program becomes hundreds of lines.</li>
<li><strong>Compilation</strong> translates C into <strong>assembly language</strong>, a human-readable text form of machine instructions. Assembly is the common output of compilers for many languages.</li>
<li><strong>Assembly</strong> encodes each instruction as bytes and writes a <strong>relocatable object file</strong> (<code>hello.o</code>). It is binary, but not yet runnable: the address of <code>printf</code> is still unknown.</li>
<li><strong>Linking</strong> merges <code>hello.o</code> with the pre-compiled <code>printf</code> from the C standard library and produces the <strong>executable object file</strong> <code>hello</code>, ready to be loaded into memory.</li>
</ol>
<h3>✍️ Worked example — run every phase yourself</h3>
` + C(SRC_HELLO) + `
<p>We ran each phase separately on our Mac (Apple clang, arm64). Real output:</p>
` + out(SH_HELLO) + `
<p>Notice: the preprocessed file has 568 lines; in the object file <code>main</code> is <strong>defined</strong> (T = text/code) while <code>printf</code> is <strong>undefined</strong> (U) — the linker must find it. On Linux the object format is ELF instead of Mach-O and symbol names have no leading underscore, but the four phases are identical.</p>
<p>And this is the x86-64 assembly for <code>main</code> (the instruction set used in CS:APP and in this course):</p>
` + ASM(ASM_HELLO) + `
<p>Even this tiny example shows why programmers should know the compiler: the optimiser replaced <code>printf</code> with the simpler <code>puts</code> because the string had no format codes and ended in a newline.</p>
<h3>Why understand compilation?</h3>
<ul>
<li><strong>Optimising performance:</strong> is a <code>switch</code> faster than a chain of <code>if</code>s? Is a loop that uses a pointer faster than one that uses an index? Chapters 3–5 answer by reading the generated code.</li>
<li><strong>Understanding link-time errors:</strong> “undefined reference”, “multiple definition”, static vs dynamic libraries — chapter 7.</li>
<li><strong>Avoiding security holes:</strong> buffer overflows exploit the way the stack is laid out — chapter 4.</li>
</ul>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Thinking a <code>.o</code> file is runnable — it still has unresolved references.</li><li>Thinking the computer “knows” a byte is text or a number — only the program's interpretation decides.</li><li>Confusing compile errors (syntax/type, from the compiler) with link errors (missing or duplicate symbols, from the linker).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>All data in a computer is bits; the meaning comes from context.</li><li><code>gcc</code> runs preprocessor → compiler → assembler → linker.</li><li>Outputs: <code>.i</code> (text), <code>.s</code> (assembly text), <code>.o</code> (relocatable binary), executable.</li><li>Reading compiler output explains performance, link errors and security bugs.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://csapp.cs.cmu.edu/3e/home.html" target="_blank" rel="noopener">CS:APP3e home page — Chapter 1 “A Tour of Computer Systems”</a></li><li><a href="https://godbolt.org/" target="_blank" rel="noopener">Compiler Explorer — paste hello.c and compare gcc/clang output</a></li><li><a href="https://en.wikipedia.org/wiki/Compiler" target="_blank" rel="noopener">Wikipedia — Compiler (phases and structure)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Which phase turns <code>#define N 10</code> into the number 10 inside the code?</li><li>The bytes <code>48 69</code> (hex) are printed as text. What appears? (ASCII: 0x48 = 'H', 0x69 = 'i'.) What would they be as a 16-bit little-endian integer?</li><li>You compile <code>gcc -c main.c</code> and get no error, but <code>gcc main.o -o main</code> says “undefined reference to ‘area’”. Which phase complained and why?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) The preprocessor (macro expansion). 2) “Hi”; as a little-endian 16-bit integer the value is 0x6948 = 26952 — same bits, different context. 3) The linker: <code>main.o</code> calls <code>area</code>, but no object file or library given to the linker defines it.</p></div>`,
  `<span class="eyebrow">ICS102 · Chương 1 · Bài 1.1</span>
<h2>Thông tin là bit + ngữ cảnh; từ hello.c tới tệp thực thi</h2>
<p class="lead">CS:APP mở đầu bằng chương trình nhỏ nhất thế giới, <code>hello.c</code>, rồi đi theo nó xuyên suốt hệ thống. Bài này đi nửa đầu chặng đường: chương trình <em>là gì</em> bên trong máy, và bộ công cụ biên dịch biến nó thành thứ CPU chạy được ra sao.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Giải thích vì sao “thông tin = bit + ngữ cảnh”.</li><li>Kể tên bốn pha của hệ thống biên dịch và tệp mỗi pha sinh ra.</li><li>Tự chạy từng pha và xem kết quả.</li><li>Nêu ba lý do lập trình viên nên hiểu quá trình biên dịch.</li></ul>
<h3>📖 Bài giảng</h3>
<h4>Bit + ngữ cảnh</h4>
<p>Tệp nguồn <code>hello.c</code> chỉ là một dãy byte. Mỗi byte chứa một số từ 0 đến 255; trong tệp văn bản, mỗi số là mã ASCII của một ký tự: <code>#</code> là 35, <code>i</code> là 105, xuống dòng là 10. Chính những byte đó có thể được đọc thành số nguyên, số thực, lệnh máy hay màu điểm ảnh. <strong>Bản thân các byte không nói chúng là gì</strong> — ý nghĩa đến từ ngữ cảnh mà chương trình đọc chúng. Đây là ý lớn đầu tiên của môn, và nó giải thích nhiều lỗi: in <code>float</code> bằng <code>%d</code>, đọc quá cuối chuỗi, coi con trỏ như số nguyên — tất cả đều là diễn giải cùng các bit trong sai ngữ cảnh.</p>
<h4>Hệ thống biên dịch</h4>
<p>Một lệnh <code>gcc hello.c -o hello</code> thật ra chạy bốn chương trình nối đuôi nhau:</p>
<div class="formula"><span class="lbl">Dây chuyền biên dịch</span>hello.c → <b>bộ tiền xử lý</b> (cpp) → hello.i → <b>trình biên dịch</b> (cc1) → hello.s → <b>trình hợp dịch</b> (as) → hello.o → <b>bộ liên kết</b> (ld) + printf.o → hello</div>
<ol>
<li><strong>Tiền xử lý</strong> xử lý các dòng bắt đầu bằng <code>#</code>. <code>#include &lt;stdio.h&gt;</code> dán nguyên văn tệp header vào, nên chương trình hai dòng thành hàng trăm dòng.</li>
<li><strong>Biên dịch</strong> dịch C sang <strong>hợp ngữ (assembly)</strong> — dạng văn bản người đọc được của lệnh máy. Assembly là đầu ra chung của trình biên dịch cho nhiều ngôn ngữ.</li>
<li><strong>Hợp dịch</strong> mã hoá từng lệnh thành byte, ghi ra <strong>tệp đối tượng khả định vị</strong> (<code>hello.o</code>). Nó là nhị phân nhưng chưa chạy được: địa chỉ của <code>printf</code> vẫn chưa biết.</li>
<li><strong>Liên kết</strong> ghép <code>hello.o</code> với <code>printf</code> đã biên dịch sẵn trong thư viện chuẩn C, tạo ra <strong>tệp đối tượng thực thi</strong> <code>hello</code>, sẵn sàng nạp vào bộ nhớ.</li>
</ol>
<h3>✍️ Ví dụ — tự chạy từng pha</h3>
` + C(SRC_HELLO) + `
<p>Chúng tôi chạy riêng từng pha trên máy Mac (Apple clang, arm64). Output thật:</p>
` + out(SH_HELLO) + `
<p>Để ý: tệp sau tiền xử lý dài 568 dòng; trong tệp đối tượng, <code>main</code> đã <strong>được định nghĩa</strong> (T = text/mã) còn <code>printf</code> <strong>chưa được định nghĩa</strong> (U) — bộ liên kết phải đi tìm. Trên Linux định dạng tệp là ELF thay vì Mach-O và tên ký hiệu không có dấu gạch dưới đầu, nhưng bốn pha giống hệt.</p>
<p>Còn đây là assembly x86-64 của <code>main</code> (tập lệnh dùng trong CS:APP và trong môn này):</p>
` + ASM(ASM_HELLO) + `
<p>Ví dụ tí hon này đã cho thấy vì sao lập trình viên nên hiểu trình biên dịch: bộ tối ưu thay <code>printf</code> bằng <code>puts</code> đơn giản hơn, vì chuỗi không có mã định dạng và kết thúc bằng xuống dòng.</p>
<h3>Vì sao cần hiểu biên dịch?</h3>
<ul>
<li><strong>Tối ưu hiệu năng:</strong> <code>switch</code> có nhanh hơn chuỗi <code>if</code>? Vòng lặp dùng con trỏ có nhanh hơn dùng chỉ số? Chương 3–5 trả lời bằng cách đọc mã sinh ra.</li>
<li><strong>Hiểu lỗi liên kết:</strong> “undefined reference”, “multiple definition”, thư viện tĩnh hay động — chương 7.</li>
<li><strong>Tránh lỗ hổng bảo mật:</strong> tràn bộ đệm khai thác cách sắp xếp ngăn xếp — chương 4.</li>
</ul>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Tưởng tệp <code>.o</code> chạy được — nó vẫn còn tham chiếu chưa giải quyết.</li><li>Tưởng máy tính “biết” một byte là chữ hay số — chỉ cách chương trình diễn giải mới quyết định.</li><li>Lẫn lỗi biên dịch (cú pháp/kiểu, do trình biên dịch báo) với lỗi liên kết (thiếu hoặc trùng ký hiệu, do bộ liên kết báo).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Mọi dữ liệu trong máy là bit; ý nghĩa đến từ ngữ cảnh.</li><li><code>gcc</code> chạy tiền xử lý → biên dịch → hợp dịch → liên kết.</li><li>Sản phẩm: <code>.i</code> (văn bản), <code>.s</code> (assembly), <code>.o</code> (nhị phân khả định vị), tệp thực thi.</li><li>Đọc mã do trình biên dịch sinh ra giúp hiểu hiệu năng, lỗi liên kết và lỗi bảo mật.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://csapp.cs.cmu.edu/3e/home.html" target="_blank" rel="noopener">Trang CS:APP3e — Chương 1 “A Tour of Computer Systems”</a></li><li><a href="https://godbolt.org/" target="_blank" rel="noopener">Compiler Explorer — dán hello.c và so sánh gcc/clang</a></li><li><a href="https://en.wikipedia.org/wiki/Compiler" target="_blank" rel="noopener">Wikipedia — Compiler (các pha và cấu trúc)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Pha nào biến <code>#define N 10</code> thành số 10 trong code?</li><li>Hai byte <code>48 69</code> (hex) được in ra như văn bản. Ta thấy gì? (ASCII: 0x48 = 'H', 0x69 = 'i'.) Nếu đọc như số nguyên 16 bit little-endian thì bằng bao nhiêu?</li><li>Bạn chạy <code>gcc -c main.c</code> không lỗi, nhưng <code>gcc main.o -o main</code> báo “undefined reference to ‘area’”. Pha nào báo lỗi, vì sao?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Bộ tiền xử lý (khai triển macro). 2) “Hi”; đọc như số nguyên 16 bit little-endian thì giá trị là 0x6948 = 26952 — cùng bit, khác ngữ cảnh. 3) Bộ liên kết: <code>main.o</code> gọi <code>area</code> nhưng không tệp đối tượng hay thư viện nào đưa cho bộ liên kết định nghĩa nó.</p></div>`);

const OUT_SYSCTL = String.raw`
$ sysctl -n machdep.cpu.brand_string hw.l1dcachesize hw.l2cachesize hw.cachelinesize hw.pagesize
Apple M1 Max
65536
4194304
128
16384
`;

const c12 = L('ics102-ts-1-2',
  '1.2 — Hardware organisation and how a program runs|||1.2 — Tổ chức phần cứng và chương trình chạy thế nào',
  'Bus, thiết bị vào/ra, bộ nhớ chính, CPU (PC, tệp thanh ghi, ALU); các bước chạy ./hello; vì sao cache quan trọng; tháp phân cấp lưu trữ với số đo thật của máy M1 Max.',
  `<span class="eyebrow">ICS102 · Chapter 1 · Lesson 1.2</span>
<h2>Hardware organisation and how a program runs</h2>
<p class="lead">You type <code>./hello</code> and press Enter. A few microseconds later “hello, world” appears. This lesson follows the bytes through the hardware, and discovers the single most important fact for performance: <strong>a processor spends most of its effort moving data, not computing</strong>.</p>
<h3>🎯 Objectives</h3>
<ul><li>Name the main hardware components: buses, I/O devices, main memory, CPU.</li><li>Describe what the program counter, register file and ALU do.</li><li>Trace the steps of running <code>./hello</code>.</li><li>Explain why caches exist and describe the storage hierarchy.</li></ul>
<h3>📖 Lecture</h3>
<h4>The components</h4>
<ul>
<li><strong>Buses</strong> carry fixed-size chunks of bytes called <strong>words</strong> between components. Today the word size is usually 8 bytes (64 bits).</li>
<li><strong>I/O devices</strong> (keyboard, display, disk/SSD, network card) connect to the I/O bus through <strong>controllers</strong> or <strong>adapters</strong>.</li>
<li><strong>Main memory</strong> (DRAM) is a large array of bytes, each with a unique <strong>address</strong> starting from 0. It holds both the program and its data while the program runs.</li>
<li><strong>The CPU</strong> executes instructions stored in memory. Its core is a word-sized register called the <strong>program counter (PC)</strong>, which holds the address of the next instruction. It also has a <strong>register file</strong> (a small set of fast named registers) and an <strong>ALU</strong> (arithmetic/logic unit).</li>
</ul>
<p>The processor repeats one loop forever: read the instruction at address PC, interpret its bits, perform the simple operation it says (load a word from memory into a register, store a register to memory, operate on two registers in the ALU, or jump), then update PC. The <strong>instruction set architecture (ISA)</strong> defines what each instruction does; the <strong>microarchitecture</strong> is how a particular chip implements it — chapter 5.</p>
<h4>Running hello, step by step</h4>
<ol>
<li>The shell reads the characters <code>./hello</code> from the keyboard into a register and then into memory.</li>
<li>When you press Enter, the shell asks the OS to load the executable: its code and data are copied from disk into main memory (with DMA, the bytes go directly from disk to memory without passing through the CPU).</li>
<li>The CPU starts executing <code>main</code>. The instructions copy the bytes of “hello, world\\n” from memory to registers and from there to the display device.</li>
</ol>
<h4>Caches matter</h4>
<p>In that trip the same bytes were copied many times: disk → memory → registers → display. Copying is overhead. The trouble is that bigger storage is slower: a register can be read in well under a nanosecond, DRAM takes on the order of a hundred nanoseconds, a disk read takes milliseconds. To hide the gap, processors place small fast <strong>cache memories</strong> (L1, L2, L3, built from SRAM) between the registers and DRAM. A program that reuses nearby data finds it in a cache most of the time — this is <strong>locality</strong>, and chapter 6 shows how to exploit it.</p>
<div class="formula"><span class="lbl">The storage hierarchy (top = small, fast, expensive per byte)</span>L0: registers → L1 cache (SRAM) → L2 cache (SRAM) → L3 cache (SRAM) → L4: main memory (DRAM) → L5: local secondary storage (SSD/disk) → L6: remote storage (network, cloud)</div>
<p>The key idea: <strong>each level is a cache for the level below it</strong>. Registers cache L1, L1 caches L2, …, main memory caches the disk, and the local disk caches files from a remote server.</p>
<h3>✍️ Worked example — measure your own machine</h3>
<p>On macOS the system reports its cache parameters through <code>sysctl</code> (on Linux use <code>lscpu</code> or <code>getconf -a | grep CACHE</code>). Real output on our machine:</p>
` + out(OUT_SYSCTL) + `
<p>Reading it: a 64 KiB L1 data cache (as reported by this query), a 4 MiB L2 cache, 128-byte cache lines (memory is moved between cache and DRAM in blocks of 128 bytes on this chip; most x86 chips use 64), and 16 KiB virtual-memory pages (x86-64 Linux uses 4 KiB). Keep these numbers: we will use them in chapters 6 and 9.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Thinking the CPU computes directly on memory or disk — data must travel up the hierarchy first.</li><li>Confusing <em>word size</em> (bits per register/pointer) with the size of an <code>int</code> (still 4 bytes on 64-bit machines).</li><li>Assuming “more GB of RAM” makes every program faster — most programs are limited by cache behaviour, not RAM size.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>A computer = CPU + main memory + I/O devices, connected by buses.</li><li>The CPU repeatedly fetches the instruction at PC, executes it and updates PC.</li><li>Moving data is the main cost; caches exploit locality to hide slow memory.</li><li>The storage hierarchy: each level caches the level below.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Memory_hierarchy" target="_blank" rel="noopener">Wikipedia — Memory hierarchy</a></li><li><a href="https://pages.cs.wisc.edu/~remzi/OSTEP/" target="_blank" rel="noopener">OSTEP — Introduction chapter (free)</a></li><li><a href="https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/" target="_blank" rel="noopener">MIT 6.004 — Computation Structures</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>What does the program counter hold after the CPU finishes a (non-jump) instruction that is 3 bytes long and starts at address 0x400?</li><li>Put in order from fastest to slowest: SSD, L1 cache, register, DRAM, L3 cache.</li><li>Why does the OS copy <code>hello</code> from disk into memory instead of letting the CPU run it straight from the disk?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 0x403 — the address of the next instruction. 2) Register, L1, L3, DRAM, SSD. 3) The CPU can only fetch instructions from memory addresses, and disk is roughly 100 000 times slower than DRAM; memory acts as a cache for the disk.</p></div>`,
  `<span class="eyebrow">ICS102 · Chương 1 · Bài 1.2</span>
<h2>Tổ chức phần cứng và chương trình chạy thế nào</h2>
<p class="lead">Bạn gõ <code>./hello</code> rồi Enter. Vài micro-giây sau “hello, world” hiện ra. Bài này theo chân các byte qua phần cứng, và phát hiện sự thật quan trọng nhất về hiệu năng: <strong>bộ xử lý tốn phần lớn công sức để di chuyển dữ liệu, không phải để tính</strong>.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Kể tên các thành phần phần cứng chính: bus, thiết bị vào/ra, bộ nhớ chính, CPU.</li><li>Mô tả bộ đếm chương trình, tệp thanh ghi và ALU làm gì.</li><li>Lần theo các bước chạy <code>./hello</code>.</li><li>Giải thích vì sao có cache và mô tả tháp phân cấp lưu trữ.</li></ul>
<h3>📖 Bài giảng</h3>
<h4>Các thành phần</h4>
<ul>
<li><strong>Bus</strong> chở các khối byte cố định gọi là <strong>từ (word)</strong> giữa các thành phần. Ngày nay kích thước từ thường là 8 byte (64 bit).</li>
<li><strong>Thiết bị vào/ra</strong> (bàn phím, màn hình, ổ đĩa/SSD, card mạng) nối vào bus I/O qua <strong>bộ điều khiển</strong> hoặc <strong>bộ chuyển đổi (adapter)</strong>.</li>
<li><strong>Bộ nhớ chính</strong> (DRAM) là một mảng byte lớn, mỗi byte có một <strong>địa chỉ</strong> duy nhất bắt đầu từ 0. Nó giữ cả chương trình lẫn dữ liệu khi chương trình chạy.</li>
<li><strong>CPU</strong> thực thi lệnh nằm trong bộ nhớ. Lõi của nó là một thanh ghi cỡ một từ gọi là <strong>bộ đếm chương trình (PC)</strong>, chứa địa chỉ lệnh kế tiếp. Nó còn có <strong>tệp thanh ghi</strong> (một nhóm nhỏ thanh ghi nhanh có tên) và <strong>ALU</strong> (khối số học/logic).</li>
</ul>
<p>Bộ xử lý lặp mãi một vòng: đọc lệnh ở địa chỉ PC, giải mã các bit, làm thao tác đơn giản mà lệnh yêu cầu (nạp một từ từ bộ nhớ vào thanh ghi, ghi thanh ghi ra bộ nhớ, tính trên hai thanh ghi bằng ALU, hoặc nhảy), rồi cập nhật PC. <strong>Kiến trúc tập lệnh (ISA)</strong> quy định mỗi lệnh làm gì; <strong>vi kiến trúc</strong> là cách một con chip cụ thể hiện thực nó — chương 5.</p>
<h4>Chạy hello từng bước</h4>
<ol>
<li>Shell đọc các ký tự <code>./hello</code> từ bàn phím vào thanh ghi rồi vào bộ nhớ.</li>
<li>Khi bạn bấm Enter, shell nhờ hệ điều hành nạp tệp thực thi: mã và dữ liệu được chép từ đĩa vào bộ nhớ chính (với DMA, byte đi thẳng từ đĩa vào bộ nhớ, không qua CPU).</li>
<li>CPU bắt đầu chạy <code>main</code>. Các lệnh chép byte của “hello, world\\n” từ bộ nhớ vào thanh ghi, rồi từ đó ra thiết bị hiển thị.</li>
</ol>
<h4>Cache rất quan trọng</h4>
<p>Trong chuyến đi đó cùng các byte bị chép nhiều lần: đĩa → bộ nhớ → thanh ghi → màn hình. Chép là chi phí. Rắc rối là kho càng lớn càng chậm: đọc thanh ghi mất chưa tới một nano-giây, DRAM cỡ một trăm nano-giây, đọc đĩa tính bằng mili-giây. Để che khoảng cách đó, bộ xử lý đặt các <strong>bộ nhớ cache</strong> nhỏ và nhanh (L1, L2, L3, làm bằng SRAM) giữa thanh ghi và DRAM. Chương trình dùng lại dữ liệu ở gần sẽ tìm thấy nó trong cache phần lớn thời gian — đó là <strong>tính cục bộ</strong>, chương 6 chỉ cách tận dụng nó.</p>
<div class="formula"><span class="lbl">Tháp phân cấp lưu trữ (trên = nhỏ, nhanh, đắt mỗi byte)</span>L0: thanh ghi → cache L1 (SRAM) → cache L2 (SRAM) → cache L3 (SRAM) → L4: bộ nhớ chính (DRAM) → L5: lưu trữ cục bộ (SSD/đĩa) → L6: lưu trữ từ xa (mạng, cloud)</div>
<p>Ý then chốt: <strong>mỗi tầng là cache cho tầng bên dưới</strong>. Thanh ghi đệm cho L1, L1 đệm cho L2, …, bộ nhớ chính đệm cho đĩa, và đĩa cục bộ đệm cho tệp trên máy chủ ở xa.</p>
<h3>✍️ Ví dụ — đo chính máy của bạn</h3>
<p>Trên macOS hệ thống báo thông số cache qua <code>sysctl</code> (trên Linux dùng <code>lscpu</code> hoặc <code>getconf -a | grep CACHE</code>). Output thật trên máy chúng tôi:</p>
` + out(OUT_SYSCTL) + `
<p>Đọc kết quả: cache dữ liệu L1 64 KiB (theo truy vấn này), cache L2 4 MiB, dòng cache 128 byte (trên chip này bộ nhớ được chuyển giữa cache và DRAM theo khối 128 byte; đa số chip x86 dùng 64), và trang bộ nhớ ảo 16 KiB (x86-64 Linux dùng 4 KiB). Hãy nhớ các số này: ta dùng lại ở chương 6 và 9.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Tưởng CPU tính trực tiếp trên bộ nhớ hay trên đĩa — dữ liệu phải đi lên tháp trước.</li><li>Lẫn <em>kích thước từ</em> (số bit của thanh ghi/con trỏ) với kích thước <code>int</code> (vẫn 4 byte trên máy 64 bit).</li><li>Tưởng “nhiều GB RAM hơn” thì chương trình nào cũng nhanh hơn — đa số chương trình bị giới hạn bởi hành vi cache, không phải dung lượng RAM.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Máy tính = CPU + bộ nhớ chính + thiết bị vào/ra, nối bằng bus.</li><li>CPU lặp: lấy lệnh ở PC, thực thi, cập nhật PC.</li><li>Di chuyển dữ liệu là chi phí chính; cache khai thác tính cục bộ để che bộ nhớ chậm.</li><li>Tháp lưu trữ: mỗi tầng là cache của tầng dưới.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Memory_hierarchy" target="_blank" rel="noopener">Wikipedia — Memory hierarchy (phân cấp bộ nhớ)</a></li><li><a href="https://pages.cs.wisc.edu/~remzi/OSTEP/" target="_blank" rel="noopener">OSTEP — chương Introduction (miễn phí)</a></li><li><a href="https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/" target="_blank" rel="noopener">MIT 6.004 — Computation Structures</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>PC chứa gì sau khi CPU chạy xong một lệnh (không phải lệnh nhảy) dài 3 byte bắt đầu ở địa chỉ 0x400?</li><li>Xếp từ nhanh nhất tới chậm nhất: SSD, cache L1, thanh ghi, DRAM, cache L3.</li><li>Vì sao hệ điều hành chép <code>hello</code> từ đĩa vào bộ nhớ thay vì để CPU chạy thẳng trên đĩa?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 0x403 — địa chỉ lệnh kế tiếp. 2) Thanh ghi, L1, L3, DRAM, SSD. 3) CPU chỉ lấy lệnh được từ địa chỉ bộ nhớ, và đĩa chậm hơn DRAM cỡ 100 000 lần; bộ nhớ đóng vai cache cho đĩa.</p></div>`);

const c13 = L('ics102-ts-1-3',
  '1.3 — The operating system: processes, virtual memory, files; Amdahl\'s law|||1.3 — Hệ điều hành: tiến trình, bộ nhớ ảo, tệp; định luật Amdahl',
  'Ba trừu tượng của hệ điều hành (tiến trình, bộ nhớ ảo, tệp), luồng, mạng; định luật Amdahl có ví dụ tính từng bước; đồng thời và song song ở ba mức.',
  `<span class="eyebrow">ICS102 · Chapter 1 · Lesson 1.3</span>
<h2>The operating system: processes, virtual memory, files; Amdahl's law</h2>
<p class="lead">When <code>hello</code> ran, it never touched the keyboard, the display or the disk directly — it asked the <strong>operating system</strong>. The OS protects the hardware from buggy programs and gives every program the same simple view of the machine through three abstractions. We finish the tour with a law that every performance engineer uses.</p>
<h3>🎯 Objectives</h3>
<ul><li>Explain the two purposes of an operating system.</li><li>Describe processes, threads, virtual memory and files as abstractions.</li><li>Apply Amdahl's law to estimate speedup.</li><li>Distinguish concurrency from parallelism and name three levels of parallelism.</li></ul>
<h3>📖 Lecture</h3>
<h4>Why an operating system?</h4>
<p>The OS (1) <strong>protects</strong> the hardware from misuse by runaway programs, and (2) gives applications <strong>simple, uniform mechanisms</strong> for complicated, very different devices. It achieves both through abstractions:</p>
<div class="formula"><span class="lbl">Abstractions of the OS</span><b>files</b> → abstraction of I/O devices<br><b>virtual memory</b> → abstraction of main memory + I/O devices (disk)<br><b>processes</b> → abstraction of processor + main memory + I/O devices</div>
<h4>Processes</h4>
<p>A <strong>process</strong> is the OS's abstraction of a running program. Each process has the illusion that it alone uses the CPU, memory and devices. In reality many processes run <strong>concurrently</strong>: the OS switches between them with a <strong>context switch</strong> — it saves the current process's <strong>context</strong> (PC, registers, memory state), restores another's and resumes it. The part of the OS that is always in memory, the <strong>kernel</strong>, does this; programs enter the kernel through <strong>system calls</strong> (for example <code>write</code> to print). A process can contain several <strong>threads</strong> that share its code and data — easier to share data and cheaper than separate processes (chapter 10).</p>
<h4>Virtual memory</h4>
<p>Each process sees its own uniform <strong>virtual address space</strong>, the same layout in every process: program code and data at low addresses, then the <strong>heap</strong> (grows up with <code>malloc</code>), shared libraries in the middle, the user <strong>stack</strong> near the top (grows down with function calls), and kernel memory at the very top. Hardware translates every virtual address to a physical one — chapter 9.</p>
<h4>Files</h4>
<p>A <strong>file</strong> is just a sequence of bytes. Every I/O device — disk, keyboard, display, even the network — is modelled as a file and accessed with the same small set of system calls (<code>open</code>, <code>read</code>, <code>write</code>, <code>close</code>). The network is “just another I/O device” from a system's point of view.</p>
<h4>Amdahl's law</h4>
<p>If you speed up one part of a system, the overall speedup depends on how big that part was. Let a fraction α of the time be sped up by a factor k. The new time is T<sub>new</sub> = (1 − α)T<sub>old</sub> + αT<sub>old</sub>/k, so:</p>
<div class="formula"><span class="lbl">Amdahl's law</span>S = T<sub>old</sub> / T<sub>new</sub> = 1 / [ (1 − α) + α/k ]        maximum (k → ∞): S<sub>∞</sub> = 1 / (1 − α)</div>
<div class="callout"><p><b>Worked example.</b> A program spends 60% of its time in a function (α = 0.6). You make that function 3 times faster (k = 3).<br>Step 1: unchanged part = 1 − 0.6 = 0.4.<br>Step 2: improved part = 0.6/3 = 0.2.<br>Step 3: S = 1/(0.4 + 0.2) = 1/0.6 ≈ <b>1.67×</b>.<br>Even an infinitely fast function gives only 1/0.4 = <b>2.5×</b>. To speed a system up a lot, you must speed up a very large fraction of it.</p></div>
<h4>Concurrency and parallelism</h4>
<p><strong>Concurrency</strong> = a system with several simultaneous activities; <strong>parallelism</strong> = using concurrency to run faster. Three levels: <strong>thread-level</strong> (multi-core processors, hyperthreading), <strong>instruction-level</strong> (a pipelined, superscalar CPU executes several instructions at once — chapter 5), and <strong>SIMD</strong> (one instruction operates on a vector of values, used heavily by image, audio and AI code).</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Thinking a program talks to devices directly — it always goes through system calls.</li><li>Thinking concurrency requires several cores — a single core interleaves processes too.</li><li>Applying Amdahl with α as a percentage (60) instead of a fraction (0.6).</li><li>Expecting 8 cores to make any program 8× faster — the serial part limits the speedup.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>The OS protects hardware and offers abstractions: processes, virtual memory, files.</li><li>Context switches make processes run concurrently on shared hardware.</li><li>Every process sees the same virtual address-space layout.</li><li>Amdahl: S = 1/[(1 − α) + α/k]; the untouched part limits speedup.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Amdahl%27s_law" target="_blank" rel="noopener">Wikipedia — Amdahl's law</a></li><li><a href="https://en.wikipedia.org/wiki/Context_switch" target="_blank" rel="noopener">Wikipedia — Context switch</a></li><li><a href="https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-intro.pdf" target="_blank" rel="noopener">OSTEP — The Abstraction: The Process (PDF)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>A program spends 90% of its time in code you can parallelise perfectly on 10 cores. What is the speedup?</li><li>With the same program and infinitely many cores, what is the limit?</li><li>Which OS abstraction lets two programs use the same address 0x400000 without interfering?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) α = 0.9, k = 10: S = 1/(0.1 + 0.09) = 1/0.19 ≈ 5.26×. 2) 1/0.1 = 10×. 3) Virtual memory: each process has its own address space, mapped to different physical memory.</p></div>`,
  `<span class="eyebrow">ICS102 · Chương 1 · Bài 1.3</span>
<h2>Hệ điều hành: tiến trình, bộ nhớ ảo, tệp; định luật Amdahl</h2>
<p class="lead">Khi <code>hello</code> chạy, nó không hề đụng trực tiếp vào bàn phím, màn hình hay đĩa — nó nhờ <strong>hệ điều hành</strong>. Hệ điều hành bảo vệ phần cứng khỏi chương trình lỗi và cho mọi chương trình cùng một cái nhìn đơn giản về máy qua ba trừu tượng. Ta khép chuyến dạo bằng một định luật mà kỹ sư hiệu năng nào cũng dùng.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Giải thích hai mục đích của hệ điều hành.</li><li>Mô tả tiến trình, luồng, bộ nhớ ảo và tệp như các trừu tượng.</li><li>Áp dụng định luật Amdahl để ước lượng mức tăng tốc.</li><li>Phân biệt đồng thời với song song, kể ba mức song song.</li></ul>
<h3>📖 Bài giảng</h3>
<h4>Vì sao cần hệ điều hành?</h4>
<p>Hệ điều hành (1) <strong>bảo vệ</strong> phần cứng khỏi bị chương trình mất kiểm soát dùng sai, và (2) cho ứng dụng <strong>cơ chế đơn giản, thống nhất</strong> để dùng các thiết bị phức tạp, khác nhau. Nó làm cả hai nhờ trừu tượng:</p>
<div class="formula"><span class="lbl">Các trừu tượng của hệ điều hành</span><b>tệp</b> → trừu tượng của thiết bị vào/ra<br><b>bộ nhớ ảo</b> → trừu tượng của bộ nhớ chính + thiết bị vào/ra (đĩa)<br><b>tiến trình</b> → trừu tượng của bộ xử lý + bộ nhớ chính + thiết bị vào/ra</div>
<h4>Tiến trình</h4>
<p><strong>Tiến trình (process)</strong> là trừu tượng của hệ điều hành cho một chương trình đang chạy. Mỗi tiến trình có ảo giác rằng nó dùng riêng CPU, bộ nhớ và thiết bị. Thực tế nhiều tiến trình chạy <strong>đồng thời</strong>: hệ điều hành chuyển qua lại giữa chúng bằng <strong>chuyển ngữ cảnh (context switch)</strong> — lưu <strong>ngữ cảnh</strong> của tiến trình hiện tại (PC, thanh ghi, trạng thái bộ nhớ), khôi phục ngữ cảnh của tiến trình khác rồi cho chạy tiếp. Phần luôn nằm trong bộ nhớ của hệ điều hành, <strong>nhân (kernel)</strong>, làm việc này; chương trình đi vào nhân qua <strong>lời gọi hệ thống</strong> (ví dụ <code>write</code> để in). Một tiến trình có thể gồm nhiều <strong>luồng (thread)</strong> dùng chung mã và dữ liệu — chia sẻ dữ liệu dễ hơn và rẻ hơn nhiều tiến trình riêng (chương 10).</p>
<h4>Bộ nhớ ảo</h4>
<p>Mỗi tiến trình thấy một <strong>không gian địa chỉ ảo</strong> riêng, đồng nhất, cùng một bố cục ở mọi tiến trình: mã và dữ liệu chương trình ở địa chỉ thấp, rồi tới <strong>heap</strong> (lớn lên khi <code>malloc</code>), thư viện dùng chung ở giữa, <strong>ngăn xếp</strong> người dùng gần đỉnh (lớn xuống khi gọi hàm), và bộ nhớ nhân ở trên cùng. Phần cứng dịch mọi địa chỉ ảo sang địa chỉ vật lý — chương 9.</p>
<h4>Tệp</h4>
<p><strong>Tệp</strong> chỉ là một dãy byte. Mọi thiết bị vào/ra — đĩa, bàn phím, màn hình, cả mạng — đều được mô hình hoá thành tệp và truy cập bằng cùng một nhóm nhỏ lời gọi hệ thống (<code>open</code>, <code>read</code>, <code>write</code>, <code>close</code>). Với hệ thống, mạng “chỉ là một thiết bị vào/ra nữa”.</p>
<h4>Định luật Amdahl</h4>
<p>Tăng tốc một phần của hệ thống thì mức tăng tốc chung phụ thuộc phần đó lớn cỡ nào. Gọi α là tỉ lệ thời gian được tăng tốc k lần. Thời gian mới T<sub>mới</sub> = (1 − α)T<sub>cũ</sub> + αT<sub>cũ</sub>/k, nên:</p>
<div class="formula"><span class="lbl">Định luật Amdahl</span>S = T<sub>cũ</sub> / T<sub>mới</sub> = 1 / [ (1 − α) + α/k ]        tối đa (k → ∞): S<sub>∞</sub> = 1 / (1 − α)</div>
<div class="callout"><p><b>Ví dụ giải từng bước.</b> Một chương trình dành 60% thời gian trong một hàm (α = 0,6). Bạn làm hàm đó nhanh gấp 3 (k = 3).<br>Bước 1: phần không đổi = 1 − 0,6 = 0,4.<br>Bước 2: phần được cải thiện = 0,6/3 = 0,2.<br>Bước 3: S = 1/(0,4 + 0,2) = 1/0,6 ≈ <b>1,67 lần</b>.<br>Kể cả hàm nhanh vô hạn cũng chỉ được 1/0,4 = <b>2,5 lần</b>. Muốn tăng tốc hệ thống nhiều, phải tăng tốc một phần rất lớn của nó.</p></div>
<h4>Đồng thời và song song</h4>
<p><strong>Đồng thời (concurrency)</strong> = hệ thống có nhiều hoạt động cùng lúc; <strong>song song (parallelism)</strong> = dùng đồng thời để chạy nhanh hơn. Ba mức: <strong>mức luồng</strong> (bộ xử lý nhiều lõi, hyperthreading), <strong>mức lệnh</strong> (CPU đường ống, siêu vô hướng chạy nhiều lệnh một lúc — chương 5), và <strong>SIMD</strong> (một lệnh tính trên cả một vectơ giá trị, dùng nhiều trong code ảnh, âm thanh, AI).</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Tưởng chương trình nói chuyện trực tiếp với thiết bị — nó luôn đi qua lời gọi hệ thống.</li><li>Tưởng đồng thời cần nhiều lõi — một lõi vẫn xen kẽ các tiến trình.</li><li>Áp dụng Amdahl với α là phần trăm (60) thay vì tỉ lệ (0,6).</li><li>Mong 8 lõi làm mọi chương trình nhanh gấp 8 — phần tuần tự giới hạn mức tăng tốc.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Hệ điều hành bảo vệ phần cứng và cung cấp trừu tượng: tiến trình, bộ nhớ ảo, tệp.</li><li>Chuyển ngữ cảnh cho các tiến trình chạy đồng thời trên phần cứng chung.</li><li>Mọi tiến trình thấy cùng một bố cục không gian địa chỉ ảo.</li><li>Amdahl: S = 1/[(1 − α) + α/k]; phần không cải thiện giới hạn mức tăng tốc.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Amdahl%27s_law" target="_blank" rel="noopener">Wikipedia — Định luật Amdahl</a></li><li><a href="https://en.wikipedia.org/wiki/Context_switch" target="_blank" rel="noopener">Wikipedia — Chuyển ngữ cảnh</a></li><li><a href="https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-intro.pdf" target="_blank" rel="noopener">OSTEP — The Abstraction: The Process (PDF)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Một chương trình dành 90% thời gian ở phần song song hoá hoàn hảo trên 10 lõi. Mức tăng tốc bao nhiêu?</li><li>Cùng chương trình đó với vô số lõi, giới hạn là bao nhiêu?</li><li>Trừu tượng nào cho hai chương trình cùng dùng địa chỉ 0x400000 mà không ảnh hưởng nhau?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) α = 0,9, k = 10: S = 1/(0,1 + 0,09) = 1/0,19 ≈ 5,26 lần. 2) 1/0,1 = 10 lần. 3) Bộ nhớ ảo: mỗi tiến trình có không gian địa chỉ riêng, ánh xạ tới vùng nhớ vật lý khác nhau.</p></div>`);

const q1 = QZ(1, 'Quiz — Chapter 1: A tour of computer systems|||Quiz — Chương 1: Dạo một vòng hệ thống máy tính', 'Kiểm tra chương 1: bit + ngữ cảnh, bốn pha biên dịch, tổ chức phần cứng, phân cấp lưu trữ, trừu tượng của hệ điều hành, định luật Amdahl.', [
  Q('q1', 'Which phase of gcc turns assembly text (.s) into a relocatable object file (.o)?|||Pha nào của gcc biến assembly (.s) thành tệp đối tượng khả định vị (.o)?',
    ['Preprocessor|||Bộ tiền xử lý', 'Compiler|||Trình biên dịch', 'Assembler|||Trình hợp dịch', 'Linker|||Bộ liên kết'], 2,
    'The assembler encodes instructions into bytes; the linker then produces the executable.|||Trình hợp dịch mã hoá lệnh thành byte; sau đó bộ liên kết tạo tệp thực thi.'),
  Q('q2', 'In nm hello.o, printf is marked U. This means|||Trong nm hello.o, printf có nhãn U. Nghĩa là',
    ['printf is unsigned|||printf là số không dấu', 'printf is used but not defined in this file|||printf được dùng nhưng không định nghĩa trong tệp này', 'printf is defined in the text section|||printf được định nghĩa trong vùng mã', 'printf was removed by the optimiser|||printf bị bộ tối ưu bỏ đi'], 1,
    'U = undefined: the linker must resolve it from another object or library.|||U = undefined: bộ liên kết phải tìm nó ở tệp đối tượng hoặc thư viện khác.'),
  Q('q3', '“Information = bits + context” means|||“Thông tin = bit + ngữ cảnh” nghĩa là',
    ['every byte stores its own type|||mỗi byte tự lưu kiểu của nó', 'the same bits can mean different things depending on how a program reads them|||cùng các bit có thể mang nghĩa khác nhau tuỳ cách chương trình đọc', 'text files have no bits|||tệp văn bản không có bit', 'only the CPU knows the meaning|||chỉ CPU biết ý nghĩa'], 1,
    'Bytes carry no type; the interpretation (int, char, float, instruction) comes from context.|||Byte không mang kiểu; cách diễn giải (int, char, float, lệnh) đến từ ngữ cảnh.'),
  Q('q4', 'The program counter (PC) holds|||Bộ đếm chương trình (PC) chứa',
    ['the number of instructions executed|||số lệnh đã chạy', 'the address of the next instruction to execute|||địa chỉ lệnh kế tiếp cần chạy', 'the result of the last ALU operation|||kết quả phép ALU gần nhất', 'the process ID|||mã tiến trình'], 1,
    'The CPU fetches the instruction at PC, executes it and updates PC.|||CPU lấy lệnh ở PC, thực thi rồi cập nhật PC.'),
  Q('q5', 'Which ordering is from fastest to slowest?|||Thứ tự nào từ nhanh nhất tới chậm nhất?',
    ['DRAM, L1, register, SSD|||DRAM, L1, thanh ghi, SSD', 'register, L1 cache, DRAM, SSD|||thanh ghi, cache L1, DRAM, SSD', 'L1, register, SSD, DRAM|||L1, thanh ghi, SSD, DRAM', 'SSD, DRAM, L1, register|||SSD, DRAM, L1, thanh ghi'], 1,
    'Top of the storage hierarchy is smallest and fastest.|||Đỉnh tháp lưu trữ nhỏ nhất và nhanh nhất.'),
  Q('q6', 'The key idea of the memory hierarchy is that|||Ý then chốt của phân cấp bộ nhớ là',
    ['each level is a cache for the level below|||mỗi tầng là cache cho tầng bên dưới', 'only L1 is a cache|||chỉ L1 là cache', 'DRAM is faster than SRAM|||DRAM nhanh hơn SRAM', 'disks are accessed directly by the ALU|||ALU truy cập đĩa trực tiếp'], 0,
    'Registers cache L1, …, memory caches disk, local disk caches remote storage.|||Thanh ghi đệm L1, …, bộ nhớ đệm đĩa, đĩa cục bộ đệm lưu trữ từ xa.'),
  Q('q7', 'Which OS abstraction represents processor + memory + I/O devices together?|||Trừu tượng nào của hệ điều hành đại diện chung cho bộ xử lý + bộ nhớ + thiết bị vào/ra?',
    ['File|||Tệp', 'Virtual memory|||Bộ nhớ ảo', 'Process|||Tiến trình', 'Socket|||Socket'], 2,
    'Files abstract I/O; virtual memory abstracts memory + disk; a process abstracts the whole machine.|||Tệp trừu tượng I/O; bộ nhớ ảo trừu tượng bộ nhớ + đĩa; tiến trình trừu tượng cả máy.'),
  Q('q8', 'A context switch saves and restores|||Chuyển ngữ cảnh lưu và khôi phục',
    ['the source code|||mã nguồn', 'the PC, registers and memory state of a process|||PC, thanh ghi và trạng thái bộ nhớ của tiến trình', 'only the stack|||chỉ ngăn xếp', 'the disk contents|||nội dung đĩa'], 1,
    'That state is the process context.|||Trạng thái đó là ngữ cảnh của tiến trình.'),
  Q('q9', 'A part taking 50% of the time is made 5× faster. Overall speedup (Amdahl)?|||Một phần chiếm 50% thời gian được làm nhanh gấp 5. Tăng tốc chung (Amdahl)?',
    ['5×|||5 lần', '2.5×|||2,5 lần', '≈ 1.67×|||≈ 1,67 lần', '2×|||2 lần'], 2,
    'S = 1/(0.5 + 0.5/5) = 1/0.6 ≈ 1.67.|||S = 1/(0,5 + 0,5/5) = 1/0,6 ≈ 1,67.'),
  Q('q10', 'Maximum possible speedup if 25% of the program cannot be improved:|||Tăng tốc tối đa nếu 25% chương trình không cải thiện được:',
    ['4×|||4 lần', '1.33×|||1,33 lần', '25×|||25 lần', 'unlimited|||vô hạn'], 0,
    'S∞ = 1/(1 − α) = 1/0.25 = 4.|||S∞ = 1/(1 − α) = 1/0,25 = 4.'),
]);

const ch1 = {
  title: 'Chapter 1 — A tour of computer systems|||Chương 1 — Dạo một vòng hệ thống máy tính',
  description: 'Bit + ngữ cảnh, hệ thống biên dịch chạy thật trên hello.c, tổ chức phần cứng, phân cấp lưu trữ đo trên máy thật, ba trừu tượng của hệ điều hành, định luật Amdahl (CS:APP chương 1).',
  lessons: [c11, c12, c13, q1],
};

// ───────────────────────────── Chương 2 — Biểu diễn thông tin ─────────────────────────────
const SRC_SHOWBYTES = String.raw`
#include <stdio.h>
#include <string.h>
typedef unsigned char *byte_pointer;
void show_bytes(const char *label, byte_pointer start, size_t len) {
    printf("%-10s", label);
    for (size_t i = 0; i < len; i++) printf(" %.2x", start[i]);
    printf("\n");
}
int main(void) {
    int    x = 12345;            /* 0x00003039 */
    float  f = 12345.0f;
    short  s = -12345;
    long   big = 0x0123456789ABCDEF;
    show_bytes("int", (byte_pointer)&x, sizeof x);
    show_bytes("float", (byte_pointer)&f, sizeof f);
    show_bytes("short", (byte_pointer)&s, sizeof s);
    show_bytes("long", (byte_pointer)&big, sizeof big);
    printf("sizeof: char=%zu short=%zu int=%zu long=%zu void*=%zu float=%zu double=%zu\n",
           sizeof(char), sizeof(short), sizeof(int), sizeof(long), sizeof(void*), sizeof(float), sizeof(double));
    return 0;
}
`;
const OUT_SHOWBYTES = String.raw`
int        39 30 00 00
float      00 e4 40 46
short      c7 cf
long       ef cd ab 89 67 45 23 01
sizeof: char=1 short=2 int=4 long=8 void*=8 float=4 double=8
`;

const c21 = L('ics102-ts-2-1',
  '2.1 — Bits, bytes, hexadecimal, words and byte ordering|||2.1 — Bit, byte, hệ 16, từ máy và thứ tự byte',
  'Vì sao máy dùng nhị phân, đổi nhanh nhị phân ↔ hệ 16 ↔ thập phân, kích thước kiểu dữ liệu C trên máy 64 bit, little-endian vs big-endian, chương trình show_bytes chạy thật.',
  `<span class="eyebrow">ICS102 · Chapter 2 · Lesson 2.1</span>
<h2>Bits, bytes, hexadecimal, words and byte ordering</h2>
<p class="lead">Every value in your program — a number, a character, a pointer, an instruction — is stored as a group of bytes. Before we can reason about integers and floats we need fluent “bit reading”: hexadecimal notation, the sizes of C types, and the order in which the bytes of a multi-byte value are placed in memory.</p>
<h3>🎯 Objectives</h3>
<ul><li>Convert between binary, hexadecimal and decimal quickly.</li><li>State the sizes of the C data types on a 64-bit machine.</li><li>Explain little-endian and big-endian byte ordering.</li><li>Use a C program to print the bytes of any object.</li></ul>
<h3>📖 Lecture</h3>
<h4>Why bits?</h4>
<p>Two-valued signals are easy to store and to transmit reliably (high/low voltage, magnetised or not), even with noisy, imprecise circuits. Grouping bits and giving them an <em>interpretation</em> lets us encode anything.</p>
<h4>Bytes and hexadecimal</h4>
<p>A <strong>byte</strong> is 8 bits, the smallest addressable unit of memory: values 0000 0000 to 1111 1111 in binary, 0 to 255 in decimal. Binary is too long to read and decimal hides the bit pattern, so we write bytes in <strong>hexadecimal</strong> (base 16): digits 0–9 and A–F, one hex digit = exactly 4 bits. In C, hex constants start with <code>0x</code>.</p>
<div class="formula"><span class="lbl">Hex ↔ binary</span>0 0000 · 1 0001 · 2 0010 · 3 0011 · 4 0100 · 5 0101 · 6 0110 · 7 0111 · 8 1000 · 9 1001 · A 1010 · B 1011 · C 1100 · D 1101 · E 1110 · F 1111</div>
<div class="callout"><p><b>Example 1.</b> 0x173A4C → binary: 0001 0111 0011 1010 0100 1100 (replace each digit by 4 bits).<br><b>Example 2.</b> 1111001010110110110011 → group from the right in 4s: 11 1100 1010 1101 1011 0011 → <b>0x3CADB3</b>.<br><b>Example 3.</b> 12345 → hex: 12345 = 3·4096 + 0·256 + 3·16 + 9 → <b>0x3039</b>. Back: 3·16<sup>3</sup> + 0·16<sup>2</sup> + 3·16 + 9 = 12345.<br><b>Example 4.</b> 2<sup>n</sup> with n = i + 4j is 0x followed by digit 2<sup>i</sup> and j zeros: 2<sup>11</sup> = 2<sup>3</sup>·16<sup>2</sup> = <b>0x800</b>.</p></div>
<h4>Words and data sizes</h4>
<p>The <strong>word size</strong> is the nominal size of pointers and integer registers. A 64-bit machine has 8-byte pointers, so a program can address up to 2<sup>64</sup> bytes of virtual memory. C types have typical sizes; only <code>char</code> = 1 byte is guaranteed, so portable code uses <code>int32_t</code>, <code>int64_t</code> from <code>&lt;stdint.h&gt;</code> when the exact size matters.</p>
<h4>Byte ordering: little-endian vs big-endian</h4>
<p>An <code>int</code> with value 0x01234567 occupies 4 bytes at addresses a, a+1, a+2, a+3. <strong>Little-endian</strong> machines (x86-64, almost all ARM systems, Apple M-series) store the <em>least</em> significant byte first: 67 45 23 01. <strong>Big-endian</strong> machines (many network protocols, some old processors) store the most significant byte first: 01 23 45 67. Inside one machine you rarely notice; it matters when bytes cross machines (network, binary files) and when you read memory dumps.</p>
<h3>✍️ Worked example — print the bytes of objects</h3>
<p>The classic CS:APP routine casts a pointer to <code>unsigned char *</code> and prints each byte in hex:</p>
` + C(SRC_SHOWBYTES) + `
<p>Real output (identical on our Mac arm64 and under x86-64):</p>
` + out(OUT_SHOWBYTES) + `
<p>Reading it: 12345 = 0x00003039 is stored as <code>39 30 00 00</code> — little-endian. The long 0x0123456789ABCDEF appears completely reversed. The float 12345.0 has a totally different bit pattern (0x4640E400) from the int 12345 — same value, different encoding (lesson 2.5). The short −12345 is <code>0xCFC7</code> (lesson 2.3).</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Grouping binary digits from the left when converting to hex — always group from the right.</li><li>Assuming <code>long</code> is 8 bytes everywhere (it is 4 bytes on 64-bit Windows).</li><li>Reading a little-endian dump as if it were big-endian.</li><li>Sending raw <code>int</code>s over the network without converting to network (big-endian) order with <code>htonl</code>.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>1 byte = 8 bits = 2 hex digits; one hex digit = 4 bits.</li><li>Word size = pointer size; on 64-bit systems 8 bytes.</li><li>x86-64 and ARM are little-endian: least significant byte at the lowest address.</li><li>Casting to <code>unsigned char *</code> lets you inspect the raw bytes of any object.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Endianness" target="_blank" rel="noopener">Wikipedia — Endianness</a></li><li><a href="https://en.wikipedia.org/wiki/Hexadecimal" target="_blank" rel="noopener">Wikipedia — Hexadecimal</a></li><li><a href="https://pythontutor.com/c.html" target="_blank" rel="noopener">C Tutor — watch the bytes of variables in memory</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Convert 0x39A7F8 to binary and 1100100101111011 to hex.</li><li>What is 2<sup>19</sup> in hex? What is 0x80 in decimal?</li><li>The <code>int</code> 0x87654321 is stored at address 0x100 on a little-endian machine. Which byte is at 0x100? At 0x103?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 0011 1001 1010 0111 1111 1000; 1100 1001 0111 1011 = 0xC97B. 2) 19 = 3 + 4·4 → 0x80000; 0x80 = 128. 3) 0x21 at 0x100 (least significant first), 0x87 at 0x103.</p></div>`,
  `<span class="eyebrow">ICS102 · Chương 2 · Bài 2.1</span>
<h2>Bit, byte, hệ 16, từ máy và thứ tự byte</h2>
<p class="lead">Mọi giá trị trong chương trình — số, ký tự, con trỏ, lệnh — đều được lưu thành một nhóm byte. Trước khi lập luận về số nguyên và số thực, ta cần “đọc bit” trôi chảy: ký pháp hệ 16, kích thước các kiểu C, và thứ tự đặt các byte của một giá trị nhiều byte trong bộ nhớ.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Đổi nhanh giữa nhị phân, hệ 16 và thập phân.</li><li>Nêu kích thước các kiểu dữ liệu C trên máy 64 bit.</li><li>Giải thích thứ tự byte little-endian và big-endian.</li><li>Dùng chương trình C in các byte của một đối tượng bất kỳ.</li></ul>
<h3>📖 Bài giảng</h3>
<h4>Vì sao dùng bit?</h4>
<p>Tín hiệu hai trạng thái dễ lưu và dễ truyền tin cậy (điện áp cao/thấp, có từ hoá hay không), kể cả với mạch nhiễu, kém chính xác. Gom các bit lại và gán cho chúng một <em>cách diễn giải</em> là mã hoá được mọi thứ.</p>
<h4>Byte và hệ 16</h4>
<p><strong>Byte</strong> là 8 bit, đơn vị nhỏ nhất có địa chỉ trong bộ nhớ: giá trị từ 0000 0000 tới 1111 1111 nhị phân, 0 tới 255 thập phân. Nhị phân quá dài để đọc còn thập phân che mất mẫu bit, nên ta viết byte ở <strong>hệ 16 (hexadecimal)</strong>: chữ số 0–9 và A–F, một chữ số hex = đúng 4 bit. Trong C, hằng hex bắt đầu bằng <code>0x</code>.</p>
<div class="formula"><span class="lbl">Hex ↔ nhị phân</span>0 0000 · 1 0001 · 2 0010 · 3 0011 · 4 0100 · 5 0101 · 6 0110 · 7 0111 · 8 1000 · 9 1001 · A 1010 · B 1011 · C 1100 · D 1101 · E 1110 · F 1111</div>
<div class="callout"><p><b>Ví dụ 1.</b> 0x173A4C → nhị phân: 0001 0111 0011 1010 0100 1100 (thay mỗi chữ số bằng 4 bit).<br><b>Ví dụ 2.</b> 1111001010110110110011 → gom từng 4 bit từ phải: 11 1100 1010 1101 1011 0011 → <b>0x3CADB3</b>.<br><b>Ví dụ 3.</b> 12345 → hex: 12345 = 3·4096 + 0·256 + 3·16 + 9 → <b>0x3039</b>. Ngược lại: 3·16<sup>3</sup> + 0·16<sup>2</sup> + 3·16 + 9 = 12345.<br><b>Ví dụ 4.</b> 2<sup>n</sup> với n = i + 4j là 0x, chữ số 2<sup>i</sup> rồi j số 0: 2<sup>11</sup> = 2<sup>3</sup>·16<sup>2</sup> = <b>0x800</b>.</p></div>
<h4>Từ máy và kích thước dữ liệu</h4>
<p><strong>Kích thước từ (word size)</strong> là kích thước danh nghĩa của con trỏ và thanh ghi số nguyên. Máy 64 bit có con trỏ 8 byte, nên chương trình đánh địa chỉ được tới 2<sup>64</sup> byte bộ nhớ ảo. Các kiểu C có kích thước điển hình; chỉ <code>char</code> = 1 byte là được bảo đảm, nên code khả chuyển dùng <code>int32_t</code>, <code>int64_t</code> trong <code>&lt;stdint.h&gt;</code> khi kích thước chính xác là quan trọng.</p>
<h4>Thứ tự byte: little-endian và big-endian</h4>
<p>Một <code>int</code> giá trị 0x01234567 chiếm 4 byte ở địa chỉ a, a+1, a+2, a+3. Máy <strong>little-endian</strong> (x86-64, gần như mọi hệ ARM, Apple M-series) lưu byte <em>ít</em> quan trọng nhất trước: 67 45 23 01. Máy <strong>big-endian</strong> (nhiều giao thức mạng, vài bộ xử lý cũ) lưu byte quan trọng nhất trước: 01 23 45 67. Trong một máy bạn hiếm khi để ý; nó quan trọng khi byte đi qua máy khác (mạng, tệp nhị phân) và khi đọc bản dump bộ nhớ.</p>
<h3>✍️ Ví dụ — in các byte của đối tượng</h3>
<p>Hàm kinh điển của CS:APP ép con trỏ về <code>unsigned char *</code> rồi in từng byte ở hệ 16:</p>
` + C(SRC_SHOWBYTES) + `
<p>Output thật (giống nhau trên Mac arm64 và dưới x86-64):</p>
` + out(OUT_SHOWBYTES) + `
<p>Đọc kết quả: 12345 = 0x00003039 được lưu thành <code>39 30 00 00</code> — little-endian. Số long 0x0123456789ABCDEF hiện ra đảo ngược hoàn toàn. Số float 12345.0 có mẫu bit khác hẳn (0x4640E400) so với int 12345 — cùng giá trị, khác cách mã hoá (bài 2.5). Số short −12345 là <code>0xCFC7</code> (bài 2.3).</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Gom chữ số nhị phân từ bên trái khi đổi sang hex — luôn gom từ bên phải.</li><li>Tưởng <code>long</code> ở đâu cũng 8 byte (trên Windows 64 bit nó là 4 byte).</li><li>Đọc bản dump little-endian như big-endian.</li><li>Gửi <code>int</code> thô qua mạng mà không đổi sang thứ tự mạng (big-endian) bằng <code>htonl</code>.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>1 byte = 8 bit = 2 chữ số hex; một chữ số hex = 4 bit.</li><li>Kích thước từ = kích thước con trỏ; trên hệ 64 bit là 8 byte.</li><li>x86-64 và ARM là little-endian: byte ít quan trọng nhất ở địa chỉ thấp nhất.</li><li>Ép về <code>unsigned char *</code> để xem byte thô của bất kỳ đối tượng nào.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Endianness" target="_blank" rel="noopener">Wikipedia — Endianness (thứ tự byte)</a></li><li><a href="https://en.wikipedia.org/wiki/Hexadecimal" target="_blank" rel="noopener">Wikipedia — Hexadecimal (hệ 16)</a></li><li><a href="https://pythontutor.com/c.html" target="_blank" rel="noopener">C Tutor — xem byte của biến trong bộ nhớ</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Đổi 0x39A7F8 sang nhị phân và 1100100101111011 sang hex.</li><li>2<sup>19</sup> ở hệ 16 là gì? 0x80 ở thập phân là bao nhiêu?</li><li>Số <code>int</code> 0x87654321 lưu ở địa chỉ 0x100 trên máy little-endian. Byte nào ở 0x100? Ở 0x103?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 0011 1001 1010 0111 1111 1000; 1100 1001 0111 1011 = 0xC97B. 2) 19 = 3 + 4·4 → 0x80000; 0x80 = 128. 3) 0x21 ở 0x100 (byte thấp trước), 0x87 ở 0x103.</p></div>`);

const SRC_BITS = String.raw`
#include <stdio.h>
int main(void) {
    unsigned char a = 0x69, b = 0x55;
    printf("a&b=0x%02x a|b=0x%02x a^b=0x%02x ~a=0x%02x\n", a & b, a | b, a ^ b, (unsigned char)~a);
    printf("!0x41=%d !!0x41=%d 0x69&&0x55=%d\n", !0x41, !!0x41, 0x69 && 0x55);
    int x = 0x87654321;
    printf("x & 0xFF        = 0x%08x\n", x & 0xFF);
    printf("x ^ ~0xFF       = 0x%08x\n", x ^ ~0xFF);
    printf("x | 0xFF        = 0x%08x\n", x | 0xFF);
    signed char s = (signed char)0x96;       /* 1001 0110 */
    unsigned char us = 0x96;
    printf("arith  0x96>>4  = 0x%02x\n", (unsigned char)(s >> 4));
    printf("logical 0x96>>4 = 0x%02x\n", (unsigned char)(us >> 4));
    return 0;
}
`;
const OUT_BITS = String.raw`
a&b=0x41 a|b=0x7d a^b=0x3c ~a=0x96
!0x41=0 !!0x41=1 0x69&&0x55=1
x & 0xFF        = 0x00000021
x ^ ~0xFF       = 0x789abc21
x | 0xFF        = 0x876543ff
arith  0x96>>4  = 0xf9
logical 0x96>>4 = 0x09
`;

const c22 = L('ics102-ts-2-2',
  '2.2 — Bit-level operations, masks, logical operators and shifts|||2.2 — Phép toán mức bit, mặt nạ, toán tử logic và phép dịch',
  'Đại số Boole trên vectơ bit, & | ^ ~ trong C, kỹ thuật mặt nạ (lấy/xoá/bật bit), khác biệt giữa & và &&, dịch trái, dịch phải logic vs số học, chương trình chạy thật.',
  `<span class="eyebrow">ICS102 · Chapter 2 · Lesson 2.2</span>
<h2>Bit-level operations, masks, logical operators and shifts</h2>
<p class="lead">C lets you work on the individual bits of an integer. These operations are everywhere in systems code: flags and permissions, network headers, hash functions, graphics, compression and the fastest arithmetic tricks. They are also the heart of the CS:APP Data Lab.</p>
<h3>🎯 Objectives</h3>
<ul><li>Apply &amp;, |, ^, ~ to bit vectors.</li><li>Use masks to extract, clear, set or flip chosen bits.</li><li>Distinguish bitwise operators from logical operators &amp;&amp;, ||, !.</li><li>Predict the result of left shifts, logical right shifts and arithmetic right shifts.</li></ul>
<h3>📖 Lecture</h3>
<h4>Boolean algebra on bit vectors</h4>
<p>The operators work on each bit position independently: <code>&amp;</code> (AND: 1 if both are 1), <code>|</code> (OR: 1 if at least one is 1), <code>^</code> (XOR: 1 if exactly one is 1), <code>~</code> (NOT: flip every bit). A bit vector of length w can represent a <strong>set</strong>: bit i = 1 means element i is in the set; then &amp; is intersection, | is union and ~ is complement.</p>
<div class="callout"><p><b>Example.</b> a = 0x69 = 0110 1001, b = 0x55 = 0101 0101.<br>a &amp; b = 0100 0001 = <b>0x41</b> · a | b = 0111 1101 = <b>0x7D</b> · a ^ b = 0011 1100 = <b>0x3C</b> · ~a = 1001 0110 = <b>0x96</b>.</p></div>
<h4>Masks</h4>
<p>A <strong>mask</strong> is a bit pattern that selects bits:</p>
<ul>
<li><code>x &amp; 0xFF</code> keeps the low byte and clears everything else.</li>
<li><code>x | 0xFF</code> sets the low byte to all ones.</li>
<li><code>x ^ ~0xFF</code> flips every bit except the low byte.</li>
<li><code>x &amp; (1 &lt;&lt; k)</code> tests bit k; <code>x &amp; ~(1 &lt;&lt; k)</code> clears it.</li>
</ul>
<p>Writing <code>~0xFF</code> instead of <code>0xFFFFFF00</code> makes the code independent of the word size.</p>
<h4>Logical operators are different</h4>
<p><code>&amp;&amp;</code>, <code>||</code>, <code>!</code> treat any non-zero value as true and always return 0 or 1. They also <strong>short-circuit</strong>: in <code>p &amp;&amp; *p</code> the second operand is never evaluated if <code>p</code> is null. So <code>0x69 &amp; 0x55</code> is 0x41 but <code>0x69 &amp;&amp; 0x55</code> is 1; <code>!0x41</code> is 0 and <code>!!0x41</code> is 1.</p>
<h4>Shifts</h4>
<ul>
<li><code>x &lt;&lt; k</code> moves bits left by k, dropping the high k bits and filling with zeros on the right.</li>
<li><strong>Logical</strong> right shift fills the left with zeros; <strong>arithmetic</strong> right shift copies the most significant bit (sign bit). In C, unsigned values always shift logically; for negative signed values the C standard leaves it implementation-defined, but all common compilers on x86-64 and ARM shift arithmetically (Java makes this explicit with two operators: <code>&gt;&gt;</code> arithmetic and <code>&gt;&gt;&gt;</code> logical).</li>
<li>Shifting by k ≥ the width (e.g. <code>x &lt;&lt; 32</code> for a 32-bit int) is undefined in C — do not do it.</li>
</ul>
<h3>✍️ Worked example</h3>
` + C(SRC_BITS) + `
<p>Real output:</p>
` + out(OUT_BITS) + `
<p>Check by hand: 0x96 = 1001 0110. Arithmetic shift right by 4 copies the leading 1: 1111 1001 = 0xF9. Logical shift fills with 0: 0000 1001 = 0x09.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Writing <code>if (flags &amp; MASK == 0)</code>: <code>==</code> binds tighter than <code>&amp;</code>. Write <code>if ((flags &amp; MASK) == 0)</code>.</li><li>Using <code>&amp;</code> where <code>&amp;&amp;</code> was meant (no short-circuit, different result for values like 1 &amp; 2 = 0).</li><li>Right-shifting a negative signed value and expecting zeros on the left.</li><li>Shifting by the full width or by a negative amount.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>&amp; | ^ ~ operate bit by bit; masks select bits.</li><li>&amp;&amp; || ! return 0/1 and short-circuit.</li><li>Left shift fills zeros; right shift is logical for unsigned, arithmetic for signed.</li><li>Shift amounts must be between 0 and width − 1.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://csapp.cs.cmu.edu/3e/labs.html" target="_blank" rel="noopener">CS:APP Data Lab — puzzles using only bit operations</a></li><li><a href="https://www.cs.cmu.edu/~213/schedule.html" target="_blank" rel="noopener">CMU 15-213 — lecture “Bits, Bytes and Integers”</a></li><li><a href="https://godbolt.org/" target="_blank" rel="noopener">Compiler Explorer — see how shifts compile</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Write an expression that sets the 3 lowest bits of x to 1 and leaves the others unchanged.</li><li>Evaluate for x = 0x66, y = 0x39: x &amp; y, x &amp;&amp; y, x | y, ~x | ~y (8-bit).</li><li>For the 8-bit value 0xD4, give x &lt;&lt; 3, logical x &gt;&gt; 2, arithmetic x &gt;&gt; 2.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) <code>x | 0x7</code>. 2) 0x66 &amp; 0x39 = 0x20; x &amp;&amp; y = 1; x | y = 0x7F; ~x | ~y = ~(x &amp; y) = 0xDF. 3) 1101 0100: &lt;&lt; 3 = 1010 0000 = 0xA0; logical &gt;&gt; 2 = 0011 0101 = 0x35; arithmetic &gt;&gt; 2 = 1111 0101 = 0xF5.</p></div>`,
  `<span class="eyebrow">ICS102 · Chương 2 · Bài 2.2</span>
<h2>Phép toán mức bit, mặt nạ, toán tử logic và phép dịch</h2>
<p class="lead">C cho phép thao tác từng bit của một số nguyên. Các phép này có mặt khắp nơi trong code hệ thống: cờ và quyền truy cập, header gói tin mạng, hàm băm, đồ hoạ, nén, và các mẹo tính toán nhanh nhất. Chúng cũng là trái tim của bài Data Lab trong CS:APP.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Áp dụng &amp;, |, ^, ~ trên vectơ bit.</li><li>Dùng mặt nạ để lấy, xoá, bật hay đảo các bit chọn trước.</li><li>Phân biệt toán tử bit với toán tử logic &amp;&amp;, ||, !.</li><li>Dự đoán kết quả dịch trái, dịch phải logic và dịch phải số học.</li></ul>
<h3>📖 Bài giảng</h3>
<h4>Đại số Boole trên vectơ bit</h4>
<p>Các toán tử làm việc trên từng vị trí bit độc lập: <code>&amp;</code> (VÀ: 1 nếu cả hai là 1), <code>|</code> (HOẶC: 1 nếu ít nhất một là 1), <code>^</code> (XOR: 1 nếu đúng một bit là 1), <code>~</code> (PHỦ ĐỊNH: đảo mọi bit). Một vectơ bit dài w biểu diễn được một <strong>tập hợp</strong>: bit i = 1 nghĩa là phần tử i thuộc tập; khi đó &amp; là giao, | là hợp, ~ là phần bù.</p>
<div class="callout"><p><b>Ví dụ.</b> a = 0x69 = 0110 1001, b = 0x55 = 0101 0101.<br>a &amp; b = 0100 0001 = <b>0x41</b> · a | b = 0111 1101 = <b>0x7D</b> · a ^ b = 0011 1100 = <b>0x3C</b> · ~a = 1001 0110 = <b>0x96</b>.</p></div>
<h4>Mặt nạ</h4>
<p><strong>Mặt nạ (mask)</strong> là mẫu bit dùng để chọn bit:</p>
<ul>
<li><code>x &amp; 0xFF</code> giữ byte thấp, xoá phần còn lại.</li>
<li><code>x | 0xFF</code> đặt byte thấp thành toàn số 1.</li>
<li><code>x ^ ~0xFF</code> đảo mọi bit trừ byte thấp.</li>
<li><code>x &amp; (1 &lt;&lt; k)</code> kiểm bit k; <code>x &amp; ~(1 &lt;&lt; k)</code> xoá bit k.</li>
</ul>
<p>Viết <code>~0xFF</code> thay vì <code>0xFFFFFF00</code> làm code không phụ thuộc kích thước từ.</p>
<h4>Toán tử logic thì khác</h4>
<p><code>&amp;&amp;</code>, <code>||</code>, <code>!</code> coi mọi giá trị khác 0 là đúng và luôn trả 0 hoặc 1. Chúng còn <strong>đánh giá tắt</strong>: trong <code>p &amp;&amp; *p</code>, vế hai không bao giờ được tính nếu <code>p</code> là null. Vì vậy <code>0x69 &amp; 0x55</code> là 0x41 nhưng <code>0x69 &amp;&amp; 0x55</code> là 1; <code>!0x41</code> là 0 và <code>!!0x41</code> là 1.</p>
<h4>Phép dịch</h4>
<ul>
<li><code>x &lt;&lt; k</code> dịch bit sang trái k vị trí, bỏ k bit cao, điền 0 bên phải.</li>
<li>Dịch phải <strong>logic</strong> điền 0 bên trái; dịch phải <strong>số học</strong> chép bit quan trọng nhất (bit dấu). Trong C, số không dấu luôn dịch logic; với số có dấu âm, chuẩn C để “tuỳ hiện thực” (implementation-defined), nhưng mọi trình biên dịch phổ biến trên x86-64 và ARM đều dịch số học (Java nói rõ bằng hai toán tử: <code>&gt;&gt;</code> số học và <code>&gt;&gt;&gt;</code> logic).</li>
<li>Dịch k ≥ độ rộng (vd <code>x &lt;&lt; 32</code> với int 32 bit) là hành vi không xác định trong C — đừng làm.</li>
</ul>
<h3>✍️ Ví dụ</h3>
` + C(SRC_BITS) + `
<p>Output thật:</p>
` + out(OUT_BITS) + `
<p>Kiểm bằng tay: 0x96 = 1001 0110. Dịch phải số học 4 bit chép số 1 đầu: 1111 1001 = 0xF9. Dịch logic điền 0: 0000 1001 = 0x09.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Viết <code>if (flags &amp; MASK == 0)</code>: <code>==</code> ưu tiên cao hơn <code>&amp;</code>. Phải viết <code>if ((flags &amp; MASK) == 0)</code>.</li><li>Dùng <code>&amp;</code> khi định dùng <code>&amp;&amp;</code> (không đánh giá tắt, kết quả khác với giá trị như 1 &amp; 2 = 0).</li><li>Dịch phải một số có dấu âm mà mong bên trái điền 0.</li><li>Dịch bằng đúng độ rộng hoặc bằng số âm.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>&amp; | ^ ~ làm việc từng bit; mặt nạ chọn bit.</li><li>&amp;&amp; || ! trả 0/1 và đánh giá tắt.</li><li>Dịch trái điền 0; dịch phải là logic với số không dấu, số học với số có dấu.</li><li>Số bit dịch phải nằm trong 0 tới độ rộng − 1.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://csapp.cs.cmu.edu/3e/labs.html" target="_blank" rel="noopener">CS:APP Data Lab — câu đố chỉ dùng phép toán bit</a></li><li><a href="https://www.cs.cmu.edu/~213/schedule.html" target="_blank" rel="noopener">CMU 15-213 — bài giảng “Bits, Bytes and Integers”</a></li><li><a href="https://godbolt.org/" target="_blank" rel="noopener">Compiler Explorer — xem phép dịch được biên dịch thế nào</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Viết biểu thức bật 3 bit thấp nhất của x thành 1, giữ nguyên các bit khác.</li><li>Tính với x = 0x66, y = 0x39: x &amp; y, x &amp;&amp; y, x | y, ~x | ~y (8 bit).</li><li>Với giá trị 8 bit 0xD4, cho x &lt;&lt; 3, x &gt;&gt; 2 logic, x &gt;&gt; 2 số học.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) <code>x | 0x7</code>. 2) 0x66 &amp; 0x39 = 0x20; x &amp;&amp; y = 1; x | y = 0x7F; ~x | ~y = ~(x &amp; y) = 0xDF. 3) 1101 0100: &lt;&lt; 3 = 1010 0000 = 0xA0; &gt;&gt; 2 logic = 0011 0101 = 0x35; &gt;&gt; 2 số học = 1111 0101 = 0xF5.</p></div>`);

const SRC_CONV = String.raw`
#include <stdio.h>
#include <limits.h>
int main(void) {
    int x = -1;
    unsigned u = (unsigned) x;                 /* same bits, new meaning */
    printf("(unsigned)-1  = %u (0x%x)\n", u, u);
    printf("-1 < 0U       = %d\n", -1 < 0U);   /* -1 is converted to UINT_MAX! */
    printf("INT_MIN, INT_MAX = %d, %d\n", INT_MIN, INT_MAX);
    short sx = -12345;
    int ix = sx;                               /* sign extension */
    unsigned short usx = (unsigned short) sx;
    unsigned uix = usx;                        /* zero extension */
    printf("short -12345 -> int: %d (0x%08x)\n", ix, (unsigned) ix);
    printf("unsigned short %u -> unsigned: 0x%08x\n", usx, uix);
    int big = 53191;
    short t = (short) big;                     /* truncation keeps the low 16 bits */
    printf("(short)53191  = %d\n", t);
    return 0;
}
`;
const OUT_CONV = String.raw`
(unsigned)-1  = 4294967295 (0xffffffff)
-1 < 0U       = 0
INT_MIN, INT_MAX = -2147483648, 2147483647
short -12345 -> int: -12345 (0xffffcfc7)
unsigned short 53191 -> unsigned: 0x0000cfc7
(short)53191  = -12345
`;

const c23 = L('ics102-ts-2-3',
  '2.3 — Integer representations: unsigned, two\'s complement, conversions|||2.3 — Biểu diễn số nguyên: không dấu, bù hai, chuyển đổi',
  'Công thức B2U và B2T, miền giá trị, vì sao bù hai thắng, ép kiểu có dấu ↔ không dấu (giữ bit), bẫy so sánh -1 < 0U, mở rộng dấu/mở rộng 0, cắt bớt; chương trình chạy thật.',
  `<span class="eyebrow">ICS102 · Chapter 2 · Lesson 2.3</span>
<h2>Integer representations: unsigned, two's complement, conversions</h2>
<p class="lead">A w-bit pattern can be read as an unsigned number or as a signed number. Almost every machine uses <strong>two's complement</strong> for signed integers. Knowing exactly how the two readings relate explains a famous family of C bugs where a comparison or a loop does the opposite of what you meant.</p>
<h3>🎯 Objectives</h3>
<ul><li>Compute the unsigned and two's-complement value of a bit vector.</li><li>State the ranges UMax, TMin, TMax for a given width.</li><li>Predict the result of signed ↔ unsigned casts and of mixed comparisons.</li><li>Explain sign extension, zero extension and truncation.</li></ul>
<h3>📖 Lecture</h3>
<h4>Unsigned encoding</h4>
<div class="formula"><span class="lbl">B2U (binary to unsigned)</span>B2U<sub>w</sub>(x) = ∑<sub>i=0</sub><sup>w−1</sup> x<sub>i</sub>·2<sup>i</sup>        range 0 … UMax<sub>w</sub> = 2<sup>w</sup> − 1</div>
<h4>Two's-complement encoding</h4>
<p>The most significant bit gets a <strong>negative</strong> weight:</p>
<div class="formula"><span class="lbl">B2T (binary to two's complement)</span>B2T<sub>w</sub>(x) = −x<sub>w−1</sub>·2<sup>w−1</sup> + ∑<sub>i=0</sub><sup>w−2</sup> x<sub>i</sub>·2<sup>i</sup>        range TMin<sub>w</sub> = −2<sup>w−1</sup> … TMax<sub>w</sub> = 2<sup>w−1</sup> − 1</div>
<div class="callout"><p><b>Example (w = 4).</b> 1011: unsigned = 8 + 2 + 1 = 11; two's complement = −8 + 2 + 1 = <b>−5</b>.<br>0111 = 7 = TMax<sub>4</sub>; 1000 = −8 = TMin<sub>4</sub>; 1111 = −1.<br><b>Quick negation:</b> −x = ~x + 1. For 5 = 0101: ~0101 = 1010, +1 = 1011 = −5 ✓.<br>For w = 32: TMin = −2 147 483 648, TMax = 2 147 483 647, UMax = 4 294 967 295.</p></div>
<p>Facts to remember: the range is asymmetric (|TMin| = TMax + 1, so −TMin overflows to TMin); −1 is all ones, the same pattern as UMax; and the hardware adder is the same for signed and unsigned — that is why two's complement won.</p>
<h4>Conversions between signed and unsigned</h4>
<p>In C, casting between signed and unsigned of the same size <strong>keeps the bits</strong> and changes only the interpretation:</p>
<div class="formula"><span class="lbl">T2U</span>T2U<sub>w</sub>(x) = x + 2<sup>w</sup> if x &lt; 0, otherwise x</div>
<p>Dangerous detail: when an expression mixes signed and unsigned operands, C <strong>converts the signed one to unsigned</strong>. So <code>-1 &lt; 0U</code> compares 4 294 967 295 &lt; 0 and is <strong>false</strong>.</p>
<h4>Extension and truncation</h4>
<ul>
<li><strong>Zero extension</strong> (unsigned to a wider type): add zeros on the left.</li>
<li><strong>Sign extension</strong> (signed to a wider type): copy the sign bit to the left; the value is preserved. 0xCFC7 (−12345 as short) becomes 0xFFFFCFC7.</li>
<li><strong>Truncation</strong> (to a narrower type): drop the high bits. The value changes when it does not fit: 53191 = 0x0000CFC7 truncated to 16 bits is 0xCFC7 = −12345.</li>
</ul>
<h3>✍️ Worked example</h3>
` + C(SRC_CONV) + `
<p>Real output:</p>
` + out(OUT_CONV) + `
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li><code>for (unsigned i = n - 1; i &gt;= 0; i--)</code> never ends: an unsigned value is always ≥ 0, and 0 − 1 wraps to UMax.</li><li>Comparing <code>sizeof(...)</code> (type <code>size_t</code>, unsigned) with a negative int: <code>if (len - sizeof(x) &gt;= 0)</code> is always true.</li><li>Writing TMin as <code>-2147483648</code> — that is −(2147483648); the literal 2147483648 does not fit in int, so it gets a wider type and mixed expressions can surprise you; use <code>INT_MIN</code>.</li><li>Truncating a value and assuming it is unchanged.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Unsigned: all weights positive. Two's complement: the top bit weighs −2<sup>w−1</sup>.</li><li>−x = ~x + 1; −1 = all ones; |TMin| = TMax + 1.</li><li>Signed ↔ unsigned casts keep the bits; mixed expressions become unsigned.</li><li>Sign extension preserves value; truncation may not.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Two%27s_complement" target="_blank" rel="noopener">Wikipedia — Two's complement</a></li><li><a href="https://www.cs.cmu.edu/~213/schedule.html" target="_blank" rel="noopener">CMU 15-213 — lecture slides “Bits, Bytes and Integers”</a></li><li><a href="https://www.informit.com/store/c-programming-language-9780131103627" target="_blank" rel="noopener">K&amp;R, The C Programming Language — type conversions (section 2.7)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>For w = 8, give the two's-complement value of 0xA5 and of 0x7F.</li><li>What does <code>(unsigned char)-3</code> equal? What does <code>(signed char)200</code> equal?</li><li>Is <code>2147483647 &gt; (int)2147483648U</code> true or false? Why?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 0xA5 = 1010 0101 = −128 + 37 = −91; 0x7F = 127. 2) −3 + 256 = 253; 200 − 256 = −56. 3) True: (int)2147483648U has bits 0x80000000 = TMin = −2147483648, and TMax &gt; TMin.</p></div>`,
  `<span class="eyebrow">ICS102 · Chương 2 · Bài 2.3</span>
<h2>Biểu diễn số nguyên: không dấu, bù hai, chuyển đổi</h2>
<p class="lead">Một mẫu w bit có thể được đọc như số không dấu hoặc số có dấu. Gần như mọi máy dùng <strong>bù hai (two's complement)</strong> cho số có dấu. Biết chính xác hai cách đọc liên hệ thế nào sẽ giải thích một họ lỗi C nổi tiếng, nơi phép so sánh hay vòng lặp làm điều ngược với ý bạn.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính giá trị không dấu và bù hai của một vectơ bit.</li><li>Nêu miền UMax, TMin, TMax với độ rộng cho trước.</li><li>Dự đoán kết quả ép kiểu có dấu ↔ không dấu và so sánh trộn kiểu.</li><li>Giải thích mở rộng dấu, mở rộng 0 và cắt bớt.</li></ul>
<h3>📖 Bài giảng</h3>
<h4>Mã hoá không dấu</h4>
<div class="formula"><span class="lbl">B2U (nhị phân sang không dấu)</span>B2U<sub>w</sub>(x) = ∑<sub>i=0</sub><sup>w−1</sup> x<sub>i</sub>·2<sup>i</sup>        miền 0 … UMax<sub>w</sub> = 2<sup>w</sup> − 1</div>
<h4>Mã hoá bù hai</h4>
<p>Bit quan trọng nhất mang trọng số <strong>âm</strong>:</p>
<div class="formula"><span class="lbl">B2T (nhị phân sang bù hai)</span>B2T<sub>w</sub>(x) = −x<sub>w−1</sub>·2<sup>w−1</sup> + ∑<sub>i=0</sub><sup>w−2</sup> x<sub>i</sub>·2<sup>i</sup>        miền TMin<sub>w</sub> = −2<sup>w−1</sup> … TMax<sub>w</sub> = 2<sup>w−1</sup> − 1</div>
<div class="callout"><p><b>Ví dụ (w = 4).</b> 1011: không dấu = 8 + 2 + 1 = 11; bù hai = −8 + 2 + 1 = <b>−5</b>.<br>0111 = 7 = TMax<sub>4</sub>; 1000 = −8 = TMin<sub>4</sub>; 1111 = −1.<br><b>Đổi dấu nhanh:</b> −x = ~x + 1. Với 5 = 0101: ~0101 = 1010, +1 = 1011 = −5 ✓.<br>Với w = 32: TMin = −2 147 483 648, TMax = 2 147 483 647, UMax = 4 294 967 295.</p></div>
<p>Cần nhớ: miền không đối xứng (|TMin| = TMax + 1, nên −TMin tràn về TMin); −1 là toàn bit 1, cùng mẫu với UMax; và bộ cộng phần cứng giống nhau cho số có dấu và không dấu — đó là lý do bù hai thắng.</p>
<h4>Chuyển đổi có dấu ↔ không dấu</h4>
<p>Trong C, ép kiểu giữa có dấu và không dấu cùng kích thước <strong>giữ nguyên bit</strong>, chỉ đổi cách diễn giải:</p>
<div class="formula"><span class="lbl">T2U</span>T2U<sub>w</sub>(x) = x + 2<sup>w</sup> nếu x &lt; 0, ngược lại x</div>
<p>Chi tiết nguy hiểm: khi biểu thức trộn toán hạng có dấu và không dấu, C <strong>đổi toán hạng có dấu sang không dấu</strong>. Vì vậy <code>-1 &lt; 0U</code> so sánh 4 294 967 295 &lt; 0 và <strong>sai</strong>.</p>
<h4>Mở rộng và cắt bớt</h4>
<ul>
<li><strong>Mở rộng 0</strong> (số không dấu sang kiểu rộng hơn): thêm 0 bên trái.</li>
<li><strong>Mở rộng dấu</strong> (số có dấu sang kiểu rộng hơn): chép bit dấu sang trái; giá trị được giữ. 0xCFC7 (−12345 kiểu short) thành 0xFFFFCFC7.</li>
<li><strong>Cắt bớt</strong> (sang kiểu hẹp hơn): bỏ các bit cao. Giá trị đổi nếu không vừa: 53191 = 0x0000CFC7 cắt còn 16 bit là 0xCFC7 = −12345.</li>
</ul>
<h3>✍️ Ví dụ</h3>
` + C(SRC_CONV) + `
<p>Output thật:</p>
` + out(OUT_CONV) + `
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li><code>for (unsigned i = n - 1; i &gt;= 0; i--)</code> không bao giờ dừng: số không dấu luôn ≥ 0, và 0 − 1 quay vòng thành UMax.</li><li>So sánh <code>sizeof(...)</code> (kiểu <code>size_t</code>, không dấu) với int âm: <code>if (len - sizeof(x) &gt;= 0)</code> luôn đúng.</li><li>Viết TMin là <code>-2147483648</code> — đó là −(2147483648); hằng 2147483648 không vừa int nên mang kiểu rộng hơn và biểu thức trộn kiểu có thể gây bất ngờ; dùng <code>INT_MIN</code>.</li><li>Cắt bớt một giá trị rồi tưởng nó không đổi.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Không dấu: mọi trọng số dương. Bù hai: bit đầu nặng −2<sup>w−1</sup>.</li><li>−x = ~x + 1; −1 = toàn bit 1; |TMin| = TMax + 1.</li><li>Ép có dấu ↔ không dấu giữ bit; biểu thức trộn kiểu trở thành không dấu.</li><li>Mở rộng dấu giữ giá trị; cắt bớt có thể làm đổi.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Two%27s_complement" target="_blank" rel="noopener">Wikipedia — Two's complement (bù hai)</a></li><li><a href="https://www.cs.cmu.edu/~213/schedule.html" target="_blank" rel="noopener">CMU 15-213 — slide “Bits, Bytes and Integers”</a></li><li><a href="https://www.informit.com/store/c-programming-language-9780131103627" target="_blank" rel="noopener">K&amp;R, The C Programming Language — chuyển đổi kiểu (mục 2.7)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Với w = 8, cho giá trị bù hai của 0xA5 và 0x7F.</li><li><code>(unsigned char)-3</code> bằng bao nhiêu? <code>(signed char)200</code> bằng bao nhiêu?</li><li><code>2147483647 &gt; (int)2147483648U</code> đúng hay sai? Vì sao?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 0xA5 = 1010 0101 = −128 + 37 = −91; 0x7F = 127. 2) −3 + 256 = 253; 200 − 256 = −56. 3) Đúng: (int)2147483648U có bit 0x80000000 = TMin = −2147483648, và TMax &gt; TMin.</p></div>`);

const SRC_ARITH = String.raw`
#include <stdio.h>
#include <limits.h>
int main(void) {
    unsigned a = UINT_MAX;
    printf("UINT_MAX + 1      = %u\n", a + 1);
    int m = INT_MAX;
    printf("INT_MAX + 1 (wrap)= %d\n", (int)((unsigned) m + 1u));
    printf("200 * 300 * 400 * 500 (int) = %d\n", (int)(200u * 300u * 400u * 500u));
    printf("13 * 8 = %d, 13 << 3 = %d\n", 13 * 8, 13 << 3);
    printf("x * 14 = (x<<4) - (x<<1): %d %d\n", 9 * 14, (9 << 4) - (9 << 1));
    printf("-7 / 2 = %d, -7 >> 1 = %d, (-7 + 1) >> 1 = %d\n", -7 / 2, -7 >> 1, (-7 + 1) >> 1);
    return 0;
}
`;
const OUT_ARITH = String.raw`
UINT_MAX + 1      = 0
INT_MAX + 1 (wrap)= -2147483648
200 * 300 * 400 * 500 (int) = -884901888
13 * 8 = 104, 13 << 3 = 104
x * 14 = (x<<4) - (x<<1): 126 126
-7 / 2 = -3, -7 >> 1 = -4, (-7 + 1) >> 1 = -3
`;

const c24 = L('ics102-ts-2-4',
  '2.4 — Integer arithmetic: overflow, multiplication and division by shifts|||2.4 — Số học số nguyên: tràn số, nhân và chia bằng phép dịch',
  'Cộng không dấu và bù hai theo modulo 2^w, phát hiện tràn, vì sao 200*300*400*500 âm, tràn số có dấu là hành vi không xác định trong C, nhân bằng dịch + cộng, chia bằng dịch và hệ số lệch (bias).',
  `<span class="eyebrow">ICS102 · Chapter 2 · Lesson 2.4</span>
<h2>Integer arithmetic: overflow, multiplication and division by shifts</h2>
<p class="lead">Computer integers are not mathematical integers: they have a fixed width, so arithmetic is done <strong>modulo 2<sup>w</sup></strong>. That is the source of overflow bugs (and of real security vulnerabilities), and also of fast tricks that compilers use every day.</p>
<h3>🎯 Objectives</h3>
<ul><li>Compute unsigned and two's-complement sums and products with overflow.</li><li>Detect overflow correctly.</li><li>Rewrite multiplication by a constant as shifts and adds.</li><li>Explain why division by a power of 2 needs a bias for negative numbers.</li></ul>
<h3>📖 Lecture</h3>
<h4>Addition</h4>
<div class="formula"><span class="lbl">Unsigned addition</span>x +<sup>u</sup><sub>w</sub> y = (x + y) mod 2<sup>w</sup>        overflow ⇔ the result s &lt; x</div>
<div class="formula"><span class="lbl">Two's-complement addition</span>same bit-level addition; the true sum is wrapped into [TMin, TMax]<br>positive overflow ⇔ x &gt; 0, y &gt; 0, s ≤ 0        negative overflow ⇔ x &lt; 0, y &lt; 0, s ≥ 0</div>
<div class="callout"><p><b>Example (w = 4).</b> Unsigned 13 + 5 = 18 → 18 − 16 = <b>2</b> (overflow: 2 &lt; 13).<br>Two's complement 5 + 5 = 10 → 0101 + 0101 = 1010 = <b>−6</b> (positive overflow).<br>−8 + −5 = −13 → 1000 + 1011 = 1 0011 → drop the carry → 0011 = <b>3</b> (negative overflow).</p></div>
<p>Important for C: <strong>unsigned</strong> overflow is defined (it wraps). <strong>Signed</strong> overflow is <em>undefined behaviour</em> — the compiler may assume it never happens and optimise accordingly (for example, delete an <code>if (x + 1 &lt; x)</code> check). In our example we therefore computed the wrapped value through unsigned arithmetic.</p>
<h4>Multiplication</h4>
<p>The product of two w-bit numbers can need 2w bits; C keeps only the low w bits (truncation). The classic CS:APP example: 200 · 300 · 400 · 500 = 12 000 000 000 does not fit in 32 bits and prints as <strong>−884 901 888</strong>.</p>
<p>Multiplying is slower than shifting and adding, so compilers rewrite multiplication by a constant: <code>x * 8</code> = <code>x &lt;&lt; 3</code>; <code>x * 14</code> = <code>(x &lt;&lt; 4) − (x &lt;&lt; 1)</code> because 14 = 16 − 2. This is correct even when it overflows, because both sides wrap the same way.</p>
<h4>Division by powers of 2</h4>
<p>Right shift by k divides by 2<sup>k</sup> but rounds <strong>down</strong> (toward −∞). C integer division rounds <strong>toward zero</strong>. For non-negative x they agree; for negative x they do not: −7 &gt;&gt; 1 = −4 but −7 / 2 = −3. Compilers fix this by adding a <strong>bias</strong> of 2<sup>k</sup> − 1 before shifting when x is negative:</p>
<div class="formula"><span class="lbl">Signed division by 2^k</span>x / 2<sup>k</sup> = (x &lt; 0 ? x + (1 &lt;&lt; k) − 1 : x) &gt;&gt; k</div>
<h3>✍️ Worked example</h3>
` + C(SRC_ARITH) + `
<p>Real output:</p>
` + out(OUT_ARITH) + `
<p>Check: with k = 1 the bias is 1, so (−7 + 1) &gt;&gt; 1 = −6 &gt;&gt; 1 = −3, matching −7 / 2.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Writing <code>if (a + b &lt; a)</code> to detect <em>signed</em> overflow — it is undefined behaviour; use <code>__builtin_add_overflow</code> or check before adding.</li><li><code>malloc(n * sizeof(T))</code> where <code>n * sizeof(T)</code> overflows — a classic security bug; use <code>calloc(n, sizeof(T))</code>, which checks.</li><li>Replacing <code>x / 2</code> by <code>x &gt;&gt; 1</code> for signed x and getting wrong answers for negative numbers.</li><li>Thinking −TMin = TMax + 1 in C: it overflows back to TMin.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>w-bit arithmetic is modulo 2<sup>w</sup>; unsigned and two's-complement addition use the same bits.</li><li>Unsigned overflow wraps (defined); signed overflow is undefined in C.</li><li>Multiplication by constants → shifts and adds.</li><li>Signed division by 2<sup>k</sup> needs a bias for negatives to round toward zero.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Integer_overflow" target="_blank" rel="noopener">Wikipedia — Integer overflow (with real incidents)</a></li><li><a href="https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html" target="_blank" rel="noopener">GCC docs — -fsanitize=undefined detects signed overflow</a></li><li><a href="https://godbolt.org/" target="_blank" rel="noopener">Compiler Explorer — compile x*14 and x/4 at -O1 and look for shifts</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>w = 8 unsigned: 200 + 100 = ? Did it overflow?</li><li>w = 8 two's complement: 100 + 50 = ? −100 + −50 = ?</li><li>Write x * 31 and x * 40 with shifts and +/−.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 300 − 256 = 44, overflow (44 &lt; 200). 2) 150 − 256 = −106 (positive overflow); −150 + 256 = 106 (negative overflow). 3) 31 = 32 − 1: (x &lt;&lt; 5) − x; 40 = 32 + 8: (x &lt;&lt; 5) + (x &lt;&lt; 3).</p></div>`,
  `<span class="eyebrow">ICS102 · Chương 2 · Bài 2.4</span>
<h2>Số học số nguyên: tràn số, nhân và chia bằng phép dịch</h2>
<p class="lead">Số nguyên trong máy không phải số nguyên toán học: chúng có độ rộng cố định, nên phép toán được làm <strong>theo modulo 2<sup>w</sup></strong>. Đó là nguồn gốc của lỗi tràn số (và cả lỗ hổng bảo mật thật), đồng thời là nguồn của các mẹo tính nhanh mà trình biên dịch dùng hằng ngày.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính tổng và tích không dấu, bù hai có tràn.</li><li>Phát hiện tràn số đúng cách.</li><li>Viết lại phép nhân với hằng số bằng dịch và cộng.</li><li>Giải thích vì sao chia cho luỹ thừa của 2 cần hệ số lệch với số âm.</li></ul>
<h3>📖 Bài giảng</h3>
<h4>Phép cộng</h4>
<div class="formula"><span class="lbl">Cộng không dấu</span>x +<sup>u</sup><sub>w</sub> y = (x + y) mod 2<sup>w</sup>        tràn ⇔ kết quả s &lt; x</div>
<div class="formula"><span class="lbl">Cộng bù hai</span>cùng phép cộng mức bit; tổng thật bị quấn vào [TMin, TMax]<br>tràn dương ⇔ x &gt; 0, y &gt; 0, s ≤ 0        tràn âm ⇔ x &lt; 0, y &lt; 0, s ≥ 0</div>
<div class="callout"><p><b>Ví dụ (w = 4).</b> Không dấu 13 + 5 = 18 → 18 − 16 = <b>2</b> (tràn: 2 &lt; 13).<br>Bù hai 5 + 5 = 10 → 0101 + 0101 = 1010 = <b>−6</b> (tràn dương).<br>−8 + −5 = −13 → 1000 + 1011 = 1 0011 → bỏ bit nhớ → 0011 = <b>3</b> (tràn âm).</p></div>
<p>Quan trọng với C: tràn <strong>không dấu</strong> được định nghĩa (quay vòng). Tràn <strong>có dấu</strong> là <em>hành vi không xác định</em> — trình biên dịch được phép giả định nó không bao giờ xảy ra và tối ưu theo đó (ví dụ xoá luôn phép kiểm <code>if (x + 1 &lt; x)</code>). Vì vậy trong ví dụ ta tính giá trị quay vòng thông qua số học không dấu.</p>
<h4>Phép nhân</h4>
<p>Tích hai số w bit có thể cần 2w bit; C chỉ giữ w bit thấp (cắt bớt). Ví dụ kinh điển của CS:APP: 200 · 300 · 400 · 500 = 12 000 000 000 không vừa 32 bit và in ra <strong>−884 901 888</strong>.</p>
<p>Nhân chậm hơn dịch và cộng, nên trình biên dịch viết lại phép nhân với hằng: <code>x * 8</code> = <code>x &lt;&lt; 3</code>; <code>x * 14</code> = <code>(x &lt;&lt; 4) − (x &lt;&lt; 1)</code> vì 14 = 16 − 2. Cách này đúng cả khi tràn, vì hai vế quay vòng như nhau.</p>
<h4>Chia cho luỹ thừa của 2</h4>
<p>Dịch phải k bit chia cho 2<sup>k</sup> nhưng làm tròn <strong>xuống</strong> (về −∞). Phép chia số nguyên của C làm tròn <strong>về 0</strong>. Với x không âm hai cách trùng nhau; với x âm thì không: −7 &gt;&gt; 1 = −4 nhưng −7 / 2 = −3. Trình biên dịch sửa bằng cách cộng <strong>hệ số lệch (bias)</strong> 2<sup>k</sup> − 1 trước khi dịch khi x âm:</p>
<div class="formula"><span class="lbl">Chia có dấu cho 2^k</span>x / 2<sup>k</sup> = (x &lt; 0 ? x + (1 &lt;&lt; k) − 1 : x) &gt;&gt; k</div>
<h3>✍️ Ví dụ</h3>
` + C(SRC_ARITH) + `
<p>Output thật:</p>
` + out(OUT_ARITH) + `
<p>Kiểm: với k = 1 hệ số lệch là 1, nên (−7 + 1) &gt;&gt; 1 = −6 &gt;&gt; 1 = −3, khớp −7 / 2.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Viết <code>if (a + b &lt; a)</code> để phát hiện tràn <em>có dấu</em> — đó là hành vi không xác định; dùng <code>__builtin_add_overflow</code> hoặc kiểm trước khi cộng.</li><li><code>malloc(n * sizeof(T))</code> khi <code>n * sizeof(T)</code> bị tràn — lỗi bảo mật kinh điển; dùng <code>calloc(n, sizeof(T))</code>, hàm này có kiểm.</li><li>Thay <code>x / 2</code> bằng <code>x &gt;&gt; 1</code> với x có dấu, ra sai với số âm.</li><li>Tưởng −TMin = TMax + 1 trong C: nó tràn quay về TMin.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Phép toán w bit là modulo 2<sup>w</sup>; cộng không dấu và bù hai dùng cùng các bit.</li><li>Tràn không dấu quay vòng (xác định); tràn có dấu là không xác định trong C.</li><li>Nhân với hằng → dịch và cộng.</li><li>Chia có dấu cho 2<sup>k</sup> cần hệ số lệch với số âm để làm tròn về 0.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Integer_overflow" target="_blank" rel="noopener">Wikipedia — Integer overflow (kèm sự cố thật)</a></li><li><a href="https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html" target="_blank" rel="noopener">Tài liệu GCC — -fsanitize=undefined bắt tràn có dấu</a></li><li><a href="https://godbolt.org/" target="_blank" rel="noopener">Compiler Explorer — biên dịch x*14 và x/4 ở -O1, tìm phép dịch</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>w = 8 không dấu: 200 + 100 = ? Có tràn không?</li><li>w = 8 bù hai: 100 + 50 = ? −100 + −50 = ?</li><li>Viết x * 31 và x * 40 bằng dịch và +/−.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 300 − 256 = 44, có tràn (44 &lt; 200). 2) 150 − 256 = −106 (tràn dương); −150 + 256 = 106 (tràn âm). 3) 31 = 32 − 1: (x &lt;&lt; 5) − x; 40 = 32 + 8: (x &lt;&lt; 5) + (x &lt;&lt; 3).</p></div>`);

const SRC_FLOATS = String.raw`
#include <stdio.h>
#include <string.h>
#include <float.h>
#include <math.h>
static unsigned bits(float f) { unsigned u; memcpy(&u, &f, sizeof u); return u; }
static void show(const char *name, float f) {
    unsigned u = bits(f);
    printf("%-8s 0x%08x  s=%u exp=%3u frac=0x%06x  %.9g\n", name, u, u >> 31, (u >> 23) & 0xFF, u & 0x7FFFFF, f);
}
int main(void) {
    show("1.0", 1.0f);
    show("-6.5", -6.5f);
    show("0.1", 0.1f);
    show("FLT_MIN", FLT_MIN);
    show("denorm", FLT_MIN / 4);
    show("+inf", INFINITY);
    show("nan", NAN);
    printf("0.1 + 0.2 = %.17g\n", 0.1 + 0.2);
    printf("0.1 + 0.2 == 0.3 ? %d\n", 0.1 + 0.2 == 0.3);
    printf("(3.14 + 1e20) - 1e20 = %g\n", (3.14 + 1e20) - 1e20);
    printf("3.14 + (1e20 - 1e20) = %g\n", 3.14 + (1e20 - 1e20));
    int i = 16777217;                       /* 2^24 + 1 */
    float fi = (float) i;
    printf("(float)16777217 = %.1f\n", fi);
    printf("(int)3.99 = %d, (int)-3.99 = %d\n", (int)3.99, (int)-3.99);
    printf("1.0/0.0 = %f, -1.0/0.0 = %f, 0.0/0.0 = %f\n", 1.0/0.0, -1.0/0.0, 0.0/0.0);
    float sum = 0.0f;
    for (int k = 0; k < 10; k++) sum += 0.1f;
    printf("ten times 0.1f = %.9g\n", sum);
    return 0;
}
`;
const OUT_FLOATS = String.raw`
1.0      0x3f800000  s=0 exp=127 frac=0x000000  1
-6.5     0xc0d00000  s=1 exp=129 frac=0x500000  -6.5
0.1      0x3dcccccd  s=0 exp=123 frac=0x4ccccd  0.100000001
FLT_MIN  0x00800000  s=0 exp=  1 frac=0x000000  1.17549435e-38
denorm   0x00200000  s=0 exp=  0 frac=0x200000  2.93873588e-39
+inf     0x7f800000  s=0 exp=255 frac=0x000000  inf
nan      0x7fc00000  s=0 exp=255 frac=0x400000  nan
0.1 + 0.2 = 0.30000000000000004
0.1 + 0.2 == 0.3 ? 0
(3.14 + 1e20) - 1e20 = 0
3.14 + (1e20 - 1e20) = 3.14
(float)16777217 = 16777216.0
(int)3.99 = 3, (int)-3.99 = -3
1.0/0.0 = inf, -1.0/0.0 = -inf, 0.0/0.0 = nan
ten times 0.1f = 1.00000012
`;

const c25 = L('ics102-ts-2-5',
  '2.5 — Floating point: IEEE 754, rounding and surprises|||2.5 — Số thực dấu phẩy động: IEEE 754, làm tròn và những bất ngờ',
  'Phân số nhị phân, định dạng IEEE 754 (dấu, số mũ có bias, phần định trị), số chuẩn hoá/không chuẩn hoá/giá trị đặc biệt, làm tròn về số chẵn, 0.1+0.2, phép cộng không kết hợp, ép kiểu int↔float; chương trình in bit chạy thật.',
  `<span class="eyebrow">ICS102 · Chapter 2 · Lesson 2.5</span>
<h2>Floating point: IEEE 754, rounding and surprises</h2>
<p class="lead">Floating point represents real numbers approximately, in the form V = (−1)<sup>s</sup> × M × 2<sup>E</sup>. Since 1985 virtually every processor follows the <strong>IEEE 754</strong> standard. Once you can decode the bits, the “weird” behaviours — 0.1 + 0.2 ≠ 0.3, money errors, lost precision — become predictable.</p>
<h3>🎯 Objectives</h3>
<ul><li>Write fractional binary numbers and see why 0.1 cannot be exact.</li><li>Decode and encode IEEE 754 single precision.</li><li>Recognise normalised, denormalised and special values.</li><li>Explain round-to-even, non-associativity and the rules of int ↔ float casts.</li></ul>
<h3>📖 Lecture</h3>
<h4>Fractional binary</h4>
<p>Bits to the right of the binary point weigh 1/2, 1/4, 1/8, …: 101.11<sub>2</sub> = 4 + 1 + 1/2 + 1/4 = 5.75. Only numbers of the form x/2<sup>k</sup> are exact. 1/10 is not: 0.1 = 0.000110011001100…<sub>2</sub> repeating forever, so it must be rounded.</p>
<h4>IEEE 754 format</h4>
<div class="formula"><span class="lbl">Single precision (float, 32 bits)</span>s (1 bit) | exp (8 bits) | frac (23 bits)        bias = 127<br><span class="lbl">Double precision (double, 64 bits)</span>s (1) | exp (11) | frac (52)        bias = 1023</div>
<ul>
<li><strong>Normalised</strong> (exp ≠ 0 and not all ones): E = exp − bias, M = 1.frac (an implied leading 1 — a free extra bit).</li>
<li><strong>Denormalised</strong> (exp = 0): E = 1 − bias, M = 0.frac. They represent 0 (two zeros: +0 and −0) and numbers very close to 0, filling the gap gradually.</li>
<li><strong>Special</strong> (exp all ones): frac = 0 → ±∞ (e.g. 1.0/0.0); frac ≠ 0 → NaN (“not a number”, e.g. 0.0/0.0).</li>
</ul>
<div class="callout"><p><b>Decode 0xC0D00000.</b> Binary: 1 | 1000 0001 | 101 0000 …<br>s = 1 (negative); exp = 129 → E = 129 − 127 = 2; M = 1.101<sub>2</sub> = 1.625.<br>V = −1.625 × 2<sup>2</sup> = <b>−6.5</b>.<br><b>Encode 12345.0.</b> 12345 = 11000000111001<sub>2</sub> = 1.1000000111001<sub>2</sub> × 2<sup>13</sup>. exp = 13 + 127 = 140 = 1000 1100; frac = 1000000111001 then zeros. Bits: 0 10001100 10000001110010000000000 = <b>0x4640E400</b> — exactly the bytes 00 e4 40 46 we printed in lesson 2.1.</p></div>
<h4>Rounding</h4>
<p>The default mode is <strong>round-to-nearest-even</strong>: round to the nearest representable value; on an exact tie, choose the one whose last bit is 0. (Decimal analogy: 1.5 → 2 and 2.5 → 2.) This avoids a statistical bias that “always round half up” would create.</p>
<h4>Floating-point arithmetic is not real arithmetic</h4>
<ul>
<li>Addition is commutative but <strong>not associative</strong>: (3.14 + 1e20) − 1e20 = 0, but 3.14 + (1e20 − 1e20) = 3.14.</li>
<li>Rounding errors accumulate: adding 0.1f ten times gives 1.00000012.</li>
<li>Casting: int → float may round (float has only 24 significant bits: 16777217 → 16777216); int → double is exact; float/double → int truncates toward zero, and out-of-range values are undefined behaviour.</li>
</ul>
<h3>✍️ Worked example</h3>
` + C(SRC_FLOATS) + `
<p>Real output (compiled with <code>-O0</code>):</p>
` + out(OUT_FLOATS) + `
<p>Notice: 0.1f is stored as 0x3DCCCCCD, which is 0.100000001; FLT_MIN is the smallest normalised float (exp = 1); dividing it by 4 gives a denormalised number with exp = 0.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Comparing floats with <code>==</code>; compare with a tolerance: <code>fabs(a − b) &lt; 1e-9 * fmax(fabs(a), fabs(b))</code>.</li><li>Storing money in float/double — use integer cents or a decimal type.</li><li>Summing many small numbers into a huge one (order matters — add small ones first).</li><li>Thinking NaN equals itself: <code>x != x</code> is true exactly when x is NaN.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>V = (−1)<sup>s</sup> × M × 2<sup>E</sup>; float = 1 + 8 + 23 bits, bias 127; double = 1 + 11 + 52 bits, bias 1023.</li><li>Normalised (implied 1), denormalised (near 0), special (∞, NaN).</li><li>Default rounding: to nearest, ties to even.</li><li>Float addition is not associative; casts can round, truncate or overflow.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://float.exposed/" target="_blank" rel="noopener">float.exposed — play with the bits of floats and doubles</a></li><li><a href="https://floating-point-gui.de/" target="_blank" rel="noopener">The Floating-Point Guide — what every programmer should know</a></li><li><a href="https://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html" target="_blank" rel="noopener">Goldberg — What Every Computer Scientist Should Know About Floating-Point Arithmetic</a></li><li><a href="https://www.youtube.com/watch?v=PZRI1IfStY0" target="_blank" rel="noopener">Computerphile — Floating Point Numbers (video)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Decode the float 0x41200000.</li><li>Encode −0.75 as a float (give the hex).</li><li>Why does <code>(float)16777217</code> print 16777216.0, while <code>(double)16777217</code> is exact?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 0 | 1000 0010 | 010 0… : E = 130 − 127 = 3, M = 1.01<sub>2</sub> = 1.25 → 1.25 × 8 = <b>10.0</b>. 2) 0.75 = 1.1<sub>2</sub> × 2<sup>−1</sup>: s = 1, exp = 126 = 0111 1110, frac = 100…0 → 1 01111110 100…0 = <b>0xBF400000</b>. 3) 2<sup>24</sup> + 1 needs 25 significant bits; float has 24 (23 + the implied 1), so it rounds to even (2<sup>24</sup>); double has 53.</p></div>`,
  `<span class="eyebrow">ICS102 · Chương 2 · Bài 2.5</span>
<h2>Số thực dấu phẩy động: IEEE 754, làm tròn và những bất ngờ</h2>
<p class="lead">Dấu phẩy động biểu diễn gần đúng số thực ở dạng V = (−1)<sup>s</sup> × M × 2<sup>E</sup>. Từ 1985 gần như mọi bộ xử lý theo chuẩn <strong>IEEE 754</strong>. Khi giải mã được các bit, những hành vi “kỳ quặc” — 0.1 + 0.2 ≠ 0.3, sai tiền, mất độ chính xác — trở nên đoán trước được.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Viết số nhị phân có phần lẻ và thấy vì sao 0.1 không biểu diễn chính xác được.</li><li>Giải mã và mã hoá số IEEE 754 độ chính xác đơn.</li><li>Nhận ra số chuẩn hoá, không chuẩn hoá và giá trị đặc biệt.</li><li>Giải thích làm tròn về số chẵn, tính không kết hợp và luật ép kiểu int ↔ float.</li></ul>
<h3>📖 Bài giảng</h3>
<h4>Số nhị phân có phần lẻ</h4>
<p>Các bit bên phải dấu chấm nhị phân nặng 1/2, 1/4, 1/8, …: 101.11<sub>2</sub> = 4 + 1 + 1/2 + 1/4 = 5,75. Chỉ các số dạng x/2<sup>k</sup> là chính xác. 1/10 thì không: 0.1 = 0.000110011001100…<sub>2</sub> lặp mãi, nên buộc phải làm tròn.</p>
<h4>Định dạng IEEE 754</h4>
<div class="formula"><span class="lbl">Độ chính xác đơn (float, 32 bit)</span>s (1 bit) | exp (8 bit) | frac (23 bit)        bias = 127<br><span class="lbl">Độ chính xác kép (double, 64 bit)</span>s (1) | exp (11) | frac (52)        bias = 1023</div>
<ul>
<li><strong>Chuẩn hoá</strong> (exp ≠ 0 và không toàn 1): E = exp − bias, M = 1.frac (số 1 đầu ngầm định — được thêm một bit miễn phí).</li>
<li><strong>Không chuẩn hoá</strong> (exp = 0): E = 1 − bias, M = 0.frac. Chúng biểu diễn số 0 (có hai số 0: +0 và −0) và các số rất gần 0, lấp khoảng trống một cách từ từ.</li>
<li><strong>Đặc biệt</strong> (exp toàn 1): frac = 0 → ±∞ (vd 1.0/0.0); frac ≠ 0 → NaN (“không phải số”, vd 0.0/0.0).</li>
</ul>
<div class="callout"><p><b>Giải mã 0xC0D00000.</b> Nhị phân: 1 | 1000 0001 | 101 0000 …<br>s = 1 (âm); exp = 129 → E = 129 − 127 = 2; M = 1.101<sub>2</sub> = 1,625.<br>V = −1,625 × 2<sup>2</sup> = <b>−6,5</b>.<br><b>Mã hoá 12345.0.</b> 12345 = 11000000111001<sub>2</sub> = 1.1000000111001<sub>2</sub> × 2<sup>13</sup>. exp = 13 + 127 = 140 = 1000 1100; frac = 1000000111001 rồi các số 0. Bit: 0 10001100 10000001110010000000000 = <b>0x4640E400</b> — đúng các byte 00 e4 40 46 ta đã in ở bài 2.1.</p></div>
<h4>Làm tròn</h4>
<p>Chế độ mặc định là <strong>làm tròn tới gần nhất, hoà thì về số chẵn</strong>: làm tròn tới giá trị biểu diễn được gần nhất; nếu đúng giữa thì chọn số có bit cuối bằng 0. (Tương tự thập phân: 1,5 → 2 và 2,5 → 2.) Cách này tránh độ lệch thống kê mà “luôn làm tròn nửa lên” gây ra.</p>
<h4>Số học dấu phẩy động không phải số học số thực</h4>
<ul>
<li>Phép cộng giao hoán nhưng <strong>không kết hợp</strong>: (3.14 + 1e20) − 1e20 = 0, còn 3.14 + (1e20 − 1e20) = 3.14.</li>
<li>Sai số làm tròn tích luỹ: cộng 0.1f mười lần ra 1.00000012.</li>
<li>Ép kiểu: int → float có thể bị làm tròn (float chỉ có 24 bit có nghĩa: 16777217 → 16777216); int → double chính xác; float/double → int cắt về phía 0, giá trị ngoài miền là hành vi không xác định.</li>
</ul>
<h3>✍️ Ví dụ</h3>
` + C(SRC_FLOATS) + `
<p>Output thật (biên dịch với <code>-O0</code>):</p>
` + out(OUT_FLOATS) + `
<p>Để ý: 0.1f được lưu thành 0x3DCCCCCD, tức 0.100000001; FLT_MIN là float chuẩn hoá nhỏ nhất (exp = 1); chia nó cho 4 ra số không chuẩn hoá với exp = 0.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>So sánh số thực bằng <code>==</code>; hãy so với sai số cho phép: <code>fabs(a − b) &lt; 1e-9 * fmax(fabs(a), fabs(b))</code>.</li><li>Lưu tiền bằng float/double — dùng số nguyên (đơn vị nhỏ nhất) hoặc kiểu thập phân.</li><li>Cộng nhiều số nhỏ vào một số rất lớn (thứ tự có ảnh hưởng — cộng các số nhỏ trước).</li><li>Tưởng NaN bằng chính nó: <code>x != x</code> đúng khi và chỉ khi x là NaN.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>V = (−1)<sup>s</sup> × M × 2<sup>E</sup>; float = 1 + 8 + 23 bit, bias 127; double = 1 + 11 + 52 bit, bias 1023.</li><li>Chuẩn hoá (1 ngầm định), không chuẩn hoá (gần 0), đặc biệt (∞, NaN).</li><li>Làm tròn mặc định: gần nhất, hoà về số chẵn.</li><li>Phép cộng số thực không kết hợp; ép kiểu có thể làm tròn, cắt bớt hoặc tràn.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://float.exposed/" target="_blank" rel="noopener">float.exposed — nghịch các bit của float và double</a></li><li><a href="https://floating-point-gui.de/" target="_blank" rel="noopener">The Floating-Point Guide — điều mọi lập trình viên nên biết</a></li><li><a href="https://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html" target="_blank" rel="noopener">Goldberg — What Every Computer Scientist Should Know About Floating-Point Arithmetic</a></li><li><a href="https://www.youtube.com/watch?v=PZRI1IfStY0" target="_blank" rel="noopener">Computerphile — Floating Point Numbers (video)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Giải mã float 0x41200000.</li><li>Mã hoá −0,75 thành float (cho dạng hex).</li><li>Vì sao <code>(float)16777217</code> in ra 16777216.0, còn <code>(double)16777217</code> thì chính xác?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 0 | 1000 0010 | 010 0… : E = 130 − 127 = 3, M = 1.01<sub>2</sub> = 1,25 → 1,25 × 8 = <b>10,0</b>. 2) 0,75 = 1.1<sub>2</sub> × 2<sup>−1</sup>: s = 1, exp = 126 = 0111 1110, frac = 100…0 → 1 01111110 100…0 = <b>0xBF400000</b>. 3) 2<sup>24</sup> + 1 cần 25 bit có nghĩa; float chỉ có 24 (23 + số 1 ngầm định), nên làm tròn về số chẵn (2<sup>24</sup>); double có 53.</p></div>`);

const q2 = QZ(2, 'Quiz — Chapter 2: Representing and manipulating information|||Quiz — Chương 2: Biểu diễn và thao tác thông tin', 'Kiểm tra chương 2: hệ 16, thứ tự byte, phép toán bit, bù hai, chuyển đổi kiểu, tràn số, chia bằng dịch, IEEE 754.', [
  Q('q1', 'The int 0x01234567 on a little-endian machine is stored (lowest address first) as|||Số int 0x01234567 trên máy little-endian được lưu (địa chỉ thấp trước) là',
    ['01 23 45 67|||01 23 45 67', '67 45 23 01|||67 45 23 01', '45 67 01 23|||45 67 01 23', '76 54 32 10|||76 54 32 10'], 1,
    'Little-endian puts the least significant byte first.|||Little-endian đặt byte ít quan trọng nhất trước.'),
  Q('q2', 'Binary 1011 0110 in hexadecimal is|||Nhị phân 1011 0110 ở hệ 16 là',
    ['0xB6|||0xB6', '0x6B|||0x6B', '0xA6|||0xA6', '0xB7|||0xB7'], 0,
    '1011 = B, 0110 = 6.|||1011 = B, 0110 = 6.'),
  Q('q3', 'For 8-bit values, 0x69 & 0x55 and 0x69 && 0x55 are|||Với giá trị 8 bit, 0x69 & 0x55 và 0x69 && 0x55 lần lượt là',
    ['0x41 and 1|||0x41 và 1', '0x41 and 0x41|||0x41 và 0x41', '1 and 0x41|||1 và 0x41', '0x7D and 1|||0x7D và 1'], 0,
    'Bitwise AND gives 0x41; logical AND of two non-zero values gives 1.|||VÀ bit cho 0x41; VÀ logic của hai giá trị khác 0 cho 1.'),
  Q('q4', 'The 4-bit two\'s-complement value of 1011 is|||Giá trị bù hai 4 bit của 1011 là',
    ['11|||11', '−3|||−3', '−5|||−5', '−11|||−11'], 2,
    '−8 + 2 + 1 = −5.|||−8 + 2 + 1 = −5.'),
  Q('q5', 'In C, the expression -1 < 0U evaluates to|||Trong C, biểu thức -1 < 0U có giá trị',
    ['1, because −1 is negative|||1, vì −1 âm', '0, because −1 is converted to UINT_MAX|||0, vì −1 bị đổi thành UINT_MAX', 'a compile error|||lỗi biên dịch', 'undefined behaviour|||hành vi không xác định'], 1,
    'Mixed signed/unsigned comparison converts the signed operand to unsigned.|||So sánh trộn có dấu/không dấu đổi toán hạng có dấu sang không dấu.'),
  Q('q6', 'Converting short −12345 (0xCFC7) to int gives the bit pattern|||Đổi short −12345 (0xCFC7) sang int cho mẫu bit',
    ['0x0000CFC7|||0x0000CFC7', '0xFFFFCFC7|||0xFFFFCFC7', '0xCFC70000|||0xCFC70000', '0xCFC7FFFF|||0xCFC7FFFF'], 1,
    'Sign extension copies the sign bit (1) into the new high bits.|||Mở rộng dấu chép bit dấu (1) vào các bit cao mới.'),
  Q('q7', 'For 8-bit two\'s complement, 100 + 50 equals|||Với bù hai 8 bit, 100 + 50 bằng',
    ['150|||150', '−106|||−106', '127|||127', '−128|||−128'], 1,
    '150 does not fit; 150 − 256 = −106 (positive overflow).|||150 không vừa; 150 − 256 = −106 (tràn dương).'),
  Q('q8', 'For signed int x = −7, which expression equals x / 2 in C?|||Với int x = −7, biểu thức nào bằng x / 2 trong C?',
    ['x >> 1|||x >> 1', '(x + 1) >> 1|||(x + 1) >> 1', '(x − 1) >> 1|||(x − 1) >> 1', 'x << 1|||x << 1'], 1,
    'Adding the bias 2^k − 1 = 1 makes the shift round toward zero: −6 >> 1 = −3.|||Cộng hệ số lệch 2^k − 1 = 1 giúp phép dịch làm tròn về 0: −6 >> 1 = −3.'),
  Q('q9', 'The float with bits 0xC0D00000 is|||Số float có bit 0xC0D00000 là',
    ['−6.5|||−6,5', '6.5|||6,5', '−3.25|||−3,25', '−13.0|||−13,0'], 0,
    's = 1, E = 129 − 127 = 2, M = 1.625 → −1.625 × 4 = −6.5.|||s = 1, E = 129 − 127 = 2, M = 1,625 → −1,625 × 4 = −6,5.'),
  Q('q10', 'Why can (3.14 + 1e20) − 1e20 evaluate to 0 in double?|||Vì sao (3.14 + 1e20) − 1e20 có thể ra 0 với double?',
    ['A compiler bug|||Lỗi trình biên dịch', '3.14 is lost when rounded into 1e20, so FP addition is not associative|||3.14 bị mất khi làm tròn vào 1e20, nên phép cộng dấu phẩy động không kết hợp', 'Integer overflow|||Tràn số nguyên', 'Because 1e20 is NaN|||Vì 1e20 là NaN'], 1,
    '1e20 + 3.14 rounds back to 1e20 (only ~16 significant decimal digits).|||1e20 + 3.14 làm tròn về 1e20 (chỉ ~16 chữ số thập phân có nghĩa).'),
]);

const ch2 = {
  title: 'Chapter 2 — Representing and manipulating information|||Chương 2 — Biểu diễn và thao tác thông tin',
  description: 'Bit, byte, hệ 16, thứ tự byte; phép toán bit và dịch; số nguyên không dấu và bù hai, chuyển đổi kiểu; tràn số, nhân/chia bằng dịch; IEEE 754 — mọi ví dụ C chạy thật (CS:APP chương 2).',
  lessons: [c21, c22, c23, c24, c25, q2],
};

// ───────────────────────────── Chương 3 — Mã máy I ─────────────────────────────
const SRC_ASM1 = String.raw`
long exchange(long *xp, long y) {
    long x = *xp;
    *xp = y;
    return x;
}
long scale(long x, long y, long z) {
    long t = x + 4 * y + 12 * z;
    return t;
}
long arith(long x, long y, long z) {
    long t1 = x ^ y;
    long t2 = z * 48;
    long t3 = t1 & 0x0F0F0F0F;
    long t4 = t2 - t3;
    return t4;
}
`;
const SH_ASM = String.raw`
# Linux x86-64 (what CS:APP uses):
gcc -Og -S asm1.c            # writes asm1.s (assembly)
gcc -Og -c asm1.c            # writes asm1.o (machine code)
objdump -d asm1.o            # disassemble the machine code
# On a Mac with Apple Silicon you can still produce x86-64 Linux assembly:
clang -target x86_64-pc-linux-gnu -O1 -S asm1.c -o asm1.s
`;
const OUT_OBJDUMP = String.raw`
0000000000000000 <exchange>:
       0: 48 8b 07                     	movq	(%rdi), %rax
       3: 48 89 37                     	movq	%rsi, (%rdi)
       6: c3                           	retq
       7: 66 0f 1f 84 00 00 00 00 00   	nopw	(%rax,%rax)

0000000000000010 <scale>:
      10: 48 8d 04 b7                  	leaq	(%rdi,%rsi,4), %rax
      14: 48 8d 0c 52                  	leaq	(%rdx,%rdx,2), %rcx
      18: 48 8d 04 88                  	leaq	(%rax,%rcx,4), %rax
      1c: c3                           	retq
`;

const c31 = L('ics102-ts-3-1',
  '3.1 — From C to machine code: ISA, assembly, x86-64 registers|||3.1 — Từ C tới mã máy: ISA, assembly, thanh ghi x86-64',
  'Vì sao lập trình viên cần đọc assembly; ISA và trạng thái máy nhìn thấy được; sinh assembly bằng -S, dịch ngược bằng objdump (output thật); 16 thanh ghi x86-64 và tên 64/32/16/8 bit; quy ước gọi hàm cơ bản.',
  `<span class="eyebrow">ICS102 · Chapter 3 · Lesson 3.1</span>
<h2>From C to machine code: ISA, assembly, x86-64 registers</h2>
<p class="lead">You will almost never <em>write</em> assembly, but you will often need to <em>read</em> it: to understand a crash in a debugger, to see why a loop is slow, to analyse a security bug, or to check what the optimiser really did. This chapter teaches you to read the x86-64 code that gcc and clang produce from C.</p>
<h3>🎯 Objectives</h3>
<ul><li>Explain the role of the instruction set architecture (ISA).</li><li>List the processor state visible to machine code.</li><li>Produce assembly with <code>-S</code> and disassemble machine code with <code>objdump</code>.</li><li>Name the 16 general-purpose registers and their 32/16/8-bit parts.</li></ul>
<h3>📖 Lecture</h3>
<h4>Two abstractions</h4>
<p>The <strong>ISA</strong> defines the processor state, the instruction formats and the effect of each instruction, as if instructions ran one after another. The real hardware runs many at once (chapter 5) but always produces the same result as sequential execution. The second abstraction: machine code sees <strong>virtual addresses</strong> — memory looks like one huge byte array (chapter 9).</p>
<h4>Processor state visible in machine code</h4>
<ul>
<li><strong>Program counter</strong> — called <code>%rip</code> on x86-64: address of the next instruction.</li>
<li><strong>Integer register file</strong> — 16 registers of 64 bits for addresses and integer data.</li>
<li><strong>Condition codes</strong> — single-bit flags set by the latest arithmetic/logic operation, used by <code>if</code> and loops (chapter 4).</li>
<li><strong>Vector registers</strong> — for floating point and SIMD (%xmm0…).</li>
</ul>
<p>Machine code has <strong>no types</strong>: no arrays, no structs, no distinction between signed and unsigned or between a pointer and an integer. A register just holds 64 bits; the instructions decide what they mean.</p>
<h4>The registers</h4>
<div class="formula"><span class="lbl">x86-64 integer registers (64 / 32 / 16 / 8-bit names)</span>%rax %eax %ax %al — return value<br>%rbx %ebx %bx %bl — callee saved<br>%rcx %ecx %cx %cl — 4th argument<br>%rdx %edx %dx %dl — 3rd argument<br>%rsi %esi %si %sil — 2nd argument<br>%rdi %edi %di %dil — 1st argument<br>%rbp %ebp %bp %bpl — callee saved<br>%rsp %esp %sp %spl — stack pointer<br>%r8 … %r9 — 5th, 6th arguments; %r10, %r11 — caller saved; %r12 … %r15 — callee saved (32-bit names %r8d…, 16-bit %r8w…, 8-bit %r8b…)</div>
<p>The names show the history: 16-bit 8086 registers (%ax), extended to 32 bits by IA32 (%eax), then to 64 bits by x86-64 (%rax), which also added %r8–%r15. The first six integer arguments of a function arrive in %rdi, %rsi, %rdx, %rcx, %r8, %r9 and the result is returned in %rax.</p>
<h4>AT&amp;T syntax in one minute</h4>
<p>gcc, clang and objdump use AT&amp;T syntax (the one in CS:APP): the <strong>source comes first and the destination last</strong>; registers start with <code>%</code>; constants with <code>$</code>; parentheses mean memory. The suffix gives the size: <code>b</code> = 1 byte, <code>w</code> = 2, <code>l</code> = 4, <code>q</code> = 8. (Intel's manuals and Windows tools use Intel syntax with the opposite operand order — beware when you read online.)</p>
<h3>✍️ Worked example — see the code the compiler makes</h3>
` + C(SRC_ASM1) + `
<p>Commands:</p>
` + SH(SH_ASM) + `
<p>Real disassembly (<code>objdump -d</code> on the x86-64 ELF object produced by clang -O1):</p>
` + out(OUT_OBJDUMP) + `
<p>Each instruction is 1 to 15 bytes. <code>movq (%rdi), %rax</code> is encoded as <code>48 8b 07</code>; <code>retq</code> is the single byte <code>c3</code>. The <code>nop</code> is padding so the next function starts at an aligned address. In <code>exchange</code>: xp arrives in %rdi and y in %rsi; <code>movq (%rdi), %rax</code> reads *xp into the return register; <code>movq %rsi, (%rdi)</code> writes y to *xp. Pointers in C are simply addresses in registers.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Reading AT&amp;T operands in Intel order (destination first).</li><li>Forgetting that <code>(%rdi)</code> means “memory at the address in %rdi”, not the value of %rdi.</li><li>Expecting gcc at <code>-O0</code> to give readable code — it stores everything on the stack. Use <code>-Og</code> or <code>-O1</code> to study.</li><li>Comparing gcc and clang output and assuming one is wrong: <code>ret</code>/<code>retq</code> and register choices differ; both are correct.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>The ISA is the contract between compiler and hardware; machine code sees PC (%rip), 16 registers, condition codes, memory.</li><li>Machine code has no types — only bytes and instructions.</li><li>Arguments 1–6: %rdi, %rsi, %rdx, %rcx, %r8, %r9; result: %rax.</li><li>AT&amp;T syntax: source, destination; size suffix b/w/l/q.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://web.stanford.edu/class/cs107/guide/x86-64.html" target="_blank" rel="noopener">Stanford CS107 — Guide to x86-64</a></li><li><a href="https://www.cs.cmu.edu/~fp/courses/15213-s07/misc/asm64-handout.pdf" target="_blank" rel="noopener">Bryant &amp; O'Hallaron — x86-64 Machine-Level Programming (PDF handout)</a></li><li><a href="https://godbolt.org/" target="_blank" rel="noopener">Compiler Explorer — compare -O0, -Og, -O2</a></li><li><a href="https://en.wikipedia.org/wiki/Instruction_set_architecture" target="_blank" rel="noopener">Wikipedia — Instruction set architecture</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>A function <code>long f(long a, long b, long c)</code> is called. Which registers hold a, b, c, and where must the result be put?</li><li>What are the 32-bit and 8-bit names of %rsi? Of %r9?</li><li>Rewrite <code>movq %rsi, (%rdi)</code> in words.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) a in %rdi, b in %rsi, c in %rdx; result in %rax. 2) %esi and %sil; %r9d and %r9b. 3) “Copy the 8-byte value in register %rsi into memory at the address held in %rdi”, i.e. <code>*xp = y</code>.</p></div>`,
  `<span class="eyebrow">ICS102 · Chương 3 · Bài 3.1</span>
<h2>Từ C tới mã máy: ISA, assembly, thanh ghi x86-64</h2>
<p class="lead">Bạn gần như không bao giờ <em>viết</em> assembly, nhưng sẽ thường xuyên phải <em>đọc</em> nó: để hiểu một lần crash trong trình gỡ lỗi, để biết vì sao vòng lặp chậm, để phân tích lỗi bảo mật, hay để kiểm bộ tối ưu thực sự đã làm gì. Chương này dạy bạn đọc mã x86-64 mà gcc và clang sinh ra từ C.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Giải thích vai trò của kiến trúc tập lệnh (ISA).</li><li>Liệt kê trạng thái bộ xử lý mà mã máy nhìn thấy.</li><li>Sinh assembly bằng <code>-S</code> và dịch ngược mã máy bằng <code>objdump</code>.</li><li>Kể tên 16 thanh ghi đa dụng và các phần 32/16/8 bit của chúng.</li></ul>
<h3>📖 Bài giảng</h3>
<h4>Hai trừu tượng</h4>
<p><strong>ISA</strong> quy định trạng thái bộ xử lý, định dạng lệnh và tác dụng của từng lệnh, như thể các lệnh chạy lần lượt từng cái. Phần cứng thật chạy nhiều lệnh cùng lúc (chương 5) nhưng luôn cho cùng kết quả như chạy tuần tự. Trừu tượng thứ hai: mã máy thấy <strong>địa chỉ ảo</strong> — bộ nhớ trông như một mảng byte khổng lồ (chương 9).</p>
<h4>Trạng thái bộ xử lý mà mã máy thấy</h4>
<ul>
<li><strong>Bộ đếm chương trình</strong> — trên x86-64 gọi là <code>%rip</code>: địa chỉ lệnh kế tiếp.</li>
<li><strong>Tệp thanh ghi số nguyên</strong> — 16 thanh ghi 64 bit cho địa chỉ và dữ liệu số nguyên.</li>
<li><strong>Mã điều kiện</strong> — các cờ 1 bit do phép số học/logic gần nhất đặt, dùng cho <code>if</code> và vòng lặp (chương 4).</li>
<li><strong>Thanh ghi vectơ</strong> — cho số thực và SIMD (%xmm0…).</li>
</ul>
<p>Mã máy <strong>không có kiểu</strong>: không mảng, không struct, không phân biệt có dấu/không dấu hay con trỏ/số nguyên. Thanh ghi chỉ chứa 64 bit; lệnh quyết định ý nghĩa của chúng.</p>
<h4>Các thanh ghi</h4>
<div class="formula"><span class="lbl">Thanh ghi số nguyên x86-64 (tên 64 / 32 / 16 / 8 bit)</span>%rax %eax %ax %al — giá trị trả về<br>%rbx %ebx %bx %bl — callee lưu<br>%rcx %ecx %cx %cl — đối số 4<br>%rdx %edx %dx %dl — đối số 3<br>%rsi %esi %si %sil — đối số 2<br>%rdi %edi %di %dil — đối số 1<br>%rbp %ebp %bp %bpl — callee lưu<br>%rsp %esp %sp %spl — con trỏ ngăn xếp<br>%r8 … %r9 — đối số 5, 6; %r10, %r11 — caller lưu; %r12 … %r15 — callee lưu (tên 32 bit %r8d…, 16 bit %r8w…, 8 bit %r8b…)</div>
<p>Các tên kể lại lịch sử: thanh ghi 16 bit của 8086 (%ax), được IA32 mở rộng lên 32 bit (%eax), rồi x86-64 mở rộng lên 64 bit (%rax) và thêm %r8–%r15. Sáu đối số số nguyên đầu tiên của hàm đến trong %rdi, %rsi, %rdx, %rcx, %r8, %r9 và kết quả trả về trong %rax.</p>
<h4>Cú pháp AT&amp;T trong một phút</h4>
<p>gcc, clang và objdump dùng cú pháp AT&amp;T (cú pháp trong CS:APP): <strong>nguồn đứng trước, đích đứng sau</strong>; thanh ghi bắt đầu bằng <code>%</code>; hằng số bằng <code>$</code>; dấu ngoặc nghĩa là bộ nhớ. Hậu tố cho kích thước: <code>b</code> = 1 byte, <code>w</code> = 2, <code>l</code> = 4, <code>q</code> = 8. (Tài liệu Intel và công cụ Windows dùng cú pháp Intel với thứ tự toán hạng ngược lại — cẩn thận khi đọc trên mạng.)</p>
<h3>✍️ Ví dụ — xem mã trình biên dịch sinh ra</h3>
` + C(SRC_ASM1) + `
<p>Lệnh:</p>
` + SH(SH_ASM) + `
<p>Dịch ngược thật (<code>objdump -d</code> trên tệp đối tượng ELF x86-64 do clang -O1 tạo):</p>
` + out(OUT_OBJDUMP) + `
<p>Mỗi lệnh dài 1 tới 15 byte. <code>movq (%rdi), %rax</code> được mã hoá thành <code>48 8b 07</code>; <code>retq</code> là đúng một byte <code>c3</code>. Lệnh <code>nop</code> là phần đệm để hàm sau bắt đầu ở địa chỉ căn lề. Trong <code>exchange</code>: xp đến trong %rdi, y trong %rsi; <code>movq (%rdi), %rax</code> đọc *xp vào thanh ghi trả về; <code>movq %rsi, (%rdi)</code> ghi y vào *xp. Con trỏ trong C đơn giản là địa chỉ nằm trong thanh ghi.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Đọc toán hạng AT&amp;T theo thứ tự Intel (đích trước).</li><li>Quên rằng <code>(%rdi)</code> nghĩa là “bộ nhớ tại địa chỉ trong %rdi”, không phải giá trị của %rdi.</li><li>Mong gcc ở <code>-O0</code> cho mã dễ đọc — nó cất mọi thứ lên ngăn xếp. Học thì dùng <code>-Og</code> hoặc <code>-O1</code>.</li><li>So output gcc với clang rồi cho rằng một bên sai: <code>ret</code>/<code>retq</code> và cách chọn thanh ghi khác nhau; cả hai đều đúng.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>ISA là hợp đồng giữa trình biên dịch và phần cứng; mã máy thấy PC (%rip), 16 thanh ghi, mã điều kiện, bộ nhớ.</li><li>Mã máy không có kiểu — chỉ có byte và lệnh.</li><li>Đối số 1–6: %rdi, %rsi, %rdx, %rcx, %r8, %r9; kết quả: %rax.</li><li>Cú pháp AT&amp;T: nguồn, đích; hậu tố kích thước b/w/l/q.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://web.stanford.edu/class/cs107/guide/x86-64.html" target="_blank" rel="noopener">Stanford CS107 — Hướng dẫn x86-64</a></li><li><a href="https://www.cs.cmu.edu/~fp/courses/15213-s07/misc/asm64-handout.pdf" target="_blank" rel="noopener">Bryant &amp; O'Hallaron — x86-64 Machine-Level Programming (PDF)</a></li><li><a href="https://godbolt.org/" target="_blank" rel="noopener">Compiler Explorer — so sánh -O0, -Og, -O2</a></li><li><a href="https://en.wikipedia.org/wiki/Instruction_set_architecture" target="_blank" rel="noopener">Wikipedia — Kiến trúc tập lệnh</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Gọi hàm <code>long f(long a, long b, long c)</code>. Thanh ghi nào chứa a, b, c, và kết quả phải đặt ở đâu?</li><li>Tên 32 bit và 8 bit của %rsi là gì? Của %r9?</li><li>Diễn đạt <code>movq %rsi, (%rdi)</code> bằng lời.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) a trong %rdi, b trong %rsi, c trong %rdx; kết quả trong %rax. 2) %esi và %sil; %r9d và %r9b. 3) “Chép giá trị 8 byte trong thanh ghi %rsi vào bộ nhớ tại địa chỉ chứa trong %rdi”, tức <code>*xp = y</code>.</p></div>`);

const SRC_MOVS = String.raw`
long load_signed(signed char *p)     { return *p; }
long load_unsigned(unsigned char *p) { return *p; }
void store_byte(long x, char *dest)  { *dest = (char) x; }
long index_sum(long *a, long i)      { return a[i] + a[i + 1]; }
`;
const ASM_MOVS = String.raw`
load_signed:
	movsbq	(%rdi), %rax        # load 1 byte, sign-extend to 8 bytes
	retq
load_unsigned:
	movzbl	(%rdi), %eax        # load 1 byte, zero-extend to 4 bytes (upper 4 also zeroed)
	retq
store_byte:
	movb	%dil, (%rsi)          # store the low byte of x
	retq
index_sum:
	movq	8(%rdi,%rsi,8), %rax  # a[i+1]: address = a + 8*i + 8
	addq	(%rdi,%rsi,8), %rax   # + a[i]: address = a + 8*i
	retq
`;

const c32 = L('ics102-ts-3-2',
  '3.2 — Operands, addressing modes and data movement|||3.2 — Toán hạng, chế độ địa chỉ và di chuyển dữ liệu',
  'Ba loại toán hạng (hằng, thanh ghi, bộ nhớ), công thức địa chỉ Imm(rb,ri,s) có bài tính từng bước, họ lệnh mov/movz/movs, push/pop và ngăn xếp, con trỏ = địa chỉ; assembly sinh thật từ C.',
  `<span class="eyebrow">ICS102 · Chapter 3 · Lesson 3.2</span>
<h2>Operands, addressing modes and data movement</h2>
<p class="lead">The most frequent instructions in any program simply copy data: register to register, memory to register, register to memory. To read them you must decode the operand forms — especially the general memory addressing mode, which is how arrays, structs and pointers are accessed.</p>
<h3>🎯 Objectives</h3>
<ul><li>Recognise immediate, register and memory operands.</li><li>Compute the effective address of Imm(r<sub>b</sub>, r<sub>i</sub>, s).</li><li>Choose between mov, movz and movs and predict the upper bits.</li><li>Explain how push and pop change %rsp.</li></ul>
<h3>📖 Lecture</h3>
<h4>Operand forms</h4>
<ul>
<li><strong>Immediate</strong>: a constant, <code>$-577</code>, <code>$0x1F</code>.</li>
<li><strong>Register</strong>: the contents of a register, <code>%rax</code>; written R[%rax].</li>
<li><strong>Memory</strong>: the bytes at an effective address, written M[address].</li>
</ul>
<div class="formula"><span class="lbl">General memory addressing mode</span>Imm(r<sub>b</sub>, r<sub>i</sub>, s) → M[ Imm + R[r<sub>b</sub>] + R[r<sub>i</sub>]·s ]        s ∈ {1, 2, 4, 8}</div>
<p>Special cases: <code>(%rax)</code> = M[R[%rax]]; <code>8(%rax)</code> = M[8 + R[%rax]]; <code>(%rax,%rdx,4)</code> = M[R[%rax] + 4·R[%rdx]]. The scale s matches the size of array elements, so <code>a[i]</code> for an array of 8-byte longs is <code>(%rdi,%rsi,8)</code>.</p>
<div class="callout"><p><b>Worked example (CS:APP-style).</b> Memory: M[0x100] = 0xFF, M[0x104] = 0xAB, M[0x108] = 0x13, M[0x10C] = 0x11. Registers: %rax = 0x100, %rcx = 0x1, %rdx = 0x3.<br>• <code>%rax</code> → 0x100 (the register itself).<br>• <code>(%rax)</code> → M[0x100] = 0xFF.<br>• <code>4(%rax)</code> → M[0x104] = 0xAB.<br>• <code>9(%rax,%rdx)</code> → M[9 + 0x100 + 3] = M[0x10C] = 0x11.<br>• <code>0xFC(,%rcx,4)</code> → M[0xFC + 4] = M[0x100] = 0xFF.<br>• <code>(%rax,%rdx,4)</code> → M[0x100 + 12] = M[0x10C] = 0x11.</p></div>
<h4>Data movement instructions</h4>
<ul>
<li><code>movb/movw/movl/movq S, D</code> copy 1/2/4/8 bytes. Two memory operands in one instruction are <strong>not allowed</strong> — copy through a register.</li>
<li>Rule of x86-64: an instruction that writes a <strong>32-bit</strong> register (e.g. <code>movl</code> to %eax) also <strong>sets the upper 32 bits to 0</strong>. Writing 8- or 16-bit parts leaves the rest unchanged.</li>
<li><code>movz…</code> copies a smaller value into a larger destination, filling with zeros (unsigned); <code>movs…</code> fills with copies of the sign bit (signed). E.g. <code>movsbq</code> = sign-extend byte to quad; <code>cltq</code> = sign-extend %eax into %rax.</li>
<li><code>movabsq $Imm, R</code> loads a full 64-bit constant (normal <code>movq</code> immediates are 32-bit, sign-extended).</li>
</ul>
<h4>The stack: push and pop</h4>
<p>The run-time stack grows toward <strong>lower</strong> addresses; %rsp points at the top element. <code>pushq %rbp</code> = subtract 8 from %rsp, then store %rbp at M[%rsp]. <code>popq %rax</code> = load M[%rsp] into %rax, then add 8 to %rsp. Chapter 4 uses the stack for procedure calls.</p>
<h3>✍️ Worked example — generated code</h3>
` + C(SRC_MOVS) + `
<p>Real x86-64 assembly (clang -O1; comments added by us):</p>
` + ASM(ASM_MOVS) + `
<p>The signedness of the C type decides the instruction: <code>signed char</code> → <code>movsbq</code>, <code>unsigned char</code> → <code>movzbl</code> (which, by the 32-bit rule, also clears the top half of %rax). In <code>index_sum</code> one instruction computes the address of <code>a[i+1]</code> using displacement 8, base %rdi, index %rsi and scale 8.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Writing <code>movq (%rax), (%rbx)</code> — memory-to-memory moves do not exist.</li><li>Forgetting that <code>movl</code> to a register zeroes the high 32 bits, while <code>movw</code>/<code>movb</code> do not.</li><li>Confusing the address with the content: <code>4(%rax)</code> reads memory, it does not compute %rax + 4.</li><li>Thinking the stack grows upward: push <em>decreases</em> %rsp.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Operands: $immediate, %register, memory Imm(r<sub>b</sub>, r<sub>i</sub>, s) = Imm + R[r<sub>b</sub>] + s·R[r<sub>i</sub>].</li><li>mov copies; movz/movs widen with zeros/sign; 32-bit writes clear the upper half.</li><li>No memory-to-memory move.</li><li>push: %rsp −= 8 then store; pop: load then %rsp += 8.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://web.stanford.edu/class/cs107/guide/x86-64.html" target="_blank" rel="noopener">Stanford CS107 — x86-64 guide: addressing modes and mov</a></li><li><a href="https://www.felixcloutier.com/x86/" target="_blank" rel="noopener">x86 and amd64 instruction reference (from Intel's manual)</a></li><li><a href="https://www.cs.cmu.edu/~213/schedule.html" target="_blank" rel="noopener">CMU 15-213 — lecture “Machine-Level Programming I: Basics”</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>With the memory and registers of the worked example, evaluate <code>260(%rcx,%rdx)</code> and <code>8(%rax)</code>.</li><li>Which instruction is wrong and why: <code>movb $0xF, (%ebx)</code> · <code>movl %rax, (%rsp)</code> · <code>movw (%rax), 4(%rsp)</code>?</li><li>%rsp = 0x7fff0010 and %rax = 5. After <code>pushq %rax</code>, what is %rsp and what is stored where?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 260 = 0x104: 0x104 + 1 + 3 = 0x108 → 0x13; 8(%rax) = M[0x108] = 0x13. 2) <code>movb $0xF, (%ebx)</code>: in 64-bit code addresses are formed from 64-bit registers (CS:APP rule; a 32-bit address register needs a special prefix and truncates the address); <code>movl %rax, …</code>: suffix l does not match the 64-bit register; <code>movw (%rax), 4(%rsp)</code>: two memory operands. 3) %rsp = 0x7fff0008; the 8-byte value 5 is stored at 0x7fff0008.</p></div>`,
  `<span class="eyebrow">ICS102 · Chương 3 · Bài 3.2</span>
<h2>Toán hạng, chế độ địa chỉ và di chuyển dữ liệu</h2>
<p class="lead">Các lệnh xuất hiện nhiều nhất trong mọi chương trình chỉ là chép dữ liệu: thanh ghi sang thanh ghi, bộ nhớ sang thanh ghi, thanh ghi sang bộ nhớ. Muốn đọc chúng phải giải mã được các dạng toán hạng — nhất là chế độ địa chỉ bộ nhớ tổng quát, cách truy cập mảng, struct và con trỏ.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Nhận ra toán hạng hằng, thanh ghi và bộ nhớ.</li><li>Tính địa chỉ hiệu dụng của Imm(r<sub>b</sub>, r<sub>i</sub>, s).</li><li>Chọn giữa mov, movz, movs và đoán các bit cao.</li><li>Giải thích push và pop thay đổi %rsp thế nào.</li></ul>
<h3>📖 Bài giảng</h3>
<h4>Các dạng toán hạng</h4>
<ul>
<li><strong>Hằng (immediate)</strong>: một hằng số, <code>$-577</code>, <code>$0x1F</code>.</li>
<li><strong>Thanh ghi</strong>: nội dung thanh ghi, <code>%rax</code>; ký hiệu R[%rax].</li>
<li><strong>Bộ nhớ</strong>: các byte tại một địa chỉ hiệu dụng, ký hiệu M[địa chỉ].</li>
</ul>
<div class="formula"><span class="lbl">Chế độ địa chỉ bộ nhớ tổng quát</span>Imm(r<sub>b</sub>, r<sub>i</sub>, s) → M[ Imm + R[r<sub>b</sub>] + R[r<sub>i</sub>]·s ]        s ∈ {1, 2, 4, 8}</div>
<p>Trường hợp riêng: <code>(%rax)</code> = M[R[%rax]]; <code>8(%rax)</code> = M[8 + R[%rax]]; <code>(%rax,%rdx,4)</code> = M[R[%rax] + 4·R[%rdx]]. Hệ số s khớp kích thước phần tử mảng, nên <code>a[i]</code> với mảng long 8 byte là <code>(%rdi,%rsi,8)</code>.</p>
<div class="callout"><p><b>Ví dụ giải từng bước (kiểu CS:APP).</b> Bộ nhớ: M[0x100] = 0xFF, M[0x104] = 0xAB, M[0x108] = 0x13, M[0x10C] = 0x11. Thanh ghi: %rax = 0x100, %rcx = 0x1, %rdx = 0x3.<br>• <code>%rax</code> → 0x100 (chính thanh ghi).<br>• <code>(%rax)</code> → M[0x100] = 0xFF.<br>• <code>4(%rax)</code> → M[0x104] = 0xAB.<br>• <code>9(%rax,%rdx)</code> → M[9 + 0x100 + 3] = M[0x10C] = 0x11.<br>• <code>0xFC(,%rcx,4)</code> → M[0xFC + 4] = M[0x100] = 0xFF.<br>• <code>(%rax,%rdx,4)</code> → M[0x100 + 12] = M[0x10C] = 0x11.</p></div>
<h4>Lệnh di chuyển dữ liệu</h4>
<ul>
<li><code>movb/movw/movl/movq S, D</code> chép 1/2/4/8 byte. Một lệnh <strong>không được</strong> có hai toán hạng bộ nhớ — phải chép qua thanh ghi.</li>
<li>Luật của x86-64: lệnh ghi vào thanh ghi <strong>32 bit</strong> (vd <code>movl</code> vào %eax) đồng thời <strong>đặt 32 bit cao về 0</strong>. Ghi phần 8 hay 16 bit thì giữ nguyên phần còn lại.</li>
<li><code>movz…</code> chép giá trị nhỏ vào đích lớn hơn, điền 0 (không dấu); <code>movs…</code> điền bản sao bit dấu (có dấu). Vd <code>movsbq</code> = mở rộng dấu byte lên quad; <code>cltq</code> = mở rộng dấu %eax vào %rax.</li>
<li><code>movabsq $Imm, R</code> nạp hằng 64 bit đầy đủ (hằng của <code>movq</code> thường chỉ 32 bit, mở rộng dấu).</li>
</ul>
<h4>Ngăn xếp: push và pop</h4>
<p>Ngăn xếp lúc chạy lớn dần về phía địa chỉ <strong>thấp</strong>; %rsp trỏ vào phần tử đỉnh. <code>pushq %rbp</code> = trừ %rsp đi 8, rồi ghi %rbp vào M[%rsp]. <code>popq %rax</code> = nạp M[%rsp] vào %rax, rồi cộng %rsp thêm 8. Chương 4 dùng ngăn xếp cho lời gọi hàm.</p>
<h3>✍️ Ví dụ — mã sinh thật</h3>
` + C(SRC_MOVS) + `
<p>Assembly x86-64 thật (clang -O1; chú thích do chúng tôi thêm):</p>
` + ASM(ASM_MOVS) + `
<p>Tính có dấu của kiểu C quyết định lệnh: <code>signed char</code> → <code>movsbq</code>, <code>unsigned char</code> → <code>movzbl</code> (theo luật 32 bit, lệnh này cũng xoá nửa trên của %rax). Trong <code>index_sum</code> một lệnh duy nhất tính địa chỉ <code>a[i+1]</code> với độ dời 8, cơ sở %rdi, chỉ số %rsi và hệ số 8.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Viết <code>movq (%rax), (%rbx)</code> — không có lệnh chép bộ nhớ sang bộ nhớ.</li><li>Quên rằng <code>movl</code> vào thanh ghi xoá 32 bit cao, còn <code>movw</code>/<code>movb</code> thì không.</li><li>Lẫn địa chỉ với nội dung: <code>4(%rax)</code> đọc bộ nhớ, không phải tính %rax + 4.</li><li>Tưởng ngăn xếp lớn lên phía trên: push <em>giảm</em> %rsp.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Toán hạng: $hằng, %thanh ghi, bộ nhớ Imm(r<sub>b</sub>, r<sub>i</sub>, s) = Imm + R[r<sub>b</sub>] + s·R[r<sub>i</sub>].</li><li>mov chép; movz/movs mở rộng bằng 0/bit dấu; ghi 32 bit xoá nửa trên.</li><li>Không có mov bộ nhớ sang bộ nhớ.</li><li>push: %rsp −= 8 rồi ghi; pop: đọc rồi %rsp += 8.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://web.stanford.edu/class/cs107/guide/x86-64.html" target="_blank" rel="noopener">Stanford CS107 — hướng dẫn x86-64: chế độ địa chỉ và mov</a></li><li><a href="https://www.felixcloutier.com/x86/" target="_blank" rel="noopener">Tra cứu lệnh x86/amd64 (trích từ tài liệu Intel)</a></li><li><a href="https://www.cs.cmu.edu/~213/schedule.html" target="_blank" rel="noopener">CMU 15-213 — bài giảng “Machine-Level Programming I: Basics”</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Với bộ nhớ và thanh ghi của ví dụ trên, tính <code>260(%rcx,%rdx)</code> và <code>8(%rax)</code>.</li><li>Lệnh nào sai và vì sao: <code>movb $0xF, (%ebx)</code> · <code>movl %rax, (%rsp)</code> · <code>movw (%rax), 4(%rsp)</code>?</li><li>%rsp = 0x7fff0010 và %rax = 5. Sau <code>pushq %rax</code>, %rsp bằng bao nhiêu, giá trị gì được ghi ở đâu?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 260 = 0x104: 0x104 + 1 + 3 = 0x108 → 0x13; 8(%rax) = M[0x108] = 0x13. 2) <code>movb $0xF, (%ebx)</code>: trong mã 64 bit địa chỉ được tạo từ thanh ghi 64 bit (luật của CS:APP; dùng thanh ghi 32 bit làm địa chỉ cần tiền tố đặc biệt và cắt cụt địa chỉ); <code>movl %rax, …</code>: hậu tố l không khớp thanh ghi 64 bit; <code>movw (%rax), 4(%rsp)</code>: hai toán hạng bộ nhớ. 3) %rsp = 0x7fff0008; giá trị 8 byte bằng 5 được ghi ở 0x7fff0008.</p></div>`);

const ASM_ARITH = String.raw`
scale:                         # t = x + 4*y + 12*z ; x=%rdi y=%rsi z=%rdx
	leaq	(%rdi,%rsi,4), %rax    # rax = x + 4y
	leaq	(%rdx,%rdx,2), %rcx    # rcx = z + 2z = 3z
	leaq	(%rax,%rcx,4), %rax    # rax = (x + 4y) + 4*(3z)
	retq
arith:
	xorl	%edi, %esi             # t1 = x ^ y   (only the low 32 bits matter after the mask)
	shlq	$4, %rdx               # z * 16
	leaq	(%rdx,%rdx,2), %rax    # t2 = 3 * (16z) = 48z
	andl	$252645135, %esi       # t3 = t1 & 0x0F0F0F0F
	subq	%rsi, %rax             # t4 = t2 - t3
	retq
remdiv:                        # q = x / y; r = x % y; *qp = q; *rp = r
	movq	%rdx, %r8              # save qp (idivq needs %rdx)
	movq	%rdi, %rax
	cqto                         # sign-extend %rax into %rdx:%rax (128 bits)
	idivq	%rsi                   # %rax = quotient, %rdx = remainder
	movq	%rax, (%r8)
	movq	%rdx, (%rcx)
	retq
`;

const c33 = L('ics102-ts-3-3',
  '3.3 — Arithmetic and logical operations: lea, shifts, multiply, divide|||3.3 — Phép toán số học và logic: lea, dịch, nhân, chia',
  'Lệnh leaq (tính địa chỉ mà không đọc bộ nhớ, dùng để tính nhanh), lệnh một/hai toán hạng, dịch, imul, cqto + idivq cho phép chia 128 bit; đọc từng dòng assembly thật của scale, arith, remdiv.',
  `<span class="eyebrow">ICS102 · Chapter 3 · Lesson 3.3</span>
<h2>Arithmetic and logical operations: lea, shifts, multiply, divide</h2>
<p class="lead">With data movement understood, the next step is computation. x86-64 has a small set of arithmetic and logic instructions — plus one surprising favourite of compilers, <code>leaq</code>, which does arithmetic by pretending to compute an address.</p>
<h3>🎯 Objectives</h3>
<ul><li>Explain what <code>leaq</code> computes and why compilers love it.</li><li>Read unary, binary and shift instructions.</li><li>Follow how 128-bit multiplication and division use %rdx:%rax.</li><li>Translate short assembly functions back to C.</li></ul>
<h3>📖 Lecture</h3>
<h4>leaq — load effective address</h4>
<p><code>leaq S, D</code> computes the <em>address</em> of memory operand S and writes it into D — <strong>without reading memory</strong>. In C terms it implements <code>&amp;a[i]</code>, but compilers use it for plain arithmetic of the form x + k·y + c with k ∈ {1, 2, 4, 8}. Example: if %rdx = x, then <code>leaq 7(%rdx,%rdx,4), %rax</code> sets %rax = 5x + 7.</p>
<h4>Unary and binary operations</h4>
<div class="formula"><span class="lbl">Instruction families (suffix b/w/l/q)</span>unary: inc D (D+1), dec D (D−1), neg D (−D), not D (~D)<br>binary: add S, D (D ← D + S), sub S, D (D ← D − S), imul S, D, xor S, D, or S, D, and S, D<br>shifts: sal/shl k, D (D &lt;&lt; k), sar k, D (arithmetic &gt;&gt;), shr k, D (logical &gt;&gt;) — k is an immediate or %cl</div>
<p>Careful with the order: <code>subq %rax, %rdx</code> means %rdx = %rdx − %rax (destination minus source). The second operand is both input and output.</p>
<h4>Special arithmetic: 128-bit results</h4>
<ul>
<li><code>imulq S</code> (one operand) and <code>mulq S</code> compute the full 128-bit product of S and %rax, leaving the high 64 bits in %rdx and the low 64 bits in %rax.</li>
<li><code>idivq S</code> divides the 128-bit number %rdx:%rax by S: quotient → %rax, remainder → %rdx. Before a signed division the dividend in %rax is sign-extended into %rdx with <code>cqto</code>; before an unsigned <code>divq</code>, %rdx is set to 0.</li>
</ul>
<h3>✍️ Worked example — read real compiler output</h3>
<p>The C source of <code>scale</code> and <code>arith</code> is in lesson 3.1; <code>remdiv</code> is:</p>
` + C(String.raw`
void remdiv(long x, long y, long *qp, long *rp) {
    long q = x / y;
    long r = x % y;
    *qp = q;
    *rp = r;
}
`) + `
<p>Real x86-64 output of clang -O1 (comments added by us):</p>
` + ASM(ASM_ARITH) + `
<p>Lessons from this code:</p>
<ul>
<li><code>scale</code> needs <strong>no multiply at all</strong>: three <code>leaq</code> compute x + 4y + 12z (12z is written as 4·3z).</li>
<li><code>arith</code> computes z·48 as (z·16)·3 using a shift and a <code>leaq</code>. The compiler noticed that after <code>&amp; 0x0F0F0F0F</code> only the low 32 bits of t1 matter, so it used the 32-bit <code>xorl</code>/<code>andl</code> (252645135 is 0x0F0F0F0F in decimal).</li>
<li><code>remdiv</code> must move qp out of %rdx because <code>idivq</code> uses %rdx; one <code>idivq</code> gives both the quotient and the remainder.</li>
</ul>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Thinking <code>leaq</code> reads memory — it never does.</li><li>Reading <code>subq %rsi, %rax</code> as rsi − rax; it is rax − rsi.</li><li>Forgetting that division clobbers %rdx (and that dividing by 0, or TMin by −1, raises an exception — chapter 8).</li><li>Expecting a literal <code>imul</code> for every <code>*</code> in C: constants usually become shifts and leaq.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li><code>leaq</code> computes Imm + R[b] + s·R[i] without touching memory — a fast arithmetic tool.</li><li>Binary ops: destination = destination op source.</li><li>sal/shl, sar (arithmetic), shr (logical); shift count is an immediate or %cl.</li><li>128-bit multiply/divide use %rdx:%rax; <code>cqto</code> before <code>idivq</code>.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.felixcloutier.com/x86/" target="_blank" rel="noopener">x86 instruction reference — LEA, IMUL, IDIV, CQO</a></li><li><a href="https://csapp.cs.cmu.edu/3e/labs.html" target="_blank" rel="noopener">CS:APP Bomb Lab — defuse a binary by reading its assembly</a></li><li><a href="https://godbolt.org/" target="_blank" rel="noopener">Compiler Explorer — try x * 9, x * 15, x / 8</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>%rax = x, %rcx = y. What do <code>leaq 6(%rax), %rdx</code>, <code>leaq (%rax,%rcx), %rdx</code>, <code>leaq 9(%rax,%rcx,2), %rdx</code>, <code>leaq 0xE(,%rax,8), %rdx</code> compute?</li><li>Translate to C: <code>leaq (%rdi,%rdi,2), %rax</code> · <code>salq $2, %rax</code> · <code>subq %rsi, %rax</code> · <code>retq</code> for <code>long f(long x, long y)</code>.</li><li>Why does the compiler emit <code>cqto</code> before <code>idivq</code> but not before <code>divq</code>?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) x + 6; x + y; x + 2y + 9; 8x + 14. 2) rax = 3x, then ·4 = 12x, then − y: <code>return 12 * x - y;</code>. 3) Signed division needs the 128-bit dividend sign-extended (copy of the sign bit into %rdx); unsigned division needs %rdx = 0 instead.</p></div>`,
  `<span class="eyebrow">ICS102 · Chương 3 · Bài 3.3</span>
<h2>Phép toán số học và logic: lea, dịch, nhân, chia</h2>
<p class="lead">Hiểu di chuyển dữ liệu rồi thì tới tính toán. x86-64 có một nhóm nhỏ lệnh số học và logic — cùng một lệnh được trình biên dịch cực kỳ ưa chuộng, <code>leaq</code>, làm phép tính bằng cách giả vờ tính địa chỉ.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Giải thích <code>leaq</code> tính gì và vì sao trình biên dịch thích nó.</li><li>Đọc lệnh một toán hạng, hai toán hạng và lệnh dịch.</li><li>Theo dõi phép nhân/chia 128 bit dùng %rdx:%rax.</li><li>Dịch ngược hàm assembly ngắn về C.</li></ul>
<h3>📖 Bài giảng</h3>
<h4>leaq — nạp địa chỉ hiệu dụng</h4>
<p><code>leaq S, D</code> tính <em>địa chỉ</em> của toán hạng bộ nhớ S rồi ghi vào D — <strong>không đọc bộ nhớ</strong>. Theo nghĩa C nó hiện thực <code>&amp;a[i]</code>, nhưng trình biên dịch dùng nó cho phép tính thường dạng x + k·y + c với k ∈ {1, 2, 4, 8}. Ví dụ: nếu %rdx = x thì <code>leaq 7(%rdx,%rdx,4), %rax</code> cho %rax = 5x + 7.</p>
<h4>Lệnh một và hai toán hạng</h4>
<div class="formula"><span class="lbl">Các họ lệnh (hậu tố b/w/l/q)</span>một toán hạng: inc D (D+1), dec D (D−1), neg D (−D), not D (~D)<br>hai toán hạng: add S, D (D ← D + S), sub S, D (D ← D − S), imul S, D, xor S, D, or S, D, and S, D<br>dịch: sal/shl k, D (D &lt;&lt; k), sar k, D (&gt;&gt; số học), shr k, D (&gt;&gt; logic) — k là hằng hoặc %cl</div>
<p>Cẩn thận thứ tự: <code>subq %rax, %rdx</code> nghĩa là %rdx = %rdx − %rax (đích trừ nguồn). Toán hạng thứ hai vừa là đầu vào vừa là đầu ra.</p>
<h4>Số học đặc biệt: kết quả 128 bit</h4>
<ul>
<li><code>imulq S</code> (một toán hạng) và <code>mulq S</code> tính tích 128 bit đầy đủ của S và %rax, để 64 bit cao trong %rdx và 64 bit thấp trong %rax.</li>
<li><code>idivq S</code> chia số 128 bit %rdx:%rax cho S: thương → %rax, dư → %rdx. Trước phép chia có dấu, số bị chia trong %rax được mở rộng dấu vào %rdx bằng <code>cqto</code>; trước <code>divq</code> không dấu, %rdx được đặt về 0.</li>
</ul>
<h3>✍️ Ví dụ — đọc output thật của trình biên dịch</h3>
<p>Mã C của <code>scale</code> và <code>arith</code> ở bài 3.1; còn <code>remdiv</code> là:</p>
` + C(String.raw`
void remdiv(long x, long y, long *qp, long *rp) {
    long q = x / y;
    long r = x % y;
    *qp = q;
    *rp = r;
}
`) + `
<p>Output x86-64 thật của clang -O1 (chú thích do chúng tôi thêm):</p>
` + ASM(ASM_ARITH) + `
<p>Bài học từ đoạn mã này:</p>
<ul>
<li><code>scale</code> <strong>không cần phép nhân nào</strong>: ba lệnh <code>leaq</code> tính x + 4y + 12z (12z viết thành 4·3z).</li>
<li><code>arith</code> tính z·48 thành (z·16)·3 bằng một phép dịch và một <code>leaq</code>. Trình biên dịch nhận ra sau <code>&amp; 0x0F0F0F0F</code> chỉ 32 bit thấp của t1 có ý nghĩa, nên dùng <code>xorl</code>/<code>andl</code> 32 bit (252645135 là 0x0F0F0F0F ở hệ 10).</li>
<li><code>remdiv</code> phải dời qp ra khỏi %rdx vì <code>idivq</code> dùng %rdx; một lệnh <code>idivq</code> cho cả thương lẫn số dư.</li>
</ul>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Tưởng <code>leaq</code> đọc bộ nhớ — nó không bao giờ đọc.</li><li>Đọc <code>subq %rsi, %rax</code> thành rsi − rax; thật ra là rax − rsi.</li><li>Quên phép chia ghi đè %rdx (và chia cho 0, hay TMin chia −1, gây ngoại lệ — chương 8).</li><li>Mong mỗi dấu <code>*</code> trong C thành một lệnh <code>imul</code>: nhân với hằng thường thành dịch và leaq.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li><code>leaq</code> tính Imm + R[b] + s·R[i] mà không đụng bộ nhớ — công cụ tính nhanh.</li><li>Lệnh hai toán hạng: đích = đích op nguồn.</li><li>sal/shl, sar (số học), shr (logic); số bit dịch là hằng hoặc %cl.</li><li>Nhân/chia 128 bit dùng %rdx:%rax; <code>cqto</code> trước <code>idivq</code>.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.felixcloutier.com/x86/" target="_blank" rel="noopener">Tra cứu lệnh x86 — LEA, IMUL, IDIV, CQO</a></li><li><a href="https://csapp.cs.cmu.edu/3e/labs.html" target="_blank" rel="noopener">CS:APP Bomb Lab — gỡ “bom” nhị phân bằng cách đọc assembly</a></li><li><a href="https://godbolt.org/" target="_blank" rel="noopener">Compiler Explorer — thử x * 9, x * 15, x / 8</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>%rax = x, %rcx = y. Các lệnh <code>leaq 6(%rax), %rdx</code>, <code>leaq (%rax,%rcx), %rdx</code>, <code>leaq 9(%rax,%rcx,2), %rdx</code>, <code>leaq 0xE(,%rax,8), %rdx</code> tính gì?</li><li>Dịch về C: <code>leaq (%rdi,%rdi,2), %rax</code> · <code>salq $2, %rax</code> · <code>subq %rsi, %rax</code> · <code>retq</code> với <code>long f(long x, long y)</code>.</li><li>Vì sao trình biên dịch sinh <code>cqto</code> trước <code>idivq</code> nhưng không trước <code>divq</code>?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) x + 6; x + y; x + 2y + 9; 8x + 14. 2) rax = 3x, rồi ·4 = 12x, rồi − y: <code>return 12 * x - y;</code>. 3) Chia có dấu cần số bị chia 128 bit được mở rộng dấu (chép bit dấu vào %rdx); chia không dấu thì cần %rdx = 0.</p></div>`);

const q3 = QZ(3, 'Quiz — Chapter 3: Machine-level programs I|||Quiz — Chương 3: Chương trình mức máy I', 'Kiểm tra chương 3: ISA, thanh ghi và quy ước đối số, cú pháp AT&T, chế độ địa chỉ, mov/movz/movs, push/pop, leaq, phép toán và chia 128 bit.', [
  Q('q1', 'In x86-64 Linux, the first argument of a function is passed in|||Trong x86-64 Linux, đối số thứ nhất của hàm được truyền trong',
    ['%rax|||%rax', '%rdi|||%rdi', '%rsi|||%rsi', '%rsp|||%rsp'], 1,
    'Arguments 1–6: %rdi, %rsi, %rdx, %rcx, %r8, %r9; the result is in %rax.|||Đối số 1–6: %rdi, %rsi, %rdx, %rcx, %r8, %r9; kết quả trong %rax.'),
  Q('q2', 'In AT&T syntax, movq %rsi, (%rdi) means|||Trong cú pháp AT&T, movq %rsi, (%rdi) nghĩa là',
    ['%rsi = %rdi|||%rsi = %rdi', 'memory at address %rdi = %rsi|||bộ nhớ tại địa chỉ %rdi = %rsi', '%rsi = memory at address %rdi|||%rsi = bộ nhớ tại địa chỉ %rdi', '%rdi = %rsi|||%rdi = %rsi'], 1,
    'Source first, destination last; parentheses mean memory.|||Nguồn trước, đích sau; ngoặc nghĩa là bộ nhớ.'),
  Q('q3', '%rax = 0x100, %rdx = 3. The effective address of 8(%rax,%rdx,4) is|||%rax = 0x100, %rdx = 3. Địa chỉ hiệu dụng của 8(%rax,%rdx,4) là',
    ['0x10B|||0x10B', '0x114|||0x114', '0x10C|||0x10C', '0x120|||0x120'], 1,
    '8 + 0x100 + 3·4 = 0x100 + 20 = 0x114.|||8 + 0x100 + 3·4 = 0x100 + 20 = 0x114.'),
  Q('q4', 'Which instruction is illegal?|||Lệnh nào không hợp lệ?',
    ['movq $5, (%rax)|||movq $5, (%rax)', 'movq (%rax), %rbx|||movq (%rax), %rbx', 'movq (%rax), (%rbx)|||movq (%rax), (%rbx)', 'movl %eax, %ebx|||movl %eax, %ebx'], 2,
    'x86-64 does not allow two memory operands in one mov.|||x86-64 không cho phép hai toán hạng bộ nhớ trong một lệnh mov.'),
  Q('q5', 'After movl $-1, %eax, the upper 32 bits of %rax are|||Sau movl $-1, %eax, 32 bit cao của %rax là',
    ['unchanged|||giữ nguyên', 'all ones|||toàn bit 1', 'all zeros|||toàn bit 0', 'undefined|||không xác định'], 2,
    'Any instruction writing a 32-bit register zeroes the upper half.|||Lệnh nào ghi thanh ghi 32 bit cũng xoá nửa trên về 0.'),
  Q('q6', 'Loading a signed char from memory into a 64-bit register uses|||Nạp một signed char từ bộ nhớ vào thanh ghi 64 bit dùng',
    ['movzbq|||movzbq', 'movsbq|||movsbq', 'movb|||movb', 'leaq|||leaq'], 1,
    'Signed values are sign-extended (movs…); unsigned values are zero-extended (movz…).|||Giá trị có dấu được mở rộng dấu (movs…); không dấu được mở rộng 0 (movz…).'),
  Q('q7', 'pushq %rbx performs|||pushq %rbx thực hiện',
    ['%rsp += 8, then store %rbx|||%rsp += 8, rồi ghi %rbx', '%rsp −= 8, then store %rbx at M[%rsp]|||%rsp −= 8, rồi ghi %rbx vào M[%rsp]', 'store %rbx, then %rsp −= 8|||ghi %rbx, rồi %rsp −= 8', 'load %rbx from the stack|||nạp %rbx từ ngăn xếp'], 1,
    'The stack grows toward lower addresses.|||Ngăn xếp lớn về phía địa chỉ thấp.'),
  Q('q8', 'If %rdi = x and %rsi = y, leaq 3(%rdi,%rsi,8), %rax computes|||Nếu %rdi = x và %rsi = y, leaq 3(%rdi,%rsi,8), %rax tính',
    ['M[x + 8y + 3]|||M[x + 8y + 3]', 'x + 8y + 3|||x + 8y + 3', '8x + y + 3|||8x + y + 3', '3x + 8y|||3x + 8y'], 1,
    'leaq computes the address and never reads memory.|||leaq tính địa chỉ và không bao giờ đọc bộ nhớ.'),
  Q('q9', 'subq %rsi, %rax computes|||subq %rsi, %rax tính',
    ['%rsi = %rsi − %rax|||%rsi = %rsi − %rax', '%rax = %rax − %rsi|||%rax = %rax − %rsi', '%rax = %rsi − %rax|||%rax = %rsi − %rax', '%rax = −%rsi|||%rax = −%rsi'], 1,
    'Destination = destination − source.|||Đích = đích − nguồn.'),
  Q('q10', 'After cqto; idivq %rsi, the remainder is in|||Sau cqto; idivq %rsi, số dư nằm trong',
    ['%rax|||%rax', '%rdx|||%rdx', '%rsi|||%rsi', '%rcx|||%rcx'], 1,
    'Quotient → %rax, remainder → %rdx.|||Thương → %rax, dư → %rdx.'),
]);

const ch3 = {
  title: 'Chapter 3 — Machine-level programs I: basics, data movement, arithmetic|||Chương 3 — Chương trình mức máy I: cơ bản, di chuyển dữ liệu, số học',
  description: 'ISA, thanh ghi x86-64, cú pháp AT&T, objdump thật; toán hạng và chế độ địa chỉ; mov/movz/movs, push/pop; leaq, phép toán, nhân/chia 128 bit — assembly sinh thật từ C (CS:APP 3.1–3.5).',
  lessons: [c31, c32, c33, q3],
};

// ───────────────────────────── Chương 4 — Mã máy II ─────────────────────────────
const SRC_CTRL = String.raw`
long absdiff(long x, long y) {
    long result;
    if (x < y) result = y - x;
    else       result = x - y;
    return result;
}
int comp(long a, long b) { return a < b; }
`;
const ASM_CTRL = String.raw`
absdiff:                       # x in %rdi, y in %rsi
	movq	%rdi, %rax
	subq	%rsi, %rax             # rax = x - y
	subq	%rdi, %rsi             # rsi = y - x   (also sets the condition codes)
	cmovgeq	%rsi, %rax           # if (y - x >= 0) rax = y - x
	retq
comp:
	xorl	%eax, %eax             # eax = 0
	cmpq	%rsi, %rdi             # compare a with b (computes a - b)
	setl	%al                    # al = (a < b) signed
	retq
`;

const c41 = L('ics102-ts-4-1',
  '4.1 — Condition codes, comparisons, jumps and conditional moves|||4.1 — Mã điều kiện, so sánh, lệnh nhảy và chuyển có điều kiện',
  'Bốn cờ CF ZF SF OF, cmp/test, họ lệnh set và jump (có dấu vs không dấu), dịch if-else bằng goto, chuyển có điều kiện cmov và khi nào trình biên dịch dùng nó; assembly thật của absdiff và comp.',
  `<span class="eyebrow">ICS102 · Chapter 4 · Lesson 4.1</span>
<h2>Condition codes, comparisons, jumps and conditional moves</h2>
<p class="lead">So far every instruction ran straight after the previous one. Real programs branch: <code>if</code>, loops, <code>switch</code>. At machine level all of them are built from just two mechanisms — test some data, then either <em>jump</em> to another place or <em>conditionally move</em> a value.</p>
<h3>🎯 Objectives</h3>
<ul><li>Explain the four condition codes CF, ZF, SF, OF.</li><li>Use cmp and test, and read set/jump instructions for signed and unsigned comparisons.</li><li>Translate if-else into the goto form that compilers produce.</li><li>Explain conditional moves and when they are (not) used.</li></ul>
<h3>📖 Lecture</h3>
<h4>Condition codes</h4>
<p>Besides the registers, the CPU keeps single-bit flags describing the most recent arithmetic or logical result t = a op b:</p>
<ul>
<li><strong>CF</strong> (carry): the operation produced a carry out of the top bit — <em>unsigned</em> overflow.</li>
<li><strong>ZF</strong> (zero): t == 0.</li>
<li><strong>SF</strong> (sign): t &lt; 0 (top bit is 1).</li>
<li><strong>OF</strong> (overflow): two's-complement overflow.</li>
</ul>
<p><code>leaq</code> does not change the flags. Two instructions only set flags without storing a result: <code>cmpq S2, S1</code> computes S1 − S2, and <code>testq S2, S1</code> computes S1 &amp; S2 (typical: <code>testq %rax, %rax</code> to check zero/negative).</p>
<h4>Reading the flags: set and jump</h4>
<div class="formula"><span class="lbl">After cmpq b, a (i.e. a − b)</span>e/z: a == b · ne: a ≠ b · <b>signed</b>: l (a &lt; b), le, g, ge · <b>unsigned</b>: b “below” (a &lt; b), be, a “above”, ae · s: negative</div>
<p><code>setX D</code> writes 0 or 1 into a byte register; <code>jX label</code> jumps when the condition holds; <code>jmp</code> jumps always (also indirectly, <code>jmp *%rax</code>). Signed comparisons use SF ^ OF, unsigned ones use CF — that is why the compiler picks <code>jl</code> for <code>int</code> and <code>jb</code> for <code>unsigned</code>.</p>
<h4>if-else as goto</h4>
<div class="formula"><span class="lbl">Template</span>if (!test) goto false_part;  then-statement;  goto done;<br>false_part:  else-statement;<br>done:</div>
<h4>Conditional moves</h4>
<p>Modern processors are pipelined (chapter 5) and must guess the outcome of a branch in advance. A wrong guess costs about 15–20 cycles. When both branches are cheap and safe, compilers instead compute <strong>both</strong> results and pick one with <code>cmovX S, R</code> (move only if condition X holds) — no branch, nothing to mispredict. Compilers avoid cmov when a branch is expensive, has side effects, or could fault (e.g. <code>p ? *p : 0</code> must not dereference a null p).</p>
<h3>✍️ Worked example</h3>
` + C(SRC_CTRL) + `
<p>Real x86-64 (clang -O1, comments ours):</p>
` + ASM(ASM_CTRL) + `
<p>clang computed both x − y and y − x and used <code>cmovgeq</code> — no jump at all. <code>comp</code> shows the typical idiom: zero %eax first (<code>xorl</code>), compare, then <code>setl</code> writes only the low byte.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Reading <code>cmpq %rsi, %rdi</code> as rsi − rdi: it is rdi − rsi (a − b where a is the second operand).</li><li>Mixing signed and unsigned jumps when translating C (jl vs jb).</li><li>Thinking <code>setl %al</code> clears the rest of %rax — it writes only one byte, hence the earlier <code>xorl</code>.</li><li>Assuming the compiler always uses jumps; with optimisation it often uses cmov.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Flags CF, ZF, SF, OF describe the last result; cmp = subtract, test = and, without storing.</li><li>set/jump read the flags; signed (l, g) vs unsigned (b, a) variants.</li><li>if-else compiles to conditional jumps (goto style) or to cmov.</li><li>cmov avoids branch mispredictions but evaluates both sides.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.cs.cmu.edu/~213/schedule.html" target="_blank" rel="noopener">CMU 15-213 — lecture “Machine-Level Programming II: Control”</a></li><li><a href="https://www.felixcloutier.com/x86/" target="_blank" rel="noopener">x86 reference — Jcc, SETcc, CMOVcc</a></li><li><a href="https://web.stanford.edu/class/cs107/guide/x86-64.html" target="_blank" rel="noopener">Stanford CS107 x86-64 guide — condition codes</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>After <code>cmpq $5, %rax</code> with %rax = 3, which of je, jl, jg, jb, ja jump?</li><li>Write the goto form of <code>if (a &gt; b) max = a; else max = b;</code>.</li><li>Why can't a compiler use cmov for <code>return p ? *p : 0;</code>?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 3 − 5: jl (3 &lt; 5 signed) and jb (3 &lt; 5 unsigned) jump; je, jg, ja do not. 2) <code>if (a &lt;= b) goto else_; max = a; goto done; else_: max = b; done:</code>. 3) cmov would evaluate <code>*p</code> before choosing — if p is NULL the load would crash.</p></div>`,
  `<span class="eyebrow">ICS102 · Chương 4 · Bài 4.1</span>
<h2>Mã điều kiện, so sánh, lệnh nhảy và chuyển có điều kiện</h2>
<p class="lead">Tới giờ mọi lệnh đều chạy ngay sau lệnh trước. Chương trình thật thì rẽ nhánh: <code>if</code>, vòng lặp, <code>switch</code>. Ở mức máy, tất cả chỉ dựng từ hai cơ chế — kiểm tra dữ liệu, rồi hoặc <em>nhảy</em> tới chỗ khác, hoặc <em>chuyển có điều kiện</em> một giá trị.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Giải thích bốn mã điều kiện CF, ZF, SF, OF.</li><li>Dùng cmp, test và đọc lệnh set/jump cho so sánh có dấu và không dấu.</li><li>Dịch if-else sang dạng goto mà trình biên dịch tạo ra.</li><li>Giải thích chuyển có điều kiện và khi nào nó (không) được dùng.</li></ul>
<h3>📖 Bài giảng</h3>
<h4>Mã điều kiện</h4>
<p>Ngoài thanh ghi, CPU giữ các cờ 1 bit mô tả kết quả số học/logic gần nhất t = a op b:</p>
<ul>
<li><strong>CF</strong> (carry): phép toán có bit nhớ ra khỏi bit cao nhất — tràn <em>không dấu</em>.</li>
<li><strong>ZF</strong> (zero): t == 0.</li>
<li><strong>SF</strong> (sign): t &lt; 0 (bit cao nhất là 1).</li>
<li><strong>OF</strong> (overflow): tràn bù hai.</li>
</ul>
<p><code>leaq</code> không đổi cờ. Có hai lệnh chỉ đặt cờ mà không lưu kết quả: <code>cmpq S2, S1</code> tính S1 − S2, và <code>testq S2, S1</code> tính S1 &amp; S2 (điển hình: <code>testq %rax, %rax</code> để kiểm bằng 0/âm).</p>
<h4>Đọc cờ: set và jump</h4>
<div class="formula"><span class="lbl">Sau cmpq b, a (tức a − b)</span>e/z: a == b · ne: a ≠ b · <b>có dấu</b>: l (a &lt; b), le, g, ge · <b>không dấu</b>: b “below” (a &lt; b), be, a “above”, ae · s: âm</div>
<p><code>setX D</code> ghi 0 hoặc 1 vào thanh ghi byte; <code>jX nhãn</code> nhảy khi điều kiện đúng; <code>jmp</code> luôn nhảy (cả nhảy gián tiếp, <code>jmp *%rax</code>). So sánh có dấu dùng SF ^ OF, không dấu dùng CF — vì thế trình biên dịch chọn <code>jl</code> cho <code>int</code> và <code>jb</code> cho <code>unsigned</code>.</p>
<h4>if-else dưới dạng goto</h4>
<div class="formula"><span class="lbl">Khuôn mẫu</span>if (!test) goto phan_sai;  lệnh-then;  goto xong;<br>phan_sai:  lệnh-else;<br>xong:</div>
<h4>Chuyển có điều kiện</h4>
<p>Bộ xử lý hiện đại chạy đường ống (chương 5) và phải đoán trước kết quả của lệnh rẽ nhánh. Đoán sai tốn khoảng 15–20 chu kỳ. Khi cả hai nhánh rẻ và an toàn, trình biên dịch tính <strong>cả hai</strong> kết quả rồi chọn một bằng <code>cmovX S, R</code> (chỉ chép khi điều kiện X đúng) — không có rẽ nhánh, không có gì để đoán sai. Trình biên dịch tránh cmov khi nhánh tốn kém, có tác dụng phụ, hoặc có thể gây lỗi (vd <code>p ? *p : 0</code> không được truy cập p rỗng).</p>
<h3>✍️ Ví dụ</h3>
` + C(SRC_CTRL) + `
<p>x86-64 thật (clang -O1, chú thích của chúng tôi):</p>
` + ASM(ASM_CTRL) + `
<p>clang tính cả x − y lẫn y − x rồi dùng <code>cmovgeq</code> — không có lệnh nhảy nào. <code>comp</code> cho thấy thành ngữ điển hình: xoá %eax trước (<code>xorl</code>), so sánh, rồi <code>setl</code> chỉ ghi byte thấp.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Đọc <code>cmpq %rsi, %rdi</code> thành rsi − rdi: thật ra là rdi − rsi (a − b với a là toán hạng thứ hai).</li><li>Trộn lệnh nhảy có dấu và không dấu khi dịch C (jl với jb).</li><li>Tưởng <code>setl %al</code> xoá phần còn lại của %rax — nó chỉ ghi một byte, nên mới có <code>xorl</code> trước đó.</li><li>Cho rằng trình biên dịch luôn dùng lệnh nhảy; khi tối ưu nó hay dùng cmov.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Cờ CF, ZF, SF, OF mô tả kết quả gần nhất; cmp = trừ, test = and, không lưu kết quả.</li><li>set/jump đọc cờ; biến thể có dấu (l, g) và không dấu (b, a).</li><li>if-else biên dịch thành lệnh nhảy có điều kiện (kiểu goto) hoặc cmov.</li><li>cmov tránh đoán sai nhánh nhưng phải tính cả hai vế.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.cs.cmu.edu/~213/schedule.html" target="_blank" rel="noopener">CMU 15-213 — bài giảng “Machine-Level Programming II: Control”</a></li><li><a href="https://www.felixcloutier.com/x86/" target="_blank" rel="noopener">Tra cứu x86 — Jcc, SETcc, CMOVcc</a></li><li><a href="https://web.stanford.edu/class/cs107/guide/x86-64.html" target="_blank" rel="noopener">Stanford CS107 — mã điều kiện trong x86-64</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Sau <code>cmpq $5, %rax</code> với %rax = 3, lệnh nào trong je, jl, jg, jb, ja sẽ nhảy?</li><li>Viết dạng goto của <code>if (a &gt; b) max = a; else max = b;</code>.</li><li>Vì sao trình biên dịch không dùng cmov cho <code>return p ? *p : 0;</code>?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 3 − 5: jl (3 &lt; 5 có dấu) và jb (3 &lt; 5 không dấu) nhảy; je, jg, ja không. 2) <code>if (a &lt;= b) goto else_; max = a; goto done; else_: max = b; done:</code>. 3) cmov sẽ tính <code>*p</code> trước khi chọn — nếu p là NULL phép nạp sẽ làm chương trình sập.</p></div>`);

const SRC_LOOPS = String.raw`
long fact_while(long n) {
    long result = 1;
    while (n > 1) { result *= n; n = n - 1; }
    return result;
}
long switch_eg(long x, long n) {
    long val = x;
    switch (n) {
    case 100: val *= 13; break;
    case 102: val += 10;   /* fall through */
    case 103: val += 11; break;
    case 104:
    case 106: val *= val; break;
    default:  val = 0;
    }
    return val;
}
`;
const ASM_LOOP = String.raw`
fact_while:                    # n in %rdi
	movl	$1, %eax               # result = 1
	cmpq	$2, %rdi
	jl	.LBB2_2                  # if (n < 2) skip the loop ("guard")
.LBB2_1:                       # loop body (do-while form)
	imulq	%rdi, %rax             # result *= n
	cmpq	$2, %rdi               # compare old n with 2
	leaq	-1(%rdi), %rdi         # n = n - 1   (leaq does not touch the flags)
	jg	.LBB2_1                  # repeat while old n > 2, i.e. new n > 1
.LBB2_2:
	retq
`;
const ASM_SWITCH = String.raw`
switch_eg:                     # x in %rdi, n in %rsi
	xorl	%eax, %eax             # default result 0
	addq	$-100, %rsi            # index = n - 100
	cmpq	$6, %rsi
	ja	.LBB0_7                  # unsigned index > 6 (also catches n < 100!) -> default
	jmpq	*.LJTI0_0(,%rsi,8)     # indirect jump through the table
.LBB0_5:                       # case 104, 106
	imulq	%rdi, %rdi
	jmp	.LBB0_6
.LBB0_3:                       # case 102
	addq	$10, %rdi
.LBB0_4:                       # case 103 (102 falls through to here)
	addq	$11, %rdi
.LBB0_6:
	movq	%rdi, %rax
.LBB0_7:
	retq
.LBB0_2:                       # case 100: x*13 = x + 4*(3x)
	leaq	(%rdi,%rdi,2), %rax
	leaq	(%rdi,%rax,4), %rax
	retq
	.section	.rodata,"a",@progbits
.LJTI0_0:                      # jump table: one 8-byte address per index 0..6
	.quad	.LBB0_2                # n = 100
	.quad	.LBB0_7                # n = 101 -> default
	.quad	.LBB0_3                # n = 102
	.quad	.LBB0_4                # n = 103
	.quad	.LBB0_5                # n = 104
	.quad	.LBB0_7                # n = 105 -> default
	.quad	.LBB0_5                # n = 106
`;

const c42 = L('ics102-ts-4-2',
  '4.2 — Loops and switch statements: do-while form and jump tables|||4.2 — Vòng lặp và switch: dạng do-while và bảng nhảy',
  'Dịch do-while, while (guarded-do / jump-to-middle), for sang mã máy; switch thành bảng nhảy với phép so sánh không dấu bắt cả hai biên; đọc assembly thật của fact_while và switch_eg.',
  `<span class="eyebrow">ICS102 · Chapter 4 · Lesson 4.2</span>
<h2>Loops and switch statements: do-while form and jump tables</h2>
<p class="lead">C has three loop forms and a <code>switch</code>; the machine has only conditional and indirect jumps. This lesson shows the standard translations, so you can recognise a loop or a switch in any disassembly — a key skill for debugging and for the CS:APP Bomb Lab.</p>
<h3>🎯 Objectives</h3>
<ul><li>Translate do-while, while and for loops into goto form.</li><li>Recognise the “guarded-do” and “jump-to-middle” translations of while.</li><li>Explain how a jump table implements switch in constant time.</li><li>Read real compiler output for a loop and a switch.</li></ul>
<h3>📖 Lecture</h3>
<h4>do-while</h4>
<div class="formula"><span class="lbl">do body while (test);</span>loop:  body;  if (test) goto loop;</div>
<h4>while</h4>
<p>Two translations: <strong>jump to middle</strong> (jump to the test first: <code>goto test; loop: body; test: if (test) goto loop;</code>) — used at low optimisation; and <strong>guarded-do</strong> (check once, then a do-while: <code>if (!test) goto done; loop: body; if (test) goto loop; done:</code>) — used at higher optimisation because the first test can often be simplified.</p>
<h4>for</h4>
<p><code>for (init; test; update) body</code> is the same as <code>init; while (test) { body; update; }</code>, then translated as above. (A <code>continue</code> must jump to <code>update</code>, not to the test.)</p>
<h4>switch and jump tables</h4>
<p>When case labels are many and fairly dense, the compiler builds a <strong>jump table</strong>: an array of code addresses indexed by the case value minus the smallest label. The selection takes constant time no matter how many cases there are. One clever trick: after computing <code>index = n − 100</code>, a single <strong>unsigned</strong> comparison <code>index &gt; 6</code> rejects both n &gt; 106 and n &lt; 100 (a negative index becomes a huge unsigned number).</p>
<h3>✍️ Worked example</h3>
` + C(SRC_LOOPS) + `
<p>Real x86-64 for <code>fact_while</code> (clang -O1, comments ours) — the guarded-do translation:</p>
` + ASM(ASM_LOOP) + `
<p>A subtle detail: the <code>cmpq</code> is placed before <code>leaq</code>, because <code>leaq</code> does not change the flags; the jump uses the comparison of the old n.</p>
<p>Real x86-64 for <code>switch_eg</code> (comments ours):</p>
` + ASM(ASM_SWITCH) + `
<p>Everything from the C code is visible: missing cases 101 and 105 point to the default; 104 and 106 share code; case 102 has no jump so it falls through into 103; multiplication by 13 became two <code>leaq</code>.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Expecting the loop test at the top in assembly — it is usually at the bottom.</li><li>Missing a fall-through when translating assembly back to C.</li><li>Thinking a switch is always a chain of comparisons: sparse labels (e.g. 1, 1000, 1000000) give comparisons; dense ones give a table.</li><li>Forgetting the default path for both out-of-range sides.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>All loops become conditional jumps; do-while is the basic shape.</li><li>while → jump-to-middle or guarded-do; for → while with init/update.</li><li>Dense switch → jump table + indirect jump <code>jmp *table(,%reg,8)</code>.</li><li>An unsigned compare checks both bounds of the table index.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.cs.cmu.edu/~213/schedule.html" target="_blank" rel="noopener">CMU 15-213 — lecture “Machine-Level Programming II: Control”</a></li><li><a href="https://csapp.cs.cmu.edu/3e/labs.html" target="_blank" rel="noopener">CS:APP Bomb Lab — phases with loops and switch</a></li><li><a href="https://godbolt.org/" target="_blank" rel="noopener">Compiler Explorer — compare a sparse and a dense switch</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Write the goto (guarded-do) form of <code>while (x &gt; 0) { s += x; x--; }</code>.</li><li>A jump table has 5 entries and the code does <code>subq $10, %rsi; cmpq $4, %rsi; ja .Ldefault</code>. Which case values can exist?</li><li>For n = 99, which path does <code>switch_eg</code> take in the assembly above, and why?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) <code>if (x &lt;= 0) goto done; loop: s += x; x--; if (x &gt; 0) goto loop; done:</code>. 2) 10, 11, 12, 13, 14 (some may point to the default). 3) index = −1, which as unsigned is 2<sup>64</sup> − 1 &gt; 6, so <code>ja</code> jumps to the default and returns 0.</p></div>`,
  `<span class="eyebrow">ICS102 · Chương 4 · Bài 4.2</span>
<h2>Vòng lặp và switch: dạng do-while và bảng nhảy</h2>
<p class="lead">C có ba dạng vòng lặp và lệnh <code>switch</code>; máy chỉ có lệnh nhảy có điều kiện và nhảy gián tiếp. Bài này trình bày các cách dịch chuẩn, để bạn nhận ra vòng lặp hay switch trong bất kỳ bản dịch ngược nào — kỹ năng then chốt khi gỡ lỗi và khi làm Bomb Lab của CS:APP.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Dịch vòng do-while, while, for sang dạng goto.</li><li>Nhận ra hai cách dịch while: “guarded-do” và “jump-to-middle”.</li><li>Giải thích bảng nhảy hiện thực switch trong thời gian hằng thế nào.</li><li>Đọc output thật của trình biên dịch cho một vòng lặp và một switch.</li></ul>
<h3>📖 Bài giảng</h3>
<h4>do-while</h4>
<div class="formula"><span class="lbl">do thân while (điều_kiện);</span>loop:  thân;  if (điều_kiện) goto loop;</div>
<h4>while</h4>
<p>Hai cách dịch: <strong>nhảy vào giữa (jump to middle)</strong> (nhảy tới phép kiểm trước: <code>goto test; loop: thân; test: if (điều_kiện) goto loop;</code>) — dùng khi tối ưu thấp; và <strong>do có canh (guarded-do)</strong> (kiểm một lần rồi chạy do-while: <code>if (!điều_kiện) goto done; loop: thân; if (điều_kiện) goto loop; done:</code>) — dùng khi tối ưu cao vì phép kiểm đầu thường rút gọn được.</p>
<h4>for</h4>
<p><code>for (init; test; update) thân</code> giống <code>init; while (test) { thân; update; }</code>, rồi dịch như trên. (Lệnh <code>continue</code> phải nhảy tới <code>update</code>, không phải tới phép kiểm.)</p>
<h4>switch và bảng nhảy</h4>
<p>Khi nhãn case nhiều và khá dày, trình biên dịch dựng <strong>bảng nhảy (jump table)</strong>: một mảng địa chỉ mã, đánh chỉ số bằng giá trị case trừ nhãn nhỏ nhất. Việc chọn nhánh mất thời gian hằng dù có bao nhiêu case. Một mẹo khéo: sau khi tính <code>index = n − 100</code>, chỉ một phép so sánh <strong>không dấu</strong> <code>index &gt; 6</code> loại được cả n &gt; 106 lẫn n &lt; 100 (chỉ số âm thành số không dấu rất lớn).</p>
<h3>✍️ Ví dụ</h3>
` + C(SRC_LOOPS) + `
<p>x86-64 thật của <code>fact_while</code> (clang -O1, chú thích của chúng tôi) — cách dịch guarded-do:</p>
` + ASM(ASM_LOOP) + `
<p>Một chi tiết tinh tế: <code>cmpq</code> đặt trước <code>leaq</code>, vì <code>leaq</code> không đổi cờ; lệnh nhảy dùng kết quả so sánh với n cũ.</p>
<p>x86-64 thật của <code>switch_eg</code> (chú thích của chúng tôi):</p>
` + ASM(ASM_SWITCH) + `
<p>Mọi thứ trong mã C đều thấy được: case 101 và 105 bị thiếu trỏ tới default; 104 và 106 dùng chung mã; case 102 không có lệnh nhảy nên rơi xuống 103; phép nhân với 13 thành hai lệnh <code>leaq</code>.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Mong phép kiểm vòng lặp nằm ở đầu trong assembly — thường nó ở cuối.</li><li>Bỏ sót rơi-xuống (fall-through) khi dịch assembly về C.</li><li>Tưởng switch luôn là chuỗi so sánh: nhãn thưa (vd 1, 1000, 1000000) cho chuỗi so sánh; nhãn dày cho bảng nhảy.</li><li>Quên đường default ở cả hai phía ngoài miền.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Mọi vòng lặp thành lệnh nhảy có điều kiện; do-while là hình dạng cơ bản.</li><li>while → jump-to-middle hoặc guarded-do; for → while kèm init/update.</li><li>switch dày → bảng nhảy + nhảy gián tiếp <code>jmp *bảng(,%reg,8)</code>.</li><li>Một phép so sánh không dấu kiểm cả hai biên chỉ số bảng.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.cs.cmu.edu/~213/schedule.html" target="_blank" rel="noopener">CMU 15-213 — bài giảng “Machine-Level Programming II: Control”</a></li><li><a href="https://csapp.cs.cmu.edu/3e/labs.html" target="_blank" rel="noopener">CS:APP Bomb Lab — các pha có vòng lặp và switch</a></li><li><a href="https://godbolt.org/" target="_blank" rel="noopener">Compiler Explorer — so sánh switch thưa và switch dày</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Viết dạng goto (guarded-do) của <code>while (x &gt; 0) { s += x; x--; }</code>.</li><li>Một bảng nhảy có 5 phần tử và mã làm <code>subq $10, %rsi; cmpq $4, %rsi; ja .Ldefault</code>. Những giá trị case nào có thể tồn tại?</li><li>Với n = 99, <code>switch_eg</code> trong assembly trên đi đường nào, vì sao?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) <code>if (x &lt;= 0) goto done; loop: s += x; x--; if (x &gt; 0) goto loop; done:</code>. 2) 10, 11, 12, 13, 14 (một số có thể trỏ tới default). 3) index = −1, xem như không dấu là 2<sup>64</sup> − 1 &gt; 6, nên <code>ja</code> nhảy tới default và trả 0.</p></div>`);

const SRC_PROC = String.raw`
long incr(long *p, long val) {
    long x = *p;
    long y = x + val;
    *p = y;
    return x;
}
long call_incr(void) {
    long v1 = 15213;
    long v2 = incr(&v1, 3000);
    return v1 + v2;
}
long rfact(long n) {
    if (n <= 1) return 1;
    return n * rfact(n - 1);
}
`;
const ASM_PROC = String.raw`
incr:
	movq	(%rdi), %rax           # x = *p
	addq	%rax, %rsi             # y = x + val
	movq	%rsi, (%rdi)           # *p = y
	retq                         # return x
call_incr:
	pushq	%rax                   # make 8 bytes of room on the stack (value ignored)
	movq	$15213, (%rsp)         # v1 = 15213, stored on the stack
	movq	%rsp, %rdi             # arg 1 = &v1  (v1 needs an address, so it lives in memory)
	movl	$3000, %esi            # arg 2 = 3000
	callq	incr                   # push return address, jump to incr
	addq	(%rsp), %rax           # v2 + v1
	popq	%rcx                   # free the 8 bytes
	retq
rfact:
	movl	$1, %eax
	cmpq	$2, %rdi
	jl	.LBB2_2                  # n <= 1: return 1
	pushq	%rbx                   # save callee-saved %rbx
	leaq	-1(%rdi), %rax
	movq	%rdi, %rbx             # keep n in %rbx across the call
	movq	%rax, %rdi             # arg = n - 1
	callq	rfact
	imulq	%rbx, %rax             # n * rfact(n - 1)
	popq	%rbx                   # restore %rbx
.LBB2_2:
	retq
`;

const c43 = L('ics102-ts-4-3',
  '4.3 — Procedures: the run-time stack, call/ret, arguments, local data, recursion|||4.3 — Thủ tục: ngăn xếp lúc chạy, call/ret, đối số, dữ liệu cục bộ, đệ quy',
  'Ba cơ chế của lời gọi hàm (chuyển điều khiển, truyền dữ liệu, cấp phát bộ nhớ), khung ngăn xếp, call/ret, 6 đối số trong thanh ghi, biến cục bộ cần địa chỉ, thanh ghi caller/callee-saved, đệ quy; assembly thật của call_incr và rfact.',
  `<span class="eyebrow">ICS102 · Chapter 4 · Lesson 4.3</span>
<h2>Procedures: the run-time stack, call/ret, arguments, local data, recursion</h2>
<p class="lead">Functions are the main abstraction of programming. To make them work the machine needs three mechanisms: <strong>pass control</strong> to the function and back, <strong>pass data</strong> (arguments and the return value), and <strong>allocate and free</strong> local storage. x86-64 does all three with registers and one data structure — the stack.</p>
<h3>🎯 Objectives</h3>
<ul><li>Describe a stack frame and how call and ret use the stack.</li><li>State where arguments, the return value and local variables live.</li><li>Distinguish caller-saved and callee-saved registers.</li><li>Trace a recursive function at machine level.</li></ul>
<h3>📖 Lecture</h3>
<h4>The run-time stack and frames</h4>
<p>Each active function call owns a region of the stack called its <strong>stack frame</strong>. Frames are allocated when a function is called and freed when it returns, in last-in-first-out order — exactly a stack. %rsp points to the top (lowest address). Many functions need no frame at all: if all their data fits in registers and they call nothing, they never touch the stack (like <code>incr</code> below).</p>
<h4>Passing control</h4>
<ul>
<li><code>call Label</code>: push the <strong>return address</strong> (address of the instruction after the call) and jump to Label.</li>
<li><code>ret</code>: pop an address from the stack and jump to it.</li>
</ul>
<h4>Passing data</h4>
<p>Up to six integer/pointer arguments are passed in %rdi, %rsi, %rdx, %rcx, %r8, %r9 (floating-point ones in %xmm0–%xmm7). Further arguments go on the stack, in the caller's frame. The return value goes in %rax.</p>
<h4>Local storage on the stack</h4>
<p>Local variables normally live in registers. They must be placed in memory (the frame) when there are not enough registers, when they are arrays or structs, or when the code takes their address with <code>&amp;</code> — a register has no address.</p>
<h4>Register saving conventions</h4>
<ul>
<li><strong>Callee-saved</strong>: %rbx, %rbp, %r12–%r15. A function that uses one must save it (push) and restore it (pop) before returning, so the caller can rely on its value surviving a call.</li>
<li><strong>Caller-saved</strong>: all others (%rax, argument registers, %r10, %r11). Any call may overwrite them; a caller that needs such a value after a call must save it itself.</li>
</ul>
<p>The stack must also be 16-byte aligned at each call, which explains some “useless” pushes.</p>
<h3>✍️ Worked example</h3>
` + C(SRC_PROC) + `
<p>Real x86-64 (clang -O1 with inlining and tail calls disabled so the calls stay visible; comments ours):</p>
` + ASM(ASM_PROC) + `
<p>What to notice: <code>v1</code> lives on the stack only because its address <code>&amp;v1</code> is passed; <code>pushq %rax</code> is a cheap way to subtract 8 from %rsp (and keep the 16-byte alignment). In <code>rfact</code>, n must survive the recursive call, so it is kept in callee-saved %rbx, which is pushed first and popped last. Each recursive level has its own frame holding its saved %rbx and return address — that is why recursion “just works”.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Returning a pointer to a local variable: its frame is freed on return, the memory will be reused.</li><li>Thinking every function builds a frame with %rbp — modern compilers usually do not use a frame pointer.</li><li>Forgetting that a call can destroy %rax, %rcx, %rdx, %rsi, %rdi, %r8–%r11.</li><li>Unbounded recursion: each level uses stack space until the stack overflows (segmentation fault).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>call pushes the return address; ret pops it.</li><li>Args 1–6 in registers, the rest on the stack; result in %rax.</li><li>Locals go to the frame when registers are not enough, for arrays/structs, or when their address is taken.</li><li>Callee-saved: %rbx, %rbp, %r12–%r15; everything else caller-saved.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.cs.cmu.edu/~213/schedule.html" target="_blank" rel="noopener">CMU 15-213 — lecture “Machine-Level Programming III: Procedures”</a></li><li><a href="https://en.wikipedia.org/wiki/X86_calling_conventions" target="_blank" rel="noopener">Wikipedia — x86 calling conventions</a></li><li><a href="https://gitlab.com/x86-psABIs/x86-64-ABI" target="_blank" rel="noopener">The official x86-64 System V ABI document</a></li><li><a href="https://pythontutor.com/c.html" target="_blank" rel="noopener">C Tutor — watch frames appear and disappear in rfact</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>A function has 8 long arguments. Where are arguments 7 and 8?</li><li>Why does <code>call_incr</code> keep v1 in memory while <code>incr</code> keeps x in a register?</li><li>In <code>rfact</code>, what would go wrong if n were kept in %rcx instead of %rbx?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) On the stack, in the caller's frame (argument 7 at the lower address, just above the return address when the callee starts). 2) &amp;v1 is passed to <code>incr</code>; a register has no address. x is never addressed. 3) %rcx is caller-saved: the recursive call may overwrite it, so n would be lost.</p></div>`,
  `<span class="eyebrow">ICS102 · Chương 4 · Bài 4.3</span>
<h2>Thủ tục: ngăn xếp lúc chạy, call/ret, đối số, dữ liệu cục bộ, đệ quy</h2>
<p class="lead">Hàm là trừu tượng chính của lập trình. Để hàm chạy được, máy cần ba cơ chế: <strong>chuyển điều khiển</strong> vào hàm rồi trở về, <strong>truyền dữ liệu</strong> (đối số và giá trị trả về), và <strong>cấp phát, giải phóng</strong> vùng nhớ cục bộ. x86-64 làm cả ba bằng thanh ghi và một cấu trúc dữ liệu — ngăn xếp.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Mô tả khung ngăn xếp và cách call, ret dùng ngăn xếp.</li><li>Nêu đối số, giá trị trả về và biến cục bộ nằm ở đâu.</li><li>Phân biệt thanh ghi caller-saved và callee-saved.</li><li>Lần theo một hàm đệ quy ở mức máy.</li></ul>
<h3>📖 Bài giảng</h3>
<h4>Ngăn xếp lúc chạy và khung</h4>
<p>Mỗi lời gọi hàm đang hoạt động sở hữu một vùng ngăn xếp gọi là <strong>khung ngăn xếp (stack frame)</strong>. Khung được cấp khi hàm được gọi và giải phóng khi hàm trả về, theo thứ tự vào sau ra trước — đúng là một ngăn xếp. %rsp trỏ tới đỉnh (địa chỉ thấp nhất). Nhiều hàm không cần khung: nếu mọi dữ liệu vừa trong thanh ghi và chúng không gọi ai, chúng không đụng tới ngăn xếp (như <code>incr</code> dưới đây).</p>
<h4>Chuyển điều khiển</h4>
<ul>
<li><code>call Nhãn</code>: đẩy <strong>địa chỉ trở về</strong> (địa chỉ lệnh sau call) lên ngăn xếp rồi nhảy tới Nhãn.</li>
<li><code>ret</code>: lấy một địa chỉ ra khỏi ngăn xếp và nhảy tới đó.</li>
</ul>
<h4>Truyền dữ liệu</h4>
<p>Tối đa sáu đối số số nguyên/con trỏ được truyền trong %rdi, %rsi, %rdx, %rcx, %r8, %r9 (số thực trong %xmm0–%xmm7). Các đối số còn lại đặt trên ngăn xếp, trong khung của hàm gọi. Giá trị trả về nằm trong %rax.</p>
<h4>Vùng nhớ cục bộ trên ngăn xếp</h4>
<p>Biến cục bộ thường nằm trong thanh ghi. Chúng phải đặt vào bộ nhớ (khung) khi không đủ thanh ghi, khi là mảng hay struct, hoặc khi code lấy địa chỉ của chúng bằng <code>&amp;</code> — thanh ghi không có địa chỉ.</p>
<h4>Quy ước lưu thanh ghi</h4>
<ul>
<li><strong>Callee-saved (bên được gọi lưu)</strong>: %rbx, %rbp, %r12–%r15. Hàm nào dùng chúng phải lưu (push) và khôi phục (pop) trước khi trả về, để hàm gọi tin rằng giá trị còn nguyên sau lời gọi.</li>
<li><strong>Caller-saved (bên gọi lưu)</strong>: tất cả thanh ghi còn lại (%rax, các thanh ghi đối số, %r10, %r11). Lời gọi nào cũng có thể ghi đè chúng; hàm gọi cần giữ giá trị như vậy sau lời gọi thì tự phải lưu.</li>
</ul>
<p>Ngăn xếp còn phải căn lề 16 byte ở mỗi lời gọi, điều này giải thích vài lệnh push “vô ích”.</p>
<h3>✍️ Ví dụ</h3>
` + C(SRC_PROC) + `
<p>x86-64 thật (clang -O1, tắt inline và tối ưu gọi đuôi để lời gọi còn nhìn thấy; chú thích của chúng tôi):</p>
` + ASM(ASM_PROC) + `
<p>Điều cần thấy: <code>v1</code> nằm trên ngăn xếp chỉ vì địa chỉ <code>&amp;v1</code> được truyền đi; <code>pushq %rax</code> là cách rẻ để trừ %rsp đi 8 (và giữ căn lề 16 byte). Trong <code>rfact</code>, n phải sống sót qua lời gọi đệ quy nên được giữ trong %rbx (callee-saved), thanh ghi này được push đầu tiên và pop cuối cùng. Mỗi tầng đệ quy có khung riêng chứa %rbx đã lưu và địa chỉ trở về — vì thế đệ quy “tự nhiên chạy đúng”.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Trả về con trỏ tới biến cục bộ: khung bị giải phóng khi hàm trả về, vùng nhớ sẽ bị dùng lại.</li><li>Tưởng hàm nào cũng dựng khung với %rbp — trình biên dịch hiện đại thường không dùng con trỏ khung.</li><li>Quên rằng lời gọi có thể phá %rax, %rcx, %rdx, %rsi, %rdi, %r8–%r11.</li><li>Đệ quy không điểm dừng: mỗi tầng tốn chỗ ngăn xếp cho tới khi tràn ngăn xếp (segmentation fault).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>call đẩy địa chỉ trở về; ret lấy nó ra.</li><li>Đối số 1–6 trong thanh ghi, còn lại trên ngăn xếp; kết quả trong %rax.</li><li>Biến cục bộ vào khung khi thiếu thanh ghi, khi là mảng/struct, hoặc khi bị lấy địa chỉ.</li><li>Callee-saved: %rbx, %rbp, %r12–%r15; còn lại là caller-saved.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.cs.cmu.edu/~213/schedule.html" target="_blank" rel="noopener">CMU 15-213 — bài giảng “Machine-Level Programming III: Procedures”</a></li><li><a href="https://en.wikipedia.org/wiki/X86_calling_conventions" target="_blank" rel="noopener">Wikipedia — Quy ước gọi hàm x86</a></li><li><a href="https://gitlab.com/x86-psABIs/x86-64-ABI" target="_blank" rel="noopener">Tài liệu chính thức x86-64 System V ABI</a></li><li><a href="https://pythontutor.com/c.html" target="_blank" rel="noopener">C Tutor — xem khung xuất hiện và biến mất trong rfact</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Một hàm có 8 đối số long. Đối số 7 và 8 nằm ở đâu?</li><li>Vì sao <code>call_incr</code> giữ v1 trong bộ nhớ còn <code>incr</code> giữ x trong thanh ghi?</li><li>Trong <code>rfact</code>, chuyện gì sai nếu n được giữ trong %rcx thay vì %rbx?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Trên ngăn xếp, trong khung của hàm gọi (đối số 7 ở địa chỉ thấp hơn, ngay trên địa chỉ trở về khi hàm được gọi bắt đầu chạy). 2) &amp;v1 được truyền cho <code>incr</code>; thanh ghi không có địa chỉ. x không bao giờ bị lấy địa chỉ. 3) %rcx là caller-saved: lời gọi đệ quy có thể ghi đè nó, n sẽ mất.</p></div>`);

const SRC_STRUCT = String.raw`
#include <stdio.h>
#include <stddef.h>
struct S1 { int i; char c; int j; };
struct S2 { int i; int j; char c; };
struct S3 { char c; double d; char c2; };
struct S4 { double d; char c; char c2; };
int main(void) {
    printf("S1 {int,char,int}    size=%zu  offsets i=%zu c=%zu j=%zu\n", sizeof(struct S1), offsetof(struct S1,i), offsetof(struct S1,c), offsetof(struct S1,j));
    printf("S2 {int,int,char}    size=%zu\n", sizeof(struct S2));
    printf("S3 {char,double,char} size=%zu  d at %zu\n", sizeof(struct S3), offsetof(struct S3,d));
    printf("S4 {double,char,char} size=%zu\n", sizeof(struct S4));
    int A[3][4];
    printf("&A[0][0]=%p &A[1][0]=%p diff=%td bytes\n", (void*)&A[0][0], (void*)&A[1][0], (char*)&A[1][0]-(char*)&A[0][0]);
    return 0;
}
`;
const OUT_STRUCT = String.raw`
S1 {int,char,int}    size=12  offsets i=0 c=4 j=8
S2 {int,int,char}    size=12
S3 {char,double,char} size=24  d at 8
S4 {double,char,char} size=16
&A[0][0]=0x16bbda538 &A[1][0]=0x16bbda548 diff=16 bytes
`;
const SRC_BOF = String.raw`
#include <stdio.h>
#include <string.h>
void echo(const char *input) {
    char buf[8];                 /* far too small */
    strcpy(buf, input);          /* no bounds check! */
    printf("echo: %s\n", buf);
}
int main(int argc, char *argv[]) {
    setvbuf(stdout, NULL, _IONBF, 0);
    echo(argc > 1 ? argv[1] : "hi");
    printf("returned normally\n");
    return 0;
}
`;
const OUT_BOF = String.raw`
$ cc -O0 -fstack-protector-all -D_FORTIFY_SOURCE=0 bof.c -o bof
$ ./bof hello
echo: hello
returned normally
$ ./bof AAAAAAAAAAAAAAAAAAAAAAAA; echo "exit status = $?"
echo: AAAAAAAAAAAAAAAAAAAAAAAA
bash: line 1: 25921 Abort trap: 6           ./bof AAAAAAAAAAAAAAAAAAAAAAAA
exit status = 134
`;

const c44 = L('ics102-ts-4-4',
  '4.4 — Arrays, structs, alignment and buffer-overflow attacks|||4.4 — Mảng, struct, căn lề và tấn công tràn bộ đệm',
  'Mảng một/hai chiều và công thức địa chỉ, số học con trỏ, struct và căn lề (sizeof đo thật), tràn bộ đệm trên ngăn xếp: vì sao nguy hiểm, ba lớp phòng thủ (ASLR, stack canary đo thật, vùng không thực thi) và cách viết code an toàn.',
  `<span class="eyebrow">ICS102 · Chapter 4 · Lesson 4.4</span>
<h2>Arrays, structs, alignment and buffer-overflow attacks</h2>
<p class="lead">Machine code has no arrays or structs — only addresses and offsets. Understanding how C lays out data explains pointer arithmetic, mysterious struct sizes and, most importantly, one of the most exploited security bugs in history: the buffer overflow.</p>
<h3>🎯 Objectives</h3>
<ul><li>Compute the address of an element of a 1-D or 2-D array.</li><li>Predict struct layout, padding and size from alignment rules.</li><li>Explain how a stack buffer overflow can hijack control flow.</li><li>Describe and observe the standard defences.</li></ul>
<h3>📖 Lecture</h3>
<h4>Arrays</h4>
<p>For <code>T A[N]</code> starting at address x<sub>A</sub>, element i is at x<sub>A</sub> + L·i where L = sizeof(T). Pointer arithmetic is scaled the same way: if <code>p</code> is a <code>T*</code>, then <code>p + i</code> is the address p + L·i, and <code>A[i]</code> is exactly <code>*(A + i)</code>. Two-dimensional arrays are stored in <strong>row-major order</strong>:</p>
<div class="formula"><span class="lbl">T D[R][C]</span>&amp;D[i][j] = x<sub>D</sub> + L·(C·i + j)</div>
<p>For <code>int A[3][4]</code> (L = 4, C = 4) a row is 16 bytes, so &amp;A[1][0] is 16 bytes after &amp;A[0][0] — our program below confirms it.</p>
<h4>Structs and alignment</h4>
<p>Fields are stored in declaration order at fixed offsets. Many machines require (x86-64 strongly recommends) that a K-byte primitive value sit at an address that is a multiple of K. So the compiler inserts <strong>padding</strong>: inside the struct so each field is aligned, and at the end so that in an array of structs every element is aligned too (the struct size is a multiple of its largest field's alignment). Ordering fields from largest to smallest minimises waste.</p>
<div class="callout"><p><b>Worked example.</b> <code>struct S3 { char c; double d; char c2; }</code>: c at 0; d must be at a multiple of 8 → 7 bytes padding, d at 8; c2 at 16; total must be a multiple of 8 → 24 bytes. Reordered as <code>{ double d; char c; char c2; }</code>: 8 + 1 + 1 = 10 → rounded to <b>16</b>. Same data, a third less memory.</p></div>
` + C(SRC_STRUCT) + `
<p>Real output (the addresses differ on every run):</p>
` + out(OUT_STRUCT) + `
<h4>Buffer overflow</h4>
<p>C does not check array bounds. Local arrays live in the stack frame, close to saved registers and the <strong>return address</strong>. Functions like <code>gets</code>, <code>strcpy</code>, <code>strcat</code>, <code>sprintf</code> copy until a terminator without knowing the buffer size. Input longer than the buffer overwrites the frame. If an attacker controls the bytes, they can overwrite the return address so that <code>ret</code> jumps to code of their choice — classic “stack smashing”, used by the 1988 Morris worm and countless attacks since.</p>
<h4>Defences (all enabled by default today)</h4>
<ul>
<li><strong>ASLR</strong> — address-space layout randomisation: the stack, heap and libraries start at random addresses on every run, so the attacker cannot predict where injected code is.</li>
<li><strong>Stack canary</strong> (stack protector): the compiler puts a random value between local buffers and the saved state, and checks it before returning; if it changed, the program aborts.</li>
<li><strong>Non-executable stack</strong> (NX bit): memory pages are marked as non-executable, so injected bytes cannot run as code.</li>
</ul>
<h3>✍️ Worked example — a canary catching an overflow</h3>
` + C(SRC_BOF) + `
<p>Real run on our Mac (we disabled the extra <code>strcpy</code> check of _FORTIFY_SOURCE so that the canary is what fires):</p>
` + out(OUT_BOF) + `
<p>The long input overwrote the canary; the check at the end of <code>echo</code> detected it and called <code>abort</code> (signal 6 → exit status 128 + 6 = 134) instead of returning to a corrupted address. Without protection the program could have continued with an attacker-chosen return address.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using <code>gets</code> (removed from C11) or unbounded <code>strcpy</code>/<code>scanf("%s")</code>. Use <code>fgets</code>, <code>snprintf</code>, <code>scanf("%7s")</code> with a width.</li><li>Off-by-one: a char buffer of size n holds only n − 1 characters plus the terminating '\\0'.</li><li>Assuming <code>sizeof(struct)</code> = sum of field sizes.</li><li>Thinking the defences make overflows harmless — they make exploitation harder, they do not fix the bug.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>A[i] = *(A + i) at x<sub>A</sub> + L·i; 2-D arrays are row-major.</li><li>Alignment adds padding; order fields large → small.</li><li>Writing past a stack buffer can overwrite the return address.</li><li>ASLR, canaries and NX make attacks hard; bounded functions prevent them.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://owasp.org/www-community/vulnerabilities/Buffer_Overflow" target="_blank" rel="noopener">OWASP — Buffer Overflow</a></li><li><a href="https://www.youtube.com/watch?v=1S0aBV-Waeo" target="_blank" rel="noopener">Computerphile — Running a Buffer Overflow Attack (video)</a></li><li><a href="https://en.wikipedia.org/wiki/Stack_buffer_overflow" target="_blank" rel="noopener">Wikipedia — Stack buffer overflow</a></li><li><a href="https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html" target="_blank" rel="noopener">GCC docs — -fstack-protector and sanitizers</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li><code>long A[5][7]</code> starts at 0x1000. What is the address of A[2][3]?</li><li>Give the offsets and total size of <code>struct { char a; int b; char c; short d; }</code>.</li><li>Rewrite <code>char name[16]; scanf("%s", name);</code> safely.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 0x1000 + 8·(7·2 + 3) = 0x1000 + 136 = 0x1088. 2) a 0, b 4 (3 bytes padding), c 8, d 10; size 12 (multiple of 4). 3) <code>scanf("%15s", name);</code> or <code>fgets(name, sizeof name, stdin);</code>.</p></div>`,
  `<span class="eyebrow">ICS102 · Chương 4 · Bài 4.4</span>
<h2>Mảng, struct, căn lề và tấn công tràn bộ đệm</h2>
<p class="lead">Mã máy không có mảng hay struct — chỉ có địa chỉ và độ dời. Hiểu C sắp xếp dữ liệu thế nào sẽ giải thích số học con trỏ, kích thước struct khó hiểu và quan trọng nhất là một trong những lỗi bảo mật bị khai thác nhiều nhất lịch sử: tràn bộ đệm.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính địa chỉ phần tử của mảng một chiều và hai chiều.</li><li>Dự đoán bố cục, phần đệm và kích thước struct từ luật căn lề.</li><li>Giải thích tràn bộ đệm trên ngăn xếp có thể chiếm luồng điều khiển ra sao.</li><li>Mô tả và quan sát các lớp phòng thủ chuẩn.</li></ul>
<h3>📖 Bài giảng</h3>
<h4>Mảng</h4>
<p>Với <code>T A[N]</code> bắt đầu ở địa chỉ x<sub>A</sub>, phần tử i nằm ở x<sub>A</sub> + L·i với L = sizeof(T). Số học con trỏ cũng nhân hệ số như vậy: nếu <code>p</code> là <code>T*</code> thì <code>p + i</code> là địa chỉ p + L·i, và <code>A[i]</code> chính là <code>*(A + i)</code>. Mảng hai chiều được lưu theo <strong>thứ tự hàng (row-major)</strong>:</p>
<div class="formula"><span class="lbl">T D[R][C]</span>&amp;D[i][j] = x<sub>D</sub> + L·(C·i + j)</div>
<p>Với <code>int A[3][4]</code> (L = 4, C = 4) mỗi hàng 16 byte, nên &amp;A[1][0] cách &amp;A[0][0] 16 byte — chương trình dưới đây xác nhận điều đó.</p>
<h4>Struct và căn lề</h4>
<p>Các trường được lưu theo thứ tự khai báo ở các độ dời cố định. Nhiều máy bắt buộc (x86-64 khuyến nghị mạnh) giá trị nguyên thuỷ K byte phải nằm ở địa chỉ là bội của K. Vì vậy trình biên dịch chèn <strong>phần đệm (padding)</strong>: bên trong struct để mỗi trường được căn lề, và ở cuối để trong mảng struct mọi phần tử cũng căn lề (kích thước struct là bội của mức căn lề của trường lớn nhất). Sắp trường từ lớn đến nhỏ giảm lãng phí.</p>
<div class="callout"><p><b>Ví dụ giải từng bước.</b> <code>struct S3 { char c; double d; char c2; }</code>: c ở 0; d phải ở bội của 8 → đệm 7 byte, d ở 8; c2 ở 16; tổng phải là bội của 8 → 24 byte. Sắp lại thành <code>{ double d; char c; char c2; }</code>: 8 + 1 + 1 = 10 → làm tròn lên <b>16</b>. Cùng dữ liệu, ít hơn một phần ba bộ nhớ.</p></div>
` + C(SRC_STRUCT) + `
<p>Output thật (địa chỉ khác nhau mỗi lần chạy):</p>
` + out(OUT_STRUCT) + `
<h4>Tràn bộ đệm</h4>
<p>C không kiểm biên mảng. Mảng cục bộ nằm trong khung ngăn xếp, sát các thanh ghi đã lưu và <strong>địa chỉ trở về</strong>. Các hàm như <code>gets</code>, <code>strcpy</code>, <code>strcat</code>, <code>sprintf</code> chép tới khi gặp ký tự kết thúc mà không biết kích thước bộ đệm. Dữ liệu vào dài hơn bộ đệm sẽ ghi đè khung. Nếu kẻ tấn công điều khiển được các byte đó, họ có thể ghi đè địa chỉ trở về để <code>ret</code> nhảy tới mã do họ chọn — kiểu “phá ngăn xếp” (stack smashing) kinh điển, được sâu Morris dùng năm 1988 và vô số vụ tấn công sau đó.</p>
<h4>Phòng thủ (ngày nay đều bật mặc định)</h4>
<ul>
<li><strong>ASLR</strong> — ngẫu nhiên hoá bố cục không gian địa chỉ: ngăn xếp, heap và thư viện bắt đầu ở địa chỉ ngẫu nhiên mỗi lần chạy, kẻ tấn công không đoán được mã chèn vào nằm đâu.</li>
<li><strong>Stack canary</strong> (bảo vệ ngăn xếp): trình biên dịch đặt một giá trị ngẫu nhiên giữa bộ đệm cục bộ và trạng thái đã lưu, kiểm tra nó trước khi trả về; nếu bị đổi, chương trình dừng.</li>
<li><strong>Ngăn xếp không thực thi</strong> (bit NX): trang nhớ được đánh dấu không chạy được, nên byte chèn vào không thể chạy như mã.</li>
</ul>
<h3>✍️ Ví dụ — canary bắt được tràn bộ đệm</h3>
` + C(SRC_BOF) + `
<p>Chạy thật trên máy Mac (chúng tôi tắt phép kiểm <code>strcpy</code> bổ sung của _FORTIFY_SOURCE để canary là thứ phát hiện):</p>
` + out(OUT_BOF) + `
<p>Chuỗi dài đã ghi đè canary; phép kiểm ở cuối <code>echo</code> phát hiện và gọi <code>abort</code> (tín hiệu 6 → mã thoát 128 + 6 = 134) thay vì trả về một địa chỉ đã hỏng. Không có bảo vệ, chương trình có thể chạy tiếp với địa chỉ trở về do kẻ tấn công chọn.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng <code>gets</code> (đã bị bỏ khỏi C11) hoặc <code>strcpy</code>/<code>scanf("%s")</code> không giới hạn. Dùng <code>fgets</code>, <code>snprintf</code>, <code>scanf("%7s")</code> có độ rộng.</li><li>Lệch một: bộ đệm char kích thước n chỉ chứa n − 1 ký tự cộng ký tự kết thúc '\\0'.</li><li>Tưởng <code>sizeof(struct)</code> = tổng kích thước các trường.</li><li>Tưởng có phòng thủ thì tràn bộ đệm vô hại — chúng làm khai thác khó hơn, không sửa được lỗi.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>A[i] = *(A + i) ở x<sub>A</sub> + L·i; mảng 2 chiều lưu theo hàng.</li><li>Căn lề thêm phần đệm; sắp trường từ lớn tới nhỏ.</li><li>Ghi quá bộ đệm trên ngăn xếp có thể ghi đè địa chỉ trở về.</li><li>ASLR, canary, NX làm tấn công khó; hàm có giới hạn độ dài ngăn được lỗi.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://owasp.org/www-community/vulnerabilities/Buffer_Overflow" target="_blank" rel="noopener">OWASP — Buffer Overflow (tràn bộ đệm)</a></li><li><a href="https://www.youtube.com/watch?v=1S0aBV-Waeo" target="_blank" rel="noopener">Computerphile — Running a Buffer Overflow Attack (video)</a></li><li><a href="https://en.wikipedia.org/wiki/Stack_buffer_overflow" target="_blank" rel="noopener">Wikipedia — Stack buffer overflow</a></li><li><a href="https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html" target="_blank" rel="noopener">Tài liệu GCC — -fstack-protector và sanitizer</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li><code>long A[5][7]</code> bắt đầu ở 0x1000. Địa chỉ của A[2][3] là gì?</li><li>Cho độ dời các trường và kích thước của <code>struct { char a; int b; char c; short d; }</code>.</li><li>Viết lại an toàn: <code>char name[16]; scanf("%s", name);</code>.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 0x1000 + 8·(7·2 + 3) = 0x1000 + 136 = 0x1088. 2) a 0, b 4 (đệm 3 byte), c 8, d 10; kích thước 12 (bội của 4). 3) <code>scanf("%15s", name);</code> hoặc <code>fgets(name, sizeof name, stdin);</code>.</p></div>`);

const q4 = QZ(4, 'Quiz — Chapter 4: Machine-level programs II|||Quiz — Chương 4: Chương trình mức máy II', 'Kiểm tra chương 4: cờ điều kiện, cmp/test, set/jump có dấu và không dấu, cmov, vòng lặp, bảng nhảy, call/ret, quy ước thanh ghi, mảng/struct/căn lề, tràn bộ đệm.', [
  Q('q1', 'cmpq %rsi, %rdi sets the flags according to|||cmpq %rsi, %rdi đặt cờ theo',
    ['%rsi − %rdi|||%rsi − %rdi', '%rdi − %rsi|||%rdi − %rsi', '%rdi & %rsi|||%rdi & %rsi', '%rdi + %rsi|||%rdi + %rsi'], 1,
    'cmp S2, S1 computes S1 − S2 without storing it.|||cmp S2, S1 tính S1 − S2 mà không lưu kết quả.'),
  Q('q2', 'To compare two unsigned values a < b the compiler uses|||Để so sánh hai giá trị không dấu a < b, trình biên dịch dùng',
    ['jl / setl|||jl / setl', 'jb / setb|||jb / setb', 'jg / setg|||jg / setg', 'js / sets|||js / sets'], 1,
    '“below/above” are the unsigned forms (based on CF); “less/greater” are signed.|||“below/above” là dạng không dấu (dựa trên CF); “less/greater” là có dấu.'),
  Q('q3', 'The main advantage of a conditional move (cmov) over a branch is|||Ưu điểm chính của chuyển có điều kiện (cmov) so với rẽ nhánh là',
    ['it uses less memory|||tốn ít bộ nhớ hơn', 'no branch misprediction penalty|||không bị phạt do đoán sai nhánh', 'it evaluates only one side|||chỉ tính một vế', 'it works with pointers that may be NULL|||dùng được với con trỏ có thể NULL'], 1,
    'cmov computes both values and selects one, so the pipeline never guesses.|||cmov tính cả hai giá trị rồi chọn, đường ống không phải đoán.'),
  Q('q4', 'With optimisation, a while loop is often compiled as|||Khi tối ưu, vòng while thường được biên dịch thành',
    ['a jump table|||bảng nhảy', 'a guarded do-while: test once, then test at the bottom|||do-while có canh: kiểm một lần, rồi kiểm ở cuối', 'a recursive call|||lời gọi đệ quy', 'a cmov only|||chỉ một lệnh cmov'], 1,
    'Guarded-do: if (!test) goto done; loop: body; if (test) goto loop;|||Guarded-do: if (!test) goto done; loop: thân; if (test) goto loop;'),
  Q('q5', 'In a jump table for cases 100–106, why does one unsigned comparison “index > 6” suffice?|||Trong bảng nhảy cho case 100–106, vì sao một phép so sánh không dấu “index > 6” là đủ?',
    ['Because n is never below 100|||Vì n không bao giờ nhỏ hơn 100', 'Because a negative index becomes a huge unsigned value|||Vì chỉ số âm thành số không dấu rất lớn', 'Because jump tables have no default|||Vì bảng nhảy không có default', 'Because ja is a signed jump|||Vì ja là lệnh nhảy có dấu'], 1,
    'index = n − 100 < 0 wraps to a value > 6, so both bounds are checked.|||index = n − 100 < 0 quay vòng thành giá trị > 6, nên kiểm được cả hai biên.'),
  Q('q6', 'The call instruction|||Lệnh call',
    ['pops the return address|||lấy địa chỉ trở về ra', 'pushes the return address and jumps to the target|||đẩy địa chỉ trở về rồi nhảy tới đích', 'saves all registers|||lưu mọi thanh ghi', 'allocates the whole frame|||cấp phát cả khung'], 1,
    'ret later pops that address and jumps back.|||Sau đó ret lấy địa chỉ đó ra và nhảy về.'),
  Q('q7', 'Which register is callee-saved in x86-64 Linux?|||Thanh ghi nào là callee-saved trong x86-64 Linux?',
    ['%rax|||%rax', '%rdi|||%rdi', '%rbx|||%rbx', '%r10|||%r10'], 2,
    'Callee-saved: %rbx, %rbp, %r12–%r15.|||Callee-saved: %rbx, %rbp, %r12–%r15.'),
  Q('q8', 'A local variable must live in the stack frame (not a register) when|||Biến cục bộ phải nằm trong khung ngăn xếp (không ở thanh ghi) khi',
    ['it is an int|||nó là int', 'its address is taken with &|||địa chỉ của nó bị lấy bằng &', 'it is used in a loop|||nó được dùng trong vòng lặp', 'it is the return value|||nó là giá trị trả về'], 1,
    'Registers have no address, so &x forces x into memory.|||Thanh ghi không có địa chỉ, nên &x buộc x vào bộ nhớ.'),
  Q('q9', 'sizeof(struct { char c; double d; char c2; }) on x86-64 is|||sizeof(struct { char c; double d; char c2; }) trên x86-64 là',
    ['10|||10', '16|||16', '24|||24', '17|||17'], 2,
    'c@0, padding to 8, d@8, c2@16, size rounded to a multiple of 8 = 24 (measured).|||c@0, đệm tới 8, d@8, c2@16, kích thước làm tròn lên bội 8 = 24 (đã đo).'),
  Q('q10', 'A stack canary protects against buffer overflows by|||Stack canary chống tràn bộ đệm bằng cách',
    ['making the stack non-executable|||làm ngăn xếp không thực thi được', 'randomising addresses|||ngẫu nhiên hoá địa chỉ', 'checking a secret value before return and aborting if it changed|||kiểm một giá trị bí mật trước khi trả về và dừng nếu nó bị đổi', 'checking array bounds on every access|||kiểm biên mảng ở mỗi lần truy cập'], 2,
    'Those other ideas are NX and ASLR; C itself never checks bounds.|||Các ý kia là NX và ASLR; bản thân C không kiểm biên.'),
]);

const ch4 = {
  title: 'Chapter 4 — Machine-level programs II: control, procedures, data, security|||Chương 4 — Chương trình mức máy II: điều khiển, thủ tục, dữ liệu, bảo mật',
  description: 'Mã điều kiện, nhảy và cmov; vòng lặp và bảng nhảy switch; ngăn xếp, call/ret, quy ước thanh ghi, đệ quy; mảng, struct, căn lề; tràn bộ đệm và canary đo thật (CS:APP 3.6–3.10).',
  lessons: [c41, c42, c43, c44, q4],
};

// ───────────────────────────── Chương 5 — Bộ xử lý & hiệu năng ─────────────────────────────
const c51 = L('ics102-ts-5-1',
  '5.1 — From logic gates to a processor: ISA, Y86-64 and hardware building blocks|||5.1 — Từ cổng logic tới bộ xử lý: ISA, Y86-64 và các khối phần cứng',
  'ISA tách phần mềm khỏi hiện thực; Y86-64 (tập lệnh giản lược của CS:APP) và cách mã hoá lệnh; cổng logic, mạch tổ hợp (MUX, ALU), thanh ghi có xung nhịp và tệp thanh ghi; CISC vs RISC.',
  `<span class="eyebrow">ICS102 · Chapter 5 · Lesson 5.1</span>
<h2>From logic gates to a processor: ISA, Y86-64 and hardware building blocks</h2>
<p class="lead">Chapters 3–4 treated the processor as a black box that executes x86-64 instructions one by one. Now we open it. CS:APP uses a small teaching instruction set, <strong>Y86-64</strong>, to show how a real processor is built from a handful of hardware building blocks — and why modern processors are so much faster than “one instruction at a time”.</p>
<h3>🎯 Objectives</h3>
<ul><li>Explain the ISA as the interface between compiler writers and processor designers.</li><li>Describe the Y86-64 state, instructions and encoding.</li><li>Name the hardware building blocks: gates, combinational circuits, clocked registers, memories.</li><li>Compare CISC and RISC design philosophies.</li></ul>
<h3>📖 Lecture</h3>
<h4>The ISA as an abstraction layer</h4>
<p>The ISA lets the same program run on very different chips: an x86-64 binary runs on a 2010 laptop and on a 2026 server whose internal design is completely different. Designers may implement the ISA with pipelines, multiple execution units, caches and prediction, as long as the visible result equals sequential execution.</p>
<h4>Y86-64 in brief</h4>
<p>Y86-64 is a simplified x86-64: 15 registers (%rax … %r14), 3 condition codes (ZF, SF, OF), PC, memory, and a status code (AOK, HLT, ADR for bad address, INS for bad instruction). Its instructions:</p>
<div class="formula"><span class="lbl">Y86-64 instruction set</span>halt · nop · rrmovq rA, rB · irmovq V, rB · rmmovq rA, D(rB) · mrmovq D(rB), rA · OPq rA, rB (addq, subq, andq, xorq) · jXX Dest · cmovXX rA, rB · call Dest · ret · pushq rA · popq rA</div>
<p>Where x86-64 has one <code>movq</code> with many forms, Y86-64 splits it by operand type (immediate→register, register→memory…) and allows only base + displacement addresses. Each instruction is 1 to 10 bytes: the first byte holds an instruction code and a function code (e.g. <code>addq</code> = 6 0, <code>subq</code> = 6 1); the next byte (if any) holds two register IDs; then an 8-byte constant if needed.</p>
<div class="callout"><p><b>Worked encoding.</b> <code>irmovq $0x100, %rbx</code>: icode:ifun = 3 0; register byte = F (no register) and 3 (%rbx) → <b>30 F3</b>; then the constant 0x100 as 8 little-endian bytes <b>00 01 00 00 00 00 00 00</b>. Total 10 bytes: 30f3000100000000 0000.<br><code>addq %rsi, %rdi</code> (%rsi = 6, %rdi = 7) → <b>60 67</b> (2 bytes).</p></div>
<h4>Hardware building blocks</h4>
<ul>
<li><strong>Logic gates</strong> (AND, OR, NOT) compute Boolean functions of bits; a gate's output responds to input changes after a tiny delay.</li>
<li><strong>Combinational circuits</strong> are networks of gates with no loops: their output is a function of the current inputs only. Examples: a bit-equality test, a <strong>multiplexer</strong> (selects one of several inputs according to a control signal), an <strong>ALU</strong> (adds, subtracts, ANDs, XORs according to a function code). They are described by HCL (hardware control language) in CS:APP, like Verilog in industry.</li>
<li><strong>Clocked registers</strong> store a value and update it only at the rising edge of the clock. They hold the state between cycles (PC, condition codes).</li>
<li><strong>Random-access memories</strong>: the register file (two read ports, one write port) and data/instruction memory.</li>
</ul>
<p>A processor = state elements (registers, memories) + combinational logic that computes the next state from the current state, all updated together on each clock tick.</p>
<h4>CISC versus RISC</h4>
<p>x86-64 is <strong>CISC</strong> (complex instruction set: many instructions, variable length, memory operands in arithmetic). ARM and RISC-V are <strong>RISC</strong> (simple, fixed-length instructions; only load/store touch memory; many registers). Y86-64 mixes both. Today the difference has shrunk: x86 chips internally translate instructions into RISC-like micro-operations, and ARM chips such as Apple's M-series compete at the very top.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Confusing the ISA (what instructions do) with the microarchitecture (how one chip does it).</li><li>Thinking combinational circuits remember anything — only clocked registers and memories hold state.</li><li>Forgetting that Y86-64 constants are stored little-endian, like x86-64.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>The ISA hides the implementation; any design must produce sequential-execution results.</li><li>Y86-64: a small x86-64-like ISA with byte-level encodings (icode:ifun, rA:rB, constant).</li><li>Hardware = combinational logic + clocked state elements.</li><li>CISC (x86) vs RISC (ARM, RISC-V): different trade-offs, converging in practice.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://csapp.cs.cmu.edu/3e/students.html" target="_blank" rel="noopener">CS:APP student site — Y86-64 tools and simulator guide</a></li><li><a href="https://www.nand2tetris.org/" target="_blank" rel="noopener">Nand2Tetris — build gates, an ALU and a CPU yourself</a></li><li><a href="https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/" target="_blank" rel="noopener">MIT 6.004 — Computation Structures (digital logic to processors)</a></li><li><a href="https://en.wikipedia.org/wiki/Von_Neumann_architecture" target="_blank" rel="noopener">Wikipedia — Von Neumann architecture</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Encode <code>rrmovq %rsp, %rbx</code> in Y86-64 (rrmovq = 2 0, %rsp = 4, %rbx = 3).</li><li>Which of these hold state across clock cycles: ALU, multiplexer, PC register, register file?</li><li>Give one reason RISC instruction sets are easier to pipeline.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 20 43. 2) The PC register and the register file; the ALU and MUX are combinational. 3) Fixed-length instructions with simple formats can be fetched and decoded in one uniform step, and only loads/stores access memory, so every instruction flows through the same stages.</p></div>`,
  `<span class="eyebrow">ICS102 · Chương 5 · Bài 5.1</span>
<h2>Từ cổng logic tới bộ xử lý: ISA, Y86-64 và các khối phần cứng</h2>
<p class="lead">Chương 3–4 xem bộ xử lý là hộp đen chạy từng lệnh x86-64. Giờ ta mở nó ra. CS:APP dùng một tập lệnh dạy học nhỏ, <strong>Y86-64</strong>, để cho thấy bộ xử lý thật được dựng từ vài khối phần cứng cơ bản — và vì sao bộ xử lý hiện đại nhanh hơn rất nhiều so với “chạy từng lệnh một”.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Giải thích ISA là giao diện giữa người viết trình biên dịch và người thiết kế bộ xử lý.</li><li>Mô tả trạng thái, lệnh và cách mã hoá của Y86-64.</li><li>Kể tên các khối phần cứng: cổng, mạch tổ hợp, thanh ghi có xung nhịp, bộ nhớ.</li><li>So sánh triết lý thiết kế CISC và RISC.</li></ul>
<h3>📖 Bài giảng</h3>
<h4>ISA là một lớp trừu tượng</h4>
<p>ISA cho cùng một chương trình chạy trên những con chip rất khác nhau: tệp nhị phân x86-64 chạy được trên laptop đời 2010 lẫn máy chủ đời 2026 có thiết kế bên trong khác hẳn. Người thiết kế được phép hiện thực ISA bằng đường ống, nhiều khối thực thi, cache, dự đoán, miễn kết quả nhìn thấy giống hệt chạy tuần tự.</p>
<h4>Y86-64 tóm tắt</h4>
<p>Y86-64 là x86-64 giản lược: 15 thanh ghi (%rax … %r14), 3 mã điều kiện (ZF, SF, OF), PC, bộ nhớ và mã trạng thái (AOK, HLT, ADR khi địa chỉ sai, INS khi lệnh sai). Các lệnh:</p>
<div class="formula"><span class="lbl">Tập lệnh Y86-64</span>halt · nop · rrmovq rA, rB · irmovq V, rB · rmmovq rA, D(rB) · mrmovq D(rB), rA · OPq rA, rB (addq, subq, andq, xorq) · jXX Đích · cmovXX rA, rB · call Đích · ret · pushq rA · popq rA</div>
<p>Trong khi x86-64 có một lệnh <code>movq</code> nhiều dạng, Y86-64 tách nó theo loại toán hạng (hằng→thanh ghi, thanh ghi→bộ nhớ…) và chỉ cho địa chỉ dạng cơ sở + độ dời. Mỗi lệnh dài 1 tới 10 byte: byte đầu chứa mã lệnh và mã chức năng (vd <code>addq</code> = 6 0, <code>subq</code> = 6 1); byte kế (nếu có) chứa hai mã thanh ghi; sau đó là hằng 8 byte nếu cần.</p>
<div class="callout"><p><b>Mã hoá mẫu.</b> <code>irmovq $0x100, %rbx</code>: icode:ifun = 3 0; byte thanh ghi = F (không có thanh ghi) và 3 (%rbx) → <b>30 F3</b>; rồi hằng 0x100 dưới dạng 8 byte little-endian <b>00 01 00 00 00 00 00 00</b>. Tổng 10 byte: 30f3000100000000 0000.<br><code>addq %rsi, %rdi</code> (%rsi = 6, %rdi = 7) → <b>60 67</b> (2 byte).</p></div>
<h4>Các khối phần cứng</h4>
<ul>
<li><strong>Cổng logic</strong> (AND, OR, NOT) tính hàm Boole của các bit; đầu ra của cổng phản ứng với thay đổi đầu vào sau một độ trễ rất nhỏ.</li>
<li><strong>Mạch tổ hợp</strong> là mạng cổng không có vòng: đầu ra chỉ phụ thuộc đầu vào hiện tại. Ví dụ: mạch so sánh bằng nhau, <strong>bộ dồn kênh (multiplexer)</strong> (chọn một trong nhiều đầu vào theo tín hiệu điều khiển), <strong>ALU</strong> (cộng, trừ, AND, XOR theo mã chức năng). CS:APP mô tả chúng bằng HCL (ngôn ngữ điều khiển phần cứng), giống Verilog trong công nghiệp.</li>
<li><strong>Thanh ghi có xung nhịp</strong> lưu một giá trị và chỉ cập nhật ở sườn lên của xung nhịp. Chúng giữ trạng thái giữa các chu kỳ (PC, mã điều kiện).</li>
<li><strong>Bộ nhớ truy cập ngẫu nhiên</strong>: tệp thanh ghi (hai cổng đọc, một cổng ghi) và bộ nhớ dữ liệu/lệnh.</li>
</ul>
<p>Bộ xử lý = các phần tử trạng thái (thanh ghi, bộ nhớ) + mạch tổ hợp tính trạng thái kế tiếp từ trạng thái hiện tại, tất cả cùng cập nhật ở mỗi nhịp đồng hồ.</p>
<h4>CISC và RISC</h4>
<p>x86-64 là <strong>CISC</strong> (tập lệnh phức tạp: nhiều lệnh, độ dài thay đổi, phép toán có toán hạng bộ nhớ). ARM và RISC-V là <strong>RISC</strong> (lệnh đơn giản, độ dài cố định; chỉ load/store đụng bộ nhớ; nhiều thanh ghi). Y86-64 pha cả hai. Ngày nay khác biệt đã thu hẹp: chip x86 bên trong dịch lệnh thành các vi thao tác kiểu RISC, còn chip ARM như dòng M của Apple cạnh tranh ở đỉnh hiệu năng.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Lẫn ISA (lệnh làm gì) với vi kiến trúc (một con chip làm thế nào).</li><li>Tưởng mạch tổ hợp nhớ được gì đó — chỉ thanh ghi có xung nhịp và bộ nhớ giữ trạng thái.</li><li>Quên rằng hằng số Y86-64 lưu kiểu little-endian, giống x86-64.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>ISA che giấu hiện thực; thiết kế nào cũng phải cho kết quả như chạy tuần tự.</li><li>Y86-64: ISA nhỏ giống x86-64 với mã hoá theo byte (icode:ifun, rA:rB, hằng).</li><li>Phần cứng = mạch tổ hợp + phần tử trạng thái có xung nhịp.</li><li>CISC (x86) và RISC (ARM, RISC-V): đánh đổi khác nhau, thực tế ngày càng gần nhau.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://csapp.cs.cmu.edu/3e/students.html" target="_blank" rel="noopener">Trang sinh viên CS:APP — công cụ Y86-64 và hướng dẫn trình mô phỏng</a></li><li><a href="https://www.nand2tetris.org/" target="_blank" rel="noopener">Nand2Tetris — tự dựng cổng, ALU và CPU</a></li><li><a href="https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/" target="_blank" rel="noopener">MIT 6.004 — Computation Structures (từ logic số tới bộ xử lý)</a></li><li><a href="https://en.wikipedia.org/wiki/Von_Neumann_architecture" target="_blank" rel="noopener">Wikipedia — Kiến trúc Von Neumann</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Mã hoá <code>rrmovq %rsp, %rbx</code> trong Y86-64 (rrmovq = 2 0, %rsp = 4, %rbx = 3).</li><li>Thứ nào giữ trạng thái qua các chu kỳ đồng hồ: ALU, bộ dồn kênh, thanh ghi PC, tệp thanh ghi?</li><li>Nêu một lý do tập lệnh RISC dễ làm đường ống hơn.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 20 43. 2) Thanh ghi PC và tệp thanh ghi; ALU và MUX là mạch tổ hợp. 3) Lệnh độ dài cố định, định dạng đơn giản nên lấy và giải mã theo một bước đồng nhất, và chỉ load/store truy cập bộ nhớ, nên mọi lệnh đi qua cùng các công đoạn.</p></div>`);

const c52 = L('ics102-ts-5-2',
  '5.2 — Executing instructions in stages; the principles of pipelining|||5.2 — Thực thi lệnh theo công đoạn; nguyên lý đường ống',
  'Sáu công đoạn fetch–decode–execute–memory–write back–PC update, lần theo addq và mrmovq; bộ xử lý tuần tự SEQ; đường ống: thông lượng, độ trễ, công đoạn không đều, đường ống quá sâu — bài tính số theo CS:APP.',
  `<span class="eyebrow">ICS102 · Chapter 5 · Lesson 5.2</span>
<h2>Executing instructions in stages; the principles of pipelining</h2>
<p class="lead">Every instruction, however different, can be described by the same sequence of stages. That uniformity lets us build first a simple sequential processor, then a <strong>pipelined</strong> one that overlaps the stages of several instructions — the single most important idea behind modern CPU speed.</p>
<h3>🎯 Objectives</h3>
<ul><li>Name the six stages and what each does.</li><li>Trace an arithmetic and a memory instruction through the stages.</li><li>Compute throughput and latency of pipelined and unpipelined systems.</li><li>Explain why pipelines with unequal or very many stages give diminishing returns.</li></ul>
<h3>📖 Lecture</h3>
<h4>The six stages</h4>
<ol>
<li><strong>Fetch</strong>: read the instruction bytes at PC; extract icode, ifun, registers, constant; compute valP = address of the next instruction.</li>
<li><strong>Decode</strong>: read up to two operands from the register file (valA, valB).</li>
<li><strong>Execute</strong>: the ALU computes valE (an arithmetic result, an effective address, or a new stack pointer) and may set condition codes; for jumps, decide whether the branch is taken.</li>
<li><strong>Memory</strong>: read (valM) or write data memory.</li>
<li><strong>Write back</strong>: write up to two results to the register file.</li>
<li><strong>PC update</strong>: PC ← valP, or the jump/call target, or the return address.</li>
</ol>
<div class="callout"><p><b>Trace 1 — <code>addq %rdx, %rbx</code></b> (OPq rA, rB):<br>Fetch: icode:ifun = 6:0, rA = %rdx, rB = %rbx, valP = PC + 2.<br>Decode: valA = R[%rdx], valB = R[%rbx].<br>Execute: valE = valB + valA; set ZF, SF, OF.<br>Memory: —. Write back: R[%rbx] ← valE. PC update: PC ← valP.</p>
<p><b>Trace 2 — <code>mrmovq 8(%rsp), %rax</code></b>:<br>Fetch: icode = 5, rA = %rax, rB = %rsp, valC = 8, valP = PC + 10.<br>Decode: valB = R[%rsp].<br>Execute: valE = valB + 8 (the address).<br>Memory: valM = M[valE]. Write back: R[%rax] ← valM. PC update: PC ← valP.</p></div>
<p>A <strong>sequential</strong> processor (SEQ) performs all six stages in one long clock cycle. It is correct but slow: the clock must be long enough for the slowest path through all the logic.</p>
<h4>Pipelining</h4>
<p>Think of a cafeteria line: customers do not wait for the previous one to finish everything; each station serves a different customer at the same time. In hardware, we split the combinational logic into stages separated by <strong>pipeline registers</strong>. Each clock cycle every stage works on a different instruction.</p>
<div class="formula"><span class="lbl">Throughput and latency</span>throughput = 1 instruction / clock period (in GIPS = billions of instructions per second)<br>latency = time for one instruction to pass through all stages = (number of stages) × (clock period)</div>
<div class="callout"><p><b>Worked example (numbers from CS:APP).</b> Logic takes 300 ps, a register load takes 20 ps.<br>Unpipelined: period 320 ps → throughput 1/320 ps = <b>3.12 GIPS</b>, latency 320 ps.<br>3 stages of 100 ps: period 100 + 20 = 120 ps → throughput <b>8.33 GIPS</b> (2.67× more), latency 3 × 120 = <b>360 ps</b> (a bit longer).<br>Unequal stages 50 / 150 / 100 ps: the clock must fit the slowest stage, 150 + 20 = 170 ps → only <b>5.88 GIPS</b>.<br>Six stages of 50 ps: period 70 ps → <b>14.29 GIPS</b>, but the 20 ps register overhead is now 29% of every cycle, and latency rises to 420 ps — diminishing returns.</p></div>
<p>Pipelining increases <strong>throughput</strong>, not the speed of a single instruction. Real x86-64 cores have pipelines of 14–20 stages and also issue several instructions per cycle (<strong>superscalar</strong>) and out of order.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Thinking pipelining makes each instruction faster — latency actually grows a little.</li><li>Forgetting the pipeline-register overhead when computing the clock period.</li><li>Dividing logic into stages of unequal length and assuming the average stage time sets the clock.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Stages: fetch, decode, execute, memory, write back, PC update.</li><li>SEQ does everything in one long cycle.</li><li>Pipelining overlaps instructions: higher throughput, slightly higher latency.</li><li>The slowest stage + register overhead set the clock; deep pipelines give diminishing returns.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Instruction_pipelining" target="_blank" rel="noopener">Wikipedia — Instruction pipelining</a></li><li><a href="https://en.wikipedia.org/wiki/Classic_RISC_pipeline" target="_blank" rel="noopener">Wikipedia — Classic RISC pipeline (5 stages)</a></li><li><a href="https://cs61c.org/" target="_blank" rel="noopener">UC Berkeley CS61C — datapath and pipelining lectures</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Trace <code>irmovq $5, %rcx</code> through the stages.</li><li>Logic of 240 ps is split into 4 equal stages, register overhead 20 ps. Give throughput and latency.</li><li>Same logic split as 40 / 80 / 60 / 60 ps. What is the throughput now?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Fetch: icode 3, rB = %rcx, valC = 5, valP = PC + 10; Decode: —; Execute: valE = 0 + 5; Memory: —; Write back: R[%rcx] ← 5; PC ← valP. 2) Period 60 + 20 = 80 ps → 12.5 GIPS; latency 4 × 80 = 320 ps. 3) Slowest stage 80 + 20 = 100 ps → 10 GIPS.</p></div>`,
  `<span class="eyebrow">ICS102 · Chương 5 · Bài 5.2</span>
<h2>Thực thi lệnh theo công đoạn; nguyên lý đường ống</h2>
<p class="lead">Mọi lệnh, dù khác nhau, đều mô tả được bằng cùng một chuỗi công đoạn. Sự đồng nhất đó cho phép dựng trước một bộ xử lý tuần tự đơn giản, rồi một bộ xử lý <strong>đường ống (pipeline)</strong> chồng các công đoạn của nhiều lệnh lên nhau — ý tưởng quan trọng nhất đứng sau tốc độ CPU hiện đại.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Kể tên sáu công đoạn và việc của từng công đoạn.</li><li>Lần theo một lệnh số học và một lệnh bộ nhớ qua các công đoạn.</li><li>Tính thông lượng và độ trễ của hệ có và không có đường ống.</li><li>Giải thích vì sao đường ống có công đoạn không đều hoặc quá nhiều công đoạn cho lợi ích giảm dần.</li></ul>
<h3>📖 Bài giảng</h3>
<h4>Sáu công đoạn</h4>
<ol>
<li><strong>Fetch (lấy lệnh)</strong>: đọc byte lệnh tại PC; tách icode, ifun, thanh ghi, hằng; tính valP = địa chỉ lệnh kế tiếp.</li>
<li><strong>Decode (giải mã)</strong>: đọc tối đa hai toán hạng từ tệp thanh ghi (valA, valB).</li>
<li><strong>Execute (thực thi)</strong>: ALU tính valE (kết quả số học, địa chỉ hiệu dụng, hoặc con trỏ ngăn xếp mới) và có thể đặt mã điều kiện; với lệnh nhảy, quyết định có nhảy không.</li>
<li><strong>Memory (bộ nhớ)</strong>: đọc (valM) hoặc ghi bộ nhớ dữ liệu.</li>
<li><strong>Write back (ghi lại)</strong>: ghi tối đa hai kết quả vào tệp thanh ghi.</li>
<li><strong>PC update (cập nhật PC)</strong>: PC ← valP, hoặc đích nhảy/call, hoặc địa chỉ trở về.</li>
</ol>
<div class="callout"><p><b>Lần theo 1 — <code>addq %rdx, %rbx</code></b> (OPq rA, rB):<br>Fetch: icode:ifun = 6:0, rA = %rdx, rB = %rbx, valP = PC + 2.<br>Decode: valA = R[%rdx], valB = R[%rbx].<br>Execute: valE = valB + valA; đặt ZF, SF, OF.<br>Memory: —. Write back: R[%rbx] ← valE. PC update: PC ← valP.</p>
<p><b>Lần theo 2 — <code>mrmovq 8(%rsp), %rax</code></b>:<br>Fetch: icode = 5, rA = %rax, rB = %rsp, valC = 8, valP = PC + 10.<br>Decode: valB = R[%rsp].<br>Execute: valE = valB + 8 (địa chỉ).<br>Memory: valM = M[valE]. Write back: R[%rax] ← valM. PC update: PC ← valP.</p></div>
<p>Bộ xử lý <strong>tuần tự</strong> (SEQ) làm cả sáu công đoạn trong một chu kỳ đồng hồ dài. Nó đúng nhưng chậm: chu kỳ phải đủ dài cho đường chậm nhất qua toàn bộ mạch logic.</p>
<h4>Đường ống</h4>
<p>Hãy nghĩ tới hàng lấy cơm ở căng-tin: khách không đợi người trước làm xong mọi việc; mỗi quầy phục vụ một khách khác nhau cùng lúc. Trong phần cứng, ta chia mạch tổ hợp thành các công đoạn ngăn bởi <strong>thanh ghi đường ống</strong>. Mỗi chu kỳ, mỗi công đoạn làm việc với một lệnh khác nhau.</p>
<div class="formula"><span class="lbl">Thông lượng và độ trễ</span>thông lượng = 1 lệnh / chu kỳ đồng hồ (đơn vị GIPS = tỉ lệnh mỗi giây)<br>độ trễ = thời gian một lệnh đi hết các công đoạn = (số công đoạn) × (chu kỳ đồng hồ)</div>
<div class="callout"><p><b>Ví dụ giải từng bước (số liệu theo CS:APP).</b> Mạch logic mất 300 ps, nạp thanh ghi mất 20 ps.<br>Không đường ống: chu kỳ 320 ps → thông lượng 1/320 ps = <b>3,12 GIPS</b>, độ trễ 320 ps.<br>3 công đoạn 100 ps: chu kỳ 100 + 20 = 120 ps → thông lượng <b>8,33 GIPS</b> (gấp 2,67), độ trễ 3 × 120 = <b>360 ps</b> (dài hơn chút).<br>Công đoạn không đều 50 / 150 / 100 ps: đồng hồ phải vừa công đoạn chậm nhất, 150 + 20 = 170 ps → chỉ <b>5,88 GIPS</b>.<br>Sáu công đoạn 50 ps: chu kỳ 70 ps → <b>14,29 GIPS</b>, nhưng 20 ps của thanh ghi giờ chiếm 29% mỗi chu kỳ, và độ trễ tăng lên 420 ps — lợi ích giảm dần.</p></div>
<p>Đường ống tăng <strong>thông lượng</strong>, không làm từng lệnh nhanh hơn. Lõi x86-64 thật có đường ống 14–20 công đoạn, còn phát nhiều lệnh mỗi chu kỳ (<strong>siêu vô hướng</strong>) và chạy không theo thứ tự.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Tưởng đường ống làm từng lệnh nhanh hơn — độ trễ thật ra tăng chút ít.</li><li>Quên chi phí thanh ghi đường ống khi tính chu kỳ đồng hồ.</li><li>Chia mạch thành các công đoạn dài không đều rồi tưởng thời gian trung bình quyết định đồng hồ.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Công đoạn: fetch, decode, execute, memory, write back, PC update.</li><li>SEQ làm mọi thứ trong một chu kỳ dài.</li><li>Đường ống chồng các lệnh: thông lượng cao hơn, độ trễ hơi tăng.</li><li>Công đoạn chậm nhất + chi phí thanh ghi quyết định đồng hồ; đường ống quá sâu cho lợi ích giảm dần.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Instruction_pipelining" target="_blank" rel="noopener">Wikipedia — Đường ống lệnh</a></li><li><a href="https://en.wikipedia.org/wiki/Classic_RISC_pipeline" target="_blank" rel="noopener">Wikipedia — Đường ống RISC kinh điển (5 công đoạn)</a></li><li><a href="https://cs61c.org/" target="_blank" rel="noopener">UC Berkeley CS61C — bài giảng đường dữ liệu và đường ống</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Lần theo <code>irmovq $5, %rcx</code> qua các công đoạn.</li><li>Mạch 240 ps chia 4 công đoạn đều, chi phí thanh ghi 20 ps. Cho thông lượng và độ trễ.</li><li>Cùng mạch đó chia 40 / 80 / 60 / 60 ps. Thông lượng bây giờ là bao nhiêu?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Fetch: icode 3, rB = %rcx, valC = 5, valP = PC + 10; Decode: —; Execute: valE = 0 + 5; Memory: —; Write back: R[%rcx] ← 5; PC ← valP. 2) Chu kỳ 60 + 20 = 80 ps → 12,5 GIPS; độ trễ 4 × 80 = 320 ps. 3) Công đoạn chậm nhất 80 + 20 = 100 ps → 10 GIPS.</p></div>`);

const SRC_BRANCH = String.raw`
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#define N (1 << 22)
static double now(void) { struct timespec t; clock_gettime(CLOCK_MONOTONIC, &t); return t.tv_sec + t.tv_nsec * 1e-9; }
static int cmp(const void *a, const void *b) { return *(const int *)a - *(const int *)b; }
long count_big(const int *a, long n) {
    long s = 0;
    for (long i = 0; i < n; i++)
        if (a[i] >= 128) s += a[i];   /* a hard-to-predict branch when data is random */
    return s;
}
int main(void) {
    int *a = malloc(sizeof(int) * N);
    srand(42);
    for (long i = 0; i < N; i++) a[i] = rand() % 256;
    double best = 1e9, t0; long s = 0;
    for (int r = 0; r < 5; r++) { t0 = now(); s = count_big(a, N); double d = now() - t0; if (d < best) best = d; }
    printf("random data : sum=%ld  %.2f ms\n", s, best * 1e3);
    qsort(a, N, sizeof(int), cmp);
    best = 1e9;
    for (int r = 0; r < 5; r++) { t0 = now(); s = count_big(a, N); double d = now() - t0; if (d < best) best = d; }
    printf("sorted data : sum=%ld  %.2f ms\n", s, best * 1e3);
    return 0;
}
`;
const OUT_BRANCH = String.raw`
$ cc -O0 branch.c -o branch && ./branch
random data : sum=401441408  26.18 ms
sorted data : sum=401441408  6.74 ms
$ cc -O1 branch.c -o branch1 && ./branch1
random data : sum=401441408  1.55 ms
sorted data : sum=401441408  1.55 ms
`;
const ASM_CSEL = String.raw`
LBB0_2:                         ; arm64, cc -O1 -S: the loop body has no branch on a[i]
	ldr	w9, [x0], #4             ; w9 = *a++
	cmp	w9, #127
	csel	w9, w9, wzr, gt          ; w9 = (w9 > 127) ? w9 : 0   -- conditional select
	add	x8, x8, x9               ; s += w9
	subs	x1, x1, #1
	b.ne	LBB0_2                   ; only the loop-counter branch remains (easy to predict)
`;

const c53 = L('ics102-ts-5-3',
  '5.3 — Pipeline hazards: data dependences, forwarding, stalls and branch prediction|||5.3 — Xung đột đường ống: phụ thuộc dữ liệu, chuyển tiếp, chèn bọt và dự đoán nhánh',
  'Xung đột dữ liệu và điều khiển; chèn bọt (stall) và chuyển tiếp (forwarding); load-use; dự đoán nhánh và cái giá của đoán sai — đo thật: dữ liệu ngẫu nhiên chậm gấp 3,9 lần dữ liệu đã sắp xếp, và trình biên dịch xoá nhánh bằng csel.',
  `<span class="eyebrow">ICS102 · Chapter 5 · Lesson 5.3</span>
<h2>Pipeline hazards: data dependences, forwarding, stalls and branch prediction</h2>
<p class="lead">A pipeline works perfectly when instructions are independent. Real programs are not: an instruction often needs a result that the previous one has not finished computing, and after a conditional jump the processor does not yet know which instruction comes next. These situations are called <strong>hazards</strong>. How hardware handles them explains measurable speed differences in your code.</p>
<h3>🎯 Objectives</h3>
<ul><li>Identify data hazards and control hazards in an instruction sequence.</li><li>Explain stalling, forwarding and the load-use hazard.</li><li>Explain branch prediction and the cost of a misprediction.</li><li>Measure the effect of misprediction and recognise branch-free code.</li></ul>
<h3>📖 Lecture</h3>
<h4>Data hazards</h4>
<p>In <code>irmovq $10, %rdx</code> followed by <code>addq %rdx, %rax</code>, the add reads %rdx in its decode stage while the irmovq has not yet written it back. Three fixes:</p>
<ul>
<li><strong>Stall</strong>: hold the dependent instruction in decode and insert <strong>bubbles</strong> (dynamically generated nops) until the value is written. Correct but slow.</li>
<li><strong>Forwarding</strong> (bypassing): route the value from a later pipeline register directly back to the decode stage as soon as it is computed — no waiting in most cases.</li>
<li><strong>Load-use hazard</strong>: when the value comes from memory (<code>mrmovq</code>) it is available only after the memory stage, too late even for forwarding to the next instruction; the pipeline must stall one cycle and then forward. Compilers try to schedule an independent instruction in between.</li>
</ul>
<h4>Control hazards and branch prediction</h4>
<p>After fetching <code>jne</code>, the next instruction is unknown until execute. Instead of waiting, the processor <strong>predicts</strong> and keeps fetching. If the guess was wrong, the wrongly fetched instructions are cancelled (turned into bubbles) and fetching restarts at the right address — a <strong>misprediction penalty</strong> of a few cycles in Y86-64 and about 15–20 cycles on modern deep pipelines. <code>ret</code> is handled with a return-address stack. Modern predictors learn patterns and are right well over 90% of the time — for regular patterns. On random data they can do no better than chance.</p>
<h3>✍️ Worked example — measure the cost of mispredictions</h3>
` + C(SRC_BRANCH) + `
<p>Real runs on our Apple M1 Max (same data, same sum):</p>
` + out(OUT_BRANCH) + `
<p>At <code>-O0</code> the loop contains a real conditional branch: on random data it is taken about half the time with no pattern, so the predictor fails often; sorted data gives a long run of “not taken” then a long run of “taken”, which is predicted almost perfectly — <strong>3.9× faster with exactly the same work</strong>. At <code>-O1</code> both cases take 1.55 ms: the compiler removed the branch. The arm64 inner loop it generated:</p>
` + ASM(ASM_CSEL) + `
<p><code>csel</code> is ARM's conditional select, the equivalent of x86 <code>cmov</code> from lesson 4.1: nothing left to mispredict.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Believing a branch is “free” — it is cheap only when predictable.</li><li>Benchmarking at <code>-O0</code> and drawing conclusions about optimised code (or the reverse).</li><li>Sorting data just to help the predictor: sorting costs O(n log n); first check whether the compiler already produces branch-free code.</li><li>Thinking forwarding removes every stall — loads still need one.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Data hazards: stall (bubbles) or forward; load-use still costs a stall.</li><li>Control hazards: predict, and cancel on misprediction (≈15–20 cycles on real CPUs).</li><li>Unpredictable branches on random data are slow; predictable ones are almost free.</li><li>Conditional moves/selects (cmov, csel) remove branches entirely.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Hazard_(computer_architecture)" target="_blank" rel="noopener">Wikipedia — Hazard (computer architecture)</a></li><li><a href="https://en.wikipedia.org/wiki/Branch_predictor" target="_blank" rel="noopener">Wikipedia — Branch predictor</a></li><li><a href="https://www.agner.org/optimize/" target="_blank" rel="noopener">Agner Fog — software optimisation resources (microarchitecture manual)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Find the hazards: <code>mrmovq 0(%rdx), %rax</code> · <code>addq %rax, %rbx</code> · <code>subq %rbx, %rcx</code>. Which can be forwarded without a stall?</li><li>A loop runs 10<sup>8</sup> times with a branch mispredicted 50% of the time, penalty 16 cycles, clock 3 GHz. How much time is lost?</li><li>Why does the predictor do well on <code>for (i = 0; i &lt; n; i++)</code> loops?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) addq needs %rax from a load (load-use: one stall, then forward); subq needs %rbx from addq (forwarded, no stall). 2) 0.5 × 10<sup>8</sup> × 16 = 8 × 10<sup>8</sup> cycles = 0.27 s. 3) The loop branch is taken n − 1 times in a row and not taken once — a very regular pattern.</p></div>`,
  `<span class="eyebrow">ICS102 · Chương 5 · Bài 5.3</span>
<h2>Xung đột đường ống: phụ thuộc dữ liệu, chuyển tiếp, chèn bọt và dự đoán nhánh</h2>
<p class="lead">Đường ống chạy hoàn hảo khi các lệnh độc lập. Chương trình thật thì không: một lệnh thường cần kết quả mà lệnh trước chưa tính xong, và sau một lệnh nhảy có điều kiện, bộ xử lý chưa biết lệnh kế tiếp là gì. Các tình huống này gọi là <strong>xung đột (hazard)</strong>. Cách phần cứng xử lý chúng giải thích những khác biệt tốc độ đo được trong code của bạn.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Nhận ra xung đột dữ liệu và xung đột điều khiển trong một dãy lệnh.</li><li>Giải thích chèn bọt, chuyển tiếp và xung đột load-use.</li><li>Giải thích dự đoán nhánh và cái giá của đoán sai.</li><li>Đo tác động của đoán sai và nhận ra code không rẽ nhánh.</li></ul>
<h3>📖 Bài giảng</h3>
<h4>Xung đột dữ liệu</h4>
<p>Trong <code>irmovq $10, %rdx</code> tiếp theo là <code>addq %rdx, %rax</code>, lệnh add đọc %rdx ở công đoạn decode khi irmovq chưa ghi lại. Ba cách xử lý:</p>
<ul>
<li><strong>Chèn bọt (stall)</strong>: giữ lệnh phụ thuộc ở decode và chèn <strong>bọt</strong> (lệnh nop sinh động) cho tới khi giá trị được ghi. Đúng nhưng chậm.</li>
<li><strong>Chuyển tiếp (forwarding/bypassing)</strong>: dẫn giá trị từ thanh ghi đường ống phía sau quay ngược về công đoạn decode ngay khi nó được tính — đa số trường hợp không phải chờ.</li>
<li><strong>Xung đột load-use</strong>: khi giá trị đến từ bộ nhớ (<code>mrmovq</code>), nó chỉ có sau công đoạn memory, quá muộn kể cả để chuyển tiếp cho lệnh ngay sau; đường ống phải chờ một chu kỳ rồi mới chuyển tiếp. Trình biên dịch cố xếp một lệnh độc lập vào giữa.</li>
</ul>
<h4>Xung đột điều khiển và dự đoán nhánh</h4>
<p>Sau khi lấy lệnh <code>jne</code>, lệnh kế tiếp chưa biết cho tới công đoạn execute. Thay vì chờ, bộ xử lý <strong>đoán</strong> và tiếp tục lấy lệnh. Nếu đoán sai, các lệnh lấy nhầm bị huỷ (biến thành bọt) và việc lấy lệnh bắt đầu lại ở địa chỉ đúng — <strong>phạt đoán sai</strong> vài chu kỳ trong Y86-64 và khoảng 15–20 chu kỳ trên đường ống sâu hiện đại. <code>ret</code> được xử lý bằng một ngăn xếp địa chỉ trở về. Bộ dự đoán hiện đại học được mẫu và đúng hơn 90% — với mẫu đều đặn. Với dữ liệu ngẫu nhiên, nó không thể làm tốt hơn tung đồng xu.</p>
<h3>✍️ Ví dụ — đo cái giá của đoán sai</h3>
` + C(SRC_BRANCH) + `
<p>Chạy thật trên Apple M1 Max (cùng dữ liệu, cùng tổng):</p>
` + out(OUT_BRANCH) + `
<p>Ở <code>-O0</code> vòng lặp có lệnh rẽ nhánh thật: với dữ liệu ngẫu nhiên nhánh được chọn khoảng một nửa số lần, không có mẫu, nên bộ dự đoán sai nhiều; dữ liệu đã sắp xếp cho một dải dài “không nhảy” rồi một dải dài “nhảy”, đoán gần như hoàn hảo — <strong>nhanh gấp 3,9 lần với đúng cùng khối lượng việc</strong>. Ở <code>-O1</code> cả hai đều 1,55 ms: trình biên dịch đã xoá nhánh. Vòng lặp arm64 nó sinh ra:</p>
` + ASM(ASM_CSEL) + `
<p><code>csel</code> là lệnh chọn có điều kiện của ARM, tương đương <code>cmov</code> của x86 ở bài 4.1: không còn gì để đoán sai.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Tin rằng rẽ nhánh “miễn phí” — nó chỉ rẻ khi đoán được.</li><li>Đo hiệu năng ở <code>-O0</code> rồi kết luận cho code đã tối ưu (hoặc ngược lại).</li><li>Sắp xếp dữ liệu chỉ để giúp bộ dự đoán: sắp xếp tốn O(n log n); trước hết xem trình biên dịch đã sinh code không rẽ nhánh chưa.</li><li>Tưởng chuyển tiếp xoá được mọi lần chờ — lệnh load vẫn cần một.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Xung đột dữ liệu: chèn bọt hoặc chuyển tiếp; load-use vẫn tốn một chu kỳ chờ.</li><li>Xung đột điều khiển: đoán, huỷ khi đoán sai (≈15–20 chu kỳ trên CPU thật).</li><li>Nhánh không đoán được trên dữ liệu ngẫu nhiên thì chậm; nhánh đoán được gần như miễn phí.</li><li>Chuyển/chọn có điều kiện (cmov, csel) xoá hẳn rẽ nhánh.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Hazard_(computer_architecture)" target="_blank" rel="noopener">Wikipedia — Xung đột trong kiến trúc máy tính</a></li><li><a href="https://en.wikipedia.org/wiki/Branch_predictor" target="_blank" rel="noopener">Wikipedia — Bộ dự đoán nhánh</a></li><li><a href="https://www.agner.org/optimize/" target="_blank" rel="noopener">Agner Fog — tài liệu tối ưu phần mềm (cẩm nang vi kiến trúc)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tìm xung đột: <code>mrmovq 0(%rdx), %rax</code> · <code>addq %rax, %rbx</code> · <code>subq %rbx, %rcx</code>. Cái nào chuyển tiếp được mà không phải chờ?</li><li>Một vòng lặp chạy 10<sup>8</sup> lần với một nhánh bị đoán sai 50%, phạt 16 chu kỳ, xung nhịp 3 GHz. Mất bao nhiêu thời gian?</li><li>Vì sao bộ dự đoán làm tốt với vòng <code>for (i = 0; i &lt; n; i++)</code>?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) addq cần %rax từ lệnh load (load-use: chờ một chu kỳ rồi chuyển tiếp); subq cần %rbx từ addq (chuyển tiếp, không chờ). 2) 0,5 × 10<sup>8</sup> × 16 = 8 × 10<sup>8</sup> chu kỳ = 0,27 s. 3) Nhánh vòng lặp được chọn n − 1 lần liên tiếp và không được chọn một lần — mẫu rất đều.</p></div>`);

const SRC_PERF = String.raw`
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#define N (1 << 24)            /* 16M doubles = 128 MiB */
static double now(void) { struct timespec t; clock_gettime(CLOCK_MONOTONIC, &t); return t.tv_sec + t.tv_nsec * 1e-9; }
double sum1(const double *a, long n) {          /* one accumulator: a chain of dependent adds */
    double acc = 0;
    for (long i = 0; i < n; i++) acc = acc + a[i];
    return acc;
}
double sum4(const double *a, long n) {          /* 4 independent accumulators (n % 4 == 0) */
    double a0 = 0, a1 = 0, a2 = 0, a3 = 0;
    for (long i = 0; i < n; i += 4) { a0 += a[i]; a1 += a[i+1]; a2 += a[i+2]; a3 += a[i+3]; }
    return (a0 + a1) + (a2 + a3);
}
int main(void) {
    double *a = malloc(sizeof(double) * N);
    for (long i = 0; i < N; i++) a[i] = 1.0;
    double r1 = 0, r4 = 0, t0, t1 = 1e9, t4 = 1e9;
    for (int rep = 0; rep < 5; rep++) {
        t0 = now(); r1 = sum1(a, N); double d = now() - t0; if (d < t1) t1 = d;
        t0 = now(); r4 = sum4(a, N); d = now() - t0; if (d < t4) t4 = d;
    }
    printf("1 accumulator : %.0f in %.1f ms (%.2f ns/element)\n", r1, t1 * 1e3, t1 * 1e9 / N);
    printf("4 accumulators: %.0f in %.1f ms (%.2f ns/element)\n", r4, t4 * 1e3, t4 * 1e9 / N);
    return 0;
}
`;
const OUT_PERF = String.raw`
$ cc -O1 perf.c -o perf && ./perf && ./perf
1 accumulator : 16777216 in 20.2 ms (1.21 ns/element)
4 accumulators: 16777216 in 4.7 ms (0.28 ns/element)
1 accumulator : 16777216 in 21.2 ms (1.26 ns/element)
4 accumulators: 16777216 in 4.6 ms (0.27 ns/element)
`;

const c54 = L('ics102-ts-5-4',
  '5.4 — Optimising program performance: latency, throughput and parallel accumulators|||5.4 — Tối ưu hiệu năng chương trình: độ trễ, thông lượng và bộ tích luỹ song song',
  'Trình biên dịch không làm được gì (aliasing, lời gọi hàm), CPE, giới hạn độ trễ và giới hạn thông lượng, chuỗi phụ thuộc, mở vòng lặp và nhiều bộ tích luỹ — đo thật: 4 bộ tích luỹ nhanh gấp ~4,3 lần.',
  `<span class="eyebrow">ICS102 · Chapter 5 · Lesson 5.4</span>
<h2>Optimising program performance: latency, throughput and parallel accumulators</h2>
<p class="lead">A modern core can start several operations every cycle, out of order, as long as they do not depend on each other. The programmer's job is to (1) remove obstacles that stop the compiler from optimising and (2) expose independent work. With these two ideas we make a simple sum loop more than four times faster without changing the algorithm.</p>
<h3>🎯 Objectives</h3>
<ul><li>Name two “optimisation blockers” the compiler cannot remove on its own.</li><li>Define CPE and distinguish latency bound from throughput bound.</li><li>Recognise a critical path of dependent operations.</li><li>Apply loop unrolling with multiple accumulators and measure the gain.</li></ul>
<h3>📖 Lecture</h3>
<h4>Optimisation blockers</h4>
<ul>
<li><strong>Memory aliasing</strong>: two pointers may point to the same location, so the compiler must keep every load and store. In <code>void add2(long *xp, long *yp) { *xp += *yp; *xp += *yp; }</code> it cannot replace the code by <code>*xp += 2 * *yp</code>, because if xp == yp the results differ. Fix: copy values into local variables, or promise no aliasing with <code>restrict</code>.</li>
<li><strong>Function calls</strong>: the compiler must assume a call may have side effects. Calling <code>strlen(s)</code> in a loop condition makes the loop O(n<sup>2</sup>). Fix: move the call out of the loop (“code motion”).</li>
</ul>
<h4>Measuring: CPE</h4>
<p>For loops over n elements we report <strong>cycles per element (CPE)</strong>: total time ≈ overhead + CPE · n. Two limits from the hardware:</p>
<div class="formula"><span class="lbl">Two bounds</span><b>latency bound</b>: a chain where each operation needs the previous result runs at (latency of the operation) per element — e.g. a floating-point add takes several cycles<br><b>throughput bound</b>: independent operations are limited only by how many functional units can start one per cycle</div>
<h4>The critical path and multiple accumulators</h4>
<p>In <code>acc = acc + a[i]</code>, every addition needs the previous value of acc: one long chain of dependent adds — the <strong>critical path</strong>. The loads of a[i] are independent and overlap, but the adds run one after another at the adder's latency. With <strong>4 separate accumulators</strong> (a0…a3), four independent chains run in parallel through the pipelined adder, and we combine them at the end. This is loop unrolling “×4 with 4 accumulators” (CS:APP calls it k × k unrolling). For floating point it changes the order of additions — fine here (all values are 1.0), but in general the result can differ in the last bits, so compilers do not do it automatically unless allowed (e.g. <code>-ffast-math</code>).</p>
<h3>✍️ Worked example</h3>
` + C(SRC_PERF) + `
<p>Real runs on our Apple M1 Max:</p>
` + out(OUT_PERF) + `
<p>About <strong>4.3× faster</strong>. The single-accumulator loop is latency-bound (≈1.2 ns per element, the time of a chain of dependent floating-point adds at this clock); with four chains the adder pipeline is kept busy. More accumulators help until the throughput bound (number of adder units × their issue rate) or the memory bandwidth is reached.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Optimising before measuring — always profile first (gprof, perf, Instruments) and look at the hot loop.</li><li>Making code unreadable for a 2% gain; the big wins are algorithms, memory access patterns (chapter 6) and removing blockers.</li><li>Forgetting the leftover iterations when n is not a multiple of the unroll factor.</li><li>Assuming integer and floating-point reassociation are equally safe — floating-point addition is not associative (lesson 2.5).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Aliasing and function calls block compiler optimisations; use locals, <code>restrict</code>, code motion.</li><li>CPE measures loop performance; latency bound vs throughput bound.</li><li>A chain of dependent operations is the critical path.</li><li>Multiple accumulators break the chain: measured 4.3× here.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://ocw.mit.edu/courses/6-172-performance-engineering-of-software-systems-fall-2018/" target="_blank" rel="noopener">MIT 6.172 — Performance Engineering of Software Systems</a></li><li><a href="https://en.wikipedia.org/wiki/Loop_unrolling" target="_blank" rel="noopener">Wikipedia — Loop unrolling</a></li><li><a href="https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html" target="_blank" rel="noopener">GCC docs — optimisation options (-O2, -funroll-loops, -ffast-math)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Why can't the compiler keep <code>*xp</code> in a register in <code>add2</code> above?</li><li><code>for (i = 0; i &lt; strlen(s); i++) if (s[i] == ' ') count++;</code> — what is the complexity and how do you fix it?</li><li>A product loop <code>p = p * a[i]</code> has a multiply latency of 3 cycles and the multiplier can start one per cycle. What CPE do you expect with 1 accumulator and with 3?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) yp might equal xp, so writing *xp may change *yp; every access must go to memory. 2) O(n<sup>2</sup>), because strlen is O(n) and is called each iteration; compute <code>size_t len = strlen(s);</code> once before the loop. 3) About 3 with one accumulator (latency bound); about 1 with three (throughput bound).</p></div>`,
  `<span class="eyebrow">ICS102 · Chương 5 · Bài 5.4</span>
<h2>Tối ưu hiệu năng chương trình: độ trễ, thông lượng và bộ tích luỹ song song</h2>
<p class="lead">Một lõi hiện đại có thể khởi động nhiều phép toán mỗi chu kỳ, không theo thứ tự, miễn chúng không phụ thuộc nhau. Việc của lập trình viên là (1) gỡ những trở ngại khiến trình biên dịch không tối ưu được và (2) phơi ra các phần việc độc lập. Với hai ý này, ta làm một vòng lặp tính tổng đơn giản nhanh hơn bốn lần mà không đổi thuật toán.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Kể tên hai “vật cản tối ưu” mà trình biên dịch không tự gỡ được.</li><li>Định nghĩa CPE và phân biệt giới hạn độ trễ với giới hạn thông lượng.</li><li>Nhận ra đường găng gồm các phép toán phụ thuộc nhau.</li><li>Áp dụng mở vòng lặp với nhiều bộ tích luỹ và đo mức lợi.</li></ul>
<h3>📖 Bài giảng</h3>
<h4>Vật cản tối ưu</h4>
<ul>
<li><strong>Bí danh bộ nhớ (memory aliasing)</strong>: hai con trỏ có thể trỏ cùng một chỗ, nên trình biên dịch phải giữ mọi lệnh đọc và ghi. Trong <code>void add2(long *xp, long *yp) { *xp += *yp; *xp += *yp; }</code> nó không được thay bằng <code>*xp += 2 * *yp</code>, vì nếu xp == yp kết quả khác nhau. Cách gỡ: chép giá trị vào biến cục bộ, hoặc cam kết không bí danh bằng <code>restrict</code>.</li>
<li><strong>Lời gọi hàm</strong>: trình biên dịch phải giả định lời gọi có thể có tác dụng phụ. Gọi <code>strlen(s)</code> trong điều kiện vòng lặp làm vòng lặp thành O(n<sup>2</sup>). Cách gỡ: đưa lời gọi ra ngoài vòng (“code motion”).</li>
</ul>
<h4>Đo lường: CPE</h4>
<p>Với vòng lặp qua n phần tử, ta báo <strong>số chu kỳ mỗi phần tử (CPE)</strong>: tổng thời gian ≈ chi phí cố định + CPE · n. Phần cứng đặt ra hai giới hạn:</p>
<div class="formula"><span class="lbl">Hai giới hạn</span><b>giới hạn độ trễ</b>: một chuỗi mà mỗi phép cần kết quả phép trước chạy với tốc độ (độ trễ của phép toán) mỗi phần tử — vd phép cộng số thực mất vài chu kỳ<br><b>giới hạn thông lượng</b>: các phép độc lập chỉ bị giới hạn bởi số khối chức năng có thể khởi động một phép mỗi chu kỳ</div>
<h4>Đường găng và nhiều bộ tích luỹ</h4>
<p>Trong <code>acc = acc + a[i]</code>, mỗi phép cộng cần giá trị acc trước đó: một chuỗi dài phép cộng phụ thuộc nhau — <strong>đường găng (critical path)</strong>. Các lệnh nạp a[i] độc lập và chồng lên nhau được, nhưng phép cộng chạy lần lượt theo độ trễ của bộ cộng. Với <strong>4 bộ tích luỹ riêng</strong> (a0…a3), bốn chuỗi độc lập chạy song song qua bộ cộng có đường ống, rồi ta gộp ở cuối. Đây là mở vòng lặp “×4 với 4 bộ tích luỹ” (CS:APP gọi là mở k × k). Với số thực, cách này đổi thứ tự phép cộng — ở đây không sao (mọi giá trị là 1.0), nhưng nói chung kết quả có thể khác ở vài bit cuối, nên trình biên dịch không tự làm trừ khi được phép (vd <code>-ffast-math</code>).</p>
<h3>✍️ Ví dụ</h3>
` + C(SRC_PERF) + `
<p>Chạy thật trên Apple M1 Max:</p>
` + out(OUT_PERF) + `
<p>Nhanh hơn khoảng <strong>4,3 lần</strong>. Vòng một bộ tích luỹ bị giới hạn độ trễ (≈1,2 ns mỗi phần tử, đúng thời gian của một chuỗi phép cộng số thực phụ thuộc ở xung nhịp này); với bốn chuỗi, đường ống bộ cộng luôn bận. Thêm bộ tích luỹ còn có ích cho tới khi chạm giới hạn thông lượng (số khối cộng × tốc độ phát lệnh) hoặc băng thông bộ nhớ.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Tối ưu trước khi đo — luôn profile trước (gprof, perf, Instruments) và nhìn vào vòng lặp nóng.</li><li>Làm code khó đọc để được 2%; lợi lớn nằm ở thuật toán, cách truy cập bộ nhớ (chương 6) và gỡ vật cản.</li><li>Quên các lần lặp còn dư khi n không chia hết cho hệ số mở vòng.</li><li>Tưởng sắp xếp lại phép cộng số nguyên và số thực an toàn như nhau — phép cộng số thực không kết hợp (bài 2.5).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Bí danh bộ nhớ và lời gọi hàm chặn tối ưu; dùng biến cục bộ, <code>restrict</code>, đưa code ra ngoài vòng.</li><li>CPE đo hiệu năng vòng lặp; giới hạn độ trễ và giới hạn thông lượng.</li><li>Chuỗi phép toán phụ thuộc là đường găng.</li><li>Nhiều bộ tích luỹ phá chuỗi: đo được 4,3 lần ở đây.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://ocw.mit.edu/courses/6-172-performance-engineering-of-software-systems-fall-2018/" target="_blank" rel="noopener">MIT 6.172 — Kỹ thuật hiệu năng phần mềm</a></li><li><a href="https://en.wikipedia.org/wiki/Loop_unrolling" target="_blank" rel="noopener">Wikipedia — Mở vòng lặp</a></li><li><a href="https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html" target="_blank" rel="noopener">Tài liệu GCC — tuỳ chọn tối ưu (-O2, -funroll-loops, -ffast-math)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Vì sao trình biên dịch không giữ <code>*xp</code> trong thanh ghi ở hàm <code>add2</code> trên?</li><li><code>for (i = 0; i &lt; strlen(s); i++) if (s[i] == ' ') count++;</code> — độ phức tạp là gì, sửa thế nào?</li><li>Vòng tích <code>p = p * a[i]</code> có độ trễ phép nhân 3 chu kỳ và bộ nhân khởi động được một phép mỗi chu kỳ. CPE dự kiến với 1 bộ tích luỹ và với 3?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) yp có thể bằng xp, nên ghi *xp có thể đổi *yp; mọi truy cập phải đi tới bộ nhớ. 2) O(n<sup>2</sup>), vì strlen là O(n) và bị gọi mỗi vòng; tính <code>size_t len = strlen(s);</code> một lần trước vòng lặp. 3) Khoảng 3 với một bộ tích luỹ (giới hạn độ trễ); khoảng 1 với ba (giới hạn thông lượng).</p></div>`);

const q5 = QZ(5, 'Quiz — Chapter 5: Processor architecture and performance|||Quiz — Chương 5: Kiến trúc bộ xử lý và hiệu năng', 'Kiểm tra chương 5: ISA vs vi kiến trúc, mã hoá Y86-64, mạch tổ hợp vs thanh ghi, công đoạn, thông lượng/độ trễ, xung đột, dự đoán nhánh, CPE, bộ tích luỹ song song.', [
  Q('q1', 'The ISA defines|||ISA quy định',
    ['how many pipeline stages a chip has|||chip có bao nhiêu công đoạn đường ống', 'the instructions, their encodings and their effect on processor state|||các lệnh, cách mã hoá và tác dụng lên trạng thái bộ xử lý', 'the cache sizes|||kích thước cache', 'the clock frequency|||tần số xung nhịp'], 1,
    'The microarchitecture (pipeline, caches) is free to vary.|||Vi kiến trúc (đường ống, cache) được tự do thay đổi.'),
  Q('q2', 'Which element holds state from one clock cycle to the next?|||Phần tử nào giữ trạng thái từ chu kỳ này sang chu kỳ sau?',
    ['ALU|||ALU', 'Multiplexer|||Bộ dồn kênh', 'Clocked register|||Thanh ghi có xung nhịp', 'AND gate|||Cổng AND'], 2,
    'Combinational circuits only compute; registers and memories store.|||Mạch tổ hợp chỉ tính; thanh ghi và bộ nhớ mới lưu.'),
  Q('q3', 'In which stage does mrmovq read data memory?|||mrmovq đọc bộ nhớ dữ liệu ở công đoạn nào?',
    ['Fetch|||Fetch', 'Execute|||Execute', 'Memory|||Memory', 'Write back|||Write back'], 2,
    'Execute computes the address valE; Memory reads valM; Write back stores it in rA.|||Execute tính địa chỉ valE; Memory đọc valM; Write back ghi vào rA.'),
  Q('q4', 'Logic 300 ps split into 3 equal stages with 20 ps registers: throughput?|||Mạch 300 ps chia 3 công đoạn đều, thanh ghi 20 ps: thông lượng?',
    ['3.12 GIPS|||3,12 GIPS', '8.33 GIPS|||8,33 GIPS', '10 GIPS|||10 GIPS', '5.88 GIPS|||5,88 GIPS'], 1,
    'Period = 100 + 20 = 120 ps → 1/120 ps ≈ 8.33 GIPS.|||Chu kỳ = 100 + 20 = 120 ps → 1/120 ps ≈ 8,33 GIPS.'),
  Q('q5', 'Pipelining mainly improves|||Đường ống chủ yếu cải thiện',
    ['latency of one instruction|||độ trễ của một lệnh', 'throughput|||thông lượng', 'memory size|||dung lượng bộ nhớ', 'code size|||kích thước mã'], 1,
    'Latency even grows slightly because of register overhead.|||Độ trễ còn tăng nhẹ do chi phí thanh ghi.'),
  Q('q6', 'Forwarding (bypassing) solves|||Chuyển tiếp (forwarding) giải quyết',
    ['control hazards|||xung đột điều khiển', 'most data hazards without stalling|||phần lớn xung đột dữ liệu mà không phải chờ', 'cache misses|||trượt cache', 'all load-use hazards|||mọi xung đột load-use'], 1,
    'A load-use hazard still needs one stall before forwarding.|||Xung đột load-use vẫn cần chờ một chu kỳ trước khi chuyển tiếp.'),
  Q('q7', 'In our measurement at -O0, summing values ≥ 128 was 3.9× faster on sorted data because|||Trong phép đo ở -O0, cộng các giá trị ≥ 128 nhanh gấp 3,9 lần trên dữ liệu đã sắp xếp vì',
    ['sorted data uses less memory|||dữ liệu đã sắp xếp tốn ít bộ nhớ hơn', 'the branch became predictable|||nhánh trở nên đoán được', 'the compiler skipped half the loop|||trình biên dịch bỏ qua nửa vòng lặp', 'sorting changed the sum|||sắp xếp làm đổi tổng'], 1,
    'Random data defeats the branch predictor; sorted data gives long regular runs.|||Dữ liệu ngẫu nhiên làm bộ dự đoán thất bại; dữ liệu đã sắp xếp cho các dải dài đều đặn.'),
  Q('q8', 'At -O1 both cases ran equally fast because the compiler|||Ở -O1 hai trường hợp chạy nhanh như nhau vì trình biên dịch',
    ['sorted the array|||đã sắp xếp mảng', 'replaced the branch with a conditional select (csel/cmov)|||thay nhánh bằng lệnh chọn có điều kiện (csel/cmov)', 'removed the loop|||xoá vòng lặp', 'used more threads|||dùng nhiều luồng hơn'], 1,
    'Branch-free code has nothing to mispredict.|||Code không rẽ nhánh thì không có gì để đoán sai.'),
  Q('q9', 'Why can\'t the compiler rewrite *xp += *yp; *xp += *yp; as *xp += 2 * *yp?|||Vì sao trình biên dịch không viết lại *xp += *yp; *xp += *yp; thành *xp += 2 * *yp?',
    ['Multiplication is slower|||Phép nhân chậm hơn', 'xp and yp might point to the same location (aliasing)|||xp và yp có thể trỏ cùng chỗ (bí danh)', 'Overflow|||Tràn số', 'It is not valid C|||Không phải C hợp lệ'], 1,
    'If xp == yp the first version quadruples the value, the second triples it.|||Nếu xp == yp, bản đầu nhân giá trị lên 4, bản sau lên 3.'),
  Q('q10', 'Using 4 accumulators instead of 1 sped up our sum loop about 4× because|||Dùng 4 bộ tích luỹ thay vì 1 làm vòng tính tổng nhanh khoảng 4 lần vì',
    ['it does fewer additions|||nó cộng ít hơn', 'it breaks one dependent chain into four independent chains that the pipelined adder runs in parallel|||nó tách một chuỗi phụ thuộc thành bốn chuỗi độc lập mà bộ cộng đường ống chạy song song', 'it uses 4 CPU cores|||nó dùng 4 lõi CPU', 'it reads less memory|||nó đọc ít bộ nhớ hơn'], 1,
    'Same number of adds, but the latency-bound critical path is four times shorter.|||Cùng số phép cộng, nhưng đường găng bị giới hạn độ trễ ngắn đi bốn lần.'),
]);

const ch5 = {
  title: 'Chapter 5 — Processor architecture and program performance|||Chương 5 — Kiến trúc bộ xử lý và hiệu năng chương trình',
  description: 'ISA và Y86-64, khối phần cứng, sáu công đoạn và đường ống (bài tính thông lượng/độ trễ), xung đột và dự đoán nhánh đo thật, tối ưu hiệu năng với bộ tích luỹ song song đo thật (CS:APP chương 4–5).',
  lessons: [c51, c52, c53, c54, q5],
};

// ───────────────────────────── Chương 6 — Phân cấp bộ nhớ & cache ─────────────────────────────
const c61 = L('ics102-ts-6-1',
  '6.1 — Storage technologies and locality|||6.1 — Công nghệ lưu trữ và tính cục bộ',
  'SRAM, DRAM, ổ đĩa quay (tính thời gian truy cập từng bước), SSD; khoảng cách tốc độ CPU–bộ nhớ; tính cục bộ theo thời gian và không gian, bước nhảy (stride); trúng/trượt cache và ba loại trượt.',
  `<span class="eyebrow">ICS102 · Chapter 6 · Lesson 6.1</span>
<h2>Storage technologies and locality</h2>
<p class="lead">Fast memory is expensive and small; cheap memory is large and slow. The gap between processor speed and memory speed keeps growing. The only reason computers still run fast is a property of programs called <strong>locality</strong> — and the memory hierarchy is built to exploit it.</p>
<h3>🎯 Objectives</h3>
<ul><li>Compare SRAM, DRAM, rotating disks and SSDs.</li><li>Compute the access time of a disk sector.</li><li>Recognise temporal and spatial locality in code.</li><li>Classify cache misses as cold, conflict or capacity misses.</li></ul>
<h3>📖 Lecture</h3>
<h4>Storage technologies</h4>
<ul>
<li><strong>SRAM</strong> (static RAM): 6 transistors per bit, keeps its value while powered, fast (~1–10 ns), expensive — used for <strong>caches</strong>.</li>
<li><strong>DRAM</strong> (dynamic RAM): 1 transistor + 1 capacitor per bit, must be refreshed, denser and cheaper, slower (~50–100 ns) — used for <strong>main memory</strong>. Organised in chips of “supercells” addressed by row and column, combined into memory modules.</li>
<li><strong>Rotating disks</strong>: platters spin (e.g. 7200 RPM); a head moves to the right track (seek), waits for the sector to rotate under it (rotational latency), then transfers.</li>
<li><strong>SSD</strong> (flash): no moving parts; reads in tens of microseconds; data is written in pages and erased in blocks, so writes are slower and blocks wear out after many erase cycles (the controller spreads writes: “wear levelling”).</li>
</ul>
<div class="callout"><p><b>Worked example — disk access time.</b> 7200 RPM, average seek 9 ms, 400 sectors per track.<br>Step 1: one rotation = 60 s / 7200 = 8.33 ms; average rotational latency = half a rotation = <b>4.17 ms</b>.<br>Step 2: transfer one sector = 8.33 ms / 400 ≈ <b>0.02 ms</b>.<br>Step 3: total ≈ 9 + 4.17 + 0.02 ≈ <b>13.2 ms</b> — dominated by seek and rotation. The first byte costs everything; the following bytes in the same sector are almost free. Compare: DRAM ≈ 100 ns, about 100 000 times faster.</p></div>
<h4>The processor–memory gap</h4>
<p>For decades CPU cycle times fell much faster than DRAM and disk access times. A modern core can execute hundreds of instructions in the time of one DRAM access. Without caches it would mostly wait.</p>
<h4>Locality</h4>
<ul>
<li><strong>Temporal locality</strong>: a location referenced once is likely to be referenced again soon (loop variables, the accumulator <code>sum</code>, the code of a loop).</li>
<li><strong>Spatial locality</strong>: locations near a referenced one are likely to be referenced soon (walking an array element by element; executing instructions in sequence).</li>
</ul>
<p>A <strong>stride-k</strong> reference pattern visits every k-th element. Stride 1 (sequential) has the best spatial locality; spatial locality decreases as the stride grows. For a C 2-D array (row-major), looping with the <em>last</em> index in the inner loop gives stride 1; swapping the loops gives stride = row length (lesson 6.3 measures it).</p>
<h4>Caches: hits and misses</h4>
<p>Data moves between levels in fixed-size <strong>blocks</strong> (cache lines). When the program needs data from level k+1, it looks in the cache at level k: a <strong>hit</strong> if the block is there, a <strong>miss</strong> otherwise, in which case the block is fetched and may evict (replace) another block. Kinds of misses:</p>
<ul><li><strong>Cold (compulsory)</strong>: the very first access to a block.</li><li><strong>Conflict</strong>: the cache has room, but the placement rule maps several blocks to the same slot and they keep evicting each other.</li><li><strong>Capacity</strong>: the working set is larger than the cache.</li></ul>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Thinking memory access has one fixed cost — it ranges from ~1 ns (L1) to ~10 ms (disk).</li><li>Confusing temporal (same address again) and spatial (nearby addresses) locality.</li><li>Assuming SSDs make the memory hierarchy irrelevant — an SSD is still ~1000× slower than DRAM.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>SRAM → caches; DRAM → main memory; disk/SSD → persistent storage, each much slower.</li><li>Disk access ≈ seek + rotational latency + transfer; the first byte is the expensive one.</li><li>Good programs have temporal and spatial locality; stride-1 access is best.</li><li>Misses: cold, conflict, capacity.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Locality_of_reference" target="_blank" rel="noopener">Wikipedia — Locality of reference</a></li><li><a href="https://lwn.net/Articles/250967/" target="_blank" rel="noopener">Ulrich Drepper — What every programmer should know about memory (LWN series, part 1)</a></li><li><a href="https://pages.cs.wisc.edu/~remzi/OSTEP/file-devices.pdf" target="_blank" rel="noopener">OSTEP — Hard Disk Drives (PDF)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>A 10 000 RPM disk has average seek 5 ms and 1000 sectors per track. Estimate the time to read one sector.</li><li>In <code>for (i = 0; i &lt; n; i++) sum += a[i];</code> which variables show temporal locality, and which spatial?</li><li>A program reads a 1 GiB array once, sequentially. Which kind of miss dominates?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Rotation = 6 ms → latency 3 ms; transfer 6 ms / 1000 = 0.006 ms; total ≈ 8.0 ms. 2) Temporal: sum, i (and the loop code); spatial: a[i] (stride 1) and the instructions. 3) Cold misses — every block is touched for the first time (each one is reused within the block, giving the hits).</p></div>`,
  `<span class="eyebrow">ICS102 · Chương 6 · Bài 6.1</span>
<h2>Công nghệ lưu trữ và tính cục bộ</h2>
<p class="lead">Bộ nhớ nhanh thì đắt và nhỏ; bộ nhớ rẻ thì lớn và chậm. Khoảng cách giữa tốc độ bộ xử lý và tốc độ bộ nhớ ngày càng lớn. Lý do duy nhất máy tính vẫn chạy nhanh là một tính chất của chương trình gọi là <strong>tính cục bộ (locality)</strong> — và tháp phân cấp bộ nhớ được dựng để khai thác nó.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>So sánh SRAM, DRAM, đĩa quay và SSD.</li><li>Tính thời gian truy cập một sector đĩa.</li><li>Nhận ra tính cục bộ theo thời gian và không gian trong code.</li><li>Phân loại trượt cache: trượt nguội, trượt xung đột, trượt dung lượng.</li></ul>
<h3>📖 Bài giảng</h3>
<h4>Các công nghệ lưu trữ</h4>
<ul>
<li><strong>SRAM</strong> (RAM tĩnh): 6 transistor mỗi bit, giữ giá trị khi còn điện, nhanh (~1–10 ns), đắt — dùng cho <strong>cache</strong>.</li>
<li><strong>DRAM</strong> (RAM động): 1 transistor + 1 tụ mỗi bit, phải làm tươi định kỳ, dày đặc và rẻ hơn, chậm hơn (~50–100 ns) — dùng cho <strong>bộ nhớ chính</strong>. Tổ chức thành chip gồm các “siêu ô” đánh địa chỉ theo hàng và cột, ghép thành thanh nhớ.</li>
<li><strong>Đĩa quay</strong>: các đĩa từ quay (vd 7200 vòng/phút); đầu đọc dịch tới đúng rãnh (seek), chờ sector quay tới dưới nó (độ trễ quay), rồi truyền dữ liệu.</li>
<li><strong>SSD</strong> (flash): không có bộ phận chuyển động; đọc trong vài chục micro-giây; dữ liệu ghi theo trang và xoá theo khối, nên ghi chậm hơn và khối bị mòn sau nhiều lần xoá (bộ điều khiển rải đều thao tác ghi: “cân bằng hao mòn”).</li>
</ul>
<div class="callout"><p><b>Ví dụ giải từng bước — thời gian truy cập đĩa.</b> 7200 vòng/phút, seek trung bình 9 ms, 400 sector mỗi rãnh.<br>Bước 1: một vòng quay = 60 s / 7200 = 8,33 ms; độ trễ quay trung bình = nửa vòng = <b>4,17 ms</b>.<br>Bước 2: truyền một sector = 8,33 ms / 400 ≈ <b>0,02 ms</b>.<br>Bước 3: tổng ≈ 9 + 4,17 + 0,02 ≈ <b>13,2 ms</b> — gần như toàn bộ là seek và quay. Byte đầu tiên tốn hết chi phí; các byte tiếp theo trong cùng sector gần như miễn phí. So sánh: DRAM ≈ 100 ns, nhanh hơn khoảng 100 000 lần.</p></div>
<h4>Khoảng cách bộ xử lý – bộ nhớ</h4>
<p>Hàng chục năm qua, thời gian một chu kỳ CPU giảm nhanh hơn nhiều so với thời gian truy cập DRAM và đĩa. Một lõi hiện đại chạy được hàng trăm lệnh trong thời gian một lần truy cập DRAM. Không có cache, nó sẽ phần lớn thời gian ngồi chờ.</p>
<h4>Tính cục bộ</h4>
<ul>
<li><strong>Cục bộ theo thời gian</strong>: một vị trí vừa được truy cập có khả năng sớm được truy cập lại (biến vòng lặp, biến tích luỹ <code>sum</code>, mã của vòng lặp).</li>
<li><strong>Cục bộ theo không gian</strong>: các vị trí gần vị trí vừa truy cập có khả năng sớm được truy cập (duyệt mảng từng phần tử; chạy lệnh tuần tự).</li>
</ul>
<p>Mẫu truy cập <strong>bước k (stride-k)</strong> ghé mỗi phần tử thứ k. Bước 1 (tuần tự) có tính cục bộ không gian tốt nhất; bước càng lớn tính cục bộ càng giảm. Với mảng 2 chiều của C (lưu theo hàng), vòng trong chạy theo chỉ số <em>cuối</em> cho bước 1; đảo vòng lặp thì bước = độ dài một hàng (bài 6.3 đo điều này).</p>
<h4>Cache: trúng và trượt</h4>
<p>Dữ liệu di chuyển giữa các tầng theo <strong>khối</strong> cố định (dòng cache). Khi chương trình cần dữ liệu từ tầng k+1, nó tìm trong cache tầng k: <strong>trúng (hit)</strong> nếu khối có ở đó, <strong>trượt (miss)</strong> nếu không, khi đó khối được nạp về và có thể đẩy (thay thế) một khối khác. Các loại trượt:</p>
<ul><li><strong>Trượt nguội (bắt buộc)</strong>: lần đầu tiên truy cập một khối.</li><li><strong>Trượt xung đột</strong>: cache còn chỗ, nhưng luật đặt khối ánh xạ nhiều khối vào cùng một chỗ và chúng liên tục đẩy nhau ra.</li><li><strong>Trượt dung lượng</strong>: tập dữ liệu làm việc lớn hơn cache.</li></ul>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Tưởng truy cập bộ nhớ có một chi phí cố định — nó trải từ ~1 ns (L1) tới ~10 ms (đĩa).</li><li>Lẫn cục bộ thời gian (lại đúng địa chỉ đó) với cục bộ không gian (địa chỉ gần đó).</li><li>Tưởng có SSD thì phân cấp bộ nhớ hết quan trọng — SSD vẫn chậm hơn DRAM cỡ 1000 lần.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>SRAM → cache; DRAM → bộ nhớ chính; đĩa/SSD → lưu trữ lâu dài, mỗi tầng chậm hơn nhiều.</li><li>Truy cập đĩa ≈ seek + độ trễ quay + truyền; byte đầu tiên là byte đắt.</li><li>Chương trình tốt có cục bộ thời gian và không gian; truy cập bước 1 là tốt nhất.</li><li>Trượt: nguội, xung đột, dung lượng.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Locality_of_reference" target="_blank" rel="noopener">Wikipedia — Tính cục bộ của tham chiếu</a></li><li><a href="https://lwn.net/Articles/250967/" target="_blank" rel="noopener">Ulrich Drepper — What every programmer should know about memory (loạt bài LWN, phần 1)</a></li><li><a href="https://pages.cs.wisc.edu/~remzi/OSTEP/file-devices.pdf" target="_blank" rel="noopener">OSTEP — Hard Disk Drives (PDF)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Đĩa 10 000 vòng/phút, seek trung bình 5 ms, 1000 sector mỗi rãnh. Ước lượng thời gian đọc một sector.</li><li>Trong <code>for (i = 0; i &lt; n; i++) sum += a[i];</code> biến nào có cục bộ thời gian, biến nào có cục bộ không gian?</li><li>Một chương trình đọc mảng 1 GiB một lần, tuần tự. Loại trượt nào chiếm ưu thế?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Một vòng = 6 ms → độ trễ 3 ms; truyền 6 ms / 1000 = 0,006 ms; tổng ≈ 8,0 ms. 2) Thời gian: sum, i (và mã vòng lặp); không gian: a[i] (bước 1) và các lệnh. 3) Trượt nguội — mọi khối đều được chạm lần đầu (mỗi khối được dùng lại bên trong nó, tạo ra các lần trúng).</p></div>`);

const c62 = L('ics102-ts-6-2',
  '6.2 — Cache organisation: sets, lines, blocks and address bits|||6.2 — Tổ chức cache: tập, dòng, khối và các bit địa chỉ',
  'Tham số (S, E, B, m), chia địa chỉ thành tag–set index–block offset, cache ánh xạ trực tiếp (mô phỏng từng bước theo CS:APP), cache kết hợp tập, thay thế LRU, chính sách ghi, thời gian truy cập trung bình (AMAT).',
  `<span class="eyebrow">ICS102 · Chapter 6 · Lesson 6.2</span>
<h2>Cache organisation: sets, lines, blocks and address bits</h2>
<p class="lead">How does the hardware decide in a few cycles whether an address is in the cache? The answer is a simple, rigid organisation: the address bits themselves say where to look. Once you can split an address into tag, set and offset, you can simulate any cache by hand — which is exactly what the CS:APP Cache Lab asks.</p>
<h3>🎯 Objectives</h3>
<ul><li>Describe a cache by (S, E, B, m) and compute its size.</li><li>Split an address into tag, set index and block offset.</li><li>Simulate a direct-mapped cache on an address sequence.</li><li>Compute the average memory access time (AMAT).</li></ul>
<h3>📖 Lecture</h3>
<h4>General organisation</h4>
<p>A cache is an array of <strong>S = 2<sup>s</sup> sets</strong>; each set has <strong>E lines</strong>; each line holds a <strong>block of B = 2<sup>b</sup> bytes</strong>, a <strong>valid bit</strong> and a <strong>tag</strong>. Capacity C = S × E × B bytes (tags and valid bits not counted). With m-bit addresses:</p>
<div class="formula"><span class="lbl">Address partition</span>| tag: t = m − s − b bits | set index: s bits | block offset: b bits |</div>
<p>To look up an address: (1) use the set-index bits to select a set; (2) compare the tag with the tags of the valid lines in that set — a match is a hit; (3) use the offset to pick the bytes inside the block. On a miss the block is fetched from the next level; if the set is full, a line is evicted.</p>
<div class="callout"><p><b>Worked example — address bits.</b> A 32 KiB, 8-way set-associative cache with 64-byte blocks and 64-bit addresses.<br>B = 64 → b = 6. Number of sets S = 32768 / (8 × 64) = 64 → s = 6. t = 64 − 6 − 6 = <b>52</b>.<br>Address 0x7FFF1234: offset = low 6 bits = 0x34 = 52; set = next 6 bits = (0x1234 &gt;&gt; 6) &amp; 63 = 72 &amp; 63 = <b>8</b>; tag = the remaining high bits.</p></div>
<h4>Direct-mapped caches (E = 1)</h4>
<div class="callout"><p><b>Simulation (from CS:APP 6.4.2).</b> m = 4-bit addresses, S = 4 sets, E = 1, B = 2 bytes → b = 1, s = 2, t = 1. The program reads addresses 0, 1, 7, 8, 0.<br>• 0 = 0 00 0: set 0, tag 0 → <b>miss</b> (cold); load block [0,1] into set 0.<br>• 1 = 0 00 1: set 0, tag 0 → <b>hit</b>.<br>• 7 = 0 11 1: set 3, tag 0 → <b>miss</b>; load [6,7] into set 3.<br>• 8 = 1 00 0: set 0, tag 1 ≠ 0 → <b>miss</b>; [8,9] evicts [0,1].<br>• 0: set 0, tag 0 ≠ 1 → <b>miss</b> again — a <b>conflict miss</b>, although sets 1 and 2 are empty.</p></div>
<p>Direct-mapped caches are simple and fast but suffer from conflict misses (“thrashing”) when two hot blocks map to the same set — for example two arrays whose sizes are a power of two apart.</p>
<h4>Set-associative and fully associative caches</h4>
<p>With E &gt; 1 (E-way set associative) a block can go in any of the E lines of its set, so two conflicting blocks can coexist. On a miss in a full set the hardware evicts a line according to a policy, typically <strong>LRU</strong> (least recently used). A fully associative cache has a single set (S = 1): no conflict misses but expensive tag search — used for small structures such as TLBs (chapter 9).</p>
<h4>Writes</h4>
<p>On a write hit: <strong>write-through</strong> (also write the next level immediately) or <strong>write-back</strong> (write only when the line is evicted; needs a dirty bit). On a write miss: <strong>write-allocate</strong> (load the block, then write) or <strong>no-write-allocate</strong>. Modern caches typically use write-back + write-allocate.</p>
<h4>Performance metrics</h4>
<div class="formula"><span class="lbl">Average memory access time</span>AMAT = hit time + miss rate × miss penalty</div>
<p>Example: hit time 1 cycle, miss penalty 100 cycles. 97% hits → 1 + 0.03 × 100 = 4 cycles; 99% hits → 1 + 0.01 × 100 = 2 cycles. Going from 97% to 99% hits <strong>halves</strong> the average access time — small miss-rate changes matter a lot. Typical latencies on a desktop core: L1 ≈ 4 cycles, L2 ≈ 10–15, L3 ≈ 40–75, DRAM ≈ 200+.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Taking the set index from the high bits — it comes from the middle bits (high bits would map neighbouring blocks to the same set).</li><li>Counting tag and valid bits in the cache capacity C.</li><li>Calling every miss after the first a capacity miss — check whether the cache was actually full.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Cache = S sets × E lines × B-byte blocks; C = S·E·B.</li><li>Address = tag | set index | block offset.</li><li>Direct-mapped (E = 1) suffers conflict misses; associativity and LRU reduce them.</li><li>AMAT = hit time + miss rate × miss penalty.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/CPU_cache" target="_blank" rel="noopener">Wikipedia — CPU cache</a></li><li><a href="https://csapp.cs.cmu.edu/3e/labs.html" target="_blank" rel="noopener">CS:APP Cache Lab — write a cache simulator</a></li><li><a href="https://www.cs.cmu.edu/~213/schedule.html" target="_blank" rel="noopener">CMU 15-213 — lectures “The Memory Hierarchy” and “Cache Memories”</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>A 4 KiB direct-mapped cache with 16-byte blocks, 32-bit addresses: give S, s, b, t.</li><li>In the simulation above, continue with reads of 9 and 1. Hit or miss?</li><li>L1 hit time 4 cycles, miss rate 5%, miss penalty 50 cycles. AMAT?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) S = 4096 / 16 = 256 → s = 8, b = 4, t = 32 − 12 = 20. 2) After the last read set 0 holds [0,1] with tag 0. 9 = 1 00 1: set 0, tag 1 → miss (evicts [0,1]). 1 = 0 00 1: set 0, tag 0 → miss. 3) 4 + 0.05 × 50 = 6.5 cycles.</p></div>`,
  `<span class="eyebrow">ICS102 · Chương 6 · Bài 6.2</span>
<h2>Tổ chức cache: tập, dòng, khối và các bit địa chỉ</h2>
<p class="lead">Làm sao phần cứng quyết định trong vài chu kỳ một địa chỉ có trong cache hay không? Câu trả lời là một tổ chức đơn giản, cứng nhắc: chính các bit của địa chỉ chỉ ra nơi cần tìm. Khi chia được địa chỉ thành tag, set và offset, bạn mô phỏng được mọi cache bằng tay — đúng thứ mà Cache Lab của CS:APP yêu cầu.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Mô tả cache bằng (S, E, B, m) và tính dung lượng.</li><li>Chia địa chỉ thành tag, chỉ số tập và độ dời trong khối.</li><li>Mô phỏng cache ánh xạ trực tiếp với một dãy địa chỉ.</li><li>Tính thời gian truy cập bộ nhớ trung bình (AMAT).</li></ul>
<h3>📖 Bài giảng</h3>
<h4>Tổ chức tổng quát</h4>
<p>Cache là một mảng <strong>S = 2<sup>s</sup> tập (set)</strong>; mỗi tập có <strong>E dòng (line)</strong>; mỗi dòng chứa <strong>một khối B = 2<sup>b</sup> byte</strong>, một <strong>bit hợp lệ</strong> và một <strong>tag</strong>. Dung lượng C = S × E × B byte (không tính tag và bit hợp lệ). Với địa chỉ m bit:</p>
<div class="formula"><span class="lbl">Chia địa chỉ</span>| tag: t = m − s − b bit | chỉ số tập: s bit | độ dời trong khối: b bit |</div>
<p>Tra một địa chỉ: (1) dùng các bit chỉ số tập để chọn tập; (2) so tag với tag của các dòng hợp lệ trong tập — khớp là trúng; (3) dùng độ dời để lấy byte trong khối. Khi trượt, khối được nạp từ tầng dưới; nếu tập đầy, một dòng bị đẩy ra.</p>
<div class="callout"><p><b>Ví dụ giải từng bước — các bit địa chỉ.</b> Cache 32 KiB, kết hợp tập 8 đường, khối 64 byte, địa chỉ 64 bit.<br>B = 64 → b = 6. Số tập S = 32768 / (8 × 64) = 64 → s = 6. t = 64 − 6 − 6 = <b>52</b>.<br>Địa chỉ 0x7FFF1234: độ dời = 6 bit thấp = 0x34 = 52; tập = 6 bit kế = (0x1234 &gt;&gt; 6) &amp; 63 = 72 &amp; 63 = <b>8</b>; tag = các bit cao còn lại.</p></div>
<h4>Cache ánh xạ trực tiếp (E = 1)</h4>
<div class="callout"><p><b>Mô phỏng (theo CS:APP 6.4.2).</b> Địa chỉ m = 4 bit, S = 4 tập, E = 1, B = 2 byte → b = 1, s = 2, t = 1. Chương trình đọc các địa chỉ 0, 1, 7, 8, 0.<br>• 0 = 0 00 0: tập 0, tag 0 → <b>trượt</b> (nguội); nạp khối [0,1] vào tập 0.<br>• 1 = 0 00 1: tập 0, tag 0 → <b>trúng</b>.<br>• 7 = 0 11 1: tập 3, tag 0 → <b>trượt</b>; nạp [6,7] vào tập 3.<br>• 8 = 1 00 0: tập 0, tag 1 ≠ 0 → <b>trượt</b>; [8,9] đẩy [0,1] ra.<br>• 0: tập 0, tag 0 ≠ 1 → lại <b>trượt</b> — <b>trượt xung đột</b>, dù tập 1 và 2 còn trống.</p></div>
<p>Cache ánh xạ trực tiếp đơn giản và nhanh nhưng chịu trượt xung đột (“thrashing”) khi hai khối nóng ánh xạ vào cùng tập — ví dụ hai mảng cách nhau đúng một luỹ thừa của 2.</p>
<h4>Cache kết hợp tập và kết hợp toàn phần</h4>
<p>Với E &gt; 1 (kết hợp tập E đường), một khối được đặt vào bất kỳ dòng nào trong E dòng của tập, nên hai khối xung đột có thể cùng tồn tại. Khi trượt mà tập đã đầy, phần cứng đẩy một dòng theo chính sách, thường là <strong>LRU</strong> (ít được dùng gần đây nhất). Cache kết hợp toàn phần chỉ có một tập (S = 1): không có trượt xung đột nhưng tìm tag tốn kém — dùng cho cấu trúc nhỏ như TLB (chương 9).</p>
<h4>Thao tác ghi</h4>
<p>Ghi mà trúng: <strong>ghi xuyên (write-through)</strong> (ghi luôn xuống tầng dưới) hoặc <strong>ghi sau (write-back)</strong> (chỉ ghi khi dòng bị đẩy ra; cần bit dirty). Ghi mà trượt: <strong>write-allocate</strong> (nạp khối rồi ghi) hoặc <strong>no-write-allocate</strong>. Cache hiện đại thường dùng write-back + write-allocate.</p>
<h4>Chỉ số hiệu năng</h4>
<div class="formula"><span class="lbl">Thời gian truy cập bộ nhớ trung bình</span>AMAT = thời gian trúng + tỉ lệ trượt × chi phí trượt</div>
<p>Ví dụ: thời gian trúng 1 chu kỳ, chi phí trượt 100 chu kỳ. Trúng 97% → 1 + 0,03 × 100 = 4 chu kỳ; trúng 99% → 1 + 0,01 × 100 = 2 chu kỳ. Từ 97% lên 99% trúng làm thời gian truy cập trung bình <strong>giảm một nửa</strong> — thay đổi nhỏ của tỉ lệ trượt có tác động rất lớn. Độ trễ điển hình trên lõi máy bàn: L1 ≈ 4 chu kỳ, L2 ≈ 10–15, L3 ≈ 40–75, DRAM ≈ 200+.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Lấy chỉ số tập từ các bit cao — nó lấy từ các bit giữa (bit cao sẽ dồn các khối liền kề vào cùng tập).</li><li>Tính cả tag và bit hợp lệ vào dung lượng C.</li><li>Gọi mọi lần trượt sau lần đầu là trượt dung lượng — phải kiểm cache có thật sự đầy không.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Cache = S tập × E dòng × khối B byte; C = S·E·B.</li><li>Địa chỉ = tag | chỉ số tập | độ dời trong khối.</li><li>Ánh xạ trực tiếp (E = 1) chịu trượt xung đột; kết hợp tập và LRU giảm bớt.</li><li>AMAT = thời gian trúng + tỉ lệ trượt × chi phí trượt.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/CPU_cache" target="_blank" rel="noopener">Wikipedia — Cache CPU</a></li><li><a href="https://csapp.cs.cmu.edu/3e/labs.html" target="_blank" rel="noopener">CS:APP Cache Lab — viết trình mô phỏng cache</a></li><li><a href="https://www.cs.cmu.edu/~213/schedule.html" target="_blank" rel="noopener">CMU 15-213 — bài giảng “The Memory Hierarchy” và “Cache Memories”</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Cache ánh xạ trực tiếp 4 KiB, khối 16 byte, địa chỉ 32 bit: cho S, s, b, t.</li><li>Trong mô phỏng trên, đọc tiếp địa chỉ 9 rồi 1. Trúng hay trượt?</li><li>L1 trúng mất 4 chu kỳ, tỉ lệ trượt 5%, chi phí trượt 50 chu kỳ. AMAT?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) S = 4096 / 16 = 256 → s = 8, b = 4, t = 32 − 12 = 20. 2) Sau lần đọc cuối, tập 0 chứa [0,1] với tag 0. 9 = 1 00 1: tập 0, tag 1 → trượt (đẩy [0,1] ra). 1 = 0 00 1: tập 0, tag 0 → trượt. 3) 4 + 0,05 × 50 = 6,5 chu kỳ.</p></div>`);

const SRC_CACHE = String.raw`
#include <stdio.h>
#include <time.h>
#define M 4096
static int a[M][M];                       /* 4096*4096*4 B = 64 MiB */
static double now(void) { struct timespec t; clock_gettime(CLOCK_MONOTONIC, &t); return t.tv_sec + t.tv_nsec * 1e-9; }
long sum_rows(void) {                     /* stride-1: follows memory order */
    long s = 0;
    for (int i = 0; i < M; i++)
        for (int j = 0; j < M; j++) s += a[i][j];
    return s;
}
long sum_cols(void) {                     /* stride-M: jumps 16 KiB each step */
    long s = 0;
    for (int j = 0; j < M; j++)
        for (int i = 0; i < M; i++) s += a[i][j];
    return s;
}
int main(void) {
    for (int i = 0; i < M; i++) for (int j = 0; j < M; j++) a[i][j] = 1;
    double t0 = now(); long r = sum_rows(); double tr = now() - t0;
    t0 = now(); long c = sum_cols(); double tc = now() - t0;
    printf("row-major   : sum=%ld  %.1f ms\n", r, tr * 1e3);
    printf("column-major: sum=%ld  %.1f ms  (%.1fx slower)\n", c, tc * 1e3, tc / tr);
    return 0;
}
`;
const OUT_CACHE = String.raw`
$ cc -O1 cache.c -o cache && ./cache && ./cache
row-major   : sum=16777216  11.6 ms
column-major: sum=16777216  74.3 ms  (6.4x slower)
row-major   : sum=16777216  9.5 ms
column-major: sum=16777216  76.7 ms  (8.1x slower)
`;
const SRC_MM = String.raw`
#define n 1024
static double A[n][n], B[n][n], C[n][n];
void mm_ijk(void) {                       /* inner loop walks B down a column */
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++) {
            double sum = 0.0;
            for (int k = 0; k < n; k++) sum += A[i][k] * B[k][j];
            C[i][j] += sum;
        }
}
void mm_ikj(void) {                       /* inner loop walks B and C along rows */
    for (int i = 0; i < n; i++)
        for (int k = 0; k < n; k++) {
            double r = A[i][k];
            for (int j = 0; j < n; j++) C[i][j] += r * B[k][j];
        }
}
void mm_jki(void) {                       /* inner loop walks A and C down columns */
    for (int j = 0; j < n; j++)
        for (int k = 0; k < n; k++) {
            double r = B[k][j];
            for (int i = 0; i < n; i++) C[i][j] += A[i][k] * r;
        }
}
`;
const OUT_MM = String.raw`
$ cc -O1 mm.c -o mm && ./mm
ijk: 4.86 s  C[7][7]=2048
ikj: 0.73 s  C[7][7]=2048
jki: 14.91 s  C[7][7]=2048
`;

const c63 = L('ics102-ts-6-3',
  '6.3 — Writing cache-friendly code: loop order, matrix multiplication, blocking|||6.3 — Viết code thân thiện với cache: thứ tự vòng lặp, nhân ma trận, chia khối',
  'Hai quy tắc vàng (vòng trong là chính, bước 1); đo thật: duyệt cột chậm 6–8 lần duyệt hàng; ba thứ tự vòng lặp nhân ma trận 1024×1024 cùng kết quả nhưng 0,73 s – 4,86 s – 14,91 s; phân tích trượt mỗi vòng; ý tưởng chia khối.',
  `<span class="eyebrow">ICS102 · Chapter 6 · Lesson 6.3</span>
<h2>Writing cache-friendly code: loop order, matrix multiplication, blocking</h2>
<p class="lead">You cannot control the cache directly, but you control the order in which your program touches memory. Two simple rules — and the measurements below — show that the same algorithm with the same number of operations can be <strong>20 times</strong> faster or slower depending only on loop order.</p>
<h3>🎯 Objectives</h3>
<ul><li>Apply the two rules of cache-friendly code.</li><li>Predict the miss rate of a loop from its stride.</li><li>Choose the best loop order for matrix multiplication and explain why.</li><li>Explain the idea of blocking (tiling).</li></ul>
<h3>📖 Lecture</h3>
<h4>Two rules</h4>
<ol><li><strong>Make the common case fast</strong>: focus on the inner loops, where almost all the time goes.</li><li><strong>Minimise misses in inner loops</strong>: reuse data while it is in the cache (temporal locality) and access memory with stride 1 (spatial locality).</li></ol>
<p>Quick estimate: with B-byte blocks and w-byte elements, a stride-1 loop misses about once every B/w accesses (miss rate w/B); a loop whose stride is at least a block misses on every access (miss rate 100%).</p>
<h3>✍️ Worked example 1 — rows versus columns</h3>
` + C(SRC_CACHE) + `
<p>Real runs on our Apple M1 Max (128-byte cache lines, lesson 1.2):</p>
` + out(OUT_CACHE) + `
<p>Same 16.8 million additions, same result. Row order reads 128-byte lines sequentially: one miss per 32 ints, and the hardware <strong>prefetcher</strong> sees the pattern and fetches ahead. Column order jumps 16 KiB at each step, so nearly every access touches a new line, and by the time the loop comes back to the next column the old lines have been evicted.</p>
<h3>✍️ Worked example 2 — matrix multiplication</h3>
<p>C = A·B for n × n doubles needs n<sup>3</sup> multiply-adds in every loop order. Only the access pattern of the inner loop differs. The three functions (the full program adds a timer and a <code>main</code> that initialises A = 1, B = 2 and times each version):</p>
` + C(SRC_MM) + `
` + out(OUT_MM) + `
<div class="callout"><p><b>Analysis of the inner loop</b> (8-byte doubles, 64-byte blocks for round numbers, n large):<br>• <b>ijk</b>: A[i][k] row-wise (stride 1 → 0.125 misses), B[k][j] column-wise (1 miss) → ≈ <b>1.125 misses</b> per iteration.<br>• <b>ikj</b>: B[k][j] and C[i][j] both row-wise → 0.125 + 0.125 = ≈ <b>0.25 misses</b>.<br>• <b>jki</b>: A[i][k] and C[i][j] both column-wise → ≈ <b>2 misses</b>.<br>Prediction: ikj &lt; ijk &lt; jki. The measurement agrees: 0.73 s, 4.86 s, 14.91 s — a <b>20×</b> spread for identical arithmetic.</p></div>
<h4>Blocking (tiling)</h4>
<p>For very large matrices even the good order evicts useful data. <strong>Blocking</strong> splits the matrices into small sub-matrices that fit in the cache and multiplies block by block, so each loaded block is reused many times before it is evicted. Optimised libraries (BLAS, the engines inside NumPy and PyTorch) combine blocking with SIMD and multiple accumulators (lesson 5.4).</p>
<h4>The memory mountain</h4>
<p>CS:APP measures read throughput as a function of working-set size and stride: a 3-D “memory mountain” with ridges for L1, L2, L3 and DRAM, and slopes as the stride grows. Every machine has its own; the CS:APP student site provides the program to draw yours.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Writing the column index in the outer loop for C arrays (Fortran and MATLAB are column-major, C is row-major).</li><li>Counting only operations when estimating speed — misses can dominate.</li><li>Measuring once with a cold cache; run several times and take the best or the median.</li><li>Structures of arrays vs arrays of structures: reading one field of many big structs wastes most of each cache line.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Focus on inner loops; reuse data and use stride 1.</li><li>Row vs column traversal: measured 6–8× difference.</li><li>Matrix multiplication: ikj (0.25 misses/iter) beats ijk (1.125) beats jki (2): 0.73 s vs 4.86 s vs 14.91 s.</li><li>Blocking reuses cached blocks; high-performance libraries rely on it.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://csapp.cs.cmu.edu/3e/students.html" target="_blank" rel="noopener">CS:APP student site — memory mountain program</a></li><li><a href="https://akkadia.org/drepper/cpumemory.pdf" target="_blank" rel="noopener">Ulrich Drepper — What Every Programmer Should Know About Memory (PDF)</a></li><li><a href="https://ocw.mit.edu/courses/6-172-performance-engineering-of-software-systems-fall-2018/" target="_blank" rel="noopener">MIT 6.172 — lecture 1 starts with exactly this matrix-multiplication experiment</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Estimate the miss rate of <code>for (i = 0; i &lt; n; i += 2) sum += a[i];</code> for 4-byte ints and 64-byte blocks.</li><li>Rewrite <code>for (j...) for (i...) b[i][j] = a[i][j] * 2;</code> to be cache-friendly.</li><li>Why does <code>jki</code> stay slow even though <code>r = B[k][j]</code> is kept in a register?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) A block holds 16 ints; stride 2 touches 8 elements per block → 1 miss per 8 accesses = 12.5%. 2) Swap the loops: <code>for (i...) for (j...)</code>. 3) Its inner loop walks A and C down columns (stride n), about two misses per iteration; the register only saves the B access.</p></div>`,
  `<span class="eyebrow">ICS102 · Chương 6 · Bài 6.3</span>
<h2>Viết code thân thiện với cache: thứ tự vòng lặp, nhân ma trận, chia khối</h2>
<p class="lead">Bạn không điều khiển cache trực tiếp được, nhưng bạn điều khiển thứ tự chương trình chạm vào bộ nhớ. Hai quy tắc đơn giản — và các phép đo dưới đây — cho thấy cùng một thuật toán với cùng số phép tính có thể nhanh hoặc chậm <strong>20 lần</strong> chỉ vì thứ tự vòng lặp.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Áp dụng hai quy tắc của code thân thiện cache.</li><li>Dự đoán tỉ lệ trượt của vòng lặp từ bước nhảy.</li><li>Chọn thứ tự vòng lặp tốt nhất cho nhân ma trận và giải thích.</li><li>Giải thích ý tưởng chia khối (tiling).</li></ul>
<h3>📖 Bài giảng</h3>
<h4>Hai quy tắc</h4>
<ol><li><strong>Làm trường hợp phổ biến nhanh</strong>: tập trung vào vòng trong, nơi tiêu gần hết thời gian.</li><li><strong>Giảm trượt trong vòng trong</strong>: dùng lại dữ liệu khi nó còn trong cache (cục bộ thời gian) và truy cập bộ nhớ bước 1 (cục bộ không gian).</li></ol>
<p>Ước lượng nhanh: với khối B byte và phần tử w byte, vòng lặp bước 1 trượt khoảng một lần mỗi B/w lần truy cập (tỉ lệ trượt w/B); vòng lặp có bước ít nhất bằng một khối thì trượt ở mọi lần truy cập (tỉ lệ 100%).</p>
<h3>✍️ Ví dụ 1 — theo hàng và theo cột</h3>
` + C(SRC_CACHE) + `
<p>Chạy thật trên Apple M1 Max (dòng cache 128 byte, bài 1.2):</p>
` + out(OUT_CACHE) + `
<p>Cùng 16,8 triệu phép cộng, cùng kết quả. Duyệt theo hàng đọc các dòng 128 byte tuần tự: một lần trượt mỗi 32 số int, và bộ <strong>nạp trước (prefetcher)</strong> phần cứng nhận ra mẫu nên nạp sẵn. Duyệt theo cột nhảy 16 KiB mỗi bước, nên gần như lần truy cập nào cũng chạm dòng mới, và khi vòng lặp quay lại cột kế tiếp thì các dòng cũ đã bị đẩy ra.</p>
<h3>✍️ Ví dụ 2 — nhân ma trận</h3>
<p>C = A·B với ma trận n × n số double cần n<sup>3</sup> phép nhân-cộng ở mọi thứ tự vòng lặp. Chỉ mẫu truy cập của vòng trong là khác. Ba hàm dưới đây (chương trình đầy đủ có thêm hàm đo giờ và <code>main</code> khởi tạo A = 1, B = 2 rồi đo từng phiên bản):</p>
` + C(SRC_MM) + `
` + out(OUT_MM) + `
<div class="callout"><p><b>Phân tích vòng trong</b> (double 8 byte, khối 64 byte cho số tròn, n lớn):<br>• <b>ijk</b>: A[i][k] theo hàng (bước 1 → 0,125 lần trượt), B[k][j] theo cột (1 lần trượt) → ≈ <b>1,125 lần trượt</b> mỗi vòng.<br>• <b>ikj</b>: B[k][j] và C[i][j] đều theo hàng → 0,125 + 0,125 = ≈ <b>0,25 lần trượt</b>.<br>• <b>jki</b>: A[i][k] và C[i][j] đều theo cột → ≈ <b>2 lần trượt</b>.<br>Dự đoán: ikj &lt; ijk &lt; jki. Phép đo khớp: 0,73 s, 4,86 s, 14,91 s — chênh <b>20 lần</b> với số phép tính y hệt.</p></div>
<h4>Chia khối (tiling)</h4>
<p>Với ma trận rất lớn, kể cả thứ tự tốt vẫn đẩy mất dữ liệu có ích. <strong>Chia khối</strong> tách ma trận thành các ma trận con nhỏ vừa cache rồi nhân từng khối, để mỗi khối đã nạp được dùng lại nhiều lần trước khi bị đẩy. Thư viện tối ưu (BLAS, lõi bên trong NumPy và PyTorch) kết hợp chia khối với SIMD và nhiều bộ tích luỹ (bài 5.4).</p>
<h4>Núi bộ nhớ</h4>
<p>CS:APP đo thông lượng đọc theo kích thước tập làm việc và bước nhảy: một “núi bộ nhớ” 3 chiều với các sống núi ứng với L1, L2, L3, DRAM, và sườn dốc khi bước tăng. Mỗi máy có một núi riêng; trang sinh viên CS:APP có chương trình để vẽ núi của máy bạn.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Đặt chỉ số cột ở vòng ngoài với mảng C (Fortran và MATLAB lưu theo cột, C lưu theo hàng).</li><li>Chỉ đếm số phép tính khi ước lượng tốc độ — trượt cache có thể chiếm phần lớn.</li><li>Đo một lần với cache nguội; hãy chạy nhiều lần và lấy giá trị tốt nhất hoặc trung vị.</li><li>Mảng các struct vs struct các mảng: đọc một trường của nhiều struct lớn phí gần hết mỗi dòng cache.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Tập trung vào vòng trong; dùng lại dữ liệu và dùng bước 1.</li><li>Duyệt hàng vs cột: đo được chênh 6–8 lần.</li><li>Nhân ma trận: ikj (0,25 trượt/vòng) thắng ijk (1,125) thắng jki (2): 0,73 s vs 4,86 s vs 14,91 s.</li><li>Chia khối dùng lại khối đã nằm trong cache; thư viện hiệu năng cao dựa vào nó.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://csapp.cs.cmu.edu/3e/students.html" target="_blank" rel="noopener">Trang sinh viên CS:APP — chương trình vẽ núi bộ nhớ</a></li><li><a href="https://akkadia.org/drepper/cpumemory.pdf" target="_blank" rel="noopener">Ulrich Drepper — What Every Programmer Should Know About Memory (PDF)</a></li><li><a href="https://ocw.mit.edu/courses/6-172-performance-engineering-of-software-systems-fall-2018/" target="_blank" rel="noopener">MIT 6.172 — bài 1 mở đầu đúng bằng thí nghiệm nhân ma trận này</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Ước lượng tỉ lệ trượt của <code>for (i = 0; i &lt; n; i += 2) sum += a[i];</code> với int 4 byte và khối 64 byte.</li><li>Viết lại <code>for (j...) for (i...) b[i][j] = a[i][j] * 2;</code> cho thân thiện cache.</li><li>Vì sao <code>jki</code> vẫn chậm dù <code>r = B[k][j]</code> được giữ trong thanh ghi?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Một khối chứa 16 int; bước 2 chạm 8 phần tử mỗi khối → 1 lần trượt mỗi 8 truy cập = 12,5%. 2) Đổi chỗ vòng lặp: <code>for (i...) for (j...)</code>. 3) Vòng trong của nó duyệt A và C theo cột (bước n), khoảng hai lần trượt mỗi vòng; thanh ghi chỉ tiết kiệm được truy cập B.</p></div>`);

const q6 = QZ(6, 'Quiz — Chapter 6: The memory hierarchy and caches|||Quiz — Chương 6: Phân cấp bộ nhớ và cache', 'Kiểm tra chương 6: SRAM/DRAM/đĩa/SSD, tính cục bộ, loại trượt, tổ chức cache (S, E, B), chia địa chỉ, AMAT, code thân thiện cache.', [
  Q('q1', 'Caches are usually built from|||Cache thường được làm từ',
    ['DRAM|||DRAM', 'SRAM|||SRAM', 'flash memory|||bộ nhớ flash', 'magnetic disks|||đĩa từ'], 1,
    'SRAM is fast and needs no refresh, but is expensive per bit.|||SRAM nhanh, không cần làm tươi, nhưng đắt mỗi bit.'),
  Q('q2', 'For a 7200 RPM disk the average rotational latency is about|||Với đĩa 7200 vòng/phút, độ trễ quay trung bình khoảng',
    ['8.33 ms|||8,33 ms', '4.17 ms|||4,17 ms', '0.02 ms|||0,02 ms', '100 ns|||100 ns'], 1,
    'One rotation = 60/7200 s = 8.33 ms; on average we wait half a rotation.|||Một vòng = 60/7200 s = 8,33 ms; trung bình chờ nửa vòng.'),
  Q('q3', 'In sum += a[i] inside a loop over i, the access a[i] mainly shows|||Trong sum += a[i] ở vòng lặp theo i, truy cập a[i] chủ yếu thể hiện',
    ['temporal locality|||cục bộ thời gian', 'spatial locality|||cục bộ không gian', 'no locality|||không có tính cục bộ', 'conflict misses|||trượt xung đột'], 1,
    'Consecutive elements are next to each other (stride 1).|||Các phần tử liên tiếp nằm cạnh nhau (bước 1).'),
  Q('q4', 'A miss caused because two blocks map to the same set while other sets are empty is a|||Lần trượt do hai khối ánh xạ cùng một tập trong khi các tập khác còn trống là',
    ['cold miss|||trượt nguội', 'capacity miss|||trượt dung lượng', 'conflict miss|||trượt xung đột', 'hit|||trúng'], 2,
    'The cache had room; the placement rule caused the eviction.|||Cache còn chỗ; luật đặt khối gây ra việc đẩy ra.'),
  Q('q5', 'Cache with S = 64 sets, E = 4 lines, B = 64 bytes. Capacity?|||Cache với S = 64 tập, E = 4 dòng, B = 64 byte. Dung lượng?',
    ['4 KiB|||4 KiB', '16 KiB|||16 KiB', '64 KiB|||64 KiB', '256 KiB|||256 KiB'], 1,
    '64 × 4 × 64 = 16384 bytes.|||64 × 4 × 64 = 16384 byte.'),
  Q('q6', 'With 32-bit addresses, B = 32 bytes and S = 128 sets, the number of tag bits is|||Với địa chỉ 32 bit, B = 32 byte và S = 128 tập, số bit tag là',
    ['20|||20', '21|||21', '25|||25', '27|||27'], 0,
    'b = 5, s = 7, t = 32 − 7 − 5 = 20.|||b = 5, s = 7, t = 32 − 7 − 5 = 20.'),
  Q('q7', 'The set index is taken from|||Chỉ số tập được lấy từ',
    ['the highest address bits|||các bit địa chỉ cao nhất', 'the middle bits, between tag and block offset|||các bit giữa, nằm giữa tag và độ dời', 'the lowest bits|||các bit thấp nhất', 'a random hash|||một hàm băm ngẫu nhiên'], 1,
    'Using middle bits spreads consecutive blocks over different sets.|||Dùng bit giữa giúp các khối liên tiếp rải ra nhiều tập.'),
  Q('q8', 'Hit time 1 cycle, miss penalty 100 cycles: AMAT at 97% hits vs 99% hits|||Thời gian trúng 1 chu kỳ, chi phí trượt 100 chu kỳ: AMAT khi trúng 97% so với 99%',
    ['4 vs 2 cycles|||4 so với 2 chu kỳ', '97 vs 99 cycles|||97 so với 99 chu kỳ', '3 vs 1 cycles|||3 so với 1 chu kỳ', 'the same|||như nhau'], 0,
    '1 + 0.03·100 = 4; 1 + 0.01·100 = 2.|||1 + 0,03·100 = 4; 1 + 0,01·100 = 2.'),
  Q('q9', 'For C arrays, which loop nest sums a[i][j] fastest?|||Với mảng C, cặp vòng lặp nào tính tổng a[i][j] nhanh nhất?',
    ['for j { for i { … } }|||for j { for i { … } }', 'for i { for j { … } }|||for i { for j { … } }', 'both equal|||như nhau', 'depends only on the compiler|||chỉ phụ thuộc trình biên dịch'], 1,
    'C is row-major: j in the inner loop gives stride 1 (measured 6–8× faster).|||C lưu theo hàng: j ở vòng trong cho bước 1 (đo được nhanh hơn 6–8 lần).'),
  Q('q10', 'Among ijk, ikj and jki matrix multiplication, the fastest in our measurement was|||Trong ba thứ tự ijk, ikj và jki của nhân ma trận, nhanh nhất trong phép đo là',
    ['ijk|||ijk', 'ikj|||ikj', 'jki|||jki', 'all the same|||như nhau'], 1,
    'ikj: B and C are both walked row-wise (≈0.25 misses/iteration); 0.73 s vs 4.86 s and 14.91 s.|||ikj: B và C đều duyệt theo hàng (≈0,25 trượt/vòng); 0,73 s so với 4,86 s và 14,91 s.'),
]);

const ch6 = {
  title: 'Chapter 6 — The memory hierarchy and caches|||Chương 6 — Phân cấp bộ nhớ và cache',
  description: 'Công nghệ lưu trữ, tính cục bộ, các loại trượt; tổ chức cache (S, E, B), chia địa chỉ, mô phỏng cache trực tiếp, AMAT; code thân thiện cache với số đo thật (hàng vs cột, nhân ma trận ba thứ tự) (CS:APP chương 6).',
  lessons: [c61, c62, c63, q6],
};

// ───────────────────────────── Chương 7 — Liên kết ─────────────────────────────
const SRC_COUNTER = String.raw`
static int count = 0;            /* static: local symbol, invisible to other files */
int limit = 100;                 /* global, initialised (non-zero) -> .data */
int buffer[1000];                /* global, uninitialised -> .bss */
extern int verbose;              /* defined in another file -> undefined here */
static int bump(void) { return ++count; }
int next_id(void) { if (verbose) buffer[0]++; return count < limit ? bump() : -1; }
`;
const OUT_COUNTER = String.raw`
$ clang -target x86_64-pc-linux-gnu -O1 -fno-pic -c counter.c -o counter.o
$ nm counter.o
0000000000000000 B buffer
0000000000000fa0 b count
0000000000000000 D limit
0000000000000000 T next_id
                 U verbose
$ objdump -h counter.o          # (selected lines)
  2 .text           0000002d 0000000000000000 TEXT
  3 .rela.text      00000078 0000000000000000
  4 .data           00000004 0000000000000000 DATA
  5 .bss            00000fa4 0000000000000000 BSS
`;

const c71 = L('ics102-ts-7-1',
  '7.1 — Compiler drivers, object files and symbols|||7.1 — Trình điều khiển biên dịch, tệp đối tượng và ký hiệu',
  'Vì sao cần liên kết (biên dịch riêng từng tệp), ba loại tệp đối tượng, các section của ELF (.text .rodata .data .bss .symtab .rela.text), ba loại ký hiệu (toàn cục, ngoài, cục bộ), từ khoá static; nm và objdump chạy thật.',
  `<span class="eyebrow">ICS102 · Chapter 7 · Lesson 7.1</span>
<h2>Compiler drivers, object files and symbols</h2>
<p class="lead">Real programs are made of many source files and libraries. <strong>Linking</strong> combines separately compiled pieces into one executable. When it goes wrong you get cryptic errors — “undefined reference”, “multiple definition” — or, worse, a program that links but behaves strangely. This chapter makes those errors understandable.</p>
<h3>🎯 Objectives</h3>
<ul><li>Explain why separate compilation and linking exist.</li><li>Name the three kinds of object files.</li><li>Describe the main sections of an ELF relocatable object file.</li><li>Classify symbols as global, external or local, and use <code>nm</code> to see them.</li></ul>
<h3>📖 Lecture</h3>
<h4>Why linkers?</h4>
<ul>
<li><strong>Modularity</strong>: a program can be split into files and libraries (e.g. the C standard library, maths library).</li>
<li><strong>Efficiency</strong>: change one file → recompile only that file, then relink. Libraries are compiled once and reused by everyone.</li>
</ul>
<p>The compiler driver (<code>gcc</code>) runs cpp, cc1 and as on each source file, producing one <code>.o</code> per file, then calls the linker <code>ld</code> to combine them with the C runtime start-up code and libraries. The linker does two jobs: <strong>symbol resolution</strong> (connect each symbol reference to exactly one definition) and <strong>relocation</strong> (give code and data their final addresses and patch every reference).</p>
<h4>Three kinds of object files</h4>
<ul>
<li><strong>Relocatable</strong> (<code>.o</code>): code and data that can be combined with others at link time.</li>
<li><strong>Executable</strong> (<code>a.out</code>): ready to be copied into memory and run.</li>
<li><strong>Shared</strong> (<code>.so</code> on Linux, <code>.dylib</code> on macOS, <code>.dll</code> on Windows): loaded and linked at load time or run time (lesson 7.3).</li>
</ul>
<p>Formats: <strong>ELF</strong> on Linux/Unix, Mach-O on macOS, PE on Windows. Same ideas everywhere.</p>
<h4>Sections of an ELF relocatable file</h4>
<div class="formula"><span class="lbl">Main sections</span>.text — machine code · .rodata — read-only data (string literals, jump tables) · .data — initialised global/static variables · .bss — uninitialised (or zero) global/static variables: take <b>no space in the file</b>, only a size · .symtab — symbol table · .rela.text / .rela.data — relocation entries · .debug, .line — only with -g · .strtab — names</div>
<h4>Symbols</h4>
<ul>
<li><strong>Global symbols</strong> defined in this module and usable by others: non-static functions and global variables.</li>
<li><strong>External symbols</strong> referenced here but defined elsewhere (declared <code>extern</code> or simply called).</li>
<li><strong>Local symbols</strong> defined and used only here: <code>static</code> functions and <code>static</code> variables. In C, <code>static</code> at file level means “private to this file” — the C way of hiding implementation details. (Ordinary local variables inside functions are on the stack and are not symbols at all.)</li>
</ul>
<h3>✍️ Worked example</h3>
` + C(SRC_COUNTER) + `
<p>Real output (x86-64 ELF object, inspected with the LLVM <code>nm</code>/<code>objdump</code> shipped with Xcode):</p>
` + out(OUT_COUNTER) + `
<p>Read the <code>nm</code> letters: <b>T</b> = text (code), <b>D</b> = initialised data, <b>B</b> = bss, <b>U</b> = undefined (external), and lowercase = local. <code>count</code> is lowercase <b>b</b> — local, thanks to <code>static</code>. <code>bump</code> does not appear: it was static and inlined into <code>next_id</code>. The .data section is exactly 4 bytes (<code>limit</code>), while .bss is 0xfa4 = 4004 bytes (buffer + count) yet occupies no space in the file. <code>.rela.text</code> holds the places in the code that must be patched (lesson 7.2).</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Defining (not just declaring) a global variable in a header file that many .c files include → multiple definitions.</li><li>Thinking <code>static</code> inside a function and <code>static</code> at file level mean the same: the first gives a variable that keeps its value between calls, both are local symbols, but they solve different problems.</li><li>Forgetting that .bss variables are zero-initialised by the loader.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Linker = symbol resolution + relocation.</li><li>Relocatable, executable, shared object files; ELF on Linux.</li><li>.text, .rodata, .data, .bss, .symtab, .rela.* are the key sections.</li><li>Global (T/D/B), external (U), local (static, lowercase in nm).</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Executable_and_Linkable_Format" target="_blank" rel="noopener">Wikipedia — Executable and Linkable Format (ELF)</a></li><li><a href="https://man7.org/linux/man-pages/man5/elf.5.html" target="_blank" rel="noopener">elf(5) — Linux manual page</a></li><li><a href="https://man7.org/linux/man-pages/man1/nm.1.html" target="_blank" rel="noopener">nm(1) — Linux manual page (symbol letters)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>For <code>int x = 5; int y; static int z = 1; extern int w; void f(void) { static int k; }</code>, give the nm letter and section of x, y, z, w, k.</li><li>Why does .bss take no space in the object file?</li><li>Which of these produces a linker error rather than a compiler error: a missing semicolon, a call to an undefined function, a wrong argument type?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) x: D (.data); y: B (.bss; some older compilers put it in COMMON, letter C); z: d (local, .data); w: U; k: b (local, .bss). 2) Its contents are all zeros; the file only records the size, and the loader allocates zeroed memory. 3) The call to an undefined function (the compiler only needs a declaration; the linker finds no definition).</p></div>`,
  `<span class="eyebrow">ICS102 · Chương 7 · Bài 7.1</span>
<h2>Trình điều khiển biên dịch, tệp đối tượng và ký hiệu</h2>
<p class="lead">Chương trình thật gồm nhiều tệp nguồn và thư viện. <strong>Liên kết (linking)</strong> ghép các mảnh được biên dịch riêng thành một tệp thực thi. Khi hỏng, bạn nhận lỗi khó hiểu — “undefined reference”, “multiple definition” — hoặc tệ hơn, chương trình liên kết được nhưng chạy kỳ quặc. Chương này giúp hiểu những lỗi đó.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Giải thích vì sao có biên dịch riêng và liên kết.</li><li>Kể tên ba loại tệp đối tượng.</li><li>Mô tả các section chính của tệp đối tượng khả định vị ELF.</li><li>Phân loại ký hiệu toàn cục, ngoài, cục bộ, và dùng <code>nm</code> để xem chúng.</li></ul>
<h3>📖 Bài giảng</h3>
<h4>Vì sao cần bộ liên kết?</h4>
<ul>
<li><strong>Tính mô-đun</strong>: chương trình chia được thành tệp và thư viện (vd thư viện chuẩn C, thư viện toán).</li>
<li><strong>Hiệu quả</strong>: sửa một tệp → chỉ biên dịch lại tệp đó rồi liên kết lại. Thư viện biên dịch một lần, ai cũng dùng lại.</li>
</ul>
<p>Trình điều khiển biên dịch (<code>gcc</code>) chạy cpp, cc1 và as trên từng tệp nguồn, tạo một <code>.o</code> cho mỗi tệp, rồi gọi bộ liên kết <code>ld</code> ghép chúng với mã khởi động của C runtime và các thư viện. Bộ liên kết làm hai việc: <strong>phân giải ký hiệu</strong> (nối mỗi tham chiếu ký hiệu với đúng một định nghĩa) và <strong>định vị lại (relocation)</strong> (gán địa chỉ cuối cùng cho mã, dữ liệu và vá mọi tham chiếu).</p>
<h4>Ba loại tệp đối tượng</h4>
<ul>
<li><strong>Khả định vị</strong> (<code>.o</code>): mã và dữ liệu có thể ghép với tệp khác lúc liên kết.</li>
<li><strong>Thực thi</strong> (<code>a.out</code>): sẵn sàng chép vào bộ nhớ và chạy.</li>
<li><strong>Dùng chung</strong> (<code>.so</code> trên Linux, <code>.dylib</code> trên macOS, <code>.dll</code> trên Windows): được nạp và liên kết lúc nạp hoặc lúc chạy (bài 7.3).</li>
</ul>
<p>Định dạng: <strong>ELF</strong> trên Linux/Unix, Mach-O trên macOS, PE trên Windows. Ý tưởng như nhau.</p>
<h4>Các section của tệp ELF khả định vị</h4>
<div class="formula"><span class="lbl">Section chính</span>.text — mã máy · .rodata — dữ liệu chỉ đọc (chuỗi hằng, bảng nhảy) · .data — biến toàn cục/static có khởi tạo · .bss — biến toàn cục/static chưa khởi tạo (hoặc bằng 0): <b>không chiếm chỗ trong tệp</b>, chỉ ghi kích thước · .symtab — bảng ký hiệu · .rela.text / .rela.data — mục định vị lại · .debug, .line — chỉ khi có -g · .strtab — tên</div>
<h4>Ký hiệu</h4>
<ul>
<li><strong>Ký hiệu toàn cục</strong> định nghĩa trong mô-đun này và mô-đun khác dùng được: hàm và biến toàn cục không static.</li>
<li><strong>Ký hiệu ngoài</strong> được tham chiếu ở đây nhưng định nghĩa nơi khác (khai báo <code>extern</code> hoặc đơn giản là được gọi).</li>
<li><strong>Ký hiệu cục bộ</strong> định nghĩa và chỉ dùng ở đây: hàm <code>static</code> và biến <code>static</code>. Trong C, <code>static</code> ở mức tệp nghĩa là “riêng của tệp này” — cách của C để giấu chi tiết hiện thực. (Biến cục bộ thường trong hàm nằm trên ngăn xếp và hoàn toàn không phải ký hiệu.)</li>
</ul>
<h3>✍️ Ví dụ</h3>
` + C(SRC_COUNTER) + `
<p>Output thật (tệp đối tượng ELF x86-64, xem bằng <code>nm</code>/<code>objdump</code> của LLVM đi kèm Xcode):</p>
` + out(OUT_COUNTER) + `
<p>Đọc chữ cái của <code>nm</code>: <b>T</b> = text (mã), <b>D</b> = dữ liệu có khởi tạo, <b>B</b> = bss, <b>U</b> = chưa định nghĩa (ngoài), chữ thường = cục bộ. <code>count</code> là chữ thường <b>b</b> — cục bộ, nhờ <code>static</code>. <code>bump</code> không xuất hiện: nó là static và đã được inline vào <code>next_id</code>. Section .data đúng 4 byte (<code>limit</code>), còn .bss là 0xfa4 = 4004 byte (buffer + count) nhưng không chiếm chỗ trong tệp. <code>.rela.text</code> chứa các vị trí trong mã cần vá (bài 7.2).</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Định nghĩa (không chỉ khai báo) biến toàn cục trong tệp header mà nhiều tệp .c cùng include → định nghĩa trùng.</li><li>Tưởng <code>static</code> trong hàm và <code>static</code> ở mức tệp giống nhau: cái đầu cho biến giữ giá trị giữa các lần gọi, cả hai đều là ký hiệu cục bộ, nhưng giải quyết vấn đề khác nhau.</li><li>Quên rằng biến .bss được bộ nạp khởi tạo bằng 0.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Bộ liên kết = phân giải ký hiệu + định vị lại.</li><li>Tệp đối tượng khả định vị, thực thi, dùng chung; ELF trên Linux.</li><li>.text, .rodata, .data, .bss, .symtab, .rela.* là các section then chốt.</li><li>Toàn cục (T/D/B), ngoài (U), cục bộ (static, chữ thường trong nm).</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Executable_and_Linkable_Format" target="_blank" rel="noopener">Wikipedia — Định dạng ELF</a></li><li><a href="https://man7.org/linux/man-pages/man5/elf.5.html" target="_blank" rel="noopener">elf(5) — man page Linux</a></li><li><a href="https://man7.org/linux/man-pages/man1/nm.1.html" target="_blank" rel="noopener">nm(1) — man page Linux (ý nghĩa các chữ cái)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Với <code>int x = 5; int y; static int z = 1; extern int w; void f(void) { static int k; }</code>, cho chữ cái nm và section của x, y, z, w, k.</li><li>Vì sao .bss không chiếm chỗ trong tệp đối tượng?</li><li>Cái nào gây lỗi liên kết chứ không phải lỗi biên dịch: thiếu dấu chấm phẩy, gọi hàm chưa định nghĩa, sai kiểu đối số?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) x: D (.data); y: B (.bss; vài trình biên dịch cũ đặt vào COMMON, chữ C); z: d (cục bộ, .data); w: U; k: b (cục bộ, .bss). 2) Nội dung toàn số 0; tệp chỉ ghi kích thước, bộ nạp cấp vùng nhớ đã xoá về 0. 3) Gọi hàm chưa định nghĩa (trình biên dịch chỉ cần khai báo; bộ liên kết không tìm thấy định nghĩa).</p></div>`);

const OUT_RELOC = String.raw`
$ clang -target x86_64-pc-linux-gnu -O1 -fno-pic -fno-optimize-sibling-calls -c main.c -o main.o
$ nm main.o
0000000000000000 D array
0000000000000000 T main
                 U sum
$ objdump -dr --no-show-raw-insn main.o
0000000000000000 <main>:
       0:      	pushq	%rax
       1:      	movl	$0x0, %edi
		0000000000000002:  R_X86_64_32	array
       6:      	movl	$0x2, %esi
       b:      	callq	0x10 <main+0x10>
		000000000000000c:  R_X86_64_PLT32	sum-0x4
      10:      	popq	%rcx
      11:      	retq
`;
const OUT_LIBS = String.raw`
$ cc dup1.c dup2.c -o dup             # both files contain: int x = ...;
duplicate symbol '_x' in:
    /private/var/folders/vz/1ssh970n4wgfbntrn0y6mz4m0000gn/T/dup2-a5a822.o
    /private/var/folders/vz/1ssh970n4wgfbntrn0y6mz4m0000gn/T/dup1-1f9548.o
ld: 1 duplicate symbols
clang: error: linker command failed with exit code 1 (use -v to see invocation)
$ cc -c addvec.c multvec.c && ar rcs libvector.a addvec.o multvec.o && ar t libvector.a
__.SYMDEF SORTED
addvec.o
multvec.o
$ cc main2.c -L. -lvector -o prog2c && ./prog2c
z = [4 6]
$ nm prog2c | grep -E "addvec|multvec"
00000001000005bc T _addvec
`;

const c72 = L('ics102-ts-7-2',
  '7.2 — Symbol resolution, static libraries and relocation|||7.2 — Phân giải ký hiệu, thư viện tĩnh và định vị lại',
  'Ký hiệu mạnh/yếu và ba luật xử lý trùng tên, lỗi duplicate symbol thật, thư viện tĩnh (ar) chỉ kéo vào mô-đun cần dùng, thứ tự thư viện trên dòng lệnh GNU ld, mục định vị lại R_X86_64_32 và PLT32 đọc từ objdump thật, tính địa chỉ vá.',
  `<span class="eyebrow">ICS102 · Chapter 7 · Lesson 7.2</span>
<h2>Symbol resolution, static libraries and relocation</h2>
<p class="lead">The linker's two jobs in detail. Resolution decides which definition each name refers to — including what happens when two files define the same name. Relocation then merges the sections, assigns run-time addresses, and patches every instruction that refers to a symbol.</p>
<h3>🎯 Objectives</h3>
<ul><li>Apply the rules for strong and weak symbols.</li><li>Build and use a static library, and explain why only needed members are linked.</li><li>Explain why the order of libraries on the command line matters with GNU ld.</li><li>Read relocation entries and compute a patched address.</li></ul>
<h3>📖 Lecture</h3>
<h4>Duplicate names: strong and weak symbols</h4>
<p>Functions and initialised globals are <strong>strong</strong>; uninitialised globals were traditionally <strong>weak</strong> (“COMMON”). Classic Unix rules: (1) two strong symbols with the same name → link error; (2) one strong and several weak → choose the strong one; (3) several weak → choose any one. Rules 2 and 3 cause silent bugs, e.g. <code>int x;</code> in one file and <code>double x;</code> in another: writes to the double overwrite neighbouring data. Since GCC 10 the default is <code>-fno-common</code>, which treats uninitialised globals as strong definitions, turning such bugs into errors — good. Best practice: one definition in one .c file, <code>extern</code> declarations in the header, and <code>static</code> for everything private.</p>
<h4>Static libraries</h4>
<p>A static library (<code>.a</code>, “archive”) is a collection of relocatable object files packed with <code>ar</code>, plus an index. When the linker scans an archive it copies <strong>only the members that define a symbol still undefined</strong> — so linking with the whole C library does not put all of it in your program.</p>
<p>GNU ld (Linux) scans files and libraries <strong>left to right, once</strong>, keeping a set of unresolved symbols. A library is useful only if some earlier file needs it. So <code>gcc main.o -lvector</code> works, but <code>gcc -lvector main.o</code> fails with “undefined reference to addvec”, because when libvector was scanned nothing needed addvec yet. Rule: put libraries <strong>after</strong> the objects that use them (repeat a library if there are cycles). Note: Apple's linker on macOS does not have this ordering restriction.</p>
<h4>Relocation</h4>
<ol><li><strong>Merge</strong> sections of the same type (all .text together, all .data together) and assign run-time addresses to sections and symbols.</li><li><strong>Patch references</strong> using the relocation entries the assembler left behind.</li></ol>
<p>Two common x86-64 relocation types: <code>R_X86_64_32</code> / <code>R_X86_64_64</code> — <strong>absolute</strong>: write the symbol's address; <code>R_X86_64_PC32</code> / <code>PLT32</code> — <strong>PC-relative</strong>: write (target address − address of the next instruction), as used by <code>call</code>.</p>
<h3>✍️ Worked example 1 — relocations in main.o (CS:APP's main.c/sum.c)</h3>
` + C(String.raw`
/* main.c */                          /* sum.c */
int sum(int *a, int n);               int sum(int *a, int n) {
int array[2] = {1, 2};                    int i, s = 0;
int main(void) {                          for (i = 0; i < n; i++) s += a[i];
    int val = sum(array, 2);              return s;
    return val;                       }
}
`) + `
` + out(OUT_RELOC) + `
<div class="callout"><p><b>Patch by hand.</b> Suppose the linker places main's .text at 0x401000 and sum at 0x401020.<br>• The absolute relocation at offset 2 receives the address of <code>array</code> (say 0x404028): the bytes of <code>movl $0x0, %edi</code> become <code>movl $0x404028, %edi</code>.<br>• The PC-relative <code>call</code> at offset 0xb: its 4-byte field is at 0x401000 + 0xc. The next instruction starts at 0x401000 + 0x10. Value = target − next = 0x401020 − 0x401010 = <b>0x10</b>. (The “−0x4” addend in the entry is exactly this correction: the field ends 4 bytes after its start.)</p></div>
<h3>✍️ Worked example 2 — duplicate definitions and a static library (macOS, real output)</h3>
` + out(OUT_LIBS) + `
<p>The duplicate <code>int x</code> definitions are rejected. In the library case only <code>addvec.o</code> was copied into the executable; <code>multvec</code> is absent because nothing referenced it.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Putting <code>-lm</code> or other libraries before your source files on Linux.</li><li>Defining globals in headers; relying on weak-symbol merging.</li><li>Expecting a static library to change behaviour after it is updated without relinking — the code was copied in.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Strong/weak rules; modern GCC (-fno-common) makes duplicates errors.</li><li>Static libraries contribute only the members that resolve undefined symbols.</li><li>GNU ld scans left to right: libraries after the objects that need them.</li><li>Relocation: absolute (write the address) or PC-relative (target − next instruction).</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Linker_(computing)" target="_blank" rel="noopener">Wikipedia — Linker (computing)</a></li><li><a href="https://sourceware.org/binutils/docs/ld/" target="_blank" rel="noopener">GNU ld manual</a></li><li><a href="https://man7.org/linux/man-pages/man1/ar.1.html" target="_blank" rel="noopener">ar(1) — create and inspect static libraries</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>p.o calls a function in libx.a, which calls a function in liby.a. Give a working GNU ld command.</li><li>A <code>call</code> at address 0x4004e3 has its 4-byte target field at 0x4004e4; the target function is at 0x4004f0. What value is stored in the field?</li><li>Why does the executable not contain <code>multvec</code>?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) <code>gcc p.o libx.a liby.a</code> (or with -L and -lx -ly in that order). 2) Next instruction = 0x4004e4 + 4 = 0x4004e8; value = 0x4004f0 − 0x4004e8 = 0x8. 3) No object referenced it, so the linker never copied multvec.o out of the archive.</p></div>`,
  `<span class="eyebrow">ICS102 · Chương 7 · Bài 7.2</span>
<h2>Phân giải ký hiệu, thư viện tĩnh và định vị lại</h2>
<p class="lead">Hai việc của bộ liên kết, chi tiết. Phân giải quyết định mỗi cái tên trỏ tới định nghĩa nào — kể cả khi hai tệp định nghĩa cùng một tên. Định vị lại sau đó gộp các section, gán địa chỉ lúc chạy và vá mọi lệnh tham chiếu tới ký hiệu.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Áp dụng luật ký hiệu mạnh và yếu.</li><li>Dựng và dùng thư viện tĩnh, giải thích vì sao chỉ thành viên cần dùng được liên kết vào.</li><li>Giải thích vì sao thứ tự thư viện trên dòng lệnh quan trọng với GNU ld.</li><li>Đọc mục định vị lại và tính địa chỉ cần vá.</li></ul>
<h3>📖 Bài giảng</h3>
<h4>Tên trùng: ký hiệu mạnh và yếu</h4>
<p>Hàm và biến toàn cục có khởi tạo là <strong>mạnh</strong>; biến toàn cục chưa khởi tạo theo truyền thống là <strong>yếu</strong> (“COMMON”). Luật Unix kinh điển: (1) hai ký hiệu mạnh cùng tên → lỗi liên kết; (2) một mạnh và nhiều yếu → chọn cái mạnh; (3) nhiều yếu → chọn bất kỳ một cái. Luật 2 và 3 gây lỗi âm thầm, vd <code>int x;</code> ở tệp này và <code>double x;</code> ở tệp kia: ghi vào double sẽ đè dữ liệu bên cạnh. Từ GCC 10 mặc định là <code>-fno-common</code>, coi biến toàn cục chưa khởi tạo là định nghĩa mạnh, biến các lỗi như vậy thành lỗi báo ngay — tốt. Thực hành tốt: một định nghĩa trong một tệp .c, khai báo <code>extern</code> trong header, và <code>static</code> cho mọi thứ riêng tư.</p>
<h4>Thư viện tĩnh</h4>
<p>Thư viện tĩnh (<code>.a</code>, “archive”) là tập các tệp đối tượng khả định vị đóng gói bằng <code>ar</code>, kèm một bảng chỉ mục. Khi quét một archive, bộ liên kết chỉ chép <strong>những thành viên định nghĩa ký hiệu còn đang chưa giải quyết</strong> — nên liên kết với cả thư viện C không đưa toàn bộ thư viện vào chương trình của bạn.</p>
<p>GNU ld (Linux) quét các tệp và thư viện <strong>từ trái sang phải, một lần</strong>, giữ một tập ký hiệu chưa giải quyết. Một thư viện chỉ có ích nếu tệp nào đó đứng trước cần nó. Vì thế <code>gcc main.o -lvector</code> chạy, còn <code>gcc -lvector main.o</code> lỗi “undefined reference to addvec”, vì lúc quét libvector chưa ai cần addvec. Quy tắc: đặt thư viện <strong>sau</strong> các tệp đối tượng dùng nó (lặp lại thư viện nếu có phụ thuộc vòng). Lưu ý: bộ liên kết của Apple trên macOS không có ràng buộc thứ tự này.</p>
<h4>Định vị lại</h4>
<ol><li><strong>Gộp</strong> các section cùng loại (mọi .text với nhau, mọi .data với nhau) và gán địa chỉ lúc chạy cho section và ký hiệu.</li><li><strong>Vá tham chiếu</strong> dựa vào các mục định vị lại mà trình hợp dịch để lại.</li></ol>
<p>Hai kiểu định vị lại x86-64 thường gặp: <code>R_X86_64_32</code> / <code>R_X86_64_64</code> — <strong>tuyệt đối</strong>: ghi địa chỉ của ký hiệu; <code>R_X86_64_PC32</code> / <code>PLT32</code> — <strong>tương đối theo PC</strong>: ghi (địa chỉ đích − địa chỉ lệnh kế tiếp), như lệnh <code>call</code> dùng.</p>
<h3>✍️ Ví dụ 1 — các mục định vị lại trong main.o (main.c/sum.c của CS:APP)</h3>
` + C(String.raw`
/* main.c */                          /* sum.c */
int sum(int *a, int n);               int sum(int *a, int n) {
int array[2] = {1, 2};                    int i, s = 0;
int main(void) {                          for (i = 0; i < n; i++) s += a[i];
    int val = sum(array, 2);              return s;
    return val;                       }
}
`) + `
` + out(OUT_RELOC) + `
<div class="callout"><p><b>Vá bằng tay.</b> Giả sử bộ liên kết đặt .text của main ở 0x401000 và sum ở 0x401020.<br>• Mục tuyệt đối ở độ dời 2 nhận địa chỉ của <code>array</code> (giả sử 0x404028): các byte của <code>movl $0x0, %edi</code> thành <code>movl $0x404028, %edi</code>.<br>• Lệnh <code>call</code> tương đối PC ở độ dời 0xb: trường 4 byte của nó nằm ở 0x401000 + 0xc. Lệnh kế tiếp bắt đầu ở 0x401000 + 0x10. Giá trị = đích − lệnh kế = 0x401020 − 0x401010 = <b>0x10</b>. (Hạng tử “−0x4” trong mục chính là phần hiệu chỉnh này: trường kết thúc 4 byte sau điểm bắt đầu.)</p></div>
<h3>✍️ Ví dụ 2 — định nghĩa trùng và thư viện tĩnh (macOS, output thật)</h3>
` + out(OUT_LIBS) + `
<p>Hai định nghĩa <code>int x</code> trùng nhau bị từ chối. Ở trường hợp thư viện, chỉ <code>addvec.o</code> được chép vào tệp thực thi; <code>multvec</code> vắng mặt vì không ai tham chiếu nó.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Đặt <code>-lm</code> hay thư viện khác trước tệp nguồn trên Linux.</li><li>Định nghĩa biến toàn cục trong header; trông cậy vào việc gộp ký hiệu yếu.</li><li>Mong thư viện tĩnh được cập nhật thì chương trình đổi hành vi mà không liên kết lại — mã đã được chép vào.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Luật mạnh/yếu; GCC hiện đại (-fno-common) biến trùng lặp thành lỗi.</li><li>Thư viện tĩnh chỉ góp các thành viên giải quyết ký hiệu còn thiếu.</li><li>GNU ld quét trái sang phải: thư viện đặt sau tệp đối tượng cần nó.</li><li>Định vị lại: tuyệt đối (ghi địa chỉ) hoặc tương đối PC (đích − lệnh kế).</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Linker_(computing)" target="_blank" rel="noopener">Wikipedia — Bộ liên kết</a></li><li><a href="https://sourceware.org/binutils/docs/ld/" target="_blank" rel="noopener">Tài liệu GNU ld</a></li><li><a href="https://man7.org/linux/man-pages/man1/ar.1.html" target="_blank" rel="noopener">ar(1) — tạo và xem thư viện tĩnh</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>p.o gọi một hàm trong libx.a, hàm đó gọi một hàm trong liby.a. Viết lệnh GNU ld chạy được.</li><li>Một lệnh <code>call</code> ở địa chỉ 0x4004e3 có trường đích 4 byte ở 0x4004e4; hàm đích ở 0x4004f0. Giá trị lưu trong trường là gì?</li><li>Vì sao tệp thực thi không chứa <code>multvec</code>?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) <code>gcc p.o libx.a liby.a</code> (hoặc dùng -L và -lx -ly đúng thứ tự đó). 2) Lệnh kế = 0x4004e4 + 4 = 0x4004e8; giá trị = 0x4004f0 − 0x4004e8 = 0x8. 3) Không đối tượng nào tham chiếu nó, nên bộ liên kết không chép multvec.o ra khỏi archive.</p></div>`);

const SRC_DLL = String.raw`
#include <stdio.h>
#include <dlfcn.h>
int main(void) {
    void *handle = dlopen("./libvector.dylib", RTLD_LAZY);   /* libvector.so on Linux */
    if (!handle) { fprintf(stderr, "%s\n", dlerror()); return 1; }
    void (*addvec)(int *, int *, int *, int) = (void (*)(int *, int *, int *, int)) dlsym(handle, "addvec");
    if (!addvec) { fprintf(stderr, "%s\n", dlerror()); return 1; }
    int x[2] = {1, 2}, y[2] = {3, 4}, z[2];
    addvec(x, y, z, 2);
    printf("z = [%d %d] (addvec loaded at run time from %p)\n", z[0], z[1], (void *)addvec);
    dlclose(handle);
    return 0;
}
`;
const OUT_SHARED = String.raw`
$ cc -shared -fPIC addvec.c multvec.c -o libvector.dylib     # Linux: gcc -shared -fpic ... -o libvector.so
$ cc main2.c -L. -lvector -o prog2l && ./prog2l
z = [4 6]
$ otool -L prog2l                                            # Linux: ldd prog2l
prog2l:
	libvector.dylib (compatibility version 0.0.0, current version 0.0.0)
	/usr/lib/libSystem.B.dylib (compatibility version 1.0.0, current version 1359.40.3)
$ nm -u prog2l                                               # still undefined: resolved at load time
_addvec
_printf
$ cc -O1 dll.c -o dll && ./dll
z = [4 6] (addvec loaded at run time from 0x102c382d0)
`;

const c73 = L('ics102-ts-7-3',
  '7.3 — Loading, shared libraries, dynamic linking and position-independent code|||7.3 — Nạp chương trình, thư viện dùng chung, liên kết động và mã độc lập vị trí',
  'Tệp thực thi và bộ nạp (execve, ánh xạ segment, _start), nhược điểm thư viện tĩnh, thư viện dùng chung .so/.dylib, liên kết động lúc nạp và lúc chạy (dlopen chạy thật), mã độc lập vị trí PIC với GOT/PLT, gắn nối thư viện (interpositioning).',
  `<span class="eyebrow">ICS102 · Chapter 7 · Lesson 7.3</span>
<h2>Loading, shared libraries, dynamic linking and position-independent code</h2>
<p class="lead">Almost every program you run today is dynamically linked: the C library, graphics, crypto and maths code are shared by hundreds of processes and updated without recompiling anything. This lesson explains how an executable is loaded, why shared libraries exist, and the clever trick — position-independent code — that makes them work.</p>
<h3>🎯 Objectives</h3>
<ul><li>Describe how the loader starts a program.</li><li>List the drawbacks of static libraries that shared libraries solve.</li><li>Distinguish load-time and run-time dynamic linking, and use <code>dlopen</code>.</li><li>Explain PIC, the GOT and the PLT at a high level.</li></ul>
<h3>📖 Lecture</h3>
<h4>Loading an executable</h4>
<p>When you run <code>./prog</code>, the shell calls <code>execve</code> (chapter 8). The <strong>loader</strong> in the kernel reads the program header table of the ELF executable, which says which parts of the file become which memory segments: a read-only code segment (.init, .text, .rodata) and a read/write data segment (.data, .bss zero-filled). It sets up the user stack and heap regions, then jumps to the entry point <code>_start</code> (C runtime start-up code), which calls <code>__libc_start_main</code>, which calls <code>main</code>. The copying is lazy: pages are mapped and brought in from disk only when first touched (chapter 9).</p>
<h4>Why shared libraries?</h4>
<ul><li>Static linking copies library code into every executable: wasted disk and memory (every process would hold its own copy of printf).</li><li>Fixing a bug in a static library requires relinking every program that uses it.</li></ul>
<p>A <strong>shared library</strong> (<code>.so</code>) is linked at <strong>load time</strong> or <strong>run time</strong> by the <strong>dynamic linker</strong> (<code>ld-linux.so</code> on Linux). Only one copy of its code is in physical memory, shared by all processes; its .data is private to each process.</p>
<h4>Two ways to use a shared library</h4>
<ul>
<li><strong>Load-time linking</strong>: link with <code>-lvector</code> as usual. The executable records that it needs libvector; references stay undefined until the dynamic linker resolves them when the program starts.</li>
<li><strong>Run-time linking</strong>: the program itself calls <code>dlopen</code>/<code>dlsym</code>/<code>dlclose</code> to load a library by name while it runs — how plug-ins, Python extension modules and web-server modules work.</li>
</ul>
<h4>Position-independent code (PIC)</h4>
<p>A shared library must work at whatever address it is loaded, without patching its code (the code is shared and read-only). PIC achieves this: (1) references to its own code and data use PC-relative addressing; (2) references to external data go through the <strong>global offset table (GOT)</strong>, a table of addresses in the data segment that the dynamic linker fills in; (3) calls to external functions go through the <strong>procedure linkage table (PLT)</strong>, with <strong>lazy binding</strong> — the address is resolved on the first call only. That is why you saw <code>callq puts@PLT</code> in lesson 1.1. Compile libraries with <code>-fpic</code>.</p>
<h4>Library interpositioning</h4>
<p>Because resolution happens at load/run time, you can substitute your own version of a library function — e.g. with <code>LD_PRELOAD</code> on Linux — to trace every <code>malloc</code>/<code>free</code> call or simulate failures. Debuggers, profilers and sanitizers rely on this.</p>
<h3>✍️ Worked example — build and use a shared library (macOS, real output)</h3>
` + C(SRC_DLL) + `
` + out(OUT_SHARED) + `
<p><code>prog2l</code> lists libvector.dylib as a dependency, and <code>addvec</code> is still undefined inside the executable: the dynamic linker resolves it when the program starts. <code>dll</code> loads the same library only when the code asks for it. On Linux the file would be <code>libvector.so</code>, you would list dependencies with <code>ldd</code>, and you may need <code>LD_LIBRARY_PATH=.</code> so the loader finds a library in the current directory.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>“error while loading shared libraries: cannot open shared object file” — the library is not in the search path (fix with rpath, LD_LIBRARY_PATH or installing it).</li><li>Compiling a shared library without <code>-fpic</code>.</li><li>Changing a function's signature in a shared library without changing its version — old programs break at run time (ABI break).</li><li>Forgetting to check the return values of <code>dlopen</code>/<code>dlsym</code> (use <code>dlerror</code>).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>The loader maps ELF segments, sets up stack/heap, jumps to <code>_start</code> → <code>main</code>.</li><li>Shared libraries: one copy in memory, updatable without relinking.</li><li>Load-time linking (-l) vs run-time linking (dlopen/dlsym).</li><li>PIC + GOT + PLT (lazy binding) let shared code run at any address.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://eli.thegreenplace.net/2011/11/03/position-independent-code-pic-in-shared-libraries/" target="_blank" rel="noopener">Eli Bendersky — Position Independent Code (PIC) in shared libraries</a></li><li><a href="https://man7.org/linux/man-pages/man3/dlopen.3.html" target="_blank" rel="noopener">dlopen(3) — Linux manual page</a></li><li><a href="https://man7.org/linux/man-pages/man8/ld.so.8.html" target="_blank" rel="noopener">ld.so(8) — the dynamic linker, LD_PRELOAD, LD_LIBRARY_PATH</a></li><li><a href="https://akkadia.org/drepper/dsohowto.pdf" target="_blank" rel="noopener">Ulrich Drepper — How To Write Shared Libraries (PDF)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Ten processes use the same 2 MiB shared library. Roughly how much physical memory does its code take? And if each linked it statically?</li><li>Why can't a shared library's code simply be patched with absolute addresses at load time?</li><li>When is lazy binding resolved for <code>printf</code>?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) About 2 MiB once (shared pages) versus about 20 MiB with ten static copies. 2) The code pages are shared read-only by many processes that may load the library at different addresses; patching would require a private copy per process. 3) On the first call: the PLT entry jumps into the dynamic linker, which finds printf, writes its address into the GOT, and later calls go directly.</p></div>`,
  `<span class="eyebrow">ICS102 · Chương 7 · Bài 7.3</span>
<h2>Nạp chương trình, thư viện dùng chung, liên kết động và mã độc lập vị trí</h2>
<p class="lead">Gần như mọi chương trình bạn chạy hôm nay đều liên kết động: thư viện C, đồ hoạ, mã hoá, toán được hàng trăm tiến trình dùng chung và cập nhật mà không cần biên dịch lại gì. Bài này giải thích tệp thực thi được nạp thế nào, vì sao có thư viện dùng chung, và mẹo khéo — mã độc lập vị trí — giúp chúng chạy được.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Mô tả bộ nạp khởi động chương trình thế nào.</li><li>Liệt kê nhược điểm của thư viện tĩnh mà thư viện dùng chung giải quyết.</li><li>Phân biệt liên kết động lúc nạp và lúc chạy, và dùng <code>dlopen</code>.</li><li>Giải thích PIC, GOT và PLT ở mức tổng quan.</li></ul>
<h3>📖 Bài giảng</h3>
<h4>Nạp một tệp thực thi</h4>
<p>Khi bạn chạy <code>./prog</code>, shell gọi <code>execve</code> (chương 8). <strong>Bộ nạp</strong> trong nhân đọc bảng program header của tệp ELF, cho biết phần nào của tệp thành đoạn bộ nhớ nào: đoạn mã chỉ đọc (.init, .text, .rodata) và đoạn dữ liệu đọc/ghi (.data, .bss điền 0). Nó dựng vùng ngăn xếp và heap, rồi nhảy tới điểm vào <code>_start</code> (mã khởi động của C runtime), hàm này gọi <code>__libc_start_main</code>, rồi gọi <code>main</code>. Việc chép diễn ra lười: trang chỉ được ánh xạ và đưa từ đĩa vào khi lần đầu bị chạm tới (chương 9).</p>
<h4>Vì sao có thư viện dùng chung?</h4>
<ul><li>Liên kết tĩnh chép mã thư viện vào mọi tệp thực thi: phí đĩa và bộ nhớ (mỗi tiến trình giữ một bản printf riêng).</li><li>Sửa lỗi trong thư viện tĩnh buộc phải liên kết lại mọi chương trình dùng nó.</li></ul>
<p><strong>Thư viện dùng chung</strong> (<code>.so</code>) được liên kết <strong>lúc nạp</strong> hoặc <strong>lúc chạy</strong> bởi <strong>bộ liên kết động</strong> (<code>ld-linux.so</code> trên Linux). Chỉ một bản mã của nó nằm trong bộ nhớ vật lý, mọi tiến trình dùng chung; phần .data thì riêng của từng tiến trình.</p>
<h4>Hai cách dùng thư viện dùng chung</h4>
<ul>
<li><strong>Liên kết lúc nạp</strong>: liên kết với <code>-lvector</code> như thường. Tệp thực thi ghi lại rằng nó cần libvector; các tham chiếu vẫn chưa giải quyết cho tới khi bộ liên kết động xử lý lúc chương trình khởi động.</li>
<li><strong>Liên kết lúc chạy</strong>: chương trình tự gọi <code>dlopen</code>/<code>dlsym</code>/<code>dlclose</code> để nạp thư viện theo tên khi đang chạy — cách plug-in, mô-đun mở rộng của Python và mô-đun web server hoạt động.</li>
</ul>
<h4>Mã độc lập vị trí (PIC)</h4>
<p>Thư viện dùng chung phải chạy được ở bất kỳ địa chỉ nào nó được nạp vào, mà không vá mã (mã được dùng chung và chỉ đọc). PIC làm được điều đó: (1) tham chiếu tới mã và dữ liệu của chính nó dùng địa chỉ tương đối PC; (2) tham chiếu tới dữ liệu bên ngoài đi qua <strong>bảng offset toàn cục (GOT)</strong>, một bảng địa chỉ trong đoạn dữ liệu do bộ liên kết động điền vào; (3) lời gọi hàm bên ngoài đi qua <strong>bảng liên kết thủ tục (PLT)</strong>, với <strong>gắn lười (lazy binding)</strong> — địa chỉ chỉ được giải quyết ở lần gọi đầu tiên. Đó là lý do bạn thấy <code>callq puts@PLT</code> ở bài 1.1. Biên dịch thư viện với <code>-fpic</code>.</p>
<h4>Gắn nối thư viện (interpositioning)</h4>
<p>Vì việc phân giải diễn ra lúc nạp/chạy, bạn có thể thay một hàm thư viện bằng phiên bản của mình — vd dùng <code>LD_PRELOAD</code> trên Linux — để theo dõi mọi lời gọi <code>malloc</code>/<code>free</code> hoặc giả lập lỗi. Trình gỡ lỗi, profiler và sanitizer dựa vào điều này.</p>
<h3>✍️ Ví dụ — dựng và dùng thư viện dùng chung (macOS, output thật)</h3>
` + C(SRC_DLL) + `
` + out(OUT_SHARED) + `
<p><code>prog2l</code> liệt kê libvector.dylib là phụ thuộc, và <code>addvec</code> vẫn chưa được định nghĩa bên trong tệp thực thi: bộ liên kết động giải quyết nó khi chương trình khởi động. <code>dll</code> chỉ nạp cùng thư viện đó khi code yêu cầu. Trên Linux tệp sẽ là <code>libvector.so</code>, bạn liệt kê phụ thuộc bằng <code>ldd</code>, và có thể cần <code>LD_LIBRARY_PATH=.</code> để bộ nạp tìm thấy thư viện ở thư mục hiện tại.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>“error while loading shared libraries: cannot open shared object file” — thư viện không nằm trong đường dẫn tìm kiếm (sửa bằng rpath, LD_LIBRARY_PATH hoặc cài thư viện).</li><li>Biên dịch thư viện dùng chung mà thiếu <code>-fpic</code>.</li><li>Đổi chữ ký hàm trong thư viện dùng chung mà không đổi phiên bản — chương trình cũ hỏng lúc chạy (phá ABI).</li><li>Quên kiểm giá trị trả về của <code>dlopen</code>/<code>dlsym</code> (dùng <code>dlerror</code>).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Bộ nạp ánh xạ các segment ELF, dựng ngăn xếp/heap, nhảy tới <code>_start</code> → <code>main</code>.</li><li>Thư viện dùng chung: một bản trong bộ nhớ, cập nhật được mà không liên kết lại.</li><li>Liên kết lúc nạp (-l) và lúc chạy (dlopen/dlsym).</li><li>PIC + GOT + PLT (gắn lười) cho mã dùng chung chạy ở mọi địa chỉ.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://eli.thegreenplace.net/2011/11/03/position-independent-code-pic-in-shared-libraries/" target="_blank" rel="noopener">Eli Bendersky — Position Independent Code (PIC) in shared libraries</a></li><li><a href="https://man7.org/linux/man-pages/man3/dlopen.3.html" target="_blank" rel="noopener">dlopen(3) — man page Linux</a></li><li><a href="https://man7.org/linux/man-pages/man8/ld.so.8.html" target="_blank" rel="noopener">ld.so(8) — bộ liên kết động, LD_PRELOAD, LD_LIBRARY_PATH</a></li><li><a href="https://akkadia.org/drepper/dsohowto.pdf" target="_blank" rel="noopener">Ulrich Drepper — How To Write Shared Libraries (PDF)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Mười tiến trình dùng cùng một thư viện dùng chung 2 MiB. Mã của nó chiếm khoảng bao nhiêu bộ nhớ vật lý? Nếu mỗi cái liên kết tĩnh thì sao?</li><li>Vì sao không thể đơn giản vá mã thư viện dùng chung bằng địa chỉ tuyệt đối lúc nạp?</li><li>Với <code>printf</code>, gắn lười được giải quyết khi nào?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Khoảng 2 MiB một lần (trang dùng chung) so với khoảng 20 MiB với mười bản tĩnh. 2) Trang mã được nhiều tiến trình dùng chung ở chế độ chỉ đọc, mà mỗi tiến trình có thể nạp thư viện ở địa chỉ khác nhau; vá thì phải có bản riêng cho từng tiến trình. 3) Ở lần gọi đầu tiên: mục PLT nhảy vào bộ liên kết động, nó tìm printf, ghi địa chỉ vào GOT, các lần gọi sau đi thẳng.</p></div>`);

const q7 = QZ(7, 'Quiz — Chapter 7: Linking|||Quiz — Chương 7: Liên kết', 'Kiểm tra chương 7: hai việc của bộ liên kết, loại tệp đối tượng, section ELF, loại ký hiệu, mạnh/yếu, thư viện tĩnh và thứ tự, định vị lại, thư viện dùng chung, PIC.', [
  Q('q1', 'The two main tasks of a linker are|||Hai việc chính của bộ liên kết là',
    ['preprocessing and compiling|||tiền xử lý và biên dịch', 'symbol resolution and relocation|||phân giải ký hiệu và định vị lại', 'optimisation and register allocation|||tối ưu và cấp phát thanh ghi', 'loading and executing|||nạp và chạy'], 1,
    'Resolve each reference to one definition, then assign addresses and patch references.|||Nối mỗi tham chiếu với một định nghĩa, rồi gán địa chỉ và vá tham chiếu.'),
  Q('q2', 'An uninitialised global array int buf[1000]; is placed in|||Mảng toàn cục chưa khởi tạo int buf[1000]; được đặt trong',
    ['.text|||.text', '.data|||.data', '.bss|||.bss', '.rodata|||.rodata'], 2,
    '.bss records only the size; the loader provides zeroed memory.|||.bss chỉ ghi kích thước; bộ nạp cấp vùng nhớ đã xoá 0.'),
  Q('q3', 'In nm output, a lowercase b or t marks a symbol that is|||Trong output của nm, chữ thường b hoặc t đánh dấu ký hiệu',
    ['external|||ngoài', 'local (static)|||cục bộ (static)', 'weak|||yếu', 'undefined|||chưa định nghĩa'], 1,
    'Uppercase = global; lowercase = local; U = undefined.|||Chữ hoa = toàn cục; chữ thường = cục bộ; U = chưa định nghĩa.'),
  Q('q4', 'Two .c files both contain int x = 1; at file level. Linking them gives|||Hai tệp .c đều có int x = 1; ở mức tệp. Liên kết chúng cho',
    ['one shared x|||một biến x dùng chung', 'a duplicate symbol error|||lỗi trùng ký hiệu', 'two private copies|||hai bản riêng', 'a compile error|||lỗi biên dịch'], 1,
    'Two strong definitions of the same name are rejected (we saw the real error).|||Hai định nghĩa mạnh cùng tên bị từ chối (đã thấy lỗi thật).'),
  Q('q5', 'How do you make a global function private to its file in C?|||Làm sao để một hàm toàn cục chỉ dùng được trong tệp của nó?',
    ['declare it extern|||khai báo extern', 'declare it static|||khai báo static', 'put it in a header|||đặt vào header', 'use inline|||dùng inline'], 1,
    'static at file level gives the symbol local binding.|||static ở mức tệp cho ký hiệu phạm vi cục bộ.'),
  Q('q6', 'With GNU ld, gcc -lvector main.o fails but gcc main.o -lvector works because|||Với GNU ld, gcc -lvector main.o lỗi còn gcc main.o -lvector chạy được vì',
    ['libraries must be first|||thư viện phải đứng đầu', 'the linker scans left to right and only pulls archive members for symbols already needed|||bộ liên kết quét trái sang phải và chỉ kéo thành viên archive cho ký hiệu đang cần', '-l is ignored after .o files|||-l bị bỏ qua sau tệp .o', 'main.o is a library|||main.o là thư viện'], 1,
    'When libvector is scanned first, nothing needs addvec yet.|||Khi quét libvector trước, chưa ai cần addvec.'),
  Q('q7', 'A static library contributes to the executable|||Thư viện tĩnh đóng góp vào tệp thực thi',
    ['all of its object files|||mọi tệp đối tượng của nó', 'only the members that define needed symbols|||chỉ các thành viên định nghĩa ký hiệu cần dùng', 'nothing; it is loaded at run time|||không gì; nó được nạp lúc chạy', 'only its header|||chỉ phần header'], 1,
    'Our executable contained addvec but not the unused multvec.|||Tệp thực thi của ta có addvec nhưng không có multvec không dùng tới.'),
  Q('q8', 'A PC-relative relocation for call stores|||Định vị lại tương đối PC cho call lưu',
    ['the absolute address of the target|||địa chỉ tuyệt đối của đích', 'target address − address of the next instruction|||địa chỉ đích − địa chỉ lệnh kế tiếp', 'the size of the function|||kích thước hàm', 'zero|||số 0'], 1,
    'The CPU adds the stored offset to the PC of the next instruction.|||CPU cộng offset đã lưu với PC của lệnh kế tiếp.'),
  Q('q9', 'Run-time dynamic linking is done with|||Liên kết động lúc chạy được thực hiện bằng',
    ['ar and nm|||ar và nm', 'dlopen and dlsym|||dlopen và dlsym', 'fork and exec|||fork và exec', '#include|||#include'], 1,
    'The program loads the library by name while running.|||Chương trình nạp thư viện theo tên khi đang chạy.'),
  Q('q10', 'Calls from PIC code to an external function go through|||Lời gọi từ mã PIC tới hàm bên ngoài đi qua',
    ['the jump table of a switch|||bảng nhảy của switch', 'the PLT, using addresses stored in the GOT|||PLT, dùng địa chỉ lưu trong GOT', 'the stack canary|||stack canary', 'the TLB|||TLB'], 1,
    'With lazy binding, the GOT entry is filled on the first call.|||Với gắn lười, mục GOT được điền ở lần gọi đầu tiên.'),
]);

const ch7 = {
  title: 'Chapter 7 — Linking|||Chương 7 — Liên kết',
  description: 'Trình điều khiển biên dịch, tệp đối tượng ELF và ký hiệu (nm thật), mạnh/yếu, thư viện tĩnh và thứ tự, định vị lại (objdump -dr thật), nạp chương trình, thư viện dùng chung, dlopen chạy thật, PIC/GOT/PLT (CS:APP chương 7).',
  lessons: [c71, c72, c73, q7],
};

// ───────────────────────────── Chương 8 — Luồng điều khiển ngoại lệ ─────────────────────────────
const SRC_SEGV = String.raw`
#include <stdio.h>
int main(void) {
    setvbuf(stdout, NULL, _IONBF, 0);
    int *p = NULL;
    printf("about to dereference NULL...\n");
    *p = 42;                         /* page fault the kernel cannot fix -> SIGSEGV */
    printf("never printed\n");
    return 0;
}
`;
const OUT_SEGV = String.raw`
$ cc -O0 segv.c -o segv && ./segv; echo "exit status = $?"
about to dereference NULL...
bash: line 1: 27346 Segmentation fault: 11  ./segv
exit status = 139
`;

const c81 = L('ics102-ts-8-1',
  '8.1 — Exceptions: interrupts, traps, faults and aborts; system calls|||8.1 — Ngoại lệ: ngắt, bẫy, lỗi và huỷ bỏ; lời gọi hệ thống',
  'Luồng điều khiển ngoại lệ là gì, bảng ngoại lệ, bốn lớp ngoại lệ (ngắt, bẫy, lỗi, huỷ) và cách mỗi lớp trả về, lời gọi hệ thống qua lệnh syscall trên Linux x86-64, ví dụ lỗi trang và segfault chạy thật.',
  `<span class="eyebrow">ICS102 · Chapter 8 · Lesson 8.1</span>
<h2>Exceptions: interrupts, traps, faults and aborts; system calls</h2>
<p class="lead">Normally the PC moves to the next instruction or follows a jump. But a system must also react to events that are not part of the program: a key is pressed, a packet arrives, a division by zero happens, a page is not in memory, the program asks the kernel for a service. These abrupt changes of control flow are called <strong>exceptional control flow (ECF)</strong>, and they exist at every level — from hardware exceptions to OS context switches, signals and even C++/Java <code>try/catch</code>.</p>
<h3>🎯 Objectives</h3>
<ul><li>Define an exception and the role of the exception table.</li><li>Distinguish the four classes: interrupt, trap, fault, abort.</li><li>Explain how a system call works on Linux x86-64.</li><li>Recognise a segmentation fault as an unrecoverable fault.</li></ul>
<h3>📖 Lecture</h3>
<h4>What is an exception?</h4>
<p>An <strong>exception</strong> is a transfer of control to the OS kernel in response to some <strong>event</strong> (a change in processor state). Each type of event has an <strong>exception number</strong>; at boot time the OS fills an <strong>exception table</strong> whose entry k holds the address of the handler for exception k. When event k occurs, the processor saves the return address and some state, switches to <strong>kernel mode</strong>, and jumps through the table to the handler. After handling, the handler either returns to the current instruction, returns to the next instruction, or aborts the program.</p>
<h4>Four classes</h4>
<div class="formula"><span class="lbl">Classes of exceptions</span><b>Interrupt</b> — cause: signal from an I/O device (timer, disk, network) · asynchronous · returns to the next instruction<br><b>Trap</b> — cause: an intentional instruction (system call, breakpoint) · synchronous · returns to the next instruction<br><b>Fault</b> — cause: a potentially recoverable error (page fault, divide error, protection fault) · synchronous · may return to the <i>current</i> instruction (re-executes it) or abort<br><b>Abort</b> — cause: an unrecoverable hardware error (memory parity error) · synchronous · never returns</div>
<p>The <strong>timer interrupt</strong> is especially important: it fires every few milliseconds and lets the kernel take control back from any program, which is how it switches between processes (lesson 8.2).</p>
<h4>System calls</h4>
<p>User programs cannot execute privileged instructions or touch kernel memory. To ask for a service they execute the <code>syscall</code> instruction, a trap. On Linux x86-64 the system call number goes in %rax and up to six arguments in %rdi, %rsi, %rdx, %r10, %r8, %r9; the result comes back in %rax (a negative value in −4095…−1 means an error, which the C wrapper turns into −1 and <code>errno</code>). A few numbers: read 0, write 1, open 2, close 3, mmap 9, fork 57, execve 59, exit 60, kill 62. In C you call wrapper functions such as <code>write(1, "hello\\n", 6)</code>; the library executes <code>syscall</code> for you.</p>
<h4>Faults: page faults and segmentation faults</h4>
<p>If an instruction references a virtual address whose page is not in memory, the MMU raises a <strong>page fault</strong>. The handler loads the page from disk and returns to the <em>same</em> instruction, which now succeeds — the program never notices (chapter 9). If the address is invalid (e.g. NULL, or writing to read-only code), the handler cannot fix it: the kernel sends the process the signal SIGSEGV, whose default action is to terminate it — the famous <strong>segmentation fault</strong>.</p>
<h3>✍️ Worked example — an unrecoverable fault</h3>
` + C(SRC_SEGV) + `
` + out(OUT_SEGV) + `
<p>The first <code>printf</code> runs; the store to address 0 faults; the kernel terminates the process with signal 11 (SIGSEGV), so the shell reports exit status 128 + 11 = 139 and “never printed” is never printed.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Calling every exception an “interrupt” — interrupts come from outside the CPU; traps, faults and aborts are caused by the current instruction.</li><li>Thinking a page fault means a bug — most page faults are normal and invisible.</li><li>Ignoring the return value of system-call wrappers: always check for −1 and print <code>strerror(errno)</code> or use <code>perror</code>.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Exception = transfer to a kernel handler through the exception table.</li><li>Interrupt (async, I/O), trap (intentional, syscall), fault (maybe recoverable), abort (fatal).</li><li>Linux x86-64 syscalls: number in %rax, <code>syscall</code> instruction, result in %rax.</li><li>An unfixable fault becomes SIGSEGV: “segmentation fault”, exit status 139.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Interrupt" target="_blank" rel="noopener">Wikipedia — Interrupt (and the hardware/software interrupt taxonomy)</a></li><li><a href="https://man7.org/linux/man-pages/man2/syscalls.2.html" target="_blank" rel="noopener">syscalls(2) — list of Linux system calls</a></li><li><a href="https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-mechanisms.pdf" target="_blank" rel="noopener">OSTEP — Mechanism: Limited Direct Execution (traps, timer interrupts) (PDF)</a></li><li><a href="https://en.wikipedia.org/wiki/System_call" target="_blank" rel="noopener">Wikipedia — System call</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Classify: (a) Ctrl+C typed on the keyboard reaches the CPU; (b) <code>int x = 5 / 0;</code> executed at run time; (c) <code>read()</code> from a file; (d) first access to a newly allocated heap page.</li><li>After a fault is successfully handled, which instruction runs next?</li><li>Which registers hold the system call number and the first argument on Linux x86-64?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) (a) interrupt (from the keyboard controller); (b) fault — divide error, not recoverable, the kernel sends SIGFPE; (c) trap (system call); (d) fault — page fault, handled transparently. 2) The same faulting instruction, re-executed. 3) %rax for the number, %rdi for the first argument.</p></div>`,
  `<span class="eyebrow">ICS102 · Chương 8 · Bài 8.1</span>
<h2>Ngoại lệ: ngắt, bẫy, lỗi và huỷ bỏ; lời gọi hệ thống</h2>
<p class="lead">Bình thường PC đi tới lệnh kế tiếp hoặc theo lệnh nhảy. Nhưng hệ thống còn phải phản ứng với các sự kiện không thuộc chương trình: một phím được bấm, một gói tin tới, một phép chia cho 0, một trang không có trong bộ nhớ, chương trình nhờ nhân làm một việc. Những thay đổi đột ngột của luồng điều khiển này gọi là <strong>luồng điều khiển ngoại lệ (ECF)</strong>, và chúng có ở mọi tầng — từ ngoại lệ phần cứng tới chuyển ngữ cảnh của hệ điều hành, tín hiệu, cho tới <code>try/catch</code> của C++/Java.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Định nghĩa ngoại lệ và vai trò của bảng ngoại lệ.</li><li>Phân biệt bốn lớp: ngắt, bẫy, lỗi, huỷ bỏ.</li><li>Giải thích lời gọi hệ thống hoạt động thế nào trên Linux x86-64.</li><li>Nhận ra segmentation fault là một lỗi không khắc phục được.</li></ul>
<h3>📖 Bài giảng</h3>
<h4>Ngoại lệ là gì?</h4>
<p><strong>Ngoại lệ (exception)</strong> là việc chuyển điều khiển sang nhân hệ điều hành để đáp lại một <strong>sự kiện</strong> (một thay đổi trạng thái bộ xử lý). Mỗi loại sự kiện có một <strong>số hiệu ngoại lệ</strong>; lúc khởi động, hệ điều hành điền một <strong>bảng ngoại lệ</strong> mà mục k chứa địa chỉ bộ xử lý (handler) của ngoại lệ k. Khi sự kiện k xảy ra, bộ xử lý lưu địa chỉ trở về và một phần trạng thái, chuyển sang <strong>chế độ nhân</strong>, rồi nhảy qua bảng tới handler. Xử lý xong, handler hoặc quay lại lệnh hiện tại, hoặc quay lại lệnh kế tiếp, hoặc huỷ chương trình.</p>
<h4>Bốn lớp</h4>
<div class="formula"><span class="lbl">Các lớp ngoại lệ</span><b>Ngắt (interrupt)</b> — nguyên nhân: tín hiệu từ thiết bị vào/ra (bộ định thời, đĩa, mạng) · bất đồng bộ · quay về lệnh kế tiếp<br><b>Bẫy (trap)</b> — nguyên nhân: một lệnh cố ý (lời gọi hệ thống, điểm dừng) · đồng bộ · quay về lệnh kế tiếp<br><b>Lỗi (fault)</b> — nguyên nhân: lỗi có thể khắc phục (lỗi trang, lỗi chia, lỗi bảo vệ) · đồng bộ · có thể quay về <i>chính</i> lệnh đó (chạy lại) hoặc huỷ<br><b>Huỷ bỏ (abort)</b> — nguyên nhân: lỗi phần cứng không khắc phục được (lỗi chẵn lẻ bộ nhớ) · đồng bộ · không bao giờ quay về</div>
<p><strong>Ngắt định thời</strong> đặc biệt quan trọng: nó xảy ra vài mili-giây một lần và cho nhân giành lại quyền điều khiển từ bất kỳ chương trình nào, nhờ đó nhân chuyển qua lại giữa các tiến trình (bài 8.2).</p>
<h4>Lời gọi hệ thống</h4>
<p>Chương trình người dùng không được chạy lệnh đặc quyền hay đụng bộ nhớ nhân. Để nhờ dịch vụ, chúng chạy lệnh <code>syscall</code>, một bẫy. Trên Linux x86-64, số hiệu lời gọi hệ thống đặt trong %rax và tối đa sáu đối số trong %rdi, %rsi, %rdx, %r10, %r8, %r9; kết quả trả về trong %rax (giá trị âm trong khoảng −4095…−1 là lỗi, hàm bọc của C đổi thành −1 và <code>errno</code>). Vài số hiệu: read 0, write 1, open 2, close 3, mmap 9, fork 57, execve 59, exit 60, kill 62. Trong C bạn gọi các hàm bọc như <code>write(1, "hello\\n", 6)</code>; thư viện chạy <code>syscall</code> giúp bạn.</p>
<h4>Lỗi: lỗi trang và segmentation fault</h4>
<p>Nếu một lệnh tham chiếu địa chỉ ảo mà trang của nó chưa có trong bộ nhớ, MMU sinh <strong>lỗi trang (page fault)</strong>. Handler nạp trang từ đĩa rồi quay lại <em>chính</em> lệnh đó, giờ thì thành công — chương trình không hề hay biết (chương 9). Nếu địa chỉ không hợp lệ (vd NULL, hoặc ghi vào vùng mã chỉ đọc), handler không sửa được: nhân gửi cho tiến trình tín hiệu SIGSEGV, hành động mặc định là kết thúc nó — chính là <strong>segmentation fault</strong> nổi tiếng.</p>
<h3>✍️ Ví dụ — một lỗi không khắc phục được</h3>
` + C(SRC_SEGV) + `
` + out(OUT_SEGV) + `
<p><code>printf</code> đầu tiên chạy; lệnh ghi vào địa chỉ 0 gây lỗi; nhân kết thúc tiến trình bằng tín hiệu 11 (SIGSEGV), nên shell báo mã thoát 128 + 11 = 139 và dòng “never printed” không bao giờ được in.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Gọi mọi ngoại lệ là “ngắt” — ngắt đến từ bên ngoài CPU; bẫy, lỗi, huỷ bỏ do chính lệnh hiện tại gây ra.</li><li>Tưởng lỗi trang nghĩa là có bug — đa số lỗi trang là bình thường và vô hình.</li><li>Bỏ qua giá trị trả về của hàm bọc lời gọi hệ thống: luôn kiểm −1 và in <code>strerror(errno)</code> hoặc dùng <code>perror</code>.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Ngoại lệ = chuyển tới handler của nhân qua bảng ngoại lệ.</li><li>Ngắt (bất đồng bộ, I/O), bẫy (cố ý, syscall), lỗi (có thể khắc phục), huỷ bỏ (chết hẳn).</li><li>Syscall Linux x86-64: số hiệu trong %rax, lệnh <code>syscall</code>, kết quả trong %rax.</li><li>Lỗi không sửa được thành SIGSEGV: “segmentation fault”, mã thoát 139.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Interrupt" target="_blank" rel="noopener">Wikipedia — Interrupt (ngắt và phân loại)</a></li><li><a href="https://man7.org/linux/man-pages/man2/syscalls.2.html" target="_blank" rel="noopener">syscalls(2) — danh sách lời gọi hệ thống Linux</a></li><li><a href="https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-mechanisms.pdf" target="_blank" rel="noopener">OSTEP — Mechanism: Limited Direct Execution (bẫy, ngắt định thời) (PDF)</a></li><li><a href="https://en.wikipedia.org/wiki/System_call" target="_blank" rel="noopener">Wikipedia — Lời gọi hệ thống</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Phân loại: (a) Ctrl+C gõ trên bàn phím tới CPU; (b) <code>int x = 5 / 0;</code> chạy lúc chạy; (c) <code>read()</code> từ tệp; (d) lần đầu truy cập một trang heap mới cấp.</li><li>Sau khi một lỗi (fault) được xử lý thành công, lệnh nào chạy tiếp?</li><li>Thanh ghi nào chứa số hiệu lời gọi hệ thống và đối số thứ nhất trên Linux x86-64?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) (a) ngắt (từ bộ điều khiển bàn phím); (b) lỗi — lỗi chia, không khắc phục được, nhân gửi SIGFPE; (c) bẫy (lời gọi hệ thống); (d) lỗi — lỗi trang, được xử lý trong suốt. 2) Chính lệnh gây lỗi, được chạy lại. 3) %rax cho số hiệu, %rdi cho đối số thứ nhất.</p></div>`);

const SRC_FORK = String.raw`
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>
int main(void) {
    setvbuf(stdout, NULL, _IONBF, 0);
    int x = 1;
    pid_t pid = fork();
    if (pid < 0) { perror("fork"); exit(1); }
    if (pid == 0) {                          /* child */
        printf("child : x=%d\n", ++x);
        exit(7);
    }
    int status;
    waitpid(pid, &status, 0);               /* parent: reap the child */
    printf("parent: x=%d\n", --x);
    if (WIFEXITED(status))
        printf("parent: child exited with status %d\n", WEXITSTATUS(status));
    return 0;
}
`;
const OUT_FORK = String.raw`
child : x=2
parent: x=0
parent: child exited with status 7
`;
const SRC_EXEC = String.raw`
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>
int main(void) {
    setvbuf(stdout, NULL, _IONBF, 0);
    pid_t pid = fork();
    if (pid == 0) {
        char *argv[] = {"echo", "hello from a new program", NULL};
        execvp("echo", argv);             /* replaces the child's code; returns only on error */
        perror("execvp"); exit(127);
    }
    int st; waitpid(pid, &st, 0);
    printf("shell-like parent: child exited %d\n", WEXITSTATUS(st));
    return 0;
}
`;
const OUT_EXEC = String.raw`
hello from a new program
shell-like parent: child exited 0
`;
const SRC_ZOMBIE = String.raw`
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>
int main(void) {
    setvbuf(stdout, NULL, _IONBF, 0);
    pid_t pid = fork();
    if (pid == 0) exit(0);                      /* child ends immediately */
    sleep(1);                                   /* parent has not reaped it yet */
    char cmd[64];
    snprintf(cmd, sizeof cmd, "ps -o pid,stat,comm -p %d", (int) pid);
    system(cmd);                                /* the child is a zombie: state Z */
    waitpid(pid, NULL, 0);                      /* reap it */
    printf("after waitpid:\n");
    system(cmd);
    return 0;
}
`;
const OUT_ZOMBIE = String.raw`
  PID STAT COMM
99913 Z    <defunct>
after waitpid:
  PID STAT COMM
`;

const c82 = L('ics102-ts-8-2',
  '8.2 — Processes: fork, exit, waitpid, execve, zombies|||8.2 — Tiến trình: fork, exit, waitpid, execve, tiến trình zombie',
  'Tiến trình cho hai ảo giác (CPU riêng, bộ nhớ riêng), luồng song song đồng thời, chế độ người dùng/nhân, chuyển ngữ cảnh; fork gọi một lần trả về hai lần, đồ thị tiến trình, waitpid và mã thoát, execve, zombie — bốn chương trình chạy thật.',
  `<span class="eyebrow">ICS102 · Chapter 8 · Lesson 8.2</span>
<h2>Processes: fork, exit, waitpid, execve, zombies</h2>
<p class="lead">A <strong>process</strong> is an instance of a running program. Shells, web servers, build tools, Docker and Python's <code>multiprocessing</code> all create and manage processes with just a handful of system calls. Knowing them precisely lets you write your own shell — and understand why a server can be slowly filling up with “zombies”.</p>
<h3>🎯 Objectives</h3>
<ul><li>Explain the two illusions a process provides and how context switches create them.</li><li>Predict the output of programs that call fork, using process graphs.</li><li>Use waitpid and the exit status macros correctly.</li><li>Explain execve and what a zombie is.</li></ul>
<h3>📖 Lecture</h3>
<h4>Two illusions</h4>
<ul><li>An independent <strong>logical control flow</strong>: each program seems to have the CPU to itself.</li><li>A <strong>private address space</strong>: each program seems to have the memory to itself (chapter 9).</li></ul>
<p>Two flows are <strong>concurrent</strong> if their executions overlap in time; on one core they are interleaved by <strong>context switches</strong> triggered by timer interrupts or system calls that block (e.g. waiting for disk). Processes run in <strong>user mode</strong>; only the kernel runs in <strong>kernel mode</strong> with full privileges.</p>
<h4>Process control</h4>
<ul>
<li><code>getpid()</code>, <code>getppid()</code> — my ID, my parent's ID.</li>
<li><code>exit(status)</code> — terminate with an exit status (0 = success by convention).</li>
<li><code>fork()</code> — create a child that is an almost exact copy of the parent: same code, a <em>copy</em> of the data, stack and open files. It is <strong>called once but returns twice</strong>: 0 in the child, the child's PID in the parent. After fork both run concurrently, in an unpredictable order.</li>
<li><code>waitpid(pid, &amp;status, options)</code> — wait for a child to terminate and <strong>reap</strong> it; decode the status with <code>WIFEXITED</code>, <code>WEXITSTATUS</code>, <code>WIFSIGNALED</code>, <code>WTERMSIG</code>.</li>
<li><code>execve(filename, argv, envp)</code> — load and run a new program <strong>in the current process</strong>, replacing code, data and stack. It returns only on error. Same PID, new program.</li>
</ul>
<h4>Zombies</h4>
<p>A terminated process stays in the kernel's tables until its parent reaps it — it is a <strong>zombie</strong>: it uses no CPU or memory, but it holds a process-table slot and its exit status. If the parent dies, <code>init</code> (PID 1) adopts and reaps its children. A long-running server that never calls wait accumulates zombies until it can no longer create processes.</p>
<h3>✍️ Worked example 1 — fork returns twice, memory is copied</h3>
` + C(SRC_FORK) + `
` + out(OUT_FORK) + `
<p>The child incremented <em>its own copy</em> of x (1 → 2); the parent's x is still 1 and becomes 0. The parent waits, so its lines come after the child's; the exit status 7 travels from <code>exit(7)</code> to <code>WEXITSTATUS</code>.</p>
<h3>✍️ Worked example 2 — process graphs</h3>
<p>With <code>fork(); fork(); printf("hello\\n");</code> the first fork creates 2 processes, the second fork doubles that to 4, and each prints once. Drawing the <strong>process graph</strong> (a vertex per statement, an edge per process) shows every possible ordering. We ran it with output piped to <code>wc -l</code> and got exactly <b>4</b> lines. In general, n forks in a row give 2<sup>n</sup> processes.</p>
<h3>✍️ Worked example 3 — fork + exec, the heart of every shell</h3>
` + C(SRC_EXEC) + `
` + out(OUT_EXEC) + `
<h3>✍️ Worked example 4 — catching a zombie</h3>
` + C(SRC_ZOMBIE) + `
` + out(OUT_ZOMBIE) + `
<p>While unreaped, the child shows state <b>Z</b> (&lt;defunct&gt;); after <code>waitpid</code> it is gone from the process table.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Assuming the parent runs before the child (or the reverse) — without wait, the order is not guaranteed.</li><li>Expecting a variable changed in the child to change in the parent — they have separate copies.</li><li>Forgetting that <code>printf</code> output still in a buffer is duplicated by fork (call <code>fflush(stdout)</code> before fork).</li><li>Writing code after <code>execve</code> that you expect to run — it only runs if exec failed.</li><li>Never reaping children → zombies.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Processes = private control flow + private address space, interleaved by context switches.</li><li>fork: called once, returns twice (0 in child, PID in parent); memory is copied.</li><li>waitpid reaps a child and returns its status; execve replaces the program in the same process.</li><li>Terminated but unreaped = zombie.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://man7.org/linux/man-pages/man2/fork.2.html" target="_blank" rel="noopener">fork(2) — Linux manual page</a></li><li><a href="https://man7.org/linux/man-pages/man2/wait.2.html" target="_blank" rel="noopener">wait(2) / waitpid — Linux manual page</a></li><li><a href="https://man7.org/linux/man-pages/man2/execve.2.html" target="_blank" rel="noopener">execve(2) — Linux manual page</a></li><li><a href="https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-api.pdf" target="_blank" rel="noopener">OSTEP — Interlude: Process API (PDF)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>How many times is “hi” printed by <code>for (int i = 0; i &lt; 3; i++) fork(); printf("hi\\n");</code>?</li><li>A program prints “A”, then calls fork, then prints “B”. List the possible outputs (one line each, unbuffered).</li><li>Why does a shell call fork before execve instead of calling execve directly?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 2<sup>3</sup> = 8 times. 2) A then two B's: “A B B” is the only possible sequence of lines (A happens before the fork; the two B's are identical, from parent and child). 3) execve replaces the calling process; if the shell called it directly, the shell itself would be replaced and disappear. fork creates a child to be replaced.</p></div>`,
  `<span class="eyebrow">ICS102 · Chương 8 · Bài 8.2</span>
<h2>Tiến trình: fork, exit, waitpid, execve, tiến trình zombie</h2>
<p class="lead"><strong>Tiến trình (process)</strong> là một thể hiện của chương trình đang chạy. Shell, web server, công cụ build, Docker và <code>multiprocessing</code> của Python đều tạo và quản lý tiến trình chỉ bằng vài lời gọi hệ thống. Nắm chính xác chúng, bạn tự viết được một shell — và hiểu vì sao một server có thể từ từ đầy “zombie”.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Giải thích hai ảo giác mà tiến trình mang lại và chuyển ngữ cảnh tạo ra chúng thế nào.</li><li>Dự đoán output của chương trình gọi fork bằng đồ thị tiến trình.</li><li>Dùng đúng waitpid và các macro mã thoát.</li><li>Giải thích execve và tiến trình zombie là gì.</li></ul>
<h3>📖 Bài giảng</h3>
<h4>Hai ảo giác</h4>
<ul><li>Một <strong>luồng điều khiển logic</strong> độc lập: mỗi chương trình như có CPU riêng.</li><li>Một <strong>không gian địa chỉ riêng</strong>: mỗi chương trình như có bộ nhớ riêng (chương 9).</li></ul>
<p>Hai luồng là <strong>đồng thời</strong> nếu thời gian chạy của chúng chồng lên nhau; trên một lõi chúng được xen kẽ nhờ <strong>chuyển ngữ cảnh</strong>, do ngắt định thời hoặc lời gọi hệ thống phải chờ (vd chờ đĩa) kích hoạt. Tiến trình chạy ở <strong>chế độ người dùng</strong>; chỉ nhân chạy ở <strong>chế độ nhân</strong> với đầy đủ đặc quyền.</p>
<h4>Điều khiển tiến trình</h4>
<ul>
<li><code>getpid()</code>, <code>getppid()</code> — ID của tôi, ID của cha tôi.</li>
<li><code>exit(status)</code> — kết thúc với mã thoát (theo quy ước 0 = thành công).</li>
<li><code>fork()</code> — tạo tiến trình con gần như bản sao của cha: cùng mã, một <em>bản chép</em> của dữ liệu, ngăn xếp và các tệp đang mở. Nó <strong>được gọi một lần nhưng trả về hai lần</strong>: 0 ở con, PID của con ở cha. Sau fork cả hai chạy đồng thời, thứ tự không đoán trước được.</li>
<li><code>waitpid(pid, &amp;status, options)</code> — chờ một tiến trình con kết thúc và <strong>thu dọn (reap)</strong> nó; giải mã trạng thái bằng <code>WIFEXITED</code>, <code>WEXITSTATUS</code>, <code>WIFSIGNALED</code>, <code>WTERMSIG</code>.</li>
<li><code>execve(filename, argv, envp)</code> — nạp và chạy chương trình mới <strong>ngay trong tiến trình hiện tại</strong>, thay mã, dữ liệu, ngăn xếp. Nó chỉ trả về khi lỗi. Cùng PID, chương trình mới.</li>
</ul>
<h4>Zombie</h4>
<p>Tiến trình đã kết thúc vẫn nằm trong bảng của nhân cho tới khi cha thu dọn nó — nó là <strong>zombie</strong>: không tốn CPU hay bộ nhớ, nhưng giữ một ô trong bảng tiến trình và mã thoát. Nếu cha chết, <code>init</code> (PID 1) nhận nuôi và thu dọn các con. Server chạy lâu mà không bao giờ gọi wait sẽ tích zombie cho tới khi không tạo được tiến trình nữa.</p>
<h3>✍️ Ví dụ 1 — fork trả về hai lần, bộ nhớ được chép</h3>
` + C(SRC_FORK) + `
` + out(OUT_FORK) + `
<p>Con tăng <em>bản sao riêng</em> của x (1 → 2); x của cha vẫn là 1 và thành 0. Cha chờ con, nên dòng của cha in sau dòng của con; mã thoát 7 đi từ <code>exit(7)</code> tới <code>WEXITSTATUS</code>.</p>
<h3>✍️ Ví dụ 2 — đồ thị tiến trình</h3>
<p>Với <code>fork(); fork(); printf("hello\\n");</code> fork thứ nhất tạo 2 tiến trình, fork thứ hai nhân đôi thành 4, mỗi tiến trình in một lần. Vẽ <strong>đồ thị tiến trình</strong> (mỗi câu lệnh một đỉnh, mỗi tiến trình một cạnh) cho thấy mọi thứ tự có thể. Chúng tôi chạy nó, chuyển output qua <code>wc -l</code> và nhận đúng <b>4</b> dòng. Tổng quát, n lần fork liên tiếp cho 2<sup>n</sup> tiến trình.</p>
<h3>✍️ Ví dụ 3 — fork + exec, trái tim của mọi shell</h3>
` + C(SRC_EXEC) + `
` + out(OUT_EXEC) + `
<h3>✍️ Ví dụ 4 — bắt quả tang một zombie</h3>
` + C(SRC_ZOMBIE) + `
` + out(OUT_ZOMBIE) + `
<p>Khi chưa được thu dọn, tiến trình con có trạng thái <b>Z</b> (&lt;defunct&gt;); sau <code>waitpid</code> nó biến mất khỏi bảng tiến trình.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Cho rằng cha chạy trước con (hoặc ngược lại) — không có wait thì thứ tự không được bảo đảm.</li><li>Mong biến bị con sửa sẽ đổi ở cha — chúng có bản sao riêng.</li><li>Quên rằng output <code>printf</code> còn trong bộ đệm sẽ bị fork nhân đôi (gọi <code>fflush(stdout)</code> trước fork).</li><li>Viết code sau <code>execve</code> và mong nó chạy — nó chỉ chạy khi exec thất bại.</li><li>Không bao giờ thu dọn con → zombie.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Tiến trình = luồng điều khiển riêng + không gian địa chỉ riêng, xen kẽ nhờ chuyển ngữ cảnh.</li><li>fork: gọi một lần, trả về hai lần (0 ở con, PID ở cha); bộ nhớ được chép.</li><li>waitpid thu dọn con và trả trạng thái; execve thay chương trình trong cùng tiến trình.</li><li>Đã kết thúc nhưng chưa được thu dọn = zombie.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://man7.org/linux/man-pages/man2/fork.2.html" target="_blank" rel="noopener">fork(2) — man page Linux</a></li><li><a href="https://man7.org/linux/man-pages/man2/wait.2.html" target="_blank" rel="noopener">wait(2) / waitpid — man page Linux</a></li><li><a href="https://man7.org/linux/man-pages/man2/execve.2.html" target="_blank" rel="noopener">execve(2) — man page Linux</a></li><li><a href="https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-api.pdf" target="_blank" rel="noopener">OSTEP — Interlude: Process API (PDF)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>“hi” được in bao nhiêu lần bởi <code>for (int i = 0; i &lt; 3; i++) fork(); printf("hi\\n");</code>?</li><li>Một chương trình in “A”, rồi gọi fork, rồi in “B”. Liệt kê các output có thể (mỗi chữ một dòng, không đệm).</li><li>Vì sao shell gọi fork trước execve thay vì gọi execve luôn?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 2<sup>3</sup> = 8 lần. 2) A rồi hai chữ B: “A B B” là dãy dòng duy nhất có thể (A xảy ra trước fork; hai chữ B giống nhau, từ cha và con). 3) execve thay thế tiến trình gọi nó; nếu shell gọi trực tiếp, chính shell sẽ bị thay và biến mất. fork tạo tiến trình con để bị thay.</p></div>`);

const SRC_SIG = String.raw`
#include <stdio.h>
#include <signal.h>
#include <unistd.h>
static volatile sig_atomic_t got = 0;
static void handler(int sig) {
    got = sig;                              /* only async-signal-safe work here */
}
int main(void) {
    setvbuf(stdout, NULL, _IONBF, 0);
    signal(SIGUSR1, handler);
    signal(SIGALRM, handler);
    printf("sending SIGUSR1 to myself\n");
    kill(getpid(), SIGUSR1);
    printf("caught signal %d (SIGUSR1=%d)\n", got, SIGUSR1);
    alarm(1);                               /* kernel sends SIGALRM in 1 s */
    pause();                                /* sleep until a signal arrives */
    printf("caught signal %d (SIGALRM=%d)\n", got, SIGALRM);
    return 0;
}
`;
const OUT_SIG = String.raw`
sending SIGUSR1 to myself
caught signal 30 (SIGUSR1=30)
caught signal 14 (SIGALRM=14)
`;

const c83 = L('ics102-ts-8-3',
  '8.3 — Signals: sending, receiving, handlers and safe signal handling|||8.3 — Tín hiệu: gửi, nhận, bộ xử lý và xử lý tín hiệu an toàn',
  'Tín hiệu là ngoại lệ ở mức phần mềm; các tín hiệu thường gặp; gửi (kill, Ctrl+C, alarm), tín hiệu chờ và bị chặn, hành động mặc định, cài handler, quy tắc handler an toàn (async-signal-safe, volatile sig_atomic_t, errno), sigaction; chương trình chạy thật trên macOS (SIGUSR1 = 30, Linux = 10).',
  `<span class="eyebrow">ICS102 · Chapter 8 · Lesson 8.3</span>
<h2>Signals: sending, receiving, handlers and safe signal handling</h2>
<p class="lead">Hardware exceptions are handled by the kernel and invisible to programs. <strong>Signals</strong> are the higher-level mechanism that lets the kernel (and other processes) notify a process that something happened: you pressed Ctrl+C, a child terminated, a timer expired, the process touched invalid memory. Signals are why your program dies with “Segmentation fault”, and how servers reload configuration or shut down cleanly.</p>
<h3>🎯 Objectives</h3>
<ul><li>Name common signals and their default actions.</li><li>Explain sending, pending and blocked signals.</li><li>Install a signal handler and predict when it runs.</li><li>Apply the rules for writing safe handlers.</li></ul>
<h3>📖 Lecture</h3>
<h4>Common signals</h4>
<div class="formula"><span class="lbl">Some Linux signals (number — name — default action — cause)</span>2 SIGINT — terminate — Ctrl+C · 9 SIGKILL — terminate (cannot be caught or ignored) — kill -9 · 11 SIGSEGV — terminate + core dump — invalid memory reference · 14 SIGALRM — terminate — timer from alarm() · 15 SIGTERM — terminate — polite kill request · 17 SIGCHLD — ignore — a child stopped or terminated · 20 SIGTSTP — stop — Ctrl+Z · 10 / 12 SIGUSR1 / SIGUSR2 — terminate — user-defined</div>
<p>Numbers differ between systems (on macOS SIGUSR1 is 30, SIGCHLD is 20) — always use the names.</p>
<h4>Sending and receiving</h4>
<p>A signal is <strong>sent</strong> (delivered into the destination's state) when the kernel detects an event or a process calls <code>kill(pid, sig)</code> (also the <code>kill</code> command, Ctrl+C sends SIGINT to the foreground process group, <code>alarm(n)</code> schedules SIGALRM). A sent but not yet received signal is <strong>pending</strong>; there is at most one pending signal of each type — <strong>signals are not queued</strong>, extra ones are discarded. A process can <strong>block</strong> signals (<code>sigprocmask</code>); blocked signals stay pending. When the kernel is about to return to a process (e.g. after a context switch or system call), it checks for pending, unblocked signals and forces the process to <strong>receive</strong> one: the default action, ignore, or run a <strong>handler</strong> installed with <code>signal</code> or, better, <code>sigaction</code>.</p>
<h4>Writing safe handlers</h4>
<p>A handler runs concurrently with the main program — it can interrupt it between any two instructions, even in the middle of <code>printf</code> or <code>malloc</code>. Rules (CS:APP's guidelines):</p>
<ol><li>Keep handlers as simple as possible, e.g. just set a flag and return.</li><li>Call only <strong>async-signal-safe</strong> functions (<code>write</code>, <code>_exit</code>, <code>kill</code>… — not <code>printf</code>, <code>malloc</code>, <code>exit</code>).</li><li>Save and restore <code>errno</code>.</li><li>Block signals while accessing shared data structures.</li><li>Declare shared globals <code>volatile</code>; use <code>sig_atomic_t</code> for flags.</li></ol>
<p>And because signals are not queued, a SIGCHLD handler must reap <em>all</em> terminated children in a loop: <code>while (waitpid(-1, NULL, WNOHANG) &gt; 0) ;</code>.</p>
<h3>✍️ Worked example</h3>
` + C(SRC_SIG) + `
<p>Real output on macOS (on Linux SIGUSR1 prints as 10):</p>
` + out(OUT_SIG) + `
<p>The process sends SIGUSR1 to itself; the handler runs before <code>kill</code> returns and only stores the number in a <code>volatile sig_atomic_t</code>; printing is done in <code>main</code>, which is safe. Then <code>alarm(1)</code> asks the kernel for SIGALRM after one second, and <code>pause</code> sleeps until it arrives. Without a handler, SIGALRM's default action would have terminated the program.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Calling <code>printf</code> or <code>malloc</code> inside a handler — can deadlock or corrupt data.</li><li>Counting signals (“I received 5 SIGCHLD so 5 children ended”) — signals are not queued.</li><li>Trying to catch SIGKILL or SIGSTOP — impossible by design.</li><li>Busy-waiting with <code>while (!flag) ;</code> without <code>volatile</code> — the compiler may never re-read the flag.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Signals notify processes of events; each has a default action.</li><li>Pending signals are not queued; blocked ones wait.</li><li>Handlers run asynchronously: keep them tiny and async-signal-safe.</li><li>Use names, not numbers; prefer sigaction over signal.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://man7.org/linux/man-pages/man7/signal.7.html" target="_blank" rel="noopener">signal(7) — overview of Linux signals</a></li><li><a href="https://man7.org/linux/man-pages/man7/signal-safety.7.html" target="_blank" rel="noopener">signal-safety(7) — the list of async-signal-safe functions</a></li><li><a href="https://man7.org/linux/man-pages/man2/sigaction.2.html" target="_blank" rel="noopener">sigaction(2) — Linux manual page</a></li><li><a href="https://csapp.cs.cmu.edu/3e/labs.html" target="_blank" rel="noopener">CS:APP Shell Lab — write a shell with job control and signals</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Three children terminate almost at the same time while SIGCHLD is being handled. How many times may the handler run, and how must it be written?</li><li>Which default action does Ctrl+Z trigger, and which signal is it?</li><li>Why is <code>volatile sig_atomic_t</code> used for the flag?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Possibly only once or twice — extra SIGCHLD signals are discarded while one is pending; the handler must loop with <code>waitpid(-1, NULL, WNOHANG)</code> until no more children are ready. 2) SIGTSTP; default action: stop (suspend) the process. 3) <code>volatile</code> forces the compiler to read memory each time; <code>sig_atomic_t</code> guarantees reads/writes cannot be interrupted halfway.</p></div>`,
  `<span class="eyebrow">ICS102 · Chương 8 · Bài 8.3</span>
<h2>Tín hiệu: gửi, nhận, bộ xử lý và xử lý tín hiệu an toàn</h2>
<p class="lead">Ngoại lệ phần cứng do nhân xử lý và chương trình không thấy. <strong>Tín hiệu (signal)</strong> là cơ chế cao hơn để nhân (và tiến trình khác) báo cho một tiến trình rằng điều gì đó đã xảy ra: bạn bấm Ctrl+C, một tiến trình con kết thúc, bộ định giờ hết hạn, tiến trình chạm vào bộ nhớ không hợp lệ. Tín hiệu là lý do chương trình chết với “Segmentation fault”, và là cách server nạp lại cấu hình hay tắt êm.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Kể tên các tín hiệu thường gặp và hành động mặc định.</li><li>Giải thích tín hiệu được gửi, đang chờ và bị chặn.</li><li>Cài bộ xử lý tín hiệu và dự đoán khi nào nó chạy.</li><li>Áp dụng quy tắc viết bộ xử lý an toàn.</li></ul>
<h3>📖 Bài giảng</h3>
<h4>Các tín hiệu thường gặp</h4>
<div class="formula"><span class="lbl">Vài tín hiệu Linux (số — tên — hành động mặc định — nguyên nhân)</span>2 SIGINT — kết thúc — Ctrl+C · 9 SIGKILL — kết thúc (không bắt hay bỏ qua được) — kill -9 · 11 SIGSEGV — kết thúc + core dump — tham chiếu bộ nhớ sai · 14 SIGALRM — kết thúc — bộ định giờ của alarm() · 15 SIGTERM — kết thúc — yêu cầu kết thúc lịch sự · 17 SIGCHLD — bỏ qua — một con dừng hoặc kết thúc · 20 SIGTSTP — tạm dừng — Ctrl+Z · 10 / 12 SIGUSR1 / SIGUSR2 — kết thúc — do người dùng định nghĩa</div>
<p>Số hiệu khác nhau giữa các hệ (trên macOS SIGUSR1 là 30, SIGCHLD là 20) — luôn dùng tên.</p>
<h4>Gửi và nhận</h4>
<p>Tín hiệu được <strong>gửi</strong> (ghi vào trạng thái của tiến trình đích) khi nhân phát hiện sự kiện hoặc một tiến trình gọi <code>kill(pid, sig)</code> (cả lệnh <code>kill</code>, Ctrl+C gửi SIGINT tới nhóm tiến trình tiền cảnh, <code>alarm(n)</code> hẹn SIGALRM). Tín hiệu đã gửi mà chưa được nhận thì <strong>đang chờ (pending)</strong>; mỗi loại có tối đa một tín hiệu đang chờ — <strong>tín hiệu không xếp hàng</strong>, tín hiệu thừa bị bỏ. Tiến trình có thể <strong>chặn</strong> tín hiệu (<code>sigprocmask</code>); tín hiệu bị chặn tiếp tục chờ. Khi nhân sắp trả quyền về một tiến trình (vd sau chuyển ngữ cảnh hay lời gọi hệ thống), nó kiểm tín hiệu đang chờ không bị chặn và buộc tiến trình <strong>nhận</strong> một cái: hành động mặc định, bỏ qua, hoặc chạy <strong>bộ xử lý (handler)</strong> đã cài bằng <code>signal</code> hoặc tốt hơn là <code>sigaction</code>.</p>
<h4>Viết handler an toàn</h4>
<p>Handler chạy đồng thời với chương trình chính — nó có thể chen vào giữa hai lệnh bất kỳ, kể cả giữa lúc đang chạy <code>printf</code> hay <code>malloc</code>. Quy tắc (theo CS:APP):</p>
<ol><li>Giữ handler đơn giản nhất có thể, vd chỉ đặt một cờ rồi trả về.</li><li>Chỉ gọi hàm <strong>an toàn với tín hiệu bất đồng bộ</strong> (<code>write</code>, <code>_exit</code>, <code>kill</code>… — không phải <code>printf</code>, <code>malloc</code>, <code>exit</code>).</li><li>Lưu và khôi phục <code>errno</code>.</li><li>Chặn tín hiệu khi truy cập cấu trúc dữ liệu dùng chung.</li><li>Khai báo biến toàn cục dùng chung là <code>volatile</code>; dùng <code>sig_atomic_t</code> cho cờ.</li></ol>
<p>Và vì tín hiệu không xếp hàng, handler SIGCHLD phải thu dọn <em>mọi</em> tiến trình con đã kết thúc trong một vòng lặp: <code>while (waitpid(-1, NULL, WNOHANG) &gt; 0) ;</code>.</p>
<h3>✍️ Ví dụ</h3>
` + C(SRC_SIG) + `
<p>Output thật trên macOS (trên Linux SIGUSR1 in ra 10):</p>
` + out(OUT_SIG) + `
<p>Tiến trình tự gửi SIGUSR1 cho mình; handler chạy trước khi <code>kill</code> trả về và chỉ lưu số hiệu vào một biến <code>volatile sig_atomic_t</code>; việc in được làm ở <code>main</code>, an toàn. Sau đó <code>alarm(1)</code> nhờ nhân gửi SIGALRM sau một giây, và <code>pause</code> ngủ tới khi nó tới. Không có handler, hành động mặc định của SIGALRM đã kết thúc chương trình.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Gọi <code>printf</code> hay <code>malloc</code> trong handler — có thể treo hoặc hỏng dữ liệu.</li><li>Đếm tín hiệu (“nhận 5 SIGCHLD nên 5 con đã kết thúc”) — tín hiệu không xếp hàng.</li><li>Cố bắt SIGKILL hay SIGSTOP — không thể, do thiết kế.</li><li>Chờ bận <code>while (!flag) ;</code> mà không có <code>volatile</code> — trình biên dịch có thể không bao giờ đọc lại cờ.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Tín hiệu báo sự kiện cho tiến trình; mỗi loại có hành động mặc định.</li><li>Tín hiệu đang chờ không xếp hàng; tín hiệu bị chặn phải đợi.</li><li>Handler chạy bất đồng bộ: giữ nhỏ và chỉ dùng hàm an toàn.</li><li>Dùng tên, không dùng số; ưu tiên sigaction hơn signal.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://man7.org/linux/man-pages/man7/signal.7.html" target="_blank" rel="noopener">signal(7) — tổng quan tín hiệu Linux</a></li><li><a href="https://man7.org/linux/man-pages/man7/signal-safety.7.html" target="_blank" rel="noopener">signal-safety(7) — danh sách hàm an toàn với tín hiệu</a></li><li><a href="https://man7.org/linux/man-pages/man2/sigaction.2.html" target="_blank" rel="noopener">sigaction(2) — man page Linux</a></li><li><a href="https://csapp.cs.cmu.edu/3e/labs.html" target="_blank" rel="noopener">CS:APP Shell Lab — viết shell có điều khiển job và tín hiệu</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Ba tiến trình con kết thúc gần như cùng lúc khi SIGCHLD đang được xử lý. Handler có thể chạy mấy lần, và phải viết thế nào?</li><li>Ctrl+Z kích hoạt hành động mặc định nào, là tín hiệu gì?</li><li>Vì sao dùng <code>volatile sig_atomic_t</code> cho cờ?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Có thể chỉ một hoặc hai lần — SIGCHLD thừa bị bỏ khi đã có một cái đang chờ; handler phải lặp <code>waitpid(-1, NULL, WNOHANG)</code> tới khi không còn con nào sẵn sàng. 2) SIGTSTP; hành động mặc định: tạm dừng tiến trình. 3) <code>volatile</code> buộc trình biên dịch đọc bộ nhớ mỗi lần; <code>sig_atomic_t</code> bảo đảm việc đọc/ghi không bị chen ngang giữa chừng.</p></div>`);

const q8 = QZ(8, 'Quiz — Chapter 8: Exceptional control flow|||Quiz — Chương 8: Luồng điều khiển ngoại lệ', 'Kiểm tra chương 8: bốn lớp ngoại lệ, syscall, segfault, tiến trình, fork/waitpid/execve, zombie, tín hiệu và handler an toàn.', [
  Q('q1', 'A system call is which class of exception?|||Lời gọi hệ thống thuộc lớp ngoại lệ nào?',
    ['Interrupt|||Ngắt', 'Trap|||Bẫy', 'Fault|||Lỗi', 'Abort|||Huỷ bỏ'], 1,
    'It is an intentional, synchronous exception that returns to the next instruction.|||Đó là ngoại lệ cố ý, đồng bộ, quay về lệnh kế tiếp.'),
  Q('q2', 'After a page fault is handled successfully, execution continues with|||Sau khi lỗi trang được xử lý thành công, chương trình chạy tiếp ở',
    ['the next instruction|||lệnh kế tiếp', 'the faulting instruction, re-executed|||chính lệnh gây lỗi, chạy lại', 'main|||main', 'the exception handler forever|||handler mãi mãi'], 1,
    'Faults return to the current instruction.|||Lỗi (fault) quay về lệnh hiện tại.'),
  Q('q3', 'A program killed by SIGSEGV (signal 11) shows shell exit status|||Chương trình bị SIGSEGV (tín hiệu 11) giết có mã thoát trong shell là',
    ['11|||11', '1|||1', '139|||139', '0|||0'], 2,
    '128 + 11 = 139, as measured.|||128 + 11 = 139, như đã đo.'),
  Q('q4', 'fork() returns|||fork() trả về',
    ['once, the child PID|||một lần, PID của con', 'twice: 0 in the child and the child PID in the parent|||hai lần: 0 ở con và PID của con ở cha', 'twice: the parent PID in both|||hai lần: PID của cha ở cả hai', 'never|||không bao giờ'], 1,
    'Called once, returns twice.|||Gọi một lần, trả về hai lần.'),
  Q('q5', 'int x = 1; if (fork() == 0) x++; — after fork, the parent\'s x is|||int x = 1; if (fork() == 0) x++; — sau fork, x của cha là',
    ['2|||2', '1|||1', 'undefined|||không xác định', '0|||0'], 1,
    'The child changes its own copy.|||Con sửa bản sao của riêng nó.'),
  Q('q6', 'How many processes exist after fork(); fork(); fork(); (starting from one)?|||Có bao nhiêu tiến trình sau fork(); fork(); fork(); (bắt đầu từ một)?',
    ['3|||3', '4|||4', '6|||6', '8|||8'], 3,
    'Each fork doubles the count: 2³ = 8.|||Mỗi fork nhân đôi số tiến trình: 2³ = 8.'),
  Q('q7', 'execve returns to the caller|||execve trả về cho hàm gọi',
    ['always|||luôn luôn', 'only on error|||chỉ khi lỗi', 'after the new program ends|||sau khi chương trình mới kết thúc', 'with the child PID|||kèm PID của con'], 1,
    'On success the calling program is replaced.|||Khi thành công, chương trình gọi bị thay thế.'),
  Q('q8', 'A zombie process is|||Tiến trình zombie là',
    ['a process using 100% CPU|||tiến trình dùng 100% CPU', 'a terminated process not yet reaped by its parent|||tiến trình đã kết thúc nhưng chưa được cha thu dọn', 'a process without a parent|||tiến trình không có cha', 'a stopped process|||tiến trình bị tạm dừng'], 1,
    'We saw it as state Z (<defunct>) until waitpid.|||Ta đã thấy nó ở trạng thái Z (<defunct>) cho tới khi waitpid.'),
  Q('q9', 'Which signal cannot be caught, blocked or ignored?|||Tín hiệu nào không thể bắt, chặn hay bỏ qua?',
    ['SIGINT|||SIGINT', 'SIGTERM|||SIGTERM', 'SIGKILL|||SIGKILL', 'SIGCHLD|||SIGCHLD'], 2,
    'SIGKILL (and SIGSTOP) always take their default action.|||SIGKILL (và SIGSTOP) luôn thực hiện hành động mặc định.'),
  Q('q10', 'Which is safe to call inside a signal handler?|||Hàm nào an toàn để gọi trong handler tín hiệu?',
    ['printf|||printf', 'malloc|||malloc', 'write|||write', 'exit|||exit'], 2,
    'write is async-signal-safe; printf, malloc and exit are not.|||write an toàn với tín hiệu bất đồng bộ; printf, malloc và exit thì không.'),
]);

const ch8 = {
  title: 'Chapter 8 — Exceptional control flow: exceptions, processes, signals|||Chương 8 — Luồng điều khiển ngoại lệ: ngoại lệ, tiến trình, tín hiệu',
  description: 'Bốn lớp ngoại lệ, lời gọi hệ thống, segfault chạy thật; fork/waitpid/execve/zombie với bốn chương trình chạy thật; tín hiệu, handler an toàn, alarm/kill chạy thật (CS:APP chương 8).',
  lessons: [c81, c82, c83, q8],
};

// ───────────────────────────── Chương 9 — Bộ nhớ ảo ─────────────────────────────
const SRC_VM = String.raw`
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/mman.h>
int global = 1;
int main(void) {
    int local = 2;
    int *heap = malloc(sizeof(int));
    printf("page size      : %ld bytes\n", sysconf(_SC_PAGESIZE));
    printf("code  (main)   : %p\n", (void *)main);
    printf("data  (global) : %p\n", (void *)&global);
    printf("heap  (malloc) : %p\n", (void *)heap);
    printf("stack (local)  : %p\n", (void *)&local);
    size_t len = 1 << 20;                    /* 1 MiB anonymous mapping */
    char *m = mmap(NULL, len, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANON, -1, 0);
    if (m == MAP_FAILED) { perror("mmap"); return 1; }
    strcpy(m, "mapped memory works");
    printf("mmap region    : %p -> \"%s\"\n", (void *)m, m);
    munmap(m, len);
    for (int i = 0; i < 3; i++) {
        void *p = malloc(1 + i * 10);
        printf("malloc(%2d) -> %p  (address %% 16 = %lu)\n", 1 + i * 10, p, (unsigned long)p % 16);
    }
    free(heap);
    return 0;
}
`;
const OUT_VM = String.raw`
$ cc -O1 vm.c -o vm && ./vm                    # native arm64
page size      : 16384 bytes
code  (main)   : 0x1041f84f8
data  (global) : 0x104200000
heap  (malloc) : 0x104b61260
stack (local)  : 0x16bc0654c
mmap region    : 0x104218000 -> "mapped memory works"
malloc( 1) -> 0x104b61270  (address % 16 = 0)
malloc(11) -> 0x104b61280  (address % 16 = 0)
malloc(21) -> 0x104b61290  (address % 16 = 0)
$ cc -arch x86_64 -O1 vm.c -o vm86 && ./vm86 | head -1    # same program as x86-64
page size      : 4096 bytes
`;

const c91 = L('ics102-ts-9-1',
  '9.1 — Virtual memory: address spaces, pages, page tables and page faults|||9.1 — Bộ nhớ ảo: không gian địa chỉ, trang, bảng trang và lỗi trang',
  'Địa chỉ vật lý và địa chỉ ảo, MMU; bộ nhớ ảo như công cụ đệm (trang, bảng trang, trúng trang, lỗi trang, phân trang theo yêu cầu, thrashing), công cụ quản lý bộ nhớ (không gian riêng, chia sẻ) và công cụ bảo vệ (bit quyền); in bố cục bộ nhớ của tiến trình chạy thật.',
  `<span class="eyebrow">ICS102 · Chapter 9 · Lesson 9.1</span>
<h2>Virtual memory: address spaces, pages, page tables and page faults</h2>
<p class="lead">Every pointer you have printed so far was a <strong>virtual</strong> address. Virtual memory (VM) is one of the great ideas of computer science: with a bit of hardware and OS cooperation it gives each process a huge, private, uniform address space, uses DRAM as a cache for disk, simplifies linking and loading, and protects processes from each other.</p>
<h3>🎯 Objectives</h3>
<ul><li>Distinguish physical and virtual addressing and the role of the MMU.</li><li>Explain VM as a caching tool: pages, page table, page hit, page fault.</li><li>Explain VM as a tool for memory management and for protection.</li><li>Observe a process's address-space layout and page size.</li></ul>
<h3>📖 Lecture</h3>
<h4>Physical vs virtual addressing</h4>
<p>Physical memory is an array of M bytes, each with a physical address (PA). With virtual addressing the CPU generates a <strong>virtual address (VA)</strong>; the <strong>memory management unit (MMU)</strong> on the CPU chip translates it to a PA using a table kept in memory by the OS. A virtual address space has N = 2<sup>n</sup> addresses (x86-64 today uses n = 48: 256 TiB per process).</p>
<h4>VM as a tool for caching</h4>
<p>The virtual address space is divided into fixed-size <strong>virtual pages</strong> (P = 2<sup>p</sup> bytes, usually 4 KiB; Apple Silicon uses 16 KiB), physical memory into <strong>physical pages</strong> (page frames) of the same size. Each virtual page is <em>unallocated</em>, <em>cached</em> (in DRAM) or <em>uncached</em> (only on disk). DRAM thus acts as a <strong>fully associative, write-back cache</strong> for the disk with a huge miss penalty, so pages are big and replacement is clever.</p>
<p>The <strong>page table</strong> — one per process, in DRAM — is an array of page-table entries (PTEs): a valid bit plus the physical page number if the page is cached, or the disk location otherwise.</p>
<ul>
<li><strong>Page hit</strong>: the PTE is valid; the MMU builds the physical address.</li>
<li><strong>Page fault</strong>: the PTE is not valid. The fault handler picks a victim page (writing it back to disk if modified), loads the needed page, updates the PTE and <strong>restarts the faulting instruction</strong>, which now hits.</li>
</ul>
<p>Pages are brought in only when first touched: <strong>demand paging</strong>. Thanks to locality the set of pages in active use — the <strong>working set</strong> — usually fits in memory. If it does not, pages are swapped in and out constantly: <strong>thrashing</strong>, and the machine crawls.</p>
<h4>VM as a tool for memory management</h4>
<ul>
<li>Every process gets the <strong>same layout</strong> (code at a fixed region, then data, heap, shared libraries, stack): the linker can produce fixed addresses (chapter 7) and the loader just creates page-table entries (“mapping”) without copying anything.</li>
<li><strong>Sharing</strong>: the same physical page (e.g. libc code) can be mapped into many processes.</li>
<li>Allocating contiguous virtual memory does not require contiguous physical memory.</li>
</ul>
<h4>VM as a tool for protection</h4>
<p>PTEs carry permission bits — READ, WRITE, EXEC, SUP (kernel only). The MMU checks them on every access; a violation is a protection fault, which Linux reports as SIGSEGV (“segmentation fault”). This is what makes the code segment read-only and the stack non-executable (lesson 4.4).</p>
<h3>✍️ Worked example — look at a real address space</h3>
` + C(SRC_VM) + `
` + out(OUT_VM) + `
<p>Code and global data are at low addresses, near each other; the heap is above them; the stack is far higher (0x16b…); an <code>mmap</code> region was placed between. The page size is <strong>16 KiB</strong> on Apple Silicon, but the very same program built for x86-64 (running under Rosetta) reports the classic <strong>4 KiB</strong>. Every malloc result is a multiple of 16 — the alignment malloc guarantees (lesson 9.3). Addresses change on every run because of ASLR.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Thinking a pointer value is a physical address.</li><li>Thinking a page fault is an error — most are normal (demand paging).</li><li>Believing a program can only use as much memory as there is RAM — it can use more (paging to disk), just very slowly.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>The MMU translates virtual to physical addresses using a per-process page table.</li><li>DRAM caches virtual pages; page hit vs page fault; demand paging; thrashing when the working set does not fit.</li><li>Uniform layouts simplify linking, loading and sharing.</li><li>Permission bits in PTEs enforce protection.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Virtual_memory" target="_blank" rel="noopener">Wikipedia — Virtual memory</a></li><li><a href="https://pages.cs.wisc.edu/~remzi/OSTEP/vm-intro.pdf" target="_blank" rel="noopener">OSTEP — The Abstraction: Address Spaces (PDF)</a></li><li><a href="https://pages.cs.wisc.edu/~remzi/OSTEP/vm-paging.pdf" target="_blank" rel="noopener">OSTEP — Paging: Introduction (PDF)</a></li><li><a href="https://en.wikipedia.org/wiki/Page_table" target="_blank" rel="noopener">Wikipedia — Page table</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>With 48-bit virtual addresses and 4 KiB pages, how many virtual pages does a process have?</li><li>Two processes print the same pointer value 0x5555_5555_4000 for different variables. Is this a bug?</li><li>Why does writing to a string literal (<code>char *s = "hi"; s[0] = 'H';</code>) crash?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 2<sup>48</sup> / 2<sup>12</sup> = 2<sup>36</sup> ≈ 6.9 × 10<sup>10</sup> pages. 2) No: each process has its own address space; the same VA maps to different physical pages. 3) String literals are in .rodata, mapped read-only; the write violates the PTE permission → SIGSEGV.</p></div>`,
  `<span class="eyebrow">ICS102 · Chương 9 · Bài 9.1</span>
<h2>Bộ nhớ ảo: không gian địa chỉ, trang, bảng trang và lỗi trang</h2>
<p class="lead">Mọi con trỏ bạn in ra tới giờ đều là địa chỉ <strong>ảo</strong>. Bộ nhớ ảo (VM) là một trong những ý tưởng lớn của khoa học máy tính: với chút phần cứng và sự phối hợp của hệ điều hành, nó cho mỗi tiến trình một không gian địa chỉ khổng lồ, riêng, đồng nhất; dùng DRAM làm cache cho đĩa; đơn giản hoá liên kết và nạp; và bảo vệ các tiến trình khỏi nhau.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phân biệt đánh địa chỉ vật lý và ảo, vai trò của MMU.</li><li>Giải thích VM như công cụ đệm: trang, bảng trang, trúng trang, lỗi trang.</li><li>Giải thích VM như công cụ quản lý bộ nhớ và bảo vệ.</li><li>Quan sát bố cục không gian địa chỉ và kích thước trang của một tiến trình.</li></ul>
<h3>📖 Bài giảng</h3>
<h4>Địa chỉ vật lý và địa chỉ ảo</h4>
<p>Bộ nhớ vật lý là một mảng M byte, mỗi byte có một địa chỉ vật lý (PA). Với đánh địa chỉ ảo, CPU sinh ra <strong>địa chỉ ảo (VA)</strong>; <strong>khối quản lý bộ nhớ (MMU)</strong> trên chip CPU dịch nó sang PA bằng một bảng mà hệ điều hành giữ trong bộ nhớ. Không gian địa chỉ ảo có N = 2<sup>n</sup> địa chỉ (x86-64 hiện dùng n = 48: 256 TiB mỗi tiến trình).</p>
<h4>VM như công cụ đệm</h4>
<p>Không gian địa chỉ ảo chia thành các <strong>trang ảo</strong> kích thước cố định (P = 2<sup>p</sup> byte, thường 4 KiB; Apple Silicon dùng 16 KiB), bộ nhớ vật lý chia thành <strong>trang vật lý</strong> (khung trang) cùng kích thước. Mỗi trang ảo hoặc <em>chưa cấp phát</em>, hoặc <em>đã đệm</em> (trong DRAM), hoặc <em>chưa đệm</em> (chỉ có trên đĩa). Vậy DRAM đóng vai một <strong>cache kết hợp toàn phần, ghi sau</strong> cho đĩa với chi phí trượt rất lớn, nên trang to và thuật toán thay thế phải khôn.</p>
<p><strong>Bảng trang</strong> — mỗi tiến trình một bảng, nằm trong DRAM — là một mảng các mục bảng trang (PTE): một bit hợp lệ cộng số trang vật lý nếu trang đã đệm, hoặc vị trí trên đĩa nếu chưa.</p>
<ul>
<li><strong>Trúng trang</strong>: PTE hợp lệ; MMU dựng địa chỉ vật lý.</li>
<li><strong>Lỗi trang</strong>: PTE không hợp lệ. Handler chọn một trang nạn nhân (ghi về đĩa nếu đã bị sửa), nạp trang cần dùng, cập nhật PTE và <strong>chạy lại lệnh gây lỗi</strong>, giờ thì trúng.</li>
</ul>
<p>Trang chỉ được đưa vào khi lần đầu bị chạm: <strong>phân trang theo yêu cầu (demand paging)</strong>. Nhờ tính cục bộ, tập trang đang được dùng — <strong>tập làm việc (working set)</strong> — thường vừa bộ nhớ. Nếu không vừa, trang bị đưa vào đưa ra liên tục: <strong>thrashing</strong>, máy chạy rùa bò.</p>
<h4>VM như công cụ quản lý bộ nhớ</h4>
<ul>
<li>Mọi tiến trình có <strong>cùng bố cục</strong> (mã ở vùng cố định, rồi dữ liệu, heap, thư viện dùng chung, ngăn xếp): bộ liên kết tạo được địa chỉ cố định (chương 7) và bộ nạp chỉ cần tạo mục bảng trang (“ánh xạ”) mà không chép gì.</li>
<li><strong>Chia sẻ</strong>: cùng một trang vật lý (vd mã libc) được ánh xạ vào nhiều tiến trình.</li>
<li>Cấp vùng nhớ ảo liền nhau không đòi hỏi bộ nhớ vật lý liền nhau.</li>
</ul>
<h4>VM như công cụ bảo vệ</h4>
<p>PTE mang các bit quyền — READ, WRITE, EXEC, SUP (chỉ nhân). MMU kiểm chúng ở mọi lần truy cập; vi phạm là lỗi bảo vệ, Linux báo bằng SIGSEGV (“segmentation fault”). Chính điều này làm đoạn mã chỉ đọc và ngăn xếp không thực thi được (bài 4.4).</p>
<h3>✍️ Ví dụ — nhìn một không gian địa chỉ thật</h3>
` + C(SRC_VM) + `
` + out(OUT_VM) + `
<p>Mã và dữ liệu toàn cục ở địa chỉ thấp, gần nhau; heap ở trên chúng; ngăn xếp cao hơn hẳn (0x16b…); một vùng <code>mmap</code> được đặt ở giữa. Kích thước trang là <strong>16 KiB</strong> trên Apple Silicon, nhưng cùng chương trình đó dựng cho x86-64 (chạy dưới Rosetta) báo <strong>4 KiB</strong> kinh điển. Mọi kết quả malloc là bội của 16 — mức căn lề mà malloc bảo đảm (bài 9.3). Địa chỉ đổi mỗi lần chạy do ASLR.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Tưởng giá trị con trỏ là địa chỉ vật lý.</li><li>Tưởng lỗi trang là lỗi chương trình — đa số là bình thường (phân trang theo yêu cầu).</li><li>Tin rằng chương trình chỉ dùng được bằng dung lượng RAM — nó dùng được nhiều hơn (phân trang ra đĩa), chỉ là rất chậm.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>MMU dịch địa chỉ ảo sang vật lý nhờ bảng trang riêng của từng tiến trình.</li><li>DRAM đệm các trang ảo; trúng trang và lỗi trang; phân trang theo yêu cầu; thrashing khi tập làm việc không vừa.</li><li>Bố cục đồng nhất đơn giản hoá liên kết, nạp và chia sẻ.</li><li>Bit quyền trong PTE thực thi việc bảo vệ.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Virtual_memory" target="_blank" rel="noopener">Wikipedia — Bộ nhớ ảo</a></li><li><a href="https://pages.cs.wisc.edu/~remzi/OSTEP/vm-intro.pdf" target="_blank" rel="noopener">OSTEP — The Abstraction: Address Spaces (PDF)</a></li><li><a href="https://pages.cs.wisc.edu/~remzi/OSTEP/vm-paging.pdf" target="_blank" rel="noopener">OSTEP — Paging: Introduction (PDF)</a></li><li><a href="https://en.wikipedia.org/wiki/Page_table" target="_blank" rel="noopener">Wikipedia — Bảng trang</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Với địa chỉ ảo 48 bit và trang 4 KiB, một tiến trình có bao nhiêu trang ảo?</li><li>Hai tiến trình in cùng giá trị con trỏ 0x5555_5555_4000 cho hai biến khác nhau. Có phải lỗi không?</li><li>Vì sao ghi vào chuỗi hằng (<code>char *s = "hi"; s[0] = 'H';</code>) làm chương trình sập?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 2<sup>48</sup> / 2<sup>12</sup> = 2<sup>36</sup> ≈ 6,9 × 10<sup>10</sup> trang. 2) Không: mỗi tiến trình có không gian địa chỉ riêng; cùng VA ánh xạ tới các trang vật lý khác nhau. 3) Chuỗi hằng nằm trong .rodata, được ánh xạ chỉ đọc; phép ghi vi phạm quyền của PTE → SIGSEGV.</p></div>`);

const c92 = L('ics102-ts-9-2',
  '9.2 — Address translation: VPN and VPO, the TLB and multi-level page tables|||9.2 — Dịch địa chỉ: VPN và VPO, TLB và bảng trang nhiều cấp',
  'Chia địa chỉ ảo thành VPN và VPO, dịch sang địa chỉ vật lý từng bước, các bước MMU khi trúng/lỗi trang, TLB như cache của PTE (chia TLBI/TLBT), vì sao cần bảng trang nhiều cấp, bảng 4 cấp của x86-64; bài tính số giải từng bước.',
  `<span class="eyebrow">ICS102 · Chapter 9 · Lesson 9.2</span>
<h2>Address translation: VPN and VPO, the TLB and multi-level page tables</h2>
<p class="lead">Every load, store and instruction fetch needs a translation from virtual to physical address — billions per second. This lesson shows exactly how the MMU does it, why a small cache called the TLB is essential, and how multi-level page tables keep the page table itself from eating all the memory.</p>
<h3>🎯 Objectives</h3>
<ul><li>Split a virtual address into VPN and VPO and build the physical address.</li><li>List the steps of a translation on a page hit and on a page fault.</li><li>Explain the TLB and split a VPN into TLB index and tag.</li><li>Compute page-table sizes and explain multi-level page tables.</li></ul>
<h3>📖 Lecture</h3>
<h4>The address split</h4>
<div class="formula"><span class="lbl">Address translation with P = 2^p byte pages</span>VA = | VPN (virtual page number): n − p bits | VPO (virtual page offset): p bits |<br>PA = | PPN (physical page number): m − p bits | PPO = VPO: p bits |<br>PA = PTE[VPN].PPN · 2<sup>p</sup> + VPO</div>
<p>The offset never changes during translation — only the page number is replaced.</p>
<div class="callout"><p><b>Worked example.</b> 32-bit VA, 4 KiB pages (p = 12). VA = 0x00403ABC.<br>Step 1: VPO = low 12 bits = <b>0xABC</b>; VPN = the rest = <b>0x00403</b>.<br>Step 2: the MMU reads PTE number 0x403 from the page table (its address = page-table base register + 0x403 × PTE size). Suppose it is valid with PPN = 0x2F1.<br>Step 3: PA = 0x2F1 followed by 0xABC = <b>0x2F1ABC</b>.</p></div>
<h4>Steps of a translation</h4>
<ol><li>The CPU sends the VA to the MMU.</li><li>The MMU computes the PTE address and requests the PTE from the cache/memory.</li><li>The PTE comes back. If valid (page hit): the MMU builds the PA and sends it to the cache/memory, which returns the data.</li><li>If not valid (page fault): an exception transfers control to the kernel's page-fault handler, which loads the page, updates the PTE and restarts the instruction.</li></ol>
<h4>The TLB</h4>
<p>Reading a PTE from memory on every access would double memory traffic. The MMU therefore has a small, fast cache of PTEs: the <strong>translation lookaside buffer (TLB)</strong>, typically set-associative with a few dozen to a few thousand entries. The VPN is split into a <strong>TLB index</strong> (low bits, choose the set) and a <strong>TLB tag</strong> (the rest). A TLB hit translates in about one cycle; a TLB miss requires walking the page table. Because of locality, the TLB hits almost always — but programs that jump around huge memory regions can suffer TLB misses (huge pages of 2 MiB help).</p>
<div class="callout"><p><b>Worked example — TLB fields.</b> VPN of 20 bits, TLB with 16 sets (4-way, 64 entries).<br>TLBI = low log<sub>2</sub>16 = 4 bits of the VPN; TLBT = the remaining 16 bits. For VPN 0x00403: TLBI = 0x3, TLBT = 0x0040.</p></div>
<h4>Multi-level page tables</h4>
<p>A single-level table needs one PTE per virtual page, used or not. With 48-bit addresses, 4 KiB pages and 8-byte PTEs: 2<sup>36</sup> × 8 bytes = <strong>512 GiB per process</strong> — impossible. Solution: a <strong>hierarchy</strong>. The level-1 table points to level-2 tables, and so on; a level-k table that covers only unallocated memory simply does not exist. Since a typical address space is mostly empty (a big hole between heap and stack), almost all of the hierarchy is never created.</p>
<p>x86-64 (Intel Core i7 and later) uses <strong>4 levels</strong>: the 36-bit VPN is split into four 9-bit indices (each table has 512 entries of 8 bytes = exactly one 4 KiB page), then a 12-bit offset. The register CR3 holds the address of the level-1 table of the current process; a context switch changes CR3.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Translating the offset — the VPO is copied unchanged.</li><li>Confusing the TLB (caches translations) with the L1 cache (caches data).</li><li>Thinking a TLB miss is a page fault: a TLB miss is resolved by reading the page table (hardware); a page fault needs the OS and maybe the disk.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>VA = VPN | VPO; PA = PPN | PPO with PPO = VPO.</li><li>The MMU reads PTE[VPN]; valid → PA; invalid → page-fault handler.</li><li>The TLB caches PTEs; VPN = TLB tag | TLB index.</li><li>Multi-level page tables (4 levels on x86-64) only exist for used regions.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Translation_lookaside_buffer" target="_blank" rel="noopener">Wikipedia — Translation lookaside buffer</a></li><li><a href="https://pages.cs.wisc.edu/~remzi/OSTEP/vm-tlbs.pdf" target="_blank" rel="noopener">OSTEP — Paging: Faster Translations (TLBs) (PDF)</a></li><li><a href="https://pages.cs.wisc.edu/~remzi/OSTEP/vm-smalltables.pdf" target="_blank" rel="noopener">OSTEP — Paging: Smaller Tables (multi-level) (PDF)</a></li><li><a href="https://en.wikipedia.org/wiki/Memory_management_unit" target="_blank" rel="noopener">Wikipedia — Memory management unit</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>16-bit VA, 256-byte pages. For VA 0x3A7F give VPN and VPO. If PTE[VPN] has PPN 0x12, what is the PA?</li><li>32-bit VA, 4 KiB pages, 4-byte PTEs. How big is a single-level page table?</li><li>Why does each x86-64 page-table level use 9 bits?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) p = 8: VPO = 0x7F, VPN = 0x3A; PA = 0x127F. 2) 2<sup>20</sup> entries × 4 B = 4 MiB per process. 3) A table must fit in one 4 KiB page: 4096 / 8 bytes per PTE = 512 = 2<sup>9</sup> entries.</p></div>`,
  `<span class="eyebrow">ICS102 · Chương 9 · Bài 9.2</span>
<h2>Dịch địa chỉ: VPN và VPO, TLB và bảng trang nhiều cấp</h2>
<p class="lead">Mỗi lệnh load, store và mỗi lần lấy lệnh đều cần dịch địa chỉ ảo sang vật lý — hàng tỉ lần mỗi giây. Bài này cho thấy chính xác MMU làm điều đó thế nào, vì sao một cache nhỏ gọi là TLB là thiết yếu, và bảng trang nhiều cấp giữ cho chính bảng trang không nuốt hết bộ nhớ ra sao.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Chia địa chỉ ảo thành VPN và VPO, dựng địa chỉ vật lý.</li><li>Liệt kê các bước dịch khi trúng trang và khi lỗi trang.</li><li>Giải thích TLB và chia VPN thành chỉ số và tag của TLB.</li><li>Tính kích thước bảng trang và giải thích bảng trang nhiều cấp.</li></ul>
<h3>📖 Bài giảng</h3>
<h4>Chia địa chỉ</h4>
<div class="formula"><span class="lbl">Dịch địa chỉ với trang P = 2^p byte</span>VA = | VPN (số trang ảo): n − p bit | VPO (độ dời trong trang ảo): p bit |<br>PA = | PPN (số trang vật lý): m − p bit | PPO = VPO: p bit |<br>PA = PTE[VPN].PPN · 2<sup>p</sup> + VPO</div>
<p>Độ dời không đổi khi dịch — chỉ số trang được thay.</p>
<div class="callout"><p><b>Ví dụ giải từng bước.</b> VA 32 bit, trang 4 KiB (p = 12). VA = 0x00403ABC.<br>Bước 1: VPO = 12 bit thấp = <b>0xABC</b>; VPN = phần còn lại = <b>0x00403</b>.<br>Bước 2: MMU đọc PTE số 0x403 từ bảng trang (địa chỉ của nó = thanh ghi cơ sở bảng trang + 0x403 × kích thước PTE). Giả sử nó hợp lệ với PPN = 0x2F1.<br>Bước 3: PA = 0x2F1 nối với 0xABC = <b>0x2F1ABC</b>.</p></div>
<h4>Các bước dịch</h4>
<ol><li>CPU gửi VA tới MMU.</li><li>MMU tính địa chỉ PTE và yêu cầu PTE từ cache/bộ nhớ.</li><li>PTE trả về. Nếu hợp lệ (trúng trang): MMU dựng PA và gửi tới cache/bộ nhớ, nơi trả dữ liệu về.</li><li>Nếu không hợp lệ (lỗi trang): ngoại lệ chuyển điều khiển cho handler lỗi trang của nhân, handler nạp trang, cập nhật PTE và chạy lại lệnh.</li></ol>
<h4>TLB</h4>
<p>Đọc PTE từ bộ nhớ ở mọi lần truy cập sẽ nhân đôi lưu lượng bộ nhớ. Vì vậy MMU có một cache PTE nhỏ và nhanh: <strong>bộ đệm dịch địa chỉ (TLB)</strong>, thường kết hợp tập với vài chục tới vài nghìn mục. VPN được chia thành <strong>chỉ số TLB</strong> (bit thấp, chọn tập) và <strong>tag TLB</strong> (phần còn lại). Trúng TLB dịch trong khoảng một chu kỳ; trượt TLB thì phải đi dò bảng trang. Nhờ tính cục bộ, TLB gần như luôn trúng — nhưng chương trình nhảy lung tung trên vùng nhớ khổng lồ có thể chịu trượt TLB (trang lớn 2 MiB giúp giảm).</p>
<div class="callout"><p><b>Ví dụ — các trường TLB.</b> VPN 20 bit, TLB 16 tập (4 đường, 64 mục).<br>TLBI = log<sub>2</sub>16 = 4 bit thấp của VPN; TLBT = 16 bit còn lại. Với VPN 0x00403: TLBI = 0x3, TLBT = 0x0040.</p></div>
<h4>Bảng trang nhiều cấp</h4>
<p>Bảng trang một cấp cần một PTE cho mỗi trang ảo, dù dùng hay không. Với địa chỉ 48 bit, trang 4 KiB và PTE 8 byte: 2<sup>36</sup> × 8 byte = <strong>512 GiB mỗi tiến trình</strong> — bất khả thi. Giải pháp: <strong>phân cấp</strong>. Bảng cấp 1 trỏ tới các bảng cấp 2, cứ thế; bảng cấp k chỉ phủ vùng chưa cấp phát thì đơn giản là không tồn tại. Vì không gian địa chỉ điển hình phần lớn trống (một lỗ lớn giữa heap và ngăn xếp), gần như toàn bộ hệ phân cấp không bao giờ được tạo.</p>
<p>x86-64 (Intel Core i7 trở đi) dùng <strong>4 cấp</strong>: VPN 36 bit chia thành bốn chỉ số 9 bit (mỗi bảng có 512 mục 8 byte = đúng một trang 4 KiB), rồi độ dời 12 bit. Thanh ghi CR3 giữ địa chỉ bảng cấp 1 của tiến trình hiện tại; chuyển ngữ cảnh thì đổi CR3.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dịch cả độ dời — VPO được chép nguyên.</li><li>Lẫn TLB (đệm bản dịch) với cache L1 (đệm dữ liệu).</li><li>Tưởng trượt TLB là lỗi trang: trượt TLB được giải quyết bằng cách đọc bảng trang (phần cứng); lỗi trang cần hệ điều hành và có thể cả đĩa.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>VA = VPN | VPO; PA = PPN | PPO với PPO = VPO.</li><li>MMU đọc PTE[VPN]; hợp lệ → PA; không hợp lệ → handler lỗi trang.</li><li>TLB đệm PTE; VPN = tag TLB | chỉ số TLB.</li><li>Bảng trang nhiều cấp (4 cấp trên x86-64) chỉ tồn tại cho vùng đang dùng.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Translation_lookaside_buffer" target="_blank" rel="noopener">Wikipedia — Translation lookaside buffer (TLB)</a></li><li><a href="https://pages.cs.wisc.edu/~remzi/OSTEP/vm-tlbs.pdf" target="_blank" rel="noopener">OSTEP — Paging: Faster Translations (TLBs) (PDF)</a></li><li><a href="https://pages.cs.wisc.edu/~remzi/OSTEP/vm-smalltables.pdf" target="_blank" rel="noopener">OSTEP — Paging: Smaller Tables (nhiều cấp) (PDF)</a></li><li><a href="https://en.wikipedia.org/wiki/Memory_management_unit" target="_blank" rel="noopener">Wikipedia — Khối quản lý bộ nhớ (MMU)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>VA 16 bit, trang 256 byte. Với VA 0x3A7F cho VPN và VPO. Nếu PTE[VPN] có PPN 0x12 thì PA là gì?</li><li>VA 32 bit, trang 4 KiB, PTE 4 byte. Bảng trang một cấp lớn bao nhiêu?</li><li>Vì sao mỗi cấp bảng trang x86-64 dùng 9 bit?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) p = 8: VPO = 0x7F, VPN = 0x3A; PA = 0x127F. 2) 2<sup>20</sup> mục × 4 B = 4 MiB mỗi tiến trình. 3) Một bảng phải vừa một trang 4 KiB: 4096 / 8 byte mỗi PTE = 512 = 2<sup>9</sup> mục.</p></div>`);

const SRC_UAF = String.raw`
#include <stdio.h>
#include <stdlib.h>
int main(void) {
    int *a = malloc(4 * sizeof(int));
    for (int i = 0; i <= 4; i++)     /* off-by-one: writes a[4] */
        a[i] = i;
    free(a);
    return a[0];                     /* use after free */
}
`;
const OUT_UAF = String.raw`
$ cc -O0 uaf.c -o uaf_plain && ./uaf_plain; echo "plain build exit status = $?"
plain build exit status = 4
$ cc -g -O0 -fsanitize=address uaf.c -o uaf && ./uaf
=================================================================
==27924==ERROR: AddressSanitizer: heap-buffer-overflow on address 0x602000000960 at pc 0x000102d4863c bp 0x00016d0b6500 sp 0x00016d0b64f8
WRITE of size 4 at 0x602000000960 thread T0
    #0 0x000102d48638 in main uaf.c:6
    #1 0x00018d10cd78 in start+0x19f8 (dyld:arm64e+0x31d78)

0x602000000960 is located 0 bytes after 16-byte region [0x602000000950,0x602000000960)
allocated by thread T0 here:
    #0 0x000103795274 in malloc+0x78 (libclang_rt.asan_osx_dynamic.dylib:arm64e+0x41274)
    #1 0x000102d485b4 in main uaf.c:4
    #2 0x00018d10cd78 in start+0x19f8 (dyld:arm64e+0x31d78)

SUMMARY: AddressSanitizer: heap-buffer-overflow uaf.c:6 in main
`;

const c93 = L('ics102-ts-9-3',
  '9.3 — Memory mapping and dynamic memory allocation; common memory bugs|||9.3 — Ánh xạ bộ nhớ và cấp phát động; các lỗi bộ nhớ thường gặp',
  'mmap và ánh xạ tệp/ẩn danh, copy-on-write khi fork; malloc/free, heap và brk, yêu cầu của bộ cấp phát (căn lề 16, thông lượng, tận dụng), phân mảnh trong/ngoài, danh sách rỗi ngầm định, tách và gộp khối; lỗi bộ nhớ kinh điển và AddressSanitizer chạy thật.',
  `<span class="eyebrow">ICS102 · Chapter 9 · Lesson 9.3</span>
<h2>Memory mapping and dynamic memory allocation; common memory bugs</h2>
<p class="lead">VM is also the mechanism behind <code>mmap</code>, behind the incredibly cheap <code>fork</code>, and behind the heap where <code>malloc</code> lives. The second half of this lesson is the most practical of the course: how allocators work and the memory bugs that cause most C crashes and many security holes.</p>
<h3>🎯 Objectives</h3>
<ul><li>Explain memory mapping (file-backed and anonymous) and copy-on-write.</li><li>Describe what malloc/free do and the goals of an allocator.</li><li>Distinguish internal and external fragmentation; explain splitting and coalescing.</li><li>Recognise classic memory bugs and detect them with tools.</li></ul>
<h3>📖 Lecture</h3>
<h4>Memory mapping</h4>
<p>Linux initialises a virtual memory area by <strong>mapping</strong> it to an object: a regular file (pages are read from the file on demand — that is how executables are loaded) or an anonymous object (pages filled with zeros — heap, stack, bss). <code>mmap(addr, len, prot, flags, fd, offset)</code> lets programs do this themselves: map a file to read it like an array, or get large zeroed memory. A <strong>private copy-on-write</strong> mapping is shared physically until someone writes; then only the written page is copied. This is why <code>fork</code> is fast: the child gets the parent's page tables marked read-only/copy-on-write, and pages are copied only if modified.</p>
<h4>Dynamic memory allocation</h4>
<p>The <strong>heap</strong> is an area after .bss that grows upward (the kernel's <code>brk</code> pointer marks its end; large requests use <code>mmap</code> instead). <code>malloc(size)</code> returns a pointer to a block of at least size bytes, <strong>aligned to 16 bytes</strong> on 64-bit systems (we measured it in lesson 9.1), or NULL on failure; <code>free(p)</code> returns it. C uses an <strong>explicit</strong> allocator; Java/Python/JavaScript use <strong>implicit</strong> allocators — garbage collectors.</p>
<p>An allocator must handle arbitrary request sequences, respond immediately, never move allocated blocks, and balance two goals: <strong>throughput</strong> (requests per second) and <strong>memory utilisation</strong>.</p>
<h4>Fragmentation</h4>
<ul><li><strong>Internal</strong>: an allocated block is bigger than the payload (headers, alignment padding, minimum size).</li><li><strong>External</strong>: enough free memory in total, but no single free block is large enough.</li></ul>
<h4>A simple design: the implicit free list</h4>
<p>Each block starts with a header word holding its size and an allocated bit (the low bits of the size are free because sizes are multiples of 16). To allocate, walk the blocks looking for a free one that fits (<strong>first fit</strong>, <strong>next fit</strong> or <strong>best fit</strong>); if it is much larger, <strong>split</strong> it. On free, mark it free and <strong>coalesce</strong> it with free neighbours — a copy of the header at the end of each block (a <strong>boundary tag</strong> / footer) makes merging with the previous block O(1). Real allocators use explicit or segregated free lists for speed. Building one is the CS:APP Malloc Lab.</p>
<div class="callout"><p><b>Worked example.</b> Headers are 8 bytes, block sizes rounded up to a multiple of 16. <code>malloc(1)</code> → 8 + 1 = 9 → block of <b>16</b> bytes. <code>malloc(13)</code> → 21 → <b>32</b>. <code>malloc(40)</code> → 48 → <b>48</b>. Internal fragmentation of malloc(1): 15 of 16 bytes are overhead.</p></div>
<h4>Common memory bugs</h4>
<ul>
<li>Dereferencing bad pointers (e.g. <code>scanf("%d", n)</code> instead of <code>&amp;n</code>).</li><li>Reading uninitialised memory (malloc does not zero; calloc does).</li><li>Overwriting memory: allocating the wrong size, off-by-one (<code>&lt;=</code> instead of <code>&lt;</code>), not checking string lengths.</li><li>Referencing a variable that no longer exists (returning the address of a local).</li><li>Freeing twice; using memory after it was freed; forgetting to free (memory leak).</li>
</ul>
<h3>✍️ Worked example — two bugs, caught by a tool</h3>
` + C(SRC_UAF) + `
` + out(OUT_UAF) + `
<p>The normal build “works” and returns a meaningless 4 — the most dangerous kind of bug, silent corruption. Built with <code>-fsanitize=address</code> (AddressSanitizer), the program stops at the first invalid write and reports the line (uaf.c:6, the off-by-one write to a[4]) and where the block was allocated (line 4). The report continues with a map of “shadow memory”, omitted here. After fixing the loop (<code>i &lt; 4</code>) we ran it again and ASan reported the second bug: <code>heap-use-after-free … uaf2.c:8</code>. On Linux, <code>valgrind</code> finds the same errors without recompiling.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Not checking malloc's return value.</li><li><code>malloc(n * sizeof(int *))</code> vs <code>sizeof(int)</code> confusion — allocate <code>n * sizeof *p</code> to be safe.</li><li>Keeping pointers to freed memory; set them to NULL after free.</li><li>Assuming a bug is absent because the program did not crash.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>mmap maps files or zero pages; copy-on-write makes fork cheap.</li><li>malloc returns 16-byte-aligned blocks from the heap; free returns them.</li><li>Allocators trade throughput vs utilisation; fragmentation is internal or external.</li><li>Use AddressSanitizer / valgrind: memory bugs are often silent.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://pages.cs.wisc.edu/~remzi/OSTEP/vm-freespace.pdf" target="_blank" rel="noopener">OSTEP — Free-Space Management (PDF)</a></li><li><a href="https://gee.cs.oswego.edu/dl/html/malloc.html" target="_blank" rel="noopener">Doug Lea — A Memory Allocator (the design behind glibc malloc)</a></li><li><a href="https://clang.llvm.org/docs/AddressSanitizer.html" target="_blank" rel="noopener">Clang — AddressSanitizer documentation</a></li><li><a href="https://man7.org/linux/man-pages/man2/mmap.2.html" target="_blank" rel="noopener">mmap(2) — Linux manual page</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>With 8-byte headers and 16-byte alignment, what block size do malloc(24) and malloc(25) get?</li><li>Free memory: blocks of 32, 48 and 64 bytes, not adjacent. A request needs 100 bytes. What kind of fragmentation prevents it?</li><li>Find the bug: <code>char *dup(const char *s) { char *d = malloc(strlen(s)); strcpy(d, s); return d; }</code>.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 24 + 8 = 32 → 32; 25 + 8 = 33 → 48. 2) External fragmentation (144 bytes free in total, but no block of 100). 3) It does not allocate space for the terminating '\\0': use <code>malloc(strlen(s) + 1)</code> (and check for NULL).</p></div>`,
  `<span class="eyebrow">ICS102 · Chương 9 · Bài 9.3</span>
<h2>Ánh xạ bộ nhớ và cấp phát động; các lỗi bộ nhớ thường gặp</h2>
<p class="lead">VM còn là cơ chế đứng sau <code>mmap</code>, đứng sau một lệnh <code>fork</code> rẻ đến khó tin, và đứng sau heap nơi <code>malloc</code> hoạt động. Nửa sau của bài là phần thực dụng nhất của môn: bộ cấp phát hoạt động thế nào và các lỗi bộ nhớ gây ra phần lớn lần sập của chương trình C cùng nhiều lỗ hổng bảo mật.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Giải thích ánh xạ bộ nhớ (theo tệp và ẩn danh) và copy-on-write.</li><li>Mô tả malloc/free làm gì và mục tiêu của bộ cấp phát.</li><li>Phân biệt phân mảnh trong và ngoài; giải thích tách và gộp khối.</li><li>Nhận ra các lỗi bộ nhớ kinh điển và phát hiện bằng công cụ.</li></ul>
<h3>📖 Bài giảng</h3>
<h4>Ánh xạ bộ nhớ</h4>
<p>Linux khởi tạo một vùng nhớ ảo bằng cách <strong>ánh xạ (map)</strong> nó tới một đối tượng: một tệp thường (trang được đọc từ tệp khi cần — đó là cách tệp thực thi được nạp) hoặc đối tượng ẩn danh (trang toàn số 0 — heap, ngăn xếp, bss). <code>mmap(addr, len, prot, flags, fd, offset)</code> cho chương trình tự làm việc này: ánh xạ tệp để đọc như một mảng, hoặc xin vùng nhớ lớn đã xoá 0. Ánh xạ <strong>riêng copy-on-write</strong> được dùng chung về vật lý cho tới khi có ai ghi; khi đó chỉ trang bị ghi được chép. Đó là lý do <code>fork</code> nhanh: con nhận bảng trang của cha được đánh dấu chỉ đọc/copy-on-write, và trang chỉ bị chép khi bị sửa.</p>
<h4>Cấp phát bộ nhớ động</h4>
<p><strong>Heap</strong> là vùng sau .bss lớn dần lên trên (con trỏ <code>brk</code> của nhân đánh dấu điểm cuối; yêu cầu lớn thì dùng <code>mmap</code>). <code>malloc(size)</code> trả con trỏ tới khối ít nhất size byte, <strong>căn lề 16 byte</strong> trên hệ 64 bit (ta đã đo ở bài 9.1), hoặc NULL khi thất bại; <code>free(p)</code> trả nó lại. C dùng bộ cấp phát <strong>tường minh</strong>; Java/Python/JavaScript dùng bộ cấp phát <strong>ngầm</strong> — bộ thu gom rác.</p>
<p>Bộ cấp phát phải xử lý dãy yêu cầu tuỳ ý, trả lời ngay, không bao giờ di chuyển khối đã cấp, và cân bằng hai mục tiêu: <strong>thông lượng</strong> (số yêu cầu mỗi giây) và <strong>mức tận dụng bộ nhớ</strong>.</p>
<h4>Phân mảnh</h4>
<ul><li><strong>Phân mảnh trong</strong>: khối được cấp lớn hơn dữ liệu (header, đệm căn lề, kích thước tối thiểu).</li><li><strong>Phân mảnh ngoài</strong>: tổng bộ nhớ trống đủ, nhưng không khối trống nào đủ lớn.</li></ul>
<h4>Một thiết kế đơn giản: danh sách rỗi ngầm định</h4>
<p>Mỗi khối bắt đầu bằng một từ header chứa kích thước và một bit đã cấp (các bit thấp của kích thước rảnh vì kích thước là bội của 16). Để cấp phát, duyệt các khối tìm khối trống vừa (<strong>first fit</strong>, <strong>next fit</strong> hoặc <strong>best fit</strong>); nếu nó lớn hơn nhiều thì <strong>tách</strong>. Khi free, đánh dấu trống và <strong>gộp</strong> với các khối trống bên cạnh — một bản sao header ở cuối mỗi khối (<strong>thẻ biên</strong> / footer) giúp gộp với khối trước trong O(1). Bộ cấp phát thật dùng danh sách rỗi tường minh hoặc phân nhóm để nhanh. Tự dựng một bộ là bài Malloc Lab của CS:APP.</p>
<div class="callout"><p><b>Ví dụ giải từng bước.</b> Header 8 byte, kích thước khối làm tròn lên bội của 16. <code>malloc(1)</code> → 8 + 1 = 9 → khối <b>16</b> byte. <code>malloc(13)</code> → 21 → <b>32</b>. <code>malloc(40)</code> → 48 → <b>48</b>. Phân mảnh trong của malloc(1): 15 trên 16 byte là chi phí.</p></div>
<h4>Lỗi bộ nhớ thường gặp</h4>
<ul>
<li>Truy cập con trỏ hỏng (vd <code>scanf("%d", n)</code> thay vì <code>&amp;n</code>).</li><li>Đọc bộ nhớ chưa khởi tạo (malloc không xoá 0; calloc thì có).</li><li>Ghi đè bộ nhớ: cấp sai kích thước, lệch một (<code>&lt;=</code> thay vì <code>&lt;</code>), không kiểm độ dài chuỗi.</li><li>Tham chiếu biến không còn tồn tại (trả về địa chỉ biến cục bộ).</li><li>Free hai lần; dùng bộ nhớ sau khi free; quên free (rò rỉ bộ nhớ).</li>
</ul>
<h3>✍️ Ví dụ — hai lỗi, bị công cụ bắt</h3>
` + C(SRC_UAF) + `
` + out(OUT_UAF) + `
<p>Bản dựng thường “chạy được” và trả về số 4 vô nghĩa — loại lỗi nguy hiểm nhất, hỏng dữ liệu âm thầm. Dựng với <code>-fsanitize=address</code> (AddressSanitizer), chương trình dừng ngay ở lần ghi sai đầu tiên và báo dòng (uaf.c:6, lần ghi lệch một vào a[4]) cùng nơi khối được cấp (dòng 4). Báo cáo còn tiếp với bản đồ “bộ nhớ bóng” (shadow memory), lược bỏ ở đây. Sau khi sửa vòng lặp (<code>i &lt; 4</code>) chúng tôi chạy lại và ASan báo lỗi thứ hai: <code>heap-use-after-free … uaf2.c:8</code>. Trên Linux, <code>valgrind</code> tìm được các lỗi đó mà không cần biên dịch lại.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Không kiểm giá trị trả về của malloc.</li><li>Lẫn <code>malloc(n * sizeof(int *))</code> với <code>sizeof(int)</code> — cấp <code>n * sizeof *p</code> cho an toàn.</li><li>Giữ con trỏ tới vùng đã free; gán NULL sau khi free.</li><li>Cho rằng không có lỗi vì chương trình không sập.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>mmap ánh xạ tệp hoặc trang toàn 0; copy-on-write làm fork rẻ.</li><li>malloc trả khối căn lề 16 byte từ heap; free trả lại.</li><li>Bộ cấp phát đánh đổi thông lượng và mức tận dụng; phân mảnh trong hoặc ngoài.</li><li>Dùng AddressSanitizer / valgrind: lỗi bộ nhớ thường âm thầm.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://pages.cs.wisc.edu/~remzi/OSTEP/vm-freespace.pdf" target="_blank" rel="noopener">OSTEP — Free-Space Management (PDF)</a></li><li><a href="https://gee.cs.oswego.edu/dl/html/malloc.html" target="_blank" rel="noopener">Doug Lea — A Memory Allocator (thiết kế nền của malloc trong glibc)</a></li><li><a href="https://clang.llvm.org/docs/AddressSanitizer.html" target="_blank" rel="noopener">Clang — tài liệu AddressSanitizer</a></li><li><a href="https://man7.org/linux/man-pages/man2/mmap.2.html" target="_blank" rel="noopener">mmap(2) — man page Linux</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Với header 8 byte và căn lề 16 byte, malloc(24) và malloc(25) nhận khối bao nhiêu byte?</li><li>Bộ nhớ trống: các khối 32, 48 và 64 byte, không liền nhau. Một yêu cầu cần 100 byte. Loại phân mảnh nào ngăn nó?</li><li>Tìm lỗi: <code>char *dup(const char *s) { char *d = malloc(strlen(s)); strcpy(d, s); return d; }</code>.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 24 + 8 = 32 → 32; 25 + 8 = 33 → 48. 2) Phân mảnh ngoài (tổng trống 144 byte, nhưng không khối nào 100). 3) Không cấp chỗ cho ký tự kết thúc '\\0': dùng <code>malloc(strlen(s) + 1)</code> (và kiểm NULL).</p></div>`);

const q9 = QZ(9, 'Quiz — Chapter 9: Virtual memory|||Quiz — Chương 9: Bộ nhớ ảo', 'Kiểm tra chương 9: MMU, trang và bảng trang, lỗi trang, bảo vệ, chia VPN/VPO, TLB, bảng trang nhiều cấp, mmap/copy-on-write, malloc và phân mảnh, lỗi bộ nhớ.', [
  Q('q1', 'Which hardware unit translates virtual addresses to physical addresses?|||Khối phần cứng nào dịch địa chỉ ảo sang vật lý?',
    ['ALU|||ALU', 'MMU|||MMU', 'DMA|||DMA', 'L3 cache|||cache L3'], 1,
    'The memory management unit, using page tables maintained by the OS.|||Khối quản lý bộ nhớ, dùng bảng trang do hệ điều hành duy trì.'),
  Q('q2', 'A page fault on a valid but not-yet-loaded page is handled by|||Lỗi trang trên một trang hợp lệ nhưng chưa nạp được xử lý bằng cách',
    ['killing the process|||giết tiến trình', 'loading the page, updating the PTE and restarting the instruction|||nạp trang, cập nhật PTE và chạy lại lệnh', 'skipping the instruction|||bỏ qua lệnh', 'rebooting|||khởi động lại máy'], 1,
    'This is demand paging; the program never notices.|||Đây là phân trang theo yêu cầu; chương trình không hay biết.'),
  Q('q3', 'With 4 KiB pages, the VA 0x00403ABC has VPO|||Với trang 4 KiB, VA 0x00403ABC có VPO',
    ['0x403|||0x403', '0xABC|||0xABC', '0x3ABC|||0x3ABC', '0x00403ABC|||0x00403ABC'], 1,
    'The low 12 bits are the page offset.|||12 bit thấp là độ dời trong trang.'),
  Q('q4', 'During translation, the page offset|||Khi dịch địa chỉ, độ dời trong trang',
    ['is looked up in the TLB|||được tra trong TLB', 'is copied unchanged into the physical address|||được chép nguyên vào địa chỉ vật lý', 'is added to the VPN|||được cộng vào VPN', 'is discarded|||bị bỏ đi'], 1,
    'PPO = VPO; only the page number changes.|||PPO = VPO; chỉ số trang thay đổi.'),
  Q('q5', 'The TLB caches|||TLB đệm',
    ['data blocks|||khối dữ liệu', 'page-table entries (translations)|||mục bảng trang (bản dịch)', 'instructions|||lệnh', 'disk sectors|||sector đĩa'], 1,
    'It avoids reading the page table from memory on every access.|||Nó tránh đọc bảng trang từ bộ nhớ ở mỗi lần truy cập.'),
  Q('q6', 'Why are page tables multi-level?|||Vì sao bảng trang có nhiều cấp?',
    ['to make translation faster|||để dịch nhanh hơn', 'so tables are only created for used regions of the huge address space|||để chỉ tạo bảng cho các vùng đang dùng của không gian địa chỉ khổng lồ', 'to support more processes|||để hỗ trợ nhiều tiến trình hơn', 'because of endianness|||vì thứ tự byte'], 1,
    'A flat table for 48-bit addresses would need 512 GiB per process.|||Bảng phẳng cho địa chỉ 48 bit cần 512 GiB mỗi tiến trình.'),
  Q('q7', 'The page size reported by our program on Apple Silicon (arm64) was|||Kích thước trang chương trình của ta báo trên Apple Silicon (arm64) là',
    ['4 KiB|||4 KiB', '16 KiB|||16 KiB', '64 KiB|||64 KiB', '2 MiB|||2 MiB'], 1,
    '16384 bytes; the same program built for x86-64 reported 4096.|||16384 byte; cùng chương trình dựng cho x86-64 báo 4096.'),
  Q('q8', 'fork is cheap because of|||fork rẻ là nhờ',
    ['static linking|||liên kết tĩnh', 'copy-on-write mappings|||ánh xạ copy-on-write', 'the TLB|||TLB', 'garbage collection|||thu gom rác'], 1,
    'Pages are shared read-only and copied only when written.|||Trang được dùng chung chỉ đọc và chỉ bị chép khi bị ghi.'),
  Q('q9', 'Enough free memory exists in total, but no single free block is big enough. This is|||Tổng bộ nhớ trống đủ, nhưng không khối trống nào đủ lớn. Đây là',
    ['internal fragmentation|||phân mảnh trong', 'external fragmentation|||phân mảnh ngoài', 'a memory leak|||rò rỉ bộ nhớ', 'thrashing|||thrashing'], 1,
    'Internal fragmentation is waste inside allocated blocks.|||Phân mảnh trong là phần phí bên trong khối đã cấp.'),
  Q('q10', 'Which tool flags the off-by-one heap write a[4] immediately with file and line?|||Công cụ nào báo ngay lần ghi lệch một a[4] trên heap kèm tệp và dòng?',
    ['nm|||nm', 'AddressSanitizer (-fsanitize=address)|||AddressSanitizer (-fsanitize=address)', 'objdump|||objdump', 'ar|||ar'], 1,
    'Our ASan run reported heap-buffer-overflow at uaf.c:6.|||Lần chạy ASan báo heap-buffer-overflow tại uaf.c:6.'),
]);

const ch9 = {
  title: 'Chapter 9 — Virtual memory and dynamic memory allocation|||Chương 9 — Bộ nhớ ảo và cấp phát bộ nhớ động',
  description: 'Bộ nhớ ảo như công cụ đệm, quản lý và bảo vệ; dịch địa chỉ, TLB, bảng trang nhiều cấp; mmap, copy-on-write, malloc, phân mảnh, lỗi bộ nhớ và AddressSanitizer chạy thật (CS:APP chương 9).',
  lessons: [c91, c92, c93, q9],
};

// ───────────────────────────── Chương 10 — I/O, mạng, đồng thời ─────────────────────────────
const SRC_UNIXIO = String.raw`
#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>
#include <string.h>
int main(void) {
    int fd = open("demo.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);
    printf("open for writing -> fd %d\n", fd);      /* 0,1,2 are taken by stdin/out/err */
    const char *msg = "line one\nline two\n";
    ssize_t n = write(fd, msg, strlen(msg));
    printf("write -> %zd bytes\n", n);
    close(fd);
    char buf[8];
    fd = open("demo.txt", O_RDONLY);
    printf("open for reading -> fd %d\n", fd);
    while ((n = read(fd, buf, sizeof buf)) > 0)     /* short counts: 8, 8, 2, then 0 = EOF */
        printf("read -> %zd bytes\n", n);
    printf("read -> %zd (EOF)\n", n);
    close(fd);
    fflush(stdout);                                 /* empty the stdio buffer first! */
    int saved = dup(1);                             /* redirect stdout into a file */
    fd = open("out.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);
    dup2(fd, 1);
    printf("this goes to out.txt\n"); fflush(stdout);
    dup2(saved, 1); close(fd);
    printf("back on the terminal\n");
    return 0;
}
`;
const OUT_UNIXIO = String.raw`
$ cc -O1 unixio.c -o unixio && ./unixio && echo "--- out.txt:" && cat out.txt
open for writing -> fd 3
write -> 18 bytes
open for reading -> fd 3
read -> 8 bytes
read -> 8 bytes
read -> 2 bytes
read -> 0 (EOF)
back on the terminal
--- out.txt:
this goes to out.txt
`;
const OUT_UNIXIO_BUG = String.raw`
back on the terminal
--- out.txt:
open for writing -> fd 3
write -> 18 bytes
open for reading -> fd 3
read -> 8 bytes
read -> 8 bytes
read -> 2 bytes
read -> 0 (EOF)
this goes to out.txt
`;

const c101 = L('ics102-ts-10-1',
  '10.1 — System-level I/O: file descriptors, read/write, short counts, redirection|||10.1 — Vào/ra mức hệ thống: file descriptor, read/write, đếm thiếu, chuyển hướng',
  'Mọi thiết bị là tệp, Unix I/O (open/read/write/close), descriptor 0/1/2, đếm thiếu (short count) và cách xử lý, bảng descriptor – bảng tệp mở – v-node, chia sẻ tệp sau fork, dup2 và chuyển hướng, bộ đệm stdio; chương trình thật kèm một lỗi bộ đệm thật.',
  `<span class="eyebrow">ICS102 · Chapter 10 · Lesson 10.1</span>
<h2>System-level I/O: file descriptors, read/write, short counts, redirection</h2>
<p class="lead">Higher-level I/O — <code>printf</code>, <code>fgets</code>, Java streams, Python's <code>open</code> — is built on a tiny set of kernel calls called <strong>Unix I/O</strong>. Knowing that layer explains redirection (<code>&gt;</code>, <code>|</code>), why output sometimes appears in the wrong order, and how a network connection can be read exactly like a file.</p>
<h3>🎯 Objectives</h3>
<ul><li>Use open, read, write and close and interpret their return values.</li><li>Explain short counts and when they happen.</li><li>Describe the kernel structures for open files and how dup2 implements redirection.</li><li>Choose between Unix I/O and standard I/O, and avoid buffering pitfalls.</li></ul>
<h3>📖 Lecture</h3>
<h4>Everything is a file</h4>
<p>A Linux <strong>file</strong> is a sequence of bytes. Regular files, directories, devices (terminals, disks) and network sockets are all accessed through the same interface. Opening a file returns a small non-negative integer, the <strong>file descriptor</strong>. Every process starts with three open: 0 = standard input, 1 = standard output, 2 = standard error. <code>open</code> returns the lowest unused descriptor — so usually 3.</p>
<h4>Reading and writing</h4>
<ul>
<li><code>ssize_t read(int fd, void *buf, size_t n)</code> copies at most n bytes; returns the number read, 0 at end of file (EOF), −1 on error.</li>
<li><code>ssize_t write(int fd, const void *buf, size_t n)</code> returns the number written, or −1.</li>
<li>A <strong>short count</strong> (fewer bytes than requested) is not an error. It happens at EOF, when reading lines from a terminal, and on network sockets and pipes (data arrives in pieces). Robust code loops until all bytes are transferred — CS:APP's RIO package (<code>rio_readn</code>, <code>rio_writen</code>, <code>rio_readlineb</code>) wraps this.</li>
</ul>
<h4>How the kernel represents open files</h4>
<div class="formula"><span class="lbl">Three tables</span><b>descriptor table</b> (one per process): fd → entry in the open file table<br><b>open file table</b> (shared by all processes): current file position, reference count, → v-node<br><b>v-node table</b>: file metadata (size, type, permissions — what <code>stat</code> returns)</div>
<p>After <code>fork</code>, the child gets a copy of the parent's descriptor table, so parent and child <strong>share</strong> file positions. <code>dup2(oldfd, newfd)</code> copies descriptor-table entry oldfd onto newfd — this is how a shell implements <code>./prog &gt; out.txt</code>: open out.txt, <code>dup2(fd, 1)</code>, then <code>execve</code>.</p>
<h4>Standard I/O and buffering</h4>
<p>The C library's <code>FILE*</code> streams (<code>printf</code>, <code>fgets</code>…) add a <strong>buffer</strong> to reduce expensive system calls. stdout is <strong>line-buffered</strong> when it is a terminal but <strong>fully buffered</strong> when redirected to a file or pipe; stderr is unbuffered. Mixing standard I/O with Unix I/O on the same descriptor, or redirecting it, without <code>fflush</code> causes surprises — see below. Rule of thumb: use standard I/O for files and terminals; use Unix I/O (or RIO) for sockets.</p>
<h3>✍️ Worked example</h3>
` + C(SRC_UNIXIO) + `
<p>Real output:</p>
` + out(OUT_UNIXIO) + `
<p>Note the short counts: the 18-byte file is read as 8 + 8 + 2, then read returns 0 = EOF. <strong>A real bug we hit while preparing this lesson:</strong> our first version had no <code>fflush(stdout)</code> before the redirection. Because the tool we ran it from captured stdout through a pipe, stdout was fully buffered — and all the earlier lines were still in the buffer when <code>dup2</code> pointed descriptor 1 at out.txt. The output was:</p>
` + out(OUT_UNIXIO_BUG) + `
<p>Every “printed” line ended up in the file, in the wrong place. One <code>fflush</code> fixed it.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Assuming <code>read</code> fills the whole buffer — check the return value and loop.</li><li>Treating 0 from read as an error — it means EOF.</li><li>Forgetting to <code>close</code> descriptors — a process has a limited number (often 1024).</li><li>Mixing <code>printf</code> and <code>write</code>, or redirecting, without <code>fflush</code>.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Everything is a file; descriptors 0, 1, 2 are stdin, stdout, stderr.</li><li>read/write may return short counts; 0 from read = EOF.</li><li>Descriptor table → open file table → v-node; fork shares file positions.</li><li>dup2 implements redirection; stdio buffering must be flushed.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://man7.org/linux/man-pages/man2/open.2.html" target="_blank" rel="noopener">open(2) — Linux manual page</a></li><li><a href="https://man7.org/linux/man-pages/man2/read.2.html" target="_blank" rel="noopener">read(2) — Linux manual page</a></li><li><a href="https://man7.org/linux/man-pages/man2/dup.2.html" target="_blank" rel="noopener">dup(2) / dup2 — Linux manual page</a></li><li><a href="https://pages.cs.wisc.edu/~remzi/OSTEP/file-intro.pdf" target="_blank" rel="noopener">OSTEP — Interlude: Files and Directories (PDF)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>A program opens a.txt, then b.txt, closes a.txt and opens c.txt. Which descriptors does it get?</li><li>How does a shell run <code>sort &lt; in.txt</code>?</li><li>A file contains “foobar”. A process opens it twice (fd1, fd2), reads 1 byte from fd1, then 1 byte from fd2. What are the two bytes? And if instead it opened once and called <code>fork</code>, child reads 1 byte, then parent reads 1 byte?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) a.txt → 3, b.txt → 4, c.txt → 3 (lowest free). 2) fork; in the child open in.txt, <code>dup2(fd, 0)</code>, close fd, then execve sort. 3) Two separate opens have two file positions: 'f' and 'f'. After fork they share one open-file entry: child reads 'f', parent reads 'o'.</p></div>`,
  `<span class="eyebrow">ICS102 · Chương 10 · Bài 10.1</span>
<h2>Vào/ra mức hệ thống: file descriptor, read/write, đếm thiếu, chuyển hướng</h2>
<p class="lead">I/O mức cao — <code>printf</code>, <code>fgets</code>, stream của Java, <code>open</code> của Python — đều dựng trên một nhóm rất nhỏ lời gọi nhân gọi là <strong>Unix I/O</strong>. Hiểu tầng đó sẽ giải thích chuyển hướng (<code>&gt;</code>, <code>|</code>), vì sao output đôi khi hiện sai thứ tự, và vì sao một kết nối mạng đọc được y như một tệp.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Dùng open, read, write, close và hiểu giá trị trả về.</li><li>Giải thích đếm thiếu (short count) và khi nào nó xảy ra.</li><li>Mô tả cấu trúc nhân cho tệp đang mở và dup2 hiện thực chuyển hướng thế nào.</li><li>Chọn giữa Unix I/O và standard I/O, tránh bẫy bộ đệm.</li></ul>
<h3>📖 Bài giảng</h3>
<h4>Mọi thứ đều là tệp</h4>
<p>Một <strong>tệp</strong> Linux là một dãy byte. Tệp thường, thư mục, thiết bị (terminal, đĩa) và socket mạng đều được truy cập qua cùng một giao diện. Mở tệp trả về một số nguyên không âm nhỏ, gọi là <strong>file descriptor</strong>. Mọi tiến trình khởi đầu với ba descriptor đang mở: 0 = đầu vào chuẩn, 1 = đầu ra chuẩn, 2 = lỗi chuẩn. <code>open</code> trả về descriptor nhỏ nhất chưa dùng — nên thường là 3.</p>
<h4>Đọc và ghi</h4>
<ul>
<li><code>ssize_t read(int fd, void *buf, size_t n)</code> chép tối đa n byte; trả số byte đọc được, 0 khi hết tệp (EOF), −1 khi lỗi.</li>
<li><code>ssize_t write(int fd, const void *buf, size_t n)</code> trả số byte đã ghi, hoặc −1.</li>
<li><strong>Đếm thiếu</strong> (ít byte hơn yêu cầu) không phải lỗi. Nó xảy ra ở EOF, khi đọc dòng từ terminal, và với socket mạng, pipe (dữ liệu đến từng mẩu). Code vững chắc phải lặp tới khi chuyển đủ byte — gói RIO của CS:APP (<code>rio_readn</code>, <code>rio_writen</code>, <code>rio_readlineb</code>) bọc sẵn việc này.</li>
</ul>
<h4>Nhân biểu diễn tệp đang mở thế nào</h4>
<div class="formula"><span class="lbl">Ba bảng</span><b>bảng descriptor</b> (mỗi tiến trình một bảng): fd → mục trong bảng tệp mở<br><b>bảng tệp mở</b> (mọi tiến trình dùng chung): vị trí hiện tại trong tệp, số tham chiếu, → v-node<br><b>bảng v-node</b>: siêu dữ liệu tệp (kích thước, loại, quyền — những gì <code>stat</code> trả về)</div>
<p>Sau <code>fork</code>, con nhận một bản sao bảng descriptor của cha, nên cha và con <strong>dùng chung</strong> vị trí tệp. <code>dup2(oldfd, newfd)</code> chép mục oldfd của bảng descriptor đè lên newfd — đó là cách shell hiện thực <code>./prog &gt; out.txt</code>: mở out.txt, <code>dup2(fd, 1)</code>, rồi <code>execve</code>.</p>
<h4>Standard I/O và bộ đệm</h4>
<p>Các luồng <code>FILE*</code> của thư viện C (<code>printf</code>, <code>fgets</code>…) thêm một <strong>bộ đệm</strong> để giảm các lời gọi hệ thống tốn kém. stdout được <strong>đệm theo dòng</strong> khi là terminal nhưng <strong>đệm toàn phần</strong> khi chuyển hướng ra tệp hay pipe; stderr không đệm. Trộn standard I/O với Unix I/O trên cùng descriptor, hoặc chuyển hướng nó, mà không <code>fflush</code> sẽ gây bất ngờ — xem dưới. Kinh nghiệm: dùng standard I/O cho tệp và terminal; dùng Unix I/O (hoặc RIO) cho socket.</p>
<h3>✍️ Ví dụ</h3>
` + C(SRC_UNIXIO) + `
<p>Output thật:</p>
` + out(OUT_UNIXIO) + `
<p>Để ý đếm thiếu: tệp 18 byte được đọc thành 8 + 8 + 2, rồi read trả 0 = EOF. <strong>Một lỗi thật chúng tôi gặp khi soạn bài này:</strong> phiên bản đầu không có <code>fflush(stdout)</code> trước khi chuyển hướng. Vì công cụ chạy chương trình bắt stdout qua một pipe, stdout bị đệm toàn phần — và mọi dòng trước đó vẫn nằm trong bộ đệm khi <code>dup2</code> trỏ descriptor 1 sang out.txt. Output là:</p>
` + out(OUT_UNIXIO_BUG) + `
<p>Mọi dòng “đã in” đều chui vào tệp, sai chỗ. Một lệnh <code>fflush</code> đã sửa xong.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Cho rằng <code>read</code> đọc đầy bộ đệm — kiểm giá trị trả về và lặp.</li><li>Coi read trả 0 là lỗi — nó nghĩa là EOF.</li><li>Quên <code>close</code> descriptor — mỗi tiến trình có số lượng giới hạn (thường 1024).</li><li>Trộn <code>printf</code> và <code>write</code>, hoặc chuyển hướng, mà không <code>fflush</code>.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Mọi thứ là tệp; descriptor 0, 1, 2 là stdin, stdout, stderr.</li><li>read/write có thể đếm thiếu; read trả 0 = EOF.</li><li>Bảng descriptor → bảng tệp mở → v-node; fork dùng chung vị trí tệp.</li><li>dup2 hiện thực chuyển hướng; bộ đệm stdio phải được xả.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://man7.org/linux/man-pages/man2/open.2.html" target="_blank" rel="noopener">open(2) — man page Linux</a></li><li><a href="https://man7.org/linux/man-pages/man2/read.2.html" target="_blank" rel="noopener">read(2) — man page Linux</a></li><li><a href="https://man7.org/linux/man-pages/man2/dup.2.html" target="_blank" rel="noopener">dup(2) / dup2 — man page Linux</a></li><li><a href="https://pages.cs.wisc.edu/~remzi/OSTEP/file-intro.pdf" target="_blank" rel="noopener">OSTEP — Interlude: Files and Directories (PDF)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Một chương trình mở a.txt, rồi b.txt, đóng a.txt và mở c.txt. Nó nhận các descriptor nào?</li><li>Shell chạy <code>sort &lt; in.txt</code> thế nào?</li><li>Tệp chứa “foobar”. Một tiến trình mở nó hai lần (fd1, fd2), đọc 1 byte từ fd1, rồi 1 byte từ fd2. Hai byte là gì? Còn nếu mở một lần rồi gọi <code>fork</code>, con đọc 1 byte, rồi cha đọc 1 byte?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) a.txt → 3, b.txt → 4, c.txt → 3 (nhỏ nhất còn trống). 2) fork; trong con mở in.txt, <code>dup2(fd, 0)</code>, đóng fd, rồi execve sort. 3) Hai lần open riêng có hai vị trí tệp: 'f' và 'f'. Sau fork chúng dùng chung một mục tệp mở: con đọc 'f', cha đọc 'o'.</p></div>`);

const SRC_ECHO = String.raw`
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <netdb.h>
#include <sys/socket.h>
#include <sys/wait.h>
#define PORT "15213"
static int open_listenfd(void) {                 /* socket -> bind -> listen */
    struct addrinfo hints = {0}, *res;
    hints.ai_family = AF_INET; hints.ai_socktype = SOCK_STREAM; hints.ai_flags = AI_PASSIVE;
    getaddrinfo("127.0.0.1", PORT, &hints, &res);
    int fd = socket(res->ai_family, res->ai_socktype, res->ai_protocol);
    int on = 1; setsockopt(fd, SOL_SOCKET, SO_REUSEADDR, &on, sizeof on);
    if (bind(fd, res->ai_addr, res->ai_addrlen) < 0 || listen(fd, 8) < 0) { perror("bind/listen"); exit(1); }
    freeaddrinfo(res);
    return fd;
}
static int open_clientfd(void) {                 /* socket -> connect */
    struct addrinfo hints = {0}, *res;
    hints.ai_family = AF_INET; hints.ai_socktype = SOCK_STREAM;
    getaddrinfo("127.0.0.1", PORT, &hints, &res);
    int fd = socket(res->ai_family, res->ai_socktype, res->ai_protocol);
    if (connect(fd, res->ai_addr, res->ai_addrlen) < 0) { perror("connect"); exit(1); }
    freeaddrinfo(res);
    return fd;
}
int main(void) {
    setvbuf(stdout, NULL, _IONBF, 0);
    int listenfd = open_listenfd();
    if (fork() == 0) {                           /* child = client */
        close(listenfd);
        int fd = open_clientfd();
        const char *lines[] = {"hello server\n", "15213 rocks\n"};
        char buf[64];
        for (int i = 0; i < 2; i++) {
            write(fd, lines[i], strlen(lines[i]));
            ssize_t n = read(fd, buf, sizeof buf - 1);
            buf[n] = '\0';
            printf("client got: %s", buf);
        }
        close(fd);                               /* server sees EOF */
        exit(0);
    }
    int connfd = accept(listenfd, NULL, NULL);   /* parent = iterative echo server */
    char buf[64]; ssize_t n; size_t total = 0;
    while ((n = read(connfd, buf, sizeof buf)) > 0) {
        total += n;
        write(connfd, buf, n);                   /* echo back */
    }
    printf("server: client closed, echoed %zu bytes\n", total);
    close(connfd); close(listenfd); wait(NULL);
    return 0;
}
`;
const OUT_ECHO = String.raw`
$ cc -O1 -Wall echo.c -o echo && ./echo
client got: hello server
client got: 15213 rocks
server: client closed, echoed 25 bytes
`;

const c102 = L('ics102-ts-10-2',
  '10.2 — Network programming: client–server, IP, DNS, sockets and HTTP|||10.2 — Lập trình mạng: client–server, IP, DNS, socket và HTTP',
  'Mô hình client–server, mạng như một thiết bị I/O, địa chỉ IP, cổng, thứ tự byte mạng, DNS, kết nối TCP; giao diện socket (getaddrinfo, socket, bind, listen, accept, connect); máy chủ echo chạy thật trên localhost; HTTP request/response.',
  `<span class="eyebrow">ICS102 · Chapter 10 · Lesson 10.2</span>
<h2>Network programming: client–server, IP, DNS, sockets and HTTP</h2>
<p class="lead">Every web service, game server, database and API you will build is a network application. Underneath frameworks like Express, Spring or Django, they all use the same small sockets interface from the 1980s. In this lesson we write a client and an echo server in about 60 lines of C and run them.</p>
<h3>🎯 Objectives</h3>
<ul><li>Explain the client–server model and the network as an I/O device.</li><li>Describe IP addresses, ports, network byte order and DNS.</li><li>Use the socket calls in the right order on client and server.</li><li>Read and write a simple HTTP request and response.</li></ul>
<h3>📖 Lecture</h3>
<h4>Client–server model</h4>
<p>A <strong>server</strong> process manages a resource and waits for requests; a <strong>client</strong> sends a request; the server processes it and sends a <strong>response</strong>. Clients and servers are processes, not machines — they can be on the same host (as in our example) or on different continents. To a host, the network is just another I/O device: data received from the network adapter is copied into memory, and the program reads it through a file descriptor.</p>
<h4>The global IP Internet</h4>
<ul>
<li>Each host has an <strong>IP address</strong>: 32-bit for IPv4 (written in dotted-decimal, e.g. 127.0.0.1 = this machine), 128-bit for IPv6. IP addresses are always stored in <strong>network byte order (big-endian)</strong>; use <code>htonl</code>/<code>htons</code> and <code>ntohl</code>/<code>ntohs</code> to convert.</li>
<li>Humans use <strong>domain names</strong> (cuongthai.com); the <strong>DNS</strong> maps names to IP addresses. <code>getaddrinfo</code> performs this lookup and returns ready-to-use socket address structures (and works for both IPv4 and IPv6).</li>
<li>A <strong>connection</strong> (TCP) is a reliable, full-duplex byte stream between two <strong>sockets</strong>; each socket is identified by address:port. A connection is identified by the pair (client addr:port, server addr:port). Well-known ports: 80 HTTP, 443 HTTPS, 22 SSH.</li>
</ul>
<h4>The sockets interface</h4>
<div class="formula"><span class="lbl">Order of calls</span>Server: getaddrinfo → socket → bind → listen → accept (blocks; returns a new <i>connected</i> descriptor per client) → read/write → close<br>Client: getaddrinfo → socket → connect → read/write → close</div>
<p>The listening descriptor lives for the whole server life; each <code>accept</code> returns a new connected descriptor for one client. Once connected, a socket is used with ordinary <code>read</code>/<code>write</code> — and short counts are normal, so robust code loops (lesson 10.1).</p>
<h3>✍️ Worked example — an echo client and server in one program</h3>
<p>To run everything in one command the program forks: the parent is an <em>iterative</em> echo server on 127.0.0.1:15213; the child is the client.</p>
` + C(SRC_ECHO) + `
` + out(OUT_ECHO) + `
<p>The client wrote 13 + 12 = 25 bytes and got each line back; when the client closed its socket, the server's <code>read</code> returned 0 (EOF) and the loop ended. Error handling is minimal for brevity — real code checks every return value.</p>
<h4>HTTP in one screen</h4>
<p>The web runs on <strong>HTTP</strong>, a text protocol on top of a TCP connection. A request is a request line, headers, an empty line, and an optional body; the response is a status line, headers, an empty line and the content:</p>
` + code('text', String.raw`
GET /index.html HTTP/1.1
Host: www.example.com
Connection: close

HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 1256

<!doctype html> ...
`) + `
<p>A minimal web server (CS:APP's “Tiny”) is the echo server above plus code that parses the request line, opens the file and writes the response. Status codes: 200 OK, 301 moved, 404 not found, 500 server error.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Forgetting network byte order for ports and addresses when filling structs by hand (prefer getaddrinfo).</li><li>Assuming one <code>read</code> returns one whole message — TCP is a byte stream; frame your messages (lines, length prefix).</li><li>“Address already in use” when restarting a server — set <code>SO_REUSEADDR</code>.</li><li>An iterative server serves one client at a time — lesson 10.3 makes it concurrent.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Client–server: processes exchanging requests and responses over connections.</li><li>IP address + port identify a socket; network byte order is big-endian; DNS maps names to addresses.</li><li>Server: socket, bind, listen, accept; client: socket, connect; then read/write.</li><li>HTTP = text request/response over TCP.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://beej.us/guide/bgnet/" target="_blank" rel="noopener">Beej's Guide to Network Programming</a></li><li><a href="https://man7.org/linux/man-pages/man3/getaddrinfo.3.html" target="_blank" rel="noopener">getaddrinfo(3) — Linux manual page</a></li><li><a href="https://man7.org/linux/man-pages/man7/socket.7.html" target="_blank" rel="noopener">socket(7) — Linux manual page</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview" target="_blank" rel="noopener">MDN — An overview of HTTP</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Write 0x8002C2F2 in dotted-decimal and 205.188.160.121 in hex.</li><li>Why does the server need two descriptors (listenfd and connfd)?</li><li>The client sends “hello\\n” but the server's first read returns only “hel”. Is the network broken?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 0x80 = 128, 0x02 = 2, 0xC2 = 194, 0xF2 = 242 → 128.2.194.242; 205 = 0xCD, 188 = 0xBC, 160 = 0xA0, 121 = 0x79 → 0xCDBCA079. 2) listenfd keeps accepting new clients; each connfd talks to one client and can be closed independently. 3) No — that is a short count; TCP delivers a byte stream, so keep reading until the full message (e.g. up to '\\n') arrives.</p></div>`,
  `<span class="eyebrow">ICS102 · Chương 10 · Bài 10.2</span>
<h2>Lập trình mạng: client–server, IP, DNS, socket và HTTP</h2>
<p class="lead">Mọi dịch vụ web, game server, cơ sở dữ liệu và API bạn sẽ xây đều là ứng dụng mạng. Bên dưới các framework như Express, Spring hay Django, tất cả đều dùng cùng một giao diện socket nhỏ từ thập niên 1980. Bài này viết một client và một máy chủ echo trong khoảng 60 dòng C rồi chạy chúng.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Giải thích mô hình client–server và mạng như một thiết bị vào/ra.</li><li>Mô tả địa chỉ IP, cổng, thứ tự byte mạng và DNS.</li><li>Dùng các lời gọi socket đúng thứ tự ở client và server.</li><li>Đọc và viết một yêu cầu, phản hồi HTTP đơn giản.</li></ul>
<h3>📖 Bài giảng</h3>
<h4>Mô hình client–server</h4>
<p>Tiến trình <strong>server</strong> quản lý một tài nguyên và chờ yêu cầu; <strong>client</strong> gửi yêu cầu; server xử lý rồi gửi <strong>phản hồi</strong>. Client và server là tiến trình, không phải máy — chúng có thể cùng một máy (như ví dụ của ta) hoặc ở hai lục địa. Với một máy, mạng chỉ là một thiết bị vào/ra nữa: dữ liệu nhận từ card mạng được chép vào bộ nhớ, và chương trình đọc nó qua một file descriptor.</p>
<h4>Internet IP toàn cầu</h4>
<ul>
<li>Mỗi máy có một <strong>địa chỉ IP</strong>: 32 bit với IPv4 (viết dạng chấm thập phân, vd 127.0.0.1 = chính máy này), 128 bit với IPv6. Địa chỉ IP luôn lưu theo <strong>thứ tự byte mạng (big-endian)</strong>; dùng <code>htonl</code>/<code>htons</code> và <code>ntohl</code>/<code>ntohs</code> để đổi.</li>
<li>Con người dùng <strong>tên miền</strong> (cuongthai.com); <strong>DNS</strong> ánh xạ tên sang địa chỉ IP. <code>getaddrinfo</code> thực hiện việc tra này và trả về cấu trúc địa chỉ socket dùng ngay được (chạy cho cả IPv4 lẫn IPv6).</li>
<li><strong>Kết nối</strong> (TCP) là dòng byte tin cậy, hai chiều đồng thời giữa hai <strong>socket</strong>; mỗi socket được định danh bằng địa chỉ:cổng. Một kết nối được định danh bằng cặp (địa chỉ:cổng client, địa chỉ:cổng server). Cổng quen thuộc: 80 HTTP, 443 HTTPS, 22 SSH.</li>
</ul>
<h4>Giao diện socket</h4>
<div class="formula"><span class="lbl">Thứ tự lời gọi</span>Server: getaddrinfo → socket → bind → listen → accept (chặn; trả về một descriptor <i>đã kết nối</i> mới cho mỗi client) → read/write → close<br>Client: getaddrinfo → socket → connect → read/write → close</div>
<p>Descriptor lắng nghe sống suốt đời server; mỗi lần <code>accept</code> trả một descriptor đã kết nối mới cho một client. Khi đã kết nối, socket được dùng bằng <code>read</code>/<code>write</code> thông thường — và đếm thiếu là chuyện bình thường, nên code vững chắc phải lặp (bài 10.1).</p>
<h3>✍️ Ví dụ — client và máy chủ echo trong một chương trình</h3>
<p>Để chạy mọi thứ bằng một lệnh, chương trình fork: tiến trình cha là máy chủ echo <em>tuần tự</em> trên 127.0.0.1:15213; tiến trình con là client.</p>
` + C(SRC_ECHO) + `
` + out(OUT_ECHO) + `
<p>Client ghi 13 + 12 = 25 byte và nhận lại từng dòng; khi client đóng socket, <code>read</code> của server trả 0 (EOF) và vòng lặp kết thúc. Xử lý lỗi được rút gọn cho ngắn — code thật phải kiểm mọi giá trị trả về.</p>
<h4>HTTP trong một màn hình</h4>
<p>Web chạy trên <strong>HTTP</strong>, một giao thức văn bản trên một kết nối TCP. Yêu cầu gồm dòng yêu cầu, các header, một dòng trống và phần thân tuỳ chọn; phản hồi gồm dòng trạng thái, header, dòng trống và nội dung:</p>
` + code('text', String.raw`
GET /index.html HTTP/1.1
Host: www.example.com
Connection: close

HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 1256

<!doctype html> ...
`) + `
<p>Một web server tối giản (“Tiny” của CS:APP) chính là máy chủ echo trên cộng thêm code phân tích dòng yêu cầu, mở tệp và ghi phản hồi. Mã trạng thái: 200 OK, 301 đã chuyển, 404 không tìm thấy, 500 lỗi server.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Quên thứ tự byte mạng cho cổng và địa chỉ khi tự điền struct (nên dùng getaddrinfo).</li><li>Cho rằng một lần <code>read</code> trả về trọn một thông điệp — TCP là dòng byte; phải tự đóng khung thông điệp (theo dòng, tiền tố độ dài).</li><li>“Address already in use” khi khởi động lại server — đặt <code>SO_REUSEADDR</code>.</li><li>Server tuần tự chỉ phục vụ một client mỗi lúc — bài 10.3 biến nó thành đồng thời.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Client–server: các tiến trình trao đổi yêu cầu và phản hồi qua kết nối.</li><li>Địa chỉ IP + cổng định danh socket; thứ tự byte mạng là big-endian; DNS ánh xạ tên sang địa chỉ.</li><li>Server: socket, bind, listen, accept; client: socket, connect; rồi read/write.</li><li>HTTP = yêu cầu/phản hồi dạng văn bản trên TCP.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://beej.us/guide/bgnet/" target="_blank" rel="noopener">Beej's Guide to Network Programming</a></li><li><a href="https://man7.org/linux/man-pages/man3/getaddrinfo.3.html" target="_blank" rel="noopener">getaddrinfo(3) — man page Linux</a></li><li><a href="https://man7.org/linux/man-pages/man7/socket.7.html" target="_blank" rel="noopener">socket(7) — man page Linux</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview" target="_blank" rel="noopener">MDN — Tổng quan về HTTP</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Viết 0x8002C2F2 dạng chấm thập phân và 205.188.160.121 dạng hex.</li><li>Vì sao server cần hai descriptor (listenfd và connfd)?</li><li>Client gửi “hello\\n” nhưng lần read đầu tiên của server chỉ trả “hel”. Mạng hỏng à?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 0x80 = 128, 0x02 = 2, 0xC2 = 194, 0xF2 = 242 → 128.2.194.242; 205 = 0xCD, 188 = 0xBC, 160 = 0xA0, 121 = 0x79 → 0xCDBCA079. 2) listenfd tiếp tục nhận client mới; mỗi connfd nói chuyện với một client và đóng được độc lập. 3) Không — đó là đếm thiếu; TCP giao dòng byte, nên đọc tiếp tới khi đủ thông điệp (vd tới '\\n').</p></div>`);

const SRC_RACE = String.raw`
#include <stdio.h>
#include <pthread.h>
#define NITERS 10000000
static volatile long cnt = 0;                    /* shared by both threads */
static pthread_mutex_t mu = PTHREAD_MUTEX_INITIALIZER;
static void *count_unsafe(void *arg) {
    for (long i = 0; i < NITERS; i++) cnt++;     /* load, add, store: not atomic */
    return NULL;
}
static void *count_safe(void *arg) {
    for (long i = 0; i < NITERS; i++) {
        pthread_mutex_lock(&mu);
        cnt++;
        pthread_mutex_unlock(&mu);
    }
    return NULL;
}
static long run(void *(*f)(void *)) {
    pthread_t t1, t2;
    cnt = 0;
    pthread_create(&t1, NULL, f, NULL);
    pthread_create(&t2, NULL, f, NULL);
    pthread_join(t1, NULL);
    pthread_join(t2, NULL);
    return cnt;
}
int main(void) {
    printf("expected      : %ld\n", 2L * NITERS);
    for (int k = 0; k < 3; k++) printf("without mutex : %ld\n", run(count_unsafe));
    printf("with mutex    : %ld\n", run(count_safe));
    return 0;
}
`;
const OUT_RACE = String.raw`
$ cc -O1 -Wall race.c -o race && ./race
expected      : 20000000
without mutex : 9850005
without mutex : 14628421
without mutex : 16927361
with mutex    : 20000000
`;
const ASM_RACE = String.raw`
LBB1_1:                         ; arm64 inner loop of count_unsafe (cc -O1 -S)
	ldr	x10, [x9, _cnt@PAGEOFF]  ; load cnt
	add	x10, x10, #1             ; add 1
	str	x10, [x9, _cnt@PAGEOFF]  ; store cnt
	subs	x8, x8, #1
	b.ne	LBB1_1
`;

const c103 = L('ics102-ts-10-3',
  '10.3 — Concurrent programming: processes, I/O multiplexing, threads and races|||10.3 — Lập trình đồng thời: tiến trình, đa hợp I/O, luồng và tranh chấp',
  'Ba cách làm server đồng thời (tiến trình, đa hợp I/O, luồng) và đánh đổi; Pthreads (create, join, detach); biến dùng chung trong mô hình bộ nhớ của luồng; tranh chấp dữ liệu đo thật: hai luồng tăng biến đếm 10 triệu lần ra 9,8–16,9 triệu thay vì 20 triệu; vì sao cnt++ không nguyên tử.',
  `<span class="eyebrow">ICS102 · Chapter 10 · Lesson 10.3</span>
<h2>Concurrent programming: processes, I/O multiplexing, threads and races</h2>
<p class="lead">Our echo server serves one client at a time; a slow client blocks everyone. Real servers are <strong>concurrent</strong>. There are three classic ways to build them. Threads are the most popular and the most dangerous — as we will measure, two threads adding to one counter can lose almost half of their work.</p>
<h3>🎯 Objectives</h3>
<ul><li>Compare process-based, event-based (I/O multiplexing) and thread-based concurrency.</li><li>Create and join POSIX threads.</li><li>Decide which variables are shared between threads.</li><li>Explain a data race at the instruction level.</li></ul>
<h3>📖 Lecture</h3>
<h4>Three approaches</h4>
<ul>
<li><strong>Processes</strong>: after <code>accept</code>, <code>fork</code> a child to serve the client; the parent goes back to accepting (and reaps children with a SIGCHLD handler). + Clean separation, no accidental sharing. − Sharing data needs explicit IPC; fork and context switches are relatively expensive.</li>
<li><strong>I/O multiplexing</strong> (event-driven): one process uses <code>select</code>/<code>poll</code>/<code>epoll</code> to wait until <em>some</em> descriptor is ready, then handles that event as a small state machine. + One address space, no threads, very scalable (this is how nginx and Node.js work). − More complex code; cannot use multiple cores by itself.</li>
<li><strong>Threads</strong>: one process, several threads, each with its own stack, registers and PC, but sharing code, heap, globals and open files. + Cheaper than processes, easy sharing. − Easy <em>unintended</em> sharing: races and deadlocks.</li>
</ul>
<h4>Pthreads</h4>
<p><code>pthread_create(&amp;tid, NULL, func, arg)</code> starts a thread running <code>func(arg)</code>; <code>pthread_join(tid, &amp;ret)</code> waits for it to terminate and reaps it (like waitpid); <code>pthread_detach</code> makes a thread reap itself; <code>pthread_self</code> returns its ID; returning from func or calling <code>pthread_exit</code> ends the thread. Compile with <code>-pthread</code> on Linux.</p>
<h4>Shared variables</h4>
<p>A variable is <strong>shared</strong> if more than one thread references an instance of it. Globals and static variables: one instance, potentially shared. Local automatic variables: one instance per thread (on each thread's stack) — but a pointer to one can still be passed to another thread. Heap objects: shared by whoever holds a pointer.</p>
<h4>Why races happen</h4>
<p><code>cnt++</code> looks like one operation, but the machine performs three: <strong>load</strong> cnt into a register, <strong>add</strong> 1, <strong>store</strong> it back. If thread 1 loads 41, then thread 2 loads 41, both store 42 — one increment is lost. Whether that happens depends on the exact interleaving chosen by the scheduler and the hardware, so the result changes from run to run. This is a <strong>race</strong>: correctness depends on timing.</p>
<h3>✍️ Worked example — measure a race</h3>
` + C(SRC_RACE) + `
` + out(OUT_RACE) + `
<p>Without the mutex we lost between 15% and 51% of the increments, and every run gave a different answer. The arm64 code of the loop shows why:</p>
` + ASM(ASM_RACE) + `
<p>Between <code>ldr</code> and <code>str</code> the other core can update cnt; its update is then overwritten. (On x86-64 the compiler may emit a single <code>incq cnt(%rip)</code>, but that read-modify-write is <em>still</em> not atomic without a <code>lock</code> prefix.) <code>volatile</code> does not help: it only forces memory accesses, it does not make them atomic. With a mutex around <code>cnt++</code> the result is exactly 20 000 000 — lesson 10.4 explains mutexes and their cost.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Passing <code>&amp;i</code> of a loop variable to <code>pthread_create</code> — all threads read the same, changing i. Pass a copy (e.g. malloc'ed or cast the value).</li><li>Believing that a race-free test run proves the code is correct — races are timing-dependent.</li><li>Using <code>volatile</code> as a synchronisation tool.</li><li>Forgetting to join or detach threads (leaked resources, like zombie processes).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Concurrent servers: processes (isolated), I/O multiplexing (event loop), threads (shared memory).</li><li>Threads share code, heap, globals and files; each has its own stack and registers.</li><li><code>cnt++</code> = load, add, store; interleavings lose updates.</li><li>Measured: 9.8–16.9 million instead of 20 million without a mutex.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://hpc-tutorials.llnl.gov/posix/" target="_blank" rel="noopener">LLNL — POSIX Threads Programming tutorial</a></li><li><a href="https://pages.cs.wisc.edu/~remzi/OSTEP/threads-intro.pdf" target="_blank" rel="noopener">OSTEP — Concurrency: An Introduction (PDF)</a></li><li><a href="https://man7.org/linux/man-pages/man3/pthread_create.3.html" target="_blank" rel="noopener">pthread_create(3) — Linux manual page</a></li><li><a href="https://en.wikipedia.org/wiki/Race_condition" target="_blank" rel="noopener">Wikipedia — Race condition</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Which approach would you choose for a server that must handle 10 000 mostly idle connections on one core, and why?</li><li>In <code>void *f(void *p) { int x = *(int *)p; static int calls; calls++; ... }</code>, which variables are shared?</li><li>Two threads each execute <code>cnt++</code> once, starting from cnt = 0. What final values are possible?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) I/O multiplexing (epoll): one thread, tiny per-connection state, no context-switch cost. 2) <code>calls</code> (static, one instance) and whatever <code>p</code> points to; <code>x</code> is per-thread. 3) 2 (no overlap) or 1 (both loaded 0 before either stored).</p></div>`,
  `<span class="eyebrow">ICS102 · Chương 10 · Bài 10.3</span>
<h2>Lập trình đồng thời: tiến trình, đa hợp I/O, luồng và tranh chấp</h2>
<p class="lead">Máy chủ echo của ta phục vụ mỗi lúc một client; một client chậm chặn tất cả. Server thật phải <strong>đồng thời</strong>. Có ba cách kinh điển để dựng. Luồng phổ biến nhất và nguy hiểm nhất — như ta sẽ đo, hai luồng cùng cộng vào một biến đếm có thể làm mất gần một nửa công sức.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>So sánh đồng thời dựa trên tiến trình, sự kiện (đa hợp I/O) và luồng.</li><li>Tạo và join luồng POSIX.</li><li>Xác định biến nào được các luồng dùng chung.</li><li>Giải thích tranh chấp dữ liệu ở mức lệnh máy.</li></ul>
<h3>📖 Bài giảng</h3>
<h4>Ba cách tiếp cận</h4>
<ul>
<li><strong>Tiến trình</strong>: sau <code>accept</code>, <code>fork</code> một con phục vụ client; cha quay lại accept (và thu dọn con bằng handler SIGCHLD). + Tách bạch, không vô tình chia sẻ. − Chia sẻ dữ liệu cần IPC tường minh; fork và chuyển ngữ cảnh khá tốn kém.</li>
<li><strong>Đa hợp I/O</strong> (hướng sự kiện): một tiến trình dùng <code>select</code>/<code>poll</code>/<code>epoll</code> chờ tới khi <em>một</em> descriptor nào đó sẵn sàng, rồi xử lý sự kiện đó như một máy trạng thái nhỏ. + Một không gian địa chỉ, không có luồng, mở rộng rất tốt (cách nginx và Node.js hoạt động). − Code phức tạp hơn; tự nó không dùng được nhiều lõi.</li>
<li><strong>Luồng</strong>: một tiến trình, nhiều luồng, mỗi luồng có ngăn xếp, thanh ghi, PC riêng nhưng dùng chung mã, heap, biến toàn cục và tệp đang mở. + Rẻ hơn tiến trình, chia sẻ dễ. − Dễ chia sẻ <em>ngoài ý muốn</em>: tranh chấp và khoá chết.</li>
</ul>
<h4>Pthreads</h4>
<p><code>pthread_create(&amp;tid, NULL, func, arg)</code> khởi động một luồng chạy <code>func(arg)</code>; <code>pthread_join(tid, &amp;ret)</code> chờ nó kết thúc và thu dọn (giống waitpid); <code>pthread_detach</code> cho luồng tự thu dọn; <code>pthread_self</code> trả ID của nó; trả về từ func hoặc gọi <code>pthread_exit</code> kết thúc luồng. Trên Linux biên dịch với <code>-pthread</code>.</p>
<h4>Biến dùng chung</h4>
<p>Một biến là <strong>dùng chung</strong> nếu nhiều hơn một luồng tham chiếu tới một thể hiện của nó. Biến toàn cục và static: một thể hiện, có thể dùng chung. Biến cục bộ tự động: mỗi luồng một thể hiện (trên ngăn xếp của từng luồng) — nhưng con trỏ tới nó vẫn có thể được đưa cho luồng khác. Đối tượng trên heap: dùng chung bởi ai giữ con trỏ.</p>
<h4>Vì sao có tranh chấp</h4>
<p><code>cnt++</code> trông như một phép, nhưng máy làm ba việc: <strong>nạp</strong> cnt vào thanh ghi, <strong>cộng</strong> 1, <strong>ghi</strong> lại. Nếu luồng 1 nạp 41, rồi luồng 2 nạp 41, cả hai ghi 42 — mất một lần tăng. Có xảy ra hay không tuỳ cách xen kẽ chính xác do bộ lập lịch và phần cứng chọn, nên kết quả đổi theo từng lần chạy. Đó là <strong>tranh chấp (race)</strong>: tính đúng phụ thuộc vào thời điểm.</p>
<h3>✍️ Ví dụ — đo một lần tranh chấp</h3>
` + C(SRC_RACE) + `
` + out(OUT_RACE) + `
<p>Không có mutex, ta mất từ 15% tới 51% số lần tăng, và mỗi lần chạy ra một đáp số khác. Mã arm64 của vòng lặp cho thấy vì sao:</p>
` + ASM(ASM_RACE) + `
<p>Giữa <code>ldr</code> và <code>str</code>, lõi kia có thể cập nhật cnt; cập nhật của nó sau đó bị ghi đè. (Trên x86-64 trình biên dịch có thể sinh một lệnh <code>incq cnt(%rip)</code>, nhưng thao tác đọc-sửa-ghi đó <em>vẫn</em> không nguyên tử nếu không có tiền tố <code>lock</code>.) <code>volatile</code> không giúp được: nó chỉ buộc truy cập bộ nhớ, không làm chúng nguyên tử. Có mutex quanh <code>cnt++</code>, kết quả đúng 20 000 000 — bài 10.4 giải thích mutex và cái giá của nó.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Truyền <code>&amp;i</code> của biến vòng lặp cho <code>pthread_create</code> — mọi luồng đọc cùng một i đang thay đổi. Hãy truyền bản sao (vd cấp bằng malloc hoặc ép giá trị).</li><li>Tin rằng một lần chạy thử không lỗi chứng minh code đúng — tranh chấp phụ thuộc thời điểm.</li><li>Dùng <code>volatile</code> như công cụ đồng bộ.</li><li>Quên join hoặc detach luồng (rò tài nguyên, như tiến trình zombie).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Server đồng thời: tiến trình (cô lập), đa hợp I/O (vòng lặp sự kiện), luồng (bộ nhớ chung).</li><li>Luồng dùng chung mã, heap, biến toàn cục, tệp; mỗi luồng có ngăn xếp và thanh ghi riêng.</li><li><code>cnt++</code> = nạp, cộng, ghi; xen kẽ làm mất cập nhật.</li><li>Đo được: 9,8–16,9 triệu thay vì 20 triệu khi không có mutex.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://hpc-tutorials.llnl.gov/posix/" target="_blank" rel="noopener">LLNL — POSIX Threads Programming</a></li><li><a href="https://pages.cs.wisc.edu/~remzi/OSTEP/threads-intro.pdf" target="_blank" rel="noopener">OSTEP — Concurrency: An Introduction (PDF)</a></li><li><a href="https://man7.org/linux/man-pages/man3/pthread_create.3.html" target="_blank" rel="noopener">pthread_create(3) — man page Linux</a></li><li><a href="https://en.wikipedia.org/wiki/Race_condition" target="_blank" rel="noopener">Wikipedia — Tranh chấp (race condition)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Bạn chọn cách nào cho server phải giữ 10 000 kết nối phần lớn rảnh trên một lõi, vì sao?</li><li>Trong <code>void *f(void *p) { int x = *(int *)p; static int calls; calls++; ... }</code>, biến nào dùng chung?</li><li>Hai luồng mỗi luồng chạy <code>cnt++</code> một lần, bắt đầu từ cnt = 0. Giá trị cuối có thể là gì?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Đa hợp I/O (epoll): một luồng, trạng thái mỗi kết nối rất nhỏ, không tốn chuyển ngữ cảnh. 2) <code>calls</code> (static, một thể hiện) và thứ mà <code>p</code> trỏ tới; <code>x</code> là riêng mỗi luồng. 3) 2 (không chồng nhau) hoặc 1 (cả hai đều nạp 0 trước khi bên nào ghi).</p></div>`);

const SRC_PC = String.raw`
#include <stdio.h>
#include <pthread.h>
#define CAP 4
#define NITEMS 10
static int buf[CAP], head = 0, tail = 0, count = 0;
static pthread_mutex_t mu = PTHREAD_MUTEX_INITIALIZER;
static pthread_cond_t not_full = PTHREAD_COND_INITIALIZER, not_empty = PTHREAD_COND_INITIALIZER;
static void put(int x) {
    pthread_mutex_lock(&mu);
    while (count == CAP) pthread_cond_wait(&not_full, &mu);   /* always re-check in a loop */
    buf[tail] = x; tail = (tail + 1) % CAP; count++;
    pthread_cond_signal(&not_empty);
    pthread_mutex_unlock(&mu);
}
static int get(void) {
    pthread_mutex_lock(&mu);
    while (count == 0) pthread_cond_wait(&not_empty, &mu);
    int x = buf[head]; head = (head + 1) % CAP; count--;
    pthread_cond_signal(&not_full);
    pthread_mutex_unlock(&mu);
    return x;
}
static void *producer(void *arg) { for (int i = 1; i <= NITEMS; i++) put(i * i); put(-1); return NULL; }
static void *consumer(void *arg) {
    long sum = 0; int x;
    while ((x = get()) != -1) sum += x;
    printf("consumer: sum of squares 1..%d = %ld\n", NITEMS, sum);
    return NULL;
}
int main(void) {
    pthread_t p, c;
    pthread_create(&c, NULL, consumer, NULL);
    pthread_create(&p, NULL, producer, NULL);
    pthread_join(p, NULL); pthread_join(c, NULL);
    return 0;
}
`;
const OUT_PC = String.raw`
$ cc -O1 -Wall pc.c -o pc && ./pc
consumer: sum of squares 1..10 = 385
`;

const SRC_LOCK = String.raw`
#include <stdio.h>
#include <pthread.h>
#include <time.h>
#define NITERS 10000000
static volatile long cnt = 0;
static pthread_mutex_t mu = PTHREAD_MUTEX_INITIALIZER;
static double now(void) { struct timespec t; clock_gettime(CLOCK_MONOTONIC, &t); return t.tv_sec + t.tv_nsec * 1e-9; }
static void *locked(void *arg) { for (long i = 0; i < NITERS; i++) { pthread_mutex_lock(&mu); cnt++; pthread_mutex_unlock(&mu); } return NULL; }
static void *local_sum(void *arg) { long l = 0; for (long i = 0; i < NITERS; i++) l++; pthread_mutex_lock(&mu); cnt += l; pthread_mutex_unlock(&mu); return NULL; }
int main(void) {
    double t0 = now(); for (long i = 0; i < 2L * NITERS; i++) cnt++; double t1 = now() - t0;
    printf("1 thread, no lock          : cnt=%ld  %.0f ms\n", cnt, t1 * 1e3);
    pthread_t a, b;
    cnt = 0; t0 = now();
    pthread_create(&a, NULL, locked, NULL); pthread_create(&b, NULL, locked, NULL);
    pthread_join(a, NULL); pthread_join(b, NULL);
    printf("2 threads, lock every ++   : cnt=%ld  %.0f ms\n", cnt, (now() - t0) * 1e3);
    cnt = 0; t0 = now();
    pthread_create(&a, NULL, local_sum, NULL); pthread_create(&b, NULL, local_sum, NULL);
    pthread_join(a, NULL); pthread_join(b, NULL);
    printf("2 threads, local sum + 1 lock: cnt=%ld  %.0f ms\n", cnt, (now() - t0) * 1e3);
    return 0;
}
`;
const OUT_LOCK = String.raw`
$ cc -O1 -Wall lockcost.c -o lockcost && ./lockcost
1 thread, no lock          : cnt=20000000  7 ms
2 threads, lock every ++   : cnt=20000000  273 ms
2 threads, local sum + 1 lock: cnt=20000000  0 ms
`;

const c104 = L('ics102-ts-10-4',
  '10.4 — Synchronisation: mutexes, semaphores, condition variables, deadlock, thread safety|||10.4 — Đồng bộ: mutex, semaphore, biến điều kiện, khoá chết, an toàn luồng',
  'Đoạn găng và loại trừ lẫn nhau; mutex; semaphore P/V của Dijkstra; biến điều kiện; bài toán producer–consumer với bộ đệm vòng chạy thật; khoá chết và quy tắc thứ tự khoá; hàm an toàn luồng và hàm reentrant; cái giá hiệu năng của đồng bộ.',
  `<span class="eyebrow">ICS102 · Chapter 10 · Lesson 10.4</span>
<h2>Synchronisation: mutexes, semaphores, condition variables, deadlock, thread safety</h2>
<p class="lead">To share data safely, threads must coordinate. This last lesson gives you the standard tools — mutexes, semaphores, condition variables — the classic producer–consumer pattern used by every job queue and web server, and the two famous ways concurrent programs fail: races and deadlocks.</p>
<h3>🎯 Objectives</h3>
<ul><li>Protect a critical section with a mutex.</li><li>Explain semaphores (P and V) and condition variables.</li><li>Implement a bounded producer–consumer buffer.</li><li>Recognise and prevent deadlock; define thread-safe and reentrant functions.</li></ul>
<h3>📖 Lecture</h3>
<h4>Critical sections and mutual exclusion</h4>
<p>The instructions that manipulate a shared variable (load–add–store of <code>cnt</code>) form a <strong>critical section</strong>. We need <strong>mutual exclusion</strong>: at most one thread inside at a time. A <strong>mutex</strong> (lock) does this: <code>pthread_mutex_lock</code> waits until the lock is free and takes it; <code>pthread_mutex_unlock</code> releases it. This is what fixed our counter in lesson 10.3.</p>
<h4>Semaphores</h4>
<p>Edsger Dijkstra's <strong>semaphore</strong> is a non-negative integer s with two atomic operations: <strong>P(s)</strong> — if s &gt; 0 decrement it and continue, otherwise wait until it becomes positive; <strong>V(s)</strong> — increment s and wake one waiting thread. A semaphore initialised to 1 is a mutex (“binary semaphore”); initialised to n it counts available resources (n free slots). POSIX: <code>sem_wait</code> = P, <code>sem_post</code> = V. (Note: unnamed POSIX semaphores, <code>sem_init</code>, are not supported on macOS; there use mutex + condition variable, as below, or named semaphores.)</p>
<h4>Condition variables</h4>
<p>A <strong>condition variable</strong> lets a thread sleep until some condition on shared data becomes true. <code>pthread_cond_wait(&amp;cv, &amp;mu)</code> atomically releases the mutex and sleeps; when woken it re-acquires the mutex before returning. Always wait in a <strong>while loop</strong> that re-checks the condition (wake-ups can be spurious or the condition may have changed again). <code>pthread_cond_signal</code> wakes one waiter, <code>pthread_cond_broadcast</code> all.</p>
<h4>Producer–consumer</h4>
<p>A producer thread inserts items into a bounded buffer; a consumer removes them. The producer must wait while the buffer is full, the consumer while it is empty. This pattern is everywhere: a web server's accept thread puts connected descriptors into a buffer and a pool of worker threads takes them out (CS:APP's prethreaded server, using semaphores in its <code>sbuf</code> package).</p>
<h3>✍️ Worked example — a bounded buffer with mutex + condition variables</h3>
` + C(SRC_PC) + `
` + out(OUT_PC) + `
<p>1 + 4 + 9 + … + 100 = 385: every item produced was consumed exactly once, although the buffer holds only 4 items and the two threads ran concurrently. The value −1 is a sentinel telling the consumer to stop.</p>
<h4>Deadlock</h4>
<p>Thread 1 holds lock A and waits for B; thread 2 holds B and waits for A: both wait forever — <strong>deadlock</strong>. A simple, effective rule: <strong>lock ordering</strong> — give all locks a global order and always acquire them in that order (release order does not matter). Then no cycle of waiting can form.</p>
<h4>Thread safety</h4>
<p>A function is <strong>thread-safe</strong> if it always produces correct results when called repeatedly from multiple concurrent threads. Classic thread-unsafe functions: those that do not protect shared variables, keep state across calls (<code>rand</code>, <code>strtok</code>), or return a pointer to a static buffer (<code>ctime</code>, <code>gethostbyname</code>). Use the <code>_r</code> versions (<code>strtok_r</code>, <code>ctime_r</code>) or <code>getaddrinfo</code>. A <strong>reentrant</strong> function uses no shared data at all — the strongest form of thread safety.</p>
<h4>The cost of synchronisation</h4>
<p>Locks are not free. We measured three ways to reach 20 million:</p>
` + C(SRC_LOCK) + out(OUT_LOCK) + `
<p>Two threads that lock around every <code>++</code> are about <strong>40× slower</strong> than one thread without any lock: the lock operations and the cache line holding <code>cnt</code> bouncing between the two cores dominate. With a private counter per thread and one locked addition at the end, the cost disappears (the optimiser even replaced the private loop by a single addition, so the time rounds to 0 ms). Good parallel code minimises sharing: each thread works on private data and combines results once at the end.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using <code>if</code> instead of <code>while</code> around <code>pthread_cond_wait</code>.</li><li>Forgetting to unlock on an error path (early return) — the next lock() hangs forever.</li><li>Acquiring locks in different orders in different functions → deadlock.</li><li>Locking inside a tight loop when per-thread accumulation would avoid sharing.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Critical sections need mutual exclusion: mutex lock/unlock.</li><li>Semaphores: P waits/decrements, V increments/wakes; counting resources.</li><li>Condition variables: wait in a while loop with the mutex held; signal/broadcast.</li><li>Prevent deadlock with a global lock order; prefer thread-safe/reentrant functions; minimise sharing.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://pages.cs.wisc.edu/~remzi/OSTEP/threads-locks.pdf" target="_blank" rel="noopener">OSTEP — Locks (PDF)</a></li><li><a href="https://pages.cs.wisc.edu/~remzi/OSTEP/threads-cv.pdf" target="_blank" rel="noopener">OSTEP — Condition Variables (PDF)</a></li><li><a href="https://pages.cs.wisc.edu/~remzi/OSTEP/threads-bugs.pdf" target="_blank" rel="noopener">OSTEP — Common Concurrency Problems (deadlock) (PDF)</a></li><li><a href="https://en.wikipedia.org/wiki/Producer%E2%80%93consumer_problem" target="_blank" rel="noopener">Wikipedia — Producer–consumer problem</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Rewrite the counter thread so it is correct but locks only once per thread.</li><li>Function f locks A then B; function g locks B then A. What can happen, and how do you fix it?</li><li>Why must <code>pthread_cond_wait</code> receive the mutex as an argument?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) <code>long local = 0; for (...) local++; pthread_mutex_lock(&amp;mu); cnt += local; pthread_mutex_unlock(&amp;mu);</code>. 2) Deadlock if f holds A and g holds B at the same time; make both acquire A before B. 3) It must release the mutex and go to sleep atomically — otherwise a signal sent between “check condition” and “sleep” could be missed — and re-acquire it before returning.</p></div>`,
  `<span class="eyebrow">ICS102 · Chương 10 · Bài 10.4</span>
<h2>Đồng bộ: mutex, semaphore, biến điều kiện, khoá chết, an toàn luồng</h2>
<p class="lead">Để chia sẻ dữ liệu an toàn, các luồng phải phối hợp. Bài cuối này đưa bạn các công cụ chuẩn — mutex, semaphore, biến điều kiện — mẫu producer–consumer kinh điển mà mọi hàng đợi công việc và web server đều dùng, và hai cách nổi tiếng khiến chương trình đồng thời hỏng: tranh chấp và khoá chết.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Bảo vệ đoạn găng bằng mutex.</li><li>Giải thích semaphore (P và V) và biến điều kiện.</li><li>Hiện thực bộ đệm producer–consumer có giới hạn.</li><li>Nhận ra và phòng khoá chết; định nghĩa hàm an toàn luồng và hàm reentrant.</li></ul>
<h3>📖 Bài giảng</h3>
<h4>Đoạn găng và loại trừ lẫn nhau</h4>
<p>Các lệnh thao tác trên biến dùng chung (nạp–cộng–ghi của <code>cnt</code>) tạo thành một <strong>đoạn găng (critical section)</strong>. Ta cần <strong>loại trừ lẫn nhau</strong>: mỗi lúc tối đa một luồng ở trong đó. <strong>Mutex</strong> (khoá) làm việc này: <code>pthread_mutex_lock</code> chờ tới khi khoá rảnh rồi chiếm; <code>pthread_mutex_unlock</code> nhả khoá. Đó là thứ đã sửa biến đếm của ta ở bài 10.3.</p>
<h4>Semaphore</h4>
<p><strong>Semaphore</strong> của Edsger Dijkstra là một số nguyên không âm s với hai thao tác nguyên tử: <strong>P(s)</strong> — nếu s &gt; 0 thì giảm và chạy tiếp, ngược lại chờ tới khi nó dương; <strong>V(s)</strong> — tăng s và đánh thức một luồng đang chờ. Semaphore khởi tạo bằng 1 là một mutex (“semaphore nhị phân”); khởi tạo bằng n thì đếm tài nguyên còn trống (n ô trống). POSIX: <code>sem_wait</code> = P, <code>sem_post</code> = V. (Lưu ý: semaphore POSIX không tên, <code>sem_init</code>, không được hỗ trợ trên macOS; ở đó dùng mutex + biến điều kiện như dưới, hoặc semaphore có tên.)</p>
<h4>Biến điều kiện</h4>
<p><strong>Biến điều kiện (condition variable)</strong> cho một luồng ngủ tới khi một điều kiện trên dữ liệu chung trở thành đúng. <code>pthread_cond_wait(&amp;cv, &amp;mu)</code> nhả mutex và ngủ một cách nguyên tử; khi được đánh thức nó chiếm lại mutex rồi mới trả về. Luôn chờ trong một <strong>vòng while</strong> kiểm lại điều kiện (có thể bị đánh thức giả, hoặc điều kiện đã đổi lần nữa). <code>pthread_cond_signal</code> đánh thức một luồng chờ, <code>pthread_cond_broadcast</code> đánh thức tất cả.</p>
<h4>Producer–consumer</h4>
<p>Luồng sản xuất (producer) đưa phần tử vào một bộ đệm có giới hạn; luồng tiêu thụ (consumer) lấy ra. Producer phải chờ khi bộ đệm đầy, consumer chờ khi rỗng. Mẫu này ở khắp nơi: luồng accept của web server đưa các descriptor đã kết nối vào bộ đệm và một nhóm luồng làm việc lấy ra (server tạo luồng sẵn của CS:APP, dùng semaphore trong gói <code>sbuf</code>).</p>
<h3>✍️ Ví dụ — bộ đệm có giới hạn với mutex + biến điều kiện</h3>
` + C(SRC_PC) + `
` + out(OUT_PC) + `
<p>1 + 4 + 9 + … + 100 = 385: mọi phần tử được sản xuất đều được tiêu thụ đúng một lần, dù bộ đệm chỉ chứa 4 phần tử và hai luồng chạy đồng thời. Giá trị −1 là lính canh báo consumer dừng.</p>
<h4>Khoá chết</h4>
<p>Luồng 1 giữ khoá A và chờ B; luồng 2 giữ B và chờ A: cả hai chờ mãi — <strong>khoá chết (deadlock)</strong>. Một quy tắc đơn giản, hiệu quả: <strong>thứ tự khoá</strong> — đặt cho mọi khoá một thứ tự toàn cục và luôn chiếm chúng theo thứ tự đó (thứ tự nhả không quan trọng). Khi đó không thể hình thành vòng chờ.</p>
<h4>An toàn luồng</h4>
<p>Một hàm là <strong>an toàn luồng (thread-safe)</strong> nếu luôn cho kết quả đúng khi được gọi lặp đi lặp lại từ nhiều luồng đồng thời. Hàm không an toàn kinh điển: không bảo vệ biến dùng chung, giữ trạng thái giữa các lần gọi (<code>rand</code>, <code>strtok</code>), hoặc trả con trỏ tới bộ đệm static (<code>ctime</code>, <code>gethostbyname</code>). Dùng bản <code>_r</code> (<code>strtok_r</code>, <code>ctime_r</code>) hoặc <code>getaddrinfo</code>. Hàm <strong>reentrant</strong> không dùng dữ liệu chung nào — dạng an toàn luồng mạnh nhất.</p>
<h4>Cái giá của đồng bộ</h4>
<p>Khoá không miễn phí. Chúng tôi đo ba cách để đạt 20 triệu:</p>
` + C(SRC_LOCK) + out(OUT_LOCK) + `
<p>Hai luồng khoá quanh mỗi lần <code>++</code> chậm hơn khoảng <strong>40 lần</strong> so với một luồng không khoá: thao tác khoá và dòng cache chứa <code>cnt</code> bị chuyền qua lại giữa hai lõi chiếm hết thời gian. Với biến đếm riêng cho mỗi luồng và một phép cộng có khoá ở cuối, chi phí biến mất (bộ tối ưu còn thay vòng lặp riêng bằng một phép cộng, nên thời gian làm tròn thành 0 ms). Code song song tốt giảm tối đa chia sẻ: mỗi luồng làm trên dữ liệu riêng và gộp kết quả một lần ở cuối.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng <code>if</code> thay vì <code>while</code> quanh <code>pthread_cond_wait</code>.</li><li>Quên mở khoá ở nhánh lỗi (return sớm) — lần lock() sau treo mãi.</li><li>Chiếm khoá theo thứ tự khác nhau ở các hàm khác nhau → khoá chết.</li><li>Khoá bên trong vòng lặp chặt trong khi cộng dồn riêng từng luồng đã tránh được chia sẻ.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Đoạn găng cần loại trừ lẫn nhau: mutex lock/unlock.</li><li>Semaphore: P chờ/giảm, V tăng/đánh thức; dùng đếm tài nguyên.</li><li>Biến điều kiện: chờ trong vòng while khi giữ mutex; signal/broadcast.</li><li>Phòng khoá chết bằng thứ tự khoá toàn cục; ưu tiên hàm an toàn luồng/reentrant; giảm chia sẻ.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://pages.cs.wisc.edu/~remzi/OSTEP/threads-locks.pdf" target="_blank" rel="noopener">OSTEP — Locks (PDF)</a></li><li><a href="https://pages.cs.wisc.edu/~remzi/OSTEP/threads-cv.pdf" target="_blank" rel="noopener">OSTEP — Condition Variables (PDF)</a></li><li><a href="https://pages.cs.wisc.edu/~remzi/OSTEP/threads-bugs.pdf" target="_blank" rel="noopener">OSTEP — Common Concurrency Problems (khoá chết) (PDF)</a></li><li><a href="https://en.wikipedia.org/wiki/Producer%E2%80%93consumer_problem" target="_blank" rel="noopener">Wikipedia — Bài toán producer–consumer</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Viết lại luồng đếm sao cho đúng nhưng mỗi luồng chỉ khoá một lần.</li><li>Hàm f khoá A rồi B; hàm g khoá B rồi A. Chuyện gì có thể xảy ra, sửa thế nào?</li><li>Vì sao <code>pthread_cond_wait</code> phải nhận mutex làm đối số?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) <code>long local = 0; for (...) local++; pthread_mutex_lock(&amp;mu); cnt += local; pthread_mutex_unlock(&amp;mu);</code>. 2) Khoá chết nếu f giữ A và g giữ B cùng lúc; cho cả hai chiếm A trước B. 3) Nó phải nhả mutex và đi ngủ một cách nguyên tử — nếu không, một tín hiệu gửi giữa “kiểm điều kiện” và “ngủ” có thể bị lỡ — rồi chiếm lại mutex trước khi trả về.</p></div>`);

const q10 = QZ(10, 'Quiz — Chapter 10: System I/O, networking and concurrency|||Quiz — Chương 10: Vào/ra hệ thống, mạng và đồng thời', 'Kiểm tra chương 10: descriptor, đếm thiếu, dup2, bộ đệm stdio, socket, thứ tự byte mạng, ba mô hình đồng thời, tranh chấp, mutex, biến điều kiện, khoá chết.', [
  Q('q1', 'A freshly started process calls open() for the first time. It usually gets descriptor|||Một tiến trình vừa khởi động gọi open() lần đầu. Nó thường nhận descriptor',
    ['0|||0', '1|||1', '3|||3', '1024|||1024'], 2,
    '0, 1, 2 are stdin, stdout, stderr; open returns the lowest unused number.|||0, 1, 2 là stdin, stdout, stderr; open trả số nhỏ nhất chưa dùng.'),
  Q('q2', 'read() returning 0 means|||read() trả về 0 nghĩa là',
    ['an error|||lỗi', 'end of file|||hết tệp (EOF)', 'try again|||thử lại', 'the buffer is full|||bộ đệm đầy'], 1,
    'Errors return −1; short counts return fewer bytes than requested.|||Lỗi trả −1; đếm thiếu trả ít byte hơn yêu cầu.'),
  Q('q3', 'How does a shell implement ./prog > out.txt?|||Shell hiện thực ./prog > out.txt thế nào?',
    ['by rewriting prog|||bằng cách sửa prog', 'fork, open out.txt, dup2(fd, 1), execve prog|||fork, mở out.txt, dup2(fd, 1), execve prog', 'by piping through cat|||bằng pipe qua cat', 'by setting an environment variable|||bằng biến môi trường'], 1,
    'dup2 makes descriptor 1 refer to the file before the program starts.|||dup2 cho descriptor 1 trỏ tới tệp trước khi chương trình chạy.'),
  Q('q4', 'When stdout is redirected to a file or pipe, printf output is|||Khi stdout bị chuyển hướng ra tệp hay pipe, output của printf được',
    ['unbuffered|||không đệm', 'line-buffered|||đệm theo dòng', 'fully buffered — call fflush before redirecting or mixing with write|||đệm toàn phần — gọi fflush trước khi chuyển hướng hoặc trộn với write', 'discarded|||bỏ đi'], 2,
    'We hit exactly this bug while preparing lesson 10.1.|||Ta đã gặp đúng lỗi này khi soạn bài 10.1.'),
  Q('q5', 'The correct order of calls for a TCP server is|||Thứ tự lời gọi đúng của một TCP server là',
    ['socket, connect, accept|||socket, connect, accept', 'socket, bind, listen, accept|||socket, bind, listen, accept', 'bind, socket, accept, listen|||bind, socket, accept, listen', 'listen, socket, bind|||listen, socket, bind'], 1,
    'The client uses socket then connect.|||Client dùng socket rồi connect.'),
  Q('q6', 'IP addresses and port numbers in socket structures are stored in|||Địa chỉ IP và số cổng trong cấu trúc socket được lưu theo',
    ['host byte order|||thứ tự byte của máy', 'network byte order (big-endian)|||thứ tự byte mạng (big-endian)', 'little-endian always|||luôn little-endian', 'ASCII|||ASCII'], 1,
    'Convert with htons/htonl, or let getaddrinfo fill them.|||Đổi bằng htons/htonl, hoặc để getaddrinfo điền.'),
  Q('q7', 'Which concurrency approach do nginx and Node.js mainly use?|||nginx và Node.js chủ yếu dùng cách đồng thời nào?',
    ['one process per client|||mỗi client một tiến trình', 'I/O multiplexing / event loop|||đa hợp I/O / vòng lặp sự kiện', 'one thread per byte|||mỗi byte một luồng', 'none|||không cách nào'], 1,
    'select/poll/epoll wait for whichever descriptor is ready.|||select/poll/epoll chờ descriptor nào sẵn sàng.'),
  Q('q8', 'Two threads each increment a shared counter 10 million times without a lock. In our runs the result was|||Hai luồng mỗi luồng tăng biến đếm chung 10 triệu lần không khoá. Trong các lần chạy, kết quả là',
    ['always 20,000,000|||luôn 20.000.000', 'between about 9.8 and 16.9 million, different each run|||khoảng 9,8 tới 16,9 triệu, mỗi lần khác', 'always 10,000,000|||luôn 10.000.000', 'a crash|||sập chương trình'], 1,
    'cnt++ is load–add–store; interleavings lose updates.|||cnt++ là nạp–cộng–ghi; xen kẽ làm mất cập nhật.'),
  Q('q9', 'Why must pthread_cond_wait be called inside a while loop?|||Vì sao phải gọi pthread_cond_wait trong vòng while?',
    ['for speed|||cho nhanh', 'the condition must be re-checked after waking (spurious wake-ups, changed state)|||phải kiểm lại điều kiện sau khi thức (thức giả, trạng thái đã đổi)', 'because it returns twice|||vì nó trả về hai lần', 'to avoid compiling errors|||để tránh lỗi biên dịch'], 1,
    'An if would proceed even though the buffer might still be full or empty.|||Dùng if sẽ đi tiếp dù bộ đệm có thể vẫn đầy hoặc rỗng.'),
  Q('q10', 'A simple rule that prevents deadlock between locks A and B is|||Quy tắc đơn giản phòng khoá chết giữa hai khoá A và B là',
    ['use more threads|||dùng nhiều luồng hơn', 'always acquire them in the same global order|||luôn chiếm chúng theo cùng một thứ tự toàn cục', 'unlock in reverse order|||mở khoá theo thứ tự ngược', 'use volatile|||dùng volatile'], 1,
    'With a global lock order no cycle of waiting threads can form.|||Có thứ tự khoá toàn cục thì không thể hình thành vòng chờ.'),
]);

const ch10 = {
  title: 'Chapter 10 — System I/O, network programming and concurrency|||Chương 10 — Vào/ra hệ thống, lập trình mạng và đồng thời',
  description: 'Unix I/O và descriptor, đếm thiếu, dup2, bộ đệm stdio (lỗi thật); socket và máy chủ echo chạy thật, HTTP; ba mô hình đồng thời, Pthreads, tranh chấp đo thật; mutex, semaphore, biến điều kiện, producer–consumer chạy thật, khoá chết (CS:APP chương 10–12).',
  lessons: [c101, c102, c103, c104, q10],
};

// ───────────────────────────── Xuất ─────────────────────────────
export default [muc0, ch1, ch2, ch3, ch4, ch5, ch6, ch7, ch8, ch9, ch10];
