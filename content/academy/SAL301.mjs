/**
 * SAL301 — Professional Selling and Management. Giáo trình tham khảo (trích
 * dẫn, KHÔNG upload PDF): "Selling Today" (Manning/Ahearne/Reece), "SPIN
 * Selling" (Rackham), "ABC's of Relationship Selling" (Futrell). 8 chương:
 * tổng quan bán hàng chuyên nghiệp → hành vi khách hàng → prospecting →
 * SPIN/tiếp cận → trình bày/demo → xử lý phản đối & chốt sale → CRM sau bán
 * → quản trị bán hàng cơ bản (lãnh thổ/chỉ tiêu/hiệu suất). Nhấn KỸ NĂNG BÁN
 * HÀNG CÁ NHÂN (personal selling process), khác SMG301 (thuần quản trị đội
 * ngũ). Song ngữ. Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('sal301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình tham khảo (Selling Today, SPIN Selling, ABC\'s of Relationship Selling), tài liệu chính thức miễn phí, YouTube, công cụ CRM, lộ trình tự học.',
  [[
    `<span class="eyebrow">SAL301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Professional Selling and Management</strong> — the personal selling process, consultative/SPIN techniques, objection handling, closing, and the basics of sales management — in one place. The full official slides &amp; giáo trình live on <strong>FLM</strong>; below are the reference books this course draws on and free legal resources.</p>
<h3>📘 Reference textbooks</h3>
<ul>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/selling-today-partnering-to-create-value/P200000005942" target="_blank" rel="noopener"><em>Selling Today: Partnering to Create Value</em> — Manning, Ahearne &amp; Reece</a> — main reference; the personal selling process end to end.</li>
<li><a href="https://www.spinselling.com/" target="_blank" rel="noopener"><em>SPIN Selling</em> — Neil Rackham</a> — Situation/Problem/Implication/Need-payoff questioning, research-based.</li>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/abcs-of-relationship-selling-through-service/P200000005961" target="_blank" rel="noopener"><em>ABC's of Relationship Selling through Service</em> — Charles Futrell</a> — long-term customer relationships &amp; service after the sale.</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — official FPTU giáo trình &amp; lecture slides, sign in with your FPTU account.</li>
<li><a href="https://www.salesforce.com/resources/articles/sales-process/" target="_blank" rel="noopener">Salesforce — the sales process explained</a></li>
<li><a href="https://www.hubspot.com/sales" target="_blank" rel="noopener">HubSpot Sales resource hub</a> — prospecting, CRM, closing guides</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@VictorAntonioLive" target="_blank" rel="noopener">Victor Antonio</a> — sales psychology &amp; closing techniques</li>
<li><a href="https://www.youtube.com/@SalesInsightsLab" target="_blank" rel="noopener">Sales Insights Lab (Marc Wayshak)</a> — modern B2B selling &amp; prospecting</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.hubspot.com/products/crm" target="_blank" rel="noopener">HubSpot CRM (free tier)</a> — practice building a pipeline &amp; contact records</li>
<li><a href="https://trello.com/" target="_blank" rel="noopener">Trello</a> — simple kanban to track a mock sales pipeline stage by stage</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — personal selling process, buyer behaviour, the sales funnel.</li>
<li><strong>Practice</strong> — role-play SPIN questioning and objection handling on a simple product.</li>
<li><strong>Go deeper</strong> — build a one-page proposal (FABE) and rehearse a full call: approach → discover → present → close.</li>
<li><strong>Job-ready</strong> — track a mock pipeline in a free CRM and learn how quota &amp; territory decisions are made.</li>
</ol></div>`,
    `<span class="eyebrow">SAL301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Bán hàng Chuyên nghiệp &amp; Quản trị Bán hàng</strong> — quy trình bán hàng cá nhân, kỹ thuật tư vấn/SPIN, xử lý phản đối, chốt sale, và nền tảng quản trị bán hàng — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là các sách tham khảo môn này dựa vào và nguồn miễn phí hợp pháp.</p>
<h3>📘 Sách tham khảo</h3>
<ul>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/selling-today-partnering-to-create-value/P200000005942" target="_blank" rel="noopener"><em>Selling Today: Partnering to Create Value</em> — Manning, Ahearne &amp; Reece</a> — tài liệu chính; toàn bộ quy trình bán hàng cá nhân.</li>
<li><a href="https://www.spinselling.com/" target="_blank" rel="noopener"><em>SPIN Selling</em> — Neil Rackham</a> — bộ câu hỏi Tình huống/Vấn đề/Hệ quả/Lợi ích-Giải quyết, dựa trên nghiên cứu thực nghiệm.</li>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/abcs-of-relationship-selling-through-service/P200000005961" target="_blank" rel="noopener"><em>ABC's of Relationship Selling through Service</em> — Charles Futrell</a> — xây quan hệ khách hàng dài hạn &amp; dịch vụ sau bán.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — giáo trình FPTU &amp; slide bài giảng chính thức, đăng nhập bằng tài khoản FPTU.</li>
<li><a href="https://www.salesforce.com/resources/articles/sales-process/" target="_blank" rel="noopener">Salesforce — giải thích quy trình bán hàng</a></li>
<li><a href="https://www.hubspot.com/sales" target="_blank" rel="noopener">Trung tâm tài liệu HubSpot Sales</a> — prospecting, CRM, hướng dẫn chốt sale</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@VictorAntonioLive" target="_blank" rel="noopener">Victor Antonio</a> — tâm lý bán hàng &amp; kỹ thuật chốt sale</li>
<li><a href="https://www.youtube.com/@SalesInsightsLab" target="_blank" rel="noopener">Sales Insights Lab (Marc Wayshak)</a> — bán hàng B2B hiện đại &amp; tìm khách</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.hubspot.com/products/crm" target="_blank" rel="noopener">HubSpot CRM (bản miễn phí)</a> — luyện dựng pipeline &amp; hồ sơ liên hệ</li>
<li><a href="https://trello.com/" target="_blank" rel="noopener">Trello</a> — kanban đơn giản để theo dõi pipeline giả định theo từng giai đoạn</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — quy trình bán hàng cá nhân, hành vi người mua, phễu bán hàng.</li>
<li><strong>Luyện tập</strong> — nhập vai đặt câu hỏi SPIN và xử lý phản đối trên một sản phẩm đơn giản.</li>
<li><strong>Đào sâu</strong> — dựng đề xuất một trang (FABE) và luyện trọn cuộc gọi: tiếp cận → khám phá → trình bày → chốt.</li>
<li><strong>Sẵn sàng đi làm</strong> — theo dõi pipeline giả định trên CRM miễn phí và hiểu cách đặt chỉ tiêu &amp; lãnh thổ.</li>
</ol></div>`,
  ]]);

const intro = doc('sal301-0-1-overview', 'Course overview: Professional Selling and Management|||Tổng quan: Bán hàng Chuyên nghiệp & Quản trị Bán hàng',
  'Bán hàng cá nhân là gì, vì sao là nghề nghiệp chiến lược; lộ trình 8 chương từ vai trò người bán → hành vi khách hàng → prospecting → SPIN → trình bày → xử lý phản đối & chốt sale → CRM sau bán → quản trị bán hàng cơ bản.',
  [[
    `<span class="eyebrow">SAL301 · Lesson 0.1 · Overview</span>
<h2>Professional Selling &amp; Sales Management</h2>
<p class="lead">This course builds the <strong>personal selling process</strong> from the ground up — how a professional salesperson finds customers, understands them, proposes a solution that fits, and earns a long-term relationship — plus the basics of how a sales <em>function</em> is managed. It draws on three references: <strong>Selling Today</strong> (Manning/Ahearne/Reece), <strong>SPIN Selling</strong> (Rackham), and <strong>ABC's of Relationship Selling</strong> (Futrell).</p>
<h3>Two halves of the course</h3>
<ul>
<li><strong>Personal selling (chapters 1–7)</strong> — the individual salesperson's skill set: prospecting, need discovery, presenting, handling objections, closing, and after-sale service.</li>
<li><strong>Sales management basics (chapter 8)</strong> — how a manager organizes territory, sets quotas, and measures a sales team's performance. (A full treatment of managing a sales force is covered in the companion course <strong>SMG301 — Sales Management</strong>; here it is the closing chapter, seen from a salesperson's perspective.)</li>
</ul>
<h3>Roadmap</h3>
<pre><code>1. The professional salesperson's role
2. Buyer behaviour & the psychology of buying
3. Prospecting & qualifying leads
4. Approach & need discovery (SPIN)
5. Presentation & solution demonstration
6. Handling objections & closing
7. After-sale service & CRM
8. Sales management basics: territory, quota, performance
</code></pre>
<div class="callout"><span class="badge">One idea to hold onto</span> Modern selling is <strong>consultative</strong>, not transactional — the salesperson's job is to diagnose a customer's real problem and co-create the right solution, not to "push" a fixed pitch.</div>`,
    `<span class="eyebrow">SAL301 · Bài 0.1 · Tổng quan</span>
<h2>Bán hàng Chuyên nghiệp &amp; Quản trị Bán hàng</h2>
<p class="lead">Môn này xây dựng <strong>quy trình bán hàng cá nhân</strong> từ gốc — cách một nhân viên bán hàng chuyên nghiệp tìm khách hàng, hiểu khách hàng, đề xuất giải pháp phù hợp, và giữ được quan hệ dài hạn — cộng thêm nền tảng về cách một bộ phận bán hàng được <em>quản trị</em>. Môn dựa trên ba tài liệu: <strong>Selling Today</strong> (Manning/Ahearne/Reece), <strong>SPIN Selling</strong> (Rackham), và <strong>ABC's of Relationship Selling</strong> (Futrell).</p>
<h3>Hai nửa của môn học</h3>
<ul>
<li><strong>Bán hàng cá nhân (chương 1–7)</strong> — bộ kỹ năng của từng nhân viên bán hàng: tìm khách, khám phá nhu cầu, trình bày, xử lý phản đối, chốt sale, chăm sóc sau bán.</li>
<li><strong>Quản trị bán hàng cơ bản (chương 8)</strong> — cách người quản lý tổ chức lãnh thổ, đặt chỉ tiêu, và đo hiệu suất đội ngũ. (Phần đầy đủ về quản trị lực lượng bán hàng nằm ở môn song hành <strong>SMG301 — Sales Management</strong>; ở đây nó là chương kết, nhìn từ góc độ nhân viên bán hàng.)</li>
</ul>
<h3>Lộ trình</h3>
<pre><code>1. Vai trò nhân viên bán hàng chuyên nghiệp
2. Hành vi khách hàng & tâm lý mua
3. Tìm kiếm & đánh giá khách hàng tiềm năng
4. Tiếp cận & khám phá nhu cầu (SPIN)
5. Trình bày & demo giải pháp
6. Xử lý phản đối & chốt sale
7. Chăm sóc sau bán & CRM
8. Quản trị bán hàng cơ bản: lãnh thổ, chỉ tiêu, hiệu suất
</code></pre>
<div class="callout"><span class="badge">Một ý cần nhớ</span> Bán hàng hiện đại mang tính <strong>tư vấn (consultative)</strong>, không phải giao dịch — việc của nhân viên bán hàng là chẩn đoán đúng vấn đề của khách hàng và cùng tạo ra giải pháp phù hợp, không phải "đẩy" một bài chào hàng cố định.</div>`,
  ]]);

const c1 = doc('sal301-1-1-role', '1.1 — Overview of professional selling & the salesperson\'s role|||1.1 — Tổng quan bán hàng chuyên nghiệp & vai trò nhân viên bán hàng',
  'Bán hàng cá nhân là gì; tiến hóa từ bán hàng giao dịch sang tư vấn/quan hệ; các dạng công việc bán hàng; đạo đức trong bán hàng.',
  [[
    `<span class="eyebrow">SAL301 · Chapter 1 · Lesson 1.1</span>
<h2>Overview of professional selling &amp; the salesperson's role</h2>
<h3>What is personal selling?</h3>
<p><strong>Personal selling</strong> is direct, person-to-person communication with a prospect to identify a need and present a solution that satisfies it profitably for both sides. It is distinct from advertising or mass promotion: it is interactive, adapts in real time, and builds a relationship.</p>
<h3>Three eras of selling philosophy</h3>
<pre><code>Stimulus-response  -> memorize & deliver a fixed pitch, push until they buy
Formula selling     -> AIDA script, still one-way
Need-satisfaction    -> ask questions first, then propose a fit
Consultative/partner -> diagnose the business problem, co-create value,
                        stay involved after the sale (the modern standard)
</code></pre>
<h3>Roles a salesperson plays today</h3>
<ul>
<li><strong>Order taker</strong> — passively processes requests (the outdated stereotype).</li>
<li><strong>Problem solver</strong> — diagnoses the customer's situation before proposing anything.</li>
<li><strong>Trusted advisor / partner</strong> — the customer relies on their judgment beyond the sale itself.</li>
</ul>
<h3>Common sales job types</h3>
<ul>
<li><strong>Trade selling</strong> — supporting resellers (retailers, distributors).</li>
<li><strong>Missionary selling</strong> — building goodwill and educating, not closing directly (e.g. pharma reps visiting doctors).</li>
<li><strong>Technical selling</strong> — selling to experts, requires deep product knowledge (e.g. industrial equipment).</li>
<li><strong>New-business selling</strong> — hunting and converting new accounts.</li>
</ul>
<div class="callout"><span class="badge">Ethics matter</span> Professional selling is judged by whether the customer is genuinely better off after the sale — reputation and repeat business depend on it far more than any single deal.</div>`,
    `<span class="eyebrow">SAL301 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan bán hàng chuyên nghiệp &amp; vai trò nhân viên bán hàng</h2>
<h3>Bán hàng cá nhân là gì?</h3>
<p><strong>Bán hàng cá nhân (personal selling)</strong> là giao tiếp trực tiếp, người với người, với khách hàng tiềm năng để xác định nhu cầu và trình bày một giải pháp thỏa mãn nhu cầu đó, có lợi cho cả hai bên. Nó khác quảng cáo hay truyền thông đại chúng: mang tính tương tác, điều chỉnh theo thời gian thực, và xây dựng quan hệ.</p>
<h3>Ba giai đoạn của triết lý bán hàng</h3>
<pre><code>Kích thích-phản hồi -> học thuộc và trình bày bài chào cố định, đẩy tới khi mua
Bán hàng theo công thức -> kịch bản AIDA, vẫn một chiều
Thỏa mãn nhu cầu    -> hỏi trước, rồi mới đề xuất sự phù hợp
Tư vấn/đối tác       -> chẩn đoán vấn đề kinh doanh, cùng tạo giá trị,
                        vẫn đồng hành sau khi bán (chuẩn hiện đại)
</code></pre>
<h3>Các vai trò của nhân viên bán hàng ngày nay</h3>
<ul>
<li><strong>Người nhận đơn (order taker)</strong> — xử lý yêu cầu một cách bị động (hình mẫu đã lỗi thời).</li>
<li><strong>Người giải quyết vấn đề</strong> — chẩn đoán tình huống khách hàng trước khi đề xuất gì cả.</li>
<li><strong>Cố vấn/đối tác tin cậy</strong> — khách hàng dựa vào nhận định của họ vượt ra ngoài giao dịch.</li>
</ul>
<h3>Các dạng công việc bán hàng phổ biến</h3>
<ul>
<li><strong>Bán hàng thương mại (trade selling)</strong> — hỗ trợ nhà bán lại (bán lẻ, phân phối).</li>
<li><strong>Bán hàng truyền giáo (missionary)</strong> — xây thiện chí và giáo dục, không chốt trực tiếp (vd đại diện dược đến gặp bác sĩ).</li>
<li><strong>Bán hàng kỹ thuật</strong> — bán cho chuyên gia, cần hiểu sâu sản phẩm (vd thiết bị công nghiệp).</li>
<li><strong>Bán hàng khách hàng mới</strong> — săn và chuyển đổi khách hàng mới.</li>
</ul>
<div class="callout"><span class="badge">Đạo đức là then chốt</span> Bán hàng chuyên nghiệp được đánh giá bằng việc khách hàng có thực sự tốt hơn sau giao dịch — uy tín và việc mua lại phụ thuộc vào điều này nhiều hơn bất kỳ đơn hàng đơn lẻ nào.</div>`,
  ]]);

const c1q = quiz('sal301-quiz-1', 'Quiz 1 — Overview & role|||Quiz 1 — Tổng quan & vai trò', [
  { id: 'q1', question: 'Triết lý bán hàng hiện đại nhất, theo giáo trình, là gì?', options: ['Kích thích-phản hồi (stimulus-response)', 'Bán hàng theo công thức (formula selling)', 'Thỏa mãn nhu cầu đơn giản', 'Tư vấn/đối tác (consultative/partner)'], correctIndex: 3, explanation: 'Bán hàng tư vấn/đối tác chẩn đoán vấn đề, cùng tạo giá trị, đồng hành sau bán — chuẩn hiện đại.' },
  { id: 'q2', question: 'Nhân viên đại diện dược đến gặp bác sĩ để giáo dục, xây thiện chí, không chốt trực tiếp — đây là dạng bán hàng gì?', options: ['Trade selling', 'Missionary selling', 'Technical selling', 'New-business selling'], correctIndex: 1, explanation: 'Missionary selling: xây thiện chí, giáo dục, ảnh hưởng gián tiếp đến quyết định mua.' },
  { id: 'q3', question: 'Vì sao đạo đức được nhấn mạnh trong bán hàng chuyên nghiệp?', options: ['Vì luật bắt buộc mọi giao dịch', 'Vì uy tín & mua lại phụ thuộc vào việc khách hàng thực sự tốt hơn sau giao dịch', 'Vì nó giúp chốt sale nhanh hơn duy nhất một lần', 'Vì không liên quan tới kết quả kinh doanh'], correctIndex: 1, explanation: 'Quan hệ dài hạn và doanh thu lặp lại phụ thuộc vào lợi ích thật của khách hàng, không phải một đơn hàng đơn lẻ.' },
]);

const c2 = doc('sal301-2-1-buyer-behavior', '2.1 — Buyer behaviour & the psychology of buying|||2.1 — Hành vi khách hàng & tâm lý mua',
  'Quy trình mua của khách hàng, nhận thức & động cơ mua, tháp Maslow áp dụng vào bán hàng, các loại quyết định mua, bán hàng thích ứng (adaptive selling).',
  [[
    `<span class="eyebrow">SAL301 · Chapter 2 · Lesson 2.1</span>
<h2>Buyer behaviour &amp; the psychology of buying</h2>
<h3>The buyer's decision process</h3>
<pre><code>Need recognition -> Information search -> Evaluate alternatives
                  -> Purchase decision -> Post-purchase evaluation
</code></pre>
<p>A salesperson's questions and material should map to <em>where the buyer is</em> in this process — someone still recognizing a need needs different help than someone comparing final alternatives.</p>
<h3>What drives a purchase</h3>
<ul>
<li><strong>Perception</strong> — buyers act on how they interpret information, not on the "objective" facts alone; first impressions and framing matter.</li>
<li><strong>Needs (Maslow, applied to buying)</strong> — a purchase can serve safety (insurance), belonging (a brand community), esteem (status products), or self-actualization (education, self-improvement).</li>
<li><strong>Rational vs. emotional motives</strong> — B2B buyers justify with numbers (ROI, cost savings) but decisions are still shaped by emotion (risk, trust, reputation) — both must be addressed.</li>
</ul>
<h3>Types of buying decisions</h3>
<ul>
<li><strong>Routine</strong> — low involvement, repeat purchase, little thought (e.g. reordering office supplies).</li>
<li><strong>Limited</strong> — some comparison, moderate involvement (e.g. choosing a new software vendor with familiar criteria).</li>
<li><strong>Extensive</strong> — high stakes, many stakeholders, long evaluation (e.g. an ERP system).</li>
</ul>
<div class="callout"><span class="badge">Adaptive selling</span> Because buyers differ (personality, decision style, stage in the process), the professional salesperson adapts their approach call by call — one script does not fit every buyer.</div>`,
    `<span class="eyebrow">SAL301 · Chương 2 · Bài 2.1</span>
<h2>Hành vi khách hàng &amp; tâm lý mua</h2>
<h3>Quy trình quyết định của người mua</h3>
<pre><code>Nhận biết nhu cầu -> Tìm kiếm thông tin -> Đánh giá các lựa chọn
                   -> Quyết định mua -> Đánh giá sau khi mua
</code></pre>
<p>Câu hỏi và tài liệu của nhân viên bán hàng nên khớp với <em>vị trí của người mua</em> trong quy trình này — người vẫn đang nhận biết nhu cầu cần sự hỗ trợ khác với người đang so sánh các lựa chọn cuối cùng.</p>
<h3>Điều gì thúc đẩy một quyết định mua</h3>
<ul>
<li><strong>Nhận thức (perception)</strong> — người mua hành động theo cách họ diễn giải thông tin, không chỉ dựa trên sự thật "khách quan"; ấn tượng đầu và cách đóng khung thông tin rất quan trọng.</li>
<li><strong>Nhu cầu (Maslow, áp dụng vào mua hàng)</strong> — một giao dịch có thể phục vụ an toàn (bảo hiểm), thuộc về (cộng đồng thương hiệu), được tôn trọng (sản phẩm địa vị), hoặc tự hoàn thiện (giáo dục, phát triển bản thân).</li>
<li><strong>Động cơ lý tính vs. cảm xúc</strong> — người mua B2B biện minh bằng số liệu (ROI, tiết kiệm chi phí) nhưng quyết định vẫn bị định hình bởi cảm xúc (rủi ro, niềm tin, danh tiếng) — cần xử lý cả hai.</li>
</ul>
<h3>Các loại quyết định mua</h3>
<ul>
<li><strong>Thường lệ (routine)</strong> — mức tham gia thấp, mua lại, ít suy nghĩ (vd đặt lại văn phòng phẩm).</li>
<li><strong>Có giới hạn (limited)</strong> — có so sánh, mức tham gia trung bình (vd chọn nhà cung cấp phần mềm mới theo tiêu chí quen thuộc).</li>
<li><strong>Mở rộng (extensive)</strong> — rủi ro cao, nhiều người liên quan, đánh giá kéo dài (vd hệ thống ERP).</li>
</ul>
<div class="callout"><span class="badge">Bán hàng thích ứng</span> Vì người mua khác nhau (tính cách, cách ra quyết định, giai đoạn trong quy trình), nhân viên bán hàng chuyên nghiệp điều chỉnh cách tiếp cận theo từng cuộc gặp — không có một kịch bản phù hợp với mọi người mua.</div>`,
  ]]);

const c2q = quiz('sal301-quiz-2', 'Quiz 2 — Buyer behaviour|||Quiz 2 — Hành vi khách hàng', [
  { id: 'q1', question: 'Quy trình quyết định của người mua bắt đầu bằng bước nào?', options: ['Đánh giá sau khi mua', 'Nhận biết nhu cầu', 'Quyết định mua', 'Tìm kiếm thông tin'], correctIndex: 1, explanation: 'Quy trình bắt đầu khi người mua nhận ra một nhu cầu, rồi mới tìm thông tin, đánh giá, quyết định, đánh giá sau mua.' },
  { id: 'q2', question: 'Mua ERP cho doanh nghiệp, nhiều bên liên quan, đánh giá kéo dài — thuộc loại quyết định mua nào?', options: ['Routine', 'Limited', 'Extensive', 'Không thuộc loại nào'], correctIndex: 2, explanation: 'Rủi ro cao, nhiều stakeholder, thời gian đánh giá dài là đặc điểm của quyết định mua mở rộng (extensive).' },
  { id: 'q3', question: 'Vì sao người mua B2B vẫn cần được thuyết phục bằng cảm xúc, dù họ biện minh bằng số liệu?', options: ['Vì số liệu luôn sai', 'Vì quyết định vẫn bị định hình bởi rủi ro, niềm tin, danh tiếng bên cạnh lý tính', 'Vì cảm xúc quan trọng hơn ROI trong mọi trường hợp', 'Vì B2B không dùng số liệu'], correctIndex: 1, explanation: 'Động cơ lý tính (ROI) và cảm xúc (rủi ro, niềm tin) cùng tồn tại và cả hai cần được xử lý.' },
]);

const c3 = doc('sal301-3-1-prospecting', '3.1 — Prospecting & qualifying leads|||3.1 — Tìm kiếm & đánh giá khách hàng tiềm năng',
  'Các phương pháp tìm khách hàng tiềm năng (referral, cold calling, networking, hội chợ, social selling); đánh giá (qualify) bằng MAN/BANT; phễu bán hàng (sales funnel).',
  [[
    `<span class="eyebrow">SAL301 · Chapter 3 · Lesson 3.1</span>
<h2>Prospecting &amp; qualifying leads</h2>
<h3>Where prospects come from</h3>
<ul>
<li><strong>Referrals</strong> — introductions from satisfied customers; typically the highest close rate.</li>
<li><strong>Cold calling / cold outreach</strong> — contacting strangers with no prior relationship; low hit rate but scalable.</li>
<li><strong>Networking</strong> — professional events, alumni, industry associations.</li>
<li><strong>Trade shows &amp; exhibitions</strong> — prospects who are already interested enough to attend.</li>
<li><strong>Social selling</strong> — building visibility and relationships on platforms like LinkedIn before ever pitching.</li>
</ul>
<h3>Qualifying: not every lead deserves a full sales cycle</h3>
<pre><code>MAN / BANT framework:
  Money      (Budget)     -> can they actually pay for this?
  Authority               -> are we talking to the decision-maker?
  Need                    -> do they have a real, felt problem we solve?
  Timing                  -> is there a reason to decide now, not later?
</code></pre>
<p>A prospect that fails on Authority is not disqualified — it may simply mean the salesperson needs to find and reach the real decision-maker.</p>
<h3>The sales funnel / pipeline</h3>
<p>Prospects move through stages — <strong>suspect → prospect → qualified lead → opportunity → customer</strong> — and naturally narrow at each stage. Tracking conversion rate between stages tells a salesperson (and manager) exactly where the process is leaking.</p>
<div class="callout"><span class="badge">Quality over quantity</span> Chasing every lead equally wastes the scarcest resource in selling — time. Qualifying early protects it for prospects who can actually buy.</div>`,
    `<span class="eyebrow">SAL301 · Chương 3 · Bài 3.1</span>
<h2>Tìm kiếm &amp; đánh giá khách hàng tiềm năng</h2>
<h3>Khách hàng tiềm năng đến từ đâu</h3>
<ul>
<li><strong>Giới thiệu (referral)</strong> — được khách hàng hài lòng giới thiệu; thường có tỉ lệ chốt cao nhất.</li>
<li><strong>Cold calling / tiếp cận lạnh</strong> — liên hệ người lạ chưa có quan hệ trước; tỉ lệ thành công thấp nhưng dễ mở rộng quy mô.</li>
<li><strong>Networking</strong> — sự kiện nghề nghiệp, cựu sinh viên, hiệp hội ngành.</li>
<li><strong>Hội chợ &amp; triển lãm</strong> — khách hàng đã đủ quan tâm để tham dự.</li>
<li><strong>Social selling</strong> — xây độ hiện diện và quan hệ trên nền tảng như LinkedIn trước khi chào hàng.</li>
</ul>
<h3>Đánh giá (qualify): không phải mọi lead đều đáng một vòng bán hàng đầy đủ</h3>
<pre><code>Khung MAN / BANT:
  Money (Tiền)     -> họ có thực sự trả được cho việc này không?
  Authority (Quyền)   -> có đang nói với người ra quyết định không?
  Need (Nhu cầu)      -> họ có một vấn đề thật, cảm nhận được, mà ta giải quyết?
  Timing (Thời điểm)  -> có lý do để quyết định NGAY, không phải để sau?
</code></pre>
<p>Một khách hàng tiềm năng không đạt yếu tố Authority không bị loại — có thể chỉ cần tìm và tiếp cận đúng người ra quyết định.</p>
<h3>Phễu bán hàng (sales funnel/pipeline)</h3>
<p>Khách hàng tiềm năng đi qua các giai đoạn — <strong>nghi vấn → tiềm năng → lead đủ điều kiện → cơ hội → khách hàng</strong> — và tự nhiên hẹp lại ở mỗi bước. Theo dõi tỉ lệ chuyển đổi giữa các giai đoạn cho nhân viên (và quản lý) biết chính xác quy trình đang rò rỉ ở đâu.</p>
<div class="callout"><span class="badge">Chất lượng hơn số lượng</span> Đuổi theo mọi lead như nhau lãng phí nguồn lực hiếm nhất trong bán hàng — thời gian. Đánh giá sớm giúp bảo toàn nó cho những khách hàng thực sự có thể mua.</div>`,
  ]]);

const c3q = quiz('sal301-quiz-3', 'Quiz 3 — Prospecting|||Quiz 3 — Tìm kiếm khách hàng', [
  { id: 'q1', question: 'Nguồn khách hàng tiềm năng nào thường có tỉ lệ chốt cao nhất?', options: ['Cold calling', 'Referral (giới thiệu)', 'Quảng cáo đại chúng', 'Danh bạ điện thoại ngẫu nhiên'], correctIndex: 1, explanation: 'Giới thiệu từ khách hàng hài lòng thường có tỉ lệ chốt cao nhất vì đã có sẵn niềm tin.' },
  { id: 'q2', question: 'Trong khung BANT, yếu tố "Authority" kiểm tra điều gì?', options: ['Khách hàng có đủ tiền không', 'Đang nói chuyện với đúng người ra quyết định không', 'Có nhu cầu thật không', 'Có cần quyết định ngay không'], correctIndex: 1, explanation: 'Authority xác minh người đang trao đổi có quyền ra quyết định mua hay không.' },
  { id: 'q3', question: 'Vì sao cần đánh giá (qualify) lead trước khi theo đuổi toàn bộ vòng bán hàng?', options: ['Vì luật yêu cầu', 'Vì thời gian là nguồn lực hiếm, cần dành cho lead thực sự có thể mua', 'Vì mọi lead đều giống nhau', 'Vì qualify làm tăng số lead'], correctIndex: 1, explanation: 'Đuổi theo mọi lead như nhau lãng phí thời gian; qualify sớm giúp tập trung vào lead khả thi.' },
]);

const c4 = doc('sal301-4-1-approach-spin', '4.1 — Approach & need discovery: SPIN & consultative questioning|||4.1 — Tiếp cận & khám phá nhu cầu: SPIN & câu hỏi tư vấn',
  'Pre-approach (nghiên cứu trước), phương pháp tiếp cận, mô hình câu hỏi SPIN của Rackham (Situation-Problem-Implication-Need-payoff), lắng nghe tích cực.',
  [[
    `<span class="eyebrow">SAL301 · Chapter 4 · Lesson 4.1</span>
<h2>Approach &amp; need discovery: SPIN &amp; consultative questioning</h2>
<h3>Pre-approach: do the homework first</h3>
<p>Before any contact, research the prospect's business, role, and likely pain points (company site, LinkedIn, industry news). A well-prepared opening question signals competence and earns attention immediately.</p>
<h3>The approach</h3>
<p>The first minutes set the tone. A strong approach states a clear, relevant reason for the meeting and shifts quickly from small talk into the prospect's world — not the salesperson's product.</p>
<h3>SPIN: Rackham's four question types</h3>
<pre><code>Situation      -> fact-finding: "How do you currently handle X?"
Problem        -> surface a difficulty: "What issues does that cause?"
Implication    -> widen the cost: "How does that affect [other area]?"
Need-payoff    -> let them state the value: "How would solving that help?"
</code></pre>
<p>Rackham's research on large sales found that top performers ask far more Problem and Implication questions than average sellers — they help the buyer <em>feel</em> the size of the problem before any solution is proposed. Need-payoff questions are powerful because the customer, not the seller, states the benefit.</p>
<h3>Active listening</h3>
<ul>
<li>Paraphrase what was heard before responding — confirms understanding and shows respect.</li>
<li>Resist the urge to pitch too early; SPIN only works if discovery happens fully first.</li>
</ul>
<div class="callout"><span class="badge">Discovery before solution</span> A solution proposed before the problem is fully understood is a guess, not a diagnosis — and buyers can tell the difference.</div>`,
    `<span class="eyebrow">SAL301 · Chương 4 · Bài 4.1</span>
<h2>Tiếp cận &amp; khám phá nhu cầu: SPIN &amp; câu hỏi tư vấn</h2>
<h3>Pre-approach: chuẩn bị trước khi tiếp cận</h3>
<p>Trước bất kỳ liên hệ nào, hãy tìm hiểu doanh nghiệp, vai trò và những khó khăn khả năng gặp của khách hàng (trang công ty, LinkedIn, tin ngành). Một câu hỏi mở đầu được chuẩn bị kỹ thể hiện năng lực và thu hút chú ý ngay lập tức.</p>
<h3>Tiếp cận (the approach)</h3>
<p>Vài phút đầu định hình toàn bộ cuộc gặp. Một cách tiếp cận tốt nêu rõ lý do liên quan của buổi gặp và nhanh chóng chuyển từ chuyện xã giao sang thế giới của khách hàng — không phải sản phẩm của người bán.</p>
<h3>SPIN: bốn loại câu hỏi của Rackham</h3>
<pre><code>Situation (Tình huống) -> tìm sự thật: "Hiện anh/chị xử lý X thế nào?"
Problem (Vấn đề)       -> làm rõ khó khăn: "Điều đó gây ra vấn đề gì?"
Implication (Hệ quả)   -> mở rộng cái giá: "Nó ảnh hưởng thế nào tới [lĩnh vực khác]?"
Need-payoff (Lợi ích)  -> để khách hàng tự nêu giá trị: "Giải quyết được thì giúp gì?"
</code></pre>
<p>Nghiên cứu của Rackham trên các giao dịch lớn cho thấy người bán hàng xuất sắc đặt nhiều câu hỏi Problem và Implication hơn hẳn người bán trung bình — giúp khách hàng <em>cảm nhận</em> được độ lớn của vấn đề trước khi có bất kỳ giải pháp nào được đề xuất. Câu hỏi Need-payoff mạnh vì chính khách hàng, không phải người bán, nêu ra lợi ích.</p>
<h3>Lắng nghe tích cực</h3>
<ul>
<li>Diễn giải lại điều đã nghe trước khi phản hồi — xác nhận hiểu đúng và thể hiện sự tôn trọng.</li>
<li>Kiềm chế mong muốn chào hàng quá sớm; SPIN chỉ hiệu quả khi khám phá được thực hiện đầy đủ trước.</li>
</ul>
<div class="callout"><span class="badge">Khám phá trước giải pháp</span> Một giải pháp được đề xuất trước khi hiểu đầy đủ vấn đề chỉ là đoán, không phải chẩn đoán — và khách hàng nhận ra được sự khác biệt đó.</div>`,
  ]]);

const c4q = quiz('sal301-quiz-4', 'Quiz 4 — Approach & SPIN|||Quiz 4 — Tiếp cận & SPIN', [
  { id: 'q1', question: 'Trong mô hình SPIN, câu hỏi nào giúp khách hàng TỰ nêu ra giá trị của việc giải quyết vấn đề?', options: ['Situation', 'Problem', 'Implication', 'Need-payoff'], correctIndex: 3, explanation: 'Need-payoff hỏi khách hàng lợi ích sẽ là gì nếu vấn đề được giải quyết, để chính họ nêu ra giá trị.' },
  { id: 'q2', question: 'Vì sao người bán hàng xuất sắc đặt nhiều câu hỏi Problem và Implication hơn người bán trung bình (theo nghiên cứu của Rackham)?', options: ['Vì khách hàng thích bị hỏi nhiều', 'Vì giúp khách hàng cảm nhận độ lớn của vấn đề trước khi có giải pháp', 'Vì tiết kiệm thời gian gặp', 'Vì không cần Situation'], correctIndex: 1, explanation: 'Mở rộng nhận thức về vấn đề (Problem, Implication) khiến giải pháp sau đó có giá trị rõ ràng hơn.' },
  { id: 'q3', question: 'Pre-approach (chuẩn bị trước khi tiếp cận) chủ yếu nhằm mục đích gì?', options: ['Ghi nhớ bài chào hàng cố định', 'Nghiên cứu doanh nghiệp/vai trò/khó khăn khả năng để mở đầu bằng câu hỏi phù hợp', 'Đặt giá trước khi gặp khách', 'Bỏ qua bước tìm hiểu khách hàng'], correctIndex: 1, explanation: 'Pre-approach là nghiên cứu trước để có câu hỏi mở đầu thể hiện năng lực và liên quan tới khách hàng.' },
]);

const c5 = doc('sal301-5-1-presentation', '5.1 — Presentation & solution demonstration|||5.1 — Trình bày & demo giải pháp',
  'Các kiểu trình bày bán hàng, mô hình FABE (Feature-Advantage-Benefit-Evidence), nguyên tắc trình diễn/demo, đề xuất (proposal).',
  [[
    `<span class="eyebrow">SAL301 · Chapter 5 · Lesson 5.1</span>
<h2>Presentation &amp; solution demonstration</h2>
<h3>From script to tailored solution</h3>
<p>A presentation built on discovery (chapter 4) is <em>tailored</em>: it addresses the specific problems and implications the buyer already agreed matter, in their own words where possible — not a generic feature list.</p>
<h3>FABE: turning features into reasons to buy</h3>
<pre><code>Feature   -> what it IS   (e.g. "24/7 automated monitoring")
Advantage -> what it DOES (e.g. "detects issues within minutes")
Benefit   -> what that MEANS for THIS buyer
             (e.g. "your team avoids the 3-hour outages you described")
Evidence  -> proof         (case study, data, demo, reference customer)
</code></pre>
<p>Buyers act on <strong>benefits</strong>, but benefits without evidence are just claims — always close the loop with proof.</p>
<h3>Demonstrating &amp; presenting well</h3>
<ul>
<li><strong>Show, don't just tell</strong> — a live demo or trial resolves doubts words cannot.</li>
<li><strong>Involve the buyer</strong> — let them operate the demo themselves when possible; participation builds ownership.</li>
<li><strong>Use visual aids sparingly and relevantly</strong> — a slide or one-page proposal should support the conversation, not replace it.</li>
</ul>
<div class="callout"><span class="badge">One proposal, one problem</span> A written proposal should mirror the exact problem discovered earlier — a buyer who sees their own words reflected back trusts the solution more.</div>`,
    `<span class="eyebrow">SAL301 · Chương 5 · Bài 5.1</span>
<h2>Trình bày &amp; demo giải pháp</h2>
<h3>Từ kịch bản đến giải pháp được đo ni</h3>
<p>Một bài trình bày dựa trên khám phá (chương 4) được <em>đo ni đóng giày</em>: nó giải quyết đúng những vấn đề và hệ quả mà khách hàng đã đồng ý là quan trọng, dùng chính lời của họ khi có thể — không phải một danh sách tính năng chung chung.</p>
<h3>FABE: biến tính năng thành lý do để mua</h3>
<pre><code>Feature (Tính năng)   -> nó LÀ gì (vd "giám sát tự động 24/7")
Advantage (Ưu điểm)   -> nó LÀM được gì (vd "phát hiện sự cố trong vài phút")
Benefit (Lợi ích)     -> điều đó CÓ Ý NGHĨA gì với khách hàng NÀY
                          (vd "đội của bạn tránh được sự cố 3 giờ đã kể")
Evidence (Bằng chứng) -> chứng minh  (case study, dữ liệu, demo, khách hàng tham chiếu)
</code></pre>
<p>Khách hàng hành động theo <strong>lợi ích (benefit)</strong>, nhưng lợi ích không có bằng chứng chỉ là lời tuyên bố — luôn khép lại bằng bằng chứng.</p>
<h3>Demo &amp; trình bày tốt</h3>
<ul>
<li><strong>Cho xem, không chỉ nói</strong> — một demo trực tiếp hoặc bản thử giải quyết những nghi ngờ mà lời nói không làm được.</li>
<li><strong>Cho khách hàng tham gia</strong> — để họ tự vận hành demo khi có thể; sự tham gia tạo cảm giác sở hữu.</li>
<li><strong>Dùng công cụ trực quan có chọn lọc và liên quan</strong> — một slide hay đề xuất một trang nên hỗ trợ cuộc trò chuyện, không thay thế nó.</li>
</ul>
<div class="callout"><span class="badge">Một đề xuất, một vấn đề</span> Đề xuất viết ra nên phản chiếu đúng vấn đề đã khám phá trước đó — khách hàng thấy lời của chính mình được phản chiếu lại sẽ tin tưởng giải pháp hơn.</div>`,
  ]]);

const c5q = quiz('sal301-quiz-5', 'Quiz 5 — Presentation & FABE|||Quiz 5 — Trình bày & FABE', [
  { id: 'q1', question: 'Trong mô hình FABE, "Benefit" (lợi ích) là gì?', options: ['Đặc điểm sản phẩm nói chung', 'Điều tính năng đó LÀM được', 'Ý nghĩa cụ thể của tính năng đó với khách hàng cụ thể này', 'Bằng chứng/case study'], correctIndex: 2, explanation: 'Benefit là ý nghĩa cụ thể của tính năng/ưu điểm đối với đúng khách hàng đang trình bày, khác Feature (là gì) và Advantage (làm gì).' },
  { id: 'q2', question: 'Vì sao "Evidence" (bằng chứng) là bước không thể thiếu sau khi nêu Benefit?', options: ['Vì Benefit không có bằng chứng chỉ là lời tuyên bố', 'Vì khách hàng không quan tâm bằng chứng', 'Vì Evidence thay thế được Feature', 'Vì bằng chứng chỉ cần khi khách hàng yêu cầu'], correctIndex: 0, explanation: 'Không có bằng chứng, lợi ích được nêu ra chỉ là tuyên bố, chưa được chứng minh — cần case study/dữ liệu/demo.' },
  { id: 'q3', question: 'Vì sao nên để khách hàng tự vận hành demo khi có thể?', options: ['Để nhân viên bán hàng đỡ phải nói', 'Vì sự tham gia trực tiếp tạo cảm giác sở hữu và củng cố niềm tin', 'Vì quy định yêu cầu', 'Vì demo tự động luôn tốt hơn'], correctIndex: 1, explanation: 'Cho khách hàng tự trải nghiệm giúp họ tin và gắn bó với giải pháp hơn là chỉ nghe kể.' },
]);

const c6 = doc('sal301-6-1-objections-closing', '6.1 — Handling objections & closing the sale|||6.1 — Xử lý phản đối & chốt sale',
  'Các loại phản đối thường gặp (giá, nhu cầu, nguồn, thời gian, sản phẩm), kỹ thuật xử lý (LAARC), tín hiệu mua & kỹ thuật chốt sale.',
  [[
    `<span class="eyebrow">SAL301 · Chapter 6 · Lesson 6.1</span>
<h2>Handling objections &amp; closing the sale</h2>
<h3>Objections are normal, not a rejection</h3>
<p>An objection is often a request for more information or reassurance, not a final "no." Common categories:</p>
<ul>
<li><strong>Price</strong> — "too expensive."</li>
<li><strong>Need</strong> — "we don't need this right now."</li>
<li><strong>Source</strong> — trust issues with the company or salesperson.</li>
<li><strong>Time</strong> — "not the right moment."</li>
<li><strong>Product</strong> — doubts about fit or quality.</li>
</ul>
<h3>A structured way to handle objections: LAARC</h3>
<pre><code>Listen      -> let them finish, do not interrupt or argue
Acknowledge -> show the concern was heard and is valid
Assess      -> ask a question to understand the real issue behind it
Respond     -> address it with evidence, not pressure
Confirm     -> check the objection is actually resolved before moving on
</code></pre>
<h3>Recognizing buying signals</h3>
<p>Verbal ("How soon could we start?") and non-verbal (leaning in, re-reading the proposal) signals both indicate readiness — this is the moment to attempt a close, not to keep pitching.</p>
<h3>Closing techniques</h3>
<ul>
<li><strong>Trial close</strong> — a low-pressure check throughout the conversation ("Does this address the issue you mentioned?").</li>
<li><strong>Alternative-choice close</strong> — offers two acceptable options ("Would Monday or Wednesday work for delivery?"), assuming the decision to buy is already made.</li>
<li><strong>Assumptive close</strong> — proceeds as if the customer has decided, moving to next steps.</li>
</ul>
<div class="callout"><span class="badge">Ask, don't push</span> A close is a question that invites a decision — pressure without addressing the real objection first usually backfires.</div>`,
    `<span class="eyebrow">SAL301 · Chương 6 · Bài 6.1</span>
<h2>Xử lý phản đối &amp; chốt sale</h2>
<h3>Phản đối là bình thường, không phải bị từ chối</h3>
<p>Một phản đối thường là yêu cầu thêm thông tin hoặc sự yên tâm, không phải một lời "không" cuối cùng. Các nhóm phổ biến:</p>
<ul>
<li><strong>Giá</strong> — "quá đắt."</li>
<li><strong>Nhu cầu</strong> — "hiện chưa cần."</li>
<li><strong>Nguồn</strong> — nghi ngờ về công ty hoặc nhân viên bán hàng.</li>
<li><strong>Thời gian</strong> — "chưa đúng lúc."</li>
<li><strong>Sản phẩm</strong> — nghi ngờ về sự phù hợp hoặc chất lượng.</li>
</ul>
<h3>Cách xử lý phản đối có cấu trúc: LAARC</h3>
<pre><code>Listen (Lắng nghe)     -> để họ nói hết, không cắt lời hay tranh luận
Acknowledge (Xác nhận) -> cho thấy đã nghe và mối lo là hợp lý
Assess (Đánh giá)      -> hỏi để hiểu vấn đề thật sự đằng sau
Respond (Phản hồi)     -> giải quyết bằng bằng chứng, không phải áp lực
Confirm (Xác nhận lại) -> kiểm tra phản đối thật sự đã được giải quyết trước khi tiếp tục
</code></pre>
<h3>Nhận diện tín hiệu mua</h3>
<p>Tín hiệu bằng lời ("Bao lâu thì có thể bắt đầu?") và không lời (nghiêng người tới, đọc lại đề xuất) đều cho thấy sự sẵn sàng — đây là lúc để thử chốt, không phải tiếp tục chào hàng.</p>
<h3>Các kỹ thuật chốt sale</h3>
<ul>
<li><strong>Chốt thử (trial close)</strong> — kiểm tra nhẹ nhàng xuyên suốt cuộc trò chuyện ("Điều này có giải quyết vấn đề bạn vừa nêu không?").</li>
<li><strong>Chốt lựa chọn thay thế</strong> — đưa ra hai lựa chọn đều được ("Giao thứ Hai hay thứ Tư thì tiện hơn?"), giả định quyết định mua đã được đưa ra.</li>
<li><strong>Chốt giả định (assumptive)</strong> — tiến hành như thể khách hàng đã quyết định, chuyển sang bước tiếp theo.</li>
</ul>
<div class="callout"><span class="badge">Hỏi, không đẩy</span> Một cú chốt là một câu hỏi mời quyết định — tạo áp lực mà chưa giải quyết phản đối thật thường phản tác dụng.</div>`,
  ]]);

const c6q = quiz('sal301-quiz-6', 'Quiz 6 — Objections & closing|||Quiz 6 — Phản đối & chốt sale', [
  { id: 'q1', question: 'Trong khung LAARC, bước "Assess" nhằm làm gì?', options: ['Cắt lời khách hàng ngay', 'Hỏi thêm để hiểu vấn đề thật sự đằng sau phản đối', 'Chốt sale ngay lập tức', 'Bỏ qua phản đối'], correctIndex: 1, explanation: 'Assess là bước đặt câu hỏi để hiểu rõ gốc rễ của mối lo, trước khi phản hồi.' },
  { id: 'q2', question: 'Kỹ thuật chốt đưa ra hai lựa chọn đều được, giả định khách hàng đã quyết định mua, gọi là gì?', options: ['Trial close', 'Alternative-choice close', 'Assumptive close', 'Hard close'], correctIndex: 1, explanation: 'Chốt lựa chọn thay thế cho khách chọn giữa hai phương án được, không hỏi có mua hay không.' },
  { id: 'q3', question: 'Vì sao nên xem phản đối của khách hàng là bình thường, không phải bị từ chối?', options: ['Vì phản đối luôn vô lý', 'Vì phản đối thường là yêu cầu thêm thông tin/sự yên tâm, không phải "không" cuối cùng', 'Vì khách hàng luôn phản đối để trả giá', 'Vì không cần lắng nghe phản đối'], correctIndex: 1, explanation: 'Phản đối thường phản ánh một mối lo cụ thể cần được xử lý, chứ không phải sự từ chối dứt điểm.' },
]);

const c7 = doc('sal301-7-1-after-sale-crm', '7.1 — After-sale service & building long-term relationships (CRM)|||7.1 — Chăm sóc sau bán & xây dựng quan hệ dài hạn (CRM)',
  'Follow-up sau bán, cross-sell/up-sell, khái niệm CRM & công cụ, giá trị trọn đời khách hàng (CLV), giữ chân khách hàng.',
  [[
    `<span class="eyebrow">SAL301 · Chapter 7 · Lesson 7.1</span>
<h2>After-sale service &amp; building long-term relationships (CRM)</h2>
<h3>The sale is a beginning, not an end</h3>
<p>Futrell's <em>ABC's of Relationship Selling</em> centers on this: a professional salesperson's reputation and future revenue depend far more on what happens <em>after</em> the signature than on the pitch itself.</p>
<h3>Follow-up &amp; service</h3>
<ul>
<li><strong>Onboarding / implementation support</strong> — make sure the customer actually gets the value promised.</li>
<li><strong>Proactive check-ins</strong> — catching a small problem early prevents it from becoming a reason to churn.</li>
<li><strong>Handling complaints well</strong> — a well-resolved complaint often builds more loyalty than no complaint at all.</li>
</ul>
<h3>Growing the account: cross-sell &amp; up-sell</h3>
<pre><code>Cross-sell -> offer a related product that fits a need the customer
              already has (e.g. add insurance to a loan)
Up-sell    -> offer a higher tier of the same solution as the customer's
              needs grow
</code></pre>
<h3>CRM: managing the relationship systematically</h3>
<p><strong>Customer Relationship Management (CRM)</strong> tools record every interaction, purchase, and preference so the relationship survives staff turnover and scales beyond memory. This is also where <strong>Customer Lifetime Value (CLV)</strong> is tracked — the total profit a customer generates over the whole relationship, not just the first sale.</p>
<div class="callout"><span class="badge">Retention is cheaper than acquisition</span> Keeping an existing customer costs far less than winning a new one — after-sale service is not a cost center, it is where much of a salesperson's future revenue actually comes from.</div>`,
    `<span class="eyebrow">SAL301 · Chương 7 · Bài 7.1</span>
<h2>Chăm sóc sau bán &amp; xây dựng quan hệ dài hạn (CRM)</h2>
<h3>Bán hàng là khởi đầu, không phải kết thúc</h3>
<p><em>ABC's of Relationship Selling</em> của Futrell xoay quanh ý này: uy tín và doanh thu tương lai của một nhân viên bán hàng chuyên nghiệp phụ thuộc vào những gì xảy ra <em>sau</em> khi ký hợp đồng nhiều hơn là chính bài chào hàng.</p>
<h3>Follow-up &amp; dịch vụ</h3>
<ul>
<li><strong>Hỗ trợ triển khai/onboarding</strong> — đảm bảo khách hàng thực sự nhận được giá trị đã hứa.</li>
<li><strong>Chủ động thăm hỏi</strong> — bắt được vấn đề nhỏ sớm giúp nó không trở thành lý do rời bỏ.</li>
<li><strong>Xử lý khiếu nại tốt</strong> — một khiếu nại được giải quyết tốt thường xây dựng lòng trung thành hơn cả việc không có khiếu nại nào.</li>
</ul>
<h3>Phát triển tài khoản: cross-sell &amp; up-sell</h3>
<pre><code>Cross-sell (Bán chéo) -> đề xuất sản phẩm liên quan phù hợp với nhu cầu
                          khách hàng đã có (vd thêm bảo hiểm vào khoản vay)
Up-sell (Bán nâng cấp) -> đề xuất gói cao hơn của cùng giải pháp khi nhu
                          cầu khách hàng tăng lên
</code></pre>
<h3>CRM: quản lý quan hệ một cách có hệ thống</h3>
<p>Công cụ <strong>Quản trị Quan hệ Khách hàng (CRM)</strong> ghi lại mọi tương tác, giao dịch và sở thích để quan hệ tồn tại được qua thay đổi nhân sự và mở rộng vượt khả năng nhớ của một người. Đây cũng là nơi theo dõi <strong>Giá trị Trọn đời Khách hàng (CLV)</strong> — tổng lợi nhuận một khách hàng tạo ra suốt cả quan hệ, không chỉ đơn hàng đầu tiên.</p>
<div class="callout"><span class="badge">Giữ chân rẻ hơn tìm mới</span> Giữ một khách hàng hiện tại tốn ít hơn nhiều so với có được một khách hàng mới — chăm sóc sau bán không phải chi phí, mà là nơi phần lớn doanh thu tương lai của nhân viên bán hàng thực sự đến từ.</div>`,
  ]]);

const c7q = quiz('sal301-quiz-7', 'Quiz 7 — After-sale & CRM|||Quiz 7 — Chăm sóc sau bán & CRM', [
  { id: 'q1', question: 'Đề xuất bảo hiểm khi khách hàng vừa vay ngân hàng — đây là ví dụ của kỹ thuật nào?', options: ['Up-sell', 'Cross-sell', 'Closing', 'Prospecting'], correctIndex: 1, explanation: 'Cross-sell là đề xuất sản phẩm liên quan phù hợp nhu cầu đã có, như thêm bảo hiểm vào khoản vay.' },
  { id: 'q2', question: 'CLV (Customer Lifetime Value) đo lường điều gì?', options: ['Giá của đơn hàng đầu tiên', 'Tổng lợi nhuận một khách hàng tạo ra suốt cả quan hệ', 'Số lượng khiếu nại của khách hàng', 'Thời gian chốt một đơn hàng'], correctIndex: 1, explanation: 'CLV nhìn vào toàn bộ giá trị một khách hàng mang lại qua thời gian, không chỉ giao dịch đầu.' },
  { id: 'q3', question: 'Vì sao chăm sóc sau bán được xem là nơi tạo doanh thu tương lai, không phải chi phí?', options: ['Vì giữ khách hàng hiện tại rẻ hơn tìm khách mới và tạo cơ hội cross-sell/up-sell', 'Vì sau bán không ảnh hưởng tới doanh thu', 'Vì khách hàng cũ luôn phải trả giá cao hơn', 'Vì CRM chỉ dùng để lưu trữ, không tạo giá trị'], correctIndex: 0, explanation: 'Retention rẻ hơn acquisition, và quan hệ được duy trì tốt mở ra cross-sell/up-sell — đó là doanh thu tương lai.' },
]);

const c8 = doc('sal301-8-1-sales-management-basics', '8.1 — Sales management basics: territory, quota, performance|||8.1 — Quản trị bán hàng cơ bản: lãnh thổ, chỉ tiêu, đo lường hiệu suất',
  'Cơ cấu tổ chức bán hàng, thiết kế lãnh thổ, đặt chỉ tiêu (quota), các chỉ số đo hiệu suất (KPI), cơ bản về chế độ lương/hoa hồng.',
  [[
    `<span class="eyebrow">SAL301 · Chapter 8 · Lesson 8.1</span>
<h2>Sales management basics: territory, quota, performance</h2>
<p class="lead">This closing chapter looks at personal selling from the manager's chair — how the individual skills from chapters 1–7 are organized, measured and rewarded across a whole sales force. (A full treatment lives in the companion course <strong>SMG301 — Sales Management</strong>.)</p>
<h3>Territory design</h3>
<p>A <strong>sales territory</strong> is a group of customers/prospects assigned to one salesperson, usually built around geography, industry, or account size. Good territory design balances <strong>workload</strong> (enough accounts to be productive) with <strong>opportunity</strong> (enough potential to be worth covering) — territories that are too large are under-served; territories that are too small waste talent.</p>
<h3>Setting quotas</h3>
<pre><code>Common quota types:
  Sales-volume quota   -> a revenue or unit target
  Activity quota       -> calls, demos, proposals per period
  Combination quota    -> volume + activity together
</code></pre>
<p>A quota should be <strong>realistic but stretching</strong> — set too low, it fails to drive effort; set too high, it demoralizes and can push unethical shortcuts.</p>
<h3>Measuring performance</h3>
<ul>
<li><strong>Win rate</strong> — opportunities won ÷ opportunities pursued.</li>
<li><strong>Sales cycle length</strong> — time from first contact to close; shorter is usually more efficient, if quality holds.</li>
<li><strong>Quota attainment</strong> — actual result ÷ quota, the most direct performance check.</li>
</ul>
<h3>Compensation, briefly</h3>
<p>Most sales roles mix a <strong>base salary</strong> (stability) with <strong>commission</strong> (incentive tied directly to results) — the exact mix signals how much the company wants to reward pure output versus retain and develop talent.</p>
<div class="callout"><span class="badge">Management sets the stage, selling still wins the deal</span> Territory, quota and metrics decide where effort is pointed and how it is judged — but every deal still comes down to the personal selling skills built in chapters 1–7.</div>`,
    `<span class="eyebrow">SAL301 · Chương 8 · Bài 8.1</span>
<h2>Quản trị bán hàng cơ bản: lãnh thổ, chỉ tiêu, đo lường hiệu suất</h2>
<p class="lead">Chương kết này nhìn bán hàng cá nhân từ góc độ người quản lý — cách các kỹ năng cá nhân ở chương 1–7 được tổ chức, đo lường và khen thưởng trên cả một đội ngũ bán hàng. (Phần đầy đủ nằm ở môn song hành <strong>SMG301 — Sales Management</strong>.)</p>
<h3>Thiết kế lãnh thổ (territory)</h3>
<p>Một <strong>lãnh thổ bán hàng</strong> là nhóm khách hàng/khách hàng tiềm năng được giao cho một nhân viên, thường dựng theo địa lý, ngành, hoặc quy mô tài khoản. Thiết kế lãnh thổ tốt cân bằng giữa <strong>khối lượng công việc</strong> (đủ tài khoản để làm việc hiệu quả) và <strong>tiềm năng</strong> (đủ cơ hội để đáng phụ trách) — lãnh thổ quá lớn thì phục vụ không tới, lãnh thổ quá nhỏ thì lãng phí năng lực.</p>
<h3>Đặt chỉ tiêu (quota)</h3>
<pre><code>Các loại chỉ tiêu phổ biến:
  Chỉ tiêu doanh số     -> mục tiêu doanh thu hoặc số lượng
  Chỉ tiêu hoạt động    -> số cuộc gọi, demo, đề xuất mỗi kỳ
  Chỉ tiêu kết hợp       -> doanh số + hoạt động cùng lúc
</code></pre>
<p>Một chỉ tiêu nên <strong>thực tế nhưng có thử thách</strong> — đặt quá thấp thì không tạo động lực; đặt quá cao thì gây nản và có thể đẩy tới lối tắt phi đạo đức.</p>
<h3>Đo lường hiệu suất</h3>
<ul>
<li><strong>Tỉ lệ thắng (win rate)</strong> — số cơ hội thắng ÷ số cơ hội theo đuổi.</li>
<li><strong>Độ dài chu kỳ bán hàng</strong> — thời gian từ tiếp xúc đầu tới chốt; ngắn hơn thường hiệu quả hơn, nếu chất lượng vẫn giữ.</li>
<li><strong>Mức đạt chỉ tiêu</strong> — kết quả thực tế ÷ chỉ tiêu, phép kiểm hiệu suất trực tiếp nhất.</li>
</ul>
<h3>Chế độ lương, sơ lược</h3>
<p>Hầu hết vị trí bán hàng kết hợp <strong>lương cơ bản</strong> (ổn định) với <strong>hoa hồng</strong> (động lực gắn trực tiếp với kết quả) — tỉ lệ kết hợp cho thấy công ty muốn khen thưởng kết quả thuần túy hay giữ và phát triển nhân tài đến mức nào.</p>
<div class="callout"><span class="badge">Quản trị đặt bối cảnh, bán hàng vẫn thắng đơn hàng</span> Lãnh thổ, chỉ tiêu và chỉ số quyết định nỗ lực hướng vào đâu và được đánh giá thế nào — nhưng mỗi đơn hàng vẫn phụ thuộc vào kỹ năng bán hàng cá nhân được xây ở chương 1–7.</div>`,
  ]]);

const c8q = quiz('sal301-quiz-8', 'Quiz 8 — Sales management basics|||Quiz 8 — Quản trị bán hàng cơ bản', [
  { id: 'q1', question: 'Thiết kế lãnh thổ bán hàng tốt cần cân bằng hai yếu tố nào?', options: ['Giá và chi phí', 'Khối lượng công việc và tiềm năng cơ hội', 'Số nhân viên và số sản phẩm', 'Lương và hoa hồng'], correctIndex: 1, explanation: 'Lãnh thổ cần đủ tiềm năng để đáng phụ trách nhưng không quá lớn tới mức không phục vụ hết được.' },
  { id: 'q2', question: 'Chỉ tiêu (quota) đặt quá cao có thể dẫn tới hậu quả gì?', options: ['Luôn tăng doanh thu bền vững', 'Gây nản chí và có thể đẩy tới lối tắt phi đạo đức', 'Không ảnh hưởng gì tới nhân viên', 'Giúp lãnh thổ được thiết kế tốt hơn'], correctIndex: 1, explanation: 'Chỉ tiêu phi thực tế gây nản và có thể khiến nhân viên tìm cách gian lận để đạt số.' },
  { id: 'q3', question: '"Mức đạt chỉ tiêu" (quota attainment) được tính như thế nào?', options: ['Số cuộc gọi ÷ số ngày làm việc', 'Kết quả thực tế ÷ chỉ tiêu', 'Lương cơ bản ÷ hoa hồng', 'Số khách hàng mới ÷ số khách hàng cũ'], correctIndex: 1, explanation: 'Quota attainment là kết quả đạt được chia cho chỉ tiêu đặt ra, chỉ số kiểm hiệu suất trực tiếp nhất.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'SAL301',
    slug: 'sal301-professional-selling-and-management',
    title: 'Professional Selling and Management',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/SAL301.webp',
    shortDescription: 'The personal selling process end to end: buyer behaviour, prospecting, SPIN questioning, presenting (FABE), objections & closing, after-sale CRM, plus territory/quota/performance basics. Bilingual, with worked examples & quizzes.|||Toàn bộ quy trình bán hàng cá nhân: hành vi khách hàng, tìm khách, câu hỏi SPIN, trình bày (FABE), xử lý phản đối & chốt sale, CRM sau bán, cộng nền tảng lãnh thổ/chỉ tiêu/hiệu suất. Song ngữ, có ví dụ & quiz.',
    description: 'Môn <strong>SAL301 — Professional Selling and Management</strong> (kỳ 5, khối Quản trị Kinh doanh) xây dựng <strong>quy trình bán hàng cá nhân</strong> từ vai trò nhân viên bán hàng → <strong>hành vi khách hàng</strong> → <strong>tìm &amp; đánh giá khách hàng tiềm năng</strong> → <strong>tiếp cận &amp; khám phá nhu cầu (SPIN)</strong> → <strong>trình bày &amp; demo (FABE)</strong> → <strong>xử lý phản đối &amp; chốt sale</strong> → <strong>chăm sóc sau bán &amp; CRM</strong> → <strong>quản trị bán hàng cơ bản</strong> (lãnh thổ, chỉ tiêu, hiệu suất). Dựa trên Selling Today (Manning/Ahearne/Reece), SPIN Selling (Rackham), ABC\'s of Relationship Selling (Futrell). Song ngữ, có ví dụ và quiz mỗi chương.',
    whatYouLearn: 'Vai trò & đạo đức của nhân viên bán hàng chuyên nghiệp; hành vi & tâm lý người mua; prospecting & qualifying (MAN/BANT); pre-approach & SPIN (Situation/Problem/Implication/Need-payoff); trình bày & demo bằng FABE; xử lý phản đối (LAARC) & kỹ thuật chốt sale; chăm sóc sau bán, cross-sell/up-sell, CRM & CLV; nền tảng quản trị bán hàng: lãnh thổ, chỉ tiêu (quota), KPI, chế độ lương/hoa hồng.',
    requirements: 'Không yêu cầu kiến thức bán hàng trước đó. Hữu ích nếu đã học các môn marketing/quản trị kinh doanh cơ bản.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Selling Today, SPIN Selling, ABC\'s of Relationship Selling, tài liệu chính thức, YouTube, công cụ CRM, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Bán hàng cá nhân, tư vấn/consultative, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan & vai trò|||Chapter 1 — Overview & role', description: 'Bán hàng chuyên nghiệp, các dạng công việc, đạo đức.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Hành vi khách hàng|||Chapter 2 — Buyer behaviour', description: 'Quy trình mua, động cơ, adaptive selling.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Tìm kiếm khách hàng|||Chapter 3 — Prospecting', description: 'Nguồn lead, BANT, sales funnel.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Tiếp cận & SPIN|||Chapter 4 — Approach & SPIN', description: 'Pre-approach, SPIN, lắng nghe tích cực.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Trình bày & demo|||Chapter 5 — Presentation', description: 'FABE, demo, đề xuất.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Phản đối & chốt sale|||Chapter 6 — Objections & closing', description: 'LAARC, tín hiệu mua, kỹ thuật chốt.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Sau bán & CRM|||Chapter 7 — After-sale & CRM', description: 'Follow-up, cross/up-sell, CLV.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Quản trị bán hàng cơ bản|||Chapter 8 — Sales management basics', description: 'Lãnh thổ, chỉ tiêu, KPI, lương.', lessons: [c8, c8q] },
  ],
};
