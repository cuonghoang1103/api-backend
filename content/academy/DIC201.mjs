/**
 * DIC201 — Digital Circuits (Mạch số / Kỹ thuật số). Ngành Thiết kế vi mạch
 * bán dẫn FPTU, Kỳ 3. KHUNG chất lượng — 8 chương, song ngữ + bảng chân trị +
 * ví dụ + quiz. Sách chuẩn: Mano "Digital Design", Wakerly "Digital Design:
 * Principles and Practices", Floyd "Digital Fundamentals".
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick lồng/${; "&"→&amp; ; "<"→&lt;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('dic201-0-1-overview', 'Course overview: Digital Circuits|||Tổng quan: Kỹ thuật số',
  'Kỹ thuật số là gì; tín hiệu 0/1, mức logic; lộ trình: hệ đếm & mã → Boole & cổng → tối giản → tổ hợp → tuần tự → thanh ghi/đếm → máy trạng thái → bộ nhớ & FPGA/Verilog.',
  [[
    `<span class="eyebrow">DIC201 · Lesson 0.1 · Overview</span>
<h2>Digital Circuits</h2>
<p class="lead">This course teaches how <strong>digital systems</strong> represent, process and store information using only two levels — <strong>0</strong> and <strong>1</strong>. It is the foundation under every CPU, memory chip and FPGA, and the entry point to the <strong>semiconductor / IC-design</strong> track.</p>
<h3>Why only 0 and 1?</h3>
<p>A digital signal takes one of two well-defined levels — <strong>LOW (0)</strong> and <strong>HIGH (1)</strong> — instead of a continuous analog value. This makes circuits <strong>noise-immune</strong> (a slightly disturbed level still reads as 0 or 1) and easy to reason about with <strong>Boolean logic</strong>.</p>
<h3>Roadmap</h3>
<p>Number systems &amp; codes → Boolean algebra &amp; logic gates → logic minimization (Karnaugh maps) → combinational circuits (adders, MUX, decoders) → sequential circuits (latches, flip-flops) → registers &amp; counters → finite state machines → memory &amp; programmable logic (ROM/RAM, FPGA, intro Verilog). Bilingual, with truth tables, worked examples and a quiz per chapter.</p>`,
    `<span class="eyebrow">DIC201 · Bài 0.1 · Tổng quan</span>
<h2>Kỹ thuật số (Mạch số)</h2>
<p class="lead">Môn này dạy cách các <strong>hệ thống số</strong> biểu diễn, xử lý và lưu trữ thông tin chỉ bằng hai mức — <strong>0</strong> và <strong>1</strong>. Đây là nền của mọi CPU, chip nhớ và FPGA, và là cửa vào ngành <strong>bán dẫn / thiết kế vi mạch</strong>.</p>
<h3>Vì sao chỉ 0 và 1?</h3>
<p>Tín hiệu số nhận một trong hai mức xác định rõ — <strong>THẤP (0)</strong> và <strong>CAO (1)</strong> — thay vì một giá trị analog liên tục. Nhờ đó mạch <strong>miễn nhiễu tốt</strong> (mức bị nhiễu nhẹ vẫn đọc là 0 hoặc 1) và dễ suy luận bằng <strong>đại số Boole</strong>.</p>
<h3>Lộ trình</h3>
<p>Hệ đếm &amp; mã → đại số Boole &amp; cổng logic → tối giản hàm (bìa Karnaugh) → mạch tổ hợp (cộng, MUX, giải mã) → mạch tuần tự (latch, flip-flop) → thanh ghi &amp; bộ đếm → máy trạng thái → bộ nhớ &amp; logic khả trình (ROM/RAM, FPGA, nhập môn Verilog). Song ngữ, có bảng chân trị, ví dụ mẫu và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('dic201-1-1-number-systems', '1.1 — Number systems & codes|||1.1 — Hệ đếm & mã',
  'Nhị phân/octal/hex, đổi cơ số; số có dấu & bù 2; các mã BCD, Gray, ASCII.',
  [[
    `<span class="eyebrow">DIC201 · Chapter 1 · Lesson 1.1</span>
<h2>Number systems &amp; codes</h2>
<h3>Bases</h3>
<ul>
<li><strong>Binary (base 2)</strong> — digits 0,1. Each position is a power of 2. Native language of digital hardware.</li>
<li><strong>Octal (base 8)</strong> and <strong>Hexadecimal (base 16)</strong> — compact shorthand for binary: 1 hex digit = 4 bits, 1 octal digit = 3 bits.</li>
</ul>
<pre><code>1011 (bin) = 8 + 0 + 2 + 1 = 11 (dec) = B (hex) = 13 (oct)
Group by 4: 1011 -> B ;  by 3: 001 011 -> 1 3</code></pre>
<h3>Signed numbers &amp; two's complement</h3>
<p>To store negative numbers, hardware uses <strong>two's complement</strong>: invert every bit, then add 1. The most-significant bit becomes the sign (0 = +, 1 = −). Subtraction turns into addition — one adder handles both.</p>
<pre><code>+5 (4-bit)  = 0101
invert      = 1010
+1          = 1011  -> this is -5
Check: 0101 + 1011 = 10000 -> drop carry -> 0000 = 0  OK</code></pre>
<h3>Codes</h3>
<ul>
<li><strong>BCD</strong> — each decimal digit as its own 4-bit binary (9 = 1001); easy for displays.</li>
<li><strong>Gray code</strong> — only <em>one bit</em> changes between neighbours (00,01,11,10); avoids glitches in encoders.</li>
<li><strong>ASCII</strong> — maps characters to 7/8-bit codes (A = 65 = 0x41).</li>
</ul>
<div class="callout"><span class="badge">Key idea</span> Everything — numbers, text, images — is ultimately a pattern of bits; the <em>code</em> is the agreed meaning of that pattern.</div>`,
    `<span class="eyebrow">DIC201 · Chương 1 · Bài 1.1</span>
<h2>Hệ đếm &amp; mã</h2>
<h3>Các cơ số</h3>
<ul>
<li><strong>Nhị phân (cơ số 2)</strong> — chữ số 0,1. Mỗi vị trí là một luỹ thừa của 2. Ngôn ngữ gốc của phần cứng số.</li>
<li><strong>Bát phân (cơ số 8)</strong> và <strong>thập lục (cơ số 16)</strong> — viết gọn cho nhị phân: 1 chữ hex = 4 bit, 1 chữ octal = 3 bit.</li>
</ul>
<pre><code>1011 (nhị phân) = 8 + 0 + 2 + 1 = 11 (thập phân) = B (hex) = 13 (octal)
Nhóm 4 bit: 1011 -> B ;  nhóm 3 bit: 001 011 -> 1 3</code></pre>
<h3>Số có dấu &amp; bù 2</h3>
<p>Để lưu số âm, phần cứng dùng <strong>bù 2</strong>: đảo mọi bit rồi cộng 1. Bit cao nhất thành bit dấu (0 = +, 1 = −). Phép trừ biến thành phép cộng — một bộ cộng làm được cả hai.</p>
<pre><code>+5 (4 bit)  = 0101
đảo bit     = 1010
+1          = 1011  -> đây là -5
Kiểm: 0101 + 1011 = 10000 -> bỏ nhớ -> 0000 = 0  ĐÚNG</code></pre>
<h3>Các mã</h3>
<ul>
<li><strong>BCD</strong> — mỗi chữ số thập phân là 4 bit nhị phân riêng (9 = 1001); tiện cho màn hình.</li>
<li><strong>Mã Gray</strong> — chỉ <em>một bit</em> đổi giữa hai giá trị kề (00,01,11,10); tránh nhiễu trong encoder.</li>
<li><strong>ASCII</strong> — ánh xạ ký tự sang mã 7/8 bit (A = 65 = 0x41).</li>
</ul>
<div class="callout"><span class="badge">Ý chính</span> Mọi thứ — số, chữ, ảnh — rốt cuộc là một mẫu bit; <em>mã</em> là ý nghĩa đã thống nhất của mẫu bit đó.</div>`,
  ]]);

const c1q = quiz('dic201-quiz-1', 'Quiz 1 — Number systems & codes|||Quiz 1 — Hệ đếm & mã', [
  { id: 'q1', question: 'Số nhị phân 1011 bằng bao nhiêu ở hệ thập phân?', options: ['9', '11', '13', '15'], correctIndex: 1, explanation: '8 + 0 + 2 + 1 = 11.' },
  { id: 'q2', question: 'Biểu diễn bù 2 của −5 trên 4 bit là?', options: ['0101', '1010', '1011', '1101'], correctIndex: 2, explanation: 'Đảo 0101 -> 1010, cộng 1 -> 1011.' },
  { id: 'q3', question: 'Mã mà chỉ MỘT bit thay đổi giữa hai giá trị kề nhau là?', options: ['BCD', 'ASCII', 'Mã Gray', 'Hex'], correctIndex: 2, explanation: 'Mã Gray đổi đúng một bit mỗi bước → tránh glitch.' },
]);

const c2 = doc('dic201-2-1-boolean-gates', '2.1 — Boolean algebra & logic gates|||2.1 — Đại số Boole & cổng logic',
  'Cổng AND/OR/NOT/NAND/NOR/XOR & bảng chân trị; định lý De Morgan; biểu thức Boole & rút gọn.',
  [[
    `<span class="eyebrow">DIC201 · Chapter 2 · Lesson 2.1</span>
<h2>Boolean algebra &amp; logic gates</h2>
<h3>The gates</h3>
<pre><code>A B | AND OR XOR | NAND NOR XNOR
0 0 |  0   0   0 |   1    1    1
0 1 |  0   1   1 |   1    0    0
1 0 |  0   1   1 |   1    0    0
1 1 |  1   1   0 |   0    0    1
NOT: NOT 0 = 1, NOT 1 = 0</code></pre>
<ul>
<li><strong>AND</strong> = 1 only when all inputs are 1. <strong>OR</strong> = 1 when any input is 1. <strong>NOT</strong> inverts.</li>
<li><strong>NAND / NOR</strong> are "universal" — any circuit can be built from NAND-only or NOR-only gates.</li>
<li><strong>XOR</strong> = 1 when inputs differ (the core of adders and parity).</li>
</ul>
<h3>De Morgan's theorems</h3>
<pre><code>NOT(A AND B) = (NOT A) OR  (NOT B)
NOT(A OR  B) = (NOT A) AND (NOT B)</code></pre>
<p>De Morgan lets you swap AND ↔ OR by pushing an inversion across — the key to converting any expression to NAND/NOR form for real chips.</p>
<h3>Boolean laws</h3>
<p>Identity (A·1 = A, A+0 = A), null (A·0 = 0, A+1 = 1), idempotent (A·A = A), complement (A·A' = 0), distributive (A·(B+C) = A·B + A·C). These laws let you <strong>simplify</strong> an expression before drawing gates.</p>
<div class="callout"><span class="badge">Universal gate</span> Give an engineer only NAND gates and they can build the entire computer — AND, OR, NOT all reduce to NAND.</div>`,
    `<span class="eyebrow">DIC201 · Chương 2 · Bài 2.1</span>
<h2>Đại số Boole &amp; cổng logic</h2>
<h3>Các cổng</h3>
<pre><code>A B | AND OR XOR | NAND NOR XNOR
0 0 |  0   0   0 |   1    1    1
0 1 |  0   1   1 |   1    0    0
1 0 |  0   1   1 |   1    0    0
1 1 |  1   1   0 |   0    0    1
NOT: NOT 0 = 1, NOT 1 = 0</code></pre>
<ul>
<li><strong>AND</strong> = 1 chỉ khi mọi ngõ vào là 1. <strong>OR</strong> = 1 khi có ít nhất một ngõ vào là 1. <strong>NOT</strong> đảo.</li>
<li><strong>NAND / NOR</strong> là cổng "vạn năng" — mọi mạch đều dựng được chỉ từ NAND hoặc chỉ từ NOR.</li>
<li><strong>XOR</strong> = 1 khi hai ngõ vào KHÁC nhau (lõi của bộ cộng và kiểm chẵn lẻ).</li>
</ul>
<h3>Định lý De Morgan</h3>
<pre><code>NOT(A AND B) = (NOT A) OR  (NOT B)
NOT(A OR  B) = (NOT A) AND (NOT B)</code></pre>
<p>De Morgan cho phép đổi AND ↔ OR bằng cách đẩy dấu đảo qua — chìa khoá để chuyển mọi biểu thức về dạng NAND/NOR cho chip thật.</p>
<h3>Các định luật Boole</h3>
<p>Đồng nhất (A·1 = A, A+0 = A), triệt (A·0 = 0, A+1 = 1), luỹ đẳng (A·A = A), bù (A·A' = 0), phân phối (A·(B+C) = A·B + A·C). Các định luật này giúp <strong>rút gọn</strong> biểu thức trước khi vẽ cổng.</p>
<div class="callout"><span class="badge">Cổng vạn năng</span> Chỉ đưa cho kỹ sư cổng NAND, họ vẫn dựng được cả máy tính — AND, OR, NOT đều quy về NAND.</div>`,
  ]]);

const c2q = quiz('dic201-quiz-2', 'Quiz 2 — Boolean & gates|||Quiz 2 — Boole & cổng', [
  { id: 'q1', question: 'Cổng XOR cho ngõ ra 1 khi nào?', options: ['Hai ngõ vào bằng nhau', 'Hai ngõ vào khác nhau', 'Cả hai bằng 1', 'Cả hai bằng 0'], correctIndex: 1, explanation: 'XOR = 1 khi hai ngõ vào khác nhau.' },
  { id: 'q2', question: 'Theo De Morgan, NOT(A AND B) bằng?', options: ['(NOT A) AND (NOT B)', '(NOT A) OR (NOT B)', 'A OR B', 'NOT A AND B'], correctIndex: 1, explanation: 'NOT(A·B) = A\' + B\'.' },
  { id: 'q3', question: 'Cổng nào được gọi là "vạn năng" (dựng được mọi cổng khác)?', options: ['XOR', 'NAND', 'AND', 'Buffer'], correctIndex: 1, explanation: 'NAND (và NOR) là cổng vạn năng.' },
]);

const c3 = doc('dic201-3-1-minimization', '3.1 — Logic minimization|||3.1 — Tối giản hàm logic',
  'Bảng chân trị → biểu thức; dạng chuẩn SOP/POS; bìa Karnaugh (gom nhóm 2^n, don\'t-care).',
  [[
    `<span class="eyebrow">DIC201 · Chapter 3 · Lesson 3.1</span>
<h2>Logic minimization</h2>
<h3>From truth table to expression</h3>
<p>A <strong>truth table</strong> lists the output for every input combination. Two canonical forms read directly off it:</p>
<ul>
<li><strong>SOP (Sum of Products)</strong> — OR together the rows where output = 1 (minterms).</li>
<li><strong>POS (Product of Sums)</strong> — AND together the rows where output = 0 (maxterms).</li>
</ul>
<h3>Karnaugh map (K-map)</h3>
<p>A K-map re-plots the truth table so that <strong>adjacent cells differ by one bit</strong> (Gray-code order). Group 1s into rectangles of size 1,2,4,8… — each group drops one variable. Bigger groups = simpler expression.</p>
<pre><code>F(A,B) 2-var K-map:        B=0  B=1
                    A=0     1    1
                    A=1     0    1
Group top row (A=0) -> A'
Group right col (B=1) -> B
F = A' + B   (2 gates instead of listing 3 minterms)</code></pre>
<ul>
<li>Groups may <strong>wrap</strong> around edges, and may overlap.</li>
<li><strong>Don't-care (X)</strong> outputs can be treated as 0 or 1 — pick whatever makes bigger groups.</li>
</ul>
<div class="callout"><span class="badge">Why minimize</span> Fewer gates means less silicon area, less power and less delay — the whole point of digital design before you commit to hardware.</div>`,
    `<span class="eyebrow">DIC201 · Chương 3 · Bài 3.1</span>
<h2>Tối giản hàm logic</h2>
<h3>Từ bảng chân trị sang biểu thức</h3>
<p>Một <strong>bảng chân trị</strong> liệt kê ngõ ra cho mọi tổ hợp ngõ vào. Đọc thẳng ra hai dạng chuẩn:</p>
<ul>
<li><strong>SOP (tổng các tích)</strong> — OR các hàng có ngõ ra = 1 (minterm).</li>
<li><strong>POS (tích các tổng)</strong> — AND các hàng có ngõ ra = 0 (maxterm).</li>
</ul>
<h3>Bìa Karnaugh (K-map)</h3>
<p>Bìa K vẽ lại bảng chân trị sao cho <strong>ô kề nhau chỉ khác một bit</strong> (thứ tự mã Gray). Gom các số 1 thành hình chữ nhật kích thước 1,2,4,8… — mỗi nhóm bỏ được một biến. Nhóm càng lớn, biểu thức càng gọn.</p>
<pre><code>F(A,B) bìa K 2 biến:       B=0  B=1
                    A=0     1    1
                    A=1     0    1
Gom hàng trên (A=0) -> A'
Gom cột phải (B=1) -> B
F = A' + B   (2 cổng thay vì liệt kê 3 minterm)</code></pre>
<ul>
<li>Nhóm có thể <strong>vòng qua mép</strong> và có thể chồng lên nhau.</li>
<li>Ô <strong>don't-care (X)</strong> được coi là 0 hay 1 tuỳ ý — chọn sao cho nhóm to hơn.</li>
</ul>
<div class="callout"><span class="badge">Vì sao tối giản</span> Ít cổng hơn nghĩa là ít diện tích silic, ít điện năng và ít trễ — chính là mục tiêu của thiết kế số trước khi làm phần cứng.</div>`,
  ]]);

const c3q = quiz('dic201-quiz-3', 'Quiz 3 — Minimization|||Quiz 3 — Tối giản', [
  { id: 'q1', question: 'Dạng SOP (tổng các tích) được lập từ các hàng có ngõ ra bằng?', options: ['0 (maxterm)', '1 (minterm)', 'X (don\'t-care)', 'Bất kỳ'], correctIndex: 1, explanation: 'SOP = OR các minterm (hàng ngõ ra = 1).' },
  { id: 'q2', question: 'Trong bìa Karnaugh, hai ô kề nhau khác nhau bao nhiêu bit?', options: ['0 bit', 'Đúng 1 bit', '2 bit', 'Tuỳ vị trí'], correctIndex: 1, explanation: 'Ô kề trong K-map theo thứ tự Gray → khác đúng 1 bit.' },
  { id: 'q3', question: 'Ô "don\'t-care" (X) trong bìa K được dùng thế nào?', options: ['Luôn coi là 0', 'Luôn coi là 1', 'Coi là 0 hay 1 tuỳ chọn để nhóm to hơn', 'Bỏ khỏi bảng'], correctIndex: 2, explanation: 'Chọn X = 0 hoặc 1 sao cho nhóm lớn nhất.' },
]);

const c4 = doc('dic201-4-1-combinational', '4.1 — Combinational circuits|||4.1 — Mạch tổ hợp',
  'Bộ cộng/trừ (half/full adder), MUX/DEMUX, encoder/decoder, bộ so sánh (comparator).',
  [[
    `<span class="eyebrow">DIC201 · Chapter 4 · Lesson 4.1</span>
<h2>Combinational circuits</h2>
<p class="lead">In a <strong>combinational</strong> circuit the output depends <em>only</em> on the current inputs — no memory. These are the standard building blocks.</p>
<h3>Adders</h3>
<pre><code>Half adder:  Sum = A XOR B,  Carry = A AND B
Full adder:  adds A, B, Cin -> Sum, Cout
A B Cin | Sum Cout
0 0  0  |  0   0
0 1  0  |  1   0
1 1  0  |  0   1
1 1  1  |  1   1</code></pre>
<p>Chain full adders to add multi-bit numbers (ripple-carry adder).</p>
<h3>MUX / DEMUX</h3>
<ul>
<li><strong>Multiplexer (MUX)</strong> — selects 1 of many inputs onto a single output, chosen by select lines (a data "switch").</li>
<li><strong>Demultiplexer (DEMUX)</strong> — routes one input to 1 of many outputs.</li>
</ul>
<h3>Encoder / decoder / comparator</h3>
<ul>
<li><strong>Decoder</strong> — n inputs activate 1 of 2^n outputs (address → select line; drives memory, displays).</li>
<li><strong>Encoder</strong> — the reverse: one active line → its binary code.</li>
<li><strong>Comparator</strong> — outputs whether A &gt; B, A = B, or A &lt; B.</li>
</ul>
<div class="callout"><span class="badge">Reuse blocks</span> Real designs are assembled from these standard blocks — you rarely wire gates one by one.</div>`,
    `<span class="eyebrow">DIC201 · Chương 4 · Bài 4.1</span>
<h2>Mạch tổ hợp</h2>
<p class="lead">Trong mạch <strong>tổ hợp</strong>, ngõ ra <em>chỉ</em> phụ thuộc ngõ vào hiện tại — không có nhớ. Đây là các khối chuẩn.</p>
<h3>Bộ cộng</h3>
<pre><code>Cộng bán phần:  Sum = A XOR B,  Carry = A AND B
Cộng đầy đủ:    cộng A, B, Cin -> Sum, Cout
A B Cin | Sum Cout
0 0  0  |  0   0
0 1  0  |  1   0
1 1  0  |  0   1
1 1  1  |  1   1</code></pre>
<p>Nối chuỗi bộ cộng đầy đủ để cộng số nhiều bit (bộ cộng nối tiếp nhớ - ripple carry).</p>
<h3>MUX / DEMUX</h3>
<ul>
<li><strong>Bộ dồn kênh (MUX)</strong> — chọn 1 trong nhiều ngõ vào ra một ngõ ra duy nhất, theo đường chọn (một "công tắc" dữ liệu).</li>
<li><strong>Bộ phân kênh (DEMUX)</strong> — dẫn một ngõ vào tới 1 trong nhiều ngõ ra.</li>
</ul>
<h3>Encoder / decoder / bộ so sánh</h3>
<ul>
<li><strong>Bộ giải mã (decoder)</strong> — n ngõ vào kích hoạt 1 trong 2^n ngõ ra (địa chỉ → đường chọn; điều khiển bộ nhớ, màn hình).</li>
<li><strong>Bộ mã hoá (encoder)</strong> — ngược lại: một đường đang tích cực → mã nhị phân của nó.</li>
<li><strong>Bộ so sánh</strong> — cho biết A &gt; B, A = B hay A &lt; B.</li>
</ul>
<div class="callout"><span class="badge">Dùng lại khối</span> Thiết kế thật ghép từ các khối chuẩn này — hiếm khi phải nối từng cổng một.</div>`,
  ]]);

const c4q = quiz('dic201-quiz-4', 'Quiz 4 — Combinational|||Quiz 4 — Mạch tổ hợp', [
  { id: 'q1', question: 'Trong bộ cộng bán phần (half adder), bit tổng Sum bằng?', options: ['A AND B', 'A OR B', 'A XOR B', 'NOT A'], correctIndex: 2, explanation: 'Sum = A XOR B; Carry = A AND B.' },
  { id: 'q2', question: 'Khối chọn 1 trong nhiều ngõ vào ra một ngõ ra duy nhất là?', options: ['Decoder', 'Multiplexer (MUX)', 'Comparator', 'Encoder'], correctIndex: 1, explanation: 'MUX dồn nhiều ngõ vào về một ngõ ra theo đường chọn.' },
  { id: 'q3', question: 'Bộ giải mã (decoder) với n ngõ vào kích hoạt bao nhiêu ngõ ra?', options: ['n', '2n', '2^n', 'n^2'], correctIndex: 2, explanation: 'n ngõ vào → 1 trong 2^n ngõ ra tích cực.' },
]);

const c5 = doc('dic201-5-1-sequential', '5.1 — Sequential circuits: latches & flip-flops|||5.1 — Mạch tuần tự: latch & flip-flop',
  'Khác biệt tổ hợp/tuần tự; latch SR; flip-flop SR/D/JK/T; xung nhịp (clock) & cạnh.',
  [[
    `<span class="eyebrow">DIC201 · Chapter 5 · Lesson 5.1</span>
<h2>Sequential circuits: latches &amp; flip-flops</h2>
<p class="lead">A <strong>sequential</strong> circuit's output depends on the inputs <em>and</em> on stored state — it has <strong>memory</strong>. The 1-bit memory cell is the latch / flip-flop.</p>
<h3>SR latch</h3>
<pre><code>S R | Q (next)
0 0 | Q  (hold - remembers)
0 1 | 0  (reset)
1 0 | 1  (set)
1 1 | invalid (forbidden)</code></pre>
<h3>Clock: level vs edge</h3>
<p>A <strong>latch</strong> is level-sensitive (transparent while the enable is high). A <strong>flip-flop</strong> is edge-triggered — it samples its input only on the rising (or falling) <strong>clock edge</strong>, which keeps a whole system in lock-step.</p>
<h3>Flip-flop types</h3>
<ul>
<li><strong>D flip-flop</strong> — Q follows D at the clock edge (the workhorse storage bit).</li>
<li><strong>JK flip-flop</strong> — like SR but J=K=1 <em>toggles</em> (no forbidden state).</li>
<li><strong>T flip-flop</strong> — T=1 toggles, T=0 holds (used in counters).</li>
</ul>
<pre><code>D FF:  Qnext = D
T FF:  Qnext = Q XOR T
JK :   J K -> 0 0 hold, 0 1 reset, 1 0 set, 1 1 toggle</code></pre>
<div class="callout"><span class="badge">One bit of memory</span> Every register, counter and RAM cell is built from flip-flops — this is where "state" enters digital systems.</div>`,
    `<span class="eyebrow">DIC201 · Chương 5 · Bài 5.1</span>
<h2>Mạch tuần tự: latch &amp; flip-flop</h2>
<p class="lead">Ngõ ra của mạch <strong>tuần tự</strong> phụ thuộc ngõ vào <em>và</em> trạng thái đã lưu — nó có <strong>nhớ</strong>. Ô nhớ 1 bit chính là latch / flip-flop.</p>
<h3>Latch SR</h3>
<pre><code>S R | Q (kế tiếp)
0 0 | Q  (giữ - nhớ)
0 1 | 0  (xoá - reset)
1 0 | 1  (đặt - set)
1 1 | cấm (không hợp lệ)</code></pre>
<h3>Xung nhịp: theo mức hay theo cạnh</h3>
<p><strong>Latch</strong> nhạy theo mức (trong suốt khi enable ở mức cao). <strong>Flip-flop</strong> kích theo cạnh — chỉ lấy mẫu ngõ vào tại <strong>cạnh xung nhịp</strong> lên (hoặc xuống), giữ cả hệ thống chạy đồng bộ.</p>
<h3>Các loại flip-flop</h3>
<ul>
<li><strong>D flip-flop</strong> — Q bám theo D tại cạnh nhịp (bit lưu trữ chủ lực).</li>
<li><strong>JK flip-flop</strong> — giống SR nhưng J=K=1 thì <em>đảo</em> (không có trạng thái cấm).</li>
<li><strong>T flip-flop</strong> — T=1 đảo, T=0 giữ (dùng trong bộ đếm).</li>
</ul>
<pre><code>D FF:  Qkế = D
T FF:  Qkế = Q XOR T
JK :   J K -> 0 0 giữ, 0 1 xoá, 1 0 đặt, 1 1 đảo</code></pre>
<div class="callout"><span class="badge">Một bit nhớ</span> Mọi thanh ghi, bộ đếm và ô RAM đều dựng từ flip-flop — đây là nơi "trạng thái" bước vào hệ thống số.</div>`,
  ]]);

const c5q = quiz('dic201-quiz-5', 'Quiz 5 — Latches & flip-flops|||Quiz 5 — Latch & flip-flop', [
  { id: 'q1', question: 'Điểm khác biệt cốt lõi của mạch tuần tự so với mạch tổ hợp là?', options: ['Nhanh hơn', 'Có nhớ (phụ thuộc trạng thái)', 'Không cần cổng logic', 'Chỉ dùng 1 bit'], correctIndex: 1, explanation: 'Mạch tuần tự có nhớ; ngõ ra phụ thuộc cả trạng thái đã lưu.' },
  { id: 'q2', question: 'Ở latch SR, tổ hợp ngõ vào nào bị coi là cấm (không hợp lệ)?', options: ['S=0, R=0', 'S=1, R=0', 'S=0, R=1', 'S=1, R=1'], correctIndex: 3, explanation: 'S=R=1 là trạng thái cấm của latch SR.' },
  { id: 'q3', question: 'Flip-flop nào có Qkế = D tại cạnh xung nhịp?', options: ['D flip-flop', 'T flip-flop', 'JK flip-flop', 'SR latch'], correctIndex: 0, explanation: 'D flip-flop: Q bám theo D tại cạnh nhịp.' },
]);

const c6 = doc('dic201-6-1-registers-counters', '6.1 — Registers & counters|||6.1 — Thanh ghi & bộ đếm',
  'Thanh ghi (register) & thanh ghi dịch (shift register); bộ đếm đồng bộ vs không đồng bộ (ripple).',
  [[
    `<span class="eyebrow">DIC201 · Chapter 6 · Lesson 6.1</span>
<h2>Registers &amp; counters</h2>
<h3>Registers</h3>
<p>A <strong>register</strong> is a row of flip-flops that stores an n-bit word, all loaded on the same clock edge. It is the basic storage unit inside a CPU (data registers, program counter).</p>
<h3>Shift register</h3>
<p>A <strong>shift register</strong> passes each bit to its neighbour on every clock — used for serial ↔ parallel conversion, delays and simple pattern generators.</p>
<pre><code>Serial-in shift right (input 1):
clk0: 0000
clk1: 1000
clk2: 0100   (previous bit moved right, new bit enters left)
clk3: 0010</code></pre>
<h3>Counters</h3>
<ul>
<li><strong>Asynchronous (ripple) counter</strong> — each flip-flop clocks the next; simple but the ripple delay accumulates and can glitch.</li>
<li><strong>Synchronous counter</strong> — all flip-flops share one clock, so they change together — faster and glitch-free.</li>
</ul>
<pre><code>3-bit up counter: 000 -> 001 -> 010 -> 011 -> 100 -> ... -> 111 -> 000
Modulo-N counter resets after N counts (e.g. mod-10 for a decimal digit)</code></pre>
<div class="callout"><span class="badge">Prefer synchronous</span> A shared clock keeps every bit in step — that is why real designs are almost always synchronous.</div>`,
    `<span class="eyebrow">DIC201 · Chương 6 · Bài 6.1</span>
<h2>Thanh ghi &amp; bộ đếm</h2>
<h3>Thanh ghi</h3>
<p>Một <strong>thanh ghi</strong> là một hàng flip-flop lưu một từ n bit, nạp cùng lúc tại một cạnh nhịp. Đây là đơn vị lưu trữ cơ bản trong CPU (thanh ghi dữ liệu, bộ đếm chương trình).</p>
<h3>Thanh ghi dịch</h3>
<p>Một <strong>thanh ghi dịch</strong> chuyển mỗi bit sang ô kề tại mỗi nhịp — dùng để đổi nối tiếp ↔ song song, tạo trễ và sinh mẫu đơn giản.</p>
<pre><code>Vào nối tiếp, dịch phải (ngõ vào = 1):
clk0: 0000
clk1: 1000
clk2: 0100   (bit cũ dịch phải, bit mới vào từ trái)
clk3: 0010</code></pre>
<h3>Bộ đếm</h3>
<ul>
<li><strong>Bộ đếm không đồng bộ (ripple)</strong> — mỗi flip-flop cấp nhịp cho cái kế; đơn giản nhưng trễ dồn lại và có thể glitch.</li>
<li><strong>Bộ đếm đồng bộ</strong> — mọi flip-flop dùng chung một nhịp, đổi cùng lúc — nhanh hơn và không glitch.</li>
</ul>
<pre><code>Bộ đếm lên 3 bit: 000 -> 001 -> 010 -> 011 -> 100 -> ... -> 111 -> 000
Bộ đếm modulo-N reset sau N nhịp (vd mod-10 cho một chữ số thập phân)</code></pre>
<div class="callout"><span class="badge">Ưu tiên đồng bộ</span> Một nhịp chung giữ mọi bit cùng bước — vì thế thiết kế thật gần như luôn là đồng bộ.</div>`,
  ]]);

const c6q = quiz('dic201-quiz-6', 'Quiz 6 — Registers & counters|||Quiz 6 — Thanh ghi & bộ đếm', [
  { id: 'q1', question: 'Một thanh ghi (register) n bit về cơ bản là?', options: ['Một cổng AND lớn', 'Một hàng n flip-flop', 'Một bộ giải mã', 'Một bộ so sánh'], correctIndex: 1, explanation: 'Register = hàng flip-flop lưu n bit, nạp cùng cạnh nhịp.' },
  { id: 'q2', question: 'Thanh ghi dịch (shift register) chủ yếu dùng để?', options: ['Cộng số', 'Đổi nối tiếp ↔ song song', 'So sánh hai số', 'Tạo xung nhịp'], correctIndex: 1, explanation: 'Shift register dịch bit mỗi nhịp → đổi serial/parallel, tạo trễ.' },
  { id: 'q3', question: 'Ưu điểm của bộ đếm đồng bộ so với không đồng bộ (ripple) là?', options: ['Ít flip-flop hơn', 'Mọi bit đổi cùng lúc, không glitch', 'Không cần xung nhịp', 'Chỉ đếm lên'], correctIndex: 1, explanation: 'Đồng bộ dùng chung nhịp → đổi đồng thời, nhanh, không glitch tích luỹ.' },
]);

const c7 = doc('dic201-7-1-fsm', '7.1 — Finite state machines|||7.1 — Máy trạng thái',
  'FSM, sơ đồ trạng thái; Mealy vs Moore; quy trình thiết kế mạch tuần tự (state → mã hoá → next-state).',
  [[
    `<span class="eyebrow">DIC201 · Chapter 7 · Lesson 7.1</span>
<h2>Finite state machines (FSM)</h2>
<p class="lead">An <strong>FSM</strong> is a circuit that moves through a finite set of <strong>states</strong>, deciding the next state from the current state plus the inputs. It is the standard way to design any controller.</p>
<h3>The three parts</h3>
<ul>
<li><strong>State register</strong> — flip-flops holding the current state.</li>
<li><strong>Next-state logic</strong> — combinational logic: (current state, inputs) → next state.</li>
<li><strong>Output logic</strong> — produces the outputs.</li>
</ul>
<h3>Moore vs Mealy</h3>
<ul>
<li><strong>Moore</strong> — output depends on the <em>state only</em>; outputs are stable, change one clock after the input.</li>
<li><strong>Mealy</strong> — output depends on <em>state and inputs</em>; reacts faster but can react to input glitches, and usually needs fewer states.</li>
</ul>
<pre><code>State diagram (traffic light, Moore):
 [GREEN] --timer--> [YELLOW] --timer--> [RED] --timer--> [GREEN]
 output = the light color, decided by the state itself</code></pre>
<h3>Design steps</h3>
<p>1) Draw the state diagram → 2) build the state table → 3) assign a binary code to each state → 4) derive next-state and output equations (K-maps) → 5) implement with flip-flops + gates.</p>
<div class="callout"><span class="badge">Controllers = FSMs</span> Vending machines, protocol handlers, CPU control units — all are finite state machines at heart.</div>`,
    `<span class="eyebrow">DIC201 · Chương 7 · Bài 7.1</span>
<h2>Máy trạng thái (FSM)</h2>
<p class="lead">Một <strong>FSM</strong> là mạch di chuyển qua một tập hữu hạn các <strong>trạng thái</strong>, quyết định trạng thái kế từ trạng thái hiện tại cộng ngõ vào. Đây là cách chuẩn để thiết kế mọi bộ điều khiển.</p>
<h3>Ba phần</h3>
<ul>
<li><strong>Thanh ghi trạng thái</strong> — flip-flop giữ trạng thái hiện tại.</li>
<li><strong>Logic trạng thái kế</strong> — mạch tổ hợp: (trạng thái hiện tại, ngõ vào) → trạng thái kế.</li>
<li><strong>Logic ngõ ra</strong> — tạo ra ngõ ra.</li>
</ul>
<h3>Moore và Mealy</h3>
<ul>
<li><strong>Moore</strong> — ngõ ra chỉ phụ thuộc <em>trạng thái</em>; ngõ ra ổn định, đổi sau ngõ vào một nhịp.</li>
<li><strong>Mealy</strong> — ngõ ra phụ thuộc <em>trạng thái và ngõ vào</em>; phản ứng nhanh hơn nhưng có thể phản ứng theo glitch của ngõ vào, và thường cần ít trạng thái hơn.</li>
</ul>
<pre><code>Sơ đồ trạng thái (đèn giao thông, Moore):
 [XANH] --hết giờ--> [VÀNG] --hết giờ--> [ĐỎ] --hết giờ--> [XANH]
 ngõ ra = màu đèn, do chính trạng thái quyết định</code></pre>
<h3>Các bước thiết kế</h3>
<p>1) Vẽ sơ đồ trạng thái → 2) lập bảng trạng thái → 3) gán mã nhị phân cho mỗi trạng thái → 4) rút phương trình trạng thái kế và ngõ ra (K-map) → 5) hiện thực bằng flip-flop + cổng.</p>
<div class="callout"><span class="badge">Bộ điều khiển = FSM</span> Máy bán hàng, bộ xử lý giao thức, khối điều khiển CPU — về bản chất đều là máy trạng thái.</div>`,
  ]]);

const c7q = quiz('dic201-quiz-7', 'Quiz 7 — Finite state machines|||Quiz 7 — Máy trạng thái', [
  { id: 'q1', question: 'Trong máy Moore, ngõ ra phụ thuộc vào?', options: ['Chỉ ngõ vào', 'Chỉ trạng thái hiện tại', 'Cả trạng thái và ngõ vào', 'Xung nhịp'], correctIndex: 1, explanation: 'Moore: ngõ ra chỉ phụ thuộc trạng thái.' },
  { id: 'q2', question: 'Máy Mealy khác Moore ở chỗ ngõ ra còn phụ thuộc thêm?', options: ['Số flip-flop', 'Ngõ vào hiện tại', 'Tần số nhịp', 'Điện áp'], correctIndex: 1, explanation: 'Mealy: ngõ ra phụ thuộc cả trạng thái và ngõ vào.' },
  { id: 'q3', question: 'Phần nào của FSM giữ trạng thái hiện tại?', options: ['Logic trạng thái kế', 'Thanh ghi trạng thái (flip-flop)', 'Logic ngõ ra', 'Bộ giải mã'], correctIndex: 1, explanation: 'Thanh ghi trạng thái (các flip-flop) lưu trạng thái hiện tại.' },
]);

const c8 = doc('dic201-8-1-memory-pld', '8.1 — Memory & programmable logic|||8.1 — Bộ nhớ & logic khả trình',
  'ROM/RAM (SRAM/DRAM); PLD & FPGA tổng quan; nhập môn HDL Verilog (module, always).',
  [[
    `<span class="eyebrow">DIC201 · Chapter 8 · Lesson 8.1</span>
<h2>Memory &amp; programmable logic</h2>
<h3>Memory</h3>
<ul>
<li><strong>ROM</strong> — read-only, keeps data with power off (firmware, lookup tables). A decoder + fixed cells.</li>
<li><strong>RAM</strong> — read/write, loses data on power-off. <strong>SRAM</strong> (fast, flip-flop cells, caches) vs <strong>DRAM</strong> (dense, capacitor cells, needs refresh, main memory).</li>
</ul>
<pre><code>address --> [decoder] --> selects one row/word
data    <-> memory cells (n bits per word)
Capacity = 2^(address bits) words x (bits per word)</code></pre>
<h3>Programmable logic: PLD &amp; FPGA</h3>
<ul>
<li><strong>PLD</strong> (PLA/PAL/CPLD) — arrays of gates you program to a specific SOP function.</li>
<li><strong>FPGA</strong> — a grid of look-up tables (LUTs), flip-flops and routing you configure to become <em>any</em> digital circuit — the workhorse of IC prototyping and the semiconductor-design track.</li>
</ul>
<h3>Intro to Verilog (HDL)</h3>
<p>Instead of drawing gates, you <strong>describe</strong> hardware in a language and let tools synthesize it.</p>
<pre><code>module dff (input clk, input d, output reg q);
  always @(posedge clk)   // on the rising clock edge
    q &lt;= d;               // store d into q
endmodule</code></pre>
<div class="callout"><span class="badge">Where you are headed</span> Modern IC design is HDL (Verilog/VHDL) synthesized onto FPGAs or ASICs — this chapter is the doorway to the rest of the semiconductor curriculum.</div>`,
    `<span class="eyebrow">DIC201 · Chương 8 · Bài 8.1</span>
<h2>Bộ nhớ &amp; logic khả trình</h2>
<h3>Bộ nhớ</h3>
<ul>
<li><strong>ROM</strong> — chỉ đọc, giữ dữ liệu khi mất điện (firmware, bảng tra). Gồm một decoder + ô cố định.</li>
<li><strong>RAM</strong> — đọc/ghi, mất dữ liệu khi mất điện. <strong>SRAM</strong> (nhanh, ô flip-flop, cache) và <strong>DRAM</strong> (mật độ cao, ô tụ điện, cần làm tươi, bộ nhớ chính).</li>
</ul>
<pre><code>địa chỉ --> [decoder] --> chọn một hàng/từ
dữ liệu <-> các ô nhớ (n bit mỗi từ)
Dung lượng = 2^(số bit địa chỉ) từ x (số bit mỗi từ)</code></pre>
<h3>Logic khả trình: PLD &amp; FPGA</h3>
<ul>
<li><strong>PLD</strong> (PLA/PAL/CPLD) — mảng cổng bạn lập trình thành một hàm SOP cụ thể.</li>
<li><strong>FPGA</strong> — lưới các bảng tra (LUT), flip-flop và định tuyến, cấu hình để thành <em>bất kỳ</em> mạch số nào — chủ lực của việc dựng thử vi mạch và ngành thiết kế bán dẫn.</li>
</ul>
<h3>Nhập môn Verilog (HDL)</h3>
<p>Thay vì vẽ cổng, bạn <strong>mô tả</strong> phần cứng bằng ngôn ngữ và để công cụ tổng hợp ra mạch.</p>
<pre><code>module dff (input clk, input d, output reg q);
  always @(posedge clk)   // tại cạnh xung nhịp lên
    q &lt;= d;               // lưu d vào q
endmodule</code></pre>
<div class="callout"><span class="badge">Đích đến</span> Thiết kế vi mạch hiện đại là HDL (Verilog/VHDL) tổng hợp lên FPGA hoặc ASIC — chương này là cửa vào phần còn lại của khung bán dẫn.</div>`,
  ]]);

const c8q = quiz('dic201-quiz-8', 'Quiz 8 — Memory & programmable logic|||Quiz 8 — Bộ nhớ & logic khả trình', [
  { id: 'q1', question: 'Loại bộ nhớ nào GIỮ được dữ liệu khi mất điện?', options: ['SRAM', 'DRAM', 'ROM', 'Thanh ghi'], correctIndex: 2, explanation: 'ROM (chỉ đọc) giữ dữ liệu khi tắt nguồn; RAM thì mất.' },
  { id: 'q2', question: 'DRAM khác SRAM chủ yếu ở điểm nào?', options: ['DRAM dùng ô tụ điện, mật độ cao, cần làm tươi', 'DRAM nhanh hơn SRAM', 'DRAM giữ dữ liệu khi mất điện', 'DRAM chỉ đọc'], correctIndex: 0, explanation: 'DRAM ô tụ, dày đặc, cần refresh; SRAM ô flip-flop, nhanh.' },
  { id: 'q3', question: 'FPGA về bản chất là?', options: ['Một loại ROM cố định', 'Lưới LUT + flip-flop cấu hình thành mạch số bất kỳ', 'Một bộ vi xử lý cố định', 'Một cổng NAND lớn'], correctIndex: 1, explanation: 'FPGA gồm LUT, flip-flop, định tuyến cấu hình được → thành mạch số bất kỳ.' },
]);

const taiLieu = doc('dic201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn (Mano, Wakerly, Floyd), tài liệu miễn phí, YouTube, công cụ mô phỏng, lộ trình tự học 4 bước.',
  [[
    `<span class="eyebrow">DIC201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Digital Circuits — number systems, Boolean logic, combinational &amp; sequential design, state machines and FPGA/Verilog — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for DIC201 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://www.pearson.com/" target="_blank" rel="noopener">M. Morris Mano &amp; M. Ciletti — <em>Digital Design</em></a> (the standard course text)</li>
<li><a href="http://www.ddpp.com/" target="_blank" rel="noopener">John Wakerly — <em>Digital Design: Principles and Practices</em></a></li>
<li><a href="https://www.pearson.com/" target="_blank" rel="noopener">Thomas Floyd — <em>Digital Fundamentals</em></a></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.nandland.com/" target="_blank" rel="noopener">Nandland — FPGA &amp; digital logic tutorials</a></li>
<li><a href="https://www.allaboutcircuits.com/textbook/digital/" target="_blank" rel="noopener">All About Circuits — Digital textbook</a></li>
<li><a href="https://www.electronics-tutorials.ws/category/logic" target="_blank" rel="noopener">Electronics Tutorials — Logic gates &amp; circuits</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@BenEater" target="_blank" rel="noopener">Ben Eater</a> — build digital logic &amp; a CPU from gates</li>
<li><a href="https://www.youtube.com/@nandland" target="_blank" rel="noopener">Nandland Gate to VHDL</a> — FPGA &amp; HDL basics</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.falstad.com/circuit/" target="_blank" rel="noopener">Falstad Circuit Simulator</a> — animated logic-gate sim in the browser</li>
<li><a href="https://www.tinkercad.com/circuits" target="_blank" rel="noopener">Tinkercad Circuits</a> — breadboard &amp; digital logic</li>
<li><a href="https://edaplayground.com/" target="_blank" rel="noopener">EDA Playground</a> — write &amp; simulate Verilog online</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — number systems &amp; two's-complement, Boolean algebra, gates and De Morgan.</li>
<li><strong>Practice</strong> — minimize functions with K-maps and build them on Falstad until the truth table matches.</li>
<li><strong>Go deeper</strong> — combinational blocks (adders, MUX), flip-flops, counters and state machines.</li>
<li><strong>Job-ready</strong> — describe hardware in Verilog and simulate/synthesize it on an FPGA (EDA Playground).</li>
</ol></div>`,
    `<span class="eyebrow">DIC201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Kỹ thuật số — hệ đếm, logic Boole, thiết kế tổ hợp &amp; tuần tự, máy trạng thái và FPGA/Verilog — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của DIC201 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://www.pearson.com/" target="_blank" rel="noopener">M. Morris Mano &amp; M. Ciletti — <em>Digital Design</em></a> (sách chuẩn của môn)</li>
<li><a href="http://www.ddpp.com/" target="_blank" rel="noopener">John Wakerly — <em>Digital Design: Principles and Practices</em></a></li>
<li><a href="https://www.pearson.com/" target="_blank" rel="noopener">Thomas Floyd — <em>Digital Fundamentals</em></a></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.nandland.com/" target="_blank" rel="noopener">Nandland — hướng dẫn FPGA &amp; logic số</a></li>
<li><a href="https://www.allaboutcircuits.com/textbook/digital/" target="_blank" rel="noopener">All About Circuits — giáo trình phần Digital</a></li>
<li><a href="https://www.electronics-tutorials.ws/category/logic" target="_blank" rel="noopener">Electronics Tutorials — cổng logic &amp; mạch</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@BenEater" target="_blank" rel="noopener">Ben Eater</a> — dựng logic số &amp; một CPU từ cổng</li>
<li><a href="https://www.youtube.com/@nandland" target="_blank" rel="noopener">Nandland Gate to VHDL</a> — nền FPGA &amp; HDL</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.falstad.com/circuit/" target="_blank" rel="noopener">Falstad Circuit Simulator</a> — mô phỏng cổng logic động trên trình duyệt</li>
<li><a href="https://www.tinkercad.com/circuits" target="_blank" rel="noopener">Tinkercad Circuits</a> — breadboard &amp; logic số</li>
<li><a href="https://edaplayground.com/" target="_blank" rel="noopener">EDA Playground</a> — viết &amp; mô phỏng Verilog trực tuyến</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — hệ đếm &amp; bù 2, đại số Boole, cổng logic và De Morgan.</li>
<li><strong>Luyện tập</strong> — tối giản hàm bằng bìa K và dựng trên Falstad đến khi khớp bảng chân trị.</li>
<li><strong>Đào sâu</strong> — khối tổ hợp (cộng, MUX), flip-flop, bộ đếm và máy trạng thái.</li>
<li><strong>Sẵn sàng đi làm</strong> — mô tả phần cứng bằng Verilog và mô phỏng/tổng hợp lên FPGA (EDA Playground).</li>
</ol></div>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'DIC201',
    slug: 'dic201-digital-circuits',
    title: 'Digital Circuits',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/DIC201.webp',
    shortDescription: 'Digital logic from the ground up — number systems & codes (binary, BCD/Gray), Boolean algebra & logic gates, Karnaugh minimization, combinational circuits, flip-flops, registers & counters, state machines, memory & FPGA/Verilog.|||Kỹ thuật số từ gốc — hệ đếm & mã (nhị phân, bù 2, BCD/Gray), đại số Boole & cổng logic, tối giản Karnaugh, mạch tổ hợp, flip-flop, thanh ghi & bộ đếm, máy trạng thái, bộ nhớ & FPGA/Verilog.',
    description: 'Môn <strong>DIC201 — Digital Circuits (Kỹ thuật số)</strong> thuộc ngành Thiết kế vi mạch bán dẫn (kỳ 3), dạy cách hệ thống số biểu diễn và xử lý thông tin bằng 0/1. Từ <strong>hệ đếm &amp; mã</strong> (nhị phân, bù 2, BCD/Gray) → <strong>đại số Boole &amp; cổng logic</strong> → <strong>tối giản (bìa Karnaugh)</strong> → <strong>mạch tổ hợp</strong> (cộng, MUX, giải mã) → <strong>mạch tuần tự</strong> (latch, flip-flop) → <strong>thanh ghi &amp; bộ đếm</strong> → <strong>máy trạng thái</strong> → <strong>bộ nhớ &amp; logic khả trình</strong> (ROM/RAM, FPGA, nhập môn Verilog). Bám sách chuẩn Mano/Wakerly/Floyd, song ngữ, có bảng chân trị, ví dụ và quiz mỗi chương.',
    whatYouLearn: 'Đổi cơ số nhị phân/hex, số bù 2, mã BCD/Gray/ASCII; cổng AND/OR/NOT/NAND/NOR/XOR &amp; De Morgan; SOP/POS &amp; tối giản bìa Karnaugh; bộ cộng/trừ, MUX/DEMUX, encoder/decoder, comparator; latch &amp; flip-flop SR/D/JK/T; thanh ghi dịch &amp; bộ đếm đồng bộ/không đồng bộ; máy trạng thái Mealy/Moore; ROM/RAM (SRAM/DRAM), PLD/FPGA và nhập môn Verilog.',
    requirements: 'Toán rời rạc / logic cơ bản. Không cần biết trước điện tử. Nên dùng mô phỏng mạch trực tuyến (Falstad) và EDA Playground cho Verilog.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách Mano/Wakerly/Floyd, tài liệu, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Kỹ thuật số là gì, tín hiệu 0/1, lộ trình.', lessons: [intro] },
    { title: 'Chương 1 — Hệ đếm & mã|||Chapter 1 — Number systems & codes', description: 'Nhị phân/hex, bù 2, BCD/Gray/ASCII.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Boole & cổng logic|||Chapter 2 — Boolean & gates', description: 'AND/OR/NOT/NAND/NOR/XOR, De Morgan.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Tối giản hàm|||Chapter 3 — Minimization', description: 'Bảng chân trị, SOP/POS, bìa Karnaugh.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Mạch tổ hợp|||Chapter 4 — Combinational', description: 'Cộng/trừ, MUX/DEMUX, mã hoá/giải mã, so sánh.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Mạch tuần tự|||Chapter 5 — Sequential', description: 'Latch, flip-flop SR/D/JK/T, xung nhịp.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Thanh ghi & bộ đếm|||Chapter 6 — Registers & counters', description: 'Register, shift register, counter đồng bộ/ripple.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Máy trạng thái|||Chapter 7 — State machines', description: 'FSM, Mealy vs Moore, sơ đồ trạng thái.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Bộ nhớ & logic khả trình|||Chapter 8 — Memory & PLD', description: 'ROM/RAM, PLD/FPGA, nhập môn Verilog.', lessons: [c8, c8q] },
  ],
};
