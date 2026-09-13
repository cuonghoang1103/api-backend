/**
 * OCT202 — On-the-Job Training (OJT / Thực tập nghề nghiệp). Khối Công nghệ
 * Truyền thông FPTU, Kỳ 6. ĐÂY LÀ MÔN THỰC TẬP DOANH NGHIỆP — không phải môn
 * kiến thức lý thuyết. Khung là HƯỚNG DẪN THỰC TẬP: kỹ năng nghề, hội nhập
 * môi trường làm việc, ghi minh chứng, viết báo cáo, phản tư, bảo vệ.
 * Lộ trình 4 bước: Chuẩn bị → Hội nhập → Thực hiện → Báo cáo.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n; &→&amp; trong HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức mục.', quiz: { timeLimitSeconds: 480, questions } });

/* ── Tài liệu tham khảo ───────────────────────────────────────────────────── */
const taiLieu = doc('oct202-0-0-tai-lieu', '📚 OJT materials & templates|||📚 Tài liệu & biểu mẫu thực tập',
  'Quy chế OJT FPTU, sổ tay thực tập, mẫu CV/portfolio, chuẩn đầu ra kỹ năng nghề, mẫu nhật ký & báo cáo, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">OCT202 · Materials</span>
<h2>OJT materials &amp; resource hub</h2>
<p class="lead">Everything you need for your <strong>On-the-Job Training (OJT)</strong> — the official rules, the templates, and the checklists — in one place. The binding documents (regulation, evaluation rubric, report form) always live on <strong>FLM/FAP</strong>; treat the files below as a working companion, not a replacement.</p>
<h3>📘 Official documents</h3>
<ul>
<li><a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM — OJT regulation, syllabus &amp; learning outcomes</a> (sign in with your FPTU account)</li>
<li><a href="https://fap.fpt.edu.vn" target="_blank" rel="noopener">FAP — OJT registration, supervisor assignment &amp; grades</a></li>
</ul>
<h3>🧾 Templates you will reuse</h3>
<ul>
<li><strong>CV &amp; portfolio</strong> — one page, results-first (Module 2)</li>
<li><strong>Internship logbook / weekly log</strong> — what you did, what you learned (Module 6)</li>
<li><strong>OJT report</strong> — company → tasks → reflection → evidence (Module 7)</li>
<li><strong>Supervisor evaluation form</strong> — filled by the company mentor</li>
</ul>
<h3>🌐 Free, practical references</h3>
<ul>
<li><a href="https://www.canva.com/resumes/templates/" target="_blank" rel="noopener">Canva — CV &amp; portfolio templates</a></li>
<li><a href="https://www.hubspot.com/resources" target="_blank" rel="noopener">HubSpot resources — marketing &amp; content basics</a></li>
<li><a href="https://blog.hootsuite.com/" target="_blank" rel="noopener">Hootsuite blog — social media &amp; campaign practice</a></li>
</ul>
<div class="callout"><span class="badge">The 4-step path</span>
<ol>
<li><strong>Prepare</strong> — CV, portfolio, apply, interview (Modules 1–2).</li>
<li><strong>Integrate</strong> — company culture, conduct, office communication (Modules 3–4).</li>
<li><strong>Do the work</strong> — apply your communication skills on real tasks (Module 5).</li>
<li><strong>Report</strong> — evidence, logbook, written report, defense (Modules 6–8).</li>
</ol></div>`,
    `<span class="eyebrow">OCT202 · Tài liệu</span>
<h2>Trung tâm tài liệu &amp; biểu mẫu OJT</h2>
<p class="lead">Mọi thứ cho kỳ <strong>Thực tập nghề nghiệp (OJT)</strong> — quy chế, biểu mẫu, checklist — gom về một chỗ. Các văn bản có giá trị ràng buộc (quy chế, tiêu chí chấm, mẫu báo cáo) luôn nằm trên <strong>FLM/FAP</strong>; các tài liệu bên dưới là bạn đồng hành, không thay thế văn bản gốc.</p>
<h3>📘 Văn bản chính thức</h3>
<ul>
<li><a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM — quy chế OJT, đề cương &amp; chuẩn đầu ra</a> (đăng nhập tài khoản FPTU)</li>
<li><a href="https://fap.fpt.edu.vn" target="_blank" rel="noopener">FAP — đăng ký OJT, phân giảng viên hướng dẫn &amp; điểm</a></li>
</ul>
<h3>🧾 Biểu mẫu bạn sẽ dùng lại</h3>
<ul>
<li><strong>CV &amp; portfolio</strong> — một trang, nêu kết quả trước (Mục 2)</li>
<li><strong>Nhật ký / log tuần</strong> — làm gì, học được gì (Mục 6)</li>
<li><strong>Báo cáo OJT</strong> — công ty → công việc → phản tư → minh chứng (Mục 7)</li>
<li><strong>Phiếu đánh giá của người hướng dẫn</strong> — do mentor công ty điền</li>
</ul>
<h3>🌐 Nguồn tham khảo miễn phí, thực dụng</h3>
<ul>
<li><a href="https://www.canva.com/resumes/templates/" target="_blank" rel="noopener">Canva — mẫu CV &amp; portfolio</a></li>
<li><a href="https://www.hubspot.com/resources" target="_blank" rel="noopener">HubSpot resources — nền tảng marketing &amp; nội dung</a></li>
<li><a href="https://blog.hootsuite.com/" target="_blank" rel="noopener">Hootsuite blog — thực hành mạng xã hội &amp; chiến dịch</a></li>
</ul>
<div class="callout"><span class="badge">Lộ trình 4 bước</span>
<ol>
<li><strong>Chuẩn bị</strong> — CV, portfolio, ứng tuyển, phỏng vấn (Mục 1–2).</li>
<li><strong>Hội nhập</strong> — văn hoá công ty, tác phong, giao tiếp công sở (Mục 3–4).</li>
<li><strong>Thực hiện</strong> — áp dụng kỹ năng truyền thông vào việc thật (Mục 5).</li>
<li><strong>Báo cáo</strong> — minh chứng, nhật ký, báo cáo, bảo vệ (Mục 6–8).</li>
</ol></div>`,
  ]]);

/* ── Giới thiệu môn ───────────────────────────────────────────────────────── */
const intro = doc('oct202-0-1-overview', 'Course overview: what OJT is and how it is graded|||Giới thiệu môn: OJT là gì và được chấm thế nào',
  'OJT là gì, mục tiêu, số tín chỉ, thời lượng thực tập, quy trình đăng ký & đánh giá (điểm doanh nghiệp + báo cáo + bảo vệ).',
  [[
    `<span class="eyebrow">OCT202 · Overview</span>
<h2>On-the-Job Training (OJT)</h2>
<p class="lead">OJT is the semester where you <strong>work inside a real company</strong> instead of a classroom. For a Communication Technology student that usually means a role in <strong>content, social media, events, PR or marketing</strong>. The goal is to turn what you learned into results a business will pay for — and to prove you can hold a professional job.</p>
<h3>Why it matters</h3>
<ul>
<li><strong>It is a graded, credit-bearing course</strong> — not an optional add-on.</li>
<li><strong>It is your bridge to a first job</strong> — many interns get hired where they train.</li>
<li><strong>It fills your portfolio</strong> with real work, real numbers, real references.</li>
</ul>
<h3>How you are assessed</h3>
<pre><code>Final grade = Company supervisor score   (attitude, skill, results)
            + OJT report                 (structure, depth, reflection)
            + Defense / presentation      (Q&amp;A with the FPTU examiner)
</code></pre>
<p>Exact weights and the full-time duration are on FLM/FAP — read them before you register. The pattern below drives the whole course:</p>
<div class="callout"><span class="badge">Prepare → Integrate → Do → Report</span> Every module maps to one of these four steps. Do them in order and the report writes itself.</div>`,
    `<span class="eyebrow">OCT202 · Giới thiệu</span>
<h2>Thực tập nghề nghiệp (OJT)</h2>
<p class="lead">OJT là kỳ bạn <strong>đi làm thật trong doanh nghiệp</strong> thay vì ngồi lớp. Với sinh viên Công nghệ Truyền thông, đó thường là vị trí <strong>nội dung, mạng xã hội, sự kiện, PR hay marketing</strong>. Mục tiêu là biến thứ đã học thành kết quả doanh nghiệp trả tiền — và chứng minh bạn giữ được một công việc chuyên nghiệp.</p>
<h3>Vì sao quan trọng</h3>
<ul>
<li><strong>Là môn có điểm, có tín chỉ</strong> — không phải phần thêm tuỳ chọn.</li>
<li><strong>Là cầu tới công việc đầu tiên</strong> — nhiều bạn được nhận ngay nơi thực tập.</li>
<li><strong>Làm đầy portfolio</strong> bằng việc thật, số liệu thật, người giới thiệu thật.</li>
</ul>
<h3>Bạn được chấm thế nào</h3>
<pre><code>Điểm cuối = Điểm người hướng dẫn công ty (thái độ, kỹ năng, kết quả)
          + Báo cáo OJT                  (cấu trúc, chiều sâu, phản tư)
          + Bảo vệ / thuyết trình        (hỏi đáp với giám khảo FPTU)
</code></pre>
<p>Trọng số cụ thể và thời lượng làm toàn thời gian nằm trên FLM/FAP — đọc trước khi đăng ký. Mẫu bên dưới xuyên suốt cả môn:</p>
<div class="callout"><span class="badge">Chuẩn bị → Hội nhập → Thực hiện → Báo cáo</span> Mỗi mục ứng với một trong bốn bước này. Làm đúng thứ tự thì báo cáo gần như tự viết ra.</div>`,
  ]]);

/* ── M1 — OJT là gì & mục tiêu ─────────────────────────────────────────────── */
const m1 = doc('oct202-1-1-vai-tro-muc-tieu', 'M1 — What OJT is: role, outcomes, rights &amp; duties|||M1 — OJT là gì: vai trò, chuẩn đầu ra, quyền &amp; nghĩa vụ',
  'Vai trò của thực tập sinh, chuẩn đầu ra kỹ năng nghề, quyền lợi và nghĩa vụ của sinh viên khi thực tập.',
  [[
    `<span class="eyebrow">OCT202 · Module 1 · Prepare</span>
<h2>Your role, and what OJT must produce</h2>
<p class="lead">An intern is a <strong>junior team member with a learning mandate</strong> — you contribute real work and, in return, you get mentoring, feedback and evidence for your career.</p>
<h3>Learning outcomes (skills the course certifies)</h3>
<ul>
<li>Behave professionally in a workplace — punctual, reliable, coachable.</li>
<li>Apply communication/marketing knowledge to real deliverables.</li>
<li>Work in a team, take feedback, and manage your own tasks.</li>
<li>Document your work and reflect on what you learned.</li>
</ul>
<h3>Your rights &amp; your duties</h3>
<pre><code>RIGHTS                          DUTIES
- a named company mentor        - follow company rules &amp; hours
- meaningful tasks              - protect confidential info (NDA)
- feedback &amp; a fair evaluation  - keep your logbook up to date
- a safe workplace              - communicate blockers early
</code></pre>
<div class="callout"><span class="badge">Checklist — week 0</span> Confirm start date · get your mentor's name &amp; contact · know your working hours · know what "done" looks like for your first task.</div>`,
    `<span class="eyebrow">OCT202 · Mục 1 · Chuẩn bị</span>
<h2>Vai trò của bạn, và OJT phải tạo ra gì</h2>
<p class="lead">Thực tập sinh là <strong>thành viên nhóm cấp nhập môn có nhiệm vụ học</strong> — bạn đóng góp việc thật, đổi lại được kèm cặp, phản hồi và minh chứng cho sự nghiệp.</p>
<h3>Chuẩn đầu ra (kỹ năng môn xác nhận)</h3>
<ul>
<li>Hành xử chuyên nghiệp nơi làm việc — đúng giờ, đáng tin, chịu học.</li>
<li>Áp dụng kiến thức truyền thông/marketing vào sản phẩm thật.</li>
<li>Làm việc nhóm, tiếp nhận phản hồi, tự quản lý công việc.</li>
<li>Ghi lại việc mình làm và phản tư về điều học được.</li>
</ul>
<h3>Quyền lợi &amp; nghĩa vụ</h3>
<pre><code>QUYỀN LỢI                        NGHĨA VỤ
- có mentor được chỉ định        - theo nội quy &amp; giờ giấc công ty
- công việc có ý nghĩa           - giữ bí mật thông tin (NDA)
- phản hồi &amp; đánh giá công bằng   - cập nhật nhật ký thực tập
- môi trường an toàn             - báo sớm khi vướng mắc
</code></pre>
<div class="callout"><span class="badge">Checklist — tuần 0</span> Xác nhận ngày bắt đầu · biết tên &amp; liên hệ mentor · nắm giờ làm việc · hiểu "hoàn thành" của việc đầu tiên là gì.</div>`,
  ]]);
