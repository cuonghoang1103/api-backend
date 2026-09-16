/**
 * OJK202 — On-the-Job Training. Thực tập doanh nghiệp, ngành Ngôn ngữ Hàn, Kỳ 6.
 * Đây là môn THỰC TẬP: khung theo 8 GIAI ĐOẠN của kỳ thực tập, không phải chương
 * lý thuyết. Song ngữ + thuật ngữ tiếng Hàn (Hangeul + romaja) + quiz mỗi giai đoạn.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức giai đoạn.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('ojk202-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: quy định thực tập FLM, LinkedIn Learning, trang tìm việc/TOPIK tiếng Hàn, mẫu CV/nhật ký/báo cáo.',
  [[
    `<span class="eyebrow">OJK202 · Materials</span>
<h2>On-the-Job Training — resource hub</h2>
<p class="lead">Everything for a successful Korean-language internship — from finding a position to writing your final report — in one place. Official FPTU internship regulations live on <strong>FLM</strong>; below are free resources for job search, workplace Korean and professional skills.</p>
<h3>📘 Official internship regulations</h3>
<p>Read your faculty OJT handbook and evaluation rubric on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account. It defines the deliverables (journal, report, company evaluation) and deadlines for your cohort.</p>
<h3>🎓 LinkedIn Learning</h3>
<ul>
<li><a href="https://www.linkedin.com/learning/" target="_blank" rel="noopener">LinkedIn Learning</a> — search "resume writing", "business etiquette", "workplace communication" (FPTU students often get free access via the university library — check with your librarian).</li>
</ul>
<h3>🌐 Korean job search &amp; language</h3>
<ul>
<li><a href="https://www.saramin.co.kr/" target="_blank" rel="noopener">Saramin (사람인)</a> and <a href="https://www.jobkorea.co.kr/" target="_blank" rel="noopener">JobKorea (잡코리아)</a> — the two largest Korean job boards, useful to see what Korean-speaking positions actually ask for.</li>
<li><a href="https://www.topik.go.kr/" target="_blank" rel="noopener">TOPIK (한국어능력시험)</a> — the official Korean proficiency test; many Korean-company postings list a minimum TOPIK level (e.g. TOPIK 4+).</li>
<li><a href="https://www.linkedin.com/" target="_blank" rel="noopener">LinkedIn</a> — build a profile in Korean and Vietnamese/English before you start applying.</li>
</ul>
<h3>🛠️ Templates you will need</h3>
<ul>
<li>Bilingual résumé (이력서) &amp; cover letter (자기소개서) template — see Stage 2.</li>
<li>Daily journal (일지) template — see Stage 5.</li>
<li>Final report outline — see Stage 7.</li>
</ul>
<div class="callout"><span class="badge">No PDF uploads</span> This course does not host the official FPTU forms as downloadable PDFs — always get the current version from FLM, since forms change between semesters.</div>`,
    `<span class="eyebrow">OJK202 · Tài liệu</span>
<h2>Trung tâm tài liệu thực tập</h2>
<p class="lead">Mọi thứ để có một kỳ thực tập tiếng Hàn thành công — từ tìm vị trí đến viết báo cáo cuối kỳ — gom về một chỗ. Quy định thực tập chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí cho tìm việc, tiếng Hàn công sở và kỹ năng nghề nghiệp.</p>
<h3>📘 Quy định thực tập chính thức</h3>
<p>Đọc sổ tay OJT và rubric chấm điểm của khoa trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU. Nơi đây quy định rõ các sản phẩm cần nộp (nhật ký, báo cáo, phiếu đánh giá doanh nghiệp) và hạn nộp theo khoá.</p>
<h3>🎓 LinkedIn Learning</h3>
<ul>
<li><a href="https://www.linkedin.com/learning/" target="_blank" rel="noopener">LinkedIn Learning</a> — tìm khoá "resume writing", "business etiquette", "workplace communication" (sinh viên FPTU thường được cấp quyền truy cập miễn phí qua thư viện trường — hỏi thủ thư).</li>
</ul>
<h3>🌐 Tìm việc &amp; tiếng Hàn</h3>
<ul>
<li><a href="https://www.saramin.co.kr/" target="_blank" rel="noopener">Saramin (사람인)</a> và <a href="https://www.jobkorea.co.kr/" target="_blank" rel="noopener">JobKorea (잡코리아)</a> — hai trang tuyển dụng lớn nhất Hàn Quốc, xem thử vị trí dùng tiếng Hàn yêu cầu gì thật.</li>
<li><a href="https://www.topik.go.kr/" target="_blank" rel="noopener">TOPIK (한국어능력시험)</a> — kỳ thi năng lực tiếng Hàn chính thức; nhiều tin tuyển dụng công ty Hàn ghi rõ mức TOPIK tối thiểu (vd TOPIK 4+).</li>
<li><a href="https://www.linkedin.com/" target="_blank" rel="noopener">LinkedIn</a> — dựng hồ sơ bằng tiếng Hàn và tiếng Việt/Anh trước khi bắt đầu ứng tuyển.</li>
</ul>
<h3>🛠️ Mẫu cần chuẩn bị</h3>
<ul>
<li>Mẫu CV song ngữ (이력서) &amp; thư tự giới thiệu (자기소개서) — xem Giai đoạn 2.</li>
<li>Mẫu nhật ký thực tập (일지) hằng ngày — xem Giai đoạn 5.</li>
<li>Dàn ý báo cáo cuối kỳ — xem Giai đoạn 7.</li>
</ul>
<div class="callout"><span class="badge">Không tải PDF</span> Môn này không lưu sẵn mẫu biểu chính thức của FPTU dưới dạng PDF tải về — luôn lấy bản mới nhất từ FLM vì mẫu có thể đổi theo từng kỳ.</div>`,
  ]]);

const intro = doc('ojk202-0-1-overview', 'Course overview: On-the-Job Training|||Tổng quan: Thực tập doanh nghiệp',
  'OJT là gì, vì sao thực tập bằng tiếng Hàn quan trọng, 8 giai đoạn của kỳ thực tập, 3 sản phẩm bắt buộc và rubric chấm điểm.',
  [[
    `<span class="eyebrow">OJK202 · Overview</span>
<h2>On-the-Job Training (OJT)</h2>
<p class="lead">OJK202 is not a lecture course — it is a <strong>full-semester internship</strong> at a real company, where you apply your Korean language and professional skills on the job. Your grade comes from what you actually do at the workplace, documented and reflected on.</p>
<h3>Why Korean-language OJT matters</h3>
<p>For a Ngôn ngữ Hàn student, this internship is the first real test of whether classroom Korean survives contact with a Korean or Korean-affiliated workplace — 존댓말 (jondaetmal, honorific speech), business documents, phone calls, and the unwritten rules of 회사 생활 (hoesa saenghwal, company life).</p>
<h3>The 8 stages of your internship</h3>
<ol>
<li>Preparation &amp; finding a Korean-language position</li>
<li>Bilingual résumé (이력서), interview &amp; job-search skills</li>
<li>Onboarding into a Korean corporate culture</li>
<li>Professional working skills &amp; work ethics</li>
<li>Doing the job (translation/interpretation, Korean communication) &amp; keeping a journal</li>
<li>Communication, teamwork &amp; handling workplace situations</li>
<li>Writing the internship report</li>
<li>Evaluation, defense &amp; career orientation in Korean-language jobs</li>
</ol>
<h3>Three required deliverables</h3>
<ul>
<li><strong>Internship journal (nhật ký thực tập / 실습일지)</strong> — a dated log of tasks, difficulties, and what you learned, usually weekly or daily.</li>
<li><strong>Internship report (báo cáo thực tập)</strong> — the structured final writeup: company introduction, tasks performed, skills gained, reflection.</li>
<li><strong>Company/mentor evaluation (phiếu đánh giá doanh nghiệp)</strong> — signed and sealed by your workplace supervisor, scoring attitude, skill and results.</li>
</ul>
<h3>How you are graded (typical rubric)</h3>
<pre><code>Journal / process log      ~20%  (regularity, honesty, reflection)
Company evaluation         ~30%  (supervisor's score of attitude &amp; skill)
Final written report       ~30%  (structure, content, Korean/Vietnamese quality)
Defense / presentation     ~20%  (Q&amp;A with the faculty council)
</code></pre>
<div class="callout"><span class="badge">Start early</span> Stage 1 (finding a position) can take weeks. Begin searching and preparing documents well before the semester's official start date.</div>`,
    `<span class="eyebrow">OJK202 · Tổng quan</span>
<h2>Thực tập doanh nghiệp (OJT)</h2>
<p class="lead">OJK202 không phải môn học lý thuyết trên lớp — đây là <strong>kỳ thực tập trọn học kỳ</strong> tại một doanh nghiệp thật, nơi bạn dùng tiếng Hàn và kỹ năng nghề nghiệp trong công việc thật. Điểm số đến từ những gì bạn thực sự làm tại nơi thực tập, được ghi lại và phản ánh.</p>
<h3>Vì sao OJT bằng tiếng Hàn quan trọng</h3>
<p>Với sinh viên Ngôn ngữ Hàn, kỳ thực tập là phép thử đầu tiên xem tiếng Hàn học trên lớp có sống sót khi va chạm với môi trường công ty Hàn hay không — 존댓말 (jondaetmal, kính ngữ), văn bản nghiệp vụ, cuộc gọi điện thoại, và các luật ngầm của 회사 생활 (hoesa saenghwal, đời sống công ty).</p>
<h3>8 giai đoạn của kỳ thực tập</h3>
<ol>
<li>Chuẩn bị &amp; tìm doanh nghiệp/vị trí dùng tiếng Hàn</li>
<li>CV song ngữ (이력서), phỏng vấn &amp; kỹ năng xin việc</li>
<li>Hoà nhập môi trường &amp; văn hoá công ty Hàn</li>
<li>Kỹ năng làm việc chuyên nghiệp &amp; đạo đức nghề</li>
<li>Thực hiện công việc (dịch, giao tiếp tiếng Hàn) &amp; ghi nhật ký</li>
<li>Giao tiếp, làm việc nhóm &amp; xử lý tình huống công sở</li>
<li>Viết báo cáo thực tập</li>
<li>Đánh giá, bảo vệ &amp; định hướng nghề nghiệp tiếng Hàn</li>
</ol>
<h3>Ba sản phẩm bắt buộc</h3>
<ul>
<li><strong>Nhật ký thực tập (실습일지)</strong> — nhật ký theo ngày về công việc, khó khăn, và điều học được, thường ghi hằng tuần hoặc hằng ngày.</li>
<li><strong>Báo cáo thực tập</strong> — bài viết cuối kỳ có cấu trúc: giới thiệu công ty, công việc đã làm, kỹ năng đạt được, tự nhìn lại.</li>
<li><strong>Phiếu đánh giá doanh nghiệp</strong> — người hướng dẫn tại nơi thực tập ký và đóng dấu, chấm thái độ, kỹ năng và kết quả.</li>
</ul>
<h3>Cách chấm điểm (rubric điển hình)</h3>
<pre><code>Nhật ký / quá trình         ~20%  (đều đặn, trung thực, có suy ngẫm)
Đánh giá doanh nghiệp       ~30%  (điểm thái độ &amp; kỹ năng từ người hướng dẫn)
Báo cáo cuối kỳ             ~30%  (cấu trúc, nội dung, chất lượng tiếng Hàn/Việt)
Bảo vệ / thuyết trình       ~20%  (hỏi-đáp với hội đồng khoa)
</code></pre>
<div class="callout"><span class="badge">Bắt đầu sớm</span> Giai đoạn 1 (tìm vị trí) có thể mất nhiều tuần. Hãy bắt đầu tìm kiếm và chuẩn bị hồ sơ từ rất sớm, trước ngày chính thức bắt đầu kỳ học.</div>`,
  ]]);

const c1 = doc('ojk202-1-1-chuan-bi-tim-doanh-nghiep', 'Stage 1 — Preparation & finding a Korean-language position|||Giai đoạn 1 — Chuẩn bị & tìm doanh nghiệp',
  'Các vị trí dùng tiếng Hàn (biên-phiên dịch, trợ lý, nhân viên công ty Hàn), kênh tìm việc, checklist hồ sơ cần chuẩn bị trước khi ứng tuyển.',
  [[
    `<span class="eyebrow">OJK202 · Stage 1</span>
<h2>Preparation &amp; finding a Korean-language position</h2>
<h3>Positions that use Korean</h3>
<ul>
<li><strong>Interpreter/translator (biên-phiên dịch, 통역/번역)</strong> — meetings, documents, factory-floor interpretation between Korean managers and Vietnamese staff.</li>
<li><strong>Administrative/HR assistant</strong> at a Korean-invested company — scheduling, onboarding paperwork, translating internal notices.</li>
<li><strong>Sales/customer service staff</strong> for a company serving Korean clients or e-commerce platforms.</li>
<li><strong>Tour guide / hospitality (hướng dẫn viên)</strong> for Korean tourists — seasonal but common for Korean-language majors.</li>
</ul>
<h3>Where to search</h3>
<ul>
<li>FPTU career center / faculty partnership list — Korean-invested companies often reach out directly to the department.</li>
<li>Vietnamese job boards with a Korean-company filter (TopCV, VietnamWorks — search "công ty Hàn Quốc").</li>
<li>Korean industrial parks/zones near you, and companies you already know from internship fairs.</li>
<li>Personal network: seniors (선배, sunbae) who interned before you are the fastest lead.</li>
</ul>
<h3>Before you apply</h3>
<pre><code>Checklist:
[ ] TOPIK certificate (or current level) ready to state
[ ] Bilingual CV drafted (see Stage 2)
[ ] List of 5-10 target companies with contact info
[ ] Confirmed OJT dates and required paperwork from FPTU
[ ] Emergency contact / insurance info gathered
</code></pre>
<div class="callout"><span class="badge">Register early</span> Some Korean companies require a background/health check before signing an internship agreement — this can take 1-2 weeks, so start well ahead of the deadline.</div>`,
    `<span class="eyebrow">OJK202 · Giai đoạn 1</span>
<h2>Chuẩn bị &amp; tìm doanh nghiệp/vị trí dùng tiếng Hàn</h2>
<h3>Các vị trí dùng tiếng Hàn</h3>
<ul>
<li><strong>Biên-phiên dịch (통역/번역)</strong> — họp hành, văn bản, phiên dịch tại xưởng giữa quản lý Hàn Quốc và nhân viên Việt Nam.</li>
<li><strong>Trợ lý hành chính-nhân sự</strong> tại công ty vốn Hàn Quốc — sắp lịch, giấy tờ nhận việc, dịch thông báo nội bộ.</li>
<li><strong>Nhân viên kinh doanh/CSKH</strong> cho công ty phục vụ khách Hàn hoặc sàn thương mại điện tử.</li>
<li><strong>Hướng dẫn viên</strong> cho khách du lịch Hàn Quốc — mang tính thời vụ nhưng phổ biến với sinh viên Ngôn ngữ Hàn.</li>
</ul>
<h3>Tìm ở đâu</h3>
<ul>
<li>Trung tâm hỗ trợ sinh viên/khoa của FPTU — công ty vốn Hàn thường liên hệ trực tiếp với khoa.</li>
<li>Trang tuyển dụng Việt Nam có lọc theo công ty Hàn (TopCV, VietnamWorks — tìm "công ty Hàn Quốc").</li>
<li>Khu công nghiệp Hàn Quốc gần bạn, và các công ty đã biết qua ngày hội việc làm.</li>
<li>Mạng lưới cá nhân: 선배 (sunbae, đàn anh chị) từng thực tập trước bạn là nguồn thông tin nhanh nhất.</li>
</ul>
<h3>Trước khi ứng tuyển</h3>
<pre><code>Checklist:
[ ] Sẵn sàng nêu chứng chỉ/trình độ TOPIK hiện có
[ ] Đã soạn CV song ngữ (xem Giai đoạn 2)
[ ] Danh sách 5-10 công ty mục tiêu kèm thông tin liên hệ
[ ] Đã xác nhận lịch OJT và giấy tờ cần nộp cho FPTU
[ ] Đã chuẩn bị thông tin liên hệ khẩn cấp / bảo hiểm
</code></pre>
<div class="callout"><span class="badge">Đăng ký sớm</span> Một số công ty Hàn yêu cầu kiểm tra lý lịch/sức khoẻ trước khi ký hợp đồng thực tập — việc này có thể mất 1-2 tuần, nên bắt đầu thật sớm trước hạn.</div>`,
  ]]);

const c1q = quiz('ojk202-quiz-1', 'Quiz 1 — Preparation & job search|||Quiz 1 — Chuẩn bị & tìm việc', [
  { id: 'q1', question: 'Vị trí nào sau đây phù hợp nhất với sinh viên ngành Ngôn ngữ Hàn khi thực tập tại công ty Hàn Quốc?', options: ['Kỹ sư cơ khí thuần túy', 'Biên-phiên dịch/trợ lý dùng tiếng Hàn', 'Kế toán trưởng', 'Quản lý kho vận không cần tiếng Hàn'], correctIndex: 1, explanation: 'Vị trí phiên dịch, trợ lý hành chính-nhân sự tại công ty Hàn tận dụng đúng thế mạnh tiếng Hàn của sinh viên.' },
  { id: 'q2', question: 'Nguồn nào thường có sẵn danh sách công ty Hàn Quốc đã hợp tác với trường?', options: ['Trung tâm hỗ trợ sinh viên/khoa của FPTU', 'Chợ đêm gần trường', 'Diễn đàn phim ảnh Hàn Quốc', 'Ứng dụng đặt đồ ăn'], correctIndex: 0, explanation: 'Khoa và trung tâm hỗ trợ sinh viên thường có sẵn danh sách công ty vốn Hàn từng nhận thực tập sinh.' },
  { id: 'q3', question: 'Vì sao nên bắt đầu tìm vị trí thực tập sớm, trước ngày bắt đầu kỳ?', options: ['Vì hồ sơ, kiểm tra sức khoẻ/lý lịch của một số công ty Hàn có thể mất 1-2 tuần', 'Vì không cần chuẩn bị gì', 'Vì công ty Hàn không nhận sinh viên thực tập', 'Vì trường không cho phép tự tìm doanh nghiệp'], correctIndex: 0, explanation: 'Một số công ty yêu cầu kiểm tra trước khi ký hợp đồng thực tập, nên cần thời gian chuẩn bị sớm.' },
]);

const c2 = doc('ojk202-2-1-cv-phong-van', 'Stage 2 — Bilingual CV (이력서), interview & job-search skills|||Giai đoạn 2 — CV song ngữ, phỏng vấn & kỹ năng xin việc',
  'Cấu trúc 이력서 (CV Hàn), thư tự giới thiệu 자기소개서, nghi thức phỏng vấn (kính ngữ, cúi chào), mẫu tự giới thiệu bản thân.',
  [[
    `<span class="eyebrow">OJK202 · Stage 2</span>
<h2>Bilingual CV (이력서), interview &amp; job-search skills</h2>
<h3>The Korean-style résumé (이력서, iryeokseo)</h3>
<ul>
<li><strong>Photo</strong> — a formal photo in the top corner is still expected on many Korean-format resumes (unlike Western CVs).</li>
<li><strong>Personal info</strong> — name in Korean/Vietnamese, date of birth, contact, address.</li>
<li><strong>Education &amp; TOPIK level</strong> — list your Korean proficiency explicitly; it is often the first filter.</li>
<li><strong>Experience &amp; activities</strong> — even non-Korean part-time jobs show reliability; frame them in Korean where you can.</li>
</ul>
<h3>Cover letter (자기소개서, jagi-sogaeseo)</h3>
<p>Unlike a short Western cover letter, a Korean 자기소개서 often answers structured prompts: growth background (성장과정), personality strengths/weaknesses (성격의 장단점), reason for applying (지원동기), and future plan (입사 후 포부). Prepare a Vietnamese draft first, then a Korean version — do not machine-translate without review.</p>
<h3>Interview etiquette</h3>
<ul>
<li>Bow slightly when entering/exiting; wait to be told to sit.</li>
<li>Use formal/honorific speech (존댓말) throughout, even if the interviewer is friendly.</li>
<li>Common questions: self-introduction (자기소개), why this company (지원동기), a weakness and how you handle it, availability dates.</li>
<li>Prepare 1-2 questions to ask back — shows genuine interest.</li>
</ul>
<pre><code>Self-introduction skeleton (30-60s):
1) Name + major + one relevant strength
2) One concrete example (project/activity) proving that strength
3) Why you want THIS internship, tied to your Korean-language goal
</code></pre>
<div class="callout"><span class="badge">Practice out loud</span> Rehearse your self-introduction and 3-4 likely answers in Korean until they are fluent — reading from a script in the interview reads as unprepared.</div>`,
    `<span class="eyebrow">OJK202 · Giai đoạn 2</span>
<h2>CV song ngữ (이력서), phỏng vấn &amp; kỹ năng xin việc</h2>
<h3>CV kiểu Hàn Quốc (이력서, iryeokseo)</h3>
<ul>
<li><strong>Ảnh</strong> — ảnh chân dung trang trọng ở góc trên vẫn được kỳ vọng trên nhiều mẫu CV kiểu Hàn (khác CV phương Tây).</li>
<li><strong>Thông tin cá nhân</strong> — tên bằng tiếng Hàn/Việt, ngày sinh, liên hệ, địa chỉ.</li>
<li><strong>Học vấn &amp; trình độ TOPIK</strong> — ghi rõ trình độ tiếng Hàn; đây thường là bộ lọc đầu tiên.</li>
<li><strong>Kinh nghiệm &amp; hoạt động</strong> — kể cả công việc bán thời gian không liên quan tiếng Hàn cũng thể hiện độ đáng tin cậy; trình bày bằng tiếng Hàn nếu có thể.</li>
</ul>
<h3>Thư tự giới thiệu (자기소개서, jagi-sogaeseo)</h3>
<p>Khác với thư xin việc phương Tây ngắn gọn, 자기소개서 kiểu Hàn thường trả lời các mục có cấu trúc: quá trình trưởng thành (성장과정), điểm mạnh/yếu tính cách (성격의 장단점), lý do ứng tuyển (지원동기), và kế hoạch sau khi vào công ty (입사 후 포부). Soạn bản tiếng Việt trước, rồi chuyển sang tiếng Hàn — không dịch máy rồi nộp luôn mà không soát lại.</p>
<h3>Nghi thức phỏng vấn</h3>
<ul>
<li>Cúi chào nhẹ khi vào/ra; chờ được mời mới ngồi.</li>
<li>Dùng kính ngữ (존댓말) xuyên suốt, kể cả khi người phỏng vấn thân thiện.</li>
<li>Câu hỏi thường gặp: tự giới thiệu (자기소개), lý do chọn công ty (지원동기), một điểm yếu và cách khắc phục, ngày có thể bắt đầu.</li>
<li>Chuẩn bị sẵn 1-2 câu hỏi để hỏi lại — thể hiện sự quan tâm thật sự.</li>
</ul>
<pre><code>Khung tự giới thiệu (30-60 giây):
1) Tên + chuyên ngành + một điểm mạnh liên quan
2) Một ví dụ cụ thể (dự án/hoạt động) chứng minh điểm mạnh đó
3) Vì sao muốn thực tập TẠI ĐÂY, gắn với mục tiêu tiếng Hàn của bạn
</code></pre>
<div class="callout"><span class="badge">Luyện nói thành tiếng</span> Tập tự giới thiệu và 3-4 câu trả lời thường gặp bằng tiếng Hàn đến khi trôi chảy — đọc kịch bản khi phỏng vấn cho thấy bạn chưa chuẩn bị kỹ.</div>`,
  ]]);

const c2q = quiz('ojk202-quiz-2', 'Quiz 2 — CV & interview|||Quiz 2 — CV & phỏng vấn', [
  { id: 'q1', question: 'CV 이력서 (iryeokseo) khác CV phương Tây điển hình ở điểm nào?', options: ['Thường yêu cầu ảnh chân dung trang trọng và thông tin cá nhân chi tiết', 'Không cần thông tin liên hệ', 'Không được ghi trình độ tiếng Hàn', 'Chỉ viết bằng tiếng Anh'], correctIndex: 0, explanation: 'CV kiểu Hàn thường có ảnh trang trọng và ghi chi tiết thông tin cá nhân, trình độ TOPIK.' },
  { id: 'q2', question: 'Thư 자기소개서 (tự giới thiệu bản thân) kiểu Hàn thường yêu cầu trả lời mục nào?', options: ['Chỉ liệt kê sở thích cá nhân', 'Quá trình trưởng thành, tính cách, lý do ứng tuyển, kế hoạch sau khi vào công ty', 'Chỉ cần một câu chào', 'Không cần nội dung, chỉ cần ảnh'], correctIndex: 1, explanation: '자기소개서 có cấu trúc rõ: 성장과정, 성격의 장단점, 지원동기, 입사 후 포부.' },
  { id: 'q3', question: 'Trong phỏng vấn với công ty Hàn, nên dùng thái độ ngôn ngữ nào xuyên suốt?', options: ['존댓말 (kính ngữ/trang trọng)', 'Ngôn ngữ suồng sã như với bạn bè', 'Tiếng lóng', 'Im lặng hoàn toàn'], correctIndex: 0, explanation: 'Kính ngữ là mặc định trong phỏng vấn, kể cả khi người phỏng vấn có vẻ thân thiện.' },
]);

const c3 = doc('ojk202-3-1-hoa-nhap-van-hoa', 'Stage 3 — Onboarding into a Korean corporate culture|||Giai đoạn 3 — Hoà nhập môi trường & văn hoá công ty Hàn',
  'Kính ngữ (존댓말), quan hệ 선배/후배, văn hoá 회식, nghi thức trao danh thiếp và giờ giấc công sở Hàn.',
  [[
    `<span class="eyebrow">OJK202 · Stage 3</span>
<h2>Onboarding into a Korean corporate culture</h2>
<h3>Hierarchy &amp; honorific speech</h3>
<ul>
<li><strong>존댓말 (jondaetmal)</strong> — formal/honorific speech is the default with anyone senior in age or position; switching to casual speech (반말) is only appropriate if explicitly invited.</li>
<li><strong>선배/후배 (sunbae/hubae)</strong> — senior/junior relationships extend beyond job title to who joined the company (or team) earlier; a sunbae is greeted and treated with more deference regardless of age.</li>
<li><strong>직급 (jikgeup, job titles)</strong> — address colleagues by title + honorific (e.g. "팀장님", team-leader-nim), not first name.</li>
</ul>
<h3>회식 (hoesik) — company dinners</h3>
<p>Team dinners/drinks after work are a real part of Korean workplace bonding, not purely optional socializing. As an intern you are not expected to drink alcohol if you do not want to, but attending when invited (even briefly) signals respect for the team.</p>
<h3>Everyday office etiquette</h3>
<ul>
<li>Arrive several minutes before your official start time — being exactly on time can already read as late.</li>
<li>Exchange business cards (명함) with both hands, and read the card briefly before putting it away.</li>
<li>Do not leave before your immediate supervisor unless told to — check the team norm in your first week.</li>
</ul>
<div class="callout"><span class="badge">Observe first</span> Your first week is for observing how your specific team actually behaves — company culture varies a lot even within "Korean companies"; do not assume every rule above applies rigidly everywhere.</div>`,
    `<span class="eyebrow">OJK202 · Giai đoạn 3</span>
<h2>Hoà nhập môi trường &amp; văn hoá công ty Hàn</h2>
<h3>Thứ bậc &amp; kính ngữ</h3>
<ul>
<li><strong>존댓말 (jondaetmal)</strong> — kính ngữ/trang trọng là mặc định với người lớn tuổi hoặc cấp trên hơn; chỉ chuyển sang 반말 (nói thân mật) khi được mời rõ ràng.</li>
<li><strong>선배/후배 (sunbae/hubae)</strong> — quan hệ đàn anh chị/đàn em không chỉ theo chức danh mà theo ai vào công ty (hoặc nhóm) trước; sunbae được chào hỏi và đối xử tôn trọng hơn bất kể tuổi tác.</li>
<li><strong>직급 (jikgeup, chức danh)</strong> — gọi đồng nghiệp bằng chức danh + kính ngữ (vd "팀장님" — trưởng nhóm-nim), không gọi tên riêng.</li>
</ul>
<h3>회식 (hoesik) — bữa ăn tập thể sau giờ làm</h3>
<p>Bữa ăn/uống cùng nhóm sau giờ làm là một phần thật sự của việc gắn kết nơi công sở Hàn, không đơn thuần là giao lưu tuỳ chọn. Là thực tập sinh, bạn không bắt buộc phải uống rượu nếu không muốn, nhưng tham gia khi được mời (dù chỉ một lúc) thể hiện sự tôn trọng với nhóm.</p>
<h3>Nghi thức công sở hằng ngày</h3>
<ul>
<li>Đến sớm vài phút trước giờ làm chính thức — đến đúng giờ đôi khi đã bị xem là trễ.</li>
<li>Trao danh thiếp (명함) bằng hai tay, và đọc lướt danh thiếp trước khi cất đi.</li>
<li>Không về trước người quản lý trực tiếp trừ khi được cho phép — quan sát thói quen của nhóm trong tuần đầu.</li>
</ul>
<div class="callout"><span class="badge">Quan sát trước</span> Tuần đầu là để quan sát nhóm cụ thể của bạn thực sự hoạt động thế nào — văn hoá công ty khác nhau nhiều ngay cả trong nhóm "công ty Hàn Quốc"; đừng mặc định mọi quy tắc trên áp dụng cứng nhắc ở mọi nơi.</div>`,
  ]]);

const c3q = quiz('ojk202-quiz-3', 'Quiz 3 — Korean corporate culture|||Quiz 3 — Văn hoá công ty Hàn', [
  { id: 'q1', question: '존댓말 (kính ngữ) nên được dùng khi nào trong môi trường công ty Hàn?', options: ['Chỉ khi công ty yêu cầu bằng văn bản', 'Mặc định với người lớn tuổi/cấp trên, trừ khi được mời chuyển sang thân mật', 'Không bao giờ cần dùng', 'Chỉ dùng qua email'], correctIndex: 1, explanation: 'Kính ngữ là mặc định; chỉ đổi sang thân mật khi được mời rõ ràng.' },
  { id: 'q2', question: 'Quan hệ 선배/후배 (sunbae/hubae) trong công ty Hàn dựa chủ yếu vào yếu tố nào?', options: ['Ai vào công ty/nhóm trước, không chỉ dựa vào tuổi tác', 'Chỉ dựa vào bằng cấp', 'Chỉ dựa vào lương', 'Không có ý nghĩa gì trong công việc'], correctIndex: 0, explanation: 'Sunbae/hubae xác định theo thời điểm gia nhập công ty/nhóm, không chỉ theo tuổi.' },
  { id: 'q3', question: '회식 (bữa ăn/liên hoan tập thể sau giờ làm) có ý nghĩa gì với thực tập sinh?', options: ['Hoàn toàn không liên quan tới công việc, có thể bỏ qua', 'Là một phần gắn kết đội nhóm, nên tham gia khi được mời dù không cần uống rượu', 'Bắt buộc phải uống rượu', 'Chỉ dành cho quản lý cấp cao'], correctIndex: 1, explanation: 'Hoesik là văn hoá gắn kết thật; tham gia khi được mời thể hiện tôn trọng nhóm.' },
]);

const c4 = doc('ojk202-4-1-ky-nang-dao-duc', 'Stage 4 — Professional working skills & work ethics|||Giai đoạn 4 — Kỹ năng làm việc chuyên nghiệp & đạo đức nghề',
  'Quản lý thời gian, giao tiếp nghiệp vụ, bảo mật thông tin (기밀유지), trung thực khi mắc lỗi, checklist trước khi nhận việc mới.',
  [[
    `<span class="eyebrow">OJK202 · Stage 4</span>
<h2>Professional working skills &amp; work ethics</h2>
<h3>Core professional skills</h3>
<ul>
<li><strong>Time management</strong> — track your own tasks and deadlines; do not wait to be reminded twice.</li>
<li><strong>Business communication</strong> — Korean business email/phone etiquette: formal greeting, clear subject, honorific closing (e.g. "감사합니다").</li>
<li><strong>Taking notes &amp; asking questions</strong> — write down instructions the first time; ask clarifying questions before starting, not after making a mistake.</li>
<li><strong>Tool literacy</strong> — basic Excel/Word/PowerPoint (or their Korean equivalents like 한글/HWP) is often assumed at Korean offices.</li>
</ul>
<h3>Work ethics</h3>
<ul>
<li><strong>Confidentiality (기밀유지)</strong> — internal documents, client data and even simple internal chat logs are not for outside sharing, including on your own social media.</li>
<li><strong>Honesty about mistakes</strong> — report an error immediately rather than hiding it; a hidden mistake is far more damaging than an admitted one.</li>
<li><strong>Punctuality &amp; reliability</strong> — small things (being on time, replying to messages promptly) are read as a proxy for how reliable you are on bigger things.</li>
</ul>
<pre><code>Before starting ANY new task, confirm:
1) What exactly is the deliverable?
2) By when?
3) Who do I ask if I get stuck?
</code></pre>
<div class="callout"><span class="badge">Ethics is not optional</span> A violation of confidentiality can end an internship (and the university's relationship with that company) immediately — when unsure whether information is sensitive, treat it as if it is.</div>`,
    `<span class="eyebrow">OJK202 · Giai đoạn 4</span>
<h2>Kỹ năng làm việc chuyên nghiệp &amp; đạo đức nghề</h2>
<h3>Kỹ năng chuyên nghiệp cốt lõi</h3>
<ul>
<li><strong>Quản lý thời gian</strong> — tự theo dõi công việc và hạn chót của mình; không chờ được nhắc lần hai.</li>
<li><strong>Giao tiếp nghiệp vụ</strong> — nghi thức email/điện thoại công sở Hàn: chào trang trọng, tiêu đề rõ ràng, kết thúc bằng kính ngữ (vd "감사합니다").</li>
<li><strong>Ghi chú &amp; đặt câu hỏi</strong> — ghi lại hướng dẫn ngay từ lần đầu; hỏi làm rõ trước khi bắt đầu, không phải sau khi đã làm sai.</li>
<li><strong>Thành thạo công cụ</strong> — Excel/Word/PowerPoint cơ bản (hoặc phần mềm tương đương của Hàn như 한글/HWP) thường được mặc định biết sẵn ở văn phòng Hàn.</li>
</ul>
<h3>Đạo đức nghề nghiệp</h3>
<ul>
<li><strong>Bảo mật thông tin (기밀유지)</strong> — tài liệu nội bộ, dữ liệu khách hàng, kể cả tin nhắn nội bộ đơn giản đều không được chia sẻ ra ngoài, kể cả lên mạng xã hội cá nhân.</li>
<li><strong>Trung thực khi mắc lỗi</strong> — báo cáo lỗi ngay thay vì giấu đi; một lỗi bị giấu gây hại nhiều hơn một lỗi được thừa nhận.</li>
<li><strong>Đúng giờ &amp; đáng tin cậy</strong> — những việc nhỏ (đúng giờ, phản hồi tin nhắn nhanh) được xem như thước đo cho độ đáng tin cậy ở việc lớn hơn.</li>
</ul>
<pre><code>Trước khi bắt đầu BẤT KỲ công việc mới nào, xác nhận:
1) Sản phẩm cần giao chính xác là gì?
2) Hạn chót khi nào?
3) Gặp khó khăn thì hỏi ai?
</code></pre>
<div class="callout"><span class="badge">Đạo đức không phải tuỳ chọn</span> Vi phạm bảo mật có thể chấm dứt kỳ thực tập (và cả quan hệ hợp tác của trường với công ty đó) ngay lập tức — khi không chắc thông tin có nhạy cảm hay không, hãy coi như nó nhạy cảm.</div>`,
  ]]);

const c4q = quiz('ojk202-quiz-4', 'Quiz 4 — Professional skills & ethics|||Quiz 4 — Kỹ năng & đạo đức nghề', [
  { id: 'q1', question: 'Khi được giao việc mới, thực tập sinh nên xác nhận điều gì trước khi bắt tay vào làm?', options: ['Không cần hỏi gì, cứ làm theo cách hiểu của mình', 'Sản phẩm cần giao là gì, hạn chót, và hỏi ai khi gặp khó khăn', 'Chỉ cần hỏi lương thực tập', 'Chỉ cần hỏi giờ nghỉ trưa'], correctIndex: 1, explanation: 'Xác nhận rõ deliverable, hạn chót và người hỗ trợ giúp tránh làm sai từ đầu.' },
  { id: 'q2', question: 'Khi phát hiện mình làm sai trong công việc, thực tập sinh nên làm gì?', options: ['Giấu đi, hy vọng không ai phát hiện', 'Báo cáo ngay với người phụ trách', 'Tự sửa mà không nói với ai', 'Đổ lỗi cho đồng nghiệp khác'], correctIndex: 1, explanation: 'Báo lỗi ngay giúp xử lý kịp thời; giấu lỗi thường gây hại lớn hơn.' },
  { id: 'q3', question: '기밀유지 (bảo mật thông tin) áp dụng cho những gì?', options: ['Chỉ áp dụng với tài liệu in giấy', 'Tài liệu nội bộ, dữ liệu khách hàng, kể cả không chia sẻ lên mạng xã hội cá nhân', 'Không áp dụng với thực tập sinh', 'Chỉ áp dụng sau khi kết thúc thực tập'], correctIndex: 1, explanation: 'Bảo mật áp dụng với mọi thông tin nội bộ/khách hàng, mọi lúc, kể cả trên mạng xã hội cá nhân.' },
]);

const c5 = doc('ojk202-5-1-thuc-hien-nhat-ky', 'Stage 5 — Doing the job & keeping a journal|||Giai đoạn 5 — Thực hiện công việc & ghi nhật ký',
  'Kỹ năng biên-phiên dịch trong công việc thật, xử lý khi không chắc thuật ngữ, mẫu nhật ký thực tập hằng ngày.',
  [[
    `<span class="eyebrow">OJK202 · Stage 5</span>
<h2>Doing the job &amp; keeping a journal</h2>
<h3>Translation &amp; interpretation on the job</h3>
<ul>
<li><strong>Written translation (번역)</strong> — internal notices, emails, simple contracts. Keep a personal glossary of company-specific terms (product names, department names) — consistency matters more than elegance.</li>
<li><strong>Interpretation (통역)</strong> — for meetings/calls between Korean and Vietnamese staff. If you miss something, ask the speaker to repeat rather than guessing and passing on a wrong meaning.</li>
<li><strong>When you do not know a term</strong> — say so and confirm rather than inventing a translation; a wrong technical term can cause real damage on a factory floor or in a contract.</li>
</ul>
<h3>The internship journal (일지)</h3>
<p>Write it the same day, not from memory a week later. A short daily entry beats a long one written at the last minute.</p>
<pre><code>Journal entry template:
Date: ___________
Tasks today: ___________
What I translated/interpreted: ___________
A problem I ran into: ___________
What I learned / will do differently: ___________
Hours worked: ___________
</code></pre>
<div class="callout"><span class="badge">Journal = evidence</span> Your journal is the raw material for your final report and the fastest way to prove your hours and contributions if a dispute ever comes up — treat it as a work record, not a diary.</div>`,
    `<span class="eyebrow">OJK202 · Giai đoạn 5</span>
<h2>Thực hiện công việc &amp; ghi nhật ký</h2>
<h3>Biên-phiên dịch trong công việc thật</h3>
<ul>
<li><strong>Biên dịch (번역)</strong> — thông báo nội bộ, email, hợp đồng đơn giản. Giữ một bảng thuật ngữ riêng (tên sản phẩm, tên phòng ban) — nhất quán quan trọng hơn hoa mỹ.</li>
<li><strong>Phiên dịch (통역)</strong> — cho họp/cuộc gọi giữa nhân viên Hàn và Việt. Nếu nghe sót, hãy nhờ nói lại thay vì đoán rồi truyền đạt sai nghĩa.</li>
<li><strong>Khi không biết một thuật ngữ</strong> — nói rõ và xác nhận thay vì tự bịa ra bản dịch; một thuật ngữ kỹ thuật sai có thể gây hậu quả thật ở xưởng sản xuất hoặc trong hợp đồng.</li>
</ul>
<h3>Nhật ký thực tập (일지)</h3>
<p>Ghi ngay trong ngày, đừng đợi nhớ lại sau một tuần. Một mục ngắn ghi hằng ngày tốt hơn một bản dài viết vội vào phút chót.</p>
<pre><code>Mẫu nhật ký:
Ngày: ___________
Công việc hôm nay: ___________
Nội dung đã dịch/phiên dịch: ___________
Vấn đề gặp phải: ___________
Điều học được / sẽ làm khác đi: ___________
Số giờ làm việc: ___________
</code></pre>
<div class="callout"><span class="badge">Nhật ký = bằng chứng</span> Nhật ký là nguyên liệu thô cho báo cáo cuối kỳ, và là cách nhanh nhất để chứng minh giờ làm và đóng góp của bạn nếu có tranh chấp — hãy coi nó là hồ sơ công việc, không phải nhật ký cá nhân.</div>`,
  ]]);

const c5q = quiz('ojk202-quiz-5', 'Quiz 5 — On the job & journal|||Quiz 5 — Thực hiện việc & nhật ký', [
  { id: 'q1', question: 'Khi phiên dịch mà không nghe rõ hoặc không chắc nghĩa, thực tập sinh nên làm gì?', options: ['Đoán và dịch tiếp cho nhanh', 'Hỏi lại người nói để xác nhận trước khi dịch', 'Bỏ qua đoạn đó', 'Tự ý thêm ý kiến cá nhân vào bản dịch'], correctIndex: 1, explanation: 'Xác nhận lại trước khi dịch giúp tránh truyền đạt sai nghĩa gây hậu quả thật.' },
  { id: 'q2', question: 'Nhật ký thực tập (일지) nên được ghi vào thời điểm nào để đảm bảo chính xác?', options: ['Cuối kỳ thực tập, nhớ lại tất cả', 'Ngay trong hoặc cuối ngày làm việc đó', 'Chỉ khi giảng viên nhắc', 'Không cần ghi nếu công việc đơn giản'], correctIndex: 1, explanation: 'Ghi ngay trong ngày cho thông tin chính xác hơn nhiều so với nhớ lại sau.' },
  { id: 'q3', question: 'Vì sao nên giữ một bảng thuật ngữ (glossary) riêng khi dịch tài liệu cho công ty?', options: ['Để bảng thuật ngữ đẹp hơn', 'Để đảm bảo dịch nhất quán tên sản phẩm/phòng ban xuyên suốt', 'Vì công ty yêu cầu nộp riêng', 'Không có tác dụng thực tế'], correctIndex: 1, explanation: 'Glossary giúp nhất quán thuật ngữ, tránh gây hiểu lầm khi dịch nhiều tài liệu.' },
]);

const c6 = doc('ojk202-6-1-giao-tiep-nhom', 'Stage 6 — Communication, teamwork & handling situations|||Giai đoạn 6 — Giao tiếp, làm việc nhóm & xử lý tình huống công sở',
  'Đọc phản hồi gián tiếp kiểu Hàn, giữ hoà khí nhóm, tiếp nhận góp ý, khi nào cần báo lên trường thay vì tự giải quyết.',
  [[
    `<span class="eyebrow">OJK202 · Stage 6</span>
<h2>Communication, teamwork &amp; handling workplace situations</h2>
<h3>Working in a mixed Korean-Vietnamese team</h3>
<ul>
<li><strong>Indirect communication</strong> — Korean workplace feedback is often indirect ("perhaps consider...") rather than direct ("this is wrong"); learn to read soft language as a real correction, not a suggestion you can skip.</li>
<li><strong>Group harmony (조화)</strong> — raising a disagreement privately with your direct supervisor is usually safer than disagreeing openly in a group meeting.</li>
<li><strong>Cross-cultural misunderstandings</strong> — a literal, very direct Vietnamese phrasing translated word-for-word into Korean can sound rude even when the intent was neutral; adjust register, not just vocabulary.</li>
</ul>
<h3>Receiving feedback &amp; criticism</h3>
<pre><code>When you receive critical feedback:
1) Listen fully before responding - do not interrupt to explain/defend
2) Acknowledge it, even if you disagree internally
3) Ask one clarifying question if the fix is unclear
4) Follow up in writing (a short recap message) if the task is complex
</code></pre>
<h3>When a real problem happens</h3>
<p>If you face harassment, an unsafe situation, or a conflict you cannot resolve, escalate to your FPTU internship supervisor immediately — do not try to "just get through it" alone, and do not resolve it only inside the company without informing the university.</p>
<div class="callout"><span class="badge">Two channels, always</span> Keep both your workplace supervisor and your university OJT advisor informed of anything serious — each can only help with what they know about.</div>`,
    `<span class="eyebrow">OJK202 · Giai đoạn 6</span>
<h2>Giao tiếp, làm việc nhóm &amp; xử lý tình huống công sở</h2>
<h3>Làm việc trong nhóm hỗn hợp Hàn-Việt</h3>
<ul>
<li><strong>Giao tiếp gián tiếp</strong> — góp ý ở công sở Hàn thường gián tiếp (vd "có thể cân nhắc lại...") thay vì trực tiếp ("chỗ này sai"); cần hiểu lời nhẹ nhàng đó là góp ý thật cần sửa, không phải gợi ý có thể bỏ qua.</li>
<li><strong>Hoà khí nhóm (조화)</strong> — nêu bất đồng riêng với người quản lý trực tiếp thường an toàn hơn phản đối công khai trong cuộc họp nhóm.</li>
<li><strong>Hiểu lầm liên văn hoá</strong> — câu nói tiếng Việt rất thẳng, dịch nguyên văn sang tiếng Hàn có thể nghe thô lỗ dù ý định trung lập; cần chỉnh mức độ trang trọng, không chỉ từ vựng.</li>
</ul>
<h3>Tiếp nhận phản hồi &amp; phê bình</h3>
<pre><code>Khi nhận phản hồi mang tính phê bình:
1) Nghe hết trước khi phản hồi - không ngắt lời để giải thích/biện minh
2) Ghi nhận, dù trong lòng chưa đồng ý hoàn toàn
3) Hỏi lại một câu làm rõ nếu chưa hiểu cách sửa
4) Xác nhận lại bằng văn bản (một tin nhắn tóm tắt ngắn) nếu việc phức tạp
</code></pre>
<h3>Khi có vấn đề nghiêm trọng thật sự</h3>
<p>Nếu gặp quấy rối, tình huống mất an toàn, hoặc xung đột không tự giải quyết được, hãy báo ngay cho giảng viên hướng dẫn thực tập của FPTU — đừng cố "chịu đựng cho qua" một mình, và đừng chỉ giải quyết trong nội bộ công ty mà không báo cho trường.</p>
<div class="callout"><span class="badge">Luôn báo cả hai đầu mối</span> Giữ cả người hướng dẫn tại công ty và giảng viên OJT của trường được thông báo về bất kỳ việc nghiêm trọng nào — mỗi bên chỉ có thể giúp trong phạm vi họ biết.</div>`,
  ]]);

const c6q = quiz('ojk202-quiz-6', 'Quiz 6 — Teamwork & situations|||Quiz 6 — Làm việc nhóm & tình huống', [
  { id: 'q1', question: 'Phản hồi kiểu gián tiếp (vd có thể cân nhắc lại...) trong môi trường công sở Hàn Quốc thường mang nghĩa gì?', options: ['Chỉ là lời khen, không cần thay đổi gì', 'Thường là một lời góp ý cần sửa, dù diễn đạt nhẹ nhàng', 'Không có ý nghĩa gì', 'Chỉ áp dụng với email, không áp dụng khi nói chuyện'], correctIndex: 1, explanation: 'Góp ý kiểu Hàn thường gián tiếp nhưng vẫn cần được xem là yêu cầu sửa thật sự.' },
  { id: 'q2', question: 'Khi gặp bất đồng ý kiến với đồng nghiệp trong cuộc họp nhóm, cách an toàn hơn thường là gì?', options: ['Phản đối công khai ngay trong cuộc họp', 'Trao đổi riêng với người phụ trách trực tiếp sau đó', 'Im lặng mãi mãi, không bao giờ nói ra', 'Báo ngay lên ban giám đốc công ty'], correctIndex: 1, explanation: 'Trao đổi riêng giữ được hoà khí nhóm mà vẫn nêu được vấn đề.' },
  { id: 'q3', question: 'Khi gặp tình huống nghiêm trọng (quấy rối, mất an toàn, xung đột không giải quyết được), thực tập sinh nên làm gì?', options: ['Tự giải quyết một mình, không báo ai', 'Báo ngay cho giảng viên hướng dẫn thực tập của trường', 'Chờ đến khi kết thúc kỳ thực tập mới nói', 'Chỉ nói với bạn bè cùng lớp'], correctIndex: 1, explanation: 'Trường cần được báo song song với công ty để hỗ trợ đúng lúc.' },
]);

const c7 = doc('ojk202-7-1-bao-cao', 'Stage 7 — Writing the internship report|||Giai đoạn 7 — Viết báo cáo thực tập',
  'Cấu trúc báo cáo thực tập chuẩn, checklist chất lượng viết, giữ nhất quán với nhật ký để tránh bị nghi ngờ khi bảo vệ.',
  [[
    `<span class="eyebrow">OJK202 · Stage 7</span>
<h2>Writing the internship report</h2>
<h3>Typical structure</h3>
<pre><code>1. Cover page and acknowledgements
2. Company introduction (history, field, org chart)
3. Description of your role and tasks
4. Skills applied and gained (Korean language, professional)
5. Difficulties encountered and how you resolved them
6. Self-evaluation and lessons learned
7. Appendix: journal excerpts, work samples (redact confidential info), photos
</code></pre>
<h3>Writing quality checklist</h3>
<ul>
<li>Consistent terminology — use the glossary you built in Stage 5, do not switch translations of the same term mid-report.</li>
<li>Specific over vague — "I translated 12 internal notices and interpreted 3 client calls" beats "I did translation work".</li>
<li>Cite honestly — never copy another student's old report; your journal and your supervisor's evaluation are your primary evidence, and the two must match.</li>
<li>Proofread both languages — a Korean-major report full of Vietnamese typos undercuts the language skills the internship was supposed to prove.</li>
</ul>
<div class="callout"><span class="badge">Match your journal</span> Your report's task descriptions and your journal entries should tell a consistent story — a mismatch here is the fastest way to raise doubts in a defense.</div>`,
    `<span class="eyebrow">OJK202 · Giai đoạn 7</span>
<h2>Viết báo cáo thực tập</h2>
<h3>Cấu trúc điển hình</h3>
<pre><code>1. Trang bìa và lời cảm ơn
2. Giới thiệu công ty (lịch sử, lĩnh vực, sơ đồ tổ chức)
3. Mô tả vai trò và công việc của bạn
4. Kỹ năng đã áp dụng và đạt được (tiếng Hàn, nghiệp vụ)
5. Khó khăn gặp phải và cách giải quyết
6. Tự đánh giá và bài học rút ra
7. Phụ lục: trích nhật ký, sản phẩm công việc (che thông tin mật), hình ảnh
</code></pre>
<h3>Checklist chất lượng viết</h3>
<ul>
<li>Thuật ngữ nhất quán — dùng bảng thuật ngữ đã lập ở Giai đoạn 5, không đổi cách dịch cùng một thuật ngữ giữa chừng báo cáo.</li>
<li>Cụ thể hơn chung chung — "Tôi đã dịch 12 thông báo nội bộ và phiên dịch 3 cuộc gọi với khách hàng" tốt hơn "Tôi đã làm công việc dịch thuật".</li>
<li>Trích dẫn trung thực — không sao chép báo cáo cũ của bạn khác; nhật ký và đánh giá của người hướng dẫn là bằng chứng chính, hai thứ này phải khớp nhau.</li>
<li>Soát lỗi cả hai ngôn ngữ — một báo cáo của sinh viên chuyên ngành Hàn mà đầy lỗi chính tả tiếng Việt sẽ làm giảm giá trị của chính kỹ năng ngôn ngữ mà kỳ thực tập muốn chứng minh.</li>
</ul>
<div class="callout"><span class="badge">Khớp với nhật ký</span> Mô tả công việc trong báo cáo và các mục nhật ký cần kể một câu chuyện nhất quán — lệch nhau ở đây là cách nhanh nhất khiến hội đồng nghi ngờ khi bảo vệ.</div>`,
  ]]);

const c7q = quiz('ojk202-quiz-7', 'Quiz 7 — Writing the report|||Quiz 7 — Viết báo cáo', [
  { id: 'q1', question: 'Trong báo cáo thực tập, nên viết cụ thể (vd số lượng công việc) hay chung chung?', options: ['Viết chung chung cho an toàn', 'Viết cụ thể, có số liệu/chi tiết công việc thực tế', 'Không cần viết chi tiết công việc', 'Chỉ cần liệt kê tên công ty'], correctIndex: 1, explanation: 'Chi tiết cụ thể, có số liệu, thuyết phục hơn nhiều so với mô tả chung chung.' },
  { id: 'q2', question: 'Nội dung báo cáo thực tập cần khớp với tài liệu nào để tránh bị nghi ngờ khi bảo vệ?', options: ['Nhật ký thực tập đã ghi hằng ngày', 'Báo cáo của bạn cùng lớp', 'Không cần khớp với gì cả', 'Chỉ cần khớp với CV ban đầu'], correctIndex: 0, explanation: 'Nhật ký là bằng chứng gốc; báo cáo lệch với nhật ký dễ bị hội đồng đặt câu hỏi.' },
  { id: 'q3', question: 'Vì sao nên dùng thống nhất một bảng thuật ngữ xuyên suốt báo cáo?', options: ['Để báo cáo dài hơn', 'Để tránh dịch một thuật ngữ theo nhiều cách khác nhau, gây khó hiểu', 'Không có lý do cụ thể', 'Vì giảng viên yêu cầu đúng font chữ'], correctIndex: 1, explanation: 'Nhất quán thuật ngữ giúp báo cáo rõ ràng, chuyên nghiệp và dễ theo dõi.' },
]);

const c8 = doc('ojk202-8-1-danh-gia-bao-ve', 'Stage 8 — Evaluation, defense & career orientation|||Giai đoạn 8 — Đánh giá, bảo vệ & định hướng nghề nghiệp tiếng Hàn',
  'Ba cấu phần chấm điểm, checklist chuẩn bị buổi bảo vệ, định hướng nghề nghiệp tiếng Hàn sau kỳ thực tập.',
  [[
    `<span class="eyebrow">OJK202 · Stage 8</span>
<h2>Evaluation, defense &amp; career orientation</h2>
<h3>The three grading components again</h3>
<ul>
<li><strong>Company/mentor evaluation</strong> — collect the signed form well before the deadline; a late or missing form can block your grade regardless of how good your work was.</li>
<li><strong>Written report</strong> — submit ahead of time to catch formatting issues.</li>
<li><strong>Defense</strong> — a short presentation plus Q&amp;A with the faculty council.</li>
</ul>
<h3>Preparing for the defense</h3>
<pre><code>Defense prep checklist:
[ ] 5-10 min summary slide deck (company, role, 2-3 concrete achievements)
[ ] Be ready to answer in Korean if asked a short question
[ ] Anticipate: "What was your biggest difficulty and how did you solve it?"
[ ] Bring your journal as backup evidence
</code></pre>
<h3>Career orientation after OJT</h3>
<p>Use this internship as a real data point, not just a course to pass:</p>
<ul>
<li>Ask for a reference letter or LinkedIn recommendation if you performed well — Korean-company references carry real weight for future Korean-language jobs.</li>
<li>Reflect honestly: did interpretation, HR/admin, or sales-facing work suit you better? Use that to target your next TOPIK level and job search.</li>
<li>Keep in touch with your mentor and 선배 network — many Korean-language jobs are filled through referrals.</li>
</ul>
<div class="callout"><span class="badge">This is a pipeline, not an endpoint</span> A strong OJT often turns into a job offer at the same company, or at minimum a reference that opens the next one — treat the last week the same way you treated the first.</div>`,
    `<span class="eyebrow">OJK202 · Giai đoạn 8</span>
<h2>Đánh giá, bảo vệ &amp; định hướng nghề nghiệp</h2>
<h3>Nhắc lại ba cấu phần chấm điểm</h3>
<ul>
<li><strong>Đánh giá của doanh nghiệp/người hướng dẫn</strong> — xin phiếu đã ký từ sớm, trước hạn nộp; phiếu nộp trễ hoặc thiếu có thể chặn điểm dù nội dung làm việc tốt đến đâu.</li>
<li><strong>Báo cáo viết</strong> — nộp sớm để kịp sửa lỗi trình bày.</li>
<li><strong>Bảo vệ</strong> — thuyết trình ngắn kèm hỏi-đáp với hội đồng khoa.</li>
</ul>
<h3>Chuẩn bị buổi bảo vệ</h3>
<pre><code>Checklist chuẩn bị bảo vệ:
[ ] Slide tóm tắt 5-10 phút (công ty, vai trò, 2-3 thành quả cụ thể)
[ ] Sẵn sàng trả lời ngắn bằng tiếng Hàn nếu được hỏi
[ ] Dự đoán câu hỏi: "Khó khăn lớn nhất của bạn là gì và bạn giải quyết thế nào?"
[ ] Mang theo nhật ký làm bằng chứng dự phòng
</code></pre>
<h3>Định hướng nghề nghiệp sau OJT</h3>
<p>Xem kỳ thực tập này là một dữ liệu thật để định hướng, không chỉ là môn học cần qua:</p>
<ul>
<li>Xin thư giới thiệu hoặc đề xuất trên LinkedIn nếu bạn làm tốt — thư giới thiệu từ công ty Hàn có giá trị thật với công việc tiếng Hàn về sau.</li>
<li>Tự nhìn lại trung thực: biên-phiên dịch, hành chính-nhân sự, hay mảng kinh doanh phù hợp với bạn hơn? Dùng điều đó để đặt mục tiêu TOPIK tiếp theo và định hướng tìm việc.</li>
<li>Giữ liên lạc với người hướng dẫn và mạng lưới 선배 — nhiều việc làm tiếng Hàn được tuyển qua giới thiệu.</li>
</ul>
<div class="callout"><span class="badge">Đây là một chuỗi, không phải điểm kết thúc</span> Một kỳ OJT tốt thường dẫn đến lời mời làm việc tại chính công ty đó, hoặc ít nhất một thư giới thiệu mở ra cơ hội tiếp theo — hãy đối xử với tuần cuối cùng như tuần đầu tiên.</div>`,
  ]]);

const c8q = quiz('ojk202-quiz-8', 'Quiz 8 — Evaluation & career|||Quiz 8 — Đánh giá & định hướng nghề', [
  { id: 'q1', question: 'Thiếu phiếu đánh giá của doanh nghiệp có thể ảnh hưởng thế nào đến điểm thực tập?', options: ['Không ảnh hưởng gì', 'Có thể chặn điểm dù nội dung làm việc tốt, nên phải xin sớm', 'Chỉ ảnh hưởng nhẹ 1 điểm', 'Trường sẽ tự bỏ qua yêu cầu này'], correctIndex: 1, explanation: 'Phiếu đánh giá là một trong ba cấu phần bắt buộc; thiếu có thể chặn điểm toàn phần.' },
  { id: 'q2', question: 'Khi chuẩn bị buổi bảo vệ thực tập, thực tập sinh nên chuẩn bị gì?', options: ['Không cần chuẩn bị gì trước', 'Tóm tắt ngắn gọn công ty/vai trò/kết quả cụ thể và sẵn sàng trả lời câu hỏi', 'Chỉ cần mang theo CV cũ', 'Chỉ cần thuộc lòng báo cáo không cần hiểu'], correctIndex: 1, explanation: 'Chuẩn bị nội dung tóm tắt và hiểu rõ báo cáo giúp trả lời tốt phần hỏi-đáp.' },
  { id: 'q3', question: 'Sau kỳ thực tập, việc nào giúp ích cho định hướng nghề nghiệp tiếng Hàn lâu dài?', options: ['Cắt liên lạc với công ty ngay khi kết thúc', 'Xin thư giới thiệu/đề xuất và giữ liên lạc với người hướng dẫn, mạng lưới 선배', 'Không cần đánh giá lại bản thân phù hợp mảng nào', 'Chỉ dựa vào may mắn cho công việc tiếp theo'], correctIndex: 1, explanation: 'Thư giới thiệu và mạng lưới quan hệ là nguồn cơ hội việc làm quan trọng cho sinh viên Ngôn ngữ Hàn.' },
]);

export default {
  semester: { code: 'FPTU_Hola6', name: 'Kỳ 6 — Thực tập', ordinal: 8 },
  course: {
    courseCode: 'OJK202',
    slug: 'ojk202-on-the-job-training',
    title: 'On-The-Job Training',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/OJK202.webp',
    shortDescription: 'On-the-Job Training for Ngon ngu Han students — 8 stages: finding a Korean-language position, bilingual resume, workplace culture, ethics, journaling, teamwork, report & defense. Bilingual, Korean terms & quizzes.|||Thực tập doanh nghiệp cho sinh viên Ngôn ngữ Hàn — 8 giai đoạn: tìm vị trí dùng tiếng Hàn, CV song ngữ, văn hoá công sở, đạo đức nghề, ghi nhật ký, làm việc nhóm, báo cáo & bảo vệ. Song ngữ, có thuật ngữ Hàn & quiz.',
    description: 'Môn <strong>OJK202 — On-the-Job Training</strong> (Thực tập doanh nghiệp, Kỳ 6) dành cho sinh viên ngành Ngôn ngữ Hàn. Khung bài học bám theo <strong>8 giai đoạn thực tập thực tế</strong> — từ <strong>tìm vị trí dùng tiếng Hàn</strong> (biên-phiên dịch, trợ lý, nhân viên công ty Hàn) → <strong>CV song ngữ &amp; phỏng vấn</strong> → <strong>hoà nhập văn hoá công sở Hàn</strong> (존댓말, 선배/후배, 회식) → <strong>đạo đức nghề</strong> → <strong>thực hiện công việc &amp; ghi nhật ký</strong> → <strong>giao tiếp, làm việc nhóm</strong> → <strong>viết báo cáo</strong> → <strong>đánh giá, bảo vệ &amp; định hướng nghề nghiệp</strong>. Song ngữ Anh-Việt, có thuật ngữ tiếng Hàn (Hangeul + romaja), quiz mỗi giai đoạn.',
    whatYouLearn: 'Tìm và ứng tuyển vị trí dùng tiếng Hàn; viết CV/이력서 và tự giới thiệu song ngữ; kỹ năng phỏng vấn; văn hoá công sở Hàn (kính ngữ, sunbae/hubae, hoesik); kỹ năng làm việc chuyên nghiệp và đạo đức nghề (bảo mật, trung thực); biên-phiên dịch cơ bản và ghi nhật ký thực tập; giao tiếp, làm việc nhóm, xử lý tình huống; viết báo cáo thực tập; chuẩn bị bảo vệ và định hướng nghề nghiệp tiếng Hàn.',
    requirements: 'Đã hoàn thành các môn tiếng Hàn và nghiệp vụ theo khung chương trình trước Kỳ 6; đã đăng ký vị trí thực tập theo quy định OJT của FPTU (xem FLM).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Quy định thực tập FLM, LinkedIn Learning, trang tìm việc/TOPIK, mẫu CV/nhật ký/báo cáo.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'OJT là gì, 8 giai đoạn, 3 sản phẩm bắt buộc, rubric chấm điểm.', lessons: [intro] },
    { title: 'Giai đoạn 1 — Chuẩn bị & tìm doanh nghiệp|||Stage 1 — Preparation & job search', description: 'Vị trí dùng tiếng Hàn, kênh tìm việc, checklist hồ sơ.', lessons: [c1, c1q] },
    { title: 'Giai đoạn 2 — CV song ngữ & phỏng vấn|||Stage 2 — Bilingual CV & interview', description: '이력서, 자기소개서, nghi thức phỏng vấn.', lessons: [c2, c2q] },
    { title: 'Giai đoạn 3 — Hoà nhập văn hoá công ty Hàn|||Stage 3 — Korean corporate culture', description: '존댓말, 선배/후배, 회식, nghi thức công sở.', lessons: [c3, c3q] },
    { title: 'Giai đoạn 4 — Kỹ năng & đạo đức nghề|||Stage 4 — Professional skills & ethics', description: 'Quản lý thời gian, bảo mật, trung thực khi mắc lỗi.', lessons: [c4, c4q] },
    { title: 'Giai đoạn 5 — Thực hiện việc & ghi nhật ký|||Stage 5 — On the job & journal', description: 'Biên-phiên dịch thực tế, mẫu nhật ký hằng ngày.', lessons: [c5, c5q] },
    { title: 'Giai đoạn 6 — Giao tiếp, làm việc nhóm & xử lý tình huống|||Stage 6 — Teamwork & situations', description: 'Phản hồi gián tiếp, hoà khí nhóm, khi nào báo lên trường.', lessons: [c6, c6q] },
    { title: 'Giai đoạn 7 — Viết báo cáo thực tập|||Stage 7 — Writing the report', description: 'Cấu trúc báo cáo, checklist chất lượng, khớp với nhật ký.', lessons: [c7, c7q] },
    { title: 'Giai đoạn 8 — Đánh giá, bảo vệ & định hướng nghề nghiệp|||Stage 8 — Evaluation, defense & career', description: 'Ba cấu phần chấm điểm, chuẩn bị bảo vệ, định hướng nghề tiếng Hàn.', lessons: [c8, c8q] },
  ],
};
