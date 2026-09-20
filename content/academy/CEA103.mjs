/**
 * CEA103 — Computer Organization and Architecture (Tổ chức & Kiến trúc máy tính).
 * Ngành Khoa học Máy tính FPTU, Kỳ 1. Khung chất lượng, song ngữ VI+EN.
 * Sách chuẩn: Patterson & Hennessy "Computer Organization and Design";
 * Tanenbaum "Structured Computer Organization"; Stallings; nand2tetris.
 * 8 chương: biểu diễn dữ liệu → logic số → ISA → số học → datapath →
 * pipeline → bộ nhớ → vào/ra. Giữ NGUYÊN slug/semester/courseCode/thumb.
 * ⚠️ KHÔNG backtick lồng/${ trong HTML; "&"→"&amp;", "<"→"&lt;".
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('cea103-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn (Patterson & Hennessy, Tanenbaum, Stallings), nand2tetris, YouTube, công cụ, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">CEA103 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Computer Organization and Architecture</strong> — data representation, digital logic, ISA, arithmetic, datapath, pipelining, memory hierarchy and I/O — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are trusted, mostly free resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for CEA103 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://www.elsevier.com/books/computer-organization-and-design-mips-edition/patterson/978-0-12-820109-1" target="_blank" rel="noopener"><em>Computer Organization and Design</em> — Patterson &amp; Hennessy</a> (the standard, MIPS edition)</li>
<li><a href="https://en.wikipedia.org/wiki/Structured_Computer_Organization" target="_blank" rel="noopener"><em>Structured Computer Organization</em> — Tanenbaum</a></li>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/computer-organization-and-architecture/P200000003518" target="_blank" rel="noopener"><em>Computer Organization and Architecture</em> — Stallings</a></li>
</ul>
<h3>🌐 Free courses &amp; documentation</h3>
<ul>
<li><a href="https://www.nand2tetris.org/" target="_blank" rel="noopener">Nand2Tetris</a> — build a computer from logic gates up</li>
<li><a href="https://en.wikipedia.org/wiki/MIPS_architecture" target="_blank" rel="noopener">MIPS architecture &amp; assembly reference</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@BenEater" target="_blank" rel="noopener">Ben Eater</a> — building an 8-bit computer on breadboards</li>
<li><a href="https://www.youtube.com/@Computerphile" target="_blank" rel="noopener">Computerphile</a> — how computers work, explained</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://courses.missouristate.edu/kenvollmar/mars/" target="_blank" rel="noopener">MARS</a> — MIPS assembler &amp; simulator</li>
<li><a href="https://github.com/logisim-evolution/logisim-evolution" target="_blank" rel="noopener">Logisim Evolution</a> — design &amp; simulate digital logic circuits</li>
<li><a href="https://godbolt.org/" target="_blank" rel="noopener">Compiler Explorer</a> — see the assembly your C code compiles to</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — number systems, two's complement, IEEE 754, logic gates &amp; Boolean algebra.</li>
<li><strong>Practice</strong> — read/write MIPS assembly in MARS and build small circuits in Logisim until output matches theory.</li>
<li><strong>Go deeper</strong> — datapath &amp; control, pipelining and hazards, cache &amp; memory hierarchy.</li>
<li><strong>Job-ready</strong> — reason about performance (Amdahl's law), cache behaviour, and what your C/assembly actually costs.</li>
</ol></div>`,
    `<span class="eyebrow">CEA103 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Tổ chức &amp; Kiến trúc máy tính</strong> — biểu diễn dữ liệu, logic số, ISA, số học, datapath, pipeline, phân cấp bộ nhớ và vào/ra — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn uy tín, phần lớn miễn phí.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của CEA103 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://www.elsevier.com/books/computer-organization-and-design-mips-edition/patterson/978-0-12-820109-1" target="_blank" rel="noopener"><em>Computer Organization and Design</em> — Patterson &amp; Hennessy</a> (sách chuẩn, bản MIPS)</li>
<li><a href="https://en.wikipedia.org/wiki/Structured_Computer_Organization" target="_blank" rel="noopener"><em>Structured Computer Organization</em> — Tanenbaum</a></li>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/computer-organization-and-architecture/P200000003518" target="_blank" rel="noopener"><em>Computer Organization and Architecture</em> — Stallings</a></li>
</ul>
<h3>🌐 Khoá học &amp; tài liệu miễn phí</h3>
<ul>
<li><a href="https://www.nand2tetris.org/" target="_blank" rel="noopener">Nand2Tetris</a> — dựng cả máy tính từ cổng logic đi lên</li>
<li><a href="https://en.wikipedia.org/wiki/MIPS_architecture" target="_blank" rel="noopener">Kiến trúc &amp; assembly MIPS (tham khảo)</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@BenEater" target="_blank" rel="noopener">Ben Eater</a> — ráp máy tính 8-bit trên breadboard</li>
<li><a href="https://www.youtube.com/@Computerphile" target="_blank" rel="noopener">Computerphile</a> — máy tính hoạt động thế nào</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://courses.missouristate.edu/kenvollmar/mars/" target="_blank" rel="noopener">MARS</a> — trình dịch &amp; mô phỏng MIPS</li>
<li><a href="https://github.com/logisim-evolution/logisim-evolution" target="_blank" rel="noopener">Logisim Evolution</a> — thiết kế &amp; mô phỏng mạch logic số</li>
<li><a href="https://godbolt.org/" target="_blank" rel="noopener">Compiler Explorer</a> — xem mã C của bạn biên dịch ra assembly nào</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — hệ đếm, số bù 2, IEEE 754, cổng logic &amp; đại số Boole.</li>
<li><strong>Luyện tập</strong> — đọc/viết assembly MIPS trong MARS và dựng mạch nhỏ trong Logisim đến khi kết quả khớp lý thuyết.</li>
<li><strong>Đào sâu</strong> — datapath &amp; control, pipeline và hazard, cache &amp; phân cấp bộ nhớ.</li>
<li><strong>Sẵn sàng đi làm</strong> — suy luận hiệu năng (định luật Amdahl), hành vi cache, và chi phí thật của mã C/assembly.</li>
</ol></div>`,
  ]]);

const intro = doc('cea103-0-1-overview', 'Course overview: Computer Organization & Architecture|||Tổng quan: Tổ chức & Kiến trúc máy tính',
  'Kiến trúc vs tổ chức máy tính; mô hình von Neumann; các lớp trừu tượng từ transistor tới phần mềm; lộ trình 8 chương từ biểu diễn dữ liệu tới vào/ra & hiệu năng.',
  [[
    `<span class="eyebrow">CEA103 · Lesson 0.1 · Overview</span>
<h2>Computer Organization &amp; Architecture</h2>
<p class="lead">This course opens the black box: <strong>how a computer actually executes a program</strong>. You'll trace the path from bits and logic gates up through the instruction set, the processor's datapath, pipelining, the memory hierarchy, and I/O — the ideas behind every CPU you'll ever use.</p>
<h3>Architecture vs organization</h3>
<ul>
<li><strong>Architecture (ISA)</strong> — what the programmer sees: the instructions, registers and memory model. The <em>contract</em> between hardware and software.</li>
<li><strong>Organization</strong> — how that contract is <em>implemented</em>: datapath, control, caches, pipelines. Two chips can share an ISA yet be organized very differently.</li>
</ul>
<h3>The von Neumann model</h3>
<p>Almost every computer follows the <strong>von Neumann</strong> idea: <em>instructions and data share the same memory</em>. The CPU repeatedly <strong>fetches</strong> the next instruction, <strong>decodes</strong> it, and <strong>executes</strong> it — the fetch-decode-execute cycle.</p>
<pre><code>            +-----------------------------+
  Input --> |  Memory (instructions+data) | --> Output
            +-----------------------------+
                    |            ^
                    v            |
            +-----------------------------+
            |  CPU: Control Unit + ALU    |
            |  + Registers (PC, IR, ...)  |
            +-----------------------------+</code></pre>
<h3>Roadmap</h3>
<p>Data representation &amp; number systems → digital logic &amp; circuits → instruction set (ISA) → computer arithmetic → processor datapath &amp; control → pipelining → memory hierarchy (cache) → I/O, interrupts &amp; performance. Bilingual, with worked examples and assembly/circuit snippets.</p>`,
    `<span class="eyebrow">CEA103 · Bài 0.1 · Tổng quan</span>
<h2>Tổ chức &amp; Kiến trúc máy tính</h2>
<p class="lead">Môn này mở chiếc hộp đen: <strong>máy tính thực sự chạy một chương trình thế nào</strong>. Bạn lần theo con đường từ bit và cổng logic đi lên tập lệnh, datapath của bộ xử lý, pipeline, phân cấp bộ nhớ và vào/ra — những ý tưởng nằm sau mọi CPU bạn dùng.</p>
<h3>Kiến trúc và tổ chức</h3>
<ul>
<li><strong>Kiến trúc (ISA)</strong> — thứ lập trình viên thấy: tập lệnh, thanh ghi và mô hình bộ nhớ. Là <em>giao kèo</em> giữa phần cứng và phần mềm.</li>
<li><strong>Tổ chức</strong> — cách <em>hiện thực</em> giao kèo đó: datapath, control, cache, pipeline. Hai con chip cùng ISA vẫn có thể tổ chức rất khác nhau.</li>
</ul>
<h3>Mô hình von Neumann</h3>
<p>Gần như mọi máy tính theo ý tưởng <strong>von Neumann</strong>: <em>lệnh và dữ liệu dùng chung một bộ nhớ</em>. CPU lặp đi lặp lại việc <strong>nạp (fetch)</strong> lệnh kế tiếp, <strong>giải mã (decode)</strong>, rồi <strong>thực thi (execute)</strong> — chu kỳ fetch-decode-execute.</p>
<pre><code>            +-----------------------------+
 Vào  ---->  |  Bộ nhớ (lệnh + dữ liệu)    | ---->  Ra
            +-----------------------------+
                    |            ^
                    v            |
            +-----------------------------+
            |  CPU: Bộ điều khiển + ALU    |
            |  + Thanh ghi (PC, IR, ...)  |
            +-----------------------------+</code></pre>
<h3>Lộ trình</h3>
<p>Biểu diễn dữ liệu &amp; hệ đếm → logic số &amp; mạch → tập lệnh (ISA) → số học máy tính → datapath &amp; control của bộ xử lý → pipeline → phân cấp bộ nhớ (cache) → vào/ra, ngắt &amp; hiệu năng. Song ngữ, có ví dụ mẫu và đoạn assembly/mạch.</p>`,
  ]]);

const c1 = doc('cea103-1-1-data-representation', '1.1 — Data representation & number systems|||1.1 — Biểu diễn dữ liệu & hệ đếm',
  'Von Neumann; hệ nhị phân/thập lục phân, đổi cơ số; số bù 2 (số âm); dấu phẩy động IEEE 754.',
  [[
    `<span class="eyebrow">CEA103 · Chapter 1 · Lesson 1.1</span>
<h2>Data representation &amp; number systems</h2>
<h3>Why binary</h3>
<p>Hardware stores everything as <strong>bits</strong> (0/1) because a wire is easily "low" or "high". Numbers, text, images — all become binary. We group bits into bytes and read them in <strong>hexadecimal</strong> (base 16) for brevity: one hex digit = 4 bits.</p>
<pre><code>Binary 1011 0110  = 0xB6 = 182 (decimal)
Positional value:  128 + 32 + 16 + 4 + 2 = 182</code></pre>
<h3>Two's complement — signed integers</h3>
<p>To store negatives, computers use <strong>two's complement</strong>: flip every bit and add 1. Its magic is that <em>subtraction becomes addition</em> — the same adder handles both, and there is only one zero.</p>
<pre><code>+5  (8-bit) = 0000 0101
invert      = 1111 1010
add 1       = 1111 1011  =  -5
Check: 5 + (-5) = 0000 0000 (overflow bit dropped)</code></pre>
<h3>IEEE 754 floating point</h3>
<p>Real numbers use <strong>IEEE 754</strong>: a sign bit, an exponent, and a fraction (mantissa) — like scientific notation in binary. A 32-bit float = 1 sign + 8 exponent + 23 fraction bits. It trades exactness for range, which is why <code>0.1 + 0.2</code> is not exactly <code>0.3</code>.</p>
<div class="callout"><span class="badge">Key idea</span> There is no "number" in a computer — only a bit pattern plus an <em>agreed interpretation</em>. The same 32 bits can be an int, a float, or four characters.</div>`,
    `<span class="eyebrow">CEA103 · Chương 1 · Bài 1.1</span>
<h2>Biểu diễn dữ liệu &amp; hệ đếm</h2>
<h3>Vì sao nhị phân</h3>
<p>Phần cứng lưu mọi thứ dưới dạng <strong>bit</strong> (0/1) vì một dây dễ ở mức "thấp" hoặc "cao". Số, chữ, ảnh — đều thành nhị phân. Ta gom bit thành byte và đọc bằng <strong>thập lục phân (hex)</strong> cho gọn: một chữ số hex = 4 bit.</p>
<pre><code>Nhị phân 1011 0110 = 0xB6 = 182 (thập phân)
Giá trị theo vị trí: 128 + 32 + 16 + 4 + 2 = 182</code></pre>
<h3>Số bù 2 — số nguyên có dấu</h3>
<p>Để lưu số âm, máy dùng <strong>số bù 2</strong>: đảo mọi bit rồi cộng 1. Cái hay là <em>phép trừ trở thành phép cộng</em> — cùng một bộ cộng lo cả hai, và chỉ có một số 0 duy nhất.</p>
<pre><code>+5  (8-bit) = 0000 0101
đảo bit     = 1111 1010
cộng 1      = 1111 1011  =  -5
Kiểm: 5 + (-5) = 0000 0000 (bit tràn bị bỏ)</code></pre>
<h3>Dấu phẩy động IEEE 754</h3>
<p>Số thực dùng <strong>IEEE 754</strong>: một bit dấu, một trường mũ, một phần lẻ (mantissa) — như ký hiệu khoa học ở dạng nhị phân. Float 32-bit = 1 dấu + 8 mũ + 23 phần lẻ. Nó đánh đổi độ chính xác lấy tầm giá trị, nên <code>0.1 + 0.2</code> không đúng bằng <code>0.3</code>.</p>
<div class="callout"><span class="badge">Ý chính</span> Trong máy tính không có "con số" — chỉ có một mẫu bit cộng một <em>cách hiểu đã thống nhất</em>. Cùng 32 bit có thể là int, float, hay bốn ký tự.</div>`,
  ]]);

const c1q = quiz('cea103-quiz-1', 'Quiz 1 — Data representation|||Quiz 1 — Biểu diễn dữ liệu', [
  { id: 'q1', question: 'Một chữ số thập lục phân (hex) biểu diễn bao nhiêu bit?', options: ['1 bit', '2 bit', '4 bit', '8 bit'], correctIndex: 2, explanation: 'Hex là cơ số 16 = 2^4, nên một chữ số hex gói đúng 4 bit.' },
  { id: 'q2', question: 'Số bù 2 (two\'s complement) của một số được tạo bằng cách?', options: ['Đảo mọi bit', 'Đảo mọi bit rồi cộng 1', 'Cộng 1 rồi đảo bit', 'Dịch trái 1 bit'], correctIndex: 1, explanation: 'Bù 2 = đảo tất cả bit rồi cộng 1; nhờ đó phép trừ thành phép cộng.' },
  { id: 'q3', question: 'Chuẩn IEEE 754 dùng để biểu diễn?', options: ['Số nguyên không dấu', 'Ký tự Unicode', 'Số dấu phẩy động (số thực)', 'Địa chỉ bộ nhớ'], correctIndex: 2, explanation: 'IEEE 754 mã hoá số thực bằng dấu + mũ + phần lẻ (mantissa).' },
]);

const c2 = doc('cea103-2-1-digital-logic', '2.1 — Digital logic & circuits|||2.1 — Logic số & mạch',
  'Cổng logic (AND/OR/NOT/XOR); đại số Boole; mạch tổ hợp (bộ cộng, MUX); mạch tuần tự & flip-flop (nhớ trạng thái).',
  [[
    `<span class="eyebrow">CEA103 · Chapter 2 · Lesson 2.1</span>
<h2>Digital logic &amp; circuits</h2>
<h3>Logic gates</h3>
<p>Every circuit is built from a few <strong>gates</strong>: <code>AND</code>, <code>OR</code>, <code>NOT</code>, and <code>XOR</code>. Remarkably, <strong>NAND alone</strong> can build all of them — it is "functionally complete".</p>
<pre><code>A B | AND  OR  XOR
0 0 |  0    0    0
0 1 |  0    1    1
1 0 |  0    1    1
1 1 |  1    1    0</code></pre>
<h3>Boolean algebra</h3>
<p><strong>Boolean algebra</strong> lets us simplify logic before building it, saving gates. Useful laws: <code>A AND 1 = A</code>, <code>A OR 0 = A</code>, and De Morgan's: <code>NOT(A AND B) = (NOT A) OR (NOT B)</code>.</p>
<h3>Combinational vs sequential</h3>
<ul>
<li><strong>Combinational</strong> — output depends only on current inputs (adders, multiplexers, decoders). No memory.</li>
<li><strong>Sequential</strong> — output depends on inputs <em>and</em> stored state; it remembers. The building block is the <strong>flip-flop</strong>, which stores one bit and updates on a clock edge. Registers and memory are made of flip-flops.</li>
</ul>
<pre><code>Half adder (combinational):
  Sum   = A XOR B
  Carry = A AND B</code></pre>
<div class="callout"><span class="badge">From gates to CPU</span> Gates → adders &amp; multiplexers → registers (flip-flops) → the ALU and control logic. The whole CPU is just logic gates wired cleverly.</div>`,
    `<span class="eyebrow">CEA103 · Chương 2 · Bài 2.1</span>
<h2>Logic số &amp; mạch</h2>
<h3>Cổng logic</h3>
<p>Mọi mạch được dựng từ vài <strong>cổng logic</strong>: <code>AND</code>, <code>OR</code>, <code>NOT</code>, <code>XOR</code>. Đáng kinh ngạc là <strong>chỉ cổng NAND</strong> đã dựng được tất cả — nó "đầy đủ chức năng".</p>
<pre><code>A B | AND  OR  XOR
0 0 |  0    0    0
0 1 |  0    1    1
1 0 |  0    1    1
1 1 |  1    1    0</code></pre>
<h3>Đại số Boole</h3>
<p><strong>Đại số Boole</strong> giúp rút gọn logic trước khi dựng, tiết kiệm cổng. Vài luật hay dùng: <code>A AND 1 = A</code>, <code>A OR 0 = A</code>, và De Morgan: <code>NOT(A AND B) = (NOT A) OR (NOT B)</code>.</p>
<h3>Tổ hợp và tuần tự</h3>
<ul>
<li><strong>Tổ hợp</strong> — đầu ra chỉ phụ thuộc đầu vào hiện tại (bộ cộng, multiplexer, bộ giải mã). Không nhớ.</li>
<li><strong>Tuần tự</strong> — đầu ra phụ thuộc đầu vào <em>và</em> trạng thái đã lưu; nó nhớ. Khối cơ bản là <strong>flip-flop</strong>, lưu một bit và cập nhật theo sườn xung nhịp. Thanh ghi và bộ nhớ đều làm từ flip-flop.</li>
</ul>
<pre><code>Bộ cộng bán phần (tổ hợp):
  Tổng   = A XOR B
  Nhớ    = A AND B</code></pre>
<div class="callout"><span class="badge">Từ cổng tới CPU</span> Cổng → bộ cộng &amp; multiplexer → thanh ghi (flip-flop) → ALU và logic điều khiển. Cả CPU chỉ là các cổng logic nối khéo.</div>`,
  ]]);

const c2q = quiz('cea103-quiz-2', 'Quiz 2 — Digital logic|||Quiz 2 — Logic số', [
  { id: 'q1', question: 'Cổng logic nào một mình có thể dựng nên mọi cổng khác (đầy đủ chức năng)?', options: ['AND', 'OR', 'NAND', 'XOR'], correctIndex: 2, explanation: 'NAND (và NOR) là đầy đủ chức năng — dựng được AND/OR/NOT và mọi cổng.' },
  { id: 'q2', question: 'Mạch có đầu ra phụ thuộc CẢ đầu vào lẫn trạng thái đã lưu gọi là?', options: ['Mạch tổ hợp', 'Mạch tuần tự', 'Bộ giải mã', 'Multiplexer'], correctIndex: 1, explanation: 'Mạch tuần tự nhớ trạng thái; khối cơ bản là flip-flop.' },
  { id: 'q3', question: 'Linh kiện logic lưu MỘT bit và cập nhật theo sườn xung nhịp là?', options: ['Cổng AND', 'Flip-flop', 'Bộ cộng bán phần', 'Điện trở'], correctIndex: 1, explanation: 'Flip-flop lưu 1 bit; thanh ghi và bộ nhớ được dựng từ flip-flop.' },
]);

const c3 = doc('cea103-3-1-isa', '3.1 — Instruction Set Architecture (ISA)|||3.1 — Kiến trúc tập lệnh (ISA)',
  'Tập lệnh; RISC vs CISC; assembly MIPS/x86 cơ bản; các kiểu định địa chỉ (addressing modes).',
  [[
    `<span class="eyebrow">CEA103 · Chapter 3 · Lesson 3.1</span>
<h2>Instruction Set Architecture (ISA)</h2>
<h3>The hardware-software contract</h3>
<p>The <strong>ISA</strong> is the set of instructions a CPU understands, plus its registers and memory model. It's the interface a compiler targets. Common families: <strong>MIPS</strong>, <strong>ARM</strong>, <strong>x86</strong>, <strong>RISC-V</strong>.</p>
<h3>RISC vs CISC</h3>
<ul>
<li><strong>RISC</strong> (MIPS, ARM, RISC-V) — few, simple, fixed-length instructions; load/store only touches memory; easy to pipeline.</li>
<li><strong>CISC</strong> (x86) — many complex, variable-length instructions, some doing a lot at once; denser code, harder hardware.</li>
</ul>
<pre><code># MIPS: c = a + b  (a in $t0, b in $t1)
add  $t2, $t0, $t1     # t2 = t0 + t1
sw   $t2, 0($s0)       # store t2 to memory[s0]

# x86 (roughly the same):
mov  eax, [a]
add  eax, [b]
mov  [c], eax</code></pre>
<h3>Addressing modes</h3>
<p><strong>Addressing modes</strong> are the ways an instruction names its operands:</p>
<ul>
<li><strong>Immediate</strong> — a constant in the instruction: <code>addi $t0, $t0, 4</code></li>
<li><strong>Register</strong> — value in a register: <code>add $t2, $t0, $t1</code></li>
<li><strong>Base + offset</strong> — memory at register plus a constant: <code>lw $t0, 8($s0)</code></li>
</ul>
<div class="callout"><span class="badge">Why it matters</span> The ISA is a long-lived contract: x86 code from decades ago still runs, because the <em>interface</em> stayed stable while the <em>organization</em> underneath was reinvented many times.</div>`,
    `<span class="eyebrow">CEA103 · Chương 3 · Bài 3.1</span>
<h2>Kiến trúc tập lệnh (ISA)</h2>
<h3>Giao kèo phần cứng - phần mềm</h3>
<p><strong>ISA</strong> là tập lệnh mà CPU hiểu, cộng thanh ghi và mô hình bộ nhớ. Đây là giao diện mà trình biên dịch nhắm tới. Các họ phổ biến: <strong>MIPS</strong>, <strong>ARM</strong>, <strong>x86</strong>, <strong>RISC-V</strong>.</p>
<h3>RISC và CISC</h3>
<ul>
<li><strong>RISC</strong> (MIPS, ARM, RISC-V) — ít lệnh, đơn giản, độ dài cố định; chỉ load/store mới đụng bộ nhớ; dễ pipeline.</li>
<li><strong>CISC</strong> (x86) — nhiều lệnh phức tạp, độ dài thay đổi, có lệnh làm nhiều việc một lúc; mã gọn hơn nhưng phần cứng khó hơn.</li>
</ul>
<pre><code># MIPS: c = a + b  (a ở $t0, b ở $t1)
add  $t2, $t0, $t1     # t2 = t0 + t1
sw   $t2, 0($s0)       # ghi t2 vào memory[s0]

# x86 (đại khái tương đương):
mov  eax, [a]
add  eax, [b]
mov  [c], eax</code></pre>
<h3>Các kiểu định địa chỉ</h3>
<p><strong>Addressing modes</strong> là các cách một lệnh gọi tên toán hạng:</p>
<ul>
<li><strong>Tức thời (immediate)</strong> — hằng số ngay trong lệnh: <code>addi $t0, $t0, 4</code></li>
<li><strong>Thanh ghi</strong> — giá trị trong thanh ghi: <code>add $t2, $t0, $t1</code></li>
<li><strong>Cơ sở + độ dời</strong> — bộ nhớ tại thanh ghi cộng một hằng: <code>lw $t0, 8($s0)</code></li>
</ul>
<div class="callout"><span class="badge">Vì sao quan trọng</span> ISA là giao kèo sống lâu: mã x86 hàng chục năm trước vẫn chạy, vì <em>giao diện</em> giữ ổn định trong khi <em>tổ chức</em> bên dưới đã được làm lại nhiều lần.</div>`,
  ]]);

const c3q = quiz('cea103-quiz-3', 'Quiz 3 — ISA|||Quiz 3 — Tập lệnh', [
  { id: 'q1', question: 'Đặc trưng của kiến trúc RISC (như MIPS) là?', options: ['Lệnh phức tạp, độ dài thay đổi', 'Ít lệnh đơn giản, độ dài cố định, chỉ load/store đụng bộ nhớ', 'Không có thanh ghi', 'Mọi lệnh đều truy cập bộ nhớ'], correctIndex: 1, explanation: 'RISC: lệnh ít, đơn giản, cố định độ dài, dễ pipeline; chỉ load/store truy cập bộ nhớ.' },
  { id: 'q2', question: 'ISA (Instruction Set Architecture) về bản chất là?', options: ['Cách bố trí cache trên chip', 'Giao kèo giữa phần cứng và phần mềm (tập lệnh CPU hiểu)', 'Ngôn ngữ lập trình bậc cao', 'Sơ đồ nguồn của bo mạch'], correctIndex: 1, explanation: 'ISA là tập lệnh + thanh ghi + mô hình bộ nhớ — giao diện phần cứng/phần mềm.' },
  { id: 'q3', question: 'Lệnh MIPS "lw $t0, 8($s0)" dùng kiểu định địa chỉ nào?', options: ['Tức thời (immediate)', 'Thanh ghi', 'Cơ sở + độ dời (base + offset)', 'Trực tiếp tuyệt đối'], correctIndex: 2, explanation: 'Địa chỉ = nội dung $s0 cộng độ dời 8 — kiểu cơ sở + độ dời.' },
]);

const c4 = doc('cea103-4-1-arithmetic', '4.1 — Computer arithmetic|||4.1 — Số học máy tính',
  'ALU; cộng/trừ nhị phân (bù 2); nhân & chia nhị phân (dịch-cộng); tràn số (overflow) và phát hiện tràn.',
  [[
    `<span class="eyebrow">CEA103 · Chapter 4 · Lesson 4.1</span>
<h2>Computer arithmetic</h2>
<h3>The ALU</h3>
<p>The <strong>Arithmetic Logic Unit (ALU)</strong> is the CPU's calculator: it adds, subtracts, and does AND/OR/shifts. It's combinational logic built around an adder.</p>
<h3>Add and subtract</h3>
<p>Binary addition works column by column with a carry. <strong>Subtraction</strong> reuses the adder: <code>A - B = A + (two's complement of B)</code>. One circuit, both operations.</p>
<pre><code>  0110  (6)          0110  ( 6)
+ 0011  (3)        + 1101  (-3, two's comp.)
------             ------
  1001  (9)         10011  -> drop carry -> 0011 (3)</code></pre>
<h3>Multiply &amp; divide</h3>
<p>Multiplication is repeated <strong>shift-and-add</strong> (like long multiplication in base 2); division is repeated shift-and-subtract. These take more cycles than add, which is why multiply/divide are "expensive".</p>
<h3>Overflow</h3>
<p><strong>Overflow</strong> happens when a result doesn't fit the register width. In two's complement, it's detected when adding two same-sign numbers gives the opposite sign.</p>
<pre><code>8-bit signed:  127 + 1
 0111 1111 + 0000 0001 = 1000 0000 = -128  (overflow!)</code></pre>
<div class="callout"><span class="badge">Watch the width</span> Every integer has a fixed number of bits. Overflow is silent in hardware — the program must check it, which is why languages differ on wrap vs error.</div>`,
    `<span class="eyebrow">CEA103 · Chương 4 · Bài 4.1</span>
<h2>Số học máy tính</h2>
<h3>ALU</h3>
<p><strong>Đơn vị số học - logic (ALU)</strong> là máy tính con của CPU: cộng, trừ, và làm AND/OR/dịch bit. Nó là logic tổ hợp dựng quanh một bộ cộng.</p>
<h3>Cộng và trừ</h3>
<p>Cộng nhị phân làm theo từng cột kèm số nhớ. <strong>Phép trừ</strong> tái sử dụng bộ cộng: <code>A - B = A + (bù 2 của B)</code>. Một mạch, cả hai phép.</p>
<pre><code>  0110  (6)          0110  ( 6)
+ 0011  (3)        + 1101  (-3, bù 2)
------             ------
  1001  (9)         10011  -> bỏ nhớ -> 0011 (3)</code></pre>
<h3>Nhân &amp; chia</h3>
<p>Phép nhân là <strong>dịch-và-cộng</strong> lặp lại (như nhân tay ở cơ số 2); phép chia là dịch-và-trừ lặp lại. Chúng tốn nhiều chu kỳ hơn phép cộng, nên nhân/chia bị coi là "đắt".</p>
<h3>Tràn số (overflow)</h3>
<p><strong>Tràn số</strong> xảy ra khi kết quả không vừa độ rộng thanh ghi. Với bù 2, phát hiện tràn khi cộng hai số cùng dấu lại ra dấu ngược lại.</p>
<pre><code>8-bit có dấu:  127 + 1
 0111 1111 + 0000 0001 = 1000 0000 = -128  (tràn!)</code></pre>
<div class="callout"><span class="badge">Coi chừng độ rộng</span> Mỗi số nguyên có số bit cố định. Tràn số diễn ra âm thầm trong phần cứng — chương trình phải tự kiểm, nên các ngôn ngữ khác nhau ở chỗ cuộn vòng hay báo lỗi.</div>`,
  ]]);

const c4q = quiz('cea103-quiz-4', 'Quiz 4 — Arithmetic|||Quiz 4 — Số học', [
  { id: 'q1', question: 'Trong CPU, đơn vị nào thực hiện cộng, trừ, AND/OR, dịch bit?', options: ['Bộ điều khiển (Control Unit)', 'ALU', 'Cache', 'Thanh ghi PC'], correctIndex: 1, explanation: 'ALU (Arithmetic Logic Unit) là đơn vị số học - logic của CPU.' },
  { id: 'q2', question: 'Phần cứng thực hiện A − B bằng cách nào để dùng lại bộ cộng?', options: ['A cộng bù 2 của B', 'A nhân nghịch đảo B', 'A OR B', 'Dịch phải A theo B'], correctIndex: 0, explanation: 'A − B = A + (bù 2 của B); nhờ đó một mạch cộng lo cả cộng lẫn trừ.' },
  { id: 'q3', question: 'Cộng số 8-bit có dấu: 127 + 1 cho kết quả -128. Đây là hiện tượng?', options: ['Làm tròn', 'Tràn số (overflow)', 'Số bù 1', 'Dấu phẩy động'], correctIndex: 1, explanation: 'Kết quả vượt tầm biểu diễn của thanh ghi → tràn số, dấu bị lật.' },
]);

const c5 = doc('cea103-5-1-datapath', '5.1 — Processor: datapath & control|||5.1 — Bộ xử lý: datapath & control',
  'Datapath (PC, thanh ghi, ALU, bộ nhớ); bộ điều khiển (control unit); chu kỳ lệnh fetch-decode-execute.',
  [[
    `<span class="eyebrow">CEA103 · Chapter 5 · Lesson 5.1</span>
<h2>Processor: datapath &amp; control</h2>
<h3>The datapath</h3>
<p>The <strong>datapath</strong> is the hardware that data flows through: the <strong>PC</strong> (program counter), the <strong>register file</strong>, the <strong>ALU</strong>, and connections to memory. It's the "roads"; the control unit is the "traffic lights".</p>
<h3>The control unit</h3>
<p>The <strong>control unit</strong> reads the current instruction and generates the signals that steer the datapath — which register to read, what the ALU should do, whether to write memory. It turns bits of the instruction into actions.</p>
<h3>Fetch-decode-execute</h3>
<pre><code>1. FETCH   : IR <- Memory[PC];  PC <- PC + 4
2. DECODE  : read opcode + registers; control sets signals
3. EXECUTE : ALU computes (e.g. add)
4. MEM     : load/store data if needed
5. WRITE   : result written back to a register</code></pre>
<p>This cycle repeats billions of times per second. A single-cycle design does all five steps in one long clock; a multicycle design breaks them into shorter clocks.</p>
<div class="callout"><span class="badge">Datapath + control = CPU</span> Give the datapath the right control signals in the right order and you have a working processor. Everything after this (pipelining) is about doing this cycle <em>faster</em>.</div>`,
    `<span class="eyebrow">CEA103 · Chương 5 · Bài 5.1</span>
<h2>Bộ xử lý: datapath &amp; control</h2>
<h3>Datapath</h3>
<p><strong>Datapath</strong> là phần cứng mà dữ liệu chảy qua: <strong>PC</strong> (bộ đếm chương trình), <strong>tệp thanh ghi</strong>, <strong>ALU</strong>, và các đường nối tới bộ nhớ. Nó là "đường sá"; bộ điều khiển là "đèn giao thông".</p>
<h3>Bộ điều khiển</h3>
<p><strong>Bộ điều khiển (control unit)</strong> đọc lệnh hiện tại và sinh các tín hiệu lái datapath — đọc thanh ghi nào, ALU làm gì, có ghi bộ nhớ không. Nó biến các bit của lệnh thành hành động.</p>
<h3>Fetch-decode-execute</h3>
<pre><code>1. FETCH   : IR <- Memory[PC];  PC <- PC + 4
2. DECODE  : đọc opcode + thanh ghi; control đặt tín hiệu
3. EXECUTE : ALU tính (vd cộng)
4. MEM     : load/store dữ liệu nếu cần
5. WRITE   : ghi kết quả trở lại thanh ghi</code></pre>
<p>Chu kỳ này lặp hàng tỉ lần mỗi giây. Thiết kế một-chu-kỳ làm cả năm bước trong một nhịp dài; thiết kế đa-chu-kỳ chia thành nhiều nhịp ngắn.</p>
<div class="callout"><span class="badge">Datapath + control = CPU</span> Đưa datapath đúng tín hiệu điều khiển theo đúng thứ tự là bạn có một bộ xử lý chạy được. Mọi thứ sau đây (pipeline) là làm chu kỳ này <em>nhanh hơn</em>.</div>`,
  ]]);

const c5q = quiz('cea103-quiz-5', 'Quiz 5 — Datapath & control|||Quiz 5 — Datapath & control', [
  { id: 'q1', question: 'Bước đầu tiên của chu kỳ lệnh là?', options: ['Execute (thực thi)', 'Fetch (nạp lệnh từ Memory[PC])', 'Write-back', 'Decode'], correctIndex: 1, explanation: 'Chu kỳ bắt đầu bằng FETCH: nạp lệnh tại địa chỉ trong PC, rồi PC tiến lên.' },
  { id: 'q2', question: 'Thanh ghi PC (Program Counter) giữ gì?', options: ['Kết quả của ALU', 'Địa chỉ của lệnh kế tiếp', 'Dữ liệu vừa đọc từ cache', 'Tín hiệu điều khiển'], correctIndex: 1, explanation: 'PC trỏ tới lệnh tiếp theo cần nạp; sau fetch thường PC = PC + 4.' },
  { id: 'q3', question: 'Bộ phận nào sinh tín hiệu điều khiển lái datapath dựa trên lệnh hiện tại?', options: ['ALU', 'Register file', 'Control unit (bộ điều khiển)', 'Cache'], correctIndex: 2, explanation: 'Control unit giải mã lệnh và phát tín hiệu điều khiển các thành phần datapath.' },
]);

const c6 = doc('cea103-6-1-pipeline', '6.1 — Pipelining|||6.1 — Pipeline (ống dẫn lệnh)',
  'Pipelining (chồng lệnh để tăng thông lượng); các loại hazard (structural/data/control); forwarding & stall; tăng tốc.',
  [[
    `<span class="eyebrow">CEA103 · Chapter 6 · Lesson 6.1</span>
<h2>Pipelining</h2>
<h3>The laundry idea</h3>
<p>Instead of finishing one instruction before starting the next, a <strong>pipeline</strong> overlaps them — like a laundromat washing load 2 while load 1 is drying. The classic MIPS pipeline has 5 stages: <strong>IF, ID, EX, MEM, WB</strong>.</p>
<pre><code>Cycle:     1    2    3    4    5    6    7
Instr 1:  IF   ID   EX  MEM   WB
Instr 2:       IF   ID   EX  MEM   WB
Instr 3:            IF   ID   EX  MEM   WB</code></pre>
<p>Pipelining doesn't make one instruction faster — it raises <strong>throughput</strong> (instructions finished per second). Ideal speed-up approaches the number of stages.</p>
<h3>Hazards</h3>
<ul>
<li><strong>Structural</strong> — two instructions need the same hardware at once.</li>
<li><strong>Data</strong> — an instruction needs a result the previous one hasn't written yet.</li>
<li><strong>Control</strong> — a branch changes what to fetch next, but we already fetched.</li>
</ul>
<h3>Fixes</h3>
<p><strong>Forwarding</strong> routes a result straight to where it's needed, before write-back, killing many data hazards. When that isn't enough, the pipeline <strong>stalls</strong> (inserts a bubble). Branches use prediction to avoid stalling on control hazards.</p>
<div class="callout"><span class="badge">Throughput, not latency</span> Deeper pipelines finish more instructions per second but make hazards costlier — the central trade-off of processor design.</div>`,
    `<span class="eyebrow">CEA103 · Chương 6 · Bài 6.1</span>
<h2>Pipeline (ống dẫn lệnh)</h2>
<h3>Ý tưởng giặt là</h3>
<p>Thay vì làm xong một lệnh mới bắt đầu lệnh sau, <strong>pipeline</strong> chồng chúng lên nhau — như tiệm giặt: mẻ 2 đang giặt trong khi mẻ 1 đang sấy. Pipeline MIPS kinh điển có 5 tầng: <strong>IF, ID, EX, MEM, WB</strong>.</p>
<pre><code>Nhịp:      1    2    3    4    5    6    7
Lệnh 1:   IF   ID   EX  MEM   WB
Lệnh 2:        IF   ID   EX  MEM   WB
Lệnh 3:             IF   ID   EX  MEM   WB</code></pre>
<p>Pipeline không làm một lệnh nhanh hơn — nó tăng <strong>thông lượng</strong> (số lệnh hoàn thành mỗi giây). Tăng tốc lý tưởng tiến gần tới số tầng.</p>
<h3>Hazard (xung đột)</h3>
<ul>
<li><strong>Structural</strong> — hai lệnh cần cùng một phần cứng cùng lúc.</li>
<li><strong>Data</strong> — một lệnh cần kết quả mà lệnh trước chưa ghi xong.</li>
<li><strong>Control</strong> — một lệnh rẽ nhánh đổi chỗ cần nạp, nhưng ta đã nạp trước rồi.</li>
</ul>
<h3>Cách khắc phục</h3>
<p><strong>Forwarding</strong> chuyển thẳng kết quả tới nơi cần, trước cả write-back, dập nhiều data hazard. Khi vẫn chưa đủ, pipeline <strong>stall</strong> (chèn bong bóng). Rẽ nhánh dùng dự đoán để tránh stall vì control hazard.</p>
<div class="callout"><span class="badge">Thông lượng, không phải độ trễ</span> Pipeline sâu hơn hoàn thành nhiều lệnh/giây hơn nhưng làm hazard đắt hơn — đánh đổi cốt lõi của thiết kế bộ xử lý.</div>`,
  ]]);

const c6q = quiz('cea103-quiz-6', 'Quiz 6 — Pipelining|||Quiz 6 — Pipeline', [
  { id: 'q1', question: 'Pipelining cải thiện chủ yếu điều gì?', options: ['Độ trễ của một lệnh đơn lẻ', 'Thông lượng (số lệnh hoàn thành mỗi giây)', 'Dung lượng bộ nhớ', 'Độ chính xác số học'], correctIndex: 1, explanation: 'Pipeline chồng lệnh để tăng thông lượng, không làm một lệnh chạy nhanh hơn.' },
  { id: 'q2', question: 'Kỹ thuật chuyển thẳng kết quả tới lệnh cần nó (trước write-back) để tránh xung đột dữ liệu là?', options: ['Stalling', 'Forwarding (bypassing)', 'Branch prediction', 'Caching'], correctIndex: 1, explanation: 'Forwarding/bypassing đưa kết quả sớm tới nơi cần, dập nhiều data hazard.' },
  { id: 'q3', question: 'Lệnh rẽ nhánh làm ta không biết chắc lệnh kế tiếp cần nạp — đây là loại hazard nào?', options: ['Structural hazard', 'Data hazard', 'Control hazard', 'Không phải hazard'], correctIndex: 2, explanation: 'Rẽ nhánh gây control hazard; giảm bằng dự đoán nhánh (branch prediction).' },
]);

const c7 = doc('cea103-7-1-memory-hierarchy', '7.1 — Memory hierarchy & cache|||7.1 — Phân cấp bộ nhớ & cache',
  'Phân cấp bộ nhớ (thanh ghi→cache→RAM→đĩa); tính cục bộ (locality); ánh xạ cache (mapping); hit/miss; bộ nhớ chính.',
  [[
    `<span class="eyebrow">CEA103 · Chapter 7 · Lesson 7.1</span>
<h2>Memory hierarchy &amp; cache</h2>
<h3>The pyramid</h3>
<p>Fast memory is small and expensive; big memory is slow and cheap. So computers stack them: <strong>registers → L1/L2/L3 cache → main memory (RAM) → disk/SSD</strong>. The trick is to keep the data you're using now near the top.</p>
<pre><code>       fastest, smallest, costliest
   Registers   (< 1 ns)
   L1 cache    (~1 ns)
   L2/L3 cache (~10 ns)
   Main memory (~100 ns)
   Disk / SSD  (~100000+ ns)
       slowest, biggest, cheapest</code></pre>
<h3>Why it works: locality</h3>
<ul>
<li><strong>Temporal locality</strong> — data used now is likely used again soon (loops).</li>
<li><strong>Spatial locality</strong> — data near what you used is likely used next (arrays).</li>
</ul>
<h3>Cache: hit, miss, mapping</h3>
<p>A <strong>cache</strong> keeps recently-used blocks. A <strong>hit</strong> means the data is there (fast); a <strong>miss</strong> means fetch from a slower level. <strong>Mapping</strong> decides where a block can sit: <em>direct-mapped</em> (one spot), <em>set-associative</em> (a few spots), or <em>fully associative</em> (anywhere).</p>
<div class="callout"><span class="badge">The hierarchy is an illusion</span> Together the levels give the <em>speed of the fast layer</em> at the <em>size of the slow layer</em> — as long as your access pattern has locality.</div>`,
    `<span class="eyebrow">CEA103 · Chương 7 · Bài 7.1</span>
<h2>Phân cấp bộ nhớ &amp; cache</h2>
<h3>Kim tự tháp bộ nhớ</h3>
<p>Bộ nhớ nhanh thì nhỏ và đắt; bộ nhớ lớn thì chậm và rẻ. Nên máy tính xếp chồng chúng: <strong>thanh ghi → cache L1/L2/L3 → bộ nhớ chính (RAM) → đĩa/SSD</strong>. Mẹo là giữ dữ liệu đang dùng ở gần đỉnh.</p>
<pre><code>       nhanh nhất, nhỏ nhất, đắt nhất
   Thanh ghi   (< 1 ns)
   Cache L1    (~1 ns)
   Cache L2/L3 (~10 ns)
   Bộ nhớ chính(~100 ns)
   Đĩa / SSD   (~100000+ ns)
       chậm nhất, lớn nhất, rẻ nhất</code></pre>
<h3>Vì sao hiệu quả: tính cục bộ</h3>
<ul>
<li><strong>Cục bộ thời gian</strong> — dữ liệu dùng bây giờ có khả năng dùng lại ngay (vòng lặp).</li>
<li><strong>Cục bộ không gian</strong> — dữ liệu gần thứ vừa dùng có khả năng dùng kế tiếp (mảng).</li>
</ul>
<h3>Cache: hit, miss, ánh xạ</h3>
<p><strong>Cache</strong> giữ các khối vừa dùng. <strong>Hit</strong> nghĩa là dữ liệu có sẵn (nhanh); <strong>miss</strong> nghĩa là phải lấy từ tầng chậm hơn. <strong>Ánh xạ (mapping)</strong> quyết định khối được đặt ở đâu: <em>trực tiếp</em> (một chỗ), <em>tập kết hợp</em> (vài chỗ), hoặc <em>kết hợp toàn phần</em> (chỗ nào cũng được).</p>
<div class="callout"><span class="badge">Phân cấp là một ảo giác</span> Gộp lại, các tầng cho ta <em>tốc độ của tầng nhanh</em> ở <em>dung lượng của tầng chậm</em> — miễn là mẫu truy cập có tính cục bộ.</div>`,
  ]]);

const c7q = quiz('cea103-quiz-7', 'Quiz 7 — Memory hierarchy|||Quiz 7 — Phân cấp bộ nhớ', [
  { id: 'q1', question: 'Sắp theo tốc độ NHANH → CHẬM, thứ tự đúng là?', options: ['RAM → cache → thanh ghi → đĩa', 'Thanh ghi → cache → RAM → đĩa', 'Đĩa → RAM → cache → thanh ghi', 'Cache → thanh ghi → đĩa → RAM'], correctIndex: 1, explanation: 'Thanh ghi nhanh nhất, rồi cache, RAM, cuối cùng là đĩa/SSD.' },
  { id: 'q2', question: 'Vòng lặp truy cập lại cùng biến nhiều lần khai thác loại cục bộ nào?', options: ['Cục bộ thời gian (temporal)', 'Cục bộ không gian (spatial)', 'Cục bộ ngẫu nhiên', 'Không có tính cục bộ'], correctIndex: 0, explanation: 'Dùng lại cùng dữ liệu trong thời gian ngắn = cục bộ thời gian.' },
  { id: 'q3', question: 'Khi CPU cần dữ liệu MÀ cache KHÔNG có, phải lấy từ tầng chậm hơn — gọi là?', options: ['Cache hit', 'Cache miss', 'Forwarding', 'Overflow'], correctIndex: 1, explanation: 'Không tìm thấy trong cache = cache miss, phải lấy từ RAM/đĩa.' },
]);

const c8 = doc('cea103-8-1-io-performance', '8.1 — I/O, buses & system performance|||8.1 — Vào/ra, bus & hiệu năng',
  'Vào/ra (I/O); bus hệ thống; polling vs ngắt (interrupt); DMA (truy cập bộ nhớ trực tiếp); đo hiệu năng & định luật Amdahl.',
  [[
    `<span class="eyebrow">CEA103 · Chapter 8 · Lesson 8.1</span>
<h2>I/O, buses &amp; system performance</h2>
<h3>Talking to the outside world</h3>
<p>The CPU reaches devices (disk, keyboard, network) over a <strong>bus</strong> — shared wires carrying address, data and control signals. Three ways to know a device is ready:</p>
<ul>
<li><strong>Polling</strong> — the CPU keeps asking "ready yet?". Simple, but wastes cycles.</li>
<li><strong>Interrupts</strong> — the device signals the CPU when done; the CPU drops what it's doing, runs a handler, then resumes. Far more efficient.</li>
<li><strong>DMA</strong> — a <em>DMA controller</em> moves a whole block between device and memory <em>without</em> the CPU copying each byte; the CPU is interrupted only when the transfer finishes.</li>
</ul>
<h3>Measuring performance</h3>
<p>A common model: <code>CPU time = instructions × CPI × clock cycle time</code> (CPI = cycles per instruction). Faster clock, fewer instructions, or lower CPI all help.</p>
<h3>Amdahl's law</h3>
<p><strong>Amdahl's law</strong> caps how much speeding up one part helps: if a part is fraction <em>f</em> of the time and you speed it up by <em>s</em>, overall speed-up is <code>1 / ((1 - f) + f/s)</code>. Even infinite speed-up of a part leaves the rest untouched.</p>
<pre><code>f = 0.9 sped up 10x, but 0.1 unchanged:
speedup = 1 / (0.1 + 0.9/10) = 1 / 0.19 = 5.26x  (not 10x)</code></pre>
<div class="callout"><span class="badge">Optimize the common case</span> Amdahl's law is why engineers attack whatever dominates the runtime — speeding up a rare path barely moves the total.</div>`,
    `<span class="eyebrow">CEA103 · Chương 8 · Bài 8.1</span>
<h2>Vào/ra, bus &amp; hiệu năng</h2>
<h3>Nói chuyện với thế giới bên ngoài</h3>
<p>CPU với tới thiết bị (đĩa, bàn phím, mạng) qua <strong>bus</strong> — các dây dùng chung mang tín hiệu địa chỉ, dữ liệu và điều khiển. Ba cách biết một thiết bị đã sẵn sàng:</p>
<ul>
<li><strong>Polling (thăm dò)</strong> — CPU liên tục hỏi "xong chưa?". Đơn giản, nhưng phí chu kỳ.</li>
<li><strong>Ngắt (interrupt)</strong> — thiết bị báo CPU khi xong; CPU tạm dừng việc đang làm, chạy trình xử lý ngắt, rồi tiếp tục. Hiệu quả hơn nhiều.</li>
<li><strong>DMA</strong> — một <em>bộ điều khiển DMA</em> chuyển cả khối giữa thiết bị và bộ nhớ <em>mà không</em> để CPU chép từng byte; CPU chỉ bị ngắt khi truyền xong.</li>
</ul>
<h3>Đo hiệu năng</h3>
<p>Mô hình quen thuộc: <code>Thời gian CPU = số lệnh × CPI × chu kỳ nhịp</code> (CPI = số chu kỳ mỗi lệnh). Nhịp nhanh hơn, ít lệnh hơn, hay CPI thấp hơn đều giúp ích.</p>
<h3>Định luật Amdahl</h3>
<p><strong>Định luật Amdahl</strong> chặn mức lợi khi chỉ tăng tốc một phần: nếu phần đó chiếm tỉ lệ <em>f</em> thời gian và bạn tăng tốc nó <em>s</em> lần, tăng tốc tổng là <code>1 / ((1 - f) + f/s)</code>. Dù tăng tốc phần đó vô hạn thì phần còn lại vẫn nguyên.</p>
<pre><code>f = 0.9 tăng tốc 10x, còn 0.1 giữ nguyên:
tăng tốc = 1 / (0.1 + 0.9/10) = 1 / 0.19 = 5.26x  (không phải 10x)</code></pre>
<div class="callout"><span class="badge">Tối ưu trường hợp phổ biến</span> Định luật Amdahl là lý do kỹ sư nhắm vào thứ chiếm phần lớn thời gian — tăng tốc đường hiếm gặp gần như không nhích được tổng.</div>`,
  ]]);

const c8q = quiz('cea103-quiz-8', 'Quiz 8 — I/O & performance|||Quiz 8 — Vào/ra & hiệu năng', [
  { id: 'q1', question: 'Cơ chế nào cho phép thiết bị báo CPU khi xong, thay vì CPU liên tục thăm dò?', options: ['Polling', 'Ngắt (interrupt)', 'Caching', 'Pipelining'], correctIndex: 1, explanation: 'Ngắt để thiết bị chủ động báo CPU, tránh phí chu kỳ như polling.' },
  { id: 'q2', question: 'DMA (Direct Memory Access) giúp ích thế nào?', options: ['Chuyển cả khối giữa thiết bị và bộ nhớ mà không cần CPU chép từng byte', 'Tăng số thanh ghi', 'Dự đoán nhánh', 'Nén dữ liệu cache'], correctIndex: 0, explanation: 'DMA controller lo truyền khối, CPU chỉ bị ngắt khi hoàn tất — giải phóng CPU.' },
  { id: 'q3', question: 'Một phần chiếm 90% thời gian được tăng tốc 10 lần; phần còn lại giữ nguyên. Theo định luật Amdahl, tăng tốc tổng là?', options: ['10x', '9x', '≈ 5,26x', '1x'], correctIndex: 2, explanation: '1 / (0,1 + 0,9/10) = 1/0,19 ≈ 5,26x — phần không tăng tốc chặn lợi ích tổng.' },
]);

export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'CEA103',
    slug: 'cea103-computer-organization-and-architecture',
    title: 'Computer Organization and Architecture',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CEA103.webp',
    shortDescription: 'How computers work inside — von Neumann, binary/hex & two\'s complement, IEEE 754, logic gates, ISA (RISC/CISC, MIPS assembly), arithmetic, datapath & control, pipelining, cache & memory hierarchy, I/O, interrupts & DMA. Bilingual, with quizzes.|||Máy tính hoạt động thế nào bên trong — von Neumann, nhị phân/hex & bù 2, IEEE 754, cổng logic, ISA (RISC/CISC, assembly MIPS), số học, datapath & control, pipeline, cache & phân cấp bộ nhớ, I/O, ngắt & DMA. Song ngữ, có quiz.',
    description: 'Môn <strong>CEA103 — Computer Organization and Architecture</strong> (Tổ chức &amp; Kiến trúc máy tính, ngành Khoa học Máy tính, kỳ 1) mở chiếc hộp đen: <strong>máy tính chạy một chương trình thế nào</strong>. Từ <strong>biểu diễn dữ liệu</strong> (nhị phân/hex, bù 2, IEEE 754) → <strong>logic số &amp; mạch</strong> (cổng, Boole, flip-flop) → <strong>tập lệnh ISA</strong> (RISC/CISC, assembly MIPS) → <strong>số học máy tính</strong> (ALU, tràn số) → <strong>datapath &amp; control</strong> (fetch-decode-execute) → <strong>pipeline</strong> (hazard, forwarding) → <strong>phân cấp bộ nhớ &amp; cache</strong> → <strong>vào/ra, ngắt, DMA &amp; định luật Amdahl</strong>. Bám sách chuẩn (Patterson &amp; Hennessy, Tanenbaum, Stallings), song ngữ, có ví dụ và quiz mỗi chương.',
    whatYouLearn: 'Mô hình von Neumann; hệ nhị phân/hex, số bù 2, IEEE 754; cổng logic &amp; đại số Boole, mạch tổ hợp/tuần tự &amp; flip-flop; ISA, RISC vs CISC, assembly MIPS/x86 &amp; addressing modes; ALU, cộng/trừ/nhân/chia nhị phân &amp; tràn số; datapath &amp; control unit, chu kỳ fetch-decode-execute; pipeline, hazard &amp; forwarding; phân cấp bộ nhớ, cache (locality, mapping, hit/miss); vào/ra, bus, ngắt, DMA; đo hiệu năng &amp; định luật Amdahl.',
    requirements: 'Toán rời rạc cơ bản và biết một chút lập trình là đủ. Nên cài MARS (mô phỏng MIPS) và Logisim để thực hành assembly &amp; mạch logic.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách chuẩn, nand2tetris, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Kiến trúc vs tổ chức; mô hình von Neumann; lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Biểu diễn dữ liệu|||Chapter 1 — Data representation', description: 'Nhị phân/hex, số bù 2, IEEE 754.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Logic số & mạch|||Chapter 2 — Digital logic', description: 'Cổng logic, Boole, tổ hợp/tuần tự, flip-flop.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Tập lệnh (ISA)|||Chapter 3 — Instruction set', description: 'RISC vs CISC, assembly MIPS, addressing modes.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Số học máy tính|||Chapter 4 — Computer arithmetic', description: 'ALU, cộng/trừ/nhân/chia, tràn số.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Datapath & control|||Chapter 5 — Datapath & control', description: 'Datapath, control unit, fetch-decode-execute.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Pipeline|||Chapter 6 — Pipelining', description: 'Pipelining, hazard, forwarding, tăng tốc.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Phân cấp bộ nhớ|||Chapter 7 — Memory hierarchy', description: 'Cache, locality, mapping, hit/miss.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Vào/ra & hệ thống|||Chapter 8 — I/O & system', description: 'I/O, bus, interrupt, DMA, Amdahl.', lessons: [c8, c8q] },
  ],
};