const m1q = quiz('oct202-quiz-1', 'Quiz M1 — Role &amp; outcomes|||Quiz M1 — Vai trò &amp; chuẩn đầu ra', [
  { id: 'q1', question: 'OJT (On-the-Job Training) chủ yếu là gì?|||What is OJT primarily?', options: ['Một môn lý thuyết trên lớp|||A theory class', 'Kỳ đi làm thật tại doanh nghiệp, có điểm & tín chỉ|||A graded, credit-bearing term working in a real company', 'Kỳ nghỉ giữa khoá|||A mid-course break', 'Một bài thi cuối kỳ|||A final exam'], correctIndex: 1, explanation: 'OJT là kỳ thực tập doanh nghiệp có điểm và tín chỉ.' },
  { id: 'q2', question: 'Đâu là NGHĨA VỤ của thực tập sinh?|||Which is a DUTY of an intern?', options: ['Được trả lương cao|||Getting a high salary', 'Giữ bí mật thông tin công ty & cập nhật nhật ký|||Protecting confidential info & keeping the logbook', 'Được tự chọn mọi việc|||Choosing any task freely', 'Nghỉ khi nào muốn|||Taking days off at will'], correctIndex: 1, explanation: 'Bảo mật và ghi nhật ký là nghĩa vụ; mentor và phản hồi là quyền lợi.' },
  { id: 'q3', question: 'Chuẩn đầu ra chính của OJT là?|||A core OJT learning outcome is?', options: ['Học thuộc lý thuyết marketing|||Memorizing marketing theory', 'Áp dụng kiến thức vào sản phẩm thật & hành xử chuyên nghiệp|||Applying knowledge to real deliverables & acting professionally', 'Viết một bài luận|||Writing one essay', 'Đạt điểm thi trắc nghiệm|||Passing a quiz'], correctIndex: 1, explanation: 'OJT xác nhận năng lực làm việc thật, không phải thuộc lòng.' },
]);

