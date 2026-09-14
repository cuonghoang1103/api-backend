/**
 * CDP301 — Circuit Design Project (Đồ án Thiết kế mạch). Ngành Thiết kế vi mạch
 * bán dẫn, FPTU. Đây là môn ĐỒ ÁN: khung theo QUY TRÌNH làm đồ án thiết kế mạch
 * thực tế (8 giai đoạn), KHÔNG phải 8 chương lý thuyết. Song ngữ + rubric + quiz.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick lồng/${; "<"→&lt;.
 * Nguồn: Razavi (Design of Analog CMOS ICs), Weste & Harris (CMOS VLSI Design),
 * Cadence/Synopsys docs, giáo trình FLM.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức giai đoạn.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('cdp301-0-0-tai-lieu', '📚 Project materials & references|||📚 Tài liệu & tham khảo đồ án',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách kinh điển (Razavi, Weste/Harris), tài liệu EDA (Cadence/Synopsys), công cụ mô phỏng, lộ trình làm đồ án.',
  [[
    `<span class="eyebrow">CDP301 · Materials</span>
<h2>Project materials &amp; resource hub</h2>
<p class="lead">Everything to run an IC <strong>circuit design project</strong> end to end — from specification to schematic, simulation, layout and defense — in one place. The official brief, template and rubric live on <strong>FLM</strong>; below are free/legal references.</p>
<h3>📘 Brief, template &amp; rubric</h3>
<p>The official FPTU project brief, report template and grading rubric for CDP301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><em>Design of Analog CMOS Integrated Circuits</em> — Behzad Razavi (analog building blocks, specs, trade-offs).</li>
<li><em>CMOS VLSI Design: A Circuits and Systems Perspective</em> — Weste &amp; Harris (schematic, layout, timing, power).</li>
</ul>
<h3>🌐 EDA / official documentation</h3>
<ul>
<li><a href="https://www.cadence.com/en_US/home/support.html" target="_blank" rel="noopener">Cadence Support</a> — Virtuoso schematic/layout, Spectre simulation.</li>
<li><a href="https://www.synopsys.com/support.html" target="_blank" rel="noopener">Synopsys Support</a> — HSPICE, Custom Compiler, PrimeTime.</li>
<li><a href="https://ngspice.sourceforge.io/docs.html" target="_blank" rel="noopener">ngspice documentation</a> — free SPICE engine for simulation.</li>
</ul>
<h3>🛠️ Free tools</h3>
<ul>
<li><a href="http://opencircuitdesign.com/xschem/" target="_blank" rel="noopener">Xschem</a> — schematic capture for SPICE.</li>
<li><a href="http://opencircuitdesign.com/magic/" target="_blank" rel="noopener">Magic</a> — layout editor with built-in DRC.</li>
<li><a href="https://www.klayout.de/" target="_blank" rel="noopener">KLayout</a> — layout viewer/editor &amp; DRC.</li>
</ul>
<div class="callout"><span class="badge">Project path</span>
<ol>
<li><strong>Define</strong> — pin down the spec (what, how well, under what constraints).</li>
<li><strong>Design</strong> — pick an architecture, draw the schematic, simulate until it meets spec.</li>
<li><strong>Physical</strong> — lay it out, pass DRC/LVS, re-check performance post-layout.</li>
<li><strong>Deliver</strong> — test, optimize, document and defend the design.</li>
</ol></div>`,
    `<span class="eyebrow">CDP301 · Tài liệu</span>
<h2>Trung tâm tài liệu &amp; tham khảo</h2>
<p class="lead">Mọi thứ để chạy một <strong>đồ án thiết kế mạch</strong> tích hợp trọn vẹn — từ đặc tả tới sơ đồ, mô phỏng, layout và bảo vệ — gom về một chỗ. Đề bài, mẫu báo cáo và rubric chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí/hợp pháp.</p>
<h3>📘 Đề bài, mẫu &amp; rubric</h3>
<p>Đề bài đồ án, mẫu báo cáo và rubric chấm chính thức của CDP301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><em>Design of Analog CMOS Integrated Circuits</em> — Behzad Razavi (khối analog, đặc tả, đánh đổi).</li>
<li><em>CMOS VLSI Design: A Circuits and Systems Perspective</em> — Weste &amp; Harris (sơ đồ, layout, timing, công suất).</li>
</ul>
<h3>🌐 Tài liệu EDA / chính thức</h3>
<ul>
<li><a href="https://www.cadence.com/en_US/home/support.html" target="_blank" rel="noopener">Cadence Support</a> — Virtuoso schematic/layout, mô phỏng Spectre.</li>
<li><a href="https://www.synopsys.com/support.html" target="_blank" rel="noopener">Synopsys Support</a> — HSPICE, Custom Compiler, PrimeTime.</li>
<li><a href="https://ngspice.sourceforge.io/docs.html" target="_blank" rel="noopener">Tài liệu ngspice</a> — công cụ SPICE miễn phí để mô phỏng.</li>
</ul>
<h3>🛠️ Công cụ miễn phí</h3>
<ul>
<li><a href="http://opencircuitdesign.com/xschem/" target="_blank" rel="noopener">Xschem</a> — vẽ sơ đồ nguyên lý cho SPICE.</li>
<li><a href="http://opencircuitdesign.com/magic/" target="_blank" rel="noopener">Magic</a> — trình vẽ layout kèm DRC.</li>
<li><a href="https://www.klayout.de/" target="_blank" rel="noopener">KLayout</a> — xem/sửa layout &amp; DRC.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình đồ án</span>
<ol>
<li><strong>Xác định</strong> — chốt đặc tả (làm gì, tốt tới đâu, trong ràng buộc nào).</li>
<li><strong>Thiết kế</strong> — chọn kiến trúc, vẽ sơ đồ, mô phỏng tới khi đạt đặc tả.</li>
<li><strong>Vật lý</strong> — vẽ layout, qua DRC/LVS, kiểm lại hiệu năng sau layout.</li>
<li><strong>Bàn giao</strong> — kiểm thử, tối ưu, viết tài liệu và bảo vệ đồ án.</li>
</ol></div>`,
  ]]);

const intro = doc('cdp301-0-1-overview', 'Course overview: what a design project is|||Tổng quan: đồ án thiết kế mạch là gì',
  'Môn ĐỒ ÁN (không phải lý thuyết): chạy trọn quy trình thiết kế mạch tích hợp qua 8 giai đoạn; sản phẩm bàn giao (deliverable) và rubric chấm.',
  [[
    `<span class="eyebrow">CDP301 · Lesson 0.1 · Overview</span>
<h2>Circuit Design Project</h2>
<p class="lead">CDP301 is a <strong>project course</strong>, not a lecture course. Instead of eight chapters of theory, you run <strong>one real IC circuit design</strong> — for example a two-stage op-amp, a bandgap reference, an LDO regulator or an SRAM cell — through the <strong>full industrial design flow</strong>, from a written specification all the way to a laid-out, verified block you defend in front of reviewers.</p>
<h3>The 8 project phases</h3>
<pre><code>1. Specification        -&gt; write measurable targets &amp; constraints
2. Architecture         -&gt; research &amp; choose a topology
3. Schematic design     -&gt; size devices, draw the circuit
4. Simulation           -&gt; SPICE: verify every spec, all corners
5. Layout + DRC/LVS     -&gt; physical design, pass verification
6. Performance analysis -&gt; timing, power, noise (post-layout)
7. Test, optimize, doc  -&gt; close gaps, write the design doc
8. Report &amp; defense     -&gt; present, defend, capture lessons</code></pre>
<h3>Deliverables</h3>
<ul>
<li><strong>Specification sheet</strong> — target table with numbers, units, conditions.</li>
<li><strong>Schematic + sizing</strong> — annotated circuit and a device table.</li>
<li><strong>Simulation report</strong> — plots and a spec-vs-measured table across corners.</li>
<li><strong>Layout</strong> — clean <strong>DRC</strong> and <strong>LVS</strong> reports.</li>
<li><strong>Design document + slides</strong> — for the defense.</li>
</ul>
<h3>How it is graded (typical rubric)</h3>
<pre><code>Specification &amp; planning ....... 10%
Architecture justification ..... 15%
Schematic &amp; simulation ......... 25%
Layout, DRC/LVS ................ 20%
Performance vs spec ............ 15%
Report &amp; documentation ......... 10%
Defense (Q&amp;A) .................. 5%</code></pre>
<div class="callout"><span class="badge">Mindset</span> A project is judged on <strong>evidence</strong>, not opinions: every claim ("it meets the gain spec") must be backed by a simulation plot or a measured number. Keep a lab notebook from day one.</div>`,
    `<span class="eyebrow">CDP301 · Bài 0.1 · Tổng quan</span>
<h2>Đồ án Thiết kế mạch</h2>
<p class="lead">CDP301 là <strong>môn đồ án</strong>, không phải môn lý thuyết. Thay cho tám chương lý thuyết, bạn chạy <strong>một thiết kế mạch tích hợp thật</strong> — ví dụ op-amp hai tầng, mạch tham chiếu bandgap, ổn áp LDO hay ô nhớ SRAM — qua <strong>trọn quy trình thiết kế công nghiệp</strong>, từ bản đặc tả viết ra cho tới một khối đã vẽ layout, đã kiểm chứng và bạn bảo vệ trước hội đồng.</p>
<h3>8 giai đoạn đồ án</h3>
<pre><code>1. Đặc tả (spec)        -&gt; viết mục tiêu đo được &amp; ràng buộc
2. Kiến trúc            -&gt; nghiên cứu &amp; chọn topology
3. Sơ đồ nguyên lý      -&gt; định kích thước linh kiện, vẽ mạch
4. Mô phỏng            -&gt; SPICE: kiểm mọi spec, mọi góc (corner)
5. Layout + DRC/LVS     -&gt; thiết kế vật lý, qua kiểm chứng
6. Phân tích hiệu năng  -&gt; timing, công suất, nhiễu (sau layout)
7. Kiểm thử, tối ưu, TL -&gt; vá khoảng hụt, viết tài liệu thiết kế
8. Báo cáo &amp; bảo vệ     -&gt; trình bày, bảo vệ, đúc kết bài học</code></pre>
<h3>Sản phẩm bàn giao (deliverable)</h3>
<ul>
<li><strong>Bảng đặc tả</strong> — mục tiêu kèm con số, đơn vị, điều kiện.</li>
<li><strong>Sơ đồ + kích thước</strong> — mạch có chú thích và bảng linh kiện.</li>
<li><strong>Báo cáo mô phỏng</strong> — đồ thị và bảng spec đối chiếu số đo qua các corner.</li>
<li><strong>Layout</strong> — báo cáo <strong>DRC</strong> và <strong>LVS</strong> sạch.</li>
<li><strong>Tài liệu thiết kế + slide</strong> — cho buổi bảo vệ.</li>
</ul>
<h3>Chấm điểm thế nào (rubric điển hình)</h3>
<pre><code>Đặc tả &amp; lập kế hoạch .......... 10%
Biện luận kiến trúc ............ 15%
Sơ đồ &amp; mô phỏng ............... 25%
Layout, DRC/LVS ................ 20%
Hiệu năng so với spec .......... 15%
Báo cáo &amp; tài liệu ............. 10%
Bảo vệ (hỏi &amp; đáp) ............. 5%</code></pre>
<div class="callout"><span class="badge">Tư duy</span> Đồ án được chấm bằng <strong>bằng chứng</strong>, không phải ý kiến: mỗi khẳng định ("đạt spec độ lợi") phải có một đồ thị mô phỏng hoặc một con số đo kèm theo. Ghi sổ tay từ ngày đầu.</div>`,
  ]]);

const g1 = doc('cdp301-1-1-specification', '1 — Specification & requirements|||1 — Đặc tả & yêu cầu kỹ thuật',
  'Biến đề bài mơ hồ thành bảng chỉ tiêu đo được (mục tiêu, đơn vị, điều kiện); ràng buộc (công nghệ, nguồn, diện tích); tiêu chí nghiệm thu.',
  [[
    `<span class="eyebrow">CDP301 · Phase 1</span>
<h2>Specification &amp; requirements</h2>
<p>The project starts by turning a vague ask ("design an amplifier") into a <strong>measurable specification</strong>. If a target has no number, no unit and no test condition, it cannot be verified — and what cannot be verified cannot be graded.</p>
<h3>What a good spec contains</h3>
<ul>
<li><strong>Functional targets</strong> — the numbers the block must hit (gain, bandwidth, accuracy).</li>
<li><strong>Constraints</strong> — the box you must stay inside (supply voltage, process node, area, power budget).</li>
<li><strong>Conditions / corners</strong> — where the targets must hold (temperature range, PVT corners, load).</li>
<li><strong>Acceptance criteria</strong> — pass/fail thresholds used at sign-off.</li>
</ul>
<pre><code>Example spec — two-stage op-amp (180nm, 1.8V):
  Parameter        Target        Condition
  DC gain          &gt;= 70 dB      TT, 27C
  Unity-gain BW    &gt;= 50 MHz     CL = 2 pF
  Phase margin     &gt;= 60 deg     CL = 2 pF
  Power            &lt;= 1.0 mW     VDD = 1.8 V
  Slew rate        &gt;= 20 V/us    CL = 2 pF
  Corners          pass all      SS/TT/FF, 0..85C</code></pre>
<div class="callout"><span class="badge">Rule</span> Every row has a <strong>number</strong>, a <strong>unit</strong> and a <strong>condition</strong>. "Fast" and "low power" are not specs; "BW &gt;= 50 MHz at CL = 2 pF" is.</div>`,
    `<span class="eyebrow">CDP301 · Giai đoạn 1</span>
<h2>Đặc tả &amp; yêu cầu kỹ thuật</h2>
<p>Đồ án bắt đầu bằng việc biến một yêu cầu mơ hồ ("thiết kế một mạch khuếch đại") thành <strong>bản đặc tả đo được</strong>. Nếu một mục tiêu không có con số, không đơn vị, không điều kiện đo thì không kiểm chứng được — mà thứ không kiểm chứng được thì không chấm được.</p>
<h3>Một bản đặc tả tốt gồm gì</h3>
<ul>
<li><strong>Mục tiêu chức năng</strong> — các con số khối phải đạt (độ lợi, băng thông, độ chính xác).</li>
<li><strong>Ràng buộc</strong> — cái hộp bạn phải nằm trong (điện áp nguồn, nút công nghệ, diện tích, ngân sách công suất).</li>
<li><strong>Điều kiện / corner</strong> — nơi mục tiêu phải đúng (dải nhiệt, các corner PVT, tải).</li>
<li><strong>Tiêu chí nghiệm thu</strong> — ngưỡng đạt/trượt dùng khi chốt (sign-off).</li>
</ul>
<pre><code>Ví dụ spec — op-amp hai tầng (180nm, 1.8V):
  Tham số          Mục tiêu      Điều kiện
  Độ lợi DC        &gt;= 70 dB      TT, 27C
  BW độ lợi 1      &gt;= 50 MHz     CL = 2 pF
  Biên pha         &gt;= 60 do      CL = 2 pF
  Công suất        &lt;= 1.0 mW     VDD = 1.8 V
  Slew rate        &gt;= 20 V/us    CL = 2 pF
  Corner           đạt tất cả    SS/TT/FF, 0..85C</code></pre>
<div class="callout"><span class="badge">Quy tắc</span> Mỗi dòng có một <strong>con số</strong>, một <strong>đơn vị</strong> và một <strong>điều kiện</strong>. "Nhanh" và "ít tốn điện" không phải spec; "BW &gt;= 50 MHz tại CL = 2 pF" mới là spec.</div>`,
  ]]);

const g1q = quiz('cdp301-quiz-1', 'Quiz 1 — Đặc tả', [
  { id: 'q1', question: 'Vì sao "thiết kế mạch nhanh, ít tốn điện" chưa phải một đặc tả tốt?', options: ['Vì câu quá dài', 'Vì thiếu con số, đơn vị và điều kiện đo → không kiểm chứng được', 'Vì nói tiếng Việt', 'Vì không nhắc tới transistor'], correctIndex: 1, explanation: 'Đặc tả phải đo được: mỗi mục tiêu cần con số + đơn vị + điều kiện, nếu không thì không nghiệm thu được.' },
  { id: 'q2', question: 'Trong bản đặc tả, "VDD = 1.8V, diện tích ≤ 0.02mm²" là loại thông tin gì?', options: ['Mục tiêu chức năng', 'Ràng buộc (constraint)', 'Tiêu chí nghiệm thu', 'Kết quả mô phỏng'], correctIndex: 1, explanation: 'Điện áp nguồn và diện tích là ràng buộc — cái hộp thiết kế phải nằm trong.' },
  { id: 'q3', question: 'Corner PVT (vd SS/TT/FF, 0..85°C) trong spec dùng để làm gì?', options: ['Trang trí báo cáo', 'Xác định các điều kiện mà mục tiêu vẫn phải đạt', 'Chọn màu layout', 'Tính học phí'], correctIndex: 1, explanation: 'Corner khai điều kiện process/voltage/temperature mà thiết kế phải đạt spec, không chỉ ở điều kiện danh định.' },
]);

const g2 = doc('cdp301-2-1-architecture', '2 — Architecture research & selection|||2 — Nghiên cứu & lựa chọn kiến trúc',
  'Khảo sát các topology khả dĩ; bảng đánh đổi (trade-off) theo spec; chọn kiến trúc và biện luận; sơ đồ khối.',
  [[
    `<span class="eyebrow">CDP301 · Phase 2</span>
<h2>Architecture research &amp; selection</h2>
<p>Before drawing a single transistor, survey the <strong>known topologies</strong> that could meet your spec, then choose one with a written justification. In a project, the <em>reasoning</em> is graded as heavily as the choice — reviewers want to see you understood the trade-offs.</p>
<h3>Trade-off table (op-amp example)</h3>
<pre><code>Topology            Gain    Speed   Swing   Notes
Telescopic cascode  high    fast    low     limited output swing
Folded cascode      high    fast    mid     more headroom, more power
Two-stage Miller    high    medium  high    easy, needs compensation
Gain-boosted        v.high  medium  low     complex, extra amps</code></pre>
<h3>Selection method</h3>
<ol>
<li>List candidate topologies from the literature (Razavi, papers).</li>
<li>Score each against the spec's hard constraints first (e.g. output swing on a 1.8V supply).</li>
<li>Pick the simplest one that can meet <em>all</em> targets, and say why the others were rejected.</li>
<li>Draw a <strong>block diagram</strong> and name each block's job.</li>
</ol>
<div class="callout"><span class="badge">Heuristic</span> Prefer the <strong>simplest topology that meets spec</strong>. Complexity you add "to be safe" costs area, power and layout time — and more nodes to debug.</div>`,
    `<span class="eyebrow">CDP301 · Giai đoạn 2</span>
<h2>Nghiên cứu &amp; lựa chọn kiến trúc</h2>
<p>Trước khi vẽ một transistor nào, hãy khảo sát các <strong>topology đã biết</strong> có thể đạt spec, rồi chọn một cái kèm biện luận viết ra. Trong đồ án, <em>lập luận</em> được chấm nặng ngang với lựa chọn — hội đồng muốn thấy bạn hiểu các đánh đổi.</p>
<h3>Bảng đánh đổi (ví dụ op-amp)</h3>
<pre><code>Topology            Độ lợi  Tốc độ  Swing   Ghi chú
Telescopic cascode  cao     nhanh   thấp    swing ra hạn chế
Folded cascode      cao     nhanh   vừa     nhiều headroom, tốn điện hơn
Two-stage Miller    cao     vừa     cao     dễ, cần bù (compensation)
Gain-boosted        rất cao vừa     thấp    phức tạp, thêm mạch phụ</code></pre>
<h3>Phương pháp chọn</h3>
<ol>
<li>Liệt kê các topology ứng viên từ tài liệu (Razavi, bài báo).</li>
<li>Chấm từng cái với ràng buộc CỨNG trước (vd swing ra trên nguồn 1.8V).</li>
<li>Chọn cái đơn giản nhất đạt được <em>tất cả</em> mục tiêu, và nói vì sao loại các cái khác.</li>
<li>Vẽ <strong>sơ đồ khối</strong> và nêu nhiệm vụ của từng khối.</li>
</ol>
<div class="callout"><span class="badge">Kinh nghiệm</span> Ưu tiên <strong>topology đơn giản nhất đạt spec</strong>. Độ phức tạp thêm "cho chắc" tốn diện tích, công suất và thời gian layout — thêm nút để debug.</div>`,
  ]]);

const g2q = quiz('cdp301-quiz-2', 'Quiz 2 — Kiến trúc', [
  { id: 'q1', question: 'Khi có nhiều topology cùng đạt spec, nên ưu tiên chọn?', options: ['Cái phức tạp nhất cho chắc', 'Cái đơn giản nhất vẫn đạt tất cả mục tiêu', 'Cái nhiều transistor nhất', 'Cái mới ra gần đây nhất'], correctIndex: 1, explanation: 'Đơn giản nhất mà đạt spec: ít diện tích/công suất, ít nút để debug và layout nhanh hơn.' },
  { id: 'q2', question: 'Trong đồ án, ngoài lựa chọn kiến trúc thì phần nào cũng được chấm nặng?', options: ['Màu sơ đồ khối', 'Biện luận/lập luận vì sao chọn và vì sao loại các phương án khác', 'Số trang báo cáo', 'Tên file'], correctIndex: 1, explanation: 'Hội đồng muốn thấy bạn hiểu trade-off; lập luận được chấm ngang với chính lựa chọn.' },
  { id: 'q3', question: 'Khi so sánh topology trên nguồn 1.8V, tiêu chí nào nên xét TRƯỚC?', options: ['Ràng buộc cứng như output swing/headroom', 'Màu vẽ', 'Tên tác giả bài báo', 'Năm xuất bản'], correctIndex: 0, explanation: 'Ràng buộc cứng (vd swing ra trên nguồn thấp) loại ngay các topology bất khả thi trước khi so các tiêu chí mềm.' },
]);

const g3 = doc('cdp301-3-1-schematic', '3 — Schematic design & sizing|||3 — Thiết kế sơ đồ nguyên lý & định kích thước',
  'Vẽ sơ đồ nguyên lý; định kích thước W/L transistor từ dòng phân cực & gm; bias, mirror, bảng linh kiện; hand-calc trước khi mô phỏng.',
  [[
    `<span class="eyebrow">CDP301 · Phase 3</span>
<h2>Schematic design &amp; sizing</h2>
<p>Turn the block diagram into a real <strong>schematic</strong>: place transistors, set the <strong>bias</strong>, and <strong>size every device</strong> (choose W and L). Do a hand-calculation first — first-pass numbers guide the simulator instead of blind trial-and-error.</p>
<h3>Sizing from the spec</h3>
<pre><code>From a target transconductance gm and bias current ID:
  gm  = sqrt( 2 * un * Cox * (W/L) * ID )     (saturation)
  =&gt; pick ID from the power budget
  =&gt; solve W/L for the gm the gain/BW spec needs
  Gain (single stage)  Av = gm * rout
  Dominant pole        f = 1 / (2*pi*Rout*Cload)</code></pre>
<h3>Good schematic hygiene</h3>
<ul>
<li>Use <strong>current mirrors</strong> for repeatable bias; label every net.</li>
<li>Keep a <strong>device table</strong> (name, W/L, multiplier, ID) — it becomes your sizing record.</li>
<li>Match devices that must match (differential pair, mirror) — same L, integer multiples of a unit W.</li>
</ul>
<div class="callout"><span class="badge">Why hand-calc first</span> A rough analytic estimate tells you the <em>right ballpark</em>. If the simulator disagrees wildly, one of them is wrong — and catching that early saves days.</div>`,
    `<span class="eyebrow">CDP301 · Giai đoạn 3</span>
<h2>Thiết kế sơ đồ nguyên lý &amp; định kích thước</h2>
<p>Biến sơ đồ khối thành một <strong>sơ đồ nguyên lý</strong> thật: đặt transistor, thiết lập <strong>phân cực (bias)</strong>, và <strong>định kích thước từng linh kiện</strong> (chọn W và L). Hãy tính tay trước — con số lượt đầu dẫn đường cho trình mô phỏng thay vì dò mò.</p>
<h3>Định kích thước từ spec</h3>
<pre><code>Từ độ hỗ dẫn gm mục tiêu và dòng phân cực ID:
  gm  = sqrt( 2 * un * Cox * (W/L) * ID )     (bão hoà)
  =&gt; chọn ID từ ngân sách công suất
  =&gt; giải W/L cho gm mà spec độ lợi/BW cần
  Độ lợi (một tầng)   Av = gm * rout
  Cực trội (dominant) f = 1 / (2*pi*Rout*Cload)</code></pre>
<h3>Vệ sinh sơ đồ tốt</h3>
<ul>
<li>Dùng <strong>gương dòng (current mirror)</strong> để bias lặp lại được; đặt tên mọi net.</li>
<li>Giữ một <strong>bảng linh kiện</strong> (tên, W/L, số nhân, ID) — đó là hồ sơ định kích thước.</li>
<li>Khớp (match) các linh kiện phải khớp (cặp vi sai, gương) — cùng L, W là bội nguyên của một đơn vị.</li>
</ul>
<div class="callout"><span class="badge">Vì sao tính tay trước</span> Ước lượng giải tích thô cho biết <em>đúng bậc độ lớn</em>. Nếu trình mô phỏng lệch xa, một trong hai đang sai — bắt sớm tiết kiệm cả ngày.</div>`,
  ]]);

const g3q = quiz('cdp301-quiz-3', 'Quiz 3 — Sơ đồ nguyên lý', [
  { id: 'q1', question: '"Định kích thước" (sizing) một transistor MOS nghĩa là chọn?', options: ['Màu ký hiệu', 'Chiều rộng W và chiều dài L (W/L)', 'Tên net', 'Nhà sản xuất'], correctIndex: 1, explanation: 'Sizing = chọn W/L (và số nhân) để đạt gm/dòng mong muốn theo spec.' },
  { id: 'q2', question: 'Vì sao nên tính tay (hand-calc) TRƯỚC khi mô phỏng?', options: ['Để không cần mô phỏng', 'Để có con số lượt đầu đúng bậc dẫn đường, và phát hiện khi mô phỏng lệch xa', 'Vì mô phỏng bị cấm', 'Để vẽ đẹp hơn'], correctIndex: 1, explanation: 'Ước lượng giải tích cho đúng ballpark; nếu SPICE lệch xa thì biết ngay có lỗi để bắt sớm.' },
  { id: 'q3', question: 'Cặp vi sai (differential pair) cần được thiết kế thế nào để khớp tốt?', options: ['Khác L, W ngẫu nhiên', 'Cùng L và W là bội nguyên của một đơn vị, đặt đối xứng', 'Càng nhỏ càng tốt bất kể tỉ lệ', 'Không cần quan tâm'], correctIndex: 1, explanation: 'Matching tốt cần cùng chiều dài L, W bội nguyên đơn vị và bố trí đối xứng để giảm offset.' },
]);

const g4 = doc('cdp301-4-1-simulation', '4 — Simulation & verification|||4 — Mô phỏng & kiểm chứng',
  'Thiết lập testbench SPICE (op/dc/ac/tran); đo từng spec; quét corner (PVT) & Monte Carlo; bảng spec đối chiếu số đo.',
  [[
    `<span class="eyebrow">CDP301 · Phase 4</span>
<h2>Simulation &amp; verification</h2>
<p>Prove the schematic meets spec with a <strong>SPICE simulator</strong> (ngspice, Spectre, HSPICE). Build a <strong>testbench</strong> per measurement, then verify at the nominal corner first and across all PVT corners after.</p>
<h3>Analyses you will run</h3>
<pre><code>.op    operating point   -&gt; check every device is in saturation
.dc    DC sweep          -&gt; transfer curve, input range
.ac    AC analysis       -&gt; gain, bandwidth, phase margin
.tran  transient         -&gt; slew rate, settling, step response
.noise noise analysis    -&gt; input-referred noise
corners SS / TT / FF, temp, VDD +/-10%
Monte Carlo -&gt; mismatch &amp; process spread (offset, yield)</code></pre>
<h3>Verification table</h3>
<pre><code>Parameter     Spec        TT      SS      FF      Pass?
DC gain       &gt;=70 dB     74.2    71.0    72.8    yes
UGBW          &gt;=50 MHz    58      51      66      yes
Phase margin  &gt;=60 deg    64      61      67      yes
Power         &lt;=1.0 mW    0.82    0.79    0.88    yes</code></pre>
<div class="callout"><span class="badge">Sign-off</span> A spec is met only when it passes at <strong>every corner</strong>, not just the typical one. A block that is great at TT and fails at SS is a fail.</div>`,
    `<span class="eyebrow">CDP301 · Giai đoạn 4</span>
<h2>Mô phỏng &amp; kiểm chứng</h2>
<p>Chứng minh sơ đồ đạt spec bằng <strong>trình mô phỏng SPICE</strong> (ngspice, Spectre, HSPICE). Dựng một <strong>testbench</strong> cho mỗi phép đo, kiểm ở corner danh định trước rồi quét toàn bộ corner PVT sau.</p>
<h3>Các phân tích sẽ chạy</h3>
<pre><code>.op    điểm làm việc     -&gt; kiểm mọi linh kiện đang bão hoà
.dc    quét DC           -&gt; đường truyền đạt, dải vào
.ac    phân tích AC      -&gt; độ lợi, băng thông, biên pha
.tran  quá độ            -&gt; slew rate, ổn định, đáp ứng bước
.noise phân tích nhiễu   -&gt; nhiễu quy về đầu vào
corner SS / TT / FF, nhiệt độ, VDD +/-10%
Monte Carlo -&gt; mismatch &amp; tản mát process (offset, yield)</code></pre>
<h3>Bảng kiểm chứng</h3>
<pre><code>Tham số       Spec        TT      SS      FF      Đạt?
Độ lợi DC     &gt;=70 dB     74.2    71.0    72.8    có
UGBW          &gt;=50 MHz    58      51      66      có
Biên pha      &gt;=60 do     64      61      67      có
Công suất     &lt;=1.0 mW    0.82    0.79    0.88    có</code></pre>
<div class="callout"><span class="badge">Chốt (sign-off)</span> Một spec chỉ coi là đạt khi qua ở <strong>mọi corner</strong>, không chỉ corner điển hình. Khối tốt ở TT nhưng trượt ở SS là TRƯỢT.</div>`,
  ]]);

const g4q = quiz('cdp301-quiz-4', 'Quiz 4 — Mô phỏng', [
  { id: 'q1', question: 'Phân tích .ac trong SPICE thường dùng để đo?', options: ['Slew rate', 'Độ lợi, băng thông, biên pha', 'Nhiệt độ chip', 'Diện tích layout'], correctIndex: 1, explanation: '.ac cho đáp ứng tần số: độ lợi, băng thông và biên pha; slew rate đo bằng .tran.' },
  { id: 'q2', question: 'Một khối đạt spec ở corner TT nhưng trượt ở corner SS thì kết luận?', options: ['Đạt, vì TT là chính', 'Trượt — spec phải đạt ở MỌI corner mới sign-off', 'Đạt một nửa', 'Bỏ qua SS'], correctIndex: 1, explanation: 'Sign-off yêu cầu đạt ở mọi corner PVT; trượt ở SS là trượt.' },
  { id: 'q3', question: 'Phân tích Monte Carlo dùng để đánh giá điều gì?', options: ['Màu đồ thị', 'Ảnh hưởng của mismatch & tản mát process (vd offset, yield)', 'Tên testbench', 'Giá điện'], correctIndex: 1, explanation: 'Monte Carlo mô phỏng biến thiên linh kiện (mismatch/process) để ước tính offset, độ tản và yield.' },
]);

const g5 = doc('cdp301-5-1-layout', '5 — Layout & DRC/LVS|||5 — Thiết kế layout & DRC/LVS',
  'Chuyển sơ đồ thành layout vật lý; kỹ thuật matching (common-centroid, dummy, guard ring); chạy DRC & LVS tới khi sạch.',
  [[
    `<span class="eyebrow">CDP301 · Phase 5</span>
<h2>Layout &amp; physical verification</h2>
<p>Draw the <strong>physical layout</strong> — the actual geometry of transistors, wires and contacts on silicon layers — from the verified schematic, then run the two mandatory checks: <strong>DRC</strong> and <strong>LVS</strong>.</p>
<h3>The two gate-keepers</h3>
<ul>
<li><strong>DRC (Design Rule Check)</strong> — does the geometry obey the foundry's manufacturing rules (min width, spacing, enclosure)? A DRC-clean layout is one the fab can actually build.</li>
<li><strong>LVS (Layout Versus Schematic)</strong> — does the layout's extracted netlist match the schematic device-for-device and net-for-net? LVS-clean means "you laid out the circuit you designed, not a different one".</li>
</ul>
<h3>Matching &amp; robustness techniques</h3>
<pre><code>Common-centroid  -&gt; cancel gradients in matched pairs (A B B A)
Dummy devices    -&gt; equal edge environment for edge devices
Guard rings      -&gt; collect substrate noise, latch-up protection
Wide/many contacts, symmetry, short sensitive routes</code></pre>
<div class="callout"><span class="badge">Order</span> DRC first (is it manufacturable?), then LVS (is it the right circuit?). Only a layout that is <strong>both clean</strong> proceeds to post-layout analysis.</div>`,
    `<span class="eyebrow">CDP301 · Giai đoạn 5</span>
<h2>Thiết kế layout &amp; kiểm chứng vật lý</h2>
<p>Vẽ <strong>layout vật lý</strong> — hình học thật của transistor, dây và contact trên các lớp silicon — từ sơ đồ đã kiểm chứng, rồi chạy hai kiểm bắt buộc: <strong>DRC</strong> và <strong>LVS</strong>.</p>
<h3>Hai người gác cổng</h3>
<ul>
<li><strong>DRC (Design Rule Check)</strong> — hình học có tuân luật chế tạo của foundry không (bề rộng min, khoảng cách, bao phủ)? Layout sạch DRC là layout nhà máy chế tạo được.</li>
<li><strong>LVS (Layout Versus Schematic)</strong> — netlist rút từ layout có khớp sơ đồ theo từng linh kiện và từng net không? Sạch LVS nghĩa là "bạn đã vẽ đúng mạch đã thiết kế, không phải mạch khác".</li>
</ul>
<h3>Kỹ thuật matching &amp; bền vững</h3>
<pre><code>Common-centroid  -&gt; triệt gradient ở cặp khớp (A B B A)
Linh kiện dummy  -&gt; đều môi trường biên cho linh kiện rìa
Guard ring       -&gt; gom nhiễu đế, chống latch-up
Contact to/nhiều, đối xứng, đường nhạy cảm ngắn</code></pre>
<div class="callout"><span class="badge">Thứ tự</span> DRC trước (chế tạo được không?), rồi LVS (có đúng mạch không?). Chỉ layout <strong>sạch cả hai</strong> mới đi tiếp sang phân tích sau layout.</div>`,
  ]]);

const g5q = quiz('cdp301-quiz-5', 'Quiz 5 — Layout & DRC/LVS', [
  { id: 'q1', question: 'DRC (Design Rule Check) kiểm tra điều gì?', options: ['Layout có khớp sơ đồ không', 'Hình học có tuân luật chế tạo của foundry không (min width, spacing...)', 'Độ lợi mạch', 'Giá thành chip'], correctIndex: 1, explanation: 'DRC kiểm hình học có tuân luật chế tạo (bề rộng min, khoảng cách, bao phủ) → có làm ra được không.' },
  { id: 'q2', question: 'LVS (Layout Versus Schematic) đảm bảo điều gì?', options: ['Netlist rút từ layout khớp sơ đồ theo từng linh kiện & net', 'Chip chạy nhanh', 'Nhiễu thấp', 'Diện tích nhỏ nhất'], correctIndex: 0, explanation: 'LVS so netlist trích từ layout với sơ đồ → xác nhận đã vẽ ĐÚNG mạch đã thiết kế.' },
  { id: 'q3', question: 'Kỹ thuật common-centroid (A B B A) dùng để?', options: ['Tiết kiệm điện', 'Triệt gradient process/nhiệt để cặp linh kiện khớp tốt hơn', 'Tăng tốc mô phỏng', 'Đổi màu lớp'], correctIndex: 1, explanation: 'Common-centroid bố trí đối xứng để triệt gradient (process/nhiệt), giảm mismatch giữa cặp linh kiện.' },
]);

const g6 = doc('cdp301-6-1-performance', '6 — Performance analysis (timing, power, noise)|||6 — Phân tích hiệu năng (timing, công suất, nhiễu)',
  'Trích parasitic (RC) sau layout & mô phỏng lại; phân tích timing (setup/hold), công suất (động/tĩnh), nhiễu; đối chiếu pre vs post-layout.',
  [[
    `<span class="eyebrow">CDP301 · Phase 6</span>
<h2>Performance analysis</h2>
<p>The schematic is an ideal circuit; the layout adds real <strong>parasitics</strong> (wire resistance and capacitance). After layout you <strong>extract</strong> those parasitics and <strong>re-simulate</strong> — post-layout numbers are the ones that count.</p>
<h3>Three things you analyze</h3>
<ul>
<li><strong>Timing</strong> — in digital blocks, does every path meet <strong>setup</strong> and <strong>hold</strong>? In analog, does settling/bandwidth still meet spec with parasitic load?</li>
<li><strong>Power</strong> — split <strong>dynamic</strong> (switching, ~ C·V²·f) from <strong>static</strong> (leakage/bias). Compare against the budget.</li>
<li><strong>Noise</strong> — input-referred noise, PSRR, substrate/supply coupling; noise sets the smallest signal you can resolve.</li>
</ul>
<pre><code>Pre- vs post-layout (op-amp):
  Metric        Pre-layout   Post-layout   Spec
  UGBW          58 MHz       52 MHz        &gt;=50 MHz  ok
  Phase margin  64 deg       59 deg        &gt;=60 deg  FAIL -&gt; fix
  Power         0.82 mW      0.85 mW       &lt;=1.0 mW  ok</code></pre>
<div class="callout"><span class="badge">Reality check</span> Parasitics almost always <strong>degrade</strong> speed and margins. If post-layout looks identical to schematic, suspect the extraction was not actually included.</div>`,
    `<span class="eyebrow">CDP301 · Giai đoạn 6</span>
<h2>Phân tích hiệu năng</h2>
<p>Sơ đồ là mạch lý tưởng; layout thêm <strong>parasitic</strong> thật (điện trở và điện dung của dây). Sau layout bạn <strong>trích (extract)</strong> các parasitic đó và <strong>mô phỏng lại</strong> — số sau layout mới là số tính.</p>
<h3>Ba thứ phải phân tích</h3>
<ul>
<li><strong>Timing</strong> — với khối số, mọi đường có đạt <strong>setup</strong> và <strong>hold</strong> không? Với analog, settling/băng thông còn đạt spec khi có tải parasitic không?</li>
<li><strong>Công suất</strong> — tách <strong>động</strong> (chuyển mạch, ~ C·V²·f) khỏi <strong>tĩnh</strong> (rò/bias). So với ngân sách.</li>
<li><strong>Nhiễu</strong> — nhiễu quy về đầu vào, PSRR, ghép đế/nguồn; nhiễu quyết định tín hiệu nhỏ nhất phân giải được.</li>
</ul>
<pre><code>Trước vs sau layout (op-amp):
  Chỉ số        Trước layout Sau layout    Spec
  UGBW          58 MHz       52 MHz        &gt;=50 MHz  ok
  Biên pha      64 do        59 do         &gt;=60 do   TRƯỢT -&gt; sửa
  Công suất     0.82 mW      0.85 mW       &lt;=1.0 mW  ok</code></pre>
<div class="callout"><span class="badge">Kiểm thực tế</span> Parasitic gần như luôn <strong>làm xấu</strong> tốc độ và biên. Nếu sau layout giống hệt sơ đồ, nghi ngờ phần trích parasitic chưa thật sự được đưa vào.</div>`,
  ]]);

const g6q = quiz('cdp301-quiz-6', 'Quiz 6 — Hiệu năng', [
  { id: 'q1', question: 'Vì sao phải mô phỏng LẠI sau khi trích parasitic (post-layout)?', options: ['Cho vui', 'Vì layout thêm điện trở/điện dung dây thật, thường làm xấu tốc độ & biên — số sau layout mới là số tính', 'Vì SPICE bắt buộc', 'Để layout đẹp hơn'], correctIndex: 1, explanation: 'Parasitic RC của dây làm giảm băng thông/biên pha; hiệu năng sau layout mới phản ánh silicon thật.' },
  { id: 'q2', question: 'Công suất động (dynamic) của mạch số tỉ lệ gần đúng với?', options: ['C·V²·f (điện dung, bình phương áp, tần số)', 'Chỉ nhiệt độ', 'Diện tích layout', 'Số chân'], correctIndex: 0, explanation: 'Công suất động ~ C·V²·f; công suất tĩnh là rò/bias, tách riêng khi phân tích.' },
  { id: 'q3', question: 'Setup và hold là ràng buộc thuộc loại phân tích nào?', options: ['Nhiễu', 'Timing (định thời) của mạch số', 'Công suất tĩnh', 'DRC'], correctIndex: 1, explanation: 'Setup/hold là ràng buộc timing: dữ liệu phải ổn định đủ trước và sau cạnh clock.' },
]);

const g7 = doc('cdp301-7-1-test-optimize', '7 — Test, optimize & documentation|||7 — Kiểm thử, tối ưu & tài liệu thiết kế',
  'Đóng khoảng hụt spec (ECO nhỏ, đổi bias/W-L/bù); lập kế hoạch kiểm thử; viết tài liệu thiết kế đầy đủ để người khác tái lập.',
  [[
    `<span class="eyebrow">CDP301 · Phase 7</span>
<h2>Test, optimize &amp; document</h2>
<p>Post-layout analysis usually leaves a <strong>gap</strong> or two (phase margin fell below spec). Now you <strong>optimize</strong> — make the smallest change that closes the gap without breaking a passing spec — then <strong>document</strong> everything.</p>
<h3>Closing a gap (example: phase margin 59 -&gt; 60+ deg)</h3>
<ol>
<li>Diagnose the dominant cause (extra load cap moved the pole).</li>
<li>Try the least invasive fix first — increase the Miller compensation cap slightly.</li>
<li>Re-run the affected analyses AND re-check the specs that were passing (no regressions).</li>
<li>Record what you changed and why in the change log.</li>
</ol>
<h3>The design document</h3>
<pre><code>1. Specification table (targets vs final measured)
2. Architecture choice &amp; justification
3. Schematic + device sizing table
4. Simulation results (all corners, plots)
5. Layout + DRC/LVS clean reports
6. Post-layout performance &amp; optimization log
7. Known limitations &amp; future work</code></pre>
<div class="callout"><span class="badge">Documentation = reproducibility</span> A good design doc lets another engineer <strong>rebuild and re-verify</strong> your block without asking you a single question. That is the real deliverable.</div>`,
    `<span class="eyebrow">CDP301 · Giai đoạn 7</span>
<h2>Kiểm thử, tối ưu &amp; viết tài liệu</h2>
<p>Phân tích sau layout thường để lại một hai <strong>khoảng hụt</strong> (biên pha tụt dưới spec). Giờ bạn <strong>tối ưu</strong> — thay đổi nhỏ nhất để đóng khoảng hụt mà không phá spec đang đạt — rồi <strong>viết tài liệu</strong> mọi thứ.</p>
<h3>Đóng khoảng hụt (ví dụ: biên pha 59 -&gt; 60+ độ)</h3>
<ol>
<li>Chẩn đoán nguyên nhân chính (tụ tải thêm làm dời cực).</li>
<li>Thử cách ít xâm lấn nhất trước — tăng nhẹ tụ bù Miller.</li>
<li>Chạy lại các phân tích liên quan VÀ kiểm lại các spec đang đạt (không gây hồi quy).</li>
<li>Ghi lại đã đổi gì và vì sao vào nhật ký thay đổi.</li>
</ol>
<h3>Tài liệu thiết kế</h3>
<pre><code>1. Bảng đặc tả (mục tiêu vs số đo cuối)
2. Lựa chọn kiến trúc &amp; biện luận
3. Sơ đồ + bảng định kích thước linh kiện
4. Kết quả mô phỏng (mọi corner, đồ thị)
5. Layout + báo cáo DRC/LVS sạch
6. Hiệu năng sau layout &amp; nhật ký tối ưu
7. Giới hạn đã biết &amp; hướng phát triển</code></pre>
<div class="callout"><span class="badge">Tài liệu = tái lập được</span> Tài liệu tốt cho một kỹ sư khác <strong>dựng lại và kiểm chứng lại</strong> khối của bạn mà không phải hỏi bạn câu nào. Đó mới là sản phẩm bàn giao thật.</div>`,
  ]]);

const g7q = quiz('cdp301-quiz-7', 'Quiz 7 — Tối ưu & tài liệu', [
  { id: 'q1', question: 'Khi tối ưu đóng một khoảng hụt spec, nguyên tắc nên là?', options: ['Đổi càng nhiều càng tốt', 'Thay đổi nhỏ nhất để đóng khoảng hụt và kiểm lại các spec đang đạt để không gây hồi quy', 'Bỏ luôn spec đó', 'Chỉ sửa màu layout'], correctIndex: 1, explanation: 'Thay đổi tối thiểu + re-check toàn bộ spec đang đạt để tránh vá chỗ này hỏng chỗ kia (regression).' },
  { id: 'q2', question: 'Mục tiêu quan trọng nhất của tài liệu thiết kế là gì?', options: ['Cho dày trang', 'Để kỹ sư khác tái lập & kiểm chứng lại khối mà không cần hỏi bạn', 'Để nộp cho đẹp', 'Để giấu bí quyết'], correctIndex: 1, explanation: 'Tài liệu tốt = tái lập được: người khác dựng và verify lại được — đó là deliverable thật.' },
  { id: 'q3', question: 'Sau khi tăng tụ bù Miller để cứu biên pha, bước bắt buộc kế tiếp?', options: ['Nộp luôn', 'Chạy lại phân tích liên quan VÀ kiểm lại các spec khác xem có bị hồi quy', 'Xoá spec cũ', 'Đổi tên file'], correctIndex: 1, explanation: 'Một thay đổi có thể phá spec khác (vd băng thông); phải re-simulate và xác nhận không regression.' },
]);

const g8 = doc('cdp301-8-1-report-defense', '8 — Report, defense & lessons|||8 — Báo cáo, bảo vệ đồ án & bài học',
  'Cấu trúc báo cáo & slide bảo vệ; kể chuyện bằng bằng chứng; chuẩn bị hỏi-đáp; đúc kết bài học và giới hạn.',
  [[
    `<span class="eyebrow">CDP301 · Phase 8</span>
<h2>Report, defense &amp; lessons</h2>
<p>The final phase turns your work into a <strong>report</strong> and a <strong>defense</strong>. Reviewers grade what they can see and what you can defend — a great design badly presented loses marks it earned in silicon.</p>
<h3>Defense slide arc</h3>
<pre><code>1. Problem &amp; spec        (what, how well, constraints)
2. Architecture &amp; why    (the trade-off table)
3. Schematic &amp; sizing    (key design decisions)
4. Results vs spec       (the verification table)
5. Layout &amp; DRC/LVS      (clean reports)
6. Post-layout &amp; fixes   (honesty about the gaps)
7. Conclusion &amp; lessons  (what you would do next)</code></pre>
<h3>Surviving Q&amp;A</h3>
<ul>
<li>Every claim on a slide should be backed by a plot or number you can bring up.</li>
<li>Know your <strong>weakest spec</strong> and its cause — reviewers probe there first.</li>
<li>"I don't know, but here is how I'd find out" beats bluffing.</li>
</ul>
<div class="callout"><span class="badge">Lessons</span> Close with honest limitations and what you learned about the <em>flow</em> — spec discipline, corner coverage, the pre- vs post-layout gap. That reflection is part of the grade, and the point of a project course.</div>`,
    `<span class="eyebrow">CDP301 · Giai đoạn 8</span>
<h2>Báo cáo, bảo vệ đồ án &amp; bài học</h2>
<p>Giai đoạn cuối biến công sức thành một <strong>báo cáo</strong> và một buổi <strong>bảo vệ</strong>. Hội đồng chấm cái họ thấy và cái bạn bảo vệ được — thiết kế hay mà trình bày dở sẽ mất điểm đã kiếm được trên silicon.</p>
<h3>Mạch slide bảo vệ</h3>
<pre><code>1. Bài toán &amp; spec       (làm gì, tốt tới đâu, ràng buộc)
2. Kiến trúc &amp; vì sao    (bảng đánh đổi)
3. Sơ đồ &amp; kích thước    (quyết định thiết kế then chốt)
4. Kết quả vs spec       (bảng kiểm chứng)
5. Layout &amp; DRC/LVS      (báo cáo sạch)
6. Sau layout &amp; cách vá (thành thật về khoảng hụt)
7. Kết luận &amp; bài học    (sẽ làm gì tiếp)</code></pre>
<h3>Vượt qua hỏi-đáp</h3>
<ul>
<li>Mỗi khẳng định trên slide phải có đồ thị hoặc con số bạn mở ra được.</li>
<li>Biết <strong>spec yếu nhất</strong> và nguyên nhân — hội đồng dò vào đó trước.</li>
<li>"Em chưa biết, nhưng đây là cách em sẽ tìm ra" hơn hẳn nói lấp liếm.</li>
</ul>
<div class="callout"><span class="badge">Bài học</span> Kết bằng giới hạn thành thật và điều học được về <em>quy trình</em> — kỷ luật spec, phủ corner, khoảng cách trước/sau layout. Phần đúc kết đó nằm trong điểm, và là mục đích của một môn đồ án.</div>`,
  ]]);

const g8q = quiz('cdp301-quiz-8', 'Quiz 8 — Báo cáo & bảo vệ', [
  { id: 'q1', question: 'Trong buổi bảo vệ, mỗi khẳng định trên slide nên được?', options: ['Nói to hơn', 'Có đồ thị hoặc con số kèm để chứng minh khi hội đồng hỏi', 'Ghi in đậm', 'Đọc thật nhanh'], correctIndex: 1, explanation: 'Đồ án chấm bằng bằng chứng; mỗi tuyên bố cần một plot/số đo sẵn sàng đưa ra.' },
  { id: 'q2', question: 'Khi bị hỏi về một spec bạn CHƯA biết câu trả lời, cách xử lý tốt nhất?', options: ['Bịa một con số', 'Nói "chưa biết, nhưng đây là cách em sẽ tìm ra"', 'Im lặng bỏ qua', 'Đổi chủ đề'], correctIndex: 1, explanation: 'Thành thật kèm phương pháp tìm ra tốt hơn nói lấp liếm — hội đồng đánh giá cao tư duy giải quyết.' },
  { id: 'q3', question: 'Vì sao phần "bài học & giới hạn" lại nằm trong điểm của môn đồ án?', options: ['Để cho đủ slide', 'Vì mục đích môn đồ án là học QUY TRÌNH; đúc kết phản ánh mức hiểu về flow', 'Vì bắt buộc theo luật', 'Không có lý do'], correctIndex: 1, explanation: 'Môn đồ án dạy quy trình thiết kế; phản tư về spec/corner/pre-vs-post-layout thể hiện năng lực thật.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'CDP301',
    slug: 'cdp301-circuit-design-project',
    title: 'Circuit Design Project',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CDP301.webp',
    shortDescription: 'A hands-on IC design project — run the full flow: spec, architecture, schematic, SPICE simulation, layout + DRC/LVS, timing/power/noise analysis, test & optimize, report & defend. Bilingual, with rubric & quizzes.|||Đồ án thiết kế vi mạch thực hành — chạy trọn quy trình: đặc tả, kiến trúc, sơ đồ nguyên lý, mô phỏng SPICE, layout + DRC/LVS, phân tích timing/công suất/nhiễu, kiểm thử & tối ưu, báo cáo & bảo vệ. Song ngữ, có rubric & quiz.',
    description: 'Môn <strong>CDP301 — Circuit Design Project</strong> (Đồ án Thiết kế mạch, kỳ 4, ngành Thiết kế vi mạch bán dẫn) là môn <strong>đồ án</strong> — không phải 8 chương lý thuyết. Bạn chạy <strong>một thiết kế mạch tích hợp thật</strong> qua <strong>8 giai đoạn quy trình</strong>: <strong>đặc tả</strong> → <strong>chọn kiến trúc</strong> → <strong>sơ đồ nguyên lý &amp; định kích thước</strong> → <strong>mô phỏng SPICE (mọi corner)</strong> → <strong>layout &amp; DRC/LVS</strong> → <strong>phân tích timing/công suất/nhiễu</strong> → <strong>kiểm thử, tối ưu &amp; tài liệu</strong> → <strong>báo cáo &amp; bảo vệ</strong>. Song ngữ, bám Razavi, Weste &amp; Harris, tài liệu Cadence/Synopsys và giáo trình FLM; mỗi giai đoạn có quiz.',
    whatYouLearn: 'Viết bản đặc tả đo được (mục tiêu/đơn vị/điều kiện/corner); khảo sát & chọn topology kèm biện luận trade-off; vẽ sơ đồ, định kích thước W/L từ gm & dòng; dựng testbench SPICE (op/dc/ac/tran/noise), quét corner & Monte Carlo; vẽ layout, matching (common-centroid, dummy, guard ring), chạy DRC/LVS; trích parasitic & phân tích timing/công suất/nhiễu sau layout; tối ưu đóng khoảng hụt; viết tài liệu thiết kế tái lập được; báo cáo & bảo vệ đồ án bằng bằng chứng.',
    requirements: 'Nền linh kiện & mạch điện tử (vd ECI101) và mạch số/CMOS cơ bản. Nên dùng công cụ EDA (Cadence Virtuoso/Spectre, ngspice, Magic/KLayout). Xem điều kiện tiên quyết trong khung ngành Thiết kế vi mạch bán dẫn trên FLM.',
  },
  sections: [
    { title: '📚 Tài liệu & tham khảo|||📚 Project materials', description: 'Đề bài/mẫu/rubric trên FLM, sách (Razavi, Weste/Harris), tài liệu EDA, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn đồ án|||Project introduction', description: 'Môn đồ án, deliverable, rubric, 8 giai đoạn.', lessons: [intro] },
    { title: 'Giai đoạn 1 — Đặc tả|||Phase 1 — Specification', description: 'Bảng chỉ tiêu đo được, ràng buộc, corner, nghiệm thu.', lessons: [g1, g1q] },
    { title: 'Giai đoạn 2 — Kiến trúc|||Phase 2 — Architecture', description: 'Khảo sát topology, bảng trade-off, chọn & biện luận.', lessons: [g2, g2q] },
    { title: 'Giai đoạn 3 — Sơ đồ nguyên lý|||Phase 3 — Schematic', description: 'Vẽ mạch, định kích thước W/L, bias, hand-calc.', lessons: [g3, g3q] },
    { title: 'Giai đoạn 4 — Mô phỏng|||Phase 4 — Simulation', description: 'Testbench SPICE, đo spec, quét corner & Monte Carlo.', lessons: [g4, g4q] },
    { title: 'Giai đoạn 5 — Layout & DRC/LVS|||Phase 5 — Layout & DRC/LVS', description: 'Layout vật lý, matching, chạy DRC & LVS sạch.', lessons: [g5, g5q] },
    { title: 'Giai đoạn 6 — Hiệu năng|||Phase 6 — Performance', description: 'Trích parasitic, timing/công suất/nhiễu, pre vs post-layout.', lessons: [g6, g6q] },
    { title: 'Giai đoạn 7 — Tối ưu & tài liệu|||Phase 7 — Optimize & doc', description: 'Đóng khoảng hụt, kiểm thử, tài liệu thiết kế.', lessons: [g7, g7q] },
    { title: 'Giai đoạn 8 — Báo cáo & bảo vệ|||Phase 8 — Report & defense', description: 'Cấu trúc báo cáo/slide, hỏi-đáp, bài học.', lessons: [g8, g8q] },
  ],
};
