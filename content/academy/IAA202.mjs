/**
 * IAA202 — Risk Management in Information Systems (Quản trị rủi ro trong Hệ
 * thống thông tin). Ngành An toàn thông tin FPTU. Khung chất lượng, 8 chương,
 * song ngữ VI+EN. Nguồn chuẩn: NIST SP 800-30 & 800-37 (RMF), ISO/IEC 27005,
 * ISO 31000, Luật An ninh mạng VN.
 * Giữ NGUYÊN slug/semester/courseCode/thumb(v3). ⚠️ KHÔNG backtick/${; "&"→&amp; trong HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('iaa202-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), chuẩn NIST SP 800-30/800-37, ISO 27005, ISO 31000, Luật An ninh mạng VN, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">IAA202 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>information-security risk management</strong> — concepts, frameworks, analysis and treatment — in one place. The official slides &amp; textbook live on <strong>FLM</strong>; below are free, authoritative standards and resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for IAA202 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Core standards (free)</h3>
<ul>
<li><a href="https://csrc.nist.gov/pubs/sp/800/30/r1/final" target="_blank" rel="noopener">NIST SP 800-30 Rev.1 — Guide for Conducting Risk Assessments</a></li>
<li><a href="https://csrc.nist.gov/pubs/sp/800/37/r2/final" target="_blank" rel="noopener">NIST SP 800-37 Rev.2 — Risk Management Framework (RMF)</a></li>
<li><a href="https://www.iso.org/standard/80585.html" target="_blank" rel="noopener">ISO/IEC 27005 — Information security risk management</a></li>
<li><a href="https://www.iso.org/iso-31000-risk-management.html" target="_blank" rel="noopener">ISO 31000 — Risk management guidelines</a></li>
</ul>
<h3>🌐 Vietnam legal framework</h3>
<ul>
<li><a href="https://vanban.chinhphu.vn" target="_blank" rel="noopener">Luật An ninh mạng 2018 (Law on Cybersecurity)</a></li>
<li><a href="https://vanban.chinhphu.vn" target="_blank" rel="noopener">Luật An toàn thông tin mạng 2015 (Law on Cyber-information Security)</a></li>
</ul>
<h3>▶️ Learn more</h3>
<ul>
<li><a href="https://www.sans.org/security-resources/" target="_blank" rel="noopener">SANS Security Resources</a> — reading room &amp; posters</li>
<li><a href="https://owasp.org/www-community/OWASP_Risk_Rating_Methodology" target="_blank" rel="noopener">OWASP Risk Rating Methodology</a></li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — risk = likelihood × impact; asset, threat, vulnerability, control.</li>
<li><strong>Frameworks</strong> — walk the NIST RMF steps and the ISO 27005 process.</li>
<li><strong>Analysis</strong> — value assets by CIA, then compute SLE / ARO / ALE and place risks on a matrix.</li>
<li><strong>Treat &amp; monitor</strong> — accept / mitigate / transfer / avoid, pick controls, then audit, report KRIs and keep a BCP/DRP ready.</li>
</ol></div>`,
    `<span class="eyebrow">IAA202 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>quản trị rủi ro an toàn thông tin</strong> — khái niệm, khung, phân tích và xử lý — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là các chuẩn uy tín và nguồn miễn phí.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của IAA202 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Chuẩn cốt lõi (miễn phí)</h3>
<ul>
<li><a href="https://csrc.nist.gov/pubs/sp/800/30/r1/final" target="_blank" rel="noopener">NIST SP 800-30 Rev.1 — Hướng dẫn đánh giá rủi ro</a></li>
<li><a href="https://csrc.nist.gov/pubs/sp/800/37/r2/final" target="_blank" rel="noopener">NIST SP 800-37 Rev.2 — Khung quản trị rủi ro (RMF)</a></li>
<li><a href="https://www.iso.org/standard/80585.html" target="_blank" rel="noopener">ISO/IEC 27005 — Quản lý rủi ro an toàn thông tin</a></li>
<li><a href="https://www.iso.org/iso-31000-risk-management.html" target="_blank" rel="noopener">ISO 31000 — Nguyên tắc quản lý rủi ro</a></li>
</ul>
<h3>🌐 Khung pháp lý Việt Nam</h3>
<ul>
<li><a href="https://vanban.chinhphu.vn" target="_blank" rel="noopener">Luật An ninh mạng 2018</a></li>
<li><a href="https://vanban.chinhphu.vn" target="_blank" rel="noopener">Luật An toàn thông tin mạng 2015</a></li>
</ul>
<h3>▶️ Học thêm</h3>
<ul>
<li><a href="https://www.sans.org/security-resources/" target="_blank" rel="noopener">SANS Security Resources</a> — kho tài liệu &amp; poster</li>
<li><a href="https://owasp.org/www-community/OWASP_Risk_Rating_Methodology" target="_blank" rel="noopener">OWASP Risk Rating Methodology</a></li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — rủi ro = khả năng × tác động; tài sản, mối đe doạ, lỗ hổng, kiểm soát.</li>
<li><strong>Khung</strong> — đi hết các bước NIST RMF và quy trình ISO 27005.</li>
<li><strong>Phân tích</strong> — định giá tài sản theo CIA, rồi tính SLE / ARO / ALE và đặt rủi ro lên ma trận.</li>
<li><strong>Xử lý &amp; giám sát</strong> — chấp nhận / giảm / chuyển / tránh, chọn kiểm soát, rồi kiểm toán, báo cáo KRI và luôn sẵn BCP/DRP.</li>
</ol></div>`,
  ]]);

const intro = doc('iaa202-0-1-overview', 'Course overview: risk management in information systems|||Tổng quan: quản trị rủi ro trong hệ thống thông tin',
  'Quản trị rủi ro là gì; tam giác asset–threat–vulnerability; rủi ro = khả năng × tác động; lộ trình 4 bước và chuẩn NIST/ISO dùng xuyên suốt.',
  [[
    `<span class="eyebrow">IAA202 · Lesson 0.1 · Overview</span>
<h2>Risk management in information systems</h2>
<p class="lead">This course teaches you to <strong>identify, analyze, treat and monitor</strong> the risks facing an organization's information systems — the discipline that keeps data confidential, correct and available. You will work with the international playbooks security teams actually use: <strong>NIST SP 800-30 / 800-37 (RMF)</strong>, <strong>ISO/IEC 27005</strong> and <strong>ISO 31000</strong>, plus Vietnam's legal framework.</p>
<h3>The one idea everything hangs on</h3>
<p>A <strong>risk</strong> exists only when a <strong>threat</strong> can exploit a <strong>vulnerability</strong> to harm an <strong>asset</strong>. Remove any one leg and the risk drops.</p>
<pre><code>Risk = Likelihood x Impact
 - Likelihood: how probable the threat exploits the weakness
 - Impact:     how badly the asset (and business) is hurt
</code></pre>
<h3>Roadmap (4 steps)</h3>
<p>Identify assets &amp; value them (CIA) → assess threats &amp; vulnerabilities → analyze risk (qualitative / quantitative) → treat, monitor and respond. Bilingual, with formulas, matrices and real examples.</p>
<div class="callout"><span class="badge">Why it matters</span> Security money is finite. Risk management is how you spend it where it removes the most expected loss, not where it feels scariest.</div>`,
    `<span class="eyebrow">IAA202 · Bài 0.1 · Tổng quan</span>
<h2>Quản trị rủi ro trong hệ thống thông tin</h2>
<p class="lead">Môn này dạy bạn <strong>nhận diện, phân tích, xử lý và giám sát</strong> rủi ro của các hệ thống thông tin trong tổ chức — ngành giữ cho dữ liệu bí mật, đúng đắn và sẵn sàng. Bạn sẽ dùng đúng những cẩm nang quốc tế mà đội an ninh thực sự dùng: <strong>NIST SP 800-30 / 800-37 (RMF)</strong>, <strong>ISO/IEC 27005</strong> và <strong>ISO 31000</strong>, cùng khung pháp lý Việt Nam.</p>
<h3>Một ý tưởng chi phối tất cả</h3>
<p>Một <strong>rủi ro</strong> chỉ tồn tại khi một <strong>mối đe doạ</strong> có thể khai thác một <strong>lỗ hổng</strong> để gây hại cho một <strong>tài sản</strong>. Bỏ đi một chân thì rủi ro giảm.</p>
<pre><code>Rủi ro = Khả năng x Tác động
 - Khả năng: mối đe doạ khai thác lỗ hổng dễ tới đâu
 - Tác động: tài sản (và doanh nghiệp) thiệt hại nặng tới đâu
</code></pre>
<h3>Lộ trình (4 bước)</h3>
<p>Nhận diện tài sản &amp; định giá (CIA) → đánh giá đe doạ &amp; lỗ hổng → phân tích rủi ro (định tính / định lượng) → xử lý, giám sát và ứng phó. Song ngữ, có công thức, ma trận và ví dụ thật.</p>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Ngân sách an ninh có hạn. Quản trị rủi ro là cách tiêu tiền vào nơi cắt được nhiều tổn thất kỳ vọng nhất, chứ không phải nơi trông đáng sợ nhất.</div>`,
  ]]);

const c1 = doc('iaa202-1-1-risk-basics', '1.1 — Risk & risk management|||1.1 — Rủi ro & quản trị rủi ro',
  'Khái niệm risk/threat/vulnerability/asset và quan hệ giữa chúng; risk = likelihood × impact; vì sao tổ chức cần quản trị rủi ro.',
  [[
    `<span class="eyebrow">IAA202 · Chapter 1 · Lesson 1.1</span>
<h2>Risk &amp; risk management</h2>
<h3>The core vocabulary</h3>
<ul>
<li><strong>Asset</strong> — anything of value to protect: data, systems, people, reputation.</li>
<li><strong>Threat</strong> — a potential cause of harm (a hacker, malware, a flood, an insider).</li>
<li><strong>Threat agent / source</strong> — who or what triggers the threat.</li>
<li><strong>Vulnerability</strong> — a weakness a threat can exploit (unpatched software, weak password, no backup).</li>
<li><strong>Risk</strong> — the chance a threat exploits a vulnerability and the resulting impact.</li>
<li><strong>Control (safeguard)</strong> — a measure that reduces risk.</li>
</ul>
<h3>How they connect</h3>
<pre><code>Threat --exploits--> Vulnerability --harms--> Asset
                                   |
                        Control reduces the risk
</code></pre>
<p><strong>Risk management</strong> is the ongoing process of finding these risks, judging how big they are, and deciding what to do — so leaders make informed choices instead of guessing.</p>
<div class="callout"><span class="badge">Example</span> Asset = customer database. Threat = SQL-injection attacker. Vulnerability = an unvalidated input field. Impact = a data breach + legal fines. A single input-validation control shrinks the whole risk.</div>`,
    `<span class="eyebrow">IAA202 · Chương 1 · Bài 1.1</span>
<h2>Rủi ro &amp; quản trị rủi ro</h2>
<h3>Bộ từ vựng cốt lõi</h3>
<ul>
<li><strong>Tài sản (asset)</strong> — thứ có giá trị cần bảo vệ: dữ liệu, hệ thống, con người, uy tín.</li>
<li><strong>Mối đe doạ (threat)</strong> — nguyên nhân tiềm tàng gây hại (hacker, mã độc, lũ lụt, người trong nội bộ).</li>
<li><strong>Nguồn đe doạ (threat agent)</strong> — ai hoặc cái gì kích hoạt mối đe doạ.</li>
<li><strong>Lỗ hổng (vulnerability)</strong> — điểm yếu mà mối đe doạ khai thác được (phần mềm chưa vá, mật khẩu yếu, không sao lưu).</li>
<li><strong>Rủi ro (risk)</strong> — khả năng mối đe doạ khai thác lỗ hổng và mức thiệt hại kéo theo.</li>
<li><strong>Kiểm soát (control)</strong> — biện pháp làm giảm rủi ro.</li>
</ul>
<h3>Chúng nối với nhau thế nào</h3>
<pre><code>Đe doạ --khai thác--> Lỗ hổng --gây hại--> Tài sản
                                  |
                       Kiểm soát làm giảm rủi ro
</code></pre>
<p><strong>Quản trị rủi ro</strong> là quá trình liên tục tìm ra các rủi ro, xét chúng lớn tới đâu, và quyết định làm gì — để lãnh đạo chọn có cơ sở thay vì đoán mò.</p>
<div class="callout"><span class="badge">Ví dụ</span> Tài sản = CSDL khách hàng. Đe doạ = kẻ tấn công SQL-injection. Lỗ hổng = một ô nhập không kiểm tra dữ liệu. Tác động = lộ dữ liệu + phạt pháp lý. Một kiểm soát kiểm tra đầu vào là đủ thu nhỏ cả rủi ro.</div>`,
  ]]);

const c1q = quiz('iaa202-quiz-1', 'Quiz 1 — Risk basics|||Quiz 1 — Nền tảng rủi ro', [
  { id: 'q1', question: 'Rủi ro được hiểu là?', options: ['Chỉ mối đe doạ', 'Khả năng × Tác động', 'Chỉ lỗ hổng', 'Một loại tài sản'], correctIndex: 1, explanation: 'Rủi ro = khả năng mối đe doạ khai thác lỗ hổng × mức tác động.' },
  { id: 'q2', question: '"Điểm yếu mà mối đe doạ khai thác được" gọi là?', options: ['Tài sản', 'Lỗ hổng (vulnerability)', 'Kiểm soát', 'Nguồn đe doạ'], correctIndex: 1, explanation: 'Lỗ hổng là điểm yếu; kiểm soát dùng để bịt nó.' },
  { id: 'q3', question: 'Kiểm soát (control) có vai trò gì?', options: ['Tạo thêm mối đe doạ', 'Làm giảm rủi ro', 'Định giá tài sản', 'Là một lỗ hổng'], correctIndex: 1, explanation: 'Control/safeguard là biện pháp làm giảm khả năng hoặc tác động của rủi ro.' },
]);

const c2 = doc('iaa202-2-1-frameworks', '2.1 — Risk management frameworks|||2.1 — Khung quản trị rủi ro',
  'NIST RMF (7 bước), quy trình ISO/IEC 27005, nguyên tắc ISO 31000; điểm chung: bối cảnh → đánh giá → xử lý → giám sát.',
  [[
    `<span class="eyebrow">IAA202 · Chapter 2 · Lesson 2.1</span>
<h2>Risk management frameworks</h2>
<p>Frameworks give you a repeatable process so risk work is consistent and auditable, not ad-hoc.</p>
<h3>NIST Risk Management Framework (SP 800-37)</h3>
<pre><code>Prepare -> Categorize -> Select -> Implement
        -> Assess -> Authorize -> Monitor
</code></pre>
<p>Assessment inside it follows <strong>SP 800-30</strong>: identify threat sources &amp; events, vulnerabilities, likelihood, impact, then risk.</p>
<h3>ISO/IEC 27005 process</h3>
<pre><code>Context -> Risk assessment (identify -> analyze -> evaluate)
        -> Risk treatment -> Acceptance
        -> Communication + Monitoring &amp; review (continuous)
</code></pre>
<h3>ISO 31000 principles</h3>
<p>The umbrella standard for <em>any</em> risk (not only IT): risk management should be integrated, structured, tailored, inclusive and continually improved. ISO 27005 applies these ideas to information security.</p>
<div class="callout"><span class="badge">Same shape</span> Every framework repeats one loop: <strong>establish context → assess → treat → monitor</strong>. Learn the loop and the specific standard becomes vocabulary.</div>`,
    `<span class="eyebrow">IAA202 · Chương 2 · Bài 2.1</span>
<h2>Khung quản trị rủi ro</h2>
<p>Khung cho bạn một quy trình lặp lại được, để việc quản trị rủi ro nhất quán và kiểm toán được, không tuỳ hứng.</p>
<h3>Khung quản trị rủi ro NIST (SP 800-37)</h3>
<pre><code>Chuẩn bị -> Phân loại -> Chọn kiểm soát -> Triển khai
         -> Đánh giá -> Cấp phép -> Giám sát
</code></pre>
<p>Phần đánh giá bên trong theo <strong>SP 800-30</strong>: xác định nguồn &amp; sự kiện đe doạ, lỗ hổng, khả năng, tác động, rồi ra rủi ro.</p>
<h3>Quy trình ISO/IEC 27005</h3>
<pre><code>Bối cảnh -> Đánh giá rủi ro (nhận diện -> phân tích -> định mức)
         -> Xử lý rủi ro -> Chấp nhận
         -> Trao đổi + Giám sát &amp; soát xét (liên tục)
</code></pre>
<h3>Nguyên tắc ISO 31000</h3>
<p>Chuẩn ô dù cho <em>mọi</em> loại rủi ro (không riêng CNTT): quản trị rủi ro phải được tích hợp, có cấu trúc, đo may đo, bao trùm và cải tiến liên tục. ISO 27005 áp các ý này vào an toàn thông tin.</p>
<div class="callout"><span class="badge">Cùng một hình</span> Mọi khung đều lặp một vòng: <strong>lập bối cảnh → đánh giá → xử lý → giám sát</strong>. Nắm cái vòng thì chuẩn cụ thể chỉ còn là từ vựng.</div>`,
  ]]);

const c2q = quiz('iaa202-quiz-2', 'Quiz 2 — Frameworks|||Quiz 2 — Khung', [
  { id: 'q1', question: 'RMF (NIST SP 800-37) bắt đầu bằng bước nào?', options: ['Monitor', 'Prepare (Chuẩn bị)', 'Authorize', 'Assess'], correctIndex: 1, explanation: 'Vòng RMF: Prepare → Categorize → Select → Implement → Assess → Authorize → Monitor.' },
  { id: 'q2', question: 'Chuẩn quốc tế dành riêng cho quản lý rủi ro AN TOÀN THÔNG TIN là?', options: ['ISO 9001', 'ISO/IEC 27005', 'ISO 14001', 'ISO 22000'], correctIndex: 1, explanation: 'ISO/IEC 27005 áp nguyên tắc ISO 31000 vào an toàn thông tin.' },
  { id: 'q3', question: 'Điểm chung của mọi khung quản trị rủi ro là vòng?', options: ['Mua → cài → quên', 'Bối cảnh → đánh giá → xử lý → giám sát', 'Chỉ đánh giá một lần', 'Sao lưu → khôi phục'], correctIndex: 1, explanation: 'Tất cả đều lặp: lập bối cảnh, đánh giá, xử lý, rồi giám sát liên tục.' },
]);

const c3 = doc('iaa202-3-1-asset-valuation', '3.1 — Asset identification & valuation|||3.1 — Nhận diện tài sản & định giá',
  'Kiểm kê và phân loại tài sản; định giá theo CIA (bí mật/toàn vẹn/sẵn sàng); asset owner; xác định giá trị cho việc tính rủi ro.',
  [[
    `<span class="eyebrow">IAA202 · Chapter 3 · Lesson 3.1</span>
<h2>Asset identification &amp; valuation</h2>
<p>You cannot protect what you have not listed. Step one of any assessment is a complete <strong>asset inventory</strong>.</p>
<h3>Identify &amp; classify</h3>
<ul>
<li><strong>Information</strong> — databases, source code, contracts, personal data.</li>
<li><strong>Software / systems</strong> — applications, servers, network devices.</li>
<li><strong>People &amp; intangibles</strong> — staff knowledge, reputation, brand.</li>
</ul>
<p>Assign each asset an <strong>owner</strong> and a <strong>classification</strong> (e.g. Public → Internal → Confidential → Secret).</p>
<h3>Value by the CIA triad</h3>
<ul>
<li><strong>Confidentiality</strong> — only authorized parties can read it.</li>
<li><strong>Integrity</strong> — it stays correct and unaltered.</li>
<li><strong>Availability</strong> — it is there when needed.</li>
</ul>
<pre><code>Asset value ~ how much loss of C, I or A would cost the business
 Example: payroll DB
   Confidentiality = High  (salaries are private)
   Integrity       = High  (wrong pay = fraud)
   Availability    = Medium (a day late is tolerable)
</code></pre>
<div class="callout"><span class="badge">Why value first</span> The asset's value caps how much a risk can cost — so it is the anchor for every later calculation (SLE, ALE).</div>`,
    `<span class="eyebrow">IAA202 · Chương 3 · Bài 3.1</span>
<h2>Nhận diện tài sản &amp; định giá</h2>
<p>Không thể bảo vệ thứ chưa liệt kê. Bước một của mọi cuộc đánh giá là <strong>kiểm kê tài sản</strong> đầy đủ.</p>
<h3>Nhận diện &amp; phân loại</h3>
<ul>
<li><strong>Thông tin</strong> — CSDL, mã nguồn, hợp đồng, dữ liệu cá nhân.</li>
<li><strong>Phần mềm / hệ thống</strong> — ứng dụng, máy chủ, thiết bị mạng.</li>
<li><strong>Con người &amp; vô hình</strong> — tri thức nhân sự, uy tín, thương hiệu.</li>
</ul>
<p>Gán cho mỗi tài sản một <strong>chủ sở hữu (owner)</strong> và một <strong>mức phân loại</strong> (vd Công khai → Nội bộ → Mật → Tuyệt mật).</p>
<h3>Định giá theo tam giác CIA</h3>
<ul>
<li><strong>Bí mật (Confidentiality)</strong> — chỉ người được phép đọc được.</li>
<li><strong>Toàn vẹn (Integrity)</strong> — dữ liệu giữ đúng, không bị sửa.</li>
<li><strong>Sẵn sàng (Availability)</strong> — có mặt khi cần.</li>
</ul>
<pre><code>Giá trị tài sản ~ mất C, I hoặc A tốn của doanh nghiệp bao nhiêu
 Ví dụ: CSDL lương
   Bí mật    = Cao   (lương là riêng tư)
   Toàn vẹn  = Cao   (trả sai = gian lận)
   Sẵn sàng  = Vừa   (trễ một ngày còn chịu được)
</code></pre>
<div class="callout"><span class="badge">Vì sao định giá trước</span> Giá trị tài sản chặn trần thiệt hại của một rủi ro — nên nó là mỏ neo cho mọi phép tính sau (SLE, ALE).</div>`,
  ]]);

const c3q = quiz('iaa202-quiz-3', 'Quiz 3 — Assets & CIA|||Quiz 3 — Tài sản & CIA', [
  { id: 'q1', question: 'Tam giác CIA gồm?', options: ['Chi phí, Rủi ro, Kiểm toán', 'Bí mật, Toàn vẹn, Sẵn sàng', 'Điều khiển, Nhận diện, Ứng phó', 'Đe doạ, Lỗ hổng, Tài sản'], correctIndex: 1, explanation: 'CIA = Confidentiality, Integrity, Availability.' },
  { id: 'q2', question: 'Bước ĐẦU của mọi cuộc đánh giá rủi ro là?', options: ['Mua bảo hiểm', 'Kiểm kê & phân loại tài sản', 'Viết báo cáo', 'Xoá log'], correctIndex: 1, explanation: 'Không liệt kê tài sản thì không đánh giá được rủi ro.' },
  { id: 'q3', question: 'Việc gán "owner" cho tài sản nhằm?', options: ['Tăng lỗ hổng', 'Chịu trách nhiệm bảo vệ & phân loại nó', 'Xoá tài sản', 'Che giấu tài sản'], correctIndex: 1, explanation: 'Chủ sở hữu chịu trách nhiệm phân loại và bảo vệ tài sản.' },
]);

const c4 = doc('iaa202-4-1-threat-vuln', '4.1 — Threat & vulnerability assessment|||4.1 — Đánh giá mối đe doạ & lỗ hổng',
  'Nguồn đe doạ (con người/tự nhiên/kỹ thuật), threat modeling (STRIDE), đánh giá lỗ hổng (quét/pentest), CVE/CVSS.',
  [[
    `<span class="eyebrow">IAA202 · Chapter 4 · Lesson 4.1</span>
<h2>Threat &amp; vulnerability assessment</h2>
<h3>Threat sources</h3>
<ul>
<li><strong>Human — adversarial</strong>: hackers, insiders, competitors.</li>
<li><strong>Human — accidental</strong>: mistakes, misconfiguration.</li>
<li><strong>Natural</strong>: flood, fire, power loss.</li>
<li><strong>Technical / structural</strong>: hardware failure, software bugs.</li>
</ul>
<h3>Threat modeling with STRIDE</h3>
<pre><code>S poofing        - pretending to be someone else
T ampering       - altering data
R epudiation     - denying an action
I nfo disclosure - leaking data
D enial of svc   - taking a system down
E levation       - gaining higher privilege
</code></pre>
<h3>Vulnerability assessment</h3>
<p>Find the weaknesses that threats could hit: <strong>vulnerability scanning</strong> (automated), <strong>penetration testing</strong> (simulated attack), config &amp; patch review. Public weaknesses are tracked as <strong>CVE</strong> and scored 0-10 by <strong>CVSS</strong>.</p>
<div class="callout"><span class="badge">Pair them</span> A threat with no matching vulnerability is not yet a risk; a vulnerability with no credible threat is low priority. Risk lives where the two meet.</div>`,
    `<span class="eyebrow">IAA202 · Chương 4 · Bài 4.1</span>
<h2>Đánh giá mối đe doạ &amp; lỗ hổng</h2>
<h3>Nguồn đe doạ</h3>
<ul>
<li><strong>Con người — cố ý</strong>: hacker, người nội bộ, đối thủ.</li>
<li><strong>Con người — vô ý</strong>: sai sót, cấu hình nhầm.</li>
<li><strong>Tự nhiên</strong>: lũ, cháy, mất điện.</li>
<li><strong>Kỹ thuật / cấu trúc</strong>: hỏng phần cứng, lỗi phần mềm.</li>
</ul>
<h3>Mô hình hoá đe doạ với STRIDE</h3>
<pre><code>S poofing        - giả danh người khác
T ampering       - sửa đổi dữ liệu
R epudiation     - chối bỏ hành vi
I nfo disclosure - lộ lọt dữ liệu
D enial of svc   - làm sập dịch vụ
E levation       - leo thang đặc quyền
</code></pre>
<h3>Đánh giá lỗ hổng</h3>
<p>Tìm điểm yếu mà đe doạ có thể nhắm tới: <strong>quét lỗ hổng</strong> (tự động), <strong>kiểm thử xâm nhập (pentest)</strong> (mô phỏng tấn công), soát cấu hình &amp; bản vá. Lỗ hổng công khai được đánh mã <strong>CVE</strong> và chấm điểm 0-10 bằng <strong>CVSS</strong>.</p>
<div class="callout"><span class="badge">Ghép cặp</span> Đe doạ mà không có lỗ hổng khớp thì chưa thành rủi ro; lỗ hổng mà không có đe doạ đáng tin thì ưu tiên thấp. Rủi ro nằm ở chỗ hai thứ gặp nhau.</div>`,
  ]]);

const c4q = quiz('iaa202-quiz-4', 'Quiz 4 — Threats & vulnerabilities|||Quiz 4 — Đe doạ & lỗ hổng', [
  { id: 'q1', question: 'STRIDE là khung dùng để?', options: ['Sao lưu dữ liệu', 'Mô hình hoá mối đe doạ', 'Định giá tài sản', 'Tính ngân sách'], correctIndex: 1, explanation: 'STRIDE liệt kê 6 loại đe doạ: Spoofing, Tampering, Repudiation, Info disclosure, DoS, Elevation.' },
  { id: 'q2', question: 'CVSS dùng để?', options: ['Đặt tên tài sản', 'Chấm mức nghiêm trọng của lỗ hổng (0-10)', 'Sao lưu', 'Mã hoá dữ liệu'], correctIndex: 1, explanation: 'CVSS chấm điểm 0-10; CVE là mã định danh lỗ hổng công khai.' },
  { id: 'q3', question: 'Kỹ thuật mô phỏng tấn công thật để tìm lỗ hổng gọi là?', options: ['Kiểm thử xâm nhập (pentest)', 'Sao lưu', 'Kiểm toán tài chính', 'Định giá CIA'], correctIndex: 0, explanation: 'Pentest mô phỏng kẻ tấn công; quét lỗ hổng thì tự động và rộng hơn.' },
]);

const c5 = doc('iaa202-5-1-risk-analysis', '5.1 — Risk analysis: qualitative & quantitative|||5.1 — Phân tích rủi ro: định tính & định lượng',
  'Định tính (ma trận likelihood×impact) vs định lượng; công thức SLE = AV × EF, ALE = SLE × ARO; xếp hạng và ưu tiên rủi ro.',
  [[
    `<span class="eyebrow">IAA202 · Chapter 5 · Lesson 5.1</span>
<h2>Risk analysis: qualitative &amp; quantitative</h2>
<h3>Qualitative — the risk matrix</h3>
<p>Rate <strong>likelihood</strong> and <strong>impact</strong> on a scale (Low/Medium/High) and read the cell. Fast, subjective, great for prioritizing.</p>
<pre><code>Impact \\ Likelihood   Low     Medium   High
 High                 Medium  High     Critical
 Medium               Low     Medium   High
 Low                  Low     Low      Medium
</code></pre>
<h3>Quantitative — put a number on it</h3>
<pre><code>SLE = AV x EF     (Single Loss Expectancy)
 AV = Asset Value        EF = Exposure Factor (% lost per event)
ALE = SLE x ARO   (Annualized Loss Expectancy)
 ARO = Annualized Rate of Occurrence (events per year)
</code></pre>
<h3>Worked example</h3>
<pre><code>Server AV = 50,000 USD ; a fire destroys 60% of it -> EF = 0.6
 SLE = 50,000 x 0.6 = 30,000 USD
 Fire expected once per 10 years -> ARO = 0.1
 ALE = 30,000 x 0.1 = 3,000 USD / year
</code></pre>
<div class="callout"><span class="badge">Decision rule</span> ALE is the yearly budget a risk justifies: if a control costs less than the ALE it removes, it usually pays for itself.</div>`,
    `<span class="eyebrow">IAA202 · Chương 5 · Bài 5.1</span>
<h2>Phân tích rủi ro: định tính &amp; định lượng</h2>
<h3>Định tính — ma trận rủi ro</h3>
<p>Chấm <strong>khả năng</strong> và <strong>tác động</strong> theo thang (Thấp/Vừa/Cao) rồi đọc ô. Nhanh, chủ quan, tốt để xếp ưu tiên.</p>
<pre><code>Tác động \\ Khả năng   Thấp    Vừa     Cao
 Cao                  Vừa     Cao     Nghiêm trọng
 Vừa                  Thấp    Vừa     Cao
 Thấp                 Thấp    Thấp    Vừa
</code></pre>
<h3>Định lượng — gắn con số</h3>
<pre><code>SLE = AV x EF     (Tổn thất đơn lần)
 AV = Giá trị tài sản    EF = Hệ số phơi nhiễm (% mất mỗi lần)
ALE = SLE x ARO   (Tổn thất kỳ vọng năm)
 ARO = Số lần xảy ra trong năm
</code></pre>
<h3>Ví dụ tính</h3>
<pre><code>Máy chủ AV = 50.000 USD ; cháy phá 60% -> EF = 0,6
 SLE = 50.000 x 0,6 = 30.000 USD
 Cháy kỳ vọng 10 năm một lần -> ARO = 0,1
 ALE = 30.000 x 0,1 = 3.000 USD / năm
</code></pre>
<div class="callout"><span class="badge">Quy tắc quyết định</span> ALE là ngân sách mỗi năm mà một rủi ro biện minh được: nếu kiểm soát rẻ hơn ALE nó cắt được thì thường đáng bỏ tiền.</div>`,
  ]]);

const c5q = quiz('iaa202-quiz-5', 'Quiz 5 — Risk analysis|||Quiz 5 — Phân tích rủi ro', [
  { id: 'q1', question: 'Công thức SLE (tổn thất đơn lần) là?', options: ['SLE = ALE × ARO', 'SLE = AV × EF', 'SLE = AV + EF', 'SLE = ARO / AV'], correctIndex: 1, explanation: 'SLE = Asset Value × Exposure Factor.' },
  { id: 'q2', question: 'AV=50.000, EF=0,6, ARO=0,1. ALE bằng?', options: ['30.000 USD', '3.000 USD', '5.000 USD', '300 USD'], correctIndex: 1, explanation: 'SLE = 50.000×0,6 = 30.000; ALE = 30.000×0,1 = 3.000 USD/năm.' },
  { id: 'q3', question: 'Phân tích ĐỊNH TÍNH khác định lượng ở chỗ?', options: ['Luôn chính xác tới USD', 'Dùng thang Thấp/Vừa/Cao & ma trận, mang tính chủ quan', 'Không cần likelihood', 'Chỉ dùng cho phần cứng'], correctIndex: 1, explanation: 'Định tính xếp hạng bằng ma trận likelihood×impact; định lượng gắn số tiền (SLE/ALE).' },
]);

const c6 = doc('iaa202-6-1-risk-treatment', '6.1 — Risk treatment & controls|||6.1 — Xử lý rủi ro & kiểm soát',
  'Bốn lựa chọn: chấp nhận/giảm/chuyển/tránh; risk appetite & residual risk; phân loại kiểm soát (phòng ngừa/phát hiện/khắc phục; hành chính/kỹ thuật/vật lý).',
  [[
    `<span class="eyebrow">IAA202 · Chapter 6 · Lesson 6.1</span>
<h2>Risk treatment &amp; controls</h2>
<h3>The four treatment options</h3>
<ul>
<li><strong>Accept</strong> — the risk is within appetite; do nothing but document it.</li>
<li><strong>Mitigate (reduce)</strong> — add controls to lower likelihood or impact.</li>
<li><strong>Transfer (share)</strong> — shift it to a third party (insurance, outsourcing).</li>
<li><strong>Avoid</strong> — stop the activity that creates the risk.</li>
</ul>
<pre><code>Residual risk = Inherent risk - effect of controls
 Treat until residual risk is at or below the risk appetite.
</code></pre>
<h3>Kinds of control</h3>
<ul>
<li><strong>By function</strong>: preventive (firewall), detective (IDS, logs), corrective (backup restore).</li>
<li><strong>By type</strong>: administrative (policy, training), technical (encryption, access control), physical (locks, CCTV).</li>
</ul>
<div class="callout"><span class="badge">Cost-justified</span> Do not spend 10,000 USD of controls to protect against a 3,000 USD/year ALE — accept or transfer instead. Match the control to the number.</div>`,
    `<span class="eyebrow">IAA202 · Chương 6 · Bài 6.1</span>
<h2>Xử lý rủi ro &amp; kiểm soát</h2>
<h3>Bốn lựa chọn xử lý</h3>
<ul>
<li><strong>Chấp nhận (accept)</strong> — rủi ro trong ngưỡng chịu; không làm gì ngoài ghi nhận.</li>
<li><strong>Giảm (mitigate)</strong> — thêm kiểm soát để hạ khả năng hoặc tác động.</li>
<li><strong>Chuyển (transfer)</strong> — đẩy sang bên thứ ba (bảo hiểm, thuê ngoài).</li>
<li><strong>Tránh (avoid)</strong> — dừng hoạt động sinh ra rủi ro.</li>
</ul>
<pre><code>Rủi ro còn lại = Rủi ro gốc - tác dụng của kiểm soát
 Xử lý cho tới khi rủi ro còn lại bằng hoặc dưới ngưỡng chịu.
</code></pre>
<h3>Các loại kiểm soát</h3>
<ul>
<li><strong>Theo chức năng</strong>: phòng ngừa (tường lửa), phát hiện (IDS, log), khắc phục (khôi phục sao lưu).</li>
<li><strong>Theo dạng</strong>: hành chính (chính sách, đào tạo), kỹ thuật (mã hoá, kiểm soát truy cập), vật lý (khoá, camera).</li>
</ul>
<div class="callout"><span class="badge">Cân theo giá</span> Đừng bỏ 10.000 USD kiểm soát để chống một ALE 3.000 USD/năm — hãy chấp nhận hoặc chuyển. Khớp kiểm soát với con số.</div>`,
  ]]);

const c6q = quiz('iaa202-quiz-6', 'Quiz 6 — Risk treatment|||Quiz 6 — Xử lý rủi ro', [
  { id: 'q1', question: 'Mua bảo hiểm mạng để bù thiệt hại là kiểu xử lý?', options: ['Tránh (avoid)', 'Chuyển (transfer)', 'Chấp nhận (accept)', 'Giảm (mitigate)'], correctIndex: 1, explanation: 'Chuyển rủi ro sang bên thứ ba, ví dụ bảo hiểm hoặc thuê ngoài.' },
  { id: 'q2', question: 'Rủi ro CÒN LẠI (residual) là?', options: ['Rủi ro trước khi có kiểm soát', 'Rủi ro còn sau khi đã áp kiểm soát', 'Rủi ro của bên thứ ba', 'Rủi ro đã tránh hẳn'], correctIndex: 1, explanation: 'Residual = rủi ro gốc trừ tác dụng của kiểm soát; cần ≤ ngưỡng chịu.' },
  { id: 'q3', question: 'Sao lưu để khôi phục sau sự cố là loại kiểm soát?', options: ['Phòng ngừa', 'Khắc phục (corrective)', 'Phát hiện', 'Hành chính'], correctIndex: 1, explanation: 'Khắc phục: phục hồi sau khi sự cố đã xảy ra (IDS là phát hiện, tường lửa là phòng ngừa).' },
]);

const c7 = doc('iaa202-7-1-monitoring-compliance', '7.1 — Monitoring & compliance|||7.1 — Giám sát & tuân thủ',
  'Giám sát liên tục, KRI/KPI, kiểm toán nội bộ & độc lập, tuân thủ (ISO 27001, GDPR) và khung pháp lý VN (Luật An ninh mạng, ATTT mạng).',
  [[
    `<span class="eyebrow">IAA202 · Chapter 7 · Lesson 7.1</span>
<h2>Monitoring &amp; compliance</h2>
<p>Risk is not a one-off report — the environment changes, so the risk register must be alive.</p>
<h3>Continuous monitoring</h3>
<ul>
<li><strong>KRI (Key Risk Indicator)</strong> — an early-warning metric (e.g. failed-login rate, unpatched-host count).</li>
<li><strong>Review triggers</strong> — new asset, new threat, incident, major change.</li>
<li>Keep a <strong>risk register</strong>: each risk, its owner, treatment, residual level, review date.</li>
</ul>
<h3>Audit &amp; compliance</h3>
<ul>
<li><strong>Internal / external audit</strong> — evidence that controls exist and work.</li>
<li><strong>Certifiable standard</strong>: <strong>ISO/IEC 27001</strong> (the ISMS you can be certified against; 27005 feeds its risk work).</li>
<li><strong>Regulations</strong>: GDPR (EU), and in Vietnam the <strong>Law on Cybersecurity 2018</strong> and <strong>Law on Cyber-information Security 2015</strong> — including data localization and breach-reporting duties.</li>
</ul>
<div class="callout"><span class="badge">Compliance is a floor</span> Meeting the law is the minimum, not the goal — a compliant system can still carry unacceptable risk. Manage risk; compliance follows.</div>`,
    `<span class="eyebrow">IAA202 · Chương 7 · Bài 7.1</span>
<h2>Giám sát &amp; tuân thủ</h2>
<p>Rủi ro không phải báo cáo một lần — môi trường thay đổi, nên sổ rủi ro phải sống.</p>
<h3>Giám sát liên tục</h3>
<ul>
<li><strong>KRI (chỉ số rủi ro chính)</strong> — thước đo cảnh báo sớm (vd tỉ lệ đăng nhập thất bại, số máy chưa vá).</li>
<li><strong>Mốc rà soát</strong> — có tài sản mới, đe doạ mới, sự cố, thay đổi lớn.</li>
<li>Giữ một <strong>sổ rủi ro (risk register)</strong>: từng rủi ro, chủ sở hữu, cách xử lý, mức còn lại, ngày rà lại.</li>
</ul>
<h3>Kiểm toán &amp; tuân thủ</h3>
<ul>
<li><strong>Kiểm toán nội bộ / độc lập</strong> — bằng chứng kiểm soát tồn tại và chạy đúng.</li>
<li><strong>Chuẩn chứng nhận được</strong>: <strong>ISO/IEC 27001</strong> (hệ ISMS có thể chứng nhận; 27005 lo phần rủi ro cho nó).</li>
<li><strong>Quy định</strong>: GDPR (EU), và tại Việt Nam là <strong>Luật An ninh mạng 2018</strong> và <strong>Luật An toàn thông tin mạng 2015</strong> — gồm nghĩa vụ lưu trữ dữ liệu trong nước và báo cáo sự cố.</li>
</ul>
<div class="callout"><span class="badge">Tuân thủ là sàn</span> Đạt luật là mức tối thiểu, không phải đích — hệ thống tuân thủ vẫn có thể còn rủi ro không chấp nhận được. Hãy quản trị rủi ro; tuân thủ sẽ theo sau.</div>`,
  ]]);

const c7q = quiz('iaa202-quiz-7', 'Quiz 7 — Monitoring & compliance|||Quiz 7 — Giám sát & tuân thủ', [
  { id: 'q1', question: 'KRI (Key Risk Indicator) là?', options: ['Một loại tài sản', 'Thước đo cảnh báo sớm về rủi ro', 'Một điều luật', 'Một kiểu tấn công'], correctIndex: 1, explanation: 'KRI là chỉ số theo dõi để cảnh báo sớm rủi ro đang tăng.' },
  { id: 'q2', question: 'Chuẩn ISMS có thể được CHỨNG NHẬN là?', options: ['ISO/IEC 27001', 'ISO/IEC 27005', 'ISO 31000', 'NIST SP 800-30'], correctIndex: 0, explanation: '27001 là ISMS chứng nhận được; 27005 là hướng dẫn rủi ro nuôi cho nó.' },
  { id: 'q3', question: 'Ở Việt Nam, văn bản pháp lý cốt lõi về an ninh mạng là?', options: ['GDPR', 'Luật An ninh mạng 2018 & Luật ATTT mạng 2015', 'HIPAA', 'PCI-DSS'], correctIndex: 1, explanation: 'Luật An ninh mạng 2018 và Luật An toàn thông tin mạng 2015 là khung pháp lý VN.' },
]);

const c8 = doc('iaa202-8-1-incident-bcp', '8.1 — Incident response & business continuity|||8.1 — Ứng phó sự cố & liên tục kinh doanh',
  'Vòng ứng phó sự cố (NIST SP 800-61), BCP/DRP, RTO/RPO, lessons learned và cải tiến liên tục sau sự cố.',
  [[
    `<span class="eyebrow">IAA202 · Chapter 8 · Lesson 8.1</span>
<h2>Incident response &amp; business continuity</h2>
<p>Controls reduce risk but never to zero — so plan for the incident that gets through.</p>
<h3>Incident response cycle (NIST SP 800-61)</h3>
<pre><code>Preparation -> Detection &amp; Analysis
            -> Containment, Eradication &amp; Recovery
            -> Post-incident activity (lessons learned)
</code></pre>
<h3>Business continuity &amp; disaster recovery</h3>
<ul>
<li><strong>BCP (Business Continuity Plan)</strong> — keep critical operations running during disruption.</li>
<li><strong>DRP (Disaster Recovery Plan)</strong> — restore IT systems and data after a disaster.</li>
</ul>
<pre><code>RTO = Recovery Time Objective  - how fast you must be back up
RPO = Recovery Point Objective - how much recent data you can lose
 Example: RTO = 4 h, RPO = 15 min -> restore within 4 hours,
          losing at most the last 15 minutes of data.
</code></pre>
<h3>Learn &amp; improve</h3>
<p>Every incident feeds the <strong>lessons-learned</strong> step, which updates the risk register and controls — closing the loop back to Chapter 2. Risk management is continuous, never done.</p>
<div class="callout"><span class="badge">Untested = no plan</span> A BCP/DRP that has never been drilled will fail when it counts. Test it, time it against RTO/RPO, then fix the gaps.</div>`,
    `<span class="eyebrow">IAA202 · Chương 8 · Bài 8.1</span>
<h2>Ứng phó sự cố &amp; liên tục kinh doanh</h2>
<p>Kiểm soát làm giảm rủi ro nhưng không bao giờ về 0 — nên phải chuẩn bị cho sự cố lọt qua.</p>
<h3>Vòng ứng phó sự cố (NIST SP 800-61)</h3>
<pre><code>Chuẩn bị -> Phát hiện &amp; Phân tích
         -> Khoanh vùng, Diệt trừ &amp; Khôi phục
         -> Hoạt động sau sự cố (bài học rút ra)
</code></pre>
<h3>Liên tục kinh doanh &amp; khôi phục thảm hoạ</h3>
<ul>
<li><strong>BCP (Kế hoạch liên tục kinh doanh)</strong> — giữ hoạt động trọng yếu chạy khi bị gián đoạn.</li>
<li><strong>DRP (Kế hoạch khôi phục thảm hoạ)</strong> — phục hồi hệ thống CNTT và dữ liệu sau thảm hoạ.</li>
</ul>
<pre><code>RTO = Mục tiêu thời gian khôi phục - phải chạy lại nhanh tới đâu
RPO = Mục tiêu điểm khôi phục      - được phép mất bao nhiêu dữ liệu gần đây
 Ví dụ: RTO = 4 h, RPO = 15 phút -> khôi phục trong 4 giờ,
        mất tối đa 15 phút dữ liệu cuối.
</code></pre>
<h3>Học &amp; cải tiến</h3>
<p>Mỗi sự cố nuôi cho bước <strong>bài học rút ra</strong>, bước này cập nhật sổ rủi ro và kiểm soát — khép vòng quay lại Chương 2. Quản trị rủi ro là liên tục, không bao giờ xong.</p>
<div class="callout"><span class="badge">Chưa diễn tập = không có kế hoạch</span> BCP/DRP chưa từng diễn tập sẽ hỏng đúng lúc cần. Hãy thử, bấm giờ so với RTO/RPO, rồi vá chỗ hở.</div>`,
  ]]);

const c8q = quiz('iaa202-quiz-8', 'Quiz 8 — Incident response & BCP|||Quiz 8 — Ứng phó sự cố & BCP', [
  { id: 'q1', question: 'RPO (Recovery Point Objective) trả lời câu hỏi?', options: ['Phải chạy lại nhanh tới đâu', 'Được phép mất bao nhiêu dữ liệu gần đây', 'Kiểm soát tốn bao nhiêu', 'Ai là chủ tài sản'], correctIndex: 1, explanation: 'RPO = lượng dữ liệu mất tối đa; RTO = thời gian khôi phục cho phép.' },
  { id: 'q2', question: 'Thứ tự đúng của vòng ứng phó sự cố (NIST SP 800-61)?', options: ['Khôi phục → chuẩn bị → phát hiện', 'Chuẩn bị → phát hiện & phân tích → khoanh vùng/diệt/khôi phục → bài học', 'Bài học → chuẩn bị', 'Phát hiện → chấp nhận rủi ro'], correctIndex: 1, explanation: 'Preparation → Detection & Analysis → Containment/Eradication/Recovery → Post-incident.' },
  { id: 'q3', question: 'Bước "bài học rút ra" sau sự cố quan trọng vì?', options: ['Để xoá log', 'Cập nhật sổ rủi ro & kiểm soát, khép vòng cải tiến', 'Để đổ lỗi', 'Không có tác dụng'], correctIndex: 1, explanation: 'Lessons learned nuôi lại quản trị rủi ro, làm quy trình liên tục cải tiến.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'IAA202',
    slug: 'iaa202-risk-management-in-information-systems',
    title: 'Risk Management in Information Systems',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/IAA202.webp',
    shortDescription: 'End-to-end information-security risk management — risk/threat/vulnerability/asset, NIST RMF, ISO 27005 & 31000, asset valuation (CIA), SLE/ARO/ALE & risk matrix, treatment & controls, monitoring, compliance & incident response.|||Quản trị rủi ro an toàn thông tin trọn vòng — rủi ro/đe doạ/lỗ hổng/tài sản, NIST RMF, ISO 27005 & 31000, định giá tài sản (CIA), SLE/ARO/ALE & ma trận rủi ro, xử lý & kiểm soát, giám sát, tuân thủ & ứng phó sự cố.',
    description: 'Môn <strong>IAA202 — Risk Management in Information Systems</strong> (kỳ 5, ngành An toàn thông tin) dạy cách <strong>quản trị rủi ro</strong> cho hệ thống thông tin theo chuẩn quốc tế. Từ <strong>khái niệm nền</strong> (rủi ro/đe doạ/lỗ hổng/tài sản) → <strong>khung</strong> (NIST RMF, ISO/IEC 27005, ISO 31000) → <strong>nhận diện &amp; định giá tài sản</strong> (CIA) → <strong>đánh giá đe doạ &amp; lỗ hổng</strong> (STRIDE, CVE/CVSS) → <strong>phân tích rủi ro</strong> (định tính/định lượng, SLE/ARO/ALE) → <strong>xử lý &amp; kiểm soát</strong> → <strong>giám sát &amp; tuân thủ</strong> (Luật An ninh mạng VN) → <strong>ứng phó sự cố &amp; BCP/DRP</strong>. Song ngữ, có công thức, ma trận và ví dụ thật, quiz mỗi chương.',
    whatYouLearn: 'Tam giác asset–threat–vulnerability và risk = khả năng × tác động; các bước NIST RMF, quy trình ISO 27005, nguyên tắc ISO 31000; kiểm kê &amp; định giá tài sản theo CIA; threat modeling (STRIDE), đánh giá lỗ hổng, CVE/CVSS; ma trận rủi ro và công thức SLE = AV×EF, ALE = SLE×ARO; bốn cách xử lý (chấp nhận/giảm/chuyển/tránh) và phân loại kiểm soát; giám sát bằng KRI, kiểm toán, tuân thủ ISO 27001 &amp; Luật An ninh mạng VN; ứng phó sự cố (NIST SP 800-61), BCP/DRP, RTO/RPO.',
    requirements: 'Kiến thức nhập môn CNTT &amp; an toàn thông tin cơ bản. Không cần lập trình. Nên biết khái niệm mạng và hệ thống ở mức phổ thông.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, chuẩn NIST/ISO, Luật An ninh mạng VN, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Quản trị rủi ro là gì, tam giác asset–threat–vulnerability, lộ trình 4 bước.', lessons: [intro] },
    { title: 'Chương 1 — Rủi ro & quản trị rủi ro|||Chapter 1 — Risk & risk management', description: 'Khái niệm risk/threat/vulnerability/asset, vì sao QTRR.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Khung quản trị rủi ro|||Chapter 2 — Frameworks', description: 'NIST RMF, ISO 27005, ISO 31000, quy trình.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Nhận diện & định giá tài sản|||Chapter 3 — Asset identification & valuation', description: 'Kiểm kê, phân loại, giá trị, CIA.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Đánh giá đe doạ & lỗ hổng|||Chapter 4 — Threat & vulnerability assessment', description: 'STRIDE, đánh giá lỗ hổng, CVE/CVSS.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Phân tích rủi ro|||Chapter 5 — Risk analysis', description: 'Định tính/định lượng, ma trận, SLE/ARO/ALE.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Xử lý rủi ro|||Chapter 6 — Risk treatment', description: 'Chấp nhận/giảm/chuyển/tránh, kiểm soát.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Giám sát & tuân thủ|||Chapter 7 — Monitoring & compliance', description: 'KRI, kiểm toán, compliance, khung pháp lý.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Ứng phó sự cố & BCP/DRP|||Chapter 8 — Incident response & BCP/DRP', description: 'Incident response, BCP/DRP, RTO/RPO, cải tiến.', lessons: [c8, c8q] },
  ],
};
