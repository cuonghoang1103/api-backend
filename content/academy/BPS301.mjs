/**
 * BPS301 — Business Process Management System (Hệ thống quản lý quy trình
 * nghiệp vụ / BPM). Ngành Hệ thống thông tin FPTU, Kỳ 8. Khung chất lượng,
 * song ngữ VI+EN, 8 chương — bám giáo trình chuẩn: Dumas et al "Fundamentals
 * of Business Process Management", BPMN 2.0 spec (OMG), Weske "Business
 * Process Management"; công cụ Camunda/Bizagi. Mỗi chương: 1 DOCUMENT +
 * 1 QUIZ 3 câu. Giữ NGUYÊN slug/semester/thumb/courseCode.
 * ⚠️ KHÔNG backtick lồng/${...} trong HTML; "&"→"&amp;" trong content HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('bps301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn (Dumas, Weske), BPMN 2.0 spec, công cụ (Camunda, Bizagi), YouTube, lộ trình tự học.',
  [[
    `<span class="eyebrow">BPS301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Business Process Management</strong> — the BPM lifecycle, BPMN 2.0 modeling, analysis, redesign, automation and governance — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for BPS301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://fundamentals-of-bpm.org/" target="_blank" rel="noopener"><em>Fundamentals of Business Process Management</em> — Dumas, La Rosa, Mendling &amp; Reijers</a> (the standard text)</li>
<li><a href="https://link.springer.com/book/10.1007/978-3-642-28616-2" target="_blank" rel="noopener"><em>Business Process Management: Concepts, Languages, Architectures</em> — Mathias Weske</a></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.omg.org/spec/BPMN/2.0/" target="_blank" rel="noopener">BPMN 2.0 specification (OMG)</a> — the modeling standard itself</li>
<li><a href="https://www.bpmn.org/" target="_blank" rel="noopener">BPMN.org</a> — quick reference &amp; examples</li>
<li><a href="https://camunda.com/bpmn/reference/" target="_blank" rel="noopener">Camunda BPMN reference</a></li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://demo.bpmn.io/" target="_blank" rel="noopener">bpmn.io</a> — free browser BPMN modeler</li>
<li><a href="https://camunda.com/" target="_blank" rel="noopener">Camunda</a> — open-source process engine (BPMS)</li>
<li><a href="https://www.bizagi.com/en/platform/modeler" target="_blank" rel="noopener">Bizagi Modeler</a> — free BPMN modeling tool</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — what a business process is, the BPM lifecycle, process thinking.</li>
<li><strong>Model</strong> — learn BPMN 2.0 on bpmn.io until you can draw an order-to-cash process from memory.</li>
<li><strong>Analyze &amp; redesign</strong> — find bottlenecks, cut waste with redesign heuristics.</li>
<li><strong>Automate &amp; run</strong> — deploy a model to Camunda, monitor KPIs, and mine the event log.</li>
</ol></div>`,
    `<span class="eyebrow">BPS301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Quản lý quy trình nghiệp vụ</strong> — vòng đời BPM, mô hình hoá BPMN 2.0, phân tích, tái thiết kế, tự động hoá và quản trị — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của BPS301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://fundamentals-of-bpm.org/" target="_blank" rel="noopener"><em>Fundamentals of Business Process Management</em> — Dumas, La Rosa, Mendling &amp; Reijers</a> (sách chuẩn của môn)</li>
<li><a href="https://link.springer.com/book/10.1007/978-3-642-28616-2" target="_blank" rel="noopener"><em>Business Process Management: Concepts, Languages, Architectures</em> — Mathias Weske</a></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.omg.org/spec/BPMN/2.0/" target="_blank" rel="noopener">Đặc tả BPMN 2.0 (OMG)</a> — bản thân chuẩn mô hình hoá</li>
<li><a href="https://www.bpmn.org/" target="_blank" rel="noopener">BPMN.org</a> — tra cứu nhanh &amp; ví dụ</li>
<li><a href="https://camunda.com/bpmn/reference/" target="_blank" rel="noopener">Tài liệu BPMN của Camunda</a></li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://demo.bpmn.io/" target="_blank" rel="noopener">bpmn.io</a> — trình vẽ BPMN miễn phí trên trình duyệt</li>
<li><a href="https://camunda.com/" target="_blank" rel="noopener">Camunda</a> — máy chạy quy trình mã nguồn mở (BPMS)</li>
<li><a href="https://www.bizagi.com/en/platform/modeler" target="_blank" rel="noopener">Bizagi Modeler</a> — công cụ mô hình hoá BPMN miễn phí</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — quy trình nghiệp vụ là gì, vòng đời BPM, tư duy quy trình.</li>
<li><strong>Mô hình hoá</strong> — học BPMN 2.0 trên bpmn.io đến khi vẽ được quy trình đặt-hàng-tới-thu-tiền từ trí nhớ.</li>
<li><strong>Phân tích &amp; tái thiết kế</strong> — tìm điểm nghẽn, cắt lãng phí bằng heuristics tái thiết kế.</li>
<li><strong>Tự động hoá &amp; vận hành</strong> — triển khai mô hình lên Camunda, giám sát KPI, và khai phá nhật ký sự kiện.</li>
</ol></div>`,
  ]]);

const intro = doc('bps301-0-1-overview', 'Course overview: Business Process Management|||Tổng quan: Quản lý quy trình nghiệp vụ',
  'BPM làm gì; quy trình nghiệp vụ là gì; vì sao doanh nghiệp quản lý quy trình; lộ trình 4 bước: hiểu & mô hình hoá → phân tích & tái thiết kế → tự động hoá → thực thi, giám sát & quản trị.',
  [[
    `<span class="eyebrow">BPS301 · Lesson 0.1 · Overview</span>
<h2>Business Process Management</h2>
<p class="lead">This course teaches you to see an organization as a set of <strong>business processes</strong> — chains of activities that turn inputs into outputs a customer values — and to <strong>manage, model, analyze, redesign and automate</strong> them. It follows the standard text, <em>Fundamentals of Business Process Management</em> (Dumas et al.), and the <strong>BPMN 2.0</strong> modeling standard.</p>
<h3>What is a business process?</h3>
<p>A <strong>business process</strong> is a set of related activities, events and decisions, performed by people and systems, that together deliver a product or service to a customer. Classic examples: <strong>order-to-cash</strong>, <strong>procure-to-pay</strong>, and <strong>issue-to-resolution</strong>. BPM is the discipline of running these processes well — cheaper, faster, and with fewer errors.</p>
<h3>Roadmap</h3>
<p>The course walks the <strong>BPM lifecycle</strong> in four moves: understand &amp; model processes (BPMN 2.0) → analyze &amp; redesign them → automate with a process engine (BPMS/RPA) → execute, monitor (KPIs, process mining) and govern for continuous improvement.</p>
<div class="callout"><span class="badge">Big idea</span> Value is created in processes that cross departments. Improve the process, not just the department, and the whole organization gets better.</div>`,
    `<span class="eyebrow">BPS301 · Bài 0.1 · Tổng quan</span>
<h2>Quản lý quy trình nghiệp vụ</h2>
<p class="lead">Môn này dạy bạn nhìn một tổ chức như một tập các <strong>quy trình nghiệp vụ</strong> — chuỗi hoạt động biến đầu vào thành đầu ra mà khách hàng coi trọng — và biết <strong>quản lý, mô hình hoá, phân tích, tái thiết kế và tự động hoá</strong> chúng. Môn bám sách chuẩn <em>Fundamentals of Business Process Management</em> (Dumas et al.) và chuẩn mô hình hoá <strong>BPMN 2.0</strong>.</p>
<h3>Quy trình nghiệp vụ là gì?</h3>
<p>Một <strong>quy trình nghiệp vụ</strong> là tập các hoạt động, sự kiện và quyết định liên quan, do người và hệ thống thực hiện, cùng nhau tạo ra một sản phẩm hoặc dịch vụ cho khách hàng. Ví dụ kinh điển: <strong>đặt-hàng-tới-thu-tiền</strong> (order-to-cash), <strong>mua-sắm-tới-thanh-toán</strong> (procure-to-pay), và <strong>sự-cố-tới-giải-quyết</strong>. BPM là bộ môn vận hành các quy trình này cho tốt — rẻ hơn, nhanh hơn, ít lỗi hơn.</p>
<h3>Lộ trình</h3>
<p>Môn đi theo <strong>vòng đời BPM</strong> qua bốn bước: hiểu &amp; mô hình hoá quy trình (BPMN 2.0) → phân tích &amp; tái thiết kế → tự động hoá bằng máy chạy quy trình (BPMS/RPA) → thực thi, giám sát (KPI, process mining) và quản trị để cải tiến liên tục.</p>
<div class="callout"><span class="badge">Ý tưởng lớn</span> Giá trị được tạo ra ở các quy trình chạy XUYÊN qua nhiều phòng ban. Hãy cải thiện quy trình, đừng chỉ cải thiện từng phòng, thì cả tổ chức mới tốt lên.</div>`,
  ]]);

const c1 = doc('bps301-1-1-what-is-bpm', '1.1 — What is BPM: process, lifecycle & value|||1.1 — BPM là gì: quy trình, vòng đời & giá trị',
  'Quy trình nghiệp vụ (định nghĩa, thành phần); vòng đời BPM (identification, discovery, analysis, redesign, implementation, monitoring); tư duy quy trình; giá trị BPM.',
  [[
    `<span class="eyebrow">BPS301 · Chapter 1 · Lesson 1.1</span>
<h2>What is BPM: process, lifecycle &amp; value</h2>
<h3>Anatomy of a process</h3>
<p>A business process is built from <strong>events</strong> (something happens), <strong>activities</strong> (work is done), <strong>decisions</strong> (the path branches), plus the <strong>actors</strong>, <strong>objects</strong> and <strong>outcomes</strong> involved. It starts with a trigger and ends in a result — ideally one of value to a customer.</p>
<h3>The BPM lifecycle</h3>
<pre><code>1. Identification -> which processes exist &amp; which matter most
2. Discovery      -> model the AS-IS (current) process
3. Analysis       -> find issues, quantify their impact
4. Redesign       -> design the improved TO-BE process
5. Implementation -> change the org &amp; the IT (automation)
6. Monitoring     -> measure, and loop back to analysis
</code></pre>
<h3>Process thinking &amp; value</h3>
<p><strong>Process thinking</strong> means managing the end-to-end flow of work across silos, not optimizing each department alone. The payoff of good BPM: shorter <strong>cycle time</strong>, lower <strong>cost</strong>, higher <strong>quality</strong>, and greater <strong>flexibility</strong> — often summarized as the "Devil's Quadrangle" of trade-offs.</p>
<div class="callout"><span class="badge">Why it matters</span> You cannot improve what you cannot see. BPM makes invisible cross-department work visible as a model you can measure and change.</div>`,
    `<span class="eyebrow">BPS301 · Chương 1 · Bài 1.1</span>
<h2>BPM là gì: quy trình, vòng đời &amp; giá trị</h2>
<h3>Giải phẫu một quy trình</h3>
<p>Một quy trình nghiệp vụ được dựng từ <strong>sự kiện</strong> (điều gì đó xảy ra), <strong>hoạt động</strong> (công việc được làm), <strong>quyết định</strong> (đường rẽ nhánh), cùng các <strong>tác nhân</strong>, <strong>đối tượng</strong> và <strong>kết quả</strong> liên quan. Nó bắt đầu bằng một kích hoạt và kết thúc bằng một kết quả — lý tưởng là kết quả có giá trị với khách hàng.</p>
<h3>Vòng đời BPM</h3>
<pre><code>1. Nhận diện     -> có những quy trình nào &amp; cái nào quan trọng nhất
2. Khám phá      -> mô hình hoá quy trình HIỆN TẠI (AS-IS)
3. Phân tích     -> tìm vấn đề, định lượng tác động
4. Tái thiết kế  -> thiết kế quy trình cải tiến (TO-BE)
5. Triển khai    -> thay đổi tổ chức &amp; hệ thống CNTT (tự động hoá)
6. Giám sát      -> đo lường, rồi quay lại bước phân tích
</code></pre>
<h3>Tư duy quy trình &amp; giá trị</h3>
<p><strong>Tư duy quy trình</strong> nghĩa là quản lý dòng công việc từ đầu tới cuối XUYÊN qua các "ốc đảo" phòng ban, chứ không tối ưu riêng từng phòng. Lợi ích của BPM tốt: <strong>thời gian chu trình</strong> ngắn hơn, <strong>chi phí</strong> thấp hơn, <strong>chất lượng</strong> cao hơn, và <strong>linh hoạt</strong> hơn — thường gọi là "Tứ giác Quỷ" (Devil's Quadrangle) của các đánh đổi.</p>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Không thể cải thiện thứ mình không thấy. BPM biến công việc xuyên-phòng vô hình thành một mô hình đo được và sửa được.</div>`,
  ]]);

const c1q = quiz('bps301-quiz-1', 'Quiz 1 — What is BPM|||Quiz 1 — BPM là gì', [
  { id: 'q1', question: 'Quy trình nghiệp vụ (business process) là?', options: ['Một phòng ban trong công ty', 'Tập hoạt động/sự kiện/quyết định tạo ra sản phẩm/dịch vụ cho khách hàng', 'Một phần mềm ERP', 'Sơ đồ tổ chức'], correctIndex: 1, explanation: 'Quy trình = chuỗi hoạt động biến đầu vào thành đầu ra có giá trị cho khách hàng.' },
  { id: 'q2', question: 'Thứ tự đúng trong vòng đời BPM là?', options: ['Redesign → Discovery → Analysis', 'Identification → Discovery → Analysis → Redesign → Implementation → Monitoring', 'Monitoring → Redesign → Discovery', 'Implementation → Identification → Analysis'], correctIndex: 1, explanation: 'Vòng đời: nhận diện → khám phá → phân tích → tái thiết kế → triển khai → giám sát (rồi lặp).' },
  { id: 'q3', question: 'Bốn khía cạnh của "Devil’s Quadrangle" là?', options: ['Người, máy, tiền, đất', 'Thời gian, chi phí, chất lượng, linh hoạt', 'Vào, ra, lưu, xoá', 'Base, Collector, Emitter, Gate'], correctIndex: 1, explanation: 'Tứ giác đánh đổi: cycle time, cost, quality, flexibility.' },
]);

const c2 = doc('bps301-2-1-identification-bpmn-basics', '2.1 — Process identification & BPMN 2.0 basics|||2.1 — Nhận diện & BPMN 2.0 cơ bản',
  'Process identification (kiến trúc quy trình, tiêu chí chọn quy trình); BPMN 2.0 cơ bản: event (start/end), activity (task), gateway (XOR/AND), sequence flow.',
  [[
    `<span class="eyebrow">BPS301 · Chapter 2 · Lesson 2.1</span>
<h2>Process identification &amp; BPMN 2.0 basics</h2>
<h3>Process identification</h3>
<p>Before modeling, you decide <em>which</em> processes to work on. <strong>Identification</strong> builds a <strong>process architecture</strong> (a map of the organization's processes) and then <strong>prioritizes</strong> them — usually by importance to strategy, health (how broken they are), and feasibility of change.</p>
<h3>The four core BPMN elements</h3>
<ul>
<li><strong>Event</strong> — something that happens; drawn as a circle. A <strong>start event</strong> triggers the process, an <strong>end event</strong> closes it.</li>
<li><strong>Activity</strong> — a unit of work (a <strong>task</strong>); drawn as a rounded rectangle, e.g. "Check stock".</li>
<li><strong>Gateway</strong> — a diamond that splits or merges the flow. <strong>XOR</strong> = exactly one path (a decision); <strong>AND</strong> = all paths in parallel.</li>
<li><strong>Sequence flow</strong> — a solid arrow showing the order of execution.</li>
</ul>
<pre><code>Order handling (text BPMN):
 (start) --> [Check stock] --> &lt;XOR in stock?&gt;
    yes --> [Ship order] ------------------\
    no  --> [Back-order] --> [Ship order] --&gt; (end)
</code></pre>
<div class="callout"><span class="badge">Read a model in one sentence</span> "When an order arrives, we check stock; if in stock we ship, otherwise we back-order then ship." A good BPMN diagram reads like that.</div>`,
    `<span class="eyebrow">BPS301 · Chương 2 · Bài 2.1</span>
<h2>Nhận diện quy trình &amp; BPMN 2.0 cơ bản</h2>
<h3>Nhận diện quy trình</h3>
<p>Trước khi mô hình hoá, bạn quyết định làm <em>quy trình nào</em>. <strong>Nhận diện</strong> dựng một <strong>kiến trúc quy trình</strong> (bản đồ các quy trình của tổ chức) rồi <strong>xếp ưu tiên</strong> — thường theo tầm quan trọng với chiến lược, tình trạng (đang hỏng tới đâu), và tính khả thi khi thay đổi.</p>
<h3>Bốn phần tử BPMN cốt lõi</h3>
<ul>
<li><strong>Sự kiện (Event)</strong> — điều gì đó xảy ra; vẽ bằng hình tròn. <strong>Start event</strong> kích hoạt quy trình, <strong>end event</strong> kết thúc nó.</li>
<li><strong>Hoạt động (Activity)</strong> — một đơn vị công việc (một <strong>task</strong>); vẽ bằng chữ nhật bo góc, vd "Kiểm tồn kho".</li>
<li><strong>Cổng (Gateway)</strong> — hình thoi để tách hoặc gộp dòng. <strong>XOR</strong> = đúng một đường (một quyết định); <strong>AND</strong> = tất cả các đường song song.</li>
<li><strong>Luồng tuần tự (Sequence flow)</strong> — mũi tên liền thể hiện thứ tự thực thi.</li>
</ul>
<pre><code>Xử lý đơn hàng (BPMN dạng chữ):
 (start) --> [Kiểm tồn kho] --> &lt;XOR còn hàng?&gt;
    có     --> [Giao hàng] --------------------\
    không  --> [Đặt hàng bù] --> [Giao hàng] --&gt; (end)
</code></pre>
<div class="callout"><span class="badge">Đọc mô hình trong một câu</span> "Khi đơn tới, ta kiểm tồn; còn hàng thì giao, không thì đặt bù rồi giao." Một sơ đồ BPMN tốt đọc lên đúng như vậy.</div>`,
  ]]);

const c2q = quiz('bps301-quiz-2', 'Quiz 2 — Identification & BPMN basics|||Quiz 2 — Nhận diện & BPMN cơ bản', [
  { id: 'q1', question: 'Trong BPMN, hình thoi (gateway) dùng để?', options: ['Biểu diễn một hoạt động', 'Tách/gộp dòng theo quyết định hoặc song song', 'Bắt đầu quy trình', 'Lưu dữ liệu'], correctIndex: 1, explanation: 'Gateway tách/gộp dòng; XOR = một đường, AND = song song.' },
  { id: 'q2', question: 'Một "start event" trong BPMN được vẽ là?', options: ['Hình chữ nhật bo góc', 'Hình thoi', 'Hình tròn', 'Mũi tên đứt'], correctIndex: 2, explanation: 'Event vẽ bằng hình tròn; start event là vòng tròn mảnh kích hoạt quy trình.' },
  { id: 'q3', question: 'Mục tiêu của bước "process identification" là?', options: ['Viết mã tự động hoá', 'Dựng kiến trúc quy trình và xếp ưu tiên quy trình để làm', 'Đo cycle time', 'Chạy engine BPMS'], correctIndex: 1, explanation: 'Identification lập bản đồ quy trình và chọn/ưu tiên quy trình đáng làm.' },
]);

const c3 = doc('bps301-3-1-advanced-modeling', '3.1 — Advanced modeling: pools, lanes, subprocess & exceptions|||3.1 — Mô hình hoá nâng cao: pool, lane, subprocess & ngoại lệ',
  'BPMN nâng cao: pool & lane (ai làm gì, message flow); subprocess (gói con, tái sử dụng); xử lý ngoại lệ (boundary event, error, timer); message vs sequence flow.',
  [[
    `<span class="eyebrow">BPS301 · Chapter 3 · Lesson 3.1</span>
<h2>Advanced modeling: pools, lanes, subprocess &amp; exceptions</h2>
<h3>Pools &amp; lanes — who does what</h3>
<p>A <strong>pool</strong> represents a participant (an organization, e.g. "Seller" vs "Customer"). Inside a pool, <strong>lanes</strong> split work by role or department (e.g. "Warehouse", "Finance"). Messages between pools use a <strong>message flow</strong> (dashed arrow); work inside one pool uses <strong>sequence flow</strong> (solid arrow) — never mix them up.</p>
<h3>Subprocess — hide detail, reuse work</h3>
<p>A <strong>subprocess</strong> is an activity that contains its own smaller process. Collapsed, it shows one box with a "+"; expanded, it shows the detail. It tames big diagrams and lets you <strong>reuse</strong> a common flow (e.g. "Verify payment") in many processes.</p>
<h3>Exception handling</h3>
<p>Real processes fail. A <strong>boundary event</strong> attached to an activity catches a problem and diverts the flow — an <strong>error event</strong> (something broke), a <strong>timer event</strong> (took too long), or a <strong>message event</strong> (a cancel arrived).</p>
<pre><code>[Reserve seat] --(timer: 10 min no payment)--> [Release seat] --&gt; (end)
[Charge card]  --(error: declined)-----------> [Notify customer]
</code></pre>
<div class="callout"><span class="badge">Model the sad path too</span> Beginners draw only the happy path. Mature models show what happens on timeouts, errors and cancellations — that is where real processes break.</div>`,
    `<span class="eyebrow">BPS301 · Chương 3 · Bài 3.1</span>
<h2>Mô hình hoá nâng cao: pool, lane, subprocess &amp; ngoại lệ</h2>
<h3>Pool &amp; lane — ai làm gì</h3>
<p>Một <strong>pool</strong> đại diện một bên tham gia (một tổ chức, vd "Người bán" vs "Khách hàng"). Trong một pool, các <strong>lane</strong> chia công việc theo vai trò hoặc phòng ban (vd "Kho", "Tài chính"). Trao đổi giữa các pool dùng <strong>message flow</strong> (mũi tên đứt); công việc trong cùng một pool dùng <strong>sequence flow</strong> (mũi tên liền) — đừng bao giờ nhầm hai loại này.</p>
<h3>Subprocess — giấu chi tiết, tái sử dụng</h3>
<p>Một <strong>subprocess</strong> là hoạt động chứa một quy trình nhỏ bên trong. Khi thu gọn, nó là một ô có dấu "+"; khi mở ra, nó hiện chi tiết. Nó thuần hoá sơ đồ lớn và cho phép <strong>tái sử dụng</strong> một luồng chung (vd "Xác minh thanh toán") ở nhiều quy trình.</p>
<h3>Xử lý ngoại lệ</h3>
<p>Quy trình thật thì có lúc hỏng. Một <strong>boundary event</strong> gắn vào một hoạt động bắt lấy sự cố và bẻ dòng đi hướng khác — <strong>error event</strong> (có thứ vỡ), <strong>timer event</strong> (quá lâu), hoặc <strong>message event</strong> (một lệnh huỷ tới).</p>
<pre><code>[Giữ chỗ ngồi] --(timer: 10 phút chưa trả tiền)--> [Trả chỗ lại] --&gt; (end)
[Trừ thẻ]      --(error: thẻ bị từ chối)---------> [Báo khách hàng]
</code></pre>
<div class="callout"><span class="badge">Vẽ cả đường buồn</span> Người mới chỉ vẽ đường vui (happy path). Mô hình trưởng thành thể hiện điều gì xảy ra khi quá hạn, lỗi và huỷ — đó mới là nơi quy trình thật vỡ.</div>`,
  ]]);

const c3q = quiz('bps301-quiz-3', 'Quiz 3 — Advanced modeling|||Quiz 3 — Mô hình hoá nâng cao', [
  { id: 'q1', question: 'Trao đổi giữa HAI pool khác nhau trong BPMN dùng?', options: ['Sequence flow (mũi tên liền)', 'Message flow (mũi tên đứt)', 'Gateway', 'Data store'], correctIndex: 1, explanation: 'Giữa các pool dùng message flow (đứt); trong một pool dùng sequence flow (liền).' },
  { id: 'q2', question: 'Subprocess (quy trình con) chủ yếu dùng để?', options: ['Xoá dữ liệu', 'Giấu chi tiết & tái sử dụng một luồng chung', 'Bắt đầu quy trình', 'Đo KPI'], correctIndex: 1, explanation: 'Subprocess gói chi tiết vào một ô và cho phép tái sử dụng luồng.' },
  { id: 'q3', question: 'Boundary event gắn vào một activity dùng để?', options: ['Tạo pool mới', 'Bắt ngoại lệ (lỗi/quá hạn/huỷ) và bẻ dòng', 'Gộp hai luồng song song', 'Lưu biến'], correctIndex: 1, explanation: 'Boundary event (error/timer/message) bắt sự cố và chuyển dòng sang nhánh xử lý.' },
]);

const c4 = doc('bps301-4-1-process-analysis', '4.1 — Process analysis: qualitative, quantitative & bottlenecks|||4.1 — Phân tích quy trình: định tính, định lượng & điểm nghẽn',
  'Phân tích định tính (value-added analysis, root cause, Pareto); định lượng (flow analysis: cycle time, waiting time, cycle time efficiency); bottleneck; mô phỏng.',
  [[
    `<span class="eyebrow">BPS301 · Chapter 4 · Lesson 4.1</span>
<h2>Process analysis: qualitative, quantitative &amp; bottlenecks</h2>
<h3>Qualitative analysis</h3>
<ul>
<li><strong>Value-added analysis</strong> — tag each step as value-adding (customer pays for it), business-value-adding (needed by the org), or <strong>waste</strong> (neither — remove it).</li>
<li><strong>Root-cause analysis</strong> — why-why (5 Whys) and cause-effect (fishbone) diagrams to find the real source of an issue.</li>
<li><strong>Pareto</strong> — 80% of the pain usually comes from 20% of the causes; fix those first.</li>
</ul>
<h3>Quantitative analysis</h3>
<p><strong>Cycle time</strong> is the total time from start to end. It splits into <strong>processing time</strong> (actual work) and <strong>waiting time</strong> (idle). The ratio tells you a lot:</p>
<pre><code>Cycle Time Efficiency = Processing time / Cycle time

 Example: process time 2 h, total cycle time 40 h
 CTE = 2 / 40 = 5%   -> 95% of the time the case just waits!
</code></pre>
<h3>Bottlenecks</h3>
<p>A <strong>bottleneck</strong> is the resource whose limited capacity caps the whole process throughput — work piles up in front of it. Find it (long queues, high utilization), and improving anything else barely helps.</p>
<div class="callout"><span class="badge">Measure before you change</span> Most cycle time is waiting, not working. Attack the queues and hand-offs, not the busy people.</div>`,
    `<span class="eyebrow">BPS301 · Chương 4 · Bài 4.1</span>
<h2>Phân tích quy trình: định tính, định lượng &amp; điểm nghẽn</h2>
<h3>Phân tích định tính</h3>
<ul>
<li><strong>Phân tích giá trị (value-added)</strong> — gắn nhãn mỗi bước: tạo giá trị (khách hàng trả tiền cho nó), tạo giá trị nghiệp vụ (tổ chức cần), hoặc <strong>lãng phí</strong> (không cái nào — hãy bỏ đi).</li>
<li><strong>Phân tích căn nguyên</strong> — hỏi why-why (5 Whys) và sơ đồ xương cá (nhân-quả) để tìm nguồn gốc thật của vấn đề.</li>
<li><strong>Pareto</strong> — 80% nỗi đau thường đến từ 20% nguyên nhân; sửa nhóm đó trước.</li>
</ul>
<h3>Phân tích định lượng</h3>
<p><strong>Cycle time</strong> (thời gian chu trình) là tổng thời gian từ đầu tới cuối. Nó tách thành <strong>thời gian xử lý</strong> (làm việc thật) và <strong>thời gian chờ</strong> (nằm không). Tỉ lệ giữa hai cái nói lên rất nhiều:</p>
<pre><code>Hiệu suất chu trình (CTE) = Thời gian xử lý / Cycle time

 Ví dụ: xử lý 2 giờ, tổng cycle time 40 giờ
 CTE = 2 / 40 = 5%   -> 95% thời gian hồ sơ chỉ nằm chờ!
</code></pre>
<h3>Điểm nghẽn (bottleneck)</h3>
<p>Một <strong>điểm nghẽn</strong> là nguồn lực có năng lực hạn chế khiến nó chặn thông lượng của cả quy trình — công việc dồn ứ phía trước nó. Tìm ra nó (hàng đợi dài, mức sử dụng cao); cải thiện chỗ khác gần như vô ích.</p>
<div class="callout"><span class="badge">Đo trước khi sửa</span> Phần lớn cycle time là CHỜ, không phải LÀM. Hãy tấn công hàng đợi và các điểm bàn giao, đừng tấn công người đang bận.</div>`,
  ]]);

const c4q = quiz('bps301-quiz-4', 'Quiz 4 — Process analysis|||Quiz 4 — Phân tích quy trình', [
  { id: 'q1', question: 'Cycle Time Efficiency (CTE) được tính bằng?', options: ['Cycle time / Processing time', 'Processing time / Cycle time', 'Waiting time × Cycle time', 'Số bước / cycle time'], correctIndex: 1, explanation: 'CTE = thời gian xử lý / tổng cycle time; càng thấp nghĩa là chờ càng nhiều.' },
  { id: 'q2', question: '"Bottleneck" (điểm nghẽn) là?', options: ['Bước tạo giá trị nhất', 'Nguồn lực có năng lực hạn chế chặn thông lượng cả quy trình', 'Sự kiện bắt đầu', 'Một loại gateway'], correctIndex: 1, explanation: 'Bottleneck giới hạn throughput; công việc dồn ứ trước nó.' },
  { id: 'q3', question: 'Trong value-added analysis, bước "không tạo giá trị cho khách lẫn tổ chức" nên?', options: ['Giữ nguyên', 'Loại bỏ (là lãng phí)', 'Nhân đôi', 'Chuyển thành gateway'], correctIndex: 1, explanation: 'Bước không tạo giá trị nào là lãng phí (waste) — nên loại bỏ.' },
]);

const c5 = doc('bps301-5-1-process-redesign', '5.1 — Process redesign: BPR, heuristics & optimization|||5.1 — Tái thiết kế quy trình: BPR, heuristics & tối ưu',
  'Tái thiết kế (từ AS-IS sang TO-BE); BPR (thiết kế lại triệt để) vs cải tiến từ từ; redesign heuristics (loại bước, gộp task, song song hoá, resequencing, triage); đánh đổi.',
  [[
    `<span class="eyebrow">BPS301 · Chapter 5 · Lesson 5.1</span>
<h2>Process redesign: BPR, heuristics &amp; optimization</h2>
<h3>Two philosophies</h3>
<p><strong>Business Process Reengineering (BPR)</strong> — radical, clean-slate redesign for a big leap. <strong>Continuous improvement</strong> — many small, steady changes. Most organizations blend the two, but any redesign moves the AS-IS model to an improved <strong>TO-BE</strong> model.</p>
<h3>Redesign heuristics</h3>
<ul>
<li><strong>Eliminate</strong> — remove non-value-adding steps, controls and hand-offs.</li>
<li><strong>Parallelize</strong> — run independent activities at the same time instead of in series (cuts cycle time).</li>
<li><strong>Resequence</strong> — do cheap "knock-out" checks first so you fail fast and stop working on doomed cases early.</li>
<li><strong>Triage</strong> — split one general task into fast/slow (or simple/complex) variants and route each to the right handler.</li>
<li><strong>Automate</strong> — hand repetitive rule-based work to software.</li>
</ul>
<h3>The trade-off</h3>
<p>Every redesign moves the <strong>Devil's Quadrangle</strong>: making a process faster may raise cost or lower flexibility. Redesign is choosing the trade-off on purpose, not by accident.</p>
<pre><code>Before: Check A --> Check B --> Check C   (serial, 3 waits)
After : Check A + Check B + Check C        (parallel, 1 wait)
        knock-out cheapest check FIRST     (fail fast)
</code></pre>
<div class="callout"><span class="badge">Rule of thumb</span> First eliminate, then parallelize, then automate — automating a wasteful step just makes waste faster.</div>`,
    `<span class="eyebrow">BPS301 · Chương 5 · Bài 5.1</span>
<h2>Tái thiết kế quy trình: BPR, heuristics &amp; tối ưu</h2>
<h3>Hai trường phái</h3>
<p><strong>Tái cấu trúc quy trình (BPR)</strong> — thiết kế lại triệt để, xoá bàn cờ làm lại, để nhảy vọt lớn. <strong>Cải tiến liên tục</strong> — nhiều thay đổi nhỏ, đều đặn. Đa số tổ chức trộn cả hai, nhưng mọi tái thiết kế đều đưa mô hình AS-IS sang mô hình <strong>TO-BE</strong> cải tiến.</p>
<h3>Heuristics tái thiết kế</h3>
<ul>
<li><strong>Loại bỏ (Eliminate)</strong> — bỏ các bước, kiểm soát, và điểm bàn giao không tạo giá trị.</li>
<li><strong>Song song hoá (Parallelize)</strong> — chạy các hoạt động độc lập cùng lúc thay vì nối tiếp (cắt cycle time).</li>
<li><strong>Sắp lại thứ tự (Resequence)</strong> — làm các kiểm tra "loại sớm" (knock-out) rẻ trước để thất bại nhanh, dừng xử lý sớm các hồ sơ chắc trượt.</li>
<li><strong>Phân loại (Triage)</strong> — tách một task chung thành biến thể nhanh/chậm (hoặc đơn giản/phức tạp) và định tuyến từng loại tới đúng người.</li>
<li><strong>Tự động hoá (Automate)</strong> — giao việc lặp lại theo quy tắc cho phần mềm.</li>
</ul>
<h3>Sự đánh đổi</h3>
<p>Mọi tái thiết kế đều làm dịch chuyển <strong>Tứ giác Quỷ</strong>: làm quy trình nhanh hơn có thể khiến chi phí tăng hoặc độ linh hoạt giảm. Tái thiết kế là chọn đánh đổi một cách CÓ CHỦ ĐÍCH, không phải tình cờ.</p>
<pre><code>Trước: Kiểm A --> Kiểm B --> Kiểm C   (nối tiếp, 3 lần chờ)
Sau  : Kiểm A + Kiểm B + Kiểm C        (song song, 1 lần chờ)
       loại-sớm kiểm rẻ nhất TRƯỚC     (thất bại nhanh)
</code></pre>
<div class="callout"><span class="badge">Quy tắc ngón tay cái</span> Loại bỏ trước, rồi song song hoá, rồi mới tự động hoá — tự động hoá một bước lãng phí chỉ làm cho lãng phí chạy nhanh hơn.</div>`,
  ]]);

const c5q = quiz('bps301-quiz-5', 'Quiz 5 — Process redesign|||Quiz 5 — Tái thiết kế quy trình', [
  { id: 'q1', question: 'BPR (Business Process Reengineering) đặc trưng bởi?', options: ['Nhiều thay đổi nhỏ đều đặn', 'Thiết kế lại triệt để để nhảy vọt lớn', 'Chỉ đổi giao diện', 'Không đổi quy trình'], correctIndex: 1, explanation: 'BPR là tái thiết kế triệt để (radical), khác cải tiến từ từ.' },
  { id: 'q2', question: 'Heuristic "parallelize" giúp cải thiện chủ yếu điều gì?', options: ['Tăng số bước', 'Giảm cycle time bằng cách chạy song song việc độc lập', 'Tăng chi phí', 'Xoá dữ liệu'], correctIndex: 1, explanation: 'Chạy song song các hoạt động độc lập rút ngắn thời gian chu trình.' },
  { id: 'q3', question: 'Theo quy tắc thứ tự tốt, ta nên làm gì trước khi tự động hoá?', options: ['Loại bỏ bước lãng phí', 'Thêm bước kiểm soát', 'Tăng hàng đợi', 'Bỏ đo lường'], correctIndex: 0, explanation: 'Loại bỏ trước rồi mới tự động hoá — tự động hoá lãng phí chỉ làm nó nhanh hơn.' },
]);

const c6 = doc('bps301-6-1-process-automation', '6.1 — Process automation: BPMS, workflow, RPA & orchestration|||6.1 — Tự động hoá quy trình: BPMS, workflow, RPA & điều phối',
  'Tự động hoá quy trình: BPMS/process engine (chạy mô hình BPMN thực thi được); workflow automation; RPA (bot bắt chước thao tác UI); orchestration vs choreography; khi nào dùng cái nào.',
  [[
    `<span class="eyebrow">BPS301 · Chapter 6 · Lesson 6.1</span>
<h2>Process automation: BPMS, workflow, RPA &amp; orchestration</h2>
<h3>The process engine (BPMS)</h3>
<p>A <strong>Business Process Management System (BPMS)</strong> — such as Camunda — takes an <strong>executable BPMN 2.0</strong> model and actually runs it: it creates a case, assigns human tasks to the right people, calls services, waits on timers, and remembers exactly where each case is. The model becomes the running software.</p>
<h3>Workflow automation vs RPA</h3>
<ul>
<li><strong>Workflow automation</strong> — the engine drives the flow through APIs and human task lists (the clean, structural way).</li>
<li><strong>RPA (Robotic Process Automation)</strong> — a <strong>bot</strong> imitates a human clicking a UI, used to bridge legacy systems that have no API. Fast to deploy, but brittle when the screen changes.</li>
</ul>
<h3>Orchestration vs choreography</h3>
<p><strong>Orchestration</strong> — one central engine conducts all the steps (like a conductor). <strong>Choreography</strong> — services react to each other's events with no central boss (like dancers). Orchestration is easier to monitor; choreography scales looser coupling.</p>
<pre><code>[Order received] --engine--> call PaymentService (API)
                          --> create human task "Approve"
                          --> call ShippingService (API)   -> (end)
   legacy CRM with no API? -> RPA bot types into its screen
</code></pre>
<div class="callout"><span class="badge">Automate the model, not a copy</span> With a BPMS the diagram IS the executable — no gap between the picture analysts drew and the code that runs.</div>`,
    `<span class="eyebrow">BPS301 · Chương 6 · Bài 6.1</span>
<h2>Tự động hoá quy trình: BPMS, workflow, RPA &amp; điều phối</h2>
<h3>Máy chạy quy trình (BPMS)</h3>
<p>Một <strong>Hệ thống quản lý quy trình nghiệp vụ (BPMS)</strong> — như Camunda — nhận một mô hình <strong>BPMN 2.0 thực thi được</strong> và thật sự chạy nó: nó tạo hồ sơ (case), giao task cho đúng người, gọi dịch vụ, chờ timer, và nhớ chính xác từng hồ sơ đang ở đâu. Mô hình trở thành phần mềm đang chạy.</p>
<h3>Workflow automation vs RPA</h3>
<ul>
<li><strong>Tự động hoá luồng (workflow)</strong> — engine dẫn dắt dòng qua API và danh sách task cho người (cách sạch, có cấu trúc).</li>
<li><strong>RPA (tự động hoá bằng robot)</strong> — một <strong>bot</strong> bắt chước người bấm giao diện, dùng để bắc cầu qua hệ thống cũ không có API. Triển khai nhanh, nhưng dễ vỡ khi màn hình đổi.</li>
</ul>
<h3>Orchestration vs choreography</h3>
<p><strong>Điều phối tập trung (orchestration)</strong> — một engine trung tâm chỉ huy mọi bước (như nhạc trưởng). <strong>Phối hợp phân tán (choreography)</strong> — các dịch vụ phản ứng với sự kiện của nhau, không có ông chủ trung tâm (như vũ công). Orchestration dễ giám sát hơn; choreography ghép lỏng và mở rộng tốt hơn.</p>
<pre><code>[Nhận đơn] --engine--> gọi PaymentService (API)
                    --> tạo task cho người "Duyệt"
                    --> gọi ShippingService (API)   -> (end)
   CRM cũ không có API? -> bot RPA gõ thẳng vào màn hình nó
</code></pre>
<div class="callout"><span class="badge">Tự động hoá chính mô hình, không phải bản sao</span> Với BPMS thì sơ đồ CHÍNH LÀ thứ thực thi — không còn khoảng cách giữa bức tranh nhà phân tích vẽ và mã đang chạy.</div>`,
  ]]);

const c6q = quiz('bps301-quiz-6', 'Quiz 6 — Process automation|||Quiz 6 — Tự động hoá quy trình', [
  { id: 'q1', question: 'Một BPMS (process engine) làm gì với mô hình BPMN thực thi được?', options: ['Chỉ in ra giấy', 'Thật sự chạy nó: tạo case, giao task, gọi dịch vụ, chờ timer', 'Xoá nó', 'Dịch sang tiếng Anh'], correctIndex: 1, explanation: 'BPMS thực thi mô hình BPMN: điều phối task người & dịch vụ, theo dõi từng case.' },
  { id: 'q2', question: 'RPA (Robotic Process Automation) thường dùng khi nào?', options: ['Khi hệ thống cũ KHÔNG có API, cần bot bắt chước thao tác UI', 'Khi có API sạch để gọi', 'Khi cần vẽ BPMN', 'Khi đo cycle time'], correctIndex: 0, explanation: 'RPA bắc cầu qua hệ thống cũ không có API bằng cách mô phỏng người bấm giao diện.' },
  { id: 'q3', question: 'Khác biệt giữa orchestration và choreography?', options: ['Không có khác biệt', 'Orchestration có engine trung tâm chỉ huy; choreography là dịch vụ phản ứng sự kiện, không trung tâm', 'Cả hai đều cần RPA', 'Choreography luôn nhanh hơn'], correctIndex: 1, explanation: 'Orchestration = điều phối tập trung; choreography = phối hợp phân tán qua sự kiện.' },
]);

const c7 = doc('bps301-7-1-execution-monitoring', '7.1 — Execution, monitoring, KPIs & process mining|||7.1 — Thực thi, giám sát, KPI & process mining',
  'Thực thi (chạy case trên engine, task người/dịch vụ); giám sát quy trình & dashboard; KPI (cycle time, cost, error rate, SLA); process mining (khai phá quy trình thật từ event log).',
  [[
    `<span class="eyebrow">BPS301 · Chapter 7 · Lesson 7.1</span>
<h2>Execution, monitoring, KPIs &amp; process mining</h2>
<h3>Execution</h3>
<p>Once deployed, the engine <strong>executes</strong> each case: it moves tokens through the model, presents human tasks in a task list, calls services, and enforces timers and rules. Every step is timestamped into an <strong>event log</strong>.</p>
<h3>Monitoring &amp; KPIs</h3>
<p><strong>Process monitoring</strong> watches running cases on a dashboard so problems are caught live. Health is tracked with <strong>KPIs</strong>:</p>
<ul>
<li><strong>Cycle time</strong> — how long a case takes end to end.</li>
<li><strong>Cost</strong> per case.</li>
<li><strong>Error / rework rate</strong> — how often work is redone.</li>
<li><strong>SLA compliance</strong> — % of cases finished within the promised time.</li>
</ul>
<h3>Process mining</h3>
<p><strong>Process mining</strong> reads the real <strong>event log</strong> and reconstructs the process <em>as it actually ran</em> — not as someone drew it. It reveals the true paths, hidden loops, and <strong>bottlenecks</strong>, and does <strong>conformance checking</strong>: where reality deviates from the designed model.</p>
<pre><code>Event log (case, activity, timestamp):
 1001, Receive,  09:00
 1001, Approve,  11:30   <- 2.5 h wait shows up as a bottleneck
 1001, Ship,     11:35
   -> mining tools rebuild the real map + timing from thousands of these
</code></pre>
<div class="callout"><span class="badge">The log does not lie</span> Interviews give the process people <em>think</em> they run; the event log gives the process they <em>actually</em> run. Mine the log.</div>`,
    `<span class="eyebrow">BPS301 · Chương 7 · Bài 7.1</span>
<h2>Thực thi, giám sát, KPI &amp; process mining</h2>
<h3>Thực thi</h3>
<p>Sau khi triển khai, engine <strong>thực thi</strong> từng case: nó di chuyển token qua mô hình, đưa task cho người vào danh sách công việc, gọi dịch vụ, và thực thi timer cùng quy tắc. Mỗi bước được đóng dấu thời gian vào một <strong>nhật ký sự kiện (event log)</strong>.</p>
<h3>Giám sát &amp; KPI</h3>
<p><strong>Giám sát quy trình</strong> theo dõi các case đang chạy trên dashboard để bắt sự cố ngay lúc nó xảy ra. Tình trạng được đo bằng <strong>KPI</strong>:</p>
<ul>
<li><strong>Cycle time</strong> — một case mất bao lâu từ đầu tới cuối.</li>
<li><strong>Chi phí</strong> mỗi case.</li>
<li><strong>Tỉ lệ lỗi / làm lại</strong> — công việc phải làm lại bao nhiêu lần.</li>
<li><strong>Tuân thủ SLA</strong> — % case hoàn thành trong thời gian đã cam kết.</li>
</ul>
<h3>Process mining (khai phá quy trình)</h3>
<p><strong>Process mining</strong> đọc <strong>event log</strong> thật và dựng lại quy trình <em>như nó thực sự chạy</em> — không phải như ai đó đã vẽ. Nó phơi bày các đường đi thật, vòng lặp ẩn, và <strong>điểm nghẽn</strong>, và làm <strong>kiểm tra tuân thủ (conformance)</strong>: chỗ nào thực tế lệch khỏi mô hình đã thiết kế.</p>
<pre><code>Event log (case, hoạt động, mốc thời gian):
 1001, Nhận,   09:00
 1001, Duyệt,  11:30   <- chờ 2,5 giờ lộ ra là một điểm nghẽn
 1001, Giao,   11:35
   -> công cụ mining dựng lại bản đồ thật + thời gian từ hàng nghìn dòng như vầy
</code></pre>
<div class="callout"><span class="badge">Nhật ký không nói dối</span> Phỏng vấn cho ra quy trình người ta <em>nghĩ</em> mình chạy; event log cho ra quy trình họ <em>thực sự</em> chạy. Hãy khai phá nhật ký.</div>`,
  ]]);

const c7q = quiz('bps301-quiz-7', 'Quiz 7 — Execution & monitoring|||Quiz 7 — Thực thi & giám sát', [
  { id: 'q1', question: 'Process mining khai phá quy trình dựa trên?', options: ['Ý kiến quản lý', 'Event log (nhật ký sự kiện) thật do hệ thống ghi lại', 'Sơ đồ tổ chức', 'Bảng lương'], correctIndex: 1, explanation: 'Process mining dựng lại quy trình THẬT từ event log, không phải từ mô hình vẽ tay.' },
  { id: 'q2', question: 'KPI "SLA compliance" đo?', options: ['Số nhân viên', 'Tỉ lệ case hoàn thành trong thời gian cam kết', 'Số gateway trong mô hình', 'Dung lượng đĩa'], correctIndex: 1, explanation: 'SLA compliance = % case xong đúng hạn đã cam kết.' },
  { id: 'q3', question: '"Conformance checking" trong process mining là?', options: ['Vẽ mô hình mới', 'So thực tế chạy với mô hình đã thiết kế để tìm chỗ lệch', 'Tính lương', 'Tạo pool mới'], correctIndex: 1, explanation: 'Conformance đối chiếu event log thật với mô hình để phát hiện sai lệch.' },
]);

const c8 = doc('bps301-8-1-governance-improvement', '8.1 — BPM governance, maturity & continuous improvement|||8.1 — Quản trị BPM, độ trưởng thành & cải tiến liên tục',
  'Quản trị BPM (vai trò: process owner, CoE; chuẩn hoá, danh mục quy trình); mô hình độ trưởng thành (BPMM/CMMI); cải tiến liên tục (PDCA, Six Sigma, Lean); ví dụ tổng hợp cả vòng đời.',
  [[
    `<span class="eyebrow">BPS301 · Chapter 8 · Lesson 8.1</span>
<h2>BPM governance, maturity &amp; continuous improvement</h2>
<h3>Governance — who owns the process?</h3>
<p>BPM only lasts if someone owns it. <strong>Governance</strong> defines the roles: a <strong>process owner</strong> is accountable for one end-to-end process; a <strong>BPM Center of Excellence (CoE)</strong> sets standards, tools and a shared <strong>process repository</strong> so models do not rot.</p>
<h3>Maturity</h3>
<p>A <strong>maturity model</strong> (BPMM, echoing CMMI) rates how systematic an organization is, from <em>ad-hoc</em> (heroics, no models) up to <em>managed / optimizing</em> (measured, standardized, continuously improved). It tells you where you are and the next realistic step.</p>
<h3>Continuous improvement</h3>
<p>The lifecycle never stops. <strong>PDCA</strong> (Plan-Do-Check-Act), <strong>Six Sigma</strong> (reduce variation, DMAIC) and <strong>Lean</strong> (remove waste) keep feeding new issues back into analysis and redesign.</p>
<pre><code>End-to-end example (order-to-cash):
 identify O2C -> model AS-IS in BPMN -> analysis finds 2.5h approval wait
 -> redesign: parallelize + auto-approve small orders
 -> deploy to Camunda, monitor cycle time KPI
 -> process mining confirms wait dropped -> PDCA: pick next issue
</code></pre>
<div class="callout"><span class="badge">BPM is a loop, not a project</span> A one-off redesign decays. Owners, standards and a repeating measure-improve loop are what make the gains stick.</div>`,
    `<span class="eyebrow">BPS301 · Chương 8 · Bài 8.1</span>
<h2>Quản trị BPM, độ trưởng thành &amp; cải tiến liên tục</h2>
<h3>Quản trị — ai sở hữu quy trình?</h3>
<p>BPM chỉ bền nếu có người sở hữu nó. <strong>Quản trị (governance)</strong> định nghĩa vai trò: một <strong>chủ quy trình (process owner)</strong> chịu trách nhiệm cho một quy trình đầu-cuối; một <strong>Trung tâm xuất sắc BPM (CoE)</strong> đặt chuẩn, công cụ và một <strong>kho quy trình (repository)</strong> chung để mô hình không mục nát.</p>
<h3>Độ trưởng thành</h3>
<p>Một <strong>mô hình độ trưởng thành</strong> (BPMM, dội lại CMMI) chấm mức độ bài bản của tổ chức, từ <em>tuỳ tiện</em> (dựa vào cá nhân, không mô hình) lên tới <em>được quản lý / tối ưu</em> (đo lường, chuẩn hoá, cải tiến liên tục). Nó cho biết bạn đang ở đâu và bước tiếp theo thực tế là gì.</p>
<h3>Cải tiến liên tục</h3>
<p>Vòng đời không bao giờ dừng. <strong>PDCA</strong> (Plan-Do-Check-Act), <strong>Six Sigma</strong> (giảm biến thiên, DMAIC) và <strong>Lean</strong> (loại lãng phí) liên tục đẩy các vấn đề mới quay lại bước phân tích và tái thiết kế.</p>
<pre><code>Ví dụ đầu-cuối (order-to-cash):
 nhận diện O2C -> mô hình AS-IS bằng BPMN -> phân tích thấy chờ duyệt 2,5h
 -> tái thiết kế: song song hoá + tự duyệt đơn nhỏ
 -> triển khai lên Camunda, giám sát KPI cycle time
 -> process mining xác nhận thời gian chờ giảm -> PDCA: chọn vấn đề kế tiếp
</code></pre>
<div class="callout"><span class="badge">BPM là một vòng lặp, không phải một dự án</span> Một lần tái thiết kế rời rạc sẽ phai. Chủ quy trình, chuẩn hoá và vòng lặp đo-cải-tiến lặp lại mới giữ được thành quả.</div>`,
  ]]);

const c8q = quiz('bps301-quiz-8', 'Quiz 8 — Governance & improvement|||Quiz 8 — Quản trị & cải tiến', [
  { id: 'q1', question: 'Trong quản trị BPM, "process owner" là?', options: ['Người viết mã engine', 'Người chịu trách nhiệm cho một quy trình đầu-cuối', 'Khách hàng', 'Máy chủ chạy BPMS'], correctIndex: 1, explanation: 'Process owner chịu trách nhiệm end-to-end cho một quy trình cụ thể.' },
  { id: 'q2', question: 'Mô hình độ trưởng thành BPM (maturity model) dùng để?', options: ['Tính lương nhân viên', 'Đánh giá mức độ bài bản/hệ thống của tổ chức và bước tiến tiếp theo', 'Vẽ BPMN', 'Chọn màu dashboard'], correctIndex: 1, explanation: 'Maturity model xếp hạng từ ad-hoc tới optimizing, chỉ ra chỗ đứng và bước kế.' },
  { id: 'q3', question: 'Chu trình cải tiến liên tục PDCA gồm?', options: ['Plan-Do-Check-Act', 'Pool-Data-Case-Actor', 'Process-Design-Code-Api', 'Plan-Deploy-Cancel-Abort'], correctIndex: 0, explanation: 'PDCA = Plan (lập kế hoạch) - Do (làm) - Check (kiểm) - Act (điều chỉnh), lặp mãi.' },
]);

export default {
  semester: { code: 'FPTU_Hola8', name: 'Kỳ 8', ordinal: 10 },
  course: {
    courseCode: 'BPS301',
    slug: 'bps301-business-process-management-system',
    title: 'Business Process Management System',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/BPS301.webp',
    shortDescription: 'What BPM is and how to run it end to end — the BPM lifecycle, BPMN 2.0 modeling, process analysis, redesign, automation (BPMS/RPA), execution, monitoring (KPIs, process mining) & governance. Bilingual, with examples & quizzes.|||BPM là gì và chạy trọn vòng đời ra sao — vòng đời BPM, mô hình hoá BPMN 2.0, phân tích, tái thiết kế, tự động hoá (BPMS/RPA), thực thi, giám sát (KPI, process mining) & quản trị. Song ngữ, có ví dụ & quiz.',
    description: 'Môn <strong>BPS301 — Business Process Management System</strong> (ngành Hệ thống thông tin, kỳ 8) dạy bạn quản lý một tổ chức qua các <strong>quy trình nghiệp vụ</strong>. Đi trọn <strong>vòng đời BPM</strong>: hiểu &amp; mô hình hoá (<strong>BPMN 2.0</strong>: event/activity/gateway, pool/lane, subprocess, ngoại lệ) → <strong>phân tích</strong> (định tính/định lượng, cycle time, điểm nghẽn) → <strong>tái thiết kế</strong> (BPR, heuristics) → <strong>tự động hoá</strong> (BPMS, RPA, orchestration) → <strong>thực thi, giám sát</strong> (KPI, process mining) &amp; <strong>quản trị + cải tiến liên tục</strong>. Bám sách chuẩn Dumas et al., Weske và chuẩn BPMN 2.0 (OMG); song ngữ, có ví dụ &amp; quiz mỗi chương.',
    whatYouLearn: 'Quy trình nghiệp vụ & vòng đời BPM; nhận diện & xếp ưu tiên quy trình; mô hình hoá BPMN 2.0 (event/activity/gateway/flow, pool/lane, subprocess, boundary event); phân tích định tính (value-added, root cause, Pareto) & định lượng (cycle time, CTE, bottleneck); tái thiết kế (BPR, eliminate/parallelize/resequence/triage); tự động hoá (BPMS/Camunda, workflow, RPA, orchestration vs choreography); thực thi & giám sát (KPI, SLA, process mining, conformance); quản trị BPM, độ trưởng thành & cải tiến liên tục (PDCA/Six Sigma/Lean).',
    requirements: 'Hiểu cơ bản về doanh nghiệp & hệ thống thông tin. Nên thử một công cụ mô hình hoá BPMN miễn phí (bpmn.io hoặc Bizagi Modeler) khi học.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách chuẩn (Dumas, Weske), BPMN 2.0, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'BPM là gì, quy trình nghiệp vụ, lộ trình 4 bước.', lessons: [intro] },
    { title: 'Chương 1 — BPM là gì|||Chapter 1 — What is BPM', description: 'Quy trình, vòng đời BPM, tư duy quy trình, giá trị.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Nhận diện & BPMN cơ bản|||Chapter 2 — Identification & BPMN basics', description: 'Process identification, event/activity/gateway/flow.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Mô hình hoá nâng cao|||Chapter 3 — Advanced modeling', description: 'Pool/lane, subprocess, xử lý ngoại lệ.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Phân tích quy trình|||Chapter 4 — Process analysis', description: 'Định tính/định lượng, cycle time, điểm nghẽn.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Tái thiết kế quy trình|||Chapter 5 — Process redesign', description: 'BPR, redesign heuristics, tối ưu, đánh đổi.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Tự động hoá quy trình|||Chapter 6 — Process automation', description: 'BPMS, workflow, RPA, orchestration.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Thực thi & giám sát|||Chapter 7 — Execution & monitoring', description: 'Execution, KPI, SLA, process mining.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Quản trị & cải tiến liên tục|||Chapter 8 — Governance & improvement', description: 'BPM governance, maturity, PDCA/Six Sigma/Lean.', lessons: [c8, c8q] },
  ],
};
