/**
 * EPO201 — Event Production and Operations Management. Giáo trình FLM
 * (syl): sản xuất & vận hành sự kiện — tổng quan, lập kế hoạch & production
 * schedule, quản lý địa điểm & bố trí, sân khấu/AV/thi công, nhà cung cấp &
 * nhân sự, vận hành ngày sự kiện (show calling, run sheet), an toàn/an ninh &
 * rủi ro, kết thúc (bump-out) & đánh giá. Song ngữ + ví dụ + bài tập.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('epo201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (kèm link), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">EPO201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Event Production and Operations Management — planning, venue, staging/AV, vendors &amp; staff, show calling, safety and post-event review — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for EPO201 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://www.wiley.com/en-us/Events+Management%2C+5th+Edition-p-9781119710407" target="_blank" rel="noopener"><em>Events Management</em> — Glenn Bowdin et al. (Routledge/Wiley)</a></li>
<li><a href="https://www.routledge.com/Production-Management-for-Live-Entertainment/Bageris/p/book/9781138580598" target="_blank" rel="noopener"><em>Production Management for Live Events</em></a></li>
<li><a href="https://www.wiley.com/en-us/Special+Events%3A+Creating+and+Sustaining+a+New+World+for+Celebration%2C+8th+Edition-p-9781119585678" target="_blank" rel="noopener"><em>Special Events</em> — Joe Goldblatt</a></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.eventmanagerblog.com/" target="_blank" rel="noopener">Event Manager Blog — industry guides &amp; checklists</a></li>
<li><a href="https://www.iavm.org/" target="_blank" rel="noopener">IAVM — International Association of Venue Managers</a></li>
<li><a href="https://www.osha.gov/event-safety" target="_blank" rel="noopener">OSHA — event &amp; entertainment safety resources</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@EventManagerBlog" target="_blank" rel="noopener">Event Manager Blog</a> — production &amp; operations walkthroughs</li>
<li><a href="https://www.youtube.com/@ProductionClub" target="_blank" rel="noopener">Production Club</a> — live-event staging, AV &amp; touring production</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.aligned.events/" target="_blank" rel="noopener">Aligned / event floor-plan software</a> — venue &amp; layout diagramming</li>
<li><a href="https://www.eventmobi.com/" target="_blank" rel="noopener">EventMobi</a> — event logistics &amp; run-of-show tools</li>
<li>Spreadsheet (Google Sheets/Excel) — the everyday tool for production schedules &amp; run sheets</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — production vs. operations, roles, the production schedule, venue &amp; floor plan basics.</li>
<li><strong>Practice</strong> — draft a production schedule and a floor plan for a small event (e.g. a 200-guest conference).</li>
<li><strong>Go deeper</strong> — staging/AV/load-in, vendor &amp; staff management, show calling with a run sheet.</li>
<li><strong>Job-ready</strong> — build a risk assessment, run a bump-out checklist, write a post-event evaluation report.</li>
</ol></div>`,
    `<span class="eyebrow">EPO201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Sản xuất &amp; vận hành sự kiện — lập kế hoạch, địa điểm, sân khấu/AV, nhà cung cấp &amp; nhân sự, show calling, an toàn và đánh giá sau sự kiện — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của EPO201 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://www.wiley.com/en-us/Events+Management%2C+5th+Edition-p-9781119710407" target="_blank" rel="noopener"><em>Events Management</em> — Glenn Bowdin và cộng sự (Routledge/Wiley)</a></li>
<li><a href="https://www.routledge.com/Production-Management-for-Live-Entertainment/Bageris/p/book/9781138580598" target="_blank" rel="noopener"><em>Production Management for Live Events</em></a></li>
<li><a href="https://www.wiley.com/en-us/Special+Events%3A+Creating+and+Sustaining+a+New+World+for+Celebration%2C+8th+Edition-p-9781119585678" target="_blank" rel="noopener"><em>Special Events</em> — Joe Goldblatt</a></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.eventmanagerblog.com/" target="_blank" rel="noopener">Event Manager Blog — hướng dẫn &amp; checklist ngành</a></li>
<li><a href="https://www.iavm.org/" target="_blank" rel="noopener">IAVM — Hiệp hội Quản lý Địa điểm Quốc tế</a></li>
<li><a href="https://www.osha.gov/event-safety" target="_blank" rel="noopener">OSHA — tài nguyên an toàn sự kiện &amp; giải trí</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@EventManagerBlog" target="_blank" rel="noopener">Event Manager Blog</a> — sản xuất &amp; vận hành thực tế</li>
<li><a href="https://www.youtube.com/@ProductionClub" target="_blank" rel="noopener">Production Club</a> — dựng sân khấu, AV &amp; sản xuất lưu diễn</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.aligned.events/" target="_blank" rel="noopener">Aligned / phần mềm floor-plan sự kiện</a> — vẽ sơ đồ địa điểm &amp; bố trí</li>
<li><a href="https://www.eventmobi.com/" target="_blank" rel="noopener">EventMobi</a> — công cụ logistics &amp; run-of-show</li>
<li>Bảng tính (Google Sheets/Excel) — công cụ phổ biến nhất cho production schedule &amp; run sheet</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — production vs. operations, các vai trò, production schedule, cơ bản về địa điểm &amp; floor plan.</li>
<li><strong>Luyện tập</strong> — soạn một production schedule và floor plan cho sự kiện nhỏ (vd hội thảo 200 khách).</li>
<li><strong>Đào sâu thực tế</strong> — sân khấu/AV/load-in, quản lý nhà cung cấp &amp; nhân sự, show calling bằng run sheet.</li>
<li><strong>Sẵn sàng đi làm</strong> — dựng bảng đánh giá rủi ro, chạy checklist bump-out, viết báo cáo đánh giá sau sự kiện.</li>
</ol></div>`,
  ]]);

const intro = doc('epo201-0-1-overview', 'Course overview: Event Production and Operations Management|||Tổng quan: Sản xuất và Vận hành sự kiện',
  'Production vs. operations; các vai trò chính; lộ trình môn: lập kế hoạch → địa điểm → sân khấu/AV → nhà cung cấp/nhân sự → vận hành ngày sự kiện → an toàn/rủi ro → kết thúc & đánh giá.',
  [[
    `<span class="eyebrow">EPO201 · Lesson 0.1 · Overview</span>
<h2>Event Production &amp; Operations Management</h2>
<p class="lead">This course teaches you how a live event actually gets <strong>built</strong> and <strong>run</strong> — from a creative brief on paper to a working stage with sound, light, crew and guests moving safely through a venue. It sits between event marketing (why the event exists) and the physical, logistical work of making it happen.</p>
<h3>Two halves of one job</h3>
<ul>
<li><strong>Production</strong> — the physical/technical build: staging, audio-visual, lighting, décor, structures. Answers "what gets built, and how."</li>
<li><strong>Operations</strong> — the planning &amp; coordination of logistics, timeline, resources, staff and guest flow. Answers "who does what, when, and what happens if it goes wrong."</li>
</ul>
<h3>Key roles</h3>
<ul>
<li><strong>Event Producer</strong> — owns the overall vision, budget and outcome.</li>
<li><strong>Production Manager (PM)</strong> — owns the technical build: staging, AV, load-in/out.</li>
<li><strong>Operations Manager</strong> — owns logistics: schedule, vendors, staffing, guest flow, safety.</li>
<li><strong>Stage Manager / Show Caller</strong> — runs the show live, cue by cue, on the day.</li>
</ul>
<h3>Roadmap</h3>
<p>Production planning &amp; the <strong>production schedule</strong> → venue management &amp; <strong>floor plan</strong> → staging, AV &amp; technical build (<strong>load-in/out</strong>) → vendor &amp; staff management → day-of operations (<strong>show calling, run sheet</strong>) → safety, security &amp; risk management → wrap-up (<strong>bump-out</strong>), evaluation &amp; continuous improvement.</p>
<div class="callout"><span class="badge">One idea to hold onto</span> Every event is a temporary organization built from scratch and torn down within hours or days — production &amp; operations is the discipline that makes that temporary organization safe, on time, and repeatable.</div>`,
    `<span class="eyebrow">EPO201 · Bài 0.1 · Tổng quan</span>
<h2>Sản xuất &amp; Vận hành sự kiện</h2>
<p class="lead">Môn này dạy bạn cách một sự kiện thật được <strong>dựng</strong> và <strong>vận hành</strong> — từ một bản brief sáng tạo trên giấy đến một sân khấu thật với âm thanh, ánh sáng, nhân sự và khách di chuyển an toàn trong địa điểm. Nó nằm giữa marketing sự kiện (vì sao sự kiện tồn tại) và phần công việc vật lý, hậu cần để hiện thực hoá nó.</p>
<h3>Hai nửa của một công việc</h3>
<ul>
<li><strong>Sản xuất (Production)</strong> — phần dựng vật lý/kỹ thuật: sân khấu, âm thanh-hình ảnh (AV), ánh sáng, trang trí, kết cấu. Trả lời "dựng cái gì, dựng thế nào."</li>
<li><strong>Vận hành (Operations)</strong> — lập kế hoạch &amp; điều phối hậu cần, lịch trình, nguồn lực, nhân sự và luồng khách. Trả lời "ai làm gì, khi nào, và nếu trục trặc thì sao."</li>
</ul>
<h3>Các vai trò chính</h3>
<ul>
<li><strong>Event Producer</strong> — chịu trách nhiệm tầm nhìn tổng thể, ngân sách và kết quả.</li>
<li><strong>Production Manager (PM)</strong> — chịu trách nhiệm phần dựng kỹ thuật: sân khấu, AV, load-in/out.</li>
<li><strong>Operations Manager</strong> — chịu trách nhiệm hậu cần: lịch trình, nhà cung cấp, nhân sự, luồng khách, an toàn.</li>
<li><strong>Stage Manager / Show Caller</strong> — điều hành show trực tiếp, theo từng cue, vào ngày diễn ra.</li>
</ul>
<h3>Lộ trình</h3>
<p>Lập kế hoạch sản xuất &amp; <strong>production schedule</strong> → quản lý địa điểm &amp; <strong>floor plan</strong> → sân khấu, AV &amp; thi công (<strong>load-in/out</strong>) → quản lý nhà cung cấp &amp; nhân sự → vận hành ngày sự kiện (<strong>show calling, run sheet</strong>) → an toàn, an ninh &amp; quản trị rủi ro → kết thúc (<strong>bump-out</strong>), đánh giá &amp; cải tiến liên tục.</p>
<div class="callout"><span class="badge">Một ý cần nhớ</span> Mỗi sự kiện là một tổ chức tạm thời được dựng từ đầu và dỡ đi trong vài giờ hoặc vài ngày — sản xuất &amp; vận hành là bộ môn giúp tổ chức tạm thời đó an toàn, đúng giờ và lặp lại được.</div>`,
  ]]);

const c1 = doc('epo201-1-1-production-operations-overview', '1.1 — What is event production & operations|||1.1 — Sản xuất & vận hành sự kiện là gì',
  'Định nghĩa production vs. operations; vòng đời sự kiện (pre-event, event, post-event); tổ chức tạm thời & phối hợp đa bên.',
  [[
    `<span class="eyebrow">EPO201 · Chapter 1 · Lesson 1.1</span>
<h2>What is event production &amp; operations</h2>
<h3>Two lenses on the same event</h3>
<ul>
<li><strong>Event production</strong> — the technical and creative build that guests experience: staging, sound, lighting, video, décor, and the structures that hold them up.</li>
<li><strong>Event operations</strong> — the invisible scaffolding that makes production possible on time and on budget: timeline, budget tracking, vendor coordination, staffing, permits, and guest flow.</li>
</ul>
<h3>The event lifecycle</h3>
<pre><code>Pre-event   -> Planning, design, budgeting, vendor booking, production schedule
On-site     -> Load-in, build, rehearsal, doors, show, load-out (bump-out)
Post-event  -> Settlement, debrief, evaluation report, lessons learned
</code></pre>
<h3>Why it is a "temporary organization"</h3>
<p>An event assembles dozens of independent parties — venue, AV vendor, caterer, security, talent, volunteers — who have often never worked together, for a single deliverable that cannot slip its date. Production &amp; operations management is the discipline of coordinating that temporary organization so nothing that matters is left to chance.</p>
<div class="callout"><span class="badge">Core mindset</span> Production asks "what are we building?" Operations asks "who, when, and what if it fails?" A well-run event needs a confident answer to both.</div>`,
    `<span class="eyebrow">EPO201 · Chương 1 · Bài 1.1</span>
<h2>Sản xuất &amp; vận hành sự kiện là gì</h2>
<h3>Hai góc nhìn về cùng một sự kiện</h3>
<ul>
<li><strong>Sản xuất sự kiện</strong> — phần dựng kỹ thuật &amp; sáng tạo mà khách trải nghiệm: sân khấu, âm thanh, ánh sáng, video, trang trí, và kết cấu đỡ chúng.</li>
<li><strong>Vận hành sự kiện</strong> — bộ khung vô hình giúp sản xuất diễn ra đúng giờ, đúng ngân sách: lịch trình, theo dõi chi phí, điều phối nhà cung cấp, nhân sự, giấy phép, luồng khách.</li>
</ul>
<h3>Vòng đời sự kiện</h3>
<pre><code>Trước sự kiện -> Lập kế hoạch, thiết kế, ngân sách, đặt nhà cung cấp, production schedule
Tại địa điểm  -> Load-in, dựng, tổng duyệt, mở cửa, diễn ra, load-out (bump-out)
Sau sự kiện   -> Thanh toán, họp rút kinh nghiệm, báo cáo đánh giá, bài học rút ra
</code></pre>
<h3>Vì sao gọi là "tổ chức tạm thời"</h3>
<p>Một sự kiện tập hợp hàng chục bên độc lập — địa điểm, nhà cung cấp AV, catering, an ninh, nghệ sĩ, tình nguyện viên — thường chưa từng làm việc cùng nhau, cho một sản phẩm duy nhất không thể trễ ngày. Quản lý sản xuất &amp; vận hành là bộ môn điều phối tổ chức tạm thời đó để không có gì quan trọng bị bỏ mặc cho may rủi.</p>
<div class="callout"><span class="badge">Tư duy cốt lõi</span> Sản xuất hỏi "chúng ta dựng cái gì?" Vận hành hỏi "ai, khi nào, và nếu hỏng thì sao?" Một sự kiện chạy tốt cần câu trả lời chắc chắn cho cả hai.</div>`,
  ]]);

const c1q = quiz('epo201-quiz-1', 'Quiz 1 — Overview|||Quiz 1 — Tổng quan', [
  { id: 'q1', question: 'Trong hai nửa của sự kiện, "production" tập trung vào điều gì?', options: ['Ngân sách marketing', 'Phần dựng kỹ thuật/sáng tạo (sân khấu, AV, ánh sáng)', 'Chỉ khâu bán vé', 'Chỉ khâu truyền thông sau sự kiện'], correctIndex: 1, explanation: 'Production là phần dựng vật lý/kỹ thuật mà khách trải nghiệm.' },
  { id: 'q2', question: '"Operations" trong sự kiện chủ yếu trả lời câu hỏi nào?', options: ['Sự kiện có màu chủ đề gì', 'Ai làm gì, khi nào, và nếu trục trặc thì xử lý ra sao', 'Sân khấu cao bao nhiêu mét', 'Loại đèn nào được dùng'], correctIndex: 1, explanation: 'Operations lo hậu cần, lịch trình, nhân sự và phương án dự phòng.' },
  { id: 'q3', question: 'Vì sao một sự kiện được gọi là "tổ chức tạm thời"?', options: ['Vì nó chỉ có một nhân viên', 'Vì nó tập hợp nhiều bên độc lập, dựng lên rồi dỡ đi trong thời gian ngắn', 'Vì nó không cần ngân sách', 'Vì nó không có vòng đời'], correctIndex: 1, explanation: 'Sự kiện gom nhiều bên chưa từng làm cùng nhau, cho một deadline không thể trễ.' },
]);

const c2 = doc('epo201-2-1-production-planning-schedule', '2.1 — Production planning & the production schedule|||2.1 — Lập kế hoạch sản xuất & production schedule',
  'Pre-production meeting; production schedule (master timeline); đường tới hạn (critical path); vùng đệm thời gian.',
  [[
    `<span class="eyebrow">EPO201 · Chapter 2 · Lesson 2.1</span>
<h2>Production planning &amp; the production schedule</h2>
<h3>The pre-production meeting</h3>
<p>Before anyone touches a cable, key stakeholders — producer, PM, ops manager, venue rep, key vendors — align on scope, budget, timeline and risk in a <strong>pre-production meeting</strong>. This is where the master document for the whole build gets drafted: the <strong>production schedule</strong>.</p>
<h3>The production schedule</h3>
<p>A production schedule is the master timeline of the entire event: every task, who owns it, and the time window it must happen in — from the first truck arriving to the last one leaving.</p>
<pre><code>PRODUCTION SCHEDULE (excerpt)
07:00-09:00  Load-in: staging & rigging          Staging vendor
09:00-11:00  Load-in: AV (sound, light, video)    AV vendor
11:00-12:30  Power & cabling check                Production Manager
12:30-14:00  Rehearsal / sound check               Stage Manager
14:00-15:00  Décor & signage install                Décor vendor
15:00-16:00  Final walkthrough & safety check       Ops Manager
17:00        Doors open
19:00-21:00  Show
21:00-23:00  Load-out (bump-out)                    All crews
</code></pre>
<h3>Critical path &amp; buffers</h3>
<p>The <strong>critical path</strong> is the chain of tasks that determines the earliest possible finish — if any task on it slips, the whole event slips. Build in <strong>time buffers</strong> around it (extra minutes between load-in and rehearsal, between rehearsal and doors) because live builds never go exactly to plan.</p>
<div class="callout"><span class="badge">Rule of thumb</span> If a task has no slack and no owner, it will be the reason the show starts late — find those tasks in planning, not on the day.</div>`,
    `<span class="eyebrow">EPO201 · Chương 2 · Bài 2.1</span>
<h2>Lập kế hoạch sản xuất &amp; production schedule</h2>
<h3>Cuộc họp tiền sản xuất (pre-production meeting)</h3>
<p>Trước khi ai đó chạm vào một sợi cáp, các bên liên quan chính — producer, PM, ops manager, đại diện địa điểm, nhà cung cấp trọng yếu — thống nhất phạm vi, ngân sách, lịch trình và rủi ro trong một <strong>cuộc họp tiền sản xuất</strong>. Đây là nơi tài liệu chủ đạo cho toàn bộ quá trình dựng được soạn ra: <strong>production schedule</strong>.</p>
<h3>Production schedule</h3>
<p>Production schedule là lịch trình chủ đạo của toàn bộ sự kiện: mọi đầu việc, ai chịu trách nhiệm, và khung thời gian nó phải diễn ra — từ chiếc xe tải đầu tiên tới đến chiếc cuối cùng rời đi.</p>
<pre><code>PRODUCTION SCHEDULE (trích)
07:00-09:00  Load-in: sân khấu & rigging          Nhà cung cấp sân khấu
09:00-11:00  Load-in: AV (âm thanh, ánh sáng, video)  Nhà cung cấp AV
11:00-12:30  Kiểm tra nguồn điện & cáp             Production Manager
12:30-14:00  Tổng duyệt / sound check               Stage Manager
14:00-15:00  Lắp trang trí & bảng hiệu               Nhà cung cấp décor
15:00-16:00  Rà soát cuối & kiểm tra an toàn         Ops Manager
17:00        Mở cửa
19:00-21:00  Diễn ra
21:00-23:00  Load-out (bump-out)                    Toàn bộ đội thi công
</code></pre>
<h3>Đường tới hạn (critical path) &amp; vùng đệm</h3>
<p><strong>Critical path</strong> là chuỗi công việc quyết định thời điểm hoàn thành sớm nhất — nếu bất kỳ việc nào trên chuỗi này trễ, toàn bộ sự kiện sẽ trễ. Hãy chèn <strong>vùng đệm thời gian</strong> quanh nó (thêm vài phút giữa load-in và tổng duyệt, giữa tổng duyệt và mở cửa) vì việc dựng thực tế hiếm khi đúng kế hoạch 100%.</p>
<div class="callout"><span class="badge">Nguyên tắc</span> Một việc không có thời gian dư và không có người chịu trách nhiệm sẽ là lý do show trễ giờ — tìm ra những việc đó khi lập kế hoạch, không phải vào ngày diễn ra.</div>`,
  ]]);

const c2q = quiz('epo201-quiz-2', 'Quiz 2 — Production planning & schedule|||Quiz 2 — Lập kế hoạch & production schedule', [
  { id: 'q1', question: 'Production schedule là gì?', options: ['Danh sách khách mời VIP', 'Lịch trình chủ đạo của toàn bộ sự kiện với đầu việc, người chịu trách nhiệm & khung giờ', 'Bảng giá thuê địa điểm', 'Kịch bản MC'], correctIndex: 1, explanation: 'Production schedule là master timeline từ load-in tới load-out.' },
  { id: 'q2', question: 'Critical path (đường tới hạn) là gì?', options: ['Đường đi ngắn nhất từ bãi xe vào sân khấu', 'Chuỗi công việc quyết định thời điểm hoàn thành sớm nhất, trễ một việc là trễ cả sự kiện', 'Danh sách nhà cung cấp rẻ nhất', 'Lối thoát hiểm chính'], correctIndex: 1, explanation: 'Việc nào trên critical path trễ thì toàn bộ tiến độ trễ theo.' },
  { id: 'q3', question: 'Vì sao cần chèn vùng đệm (buffer) thời gian trong lịch trình?', options: ['Để nhân sự nghỉ ngơi nhiều hơn', 'Vì việc dựng thực tế hiếm khi đúng 100% kế hoạch, cần dư thời gian xử lý phát sinh', 'Để tăng chi phí thuê nhân công', 'Vì quy định pháp luật bắt buộc'], correctIndex: 1, explanation: 'Buffer hấp thụ chậm trễ nhỏ trước khi nó lan sang critical path.' },
]);

const c3 = doc('epo201-3-1-venue-layout', '3.1 — Venue management & layout (floor plan)|||3.1 — Quản lý địa điểm & bố trí (floor plan)',
  'Đánh giá địa điểm (site survey); floor plan; sức chứa & lối thoát hiểm; đường vào load-in, điện, rigging point.',
  [[
    `<span class="eyebrow">EPO201 · Chapter 3 · Lesson 3.1</span>
<h2>Venue management &amp; layout</h2>
<h3>Site survey — assessing the venue</h3>
<p>Before booking, a <strong>site survey</strong> checks whether the venue can actually support the event: loading dock/door dimensions (can the truck and gear fit?), available power (amps, phases), rigging points and their load rating, ceiling height, sightlines, and existing noise/curfew restrictions.</p>
<h3>The floor plan</h3>
<p>A <strong>floor plan</strong> is a to-scale drawing showing stage, seating/standing areas, FOH (front of house — the mixing/control position), vendor booths, bars, restrooms, and every <strong>exit</strong>. It is the single reference every vendor, security team and fire marshal works from.</p>
<pre><code>FLOOR PLAN — key elements to mark
[ Stage ]  [ FOH position ]  [ Seating / standing zones ]
[ Vendor booths ]  [ Bars / catering ]  [ Restrooms ]
[ EXIT x N ]  [ Fire lanes ]  [ Accessible route ]  [ First-aid post ]
</code></pre>
<h3>Capacity &amp; egress</h3>
<p><strong>Capacity</strong> is the maximum number of people the space and its exits can safely hold — set by fire code, not by how many tickets you want to sell. <strong>Egress</strong> is how quickly everyone can exit in an emergency; exits must stay clear of cabling, décor and vendor stock at all times.</p>
<div class="callout"><span class="badge">Never skip</span> A floor plan that "looks fine" on screen must still be checked against the venue's actual fire code capacity and exit widths — this is a legal requirement, not a design preference.</div>`,
    `<span class="eyebrow">EPO201 · Chương 3 · Bài 3.1</span>
<h2>Quản lý địa điểm &amp; bố trí</h2>
<h3>Site survey — khảo sát địa điểm</h3>
<p>Trước khi đặt địa điểm, một <strong>site survey</strong> kiểm tra xem nơi đó có thực sự đáp ứng được sự kiện: kích thước cửa/bến bốc dỡ (xe tải và thiết bị có vào được không?), nguồn điện sẵn có (ampe, số pha), các điểm rigging và tải trọng cho phép, độ cao trần, tầm nhìn (sightline), và các hạn chế về tiếng ồn/giờ giới nghiêm hiện có.</p>
<h3>Floor plan</h3>
<p><strong>Floor plan</strong> là bản vẽ theo tỉ lệ cho thấy sân khấu, khu ngồi/đứng, vị trí FOH (front of house — bàn mixer/điều khiển), gian hàng nhà cung cấp, quầy bar, nhà vệ sinh, và mọi <strong>lối thoát hiểm</strong>. Đây là tài liệu tham chiếu duy nhất mọi nhà cung cấp, đội an ninh và cảnh sát phòng cháy dựa vào.</p>
<pre><code>FLOOR PLAN — các yếu tố cần đánh dấu
[ Sân khấu ]  [ Vị trí FOH ]  [ Khu ngồi / đứng ]
[ Gian hàng ]  [ Quầy bar / catering ]  [ Nhà vệ sinh ]
[ LỐI THOÁT HIỂM x N ]  [ Lối cứu hộ ]  [ Lối cho người khuyết tật ]  [ Trạm y tế ]
</code></pre>
<h3>Sức chứa &amp; lối thoát</h3>
<p><strong>Sức chứa (capacity)</strong> là số người tối đa không gian và các lối thoát của nó có thể chịu an toàn — do quy định phòng cháy quyết định, không phải theo số vé muốn bán. <strong>Egress</strong> (khả năng thoát) là tốc độ mọi người có thể ra ngoài khi có sự cố; lối thoát hiểm phải luôn thông thoáng, không bị cáp, trang trí hay hàng hoá nhà cung cấp che chắn.</p>
<div class="callout"><span class="badge">Đừng bỏ qua</span> Một floor plan "nhìn ổn" trên màn hình vẫn phải được đối chiếu với sức chứa phòng cháy và độ rộng lối thoát thực tế của địa điểm — đây là yêu cầu pháp lý, không phải sở thích thiết kế.</div>`,
  ]]);

const c3q = quiz('epo201-quiz-3', 'Quiz 3 — Venue & floor plan|||Quiz 3 — Địa điểm & floor plan', [
  { id: 'q1', question: 'Site survey dùng để làm gì?', options: ['Thiết kế logo sự kiện', 'Khảo sát xem địa điểm có đáp ứng được yêu cầu kỹ thuật (điện, rigging, đường load-in...)', 'Chọn nhà tài trợ', 'In vé sự kiện'], correctIndex: 1, explanation: 'Site survey kiểm tra khả năng thực tế của địa điểm trước khi đặt.' },
  { id: 'q2', question: 'Sức chứa (capacity) của một địa điểm được quyết định bởi điều gì?', options: ['Số vé muốn bán', 'Quy định phòng cháy & khả năng của lối thoát hiểm', 'Ngân sách marketing', 'Ý kiến của MC'], correctIndex: 1, explanation: 'Capacity do fire code quy định, không phải theo mong muốn bán vé.' },
  { id: 'q3', question: 'Vì sao lối thoát hiểm phải luôn thông thoáng trong suốt sự kiện?', options: ['Để trang trí đẹp hơn', 'Để đảm bảo egress — mọi người thoát ra an toàn khi có sự cố', 'Để nhân viên đi tắt', 'Để tiết kiệm diện tích'], correctIndex: 1, explanation: 'Egress là yếu tố an toàn bắt buộc, không được để cáp/décor cản lối.' },
]);

const c4 = doc('epo201-4-1-staging-av-build', '4.1 — Staging, AV & technical build|||4.1 — Kỹ thuật sân khấu, AV & thi công',
  'Sân khấu & rigging; ba nhánh AV (âm thanh/ánh sáng/hình ảnh); trình tự load-in/load-out; labor call & strike.',
  [[
    `<span class="eyebrow">EPO201 · Chapter 4 · Lesson 4.1</span>
<h2>Staging, AV &amp; technical build</h2>
<h3>Staging &amp; rigging</h3>
<p><strong>Staging</strong> is the physical platform — deck sections, steps, skirting — sized to load rating and sightlines. <strong>Rigging</strong> is hanging equipment (lighting, speakers, banners) from an overhead structure using load-rated points; only certified riggers calculate and sign off on rigging loads.</p>
<h3>The three AV disciplines</h3>
<ul>
<li><strong>Audio</strong> — FOH (front of house) mix position for the audience sound, and a separate monitor mix for performers on stage.</li>
<li><strong>Lighting</strong> — front light (visibility), wash (mood/color), and spot/key light (focus on a subject).</li>
<li><strong>Video</strong> — LED walls or projection for content, IMAG (image magnification) so a distant audience can see the stage.</li>
</ul>
<h3>Load-in / load-out sequence</h3>
<pre><code>LOAD-IN                          LOAD-OUT (strike)
1. Dock scheduling (truck order) 1. Power down in reverse order
2. Staging & rigging first       2. Strike AV before staging
3. Power & cabling               3. Strike staging & rigging last
4. AV install                    4. Load trucks in reverse dock order
5. Décor & signage
6. Test & rehearse
</code></pre>
<p>Crews are booked with a <strong>labor call</strong> — a confirmed number of hands for a confirmed time window, matched to the schedule above so no step waits idle for people who are not there yet.</p>
<div class="callout"><span class="badge">Sequence matters</span> Strike always undoes the build in reverse — AV comes down before the staging it's attached to, never the other way round.</div>`,
    `<span class="eyebrow">EPO201 · Chương 4 · Bài 4.1</span>
<h2>Kỹ thuật sân khấu, AV &amp; thi công</h2>
<h3>Sân khấu &amp; rigging</h3>
<p><strong>Staging</strong> là bệ sân khấu vật lý — các module sàn, bậc thang, viền che — được chọn theo tải trọng và tầm nhìn. <strong>Rigging</strong> là treo thiết bị (đèn, loa, banner) lên kết cấu trên cao bằng các điểm chịu tải đã tính — chỉ kỹ thuật viên rigging được chứng nhận mới được tính toán và ký duyệt tải rigging.</p>
<h3>Ba nhánh AV</h3>
<ul>
<li><strong>Âm thanh (Audio)</strong> — vị trí FOH (front of house) mix âm cho khán giả, và một mix monitor riêng cho người biểu diễn trên sân khấu.</li>
<li><strong>Ánh sáng (Lighting)</strong> — đèn trước (nhìn rõ), wash (không khí/màu), và đèn spot/key (làm nổi chủ thể).</li>
<li><strong>Hình ảnh (Video)</strong> — màn LED hoặc máy chiếu để hiển thị nội dung, IMAG (image magnification) để khán giả xa vẫn thấy sân khấu.</li>
</ul>
<h3>Trình tự load-in / load-out</h3>
<pre><code>LOAD-IN                          LOAD-OUT (strike)
1. Lên lịch bến bốc dỡ (thứ tự xe) 1. Tắt nguồn theo thứ tự ngược
2. Sân khấu & rigging trước        2. Hạ AV trước khi hạ sân khấu
3. Điện & đi cáp                   3. Hạ sân khấu & rigging sau cùng
4. Lắp AV                          4. Bốc xe theo thứ tự ngược
5. Trang trí & bảng hiệu
6. Kiểm & tổng duyệt
</code></pre>
<p>Đội thi công được đặt qua <strong>labor call</strong> — số lượng nhân công xác nhận cho một khung giờ xác nhận, khớp với lịch trình trên để không bước nào phải chờ người chưa tới.</p>
<div class="callout"><span class="badge">Trình tự quan trọng</span> Strike luôn dỡ ngược lại đúng trình tự dựng — AV hạ trước sân khấu mà nó gắn vào, không bao giờ ngược lại.</div>`,
  ]]);

const c4q = quiz('epo201-quiz-4', 'Quiz 4 — Staging, AV & build|||Quiz 4 — Sân khấu, AV & thi công', [
  { id: 'q1', question: 'Rigging trong sản xuất sự kiện là gì?', options: ['Bán vé online', 'Treo thiết bị (đèn, loa, banner) lên kết cấu trên cao qua điểm chịu tải đã tính', 'Trang trí bàn tiệc', 'Quản lý mạng xã hội'], correctIndex: 1, explanation: 'Rigging là treo thiết bị an toàn, chỉ người chứng nhận mới ký duyệt tải.' },
  { id: 'q2', question: 'FOH (front of house) trong âm thanh là gì?', options: ['Vị trí mix âm cho khán giả', 'Nhà vệ sinh khu vực trước', 'Cửa vào chính của khách VIP', 'Kho chứa thiết bị'], correctIndex: 0, explanation: 'FOH là vị trí điều khiển/mix âm thanh phục vụ khán giả.' },
  { id: 'q3', question: 'Trình tự strike (load-out) đúng là gì?', options: ['Dựng sân khấu trước, hạ AV sau cùng', 'Hạ AV trước, hạ sân khấu & rigging sau cùng', 'Hạ ngẫu nhiên, không cần thứ tự', 'Chỉ cần bốc xe, không cần tắt nguồn'], correctIndex: 1, explanation: 'Strike đảo ngược đúng trình tự dựng: AV xuống trước, sân khấu/rigging sau cùng.' },
]);

const c5 = doc('epo201-5-1-vendor-staff-management', '5.1 — Vendor & event staff management|||5.1 — Quản lý nhà cung cấp & nhân sự sự kiện',
  'Nhóm nhà cung cấp; hợp đồng & SOW; day-of contact; kế hoạch nhân sự, phân kênh radio, briefing.',
  [[
    `<span class="eyebrow">EPO201 · Chapter 5 · Lesson 5.1</span>
<h2>Vendor &amp; event staff management</h2>
<h3>Vendor categories</h3>
<ul>
<li><strong>AV / staging</strong> — sound, light, video, structures.</li>
<li><strong>Catering</strong> — food &amp; beverage.</li>
<li><strong>Security</strong> — access control, crowd management.</li>
<li><strong>Décor &amp; signage</strong> — look and wayfinding.</li>
<li><strong>Transport &amp; logistics</strong> — trucking, shuttle, equipment rental.</li>
</ul>
<h3>Contracts &amp; the SOW</h3>
<p>Every vendor works from a <strong>Statement of Work (SOW)</strong> — scope, deliverables, load-in/out times, cancellation terms and payment schedule — plus a named <strong>day-of contact</strong> reachable by phone/radio for the whole event window.</p>
<h3>Staffing plan</h3>
<p>A staffing plan lists every role (registration, ushers, runners, floaters, crowd management), who fills it (paid crew vs. volunteers), shift times, and a <strong>radio channel assignment</strong> so production, ops, security and medical can each talk on their own channel without flooding one frequency.</p>
<pre><code>STAFFING PLAN (excerpt)
Role            Count  Shift        Radio channel
Registration     4     16:00-19:00  Ops-1
Ushers            6     17:00-21:00  Ops-2
Security          8     15:00-23:00  Sec-1
Stage crew        5     07:00-23:00  Prod-1
</code></pre>
<p>Every vendor and staff member attends a <strong>briefing</strong> before doors open: schedule walkthrough, radio protocol, emergency procedures, and who to call for what.</p>
<div class="callout"><span class="badge">One contact per vendor</span> Never manage a vendor through a group chat with five of their staff — one named day-of contact per vendor keeps accountability clear when something needs fixing fast.</div>`,
    `<span class="eyebrow">EPO201 · Chương 5 · Bài 5.1</span>
<h2>Quản lý nhà cung cấp &amp; nhân sự sự kiện</h2>
<h3>Các nhóm nhà cung cấp</h3>
<ul>
<li><strong>AV / sân khấu</strong> — âm thanh, ánh sáng, video, kết cấu.</li>
<li><strong>Catering</strong> — ăn uống.</li>
<li><strong>An ninh (Security)</strong> — kiểm soát ra vào, quản lý đám đông.</li>
<li><strong>Décor &amp; bảng hiệu</strong> — hình ảnh và chỉ dẫn lối đi.</li>
<li><strong>Vận chuyển &amp; hậu cần</strong> — xe tải, xe đưa đón, thuê thiết bị.</li>
</ul>
<h3>Hợp đồng &amp; SOW</h3>
<p>Mọi nhà cung cấp làm việc dựa trên một <strong>Statement of Work (SOW)</strong> — phạm vi, sản phẩm bàn giao, giờ load-in/out, điều khoản huỷ và lịch thanh toán — kèm một <strong>day-of contact</strong> được chỉ định, liên hệ được qua điện thoại/radio suốt khung giờ sự kiện.</p>
<h3>Kế hoạch nhân sự</h3>
<p>Kế hoạch nhân sự liệt kê mọi vai trò (lễ tân, hướng dẫn, runner, nhân sự linh động, quản lý đám đông), ai đảm nhận (nhân công thuê hay tình nguyện viên), giờ ca làm, và <strong>phân kênh radio</strong> để production, ops, an ninh và y tế mỗi bên nói trên kênh riêng, không dồn hết vào một tần số.</p>
<pre><code>KẾ HOẠCH NHÂN SỰ (trích)
Vai trò           Số lượng  Ca làm       Kênh radio
Lễ tân               4      16:00-19:00  Ops-1
Hướng dẫn (usher)     6      17:00-21:00  Ops-2
An ninh               8      15:00-23:00  Sec-1
Đội sân khấu          5      07:00-23:00  Prod-1
</code></pre>
<p>Mọi nhà cung cấp và nhân sự đều tham dự một <strong>briefing</strong> trước khi mở cửa: rà lại lịch trình, quy tắc dùng radio, quy trình khẩn cấp, và gọi ai khi cần việc gì.</p>
<div class="callout"><span class="badge">Một liên hệ cho mỗi nhà cung cấp</span> Đừng quản lý nhà cung cấp qua một nhóm chat với năm nhân viên của họ — một day-of contact được chỉ định rõ cho mỗi nhà cung cấp giúp trách nhiệm rõ ràng khi cần xử lý gấp.</div>`,
  ]]);

const c5q = quiz('epo201-quiz-5', 'Quiz 5 — Vendor & staff|||Quiz 5 — Nhà cung cấp & nhân sự', [
  { id: 'q1', question: 'SOW (Statement of Work) trong hợp đồng nhà cung cấp dùng để làm gì?', options: ['Ghi menu tiệc', 'Xác định phạm vi, sản phẩm bàn giao, giờ load-in/out, điều khoản huỷ & thanh toán', 'Thiết kế logo sự kiện', 'Chỉ ghi giá vé'], correctIndex: 1, explanation: 'SOW là tài liệu xác định rõ trách nhiệm & điều khoản với từng nhà cung cấp.' },
  { id: 'q2', question: 'Vì sao cần phân kênh radio riêng cho từng bộ phận (production, ops, an ninh, y tế)?', options: ['Để tiết kiệm pin radio', 'Để tránh dồn hết liên lạc vào một tần số, mỗi bên trao đổi rõ ràng', 'Vì quy định viễn thông bắt buộc', 'Để trang trí sự kiện đẹp hơn'], correctIndex: 1, explanation: 'Phân kênh giúp liên lạc không bị nhiễu/lấn giữa các bộ phận.' },
  { id: 'q3', question: 'Vì sao nên có MỘT day-of contact được chỉ định cho mỗi nhà cung cấp?', options: ['Để giảm chi phí hợp đồng', 'Để trách nhiệm rõ ràng, xử lý nhanh khi có vấn đề phát sinh', 'Vì luật yêu cầu', 'Để nhà cung cấp không cần đến hiện trường'], correctIndex: 1, explanation: 'Một liên hệ rõ ràng tránh nhầm lẫn khi cần phối hợp gấp trong sự kiện.' },
]);

const c6 = doc('epo201-6-1-day-of-event-operations', '6.1 — Day-of-event operations: show calling & run sheet|||6.1 — Vận hành ngày sự kiện: show calling & run sheet',
  'Run sheet (kịch bản theo phút); Stage Manager/show caller gọi cue; thuật ngữ standby/go; vùng đệm dự phòng.',
  [[
    `<span class="eyebrow">EPO201 · Chapter 6 · Lesson 6.1</span>
<h2>Day-of-event operations: show calling &amp; run sheet</h2>
<h3>The run sheet</h3>
<p>A <strong>run sheet</strong> is a minute-by-minute cue sheet for the live show — much more granular than the production schedule, which covers the whole build. It lists every cue, exact time, who triggers it, and the next action.</p>
<pre><code>RUN SHEET (excerpt)
Time     Cue                       Action                      Owner
19:00:00 Cue 1  House lights down   Lighting fades to black     LX op
19:00:15 Cue 2  Walk-in music out   Fade audio, mic MC live      Audio op
19:00:30 Cue 3  MC enters           Spot on MC, opening remarks  Stage Mgr
19:03:00 Cue 4  Video intro plays   Roll video on LED wall       Video op
19:05:00 Cue 5  Speaker 1 on stage  Podium mic live, lights up    Stage Mgr
</code></pre>
<h3>Show calling</h3>
<p>The <strong>show caller</strong> (usually the Stage Manager) runs the live show over a headset or radio, giving every department a two-step warning before every cue: <em>"Standby, cue 3... Cue 3, go."</em> This gives each operator time to be ready, and a single, unambiguous trigger moment.</p>
<h3>Contingency buffers</h3>
<p>Just like the production schedule, a run sheet needs small time buffers — a speaker running two minutes long should not push the closing act off its slot. Show callers track real elapsed time against the sheet and quietly trim slack elsewhere to stay on schedule.</p>
<div class="callout"><span class="badge">Standby, then go</span> Two-step calling ("standby" then "go") is what separates a professional show from one where cues get missed — never call a cue cold.</div>`,
    `<span class="eyebrow">EPO201 · Chương 6 · Bài 6.1</span>
<h2>Vận hành ngày sự kiện: show calling &amp; run sheet</h2>
<h3>Run sheet</h3>
<p><strong>Run sheet</strong> là kịch bản cue theo từng phút cho show trực tiếp — chi tiết hơn nhiều so với production schedule (vốn bao quát toàn bộ quá trình dựng). Nó liệt kê mọi cue, thời điểm chính xác, ai kích hoạt, và hành động tiếp theo.</p>
<pre><code>RUN SHEET (trích)
Giờ      Cue                        Hành động                    Người thực hiện
19:00:00 Cue 1  Tắt đèn khán phòng   Đèn mờ dần về tối             LX op
19:00:15 Cue 2  Ngừng nhạc chờ       Fade nhạc, mic MC live         Audio op
19:00:30 Cue 3  MC bước ra           Spot chiếu MC, phát biểu mở    Stage Mgr
19:03:00 Cue 4  Chạy video giới thiệu Chiếu video lên màn LED       Video op
19:05:00 Cue 5  Diễn giả 1 lên sân khấu Mic bục phát biểu, mở đèn   Stage Mgr
</code></pre>
<h3>Show calling</h3>
<p><strong>Show caller</strong> (thường là Stage Manager) điều hành show trực tiếp qua tai nghe hoặc radio, luôn báo trước cho mọi bộ phận hai bước trước mỗi cue: <em>"Standby, cue 3... Cue 3, go."</em> Điều này cho mỗi người vận hành thời gian chuẩn bị, và một thời điểm kích hoạt rõ ràng, không mập mờ.</p>
<h3>Vùng đệm dự phòng</h3>
<p>Giống production schedule, run sheet cũng cần những vùng đệm thời gian nhỏ — một diễn giả nói dài hơn hai phút không nên làm tiết mục đóng bị đẩy lùi khỏi khung giờ. Show caller theo dõi thời gian thực đã trôi so với run sheet và lặng lẽ cắt bớt phần dư ở nơi khác để giữ đúng lịch.</p>
<div class="callout"><span class="badge">Standby rồi mới go</span> Gọi cue hai bước ("standby" rồi "go") là điều phân biệt một show chuyên nghiệp với một show bị lỡ cue — không bao giờ gọi cue đột ngột không báo trước.</div>`,
  ]]);

const c6q = quiz('epo201-quiz-6', 'Quiz 6 — Show calling & run sheet|||Quiz 6 — Show calling & run sheet', [
  { id: 'q1', question: 'Run sheet khác production schedule ở điểm nào?', options: ['Run sheet chỉ dùng cho load-out', 'Run sheet chi tiết theo từng phút/cue của show, production schedule bao quát toàn bộ quá trình dựng', 'Run sheet không cần thời gian', 'Hai tài liệu này giống nhau hoàn toàn'], correctIndex: 1, explanation: 'Run sheet là kịch bản cue chi tiết cho show; production schedule là lịch trình tổng.' },
  { id: 'q2', question: 'Cách gọi cue chuyên nghiệp gồm mấy bước và là gì?', options: ['Một bước: gọi "go" ngay', 'Hai bước: "standby" báo trước rồi "go" kích hoạt', 'Ba bước: đếm ngược từ 10', 'Không cần gọi, cứ để tự động'], correctIndex: 1, explanation: 'Standby cho người vận hành chuẩn bị, go là thời điểm kích hoạt rõ ràng.' },
  { id: 'q3', question: 'Vì sao run sheet cần vùng đệm thời gian?', options: ['Để show dài hơn cho vui', 'Để hấp thụ chênh lệch nhỏ (vd diễn giả nói dài hơn dự kiến) mà không làm lệch cả lịch', 'Vì khán giả thích chờ', 'Không cần, run sheet luôn đúng 100%'], correctIndex: 1, explanation: 'Buffer giúp show caller điều chỉnh nhẹ để giữ đúng lịch tổng thể.' },
]);

const c7 = doc('epo201-7-1-safety-security-risk', '7.1 — Safety, security & operational risk management|||7.1 — An toàn, an ninh & quản lý rủi ro vận hành',
  'Ma trận đánh giá rủi ro; kế hoạch hành động khẩn cấp (EAP); trạm y tế/an ninh; quản lý đám đông; giấy phép & bảo hiểm.',
  [[
    `<span class="eyebrow">EPO201 · Chapter 7 · Lesson 7.1</span>
<h2>Safety, security &amp; operational risk management</h2>
<h3>Risk assessment</h3>
<p>A <strong>risk assessment matrix</strong> scores each identified risk by <strong>likelihood × impact</strong>, so the team can prioritize: a low-likelihood/low-impact risk (a vendor arriving 10 minutes late) needs a note; a high-likelihood/high-impact risk (severe weather at an outdoor event) needs a full contingency plan.</p>
<pre><code>RISK MATRIX (examples)
Risk                         Likelihood  Impact  Priority
Vendor late by 10 min            High      Low     Low
Power outage during show          Low      High    High
Crowd surge at entrance          Medium    High    High
Severe weather (outdoor)         Medium    High    High
</code></pre>
<h3>Emergency Action Plan (EAP)</h3>
<p>The <strong>EAP</strong> defines what happens if something goes wrong: evacuation routes and signal, medical response, severe-weather shelter plan, and a clear chain of command for who calls a stop or evacuation. Security and medical posts are marked on the floor plan with radio call signs.</p>
<h3>Crowd management</h3>
<p>Crowd management includes controlled entry points, barrier placement, capacity counting at the door, and trained staff watching for crowd density/behavior — not just security presence, but active monitoring.</p>
<h3>Permits &amp; insurance</h3>
<p>Most events legally require a venue/event <strong>permit</strong>, and <strong>event liability insurance</strong> covering the specific date, activities and expected attendance — arranged well before load-in, never as an afterthought.</p>
<div class="callout"><span class="badge">Plan for the day it goes wrong</span> The value of an EAP is measured on the one day you hope never to need it — rehearse it with staff before doors open, not after an incident starts.</div>`,
    `<span class="eyebrow">EPO201 · Chương 7 · Bài 7.1</span>
<h2>An toàn, an ninh &amp; quản lý rủi ro vận hành</h2>
<h3>Đánh giá rủi ro</h3>
<p>Một <strong>ma trận đánh giá rủi ro</strong> chấm điểm mỗi rủi ro đã xác định theo <strong>khả năng xảy ra × mức độ ảnh hưởng</strong>, để đội ngũ ưu tiên xử lý: rủi ro khả năng thấp/ảnh hưởng thấp (nhà cung cấp tới trễ 10 phút) chỉ cần ghi chú; rủi ro khả năng cao/ảnh hưởng cao (thời tiết xấu ở sự kiện ngoài trời) cần một kế hoạch dự phòng đầy đủ.</p>
<pre><code>MA TRẬN RỦI RO (ví dụ)
Rủi ro                          Khả năng   Ảnh hưởng  Ưu tiên
Nhà cung cấp trễ 10 phút            Cao       Thấp      Thấp
Mất điện trong lúc diễn ra          Thấp      Cao       Cao
Đám đông chen lấn ở cổng vào       Trung bình  Cao       Cao
Thời tiết xấu (ngoài trời)         Trung bình  Cao       Cao
</code></pre>
<h3>Kế hoạch hành động khẩn cấp (EAP)</h3>
<p><strong>EAP</strong> xác định điều gì xảy ra nếu có sự cố: lối thoát hiểm và tín hiệu báo động, quy trình y tế, kế hoạch trú ẩn khi thời tiết xấu, và một chuỗi chỉ huy rõ ràng cho việc ai có quyền ra lệnh dừng show hoặc di tản. Trạm an ninh và y tế được đánh dấu trên floor plan kèm mã gọi radio.</p>
<h3>Quản lý đám đông</h3>
<p>Quản lý đám đông gồm điểm vào có kiểm soát, bố trí rào chắn, đếm sức chứa tại cổng, và nhân sự được huấn luyện theo dõi mật độ/hành vi đám đông — không chỉ là sự hiện diện của an ninh, mà là giám sát chủ động.</p>
<h3>Giấy phép &amp; bảo hiểm</h3>
<p>Hầu hết sự kiện theo luật cần một <strong>giấy phép</strong> địa điểm/sự kiện, và <strong>bảo hiểm trách nhiệm sự kiện</strong> phủ đúng ngày, hoạt động và số khách dự kiến — được sắp xếp từ sớm, trước load-in rất lâu, không bao giờ để tới lúc gần diễn ra mới nghĩ tới.</p>
<div class="callout"><span class="badge">Chuẩn bị cho ngày nó xảy ra</span> Giá trị của một EAP được đo vào chính ngày bạn hy vọng không bao giờ cần đến nó — diễn tập với nhân sự trước khi mở cửa, không phải sau khi sự cố đã bắt đầu.</div>`,
  ]]);

const c7q = quiz('epo201-quiz-7', 'Quiz 7 — Safety, security & risk|||Quiz 7 — An toàn, an ninh & rủi ro', [
  { id: 'q1', question: 'Ma trận đánh giá rủi ro chấm điểm rủi ro theo hai yếu tố nào?', options: ['Giá tiền × thời gian', 'Khả năng xảy ra × mức độ ảnh hưởng', 'Số lượng nhân viên × số vé bán', 'Diện tích × sức chứa'], correctIndex: 1, explanation: 'Likelihood × Impact giúp xếp ưu tiên xử lý rủi ro.' },
  { id: 'q2', question: 'EAP (Emergency Action Plan) chủ yếu quy định điều gì?', options: ['Menu tiệc chiêu đãi', 'Lối thoát hiểm, quy trình y tế, và chuỗi chỉ huy khi có sự cố', 'Giá vé theo từng hạng', 'Lịch phát nhạc'], correctIndex: 1, explanation: 'EAP định nghĩa hành động cụ thể khi sự cố xảy ra, gồm chuỗi chỉ huy.' },
  { id: 'q3', question: 'Vì sao giấy phép & bảo hiểm sự kiện cần được sắp xếp từ sớm, trước load-in?', options: ['Vì giá rẻ hơn nếu mua sớm', 'Vì đây là yêu cầu pháp lý, không thể bổ sung vào giờ chót nếu thiếu', 'Vì nhà cung cấp yêu cầu vậy', 'Không quan trọng, có thể lo sau'], correctIndex: 1, explanation: 'Giấy phép và bảo hiểm là điều kiện pháp lý phải hoàn tất trước khi sự kiện diễn ra.' },
]);

const c8 = doc('epo201-8-1-bump-out-evaluation', '8.1 — Wrap-up (bump-out), evaluation & continuous improvement|||8.1 — Kết thúc (bump-out), đánh giá & cải tiến quy trình',
  'Trình tự bump-out; họp rút kinh nghiệm (debrief); chỉ số đánh giá (KPI); báo cáo after-action & sổ bài học cho sự kiện sau.',
  [[
    `<span class="eyebrow">EPO201 · Chapter 8 · Lesson 8.1</span>
<h2>Wrap-up (bump-out), evaluation &amp; continuous improvement</h2>
<h3>The bump-out (strike)</h3>
<p><strong>Bump-out</strong> is the full reverse of load-in: AV comes down, staging and rigging come down last, everything is checked against an inventory list before it leaves the venue, and the venue is returned in the condition contractually agreed (often photographed for proof).</p>
<pre><code>BUMP-OUT CHECKLIST (excerpt)
[ ] All AV equipment struck & inventoried against packing list
[ ] Rigging & staging struck last, load rating sign-off closed out
[ ] Lost & found items logged
[ ] Venue walkthrough with venue rep — damage noted, signed off
[ ] All rented items (chairs, décor) returned/collected
[ ] Final headcount / incident log closed out
</code></pre>
<h3>Post-event debrief</h3>
<p>Within days of the event, the core team holds a <strong>debrief</strong> — what went well, what didn't, and why — covering every phase from planning to bump-out, not just the show itself.</p>
<h3>Evaluation metrics (KPIs)</h3>
<ul>
<li><strong>Attendance</strong> vs. forecast.</li>
<li><strong>Budget vs. actual</strong> — where costs overran and why.</li>
<li><strong>Incident log</strong> — every safety/security/technical issue and how it was resolved.</li>
<li><strong>Vendor performance</strong> — on-time, on-spec, on-budget.</li>
</ul>
<h3>After-action report &amp; lessons learned</h3>
<p>The debrief feeds an <strong>after-action report</strong>: a written record of what happened and what to change. Its most important output is a <strong>lessons-learned register</strong> — specific, actionable notes that go directly into the next event's production schedule and risk assessment, so the same mistake is not repeated.</p>
<div class="callout"><span class="badge">The job isn't done at "doors close"</span> An event without a debrief and a lessons-learned register throws away its most valuable output: the ability to run the next one better.</div>`,
    `<span class="eyebrow">EPO201 · Chương 8 · Bài 8.1</span>
<h2>Kết thúc (bump-out), đánh giá &amp; cải tiến quy trình</h2>
<h3>Bump-out (strike)</h3>
<p><strong>Bump-out</strong> là quá trình dỡ ngược hoàn toàn so với load-in: AV hạ trước, sân khấu và rigging hạ sau cùng, mọi thứ được đối chiếu với danh sách kiểm kê trước khi rời địa điểm, và địa điểm được trả lại đúng tình trạng đã thoả thuận trong hợp đồng (thường có chụp ảnh làm chứng).</p>
<pre><code>CHECKLIST BUMP-OUT (trích)
[ ] Toàn bộ thiết bị AV đã hạ & đối chiếu với danh sách đóng gói
[ ] Rigging & sân khấu hạ sau cùng, đã ký duyệt hoàn tất tải trọng
[ ] Đồ thất lạc/tìm được đã ghi nhận
[ ] Đi cùng đại diện địa điểm rà soát — ghi nhận hư hỏng, có ký xác nhận
[ ] Mọi vật thuê (ghế, décor) đã trả/thu hồi
[ ] Số khách cuối cùng / sổ ghi sự cố đã khép lại
</code></pre>
<h3>Họp rút kinh nghiệm sau sự kiện (debrief)</h3>
<p>Trong vài ngày sau sự kiện, đội ngũ chính tổ chức một <strong>debrief</strong> — điều gì tốt, điều gì chưa tốt, và vì sao — bao quát mọi giai đoạn từ lập kế hoạch tới bump-out, không chỉ riêng buổi diễn.</p>
<h3>Chỉ số đánh giá (KPI)</h3>
<ul>
<li><strong>Lượng khách tham dự</strong> so với dự báo.</li>
<li><strong>Ngân sách thực tế so với kế hoạch</strong> — vượt chi ở đâu và vì sao.</li>
<li><strong>Sổ ghi sự cố</strong> — mọi vấn đề an toàn/an ninh/kỹ thuật và cách xử lý.</li>
<li><strong>Hiệu quả nhà cung cấp</strong> — đúng giờ, đúng yêu cầu, đúng ngân sách.</li>
</ul>
<h3>Báo cáo after-action &amp; sổ bài học</h3>
<p>Debrief nuôi dưỡng một <strong>báo cáo after-action</strong>: bản ghi những gì đã xảy ra và những gì cần thay đổi. Kết quả quan trọng nhất của nó là <strong>sổ bài học (lessons-learned register)</strong> — ghi chú cụ thể, hành động được, đưa thẳng vào production schedule và bảng đánh giá rủi ro của sự kiện kế tiếp, để không lặp lại sai lầm cũ.</p>
<div class="callout"><span class="badge">Công việc chưa xong khi "đóng cửa"</span> Một sự kiện không có debrief và sổ bài học sẽ bỏ mất sản phẩm giá trị nhất của nó: khả năng làm sự kiện tiếp theo tốt hơn.</div>`,
  ]]);

const c8q = quiz('epo201-quiz-8', 'Quiz 8 — Bump-out & evaluation|||Quiz 8 — Bump-out & đánh giá', [
  { id: 'q1', question: 'Trình tự bump-out (strike) đúng là gì?', options: ['Hạ sân khấu/rigging trước, AV hạ sau', 'Hạ AV trước, sân khấu & rigging hạ sau cùng', 'Hạ mọi thứ cùng lúc, không cần thứ tự', 'Chỉ cần dọn rác, không cần hạ thiết bị'], correctIndex: 1, explanation: 'Bump-out đảo ngược đúng trình tự load-in: AV xuống trước, sân khấu/rigging sau cùng.' },
  { id: 'q2', question: 'Sổ bài học (lessons-learned register) dùng để làm gì?', options: ['Lưu trữ hình ảnh sự kiện để marketing', 'Ghi chú cụ thể, hành động được, đưa vào kế hoạch sự kiện kế tiếp để không lặp sai lầm', 'Tính lương nhân sự', 'Chỉ để lưu trữ, không dùng lại'], correctIndex: 1, explanation: 'Lessons-learned register là đầu ra quan trọng nhất của debrief, nuôi kế hoạch sự kiện sau.' },
  { id: 'q3', question: 'KPI nào KHÔNG thuộc nhóm chỉ số đánh giá sau sự kiện điển hình?', options: ['Lượng khách tham dự so với dự báo', 'Ngân sách thực tế so với kế hoạch', 'Sổ ghi sự cố', 'Màu áo đồng phục nhân viên'], correctIndex: 3, explanation: 'Màu áo đồng phục không phải chỉ số đánh giá hiệu quả vận hành/sản xuất sự kiện.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'EPO201',
    slug: 'epo201-event-production-and-operations-management',
    title: 'Event Production and Operations Management',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/EPO201.webp',
    shortDescription: 'How live events get built and run: production planning, venue layout, staging/AV build, vendor & staff management, show calling & run sheets, risk management, and bump-out.|||Cách sự kiện được dựng và vận hành: lập kế hoạch sản xuất, bố trí địa điểm, dựng sân khấu/AV, quản lý nhà cung cấp & nhân sự, show calling & run sheet, quản trị rủi ro, và bump-out.',
    description: 'Môn <strong>EPO201 — Event Production and Operations Management</strong> (kỳ 5) dạy cách một sự kiện thật được <strong>dựng</strong> và <strong>vận hành</strong>. Từ <strong>tổng quan production vs. operations</strong> → <strong>lập kế hoạch & production schedule</strong> → <strong>quản lý địa điểm & floor plan</strong> → <strong>sân khấu, AV & thi công</strong> (load-in/out) → <strong>quản lý nhà cung cấp & nhân sự</strong> → <strong>vận hành ngày sự kiện</strong> (show calling, run sheet) → <strong>an toàn, an ninh & quản lý rủi ro</strong> → <strong>kết thúc (bump-out), đánh giá & cải tiến</strong>. Bám giáo trình tham khảo (Bowdin, Goldblatt), song ngữ, có ví dụ, checklist/run sheet mẫu và quiz mỗi chương.',
    whatYouLearn: 'Phân biệt production & operations, các vai trò (Producer, Production Manager, Operations Manager, Stage Manager); pre-production meeting & production schedule, critical path; site survey & floor plan, sức chứa & egress; staging/rigging, ba nhánh AV (âm thanh/ánh sáng/hình ảnh), trình tự load-in/load-out; quản lý nhà cung cấp (SOW, day-of contact) & kế hoạch nhân sự (phân kênh radio); run sheet & show calling (standby/go); ma trận đánh giá rủi ro, Emergency Action Plan, quản lý đám đông, giấy phép & bảo hiểm; trình tự bump-out, debrief, KPI đánh giá, after-action report & lessons-learned register.',
    requirements: 'Không yêu cầu kiến thức chuyên ngành trước đó; nên đã học các môn nền tảng quản trị kinh doanh/marketing sự kiện của khối BBA.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Production vs. operations, các vai trò, lộ trình môn.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan sản xuất & vận hành|||Chapter 1 — Production & operations overview', description: 'Định nghĩa, vòng đời sự kiện, tổ chức tạm thời.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Lập kế hoạch sản xuất & production schedule|||Chapter 2 — Production planning & schedule', description: 'Pre-production meeting, production schedule, critical path.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Quản lý địa điểm & bố trí|||Chapter 3 — Venue management & layout', description: 'Site survey, floor plan, sức chứa & egress.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Kỹ thuật sân khấu, AV & thi công|||Chapter 4 — Staging, AV & technical build', description: 'Staging, rigging, AV, load-in/load-out.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Quản lý nhà cung cấp & nhân sự|||Chapter 5 — Vendor & staff management', description: 'SOW, day-of contact, kế hoạch nhân sự.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Vận hành ngày sự kiện|||Chapter 6 — Day-of-event operations', description: 'Run sheet, show calling, standby/go.', lessons: [c6, c6q] },
    { title: 'Chương 7 — An toàn, an ninh & quản lý rủi ro|||Chapter 7 — Safety, security & risk management', description: 'Ma trận rủi ro, EAP, quản lý đám đông, giấy phép.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Kết thúc, đánh giá & cải tiến|||Chapter 8 — Wrap-up, evaluation & improvement', description: 'Bump-out, debrief, KPI, after-action report.', lessons: [c8, c8q] },
  ],
};
