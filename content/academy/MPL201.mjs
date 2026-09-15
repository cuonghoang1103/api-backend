/**
 * MPL201 — Media Planning (Hoạch định Truyền thông/Quảng cáo). Khối Quản trị
 * Kinh doanh (BBA), FPTU, Kỳ 4. Trích dẫn: "Advertising Media Planning"
 * (Sissors/Baron); "Media Planning and Buying" (Kelley); tài liệu Nielsen/
 * Google (KHÔNG upload PDF). 8 chương: (1) tổng quan & vai trò trong chiến
 * dịch, (2) mục tiêu & đối tượng mục tiêu, (3) chỉ số media (reach/freq/
 * GRP/CPM/CPP), (4) chiến lược & lựa chọn kênh, (5) lập lịch media, (6)
 * ngân sách & phân bổ, (7) media buying & đàm phán, (8) đo hiệu quả & số/
 * programmatic. Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${/nháy
 * đơn thừa lồng trong content; "&"→&amp;, "<"/">" literal→&lt;/&gt;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('mpl201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình (FLM), sách tham khảo, tài liệu chính thức miễn phí (Google/Nielsen/IAB), YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">MPL201 · Materials</span>
<h2>Media planning materials &amp; resource hub</h2>
<p class="lead">Everything to learn media planning — objectives, audience, metrics, channel strategy, scheduling, budgeting, buying and measurement — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for MPL201 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><em>Advertising Media Planning</em> — Jack Z. Sissors &amp; Roger B. Baron. The classic reach/frequency/GRP framework this course follows.</li>
<li><em>Media Planning and Buying: Today and in the Future</em> — Larry D. Kelley, Kim Bartel Sheehan &amp; Ron Jurewicz. Practical planner/buyer workflow.</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.thinkwithgoogle.com/marketing-strategies/" target="_blank" rel="noopener">Think with Google — marketing strategies</a></li>
<li><a href="https://www.nielsen.com/insights/" target="_blank" rel="noopener">Nielsen Insights — audience measurement</a></li>
<li><a href="https://www.iab.com/insights/" target="_blank" rel="noopener">IAB — digital &amp; programmatic standards</a></li>
<li><a href="https://en.wikipedia.org/wiki/Media_planning" target="_blank" rel="noopener">Wikipedia — Media planning overview</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@thinkwithgoogle" target="_blank" rel="noopener">Think with Google</a> — audience &amp; media insights</li>
<li><a href="https://www.youtube.com/@HubSpot" target="_blank" rel="noopener">HubSpot Marketing</a> — campaign planning &amp; metrics explainers</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://ads.google.com/home/tools/reach-planner/" target="_blank" rel="noopener">Google Reach Planner</a> — reach/frequency estimation</li>
<li><a href="https://gwi.com/" target="_blank" rel="noopener">GWI (GlobalWebIndex)</a> — audience &amp; consumer research data</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — media planning's role, objectives, target audience, reach/frequency/GRP/CPM/CPP.</li>
<li><strong>Practice</strong> — build a simple media mix &amp; schedule for a sample product; compute GRP and CPM by hand.</li>
<li><strong>Go deeper</strong> — flighting vs pulsing, budget allocation methods, buying &amp; negotiation levers.</li>
<li><strong>Job-ready</strong> — read a real media plan/RFP, understand programmatic (DSP/SSP/RTB) and attribution.</li>
</ol></div>`,
    `<span class="eyebrow">MPL201 · Tài liệu</span>
<h2>Trung tâm tài liệu Media Planning</h2>
<p class="lead">Mọi thứ để học hoạch định truyền thông — mục tiêu, đối tượng, chỉ số, chiến lược kênh, lập lịch, ngân sách, mua media và đo hiệu quả — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của MPL201 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><em>Advertising Media Planning</em> — Jack Z. Sissors &amp; Roger B. Baron. Khung reach/frequency/GRP kinh điển mà môn này bám theo.</li>
<li><em>Media Planning and Buying: Today and in the Future</em> — Larry D. Kelley, Kim Bartel Sheehan &amp; Ron Jurewicz. Quy trình planner/buyer thực tế.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.thinkwithgoogle.com/marketing-strategies/" target="_blank" rel="noopener">Think with Google — chiến lược marketing</a></li>
<li><a href="https://www.nielsen.com/insights/" target="_blank" rel="noopener">Nielsen Insights — đo lường đối tượng</a></li>
<li><a href="https://www.iab.com/insights/" target="_blank" rel="noopener">IAB — chuẩn digital &amp; programmatic</a></li>
<li><a href="https://en.wikipedia.org/wiki/Media_planning" target="_blank" rel="noopener">Wikipedia — Tổng quan Media planning</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@thinkwithgoogle" target="_blank" rel="noopener">Think with Google</a> — thông tin đối tượng &amp; media</li>
<li><a href="https://www.youtube.com/@HubSpot" target="_blank" rel="noopener">HubSpot Marketing</a> — giải thích lập kế hoạch &amp; chỉ số</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://ads.google.com/home/tools/reach-planner/" target="_blank" rel="noopener">Google Reach Planner</a> — ước tính reach/frequency</li>
<li><a href="https://gwi.com/" target="_blank" rel="noopener">GWI (GlobalWebIndex)</a> — dữ liệu nghiên cứu đối tượng/người tiêu dùng</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — vai trò media planning, mục tiêu, đối tượng mục tiêu, reach/frequency/GRP/CPM/CPP.</li>
<li><strong>Luyện tập</strong> — dựng media mix &amp; lịch chạy đơn giản cho một sản phẩm mẫu; tự tính GRP và CPM.</li>
<li><strong>Đào sâu thực tế</strong> — flighting vs pulsing, các cách phân bổ ngân sách, đòn bẩy mua media &amp; đàm phán.</li>
<li><strong>Sẵn sàng đi làm</strong> — đọc một media plan/RFP thật, hiểu programmatic (DSP/SSP/RTB) và attribution.</li>
</ol></div>`,
  ]]);

const intro = doc('mpl201-0-1-overview', 'Course overview: Media Planning|||Tổng quan: Hoạch định Truyền thông',
  'Media planning là gì, vì sao cần; lộ trình 8 chương từ mục tiêu/đối tượng → chỉ số → chiến lược kênh → lịch chạy → ngân sách → mua media → đo hiệu quả.',
  [[
    `<span class="eyebrow">MPL201 · Lesson 0.1 · Overview</span>
<h2>Media Planning</h2>
<p class="lead">This course teaches you how brands decide <strong>where, when and how much</strong> to advertise. <strong>Media planning</strong> is the process of finding the best combination of media (TV, digital, OOH, print...) to deliver a brand's message to the right audience, at the right time, at the lowest cost.</p>
<h3>Where media planning sits</h3>
<p>Marketing plan → advertising/creative strategy → <strong>media plan</strong> (this course) → media buying &amp; execution → measurement. The media plan is the bridge between "what to say" (creative) and "how it actually reaches people" (media).</p>
<h3>Roadmap</h3>
<p>Objectives &amp; target audience → media metrics (reach, frequency, GRP, CPM, CPP) → channel strategy → scheduling (flighting/pulsing/continuity) → budgeting &amp; allocation → media buying &amp; negotiation → measurement, digital/programmatic &amp; optimization.</p>`,
    `<span class="eyebrow">MPL201 · Bài 0.1 · Tổng quan</span>
<h2>Hoạch định Truyền thông</h2>
<p class="lead">Môn này dạy cách các thương hiệu quyết định <strong>quảng cáo ở đâu, khi nào và chi bao nhiêu</strong>. <strong>Media planning (hoạch định truyền thông)</strong> là quá trình tìm tổ hợp media (TV, digital, OOH, báo in...) tốt nhất để đưa thông điệp thương hiệu tới đúng đối tượng, đúng thời điểm, với chi phí thấp nhất.</p>
<h3>Vị trí của media planning</h3>
<p>Kế hoạch marketing → chiến lược quảng cáo/sáng tạo → <strong>kế hoạch media</strong> (môn này) → mua media &amp; triển khai → đo hiệu quả. Kế hoạch media là cầu nối giữa "nói gì" (creative) và "thông điệp thực sự đến người xem ra sao" (media).</p>
<h3>Lộ trình</h3>
<p>Mục tiêu &amp; đối tượng mục tiêu → chỉ số media (reach, frequency, GRP, CPM, CPP) → chiến lược kênh → lập lịch (flighting/pulsing/continuity) → ngân sách &amp; phân bổ → mua media &amp; đàm phán → đo hiệu quả, digital/programmatic &amp; tối ưu.</p>`,
  ]]);

const c1 = doc('mpl201-1-1-overview-role', '1.1 — Media planning overview & role in the campaign|||1.1 — Tổng quan media planning & vai trò trong chiến dịch',
  'Định nghĩa media planning (Sissors/Baron); các bên liên quan (planner, buyer, agency, client, vendor); vị trí trong chuỗi marketing → advertising → media.',
  [[
    `<span class="eyebrow">MPL201 · Chapter 1 · Lesson 1.1</span>
<h2>Media planning overview &amp; role in the campaign</h2>
<h3>Definition</h3>
<p>Sissors &amp; Baron define media planning as the process of designing a course of action that shows how advertising time and space will be used to help achieve marketing objectives. In short: <strong>who</strong> the plan must reach, <strong>where</strong> and <strong>when</strong>, and <strong>how much</strong> it should cost.</p>
<h3>The players</h3>
<ul>
<li><strong>Client / advertiser</strong> — owns the brand and the budget, sets the marketing objective.</li>
<li><strong>Agency</strong> — creative team (the message) + media team (the plan &amp; buy).</li>
<li><strong>Media planner</strong> — decides the strategy: which media, how much, when.</li>
<li><strong>Media buyer</strong> — executes the plan: negotiates and purchases the actual space/time.</li>
<li><strong>Media owner / vendor</strong> — TV station, publisher, platform (Google, Meta...) that sells the inventory.</li>
</ul>
<h3>Why media planning matters</h3>
<p>The best creative fails if it never reaches the right people. Media planning turns a marketing budget into <em>actual exposure</em> — it is where strategy meets execution, and where most of an advertising budget is actually spent.</p>
<div class="callout"><span class="badge">The hierarchy</span> Marketing plan (business goal) &amp;rarr; advertising/creative strategy (the message) &amp;rarr; <strong>media plan</strong> (who/where/when/how much) &amp;rarr; buying &amp; execution &amp;rarr; measurement.</div>`,
    `<span class="eyebrow">MPL201 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan media planning &amp; vai trò trong chiến dịch</h2>
<h3>Định nghĩa</h3>
<p>Sissors &amp; Baron định nghĩa media planning là quá trình thiết kế một hướng hành động, cho biết thời gian và không gian quảng cáo sẽ được dùng thế nào để đạt mục tiêu marketing. Nói ngắn: <strong>ai</strong> kế hoạch phải tiếp cận, <strong>ở đâu</strong> và <strong>khi nào</strong>, và <strong>chi phí</strong> nên là bao nhiêu.</p>
<h3>Các bên liên quan</h3>
<ul>
<li><strong>Client / nhà quảng cáo</strong> — sở hữu thương hiệu và ngân sách, đặt mục tiêu marketing.</li>
<li><strong>Agency</strong> — nhóm sáng tạo (thông điệp) + nhóm media (kế hoạch &amp; mua).</li>
<li><strong>Media planner</strong> — quyết định chiến lược: dùng media nào, bao nhiêu, khi nào.</li>
<li><strong>Media buyer</strong> — thực thi kế hoạch: đàm phán và mua thời lượng/vị trí thật.</li>
<li><strong>Media owner / vendor</strong> — đài truyền hình, báo, nền tảng (Google, Meta...) bán inventory.</li>
</ul>
<h3>Vì sao media planning quan trọng</h3>
<p>Sáng tạo tốt nhất cũng vô nghĩa nếu không đến được đúng người. Media planning biến ngân sách marketing thành <em>tiếp cận thật</em> — đây là nơi chiến lược gặp thực thi, và phần lớn ngân sách quảng cáo thực sự được chi ở đây.</p>
<div class="callout"><span class="badge">Chuỗi phân cấp</span> Kế hoạch marketing (mục tiêu kinh doanh) &amp;rarr; chiến lược quảng cáo/sáng tạo (thông điệp) &amp;rarr; <strong>kế hoạch media</strong> (ai/đâu/khi/bao nhiêu) &amp;rarr; mua &amp; triển khai &amp;rarr; đo hiệu quả.</div>`,
  ]]);

const c1q = quiz('mpl201-quiz-1', 'Quiz 1 — Overview & role|||Quiz 1 — Tổng quan & vai trò', [
  { id: 'q1', question: 'Theo Sissors/Baron, media planning trả lời những câu hỏi nào?', options: ['Chỉ giá quảng cáo', 'Ai/ở đâu/khi nào/chi bao nhiêu để đạt mục tiêu marketing', 'Chỉ nội dung sáng tạo', 'Chỉ kênh phân phối sản phẩm'], correctIndex: 1, explanation: 'Media planning xác định ai cần tiếp cận, ở đâu, khi nào và chi phí bao nhiêu.' },
  { id: 'q2', question: 'Ai là người thực thi — đàm phán và mua thời lượng/vị trí quảng cáo thật?', options: ['Media planner', 'Media buyer', 'Client', 'Media owner'], correctIndex: 1, explanation: 'Planner quyết định chiến lược; buyer thực thi việc mua.' },
  { id: 'q3', question: 'Kế hoạch media nằm ở vị trí nào trong chuỗi?', options: ['Trước kế hoạch marketing', 'Sau chiến lược sáng tạo, trước mua & triển khai', 'Sau đo hiệu quả', 'Không liên quan tới marketing plan'], correctIndex: 1, explanation: 'Marketing plan → chiến lược sáng tạo → media plan → mua & triển khai → đo hiệu quả.' },
]);

const c2 = doc('mpl201-2-1-objectives-audience', '2.1 — Setting objectives & defining the target audience|||2.1 — Xác định mục tiêu & đối tượng mục tiêu',
  'Chuyển mục tiêu marketing thành mục tiêu media (SMART); phân khúc đối tượng mục tiêu (demographic, geographic, psychographic, behavioral); đối tượng chính/phụ; nguồn nghiên cứu (Nielsen, GfK, Kantar, TGI).',
  [[
    `<span class="eyebrow">MPL201 · Chapter 2 · Lesson 2.1</span>
<h2>Setting objectives &amp; defining the target audience</h2>
<h3>From marketing objective to media objective</h3>
<p>A marketing objective ("grow market share") must become a <strong>media objective</strong> that is <strong>SMART</strong> — Specific, Measurable, Achievable, Relevant, Time-bound. Example: "reach 70% of urban women 25-34 at an average frequency of 3+ within 4 weeks."</p>
<h3>Defining the target audience</h3>
<ul>
<li><strong>Demographic</strong> — age, gender, income, occupation, education.</li>
<li><strong>Geographic</strong> — country, region, urban/rural, climate.</li>
<li><strong>Psychographic</strong> — lifestyle, values, personality, interests.</li>
<li><strong>Behavioral</strong> — usage rate, brand loyalty, purchase occasion, media habits.</li>
</ul>
<h3>Primary vs secondary audience</h3>
<p>The <strong>primary target</strong> gets most of the budget and drives the strategy; a <strong>secondary target</strong> (e.g. influencers, gift-buyers) is reached opportunistically, at lower cost, without diluting the primary reach.</p>
<h3>Research sources</h3>
<p>Planners profile audiences using syndicated research: <strong>Nielsen</strong> (TV/video ratings), <strong>GfK</strong> and <strong>Kantar</strong> (consumer panels), and <strong>TGI (Target Group Index)</strong> for lifestyle/media-habit cross-tabs.</p>
<div class="callout"><span class="badge">Rule of thumb</span> A target audience defined too broadly ("everyone") cannot be reached efficiently — a sharp, specific audience is what makes reach &amp; frequency numbers meaningful.</div>`,
    `<span class="eyebrow">MPL201 · Chương 2 · Bài 2.1</span>
<h2>Xác định mục tiêu &amp; đối tượng mục tiêu</h2>
<h3>Từ mục tiêu marketing sang mục tiêu media</h3>
<p>Một mục tiêu marketing ("tăng thị phần") phải trở thành <strong>mục tiêu media</strong> đạt chuẩn <strong>SMART</strong> — Cụ thể, Đo được, Khả thi, Liên quan, Có hạn thời gian. Ví dụ: "tiếp cận 70% phụ nữ thành thị 25-34 tuổi với tần suất trung bình 3+ trong 4 tuần."</p>
<h3>Xác định đối tượng mục tiêu</h3>
<ul>
<li><strong>Nhân khẩu học (demographic)</strong> — tuổi, giới, thu nhập, nghề nghiệp, học vấn.</li>
<li><strong>Địa lý (geographic)</strong> — quốc gia, vùng miền, thành thị/nông thôn, khí hậu.</li>
<li><strong>Tâm lý học (psychographic)</strong> — lối sống, giá trị, tính cách, sở thích.</li>
<li><strong>Hành vi (behavioral)</strong> — mức độ dùng, trung thành thương hiệu, dịp mua, thói quen dùng media.</li>
</ul>
<h3>Đối tượng chính vs phụ</h3>
<p><strong>Đối tượng chính (primary)</strong> nhận phần lớn ngân sách và dẫn dắt chiến lược; <strong>đối tượng phụ (secondary)</strong> (vd người ảnh hưởng, người mua tặng) được tiếp cận tận dụng cơ hội, chi phí thấp hơn, không làm loãng reach của đối tượng chính.</p>
<h3>Nguồn nghiên cứu</h3>
<p>Planner dựng hồ sơ đối tượng bằng dữ liệu nghiên cứu tổng hợp: <strong>Nielsen</strong> (rating TV/video), <strong>GfK</strong> và <strong>Kantar</strong> (panel người tiêu dùng), và <strong>TGI (Target Group Index)</strong> để bắt chéo lối sống/thói quen media.</p>
<div class="callout"><span class="badge">Nguyên tắc</span> Đối tượng mục tiêu định nghĩa quá rộng ("ai cũng được") không thể tiếp cận hiệu quả — một đối tượng sắc nét, cụ thể mới làm cho số reach &amp; frequency có ý nghĩa.</div>`,
  ]]);

const c2q = quiz('mpl201-quiz-2', 'Quiz 2 — Objectives & audience|||Quiz 2 — Mục tiêu & đối tượng', [
  { id: 'q1', question: 'Mục tiêu media đạt chuẩn SMART cần có yếu tố gì?', options: ['Chỉ cần lớn và ấn tượng', 'Cụ thể, đo được, khả thi, liên quan, có hạn thời gian', 'Chỉ cần đo được', 'Không cần thời hạn'], correctIndex: 1, explanation: 'SMART = Specific, Measurable, Achievable, Relevant, Time-bound.' },
  { id: 'q2', question: 'Phân khúc theo lối sống, giá trị, tính cách, sở thích gọi là?', options: ['Demographic', 'Geographic', 'Psychographic', 'Behavioral'], correctIndex: 2, explanation: 'Psychographic mô tả lối sống/tâm lý, khác nhân khẩu học (demographic).' },
  { id: 'q3', question: 'TGI (Target Group Index) được dùng để?', options: ['Đo tốc độ mạng', 'Bắt chéo lối sống & thói quen media của đối tượng', 'Tính thuế quảng cáo', 'Thiết kế logo'], correctIndex: 1, explanation: 'TGI là nguồn dữ liệu nghiên cứu cho phân tích đối tượng & thói quen media.' },
]);

const c3 = doc('mpl201-3-1-media-metrics', '3.1 — Media metrics: reach, frequency, GRP, CPM, CPP|||3.1 — Chỉ số media: reach, frequency, GRP, CPM, CPP',
  'Reach (% tiếp cận), frequency (tần suất trung bình), GRP = Reach × Frequency, effective frequency (3+), CPM = Cost/Impressions×1000, CPP = Cost/GRP. Công thức & ví dụ tính.',
  [[
    `<span class="eyebrow">MPL201 · Chapter 3 · Lesson 3.1</span>
<h2>Media metrics: reach, frequency, GRP, CPM, CPP</h2>
<h3>Reach &amp; frequency</h3>
<ul>
<li><strong>Reach</strong> — the percentage (or number) of the target audience exposed to the message <em>at least once</em> during the campaign period.</li>
<li><strong>Frequency</strong> — the average number of times a reached person is exposed to the message.</li>
</ul>
<h3>GRP — Gross Rating Points</h3>
<p><strong>GRP</strong> is the total weight of a media schedule; it does not remove duplication, so it can exceed 100%.</p>
<pre><code>GRP = Reach(%) x Frequency

Example: Reach = 60%, Frequency = 4
GRP = 60 x 4 = 240 GRP
</code></pre>
<h3>Effective frequency &amp; effective reach</h3>
<p>Not every exposure counts equally — the classic rule of thumb is that a message needs roughly <strong>3+ exposures</strong> to register (awareness → comprehension → conviction). <strong>Effective reach</strong> = the % of the audience reached at or above that effective frequency threshold, not just reached once.</p>
<h3>CPM &amp; CPP</h3>
<pre><code>CPM (Cost Per Mille/1000 impressions) = (Cost / Impressions) x 1000
CPP (Cost Per Point)                  = Cost / GRP (or rating)

Example: Cost = 20,000,000 VND, Impressions = 2,000,000
CPM = (20,000,000 / 2,000,000) x 1000 = 10,000 VND

Example: Cost = 48,000,000 VND, GRP = 240
CPP = 48,000,000 / 240 = 200,000 VND per rating point
</code></pre>
<div class="callout"><span class="badge">Compare apples to apples</span> CPM lets you compare cost-efficiency <em>across channels</em> (TV vs digital vs OOH) for the same audience — never compare raw cost alone.</div>`,
    `<span class="eyebrow">MPL201 · Chương 3 · Bài 3.1</span>
<h2>Chỉ số media: reach, frequency, GRP, CPM, CPP</h2>
<h3>Reach &amp; frequency</h3>
<ul>
<li><strong>Reach (độ tiếp cận)</strong> — tỉ lệ (hoặc số lượng) đối tượng mục tiêu tiếp xúc với thông điệp <em>ít nhất một lần</em> trong thời gian chiến dịch.</li>
<li><strong>Frequency (tần suất)</strong> — số lần trung bình một người đã được tiếp cận nhìn thấy thông điệp.</li>
</ul>
<h3>GRP — Gross Rating Points</h3>
<p><strong>GRP</strong> là tổng "trọng lượng" của một lịch chạy media; nó KHÔNG loại trùng lặp, nên có thể vượt 100%.</p>
<pre><code>GRP = Reach(%) x Frequency

Ví dụ: Reach = 60%, Frequency = 4
GRP = 60 x 4 = 240 GRP
</code></pre>
<h3>Effective frequency &amp; effective reach</h3>
<p>Không phải lần tiếp xúc nào cũng có giá trị bằng nhau — quy tắc kinh điển là thông điệp cần khoảng <strong>3+ lần tiếp xúc</strong> mới "đọng lại" (nhận biết → hiểu → tin tưởng). <strong>Effective reach</strong> = tỉ lệ đối tượng được tiếp cận đạt HOẶC vượt ngưỡng tần suất hiệu quả đó, không chỉ tiếp cận một lần.</p>
<h3>CPM &amp; CPP</h3>
<pre><code>CPM (Chi phí trên 1000 lần hiển thị) = (Chi phí / Số lần hiển thị) x 1000
CPP (Chi phí trên 1 điểm rating)     = Chi phí / GRP (hoặc rating)

Ví dụ: Chi phí = 20.000.000 VND, Impressions = 2.000.000
CPM = (20.000.000 / 2.000.000) x 1000 = 10.000 VND

Ví dụ: Chi phí = 48.000.000 VND, GRP = 240
CPP = 48.000.000 / 240 = 200.000 VND mỗi điểm rating
</code></pre>
<div class="callout"><span class="badge">So sánh cùng đơn vị</span> CPM giúp so sánh hiệu quả chi phí <em>giữa các kênh</em> (TV vs digital vs OOH) trên cùng một đối tượng — đừng chỉ so chi phí thô.</div>`,
  ]]);

const c3q = quiz('mpl201-quiz-3', 'Quiz 3 — Media metrics|||Quiz 3 — Chỉ số media', [
  { id: 'q1', question: 'GRP được tính bằng công thức nào?', options: ['Reach + Frequency', 'Reach(%) x Frequency', 'Cost / Impressions', 'Frequency / Reach'], correctIndex: 1, explanation: 'GRP = Reach(%) x Frequency, là tổng trọng lượng của lịch chạy, có thể vượt 100%.' },
  { id: 'q2', question: 'CPM đo điều gì?', options: ['Chi phí cho 1000 lần hiển thị', 'Số điểm rating', 'Tỉ lệ tiếp cận', 'Tần suất trung bình'], correctIndex: 0, explanation: 'CPM = (Cost / Impressions) x 1000 — chi phí trên mỗi 1000 lần hiển thị.' },
  { id: 'q3', question: 'Reach = 50%, Frequency = 3. GRP bằng?', options: ['53', '150', '15', '1.5'], correctIndex: 1, explanation: 'GRP = 50 x 3 = 150.' },
]);

const c4 = doc('mpl201-4-1-strategy-channel', '4.1 — Media strategy & channel selection|||4.1 — Chiến lược & lựa chọn kênh truyền thông',
  'Kênh truyền thống (TV, radio, print, OOH) vs digital (search, social, display, video); tiêu chí lựa chọn kênh; media mix; điểm mạnh/yếu từng kênh.',
  [[
    `<span class="eyebrow">MPL201 · Chapter 4 · Lesson 4.1</span>
<h2>Media strategy &amp; channel selection</h2>
<h3>Traditional channels</h3>
<ul>
<li><strong>TV</strong> — mass reach, high emotional impact, expensive, hard to target narrowly.</li>
<li><strong>Radio</strong> — cheap, local, good for frequency, audio-only.</li>
<li><strong>Print (newspaper/magazine)</strong> — credible, long shelf life, declining reach.</li>
<li><strong>OOH (out-of-home)</strong> — billboards, transit; high frequency for commuters, no targeting.</li>
</ul>
<h3>Digital channels</h3>
<ul>
<li><strong>Search</strong> — captures existing intent (someone already searching).</li>
<li><strong>Social</strong> — precise targeting, engagement, but ad fatigue is fast.</li>
<li><strong>Display / video</strong> — scalable reach, retargeting, measurable clicks/views.</li>
<li><strong>Influencer</strong> — borrowed trust from a creator's audience.</li>
</ul>
<h3>Selection criteria &amp; the media mix</h3>
<p>Choose channels by matching: does it <strong>reach the target audience</strong> efficiently (CPM), does it <strong>fit the message</strong> (a demo needs video, a promo code needs a clickable channel), and how do <strong>competitors</strong> already occupy the space. Most plans use a <strong>media mix</strong> — combining channels so each one's weakness is covered by another's strength (e.g. TV for reach + digital for targeting and clicks).</p>
<div class="callout"><span class="badge">No single "best" channel</span> The right channel is the one that is efficient for THIS audience and THIS objective — a channel great for brand awareness can be a poor choice for driving app installs.</div>`,
    `<span class="eyebrow">MPL201 · Chương 4 · Bài 4.1</span>
<h2>Chiến lược &amp; lựa chọn kênh truyền thông</h2>
<h3>Kênh truyền thống</h3>
<ul>
<li><strong>TV</strong> — reach diện rộng, tác động cảm xúc mạnh, đắt, khó nhắm mục tiêu hẹp.</li>
<li><strong>Radio</strong> — rẻ, mang tính địa phương, tốt cho frequency, chỉ có âm thanh.</li>
<li><strong>Báo/tạp chí (print)</strong> — đáng tin cậy, "sống" lâu, reach đang giảm.</li>
<li><strong>OOH (ngoài trời)</strong> — biển quảng cáo, xe buýt; frequency cao với người đi lại, không nhắm mục tiêu được.</li>
</ul>
<h3>Kênh digital</h3>
<ul>
<li><strong>Search (tìm kiếm)</strong> — bắt được nhu cầu đã có sẵn (người đang tìm).</li>
<li><strong>Social (mạng xã hội)</strong> — nhắm mục tiêu chính xác, tương tác cao, nhưng nhanh gây mệt quảng cáo.</li>
<li><strong>Display / video</strong> — reach mở rộng được, retargeting, đo được click/lượt xem.</li>
<li><strong>Influencer</strong> — vay mượn niềm tin từ khán giả của người sáng tạo.</li>
</ul>
<h3>Tiêu chí chọn kênh &amp; media mix</h3>
<p>Chọn kênh bằng cách khớp: kênh có <strong>tiếp cận đối tượng mục tiêu</strong> hiệu quả không (CPM), có <strong>hợp thông điệp</strong> không (giới thiệu sản phẩm cần video, mã giảm giá cần kênh click được), và <strong>đối thủ</strong> đã chiếm lĩnh kênh đó ra sao. Hầu hết kế hoạch dùng <strong>media mix</strong> — kết hợp nhiều kênh để điểm yếu của kênh này được điểm mạnh của kênh khác bù (vd TV để reach + digital để nhắm mục tiêu và tạo click).</p>
<div class="callout"><span class="badge">Không có kênh "tốt nhất" tuyệt đối</span> Kênh đúng là kênh hiệu quả với ĐÚNG đối tượng và ĐÚNG mục tiêu này — kênh tốt cho nhận biết thương hiệu có thể là lựa chọn kém để thúc đẩy cài app.</div>`,
  ]]);

const c4q = quiz('mpl201-quiz-4', 'Quiz 4 — Strategy & channel|||Quiz 4 — Chiến lược & kênh', [
  { id: 'q1', question: 'Kênh nào bắt được nhu cầu người dùng ĐÃ có sẵn (họ đang chủ động tìm)?', options: ['TV', 'OOH', 'Search', 'Radio'], correctIndex: 2, explanation: 'Search bắt intent có sẵn — người dùng đang chủ động tìm kiếm.' },
  { id: 'q2', question: 'Vì sao hầu hết kế hoạch media dùng "media mix" thay vì một kênh duy nhất?', options: ['Để tốn nhiều tiền hơn', 'Điểm yếu kênh này được điểm mạnh kênh khác bù lại', 'Vì luật bắt buộc', 'Vì chỉ có một kênh không đủ inventory'], correctIndex: 1, explanation: 'Kết hợp kênh giúp bù trừ điểm yếu/mạnh, vd TV cho reach + digital cho nhắm mục tiêu.' },
  { id: 'q3', question: 'Đặc điểm nào ĐÚNG với OOH (ngoài trời)?', options: ['Nhắm mục tiêu rất chính xác', 'Frequency cao với người đi lại, không nhắm mục tiêu được', 'Chỉ có ở digital', 'Rẻ nhất trong mọi kênh'], correctIndex: 1, explanation: 'OOH tạo frequency cao cho người qua lại thường xuyên nhưng không target theo cá nhân.' },
]);

const c5 = doc('mpl201-5-1-scheduling', '5.1 — Media scheduling: flighting, pulsing, continuity|||5.1 — Lập lịch media: flighting, pulsing, continuity',
  'Ba mô hình lịch chạy: continuity (đều đặn), flighting (bật/tắt xen kẽ), pulsing (nền liên tục + đợt cao điểm); khi nào dùng mô hình nào.',
  [[
    `<span class="eyebrow">MPL201 · Chapter 5 · Lesson 5.1</span>
<h2>Media scheduling: flighting, pulsing, continuity</h2>
<h3>Three scheduling patterns</h3>
<pre><code>Continuity: |####|####|####|####|####|####|   (steady, every period)
Flighting:  |####|    |####|    |####|    |   (bursts, then OFF entirely)
Pulsing:    |####|##..|####|##..|####|##..|   (steady base + periodic bursts)
</code></pre>
<ul>
<li><strong>Continuity</strong> — advertising runs at a steady level throughout the period. Fits products bought year-round with no strong seasonality (e.g. daily staples).</li>
<li><strong>Flighting</strong> — alternates bursts of advertising with periods of NO advertising at all. Fits seasonal products (e.g. air conditioners in summer) or tight budgets that need concentrated impact.</li>
<li><strong>Pulsing</strong> — combines a low continuous base level with periodic heavier bursts (around key selling moments). Fits products with a baseline demand plus seasonal peaks (e.g. a beverage brand: always-on + extra weight in summer/holidays).</li>
</ul>
<h3>Choosing a pattern</h3>
<p>The decision depends on the <strong>purchase cycle</strong> (how often people buy/decide), <strong>seasonality</strong> of demand, competitive activity, and budget size — a small budget spread thinly across a full year (continuity) may never reach effective frequency, so flighting concentrates it into fewer, stronger bursts.</p>
<div class="callout"><span class="badge">Forgetting curve</span> Awareness decays after advertising stops — flighting/pulsing schedules are timed so the NEXT burst arrives before recall has fully faded.</div>`,
    `<span class="eyebrow">MPL201 · Chương 5 · Bài 5.1</span>
<h2>Lập lịch media: flighting, pulsing, continuity</h2>
<h3>Ba mô hình lịch chạy</h3>
<pre><code>Continuity: |####|####|####|####|####|####|   (đều đặn, mọi kỳ)
Flighting:  |####|    |####|    |####|    |   (chạy dồn, rồi NGƯNG hẳn)
Pulsing:    |####|##..|####|##..|####|##..|   (nền liên tục + đợt cao điểm)
</code></pre>
<ul>
<li><strong>Continuity (liên tục)</strong> — quảng cáo chạy đều suốt thời gian. Hợp sản phẩm mua quanh năm, không tính mùa vụ rõ (vd hàng thiết yếu hằng ngày).</li>
<li><strong>Flighting (chạy dồn)</strong> — xen kẽ đợt chạy dồn với những đoạn NGƯNG hoàn toàn. Hợp sản phẩm mùa vụ (vd điều hòa vào mùa hè) hoặc ngân sách hạn hẹp cần dồn lực để tạo tác động tập trung.</li>
<li><strong>Pulsing (nhấp nhô)</strong> — kết hợp mức nền liên tục thấp với các đợt tăng cường theo chu kỳ (quanh thời điểm bán chạy). Hợp sản phẩm có nhu cầu nền tảng cộng đỉnh mùa vụ (vd đồ uống: chạy nền suốt năm + tăng cường mùa hè/lễ).</li>
</ul>
<h3>Chọn mô hình nào</h3>
<p>Quyết định phụ thuộc vào <strong>chu kỳ mua</strong> (bao lâu người ta mua/quyết định lại), <strong>tính mùa vụ</strong> của nhu cầu, hoạt động của đối thủ, và quy mô ngân sách — ngân sách nhỏ trải mỏng suốt năm (continuity) có thể không bao giờ đạt tần suất hiệu quả, nên flighting dồn nó vào ít đợt nhưng mạnh hơn.</p>
<div class="callout"><span class="badge">Đường cong quên</span> Nhận biết suy giảm sau khi quảng cáo ngừng — lịch flighting/pulsing được tính giờ để đợt TIẾP THEO đến trước khi khả năng ghi nhớ phai hết.</div>`,
  ]]);

const c5q = quiz('mpl201-quiz-5', 'Quiz 5 — Scheduling|||Quiz 5 — Lập lịch', [
  { id: 'q1', question: 'Mô hình lịch chạy nào NGƯNG quảng cáo hoàn toàn giữa các đợt?', options: ['Continuity', 'Flighting', 'Pulsing', 'Không mô hình nào'], correctIndex: 1, explanation: 'Flighting xen kẽ đợt chạy dồn với đoạn ngưng hẳn — khác pulsing (vẫn có nền).' },
  { id: 'q2', question: 'Sản phẩm có nhu cầu nền quanh năm CỘNG đỉnh mùa vụ (vd đồ uống mùa hè) hợp mô hình nào nhất?', options: ['Continuity', 'Flighting', 'Pulsing', 'Không cần lịch'], correctIndex: 2, explanation: 'Pulsing = nền liên tục + đợt tăng cường theo mùa, đúng với dạng nhu cầu này.' },
  { id: 'q3', question: 'Vì sao lịch flighting/pulsing phải tính thời điểm đợt kế tiếp cẩn thận?', options: ['Để tốn ngân sách nhiều hơn', 'Để đợt sau đến trước khi nhận biết đã phai hết (đường cong quên)', 'Không có lý do đặc biệt', 'Chỉ để hợp luật quảng cáo'], correctIndex: 1, explanation: 'Nhận biết suy giảm theo thời gian; đợt kế tiếp phải đến trước khi phai hoàn toàn.' },
]);

const c6 = doc('mpl201-6-1-budget-allocation', '6.1 — Media budgeting & allocation|||6.1 — Ngân sách & phân bổ media',
  'Phương pháp lập ngân sách (% doanh số, objective-and-task, cân bằng cạnh tranh, khả năng chi); phân bổ theo thị trường bằng BDI/CDI.',
  [[
    `<span class="eyebrow">MPL201 · Chapter 6 · Lesson 6.1</span>
<h2>Media budgeting &amp; allocation</h2>
<h3>Budgeting methods</h3>
<ul>
<li><strong>Percentage of sales</strong> — budget = a fixed % of past or forecast revenue. Simple, but ties spend to results instead of to opportunity.</li>
<li><strong>Objective-and-task</strong> — define the media objective first (e.g. reach 70% at 3+ frequency), then cost out exactly what that requires. Most defensible, most work.</li>
<li><strong>Competitive parity</strong> — match or track competitors' spending levels (share of voice).</li>
<li><strong>Affordable method</strong> — spend whatever is left after other costs; common for small businesses, weakest link to objectives.</li>
</ul>
<h3>Allocating across markets: BDI &amp; CDI</h3>
<p>When a brand sells in multiple markets/regions, budget should follow where the opportunity is biggest — measured with two indices:</p>
<pre><code>BDI (Brand Development Index) = (Brand sales in market % / Population in market %) x 100
CDI (Category Development Index) = (Category sales in market % / Population in market %) x 100

BDI high, CDI high  -> strong market, strong category -> keep investing
BDI low,  CDI high  -> category grows but brand lags   -> opportunity, invest MORE
BDI high, CDI low   -> brand outperforms a weak category -> defend, don't over-invest
</code></pre>
<div class="callout"><span class="badge">Objective-and-task, preferred</span> It is the only method that starts from "what does the audience need to see" rather than "what can we afford" or "what did we spend last year."</div>`,
    `<span class="eyebrow">MPL201 · Chương 6 · Bài 6.1</span>
<h2>Ngân sách &amp; phân bổ media</h2>
<h3>Các phương pháp lập ngân sách</h3>
<ul>
<li><strong>% doanh số</strong> — ngân sách = một tỉ lệ % cố định trên doanh thu quá khứ hoặc dự báo. Đơn giản, nhưng gắn chi tiêu vào kết quả thay vì vào cơ hội.</li>
<li><strong>Objective-and-task (theo mục tiêu &amp; việc cần làm)</strong> — xác định mục tiêu media trước (vd reach 70% với frequency 3+), rồi tính chi phí đúng bằng những gì cần để đạt nó. Có cơ sở nhất, tốn công nhất.</li>
<li><strong>Cân bằng cạnh tranh (competitive parity)</strong> — chi ngang hoặc theo sát mức chi của đối thủ (share of voice).</li>
<li><strong>Khả năng chi (affordable method)</strong> — chi phần còn lại sau các chi phí khác; phổ biến ở doanh nghiệp nhỏ, liên kết yếu nhất với mục tiêu.</li>
</ul>
<h3>Phân bổ giữa các thị trường: BDI &amp; CDI</h3>
<p>Khi thương hiệu bán ở nhiều thị trường/vùng, ngân sách nên đi theo nơi có cơ hội lớn nhất — đo bằng hai chỉ số:</p>
<pre><code>BDI (Brand Development Index) = (% doanh số thương hiệu tại thị trường / % dân số tại thị trường) x 100
CDI (Category Development Index) = (% doanh số ngành hàng tại thị trường / % dân số tại thị trường) x 100

BDI cao, CDI cao  -> thị trường mạnh, ngành hàng mạnh -> tiếp tục đầu tư
BDI thấp, CDI cao -> ngành hàng phát triển nhưng thương hiệu tụt lại -> cơ hội, đầu tư THÊM
BDI cao, CDI thấp -> thương hiệu vượt trội một ngành hàng yếu -> giữ vững, đừng đầu tư quá tay
</code></pre>
<div class="callout"><span class="badge">Objective-and-task, ưu tiên</span> Đây là phương pháp duy nhất bắt đầu từ "đối tượng cần thấy gì" thay vì "chúng ta chi được bao nhiêu" hay "năm ngoái chi bao nhiêu."</div>`,
  ]]);

const c6q = quiz('mpl201-quiz-6', 'Quiz 6 — Budget & allocation|||Quiz 6 — Ngân sách & phân bổ', [
  { id: 'q1', question: 'Phương pháp lập ngân sách nào bắt đầu từ mục tiêu media rồi tính chi phí cần thiết?', options: ['% doanh số', 'Objective-and-task', 'Cân bằng cạnh tranh', 'Khả năng chi'], correctIndex: 1, explanation: 'Objective-and-task xác định mục tiêu trước, rồi tính đúng chi phí cần để đạt.' },
  { id: 'q2', question: 'Một thị trường có BDI thấp nhưng CDI cao nghĩa là?', options: ['Ngành hàng yếu, thương hiệu mạnh', 'Ngành hàng phát triển tốt nhưng thương hiệu đang tụt lại — cơ hội đầu tư', 'Không có cơ hội gì', 'Nên rút hết ngân sách khỏi thị trường đó'], correctIndex: 1, explanation: 'CDI cao = ngành hàng phát triển; BDI thấp = thương hiệu chưa khai thác hết — đây là cơ hội.' },
  { id: 'q3', question: 'Nhược điểm chính của phương pháp "% doanh số" là gì?', options: ['Quá phức tạp để tính', 'Gắn chi tiêu vào kết quả quá khứ, không theo cơ hội thực tế', 'Không thể áp dụng cho công ty nhỏ', 'Luôn tốn nhiều tiền hơn objective-and-task'], correctIndex: 1, explanation: '% doanh số dựa vào doanh thu đã có, không phản ánh đúng cơ hội thị trường hiện tại.' },
]);

const c7 = doc('mpl201-7-1-buying-negotiation', '7.1 — Media buying & negotiation|||7.1 — Media buying & đàm phán',
  'Khác biệt planner vs buyer; đòn bẩy đàm phán (rate card vs giá đã đàm phán, added value, make-good); quy trình RFP.',
  [[
    `<span class="eyebrow">MPL201 · Chapter 7 · Lesson 7.1</span>
<h2>Media buying &amp; negotiation</h2>
<h3>Planner vs buyer</h3>
<p>The <strong>planner</strong> decides strategy — which audience, which channels, how much weight, what schedule. The <strong>buyer</strong> turns that plan into contracts — negotiating price, placement, and guarantees with media owners. The same person can hold both roles in a small agency, but the responsibilities are distinct.</p>
<h3>Negotiation levers</h3>
<ul>
<li><strong>Rate card vs negotiated rate</strong> — the published "rate card" price is a starting point; buyers with volume or long-term relationships negotiate lower actual rates.</li>
<li><strong>Added value / bonus spots</strong> — extra placements, sponsorships or content thrown in at no extra cost, common when a media owner wants to keep a client.</li>
<li><strong>Guarantees &amp; make-good</strong> — if a schedule under-delivers on promised audience/impressions, the media owner must run extra ("make-good") spots free of charge to make up the shortfall.</li>
</ul>
<h3>The RFP process</h3>
<p>For larger plans, buyers issue an <strong>RFP (Request for Proposal)</strong> to multiple media owners, comparing their audience data, pricing and added value before committing — creating competitive pressure that improves terms.</p>
<div class="callout"><span class="badge">Buying is not just price</span> A cheaper CPM with no guarantee and no added value can cost more in the long run than a slightly higher rate backed by a strong make-good clause.</div>`,
    `<span class="eyebrow">MPL201 · Chương 7 · Bài 7.1</span>
<h2>Media buying &amp; đàm phán</h2>
<h3>Planner vs buyer</h3>
<p><strong>Planner</strong> quyết định chiến lược — đối tượng nào, kênh nào, trọng lượng bao nhiêu, lịch chạy ra sao. <strong>Buyer</strong> chuyển kế hoạch đó thành hợp đồng — đàm phán giá, vị trí và các đảm bảo với media owner. Ở agency nhỏ một người có thể làm cả hai vai, nhưng trách nhiệm là khác nhau.</p>
<h3>Đòn bẩy đàm phán</h3>
<ul>
<li><strong>Rate card vs giá đã đàm phán</strong> — giá "rate card" công bố chỉ là điểm khởi đầu; buyer có khối lượng lớn hoặc quan hệ lâu năm đàm phán được giá thực thấp hơn.</li>
<li><strong>Added value / bonus spots</strong> — vị trí, tài trợ hoặc nội dung thêm được tặng kèm không tính phí, phổ biến khi media owner muốn giữ khách hàng.</li>
<li><strong>Đảm bảo &amp; make-good</strong> — nếu lịch chạy không đạt số đối tượng/impressions đã hứa, media owner phải chạy thêm spot bù ("make-good") miễn phí để bù thiếu hụt.</li>
</ul>
<h3>Quy trình RFP</h3>
<p>Với kế hoạch lớn, buyer gửi <strong>RFP (Request for Proposal)</strong> tới nhiều media owner, so sánh dữ liệu đối tượng, giá và added value của họ trước khi chốt — tạo áp lực cạnh tranh giúp cải thiện điều khoản.</p>
<div class="callout"><span class="badge">Mua không chỉ là giá</span> Một CPM rẻ hơn nhưng không có đảm bảo và không added value có thể tốn kém hơn về lâu dài so với giá nhích hơn chút nhưng có điều khoản make-good chắc chắn.</div>`,
  ]]);

const c7q = quiz('mpl201-quiz-7', 'Quiz 7 — Buying & negotiation|||Quiz 7 — Buying & đàm phán', [
  { id: 'q1', question: 'Vai trò nào chịu trách nhiệm đàm phán giá và ký hợp đồng với media owner?', options: ['Media planner', 'Media buyer', 'Client', 'Creative director'], correctIndex: 1, explanation: 'Planner quyết chiến lược; buyer thực thi đàm phán & mua thật.' },
  { id: 'q2', question: 'Điều khoản "make-good" có nghĩa là?', options: ['Giảm giá vĩnh viễn cho hợp đồng sau', 'Chạy thêm spot miễn phí để bù khi lịch chạy không đạt cam kết', 'Huỷ hợp đồng ngay lập tức', 'Tăng giá khi vượt cam kết'], correctIndex: 1, explanation: 'Make-good bù thiếu hụt bằng spot miễn phí khi audience/impressions không đạt như hứa.' },
  { id: 'q3', question: 'Vì sao buyer thường gửi RFP tới nhiều media owner trước khi chốt?', options: ['Để làm chậm tiến độ', 'Tạo áp lực cạnh tranh, so sánh giá & added value để có điều khoản tốt hơn', 'Vì luật yêu cầu', 'Không có lý do thực tế'], correctIndex: 1, explanation: 'So sánh nhiều đề xuất tạo cạnh tranh, giúp buyer đàm phán được điều khoản tốt hơn.' },
]);

const c8 = doc('mpl201-8-1-measurement-programmatic', '8.1 — Measuring effectiveness, digital/programmatic media & optimization|||8.1 — Đo hiệu quả, media số/programmatic & tối ưu',
  'KPI (impressions, CTR, conversion, ROAS); programmatic (RTB, DSP/SSP, ad exchange); mô hình attribution; chu trình tối ưu đo → phân tích → điều chỉnh.',
  [[
    `<span class="eyebrow">MPL201 · Chapter 8 · Lesson 8.1</span>
<h2>Measuring effectiveness, digital/programmatic media &amp; optimization</h2>
<h3>Key performance indicators (KPIs)</h3>
<ul>
<li><strong>Impressions</strong> — number of times an ad was displayed.</li>
<li><strong>CTR (Click-Through Rate)</strong> — clicks / impressions — measures message relevance/interest.</li>
<li><strong>Conversion rate</strong> — the % of clicks (or exposures) that complete a desired action (purchase, sign-up).</li>
<li><strong>ROAS (Return On Ad Spend)</strong> — revenue generated / media cost — the ultimate business-level KPI.</li>
</ul>
<h3>Programmatic media buying</h3>
<pre><code>Advertiser -> DSP (Demand-Side Platform) -> Ad Exchange -> SSP (Supply-Side Platform) -> Publisher

RTB (Real-Time Bidding): each individual ad impression is auctioned in milliseconds;
the DSP bids on behalf of the advertiser based on the value of THAT specific user/context.
</code></pre>
<p>Programmatic replaces manual, channel-by-channel negotiation with automated, audience-based buying across a huge pool of digital inventory in real time.</p>
<h3>Attribution</h3>
<p><strong>Last-click attribution</strong> gives 100% credit to the final touchpoint before conversion — simple but misleading, since it ignores earlier exposures that built awareness. <strong>Multi-touch attribution</strong> splits credit across every touchpoint in the customer journey, giving a fairer read of which channels actually contributed.</p>
<h3>The optimization loop</h3>
<p><strong>Measure</strong> (collect the KPIs) → <strong>analyze</strong> (which audience/placement/creative performs) → <strong>adjust</strong> (shift budget toward what works) — repeated continuously, which is exactly what makes digital/programmatic media different from a fixed traditional schedule.</p>
<div class="callout"><span class="badge">Nielsen &amp; Google measurement</span> Nielsen provides cross-media reach/frequency measurement; Google's tools (Reach Planner, Campaign Manager) measure digital delivery and support the same reach/frequency/GRP logic learned in Chapter 3 — the metrics don't change, only the data source does.</div>`,
    `<span class="eyebrow">MPL201 · Chương 8 · Bài 8.1</span>
<h2>Đo hiệu quả, media số/programmatic &amp; tối ưu</h2>
<h3>Các chỉ số hiệu quả (KPI)</h3>
<ul>
<li><strong>Impressions</strong> — số lần quảng cáo được hiển thị.</li>
<li><strong>CTR (Click-Through Rate)</strong> — click / impressions — đo mức liên quan/thu hút của thông điệp.</li>
<li><strong>Tỉ lệ chuyển đổi (conversion rate)</strong> — % click (hoặc lượt tiếp cận) hoàn tất hành động mong muốn (mua, đăng ký).</li>
<li><strong>ROAS (Return On Ad Spend)</strong> — doanh thu tạo ra / chi phí media — KPI cấp kinh doanh cao nhất.</li>
</ul>
<h3>Mua media programmatic</h3>
<pre><code>Nhà quảng cáo -> DSP (Demand-Side Platform) -> Ad Exchange -> SSP (Supply-Side Platform) -> Publisher

RTB (Real-Time Bidding - đấu giá thời gian thực): mỗi lượt hiển thị quảng cáo riêng lẻ
được đấu giá trong vài mili giây; DSP đấu giá thay nhà quảng cáo dựa trên giá trị của
CHÍNH người dùng/ngữ cảnh đó.
</code></pre>
<p>Programmatic thay đàm phán thủ công theo từng kênh bằng mua tự động, theo đối tượng, trên một lượng lớn inventory digital trong thời gian thực.</p>
<h3>Attribution (phân bổ đóng góp)</h3>
<p><strong>Last-click attribution</strong> gán 100% công cho điểm chạm cuối cùng trước chuyển đổi — đơn giản nhưng dễ gây hiểu lầm, vì bỏ qua các lần tiếp xúc trước đó đã xây nhận biết. <strong>Multi-touch attribution</strong> chia công cho mọi điểm chạm trong hành trình khách hàng, phản ánh công bằng hơn kênh nào thực sự đóng góp.</p>
<h3>Chu trình tối ưu</h3>
<p><strong>Đo</strong> (thu thập KPI) → <strong>phân tích</strong> (đối tượng/vị trí/creative nào hiệu quả) → <strong>điều chỉnh</strong> (chuyển ngân sách sang chỗ hiệu quả) — lặp lại liên tục, đây chính là điều làm media digital/programmatic khác với lịch chạy truyền thống cố định.</p>
<div class="callout"><span class="badge">Đo lường Nielsen &amp; Google</span> Nielsen cung cấp đo reach/frequency xuyên kênh; công cụ của Google (Reach Planner, Campaign Manager) đo phân phối digital và vẫn dùng đúng logic reach/frequency/GRP đã học ở Chương 3 — chỉ số không đổi, chỉ nguồn dữ liệu thay đổi.</div>`,
  ]]);

const c8q = quiz('mpl201-quiz-8', 'Quiz 8 — Measurement & programmatic|||Quiz 8 — Đo hiệu quả & programmatic', [
  { id: 'q1', question: 'RTB (Real-Time Bidding) trong programmatic có nghĩa là?', options: ['Đàm phán giá một lần cho cả năm', 'Mỗi lượt hiển thị quảng cáo được đấu giá riêng trong thời gian thực', 'Chỉ áp dụng cho TV', 'Giá cố định không thay đổi'], correctIndex: 1, explanation: 'RTB đấu giá từng impression riêng lẻ trong vài mili giây qua DSP/SSP/Ad Exchange.' },
  { id: 'q2', question: 'Nhược điểm chính của last-click attribution là gì?', options: ['Tính toán quá phức tạp', 'Bỏ qua các điểm chạm trước đó đã xây nhận biết, chỉ tính công cho điểm chạm cuối', 'Không thể áp dụng cho digital', 'Luôn đánh giá thấp kênh cuối cùng'], correctIndex: 1, explanation: 'Last-click gán 100% công cho điểm chạm cuối, bỏ qua vai trò của các điểm chạm trước.' },
  { id: 'q3', question: 'Chu trình tối ưu media digital gồm 3 bước nào?', options: ['Lập kế hoạch → in ấn → phát hành', 'Đo → phân tích → điều chỉnh', 'Đàm phán → ký hợp đồng → thanh toán', 'Sáng tạo → duyệt → chạy'], correctIndex: 1, explanation: 'Đo (KPI) → phân tích (cái gì hiệu quả) → điều chỉnh (chuyển ngân sách) rồi lặp lại.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'MPL201',
    slug: 'mpl201-media-planning',
    title: 'Media Planning',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/MPL201.webp',
    shortDescription: 'How brands plan ad campaigns — objectives & audience, media metrics (reach, frequency, GRP, CPM, CPP), channel strategy, scheduling, budgeting, buying & negotiation, measurement & programmatic. Bilingual, with formulas & quizzes.|||Cách xây kế hoạch truyền thông quảng cáo — mục tiêu & đối tượng, chỉ số media (reach, frequency, GRP, CPM, CPP), chiến lược kênh, lập lịch, ngân sách, mua media & đàm phán, đo hiệu quả & programmatic. Song ngữ, có công thức & quiz.',
    description: 'Môn <strong>MPL201 — Media Planning</strong> (kỳ 4, khối Quản trị Kinh doanh) dạy cách xây <strong>kế hoạch truyền thông/quảng cáo</strong>. Từ <strong>mục tiêu &amp; đối tượng mục tiêu</strong> → <strong>chỉ số media</strong> (reach, frequency, GRP, CPM, CPP) → <strong>chiến lược &amp; lựa chọn kênh</strong> (TV, digital, OOH...) → <strong>lập lịch</strong> (flighting/pulsing/continuity) → <strong>ngân sách &amp; phân bổ</strong> (BDI/CDI) → <strong>media buying &amp; đàm phán</strong> → <strong>đo hiệu quả, media số/programmatic &amp; tối ưu</strong>. Bám giáo trình Sissors/Baron &amp; Kelley, song ngữ, có công thức tính và quiz mỗi chương.',
    whatYouLearn: 'Vai trò &amp; các bên trong media planning; mục tiêu SMART &amp; phân khúc đối tượng mục tiêu; reach/frequency/GRP/effective frequency/CPM/CPP; chiến lược &amp; lựa chọn kênh (TV/digital/OOH), media mix; lập lịch flighting/pulsing/continuity; phương pháp ngân sách &amp; phân bổ BDI/CDI; media buying, rate card/added value/make-good, RFP; KPI, programmatic (RTB/DSP/SSP), attribution &amp; chu trình tối ưu.',
    requirements: 'Kiến thức marketing cơ bản (marketing mix, phân khúc thị trường). Không yêu cầu công cụ đặc biệt; nên tham khảo Google Reach Planner để thực hành.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình trên FLM, sách Sissors/Baron & Kelley, tài liệu Nielsen/Google, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Media planning là gì, vị trí trong chuỗi marketing → advertising → media, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan & vai trò|||Chapter 1 — Overview & role', description: 'Định nghĩa Sissors/Baron, các bên liên quan, chuỗi phân cấp marketing→media.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Mục tiêu & đối tượng mục tiêu|||Chapter 2 — Objectives & target audience', description: 'Mục tiêu SMART, phân khúc đối tượng, đối tượng chính/phụ, nguồn nghiên cứu.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Chỉ số media|||Chapter 3 — Media metrics', description: 'Reach, frequency, GRP, effective frequency, CPM, CPP — công thức & ví dụ.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Chiến lược & lựa chọn kênh|||Chapter 4 — Strategy & channel selection', description: 'TV/radio/print/OOH vs digital, tiêu chí chọn kênh, media mix.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Lập lịch media|||Chapter 5 — Media scheduling', description: 'Continuity, flighting, pulsing — khi nào dùng mô hình nào.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Ngân sách & phân bổ|||Chapter 6 — Budget & allocation', description: 'Phương pháp lập ngân sách, phân bổ thị trường bằng BDI/CDI.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Media buying & đàm phán|||Chapter 7 — Media buying & negotiation', description: 'Planner vs buyer, đòn bẩy đàm phán, make-good, RFP.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Đo hiệu quả & programmatic|||Chapter 8 — Measurement & programmatic', description: 'KPI, RTB/DSP/SSP, attribution, chu trình tối ưu.', lessons: [c8, c8q] },
  ],
};
