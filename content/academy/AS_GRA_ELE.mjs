/**
 * AS_GRA_ELE — Graduation Elective for Automotive Software Engineering.
 * HỌC PHẦN TỰ CHỌN tốt nghiệp, ngành Kỹ thuật phần mềm ô tô (FPTU, Kỳ 9).
 * Không có nội dung cố định: khung hướng dẫn sinh viên CHỌN & TỰ HỌC một chủ
 * đề phần mềm ô tô nâng cao + làm mini-project + báo cáo + phản biện.
 * Song ngữ VI+EN. Giữ NGUYÊN slug/semester/thumb.
 * ⚠️ KHÔNG nested backtick/${; "&" HTML -> &amp;amp; ; "<" -> &amp;lt;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('as-gra-ele-0-0-tai-lieu', '📚 Materials & references|||📚 Tài liệu tham khảo',
  'Trung tâm tài liệu: chuẩn AUTOSAR & ISO, công cụ Vector/MathWorks, khoá học online, quy định FPTU về học phần tự chọn tốt nghiệp. KHÔNG upload PDF.',
  [[
    `<span class="eyebrow">AS_GRA_ELE · Materials</span>
<h2>Materials &amp; resource hub</h2>
<p class="lead">This is a <strong>graduation elective</strong> — there is no fixed syllabus. You pick <em>one</em> advanced automotive-software topic, study it deeply and ship a mini-project. Below are the reference sources; the official rules &amp; rubric live on FLM.</p>
<h3>📘 Program rules &amp; templates</h3>
<p>The FPTU curriculum, elective rules and report template are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account. Please do NOT upload copyrighted PDFs.</p>
<h3>📗 Standards &amp; specs</h3>
<ul>
<li><a href="https://www.autosar.org/" target="_blank" rel="noopener">AUTOSAR</a> — Classic &amp; Adaptive Platform specifications (free)</li>
<li><a href="https://www.iso.org/standard/68383.html" target="_blank" rel="noopener">ISO 26262</a> — Road vehicles: functional safety</li>
<li><a href="https://www.iso.org/standard/70918.html" target="_blank" rel="noopener">ISO/SAE 21434</a> — Road vehicles: cybersecurity engineering</li>
</ul>
<h3>🛠️ Tools &amp; vendor docs</h3>
<ul>
<li><a href="https://www.vector.com/int/en/products/products-a-z/software/canoe/" target="_blank" rel="noopener">Vector CANoe / CANalyzer</a> — bus simulation &amp; test</li>
<li><a href="https://www.mathworks.com/solutions/automotive.html" target="_blank" rel="noopener">MathWorks — MATLAB/Simulink for automotive</a></li>
</ul>
<h3>🎓 Online courses</h3>
<ul>
<li><a href="https://www.coursera.org/" target="_blank" rel="noopener">Coursera</a> — embedded systems, self-driving cars, functional safety</li>
<li><a href="https://www.edx.org/" target="_blank" rel="noopener">edX</a> — automotive &amp; embedded software specializations</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Choose</strong> — pick a topic that fits your target job (Ch.1–2).</li>
<li><strong>Plan</strong> — set up tools and a learning contract (Ch.3–4).</li>
<li><strong>Go deep</strong> — research + a mini-project (Ch.5–6).</li>
<li><strong>Deliver</strong> — write it up, present, defend (Ch.7–8).</li>
</ol></div>`,
    `<span class="eyebrow">AS_GRA_ELE · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Đây là <strong>học phần tự chọn tốt nghiệp</strong> — không có giáo trình cố định. Bạn chọn <em>một</em> chủ đề phần mềm ô tô nâng cao, học sâu và làm mini-project. Bên dưới là nguồn tham khảo; quy định &amp; rubric chính thức nằm trên FLM.</p>
<h3>📘 Quy định &amp; biểu mẫu</h3>
<p>Khung chương trình FPTU, quy định học phần tự chọn và mẫu báo cáo có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU. Vui lòng KHÔNG upload PDF có bản quyền.</p>
<h3>📗 Chuẩn &amp; đặc tả</h3>
<ul>
<li><a href="https://www.autosar.org/" target="_blank" rel="noopener">AUTOSAR</a> — đặc tả nền tảng Classic &amp; Adaptive (miễn phí)</li>
<li><a href="https://www.iso.org/standard/68383.html" target="_blank" rel="noopener">ISO 26262</a> — an toàn chức năng xe hơi</li>
<li><a href="https://www.iso.org/standard/70918.html" target="_blank" rel="noopener">ISO/SAE 21434</a> — an ninh mạng cho xe hơi</li>
</ul>
<h3>🛠️ Công cụ &amp; tài liệu hãng</h3>
<ul>
<li><a href="https://www.vector.com/int/en/products/products-a-z/software/canoe/" target="_blank" rel="noopener">Vector CANoe / CANalyzer</a> — mô phỏng &amp; kiểm thử bus</li>
<li><a href="https://www.mathworks.com/solutions/automotive.html" target="_blank" rel="noopener">MathWorks — MATLAB/Simulink cho ô tô</a></li>
</ul>
<h3>🎓 Khoá học online</h3>
<ul>
<li><a href="https://www.coursera.org/" target="_blank" rel="noopener">Coursera</a> — hệ nhúng, xe tự hành, an toàn chức năng</li>
<li><a href="https://www.edx.org/" target="_blank" rel="noopener">edX</a> — chuyên đề phần mềm ô tô &amp; nhúng</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Chọn</strong> — chủ đề khớp với công việc bạn nhắm tới (Ch.1–2).</li>
<li><strong>Lập kế hoạch</strong> — dựng công cụ và learning contract (Ch.3–4).</li>
<li><strong>Đào sâu</strong> — nghiên cứu + mini-project (Ch.5–6).</li>
<li><strong>Giao nộp</strong> — viết báo cáo, trình bày, phản biện (Ch.7–8).</li>
</ol></div>`,
  ]]);

const intro = doc('as-gra-ele-0-1-overview', 'Course overview: how a graduation elective works|||Tổng quan: học phần tự chọn tốt nghiệp hoạt động thế nào',
  'Học phần tự chọn tốt nghiệp là gì; bạn tự chọn 1 chủ đề nâng cao + làm mini-project; deliverable (đề cương, báo cáo, mã nguồn, thuyết trình); rubric chấm.',
  [[
    `<span class="eyebrow">AS_GRA_ELE · Lesson 0.1 · Overview</span>
<h2>How a graduation elective works</h2>
<p class="lead">A <strong>graduation elective</strong> is not a normal course with fixed lectures. It is a <strong>guided self-study unit</strong>: with a supervisor, you choose one advanced topic in automotive software, study it in depth, build a small project, then report and defend it. This course is the <em>scaffolding</em> that walks you through that process.</p>
<h3>What you produce (deliverables)</h3>
<pre><code>Deliverable        When       Weight (typical)
-----------------  ---------  ----------------
Proposal / outline Week 1-2   10%
Learning contract  Week 2     5%
Literature review  Week 3-5   20%
Mini-project code  Week 5-9   30%
Final report       Week 10    20%
Presentation+Q&amp;A   Week 11    15%</code></pre>
<h3>How it is graded (rubric)</h3>
<ul>
<li><strong>Depth</strong> — did you go beyond a tutorial into real understanding?</li>
<li><strong>Rigor</strong> — cited standards/specs, honest evaluation, reproducible.</li>
<li><strong>Artifact</strong> — the mini-project runs and does something real.</li>
<li><strong>Communication</strong> — clear report and a defense you can stand behind.</li>
</ul>
<div class="callout"><span class="badge">Golden rule</span> The topic is <em>yours</em>, but the standard is fixed: pick something you can finish, cite your sources, and prove it works.</div>`,
    `<span class="eyebrow">AS_GRA_ELE · Bài 0.1 · Tổng quan</span>
<h2>Học phần tự chọn tốt nghiệp hoạt động thế nào</h2>
<p class="lead">Một <strong>học phần tự chọn tốt nghiệp</strong> không phải môn học có bài giảng cố định. Nó là một <strong>đơn vị tự học có hướng dẫn</strong>: cùng giảng viên hướng dẫn, bạn chọn một chủ đề nâng cao trong phần mềm ô tô, học sâu, làm một dự án nhỏ, rồi báo cáo và phản biện. Khung này là <em>giàn giáo</em> dẫn bạn qua toàn bộ quá trình đó.</p>
<h3>Bạn phải nộp gì (deliverable)</h3>
<pre><code>Sản phẩm            Khi nào    Trọng số (điển hình)
------------------  ---------  --------------------
Đề cương / proposal Tuần 1-2   10%
Learning contract   Tuần 2     5%
Tổng quan tài liệu  Tuần 3-5   20%
Mã nguồn mini-proj  Tuần 5-9   30%
Báo cáo cuối        Tuần 10    20%
Thuyết trình + hỏi  Tuần 11    15%</code></pre>
<h3>Chấm điểm thế nào (rubric)</h3>
<ul>
<li><strong>Độ sâu</strong> — bạn có đi xa hơn một bài hướng dẫn để thật sự hiểu?</li>
<li><strong>Tính chặt chẽ</strong> — trích dẫn chuẩn/đặc tả, đánh giá trung thực, tái lập được.</li>
<li><strong>Sản phẩm</strong> — mini-project chạy được và làm việc gì đó thật.</li>
<li><strong>Trình bày</strong> — báo cáo rõ ràng và phần phản biện bạn bảo vệ được.</li>
</ul>
<div class="callout"><span class="badge">Nguyên tắc vàng</span> Chủ đề là <em>của bạn</em>, nhưng tiêu chuẩn thì cố định: chọn thứ làm xong được, trích dẫn nguồn, và chứng minh nó chạy.</div>`,
  ]]);

const c1 = doc('as-gra-ele-1-1-what-elective', '1.1 — What an elective is & choosing by career|||1.1 — Học phần tự chọn là gì & chọn theo nghề',
  'Phân biệt học phần tự chọn với môn bắt buộc; tiêu chí chọn chủ đề (khớp định hướng nghề, khả thi, có tài liệu, đo được); ma trận chủ đề ↔ nghề.',
  [[
    `<span class="eyebrow">AS_GRA_ELE · Chapter 1 · Lesson 1.1</span>
<h2>What an elective is &amp; choosing by career</h2>
<p>An <strong>elective</strong> gives you freedom and responsibility: no one hands you the content. A good topic sits at the intersection of <strong>your target job</strong>, <strong>feasibility in one semester</strong>, and <strong>available learning resources</strong>.</p>
<h3>Choosing criteria (score each 1–5)</h3>
<ul>
<li><strong>Career fit</strong> — does mastering it help you land the role you want?</li>
<li><strong>Feasibility</strong> — can you finish a real artifact in ~11 weeks?</li>
<li><strong>Resources</strong> — free specs, tools, courses actually exist?</li>
<li><strong>Measurable</strong> — is there a clear "done" you can demo?</li>
</ul>
<h3>Topic ↔ career map</h3>
<pre><code>Topic                     Fits the role
------------------------  -----------------------------
AUTOSAR Classic/Adaptive  ECU / platform software engineer
ADAS / autonomous         Perception / self-driving engineer
Functional safety 26262   Safety engineer / assessor
Cybersecurity 21434       Automotive security engineer
Model-based (Simulink)    Control / plant-model engineer
Embedded RTOS             Firmware / real-time engineer</code></pre>
<div class="callout"><span class="badge">Avoid</span> A topic that is too broad ("build self-driving") or has no free tools. Narrow it: "implement one AUTOSAR SWC that reads a CAN signal" beats "master AUTOSAR".</div>`,
    `<span class="eyebrow">AS_GRA_ELE · Chương 1 · Bài 1.1</span>
<h2>Học phần tự chọn là gì &amp; chọn theo nghề</h2>
<p>Một <strong>học phần tự chọn</strong> cho bạn tự do và trách nhiệm: không ai đưa sẵn nội dung. Một chủ đề tốt nằm ở giao điểm của <strong>công việc bạn nhắm tới</strong>, <strong>tính khả thi trong một kỳ</strong>, và <strong>tài liệu học sẵn có</strong>.</p>
<h3>Tiêu chí chọn (chấm mỗi mục 1–5)</h3>
<ul>
<li><strong>Khớp nghề</strong> — thành thạo nó có giúp bạn vào được vị trí mong muốn?</li>
<li><strong>Khả thi</strong> — làm xong một sản phẩm thật trong ~11 tuần được không?</li>
<li><strong>Tài liệu</strong> — có đặc tả, công cụ, khoá học miễn phí thật không?</li>
<li><strong>Đo được</strong> — có một điểm "hoàn thành" rõ ràng để demo không?</li>
</ul>
<h3>Ma trận chủ đề ↔ nghề</h3>
<pre><code>Chủ đề                    Hợp với vị trí
------------------------  -----------------------------
AUTOSAR Classic/Adaptive  Kỹ sư phần mềm ECU / nền tảng
ADAS / tự hành            Kỹ sư perception / xe tự lái
An toàn chức năng 26262   Kỹ sư an toàn / thẩm định
An ninh mạng 21434        Kỹ sư an ninh ô tô
Model-based (Simulink)    Kỹ sư điều khiển / mô hình
Nhúng RTOS                Kỹ sư firmware / thời gian thực</code></pre>
<div class="callout"><span class="badge">Tránh</span> Chủ đề quá rộng ("làm xe tự hành") hoặc không có công cụ miễn phí. Hãy thu hẹp: "hiện thực một AUTOSAR SWC đọc một tín hiệu CAN" hơn hẳn "làm chủ AUTOSAR".</div>`,
  ]]);

const c1q = quiz('as-gra-ele-quiz-1', 'Quiz 1 — Elective & choosing|||Quiz 1 — Tự chọn & cách chọn', [
  { id: 'q1', question: 'Điểm khác biệt cốt lõi của học phần tự chọn tốt nghiệp so với môn bắt buộc?', options: ['Có nhiều bài giảng cố định hơn', 'Bạn tự chọn chủ đề và tự học có hướng dẫn', 'Không cần nộp sản phẩm nào', 'Không được trích dẫn tài liệu'], correctIndex: 1, explanation: 'Học phần tự chọn không có giáo trình cố định — bạn chọn chủ đề và tự học dưới sự hướng dẫn của giảng viên.' },
  { id: 'q2', question: 'Tiêu chí nào KHÔNG nên dùng khi chọn chủ đề?', options: ['Khớp định hướng nghề', 'Khả thi trong một kỳ', 'Chủ đề càng rộng và mơ hồ càng tốt', 'Có tài liệu học miễn phí'], correctIndex: 2, explanation: 'Chủ đề quá rộng, mơ hồ khiến không thể làm xong; nên thu hẹp thành mục tiêu đo được.' },
  { id: 'q3', question: 'Chủ đề nào hợp nhất cho vị trí "kỹ sư an ninh ô tô"?', options: ['ISO 26262 (an toàn chức năng)', 'ISO/SAE 21434 (an ninh mạng)', 'Model-based design Simulink', 'AUTOSAR Classic'], correctIndex: 1, explanation: 'ISO/SAE 21434 là chuẩn an ninh mạng cho xe, khớp trực tiếp với vị trí kỹ sư an ninh ô tô.' },
]);

const c2 = doc('as-gra-ele-2-1-topic-map', '2.1 — Map of advanced automotive-software topics|||2.1 — Bản đồ chủ đề phần mềm ô tô nâng cao',
  'Tổng quan AUTOSAR Classic/Adaptive, ADAS/tự hành, ISO 26262, ISO 21434, V2X, RTOS nhúng, model-based design; mỗi chủ đề là một hướng để chọn.',
  [[
    `<span class="eyebrow">AS_GRA_ELE · Chapter 2 · Lesson 2.1</span>
<h2>Map of advanced automotive-software topics</h2>
<p>Use this as a menu. Each is a legitimate elective direction; pick <em>one</em>.</p>
<ul>
<li><strong>AUTOSAR Classic</strong> — the layered standard (RTE, BSW, MCAL) for deeply-embedded ECUs; static, real-time.</li>
<li><strong>AUTOSAR Adaptive</strong> — POSIX-based, service-oriented (SOME/IP), for high-performance compute in software-defined vehicles.</li>
<li><strong>ADAS / autonomous</strong> — perception, sensor fusion, path planning; camera/radar/LiDAR.</li>
<li><strong>Functional safety (ISO 26262)</strong> — ASIL levels, hazard analysis, safety lifecycle for E/E systems.</li>
<li><strong>Cybersecurity (ISO/SAE 21434)</strong> — TARA, secure boot, in-vehicle network protection.</li>
<li><strong>V2X</strong> — vehicle-to-everything communication (V2V, V2I).</li>
<li><strong>Embedded RTOS</strong> — real-time scheduling, tasks, ISRs (e.g. FreeRTOS, OSEK).</li>
<li><strong>Model-based design</strong> — MATLAB/Simulink modelling + auto-code generation.</li>
</ul>
<pre><code>Depth vs. build effort (rough)
                         theory  build
AUTOSAR Classic SWC        med     med
Adaptive SOME/IP demo      med     high
ADAS lane-detect (OpenCV)  med     med
26262 hazard analysis      high    low
21434 TARA of a feature    high    low
Simulink controller        med     med</code></pre>
<div class="callout"><span class="badge">Tip</span> Theory-heavy topics (26262/21434) let you deliver a rigorous document; build-heavy topics need a working artifact. Match to your strengths.</div>`,
    `<span class="eyebrow">AS_GRA_ELE · Chương 2 · Bài 2.1</span>
<h2>Bản đồ chủ đề phần mềm ô tô nâng cao</h2>
<p>Xem đây như một thực đơn. Mỗi mục là một hướng tự chọn hợp lệ; chọn <em>một</em>.</p>
<ul>
<li><strong>AUTOSAR Classic</strong> — chuẩn phân lớp (RTE, BSW, MCAL) cho ECU nhúng sâu; tĩnh, thời gian thực.</li>
<li><strong>AUTOSAR Adaptive</strong> — nền POSIX, hướng dịch vụ (SOME/IP), cho khối tính toán mạnh trong xe định-nghĩa-bằng-phần-mềm.</li>
<li><strong>ADAS / tự hành</strong> — perception, hợp nhất cảm biến, lập lộ trình; camera/radar/LiDAR.</li>
<li><strong>An toàn chức năng (ISO 26262)</strong> — mức ASIL, phân tích nguy cơ, vòng đời an toàn cho hệ E/E.</li>
<li><strong>An ninh mạng (ISO/SAE 21434)</strong> — TARA, secure boot, bảo vệ mạng trong xe.</li>
<li><strong>V2X</strong> — giao tiếp xe-với-mọi-thứ (V2V, V2I).</li>
<li><strong>RTOS nhúng</strong> — lập lịch thời gian thực, task, ISR (vd FreeRTOS, OSEK).</li>
<li><strong>Model-based design</strong> — mô hình hoá MATLAB/Simulink + sinh mã tự động.</li>
</ul>
<pre><code>Độ sâu lý thuyết vs. công sức làm (ước)
                          lý thuyết  làm
AUTOSAR Classic SWC          vừa      vừa
Adaptive SOME/IP demo        vừa      cao
ADAS phát hiện làn (OpenCV)  vừa      vừa
26262 phân tích nguy cơ      cao      thấp
21434 TARA một tính năng     cao      thấp
Simulink bộ điều khiển       vừa      vừa</code></pre>
<div class="callout"><span class="badge">Mẹo</span> Chủ đề nặng lý thuyết (26262/21434) cho bạn nộp một tài liệu chặt chẽ; chủ đề nặng làm cần một sản phẩm chạy được. Khớp với thế mạnh của bạn.</div>`,
  ]]);

const c2q = quiz('as-gra-ele-quiz-2', 'Quiz 2 — Topic map|||Quiz 2 — Bản đồ chủ đề', [
  { id: 'q1', question: 'AUTOSAR Adaptive khác AUTOSAR Classic chủ yếu ở điểm nào?', options: ['Adaptive dùng nền POSIX, hướng dịch vụ (SOME/IP)', 'Classic không có lớp phần mềm nào', 'Adaptive chỉ chạy trên vi điều khiển 8-bit', 'Chúng giống hệt nhau'], correctIndex: 0, explanation: 'Adaptive dựa trên POSIX, kiến trúc hướng dịch vụ (SOME/IP), cho khối tính toán mạnh; Classic là chuẩn phân lớp tĩnh cho ECU nhúng sâu.' },
  { id: 'q2', question: 'ISO 26262 tập trung vào?', options: ['An ninh mạng cho xe', 'An toàn chức năng của hệ thống E/E', 'Giao tiếp V2X', 'Sinh mã từ Simulink'], correctIndex: 1, explanation: 'ISO 26262 là chuẩn an toàn chức năng (functional safety) cho hệ thống điện/điện tử trên xe, với các mức ASIL.' },
  { id: 'q3', question: 'Một chủ đề "nặng lý thuyết, nhẹ công sức làm" điển hình là?', options: ['Demo SOME/IP trên AUTOSAR Adaptive', 'Phân tích nguy cơ theo ISO 26262', 'Phát hiện làn đường bằng OpenCV', 'Bộ điều khiển Simulink có sinh mã'], correctIndex: 1, explanation: 'Phân tích nguy cơ/TARA thiên về tài liệu chặt chẽ, ít cần dựng sản phẩm chạy được.' },
]);

const c3 = doc('as-gra-ele-3-1-tools', '3.1 — Tools & environment|||3.1 — Công cụ & môi trường',
  'CANoe/CANalyzer (mô phỏng bus), MATLAB/Simulink (model-based), target hardware & HIL; chọn công cụ theo chủ đề, dựng môi trường tái lập được.',
  [[
    `<span class="eyebrow">AS_GRA_ELE · Chapter 3 · Lesson 3.1</span>
<h2>Tools &amp; environment</h2>
<p>Set up your toolchain <em>before</em> the deep work. A reproducible environment is itself part of the grade.</p>
<h3>Common tools</h3>
<ul>
<li><strong>Vector CANoe / CANalyzer</strong> — simulate and analyse CAN/LIN/FlexRay/Ethernet buses; write test cases in CAPL. Great when your topic touches in-vehicle networking.</li>
<li><strong>MATLAB / Simulink</strong> — model plants &amp; controllers, run simulations, generate C code (Embedded Coder). Core for model-based design.</li>
<li><strong>Target hardware / HIL</strong> — real ECU or dev board, or Hardware-in-the-Loop where a simulator feeds the ECU realistic signals. Use MIL → SIL → PIL → HIL as you increase fidelity.</li>
</ul>
<pre><code>Fidelity ladder (model-based)
MIL  Model-in-the-Loop   test the model
SIL  Software-in-Loop    test generated code on PC
PIL  Processor-in-Loop   run code on target CPU
HIL  Hardware-in-Loop    ECU + simulated environment</code></pre>
<h3>Free / student options</h3>
<p>CANoe has a demo mode; MATLAB has a student/home license; Simulink models can run without hardware. For CAN without a real bus, use a virtual bus or an open-source SocketCAN + <code>vcan0</code> on Linux.</p>
<div class="callout"><span class="badge">Reproducible</span> Record exact versions, licenses and setup steps in a README so your supervisor can rebuild your environment.</div>`,
    `<span class="eyebrow">AS_GRA_ELE · Chương 3 · Bài 3.1</span>
<h2>Công cụ &amp; môi trường</h2>
<p>Dựng toolchain <em>trước</em> khi vào phần sâu. Một môi trường tái lập được cũng là một phần điểm số.</p>
<h3>Công cụ thường dùng</h3>
<ul>
<li><strong>Vector CANoe / CANalyzer</strong> — mô phỏng và phân tích bus CAN/LIN/FlexRay/Ethernet; viết ca kiểm thử bằng CAPL. Rất hợp khi chủ đề liên quan mạng trong xe.</li>
<li><strong>MATLAB / Simulink</strong> — mô hình hoá đối tượng &amp; bộ điều khiển, chạy mô phỏng, sinh mã C (Embedded Coder). Lõi của model-based design.</li>
<li><strong>Target hardware / HIL</strong> — ECU thật hoặc board dev, hoặc Hardware-in-the-Loop khi một bộ mô phỏng bơm tín hiệu thực tế vào ECU. Dùng MIL → SIL → PIL → HIL khi tăng độ trung thực.</li>
</ul>
<pre><code>Thang độ trung thực (model-based)
MIL  Model-in-the-Loop   kiểm mô hình
SIL  Software-in-Loop    kiểm mã sinh ra trên PC
PIL  Processor-in-Loop   chạy mã trên CPU đích
HIL  Hardware-in-Loop    ECU + môi trường mô phỏng</code></pre>
<h3>Lựa chọn miễn phí / sinh viên</h3>
<p>CANoe có chế độ demo; MATLAB có license sinh viên/home; mô hình Simulink chạy được mà không cần phần cứng. Muốn CAN mà không có bus thật, dùng bus ảo hoặc SocketCAN + <code>vcan0</code> mã nguồn mở trên Linux.</p>
<div class="callout"><span class="badge">Tái lập</span> Ghi lại đúng phiên bản, license và các bước cài trong README để giảng viên dựng lại được môi trường của bạn.</div>`,
  ]]);

const c3q = quiz('as-gra-ele-quiz-3', 'Quiz 3 — Tools|||Quiz 3 — Công cụ', [
  { id: 'q1', question: 'Công cụ nào phù hợp nhất để mô phỏng và phân tích bus CAN/LIN?', options: ['MATLAB Simulink', 'Vector CANoe / CANalyzer', 'OpenCV', 'FreeRTOS'], correctIndex: 1, explanation: 'CANoe/CANalyzer của Vector chuyên mô phỏng, phân tích và kiểm thử các bus trong xe như CAN/LIN/FlexRay/Ethernet.' },
  { id: 'q2', question: 'Trong thang độ trung thực model-based, bậc nào chạy mã trên chính CPU đích?', options: ['MIL', 'SIL', 'PIL', 'HIL'], correctIndex: 2, explanation: 'PIL (Processor-in-the-Loop) chạy mã đã sinh trên bộ xử lý đích để kiểm hành vi trên phần cứng thật của CPU.' },
  { id: 'q3', question: 'Vì sao cần ghi lại phiên bản, license và các bước cài trong README?', options: ['Để tăng dung lượng báo cáo', 'Để môi trường tái lập được, giúp giảng viên dựng lại', 'Vì bắt buộc phải mua license đắt', 'Không cần thiết'], correctIndex: 1, explanation: 'Môi trường tái lập được là một phần của điểm số; README giúp người khác dựng lại đúng môi trường của bạn.' },
]);

const c4 = doc('as-gra-ele-4-1-learning-contract', '4.1 — Self-study method & learning contract|||4.1 — Phương pháp tự học & learning contract',
  'Kỹ thuật tự học (chia nhỏ, mục tiêu SMART, sổ nhật ký học); learning contract (mục tiêu, phạm vi, cột mốc, tiêu chí hoàn thành) ký với giảng viên.',
  [[
    `<span class="eyebrow">AS_GRA_ELE · Chapter 4 · Lesson 4.1</span>
<h2>Self-study method &amp; learning contract</h2>
<p>Freedom needs structure. Two tools keep an elective on track: a <strong>self-study routine</strong> and a <strong>learning contract</strong> agreed with your supervisor.</p>
<h3>Self-study routine</h3>
<ul>
<li><strong>Chunk</strong> — break the topic into weekly, finishable pieces.</li>
<li><strong>SMART goals</strong> — Specific, Measurable, Achievable, Relevant, Time-bound.</li>
<li><strong>Learning journal</strong> — log what you did, what broke, what you learned. This feeds your final report.</li>
<li><strong>Spaced practice</strong> — revisit and rebuild, don't just read once.</li>
</ul>
<h3>Learning contract template</h3>
<pre><code>Field              Your entry
-----------------  -------------------------------
Topic              e.g. AUTOSAR SWC reading a CAN signal
Learning goals     3-5 concrete outcomes
Scope (in / out)   what you will and will NOT cover
Deliverables       report + mini-project + demo
Milestones         weekly checkpoints w/ dates
Done criteria      objective, testable
Supervisor + date  signature</code></pre>
<div class="callout"><span class="badge">Why sign it</span> A learning contract turns a vague "I'll study AUTOSAR" into a checkable plan — and protects you at grading time because the target was agreed up front.</div>`,
    `<span class="eyebrow">AS_GRA_ELE · Chương 4 · Bài 4.1</span>
<h2>Phương pháp tự học &amp; learning contract</h2>
<p>Tự do cần cấu trúc. Hai công cụ giữ học phần tự chọn đi đúng hướng: một <strong>thói quen tự học</strong> và một <strong>learning contract</strong> thống nhất với giảng viên hướng dẫn.</p>
<h3>Thói quen tự học</h3>
<ul>
<li><strong>Chia nhỏ</strong> — tách chủ đề thành các mảnh làm xong được theo tuần.</li>
<li><strong>Mục tiêu SMART</strong> — Cụ thể, Đo được, Khả thi, Liên quan, Có hạn.</li>
<li><strong>Sổ nhật ký học</strong> — ghi bạn làm gì, hỏng gì, học được gì. Đây là nguyên liệu cho báo cáo cuối.</li>
<li><strong>Ôn cách quãng</strong> — quay lại và dựng lại, đừng chỉ đọc một lần.</li>
</ul>
<h3>Mẫu learning contract</h3>
<pre><code>Trường             Bạn điền
-----------------  -------------------------------
Chủ đề             vd AUTOSAR SWC đọc một tín hiệu CAN
Mục tiêu học       3-5 kết quả cụ thể
Phạm vi (trong/ngoài)  làm gì và KHÔNG làm gì
Sản phẩm           báo cáo + mini-project + demo
Cột mốc            checkpoint theo tuần kèm ngày
Tiêu chí hoàn thành  khách quan, kiểm được
GVHD + ngày        chữ ký</code></pre>
<div class="callout"><span class="badge">Vì sao phải ký</span> Learning contract biến câu mơ hồ "tôi sẽ học AUTOSAR" thành một kế hoạch kiểm được — và bảo vệ bạn khi chấm điểm vì mục tiêu đã được thống nhất từ đầu.</div>`,
  ]]);

const c4q = quiz('as-gra-ele-quiz-4', 'Quiz 4 — Learning contract|||Quiz 4 — Learning contract', [
  { id: 'q1', question: 'Mục tiêu SMART gồm các yếu tố nào?', options: ['Cụ thể, Đo được, Khả thi, Liên quan, Có hạn', 'Nhanh, Rẻ, Dễ, Vui, Ngắn', 'Sâu, Rộng, Mới, Khó, Lạ', 'Đọc, Viết, Nghe, Nói, Nhớ'], correctIndex: 0, explanation: 'SMART = Specific, Measurable, Achievable, Relevant, Time-bound (Cụ thể, Đo được, Khả thi, Liên quan, Có hạn).' },
  { id: 'q2', question: 'Learning contract KHÔNG nhất thiết chứa mục nào sau đây?', options: ['Mục tiêu học và phạm vi', 'Tiêu chí hoàn thành', 'Điểm số chính xác của bạn cuối kỳ', 'Cột mốc theo tuần'], correctIndex: 2, explanation: 'Contract thống nhất mục tiêu, phạm vi, cột mốc và tiêu chí hoàn thành từ đầu; điểm số cuối kỳ là kết quả chấm, không phải nội dung contract.' },
  { id: 'q3', question: 'Vai trò chính của sổ nhật ký học (learning journal) là gì?', options: ['Thay thế hoàn toàn báo cáo cuối', 'Ghi lại quá trình để làm nguyên liệu cho báo cáo và tự phản tư', 'Chỉ để nộp cho phòng đào tạo', 'Không có tác dụng gì'], correctIndex: 1, explanation: 'Nhật ký ghi việc đã làm, lỗi gặp, bài học — là nguyên liệu quý cho báo cáo cuối và giúp tự phản tư.' },
]);

const c5 = doc('as-gra-ele-5-1-deep-research', '5.1 — Deep research on the chosen topic|||5.1 — Nghiên cứu chuyên sâu chủ đề đã chọn',
  'Đọc chuẩn/đặc tả gốc, khảo sát tài liệu (literature review), ghi chú có trích dẫn, phân biệt nguồn sơ cấp/thứ cấp, tránh chỉ đọc blog.',
  [[
    `<span class="eyebrow">AS_GRA_ELE · Chapter 5 · Lesson 5.1</span>
<h2>Deep research on the chosen topic</h2>
<p>This is the study phase — go from "I've heard of it" to "I can explain and use it".</p>
<h3>Source hierarchy</h3>
<ul>
<li><strong>Primary</strong> — the standard/spec itself (AUTOSAR docs, ISO 26262/21434), vendor manuals. Highest authority.</li>
<li><strong>Secondary</strong> — textbooks, university courses, peer-reviewed papers.</li>
<li><strong>Tertiary</strong> — blogs, forum posts, videos. Useful for intuition; never your only citation.</li>
</ul>
<h3>Literature review workflow</h3>
<pre><code>1. Collect  -&gt; gather 8-15 credible sources
2. Read     -&gt; skim, then deep-read the core 3-5
3. Note     -&gt; one card per idea, with citation
4. Synthesize -&gt; group ideas, find agreements/gaps
5. Write    -&gt; a review that argues, not just lists</code></pre>
<h3>Cite as you go</h3>
<p>Record author, title, version/year and URL <em>when you read it</em>, not at the end. A metric or claim without a citation is a fabrication risk — always attach the source.</p>
<div class="callout"><span class="badge">Depth test</span> Can you explain the topic to a classmate <em>without</em> the slides, and answer "why" questions? If not, keep reading the primary source.</div>`,
    `<span class="eyebrow">AS_GRA_ELE · Chương 5 · Bài 5.1</span>
<h2>Nghiên cứu chuyên sâu chủ đề đã chọn</h2>
<p>Đây là giai đoạn học — đi từ "tôi có nghe qua" đến "tôi giải thích và dùng được".</p>
<h3>Thứ bậc nguồn</h3>
<ul>
<li><strong>Sơ cấp</strong> — chính bản chuẩn/đặc tả (tài liệu AUTOSAR, ISO 26262/21434), sổ tay hãng. Thẩm quyền cao nhất.</li>
<li><strong>Thứ cấp</strong> — sách giáo khoa, khoá học đại học, bài báo bình duyệt.</li>
<li><strong>Cấp ba</strong> — blog, bài diễn đàn, video. Hữu ích cho trực giác; đừng bao giờ là trích dẫn duy nhất.</li>
</ul>
<h3>Quy trình khảo sát tài liệu</h3>
<pre><code>1. Thu thập  -&gt; gom 8-15 nguồn đáng tin
2. Đọc       -&gt; lướt, rồi đọc sâu 3-5 nguồn lõi
3. Ghi chú   -&gt; mỗi ý một thẻ, kèm trích dẫn
4. Tổng hợp  -&gt; nhóm ý, tìm chỗ đồng thuận/khoảng trống
5. Viết      -&gt; bản review có lập luận, không chỉ liệt kê</code></pre>
<h3>Trích dẫn ngay khi đọc</h3>
<p>Ghi tác giả, tiêu đề, phiên bản/năm và URL <em>ngay lúc đọc</em>, đừng để đến cuối. Một con số hay khẳng định không có trích dẫn là nguy cơ bịa đặt — luôn gắn kèm nguồn.</p>
<div class="callout"><span class="badge">Kiểm độ sâu</span> Bạn có giải thích được chủ đề cho bạn cùng lớp <em>mà không</em> cần slide, và trả lời được câu hỏi "vì sao" không? Nếu chưa, hãy đọc tiếp nguồn sơ cấp.</div>`,
  ]]);

const c5q = quiz('as-gra-ele-quiz-5', 'Quiz 5 — Deep research|||Quiz 5 — Nghiên cứu sâu', [
  { id: 'q1', question: 'Nguồn nào có thẩm quyền cao nhất khi nghiên cứu một chuẩn ô tô?', options: ['Blog cá nhân', 'Video YouTube', 'Chính bản chuẩn/đặc tả gốc (AUTOSAR, ISO)', 'Bài đăng diễn đàn'], correctIndex: 2, explanation: 'Nguồn sơ cấp — bản chuẩn/đặc tả gốc và tài liệu hãng — có thẩm quyền cao nhất; blog/video chỉ là nguồn cấp ba.' },
  { id: 'q2', question: 'Vì sao nên ghi trích dẫn ngay khi đọc, không để đến cuối?', options: ['Để tránh mất nguồn và giảm nguy cơ bịa đặt số liệu', 'Vì cuối kỳ không được phép trích dẫn', 'Để báo cáo dài hơn', 'Không có lý do'], correctIndex: 0, explanation: 'Ghi trích dẫn ngay lúc đọc tránh quên nguồn; một con số không nguồn là nguy cơ bịa đặt.' },
  { id: 'q3', question: 'Bản literature review tốt nên như thế nào?', options: ['Chỉ liệt kê tên các nguồn', 'Có lập luận: nhóm ý, so sánh, chỉ ra khoảng trống', 'Chỉ chép nguyên văn một nguồn', 'Không cần trích dẫn'], correctIndex: 1, explanation: 'Review tốt tổng hợp và lập luận — nhóm ý, tìm điểm đồng thuận và khoảng trống — chứ không chỉ liệt kê.' },
]);

const c6 = doc('as-gra-ele-6-1-mini-project', '6.1 — The mini-project|||6.1 — Mini-project',
  'Thiết kế & hiện thực một module phần mềm ô tô nhỏ nhưng chạy được; phạm vi vừa sức, kiểm thử, quản lý mã bằng git, tiêu chí "chạy được".',
  [[
    `<span class="eyebrow">AS_GRA_ELE · Chapter 6 · Lesson 6.1</span>
<h2>The mini-project</h2>
<p>The elective needs an <strong>artifact</strong>: a small but real piece of automotive software you designed and built. Small and working beats big and broken.</p>
<h3>Example scopes (pick one, narrow it)</h3>
<ul>
<li>An AUTOSAR-style Software Component (SWC) that reads a CAN signal and applies a rule.</li>
<li>A Simulink model of a simple cruise controller with generated C code.</li>
<li>A lane-detection prototype on recorded video using OpenCV.</li>
<li>A TARA (threat analysis) plus a secure-boot proof-of-concept for one ECU feature.</li>
</ul>
<h3>Build discipline</h3>
<pre><code>Design    -&gt; a diagram + interface before code
Implement -&gt; small commits, meaningful messages (git)
Test      -&gt; at least one test proving it works
Measure   -&gt; record results honestly (even failures)
Document  -&gt; README: how to build &amp; run</code></pre>
<div class="callout"><span class="badge">Scope guard</span> If you can't demo it in 5 minutes, it's too big. Cut features until the core runs, then add back only if time allows.</div>`,
    `<span class="eyebrow">AS_GRA_ELE · Chương 6 · Bài 6.1</span>
<h2>Mini-project</h2>
<p>Học phần tự chọn cần một <strong>sản phẩm</strong>: một mẩu phần mềm ô tô nhỏ nhưng thật, do bạn thiết kế và dựng. Nhỏ mà chạy được hơn to mà hỏng.</p>
<h3>Ví dụ phạm vi (chọn một, thu hẹp lại)</h3>
<ul>
<li>Một Software Component (SWC) kiểu AUTOSAR đọc một tín hiệu CAN và áp một quy tắc.</li>
<li>Một mô hình Simulink của bộ điều khiển hành trình đơn giản, có sinh mã C.</li>
<li>Một prototype phát hiện làn đường trên video ghi sẵn bằng OpenCV.</li>
<li>Một TARA (phân tích mối đe doạ) kèm proof-of-concept secure-boot cho một tính năng ECU.</li>
</ul>
<h3>Kỷ luật khi làm</h3>
<pre><code>Thiết kế   -&gt; sơ đồ + giao diện trước khi viết mã
Hiện thực  -&gt; commit nhỏ, thông điệp có nghĩa (git)
Kiểm thử   -&gt; ít nhất một test chứng minh nó chạy
Đo lường   -&gt; ghi kết quả trung thực (kể cả thất bại)
Tài liệu   -&gt; README: cách build &amp; chạy</code></pre>
<div class="callout"><span class="badge">Giữ phạm vi</span> Nếu không demo được trong 5 phút thì nó quá to. Cắt tính năng đến khi phần lõi chạy, rồi mới thêm lại nếu còn thời gian.</div>`,
  ]]);

const c6q = quiz('as-gra-ele-quiz-6', 'Quiz 6 — Mini-project|||Quiz 6 — Mini-project', [
  { id: 'q1', question: 'Nguyên tắc quan trọng nhất khi định phạm vi mini-project?', options: ['Càng nhiều tính năng càng tốt', 'Nhỏ mà chạy được hơn to mà hỏng', 'Không cần kiểm thử', 'Không cần tài liệu'], correctIndex: 1, explanation: 'Một sản phẩm nhỏ nhưng chạy được và demo được có giá trị hơn một dự án lớn nhưng không hoàn thành.' },
  { id: 'q2', question: 'Trước khi viết mã, bước nên làm là gì?', options: ['Viết ngay càng nhiều mã càng tốt', 'Thiết kế: vẽ sơ đồ và định giao diện', 'Bỏ qua thiết kế', 'Xoá git để tránh rối'], correctIndex: 1, explanation: 'Thiết kế (sơ đồ + giao diện) trước giúp mã có cấu trúc và dễ kiểm thử hơn.' },
  { id: 'q3', question: 'Vì sao phải ghi kết quả trung thực, kể cả thất bại?', options: ['Để báo cáo đẹp hơn khi giấu lỗi', 'Vì tính chặt chẽ khoa học và tái lập là một phần điểm số', 'Vì thất bại không quan trọng', 'Để tăng số trang'], correctIndex: 1, explanation: 'Ghi trung thực cả thất bại thể hiện tính chặt chẽ, giúp người khác tái lập và học từ kết quả thật.' },
]);

const c7 = doc('as-gra-ele-7-1-report', '7.1 — Writing the report & documentation|||7.1 — Viết báo cáo & tài liệu hoá',
  'Cấu trúc báo cáo (tóm tắt, giới thiệu, phương pháp, kết quả, bàn luận, kết luận, tham khảo); văn phong kỹ thuật; danh sách kiểm trước khi nộp.',
  [[
    `<span class="eyebrow">AS_GRA_ELE · Chapter 7 · Lesson 7.1</span>
<h2>Writing the report &amp; documentation</h2>
<p>The report is how the examiner sees your work. Structure it like an engineering paper.</p>
<h3>Standard structure</h3>
<pre><code>1. Abstract      what &amp; why, in ~150 words
2. Introduction  problem, goals, scope
3. Background     the standard/topic, cited
4. Method        design + tools + how you built it
5. Results        what it does, measured
6. Discussion     limits, what you'd do next
7. Conclusion     did you meet the goals?
8. References     every source, consistent style</code></pre>
<h3>Technical writing</h3>
<ul>
<li>Short sentences; one idea each. Define acronyms on first use.</li>
<li>Every figure/table is referenced and captioned.</li>
<li>Claims carry citations; numbers carry units and sources.</li>
</ul>
<h3>Pre-submit checklist</h3>
<pre><code>[ ] All goals from the contract addressed
[ ] Every figure/table referenced in text
[ ] References complete &amp; consistent
[ ] Code repo link + build instructions
[ ] Proofread; no fabricated metrics</code></pre>
<div class="callout"><span class="badge">Honesty</span> State limitations openly. Examiners reward an honest "this didn't work and here's why" over a polished claim you can't defend.</div>`,
    `<span class="eyebrow">AS_GRA_ELE · Chương 7 · Bài 7.1</span>
<h2>Viết báo cáo &amp; tài liệu hoá</h2>
<p>Báo cáo là cách người chấm nhìn thấy công việc của bạn. Hãy dựng nó như một bài báo kỹ thuật.</p>
<h3>Cấu trúc chuẩn</h3>
<pre><code>1. Tóm tắt      cái gì &amp; vì sao, ~150 từ
2. Giới thiệu   vấn đề, mục tiêu, phạm vi
3. Nền tảng     chuẩn/chủ đề, có trích dẫn
4. Phương pháp  thiết kế + công cụ + cách dựng
5. Kết quả      nó làm được gì, có đo
6. Bàn luận     hạn chế, hướng tiếp theo
7. Kết luận     có đạt mục tiêu không?
8. Tham khảo    mọi nguồn, thống nhất một kiểu</code></pre>
<h3>Văn phong kỹ thuật</h3>
<ul>
<li>Câu ngắn; mỗi câu một ý. Định nghĩa từ viết tắt ở lần dùng đầu.</li>
<li>Mọi hình/bảng đều được dẫn trong văn bản và có chú thích.</li>
<li>Khẳng định phải có trích dẫn; con số phải có đơn vị và nguồn.</li>
</ul>
<h3>Danh sách kiểm trước khi nộp</h3>
<pre><code>[ ] Đủ mọi mục tiêu trong contract
[ ] Mọi hình/bảng được dẫn trong văn bản
[ ] Tham khảo đầy đủ &amp; thống nhất
[ ] Link repo mã + hướng dẫn build
[ ] Đọc soát; không có số liệu bịa</code></pre>
<div class="callout"><span class="badge">Trung thực</span> Nêu hạn chế thẳng thắn. Người chấm đánh giá cao một câu trung thực "chỗ này chưa chạy và đây là lý do" hơn một khẳng định bóng bẩy bạn không bảo vệ được.</div>`,
  ]]);

const c7q = quiz('as-gra-ele-quiz-7', 'Quiz 7 — Report|||Quiz 7 — Báo cáo', [
  { id: 'q1', question: 'Phần "Bàn luận" (Discussion) trong báo cáo dùng để làm gì?', options: ['Liệt kê lại toàn bộ mã nguồn', 'Nêu hạn chế và hướng phát triển tiếp theo', 'Chép lại phần giới thiệu', 'Thay cho phần tham khảo'], correctIndex: 1, explanation: 'Bàn luận nêu ý nghĩa kết quả, hạn chế và những gì có thể làm tiếp theo.' },
  { id: 'q2', question: 'Cách xử lý đúng với một con số trong báo cáo?', options: ['Ghi số mà không cần nguồn', 'Luôn kèm đơn vị và trích dẫn nguồn', 'Bịa số cho đẹp', 'Chỉ ghi số nếu là số tròn'], correctIndex: 1, explanation: 'Mọi con số phải có đơn vị và nguồn; số không nguồn là nguy cơ bịa đặt.' },
  { id: 'q3', question: 'Người chấm thường đánh giá cao điều gì hơn?', options: ['Một khẳng định bóng bẩy không bảo vệ được', 'Một câu trung thực nêu rõ hạn chế và lý do', 'Báo cáo dài nhất', 'Giấu hết mọi lỗi'], correctIndex: 1, explanation: 'Trung thực nêu hạn chế thể hiện tư duy kỹ thuật chín chắn và được đánh giá cao hơn.' },
]);

const c8 = doc('as-gra-ele-8-1-defense-career', '8.1 — Presenting, defending & career direction|||8.1 — Trình bày, phản biện & định hướng nghề',
  'Chuẩn bị thuyết trình & demo; trả lời câu hỏi phản biện; chứng chỉ ngành (AUTOSAR, ISO, Coursera) & định hướng nghề phần mềm ô tô.',
  [[
    `<span class="eyebrow">AS_GRA_ELE · Chapter 8 · Lesson 8.1</span>
<h2>Presenting, defending &amp; career direction</h2>
<h3>The presentation</h3>
<ul>
<li>Tell a story: problem → what you did → result → what you learned.</li>
<li>Show a <strong>live demo</strong> (or a recorded fallback if hardware is flaky).</li>
<li>Keep slides light; you are the explanation, not the text.</li>
</ul>
<h3>Handling the defense</h3>
<ul>
<li>Answer the question asked; if you don't know, say so and reason aloud.</li>
<li>Know your limitations before they ask — you raised them in Discussion.</li>
<li>Defend design choices with the trade-offs you considered.</li>
</ul>
<h3>Certifications &amp; career direction</h3>
<pre><code>Topic mastered        Next credential / step
--------------------  ----------------------------
AUTOSAR               vendor training (Vector, EB)
Functional safety     ISO 26262 practitioner course
Cybersecurity         ISO/SAE 21434 training
ADAS / autonomous     Coursera Self-Driving Cars
Model-based design    MathWorks Simulink certification</code></pre>
<div class="callout"><span class="badge">Beyond the grade</span> This elective is a portfolio piece. A clean repo, an honest report and a topic that matches a real job are what you show a recruiter — the grade is secondary.</div>`,
    `<span class="eyebrow">AS_GRA_ELE · Chương 8 · Bài 8.1</span>
<h2>Trình bày, phản biện &amp; định hướng nghề</h2>
<h3>Thuyết trình</h3>
<ul>
<li>Kể một câu chuyện: vấn đề → bạn làm gì → kết quả → học được gì.</li>
<li>Trình <strong>demo trực tiếp</strong> (hoặc bản ghi dự phòng nếu phần cứng chập chờn).</li>
<li>Slide gọn; bạn là phần giải thích, không phải chữ trên slide.</li>
</ul>
<h3>Ứng phó phản biện</h3>
<ul>
<li>Trả lời đúng câu được hỏi; nếu chưa biết, hãy nói thẳng và suy luận thành tiếng.</li>
<li>Biết hạn chế của mình trước khi bị hỏi — bạn đã nêu ở phần Bàn luận.</li>
<li>Bảo vệ lựa chọn thiết kế bằng các đánh đổi bạn đã cân nhắc.</li>
</ul>
<h3>Chứng chỉ &amp; định hướng nghề</h3>
<pre><code>Chủ đề đã làm chủ     Chứng chỉ / bước tiếp
--------------------  ----------------------------
AUTOSAR               đào tạo hãng (Vector, EB)
An toàn chức năng     khoá ISO 26262 practitioner
An ninh mạng          đào tạo ISO/SAE 21434
ADAS / tự hành        Coursera Self-Driving Cars
Model-based design    chứng chỉ Simulink MathWorks</code></pre>
<div class="callout"><span class="badge">Ngoài điểm số</span> Học phần này là một sản phẩm cho portfolio. Một repo sạch, báo cáo trung thực và chủ đề khớp với công việc thật mới là thứ bạn khoe với nhà tuyển dụng — điểm số chỉ là thứ yếu.</div>`,
  ]]);

const c8q = quiz('as-gra-ele-quiz-8', 'Quiz 8 — Defense & career|||Quiz 8 — Phản biện & nghề', [
  { id: 'q1', question: 'Khi bị hỏi một câu bạn chưa biết trong phản biện, nên làm gì?', options: ['Bịa một câu trả lời nghe hợp lý', 'Nói thẳng chưa biết và suy luận thành tiếng', 'Im lặng bỏ qua', 'Đổ lỗi cho công cụ'], correctIndex: 1, explanation: 'Trung thực nói chưa biết rồi suy luận thể hiện tư duy kỹ thuật, tốt hơn bịa câu trả lời không bảo vệ được.' },
  { id: 'q2', question: 'Vì sao nên chuẩn bị một bản demo ghi sẵn dự phòng?', options: ['Vì demo trực tiếp bị cấm', 'Phòng khi phần cứng/mạng chập chờn lúc trình bày', 'Để không phải demo trực tiếp bao giờ', 'Không có lý do'], correctIndex: 1, explanation: 'Phần cứng hoặc môi trường có thể trục trặc lúc trình bày; bản ghi dự phòng giúp buổi bảo vệ không đổ vỡ.' },
  { id: 'q3', question: 'Nếu bạn làm chủ đề AUTOSAR, bước chứng chỉ/định hướng tiếp theo hợp lý là?', options: ['Khoá đào tạo hãng như Vector hoặc EB', 'Chứng chỉ nấu ăn', 'Bỏ hẳn ngành ô tô', 'Không cần học thêm gì'], correctIndex: 0, explanation: 'Sau khi làm chủ AUTOSAR, các khoá đào tạo của hãng như Vector hay Elektrobit là bước tiến nghề tự nhiên.' },
]);

export default {
  semester: { code: 'FPTU_Hola9', name: 'Kỳ 9', ordinal: 11 },
  course: {
    courseCode: 'AS_GRA_ELE',
    slug: 'as-gra-ele-graduation-elective-for-automotive-software-engin',
    title: 'Graduation Elective for Automotive Software Engineering',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/AS_GRA_ELE.webp',
    shortDescription: 'A graduation elective: how to choose & self-study one advanced automotive-software topic (AUTOSAR, ADAS, ISO 26262/21434, model-based design) and ship a mini-project — learning contract, report & defense.|||Học phần tự chọn tốt nghiệp: cách chọn & tự học một chủ đề phần mềm ô tô nâng cao (AUTOSAR, ADAS, ISO 26262/21434, model-based design) và làm mini-project — learning contract, báo cáo & phản biện.',
    description: 'Môn <strong>AS_GRA_ELE — Graduation Elective for Automotive Software Engineering</strong> (Kỳ 9, ngành Kỹ thuật phần mềm ô tô) là một <strong>học phần tự chọn tốt nghiệp</strong>: không có nội dung cố định. Khung này hướng dẫn bạn <strong>chọn &amp; tự học một chủ đề nâng cao</strong> (AUTOSAR Classic/Adaptive, ADAS/tự hành, an toàn chức năng ISO 26262, an ninh mạng ISO 21434, V2X, RTOS nhúng, model-based design) và làm một <strong>mini-project</strong>. Bám quy trình học thuật: chọn chủ đề → learning contract → công cụ (CANoe, MATLAB/Simulink, HIL) → nghiên cứu sâu → mini-project → báo cáo → trình bày &amp; phản biện. Song ngữ, mỗi chương có quiz.',
    whatYouLearn: 'Học phần tự chọn tốt nghiệp là gì &amp; cách chọn chủ đề theo định hướng nghề; bản đồ chủ đề phần mềm ô tô nâng cao; công cụ &amp; môi trường (CANoe, MATLAB/Simulink, MIL/SIL/PIL/HIL); phương pháp tự học &amp; learning contract; nghiên cứu chuyên sâu có trích dẫn; thiết kế &amp; hiện thực một mini-project; viết báo cáo kỹ thuật; trình bày, phản biện &amp; định hướng nghề/chứng chỉ.',
    requirements: 'Đã học nền phần mềm &amp; nhúng của ngành. Nên biết một ngôn ngữ (C/C++/Python) và git. Xem điều kiện tiên quyết trong khung chương trình ngành trên FLM (flm.fpt.edu.vn).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Chuẩn AUTOSAR & ISO, công cụ Vector/MathWorks, khoá online, quy định FPTU.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Học phần tự chọn tốt nghiệp, deliverable, rubric.', lessons: [intro] },
    { title: 'Chương 1 — Tự chọn & cách chọn|||Chapter 1 — Elective & choosing', description: 'Học phần tự chọn là gì, chọn theo nghề.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Bản đồ chủ đề|||Chapter 2 — Topic map', description: 'AUTOSAR, ADAS, 26262/21434, RTOS, model-based.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Công cụ & môi trường|||Chapter 3 — Tools & environment', description: 'CANoe, MATLAB/Simulink, HIL.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Tự học & learning contract|||Chapter 4 — Self-study & contract', description: 'SMART, nhật ký học, learning contract.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Nghiên cứu chuyên sâu|||Chapter 5 — Deep research', description: 'Đọc chuẩn gốc, literature review, trích dẫn.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Mini-project|||Chapter 6 — Mini-project', description: 'Thiết kế & hiện thực module phần mềm ô tô.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Báo cáo & tài liệu hoá|||Chapter 7 — Report & docs', description: 'Cấu trúc báo cáo, văn phong, checklist.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Phản biện & định hướng nghề|||Chapter 8 — Defense & career', description: 'Thuyết trình, phản biện, chứng chỉ, nghề.', lessons: [c8, c8q] },
  ],
};
