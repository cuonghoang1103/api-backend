/**
 * DCD301 — Digital Circuit Design. Giáo trình FLM (syl): hệ đếm, cổng logic, đại
 * số Boole, rút gọn; mạch tổ hợp (mux/cộng) & tuần tự (flip-flop/thanh ghi/đếm);
 * HDL (VHDL/Verilog), FPGA, RTL design flow. Song ngữ + ví dụ + bài tập. Giữ
 * NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('dcd301-0-1-overview', 'Course overview: Digital Circuit Design|||Tổng quan: Thiết kế mạch số',
  'Mạch số là nền của mọi máy tính; lộ trình: hệ đếm & cổng logic → mạch tổ hợp → mạch tuần tự → HDL/FPGA & quy trình thiết kế IC số.',
  [[
    `<span class="eyebrow">DCD301 · Lesson 0.1 · Overview</span>
<h2>Digital Circuit Design</h2>
<p class="lead">Every computer, phone and microcontroller is built from <strong>digital circuits</strong> — networks of logic that manipulate 0s and 1s. This course gives you a solid foundation: number systems, logic gates, Boolean algebra, then combinational and sequential circuits, and finally hardware description languages (VHDL/Verilog) and FPGA implementation.</p>
<h3>Roadmap</h3>
<ul>
<li><strong>Foundations</strong> — binary/hex, logic gates, Boolean algebra, simplification</li>
<li><strong>Combinational circuits</strong> — multiplexers, decoders, adders (output depends only on current inputs)</li>
<li><strong>Sequential circuits</strong> — flip-flops, registers, counters (output depends on inputs AND memory)</li>
<li><strong>HDL &amp; FPGA</strong> — describe hardware at RTL, verify with testbenches, run on an FPGA</li>
</ul>
<div class="callout"><span class="badge">Note</span> This is a hardware-logic course — the "code" is HDL, which <em>describes</em> circuits rather than executing step by step. Bilingual, with truth tables, diagrams and exercises.</div>`,
    `<span class="eyebrow">DCD301 · Bài 0.1 · Tổng quan</span>
<h2>Thiết kế mạch số</h2>
<p class="lead">Mọi máy tính, điện thoại và vi điều khiển đều dựng từ <strong>mạch số</strong> — những mạng logic xử lý các số 0 và 1. Môn này cho bạn nền vững: hệ đếm, cổng logic, đại số Boole, rồi mạch tổ hợp và tuần tự, và cuối cùng là ngôn ngữ mô tả phần cứng (VHDL/Verilog) và hiện thực trên FPGA.</p>
<h3>Lộ trình</h3>
<ul>
<li><strong>Nền tảng</strong> — nhị phân/hex, cổng logic, đại số Boole, rút gọn</li>
<li><strong>Mạch tổ hợp</strong> — multiplexer, decoder, mạch cộng (đầu ra chỉ phụ thuộc đầu vào hiện tại)</li>
<li><strong>Mạch tuần tự</strong> — flip-flop, thanh ghi, bộ đếm (đầu ra phụ thuộc đầu vào VÀ bộ nhớ)</li>
<li><strong>HDL &amp; FPGA</strong> — mô tả phần cứng ở mức RTL, kiểm bằng testbench, chạy trên FPGA</li>
</ul>
<div class="callout"><span class="badge">Lưu ý</span> Đây là môn logic phần cứng — "code" là HDL, thứ <em>mô tả</em> mạch chứ không thực thi tuần tự. Song ngữ, có bảng chân trị, sơ đồ và bài tập.</div>`,
  ]]);

const c1 = doc('dcd301-1-1-gates-boolean', '1.1 — Number systems, gates & Boolean algebra|||1.1 — Hệ đếm, cổng logic & đại số Boole',
  'Nhị phân/hex, các cổng AND/OR/NOT/NAND/NOR/XOR + bảng chân trị, đại số Boole & định lý De Morgan, rút gọn hàm (bìa Karnaugh).',
  [[
    `<span class="eyebrow">DCD301 · Chapter 1 · Lesson 1.1</span>
<h2>Number systems, gates &amp; Boolean algebra</h2>
<h3>Binary &amp; hex</h3>
<p>Digital hardware stores everything in <strong>binary</strong> (base 2). <strong>Hex</strong> (base 16) is shorthand — one hex digit = 4 bits. E.g. binary 1011 = hex B = decimal 11.</p>
<h3>Logic gates</h3>
<table><thead><tr><th>Gate</th><th>Output is 1 when…</th></tr></thead><tbody>
<tr><td>AND</td><td>all inputs are 1</td></tr>
<tr><td>OR</td><td>any input is 1</td></tr>
<tr><td>NOT</td><td>input is 0 (inverts)</td></tr>
<tr><td>XOR</td><td>inputs differ</td></tr>
<tr><td>NAND / NOR</td><td>the inverse of AND / OR</td></tr>
</tbody></table>
<p>A <strong>truth table</strong> lists the output for every input combination — the complete specification of a logic function.</p>
<h3>Boolean algebra &amp; simplification</h3>
<p><strong>Boolean algebra</strong> is the math of 0/1 logic. Key laws let you shrink circuits: <code>A + A·B = A</code>, and <strong>De Morgan</strong>: <code>NOT(A AND B) = NOT A OR NOT B</code>. Fewer terms = fewer gates = cheaper, faster hardware. A <strong>Karnaugh map (K-map)</strong> is a visual way to find the minimal expression.</p>
<div class="callout"><span class="badge">Why NAND matters</span> NAND (and NOR) are "universal" — any logic function can be built from NAND gates alone. That's why chips are full of them.</div>`,
    `<span class="eyebrow">DCD301 · Chương 1 · Bài 1.1</span>
<h2>Hệ đếm, cổng logic &amp; đại số Boole</h2>
<h3>Nhị phân &amp; hex</h3>
<p>Phần cứng số lưu mọi thứ ở <strong>nhị phân</strong> (cơ số 2). <strong>Hex</strong> (cơ số 16) là cách viết gọn — một chữ số hex = 4 bit. Vd nhị phân 1011 = hex B = thập phân 11.</p>
<h3>Cổng logic</h3>
<table><thead><tr><th>Cổng</th><th>Đầu ra = 1 khi…</th></tr></thead><tbody>
<tr><td>AND</td><td>mọi đầu vào là 1</td></tr>
<tr><td>OR</td><td>có đầu vào nào là 1</td></tr>
<tr><td>NOT</td><td>đầu vào là 0 (đảo)</td></tr>
<tr><td>XOR</td><td>các đầu vào khác nhau</td></tr>
<tr><td>NAND / NOR</td><td>đảo của AND / OR</td></tr>
</tbody></table>
<p>Một <strong>bảng chân trị</strong> liệt kê đầu ra cho mọi tổ hợp đầu vào — đặc tả đầy đủ của một hàm logic.</p>
<h3>Đại số Boole &amp; rút gọn</h3>
<p><strong>Đại số Boole</strong> là toán của logic 0/1. Các định luật cho phép thu nhỏ mạch: <code>A + A·B = A</code>, và <strong>De Morgan</strong>: <code>NOT(A AND B) = NOT A OR NOT B</code>. Ít số hạng = ít cổng = phần cứng rẻ hơn, nhanh hơn. <strong>Bìa Karnaugh (K-map)</strong> là cách trực quan tìm biểu thức tối giản.</p>
<div class="callout"><span class="badge">Vì sao NAND quan trọng</span> NAND (và NOR) là cổng "vạn năng" — mọi hàm logic đều dựng được chỉ từ cổng NAND. Vì thế chip đầy chúng.</div>`,
  ]]);

const c1q = quiz('dcd301-quiz-1', 'Quiz 1 — Gates & Boolean|||Quiz 1 — Cổng & Boole', [
  { id: 'q1', question: 'Cổng nào cho đầu ra 1 CHỈ khi mọi đầu vào là 1?', options: ['OR', 'AND', 'XOR', 'NOT'], correctIndex: 1, explanation: 'AND = 1 khi tất cả đầu vào = 1.' },
  { id: 'q2', question: 'Cổng "vạn năng" (dựng được mọi hàm logic) là?', options: ['AND', 'OR', 'NAND (và NOR)', 'XOR'], correctIndex: 2, explanation: 'NAND/NOR là universal gate.' },
  { id: 'q3', question: 'Bìa Karnaugh (K-map) dùng để?', options: ['Đo điện áp', 'Rút gọn hàm logic một cách trực quan', 'Vẽ FPGA', 'Đổi hex'], correctIndex: 1, explanation: 'K-map tìm biểu thức tối giản → ít cổng.' },
]);

const c2 = doc('dcd301-2-1-combinational', '2.1 — Combinational circuits|||2.1 — Mạch tổ hợp',
  'Mạch tổ hợp (đầu ra chỉ phụ thuộc đầu vào hiện tại): multiplexer, decoder, mạch cộng (half/full adder), so sánh.',
  [[
    `<span class="eyebrow">DCD301 · Chapter 2 · Lesson 2.1</span>
<h2>Combinational circuits</h2>
<p>In a <strong>combinational</strong> circuit the output depends <em>only on the current inputs</em> — no memory. Built entirely from gates. Common building blocks:</p>
<ul>
<li><strong>Multiplexer (MUX)</strong> — a "selector": select bits choose which of several inputs passes to the output (a hardware switch).</li>
<li><strong>Decoder</strong> — turns an n-bit code into one active output line (address decoding in memory).</li>
<li><strong>Adder</strong> — a <strong>half adder</strong> adds two bits (sum = XOR, carry = AND); a <strong>full adder</strong> also takes a carry-in, and chaining them makes a multi-bit adder — the heart of the ALU.</li>
<li><strong>Comparator</strong> — outputs whether A &gt; B, A = B, A &lt; B.</li>
</ul>
<pre><code>Half adder truth table
 A B | Sum Carry
 0 0 |  0    0
 0 1 |  1    0
 1 0 |  1    0
 1 1 |  0    1     (Sum = A XOR B, Carry = A AND B)
</code></pre>
<div class="callout"><span class="badge">Key trait</span> No clock, no memory — give it inputs and (after a tiny propagation delay) the output settles. This is how arithmetic and routing get done in hardware.</div>`,
    `<span class="eyebrow">DCD301 · Chương 2 · Bài 2.1</span>
<h2>Mạch tổ hợp</h2>
<p>Trong mạch <strong>tổ hợp</strong>, đầu ra chỉ phụ thuộc <em>đầu vào hiện tại</em> — không có bộ nhớ. Dựng hoàn toàn từ cổng. Các khối phổ biến:</p>
<ul>
<li><strong>Multiplexer (MUX)</strong> — "bộ chọn": các bit chọn quyết định đầu vào nào đi ra (công tắc phần cứng).</li>
<li><strong>Decoder</strong> — biến mã n-bit thành một đường ra tích cực (giải mã địa chỉ trong bộ nhớ).</li>
<li><strong>Mạch cộng</strong> — <strong>half adder</strong> cộng hai bit (sum = XOR, carry = AND); <strong>full adder</strong> nhận thêm carry-in, nối chuỗi lại thành mạch cộng nhiều bit — trái tim của ALU.</li>
<li><strong>Bộ so sánh</strong> — cho biết A &gt; B, A = B, hay A &lt; B.</li>
</ul>
<pre><code>Bảng chân trị half adder
 A B | Sum Carry
 0 0 |  0    0
 0 1 |  1    0
 1 0 |  1    0
 1 1 |  0    1     (Sum = A XOR B, Carry = A AND B)
</code></pre>
<div class="callout"><span class="badge">Đặc trưng</span> Không đồng hồ, không bộ nhớ — đưa đầu vào và (sau trễ lan truyền rất nhỏ) đầu ra ổn định. Đây là cách phần cứng làm phép tính và định tuyến.</div>`,
  ]]);

const c2q = quiz('dcd301-quiz-2', 'Quiz 2 — Combinational|||Quiz 2 — Tổ hợp', [
  { id: 'q1', question: 'Mạch tổ hợp có đặc điểm?', options: ['Đầu ra phụ thuộc cả bộ nhớ', 'Đầu ra chỉ phụ thuộc đầu vào hiện tại (không bộ nhớ)', 'Luôn cần đồng hồ', 'Chỉ dùng flip-flop'], correctIndex: 1, explanation: 'Tổ hợp: không nhớ, đầu ra là hàm của đầu vào hiện tại.' },
  { id: 'q2', question: 'Half adder: Sum và Carry là?', options: ['Sum=AND, Carry=OR', 'Sum=XOR, Carry=AND', 'Sum=OR, Carry=XOR', 'Sum=NOT, Carry=AND'], correctIndex: 1, explanation: 'Sum = A XOR B, Carry = A AND B.' },
  { id: 'q3', question: 'Chọn một trong nhiều đầu vào để đưa ra output dùng?', options: ['Multiplexer (MUX)', 'Flip-flop', 'Counter', 'Oscillator'], correctIndex: 0, explanation: 'MUX là bộ chọn theo bit điều khiển.' },
]);

const c3 = doc('dcd301-3-1-sequential-hdl', '3.1 — Sequential circuits, HDL & FPGA|||3.1 — Mạch tuần tự, HDL & FPGA',
  'Flip-flop (D/JK), thanh ghi, bộ đếm (đầu ra phụ thuộc bộ nhớ + đồng hồ); giới thiệu HDL (Verilog/VHDL), RTL & testbench, FPGA.',
  [[
    `<span class="eyebrow">DCD301 · Chapter 3 · Lesson 3.1</span>
<h2>Sequential circuits, HDL &amp; FPGA</h2>
<h3>Sequential = logic + memory + clock</h3>
<p>A <strong>sequential</strong> circuit's output depends on inputs <em>and</em> its stored state, updated on a <strong>clock</strong> edge. The memory element is the <strong>flip-flop</strong> (a D flip-flop stores one bit). Compose them:</p>
<ul>
<li><strong>Register</strong> — several flip-flops storing a multi-bit value.</li>
<li><strong>Shift register</strong> — shifts bits along each clock (serial ↔ parallel conversion).</li>
<li><strong>Counter</strong> — counts clock pulses (0,1,2,… and wraps).</li>
</ul>
<h3>Describing hardware with HDL</h3>
<pre><code class="language-verilog">// A simple D flip-flop in Verilog (RTL)
module dff(input clk, input d, output reg q);
  always @(posedge clk)   // on the rising clock edge
    q &lt;= d;               // store d into q
endmodule
</code></pre>
<p>An <strong>HDL</strong> (Verilog/VHDL) <em>describes</em> hardware at the <strong>Register-Transfer Level (RTL)</strong> — what registers hold and how data moves between them each clock. You verify it with a <strong>testbench</strong> (simulated inputs + expected outputs), then synthesize it onto an <strong>FPGA</strong> (a reconfigurable chip) or into a real IC.</p>
<div class="callout"><span class="badge">HDL ≠ software</span> <code>always @(posedge clk)</code> isn't a loop that runs — it <em>describes</em> gates and flip-flops that all exist and update in parallel. Think in hardware, not sequential steps.</div>`,
    `<span class="eyebrow">DCD301 · Chương 3 · Bài 3.1</span>
<h2>Mạch tuần tự, HDL &amp; FPGA</h2>
<h3>Tuần tự = logic + bộ nhớ + đồng hồ</h3>
<p>Đầu ra của mạch <strong>tuần tự</strong> phụ thuộc đầu vào <em>và</em> trạng thái lưu, cập nhật theo cạnh <strong>đồng hồ (clock)</strong>. Phần tử nhớ là <strong>flip-flop</strong> (D flip-flop lưu một bit). Ghép chúng:</p>
<ul>
<li><strong>Thanh ghi (register)</strong> — nhiều flip-flop lưu một giá trị nhiều bit.</li>
<li><strong>Thanh ghi dịch</strong> — dịch bit theo mỗi nhịp (chuyển nối tiếp ↔ song song).</li>
<li><strong>Bộ đếm</strong> — đếm xung đồng hồ (0,1,2,… rồi quay vòng).</li>
</ul>
<h3>Mô tả phần cứng bằng HDL</h3>
<pre><code class="language-verilog">// Một D flip-flop đơn giản trong Verilog (RTL)
module dff(input clk, input d, output reg q);
  always @(posedge clk)   // tại cạnh lên của clock
    q &lt;= d;               // lưu d vào q
endmodule
</code></pre>
<p>Một <strong>HDL</strong> (Verilog/VHDL) <em>mô tả</em> phần cứng ở mức <strong>Register-Transfer Level (RTL)</strong> — thanh ghi giữ gì và dữ liệu chuyển giữa chúng ra sao mỗi nhịp. Bạn kiểm bằng <strong>testbench</strong> (đầu vào mô phỏng + đầu ra kỳ vọng), rồi tổng hợp (synthesize) lên <strong>FPGA</strong> (chip cấu hình lại được) hoặc vào một IC thật.</p>
<div class="callout"><span class="badge">HDL ≠ phần mềm</span> <code>always @(posedge clk)</code> không phải vòng lặp chạy — nó <em>mô tả</em> cổng và flip-flop cùng tồn tại và cập nhật song song. Hãy nghĩ bằng phần cứng, không phải bước tuần tự.</div>`,
  ]]);

const c3q = quiz('dcd301-quiz-3', 'Quiz 3 — Sequential & HDL|||Quiz 3 — Tuần tự & HDL', [
  { id: 'q1', question: 'Phần tử nhớ một bit trong mạch tuần tự là?', options: ['Cổng AND', 'Flip-flop', 'Multiplexer', 'Điện trở'], correctIndex: 1, explanation: 'Flip-flop (vd D) lưu một bit, cập nhật theo clock.' },
  { id: 'q2', question: 'Điểm khác chính giữa mạch tuần tự và tổ hợp?', options: ['Tuần tự có bộ nhớ + đồng hồ', 'Tổ hợp nhanh hơn luôn', 'Tuần tự không dùng cổng', 'Không khác gì'], correctIndex: 0, explanation: 'Tuần tự phụ thuộc trạng thái lưu + clock; tổ hợp thì không.' },
  { id: 'q3', question: 'HDL (Verilog/VHDL) dùng để?', options: ['Chạy như phần mềm tuần tự', 'MÔ TẢ phần cứng ở mức RTL để tổng hợp lên FPGA/IC', 'Đo điện', 'Vẽ UI'], correctIndex: 1, explanation: 'HDL mô tả mạch song song, kiểm bằng testbench, synth lên FPGA.' },
]);

const taiLieu = doc('dcd301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (kèm link), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">DCD301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Digital Circuit Design — logic, combinational &amp; sequential circuits, and HDL (Verilog/VHDL) — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for DCD301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://en.wikipedia.org/wiki/Digital_Design_(Mano_book)" target="_blank" rel="noopener"><em>Digital Design</em> — M. Morris Mano &amp; Michael Ciletti</a></li>
<li><a href="https://en.wikipedia.org/wiki/Verilog" target="_blank" rel="noopener"><em>Verilog HDL</em> — Samir Palnitkar (overview)</a></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://nandland.com/" target="_blank" rel="noopener">Nandland — FPGA &amp; digital logic tutorials</a></li>
<li><a href="https://hdlbits.01xz.net/wiki/Main_Page" target="_blank" rel="noopener">HDLBits — practice Verilog online</a></li>
<li><a href="https://www.chipverify.com/" target="_blank" rel="noopener">ChipVerify — Verilog &amp; SystemVerilog reference</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@nesoacademy" target="_blank" rel="noopener">Neso Academy</a> — digital electronics &amp; logic design</li>
<li><a href="https://www.youtube.com/@freecodecamp" target="_blank" rel="noopener">freeCodeCamp.org</a> — full digital logic / FPGA courses</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.edaplayground.com/" target="_blank" rel="noopener">EDA Playground</a> — simulate Verilog/VHDL in the browser</li>
<li><a href="https://github.com/logisim-evolution/logisim-evolution" target="_blank" rel="noopener">Logisim-evolution</a> — draw &amp; simulate logic circuits</li>
<li><a href="https://hdlbits.01xz.net/wiki/Main_Page" target="_blank" rel="noopener">HDLBits</a> — graded Verilog exercises</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — number systems, logic gates, Boolean algebra &amp; K-map minimisation.</li>
<li><strong>Practice</strong> — build truth tables and combinational blocks (MUX, decoder, adders) on Logisim.</li>
<li><strong>Go deeper</strong> — flip-flops, counters &amp; registers, then describe them in Verilog/VHDL with a testbench.</li>
<li><strong>Job-ready</strong> — synthesise RTL to an FPGA and reason about timing/clocking.</li>
</ol></div>`,
    `<span class="eyebrow">DCD301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Thiết kế mạch số — logic, mạch tổ hợp &amp; tuần tự, và HDL (Verilog/VHDL) — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của DCD301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://en.wikipedia.org/wiki/Digital_Design_(Mano_book)" target="_blank" rel="noopener"><em>Digital Design</em> — M. Morris Mano &amp; Michael Ciletti</a></li>
<li><a href="https://en.wikipedia.org/wiki/Verilog" target="_blank" rel="noopener"><em>Verilog HDL</em> — Samir Palnitkar (tổng quan)</a></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://nandland.com/" target="_blank" rel="noopener">Nandland — hướng dẫn FPGA &amp; logic số</a></li>
<li><a href="https://hdlbits.01xz.net/wiki/Main_Page" target="_blank" rel="noopener">HDLBits — luyện Verilog trực tuyến</a></li>
<li><a href="https://www.chipverify.com/" target="_blank" rel="noopener">ChipVerify — tra cứu Verilog &amp; SystemVerilog</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@nesoacademy" target="_blank" rel="noopener">Neso Academy</a> — điện tử số &amp; thiết kế logic</li>
<li><a href="https://www.youtube.com/@freecodecamp" target="_blank" rel="noopener">freeCodeCamp.org</a> — khoá logic số / FPGA đầy đủ</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.edaplayground.com/" target="_blank" rel="noopener">EDA Playground</a> — mô phỏng Verilog/VHDL trên trình duyệt</li>
<li><a href="https://github.com/logisim-evolution/logisim-evolution" target="_blank" rel="noopener">Logisim-evolution</a> — vẽ &amp; mô phỏng mạch logic</li>
<li><a href="https://hdlbits.01xz.net/wiki/Main_Page" target="_blank" rel="noopener">HDLBits</a> — bài tập Verilog có chấm</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — hệ đếm, cổng logic, đại số Boole &amp; rút gọn K-map.</li>
<li><strong>Luyện tập</strong> — lập bảng chân trị và mạch tổ hợp (MUX, decoder, adder) trên Logisim.</li>
<li><strong>Đào sâu thực tế</strong> — flip-flop, bộ đếm &amp; thanh ghi, rồi mô tả bằng Verilog/VHDL kèm testbench.</li>
<li><strong>Sẵn sàng đi làm</strong> — tổng hợp RTL lên FPGA và tư duy về timing/clock.</li>
</ol></div>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'DCD301',
    slug: 'dcd301-digital-circuit-design',
    title: 'Digital Circuit Design',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/DCD301.webp',
    shortDescription: 'Digital hardware from the ground up — number systems, logic gates, Boolean algebra, combinational (MUX/adders) & sequential (flip-flops/counters) circuits, HDL (Verilog/VHDL) & FPGA. Bilingual, with truth tables & quizzes.|||Phần cứng số từ gốc — hệ đếm, cổng logic, đại số Boole, mạch tổ hợp (MUX/cộng) & tuần tự (flip-flop/đếm), HDL (Verilog/VHDL) & FPGA. Song ngữ, có bảng chân trị & quiz.',
    description: 'Môn <strong>DCD301 — Digital Circuit Design</strong> (kỳ 7) cho nền vững về <strong>thiết kế mạch số</strong> — thứ dựng nên mọi máy tính. Từ <strong>hệ đếm, cổng logic, đại số Boole &amp; rút gọn (K-map)</strong> → <strong>mạch tổ hợp</strong> (MUX, decoder, half/full adder, so sánh) → <strong>mạch tuần tự</strong> (flip-flop, thanh ghi, thanh ghi dịch, bộ đếm) → <strong>HDL (Verilog/VHDL), RTL, testbench &amp; FPGA</strong>. Bám giáo trình FLM, song ngữ, có bảng chân trị, ví dụ HDL và quiz mỗi chương.',
    whatYouLearn: 'Nhị phân/hex; cổng AND/OR/NOT/XOR/NAND/NOR & bảng chân trị; đại số Boole, De Morgan, K-map (rút gọn); mạch tổ hợp (MUX, decoder, half/full adder, comparator); mạch tuần tự (flip-flop D/JK, register, shift register, counter, vai trò clock); HDL Verilog/VHDL mô tả RTL, testbench, tổng hợp lên FPGA; tổng quan quy trình thiết kế IC số.',
    requirements: 'Toán rời rạc/logic cơ bản là lợi thế. Không cần kinh nghiệm phần cứng trước. Có thể dùng phần mềm mô phỏng (Logisim/EDA Playground).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Mạch số là nền của máy tính.', lessons: [intro] },
    { title: 'Chương 1 — Cổng logic & đại số Boole|||Chapter 1 — Gates & Boolean', description: 'Hệ đếm, cổng, K-map.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Mạch tổ hợp|||Chapter 2 — Combinational', description: 'MUX, decoder, adder.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Mạch tuần tự, HDL & FPGA|||Chapter 3 — Sequential, HDL & FPGA', description: 'Flip-flop, counter, Verilog/VHDL.', lessons: [c3, c3q] },
  ],
};