/* ── M2 — Chuẩn bị trước thực tập ──────────────────────────────────────────── */
const m2 = doc('oct202-2-1-chuan-bi-ung-tuyen', 'M2 — Prepare: CV, portfolio, apply, interview|||M2 — Chuẩn bị: CV, portfolio, ứng tuyển, phỏng vấn',
  'Viết CV một trang, dựng portfolio, tìm & ứng tuyển vị trí, chuẩn bị phỏng vấn, kỹ năng nghề cần có trước khi vào công ty.',
  [[
    `<span class="eyebrow">OCT202 · Module 2 · Prepare</span>
<h2>Get hired: CV, portfolio, application, interview</h2>
<h3>The one-page CV (results first)</h3>
<ul>
<li><strong>Header</strong> — name, role you want, phone, email, portfolio link.</li>
<li><strong>Projects &amp; results</strong> — lead with numbers: "grew a page's reach by 30%", not "helped with Facebook".</li>
<li><strong>Skills &amp; tools</strong> — Canva, Premiere, Meta Business Suite, Google Analytics, writing.</li>
<li>Keep it to <strong>one page</strong>, export as PDF, name the file <code>Name_CV.pdf</code>.</li>
</ul>
<h3>Portfolio</h3>
<p>3–6 of your best pieces: posts, a short video, an event recap, a mini campaign. For each, add one line: <em>goal → what you did → result</em>. A Canva/Drive/Behance link is enough.</p>
<h3>Apply &amp; interview</h3>
<pre><code>Find:    company career pages, LinkedIn, FPTU relations office, referrals
Tailor:  match your CV bullets to the job's keywords
Prep:    STAR answers (Situation-Task-Action-Result) + 2 questions to ask
Follow:  send a short thank-you note after the interview
</code></pre>
<div class="callout"><span class="badge">Tip</span> Apply to 8–10 places, not one. Track them in a sheet: company · role · date applied · status.</div>`,
    `<span class="eyebrow">OCT202 · Mục 2 · Chuẩn bị</span>
<h2>Được nhận: CV, portfolio, ứng tuyển, phỏng vấn</h2>
<h3>CV một trang (nêu kết quả trước)</h3>
<ul>
<li><strong>Đầu trang</strong> — tên, vị trí muốn ứng tuyển, điện thoại, email, link portfolio.</li>
<li><strong>Dự án &amp; kết quả</strong> — mở đầu bằng số: "tăng reach một trang 30%", đừng viết "phụ giúp Facebook".</li>
<li><strong>Kỹ năng &amp; công cụ</strong> — Canva, Premiere, Meta Business Suite, Google Analytics, viết lách.</li>
<li>Gói trong <strong>một trang</strong>, xuất PDF, đặt tên file <code>Ten_CV.pdf</code>.</li>
</ul>
<h3>Portfolio</h3>
<p>3–6 sản phẩm tốt nhất: bài đăng, một video ngắn, một recap sự kiện, một chiến dịch nhỏ. Mỗi cái thêm một dòng: <em>mục tiêu → bạn làm gì → kết quả</em>. Một link Canva/Drive/Behance là đủ.</p>
<h3>Ứng tuyển &amp; phỏng vấn</h3>
<pre><code>Tìm:     trang tuyển dụng công ty, LinkedIn, phòng quan hệ DN của FPTU, giới thiệu
Chỉnh:   khớp gạch đầu dòng CV với từ khoá trong tin tuyển
Chuẩn bị: trả lời theo STAR (Tình huống-Nhiệm vụ-Hành động-Kết quả) + 2 câu hỏi lại
Theo dõi: gửi lời cảm ơn ngắn sau phỏng vấn
</code></pre>
<div class="callout"><span class="badge">Mẹo</span> Nộp 8–10 nơi, đừng chỉ một. Ghi vào bảng: công ty · vị trí · ngày nộp · trạng thái.</div>`,
  ]]);
const m2q = quiz('oct202-quiz-2', 'Quiz M2 — CV &amp; interview|||Quiz M2 — CV &amp; phỏng vấn', [
  { id: 'q1', question: 'Một CV thực tập tốt nên?|||A good intern CV should?', options: ['Dài 3–4 trang liệt kê mọi thứ|||Be 3–4 pages listing everything', 'Một trang, nêu kết quả bằng số trước|||Be one page, lead with results in numbers', 'Không cần link portfolio|||Skip the portfolio link', 'Chỉ ghi sở thích cá nhân|||List only hobbies'], correctIndex: 1, explanation: 'CV một trang, ưu tiên kết quả đo được.' },
  { id: 'q2', question: 'STAR trong trả lời phỏng vấn là?|||STAR in interview answers means?', options: ['Situation-Task-Action-Result', 'Start-Talk-Ask-Rest', 'Skill-Time-Ability-Role', 'Study-Test-Apply-Report'], correctIndex: 0, explanation: 'STAR = Tình huống - Nhiệm vụ - Hành động - Kết quả.' },
  { id: 'q3', question: 'Chiến lược ứng tuyển hợp lý là?|||A sensible application strategy is?', options: ['Chỉ nộp đúng 1 công ty mơ ước|||Apply to only 1 dream company', 'Nộp 8–10 nơi & theo dõi trạng thái trong bảng|||Apply to 8–10 places & track status in a sheet', 'Gửi cùng một CV không chỉnh cho mọi nơi|||Send one untailored CV everywhere', 'Đợi công ty tự tìm đến|||Wait to be found'], correctIndex: 1, explanation: 'Nộp nhiều, chỉnh CV theo tin, và theo dõi trạng thái.' },
]);

