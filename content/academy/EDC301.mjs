/**
 * EDC301 — Digital Customer Insight and Analytics. Giáo trình FLM (syl):
 * thấu hiểu khách hàng số qua dữ liệu — nguồn dữ liệu & CDP/CRM, phân khúc
 * (RFM), customer journey, CLV & churn, VoC/sentiment, cá nhân hoá, đạo đức
 * dữ liệu & báo cáo insight. Song ngữ + ví dụ + bài tập.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('edc301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: sách tham khảo (Fader, Kumar), tài liệu chính thức Google Analytics/CDP, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">EDC301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Digital Customer Insight and Analytics — data sources &amp; platforms, segmentation, journey, lifetime value, voice of customer, personalization and data ethics — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for EDC301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li>Peter Fader — <a href="https://www.wiley.com/en-us/Customer+Centricity" target="_blank" rel="noopener"><em>Customer Centricity: Focus on the Right Customers for Strategic Advantage</em></a></li>
<li>Peter Fader &amp; Sarah Toms — <a href="https://www.dummies.com/" target="_blank" rel="noopener"><em>Customer Analytics for Dummies</em></a></li>
<li>V. Kumar &amp; Werner Reinartz — <a href="https://www.springer.com/gp/book/9783662553801" target="_blank" rel="noopener"><em>Customer Relationship Management: Concept, Strategy, and Tools</em></a></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://support.google.com/analytics/" target="_blank" rel="noopener">Google Analytics — Help Center</a> — behavioral data, funnels, audiences</li>
<li><a href="https://segment.com/academy/" target="_blank" rel="noopener">Segment/Twilio — CDP Academy</a> — Customer Data Platform concepts</li>
<li><a href="https://www.qualtrics.com/experience-management/customer/what-is-nps/" target="_blank" rel="noopener">Qualtrics — Net Promoter Score guide</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@GoogleAnalytics" target="_blank" rel="noopener">Google Analytics (official)</a> — platform tutorials</li>
<li><a href="https://www.youtube.com/@WhartonSchool" target="_blank" rel="noopener">The Wharton School</a> — customer analytics &amp; centricity talks (Fader's home faculty)</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://analytics.google.com/" target="_blank" rel="noopener">Google Analytics 4</a> — free web/app behavioral analytics</li>
<li><a href="https://www.hubspot.com/products/crm" target="_blank" rel="noopener">HubSpot CRM (free tier)</a> — practice CRM data &amp; segmentation</li>
<li><a href="https://www.google.com/sheets/about/" target="_blank" rel="noopener">Google Sheets</a> — build RFM scores &amp; CLV formulas by hand first</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — data→information→insight→action, first/second/third-party data, CDP vs CRM, RFM segmentation.</li>
<li><strong>Practice</strong> — score a small customer list by RFM, compute CLV with a simplified formula, map a customer journey with touchpoints.</li>
<li><strong>Go deeper</strong> — churn prediction signals, sentiment analysis on real reviews, a basic recommendation logic (collaborative vs content-based).</li>
<li><strong>Job-ready</strong> — read a privacy policy (GDPR/consent) critically, and turn a messy dataset into a one-page insight report a manager can act on.</li>
</ol></div>`,
    `<span class="eyebrow">EDC301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Thấu hiểu khách hàng số &amp; Phân tích — nguồn dữ liệu &amp; nền tảng, phân khúc, hành trình khách hàng, giá trị vòng đời, tiếng nói khách hàng, cá nhân hoá và đạo đức dữ liệu — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của EDC301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li>Peter Fader — <a href="https://www.wiley.com/en-us/Customer+Centricity" target="_blank" rel="noopener"><em>Customer Centricity: Focus on the Right Customers for Strategic Advantage</em></a></li>
<li>Peter Fader &amp; Sarah Toms — <a href="https://www.dummies.com/" target="_blank" rel="noopener"><em>Customer Analytics for Dummies</em></a></li>
<li>V. Kumar &amp; Werner Reinartz — <a href="https://www.springer.com/gp/book/9783662553801" target="_blank" rel="noopener"><em>Customer Relationship Management: Concept, Strategy, and Tools</em></a></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://support.google.com/analytics/" target="_blank" rel="noopener">Google Analytics — Trung tâm hỗ trợ</a> — dữ liệu hành vi, funnel, audience</li>
<li><a href="https://segment.com/academy/" target="_blank" rel="noopener">Segment/Twilio — CDP Academy</a> — khái niệm Customer Data Platform</li>
<li><a href="https://www.qualtrics.com/experience-management/customer/what-is-nps/" target="_blank" rel="noopener">Qualtrics — hướng dẫn Net Promoter Score</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@GoogleAnalytics" target="_blank" rel="noopener">Google Analytics (chính thức)</a> — hướng dẫn nền tảng</li>
<li><a href="https://www.youtube.com/@WhartonSchool" target="_blank" rel="noopener">The Wharton School</a> — bài nói về customer analytics &amp; centricity (nơi Fader giảng dạy)</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://analytics.google.com/" target="_blank" rel="noopener">Google Analytics 4</a> — phân tích hành vi web/app miễn phí</li>
<li><a href="https://www.hubspot.com/products/crm" target="_blank" rel="noopener">HubSpot CRM (bản miễn phí)</a> — luyện dữ liệu CRM &amp; phân khúc</li>
<li><a href="https://www.google.com/sheets/about/" target="_blank" rel="noopener">Google Sheets</a> — tự tính điểm RFM &amp; công thức CLV bằng tay trước</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — dữ liệu→thông tin→insight→hành động, dữ liệu bên thứ 1/2/3, CDP vs CRM, phân khúc RFM.</li>
<li><strong>Luyện tập</strong> — tính điểm RFM cho một danh sách khách hàng nhỏ, tính CLV bằng công thức đơn giản, vẽ hành trình khách hàng kèm điểm chạm.</li>
<li><strong>Đào sâu thực tế</strong> — dấu hiệu dự báo churn, phân tích cảm xúc trên review thật, logic khuyến nghị cơ bản (collaborative vs content-based).</li>
<li><strong>Sẵn sàng đi làm</strong> — đọc phản biện một chính sách quyền riêng tư (GDPR/consent), và biến một tập dữ liệu lộn xộn thành báo cáo insight một trang mà quản lý hành động được.</li>
</ol></div>`,
  ]]);

const intro = doc('edc301-0-1-overview', 'Course overview: Digital Customer Insight and Analytics|||Tổng quan: Thấu hiểu khách hàng số & Phân tích',
  'Customer insight là gì, vì sao doanh nghiệp số cần nó; tháp dữ liệu→thông tin→insight→hành động; lộ trình 8 chương.',
  [[
    `<span class="eyebrow">EDC301 · Lesson 0.1 · Overview</span>
<h2>Digital Customer Insight &amp; Analytics</h2>
<p class="lead">This course helps you turn <strong>raw customer data</strong> into <strong>insight</strong> a business can act on — who the customer is, what they do, why they leave, and what to offer them next. It underpins every digital business decision, from a marketing campaign to a product roadmap.</p>
<h3>The data → insight → action pyramid</h3>
<pre><code>Data        raw facts: clicks, purchases, ticket logs
  -> Information   organized/summarized data (e.g. "sales by region")
  -> Insight       WHY it matters ("loyal customers churn after a bad support call")
  -> Action        a decision made because of the insight
</code></pre>
<p>A dashboard full of numbers is <em>information</em>. It only becomes <strong>customer insight</strong> when it explains customer behavior well enough to change a decision.</p>
<h3>Why it matters in a digital business</h3>
<p>Every click, search, purchase and support ticket is now data. Companies that read that data well practice <strong>customer centricity</strong> (Fader) — organizing the business around <em>which customers to serve</em> and <em>how to keep them</em>, not just around products.</p>
<h3>Roadmap</h3>
<p>Data sources &amp; platforms (CDP/CRM) → segmentation (RFM) → customer journey &amp; digital behavior → lifetime value &amp; churn → voice of customer &amp; sentiment → personalization &amp; recommendations → data ethics, privacy &amp; reporting insight for decisions.</p>`,
    `<span class="eyebrow">EDC301 · Bài 0.1 · Tổng quan</span>
<h2>Thấu hiểu khách hàng số &amp; Phân tích</h2>
<p class="lead">Môn này giúp bạn biến <strong>dữ liệu khách hàng thô</strong> thành <strong>insight</strong> mà doanh nghiệp hành động được — khách hàng là ai, họ làm gì, vì sao họ rời đi, và nên đề xuất gì tiếp theo. Đây là nền của mọi quyết định trong kinh doanh số, từ một chiến dịch marketing tới lộ trình sản phẩm.</p>
<h3>Tháp dữ liệu → thông tin → insight → hành động</h3>
<pre><code>Dữ liệu (Data)   sự kiện thô: click, đơn hàng, log ticket hỗ trợ
  -> Thông tin (Information)   dữ liệu đã tổ chức/tổng hợp (vd "doanh số theo vùng")
  -> Insight       TẠI SAO nó quan trọng ("khách trung thành rời đi sau một lần hỗ trợ tệ")
  -> Hành động (Action)   quyết định được đưa ra nhờ insight đó
</code></pre>
<p>Một dashboard đầy số liệu chỉ là <em>thông tin</em>. Nó chỉ trở thành <strong>customer insight</strong> khi giải thích được hành vi khách hàng đủ rõ để thay đổi một quyết định.</p>
<h3>Vì sao quan trọng trong kinh doanh số</h3>
<p>Mỗi lượt click, tìm kiếm, mua hàng và ticket hỗ trợ giờ đều là dữ liệu. Doanh nghiệp đọc tốt dữ liệu đó thực hành <strong>customer centricity</strong> (Fader) — tổ chức doanh nghiệp xoay quanh <em>nên phục vụ khách hàng nào</em> và <em>giữ họ ra sao</em>, không chỉ xoay quanh sản phẩm.</p>
<h3>Lộ trình</h3>
<p>Nguồn dữ liệu &amp; nền tảng (CDP/CRM) → phân khúc (RFM) → hành trình khách hàng &amp; hành vi số → giá trị vòng đời &amp; churn → tiếng nói khách hàng &amp; cảm xúc → cá nhân hoá &amp; khuyến nghị → đạo đức dữ liệu, quyền riêng tư &amp; báo cáo insight ra quyết định.</p>`,
  ]]);

const c1 = doc('edc301-1-1-insight-overview', '1.1 — Customer insight & its role in digital business|||1.1 — Customer insight & vai trò trong kinh doanh số',
  'Data vs information vs insight vs action; customer centricity (Fader); 4 mức độ trưởng thành phân tích: descriptive→diagnostic→predictive→prescriptive.',
  [[
    `<span class="eyebrow">EDC301 · Chapter 1 · Lesson 1.1</span>
<h2>Customer insight &amp; its role in digital business</h2>
<h3>Data, information, insight, action</h3>
<ul>
<li><strong>Data</strong> — raw, unorganized facts (a single click, one purchase row).</li>
<li><strong>Information</strong> — data organized into something readable ("15% more purchases on mobile this month").</li>
<li><strong>Insight</strong> — the <em>why</em>, connected to a business question ("mobile buyers are younger and price-sensitive, so a flat discount works better than free shipping for them").</li>
<li><strong>Action</strong> — a decision taken because of the insight (change the mobile promotion).</li>
</ul>
<h3>Customer centricity (Fader)</h3>
<p>Peter Fader's core idea: a business should be organized around <strong>which customers are most valuable</strong> and how to serve/retain them — not just around which products sell most. Not all customers are equally profitable; insight is what lets a company tell them apart.</p>
<h3>Analytics maturity levels</h3>
<pre><code>Descriptive   -> What happened?         (reports, dashboards)
Diagnostic    -> Why did it happen?      (drill-down, correlation)
Predictive    -> What will happen?       (churn score, demand forecast)
Prescriptive  -> What should we do?      (next-best-offer, automated action)
</code></pre>
<div class="callout"><span class="badge">Where most companies stall</span> Most dashboards only answer "what happened" (descriptive). Real competitive advantage comes from reaching predictive and prescriptive — acting BEFORE the customer churns, not reporting it after.</div>`,
    `<span class="eyebrow">EDC301 · Chương 1 · Bài 1.1</span>
<h2>Customer insight &amp; vai trò trong kinh doanh số</h2>
<h3>Dữ liệu, thông tin, insight, hành động</h3>
<ul>
<li><strong>Dữ liệu (Data)</strong> — sự kiện thô, chưa tổ chức (một lượt click, một dòng đơn hàng).</li>
<li><strong>Thông tin (Information)</strong> — dữ liệu được tổ chức thành thứ đọc được ("tháng này mua trên mobile tăng 15%").</li>
<li><strong>Insight</strong> — phần <em>tại sao</em>, gắn với câu hỏi kinh doanh ("người mua trên mobile trẻ hơn và nhạy giá, nên giảm giá trực tiếp hiệu quả hơn miễn phí ship với họ").</li>
<li><strong>Hành động (Action)</strong> — quyết định được đưa ra nhờ insight đó (đổi chương trình khuyến mãi trên mobile).</li>
</ul>
<h3>Customer centricity (Fader)</h3>
<p>Ý tưởng lõi của Peter Fader: doanh nghiệp nên tổ chức xoay quanh <strong>khách hàng nào giá trị nhất</strong> và cách phục vụ/giữ chân họ — không chỉ xoay quanh sản phẩm nào bán nhiều nhất. Không phải khách hàng nào cũng sinh lời như nhau; insight là thứ giúp công ty phân biệt được điều đó.</p>
<h3>4 mức độ trưởng thành phân tích</h3>
<pre><code>Descriptive   -> Điều gì đã xảy ra?        (báo cáo, dashboard)
Diagnostic    -> Vì sao nó xảy ra?         (drill-down, tương quan)
Predictive    -> Điều gì sẽ xảy ra?        (điểm churn, dự báo nhu cầu)
Prescriptive  -> Nên làm gì?               (đề xuất tốt nhất kế tiếp, hành động tự động)
</code></pre>
<div class="callout"><span class="badge">Nơi hầu hết công ty dừng lại</span> Hầu hết dashboard chỉ trả lời "điều gì đã xảy ra" (descriptive). Lợi thế cạnh tranh thật sự nằm ở predictive và prescriptive — hành động TRƯỚC khi khách hàng rời đi, không phải báo cáo lại sau đó.</div>`,
  ]]);

const c1q = quiz('edc301-quiz-1', 'Quiz 1 — Customer insight overview|||Quiz 1 — Tổng quan customer insight', [
  { id: 'q1', question: 'Điểm khác biệt cốt lõi giữa "thông tin" và "insight" là gì?', options: ['Insight là dữ liệu chưa xử lý', 'Insight giải thích được TẠI SAO và gắn với một quyết định', 'Thông tin luôn chính xác hơn insight', 'Chúng là một, chỉ khác tên gọi'], correctIndex: 1, explanation: 'Thông tin là dữ liệu đã tổ chức; insight là phần "tại sao" đủ để dẫn tới hành động.' },
  { id: 'q2', question: 'Theo Fader, "customer centricity" nghĩa là gì?', options: ['Bán được nhiều sản phẩm nhất có thể', 'Tổ chức doanh nghiệp xoay quanh khách hàng giá trị nhất, không chỉ quanh sản phẩm', 'Giảm giá cho mọi khách hàng như nhau', 'Chỉ tập trung thu thập dữ liệu, không cần hành động'], correctIndex: 1, explanation: 'Customer centricity xoay quanh việc xác định và giữ chân khách hàng giá trị, thay vì chỉ tối ưu sản phẩm.' },
  { id: 'q3', question: 'Mức độ phân tích nào trả lời câu hỏi "nên làm gì tiếp theo"?', options: ['Descriptive', 'Diagnostic', 'Predictive', 'Prescriptive'], correctIndex: 3, explanation: 'Prescriptive analytics đề xuất hành động cụ thể, ví dụ next-best-offer.' },
]);

const c2 = doc('edc301-2-1-data-sources-cdp-crm', '2.1 — Customer data sources & CDP/CRM|||2.1 — Nguồn dữ liệu khách hàng & CDP/CRM',
  'First/second/third-party data; CRM (giao dịch & tương tác) vs CDP (hợp nhất định danh — identity resolution); Google Analytics là nguồn hành vi.',
  [[
    `<span class="eyebrow">EDC301 · Chapter 2 · Lesson 2.1</span>
<h2>Customer data sources &amp; CDP/CRM</h2>
<h3>Where customer data comes from</h3>
<ul>
<li><strong>First-party data</strong> — collected directly by the business (purchases, app clicks, support chats, sign-up forms). Most reliable, and the business owns it.</li>
<li><strong>Second-party data</strong> — another company's first-party data, shared/purchased directly (e.g. a partner's customer list, with consent).</li>
<li><strong>Third-party data</strong> — aggregated from many sources by data brokers, with no direct relationship to the customer. Increasingly restricted by privacy law and browser policy.</li>
</ul>
<h3>CRM vs CDP</h3>
<p>A <strong>CRM (Customer Relationship Management)</strong> system stores structured records tied to sales &amp; support — contacts, deals, tickets, purchase history. It answers "what did this named customer buy or ask?"</p>
<p>A <strong>CDP (Customer Data Platform)</strong> goes further: it performs <strong>identity resolution</strong> — stitching together events from web, app, email, POS and CRM into ONE unified customer profile, even before you know their name (an anonymous browsing session merged with a later login). A CDP feeds analytics AND activates the data (e.g. triggers a personalized email).</p>
<pre><code>Web clicks -\
App events  -\
Email opens  -> CDP (identity resolution) -> ONE customer profile -> CRM, ads, personalization
POS/CRM data-/
</code></pre>
<h3>Behavioral data: the web/app source</h3>
<p>Tools like <strong>Google Analytics</strong> track digital behavior — pageviews, sessions, funnels, drop-off points — the "what did they actually do on our site/app" layer that CRM alone doesn't capture.</p>
<div class="callout"><span class="badge">One customer, many systems</span> Without a CDP (or equivalent integration), the same person looks like three different "customers" across web analytics, CRM and email — insight built on fragmented data is unreliable.</div>`,
    `<span class="eyebrow">EDC301 · Chương 2 · Bài 2.1</span>
<h2>Nguồn dữ liệu khách hàng &amp; CDP/CRM</h2>
<h3>Dữ liệu khách hàng đến từ đâu</h3>
<ul>
<li><strong>Dữ liệu bên thứ nhất (first-party)</strong> — do doanh nghiệp tự thu thập trực tiếp (đơn hàng, click trên app, chat hỗ trợ, form đăng ký). Đáng tin nhất, và doanh nghiệp sở hữu nó.</li>
<li><strong>Dữ liệu bên thứ hai (second-party)</strong> — dữ liệu first-party của một công ty khác, được chia sẻ/mua trực tiếp (vd danh sách khách hàng của đối tác, có sự đồng ý).</li>
<li><strong>Dữ liệu bên thứ ba (third-party)</strong> — được các nhà môi giới dữ liệu tổng hợp từ nhiều nguồn, không có quan hệ trực tiếp với khách hàng. Ngày càng bị luật quyền riêng tư và chính sách trình duyệt siết lại.</li>
</ul>
<h3>CRM vs CDP</h3>
<p>Hệ thống <strong>CRM (Customer Relationship Management)</strong> lưu bản ghi có cấu trúc gắn với bán hàng &amp; hỗ trợ — liên hệ, cơ hội bán, ticket, lịch sử mua. Nó trả lời "khách hàng có tên này đã mua/hỏi gì?"</p>
<p>Một <strong>CDP (Customer Data Platform)</strong> đi xa hơn: nó thực hiện <strong>hợp nhất định danh (identity resolution)</strong> — ghép sự kiện từ web, app, email, POS và CRM thành MỘT hồ sơ khách hàng thống nhất, ngay cả trước khi biết tên họ (một phiên duyệt web ẩn danh được ghép với lần đăng nhập sau đó). CDP vừa nuôi phân tích, vừa kích hoạt dữ liệu (vd tự gửi email cá nhân hoá).</p>
<pre><code>Click web  -\
Sự kiện app -\
Mở email     -> CDP (hợp nhất định danh) -> MỘT hồ sơ khách hàng -> CRM, quảng cáo, cá nhân hoá
Dữ liệu POS/CRM-/
</code></pre>
<h3>Dữ liệu hành vi: nguồn từ web/app</h3>
<p>Công cụ như <strong>Google Analytics</strong> theo dõi hành vi số — lượt xem trang, phiên, funnel, điểm rớt (drop-off) — lớp "họ thực sự làm gì trên site/app" mà CRM một mình không nắm được.</p>
<div class="callout"><span class="badge">Một khách hàng, nhiều hệ thống</span> Không có CDP (hay tích hợp tương đương), cùng một người trông như ba "khách hàng" khác nhau giữa web analytics, CRM và email — insight dựng trên dữ liệu rời rạc là không đáng tin.</div>`,
  ]]);

const c2q = quiz('edc301-quiz-2', 'Quiz 2 — Data sources & CDP/CRM|||Quiz 2 — Nguồn dữ liệu & CDP/CRM', [
  { id: 'q1', question: 'Dữ liệu do doanh nghiệp tự thu thập trực tiếp từ khách hàng (đơn hàng, click app) gọi là?', options: ['Third-party data', 'Second-party data', 'First-party data', 'Dữ liệu mở'], correctIndex: 2, explanation: 'First-party data do chính doanh nghiệp thu thập trực tiếp, đáng tin nhất.' },
  { id: 'q2', question: 'Điểm khác biệt chính giữa CDP và CRM là gì?', options: ['CDP chỉ lưu dữ liệu bán hàng, CRM thì không', 'CDP thực hiện hợp nhất định danh, ghép dữ liệu nhiều nguồn thành một hồ sơ; CRM chủ yếu lưu bản ghi giao dịch/hỗ trợ có cấu trúc', 'CRM luôn lớn hơn CDP', 'Không có sự khác biệt, hai tên gọi của cùng một hệ thống'], correctIndex: 1, explanation: 'CDP làm identity resolution trên nhiều nguồn; CRM tập trung bản ghi giao dịch/tương tác đã biết danh tính.' },
  { id: 'q3', question: 'Google Analytics chủ yếu cung cấp loại dữ liệu nào?', options: ['Dữ liệu tài chính nội bộ', 'Dữ liệu hành vi số trên web/app (pageview, funnel, drop-off)', 'Dữ liệu bên thứ ba mua từ nhà môi giới', 'Hồ sơ nhân sự'], correctIndex: 1, explanation: 'GA theo dõi hành vi số: phiên, lượt xem trang, funnel, điểm rớt.' },
]);

const c3 = doc('edc301-3-1-segmentation-rfm', '3.1 — Customer segmentation & RFM|||3.1 — Phân khúc khách hàng & RFM',
  'Cơ sở phân khúc (demographic/behavioral/geographic/psychographic); mô hình RFM (Recency, Frequency, Monetary), cách chấm điểm & ứng dụng.',
  [[
    `<span class="eyebrow">EDC301 · Chapter 3 · Lesson 3.1</span>
<h2>Customer segmentation &amp; RFM</h2>
<h3>Bases for segmentation</h3>
<ul>
<li><strong>Demographic</strong> — age, income, gender, occupation.</li>
<li><strong>Geographic</strong> — country, city, urban/rural.</li>
<li><strong>Psychographic</strong> — lifestyle, values, interests.</li>
<li><strong>Behavioral</strong> — purchase behavior, usage frequency, loyalty — usually the most predictive for a digital business, because it's based on what customers actually DO.</li>
</ul>
<h3>RFM: a simple, powerful behavioral model</h3>
<pre><code>R — Recency    how recently did they buy? (days since last purchase — lower is better)
F — Frequency  how often do they buy? (number of purchases in a period — higher is better)
M — Monetary   how much do they spend? (total/average spend — higher is better)
</code></pre>
<p>Each customer gets scored (often 1-5) on each dimension, usually by splitting customers into quintiles. A customer scoring <strong>5-5-5</strong> is recent, frequent, and high-spending — the "best customer" segment; a <strong>1-1-1</strong> customer is at risk or already lost.</p>
<pre><code>Example RFM segments:
 R5 F5 M5  -> "Champions"      — reward &amp; retain them, don't over-discount
 R5 F1 M1  -> "New customers"  — nurture, second-purchase campaigns
 R1 F5 M5  -> "At-risk loyal"  — used to be great, hasn't come back — win-back offer
 R1 F1 M1  -> "Lost"           — low priority, cheapest channel only
</code></pre>
<div class="callout"><span class="badge">Why RFM survives decades of hype</span> It needs only transaction data (date, count, amount) that almost every business already has — no fancy tooling required to start acting on customer value differences.</div>`,
    `<span class="eyebrow">EDC301 · Chương 3 · Bài 3.1</span>
<h2>Phân khúc khách hàng &amp; RFM</h2>
<h3>Cơ sở phân khúc</h3>
<ul>
<li><strong>Nhân khẩu học (demographic)</strong> — tuổi, thu nhập, giới tính, nghề nghiệp.</li>
<li><strong>Địa lý (geographic)</strong> — quốc gia, thành phố, đô thị/nông thôn.</li>
<li><strong>Tâm lý học (psychographic)</strong> — lối sống, giá trị, sở thích.</li>
<li><strong>Hành vi (behavioral)</strong> — hành vi mua, tần suất dùng, mức trung thành — thường dự báo tốt nhất cho kinh doanh số, vì dựa trên điều khách hàng THỰC SỰ LÀM.</li>
</ul>
<h3>RFM: mô hình hành vi đơn giản mà mạnh</h3>
<pre><code>R — Recency (gần đây)    họ mua gần đây nhất là khi nào? (số ngày từ lần mua cuối — càng thấp càng tốt)
F — Frequency (tần suất) họ mua bao nhiêu lần? (số lần mua trong một kỳ — càng cao càng tốt)
M — Monetary (chi tiêu)  họ chi bao nhiêu? (tổng/trung bình chi tiêu — càng cao càng tốt)
</code></pre>
<p>Mỗi khách hàng được chấm điểm (thường 1-5) trên từng chiều, thường bằng cách chia khách hàng theo ngũ phân vị. Khách hàng đạt <strong>5-5-5</strong> là gần đây, thường xuyên, chi tiêu cao — nhóm "khách hàng tốt nhất"; khách <strong>1-1-1</strong> đang có rủi ro rời bỏ hoặc đã mất.</p>
<pre><code>Ví dụ phân khúc RFM:
 R5 F5 M5  -> "Nhà quán quân" — thưởng &amp; giữ chân, đừng giảm giá quá đà
 R5 F1 M1  -> "Khách hàng mới" — nuôi dưỡng, chiến dịch mua lần hai
 R1 F5 M5  -> "Trung thành có rủi ro" — từng rất tốt, chưa quay lại — ưu đãi mời quay lại
 R1 F1 M1  -> "Đã mất"         — ưu tiên thấp, chỉ dùng kênh rẻ nhất
</code></pre>
<div class="callout"><span class="badge">Vì sao RFM sống sót qua nhiều thập kỷ trào lưu</span> Nó chỉ cần dữ liệu giao dịch (ngày, số lần, số tiền) mà hầu như doanh nghiệp nào cũng có sẵn — không cần công cụ cầu kỳ để bắt đầu hành động theo giá trị khách hàng khác nhau.</div>`,
  ]]);

const c3q = quiz('edc301-quiz-3', 'Quiz 3 — Segmentation & RFM|||Quiz 3 — Phân khúc & RFM', [
  { id: 'q1', question: 'Ba chiều của mô hình RFM là gì?', options: ['Recency, Frequency, Monetary', 'Region, Frequency, Margin', 'Recency, Feedback, Market', 'Reach, Frequency, Media'], correctIndex: 0, explanation: 'RFM = Recency (gần đây), Frequency (tần suất), Monetary (chi tiêu).' },
  { id: 'q2', question: 'Khách hàng có điểm R1 F5 M5 (từng mua thường xuyên, chi nhiều, nhưng lâu chưa mua lại) nên được xử lý thế nào?', options: ['Bỏ qua, coi như đã mất hẳn', 'Gửi ưu đãi mời quay lại (win-back) vì họ từng là khách trung thành giá trị', 'Chỉ gửi email quảng cáo đại trà như mọi khách khác', 'Xoá khỏi hệ thống CRM'], correctIndex: 1, explanation: 'R1 nhưng F5 M5 nghĩa là từng rất giá trị — đây là nhóm "trung thành có rủi ro", đáng đầu tư ưu đãi mời quay lại.' },
  { id: 'q3', question: 'Vì sao phân khúc theo hành vi (behavioral) thường dự báo tốt hơn nhân khẩu học cho kinh doanh số?', options: ['Vì dữ liệu nhân khẩu học luôn sai', 'Vì nó dựa trên điều khách hàng thực sự làm (mua, dùng), không chỉ đặc điểm tĩnh', 'Vì hành vi dễ thu thập hơn và không cần sự đồng ý', 'Vì RFM không cần dữ liệu nào cả'], correctIndex: 1, explanation: 'Hành vi phản ánh trực tiếp điều khách hàng làm, nên dự báo giá trị/khả năng mua tiếp tốt hơn đặc điểm tĩnh như tuổi hay vùng.' },
]);

const c4 = doc('edc301-4-1-journey-digital-behavior', '4.1 — Customer journey & digital behavior|||4.1 — Hành trình khách hàng & hành vi số',
  'Các giai đoạn hành trình khách hàng, điểm chạm đa kênh (omnichannel); theo dõi hành vi số: clickstream, phân tích funnel, điểm rớt (drop-off).',
  [[
    `<span class="eyebrow">EDC301 · Chapter 4 · Lesson 4.1</span>
<h2>Customer journey &amp; digital behavior</h2>
<h3>Stages of the customer journey</h3>
<pre><code>Awareness -> Consideration -> Purchase -> Retention -> Advocacy
 (discover)   (compare/       (buy)       (keep using/  (recommend
              research)                    coming back)  to others)
</code></pre>
<p>Each stage has different <strong>touchpoints</strong> — an ad, a product review site, a checkout page, a support chat, a loyalty email. In an <strong>omnichannel</strong> business, the same customer moves between app, website, social media and physical store, and the journey should feel continuous, not like starting over on each channel.</p>
<h3>Tracking digital behavior</h3>
<ul>
<li><strong>Clickstream</strong> — the sequence of pages/screens a user visits, in order. It shows the actual PATH taken, not just the destination.</li>
<li><strong>Funnel analysis</strong> — measuring how many users move from one journey step to the next (e.g. Product page → Add to cart → Checkout → Payment).</li>
<li><strong>Drop-off point</strong> — the step where the most users leave without completing the next step — usually the highest-value place to fix friction.</li>
</ul>
<pre><code>Example funnel (1,000 sessions):
 Product page   1,000  (100%)
 Add to cart      400  (40%)
 Checkout         220  (22%)  <- biggest drop-off vs previous step (400->220)
 Payment done     180  (18%)
</code></pre>
<div class="callout"><span class="badge">Journey insight beats single-metric insight</span> "Only 18% convert" says little on its own. Knowing WHERE in the journey they drop (cart → checkout) tells you exactly what to fix — here, likely checkout friction, not the product page.</div>`,
    `<span class="eyebrow">EDC301 · Chương 4 · Bài 4.1</span>
<h2>Hành trình khách hàng &amp; hành vi số</h2>
<h3>Các giai đoạn hành trình khách hàng</h3>
<pre><code>Nhận biết -> Xem xét -> Mua hàng -> Duy trì -> Ủng hộ
(khám phá)  (so sánh/     (mua)     (tiếp tục   (giới thiệu
             tìm hiểu)                dùng/quay   cho người
                                       lại)        khác)
</code></pre>
<p>Mỗi giai đoạn có <strong>điểm chạm (touchpoint)</strong> khác nhau — một mẫu quảng cáo, trang review sản phẩm, trang thanh toán, chat hỗ trợ, email loyalty. Trong doanh nghiệp <strong>omnichannel</strong>, cùng một khách hàng di chuyển giữa app, website, mạng xã hội và cửa hàng thật, và hành trình cần liền mạch, không phải bắt đầu lại từ đầu ở mỗi kênh.</p>
<h3>Theo dõi hành vi số</h3>
<ul>
<li><strong>Clickstream</strong> — chuỗi trang/màn hình người dùng ghé qua, theo thứ tự. Nó cho thấy ĐƯỜNG ĐI thật, không chỉ điểm đến.</li>
<li><strong>Phân tích funnel</strong> — đo bao nhiêu người dùng đi từ bước này sang bước kế của hành trình (vd Trang sản phẩm → Thêm vào giỏ → Thanh toán → Trả tiền).</li>
<li><strong>Điểm rớt (drop-off)</strong> — bước mà nhiều người dùng rời đi nhất mà không hoàn thành bước kế — thường là nơi đáng sửa ma sát nhất.</li>
</ul>
<pre><code>Ví dụ funnel (1.000 phiên):
 Trang sản phẩm   1.000  (100%)
 Thêm vào giỏ       400  (40%)
 Thanh toán         220  (22%)  <- rớt nhiều nhất so bước trước (400->220)
 Đã trả tiền        180  (18%)
</code></pre>
<div class="callout"><span class="badge">Insight theo hành trình hơn insight một chỉ số</span> "Chỉ 18% chuyển đổi" tự nó nói rất ít. Biết được RỚT Ở ĐÂU trong hành trình (giỏ hàng → thanh toán) cho biết chính xác cần sửa gì — ở đây, khả năng cao là ma sát ở trang thanh toán, không phải trang sản phẩm.</div>`,
  ]]);

const c4q = quiz('edc301-quiz-4', 'Quiz 4 — Journey & digital behavior|||Quiz 4 — Hành trình & hành vi số', [
  { id: 'q1', question: 'Thứ tự đúng của các giai đoạn hành trình khách hàng cơ bản là?', options: ['Mua hàng → Nhận biết → Duy trì → Xem xét', 'Nhận biết → Xem xét → Mua hàng → Duy trì → Ủng hộ', 'Ủng hộ → Xem xét → Nhận biết → Mua hàng', 'Duy trì → Mua hàng → Nhận biết → Ủng hộ'], correctIndex: 1, explanation: 'Hành trình chuẩn: Nhận biết → Xem xét → Mua hàng → Duy trì → Ủng hộ.' },
  { id: 'q2', question: '"Điểm rớt" (drop-off point) trong phân tích funnel là gì?', options: ['Bước có nhiều người dùng nhất', 'Bước mà tỉ lệ người dùng rời đi để chuyển sang bước kế cao nhất', 'Trang đầu tiên của website', 'Chỉ số doanh thu trung bình'], correctIndex: 1, explanation: 'Drop-off là bước mất nhiều người dùng nhất trước khi qua bước kế tiếp — nơi ưu tiên sửa.' },
  { id: 'q3', question: 'Vì sao một doanh nghiệp omnichannel cần hành trình khách hàng liền mạch giữa các kênh?', options: ['Vì mỗi kênh nên hoạt động độc lập, không cần liên quan gì', 'Vì cùng một khách hàng di chuyển giữa nhiều kênh (app, web, cửa hàng) và trải nghiệm rời rạc làm gãy hành trình', 'Vì omnichannel chỉ áp dụng cho quảng cáo', 'Vì hành vi số không liên quan tới cửa hàng thật'], correctIndex: 1, explanation: 'Omnichannel đòi hỏi trải nghiệm liên tục xuyên kênh, vì khách hàng thực tế di chuyển qua nhiều điểm chạm khác nhau.' },
]);

const c5 = doc('edc301-5-1-clv-churn', '5.1 — Customer lifetime value & churn|||5.1 — Giá trị vòng đời khách hàng (CLV) & churn',
  'Công thức CLV đơn giản; tỉ lệ churn; vì sao CLV cao mà churn cao vẫn nguy hiểm; tín hiệu dự báo churn.',
  [[
    `<span class="eyebrow">EDC301 · Chapter 5 · Lesson 5.1</span>
<h2>Customer lifetime value &amp; churn</h2>
<h3>Customer Lifetime Value (CLV)</h3>
<p>CLV estimates the <strong>total value</strong> a customer brings over their whole relationship with the business — not just one purchase. A simple version:</p>
<pre><code>CLV = Average Order Value x Purchase Frequency x Customer Lifespan

Example:
 Average order value      = $40
 Purchase frequency       = 6 times / year
 Average customer lifespan = 3 years
 CLV = 40 x 6 x 3 = $720
</code></pre>
<p>CLV tells you how much you can reasonably spend to <strong>acquire or retain</strong> a customer and still be profitable — this is why marketing budgets are set per-segment, not flat.</p>
<h3>Churn rate</h3>
<pre><code>Churn rate = Customers lost in period / Customers at start of period

Example:
 1,000 customers at month start, 40 leave during the month
 Churn rate = 40 / 1,000 = 4% monthly
</code></pre>
<p>Even a small monthly churn compounds — 4%/month is roughly ~40% gone within a year if nothing changes. Retention and CLV are two sides of the same coin: high churn destroys CLV no matter how strong the acquisition funnel is.</p>
<h3>Signals that predict churn</h3>
<p>Falling usage frequency, longer gaps between purchases (rising Recency), a support complaint left unresolved, and reduced engagement with emails/app notifications are common early-warning signals used to flag at-risk customers <em>before</em> they actually leave.</p>
<div class="callout"><span class="badge">Retention is cheaper than acquisition</span> It typically costs far less to keep an existing customer than to acquire a new one — which is why CLV and churn are analyzed together, not separately.</div>`,
    `<span class="eyebrow">EDC301 · Chương 5 · Bài 5.1</span>
<h2>Giá trị vòng đời khách hàng (CLV) &amp; churn</h2>
<h3>Customer Lifetime Value (CLV)</h3>
<p>CLV ước tính <strong>tổng giá trị</strong> một khách hàng mang lại suốt cả quan hệ với doanh nghiệp — không chỉ một lần mua. Một phiên bản đơn giản:</p>
<pre><code>CLV = Giá trị đơn hàng trung bình x Tần suất mua x Vòng đời khách hàng

Ví dụ:
 Giá trị đơn hàng trung bình = 40 đô
 Tần suất mua                = 6 lần/năm
 Vòng đời khách hàng trung bình = 3 năm
 CLV = 40 x 6 x 3 = 720 đô
</code></pre>
<p>CLV cho biết bạn có thể hợp lý chi bao nhiêu để <strong>thu hút hoặc giữ chân</strong> một khách hàng mà vẫn có lời — đây là lý do ngân sách marketing được đặt theo từng phân khúc, không đồng đều cho tất cả.</p>
<h3>Tỉ lệ churn</h3>
<pre><code>Tỉ lệ churn = Số khách hàng mất trong kỳ / Số khách hàng đầu kỳ

Ví dụ:
 1.000 khách hàng đầu tháng, 40 người rời đi trong tháng
 Tỉ lệ churn = 40 / 1.000 = 4% mỗi tháng
</code></pre>
<p>Ngay cả churn nhỏ hàng tháng cũng dồn lại — 4%/tháng nghĩa là gần ~40% mất đi trong một năm nếu không thay đổi gì. Retention và CLV là hai mặt của cùng một đồng xu: churn cao phá huỷ CLV bất kể funnel thu hút khách mới mạnh thế nào.</p>
<h3>Tín hiệu dự báo churn</h3>
<p>Tần suất dùng giảm, khoảng cách giữa các lần mua dài hơn (Recency tăng), một khiếu nại hỗ trợ chưa được giải quyết, và giảm tương tác với email/thông báo app là các tín hiệu cảnh báo sớm thường dùng để đánh dấu khách hàng có rủi ro <em>trước khi</em> họ thực sự rời đi.</p>
<div class="callout"><span class="badge">Giữ chân rẻ hơn thu hút mới</span> Thường tốn ít hơn nhiều để giữ một khách hàng hiện có so với thu hút khách mới — đây là lý do CLV và churn được phân tích cùng nhau, không tách rời.</div>`,
  ]]);

const c5q = quiz('edc301-quiz-5', 'Quiz 5 — CLV & churn|||Quiz 5 — CLV & churn', [
  { id: 'q1', question: 'Công thức CLV đơn giản gồm ba yếu tố nào?', options: ['Giá vốn x Số lượng x Thời gian giao hàng', 'Giá trị đơn hàng trung bình x Tần suất mua x Vòng đời khách hàng', 'Doanh thu x Chi phí x Lợi nhuận', 'Số khách hàng x Tỉ lệ churn x Ngân sách quảng cáo'], correctIndex: 1, explanation: 'CLV cơ bản = Giá trị đơn hàng trung bình x Tần suất mua x Vòng đời khách hàng.' },
  { id: 'q2', question: '1.000 khách hàng đầu tháng, 50 người rời đi trong tháng. Tỉ lệ churn tháng đó là bao nhiêu?', options: ['0,5%', '5%', '50%', '95%'], correctIndex: 1, explanation: '50/1.000 = 5% churn tháng.' },
  { id: 'q3', question: 'Vì sao churn cao vẫn nguy hiểm dù CLV trung bình mỗi khách hàng cao?', options: ['Vì CLV và churn không liên quan gì đến nhau', 'Vì churn cao khiến khách hàng rời đi trước khi tạo đủ giá trị vòng đời đã ước tính, phá huỷ CLV thực tế', 'Vì churn chỉ ảnh hưởng doanh thu ngắn hạn, không ảnh hưởng CLV', 'Vì CLV luôn được tính lại mỗi tháng nên không bị ảnh hưởng'], correctIndex: 1, explanation: 'CLV giả định khách hàng tiếp tục mua trong "vòng đời" ước tính; churn cao cắt ngắn vòng đời thật, nên giá trị thực thu về thấp hơn CLV lý thuyết.' },
]);

const c6 = doc('edc301-6-1-sentiment-voc', '6.1 — Sentiment analysis & Voice of Customer|||6.1 — Phân tích cảm xúc & Voice of Customer (VoC)',
  'Kênh VoC (review, khảo sát, mạng xã hội); phân tích cảm xúc (positive/negative/neutral) bằng NLP; chỉ số NPS & CSAT.',
  [[
    `<span class="eyebrow">EDC301 · Chapter 6 · Lesson 6.1</span>
<h2>Sentiment analysis &amp; Voice of Customer (VoC)</h2>
<h3>Voice of Customer channels</h3>
<p><strong>VoC</strong> is everything customers say about the business, in their own words: product reviews, support tickets, social media mentions, survey open-text answers, call-center transcripts. Unlike RFM/CLV (which describe WHAT customers do), VoC captures WHY — in their own language.</p>
<h3>Sentiment analysis</h3>
<p><strong>Sentiment analysis</strong> uses NLP (Natural Language Processing) to classify text as <strong>positive</strong>, <strong>negative</strong>, or <strong>neutral</strong> — turning thousands of unstructured comments into a trend a manager can track over time (e.g. "negative sentiment about delivery speed jumped 20% this month").</p>
<pre><code>"Delivery was late again, third time this month."   -> Negative
"Great product, works exactly as described."         -> Positive
"I ordered the blue one, size M."                     -> Neutral
</code></pre>
<h3>Two standard VoC metrics</h3>
<pre><code>NPS (Net Promoter Score)
 "How likely are you to recommend us?" (0-10)
 Promoters (9-10) - Detractors (0-6) = NPS   (Passives 7-8 excluded from the calc)

CSAT (Customer Satisfaction Score)
 "How satisfied were you with this interaction?" (e.g. 1-5)
 % of respondents answering satisfied/very satisfied
</code></pre>
<p><strong>NPS</strong> measures loyalty at the relationship level; <strong>CSAT</strong> measures satisfaction with a single interaction (e.g. one support ticket). Both are quantitative summaries — sentiment analysis on the open-text answers explains WHY the score is what it is.</p>
<div class="callout"><span class="badge">Numbers alone hide the reason</span> An NPS score tells you loyalty went down. Sentiment analysis on the comments tells you it's because of a specific shipping change — the difference between "something is wrong" and "here is what to fix."</div>`,
    `<span class="eyebrow">EDC301 · Chương 6 · Bài 6.1</span>
<h2>Phân tích cảm xúc &amp; Voice of Customer (VoC)</h2>
<h3>Kênh Voice of Customer</h3>
<p><strong>VoC</strong> là mọi điều khách hàng nói về doanh nghiệp, bằng lời của chính họ: đánh giá sản phẩm, ticket hỗ trợ, nhắc tên trên mạng xã hội, câu trả lời mở trong khảo sát, bản ghi cuộc gọi trung tâm hỗ trợ. Khác với RFM/CLV (mô tả khách hàng làm GÌ), VoC nắm được TẠI SAO — bằng chính ngôn ngữ của họ.</p>
<h3>Phân tích cảm xúc</h3>
<p><strong>Phân tích cảm xúc (sentiment analysis)</strong> dùng NLP (xử lý ngôn ngữ tự nhiên) để phân loại văn bản thành <strong>tích cực</strong>, <strong>tiêu cực</strong>, hoặc <strong>trung tính</strong> — biến hàng nghìn bình luận không cấu trúc thành một xu hướng mà quản lý theo dõi được theo thời gian (vd "cảm xúc tiêu cực về tốc độ giao hàng tăng 20% tháng này").</p>
<pre><code>"Giao hàng lại trễ, lần thứ ba trong tháng này."     -> Tiêu cực
"Sản phẩm tuyệt vời, đúng như mô tả."                 -> Tích cực
"Tôi đặt màu xanh, size M."                            -> Trung tính
</code></pre>
<h3>Hai chỉ số VoC chuẩn</h3>
<pre><code>NPS (Net Promoter Score)
 "Bạn sẵn sàng giới thiệu chúng tôi tới mức nào?" (0-10)
 Người ủng hộ (9-10) - Người phản đối (0-6) = NPS   (Người trung lập 7-8 không tính)

CSAT (Customer Satisfaction Score)
 "Bạn hài lòng thế nào với lần tương tác này?" (vd 1-5)
 % người trả lời hài lòng/rất hài lòng
</code></pre>
<p><strong>NPS</strong> đo mức trung thành ở tầm quan hệ tổng thể; <strong>CSAT</strong> đo mức hài lòng với một tương tác đơn lẻ (vd một ticket hỗ trợ). Cả hai là tổng hợp định lượng — phân tích cảm xúc trên câu trả lời mở giải thích TẠI SAO điểm số lại như vậy.</p>
<div class="callout"><span class="badge">Chỉ số một mình giấu đi lý do</span> Điểm NPS cho biết mức trung thành giảm. Phân tích cảm xúc trên bình luận cho biết đó là vì một thay đổi vận chuyển cụ thể — khác biệt giữa "có điều gì đó sai" và "đây là thứ cần sửa".</div>`,
  ]]);

const c6q = quiz('edc301-quiz-6', 'Quiz 6 — Sentiment & VoC|||Quiz 6 — Cảm xúc & VoC', [
  { id: 'q1', question: 'Voice of Customer (VoC) chủ yếu nắm bắt điều gì?', options: ['Số liệu giao dịch (ngày, số lần, số tiền mua)', 'Lời khách hàng tự nói về doanh nghiệp (review, khảo sát, mạng xã hội)', 'Cấu trúc tổ chức nội bộ công ty', 'Giá vốn hàng bán'], correctIndex: 1, explanation: 'VoC là toàn bộ điều khách hàng phát biểu bằng lời của chính họ về trải nghiệm.' },
  { id: 'q2', question: 'NPS được tính bằng cách nào?', options: ['Tổng điểm khảo sát chia số người trả lời', '% Người ủng hộ (9-10) trừ % Người phản đối (0-6)', 'Số lượt mua chia số khách hàng', 'Doanh thu chia số nhân viên hỗ trợ'], correctIndex: 1, explanation: 'NPS = %Promoters - %Detractors, loại người trung lập (7-8) khỏi phép tính.' },
  { id: 'q3', question: 'Vì sao chỉ nhìn điểm NPS/CSAT thường không đủ để biết cách khắc phục?', options: ['Vì hai chỉ số này luôn sai', 'Vì chúng là tổng hợp định lượng, không giải thích TẠI SAO — cần phân tích cảm xúc trên câu trả lời mở để biết nguyên nhân cụ thể', 'Vì NPS và CSAT đo cùng một thứ nên dư thừa', 'Vì chỉ số này không liên quan đến khách hàng thật'], correctIndex: 1, explanation: 'Điểm số cho biết CÓ vấn đề; phân tích cảm xúc trên văn bản mở cho biết vấn đề CỤ THỂ là gì để sửa đúng chỗ.' },
]);

const c7 = doc('edc301-7-1-personalization-recommendation', '7.1 — Personalization & data-driven recommendations|||7.1 — Cá nhân hoá & khuyến nghị dựa trên dữ liệu',
  'Recommendation engine: collaborative filtering vs content-based; ví dụ Amazon/Netflix; kiểm chứng cá nhân hoá bằng A/B testing.',
  [[
    `<span class="eyebrow">EDC301 · Chapter 7 · Lesson 7.1</span>
<h2>Personalization &amp; data-driven recommendations</h2>
<h3>Two core recommendation approaches</h3>
<ul>
<li><strong>Collaborative filtering</strong> — recommends items based on what <em>similar customers</em> liked or bought ("customers who bought X also bought Y"). It doesn't need to understand the product itself, only patterns across many customers.</li>
<li><strong>Content-based filtering</strong> — recommends items <em>similar in attributes</em> to what this specific customer already liked (same genre, same category, same brand).</li>
</ul>
<pre><code>Collaborative:  "Users like YOU also bought/watched this"  (needs many users' data)
Content-based:  "This item is SIMILAR to what YOU liked"    (needs item attributes)
</code></pre>
<h3>Real-world examples</h3>
<p><strong>Amazon's</strong> "customers who bought this also bought" is a classic collaborative-filtering pattern. <strong>Netflix's</strong> recommendation engine blends both — collaborative signals (viewing patterns across similar users) and content signals (genre, actors, themes) — which is why two people with different tastes get very different rows on the same homepage.</p>
<h3>Validating personalization: A/B testing</h3>
<p>Personalization is a hypothesis, not a guarantee — always validate with an <strong>A/B test</strong>: show version A (no/generic recommendation) to one random group, version B (personalized) to another, and measure the actual difference in a business metric (click-through, conversion, revenue) before rolling it out to everyone.</p>
<div class="callout"><span class="badge">Personalization needs the earlier chapters</span> A recommendation engine is only as good as the data feeding it — unified customer profiles (CDP), accurate segments (RFM), and journey/behavior data are the raw material personalization runs on.</div>`,
    `<span class="eyebrow">EDC301 · Chương 7 · Bài 7.1</span>
<h2>Cá nhân hoá &amp; khuyến nghị dựa trên dữ liệu</h2>
<h3>Hai cách tiếp cận khuyến nghị cốt lõi</h3>
<ul>
<li><strong>Collaborative filtering (lọc cộng tác)</strong> — khuyến nghị dựa trên điều <em>khách hàng tương tự</em> đã thích hoặc mua ("khách hàng mua X cũng mua Y"). Không cần hiểu bản chất sản phẩm, chỉ cần mẫu hình từ nhiều khách hàng.</li>
<li><strong>Content-based filtering (lọc theo nội dung)</strong> — khuyến nghị sản phẩm <em>tương tự về đặc tính</em> với thứ khách hàng cụ thể này đã thích (cùng thể loại, cùng danh mục, cùng hãng).</li>
</ul>
<pre><code>Collaborative:  "Người dùng GIỐNG BẠN cũng mua/xem thứ này"  (cần dữ liệu nhiều người dùng)
Content-based:  "Sản phẩm này GIỐNG thứ BẠN đã thích"          (cần đặc tính sản phẩm)
</code></pre>
<h3>Ví dụ thực tế</h3>
<p>"Khách hàng mua sản phẩm này cũng mua" của <strong>Amazon</strong> là mẫu hình collaborative filtering kinh điển. Cỗ máy khuyến nghị của <strong>Netflix</strong> pha trộn cả hai — tín hiệu cộng tác (mẫu hình xem của người dùng tương tự) và tín hiệu nội dung (thể loại, diễn viên, chủ đề) — đây là lý do hai người khác gu vẫn thấy các hàng gợi ý khác nhau trên cùng trang chủ.</p>
<h3>Kiểm chứng cá nhân hoá: A/B testing</h3>
<p>Cá nhân hoá là một giả thuyết, không phải chắc chắn đúng — luôn kiểm chứng bằng <strong>A/B test</strong>: cho nhóm ngẫu nhiên A xem phiên bản không/khuyến nghị chung, nhóm B xem phiên bản cá nhân hoá, và đo sự khác biệt thật trên một chỉ số kinh doanh (tỉ lệ click, chuyển đổi, doanh thu) trước khi triển khai cho mọi người.</p>
<div class="callout"><span class="badge">Cá nhân hoá cần các chương trước</span> Một cỗ máy khuyến nghị chỉ tốt bằng dữ liệu nuôi nó — hồ sơ khách hàng thống nhất (CDP), phân khúc chính xác (RFM), và dữ liệu hành trình/hành vi là nguyên liệu thô mà cá nhân hoá vận hành trên đó.</div>`,
  ]]);

const c7q = quiz('edc301-quiz-7', 'Quiz 7 — Personalization & recommendations|||Quiz 7 — Cá nhân hoá & khuyến nghị', [
  { id: 'q1', question: '"Khách hàng mua X cũng mua Y" là ví dụ điển hình của phương pháp khuyến nghị nào?', options: ['Content-based filtering', 'Collaborative filtering', 'Phân tích cảm xúc', 'RFM'], correctIndex: 1, explanation: 'Đây là collaborative filtering — dựa trên hành vi của nhiều khách hàng tương tự.' },
  { id: 'q2', question: 'Content-based filtering khuyến nghị sản phẩm dựa trên điều gì?', options: ['Hành vi mua của khách hàng khác', 'Đặc tính của sản phẩm tương tự với thứ khách hàng này đã thích', 'Giá sản phẩm rẻ nhất', 'Thời gian đăng ký tài khoản'], correctIndex: 1, explanation: 'Content-based dựa trên thuộc tính/đặc tính sản phẩm giống với sở thích đã biết của khách hàng đó.' },
  { id: 'q3', question: 'Vì sao cần A/B test trước khi triển khai một tính năng cá nhân hoá cho toàn bộ khách hàng?', options: ['Vì A/B test là bắt buộc theo luật', 'Vì cá nhân hoá chỉ là giả thuyết — cần đo khác biệt thật trên chỉ số kinh doanh trước khi tin nó hiệu quả', 'Vì A/B test giúp tăng doanh thu ngay lập tức', 'Vì không cần A/B test nếu dùng collaborative filtering'], correctIndex: 1, explanation: 'A/B test kiểm chứng bằng dữ liệu thật rằng cá nhân hoá thực sự cải thiện chỉ số, trước khi rủi ro triển khai đại trà.' },
]);

const c8 = doc('edc301-8-1-ethics-privacy-reporting', '8.1 — Data ethics, privacy & reporting insight for decisions|||8.1 — Đạo đức dữ liệu, quyền riêng tư & báo cáo insight ra quyết định',
  'Nguyên tắc quyền riêng tư (consent, tối thiểu hoá dữ liệu, GDPR); dùng dữ liệu có đạo đức (tránh thiên lệch); biến insight thành báo cáo hành động được.',
  [[
    `<span class="eyebrow">EDC301 · Chapter 8 · Lesson 8.1</span>
<h2>Data ethics, privacy &amp; reporting insight for decisions</h2>
<h3>Privacy principles</h3>
<ul>
<li><strong>Consent</strong> — customers must knowingly agree to how their data is collected and used, not have it assumed.</li>
<li><strong>Data minimization</strong> — collect only what is actually needed for a stated purpose, not "everything, just in case."</li>
<li><strong>GDPR</strong> (EU's General Data Protection Regulation) codifies these into legal rights — access, correction, deletion ("right to be forgotten") — and is the reference regulation most privacy frameworks worldwide follow or benchmark against.</li>
</ul>
<h3>Ethical use of customer data</h3>
<p>Even legal data use can be unethical: a segmentation model can encode <strong>bias</strong> (e.g. systematically pricing or targeting one demographic unfairly if the training data reflects past discrimination), and personalization can cross into manipulation if it exploits vulnerability rather than genuinely serving the customer. Ethical analytics means being <strong>transparent</strong> about what data is used and why, and periodically checking models for unintended discriminatory patterns.</p>
<h3>From insight to a decision-ready report</h3>
<p>Insight that stays in an analyst's spreadsheet changes nothing. A good insight report:</p>
<pre><code>1. Leads with the business question, not the dataset
2. States the insight in one sentence a non-analyst understands
3. Shows the evidence (chart/number) that supports it
4. Recommends a specific, actionable next step
5. Names what decision it is meant to inform
</code></pre>
<div class="callout"><span class="badge">The whole course, in one habit</span> Every chapter — data sources, segments, journey, CLV, VoC, personalization — exists to answer one question well: what should we DO differently for this customer, and can we defend that recommendation ethically and with evidence?</div>`,
    `<span class="eyebrow">EDC301 · Chương 8 · Bài 8.1</span>
<h2>Đạo đức dữ liệu, quyền riêng tư &amp; báo cáo insight ra quyết định</h2>
<h3>Nguyên tắc quyền riêng tư</h3>
<ul>
<li><strong>Sự đồng ý (consent)</strong> — khách hàng phải biết và đồng ý về cách dữ liệu của họ được thu thập và dùng, không được mặc định coi là đã đồng ý.</li>
<li><strong>Tối thiểu hoá dữ liệu (data minimization)</strong> — chỉ thu thập những gì thực sự cần cho một mục đích đã nêu, không phải "thu hết, để dự phòng".</li>
<li><strong>GDPR</strong> (Quy định bảo vệ dữ liệu chung của EU) luật hoá các nguyên tắc trên thành quyền pháp lý — truy cập, sửa, xoá ("quyền được lãng quên") — và là quy định tham chiếu mà hầu hết khung quyền riêng tư trên thế giới theo hoặc lấy làm chuẩn.</li>
</ul>
<h3>Dùng dữ liệu khách hàng có đạo đức</h3>
<p>Ngay cả việc dùng dữ liệu hợp pháp vẫn có thể phi đạo đức: một mô hình phân khúc có thể mang <strong>thiên lệch (bias)</strong> (vd định giá hoặc nhắm mục tiêu bất công có hệ thống với một nhóm nhân khẩu học nếu dữ liệu huấn luyện phản ánh sự phân biệt trong quá khứ), và cá nhân hoá có thể trở thành thao túng nếu nó khai thác điểm yếu thay vì thực sự phục vụ khách hàng. Phân tích có đạo đức nghĩa là <strong>minh bạch</strong> về dữ liệu nào được dùng và vì sao, và định kỳ kiểm tra mô hình để tìm mẫu hình phân biệt không chủ ý.</p>
<h3>Từ insight tới báo cáo sẵn sàng ra quyết định</h3>
<p>Insight nằm im trong bảng tính của nhà phân tích không thay đổi được gì. Một báo cáo insight tốt:</p>
<pre><code>1. Mở đầu bằng câu hỏi kinh doanh, không phải bằng bộ dữ liệu
2. Nêu insight trong một câu mà người không chuyên cũng hiểu
3. Cho thấy bằng chứng (biểu đồ/số liệu) hỗ trợ insight đó
4. Đề xuất một bước hành động tiếp theo cụ thể, làm được
5. Nêu rõ insight này nhằm phục vụ quyết định nào
</code></pre>
<div class="callout"><span class="badge">Cả môn học, gói trong một thói quen</span> Mọi chương — nguồn dữ liệu, phân khúc, hành trình, CLV, VoC, cá nhân hoá — tồn tại để trả lời tốt một câu hỏi: nên LÀM GÌ khác đi cho khách hàng này, và ta có bảo vệ được đề xuất đó bằng đạo đức và bằng chứng không?</div>`,
  ]]);

const c8q = quiz('edc301-quiz-8', 'Quiz 8 — Ethics, privacy & reporting|||Quiz 8 — Đạo đức, quyền riêng tư & báo cáo', [
  { id: 'q1', question: '"Data minimization" (tối thiểu hoá dữ liệu) nghĩa là gì?', options: ['Thu thập càng nhiều dữ liệu càng tốt để dự phòng', 'Chỉ thu thập dữ liệu thực sự cần cho một mục đích đã nêu rõ', 'Xoá toàn bộ dữ liệu sau mỗi giao dịch', 'Chỉ áp dụng cho dữ liệu tài chính'], correctIndex: 1, explanation: 'Nguyên tắc tối thiểu hoá: chỉ thu thập những gì cần cho mục đích cụ thể, không thu "để dự phòng".' },
  { id: 'q2', question: 'Vì sao một mô hình phân khúc/khuyến nghị vẫn có thể phi đạo đức dù việc dùng dữ liệu là hợp pháp?', options: ['Vì mô hình luôn hợp pháp thì luôn công bằng', 'Vì mô hình có thể mang thiên lệch (bias) từ dữ liệu huấn luyện, dẫn tới đối xử bất công với một nhóm khách hàng', 'Vì đạo đức không liên quan tới dữ liệu', 'Vì GDPR đã loại bỏ hoàn toàn khả năng thiên lệch'], correctIndex: 1, explanation: 'Hợp pháp không đồng nghĩa công bằng — dữ liệu huấn luyện phản ánh thiên lệch quá khứ có thể khiến mô hình đối xử bất công.' },
  { id: 'q3', question: 'Một báo cáo insight "sẵn sàng ra quyết định" cần có yếu tố nào sau đây?', options: ['Chỉ cần liệt kê toàn bộ dữ liệu thô', 'Một đề xuất hành động cụ thể và nêu rõ quyết định mà insight phục vụ', 'Càng nhiều biểu đồ càng tốt, không cần kết luận', 'Không cần nêu câu hỏi kinh doanh ban đầu'], correctIndex: 1, explanation: 'Báo cáo tốt phải dẫn tới hành động cụ thể và nêu rõ nó phục vụ quyết định nào, không chỉ trình bày dữ liệu.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'EDC301',
    slug: 'edc301-digital-customer-insight-and-analytics',
    title: 'Digital Customer Insight and Analytics',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/EDC301.webp',
    shortDescription: 'Turning customer data into decisions — data sources & CDP/CRM, RFM segmentation, customer journey, lifetime value & churn, voice of customer, personalization, data ethics & reporting. Bilingual, with worked examples & quizzes.|||Biến dữ liệu khách hàng thành quyết định — nguồn dữ liệu & CDP/CRM, phân khúc RFM, hành trình khách hàng, CLV & churn, tiếng nói khách hàng, cá nhân hoá, đạo đức dữ liệu & báo cáo. Song ngữ, có ví dụ & quiz.',
    description: 'Môn <strong>EDC301 — Digital Customer Insight and Analytics</strong> (kỳ 5) giúp biến <strong>dữ liệu khách hàng</strong> thành <strong>insight</strong> doanh nghiệp số hành động được. Từ <strong>tổng quan customer insight</strong> (tháp dữ liệu→thông tin→insight→hành động, customer centricity) → <strong>nguồn dữ liệu &amp; CDP/CRM</strong> → <strong>phân khúc khách hàng (RFM)</strong> → <strong>customer journey &amp; hành vi số</strong> → <strong>CLV &amp; churn</strong> → <strong>phân tích cảm xúc &amp; Voice of Customer</strong> → <strong>cá nhân hoá &amp; khuyến nghị</strong> → <strong>đạo đức dữ liệu, quyền riêng tư &amp; báo cáo insight ra quyết định</strong>. Bám giáo trình (Fader, Kumar, Google Analytics/CDP), song ngữ, có ví dụ tính toán và quiz mỗi chương.',
    whatYouLearn: 'Tháp dữ liệu→thông tin→insight→hành động; customer centricity; 4 mức trưởng thành phân tích; first/second/third-party data; CDP (identity resolution) vs CRM; phân khúc RFM & cách chấm điểm; hành trình khách hàng, omnichannel, clickstream & funnel; CLV & tỉ lệ churn; NPS/CSAT & phân tích cảm xúc (VoC); collaborative vs content-based recommendation; A/B testing; GDPR, consent, data minimization, thiên lệch (bias); viết báo cáo insight ra quyết định.',
    requirements: 'Kiến thức marketing/kinh doanh nền tảng (không yêu cầu lập trình). Nên biết đọc bảng tính (Excel/Google Sheets) để làm ví dụ RFM & CLV.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách (Fader, Kumar), tài liệu Google Analytics/CDP, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Customer insight là gì, tháp dữ liệu→thông tin→insight→hành động.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan customer insight|||Chapter 1 — Customer insight overview', description: 'Data/information/insight/action, customer centricity, 4 mức trưởng thành phân tích.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Nguồn dữ liệu & CDP/CRM|||Chapter 2 — Data sources & CDP/CRM', description: 'First/second/third-party data, CDP vs CRM, Google Analytics.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Phân khúc khách hàng (RFM)|||Chapter 3 — Customer segmentation (RFM)', description: 'Cơ sở phân khúc, mô hình RFM, chấm điểm & ứng dụng.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Hành trình & hành vi số|||Chapter 4 — Customer journey & digital behavior', description: 'Giai đoạn hành trình, omnichannel, clickstream, funnel, drop-off.', lessons: [c4, c4q] },
    { title: 'Chương 5 — CLV & churn|||Chapter 5 — Customer lifetime value & churn', description: 'Công thức CLV, tỉ lệ churn, tín hiệu dự báo churn.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Cảm xúc & Voice of Customer|||Chapter 6 — Sentiment & Voice of Customer', description: 'Kênh VoC, phân tích cảm xúc, NPS/CSAT.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Cá nhân hoá & khuyến nghị|||Chapter 7 — Personalization & recommendations', description: 'Collaborative vs content-based, Amazon/Netflix, A/B testing.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Đạo đức dữ liệu & báo cáo insight|||Chapter 8 — Data ethics & reporting insight', description: 'GDPR, consent, tối thiểu hoá dữ liệu, thiên lệch, báo cáo ra quyết định.', lessons: [c8, c8q] },
  ],
};
