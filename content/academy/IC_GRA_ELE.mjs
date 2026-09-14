/**
 * IC_GRA_ELE — Graduation Elective for Integrated Circuit Design.
 * Học phần TỰ CHỌN tốt nghiệp, ngành Thiết kế vi mạch bán dẫn (FPTU, Kỳ 9).
 * KHÔNG có nội dung cố định: khung hướng dẫn sinh viên CHỌN & tự học một chủ đề
 * nâng cao của ngành + mini-project. Song ngữ VI+EN, mỗi chương 1 DOCUMENT + 1 QUIZ.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${ lồng; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('ic-gra-ele-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: quy định FPTU, sách chuẩn ngành (Razavi, Weste/Harris), tài liệu IEEE/EDA, khoá học VLSI (Coursera/edX), công cụ mô phỏng, lộ trình tự học.',
  [[
    `<span class="eyebrow">IC_GRA_ELE · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">This is a <strong>graduation elective</strong> — there is no fixed syllabus. You choose one advanced integrated-circuit (IC) topic, study it deeply, and deliver a mini-project. Below are the reference books, official docs and free courses to build that study from. The FPTU rules &amp; the syllabus outline live on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a>.</p>
<h3>📗 Reference books (choose per topic)</h3>
<ul>
<li><a href="https://www.wiley.com/en-us/Design+of+Analog+CMOS+Integrated+Circuits-p-9780072524932" target="_blank" rel="noopener">B. Razavi — <em>Design of Analog CMOS Integrated Circuits</em></a> (analog/RF IC)</li>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/cmos-vlsi-design-a-circuits-and-systems-perspective/P200000003404" target="_blank" rel="noopener">Weste &amp; Harris — <em>CMOS VLSI Design</em></a> (digital VLSI, physical design)</li>
<li><a href="https://link.springer.com/book/10.1007/978-1-4419-0292-4" target="_blank" rel="noopener">Kang &amp; Leblebici — <em>CMOS Digital Integrated Circuits</em></a></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://ieeexplore.ieee.org/" target="_blank" rel="noopener">IEEE Xplore</a> — papers &amp; standards (use your school library access)</li>
<li><a href="https://www.synopsys.com/glossary.html" target="_blank" rel="noopener">Synopsys glossary</a> &amp; <a href="https://www.cadence.com/en_US/home/tools.html" target="_blank" rel="noopener">Cadence tools overview</a> — commercial EDA docs</li>
<li><a href="https://open-source-silicon.dev/" target="_blank" rel="noopener">Open-source silicon (OpenROAD, OpenLane, Sky130 PDK)</a> — free full RTL-to-GDSII flow</li>
</ul>
<h3>🎓 Free courses (VLSI / IC design)</h3>
<ul>
<li><a href="https://www.coursera.org/" target="_blank" rel="noopener">Coursera</a> — VLSI CAD, analog IC design specializations</li>
<li><a href="https://www.edx.org/" target="_blank" rel="noopener">edX</a> — MOS transistors, digital integrated circuits (MIT/others)</li>
<li><a href="https://nptel.ac.in/" target="_blank" rel="noopener">NPTEL</a> — full VLSI &amp; analog IC lecture series (free)</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.eda-playground.com/" target="_blank" rel="noopener">EDA Playground</a> — write &amp; simulate Verilog/SystemVerilog in the browser</li>
<li><a href="https://ngspice.sourceforge.io/" target="_blank" rel="noopener">ngspice</a> / <a href="http://opencircuitdesign.com/xschem/" target="_blank" rel="noopener">Xschem</a> — free analog SPICE simulation</li>
<li><a href="https://openlane.readthedocs.io/" target="_blank" rel="noopener">OpenLane + Sky130</a> — free digital place-and-route flow</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Choose</strong> — pick ONE advanced topic aligned with your career goal (Chapters 1–2).</li>
<li><strong>Plan</strong> — learn the EDA flow, write a learning contract with milestones (Chapters 3–4).</li>
<li><strong>Study &amp; build</strong> — research deeply, then design/simulate one circuit block (Chapters 5–6).</li>
<li><strong>Deliver</strong> — write the report, present &amp; defend, plan certs/career (Chapters 7–8).</li>
</ol></div>`,
    `<span class="eyebrow">IC_GRA_ELE · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Đây là <strong>học phần tự chọn tốt nghiệp</strong> — KHÔNG có giáo trình cố định. Bạn chọn một chủ đề vi mạch (IC) nâng cao, học sâu, rồi nộp một mini-project. Bên dưới là sách chuẩn, tài liệu chính thức và khoá học miễn phí để dựng việc học đó. Quy định FPTU &amp; khung chuẩn đầu ra nằm trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a>.</p>
<h3>📗 Sách tham khảo (chọn theo chủ đề)</h3>
<ul>
<li><a href="https://www.wiley.com/en-us/Design+of+Analog+CMOS+Integrated+Circuits-p-9780072524932" target="_blank" rel="noopener">B. Razavi — <em>Design of Analog CMOS Integrated Circuits</em></a> (analog/RF IC)</li>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/cmos-vlsi-design-a-circuits-and-systems-perspective/P200000003404" target="_blank" rel="noopener">Weste &amp; Harris — <em>CMOS VLSI Design</em></a> (VLSI số, physical design)</li>
<li><a href="https://link.springer.com/book/10.1007/978-1-4419-0292-4" target="_blank" rel="noopener">Kang &amp; Leblebici — <em>CMOS Digital Integrated Circuits</em></a></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://ieeexplore.ieee.org/" target="_blank" rel="noopener">IEEE Xplore</a> — bài báo &amp; chuẩn (dùng quyền truy cập thư viện trường)</li>
<li><a href="https://www.synopsys.com/glossary.html" target="_blank" rel="noopener">Từ điển Synopsys</a> &amp; <a href="https://www.cadence.com/en_US/home/tools.html" target="_blank" rel="noopener">Tổng quan công cụ Cadence</a> — tài liệu EDA thương mại</li>
<li><a href="https://open-source-silicon.dev/" target="_blank" rel="noopener">Silicon mã nguồn mở (OpenROAD, OpenLane, PDK Sky130)</a> — luồng RTL-to-GDSII đầy đủ, miễn phí</li>
</ul>
<h3>🎓 Khoá học miễn phí (VLSI / thiết kế IC)</h3>
<ul>
<li><a href="https://www.coursera.org/" target="_blank" rel="noopener">Coursera</a> — VLSI CAD, chuyên đề thiết kế analog IC</li>
<li><a href="https://www.edx.org/" target="_blank" rel="noopener">edX</a> — transistor MOS, mạch tích hợp số (MIT và các trường)</li>
<li><a href="https://nptel.ac.in/" target="_blank" rel="noopener">NPTEL</a> — chuỗi bài giảng VLSI &amp; analog IC đầy đủ (miễn phí)</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.eda-playground.com/" target="_blank" rel="noopener">EDA Playground</a> — viết &amp; mô phỏng Verilog/SystemVerilog trên trình duyệt</li>
<li><a href="https://ngspice.sourceforge.io/" target="_blank" rel="noopener">ngspice</a> / <a href="http://opencircuitdesign.com/xschem/" target="_blank" rel="noopener">Xschem</a> — mô phỏng SPICE analog miễn phí</li>
<li><a href="https://openlane.readthedocs.io/" target="_blank" rel="noopener">OpenLane + Sky130</a> — luồng place-and-route số miễn phí</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Chọn</strong> — chọn MỘT chủ đề nâng cao khớp định hướng nghề (Chương 1–2).</li>
<li><strong>Lập kế hoạch</strong> — nắm luồng EDA, viết learning contract có mốc (Chương 3–4).</li>
<li><strong>Học &amp; làm</strong> — nghiên cứu sâu, rồi thiết kế/mô phỏng một khối mạch (Chương 5–6).</li>
<li><strong>Nộp</strong> — viết báo cáo, trình bày &amp; phản biện, định hướng chứng chỉ/nghề (Chương 7–8).</li>
</ol></div>`,
  ]]);

const intro = doc('ic-gra-ele-0-1-overview', 'Course introduction: a graduation elective|||Giới thiệu môn: một học phần tự chọn tốt nghiệp',
  'Học phần tự chọn tốt nghiệp là gì; cách chọn chủ đề; deliverable (learning contract + báo cáo + mini-project + bảo vệ); rubric chấm điểm.',
  [[
    `<span class="eyebrow">IC_GRA_ELE · Introduction</span>
<h2>What a graduation elective is</h2>
<p class="lead">Unlike a normal course, a <strong>graduation elective</strong> has <em>no fixed content</em>. You, the student, choose one advanced topic in IC design, negotiate a plan with a supervisor, learn it largely on your own, and prove it with a deliverable. This guide is the <strong>scaffold</strong> — how to choose, plan, study, build and present — not the topic itself.</p>
<h3>What you must deliver</h3>
<pre><code>Deliverables (typical):
  1. Learning contract  -> topic, goals, milestones, resources (Ch.4)
  2. Literature / study  -> a written deep-dive of the chosen topic (Ch.5)
  3. Mini-project       -> a designed &amp; simulated circuit block (Ch.6)
  4. Report             -> documented method, results, references (Ch.7)
  5. Presentation       -> slides + live defense / Q&amp;A (Ch.8)
</code></pre>
<h3>How grading usually works (rubric)</h3>
<pre><code>Rubric (indicative weights):
  Topic depth &amp; correctness .......... 30%
  Mini-project (design + simulation) .. 30%
  Report quality &amp; references ........ 20%
  Presentation &amp; defense ............. 15%
  Process / milestones met ........... 5%
</code></pre>
<div class="callout"><span class="badge">Check FLM</span> The exact deliverables, weights and deadlines are set by your instructor and the FPTU syllabus on FLM — always read that first. This chapter shows the <em>shape</em> of the work, not the official rule.</div>`,
    `<span class="eyebrow">IC_GRA_ELE · Giới thiệu</span>
<h2>Học phần tự chọn tốt nghiệp là gì</h2>
<p class="lead">Khác với môn thường, <strong>học phần tự chọn tốt nghiệp</strong> <em>không có nội dung cố định</em>. Chính bạn — sinh viên — chọn một chủ đề nâng cao trong thiết kế vi mạch, thống nhất kế hoạch với giảng viên hướng dẫn, tự học là chính, và chứng minh bằng sản phẩm nộp. Cẩm nang này là <strong>khung đỡ</strong> — cách chọn, lập kế hoạch, học, làm và trình bày — chứ không phải bản thân chủ đề.</p>
<h3>Bạn phải nộp những gì</h3>
<pre><code>Sản phẩm nộp (điển hình):
  1. Learning contract  -> chủ đề, mục tiêu, mốc, tài liệu (Ch.4)
  2. Nghiên cứu/tổng quan -> bài đào sâu bằng văn bản chủ đề đã chọn (Ch.5)
  3. Mini-project       -> một khối mạch được thiết kế &amp; mô phỏng (Ch.6)
  4. Báo cáo            -> phương pháp, kết quả, tài liệu tham khảo (Ch.7)
  5. Trình bày          -> slide + bảo vệ trực tiếp / hỏi đáp (Ch.8)
</code></pre>
<h3>Cách chấm điểm thường thấy (rubric)</h3>
<pre><code>Rubric (trọng số tham khảo):
  Độ sâu &amp; chính xác chủ đề .......... 30%
  Mini-project (thiết kế + mô phỏng) . 30%
  Chất lượng báo cáo &amp; trích dẫn ..... 20%
  Trình bày &amp; phản biện .............. 15%
  Quy trình / đạt mốc ................ 5%
</code></pre>
<div class="callout"><span class="badge">Xem FLM</span> Sản phẩm, trọng số và hạn nộp chính xác do giảng viên và giáo trình FPTU trên FLM quy định — luôn đọc trước. Chương này cho thấy <em>hình dạng</em> của công việc, không phải quy định chính thức.</div>`,
  ]]);

const c1 = doc('ic-gra-ele-1-1-choose', '1.1 — Choosing a topic by career direction|||1.1 — Chọn chủ đề theo định hướng nghề',
  'Học phần tự chọn = tự lái việc học; tiêu chí chọn chủ đề (đam mê, nghề, khả thi, tài nguyên); ánh xạ chủ đề ↔ vai trò trong ngành.',
  [[
    `<span class="eyebrow">IC_GRA_ELE · Chapter 1 · Lesson 1.1</span>
<h2>Choosing a topic by career direction</h2>
<p>An elective rewards <strong>ownership</strong>: no lecturer will hand you the material week by week. The single most important decision is <strong>which topic</strong>, and the best filter is your intended <em>job role</em>. Pick the topic whose skills a hiring team in that role would actually test.</p>
<h3>Four criteria for a good topic</h3>
<ul>
<li><strong>Interest</strong> — you will study it mostly alone; pick something you want to open on a Friday night.</li>
<li><strong>Career fit</strong> — it should map to a real role (analog designer, digital/RTL, DFT, physical design, verification).</li>
<li><strong>Feasibility</strong> — deliverable in one term with the tools you can actually access.</li>
<li><strong>Resources</strong> — a good book, a course and a free tool must exist for it.</li>
</ul>
<pre><code>Topic  ->  role it prepares you for
  Analog/RF IC       -> analog / RF design engineer
  Digital VLSI (RTL) -> RTL design engineer
  Verification/DFT   -> verification / DFT engineer
  Physical design    -> PD / place-and-route engineer
  Low-power / SoC    -> SoC integration / power architect
</code></pre>
<div class="callout"><span class="badge">Decide early</span> Spend the first week deciding, not drifting. A narrow topic you finish beats a broad one you abandon.</div>`,
    `<span class="eyebrow">IC_GRA_ELE · Chương 1 · Bài 1.1</span>
<h2>Chọn chủ đề theo định hướng nghề</h2>
<p>Học phần tự chọn thưởng cho sự <strong>chủ động</strong>: không giảng viên nào phát tài liệu cho bạn từng tuần. Quyết định quan trọng nhất là <strong>chọn chủ đề nào</strong>, và bộ lọc tốt nhất là <em>vai trò nghề</em> bạn nhắm tới. Hãy chọn chủ đề mà kỹ năng của nó đúng thứ một nhóm tuyển dụng ở vai trò đó sẽ kiểm tra.</p>
<h3>Bốn tiêu chí cho một chủ đề tốt</h3>
<ul>
<li><strong>Hứng thú</strong> — bạn sẽ học nó gần như một mình; chọn thứ bạn muốn mở ra học tối thứ Sáu.</li>
<li><strong>Khớp nghề</strong> — nó nên ánh xạ tới một vai trò thật (thiết kế analog, số/RTL, DFT, physical design, kiểm chứng).</li>
<li><strong>Khả thi</strong> — nộp được trong một kỳ với công cụ bạn thực sự truy cập được.</li>
<li><strong>Tài nguyên</strong> — phải có sẵn một cuốn sách tốt, một khoá học và một công cụ miễn phí.</li>
</ul>
<pre><code>Chủ đề  ->  vai trò nó chuẩn bị cho bạn
  Analog/RF IC       -> kỹ sư thiết kế analog / RF
  VLSI số (RTL)      -> kỹ sư thiết kế RTL
  Kiểm chứng/DFT     -> kỹ sư verification / DFT
  Physical design    -> kỹ sư PD / place-and-route
  Low-power / SoC    -> kỹ sư tích hợp SoC / kiến trúc điện năng
</code></pre>
<div class="callout"><span class="badge">Quyết sớm</span> Dành tuần đầu để quyết, đừng trôi dạt. Một chủ đề hẹp mà bạn hoàn thành thắng một chủ đề rộng mà bạn bỏ dở.</div>`,
  ]]);

const c1q = quiz('ic-gra-ele-quiz-1', 'Quiz 1 — Choosing a topic|||Quiz 1 — Chọn chủ đề', [
  { id: 'q1', question: 'Đặc điểm quan trọng nhất của một học phần TỰ CHỌN tốt nghiệp là?', options: ['Có 8 chương lý thuyết cố định', 'Sinh viên tự lái việc học, tự chọn chủ đề', 'Chỉ thi trắc nghiệm cuối kỳ', 'Giảng viên phát tài liệu từng tuần'], correctIndex: 1, explanation: 'Học phần tự chọn không có nội dung cố định — sinh viên tự chọn chủ đề và chủ động học.' },
  { id: 'q2', question: 'Bộ lọc TỐT NHẤT để chọn chủ đề là gì?', options: ['Chủ đề nào dễ nhất', 'Định hướng nghề (vai trò muốn làm)', 'Chủ đề bạn bè đang chọn', 'Chủ đề có tên nghe kêu nhất'], correctIndex: 1, explanation: 'Chọn theo vai trò nghề nhắm tới giúp kỹ năng học được đúng thứ nhà tuyển dụng kiểm tra.' },
  { id: 'q3', question: 'Tiêu chí "khả thi" (feasibility) nghĩa là?', options: ['Chủ đề càng rộng càng tốt', 'Nộp được trong một kỳ với công cụ truy cập được', 'Không cần tài liệu tham khảo', 'Phải dùng công cụ thương mại đắt tiền'], correctIndex: 1, explanation: 'Khả thi = hoàn thành được trong thời hạn với tài nguyên/công cụ bạn thực sự có.' },
]);

const c2 = doc('ic-gra-ele-2-1-topic-map', '2.1 — Map of advanced IC topics|||2.1 — Bản đồ chủ đề vi mạch nâng cao',
  'Tổng quan các nhánh: Analog/RF IC, Digital VLSI, verification/DFT, physical design, low-power, SoC, chế tạo bán dẫn — để chọn có cơ sở.',
  [[
    `<span class="eyebrow">IC_GRA_ELE · Chapter 2 · Lesson 2.1</span>
<h2>Map of advanced IC topics</h2>
<p>Before choosing, see the whole landscape. IC design splits into a few big families; each is a legitimate elective topic.</p>
<ul>
<li><strong>Analog / RF IC</strong> — amplifiers, op-amps, ADC/DAC, PLLs, RF front-ends. Continuous signals, hand-crafted, SPICE-simulated.</li>
<li><strong>Digital VLSI (RTL)</strong> — describe logic in Verilog/VHDL, synthesize to gates. CPUs, accelerators, controllers.</li>
<li><strong>Verification &amp; DFT</strong> — prove the design is correct (testbenches, UVM) and testable after manufacture (scan chains, BIST).</li>
<li><strong>Physical design</strong> — floorplan, place, route, timing closure — turning a netlist into a real layout (RTL-to-GDSII).</li>
<li><strong>Low-power design</strong> — clock gating, power gating, multi-Vt, DVFS — critical for battery devices.</li>
<li><strong>SoC integration</strong> — assembling IP blocks, buses (AXI), memory, into one chip.</li>
<li><strong>Semiconductor fabrication</strong> — the physics/process (CMOS, lithography, PDK) behind the mask.</li>
</ul>
<pre><code>Abstraction ladder (where each topic sits):
  System / SoC       <- SoC integration, low-power
  RTL / logic        <- digital VLSI, verification/DFT
  Circuit            <- analog/RF IC
  Layout / mask      <- physical design
  Device / process   <- semiconductor fabrication
</code></pre>
<div class="callout"><span class="badge">Pick one lane</span> You cannot master all seven in a term. Choose ONE, go deep, and reference the neighbours only where they touch your project.</div>`,
    `<span class="eyebrow">IC_GRA_ELE · Chương 2 · Bài 2.1</span>
<h2>Bản đồ chủ đề vi mạch nâng cao</h2>
<p>Trước khi chọn, hãy nhìn toàn cảnh. Thiết kế vi mạch chia thành vài nhánh lớn; mỗi nhánh là một chủ đề tự chọn hợp lệ.</p>
<ul>
<li><strong>Analog / RF IC</strong> — mạch khuếch đại, op-amp, ADC/DAC, PLL, tầng đầu RF. Tín hiệu liên tục, làm thủ công, mô phỏng SPICE.</li>
<li><strong>VLSI số (RTL)</strong> — mô tả logic bằng Verilog/VHDL, tổng hợp thành cổng. CPU, bộ tăng tốc, bộ điều khiển.</li>
<li><strong>Kiểm chứng &amp; DFT</strong> — chứng minh thiết kế đúng (testbench, UVM) và kiểm tra được sau chế tạo (scan chain, BIST).</li>
<li><strong>Physical design</strong> — floorplan, đặt, đi dây, đóng timing — biến netlist thành layout thật (RTL-to-GDSII).</li>
<li><strong>Thiết kế tiết kiệm điện (low-power)</strong> — clock gating, power gating, đa Vt, DVFS — thiết yếu cho thiết bị dùng pin.</li>
<li><strong>Tích hợp SoC</strong> — ráp các khối IP, bus (AXI), bộ nhớ, thành một con chip.</li>
<li><strong>Chế tạo bán dẫn</strong> — vật lý/quy trình (CMOS, quang khắc, PDK) đằng sau tấm mask.</li>
</ul>
<pre><code>Thang trừu tượng (mỗi chủ đề nằm ở đâu):
  Hệ thống / SoC     <- tích hợp SoC, low-power
  RTL / logic        <- VLSI số, kiểm chứng/DFT
  Mạch (circuit)     <- analog/RF IC
  Layout / mask      <- physical design
  Linh kiện / quy trình <- chế tạo bán dẫn
</code></pre>
<div class="callout"><span class="badge">Chọn một làn</span> Bạn không thể thạo cả bảy trong một kỳ. Chọn MỘT, đi sâu, và chỉ tham chiếu các nhánh lân cận ở chỗ chúng chạm vào project của bạn.</div>`,
  ]]);

const c2q = quiz('ic-gra-ele-quiz-2', 'Quiz 2 — Topic map|||Quiz 2 — Bản đồ chủ đề', [
  { id: 'q1', question: 'Chủ đề nào làm việc chủ yếu với tín hiệu LIÊN TỤC và mô phỏng SPICE?', options: ['VLSI số (RTL)', 'Analog / RF IC', 'Verification/DFT', 'Physical design'], correctIndex: 1, explanation: 'Analog/RF IC xử lý tín hiệu liên tục (op-amp, ADC/DAC, PLL), thiết kế thủ công và mô phỏng bằng SPICE.' },
  { id: 'q2', question: 'Luồng "RTL-to-GDSII" (floorplan, đặt, đi dây, đóng timing) thuộc nhánh nào?', options: ['Physical design', 'Analog IC', 'Chế tạo bán dẫn', 'SoC firmware'], correctIndex: 0, explanation: 'Physical design biến netlist thành layout thật qua floorplan → place → route → timing closure (RTL-to-GDSII).' },
  { id: 'q3', question: 'Lời khuyên đúng khi chọn phạm vi chủ đề cho một kỳ là?', options: ['Học cả bảy nhánh cùng lúc', 'Chọn MỘT nhánh và đi sâu', 'Chỉ đọc lướt mọi nhánh', 'Bỏ qua các nhánh lân cận hoàn toàn'], correctIndex: 1, explanation: 'Không thể thạo cả bảy trong một kỳ — chọn một nhánh, đi sâu, chỉ tham chiếu lân cận khi cần.' },
]);

const c3 = doc('ic-gra-ele-3-1-eda-flow', '3.1 — EDA tools & the design flow|||3.1 — Công cụ EDA & luồng thiết kế',
  'Luồng thiết kế số (RTL→GDSII) và analog (schematic→layout); công cụ Cadence/Synopsys và mã nguồn mở (OpenLane, ngspice); chọn công cụ theo chủ đề.',
  [[
    `<span class="eyebrow">IC_GRA_ELE · Chapter 3 · Lesson 3.1</span>
<h2>EDA tools &amp; the design flow</h2>
<p><strong>EDA</strong> (Electronic Design Automation) is the software that turns an idea into a manufacturable chip. Two broad flows exist; your topic decides which you touch.</p>
<h3>Digital flow (RTL to GDSII)</h3>
<pre><code>Spec -> RTL (Verilog) -> Simulation (verify behaviour)
     -> Synthesis (RTL -> gate netlist)
     -> Place &amp; Route (physical design)
     -> Timing/DRC/LVS sign-off -> GDSII (mask)
</code></pre>
<h3>Analog flow</h3>
<pre><code>Spec -> Schematic capture -> SPICE simulation
     -> Layout -> DRC / LVS / parasitic extraction
     -> Post-layout simulation -> GDSII
</code></pre>
<h3>Tools: commercial vs open-source</h3>
<ul>
<li><strong>Cadence</strong> — Virtuoso (analog), Genus/Innovus (digital), Xcelium (simulation).</li>
<li><strong>Synopsys</strong> — Design Compiler, VCS, IC Compiler, PrimeTime.</li>
<li><strong>Open-source</strong> — <strong>ngspice/Xschem</strong> (analog), <strong>Verilator/Icarus</strong> (sim), <strong>Yosys + OpenLane + Sky130</strong> (full digital RTL-to-GDSII, free).</li>
</ul>
<div class="callout"><span class="badge">Use what you can run</span> If your school has no Cadence/Synopsys licence, the open-source flow is enough to complete a real mini-project — an open-source tape-out flow (Sky130) is a strong portfolio piece on its own.</div>`,
    `<span class="eyebrow">IC_GRA_ELE · Chương 3 · Bài 3.1</span>
<h2>Công cụ EDA &amp; luồng thiết kế</h2>
<p><strong>EDA</strong> (Electronic Design Automation) là phần mềm biến một ý tưởng thành con chip chế tạo được. Có hai luồng lớn; chủ đề của bạn quyết định bạn đụng luồng nào.</p>
<h3>Luồng số (RTL đến GDSII)</h3>
<pre><code>Spec -> RTL (Verilog) -> Mô phỏng (kiểm hành vi)
     -> Tổng hợp (RTL -> netlist cổng)
     -> Place &amp; Route (physical design)
     -> Sign-off timing/DRC/LVS -> GDSII (mask)
</code></pre>
<h3>Luồng analog</h3>
<pre><code>Spec -> Vẽ schematic -> Mô phỏng SPICE
     -> Layout -> DRC / LVS / trích ký sinh
     -> Mô phỏng sau layout -> GDSII
</code></pre>
<h3>Công cụ: thương mại vs mã nguồn mở</h3>
<ul>
<li><strong>Cadence</strong> — Virtuoso (analog), Genus/Innovus (số), Xcelium (mô phỏng).</li>
<li><strong>Synopsys</strong> — Design Compiler, VCS, IC Compiler, PrimeTime.</li>
<li><strong>Mã nguồn mở</strong> — <strong>ngspice/Xschem</strong> (analog), <strong>Verilator/Icarus</strong> (mô phỏng), <strong>Yosys + OpenLane + Sky130</strong> (luồng số RTL-to-GDSII đầy đủ, miễn phí).</li>
</ul>
<div class="callout"><span class="badge">Dùng thứ bạn chạy được</span> Nếu trường không có license Cadence/Synopsys, luồng mã nguồn mở đủ để hoàn thành một mini-project thật — một luồng tape-out mã nguồn mở (Sky130) tự nó đã là điểm sáng trong hồ sơ.</div>`,
  ]]);

const c3q = quiz('ic-gra-ele-quiz-3', 'Quiz 3 — EDA & flow|||Quiz 3 — EDA & luồng', [
  { id: 'q1', question: 'Trong luồng số, bước "Synthesis" (tổng hợp) làm gì?', options: ['Biến RTL thành netlist cổng logic', 'Vẽ schematic analog', 'Mô phỏng SPICE', 'Đóng gói chip vào vỏ'], correctIndex: 0, explanation: 'Synthesis biến mã RTL (Verilog/VHDL) thành netlist các cổng logic.' },
  { id: 'q2', question: 'Bộ công cụ mã nguồn mở nào cho luồng SỐ đầy đủ RTL-to-GDSII?', options: ['ngspice + Xschem', 'Yosys + OpenLane + Sky130', 'Cadence Virtuoso', 'Chỉ Verilator'], correctIndex: 1, explanation: 'Yosys (tổng hợp) + OpenLane (place-and-route) + PDK Sky130 tạo luồng số RTL-to-GDSII miễn phí.' },
  { id: 'q3', question: 'DRC / LVS trong luồng analog dùng để?', options: ['Viết testbench UVM', 'Kiểm layout đúng luật &amp; khớp schematic', 'Tổng hợp RTL', 'Chọn chủ đề đồ án'], correctIndex: 1, explanation: 'DRC kiểm luật thiết kế của layout, LVS kiểm layout khớp với schematic (netlist).' },
]);

const c4 = doc('ic-gra-ele-4-1-learning-contract', '4.1 — Self-study method & the learning contract|||4.1 — Phương pháp tự học & lập learning contract',
  'Cách tự học hiệu quả (chủ động, theo mốc); learning contract là gì và mẫu điền: mục tiêu, phạm vi, mốc, tài liệu, tiêu chí hoàn thành.',
  [[
    `<span class="eyebrow">IC_GRA_ELE · Chapter 4 · Lesson 4.1</span>
<h2>Self-study method &amp; the learning contract</h2>
<p>Self-study fails when it has no structure. A <strong>learning contract</strong> is a short written agreement — with yourself and your supervisor — that turns a vague topic into a plan you can be held to.</p>
<h3>An effective self-study loop</h3>
<ul>
<li><strong>Set a weekly goal</strong> — one concrete outcome, not "study PLLs".</li>
<li><strong>Active over passive</strong> — derive, simulate, summarize in your own words; don't just watch videos.</li>
<li><strong>Log &amp; reflect</strong> — keep a short journal of what worked and what blocked you.</li>
<li><strong>Milestone check-ins</strong> — meet your supervisor at each milestone, not only at the end.</li>
</ul>
<h3>Learning-contract template</h3>
<pre><code>LEARNING CONTRACT
  Topic       : (e.g. a 4-bit flash ADC in Sky130)
  Goal        : what I will be able to do / show
  Scope IN    : exactly what is covered
  Scope OUT   : what is explicitly NOT covered
  Milestones  : W2 literature, W4 design, W6 simulate, W8 report
  Resources   : books, courses, tools I will use
  Done means  : the measurable definition of "finished"
  Supervisor  : name + check-in cadence
</code></pre>
<div class="callout"><span class="badge">Scope OUT matters most</span> Writing what you will NOT do protects a one-term project from swelling until it is unfinishable.</div>`,
    `<span class="eyebrow">IC_GRA_ELE · Chương 4 · Bài 4.1</span>
<h2>Phương pháp tự học &amp; lập learning contract</h2>
<p>Tự học thất bại khi không có cấu trúc. <strong>Learning contract</strong> (bản cam kết học tập) là một thoả thuận ngắn bằng văn bản — với chính mình và với giảng viên hướng dẫn — biến một chủ đề mơ hồ thành kế hoạch mà bạn chịu trách nhiệm được.</p>
<h3>Vòng tự học hiệu quả</h3>
<ul>
<li><strong>Đặt mục tiêu tuần</strong> — một kết quả cụ thể, không phải "học về PLL".</li>
<li><strong>Chủ động hơn thụ động</strong> — tự suy ra, mô phỏng, tóm tắt bằng lời của mình; đừng chỉ xem video.</li>
<li><strong>Ghi &amp; phản tư</strong> — giữ một nhật ký ngắn ghi cái gì hiệu quả, cái gì cản.</li>
<li><strong>Check-in theo mốc</strong> — gặp giảng viên ở mỗi mốc, không chỉ lúc cuối.</li>
</ul>
<h3>Mẫu learning contract</h3>
<pre><code>LEARNING CONTRACT
  Chủ đề      : (vd một ADC flash 4-bit trên Sky130)
  Mục tiêu    : tôi sẽ làm được / trình bày được gì
  Trong phạm vi : chính xác những gì được bao gồm
  Ngoài phạm vi : những gì DỨT KHOÁT không làm
  Mốc         : T2 tổng quan, T4 thiết kế, T6 mô phỏng, T8 báo cáo
  Tài liệu    : sách, khoá học, công cụ sẽ dùng
  "Xong" nghĩa là : định nghĩa đo được của "hoàn thành"
  GV hướng dẫn : tên + nhịp check-in
</code></pre>
<div class="callout"><span class="badge">"Ngoài phạm vi" quan trọng nhất</span> Viết rõ những gì bạn KHÔNG làm bảo vệ một đồ án một kỳ khỏi phình ra đến mức không thể hoàn thành.</div>`,
  ]]);

const c4q = quiz('ic-gra-ele-quiz-4', 'Quiz 4 — Learning contract|||Quiz 4 — Learning contract', [
  { id: 'q1', question: 'Learning contract chủ yếu dùng để làm gì?', options: ['Thay thế báo cáo cuối kỳ', 'Biến chủ đề mơ hồ thành kế hoạch có mốc, cam kết được', 'Đăng ký môn học', 'Nộp cho phòng đào tạo thay bằng tốt nghiệp'], correctIndex: 1, explanation: 'Learning contract là thoả thuận ngắn biến chủ đề thành kế hoạch cụ thể có mục tiêu, mốc và tiêu chí hoàn thành.' },
  { id: 'q2', question: 'Vì sao mục "Ngoài phạm vi" (Scope OUT) lại đặc biệt quan trọng?', options: ['Để báo cáo dài hơn', 'Chống cho đồ án một kỳ phình ra không hoàn thành nổi', 'Không quan trọng, có thể bỏ', 'Để giảng viên chấm nhanh hơn'], correctIndex: 1, explanation: 'Ghi rõ những gì KHÔNG làm giữ phạm vi trong tầm một kỳ, tránh phình ra vô tận.' },
  { id: 'q3', question: 'Cách tự học nào là CHỦ ĐỘNG (active)?', options: ['Chỉ xem video liên tục', 'Tự suy ra, mô phỏng, tóm tắt bằng lời của mình', 'Đọc lướt không ghi chú', 'Chờ giảng viên giảng lại'], correctIndex: 1, explanation: 'Học chủ động là tự làm: suy ra công thức, mô phỏng, viết lại bằng lời mình — thay vì tiếp nhận thụ động.' },
]);

const c5 = doc('ic-gra-ele-5-1-deep-research', '5.1 — Deep research on the chosen topic|||5.1 — Nghiên cứu chuyên sâu chủ đề đã chọn',
  'Cách đọc tài liệu học thuật (sách → khảo luận → bài báo), ghi chú có cấu trúc, xây tổng quan (literature review), tránh đạo văn và trích dẫn đúng.',
  [[
    `<span class="eyebrow">IC_GRA_ELE · Chapter 5 · Lesson 5.1</span>
<h2>Deep research on the chosen topic</h2>
<p>The study phase produces the written deep-dive. Do it in <strong>layers</strong>, from broad to specific, so you never drown in a paper you are not ready for.</p>
<h3>A reading order that works</h3>
<pre><code>1. Textbook chapter  -> the settled fundamentals (Razavi / Weste-Harris)
2. Survey / review   -> how the field is organized, key terms
3. Primary papers    -> IEEE Xplore, for the specific technique
4. Datasheets / PDK  -> the real numbers you will design against
</code></pre>
<h3>Structured note-taking</h3>
<ul>
<li>For each source, capture: <strong>claim</strong>, <strong>method</strong>, <strong>result</strong>, <strong>how it applies to my project</strong>.</li>
<li>Write in your own words — copying is both plagiarism and a sign you didn't understand it.</li>
<li>Record the full citation the moment you read it, not the night before the deadline.</li>
</ul>
<h3>Build the literature review</h3>
<p>A good review doesn't list sources one by one; it <strong>groups</strong> them by approach, compares them, and states the gap your mini-project addresses.</p>
<div class="callout"><span class="badge">Cite everything</span> Every figure, number and idea that isn't yours needs a reference. FPTU treats plagiarism seriously — proper citation is not optional.</div>`,
    `<span class="eyebrow">IC_GRA_ELE · Chương 5 · Bài 5.1</span>
<h2>Nghiên cứu chuyên sâu chủ đề đã chọn</h2>
<p>Giai đoạn học tạo ra bài đào sâu bằng văn bản. Làm theo <strong>lớp</strong>, từ rộng đến hẹp, để không bao giờ chết đuối trong một bài báo bạn chưa đủ nền để đọc.</p>
<h3>Thứ tự đọc hiệu quả</h3>
<pre><code>1. Chương sách        -> nền tảng đã ổn định (Razavi / Weste-Harris)
2. Khảo luận / review -> lĩnh vực được tổ chức thế nào, thuật ngữ chính
3. Bài báo gốc        -> IEEE Xplore, cho kỹ thuật cụ thể
4. Datasheet / PDK    -> các con số thật bạn sẽ thiết kế theo
</code></pre>
<h3>Ghi chú có cấu trúc</h3>
<ul>
<li>Với mỗi nguồn, ghi: <strong>luận điểm</strong>, <strong>phương pháp</strong>, <strong>kết quả</strong>, <strong>áp dụng vào project mình ra sao</strong>.</li>
<li>Viết bằng lời của mình — chép lại vừa là đạo văn vừa là dấu hiệu bạn chưa hiểu.</li>
<li>Ghi trích dẫn đầy đủ ngay lúc đọc, không phải đêm trước hạn nộp.</li>
</ul>
<h3>Dựng phần tổng quan (literature review)</h3>
<p>Một tổng quan tốt không liệt kê nguồn từng cái một; nó <strong>nhóm</strong> theo cách tiếp cận, so sánh chúng, và nêu ra khoảng trống mà mini-project của bạn giải quyết.</p>
<div class="callout"><span class="badge">Trích dẫn mọi thứ</span> Mọi hình, con số và ý tưởng không phải của bạn đều cần tài liệu tham khảo. FPTU xử lý đạo văn nghiêm — trích dẫn đúng là bắt buộc, không phải tuỳ chọn.</div>`,
  ]]);

const c5q = quiz('ic-gra-ele-quiz-5', 'Quiz 5 — Deep research|||Quiz 5 — Nghiên cứu sâu', [
  { id: 'q1', question: 'Thứ tự đọc tài liệu hợp lý (rộng → hẹp) là?', options: ['Bài báo gốc → survey → sách', 'Sách/chương → survey → bài báo gốc → datasheet/PDK', 'Datasheet → sách → không cần bài báo', 'Chỉ đọc bài báo mới nhất'], correctIndex: 1, explanation: 'Đi theo lớp từ rộng đến hẹp: sách (nền) → khảo luận → bài báo gốc → datasheet/PDK, để không bị ngợp.' },
  { id: 'q2', question: 'Một phần tổng quan (literature review) TỐT nên?', options: ['Liệt kê từng nguồn một cách rời rạc', 'Nhóm nguồn theo cách tiếp cận, so sánh, nêu khoảng trống', 'Chép nguyên văn abstract các bài', 'Chỉ trích một nguồn duy nhất'], correctIndex: 1, explanation: 'Review tốt nhóm nguồn theo hướng tiếp cận, so sánh và chỉ ra khoảng trống mà đồ án giải quyết.' },
  { id: 'q3', question: 'Khi nào nên ghi lại trích dẫn đầy đủ của một nguồn?', options: ['Ngay lúc đọc nguồn đó', 'Đêm trước hạn nộp', 'Sau khi bảo vệ xong', 'Không cần ghi trích dẫn'], correctIndex: 0, explanation: 'Ghi trích dẫn đầy đủ ngay khi đọc tránh mất dấu nguồn và tránh đạo văn.' },
]);

const c6 = doc('ic-gra-ele-6-1-mini-project', '6.1 — Building the mini-project|||6.1 — Thực hiện mini-project',
  'Từ spec đến khối mạch mô phỏng được: chọn khối nhỏ, đặt yêu cầu đo được, thiết kế, mô phỏng, đo lường và lặp; ví dụ theo cả luồng số và analog.',
  [[
    `<span class="eyebrow">IC_GRA_ELE · Chapter 6 · Lesson 6.1</span>
<h2>Building the mini-project</h2>
<p>The mini-project is the proof you learned by doing. Keep it <strong>small and complete</strong>: one circuit block, fully designed and simulated, beats a whole SoC that never runs.</p>
<h3>From spec to result</h3>
<pre><code>1. Spec       -> measurable targets (gain &gt; 40 dB, area, power)
2. Design     -> schematic (analog) or RTL (digital)
3. Simulate   -> SPICE / testbench; compare to the spec
4. Measure    -> extract the real numbers from the sim
5. Iterate    -> tune until targets are met, log each change
</code></pre>
<h3>Example blocks that finish in one term</h3>
<ul>
<li><strong>Analog</strong> — a two-stage op-amp, a bandgap reference, a small ADC/DAC.</li>
<li><strong>Digital</strong> — a UART, a FIFO, a small ALU or an AXI-lite peripheral in Verilog, run through OpenLane.</li>
<li><strong>DFT/verification</strong> — a UVM testbench for one block, or scan-chain insertion.</li>
</ul>
<div class="callout"><span class="badge">Measurable beats impressive</span> Define the target numbers first. A block that hits a stated spec and is fully simulated scores far higher than an ambitious design that doesn't converge.</div>`,
    `<span class="eyebrow">IC_GRA_ELE · Chương 6 · Bài 6.1</span>
<h2>Thực hiện mini-project</h2>
<p>Mini-project là bằng chứng bạn học bằng cách làm. Giữ nó <strong>nhỏ và trọn vẹn</strong>: một khối mạch, thiết kế và mô phỏng đầy đủ, thắng cả một SoC không bao giờ chạy được.</p>
<h3>Từ spec đến kết quả</h3>
<pre><code>1. Spec       -> mục tiêu đo được (gain &gt; 40 dB, diện tích, công suất)
2. Thiết kế   -> schematic (analog) hoặc RTL (số)
3. Mô phỏng   -> SPICE / testbench; so với spec
4. Đo         -> rút các con số thật từ mô phỏng
5. Lặp        -> tinh chỉnh đến khi đạt mục tiêu, ghi lại mỗi thay đổi
</code></pre>
<h3>Ví dụ khối hoàn thành được trong một kỳ</h3>
<ul>
<li><strong>Analog</strong> — op-amp hai tầng, mạch tham chiếu bandgap, một ADC/DAC nhỏ.</li>
<li><strong>Số</strong> — một UART, một FIFO, một ALU nhỏ hoặc ngoại vi AXI-lite bằng Verilog, chạy qua OpenLane.</li>
<li><strong>DFT/kiểm chứng</strong> — một testbench UVM cho một khối, hoặc chèn scan-chain.</li>
</ul>
<div class="callout"><span class="badge">Đo được thắng hoành tráng</span> Định nghĩa con số mục tiêu trước. Một khối đạt spec đã nêu và mô phỏng đầy đủ ăn điểm cao hơn nhiều so với một thiết kế tham vọng nhưng không hội tụ.</div>`,
  ]]);

const c6q = quiz('ic-gra-ele-quiz-6', 'Quiz 6 — Mini-project|||Quiz 6 — Mini-project', [
  { id: 'q1', question: 'Nguyên tắc phạm vi tốt nhất cho mini-project một kỳ là?', options: ['Làm cả một SoC hoàn chỉnh', 'Một khối mạch nhỏ, thiết kế & mô phỏng trọn vẹn', 'Càng nhiều khối càng tốt', 'Không cần mô phỏng, chỉ vẽ schematic'], correctIndex: 1, explanation: 'Một khối nhỏ hoàn chỉnh và mô phỏng được thắng một hệ lớn không bao giờ chạy.' },
  { id: 'q2', question: 'Bước ĐẦU TIÊN trong luồng "spec đến kết quả" là gì?', options: ['Mô phỏng', 'Đặt spec với mục tiêu đo được', 'Đo kết quả', 'Viết báo cáo'], correctIndex: 1, explanation: 'Trước tiên đặt spec với các mục tiêu đo được (gain, diện tích, công suất) để có chuẩn so sánh.' },
  { id: 'q3', question: 'Ví dụ nào là khối SỐ (digital) phù hợp làm trong một kỳ?', options: ['Op-amp hai tầng', 'Mạch bandgap reference', 'Một UART hoặc FIFO bằng Verilog', 'ADC flash analog'], correctIndex: 2, explanation: 'UART/FIFO/ALU nhỏ viết bằng Verilog là khối số vừa sức, chạy được qua luồng như OpenLane.' },
]);

const c7 = doc('ic-gra-ele-7-1-report', '7.1 — Writing the report & documentation|||7.1 — Viết báo cáo & tài liệu hoá',
  'Cấu trúc báo cáo kỹ thuật (tóm tắt, giới thiệu, phương pháp, kết quả, thảo luận, kết luận, tham khảo); trình bày số liệu; tài liệu hoá mã/thiết kế để tái lập.',
  [[
    `<span class="eyebrow">IC_GRA_ELE · Chapter 7 · Lesson 7.1</span>
<h2>Writing the report &amp; documentation</h2>
<p>The report is how the work is graded and remembered. Use the standard <strong>technical-report structure</strong> — examiners look for exactly these sections.</p>
<pre><code>REPORT STRUCTURE
  Abstract     : the whole project in one paragraph
  Introduction : problem, motivation, goals
  Background   : the literature review (Ch.5)
  Method       : your design &amp; how you simulated it
  Results       : measured numbers, tables, waveforms
  Discussion   : did you meet the spec? why / why not?
  Conclusion   : what you achieved + future work
  References   : every source, consistently formatted
</code></pre>
<h3>Presenting results well</h3>
<ul>
<li>Put numbers in <strong>tables</strong> and behaviour in <strong>plots</strong> — with axes, units and captions.</li>
<li>Compare measured vs target explicitly; don't hide a missed spec.</li>
<li>Every figure is referenced from the text ("as Fig. 3 shows...").</li>
</ul>
<h3>Documentation for reproducibility</h3>
<p>Include enough to <strong>reproduce</strong> the result: tool versions, PDK, the schematic/RTL, and how to run the simulation. Good docs make your project reusable — and are exactly what an employer looks for.</p>
<div class="callout"><span class="badge">Write as you go</span> Draft each section when its work is fresh, not in a panic the last week. The journal from Chapter 4 becomes your first draft.</div>`,
    `<span class="eyebrow">IC_GRA_ELE · Chương 7 · Bài 7.1</span>
<h2>Viết báo cáo &amp; tài liệu hoá</h2>
<p>Báo cáo là cách công việc được chấm và được nhớ. Dùng <strong>cấu trúc báo cáo kỹ thuật</strong> chuẩn — hội đồng tìm đúng các phần này.</p>
<pre><code>CẤU TRÚC BÁO CÁO
  Tóm tắt      : cả đồ án trong một đoạn
  Giới thiệu   : vấn đề, động cơ, mục tiêu
  Nền tảng     : phần tổng quan tài liệu (Ch.5)
  Phương pháp  : thiết kế của bạn &amp; cách mô phỏng
  Kết quả      : số đo được, bảng, dạng sóng
  Thảo luận    : có đạt spec không? vì sao / vì sao không?
  Kết luận     : đạt được gì + hướng phát triển
  Tham khảo    : mọi nguồn, định dạng nhất quán
</code></pre>
<h3>Trình bày kết quả cho tốt</h3>
<ul>
<li>Đưa số vào <strong>bảng</strong> và hành vi vào <strong>đồ thị</strong> — có trục, đơn vị và chú thích.</li>
<li>So sánh đo được vs mục tiêu một cách rõ ràng; đừng giấu spec không đạt.</li>
<li>Mọi hình đều được nhắc từ phần chữ ("như Hình 3 cho thấy...").</li>
</ul>
<h3>Tài liệu hoá để tái lập</h3>
<p>Kèm đủ để <strong>tái lập</strong> kết quả: phiên bản công cụ, PDK, schematic/RTL, và cách chạy mô phỏng. Tài liệu tốt làm đồ án tái sử dụng được — và đúng là thứ nhà tuyển dụng tìm.</p>
<div class="callout"><span class="badge">Viết dần</span> Nháp mỗi phần khi việc còn nóng, đừng dồn hoảng loạn tuần cuối. Nhật ký ở Chương 4 trở thành bản nháp đầu tiên của bạn.</div>`,
  ]]);

const c7q = quiz('ic-gra-ele-quiz-7', 'Quiz 7 — Report|||Quiz 7 — Báo cáo', [
  { id: 'q1', question: 'Trong cấu trúc báo cáo kỹ thuật, phần "Kết quả" (Results) chứa gì?', options: ['Động cơ và mục tiêu', 'Số đo được, bảng, dạng sóng', 'Danh sách tài liệu tham khảo', 'Tóm tắt cả đồ án một đoạn'], correctIndex: 1, explanation: 'Phần Kết quả trình bày số liệu đo được, bảng và đồ thị/dạng sóng từ mô phỏng.' },
  { id: 'q2', question: 'Vì sao phải tài liệu hoá phiên bản công cụ, PDK, RTL/schematic?', options: ['Để báo cáo dài hơn', 'Để người khác TÁI LẬP được kết quả', 'Vì bắt buộc phải đủ 8 phần', 'Không cần thiết'], correctIndex: 1, explanation: 'Tài liệu hoá đủ để tái lập kết quả làm đồ án đáng tin và tái sử dụng được — thứ nhà tuyển dụng đánh giá cao.' },
  { id: 'q3', question: 'Cách trình bày kết quả nào ĐÚNG?', options: ['Giấu spec không đạt để báo cáo đẹp', 'So sánh đo được vs mục tiêu rõ ràng, hình có trục/đơn vị/chú thích', 'Chỉ mô tả bằng lời, không bảng biểu', 'Đưa hình mà không nhắc trong phần chữ'], correctIndex: 1, explanation: 'Trình bày trung thực: so đo được vs mục tiêu, bảng cho số, đồ thị có trục/đơn vị/chú thích và được nhắc từ phần chữ.' },
]);

const c8 = doc('ic-gra-ele-8-1-defense-career', '8.1 — Presentation, defense & career direction|||8.1 — Trình bày, phản biện & định hướng nghề',
  'Chuẩn bị slide và bảo vệ, trả lời phản biện; ánh xạ chủ đề sang nghề; chứng chỉ ngành (Cadence/Synopsys certified, industry certs) và bước tiếp theo.',
  [[
    `<span class="eyebrow">IC_GRA_ELE · Chapter 8 · Lesson 8.1</span>
<h2>Presentation, defense &amp; career direction</h2>
<h3>Presenting &amp; defending</h3>
<ul>
<li><strong>Tell a story</strong> — problem → what you did → result → what it means. Not a wall of equations.</li>
<li><strong>Lead with results</strong> — show the measured numbers vs the spec early.</li>
<li><strong>Rehearse the defense</strong> — anticipate "why this choice?", "what are the limits?", "what would you do next?".</li>
<li><strong>Say "I don't know" honestly</strong> — then explain how you'd find out. Examiners respect that.</li>
</ul>
<h3>From elective to career</h3>
<pre><code>Topic done   ->  next step / certification
  Digital VLSI  -> RTL/verification roles; SystemVerilog, UVM
  Physical des. -> PD roles; vendor PD certifications
  Analog/RF     -> analog roles; deep SPICE + device physics
  EDA tools     -> Cadence / Synopsys certified programs
</code></pre>
<h3>Industry certifications &amp; next steps</h3>
<ul>
<li><strong>Vendor certs</strong> — Cadence and Synopsys run official certified-tool programs (Virtuoso, Design Compiler, etc.).</li>
<li><strong>Portfolio</strong> — publish your mini-project (report + repo) — an open-source Sky130 tape-out is a genuine credential.</li>
<li><strong>Keep building</strong> — the elective is a launchpad: turn it into an internship, a thesis, or a first job in that lane.</li>
</ul>
<div class="callout"><span class="badge">The real deliverable</span> Beyond the grade, this course should leave you with one topic you can speak about with authority in an interview — and the proof to back it up.</div>`,
    `<span class="eyebrow">IC_GRA_ELE · Chương 8 · Bài 8.1</span>
<h2>Trình bày, phản biện &amp; định hướng nghề</h2>
<h3>Trình bày &amp; bảo vệ</h3>
<ul>
<li><strong>Kể một câu chuyện</strong> — vấn đề → bạn đã làm gì → kết quả → nó có nghĩa gì. Không phải một bức tường công thức.</li>
<li><strong>Dẫn bằng kết quả</strong> — cho thấy số đo được vs spec sớm.</li>
<li><strong>Tập dượt phản biện</strong> — lường trước "vì sao chọn thế?", "giới hạn là gì?", "tiếp theo bạn sẽ làm gì?".</li>
<li><strong>Nói "tôi chưa biết" một cách trung thực</strong> — rồi giải thích cách bạn sẽ tìm ra. Hội đồng tôn trọng điều đó.</li>
</ul>
<h3>Từ học phần tự chọn đến nghề</h3>
<pre><code>Chủ đề đã làm ->  bước tiếp / chứng chỉ
  VLSI số       -> vai trò RTL/kiểm chứng; SystemVerilog, UVM
  Physical des. -> vai trò PD; chứng chỉ PD của hãng
  Analog/RF     -> vai trò analog; SPICE sâu + vật lý linh kiện
  Công cụ EDA   -> chương trình Cadence / Synopsys certified
</code></pre>
<h3>Chứng chỉ ngành &amp; bước tiếp theo</h3>
<ul>
<li><strong>Chứng chỉ hãng</strong> — Cadence và Synopsys có chương trình chứng nhận công cụ chính thức (Virtuoso, Design Compiler, v.v.).</li>
<li><strong>Hồ sơ (portfolio)</strong> — công bố mini-project (báo cáo + repo) — một tape-out Sky130 mã nguồn mở là chứng chỉ thật sự.</li>
<li><strong>Tiếp tục làm</strong> — học phần tự chọn là bệ phóng: biến nó thành kỳ thực tập, đồ án tốt nghiệp, hoặc công việc đầu tiên trong làn đó.</li>
</ul>
<div class="callout"><span class="badge">Sản phẩm thật sự</span> Ngoài điểm số, môn này nên để lại cho bạn một chủ đề bạn nói được đầy tự tin trong phỏng vấn — kèm bằng chứng chống lưng.</div>`,
  ]]);

const c8q = quiz('ic-gra-ele-quiz-8', 'Quiz 8 — Defense & career|||Quiz 8 — Phản biện & nghề', [
  { id: 'q1', question: 'Cách trình bày đồ án hiệu quả nhất khi bảo vệ là?', options: ['Đọc hết mọi công thức lên slide', 'Kể chuyện: vấn đề → đã làm gì → kết quả → ý nghĩa', 'Chỉ nói lý thuyết chung, không nêu kết quả', 'Giấu các giới hạn của thiết kế'], correctIndex: 1, explanation: 'Trình bày theo mạch câu chuyện, dẫn bằng kết quả đo được vs spec, thay vì đổ một bức tường công thức.' },
  { id: 'q2', question: 'Khi bị hỏi phản biện mà không biết câu trả lời, nên?', options: ['Bịa một câu cho qua', 'Nói trung thực "tôi chưa biết" rồi nêu cách sẽ tìm ra', 'Im lặng bỏ qua', 'Đổ lỗi cho công cụ'], correctIndex: 1, explanation: 'Thành thật "tôi chưa biết" kèm cách sẽ tìm hiểu được hội đồng tôn trọng hơn là bịa.' },
  { id: 'q3', question: 'Bằng chứng nghề nghiệp mạnh mà học phần này có thể để lại là gì?', options: ['Chỉ tấm bằng tốt nghiệp', 'Một portfolio: mini-project (báo cáo + repo), vd tape-out Sky130 mã nguồn mở', 'Số tín chỉ đã tích luỹ', 'Danh sách môn đã học'], correctIndex: 1, explanation: 'Mini-project công bố được (báo cáo + repo, như tape-out Sky130 mã nguồn mở) là chứng chỉ thật để nói tự tin khi phỏng vấn.' },
]);

export default {
  semester: { code: 'FPTU_Hola9', name: 'Kỳ 9', ordinal: 11 },
  course: {
    courseCode: 'IC_GRA_ELE',
    slug: 'ic-gra-ele-graduation-elective-for-integrated-circuit-design',
    title: 'Graduation Elective for Integrated Circuit Design',
    level: 'ADVANCED',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/IC_GRA_ELE.webp',
    shortDescription: 'A graduation ELECTIVE for IC design: pick one advanced topic (analog/RF, digital VLSI, DFT, physical design, low-power, SoC, fabrication), write a learning contract, research it, build an EDA mini-project, then report & defend. Bilingual guide + quizzes.|||Học phần TỰ CHỌN tốt nghiệp thiết kế vi mạch: chọn một chủ đề nâng cao (analog/RF, VLSI số, DFT, physical design, low-power, SoC), lập learning contract, nghiên cứu & làm mini-project EDA, rồi báo cáo & bảo vệ. Song ngữ + quiz.',
    description: 'Môn <strong>IC_GRA_ELE — Graduation Elective for Integrated Circuit Design</strong> (Học phần tự chọn tốt nghiệp, kỳ 9) thuộc ngành Thiết kế vi mạch bán dẫn. Đây là <strong>học phần TỰ CHỌN</strong>, KHÔNG có nội dung cố định: khung này hướng dẫn bạn <strong>chọn &amp; tự học một chủ đề nâng cao</strong> của ngành rồi làm một mini-project. Lộ trình: chọn chủ đề theo định hướng nghề → bản đồ chủ đề (analog/RF, VLSI số, DFT, physical design, low-power, SoC, chế tạo bán dẫn) → công cụ EDA &amp; luồng thiết kế → phương pháp tự học &amp; learning contract → nghiên cứu sâu → mini-project → báo cáo → trình bày, phản biện &amp; định hướng nghề. Song ngữ, mỗi chương có quiz.',
    whatYouLearn: 'Học phần tự chọn tốt nghiệp là gì &amp; cách chọn chủ đề theo nghề; bản đồ các nhánh vi mạch nâng cao (analog/RF, VLSI số, verification/DFT, physical design, low-power, SoC, chế tạo bán dẫn); công cụ EDA (Cadence/Synopsys &amp; mã nguồn mở OpenLane/ngspice) và luồng RTL-to-GDSII / schematic-to-layout; lập learning contract &amp; phương pháp tự học chủ động; nghiên cứu sâu &amp; viết tổng quan; làm mini-project (thiết kế/mô phỏng một khối mạch); viết báo cáo kỹ thuật; trình bày, phản biện &amp; định hướng chứng chỉ nghề.',
    requirements: 'Đã học nền tảng thiết kế vi mạch/điện tử số &amp; analog trong ngành. Nên có tài khoản FPTU để xem quy định &amp; syllabus trên FLM, và một công cụ EDA truy cập được (thương mại hoặc mã nguồn mở như OpenLane/ngspice).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Quy định FPTU, sách chuẩn ngành, IEEE/EDA, khoá VLSI, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Học phần tự chọn là gì, deliverable, rubric.', lessons: [intro] },
    { title: 'Chương 1 — Chọn chủ đề theo nghề|||Chapter 1 — Choosing a topic', description: 'Tiêu chí chọn, ánh xạ chủ đề ↔ vai trò.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Bản đồ chủ đề nâng cao|||Chapter 2 — Topic map', description: 'Analog/RF, VLSI số, DFT, PD, low-power, SoC, fab.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Công cụ EDA & luồng|||Chapter 3 — EDA tools & flow', description: 'Cadence/Synopsys, mã nguồn mở, RTL-to-GDSII.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Tự học & learning contract|||Chapter 4 — Learning contract', description: 'Phương pháp tự học, mẫu cam kết học tập.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Nghiên cứu chuyên sâu|||Chapter 5 — Deep research', description: 'Đọc tài liệu, ghi chú, tổng quan, trích dẫn.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Mini-project|||Chapter 6 — Mini-project', description: 'Spec → thiết kế → mô phỏng → đo → lặp.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Viết báo cáo|||Chapter 7 — Report', description: 'Cấu trúc báo cáo kỹ thuật, trình bày số liệu.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Trình bày & nghề|||Chapter 8 — Defense & career', description: 'Bảo vệ, phản biện, chứng chỉ, định hướng nghề.', lessons: [c8, c8q] },
  ],
};