/* ── M3 — Hội nhập môi trường doanh nghiệp ─────────────────────────────────── */
const m3 = doc('oct202-3-1-hoi-nhap-van-hoa', 'M3 — Integrate: culture, conduct, office communication, ethics|||M3 — Hội nhập: văn hoá, tác phong, giao tiếp công sở, đạo đức nghề',
  'Đọc văn hoá công ty, tác phong chuyên nghiệp, giao tiếp công sở (email, họp, chat), đạo đức nghề nghiệp & bảo mật.',
  [[
    `<span class="eyebrow">OCT202 · Module 3 · Integrate</span>
<h2>Fit in fast, and behave like a professional</h2>
<h3>Read the culture</h3>
<p>In your first days, watch: dress code, how people greet, working hours, which channel is used for what (email vs chat), how decisions get made. Match it. When unsure, ask — asking is professional, guessing is not.</p>
<h3>Professional conduct</h3>
<ul>
<li><strong>Punctual &amp; present</strong> — arrive on time, tell your mentor if you'll be late or out.</li>
<li><strong>Reliable</strong> — do what you said, by when you said; flag risks early.</li>
<li><strong>Coachable</strong> — take notes, don't repeat the same mistake.</li>
</ul>
<h3>Office communication</h3>
<pre><code>Email:  clear subject, greeting, one ask, sign-off. Reply within a day.
Chat:   short, on-topic; don't ping "hi" then wait — ask the whole question.
Meeting: come prepared, listen, note action items &amp; owners.
</code></pre>
<h3>Ethics &amp; confidentiality</h3>
<p>Never share internal data, client lists or unreleased campaigns. Don't post about work online without permission. Give credit; don't plagiarize. When something feels wrong, raise it with your mentor.</p>
<div class="callout"><span class="badge">Golden rule</span> You are a guest representing FPTU. Politeness, honesty and discretion are graded even when no one says so.</div>`,
    `<span class="eyebrow">OCT202 · Mục 3 · Hội nhập</span>
<h2>Hoà nhập nhanh, và hành xử chuyên nghiệp</h2>
<h3>Đọc văn hoá công ty</h3>
<p>Những ngày đầu, quan sát: quy định trang phục, cách chào hỏi, giờ giấc, kênh nào dùng cho việc gì (email hay chat), cách ra quyết định. Bắt nhịp theo. Không rõ thì hỏi — hỏi là chuyên nghiệp, đoán mò thì không.</p>
<h3>Tác phong chuyên nghiệp</h3>
<ul>
<li><strong>Đúng giờ &amp; có mặt</strong> — đến đúng giờ, báo mentor khi trễ hoặc vắng.</li>
<li><strong>Đáng tin</strong> — làm đúng điều đã hứa, đúng hạn; báo rủi ro sớm.</li>
<li><strong>Chịu học</strong> — ghi chú, không lặp lại cùng một lỗi.</li>
</ul>
<h3>Giao tiếp công sở</h3>
<pre><code>Email:  tiêu đề rõ, lời chào, một yêu cầu, chữ ký. Trả lời trong ngày.
Chat:   ngắn, đúng việc; đừng "hi" rồi chờ — hỏi trọn câu hỏi.
Họp:    chuẩn bị trước, lắng nghe, ghi việc cần làm &amp; người phụ trách.
</code></pre>
<h3>Đạo đức nghề &amp; bảo mật</h3>
<p>Không chia sẻ dữ liệu nội bộ, danh sách khách hàng hay chiến dịch chưa công bố. Không đăng chuyện công ty lên mạng khi chưa được phép. Ghi nguồn; không đạo nhái. Thấy điều bất ổn thì nói với mentor.</p>
<div class="callout"><span class="badge">Nguyên tắc vàng</span> Bạn là khách đại diện cho FPTU. Lịch sự, trung thực và kín đáo đều được chấm dù không ai nói ra.</div>`,
  ]]);
const m3q = quiz('oct202-quiz-3', 'Quiz M3 — Culture &amp; conduct|||Quiz M3 — Văn hoá &amp; tác phong', [
  { id: 'q1', question: 'Khi không rõ quy tắc ở công ty, bạn nên?|||When unsure about a company norm, you should?', options: ['Đoán rồi làm theo ý mình|||Guess and do your own thing', 'Quan sát & hỏi mentor|||Observe & ask your mentor', 'Bỏ qua, không ai để ý|||Ignore it, nobody notices', 'Đăng hỏi lên mạng xã hội|||Post the question on social media'], correctIndex: 1, explanation: 'Hỏi là chuyên nghiệp; quan sát rồi hỏi mentor.' },
  { id: 'q2', question: 'Một email công sở tốt nên có?|||A good work email has?', options: ['Không tiêu đề, viết dài lan man|||No subject, long ramble', 'Tiêu đề rõ, một yêu cầu, chữ ký & trả lời trong ngày|||Clear subject, one ask, sign-off & same-day reply', 'Toàn từ viết tắt teen|||All slang', 'Gửi cho toàn công ty|||CC the whole company'], correctIndex: 1, explanation: 'Rõ ràng, đúng một yêu cầu, lịch sự và kịp thời.' },
  { id: 'q3', question: 'Về bảo mật, thực tập sinh KHÔNG được?|||On confidentiality, an intern must NOT?', options: ['Ghi nhật ký công việc của mình|||Keep a personal logbook', 'Đăng chiến dịch chưa công bố hay dữ liệu khách hàng lên mạng|||Post unreleased campaigns or client data online', 'Hỏi mentor khi chưa rõ|||Ask the mentor when unsure', 'Ghi nguồn khi trích dẫn|||Credit sources'], correctIndex: 1, explanation: 'Không lộ dữ liệu nội bộ/khách hàng/chiến dịch chưa công bố.' },
]);

/* ── M4 — Kỹ năng làm việc thực tế ─────────────────────────────────────────── */
const m4 = doc('oct202-4-1-ky-nang-lam-viec', 'M4 — Real work skills: teamwork, time, feedback, tools|||M4 — Kỹ năng làm việc thật: nhóm, thời gian, phản hồi, công cụ',
  'Làm việc nhóm, quản lý thời gian & công việc (to-do, deadline), nhận và xử lý phản hồi, công cụ cộng tác thường dùng.',
  [[
    `<span class="eyebrow">OCT202 · Module 4 · Do</span>
<h2>The skills that make an intern useful</h2>
<h3>Teamwork</h3>
<p>Know who does what, ask before you overlap, share updates so no one is surprised. Volunteer for small tasks — reliability on small things earns bigger ones.</p>
<h3>Managing your time &amp; tasks</h3>
<pre><code>Daily:  a short to-do list, top 3 first
Track:  status of each task (todo / doing / blocked / done)
Deadline: if you'll miss it, say so EARLY — not on the due date
Estimate: under-promise, over-deliver
</code></pre>
<h3>Receiving feedback</h3>
<ul>
<li>Don't defend — listen, ask "what would 'good' look like?", then fix it.</li>
<li>Thank the person. Feedback is free mentoring.</li>
<li>Close the loop: show the improved version.</li>
</ul>
<h3>Common tools</h3>
<p><strong>Plan:</strong> Trello/Asana/Notion · <strong>Docs:</strong> Google Workspace · <strong>Chat:</strong> Slack/Teams · <strong>Design:</strong> Canva/Figma · <strong>Measure:</strong> Meta Business Suite, Google Analytics. Learn the ones your team already uses; don't impose new ones.</p>
<div class="callout"><span class="badge">Habit</span> End each day by updating your task board and noting one thing you learned — it feeds your logbook (Module 6).</div>`,
    `<span class="eyebrow">OCT202 · Mục 4 · Thực hiện</span>
<h2>Những kỹ năng khiến thực tập sinh có ích</h2>
<h3>Làm việc nhóm</h3>
<p>Biết ai làm gì, hỏi trước khi giẫm việc, cập nhật để không ai bất ngờ. Xung phong việc nhỏ — đáng tin ở việc nhỏ sẽ được giao việc lớn hơn.</p>
<h3>Quản lý thời gian &amp; công việc</h3>
<pre><code>Hằng ngày: to-do ngắn, làm 3 việc quan trọng nhất trước
Theo dõi:  trạng thái mỗi việc (cần làm / đang làm / vướng / xong)
Deadline:  sắp trễ thì báo SỚM — đừng đợi tới hạn
Ước lượng: hứa ít, làm nhiều hơn
</code></pre>
<h3>Nhận phản hồi</h3>
<ul>
<li>Đừng biện hộ — lắng nghe, hỏi "thế nào là 'tốt'?", rồi sửa.</li>
<li>Cảm ơn người góp ý. Phản hồi là kèm cặp miễn phí.</li>
<li>Khép vòng: cho xem bản đã cải thiện.</li>
</ul>
<h3>Công cụ thường dùng</h3>
<p><strong>Lập kế hoạch:</strong> Trello/Asana/Notion · <strong>Tài liệu:</strong> Google Workspace · <strong>Chat:</strong> Slack/Teams · <strong>Thiết kế:</strong> Canva/Figma · <strong>Đo lường:</strong> Meta Business Suite, Google Analytics. Học công cụ nhóm đang dùng; đừng ép nhóm đổi sang cái mới.</p>
<div class="callout"><span class="badge">Thói quen</span> Cuối ngày cập nhật bảng việc và ghi một điều học được — nó nuôi cuốn nhật ký (Mục 6).</div>`,
  ]]);
