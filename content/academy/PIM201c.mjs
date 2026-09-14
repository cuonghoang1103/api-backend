/**
 * PIM201c — Project and Innovation Management (Quản lý Dự án & Đổi mới sáng tạo).
 * Ngành Chuyển đổi số, Kỳ 8, FPTU. Song ngữ VI+EN, 8 chương (mỗi chương 1
 * DOCUMENT + 1 QUIZ 3 câu). Giáo trình: PMI PMBOK Guide; Schwalbe "IT Project
 * Management"; Tidd/Bessant "Managing Innovation"; Osterwalder "Business Model
 * Generation"; Ries "The Lean Startup" — TRÍCH DẪN, không upload PDF.
 * Giữ NGUYÊN slug/semester/courseCode/thumbnailUrl. ⚠️ KHÔNG backtick/${ lồng;
 * HTML dùng &amp; ; escape "<" thành &lt; ; shortDescription dùng "&" thường.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('pim201c-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn (PMBOK, Schwalbe, Tidd/Bessant, Osterwalder, Ries), tài liệu miễn phí, YouTube, công cụ.',
  [[
    `<span class="eyebrow">PIM201c · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Project and Innovation Management</strong> — from the project life cycle and WBS to Agile, Design Thinking, the Lean Startup and the Business Model Canvas — in one place. The official slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU syllabus &amp; lecture slides for PIM201c are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books (the standards this course cites)</h3>
<ul>
<li><a href="https://www.pmi.org/pmbok-guide-standards" target="_blank" rel="noopener">PMI — <em>A Guide to the Project Management Body of Knowledge (PMBOK Guide)</em></a></li>
<li><a href="https://www.cengage.com/c/information-technology-project-management-9e-schwalbe/" target="_blank" rel="noopener">Kathy Schwalbe — <em>Information Technology Project Management</em></a></li>
<li><a href="https://www.wiley.com/en-us/Managing+Innovation-p-9781119713302" target="_blank" rel="noopener">Tidd &amp; Bessant — <em>Managing Innovation</em></a></li>
<li><a href="https://www.strategyzer.com/library/the-business-model-canvas" target="_blank" rel="noopener">Osterwalder &amp; Pigneur — <em>Business Model Generation</em></a></li>
<li><a href="https://theleanstartup.com/" target="_blank" rel="noopener">Eric Ries — <em>The Lean Startup</em></a></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.pmi.org/" target="_blank" rel="noopener">PMI — Project Management Institute</a></li>
<li><a href="https://scrumguides.org/" target="_blank" rel="noopener">The Scrum Guide (Schwaber &amp; Sutherland) — free PDF</a></li>
<li><a href="https://www.atlassian.com/agile" target="_blank" rel="noopener">Atlassian Agile Coach — Scrum, Kanban, backlog</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@ProjectManagementVideos" target="_blank" rel="noopener">Project Management Videos</a> — PMBOK &amp; PMP walkthroughs</li>
<li><a href="https://www.youtube.com/@Strategyzer" target="_blank" rel="noopener">Strategyzer</a> — Business Model Canvas &amp; value proposition</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.atlassian.com/software/jira" target="_blank" rel="noopener">Jira</a> — Agile boards, backlog &amp; sprints</li>
<li><a href="https://trello.com/" target="_blank" rel="noopener">Trello</a> — lightweight Kanban</li>
<li><a href="https://www.strategyzer.com/canvas" target="_blank" rel="noopener">Strategyzer Canvas</a> — Business Model &amp; Value Proposition canvas online</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — project vs operations, triple constraint, life cycle &amp; process groups, WBS and the critical path.</li>
<li><strong>Practice</strong> — draft a charter, a WBS and a Gantt chart for a small project until scope, time and cost line up.</li>
<li><strong>Go deeper</strong> — risk &amp; quality, Agile/Scrum, then the innovation side: innovation types, Design Thinking, Lean Startup and the Business Model Canvas.</li>
<li><strong>Job-ready</strong> — run a real mini-project in Jira/Trello and pitch a business model on one canvas page.</li>
</ol></div>`,
    `<span class="eyebrow">PIM201c · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Quản lý Dự án &amp; Đổi mới sáng tạo</strong> — từ vòng đời dự án và WBS đến Agile, Design Thinking, Lean Startup và Business Model Canvas — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của PIM201c có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách chuẩn (những cuốn môn này trích dẫn)</h3>
<ul>
<li><a href="https://www.pmi.org/pmbok-guide-standards" target="_blank" rel="noopener">PMI — <em>Cẩm nang Kiến thức Quản lý Dự án (PMBOK Guide)</em></a></li>
<li><a href="https://www.cengage.com/c/information-technology-project-management-9e-schwalbe/" target="_blank" rel="noopener">Kathy Schwalbe — <em>Information Technology Project Management</em></a></li>
<li><a href="https://www.wiley.com/en-us/Managing+Innovation-p-9781119713302" target="_blank" rel="noopener">Tidd &amp; Bessant — <em>Managing Innovation</em></a></li>
<li><a href="https://www.strategyzer.com/library/the-business-model-canvas" target="_blank" rel="noopener">Osterwalder &amp; Pigneur — <em>Business Model Generation</em></a></li>
<li><a href="https://theleanstartup.com/" target="_blank" rel="noopener">Eric Ries — <em>The Lean Startup</em></a></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.pmi.org/" target="_blank" rel="noopener">PMI — Viện Quản lý Dự án</a></li>
<li><a href="https://scrumguides.org/" target="_blank" rel="noopener">The Scrum Guide (Schwaber &amp; Sutherland) — PDF miễn phí</a></li>
<li><a href="https://www.atlassian.com/agile" target="_blank" rel="noopener">Atlassian Agile Coach — Scrum, Kanban, backlog</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@ProjectManagementVideos" target="_blank" rel="noopener">Project Management Videos</a> — giảng PMBOK &amp; PMP</li>
<li><a href="https://www.youtube.com/@Strategyzer" target="_blank" rel="noopener">Strategyzer</a> — Business Model Canvas &amp; đề xuất giá trị</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.atlassian.com/software/jira" target="_blank" rel="noopener">Jira</a> — bảng Agile, backlog &amp; sprint</li>
<li><a href="https://trello.com/" target="_blank" rel="noopener">Trello</a> — Kanban nhẹ</li>
<li><a href="https://www.strategyzer.com/canvas" target="_blank" rel="noopener">Strategyzer Canvas</a> — Business Model &amp; Value Proposition canvas trực tuyến</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — dự án khác vận hành, tam giác ràng buộc, vòng đời &amp; nhóm quy trình, WBS và đường găng.</li>
<li><strong>Luyện tập</strong> — soạn một bản điều lệ, một WBS và một Gantt cho dự án nhỏ đến khi phạm vi, thời gian, chi phí khớp nhau.</li>
<li><strong>Đào sâu</strong> — rủi ro &amp; chất lượng, Agile/Scrum, rồi sang mảng đổi mới: các loại đổi mới, Design Thinking, Lean Startup và Business Model Canvas.</li>
<li><strong>Sẵn sàng đi làm</strong> — chạy một mini-project thật trên Jira/Trello và trình bày mô hình kinh doanh gọn trên một trang canvas.</li>
</ol></div>`,
  ]]);

const intro = doc('pim201c-0-1-overview', 'Course overview: managing projects & innovation|||Tổng quan: quản lý dự án & đổi mới sáng tạo',
  'Dự án là gì, khác vận hành; tam giác ràng buộc phạm vi–thời gian–chi phí; lộ trình: quản lý dự án (khởi tạo → kế hoạch → rủi ro → Agile) rồi đổi mới sáng tạo (mô hình đổi mới → Design Thinking/Lean/BMC → chuyển đổi số).',
  [[
    `<span class="eyebrow">PIM201c · Lesson 0.1 · Overview</span>
<h2>Managing projects &amp; innovation</h2>
<p class="lead">This course pairs two skills that decide whether a good idea ever reaches customers: <strong>project management</strong> (delivering work on scope, on time, on budget) and <strong>innovation management</strong> (turning novel ideas into value). You'll follow the discipline of PMI's <em>PMBOK Guide</em> and Schwalbe, then the innovation playbooks of Tidd &amp; Bessant, Osterwalder and Ries.</p>
<h3>What is a project?</h3>
<p>A <strong>project</strong> is a <em>temporary</em> effort that creates a <em>unique</em> product, service or result — it has a start and an end. That is the opposite of <strong>operations</strong>, which are ongoing and repetitive (running payroll every month). Building a new payroll app is a project; running it forever is operations.</p>
<h3>The triple constraint</h3>
<pre><code>          SCOPE
           /\\
          /  \\
         /    \\
     TIME ---- COST      (quality sits in the middle)

Change one side and at least one other must move.
Add scope -> need more time or more cost (or quality drops).
</code></pre>
<h3>Roadmap</h3>
<p>Part one — <strong>project management</strong>: life cycle &amp; process groups, initiation &amp; scope, planning (WBS, schedule, cost), risk &amp; quality, Agile/Scrum. Part two — <strong>innovation</strong>: innovation types &amp; models, Design Thinking + Lean Startup + Business Model Canvas, and innovation inside digital transformation. Bilingual, with templates and a quiz each chapter.</p>`,
    `<span class="eyebrow">PIM201c · Bài 0.1 · Tổng quan</span>
<h2>Quản lý dự án &amp; đổi mới sáng tạo</h2>
<p class="lead">Môn này ghép hai kỹ năng quyết định một ý tưởng hay có tới được khách hàng hay không: <strong>quản lý dự án</strong> (giao việc đúng phạm vi, đúng hạn, đúng ngân sách) và <strong>quản lý đổi mới</strong> (biến ý tưởng mới thành giá trị). Bạn theo kỷ luật của <em>PMBOK Guide</em> (PMI) và Schwalbe, rồi các cẩm nang đổi mới của Tidd &amp; Bessant, Osterwalder và Ries.</p>
<h3>Dự án là gì?</h3>
<p>Một <strong>dự án</strong> là nỗ lực <em>có thời hạn</em> tạo ra sản phẩm, dịch vụ hay kết quả <em>duy nhất</em> — có điểm bắt đầu và kết thúc. Ngược lại là <strong>vận hành</strong> — lặp đi lặp lại, liên tục (chạy bảng lương mỗi tháng). Xây một app tính lương mới là dự án; vận hành nó mãi là vận hành.</p>
<h3>Tam giác ràng buộc</h3>
<pre><code>         PHẠM VI
           /\\
          /  \\
         /    \\
   THỜI GIAN -- CHI PHÍ   (chất lượng nằm ở giữa)

Đổi một cạnh thì ít nhất một cạnh khác phải đổi theo.
Thêm phạm vi -> cần thêm thời gian hoặc chi phí (hoặc chất lượng giảm).
</code></pre>
<h3>Lộ trình</h3>
<p>Phần một — <strong>quản lý dự án</strong>: vòng đời &amp; nhóm quy trình, khởi tạo &amp; phạm vi, lập kế hoạch (WBS, lịch trình, chi phí), rủi ro &amp; chất lượng, Agile/Scrum. Phần hai — <strong>đổi mới</strong>: các loại &amp; mô hình đổi mới, Design Thinking + Lean Startup + Business Model Canvas, và đổi mới trong chuyển đổi số. Song ngữ, có mẫu và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('pim201c-1-1-lifecycle', '1.1 — Project management overview & life cycle|||1.1 — Tổng quan quản lý dự án & vòng đời',
  'Vai trò PM & bên liên quan; vòng đời dự án (predictive/adaptive); 5 nhóm quy trình PMBOK (khởi tạo, lập kế hoạch, thực thi, giám sát-kiểm soát, kết thúc); tam giác ràng buộc.',
  [[
    `<span class="eyebrow">PIM201c · Chapter 1 · Lesson 1.1</span>
<h2>Project management overview &amp; life cycle</h2>
<h3>The project manager</h3>
<p>The <strong>project manager (PM)</strong> is accountable for meeting the objectives — balancing scope, time, cost, quality, risk and stakeholders. The PM plans, coordinates the team, communicates, and controls change. Beside the PM sit the <strong>sponsor</strong> (funds &amp; champions the project) and the <strong>stakeholders</strong> (anyone affected by it).</p>
<h3>Project life cycle</h3>
<p>Every project moves through phases from start to close. There are two broad shapes:</p>
<ul>
<li><strong>Predictive (waterfall)</strong> — scope is fixed up front; phases run in sequence. Good when requirements are stable.</li>
<li><strong>Adaptive (Agile)</strong> — work is delivered in short iterations and scope is refined as you learn. Good when requirements are uncertain (most software).</li>
</ul>
<h3>PMBOK — five process groups</h3>
<pre><code>1. Initiating    -> define &amp; authorize (charter)
2. Planning      -> scope, WBS, schedule, cost, risk, quality
3. Executing     -> do the work, build the deliverables
4. Monitoring &amp;  -> track progress vs plan, manage change
   Controlling
5. Closing       -> hand over, capture lessons learned
</code></pre>
<p>These are <em>groups of processes</em>, not rigid stages — planning and monitoring repeat throughout.</p>
<div class="callout"><span class="badge">Triple constraint</span> Scope, time and cost are linked; quality depends on all three. A PM's daily job is keeping that triangle in balance as reality pushes on each corner.</div>`,
    `<span class="eyebrow">PIM201c · Chương 1 · Bài 1.1</span>
<h2>Tổng quan quản lý dự án &amp; vòng đời</h2>
<h3>Người quản lý dự án</h3>
<p><strong>Người quản lý dự án (PM)</strong> chịu trách nhiệm đạt mục tiêu — cân bằng phạm vi, thời gian, chi phí, chất lượng, rủi ro và các bên liên quan. PM lập kế hoạch, điều phối đội, giao tiếp và kiểm soát thay đổi. Bên cạnh PM có <strong>nhà tài trợ (sponsor)</strong> (cấp tiền &amp; bảo trợ dự án) và <strong>các bên liên quan (stakeholder)</strong> (mọi ai bị ảnh hưởng).</p>
<h3>Vòng đời dự án</h3>
<p>Mọi dự án đi qua các pha từ khởi đầu tới kết thúc. Có hai dạng lớn:</p>
<ul>
<li><strong>Dự báo (thác nước)</strong> — phạm vi cố định từ đầu; các pha chạy tuần tự. Hợp khi yêu cầu ổn định.</li>
<li><strong>Thích ứng (Agile)</strong> — giao việc theo vòng lặp ngắn, phạm vi tinh chỉnh dần khi học được. Hợp khi yêu cầu chưa chắc (đa số phần mềm).</li>
</ul>
<h3>PMBOK — năm nhóm quy trình</h3>
<pre><code>1. Khởi tạo        -> xác định &amp; ủy quyền (điều lệ)
2. Lập kế hoạch    -> phạm vi, WBS, lịch, chi phí, rủi ro, chất lượng
3. Thực thi        -> làm việc, tạo sản phẩm bàn giao
4. Giám sát &amp;      -> theo dõi tiến độ so kế hoạch, quản lý thay đổi
   kiểm soát
5. Kết thúc        -> bàn giao, ghi lại bài học
</code></pre>
<p>Đây là <em>nhóm quy trình</em>, không phải các bước cứng — lập kế hoạch và giám sát lặp lại suốt dự án.</p>
<div class="callout"><span class="badge">Tam giác ràng buộc</span> Phạm vi, thời gian, chi phí gắn với nhau; chất lượng phụ thuộc cả ba. Việc hằng ngày của PM là giữ tam giác đó cân bằng khi thực tế đẩy vào từng góc.</div>`,
  ]]);

const c1q = quiz('pim201c-quiz-1', 'Quiz 1 — Life cycle|||Quiz 1 — Vòng đời', [
  { id: 'q1', question: 'Điểm khác biệt cốt lõi giữa "dự án" và "vận hành" là?', options: ['Dự án luôn lớn hơn vận hành', 'Dự án có thời hạn và tạo kết quả duy nhất, vận hành lặp lại liên tục', 'Vận hành không cần quản lý', 'Dự án không có ngân sách'], correctIndex: 1, explanation: 'Dự án là nỗ lực CÓ THỜI HẠN tạo ra kết quả DUY NHẤT; vận hành là hoạt động lặp lại, liên tục.' },
  { id: 'q2', question: 'Năm nhóm quy trình PMBOK theo đúng thứ tự là?', options: ['Lập kế hoạch → Khởi tạo → Thực thi → Kết thúc → Giám sát', 'Khởi tạo → Lập kế hoạch → Thực thi → Giám sát & kiểm soát → Kết thúc', 'Thực thi → Khởi tạo → Kết thúc → Lập kế hoạch → Giám sát', 'Khởi tạo → Thực thi → Lập kế hoạch → Kết thúc → Giám sát'], correctIndex: 1, explanation: 'Trình tự PMBOK: Khởi tạo → Lập kế hoạch → Thực thi → Giám sát & kiểm soát → Kết thúc.' },
  { id: 'q3', question: 'Trong tam giác ràng buộc, khi thêm phạm vi mà giữ nguyên chất lượng thì?', options: ['Không ảnh hưởng gì', 'Phải tăng thời gian và/hoặc chi phí', 'Chi phí luôn giảm', 'Thời gian tự rút ngắn'], correctIndex: 1, explanation: 'Ba cạnh liên kết: thêm phạm vi thì phải thêm thời gian hoặc chi phí, nếu không chất lượng sẽ giảm.' },
]);

const c2 = doc('pim201c-2-1-initiation-scope', '2.1 — Initiation, scope & stakeholders|||2.1 — Khởi tạo, phạm vi & bên liên quan',
  'Bản điều lệ dự án (charter); tuyên bố phạm vi & tiêu chí nghiệm thu; scope creep; phân tích bên liên quan bằng ma trận Quyền lực–Quan tâm.',
  [[
    `<span class="eyebrow">PIM201c · Chapter 2 · Lesson 2.1</span>
<h2>Initiation, scope &amp; stakeholders</h2>
<h3>The project charter</h3>
<p>Initiation produces the <strong>project charter</strong> — a short document that <em>authorizes</em> the project, names the PM, and states the objective, high-level scope, sponsor and success criteria. No charter, no mandate.</p>
<h3>Defining scope</h3>
<p>The <strong>scope statement</strong> lists what is <em>in</em> and — just as important — what is <em>out</em>. Unmanaged additions are <strong>scope creep</strong>: features quietly pile on until time and cost blow up. Every change goes through change control.</p>
<pre><code>Scope statement (extract)
  In scope : login, product list, cart, VNPay checkout
  Out       : loyalty points, multi-language, native mobile app
  Acceptance: user can buy 1 item end-to-end in under 3 minutes
</code></pre>
<h3>Stakeholder analysis</h3>
<p>Map stakeholders on a <strong>power / interest grid</strong> and treat each quadrant differently:</p>
<pre><code>            INTEREST low        INTEREST high
POWER high  Keep satisfied      Manage closely
POWER low   Monitor             Keep informed
</code></pre>
<div class="callout"><span class="badge">Tip</span> The sponsor is usually high power / high interest — manage closely. A regulator may be high power / low interest — keep satisfied. Get this map wrong and the loudest voice, not the most important one, steers the project.</div>`,
    `<span class="eyebrow">PIM201c · Chương 2 · Bài 2.1</span>
<h2>Khởi tạo, phạm vi &amp; bên liên quan</h2>
<h3>Bản điều lệ dự án</h3>
<p>Khởi tạo tạo ra <strong>bản điều lệ (charter)</strong> — một tài liệu ngắn <em>ủy quyền</em> cho dự án, chỉ định PM, và nêu mục tiêu, phạm vi tổng thể, nhà tài trợ và tiêu chí thành công. Không có điều lệ thì không có thẩm quyền.</p>
<h3>Xác định phạm vi</h3>
<p><strong>Tuyên bố phạm vi</strong> liệt kê những gì <em>trong</em> phạm vi và — quan trọng không kém — những gì <em>ngoài</em> phạm vi. Việc thêm thắt không kiểm soát là <strong>trượt phạm vi (scope creep)</strong>: tính năng âm thầm chất chồng đến khi thời gian và chi phí vỡ trận. Mọi thay đổi phải qua kiểm soát thay đổi.</p>
<pre><code>Tuyên bố phạm vi (trích)
  Trong : đăng nhập, danh sách sản phẩm, giỏ hàng, thanh toán VNPay
  Ngoài : điểm thưởng, đa ngôn ngữ, app di động native
  Nghiệm thu: người dùng mua xong 1 món trọn quy trình dưới 3 phút
</code></pre>
<h3>Phân tích bên liên quan</h3>
<p>Đặt các bên lên <strong>ma trận Quyền lực / Quan tâm</strong> và ứng xử theo từng ô:</p>
<pre><code>              QUAN TÂM thấp     QUAN TÂM cao
QUYỀN LỰC cao Giữ hài lòng      Quản lý sát sao
QUYỀN LỰC thấp Theo dõi         Thông tin đầy đủ
</code></pre>
<div class="callout"><span class="badge">Mẹo</span> Nhà tài trợ thường quyền lực cao / quan tâm cao — quản lý sát. Cơ quan quản lý có thể quyền lực cao / quan tâm thấp — giữ hài lòng. Vẽ sai bản đồ này thì tiếng nói to nhất, chứ không phải quan trọng nhất, lái dự án.</div>`,
  ]]);

const c2q = quiz('pim201c-quiz-2', 'Quiz 2 — Scope & stakeholders|||Quiz 2 — Phạm vi & bên liên quan', [
  { id: 'q1', question: 'Bản điều lệ dự án (project charter) dùng để?', options: ['Liệt kê toàn bộ mã nguồn', 'Chính thức ủy quyền cho dự án và chỉ định PM', 'Thay cho hợp đồng lao động', 'Ghi lại lỗi phần mềm'], correctIndex: 1, explanation: 'Charter chính thức ủy quyền cho dự án, chỉ định PM và nêu mục tiêu, nhà tài trợ, tiêu chí thành công.' },
  { id: 'q2', question: '"Scope creep" (trượt phạm vi) là gì?', options: ['Dự án kết thúc sớm', 'Tính năng/công việc bị thêm dần ngoài kiểm soát làm phình thời gian & chi phí', 'Giảm bớt phạm vi có chủ đích', 'Một loại rủi ro tài chính'], correctIndex: 1, explanation: 'Scope creep là phạm vi phình ra không qua kiểm soát thay đổi, kéo theo trễ hạn và đội chi phí.' },
  { id: 'q3', question: 'Trên ma trận Quyền lực–Quan tâm, một bên QUYỀN LỰC CAO & QUAN TÂM CAO nên được?', options: ['Chỉ theo dõi', 'Quản lý sát sao', 'Bỏ qua', 'Chỉ thông báo khi kết thúc'], correctIndex: 1, explanation: 'Ô quyền lực cao – quan tâm cao (ví dụ nhà tài trợ) cần được quản lý sát sao.' },
]);

const c3 = doc('pim201c-3-1-planning-wbs', '3.1 — Planning: WBS, schedule & cost|||3.1 — Lập kế hoạch: WBS, lịch trình & chi phí',
  'WBS (phân rã công việc); ước lượng & sơ đồ mạng; đường găng (critical path); biểu đồ Gantt; ước lượng chi phí & lập ngân sách theo thời gian.',
  [[
    `<span class="eyebrow">PIM201c · Chapter 3 · Lesson 3.1</span>
<h2>Planning: WBS, schedule &amp; cost</h2>
<h3>Work Breakdown Structure (WBS)</h3>
<p>The <strong>WBS</strong> breaks the whole scope into smaller, manageable <em>work packages</em> you can estimate and assign. Rule of thumb: decompose until a package is small enough to estimate confidently (the 8–80 hour guideline).</p>
<pre><code>1  E-commerce site
   1.1 Backend
       1.1.1 Auth API
       1.1.2 Product API
   1.2 Frontend
       1.2.1 Catalog page
       1.2.2 Checkout page
   1.3 Testing &amp; launch
</code></pre>
<h3>Schedule &amp; the critical path</h3>
<p>Estimate each package, list dependencies, then find the <strong>critical path</strong> — the longest chain of dependent tasks. It sets the shortest possible project duration; a slip on any critical task slips the whole project.</p>
<pre><code>A(3d) -> B(5d) -> D(2d)      Path A-B-D = 10 days  (critical)
A(3d) -> C(2d) -> D(2d)      Path A-C-D = 7 days
Project duration = 10 days; B has zero slack.
</code></pre>
<h3>Gantt chart &amp; cost</h3>
<p>A <strong>Gantt chart</strong> shows tasks as bars along a timeline. Summing package costs gives the budget; spreading it over time gives the <strong>cost baseline</strong> you later track actuals against.</p>
<div class="callout"><span class="badge">Key idea</span> Estimate the WBS bottom-up (packages), schedule top-down (dependencies + critical path). The critical path tells you where to protect the deadline.</div>`,
    `<span class="eyebrow">PIM201c · Chương 3 · Bài 3.1</span>
<h2>Lập kế hoạch: WBS, lịch trình &amp; chi phí</h2>
<h3>Cấu trúc phân rã công việc (WBS)</h3>
<p><strong>WBS</strong> chia toàn bộ phạm vi thành các <em>gói công việc</em> nhỏ, dễ quản lý, đủ để ước lượng và giao việc. Kinh nghiệm: phân rã đến khi một gói đủ nhỏ để ước lượng tự tin (khoảng 8–80 giờ).</p>
<pre><code>1  Website thương mại điện tử
   1.1 Backend
       1.1.1 API đăng nhập
       1.1.2 API sản phẩm
   1.2 Frontend
       1.2.1 Trang danh mục
       1.2.2 Trang thanh toán
   1.3 Kiểm thử &amp; ra mắt
</code></pre>
<h3>Lịch trình &amp; đường găng</h3>
<p>Ước lượng từng gói, liệt kê phụ thuộc, rồi tìm <strong>đường găng (critical path)</strong> — chuỗi công việc phụ thuộc dài nhất. Nó quyết định thời gian ngắn nhất của dự án; trễ bất kỳ công việc găng nào là trễ cả dự án.</p>
<pre><code>A(3n) -> B(5n) -> D(2n)      Đường A-B-D = 10 ngày  (găng)
A(3n) -> C(2n) -> D(2n)      Đường A-C-D = 7 ngày
Thời gian dự án = 10 ngày; B không có thời gian dự trữ.
</code></pre>
<h3>Biểu đồ Gantt &amp; chi phí</h3>
<p><strong>Biểu đồ Gantt</strong> vẽ công việc thành các thanh trên trục thời gian. Cộng chi phí các gói ra ngân sách; trải nó theo thời gian ra <strong>đường cơ sở chi phí (cost baseline)</strong> để sau này đối chiếu chi phí thực tế.</p>
<div class="callout"><span class="badge">Ý chính</span> Ước lượng WBS từ dưới lên (theo gói), lập lịch từ trên xuống (phụ thuộc + đường găng). Đường găng cho biết chỗ nào phải bảo vệ để giữ hạn.</div>`,
  ]]);

const c3q = quiz('pim201c-quiz-3', 'Quiz 3 — WBS & schedule|||Quiz 3 — WBS & lịch trình', [
  { id: 'q1', question: 'WBS (Work Breakdown Structure) là?', options: ['Danh sách rủi ro', 'Việc phân rã phạm vi thành các gói công việc nhỏ, dễ ước lượng', 'Sơ đồ tổ chức nhân sự', 'Bảng chi phí tổng'], correctIndex: 1, explanation: 'WBS phân rã toàn bộ phạm vi thành các gói công việc nhỏ để ước lượng và giao việc.' },
  { id: 'q2', question: 'Đường găng (critical path) trong lịch trình là?', options: ['Chuỗi công việc rẻ nhất', 'Chuỗi công việc phụ thuộc DÀI NHẤT, quyết định thời gian ngắn nhất của dự án', 'Công việc ít quan trọng nhất', 'Đường đi có nhiều dự trữ nhất'], correctIndex: 1, explanation: 'Đường găng là chuỗi phụ thuộc dài nhất; trễ một việc trên đó là trễ cả dự án.' },
  { id: 'q3', question: 'Biểu đồ Gantt chủ yếu thể hiện điều gì?', options: ['Dòng tiền theo quý', 'Công việc dưới dạng thanh theo trục thời gian', 'Cấu trúc mã nguồn', 'Sơ đồ mạng máy tính'], correctIndex: 1, explanation: 'Gantt vẽ các công việc thành thanh trên trục thời gian, thấy rõ thời điểm và độ dài từng việc.' },
]);

const c4 = doc('pim201c-4-1-risk-quality', '4.1 — Risk & quality management|||4.1 — Quản lý rủi ro & chất lượng',
  'Sổ rủi ro; ma trận xác suất–tác động; bốn chiến lược ứng phó (tránh/giảm/chuyển/chấp nhận); hoạch định–đảm bảo–kiểm soát chất lượng; phòng ngừa hơn khắc phục.',
  [[
    `<span class="eyebrow">PIM201c · Chapter 4 · Lesson 4.1</span>
<h2>Risk &amp; quality management</h2>
<h3>Managing risk</h3>
<p>A <strong>risk</strong> is an uncertain event that, if it happens, affects objectives. You <em>identify</em> risks, <em>assess</em> them, <em>plan responses</em>, then <em>monitor</em>. The <strong>risk register</strong> is the living list; each risk is scored on a <strong>probability × impact</strong> matrix.</p>
<pre><code>Risk register (extract)
  ID  Risk                     Prob  Impact  Response
  R1  Key developer leaves     Med   High    Mitigate: pair + docs
  R2  Payment API changes      Low   High    Transfer: use provider SLA
  R3  Scope grows              High  Med     Avoid: strict change control
</code></pre>
<h3>Four response strategies (negative risks)</h3>
<ul>
<li><strong>Avoid</strong> — remove the cause (drop a risky feature).</li>
<li><strong>Mitigate</strong> — reduce probability or impact.</li>
<li><strong>Transfer</strong> — shift it to a third party (insurance, contract, SLA).</li>
<li><strong>Accept</strong> — acknowledge and set aside a contingency reserve.</li>
</ul>
<h3>Quality management</h3>
<p>Quality means meeting requirements <em>and</em> being fit for use. It has three parts: <strong>plan quality</strong> (set standards), <strong>assure quality</strong> (improve the process), <strong>control quality</strong> (inspect the deliverables). <em>Prevention over inspection</em> — it is cheaper to design defects out than to find them later.</p>
<div class="callout"><span class="badge">Cost of quality</span> Money spent on prevention and appraisal is small next to the cost of failure — rework, recalls and lost trust. Build quality in; don't test it in at the end.</div>`,
    `<span class="eyebrow">PIM201c · Chương 4 · Bài 4.1</span>
<h2>Quản lý rủi ro &amp; chất lượng</h2>
<h3>Quản lý rủi ro</h3>
<p><strong>Rủi ro</strong> là sự kiện chưa chắc xảy ra mà nếu xảy ra sẽ ảnh hưởng mục tiêu. Bạn <em>nhận diện</em> rủi ro, <em>đánh giá</em>, <em>lập ứng phó</em>, rồi <em>giám sát</em>. <strong>Sổ rủi ro (risk register)</strong> là danh sách sống; mỗi rủi ro được chấm trên ma trận <strong>xác suất × tác động</strong>.</p>
<pre><code>Sổ rủi ro (trích)
  ID  Rủi ro                     XS    Tác động  Ứng phó
  R1  Lập trình viên chủ chốt nghỉ TB   Cao     Giảm: đôi + tài liệu
  R2  API thanh toán đổi          Thấp  Cao     Chuyển: dùng SLA nhà cung cấp
  R3  Phạm vi phình               Cao   TB      Tránh: kiểm soát thay đổi chặt
</code></pre>
<h3>Bốn chiến lược ứng phó (rủi ro tiêu cực)</h3>
<ul>
<li><strong>Tránh (avoid)</strong> — loại nguyên nhân (bỏ một tính năng nhiều rủi ro).</li>
<li><strong>Giảm (mitigate)</strong> — hạ xác suất hoặc tác động.</li>
<li><strong>Chuyển (transfer)</strong> — đẩy sang bên thứ ba (bảo hiểm, hợp đồng, SLA).</li>
<li><strong>Chấp nhận (accept)</strong> — thừa nhận và dành quỹ dự phòng.</li>
</ul>
<h3>Quản lý chất lượng</h3>
<p>Chất lượng là đáp ứng yêu cầu <em>và</em> phù hợp mục đích sử dụng. Ba phần: <strong>hoạch định chất lượng</strong> (đặt chuẩn), <strong>đảm bảo chất lượng</strong> (cải tiến quy trình), <strong>kiểm soát chất lượng</strong> (nghiệm thu sản phẩm). <em>Phòng ngừa hơn kiểm tra</em> — thiết kế để không sinh lỗi rẻ hơn tìm lỗi về sau.</p>
<div class="callout"><span class="badge">Chi phí chất lượng</span> Tiền cho phòng ngừa và thẩm định là nhỏ so với chi phí thất bại — làm lại, thu hồi, mất niềm tin. Xây chất lượng ngay từ đầu, đừng để cuối mới kiểm.</div>`,
  ]]);

const c4q = quiz('pim201c-quiz-4', 'Quiz 4 — Risk & quality|||Quiz 4 — Rủi ro & chất lượng', [
  { id: 'q1', question: 'Mua bảo hiểm hoặc dùng SLA của nhà cung cấp để xử lý rủi ro là chiến lược?', options: ['Tránh (avoid)', 'Chuyển (transfer)', 'Chấp nhận (accept)', 'Giảm (mitigate)'], correctIndex: 1, explanation: 'Chuyển (transfer) là đẩy hậu quả rủi ro sang bên thứ ba qua bảo hiểm, hợp đồng hay SLA.' },
  { id: 'q2', question: 'Rủi ro trong sổ rủi ro thường được chấm điểm theo hai chiều nào?', options: ['Chi phí và doanh thu', 'Xác suất và tác động', 'Thời gian và nhân sự', 'Phạm vi và chất lượng'], correctIndex: 1, explanation: 'Ma trận rủi ro chấm theo xác suất (khả năng xảy ra) × tác động (mức ảnh hưởng).' },
  { id: 'q3', question: 'Nguyên tắc "phòng ngừa hơn kiểm tra" trong quản lý chất lượng nghĩa là?', options: ['Chỉ kiểm tra ở cuối dự án', 'Thiết kế để không sinh lỗi rẻ hơn tìm & sửa lỗi về sau', 'Không cần đặt chuẩn chất lượng', 'Chất lượng do khách hàng tự lo'], correctIndex: 1, explanation: 'Ngăn lỗi phát sinh (prevention) rẻ hơn nhiều so với phát hiện và làm lại về sau (inspection).' },
]);

const c5 = doc('pim201c-5-1-agile-scrum', '5.1 — Agile, Scrum & IT project management|||5.1 — Agile, Scrum & quản lý dự án CNTT',
  'Thác nước so với Agile; Tuyên ngôn Agile; Scrum (3 vai trò, 5 sự kiện, 3 tạo phẩm); sprint & backlog; Kanban; vì sao dự án CNTT hợp Agile.',
  [[
    `<span class="eyebrow">PIM201c · Chapter 5 · Lesson 5.1</span>
<h2>Agile, Scrum &amp; IT project management</h2>
<h3>Waterfall vs Agile</h3>
<p><strong>Waterfall</strong> plans everything up front and delivers once at the end — risky when requirements change. <strong>Agile</strong> delivers working software in short iterations, welcomes change, and gets feedback early. The Agile Manifesto values individuals &amp; interactions, working software, customer collaboration and responding to change.</p>
<h3>Scrum in one screen</h3>
<pre><code>ROLES     Product Owner | Scrum Master | Developers
EVENTS    Sprint | Sprint Planning | Daily Scrum
          | Sprint Review | Sprint Retrospective
ARTIFACTS Product Backlog | Sprint Backlog | Increment
</code></pre>
<p>Work flows from the <strong>Product Backlog</strong> (prioritized by the PO). Each <strong>Sprint</strong> (1–4 weeks) the team pulls items into the <strong>Sprint Backlog</strong>, builds a shippable <strong>Increment</strong>, reviews it, and reflects in the retrospective.</p>
<h3>Kanban</h3>
<p><strong>Kanban</strong> visualizes work as cards moving across columns (To&nbsp;Do &rarr; Doing &rarr; Done) and limits <strong>work in progress (WIP)</strong> so the team finishes before starting more. Great for a continuous flow of support or ops work.</p>
<div class="callout"><span class="badge">Why IT loves Agile</span> Software requirements are discovered, not fully known up front. Short feedback loops let a team course-correct while it is cheap — the core reason Schwalbe treats Agile as central to IT project management.</div>`,
    `<span class="eyebrow">PIM201c · Chương 5 · Bài 5.1</span>
<h2>Agile, Scrum &amp; quản lý dự án CNTT</h2>
<h3>Thác nước so với Agile</h3>
<p><strong>Thác nước</strong> lập kế hoạch trọn gói từ đầu và giao một lần ở cuối — rủi ro khi yêu cầu thay đổi. <strong>Agile</strong> giao phần mềm chạy được theo vòng lặp ngắn, đón nhận thay đổi và lấy phản hồi sớm. Tuyên ngôn Agile đề cao con người &amp; tương tác, phần mềm chạy được, hợp tác với khách hàng và đáp ứng thay đổi.</p>
<h3>Scrum gói trong một màn hình</h3>
<pre><code>VAI TRÒ   Product Owner | Scrum Master | Nhóm phát triển
SỰ KIỆN   Sprint | Họp kế hoạch Sprint | Daily Scrum
          | Sơ kết Sprint | Cải tiến (Retrospective)
TẠO PHẨM  Product Backlog | Sprint Backlog | Increment
</code></pre>
<p>Công việc chảy từ <strong>Product Backlog</strong> (PO ưu tiên). Mỗi <strong>Sprint</strong> (1–4 tuần), nhóm kéo hạng mục vào <strong>Sprint Backlog</strong>, làm ra một <strong>Increment</strong> giao được, sơ kết và nhìn lại trong retrospective.</p>
<h3>Kanban</h3>
<p><strong>Kanban</strong> trực quan hóa công việc thành các thẻ di chuyển qua các cột (Cần làm &rarr; Đang làm &rarr; Xong) và giới hạn <strong>việc đang làm dở (WIP)</strong> để nhóm làm xong rồi mới nhận việc mới. Rất hợp cho luồng việc hỗ trợ hay vận hành liên tục.</p>
<div class="callout"><span class="badge">Vì sao CNTT chuộng Agile</span> Yêu cầu phần mềm được khám phá dần chứ không biết hết từ đầu. Vòng phản hồi ngắn giúp nhóm chỉnh hướng khi còn rẻ — đúng lý do Schwalbe coi Agile là trọng tâm của quản lý dự án CNTT.</div>`,
  ]]);

const c5q = quiz('pim201c-quiz-5', 'Quiz 5 — Agile & Scrum|||Quiz 5 — Agile & Scrum', [
  { id: 'q1', question: 'Trong Scrum, ai chịu trách nhiệm ưu tiên Product Backlog?', options: ['Scrum Master', 'Product Owner', 'Nhóm phát triển', 'Nhà tài trợ'], correctIndex: 1, explanation: 'Product Owner sở hữu và sắp xếp ưu tiên Product Backlog để tối đa hóa giá trị.' },
  { id: 'q2', question: 'Khác biệt cốt lõi giữa Agile và thác nước (waterfall) là?', options: ['Agile không cần kế hoạch', 'Agile giao phần mềm theo vòng lặp ngắn và đón nhận thay đổi, thác nước lập kế hoạch trọn gói và giao một lần', 'Thác nước nhanh hơn Agile', 'Agile chỉ dùng cho dự án nhỏ'], correctIndex: 1, explanation: 'Agile lặp ngắn, đón thay đổi, phản hồi sớm; thác nước cố định phạm vi từ đầu và giao ở cuối.' },
  { id: 'q3', question: 'Bảng Kanban giới hạn WIP (work in progress) nhằm?', options: ['Tăng số việc bắt đầu cùng lúc', 'Buộc hoàn thành việc đang làm trước khi nhận thêm việc mới', 'Bỏ hẳn khâu kiểm thử', 'Thay thế Product Owner'], correctIndex: 1, explanation: 'Giới hạn WIP giúp nhóm làm xong rồi mới nhận việc mới, giảm dở dang và tăng thông lượng.' },
]);

const c6 = doc('pim201c-6-1-innovation-models', '6.1 — Innovation & innovation models|||6.1 — Đổi mới sáng tạo & mô hình đổi mới',
  'Bốn loại đổi mới (4P: sản phẩm/quy trình/vị thế/mô thức); tăng dần vs đột phá; phễu đổi mới; đổi mới mở (open); đổi mới đột phá (Christensen).',
  [[
    `<span class="eyebrow">PIM201c · Chapter 6 · Lesson 6.1</span>
<h2>Innovation &amp; innovation models</h2>
<h3>What innovation is</h3>
<p><strong>Innovation</strong> is invention <em>plus</em> exploitation — a new idea <em>that creates value</em> in use. Tidd &amp; Bessant describe four types (the <strong>4Ps</strong>):</p>
<ul>
<li><strong>Product</strong> — a new or improved offering (electric car).</li>
<li><strong>Process</strong> — a better way to make/deliver it (assembly line).</li>
<li><strong>Position</strong> — a new market or framing for it (a drink repositioned as premium).</li>
<li><strong>Paradigm</strong> — a shift in the whole mental model (software as a subscription, not a box).</li>
</ul>
<h3>Incremental vs radical</h3>
<p><strong>Incremental</strong> innovation improves what exists (a faster phone each year); <strong>radical</strong> innovation changes the game (the first smartphone). Most value comes from a steady stream of incremental steps punctuated by rarer radical leaps.</p>
<h3>Two models to know</h3>
<pre><code>Innovation funnel:  many ideas -> screen -> develop -> few launches
Open innovation :   ideas flow IN and OUT across the firm boundary
                    (partners, universities, licensing)
Disruptive (Christensen): a cheaper, "good enough" entrant serves
                    an overlooked segment, then moves upmarket and
                    displaces incumbents.
</code></pre>
<div class="callout"><span class="badge">Manage the funnel</span> Innovation is a numbers game: fill the funnel with many ideas, screen ruthlessly, and kill weak ones early so resources back the few that can win.</div>`,
    `<span class="eyebrow">PIM201c · Chương 6 · Bài 6.1</span>
<h2>Đổi mới sáng tạo &amp; mô hình đổi mới</h2>
<h3>Đổi mới là gì</h3>
<p><strong>Đổi mới (innovation)</strong> là phát minh <em>cộng</em> khai thác — một ý tưởng mới <em>tạo ra giá trị</em> khi sử dụng. Tidd &amp; Bessant nêu bốn loại (<strong>4P</strong>):</p>
<ul>
<li><strong>Sản phẩm (Product)</strong> — thứ chào bán mới hoặc cải tiến (xe điện).</li>
<li><strong>Quy trình (Process)</strong> — cách làm/giao tốt hơn (dây chuyền lắp ráp).</li>
<li><strong>Vị thế (Position)</strong> — thị trường hay cách định vị mới (một thức uống định vị lại thành cao cấp).</li>
<li><strong>Mô thức (Paradigm)</strong> — đổi cả mô hình tư duy (phần mềm bán theo thuê bao thay vì bán hộp).</li>
</ul>
<h3>Tăng dần so với đột phá</h3>
<p>Đổi mới <strong>tăng dần (incremental)</strong> cải thiện thứ đang có (điện thoại nhanh hơn mỗi năm); đổi mới <strong>căn bản/đột phá (radical)</strong> đổi cuộc chơi (chiếc smartphone đầu tiên). Phần lớn giá trị đến từ dòng cải tiến đều đặn xen kẽ những cú nhảy căn bản hiếm hoi.</p>
<h3>Hai mô hình cần nhớ</h3>
<pre><code>Phễu đổi mới:  nhiều ý tưởng -> sàng lọc -> phát triển -> ít lần ra mắt
Đổi mới mở  :  ý tưởng chảy VÀO và RA qua ranh giới doanh nghiệp
               (đối tác, đại học, cấp phép)
Đột phá (Christensen): kẻ mới rẻ hơn, "đủ tốt" phục vụ phân khúc bị
               bỏ quên, rồi tiến lên phân khúc cao và hất cẳng ông lớn.
</code></pre>
<div class="callout"><span class="badge">Quản lý cái phễu</span> Đổi mới là trò xác suất: đổ nhiều ý tưởng vào phễu, sàng lọc thẳng tay, loại sớm cái yếu để dồn nguồn lực cho vài ý tưởng có thể thắng.</div>`,
  ]]);

const c6q = quiz('pim201c-quiz-6', 'Quiz 6 — Innovation models|||Quiz 6 — Mô hình đổi mới', [
  { id: 'q1', question: 'Theo Tidd & Bessant, "4P" của đổi mới gồm?', options: ['Price, Place, Promotion, Product', 'Product, Process, Position, Paradigm', 'Plan, People, Process, Product', 'Product, Profit, Position, Process'], correctIndex: 1, explanation: '4P của đổi mới: Sản phẩm (Product), Quy trình (Process), Vị thế (Position), Mô thức (Paradigm).' },
  { id: 'q2', question: 'Đổi mới ĐỘT PHÁ (disruptive) theo Christensen thường bắt đầu như thế nào?', options: ['Sản phẩm cao cấp, đắt tiền cho khách hàng lớn', 'Sản phẩm rẻ hơn, "đủ tốt" phục vụ phân khúc bị bỏ quên rồi tiến lên trên', 'Chỉ cải tiến nhỏ sản phẩm hiện có', 'Sao chép y hệt đối thủ'], correctIndex: 1, explanation: 'Đột phá thường xuất phát từ giải pháp rẻ, "đủ tốt" ở phân khúc thấp/bị bỏ quên, sau đó tiến lên hất cẳng ông lớn.' },
  { id: 'q3', question: '"Đổi mới mở" (open innovation) nghĩa là?', options: ['Chỉ đổi mới nội bộ, giữ bí mật', 'Ý tưởng và công nghệ chảy VÀO và RA qua ranh giới doanh nghiệp (đối tác, đại học, cấp phép)', 'Đổi mới không cần kế hoạch', 'Chỉ áp dụng cho phần mềm nguồn mở'], correctIndex: 1, explanation: 'Open innovation cho ý tưởng/công nghệ đi vào và ra qua ranh giới công ty: hợp tác đối tác, đại học, mua/bán cấp phép.' },
]);

const c7 = doc('pim201c-7-1-designthinking-lean-bmc', '7.1 — Design Thinking, Lean Startup & Business Model Canvas|||7.1 — Design Thinking, Lean Startup & Business Model Canvas',
  'Design Thinking 5 bước (Empathize→Define→Ideate→Prototype→Test); Lean Startup (Build–Measure–Learn, MVP, pivot); 9 khối Business Model Canvas của Osterwalder.',
  [[
    `<span class="eyebrow">PIM201c · Chapter 7 · Lesson 7.1</span>
<h2>Design Thinking, Lean Startup &amp; Business Model Canvas</h2>
<h3>Design Thinking — start with the human</h3>
<pre><code>Empathize -> Define -> Ideate -> Prototype -> Test
(understand   (frame   (brainstorm (build a   (learn from
 the user)     the       options)    rough      real users)
               problem)              version)
</code></pre>
<p>It is human-centred and iterative: you keep looping back as you learn what users actually need.</p>
<h3>Lean Startup — validate before you scale</h3>
<p>Ries' idea: under extreme uncertainty, run a <strong>Build&ndash;Measure&ndash;Learn</strong> loop as fast as possible. Ship a <strong>Minimum Viable Product (MVP)</strong> — the smallest thing that tests your riskiest assumption — measure real behaviour, and either <strong>persevere</strong> or <strong>pivot</strong> (change direction while keeping what you learned).</p>
<h3>Business Model Canvas — one page, nine blocks</h3>
<pre><code>Key         Key          Value        Customer     Customer
Partners    Activities   Propositions Relationships Segments
            Key                       Channels
            Resources
--------------------------------------------------------------
Cost Structure                 |  Revenue Streams
</code></pre>
<p>Osterwalder's canvas maps how an organization <em>creates, delivers and captures value</em> — from who you serve (segments) to how you earn (revenue) — all visible together so you can test the whole model, not just the product.</p>
<div class="callout"><span class="badge">How they fit</span> Design Thinking finds a problem worth solving; Lean Startup validates the solution cheaply with MVPs and pivots; the Business Model Canvas checks the surrounding business can actually make money.</div>`,
    `<span class="eyebrow">PIM201c · Chương 7 · Bài 7.1</span>
<h2>Design Thinking, Lean Startup &amp; Business Model Canvas</h2>
<h3>Design Thinking — bắt đầu từ con người</h3>
<pre><code>Đồng cảm -> Xác định -> Lên ý tưởng -> Nguyên mẫu -> Kiểm thử
(hiểu       (đóng      (động não      (dựng bản    (học từ
 người dùng) khung      nhiều hướng)   thô)         người dùng thật)
             vấn đề)
</code></pre>
<p>Nó lấy con người làm trung tâm và lặp: cứ quay lại bước trước khi hiểu thêm nhu cầu thật của người dùng.</p>
<h3>Lean Startup — kiểm chứng trước khi mở rộng</h3>
<p>Ý của Ries: trong bất định cực cao, hãy chạy vòng <strong>Dựng&ndash;Đo&ndash;Học (Build&ndash;Measure&ndash;Learn)</strong> càng nhanh càng tốt. Tung ra <strong>Sản phẩm khả dụng tối thiểu (MVP)</strong> — thứ nhỏ nhất kiểm được giả định rủi ro nhất — đo hành vi thật, rồi <strong>kiên trì</strong> hoặc <strong>xoay trục (pivot)</strong> (đổi hướng nhưng giữ lại điều đã học).</p>
<h3>Business Model Canvas — một trang, chín khối</h3>
<pre><code>Đối tác     Hoạt động   Đề xuất      Quan hệ      Phân khúc
chính       chính       giá trị      khách hàng   khách hàng
            Nguồn lực                Kênh
            chính
--------------------------------------------------------------
Cơ cấu chi phí                 |  Dòng doanh thu
</code></pre>
<p>Canvas của Osterwalder vẽ cách một tổ chức <em>tạo, trao và giữ giá trị</em> — từ phục vụ ai (phân khúc) đến kiếm tiền cách nào (doanh thu) — hiện cùng một chỗ để kiểm cả mô hình, không chỉ sản phẩm.</p>
<div class="callout"><span class="badge">Ba thứ ăn khớp</span> Design Thinking tìm vấn đề đáng giải; Lean Startup kiểm chứng giải pháp rẻ bằng MVP và pivot; Business Model Canvas kiểm xem mô hình kinh doanh quanh nó có thực sự kiếm được tiền.</div>`,
  ]]);

const c7q = quiz('pim201c-quiz-7', 'Quiz 7 — DT, Lean & BMC|||Quiz 7 — DT, Lean & BMC', [
  { id: 'q1', question: 'Năm bước của Design Thinking theo đúng thứ tự là?', options: ['Ideate → Empathize → Test → Define → Prototype', 'Empathize → Define → Ideate → Prototype → Test', 'Define → Test → Empathize → Ideate → Prototype', 'Prototype → Test → Define → Ideate → Empathize'], correctIndex: 1, explanation: 'Design Thinking: Đồng cảm → Xác định → Lên ý tưởng → Nguyên mẫu → Kiểm thử (lặp lại).' },
  { id: 'q2', question: 'MVP (Minimum Viable Product) trong Lean Startup là?', options: ['Phiên bản hoàn thiện nhất của sản phẩm', 'Phiên bản nhỏ nhất đủ để kiểm chứng giả định rủi ro nhất và học từ người dùng thật', 'Bản demo chỉ để bán hàng', 'Tài liệu thiết kế chi tiết'], correctIndex: 1, explanation: 'MVP là thứ nhỏ nhất giúp chạy vòng Dựng–Đo–Học, kiểm chứng giả định rủi ro nhất với chi phí thấp.' },
  { id: 'q3', question: 'Business Model Canvas của Osterwalder gồm mấy khối?', options: ['5 khối', '7 khối', '9 khối', '12 khối'], correctIndex: 2, explanation: 'BMC gồm 9 khối: Phân khúc KH, Đề xuất giá trị, Kênh, Quan hệ KH, Dòng doanh thu, Nguồn lực chính, Hoạt động chính, Đối tác chính, Cơ cấu chi phí.' },
]);

const c8 = doc('pim201c-8-1-innovation-digital', '8.1 — Managing innovation in digital transformation & commercialization|||8.1 — Quản lý đổi mới trong chuyển đổi số & thương mại hoá',
  'Chuyển đổi số là gì; đường cong chấp nhận công nghệ & vượt "vực"; thương mại hoá (từ MVP đến go-to-market & mở rộng); sở hữu trí tuệ; đo lường đổi mới.',
  [[
    `<span class="eyebrow">PIM201c · Chapter 8 · Lesson 8.1</span>
<h2>Innovation in digital transformation &amp; commercialization</h2>
<h3>Digital transformation</h3>
<p><strong>Digital transformation</strong> is not just buying software — it is reshaping how an organization operates and delivers value using digital technology (data, cloud, automation, AI). It is a portfolio of innovation projects, so everything from Chapter 1 onward applies: charter, scope, risk, Agile delivery.</p>
<h3>Crossing the chasm — technology adoption</h3>
<pre><code>Innovators -> Early Adopters | CHASM | Early Majority
           -> Late Majority -> Laggards

The hard gap is the CHASM between enthusiasts and the
pragmatic mainstream. Winning the mainstream needs a whole
product, references and trust, not just cool tech.
</code></pre>
<h3>Commercialization</h3>
<p><strong>Commercialization</strong> turns a validated idea into a sold, scaled product: define the <strong>go-to-market</strong> (pricing, channel, positioning), protect the idea with <strong>intellectual property (IP)</strong> where it matters (patent, trademark, copyright, trade secret), then <strong>scale</strong> operations to meet demand — the shift from "does it work?" to "can it grow profitably?".</p>
<h3>Measuring innovation</h3>
<p>Track a few signals: idea-to-launch time, share of revenue from new products, and MVP validation rate. What you measure is what teams optimize.</p>
<div class="callout"><span class="badge">The full arc</span> Idea &rarr; validate (Design Thinking + Lean) &rarr; deliver (project &amp; Agile management) &rarr; commercialize &amp; scale (go-to-market, IP, adoption). Innovation management is running that whole arc, not just having the idea.</div>`,
    `<span class="eyebrow">PIM201c · Chương 8 · Bài 8.1</span>
<h2>Đổi mới trong chuyển đổi số &amp; thương mại hoá</h2>
<h3>Chuyển đổi số</h3>
<p><strong>Chuyển đổi số</strong> không chỉ là mua phần mềm — mà là định hình lại cách tổ chức vận hành và trao giá trị bằng công nghệ số (dữ liệu, đám mây, tự động hoá, AI). Nó là một danh mục dự án đổi mới, nên mọi thứ từ Chương 1 đều dùng: điều lệ, phạm vi, rủi ro, giao hàng theo Agile.</p>
<h3>Vượt "vực" — đường cong chấp nhận công nghệ</h3>
<pre><code>Người tiên phong -> Người theo sớm | VỰC | Số đông sớm
                 -> Số đông muộn -> Người bảo thủ

Khoảng khó là cái VỰC giữa nhóm mê công nghệ và số đông
thực dụng. Chinh phục số đông cần sản phẩm trọn vẹn, tham
chiếu và niềm tin, không chỉ công nghệ hay ho.
</code></pre>
<h3>Thương mại hoá</h3>
<p><strong>Thương mại hoá</strong> biến một ý tưởng đã kiểm chứng thành sản phẩm bán được, mở rộng được: xác định <strong>chiến lược ra thị trường (go-to-market)</strong> (giá, kênh, định vị), bảo vệ ý tưởng bằng <strong>sở hữu trí tuệ (IP)</strong> ở chỗ đáng (bằng sáng chế, nhãn hiệu, bản quyền, bí mật kinh doanh), rồi <strong>mở rộng</strong> vận hành để đáp ứng nhu cầu — chuyển từ "nó có chạy không?" sang "nó có lớn có lãi được không?".</p>
<h3>Đo lường đổi mới</h3>
<p>Theo dõi vài tín hiệu: thời gian từ ý tưởng đến ra mắt, tỉ trọng doanh thu từ sản phẩm mới, và tỉ lệ MVP được kiểm chứng. Đo gì thì đội tối ưu nấy.</p>
<div class="callout"><span class="badge">Trọn cung đường</span> Ý tưởng &rarr; kiểm chứng (Design Thinking + Lean) &rarr; giao hàng (quản lý dự án &amp; Agile) &rarr; thương mại hoá &amp; mở rộng (go-to-market, IP, chấp nhận). Quản lý đổi mới là chạy trọn cung đường đó, không chỉ có ý tưởng.</div>`,
  ]]);

const c8q = quiz('pim201c-quiz-8', 'Quiz 8 — Digital innovation|||Quiz 8 — Đổi mới số', [
  { id: 'q1', question: 'Chuyển đổi số (digital transformation) được hiểu đúng nhất là?', options: ['Chỉ là mua và cài phần mềm mới', 'Định hình lại cách tổ chức vận hành & trao giá trị bằng công nghệ số', 'Chỉ áp dụng cho công ty công nghệ', 'Thay toàn bộ nhân sự bằng máy'], correctIndex: 1, explanation: 'Chuyển đổi số là thay đổi cách vận hành và tạo giá trị bằng công nghệ số, không chỉ là mua phần mềm.' },
  { id: 'q2', question: 'Trong đường cong chấp nhận công nghệ, "vực" (chasm) nằm giữa?', options: ['Người tiên phong và người theo sớm', 'Người theo sớm và số đông sớm (thực dụng)', 'Số đông muộn và người bảo thủ', 'Người tiên phong và người bảo thủ'], correctIndex: 1, explanation: 'Cái "vực" khó vượt nằm giữa nhóm theo sớm (mê công nghệ) và số đông sớm (thực dụng), cần sản phẩm trọn vẹn & niềm tin.' },
  { id: 'q3', question: 'Bằng sáng chế, nhãn hiệu và bản quyền là các hình thức của?', options: ['Chiến lược giá', 'Sở hữu trí tuệ (IP) để bảo vệ ý tưởng khi thương mại hoá', 'Quản lý rủi ro tài chính', 'Đo lường đổi mới'], correctIndex: 1, explanation: 'Bằng sáng chế, nhãn hiệu, bản quyền, bí mật kinh doanh đều là sở hữu trí tuệ (IP) dùng bảo vệ ý tưởng khi thương mại hoá.' },
]);

export default {
  semester: { code: 'FPTU_Hola8', name: 'Kỳ 8', ordinal: 10 },
  course: {
    courseCode: 'PIM201c',
    slug: 'pim201c-project-and-innovation-management',
    title: 'Project and Innovation Management',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/PIM201c.webp',
    shortDescription: 'Run projects & drive innovation: life cycle, scope, WBS/schedule/cost, risk & quality, Agile/Scrum, innovation models, Design Thinking, Lean Startup & Business Model Canvas. Bilingual, with quizzes.|||Chạy dự án & dẫn dắt đổi mới: vòng đời, phạm vi, WBS/lịch trình/chi phí, rủi ro & chất lượng, Agile/Scrum, mô hình đổi mới, Design Thinking, Lean Startup & Business Model Canvas. Song ngữ, có quiz.',
    description: 'Môn <strong>PIM201c — Project and Innovation Management</strong> (Quản lý Dự án &amp; Đổi mới sáng tạo, ngành Chuyển đổi số, kỳ 8) ghép hai kỹ năng: <strong>quản lý dự án</strong> (vòng đời &amp; nhóm quy trình PMBOK, khởi tạo &amp; phạm vi, WBS/lịch trình/chi phí, rủi ro &amp; chất lượng, Agile/Scrum) và <strong>quản lý đổi mới</strong> (các loại &amp; mô hình đổi mới, Design Thinking, Lean Startup, Business Model Canvas, và đổi mới trong chuyển đổi số &amp; thương mại hoá). Bám giáo trình PMI (PMBOK Guide), Schwalbe, Tidd &amp; Bessant, Osterwalder và Ries; song ngữ, có mẫu tài liệu và quiz mỗi chương.',
    whatYouLearn: 'Dự án khác vận hành, tam giác ràng buộc; vòng đời &amp; 5 nhóm quy trình PMBOK; điều lệ dự án, tuyên bố phạm vi, phân tích bên liên quan (ma trận quyền lực–quan tâm); WBS, đường găng, Gantt, đường cơ sở chi phí; sổ rủi ro &amp; 4 chiến lược ứng phó, hoạch định–đảm bảo–kiểm soát chất lượng; Agile, Scrum (vai trò/sự kiện/tạo phẩm), Kanban; 4P đổi mới, tăng dần vs đột phá, đổi mới mở &amp; đột phá; Design Thinking, Lean Startup (MVP, pivot), Business Model Canvas 9 khối; chuyển đổi số, vượt "vực", go-to-market, IP &amp; đo lường đổi mới.',
    requirements: 'Không yêu cầu nền kỹ thuật sâu. Nên có hiểu biết cơ bản về doanh nghiệp/CNTT. Xem điều kiện tiên quyết trong khung chương trình ngành Chuyển đổi số trên FLM (flm.fpt.edu.vn).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách chuẩn, tài liệu miễn phí, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Dự án & đổi mới, tam giác ràng buộc, lộ trình môn.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan & vòng đời|||Chapter 1 — Overview & life cycle', description: 'Vai trò PM, vòng đời, 5 nhóm quy trình PMBOK.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Khởi tạo, phạm vi & bên liên quan|||Chapter 2 — Initiation, scope & stakeholders', description: 'Điều lệ, tuyên bố phạm vi, ma trận quyền lực–quan tâm.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Lập kế hoạch (WBS, lịch, chi phí)|||Chapter 3 — Planning (WBS, schedule, cost)', description: 'WBS, đường găng, Gantt, đường cơ sở chi phí.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Rủi ro & chất lượng|||Chapter 4 — Risk & quality', description: 'Sổ rủi ro, 4 chiến lược ứng phó, quản lý chất lượng.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Agile/Scrum & dự án CNTT|||Chapter 5 — Agile/Scrum & IT PM', description: 'Thác nước vs Agile, Scrum, Kanban.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Đổi mới & mô hình đổi mới|||Chapter 6 — Innovation & models', description: '4P, tăng dần vs đột phá, đổi mới mở & đột phá.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Design Thinking, Lean & BMC|||Chapter 7 — Design Thinking, Lean & BMC', description: 'Design Thinking, Lean Startup (MVP/pivot), Business Model Canvas.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Đổi mới trong chuyển đổi số|||Chapter 8 — Innovation in digital transformation', description: 'Chuyển đổi số, vượt "vực", thương mại hoá, IP.', lessons: [c8, c8q] },
  ],
};
