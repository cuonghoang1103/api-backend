/**
 * ICI211 — IC Design Introduction (Nhập môn Thiết kế vi mạch). Ngành Thiết kế
 * vi mạch bán dẫn (FPTU), Kỳ 5. Song ngữ VI+EN, 8 chương + giới thiệu + tài liệu.
 * Sách chuẩn: Weste & Harris "CMOS VLSI Design"; Razavi "Design of Analog CMOS
 * Integrated Circuits"; Sedra & Smith "Microelectronic Circuits".
 * Giữ NGUYÊN slug/semester/courseCode/thumb(v3). ⚠️ KHÔNG backtick lồng/${ trong
 * HTML; & → &amp; trong content; helper doc .join('\n') ra STRING.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('ici211-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn (Weste & Harris, Razavi, Sedra & Smith), tài liệu EDA (Cadence/Synopsys), YouTube, công cụ, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">ICI211 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to start learning <strong>IC design</strong> — from the MOS transistor up to a full RTL-to-GDSII flow — in one place. The official FPTU slides &amp; syllabus live on <strong>FLM</strong>; below are the standard textbooks and free, legal resources.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for ICI211 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Standard textbooks</h3>
<ul>
<li><a href="https://pages.hmc.edu/harris/cmosvlsi/4e/index.html" target="_blank" rel="noopener">Weste &amp; Harris — <em>CMOS VLSI Design: A Circuits and Systems Perspective</em></a> (the core reference)</li>
<li>Razavi — <em>Design of Analog CMOS Integrated Circuits</em> (analog side)</li>
<li>Sedra &amp; Smith — <em>Microelectronic Circuits</em> (device &amp; circuit foundations)</li>
</ul>
<h3>🌐 EDA / free documentation</h3>
<ul>
<li><a href="https://www.cadence.com/en_US/home/tools.html" target="_blank" rel="noopener">Cadence — Virtuoso / Innovus docs</a></li>
<li><a href="https://www.synopsys.com/implementation-and-signoff.html" target="_blank" rel="noopener">Synopsys — Design Compiler / IC Compiler docs</a></li>
<li><a href="https://skywater-pdk.readthedocs.io/" target="_blank" rel="noopener">SkyWater open PDK (SKY130)</a> — a real, free process design kit</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@Zero2ASICcourse" target="_blank" rel="noopener">Zero to ASIC Course</a> — open-source chip design end to end</li>
<li><a href="https://www.youtube.com/@RTLtoGDS" target="_blank" rel="noopener">RTL to GDS</a> — physical design flow explained</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.falstad.com/circuit/" target="_blank" rel="noopener">Falstad Circuit Simulator</a> — see CMOS gates switch in the browser</li>
<li><a href="https://www.edaplayground.com/" target="_blank" rel="noopener">EDA Playground</a> — write and simulate Verilog/SystemVerilog online</li>
<li><a href="https://github.com/The-OpenROAD-Project/OpenLane" target="_blank" rel="noopener">OpenLane</a> — free RTL-to-GDSII flow on SKY130</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Devices</strong> — understand the MOSFET (regions, W/L, threshold) before any circuit.</li>
<li><strong>Digital core</strong> — CMOS inverter, logic gates, delay/power/noise-margin.</li>
<li><strong>Analog &amp; memory</strong> — current mirror, differential pair, op-amp; SRAM/DRAM and flip-flops.</li>
<li><strong>Flow</strong> — take a small RTL block through synthesis → place &amp; route → verification on OpenLane.</li>
</ol></div>`,
    `<span class="eyebrow">ICI211 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để bắt đầu học <strong>thiết kế vi mạch (IC)</strong> — từ transistor MOS lên tới một luồng RTL-to-GDSII hoàn chỉnh — gom về một chỗ. Slide &amp; giáo trình chính thức của FPTU nằm trên <strong>FLM</strong>; bên dưới là các sách chuẩn và nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của ICI211 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách chuẩn</h3>
<ul>
<li><a href="https://pages.hmc.edu/harris/cmosvlsi/4e/index.html" target="_blank" rel="noopener">Weste &amp; Harris — <em>CMOS VLSI Design: A Circuits and Systems Perspective</em></a> (tài liệu lõi)</li>
<li>Razavi — <em>Design of Analog CMOS Integrated Circuits</em> (phần analog)</li>
<li>Sedra &amp; Smith — <em>Microelectronic Circuits</em> (nền linh kiện &amp; mạch)</li>
</ul>
<h3>🌐 Tài liệu EDA / miễn phí</h3>
<ul>
<li><a href="https://www.cadence.com/en_US/home/tools.html" target="_blank" rel="noopener">Cadence — tài liệu Virtuoso / Innovus</a></li>
<li><a href="https://www.synopsys.com/implementation-and-signoff.html" target="_blank" rel="noopener">Synopsys — tài liệu Design Compiler / IC Compiler</a></li>
<li><a href="https://skywater-pdk.readthedocs.io/" target="_blank" rel="noopener">SkyWater open PDK (SKY130)</a> — một bộ PDK quy trình thật, miễn phí</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@Zero2ASICcourse" target="_blank" rel="noopener">Zero to ASIC Course</a> — làm chip mã nguồn mở từ đầu đến cuối</li>
<li><a href="https://www.youtube.com/@RTLtoGDS" target="_blank" rel="noopener">RTL to GDS</a> — giảng luồng thiết kế vật lý</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.falstad.com/circuit/" target="_blank" rel="noopener">Falstad Circuit Simulator</a> — xem cổng CMOS chuyển mạch trên trình duyệt</li>
<li><a href="https://www.edaplayground.com/" target="_blank" rel="noopener">EDA Playground</a> — viết và mô phỏng Verilog/SystemVerilog trực tuyến</li>
<li><a href="https://github.com/The-OpenROAD-Project/OpenLane" target="_blank" rel="noopener">OpenLane</a> — luồng RTL-to-GDSII miễn phí trên SKY130</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Linh kiện</strong> — hiểu MOSFET (vùng làm việc, W/L, điện áp ngưỡng) trước khi làm mạch.</li>
<li><strong>Lõi số</strong> — inverter CMOS, cổng logic, trễ/công suất/biên nhiễu.</li>
<li><strong>Analog &amp; bộ nhớ</strong> — current mirror, cặp vi sai, op-amp; SRAM/DRAM và flip-flop.</li>
<li><strong>Luồng thiết kế</strong> — đưa một khối RTL nhỏ qua tổng hợp → place &amp; route → kiểm chứng trên OpenLane.</li>
</ol></div>`,
  ]]);

const intro = doc('ici211-0-1-overview', 'Course overview: what is IC design?|||Tổng quan: thiết kế vi mạch là gì?',
  'IC là gì, vì sao quan trọng; ba dòng thiết kế analog/digital/mixed-signal; lộ trình môn: transistor MOS → cổng logic → đặc tính số → layout & chế tạo → analog → bộ nhớ → luồng EDA.',
  [[
    `<span class="eyebrow">ICI211 · Lesson 0.1 · Overview</span>
<h2>What is IC design?</h2>
<p class="lead">An <strong>integrated circuit (IC)</strong> packs thousands to billions of transistors onto a single sliver of silicon. <strong>IC design</strong> is the craft of turning a specification into a manufacturable chip — and it is the engine behind every phone, GPU and microcontroller. This course takes you from a single transistor up to the modern <strong>RTL-to-GDSII</strong> design flow.</p>
<h3>Three families of design</h3>
<ul>
<li><strong>Digital</strong> — logic built from CMOS gates (processors, memory, accelerators). Highly automated with EDA tools.</li>
<li><strong>Analog</strong> — continuous signals: amplifiers, references, data converters. Hand-crafted, transistor by transistor.</li>
<li><strong>Mixed-signal</strong> — both on one die (e.g. an ADC feeding a DSP core).</li>
</ul>
<h3>Why it matters</h3>
<p>Moore's law let transistor counts roughly double every couple of years for decades. Squeezing more devices onto silicon is what made computing cheap and ubiquitous — and designing those devices is a fast-growing, well-paid career, exactly the skill Việt Nam's new semiconductor programs target.</p>
<h3>Roadmap</h3>
<p>MOS transistor → CMOS logic gates → digital metrics (delay/power/noise) → layout &amp; fabrication → basic analog blocks → memory &amp; sequential circuits → the EDA design flow. Bilingual, with circuits, formulas and worked examples.</p>`,
    `<span class="eyebrow">ICI211 · Bài 0.1 · Tổng quan</span>
<h2>Thiết kế vi mạch là gì?</h2>
<p class="lead">Một <strong>vi mạch tích hợp (IC)</strong> nhồi từ hàng nghìn tới hàng tỉ transistor lên một mảnh silic. <strong>Thiết kế vi mạch</strong> là nghề biến một bản đặc tả thành con chip chế tạo được — và là động cơ sau mọi điện thoại, GPU, vi điều khiển. Môn này đưa bạn từ một transistor đơn lẻ lên tới luồng thiết kế <strong>RTL-to-GDSII</strong> hiện đại.</p>
<h3>Ba dòng thiết kế</h3>
<ul>
<li><strong>Số (digital)</strong> — logic dựng từ cổng CMOS (bộ xử lý, bộ nhớ, tăng tốc). Tự động hoá cao nhờ công cụ EDA.</li>
<li><strong>Analog</strong> — tín hiệu liên tục: khuếch đại, mạch tham chiếu, bộ chuyển đổi. Vẽ tay từng transistor.</li>
<li><strong>Tín hiệu trộn (mixed-signal)</strong> — cả hai trên cùng một đế (vd một ADC nuôi lõi DSP).</li>
</ul>
<h3>Vì sao quan trọng</h3>
<p>Định luật Moore giúp số transistor tăng gấp đôi sau mỗi vài năm suốt hàng chục năm. Nhồi thêm linh kiện lên silic là điều làm máy tính rẻ và có mặt khắp nơi — và thiết kế ra chúng là nghề đang phát triển nhanh, lương tốt, đúng kỹ năng mà các chương trình bán dẫn mới của Việt Nam nhắm tới.</p>
<h3>Lộ trình</h3>
<p>Transistor MOS → cổng logic CMOS → chỉ số mạch số (trễ/công suất/nhiễu) → layout &amp; chế tạo → khối analog cơ bản → bộ nhớ &amp; mạch tuần tự → luồng thiết kế EDA. Song ngữ, có mạch, công thức và ví dụ mẫu.</p>`,
  ]]);

const c1 = doc('ici211-1-1-ic-design-overview', '1.1 — IC design overview & EDA|||1.1 — Tổng quan thiết kế IC & EDA',
  'IC là gì; phân loại analog/digital/mixed; các mức trừu tượng (system→RTL→gate→transistor→layout); quy trình thiết kế và vai trò của EDA; ASIC vs FPGA.',
  [[
    `<span class="eyebrow">ICI211 · Chapter 1 · Lesson 1.1</span>
<h2>IC design overview &amp; EDA</h2>
<h3>What an IC is</h3>
<p>An IC integrates transistors, resistors and capacitors on one silicon die. Chips are classified by the signals they handle — <strong>digital</strong> (0/1 logic), <strong>analog</strong> (continuous), <strong>mixed-signal</strong> (both) — and by how they are built: full-custom, standard-cell <strong>ASIC</strong>, or reconfigurable <strong>FPGA</strong>.</p>
<h3>Levels of abstraction</h3>
<pre><code>System / architecture   (blocks, buses, spec)
   -> RTL (Verilog/VHDL) (registers + logic between them)
   -> Gate / netlist     (AND, OR, flip-flops)
   -> Transistor         (MOSFETs, sizing)
   -> Layout (GDSII)     (geometry sent to the fab)
</code></pre>
<p>Design moves top-down; each level is checked before dropping to the next. Lower = more detail, more accurate, slower to work with.</p>
<h3>EDA — Electronic Design Automation</h3>
<p><strong>EDA tools</strong> (Cadence, Synopsys, Mentor) automate the flow: simulation, synthesis, place &amp; route, and verification. Modern chips have billions of transistors — no one draws them by hand; the digital flow is tool-driven, while analog blocks are still crafted manually and verified with SPICE.</p>
<div class="callout"><span class="badge">ASIC vs FPGA</span> An <strong>ASIC</strong> is fixed at manufacture — cheapest per unit at volume, highest up-front cost. An <strong>FPGA</strong> is reprogrammable after manufacture — great for prototyping and low volume, but slower and more power-hungry.</div>`,
    `<span class="eyebrow">ICI211 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan thiết kế IC &amp; EDA</h2>
<h3>IC là gì</h3>
<p>Một IC tích hợp transistor, điện trở và tụ trên một đế silic. Chip được phân loại theo tín hiệu xử lý — <strong>số (digital)</strong> (logic 0/1), <strong>analog</strong> (liên tục), <strong>trộn (mixed-signal)</strong> (cả hai) — và theo cách dựng: full-custom, <strong>ASIC</strong> theo tế bào chuẩn, hay <strong>FPGA</strong> tái cấu hình được.</p>
<h3>Các mức trừu tượng</h3>
<pre><code>Hệ thống / kiến trúc     (khối, bus, đặc tả)
   -> RTL (Verilog/VHDL)  (thanh ghi + logic giữa chúng)
   -> Cổng / netlist      (AND, OR, flip-flop)
   -> Transistor          (MOSFET, chọn kích thước)
   -> Layout (GDSII)      (hình học gửi tới xưởng đúc)
</code></pre>
<p>Thiết kế đi từ trên xuống; mỗi mức được kiểm trước khi xuống mức dưới. Càng thấp = càng chi tiết, càng chính xác, càng chậm khi làm.</p>
<h3>EDA — Tự động hoá thiết kế điện tử</h3>
<p><strong>Công cụ EDA</strong> (Cadence, Synopsys, Mentor) tự động hoá luồng: mô phỏng, tổng hợp, place &amp; route, và kiểm chứng. Chip hiện đại có hàng tỉ transistor — không ai vẽ tay; luồng số do công cụ dẫn dắt, còn khối analog vẫn vẽ tay và kiểm bằng SPICE.</p>
<div class="callout"><span class="badge">ASIC vs FPGA</span> <strong>ASIC</strong> cố định khi chế tạo — rẻ nhất trên mỗi đơn vị khi sản lượng lớn, chi phí ban đầu cao nhất. <strong>FPGA</strong> lập trình lại được sau chế tạo — tốt để tạo mẫu và sản lượng thấp, nhưng chậm hơn và tốn điện hơn.</div>`,
  ]]);

const c1q = quiz('ici211-quiz-1', 'Quiz 1 — IC design overview|||Quiz 1 — Tổng quan thiết kế IC', [
  { id: 'q1', question: 'A chip that handles both continuous and 0/1 signals on one die is called?|||Con chip xử lý cả tín hiệu liên tục lẫn 0/1 trên một đế gọi là?', options: ['Digital|||Số (digital)', 'Analog|||Analog', 'Mixed-signal|||Trộn (mixed-signal)', 'FPGA|||FPGA'], correctIndex: 2, explanation: 'Mixed-signal kết hợp analog và số trên cùng một IC.' },
  { id: 'q2', question: 'Which abstraction level is sent to the fab?|||Mức trừu tượng nào được gửi tới xưởng đúc?', options: ['RTL', 'Gate netlist', 'Layout (GDSII)', 'System spec|||Đặc tả hệ thống'], correctIndex: 2, explanation: 'GDSII là dữ liệu hình học layout gửi cho fab để làm mask.' },
  { id: 'q3', question: 'Main advantage of an FPGA over an ASIC?|||Ưu điểm chính của FPGA so với ASIC?', options: ['Cheaper at very high volume|||Rẻ hơn khi sản lượng rất lớn', 'Reprogrammable after manufacture|||Lập trình lại được sau chế tạo', 'Lower power always|||Luôn ít điện hơn', 'Faster clock always|||Luôn xung nhịp cao hơn'], correctIndex: 1, explanation: 'FPGA tái cấu hình được sau khi sản xuất; ASIC cố định.' },
]);

const c2 = doc('ici211-2-1-mos-transistor', '2.1 — The MOS transistor|||2.1 — Transistor MOS',
  'Cấu tạo MOSFET (NMOS/PMOS, cực G/D/S/B); điện áp ngưỡng Vt; ba vùng làm việc (cut-off/triode/saturation); dòng ID theo W/L; vai trò tỉ lệ W/L khi chọn kích thước.',
  [[
    `<span class="eyebrow">ICI211 · Chapter 2 · Lesson 2.1</span>
<h2>The MOS transistor</h2>
<h3>Structure</h3>
<p>A <strong>MOSFET</strong> has four terminals — <strong>Gate (G), Drain (D), Source (S), Body (B)</strong>. The gate sits over a thin oxide; the voltage on it controls a channel between drain and source. An <strong>NMOS</strong> conducts when the gate is high; a <strong>PMOS</strong> conducts when the gate is low. Together they form <strong>CMOS</strong>.</p>
<h3>Threshold and regions</h3>
<pre><code>Vgs &lt; Vt          -> Cut-off      (channel off, ID ~ 0)
Vgs &gt; Vt, small Vds -> Triode/linear (acts like a resistor)
Vgs &gt; Vt, large Vds -> Saturation   (acts like a current source)
</code></pre>
<p><strong>Vt</strong> is the threshold voltage — the gate voltage where the channel just turns on. In saturation the drain current is roughly:</p>
<pre><code>ID = (1/2) . k' . (W/L) . (Vgs - Vt)^2
    k' = mobility . oxide capacitance (a process constant)
</code></pre>
<h3>Why W/L matters</h3>
<p>The designer's main knob is the <strong>W/L ratio</strong> (channel width over length). A wider transistor (larger W/L) carries more current, so it switches faster and drives bigger loads — at the cost of area and gate capacitance. Sizing transistors is the everyday work of IC design.</p>
<div class="callout"><span class="badge">Switch first</span> For digital work, picture the MOSFET as a voltage-controlled switch: gate high closes an NMOS, gate low closes a PMOS. The square-law equation matters most for analog.</div>`,
    `<span class="eyebrow">ICI211 · Chương 2 · Bài 2.1</span>
<h2>Transistor MOS</h2>
<h3>Cấu tạo</h3>
<p>Một <strong>MOSFET</strong> có bốn cực — <strong>Cổng (G), Máng/Drain (D), Nguồn/Source (S), Đế/Body (B)</strong>. Cực cổng nằm trên một lớp oxit mỏng; điện áp trên nó điều khiển kênh dẫn giữa drain và source. <strong>NMOS</strong> dẫn khi cổng ở mức cao; <strong>PMOS</strong> dẫn khi cổng ở mức thấp. Ghép lại thành <strong>CMOS</strong>.</p>
<h3>Điện áp ngưỡng và các vùng</h3>
<pre><code>Vgs &lt; Vt          -> Cut-off      (kênh tắt, ID ~ 0)
Vgs &gt; Vt, Vds nhỏ -> Triode/tuyến tính (như một điện trở)
Vgs &gt; Vt, Vds lớn -> Bão hoà       (như một nguồn dòng)
</code></pre>
<p><strong>Vt</strong> là điện áp ngưỡng — mức áp cổng mà kênh vừa mở. Ở vùng bão hoà, dòng máng xấp xỉ:</p>
<pre><code>ID = (1/2) . k' . (W/L) . (Vgs - Vt)^2
    k' = độ linh động . điện dung oxit (hằng số quy trình)
</code></pre>
<h3>Vì sao W/L quan trọng</h3>
<p>Núm điều chỉnh chính của người thiết kế là <strong>tỉ lệ W/L</strong> (bề rộng chia chiều dài kênh). Transistor rộng hơn (W/L lớn) tải dòng nhiều hơn nên chuyển mạch nhanh hơn và kéo được tải lớn hơn — đổi lại tốn diện tích và điện dung cổng. Chọn kích thước transistor là công việc hằng ngày của thiết kế IC.</p>
<div class="callout"><span class="badge">Coi như công tắc</span> Với mạch số, hãy hình dung MOSFET là công tắc điều khiển bằng áp: cổng cao đóng NMOS, cổng thấp đóng PMOS. Công thức bình phương quan trọng nhất với analog.</div>`,
  ]]);

const c2q = quiz('ici211-quiz-2', 'Quiz 2 — MOS transistor|||Quiz 2 — Transistor MOS', [
  { id: 'q1', question: 'When Vgs > Vt and Vds is large, the MOSFET is in?|||Khi Vgs > Vt và Vds lớn, MOSFET ở vùng?', options: ['Cut-off', 'Triode|||Triode (tuyến tính)', 'Saturation|||Bão hoà', 'Breakdown|||Đánh thủng'], correctIndex: 2, explanation: 'Vgs>Vt với Vds lớn -> bão hoà, transistor như nguồn dòng.' },
  { id: 'q2', question: 'An NMOS transistor conducts when its gate is?|||Transistor NMOS dẫn khi cổng ở mức?', options: ['High|||Cao', 'Low|||Thấp', 'Floating|||Thả nổi', 'Negative only|||Chỉ âm'], correctIndex: 0, explanation: 'NMOS bật khi cổng cao; PMOS bật khi cổng thấp.' },
  { id: 'q3', question: 'Doubling W/L (all else equal) mainly makes the transistor?|||Tăng gấp đôi W/L (giữ nguyên phần còn lại) chủ yếu làm transistor?', options: ['Carry less current|||Tải ít dòng hơn', 'Carry more current, switch faster|||Tải nhiều dòng hơn, chuyển nhanh hơn', 'Change its threshold Vt|||Đổi ngưỡng Vt', 'Stop conducting|||Ngừng dẫn'], correctIndex: 1, explanation: 'ID tỉ lệ với W/L: rộng hơn -> nhiều dòng, nhanh hơn, tốn diện tích.' },
]);

const c3 = doc('ici211-3-1-cmos-gates', '3.1 — CMOS logic gates|||3.1 — Cổng logic CMOS',
  'Inverter CMOS (pull-up PMOS + pull-down NMOS); vì sao CMOS gần như không tốn tĩnh; mạng PUN/PDN đối ngẫu; NAND/NOR; đặc tuyến truyền đạt VTC và điểm chuyển VM.',
  [[
    `<span class="eyebrow">ICI211 · Chapter 3 · Lesson 3.1</span>
<h2>CMOS logic gates</h2>
<h3>The CMOS inverter</h3>
<p>The simplest gate: one <strong>PMOS pull-up</strong> to VDD and one <strong>NMOS pull-down</strong> to ground, gates tied together as the input.</p>
<pre><code>In = 0 -> PMOS on,  NMOS off -> Out pulled to VDD (=1)
In = 1 -> PMOS off, NMOS on  -> Out pulled to GND (=0)
</code></pre>
<p>Exactly one network conducts at a time, so in steady state there is <strong>no path from VDD to ground</strong> — that is why CMOS burns almost no static power. This complementary idea is the whole point of the name CMOS.</p>
<h3>Dual pull-up / pull-down networks</h3>
<p>Any gate has a <strong>pull-down network (PDN)</strong> of NMOS to ground and a <strong>pull-up network (PUN)</strong> of PMOS to VDD. They are <em>duals</em>: NMOS in series (AND condition) mirror PMOS in parallel.</p>
<pre><code>NAND2:  PDN = 2 NMOS in series
        PUN = 2 PMOS in parallel
NOR2:   PDN = 2 NMOS in parallel
        PUN = 2 PMOS in series
</code></pre>
<h3>Voltage transfer characteristic (VTC)</h3>
<p>Plot output vs input and you get the <strong>VTC</strong> — flat near VDD, a sharp drop through the switching point <strong>VM</strong> (where in = out), then flat near 0. A steep transition means a good, decisive gate.</p>
<div class="callout"><span class="badge">Rule</span> Series NMOS + parallel PMOS = NAND. Parallel NMOS + series PMOS = NOR. Native CMOS gates are always inverting; AND/OR = NAND/NOR + inverter.</div>`,
    `<span class="eyebrow">ICI211 · Chương 3 · Bài 3.1</span>
<h2>Cổng logic CMOS</h2>
<h3>Inverter CMOS</h3>
<p>Cổng đơn giản nhất: một <strong>PMOS kéo lên (pull-up)</strong> tới VDD và một <strong>NMOS kéo xuống (pull-down)</strong> tới đất, hai cổng nối chung làm đầu vào.</p>
<pre><code>In = 0 -> PMOS bật, NMOS tắt -> Out kéo lên VDD (=1)
In = 1 -> PMOS tắt, NMOS bật -> Out kéo xuống GND (=0)
</code></pre>
<p>Tại mỗi thời điểm chỉ một mạng dẫn, nên ở trạng thái ổn định <strong>không có đường từ VDD xuống đất</strong> — vì thế CMOS gần như không tốn công suất tĩnh. Ý tưởng đối ngẫu này chính là lý do có tên CMOS.</p>
<h3>Mạng kéo lên / kéo xuống đối ngẫu</h3>
<p>Cổng nào cũng có <strong>mạng kéo xuống (PDN)</strong> gồm NMOS về đất và <strong>mạng kéo lên (PUN)</strong> gồm PMOS về VDD. Chúng <em>đối ngẫu</em>: NMOS nối tiếp (điều kiện AND) tương ứng PMOS song song.</p>
<pre><code>NAND2:  PDN = 2 NMOS nối tiếp
        PUN = 2 PMOS song song
NOR2:   PDN = 2 NMOS song song
        PUN = 2 PMOS nối tiếp
</code></pre>
<h3>Đặc tuyến truyền đạt áp (VTC)</h3>
<p>Vẽ đầu ra theo đầu vào ta được <strong>VTC</strong> — phẳng gần VDD, tụt dốc qua điểm chuyển <strong>VM</strong> (nơi in = out), rồi phẳng gần 0. Đoạn chuyển càng dốc thì cổng càng dứt khoát, càng tốt.</p>
<div class="callout"><span class="badge">Quy tắc</span> NMOS nối tiếp + PMOS song song = NAND. NMOS song song + PMOS nối tiếp = NOR. Cổng CMOS gốc luôn đảo; AND/OR = NAND/NOR + inverter.</div>`,
  ]]);

const c3q = quiz('ici211-quiz-3', 'Quiz 3 — CMOS gates|||Quiz 3 — Cổng CMOS', [
  { id: 'q1', question: 'Why does a CMOS gate burn almost no static power?|||Vì sao cổng CMOS gần như không tốn công suất tĩnh?', options: ['It has no transistors|||Không có transistor', 'In steady state no path connects VDD to ground|||Ở trạng thái ổn định không có đường VDD-đất', 'The inputs are always 0|||Đầu vào luôn 0', 'It uses only PMOS|||Chỉ dùng PMOS'], correctIndex: 1, explanation: 'Chỉ một mạng dẫn tại một thời điểm nên không có dòng tĩnh VDD->GND.' },
  { id: 'q2', question: 'A NAND2 pull-down network is?|||Mạng kéo xuống của NAND2 là?', options: ['2 NMOS in parallel|||2 NMOS song song', '2 NMOS in series|||2 NMOS nối tiếp', '2 PMOS in series|||2 PMOS nối tiếp', '1 NMOS only|||Chỉ 1 NMOS'], correctIndex: 1, explanation: 'NAND2: PDN là 2 NMOS nối tiếp (output thấp chỉ khi cả hai đầu vào cao).' },
  { id: 'q3', question: 'The switching point VM on the VTC is where?|||Điểm chuyển VM trên VTC là nơi?', options: ['Output = VDD', 'Output = 0', 'Input equals output|||Đầu vào bằng đầu ra', 'Both transistors are off|||Cả hai transistor tắt'], correctIndex: 2, explanation: 'VM là điểm Vin = Vout, giữa vùng chuyển dốc của VTC.' },
]);

const c4 = doc('ici211-4-1-digital-metrics', '4.1 — Digital circuit characteristics|||4.1 — Đặc tính mạch số',
  'Trễ lan truyền tpd; công suất động P = a.C.V^2.f và công suất rò tĩnh; biên nhiễu NMH/NML; fan-out và tải điện dung; đánh đổi tốc độ – công suất – diện tích.',
  [[
    `<span class="eyebrow">ICI211 · Chapter 4 · Lesson 4.1</span>
<h2>Digital circuit characteristics</h2>
<h3>Propagation delay</h3>
<p><strong>Delay (tpd)</strong> is the time from an input change to the output settling — measured at the 50% points. A gate must charge/discharge the load capacitance through its on-resistance, so delay grows with load and shrinks with wider transistors.</p>
<h3>Power</h3>
<pre><code>Dynamic power   P_dyn = a . C . V^2 . f   (charging load each switch)
Static power    P_stat = I_leak . V        (leakage, always on)
</code></pre>
<p>Note the <strong>V^2</strong> term: lowering the supply voltage is the most effective way to save dynamic power. As transistors shrank, <strong>leakage</strong> grew and now dominates power in many chips.</p>
<h3>Noise margin</h3>
<pre><code>NMH = VOH - VIH   (high-level margin)
NML = VIL - VOL   (low-level margin)
</code></pre>
<p><strong>Noise margins</strong> are how much noise a signal can absorb before the next gate misreads it. Bigger is more robust.</p>
<h3>Fan-out</h3>
<p><strong>Fan-out</strong> is how many gate inputs one output drives. Each adds capacitance, so high fan-out slows a gate — big loads need buffering (a chain of increasing drivers).</p>
<div class="callout"><span class="badge">The eternal trade-off</span> Speed, power and area pull against each other. Wider transistors and higher voltage buy speed but cost power and area — every IC design is a balance of these three.</div>`,
    `<span class="eyebrow">ICI211 · Chương 4 · Bài 4.1</span>
<h2>Đặc tính mạch số</h2>
<h3>Trễ lan truyền</h3>
<p><strong>Trễ (tpd)</strong> là thời gian từ khi đầu vào đổi tới khi đầu ra ổn định — đo tại điểm 50%. Cổng phải nạp/xả điện dung tải qua điện trở dẫn của nó, nên trễ tăng theo tải và giảm khi transistor rộng hơn.</p>
<h3>Công suất</h3>
<pre><code>Công suất động  P_dyn = a . C . V^2 . f   (nạp tải mỗi lần chuyển)
Công suất tĩnh  P_stat = I_ro . V          (dòng rò, luôn có)
</code></pre>
<p>Chú ý số hạng <strong>V^2</strong>: hạ điện áp nguồn là cách hiệu quả nhất để tiết kiệm công suất động. Khi transistor thu nhỏ, <strong>dòng rò</strong> tăng và nay chiếm phần lớn công suất ở nhiều chip.</p>
<h3>Biên nhiễu</h3>
<pre><code>NMH = VOH - VIH   (biên mức cao)
NML = VIL - VOL   (biên mức thấp)
</code></pre>
<p><strong>Biên nhiễu</strong> là lượng nhiễu tín hiệu chịu được trước khi cổng sau đọc sai. Càng lớn càng bền vững.</p>
<h3>Fan-out</h3>
<p><strong>Fan-out</strong> là số đầu vào cổng mà một đầu ra kéo. Mỗi cái thêm điện dung, nên fan-out cao làm cổng chậm — tải lớn cần đệm (chuỗi driver tăng dần).</p>
<div class="callout"><span class="badge">Đánh đổi muôn thuở</span> Tốc độ, công suất, diện tích kéo ngược nhau. Transistor rộng và áp cao mua tốc độ nhưng tốn công suất và diện tích — mọi thiết kế IC là cân bằng ba thứ này.</div>`,
  ]]);

const c4q = quiz('ici211-quiz-4', 'Quiz 4 — Digital metrics|||Quiz 4 — Chỉ số mạch số', [
  { id: 'q1', question: 'In P = a.C.V^2.f, halving the supply voltage V changes dynamic power by roughly?|||Trong P = a.C.V^2.f, giảm một nửa điện áp V thay đổi công suất động khoảng?', options: ['Half|||Một nửa', 'One quarter|||Một phần tư', 'Double|||Gấp đôi', 'No change|||Không đổi'], correctIndex: 1, explanation: 'P tỉ lệ V^2, nên V giảm 2 lần -> công suất động còn ~1/4.' },
  { id: 'q2', question: 'Propagation delay of a gate mainly increases with?|||Trễ lan truyền của cổng chủ yếu tăng theo?', options: ['Higher noise margin|||Biên nhiễu cao hơn', 'Larger load capacitance|||Điện dung tải lớn hơn', 'Fewer transistors|||Ít transistor hơn', 'Lower temperature|||Nhiệt độ thấp hơn'], correctIndex: 1, explanation: 'Cổng phải nạp/xả tải; tải lớn -> trễ lớn.' },
  { id: 'q3', question: 'A high fan-out on an output tends to?|||Fan-out cao trên một đầu ra có xu hướng?', options: ['Speed the gate up|||Làm cổng nhanh hơn', 'Slow the gate down|||Làm cổng chậm lại', 'Raise Vt|||Tăng Vt', 'Remove leakage|||Xoá dòng rò'], correctIndex: 1, explanation: 'Mỗi tải thêm điện dung -> trễ tăng; tải lớn cần buffer.' },
]);

const c5 = doc('ici211-5-1-layout-fabrication', '5.1 — Layout & fabrication|||5.1 — Layout & quy trình chế tạo',
  'Layout là gì (các lớp diffusion/poly/metal/contact); design rule (lambda/micron); mask & quang khắc; các bước chế tạo (oxi hoá, cấy ion, lắng, khắc, kim loại hoá); DRC & LVS.',
  [[
    `<span class="eyebrow">ICI211 · Chapter 5 · Lesson 5.1</span>
<h2>Layout &amp; fabrication</h2>
<h3>What layout is</h3>
<p><strong>Layout</strong> is the geometric drawing of a circuit — coloured rectangles on stacked layers that the fab turns into physical structures:</p>
<ul>
<li><strong>Diffusion (active)</strong> — where source/drain live</li>
<li><strong>Poly</strong> — the gate; where poly crosses diffusion, a transistor forms</li>
<li><strong>Contact / via</strong> — vertical connections between layers</li>
<li><strong>Metal 1..N</strong> — the wires</li>
</ul>
<h3>Design rules</h3>
<p><strong>Design rules</strong> are the fab's minimum widths and spacings (often stated in the <strong>lambda</strong> or micron system). Break one and the chip may not manufacture reliably. They are the contract between designer and foundry.</p>
<h3>Fabrication flow</h3>
<pre><code>Oxidation   -> grow insulating SiO2
Photolitho  -> mask + UV pattern the photoresist
Ion implant -> dope regions (make n / p type)
Deposition  -> add poly / oxide / metal layers
Etch        -> remove unwanted material
Metalize    -> wire everything together
(repeat, layer by layer)
</code></pre>
<h3>DRC &amp; LVS</h3>
<p>Two sign-off checks on the layout: <strong>DRC (Design Rule Check)</strong> confirms the geometry obeys the fab rules; <strong>LVS (Layout Versus Schematic)</strong> confirms the drawn layout matches the intended circuit. Both must be clean before tape-out.</p>
<div class="callout"><span class="badge">Masks</span> Each layer needs a photomask. More layers = more masks = more cost — one reason advanced nodes are so expensive.</div>`,
    `<span class="eyebrow">ICI211 · Chương 5 · Bài 5.1</span>
<h2>Layout &amp; quy trình chế tạo</h2>
<h3>Layout là gì</h3>
<p><strong>Layout</strong> là bản vẽ hình học của mạch — các hình chữ nhật màu trên nhiều lớp xếp chồng mà xưởng đúc biến thành cấu trúc vật lý:</p>
<ul>
<li><strong>Diffusion (vùng tích cực)</strong> — nơi có source/drain</li>
<li><strong>Poly</strong> — cực cổng; nơi poly cắt qua diffusion sẽ hình thành transistor</li>
<li><strong>Contact / via</strong> — nối dọc giữa các lớp</li>
<li><strong>Metal 1..N</strong> — các đường dây</li>
</ul>
<h3>Quy tắc thiết kế (design rule)</h3>
<p><strong>Design rule</strong> là bề rộng và khoảng cách tối thiểu của xưởng đúc (thường nêu theo hệ <strong>lambda</strong> hoặc micron). Vi phạm một quy tắc thì chip có thể không chế tạo được ổn định. Đây là giao kèo giữa người thiết kế và xưởng.</p>
<h3>Luồng chế tạo</h3>
<pre><code>Oxi hoá     -> mọc lớp cách điện SiO2
Quang khắc  -> mask + tia UV tạo hình chất cản quang
Cấy ion     -> pha tạp (tạo bán dẫn loại n / p)
Lắng đọng   -> thêm lớp poly / oxit / kim loại
Khắc (etch) -> loại bỏ vật liệu thừa
Kim loại hoá-> nối dây tất cả lại
(lặp lại, từng lớp một)
</code></pre>
<h3>DRC &amp; LVS</h3>
<p>Hai phép kiểm sign-off trên layout: <strong>DRC (Design Rule Check)</strong> xác nhận hình học tuân thủ quy tắc xưởng; <strong>LVS (Layout Versus Schematic)</strong> xác nhận layout đã vẽ khớp với mạch dự định. Cả hai phải sạch trước khi tape-out.</p>
<div class="callout"><span class="badge">Mask</span> Mỗi lớp cần một photomask. Càng nhiều lớp = càng nhiều mask = càng đắt — một lý do các node tiên tiến rất tốn kém.</div>`,
  ]]);

const c5q = quiz('ici211-quiz-5', 'Quiz 5 — Layout & fabrication|||Quiz 5 — Layout & chế tạo', [
  { id: 'q1', question: 'A transistor is formed in layout where?|||Trong layout, transistor hình thành ở nơi?', options: ['Two metal layers cross|||Hai lớp metal cắt nhau', 'Poly crosses diffusion|||Poly cắt qua diffusion', 'A contact meets metal|||Contact gặp metal', 'Two vias overlap|||Hai via chồng nhau'], correctIndex: 1, explanation: 'Cổng poly bắc qua vùng diffusion tạo nên kênh transistor.' },
  { id: 'q2', question: 'DRC checks that the layout?|||DRC kiểm rằng layout?', options: ['Matches the schematic|||Khớp với sơ đồ mạch', 'Obeys the fab spacing/width rules|||Tuân thủ quy tắc bề rộng/khoảng cách của xưởng', 'Runs fast enough|||Chạy đủ nhanh', 'Uses low power|||Ít tốn điện'], correctIndex: 1, explanation: 'DRC kiểm hình học theo design rule; LVS mới so với schematic.' },
  { id: 'q3', question: 'Which step dopes silicon to make n-type or p-type regions?|||Bước nào pha tạp silic để tạo vùng loại n hay p?', options: ['Oxidation|||Oxi hoá', 'Ion implantation|||Cấy ion', 'Etching|||Khắc', 'Metalization|||Kim loại hoá'], correctIndex: 1, explanation: 'Cấy ion đưa tạp chất vào silic để định loại bán dẫn.' },
]);

const c6 = doc('ici211-6-1-analog-blocks', '6.1 — Basic analog circuits|||6.1 — Mạch analog cơ bản',
  'Gương dòng (current mirror) và vai trò phân cực; cặp khuếch đại vi sai (differential pair) và triệt nhiễu chung; op-amp CMOS (hai tầng) và độ lợi vòng hở; vì sao matching quan trọng.',
  [[
    `<span class="eyebrow">ICI211 · Chapter 6 · Lesson 6.1</span>
<h2>Basic analog circuits</h2>
<h3>Current mirror</h3>
<p>A <strong>current mirror</strong> copies a reference current into one or more branches. Two matched transistors share a gate voltage, so the output current mirrors the input — the workhorse for <strong>biasing</strong> analog blocks and building current-source loads.</p>
<h3>Differential pair</h3>
<p>The <strong>differential pair</strong> — two matched transistors sharing a tail current source — amplifies the <em>difference</em> between two inputs and rejects what they have in common (<strong>common-mode rejection</strong>). This makes analog front-ends immune to shared noise and is the input stage of nearly every op-amp.</p>
<h3>CMOS op-amp</h3>
<pre><code>Stage 1: differential pair + current-mirror load  (high gain)
Stage 2: common-source amplifier                  (more gain + swing)
Result:  very high open-loop gain (Aol), used with
         feedback to set a precise, stable gain
</code></pre>
<p>An <strong>op-amp</strong> with feedback gives amplifiers, filters, comparators and the building blocks of data converters.</p>
<div class="callout"><span class="badge">Matching is everything</span> Analog performance rests on transistors being nearly identical. Layout tricks — common-centroid, dummy devices — fight mismatch; this is why analog is hand-crafted, not auto-placed.</div>`,
    `<span class="eyebrow">ICI211 · Chương 6 · Bài 6.1</span>
<h2>Mạch analog cơ bản</h2>
<h3>Gương dòng (current mirror)</h3>
<p>Một <strong>gương dòng</strong> sao chép một dòng tham chiếu sang một hay nhiều nhánh. Hai transistor khớp nhau dùng chung áp cổng, nên dòng ra soi theo dòng vào — công cụ chủ lực để <strong>phân cực</strong> khối analog và dựng tải nguồn dòng.</p>
<h3>Cặp vi sai (differential pair)</h3>
<p><strong>Cặp vi sai</strong> — hai transistor khớp nhau chung một nguồn dòng đuôi — khuếch đại <em>hiệu</em> giữa hai đầu vào và loại bỏ phần chung (<strong>triệt tín hiệu chung, CMRR</strong>). Nhờ đó tầng đầu analog miễn với nhiễu chung, và nó là tầng vào của gần như mọi op-amp.</p>
<h3>Op-amp CMOS</h3>
<pre><code>Tầng 1: cặp vi sai + tải gương dòng   (độ lợi cao)
Tầng 2: khuếch đại cực nguồn chung     (thêm độ lợi + biên áp)
Kết quả: độ lợi vòng hở (Aol) rất cao, dùng kèm
         hồi tiếp để đặt độ lợi chính xác, ổn định
</code></pre>
<p>Một <strong>op-amp</strong> có hồi tiếp cho ra mạch khuếch đại, bộ lọc, mạch so sánh và các khối dựng nên bộ chuyển đổi dữ liệu.</p>
<div class="callout"><span class="badge">Matching là tất cả</span> Hiệu năng analog dựa vào các transistor gần như giống hệt nhau. Mẹo layout — common-centroid, linh kiện giả (dummy) — chống lệch (mismatch); vì thế analog được vẽ tay, không đặt tự động.</div>`,
  ]]);

const c6q = quiz('ici211-quiz-6', 'Quiz 6 — Analog blocks|||Quiz 6 — Khối analog', [
  { id: 'q1', question: 'A current mirror is mainly used to?|||Gương dòng chủ yếu dùng để?', options: ['Store data|||Lưu dữ liệu', 'Copy a reference current for biasing|||Sao dòng tham chiếu để phân cực', 'Generate a clock|||Tạo xung nhịp', 'Rectify AC|||Chỉnh lưu AC'], correctIndex: 1, explanation: 'Gương dòng nhân bản dòng tham chiếu, dùng phân cực và làm tải nguồn dòng.' },
  { id: 'q2', question: 'A differential pair amplifies the ___ of its two inputs.|||Cặp vi sai khuếch đại ___ của hai đầu vào.', options: ['Sum|||Tổng', 'Difference|||Hiệu', 'Product|||Tích', 'Average only|||Chỉ trung bình'], correctIndex: 1, explanation: 'Nó khuếch đại hiệu và triệt tín hiệu chung (common-mode).' },
  { id: 'q3', question: 'Why is analog layout done by hand, not auto-placed?|||Vì sao layout analog vẽ tay chứ không đặt tự động?', options: ['To save software licenses|||Để tiết kiệm bản quyền phần mềm', 'Transistor matching must be preserved|||Phải giữ độ khớp của transistor', 'Analog uses no transistors|||Analog không dùng transistor', 'It runs faster|||Nó chạy nhanh hơn'], correctIndex: 1, explanation: 'Hiệu năng analog phụ thuộc matching; layout tay dùng common-centroid, dummy để chống lệch.' },
]);

const c7 = doc('ici211-7-1-memory-sequential', '7.1 — Memory & sequential circuits|||7.1 — Bộ nhớ & mạch tuần tự',
  'Tế bào SRAM 6T (bền, nhanh) vs DRAM 1T1C (đặc, cần refresh); mạch tuần tự: latch vs flip-flop; setup/hold time; xung nhịp (clock) và vì sao đồng bộ; phân phối clock.',
  [[
    `<span class="eyebrow">ICI211 · Chapter 7 · Lesson 7.1</span>
<h2>Memory &amp; sequential circuits</h2>
<h3>SRAM vs DRAM</h3>
<ul>
<li><strong>SRAM (6T cell)</strong> — two cross-coupled inverters plus two access transistors. Fast and stable, holds data as long as it is powered, but big (6 transistors/bit). Used for caches.</li>
<li><strong>DRAM (1T1C cell)</strong> — one transistor + one tiny capacitor. Very dense (1 bit in almost no area) but the charge leaks, so it must be <strong>refreshed</strong> periodically. Used for main memory.</li>
</ul>
<h3>Latch vs flip-flop</h3>
<p>Combinational logic has no memory; <strong>sequential</strong> logic does. A <strong>latch</strong> is level-sensitive (transparent while the clock is high); a <strong>flip-flop</strong> is edge-triggered (captures on the clock edge) — the standard state element in synchronous design.</p>
<h3>Timing: setup &amp; hold</h3>
<pre><code>Setup time: data must be stable BEFORE the clock edge
Hold time:  data must stay stable AFTER the clock edge
Max clock frequency is limited by the slowest
   register-to-register path (the critical path).
</code></pre>
<h3>Clocking</h3>
<p>A <strong>clock</strong> synchronizes when every flip-flop updates, so the whole chip moves in lockstep. Delivering it everywhere with tiny skew — the <strong>clock tree</strong> — is one of the hardest jobs in physical design.</p>
<div class="callout"><span class="badge">Density vs speed</span> DRAM wins on density (1 transistor), SRAM wins on speed and simplicity (no refresh). That trade-off is why chips use both — SRAM caches in front of DRAM main memory.</div>`,
    `<span class="eyebrow">ICI211 · Chương 7 · Bài 7.1</span>
<h2>Bộ nhớ &amp; mạch tuần tự</h2>
<h3>SRAM vs DRAM</h3>
<ul>
<li><strong>SRAM (tế bào 6T)</strong> — hai inverter chéo nhau cộng hai transistor truy cập. Nhanh và ổn định, giữ dữ liệu khi còn cấp điện, nhưng to (6 transistor/bit). Dùng cho cache.</li>
<li><strong>DRAM (tế bào 1T1C)</strong> — một transistor + một tụ nhỏ xíu. Rất đặc (1 bit gần như không tốn diện tích) nhưng điện tích rò, nên phải <strong>làm tươi (refresh)</strong> định kỳ. Dùng làm bộ nhớ chính.</li>
</ul>
<h3>Latch vs flip-flop</h3>
<p>Logic tổ hợp không có nhớ; logic <strong>tuần tự</strong> thì có. <strong>Latch</strong> nhạy theo mức (trong suốt khi clock cao); <strong>flip-flop</strong> kích theo sườn (chốt tại sườn clock) — phần tử trạng thái chuẩn trong thiết kế đồng bộ.</p>
<h3>Định thời: setup &amp; hold</h3>
<pre><code>Setup time: dữ liệu phải ổn định TRƯỚC sườn clock
Hold time:  dữ liệu phải giữ ổn định SAU sườn clock
Tần số clock tối đa bị giới hạn bởi đường
   thanh-ghi-tới-thanh-ghi chậm nhất (đường tới hạn).
</code></pre>
<h3>Xung nhịp (clock)</h3>
<p><strong>Clock</strong> đồng bộ thời điểm mọi flip-flop cập nhật, để cả chip bước cùng nhịp. Đưa nó tới mọi nơi với độ lệch (skew) cực nhỏ — <strong>cây clock</strong> — là một trong những việc khó nhất của thiết kế vật lý.</p>
<div class="callout"><span class="badge">Đặc vs nhanh</span> DRAM thắng về mật độ (1 transistor), SRAM thắng về tốc độ và đơn giản (không refresh). Chính đánh đổi đó khiến chip dùng cả hai — cache SRAM đứng trước bộ nhớ chính DRAM.</div>`,
  ]]);

const c7q = quiz('ici211-quiz-7', 'Quiz 7 — Memory & sequential|||Quiz 7 — Bộ nhớ & tuần tự', [
  { id: 'q1', question: 'Which memory cell needs periodic refresh?|||Tế bào bộ nhớ nào cần làm tươi định kỳ?', options: ['SRAM (6T)', 'DRAM (1T1C)', 'A flip-flop|||Một flip-flop', 'A NAND gate|||Một cổng NAND'], correctIndex: 1, explanation: 'DRAM lưu điện tích trên tụ, bị rò nên phải refresh; SRAM thì không.' },
  { id: 'q2', question: 'Setup time is the interval where data must be stable?|||Setup time là khoảng dữ liệu phải ổn định?', options: ['After the clock edge|||Sau sườn clock', 'Before the clock edge|||Trước sườn clock', 'During reset only|||Chỉ khi reset', 'Never|||Không bao giờ'], correctIndex: 1, explanation: 'Setup: dữ liệu ổn định trước sườn; hold: ổn định sau sườn.' },
  { id: 'q3', question: 'Max clock frequency is set by the?|||Tần số clock tối đa được định bởi?', options: ['Fastest path|||Đường nhanh nhất', 'Slowest register-to-register path|||Đường thanh-ghi-tới-thanh-ghi chậm nhất', 'Number of SRAM cells|||Số tế bào SRAM', 'Supply current|||Dòng nguồn'], correctIndex: 1, explanation: 'Đường tới hạn (chậm nhất) giữa hai flip-flop giới hạn chu kỳ clock.' },
]);

const c8 = doc('ici211-8-1-design-flow-eda', '8.1 — Design flow & EDA|||8.1 — Quy trình thiết kế & EDA',
  'Luồng RTL→GDSII: đặc tả → RTL → mô phỏng → tổng hợp (synthesis) → place & route → STA & kiểm chứng vật lý (DRC/LVS) → tape-out; kiểm chứng chức năng; xu hướng (FinFET, chiplet, AI-EDA).',
  [[
    `<span class="eyebrow">ICI211 · Chapter 8 · Lesson 8.1</span>
<h2>Design flow &amp; EDA</h2>
<h3>The RTL-to-GDSII flow</h3>
<pre><code>1. Spec           - what the chip must do
2. RTL (Verilog)  - describe behavior register-transfer level
3. Simulation     - verify function (testbenches)
4. Synthesis      - RTL -> gate-level netlist (maps to a cell library)
5. Place &amp; Route  - put cells on silicon, wire them up
6. STA + DRC/LVS  - timing sign-off + physical verification
7. Tape-out       - ship GDSII to the foundry
</code></pre>
<h3>Front-end vs back-end</h3>
<p><strong>Front-end</strong> is RTL, verification and synthesis (logic). <strong>Back-end</strong> is placement, routing and sign-off (physical). <strong>Static Timing Analysis (STA)</strong> checks every path meets setup/hold without running simulation.</p>
<h3>Verification</h3>
<p>Verification eats most of the schedule. Beyond directed tests, teams use <strong>constrained-random</strong> stimulus, <strong>coverage</strong> to measure what has been exercised, and <strong>formal</strong> methods to prove properties. A functional bug found after tape-out can cost a multi-million-dollar re-spin.</p>
<h3>Trends</h3>
<p>Devices moved from planar to <strong>FinFET</strong> and now gate-all-around; systems split into <strong>chiplets</strong> in one package; and <strong>AI is entering EDA</strong> to place, route and optimize faster than humans.</p>
<div class="callout"><span class="badge">Try it free</span> OpenLane on the SKY130 PDK runs this whole flow on open tools — take a small Verilog block from RTL to GDSII yourself.</div>`,
    `<span class="eyebrow">ICI211 · Chương 8 · Bài 8.1</span>
<h2>Quy trình thiết kế &amp; EDA</h2>
<h3>Luồng RTL-to-GDSII</h3>
<pre><code>1. Đặc tả          - chip phải làm gì
2. RTL (Verilog)   - mô tả hành vi mức chuyển thanh ghi
3. Mô phỏng        - kiểm chức năng (testbench)
4. Tổng hợp        - RTL -> netlist mức cổng (ánh xạ thư viện cell)
5. Place &amp; Route   - đặt cell lên silic, nối dây
6. STA + DRC/LVS   - sign-off định thời + kiểm chứng vật lý
7. Tape-out        - gửi GDSII tới xưởng đúc
</code></pre>
<h3>Front-end vs back-end</h3>
<p><strong>Front-end</strong> là RTL, kiểm chứng và tổng hợp (logic). <strong>Back-end</strong> là đặt chỗ, nối dây và sign-off (vật lý). <strong>Phân tích định thời tĩnh (STA)</strong> kiểm mọi đường đạt setup/hold mà không cần mô phỏng.</p>
<h3>Kiểm chứng (verification)</h3>
<p>Kiểm chứng ngốn phần lớn lịch trình. Ngoài test chỉ định, đội ngũ dùng kích thích <strong>ngẫu nhiên có ràng buộc</strong>, <strong>độ phủ (coverage)</strong> để đo đã thử tới đâu, và phương pháp <strong>hình thức (formal)</strong> để chứng minh tính chất. Một lỗi chức năng phát hiện sau tape-out có thể tốn hàng triệu đô để làm lại (re-spin).</p>
<h3>Xu hướng</h3>
<p>Linh kiện chuyển từ phẳng sang <strong>FinFET</strong> và nay gate-all-around; hệ thống tách thành <strong>chiplet</strong> trong một gói; và <strong>AI đang bước vào EDA</strong> để đặt chỗ, nối dây và tối ưu nhanh hơn con người.</p>
<div class="callout"><span class="badge">Thử miễn phí</span> OpenLane trên PDK SKY130 chạy cả luồng này bằng công cụ mở — tự đưa một khối Verilog nhỏ từ RTL tới GDSII.</div>`,
  ]]);

const c8q = quiz('ici211-quiz-8', 'Quiz 8 — Design flow & EDA|||Quiz 8 — Luồng thiết kế & EDA', [
  { id: 'q1', question: 'Synthesis converts RTL into?|||Tổng hợp (synthesis) biến RTL thành?', options: ['A layout (GDSII)|||Một layout (GDSII)', 'A gate-level netlist|||Một netlist mức cổng', 'A testbench|||Một testbench', 'A photomask|||Một photomask'], correctIndex: 1, explanation: 'Synthesis ánh xạ RTL sang netlist các cổng/cell tiêu chuẩn.' },
  { id: 'q2', question: 'Static Timing Analysis (STA) checks timing?|||Phân tích định thời tĩnh (STA) kiểm định thời?', options: ['By running full simulation|||Bằng chạy mô phỏng đầy đủ', 'Without simulation, on all paths|||Không cần mô phỏng, trên mọi đường', 'Only for analog blocks|||Chỉ cho khối analog', 'Only after tape-out|||Chỉ sau tape-out'], correctIndex: 1, explanation: 'STA phân tích mọi đường theo setup/hold mà không cần mô phỏng vector.' },
  { id: 'q3', question: 'The final step, sending layout data to the foundry, is called?|||Bước cuối, gửi dữ liệu layout tới xưởng đúc, gọi là?', options: ['Synthesis|||Tổng hợp', 'Place & route|||Đặt chỗ & nối dây', 'Tape-out|||Tape-out', 'Refresh|||Làm tươi'], correctIndex: 2, explanation: 'Tape-out là bước gửi GDSII tới foundry để chế tạo.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'ICI211',
    slug: 'ici211-ic-design-introduction',
    title: 'IC Design Introduction',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/ICI211.webp',
    shortDescription: 'How CMOS chips are designed — MOS transistor, CMOS logic gates, delay/power/noise, layout & fabrication (DRC/LVS), analog blocks (current mirror, op-amp), SRAM/DRAM & the RTL-to-GDSII EDA flow. Bilingual, with circuits & quizzes.|||Chip CMOS được thiết kế thế nào — transistor MOS, cổng logic CMOS, trễ/công suất/nhiễu, layout & chế tạo, khối analog, bộ nhớ & luồng EDA RTL-to-GDSII. Song ngữ, có mạch & quiz.',
    description: 'Môn <strong>ICI211 — IC Design Introduction</strong> (kỳ 5, ngành Thiết kế vi mạch bán dẫn) đưa bạn từ một <strong>transistor MOS</strong> lên tới luồng thiết kế chip hiện đại. Từ <strong>tổng quan &amp; EDA</strong> → <strong>MOSFET</strong> (vùng làm việc, W/L) → <strong>cổng logic CMOS</strong> (inverter, NAND/NOR, VTC) → <strong>đặc tính số</strong> (trễ, công suất, biên nhiễu, fan-out) → <strong>layout &amp; chế tạo</strong> (design rule, mask, DRC/LVS) → <strong>analog</strong> (gương dòng, cặp vi sai, op-amp) → <strong>bộ nhớ &amp; mạch tuần tự</strong> (SRAM/DRAM, flip-flop, clocking) → <strong>luồng RTL-to-GDSII &amp; EDA</strong>. Bám sách chuẩn (Weste &amp; Harris, Razavi, Sedra &amp; Smith), song ngữ, có mạch, công thức và quiz mỗi chương.',
    whatYouLearn: 'Phân loại analog/digital/mixed và các mức trừu tượng; MOSFET (cut-off/triode/saturation, Vt, ID theo W/L); inverter CMOS, NAND/NOR, PUN/PDN, VTC; trễ tpd, công suất P=a.C.V^2.f + rò, biên nhiễu, fan-out; layout (diffusion/poly/metal), design rule, quy trình chế tạo, DRC/LVS; gương dòng, cặp vi sai, op-amp CMOS; SRAM 6T vs DRAM 1T1C, latch/flip-flop, setup/hold, clocking; luồng RTL→GDSII (synthesis, place & route, STA, verification) và xu hướng (FinFET, chiplet, AI-EDA).',
    requirements: 'Kiến thức mạch điện tử cơ bản (khuyến nghị đã học ECI101) và toán/vật lý phổ thông. Nên thử EDA Playground (Verilog) và OpenLane/SKY130 để thực hành luồng thiết kế.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách chuẩn, tài liệu EDA, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'IC là gì, ba dòng thiết kế, lộ trình môn.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan thiết kế IC|||Chapter 1 — IC design overview', description: 'Phân loại, mức trừu tượng, EDA, ASIC vs FPGA.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Transistor MOS|||Chapter 2 — The MOS transistor', description: 'MOSFET, vùng làm việc, Vt, W/L.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Cổng logic CMOS|||Chapter 3 — CMOS logic gates', description: 'Inverter, NAND/NOR, PUN/PDN, VTC.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Đặc tính mạch số|||Chapter 4 — Digital metrics', description: 'Trễ, công suất, biên nhiễu, fan-out.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Layout & chế tạo|||Chapter 5 — Layout & fabrication', description: 'Layout, design rule, mask, DRC/LVS.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Mạch analog cơ bản|||Chapter 6 — Basic analog circuits', description: 'Gương dòng, cặp vi sai, op-amp CMOS.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Bộ nhớ & mạch tuần tự|||Chapter 7 — Memory & sequential', description: 'SRAM/DRAM, flip-flop, setup/hold, clocking.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Quy trình thiết kế & EDA|||Chapter 8 — Design flow & EDA', description: 'RTL→GDSII, synthesis, P&R, STA, verification, xu hướng.', lessons: [c8, c8q] },
  ],
};