const m4q = quiz('oct202-quiz-4', 'Quiz M4 — Work skills|||Quiz M4 — Kỹ năng làm việc', [
  { id: 'q1', question: 'Khi sắp trễ deadline, bạn nên?|||When you will miss a deadline, you should?', options: ['Im lặng đến hạn rồi báo|||Stay silent until the due date', 'Báo SỚM cho người phụ trách|||Tell the owner EARLY', 'Đổ lỗi cho công cụ|||Blame the tools', 'Bỏ việc đó luôn|||Drop the task'], correctIndex: 1, explanation: 'Báo sớm để nhóm còn xoay xở; đừng báo lúc đã trễ.' },
  { id: 'q2', question: 'Cách xử lý phản hồi đúng là?|||The right way to handle feedback is?', options: ['Biện hộ để bảo vệ mình|||Defend yourself', 'Lắng nghe, hỏi tiêu chí "tốt", rồi sửa & cho xem lại|||Listen, ask what "good" looks like, fix & show the result', 'Phớt lờ|||Ignore it', 'Chỉ nhận từ sếp lớn nhất|||Only accept it from the top boss'], correctIndex: 1, explanation: 'Không biện hộ; sửa rồi khép vòng bằng bản cải thiện.' },
  { id: 'q3', question: 'Về công cụ, thực tập sinh nên?|||On tools, an intern should?', options: ['Ép nhóm đổi sang công cụ mới mình thích|||Force the team onto a new favorite tool', 'Học công cụ nhóm đang dùng|||Learn the tools the team already uses', 'Không dùng công cụ nào|||Use no tools at all', 'Chỉ dùng giấy bút|||Only pen and paper'], correctIndex: 1, explanation: 'Hoà vào quy trình sẵn có, đừng áp đặt công cụ mới.' },
]);

/* ── M5 — Áp dụng chuyên môn truyền thông ──────────────────────────────────── */
const m5 = doc('oct202-5-1-ap-dung-truyen-thong', 'M5 — Apply communication skills on real work|||M5 — Áp dụng chuyên môn truyền thông vào việc thật',
  'Gắn lý thuyết vào thực tế: sản xuất nội dung, quản lý mạng xã hội, tổ chức sự kiện, chạy chiến dịch, đo hiệu quả.',
  [[
    `<span class="eyebrow">OCT202 · Module 5 · Do</span>
<h2>Turn theory into deliverables</h2>
<p class="lead">This is where your major pays off. Whatever the task, tie it back to a goal and a metric — that is what makes it "communication work" and not just "busywork".</p>
<h3>Content</h3>
<p>Write for the audience and the platform, not for yourself. Hook in the first line, one idea per piece, clear call-to-action. Follow the brand voice &amp; visual guide.</p>
<h3>Social media</h3>
<pre><code>Plan:    a simple content calendar (date · platform · topic · asset)
Publish: right time, right format (Reel vs post vs story)
Engage:  reply to comments; a community is a two-way channel
</code></pre>
<h3>Events</h3>
<p>Run-of-show, checklist, roles, backup plan. Capture photos/quotes for the recap and for your portfolio.</p>
<h3>Campaigns &amp; measurement</h3>
<ul>
<li>Every campaign needs an <strong>objective</strong> (awareness, engagement, leads) and a <strong>KPI</strong>.</li>
<li>Track reach, engagement, CTR, conversions — whatever the objective demands.</li>
<li>Report honestly: what worked, what didn't, what you'd change.</li>
</ul>
<div class="callout"><span class="badge">Always ask</span> "What is the goal, and how will we know it worked?" Interns who ask this look senior fast.</div>`,
    `<span class="eyebrow">OCT202 · Mục 5 · Thực hiện</span>
<h2>Biến lý thuyết thành sản phẩm</h2>
<p class="lead">Đây là lúc chuyên ngành phát huy. Việc gì cũng gắn về một mục tiêu và một chỉ số — đó mới là "làm truyền thông", không phải "làm cho có".</p>
<h3>Nội dung</h3>
<p>Viết cho khán giả và cho nền tảng, không viết cho mình. Câu mở phải "móc", mỗi bài một ý, kêu gọi hành động rõ. Bám giọng thương hiệu &amp; bộ nhận diện.</p>
<h3>Mạng xã hội</h3>
<pre><code>Kế hoạch: lịch nội dung đơn giản (ngày · nền tảng · chủ đề · sản phẩm)
Đăng:     đúng giờ, đúng định dạng (Reel / bài / story)
Tương tác: trả lời bình luận; cộng đồng là kênh hai chiều
</code></pre>
<h3>Sự kiện</h3>
<p>Kịch bản chạy, checklist, phân vai, phương án dự phòng. Chụp ảnh/ghi lời cho recap và cho portfolio của bạn.</p>
<h3>Chiến dịch &amp; đo lường</h3>
<ul>
<li>Mỗi chiến dịch cần <strong>mục tiêu</strong> (nhận biết, tương tác, khách tiềm năng) và một <strong>KPI</strong>.</li>
<li>Theo dõi reach, tương tác, CTR, chuyển đổi — tuỳ mục tiêu.</li>
<li>Báo cáo trung thực: cái gì hiệu quả, cái gì không, sẽ đổi gì.</li>
</ul>
<div class="callout"><span class="badge">Luôn hỏi</span> "Mục tiêu là gì, và làm sao biết nó thành công?" Thực tập sinh hỏi câu này trông "cứng" rất nhanh.</div>`,
  ]]);
