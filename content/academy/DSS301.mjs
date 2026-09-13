/**
 * DSS301 — Decision Support System (Hệ hỗ trợ ra quyết định). Ngành Hệ thống
 * thông tin FPTU, kỳ 7. Giáo trình chuẩn quốc tế: Turban et al "Decision
 * Support and Business Intelligence Systems"; Power "Decision Support Systems:
 * Concepts and Resources"; Sharda. 8 chương, song ngữ + mô hình + ví dụ thật.
 * Giữ NGUYÊN slug/semester/courseCode/thumb(v3). ⚠️ KHÔNG backtick/${; & → &amp;
 * trong HTML; content .join('\n') ra STRING.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('dss301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn (Turban, Power, Sharda), tài liệu miễn phí, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">DSS301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Decision Support Systems</strong> — from decision theory to BI dashboards — in one place. The full official slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU syllabus &amp; lecture slides for DSS301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li>Turban, Sharda &amp; Delen — <em>Decision Support and Business Intelligence Systems</em> (Pearson) — the core textbook.</li>
<li>Daniel J. Power — <em>Decision Support Systems: Concepts and Resources for Managers</em>.</li>
<li>Sharda, Delen &amp; Turban — <em>Business Intelligence, Analytics, and Data Science</em>.</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://dssresources.com/" target="_blank" rel="noopener">DSSResources.com</a> — Power's reference site on DSS concepts &amp; history.</li>
<li><a href="https://www.tableau.com/learn/training" target="_blank" rel="noopener">Tableau training</a> — dashboards &amp; visual analytics, free tutorials.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li>Excel <strong>Solver</strong> &amp; <strong>What-If Analysis</strong> — optimization, goal-seek, scenarios built into the spreadsheet.</li>
<li><a href="https://public.tableau.com/" target="_blank" rel="noopener">Tableau Public</a> / Power BI — build interactive dashboards.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — what a decision is, Simon's decision types, and what a DSS adds.</li>
<li><strong>Process &amp; models</strong> — intelligence-design-choice, and how to model a problem.</li>
<li><strong>Build blocks</strong> — data (warehouse, OLAP), models, and what-if / optimization.</li>
<li><strong>Job-ready</strong> — group &amp; spatial DSS, expert systems, and BI dashboards on real data.</li>
</ol></div>`,
    `<span class="eyebrow">DSS301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Hệ hỗ trợ ra quyết định</strong> — từ lý thuyết ra quyết định đến dashboard BI — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của DSS301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li>Turban, Sharda &amp; Delen — <em>Decision Support and Business Intelligence Systems</em> (Pearson) — sách lõi.</li>
<li>Daniel J. Power — <em>Decision Support Systems: Concepts and Resources for Managers</em>.</li>
<li>Sharda, Delen &amp; Turban — <em>Business Intelligence, Analytics, and Data Science</em>.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://dssresources.com/" target="_blank" rel="noopener">DSSResources.com</a> — trang tham khảo của Power về khái niệm &amp; lịch sử DSS.</li>
<li><a href="https://www.tableau.com/learn/training" target="_blank" rel="noopener">Tableau training</a> — dashboard &amp; phân tích trực quan, hướng dẫn miễn phí.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li>Excel <strong>Solver</strong> &amp; <strong>What-If Analysis</strong> — tối ưu, goal-seek, kịch bản có sẵn trong bảng tính.</li>
<li><a href="https://public.tableau.com/" target="_blank" rel="noopener">Tableau Public</a> / Power BI — dựng dashboard tương tác.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — quyết định là gì, loại quyết định của Simon, và DSS thêm được gì.</li>
<li><strong>Quy trình &amp; mô hình</strong> — trí tuệ-thiết kế-lựa chọn, và cách mô hình hoá bài toán.</li>
<li><strong>Khối dựng</strong> — dữ liệu (kho, OLAP), mô hình, và what-if / tối ưu.</li>
<li><strong>Sẵn sàng đi làm</strong> — DSS nhóm &amp; không gian, hệ chuyên gia, và dashboard BI trên dữ liệu thật.</li>
</ol></div>`,
  ]]);

const intro = doc('dss301-0-1-overview', 'Course overview: Decision Support Systems|||Tổng quan: Hệ hỗ trợ ra quyết định',
  'DSS là gì và giải bài toán nào; ai dùng; lộ trình: khái niệm → quy trình & mô hình → kiến trúc → dữ liệu & mô hình → what-if & tối ưu → nhóm/không gian → hệ chuyên gia → BI & dashboard.',
  [[
    `<span class="eyebrow">DSS301 · Lesson 0.1 · Overview</span>
<h2>Decision Support Systems</h2>
<p class="lead">A <strong>Decision Support System (DSS)</strong> is an interactive computer system that helps managers use <strong>data and models</strong> to solve <strong>semi-structured</strong> problems — not to replace the decision maker, but to make their judgment sharper and faster.</p>
<h3>Why it matters</h3>
<p>Some decisions are routine and can be automated; others are pure intuition. Most important business decisions sit in between — where data, analysis and human judgment must combine. That middle ground is exactly where a DSS earns its keep: pricing, inventory, loan approval, plant location, marketing spend.</p>
<h3>Roadmap</h3>
<ul>
<li><strong>Ch1–2</strong> — what decisions are (Simon's types) and the decision-making process &amp; models.</li>
<li><strong>Ch3–4</strong> — DSS architecture and its data &amp; model management (warehouse, OLAP).</li>
<li><strong>Ch5–6</strong> — what-if &amp; optimization; group and spatial DSS.</li>
<li><strong>Ch7–8</strong> — expert / intelligent systems, and BI dashboards &amp; analytics trends.</li>
</ul>
<div class="callout"><span class="badge">Key idea</span> A DSS <em>supports</em> decisions — the human stays in charge. It brings data, models and a friendly interface to problems too messy to fully automate.</div>`,
    `<span class="eyebrow">DSS301 · Bài 0.1 · Tổng quan</span>
<h2>Hệ hỗ trợ ra quyết định</h2>
<p class="lead">Một <strong>hệ hỗ trợ ra quyết định (DSS)</strong> là hệ máy tính tương tác giúp nhà quản lý dùng <strong>dữ liệu và mô hình</strong> để giải các bài toán <strong>bán cấu trúc</strong> — không thay người ra quyết định, mà làm cho phán đoán của họ sắc bén và nhanh hơn.</p>
<h3>Vì sao quan trọng</h3>
<p>Có quyết định lặp lại, tự động hoá được; có quyết định thuần trực giác. Phần lớn quyết định kinh doanh quan trọng nằm ở giữa — nơi dữ liệu, phân tích và phán đoán con người phải kết hợp. Chính vùng giữa đó là chỗ DSS phát huy: định giá, tồn kho, duyệt vay, chọn vị trí nhà máy, chi tiêu marketing.</p>
<h3>Lộ trình</h3>
<ul>
<li><strong>Ch1–2</strong> — quyết định là gì (loại của Simon) và quy trình &amp; mô hình ra quyết định.</li>
<li><strong>Ch3–4</strong> — kiến trúc DSS và quản lý dữ liệu &amp; mô hình (kho dữ liệu, OLAP).</li>
<li><strong>Ch5–6</strong> — what-if &amp; tối ưu; DSS nhóm và không gian.</li>
<li><strong>Ch7–8</strong> — hệ chuyên gia / thông minh, và dashboard BI &amp; xu hướng phân tích.</li>
</ul>
<div class="callout"><span class="badge">Ý chính</span> DSS <em>hỗ trợ</em> quyết định — con người vẫn nắm quyền. Nó mang dữ liệu, mô hình và giao diện thân thiện đến những bài toán quá rối để tự động hoá hoàn toàn.</div>`,
  ]]);

const c1 = doc('dss301-1-1-what-is-dss', '1.1 — What a DSS is|||1.1 — DSS là gì',
  'Ra quyết định; loại quyết định của Simon (structured/semi/unstructured); vai trò của DSS; phân loại DSS (Power: data/model/knowledge/document/communication-driven).',
  [[
    `<span class="eyebrow">DSS301 · Chapter 1 · Lesson 1.1</span>
<h2>What a DSS is</h2>
<h3>Types of decisions (Herbert Simon)</h3>
<ul>
<li><strong>Structured</strong> — routine, clear rules (reorder stock at a threshold). Fully programmable.</li>
<li><strong>Semi-structured</strong> — part rule, part judgment (approving a loan, setting a price). <em>The sweet spot for a DSS.</em></li>
<li><strong>Unstructured</strong> — novel, no clear procedure (entering a new market). Judgment-led; a DSS informs but cannot decide.</li>
</ul>
<h3>What the DSS adds</h3>
<p>A DSS does <strong>not</strong> automate the decision. It gives the manager fast access to relevant <strong>data</strong>, analytical <strong>models</strong> ("what if we cut price 5%?"), and an interface to explore options — improving <em>effectiveness</em> (a better decision), not just efficiency.</p>
<h3>Power's classification of DSS</h3>
<ul>
<li><strong>Data-driven</strong> — query &amp; analyze large data (warehouse, OLAP).</li>
<li><strong>Model-driven</strong> — optimization / simulation models (e.g. Excel Solver).</li>
<li><strong>Knowledge-driven</strong> — rules / expertise (recommendations, diagnosis).</li>
<li><strong>Document-driven</strong> — retrieve and manage unstructured documents.</li>
<li><strong>Communication-driven</strong> — support a group deciding together (GDSS).</li>
</ul>
<div class="callout"><span class="badge">Example</span> A bank's loan officer uses a model-driven DSS to score risk, but still decides borderline cases — a textbook semi-structured decision.</div>`,
    `<span class="eyebrow">DSS301 · Chương 1 · Bài 1.1</span>
<h2>DSS là gì</h2>
<h3>Loại quyết định (Herbert Simon)</h3>
<ul>
<li><strong>Có cấu trúc</strong> — lặp lại, luật rõ (đặt hàng lại khi tồn kho chạm ngưỡng). Lập trình hoàn toàn được.</li>
<li><strong>Bán cấu trúc</strong> — phần luật, phần phán đoán (duyệt vay, định giá). <em>Vùng đắc địa của DSS.</em></li>
<li><strong>Phi cấu trúc</strong> — mới lạ, không có quy trình rõ (vào thị trường mới). Dẫn dắt bởi phán đoán; DSS cung cấp thông tin nhưng không quyết thay.</li>
</ul>
<h3>DSS thêm được gì</h3>
<p>DSS <strong>không</strong> tự động hoá quyết định. Nó cho nhà quản lý truy cập nhanh <strong>dữ liệu</strong> liên quan, <strong>mô hình</strong> phân tích ("nếu giảm giá 5% thì sao?"), và giao diện để khám phá phương án — nâng <em>hiệu quả</em> (quyết định tốt hơn), không chỉ nâng tốc độ.</p>
<h3>Phân loại DSS của Power</h3>
<ul>
<li><strong>Hướng dữ liệu</strong> — truy vấn &amp; phân tích dữ liệu lớn (kho, OLAP).</li>
<li><strong>Hướng mô hình</strong> — mô hình tối ưu / mô phỏng (vd Excel Solver).</li>
<li><strong>Hướng tri thức</strong> — luật / chuyên môn (gợi ý, chẩn đoán).</li>
<li><strong>Hướng tài liệu</strong> — truy hồi và quản lý tài liệu phi cấu trúc.</li>
<li><strong>Hướng giao tiếp</strong> — hỗ trợ nhóm cùng ra quyết định (GDSS).</li>
</ul>
<div class="callout"><span class="badge">Ví dụ</span> Cán bộ tín dụng dùng DSS hướng mô hình để chấm điểm rủi ro, nhưng vẫn tự quyết ca ranh giới — đúng kiểu quyết định bán cấu trúc.</div>`,
  ]]);

const c1q = quiz('dss301-quiz-1', 'Quiz 1 — What a DSS is|||Quiz 1 — DSS là gì', [
  { id: 'q1', question: 'Loại quyết định nào là "vùng đắc địa" của DSS?', options: ['Có cấu trúc|||Structured', 'Bán cấu trúc|||Semi-structured', 'Phi cấu trúc|||Unstructured', 'Không loại nào|||None'], correctIndex: 1, explanation: 'DSS mạnh nhất ở quyết định bán cấu trúc — vừa luật vừa phán đoán.' },
  { id: 'q2', question: 'DSS chủ yếu nâng điều gì?', options: ['Chỉ tốc độ xử lý|||Speed only', 'Hiệu quả quyết định (quyết định tốt hơn)|||Decision effectiveness', 'Thay thế hẳn người quyết định|||Replacing the decider', 'Dung lượng đĩa|||Disk space'], correctIndex: 1, explanation: 'DSS hỗ trợ, con người vẫn quyết; mục tiêu là quyết định tốt hơn.' },
  { id: 'q3', question: 'DSS dùng mô hình tối ưu/mô phỏng thuộc nhóm nào của Power?', options: ['Hướng dữ liệu|||Data-driven', 'Hướng mô hình|||Model-driven', 'Hướng tài liệu|||Document-driven', 'Hướng giao tiếp|||Communication-driven'], correctIndex: 1, explanation: 'Model-driven DSS xoay quanh mô hình (vd Solver).' },
]);

const c2 = doc('dss301-2-1-decision-process', '2.1 — The decision-making process & models|||2.1 — Quy trình ra quyết định & mô hình',
  'Quy trình Simon: Intelligence → Design → Choice (→ Implementation); mô hình hoá bài toán (biến quyết định, ràng buộc, hàm mục tiêu); tính hợp lý có giới hạn.',
  [[
    `<span class="eyebrow">DSS301 · Chapter 2 · Lesson 2.1</span>
<h2>The decision-making process &amp; models</h2>
<h3>Simon's four phases</h3>
<ol>
<li><strong>Intelligence</strong> — scan reality, find the problem or opportunity. ("Sales are falling — why?")</li>
<li><strong>Design</strong> — build a model, generate alternatives and criteria. ("Cut price? Add features? New market?")</li>
<li><strong>Choice</strong> — evaluate alternatives against the model and pick one.</li>
<li><strong>Implementation</strong> — put it into action (often listed as a follow-on phase).</li>
</ol>
<p>A DSS supports every phase — data mining for intelligence, models for design, analysis for choice.</p>
<h3>Modeling a decision</h3>
<p>To analyze a decision quantitatively you build a <strong>model</strong> from three parts:</p>
<ul>
<li><strong>Decision variables</strong> — what you control (units to produce, price).</li>
<li><strong>Constraints</strong> — limits you must respect (budget, capacity).</li>
<li><strong>Objective (result) &amp; uncontrollable variables</strong> — what you maximize/minimize (profit), and the environment you cannot control (demand, tax).</li>
</ul>
<pre><code>Result = f(decision variables, uncontrollable variables)
 maximize  Profit
 subject to  Labor &lt;= 40h,  Material &lt;= 100 units
</code></pre>
<div class="callout"><span class="badge">Bounded rationality</span> Simon: people rarely optimize perfectly — they <em>satisfice</em> (accept "good enough") under limited time and information. A DSS widens those limits.</div>`,
    `<span class="eyebrow">DSS301 · Chương 2 · Bài 2.1</span>
<h2>Quy trình ra quyết định &amp; mô hình</h2>
<h3>Bốn pha của Simon</h3>
<ol>
<li><strong>Trí tuệ (Intelligence)</strong> — quét thực tế, tìm vấn đề hay cơ hội. ("Doanh số giảm — vì sao?")</li>
<li><strong>Thiết kế (Design)</strong> — dựng mô hình, sinh phương án và tiêu chí. ("Giảm giá? Thêm tính năng? Thị trường mới?")</li>
<li><strong>Lựa chọn (Choice)</strong> — đánh giá phương án theo mô hình và chọn một.</li>
<li><strong>Thực thi (Implementation)</strong> — đưa vào hành động (thường coi là pha kế tiếp).</li>
</ol>
<p>DSS hỗ trợ mọi pha — khai phá dữ liệu cho trí tuệ, mô hình cho thiết kế, phân tích cho lựa chọn.</p>
<h3>Mô hình hoá một quyết định</h3>
<p>Để phân tích định lượng, bạn dựng một <strong>mô hình</strong> gồm ba phần:</p>
<ul>
<li><strong>Biến quyết định</strong> — thứ bạn điều khiển (số lượng sản xuất, giá bán).</li>
<li><strong>Ràng buộc</strong> — giới hạn phải tôn trọng (ngân sách, năng lực).</li>
<li><strong>Mục tiêu (kết quả) &amp; biến không điều khiển</strong> — thứ bạn tối đa/tối thiểu (lợi nhuận), và môi trường bạn không kiểm soát (cầu, thuế).</li>
</ul>
<pre><code>Kết quả = f(biến quyết định, biến không điều khiển)
 tối đa  Lợi nhuận
 ràng buộc  Lao động &lt;= 40h,  Vật tư &lt;= 100 đơn vị
</code></pre>
<div class="callout"><span class="badge">Hợp lý có giới hạn</span> Simon: người ta hiếm khi tối ưu hoàn hảo — họ <em>thoả mãn (satisfice)</em>, chấp nhận "đủ tốt" dưới giới hạn thời gian và thông tin. DSS nới rộng các giới hạn đó.</div>`,
  ]]);

const c2q = quiz('dss301-quiz-2', 'Quiz 2 — Decision process|||Quiz 2 — Quy trình quyết định', [
  { id: 'q1', question: 'Thứ tự đúng ba pha lõi của Simon?', options: ['Choice → Design → Intelligence', 'Intelligence → Design → Choice', 'Design → Choice → Intelligence', 'Intelligence → Choice → Design'], correctIndex: 1, explanation: 'Trí tuệ (tìm vấn đề) → Thiết kế (dựng phương án) → Lựa chọn (chọn).' },
  { id: 'q2', question: 'Trong mô hình quyết định, "biến quyết định" là gì?', options: ['Thứ ta không kiểm soát được|||Uncontrollable', 'Thứ ta điều khiển được (vd giá, sản lượng)|||What we control', 'Hàm mục tiêu|||The objective', 'Ràng buộc ngân sách|||A constraint'], correctIndex: 1, explanation: 'Biến quyết định là các lựa chọn ta điều khiển được.' },
  { id: 'q3', question: '"Satisficing" (Simon) nghĩa là?', options: ['Luôn tìm lời giải tối ưu tuyệt đối|||Always optimal', 'Chấp nhận phương án "đủ tốt" dưới giới hạn|||Accept good-enough', 'Bỏ qua mọi ràng buộc|||Ignore constraints', 'Chỉ dùng trực giác|||Pure intuition'], correctIndex: 1, explanation: 'Hợp lý có giới hạn: chọn phương án đủ tốt, không nhất thiết tối ưu.' },
]);

const c3 = doc('dss301-3-1-architecture', '3.1 — DSS architecture|||3.1 — Kiến trúc DSS',
  'Bốn phân hệ của DSS: quản lý dữ liệu (data), quản lý mô hình (model), quản lý tri thức (knowledge), giao diện người dùng (UI/dialog); cách chúng phối hợp.',
  [[
    `<span class="eyebrow">DSS301 · Chapter 3 · Lesson 3.1</span>
<h2>DSS architecture</h2>
<p>A classic DSS is built from four <strong>subsystems</strong> that work together:</p>
<ul>
<li><strong>Data management</strong> — the database (or data warehouse) plus its DBMS: pulls internal &amp; external data the decision needs.</li>
<li><strong>Model management</strong> — the <em>model base</em> and its management software: financial, statistical, optimization &amp; simulation models the user runs.</li>
<li><strong>Knowledge-based (intelligence) subsystem</strong> — optional; supplies expertise/rules, can advise the other subsystems (this is what makes a DSS "intelligent").</li>
<li><strong>User interface (dialog) subsystem</strong> — how the manager talks to the DSS: menus, forms, dashboards, natural language. Often the make-or-break part.</li>
</ul>
<pre><code>        +---------------------+
 User <->|  User interface     |
        +----------+----------+
                   |
   +-------+-------+-------+--------+
   | Data mgmt | Model mgmt | Knowledge |
   +-------+-------+-------+--------+
   |  DB / warehouse | Model base |  Rules   |
</code></pre>
<div class="callout"><span class="badge">Why four parts</span> Separating data, models, knowledge and interface lets each evolve independently — add a new model without touching the database, or redesign the dashboard without breaking the models.</div>`,
    `<span class="eyebrow">DSS301 · Chương 3 · Bài 3.1</span>
<h2>Kiến trúc DSS</h2>
<p>Một DSS kinh điển gồm bốn <strong>phân hệ</strong> phối hợp với nhau:</p>
<ul>
<li><strong>Quản lý dữ liệu</strong> — cơ sở dữ liệu (hoặc kho dữ liệu) cùng DBMS: kéo dữ liệu nội bộ &amp; bên ngoài mà quyết định cần.</li>
<li><strong>Quản lý mô hình</strong> — <em>kho mô hình (model base)</em> và phần mềm quản lý: mô hình tài chính, thống kê, tối ưu &amp; mô phỏng để người dùng chạy.</li>
<li><strong>Phân hệ tri thức (thông minh)</strong> — tuỳ chọn; cung cấp chuyên môn/luật, có thể tư vấn cho các phân hệ khác (đây là thứ làm DSS "thông minh").</li>
<li><strong>Phân hệ giao diện (đối thoại)</strong> — cách nhà quản lý nói chuyện với DSS: menu, biểu mẫu, dashboard, ngôn ngữ tự nhiên. Thường là phần quyết định thành bại.</li>
</ul>
<pre><code>          +---------------------+
 Người <->|  Giao diện người dùng |
          +----------+----------+
                     |
    +-------+--------+-------+--------+
    | QL dữ liệu | QL mô hình | Tri thức |
    +-------+--------+-------+--------+
    |  CSDL / kho  | Kho mô hình |  Luật   |
</code></pre>
<div class="callout"><span class="badge">Vì sao bốn phần</span> Tách dữ liệu, mô hình, tri thức và giao diện giúp mỗi phần tiến hoá độc lập — thêm mô hình mới mà không đụng CSDL, hoặc thiết kế lại dashboard mà không phá mô hình.</div>`,
  ]]);

const c3q = quiz('dss301-quiz-3', 'Quiz 3 — DSS architecture|||Quiz 3 — Kiến trúc DSS', [
  { id: 'q1', question: 'Phân hệ nào chứa "kho mô hình (model base)"?', options: ['Quản lý dữ liệu|||Data management', 'Quản lý mô hình|||Model management', 'Giao diện người dùng|||User interface', 'Phân hệ tri thức|||Knowledge subsystem'], correctIndex: 1, explanation: 'Model management chứa model base và phần mềm chạy mô hình.' },
  { id: 'q2', question: 'Phân hệ nào của DSS là TUỲ CHỌN và làm nó "thông minh"?', options: ['Quản lý dữ liệu|||Data', 'Giao diện người dùng|||UI', 'Phân hệ tri thức (knowledge-based)|||Knowledge-based', 'Kho dữ liệu|||Warehouse'], correctIndex: 2, explanation: 'Phân hệ tri thức cung cấp luật/chuyên môn — không bắt buộc.' },
  { id: 'q3', question: 'Phân hệ nào quyết định phần lớn việc người dùng có chịu dùng DSS không?', options: ['Giao diện (dialog) người dùng|||User interface', 'Quản lý mô hình|||Model management', 'DBMS', 'Phân hệ tri thức|||Knowledge'], correctIndex: 0, explanation: 'Giao diện/đối thoại thường là phần make-or-break của DSS.' },
]);

const c4 = doc('dss301-4-1-data-and-model', '4.1 — Data & model management|||4.1 — Quản lý dữ liệu & mô hình',
  'Kho dữ liệu (data warehouse) & ETL cho DSS; OLAP (slice/dice, drill-down, roll-up) vs OLTP; kho mô hình (model base) và các loại mô hình.',
  [[
    `<span class="eyebrow">DSS301 · Chapter 4 · Lesson 4.1</span>
<h2>Data &amp; model management</h2>
<h3>The data warehouse — feeding the DSS</h3>
<p>Operational databases (<strong>OLTP</strong>) are tuned for day-to-day transactions, not analysis. A <strong>data warehouse</strong> is a separate, subject-oriented, integrated, historical store built by <strong>ETL</strong> (extract, transform, load) — the reliable data source a DSS analyzes.</p>
<table>
<tr><th>OLTP</th><th>Data warehouse (OLAP)</th></tr>
<tr><td>Many small writes</td><td>Big analytical reads</td></tr>
<tr><td>Current data</td><td>Historical, aggregated</td></tr>
<tr><td>Run the business</td><td>Analyze the business</td></tr>
</table>
<h3>OLAP operations</h3>
<ul>
<li><strong>Slice &amp; dice</strong> — fix or filter a dimension (sales for Q1, for the North region).</li>
<li><strong>Drill-down / roll-up</strong> — move between detail and summary (year → quarter → month).</li>
<li><strong>Pivot</strong> — rotate the cube to see another face.</li>
</ul>
<h3>Model base</h3>
<p>The <strong>model base</strong> stores reusable models — strategic, tactical, operational — and analytical building blocks (regression, forecasting, optimization) the DSS runs on the warehoused data.</p>
<div class="callout"><span class="badge">Example</span> A retailer's DSS reads 3 years of sales from the warehouse, rolls up by region, and runs a forecasting model to plan next quarter's stock.</div>`,
    `<span class="eyebrow">DSS301 · Chương 4 · Bài 4.1</span>
<h2>Quản lý dữ liệu &amp; mô hình</h2>
<h3>Kho dữ liệu — nuôi DSS</h3>
<p>CSDL tác nghiệp (<strong>OLTP</strong>) tối ưu cho giao dịch hằng ngày, không phải để phân tích. <strong>Kho dữ liệu (data warehouse)</strong> là kho riêng, hướng chủ đề, tích hợp, lưu lịch sử, dựng bằng <strong>ETL</strong> (rút, biến đổi, nạp) — nguồn dữ liệu tin cậy để DSS phân tích.</p>
<table>
<tr><th>OLTP</th><th>Kho dữ liệu (OLAP)</th></tr>
<tr><td>Nhiều lệnh ghi nhỏ</td><td>Đọc phân tích lớn</td></tr>
<tr><td>Dữ liệu hiện tại</td><td>Lịch sử, tổng hợp</td></tr>
<tr><td>Vận hành doanh nghiệp</td><td>Phân tích doanh nghiệp</td></tr>
</table>
<h3>Các thao tác OLAP</h3>
<ul>
<li><strong>Slice &amp; dice</strong> — cố định hoặc lọc một chiều (doanh số Q1, vùng miền Bắc).</li>
<li><strong>Drill-down / roll-up</strong> — đi giữa chi tiết và tổng hợp (năm → quý → tháng).</li>
<li><strong>Pivot</strong> — xoay khối để nhìn mặt khác.</li>
</ul>
<h3>Kho mô hình</h3>
<p><strong>Kho mô hình (model base)</strong> lưu các mô hình tái dùng — chiến lược, chiến thuật, tác nghiệp — và khối phân tích (hồi quy, dự báo, tối ưu) mà DSS chạy trên dữ liệu trong kho.</p>
<div class="callout"><span class="badge">Ví dụ</span> DSS của nhà bán lẻ đọc 3 năm doanh số từ kho, roll-up theo vùng, và chạy mô hình dự báo để lập kế hoạch tồn kho quý tới.</div>`,
  ]]);

const c4q = quiz('dss301-quiz-4', 'Quiz 4 — Data & OLAP|||Quiz 4 — Dữ liệu & OLAP', [
  { id: 'q1', question: 'Kho dữ liệu (data warehouse) được dựng bằng quá trình nào?', options: ['ETL (rút–biến đổi–nạp)|||ETL', 'OLTP', 'KVL', 'RAID'], correctIndex: 0, explanation: 'ETL rút từ nguồn, biến đổi, nạp vào kho lịch sử tích hợp.' },
  { id: 'q2', question: 'Thao tác OLAP đi từ tổng hợp xuống chi tiết (năm → tháng) gọi là?', options: ['Roll-up', 'Drill-down', 'Slice', 'Pivot'], correctIndex: 1, explanation: 'Drill-down: đi xuống mức chi tiết hơn; roll-up thì ngược lại.' },
  { id: 'q3', question: 'So với OLTP, kho dữ liệu (OLAP) chủ yếu phục vụ?', options: ['Nhiều giao dịch ghi nhỏ|||Small writes', 'Đọc phân tích trên dữ liệu lịch sử, tổng hợp|||Analytical reads', 'Sao lưu đĩa|||Disk backup', 'Xác thực đăng nhập|||Login auth'], correctIndex: 1, explanation: 'OLTP vận hành; kho dữ liệu để phân tích dữ liệu lịch sử.' },
]);

const c5 = doc('dss301-5-1-whatif-optimization', '5.1 — What-if analysis & optimization|||5.1 — Phân tích what-if & tối ưu',
  'Phân tích độ nhạy (sensitivity); what-if và goal seek; tối ưu (quy hoạch tuyến tính, Solver); mô phỏng Monte Carlo cho bài toán bất định.',
  [[
    `<span class="eyebrow">DSS301 · Chapter 5 · Lesson 5.1</span>
<h2>What-if analysis &amp; optimization</h2>
<h3>Exploring a model</h3>
<ul>
<li><strong>Sensitivity analysis</strong> — how much does the result change when an input changes? Finds which assumptions really matter.</li>
<li><strong>What-if</strong> — set an input, read the output. ("If demand drops 10%, what's profit?")</li>
<li><strong>Goal seek</strong> — the reverse: fix the output, find the input. ("What price gives $1M profit?")</li>
</ul>
<h3>Optimization</h3>
<p>When you must find the <em>best</em> answer under constraints, use <strong>optimization</strong> — e.g. <strong>linear programming</strong> solved by Excel <strong>Solver</strong>: maximize profit subject to labor, material and budget limits. The solver returns the decision variables that hit the optimum.</p>
<pre><code>Maximize  Profit = 40*A + 30*B
Subject to  2*A + 1*B &lt;= 100   (labor)
            1*A + 2*B &lt;= 80    (material)
            A, B &gt;= 0
</code></pre>
<h3>Simulation</h3>
<p>When the future is uncertain, <strong>Monte Carlo simulation</strong> runs the model thousands of times with random inputs drawn from distributions, giving a <em>range</em> of outcomes and their probabilities — not one guess.</p>
<div class="callout"><span class="badge">Optimize vs simulate</span> Optimization finds the best decision under known conditions; simulation shows the risk profile when conditions are uncertain.</div>`,
    `<span class="eyebrow">DSS301 · Chương 5 · Bài 5.1</span>
<h2>Phân tích what-if &amp; tối ưu</h2>
<h3>Khám phá một mô hình</h3>
<ul>
<li><strong>Phân tích độ nhạy</strong> — kết quả đổi bao nhiêu khi một đầu vào đổi? Tìm ra giả định nào thực sự quan trọng.</li>
<li><strong>What-if</strong> — đặt đầu vào, đọc đầu ra. ("Nếu cầu giảm 10% thì lợi nhuận ra sao?")</li>
<li><strong>Goal seek</strong> — ngược lại: cố định đầu ra, tìm đầu vào. ("Giá nào cho lợi nhuận 1 triệu $?")</li>
</ul>
<h3>Tối ưu</h3>
<p>Khi phải tìm đáp án <em>tốt nhất</em> dưới ràng buộc, dùng <strong>tối ưu</strong> — vd <strong>quy hoạch tuyến tính</strong> giải bằng Excel <strong>Solver</strong>: tối đa lợi nhuận với giới hạn lao động, vật tư và ngân sách. Solver trả về biến quyết định đạt tối ưu.</p>
<pre><code>Tối đa  Lợi nhuận = 40*A + 30*B
Ràng buộc  2*A + 1*B &lt;= 100   (lao động)
           1*A + 2*B &lt;= 80    (vật tư)
           A, B &gt;= 0
</code></pre>
<h3>Mô phỏng</h3>
<p>Khi tương lai bất định, <strong>mô phỏng Monte Carlo</strong> chạy mô hình hàng nghìn lần với đầu vào ngẫu nhiên lấy từ phân phối, cho một <em>dải</em> kết quả và xác suất của chúng — không phải một con số đoán.</p>
<div class="callout"><span class="badge">Tối ưu vs mô phỏng</span> Tối ưu tìm quyết định tốt nhất khi điều kiện đã biết; mô phỏng cho thấy hồ sơ rủi ro khi điều kiện bất định.</div>`,
  ]]);

const c5q = quiz('dss301-quiz-5', 'Quiz 5 — What-if & optimization|||Quiz 5 — What-if & tối ưu', [
  { id: 'q1', question: '"Goal seek" khác "what-if" ở chỗ?', options: ['Cố định đầu ra, tìm đầu vào cần thiết|||Fix output, find input', 'Đặt đầu vào rồi xem đầu ra|||Set input, read output', 'Chạy mô hình ngẫu nhiên|||Random runs', 'Không dùng mô hình|||No model'], correctIndex: 0, explanation: 'Goal seek đi ngược: biết mục tiêu đầu ra, tìm đầu vào.' },
  { id: 'q2', question: 'Bài toán "tối đa lợi nhuận dưới ràng buộc tài nguyên" thường giải bằng?', options: ['Phân tích độ nhạy|||Sensitivity', 'Quy hoạch tuyến tính / Solver (tối ưu)|||Linear programming', 'Drill-down', 'ETL'], correctIndex: 1, explanation: 'Đây là tối ưu — quy hoạch tuyến tính, giải bằng Solver.' },
  { id: 'q3', question: 'Mô phỏng Monte Carlo phù hợp nhất khi?', options: ['Mọi đầu vào đã biết chắc|||Inputs certain', 'Đầu vào bất định, cần dải kết quả & xác suất|||Uncertain inputs', 'Chỉ có một phương án|||One option', 'Không có mô hình|||No model'], correctIndex: 1, explanation: 'Monte Carlo lặp nhiều lần với đầu vào ngẫu nhiên → phân phối kết quả.' },
]);

const c6 = doc('dss301-6-1-group-and-spatial', '6.1 — Group & spatial DSS|||6.1 — DSS nhóm & không gian',
  'GDSS (hỗ trợ nhóm ra quyết định, brainstorming/bỏ phiếu ẩn danh, giảm process loss); DSS không gian (Spatial DSS) & GIS; công cụ cộng tác.',
  [[
    `<span class="eyebrow">DSS301 · Chapter 6 · Lesson 6.1</span>
<h2>Group &amp; spatial DSS</h2>
<h3>Group DSS (GDSS)</h3>
<p>Many decisions are made by a <strong>group</strong>, not one person — and meetings suffer from <em>process losses</em>: domination by one voice, fear of speaking up, groupthink. A <strong>GDSS</strong> supports collaborative decisions with:</p>
<ul>
<li><strong>Anonymous input &amp; voting</strong> — ideas judged on merit, not on who said them.</li>
<li><strong>Parallel brainstorming</strong> — everyone contributes at once (no waiting your turn).</li>
<li><strong>Structured methods</strong> — multi-criteria ranking, consensus tools, an audit trail.</li>
</ul>
<p>It can be same-time/same-place (a decision room) or different-time/different-place (online).</p>
<h3>Spatial DSS &amp; GIS</h3>
<p>A <strong>Spatial DSS</strong> adds a <strong>Geographic Information System (GIS)</strong> so decisions with a <em>location</em> dimension can be mapped and analyzed: where to open a store, plan a delivery route, site a warehouse, or allocate emergency services. It overlays data (customers, roads, competitors) on a map and runs spatial models.</p>
<div class="callout"><span class="badge">Example</span> A coffee chain uses a spatial DSS to pick new store sites — overlaying foot traffic, rent and rival locations on a city map.</div>`,
    `<span class="eyebrow">DSS301 · Chương 6 · Bài 6.1</span>
<h2>DSS nhóm &amp; không gian</h2>
<h3>DSS nhóm (GDSS)</h3>
<p>Nhiều quyết định do một <strong>nhóm</strong> đưa ra, không phải một người — và họp hành hay bị <em>tổn thất quy trình</em>: một người áp đảo, ngại phát biểu, tư duy bầy đàn. <strong>GDSS</strong> hỗ trợ quyết định cộng tác bằng:</p>
<ul>
<li><strong>Nhập &amp; bỏ phiếu ẩn danh</strong> — ý tưởng xét theo giá trị, không theo người nói.</li>
<li><strong>Brainstorm song song</strong> — mọi người đóng góp cùng lúc (không phải chờ lượt).</li>
<li><strong>Phương pháp có cấu trúc</strong> — xếp hạng đa tiêu chí, công cụ đồng thuận, lưu vết.</li>
</ul>
<p>Có thể cùng-lúc/cùng-chỗ (phòng ra quyết định) hoặc khác-lúc/khác-chỗ (trực tuyến).</p>
<h3>DSS không gian &amp; GIS</h3>
<p><strong>DSS không gian (Spatial DSS)</strong> thêm <strong>hệ thông tin địa lý (GIS)</strong> để các quyết định có chiều <em>vị trí</em> được đưa lên bản đồ và phân tích: mở cửa hàng ở đâu, vạch tuyến giao hàng, đặt kho, hay phân bổ dịch vụ khẩn cấp. Nó phủ dữ liệu (khách, đường, đối thủ) lên bản đồ và chạy mô hình không gian.</p>
<div class="callout"><span class="badge">Ví dụ</span> Chuỗi cà phê dùng DSS không gian để chọn vị trí mở quán — phủ lưu lượng người đi bộ, giá thuê và vị trí đối thủ lên bản đồ thành phố.</div>`,
  ]]);

const c6q = quiz('dss301-quiz-6', 'Quiz 6 — Group & spatial DSS|||Quiz 6 — DSS nhóm & không gian', [
  { id: 'q1', question: 'GDSS dùng "nhập & bỏ phiếu ẩn danh" chủ yếu để?', options: ['Tăng tốc mạng|||Faster network', 'Giảm tổn thất quy trình (áp đảo, ngại nói)|||Reduce process loss', 'Lưu ít dữ liệu hơn|||Save storage', 'Mã hoá dữ liệu|||Encryption'], correctIndex: 1, explanation: 'Ẩn danh giúp ý tưởng xét theo giá trị, giảm áp đảo/tư duy bầy đàn.' },
  { id: 'q2', question: 'DSS không gian (Spatial DSS) thường tích hợp công nghệ nào?', options: ['GIS (hệ thông tin địa lý)|||GIS', 'OLTP', 'RAID', 'ETL'], correctIndex: 0, explanation: 'Spatial DSS gắn GIS để phân tích quyết định theo vị trí.' },
  { id: 'q3', question: 'Bài toán nào hợp nhất với DSS không gian?', options: ['Chọn vị trí mở cửa hàng / vạch tuyến giao hàng|||Store siting / routing', 'Tính lương nhân viên|||Payroll', 'Sắp xếp email|||Email sorting', 'Nén ảnh|||Image compression'], correctIndex: 0, explanation: 'Quyết định có chiều vị trí (siting, routing) là sở trường của spatial DSS.' },
]);

const c7 = doc('dss301-7-1-expert-intelligent', '7.1 — Expert systems & intelligent DSS|||7.1 — Hệ chuyên gia & DSS thông minh',
  'Hệ chuyên gia (knowledge base + inference engine, luật IF-THEN); ưu/nhược; AI/ML trong DSS (dự báo, phân loại, gợi ý); ranh giới hỗ trợ vs thay thế.',
  [[
    `<span class="eyebrow">DSS301 · Chapter 7 · Lesson 7.1</span>
<h2>Expert systems &amp; intelligent DSS</h2>
<h3>Expert systems</h3>
<p>An <strong>expert system (ES)</strong> captures a human expert's knowledge as <strong>IF-THEN rules</strong> and reasons over them to give advice. Its two core parts:</p>
<ul>
<li><strong>Knowledge base</strong> — the rules &amp; facts, elicited from experts.</li>
<li><strong>Inference engine</strong> — chains rules to reach a conclusion (forward or backward chaining), and can <em>explain</em> its reasoning.</li>
</ul>
<pre><code>IF   symptom = fever AND rash = true
THEN diagnosis = measles  (confidence 0.8)
</code></pre>
<p><strong>Pros:</strong> consistent, available 24/7, captures scarce expertise. <strong>Cons:</strong> brittle outside its narrow domain, hard to maintain rules, no common sense.</p>
<h3>AI / ML in modern DSS</h3>
<p>Today's <strong>intelligent DSS</strong> lean on machine learning: <strong>regression/forecasting</strong> (demand, churn), <strong>classification</strong> (fraud, credit risk), <strong>clustering</strong> (customer segments), and <strong>recommenders</strong>. The model learns patterns from data rather than hand-coded rules.</p>
<div class="callout"><span class="badge">Support, not replace</span> Even an intelligent DSS advises — a human owns the decision and its accountability, especially for high-stakes, semi-structured calls.</div>`,
    `<span class="eyebrow">DSS301 · Chương 7 · Bài 7.1</span>
<h2>Hệ chuyên gia &amp; DSS thông minh</h2>
<h3>Hệ chuyên gia</h3>
<p>Một <strong>hệ chuyên gia (ES)</strong> nắm bắt tri thức của chuyên gia dưới dạng <strong>luật IF-THEN</strong> và suy luận trên đó để đưa lời khuyên. Hai phần lõi:</p>
<ul>
<li><strong>Cơ sở tri thức</strong> — luật &amp; sự kiện, trích từ chuyên gia.</li>
<li><strong>Máy suy diễn</strong> — chuỗi các luật để đến kết luận (suy diễn tiến hoặc lùi), và có thể <em>giải thích</em> lập luận.</li>
</ul>
<pre><code>IF   triệu chứng = sốt AND phát ban = true
THEN chẩn đoán = sởi  (độ tin 0.8)
</code></pre>
<p><strong>Ưu:</strong> nhất quán, chạy 24/7, giữ được chuyên môn hiếm. <strong>Nhược:</strong> dễ vỡ ngoài phạm vi hẹp, khó bảo trì luật, không có lẽ thường.</p>
<h3>AI / ML trong DSS hiện đại</h3>
<p><strong>DSS thông minh</strong> ngày nay dựa vào học máy: <strong>hồi quy/dự báo</strong> (cầu, rời bỏ), <strong>phân loại</strong> (gian lận, rủi ro tín dụng), <strong>gom cụm</strong> (phân khúc khách), và <strong>gợi ý</strong>. Mô hình học quy luật từ dữ liệu thay vì luật viết tay.</p>
<div class="callout"><span class="badge">Hỗ trợ, không thay thế</span> Kể cả DSS thông minh cũng chỉ tư vấn — con người sở hữu quyết định và trách nhiệm, nhất là với các quyết định bán cấu trúc, rủi ro cao.</div>`,
  ]]);

const c7q = quiz('dss301-quiz-7', 'Quiz 7 — Expert & intelligent DSS|||Quiz 7 — Hệ chuyên gia & DSS thông minh', [
  { id: 'q1', question: 'Hai phần lõi của một hệ chuyên gia là?', options: ['Cơ sở tri thức + máy suy diễn|||Knowledge base + inference engine', 'CPU + RAM', 'OLTP + OLAP', 'ETL + kho dữ liệu|||ETL + warehouse'], correctIndex: 0, explanation: 'ES = knowledge base (luật) + inference engine (suy diễn).' },
  { id: 'q2', question: 'Tri thức trong hệ chuyên gia cổ điển được biểu diễn chủ yếu bằng?', options: ['Luật IF-THEN|||IF-THEN rules', 'Bảng quan hệ|||Relational tables', 'Sóng sin|||Sine waves', 'Bản đồ GIS|||GIS maps'], correctIndex: 0, explanation: 'ES suy luận trên các luật IF-THEN elicit từ chuyên gia.' },
  { id: 'q3', question: 'Nhược điểm điển hình của hệ chuyên gia là?', options: ['Chạy quá nhanh|||Too fast', 'Dễ vỡ ngoài phạm vi hẹp, thiếu lẽ thường|||Brittle, no common sense', 'Không nhất quán|||Inconsistent', 'Không giải thích được|||No explanation'], correctIndex: 1, explanation: 'ES giòn ngoài domain hẹp, khó bảo trì luật, thiếu common sense.' },
]);

const c8 = doc('dss301-8-1-bi-dashboard-trends', '8.1 — BI, dashboards & trends|||8.1 — BI, dashboard & xu hướng',
  'Business Intelligence (BI); dashboard & KPI/visual analytics; big data analytics; ba mức phân tích (descriptive/predictive/prescriptive); ví dụ thật.',
  [[
    `<span class="eyebrow">DSS301 · Chapter 8 · Lesson 8.1</span>
<h2>BI, dashboards &amp; trends</h2>
<h3>Business Intelligence (BI)</h3>
<p><strong>BI</strong> is the umbrella for turning raw data into insight: data warehouse + OLAP + reporting + dashboards. It is DSS grown to enterprise scale — self-service, so managers explore data without writing SQL.</p>
<h3>Dashboards</h3>
<p>A <strong>dashboard</strong> shows the key <strong>KPIs</strong> on one screen — visual, at-a-glance, drillable. Good ones follow the data-ink rule: show the number and its trend, cut the chart junk. Tools: Power BI, Tableau.</p>
<h3>Three levels of analytics</h3>
<ul>
<li><strong>Descriptive</strong> — what happened? (reports, dashboards)</li>
<li><strong>Predictive</strong> — what will happen? (forecasting, ML)</li>
<li><strong>Prescriptive</strong> — what should we do? (optimization, recommendations) — the frontier.</li>
</ul>
<h3>Big data &amp; the future</h3>
<p><strong>Big data analytics</strong> (volume, velocity, variety) plus cloud and AI push DSS toward real-time, prescriptive, and increasingly automated support.</p>
<div class="callout"><span class="badge">Example</span> Netflix &amp; Amazon: dashboards track engagement (descriptive), ML forecasts demand (predictive), and recommenders decide what to show you next (prescriptive) — a full modern DSS stack.</div>`,
    `<span class="eyebrow">DSS301 · Chương 8 · Bài 8.1</span>
<h2>BI, dashboard &amp; xu hướng</h2>
<h3>Business Intelligence (BI)</h3>
<p><strong>BI</strong> là ô lớn biến dữ liệu thô thành hiểu biết: kho dữ liệu + OLAP + báo cáo + dashboard. Đó là DSS phóng lên quy mô doanh nghiệp — tự phục vụ, để nhà quản lý khám phá dữ liệu mà không cần viết SQL.</p>
<h3>Dashboard</h3>
<p>Một <strong>dashboard</strong> đưa các <strong>KPI</strong> then chốt lên một màn hình — trực quan, nhìn phát hiểu, có thể drill. Cái tốt theo quy tắc data-ink: hiện con số và xu hướng, bỏ trang trí thừa. Công cụ: Power BI, Tableau.</p>
<h3>Ba mức phân tích</h3>
<ul>
<li><strong>Mô tả (descriptive)</strong> — đã xảy ra gì? (báo cáo, dashboard)</li>
<li><strong>Dự đoán (predictive)</strong> — sắp xảy ra gì? (dự báo, ML)</li>
<li><strong>Đề xuất (prescriptive)</strong> — nên làm gì? (tối ưu, gợi ý) — biên giới mới.</li>
</ul>
<h3>Big data &amp; tương lai</h3>
<p><strong>Phân tích dữ liệu lớn</strong> (khối lượng, vận tốc, đa dạng) cùng đám mây và AI đẩy DSS về phía thời gian thực, đề xuất, và hỗ trợ ngày càng tự động.</p>
<div class="callout"><span class="badge">Ví dụ</span> Netflix &amp; Amazon: dashboard theo dõi tương tác (mô tả), ML dự báo cầu (dự đoán), và gợi ý quyết định hiển thị gì kế tiếp (đề xuất) — một chồng DSS hiện đại đầy đủ.</div>`,
  ]]);

const c8q = quiz('dss301-quiz-8', 'Quiz 8 — BI & trends|||Quiz 8 — BI & xu hướng', [
  { id: 'q1', question: 'Ba mức phân tích theo thứ tự "trưởng thành" là?', options: ['Prescriptive → predictive → descriptive', 'Descriptive → predictive → prescriptive', 'Predictive → descriptive → prescriptive', 'Descriptive → prescriptive → predictive'], correctIndex: 1, explanation: 'Mô tả (đã xảy ra) → dự đoán (sắp xảy ra) → đề xuất (nên làm gì).' },
  { id: 'q2', question: 'Phân tích "prescriptive" trả lời câu hỏi nào?', options: ['Đã xảy ra gì?|||What happened?', 'Nên làm gì? (tối ưu/gợi ý)|||What should we do?', 'Dữ liệu lưu ở đâu?|||Where stored?', 'Ai đăng nhập?|||Who logged in?'], correctIndex: 1, explanation: 'Prescriptive khuyến nghị hành động — tối ưu, gợi ý.' },
  { id: 'q3', question: 'Một dashboard tốt nên?', options: ['Nhồi càng nhiều biểu đồ trang trí càng tốt|||Max chart junk', 'Hiện KPI then chốt, trực quan, nhìn phát hiểu, drill được|||Key KPIs, glanceable, drillable', 'Chỉ hiện bảng số thô|||Raw tables only', 'Ẩn mọi con số|||Hide numbers'], correctIndex: 1, explanation: 'Dashboard tốt: KPI then chốt, trực quan, drill được, ít trang trí thừa.' },
]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'DSS301',
    slug: 'dss301-decision-support-system',
    title: 'Decision Support System',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/DSS301.webp',
    shortDescription: 'How organizations decide better with data & models — decision types (Simon), the intelligence-design-choice process, DSS architecture, data warehouse & OLAP, what-if & optimization, expert systems and BI dashboards. Bilingual, with examples & quizzes.|||Ra quyết định tốt hơn bằng dữ liệu & mô hình — loại quyết định (Simon), quy trình trí tuệ-thiết kế-lựa chọn, kiến trúc DSS, kho dữ liệu & OLAP, what-if & tối ưu, hệ chuyên gia và dashboard BI. Song ngữ, có ví dụ & quiz.',
    description: 'Môn <strong>DSS301 — Decision Support System</strong> (Hệ hỗ trợ ra quyết định, kỳ 7, ngành Hệ thống thông tin) giúp bạn hiểu <strong>cách tổ chức ra quyết định tốt hơn bằng dữ liệu và mô hình</strong>. Từ <strong>khái niệm &amp; loại quyết định</strong> (Simon) → <strong>quy trình &amp; mô hình</strong> (trí tuệ-thiết kế-lựa chọn) → <strong>kiến trúc DSS</strong> (dữ liệu / mô hình / tri thức / giao diện) → <strong>kho dữ liệu &amp; OLAP</strong> → <strong>what-if &amp; tối ưu</strong> → <strong>DSS nhóm &amp; không gian</strong> → <strong>hệ chuyên gia &amp; AI/ML</strong> → <strong>BI, dashboard &amp; xu hướng</strong>. Bám giáo trình chuẩn quốc tế (Turban, Power, Sharda), song ngữ, có mô hình và ví dụ ứng dụng thật, quiz mỗi chương.',
    whatYouLearn: 'Loại quyết định của Simon (structured/semi/unstructured); quy trình Intelligence-Design-Choice &amp; mô hình hoá (biến quyết định, ràng buộc, mục tiêu); bốn phân hệ DSS (data/model/knowledge/UI); kho dữ liệu, ETL, OLAP (slice/dice, drill-down); phân tích độ nhạy, what-if, goal seek, tối ưu (LP/Solver), mô phỏng Monte Carlo; GDSS &amp; DSS không gian (GIS); hệ chuyên gia (IF-THEN, inference engine) &amp; AI/ML; BI, dashboard/KPI và ba mức phân tích (descriptive/predictive/prescriptive).',
    requirements: 'Nên biết cơ sở dữ liệu cơ bản và dùng bảng tính (Excel). Xem điều kiện tiên quyết của môn trong khung chương trình ngành Hệ thống thông tin trên FLM.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách chuẩn (Turban/Power/Sharda), tài liệu, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'DSS là gì, giải bài toán nào, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — DSS là gì|||Chapter 1 — What a DSS is', description: 'Ra quyết định, loại quyết định Simon, vai trò & phân loại DSS.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Quy trình & mô hình|||Chapter 2 — Process & models', description: 'Simon: intelligence/design/choice; mô hình hoá bài toán.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Kiến trúc DSS|||Chapter 3 — DSS architecture', description: 'Bốn phân hệ: data / model / knowledge / UI.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Dữ liệu & mô hình|||Chapter 4 — Data & models', description: 'Kho dữ liệu, ETL, OLAP; kho mô hình cho DSS.', lessons: [c4, c4q] },
    { title: 'Chương 5 — What-if & tối ưu|||Chapter 5 — What-if & optimization', description: 'Độ nhạy, goal seek, tối ưu (Solver), mô phỏng.', lessons: [c5, c5q] },
    { title: 'Chương 6 — DSS nhóm & không gian|||Chapter 6 — Group & spatial DSS', description: 'GDSS, spatial DSS/GIS, cộng tác.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Hệ chuyên gia & DSS thông minh|||Chapter 7 — Expert & intelligent DSS', description: 'Expert system, luật IF-THEN, AI/ML trong DSS.', lessons: [c7, c7q] },
    { title: 'Chương 8 — BI, dashboard & xu hướng|||Chapter 8 — BI, dashboards & trends', description: 'BI, dashboard/KPI, big data, prescriptive analytics.', lessons: [c8, c8q] },
  ],
};
