/**
 * GPM201c — Professional Project Management (Quản lý dự án chuyên nghiệp).
 * Ngành Công nghệ Truyền thông FPTU. Môn KHÔNG có FLM → dựng theo giáo trình
 * chuẩn quốc tế: PMI "PMBOK Guide 7th", "Scrum Guide" (scrum.org), Kerzner
 * "Project Management", Atlassian Agile Coach, Coursera Google PM. Áp dụng cho
 * dự án truyền thông/marketing: ra mắt sản phẩm, tổ chức sự kiện, chiến dịch.
 * Song ngữ VI+EN, 8 chương, mỗi chương 1 document + 1 quiz.
 * Giữ NGUYÊN slug/semester/courseCode/thumb(v3). ⚠️ KHÔNG backtick lồng/${; "&"→&amp; chỉ trong HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('gpm201c-0-0-tai-lieu', '📚 Course materials &amp; references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: chuẩn quốc tế (PMBOK, Scrum Guide, Kerzner), khoá học miễn phí, công cụ (Jira/Trello/Asana), lộ trình tự học 4 bước.',
  [[
    `<span class="eyebrow">GPM201c · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to manage a <strong>professional project</strong> — planning, scheduling, budgeting, risk, teams and Agile — applied to <strong>media &amp; marketing</strong> work (product launches, events, campaigns). Because this subject has no FLM textbook, the course follows recognized <strong>international standards</strong>.</p>
<h3>📘 Core standards &amp; books</h3>
<ul>
<li><a href="https://www.pmi.org/pmbok-guide-standards" target="_blank" rel="noopener">PMI — <em>A Guide to the PMBOK (7th Edition)</em></a>: the reference for project management principles &amp; performance domains.</li>
<li><a href="https://scrumguides.org/" target="_blank" rel="noopener">Schwaber &amp; Sutherland — <em>The Scrum Guide</em></a>: the definition of Scrum (free, ~13 pages).</li>
<li><em>Harold Kerzner — Project Management: A Systems Approach</em>: the classic depth reference.</li>
</ul>
<h3>🌐 Free courses &amp; guides</h3>
<ul>
<li><a href="https://www.atlassian.com/agile" target="_blank" rel="noopener">Atlassian Agile Coach</a> — Agile, Scrum &amp; Kanban explained clearly.</li>
<li><a href="https://www.coursera.org/professional-certificates/google-project-management" target="_blank" rel="noopener">Google Project Management (Coursera)</a> — audit for free.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.atlassian.com/software/jira" target="_blank" rel="noopener">Jira</a> — Agile boards, sprints, backlogs.</li>
<li><a href="https://trello.com/" target="_blank" rel="noopener">Trello</a> — lightweight Kanban for campaigns &amp; content.</li>
<li><a href="https://asana.com/" target="_blank" rel="noopener">Asana</a> — task &amp; timeline management for teams.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundations</strong> — project vs operations, the triple constraint, the project life cycle, charter &amp; stakeholders.</li>
<li><strong>Plan</strong> — scope (WBS), schedule (Gantt, critical path), budget and a risk register.</li>
<li><strong>Execute &amp; control</strong> — lead the team (RACI), track KPIs/earned value, run change control.</li>
<li><strong>Deliver &amp; adapt</strong> — Agile/Scrum/Kanban for marketing, close out and capture lessons learned.</li>
</ol></div>`,
    `<span class="eyebrow">GPM201c · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để quản lý một <strong>dự án chuyên nghiệp</strong> — lập kế hoạch, tiến độ, ngân sách, rủi ro, nhóm và Agile — áp dụng cho công việc <strong>truyền thông &amp; marketing</strong> (ra mắt sản phẩm, sự kiện, chiến dịch). Vì môn này không có giáo trình FLM, khoá học bám theo các <strong>chuẩn quốc tế</strong> được công nhận.</p>
<h3>📘 Chuẩn &amp; sách cốt lõi</h3>
<ul>
<li><a href="https://www.pmi.org/pmbok-guide-standards" target="_blank" rel="noopener">PMI — <em>A Guide to the PMBOK (7th Edition)</em></a>: tài liệu tham chiếu về nguyên lý &amp; miền hiệu suất quản lý dự án.</li>
<li><a href="https://scrumguides.org/" target="_blank" rel="noopener">Schwaber &amp; Sutherland — <em>The Scrum Guide</em></a>: định nghĩa Scrum (miễn phí, ~13 trang).</li>
<li><em>Harold Kerzner — Project Management: A Systems Approach</em>: sách tham khảo chuyên sâu kinh điển.</li>
</ul>
<h3>🌐 Khoá học &amp; hướng dẫn miễn phí</h3>
<ul>
<li><a href="https://www.atlassian.com/agile" target="_blank" rel="noopener">Atlassian Agile Coach</a> — giảng Agile, Scrum &amp; Kanban rõ ràng.</li>
<li><a href="https://www.coursera.org/professional-certificates/google-project-management" target="_blank" rel="noopener">Google Project Management (Coursera)</a> — học miễn phí ở chế độ audit.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.atlassian.com/software/jira" target="_blank" rel="noopener">Jira</a> — bảng Agile, sprint, backlog.</li>
<li><a href="https://trello.com/" target="_blank" rel="noopener">Trello</a> — Kanban gọn nhẹ cho chiến dịch &amp; nội dung.</li>
<li><a href="https://asana.com/" target="_blank" rel="noopener">Asana</a> — quản lý công việc &amp; timeline cho nhóm.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — dự án vs vận hành, tam giác ràng buộc, vòng đời dự án, charter &amp; bên liên quan.</li>
<li><strong>Lập kế hoạch</strong> — phạm vi (WBS), tiến độ (Gantt, đường găng), ngân sách và sổ rủi ro.</li>
<li><strong>Thực thi &amp; kiểm soát</strong> — dẫn dắt nhóm (RACI), theo dõi KPI/giá trị thu được, kiểm soát thay đổi.</li>
<li><strong>Bàn giao &amp; thích ứng</strong> — Agile/Scrum/Kanban cho marketing, kết thúc và rút bài học.</li>
</ol></div>`,
  ]]);

const intro = doc('gpm201c-0-1-overview', 'Course overview: Professional Project Management|||Tổng quan: Quản lý dự án chuyên nghiệp',
  'Dự án là gì, PM làm gì; tam giác ràng buộc; lộ trình: khởi tạo → lập kế hoạch → thực thi & kiểm soát → kết thúc; predictive vs Agile.',
  [[
    `<span class="eyebrow">GPM201c · Lesson 0.1 · Overview</span>
<h2>Professional Project Management</h2>
<p class="lead">This course teaches you to plan and lead <strong>projects</strong> from idea to delivery — and to do it on <strong>media &amp; marketing</strong> work: launching a product, running an event, delivering a campaign. A project is <strong>temporary</strong> (it has a start and an end) and produces a <strong>unique</strong> result — unlike day-to-day operations that repeat.</p>
<h3>What a project manager does</h3>
<p>A <strong>PM</strong> turns a goal into a plan, coordinates people and budget, protects the schedule, manages risk and stakeholders, and reports progress. The PM owns the "how" and the "when", not usually the creative "what".</p>
<h3>The roadmap of this course</h3>
<ol>
<li><strong>Initiate</strong> — charter, stakeholders, SMART goals.</li>
<li><strong>Plan</strong> — scope (WBS), schedule (Gantt/critical path), budget, risk.</li>
<li><strong>Execute &amp; control</strong> — lead the team, communicate, track KPIs, manage change.</li>
<li><strong>Close</strong> — hand over, run a retrospective, capture lessons.</li>
</ol>
<div class="callout"><span class="badge">Two ways to deliver</span> <strong>Predictive (waterfall)</strong> plans everything up front — good for a fixed-scope event. <strong>Agile</strong> delivers in short cycles and adapts — good for an evolving content campaign. This course covers both.</div>`,
    `<span class="eyebrow">GPM201c · Bài 0.1 · Tổng quan</span>
<h2>Quản lý dự án chuyên nghiệp</h2>
<p class="lead">Môn này dạy bạn lập kế hoạch và dẫn dắt <strong>dự án</strong> từ ý tưởng đến bàn giao — và làm điều đó trên công việc <strong>truyền thông &amp; marketing</strong>: ra mắt sản phẩm, tổ chức sự kiện, chạy chiến dịch. Một dự án là <strong>tạm thời</strong> (có điểm bắt đầu và kết thúc) và tạo ra kết quả <strong>duy nhất</strong> — khác với vận hành lặp lại hằng ngày.</p>
<h3>Người quản lý dự án làm gì</h3>
<p>Một <strong>PM</strong> biến mục tiêu thành kế hoạch, điều phối con người và ngân sách, bảo vệ tiến độ, quản lý rủi ro và các bên liên quan, và báo cáo tiến độ. PM sở hữu "làm thế nào" và "khi nào", thường không sở hữu phần sáng tạo "làm gì".</p>
<h3>Lộ trình của môn học</h3>
<ol>
<li><strong>Khởi tạo</strong> — charter, bên liên quan, mục tiêu SMART.</li>
<li><strong>Lập kế hoạch</strong> — phạm vi (WBS), tiến độ (Gantt/đường găng), ngân sách, rủi ro.</li>
<li><strong>Thực thi &amp; kiểm soát</strong> — dẫn dắt nhóm, giao tiếp, theo dõi KPI, quản lý thay đổi.</li>
<li><strong>Kết thúc</strong> — bàn giao, họp rút kinh nghiệm, ghi lại bài học.</li>
</ol>
<div class="callout"><span class="badge">Hai cách bàn giao</span> <strong>Tuần tự (waterfall)</strong> lập kế hoạch trọn gói từ đầu — hợp với sự kiện phạm vi cố định. <strong>Agile</strong> bàn giao theo chu kỳ ngắn và thích ứng — hợp với chiến dịch nội dung thay đổi liên tục. Môn này học cả hai.</div>`,
  ]]);

const c1 = doc('gpm201c-1-1-what-is-pm', '1.1 — What is project management?|||1.1 — Quản lý dự án là gì?',
  'Dự án vs vận hành, tam giác ràng buộc (phạm vi–thời gian–chi phí, chất lượng ở giữa), vai trò PM, vòng đời dự án.',
  [[
    `<span class="eyebrow">GPM201c · Chapter 1 · Lesson 1.1</span>
<h2>What is project management?</h2>
<h3>Project vs operations</h3>
<p>A <strong>project</strong> is temporary and unique — "launch the Spring 2026 campaign". <strong>Operations</strong> are ongoing and repetitive — "publish three posts a day, forever". Projects create change; operations run the business.</p>
<h3>The triple constraint (iron triangle)</h3>
<p>Every project balances three levers, with <strong>quality</strong> in the middle:</p>
<ul>
<li><strong>Scope</strong> — what gets done (the deliverables).</li>
<li><strong>Time</strong> — the schedule / deadline.</li>
<li><strong>Cost</strong> — the budget and resources.</li>
</ul>
<p>Change one and at least one other must move. Push the launch date earlier (Time) and you must cut features (Scope) or add budget (Cost).</p>
<pre><code>       Scope
        /\\
       /  \\
      / QUALITY \\
     /________\\
   Time      Cost
Change one corner -&gt; another must give.
</code></pre>
<h3>The PM role &amp; project life cycle</h3>
<p>The PM plans, coordinates, and controls. A typical <strong>life cycle</strong>: <strong>Initiating → Planning → Executing → Monitoring &amp; Controlling → Closing</strong>.</p>
<div class="callout"><span class="badge">Media example</span> Event team is told "move the launch gala up two weeks". Scope is fixed and budget is capped, so the PM negotiates: drop the second stage segment (Scope) rather than blow the budget on rush fees.</div>`,
    `<span class="eyebrow">GPM201c · Chương 1 · Bài 1.1</span>
<h2>Quản lý dự án là gì?</h2>
<h3>Dự án vs vận hành</h3>
<p>Một <strong>dự án</strong> là tạm thời và duy nhất — "ra mắt chiến dịch Xuân 2026". <strong>Vận hành</strong> là liên tục và lặp lại — "đăng ba bài mỗi ngày, mãi mãi". Dự án tạo ra thay đổi; vận hành duy trì doanh nghiệp.</p>
<h3>Tam giác ràng buộc</h3>
<p>Mọi dự án cân bằng ba đòn bẩy, với <strong>chất lượng</strong> ở trung tâm:</p>
<ul>
<li><strong>Phạm vi (Scope)</strong> — làm những gì (các sản phẩm bàn giao).</li>
<li><strong>Thời gian (Time)</strong> — tiến độ / hạn chót.</li>
<li><strong>Chi phí (Cost)</strong> — ngân sách và nguồn lực.</li>
</ul>
<p>Đổi một cạnh thì ít nhất một cạnh khác phải đổi. Kéo ngày ra mắt sớm hơn (Thời gian) thì phải cắt hạng mục (Phạm vi) hoặc thêm ngân sách (Chi phí).</p>
<pre><code>       Phạm vi
        /\\
       /  \\
      / CHẤT LƯỢNG \\
     /________\\
 Thời gian   Chi phí
Đổi một góc -&gt; góc khác phải nhường.
</code></pre>
<h3>Vai trò PM &amp; vòng đời dự án</h3>
<p>PM lập kế hoạch, điều phối và kiểm soát. Một <strong>vòng đời</strong> điển hình: <strong>Khởi tạo → Lập kế hoạch → Thực thi → Giám sát &amp; Kiểm soát → Kết thúc</strong>.</p>
<div class="callout"><span class="badge">Ví dụ truyền thông</span> Nhóm sự kiện được yêu cầu "dời lễ ra mắt sớm hai tuần". Phạm vi cố định và ngân sách bị khống chế, nên PM thương lượng: bỏ tiết mục sân khấu thứ hai (Phạm vi) thay vì đội ngân sách vì phí gấp.</div>`,
  ]]);

const c1q = quiz('gpm201c-quiz-1', 'Quiz 1 — What is PM|||Quiz 1 — QLDA là gì', [
  { id: 'q1', question: 'Điểm khác biệt cốt lõi giữa dự án và vận hành?|||Core difference between a project and operations?', options: ['Dự án lặp lại mãi mãi|||A project repeats forever', 'Dự án là tạm thời & tạo kết quả duy nhất|||A project is temporary & produces a unique result', 'Vận hành luôn có deadline|||Operations always have a deadline', 'Không có khác biệt|||No difference'], correctIndex: 1, explanation: 'Dự án: tạm thời + duy nhất; vận hành: liên tục + lặp lại.' },
  { id: 'q2', question: 'Ba cạnh của tam giác ràng buộc là?|||The three sides of the triple constraint are?', options: ['Phạm vi, thời gian, chi phí|||Scope, time, cost', 'Con người, quy trình, công cụ|||People, process, tools', 'Rủi ro, chất lượng, phạm vi|||Risk, quality, scope', 'Kế hoạch, thực thi, kết thúc|||Plan, execute, close'], correctIndex: 0, explanation: 'Tam giác: phạm vi–thời gian–chi phí, chất lượng ở giữa.' },
  { id: 'q3', question: 'Muốn rút ngắn thời gian mà giữ nguyên phạm vi thì thường phải?|||To shorten time while keeping scope, you usually must?', options: ['Không đổi gì|||Change nothing', 'Tăng chi phí (thêm nguồn lực)|||Increase cost (add resources)', 'Giảm chất lượng bắt buộc|||Necessarily lower quality', 'Huỷ dự án|||Cancel the project'], correctIndex: 1, explanation: 'Đổi một cạnh → cạnh khác nhường; rút thời gian, giữ phạm vi → thêm chi phí.' },
]);

const c2 = doc('gpm201c-2-1-initiation-stakeholders', '2.1 — Initiation &amp; stakeholders|||2.1 — Khởi tạo &amp; các bên liên quan',
  'Project charter, business case, stakeholder analysis (power/interest), mục tiêu SMART; ví dụ ra mắt sản phẩm.',
  [[
    `<span class="eyebrow">GPM201c · Chapter 2 · Lesson 2.1</span>
<h2>Initiation &amp; stakeholders</h2>
<h3>The project charter &amp; business case</h3>
<p>A project starts with a <strong>business case</strong> (why do this — the value, the cost, the return) and a <strong>project charter</strong> (a one-page mandate: goal, high-level scope, budget, sponsor, and the PM's authority). The charter is what <em>authorizes</em> the project and names who's in charge.</p>
<h3>SMART objectives</h3>
<p>Turn a vague wish into a testable goal — <strong>SMART</strong>: <strong>S</strong>pecific, <strong>M</strong>easurable, <strong>A</strong>chievable, <strong>R</strong>elevant, <strong>T</strong>ime-bound.</p>
<pre><code>Weak : "Get the brand more known."
SMART: "Reach 50,000 new followers and 1M video views
        for Product X by the launch date, June 30, on
        a 200M VND budget."
</code></pre>
<h3>Stakeholder analysis</h3>
<p>A <strong>stakeholder</strong> is anyone affected by or able to affect the project. Map them on a <strong>power / interest grid</strong> and plan communication accordingly:</p>
<ul>
<li><strong>High power, high interest</strong> — manage closely (the sponsor, the client).</li>
<li><strong>High power, low interest</strong> — keep satisfied (senior execs).</li>
<li><strong>Low power, high interest</strong> — keep informed (the content team).</li>
<li><strong>Low power, low interest</strong> — monitor (general audience).</li>
</ul>
<div class="callout"><span class="badge">Media example</span> For a product launch the sponsor (marketing director) is "manage closely", the influencer partners are "keep informed", and legal/PR sit "keep satisfied" — a missed sign-off from legal can stop the whole launch.</div>`,
    `<span class="eyebrow">GPM201c · Chương 2 · Bài 2.1</span>
<h2>Khởi tạo &amp; các bên liên quan</h2>
<h3>Project charter &amp; business case</h3>
<p>Dự án bắt đầu bằng <strong>business case</strong> (vì sao làm — giá trị, chi phí, lợi ích) và <strong>project charter</strong> (bản uỷ nhiệm một trang: mục tiêu, phạm vi tổng thể, ngân sách, nhà tài trợ, và thẩm quyền của PM). Charter là thứ <em>cho phép</em> dự án khởi động và chỉ định ai chịu trách nhiệm.</p>
<h3>Mục tiêu SMART</h3>
<p>Biến mong muốn mơ hồ thành mục tiêu kiểm chứng được — <strong>SMART</strong>: Cụ thể, Đo được, Khả thi, Liên quan, Có mốc thời gian.</p>
<pre><code>Yếu : "Cho thương hiệu được biết đến nhiều hơn."
SMART: "Đạt 50.000 người theo dõi mới và 1 triệu lượt xem
        video cho Sản phẩm X trước ngày ra mắt 30/6, với
        ngân sách 200 triệu VND."
</code></pre>
<h3>Phân tích bên liên quan</h3>
<p>Một <strong>bên liên quan</strong> là bất kỳ ai bị ảnh hưởng bởi hoặc có thể tác động đến dự án. Xếp họ lên <strong>lưới quyền lực / mức quan tâm</strong> và lập kế hoạch giao tiếp tương ứng:</p>
<ul>
<li><strong>Quyền cao, quan tâm cao</strong> — quản lý sát (nhà tài trợ, khách hàng).</li>
<li><strong>Quyền cao, quan tâm thấp</strong> — giữ hài lòng (lãnh đạo cấp cao).</li>
<li><strong>Quyền thấp, quan tâm cao</strong> — cập nhật đều (nhóm nội dung).</li>
<li><strong>Quyền thấp, quan tâm thấp</strong> — theo dõi (khán giả nói chung).</li>
</ul>
<div class="callout"><span class="badge">Ví dụ truyền thông</span> Với một dự án ra mắt sản phẩm, nhà tài trợ (giám đốc marketing) là "quản lý sát", đối tác KOL là "cập nhật đều", còn pháp lý/PR "giữ hài lòng" — thiếu một chữ ký của pháp lý có thể chặn cả buổi ra mắt.</div>`,
  ]]);

const c2q = quiz('gpm201c-quiz-2', 'Quiz 2 — Initiation|||Quiz 2 — Khởi tạo', [
  { id: 'q1', question: 'Tài liệu chính thức "cho phép" dự án khởi động và trao quyền cho PM là?|||The document that authorizes the project and gives the PM authority is?', options: ['Sổ rủi ro|||The risk register', 'Project charter', 'Biên bản họp|||Meeting minutes', 'Bảng Gantt|||The Gantt chart'], correctIndex: 1, explanation: 'Project charter uỷ nhiệm dự án và chỉ định PM.' },
  { id: 'q2', question: 'Chữ "M" trong SMART nghĩa là?|||The "M" in SMART stands for?', options: ['Motivated (có động lực)|||Motivated', 'Measurable (đo được)|||Measurable', 'Managed (được quản lý)|||Managed', 'Mandatory (bắt buộc)|||Mandatory'], correctIndex: 1, explanation: 'SMART = Specific, Measurable, Achievable, Relevant, Time-bound.' },
  { id: 'q3', question: 'Trên lưới quyền lực/quan tâm, nhà tài trợ (quyền cao, quan tâm cao) cần?|||On the power/interest grid, a sponsor (high power, high interest) needs?', options: ['Chỉ theo dõi|||Just monitor', 'Quản lý sát|||Manage closely', 'Bỏ qua|||Ignore', 'Giữ hài lòng nhưng không cập nhật|||Keep satisfied but not informed'], correctIndex: 1, explanation: 'Quyền cao + quan tâm cao → quản lý sát, giao tiếp thường xuyên.' },
]);

const c3 = doc('gpm201c-3-1-scope-schedule', '3.1 — Planning scope &amp; schedule|||3.1 — Lập kế hoạch phạm vi &amp; tiến độ',
  'WBS (chia nhỏ công việc), Gantt, đường găng (critical path), milestone; ví dụ tổ chức sự kiện.',
  [[
    `<span class="eyebrow">GPM201c · Chapter 3 · Lesson 3.1</span>
<h2>Planning scope &amp; schedule</h2>
<h3>Work Breakdown Structure (WBS)</h3>
<p>A <strong>WBS</strong> breaks the whole project into a tree of smaller, manageable work packages. Rule of thumb: decompose until a package can be estimated and owned by one person. It answers "what exactly has to be done?".</p>
<pre><code>1 Launch event
  1.1 Venue      (book, layout, catering)
  1.2 Content    (deck, video, host script)
  1.3 Promotion  (invites, social, press)
  1.4 On-the-day (setup, run-of-show, teardown)
</code></pre>
<h3>Gantt chart &amp; milestones</h3>
<p>A <strong>Gantt chart</strong> lays tasks on a timeline as bars, showing start/end and dependencies. A <strong>milestone</strong> is a zero-duration marker of a key moment ("invitations sent", "venue confirmed").</p>
<h3>Critical path</h3>
<p>The <strong>critical path</strong> is the longest chain of dependent tasks — it sets the shortest possible project duration. A slip on a critical-path task slips the whole launch; a slip on a non-critical task (which has <strong>slack/float</strong>) may not.</p>
<pre><code>Book venue (5d) -&gt; Print invites (2d) -&gt; Send invites (1d)
 -&gt; Wait RSVP (7d)  = critical path 15 days
Design poster (3d) runs in parallel -&gt; has slack, not critical.
</code></pre>
<div class="callout"><span class="badge">Media example</span> For an event, "confirm venue → send invites → collect RSVPs" is critical. If the venue slips two days, the whole timeline slips — so the PM protects that chain first.</div>`,
    `<span class="eyebrow">GPM201c · Chương 3 · Bài 3.1</span>
<h2>Lập kế hoạch phạm vi &amp; tiến độ</h2>
<h3>Cấu trúc phân rã công việc (WBS)</h3>
<p>Một <strong>WBS</strong> chia cả dự án thành cây các gói công việc nhỏ, dễ quản lý. Nguyên tắc: chia đến khi một gói có thể ước lượng được và giao cho một người phụ trách. Nó trả lời "chính xác phải làm những gì?".</p>
<pre><code>1 Sự kiện ra mắt
  1.1 Địa điểm  (đặt chỗ, bố trí, tiệc)
  1.2 Nội dung  (slide, video, kịch bản MC)
  1.3 Quảng bá  (thư mời, mạng xã hội, báo chí)
  1.4 Ngày diễn (dựng, kịch bản chạy, dọn)
</code></pre>
<h3>Bảng Gantt &amp; milestone</h3>
<p>Một <strong>bảng Gantt</strong> đặt các công việc lên trục thời gian dưới dạng thanh, thể hiện bắt đầu/kết thúc và phụ thuộc. Một <strong>milestone</strong> là mốc không có thời lượng đánh dấu thời điểm quan trọng ("đã gửi thư mời", "đã chốt địa điểm").</p>
<h3>Đường găng (critical path)</h3>
<p><strong>Đường găng</strong> là chuỗi công việc phụ thuộc dài nhất — nó quyết định thời lượng ngắn nhất có thể của dự án. Trễ một việc trên đường găng làm trễ cả buổi ra mắt; trễ một việc ngoài đường găng (có <strong>độ trễ cho phép/float</strong>) thì có thể không sao.</p>
<pre><code>Đặt địa điểm (5n) -&gt; In thư mời (2n) -&gt; Gửi thư (1n)
 -&gt; Chờ hồi đáp (7n)  = đường găng 15 ngày
Thiết kế poster (3n) chạy song song -&gt; có float, không găng.
</code></pre>
<div class="callout"><span class="badge">Ví dụ truyền thông</span> Với một sự kiện, "chốt địa điểm → gửi thư mời → thu hồi đáp" là đường găng. Nếu địa điểm trễ hai ngày, cả tiến độ trễ theo — nên PM bảo vệ chuỗi đó trước tiên.</div>`,
  ]]);

const c3q = quiz('gpm201c-quiz-3', 'Quiz 3 — Scope &amp; schedule|||Quiz 3 — Phạm vi &amp; tiến độ', [
  { id: 'q1', question: 'WBS dùng để làm gì?|||What is a WBS for?', options: ['Chia dự án thành các gói công việc nhỏ|||Break the project into smaller work packages', 'Tính lợi nhuận|||Calculate profit', 'Chọn nhà tài trợ|||Pick the sponsor', 'Viết thông cáo báo chí|||Write the press release'], correctIndex: 0, explanation: 'WBS = phân rã công việc thành cây gói việc dễ quản lý.' },
  { id: 'q2', question: 'Đường găng (critical path) là?|||The critical path is?', options: ['Việc rẻ nhất|||The cheapest task', 'Chuỗi việc phụ thuộc DÀI NHẤT quyết định thời lượng dự án|||The LONGEST chain of dependent tasks setting project duration', 'Việc có nhiều float nhất|||The task with the most slack', 'Milestone cuối|||The last milestone'], correctIndex: 1, explanation: 'Đường găng = chuỗi dài nhất; trễ nó là trễ cả dự án.' },
  { id: 'q3', question: 'Một milestone trên bảng Gantt là?|||A milestone on a Gantt chart is?', options: ['Một công việc kéo dài nhiều tuần|||A task lasting many weeks', 'Mốc không thời lượng đánh dấu thời điểm quan trọng|||A zero-duration marker of a key moment', 'Ngân sách của dự án|||The project budget', 'Một rủi ro|||A risk'], correctIndex: 1, explanation: 'Milestone = mốc thời điểm quan trọng, thời lượng bằng 0.' },
]);

const c4 = doc('gpm201c-4-1-resource-budget-risk', '4.1 — Resources, budget &amp; risk|||4.1 — Nguồn lực, ngân sách &amp; rủi ro',
  'Phân bổ nguồn lực, lập ngân sách (bottom-up), sổ rủi ro, phân tích rủi ro (xác suất × tác động); ví dụ chiến dịch.',
  [[
    `<span class="eyebrow">GPM201c · Chapter 4 · Lesson 4.1</span>
<h2>Resources, budget &amp; risk</h2>
<h3>Resource allocation</h3>
<p><strong>Resources</strong> are people, money, equipment and vendors. Allocate so no one is <strong>over-allocated</strong> (assigned more than 100% at once); level the load by shifting non-critical tasks into the slack you found on the schedule.</p>
<h3>Budgeting</h3>
<p><strong>Bottom-up</strong> budgeting estimates the cost of each WBS package and sums up. Always add a <strong>contingency reserve</strong> for known risks (e.g. +10%).</p>
<pre><code>Content production   40M
Paid media (ads)     90M
Influencer fees      50M
Event / venue        20M
------------------------
Subtotal            200M
Contingency (10%)    20M
Total budget        220M
</code></pre>
<h3>Risk register &amp; analysis</h3>
<p>A <strong>risk register</strong> lists each risk with its <strong>probability</strong>, <strong>impact</strong>, a <strong>response</strong>, and an owner. Score = probability × impact to prioritize. Four responses: <strong>avoid, mitigate, transfer, accept</strong>.</p>
<pre><code>Risk                     Prob  Impact  Response
KOL cancels last-minute   Med    High   Mitigate: line up a backup
Ad account gets banned    Low    High   Transfer: use two platforms
Bad weather on event day   Med    Med    Accept + indoor plan B
</code></pre>
<div class="callout"><span class="badge">Media example</span> On a campaign, "the hero influencer pulls out" is the classic high-impact risk. Mitigate by signing a backup creator and shooting evergreen content early, so the campaign survives.</div>`,
    `<span class="eyebrow">GPM201c · Chương 4 · Bài 4.1</span>
<h2>Nguồn lực, ngân sách &amp; rủi ro</h2>
<h3>Phân bổ nguồn lực</h3>
<p><strong>Nguồn lực</strong> là con người, tiền, thiết bị và nhà cung cấp. Phân bổ sao cho không ai bị <strong>quá tải</strong> (được giao hơn 100% cùng lúc); cân tải bằng cách dời việc ngoài đường găng vào phần float đã tìm được trên tiến độ.</p>
<h3>Lập ngân sách</h3>
<p>Lập ngân sách <strong>từ dưới lên (bottom-up)</strong>: ước lượng chi phí từng gói WBS rồi cộng lại. Luôn thêm <strong>quỹ dự phòng</strong> cho rủi ro đã biết (vd +10%).</p>
<pre><code>Sản xuất nội dung    40tr
Quảng cáo trả phí    90tr
Phí KOL              50tr
Sự kiện / địa điểm   20tr
------------------------
Tạm tính            200tr
Dự phòng (10%)       20tr
Tổng ngân sách      220tr
</code></pre>
<h3>Sổ rủi ro &amp; phân tích</h3>
<p>Một <strong>sổ rủi ro</strong> liệt kê từng rủi ro với <strong>xác suất</strong>, <strong>tác động</strong>, <strong>cách ứng phó</strong> và người phụ trách. Điểm = xác suất × tác động để ưu tiên. Bốn cách ứng phó: <strong>né tránh, giảm nhẹ, chuyển giao, chấp nhận</strong>.</p>
<pre><code>Rủi ro                    XS    Tác động  Ứng phó
KOL huỷ phút chót          TB    Cao      Giảm nhẹ: chuẩn bị dự bị
Tài khoản QC bị khoá       Thấp  Cao      Chuyển giao: chạy 2 nền tảng
Thời tiết xấu ngày sự kiện TB    TB       Chấp nhận + phương án trong nhà
</code></pre>
<div class="callout"><span class="badge">Ví dụ truyền thông</span> Trong một chiến dịch, "KOL chủ lực rút lui" là rủi ro tác động cao kinh điển. Giảm nhẹ bằng cách ký thêm một creator dự bị và quay sẵn nội dung dùng lâu dài, để chiến dịch vẫn trụ được.</div>`,
  ]]);

const c4q = quiz('gpm201c-quiz-4', 'Quiz 4 — Budget &amp; risk|||Quiz 4 — Ngân sách &amp; rủi ro', [
  { id: 'q1', question: 'Điểm ưu tiên một rủi ro thường được tính bằng?|||A risk\'s priority score is usually?', options: ['Chi phí + thời gian|||Cost + time', 'Xác suất × tác động|||Probability × impact', 'Số người trong nhóm|||Team size', 'Phạm vi − ngân sách|||Scope − budget'], correctIndex: 1, explanation: 'Điểm rủi ro = xác suất × tác động để xếp thứ tự ưu tiên.' },
  { id: 'q2', question: 'Quỹ dự phòng (contingency) trong ngân sách để?|||A contingency reserve in the budget is for?', options: ['Trả lương PM|||Paying the PM', 'Đối phó rủi ro đã biết|||Covering known risks', 'Mua văn phòng phẩm|||Buying stationery', 'Không có mục đích|||No purpose'], correctIndex: 1, explanation: 'Dự phòng để hấp thụ rủi ro đã lường trước, tránh vỡ ngân sách.' },
  { id: 'q3', question: 'Ký một creator dự bị để phòng KOL chính rút lui là cách ứng phó nào?|||Signing a backup creator in case the main KOL drops is which response?', options: ['Chấp nhận (accept)|||Accept', 'Giảm nhẹ (mitigate)|||Mitigate', 'Né tránh (avoid) — bỏ hẳn KOL|||Avoid — drop KOLs entirely', 'Chuyển giao (transfer)|||Transfer'], correctIndex: 1, explanation: 'Chuẩn bị dự bị làm giảm tác động/xác suất → giảm nhẹ (mitigate).' },
]);

const c5 = doc('gpm201c-5-1-execution-team', '5.1 — Execution &amp; team management|||5.1 — Thực thi &amp; quản lý nhóm',
  'Xây dựng nhóm (Tuckman), giao tiếp, ma trận RACI, họp hiệu quả, xử lý xung đột; ví dụ nhóm chiến dịch.',
  [[
    `<span class="eyebrow">GPM201c · Chapter 5 · Lesson 5.1</span>
<h2>Execution &amp; team management</h2>
<h3>Building the team (Tuckman)</h3>
<p>Teams grow through stages: <strong>Forming → Storming → Norming → Performing</strong> (then Adjourning). The PM's job shifts from directing early on to enabling once the team performs.</p>
<h3>RACI — who does what</h3>
<p>A <strong>RACI matrix</strong> clears up ownership for each task:</p>
<ul>
<li><strong>R</strong>esponsible — does the work.</li>
<li><strong>A</strong>ccountable — one owner who signs off (only one A per task).</li>
<li><strong>C</strong>onsulted — gives input before.</li>
<li><strong>I</strong>nformed — told after.</li>
</ul>
<pre><code>Task            Designer  Copywriter  PM   Client
Campaign poster    R          C        A     I
Ad copy            C          R        A     I
Final approval     I          I        R     A
</code></pre>
<h3>Communication, meetings &amp; conflict</h3>
<p>Most PM time is communication. Keep meetings purposeful (agenda, owner, decisions, action items). Handle <strong>conflict</strong> by addressing the issue, not the person — <strong>collaborating</strong> (win-win) is best when the stakes and relationship both matter; <strong>compromising</strong> when time is short.</p>
<div class="callout"><span class="badge">Media example</span> Designer and copywriter clash over a hero banner. The PM uses RACI to remind them the PM is Accountable, hears both (Consulted), and calls a decision so the campaign ships on time.</div>`,
    `<span class="eyebrow">GPM201c · Chương 5 · Bài 5.1</span>
<h2>Thực thi &amp; quản lý nhóm</h2>
<h3>Xây dựng nhóm (Tuckman)</h3>
<p>Nhóm trưởng thành qua các giai đoạn: <strong>Hình thành → Sóng gió → Chuẩn hoá → Vận hành hiệu quả</strong> (rồi Kết thúc). Vai trò PM chuyển từ chỉ đạo lúc đầu sang hỗ trợ khi nhóm đã vận hành tốt.</p>
<h3>RACI — ai làm gì</h3>
<p>Một <strong>ma trận RACI</strong> làm rõ trách nhiệm cho từng công việc:</p>
<ul>
<li><strong>R</strong>esponsible — người trực tiếp làm.</li>
<li><strong>A</strong>ccountable — một người duyệt/chịu trách nhiệm cuối (mỗi việc chỉ một A).</li>
<li><strong>C</strong>onsulted — cho ý kiến trước.</li>
<li><strong>I</strong>nformed — được báo sau.</li>
</ul>
<pre><code>Công việc         Designer  Copywriter  PM   Khách
Poster chiến dịch    R          C        A     I
Nội dung quảng cáo   C          R        A     I
Duyệt cuối           I          I        R     A
</code></pre>
<h3>Giao tiếp, họp &amp; xung đột</h3>
<p>Phần lớn thời gian của PM là giao tiếp. Giữ cuộc họp có mục đích (chương trình, người chủ trì, quyết định, đầu việc). Xử lý <strong>xung đột</strong> bằng cách tập trung vào vấn đề, không vào con người — <strong>hợp tác</strong> (win-win) là tốt nhất khi cả lợi ích và quan hệ đều quan trọng; <strong>thoả hiệp</strong> khi thiếu thời gian.</p>
<div class="callout"><span class="badge">Ví dụ truyền thông</span> Designer và copywriter bất đồng về banner chủ đạo. PM dùng RACI để nhắc PM là người Accountable, lắng nghe cả hai (Consulted), rồi ra quyết định để chiến dịch kịp hạn.</div>`,
  ]]);

const c5q = quiz('gpm201c-quiz-5', 'Quiz 5 — Team &amp; RACI|||Quiz 5 — Nhóm &amp; RACI', [
  { id: 'q1', question: 'Trong RACI, mỗi công việc chỉ nên có đúng MỘT chữ nào?|||In RACI, each task should have exactly ONE of which letter?', options: ['R (Responsible)', 'A (Accountable)', 'C (Consulted)', 'I (Informed)'], correctIndex: 1, explanation: 'Mỗi việc chỉ một A (người chịu trách nhiệm cuối) để tránh mập mờ.' },
  { id: 'q2', question: 'Thứ tự đúng các giai đoạn phát triển nhóm theo Tuckman?|||Correct order of Tuckman team stages?', options: ['Storming → Forming → Performing → Norming', 'Forming → Storming → Norming → Performing', 'Norming → Forming → Storming → Performing', 'Performing → Norming → Storming → Forming'], correctIndex: 1, explanation: 'Tuckman: Hình thành → Sóng gió → Chuẩn hoá → Vận hành hiệu quả.' },
  { id: 'q3', question: 'Cách xử lý xung đột "win-win" khi cả lợi ích lẫn quan hệ đều quan trọng là?|||The "win-win" conflict style when both stakes and relationship matter is?', options: ['Né tránh (avoiding)|||Avoiding', 'Áp đặt (forcing)|||Forcing', 'Hợp tác (collaborating)|||Collaborating', 'Nhượng bộ hoàn toàn (accommodating)|||Fully accommodating'], correctIndex: 2, explanation: 'Hợp tác (collaborating) tìm giải pháp win-win cho cả hai bên.' },
]);

const c6 = doc('gpm201c-6-1-monitoring-control', '6.1 — Monitoring &amp; controlling|||6.1 — Giám sát &amp; kiểm soát',
  'KPI, giá trị thu được (EVM: PV/EV/AC, SPI/CPI), kiểm soát thay đổi (change control), báo cáo tiến độ; ví dụ chiến dịch.',
  [[
    `<span class="eyebrow">GPM201c · Chapter 6 · Lesson 6.1</span>
<h2>Monitoring &amp; controlling</h2>
<h3>KPIs &amp; status reporting</h3>
<p>You control what you measure. Track a few <strong>KPIs</strong> that map to the goal (reach, engagement rate, cost-per-lead, on-time task %), and report status simply — often a <strong>RAG</strong> (Red/Amber/Green) plus "what changed, what's next, what's blocked".</p>
<h3>Earned Value Management (EVM)</h3>
<p>EVM compares planned vs actual on <em>both</em> schedule and cost using three numbers:</p>
<ul>
<li><strong>PV</strong> (Planned Value) — budgeted cost of work planned by now.</li>
<li><strong>EV</strong> (Earned Value) — budgeted cost of work actually done.</li>
<li><strong>AC</strong> (Actual Cost) — what that work really cost.</li>
</ul>
<pre><code>SPI = EV / PV   (&lt;1 = behind schedule)
CPI = EV / AC   (&lt;1 = over budget)

Example: PV=100M, EV=80M, AC=90M
 SPI = 80/100 = 0.8  -&gt; behind schedule
 CPI = 80/90  = 0.89 -&gt; over budget
</code></pre>
<h3>Change control</h3>
<p>Uncontrolled additions are <strong>scope creep</strong>. Route every change through a simple <strong>change-control</strong> step: log the request, assess impact on scope/time/cost, then approve or reject — don't just say yes at the desk.</p>
<div class="callout"><span class="badge">Media example</span> Mid-campaign the client asks to add a TikTok series. The PM writes a change request, shows it needs +2 weeks and +30M, and gets sign-off before the team starts — avoiding silent scope creep.</div>`,
    `<span class="eyebrow">GPM201c · Chương 6 · Bài 6.1</span>
<h2>Giám sát &amp; kiểm soát</h2>
<h3>KPI &amp; báo cáo tiến độ</h3>
<p>Bạn kiểm soát được thứ bạn đo. Theo dõi vài <strong>KPI</strong> gắn với mục tiêu (độ phủ, tỷ lệ tương tác, chi phí mỗi lead, % việc đúng hạn), và báo cáo gọn — thường dùng <strong>RAG</strong> (Đỏ/Vàng/Xanh) kèm "đã đổi gì, làm gì tiếp, đang kẹt gì".</p>
<h3>Quản lý giá trị thu được (EVM)</h3>
<p>EVM so sánh kế hoạch với thực tế trên <em>cả</em> tiến độ và chi phí bằng ba con số:</p>
<ul>
<li><strong>PV</strong> (Giá trị kế hoạch) — chi phí dự toán của việc lẽ ra xong đến giờ.</li>
<li><strong>EV</strong> (Giá trị thu được) — chi phí dự toán của việc thực sự đã xong.</li>
<li><strong>AC</strong> (Chi phí thực) — việc đó tốn thật bao nhiêu.</li>
</ul>
<pre><code>SPI = EV / PV   (&lt;1 = chậm tiến độ)
CPI = EV / AC   (&lt;1 = vượt ngân sách)

Ví dụ: PV=100tr, EV=80tr, AC=90tr
 SPI = 80/100 = 0.8  -&gt; chậm tiến độ
 CPI = 80/90  = 0.89 -&gt; vượt ngân sách
</code></pre>
<h3>Kiểm soát thay đổi</h3>
<p>Thêm việc không kiểm soát là <strong>phình phạm vi (scope creep)</strong>. Cho mọi thay đổi đi qua một bước <strong>kiểm soát thay đổi</strong> đơn giản: ghi yêu cầu, đánh giá tác động lên phạm vi/thời gian/chi phí, rồi duyệt hoặc từ chối — đừng gật đầu ngay tại chỗ.</p>
<div class="callout"><span class="badge">Ví dụ truyền thông</span> Giữa chiến dịch, khách xin thêm series TikTok. PM viết yêu cầu thay đổi, chỉ ra cần thêm 2 tuần và 30 triệu, và xin duyệt trước khi nhóm bắt tay — tránh phình phạm vi âm thầm.</div>`,
  ]]);

const c6q = quiz('gpm201c-quiz-6', 'Quiz 6 — Monitoring &amp; control|||Quiz 6 — Giám sát &amp; kiểm soát', [
  { id: 'q1', question: 'CPI = EV/AC = 0.89 nghĩa là dự án đang?|||CPI = EV/AC = 0.89 means the project is?', options: ['Dưới ngân sách|||Under budget', 'Vượt ngân sách|||Over budget', 'Đúng ngân sách|||Exactly on budget', 'Trước tiến độ|||Ahead of schedule'], correctIndex: 1, explanation: 'CPI < 1 → EV nhỏ hơn AC → tiêu nhiều hơn giá trị làm ra → vượt ngân sách.' },
  { id: 'q2', question: 'Việc thêm hạng mục không qua kiểm soát khiến phạm vi lớn dần gọi là?|||Adding work without control so scope grows is called?', options: ['Đường găng|||Critical path', 'Phình phạm vi (scope creep)|||Scope creep', 'Milestone', 'Contingency (dự phòng)|||Contingency'], correctIndex: 1, explanation: 'Scope creep = phạm vi phình ra do thay đổi không kiểm soát.' },
  { id: 'q3', question: 'Trong EVM, EV (Earned Value) là?|||In EVM, EV (Earned Value) is?', options: ['Chi phí thực đã tiêu|||The actual cost spent', 'Chi phí dự toán của công việc THỰC SỰ đã xong|||The budgeted cost of work ACTUALLY done', 'Tổng ngân sách|||The total budget', 'Số việc còn lại|||Tasks remaining'], correctIndex: 1, explanation: 'EV = giá trị dự toán của phần công việc đã hoàn thành thật.' },
]);

const c7 = doc('gpm201c-7-1-agile-scrum', '7.1 — Agile &amp; Scrum|||7.1 — Agile &amp; Scrum',
  'Agile manifesto, Scrum (vai trò/sự kiện/tạo phẩm), sprint, Kanban, áp dụng marketing agile; ví dụ nội dung.',
  [[
    `<span class="eyebrow">GPM201c · Chapter 7 · Lesson 7.1</span>
<h2>Agile &amp; Scrum</h2>
<h3>The Agile mindset</h3>
<p>The <strong>Agile Manifesto</strong> values: individuals &amp; interactions, working results, customer collaboration, and <strong>responding to change</strong> — over rigid plans. Instead of one big delivery, you ship small increments and adjust with feedback. Perfect for evolving content and campaigns.</p>
<h3>Scrum — roles, events, artifacts</h3>
<ul>
<li><strong>Roles:</strong> Product Owner (owns priorities/backlog), Scrum Master (removes blockers, guards the process), Developers/the team (build it).</li>
<li><strong>Events:</strong> Sprint (a fixed 1–4 week cycle), Sprint Planning, Daily Scrum (15-min standup), Sprint Review (show the increment), Retrospective (improve the process).</li>
<li><strong>Artifacts:</strong> Product Backlog (all wanted work), Sprint Backlog (this sprint's slice), Increment (the done result).</li>
</ul>
<pre><code>Backlog -&gt; Sprint Planning -&gt; [ 2-week Sprint ]
   daily standup ... -&gt; Review -&gt; Retro -&gt; repeat
</code></pre>
<h3>Kanban &amp; marketing agile</h3>
<p><strong>Kanban</strong> visualizes flow on a board (To do → Doing → Done) and limits <strong>work-in-progress</strong> so the team finishes before starting more. <strong>Agile marketing</strong> runs content in sprints, tests ideas fast, and re-prioritizes the backlog on real data.</p>
<div class="callout"><span class="badge">Media example</span> A social team runs 2-week sprints: plan 8 posts, stand up daily, review engagement at sprint end, and re-order next sprint's backlog toward the formats that performed.</div>`,
    `<span class="eyebrow">GPM201c · Chương 7 · Bài 7.1</span>
<h2>Agile &amp; Scrum</h2>
<h3>Tư duy Agile</h3>
<p><strong>Tuyên ngôn Agile</strong> đề cao: con người &amp; tương tác, kết quả chạy được, cộng tác với khách hàng, và <strong>phản hồi thay đổi</strong> — hơn là kế hoạch cứng nhắc. Thay vì một lần bàn giao lớn, bạn giao từng phần nhỏ và điều chỉnh theo phản hồi. Rất hợp với nội dung và chiến dịch thay đổi liên tục.</p>
<h3>Scrum — vai trò, sự kiện, tạo phẩm</h3>
<ul>
<li><strong>Vai trò:</strong> Product Owner (sở hữu ưu tiên/backlog), Scrum Master (gỡ vướng, giữ quy trình), nhóm phát triển (làm ra sản phẩm).</li>
<li><strong>Sự kiện:</strong> Sprint (chu kỳ cố định 1–4 tuần), Lập kế hoạch Sprint, Daily Scrum (họp đứng 15 phút), Sơ kết Sprint (trình phần tăng trưởng), Họp cải tiến (Retrospective).</li>
<li><strong>Tạo phẩm:</strong> Product Backlog (mọi việc mong muốn), Sprint Backlog (phần của sprint này), Increment (kết quả đã hoàn thành).</li>
</ul>
<pre><code>Backlog -&gt; Lập kế hoạch Sprint -&gt; [ Sprint 2 tuần ]
   họp đứng mỗi ngày ... -&gt; Sơ kết -&gt; Cải tiến -&gt; lặp
</code></pre>
<h3>Kanban &amp; marketing agile</h3>
<p><strong>Kanban</strong> trực quan hoá luồng trên bảng (Cần làm → Đang làm → Xong) và giới hạn <strong>việc đang làm dở (WIP)</strong> để nhóm làm xong rồi mới bắt việc mới. <strong>Marketing agile</strong> chạy nội dung theo sprint, thử ý tưởng nhanh, và sắp lại ưu tiên backlog dựa trên số liệu thật.</p>
<div class="callout"><span class="badge">Ví dụ truyền thông</span> Một nhóm social chạy sprint 2 tuần: lên kế hoạch 8 bài, họp đứng mỗi ngày, sơ kết mức tương tác cuối sprint, và sắp lại backlog sprint sau hướng về những định dạng hiệu quả.</div>`,
  ]]);

const c7q = quiz('gpm201c-quiz-7', 'Quiz 7 — Agile &amp; Scrum|||Quiz 7 — Agile &amp; Scrum', [
  { id: 'q1', question: 'Trong Scrum, ai sở hữu và sắp thứ tự ưu tiên Product Backlog?|||In Scrum, who owns and prioritizes the Product Backlog?', options: ['Scrum Master', 'Product Owner', 'Nhà tài trợ|||The sponsor', 'Toàn bộ khách hàng|||All customers'], correctIndex: 1, explanation: 'Product Owner sở hữu và ưu tiên backlog; Scrum Master gỡ vướng.' },
  { id: 'q2', question: 'Daily Scrum (họp đứng) điển hình kéo dài?|||A typical Daily Scrum (standup) lasts?', options: ['Khoảng 15 phút|||About 15 minutes', 'Nửa ngày|||Half a day', 'Đúng 2 tuần|||Exactly 2 weeks', 'Không giới hạn|||Unlimited'], correctIndex: 0, explanation: 'Daily Scrum gói trong ~15 phút để đồng bộ nhanh.' },
  { id: 'q3', question: 'Kanban giới hạn điều gì để nhóm làm xong trước khi bắt việc mới?|||Kanban limits what so the team finishes before starting more?', options: ['Số nhân sự|||Headcount', 'Việc đang làm dở (WIP)|||Work-in-progress (WIP)', 'Ngân sách|||Budget', 'Số sprint|||Number of sprints'], correctIndex: 1, explanation: 'Kanban giới hạn WIP để tối ưu luồng và giảm việc dở dang.' },
]);

const c8 = doc('gpm201c-8-1-closure-lessons', '8.1 — Closure &amp; lessons learned|||8.1 — Kết thúc &amp; bài học',
  'Kết thúc dự án, nghiệm thu/bàn giao, retrospective, lessons learned, lưu trữ; công cụ Jira/Trello/Asana.',
  [[
    `<span class="eyebrow">GPM201c · Chapter 8 · Lesson 8.1</span>
<h2>Closure &amp; lessons learned</h2>
<h3>Formal project closure</h3>
<p>A project isn't done when the last task finishes — it's done when it's <strong>formally closed</strong>: deliverables <strong>accepted</strong> (sign-off against the agreed criteria), contracts and invoices settled, resources released, and the final report filed. Skipping closure leaves loose ends and unpaid vendors.</p>
<h3>Retrospective &amp; lessons learned</h3>
<p>Run a <strong>retrospective</strong>: what went well, what didn't, what to change next time — blameless and specific. Record <strong>lessons learned</strong> in a shared place so the next project starts smarter. This is the single most-skipped, highest-value PM habit.</p>
<pre><code>Retro (keep / drop / try):
 Keep : booked venue early -&gt; critical path safe
 Drop : approvals by chat -&gt; things got lost
 Try  : one approval owner + a change log
</code></pre>
<h3>PM tools</h3>
<ul>
<li><strong>Jira</strong> — sprints, backlogs, burndown; best for structured Agile teams.</li>
<li><strong>Trello</strong> — simple Kanban boards; great for a content calendar.</li>
<li><strong>Asana</strong> — tasks, timelines &amp; dependencies for cross-team projects.</li>
</ul>
<div class="callout"><span class="badge">Media example</span> After a product launch, the team holds a 60-minute retro, logs "book KOLs 3 weeks earlier" and "one approver only", and files reusable templates in Asana — so the next launch is faster and calmer.</div>`,
    `<span class="eyebrow">GPM201c · Chương 8 · Bài 8.1</span>
<h2>Kết thúc &amp; bài học</h2>
<h3>Kết thúc dự án chính thức</h3>
<p>Dự án chưa xong khi việc cuối kết thúc — nó xong khi được <strong>kết thúc chính thức</strong>: sản phẩm bàn giao được <strong>nghiệm thu</strong> (ký duyệt theo tiêu chí đã thống nhất), hợp đồng và hoá đơn tất toán, giải phóng nguồn lực, và nộp báo cáo cuối. Bỏ qua bước kết thúc để lại việc dang dở và nhà cung cấp chưa được trả.</p>
<h3>Họp rút kinh nghiệm &amp; bài học</h3>
<p>Chạy một buổi <strong>retrospective</strong>: điều gì tốt, điều gì chưa, lần sau đổi gì — không đổ lỗi và cụ thể. Ghi <strong>bài học (lessons learned)</strong> vào nơi dùng chung để dự án sau bắt đầu khôn hơn. Đây là thói quen bị bỏ qua nhiều nhất nhưng giá trị cao nhất của PM.</p>
<pre><code>Retro (giữ / bỏ / thử):
 Giữ : đặt địa điểm sớm -&gt; đường găng an toàn
 Bỏ  : duyệt qua chat -&gt; hay thất lạc
 Thử : một người duyệt + một sổ ghi thay đổi
</code></pre>
<h3>Công cụ PM</h3>
<ul>
<li><strong>Jira</strong> — sprint, backlog, burndown; hợp nhóm Agile bài bản.</li>
<li><strong>Trello</strong> — bảng Kanban đơn giản; rất hợp lịch nội dung.</li>
<li><strong>Asana</strong> — công việc, timeline &amp; phụ thuộc cho dự án liên nhóm.</li>
</ul>
<div class="callout"><span class="badge">Ví dụ truyền thông</span> Sau một buổi ra mắt sản phẩm, nhóm họp retro 60 phút, ghi "đặt KOL sớm hơn 3 tuần" và "chỉ một người duyệt", và lưu các mẫu dùng lại trong Asana — để lần ra mắt sau nhanh và nhẹ nhàng hơn.</div>`,
  ]]);

const c8q = quiz('gpm201c-quiz-8', 'Quiz 8 — Closure &amp; lessons|||Quiz 8 — Kết thúc &amp; bài học', [
  { id: 'q1', question: 'Một dự án được coi là "kết thúc chính thức" khi?|||A project is "formally closed" when?', options: ['Việc cuối cùng vừa xong|||The last task just finished', 'Sản phẩm được nghiệm thu, hợp đồng tất toán, báo cáo nộp|||Deliverables accepted, contracts settled, report filed', 'Ngân sách đã tiêu hết|||The budget is fully spent', 'Nhóm giải tán|||The team disbands'], correctIndex: 1, explanation: 'Kết thúc chính thức = nghiệm thu + tất toán + báo cáo + giải phóng nguồn lực.' },
  { id: 'q2', question: 'Mục đích chính của retrospective / lessons learned là?|||The main purpose of a retrospective / lessons learned is?', options: ['Tìm người để đổ lỗi|||Find someone to blame', 'Rút kinh nghiệm để dự án sau tốt hơn|||Capture learning so the next project is better', 'Tính lương thưởng|||Compute bonuses', 'Đóng hoá đơn|||Close invoices'], correctIndex: 1, explanation: 'Retro không đổ lỗi; ghi bài học để cải thiện dự án tương lai.' },
  { id: 'q3', question: 'Công cụ nào phù hợp nhất cho một bảng Kanban đơn giản kiểu lịch nội dung?|||Which tool best fits a simple Kanban board like a content calendar?', options: ['Trello', 'EVM', 'WBS', 'RACI'], correctIndex: 0, explanation: 'Trello là bảng Kanban đơn giản, rất hợp lịch nội dung; EVM/WBS/RACI là kỹ thuật, không phải công cụ bảng.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'GPM201c',
    slug: 'gpm201c-professional-project-management',
    title: 'Professional Project Management',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/GPM201c.webp',
    shortDescription: 'Run media & marketing projects professionally — triple constraint, charter & stakeholders, WBS/Gantt/critical path, budget & risk, RACI, EVM & change control, Agile/Scrum/Kanban, closure. Bilingual, campaign/launch/event examples.|||Quản lý dự án truyền thông & marketing chuyên nghiệp — tam giác ràng buộc, charter & bên liên quan, WBS/Gantt/đường găng, ngân sách & rủi ro, RACI, EVM & kiểm soát thay đổi, Agile/Scrum/Kanban, kết thúc. Song ngữ, ví dụ chiến dịch/ra mắt/sự kiện.',
    description: 'Môn <strong>GPM201c — Professional Project Management</strong> (Quản lý dự án chuyên nghiệp, kỳ 5, ngành Công nghệ Truyền thông) dạy lập kế hoạch và dẫn dắt dự án từ ý tưởng tới bàn giao, áp dụng cho <strong>dự án truyền thông/marketing</strong> (ra mắt sản phẩm, sự kiện, chiến dịch). Vì môn không có giáo trình FLM, khoá học bám <strong>chuẩn quốc tế</strong>: PMI PMBOK Guide 7th, Scrum Guide, Kerzner. Từ <strong>khởi tạo</strong> (charter, bên liên quan, SMART) → <strong>lập kế hoạch</strong> (WBS, Gantt, đường găng, ngân sách, rủi ro) → <strong>thực thi &amp; kiểm soát</strong> (RACI, EVM, kiểm soát thay đổi) → <strong>Agile/Scrum/Kanban</strong> → <strong>kết thúc &amp; bài học</strong>. Song ngữ, ví dụ thật, quiz mỗi chương.',
    whatYouLearn: 'Dự án vs vận hành &amp; tam giác ràng buộc; charter, business case, stakeholder analysis, mục tiêu SMART; WBS, Gantt, đường găng, milestone; phân bổ nguồn lực, ngân sách bottom-up, sổ rủi ro (xác suất×tác động); xây nhóm (Tuckman), RACI, giao tiếp, xử lý xung đột; KPI, EVM (PV/EV/AC, SPI/CPI), kiểm soát thay đổi; Agile manifesto, Scrum (vai trò/sự kiện/tạo phẩm), Kanban, marketing agile; kết thúc, retrospective, lessons learned; công cụ Jira/Trello/Asana.',
    requirements: 'Không cần nền kỹ thuật. Nên có một dự án thật để thực hành (chiến dịch, sự kiện, hoặc ra mắt sản phẩm). Tạo tài khoản miễn phí Trello hoặc Jira để làm bài tập.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Chuẩn quốc tế (PMBOK, Scrum Guide, Kerzner), khoá miễn phí, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Dự án là gì, PM làm gì, lộ trình 4 bước, predictive vs Agile.', lessons: [intro] },
    { title: 'Chương 1 — QLDA là gì|||Chapter 1 — What is PM', description: 'Dự án vs vận hành, tam giác ràng buộc, vai trò PM, vòng đời.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Khởi tạo & bên liên quan|||Chapter 2 — Initiation & stakeholders', description: 'Charter, business case, stakeholder analysis, SMART.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Phạm vi & tiến độ|||Chapter 3 — Scope & schedule', description: 'WBS, Gantt, đường găng, milestone.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Nguồn lực, ngân sách & rủi ro|||Chapter 4 — Resources, budget & risk', description: 'Phân bổ nguồn lực, ngân sách, sổ rủi ro.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Thực thi & nhóm|||Chapter 5 — Execution & team', description: 'Tuckman, RACI, giao tiếp, họp, xung đột.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Giám sát & kiểm soát|||Chapter 6 — Monitoring & control', description: 'KPI, EVM (SPI/CPI), kiểm soát thay đổi, báo cáo.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Agile & Scrum|||Chapter 7 — Agile & Scrum', description: 'Agile manifesto, Scrum, Kanban, marketing agile.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Kết thúc & bài học|||Chapter 8 — Closure & lessons', description: 'Nghiệm thu, retrospective, lessons learned, công cụ.', lessons: [c8, c8q] },
  ],
};
