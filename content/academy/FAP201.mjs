/**
 * FAP201 — FPGA Programming (Lập trình FPGA).
 * Ngành Thiết kế vi mạch bán dẫn (FPTU), Kỳ 4. KHUNG chất lượng, song ngữ.
 * Giáo trình: Pong Chu "FPGA Prototyping by Verilog Examples"; Harris & Harris
 * "Digital Design and Computer Architecture"; Xilinx/Vivado docs; nandland.
 * Giữ NGUYÊN slug/semester/courseCode/thumb(v3). ⚠️ KHÔNG backtick/${ lồng;
 * "&"→"&amp;", "<"→"&lt;" trong content HTML (render đúng toán tử Verilog).
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('fap201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn quốc tế, tài liệu Vivado/nandland miễn phí, YouTube, công cụ mô phỏng, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">FAP201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>FPGA programming with Verilog</strong> — architecture, combinational &amp; sequential logic, FSMs, testbenches and the Vivado synthesis flow — in one place. The official slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for FAP201 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><em>FPGA Prototyping by Verilog Examples</em> — Pong P. Chu (the practical spine of this course)</li>
<li><em>Digital Design and Computer Architecture</em> — Harris &amp; Harris</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://docs.amd.com/" target="_blank" rel="noopener">AMD/Xilinx Vivado documentation</a> — synthesis, implementation, constraints</li>
<li><a href="https://nandland.com/" target="_blank" rel="noopener">nandland</a> — beginner-friendly FPGA &amp; Verilog tutorials</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@nandland" target="_blank" rel="noopener">nandland</a> — FPGA fundamentals with real boards</li>
<li><a href="https://www.youtube.com/@shawnhymel" target="_blank" rel="noopener">Shawn Hymel</a> — Intro to FPGA series</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.amd.com/en/products/software/adaptive-socs-and-fpgas/vivado.html" target="_blank" rel="noopener">AMD Vivado</a> — synthesis, place &amp; route, bitstream</li>
<li><a href="https://www.edaplayground.com/" target="_blank" rel="noopener">EDA Playground</a> — write &amp; simulate Verilog in the browser</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — FPGA architecture (LUT/FF/CLB) and Verilog syntax (module, port, wire/reg).</li>
<li><strong>Describe logic</strong> — combinational (assign, always@*) then sequential (always@posedge clk, flip-flops) and FSMs.</li>
<li><strong>Verify</strong> — write testbenches, run simulation, read waveforms before touching hardware.</li>
<li><strong>Implement</strong> — run the Vivado synthesis → place &amp; route → bitstream flow on a real board with a counter/UART project.</li>
</ol></div>`,
    `<span class="eyebrow">FAP201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>lập trình FPGA bằng Verilog</strong> — kiến trúc, mạch tổ hợp &amp; tuần tự, máy trạng thái, testbench và quy trình tổng hợp Vivado — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của FAP201 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><em>FPGA Prototyping by Verilog Examples</em> — Pong P. Chu (xương sống thực hành của môn)</li>
<li><em>Digital Design and Computer Architecture</em> — Harris &amp; Harris</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://docs.amd.com/" target="_blank" rel="noopener">Tài liệu AMD/Xilinx Vivado</a> — tổng hợp, hiện thực, ràng buộc</li>
<li><a href="https://nandland.com/" target="_blank" rel="noopener">nandland</a> — hướng dẫn FPGA &amp; Verilog dễ vào</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@nandland" target="_blank" rel="noopener">nandland</a> — nền tảng FPGA với board thật</li>
<li><a href="https://www.youtube.com/@shawnhymel" target="_blank" rel="noopener">Shawn Hymel</a> — chuỗi Intro to FPGA</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.amd.com/en/products/software/adaptive-socs-and-fpgas/vivado.html" target="_blank" rel="noopener">AMD Vivado</a> — tổng hợp, place &amp; route, bitstream</li>
<li><a href="https://www.edaplayground.com/" target="_blank" rel="noopener">EDA Playground</a> — viết &amp; mô phỏng Verilog trên trình duyệt</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — kiến trúc FPGA (LUT/FF/CLB) và cú pháp Verilog (module, port, wire/reg).</li>
<li><strong>Mô tả logic</strong> — mạch tổ hợp (assign, always@*) rồi tuần tự (always@posedge clk, flip-flop) và FSM.</li>
<li><strong>Kiểm chứng</strong> — viết testbench, chạy mô phỏng, đọc waveform trước khi đụng phần cứng.</li>
<li><strong>Hiện thực</strong> — chạy quy trình Vivado tổng hợp → place &amp; route → bitstream trên board thật với dự án bộ đếm/UART.</li>
</ol></div>`,
  ]]);

const intro = doc('fap201-0-1-overview', 'Course overview: FPGA programming|||Tổng quan: Lập trình FPGA',
  'FPGA làm gì, khác ASIC/MCU thế nào; mô tả phần cứng bằng HDL thay vì lập trình tuần tự; lộ trình: kiến trúc → Verilog → tổ hợp/tuần tự → FSM → testbench → tổng hợp Vivado → dự án.',
  [[
    `<span class="eyebrow">FAP201 · Lesson 0.1 · Overview</span>
<h2>Programming FPGAs with Verilog</h2>
<p class="lead">An <strong>FPGA</strong> (Field-Programmable Gate Array) is a chip whose digital hardware you <em>configure yourself</em> — you describe circuits, not instructions. This course teaches you to design real digital hardware in <strong>Verilog HDL</strong> and bring it up on an FPGA board with <strong>Vivado</strong>.</p>
<h3>Hardware, not software</h3>
<p>A CPU runs instructions one after another. An FPGA becomes the <em>actual circuit</em> you describe, so hundreds of operations happen <strong>in parallel</strong>, every clock cycle. That is why FPGAs shine at signal processing, high-speed I/O and custom accelerators.</p>
<h3>Roadmap</h3>
<p>FPGA architecture (LUT/FF/CLB) → Verilog syntax → combinational logic (assign, always@*) → sequential logic (flip-flops, registers) → finite state machines → testbench &amp; simulation → the synthesis / place &amp; route / bitstream flow → a hands-on counter/UART project. Bilingual, with Verilog examples in every chapter.</p>`,
    `<span class="eyebrow">FAP201 · Bài 0.1 · Tổng quan</span>
<h2>Lập trình FPGA bằng Verilog</h2>
<p class="lead">Một <strong>FPGA</strong> (Field-Programmable Gate Array) là con chip mà bạn <em>tự cấu hình</em> phần cứng số bên trong — bạn mô tả mạch, không phải viết lệnh. Môn này dạy bạn thiết kế phần cứng số thật bằng <strong>Verilog HDL</strong> và nạp lên board FPGA bằng <strong>Vivado</strong>.</p>
<h3>Phần cứng, không phải phần mềm</h3>
<p>CPU chạy lệnh lần lượt. FPGA thì <em>trở thành chính mạch</em> bạn mô tả, nên hàng trăm phép toán chạy <strong>song song</strong> mỗi chu kỳ xung nhịp. Vì thế FPGA mạnh ở xử lý tín hiệu, I/O tốc độ cao và bộ tăng tốc chuyên dụng.</p>
<h3>Lộ trình</h3>
<p>Kiến trúc FPGA (LUT/FF/CLB) → cú pháp Verilog → mạch tổ hợp (assign, always@*) → mạch tuần tự (flip-flop, thanh ghi) → máy trạng thái → testbench &amp; mô phỏng → quy trình tổng hợp / place &amp; route / bitstream → dự án bộ đếm/UART thực hành. Song ngữ, có ví dụ Verilog ở mỗi chương.</p>`,
  ]]);

const c1 = doc('fap201-1-1-fpga-architecture', '1.1 — What is an FPGA? (architecture)|||1.1 — FPGA là gì? (kiến trúc)',
  'Kiến trúc FPGA: LUT (bảng tra), flip-flop, CLB, mạng định tuyến, khối I/O; so sánh FPGA vs ASIC vs MCU; ứng dụng thực tế.',
  [[
    `<span class="eyebrow">FAP201 · Chapter 1 · Lesson 1.1</span>
<h2>What is an FPGA?</h2>
<h3>The building blocks</h3>
<ul>
<li><strong>LUT (Look-Up Table)</strong> — a tiny memory that implements ANY logic function of its inputs by storing its truth table. This is how an FPGA becomes any combinational gate.</li>
<li><strong>Flip-flop (FF)</strong> — a 1-bit storage element clocked by the system clock; it gives the fabric memory and state.</li>
<li><strong>CLB (Configurable Logic Block)</strong> — a cluster of LUTs + FFs, the repeating tile of the fabric.</li>
<li><strong>Routing</strong> — a programmable interconnect mesh that wires CLBs together; <strong>I/O blocks</strong> connect to the pins.</li>
</ul>
<pre><code>A 2-input LUT storing an AND truth table:
  a b | y      the LUT just "looks up" y
  0 0 | 0      for each (a,b) input pattern
  0 1 | 0
  1 0 | 0
  1 1 | 1   -> configure this table = an AND gate</code></pre>
<h3>FPGA vs ASIC vs MCU</h3>
<ul>
<li><strong>MCU</strong> — runs software sequentially; cheap, flexible, but one instruction at a time.</li>
<li><strong>FPGA</strong> — reconfigurable parallel hardware; great for prototyping &amp; high throughput.</li>
<li><strong>ASIC</strong> — hardware fixed in silicon; fastest &amp; cheapest at huge volume, but no changes after fabrication.</li>
</ul>
<div class="callout"><span class="badge">Why it matters</span> An FPGA lets you build custom parallel hardware without a fab — reprogram the same chip into a filter today and a UART tomorrow.</div>`,
    `<span class="eyebrow">FAP201 · Chương 1 · Bài 1.1</span>
<h2>FPGA là gì?</h2>
<h3>Các khối dựng</h3>
<ul>
<li><strong>LUT (bảng tra)</strong> — một bộ nhớ nhỏ hiện thực BẤT KỲ hàm logic nào của đầu vào bằng cách lưu bảng chân trị. Đây là cách FPGA trở thành mọi cổng tổ hợp.</li>
<li><strong>Flip-flop (FF)</strong> — phần tử nhớ 1 bit chốt theo xung nhịp; cho fabric có bộ nhớ và trạng thái.</li>
<li><strong>CLB (khối logic cấu hình được)</strong> — cụm gồm LUT + FF, là ô lặp lại của fabric.</li>
<li><strong>Định tuyến (routing)</strong> — lưới kết nối lập trình được nối các CLB; <strong>khối I/O</strong> nối ra chân.</li>
</ul>
<pre><code>Một LUT 2 đầu vào lưu bảng chân trị AND:
  a b | y      LUT chỉ "tra" ra y
  0 0 | 0      cho mỗi mẫu vào (a,b)
  0 1 | 0
  1 0 | 0
  1 1 | 1   -> cấu hình bảng này = một cổng AND</code></pre>
<h3>FPGA vs ASIC vs MCU</h3>
<ul>
<li><strong>MCU</strong> — chạy phần mềm tuần tự; rẻ, linh hoạt, nhưng mỗi lần một lệnh.</li>
<li><strong>FPGA</strong> — phần cứng song song cấu hình lại được; hợp cho làm mẫu &amp; thông lượng cao.</li>
<li><strong>ASIC</strong> — phần cứng cố định trong silicon; nhanh &amp; rẻ nhất khi sản lượng lớn, nhưng không sửa được sau khi chế tạo.</li>
</ul>
<div class="callout"><span class="badge">Vì sao quan trọng</span> FPGA cho bạn dựng phần cứng song song riêng mà không cần nhà máy — cùng một chip, hôm nay là bộ lọc, mai là UART.</div>`,
  ]]);

const c1q = quiz('fap201-quiz-1', 'Quiz 1 — FPGA architecture|||Quiz 1 — Kiến trúc FPGA', [
  { id: 'q1', question: 'Trong FPGA, khối nào hiện thực một hàm logic tổ hợp bất kỳ bằng cách lưu bảng chân trị?', options: ['Flip-flop', 'LUT (bảng tra)', 'Routing', 'Khối I/O'], correctIndex: 1, explanation: 'LUT lưu bảng chân trị nên tra ra mọi hàm logic của đầu vào.' },
  { id: 'q2', question: 'Điểm khác biệt cốt lõi của FPGA so với MCU là?', options: ['Chạy lệnh nhanh hơn', 'Là phần cứng song song cấu hình lại được', 'Có nhiều RAM hơn', 'Không cần nguồn'], correctIndex: 1, explanation: 'FPGA trở thành chính mạch bạn mô tả, chạy song song; MCU chạy phần mềm tuần tự.' },
  { id: 'q3', question: 'CLB trong FPGA là gì?', options: ['Một chân nối ra ngoài', 'Cụm gồm LUT và flip-flop', 'Bộ nhớ chương trình', 'Bộ dao động thạch anh'], correctIndex: 1, explanation: 'CLB (Configurable Logic Block) là cụm LUT + FF, ô lặp của fabric.' },
]);

const c2 = doc('fap201-2-1-verilog-basics', '2.1 — Verilog HDL basics|||2.1 — Nhập môn Verilog HDL',
  'module & port (input/output), wire vs reg, cú pháp cơ bản; ví dụ half-adder. Đây là ngôn ngữ MÔ TẢ phần cứng, không phải chạy tuần tự.',
  [[
    `<span class="eyebrow">FAP201 · Chapter 2 · Lesson 2.1</span>
<h2>Verilog HDL basics</h2>
<p>Verilog is a <strong>Hardware Description Language</strong>: you describe what a circuit <em>is</em>, and the tools build it. The unit of design is the <strong>module</strong>.</p>
<h3>Modules, ports, wire vs reg</h3>
<ul>
<li><strong>module … endmodule</strong> — a reusable block with a name and a port list.</li>
<li><strong>Ports</strong> — <code>input</code>, <code>output</code> (and <code>inout</code>) define the interface.</li>
<li><strong>wire</strong> — a physical connection, driven continuously (used with <code>assign</code>).</li>
<li><strong>reg</strong> — a value assigned inside a procedural <code>always</code> block (not necessarily a real register).</li>
</ul>
<pre><code>module half_adder (
  input  wire a,
  input  wire b,
  output wire sum,
  output wire carry
);
  assign sum   = a ^ b;    // XOR
  assign carry = a &amp; b;    // AND
endmodule</code></pre>
<div class="callout"><span class="badge">Mindset</span> Every line describes hardware that exists all at once — order does not mean "runs first". Think circuits, not steps.</div>`,
    `<span class="eyebrow">FAP201 · Chương 2 · Bài 2.1</span>
<h2>Nhập môn Verilog HDL</h2>
<p>Verilog là <strong>ngôn ngữ mô tả phần cứng</strong>: bạn mô tả một mạch <em>là gì</em>, còn công cụ sẽ dựng nó ra. Đơn vị thiết kế là <strong>module</strong>.</p>
<h3>Module, port, wire vs reg</h3>
<ul>
<li><strong>module … endmodule</strong> — một khối tái dùng, có tên và danh sách cổng.</li>
<li><strong>Port</strong> — <code>input</code>, <code>output</code> (và <code>inout</code>) định nghĩa giao diện.</li>
<li><strong>wire</strong> — dây nối vật lý, được lái liên tục (dùng với <code>assign</code>).</li>
<li><strong>reg</strong> — giá trị gán trong khối thủ tục <code>always</code> (không nhất thiết là thanh ghi thật).</li>
</ul>
<pre><code>module half_adder (
  input  wire a,
  input  wire b,
  output wire sum,
  output wire carry
);
  assign sum   = a ^ b;    // XOR
  assign carry = a &amp; b;    // AND
endmodule</code></pre>
<div class="callout"><span class="badge">Tư duy</span> Mỗi dòng mô tả phần cứng tồn tại đồng thời — thứ tự KHÔNG có nghĩa là "chạy trước". Hãy nghĩ theo mạch, không theo bước.</div>`,
  ]]);

const c2q = quiz('fap201-quiz-2', 'Quiz 2 — Verilog basics|||Quiz 2 — Nhập môn Verilog', [
  { id: 'q1', question: 'Đơn vị thiết kế cơ bản trong Verilog là?', options: ['function', 'module', 'class', 'package'], correctIndex: 1, explanation: 'Thiết kế Verilog gói trong module … endmodule, có danh sách cổng.' },
  { id: 'q2', question: 'Kiểu nào được lái liên tục và dùng với lệnh assign?', options: ['reg', 'wire', 'integer', 'parameter'], correctIndex: 1, explanation: 'wire là dây nối lái liên tục; assign lái một wire.' },
  { id: 'q3', question: 'Verilog là loại ngôn ngữ gì?', options: ['Ngôn ngữ chạy tuần tự như C', 'Ngôn ngữ mô tả phần cứng (HDL)', 'Ngôn ngữ truy vấn CSDL', 'Ngôn ngữ đánh dấu'], correctIndex: 1, explanation: 'Verilog mô tả phần cứng tồn tại đồng thời, tools dựng ra mạch.' },
]);

const c3 = doc('fap201-3-1-combinational', '3.1 — Combinational logic in Verilog|||3.1 — Mạch tổ hợp trong Verilog',
  'assign (dataflow) và always@* (procedural); MUX, decoder bằng case; đầu ra chỉ phụ thuộc đầu vào hiện tại, không có nhớ.',
  [[
    `<span class="eyebrow">FAP201 · Chapter 3 · Lesson 3.1</span>
<h2>Combinational logic</h2>
<p><strong>Combinational</strong> logic has <em>no memory</em>: the output depends only on the current inputs. Two idiomatic ways to write it:</p>
<ul>
<li><strong>assign</strong> — dataflow, for simple expressions (a MUX as a ternary).</li>
<li><strong>always @*</strong> — procedural, for <code>case</code>/<code>if</code>; assign to <code>reg</code> and cover every branch to avoid latches.</li>
</ul>
<pre><code>// 4-to-1 multiplexer
module mux4 (
  input  wire [1:0] sel,
  input  wire a, b, c, d,
  output reg  y
);
  always @* begin
    case (sel)
      2'b00: y = a;
      2'b01: y = b;
      2'b10: y = c;
      2'b11: y = d;
    endcase
  end
endmodule</code></pre>
<div class="callout"><span class="badge">Latch trap</span> In an always@* block, an incompletely specified output infers a latch. Give a default or list every case.</div>`,
    `<span class="eyebrow">FAP201 · Chương 3 · Bài 3.1</span>
<h2>Mạch tổ hợp</h2>
<p>Logic <strong>tổ hợp</strong> <em>không có nhớ</em>: đầu ra chỉ phụ thuộc đầu vào hiện tại. Hai cách viết quen thuộc:</p>
<ul>
<li><strong>assign</strong> — dataflow, cho biểu thức đơn giản (MUX viết bằng toán tử điều kiện).</li>
<li><strong>always @*</strong> — thủ tục, cho <code>case</code>/<code>if</code>; gán vào <code>reg</code> và phủ hết nhánh để tránh sinh latch.</li>
</ul>
<pre><code>// Bộ dồn kênh 4 sang 1
module mux4 (
  input  wire [1:0] sel,
  input  wire a, b, c, d,
  output reg  y
);
  always @* begin
    case (sel)
      2'b00: y = a;
      2'b01: y = b;
      2'b10: y = c;
      2'b11: y = d;
    endcase
  end
endmodule</code></pre>
<div class="callout"><span class="badge">Bẫy latch</span> Trong khối always@*, đầu ra không được gán đủ nhánh sẽ sinh latch ngoài ý muốn. Hãy đặt giá trị mặc định hoặc liệt kê mọi case.</div>`,
  ]]);

const c3q = quiz('fap201-quiz-3', 'Quiz 3 — Combinational|||Quiz 3 — Mạch tổ hợp', [
  { id: 'q1', question: 'Đặc điểm của mạch tổ hợp là?', options: ['Đầu ra phụ thuộc lịch sử đầu vào', 'Đầu ra chỉ phụ thuộc đầu vào hiện tại', 'Cần xung clock để đổi', 'Luôn có flip-flop'], correctIndex: 1, explanation: 'Tổ hợp không có nhớ: ra chỉ phụ thuộc vào hiện tại.' },
  { id: 'q2', question: 'Để mô tả tổ hợp bằng case/if trong khối thủ tục, ta dùng?', options: ['always @(posedge clk)', 'always @*', 'initial', 'assign duy nhất'], correctIndex: 1, explanation: 'always @* nhạy với mọi tín hiệu đầu vào, hợp cho logic tổ hợp.' },
  { id: 'q3', question: 'Trong always@*, quên gán đủ nhánh đầu ra sẽ gây ra?', options: ['Sinh latch ngoài ý muốn', 'Lỗi cú pháp', 'Thêm một flip-flop', 'Không ảnh hưởng gì'], correctIndex: 0, explanation: 'Đầu ra không được gán ở mọi nhánh khiến tool suy ra latch.' },
]);

const c4 = doc('fap201-4-1-sequential', '4.1 — Sequential logic in Verilog|||4.1 — Mạch tuần tự trong Verilog',
  'always @(posedge clk), flip-flop D, thanh ghi, reset đồng bộ/bất đồng bộ; gán không chặn <= cho logic tuần tự.',
  [[
    `<span class="eyebrow">FAP201 · Chapter 4 · Lesson 4.1</span>
<h2>Sequential logic</h2>
<p><strong>Sequential</strong> logic has memory: it updates on a clock edge and remembers state. The core primitive is the <strong>D flip-flop</strong>.</p>
<ul>
<li><strong>always @(posedge clk)</strong> — the block runs on each rising clock edge.</li>
<li><strong>Non-blocking &lt;=</strong> — use it for clocked logic so all registers update together.</li>
<li><strong>Reset</strong> — asynchronous (in the sensitivity list) or synchronous (checked inside the clock block).</li>
</ul>
<pre><code>// D flip-flop with async reset
module dff (
  input  wire clk,
  input  wire rst,
  input  wire d,
  output reg  q
);
  always @(posedge clk or posedge rst) begin
    if (rst) q &lt;= 1'b0;
    else     q &lt;= d;
  end
endmodule</code></pre>
<div class="callout"><span class="badge">Rule of thumb</span> Non-blocking &lt;= in clocked blocks, blocking = in combinational always@*. Mixing them is a classic source of bugs.</div>`,
    `<span class="eyebrow">FAP201 · Chương 4 · Bài 4.1</span>
<h2>Mạch tuần tự</h2>
<p>Logic <strong>tuần tự</strong> có nhớ: nó cập nhật theo cạnh xung nhịp và ghi nhớ trạng thái. Phần tử lõi là <strong>flip-flop D</strong>.</p>
<ul>
<li><strong>always @(posedge clk)</strong> — khối chạy mỗi cạnh lên của clock.</li>
<li><strong>Gán không chặn &lt;=</strong> — dùng cho logic theo clock để mọi thanh ghi cập nhật đồng thời.</li>
<li><strong>Reset</strong> — bất đồng bộ (nằm trong danh sách nhạy) hoặc đồng bộ (kiểm bên trong khối clock).</li>
</ul>
<pre><code>// Flip-flop D, reset bất đồng bộ
module dff (
  input  wire clk,
  input  wire rst,
  input  wire d,
  output reg  q
);
  always @(posedge clk or posedge rst) begin
    if (rst) q &lt;= 1'b0;
    else     q &lt;= d;
  end
endmodule</code></pre>
<div class="callout"><span class="badge">Mẹo nhớ</span> Dùng &lt;= không chặn trong khối theo clock, dùng = chặn trong always@* tổ hợp. Trộn lẫn hai loại là nguồn lỗi kinh điển.</div>`,
  ]]);

const c4q = quiz('fap201-quiz-4', 'Quiz 4 — Sequential|||Quiz 4 — Mạch tuần tự', [
  { id: 'q1', question: 'Khối nào mô tả logic cập nhật theo cạnh lên của clock?', options: ['always @*', 'always @(posedge clk)', 'assign', 'initial'], correctIndex: 1, explanation: 'always @(posedge clk) chạy mỗi cạnh lên xung nhịp — logic tuần tự.' },
  { id: 'q2', question: 'Trong khối theo clock nên dùng kiểu gán nào?', options: ['Gán chặn =', 'Gán không chặn <=', 'assign', 'Cả hai đều như nhau'], correctIndex: 1, explanation: 'Gán không chặn <= cho mọi thanh ghi cập nhật đồng thời, tránh lỗi.' },
  { id: 'q3', question: 'Phần tử nhớ 1 bit chốt theo clock là?', options: ['LUT', 'Flip-flop D', 'Cổng AND', 'Bộ chia áp'], correctIndex: 1, explanation: 'Flip-flop D lưu 1 bit, cập nhật theo cạnh clock.' },
]);

const c5 = doc('fap201-5-1-fsm', '5.1 — Finite state machines|||5.1 — Máy trạng thái FSM',
  'FSM trong Verilog: thanh ghi trạng thái + logic next-state + logic đầu ra; Moore (ra theo trạng thái) vs Mealy (ra theo trạng thái + vào).',
  [[
    `<span class="eyebrow">FAP201 · Chapter 5 · Lesson 5.1</span>
<h2>Finite state machines</h2>
<p>An <strong>FSM</strong> models control logic that moves between a fixed set of states. The clean Verilog style uses <strong>three parts</strong>: a state register, next-state logic, and output logic.</p>
<ul>
<li><strong>Moore</strong> — output depends only on the current state (glitch-free, one cycle of latency).</li>
<li><strong>Mealy</strong> — output depends on state AND inputs (reacts faster, can glitch).</li>
</ul>
<pre><code>// Moore FSM skeleton
module fsm_moore (
  input  wire clk, rst, x,
  output reg  y
);
  localparam S0 = 1'b0, S1 = 1'b1;
  reg state, next;
  // 1) state register (sequential)
  always @(posedge clk or posedge rst)
    if (rst) state &lt;= S0;
    else     state &lt;= next;
  // 2) next-state logic (combinational)
  always @* begin
    case (state)
      S0: next = x ? S1 : S0;
      S1: next = x ? S1 : S0;
    endcase
  end
  // 3) output logic (Moore: state only)
  always @* y = (state == S1);
endmodule</code></pre>
<div class="callout"><span class="badge">Moore vs Mealy</span> Moore reads the state; Mealy reads state + inputs. Pick Moore when a clean, registered output matters.</div>`,
    `<span class="eyebrow">FAP201 · Chương 5 · Bài 5.1</span>
<h2>Máy trạng thái FSM</h2>
<p>Một <strong>FSM</strong> mô hình logic điều khiển di chuyển giữa một tập trạng thái cố định. Cách viết Verilog gọn dùng <strong>ba phần</strong>: thanh ghi trạng thái, logic trạng thái kế, và logic đầu ra.</p>
<ul>
<li><strong>Moore</strong> — đầu ra chỉ theo trạng thái hiện tại (không glitch, trễ một chu kỳ).</li>
<li><strong>Mealy</strong> — đầu ra theo trạng thái VÀ đầu vào (phản ứng nhanh hơn, có thể glitch).</li>
</ul>
<pre><code>// Khung FSM Moore
module fsm_moore (
  input  wire clk, rst, x,
  output reg  y
);
  localparam S0 = 1'b0, S1 = 1'b1;
  reg state, next;
  // 1) thanh ghi trạng thái (tuần tự)
  always @(posedge clk or posedge rst)
    if (rst) state &lt;= S0;
    else     state &lt;= next;
  // 2) logic trạng thái kế (tổ hợp)
  always @* begin
    case (state)
      S0: next = x ? S1 : S0;
      S1: next = x ? S1 : S0;
    endcase
  end
  // 3) logic đầu ra (Moore: chỉ theo trạng thái)
  always @* y = (state == S1);
endmodule</code></pre>
<div class="callout"><span class="badge">Moore vs Mealy</span> Moore đọc trạng thái; Mealy đọc trạng thái + đầu vào. Chọn Moore khi cần đầu ra sạch, đã qua thanh ghi.</div>`,
  ]]);

const c5q = quiz('fap201-quiz-5', 'Quiz 5 — FSM|||Quiz 5 — Máy trạng thái', [
  { id: 'q1', question: 'Cách viết FSM Verilog gọn thường tách thành mấy phần?', options: ['Một khối duy nhất', 'Ba phần: thanh ghi trạng thái, next-state, đầu ra', 'Hai khối initial', 'Chỉ assign'], correctIndex: 1, explanation: 'Kiểu chuẩn: state register (tuần tự) + next-state (tổ hợp) + output logic.' },
  { id: 'q2', question: 'FSM kiểu Moore có đặc điểm?', options: ['Đầu ra theo trạng thái và đầu vào', 'Đầu ra chỉ theo trạng thái hiện tại', 'Không cần clock', 'Không có trạng thái'], correctIndex: 1, explanation: 'Moore: đầu ra chỉ hàm của trạng thái, sạch và không glitch.' },
  { id: 'q3', question: 'So với Moore, FSM Mealy?', options: ['Luôn chậm hơn', 'Đầu ra phụ thuộc cả đầu vào nên phản ứng nhanh hơn nhưng có thể glitch', 'Không dùng được trên FPGA', 'Không có trạng thái kế'], correctIndex: 1, explanation: 'Mealy dùng cả đầu vào, phản ứng nhanh hơn nhưng dễ glitch.' },
]);

const c6 = doc('fap201-6-1-testbench', '6.1 — Testbench & simulation|||6.1 — Testbench & mô phỏng',
  'Viết testbench (kích thích đầu vào, instantiate DUT), chạy mô phỏng, đọc waveform; verification trước khi nạp phần cứng.',
  [[
    `<span class="eyebrow">FAP201 · Chapter 6 · Lesson 6.1</span>
<h2>Testbench &amp; simulation</h2>
<p>Before touching a board you <strong>verify in simulation</strong>. A <strong>testbench</strong> is non-synthesizable Verilog that drives inputs into your design (the DUT) and checks the outputs.</p>
<ul>
<li><strong>initial + #delay</strong> — apply a sequence of stimulus over simulated time.</li>
<li><strong>instantiate the DUT</strong> — connect its ports by name.</li>
<li><strong>$display / $monitor</strong> — print values; a <strong>waveform</strong> viewer shows signals over time.</li>
</ul>
<pre><code>module tb_and;
  reg  a, b;
  wire y;
  and_gate uut (.a(a), .b(b), .y(y));   // DUT
  initial begin
    a = 0; b = 0; #10;
    a = 0; b = 1; #10;
    a = 1; b = 1; #10;
    $display("y = %b", y);
    $finish;
  end
endmodule</code></pre>
<div class="callout"><span class="badge">Verify first</span> A bug caught in simulation costs seconds; the same bug found on hardware costs a re-synthesis and a bring-up session.</div>`,
    `<span class="eyebrow">FAP201 · Chương 6 · Bài 6.1</span>
<h2>Testbench &amp; mô phỏng</h2>
<p>Trước khi đụng board, bạn <strong>kiểm chứng bằng mô phỏng</strong>. <strong>Testbench</strong> là Verilog không tổng hợp được, dùng để lái đầu vào vào thiết kế (DUT) và kiểm đầu ra.</p>
<ul>
<li><strong>initial + #delay</strong> — đưa chuỗi kích thích theo thời gian mô phỏng.</li>
<li><strong>instantiate DUT</strong> — nối cổng của nó theo tên.</li>
<li><strong>$display / $monitor</strong> — in giá trị; trình xem <strong>waveform</strong> hiện tín hiệu theo thời gian.</li>
</ul>
<pre><code>module tb_and;
  reg  a, b;
  wire y;
  and_gate uut (.a(a), .b(b), .y(y));   // DUT
  initial begin
    a = 0; b = 0; #10;
    a = 0; b = 1; #10;
    a = 1; b = 1; #10;
    $display("y = %b", y);
    $finish;
  end
endmodule</code></pre>
<div class="callout"><span class="badge">Kiểm trước</span> Bắt lỗi trong mô phỏng tốn vài giây; cùng lỗi đó tìm trên phần cứng tốn cả lần tổng hợp lại và một buổi bring-up.</div>`,
  ]]);

const c6q = quiz('fap201-quiz-6', 'Quiz 6 — Testbench|||Quiz 6 — Testbench', [
  { id: 'q1', question: 'Testbench trong Verilog dùng để?', options: ['Nạp thẳng lên FPGA', 'Lái đầu vào và kiểm đầu ra của thiết kế trong mô phỏng', 'Tạo bitstream', 'Định tuyến mạch'], correctIndex: 1, explanation: 'Testbench sinh kích thích và kiểm đầu ra của DUT khi mô phỏng.' },
  { id: 'q2', question: 'Khối nào thường dùng để đưa chuỗi kích thích theo thời gian trong testbench?', options: ['always @(posedge clk)', 'initial với các #delay', 'assign', 'generate'], correctIndex: 1, explanation: 'initial + #delay áp lần lượt các giá trị theo thời gian mô phỏng.' },
  { id: 'q3', question: 'Vì sao nên mô phỏng trước khi nạp phần cứng?', options: ['Bắt buộc theo cú pháp', 'Bắt lỗi sớm rẻ hơn nhiều so với debug trên board', 'Để tạo file XDC', 'Để tăng tần số clock'], correctIndex: 1, explanation: 'Lỗi bắt trong sim tốn vài giây; trên hardware tốn cả lần tổng hợp lại.' },
]);

const c7 = doc('fap201-7-1-synthesis-flow', '7.1 — FPGA synthesis flow|||7.1 — Quy trình tổng hợp FPGA',
  'Quy trình Vivado: synthesis → place & route → timing constraint (XDC) → bitstream → nạp board; hiểu ràng buộc clock và gán chân.',
  [[
    `<span class="eyebrow">FAP201 · Chapter 7 · Lesson 7.1</span>
<h2>The FPGA synthesis flow</h2>
<p>Turning Verilog into a running chip is a pipeline. In <strong>Vivado</strong>:</p>
<ol>
<li><strong>Synthesis</strong> — Verilog → a netlist of LUTs/FFs.</li>
<li><strong>Place &amp; route</strong> — assign the netlist to real CLBs and wire them through the routing fabric.</li>
<li><strong>Timing constraints (XDC)</strong> — declare the clock period and pin locations; the tool checks timing is met.</li>
<li><strong>Bitstream</strong> — the binary that configures the FPGA; download it to the board.</li>
</ol>
<pre><code># Vivado non-project flow (Tcl)
read_verilog top.v
synth_design -top top -part xc7a35tcpg236-1
place_design
route_design
write_bitstream top.bit

# top.xdc — constraints
create_clock -period 10.0 [get_ports clk]     # 100 MHz
set_property PACKAGE_PIN W5 [get_ports clk]</code></pre>
<div class="callout"><span class="badge">Timing closure</span> A design that simulates correctly can still fail on hardware if it misses timing. Constraints tell the tool what "fast enough" means.</div>`,
    `<span class="eyebrow">FAP201 · Chương 7 · Bài 7.1</span>
<h2>Quy trình tổng hợp FPGA</h2>
<p>Biến Verilog thành con chip đang chạy là một chuỗi bước. Trong <strong>Vivado</strong>:</p>
<ol>
<li><strong>Synthesis</strong> — Verilog → netlist gồm LUT/FF.</li>
<li><strong>Place &amp; route</strong> — gán netlist vào CLB thật rồi nối dây qua mạng định tuyến.</li>
<li><strong>Ràng buộc thời gian (XDC)</strong> — khai chu kỳ clock và vị trí chân; tool kiểm timing có đạt.</li>
<li><strong>Bitstream</strong> — file nhị phân cấu hình FPGA; nạp xuống board.</li>
</ol>
<pre><code># Luồng Vivado không dự án (Tcl)
read_verilog top.v
synth_design -top top -part xc7a35tcpg236-1
place_design
route_design
write_bitstream top.bit

# top.xdc — ràng buộc
create_clock -period 10.0 [get_ports clk]     # 100 MHz
set_property PACKAGE_PIN W5 [get_ports clk]</code></pre>
<div class="callout"><span class="badge">Đạt timing</span> Thiết kế mô phỏng đúng vẫn có thể hỏng trên phần cứng nếu trượt timing. Ràng buộc cho tool biết thế nào là "đủ nhanh".</div>`,
  ]]);

const c7q = quiz('fap201-quiz-7', 'Quiz 7 — Synthesis flow|||Quiz 7 — Quy trình tổng hợp', [
  { id: 'q1', question: 'Bước tổng hợp (synthesis) biến Verilog thành gì?', options: ['File bitstream', 'Netlist gồm LUT/FF', 'File waveform', 'Bảng chân trị'], correctIndex: 1, explanation: 'Synthesis biến mã HDL thành netlist các LUT/FF trước khi place & route.' },
  { id: 'q2', question: 'File cuối cùng dùng để cấu hình FPGA trên board là?', options: ['Netlist', 'Bitstream', 'Testbench', 'File XDC'], correctIndex: 1, explanation: 'write_bitstream tạo file nhị phân nạp xuống FPGA.' },
  { id: 'q3', question: 'File ràng buộc (XDC) dùng để khai điều gì?', options: ['Chu kỳ clock và vị trí chân', 'Nội dung LUT', 'Kích thước testbench', 'Số flip-flop tối đa'], correctIndex: 0, explanation: 'XDC khai clock period, gán chân (PACKAGE_PIN) để tool đóng timing.' },
]);

const c8 = doc('fap201-8-1-projects-ip', '8.1 — Projects & IP cores|||8.1 — Dự án & IP core',
  'Dự án thực hành: bộ đếm, UART, giao tiếp; dùng IP core có sẵn; tối ưu tài nguyên (LUT/FF/BRAM). Ví dụ bộ đếm 4-bit.',
  [[
    `<span class="eyebrow">FAP201 · Chapter 8 · Lesson 8.1</span>
<h2>Projects &amp; IP cores</h2>
<p>You now assemble the pieces into working designs. Classic first projects: a <strong>counter</strong>, then a <strong>UART</strong> (serial transmit/receive), then talking to peripherals.</p>
<ul>
<li><strong>IP cores</strong> — pre-built, verified blocks (FIFOs, memories, multipliers) you drop in instead of writing from scratch.</li>
<li><strong>Resource optimization</strong> — watch the LUT/FF/BRAM usage report; reuse logic and pick the right primitive to fit the device.</li>
</ul>
<pre><code>// 4-bit up counter
module counter4 (
  input  wire clk,
  input  wire rst,
  output reg  [3:0] count
);
  always @(posedge clk) begin
    if (rst) count &lt;= 4'b0000;
    else     count &lt;= count + 1'b1;
  end
endmodule</code></pre>
<div class="callout"><span class="badge">Build to learn</span> A counter driving LEDs, then a UART echoing characters to a PC — two small projects that exercise the whole flow end to end.</div>`,
    `<span class="eyebrow">FAP201 · Chương 8 · Bài 8.1</span>
<h2>Dự án &amp; IP core</h2>
<p>Giờ bạn ghép các mảnh thành thiết kế chạy được. Dự án đầu tay kinh điển: một <strong>bộ đếm</strong>, rồi <strong>UART</strong> (thu/phát nối tiếp), rồi giao tiếp ngoại vi.</p>
<ul>
<li><strong>IP core</strong> — khối dựng sẵn, đã kiểm (FIFO, bộ nhớ, bộ nhân) bạn cắm vào thay vì viết lại từ đầu.</li>
<li><strong>Tối ưu tài nguyên</strong> — theo dõi báo cáo dùng LUT/FF/BRAM; tái dùng logic và chọn đúng primitive để vừa thiết bị.</li>
</ul>
<pre><code>// Bộ đếm lên 4 bit
module counter4 (
  input  wire clk,
  input  wire rst,
  output reg  [3:0] count
);
  always @(posedge clk) begin
    if (rst) count &lt;= 4'b0000;
    else     count &lt;= count + 1'b1;
  end
endmodule</code></pre>
<div class="callout"><span class="badge">Học bằng làm</span> Một bộ đếm lái LED, rồi một UART vọng ký tự về PC — hai dự án nhỏ chạy trọn cả quy trình từ đầu đến cuối.</div>`,
  ]]);

const c8q = quiz('fap201-quiz-8', 'Quiz 8 — Projects & IP|||Quiz 8 — Dự án & IP', [
  { id: 'q1', question: 'IP core trong thiết kế FPGA là gì?', options: ['Một loại chân I/O', 'Khối chức năng dựng sẵn, đã kiểm, cắm vào tái dùng', 'Một lệnh Tcl', 'Tên của bitstream'], correctIndex: 1, explanation: 'IP core là block có sẵn (FIFO, RAM, nhân...) giúp khỏi viết lại từ đầu.' },
  { id: 'q2', question: 'Trong bộ đếm theo clock, câu lệnh nào tăng giá trị mỗi chu kỳ?', options: ['count <= count + 1', 'assign count = count + 1', 'initial count = 0', '#10 count'], correctIndex: 0, explanation: 'Gán không chặn count <= count + 1 trong always @(posedge clk) tăng mỗi chu kỳ.' },
  { id: 'q3', question: 'Tối ưu tài nguyên trên FPGA nghĩa là quan tâm đến?', options: ['Màu của board', 'Số LUT/FF/BRAM mà thiết kế dùng', 'Độ dài tên module', 'Số dòng comment'], correctIndex: 1, explanation: 'Theo dõi báo cáo LUT/FF/BRAM để thiết kế vừa thiết bị và chạy đủ nhanh.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'FAP201',
    slug: 'fap201-fpga-programming',
    title: 'FPGA Programming',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/FAP201.webp',
    shortDescription: 'Design digital hardware on FPGA with Verilog — FPGA architecture (LUT/FF/CLB), combinational & sequential logic, FSMs, testbench & simulation, the synthesis/place & route/bitstream flow in Vivado. Bilingual, with Verilog examples & quizzes.|||Thiết kế phần cứng số trên FPGA bằng Verilog — kiến trúc FPGA (LUT/FF/CLB), mạch tổ hợp & tuần tự, FSM, testbench & mô phỏng, quy trình tổng hợp/place & route/bitstream trong Vivado. Song ngữ, có ví dụ Verilog & quiz.',
    description: 'Môn <strong>FAP201 — FPGA Programming (Lập trình FPGA)</strong> thuộc ngành Thiết kế vi mạch bán dẫn (kỳ 4) dạy bạn thiết kế phần cứng số thật bằng <strong>Verilog HDL</strong> và nạp lên FPGA. Từ <strong>kiến trúc FPGA</strong> (LUT/FF/CLB, so ASIC/MCU) → <strong>cú pháp Verilog</strong> (module, port, wire/reg) → <strong>mạch tổ hợp</strong> (assign, always@*) → <strong>mạch tuần tự</strong> (flip-flop, thanh ghi) → <strong>máy trạng thái FSM</strong> → <strong>testbench &amp; mô phỏng</strong> → <strong>quy trình tổng hợp Vivado</strong> (synthesis, place &amp; route, timing, bitstream) → <strong>dự án bộ đếm/UART &amp; IP core</strong>. Bám sách Pong Chu và Harris, song ngữ, có ví dụ Verilog và quiz mỗi chương.',
    whatYouLearn: 'Kiến trúc FPGA (LUT/FF/CLB, routing, I/O); FPGA vs ASIC vs MCU; cú pháp Verilog (module, port, wire vs reg); mạch tổ hợp (assign, always@*, MUX, decoder, bẫy latch); mạch tuần tự (always@posedge clk, flip-flop D, reset, gán không chặn); FSM Moore/Mealy ba khối; testbench & mô phỏng waveform; quy trình Vivado synthesis → place & route → XDC → bitstream; dự án bộ đếm/UART, IP core & tối ưu tài nguyên.',
    requirements: 'Kiến thức logic số cơ bản (cổng, bảng chân trị, hệ nhị phân). Nên cài Vivado hoặc dùng mô phỏng trực tuyến (EDA Playground). Xem điều kiện tiên quyết của ngành trên FLM.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách Pong Chu/Harris, Vivado & nandland, YouTube, công cụ, lộ trình 4 bước.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'FPGA là gì, khác ASIC/MCU, mô tả phần cứng bằng HDL.', lessons: [intro] },
    { title: 'Chương 1 — FPGA là gì|||Chapter 1 — What is an FPGA', description: 'Kiến trúc LUT/FF/CLB/routing, FPGA vs ASIC vs MCU.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Nhập môn Verilog|||Chapter 2 — Verilog basics', description: 'module, port, wire/reg, cú pháp; half-adder.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Mạch tổ hợp|||Chapter 3 — Combinational', description: 'assign, always@*, MUX/decoder, bẫy latch.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Mạch tuần tự|||Chapter 4 — Sequential', description: 'always@posedge clk, flip-flop, thanh ghi, reset.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Máy trạng thái FSM|||Chapter 5 — FSM', description: 'FSM ba khối, Moore vs Mealy.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Testbench & mô phỏng|||Chapter 6 — Testbench', description: 'Testbench, simulation, waveform, verification.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Quy trình tổng hợp|||Chapter 7 — Synthesis flow', description: 'Vivado synthesis, place & route, XDC, bitstream.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Dự án & IP|||Chapter 8 — Projects & IP', description: 'Bộ đếm/UART, IP core, tối ưu tài nguyên.', lessons: [c8, c8q] },
  ],
};
