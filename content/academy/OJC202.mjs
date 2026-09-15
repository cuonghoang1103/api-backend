/**
 * OJC202 — On-the-Job Training (Thực tập doanh nghiệp), ngành Ngôn ngữ Trung,
 * FPTU, Kỳ 6 — Thực tập. Đây là môn THỰC TẬP (OJT): khung theo 8 GIAI ĐOẠN của
 * kỳ thực tập (chuẩn bị → xin việc → hoà nhập → đạo đức nghề → thực hiện công
 * việc & nhật ký → làm việc nhóm → báo cáo → đánh giá/bảo vệ/định hướng nghề),
 * KHÔNG phải 8 chương lý thuyết. Định hướng vị trí dùng tiếng Trung: biên-phiên
 * dịch, trợ lý thương mại, nhân viên công ty Trung/FDI. Song ngữ.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức giai đoạn.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('ojc202-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Quy định thực tập FPTU (FLM), LinkedIn Learning, nguồn tiếng Trung thương mại, mẫu nhật ký/báo cáo, lộ trình 8 giai đoạn.',
  [[
    `<span class="eyebrow">OJC202 · Materials</span>
<h2>On-the-Job Training — resource hub</h2>
<p class="lead">Everything for your internship (OJT) — for <strong>Chinese Language</strong> students aiming at Chinese-speaking roles (translator/interpreter, trade assistant, staff at a China-invested/FDI company). The official internship regulations live on <strong>FLM</strong>; below are free resources to prepare.</p>
<h3>📘 Internship regulations &amp; forms</h3>
<p>The official FPTU on-the-job training regulation, logbook template, report template and company evaluation form are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account and check your OJT course page for the current semester's exact checklist and deadlines.</p>
<h3>🎓 Career &amp; workplace skills</h3>
<ul>
<li><a href="https://www.linkedin.com/learning/" target="_blank" rel="noopener">LinkedIn Learning</a> — courses on resumes, interviewing, workplace communication and professional etiquette (many free with a student account).</li>
<li><a href="https://www.linkedin.com/" target="_blank" rel="noopener">LinkedIn</a> — build a profile, follow companies that hire Chinese-speaking staff, and network with alumni already interning.</li>
</ul>
<h3>🀄 Business Chinese</h3>
<ul>
<li><a href="http://www.chinesetest.cn/" target="_blank" rel="noopener">Hanban / Chinese Test (HSK official)</a> — HSK/HSKK levels and sample tests, the benchmark most employers ask for.</li>
<li><a href="https://www.chinesetest.cn/gonewcontent.do" target="_blank" rel="noopener">HSK Standard Course materials</a> — vocabulary and listening practice, including workplace topics.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li>Search "职场文化" (workplace culture) or "面试技巧" (interview skills) on YouTube for native explanations of Chinese office norms and interview phrasing.</li>
<li>Search "商务汉语" (business Chinese) for short listening/vocabulary drills relevant to trade and office settings.</li>
</ul>
<h3>🛠️ Templates you will actually use</h3>
<p>A daily/weekly <strong>logbook</strong>, an <strong>internship report</strong> outline, and a <strong>bilingual CV</strong> template are given in Stage 2, 5 and 7 below — copy them into your own document from day one instead of writing from a blank page at the end.</p>
<div class="callout"><span class="badge">8-stage roadmap</span>
<ol>
<li>Preparation &amp; finding an employer that uses Chinese</li>
<li>Bilingual CV, interview &amp; job-hunting skills</li>
<li>Onboarding &amp; company culture (especially Chinese companies)</li>
<li>Professional conduct &amp; work ethics</li>
<li>Doing the work (translation/interpreting, Chinese communication) &amp; logging it</li>
<li>Communication, teamwork &amp; handling workplace situations</li>
<li>Writing the internship report</li>
<li>Evaluation, defense &amp; career direction in Chinese-language work</li>
</ol></div>`,
    `<span class="eyebrow">OJC202 · Tài liệu</span>
<h2>Trung tâm tài liệu — Thực tập doanh nghiệp</h2>
<p class="lead">Mọi thứ cho kỳ thực tập (OJT) — dành cho sinh viên <strong>Ngôn ngữ Trung</strong> hướng tới vị trí dùng tiếng Trung (biên-phiên dịch, trợ lý thương mại, nhân viên công ty Trung/FDI). Quy định thực tập chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí để chuẩn bị.</p>
<h3>📘 Quy định &amp; biểu mẫu thực tập</h3>
<p>Quy định OJT chính thức, mẫu nhật ký, mẫu báo cáo và phiếu đánh giá của doanh nghiệp có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU và xem trang môn OJT của học kỳ hiện tại để biết checklist &amp; hạn nộp chính xác.</p>
<h3>🎓 Kỹ năng nghề nghiệp &amp; công sở</h3>
<ul>
<li><a href="https://www.linkedin.com/learning/" target="_blank" rel="noopener">LinkedIn Learning</a> — khoá học về CV, phỏng vấn, giao tiếp công sở, tác phong chuyên nghiệp (nhiều khoá miễn phí với tài khoản sinh viên).</li>
<li><a href="https://www.linkedin.com/" target="_blank" rel="noopener">LinkedIn</a> — dựng hồ sơ, theo dõi công ty tuyển vị trí tiếng Trung, kết nối với cựu sinh viên đang thực tập.</li>
</ul>
<h3>🀄 Tiếng Trung thương mại</h3>
<ul>
<li><a href="http://www.chinesetest.cn/" target="_blank" rel="noopener">Hanban / Chinese Test (HSK chính thức)</a> — các bậc HSK/HSKK và đề mẫu, chuẩn mà nhiều nhà tuyển dụng yêu cầu.</li>
<li><a href="https://www.chinesetest.cn/gonewcontent.do" target="_blank" rel="noopener">Tài liệu HSK Standard Course</a> — từ vựng và luyện nghe, có cả chủ đề công sở.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li>Tìm "职场文化" (văn hoá công sở) hoặc "面试技巧" (kỹ năng phỏng vấn) trên YouTube để nghe giải thích bằng tiếng bản xứ về chuẩn mực công sở Trung Quốc và cách diễn đạt khi phỏng vấn.</li>
<li>Tìm "商务汉语" (tiếng Trung thương mại) để luyện nghe/từ vựng ngắn liên quan thương mại và văn phòng.</li>
</ul>
<h3>🛠️ Mẫu bạn sẽ dùng thật</h3>
<p>Mẫu <strong>nhật ký</strong> hằng ngày/tuần, đề cương <strong>báo cáo thực tập</strong>, và mẫu <strong>CV song ngữ</strong> nằm ở Giai đoạn 2, 5 và 7 bên dưới — chép vào tài liệu của riêng bạn ngay từ ngày đầu, đừng viết từ đầu vào lúc cuối kỳ.</p>
<div class="callout"><span class="badge">Lộ trình 8 giai đoạn</span>
<ol>
<li>Chuẩn bị &amp; tìm doanh nghiệp/vị trí dùng tiếng Trung</li>
<li>CV song ngữ, phỏng vấn &amp; kỹ năng xin việc</li>
<li>Hoà nhập môi trường &amp; văn hoá công ty (đặc biệt công ty Trung)</li>
<li>Tác phong chuyên nghiệp &amp; đạo đức nghề</li>
<li>Thực hiện công việc (dịch, giao tiếp tiếng Trung) &amp; ghi nhật ký</li>
<li>Giao tiếp, làm việc nhóm &amp; xử lý tình huống công sở</li>
<li>Viết báo cáo thực tập</li>
<li>Đánh giá, bảo vệ &amp; định hướng nghề nghiệp tiếng Trung</li>
</ol></div>`,
  ]]);

const intro = doc('ojc202-0-1-overview', 'Course overview: On-the-Job Training|||Tổng quan: Thực tập doanh nghiệp',
  'OJT là gì; 3 deliverable bắt buộc (nhật ký, báo cáo, đánh giá doanh nghiệp); rubric tổng quan; lộ trình 8 giai đoạn.',
  [[
    `<span class="eyebrow">OJC202 · Lesson 0.1 · Overview</span>
<h2>On-the-Job Training (OJT)</h2>
<p class="lead">OJC202 is not a lecture course — it is a semester spent working inside a real company, applying your <strong>Chinese Language</strong> skills to actual tasks (translation, interpreting, client-facing communication, documentation). Your grade comes from what you produce during that time, not from an exam.</p>
<h3>Three deliverables you are graded on</h3>
<ul>
<li><strong>Logbook (nhật ký thực tập)</strong> — a daily or weekly record of tasks done, hours, and what you learned. Kept continuously, not reconstructed at the end.</li>
<li><strong>Internship report (báo cáo thực tập)</strong> — a structured write-up of the company, your role, the tasks you performed, and what you took away — see Stage 7.</li>
<li><strong>Company evaluation (đánh giá của doanh nghiệp)</strong> — your workplace supervisor rates your attitude, discipline and competence on a school-provided form.</li>
</ul>
<h3>What a rubric usually weighs</h3>
<pre><code>Typical weighting (confirm the exact % on FLM for your term):
 - Attitude &amp; discipline at the workplace   (supervisor evaluation)
 - Professional / language competence        (tasks completed, Chinese used correctly)
 - Logbook quality                            (consistency, specificity, reflection)
 - Report quality &amp; defense                  (structure, clarity, honesty about gaps)
</code></pre>
<h3>Roadmap</h3>
<p>Prepare &amp; find an employer that uses Chinese → bilingual CV &amp; interview → onboarding &amp; company culture → professional ethics → do the work &amp; log it → teamwork &amp; handling situations → write the report → evaluation, defense &amp; career direction.</p>
<div class="callout"><span class="badge">Start the logbook on day one</span> The single most common mistake is treating the logbook as an afterthought. Write a few honest lines every day — it is both your grade material and the raw notes your final report will be built from.</div>`,
    `<span class="eyebrow">OJC202 · Bài 0.1 · Tổng quan</span>
<h2>Thực tập doanh nghiệp (OJT)</h2>
<p class="lead">OJC202 không phải môn học lý thuyết — đây là một học kỳ bạn làm việc thật trong một doanh nghiệp, dùng năng lực <strong>Ngôn ngữ Trung</strong> vào công việc thực tế (dịch nói/viết, giao tiếp với khách hàng, soạn văn bản). Điểm số đến từ những gì bạn tạo ra trong thời gian đó, không phải từ một bài thi.</p>
<h3>Ba sản phẩm bắt buộc để chấm điểm</h3>
<ul>
<li><strong>Nhật ký thực tập</strong> — ghi lại công việc, giờ làm, và điều học được theo ngày hoặc tuần. Ghi liên tục, không dựng lại vào phút chót.</li>
<li><strong>Báo cáo thực tập</strong> — bài viết có cấu trúc về doanh nghiệp, vai trò của bạn, công việc đã làm, và những gì rút ra được — xem Giai đoạn 7.</li>
<li><strong>Đánh giá của doanh nghiệp</strong> — người quản lý trực tiếp chấm thái độ, kỷ luật và năng lực của bạn theo phiếu do trường cung cấp.</li>
</ul>
<h3>Rubric thường chấm những gì</h3>
<pre><code>Trọng số tham khảo (xem % chính xác của kỳ bạn trên FLM):
 - Thái độ &amp; kỷ luật tại nơi thực tập      (doanh nghiệp đánh giá)
 - Năng lực chuyên môn/ngôn ngữ              (hoàn thành việc, dùng tiếng Trung đúng)
 - Chất lượng nhật ký                        (đều đặn, cụ thể, có suy ngẫm)
 - Chất lượng báo cáo &amp; bảo vệ              (cấu trúc, rõ ràng, trung thực về hạn chế)
</code></pre>
<h3>Lộ trình</h3>
<p>Chuẩn bị &amp; tìm doanh nghiệp dùng tiếng Trung → CV &amp; phỏng vấn song ngữ → hoà nhập &amp; văn hoá công ty → đạo đức nghề → thực hiện công việc &amp; ghi nhật ký → làm việc nhóm &amp; xử lý tình huống → viết báo cáo → đánh giá, bảo vệ &amp; định hướng nghề nghiệp.</p>
<div class="callout"><span class="badge">Ghi nhật ký từ ngày đầu</span> Lỗi phổ biến nhất là coi nhật ký như việc phụ, làm sau cùng. Viết vài dòng thật mỗi ngày — đó vừa là điểm số, vừa là ghi chú thô để dựng báo cáo cuối kỳ.</div>`,
  ]]);

const g1 = doc('ojc202-1-1-chuan-bi-tim-doanh-nghiep', 'Stage 1 — Preparation & finding an employer that uses Chinese|||Giai đoạn 1 — Chuẩn bị & tìm doanh nghiệp/vị trí dùng tiếng Trung',
  'Tự đánh giá năng lực (HSK, kỹ năng dịch), kênh tìm việc dùng tiếng Trung, tiêu chí chọn doanh nghiệp phù hợp ngành Ngôn ngữ Trung.',
  [[
    `<span class="eyebrow">OJC202 · Stage 1</span>
<h2>Preparation &amp; finding an employer that uses Chinese</h2>
<h3>Know what you can offer</h3>
<ul>
<li><strong>Chinese proficiency</strong> — your current HSK/HSKK level (or equivalent coursework), plus any specialty vocabulary (trade, tourism, technical) you already have.</li>
<li><strong>Translation samples</strong> — a short portfolio: a translated document, a subtitled clip, or class assignments you can show.</li>
<li><strong>Other skills</strong> — Office tools, basic English, and any prior part-time work relevant to an office environment.</li>
</ul>
<h3>Where to look for Chinese-language roles</h3>
<ul>
<li>Companies with <strong>Chinese/Taiwanese FDI investment</strong> — manufacturing, electronics, footwear — often need a Chinese-Vietnamese interpreter or assistant on the floor.</li>
<li><strong>Import-export / trading companies</strong> that source from or sell to China need staff who can call suppliers and translate contracts/emails.</li>
<li><strong>Translation &amp; localization agencies</strong>, and <strong>tourism</strong> companies serving Chinese-speaking visitors.</li>
<li>Job boards (VietnamWorks, TopCV, LinkedIn), your faculty's internship partner list, and alumni already working at such companies.</li>
</ul>
<h3>Choosing well, not just fast</h3>
<pre><code>Checklist before you commit to an offer:
 [ ] The role actually uses Chinese (not just "nice to have" on paper)
 [ ] A named supervisor will be assigned to evaluate you
 [ ] Working hours fit the semester's OJT duration
 [ ] The company is willing to sign the school's internship agreement
 [ ] You can picture writing a real report about the tasks, in 4 months
</code></pre>
<div class="callout"><span class="badge">Apply early, apply to several</span> Confirmed placements can fall through. Send bilingual applications (Stage 2) to 3-5 employers in parallel rather than waiting on one reply.</div>`,
    `<span class="eyebrow">OJC202 · Giai đoạn 1</span>
<h2>Chuẩn bị &amp; tìm doanh nghiệp/vị trí dùng tiếng Trung</h2>
<h3>Biết mình có gì để chào hàng</h3>
<ul>
<li><strong>Trình độ tiếng Trung</strong> — bậc HSK/HSKK hiện tại (hoặc học phần tương đương), cộng từ vựng chuyên ngành đã có (thương mại, du lịch, kỹ thuật).</li>
<li><strong>Mẫu dịch thuật</strong> — một portfolio ngắn: một văn bản đã dịch, một clip đã làm phụ đề, hoặc bài tập trên lớp có thể cho xem.</li>
<li><strong>Kỹ năng khác</strong> — Office, tiếng Anh cơ bản, và việc làm thêm liên quan môi trường văn phòng (nếu có).</li>
</ul>
<h3>Tìm vị trí dùng tiếng Trung ở đâu</h3>
<ul>
<li>Công ty có <strong>vốn đầu tư Trung/Đài</strong> — sản xuất, điện tử, giày da — thường cần trợ lý/phiên dịch Trung-Việt tại xưởng.</li>
<li><strong>Công ty xuất nhập khẩu / thương mại</strong> mua bán với Trung Quốc cần người gọi điện cho nhà cung cấp và dịch hợp đồng/email.</li>
<li><strong>Công ty dịch thuật &amp; bản địa hoá</strong>, và <strong>du lịch</strong> phục vụ khách nói tiếng Trung.</li>
<li>Trang tuyển dụng (VietnamWorks, TopCV, LinkedIn), danh sách đối tác thực tập của khoa, và cựu sinh viên đang làm ở các công ty như vậy.</li>
</ul>
<h3>Chọn kỹ, không chỉ chọn nhanh</h3>
<pre><code>Checklist trước khi nhận lời mời:
 [ ] Vị trí thật sự dùng tiếng Trung (không chỉ ghi cho có)
 [ ] Có người quản lý cụ thể sẽ đánh giá bạn
 [ ] Giờ làm phù hợp thời lượng OJT của kỳ
 [ ] Doanh nghiệp đồng ý ký thoả thuận thực tập với trường
 [ ] Bạn hình dung được sẽ viết báo cáo gì về công việc này, sau 4 tháng
</code></pre>
<div class="callout"><span class="badge">Nộp sớm, nộp nhiều nơi</span> Chỗ đã nhận có thể đổi ý. Gửi hồ sơ song ngữ (Giai đoạn 2) cho 3-5 doanh nghiệp song song, đừng chỉ chờ một nơi trả lời.</div>`,
  ]]);

const g1q = quiz('ojc202-quiz-1', 'Quiz 1 — Preparation & job search|||Quiz 1 — Chuẩn bị & tìm việc', [
  { id: 'q1', question: 'Loại doanh nghiệp nào PHÙ HỢP NHẤT để thực tập vị trí dùng tiếng Trung?', options: ['Bất kỳ công ty nào miễn có lương', 'Công ty có vốn đầu tư Trung Quốc/Đài Loan hoặc giao thương với Trung Quốc', 'Công ty chỉ làm việc bằng tiếng Anh', 'Công ty không có người quản lý cố định'], correctIndex: 1, explanation: 'Cần chọn nơi vị trí thực sự dùng tiếng Trung, như doanh nghiệp FDI Trung/Đài hoặc xuất nhập khẩu với Trung Quốc.' },
  { id: 'q2', question: 'Trước khi nhận lời mời thực tập, điều KHÔNG nên bỏ qua là?', options: ['Kiểm tra công ty có ký thoả thuận thực tập với trường không', 'Kiểm tra công ty có phòng ăn đẹp không', 'Kiểm tra công ty có wifi mạnh không', 'Kiểm tra công ty có xa nhà không, bỏ qua mọi tiêu chí khác'], correctIndex: 0, explanation: 'Thoả thuận thực tập với trường và có người quản lý đánh giá là điều kiện bắt buộc để OJT được công nhận.' },
  { id: 'q3', question: 'Vì sao nên nộp hồ sơ cho nhiều doanh nghiệp song song thay vì chỉ chờ một nơi?', options: ['Vì quy định bắt buộc phải nộp ít nhất 5 nơi', 'Vì chỗ đã nhận lời có thể đổi ý, nộp nhiều nơi giảm rủi ro mất thời gian', 'Vì lương sẽ cao hơn nếu nộp nhiều nơi', 'Vì trường chỉ chấp nhận nếu có nhiều thư mời'], correctIndex: 1, explanation: 'Nộp song song nhiều nơi tránh việc mất cả kỳ nếu nơi duy nhất đã liên hệ rút lại lời mời.' },
]);

const g2 = doc('ojc202-2-1-cv-song-ngu-phong-van', 'Stage 2 — Bilingual CV, interview & job-hunting skills|||Giai đoạn 2 — CV song ngữ, phỏng vấn & kỹ năng xin việc',
  'Cấu trúc CV song ngữ Trung-Việt, trình bày trình độ HSK, phỏng vấn bằng tiếng Trung cơ bản, câu hỏi thường gặp.',
  [[
    `<span class="eyebrow">OJC202 · Stage 2</span>
<h2>Bilingual CV, interview &amp; job-hunting skills</h2>
<h3>A Chinese-Vietnamese CV, side by side</h3>
<p>Keep both languages on the same page (or two matching pages) so a Chinese-speaking manager and a Vietnamese HR reviewer can each read their half without translating for you.</p>
<pre><code>CV sections (bilingual header for each):
 姓名 / Họ tên          出生日期 / Ngày sinh
 联系方式 / Liên hệ      求职意向 / Vị trí ứng tuyển
 教育背景 / Học vấn — trường, chuyên ngành, HSK/HSKK level
 语言能力 / Năng lực ngôn ngữ — Chinese: HSKx, HSKKx; Vietnamese: native; English: level
 实习/工作经验 / Kinh nghiệm — task, not just job title
 技能 / Kỹ năng — translation tools, Office, typing speed (Chinese input)
</code></pre>
<h3>Common interview questions in Chinese</h3>
<ul>
<li><em>请介绍一下你自己。</em> (Qǐng jièshào yíxià nǐ zìjǐ.) — "Please introduce yourself" — prepare a 60-90 second answer, don't just read your CV aloud.</li>
<li><em>你为什么想来我们公司实习？</em> (Nǐ wèishénme xiǎng lái wǒmen gōngsī shíxí?) — "Why intern at our company?" — mention what the role lets you practice.</li>
<li><em>你的中文水平怎么样？</em> (Nǐ de zhōngwén shuǐpíng zěnmeyàng?) — "How is your Chinese level?" — answer honestly with your HSK level and one concrete example.</li>
</ul>
<h3>Job-hunting etiquette</h3>
<p>Reply to emails/messages within a day, confirm interview time in writing, and if you accept an offer, actually withdraw other pending applications — a small field, word travels.</p>
<div class="callout"><span class="badge">Practice out loud</span> Rehearse the three questions above with a classmate before a real interview — reading pinyin silently is not the same skill as speaking it under pressure.</div>`,
    `<span class="eyebrow">OJC202 · Giai đoạn 2</span>
<h2>CV song ngữ, phỏng vấn &amp; kỹ năng xin việc</h2>
<h3>CV Trung-Việt, đặt song song</h3>
<p>Giữ cả hai ngôn ngữ trên cùng một trang (hoặc hai trang khớp nhau) để người quản lý nói tiếng Trung và nhân sự người Việt đều đọc được phần của họ mà không cần bạn dịch lại.</p>
<pre><code>Các mục trong CV (tiêu đề song ngữ mỗi mục):
 姓名 / Họ tên          出生日期 / Ngày sinh
 联系方式 / Liên hệ      求职意向 / Vị trí ứng tuyển
 教育背景 / Học vấn — trường, chuyên ngành, bậc HSK/HSKK
 语言能力 / Năng lực ngôn ngữ — Trung: HSKx, HSKKx; Việt: bản ngữ; Anh: bậc
 实习/工作经验 / Kinh nghiệm — mô tả việc đã làm, không chỉ chức danh
 技能 / Kỹ năng — công cụ dịch, Office, tốc độ gõ tiếng Trung
</code></pre>
<h3>Câu hỏi phỏng vấn thường gặp bằng tiếng Trung</h3>
<ul>
<li><em>请介绍一下你自己。</em> (Qǐng jièshào yíxià nǐ zìjǐ.) — "Hãy giới thiệu về bản thân" — chuẩn bị câu trả lời 60-90 giây, đừng chỉ đọc lại CV.</li>
<li><em>你为什么想来我们公司实习？</em> (Nǐ wèishénme xiǎng lái wǒmen gōngsī shíxí?) — "Vì sao muốn thực tập ở công ty chúng tôi?" — nêu điều vị trí này giúp bạn rèn luyện.</li>
<li><em>你的中文水平怎么样？</em> (Nǐ de zhōngwén shuǐpíng zěnmeyàng?) — "Trình độ tiếng Trung của bạn thế nào?" — trả lời trung thực kèm bậc HSK và một ví dụ cụ thể.</li>
</ul>
<h3>Phép lịch sự khi xin việc</h3>
<p>Trả lời email/tin nhắn trong ngày, xác nhận giờ phỏng vấn bằng văn bản, và nếu đã nhận lời một nơi thì thật sự rút hồ sơ ở nơi khác — cộng đồng nhỏ, tin đồn lan nhanh.</p>
<div class="callout"><span class="badge">Luyện nói thành tiếng</span> Tập ba câu trên với bạn học trước khi phỏng vấn thật — đọc pinyin thầm trong đầu khác hẳn kỹ năng nói ra dưới áp lực.</div>`,
  ]]);

const g2q = quiz('ojc202-quiz-2', 'Quiz 2 — CV & interview|||Quiz 2 — CV & phỏng vấn', [
  { id: 'q1', question: 'CV song ngữ Trung-Việt nên trình bày thế nào?', options: ['Chỉ viết tiếng Trung, người Việt tự dịch', 'Đặt hai ngôn ngữ song song để cả người quản lý nói tiếng Trung và nhân sự người Việt đều đọc được', 'Chỉ viết tiếng Việt vì công ty ở Việt Nam', 'Trộn lẫn hai ngôn ngữ trong cùng một câu'], correctIndex: 1, explanation: 'Song ngữ song song giúp cả hai phía đọc được phần của mình mà không cần dịch lại.' },
  { id: 'q2', question: 'Khi được hỏi "你的中文水平怎么样？" (trình độ tiếng Trung của bạn), nên trả lời thế nào?', options: ['Nói "rất giỏi" chung chung để gây ấn tượng', 'Trả lời trung thực kèm bậc HSK và một ví dụ cụ thể', 'Từ chối trả lời vì câu hỏi riêng tư', 'Đổi sang tiếng Anh để tránh nói sai'], correctIndex: 1, explanation: 'Trả lời trung thực, cụ thể (bậc HSK + ví dụ) đáng tin hơn nhận xét chung chung.' },
  { id: 'q3', question: 'Vì sao nên luyện nói to các câu trả lời phỏng vấn tiếng Trung trước, thay vì chỉ đọc thầm?', options: ['Vì đọc thầm không tốn thời gian', 'Vì nói dưới áp lực là kỹ năng khác với đọc pinyin thầm trong đầu', 'Vì giám khảo yêu cầu phải nói to khi ôn bài', 'Vì đọc thầm sẽ bị tính gian lận'], correctIndex: 1, explanation: 'Phản xạ nói thành tiếng dưới áp lực phỏng vấn khác với việc đọc hiểu thầm — cần luyện riêng.' },
]);

const g3 = doc('ojc202-3-1-hoa-nhap-van-hoa-cong-ty', 'Stage 3 — Onboarding & company culture (especially Chinese companies)|||Giai đoạn 3 — Hoà nhập môi trường & văn hoá công ty (đặc biệt công ty Trung)',
  'Tuần đầu tiên, tôn ti trật tự, 关系/面子, cách xưng hô, giờ giấc và quy tắc bất thành văn ở công ty Trung Quốc.',
  [[
    `<span class="eyebrow">OJC202 · Stage 3</span>
<h2>Onboarding &amp; company culture</h2>
<h3>Your first week</h3>
<p>Arrive early, observe before acting, ask where to sit/eat/park, and write down every name and role you're introduced to — you'll need them for the logbook and later for your report's org chart.</p>
<h3>Two ideas that shape Chinese workplaces</h3>
<ul>
<li><strong>关系 (guānxi)</strong> — relationships built over time through small courtesies (greeting people, remembering details, helping without being asked). Trust is earned slowly, not through one impressive presentation.</li>
<li><strong>面子 (miànzi)</strong> — "face"/reputation. Never correct or contradict a colleague or supervisor in front of others; raise concerns privately.</li>
</ul>
<h3>Address people correctly</h3>
<pre><code>Address by title, not just name:
 老板 (lǎobǎn)   — boss/owner
 经理 (jīnglǐ)   — manager
 师傅 (shīfu)    — "master"/senior colleague who trains you (factory/craft settings)
 同事 (tóngshì)  — colleague, peer level

Small phrases that carry real weight:
 辛苦了 (xīnkǔ le)      — "you've worked hard" — say it to colleagues after a busy day
 请多指教 (qǐng duō zhǐjiào) — "please guide me" — use when you're new and asking for help
</code></pre>
<h3>Unwritten rules</h3>
<p>Punctuality is taken seriously — arrive a few minutes early, not exactly on time. Hierarchy matters in meetings: let the most senior person speak first. Overtime culture varies by company; observe what's normal before assuming.</p>
<div class="callout"><span class="badge">Mistakes here are logbook material</span> A misunderstanding about hierarchy or timing is not a failure to hide — write it in your logbook as "what I learned" — that reflection is exactly what the report rubric rewards.</div>`,
    `<span class="eyebrow">OJC202 · Giai đoạn 3</span>
<h2>Hoà nhập môi trường &amp; văn hoá công ty</h2>
<h3>Tuần đầu tiên</h3>
<p>Đến sớm, quan sát trước khi hành động, hỏi chỗ ngồi/ăn/gửi xe, và ghi lại tên cùng vai trò của mọi người được giới thiệu — bạn sẽ cần cho nhật ký và sau này cho sơ đồ tổ chức trong báo cáo.</p>
<h3>Hai khái niệm định hình công sở Trung Quốc</h3>
<ul>
<li><strong>关系 (guānxi)</strong> — quan hệ được xây dần qua những cử chỉ nhỏ (chào hỏi, nhớ chi tiết về nhau, giúp đỡ mà không cần nhờ). Niềm tin được xây chậm, không phải qua một bài thuyết trình ấn tượng.</li>
<li><strong>面子 (miànzi)</strong> — "thể diện". Đừng bao giờ sửa lưng hay phản bác đồng nghiệp/quản lý trước mặt người khác; góp ý riêng tư.</li>
</ul>
<h3>Xưng hô đúng cách</h3>
<pre><code>Gọi theo chức danh, không chỉ tên:
 老板 (lǎobǎn)   — chủ/sếp
 经理 (jīnglǐ)   — quản lý
 师傅 (shīfu)    — "sư phụ"/người hướng dẫn kỳ cựu (xưởng/nghề thủ công)
 同事 (tóngshì)  — đồng nghiệp, ngang cấp

Vài câu ngắn nhưng có sức nặng:
 辛苦了 (xīnkǔ le)      — "bạn đã vất vả rồi" — nói với đồng nghiệp sau ngày bận rộn
 请多指教 (qǐng duō zhǐjiào) — "mong được chỉ dạy" — dùng khi mới vào, xin hướng dẫn
</code></pre>
<h3>Quy tắc bất thành văn</h3>
<p>Đúng giờ được coi trọng — đến sớm vài phút, không phải đến đúng giờ. Tôn ti trong họp: để người cấp cao nhất phát biểu trước. Văn hoá làm thêm giờ khác nhau tuỳ công ty; quan sát trước khi mặc định.</p>
<div class="callout"><span class="badge">Sai ở đây là nguyên liệu cho nhật ký</span> Hiểu lầm về tôn ti hay giờ giấc không phải điều cần giấu — ghi vào nhật ký là "điều học được" — sự suy ngẫm đó chính là điều rubric báo cáo đánh giá cao.</div>`,
  ]]);

const g3q = quiz('ojc202-quiz-3', 'Quiz 3 — Onboarding & culture|||Quiz 3 — Hoà nhập & văn hoá', [
  { id: 'q1', question: '关系 (guānxi) trong công ty Trung Quốc được xây dựng chủ yếu bằng cách nào?', options: ['Một bài thuyết trình ấn tượng duy nhất', 'Những cử chỉ nhỏ, đều đặn theo thời gian: chào hỏi, nhớ chi tiết, giúp đỡ', 'Tặng quà đắt tiền ngay ngày đầu', 'Không cần xây dựng, tự nhiên sẽ có'], correctIndex: 1, explanation: 'Guanxi là quan hệ tin cậy xây dần qua hành xử nhỏ, lặp lại — không phải một lần ấn tượng.' },
  { id: 'q2', question: 'Khi phát hiện đồng nghiệp làm sai, nên xử lý thế nào để giữ 面子 (miànzi, thể diện)?', options: ['Sửa lưng ngay trước mặt mọi người để công bằng', 'Góp ý riêng tư, tránh làm mất thể diện trước người khác', 'Báo cáo thẳng lên sếp cao nhất ngay lập tức', 'Im lặng và không bao giờ nhắc tới'], correctIndex: 1, explanation: 'Góp ý riêng tư tôn trọng thể diện, tránh làm người khác mất mặt trước tập thể.' },
  { id: 'q3', question: 'Vì sao nên ghi những hiểu lầm văn hoá/tôn ti vào nhật ký thực tập thay vì giấu đi?', options: ['Vì quy định bắt buộc phải thú tội', 'Vì sự suy ngẫm về điều học được chính là điều rubric báo cáo/nhật ký đánh giá cao', 'Vì công ty sẽ kiểm tra nhật ký hằng ngày', 'Vì nhật ký không được sửa lại sau này'], correctIndex: 1, explanation: 'Ghi nhận + suy ngẫm về sai sót thể hiện quá trình học hỏi thật, được đánh giá cao hơn một nhật ký chỉ toàn thành công.' },
]);

const g4 = doc('ojc202-4-1-tac-phong-dao-duc-nghe', 'Stage 4 — Professional conduct & work ethics|||Giai đoạn 4 — Tác phong chuyên nghiệp & đạo đức nghề',
  'Đạo đức nghề phiên dịch (trung thực, bảo mật), quản lý thời gian, tuân thủ quy định, xử lý khi không hiểu/dịch sai.',
  [[
    `<span class="eyebrow">OJC202 · Stage 4</span>
<h2>Professional conduct &amp; work ethics</h2>
<h3>The interpreter's/assistant's ethical baseline</h3>
<ul>
<li><strong>Confidentiality</strong> — contracts, prices, client lists and internal conversations you translate or overhear stay inside the company. Do not repeat them, even to classmates, even after the internship ends.</li>
<li><strong>Accuracy over comfort</strong> — translate what was actually said, not a softened or guessed version. If you didn't catch something, ask again rather than invent an answer.</li>
<li><strong>Neutrality</strong> — in a negotiation or dispute between two sides, your job is accurate language transfer, not taking a side.</li>
</ul>
<h3>Everyday professionalism</h3>
<pre><code>Daily discipline checklist:
 [ ] On time, dressed to the company's norm, phone on silent during work
 [ ] Deadlines confirmed in writing (time zone/date spelled out, not "soon")
 [ ] Mistakes reported as soon as noticed, not hidden until asked
 [ ] Company property, files and access used only for assigned work
</code></pre>
<h3>What to do when you don't understand something</h3>
<p>In a language-heavy role, not understanding a term or accent will happen. The professional move is: ask a clarifying question immediately, or say plainly "let me confirm and get back to you" — never guess on something that goes into a contract, price, or safety instruction.</p>
<div class="callout"><span class="badge">Ethics violations end internships</span> Leaking a client list or a price sheet is treated the same as theft by most companies, and can end the internship agreement (and your grade) immediately. When in doubt, don't share it.</div>`,
    `<span class="eyebrow">OJC202 · Giai đoạn 4</span>
<h2>Tác phong chuyên nghiệp &amp; đạo đức nghề</h2>
<h3>Chuẩn đạo đức của người dịch/trợ lý</h3>
<ul>
<li><strong>Bảo mật</strong> — hợp đồng, giá cả, danh sách khách hàng và các cuộc trao đổi nội bộ bạn dịch hoặc nghe được phải ở lại trong công ty. Không lặp lại, kể cả với bạn học, kể cả sau khi kết thúc thực tập.</li>
<li><strong>Chính xác hơn dễ chịu</strong> — dịch đúng điều đã nói, không làm nhẹ đi hay đoán mò. Nếu chưa nghe rõ, hỏi lại thay vì bịa ra câu trả lời.</li>
<li><strong>Trung lập</strong> — trong đàm phán hay tranh chấp giữa hai bên, việc của bạn là chuyển ngữ chính xác, không đứng về phía nào.</li>
</ul>
<h3>Kỷ luật hằng ngày</h3>
<pre><code>Checklist kỷ luật mỗi ngày:
 [ ] Đúng giờ, trang phục theo chuẩn công ty, điện thoại im lặng khi làm việc
 [ ] Hạn chót xác nhận bằng văn bản (ghi rõ ngày giờ, không nói "sớm thôi")
 [ ] Báo lỗi ngay khi phát hiện, không giấu đến khi bị hỏi
 [ ] Tài sản, tệp và quyền truy cập của công ty chỉ dùng cho việc được giao
</code></pre>
<h3>Khi không hiểu điều gì đó</h3>
<p>Ở vị trí thiên về ngôn ngữ, việc không hiểu một thuật ngữ hay giọng nói là chuyện bình thường. Cách chuyên nghiệp: hỏi lại ngay để làm rõ, hoặc nói thẳng "để tôi xác nhận rồi phản hồi lại" — không bao giờ đoán mò với điều liên quan hợp đồng, giá cả, hay hướng dẫn an toàn.</p>
<div class="callout"><span class="badge">Vi phạm đạo đức có thể chấm dứt thực tập</span> Làm lộ danh sách khách hàng hay bảng giá bị nhiều công ty coi ngang với ăn cắp, có thể chấm dứt thoả thuận thực tập (và điểm số) ngay lập tức. Khi không chắc, đừng chia sẻ.</div>`,
  ]]);

const g4q = quiz('ojc202-quiz-4', 'Quiz 4 — Professional ethics|||Quiz 4 — Đạo đức nghề', [
  { id: 'q1', question: 'Khi dịch cho một cuộc đàm phán, người dịch nên giữ thái độ nào?', options: ['Trung lập, chuyển ngữ chính xác, không đứng về phía nào', 'Đứng về phía công ty đang thực tập để có lợi hơn', 'Làm nhẹ đi những câu gay gắt để hai bên vui vẻ', 'Bỏ qua phần không hiểu, dịch phần còn lại'], correctIndex: 0, explanation: 'Đạo đức nghề dịch yêu cầu trung lập và chính xác, không thiên vị hay tự ý sửa nội dung.' },
  { id: 'q2', question: 'Nếu không nghe rõ một thuật ngữ khi đang dịch, nên làm gì?', options: ['Đoán mò để cuộc trò chuyện không bị ngắt quãng', 'Hỏi lại để làm rõ, hoặc xin xác nhận rồi phản hồi sau', 'Im lặng bỏ qua phần đó', 'Tự ý thay bằng từ gần nghĩa mà không hỏi ai'], correctIndex: 1, explanation: 'Hỏi lại hoặc xác nhận trước khi phản hồi tránh sai sót nghiêm trọng, đặc biệt với hợp đồng/giá cả.' },
  { id: 'q3', question: 'Việc làm lộ danh sách khách hàng hoặc bảng giá của công ty thực tập có thể dẫn tới hậu quả gì?', options: ['Không sao vì chỉ là thực tập sinh', 'Có thể bị coi ngang với vi phạm nghiêm trọng, chấm dứt thoả thuận thực tập', 'Chỉ bị nhắc nhở nhẹ', 'Chỉ ảnh hưởng nếu công ty phát hiện sau khi kết thúc kỳ'], correctIndex: 1, explanation: 'Bảo mật thông tin doanh nghiệp là nguyên tắc đạo đức nghề cơ bản; vi phạm có thể chấm dứt thực tập ngay.' },
]);

const g5 = doc('ojc202-5-1-thuc-hien-cong-viec-nhat-ky', 'Stage 5 — Doing the work (translation & Chinese communication) & logging it|||Giai đoạn 5 — Thực hiện công việc (dịch, giao tiếp tiếng Trung) & ghi nhật ký',
  'Kỹ thuật dịch nói/viết cơ bản trong doanh nghiệp, cách ghi nhật ký thực tập cụ thể và có suy ngẫm, mẫu nhật ký.',
  [[
    `<span class="eyebrow">OJC202 · Stage 5</span>
<h2>Doing the work &amp; logging it</h2>
<h3>Basic on-the-job translation technique</h3>
<ul>
<li><strong>Written translation</strong> — read the whole document once before translating a line; keep a running glossary of company-specific terms (product names, department names) so your terminology stays consistent.</li>
<li><strong>Consecutive interpreting</strong> (e.g. in a meeting) — take short notes (numbers, names, key nouns), let the speaker finish a chunk, then render it; ask to slow down or repeat rather than lose the thread.</li>
<li><strong>Everyday phone/chat communication</strong> — confirm dates and amounts back explicitly ("确认一下，是 3 月 5 号 500 件" — "confirming: March 5th, 500 units") since misheard numbers are the most costly mistake.</li>
</ul>
<h3>What actually goes in a logbook entry</h3>
<pre><code>Daily/weekly logbook entry:
 Date:            ____________
 Task(s) done:    (be specific — "translated a 2-page supply contract",
                    not "did some translation")
 Chinese used:     new vocabulary/phrases encountered, any miscommunication
 Difficulty:       what was hard, and how you handled it
 What I learned:   one concrete takeaway, even a small one
 Hours:            ____________
</code></pre>
<h3>Why specificity matters</h3>
<p>"Translated documents" repeated 60 times tells your evaluator nothing and gives you nothing to build the final report from. "Translated the packing list for a 40ft container shipment, learned the term 装箱单 (zhuāngxiāngdān)" does both jobs at once.</p>
<div class="callout"><span class="badge">Log the same day</span> Details fade fast. A five-minute entry written the same evening beats a "reconstructed from memory" entry every time — and evaluators can usually tell the difference.</div>`,
    `<span class="eyebrow">OJC202 · Giai đoạn 5</span>
<h2>Thực hiện công việc &amp; ghi nhật ký</h2>
<h3>Kỹ thuật dịch cơ bản trong doanh nghiệp</h3>
<ul>
<li><strong>Dịch văn bản</strong> — đọc hết tài liệu một lượt trước khi dịch từng dòng; giữ một bảng thuật ngữ riêng của công ty (tên sản phẩm, tên phòng ban) để dùng nhất quán.</li>
<li><strong>Dịch nói đuổi</strong> (vd trong cuộc họp) — ghi chú ngắn (số liệu, tên riêng, danh từ chính), để người nói dứt một đoạn rồi mới dịch; xin nói chậm lại hoặc lặp lại thay vì đoán mò.</li>
<li><strong>Giao tiếp điện thoại/chat hằng ngày</strong> — xác nhận lại rõ ngày tháng và số lượng ("确认一下，是 3 月 5 号 500 件" — "xác nhận lại, là ngày 5/3, 500 kiện") vì nghe nhầm số liệu là lỗi tốn kém nhất.</li>
</ul>
<h3>Một mục nhật ký thật sự cần gì</h3>
<pre><code>Mẫu nhật ký ngày/tuần:
 Ngày:              ____________
 Công việc đã làm:  (cụ thể — "dịch hợp đồng cung ứng 2 trang",
                      không viết chung chung "làm dịch thuật")
 Tiếng Trung dùng:   từ/cụm mới gặp, hiểu lầm nếu có
 Khó khăn:           điều khó, và cách bạn xử lý
 Điều học được:      một điều cụ thể rút ra, dù nhỏ
 Số giờ:             ____________
</code></pre>
<h3>Vì sao cần cụ thể</h3>
<p>"Dịch tài liệu" lặp lại 60 lần không nói lên điều gì với người đánh giá, và không cho bạn gì để dựng báo cáo cuối kỳ. "Dịch phiếu đóng gói cho lô hàng container 40 feet, học được từ 装箱单 (zhuāngxiāngdān)" làm được cả hai việc cùng lúc.</p>
<div class="callout"><span class="badge">Ghi ngay trong ngày</span> Chi tiết phai rất nhanh. Một mục ghi 5 phút vào tối cùng ngày luôn tốt hơn một mục "nhớ lại" sau đó — và người chấm thường nhận ra sự khác biệt.</div>`,
  ]]);

const g5q = quiz('ojc202-quiz-5', 'Quiz 5 — Doing the work & logging|||Quiz 5 — Thực hiện việc & ghi nhật ký', [
  { id: 'q1', question: 'Khi dịch nói trong một cuộc họp (dịch đuổi), nên làm gì nếu người nói nói quá nhanh?', options: ['Cố dịch hết dù có thể sai sót', 'Xin nói chậm lại hoặc lặp lại thay vì đoán mò', 'Bỏ qua phần không nghe kịp', 'Tự bịa nội dung cho liền mạch'], correctIndex: 1, explanation: 'Xin lặp lại/nói chậm giữ độ chính xác, tốt hơn nhiều so với đoán mò trong dịch nói.' },
  { id: 'q2', question: 'Mục nhật ký nào sau đây là ĐÚNG cách viết cụ thể?', options: ['"Hôm nay làm dịch thuật."', '"Dịch phiếu đóng gói cho lô hàng container 40 feet, học từ 装箱单."', '"Không có gì đặc biệt."', '"Làm việc như mọi ngày."'], correctIndex: 1, explanation: 'Ghi cụ thể công việc + từ vựng học được giúp nhật ký có giá trị thật, khác với ghi chung chung.' },
  { id: 'q3', question: 'Vì sao nên ghi nhật ký ngay trong ngày thay vì dồn lại viết cuối tuần/cuối kỳ?', options: ['Vì quy định bắt buộc chấm điểm theo giờ ghi', 'Vì chi tiết phai nhanh, ghi ngay giữ được thông tin chính xác và chân thực hơn', 'Vì viết dồn sẽ bị tính là gian lận', 'Vì nhật ký viết sau sẽ dài hơn'], correctIndex: 1, explanation: 'Ghi cùng ngày giữ chi tiết chính xác; nhật ký "nhớ lại" thường chung chung và kém giá trị hơn.' },
]);

const g6 = doc('ojc202-6-1-giao-tiep-lam-viec-nhom', 'Stage 6 — Communication, teamwork & handling workplace situations|||Giai đoạn 6 — Giao tiếp, làm việc nhóm & xử lý tình huống công sở',
  'Giao tiếp với đồng nghiệp Trung-Việt, làm việc nhóm liên văn hoá, xử lý hiểu lầm và tình huống khó.',
  [[
    `<span class="eyebrow">OJC202 · Stage 6</span>
<h2>Communication, teamwork &amp; handling situations</h2>
<h3>Working across two languages daily</h3>
<p>You are often the bridge between Vietnamese staff and Chinese-speaking managers/partners — which means people on both sides may vent frustration to you about "the other side." Stay professional: relay facts, not emotions, and never editorialize when translating a complaint.</p>
<h3>Teamwork basics</h3>
<ul>
<li><strong>Over-communicate status</strong> — a short "still working on it, will finish by 3pm" message prevents a manager from assuming you forgot.</li>
<li><strong>Credit and blame</strong> — share credit for team wins publicly; if a mistake is partly yours, own that part before explaining the rest.</li>
<li><strong>Ask, don't assume</strong> — when a Chinese colleague's instruction is ambiguous, a two-line clarifying question in Chinese is faster and safer than guessing.</li>
</ul>
<h3>Handling a difficult situation — a simple frame</h3>
<pre><code>When something goes wrong:
 1. Stay calm, do not argue in front of a client/customer
 2. State the facts to your supervisor first, privately
 3. Propose a fix or ask what fix is wanted — don't just report the problem
 4. Log it honestly afterward: what happened, what you'd do differently
</code></pre>
<div class="callout"><span class="badge">A miscommunication is not a crisis</span> Language slips happen even to fluent speakers. What separates a good intern from a bad one is how fast and calmly it gets corrected — not whether it happened at all.</div>`,
    `<span class="eyebrow">OJC202 · Giai đoạn 6</span>
<h2>Giao tiếp, làm việc nhóm &amp; xử lý tình huống</h2>
<h3>Làm việc giữa hai ngôn ngữ mỗi ngày</h3>
<p>Bạn thường là cầu nối giữa nhân viên người Việt và quản lý/đối tác nói tiếng Trung — nghĩa là cả hai phía có thể than phiền với bạn về "phía kia". Giữ chuyên nghiệp: truyền đạt sự kiện, không truyền đạt cảm xúc, và không bao giờ thêm bớt ý kiến khi dịch một lời phàn nàn.</p>
<h3>Kỹ năng làm việc nhóm cơ bản</h3>
<ul>
<li><strong>Báo cáo tiến độ chủ động</strong> — một tin ngắn "vẫn đang làm, xong lúc 3 giờ chiều" tránh để quản lý nghĩ bạn quên việc.</li>
<li><strong>Ghi nhận công &amp; nhận lỗi</strong> — chia sẻ công khai thành quả của nhóm; nếu lỗi một phần do mình, nhận phần đó trước khi giải thích phần còn lại.</li>
<li><strong>Hỏi, đừng đoán</strong> — khi chỉ dẫn của đồng nghiệp Trung mơ hồ, một câu hỏi làm rõ ngắn gọn bằng tiếng Trung nhanh và an toàn hơn đoán mò.</li>
</ul>
<h3>Khung xử lý tình huống khó — đơn giản</h3>
<pre><code>Khi có sự cố:
 1. Giữ bình tĩnh, không tranh cãi trước mặt khách hàng
 2. Báo sự kiện cho quản lý trực tiếp trước, riêng tư
 3. Đề xuất cách xử lý hoặc hỏi hướng xử lý mong muốn — đừng chỉ báo vấn đề
 4. Ghi lại trung thực sau đó: chuyện gì xảy ra, lần sau sẽ làm khác thế nào
</code></pre>
<div class="callout"><span class="badge">Hiểu lầm không phải khủng hoảng</span> Vấp ngôn ngữ xảy ra kể cả với người giỏi. Điều phân biệt thực tập sinh tốt là sửa nhanh và bình tĩnh đến đâu — không phải chuyện có xảy ra hay không.</div>`,
  ]]);

const g6q = quiz('ojc202-quiz-6', 'Quiz 6 — Teamwork & situations|||Quiz 6 — Làm việc nhóm & tình huống', [
  { id: 'q1', question: 'Khi dịch lại một lời phàn nàn giữa nhân viên Việt và quản lý Trung, người dịch nên?', options: ['Thêm cảm xúc của mình vào cho sinh động', 'Truyền đạt đúng sự kiện, không thêm bớt ý kiến cá nhân', 'Chỉ dịch phần có lợi cho một bên', 'Từ chối dịch nếu nội dung tiêu cực'], correctIndex: 1, explanation: 'Vai trò cầu nối đòi hỏi truyền đạt chính xác sự kiện, giữ trung lập, không thêm cảm xúc cá nhân.' },
  { id: 'q2', question: 'Khi có sự cố xảy ra trước mặt khách hàng, bước ĐẦU TIÊN nên làm là?', options: ['Tranh cãi ngay để làm rõ đúng sai', 'Giữ bình tĩnh, không tranh cãi trước mặt khách hàng', 'Bỏ mặc và rời khỏi hiện trường', 'Đăng lên mạng xã hội để hỏi ý kiến'], correctIndex: 1, explanation: 'Giữ bình tĩnh trước mặt khách hàng là bước đầu, sau đó mới báo cáo riêng với quản lý.' },
  { id: 'q3', question: 'Khi chỉ dẫn của đồng nghiệp Trung không rõ ràng, cách xử lý AN TOÀN nhất là?', options: ['Tự đoán ý rồi làm luôn cho nhanh', 'Hỏi lại ngắn gọn bằng tiếng Trung để làm rõ trước khi làm', 'Bỏ qua việc đó', 'Nhờ người khác đoán hộ'], correctIndex: 1, explanation: 'Hỏi làm rõ nhanh và an toàn hơn nhiều so với đoán mò khi chỉ dẫn không rõ.' },
]);

const g7 = doc('ojc202-7-1-viet-bao-cao-thuc-tap', 'Stage 7 — Writing the internship report|||Giai đoạn 7 — Viết báo cáo thực tập',
  'Cấu trúc báo cáo thực tập FPTU, nội dung cần có mỗi phần, cách dùng nhật ký để dựng báo cáo, đề cương mẫu.',
  [[
    `<span class="eyebrow">OJC202 · Stage 7</span>
<h2>Writing the internship report</h2>
<h3>From logbook to report</h3>
<p>By this stage you should have weeks of logbook entries. The report is not new writing from scratch — it is those entries organized, summarized and reflected on. If your logbook was vague, this is where you feel it; go back and expand entries you know are too thin.</p>
<h3>A typical outline (confirm the exact template on FLM)</h3>
<pre><code>1. Cover page &amp; acknowledgements
2. Company introduction
   - Business field, size, organizational structure
   - Your department and supervisor
3. Description of the internship position
   - Assigned tasks, tools/software used, Chinese used (terminology, situations)
4. What you did (the core of the report)
   - Concrete tasks with examples, drawn from your logbook
   - Challenges faced and how you resolved them
5. Reflection / self-evaluation
   - Skills gained (language + soft skills), gaps you noticed
   - How this connects to your coursework
6. Conclusion &amp; recommendations
   - For future interns, and/or for the company
7. Appendix — sample translated documents (redact confidential info), photos, logbook excerpts
</code></pre>
<h3>Common mistakes to avoid</h3>
<ul>
<li>Copying the company's "About us" page instead of describing what YOU actually did there.</li>
<li>Writing only successes — a report with zero difficulties reads as unreflective, not impressive.</li>
<li>Including confidential figures (real prices, real client names) — anonymize or get permission first.</li>
</ul>
<div class="callout"><span class="badge">Write section 4 first</span> The "what you did" section is the one only you can write and the one graders read most closely — draft it before the introduction/conclusion, which are easier to write once the core is done.</div>`,
    `<span class="eyebrow">OJC202 · Giai đoạn 7</span>
<h2>Viết báo cáo thực tập</h2>
<h3>Từ nhật ký thành báo cáo</h3>
<p>Đến giai đoạn này bạn nên đã có vài tuần nhật ký. Báo cáo không phải viết mới từ đầu — đó là việc sắp xếp, tóm tắt và suy ngẫm lại các mục nhật ký đó. Nếu nhật ký từng viết chung chung, đây là lúc bạn thấy hậu quả; quay lại bổ sung những mục còn sơ sài.</p>
<h3>Đề cương tham khảo (xem mẫu chính xác của trường trên FLM)</h3>
<pre><code>1. Trang bìa &amp; lời cảm ơn
2. Giới thiệu doanh nghiệp
   - Lĩnh vực, quy mô, cơ cấu tổ chức
   - Phòng ban và người hướng dẫn trực tiếp
3. Mô tả vị trí thực tập
   - Công việc được giao, công cụ/phần mềm dùng, tiếng Trung dùng (thuật ngữ, tình huống)
4. Những gì đã làm (phần lõi của báo cáo)
   - Công việc cụ thể kèm ví dụ, lấy từ nhật ký
   - Khó khăn gặp phải và cách xử lý
5. Tự đánh giá / suy ngẫm
   - Kỹ năng đạt được (ngôn ngữ + kỹ năng mềm), hạn chế nhận ra
   - Liên hệ với kiến thức đã học trên trường
6. Kết luận &amp; kiến nghị
   - Cho thực tập sinh sau, và/hoặc cho doanh nghiệp
7. Phụ lục — mẫu tài liệu đã dịch (ẩn thông tin bảo mật), hình ảnh, trích nhật ký
</code></pre>
<h3>Lỗi thường gặp cần tránh</h3>
<ul>
<li>Chép lại trang "Giới thiệu công ty" thay vì mô tả CHÍNH BẠN đã làm gì ở đó.</li>
<li>Chỉ viết thành công — báo cáo không có khó khăn nào đọc lên thiếu suy ngẫm, không gây ấn tượng tốt.</li>
<li>Đưa số liệu bảo mật (giá thật, tên khách hàng thật) — cần ẩn danh hoặc xin phép trước.</li>
</ul>
<div class="callout"><span class="badge">Viết phần 4 trước tiên</span> Phần "đã làm gì" là phần chỉ mình bạn viết được và được người chấm đọc kỹ nhất — viết phần này trước phần mở đầu/kết luận, vốn dễ viết hơn khi đã có phần lõi.</div>`,
  ]]);

const g7q = quiz('ojc202-quiz-7', 'Quiz 7 — Writing the report|||Quiz 7 — Viết báo cáo', [
  { id: 'q1', question: 'Nguồn nguyên liệu chính để viết phần "những gì đã làm" trong báo cáo thực tập là gì?', options: ['Trang "Giới thiệu công ty" trên website doanh nghiệp', 'Các mục nhật ký thực tập đã ghi trong suốt kỳ', 'Trí nhớ vào đêm trước khi nộp', 'Báo cáo của bạn thực tập ở công ty khác'], correctIndex: 1, explanation: 'Báo cáo được dựng từ việc sắp xếp và suy ngẫm lại nhật ký đã ghi, không phải viết mới từ đầu.' },
  { id: 'q2', question: 'Một báo cáo chỉ toàn kể thành công, không nhắc khó khăn nào, sẽ bị đánh giá thế nào?', options: ['Rất tốt vì cho thấy thực tập suôn sẻ', 'Đọc thiếu suy ngẫm, không thuyết phục bằng báo cáo có khó khăn + cách xử lý', 'Không ảnh hưởng gì đến điểm', 'Được cộng điểm vì tích cực'], correctIndex: 1, explanation: 'Rubric coi trọng suy ngẫm thật; báo cáo không có khó khăn nào thường bị coi là thiếu chân thực/hời hợt.' },
  { id: 'q3', question: 'Trước khi đưa số liệu như giá thật hoặc tên khách hàng thật vào phụ lục báo cáo, cần làm gì?', options: ['Đưa thẳng vào vì đó là bằng chứng đã làm việc', 'Ẩn danh hoặc xin phép doanh nghiệp trước khi đưa vào', 'Chỉ cần đổi font chữ', 'Không cần quan tâm vì báo cáo chỉ giáo viên đọc'], correctIndex: 1, explanation: 'Thông tin bảo mật của doanh nghiệp phải được ẩn danh hoặc có sự đồng ý trước khi đưa vào báo cáo.' },
]);

const g8 = doc('ojc202-8-1-danh-gia-bao-ve-dinh-huong', 'Stage 8 — Evaluation, defense & career direction in Chinese-language work|||Giai đoạn 8 — Đánh giá, bảo vệ & định hướng nghề nghiệp tiếng Trung',
  'Quy trình đánh giá của doanh nghiệp, chuẩn bị bảo vệ trước hội đồng, các hướng nghề nghiệp tiếng Trung sau OJT.',
  [[
    `<span class="eyebrow">OJC202 · Stage 8</span>
<h2>Evaluation, defense &amp; career direction</h2>
<h3>The company evaluation</h3>
<p>Near the end of your internship, your supervisor fills in the school's evaluation form (attitude, discipline, competence, sometimes a numeric score). Ask early how and when this will happen so it isn't rushed on your last day — a rushed evaluation tends to be a generic, lower one.</p>
<h3>Preparing for the defense</h3>
<pre><code>Defense prep checklist:
 [ ] Can summarize your role and 2-3 concrete tasks in under 2 minutes
 [ ] Can explain ONE difficulty and how you solved it, in detail
 [ ] Know your report cold — don't let the committee catch inconsistencies
 [ ] Prepared for "what would you do differently" and "what did you learn about
     using Chinese at work that a classroom didn't teach you"
 [ ] Bring the actual logbook/evaluation form if requested
</code></pre>
<h3>Career directions after this OJT</h3>
<ul>
<li><strong>In-house translator/interpreter</strong> at a Chinese-invested manufacturer or trading company — the most direct continuation of this internship.</li>
<li><strong>Trade/export-import assistant</strong> — handling supplier communication, documentation, and logistics with Chinese partners.</li>
<li><strong>Customer-facing roles</strong> — sales, tourism, or customer service for Chinese-speaking clients.</li>
<li><strong>Further specialization</strong> — higher HSK/HSKK levels, or a certificate in translation/interpreting, if this internship confirmed the direction.</li>
</ul>
<div class="callout"><span class="badge">Ask for a reference</span> If the internship went well, ask your supervisor for a short reference or a LinkedIn recommendation before you leave — it's far easier to get on your last week than six months later.</div>`,
    `<span class="eyebrow">OJC202 · Giai đoạn 8</span>
<h2>Đánh giá, bảo vệ &amp; định hướng nghề nghiệp</h2>
<h3>Đánh giá của doanh nghiệp</h3>
<p>Gần cuối kỳ thực tập, người quản lý điền phiếu đánh giá của trường (thái độ, kỷ luật, năng lực, đôi khi có điểm số). Hỏi sớm về thời điểm và cách thực hiện để không bị dồn vào ngày cuối cùng — đánh giá vội thường chung chung và thấp điểm hơn.</p>
<h3>Chuẩn bị bảo vệ</h3>
<pre><code>Checklist chuẩn bị bảo vệ:
 [ ] Tóm tắt được vai trò và 2-3 công việc cụ thể trong dưới 2 phút
 [ ] Giải thích được MỘT khó khăn và cách xử lý, đủ chi tiết
 [ ] Thuộc báo cáo của mình — đừng để hội đồng bắt được điểm mâu thuẫn
 [ ] Chuẩn bị cho câu "nếu làm lại sẽ khác thế nào" và "học được gì về dùng
     tiếng Trung ở nơi làm việc mà lớp học không dạy"
 [ ] Mang theo nhật ký/phiếu đánh giá thật nếu được yêu cầu
</code></pre>
<h3>Hướng nghề nghiệp sau kỳ OJT này</h3>
<ul>
<li><strong>Biên-phiên dịch nội bộ</strong> tại doanh nghiệp sản xuất/thương mại có vốn Trung Quốc — hướng tiếp nối trực tiếp nhất từ kỳ thực tập này.</li>
<li><strong>Trợ lý xuất nhập khẩu/thương mại</strong> — xử lý giao tiếp nhà cung cấp, chứng từ, logistics với đối tác Trung Quốc.</li>
<li><strong>Vị trí tiếp khách hàng</strong> — kinh doanh, du lịch, hoặc chăm sóc khách hàng nói tiếng Trung.</li>
<li><strong>Chuyên sâu thêm</strong> — nâng bậc HSK/HSKK, hoặc chứng chỉ biên-phiên dịch, nếu kỳ thực tập này xác nhận đúng hướng đi.</li>
</ul>
<div class="callout"><span class="badge">Xin thư giới thiệu</span> Nếu thực tập suôn sẻ, xin người quản lý một thư giới thiệu ngắn hoặc lời giới thiệu trên LinkedIn trước khi rời đi — dễ xin hơn nhiều vào tuần cuối so với sáu tháng sau.</div>`,
  ]]);

const g8q = quiz('ojc202-quiz-8', 'Quiz 8 — Evaluation & career|||Quiz 8 — Đánh giá & định hướng nghề', [
  { id: 'q1', question: 'Vì sao nên hỏi sớm về thời điểm doanh nghiệp làm phiếu đánh giá, thay vì để đến ngày cuối cùng?', options: ['Vì phiếu đánh giá cần chữ ký công chứng', 'Vì đánh giá làm vội vào phút cuối thường chung chung và thấp điểm hơn', 'Vì trường không nhận phiếu nộp muộn dù chỉ 1 phút', 'Vì không hỏi thì công ty sẽ không đánh giá'], correctIndex: 1, explanation: 'Chủ động hỏi sớm giúp có thời gian cho một đánh giá đầy đủ, tránh bị dồn vào phút chót.' },
  { id: 'q2', question: 'Khi hội đồng hỏi "nếu làm lại sẽ khác thế nào", câu trả lời tốt cần thể hiện điều gì?', options: ['Khẳng định mọi thứ đã hoàn hảo, không có gì để thay đổi', 'Suy ngẫm thật, cụ thể về điều có thể làm tốt hơn', 'Đổ lỗi cho doanh nghiệp thực tập', 'Từ chối trả lời vì câu hỏi khó'], correctIndex: 1, explanation: 'Câu hỏi này kiểm tra khả năng tự suy ngẫm thật, không phải khẳng định mọi thứ hoàn hảo.' },
  { id: 'q3', question: 'Hướng nghề nghiệp nào PHÙ HỢP để tiếp nối trực tiếp từ kỳ OJT tại doanh nghiệp dùng tiếng Trung?', options: ['Bất kỳ nghề nào không liên quan ngôn ngữ', 'Biên-phiên dịch nội bộ hoặc trợ lý xuất nhập khẩu tại doanh nghiệp có yếu tố Trung Quốc', 'Chỉ có thể làm giáo viên tiếng Việt', 'Không có hướng nào liên quan sau OJT'], correctIndex: 1, explanation: 'OJT dùng tiếng Trung mở hướng trực tiếp sang biên-phiên dịch, trợ lý thương mại/xuất nhập khẩu với đối tác Trung Quốc.' },
]);

export default {
  semester: { code: 'FPTU_Hola6', name: 'Kỳ 6 — Thực tập', ordinal: 8 },
  course: {
    courseCode: 'OJC202',
    slug: 'ojc202-on-the-job-training',
    title: 'On-the-job Training',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/OJC202.webp',
    shortDescription: 'On-the-Job Training for Chinese Language students — 8 stages: find an employer using Chinese, bilingual CV & interview, onboarding & company culture, work ethics, doing the work & logging it, teamwork, the report, then evaluation & defense.|||Thực tập doanh nghiệp cho sinh viên Ngôn ngữ Trung — 8 giai đoạn: tìm doanh nghiệp dùng tiếng Trung, CV & phỏng vấn song ngữ, hoà nhập văn hoá công ty, đạo đức nghề, làm việc & ghi nhật ký, làm việc nhóm, viết báo cáo, đánh giá & bảo vệ.',
    description: 'Môn <strong>OJC202 — On-the-Job Training</strong> (kỳ 6 — thực tập) dành cho sinh viên ngành <strong>Ngôn ngữ Trung</strong>, hướng tới vị trí dùng tiếng Trung (biên-phiên dịch, trợ lý thương mại, nhân viên công ty Trung/FDI). Khung theo <strong>8 giai đoạn của kỳ thực tập</strong>: chuẩn bị &amp; tìm doanh nghiệp → CV song ngữ &amp; phỏng vấn → hoà nhập &amp; văn hoá công ty → đạo đức nghề → thực hiện công việc &amp; ghi nhật ký → làm việc nhóm &amp; xử lý tình huống → viết báo cáo → đánh giá, bảo vệ &amp; định hướng nghề. Song ngữ, có ví dụ tiếng Trung (kèm pinyin), mẫu nhật ký/báo cáo, quiz mỗi giai đoạn.',
    whatYouLearn: 'Tìm và chọn doanh nghiệp dùng tiếng Trung phù hợp; viết CV song ngữ Trung-Việt & trả lời phỏng vấn bằng tiếng Trung; hoà nhập văn hoá công ty (关系, 面子, xưng hô, giờ giấc); đạo đức nghề (bảo mật, trung thực, trung lập); kỹ thuật dịch nói/viết cơ bản & cách ghi nhật ký cụ thể; giao tiếp, làm việc nhóm & xử lý tình huống công sở; cấu trúc & cách viết báo cáo thực tập; chuẩn bị bảo vệ và định hướng nghề nghiệp tiếng Trung sau OJT.',
    requirements: 'Đã hoàn thành các học phần tiếng Trung & chuyên ngành theo khung chương trình Ngôn ngữ Trung trước kỳ 6; xem điều kiện tiên quyết chính xác trên FLM. Cần một doanh nghiệp nhận thực tập đồng ý ký thoả thuận với trường.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Quy định thực tập FPTU, LinkedIn Learning, nguồn tiếng Trung thương mại, mẫu nhật ký/báo cáo.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'OJT là gì, 3 deliverable bắt buộc, rubric, lộ trình 8 giai đoạn.', lessons: [intro] },
    { title: 'Giai đoạn 1 — Chuẩn bị & tìm doanh nghiệp|||Stage 1 — Preparation & job search', description: 'Tự đánh giá năng lực, kênh tìm việc, tiêu chí chọn doanh nghiệp.', lessons: [g1, g1q] },
    { title: 'Giai đoạn 2 — CV song ngữ & phỏng vấn|||Stage 2 — Bilingual CV & interview', description: 'CV song ngữ Trung-Việt, câu hỏi phỏng vấn tiếng Trung.', lessons: [g2, g2q] },
    { title: 'Giai đoạn 3 — Hoà nhập & văn hoá công ty|||Stage 3 — Onboarding & culture', description: '关系/面子, xưng hô, quy tắc bất thành văn công ty Trung.', lessons: [g3, g3q] },
    { title: 'Giai đoạn 4 — Tác phong & đạo đức nghề|||Stage 4 — Conduct & work ethics', description: 'Bảo mật, trung thực, trung lập, kỷ luật hằng ngày.', lessons: [g4, g4q] },
    { title: 'Giai đoạn 5 — Thực hiện công việc & ghi nhật ký|||Stage 5 — Doing the work & logging', description: 'Kỹ thuật dịch cơ bản, mẫu nhật ký cụ thể.', lessons: [g5, g5q] },
    { title: 'Giai đoạn 6 — Giao tiếp & làm việc nhóm|||Stage 6 — Communication & teamwork', description: 'Làm việc nhóm liên văn hoá, xử lý tình huống khó.', lessons: [g6, g6q] },
    { title: 'Giai đoạn 7 — Viết báo cáo thực tập|||Stage 7 — Writing the report', description: 'Cấu trúc báo cáo, từ nhật ký thành báo cáo, lỗi thường gặp.', lessons: [g7, g7q] },
    { title: 'Giai đoạn 8 — Đánh giá, bảo vệ & định hướng nghề|||Stage 8 — Evaluation, defense & career', description: 'Đánh giá doanh nghiệp, chuẩn bị bảo vệ, hướng nghề nghiệp tiếng Trung.', lessons: [g8, g8q] },
  ],
};
