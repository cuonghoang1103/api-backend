/**
 * ICS102 — Introduction to Computer Systems (Nhập môn Hệ thống máy tính).
 * Ngành Khoa học Máy tính FPTU, Kỳ 1. Khung chất lượng — 8 chương theo
 * góc nhìn LẬP TRÌNH VIÊN về hệ thống.
 * Tài liệu chuẩn: Bryant & O'Hallaron "Computer Systems: A Programmer's
 * Perspective" (CSAPP) + CMU 15-213; Patterson & Hennessy. Lộ trình 4 bước.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${ lồng; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('ics102-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn (CSAPP, Patterson & Hennessy), CMU 15-213, YouTube, công cụ (Compiler Explorer), lộ trình 4 bước.',
  [[
    `<span class="eyebrow">ICS102 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>how a computer really runs your program</strong> — from a programmer's point of view — in one place. Official slides &amp; syllabus live on <strong>FLM</strong>; below are legal, mostly-free resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU syllabus &amp; lecture slides for ICS102 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Core reference books</h3>
<ul>
<li><a href="https://csapp.cs.cmu.edu/" target="_blank" rel="noopener">Bryant &amp; O'Hallaron — <em>Computer Systems: A Programmer's Perspective</em> (CSAPP)</a> — the primary text for this course</li>
<li><a href="https://www.elsevier.com/books/computer-organization-and-design-risc-v-edition/patterson/978-0-12-820331-6" target="_blank" rel="noopener">Patterson &amp; Hennessy — <em>Computer Organization and Design</em></a> (the hardware side)</li>
</ul>
<h3>🌐 Official / free courses</h3>
<ul>
<li><a href="https://www.cs.cmu.edu/~213/" target="_blank" rel="noopener">CMU 15-213 — Intro to Computer Systems (the course CSAPP was written for)</a></li>
<li><a href="https://pages.cs.wisc.edu/~remzi/OSTEP/" target="_blank" rel="noopener">OSTEP — Operating Systems: Three Easy Pieces (free, processes &amp; memory)</a></li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@BenEater" target="_blank" rel="noopener">Ben Eater</a> — build an 8-bit computer from logic gates</li>
<li><a href="https://www.youtube.com/@Computerphile" target="_blank" rel="noopener">Computerphile</a> — bits, floats, caches &amp; CPU explainers</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://godbolt.org/" target="_blank" rel="noopener">Compiler Explorer (Godbolt)</a> — see the x86-64 assembly your C compiles to, live</li>
<li><a href="https://pythontutor.com/c.html" target="_blank" rel="noopener">C Tutor</a> — visualize memory, the stack &amp; pointers step by step</li>
<li><a href="https://float.exposed/" target="_blank" rel="noopener">float.exposed</a> — inspect the bits of any IEEE 754 number</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — how data is represented in bits (integers, floats, endianness) and how C maps onto machine code.</li>
<li><strong>Practice</strong> — compile small C on Godbolt, read the assembly, and trace the stack in C Tutor until it matches.</li>
<li><strong>Go deeper</strong> — the memory hierarchy &amp; caches, linking &amp; loading, exceptions, processes and virtual memory.</li>
<li><strong>Job-ready</strong> — write cache-friendly code, debug with a real understanding of what the machine is doing underneath.</li>
</ol></div>`,
    `<span class="eyebrow">ICS102 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để hiểu <strong>máy tính thật ra chạy chương trình của bạn thế nào</strong> — từ góc nhìn lập trình viên — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của ICS102 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách chuẩn tham khảo</h3>
<ul>
<li><a href="https://csapp.cs.cmu.edu/" target="_blank" rel="noopener">Bryant &amp; O'Hallaron — <em>Computer Systems: A Programmer's Perspective</em> (CSAPP)</a> — sách chính của môn</li>
<li><a href="https://www.elsevier.com/books/computer-organization-and-design-risc-v-edition/patterson/978-0-12-820331-6" target="_blank" rel="noopener">Patterson &amp; Hennessy — <em>Computer Organization and Design</em></a> (phía phần cứng)</li>
</ul>
<h3>🌐 Khoá học chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.cs.cmu.edu/~213/" target="_blank" rel="noopener">CMU 15-213 — Intro to Computer Systems (khoá mà CSAPP được viết cho)</a></li>
<li><a href="https://pages.cs.wisc.edu/~remzi/OSTEP/" target="_blank" rel="noopener">OSTEP — Operating Systems: Three Easy Pieces (miễn phí, tiến trình &amp; bộ nhớ)</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@BenEater" target="_blank" rel="noopener">Ben Eater</a> — dựng máy tính 8-bit từ cổng logic</li>
<li><a href="https://www.youtube.com/@Computerphile" target="_blank" rel="noopener">Computerphile</a> — giảng bit, số thực, cache &amp; CPU</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://godbolt.org/" target="_blank" rel="noopener">Compiler Explorer (Godbolt)</a> — xem mã assembly x86-64 mà C của bạn biên dịch ra, trực tiếp</li>
<li><a href="https://pythontutor.com/c.html" target="_blank" rel="noopener">C Tutor</a> — trực quan hoá bộ nhớ, ngăn xếp &amp; con trỏ từng bước</li>
<li><a href="https://float.exposed/" target="_blank" rel="noopener">float.exposed</a> — soi từng bit của số IEEE 754</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — dữ liệu được biểu diễn bằng bit thế nào (số nguyên, số thực, endianness) và C ánh xạ xuống mã máy ra sao.</li>
<li><strong>Luyện tập</strong> — biên dịch C nhỏ trên Godbolt, đọc assembly, và lần theo ngăn xếp trong C Tutor đến khi khớp.</li>
<li><strong>Đào sâu</strong> — phân cấp bộ nhớ &amp; cache, liên kết &amp; nạp, ngoại lệ, tiến trình và bộ nhớ ảo.</li>
<li><strong>Sẵn sàng đi làm</strong> — viết mã thân thiện cache, debug với hiểu biết thật về máy đang làm gì bên dưới.</li>
</ol></div>`,
  ]]);

const intro = doc('ics102-0-1-overview', 'Course overview: how computers run your code|||Tổng quan: máy tính chạy mã của bạn thế nào',
  'Hệ thống máy tính là gì; góc nhìn lập trình viên (CSAPP); từ mã C → mã máy → phần cứng; lộ trình 8 chương: biểu diễn dữ liệu → assembly → CPU → bộ nhớ/cache → liên kết → tiến trình → I/O.',
  [[
    `<span class="eyebrow">ICS102 · Lesson 0.1 · Overview</span>
<h2>How computers run your code</h2>
<p class="lead">This course looks <strong>underneath</strong> your programs: what really happens between the C you write and the electrons in the chip. The angle is the one from <strong>CSAPP</strong> — a <em>programmer's</em> view of the machine, so that you write faster, more correct, more secure code.</p>
<h3>The big idea</h3>
<p>A program is text, but the CPU only runs <strong>numbers</strong>. So everything — code, data, addresses — is encoded as <strong>bits</strong>. Understanding that encoding explains puzzles like why <code>x + 1</code> can be smaller than <code>x</code> (overflow), or why <code>0.1 + 0.2 != 0.3</code>.</p>
<pre><code>C source  --compile--&gt;  assembly  --assemble--&gt;  machine code
   |                                                  |
 what you write                              what the CPU executes
</code></pre>
<h3>Roadmap (8 chapters)</h3>
<p>Data in bits (integers, IEEE 754 floats) → machine code &amp; x86-64 assembly → control &amp; procedures (the stack) → the CPU (pipelining) → the memory hierarchy &amp; caches → linking &amp; loading → exceptions &amp; processes → system-level I/O &amp; networking. Bilingual, with C/assembly examples and a quiz per chapter.</p>`,
    `<span class="eyebrow">ICS102 · Bài 0.1 · Tổng quan</span>
<h2>Máy tính chạy mã của bạn thế nào</h2>
<p class="lead">Môn này nhìn <strong>xuống dưới</strong> chương trình: điều gì thật sự xảy ra giữa dòng C bạn viết và các electron trong con chip. Góc nhìn là của <strong>CSAPP</strong> — cách một <em>lập trình viên</em> nhìn cỗ máy, để bạn viết mã nhanh hơn, đúng hơn, an toàn hơn.</p>
<h3>Ý tưởng lớn</h3>
<p>Chương trình là văn bản, nhưng CPU chỉ chạy <strong>số</strong>. Nên mọi thứ — mã, dữ liệu, địa chỉ — đều được mã hoá thành <strong>bit</strong>. Hiểu cách mã hoá đó giải thích những câu đố như vì sao <code>x + 1</code> có thể nhỏ hơn <code>x</code> (tràn số), hay vì sao <code>0.1 + 0.2 != 0.3</code>.</p>
<pre><code>Mã C  --biên dịch--&gt;  assembly  --hợp dịch--&gt;  mã máy
  |                                              |
bạn viết                              CPU thực thi
</code></pre>
<h3>Lộ trình (8 chương)</h3>
<p>Dữ liệu dạng bit (số nguyên, số thực IEEE 754) → mã máy &amp; assembly x86-64 → điều khiển &amp; thủ tục (ngăn xếp) → CPU (pipeline) → phân cấp bộ nhớ &amp; cache → liên kết &amp; nạp → ngoại lệ &amp; tiến trình → I/O mức hệ thống &amp; mạng. Song ngữ, có ví dụ C/assembly và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('ics102-1-1-info', '1.1 — Representing information: bits, integers & floats|||1.1 — Biểu diễn thông tin: bit, số nguyên & số thực',
  'Bit & byte, hệ hex; số nguyên không dấu (unsigned) & có dấu (bù 2 / two-complement); tràn số; số thực IEEE 754 (dấu/mũ/định trị); endianness (little/big).',
  [[
    `<span class="eyebrow">ICS102 · Chapter 1 · Lesson 1.1</span>
<h2>Representing information</h2>
<h3>Bits, bytes, hex</h3>
<p>Everything is a string of <strong>bits</strong> (0/1). Eight bits make a <strong>byte</strong>. We write bytes in <strong>hexadecimal</strong> (base 16) because each hex digit is exactly 4 bits: <code>0xFF</code> = <code>1111 1111</code> = 255.</p>
<h3>Integers: unsigned vs two's complement</h3>
<ul>
<li><strong>Unsigned</strong> — plain binary, range 0 .. 2^n − 1.</li>
<li><strong>Signed (two's complement)</strong> — the top bit has <em>negative</em> weight, so an <code>int8_t</code> ranges −128 .. 127. Negate a number by flipping all bits and adding 1.</li>
</ul>
<p>Because the range is finite, arithmetic <strong>wraps</strong> (overflow): for an 8-bit signed value, <code>127 + 1 = −128</code>.</p>
<h3>Real numbers: IEEE 754</h3>
<p>A <code>float</code> stores <strong>sign · exponent · fraction</strong> (like scientific notation in base 2). This is why most decimals are inexact: <code>0.1</code> has no finite binary form, so <code>0.1 + 0.2 != 0.3</code>.</p>
<pre><code>uint8_t  u = 255; u = u + 1;   // -&gt; 0    (wraps)
int8_t   s = 127; s = s + 1;   // -&gt; -128 (overflow)
0.1 + 0.2 == 0.3               // -&gt; false (IEEE 754 rounding)
</code></pre>
<div class="callout"><span class="badge">Endianness</span> A multi-byte value can be stored low-byte-first (<strong>little-endian</strong>, x86) or high-byte-first (<strong>big-endian</strong>). It matters when you read raw bytes or send data over a network.</div>`,
    `<span class="eyebrow">ICS102 · Chương 1 · Bài 1.1</span>
<h2>Biểu diễn thông tin</h2>
<h3>Bit, byte, hex</h3>
<p>Mọi thứ là một chuỗi <strong>bit</strong> (0/1). Tám bit tạo thành một <strong>byte</strong>. Ta viết byte theo <strong>thập lục phân</strong> (cơ số 16) vì mỗi chữ số hex đúng bằng 4 bit: <code>0xFF</code> = <code>1111 1111</code> = 255.</p>
<h3>Số nguyên: không dấu vs bù 2</h3>
<ul>
<li><strong>Không dấu (unsigned)</strong> — nhị phân thuần, khoảng 0 .. 2^n − 1.</li>
<li><strong>Có dấu (bù 2)</strong> — bit cao nhất mang trọng số <em>âm</em>, nên <code>int8_t</code> chạy từ −128 .. 127. Đổi dấu bằng cách lật hết bit rồi cộng 1.</li>
</ul>
<p>Vì khoảng là hữu hạn nên phép tính bị <strong>cuộn vòng</strong> (tràn số): với số có dấu 8-bit, <code>127 + 1 = −128</code>.</p>
<h3>Số thực: IEEE 754</h3>
<p>Một <code>float</code> lưu <strong>dấu · số mũ · định trị</strong> (như ký hiệu khoa học ở cơ số 2). Đây là lý do đa số số thập phân không chính xác: <code>0.1</code> không có dạng nhị phân hữu hạn, nên <code>0.1 + 0.2 != 0.3</code>.</p>
<pre><code>uint8_t  u = 255; u = u + 1;   // -&gt; 0    (cuộn vòng)
int8_t   s = 127; s = s + 1;   // -&gt; -128 (tràn số)
0.1 + 0.2 == 0.3               // -&gt; false (làm tròn IEEE 754)
</code></pre>
<div class="callout"><span class="badge">Endianness</span> Một giá trị nhiều byte có thể lưu byte-thấp-trước (<strong>little-endian</strong>, x86) hoặc byte-cao-trước (<strong>big-endian</strong>). Nó quan trọng khi bạn đọc byte thô hoặc gửi dữ liệu qua mạng.</div>`,
  ]]);

const c1q = quiz('ics102-quiz-1', 'Quiz 1 — Representing information|||Quiz 1 — Biểu diễn thông tin', [
  { id: 'q1', question: 'Số nguyên có dấu trong máy tính thường được biểu diễn bằng?', options: ['Dấu-độ lớn', 'Bù 2 (two’s complement)', 'Số BCD', 'Số hex thuần'], correctIndex: 1, explanation: 'Bù 2: bit cao nhất mang trọng số âm; đổi dấu = lật bit + 1.' },
  { id: 'q2', question: 'Vì sao 0.1 + 0.2 != 0.3 trong hầu hết ngôn ngữ?', options: ['Lỗi trình biên dịch', 'CPU cộng sai', '0.1 không có dạng nhị phân hữu hạn (IEEE 754 làm tròn)', 'Do endianness'], correctIndex: 2, explanation: 'IEEE 754 dùng cơ số 2; 0.1 lặp vô hạn nên bị làm tròn.' },
  { id: 'q3', question: 'Với int8_t (8-bit có dấu), 127 + 1 cho ra?', options: ['128', '0', '-128', 'Lỗi tràn dừng chương trình'], correctIndex: 2, explanation: 'Khoảng hữu hạn nên cuộn vòng: 127 + 1 = -128.' },
]);

const c2 = doc('ics102-2-1-machine-asm', '2.1 — Machine code & x86-64 assembly|||2.1 — Mã máy & assembly x86-64',
  'Từ C sang mã máy; assembly là gì; thanh ghi (registers) x86-64; lệnh mov/add/lea; toán hạng (thanh ghi, tức thời, bộ nhớ); công cụ đọc assembly.',
  [[
    `<span class="eyebrow">ICS102 · Chapter 2 · Lesson 2.1</span>
<h2>Machine code &amp; assembly</h2>
<h3>What assembly is</h3>
<p>The CPU executes <strong>machine code</strong> — raw bytes. <strong>Assembly</strong> is a human-readable text form of those bytes, one line per instruction. The compiler translates your C into assembly; the assembler turns it into machine code.</p>
<h3>Registers</h3>
<p>Registers are a few dozen tiny, ultra-fast storage slots <em>inside</em> the CPU. On x86-64 the 64-bit general registers include <code>%rax, %rbx, %rcx, %rdx, %rsi, %rdi, %rsp</code>. Instructions mostly operate on registers.</p>
<h3>A few instructions</h3>
<ul>
<li><code>mov</code> — copy a value (register, memory, or immediate constant).</li>
<li><code>add</code> / <code>sub</code> — arithmetic.</li>
<li><code>lea</code> — compute an address (also handy for fast arithmetic).</li>
</ul>
<pre><code>// C:  int add(int a, int b) { return a + b; }
// x86-64 (args arrive in %edi, %esi):
add:
    lea   (%rdi,%rsi), %eax   // eax = a + b
    ret                       // return value is in %eax
</code></pre>
<div class="callout"><span class="badge">Try it</span> Paste any C into <strong>Compiler Explorer (godbolt.org)</strong> to watch the exact assembly appear beside it — the fastest way to build intuition.</div>`,
    `<span class="eyebrow">ICS102 · Chương 2 · Bài 2.1</span>
<h2>Mã máy &amp; assembly</h2>
<h3>Assembly là gì</h3>
<p>CPU thực thi <strong>mã máy</strong> — các byte thô. <strong>Assembly</strong> là dạng văn bản người đọc được của các byte đó, mỗi dòng một lệnh. Trình biên dịch dịch C của bạn ra assembly; trình hợp dịch biến nó thành mã máy.</p>
<h3>Thanh ghi (registers)</h3>
<p>Thanh ghi là vài chục ô lưu trữ nhỏ, cực nhanh <em>bên trong</em> CPU. Trên x86-64, các thanh ghi tổng quát 64-bit gồm <code>%rax, %rbx, %rcx, %rdx, %rsi, %rdi, %rsp</code>. Lệnh chủ yếu thao tác trên thanh ghi.</p>
<h3>Vài lệnh</h3>
<ul>
<li><code>mov</code> — sao chép một giá trị (thanh ghi, bộ nhớ, hoặc hằng tức thời).</li>
<li><code>add</code> / <code>sub</code> — số học.</li>
<li><code>lea</code> — tính một địa chỉ (cũng tiện để làm số học nhanh).</li>
</ul>
<pre><code>// C:  int add(int a, int b) { return a + b; }
// x86-64 (tham số đến trong %edi, %esi):
add:
    lea   (%rdi,%rsi), %eax   // eax = a + b
    ret                       // giá trị trả về nằm trong %eax
</code></pre>
<div class="callout"><span class="badge">Thử ngay</span> Dán bất kỳ đoạn C nào vào <strong>Compiler Explorer (godbolt.org)</strong> để xem đúng assembly hiện bên cạnh — cách nhanh nhất để xây trực giác.</div>`,
  ]]);

const c2q = quiz('ics102-quiz-2', 'Quiz 2 — Machine code & assembly|||Quiz 2 — Mã máy & assembly', [
  { id: 'q1', question: 'Assembly là gì so với mã máy?', options: ['Một ngôn ngữ bậc cao như C', 'Dạng văn bản người đọc được của mã máy', 'Một hệ điều hành', 'Định dạng file ảnh'], correctIndex: 1, explanation: 'Assembly ánh xạ gần 1-1 với mã máy, mỗi dòng một lệnh.' },
  { id: 'q2', question: 'Thanh ghi (register) nằm ở đâu và có đặc điểm gì?', options: ['Trên ổ đĩa, dung lượng lớn', 'Bên trong CPU, rất ít và cực nhanh', 'Trong RAM, tốc độ trung bình', 'Trên card mạng'], correctIndex: 1, explanation: 'Register là ô lưu trữ nhỏ, cực nhanh ngay trong CPU.' },
  { id: 'q3', question: 'Lệnh mov trong x86-64 làm gì?', options: ['Di chuyển con trỏ chuột', 'Sao chép một giá trị giữa thanh ghi/bộ nhớ/hằng', 'Nhân hai số', 'Kết thúc chương trình'], correctIndex: 1, explanation: 'mov sao chép dữ liệu giữa các toán hạng.' },
]);

const c3 = doc('ics102-3-1-control-procedures', '3.1 — Control & procedures at machine level|||3.1 — Điều khiển & thủ tục ở mức máy',
  'Cờ trạng thái & rẽ nhánh có điều kiện (cmp/jne); vòng lặp bằng nhảy; gọi hàm (call/ret); ngăn xếp (stack) & khung stack (stack frame); truyền tham số.',
  [[
    `<span class="eyebrow">ICS102 · Chapter 3 · Lesson 3.1</span>
<h2>Control &amp; procedures</h2>
<h3>Branches &amp; loops</h3>
<p>There is no <code>if</code> or <code>while</code> in hardware. Instead, <code>cmp</code> sets <strong>condition flags</strong>, and a conditional jump (<code>je, jne, jl, jg</code>) either falls through or jumps. A loop is just a jump <em>backward</em>.</p>
<h3>Calling a function</h3>
<ul>
<li><code>call</code> — push the return address, jump to the function.</li>
<li><code>ret</code> — pop that address, jump back.</li>
</ul>
<h3>The stack</h3>
<p>Each call gets a <strong>stack frame</strong>: space for its local variables and saved registers, pointed to by <code>%rsp</code>. The stack grows <em>downward</em>. When the function returns, its frame is discarded — which is why a pointer to a local becomes invalid after return.</p>
<pre><code>// sum 1..n  (recursion builds one stack frame per call)
sum:
    cmp   $0, %edi          // n == 0 ?
    je    .base             // if so, jump to base case
    ...                     // else: push frame, call sum(n-1)
.base:
    ret
</code></pre>
<div class="callout"><span class="badge">Why it matters</span> A runaway recursion overflows the stack (<em>stack overflow</em>); a buffer written past its frame is the classic security bug. The stack is where control and data meet.</div>`,
    `<span class="eyebrow">ICS102 · Chương 3 · Bài 3.1</span>
<h2>Điều khiển &amp; thủ tục</h2>
<h3>Rẽ nhánh &amp; vòng lặp</h3>
<p>Phần cứng không có <code>if</code> hay <code>while</code>. Thay vào đó, <code>cmp</code> đặt <strong>cờ trạng thái</strong>, và một lệnh nhảy có điều kiện (<code>je, jne, jl, jg</code>) hoặc chạy tiếp hoặc nhảy đi. Vòng lặp chỉ là một cú nhảy <em>lùi</em>.</p>
<h3>Gọi một hàm</h3>
<ul>
<li><code>call</code> — đẩy địa chỉ trở về, nhảy tới hàm.</li>
<li><code>ret</code> — lấy địa chỉ đó ra, nhảy ngược về.</li>
</ul>
<h3>Ngăn xếp (stack)</h3>
<p>Mỗi lần gọi có một <strong>khung stack (stack frame)</strong>: chỗ cho biến cục bộ và thanh ghi được lưu, trỏ bởi <code>%rsp</code>. Ngăn xếp lớn <em>xuống dưới</em>. Khi hàm trả về, khung của nó bị bỏ — vì thế con trỏ tới biến cục bộ mất hiệu lực sau khi trả về.</p>
<pre><code>// tổng 1..n  (đệ quy dựng một khung stack mỗi lần gọi)
sum:
    cmp   $0, %edi          // n == 0 ?
    je    .base             // nếu vậy, nhảy tới ca cơ sở
    ...                     // ngược lại: đẩy khung, gọi sum(n-1)
.base:
    ret
</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Đệ quy vô hạn làm tràn ngăn xếp (<em>stack overflow</em>); ghi vượt quá vùng đệm trong khung là lỗi bảo mật kinh điển. Ngăn xếp là nơi điều khiển và dữ liệu gặp nhau.</div>`,
  ]]);

const c3q = quiz('ics102-quiz-3', 'Quiz 3 — Control & procedures|||Quiz 3 — Điều khiển & thủ tục', [
  { id: 'q1', question: 'Ở mức máy, một vòng lặp while được thực hiện bằng?', options: ['Một lệnh loop đặc biệt duy nhất', 'So sánh (cmp) rồi nhảy lùi có điều kiện', 'Gọi hệ điều hành', 'Ghi ra đĩa'], correctIndex: 1, explanation: 'cmp đặt cờ; lệnh nhảy có điều kiện nhảy lùi để lặp.' },
  { id: 'q2', question: 'Lệnh call làm gì khi gọi hàm?', options: ['Xoá ngăn xếp', 'Đẩy địa chỉ trở về rồi nhảy tới hàm', 'Chỉ nhảy, không lưu gì', 'Cấp phát bộ nhớ heap'], correctIndex: 1, explanation: 'call lưu địa chỉ trở về trên stack rồi nhảy; ret nhảy về.' },
  { id: 'q3', question: 'Vì sao trả về con trỏ tới biến cục bộ là sai?', options: ['Con trỏ luôn null', 'Khung stack của hàm bị bỏ khi trả về', 'C không cho phép con trỏ', 'Biến cục bộ nằm trên heap'], correctIndex: 1, explanation: 'Biến cục bộ sống trong stack frame; frame biến mất sau ret.' },
]);

const c4 = doc('ics102-4-1-processor', '4.1 — Processor architecture (overview)|||4.1 — Kiến trúc bộ xử lý (tổng quan)',
  'Chu trình fetch-decode-execute; datapath & control; pipeline (chia lệnh thành giai đoạn); hazard & dừng (stall); dự đoán rẽ nhánh (branch prediction).',
  [[
    `<span class="eyebrow">ICS102 · Chapter 4 · Lesson 4.1</span>
<h2>Processor architecture</h2>
<h3>The basic cycle</h3>
<p>A CPU repeats <strong>fetch → decode → execute</strong>: fetch the next instruction from memory, work out what it means, then do it. The <strong>datapath</strong> is the hardware that carries data through; the <strong>control</strong> unit steers it.</p>
<h3>Pipelining</h3>
<p>Doing one instruction fully before starting the next is slow. A <strong>pipeline</strong> splits each instruction into stages (fetch, decode, execute, memory, write-back) and overlaps them — like an assembly line, several instructions are in flight at once.</p>
<pre><code>Cycle:   1    2    3    4    5
Instr A  IF   ID   EX   MEM  WB
Instr B       IF   ID   EX   MEM
Instr C            IF   ID   EX     &lt;- overlapping stages
</code></pre>
<h3>Hazards &amp; branch prediction</h3>
<p>Pipelines stumble on <strong>hazards</strong>: an instruction needing a result not ready yet (stall), or a branch whose direction is unknown. The CPU <strong>predicts</strong> which way a branch goes and runs ahead; a wrong guess is thrown away (a misprediction penalty). This is why predictable branches make code faster.</p>
<div class="callout"><span class="badge">Programmer's takeaway</span> You do not write the pipeline, but you feel it: tight, predictable loops and few surprising branches let the CPU stay full.</div>`,
    `<span class="eyebrow">ICS102 · Chương 4 · Bài 4.1</span>
<h2>Kiến trúc bộ xử lý</h2>
<h3>Chu trình cơ bản</h3>
<p>CPU lặp lại <strong>nạp → giải mã → thực thi</strong> (fetch → decode → execute): nạp lệnh kế từ bộ nhớ, hiểu nó nghĩa gì, rồi làm. <strong>Datapath</strong> là phần cứng dẫn dữ liệu đi qua; khối <strong>điều khiển</strong> lái nó.</p>
<h3>Pipeline (đường ống)</h3>
<p>Làm xong hẳn một lệnh rồi mới bắt đầu lệnh kế thì chậm. <strong>Pipeline</strong> chia mỗi lệnh thành các giai đoạn (nạp, giải mã, thực thi, bộ nhớ, ghi lại) và cho chúng chồng lấn — như dây chuyền lắp ráp, nhiều lệnh cùng chạy một lúc.</p>
<pre><code>Nhịp:    1    2    3    4    5
Lệnh A   IF   ID   EX   MEM  WB
Lệnh B        IF   ID   EX   MEM
Lệnh C             IF   ID   EX     &lt;- các giai đoạn chồng lấn
</code></pre>
<h3>Hazard &amp; dự đoán rẽ nhánh</h3>
<p>Pipeline vấp phải <strong>hazard</strong>: một lệnh cần kết quả chưa sẵn (phải dừng — stall), hoặc một nhánh chưa biết đi hướng nào. CPU <strong>dự đoán</strong> nhánh sẽ đi đâu và chạy trước; đoán sai thì phần đã chạy bị bỏ (phạt dự đoán sai). Vì thế nhánh dễ đoán làm mã nhanh hơn.</p>
<div class="callout"><span class="badge">Điều lập trình viên rút ra</span> Bạn không viết pipeline, nhưng bạn cảm nhận được nó: vòng lặp gọn, dễ đoán và ít nhánh bất ngờ giúp CPU luôn đầy việc.</div>`,
  ]]);

const c4q = quiz('ics102-quiz-4', 'Quiz 4 — Processor architecture|||Quiz 4 — Kiến trúc bộ xử lý', [
  { id: 'q1', question: 'Chu trình cơ bản mà CPU lặp lại là?', options: ['Đọc-ghi-xoá', 'Nạp-giải mã-thực thi (fetch-decode-execute)', 'Nén-giải nén', 'Mã hoá-giải mã mạng'], correctIndex: 1, explanation: 'CPU liên tục fetch → decode → execute từng lệnh.' },
  { id: 'q2', question: 'Pipeline giúp CPU nhanh hơn bằng cách nào?', options: ['Chạy ở điện áp cao hơn', 'Chồng lấn các giai đoạn của nhiều lệnh', 'Xoá bộ nhớ cache', 'Bỏ qua lệnh khó'], correctIndex: 1, explanation: 'Như dây chuyền: nhiều lệnh ở các giai đoạn khác nhau cùng lúc.' },
  { id: 'q3', question: 'Dự đoán rẽ nhánh (branch prediction) sai gây ra?', options: ['Kết quả tính toán sai', 'Phạt: phần đã chạy trước bị bỏ đi', 'Mất dữ liệu trên đĩa', 'Tràn số nguyên'], correctIndex: 1, explanation: 'Đoán sai thì các lệnh đã nạp/chạy trước bị huỷ, tốn nhịp.' },
]);

const c5 = doc('ics102-5-1-memory-cache', '5.1 — The memory hierarchy & caches|||5.1 — Phân cấp bộ nhớ & cache',
  'Phân cấp bộ nhớ (register → cache → RAM → đĩa); tính cục bộ (locality) không gian & thời gian; cache hoạt động thế nào (hit/miss); viết mã thân thiện cache.',
  [[
    `<span class="eyebrow">ICS102 · Chapter 5 · Lesson 5.1</span>
<h2>The memory hierarchy &amp; caches</h2>
<h3>A pyramid of storage</h3>
<p>Memory trades speed for size. From fastest/smallest to slowest/largest: <strong>registers → L1/L2/L3 cache → main memory (RAM) → disk</strong>. Each level caches the one below it.</p>
<h3>Locality — why caches work</h3>
<ul>
<li><strong>Temporal locality</strong> — if you use data now, you'll likely use it again soon.</li>
<li><strong>Spatial locality</strong> — if you use one address, you'll likely use nearby ones (so caches load a whole <em>cache line</em>).</li>
</ul>
<p>A <strong>hit</strong> is found in cache (fast); a <strong>miss</strong> falls through to slower memory. Good code maximizes hits.</p>
<pre><code>// Row-major C array: rows are contiguous in memory.
for (i...) for (j...) sum += A[i][j];  // FAST: spatial locality
for (j...) for (i...) sum += A[i][j];  // SLOW: jumps a row each step
</code></pre>
<div class="callout"><span class="badge">Same code, big gap</span> The two loops compute the same sum, but the cache-friendly order can run several times faster on a large array — the memory hierarchy, not the CPU, is often the bottleneck.</div>`,
    `<span class="eyebrow">ICS102 · Chương 5 · Bài 5.1</span>
<h2>Phân cấp bộ nhớ &amp; cache</h2>
<h3>Kim tự tháp lưu trữ</h3>
<p>Bộ nhớ đánh đổi tốc độ lấy dung lượng. Từ nhanh/nhỏ nhất tới chậm/lớn nhất: <strong>thanh ghi → cache L1/L2/L3 → bộ nhớ chính (RAM) → đĩa</strong>. Mỗi mức làm cache cho mức dưới nó.</p>
<h3>Tính cục bộ — vì sao cache hiệu quả</h3>
<ul>
<li><strong>Cục bộ thời gian</strong> — dùng dữ liệu bây giờ thì sắp tới nhiều khả năng dùng lại.</li>
<li><strong>Cục bộ không gian</strong> — dùng một địa chỉ thì nhiều khả năng dùng các địa chỉ lân cận (nên cache nạp cả một <em>dòng cache</em>).</li>
</ul>
<p>Một <strong>hit</strong> là tìm thấy trong cache (nhanh); một <strong>miss</strong> phải xuống bộ nhớ chậm hơn. Mã tốt tối đa hoá số hit.</p>
<pre><code>// Mảng C lưu theo hàng: các hàng nằm liền nhau trong bộ nhớ.
for (i...) for (j...) sum += A[i][j];  // NHANH: cục bộ không gian
for (j...) for (i...) sum += A[i][j];  // CHẬM: mỗi bước nhảy một hàng
</code></pre>
<div class="callout"><span class="badge">Cùng mã, khác xa</span> Hai vòng lặp tính cùng một tổng, nhưng thứ tự thân thiện cache có thể chạy nhanh gấp nhiều lần trên mảng lớn — phân cấp bộ nhớ, chứ không phải CPU, thường mới là nút thắt.</div>`,
  ]]);

const c5q = quiz('ics102-quiz-5', 'Quiz 5 — Memory hierarchy & caches|||Quiz 5 — Phân cấp bộ nhớ & cache', [
  { id: 'q1', question: 'Thứ tự đúng từ NHANH tới CHẬM của phân cấp bộ nhớ?', options: ['Đĩa → RAM → cache → thanh ghi', 'Thanh ghi → cache → RAM → đĩa', 'RAM → thanh ghi → đĩa → cache', 'Cache → đĩa → RAM → thanh ghi'], correctIndex: 1, explanation: 'Nhanh/nhỏ: register → cache → RAM → đĩa (chậm/lớn).' },
  { id: 'q2', question: 'Cục bộ không gian (spatial locality) nghĩa là?', options: ['Dữ liệu dùng gần đây sẽ được dùng lại', 'Các địa chỉ lân cận có khả năng được dùng cùng nhau', 'Bộ nhớ chỉ dùng một lần', 'Cache không bao giờ miss'], correctIndex: 1, explanation: 'Dùng một địa chỉ thì dễ dùng địa chỉ kề — nên cache nạp cả dòng.' },
  { id: 'q3', question: 'Vì sao duyệt mảng 2D theo hàng (row-major) nhanh hơn theo cột trong C?', options: ['CPU thích chỉ số i', 'Hàng nằm liền nhau nên tận dụng cục bộ không gian/cache', 'Trình biên dịch bỏ vòng cột', 'Cột dùng số thực'], correctIndex: 1, explanation: 'C lưu theo hàng; duyệt theo hàng cho nhiều cache hit hơn.' },
]);

const c6 = doc('ics102-6-1-linking', '6.1 — Linking & loading|||6.1 — Liên kết & nạp chương trình',
  'Bốn bước: preprocess → compile → assemble → link; file đối tượng (.o); ký hiệu (symbol) & phân giải; liên kết tĩnh vs động (.a vs .so); nạp chương trình vào bộ nhớ.',
  [[
    `<span class="eyebrow">ICS102 · Chapter 6 · Lesson 6.1</span>
<h2>Linking &amp; loading</h2>
<h3>From source to a running program</h3>
<pre><code>hello.c --preprocess--&gt; hello.i --compile--&gt; hello.s
        --assemble--&gt; hello.o  --link--&gt;  ./hello  (executable)
</code></pre>
<p>The compiler turns each source file into an <strong>object file</strong> (<code>.o</code>) full of machine code plus a table of <strong>symbols</strong> (function/variable names).</p>
<h3>What the linker does</h3>
<p>The <strong>linker</strong> combines object files and libraries and does <strong>symbol resolution</strong>: it connects every use of <code>printf</code> to its definition. A missing definition is the classic <em>undefined reference</em> error; two definitions is a <em>duplicate symbol</em> error.</p>
<h3>Static vs dynamic</h3>
<ul>
<li><strong>Static (<code>.a</code>)</strong> — library code is copied <em>into</em> the executable at link time. Bigger file, no runtime dependency.</li>
<li><strong>Dynamic (<code>.so</code> / <code>.dll</code>)</strong> — the library is loaded at run time and shared between programs. Smaller files, updatable, but must be present when you run.</li>
</ul>
<div class="callout"><span class="badge">Loading</span> The <strong>loader</strong> (part of the OS) maps the executable's code and data into memory, wires up dynamic libraries, and jumps to <code>main</code>.</div>`,
    `<span class="eyebrow">ICS102 · Chương 6 · Bài 6.1</span>
<h2>Liên kết &amp; nạp</h2>
<h3>Từ mã nguồn tới chương trình chạy được</h3>
<pre><code>hello.c --tiền xử lý--&gt; hello.i --biên dịch--&gt; hello.s
        --hợp dịch--&gt; hello.o  --liên kết--&gt;  ./hello  (thực thi)
</code></pre>
<p>Trình biên dịch biến mỗi file nguồn thành một <strong>file đối tượng</strong> (<code>.o</code>) đầy mã máy cộng một bảng <strong>ký hiệu (symbol)</strong> (tên hàm/biến).</p>
<h3>Trình liên kết làm gì</h3>
<p><strong>Trình liên kết (linker)</strong> gộp các file đối tượng và thư viện rồi <strong>phân giải ký hiệu</strong>: nó nối mỗi chỗ dùng <code>printf</code> tới định nghĩa của nó. Thiếu định nghĩa là lỗi kinh điển <em>undefined reference</em>; hai định nghĩa là lỗi <em>duplicate symbol</em>.</p>
<h3>Tĩnh vs động</h3>
<ul>
<li><strong>Tĩnh (<code>.a</code>)</strong> — mã thư viện được chép <em>vào</em> file thực thi lúc liên kết. File to hơn, không phụ thuộc lúc chạy.</li>
<li><strong>Động (<code>.so</code> / <code>.dll</code>)</strong> — thư viện được nạp lúc chạy và dùng chung giữa các chương trình. File nhỏ hơn, cập nhật được, nhưng phải có mặt khi chạy.</li>
</ul>
<div class="callout"><span class="badge">Nạp (loading)</span> <strong>Trình nạp (loader)</strong> (một phần của HĐH) ánh xạ mã và dữ liệu của file thực thi vào bộ nhớ, đấu nối thư viện động, rồi nhảy tới <code>main</code>.</div>`,
  ]]);

const c6q = quiz('ics102-quiz-6', 'Quiz 6 — Linking & loading|||Quiz 6 — Liên kết & nạp', [
  { id: 'q1', question: 'Thứ tự bốn bước từ mã nguồn C tới file thực thi?', options: ['Link → compile → assemble → preprocess', 'Preprocess → compile → assemble → link', 'Compile → link → preprocess → assemble', 'Assemble → link → compile → preprocess'], correctIndex: 1, explanation: 'Tiền xử lý → biên dịch → hợp dịch → liên kết.' },
  { id: 'q2', question: 'Lỗi "undefined reference" khi liên kết nghĩa là?', options: ['Biến chưa khởi tạo', 'Linker không tìm thấy định nghĩa cho một ký hiệu', 'Tràn ngăn xếp', 'Cache miss'], correctIndex: 1, explanation: 'Có chỗ dùng một symbol nhưng không có định nghĩa để nối vào.' },
  { id: 'q3', question: 'Khác biệt chính giữa liên kết tĩnh (.a) và động (.so)?', options: ['Tĩnh chỉ cho C++, động cho C', 'Tĩnh chép mã vào file thực thi; động nạp & dùng chung lúc chạy', 'Động luôn nhanh hơn tĩnh', 'Không có khác biệt'], correctIndex: 1, explanation: 'Tĩnh nhúng vào lúc link; động nạp lúc chạy, chia sẻ giữa chương trình.' },
]);

const c7 = doc('ics102-7-1-exceptions-processes', '7.1 — Exceptions & processes|||7.1 — Ngoại lệ & tiến trình',
  'Ngoại lệ (interrupt/trap/fault); tiến trình (process) như ảo giác; ngữ cảnh (context) & chuyển ngữ cảnh; đa nhiệm; bộ nhớ ảo (virtual memory) tổng quan.',
  [[
    `<span class="eyebrow">ICS102 · Chapter 7 · Lesson 7.1</span>
<h2>Exceptions &amp; processes</h2>
<h3>Exceptions — the CPU changes hands</h3>
<p>An <strong>exception</strong> is an abrupt switch to the operating system, triggered by an event:</p>
<ul>
<li><strong>Interrupt</strong> — from hardware (a key press, a timer).</li>
<li><strong>Trap</strong> — intentional, from a program (a <em>system call</em> asking the OS for a service).</li>
<li><strong>Fault</strong> — an error that may be fixable (a page fault) or fatal (segfault).</li>
</ul>
<h3>Processes</h3>
<p>A <strong>process</strong> is the OS's abstraction of a running program. It gives each program two illusions: a <strong>private CPU</strong> (via time-slicing) and a <strong>private memory</strong> (via virtual memory).</p>
<h3>Context switching</h3>
<p>To run many processes on one CPU, the OS saves one process's <strong>context</strong> (registers, program counter, stack pointer) and restores another's. Do this fast enough and every program seems to run at once.</p>
<pre><code>Process A running ... --timer interrupt--&gt; OS saves A's context
   --&gt; OS restores B's context --&gt; Process B running ...
</code></pre>
<div class="callout"><span class="badge">Virtual memory</span> Each process sees a clean, private address space; the OS + hardware (MMU) map those <em>virtual</em> addresses to real physical RAM — isolating processes and enabling more memory than physically exists.</div>`,
    `<span class="eyebrow">ICS102 · Chương 7 · Bài 7.1</span>
<h2>Ngoại lệ &amp; tiến trình</h2>
<h3>Ngoại lệ — CPU đổi tay</h3>
<p>Một <strong>ngoại lệ (exception)</strong> là cú chuyển đột ngột sang hệ điều hành, do một sự kiện kích hoạt:</p>
<ul>
<li><strong>Ngắt (interrupt)</strong> — từ phần cứng (một phím bấm, một bộ định thời).</li>
<li><strong>Trap</strong> — cố ý, từ chương trình (một <em>lời gọi hệ thống</em> xin HĐH một dịch vụ).</li>
<li><strong>Fault (lỗi)</strong> — một lỗi có thể sửa được (page fault) hoặc chí mạng (segfault).</li>
</ul>
<h3>Tiến trình (process)</h3>
<p>Một <strong>tiến trình</strong> là trừu tượng của HĐH cho một chương trình đang chạy. Nó cho mỗi chương trình hai ảo giác: một <strong>CPU riêng</strong> (nhờ chia lát thời gian) và một <strong>bộ nhớ riêng</strong> (nhờ bộ nhớ ảo).</p>
<h3>Chuyển ngữ cảnh</h3>
<p>Để chạy nhiều tiến trình trên một CPU, HĐH lưu <strong>ngữ cảnh (context)</strong> của tiến trình này (thanh ghi, con trỏ lệnh, con trỏ ngăn xếp) rồi khôi phục của tiến trình khác. Làm đủ nhanh thì mọi chương trình như chạy cùng lúc.</p>
<pre><code>Tiến trình A chạy ... --ngắt định thời--&gt; HĐH lưu ngữ cảnh A
   --&gt; HĐH khôi phục ngữ cảnh B --&gt; Tiến trình B chạy ...
</code></pre>
<div class="callout"><span class="badge">Bộ nhớ ảo</span> Mỗi tiến trình thấy một không gian địa chỉ sạch, riêng; HĐH + phần cứng (MMU) ánh xạ các địa chỉ <em>ảo</em> đó tới RAM vật lý thật — cô lập các tiến trình và cho phép dùng nhiều bộ nhớ hơn mức thực có.</div>`,
  ]]);

const c7q = quiz('ics102-quiz-7', 'Quiz 7 — Exceptions & processes|||Quiz 7 — Ngoại lệ & tiến trình', [
  { id: 'q1', question: 'Một lời gọi hệ thống (system call) thuộc loại ngoại lệ nào?', options: ['Interrupt (ngắt phần cứng)', 'Trap (cố ý từ chương trình)', 'Fault chí mạng', 'Không phải ngoại lệ'], correctIndex: 1, explanation: 'System call là trap: chương trình chủ động xin HĐH một dịch vụ.' },
  { id: 'q2', question: 'Chuyển ngữ cảnh (context switch) lưu và khôi phục cái gì?', options: ['Toàn bộ ổ đĩa', 'Thanh ghi, con trỏ lệnh, con trỏ ngăn xếp của tiến trình', 'Chỉ tên tiến trình', 'Nội dung màn hình'], correctIndex: 1, explanation: 'Lưu context tiến trình cũ, nạp context tiến trình mới.' },
  { id: 'q3', question: 'Bộ nhớ ảo (virtual memory) cho mỗi tiến trình điều gì?', options: ['Một CPU vật lý riêng', 'Một không gian địa chỉ riêng, được cô lập', 'Truy cập trực tiếp RAM của tiến trình khác', 'Tốc độ đĩa nhanh hơn'], correctIndex: 1, explanation: 'Mỗi tiến trình có không gian địa chỉ ảo riêng; MMU ánh xạ xuống RAM.' },
]);

const c8 = doc('ics102-8-1-io-networking', '8.1 — System-level I/O & networking|||8.1 — Vào/ra & mạng ở mức hệ thống',
  'I/O mức hệ thống; file descriptor & lời gọi open/read/write/close; mọi thứ là file trên Unix; socket là gì; mô hình client-server cơ bản.',
  [[
    `<span class="eyebrow">ICS102 · Chapter 8 · Lesson 8.1</span>
<h2>System-level I/O &amp; networking</h2>
<h3>Everything is a file</h3>
<p>On Unix, files, the terminal, pipes and network connections are all read and written through the same small set of <strong>system calls</strong>: <code>open, read, write, close</code>. Each open resource is named by a small integer, a <strong>file descriptor</strong> (0 = stdin, 1 = stdout, 2 = stderr).</p>
<pre><code>int fd = open("data.txt", O_RDONLY);   // fd is a file descriptor
char buf[256];
ssize_t n = read(fd, buf, sizeof buf); // n bytes actually read
close(fd);
</code></pre>
<h3>Sockets — I/O over the network</h3>
<p>A <strong>socket</strong> is a file descriptor for a network connection, so once connected you <code>read</code>/<code>write</code> it just like a file. That uniform interface is what lets the same code talk to a disk or across the world.</p>
<h3>Client–server</h3>
<ul>
<li><strong>Server</strong> — <code>socket → bind → listen → accept</code>, then serves whoever connects.</li>
<li><strong>Client</strong> — <code>socket → connect</code>, then exchanges data.</li>
</ul>
<div class="callout"><span class="badge">The whole web</span> A browser fetching this page is a client opening a socket to a server, writing an HTTP request and reading the reply — the same <code>read</code>/<code>write</code> you used on a file.</div>`,
    `<span class="eyebrow">ICS102 · Chương 8 · Bài 8.1</span>
<h2>Vào/ra &amp; mạng ở mức hệ thống</h2>
<h3>Mọi thứ là file</h3>
<p>Trên Unix, file, terminal, pipe và kết nối mạng đều được đọc/ghi qua cùng một bộ nhỏ <strong>lời gọi hệ thống</strong>: <code>open, read, write, close</code>. Mỗi tài nguyên đang mở được đặt tên bằng một số nguyên nhỏ, gọi là <strong>file descriptor</strong> (0 = stdin, 1 = stdout, 2 = stderr).</p>
<pre><code>int fd = open("data.txt", O_RDONLY);   // fd là một file descriptor
char buf[256];
ssize_t n = read(fd, buf, sizeof buf); // n byte thực sự đọc được
close(fd);
</code></pre>
<h3>Socket — I/O qua mạng</h3>
<p>Một <strong>socket</strong> là một file descriptor cho một kết nối mạng, nên khi đã kết nối bạn <code>read</code>/<code>write</code> nó y như một file. Giao diện đồng nhất đó cho phép cùng một đoạn mã nói chuyện với đĩa hay với nửa vòng trái đất.</p>
<h3>Client–server</h3>
<ul>
<li><strong>Máy chủ (server)</strong> — <code>socket → bind → listen → accept</code>, rồi phục vụ ai kết nối tới.</li>
<li><strong>Máy khách (client)</strong> — <code>socket → connect</code>, rồi trao đổi dữ liệu.</li>
</ul>
<div class="callout"><span class="badge">Cả web</span> Một trình duyệt tải trang này là một client mở socket tới server, ghi một yêu cầu HTTP và đọc phản hồi — chính là <code>read</code>/<code>write</code> bạn dùng trên file.</div>`,
  ]]);

const c8q = quiz('ics102-quiz-8', 'Quiz 8 — System I/O & networking|||Quiz 8 — Vào/ra & mạng', [
  { id: 'q1', question: 'File descriptor là gì?', options: ['Tên đầy đủ của file trên đĩa', 'Một số nguyên nhỏ định danh tài nguyên I/O đang mở', 'Kích thước của file', 'Địa chỉ RAM của file'], correctIndex: 1, explanation: 'Số nguyên nhỏ (0/1/2 = stdin/stdout/stderr, ...) trỏ tới tài nguyên mở.' },
  { id: 'q2', question: 'Trên Unix, socket mạng được đọc/ghi bằng?', options: ['Một API hoàn toàn riêng, khác file', 'Cùng read/write như file (vì là file descriptor)', 'Chỉ ghi được, không đọc được', 'Phải qua đĩa trước'], correctIndex: 1, explanation: 'Socket là file descriptor nên dùng read/write đồng nhất như file.' },
  { id: 'q3', question: 'Chuỗi lời gọi điển hình phía máy chủ (server) là?', options: ['socket → connect', 'socket → bind → listen → accept', 'open → read → close', 'listen → connect → bind'], correctIndex: 1, explanation: 'Server: socket → bind → listen → accept; client: socket → connect.' },
]);

export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'ICS102',
    slug: 'ics102-introduction-to-computer-systems',
    title: 'Introduction to Computer Systems',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/ICS102.webp',
    shortDescription: 'How computers really run your code (CSAPP): bits, integers & IEEE 754 floats, x86-64 assembly, control & procedures, CPU pipeline, caches, linking, exceptions, processes & system I/O. Bilingual, with C/asm examples & quizzes.|||Máy tính thật ra chạy mã của bạn thế nào (CSAPP): bit, số nguyên & số thực IEEE 754, assembly x86-64, điều khiển & thủ tục, pipeline, cache, liên kết, ngoại lệ, tiến trình & I/O. Song ngữ, ví dụ C/asm & quiz.',
    description: 'Môn <strong>ICS102 — Introduction to Computer Systems</strong> (Nhập môn Hệ thống máy tính, kỳ 1, ngành Khoa học Máy tính) nhìn <strong>xuống dưới</strong> chương trình theo góc nhìn <strong>lập trình viên</strong> (CSAPP). Từ <strong>biểu diễn thông tin</strong> (bit, số nguyên bù 2, số thực IEEE 754, endianness) → <strong>mã máy &amp; assembly x86-64</strong> → <strong>điều khiển &amp; thủ tục</strong> (rẽ nhánh, ngăn xếp) → <strong>kiến trúc CPU</strong> (pipeline) → <strong>phân cấp bộ nhớ &amp; cache</strong> → <strong>liên kết &amp; nạp</strong> → <strong>ngoại lệ &amp; tiến trình</strong> (bộ nhớ ảo) → <strong>vào/ra &amp; mạng mức hệ thống</strong>. Bám giáo trình FLM, song ngữ, có ví dụ C/assembly, quiz mỗi chương.',
    whatYouLearn: 'Bit/byte & hex; số nguyên unsigned & bù 2, tràn số; số thực IEEE 754, endianness; mã máy & assembly x86-64, thanh ghi; rẽ nhánh, vòng lặp, gọi hàm & stack frame; datapath, pipeline & dự đoán rẽ nhánh; phân cấp bộ nhớ, cục bộ & cache, mã thân thiện cache; preprocess→compile→assemble→link, liên kết tĩnh vs động; ngoại lệ (interrupt/trap/fault), tiến trình, context switch, bộ nhớ ảo; system-level I/O, file descriptor, socket & client-server.',
    requirements: 'Biết lập trình C/C++ cơ bản (biến, hàm, con trỏ) là lợi thế lớn. Không cần nền phần cứng. Nên dùng Compiler Explorer (godbolt.org) để đọc assembly khi học.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách chuẩn (CSAPP, Patterson & Hennessy), CMU 15-213, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Hệ thống máy tính là gì; góc nhìn lập trình viên; từ C tới mã máy.', lessons: [intro] },
    { title: 'Chương 1 — Biểu diễn thông tin|||Chapter 1 — Representing information', description: 'Bit/byte, số nguyên bù 2, tràn số, IEEE 754, endianness.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Mã máy & assembly|||Chapter 2 — Machine code & assembly', description: 'C → mã máy, assembly x86-64, thanh ghi, lệnh cơ bản.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Điều khiển & thủ tục|||Chapter 3 — Control & procedures', description: 'Rẽ nhánh, vòng lặp, call/ret, stack frame.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Kiến trúc bộ xử lý|||Chapter 4 — Processor architecture', description: 'Fetch-decode-execute, datapath, pipeline, branch prediction.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Phân cấp bộ nhớ & cache|||Chapter 5 — Memory hierarchy & caches', description: 'Phân cấp bộ nhớ, cục bộ, cache, mã thân thiện cache.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Liên kết & nạp|||Chapter 6 — Linking & loading', description: 'Compile-assemble-link-load, symbol, tĩnh vs động.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Ngoại lệ & tiến trình|||Chapter 7 — Exceptions & processes', description: 'Interrupt/trap/fault, process, context switch, bộ nhớ ảo.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Vào/ra & mạng|||Chapter 8 — I/O & networking', description: 'System I/O, file descriptor, socket, client-server.', lessons: [c8, c8q] },
  ],
};
