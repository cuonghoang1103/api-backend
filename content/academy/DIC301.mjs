/**
 * DIC301 — Digital ICs (Thiết kế mạch tích hợp số). Ngành Thiết kế vi mạch
 * bán dẫn, kỳ 7, FPTU. Giáo trình: Rabaey/Chandrakasan/Nikolic "Digital
 * Integrated Circuits: A Design Perspective"; Weste/Harris "CMOS VLSI Design";
 * Baker "CMOS Circuit Design"; Kang/Leblebici "CMOS Digital Integrated
 * Circuits". Song ngữ + công thức + ví dụ Verilog/SPICE + quiz.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick lồng/${; "&"→&amp;; "<"→&lt;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('dic301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình chuẩn (Rabaey, Weste/Harris, Baker, Kang/Leblebici), slide FLM, tài liệu miễn phí, YouTube, công cụ EDA, lộ trình tự học.',
  [[
    `<span class="eyebrow">DIC301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Digital Integrated Circuit design</strong> — CMOS gates, timing, interconnect, arithmetic, memory and low-power — in one place. The official FPTU slides &amp; syllabus live on <strong>FLM</strong>; below are the standard textbooks plus free, legal resources.</p>
<h3>📘 Standard textbooks</h3>
<ul>
<li>Rabaey, Chandrakasan &amp; Nikolic — <em>Digital Integrated Circuits: A Design Perspective</em> (the core reference for this course).</li>
<li>Weste &amp; Harris — <em>CMOS VLSI Design: A Circuits and Systems Perspective</em>.</li>
<li>Baker — <em>CMOS Circuit Design, Layout, and Simulation</em>.</li>
<li>Kang &amp; Leblebici — <em>CMOS Digital Integrated Circuits: Analysis and Design</em>.</li>
</ul>
<h3>📗 Slides &amp; syllabus</h3>
<p>The official FPTU giáo trình &amp; lecture slides for DIC301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>🌐 Free documentation</h3>
<ul>
<li><a href="https://ocw.mit.edu/courses/6-374-analysis-and-design-of-digital-integrated-circuits-fall-2003/" target="_blank" rel="noopener">MIT OpenCourseWare 6.374 — Digital Integrated Circuits</a></li>
<li><a href="https://pages.hmc.edu/harris/cmosvlsi/4e/index.html" target="_blank" rel="noopener">CMOS VLSI Design (Weste/Harris) — companion site &amp; slides</a></li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@nptelhrd" target="_blank" rel="noopener">NPTEL</a> — full VLSI &amp; digital IC lecture series</li>
<li><a href="https://www.youtube.com/@RobertBakerCMOS" target="_blank" rel="noopener">CMOS Circuit Design (Baker)</a> — companion videos</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://ngspice.sourceforge.io/" target="_blank" rel="noopener">ngspice</a> — free SPICE circuit simulator</li>
<li><a href="https://www.edaplayground.com/" target="_blank" rel="noopener">EDA Playground</a> — Verilog/SystemVerilog in the browser</li>
<li><a href="http://opencircuitdesign.com/magic/" target="_blank" rel="noopener">Magic VLSI</a> — open-source layout editor</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — the CMOS inverter: VTC, switching threshold, noise margins, propagation delay.</li>
<li><strong>Logic</strong> — build static CMOS and pass-transistor gates; size transistors for speed.</li>
<li><strong>Timing</strong> — latches, flip-flops, setup/hold, clock skew and timing closure.</li>
<li><strong>System</strong> — interconnect delay, dynamic logic, adders/multipliers, SRAM/DRAM, and low-power design.</li>
</ol></div>`,
    `<span class="eyebrow">DIC301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Thiết kế mạch tích hợp số</strong> — cổng CMOS, định thời, interconnect, mạch số học, bộ nhớ và tiết kiệm điện — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là các sách chuẩn cùng nguồn miễn phí, hợp pháp.</p>
<h3>📘 Sách giáo trình chuẩn</h3>
<ul>
<li>Rabaey, Chandrakasan &amp; Nikolic — <em>Digital Integrated Circuits: A Design Perspective</em> (sách lõi của môn).</li>
<li>Weste &amp; Harris — <em>CMOS VLSI Design: A Circuits and Systems Perspective</em>.</li>
<li>Baker — <em>CMOS Circuit Design, Layout, and Simulation</em>.</li>
<li>Kang &amp; Leblebici — <em>CMOS Digital Integrated Circuits: Analysis and Design</em>.</li>
</ul>
<h3>📗 Slide &amp; giáo trình</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của DIC301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>🌐 Tài liệu miễn phí</h3>
<ul>
<li><a href="https://ocw.mit.edu/courses/6-374-analysis-and-design-of-digital-integrated-circuits-fall-2003/" target="_blank" rel="noopener">MIT OpenCourseWare 6.374 — Digital Integrated Circuits</a></li>
<li><a href="https://pages.hmc.edu/harris/cmosvlsi/4e/index.html" target="_blank" rel="noopener">CMOS VLSI Design (Weste/Harris) — trang đồng hành &amp; slide</a></li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@nptelhrd" target="_blank" rel="noopener">NPTEL</a> — chuỗi bài giảng VLSI &amp; digital IC đầy đủ</li>
<li><a href="https://www.youtube.com/@RobertBakerCMOS" target="_blank" rel="noopener">CMOS Circuit Design (Baker)</a> — video đồng hành</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://ngspice.sourceforge.io/" target="_blank" rel="noopener">ngspice</a> — trình mô phỏng mạch SPICE miễn phí</li>
<li><a href="https://www.edaplayground.com/" target="_blank" rel="noopener">EDA Playground</a> — chạy Verilog/SystemVerilog trên trình duyệt</li>
<li><a href="http://opencircuitdesign.com/magic/" target="_blank" rel="noopener">Magic VLSI</a> — trình vẽ layout mã nguồn mở</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — inverter CMOS: VTC, ngưỡng chuyển, biên nhiễu, trễ lan truyền.</li>
<li><strong>Logic</strong> — dựng cổng CMOS tĩnh và pass-transistor; chỉnh kích thước transistor cho tốc độ.</li>
<li><strong>Định thời</strong> — latch, flip-flop, setup/hold, lệch xung nhịp và timing closure.</li>
<li><strong>Hệ thống</strong> — trễ interconnect, logic động, mạch cộng/nhân, SRAM/DRAM, và thiết kế tiết kiệm điện.</li>
</ol></div>`,
  ]]);

const intro = doc('dic301-0-1-overview', 'Course overview: Digital ICs|||Tổng quan: Thiết kế mạch tích hợp số',
  'Digital IC làm gì; công nghệ CMOS (NMOS + PMOS), vì sao thống trị; ba thước đo cốt lõi (tốc độ, công suất, diện tích); lộ trình 8 chương từ inverter đến low-power design.',
  [[
    `<span class="eyebrow">DIC301 · Lesson 0.1 · Overview</span>
<h2>Digital Integrated Circuits</h2>
<p class="lead">This course teaches <strong>how digital chips are built at the transistor level</strong> — the circuits underneath every processor, memory and ASIC. You'll analyze and design <strong>CMOS</strong> logic, reason about <strong>speed, power and area</strong>, and verify your ideas with <strong>SPICE</strong> and <strong>Verilog</strong>.</p>
<h3>Why CMOS?</h3>
<p><strong>Complementary MOS</strong> pairs an <strong>NMOS</strong> pull-down network with a <strong>PMOS</strong> pull-up network. In steady state one network is always off, so an ideal static CMOS gate draws <em>almost no</em> DC current — that low static power is why CMOS won over NMOS-only and bipolar logic and now dominates every chip.</p>
<h3>The three metrics</h3>
<ul>
<li><strong>Speed</strong> — propagation delay t<sub>p</sub>, set by capacitance, current drive and supply voltage.</li>
<li><strong>Power</strong> — dynamic (switching) plus static (leakage): P = &amp;alpha;·C·V<sub>DD</sub><sup>2</sup>·f + P<sub>leak</sub>.</li>
<li><strong>Area</strong> — number and size of transistors, and the interconnect between them.</li>
</ul>
<h3>Roadmap</h3>
<p>Inverter (DC &amp; switching) → combinational logic → sequential logic &amp; timing → interconnect &amp; wire delay → dynamic logic &amp; power → arithmetic circuits → memory → clocking, timing closure &amp; low-power. Bilingual, with formulas and Verilog/SPICE examples, plus a quiz each chapter.</p>`,
    `<span class="eyebrow">DIC301 · Bài 0.1 · Tổng quan</span>
<h2>Thiết kế mạch tích hợp số</h2>
<p class="lead">Môn này dạy <strong>chip số được dựng ở mức transistor thế nào</strong> — các mạch nằm dưới mọi bộ xử lý, bộ nhớ và ASIC. Bạn phân tích và thiết kế logic <strong>CMOS</strong>, cân nhắc <strong>tốc độ, công suất và diện tích</strong>, rồi kiểm chứng bằng <strong>SPICE</strong> và <strong>Verilog</strong>.</p>
<h3>Vì sao CMOS?</h3>
<p><strong>CMOS (MOS bù)</strong> ghép mạng kéo xuống <strong>NMOS</strong> với mạng kéo lên <strong>PMOS</strong>. Ở trạng thái ổn định luôn có một mạng tắt, nên cổng CMOS tĩnh lý tưởng gần như <em>không</em> tiêu dòng DC — công suất tĩnh thấp đó là lý do CMOS thắng logic NMOS thuần và bipolar, và nay thống trị mọi con chip.</p>
<h3>Ba thước đo</h3>
<ul>
<li><strong>Tốc độ</strong> — trễ lan truyền t<sub>p</sub>, quyết định bởi điện dung, dòng lái và điện áp nguồn.</li>
<li><strong>Công suất</strong> — động (chuyển mạch) cộng tĩnh (rò): P = &amp;alpha;·C·V<sub>DD</sub><sup>2</sup>·f + P<sub>rò</sub>.</li>
<li><strong>Diện tích</strong> — số lượng và kích thước transistor, cùng dây nối giữa chúng.</li>
</ul>
<h3>Lộ trình</h3>
<p>Inverter (DC &amp; chuyển mạch) → logic tổ hợp → logic tuần tự &amp; định thời → interconnect &amp; trễ dây → logic động &amp; công suất → mạch số học → bộ nhớ → xung nhịp, timing closure &amp; tiết kiệm điện. Song ngữ, có công thức và ví dụ Verilog/SPICE, kèm quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('dic301-1-1-cmos-inverter', '1.1 — CMOS inverter: DC & switching|||1.1 — Inverter CMOS: DC & chuyển mạch',
  'Cấu trúc PMOS+NMOS, đường đặc tuyến truyền VTC, ngưỡng chuyển VM, biên nhiễu NMH/NML, trễ lan truyền tp và mô hình RC; ví dụ SPICE.',
  [[
    `<span class="eyebrow">DIC301 · Chapter 1 · Lesson 1.1</span>
<h2>The CMOS inverter — DC &amp; switching</h2>
<h3>Structure</h3>
<p>An inverter is a <strong>PMOS on top</strong> (source to V<sub>DD</sub>) and an <strong>NMOS on the bottom</strong> (source to GND), gates tied together as the input, drains tied together as the output. Input low → PMOS on, output pulled to V<sub>DD</sub> (logic 1). Input high → NMOS on, output pulled to GND (logic 0).</p>
<h3>Voltage-transfer characteristic (VTC)</h3>
<p>Plotting V<sub>out</sub> vs V<sub>in</sub> gives the VTC. The <strong>switching threshold V<sub>M</sub></strong> is where V<sub>out</sub> = V<sub>in</sub>; by sizing (P/N ratio) you place V<sub>M</sub> near V<sub>DD</sub>/2 for balanced, symmetric noise margins.</p>
<ul>
<li><strong>NM<sub>H</sub></strong> = V<sub>OH</sub> &amp;minus; V<sub>IH</sub> — high-level noise margin.</li>
<li><strong>NM<sub>L</sub></strong> = V<sub>IL</sub> &amp;minus; V<sub>OL</sub> — low-level noise margin.</li>
</ul>
<h3>Switching &amp; delay</h3>
<p>The output load C<sub>L</sub> charges/discharges through the on-transistor's resistance R. Propagation delay: <strong>t<sub>p</sub> &amp;asymp; 0.69·R·C<sub>L</sub></strong> (each edge), so smaller R (wider device, higher V<sub>DD</sub>) and smaller C<sub>L</sub> make it faster.</p>
<pre><code>* SPICE: CMOS inverter, measure propagation delay
.include 'models.lib'
VDD vdd 0 1.2
Vin in 0 PULSE(0 1.2 0n 10p 10p 1n 2n)
MP out in vdd vdd pmos W=2u L=0.13u
MN out in 0   0   nmos W=1u L=0.13u
CL  out 0 10f
.tran 1p 4n
.measure tran tpHL TRIG v(in) VAL=0.6 RISE=1 TARG v(out) VAL=0.6 FALL=1
.end</code></pre>
<div class="callout"><span class="badge">Key idea</span> A static CMOS gate has <strong>no direct path</strong> from V<sub>DD</sub> to GND in steady state — that is the whole reason CMOS burns so little static power.</div>`,
    `<span class="eyebrow">DIC301 · Chương 1 · Bài 1.1</span>
<h2>Inverter CMOS — DC &amp; chuyển mạch</h2>
<h3>Cấu trúc</h3>
<p>Inverter là một <strong>PMOS ở trên</strong> (nguồn nối V<sub>DD</sub>) và một <strong>NMOS ở dưới</strong> (nguồn nối GND), hai cực cổng nối chung làm đầu vào, hai cực máng nối chung làm đầu ra. Vào thấp → PMOS dẫn, ra kéo lên V<sub>DD</sub> (logic 1). Vào cao → NMOS dẫn, ra kéo xuống GND (logic 0).</p>
<h3>Đặc tuyến truyền áp (VTC)</h3>
<p>Vẽ V<sub>out</sub> theo V<sub>in</sub> ta được VTC. <strong>Ngưỡng chuyển V<sub>M</sub></strong> là điểm V<sub>out</sub> = V<sub>in</sub>; bằng cách chỉnh kích thước (tỉ lệ P/N) bạn đặt V<sub>M</sub> gần V<sub>DD</sub>/2 để biên nhiễu cân bằng, đối xứng.</p>
<ul>
<li><strong>NM<sub>H</sub></strong> = V<sub>OH</sub> &amp;minus; V<sub>IH</sub> — biên nhiễu mức cao.</li>
<li><strong>NM<sub>L</sub></strong> = V<sub>IL</sub> &amp;minus; V<sub>OL</sub> — biên nhiễu mức thấp.</li>
</ul>
<h3>Chuyển mạch &amp; trễ</h3>
<p>Tải đầu ra C<sub>L</sub> nạp/xả qua điện trở R của transistor đang dẫn. Trễ lan truyền: <strong>t<sub>p</sub> &amp;asymp; 0.69·R·C<sub>L</sub></strong> (mỗi cạnh), nên R nhỏ hơn (device rộng hơn, V<sub>DD</sub> cao hơn) và C<sub>L</sub> nhỏ hơn làm nó nhanh hơn.</p>
<pre><code>* SPICE: inverter CMOS, đo trễ lan truyền
.include 'models.lib'
VDD vdd 0 1.2
Vin in 0 PULSE(0 1.2 0n 10p 10p 1n 2n)
MP out in vdd vdd pmos W=2u L=0.13u
MN out in 0   0   nmos W=1u L=0.13u
CL  out 0 10f
.tran 1p 4n
.measure tran tpHL TRIG v(in) VAL=0.6 RISE=1 TARG v(out) VAL=0.6 FALL=1
.end</code></pre>
<div class="callout"><span class="badge">Ý chính</span> Cổng CMOS tĩnh <strong>không có đường thông</strong> từ V<sub>DD</sub> xuống GND ở trạng thái ổn định — đó chính là lý do CMOS tốn rất ít công suất tĩnh.</div>`,
  ]]);

const c1q = quiz('dic301-quiz-1', 'Quiz 1 — CMOS inverter|||Quiz 1 — Inverter CMOS', [
  { id: 'q1', question: 'Ngưỡng chuyển VM của inverter thường được đặt ở đâu để biên nhiễu cân bằng?', options: ['Gần 0V', 'Gần VDD', 'Gần VDD/2', 'Gần điện áp ngưỡng Vt'], correctIndex: 2, explanation: 'Đặt VM ≈ VDD/2 (qua tỉ lệ P/N) cho NMH và NML cân bằng, đối xứng.' },
  { id: 'q2', question: 'Trễ lan truyền của inverter xấp xỉ theo công thức nào?', options: ['tp ≈ 0.69·R·CL', 'tp ≈ R + CL', 'tp ≈ CL / VDD', 'tp ≈ R·CL²'], correctIndex: 0, explanation: 'tp ≈ 0.69·R·CL — tải CL nạp/xả qua điện trở R của transistor đang dẫn.' },
  { id: 'q3', question: 'Vì sao cổng CMOS tĩnh tiêu rất ít công suất tĩnh (DC)?', options: ['Vì luôn có dòng chảy nhỏ', 'Vì ở trạng thái ổn định không có đường thông từ VDD xuống GND', 'Vì PMOS và NMOS cùng bật', 'Vì dùng điện áp âm'], correctIndex: 1, explanation: 'Ở trạng thái ổn định một mạng luôn tắt, nên không có đường dẫn trực tiếp VDD→GND.' },
]);

const c2 = doc('dic301-2-1-combinational', '2.1 — Combinational logic|||2.1 — Logic tổ hợp',
  'Static CMOS bù (mạng PUN PMOS + PDN NMOS đối ngẫu), quy tắc dựng cổng NAND/NOR, chỉnh kích thước, và pass-transistor / transmission gate; ví dụ Verilog.',
  [[
    `<span class="eyebrow">DIC301 · Chapter 2 · Lesson 2.1</span>
<h2>Combinational logic</h2>
<h3>Complementary static CMOS</h3>
<p>Every static CMOS gate has two <strong>dual</strong> networks: a <strong>PUN</strong> (pull-up, PMOS) to V<sub>DD</sub> and a <strong>PDN</strong> (pull-down, NMOS) to GND. Series in one = parallel in the other. To build the PDN for a function, put transistors <strong>in series for AND</strong> and <strong>in parallel for OR</strong>; the PUN is its dual.</p>
<ul>
<li>An <strong>N-input</strong> gate uses <strong>2N</strong> transistors.</li>
<li>CMOS gates are naturally <strong>inverting</strong> (NAND, NOR, AOI) — AND/OR need an extra inverter.</li>
</ul>
<h3>Sizing</h3>
<p>Because PMOS carries less current per width, and series devices add resistance, transistors are widened so the worst-case path matches a reference inverter's drive — this keeps delay predictable.</p>
<h3>Pass-transistor &amp; transmission gate</h3>
<p><strong>Pass-transistor logic</strong> passes inputs through transistors, using fewer devices — but a single NMOS passes a weak 1 (drops a V<sub>t</sub>). A <strong>transmission gate</strong> (NMOS + PMOS in parallel) passes both 0 and 1 cleanly, ideal for muxes and latches.</p>
<pre><code>// Verilog: 2-input NAND (behavioral) and a 2:1 mux
module nand2(output y, input a, b);
  assign y = ~(a &amp; b);
endmodule

module mux2(output y, input a, b, sel);
  assign y = sel ? b : a;   // maps to a transmission-gate mux
endmodule</code></pre>
<div class="callout"><span class="badge">Rule of thumb</span> Series in the PDN → parallel in the PUN, and vice-versa. Draw the PDN first, then mirror it.</div>`,
    `<span class="eyebrow">DIC301 · Chương 2 · Bài 2.1</span>
<h2>Logic tổ hợp</h2>
<h3>CMOS tĩnh bù</h3>
<p>Mỗi cổng CMOS tĩnh có hai mạng <strong>đối ngẫu</strong>: <strong>PUN</strong> (kéo lên, PMOS) tới V<sub>DD</sub> và <strong>PDN</strong> (kéo xuống, NMOS) tới GND. Nối tiếp ở mạng này = song song ở mạng kia. Để dựng PDN cho một hàm, đặt transistor <strong>nối tiếp cho AND</strong> và <strong>song song cho OR</strong>; PUN là đối ngẫu của nó.</p>
<ul>
<li>Cổng <strong>N đầu vào</strong> dùng <strong>2N</strong> transistor.</li>
<li>Cổng CMOS bản chất là <strong>đảo</strong> (NAND, NOR, AOI) — AND/OR cần thêm một inverter.</li>
</ul>
<h3>Chỉnh kích thước</h3>
<p>Vì PMOS tải ít dòng hơn trên cùng bề rộng, và device nối tiếp cộng điện trở, transistor được nới rộng để đường xấu nhất khớp dòng lái của một inverter tham chiếu — nhờ đó trễ dự đoán được.</p>
<h3>Pass-transistor &amp; transmission gate</h3>
<p><strong>Logic pass-transistor</strong> cho tín hiệu đi xuyên qua transistor, dùng ít device hơn — nhưng một NMOS đơn truyền mức 1 yếu (mất một V<sub>t</sub>). <strong>Transmission gate</strong> (NMOS + PMOS song song) truyền cả 0 lẫn 1 trọn vẹn, lý tưởng cho mux và latch.</p>
<pre><code>// Verilog: cổng NAND 2 đầu vào và mux 2:1
module nand2(output y, input a, b);
  assign y = ~(a &amp; b);
endmodule

module mux2(output y, input a, b, sel);
  assign y = sel ? b : a;   // ánh xạ sang mux dùng transmission gate
endmodule</code></pre>
<div class="callout"><span class="badge">Mẹo</span> Nối tiếp ở PDN → song song ở PUN, và ngược lại. Vẽ PDN trước rồi soi gương ra PUN.</div>`,
  ]]);

const c2q = quiz('dic301-quiz-2', 'Quiz 2 — Combinational logic|||Quiz 2 — Logic tổ hợp', [
  { id: 'q1', question: 'Trong static CMOS, để dựng PDN thực hiện phép AND thì các NMOS mắc thế nào?', options: ['Song song', 'Nối tiếp', 'Đối ngẫu chéo', 'Không dùng NMOS'], correctIndex: 1, explanation: 'AND → nối tiếp trong PDN; OR → song song. PUN là mạng đối ngẫu.' },
  { id: 'q2', question: 'Một cổng static CMOS N đầu vào dùng bao nhiêu transistor?', options: ['N', '2N', 'N²', 'N+1'], correctIndex: 1, explanation: 'Mỗi đầu vào có 1 PMOS ở PUN và 1 NMOS ở PDN → tổng 2N.' },
  { id: 'q3', question: 'Vì sao dùng transmission gate (NMOS+PMOS song song) thay cho một NMOS đơn?', options: ['Để tiết kiệm transistor', 'Để truyền cả mức 0 và 1 trọn vẹn, không mất Vt', 'Để tăng công suất tĩnh', 'Vì NMOS không dẫn được'], correctIndex: 1, explanation: 'NMOS đơn truyền mức 1 yếu (mất một Vt); transmission gate truyền cả 0 và 1 đầy đủ.' },
]);

const c3 = doc('dic301-3-1-sequential', '3.1 — Sequential logic & timing|||3.1 — Logic tuần tự & định thời',
  'Latch (mức) vs flip-flop (cạnh), cấu trúc master-slave, ràng buộc setup/hold, thời gian clk-to-Q, và metastability; ví dụ Verilog D flip-flop.',
  [[
    `<span class="eyebrow">DIC301 · Chapter 3 · Lesson 3.1</span>
<h2>Sequential logic &amp; timing</h2>
<h3>Latch vs flip-flop</h3>
<p>A <strong>latch</strong> is level-sensitive — transparent while the clock is at one level. A <strong>flip-flop</strong> is edge-triggered — it samples only on the clock edge. A common edge-triggered flip-flop is a <strong>master-slave</strong> pair of opposite-phase latches.</p>
<h3>Timing constraints</h3>
<ul>
<li><strong>Setup time (t<sub>su</sub>)</strong> — data must be stable <em>before</em> the clock edge.</li>
<li><strong>Hold time (t<sub>h</sub>)</strong> — data must stay stable <em>after</em> the edge.</li>
<li><strong>Clk-to-Q (t<sub>cq</sub>)</strong> — delay from edge to output valid.</li>
</ul>
<p>Max clock period for a pipeline stage: <strong>T &amp;ge; t<sub>cq</sub> + t<sub>logic</sub> + t<sub>su</sub></strong>. Violate setup → run slower; violate hold → the design is broken at any speed.</p>
<h3>Metastability</h3>
<p>If data changes inside the setup/hold window the flip-flop can hover between 0 and 1 for an unbounded time. Synchronize asynchronous inputs with two or more flip-flops to shrink the failure probability.</p>
<pre><code>// Verilog: positive-edge D flip-flop with async reset
module dff(output reg q, input d, clk, rst_n);
  always @(posedge clk or negedge rst_n)
    if (!rst_n) q &lt;= 1'b0;   // non-blocking assign
    else        q &lt;= d;
endmodule</code></pre>
<div class="callout"><span class="badge">Watch out</span> Use non-blocking (&lt;=) for sequential logic and blocking (=) for combinational — mixing them causes simulation/synthesis mismatches.</div>`,
    `<span class="eyebrow">DIC301 · Chương 3 · Bài 3.1</span>
<h2>Logic tuần tự &amp; định thời</h2>
<h3>Latch so với flip-flop</h3>
<p><strong>Latch</strong> nhạy theo mức — trong suốt khi xung nhịp ở một mức. <strong>Flip-flop</strong> kích theo cạnh — chỉ lấy mẫu tại cạnh xung. Một flip-flop kích cạnh phổ biến là cặp <strong>master-slave</strong> gồm hai latch ngược pha.</p>
<h3>Ràng buộc định thời</h3>
<ul>
<li><strong>Setup (t<sub>su</sub>)</strong> — dữ liệu phải ổn định <em>trước</em> cạnh xung.</li>
<li><strong>Hold (t<sub>h</sub>)</strong> — dữ liệu phải giữ ổn định <em>sau</em> cạnh xung.</li>
<li><strong>Clk-to-Q (t<sub>cq</sub>)</strong> — trễ từ cạnh xung đến khi đầu ra hợp lệ.</li>
</ul>
<p>Chu kỳ xung tối thiểu cho một tầng pipeline: <strong>T &amp;ge; t<sub>cq</sub> + t<sub>logic</sub> + t<sub>su</sub></strong>. Vi phạm setup → chạy chậm lại; vi phạm hold → thiết kế hỏng ở mọi tốc độ.</p>
<h3>Metastability (trạng thái nửa vời)</h3>
<p>Nếu dữ liệu đổi bên trong cửa sổ setup/hold, flip-flop có thể lơ lửng giữa 0 và 1 trong thời gian không xác định. Đồng bộ tín hiệu bất đồng bộ bằng hai flip-flop trở lên để giảm xác suất lỗi.</p>
<pre><code>// Verilog: D flip-flop kích cạnh lên, reset bất đồng bộ
module dff(output reg q, input d, clk, rst_n);
  always @(posedge clk or negedge rst_n)
    if (!rst_n) q &lt;= 1'b0;   // gán non-blocking
    else        q &lt;= d;
endmodule</code></pre>
<div class="callout"><span class="badge">Lưu ý</span> Dùng non-blocking (&lt;=) cho logic tuần tự và blocking (=) cho logic tổ hợp — trộn lẫn gây lệch giữa mô phỏng và tổng hợp.</div>`,
  ]]);

const c3q = quiz('dic301-quiz-3', 'Quiz 3 — Sequential & timing|||Quiz 3 — Tuần tự & định thời', [
  { id: 'q1', question: 'Khác biệt chính giữa latch và flip-flop là gì?', options: ['Latch nhanh hơn flip-flop', 'Latch nhạy theo mức; flip-flop kích theo cạnh', 'Flip-flop không cần xung nhịp', 'Chúng giống hệt nhau'], correctIndex: 1, explanation: 'Latch trong suốt theo mức xung; flip-flop chỉ lấy mẫu tại cạnh xung.' },
  { id: 'q2', question: 'Chu kỳ xung nhịp tối thiểu của một tầng pipeline thỏa điều kiện nào?', options: ['T ≥ tcq + tlogic + tsu', 'T ≥ tsu − th', 'T ≥ tcq × tlogic', 'T ≤ th'], correctIndex: 0, explanation: 'T ≥ tcq + tlogic + tsu — cộng trễ clk-to-Q, trễ logic và thời gian setup.' },
  { id: 'q3', question: 'Trong Verilog, nên dùng phép gán nào cho logic tuần tự (trong always @(posedge clk))?', options: ['Blocking (=)', 'Non-blocking (<=)', 'assign liên tục', 'Cả hai trộn lẫn'], correctIndex: 1, explanation: 'Non-blocking (<=) cho tuần tự; blocking (=) cho tổ hợp — tránh lệch mô phỏng/tổng hợp.' },
]);

const c4 = doc('dic301-4-1-interconnect', '4.1 — Interconnect & wire delay|||4.1 — Interconnect & trễ dây',
  'Dây không còn lý tưởng: điện trở + điện dung phân bố, mô hình RC, trễ Elmore, tại sao trễ dây tăng theo bình phương chiều dài, và chèn repeater/buffer.',
  [[
    `<span class="eyebrow">DIC301 · Chapter 4 · Lesson 4.1</span>
<h2>Interconnect &amp; wire delay</h2>
<h3>Wires are not ideal</h3>
<p>As transistors shrank, the <strong>wire</strong> became a first-class delay source. A wire has distributed <strong>resistance R</strong> and <strong>capacitance C</strong> per unit length; long wires behave like a distributed RC line, not a plain node.</p>
<h3>Elmore delay</h3>
<p>For a wire of length L with resistance r and capacitance c per unit length, the lumped RC delay is <strong>t &amp;asymp; 0.5·r·c·L<sup>2</sup></strong> — it grows with the <em>square</em> of length. Doubling a wire quadruples its delay.</p>
<h3>Repeater insertion</h3>
<p>Because delay is quadratic, splitting a long wire into <strong>k segments with buffers</strong> makes total delay grow linearly instead. There is an optimal number and size of repeaters that minimizes delay — a standard step in physical design.</p>
<pre><code>Wire RC delay (distributed vs buffered):
  no buffer:   t = 0.5 * r*c * L^2        (quadratic in L)
  k segments:  t = 0.5 * r*c * L^2 / k  +  k * t_buffer
  minimize over k  -> optimal repeater count</code></pre>
<div class="callout"><span class="badge">Why it matters</span> In modern nodes, interconnect can dominate a critical path. You cannot ignore the wire — you size it, space it, and buffer it.</div>`,
    `<span class="eyebrow">DIC301 · Chương 4 · Bài 4.1</span>
<h2>Interconnect &amp; trễ dây</h2>
<h3>Dây không lý tưởng</h3>
<p>Khi transistor thu nhỏ, <strong>dây nối</strong> trở thành nguồn gây trễ hạng nhất. Dây có <strong>điện trở R</strong> và <strong>điện dung C</strong> phân bố trên mỗi đơn vị dài; dây dài hành xử như đường RC phân bố, không phải một nút đơn giản.</p>
<h3>Trễ Elmore</h3>
<p>Với dây dài L có điện trở r và điện dung c trên đơn vị dài, trễ RC gộp là <strong>t &amp;asymp; 0.5·r·c·L<sup>2</sup></strong> — nó tăng theo <em>bình phương</em> chiều dài. Dây dài gấp đôi thì trễ gấp bốn.</p>
<h3>Chèn repeater</h3>
<p>Vì trễ là bậc hai, chia một dây dài thành <strong>k đoạn có buffer</strong> khiến tổng trễ tăng tuyến tính thay vì bình phương. Có một số lượng và kích thước repeater tối ưu làm trễ nhỏ nhất — một bước chuẩn trong thiết kế vật lý.</p>
<pre><code>Trễ RC của dây (phân bố vs có buffer):
  không buffer:  t = 0.5 * r*c * L^2        (bậc hai theo L)
  k đoạn:        t = 0.5 * r*c * L^2 / k  +  k * t_buffer
  tối ưu theo k  -> số repeater tối ưu</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Ở các công nghệ hiện đại, interconnect có thể chiếm phần lớn đường tới hạn. Không thể bỏ qua dây — phải chỉnh bề rộng, khoảng cách và chèn buffer cho nó.</div>`,
  ]]);

const c4q = quiz('dic301-quiz-4', 'Quiz 4 — Interconnect|||Quiz 4 — Interconnect', [
  { id: 'q1', question: 'Trễ RC của một dây dài L (không buffer) tỉ lệ với gì?', options: ['L (tuyến tính)', 'L² (bình phương)', '1/L', 'log L'], correctIndex: 1, explanation: 't ≈ 0.5·r·c·L² — trễ dây tăng theo bình phương chiều dài.' },
  { id: 'q2', question: 'Chèn repeater/buffer vào một dây dài giúp gì?', options: ['Giảm số transistor', 'Biến trễ từ bậc hai thành gần tuyến tính theo chiều dài', 'Tăng điện dung dây', 'Loại bỏ hoàn toàn điện trở'], correctIndex: 1, explanation: 'Chia dây thành k đoạn có buffer làm tổng trễ tăng tuyến tính thay vì bình phương.' },
  { id: 'q3', question: 'Vì sao interconnect ngày càng quan trọng ở công nghệ hiện đại?', options: ['Vì transistor chậm đi', 'Vì khi transistor thu nhỏ, trễ dây có thể chiếm phần lớn đường tới hạn', 'Vì dây không có điện dung', 'Vì xung nhịp giảm'], correctIndex: 1, explanation: 'Transistor nhanh lên nhưng dây không, nên trễ interconnect có thể áp đảo critical path.' },
]);

const c5 = doc('dic301-5-1-dynamic-power', '5.1 — Dynamic logic & power dissipation|||5.1 — Logic động & tiêu tán công suất',
  'Logic động (precharge/evaluate), domino, ưu/nhược so với static; ba thành phần công suất: động, ngắn mạch, rò; công thức P và cách hạ.',
  [[
    `<span class="eyebrow">DIC301 · Chapter 5 · Lesson 5.1</span>
<h2>Dynamic logic &amp; power dissipation</h2>
<h3>Dynamic logic</h3>
<p><strong>Dynamic gates</strong> work in two phases: <strong>precharge</strong> (clock low, output pulled to V<sub>DD</sub> by a PMOS) and <strong>evaluate</strong> (clock high, an NMOS pull-down network conditionally discharges). Fewer transistors and lower capacitance make them fast — but they are sensitive to charge sharing and leakage. <strong>Domino logic</strong> adds an inverter so gates can cascade.</p>
<h3>Where the power goes</h3>
<ul>
<li><strong>Dynamic (switching)</strong> — P<sub>dyn</sub> = &amp;alpha;·C<sub>L</sub>·V<sub>DD</sub><sup>2</sup>·f. Usually the biggest term; note the <strong>V<sub>DD</sub> squared</strong>.</li>
<li><strong>Short-circuit</strong> — brief V<sub>DD</sub>-to-GND current while both devices conduct during a transition.</li>
<li><strong>Static (leakage)</strong> — subthreshold and gate leakage, always flowing; dominant at small nodes.</li>
</ul>
<h3>How to cut power</h3>
<p>The V<sub>DD</sub><sup>2</sup> term makes <strong>lowering supply voltage</strong> the strongest lever. Also reduce activity &amp;alpha; (clock gating), capacitance, and frequency where speed allows.</p>
<pre><code>P_total = alpha * C * VDD^2 * f      (dynamic)
        + I_sc * VDD                 (short-circuit)
        + I_leak * VDD               (static / leakage)
// halving VDD cuts dynamic power ~4x (but slows the gate)</code></pre>
<div class="callout"><span class="badge">Key lever</span> Because P<sub>dyn</sub> scales with V<sub>DD</sub><sup>2</sup>, voltage scaling is the single most powerful energy-saving knob in digital design.</div>`,
    `<span class="eyebrow">DIC301 · Chương 5 · Bài 5.1</span>
<h2>Logic động &amp; tiêu tán công suất</h2>
<h3>Logic động</h3>
<p><strong>Cổng động</strong> chạy hai pha: <strong>precharge</strong> (xung thấp, PMOS kéo ra lên V<sub>DD</sub>) và <strong>evaluate</strong> (xung cao, mạng NMOS kéo xuống xả có điều kiện). Ít transistor và điện dung thấp làm chúng nhanh — nhưng nhạy với chia sẻ điện tích và rò. <strong>Domino logic</strong> thêm một inverter để các cổng nối tầng được.</p>
<h3>Công suất đi đâu</h3>
<ul>
<li><strong>Động (chuyển mạch)</strong> — P<sub>dyn</sub> = &amp;alpha;·C<sub>L</sub>·V<sub>DD</sub><sup>2</sup>·f. Thường là số hạng lớn nhất; chú ý <strong>V<sub>DD</sub> bình phương</strong>.</li>
<li><strong>Ngắn mạch</strong> — dòng V<sub>DD</sub>→GND thoáng qua khi cả hai device cùng dẫn lúc chuyển trạng thái.</li>
<li><strong>Tĩnh (rò)</strong> — rò dưới ngưỡng và rò cổng, luôn chảy; áp đảo ở công nghệ nhỏ.</li>
</ul>
<h3>Cách hạ công suất</h3>
<p>Số hạng V<sub>DD</sub><sup>2</sup> khiến <strong>hạ điện áp nguồn</strong> là đòn bẩy mạnh nhất. Ngoài ra giảm hoạt động &amp;alpha; (clock gating), điện dung, và tần số ở nơi tốc độ cho phép.</p>
<pre><code>P_total = alpha * C * VDD^2 * f      (động)
        + I_sc * VDD                 (ngắn mạch)
        + I_leak * VDD               (tĩnh / rò)
// giảm VDD một nửa hạ công suất động ~4 lần (nhưng cổng chậm lại)</code></pre>
<div class="callout"><span class="badge">Đòn bẩy chính</span> Vì P<sub>dyn</sub> tỉ lệ V<sub>DD</sub><sup>2</sup>, hạ điện áp là nút chỉnh tiết kiệm năng lượng mạnh nhất trong thiết kế số.</div>`,
  ]]);

const c5q = quiz('dic301-quiz-5', 'Quiz 5 — Dynamic logic & power|||Quiz 5 — Logic động & công suất', [
  { id: 'q1', question: 'Công suất động (switching) của một cổng CMOS tỉ lệ với điện áp nguồn theo kiểu nào?', options: ['Tuyến tính với VDD', 'Với VDD bình phương (VDD²)', 'Không phụ thuộc VDD', 'Với căn bậc hai của VDD'], correctIndex: 1, explanation: 'Pdyn = α·C·VDD²·f — nên hạ VDD là đòn bẩy tiết kiệm điện mạnh nhất.' },
  { id: 'q2', question: 'Logic động chạy theo hai pha nào?', options: ['Setup và hold', 'Precharge và evaluate', 'AND và OR', 'Nạp và ổn áp'], correctIndex: 1, explanation: 'Precharge (kéo ra lên VDD) rồi evaluate (mạng NMOS xả có điều kiện).' },
  { id: 'q3', question: 'Ở công nghệ rất nhỏ, thành phần công suất nào ngày càng áp đảo?', options: ['Công suất động', 'Công suất ngắn mạch', 'Công suất tĩnh (rò dòng)', 'Công suất cơ học'], correctIndex: 2, explanation: 'Rò dưới ngưỡng và rò cổng (công suất tĩnh) tăng mạnh khi kích thước co lại.' },
]);

const c6 = doc('dic301-6-1-arithmetic', '6.1 — Arithmetic circuits|||6.1 — Mạch số học',
  'Bộ cộng đầy đủ (sum/carry), ripple-carry và trễ dồn carry, carry-lookahead để tăng tốc, ý tưởng nhân (mảng partial products); ví dụ Verilog full adder.',
  [[
    `<span class="eyebrow">DIC301 · Chapter 6 · Lesson 6.1</span>
<h2>Arithmetic circuits</h2>
<h3>The full adder</h3>
<p>The <strong>full adder</strong> adds three bits (a, b, carry-in) into a sum and carry-out:</p>
<ul>
<li><strong>Sum</strong> = a &amp;oplus; b &amp;oplus; c<sub>in</sub></li>
<li><strong>Carry-out</strong> = a·b + c<sub>in</sub>·(a &amp;oplus; b)</li>
</ul>
<h3>Ripple-carry vs carry-lookahead</h3>
<p>A <strong>ripple-carry adder</strong> chains N full adders; the carry ripples through all of them, so delay grows <strong>linearly with N</strong> — the carry chain is the critical path. A <strong>carry-lookahead adder</strong> computes <em>generate</em> (g = a·b) and <em>propagate</em> (p = a &amp;oplus; b) signals to produce carries in parallel, cutting delay to roughly <strong>log N</strong>.</p>
<h3>Multipliers</h3>
<p>A multiplier forms a matrix of <strong>partial products</strong> (AND terms) and sums them with an adder tree (e.g. a Wallace tree) — trading area for speed.</p>
<pre><code>// Verilog: 1-bit full adder
module full_adder(output sum, cout, input a, b, cin);
  assign sum  = a ^ b ^ cin;
  assign cout = (a &amp; b) | (cin &amp; (a ^ b));
endmodule</code></pre>
<div class="callout"><span class="badge">Trade-off</span> Ripple-carry is small but slow (O(N)); carry-lookahead is fast (O(log N)) but bigger. Adder choice is a classic area-vs-speed decision.</div>`,
    `<span class="eyebrow">DIC301 · Chương 6 · Bài 6.1</span>
<h2>Mạch số học</h2>
<h3>Bộ cộng đầy đủ (full adder)</h3>
<p><strong>Full adder</strong> cộng ba bit (a, b, carry-in) ra tổng và carry-out:</p>
<ul>
<li><strong>Sum</strong> = a &amp;oplus; b &amp;oplus; c<sub>in</sub></li>
<li><strong>Carry-out</strong> = a·b + c<sub>in</sub>·(a &amp;oplus; b)</li>
</ul>
<h3>Ripple-carry so với carry-lookahead</h3>
<p><strong>Bộ cộng ripple-carry</strong> nối chuỗi N full adder; carry dồn qua tất cả, nên trễ tăng <strong>tuyến tính theo N</strong> — chuỗi carry là đường tới hạn. <strong>Bộ cộng carry-lookahead</strong> tính tín hiệu <em>generate</em> (g = a·b) và <em>propagate</em> (p = a &amp;oplus; b) để sinh carry song song, giảm trễ còn khoảng <strong>log N</strong>.</p>
<h3>Bộ nhân</h3>
<p>Bộ nhân tạo ma trận <strong>tích riêng phần (partial products)</strong> (các số hạng AND) rồi cộng bằng cây cộng (vd cây Wallace) — đánh đổi diện tích lấy tốc độ.</p>
<pre><code>// Verilog: full adder 1 bit
module full_adder(output sum, cout, input a, b, cin);
  assign sum  = a ^ b ^ cin;
  assign cout = (a &amp; b) | (cin &amp; (a ^ b));
endmodule</code></pre>
<div class="callout"><span class="badge">Đánh đổi</span> Ripple-carry nhỏ nhưng chậm (O(N)); carry-lookahead nhanh (O(log N)) nhưng lớn hơn. Chọn bộ cộng là bài toán diện tích - tốc độ kinh điển.</div>`,
  ]]);

const c6q = quiz('dic301-quiz-6', 'Quiz 6 — Arithmetic|||Quiz 6 — Mạch số học', [
  { id: 'q1', question: 'Đầu ra Sum của một full adder là biểu thức nào?', options: ['a AND b AND cin', 'a XOR b XOR cin', 'a OR b OR cin', 'a NAND b'], correctIndex: 1, explanation: 'Sum = a ⊕ b ⊕ cin; carry-out = a·b + cin·(a⊕b).' },
  { id: 'q2', question: 'Trễ của bộ cộng ripple-carry N bit tăng theo?', options: ['O(1) hằng số', 'O(N) tuyến tính do carry dồn qua N tầng', 'O(log N)', 'O(N²)'], correctIndex: 1, explanation: 'Carry phải dồn qua cả N full adder → trễ tuyến tính theo N.' },
  { id: 'q3', question: 'Carry-lookahead nhanh hơn ripple-carry nhờ đâu?', options: ['Dùng ít transistor hơn', 'Tính generate/propagate để sinh carry song song (≈ log N)', 'Bỏ qua bit carry', 'Chạy ở điện áp thấp hơn'], correctIndex: 1, explanation: 'Tín hiệu g=a·b và p=a⊕b cho phép tính carry song song, giảm trễ còn ~log N.' },
]);

const c7 = doc('dic301-7-1-memory', '7.1 — Memory: SRAM, DRAM, ROM|||7.1 — Bộ nhớ: SRAM, DRAM, ROM',
  'Ô SRAM 6T (hai inverter chéo, đọc/ghi qua bitline), ô DRAM 1T1C (tụ + làm tươi), ROM (nội dung cố định); so tốc độ, mật độ, giữ dữ liệu.',
  [[
    `<span class="eyebrow">DIC301 · Chapter 7 · Lesson 7.1</span>
<h2>Memory: SRAM, DRAM, ROM</h2>
<h3>SRAM — 6T cell</h3>
<p>A <strong>6-transistor SRAM cell</strong> is two cross-coupled inverters (storing a bit and its complement) plus two access transistors to the bitlines, gated by the wordline. It is <strong>fast</strong> and holds data as long as power is on (static) — but 6 transistors per bit means <strong>lower density</strong>. Used for caches and registers.</p>
<h3>DRAM — 1T1C cell</h3>
<p>A <strong>DRAM cell</strong> is one transistor and one capacitor. The bit is charge on the capacitor — very <strong>dense</strong>, but the charge leaks away, so DRAM must be <strong>refreshed</strong> periodically, and reads are <em>destructive</em> (charge is restored after). Used for main memory.</p>
<h3>ROM</h3>
<p><strong>ROM</strong> stores fixed content, defined by the presence/absence of a transistor at each cell — non-volatile, read-only in normal use. Good for boot code and constant tables.</p>
<pre><code>Compare:
  SRAM  6T   fast   volatile   low density   -> caches
  DRAM  1T1C slower volatile   high density  -> main memory (needs refresh)
  ROM   ~1T  fast   non-volatile fixed data  -> firmware / tables</code></pre>
<div class="callout"><span class="badge">Trade-off</span> SRAM trades density for speed; DRAM trades speed (and refresh overhead) for density. The memory hierarchy uses both deliberately.</div>`,
    `<span class="eyebrow">DIC301 · Chương 7 · Bài 7.1</span>
<h2>Bộ nhớ: SRAM, DRAM, ROM</h2>
<h3>SRAM — ô 6T</h3>
<p>Một <strong>ô SRAM 6 transistor</strong> là hai inverter nối chéo (lưu một bit và bù của nó) cộng hai transistor truy cập nối tới bitline, đóng/mở bởi wordline. Nó <strong>nhanh</strong> và giữ dữ liệu chừng nào còn điện (tĩnh) — nhưng 6 transistor mỗi bit nghĩa là <strong>mật độ thấp</strong>. Dùng cho cache và thanh ghi.</p>
<h3>DRAM — ô 1T1C</h3>
<p>Một <strong>ô DRAM</strong> gồm một transistor và một tụ. Bit là điện tích trên tụ — rất <strong>đặc (mật độ cao)</strong>, nhưng điện tích rò dần, nên DRAM phải <strong>làm tươi (refresh)</strong> định kỳ, và đọc là <em>phá hủy</em> (điện tích được phục hồi sau đó). Dùng cho bộ nhớ chính.</p>
<h3>ROM</h3>
<p><strong>ROM</strong> lưu nội dung cố định, xác định bởi có/không có transistor tại mỗi ô — không bay hơi, chỉ đọc trong dùng thường. Tốt cho mã khởi động và bảng hằng số.</p>
<pre><code>So sánh:
  SRAM  6T   nhanh   bay hơi   mật độ thấp   -> cache
  DRAM  1T1C chậm hơn bay hơi  mật độ cao    -> bộ nhớ chính (cần refresh)
  ROM   ~1T  nhanh   không bay hơi dữ liệu cố định -> firmware / bảng</code></pre>
<div class="callout"><span class="badge">Đánh đổi</span> SRAM đổi mật độ lấy tốc độ; DRAM đổi tốc độ (và chi phí refresh) lấy mật độ. Phân cấp bộ nhớ dùng cả hai một cách có chủ đích.</div>`,
  ]]);

const c7q = quiz('dic301-quiz-7', 'Quiz 7 — Memory|||Quiz 7 — Bộ nhớ', [
  { id: 'q1', question: 'Ô SRAM chuẩn dùng bao nhiêu transistor và cấu trúc lưu bit ra sao?', options: ['1 transistor + 1 tụ', '6 transistor: hai inverter nối chéo + hai transistor truy cập', '4 transistor song song', '1 transistor + 1 điện trở'], correctIndex: 1, explanation: 'Ô 6T: hai inverter chéo giữ bit + bù, hai transistor truy cập nối bitline.' },
  { id: 'q2', question: 'Vì sao DRAM phải được làm tươi (refresh) định kỳ?', options: ['Vì nó dùng 6 transistor', 'Vì bit lưu bằng điện tích trên tụ và điện tích rò dần', 'Vì nó không bay hơi', 'Vì nó nhanh hơn SRAM'], correctIndex: 1, explanation: 'Bit là điện tích trên tụ (1T1C); điện tích rò nên phải refresh để giữ dữ liệu.' },
  { id: 'q3', question: 'So với SRAM, DRAM có đặc điểm gì?', options: ['Mật độ cao hơn nhưng chậm hơn và cần refresh', 'Nhanh hơn và không bay hơi', 'Ít transistor hơn nhưng nhanh hơn SRAM', 'Không cần nguồn điện'], correctIndex: 0, explanation: 'DRAM (1T1C) đặc hơn SRAM (6T) nhưng chậm hơn, bay hơi và cần refresh.' },
]);

const c8 = doc('dic301-8-1-clocking-lowpower', '8.1 — Clocking, timing closure & low-power|||8.1 — Xung nhịp, timing closure & tiết kiệm điện',
  'Phân phối xung nhịp (H-tree), lệch xung (skew) và jitter, timing closure (setup/hold trên toàn chip), và kỹ thuật low-power: clock gating, đa Vt, DVFS.',
  [[
    `<span class="eyebrow">DIC301 · Chapter 8 · Lesson 8.1</span>
<h2>Clocking, timing closure &amp; low-power design</h2>
<h3>Clock distribution</h3>
<p>The clock must reach thousands of flip-flops at (nearly) the same time. A balanced network — an <strong>H-tree</strong> or clock mesh — minimizes differences in arrival time.</p>
<ul>
<li><strong>Skew</strong> — a spatial difference in clock arrival between two registers.</li>
<li><strong>Jitter</strong> — a cycle-to-cycle variation in the edge at one point.</li>
</ul>
<h3>Timing closure</h3>
<p>With skew, the setup constraint becomes <strong>T + skew &amp;ge; t<sub>cq</sub> + t<sub>logic</sub> + t<sub>su</sub></strong>, and the hold constraint tightens: <strong>t<sub>cq</sub> + t<sub>logic,min</sub> &amp;ge; t<sub>h</sub> + skew</strong>. <strong>Timing closure</strong> is making <em>every</em> path meet both across process, voltage and temperature corners.</p>
<h3>Low-power techniques</h3>
<ul>
<li><strong>Clock gating</strong> — stop the clock to idle blocks, killing their dynamic power.</li>
<li><strong>Multi-V<sub>t</sub></strong> — high-V<sub>t</sub> (low-leakage) cells off the critical path, fast low-V<sub>t</sub> cells only where needed.</li>
<li><strong>DVFS</strong> — dynamic voltage &amp; frequency scaling: lower V<sub>DD</sub> and f when full speed isn't needed (recall the V<sub>DD</sub><sup>2</sup> saving).</li>
</ul>
<pre><code>Setup: T + t_skew  &gt;=  t_cq + t_logic_max + t_su
Hold:  t_cq + t_logic_min  &gt;=  t_h + t_skew
// timing closure = both hold on every path, every PVT corner</code></pre>
<div class="callout"><span class="badge">Big picture</span> Speed, power and area are one coupled budget. Good digital IC design is choosing where on that trade-off surface each block should sit.</div>`,
    `<span class="eyebrow">DIC301 · Chương 8 · Bài 8.1</span>
<h2>Xung nhịp, timing closure &amp; thiết kế tiết kiệm điện</h2>
<h3>Phân phối xung nhịp</h3>
<p>Xung nhịp phải tới hàng nghìn flip-flop gần như cùng lúc. Một mạng cân bằng — <strong>H-tree</strong> hoặc lưới xung — giảm chênh lệch thời điểm tới.</p>
<ul>
<li><strong>Skew (lệch xung)</strong> — chênh lệch không gian về thời điểm xung tới giữa hai thanh ghi.</li>
<li><strong>Jitter</strong> — dao động chu kỳ-qua-chu kỳ của cạnh xung tại một điểm.</li>
</ul>
<h3>Timing closure</h3>
<p>Có skew, ràng buộc setup thành <strong>T + skew &amp;ge; t<sub>cq</sub> + t<sub>logic</sub> + t<sub>su</sub></strong>, và ràng buộc hold siết lại: <strong>t<sub>cq</sub> + t<sub>logic,min</sub> &amp;ge; t<sub>h</sub> + skew</strong>. <strong>Timing closure</strong> là làm cho <em>mọi</em> đường thỏa cả hai qua các góc process, voltage và temperature.</p>
<h3>Kỹ thuật tiết kiệm điện</h3>
<ul>
<li><strong>Clock gating</strong> — ngắt xung tới khối rảnh, triệt tiêu công suất động của chúng.</li>
<li><strong>Đa V<sub>t</sub></strong> — cell V<sub>t</sub> cao (rò thấp) ở ngoài đường tới hạn, cell V<sub>t</sub> thấp (nhanh) chỉ ở nơi cần.</li>
<li><strong>DVFS</strong> — chỉnh điện áp &amp; tần số động: hạ V<sub>DD</sub> và f khi không cần tốc độ tối đa (nhớ lợi ích V<sub>DD</sub><sup>2</sup>).</li>
</ul>
<pre><code>Setup: T + t_skew  &gt;=  t_cq + t_logic_max + t_su
Hold:  t_cq + t_logic_min  &gt;=  t_h + t_skew
// timing closure = cả hai đúng trên mọi đường, mọi góc PVT</code></pre>
<div class="callout"><span class="badge">Bức tranh lớn</span> Tốc độ, công suất và diện tích là một ngân sách gắn kết. Thiết kế IC số giỏi là chọn mỗi khối nằm ở đâu trên mặt đánh đổi đó.</div>`,
  ]]);

const c8q = quiz('dic301-quiz-8', 'Quiz 8 — Clocking & low-power|||Quiz 8 — Xung nhịp & tiết kiệm điện', [
  { id: 'q1', question: 'Clock skew là gì?', options: ['Dao động chu kỳ-qua-chu kỳ của một cạnh xung', 'Chênh lệch thời điểm xung nhịp tới giữa hai thanh ghi khác nhau', 'Tần số xung nhịp tối đa', 'Độ rộng xung nhịp'], correctIndex: 1, explanation: 'Skew là chênh lệch không gian về thời điểm xung tới các thanh ghi; jitter mới là dao động theo chu kỳ.' },
  { id: 'q2', question: 'Kỹ thuật clock gating tiết kiệm điện bằng cách nào?', options: ['Tăng điện áp nguồn', 'Ngắt xung nhịp tới các khối đang rảnh, triệt tiêu công suất động của chúng', 'Thêm nhiều flip-flop', 'Tăng tần số xung nhịp'], correctIndex: 1, explanation: 'Không có cạnh xung → khối không chuyển mạch → công suất động của nó về ~0.' },
  { id: 'q3', question: 'Vì sao DVFS (hạ VDD khi không cần tốc độ) tiết kiệm điện mạnh?', options: ['Vì công suất động tỉ lệ VDD²', 'Vì nó tăng dòng rò', 'Vì nó tăng số transistor', 'Vì nó bỏ qua timing closure'], correctIndex: 0, explanation: 'Pdyn = α·C·VDD²·f, nên hạ VDD giảm công suất động theo bình phương.' },
]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'DIC301',
    slug: 'dic301-digital-ics',
    title: 'Digital ICs',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/DIC301.webp',
    shortDescription: 'CMOS digital IC design — inverter VTC & delay, static/pass-transistor logic, flip-flops & timing, interconnect, dynamic logic & power, adders, SRAM/DRAM/ROM, clocking & low-power. Bilingual, with Verilog/SPICE examples & quizzes.|||Thiết kế IC số CMOS — inverter VTC & trễ, logic tĩnh/pass-transistor, flip-flop & định thời, interconnect, logic động & công suất, mạch cộng, SRAM/DRAM/ROM, xung nhịp & tiết kiệm điện. Song ngữ, ví dụ Verilog/SPICE & quiz.',
    description: 'Môn <strong>DIC301 — Digital ICs (Thiết kế mạch tích hợp số)</strong> thuộc ngành Thiết kế vi mạch bán dẫn, kỳ 7. Từ <strong>inverter CMOS</strong> (VTC, biên nhiễu, trễ) → <strong>logic tổ hợp</strong> (CMOS tĩnh, pass-transistor) → <strong>logic tuần tự &amp; định thời</strong> (latch, flip-flop, setup/hold) → <strong>interconnect &amp; trễ dây</strong> → <strong>logic động &amp; công suất</strong> → <strong>mạch số học</strong> (bộ cộng, bộ nhân) → <strong>bộ nhớ</strong> (SRAM/DRAM/ROM) → <strong>xung nhịp, timing closure &amp; tiết kiệm điện</strong>. Bám giáo trình chuẩn (Rabaey, Weste/Harris, Baker, Kang/Leblebici), song ngữ, có công thức và ví dụ Verilog/SPICE, quiz mỗi chương.',
    whatYouLearn: 'Inverter CMOS (VTC, VM, biên nhiễu, tp ≈ 0.69·R·CL); static CMOS bù (PUN/PDN) &amp; pass-transistor/transmission gate; latch vs flip-flop, setup/hold, clk-to-Q, metastability; trễ interconnect (RC, Elmore, repeater); logic động (precharge/evaluate, domino); công suất động/ngắn mạch/rò (P = α·C·VDD²·f); bộ cộng (ripple-carry, carry-lookahead) &amp; bộ nhân; bộ nhớ SRAM 6T, DRAM 1T1C, ROM; clock skew/jitter, timing closure, clock gating, đa Vt, DVFS. Ví dụ Verilog &amp; SPICE.',
    requirements: 'Đã học logic số cơ bản (cổng logic, đại số Boole) và nguyên lý transistor MOS. Nên cài ngspice và dùng EDA Playground để chạy thử ví dụ Verilog/SPICE.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách chuẩn (Rabaey, Weste/Harris, Baker, Kang/Leblebici), slide FLM, tài liệu miễn phí, YouTube, công cụ EDA, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Digital IC, công nghệ CMOS, ba thước đo tốc độ/công suất/diện tích.', lessons: [intro] },
    { title: 'Chương 1 — Inverter CMOS|||Chapter 1 — CMOS inverter', description: 'VTC, ngưỡng VM, biên nhiễu, trễ tp, SPICE.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Logic tổ hợp|||Chapter 2 — Combinational logic', description: 'CMOS tĩnh (PUN/PDN), pass-transistor, transmission gate.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Logic tuần tự & định thời|||Chapter 3 — Sequential logic & timing', description: 'Latch, flip-flop, setup/hold, metastability.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Interconnect & trễ dây|||Chapter 4 — Interconnect & wire delay', description: 'Mô hình RC, trễ Elmore, chèn repeater.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Logic động & công suất|||Chapter 5 — Dynamic logic & power', description: 'Precharge/evaluate, domino, động/ngắn mạch/rò.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Mạch số học|||Chapter 6 — Arithmetic circuits', description: 'Full adder, ripple-carry, carry-lookahead, bộ nhân.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Bộ nhớ|||Chapter 7 — Memory', description: 'SRAM 6T, DRAM 1T1C, ROM.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Xung nhịp & tiết kiệm điện|||Chapter 8 — Clocking & low-power', description: 'Skew/jitter, timing closure, clock gating, DVFS.', lessons: [c8, c8q] },
  ],
};