const m5q = quiz('oct202-quiz-5', 'Quiz M5 — Communication work|||Quiz M5 — Việc truyền thông', [
  { id: 'q1', question: 'Điều biến một việc thành "làm truyền thông" là?|||What makes a task real communication work?', options: ['Làm cho nhiều để trông bận|||Doing a lot to look busy', 'Gắn với một mục tiêu và một chỉ số đo|||Tying it to a goal and a metric', 'Bỏ qua khán giả|||Ignoring the audience', 'Chỉ làm theo ý thích cá nhân|||Doing what you personally like'], correctIndex: 1, explanation: 'Mọi việc phải gắn mục tiêu + KPI để đo được.' },
  { id: 'q2', question: 'Khi viết nội dung, bạn nên viết cho?|||When writing content, you write for?', options: ['Chính mình|||Yourself', 'Khán giả và nền tảng cụ thể|||The audience and the specific platform', 'Sếp đọc cho vui|||Just to please the boss', 'Máy tìm kiếm duy nhất|||Only search engines'], correctIndex: 1, explanation: 'Viết cho đối tượng và đúng đặc thù nền tảng.' },
  { id: 'q3', question: 'Một chiến dịch cần có trước tiên?|||A campaign first needs?', options: ['Ngân sách lớn|||A big budget', 'Mục tiêu rõ và KPI để biết thành công|||A clear objective and a KPI', 'Nhiều nhân sự|||Many people', 'Một cái tên kêu|||A catchy name'], correctIndex: 1, explanation: 'Không có mục tiêu + KPI thì không đo được hiệu quả.' },
]);

/* ── M6 — Ghi nhật ký & thu thập minh chứng ────────────────────────────────── */
const m6 = doc('oct202-6-1-nhat-ky-minh-chung', 'M6 — Logbook &amp; evidence: capture as you go|||M6 — Nhật ký &amp; minh chứng: ghi ngay khi làm',
  'Viết nhật ký thực tập, log công việc theo tuần, lưu sản phẩm/portfolio, xin nhận xét & minh chứng ngay trong lúc thực tập.',
  [[
    `<span class="eyebrow">OCT202 · Module 6 · Report</span>
<h2>Capture evidence while it's fresh</h2>
<p class="lead">The single biggest report mistake is writing everything at the end. Capture as you go — a report is 80% assembled if your logbook is honest.</p>
<h3>Weekly logbook</h3>
<pre><code>Week N
- Tasks done:   (what, for whom, result)
- Skills used:   (content, analytics, design, teamwork...)
- Learned:       (one lesson, one mistake to avoid)
- Evidence:      (links / files / screenshots)
</code></pre>
<h3>Collect evidence</h3>
<ul>
<li>Save your deliverables (with permission) — posts, videos, decks, spreadsheets.</li>
<li>Screenshot metrics (reach, engagement) at the time — you can't get them later.</li>
<li>Keep a folder per week; name files clearly.</li>
</ul>
<h3>Ask for input early</h3>
<p>Near the end, ask your mentor for a short written comment and, if possible, a reference/recommendation. Give them your draft achievements so they can confirm the facts — don't make them start from a blank page.</p>
<div class="callout"><span class="badge">Rule</span> If it isn't in the logbook, it didn't happen — as far as the report and the grader are concerned.</div>`,
    `<span class="eyebrow">OCT202 · Mục 6 · Báo cáo</span>
<h2>Thu minh chứng lúc còn "nóng"</h2>
<p class="lead">Sai lầm lớn nhất khi làm báo cáo là để viết dồn vào cuối. Ghi ngay khi làm — nếu nhật ký trung thực thì báo cáo đã dựng sẵn 80%.</p>
<h3>Nhật ký theo tuần</h3>
<pre><code>Tuần N
- Việc đã làm:   (làm gì, cho ai, kết quả)
- Kỹ năng dùng:   (nội dung, phân tích, thiết kế, làm nhóm...)
- Học được:       (một bài học, một lỗi cần tránh)
- Minh chứng:     (link / file / ảnh chụp)
</code></pre>
<h3>Thu thập minh chứng</h3>
<ul>
<li>Lưu sản phẩm của bạn (khi được phép) — bài đăng, video, slide, bảng tính.</li>
<li>Chụp số liệu (reach, tương tác) NGAY lúc đó — về sau lấy lại không được.</li>
<li>Giữ một thư mục mỗi tuần; đặt tên file rõ ràng.</li>
</ul>
<h3>Xin nhận xét sớm</h3>
<p>Gần cuối, xin mentor một nhận xét ngắn bằng văn bản và nếu được thì thư giới thiệu. Đưa họ bản nháp thành tích để họ xác nhận sự thật — đừng để họ bắt đầu từ trang trắng.</p>
<div class="callout"><span class="badge">Quy tắc</span> Không có trong nhật ký nghĩa là không xảy ra — với báo cáo và người chấm là như vậy.</div>`,
  ]]);
const m6q = quiz('oct202-quiz-6', 'Quiz M6 — Logbook &amp; evidence|||Quiz M6 — Nhật ký &amp; minh chứng', [
  { id: 'q1', question: 'Vì sao nên chụp số liệu ngay lúc làm?|||Why screenshot metrics as you go?', options: ['Cho vui|||For fun', 'Vì về sau thường không lấy lại được|||Because you often cannot retrieve them later', 'Vì mentor bắt buộc mỗi giờ|||Because the mentor demands it hourly', 'Không cần thiết|||It is unnecessary'], correctIndex: 1, explanation: 'Reach/tương tác thay đổi và khó lấy lại — chụp ngay.' },
  { id: 'q2', question: 'Nhật ký tuần nên gồm?|||A weekly logbook should include?', options: ['Chỉ cảm xúc cá nhân|||Only personal feelings', 'Việc đã làm, kỹ năng dùng, bài học, minh chứng|||Tasks done, skills used, lessons, evidence', 'Chỉ tên công ty|||Just the company name', 'Không cần link|||No links'], correctIndex: 1, explanation: 'Ghi đủ việc-kỹ năng-bài học-minh chứng theo tuần.' },
  { id: 'q3', question: 'Khi xin nhận xét của mentor, bạn nên?|||When asking your mentor for a comment, you should?', options: ['Đợi tới ngày cuối rồi mới hỏi|||Wait until the last day', 'Xin sớm & đưa bản nháp thành tích để họ xác nhận|||Ask early & give a draft of achievements to confirm', 'Tự viết hộ họ|||Write it for them secretly', 'Không cần xin|||Not ask at all'], correctIndex: 1, explanation: 'Xin sớm và giúp mentor bằng bản nháp sự thật.' },
]);

