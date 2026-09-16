/**
 * OJP202 — On-the-Job Training (Thực tập doanh nghiệp), ngành Ngôn ngữ Nhật, Kỳ 6.
 * Đây là môn THỰC TẬP: khung theo 8 GIAI ĐOẠN của kỳ thực tập (không phải chương lý
 * thuyết). Định hướng vị trí dùng tiếng Nhật (biên-phiên dịch, trợ lý, nhân viên công
 * ty Nhật). Song ngữ + thuật ngữ tiếng Nhật (kana/kanji + romaji). Giữ NGUYÊN
 * slug/semester/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức giai đoạn.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('ojp202-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Quy định thực tập FPTU (FLM), mẫu rirekisho/nhật báo, kỹ năng tìm việc & văn hoá công sở Nhật Bản, LinkedIn Learning.',
  [[
    `<span class="eyebrow">OJP202 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything for a successful <strong>On-the-Job Training (OJT)</strong> internship in a Japanese-speaking role — from finding a position to the final report. The official internship regulations live on <strong>FLM</strong>; below are free, legal resources for job-search skills and Japanese workplace culture.</p>
<h3>📘 Official internship regulations</h3>
<p>FPTU's OJT regulations, report templates and evaluation rubric are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account. Always follow the current version there over any summary here.</p>
<h3>🌐 Job-search &amp; workplace-culture resources</h3>
<ul>
<li><a href="https://www.linkedin.com/learning/" target="_blank" rel="noopener">LinkedIn Learning</a> — courses on résumé writing, interview skills and workplace communication (often free via a university/library account).</li>
<li><a href="https://www.jetro.go.jp/en/invest/setting_up/section4/page4.html" target="_blank" rel="noopener">JETRO — Japanese business etiquette</a> — official guide to meishi exchange, keigo and office manners.</li>
<li><a href="https://www.tofugu.com/japan/hourensou/" target="_blank" rel="noopener">Tofugu — Hōrensō explained</a> — the report/contact/consult habit every Japanese workplace expects.</li>
</ul>
<h3>📝 Templates you will reuse</h3>
<ul>
<li><strong>Rirekisho (履歴書)</strong> — the standardized Japanese CV format used in job applications.</li>
<li><strong>Nippō (日報)</strong> — the daily work-log template used throughout the internship.</li>
<li><strong>Final internship report</strong> — the FLM-provided structure for the closing report and defense slides.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Before day 1</strong> — read the FLM OJT regulations end to end; know your deliverables and deadlines.</li>
<li><strong>Week 1</strong> — learn your company's rules, keigo register and reporting habits before producing output.</li>
<li><strong>Ongoing</strong> — write nippō every day; do not let logs pile up for the final report.</li>
<li><strong>Final weeks</strong> — draft the report early and rehearse the defense out loud.</li>
</ol></div>`,
    `<span class="eyebrow">OJP202 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để có một kỳ <strong>thực tập doanh nghiệp (OJT)</strong> thành công ở vị trí dùng tiếng Nhật — từ tìm việc đến báo cáo cuối kỳ. Quy định thực tập chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp cho kỹ năng tìm việc và văn hoá công sở Nhật Bản.</p>
<h3>📘 Quy định thực tập chính thức</h3>
<p>Quy định OJT, mẫu báo cáo và rubric đánh giá của FPTU có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU. Luôn ưu tiên bản mới nhất ở đó hơn mọi tóm tắt ở đây.</p>
<h3>🌐 Nguồn kỹ năng tìm việc &amp; văn hoá công sở</h3>
<ul>
<li><a href="https://www.linkedin.com/learning/" target="_blank" rel="noopener">LinkedIn Learning</a> — khoá học viết CV, kỹ năng phỏng vấn và giao tiếp công sở (thường miễn phí qua tài khoản trường/thư viện).</li>
<li><a href="https://www.jetro.go.jp/en/invest/setting_up/section4/page4.html" target="_blank" rel="noopener">JETRO — nghi thức kinh doanh Nhật Bản</a> — hướng dẫn chính thức về trao danh thiếp, kính ngữ và phép tắc văn phòng.</li>
<li><a href="https://www.tofugu.com/japan/hourensou/" target="_blank" rel="noopener">Tofugu — Giải thích Hōrensō</a> — thói quen báo cáo/liên lạc/bàn bạc mà mọi công ty Nhật đều mong đợi.</li>
</ul>
<h3>📝 Mẫu bạn sẽ dùng lại nhiều lần</h3>
<ul>
<li><strong>Rirekisho (履歴書)</strong> — mẫu CV chuẩn hoá của Nhật Bản, dùng khi ứng tuyển.</li>
<li><strong>Nippō (日報)</strong> — mẫu nhật ký công việc hằng ngày, dùng suốt kỳ thực tập.</li>
<li><strong>Báo cáo thực tập cuối kỳ</strong> — cấu trúc do FLM cung cấp cho báo cáo và slide bảo vệ.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Trước ngày đầu</strong> — đọc kỹ quy định OJT trên FLM; nắm rõ deliverable và hạn nộp.</li>
<li><strong>Tuần đầu</strong> — học nội quy công ty, kính ngữ và thói quen báo cáo trước khi tạo ra sản phẩm.</li>
<li><strong>Xuyên suốt</strong> — viết nhật báo mỗi ngày; đừng để dồn việc đến báo cáo cuối kỳ.</li>
<li><strong>Tuần cuối</strong> — soạn báo cáo sớm và luyện nói trước khi bảo vệ.</li>
</ol></div>`,
  ]]);

const gioiThieu = doc('ojp202-0-1-overview', 'Course overview: On-the-Job Training|||Tổng quan: Thực tập doanh nghiệp',
  'OJT là gì, vì sao bắt buộc; deliverable (nhật ký, báo cáo, đánh giá doanh nghiệp); rubric đánh giá; lộ trình 8 giai đoạn.',
  [[
    `<span class="eyebrow">OJP202 · Overview</span>
<h2>On-the-Job Training</h2>
<p class="lead">OJP202 is your <strong>internship semester</strong> for the Japanese Language major — a full semester working at a real company in a role that uses your Japanese, under the supervision of both a company mentor and an FPTU lecturer. It converts three years of classroom Japanese into <strong>workplace competence</strong>: real communication, real deadlines, real professional norms.</p>
<h3>Typical Japanese-language internship roles</h3>
<ul>
<li><strong>Translator / interpreter</strong> — written documents, meetings, phone calls between Vietnamese and Japanese staff.</li>
<li><strong>Assistant (アシスタント)</strong> — supporting a Japanese manager or team with scheduling, documents, correspondence.</li>
<li><strong>Staff at a Japanese-affiliated company</strong> — customer service, back office, coordination roles where Japanese is a daily working language.</li>
</ul>
<h3>Deliverables you will produce</h3>
<ul>
<li><strong>Daily/weekly log (日報/週報, nippō/shūhō)</strong> — a running record of tasks, difficulties and what you learned.</li>
<li><strong>Final internship report</strong> — following the FLM template: company overview, your role, tasks performed, skills gained, reflection.</li>
<li><strong>Company evaluation (đánh giá doanh nghiệp)</strong> — a form your supervisor fills in, scoring your attitude, skills and output.</li>
<li><strong>Defense (bảo vệ)</strong> — presenting your report to a panel, in Vietnamese and/or Japanese depending on your program's requirement.</li>
</ul>
<h3>How you are graded (typical rubric weighting)</h3>
<pre><code>Company supervisor evaluation ......... ~40%
Final report content &amp; structure ..... ~30%
Defense / presentation ................ ~20%
Logbook completeness &amp; regularity ..... ~10%
</code></pre>
<p>Exact weights follow the FLM syllabus for your cohort — always check the current rubric there.</p>
<h3>Roadmap — 8 phases of the internship</h3>
<p>Preparation &amp; finding a position → CV/rirekisho &amp; interview → onboarding into company culture → professional skills &amp; work ethics → doing the work &amp; keeping a nippō → communication &amp; teamwork → writing the final report → evaluation, defense &amp; career direction.</p>
<div class="callout"><span class="badge">Read this first</span> Everything here is a study guide. Deadlines, forms and the exact rubric are set by FLM for your cohort — this course does not replace them.</div>`,
    `<span class="eyebrow">OJP202 · Tổng quan</span>
<h2>Thực tập doanh nghiệp</h2>
<p class="lead">OJP202 là <strong>kỳ thực tập</strong> của ngành Ngôn ngữ Nhật — một học kỳ làm việc thật tại doanh nghiệp, ở vị trí có dùng tiếng Nhật, dưới sự hướng dẫn của cả người quản lý bên công ty lẫn giảng viên FPTU. Môn này biến ba năm tiếng Nhật trên giảng đường thành <strong>năng lực làm việc thật</strong>: giao tiếp thật, deadline thật, chuẩn mực nghề nghiệp thật.</p>
<h3>Vị trí thực tập thường gặp cho ngành Ngôn ngữ Nhật</h3>
<ul>
<li><strong>Biên - phiên dịch</strong> — dịch văn bản, dịch cuộc họp, dịch điện thoại giữa nhân viên Việt và Nhật.</li>
<li><strong>Trợ lý (アシスタント, assistant)</strong> — hỗ trợ quản lý hoặc nhóm người Nhật về lịch làm việc, hồ sơ, thư từ.</li>
<li><strong>Nhân viên công ty có yếu tố Nhật</strong> — chăm sóc khách hàng, hậu cần, điều phối — nơi tiếng Nhật là ngôn ngữ làm việc hằng ngày.</li>
</ul>
<h3>Sản phẩm bạn sẽ nộp</h3>
<ul>
<li><strong>Nhật ký/báo cáo tuần (日報/週報, nippō/shūhō)</strong> — ghi lại công việc, khó khăn và điều học được mỗi ngày.</li>
<li><strong>Báo cáo thực tập cuối kỳ</strong> — theo mẫu FLM: giới thiệu doanh nghiệp, vị trí của bạn, công việc đã làm, kỹ năng đạt được, tự đánh giá.</li>
<li><strong>Phiếu đánh giá doanh nghiệp</strong> — do người hướng dẫn bên công ty chấm về thái độ, kỹ năng và sản phẩm.</li>
<li><strong>Bảo vệ</strong> — trình bày báo cáo trước hội đồng, bằng tiếng Việt và/hoặc tiếng Nhật tuỳ yêu cầu chương trình.</li>
</ul>
<h3>Cách chấm điểm (tỉ trọng rubric tham khảo)</h3>
<pre><code>Đánh giá của doanh nghiệp .............. ~40%
Nội dung &amp; cấu trúc báo cáo cuối kỳ ..... ~30%
Bảo vệ / thuyết trình ................... ~20%
Nhật ký đầy đủ &amp; đều đặn ................ ~10%
</code></pre>
<p>Tỉ trọng chính xác theo giáo trình FLM của khoá bạn — luôn kiểm rubric hiện hành ở đó.</p>
<h3>Lộ trình — 8 giai đoạn thực tập</h3>
<p>Chuẩn bị &amp; tìm vị trí → CV/rirekisho &amp; phỏng vấn → hoà nhập văn hoá công ty → kỹ năng chuyên nghiệp &amp; đạo đức nghề → thực hiện công việc &amp; ghi nhật báo → giao tiếp &amp; làm việc nhóm → viết báo cáo cuối kỳ → đánh giá, bảo vệ &amp; định hướng nghề nghiệp.</p>
<div class="callout"><span class="badge">Đọc trước tiên</span> Nội dung ở đây là tài liệu tự học. Hạn nộp, biểu mẫu và rubric chính xác do FLM quy định theo khoá của bạn — môn này không thay thế các quy định đó.</div>`,
  ]]);

const p1 = doc('ojp202-1-1-preparation', 'Phase 1 — Preparation & finding a Japanese-speaking position|||Giai đoạn 1 — Chuẩn bị & tìm doanh nghiệp/vị trí dùng tiếng Nhật',
  'Tự đánh giá năng lực (JLPT, kỹ năng mềm), kênh tìm việc thực tập tiếng Nhật, đọc tin tuyển dụng, chọn công ty phù hợp, xin xác nhận FLM.',
  [[
    `<span class="eyebrow">OJP202 · Phase 1</span>
<h2>Preparation &amp; finding a position</h2>
<p class="lead">Before applying anywhere, take stock of what you can actually offer, then search with a plan instead of scattering CVs everywhere.</p>
<h3>Self-assessment</h3>
<ul>
<li><strong>Japanese level</strong> — your JLPT level (or equivalent), and honestly: can you read business email, take a phone call, understand a meeting?</li>
<li><strong>Hard skills</strong> — translation, Word/Excel/PowerPoint, any domain knowledge (IT, trade, tourism, manufacturing).</li>
<li><strong>Soft skills</strong> — punctuality, attention to detail, willingness to ask when unsure — these matter as much as JLPT score in a Japanese workplace.</li>
</ul>
<h3>Where to look</h3>
<ul>
<li>The university's <strong>career center / FLM internship board</strong> — often has partner companies used to training FPTU interns.</li>
<li>Job boards specialized in Japanese-related roles (search terms: <em>"thực tập tiếng Nhật"</em>, <em>"Japanese-speaking internship"</em>, <em>日本語 インターン</em>).</li>
<li><strong>LinkedIn</strong> and alumni networks — a referral from a senior (先輩, senpai) who interned before you is often the fastest path.</li>
</ul>
<h3>Reading a job posting critically</h3>
<pre><code>Checklist before applying:
[ ] Required Japanese level stated (N3/N2/...) — do you meet it, or close?
[ ] Job duties match "uses Japanese", not just "nice to have"
[ ] Location/schedule are workable for a full semester
[ ] Company is willing to sign an internship confirmation for FLM
[ ] No red flags (unpaid + vague duties + no mentor mentioned)
</code></pre>
<div class="callout"><span class="badge">Do this early</span> Start searching well before the semester begins — good positions for Japanese-language interns fill up, and you still need time for CV, interview and FLM's confirmation paperwork.</div>`,
    `<span class="eyebrow">OJP202 · Giai đoạn 1</span>
<h2>Chuẩn bị &amp; tìm doanh nghiệp/vị trí</h2>
<p class="lead">Trước khi nộp hồ sơ bất cứ đâu, hãy nhìn lại thật kỹ mình có gì, rồi tìm việc có kế hoạch thay vì rải CV khắp nơi.</p>
<h3>Tự đánh giá bản thân</h3>
<ul>
<li><strong>Trình độ tiếng Nhật</strong> — cấp độ JLPT (hoặc tương đương), và thành thật: bạn đọc được email công việc, nghe điện thoại, hiểu cuộc họp chưa?</li>
<li><strong>Kỹ năng cứng</strong> — dịch thuật, Word/Excel/PowerPoint, kiến thức chuyên ngành (IT, thương mại, du lịch, sản xuất).</li>
<li><strong>Kỹ năng mềm</strong> — đúng giờ, cẩn thận, sẵn sàng hỏi khi chưa rõ — những điều này quan trọng không kém điểm JLPT trong môi trường Nhật Bản.</li>
</ul>
<h3>Tìm ở đâu</h3>
<ul>
<li><strong>Trung tâm hỗ trợ việc làm / bảng thực tập của FLM</strong> — thường có sẵn doanh nghiệp đối tác quen nhận sinh viên FPTU.</li>
<li>Trang tuyển dụng chuyên về vị trí liên quan tiếng Nhật (từ khoá: <em>"thực tập tiếng Nhật"</em>, <em>"Japanese-speaking internship"</em>, <em>日本語 インターン</em>).</li>
<li><strong>LinkedIn</strong> và mạng lưới cựu sinh viên — giới thiệu từ một <strong>先輩 (senpai)</strong> từng thực tập trước bạn thường là cách nhanh nhất.</li>
</ul>
<h3>Đọc tin tuyển dụng có phân tích</h3>
<pre><code>Checklist trước khi nộp hồ sơ:
[ ] Có ghi rõ yêu cầu tiếng Nhật (N3/N2/...) — bạn đạt, hoặc gần đạt?
[ ] Công việc thật sự "dùng tiếng Nhật", không chỉ "biết thì tốt"
[ ] Địa điểm/lịch làm phù hợp cho cả một học kỳ
[ ] Công ty sẵn sàng ký xác nhận thực tập cho FLM
[ ] Không có dấu hiệu bất thường (không lương + việc mập mờ + không ai hướng dẫn)
</code></pre>
<div class="callout"><span class="badge">Làm sớm</span> Bắt đầu tìm việc từ trước khi vào kỳ — vị trí tốt cho sinh viên tiếng Nhật hết chỗ nhanh, và bạn còn cần thời gian cho CV, phỏng vấn và giấy xác nhận với FLM.</div>`,
  ]]);

const p1q = quiz('ojp202-quiz-1', 'Quiz 1 — Preparation & finding a position|||Quiz 1 — Chuẩn bị & tìm vị trí', [
  { id: 'q1', question: 'Khi đọc một tin tuyển dụng thực tập tiếng Nhật, điều nào nên kiểm TRƯỚC KHI nộp hồ sơ?', options: ['Chỉ cần công ty nổi tiếng', 'Yêu cầu tiếng Nhật, công việc có thật sự dùng tiếng Nhật, và công ty có ký xác nhận cho FLM', 'Địa chỉ công ty ở gần nhà', 'Không cần kiểm gì, cứ nộp hết'], correctIndex: 1, explanation: 'Cần đối chiếu yêu cầu trình độ, tính chất công việc và khả năng ký xác nhận thực tập trước khi nộp.' },
  { id: 'q2', question: '先輩 (senpai) trong bối cảnh tìm việc thực tập nghĩa là gì?', options: ['Người quản lý trực tiếp tại công ty', 'Đàn anh/chị đi trước, có thể giới thiệu hoặc chia sẻ kinh nghiệm', 'Tên một loại hồ sơ xin việc', 'Chức danh trong phòng nhân sự'], correctIndex: 1, explanation: '先輩 (senpai) là người đi trước — bạn học khoá trên, cựu sinh viên — người có thể giới thiệu việc hoặc chia sẻ kinh nghiệm thực tập.' },
  { id: 'q3', question: 'Vì sao nên bắt đầu tìm vị trí thực tập tiếng Nhật SỚM, trước khi kỳ thực tập bắt đầu?', options: ['Vì công ty Nhật chỉ tuyển vào một ngày duy nhất trong năm', 'Vị trí tốt hết chỗ nhanh, và cần thời gian cho CV, phỏng vấn, xác nhận FLM', 'Vì thực tập muộn sẽ bị trừ điểm tự động', 'Không có lý do, thời điểm nộp không ảnh hưởng gì'], correctIndex: 1, explanation: 'Cần đủ thời gian cho toàn bộ quy trình: tìm việc → CV/phỏng vấn → giấy xác nhận với FLM, trước khi kỳ thực tập chính thức bắt đầu.' },
]);

const p2 = doc('ojp202-2-1-cv-rirekisho-interview', 'Phase 2 — CV/rirekisho, interview & job-search skills|||Giai đoạn 2 — CV/rirekisho, phỏng vấn & kỹ năng xin việc',
  'Rirekisho (履歴書): cấu trúc chuẩn Nhật; viết cover letter/自己PR; chuẩn bị phỏng vấn (面接) — câu hỏi thường gặp, kính ngữ, tác phong.',
  [[
    `<span class="eyebrow">OJP202 · Phase 2</span>
<h2>CV/rirekisho, interview &amp; job-search skills</h2>
<h3>The rirekisho (履歴書) — Japan's standardized CV</h3>
<p>Many Japanese-affiliated companies expect a <strong>rirekisho</strong>, not a Western-style free-form CV. It follows a fixed layout: photo in the top corner, personal details, education/work history in chronological order, qualifications (JLPT etc.), and a <strong>自己PR (jiko PR, self-promotion)</strong> section.</p>
<pre><code>Rirekisho — key sections:
1. Photo (formal, plain background, recent)
2. 氏名 (name), 生年月日 (date of birth), 現住所 (address)
3. 学歴・職歴 (education & work history, chronological, no gaps left unexplained)
4. 資格・免許 (qualifications: JLPT N2, MOS, driving license, ...)
5. 自己PR (self-PR): 2-4 sentences on your strength + one concrete example
6. 志望動機 (motivation for applying): why THIS company, not a generic reason
</code></pre>
<h3>Interview (面接, mensetsu) preparation</h3>
<ul>
<li><strong>Common questions</strong> — self-introduction (自己紹介), why this company (志望動機), your strengths/weaknesses, a time you overcame a difficulty.</li>
<li><strong>Register</strong> — use polite/keigo-adjacent Japanese if the interview is conducted in Japanese; avoid casual (タメ口) speech even if the interviewer seems friendly.</li>
<li><strong>Manners that get noticed</strong> — arrive 5-10 minutes early, greet with a bow, wait to be told to sit, phone fully off (not silent).</li>
</ul>
<div class="callout"><span class="badge">Practice out loud</span> Rehearse your self-introduction and motivation answer until they come out naturally in under 60-90 seconds each — a memorized-sounding answer reads worse than a slightly imperfect but natural one.</div>`,
    `<span class="eyebrow">OJP202 · Giai đoạn 2</span>
<h2>CV/rirekisho, phỏng vấn &amp; kỹ năng xin việc</h2>
<h3>Rirekisho (履歴書) — mẫu CV chuẩn hoá của Nhật</h3>
<p>Nhiều công ty có yếu tố Nhật yêu cầu <strong>rirekisho</strong>, không phải CV tự do kiểu phương Tây. Nó theo bố cục cố định: ảnh ở góc trên, thông tin cá nhân, quá trình học tập/làm việc theo thứ tự thời gian, bằng cấp/chứng chỉ (JLPT...), và mục <strong>自己PR (jiko PR, tự giới thiệu bản thân)</strong>.</p>
<pre><code>Rirekisho — các mục chính:
1. Ảnh (nghiêm túc, nền trơn, chụp gần đây)
2. 氏名 (họ tên), 生年月日 (ngày sinh), 現住所 (địa chỉ hiện tại)
3. 学歴・職歴 (học vấn & kinh nghiệm, theo thời gian, không để khoảng trống chưa giải thích)
4. 資格・免許 (bằng cấp/chứng chỉ: JLPT N2, MOS, bằng lái, ...)
5. 自己PR (tự PR): 2-4 câu về điểm mạnh + một ví dụ cụ thể
6. 志望動機 (lý do ứng tuyển): vì sao CHÍNH công ty này, không nói chung chung
</code></pre>
<h3>Chuẩn bị phỏng vấn (面接, mensetsu)</h3>
<ul>
<li><strong>Câu hỏi thường gặp</strong> — tự giới thiệu (自己紹介), lý do ứng tuyển (志望動機), điểm mạnh/yếu, một lần bạn vượt qua khó khăn.</li>
<li><strong>Cách xưng hô</strong> — dùng tiếng Nhật lịch sự/gần kính ngữ nếu phỏng vấn bằng tiếng Nhật; tránh nói kiểu suồng sã (タメ口) dù người phỏng vấn có vẻ thân thiện.</li>
<li><strong>Phép tắc gây ấn tượng tốt</strong> — đến sớm 5-10 phút, chào bằng cúi đầu, chờ được mời mới ngồi, tắt hẳn điện thoại (không chỉ để rung).</li>
</ul>
<div class="callout"><span class="badge">Luyện nói to</span> Luyện phần tự giới thiệu và lý do ứng tuyển đến khi nói tự nhiên trong 60-90 giây mỗi phần — câu trả lời nghe như học thuộc lòng thường tệ hơn một câu chưa hoàn hảo nhưng tự nhiên.</div>`,
  ]]);

const p2q = quiz('ojp202-quiz-2', 'Quiz 2 — CV/rirekisho & interview|||Quiz 2 — CV/rirekisho & phỏng vấn', [
  { id: 'q1', question: 'Mục 自己PR (jiko PR) trong rirekisho dùng để làm gì?', options: ['Liệt kê địa chỉ và ngày sinh', 'Tự giới thiệu điểm mạnh của bản thân kèm ví dụ cụ thể', 'Ghi lịch sử học tập theo thời gian', 'Danh sách chứng chỉ đã có'], correctIndex: 1, explanation: '自己PR là phần tự PR bản thân — nêu điểm mạnh và một ví dụ cụ thể minh hoạ, khác với các mục liệt kê thông tin thuần tuý.' },
  { id: 'q2', question: 'Khi phỏng vấn bằng tiếng Nhật, nên dùng cách nói nào?', options: ['タメ口 (suồng sã) để tạo thân thiện', 'Tiếng Nhật lịch sự/gần kính ngữ, tránh suồng sã dù người phỏng vấn thân thiện', 'Trộn tiếng Việt và tiếng Nhật tuỳ thích', 'Không quan trọng cách nói, chỉ cần trả lời đúng'], correctIndex: 1, explanation: 'Giữ mức độ lịch sự phù hợp trong suốt buổi phỏng vấn, kể cả khi không khí có vẻ thoải mái, là chuẩn mực chung.' },
  { id: 'q3', question: 'Rirekisho khác CV tự do kiểu phương Tây ở điểm nào?', options: ['Rirekisho không cần thông tin học vấn', 'Rirekisho theo bố cục cố định (ảnh, thông tin cá nhân, quá trình học tập/làm việc theo thời gian, tự PR)', 'Rirekisho chỉ dùng cho công ty Việt Nam', 'Rirekisho không được viết tay hay đánh máy'], correctIndex: 1, explanation: 'Rirekisho có form chuẩn hoá cố định, khác với CV tự do có thể trình bày tuỳ ý theo phong cách phương Tây.' },
]);

const p3 = doc('ojp202-3-1-onboarding-culture', 'Phase 3 — Onboarding into Japanese company culture|||Giai đoạn 3 — Hoà nhập môi trường & văn hoá công ty Nhật',
  'Kính ngữ (敬語): tôn kính/khiêm nhường/lịch sự; 報連相 (hō-ren-sō): báo cáo-liên lạc-bàn bạc; quan hệ 先輩/後輩; nội quy giờ giấc, trang phục, chào hỏi.',
  [[
    `<span class="eyebrow">OJP202 · Phase 3</span>
<h2>Onboarding into a Japanese company's culture</h2>
<h3>Keigo (敬語) — the register you must use</h3>
<p>Japanese workplaces run on <strong>keigo</strong>, honorific/polite speech, with three layers: <strong>尊敬語 (sonkeigo)</strong> raises the person you're speaking about (customer, boss), <strong>謙譲語 (kenjōgo)</strong> lowers yourself/your side, and <strong>丁寧語 (teineigo)</strong> is the baseline polite です/ます form. As an intern you default to teineigo and learn sonkeigo/kenjōgo for common phrases (e.g. いらっしゃいます vs おります for "to be").</p>
<h3>Hō-ren-sō (報連相) — the core work habit</h3>
<pre><code>報連相 (hō-ren-sō):
  報告 hōkoku  — REPORT   progress and results, without being asked
  連絡 renraku — CONTACT  share information others need to know
  相談 sōdan   — CONSULT  ask before a small problem becomes a big one
</code></pre>
<p>Silence is read negatively in a Japanese office: staying quiet when something is unclear or delayed is a bigger fault than the delay itself. When in doubt, do hō-ren-sō.</p>
<h3>Senpai / kōhai (先輩・後輩)</h3>
<p>The senior-junior relationship structures daily interaction: greet your <strong>先輩 (senpai)</strong> first, ask them before going over their head, and expect to be corrected directly — it's mentorship, not hostility.</p>
<h3>Everyday etiquette</h3>
<ul>
<li>Arrive early, not exactly on time; greet everyone with おはようございます in the morning, お先に失礼します when leaving before others.</li>
<li>Business cards (名刺): receive with both hands, read it, place it respectfully — never pocket it immediately.</li>
<li>Dress and desk: match the office dress code; keep your desk visibly tidy — it's read as a proxy for your work discipline.</li>
</ul>
<div class="callout"><span class="badge">Week 1 goal</span> Learn the rules before you produce output. Ask your mentor directly: "何を、いつまでに、誰に報告すればいいですか" (what, by when, to whom should I report) — this one question prevents most first-week mistakes.</div>`,
    `<span class="eyebrow">OJP202 · Giai đoạn 3</span>
<h2>Hoà nhập văn hoá công ty Nhật</h2>
<h3>Kính ngữ (敬語) — cách nói bắt buộc phải dùng</h3>
<p>Công ty Nhật vận hành bằng <strong>kính ngữ</strong>, gồm ba lớp: <strong>尊敬語 (sonkeigo)</strong> nâng người mình nói tới (khách hàng, cấp trên), <strong>謙譲語 (kenjōgo)</strong> hạ thấp bản thân/phía mình, và <strong>丁寧語 (teineigo)</strong> là mức lịch sự nền です/ます. Là thực tập sinh, bạn mặc định dùng teineigo và học thêm sonkeigo/kenjōgo cho các cụm thường gặp (vd いらっしゃいます thay vì おります khi nói "có mặt").</p>
<h3>Hō-ren-sō (報連相) — thói quen làm việc cốt lõi</h3>
<pre><code>報連相 (hō-ren-sō):
  報告 hōkoku  — BÁO CÁO   tiến độ & kết quả, chủ động, không cần hỏi mới nói
  連絡 renraku — LIÊN LẠC  chia sẻ thông tin người khác cần biết
  相談 sōdan   — BÀN BẠC   hỏi trước khi vấn đề nhỏ biến thành vấn đề lớn
</code></pre>
<p>Im lặng bị nhìn nhận tiêu cực trong văn phòng Nhật: giữ im lặng khi có điều chưa rõ hoặc bị trễ tiến độ còn tệ hơn chính sự trễ đó. Khi phân vân, hãy làm hō-ren-sō.</p>
<h3>Quan hệ senpai / kōhai (先輩・後輩)</h3>
<p>Quan hệ trên-dưới định hình giao tiếp hằng ngày: chào <strong>先輩 (senpai)</strong> trước, hỏi họ trước khi vượt cấp, và sẵn sàng được sửa trực tiếp — đó là kèm cặp, không phải ác ý.</p>
<h3>Phép tắc hằng ngày</h3>
<ul>
<li>Đến sớm, không phải đúng giờ; chào おはようございます vào buổi sáng, お先に失礼します khi ra về trước người khác.</li>
<li>Danh thiếp (名刺): nhận bằng hai tay, đọc qua, đặt trang trọng — tuyệt đối không nhét túi ngay.</li>
<li>Trang phục &amp; bàn làm việc: theo đúng dress code văn phòng; giữ bàn gọn gàng — điều này được xem như thước đo kỷ luật làm việc.</li>
</ul>
<div class="callout"><span class="badge">Mục tiêu tuần 1</span> Học luật chơi trước khi tạo ra sản phẩm. Hỏi thẳng người hướng dẫn: "何を、いつまでに、誰に報告すればいいですか" (báo cáo cái gì, đến khi nào, cho ai) — chỉ một câu hỏi này ngăn được phần lớn lỗi tuần đầu.</div>`,
  ]]);

const p3q = quiz('ojp202-quiz-3', 'Quiz 3 — Company culture & hō-ren-sō|||Quiz 3 — Văn hoá công ty & hō-ren-sō', [
  { id: 'q1', question: '報連相 (hō-ren-sō) gồm ba việc nào?', options: ['Học, thi, chấm điểm', 'Báo cáo (報告), liên lạc (連絡), bàn bạc (相談)', 'Chào, cảm ơn, xin lỗi', 'Đến sớm, mặc đẹp, giữ im lặng'], correctIndex: 1, explanation: 'Hō-ren-sō = 報告 hōkoku (báo cáo) + 連絡 renraku (liên lạc) + 相談 sōdan (bàn bạc) — thói quen làm việc cốt lõi ở công ty Nhật.' },
  { id: 'q2', question: 'Trong ba lớp kính ngữ (敬語), 謙譲語 (kenjōgo) dùng để làm gì?', options: ['Nâng người khác lên', 'Hạ thấp bản thân/phía mình khi nói về hành động của mình', 'Chỉ dùng khi nói chuyện với bạn bè', 'Thay thế hoàn toàn cho 丁寧語'], correctIndex: 1, explanation: '謙譲語 (kenjōgo) là lớp khiêm nhường — hạ thấp bản thân hoặc phía mình để thể hiện sự tôn trọng người nghe.' },
  { id: 'q3', question: 'Vì sao im lặng khi gặp khó khăn/chậm tiến độ lại bị đánh giá tiêu cực trong văn phòng Nhật?', options: ['Vì công ty không cho phép nhân viên nói chuyện', 'Vì văn hoá công sở Nhật kỳ vọng chủ động báo cáo/liên lạc/bàn bạc (hō-ren-sō) thay vì im lặng chịu đựng', 'Vì im lặng là quy định pháp luật', 'Không có lý do, đây chỉ là quan niệm sai'], correctIndex: 1, explanation: 'Hō-ren-sō đòi hỏi chủ động — im lặng khi có vấn đề bị xem là lỗi lớn hơn cả bản thân vấn đề đó.' },
]);

const p4 = doc('ojp202-4-1-professional-skills-ethics', 'Phase 4 — Professional work skills & work ethics|||Giai đoạn 4 — Kỹ năng làm việc chuyên nghiệp & đạo đức nghề',
  'Quản lý thời gian & deadline, bảo mật thông tin doanh nghiệp (機密保持), thái độ trách nhiệm, chuẩn mực đạo đức nghề biên-phiên dịch.',
  [[
    `<span class="eyebrow">OJP202 · Phase 4</span>
<h2>Professional work skills &amp; work ethics</h2>
<h3>Time &amp; deadline management</h3>
<ul>
<li>Confirm deadlines in writing (email/chat), not just verbally — a written trail protects both you and your mentor.</li>
<li>If you will be late on a task, say so <strong>before</strong> the deadline, with a revised estimate — not after it has already passed.</li>
<li>Break a multi-day task into daily checkpoints so a problem surfaces on day 1, not day 5.</li>
</ul>
<h3>Confidentiality (機密保持, kimitsu hoji)</h3>
<p>You will see internal documents, client information, sometimes financial data. Most internship contracts include an NDA-equivalent clause. In practice: never post company documents/photos of the office/client names on social media, and never discuss specific client business outside the company.</p>
<h3>Professional attitude</h3>
<ul>
<li><strong>Ownership</strong> — if you don't understand an instruction, ask; don't guess and deliver something wrong.</li>
<li><strong>Reliability</strong> — do what you said you would, by when you said you would; if that changes, communicate early (this is hō-ren-sō again).</li>
<li><strong>Feedback</strong> — receive correction without defensiveness; a Japanese mentor correcting your work directly is normal, not a sign you're failing.</li>
</ul>
<h3>Ethics specific to translation/interpretation work</h3>
<pre><code>If your role touches translation/interpretation:
- Translate faithfully — do not add, omit, or soften meaning without flagging it
- Flag ambiguity instead of silently guessing ("Câu này có thể hiểu 2 cách, xin xác nhận ý ")
- Keep client/negotiation content confidential even from friends/family
- If a term is highly technical/legal, say you need to verify it rather than improvise
</code></pre>
<div class="callout"><span class="badge">The rule of thumb</span> When unsure whether something is okay to say/share/post, treat it as confidential and ask first — reversing an overshare is much harder than asking permission.</div>`,
    `<span class="eyebrow">OJP202 · Giai đoạn 4</span>
<h2>Kỹ năng làm việc chuyên nghiệp &amp; đạo đức nghề</h2>
<h3>Quản lý thời gian &amp; deadline</h3>
<ul>
<li>Xác nhận deadline bằng văn bản (email/chat), không chỉ nói miệng — có bằng chứng bảo vệ cả bạn lẫn người hướng dẫn.</li>
<li>Nếu sẽ trễ một việc, báo <strong>trước</strong> deadline kèm thời gian dự kiến mới — không phải báo sau khi đã trễ.</li>
<li>Chia nhỏ việc nhiều ngày thành các mốc kiểm tra hằng ngày để vấn đề lộ ra từ ngày 1, không phải ngày 5.</li>
</ul>
<h3>Bảo mật thông tin (機密保持, kimitsu hoji)</h3>
<p>Bạn sẽ tiếp cận tài liệu nội bộ, thông tin khách hàng, đôi khi cả số liệu tài chính. Hầu hết hợp đồng thực tập có điều khoản tương đương NDA. Thực tế: không đăng tài liệu công ty/ảnh văn phòng/tên khách hàng lên mạng xã hội, và không bàn công việc cụ thể của khách hàng ngoài công ty.</p>
<h3>Thái độ chuyên nghiệp</h3>
<ul>
<li><strong>Chủ động chịu trách nhiệm</strong> — không hiểu hướng dẫn thì hỏi; đừng đoán rồi giao sản phẩm sai.</li>
<li><strong>Đáng tin cậy</strong> — làm đúng điều đã nói, đúng thời hạn đã hứa; nếu thay đổi, báo sớm (vẫn là hō-ren-sō).</li>
<li><strong>Đón nhận góp ý</strong> — nhận sửa lỗi mà không phòng thủ; người hướng dẫn Nhật sửa trực tiếp là bình thường, không phải dấu hiệu bạn đang thất bại.</li>
</ul>
<h3>Đạo đức riêng cho công việc biên-phiên dịch</h3>
<pre><code>Nếu vị trí của bạn liên quan biên-phiên dịch:
- Dịch trung thực — không thêm, bớt, hay làm nhẹ ý nghĩa mà không nói rõ
- Nêu rõ chỗ mơ hồ thay vì tự đoán rồi im lặng ("Câu này có thể hiểu 2 cách, xin xác nhận ý ạ")
- Giữ bí mật nội dung khách hàng/đàm phán kể cả với bạn bè/gia đình
- Nếu thuật ngữ quá chuyên sâu/pháp lý, nói cần kiểm tra lại thay vì tự ứng biến
</code></pre>
<div class="callout"><span class="badge">Nguyên tắc chung</span> Khi không chắc điều gì có được nói/chia sẻ/đăng hay không, hãy coi đó là bí mật và hỏi trước — sửa việc đã lỡ chia sẻ khó hơn nhiều so với xin phép trước.</div>`,
  ]]);

const p4q = quiz('ojp202-quiz-4', 'Quiz 4 — Professional skills & ethics|||Quiz 4 — Kỹ năng chuyên nghiệp & đạo đức nghề', [
  { id: 'q1', question: 'Khi biết mình sẽ trễ deadline, nên làm gì?', options: ['Im lặng, hy vọng không ai để ý', 'Báo trước deadline, kèm thời gian dự kiến mới', 'Chỉ báo sau khi đã trễ để tránh bị hỏi trước', 'Tự ý huỷ việc mà không nói ai'], correctIndex: 1, explanation: 'Báo sớm, trước khi trễ, kèm mốc thời gian mới — đúng tinh thần hō-ren-sō và giữ uy tín.' },
  { id: 'q2', question: 'Khi dịch một câu có thể hiểu theo hai nghĩa, người thực tập nên làm gì?', options: ['Tự chọn một nghĩa và dịch luôn, không nói gì', 'Nêu rõ sự mơ hồ và xin xác nhận trước khi dịch chính thức', 'Bỏ qua câu đó', 'Dịch cả hai nghĩa cùng lúc trong một câu'], correctIndex: 1, explanation: 'Đạo đức nghề dịch yêu cầu nêu rõ chỗ mơ hồ và xác nhận, thay vì tự đoán rồi im lặng.' },
  { id: 'q3', question: 'Việc đăng ảnh văn phòng hoặc tên khách hàng lên mạng xã hội trong thời gian thực tập là?', options: ['Bình thường, miễn không nói xấu công ty', 'Vi phạm bảo mật thông tin doanh nghiệp (機密保持), cần tránh', 'Bắt buộc để chứng minh đã thực tập', 'Chỉ cấm nếu công ty yêu cầu bằng văn bản'], correctIndex: 1, explanation: 'Thông tin nội bộ và khách hàng thuộc diện bảo mật; đăng công khai lên mạng xã hội là vi phạm đạo đức nghề và thường vi phạm hợp đồng thực tập.' },
]);

const p5 = doc('ojp202-5-1-doing-the-work-nippo', 'Phase 5 — Doing the work & keeping a nippō|||Giai đoạn 5 — Thực hiện công việc & ghi nhật ký (日報)',
  'Thực hiện dịch thuật/giao tiếp tiếng Nhật hằng ngày; cấu trúc nippō (日報) chuẩn; viết nhật ký hữu ích cho báo cáo cuối kỳ.',
  [[
    `<span class="eyebrow">OJP202 · Phase 5</span>
<h2>Doing the work &amp; keeping a nippō (日報)</h2>
<h3>Everyday Japanese-language work</h3>
<p>Once onboarded, your daily work might include: translating documents/emails, joining meetings as note-taker or interpreter, answering phone calls, or supporting a Japanese colleague's tasks. Two habits carry you through: <strong>confirm before you commit</strong> (repeat back instructions in your own words) and <strong>document what you produce</strong> (keep a copy/version of every translation or note you hand in).</p>
<h3>The nippō (日報) — your daily report</h3>
<p>Most Japanese-affiliated workplaces expect a short daily report, submitted to your supervisor at the end of the day. It is also your raw material for the final report — write it well now and phase 7 becomes much easier.</p>
<pre><code>日報 (nippō) — daily report template:

日付 (date): __________  記入者 (name): __________

1. 本日の業務内容 (tasks done today)
   - ...

2. 学んだこと・気づき (what I learned / noticed)
   - ...

3. 困ったこと・質問 (difficulties / questions)
   - ...

4. 明日の予定 (plan for tomorrow)
   - ...
</code></pre>
<h3>Habits that make the nippō actually useful later</h3>
<ul>
<li>Write it the <strong>same day</strong> — memory of specifics fades fast, and vague entries ("did translation work") are useless for the final report.</li>
<li>Note <strong>numbers and names of tasks</strong>, not just categories — "translated the Q3 sales contract (12 pages)" beats "did some translation".</li>
<li>Record one genuine difficulty per week even if small — reflection sections in the final report need real material, not invented ones.</li>
</ul>
<div class="callout"><span class="badge">Keep a second copy</span> Save your own copy of every nippō outside the company system (personal notes app) — you'll need to reread weeks of them when writing the final report in Phase 7.</div>`,
    `<span class="eyebrow">OJP202 · Giai đoạn 5</span>
<h2>Thực hiện công việc &amp; ghi nhật báo (日報)</h2>
<h3>Công việc tiếng Nhật hằng ngày</h3>
<p>Sau khi hoà nhập, công việc hằng ngày của bạn có thể gồm: dịch tài liệu/email, tham gia họp với vai trò ghi chú hoặc phiên dịch, trả lời điện thoại, hoặc hỗ trợ công việc của đồng nghiệp người Nhật. Hai thói quen giúp bạn đi đường dài: <strong>xác nhận trước khi bắt tay làm</strong> (nhắc lại hướng dẫn bằng lời của mình) và <strong>lưu lại sản phẩm đã làm</strong> (giữ bản sao/phiên bản của mỗi bản dịch hay ghi chú đã nộp).</p>
<h3>Nippō (日報) — nhật báo của bạn</h3>
<p>Hầu hết môi trường có yếu tố Nhật yêu cầu một bản báo cáo ngắn cuối ngày, nộp cho người hướng dẫn. Đây cũng là nguyên liệu thô cho báo cáo cuối kỳ — viết tốt ngay từ bây giờ sẽ khiến giai đoạn 7 dễ hơn nhiều.</p>
<pre><code>日報 (nippō) — mẫu nhật báo:

日付 (ngày): __________  記入者 (người ghi): __________

1. 本日の業務内容 (công việc hôm nay)
   - ...

2. 学んだこと・気づき (điều học được / nhận ra)
   - ...

3. 困ったこと・質問 (khó khăn / câu hỏi)
   - ...

4. 明日の予定 (kế hoạch ngày mai)
   - ...
</code></pre>
<h3>Thói quen giúp nhật báo thật sự hữu ích về sau</h3>
<ul>
<li>Viết ngay <strong>trong ngày</strong> — chi tiết dễ quên nhanh, và ghi chung chung ("làm việc dịch thuật") sẽ vô dụng khi viết báo cáo cuối kỳ.</li>
<li>Ghi <strong>số liệu và tên công việc cụ thể</strong>, không chỉ nhóm chung chung — "dịch hợp đồng bán hàng quý 3 (12 trang)" tốt hơn "làm ít việc dịch".</li>
<li>Mỗi tuần ghi ít nhất một khó khăn thật, dù nhỏ — phần tự đánh giá trong báo cáo cuối kỳ cần chất liệu thật, không phải bịa ra.</li>
</ul>
<div class="callout"><span class="badge">Giữ thêm một bản sao</span> Lưu bản sao mỗi nhật báo bên ngoài hệ thống công ty (ứng dụng ghi chú cá nhân) — bạn sẽ cần đọc lại nhiều tuần nhật báo khi viết báo cáo cuối kỳ ở Giai đoạn 7.</div>`,
  ]]);

const p5q = quiz('ojp202-quiz-5', 'Quiz 5 — Doing the work & nippō|||Quiz 5 — Thực hiện công việc & nhật báo', [
  { id: 'q1', question: 'Nippō (日報) nên được viết vào thời điểm nào?', options: ['Cuối kỳ thực tập, gộp lại một lần', 'Trong ngày, ngay khi công việc còn mới trong trí nhớ', 'Chỉ khi người hướng dẫn nhắc', 'Một tuần viết một lần là đủ'], correctIndex: 1, explanation: 'Viết cùng ngày giúp ghi chi tiết chính xác; để lâu dễ quên và nhật báo trở nên chung chung, vô dụng.' },
  { id: 'q2', question: 'Ghi nào sau đây trong nhật báo HỮU ÍCH hơn cho báo cáo cuối kỳ?', options: ['"Hôm nay làm việc dịch thuật"', '"Dịch hợp đồng bán hàng quý 3 (12 trang), phát hiện một điều khoản mơ hồ, đã hỏi xác nhận"', '"Không có gì đặc biệt"', '"Đi làm cả ngày"'], correctIndex: 1, explanation: 'Ghi cụ thể tên việc, số liệu và tình huống thật sẽ là chất liệu tốt cho phần tự đánh giá trong báo cáo cuối kỳ.' },
  { id: 'q3', question: 'Vì sao nên giữ một bản sao nhật báo bên ngoài hệ thống của công ty?', options: ['Vì hệ thống công ty không cho xem lại', 'Vì cần đọc lại nhiều tuần nhật báo khi viết báo cáo cuối kỳ', 'Vì công ty yêu cầu nộp hai bản', 'Không cần thiết, chỉ cần bản trên hệ thống công ty'], correctIndex: 1, explanation: 'Bản sao cá nhân giúp bạn tổng hợp lại toàn bộ quá trình khi viết báo cáo cuối kỳ, kể cả khi không còn quyền truy cập hệ thống công ty.' },
]);

const p6 = doc('ojp202-6-1-teamwork-situations', 'Phase 6 — Communication, teamwork & handling workplace situations|||Giai đoạn 6 — Giao tiếp, làm việc nhóm & xử lý tình huống công sở',
  'Giao tiếp hiệu quả với đồng nghiệp Nhật/Việt, xử lý hiểu lầm văn hoá, nhận và phản hồi góp ý, làm việc nhóm liên phòng ban.',
  [[
    `<span class="eyebrow">OJP202 · Phase 6</span>
<h2>Communication, teamwork &amp; handling workplace situations</h2>
<h3>Bridging Vietnamese and Japanese staff</h3>
<p>As a Japanese-speaking intern you often sit between two working cultures. Vietnamese colleagues may communicate more directly/informally; Japanese colleagues may expect more formality and indirect phrasing (e.g. "検討します" — "we will consider it" — often means "no" more than "maybe"). Learn to read both registers rather than assuming your home culture's directness translates cleanly.</p>
<h3>Handling a cultural misunderstanding</h3>
<pre><code>When something feels "off" or a message seems unclear:
1. Don't assume malice — assume a language/culture gap first
2. Ask a clarifying, low-stakes question rather than guessing
3. If it recurs, raise it privately with your mentor, not in a group chat
4. Document what happened factually in your nippō (for your own record)
</code></pre>
<h3>Receiving and giving feedback</h3>
<ul>
<li><strong>Receiving</strong> — take notes while being corrected instead of only listening; say どうもありがとうございます, apply the correction next time without being asked twice.</li>
<li><strong>Giving</strong> (if you're asked for input) — frame it constructively; in a Japanese context, suggestions are often phrased as questions ("〜はどうでしょうか?" — "how about...?") rather than direct commands.</li>
</ul>
<h3>Cross-department teamwork</h3>
<p>A translation/coordination role often means you work with 2-3 departments in one week. Keep a simple habit: confirm the requester, the deadline, and the exact deliverable format <em>before</em> starting, in writing — most cross-team friction comes from an unstated assumption, not from actual disagreement.</p>
<div class="callout"><span class="badge">One phrase that saves you</span> "確認させてください" (kakunin sasete kudasai — "please let me confirm") is the single most useful sentence for an intern: it buys time, prevents wrong guesses, and is always seen as professional, never as weak.</div>`,
    `<span class="eyebrow">OJP202 · Giai đoạn 6</span>
<h2>Giao tiếp, làm việc nhóm &amp; xử lý tình huống công sở</h2>
<h3>Làm cầu nối giữa nhân viên Việt và Nhật</h3>
<p>Là thực tập sinh dùng tiếng Nhật, bạn thường đứng giữa hai văn hoá làm việc. Đồng nghiệp Việt có thể giao tiếp trực tiếp/thoải mái hơn; đồng nghiệp Nhật có thể cần sự trang trọng và cách nói gián tiếp hơn (vd "検討します" — "chúng tôi sẽ xem xét" — thường nghiêng về nghĩa "không" hơn là "có thể"). Học cách đọc cả hai cách nói, thay vì mặc định sự trực tiếp quen thuộc của mình dịch thẳng sang được.</p>
<h3>Xử lý hiểu lầm văn hoá</h3>
<pre><code>Khi có điều gì đó "không ổn" hoặc một tin nhắn khó hiểu:
1. Đừng vội nghĩ ác ý — trước tiên nghĩ đến khoảng cách ngôn ngữ/văn hoá
2. Hỏi lại để làm rõ, câu hỏi nhẹ nhàng, thay vì tự đoán
3. Nếu lặp lại nhiều lần, trao đổi riêng với người hướng dẫn, không nói trong nhóm chung
4. Ghi lại sự việc khách quan trong nhật báo (để làm tư liệu riêng)
</code></pre>
<h3>Nhận và đưa ra phản hồi</h3>
<ul>
<li><strong>Khi nhận góp ý</strong> — ghi chú lại khi đang được sửa thay vì chỉ nghe; nói どうもありがとうございます, áp dụng điều được sửa ngay lần sau mà không cần nhắc lại lần hai.</li>
<li><strong>Khi đưa ra ý kiến</strong> (nếu được hỏi) — trình bày mang tính xây dựng; trong bối cảnh Nhật, đề xuất thường được diễn đạt dưới dạng câu hỏi ("〜はどうでしょうか?" — "bạn nghĩ sao về...?") thay vì mệnh lệnh trực tiếp.</li>
</ul>
<h3>Làm việc nhóm liên phòng ban</h3>
<p>Vai trò dịch thuật/điều phối thường có nghĩa bạn làm việc với 2-3 phòng ban trong một tuần. Giữ một thói quen đơn giản: xác nhận người yêu cầu, deadline, và định dạng sản phẩm chính xác <em>trước khi</em> bắt đầu, bằng văn bản — phần lớn xích mích liên phòng ban đến từ giả định không nói ra, chứ không phải bất đồng thật sự.</p>
<div class="callout"><span class="badge">Một câu cứu bạn</span> "確認させてください" (kakunin sasete kudasai — "cho tôi xác nhận lại") là câu hữu ích nhất với một thực tập sinh: nó cho bạn thêm thời gian, tránh đoán sai, và luôn được nhìn nhận là chuyên nghiệp chứ không phải yếu kém.</div>`,
  ]]);

const p6q = quiz('ojp202-quiz-6', 'Quiz 6 — Teamwork & workplace situations|||Quiz 6 — Làm việc nhóm & tình huống công sở', [
  { id: 'q1', question: 'Câu tiếng Nhật "検討します" trong bối cảnh công việc thường nghiêng về nghĩa nào?', options: ['Đồng ý ngay lập tức', 'Thường nghiêng về "không" hơn là "có thể", dù nghĩa đen là "sẽ xem xét"', 'Yêu cầu gặp mặt trực tiếp', 'Không liên quan gì đến công việc'], correctIndex: 1, explanation: 'Đây là cách nói gián tiếp điển hình trong văn hoá công sở Nhật — cần đọc hiểu ngữ cảnh, không chỉ dịch nghĩa đen.' },
  { id: 'q2', question: 'Khi gặp một tin nhắn/hành động khó hiểu từ đồng nghiệp khác văn hoá, bước đầu tiên nên làm gì?', options: ['Kết luận ngay là họ có ác ý', 'Giả định trước tiên là khoảng cách ngôn ngữ/văn hoá, rồi hỏi lại để làm rõ', 'Phớt lờ và không phản hồi', 'Đăng lên nhóm chat chung để mọi người phán xét'], correctIndex: 1, explanation: 'Nên giả định gap ngôn ngữ/văn hoá trước, hỏi lại nhẹ nhàng để làm rõ thay vì suy diễn tiêu cực.' },
  { id: 'q3', question: 'Câu "確認させてください" (kakunin sasete kudasai) hữu ích với thực tập sinh vì sao?', options: ['Nó có nghĩa là từ chối công việc', 'Nó cho phép xác nhận lại thông tin, tránh đoán sai, và được xem là chuyên nghiệp', 'Nó chỉ dùng khi kết thúc buổi họp', 'Nó thay thế hoàn toàn cho việc báo cáo'], correctIndex: 1, explanation: '"Cho tôi xác nhận lại" là cách xin thêm thời gian và làm rõ thông tin một cách chuyên nghiệp, tránh hiểu sai rồi làm sai.' },
]);

const p7 = doc('ojp202-7-1-final-report', 'Phase 7 — Writing the internship final report|||Giai đoạn 7 — Viết báo cáo thực tập',
  'Cấu trúc báo cáo cuối kỳ theo mẫu FLM; biến nhật báo thành nội dung báo cáo; viết phần tự đánh giá trung thực; trình bày rõ ràng, đúng thể thức.',
  [[
    `<span class="eyebrow">OJP202 · Phase 7</span>
<h2>Writing the internship final report</h2>
<h3>Typical structure (follow your FLM template exactly)</h3>
<pre><code>1. Cover page (student info, company, supervisor, dates)
2. Acknowledgement (lời cảm ơn)
3. Company overview (business, size, department you worked in)
4. Your role & assigned tasks (be specific, with a timeline)
5. Skills applied & developed (Japanese language, professional, technical)
6. Difficulties encountered & how you resolved them
7. Self-evaluation (honest, tied to the rubric criteria)
8. Conclusion & career direction
9. Appendix (sample translated documents if permitted, nippō excerpts)
</code></pre>
<h3>From nippō to report content</h3>
<p>Reread your nippō chronologically and group entries by theme (e.g. "translation tasks", "meeting support", "difficulties with keigo") rather than retelling every single day — a report is a <strong>synthesis</strong>, not a diary copy-paste.</p>
<h3>Writing an honest, useful self-evaluation</h3>
<ul>
<li>Name a real difficulty and what specifically fixed it — "at first I struggled with sonkeigo on phone calls; my mentor gave me a phrase list, and by week 4 I used it without checking" reads far better than "I learned a lot".</li>
<li>Connect your experience to what you'll do differently in your career (this feeds directly into Phase 8).</li>
<li>Never claim confidential company data as evidence — if you need a concrete result, ask your supervisor what you're allowed to disclose.</li>
</ul>
<h3>Presentation quality checklist</h3>
<pre><code>[ ] Follows the exact FLM section order and formatting rules
[ ] Consistent terminology (don't switch between "công ty A" and the real name randomly)
[ ] All Japanese terms have Vietnamese/English gloss on first use
[ ] Proofread for typos — a report full of typos undercuts a strong internship
[ ] Submitted with the required signatures/company stamp, on time
</code></pre>
<div class="callout"><span class="badge">Start early</span> Draft the report while the internship is still running — memory fades, and a rushed report the night before the deadline reads exactly like what it is.</div>`,
    `<span class="eyebrow">OJP202 · Giai đoạn 7</span>
<h2>Viết báo cáo thực tập</h2>
<h3>Cấu trúc thường gặp (bám sát mẫu FLM của bạn)</h3>
<pre><code>1. Trang bìa (thông tin sinh viên, công ty, người hướng dẫn, thời gian)
2. Lời cảm ơn
3. Giới thiệu doanh nghiệp (lĩnh vực, quy mô, phòng ban bạn làm việc)
4. Vị trí &amp; công việc được giao (cụ thể, có mốc thời gian)
5. Kỹ năng đã áp dụng &amp; phát triển (tiếng Nhật, chuyên nghiệp, kỹ thuật)
6. Khó khăn gặp phải &amp; cách giải quyết
7. Tự đánh giá (trung thực, bám theo tiêu chí rubric)
8. Kết luận &amp; định hướng nghề nghiệp
9. Phụ lục (mẫu tài liệu đã dịch nếu được phép, trích đoạn nhật báo)
</code></pre>
<h3>Biến nhật báo thành nội dung báo cáo</h3>
<p>Đọc lại nhật báo theo thời gian và nhóm các mục theo chủ đề (vd "công việc dịch thuật", "hỗ trợ họp", "khó khăn với kính ngữ") thay vì kể lại từng ngày một — báo cáo là bản <strong>tổng hợp</strong>, không phải copy-paste nhật ký.</p>
<h3>Viết phần tự đánh giá trung thực, hữu ích</h3>
<ul>
<li>Nêu một khó khăn thật và điều cụ thể đã giúp khắc phục nó — "ban đầu tôi gặp khó với kính ngữ khi nghe điện thoại; người hướng dẫn đưa cho tôi danh sách mẫu câu, đến tuần 4 tôi dùng được mà không cần tra lại" hay hơn nhiều so với "tôi học được nhiều điều".</li>
<li>Kết nối trải nghiệm thực tập với điều bạn sẽ làm khác đi trong sự nghiệp (nội dung này dẫn thẳng sang Giai đoạn 8).</li>
<li>Không dùng dữ liệu bảo mật của công ty làm bằng chứng — nếu cần một kết quả cụ thể, hỏi người hướng dẫn được phép tiết lộ đến đâu.</li>
</ul>
<h3>Checklist chất lượng trình bày</h3>
<pre><code>[ ] Đúng thứ tự mục &amp; thể thức theo đúng mẫu FLM
[ ] Thuật ngữ nhất quán (không đổi qua lại giữa "công ty A" và tên thật tuỳ ý)
[ ] Mọi thuật ngữ tiếng Nhật có chú thích tiếng Việt/Anh ở lần dùng đầu
[ ] Đã đọc soát lỗi chính tả — báo cáo nhiều lỗi làm giảm giá trị một kỳ thực tập tốt
[ ] Nộp kèm đủ chữ ký/con dấu công ty yêu cầu, đúng hạn
</code></pre>
<div class="callout"><span class="badge">Bắt đầu sớm</span> Soạn báo cáo ngay khi kỳ thực tập còn đang diễn ra — trí nhớ phai nhanh, và một báo cáo viết vội đêm trước hạn nộp đọc lên sẽ lộ rõ điều đó.</div>`,
  ]]);

const p7q = quiz('ojp202-quiz-7', 'Quiz 7 — Writing the final report|||Quiz 7 — Viết báo cáo thực tập', [
  { id: 'q1', question: 'Cách tốt nhất để biến nhật báo thành nội dung báo cáo cuối kỳ là gì?', options: ['Copy-paste toàn bộ nhật báo từng ngày vào báo cáo', 'Đọc lại và nhóm theo chủ đề để tổng hợp thành nội dung mạch lạc', 'Bỏ qua nhật báo, viết báo cáo hoàn toàn từ trí nhớ', 'Chỉ dùng nhật báo của tuần cuối cùng'], correctIndex: 1, explanation: 'Báo cáo là bản tổng hợp theo chủ đề, không phải sao chép nhật ký từng ngày.' },
  { id: 'q2', question: 'Câu tự đánh giá nào trong báo cáo được xem là TỐT hơn?', options: ['"Tôi học được nhiều điều trong kỳ thực tập"', '"Ban đầu tôi gặp khó với kính ngữ khi nghe điện thoại; nhờ danh sách mẫu câu từ người hướng dẫn, đến tuần 4 tôi dùng thành thạo"', '"Kỳ thực tập diễn ra bình thường"', '"Tôi không gặp khó khăn gì"'], correctIndex: 1, explanation: 'Tự đánh giá tốt nêu khó khăn cụ thể và cách khắc phục cụ thể, thay vì phát biểu chung chung.' },
  { id: 'q3', question: 'Khi cần một kết quả cụ thể làm bằng chứng nhưng đó là dữ liệu nhạy cảm của công ty, nên làm gì?', options: ['Cứ đưa vào báo cáo, vì báo cáo chỉ giảng viên đọc', 'Hỏi người hướng dẫn xem được phép tiết lộ đến đâu trước khi đưa vào báo cáo', 'Bịa ra một con số gần đúng', 'Không đề cập gì đến kết quả công việc'], correctIndex: 1, explanation: 'Cần tôn trọng bảo mật doanh nghiệp — xác nhận phạm vi được phép tiết lộ trước khi đưa dữ liệu vào báo cáo.' },
]);

const p8 = doc('ojp202-8-1-evaluation-defense-career', 'Phase 8 — Evaluation, defense & Japanese-language career direction|||Giai đoạn 8 — Đánh giá, bảo vệ & định hướng nghề nghiệp tiếng Nhật',
  'Chuẩn bị bảo vệ báo cáo trước hội đồng, phiếu đánh giá doanh nghiệp, phản hồi câu hỏi, định hướng nghề nghiệp tiếp theo dùng tiếng Nhật.',
  [[
    `<span class="eyebrow">OJP202 · Phase 8</span>
<h2>Evaluation, defense &amp; career direction</h2>
<h3>The company evaluation form</h3>
<p>Your supervisor completes a form scoring attitude, skills, punctuality and output — this typically carries the largest single weight in your grade. Ask, respectfully, near the end of the internship what your mentor plans to note, so nothing on the form surprises you and you can address any gap before it's finalized.</p>
<h3>Preparing the defense</h3>
<pre><code>Defense prep checklist:
[ ] Slide deck: 8-12 slides, one idea per slide, visuals over walls of text
[ ] Rehearse out loud at least twice, timed to the limit you're given
[ ] Prepare answers to obvious questions: "What was your biggest difficulty?",
    "What would you do differently?", "How did this change your career plan?"
[ ] Know your own report well enough to answer WITHOUT reading slides
[ ] Bring a notebook — panels sometimes give feedback worth writing down
</code></pre>
<h3>Handling panel questions</h3>
<p>If asked something you don't know, don't bluff — "That's a great question, I didn't track that specific number, but here's what I observed..." is a stronger answer than an invented statistic (see the Known Error Patterns lesson on this course's home repo about never fabricating numbers — the same discipline applies to your own defense).</p>
<h3>From internship to career direction</h3>
<ul>
<li><strong>If you enjoyed it</strong> — ask your supervisor about post-graduation openings; many Japanese-affiliated companies hire strong interns directly.</li>
<li><strong>If it clarified what you don't want</strong> — that's a valid, valuable outcome too; use the self-evaluation to be specific about why, so your next search is better targeted.</li>
<li><strong>Either way</strong> — add the internship, concretely, to your rirekisho/CV: company name, duration, real tasks, and one measurable outcome if you're allowed to disclose it.</li>
</ul>
<div class="callout"><span class="badge">Close the loop</span> Send a short thank-you message (お世話になりました) to your supervisor after the defense — it costs two minutes and is often what turns an internship into a reference or a job offer later.</div>`,
    `<span class="eyebrow">OJP202 · Giai đoạn 8</span>
<h2>Đánh giá, bảo vệ &amp; định hướng nghề nghiệp</h2>
<h3>Phiếu đánh giá của doanh nghiệp</h3>
<p>Người hướng dẫn của bạn điền phiếu chấm thái độ, kỹ năng, đúng giờ và sản phẩm — đây thường là tỉ trọng lớn nhất trong điểm số. Gần cuối kỳ thực tập, hỏi lịch sự về những gì người hướng dẫn dự định ghi nhận, để không mục nào trên phiếu làm bạn bất ngờ, và bạn còn kịp cải thiện trước khi phiếu được chốt.</p>
<h3>Chuẩn bị buổi bảo vệ</h3>
<pre><code>Checklist chuẩn bị bảo vệ:
[ ] Slide: 8-12 slide, mỗi slide một ý, ưu tiên hình ảnh hơn chữ dày đặc
[ ] Luyện nói to ít nhất hai lần, tính giờ đúng thời lượng được quy định
[ ] Chuẩn bị trả lời các câu hỏi thường gặp: "Khó khăn lớn nhất là gì?",
    "Bạn sẽ làm khác đi điều gì?", "Điều này thay đổi định hướng nghề nghiệp ra sao?"
[ ] Hiểu rõ báo cáo của chính mình đủ để trả lời KHÔNG cần đọc slide
[ ] Mang theo sổ tay — hội đồng đôi khi góp ý đáng ghi lại
</code></pre>
<h3>Xử lý câu hỏi của hội đồng</h3>
<p>Nếu bị hỏi điều mình không biết, đừng bịa — "Đây là câu hỏi hay, em chưa theo dõi con số cụ thể đó, nhưng em quan sát được rằng..." là câu trả lời tốt hơn nhiều so với một con số bịa ra (đúng nguyên tắc chung: không bao giờ bịa số liệu — kỷ luật này áp dụng cả cho buổi bảo vệ của chính bạn).</p>
<h3>Từ thực tập đến định hướng nghề nghiệp</h3>
<ul>
<li><strong>Nếu bạn thích công việc này</strong> — hỏi người hướng dẫn về cơ hội sau tốt nghiệp; nhiều công ty có yếu tố Nhật tuyển thẳng thực tập sinh giỏi.</li>
<li><strong>Nếu kỳ thực tập giúp bạn nhận ra điều mình KHÔNG muốn</strong> — đó cũng là kết quả có giá trị; dùng phần tự đánh giá để nói rõ vì sao, giúp lần tìm việc tiếp theo nhắm đúng hơn.</li>
<li><strong>Dù kết quả thế nào</strong> — đưa kỳ thực tập này vào rirekisho/CV một cách cụ thể: tên công ty, thời gian, công việc thật, và một kết quả đo được nếu được phép tiết lộ.</li>
</ul>
<div class="callout"><span class="badge">Khép lại đúng cách</span> Gửi một lời cảm ơn ngắn (お世話になりました) đến người hướng dẫn sau buổi bảo vệ — chỉ mất hai phút, nhưng thường chính là điều biến một kỳ thực tập thành một thư giới thiệu hoặc lời mời làm việc sau này.</div>`,
  ]]);

const p8q = quiz('ojp202-quiz-8', 'Quiz 8 — Evaluation, defense & career|||Quiz 8 — Đánh giá, bảo vệ & định hướng nghề nghiệp', [
  { id: 'q1', question: 'Trong cơ cấu điểm OJT, phiếu đánh giá của doanh nghiệp thường có vai trò gì?', options: ['Không ảnh hưởng đến điểm số', 'Thường chiếm tỉ trọng lớn nhất trong điểm số cuối cùng', 'Chỉ mang tính tham khảo, không tính điểm', 'Chỉ áp dụng nếu sinh viên yêu cầu'], correctIndex: 1, explanation: 'Đánh giá của người hướng dẫn tại doanh nghiệp thường là phần có tỉ trọng lớn nhất trong rubric chấm OJT.' },
  { id: 'q2', question: 'Khi hội đồng bảo vệ hỏi một điều bạn không nắm rõ số liệu chính xác, nên trả lời thế nào?', options: ['Bịa ra một con số nghe hợp lý', 'Thừa nhận chưa theo dõi số liệu đó, nêu điều mình thực sự quan sát được', 'Im lặng không trả lời', 'Đổi sang câu hỏi khác'], correctIndex: 1, explanation: 'Trung thực về giới hạn thông tin, kèm quan sát thực tế, đáng tin hơn nhiều so với việc bịa số liệu.' },
  { id: 'q3', question: 'Nếu kỳ thực tập giúp sinh viên nhận ra đây KHÔNG phải hướng nghề nghiệp mình muốn, điều đó có ý nghĩa gì?', options: ['Là một kỳ thực tập thất bại hoàn toàn', 'Vẫn là một kết quả có giá trị, giúp định hướng tìm việc tiếp theo chính xác hơn', 'Không nên viết vào báo cáo tự đánh giá', 'Có nghĩa là sinh viên không đạt môn'], correctIndex: 1, explanation: 'Nhận ra hướng không phù hợp cũng là một kết quả học tập có giá trị, nên được phản ánh trung thực trong tự đánh giá.' },
]);

export default {
  semester: { code: 'FPTU_Hola6', name: 'Kỳ 6 — Thực tập', ordinal: 8 },
  course: {
    courseCode: 'OJP202',
    slug: 'ojp202-on-the-job-training',
    title: 'On-The-Job-Training',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/OJP202.webp',
    shortDescription: 'OJT for Japanese Language majors — 8 phases: finding a position, CV/rirekisho & interview, company culture (keigo, hō-ren-sō), work ethics, daily tasks & nippō, teamwork, final report, evaluation & career direction.|||Thực tập ngành Ngôn ngữ Nhật — 8 giai đoạn: tìm việc, CV/rirekisho & phỏng vấn, văn hoá công ty (kính ngữ, hō-ren-sō), đạo đức nghề, làm việc & nhật báo, làm việc nhóm, báo cáo, đánh giá & định hướng nghề nghiệp.',
    description: 'Môn <strong>OJP202 — On-the-Job Training</strong> (kỳ 6) là kỳ <strong>thực tập doanh nghiệp</strong> của ngành Ngôn ngữ Nhật, hướng đến các vị trí có dùng tiếng Nhật (biên-phiên dịch, trợ lý, nhân viên công ty Nhật). Khung 8 giai đoạn theo đúng trình tự một kỳ thực tập thật: <strong>chuẩn bị &amp; tìm việc</strong> → <strong>CV/rirekisho &amp; phỏng vấn</strong> → <strong>hoà nhập văn hoá công ty</strong> (kính ngữ, 報連相 hō-ren-sō, senpai/kōhai) → <strong>kỹ năng chuyên nghiệp &amp; đạo đức nghề</strong> → <strong>thực hiện công việc &amp; ghi nhật báo</strong> (日報) → <strong>giao tiếp &amp; làm việc nhóm</strong> → <strong>viết báo cáo cuối kỳ</strong> → <strong>đánh giá, bảo vệ &amp; định hướng nghề nghiệp</strong>. Song ngữ, có thuật ngữ tiếng Nhật, mẫu nhật ký/checklist thực tế, quiz mỗi giai đoạn.',
    whatYouLearn: 'Tìm & đánh giá vị trí thực tập dùng tiếng Nhật; viết rirekisho (履歴書) & trả lời phỏng vấn (面接) bằng tiếng Nhật lịch sự; kính ngữ (敬語: tôn kính/khiêm nhường/lịch sự) & thói quen hō-ren-sō (報連相); quan hệ senpai/kōhai; quản lý deadline, bảo mật thông tin (機密保持) & đạo đức nghề biên-phiên dịch; viết nhật báo (日報) hằng ngày; xử lý hiểu lầm văn hoá & làm việc nhóm liên phòng ban; cấu trúc báo cáo thực tập chuẩn FLM; chuẩn bị bảo vệ & định hướng nghề nghiệp tiếng Nhật sau thực tập.',
    requirements: 'Đã hoàn thành các môn tiếng Nhật & chuyên ngành theo điều kiện tiên quyết của FLM cho học kỳ thực tập; có công ty/vị trí thực tập được FLM xác nhận. Xem quy định thực tập chính thức và điều kiện tiên quyết trên FLM (flm.fpt.edu.vn).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Quy định thực tập FLM, LinkedIn Learning, mẫu rirekisho/nhật báo, văn hoá công sở Nhật Bản.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'OJT là gì, deliverable, rubric đánh giá, lộ trình 8 giai đoạn.', lessons: [gioiThieu] },
    { title: 'Giai đoạn 1 — Chuẩn bị & tìm việc|||Phase 1 — Preparation & finding a position', description: 'Tự đánh giá, kênh tìm việc, đọc tin tuyển dụng.', lessons: [p1, p1q] },
    { title: 'Giai đoạn 2 — CV/rirekisho & phỏng vấn|||Phase 2 — CV/rirekisho & interview', description: 'Rirekisho 履歴書, tự PR, phỏng vấn 面接.', lessons: [p2, p2q] },
    { title: 'Giai đoạn 3 — Hoà nhập văn hoá công ty|||Phase 3 — Company culture onboarding', description: 'Kính ngữ, hō-ren-sō, senpai/kōhai, phép tắc.', lessons: [p3, p3q] },
    { title: 'Giai đoạn 4 — Kỹ năng chuyên nghiệp & đạo đức nghề|||Phase 4 — Professional skills & ethics', description: 'Quản lý thời gian, bảo mật, đạo đức nghề dịch.', lessons: [p4, p4q] },
    { title: 'Giai đoạn 5 — Thực hiện công việc & nhật báo|||Phase 5 — Doing the work & nippō', description: 'Công việc hằng ngày, mẫu nippō 日報.', lessons: [p5, p5q] },
    { title: 'Giai đoạn 6 — Giao tiếp & làm việc nhóm|||Phase 6 — Communication & teamwork', description: 'Xử lý hiểu lầm văn hoá, phản hồi, liên phòng ban.', lessons: [p6, p6q] },
    { title: 'Giai đoạn 7 — Viết báo cáo thực tập|||Phase 7 — Writing the final report', description: 'Cấu trúc báo cáo, biến nhật báo thành nội dung, tự đánh giá.', lessons: [p7, p7q] },
    { title: 'Giai đoạn 8 — Đánh giá, bảo vệ & định hướng nghề nghiệp|||Phase 8 — Evaluation, defense & career direction', description: 'Phiếu đánh giá, chuẩn bị bảo vệ, định hướng nghề nghiệp.', lessons: [p8, p8q] },
  ],
};
