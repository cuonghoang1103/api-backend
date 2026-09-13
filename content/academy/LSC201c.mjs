/**
 * LSC201c — Leading Sustainable Community Transformation (Dẫn dắt chuyển đổi
 * cộng đồng bền vững). Khối Công nghệ Truyền thông FPTU, Kỳ 2.
 * Nguồn chuẩn: Kretzmann & McKnight "Building Communities from the Inside Out"
 * (ABCD); Phillips & Pittman "Introduction to Community Development"; UN SDG
 * 11 & 17; Ashoka Changemaking; Stanford Social Innovation Review. Song ngữ.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n; & → &amp; trong HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('lsc201c-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình (FLM), sách nền tảng (ABCD, Phillips & Pittman), UN SDGs, Ashoka, SSIR, công cụ, lộ trình tự học 4 bước.',
  [[
    `<span class="eyebrow">LSC201c · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything you need to lead <strong>sustainable community transformation</strong> — understanding communities, mobilizing local assets, leading change, designing projects, social innovation, advocacy and impact measurement — in one place. The official slides &amp; syllabus live on <strong>FLM</strong>; below are free, credible sources.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for LSC201c are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Foundational books</h3>
<ul>
<li>Kretzmann &amp; McKnight — <em>Building Communities from the Inside Out</em> (the ABCD classic).</li>
<li>Phillips &amp; Pittman — <em>An Introduction to Community Development</em>.</li>
<li>Roberto Unger / Ashoka readings on <em>changemaking</em> and social entrepreneurship.</li>
</ul>
<h3>🌐 Official / free resources</h3>
<ul>
<li><a href="https://sdgs.un.org/goals" target="_blank" rel="noopener">UN Sustainable Development Goals</a> — esp. SDG 11 (Sustainable Cities &amp; Communities) &amp; SDG 17 (Partnerships).</li>
<li><a href="https://resources.depaul.edu/abcd-institute/" target="_blank" rel="noopener">ABCD Institute (DePaul)</a> — asset-based community development toolkits.</li>
<li><a href="https://ssir.org/" target="_blank" rel="noopener">Stanford Social Innovation Review</a> — case studies on social change.</li>
<li><a href="https://www.ashoka.org/" target="_blank" rel="noopener">Ashoka</a> — the global changemaker network.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Understand</strong> — what a community is, community development, and the SDGs at community scale.</li>
<li><strong>Mobilize</strong> — map local assets (ABCD), engage stakeholders, build participation.</li>
<li><strong>Design &amp; lead</strong> — a theory of change, a logic model, servant leadership, social innovation.</li>
<li><strong>Sustain &amp; scale</strong> — advocacy, fundraising, impact measurement (SROI), and scaling what works.</li>
</ol></div>`,
    `<span class="eyebrow">LSC201c · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để dẫn dắt <strong>chuyển đổi cộng đồng bền vững</strong> — hiểu cộng đồng, huy động nguồn lực địa phương, dẫn dắt thay đổi, thiết kế dự án, đổi mới xã hội, vận động và đo lường tác động — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, đáng tin.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của LSC201c có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách nền tảng</h3>
<ul>
<li>Kretzmann &amp; McKnight — <em>Building Communities from the Inside Out</em> (kinh điển ABCD).</li>
<li>Phillips &amp; Pittman — <em>An Introduction to Community Development</em>.</li>
<li>Tài liệu Ashoka về <em>changemaking</em> và khởi nghiệp xã hội.</li>
</ul>
<h3>🌐 Nguồn chính thức / miễn phí</h3>
<ul>
<li><a href="https://sdgs.un.org/goals" target="_blank" rel="noopener">Mục tiêu Phát triển Bền vững của LHQ</a> — nhất là SDG 11 (Đô thị &amp; cộng đồng bền vững) &amp; SDG 17 (Hợp tác).</li>
<li><a href="https://resources.depaul.edu/abcd-institute/" target="_blank" rel="noopener">Viện ABCD (DePaul)</a> — bộ công cụ phát triển dựa trên tài sản.</li>
<li><a href="https://ssir.org/" target="_blank" rel="noopener">Stanford Social Innovation Review</a> — nghiên cứu tình huống thay đổi xã hội.</li>
<li><a href="https://www.ashoka.org/" target="_blank" rel="noopener">Ashoka</a> — mạng lưới changemaker toàn cầu.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Hiểu</strong> — cộng đồng là gì, phát triển cộng đồng, và SDGs ở cấp cộng đồng.</li>
<li><strong>Huy động</strong> — vẽ bản đồ tài sản (ABCD), gắn kết bên liên quan, xây sự tham gia.</li>
<li><strong>Thiết kế &amp; dẫn dắt</strong> — theory of change, logic model, lãnh đạo phục vụ, đổi mới xã hội.</li>
<li><strong>Duy trì &amp; nhân rộng</strong> — vận động, gây quỹ, đo lường tác động (SROI), nhân rộng cái hiệu quả.</li>
</ol></div>`,
  ]]);

const intro = doc('lsc201c-0-1-overview', 'Course overview: leading community transformation|||Tổng quan: dẫn dắt chuyển đổi cộng đồng',
  'Chuyển đổi cộng đồng bền vững là gì; vì sao dẫn từ bên trong; lộ trình 8 chương từ hiểu cộng đồng → huy động → dẫn dắt → thiết kế → đổi mới → vận động → đo lường.',
  [[
    `<span class="eyebrow">LSC201c · Lesson 0.1 · Overview</span>
<h2>Leading sustainable community transformation</h2>
<p class="lead">This course helps you <strong>lead positive, lasting change in a community</strong> — not by dropping in solutions from outside, but by mobilizing the people, skills and assets already there. You'll learn to read a community, engage stakeholders, design a project around a theory of change, spark social innovation, tell a mobilizing story, and prove your impact.</p>
<h3>The core idea</h3>
<p>Sustainable transformation is <strong>asset-based</strong> and <strong>participatory</strong>: it starts with what a community <em>has</em> (its "glass half full"), and it is <em>led with</em> people, not done <em>to</em> them. Leadership here means facilitation and empowerment more than command.</p>
<h3>Roadmap</h3>
<p>Community &amp; the SDGs → asset mapping &amp; mobilization (ABCD) → servant &amp; collective leadership → stakeholders &amp; dialogue → project design (theory of change) → social innovation &amp; enterprise → advocacy &amp; mobilization → social impact measurement &amp; scaling. Bilingual, with real community projects and a quiz per chapter.</p>`,
    `<span class="eyebrow">LSC201c · Bài 0.1 · Tổng quan</span>
<h2>Dẫn dắt chuyển đổi cộng đồng bền vững</h2>
<p class="lead">Môn này giúp bạn <strong>dẫn dắt thay đổi tích cực, bền vững trong một cộng đồng</strong> — không phải bằng cách áp giải pháp từ bên ngoài, mà bằng cách huy động con người, kỹ năng và nguồn lực vốn đã có ở đó. Bạn học cách đọc một cộng đồng, gắn kết bên liên quan, thiết kế dự án quanh một theory of change, khơi đổi mới xã hội, kể câu chuyện huy động, và chứng minh tác động.</p>
<h3>Ý tưởng cốt lõi</h3>
<p>Chuyển đổi bền vững mang tính <strong>dựa trên tài sản</strong> và <strong>có sự tham gia</strong>: nó bắt đầu từ cái cộng đồng <em>đang có</em> ("nửa ly đầy"), và được <em>dẫn dắt cùng</em> người dân, chứ không phải làm <em>thay</em> họ. Lãnh đạo ở đây nghiêng về điều phối và trao quyền hơn là ra lệnh.</p>
<h3>Lộ trình</h3>
<p>Cộng đồng &amp; SDGs → vẽ bản đồ tài sản &amp; huy động (ABCD) → lãnh đạo phục vụ &amp; tập thể → bên liên quan &amp; đối thoại → thiết kế dự án (theory of change) → đổi mới xã hội &amp; doanh nghiệp → vận động &amp; huy động → đo lường tác động xã hội &amp; nhân rộng. Song ngữ, có dự án cộng đồng thật và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('lsc201c-1-1-community-sdg', '1.1 — Community &amp; sustainable development|||1.1 — Cộng đồng &amp; phát triển bền vững',
  'Cộng đồng (place/interest), phát triển cộng đồng, ba trụ bền vững, SDGs ở cấp cộng đồng (SDG 11 & 17).',
  [[
    `<span class="eyebrow">LSC201c · Chapter 1 · Lesson 1.1</span>
<h2>Community &amp; sustainable development</h2>
<h3>What is a community?</h3>
<p>A <strong>community</strong> is a group bound by <em>place</em> (a village, ward, campus) or by <em>interest/identity</em> (a craft, a cause, an online group). <strong>Community development</strong> is a process where members act together to shape their shared future and strengthen collective capacity.</p>
<h3>The three pillars of sustainability</h3>
<ul>
<li><strong>Social</strong> — inclusion, wellbeing, equity.</li>
<li><strong>Economic</strong> — livelihoods that last without depleting resources.</li>
<li><strong>Environmental</strong> — living within ecological limits.</li>
</ul>
<p>"Sustainable" transformation improves all three at once — and lasts after the outside project team leaves.</p>
<h3>The SDGs at community scale</h3>
<p>The UN's 17 <strong>Sustainable Development Goals</strong> are a shared language for local action. Two are central here: <strong>SDG 11</strong> (sustainable cities &amp; communities) and <strong>SDG 17</strong> (partnerships for the goals).</p>
<div class="callout"><span class="badge">Example</span> Vietnam's <strong>Nông thôn mới</strong> (New Rural Development) program pushes communes to jointly upgrade infrastructure, livelihoods and environment against shared criteria — community development against SDG-like targets.</div>`,
    `<span class="eyebrow">LSC201c · Chương 1 · Bài 1.1</span>
<h2>Cộng đồng &amp; phát triển bền vững</h2>
<h3>Cộng đồng là gì?</h3>
<p>Một <strong>cộng đồng</strong> là nhóm gắn với nhau bởi <em>nơi chốn</em> (một làng, phường, trường) hoặc bởi <em>mối quan tâm/bản sắc</em> (một nghề, một mục tiêu, một nhóm trực tuyến). <strong>Phát triển cộng đồng</strong> là quá trình các thành viên cùng hành động để định hình tương lai chung và nâng năng lực tập thể.</p>
<h3>Ba trụ cột của bền vững</h3>
<ul>
<li><strong>Xã hội</strong> — hoà nhập, an sinh, công bằng.</li>
<li><strong>Kinh tế</strong> — sinh kế lâu dài mà không cạn kiệt nguồn lực.</li>
<li><strong>Môi trường</strong> — sống trong giới hạn sinh thái.</li>
</ul>
<p>Chuyển đổi "bền vững" cải thiện cả ba cùng lúc — và tồn tại sau khi nhóm dự án bên ngoài rút đi.</p>
<h3>SDGs ở cấp cộng đồng</h3>
<p>17 <strong>Mục tiêu Phát triển Bền vững</strong> của LHQ là ngôn ngữ chung cho hành động địa phương. Hai mục tiêu trọng tâm ở đây: <strong>SDG 11</strong> (đô thị &amp; cộng đồng bền vững) và <strong>SDG 17</strong> (hợp tác vì mục tiêu).</p>
<div class="callout"><span class="badge">Ví dụ</span> Chương trình <strong>Nông thôn mới</strong> của Việt Nam thúc các xã cùng nâng cấp hạ tầng, sinh kế và môi trường theo bộ tiêu chí chung — phát triển cộng đồng theo các đích giống SDG.</div>`,
  ]]);

const c1q = quiz('lsc201c-quiz-1', 'Quiz 1 — Community & sustainability|||Quiz 1 — Cộng đồng & bền vững', [
  { id: 'q1', question: 'Ba trụ cột của phát triển bền vững là?|||What are the three pillars of sustainable development?', options: ['Xã hội, kinh tế, môi trường|||Social, economic, environmental', 'Chính trị, quân sự, ngoại giao|||Political, military, diplomatic', 'Tiền, quyền, danh|||Money, power, fame', 'Đất, nước, không khí|||Land, water, air'], correctIndex: 0, explanation: 'Bền vững cân bằng cả ba trụ: xã hội, kinh tế, môi trường.' },
  { id: 'q2', question: 'SDG nào tập trung vào đô thị & cộng đồng bền vững?|||Which SDG focuses on sustainable cities & communities?', options: ['SDG 1|||SDG 1', 'SDG 11|||SDG 11', 'SDG 7|||SDG 7', 'SDG 3|||SDG 3'], correctIndex: 1, explanation: 'SDG 11 — Sustainable Cities and Communities.' },
  { id: 'q3', question: 'Chuyển đổi cộng đồng "bền vững" nghĩa là?|||"Sustainable" community transformation means?', options: ['Xong khi có tiền tài trợ|||It ends when funding ends', 'Tồn tại sau khi nhóm ngoài rút đi|||It lasts after the outside team leaves', 'Chỉ do chính quyền làm|||Only government does it', 'Không cần đo lường|||No measurement needed'], correctIndex: 1, explanation: 'Bền vững = duy trì được nhờ năng lực nội tại của cộng đồng.' },
]);

const c2 = doc('lsc201c-2-1-abcd', '2.1 — Asset-based development &amp; mobilization|||2.1 — Phát triển dựa trên tài sản &amp; huy động',
  'ABCD (Kretzmann & McKnight), needs vs assets, năm loại tài sản, asset mapping, mobilizing sự tham gia.',
  [[
    `<span class="eyebrow">LSC201c · Chapter 2 · Lesson 2.1</span>
<h2>Asset-based community development (ABCD)</h2>
<h3>Needs-based vs asset-based</h3>
<p>The traditional "needs-based" view maps a community by its <em>deficiencies</em> — poverty, gaps, problems — and waits for outside help. <strong>ABCD</strong> (Kretzmann &amp; McKnight) flips this: it starts with the <strong>gifts, skills and resources already present</strong> and builds from the inside out. The mindset shift is from "glass half empty" to "glass half full".</p>
<h3>Five kinds of community assets</h3>
<ul>
<li><strong>Individuals</strong> — the skills, knowledge and passions of residents.</li>
<li><strong>Associations</strong> — clubs, unions, faith groups, informal networks.</li>
<li><strong>Institutions</strong> — schools, clinics, businesses, local government.</li>
<li><strong>Physical assets</strong> — land, buildings, infrastructure, natural resources.</li>
<li><strong>Connections</strong> — the relationships that link all of the above.</li>
</ul>
<h3>Asset mapping &amp; mobilization</h3>
<p><strong>Asset mapping</strong> is the practical tool: interview residents, list associations, walk the neighbourhood, and chart what's there. Then <strong>mobilize</strong> — connect assets to each other around a shared goal so the community acts on its own capacity.</p>
<div class="callout"><span class="badge">Why it matters</span> Solutions built on local assets are owned locally — so they survive. Solutions that depend only on outside money collapse when the money stops.</div>`,
    `<span class="eyebrow">LSC201c · Chương 2 · Bài 2.1</span>
<h2>Phát triển cộng đồng dựa trên tài sản (ABCD)</h2>
<h3>Dựa trên nhu cầu vs dựa trên tài sản</h3>
<p>Cách nhìn "dựa trên nhu cầu" truyền thống lập bản đồ cộng đồng theo <em>thiếu hụt</em> — nghèo, khoảng trống, vấn đề — và chờ trợ giúp bên ngoài. <strong>ABCD</strong> (Kretzmann &amp; McKnight) lật ngược: bắt đầu từ <strong>năng khiếu, kỹ năng và nguồn lực đã sẵn có</strong> và xây từ bên trong ra. Chuyển tư duy từ "nửa ly vơi" sang "nửa ly đầy".</p>
<h3>Năm loại tài sản cộng đồng</h3>
<ul>
<li><strong>Cá nhân</strong> — kỹ năng, kiến thức và đam mê của người dân.</li>
<li><strong>Hội nhóm</strong> — câu lạc bộ, hội, nhóm tín ngưỡng, mạng lưới phi chính thức.</li>
<li><strong>Định chế</strong> — trường học, trạm y tế, doanh nghiệp, chính quyền địa phương.</li>
<li><strong>Tài sản vật chất</strong> — đất, công trình, hạ tầng, tài nguyên thiên nhiên.</li>
<li><strong>Kết nối</strong> — các mối quan hệ nối tất cả những thứ trên.</li>
</ul>
<h3>Vẽ bản đồ tài sản &amp; huy động</h3>
<p><strong>Asset mapping</strong> là công cụ thực tế: phỏng vấn người dân, liệt kê hội nhóm, đi bộ khảo sát khu phố, và ghi lại cái đang có. Rồi <strong>huy động</strong> — nối các tài sản với nhau quanh một mục tiêu chung để cộng đồng hành động bằng chính năng lực của mình.</p>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Giải pháp dựng trên tài sản địa phương thì địa phương làm chủ — nên nó sống sót. Giải pháp chỉ dựa vào tiền bên ngoài sẽ sụp khi hết tiền.</div>`,
  ]]);

const c2q = quiz('lsc201c-quiz-2', 'Quiz 2 — ABCD & mobilization|||Quiz 2 — ABCD & huy động', [
  { id: 'q1', question: 'Điểm cốt lõi của ABCD là?|||The core idea of ABCD is?', options: ['Lập bản đồ theo thiếu hụt|||Map by deficiencies', 'Bắt đầu từ tài sản đã sẵn có|||Start from existing assets', 'Chờ tài trợ bên ngoài|||Wait for outside funding', 'Chỉ đo vấn đề|||Only measure problems'], correctIndex: 1, explanation: 'ABCD xây từ bên trong: dựa vào tài sản, kỹ năng, nguồn lực đã có.' },
  { id: 'q2', question: 'Đâu KHÔNG phải một loại tài sản cộng đồng trong ABCD?|||Which is NOT a community asset type in ABCD?', options: ['Cá nhân|||Individuals', 'Hội nhóm|||Associations', 'Định chế|||Institutions', 'Nợ công|||Public debt'], correctIndex: 3, explanation: 'Năm loại: cá nhân, hội nhóm, định chế, tài sản vật chất, kết nối.' },
  { id: 'q3', question: '"Asset mapping" dùng để làm gì?|||What is asset mapping used for?', options: ['Chỉ liệt kê vấn đề|||List problems only', 'Ghi lại nguồn lực đang có để huy động|||Chart existing resources to mobilize', 'Xin ngân sách|||Request budget', 'Đánh giá rủi ro tài chính|||Assess financial risk'], correctIndex: 1, explanation: 'Asset mapping ghi lại tài sản đang có rồi nối chúng quanh mục tiêu chung.' },
]);

const c3 = doc('lsc201c-3-1-leadership', '3.1 — Servant leadership &amp; leading change|||3.1 — Lãnh đạo phục vụ &amp; dẫn dắt thay đổi',
  'Servant leadership (Greenleaf), collective/shared leadership, facilitation, trao quyền, mô hình thay đổi Kotter/Lewin.',
  [[
    `<span class="eyebrow">LSC201c · Chapter 3 · Lesson 3.1</span>
<h2>Servant leadership &amp; leading change</h2>
<h3>Serve first, lead second</h3>
<p><strong>Servant leadership</strong> (Robert Greenleaf) starts from the desire to <em>serve</em>, then to lead. The servant leader asks: are the people I serve growing — more autonomous, more capable, more likely to become leaders themselves? In community work this beats command-and-control, because the goal is the community's <em>own</em> capacity.</p>
<h3>Collective &amp; shared leadership</h3>
<p>Transformation is rarely one hero. <strong>Collective leadership</strong> distributes influence across many people and organizations. The leader's job becomes <strong>facilitation</strong> — convening, listening, surfacing agreement — and <strong>empowerment</strong>: handing decisions and skills to community members.</p>
<h3>A simple change model</h3>
<pre><code>Lewin's 3 steps:
  Unfreeze -> create urgency, question the status quo
  Change   -> try the new way, support &amp; coach
  Refreeze -> embed it as the new normal
</code></pre>
<p>Kotter expands this into 8 steps (urgency, coalition, vision, communicate, empower, quick wins, consolidate, anchor) — useful when the change is large.</p>
<div class="callout"><span class="badge">Empowerment test</span> Good community leadership is judged by what keeps working <em>after</em> the leader steps back.</div>`,
    `<span class="eyebrow">LSC201c · Chương 3 · Bài 3.1</span>
<h2>Lãnh đạo phục vụ &amp; dẫn dắt thay đổi</h2>
<h3>Phục vụ trước, dẫn dắt sau</h3>
<p><strong>Lãnh đạo phục vụ</strong> (Robert Greenleaf) khởi từ mong muốn <em>phục vụ</em>, rồi mới dẫn dắt. Người lãnh đạo phục vụ tự hỏi: những người tôi phục vụ có đang trưởng thành — tự chủ hơn, giỏi hơn, dễ trở thành người dẫn dắt hơn không? Trong công tác cộng đồng, cách này thắng lối ra lệnh-kiểm soát, vì đích đến là <em>chính</em> năng lực của cộng đồng.</p>
<h3>Lãnh đạo tập thể &amp; chia sẻ</h3>
<p>Chuyển đổi hiếm khi do một anh hùng. <strong>Lãnh đạo tập thể</strong> phân bổ ảnh hưởng qua nhiều người và tổ chức. Việc của người dẫn dắt trở thành <strong>điều phối</strong> — triệu tập, lắng nghe, làm nổi đồng thuận — và <strong>trao quyền</strong>: giao quyết định và kỹ năng cho thành viên cộng đồng.</p>
<h3>Một mô hình thay đổi đơn giản</h3>
<pre><code>3 bước của Lewin:
  Rã đông (Unfreeze) -> tạo cấp bách, chất vấn hiện trạng
  Thay đổi (Change)  -> thử cách mới, hỗ trợ &amp; kèm cặp
  Đông lại (Refreeze) -> gắn nó thành bình thường mới
</code></pre>
<p>Kotter mở rộng thành 8 bước (cấp bách, liên minh, tầm nhìn, truyền thông, trao quyền, thắng nhanh, củng cố, neo lại) — hữu ích khi thay đổi lớn.</p>
<div class="callout"><span class="badge">Phép thử trao quyền</span> Lãnh đạo cộng đồng tốt được đánh giá bằng cái vẫn chạy <em>sau khi</em> người lãnh đạo lùi lại.</div>`,
  ]]);

const c3q = quiz('lsc201c-quiz-3', 'Quiz 3 — Leadership & change|||Quiz 3 — Lãnh đạo & thay đổi', [
  { id: 'q1', question: 'Lãnh đạo phục vụ (servant leadership) khởi từ?|||Servant leadership starts from?', options: ['Ham muốn quyền lực|||Desire for power', 'Mong muốn phục vụ người khác|||Desire to serve others', 'Lợi nhuận|||Profit', 'Danh tiếng cá nhân|||Personal fame'], correctIndex: 1, explanation: 'Greenleaf: phục vụ trước, dẫn dắt sau; đo bằng sự trưởng thành của người được phục vụ.' },
  { id: 'q2', question: 'Ba bước thay đổi của Lewin theo đúng thứ tự?|||Lewin\'s three change steps in order?', options: ['Change → Unfreeze → Refreeze|||Change → Unfreeze → Refreeze', 'Unfreeze → Change → Refreeze|||Unfreeze → Change → Refreeze', 'Refreeze → Change → Unfreeze|||Refreeze → Change → Unfreeze', 'Unfreeze → Refreeze → Change|||Unfreeze → Refreeze → Change'], correctIndex: 1, explanation: 'Rã đông → thay đổi → đông lại (embed thành bình thường mới).' },
  { id: 'q3', question: 'Trong lãnh đạo cộng đồng, "trao quyền" nghĩa là?|||In community leadership, "empowerment" means?', options: ['Giữ mọi quyết định cho mình|||Keep all decisions yourself', 'Giao quyết định & kỹ năng cho thành viên|||Hand decisions & skills to members', 'Thuê chuyên gia ngoài|||Hire outside experts', 'Bỏ qua ý kiến dân|||Ignore residents'], correctIndex: 1, explanation: 'Trao quyền = chuyển năng lực và quyết định về cho cộng đồng để nó tự chạy.' },
]);

const c4 = doc('lsc201c-4-1-stakeholders', '4.1 — Stakeholders &amp; multi-party dialogue|||4.1 — Bên liên quan &amp; đối thoại đa bên',
  'Stakeholder analysis (power/interest grid), participatory approaches, multi-stakeholder dialogue, xử lý xung đột lợi ích.',
  [[
    `<span class="eyebrow">LSC201c · Chapter 4 · Lesson 4.1</span>
<h2>Understanding stakeholders &amp; dialogue</h2>
<h3>Who has a stake?</h3>
<p>A <strong>stakeholder</strong> is anyone who affects, or is affected by, the transformation — residents, local government, businesses, NGOs, schools, marginalized groups. Missing a key stakeholder (especially the quiet, affected ones) is a top cause of project failure.</p>
<h3>The power / interest grid</h3>
<pre><code>            Low interest      High interest
High power  Keep satisfied    Manage closely
Low power   Monitor           Keep informed
</code></pre>
<p>Map each stakeholder, then choose an engagement strategy for each cell. Beware: the people with the <em>least</em> power often have the <em>most</em> at stake.</p>
<h3>Participatory dialogue</h3>
<p><strong>Participatory approaches</strong> treat community members as co-authors, not subjects. <strong>Multi-stakeholder dialogue</strong> brings different interests into one room to build shared understanding before deciding. Good dialogue surfaces conflicts early and turns them into design constraints rather than late-stage vetoes.</p>
<div class="callout"><span class="badge">Example</span> A riverside clean-up that ignores informal waste-pickers can destroy their livelihood; inviting them into the dialogue turns opponents into the project's most knowledgeable partners.</div>`,
    `<span class="eyebrow">LSC201c · Chương 4 · Bài 4.1</span>
<h2>Thấu hiểu bên liên quan &amp; đối thoại</h2>
<h3>Ai có phần liên quan?</h3>
<p><strong>Bên liên quan (stakeholder)</strong> là bất kỳ ai ảnh hưởng tới, hoặc bị ảnh hưởng bởi, cuộc chuyển đổi — người dân, chính quyền, doanh nghiệp, tổ chức phi lợi nhuận, trường học, nhóm yếu thế. Bỏ sót một bên then chốt (nhất là nhóm im lặng nhưng bị ảnh hưởng) là nguyên nhân hàng đầu khiến dự án thất bại.</p>
<h3>Lưới quyền lực / lợi ích</h3>
<pre><code>            Ít quan tâm       Rất quan tâm
Quyền cao   Giữ hài lòng      Quản lý sát sao
Quyền thấp  Theo dõi          Cập nhật thường xuyên
</code></pre>
<p>Định vị từng bên, rồi chọn chiến lược gắn kết cho mỗi ô. Lưu ý: người có <em>ít</em> quyền lực nhất thường có <em>nhiều</em> thứ mất mát nhất.</p>
<h3>Đối thoại có sự tham gia</h3>
<p><strong>Cách tiếp cận có sự tham gia</strong> coi thành viên cộng đồng là đồng tác giả, không phải đối tượng. <strong>Đối thoại đa bên</strong> đưa các lợi ích khác nhau vào cùng một phòng để xây hiểu biết chung trước khi quyết. Đối thoại tốt làm lộ xung đột sớm và biến chúng thành ràng buộc thiết kế, thay vì thành quyền phủ quyết ở phút chót.</p>
<div class="callout"><span class="badge">Ví dụ</span> Một chiến dịch dọn sông bỏ qua những người nhặt ve chai có thể phá sinh kế của họ; mời họ vào đối thoại biến người phản đối thành đối tác am hiểu nhất của dự án.</div>`,
  ]]);

const c4q = quiz('lsc201c-quiz-4', 'Quiz 4 — Stakeholders & dialogue|||Quiz 4 — Bên liên quan & đối thoại', [
  { id: 'q1', question: 'Trong lưới quyền lực/lợi ích, bên "quyền cao – rất quan tâm" cần?|||In the power/interest grid, a "high power – high interest" party needs?', options: ['Chỉ theo dõi|||Just monitor', 'Quản lý sát sao|||Manage closely', 'Bỏ qua|||Ignore', 'Giữ hài lòng tối thiểu|||Minimally keep satisfied'], correctIndex: 1, explanation: 'Quyền cao + rất quan tâm ⇒ quản lý sát sao (manage closely).' },
  { id: 'q2', question: 'Vì sao dễ thất bại nếu bỏ sót nhóm quyền thấp?|||Why is missing low-power groups risky?', options: ['Họ không quan trọng|||They do not matter', 'Họ thường có nhiều thứ mất mát nhất|||They often have the most at stake', 'Họ luôn phản đối|||They always object', 'Họ có nhiều tiền|||They have money'], correctIndex: 1, explanation: 'Người ít quyền lực thường bị tác động nặng nhất — bỏ sót họ gây phản kháng và bất công.' },
  { id: 'q3', question: 'Đối thoại đa bên tốt nên?|||Good multi-stakeholder dialogue should?', options: ['Giấu xung đột đến cuối|||Hide conflict until the end', 'Làm lộ xung đột sớm để thiết kế quanh nó|||Surface conflict early to design around it', 'Chỉ mời người ủng hộ|||Only invite supporters', 'Quyết trước rồi thông báo|||Decide first, announce later'], correctIndex: 1, explanation: 'Lộ xung đột sớm biến nó thành ràng buộc thiết kế thay vì phủ quyết muộn.' },
]);

const c5 = doc('lsc201c-5-1-project-design', '5.1 — Designing community projects|||5.1 — Thiết kế dự án cộng đồng',
  'Theory of change, mục tiêu SMART, logic model (inputs→activities→outputs→outcomes→impact), đồng thiết kế (co-design).',
  [[
    `<span class="eyebrow">LSC201c · Chapter 5 · Lesson 5.1</span>
<h2>Designing a community project</h2>
<h3>Theory of change</h3>
<p>A <strong>theory of change</strong> spells out <em>how</em> and <em>why</em> your activities are expected to lead to the change you want. It works backwards from a long-term goal to the preconditions and actions needed — making your assumptions explicit so they can be tested.</p>
<h3>The logic model</h3>
<pre><code>Inputs      -> what you invest (people, money, assets)
Activities  -> what you do (workshops, builds, campaigns)
Outputs     -> direct products (X trained, Y built)
Outcomes    -> the changes (behaviour, skills, conditions)
Impact      -> the lasting difference (wellbeing, sustainability)
</code></pre>
<h3>SMART goals &amp; co-design</h3>
<p>Turn a vision into <strong>SMART</strong> objectives — Specific, Measurable, Achievable, Relevant, Time-bound. And <strong>co-design</strong> with the community: people support what they help create, and local knowledge catches flaws an outsider can't see.</p>
<div class="callout"><span class="badge">Rule of thumb</span> If you can't draw the line from an activity to an outcome to your goal, either the activity or the theory is wrong — fix it before you fund it.</div>`,
    `<span class="eyebrow">LSC201c · Chương 5 · Bài 5.1</span>
<h2>Thiết kế một dự án cộng đồng</h2>
<h3>Theory of change (lý thuyết thay đổi)</h3>
<p><strong>Theory of change</strong> nói rõ <em>bằng cách nào</em> và <em>vì sao</em> các hoạt động của bạn được kỳ vọng dẫn tới thay đổi mong muốn. Nó suy ngược từ mục tiêu dài hạn về các điều kiện tiên quyết và hành động cần có — làm giả định trở nên tường minh để có thể kiểm chứng.</p>
<h3>Logic model (mô hình logic)</h3>
<pre><code>Đầu vào     -> thứ bạn đầu tư (người, tiền, tài sản)
Hoạt động   -> việc bạn làm (tập huấn, xây, chiến dịch)
Đầu ra      -> sản phẩm trực tiếp (X người được tập huấn, Y công trình)
Kết quả     -> các thay đổi (hành vi, kỹ năng, điều kiện)
Tác động    -> khác biệt lâu dài (an sinh, bền vững)
</code></pre>
<h3>Mục tiêu SMART &amp; đồng thiết kế</h3>
<p>Biến tầm nhìn thành mục tiêu <strong>SMART</strong> — Cụ thể, Đo được, Khả thi, Liên quan, Có thời hạn. Và <strong>đồng thiết kế (co-design)</strong> cùng cộng đồng: người ta ủng hộ cái họ góp phần tạo ra, và tri thức bản địa bắt được lỗi mà người ngoài không thấy.</p>
<div class="callout"><span class="badge">Quy tắc</span> Nếu không vẽ được đường nối từ một hoạt động → kết quả → mục tiêu, thì hoặc hoạt động hoặc lý thuyết đang sai — sửa trước khi rót tiền.</div>`,
  ]]);

const c5q = quiz('lsc201c-quiz-5', 'Quiz 5 — Project design|||Quiz 5 — Thiết kế dự án', [
  { id: 'q1', question: 'Theory of change dùng để?|||A theory of change is used to?', options: ['Liệt kê ngân sách|||List the budget', 'Giải thích cách & vì sao hoạt động dẫn tới thay đổi|||Explain how & why activities lead to change', 'Xếp lịch họp|||Schedule meetings', 'Vẽ sơ đồ tổ chức|||Draw an org chart'], correctIndex: 1, explanation: 'ToC làm rõ chuỗi nhân-quả và giả định từ hoạt động tới mục tiêu.' },
  { id: 'q2', question: 'Trong logic model, "outcomes" (kết quả) là?|||In a logic model, "outcomes" are?', options: ['Thứ bạn đầu tư|||What you invest', 'Sản phẩm trực tiếp|||Direct products', 'Các thay đổi tạo ra (hành vi, điều kiện)|||The changes produced (behaviour, conditions)', 'Danh sách hoạt động|||A list of activities'], correctIndex: 2, explanation: 'Outputs là sản phẩm trực tiếp; outcomes là thay đổi thực sự tạo ra.' },
  { id: 'q3', question: 'Chữ "M" trong mục tiêu SMART là?|||The "M" in SMART goals stands for?', options: ['Motivating|||Motivating', 'Measurable (đo được)|||Measurable', 'Major|||Major', 'Managed|||Managed'], correctIndex: 1, explanation: 'SMART: Specific, Measurable, Achievable, Relevant, Time-bound.' },
]);

const c6 = doc('lsc201c-6-1-social-innovation', '6.1 — Social innovation &amp; changemaking|||6.1 — Đổi mới xã hội &amp; khởi nghiệp tạo tác động',
  'Social innovation, social enterprise (double bottom line), changemaking (Ashoka), mô hình kinh doanh vì tác động.',
  [[
    `<span class="eyebrow">LSC201c · Chapter 6 · Lesson 6.1</span>
<h2>Social innovation &amp; changemaking</h2>
<h3>Social innovation</h3>
<p><strong>Social innovation</strong> is a new solution — product, service, model or policy — that solves a social problem <em>more effectively</em> than existing approaches, with value flowing mainly to society rather than to private owners. It's the engine of community transformation.</p>
<h3>Social enterprise</h3>
<p>A <strong>social enterprise</strong> pursues a <strong>double bottom line</strong>: financial sustainability <em>and</em> social/environmental impact. Trading income (not only grants) makes the mission durable. Profit is a means to the mission, not the end.</p>
<h3>Changemaking</h3>
<p><strong>Ashoka</strong> popularized the idea that <em>everyone can be a changemaker</em> — a person who takes initiative to solve a problem for the good of all. The changemaker mindset: empathy, teamwork, new leadership, and creative problem-solving.</p>
<div class="callout"><span class="badge">Example</span> <strong>Grameen Bank</strong> (Muhammad Yunus) turned micro-lending to the poor into a self-sustaining model that lifted millions — a social innovation delivered through a social enterprise. Vietnam's <strong>KOTO</strong> trains street youth through a working restaurant on the same logic.</div>`,
    `<span class="eyebrow">LSC201c · Chương 6 · Bài 6.1</span>
<h2>Đổi mới xã hội &amp; changemaking</h2>
<h3>Đổi mới xã hội</h3>
<p><strong>Đổi mới xã hội</strong> là một giải pháp mới — sản phẩm, dịch vụ, mô hình hay chính sách — giải quyết một vấn đề xã hội <em>hiệu quả hơn</em> cách hiện có, với giá trị chảy chủ yếu về xã hội thay vì về chủ sở hữu tư nhân. Đó là động cơ của chuyển đổi cộng đồng.</p>
<h3>Doanh nghiệp xã hội</h3>
<p>Một <strong>doanh nghiệp xã hội</strong> theo đuổi <strong>hai điểm mấu chốt (double bottom line)</strong>: bền vững tài chính <em>và</em> tác động xã hội/môi trường. Thu nhập từ kinh doanh (không chỉ tài trợ) làm sứ mệnh bền lâu. Lợi nhuận là phương tiện cho sứ mệnh, không phải đích.</p>
<h3>Changemaking</h3>
<p><strong>Ashoka</strong> phổ biến ý tưởng <em>ai cũng có thể là changemaker</em> — người chủ động giải quyết một vấn đề vì lợi ích chung. Tư duy changemaker: đồng cảm, làm việc nhóm, lãnh đạo kiểu mới, và giải quyết vấn đề sáng tạo.</p>
<div class="callout"><span class="badge">Ví dụ</span> <strong>Grameen Bank</strong> (Muhammad Yunus) biến cho vay vi mô cho người nghèo thành mô hình tự nuôi mình, nâng đỡ hàng triệu người — đổi mới xã hội qua doanh nghiệp xã hội. <strong>KOTO</strong> của Việt Nam đào tạo trẻ đường phố qua một nhà hàng vận hành thực, cùng logic đó.</div>`,
  ]]);

const c6q = quiz('lsc201c-quiz-6', 'Quiz 6 — Social innovation|||Quiz 6 — Đổi mới xã hội', [
  { id: 'q1', question: '"Double bottom line" của doanh nghiệp xã hội là?|||The "double bottom line" of a social enterprise is?', options: ['Doanh thu & chi phí|||Revenue & cost', 'Bền vững tài chính & tác động xã hội|||Financial sustainability & social impact', 'Lợi nhuận & thuế|||Profit & tax', 'Vốn & nợ|||Equity & debt'], correctIndex: 1, explanation: 'Doanh nghiệp xã hội cân cả tài chính lẫn tác động xã hội/môi trường.' },
  { id: 'q2', question: 'Đổi mới xã hội khác đổi mới thông thường ở chỗ?|||Social innovation differs from ordinary innovation because?', options: ['Luôn dùng công nghệ cao|||It always uses high tech', 'Giá trị chảy chủ yếu về xã hội|||Value flows mainly to society', 'Luôn phi lợi nhuận|||It is always non-profit', 'Chỉ do chính phủ làm|||Only governments do it'], correctIndex: 1, explanation: 'Đổi mới xã hội tạo giá trị cho xã hội, không chủ yếu cho chủ sở hữu tư.' },
  { id: 'q3', question: 'Thông điệp cốt lõi của Ashoka về changemaking?|||Ashoka\'s core message about changemaking?', options: ['Chỉ chuyên gia mới đổi được|||Only experts can change things', 'Ai cũng có thể là changemaker|||Everyone can be a changemaker', 'Thay đổi cần nhiều tiền|||Change needs a lot of money', 'Thay đổi là việc của nhà nước|||Change is the state\'s job'], correctIndex: 1, explanation: 'Ashoka: everyone a changemaker — chủ động giải quyết vấn đề vì lợi ích chung.' },
]);

const c7 = doc('lsc201c-7-1-advocacy', '7.1 — Advocacy, storytelling &amp; mobilization|||7.1 — Truyền thông vận động &amp; huy động',
  'Advocacy vs campaign, community storytelling, mobilization, kênh & thông điệp, gây quỹ (crowdfunding/grants).',
  [[
    `<span class="eyebrow">LSC201c · Chapter 7 · Lesson 7.1</span>
<h2>Advocacy, storytelling &amp; mobilization</h2>
<h3>Advocacy</h3>
<p><strong>Advocacy</strong> is deliberate action to influence decisions — of officials, institutions or the public — in favour of a cause. It aims at the <em>root causes</em> (policy, resources, norms), not just symptoms. A clear <strong>ask</strong>, aimed at a specific <strong>decision-maker</strong>, is the heart of any advocacy plan.</p>
<h3>Community storytelling</h3>
<p>Data informs; <strong>stories move</strong>. Effective <strong>community storytelling</strong> centres real voices, follows a person through a change, and ends with a call to action. Marshall Ganz's "public narrative" links a <em>story of self</em>, a <em>story of us</em>, and a <em>story of now</em>.</p>
<h3>Mobilization &amp; fundraising</h3>
<ul>
<li><strong>Mobilize</strong> — turn sympathy into action: volunteers, signatures, participation, votes.</li>
<li><strong>Fundraise</strong> — grants, crowdfunding, corporate/CSR partnerships, earned income. Match the channel to the audience and tell them exactly what their money changes.</li>
</ul>
<div class="callout"><span class="badge">Example</span> The <strong>ALS Ice Bucket Challenge</strong> paired a simple, shareable action with personal stories and a clear ask — mobilizing millions of dollars and volunteers through storytelling, not statistics.</div>`,
    `<span class="eyebrow">LSC201c · Chương 7 · Bài 7.1</span>
<h2>Truyền thông vận động &amp; huy động</h2>
<h3>Vận động (advocacy)</h3>
<p><strong>Vận động</strong> là hành động có chủ đích nhằm tác động tới quyết định — của quan chức, định chế hay công chúng — có lợi cho một mục tiêu. Nó nhắm vào <em>gốc rễ</em> (chính sách, nguồn lực, chuẩn mực), không chỉ triệu chứng. Một <strong>lời đề nghị</strong> rõ ràng, hướng tới một <strong>người ra quyết định</strong> cụ thể, là trái tim của mọi kế hoạch vận động.</p>
<h3>Kể chuyện cộng đồng</h3>
<p>Số liệu để hiểu; <strong>câu chuyện lay động</strong>. <strong>Kể chuyện cộng đồng</strong> hiệu quả đặt tiếng nói thật vào trung tâm, đi theo một con người qua một thay đổi, và kết bằng lời kêu gọi hành động. "Public narrative" của Marshall Ganz nối một <em>câu chuyện về tôi</em>, một <em>câu chuyện về chúng ta</em>, và một <em>câu chuyện về lúc này</em>.</p>
<h3>Huy động &amp; gây quỹ</h3>
<ul>
<li><strong>Huy động</strong> — biến sự đồng cảm thành hành động: tình nguyện viên, chữ ký, tham gia, lá phiếu.</li>
<li><strong>Gây quỹ</strong> — tài trợ, gọi vốn cộng đồng (crowdfunding), hợp tác doanh nghiệp/CSR, thu nhập tự tạo. Chọn kênh khớp đối tượng và nói rõ tiền của họ thay đổi điều gì.</li>
</ul>
<div class="callout"><span class="badge">Ví dụ</span> <strong>ALS Ice Bucket Challenge</strong> ghép một hành động đơn giản, dễ lan truyền với câu chuyện cá nhân và một lời đề nghị rõ ràng — huy động hàng triệu đô và tình nguyện viên bằng kể chuyện, không phải thống kê.</div>`,
  ]]);

const c7q = quiz('lsc201c-quiz-7', 'Quiz 7 — Advocacy & mobilization|||Quiz 7 — Vận động & huy động', [
  { id: 'q1', question: 'Trái tim của một kế hoạch vận động (advocacy) là?|||The heart of an advocacy plan is?', options: ['Ngân sách lớn|||A big budget', 'Một lời đề nghị rõ ràng nhắm tới người ra quyết định|||A clear ask aimed at a decision-maker', 'Nhiều bài đăng mạng xã hội|||Many social posts', 'Một logo đẹp|||A nice logo'], correctIndex: 1, explanation: 'Advocacy cần "ask" cụ thể, đúng người có quyền quyết, nhắm vào gốc rễ.' },
  { id: 'q2', question: '"Public narrative" của Marshall Ganz nối ba câu chuyện nào?|||Ganz\'s public narrative links which three stories?', options: ['Của tôi, của chúng ta, của lúc này|||Of self, of us, of now', 'Quá khứ, hiện tại, tương lai|||Past, present, future', 'Vấn đề, giải pháp, chi phí|||Problem, solution, cost', 'Ai, cái gì, ở đâu|||Who, what, where'], correctIndex: 0, explanation: 'Story of self, story of us, story of now — khung kể chuyện vận động của Ganz.' },
  { id: 'q3', question: 'Vì sao câu chuyện thường huy động tốt hơn số liệu?|||Why do stories often mobilize better than statistics?', options: ['Số liệu luôn sai|||Statistics are always wrong', 'Câu chuyện lay động cảm xúc & thôi thúc hành động|||Stories move emotion & prompt action', 'Số liệu bị cấm|||Statistics are banned', 'Câu chuyện rẻ hơn|||Stories are cheaper'], correctIndex: 1, explanation: 'Số liệu để hiểu, câu chuyện để lay động và kêu gọi hành động.' },
]);

const c8 = doc('lsc201c-8-1-impact-measurement', '8.1 — Social impact measurement &amp; scaling|||8.1 — Đo lường tác động xã hội &amp; nhân rộng',
  'Output vs outcome vs impact, chỉ số & bằng chứng, SROI, tính bền vững, chiến lược nhân rộng (scale up/out/deep).',
  [[
    `<span class="eyebrow">LSC201c · Chapter 8 · Lesson 8.1</span>
<h2>Measuring impact, sustaining &amp; scaling</h2>
<h3>Output vs outcome vs impact</h3>
<p>Don't confuse activity with change. <strong>Outputs</strong> count what you did (200 trees planted). <strong>Outcomes</strong> are the changes that follow (cooler streets, greener attitudes). <strong>Impact</strong> is the long-term, attributable difference your work made <em>beyond what would have happened anyway</em>.</p>
<h3>SROI</h3>
<p><strong>Social Return on Investment (SROI)</strong> puts a monetary value on social outcomes and compares it to the money invested. An SROI of "3:1" means every 1 đồng invested created ~3 đồng of social value. It forces you to name your outcomes, find proxies, and be honest about attribution.</p>
<h3>Sustainability &amp; scaling</h3>
<ul>
<li><strong>Sustainability</strong> — will it survive the funding, the founder, and time? Build local ownership, income and capacity.</li>
<li><strong>Scale up</strong> — influence policy &amp; systems.</li>
<li><strong>Scale out</strong> — replicate to more places/people.</li>
<li><strong>Scale deep</strong> — shift culture &amp; norms.</li>
</ul>
<div class="callout"><span class="badge">Honest measurement</span> Measure to <em>learn and improve</em>, not just to look good to funders. A project that measures nothing can't prove it worked — or know when it isn't.</div>`,
    `<span class="eyebrow">LSC201c · Chương 8 · Bài 8.1</span>
<h2>Đo lường tác động, duy trì &amp; nhân rộng</h2>
<h3>Đầu ra vs kết quả vs tác động</h3>
<p>Đừng nhầm hoạt động với thay đổi. <strong>Đầu ra (output)</strong> đếm việc bạn làm (trồng 200 cây). <strong>Kết quả (outcome)</strong> là thay đổi theo sau (phố mát hơn, thái độ xanh hơn). <strong>Tác động (impact)</strong> là khác biệt lâu dài, quy được cho việc của bạn <em>ngoài phần vốn dĩ sẽ xảy ra</em>.</p>
<h3>SROI</h3>
<p><strong>Lợi tức xã hội trên đầu tư (SROI)</strong> gán giá trị tiền tệ cho kết quả xã hội và so với số tiền đầu tư. SROI "3:1" nghĩa là mỗi 1 đồng đầu tư tạo ~3 đồng giá trị xã hội. Nó buộc bạn gọi tên kết quả, tìm chỉ số thay thế, và trung thực về việc quy công.</p>
<h3>Bền vững &amp; nhân rộng</h3>
<ul>
<li><strong>Bền vững</strong> — nó có sống qua nguồn tài trợ, qua người sáng lập, và qua thời gian? Xây quyền làm chủ, thu nhập và năng lực địa phương.</li>
<li><strong>Scale up</strong> — tác động tới chính sách &amp; hệ thống.</li>
<li><strong>Scale out</strong> — nhân bản ra nhiều nơi/nhiều người hơn.</li>
<li><strong>Scale deep</strong> — dịch chuyển văn hoá &amp; chuẩn mực.</li>
</ul>
<div class="callout"><span class="badge">Đo lường trung thực</span> Đo để <em>học và cải thiện</em>, không chỉ để đẹp lòng nhà tài trợ. Dự án không đo gì thì không chứng minh được nó hiệu quả — và cũng không biết khi nào nó hỏng.</div>`,
  ]]);

const c8q = quiz('lsc201c-quiz-8', 'Quiz 8 — Impact & scaling|||Quiz 8 — Tác động & nhân rộng', [
  { id: 'q1', question: '"Trồng 200 cây" là ví dụ của?|||"200 trees planted" is an example of?', options: ['Tác động (impact)|||Impact', 'Kết quả (outcome)|||Outcome', 'Đầu ra (output)|||Output', 'Đầu vào (input)|||Input'], correctIndex: 2, explanation: 'Đếm việc đã làm = output; thay đổi theo sau mới là outcome/impact.' },
  { id: 'q2', question: 'SROI "3:1" nghĩa là?|||An SROI of "3:1" means?', options: ['Mỗi 1 đồng đầu tư tạo ~3 đồng giá trị xã hội|||Every 1 invested creates ~3 of social value', 'Dự án lỗ 3 lần|||The project loses 3×', 'Cần 3 nhà tài trợ|||Needs 3 funders', '3 năm mới xong|||Takes 3 years'], correctIndex: 0, explanation: 'SROI so giá trị xã hội tạo ra với vốn đầu tư; 3:1 = 3 đồng giá trị/1 đồng vốn.' },
  { id: 'q3', question: '"Scale deep" nghĩa là nhân rộng bằng cách?|||"Scale deep" means scaling by?', options: ['Nhân bản ra nhiều nơi|||Replicating to more places', 'Dịch chuyển văn hoá & chuẩn mực|||Shifting culture & norms', 'Tác động tới chính sách|||Influencing policy', 'Tăng ngân sách|||Increasing budget'], correctIndex: 1, explanation: 'Scale out = nhiều nơi; scale up = chính sách/hệ thống; scale deep = văn hoá/chuẩn mực.' },
]);

export default {
  semester: { code: 'KY2', name: 'Kỳ 2', ordinal: 2 },
  course: {
    courseCode: 'LSC201c',
    slug: 'lsc201c-leading-sustainable-community-transformation',
    title: 'Leading Sustainable Community Transformation',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/LSC201c.webp',
    shortDescription: 'Lead sustainable community change — communities & SDGs, asset-based development (ABCD), servant leadership, stakeholders, theory of change, social innovation & enterprise, advocacy, impact measurement (SROI). Bilingual, real projects & quizzes.|||Dẫn dắt chuyển đổi cộng đồng bền vững — cộng đồng & SDGs, phát triển dựa trên tài sản (ABCD), lãnh đạo phục vụ, bên liên quan, theory of change, đổi mới & doanh nghiệp xã hội, vận động, đo lường tác động (SROI). Song ngữ, dự án thật & quiz.',
    description: 'Môn <strong>LSC201c — Leading Sustainable Community Transformation</strong> (khối Công nghệ Truyền thông, kỳ 2) giúp bạn <strong>dẫn dắt thay đổi bền vững trong một cộng đồng</strong> từ chính nguồn lực bên trong. Từ <strong>hiểu cộng đồng &amp; SDGs</strong> → <strong>huy động tài sản (ABCD)</strong> → <strong>lãnh đạo phục vụ &amp; dẫn dắt thay đổi</strong> → <strong>bên liên quan &amp; đối thoại</strong> → <strong>thiết kế dự án (theory of change)</strong> → <strong>đổi mới xã hội &amp; doanh nghiệp</strong> → <strong>vận động &amp; huy động</strong> → <strong>đo lường tác động &amp; nhân rộng</strong>. Bám nguồn chuẩn quốc tế (ABCD, Phillips &amp; Pittman, UN SDGs, Ashoka), song ngữ, có ví dụ dự án thật và quiz mỗi chương.',
    whatYouLearn: 'Cộng đồng &amp; ba trụ bền vững, SDG 11/17; ABCD &amp; asset mapping; lãnh đạo phục vụ/tập thể, mô hình thay đổi Lewin/Kotter, trao quyền; stakeholder analysis (power/interest), đối thoại đa bên; theory of change, logic model, mục tiêu SMART, đồng thiết kế; đổi mới xã hội &amp; doanh nghiệp xã hội, changemaking; advocacy, community storytelling, huy động &amp; gây quỹ; đo lường tác động (output/outcome/impact, SROI), tính bền vững &amp; chiến lược nhân rộng.',
    requirements: 'Không cần kiến thức nền chuyên biệt. Có tinh thần phục vụ cộng đồng và sẵn sàng làm việc nhóm là đủ.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình FLM, sách ABCD & Phillips/Pittman, UN SDGs, Ashoka, SSIR, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Chuyển đổi cộng đồng bền vững là gì, dẫn từ bên trong, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Cộng đồng & bền vững|||Chapter 1 — Community & sustainability', description: 'Cộng đồng, phát triển cộng đồng, ba trụ, SDG 11/17.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Tài sản & huy động (ABCD)|||Chapter 2 — Assets & mobilization (ABCD)', description: 'Needs vs assets, năm loại tài sản, asset mapping, huy động.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Lãnh đạo & thay đổi|||Chapter 3 — Leadership & change', description: 'Servant/collective leadership, facilitation, trao quyền, Lewin/Kotter.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Bên liên quan & đối thoại|||Chapter 4 — Stakeholders & dialogue', description: 'Power/interest grid, participatory, đối thoại đa bên.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Thiết kế dự án|||Chapter 5 — Project design', description: 'Theory of change, logic model, SMART, đồng thiết kế.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Đổi mới xã hội|||Chapter 6 — Social innovation', description: 'Social innovation, doanh nghiệp xã hội, changemaking.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Vận động & huy động|||Chapter 7 — Advocacy & mobilization', description: 'Advocacy, community storytelling, huy động, gây quỹ.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Tác động & nhân rộng|||Chapter 8 — Impact & scaling', description: 'Output/outcome/impact, SROI, bền vững, nhân rộng.', lessons: [c8, c8q] },
  ],
};