/* ── M7 — Viết báo cáo thực tập ────────────────────────────────────────────── */
const m7 = doc('oct202-7-1-viet-bao-cao', 'M7 — Write the OJT report: structure, tasks, reflection|||M7 — Viết báo cáo thực tập: cấu trúc, mô tả việc, phản tư',
  'Cấu trúc báo cáo OJT chuẩn, mô tả công việc bằng kết quả, phần phản tư/bài học, trích dẫn nguồn & định dạng.',
  [[
    `<span class="eyebrow">OCT202 · Module 7 · Report</span>
<h2>Assemble the OJT report</h2>
<h3>Standard structure</h3>
<pre><code>1. Cover &amp; declaration
2. Acknowledgements
3. Company overview        (what it does, your team)
4. Job description         (your role, tasks, tools)
5. What you did &amp; results  (deliverables + metrics)
6. Reflection &amp; lessons     (skills gained, challenges, growth)
7. Conclusion &amp; suggestions
8. References &amp; appendices  (evidence, mentor comments)
</code></pre>
<h3>Describe work by results</h3>
<p>Not "I made posts" but "I produced 24 posts over 8 weeks; average reach rose from X to Y". Quantify wherever you honestly can. Use your logbook — that's why you kept it.</p>
<h3>Reflection is graded most</h3>
<ul>
<li>What did you actually learn — technically and about yourself?</li>
<li>Where did you struggle, and how did you adapt?</li>
<li>How does this change your career direction?</li>
</ul>
<h3>Cite &amp; format</h3>
<p>Reference any framework, article or data you used. Keep formatting consistent (headings, captions, page numbers). Proofread — typos cost easy marks. Follow the FLM template exactly.</p>
<div class="callout"><span class="badge">Do &amp; don't</span> DO be specific and honest. DON'T pad with theory copied from textbooks — graders want <em>your</em> experience.</div>`,
    `<span class="eyebrow">OCT202 · Mục 7 · Báo cáo</span>
<h2>Lắp ráp báo cáo OJT</h2>
<h3>Cấu trúc chuẩn</h3>
<pre><code>1. Bìa &amp; lời cam đoan
2. Lời cảm ơn
3. Giới thiệu công ty        (làm gì, bộ phận của bạn)
4. Mô tả công việc           (vai trò, nhiệm vụ, công cụ)
5. Việc đã làm &amp; kết quả      (sản phẩm + số liệu)
6. Phản tư &amp; bài học          (kỹ năng đạt được, thử thách, trưởng thành)
7. Kết luận &amp; đề xuất
8. Tài liệu &amp; phụ lục         (minh chứng, nhận xét mentor)
</code></pre>
<h3>Mô tả việc bằng kết quả</h3>
<p>Không viết "em làm bài đăng" mà "em sản xuất 24 bài trong 8 tuần; reach trung bình tăng từ X lên Y". Định lượng ở mọi chỗ trung thực được. Dùng nhật ký — bạn ghi để dùng lúc này.</p>
<h3>Phần phản tư được chấm nặng nhất</h3>
<ul>
<li>Bạn thật sự học được gì — về chuyên môn và về bản thân?</li>
<li>Chỗ nào bạn vật lộn, và đã thích nghi ra sao?</li>
<li>Điều này thay đổi định hướng nghề của bạn thế nào?</li>
</ul>
<h3>Trích dẫn &amp; định dạng</h3>
<p>Ghi nguồn mọi mô hình, bài viết hay số liệu đã dùng. Giữ định dạng nhất quán (tiêu đề, chú thích, số trang). Rà lỗi chính tả — sai vặt mất điểm dễ. Bám đúng mẫu FLM.</p>
<div class="callout"><span class="badge">Nên &amp; không</span> NÊN cụ thể và trung thực. KHÔNG độn lý thuyết chép từ sách giáo khoa — người chấm muốn trải nghiệm của <em>bạn</em>.</div>`,
  ]]);
const m7q = quiz('oct202-quiz-7', 'Quiz M7 — Writing the report|||Quiz M7 — Viết báo cáo', [
  { id: 'q1', question: 'Cách mô tả công việc tốt trong báo cáo là?|||The best way to describe work in the report is?', options: ['"Em làm nhiều bài đăng"|||"I made many posts"', 'Định lượng kết quả: "24 bài/8 tuần, reach tăng X→Y"|||Quantify: "24 posts / 8 weeks, reach X→Y"', 'Chỉ chép mô tả công ty|||Copy the company description', 'Viết càng mơ hồ càng an toàn|||Be as vague as possible'], correctIndex: 1, explanation: 'Mô tả bằng con số và kết quả cụ thể, lấy từ nhật ký.' },
  { id: 'q2', question: 'Phần nào của báo cáo OJT thường được chấm nặng nhất?|||Which part is usually weighted most?', options: ['Trang bìa|||The cover', 'Phần phản tư & bài học|||The reflection & lessons', 'Lời cảm ơn|||The acknowledgements', 'Mục lục|||The table of contents'], correctIndex: 1, explanation: 'Phản tư cho thấy bạn trưởng thành ra sao — được chấm nặng.' },
  { id: 'q3', question: 'Về nội dung báo cáo, bạn nên?|||On report content, you should?', options: ['Độn thật nhiều lý thuyết chép từ sách|||Pad with textbook theory', 'Kể trải nghiệm thật, cụ thể & ghi nguồn khi trích|||Tell your real, specific experience & cite sources', 'Bịa số liệu cho đẹp|||Invent nice metrics', 'Bỏ qua định dạng|||Ignore formatting'], correctIndex: 1, explanation: 'Trung thực, cụ thể, trích dẫn đúng và theo mẫu.' },
]);

/* ── M8 — Đánh giá, bảo vệ & định hướng nghề ───────────────────────────────── */
const m8 = doc('oct202-8-1-bao-ve-dinh-huong', 'M8 — Evaluation, defense &amp; career next steps|||M8 — Đánh giá, bảo vệ &amp; định hướng nghề',
  'Tiêu chí chấm, chuẩn bị bảo vệ/thuyết trình & hỏi đáp, xin thư giới thiệu, chuyển tiếp từ thực tập sang việc làm.',
  [[
    `<span class="eyebrow">OCT202 · Module 8 · Report</span>
<h2>Finish strong and convert it</h2>
<h3>Know the rubric</h3>
<p>Grades usually combine the <strong>company evaluation</strong>, the <strong>report</strong>, and the <strong>defense</strong>. Read the exact criteria on FLM and check your report against each line before you submit.</p>
<h3>Defense / presentation</h3>
<pre><code>Slides:  company → your role → results (with numbers) → lessons
Time:    rehearse; keep to the limit
Q&amp;A:    answer honestly; "I don't know, but I'd find out by..." beats bluffing
Proof:   have your evidence ready to show
</code></pre>
<h3>Turn OJT into a job</h3>
<ul>
<li>Ask your mentor for a <strong>recommendation/reference</strong> while the work is fresh.</li>
<li>Update your CV, portfolio and LinkedIn with the new, quantified results.</li>
<li>If you want to stay, say so — ask about openings before you leave.</li>
<li>Keep the relationship warm: a thank-you note and staying in touch pay off later.</li>
</ul>
<div class="callout"><span class="badge">Bottom line</span> OJT is graded, but its real value is the reference, the portfolio and the door it opens. Finish every task like your next job depends on it — often it does.</div>`,
    `<span class="eyebrow">OCT202 · Mục 8 · Báo cáo</span>
<h2>Về đích mạnh và biến nó thành việc làm</h2>
<h3>Nắm tiêu chí chấm</h3>
<p>Điểm thường gộp <strong>đánh giá của công ty</strong>, <strong>báo cáo</strong> và <strong>buổi bảo vệ</strong>. Đọc đúng tiêu chí trên FLM và soi báo cáo theo từng dòng trước khi nộp.</p>
<h3>Bảo vệ / thuyết trình</h3>
<pre><code>Slide:   công ty → vai trò của bạn → kết quả (kèm số) → bài học
Thời gian: tập trước; giữ đúng giới hạn
Hỏi đáp: trả lời trung thực; "Em chưa rõ, nhưng sẽ tìm bằng..." hơn là chém
Bằng chứng: sẵn minh chứng để trình
</code></pre>
<h3>Biến OJT thành việc làm</h3>
<ul>
<li>Xin mentor một <strong>thư giới thiệu/người tham chiếu</strong> khi việc còn "nóng".</li>
<li>Cập nhật CV, portfolio và LinkedIn với kết quả mới, có số liệu.</li>
<li>Muốn ở lại thì nói ra — hỏi về vị trí trống trước khi rời đi.</li>
<li>Giữ quan hệ ấm: một lời cảm ơn và giữ liên lạc sẽ có ích về sau.</li>
</ul>
<div class="callout"><span class="badge">Chốt lại</span> OJT có điểm, nhưng giá trị thật là thư giới thiệu, portfolio và cánh cửa nó mở. Làm mọi việc như thể công việc kế tiếp phụ thuộc vào nó — thường là đúng vậy.</div>`,
  ]]);
