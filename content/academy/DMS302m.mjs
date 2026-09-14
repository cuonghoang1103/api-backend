/**
 * DMS302m — Digital Marketing Strategy. Giáo trình tham khảo: Chaffey &
 * Ellis-Chadwick "Digital Marketing"; Kotler "Marketing 5.0"; Kingsnorth
 * "Digital Marketing Strategy"; Google/HubSpot Academy. Song ngữ + ví dụ +
 * quiz. Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('dms302m-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình (FLM), sách tham khảo, khoá học chính thức miễn phí (Google/HubSpot), công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">DMS302m · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Digital Marketing Strategy — planning frameworks, customer research, content, SEO/SEM, social, email/CRM automation, paid media and measurement — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for DMS302m are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><em>Digital Marketing: Strategy, Implementation and Practice</em> — Dave Chaffey &amp; Fiona Ellis-Chadwick (source of the RACE planning framework).</li>
<li><em>Marketing 5.0: Technology for Humanity</em> — Philip Kotler, Hermawan Kartajaya &amp; Iwan Setiawan.</li>
<li><em>Digital Marketing Strategy: An Integrated Approach to Online Marketing</em> — Simon Kingsnorth.</li>
</ul>
<h3>🌐 Official / free courses</h3>
<ul>
<li><a href="https://www.smartinsights.com/" target="_blank" rel="noopener">Smart Insights</a> — Dave Chaffey's site; RACE framework &amp; digital marketing planning templates.</li>
<li><a href="https://academy.hubspot.com/" target="_blank" rel="noopener">HubSpot Academy</a> — free certifications: Content Marketing, Email Marketing, Inbound.</li>
<li><a href="https://learndigital.withgoogle.com/digitalgarage" target="_blank" rel="noopener">Google Digital Garage</a> — free "Fundamentals of Digital Marketing" course &amp; certificate.</li>
<li><a href="https://skillshop.withgoogle.com/" target="_blank" rel="noopener">Google Skillshop</a> — official Google Ads &amp; Analytics certifications.</li>
<li><a href="https://moz.com/beginners-guide-to-seo" target="_blank" rel="noopener">Moz — Beginner's Guide to SEO</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@HubSpot" target="_blank" rel="noopener">HubSpot</a> — inbound &amp; content marketing tutorials</li>
<li><a href="https://www.youtube.com/@NeilPatel" target="_blank" rel="noopener">Neil Patel</a> — SEO, SEM &amp; growth marketing</li>
</ul>
<h3>🛠️ Tools (free tiers)</h3>
<ul>
<li><a href="https://trends.google.com/" target="_blank" rel="noopener">Google Trends</a> — search demand &amp; seasonality</li>
<li><a href="https://ads.google.com/home/tools/keyword-planner/" target="_blank" rel="noopener">Google Keyword Planner</a> — keyword research &amp; volume</li>
<li><a href="https://analytics.google.com/" target="_blank" rel="noopener">Google Analytics</a> — traffic &amp; conversion measurement</li>
<li><a href="https://www.canva.com/" target="_blank" rel="noopener">Canva</a> — content &amp; ad creative</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — RACE framework, SOSTAC planning, customer personas &amp; journey.</li>
<li><strong>Practice</strong> — draft a content calendar, run a keyword audit, mock up an ad campaign budget.</li>
<li><strong>Go deeper</strong> — SEO/SEM, social &amp; influencer, email automation, programmatic advertising.</li>
<li><strong>Job-ready</strong> — get Google Digital Garage + HubSpot certificates; build a full integrated digital marketing plan.</li>
</ol></div>`,
    `<span class="eyebrow">DMS302m · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Chiến lược Marketing số — khung lập kế hoạch, nghiên cứu khách hàng, content, SEO/SEM, social, email/CRM tự động hoá và quảng cáo trả tiền — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của DMS302m có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><em>Digital Marketing: Strategy, Implementation and Practice</em> — Dave Chaffey &amp; Fiona Ellis-Chadwick (nguồn gốc khung lập kế hoạch RACE).</li>
<li><em>Marketing 5.0: Technology for Humanity</em> — Philip Kotler, Hermawan Kartajaya &amp; Iwan Setiawan.</li>
<li><em>Digital Marketing Strategy: An Integrated Approach to Online Marketing</em> — Simon Kingsnorth.</li>
</ul>
<h3>🌐 Khoá học chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.smartinsights.com/" target="_blank" rel="noopener">Smart Insights</a> — trang của Dave Chaffey; khung RACE &amp; mẫu lập kế hoạch marketing số.</li>
<li><a href="https://academy.hubspot.com/" target="_blank" rel="noopener">HubSpot Academy</a> — chứng chỉ miễn phí: Content Marketing, Email Marketing, Inbound.</li>
<li><a href="https://learndigital.withgoogle.com/digitalgarage" target="_blank" rel="noopener">Google Digital Garage</a> — khoá "Fundamentals of Digital Marketing" miễn phí, có chứng chỉ.</li>
<li><a href="https://skillshop.withgoogle.com/" target="_blank" rel="noopener">Google Skillshop</a> — chứng chỉ chính thức Google Ads &amp; Analytics.</li>
<li><a href="https://moz.com/beginners-guide-to-seo" target="_blank" rel="noopener">Moz — Beginner's Guide to SEO</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@HubSpot" target="_blank" rel="noopener">HubSpot</a> — hướng dẫn inbound &amp; content marketing</li>
<li><a href="https://www.youtube.com/@NeilPatel" target="_blank" rel="noopener">Neil Patel</a> — SEO, SEM &amp; tăng trưởng</li>
</ul>
<h3>🛠️ Công cụ (bản miễn phí)</h3>
<ul>
<li><a href="https://trends.google.com/" target="_blank" rel="noopener">Google Trends</a> — nhu cầu tìm kiếm &amp; tính mùa vụ</li>
<li><a href="https://ads.google.com/home/tools/keyword-planner/" target="_blank" rel="noopener">Google Keyword Planner</a> — nghiên cứu &amp; ước lượng khối lượng từ khoá</li>
<li><a href="https://analytics.google.com/" target="_blank" rel="noopener">Google Analytics</a> — đo traffic &amp; chuyển đổi</li>
<li><a href="https://www.canva.com/" target="_blank" rel="noopener">Canva</a> — thiết kế content &amp; ad creative</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — khung RACE, lập kế hoạch SOSTAC, persona &amp; hành trình khách hàng.</li>
<li><strong>Luyện tập</strong> — dựng content calendar, làm audit từ khoá, phác ngân sách một chiến dịch ads.</li>
<li><strong>Đào sâu</strong> — SEO/SEM, social &amp; influencer, tự động hoá email, quảng cáo programmatic.</li>
<li><strong>Sẵn sàng đi làm</strong> — lấy chứng chỉ Google Digital Garage + HubSpot; dựng một kế hoạch marketing số tích hợp hoàn chỉnh.</li>
</ol></div>`,
  ]]);

const intro = doc('dms302m-0-1-overview', 'Course overview: Digital Marketing Strategy|||Tổng quan: Chiến lược Marketing số',
  'Marketing số là gì và khác marketing truyền thống ở đâu; lộ trình: RACE & lập kế hoạch → nghiên cứu & persona → content → SEO/SEM → social & influencer → email/CRM → quảng cáo số → đo lường & tối ưu.',
  [[
    `<span class="eyebrow">DMS302m · Lesson 0.1 · Overview</span>
<h2>Digital Marketing Strategy</h2>
<p class="lead">This course helps you understand <strong>how to plan and run a coherent digital marketing strategy</strong> — not just "post on social media", but a structured process: research your market and customers, build a content and channel plan, execute across search, social, email and paid media, then measure and optimize with real data.</p>
<h3>Why "strategy", not just "tactics"</h3>
<ul>
<li><strong>Tactics</strong> — running an ad, posting on Instagram, sending an email. Easy to copy, easy to do randomly.</li>
<li><strong>Strategy</strong> — deciding <em>which</em> channels, <em>for whom</em>, with <em>what budget</em> and <em>what goal</em>, before any tactic runs. This is what separates marketing that compounds from marketing that just spends money.</li>
</ul>
<h3>Roadmap</h3>
<p>Strategy &amp; the RACE framework (Reach-Act-Convert-Engage) → market &amp; customer research, digital personas → content marketing → SEO &amp; SEM (search) → social media &amp; influencer marketing → email, marketing automation &amp; CRM → digital advertising (display, video, programmatic) &amp; budget → measurement, KPIs/ROI &amp; an integrated plan.</p>
<div class="callout"><span class="badge">Exam anchor</span> Every chapter maps to a real deliverable of a digital marketing plan — by the end you can draft one end-to-end, which is exactly what the FLM syllabus and most exam case studies ask for.</div>`,
    `<span class="eyebrow">DMS302m · Bài 0.1 · Tổng quan</span>
<h2>Chiến lược Marketing số</h2>
<p class="lead">Môn này giúp bạn hiểu <strong>cách lập và triển khai một chiến lược marketing số bài bản</strong> — không chỉ là "đăng bài trên social", mà là một quy trình có cấu trúc: nghiên cứu thị trường &amp; khách hàng, dựng kế hoạch nội dung &amp; kênh, triển khai trên search, social, email và quảng cáo trả tiền, rồi đo lường &amp; tối ưu bằng dữ liệu thật.</p>
<h3>Vì sao là "chiến lược", không chỉ "tactic"</h3>
<ul>
<li><strong>Tactic</strong> — chạy một ads, đăng Instagram, gửi một email. Dễ bắt chước, dễ làm ngẫu nhiên.</li>
<li><strong>Chiến lược</strong> — quyết định <em>kênh nào</em>, <em>cho ai</em>, với <em>ngân sách nào</em> và <em>mục tiêu nào</em>, trước khi chạy bất kỳ tactic nào. Đây là điều phân biệt marketing tích luỹ được kết quả với marketing chỉ tiêu tiền.</li>
</ul>
<h3>Lộ trình</h3>
<p>Chiến lược &amp; khung RACE (Reach-Act-Convert-Engage) → nghiên cứu thị trường &amp; khách hàng, persona số → content marketing → SEO &amp; SEM (tìm kiếm) → social media &amp; influencer marketing → email, marketing automation &amp; CRM → quảng cáo số (display, video, programmatic) &amp; ngân sách → đo lường, KPI/ROI &amp; kế hoạch tích hợp.</p>
<div class="callout"><span class="badge">Điểm tựa thi</span> Mỗi chương ứng với một sản phẩm thật của một bản kế hoạch marketing số — học xong bạn dựng được một bản hoàn chỉnh từ đầu đến cuối, đúng như syllabus FLM và hầu hết đề case study yêu cầu.</div>`,
  ]]);

const c1 = doc('dms302m-1-1-race-framework', '1.1 — Digital marketing strategy & the RACE framework|||1.1 — Chiến lược marketing số & mô hình RACE',
  'RACE (Reach-Act-Convert-Engage); SOSTAC để lập kế hoạch; mục tiêu SMART; digital marketing plan gồm những gì.',
  [[
    `<span class="eyebrow">DMS302m · Chapter 1 · Lesson 1.1</span>
<h2>Digital marketing strategy &amp; the RACE framework</h2>
<h3>RACE — plan across the whole customer lifecycle</h3>
<p>Developed by Dave Chaffey (Smart Insights), <strong>RACE</strong> splits digital activity into four stages that mirror how a customer actually meets a brand:</p>
<pre><code>REACH    -> build awareness & traffic (SEO, social, ads, PR)
ACT      -> get interaction on-site/app (content, engagement, leads)
CONVERT  -> turn visitors into customers (checkout, sign-up, sale)
ENGAGE   -> build long-term loyalty (email, community, retention)
</code></pre>
<h3>SOSTAC — the planning skeleton</h3>
<ul>
<li><strong>S</strong>ituation — where are we now? (market, competitors, own performance)</li>
<li><strong>O</strong>bjectives — where do we want to be? (SMART goals)</li>
<li><strong>S</strong>trategy — how, in outline, do we get there?</li>
<li><strong>T</strong>actics — the specific tools/channels used</li>
<li><strong>A</strong>ction — who does what, when</li>
<li><strong>C</strong>ontrol — how do we know it's working? (KPIs, review cadence)</li>
</ul>
<h3>SMART objectives</h3>
<p>Every digital marketing goal should be <strong>S</strong>pecific, <strong>M</strong>easurable, <strong>A</strong>chievable, <strong>R</strong>elevant, <strong>T</strong>ime-bound — e.g. "increase qualified leads from organic search by 20% in Q1" beats "get more traffic".</p>
<div class="callout"><span class="badge">Why this matters</span> RACE gives you the stages; SOSTAC gives you the plan document; SMART gives you the goals. Together they turn "we should do digital marketing" into an actionable, measurable plan — the backbone the rest of this course builds on.</div>`,
    `<span class="eyebrow">DMS302m · Chương 1 · Bài 1.1</span>
<h2>Chiến lược marketing số &amp; mô hình RACE</h2>
<h3>RACE — lập kế hoạch xuyên suốt vòng đời khách hàng</h3>
<p>Do Dave Chaffey (Smart Insights) phát triển, <strong>RACE</strong> chia hoạt động marketing số thành 4 giai đoạn phản ánh cách khách hàng thực sự gặp một thương hiệu:</p>
<pre><code>REACH    -> xây nhận biết & traffic (SEO, social, ads, PR)
ACT      -> tạo tương tác trên site/app (content, engagement, lead)
CONVERT  -> biến khách ghé thăm thành khách hàng (checkout, đăng ký, mua)
ENGAGE   -> xây lòng trung thành dài hạn (email, cộng đồng, giữ chân)
</code></pre>
<h3>SOSTAC — khung xương của bản kế hoạch</h3>
<ul>
<li><strong>S</strong>ituation — hiện đang ở đâu? (thị trường, đối thủ, hiệu suất hiện tại)</li>
<li><strong>O</strong>bjectives — muốn đến đâu? (mục tiêu SMART)</li>
<li><strong>S</strong>trategy — đi đến đó bằng cách nào, ở mức tổng quát?</li>
<li><strong>T</strong>actics — công cụ/kênh cụ thể được dùng</li>
<li><strong>A</strong>ction — ai làm gì, khi nào</li>
<li><strong>C</strong>ontrol — làm sao biết nó đang hiệu quả? (KPI, nhịp đánh giá)</li>
</ul>
<h3>Mục tiêu SMART</h3>
<p>Mọi mục tiêu marketing số nên là <strong>S</strong>pecific (cụ thể), <strong>M</strong>easurable (đo được), <strong>A</strong>chievable (khả thi), <strong>R</strong>elevant (liên quan), <strong>T</strong>ime-bound (có hạn) — vd "tăng 20% lead chất lượng từ organic search trong Q1" tốt hơn "có nhiều traffic hơn".</p>
<div class="callout"><span class="badge">Vì sao quan trọng</span> RACE cho các giai đoạn; SOSTAC cho khung tài liệu kế hoạch; SMART cho mục tiêu. Cùng nhau chúng biến "nên làm marketing số" thành một kế hoạch hành động, đo được — nền tảng cho toàn bộ phần còn lại của môn.</div>`,
  ]]);

const c1q = quiz('dms302m-quiz-1', 'Quiz 1 — Strategy & RACE|||Quiz 1 — Chiến lược & RACE', [
  { id: 'q1', question: 'Mô hình RACE gồm 4 giai đoạn nào?', options: ['Reach - Act - Convert - Engage', 'Research - Analyze - Create - Evaluate', 'Plan - Do - Check - Act', 'Awareness - Interest - Desire - Action'], correctIndex: 0, explanation: 'RACE = Reach (tiếp cận) → Act (tương tác) → Convert (chuyển đổi) → Engage (giữ chân), do Dave Chaffey/Smart Insights phát triển.' },
  { id: 'q2', question: 'Giai đoạn nào của RACE tập trung xây nhận biết & traffic qua SEO, social, ads?', options: ['Convert', 'Engage', 'Reach', 'Act'], correctIndex: 2, explanation: 'Reach là giai đoạn đầu — đưa khách hàng tiềm năng biết đến và ghé thăm thương hiệu.' },
  { id: 'q3', question: 'SOSTAC dùng để làm gì?', options: ['Đo ROI quảng cáo', 'Tối ưu SEO on-page', 'Lập kế hoạch marketing có cấu trúc (Situation-Objectives-Strategy-Tactics-Action-Control)', 'Chấm điểm chất lượng quảng cáo'], correctIndex: 2, explanation: 'SOSTAC là khung lập kế hoạch: từ hiện trạng, mục tiêu, chiến lược, đến hành động và kiểm soát.' },
]);

const c2 = doc('dms302m-2-1-research-persona', '2.1 — Market & customer research, digital personas|||2.1 — Nghiên cứu thị trường, khách hàng & persona số',
  'Nghiên cứu thị trường số, buyer persona, customer journey map, công cụ nghiên cứu miễn phí (Google Trends, khảo sát).',
  [[
    `<span class="eyebrow">DMS302m · Chapter 2 · Lesson 2.1</span>
<h2>Market &amp; customer research, digital personas</h2>
<h3>Why research before tactics</h3>
<p>Every RACE stage needs to know <em>who</em> it's talking to. Skipping research means guessing the message, the channel and the budget — the single biggest cause of wasted ad spend.</p>
<h3>Buyer persona</h3>
<p>A <strong>buyer persona</strong> is a semi-fictional profile of an ideal customer, built from real data and research: demographics, goals, pain points, preferred channels, objections. A B2C course platform might have "Busy Working Professional" and "Career-Switching Student" as two distinct personas — each needs different messaging.</p>
<h3>Customer journey map</h3>
<pre><code>AWARENESS -> CONSIDERATION -> DECISION -> RETENTION -> ADVOCACY
 (sees ad)    (compares)      (buys)      (keeps using)  (recommends)
</code></pre>
<p>Mapping each stage's touchpoints, questions and emotions tells you exactly which content/channel to deploy where — this is what a persona and a journey map feed directly into.</p>
<h3>Research tools</h3>
<ul>
<li><strong>Google Trends</strong> — free search-interest &amp; seasonality data.</li>
<li><strong>Surveys/interviews</strong> — direct qualitative insight from real customers.</li>
<li><strong>Social listening &amp; competitor analysis</strong> — see what's already resonating in your market.</li>
</ul>
<div class="callout"><span class="badge">Rule of thumb</span> If you can't name your persona's #1 pain point and #1 channel in one sentence, the research isn't finished yet.</div>`,
    `<span class="eyebrow">DMS302m · Chương 2 · Bài 2.1</span>
<h2>Nghiên cứu thị trường, khách hàng &amp; persona số</h2>
<h3>Vì sao nghiên cứu trước khi làm tactic</h3>
<p>Mọi giai đoạn RACE đều cần biết <em>đang nói với ai</em>. Bỏ qua nghiên cứu nghĩa là đoán thông điệp, kênh và ngân sách — nguyên nhân lớn nhất khiến tiền quảng cáo bị lãng phí.</p>
<h3>Buyer persona</h3>
<p>Một <strong>buyer persona</strong> là hồ sơ bán hư cấu một phần của khách hàng lý tưởng, dựng từ dữ liệu &amp; nghiên cứu thật: nhân khẩu học, mục tiêu, điểm đau, kênh ưa thích, mối lo ngại. Một nền tảng khoá học B2C có thể có persona "Người đi làm bận rộn" và "Sinh viên đang chuyển ngành" — mỗi persona cần thông điệp khác nhau.</p>
<h3>Bản đồ hành trình khách hàng</h3>
<pre><code>NHẬN BIẾT -> XEM XÉT -> QUYẾT ĐỊNH -> TRUNG THÀNH -> ĐỀ XUẤT
 (thấy ads)   (so sánh)   (mua)        (tiếp tục dùng)  (giới thiệu)
</code></pre>
<p>Vẽ điểm chạm, câu hỏi và cảm xúc của từng giai đoạn cho biết chính xác nên dùng content/kênh nào ở đâu — đây là thứ persona và bản đồ hành trình đưa thẳng vào.</p>
<h3>Công cụ nghiên cứu</h3>
<ul>
<li><strong>Google Trends</strong> — dữ liệu nhu cầu tìm kiếm &amp; tính mùa vụ, miễn phí.</li>
<li><strong>Khảo sát/phỏng vấn</strong> — thông tin định tính trực tiếp từ khách hàng thật.</li>
<li><strong>Social listening &amp; phân tích đối thủ</strong> — xem điều gì đang thực sự hiệu quả trong thị trường của bạn.</li>
</ul>
<div class="callout"><span class="badge">Quy tắc nhanh</span> Nếu không nói được điểm đau số 1 và kênh số 1 của persona trong một câu, nghiên cứu vẫn chưa xong.</div>`,
  ]]);

const c2q = quiz('dms302m-quiz-2', 'Quiz 2 — Research & persona|||Quiz 2 — Nghiên cứu & persona', [
  { id: 'q1', question: 'Buyer persona là gì?', options: ['Bảng giá sản phẩm', 'Hồ sơ bán hư cấu của khách hàng lý tưởng, dựng từ dữ liệu & nghiên cứu', 'KPI của một chiến dịch quảng cáo', 'Sơ đồ tổ chức phòng marketing'], correctIndex: 1, explanation: 'Persona là hồ sơ đại diện khách hàng lý tưởng, xây từ nghiên cứu thật (nhân khẩu học, mục tiêu, điểm đau...).' },
  { id: 'q2', question: 'Customer journey map dùng để làm gì?', options: ['Tính ROI quảng cáo', 'Theo dõi hành trình khách hàng qua các điểm chạm, từ nhận biết đến trung thành', 'Thiết kế logo thương hiệu', 'Lập ngân sách nhân sự'], correctIndex: 1, explanation: 'Journey map vạch ra các giai đoạn & điểm chạm khách hàng trải qua, giúp chọn content/kênh phù hợp từng giai đoạn.' },
  { id: 'q3', question: 'Công cụ nào phổ biến, miễn phí để xem xu hướng tìm kiếm theo thời gian?', options: ['Google Trends', 'Photoshop', 'CRM nội bộ', 'Bảng lương'], correctIndex: 0, explanation: 'Google Trends cho dữ liệu nhu cầu tìm kiếm & tính mùa vụ miễn phí, hữu ích cho nghiên cứu thị trường.' },
]);

const c3 = doc('dms302m-3-1-content-marketing', '3.1 — Content strategy & content marketing|||3.1 — Chiến lược nội dung & content marketing',
  'Content marketing funnel (TOFU-MOFU-BOFU), content calendar, các dạng nội dung, brand voice/tính nhất quán.',
  [[
    `<span class="eyebrow">DMS302m · Chapter 3 · Lesson 3.1</span>
<h2>Content strategy &amp; content marketing</h2>
<h3>Content marketing funnel</h3>
<pre><code>TOFU (Top)    -> educate/entertain, wide reach, no hard sell
                 blog posts, social videos, infographics
MOFU (Middle) -> build trust, compare options
                 case studies, webinars, comparison guides, email nurture
BOFU (Bottom) -> push the decision
                 demos, free trials, testimonials, pricing pages
</code></pre>
<p>Matching content type to funnel stage is the difference between content that engages and content that just sits there.</p>
<h3>Content calendar</h3>
<p>A <strong>content calendar</strong> plans what gets published, where, and when — tied to campaigns, seasonality and each persona's journey stage. It keeps publishing consistent instead of ad-hoc, which search engines and audiences both reward.</p>
<h3>Brand voice &amp; consistency</h3>
<p>A defined <strong>brand voice</strong> (tone, vocabulary, values) keeps every blog post, caption and ad copy recognizably "the same brand" across channels and writers — critical once more than one person creates content.</p>
<div class="callout"><span class="badge">Content ≠ marketing</span> Content marketing only works when it maps to a funnel stage and a distribution plan — "we post because we should" is not a strategy.</div>`,
    `<span class="eyebrow">DMS302m · Chương 3 · Bài 3.1</span>
<h2>Chiến lược nội dung &amp; content marketing</h2>
<h3>Funnel content marketing</h3>
<pre><code>TOFU (Đỉnh)  -> giáo dục/giải trí, tiếp cận rộng, chưa bán trực tiếp
                bài blog, video social, infographic
MOFU (Giữa)  -> xây niềm tin, so sánh lựa chọn
                case study, webinar, bài so sánh, email nuôi dưỡng
BOFU (Đáy)   -> thúc đẩy quyết định
                demo, dùng thử miễn phí, testimonial, trang giá
</code></pre>
<p>Khớp đúng dạng nội dung với đúng giai đoạn funnel là sự khác biệt giữa nội dung thu hút và nội dung nằm im không ai xem.</p>
<h3>Content calendar</h3>
<p>Một <strong>content calendar</strong> lên kế hoạch xuất bản gì, ở đâu, khi nào — gắn với chiến dịch, mùa vụ và giai đoạn hành trình của từng persona. Nó giữ việc xuất bản nhất quán thay vì tuỳ hứng — điều cả công cụ tìm kiếm và người xem đều "thưởng".</p>
<h3>Brand voice &amp; tính nhất quán</h3>
<p>Một <strong>brand voice</strong> (giọng điệu, từ vựng, giá trị) rõ ràng giữ mọi bài blog, caption, ad copy nhận ra được là "cùng một thương hiệu" trên mọi kênh và mọi người viết — quan trọng ngay khi có hơn một người tạo nội dung.</p>
<div class="callout"><span class="badge">Content ≠ marketing</span> Content marketing chỉ hiệu quả khi gắn với một giai đoạn funnel và một kế hoạch phân phối — "đăng vì nên đăng" không phải chiến lược.</div>`,
  ]]);

const c3q = quiz('dms302m-quiz-3', 'Quiz 3 — Content marketing|||Quiz 3 — Content marketing', [
  { id: 'q1', question: 'Mô hình TOFU-MOFU-BOFU biểu diễn điều gì?', options: ['Các bước đăng ký tài khoản', 'Các tầng của funnel nội dung theo giai đoạn nhận biết-xem xét-quyết định', 'Ba loại quảng cáo trả tiền', 'Ba chỉ số đo hiệu suất website'], correctIndex: 1, explanation: 'TOFU (đỉnh, giáo dục) - MOFU (giữa, xây niềm tin) - BOFU (đáy, thúc đẩy quyết định) là 3 tầng funnel content.' },
  { id: 'q2', question: 'Content calendar dùng để làm gì?', options: ['Tính lương nhân viên content', 'Lên kế hoạch & lịch xuất bản nội dung nhất quán theo chiến dịch/persona', 'Thiết kế logo', 'Đăng ký tên miền'], correctIndex: 1, explanation: 'Content calendar giúp việc xuất bản có kế hoạch, gắn với chiến dịch và giai đoạn hành trình khách hàng.' },
  { id: 'q3', question: 'Nội dung ở tầng TOFU (đầu funnel) thường có đặc điểm gì?', options: ['Demo sản phẩm chi tiết kèm giá bán', 'Giáo dục/giải trí, tiếp cận rộng, chưa bán hàng trực tiếp', 'Chỉ dành cho khách đã mua hàng', 'Chỉ gửi qua email cá nhân hoá'], correctIndex: 1, explanation: 'TOFU nhắm tiếp cận rộng và xây nhận biết, không ép bán ngay — ví dụ blog, video giải trí/giáo dục.' },
]);

const c4 = doc('dms302m-4-1-seo-sem', '4.1 — SEO & SEM (search marketing)|||4.1 — SEO & SEM (tiếp thị tìm kiếm)',
  'SEO (on-page/off-page/technical), SEM/PPC, Quality Score, so sánh SEO vs SEM.',
  [[
    `<span class="eyebrow">DMS302m · Chapter 4 · Lesson 4.1</span>
<h2>SEO &amp; SEM (search marketing)</h2>
<h3>SEO — earning organic rankings</h3>
<ul>
<li><strong>On-page</strong> — keywords, title/meta tags, headings, content quality on the page itself.</li>
<li><strong>Off-page</strong> — backlinks &amp; brand mentions from other sites (authority signal).</li>
<li><strong>Technical</strong> — site speed, mobile-friendliness, crawlability, HTTPS.</li>
</ul>
<h3>SEM/PPC — paying for placement</h3>
<p><strong>Search Engine Marketing</strong> (e.g. Google Ads) buys top positions instantly via a real-time auction. Cost-per-click depends on your bid <em>and</em> your <strong>Quality Score</strong> (relevance of keyword, ad copy and landing page) — a higher Quality Score means a lower price for the same position.</p>
<pre><code>SEO                         SEM / PPC
free traffic, slow to build vs paid traffic, results in hours
long-term compounding asset vs stops the moment budget stops
trust signal (organic wins) vs top-of-page control
</code></pre>
<div class="callout"><span class="badge">Use both</span> SEO builds a durable asset; SEM buys immediate visibility while SEO is still ranking — most real strategies run them together, not as a choice of one over the other.</div>`,
    `<span class="eyebrow">DMS302m · Chương 4 · Bài 4.1</span>
<h2>SEO &amp; SEM (tiếp thị tìm kiếm)</h2>
<h3>SEO — giành thứ hạng tự nhiên</h3>
<ul>
<li><strong>On-page</strong> — từ khoá, title/meta tag, heading, chất lượng nội dung ngay trên trang.</li>
<li><strong>Off-page</strong> — backlink &amp; lượt nhắc tới thương hiệu từ trang khác (tín hiệu uy tín).</li>
<li><strong>Technical</strong> — tốc độ trang, thân thiện di động, khả năng crawl, HTTPS.</li>
</ul>
<h3>SEM/PPC — trả tiền để có vị trí</h3>
<p><strong>Search Engine Marketing</strong> (vd Google Ads) mua vị trí đầu ngay lập tức qua đấu giá thời gian thực. Chi phí mỗi click phụ thuộc vào giá bạn đặt <em>và</em> <strong>Quality Score</strong> (độ liên quan của từ khoá, nội dung ad và trang đích) — Quality Score cao hơn nghĩa là giá thấp hơn cho cùng một vị trí.</p>
<pre><code>SEO                            SEM / PPC
traffic miễn phí, xây chậm  vs traffic trả tiền, có kết quả trong vài giờ
tài sản tích luỹ dài hạn    vs dừng ngay khi ngân sách hết
tín hiệu uy tín (thắng tự nhiên) vs kiểm soát vị trí đầu trang
</code></pre>
<div class="callout"><span class="badge">Dùng cả hai</span> SEO xây tài sản lâu dài; SEM mua sự hiện diện ngay trong lúc SEO còn đang leo hạng — hầu hết chiến lược thật chạy cả hai song song, không phải chọn một trong hai.</div>`,
  ]]);

const c4q = quiz('dms302m-quiz-4', 'Quiz 4 — SEO & SEM|||Quiz 4 — SEO & SEM', [
  { id: 'q1', question: 'Sự khác biệt chính giữa SEO và SEM là gì?', options: ['SEO chỉ dùng cho social media', 'SEO là tối ưu tự nhiên (miễn phí, chậm), SEM là trả tiền để có kết quả nhanh', 'SEM không cần từ khoá', 'SEO chỉ áp dụng cho video'], correctIndex: 1, explanation: 'SEO xây thứ hạng organic dài hạn, không trả tiền trực tiếp cho vị trí; SEM/PPC mua vị trí ngay qua đấu giá.' },
  { id: 'q2', question: 'Quality Score trong Google Ads ảnh hưởng đến điều gì?', options: ['Màu sắc của quảng cáo', 'Chi phí mỗi click (CPC) và vị trí hiển thị quảng cáo', 'Số lượng backlink', 'Tốc độ tải trang chủ'], correctIndex: 1, explanation: 'Quality Score đo độ liên quan từ khoá/ad/landing page; cao hơn thường giúp CPC thấp hơn và vị trí tốt hơn.' },
  { id: 'q3', question: 'Ba trụ cột chính của SEO là gì?', options: ['On-page, off-page, technical', 'CPC, CPM, CPA', 'Reach, Act, Convert', 'TOFU, MOFU, BOFU'], correctIndex: 0, explanation: 'SEO gồm tối ưu on-page (nội dung/từ khoá), off-page (backlink) và technical (tốc độ, crawlability, mobile).' },
]);

const c5 = doc('dms302m-5-1-social-influencer', '5.1 — Social media & influencer marketing|||5.1 — Social media & influencer marketing',
  'Chọn nền tảng theo persona, organic vs paid social, engagement rate, các tầng influencer, social listening.',
  [[
    `<span class="eyebrow">DMS302m · Chapter 5 · Lesson 5.1</span>
<h2>Social media &amp; influencer marketing</h2>
<h3>Choosing platforms by persona, not by hype</h3>
<p>Every platform has a different audience and content format. Strategy means matching platform to <em>where your persona already spends time</em> — not "we should be everywhere".</p>
<h3>Organic vs paid social</h3>
<ul>
<li><strong>Organic</strong> — free posts; reach is limited by the algorithm, but builds a durable community.</li>
<li><strong>Paid social</strong> — boosted posts/ads with precise audience targeting; buys reach and speed.</li>
</ul>
<h3>Influencer tiers</h3>
<pre><code>Nano   (1k-10k)    -> highest trust/engagement, cheapest, niche audience
Micro  (10k-100k)  -> strong engagement, still niche-relevant
Macro  (100k-1M)   -> broad reach, lower engagement rate
Mega   (1M+)       -> mass awareness, celebrity-level cost
</code></pre>
<p><strong>Engagement rate</strong> (likes+comments+shares ÷ followers or reach) usually matters more than raw follower count when picking an influencer.</p>
<h3>Social listening</h3>
<p>Monitoring mentions, hashtags and sentiment about your brand (and competitors) across social — catches problems early and surfaces content ideas straight from real conversations.</p>
<div class="callout"><span class="badge">Fit over fame</span> A nano-influencer whose audience matches your persona often outperforms a mega-influencer whose audience doesn't.</div>`,
    `<span class="eyebrow">DMS302m · Chương 5 · Bài 5.1</span>
<h2>Social media &amp; influencer marketing</h2>
<h3>Chọn nền tảng theo persona, không theo trào lưu</h3>
<p>Mỗi nền tảng có đối tượng và dạng nội dung khác nhau. Chiến lược nghĩa là khớp nền tảng với <em>nơi persona của bạn đang thực sự dành thời gian</em> — không phải "nên có mặt ở mọi nơi".</p>
<h3>Organic vs paid social</h3>
<ul>
<li><strong>Organic</strong> — bài đăng miễn phí; reach bị thuật toán hạn chế, nhưng xây cộng đồng bền lâu.</li>
<li><strong>Paid social</strong> — bài đẩy/ads với target đối tượng chính xác; mua reach và tốc độ.</li>
</ul>
<h3>Các tầng influencer</h3>
<pre><code>Nano   (1k-10k)    -> tin cậy/tương tác cao nhất, rẻ nhất, đối tượng ngách
Micro  (10k-100k)  -> tương tác tốt, vẫn liên quan sát ngách
Macro  (100k-1tr)  -> reach rộng, tỷ lệ tương tác thấp hơn
Mega   (1tr+)      -> nhận biết đại chúng, chi phí ngang người nổi tiếng
</code></pre>
<p><strong>Engagement rate</strong> (like+comment+share chia follower hoặc reach) thường quan trọng hơn số follower thô khi chọn influencer.</p>
<h3>Social listening</h3>
<p>Theo dõi lượt nhắc, hashtag và sentiment về thương hiệu (và đối thủ) trên social — bắt vấn đề sớm và tìm ý tưởng content trực tiếp từ hội thoại thật.</p>
<div class="callout"><span class="badge">Phù hợp hơn nổi tiếng</span> Một nano-influencer có đối tượng khớp persona thường hiệu quả hơn một mega-influencer có đối tượng không khớp.</div>`,
  ]]);

const c5q = quiz('dms302m-quiz-5', 'Quiz 5 — Social & influencer|||Quiz 5 — Social & influencer', [
  { id: 'q1', question: 'Micro-influencer thường có đặc điểm gì?', options: ['Luôn có hơn 1 triệu follower', 'Follower vừa phải (khoảng 10k-100k) nhưng tương tác cao & đối tượng ngách rõ', 'Chỉ hoạt động trên truyền hình', 'Không tính phí hợp tác'], correctIndex: 1, explanation: 'Micro-influencer có lượng follower vừa phải nhưng engagement rate cao và đối tượng theo ngách cụ thể.' },
  { id: 'q2', question: 'Engagement rate đo điều gì?', options: ['Số tiền chi cho quảng cáo', 'Tỷ lệ tương tác (like/comment/share) so với follower hoặc reach', 'Số lượng bài đăng mỗi tuần', 'Thời gian tải trang web'], correctIndex: 1, explanation: 'Engagement rate = tổng tương tác chia cho follower/reach, phản ánh mức độ audience thực sự quan tâm.' },
  { id: 'q3', question: 'Social listening là gì?', options: ['Nghe nhạc trong lúc làm content', 'Theo dõi & phân tích các lượt nhắc/thảo luận về thương hiệu trên social', 'Đăng bài tự động theo lịch', 'Trả lời bình luận bằng chatbot'], correctIndex: 1, explanation: 'Social listening giám sát mentions, hashtag, sentiment về brand và đối thủ để bắt vấn đề sớm và tìm ý tưởng content.' },
]);

const c6 = doc('dms302m-6-1-email-automation-crm', '6.1 — Email, marketing automation & CRM|||6.1 — Email, marketing automation & CRM',
  'Xây danh sách, phân khúc (segmentation), drip campaign/automation workflow, CRM & vòng đời khách hàng, chỉ số email.',
  [[
    `<span class="eyebrow">DMS302m · Chapter 6 · Lesson 6.1</span>
<h2>Email, marketing automation &amp; CRM</h2>
<h3>List building &amp; segmentation</h3>
<p>Email marketing starts with a permission-based list (opt-in), then <strong>segmentation</strong> — splitting subscribers by behavior, persona or lifecycle stage so each group gets relevant content instead of one generic blast.</p>
<h3>Drip campaigns &amp; automation</h3>
<pre><code>Trigger: user signs up
  Day 0  -> welcome email
  Day 2  -> educational content (builds trust)
  Day 5  -> case study / social proof
  Day 7  -> offer / call-to-action
</code></pre>
<p>A <strong>drip campaign</strong> is a pre-built sequence sent automatically on a trigger (sign-up, cart abandon, inactivity) — this is what "marketing automation" tools (e.g. Mailchimp, HubSpot) run at scale.</p>
<h3>CRM &amp; the customer lifecycle</h3>
<p>A <strong>CRM (Customer Relationship Management)</strong> system stores every contact's data and interaction history, letting marketing and sales see the same view of a lead as it moves lead → opportunity → customer → repeat customer.</p>
<h3>Core metrics</h3>
<ul>
<li><strong>Open rate</strong> — % who opened the email (subject line quality).</li>
<li><strong>Click-through rate (CTR)</strong> — % who clicked a link (content/offer quality).</li>
</ul>
<div class="callout"><span class="badge">Automation ≠ spam</span> Automation should send the <em>right</em> message at the <em>right</em> trigger — segmentation is what keeps automated email relevant instead of annoying.</div>`,
    `<span class="eyebrow">DMS302m · Chương 6 · Bài 6.1</span>
<h2>Email, marketing automation &amp; CRM</h2>
<h3>Xây danh sách &amp; phân khúc</h3>
<p>Email marketing bắt đầu từ một danh sách có xin phép (opt-in), rồi <strong>phân khúc (segmentation)</strong> — chia người đăng ký theo hành vi, persona hoặc giai đoạn vòng đời để mỗi nhóm nhận nội dung phù hợp thay vì một email chung cho tất cả.</p>
<h3>Drip campaign &amp; automation</h3>
<pre><code>Trigger: người dùng đăng ký
  Ngày 0 -> email chào mừng
  Ngày 2 -> nội dung giáo dục (xây niềm tin)
  Ngày 5 -> case study / bằng chứng xã hội
  Ngày 7 -> ưu đãi / call-to-action
</code></pre>
<p>Một <strong>drip campaign</strong> là chuỗi email dựng sẵn, tự động gửi theo trigger (đăng ký, bỏ giỏ hàng, không hoạt động) — đây là điều các công cụ "marketing automation" (vd Mailchimp, HubSpot) vận hành ở quy mô lớn.</p>
<h3>CRM &amp; vòng đời khách hàng</h3>
<p>Một hệ thống <strong>CRM (Customer Relationship Management)</strong> lưu dữ liệu và lịch sử tương tác của mọi liên hệ, giúp marketing và sales nhìn cùng một góc về một lead khi nó đi qua lead → cơ hội → khách hàng → khách hàng quay lại.</p>
<h3>Chỉ số cốt lõi</h3>
<ul>
<li><strong>Open rate</strong> — % người mở email (chất lượng subject line).</li>
<li><strong>Click-through rate (CTR)</strong> — % người bấm link (chất lượng nội dung/ưu đãi).</li>
</ul>
<div class="callout"><span class="badge">Automation ≠ spam</span> Automation nên gửi thông điệp <em>đúng</em> tại trigger <em>đúng</em> — phân khúc là thứ giữ email tự động vẫn liên quan, không phải gây khó chịu.</div>`,
  ]]);

const c6q = quiz('dms302m-quiz-6', 'Quiz 6 — Email/automation/CRM|||Quiz 6 — Email/automation/CRM', [
  { id: 'q1', question: 'Drip campaign là gì?', options: ['Một buổi livestream bán hàng', 'Chuỗi email tự động gửi theo lịch/trigger để nuôi dưỡng lead', 'Một loại quảng cáo hiển thị hình ảnh', 'Báo cáo doanh thu hàng tháng'], correctIndex: 1, explanation: 'Drip campaign là chuỗi email dựng sẵn, gửi tự động khi có trigger như đăng ký hoặc bỏ giỏ hàng.' },
  { id: 'q2', question: 'Phân khúc (segmentation) danh sách email giúp điều gì?', options: ['Giảm số email cần gửi xuống 0', 'Gửi nội dung đúng đối tượng, tăng tỷ lệ mở & click', 'Xoá bớt subscriber không cần lý do', 'Chỉ dùng cho khách hàng B2B'], correctIndex: 1, explanation: 'Segmentation chia người nhận theo hành vi/persona để nội dung phù hợp hơn, cải thiện open rate & CTR.' },
  { id: 'q3', question: 'CRM (Customer Relationship Management) dùng chính để làm gì?', options: ['Thiết kế website', 'Quản lý & theo dõi dữ liệu, quan hệ khách hàng suốt vòng đời', 'Chạy quảng cáo Google Ads', 'Tối ưu tốc độ tải trang'], correctIndex: 1, explanation: 'CRM lưu dữ liệu liên hệ và lịch sử tương tác, giúp theo dõi khách hàng từ lead đến khách hàng trung thành.' },
]);

const c7 = doc('dms302m-7-1-digital-advertising', '7.1 — Digital advertising & budget|||7.1 — Quảng cáo số & ngân sách',
  'Display, video, programmatic advertising; mô hình đấu giá CPM/CPC/CPA; phân bổ ngân sách theo hiệu suất.',
  [[
    `<span class="eyebrow">DMS302m · Chapter 7 · Lesson 7.1</span>
<h2>Digital advertising &amp; budget</h2>
<h3>Ad formats</h3>
<ul>
<li><strong>Display</strong> — banner/image ads on websites and apps (awareness, retargeting).</li>
<li><strong>Video</strong> — pre-roll/in-stream ads (YouTube, social) — high engagement, higher cost to produce.</li>
<li><strong>Programmatic</strong> — buying ad space automatically via real-time bidding (RTB) across a huge network of sites, targeted by audience data rather than picking sites by hand.</li>
</ul>
<h3>Pricing models</h3>
<pre><code>CPM (Cost Per Mille)      -> pay per 1,000 impressions  -> awareness goals
CPC (Cost Per Click)      -> pay per click               -> traffic goals
CPA (Cost Per Acquisition)-> pay per conversion           -> sales/lead goals
</code></pre>
<h3>Budget allocation</h3>
<p>Split budget by funnel goal, not evenly: awareness campaigns can run on CPM, conversion campaigns should be judged on CPA/ROAS. A common approach is <strong>test → learn → scale</strong> — small budget across several channels/creatives first, then concentrate spend on what performs.</p>
<div class="callout"><span class="badge">Match price model to goal</span> Paying CPM for a conversion campaign (or CPA for a pure-awareness campaign) misjudges what you're actually buying.</div>`,
    `<span class="eyebrow">DMS302m · Chương 7 · Bài 7.1</span>
<h2>Quảng cáo số &amp; ngân sách</h2>
<h3>Các dạng quảng cáo</h3>
<ul>
<li><strong>Display</strong> — banner/ảnh trên website và app (nhận biết, retargeting).</li>
<li><strong>Video</strong> — quảng cáo pre-roll/in-stream (YouTube, social) — tương tác cao, chi phí sản xuất cao hơn.</li>
<li><strong>Programmatic</strong> — mua không gian quảng cáo tự động qua đấu giá thời gian thực (RTB) trên mạng lưới lớn các trang, target theo dữ liệu đối tượng chứ không chọn trang bằng tay.</li>
</ul>
<h3>Mô hình tính giá</h3>
<pre><code>CPM (Cost Per Mille)       -> trả theo 1.000 lần hiển thị -> mục tiêu nhận biết
CPC (Cost Per Click)       -> trả theo lượt click          -> mục tiêu traffic
CPA (Cost Per Acquisition) -> trả theo lượt chuyển đổi      -> mục tiêu bán/lead
</code></pre>
<h3>Phân bổ ngân sách</h3>
<p>Chia ngân sách theo mục tiêu funnel, không chia đều: chiến dịch nhận biết có thể chạy CPM, chiến dịch chuyển đổi nên đánh giá theo CPA/ROAS. Cách làm phổ biến là <strong>test → learn → scale</strong> — ngân sách nhỏ trải trên nhiều kênh/creative trước, sau đó tập trung chi tiêu vào cái hiệu quả.</p>
<div class="callout"><span class="badge">Khớp mô hình giá với mục tiêu</span> Trả CPM cho chiến dịch chuyển đổi (hoặc CPA cho chiến dịch chỉ để nhận biết) là đánh giá sai thứ bạn đang mua.</div>`,
  ]]);

const c7q = quiz('dms302m-quiz-7', 'Quiz 7 — Digital advertising|||Quiz 7 — Quảng cáo số', [
  { id: 'q1', question: 'Programmatic advertising là gì?', options: ['Chỉ chạy quảng cáo trên truyền hình', 'Mua/bán không gian quảng cáo tự động qua đấu giá thời gian thực (RTB)', 'Gửi email quảng cáo hàng loạt', 'Thiết kế banner bằng tay'], correctIndex: 1, explanation: 'Programmatic dùng đấu giá thời gian thực để mua vị trí quảng cáo tự động, target theo dữ liệu đối tượng.' },
  { id: 'q2', question: 'CPM là chi phí được tính theo?', options: ['Mỗi lượt click', 'Mỗi 1.000 lần hiển thị (impressions)', 'Mỗi lượt chuyển đổi', 'Mỗi giờ chạy quảng cáo'], correctIndex: 1, explanation: 'CPM = Cost Per Mille, trả tiền theo mỗi 1.000 lần hiển thị quảng cáo, phù hợp mục tiêu nhận biết.' },
  { id: 'q3', question: 'Ngân sách quảng cáo nên được phân bổ dựa trên nguyên tắc nào?', options: ['Chia đều cho mọi kênh bất kể hiệu suất', 'Theo hiệu suất từng kênh & mục tiêu funnel, dùng test-learn-scale', 'Chỉ chi hết ngân sách trong ngày đầu', 'Chỉ dùng một kênh duy nhất mãi mãi'], correctIndex: 1, explanation: 'Phân bổ nên theo hiệu suất và mục tiêu funnel, thử nghiệm nhỏ trước rồi tập trung vào kênh/creative hiệu quả.' },
]);

const c8 = doc('dms302m-8-1-measurement-optimization', '8.1 — Measurement, optimization (KPI/ROI) & the integrated plan|||8.1 — Đo lường, tối ưu (KPI/ROI) & kế hoạch tích hợp',
  'KPI theo giai đoạn RACE, ROI/ROAS, A/B testing, attribution model, ghép lại thành một kế hoạch marketing số tích hợp.',
  [[
    `<span class="eyebrow">DMS302m · Chapter 8 · Lesson 8.1</span>
<h2>Measurement, optimization &amp; the integrated plan</h2>
<h3>KPIs per RACE stage</h3>
<pre><code>Reach    -> impressions, reach, website sessions
Act      -> pages/session, time on site, engagement rate
Convert  -> conversion rate, cost per acquisition
Engage   -> repeat purchase rate, email open/click, churn
</code></pre>
<h3>ROI &amp; ROAS</h3>
<p><strong>ROI (Return on Investment)</strong> = (revenue − cost) / cost. <strong>ROAS (Return on Ad Spend)</strong> = revenue / ad spend — the two headline numbers that justify (or kill) a channel's budget.</p>
<h3>A/B testing</h3>
<p>Running two versions (subject line, landing page, ad creative) to the same audience segment and comparing results with data — the core habit of continuous optimization instead of one-off "set and forget" campaigns.</p>
<h3>Attribution</h3>
<p>An <strong>attribution model</strong> decides which touchpoint gets credit for a conversion (last-click, first-click, linear, multi-touch) — critical once a customer touches search, social <em>and</em> email before buying.</p>
<h3>Putting it together</h3>
<p>An integrated digital marketing plan revisits <strong>SOSTAC</strong> from Chapter 1 with real data: Situation (past performance) → Objectives (next period's SMART goals) → Strategy/Tactics (which of research, content, SEO/SEM, social, email, ads to prioritize) → Action (calendar &amp; owners) → Control (the KPIs above, reviewed on a cadence).</p>
<div class="callout"><span class="badge">Course closes the loop</span> Chapter 8 doesn't add a new channel — it's the "Control" step that makes every previous chapter accountable to real numbers, and feeds back into next period's Situation.</div>`,
    `<span class="eyebrow">DMS302m · Chương 8 · Bài 8.1</span>
<h2>Đo lường, tối ưu &amp; kế hoạch tích hợp</h2>
<h3>KPI theo từng giai đoạn RACE</h3>
<pre><code>Reach    -> impressions, reach, số lượt session website
Act      -> số trang/session, thời gian trên trang, tỷ lệ tương tác
Convert  -> tỷ lệ chuyển đổi, chi phí trên mỗi chuyển đổi
Engage   -> tỷ lệ mua lại, open/click email, tỷ lệ rời bỏ (churn)
</code></pre>
<h3>ROI &amp; ROAS</h3>
<p><strong>ROI (Return on Investment)</strong> = (doanh thu − chi phí) / chi phí. <strong>ROAS (Return on Ad Spend)</strong> = doanh thu / chi phí quảng cáo — hai con số đầu bảng quyết định giữ hay cắt ngân sách một kênh.</p>
<h3>A/B testing</h3>
<p>Chạy hai phiên bản (subject line, trang đích, creative quảng cáo) trên cùng một phân khúc đối tượng và so sánh kết quả bằng dữ liệu — thói quen cốt lõi của tối ưu liên tục, thay vì chiến dịch "thiết lập rồi bỏ đó".</p>
<h3>Attribution</h3>
<p>Một <strong>attribution model</strong> quyết định điểm chạm nào được ghi nhận công cho một chuyển đổi (last-click, first-click, linear, multi-touch) — quan trọng khi khách hàng chạm qua search, social <em>và</em> email trước khi mua.</p>
<h3>Ghép lại thành một thể</h3>
<p>Một kế hoạch marketing số tích hợp quay lại <strong>SOSTAC</strong> ở Chương 1 với dữ liệu thật: Situation (hiệu suất kỳ trước) → Objectives (mục tiêu SMART kỳ tới) → Strategy/Tactics (ưu tiên nghiên cứu, content, SEO/SEM, social, email, ads nào) → Action (lịch &amp; người phụ trách) → Control (các KPI trên, xem lại theo nhịp).</p>
<div class="callout"><span class="badge">Môn khép vòng lặp</span> Chương 8 không thêm kênh mới — đây là bước "Control" khiến mọi chương trước phải chịu trách nhiệm trước số liệu thật, và quay lại làm Situation cho kỳ tiếp theo.</div>`,
  ]]);

const c8q = quiz('dms302m-quiz-8', 'Quiz 8 — Measurement & optimization|||Quiz 8 — Đo lường & tối ưu', [
  { id: 'q1', question: 'ROAS (Return on Ad Spend) được tính như thế nào?', options: ['Chi phí quảng cáo / doanh thu', 'Doanh thu / chi phí quảng cáo', 'Số lượt click / số lượt hiển thị', 'Số lead / số nhân viên sales'], correctIndex: 1, explanation: 'ROAS = doanh thu chia cho chi phí quảng cáo, cho biết mỗi đồng chi ra tạo ra bao nhiêu đồng doanh thu.' },
  { id: 'q2', question: 'A/B testing dùng để làm gì?', options: ['Chạy 2 phiên bản khác nhau để so sánh, tìm phiên bản hiệu quả hơn dựa trên dữ liệu', 'Gửi 2 email trùng nội dung cho chắc', 'Tăng gấp đôi ngân sách quảng cáo', 'Tắt một kênh marketing ngẫu nhiên'], correctIndex: 0, explanation: 'A/B testing so sánh 2 phiên bản (subject line, landing page, creative...) trên cùng đối tượng để quyết định bằng dữ liệu.' },
  { id: 'q3', question: 'Attribution model dùng để làm gì?', options: ['Thiết kế logo thương hiệu', 'Xác định điểm chạm/kênh nào được ghi nhận công cho một chuyển đổi', 'Tính lương của team marketing', 'Chọn màu sắc cho quảng cáo'], correctIndex: 1, explanation: 'Attribution model (last-click, first-click, multi-touch...) quyết định kênh nào được ghi công khi khách hàng đi qua nhiều điểm chạm trước khi chuyển đổi.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'DMS302m',
    slug: 'dms302m-digital-marketing-strategy',
    title: 'Digital Marketing Strategy',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/DMS302m.webp',
    shortDescription: 'How to plan & run a digital marketing strategy — RACE framework, research & personas, content marketing, SEO & SEM, social & influencer, email/CRM automation, digital advertising, measurement & ROI. Bilingual, with examples & quizzes.|||Cách lập & triển khai chiến lược marketing số — mô hình RACE, nghiên cứu khách hàng & persona, content marketing, SEO & SEM, social & influencer, email/CRM tự động hoá, quảng cáo số, đo lường & ROI. Song ngữ, có ví dụ & quiz.',
    description: 'Môn <strong>DMS302m — Digital Marketing Strategy</strong> (kỳ 3) giúp hiểu <strong>cách lập và triển khai một chiến lược marketing số bài bản</strong>. Từ <strong>khung RACE &amp; lập kế hoạch SOSTAC</strong> → <strong>nghiên cứu thị trường, khách hàng &amp; persona số</strong> → <strong>content marketing</strong> → <strong>SEO &amp; SEM</strong> → <strong>social media &amp; influencer marketing</strong> → <strong>email, marketing automation &amp; CRM</strong> → <strong>quảng cáo số &amp; ngân sách</strong> → <strong>đo lường, KPI/ROI &amp; kế hoạch tích hợp</strong>. Bám giáo trình tham khảo Chaffey/Kotler/Kingsnorth &amp; Google/HubSpot Academy, song ngữ, có ví dụ và quiz mỗi chương.',
    whatYouLearn: 'Khung RACE (Reach-Act-Convert-Engage) & lập kế hoạch SOSTAC, mục tiêu SMART; nghiên cứu thị trường & khách hàng, buyer persona, customer journey map; content marketing funnel (TOFU/MOFU/BOFU), content calendar; SEO (on/off-page/technical) & SEM/PPC, Quality Score; social media & influencer marketing, engagement rate, social listening; email marketing, segmentation, automation/drip campaign, CRM; quảng cáo số (display/video/programmatic), mô hình CPM/CPC/CPA, phân bổ ngân sách; KPI, ROI/ROAS, A/B testing, attribution model.',
    requirements: 'Kiến thức marketing cơ bản (marketing mix 4P) là một lợi thế nhưng không bắt buộc. Nên có tài khoản Google để thực hành Trends/Analytics/Ads (bản miễn phí).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình tham khảo (Chaffey, Kotler, Kingsnorth), khoá học Google/HubSpot Academy, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Marketing số là gì, vì sao cần chiến lược, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Chiến lược & RACE|||Chapter 1 — Strategy & RACE', description: 'Khung RACE, SOSTAC, mục tiêu SMART.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Nghiên cứu & persona|||Chapter 2 — Research & persona', description: 'Buyer persona, customer journey, công cụ nghiên cứu.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Content marketing|||Chapter 3 — Content marketing', description: 'Funnel TOFU/MOFU/BOFU, content calendar, brand voice.', lessons: [c3, c3q] },
    { title: 'Chương 4 — SEO & SEM|||Chapter 4 — SEO & SEM', description: 'On/off-page/technical SEO, SEM/PPC, Quality Score.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Social & influencer|||Chapter 5 — Social & influencer', description: 'Chọn nền tảng, organic/paid, tầng influencer, social listening.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Email, automation & CRM|||Chapter 6 — Email, automation & CRM', description: 'Segmentation, drip campaign, CRM, chỉ số email.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Quảng cáo số & ngân sách|||Chapter 7 — Digital advertising & budget', description: 'Display/video/programmatic, CPM/CPC/CPA, phân bổ ngân sách.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Đo lường, tối ưu & kế hoạch tích hợp|||Chapter 8 — Measurement, optimization & the integrated plan', description: 'KPI theo RACE, ROI/ROAS, A/B testing, attribution, SOSTAC khép vòng.', lessons: [c8, c8q] },
  ],
};
