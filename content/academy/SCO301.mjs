/**
 * SCO301 — Sustainable Communication (Truyền thông bền vững). Khối Công nghệ
 * Truyền thông FPTU, Kỳ 4. Khung chất lượng, song ngữ VI+EN. Nguồn chuẩn:
 * Godemann & Michelsen "Sustainability Communication"; Belz & Peattie
 * "Sustainability Marketing"; UN SDGs; GRI Standards; UN Principles for
 * Responsible Communication. Giữ NGUYÊN slug/semester/thumb. 8 chương.
 * ⚠️ KHÔNG backtick lồng/${; "&"→&amp; trong HTML; content JOIN ra STRING.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('sco301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách nền, khung chuẩn quốc tế (SDGs, GRI), YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">SCO301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Sustainable Communication</strong> — sustainability &amp; ESG, international frameworks, CSR &amp; brand, greenwashing, behavior change, storytelling, stakeholders and reporting — in one place. The official slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for SCO301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li>Godemann &amp; Michelsen — <em>Sustainability Communication: Interdisciplinary Perspectives and Theoretical Foundation</em> (Springer).</li>
<li>Belz &amp; Peattie — <em>Sustainability Marketing: A Global Perspective</em> (Wiley).</li>
<li>Weder, Krainer &amp; Karmasin (eds.) — <em>The Sustainability Communication Reader</em>.</li>
</ul>
<h3>🌐 Official / free frameworks</h3>
<ul>
<li><a href="https://sdgs.un.org/goals" target="_blank" rel="noopener">UN Sustainable Development Goals (the 17 SDGs)</a></li>
<li><a href="https://www.globalreporting.org/standards/" target="_blank" rel="noopener">GRI Sustainability Reporting Standards</a></li>
<li><a href="https://unfccc.int/process-and-meetings/the-paris-agreement" target="_blank" rel="noopener">UNFCCC — The Paris Agreement</a></li>
<li><a href="https://www.unep.org/" target="_blank" rel="noopener">UN Environment Programme (UNEP)</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@UnitedNations" target="_blank" rel="noopener">United Nations</a> — SDGs &amp; climate explainers</li>
<li><a href="https://www.youtube.com/@patagonia" target="_blank" rel="noopener">Patagonia</a> — sustainability storytelling in practice</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.globalreporting.org/" target="_blank" rel="noopener">GRI</a> — reporting standards &amp; templates</li>
<li><a href="https://sciencebasedtargets.org/" target="_blank" rel="noopener">Science Based Targets initiative (SBTi)</a> — credible climate targets</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — what sustainability, ESG and the triple bottom line mean; why communication matters.</li>
<li><strong>Frameworks</strong> — learn the SDGs, Paris Agreement and GRI so your claims map to a standard.</li>
<li><strong>Craft</strong> — CSR &amp; purpose messaging, spotting greenwashing, behavior-change framing and storytelling.</li>
<li><strong>Job-ready</strong> — engage stakeholders, measure impact and write an honest sustainability report.</li>
</ol></div>`,
    `<span class="eyebrow">SCO301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Truyền thông bền vững</strong> — bền vững &amp; ESG, khung quốc tế, CSR &amp; thương hiệu, greenwashing, đổi hành vi, kể chuyện, bên liên quan và báo cáo — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của SCO301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách nền</h3>
<ul>
<li>Godemann &amp; Michelsen — <em>Sustainability Communication</em> (Springer).</li>
<li>Belz &amp; Peattie — <em>Sustainability Marketing: A Global Perspective</em> (Wiley).</li>
<li>Weder, Krainer &amp; Karmasin (chủ biên) — <em>The Sustainability Communication Reader</em>.</li>
</ul>
<h3>🌐 Khung chuẩn / miễn phí</h3>
<ul>
<li><a href="https://sdgs.un.org/goals" target="_blank" rel="noopener">Mục tiêu Phát triển Bền vững của LHQ (17 SDGs)</a></li>
<li><a href="https://www.globalreporting.org/standards/" target="_blank" rel="noopener">Bộ chuẩn báo cáo bền vững GRI</a></li>
<li><a href="https://unfccc.int/process-and-meetings/the-paris-agreement" target="_blank" rel="noopener">UNFCCC — Thoả thuận Paris</a></li>
<li><a href="https://www.unep.org/" target="_blank" rel="noopener">Chương trình Môi trường LHQ (UNEP)</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@UnitedNations" target="_blank" rel="noopener">United Nations</a> — giảng SDGs &amp; khí hậu</li>
<li><a href="https://www.youtube.com/@patagonia" target="_blank" rel="noopener">Patagonia</a> — kể chuyện bền vững trong thực tế</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.globalreporting.org/" target="_blank" rel="noopener">GRI</a> — chuẩn &amp; mẫu báo cáo</li>
<li><a href="https://sciencebasedtargets.org/" target="_blank" rel="noopener">Science Based Targets (SBTi)</a> — mục tiêu khí hậu đáng tin</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền</strong> — hiểu bền vững, ESG và ba trụ cột lợi ích; vì sao truyền thông quan trọng.</li>
<li><strong>Khung</strong> — nắm SDGs, Thoả thuận Paris và GRI để tuyên bố có chuẩn để đối chiếu.</li>
<li><strong>Kỹ năng</strong> — thông điệp CSR &amp; mục đích, nhận diện greenwashing, khung đổi hành vi và kể chuyện.</li>
<li><strong>Sẵn sàng đi làm</strong> — gắn kết bên liên quan, đo lường tác động và viết báo cáo bền vững trung thực.</li>
</ol></div>`,
  ]]);

const intro = doc('sco301-0-1-overview', 'Course overview: Sustainable communication|||Tổng quan: Truyền thông bền vững',
  'Truyền thông bền vững là gì và vì sao quan trọng; lộ trình 4 bước: nền & khung quốc tế → CSR & thương hiệu → greenwashing & đổi hành vi → kể chuyện, bên liên quan & báo cáo.',
  [[
    `<span class="eyebrow">SCO301 · Lesson 0.1 · Overview</span>
<h2>Sustainable Communication</h2>
<p class="lead">This course helps you understand <strong>how to communicate sustainability honestly and effectively</strong> — the knowledge behind CSR campaigns, ESG reports, green brands and behavior-change programs. You will learn to turn credible sustainability facts into messages people trust and act on, without crossing into <strong>greenwashing</strong>.</p>
<h3>Why it matters</h3>
<p>Audiences, investors and regulators increasingly judge organizations on their environmental and social conduct. Good communication makes real progress visible and builds trust; bad communication (vague or false green claims) destroys it — and is now fined in many markets. Communication is not decoration on sustainability; it is part of how change actually happens.</p>
<h3>Roadmap</h3>
<p>Foundations (sustainability, ESG, role of communication) &amp; international frameworks (SDGs, Paris, GRI) → CSR &amp; purpose-driven brands → greenwashing &amp; ethics → messages &amp; behavior change → storytelling → stakeholders &amp; internal communication → measurement &amp; reporting. Bilingual, with real brand cases and quizzes.</p>`,
    `<span class="eyebrow">SCO301 · Bài 0.1 · Tổng quan</span>
<h2>Truyền thông bền vững</h2>
<p class="lead">Môn này giúp bạn hiểu <strong>cách truyền thông về bền vững một cách trung thực và hiệu quả</strong> — kiến thức nền sau các chiến dịch CSR, báo cáo ESG, thương hiệu xanh và chương trình đổi hành vi. Bạn học cách biến dữ kiện bền vững đáng tin thành thông điệp mà người ta tin và hành động theo, mà không rơi vào <strong>greenwashing</strong>.</p>
<h3>Vì sao quan trọng</h3>
<p>Công chúng, nhà đầu tư và cơ quan quản lý ngày càng đánh giá tổ chức qua ứng xử môi trường và xã hội. Truyền thông tốt làm tiến bộ thật trở nên nhìn thấy được và xây niềm tin; truyền thông tồi (tuyên bố xanh mơ hồ hoặc sai) phá huỷ niềm tin — và nay bị phạt ở nhiều thị trường. Truyền thông không phải lớp trang trí cho bền vững; nó là một phần cách thay đổi thực sự diễn ra.</p>
<h3>Lộ trình</h3>
<p>Nền (bền vững, ESG, vai trò truyền thông) &amp; khung quốc tế (SDGs, Paris, GRI) → CSR &amp; thương hiệu vì mục đích → greenwashing &amp; đạo đức → thông điệp &amp; đổi hành vi → kể chuyện → bên liên quan &amp; truyền thông nội bộ → đo lường &amp; báo cáo. Song ngữ, có ca thương hiệu thật và quiz.</p>`,
  ]]);

const c1 = doc('sco301-1-1-what-is', '1.1 — What is sustainable communication|||1.1 — Truyền thông bền vững là gì',
  'Khái niệm; phát triển bền vững (Brundtland); ba trụ cột ESG / triple bottom line (people–planet–profit); vai trò của truyền thông. Ví dụ: sứ mệnh Patagonia.',
  [[
    `<span class="eyebrow">SCO301 · Chapter 1 · Lesson 1.1</span>
<h2>What is sustainable communication?</h2>
<h3>Sustainable development</h3>
<p>The classic <strong>Brundtland</strong> definition: development that <em>meets the needs of the present without compromising the ability of future generations to meet their own needs</em>. Sustainability is therefore about the long term and about fairness across generations.</p>
<h3>The three pillars — ESG &amp; the triple bottom line</h3>
<ul>
<li><strong>Environmental</strong> — climate, emissions, water, waste, biodiversity ("planet").</li>
<li><strong>Social</strong> — labor, human rights, communities, diversity ("people").</li>
<li><strong>Governance</strong> — ethics, transparency, accountability (how the org is run).</li>
</ul>
<p>Business often frames the same idea as the <strong>triple bottom line: people, planet, profit</strong> — success measured on three axes, not one.</p>
<h3>The role of communication</h3>
<p><strong>Sustainability communication</strong> is the process of making sustainability issues, values and progress understandable and actionable for audiences. It informs, builds legitimacy and trust, and can mobilize behavior — but only when claims are accurate and backed by evidence.</p>
<div class="callout"><span class="badge">Brand example — Patagonia</span> Patagonia's mission — "We're in business to save our home planet" — puts sustainability at the center of the brand, not in a side CSR brochure. Communication and purpose are the same thing.</div>`,
    `<span class="eyebrow">SCO301 · Chương 1 · Bài 1.1</span>
<h2>Truyền thông bền vững là gì?</h2>
<h3>Phát triển bền vững</h3>
<p>Định nghĩa kinh điển <strong>Brundtland</strong>: phát triển <em>đáp ứng nhu cầu hiện tại mà không làm tổn hại khả năng đáp ứng nhu cầu của các thế hệ tương lai</em>. Bền vững vì thế nói về dài hạn và về công bằng giữa các thế hệ.</p>
<h3>Ba trụ cột — ESG &amp; triple bottom line</h3>
<ul>
<li><strong>Môi trường (E)</strong> — khí hậu, phát thải, nước, rác thải, đa dạng sinh học ("planet").</li>
<li><strong>Xã hội (S)</strong> — lao động, quyền con người, cộng đồng, đa dạng ("people").</li>
<li><strong>Quản trị (G)</strong> — đạo đức, minh bạch, trách nhiệm giải trình (cách tổ chức được vận hành).</li>
</ul>
<p>Doanh nghiệp thường gọi cùng ý đó là <strong>triple bottom line: con người, hành tinh, lợi nhuận</strong> — đo thành công trên ba trục, không phải một.</p>
<h3>Vai trò của truyền thông</h3>
<p><strong>Truyền thông bền vững</strong> là quá trình làm cho các vấn đề, giá trị và tiến bộ bền vững trở nên dễ hiểu và có thể hành động với công chúng. Nó thông tin, xây tính chính danh và niềm tin, và có thể huy động hành vi — nhưng chỉ khi tuyên bố chính xác và có bằng chứng.</p>
<div class="callout"><span class="badge">Ví dụ thương hiệu — Patagonia</span> Sứ mệnh của Patagonia — "We're in business to save our home planet" — đặt bền vững ở trung tâm thương hiệu, không phải trong một tờ rơi CSR bên lề. Truyền thông và mục đích là một.</div>`,
  ]]);

const c1q = quiz('sco301-quiz-1', 'Quiz 1 — Foundations|||Quiz 1 — Nền tảng', [
  { id: 'q1', question: 'Định nghĩa Brundtland về phát triển bền vững nhấn mạnh?', options: ['Tối đa lợi nhuận ngắn hạn', 'Đáp ứng nhu cầu hiện tại mà không hại thế hệ tương lai', 'Chỉ bảo vệ môi trường', 'Tăng trưởng GDP nhanh nhất'], correctIndex: 1, explanation: 'Brundtland: đáp ứng nhu cầu hiện tại mà không làm tổn hại khả năng của thế hệ tương lai.' },
  { id: 'q2', question: 'Ba chữ cái ESG là viết tắt của?', options: ['Economy–Society–Growth', 'Environmental–Social–Governance', 'Energy–Safety–Green', 'Ethics–Sales–Goals'], correctIndex: 1, explanation: 'ESG = Environmental (môi trường), Social (xã hội), Governance (quản trị).' },
  { id: 'q3', question: 'Triple bottom line đo thành công trên ba trục nào?', options: ['Giá–chất lượng–thời gian', 'People–planet–profit', 'Vốn–lãi–rủi ro', 'Đất–nước–không khí'], correctIndex: 1, explanation: 'Triple bottom line: con người, hành tinh, lợi nhuận (people, planet, profit).' },
]);

const c2 = doc('sco301-2-1-frameworks', '2.1 — Context & international frameworks|||2.1 — Bối cảnh & khung quốc tế',
  'SDGs của LHQ (17 mục tiêu, 2030); Thoả thuận Paris (giữ nóng lên < 1,5–2°C); ESG cho nhà đầu tư; báo cáo GRI. Vì sao khung giúp tuyên bố có chuẩn để đối chiếu.',
  [[
    `<span class="eyebrow">SCO301 · Chapter 2 · Lesson 2.1</span>
<h2>Context &amp; international frameworks</h2>
<p>Credible sustainability communication maps claims to recognized frameworks, so an audience can check them against a standard rather than take your word for it.</p>
<h3>UN Sustainable Development Goals (SDGs)</h3>
<p>Adopted by all UN members in 2015, the <strong>17 SDGs</strong> (with 169 targets, aimed at 2030) cover poverty, health, education, clean energy, climate, responsible consumption and more. Organizations use them as a shared language — e.g. "this program supports SDG 12: Responsible Consumption and Production".</p>
<h3>The Paris Agreement</h3>
<p>A 2015 climate treaty to hold global warming <strong>well below 2°C, pursuing 1.5°C</strong> above pre-industrial levels. It gives climate communication a concrete, science-based reference point (net-zero, carbon budgets).</p>
<h3>ESG &amp; GRI reporting</h3>
<ul>
<li><strong>ESG</strong> — the lens investors use to score environmental, social and governance performance.</li>
<li><strong>GRI Standards</strong> — the most widely used framework for <strong>sustainability reports</strong>: a common structure and disclosures so reports are comparable and material.</li>
</ul>
<div class="callout"><span class="badge">Why frameworks help</span> Naming the SDG, the Paris target or the GRI disclosure behind a claim turns "we care about the planet" into something specific, comparable and verifiable.</div>`,
    `<span class="eyebrow">SCO301 · Chương 2 · Bài 2.1</span>
<h2>Bối cảnh &amp; khung quốc tế</h2>
<p>Truyền thông bền vững đáng tin gắn tuyên bố vào các khung được công nhận, để công chúng đối chiếu với một chuẩn thay vì phải tin lời bạn.</p>
<h3>Mục tiêu Phát triển Bền vững của LHQ (SDGs)</h3>
<p>Được mọi thành viên LHQ thông qua năm 2015, <strong>17 SDGs</strong> (với 169 chỉ tiêu, hướng tới 2030) bao trùm nghèo đói, y tế, giáo dục, năng lượng sạch, khí hậu, tiêu dùng có trách nhiệm và hơn thế. Tổ chức dùng chúng như một ngôn ngữ chung — vd "chương trình này ủng hộ SDG 12: Tiêu dùng &amp; Sản xuất có trách nhiệm".</p>
<h3>Thoả thuận Paris</h3>
<p>Hiệp ước khí hậu 2015 nhằm giữ nóng lên toàn cầu <strong>dưới 2°C, hướng tới 1,5°C</strong> so với thời tiền công nghiệp. Nó cho truyền thông khí hậu một điểm quy chiếu cụ thể, dựa trên khoa học (net-zero, ngân sách carbon).</p>
<h3>ESG &amp; báo cáo GRI</h3>
<ul>
<li><strong>ESG</strong> — lăng kính nhà đầu tư dùng để chấm điểm hiệu quả môi trường, xã hội, quản trị.</li>
<li><strong>Chuẩn GRI</strong> — khung được dùng nhiều nhất cho <strong>báo cáo bền vững</strong>: cấu trúc và mục công bố chung để báo cáo so sánh được và trọng yếu.</li>
</ul>
<div class="callout"><span class="badge">Vì sao khung giúp</span> Gọi tên SDG, mục tiêu Paris hay mục công bố GRI đứng sau một tuyên bố biến "chúng tôi quan tâm hành tinh" thành thứ cụ thể, so sánh được và kiểm chứng được.</div>`,
  ]]);

const c2q = quiz('sco301-quiz-2', 'Quiz 2 — Frameworks|||Quiz 2 — Khung quốc tế', [
  { id: 'q1', question: 'Có bao nhiêu Mục tiêu Phát triển Bền vững (SDGs) của LHQ?', options: ['7', '12', '17', '30'], correctIndex: 2, explanation: 'Có 17 SDGs với 169 chỉ tiêu, hướng tới năm 2030.' },
  { id: 'q2', question: 'Thoả thuận Paris đặt mục tiêu giữ nóng lên toàn cầu?', options: ['Dưới 5°C', 'Well below 2°C, hướng tới 1,5°C', 'Đúng bằng 3°C', 'Không đặt con số nào'], correctIndex: 1, explanation: 'Paris: giữ dưới 2°C và nỗ lực hướng tới 1,5°C so với thời tiền công nghiệp.' },
  { id: 'q3', question: 'Khung được dùng phổ biến nhất cho báo cáo bền vững là?', options: ['GRI Standards', 'ISO 9001', 'HTML5', 'SWOT'], correctIndex: 0, explanation: 'GRI Standards là khung báo cáo bền vững được dùng rộng rãi nhất.' },
]);

const c3 = doc('sco301-3-1-csr-brand', '3.1 — CSR communication & sustainable brands|||3.1 — Truyền thông CSR & thương hiệu bền vững',
  'CSR communication; thương hiệu vì mục đích (purpose-driven); cause marketing. Ví dụ: Unilever Sustainable Living / Dove; TOMS "One for One".',
  [[
    `<span class="eyebrow">SCO301 · Chapter 3 · Lesson 3.1</span>
<h2>CSR communication &amp; sustainable brands</h2>
<h3>CSR communication</h3>
<p><strong>Corporate Social Responsibility (CSR)</strong> is a company's commitment to operate ethically and contribute to society and the environment. <strong>CSR communication</strong> shares those commitments and results with stakeholders. The rule of thumb: <em>do first, then talk</em> — communicate proven actions, not intentions.</p>
<h3>Purpose-driven brands</h3>
<p>A <strong>purpose-driven brand</strong> stands for something beyond profit and weaves that purpose through product, operations and messaging. Purpose only builds trust when the business actually lives it; otherwise it reads as marketing.</p>
<h3>Cause marketing</h3>
<p><strong>Cause marketing</strong> ties a product or campaign to a social/environmental cause (e.g. a share of sales funds a cause). Done well it aligns commercial and social goals; done cynically it becomes "cause-washing".</p>
<div class="callout"><span class="badge">Brand example — Unilever</span> Unilever's <strong>Sustainable Living</strong> plan tied brand purpose to measurable goals; <strong>Dove's "Real Beauty"</strong> built a purpose (self-esteem) into the brand for years. <strong>TOMS "One for One"</strong> is a classic cause-marketing model — later refined as critics questioned its real impact.</div>`,
    `<span class="eyebrow">SCO301 · Chương 3 · Bài 3.1</span>
<h2>Truyền thông CSR &amp; thương hiệu bền vững</h2>
<h3>Truyền thông CSR</h3>
<p><strong>Trách nhiệm xã hội của doanh nghiệp (CSR)</strong> là cam kết vận hành có đạo đức và đóng góp cho xã hội, môi trường. <strong>Truyền thông CSR</strong> chia sẻ các cam kết và kết quả đó với bên liên quan. Nguyên tắc: <em>làm trước, nói sau</em> — truyền thông hành động đã chứng minh, không phải ý định.</p>
<h3>Thương hiệu vì mục đích</h3>
<p><strong>Thương hiệu vì mục đích (purpose-driven)</strong> đại diện cho điều gì đó vượt trên lợi nhuận và dệt mục đích ấy xuyên suốt sản phẩm, vận hành và thông điệp. Mục đích chỉ xây niềm tin khi doanh nghiệp thật sự sống với nó; nếu không, nó chỉ là quảng cáo.</p>
<h3>Cause marketing</h3>
<p><strong>Cause marketing</strong> gắn sản phẩm hoặc chiến dịch với một mục đích xã hội/môi trường (vd một phần doanh thu tài trợ cho mục đích). Làm tốt thì hài hoà mục tiêu thương mại và xã hội; làm hời hợt thì thành "cause-washing".</p>
<div class="callout"><span class="badge">Ví dụ thương hiệu — Unilever</span> Kế hoạch <strong>Sustainable Living</strong> của Unilever gắn mục đích thương hiệu với mục tiêu đo được; <strong>"Real Beauty" của Dove</strong> dựng một mục đích (lòng tự tôn) vào thương hiệu suốt nhiều năm. <strong>TOMS "One for One"</strong> là mô hình cause-marketing kinh điển — sau này được điều chỉnh khi giới phê bình chất vấn tác động thật.</div>`,
  ]]);

const c3q = quiz('sco301-quiz-3', 'Quiz 3 — CSR & brand|||Quiz 3 — CSR & thương hiệu', [
  { id: 'q1', question: 'Nguyên tắc cốt lõi của truyền thông CSR là?', options: ['Nói trước, làm sau', 'Làm trước, nói sau (truyền thông hành động đã chứng minh)', 'Chỉ nói, không cần làm', 'Không bao giờ truyền thông CSR'], correctIndex: 1, explanation: 'Do first, then talk — truyền thông hành động thật đã có kết quả, không phải ý định.' },
  { id: 'q2', question: 'Thương hiệu "vì mục đích" (purpose-driven) đáng tin khi nào?', options: ['Khi có ngân sách quảng cáo lớn', 'Khi doanh nghiệp thật sự sống với mục đích đó', 'Khi khẩu hiệu nghe hay', 'Khi giá rẻ nhất thị trường'], correctIndex: 1, explanation: 'Mục đích chỉ xây niềm tin khi được thể hiện qua sản phẩm và vận hành thật.' },
  { id: 'q3', question: 'Cause marketing bị chỉ trích khi nào?', options: ['Khi gắn với mục đích thật và minh bạch', 'Khi hời hợt, tác động không thật ("cause-washing")', 'Khi công bố kết quả rõ ràng', 'Khi hài hoà mục tiêu thương mại và xã hội'], correctIndex: 1, explanation: 'Gắn mục đích chỉ để bán hàng mà không có tác động thật là "cause-washing".' },
]);

const c4 = doc('sco301-4-1-greenwashing', '4.1 — Greenwashing & ethics|||4.1 — Greenwashing & đạo đức',
  'Nhận diện greenwashing (mơ hồ, thiếu bằng chứng, đánh lạc hướng); minh bạch; tiêu chí truyền thông trung thực. Ví dụ: các án phạt thời trang nhanh vs "Don\'t buy this jacket" của Patagonia.',
  [[
    `<span class="eyebrow">SCO301 · Chapter 4 · Lesson 4.1</span>
<h2>Greenwashing &amp; ethics</h2>
<h3>What is greenwashing?</h3>
<p><strong>Greenwashing</strong> is making an organization look more environmentally responsible than it truly is. Common red flags:</p>
<ul>
<li><strong>Vagueness</strong> — "eco-friendly", "natural", "green" with no definition.</li>
<li><strong>No proof</strong> — claims with no data, standard or third-party certification.</li>
<li><strong>Hidden trade-off</strong> — highlighting one green feature while ignoring bigger harms.</li>
<li><strong>Irrelevance / false labels</strong> — true-but-meaningless claims, or invented "eco" seals.</li>
</ul>
<h3>Honest communication criteria</h3>
<ul>
<li><strong>Specific</strong> — a number, scope and timeframe ("cut emissions 30% by 2030 vs 2020").</li>
<li><strong>Evidence-based</strong> — backed by data and, ideally, independent certification.</li>
<li><strong>Balanced</strong> — acknowledge what is not yet solved; report progress, not perfection.</li>
<li><strong>Transparent</strong> — link to the full report so anyone can check.</li>
</ul>
<div class="callout"><span class="badge">Example — the contrast</span> Regulators have fined fashion and airline brands for vague "conscious" / "carbon-neutral" claims. In contrast, Patagonia's <strong>"Don't Buy This Jacket"</strong> ad urged customers to consume less — an honest, self-limiting message that built trust precisely because it worked against short-term sales.</div>`,
    `<span class="eyebrow">SCO301 · Chương 4 · Bài 4.1</span>
<h2>Greenwashing &amp; đạo đức</h2>
<h3>Greenwashing là gì?</h3>
<p><strong>Greenwashing</strong> là làm cho tổ chức trông có trách nhiệm môi trường hơn thực tế. Các dấu hiệu thường gặp:</p>
<ul>
<li><strong>Mơ hồ</strong> — "thân thiện môi trường", "tự nhiên", "xanh" mà không định nghĩa.</li>
<li><strong>Thiếu bằng chứng</strong> — tuyên bố không dữ liệu, không chuẩn, không chứng nhận bên thứ ba.</li>
<li><strong>Giấu đánh đổi</strong> — khoe một điểm xanh trong khi lờ đi tác hại lớn hơn.</li>
<li><strong>Vô nghĩa / nhãn giả</strong> — đúng nhưng vô nghĩa, hoặc tự bịa "con dấu sinh thái".</li>
</ul>
<h3>Tiêu chí truyền thông trung thực</h3>
<ul>
<li><strong>Cụ thể</strong> — có con số, phạm vi và mốc thời gian ("giảm 30% phát thải tới 2030 so với 2020").</li>
<li><strong>Dựa bằng chứng</strong> — có dữ liệu và, tốt nhất, chứng nhận độc lập.</li>
<li><strong>Cân bằng</strong> — thừa nhận điều chưa giải quyết; báo tiến bộ, không phải sự hoàn hảo.</li>
<li><strong>Minh bạch</strong> — dẫn link tới báo cáo đầy đủ để ai cũng kiểm được.</li>
</ul>
<div class="callout"><span class="badge">Ví dụ — sự tương phản</span> Cơ quan quản lý đã phạt các thương hiệu thời trang và hàng không vì tuyên bố "conscious" / "trung hoà carbon" mơ hồ. Ngược lại, quảng cáo <strong>"Don't Buy This Jacket"</strong> của Patagonia kêu gọi khách mua ít đi — một thông điệp tự giới hạn, trung thực, xây niềm tin chính vì nó đi ngược doanh số ngắn hạn.</div>`,
  ]]);

const c4q = quiz('sco301-quiz-4', 'Quiz 4 — Greenwashing|||Quiz 4 — Greenwashing', [
  { id: 'q1', question: 'Greenwashing là?', options: ['Rửa sản phẩm bằng chất xanh', 'Làm tổ chức trông có trách nhiệm môi trường hơn thực tế', 'Một chuẩn báo cáo bền vững', 'Kỹ thuật in nhãn'], correctIndex: 1, explanation: 'Greenwashing = phóng đại/nguỵ tạo hình ảnh môi trường so với thực tế.' },
  { id: 'q2', question: 'Đâu là dấu hiệu greenwashing?', options: ['Con số cụ thể có mốc thời gian', 'Chứng nhận bên thứ ba', 'Từ mơ hồ như "eco-friendly" không bằng chứng', 'Link tới báo cáo đầy đủ'], correctIndex: 2, explanation: 'Tuyên bố mơ hồ, thiếu định nghĩa và bằng chứng là dấu hiệu điển hình.' },
  { id: 'q3', question: 'Một tuyên bố bền vững trung thực nên?', options: ['Chung chung để linh hoạt', 'Cụ thể, có bằng chứng và minh bạch', 'Chỉ khoe điểm tốt, giấu phần chưa xong', 'Không cần dữ liệu'], correctIndex: 1, explanation: 'Trung thực = cụ thể, dựa bằng chứng, cân bằng và minh bạch.' },
]);

const c5 = doc('sco301-5-1-behavior-change', '5.1 — Messages & behavior change|||5.1 — Thông điệp & thay đổi hành vi',
  'Behavior change communication; nudge (huých); khung thông điệp môi trường (gain vs loss, chuẩn mực xã hội, kêu gọi hành động cụ thể). Ví dụ: chuẩn mực xã hội "tái dùng khăn khách sạn".',
  [[
    `<span class="eyebrow">SCO301 · Chapter 5 · Lesson 5.1</span>
<h2>Messages &amp; behavior change</h2>
<h3>Behavior change communication</h3>
<p>Awareness rarely equals action. <strong>Behavior change communication</strong> is designed to move people from knowing to doing — by lowering barriers, making the desired action easy and giving a clear, specific call to action.</p>
<h3>Nudges</h3>
<p>A <strong>nudge</strong> gently steers choices without banning options — e.g. making the sustainable option the <em>default</em>, or showing real-time feedback (a home energy display). Nudges work because most decisions are habitual, not deliberate.</p>
<h3>Message framing</h3>
<ul>
<li><strong>Gain vs loss</strong> — "save 200,000 VND a year" vs "you lose 200,000 VND"; loss framing can be stronger, but gain framing invites positive action.</li>
<li><strong>Social norms</strong> — "most guests in this room reuse their towels" often beats a moral appeal.</li>
<li><strong>Concrete &amp; local</strong> — specific, nearby, personally relevant beats abstract global statistics.</li>
</ul>
<div class="callout"><span class="badge">Example — the towel study</span> Hotel signs saying <strong>"the majority of guests reuse their towels"</strong> increased reuse more than signs about "saving the environment" — a classic <strong>social-norm nudge</strong>. Vinamilk's "Green" campaigns similarly pair a simple action (recycling, tree-planting) with a concrete number.</div>`,
    `<span class="eyebrow">SCO301 · Chương 5 · Bài 5.1</span>
<h2>Thông điệp &amp; thay đổi hành vi</h2>
<h3>Truyền thông đổi hành vi</h3>
<p>Nhận thức hiếm khi bằng hành động. <strong>Truyền thông đổi hành vi</strong> được thiết kế để đưa người ta từ biết sang làm — bằng cách hạ rào cản, làm hành động mong muốn trở nên dễ, và cho một lời kêu gọi hành động rõ ràng, cụ thể.</p>
<h3>Nudge (huých)</h3>
<p>Một <strong>nudge</strong> nhẹ nhàng hướng lựa chọn mà không cấm phương án nào — vd đặt lựa chọn bền vững làm <em>mặc định</em>, hoặc cho phản hồi tức thì (màn hình đo điện trong nhà). Nudge hiệu quả vì phần lớn quyết định là theo thói quen, không phải cân nhắc.</p>
<h3>Khung thông điệp</h3>
<ul>
<li><strong>Được vs mất</strong> — "tiết kiệm 200.000đ mỗi năm" so với "bạn mất 200.000đ"; khung "mất" có thể mạnh hơn, nhưng khung "được" mời gọi hành động tích cực.</li>
<li><strong>Chuẩn mực xã hội</strong> — "phần lớn khách trong phòng này tái dùng khăn" thường hiệu quả hơn lời kêu gọi đạo đức.</li>
<li><strong>Cụ thể &amp; gần</strong> — cụ thể, ở gần, liên quan đến cá nhân thắng số liệu toàn cầu trừu tượng.</li>
</ul>
<div class="callout"><span class="badge">Ví dụ — nghiên cứu khăn tắm</span> Bảng khách sạn ghi <strong>"đa số khách tái dùng khăn của họ"</strong> làm tăng tái dùng hơn bảng "hãy cứu môi trường" — một <strong>nudge chuẩn mực xã hội</strong> kinh điển. Chiến dịch "Xanh" của Vinamilk cũng ghép một hành động đơn giản (tái chế, trồng cây) với một con số cụ thể.</div>`,
  ]]);

const c5q = quiz('sco301-quiz-5', 'Quiz 5 — Behavior change|||Quiz 5 — Đổi hành vi', [
  { id: 'q1', question: 'Vì sao "nhận thức" không đủ để đổi hành vi?', options: ['Vì người ta không đọc', 'Vì biết chưa chắc dẫn tới làm; cần hạ rào cản và kêu gọi cụ thể', 'Vì thông điệp quá cụ thể', 'Vì không có màu xanh'], correctIndex: 1, explanation: 'Khoảng cách biết–làm cần thiết kế thông điệp giúp hành động dễ và rõ ràng.' },
  { id: 'q2', question: 'Một "nudge" (huých) là?', options: ['Cấm hoàn toàn lựa chọn xấu', 'Nhẹ nhàng hướng lựa chọn mà không cấm phương án nào', 'Phạt tiền người dùng', 'Một loại báo cáo GRI'], correctIndex: 1, explanation: 'Nudge định hướng lựa chọn (vd đặt mặc định) mà vẫn giữ tự do chọn.' },
  { id: 'q3', question: 'Thông điệp "đa số khách ở đây tái dùng khăn" dùng nguyên lý nào?', options: ['Khung mất mát', 'Chuẩn mực xã hội (social norm)', 'Đe doạ', 'Giảm giá'], correctIndex: 1, explanation: 'Đây là nudge dựa trên chuẩn mực xã hội — người ta làm theo số đông.' },
]);

const c6 = doc('sco301-6-1-storytelling', '6.1 — Sustainability storytelling|||6.1 — Kể chuyện bền vững',
  'Sustainability storytelling (nhân vật, xung đột, thay đổi); yếu tố hình ảnh (visual); dữ liệu tác động biến thành câu chuyện. Ví dụ: phim môi trường của Patagonia; National Geographic.',
  [[
    `<span class="eyebrow">SCO301 · Chapter 6 · Lesson 6.1</span>
<h2>Sustainability storytelling</h2>
<h3>Why stories, not just data</h3>
<p>Numbers inform; <strong>stories move</strong>. A good sustainability story has a <strong>character</strong> (a farmer, a community, a species), a <strong>conflict</strong> (a threat or challenge) and a <strong>change</strong> (what action made possible). This turns an abstract issue into something an audience can feel and remember.</p>
<h3>The visual dimension</h3>
<p>Sustainability is often visual — a restored forest, clean water, a before/after. Strong, honest imagery (not stock-photo clichés) makes progress tangible. Show real places and real people, and caption them truthfully.</p>
<h3>Turning impact data into narrative</h3>
<p>Don't just state "we planted 1 million trees" — connect the number to a person or place ("...restoring the watershed that this village drinks from"). Data gives credibility; the story gives meaning. Combine both.</p>
<div class="callout"><span class="badge">Example — Patagonia films &amp; Nat Geo</span> Patagonia funds short documentary films about the people and places affected by environmental issues, letting the cause carry the brand. <strong>National Geographic</strong> pairs striking photography with impact data — the model for "make the audience care first, cite the number second".</div>`,
    `<span class="eyebrow">SCO301 · Chương 6 · Bài 6.1</span>
<h2>Kể chuyện bền vững</h2>
<h3>Vì sao cần chuyện, không chỉ dữ liệu</h3>
<p>Con số thông tin; <strong>câu chuyện lay động</strong>. Một câu chuyện bền vững tốt có <strong>nhân vật</strong> (người nông dân, một cộng đồng, một loài), một <strong>xung đột</strong> (mối đe doạ hay thách thức) và một <strong>thay đổi</strong> (hành động đã tạo ra điều gì). Nó biến vấn đề trừu tượng thành thứ công chúng cảm được và nhớ được.</p>
<h3>Chiều hình ảnh</h3>
<p>Bền vững thường mang tính hình ảnh — một khu rừng hồi sinh, nước sạch, một cảnh trước/sau. Hình ảnh mạnh, trung thực (không phải ảnh minh hoạ sáo rỗng) làm tiến bộ trở nên nhìn thấy được. Hãy cho thấy nơi thật, người thật, và chú thích đúng sự thật.</p>
<h3>Biến dữ liệu tác động thành câu chuyện</h3>
<p>Đừng chỉ nói "chúng tôi trồng 1 triệu cây" — nối con số với một con người hay một nơi chốn ("...phục hồi lưu vực mà ngôi làng này lấy nước uống"). Dữ liệu cho độ tin cậy; câu chuyện cho ý nghĩa. Kết hợp cả hai.</p>
<div class="callout"><span class="badge">Ví dụ — phim Patagonia &amp; Nat Geo</span> Patagonia tài trợ phim tài liệu ngắn về con người và nơi chốn bị ảnh hưởng bởi vấn đề môi trường, để mục đích dẫn dắt thương hiệu. <strong>National Geographic</strong> ghép nhiếp ảnh ấn tượng với dữ liệu tác động — mô hình "làm công chúng quan tâm trước, dẫn số sau".</div>`,
  ]]);

const c6q = quiz('sco301-quiz-6', 'Quiz 6 — Storytelling|||Quiz 6 — Kể chuyện', [
  { id: 'q1', question: 'Ba thành phần của một câu chuyện bền vững tốt là?', options: ['Giá–chất lượng–thời gian', 'Nhân vật–xung đột–thay đổi', 'Logo–slogan–màu sắc', 'Vốn–lãi–rủi ro'], correctIndex: 1, explanation: 'Nhân vật, xung đột (thách thức) và thay đổi (hành động tạo ra điều gì).' },
  { id: 'q2', question: 'Nên dùng hình ảnh thế nào trong truyền thông bền vững?', options: ['Ảnh minh hoạ sáo rỗng cho đẹp', 'Hình ảnh thật, trung thực, chú thích đúng sự thật', 'Không dùng hình ảnh', 'Chỉ dùng biểu đồ'], correctIndex: 1, explanation: 'Hình ảnh mạnh nhưng phải thật và chú thích trung thực, tránh clichés.' },
  { id: 'q3', question: 'Cách hiệu quả để dùng dữ liệu tác động là?', options: ['Chỉ nêu con số khô khan', 'Nối con số với một con người hoặc nơi chốn cụ thể', 'Giấu con số đi', 'Phóng đại con số'], correctIndex: 1, explanation: 'Dữ liệu cho độ tin, câu chuyện cho ý nghĩa — kết hợp cả hai.' },
]);

const c7 = doc('sco301-7-1-stakeholders', '7.1 — Stakeholders & internal communication|||7.1 — Bên liên quan & truyền thông nội bộ',
  'Stakeholder engagement (lập bản đồ, đối thoại hai chiều); nhân viên là đại sứ; cộng đồng; lắng nghe và phản hồi. Ví dụ: đối thoại bên liên quan của Unilever; đại sứ nhân viên.',
  [[
    `<span class="eyebrow">SCO301 · Chapter 7 · Lesson 7.1</span>
<h2>Stakeholders &amp; internal communication</h2>
<h3>Who are the stakeholders?</h3>
<p><strong>Stakeholders</strong> are all groups affected by, or able to affect, an organization: employees, customers, investors, suppliers, communities, NGOs, regulators and the media. Good sustainability communication starts by <strong>mapping</strong> them and understanding what each cares about.</p>
<h3>Engagement is two-way</h3>
<p><strong>Stakeholder engagement</strong> is dialogue, not broadcast: listening, consulting and responding — for example, a <strong>materiality assessment</strong> that asks stakeholders which issues matter most before setting priorities. Real dialogue improves both decisions and trust.</p>
<h3>Employees &amp; community</h3>
<ul>
<li><strong>Internal communication</strong> — employees must understand and believe the sustainability strategy before they can represent it. Engaged staff become credible <strong>ambassadors</strong>.</li>
<li><strong>Community</strong> — local dialogue (town halls, partnerships) builds a social license to operate.</li>
</ul>
<div class="callout"><span class="badge">Example — Unilever &amp; employee ambassadors</span> Unilever runs formal stakeholder consultations and materiality assessments to set its agenda, and mobilizes employees as sustainability ambassadors. Internal buy-in comes first: a strategy the staff don't believe won't convince anyone outside.</div>`,
    `<span class="eyebrow">SCO301 · Chương 7 · Bài 7.1</span>
<h2>Bên liên quan &amp; truyền thông nội bộ</h2>
<h3>Bên liên quan là ai?</h3>
<p><strong>Bên liên quan (stakeholders)</strong> là mọi nhóm chịu ảnh hưởng bởi, hoặc có thể tác động tới, tổ chức: nhân viên, khách hàng, nhà đầu tư, nhà cung cấp, cộng đồng, NGO, cơ quan quản lý và báo chí. Truyền thông bền vững tốt bắt đầu bằng việc <strong>lập bản đồ</strong> họ và hiểu mỗi bên quan tâm điều gì.</p>
<h3>Gắn kết là hai chiều</h3>
<p><strong>Gắn kết bên liên quan</strong> là đối thoại, không phải phát một chiều: lắng nghe, tham vấn và phản hồi — ví dụ một <strong>đánh giá trọng yếu (materiality)</strong> hỏi bên liên quan vấn đề nào quan trọng nhất trước khi đặt ưu tiên. Đối thoại thật cải thiện cả quyết định lẫn niềm tin.</p>
<h3>Nhân viên &amp; cộng đồng</h3>
<ul>
<li><strong>Truyền thông nội bộ</strong> — nhân viên phải hiểu và tin chiến lược bền vững trước khi có thể đại diện cho nó. Nhân viên gắn kết trở thành <strong>đại sứ</strong> đáng tin.</li>
<li><strong>Cộng đồng</strong> — đối thoại địa phương (họp dân, hợp tác) xây "giấy phép xã hội" để vận hành.</li>
</ul>
<div class="callout"><span class="badge">Ví dụ — Unilever &amp; đại sứ nhân viên</span> Unilever tổ chức tham vấn bên liên quan và đánh giá trọng yếu chính thức để đặt nghị trình, và huy động nhân viên làm đại sứ bền vững. Đồng thuận nội bộ đến trước: một chiến lược mà nhân viên không tin sẽ không thuyết phục được ai bên ngoài.</div>`,
  ]]);

const c7q = quiz('sco301-quiz-7', 'Quiz 7 — Stakeholders|||Quiz 7 — Bên liên quan', [
  { id: 'q1', question: '"Bên liên quan" (stakeholders) gồm những ai?', options: ['Chỉ cổ đông', 'Nhân viên, khách hàng, nhà đầu tư, cộng đồng, NGO, cơ quan quản lý...', 'Chỉ khách hàng', 'Chỉ ban giám đốc'], correctIndex: 1, explanation: 'Là mọi nhóm chịu ảnh hưởng bởi hoặc tác động được tới tổ chức.' },
  { id: 'q2', question: 'Gắn kết bên liên quan đúng nghĩa là?', options: ['Phát thông điệp một chiều', 'Đối thoại hai chiều: lắng nghe, tham vấn, phản hồi', 'Chỉ gửi email nội bộ', 'Chỉ quảng cáo ra ngoài'], correctIndex: 1, explanation: 'Engagement là đối thoại (vd đánh giá trọng yếu), không phải broadcast.' },
  { id: 'q3', question: 'Vì sao truyền thông nội bộ quan trọng?', options: ['Không quan trọng', 'Nhân viên hiểu và tin chiến lược mới trở thành đại sứ đáng tin', 'Chỉ để tuân thủ', 'Để giảm lương'], correctIndex: 1, explanation: 'Đồng thuận nội bộ đến trước; nhân viên gắn kết đại diện đáng tin ra ngoài.' },
]);

const c8 = doc('sco301-8-1-measure-report', '8.1 — Measurement & reporting|||8.1 — Đo lường & báo cáo',
  'Impact measurement; báo cáo ESG/GRI; KPI bền vững (đầu vào–đầu ra–kết quả–tác động); minh bạch & bảo đảm độc lập. Ví dụ: báo cáo phát triển bền vững của Vinamilk / Unilever.',
  [[
    `<span class="eyebrow">SCO301 · Chapter 8 · Lesson 8.1</span>
<h2>Measurement &amp; reporting</h2>
<h3>Measure impact, not just activity</h3>
<p>Distinguish <strong>outputs</strong> (what you did — "ran 10 workshops") from <strong>outcomes / impact</strong> (what changed — "waste down 20%"). Credible communication reports the change, and is honest about baselines and scope.</p>
<h3>Sustainability KPIs</h3>
<ul>
<li><strong>Environmental</strong> — carbon emissions, energy, water, waste, % recycled.</li>
<li><strong>Social</strong> — safety, diversity, training hours, community investment.</li>
<li><strong>Governance</strong> — ethics violations, board diversity, supplier audits.</li>
</ul>
<p>Good KPIs are specific, comparable year-on-year, and tied to a target and a framework (an SDG, a Paris-aligned goal).</p>
<h3>ESG / GRI reporting &amp; transparency</h3>
<p>A <strong>sustainability report</strong> (often GRI-based) discloses these KPIs publicly. Transparency means reporting the bad with the good, showing methodology, and ideally getting <strong>independent assurance</strong> so the numbers are trusted, not just claimed.</p>
<div class="callout"><span class="badge">Example — Vinamilk &amp; Unilever</span> Vinamilk publishes an annual sustainable development report aligned to GRI and the SDGs, with year-on-year KPIs; Unilever reports progress against public targets. The discipline of measuring and disclosing is itself the strongest defense against greenwashing.</div>`,
    `<span class="eyebrow">SCO301 · Chương 8 · Bài 8.1</span>
<h2>Đo lường &amp; báo cáo</h2>
<h3>Đo tác động, không chỉ hoạt động</h3>
<p>Phân biệt <strong>đầu ra (output)</strong> (bạn đã làm gì — "tổ chức 10 workshop") với <strong>kết quả / tác động (outcome/impact)</strong> (điều gì đã đổi — "rác giảm 20%"). Truyền thông đáng tin báo cáo sự thay đổi, và trung thực về mốc gốc và phạm vi.</p>
<h3>KPI bền vững</h3>
<ul>
<li><strong>Môi trường</strong> — phát thải carbon, năng lượng, nước, rác, % tái chế.</li>
<li><strong>Xã hội</strong> — an toàn, đa dạng, giờ đào tạo, đầu tư cộng đồng.</li>
<li><strong>Quản trị</strong> — vi phạm đạo đức, đa dạng hội đồng, kiểm toán nhà cung cấp.</li>
</ul>
<p>KPI tốt thì cụ thể, so sánh được theo năm, và gắn với một mục tiêu và một khung (một SDG, một mục tiêu theo Paris).</p>
<h3>Báo cáo ESG / GRI &amp; minh bạch</h3>
<p>Một <strong>báo cáo bền vững</strong> (thường theo GRI) công bố công khai các KPI này. Minh bạch nghĩa là báo cả cái xấu lẫn cái tốt, cho thấy phương pháp, và tốt nhất là có <strong>bảo đảm độc lập</strong> để con số được tin, không chỉ là tuyên bố.</p>
<div class="callout"><span class="badge">Ví dụ — Vinamilk &amp; Unilever</span> Vinamilk phát hành báo cáo phát triển bền vững hằng năm theo GRI và các SDGs, với KPI so sánh theo năm; Unilever báo tiến độ so với mục tiêu công khai. Kỷ luật đo lường và công bố chính là lá chắn mạnh nhất chống greenwashing.</div>`,
  ]]);

const c8q = quiz('sco301-quiz-8', 'Quiz 8 — Measurement & reporting|||Quiz 8 — Đo lường & báo cáo', [
  { id: 'q1', question: 'Khác biệt giữa "output" và "impact" là?', options: ['Không khác nhau', 'Output = việc đã làm; impact = điều thực sự thay đổi', 'Impact luôn nhỏ hơn output', 'Output đo bằng tiền, impact bằng giờ'], correctIndex: 1, explanation: 'Output là hoạt động; outcome/impact là sự thay đổi thật (vd rác giảm 20%).' },
  { id: 'q2', question: 'Một KPI bền vững tốt nên?', options: ['Chung chung, không mốc thời gian', 'Cụ thể, so sánh được theo năm, gắn với mục tiêu & khung', 'Chỉ đo mỗi năm một lần rồi bỏ', 'Không cần baseline'], correctIndex: 1, explanation: 'KPI tốt: cụ thể, so sánh theo năm, gắn target và khung (SDG/Paris).' },
  { id: 'q3', question: 'Điều gì làm con số trong báo cáo bền vững đáng tin nhất?', options: ['In màu đẹp', 'Bảo đảm độc lập (independent assurance) và công khai phương pháp', 'Chỉ báo cái tốt', 'Không dẫn nguồn'], correctIndex: 1, explanation: 'Minh bạch phương pháp + bảo đảm độc lập khiến số được tin, không chỉ tuyên bố.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'SCO301',
    slug: 'sco301-sustainable-communication',
    title: 'Sustainable Communication',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/SCO301.webp',
    shortDescription: 'Sustainable communication — SDGs, ESG & GRI reporting, CSR & purpose-driven brands, spotting greenwashing, behavior-change messaging, storytelling, stakeholders & impact reporting. Real brands (Patagonia, Unilever, Vinamilk). Bilingual, with quizzes.|||Truyền thông bền vững — SDGs, ESG & báo cáo GRI, CSR & thương hiệu vì mục đích, nhận diện greenwashing, đổi hành vi, kể chuyện, bên liên quan & báo cáo tác động. Thương hiệu thật (Patagonia, Unilever, Vinamilk). Song ngữ, có quiz.',
    description: 'Môn <strong>SCO301 — Sustainable Communication</strong> (Truyền thông bền vững, kỳ 4) giúp bạn <strong>truyền thông về bền vững một cách trung thực và hiệu quả</strong>. Từ <strong>nền &amp; khung quốc tế</strong> (bền vững, ESG, SDGs, Thoả thuận Paris, GRI) → <strong>CSR &amp; thương hiệu vì mục đích</strong> → <strong>greenwashing &amp; đạo đức</strong> → <strong>thông điệp &amp; đổi hành vi</strong> (nudge, khung thông điệp) → <strong>kể chuyện bền vững</strong> → <strong>bên liên quan &amp; truyền thông nội bộ</strong> → <strong>đo lường &amp; báo cáo</strong>. Song ngữ, có ca thương hiệu thật (Patagonia, Unilever, Vinamilk) và quiz mỗi chương.',
    whatYouLearn: 'Khái niệm bền vững, ESG & triple bottom line; SDGs, Thoả thuận Paris, báo cáo GRI; truyền thông CSR & thương hiệu vì mục đích; nhận diện greenwashing & tiêu chí trung thực; truyền thông đổi hành vi, nudge & khung thông điệp; kể chuyện bền vững (nhân vật–xung đột–thay đổi) & dữ liệu tác động; gắn kết bên liên quan & truyền thông nội bộ; KPI bền vững, đo tác động & viết báo cáo minh bạch.',
    requirements: 'Không cần kiến thức chuyên sâu. Nên có nền cơ bản về truyền thông/marketing. Xem chuẩn đầu ra trên FLM (flm.fpt.edu.vn).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách nền, khung chuẩn (SDGs, GRI), YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Truyền thông bền vững là gì, vì sao quan trọng, lộ trình.', lessons: [intro] },
    { title: 'Chương 1 — Bền vững là gì|||Chapter 1 — What is sustainability', description: 'Brundtland, ESG, triple bottom line, vai trò truyền thông.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Khung quốc tế|||Chapter 2 — International frameworks', description: 'SDGs, Thoả thuận Paris, ESG, báo cáo GRI.', lessons: [c2, c2q] },
    { title: 'Chương 3 — CSR & thương hiệu|||Chapter 3 — CSR & brand', description: 'CSR communication, purpose-driven, cause marketing.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Greenwashing & đạo đức|||Chapter 4 — Greenwashing & ethics', description: 'Nhận diện greenwashing, minh bạch, tiêu chí trung thực.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Thông điệp & đổi hành vi|||Chapter 5 — Messages & behavior change', description: 'Behavior change, nudge, khung thông điệp môi trường.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Kể chuyện bền vững|||Chapter 6 — Sustainability storytelling', description: 'Storytelling, visual, dữ liệu tác động thành câu chuyện.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Bên liên quan & nội bộ|||Chapter 7 — Stakeholders & internal', description: 'Stakeholder engagement, nhân viên, cộng đồng, đối thoại.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Đo lường & báo cáo|||Chapter 8 — Measurement & reporting', description: 'Impact measurement, ESG/GRI, KPI bền vững, minh bạch.', lessons: [c8, c8q] },
  ],
};