const m8q = quiz('oct202-quiz-8', 'Quiz M8 — Defense &amp; career|||Quiz M8 — Bảo vệ &amp; định hướng nghề', [
  { id: 'q1', question: 'Điểm OJT thường gồm những phần nào?|||An OJT grade usually combines?', options: ['Chỉ báo cáo|||The report only', 'Đánh giá công ty + báo cáo + bảo vệ|||Company evaluation + report + defense', 'Chỉ điểm chuyên cần|||Attendance only', 'Một bài trắc nghiệm|||One quiz'], correctIndex: 1, explanation: 'Ba nguồn: đánh giá công ty, báo cáo và buổi bảo vệ.' },
  { id: 'q2', question: 'Khi bị hỏi câu chưa biết trong buổi bảo vệ, tốt nhất là?|||When asked something you don\'t know at the defense?', options: ['Chém đại cho qua|||Bluff confidently', 'Thành thật: "Em chưa rõ, nhưng sẽ tìm bằng..."|||Be honest: "I don\'t know, but I\'d find out by..."', 'Im lặng bỏ qua|||Stay silent', 'Đổ lỗi cho công ty|||Blame the company'], correctIndex: 1, explanation: 'Trung thực + cách sẽ tìm ra hơn hẳn chém gió.' },
  { id: 'q3', question: 'Để biến OJT thành việc làm, bạn nên?|||To turn OJT into a job, you should?', options: ['Rời đi im lặng|||Leave quietly', 'Xin thư giới thiệu, cập nhật CV/portfolio, hỏi vị trí trống|||Get a reference, update CV/portfolio, ask about openings', 'Xoá mọi liên hệ|||Delete all contacts', 'Không cập nhật gì|||Update nothing'], correctIndex: 1, explanation: 'Giữ quan hệ, xin tham chiếu và cập nhật hồ sơ ngay.' },
]);

export default {
  semester: { code: 'FPTU_Hola6', name: 'Kỳ 6 — Thực tập', ordinal: 8 },
  course: {
    courseCode: 'OCT202',
    slug: 'oct202-on-the-job-training',
    title: 'On-the-job training',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/OCT202.webp',
    shortDescription: 'A practical guide to On-the-Job Training (OJT): prepare (CV, portfolio, interview), integrate into a company, do real communication & marketing work, log evidence, write the report, defend & land a job. Bilingual, with quizzes.|||Cẩm nang thực tập nghề nghiệp (OJT): chuẩn bị (CV, portfolio, phỏng vấn), hội nhập doanh nghiệp, làm việc truyền thông & marketing thật, ghi minh chứng, viết báo cáo, bảo vệ & tìm việc. Song ngữ, có quiz.',
    description: 'Môn <strong>OCT202 — On-the-Job Training (Thực tập nghề nghiệp)</strong> thuộc khối Công nghệ Truyền thông, kỳ 6. <strong>Đây là môn thực tập doanh nghiệp</strong>, không phải môn kiến thức lý thuyết — bạn đi làm thật trong công ty và được chấm qua đánh giá của doanh nghiệp, báo cáo và buổi bảo vệ.<br><br>Khung đi theo lộ trình <strong>Chuẩn bị → Hội nhập → Thực hiện → Báo cáo</strong>: từ CV/portfolio &amp; phỏng vấn → văn hoá công ty, tác phong, giao tiếp công sở, đạo đức nghề → kỹ năng làm việc thật (nhóm, thời gian, phản hồi, công cụ) → áp dụng chuyên môn truyền thông (nội dung, mạng xã hội, sự kiện, chiến dịch) → ghi nhật ký &amp; minh chứng → viết báo cáo OJT → bảo vệ &amp; định hướng nghề. Song ngữ, nhiều checklist và biểu mẫu thực dụng, quiz mỗi mục.',
    whatYouLearn: 'Vai trò &amp; chuẩn đầu ra của thực tập sinh; viết CV một trang &amp; portfolio, ứng tuyển &amp; phỏng vấn (STAR); hội nhập văn hoá, tác phong &amp; giao tiếp công sở, đạo đức nghề &amp; bảo mật; làm việc nhóm, quản lý thời gian, nhận phản hồi, công cụ cộng tác; áp dụng chuyên môn truyền thông (nội dung, mạng xã hội, sự kiện, chiến dịch, đo lường); ghi nhật ký &amp; thu minh chứng; viết báo cáo OJT &amp; phản tư; tiêu chí chấm, bảo vệ &amp; chuyển tiếp việc làm.',
    requirements: 'Đã tích luỹ đủ tín chỉ theo quy chế OJT của FPTU. Đăng ký thực tập qua FAP và đọc quy chế/chuẩn đầu ra trên FLM trước khi bắt đầu.',
  },
  sections: [
    { title: '📚 Tài liệu & biểu mẫu|||📚 Materials & templates', description: 'Quy chế OJT, sổ tay, mẫu CV/portfolio, nhật ký & báo cáo, lộ trình 4 bước.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn OJT|||OJT overview', description: 'OJT là gì, mục tiêu, tín chỉ, quy trình đánh giá.', lessons: [intro] },
    { title: 'M1 — OJT là gì & mục tiêu|||M1 — What OJT is & outcomes', description: 'Vai trò, chuẩn đầu ra, quyền & nghĩa vụ.', lessons: [m1, m1q] },
    { title: 'M2 — Chuẩn bị trước thực tập|||M2 — Prepare', description: 'CV, portfolio, ứng tuyển, phỏng vấn.', lessons: [m2, m2q] },
    { title: 'M3 — Hội nhập doanh nghiệp|||M3 — Integrate', description: 'Văn hoá, tác phong, giao tiếp công sở, đạo đức.', lessons: [m3, m3q] },
    { title: 'M4 — Kỹ năng làm việc thật|||M4 — Real work skills', description: 'Nhóm, thời gian, phản hồi, công cụ.', lessons: [m4, m4q] },
    { title: 'M5 — Áp dụng truyền thông|||M5 — Apply communication', description: 'Nội dung, mạng xã hội, sự kiện, chiến dịch, đo lường.', lessons: [m5, m5q] },
    { title: 'M6 — Nhật ký & minh chứng|||M6 — Logbook & evidence', description: 'Nhật ký tuần, log việc, portfolio, xin nhận xét.', lessons: [m6, m6q] },
    { title: 'M7 — Viết báo cáo thực tập|||M7 — Write the report', description: 'Cấu trúc, mô tả việc bằng kết quả, phản tư, trích dẫn.', lessons: [m7, m7q] },
    { title: 'M8 — Đánh giá, bảo vệ & nghề|||M8 — Evaluation, defense & career', description: 'Tiêu chí chấm, bảo vệ, thư giới thiệu, chuyển tiếp việc làm.', lessons: [m8, m8q] },
  ],
};
