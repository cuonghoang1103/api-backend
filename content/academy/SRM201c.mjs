/**
 * SRM201c — Sustainable & Responsible Marketing Communications (Truyền thông
 * marketing bền vững & có trách nhiệm). Khối Công nghệ Truyền thông FPTU, Kỳ 4.
 * Song ngữ VI+EN, ví dụ thương hiệu/chiến dịch thật (Patagonia, Unilever
 * Sustainable Living, Dove, Vinamilk), quiz mỗi chương. 8 chương.
 * Sách: Belz & Peattie "Sustainability Marketing: A Global Perspective";
 * Kotler "Marketing 3.0"; Emery "Sustainable Marketing"; UN SDGs; ICC
 * Framework for Responsible Marketing. KHÁC SCO301 (truyền thông bền vững
 * chung) — môn này chuyên về marketing communications CÓ TRÁCH NHIỆM.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${; "&"→&amp; trong HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('srm201c-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn quốc tế, khung UN SDGs & ICC, nền tảng thực hành, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">SRM201c · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Sustainable &amp; Responsible Marketing Communications</strong> — from what "sustainability marketing" means to running honest, ethical campaigns — in one place. The official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal, industry-standard resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for SRM201c are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books (international standard)</h3>
<ul>
<li><em>Sustainability Marketing: A Global Perspective</em> — Frank-Martin Belz &amp; Ken Peattie (Wiley). The core framework of this course.</li>
<li><em>Marketing 3.0: From Products to Customers to the Human Spirit</em> — Philip Kotler, Hermawan Kartajaya &amp; Iwan Setiawan.</li>
<li><em>Sustainable Marketing</em> — Diane Martin &amp; John Schouten (Emery, Pearson).</li>
</ul>
<h3>🌐 Frameworks &amp; official guidance (free)</h3>
<ul>
<li><a href="https://sdgs.un.org/goals" target="_blank" rel="noopener">UN Sustainable Development Goals (SDGs)</a> — the 17 goals brands align to.</li>
<li><a href="https://iccwbo.org/business-solutions/marketing-advertising/" target="_blank" rel="noopener">ICC Advertising &amp; Marketing Communications Code</a> — the rules for environmental claims.</li>
<li><a href="https://www.unglobalcompact.org/" target="_blank" rel="noopener">UN Global Compact</a> — responsible business principles.</li>
</ul>
<h3>🛠️ Practice &amp; reporting</h3>
<ul>
<li><a href="https://www.globalreporting.org/" target="_blank" rel="noopener">GRI Standards</a> — sustainability reporting.</li>
<li><a href="https://bcorporation.net/" target="_blank" rel="noopener">B Corp</a> — certified purpose-driven companies to study.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — what sustainable &amp; responsible marketing is, and the green/ethical consumer.</li>
<li><strong>Message</strong> — sustainable products, honest green claims, and how to avoid greenwashing (ICC).</li>
<li><strong>Purpose</strong> — cause-related &amp; social marketing, ethics, and building brand trust.</li>
<li><strong>Prove it</strong> — measure impact and report against ESG/SDG frameworks.</li>
</ol></div>`,
    `<span class="eyebrow">SRM201c · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Truyền thông marketing bền vững &amp; có trách nhiệm</strong> — từ khái niệm "marketing bền vững" đến chạy chiến dịch trung thực, có đạo đức — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp, chuẩn quốc tế.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của SRM201c có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo (chuẩn quốc tế)</h3>
<ul>
<li><em>Sustainability Marketing: A Global Perspective</em> — Frank-Martin Belz &amp; Ken Peattie (Wiley). Khung xương của cả môn.</li>
<li><em>Marketing 3.0: From Products to Customers to the Human Spirit</em> — Philip Kotler, Hermawan Kartajaya &amp; Iwan Setiawan.</li>
<li><em>Sustainable Marketing</em> — Diane Martin &amp; John Schouten (Emery, Pearson).</li>
</ul>
<h3>🌐 Khung &amp; hướng dẫn chính thức (miễn phí)</h3>
<ul>
<li><a href="https://sdgs.un.org/goals" target="_blank" rel="noopener">17 Mục tiêu Phát triển Bền vững (SDGs) của Liên Hợp Quốc</a> — cái mà thương hiệu gắn vào.</li>
<li><a href="https://iccwbo.org/business-solutions/marketing-advertising/" target="_blank" rel="noopener">Bộ quy tắc Quảng cáo &amp; Truyền thông ICC</a> — luật cho tuyên bố môi trường.</li>
<li><a href="https://www.unglobalcompact.org/" target="_blank" rel="noopener">UN Global Compact</a> — nguyên tắc kinh doanh có trách nhiệm.</li>
</ul>
<h3>🛠️ Thực hành &amp; báo cáo</h3>
<ul>
<li><a href="https://www.globalreporting.org/" target="_blank" rel="noopener">Chuẩn GRI</a> — báo cáo phát triển bền vững.</li>
<li><a href="https://bcorporation.net/" target="_blank" rel="noopener">B Corp</a> — các công ty vì mục tiêu được chứng nhận để học hỏi.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — marketing bền vững &amp; có trách nhiệm là gì, và người tiêu dùng xanh/đạo đức.</li>
<li><strong>Thông điệp</strong> — sản phẩm bền vững, tuyên bố xanh trung thực, và cách tránh greenwashing (ICC).</li>
<li><strong>Mục tiêu</strong> — marketing gắn mục tiêu xã hội, đạo đức, và xây lòng tin thương hiệu.</li>
<li><strong>Chứng minh</strong> — đo tác động và báo cáo theo khung ESG/SDG.</li>
</ol></div>`,
  ]]);

const intro = doc('srm201c-0-1-overview', 'Course overview: Sustainable & responsible marketing|||Tổng quan: Marketing bền vững & có trách nhiệm',
  'Vì sao marketing phải bền vững & có trách nhiệm; từ Marketing 1.0→3.0; lộ trình 8 chương: khái niệm → người tiêu dùng → sản phẩm → tuyên bố xanh → mục tiêu xã hội → đạo đức → thương hiệu → đo lường.',
  [[
    `<span class="eyebrow">SRM201c · Lesson 0.1 · Overview</span>
<h2>Sustainable &amp; responsible marketing communications</h2>
<p class="lead">Traditional marketing asks "how do we sell more?". This course asks a harder question: <strong>how do we market in a way that is good for the customer, society and the planet — and still build a strong brand?</strong> You'll learn to communicate sustainability <em>honestly</em>, avoid greenwashing, and turn purpose into trust.</p>
<h3>From Marketing 1.0 to 3.0</h3>
<ul>
<li><strong>1.0 — product-centric:</strong> sell features to a mass market.</li>
<li><strong>2.0 — customer-centric:</strong> satisfy and retain the individual customer.</li>
<li><strong>3.0 — human-centric (Kotler):</strong> treat people as humans with values; serve society and the planet, not just the wallet.</li>
</ul>
<h3>Why now</h3>
<p>Consumers, regulators and investors increasingly reward brands that act responsibly — and punish those caught misleading. Sustainability is no longer a niche; it is a licence to operate.</p>
<h3>Roadmap</h3>
<p>Concepts → the sustainable consumer → sustainable products &amp; value → honest green claims (anti-greenwashing) → cause &amp; social marketing → marketing ethics → sustainable brands &amp; trust → measuring impact &amp; reporting. Bilingual, with real brand cases and a quiz each chapter.</p>`,
    `<span class="eyebrow">SRM201c · Bài 0.1 · Tổng quan</span>
<h2>Truyền thông marketing bền vững &amp; có trách nhiệm</h2>
<p class="lead">Marketing truyền thống hỏi "làm sao bán được nhiều hơn?". Môn này hỏi câu khó hơn: <strong>làm marketing thế nào để tốt cho khách hàng, xã hội và hành tinh — mà vẫn xây được thương hiệu mạnh?</strong> Bạn học cách truyền thông về sự bền vững một cách <em>trung thực</em>, tránh greenwashing, và biến mục tiêu (purpose) thành lòng tin.</p>
<h3>Từ Marketing 1.0 đến 3.0</h3>
<ul>
<li><strong>1.0 — lấy sản phẩm làm trung tâm:</strong> bán tính năng cho thị trường đại chúng.</li>
<li><strong>2.0 — lấy khách hàng làm trung tâm:</strong> làm hài lòng &amp; giữ chân từng khách.</li>
<li><strong>3.0 — lấy con người làm trung tâm (Kotler):</strong> coi con người có giá trị; phục vụ xã hội và hành tinh, không chỉ cái ví.</li>
</ul>
<h3>Vì sao là bây giờ</h3>
<p>Người tiêu dùng, cơ quan quản lý và nhà đầu tư ngày càng thưởng cho thương hiệu hành xử có trách nhiệm — và phạt kẻ bị bắt gian dối. Bền vững không còn là ngách; nó là "giấy phép hoạt động".</p>
<h3>Lộ trình</h3>
<p>Khái niệm → người tiêu dùng bền vững → sản phẩm &amp; giá trị bền vững → tuyên bố xanh trung thực (chống greenwashing) → marketing vì mục tiêu xã hội → đạo đức marketing → thương hiệu bền vững &amp; lòng tin → đo lường tác động &amp; báo cáo. Song ngữ, ví dụ thương hiệu thật, quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('srm201c-1-1-what', '1.1 — What is sustainable & responsible marketing|||1.1 — Marketing bền vững & có trách nhiệm là gì',
  'Sustainability marketing (Belz & Peattie), triple bottom line (people/planet/profit), responsible marketing, vì sao thương hiệu chuyển hướng; ví dụ Patagonia.',
  [[
    `<span class="eyebrow">SRM201c · Chapter 1 · Lesson 1.1</span>
<h2>What is sustainable &amp; responsible marketing?</h2>
<h3>Two related ideas</h3>
<ul>
<li><strong>Sustainability marketing</strong> (Belz &amp; Peattie) — building and maintaining sustainable relationships with customers, the social environment and the natural environment. It balances the <strong>triple bottom line: People, Planet, Profit</strong>.</li>
<li><strong>Responsible marketing</strong> — the duty side: marketing that is truthful, fair, and does no harm — especially in <em>how</em> it communicates and to <em>whom</em>.</li>
</ul>
<h3>Why brands are shifting</h3>
<ul>
<li><strong>Demand</strong> — consumers prefer brands aligned with their values.</li>
<li><strong>Regulation</strong> — laws increasingly police misleading green claims.</li>
<li><strong>Risk &amp; investment</strong> — ESG performance affects reputation and capital.</li>
</ul>
<div class="callout"><span class="badge">Case · Patagonia</span> Patagonia's "<strong>Don't Buy This Jacket</strong>" ad (2011) asked customers to consume less. It sounds anti-marketing — yet it deepened trust and sales grew, because the message matched what the brand genuinely does (repair, reuse, 1% for the Planet).</div>`,
    `<span class="eyebrow">SRM201c · Chương 1 · Bài 1.1</span>
<h2>Marketing bền vững &amp; có trách nhiệm là gì?</h2>
<h3>Hai ý tưởng gắn nhau</h3>
<ul>
<li><strong>Marketing bền vững</strong> (Belz &amp; Peattie) — xây và duy trì quan hệ bền vững với khách hàng, môi trường xã hội và môi trường tự nhiên. Nó cân bằng <strong>bộ ba đáy: Con người, Hành tinh, Lợi nhuận (People, Planet, Profit)</strong>.</li>
<li><strong>Marketing có trách nhiệm</strong> — mặt bổn phận: marketing trung thực, công bằng, không gây hại — nhất là ở <em>cách</em> truyền thông và <em>với ai</em>.</li>
</ul>
<h3>Vì sao thương hiệu chuyển hướng</h3>
<ul>
<li><strong>Nhu cầu</strong> — người tiêu dùng thích thương hiệu hợp giá trị của họ.</li>
<li><strong>Quy định</strong> — luật ngày càng siết các tuyên bố xanh gây hiểu lầm.</li>
<li><strong>Rủi ro &amp; đầu tư</strong> — hiệu quả ESG ảnh hưởng danh tiếng và dòng vốn.</li>
</ul>
<div class="callout"><span class="badge">Case · Patagonia</span> Quảng cáo "<strong>Đừng mua chiếc áo này</strong>" (2011) của Patagonia kêu gọi khách tiêu dùng ít lại. Nghe như phản-marketing — nhưng lại làm sâu lòng tin và doanh số vẫn tăng, vì thông điệp khớp với thứ thương hiệu thật sự làm (sửa chữa, tái dùng, 1% for the Planet).</div>`,
  ]]);

const c1q = quiz('srm201c-quiz-1', 'Quiz 1 — What it is|||Quiz 1 — Khái niệm', [
  { id: 'q1', question: '"Triple bottom line" (bộ ba đáy) gồm ba yếu tố nào?|||The triple bottom line consists of which three?', options: ['Price, Place, Promotion', 'People, Planet, Profit|||People, Planet, Profit', 'Product, Price, Profit', 'Purpose, Price, Promotion'], correctIndex: 1, explanation: 'Bộ ba đáy: People (con người), Planet (hành tinh), Profit (lợi nhuận).' },
  { id: 'q2', question: 'Theo Kotler, Marketing 3.0 lấy gì làm trung tâm?|||In Kotler\'s view, Marketing 3.0 is centred on what?', options: ['Sản phẩm', 'Con người & giá trị (human-centric)|||The human being & values', 'Giá bán', 'Kênh phân phối'], correctIndex: 1, explanation: 'Marketing 3.0 lấy con người có giá trị làm trung tâm, phục vụ cả xã hội và hành tinh.' },
  { id: 'q3', question: 'Chiến dịch "Don\'t Buy This Jacket" của Patagonia minh hoạ điều gì?|||Patagonia\'s "Don\'t Buy This Jacket" illustrates what?', options: ['Giảm giá sốc', 'Thông điệp bền vững khớp hành động thật xây được lòng tin|||A sustainability message matching real action builds trust', 'Quảng cáo gây sợ hãi', 'Bán thêm phụ kiện'], correctIndex: 1, explanation: 'Thông điệp tiêu dùng có trách nhiệm khớp với việc làm thật (sửa/tái dùng) nên tăng lòng tin.' },
]);

const c2 = doc('srm201c-2-1-consumer', '2.1 — The sustainable consumer|||2.1 — Người tiêu dùng bền vững',
  'Green/ethical consumer, attitude-behavior gap (nói vs làm), phân khúc LOHAS, rào cản mua xanh; ví dụ Unilever.',
  [[
    `<span class="eyebrow">SRM201c · Chapter 2 · Lesson 2.1</span>
<h2>The sustainable consumer</h2>
<h3>Who they are</h3>
<ul>
<li><strong>Green consumer</strong> — chooses products with lower environmental impact.</li>
<li><strong>Ethical consumer</strong> — factors in labour, animal welfare and fairness, not just ecology.</li>
<li><strong>LOHAS segment</strong> — "Lifestyles of Health and Sustainability": a committed, higher-spending group that lives its values.</li>
</ul>
<h3>The attitude–behaviour gap</h3>
<p>Most people <em>say</em> they care about sustainability, yet far fewer <em>act</em> on it at the checkout. This <strong>gap</strong> is caused by price, convenience, habit, doubt about claims, and lack of options. Good marketing narrows it — by removing friction, not by shaming.</p>
<div class="callout"><span class="badge">Case · Unilever</span> Unilever found its <strong>Sustainable Living Brands</strong> (Dove, Lifebuoy, Ben &amp; Jerry's) grew faster than the rest of the business — evidence that closing the gap with better products and honest stories pays off.</div>`,
    `<span class="eyebrow">SRM201c · Chương 2 · Bài 2.1</span>
<h2>Người tiêu dùng bền vững</h2>
<h3>Họ là ai</h3>
<ul>
<li><strong>Người tiêu dùng xanh</strong> — chọn sản phẩm ít tác động môi trường hơn.</li>
<li><strong>Người tiêu dùng đạo đức</strong> — cân nhắc cả lao động, quyền động vật và sự công bằng, không chỉ sinh thái.</li>
<li><strong>Phân khúc LOHAS</strong> — "Lối sống vì Sức khoẻ &amp; Bền vững": nhóm gắn kết, chi tiêu cao, sống đúng giá trị.</li>
</ul>
<h3>Khoảng cách thái độ – hành vi</h3>
<p>Đa số <em>nói</em> họ quan tâm bền vững, nhưng ít hơn nhiều thật sự <em>làm</em> khi thanh toán. <strong>Khoảng cách (gap)</strong> này do giá, sự tiện, thói quen, nghi ngờ tuyên bố, và thiếu lựa chọn. Marketing giỏi thu hẹp nó — bằng cách gỡ rào cản, không phải bằng cách chê trách.</p>
<div class="callout"><span class="badge">Case · Unilever</span> Unilever thấy nhóm <strong>Sustainable Living Brands</strong> (Dove, Lifebuoy, Ben &amp; Jerry's) tăng trưởng nhanh hơn phần còn lại — bằng chứng rằng thu hẹp khoảng cách bằng sản phẩm tốt hơn và câu chuyện trung thực thì có lời.</div>`,
  ]]);

const c2q = quiz('srm201c-quiz-2', 'Quiz 2 — The consumer|||Quiz 2 — Người tiêu dùng', [
  { id: 'q1', question: '"Attitude–behaviour gap" (khoảng cách thái độ–hành vi) nghĩa là gì?|||What is the attitude–behaviour gap?', options: ['Người tiêu dùng luôn làm đúng điều họ nói', 'Người ta NÓI quan tâm bền vững nhưng ít khi LÀM khi mua|||People say they care but rarely act when buying', 'Thái độ không đo được', 'Chỉ nhóm LOHAS mới có'], correctIndex: 1, explanation: 'Gap là khoảng cách giữa lời (thái độ) và việc mua thật (hành vi).' },
  { id: 'q2', question: 'LOHAS là viết tắt của?|||LOHAS stands for?', options: ['Low-Hassle Shopping', 'Lifestyles of Health and Sustainability|||Lifestyles of Health and Sustainability', 'Local Organic Home & Store', 'Loyalty of Happy Shoppers'], correctIndex: 1, explanation: 'LOHAS = Lifestyles of Health and Sustainability, nhóm sống theo giá trị bền vững.' },
  { id: 'q3', question: 'Cách ĐÚNG để marketing thu hẹp khoảng cách thái độ–hành vi là?|||The right way for marketing to narrow the gap is?', options: ['Chê trách người chưa mua xanh', 'Gỡ rào cản: giá, tiện lợi, nghi ngờ tuyên bố|||Remove friction: price, convenience, doubt', 'Giấu thông tin môi trường', 'Chỉ bán cho nhóm LOHAS'], correctIndex: 1, explanation: 'Thu hẹp gap bằng cách gỡ rào cản mua (giá, tiện, niềm tin), không phải bằng cách chê trách.' },
]);

const c3 = doc('srm201c-3-1-product', '3.1 — Sustainable products & value|||3.1 — Sản phẩm & giá trị bền vững',
  'Sustainable product, vòng đời (life-cycle) từ nôi đến mộ, kinh tế tuần hoàn (circular economy), định giá bền vững; ví dụ Patagonia Worn Wear.',
  [[
    `<span class="eyebrow">SRM201c · Chapter 3 · Lesson 3.1</span>
<h2>Sustainable products &amp; value</h2>
<h3>Thinking in life cycles</h3>
<p>A product's impact spans its whole <strong>life cycle</strong> — raw materials → manufacturing → distribution → use → end of life. Sustainable design reduces impact at every stage, not just on the shelf.</p>
<h3>The circular economy</h3>
<p>Instead of "take–make–waste" (linear), the <strong>circular economy</strong> keeps materials in use: <strong>reduce, reuse, repair, recycle</strong>. Value comes from products that last, are repairable, or can be taken back.</p>
<h3>Pricing sustainability</h3>
<p>Sustainable options often cost more to make. Marketers justify price through <strong>value</strong> — durability, health, lower running cost, and shared values — rather than competing on the lowest sticker price.</p>
<div class="callout"><span class="badge">Case · Patagonia Worn Wear</span> Patagonia sells <strong>used</strong> gear and repairs old items, extending product life and turning "buy less" into a business model — circular economy in practice.</div>`,
    `<span class="eyebrow">SRM201c · Chương 3 · Bài 3.1</span>
<h2>Sản phẩm &amp; giá trị bền vững</h2>
<h3>Tư duy theo vòng đời</h3>
<p>Tác động của sản phẩm trải suốt cả <strong>vòng đời</strong> — nguyên liệu → sản xuất → phân phối → sử dụng → thải bỏ. Thiết kế bền vững giảm tác động ở mọi khâu, không chỉ trên kệ hàng.</p>
<h3>Kinh tế tuần hoàn</h3>
<p>Thay vì "lấy–làm–bỏ" (tuyến tính), <strong>kinh tế tuần hoàn</strong> giữ vật liệu trong vòng dùng: <strong>giảm, tái dùng, sửa chữa, tái chế</strong>. Giá trị đến từ sản phẩm bền, sửa được, hoặc thu hồi được.</p>
<h3>Định giá bền vững</h3>
<p>Lựa chọn bền vững thường tốn hơn để làm ra. Người làm marketing biện minh cho giá bằng <strong>giá trị</strong> — độ bền, sức khoẻ, chi phí vận hành thấp, và giá trị chung — thay vì đua giá thấp nhất.</p>
<div class="callout"><span class="badge">Case · Patagonia Worn Wear</span> Patagonia bán đồ <strong>đã qua sử dụng</strong> và sửa món cũ, kéo dài tuổi thọ sản phẩm và biến "mua ít lại" thành mô hình kinh doanh — kinh tế tuần hoàn trong thực tế.</div>`,
  ]]);

const c3q = quiz('srm201c-quiz-3', 'Quiz 3 — Product & value|||Quiz 3 — Sản phẩm & giá trị', [
  { id: 'q1', question: 'Kinh tế tuần hoàn (circular economy) thay thế mô hình nào?|||The circular economy replaces which model?', options: ['"Lấy – làm – bỏ" tuyến tính|||The linear "take–make–waste"', 'Bộ ba đáy', 'Marketing 3.0', 'Phân khúc LOHAS'], correctIndex: 0, explanation: 'Kinh tế tuần hoàn thay mô hình tuyến tính "take–make–waste" bằng giảm/tái dùng/sửa/tái chế.' },
  { id: 'q2', question: 'Đánh giá tác động "từ nôi đến mộ" của sản phẩm gọi là?|||Assessing a product\'s impact "cradle to grave" is called?', options: ['Định giá', 'Tư duy vòng đời (life-cycle)|||Life-cycle thinking', 'Phân khúc thị trường', 'Greenwashing'], correctIndex: 1, explanation: 'Tư duy vòng đời xét tác động qua mọi khâu: nguyên liệu → sản xuất → dùng → thải bỏ.' },
  { id: 'q3', question: 'Cách hợp lý để biện minh cho giá cao hơn của sản phẩm bền vững?|||A sound way to justify a sustainable product\'s higher price?', options: ['Luôn đua giá thấp nhất', 'Nhấn GIÁ TRỊ: độ bền, sức khoẻ, chi phí vận hành thấp|||Stress value: durability, health, lower running cost', 'Giấu giá', 'Ép mua số lượng lớn'], correctIndex: 1, explanation: 'Biện minh bằng giá trị dài hạn (bền, sức khoẻ, chi phí vận hành) thay vì đua giá thấp.' },
]);

const c4 = doc('srm201c-4-1-claims', '4.1 — Communication & green claims|||4.1 — Truyền thông & tuyên bố xanh',
  'Green claims, minh bạch, greenwashing & 7 tội (sins), tiêu chí ICC cho tuyên bố môi trường; ví dụ tuyên bố mơ hồ vs cụ thể có bằng chứng.',
  [[
    `<span class="eyebrow">SRM201c · Chapter 4 · Lesson 4.1</span>
<h2>Communication &amp; green claims</h2>
<h3>What makes a claim honest</h3>
<p>A <strong>green claim</strong> must be <strong>truthful, specific, substantiated and relevant</strong>. "Eco-friendly" alone means little; "made from 60% recycled plastic, verified by [standard]" is a claim you can trust.</p>
<h3>Greenwashing</h3>
<p><strong>Greenwashing</strong> is making a product or brand appear more sustainable than it really is. Common "sins": vagueness, no proof, hidden trade-offs, irrelevance, and outright false claims.</p>
<h3>The ICC criteria</h3>
<p>The <strong>ICC Code</strong> requires environmental claims to be honest, backed by evidence available on request, and clear about whether they refer to the product, packaging, or the whole company.</p>
<pre><code>Vague (risky):    "100% eco &amp; natural"
Honest (ICC-ok):  "Bottle is 100% recycled PET;
                   cap not yet recyclable. Evidence: [link]"
</code></pre>
<div class="callout"><span class="badge">Rule of thumb</span> If you cannot show the evidence behind a claim, do not make the claim. Transparency about what you have <em>not</em> yet solved is more credible than a perfect-sounding slogan.</div>`,
    `<span class="eyebrow">SRM201c · Chương 4 · Bài 4.1</span>
<h2>Truyền thông &amp; tuyên bố xanh</h2>
<h3>Điều gì làm một tuyên bố trung thực</h3>
<p>Một <strong>tuyên bố xanh (green claim)</strong> phải <strong>trung thực, cụ thể, có bằng chứng và liên quan</strong>. Chỉ nói "thân thiện môi trường" thì vô nghĩa; "làm từ 60% nhựa tái chế, được [tiêu chuẩn] kiểm chứng" mới là tuyên bố đáng tin.</p>
<h3>Greenwashing (tẩy xanh)</h3>
<p><strong>Greenwashing</strong> là làm sản phẩm/thương hiệu trông bền vững hơn thực tế. Các "tội" thường gặp: mơ hồ, không bằng chứng, giấu đánh đổi, không liên quan, và tuyên bố sai trắng trợn.</p>
<h3>Tiêu chí ICC</h3>
<p><strong>Bộ quy tắc ICC</strong> yêu cầu tuyên bố môi trường phải trung thực, có bằng chứng cung cấp khi được yêu cầu, và rõ ràng về việc nó nói tới sản phẩm, bao bì hay cả công ty.</p>
<pre><code>Mơ hồ (rủi ro):    "100% eco &amp; thiên nhiên"
Trung thực (đạt ICC): "Chai 100% nhựa PET tái chế;
                       nắp chưa tái chế được. Bằng chứng: [link]"
</code></pre>
<div class="callout"><span class="badge">Nguyên tắc bỏ túi</span> Nếu không thể trưng ra bằng chứng cho một tuyên bố, thì đừng tuyên bố. Minh bạch về thứ mình <em>chưa</em> giải quyết được đáng tin hơn một khẩu hiệu nghe hoàn hảo.</div>`,
  ]]);

const c4q = quiz('srm201c-quiz-4', 'Quiz 4 — Green claims|||Quiz 4 — Tuyên bố xanh', [
  { id: 'q1', question: 'Greenwashing (tẩy xanh) là gì?|||What is greenwashing?', options: ['Rửa sản phẩm bằng nước sạch', 'Làm thương hiệu/sản phẩm trông bền vững HƠN thực tế|||Making a brand look more sustainable than it is', 'Một loại chứng chỉ ESG', 'Tái chế bao bì'], correctIndex: 1, explanation: 'Greenwashing là phóng đại/gây hiểu lầm về mức độ bền vững thật của sản phẩm hay thương hiệu.' },
  { id: 'q2', question: 'Theo tiêu chí ICC, một tuyên bố xanh tốt phải?|||Under ICC criteria, a good green claim must be?', options: ['Mơ hồ để linh hoạt', 'Trung thực, cụ thể, có bằng chứng|||Truthful, specific and substantiated', 'To và bắt mắt', 'Chỉ dùng từ "eco"'], correctIndex: 1, explanation: 'ICC yêu cầu tuyên bố trung thực, cụ thể, có bằng chứng và nêu rõ phạm vi (sản phẩm/bao bì/công ty).' },
  { id: 'q3', question: 'Tuyên bố nào ĐÁNG TIN hơn?|||Which claim is more trustworthy?', options: ['"100% eco &amp; thiên nhiên"', '"Chai 100% PET tái chế; nắp chưa tái chế được, bằng chứng: [link]"|||"Bottle 100% recycled PET; cap not yet recyclable, evidence: [link]"', '"Xanh nhất thị trường"', '"Tốt cho hành tinh"'], correctIndex: 1, explanation: 'Tuyên bố cụ thể, có phạm vi rõ và bằng chứng, kể cả phần chưa giải quyết, thì đáng tin hơn khẩu hiệu mơ hồ.' },
]);

const c5 = doc('srm201c-5-1-cause', '5.1 — Cause & social marketing|||5.1 — Marketing vì mục tiêu xã hội',
  'Cause-related marketing (CRM), brand purpose, social marketing (đổi hành vi vì lợi ích xã hội); ví dụ Dove Real Beauty & Lifebuoy rửa tay.',
  [[
    `<span class="eyebrow">SRM201c · Chapter 5 · Lesson 5.1</span>
<h2>Cause &amp; social marketing</h2>
<h3>Three related ideas</h3>
<ul>
<li><strong>Cause-related marketing (CRM)</strong> — a brand ties sales to supporting a cause ("buy this, we donate to X"). Powerful, but must be transparent about how much and to whom.</li>
<li><strong>Brand purpose</strong> — a reason for being beyond profit, woven through everything the brand does.</li>
<li><strong>Social marketing</strong> — using marketing techniques to change behaviour for <em>society's</em> benefit (health, safety, environment), not to sell a product.</li>
</ul>
<h3>What makes purpose credible</h3>
<p>Purpose works only when it is <strong>authentic and consistent</strong> — connected to the product and backed by action. Bolted-on purpose ("purpose-washing") is spotted quickly.</p>
<div class="callout"><span class="badge">Case · Dove &amp; Lifebuoy</span> Dove's <strong>Real Beauty</strong> tied the brand to self-esteem; Unilever's <strong>Lifebuoy</strong> ran a social-marketing programme teaching handwashing to reduce disease — behaviour change that also fit the product.</div>`,
    `<span class="eyebrow">SRM201c · Chương 5 · Bài 5.1</span>
<h2>Marketing vì mục tiêu xã hội</h2>
<h3>Ba ý tưởng gắn nhau</h3>
<ul>
<li><strong>Cause-related marketing (CRM)</strong> — thương hiệu gắn doanh số với việc ủng hộ một mục tiêu ("mua món này, chúng tôi quyên góp cho X"). Mạnh, nhưng phải minh bạch bao nhiêu và cho ai.</li>
<li><strong>Brand purpose (mục tiêu thương hiệu)</strong> — lý do tồn tại vượt lợi nhuận, dệt xuyên suốt mọi việc thương hiệu làm.</li>
<li><strong>Social marketing</strong> — dùng kỹ thuật marketing để đổi hành vi vì lợi ích <em>xã hội</em> (sức khoẻ, an toàn, môi trường), không phải để bán sản phẩm.</li>
</ul>
<h3>Điều gì làm mục tiêu đáng tin</h3>
<p>Mục tiêu chỉ hiệu quả khi <strong>chân thật và nhất quán</strong> — gắn với sản phẩm và có hành động thật. Mục tiêu gắn tạm ("purpose-washing") bị nhận ra rất nhanh.</p>
<div class="callout"><span class="badge">Case · Dove &amp; Lifebuoy</span> <strong>Real Beauty</strong> của Dove gắn thương hiệu với lòng tự tôn; <strong>Lifebuoy</strong> của Unilever chạy chương trình social marketing dạy rửa tay để giảm bệnh — đổi hành vi mà vẫn khớp sản phẩm.</div>`,
  ]]);

const c5q = quiz('srm201c-quiz-5', 'Quiz 5 — Cause & social|||Quiz 5 — Mục tiêu xã hội', [
  { id: 'q1', question: 'Social marketing khác marketing thương mại ở chỗ nào?|||How does social marketing differ from commercial marketing?', options: ['Không dùng kỹ thuật marketing', 'Nhằm ĐỔI HÀNH VI vì lợi ích xã hội, không phải bán sản phẩm|||It changes behaviour for society, not to sell', 'Chỉ chạy trên mạng xã hội', 'Luôn miễn phí'], correctIndex: 1, explanation: 'Social marketing dùng kỹ thuật marketing để đổi hành vi vì lợi ích xã hội (sức khoẻ, an toàn...).' },
  { id: 'q2', question: 'Cause-related marketing (CRM) nên đặc biệt chú ý điều gì?|||Cause-related marketing must especially ensure what?', options: ['Giá thật thấp', 'Minh bạch: quyên góp BAO NHIÊU và cho AI|||Transparency: how much is donated and to whom', 'Chạy càng nhiều kênh càng tốt', 'Giấu tên tổ chức nhận'], correctIndex: 1, explanation: 'CRM phải minh bạch số tiền/tỉ lệ quyên góp và bên nhận, nếu không sẽ mất niềm tin.' },
  { id: 'q3', question: 'Brand purpose chỉ đáng tin khi?|||Brand purpose is credible only when?', options: ['Chỉ nói trong quảng cáo', 'Chân thật, nhất quán và có hành động thật|||It is authentic, consistent and backed by action', 'Gắn tạm cho hợp xu hướng', 'Càng chung chung càng tốt'], correctIndex: 1, explanation: 'Purpose gắn tạm ("purpose-washing") dễ bị nhận ra; nó phải chân thật, nhất quán, có hành động.' },
]);

const c6 = doc('srm201c-6-1-ethics', '6.1 — Ethics in marketing|||6.1 — Đạo đức trong marketing',
  'Marketing tới nhóm dễ tổn thương (trẻ em, người thu nhập thấp), quảng cáo có trách nhiệm, tiêu dùng có ý thức, quyền riêng tư dữ liệu.',
  [[
    `<span class="eyebrow">SRM201c · Chapter 6 · Lesson 6.1</span>
<h2>Ethics in marketing</h2>
<h3>Protecting the vulnerable</h3>
<p>Some audiences deserve extra care: <strong>children</strong>, the elderly, people in financial hardship, or those with health conditions. Responsible marketing does not exploit limited literacy, fears, or lack of options — e.g. marketing junk food to children, or high-cost credit to the desperate.</p>
<h3>Responsible advertising</h3>
<ul>
<li>Be <strong>truthful</strong> — no deceptive imagery or fine print that reverses the headline.</li>
<li>Be <strong>respectful</strong> — avoid harmful stereotypes and manipulation.</li>
<li>Respect <strong>privacy</strong> — collect data with consent and use it fairly.</li>
</ul>
<h3>Encouraging conscious consumption</h3>
<p>Ethical marketing can nudge people to consume <em>mindfully</em> — buy what they need, use it fully, and dispose responsibly — rather than manufacturing endless wants.</p>
<div class="callout"><span class="badge">Test it</span> Before publishing, ask: would this still look fair if the most vulnerable person in the audience — and a journalist — saw exactly how it works?</div>`,
    `<span class="eyebrow">SRM201c · Chương 6 · Bài 6.1</span>
<h2>Đạo đức trong marketing</h2>
<h3>Bảo vệ nhóm dễ tổn thương</h3>
<p>Một số đối tượng cần được chăm sóc hơn: <strong>trẻ em</strong>, người già, người khó khăn tài chính, hoặc người có vấn đề sức khoẻ. Marketing có trách nhiệm không lợi dụng sự thiếu hiểu biết, nỗi sợ, hay việc thiếu lựa chọn — ví dụ quảng cáo đồ ăn vặt cho trẻ em, hay tín dụng lãi cao cho người cùng quẫn.</p>
<h3>Quảng cáo có trách nhiệm</h3>
<ul>
<li><strong>Trung thực</strong> — không dùng hình ảnh đánh lừa hay dòng chữ nhỏ lật ngược tiêu đề.</li>
<li><strong>Tôn trọng</strong> — tránh định kiến gây hại và thao túng.</li>
<li>Tôn trọng <strong>quyền riêng tư</strong> — thu thập dữ liệu có đồng ý và dùng công bằng.</li>
</ul>
<h3>Khuyến khích tiêu dùng có ý thức</h3>
<p>Marketing có đạo đức có thể thúc người ta tiêu dùng <em>có ý thức</em> — mua thứ cần, dùng hết, và thải bỏ có trách nhiệm — thay vì tạo ra ham muốn vô tận.</p>
<div class="callout"><span class="badge">Phép thử</span> Trước khi đăng, hãy hỏi: liệu nó có còn công bằng không nếu người dễ tổn thương nhất trong khán giả — và một nhà báo — nhìn thấy đúng cách nó vận hành?</div>`,
  ]]);

const c6q = quiz('srm201c-quiz-6', 'Quiz 6 — Marketing ethics|||Quiz 6 — Đạo đức marketing', [
  { id: 'q1', question: 'Vì sao trẻ em được xem là "nhóm dễ tổn thương" trong marketing?|||Why are children treated as a "vulnerable" audience?', options: ['Vì không có tiền', 'Vì chưa đủ khả năng đánh giá thông điệp quảng cáo|||They cannot fully evaluate advertising messages', 'Vì không dùng internet', 'Vì luật cấm hoàn toàn quảng cáo'], correctIndex: 1, explanation: 'Trẻ em chưa đủ khả năng phê phán thông điệp nên cần được bảo vệ đặc biệt.' },
  { id: 'q2', question: 'Đâu là dấu hiệu quảng cáo THIẾU trách nhiệm?|||Which is a sign of irresponsible advertising?', options: ['Nêu bằng chứng rõ ràng', 'Dòng chữ nhỏ lật ngược lời tiêu đề, gây hiểu lầm|||Fine print that reverses the headline', 'Xin đồng ý khi thu dữ liệu', 'Tránh định kiến gây hại'], correctIndex: 1, explanation: 'Chữ nhỏ đảo ngược tiêu đề là chiêu gây hiểu lầm — thiếu trung thực, thiếu trách nhiệm.' },
  { id: 'q3', question: '"Tiêu dùng có ý thức" (conscious consumption) khuyến khích điều gì?|||Conscious consumption encourages what?', options: ['Mua càng nhiều càng tốt', 'Mua thứ cần, dùng hết, thải bỏ có trách nhiệm|||Buy what you need, use fully, dispose responsibly', 'Chỉ mua hàng giảm giá', 'Không bao giờ mua gì'], correctIndex: 1, explanation: 'Tiêu dùng có ý thức: mua đúng nhu cầu, dùng hết giá trị, thải bỏ có trách nhiệm.' },
]);

const c7 = doc('srm201c-7-1-brand', '7.1 — Sustainable brands & trust|||7.1 — Thương hiệu bền vững & lòng tin',
  'Brand purpose, ESG như một phần thương hiệu, xây lòng tin (say-do gap), cộng đồng & minh bạch; ví dụ Vinamilk Green Farm/net-zero.',
  [[
    `<span class="eyebrow">SRM201c · Chapter 7 · Lesson 7.1</span>
<h2>Sustainable brands &amp; trust</h2>
<h3>Trust is earned, not claimed</h3>
<p>A sustainable brand's strongest asset is <strong>trust</strong> — and trust dies on the <strong>say–do gap</strong>: the distance between what a brand promises and what it actually does. Consistency over years, not campaigns, builds it.</p>
<h3>ESG as part of the brand</h3>
<p><strong>ESG</strong> (Environmental, Social, Governance) is how companies structure responsibility. When ESG is real and communicated openly, it strengthens the brand; when it is a slide deck only, it becomes a liability.</p>
<h3>Community &amp; transparency</h3>
<p>Sustainable brands invite scrutiny: they publish goals, admit misses, and build a <strong>community</strong> of customers who co-own the mission. Openness about failures is a trust <em>builder</em>, not a weakness.</p>
<div class="callout"><span class="badge">Case · Vinamilk</span> Vinamilk promotes its <strong>Green Farm</strong> ecosystem and a public <strong>net-zero</strong> roadmap. The lesson for marketers: pair the green story with verifiable targets and progress reports, so the claim and the action stay in step.</div>`,
    `<span class="eyebrow">SRM201c · Chương 7 · Bài 7.1</span>
<h2>Thương hiệu bền vững &amp; lòng tin</h2>
<h3>Lòng tin được tạo ra, không phải tự nhận</h3>
<p>Tài sản mạnh nhất của một thương hiệu bền vững là <strong>lòng tin</strong> — và lòng tin chết ở <strong>khoảng cách nói–làm (say–do gap)</strong>: khoảng cách giữa lời hứa và việc làm thật. Sự nhất quán qua nhiều năm, không phải vài chiến dịch, mới xây được nó.</p>
<h3>ESG là một phần của thương hiệu</h3>
<p><strong>ESG</strong> (Môi trường, Xã hội, Quản trị) là cách công ty tổ chức trách nhiệm. Khi ESG là thật và được truyền thông cởi mở, nó làm mạnh thương hiệu; khi chỉ là bộ slide, nó thành gánh nặng.</p>
<h3>Cộng đồng &amp; minh bạch</h3>
<p>Thương hiệu bền vững mời gọi sự soi xét: công bố mục tiêu, thừa nhận điều chưa đạt, và xây một <strong>cộng đồng</strong> khách hàng cùng sở hữu sứ mệnh. Cởi mở về thất bại là thứ <em>xây</em> lòng tin, không phải điểm yếu.</p>
<div class="callout"><span class="badge">Case · Vinamilk</span> Vinamilk quảng bá hệ sinh thái <strong>Green Farm</strong> và lộ trình <strong>net-zero</strong> công khai. Bài học cho người làm marketing: gắn câu chuyện xanh với mục tiêu kiểm chứng được và báo cáo tiến độ, để tuyên bố và hành động luôn khớp nhịp.</div>`,
  ]]);

const c7q = quiz('srm201c-quiz-7', 'Quiz 7 — Brand & trust|||Quiz 7 — Thương hiệu & lòng tin', [
  { id: 'q1', question: '"Say–do gap" (khoảng cách nói–làm) của thương hiệu là gì?|||What is a brand\'s say–do gap?', options: ['Khoảng cách giữa hai chiến dịch', 'Khoảng cách giữa lời hứa và việc làm thật|||The gap between what a brand promises and does', 'Chi phí quảng cáo', 'Số lượng cửa hàng'], correctIndex: 1, explanation: 'Say–do gap là khoảng cách giữa lời hứa bền vững và hành động thực tế; nó phá lòng tin.' },
  { id: 'q2', question: 'ESG là viết tắt của?|||ESG stands for?', options: ['Economy, Sales, Growth', 'Environmental, Social, Governance|||Environmental, Social, Governance', 'Eco, Service, Green', 'Ethics, Safety, Goals'], correctIndex: 1, explanation: 'ESG = Environmental (môi trường), Social (xã hội), Governance (quản trị).' },
  { id: 'q3', question: 'Với thương hiệu bền vững, cởi mở thừa nhận điều CHƯA đạt sẽ?|||For a sustainable brand, openly admitting misses will?', options: ['Luôn phá huỷ thương hiệu', 'Xây lòng tin nếu đi kèm mục tiêu & tiến độ minh bạch|||Build trust if paired with transparent goals & progress', 'Vi phạm luật', 'Không ảnh hưởng gì'], correctIndex: 1, explanation: 'Minh bạch cả điều chưa đạt, kèm mục tiêu và tiến độ, làm mạnh lòng tin hơn khẩu hiệu hoàn hảo.' },
]);

const c8 = doc('srm201c-8-1-impact', '8.1 — Measuring impact & reporting|||8.1 — Đo lường tác động & báo cáo',
  'Impact metrics (không chỉ doanh số), báo cáo ESG/SDG (GRI), ROI bền vững, minh bạch & tránh báo cáo chọn lọc; khép vòng đo → cải thiện.',
  [[
    `<span class="eyebrow">SRM201c · Chapter 8 · Lesson 8.1</span>
<h2>Measuring impact &amp; reporting</h2>
<h3>Measure impact, not just sales</h3>
<p>Sustainable marketing needs metrics beyond revenue: <strong>emissions avoided, recycled content, water saved, people reached, behaviour changed</strong>. What gets measured gets managed — and reported honestly, gets trusted.</p>
<h3>Reporting frameworks</h3>
<ul>
<li><strong>ESG reporting</strong> — structured disclosure of environmental, social and governance performance.</li>
<li><strong>SDG alignment</strong> — mapping actions to the UN's 17 goals, with real targets.</li>
<li><strong>GRI Standards</strong> — a common language for sustainability reports.</li>
</ul>
<h3>Sustainable ROI &amp; honesty</h3>
<p>Show the return of sustainability (loyalty, premium, risk reduced) — but avoid <strong>cherry-picking</strong> only the flattering numbers. Report the misses too; selective reporting is a form of greenwashing.</p>
<div class="callout"><span class="badge">Close the loop</span> Set targets → measure → report transparently → improve. The cycle turns sustainability from a campaign into a credible, long-term brand system.</div>`,
    `<span class="eyebrow">SRM201c · Chương 8 · Bài 8.1</span>
<h2>Đo lường tác động &amp; báo cáo</h2>
<h3>Đo tác động, không chỉ doanh số</h3>
<p>Marketing bền vững cần chỉ số vượt doanh thu: <strong>phát thải tránh được, tỉ lệ tái chế, nước tiết kiệm, số người tiếp cận, hành vi đã đổi</strong>. Cái gì đo được thì quản được — và báo cáo trung thực thì được tin.</p>
<h3>Khung báo cáo</h3>
<ul>
<li><strong>Báo cáo ESG</strong> — công bố có cấu trúc về hiệu quả môi trường, xã hội, quản trị.</li>
<li><strong>Gắn với SDG</strong> — ánh xạ hành động vào 17 mục tiêu của LHQ, kèm chỉ tiêu thật.</li>
<li><strong>Chuẩn GRI</strong> — ngôn ngữ chung cho báo cáo phát triển bền vững.</li>
</ul>
<h3>ROI bền vững &amp; sự trung thực</h3>
<p>Cho thấy lợi ích của bền vững (lòng trung thành, giá trội, giảm rủi ro) — nhưng tránh <strong>chọn lọc</strong> chỉ những con số đẹp. Báo cả điều chưa đạt; báo cáo chọn lọc cũng là một dạng greenwashing.</p>
<div class="callout"><span class="badge">Khép vòng lặp</span> Đặt mục tiêu → đo → báo cáo minh bạch → cải thiện. Vòng lặp biến bền vững từ một chiến dịch thành một hệ thống thương hiệu đáng tin, dài hạn.</div>`,
  ]]);

const c8q = quiz('srm201c-quiz-8', 'Quiz 8 — Impact & reporting|||Quiz 8 — Đo lường & báo cáo', [
  { id: 'q1', question: 'Vì sao marketing bền vững cần đo cả tác động chứ không chỉ doanh số?|||Why measure impact, not only sales?', options: ['Vì doanh số không quan trọng', 'Vì tác động (phát thải, tái chế, người tiếp cận) mới chứng minh cam kết|||Impact metrics prove the sustainability commitment', 'Vì luật cấm đo doanh số', 'Vì để giấu chi phí'], correctIndex: 1, explanation: 'Chỉ số tác động (phát thải tránh, tái chế, hành vi đổi) chứng minh cam kết bền vững là thật.' },
  { id: 'q2', question: 'GRI Standards dùng để làm gì?|||What are the GRI Standards used for?', options: ['Định giá sản phẩm', 'Tạo ngôn ngữ chung cho báo cáo phát triển bền vững|||A common language for sustainability reporting', 'Chạy quảng cáo Google', 'Thiết kế bao bì'], correctIndex: 1, explanation: 'GRI là bộ chuẩn chung cho báo cáo phát triển bền vững, giúp so sánh và minh bạch.' },
  { id: 'q3', question: 'Chỉ báo cáo những con số đẹp và giấu điều chưa đạt gọi là?|||Reporting only flattering numbers while hiding misses is?', options: ['Minh bạch tốt', 'Một dạng greenwashing (báo cáo chọn lọc)|||A form of greenwashing (selective reporting)', 'Chuẩn GRI', 'ROI bền vững'], correctIndex: 1, explanation: 'Báo cáo chọn lọc, giấu điều chưa đạt, cũng là một dạng greenwashing — mất lòng tin.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'SRM201c',
    slug: 'srm201c-sustainable-responsible-marketing-communications',
    title: 'Sustainable & Responsible Marketing Communications',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/SRM201c.webp',
    shortDescription: 'Responsible, sustainable marketing communications — green & ethical consumers, sustainable products & circular value, honest green claims vs greenwashing (ICC), cause & social marketing, ethics, sustainable brands & trust, impact & ESG/SDG reporting.|||Truyền thông marketing bền vững & có trách nhiệm — người tiêu dùng xanh & đạo đức, sản phẩm bền vững & kinh tế tuần hoàn, tuyên bố xanh vs greenwashing (ICC), mục tiêu xã hội, đạo đức, thương hiệu bền vững & đo tác động ESG/SDG.',
    description: 'Môn <strong>SRM201c — Sustainable &amp; Responsible Marketing Communications</strong> (Truyền thông marketing bền vững &amp; có trách nhiệm, khối Công nghệ Truyền thông) dạy cách <strong>truyền thông về sự bền vững một cách trung thực</strong> và <strong>làm marketing có đạo đức</strong> mà vẫn xây được thương hiệu mạnh. Từ <strong>khái niệm</strong> (marketing bền vững &amp; có trách nhiệm, Marketing 3.0) → <strong>người tiêu dùng bền vững</strong> (attitude–behaviour gap, LOHAS) → <strong>sản phẩm &amp; giá trị</strong> (vòng đời, kinh tế tuần hoàn) → <strong>tuyên bố xanh</strong> (chống greenwashing, tiêu chí ICC) → <strong>marketing vì mục tiêu xã hội</strong> (cause-related, social marketing) → <strong>đạo đức</strong> → <strong>thương hiệu &amp; lòng tin</strong> (ESG) → <strong>đo lường tác động &amp; báo cáo</strong> (ESG/SDG, GRI). Bám sách chuẩn quốc tế (Belz &amp; Peattie, Kotler, Emery, UN SDGs, ICC), song ngữ, ví dụ thương hiệu thật (Patagonia, Unilever, Dove, Vinamilk), quiz mỗi chương.',
    whatYouLearn: 'Marketing bền vững &amp; có trách nhiệm là gì; triple bottom line (People/Planet/Profit); Marketing 1.0→3.0; người tiêu dùng xanh/đạo đức, khoảng cách thái độ–hành vi, phân khúc LOHAS; sản phẩm bền vững, tư duy vòng đời, kinh tế tuần hoàn, định giá theo giá trị; tuyên bố xanh trung thực, greenwashing &amp; 7 tội, tiêu chí ICC; cause-related marketing, brand purpose, social marketing đổi hành vi; đạo đức &amp; nhóm dễ tổn thương, quảng cáo có trách nhiệm, tiêu dùng có ý thức; thương hiệu bền vững, say–do gap, ESG, cộng đồng &amp; minh bạch; đo tác động, báo cáo ESG/SDG (GRI), ROI bền vững.',
    requirements: 'Không cần nền kỹ thuật. Nên có hiểu biết marketing cơ bản (4P) và quan tâm tới các vấn đề môi trường – xã hội để liên hệ ví dụ thực tế.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách chuẩn quốc tế, khung UN SDGs & ICC, nền tảng thực hành, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Vì sao marketing phải bền vững & có trách nhiệm; Marketing 1.0→3.0; lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Khái niệm|||Chapter 1 — What it is', description: 'Sustainability & responsible marketing, triple bottom line; Patagonia.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Người tiêu dùng bền vững|||Chapter 2 — The consumer', description: 'Green/ethical consumer, attitude–behaviour gap, LOHAS; Unilever.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Sản phẩm & giá trị|||Chapter 3 — Product & value', description: 'Vòng đời, kinh tế tuần hoàn, định giá bền vững; Patagonia Worn Wear.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Tuyên bố xanh|||Chapter 4 — Green claims', description: 'Green claims, greenwashing, tiêu chí ICC, minh bạch.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Mục tiêu xã hội|||Chapter 5 — Cause & social', description: 'Cause-related, brand purpose, social marketing; Dove & Lifebuoy.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Đạo đức marketing|||Chapter 6 — Ethics', description: 'Nhóm dễ tổn thương, quảng cáo có trách nhiệm, tiêu dùng có ý thức.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Thương hiệu & lòng tin|||Chapter 7 — Brand & trust', description: 'Brand purpose, ESG, say–do gap, cộng đồng; Vinamilk.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Đo lường & báo cáo|||Chapter 8 — Impact & reporting', description: 'Impact metrics, ESG/SDG, GRI, ROI bền vững, minh bạch.', lessons: [c8, c8q] },
  ],
};
