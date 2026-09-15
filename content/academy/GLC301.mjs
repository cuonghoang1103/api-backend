/**
 * GLC301 — E-Customs (Hải quan điện tử). Giáo trình FLM (syl): Luật Hải quan
 * VN 2014, hệ thống VNACCS/VCIS, khung WCO, phân loại mã HS, trị giá hải
 * quan, quy trình thông quan, xuất xứ C/O & FTA, quản lý rủi ro & AEO.
 * Song ngữ + ví dụ + quiz. Giữ NGUYÊN slug/semester/thumb(v3).
 * ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('glc301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: Luật Hải quan 2014, VNACCS/VCIS, WCO, biểu thuế HS, tra cứu C/O & FTA, lộ trình tự học.',
  [[
    `<span class="eyebrow">GLC301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Vietnam's <strong>e-customs</strong> — legal framework, the VNACCS/VCIS system, HS classification, valuation, clearance and origin/FTA preferences — in one place. Full official slides &amp; textbook live on <strong>FLM</strong>; below are free, official/legal references.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for GLC301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Legal texts &amp; official portals</h3>
<ul>
<li><a href="https://www.customs.gov.vn" target="_blank" rel="noopener">Tổng cục Hải quan (General Department of Vietnam Customs)</a> — Customs Law, circulars, statistics</li>
<li><a href="https://vnaccs.customs.gov.vn" target="_blank" rel="noopener">VNACCS/VCIS portal</a> — the electronic declaration system used in this course</li>
<li><a href="https://www.wcoomd.org" target="_blank" rel="noopener">World Customs Organization (WCO)</a> — HS Convention, Revised Kyoto Convention, SAFE Framework</li>
<li><a href="https://www.wto.org/english/tratop_e/cusval_e/cusval_info_e.htm" target="_blank" rel="noopener">WTO — Customs Valuation Agreement</a></li>
</ul>
<h3>🌐 Tariff &amp; origin lookup</h3>
<ul>
<li><a href="https://www.customs.gov.vn/index.jsp?pageId=3&amp;cid=45" target="_blank" rel="noopener">Biểu thuế xuất nhập khẩu (import/export tariff schedule)</a></li>
<li><a href="https://asean.org/asean-trade-in-goods-agreement/" target="_blank" rel="noopener">ATIGA — ASEAN Trade in Goods Agreement (C/O form D)</a></li>
<li><a href="https://trungtamwto.vn" target="_blank" rel="noopener">Trung tâm WTO &amp; Hội nhập (VCCI)</a> — tóm tắt các FTA Việt Nam tham gia</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — role of customs, Vietnam's legal framework (Customs Law 2014), WCO conventions.</li>
<li><strong>Core system</strong> — VNACCS/VCIS declaration workflow, HS classification, customs valuation &amp; tax calculation.</li>
<li><strong>Procedures</strong> — clearance channels (green/yellow/red), post-clearance audit, penalties.</li>
<li><strong>Advanced</strong> — rules of origin, C/O forms &amp; FTA preferences, risk management, AEO, National Single Window.</li>
</ol></div>`,
    `<span class="eyebrow">GLC301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>hải quan điện tử</strong> Việt Nam — khung pháp lý, hệ thống VNACCS/VCIS, phân loại mã HS, trị giá hải quan, thông quan và ưu đãi xuất xứ/FTA — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn chính thức/hợp pháp, miễn phí.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của GLC301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Văn bản pháp luật &amp; cổng chính thức</h3>
<ul>
<li><a href="https://www.customs.gov.vn" target="_blank" rel="noopener">Tổng cục Hải quan</a> — Luật Hải quan, thông tư, số liệu thống kê</li>
<li><a href="https://vnaccs.customs.gov.vn" target="_blank" rel="noopener">Cổng VNACCS/VCIS</a> — hệ thống khai báo điện tử dùng trong môn này</li>
<li><a href="https://www.wcoomd.org" target="_blank" rel="noopener">Tổ chức Hải quan Thế giới (WCO)</a> — Công ước HS, Công ước Kyoto sửa đổi, Khung SAFE</li>
<li><a href="https://www.wto.org/english/tratop_e/cusval_e/cusval_info_e.htm" target="_blank" rel="noopener">WTO — Hiệp định Trị giá hải quan</a></li>
</ul>
<h3>🌐 Tra cứu biểu thuế &amp; xuất xứ</h3>
<ul>
<li><a href="https://www.customs.gov.vn/index.jsp?pageId=3&amp;cid=45" target="_blank" rel="noopener">Biểu thuế xuất nhập khẩu</a></li>
<li><a href="https://asean.org/asean-trade-in-goods-agreement/" target="_blank" rel="noopener">ATIGA — Hiệp định Thương mại Hàng hoá ASEAN (C/O mẫu D)</a></li>
<li><a href="https://trungtamwto.vn" target="_blank" rel="noopener">Trung tâm WTO &amp; Hội nhập (VCCI)</a> — tóm tắt các FTA Việt Nam tham gia</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — vai trò hải quan, khung pháp lý Việt Nam (Luật Hải quan 2014), các công ước WCO.</li>
<li><strong>Hệ thống cốt lõi</strong> — quy trình khai báo VNACCS/VCIS, phân loại mã HS, trị giá hải quan &amp; tính thuế.</li>
<li><strong>Quy trình</strong> — luồng thông quan (xanh/vàng/đỏ), kiểm tra sau thông quan, xử phạt.</li>
<li><strong>Nâng cao</strong> — quy tắc xuất xứ, mẫu C/O &amp; ưu đãi FTA, quản lý rủi ro, AEO, Cơ chế một cửa quốc gia.</li>
</ol></div>`,
  ]]);

const intro = doc('glc301-0-1-overview', 'Course overview: E-Customs|||Tổng quan: Hải quan điện tử',
  'Hải quan là gì & vai trò trong thương mại; vì sao chuyển sang điện tử; lộ trình 8 chương từ pháp lý → VNACCS/VCIS → mã HS/trị giá → thông quan → C/O/FTA → AEO.',
  [[
    `<span class="eyebrow">GLC301 · Lesson 0.1 · Overview</span>
<h2>E-Customs</h2>
<p class="lead">This course explains <strong>how electronic customs works</strong> in Vietnam — the legal framework, the VNACCS/VCIS declaration system, goods classification, customs valuation and duty calculation, the clearance process, rules of origin/FTA preferences, and modern risk-based, digital customs.</p>
<h3>What is customs, and why it matters</h3>
<ul>
<li><strong>Revenue collection</strong> — import/export duties are still a meaningful state revenue source.</li>
<li><strong>Trade facilitation</strong> — fast, predictable clearance keeps supply chains moving.</li>
<li><strong>Control</strong> — enforcing bans/restrictions (weapons, drugs, counterfeits, endangered species) and technical/sanitary regulations.</li>
<li><strong>Statistics &amp; policy</strong> — trade data feeds economic planning and trade negotiations.</li>
</ul>
<h3>From paper to electronic</h3>
<p>Traditional customs meant physical paper declarations, in-person queues and manual checks — slow and prone to inconsistency. <strong>E-customs</strong> (VNACCS/VCIS since 2014) moves declaration, risk classification and much of document review online, cutting clearance time from days to hours for most shipments.</p>
<h3>Roadmap</h3>
<p>Legal framework (Customs Law 2014 &amp; WCO) → VNACCS/VCIS declaration → HS classification → customs valuation &amp; taxes → clearance &amp; post-clearance audit → rules of origin &amp; FTA preferences → risk management, AEO &amp; the National Single Window. Bilingual, with worked examples and quizzes.</p>`,
    `<span class="eyebrow">GLC301 · Bài 0.1 · Tổng quan</span>
<h2>Hải quan điện tử</h2>
<p class="lead">Môn này giải thích <strong>hải quan điện tử ở Việt Nam hoạt động thế nào</strong> — khung pháp lý, hệ thống khai báo VNACCS/VCIS, phân loại hàng hoá, trị giá hải quan &amp; tính thuế, quy trình thông quan, quy tắc xuất xứ/ưu đãi FTA, và hải quan hiện đại quản lý theo rủi ro, số hoá.</p>
<h3>Hải quan là gì, và vì sao quan trọng</h3>
<ul>
<li><strong>Thu ngân sách</strong> — thuế xuất nhập khẩu vẫn là nguồn thu đáng kể của nhà nước.</li>
<li><strong>Tạo thuận lợi thương mại</strong> — thông quan nhanh, có thể dự đoán giúp chuỗi cung ứng vận hành trơn tru.</li>
<li><strong>Kiểm soát</strong> — thực thi lệnh cấm/hạn chế (vũ khí, ma tuý, hàng giả, động vật quý hiếm) và các quy định kỹ thuật/kiểm dịch.</li>
<li><strong>Thống kê &amp; chính sách</strong> — dữ liệu thương mại phục vụ hoạch định kinh tế và đàm phán thương mại.</li>
</ul>
<h3>Từ giấy sang điện tử</h3>
<p>Hải quan truyền thống dùng tờ khai giấy, xếp hàng trực tiếp và kiểm tra thủ công — chậm và dễ thiếu nhất quán. <strong>Hải quan điện tử</strong> (VNACCS/VCIS từ 2014) đưa khai báo, phân luồng rủi ro và phần lớn việc soát hồ sơ lên mạng, rút ngắn thời gian thông quan từ vài ngày xuống vài giờ với đa số lô hàng.</p>
<h3>Lộ trình</h3>
<p>Khung pháp lý (Luật Hải quan 2014 &amp; WCO) → khai báo VNACCS/VCIS → phân loại mã HS → trị giá hải quan &amp; thuế → thông quan &amp; kiểm tra sau thông quan → quy tắc xuất xứ &amp; ưu đãi FTA → quản lý rủi ro, AEO &amp; Cơ chế một cửa quốc gia. Song ngữ, có ví dụ và quiz.</p>`,
  ]]);

const c1 = doc('glc301-1-1-role-of-customs', '1.1 — Customs overview & role in trade|||1.1 — Tổng quan hải quan & vai trò trong thương mại',
  'Chức năng hải quan (thu thuế, tạo thuận lợi, kiểm soát, thống kê); các bên liên quan; luồng thông quan cơ bản; vì sao chuyển sang hải quan điện tử.',
  [[
    `<span class="eyebrow">GLC301 · Chapter 1 · Lesson 1.1</span>
<h2>Customs overview &amp; role in international trade</h2>
<h3>Four functions of customs</h3>
<ul>
<li><strong>Revenue</strong> — collect import/export duties, VAT, special consumption tax on cross-border goods.</li>
<li><strong>Trade facilitation</strong> — clear compliant shipments quickly so trade flows efficiently.</li>
<li><strong>Control &amp; protection</strong> — enforce bans/restrictions, intellectual property, technical/sanitary/phytosanitary standards.</li>
<li><strong>Statistics</strong> — compile trade data used by government and businesses.</li>
</ul>
<h3>Who is involved</h3>
<ul>
<li><strong>Customs authority</strong> — Tổng cục Hải quan (General Department of Vietnam Customs) and its provincial/border-gate units.</li>
<li><strong>Declarant</strong> — the importer/exporter itself, or a licensed <strong>customs broker (đại lý hải quan)</strong> acting on its behalf.</li>
<li><strong>Carrier &amp; warehouse</strong> — shipping lines/airlines and bonded warehouses that move and store goods under customs supervision.</li>
</ul>
<h3>The basic flow</h3>
<pre><code>Prepare documents (invoice, packing list, contract, B/L)
        -> Electronic declaration (VNACCS)
        -> System risk classification (green / yellow / red channel)
        -> Document and/or physical inspection (if yellow/red)
        -> Pay duties &amp; taxes
        -> Customs clearance -> goods released</code></pre>
<h3>Why go electronic</h3>
<p>Manual, paper-based customs was slow, inconsistent between officers, and harder to audit. <strong>E-customs</strong> standardizes the declaration format, applies risk criteria automatically, and creates a traceable digital record — faster clearance, lower cost, and less room for arbitrary decisions.</p>
<div class="callout"><span class="badge">Key idea</span> Customs balances two goals that pull in opposite directions: <strong>facilitate</strong> legitimate trade fast, while <strong>controlling</strong> what must not cross the border. Risk-based, electronic processing is how modern customs does both at once.</div>`,
    `<span class="eyebrow">GLC301 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan hải quan &amp; vai trò trong thương mại quốc tế</h2>
<h3>Bốn chức năng của hải quan</h3>
<ul>
<li><strong>Thu ngân sách</strong> — thu thuế xuất nhập khẩu, thuế GTGT, thuế tiêu thụ đặc biệt trên hàng qua biên giới.</li>
<li><strong>Tạo thuận lợi thương mại</strong> — thông quan nhanh cho lô hàng tuân thủ để thương mại vận hành hiệu quả.</li>
<li><strong>Kiểm soát &amp; bảo vệ</strong> — thực thi lệnh cấm/hạn chế, sở hữu trí tuệ, tiêu chuẩn kỹ thuật/kiểm dịch.</li>
<li><strong>Thống kê</strong> — tổng hợp số liệu thương mại phục vụ nhà nước và doanh nghiệp.</li>
</ul>
<h3>Các bên liên quan</h3>
<ul>
<li><strong>Cơ quan hải quan</strong> — Tổng cục Hải quan và các cục/chi cục cửa khẩu địa phương.</li>
<li><strong>Người khai hải quan</strong> — chính doanh nghiệp xuất nhập khẩu, hoặc <strong>đại lý hải quan</strong> được cấp phép khai thay.</li>
<li><strong>Hãng vận tải &amp; kho bãi</strong> — hãng tàu/hàng không và kho ngoại quan vận chuyển, lưu giữ hàng dưới sự giám sát hải quan.</li>
</ul>
<h3>Luồng cơ bản</h3>
<pre><code>Chuẩn bị hồ sơ (invoice, packing list, hợp đồng, B/L)
        -> Khai báo điện tử (VNACCS)
        -> Hệ thống phân luồng rủi ro (xanh / vàng / đỏ)
        -> Kiểm tra hồ sơ và/hoặc thực tế hàng (nếu vàng/đỏ)
        -> Nộp thuế &amp; phí
        -> Thông quan -> giải phóng hàng</code></pre>
<h3>Vì sao chuyển sang điện tử</h3>
<p>Hải quan giấy thủ công vốn chậm, thiếu nhất quán giữa cán bộ, và khó kiểm tra lại. <strong>Hải quan điện tử</strong> chuẩn hoá mẫu khai báo, áp tiêu chí rủi ro tự động, và tạo hồ sơ số có thể truy vết — thông quan nhanh hơn, chi phí thấp hơn, ít chỗ cho quyết định tuỳ tiện.</p>
<div class="callout"><span class="badge">Ý chính</span> Hải quan cân bằng hai mục tiêu trái chiều: <strong>tạo thuận lợi</strong> cho thương mại hợp pháp thật nhanh, đồng thời <strong>kiểm soát</strong> những gì không được qua biên giới. Xử lý theo rủi ro, bằng điện tử, là cách hải quan hiện đại làm cả hai việc cùng lúc.</div>`,
  ]]);

const c1q = quiz('glc301-quiz-1', 'Quiz 1 — Role of customs|||Quiz 1 — Vai trò hải quan', [
  { id: 'q1', question: 'Chức năng nào KHÔNG thuộc bốn chức năng chính của hải quan?', options: ['Thu ngân sách', 'Tạo thuận lợi thương mại', 'Kiểm soát hàng cấm/hạn chế', 'Cấp visa xuất nhập cảnh'], correctIndex: 3, explanation: 'Bốn chức năng: thu ngân sách, tạo thuận lợi thương mại, kiểm soát, thống kê. Cấp visa thuộc cơ quan quản lý xuất nhập cảnh, không phải hải quan.' },
  { id: 'q2', question: 'Ai được phép khai hải quan thay cho doanh nghiệp xuất nhập khẩu?', options: ['Bất kỳ cá nhân nào', 'Đại lý hải quan được cấp phép', 'Chỉ hãng vận tải', 'Chỉ ngân hàng'], correctIndex: 1, explanation: 'Đại lý hải quan (customs broker) được cấp phép có thể khai thay doanh nghiệp.' },
  { id: 'q3', question: 'Lợi ích chính của hải quan điện tử so với hải quan giấy là?', options: ['Tăng số lượng hồ sơ giấy', 'Thông quan nhanh hơn, nhất quán và có thể truy vết', 'Loại bỏ hoàn toàn việc kiểm tra thực tế', 'Không cần nộp thuế nữa'], correctIndex: 1, explanation: 'Điện tử hoá chuẩn hoá mẫu khai, áp tiêu chí rủi ro tự động, tạo hồ sơ truy vết được — nhanh và nhất quán hơn.' },
]);

const c2 = doc('glc301-2-1-legal-framework', '2.1 — Vietnam customs legal framework & WCO|||2.1 — Khung pháp lý hải quan Việt Nam & WCO',
  'Luật Hải quan 2014 & hệ thống văn bản dưới luật; vai trò WCO; Công ước HS; Công ước Kyoto sửa đổi; Khung SAFE.',
  [[
    `<span class="eyebrow">GLC301 · Chapter 2 · Lesson 2.1</span>
<h2>Vietnam's customs legal framework &amp; the WCO</h2>
<h3>Vietnam's legal hierarchy</h3>
<pre><code>Luật Hải quan 2014 (Customs Law — passed by National Assembly)
    -> Nghị định (Government decrees, e.g. on customs procedures, penalties)
        -> Thông tư (Circulars from the Ministry of Finance / General Dept. of Customs)
            -> Official guidance documents (công văn hướng dẫn)</code></pre>
<p>The <strong>Customs Law 2014</strong> is the foundation: it defines customs procedures, the rights and obligations of declarants and customs officers, inspection and supervision, and post-clearance audit. Decrees and circulars fill in operational detail — e.g. HS classification rules, valuation methods, VNACCS technical procedures.</p>
<h3>The World Customs Organization (WCO)</h3>
<p>Vietnam is a WCO member, which shapes national rules through several conventions:</p>
<ul>
<li><strong>HS Convention</strong> — the Harmonized System, a standardized international product-coding nomenclature (used for tariffs and statistics worldwide).</li>
<li><strong>Revised Kyoto Convention (RKC)</strong> — a blueprint for simple, predictable, modern customs procedures (the model behind e-customs reforms).</li>
<li><strong>SAFE Framework of Standards</strong> — supply-chain security, customs-to-business partnership (the basis for the AEO program).</li>
</ul>
<div class="callout"><span class="badge">Why this matters</span> Almost every operational rule in later chapters — HS codes, valuation methods, AEO — traces back to a WCO convention that Vietnam implemented into domestic law. National rules are not invented locally; they localize an international standard.</div>`,
    `<span class="eyebrow">GLC301 · Chương 2 · Bài 2.1</span>
<h2>Khung pháp lý hải quan Việt Nam &amp; WCO</h2>
<h3>Hệ thống văn bản pháp lý Việt Nam</h3>
<pre><code>Luật Hải quan 2014 (Quốc hội thông qua)
    -> Nghị định (Chính phủ, vd về thủ tục hải quan, xử phạt)
        -> Thông tư (Bộ Tài chính / Tổng cục Hải quan)
            -> Công văn hướng dẫn</code></pre>
<p><strong>Luật Hải quan 2014</strong> là nền tảng: quy định thủ tục hải quan, quyền và nghĩa vụ của người khai hải quan và công chức hải quan, kiểm tra giám sát, và kiểm tra sau thông quan. Nghị định và thông tư bổ sung chi tiết vận hành — vd quy tắc phân loại mã HS, phương pháp trị giá, quy trình kỹ thuật VNACCS.</p>
<h3>Tổ chức Hải quan Thế giới (WCO)</h3>
<p>Việt Nam là thành viên WCO, và điều đó định hình quy định trong nước qua nhiều công ước:</p>
<ul>
<li><strong>Công ước HS</strong> — Hệ thống Hài hoà, danh mục mã hàng hoá quốc tế chuẩn hoá (dùng cho thuế quan và thống kê trên toàn cầu).</li>
<li><strong>Công ước Kyoto sửa đổi (RKC)</strong> — bản mẫu cho thủ tục hải quan đơn giản, dự đoán được, hiện đại (nền tảng cho cải cách hải quan điện tử).</li>
<li><strong>Khung tiêu chuẩn SAFE</strong> — an ninh chuỗi cung ứng, hợp tác hải quan-doanh nghiệp (nền tảng cho chương trình AEO).</li>
</ul>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Hầu hết quy định vận hành ở các chương sau — mã HS, phương pháp trị giá, AEO — đều bắt nguồn từ một công ước WCO mà Việt Nam nội luật hoá. Quy định trong nước không tự phát sinh riêng lẻ, mà nội địa hoá một chuẩn quốc tế.</div>`,
  ]]);

const c2q = quiz('glc301-quiz-2', 'Quiz 2 — Legal framework & WCO|||Quiz 2 — Khung pháp lý & WCO', [
  { id: 'q1', question: 'Văn bản pháp lý nền tảng nhất về hải quan tại Việt Nam là?', options: ['Thông tư của Bộ Tài chính', 'Công văn hướng dẫn', 'Luật Hải quan 2014', 'Quy chế nội bộ chi cục'], correctIndex: 2, explanation: 'Luật Hải quan 2014 do Quốc hội thông qua là nền tảng; nghị định và thông tư bổ sung chi tiết dưới luật này.' },
  { id: 'q2', question: 'Công ước WCO nào là nền tảng cho danh mục mã hàng hoá quốc tế dùng để tính thuế?', options: ['Công ước Kyoto sửa đổi', 'Công ước HS', 'Khung SAFE', 'Hiệp định ATIGA'], correctIndex: 1, explanation: 'Công ước HS (Harmonized System) là danh mục mã hàng hoá quốc tế chuẩn hoá.' },
  { id: 'q3', question: 'Khung tiêu chuẩn SAFE của WCO là nền tảng cho chương trình nào?', options: ['VNACCS', 'AEO (doanh nghiệp ưu tiên)', 'C/O mẫu D', 'Thuế GTGT'], correctIndex: 1, explanation: 'SAFE tập trung an ninh chuỗi cung ứng và hợp tác hải quan-doanh nghiệp — nền tảng của AEO.' },
]);

const c3 = doc('glc301-3-1-vnaccs-vcis', '3.1 — VNACCS/VCIS & electronic declaration|||3.1 — Hệ thống VNACCS/VCIS & khai báo điện tử',
  'VNACCS (thông quan tự động) & VCIS (thông tin hải quan); điều kiện khai báo (chữ ký số, tài khoản); quy trình khai; phân luồng xanh/vàng/đỏ.',
  [[
    `<span class="eyebrow">GLC301 · Chapter 3 · Lesson 3.1</span>
<h2>The VNACCS/VCIS system &amp; electronic declaration</h2>
<h3>Two linked systems</h3>
<ul>
<li><strong>VNACCS</strong> (Vietnam Automated Cargo Clearance System) — the core engine that receives declarations, applies risk classification, and issues clearance decisions. Built with Japanese (JICA) technical assistance, operating since April 2014.</li>
<li><strong>VCIS</strong> (Vietnam Customs Information System) — the supporting information system: tariff schedules, exchange rates, enterprise data, and reference information VNACCS relies on.</li>
</ul>
<h3>Before you can declare</h3>
<ul>
<li>Business registration &amp; tax code.</li>
<li>A <strong>digital signature (chữ ký số)</strong> registered with customs — declarations are legally signed electronically, no paper stamp.</li>
<li>Declaration software connected to VNACCS (customs-provided or commercial software).</li>
</ul>
<h3>Declaration workflow</h3>
<pre><code>1. Enter declaration data (IDA - import / EDA - export)
2. Submit -> VNACCS validates format &amp; computes duties
3. System risk classification:
     Green  -> no document or physical check, immediate clearance
     Yellow -> document check only
     Red    -> document check AND physical inspection of goods
4. Pay duties &amp; taxes (electronic payment)
5. Clearance decision -> goods released</code></pre>
<div class="callout"><span class="badge">Key point</span> The declarant does not choose the channel — VNACCS assigns it automatically from risk criteria (company compliance history, product type, origin, value). Most compliant, low-risk shipments land on <strong>green</strong>.</div>`,
    `<span class="eyebrow">GLC301 · Chương 3 · Bài 3.1</span>
<h2>Hệ thống VNACCS/VCIS &amp; khai báo điện tử</h2>
<h3>Hai hệ thống liên kết</h3>
<ul>
<li><strong>VNACCS</strong> (Hệ thống thông quan hàng hoá tự động) — bộ máy trung tâm nhận tờ khai, áp phân luồng rủi ro, và ra quyết định thông quan. Xây dựng với hỗ trợ kỹ thuật của Nhật (JICA), vận hành từ tháng 4/2014.</li>
<li><strong>VCIS</strong> (Hệ thống thông tin hải quan) — hệ thống thông tin hỗ trợ: biểu thuế, tỷ giá, dữ liệu doanh nghiệp, và thông tin tham chiếu mà VNACCS dựa vào.</li>
</ul>
<h3>Điều kiện trước khi khai báo</h3>
<ul>
<li>Đăng ký kinh doanh &amp; mã số thuế.</li>
<li><strong>Chữ ký số</strong> đăng ký với hải quan — tờ khai được ký điện tử hợp pháp, không cần dấu giấy.</li>
<li>Phần mềm khai báo kết nối VNACCS (phần mềm của hải quan hoặc phần mềm thương mại).</li>
</ul>
<h3>Quy trình khai báo</h3>
<pre><code>1. Nhập dữ liệu tờ khai (IDA - nhập khẩu / EDA - xuất khẩu)
2. Gửi -> VNACCS kiểm tra định dạng &amp; tính thuế
3. Hệ thống phân luồng rủi ro:
     Xanh -> miễn kiểm tra hồ sơ và thực tế, thông quan ngay
     Vàng -> chỉ kiểm tra hồ sơ
     Đỏ   -> kiểm tra hồ sơ VÀ kiểm tra thực tế hàng hoá
4. Nộp thuế &amp; phí (thanh toán điện tử)
5. Quyết định thông quan -> giải phóng hàng</code></pre>
<div class="callout"><span class="badge">Điểm mấu chốt</span> Người khai không chọn luồng — VNACCS tự gán luồng theo tiêu chí rủi ro (lịch sử tuân thủ của doanh nghiệp, loại hàng, xuất xứ, trị giá). Đa số lô hàng tuân thủ tốt, rủi ro thấp rơi vào luồng <strong>xanh</strong>.</div>`,
  ]]);

const c3q = quiz('glc301-quiz-3', 'Quiz 3 — VNACCS/VCIS|||Quiz 3 — VNACCS/VCIS', [
  { id: 'q1', question: 'VNACCS là gì?', options: ['Hệ thống thanh toán ngân hàng', 'Hệ thống thông quan hàng hoá tự động', 'Danh mục mã HS', 'Hiệp định thương mại tự do'], correctIndex: 1, explanation: 'VNACCS là hệ thống thông quan hàng hoá tự động, vận hành từ 2014 với hỗ trợ JICA (Nhật).' },
  { id: 'q2', question: 'Điều kiện nào BẮT BUỘC để khai báo qua VNACCS?', options: ['Chữ ký số đăng ký với hải quan', 'Có kho ngoại quan riêng', 'Là doanh nghiệp AEO', 'Có C/O mẫu D'], correctIndex: 0, explanation: 'Tờ khai phải được ký điện tử hợp pháp bằng chữ ký số đã đăng ký với hải quan.' },
  { id: 'q3', question: 'Lô hàng thuộc luồng "vàng" thì phải chịu bước nào?', options: ['Không kiểm tra gì, thông quan ngay', 'Chỉ kiểm tra hồ sơ', 'Kiểm tra hồ sơ và thực tế hàng hoá', 'Chỉ kiểm tra thực tế hàng hoá'], correctIndex: 1, explanation: 'Luồng vàng: kiểm tra hồ sơ; luồng đỏ mới kiểm tra cả thực tế hàng hoá.' },
]);

const c4 = doc('glc301-4-1-hs-classification', '4.1 — Goods classification & HS code|||4.1 — Phân loại hàng hoá & mã HS',
  'Cấu trúc mã HS (chương/nhóm/phân nhóm/mã quốc gia); 6 Quy tắc tổng quát (GRI); phân loại trước; vì sao mã HS quyết định thuế & quy định áp dụng.',
  [[
    `<span class="eyebrow">GLC301 · Chapter 4 · Lesson 4.1</span>
<h2>Goods classification &amp; the HS code</h2>
<h3>Structure of an HS code</h3>
<pre><code>HS code example: 8471.30.90
  84       -> Section/Chapter  (machinery)
  84.71    -> Heading   (4-digit, international)
  8471.30  -> Subheading (6-digit, international - shared worldwide)
  8471.30.90 -> National code (8-digit, AHTN - ASEAN Harmonized Tariff Nomenclature)</code></pre>
<p>The first 6 digits are identical worldwide (WCO's Harmonized System). Vietnam, like other ASEAN members, extends it to <strong>8 digits</strong> under the <strong>AHTN</strong> for finer national tariff distinctions.</p>
<h3>General Rules of Interpretation (GRI 1-6)</h3>
<p>Classification follows six rules <em>in order</em> — you only move to the next rule if the previous one doesn't resolve the case:</p>
<ul>
<li><strong>GRI 1</strong> — classify by the terms of the headings and chapter/section notes first.</li>
<li><strong>GRI 2-6</strong> — handle incomplete/unfinished goods, mixtures, sets, composite goods, packing, and how to pick the subheading/national code.</li>
</ul>
<h3>Why the HS code matters</h3>
<p>The HS code determines: the applicable <strong>tariff rate</strong>, which import licenses/technical standards apply, whether an <strong>FTA preference</strong> is even possible, and trade statistics. Misclassification is one of the most common causes of post-clearance audit findings and back-duties.</p>
<div class="callout"><span class="badge">Advance ruling</span> A business can request a binding <strong>advance classification ruling (thông báo kết quả phân loại trước)</strong> from customs before importing — it locks in the HS code and removes classification risk for that product.</div>`,
    `<span class="eyebrow">GLC301 · Chương 4 · Bài 4.1</span>
<h2>Phân loại hàng hoá &amp; mã HS</h2>
<h3>Cấu trúc một mã HS</h3>
<pre><code>Ví dụ mã HS: 8471.30.90
  84       -> Chương    (máy móc)
  84.71    -> Nhóm      (4 số, quốc tế)
  8471.30  -> Phân nhóm (6 số, quốc tế - dùng chung toàn cầu)
  8471.30.90 -> Mã quốc gia (8 số, AHTN - Danh mục thuế hài hoà ASEAN)</code></pre>
<p>6 số đầu giống nhau trên toàn thế giới (Hệ thống Hài hoà của WCO). Việt Nam, như các nước ASEAN khác, mở rộng thành <strong>8 số</strong> theo <strong>AHTN</strong> để phân biệt thuế quan chi tiết hơn ở cấp quốc gia.</p>
<h3>6 Quy tắc tổng quát phân loại (GRI 1-6)</h3>
<p>Phân loại tuân theo sáu quy tắc <em>theo thứ tự</em> — chỉ chuyển sang quy tắc sau khi quy tắc trước không giải quyết được:</p>
<ul>
<li><strong>GRI 1</strong> — phân loại theo nội dung nhóm và chú giải chương/phần trước tiên.</li>
<li><strong>GRI 2-6</strong> — xử lý hàng chưa hoàn chỉnh/chưa lắp ráp, hàng pha trộn, hàng bộ, hàng ghép, bao bì, và cách chọn phân nhóm/mã quốc gia.</li>
</ul>
<h3>Vì sao mã HS quan trọng</h3>
<p>Mã HS quyết định: <strong>mức thuế</strong> áp dụng, loại giấy phép nhập khẩu/tiêu chuẩn kỹ thuật cần tuân thủ, hàng có được hưởng <strong>ưu đãi FTA</strong> hay không, và số liệu thống kê thương mại. Phân loại sai là một trong những nguyên nhân phổ biến nhất bị phát hiện khi kiểm tra sau thông quan và bị truy thu thuế.</p>
<div class="callout"><span class="badge">Phân loại trước</span> Doanh nghiệp có thể xin <strong>thông báo kết quả phân loại trước</strong> từ hải quan trước khi nhập khẩu — chốt cứng mã HS và loại bỏ rủi ro phân loại cho mặt hàng đó.</div>`,
  ]]);

const c4q = quiz('glc301-quiz-4', 'Quiz 4 — HS classification|||Quiz 4 — Phân loại mã HS', [
  { id: 'q1', question: 'Bao nhiêu số đầu của mã HS giống nhau trên toàn thế giới?', options: ['4 số', '6 số', '8 số', '10 số'], correctIndex: 1, explanation: '6 số đầu (nhóm + phân nhóm) là chuẩn quốc tế theo Công ước HS; các số sau là mã quốc gia/khu vực.' },
  { id: 'q2', question: 'Việt Nam mở rộng mã HS thành bao nhiêu số theo AHTN?', options: ['6 số', '8 số', '10 số', '12 số'], correctIndex: 1, explanation: 'AHTN (Danh mục thuế hài hoà ASEAN) mở rộng mã HS quốc tế 6 số thành 8 số ở cấp quốc gia.' },
  { id: 'q3', question: 'Công cụ nào giúp doanh nghiệp chốt trước mã HS để giảm rủi ro phân loại?', options: ['C/O mẫu D', 'Thông báo kết quả phân loại trước', 'Tờ khai trị giá', 'Giấy phép AEO'], correctIndex: 1, explanation: 'Phân loại trước là quyết định ràng buộc của hải quan, chốt mã HS trước khi nhập khẩu thực tế.' },
]);

const c5 = doc('glc301-5-1-valuation-tax', '5.1 — Customs valuation & import/export tax|||5.1 — Trị giá hải quan & tính thuế xuất nhập khẩu',
  'Hiệp định trị giá WTO/GATT Điều VII; phương pháp trị giá giao dịch; CIF vs FOB; công thức tính thuế nhập khẩu, GTGT, tiêu thụ đặc biệt.',
  [[
    `<span class="eyebrow">GLC301 · Chapter 5 · Lesson 5.1</span>
<h2>Customs valuation &amp; import/export tax calculation</h2>
<h3>The WTO valuation framework</h3>
<p>Vietnam applies the <strong>WTO Customs Valuation Agreement (GATT Article VII)</strong>, which sets <strong>6 valuation methods</strong> in strict order, applied one after another only if the previous cannot be used. Method 1 — <strong>transaction value</strong> — is used for the vast majority of imports.</p>
<h3>Transaction value = price paid/payable + adjustments</h3>
<pre><code>Transaction value = Price actually paid or payable
                   + Freight to the Vietnam border
                   + Insurance
                   + (other qualifying costs: commissions, packing, etc.)</code></pre>
<p>This is why customs value is normally quoted <strong>CIF</strong> (Cost, Insurance, Freight) for imports — it already bundles the shipping and insurance cost up to the border, unlike <strong>FOB</strong> (Free On Board), which stops at the export port.</p>
<h3>Calculating the taxes</h3>
<pre><code>Import duty = Customs value (CIF) x Import duty rate (by HS code + origin)
VAT         = (Customs value + Import duty [+ SCT if any]) x VAT rate
SCT (if applicable, e.g. cars, alcohol, tobacco) applied before VAT

Example:  CIF value = 500,000,000 VND, import duty rate = 10%, VAT = 10%
          Import duty = 500,000,000 x 10% = 50,000,000
          VAT base    = 500,000,000 + 50,000,000 = 550,000,000
          VAT         = 550,000,000 x 10% = 55,000,000
          Total tax   = 50,000,000 + 55,000,000 = 105,000,000 VND</code></pre>
<div class="callout"><span class="badge">Watch the rate</span> The import duty rate itself depends on the <strong>HS code</strong> (Chapter 4) and the good's <strong>origin</strong> (Chapter 7) — an FTA preferential rate can be far lower than the standard MFN rate for the exact same product.</div>`,
    `<span class="eyebrow">GLC301 · Chương 5 · Bài 5.1</span>
<h2>Trị giá hải quan &amp; tính thuế xuất nhập khẩu</h2>
<h3>Khung trị giá theo WTO</h3>
<p>Việt Nam áp dụng <strong>Hiệp định Trị giá hải quan của WTO (GATT Điều VII)</strong>, quy định <strong>6 phương pháp trị giá</strong> theo thứ tự nghiêm ngặt, chỉ dùng phương pháp sau khi phương pháp trước không áp dụng được. Phương pháp 1 — <strong>trị giá giao dịch</strong> — dùng cho phần lớn hàng nhập khẩu.</p>
<h3>Trị giá giao dịch = giá đã/sẽ trả + các khoản điều chỉnh</h3>
<pre><code>Trị giá giao dịch = Giá thực tế đã trả hoặc sẽ phải trả
                   + Cước vận chuyển đến biên giới Việt Nam
                   + Phí bảo hiểm
                   + (các chi phí hợp lệ khác: hoa hồng, đóng gói...)</code></pre>
<p>Đó là lý do trị giá hải quan hàng nhập thường tính theo <strong>CIF</strong> (Cost, Insurance, Freight) — đã gộp cước vận chuyển và bảo hiểm tới biên giới, khác với <strong>FOB</strong> (Free On Board) chỉ tính tới cảng xuất khẩu.</p>
<h3>Tính thuế</h3>
<pre><code>Thuế nhập khẩu = Trị giá hải quan (CIF) x Thuế suất NK (theo mã HS + xuất xứ)
Thuế GTGT      = (Trị giá hải quan + Thuế NK [+ TTĐB nếu có]) x thuế suất GTGT
Thuế TTĐB (nếu có, vd ô tô, rượu, thuốc lá) tính trước thuế GTGT

Ví dụ:  Trị giá CIF = 500.000.000 VND, thuế NK = 10%, GTGT = 10%
        Thuế NK  = 500.000.000 x 10% = 50.000.000
        Cơ sở GTGT = 500.000.000 + 50.000.000 = 550.000.000
        Thuế GTGT  = 550.000.000 x 10% = 55.000.000
        Tổng thuế  = 50.000.000 + 55.000.000 = 105.000.000 VND</code></pre>
<div class="callout"><span class="badge">Chú ý thuế suất</span> Thuế suất nhập khẩu phụ thuộc vào <strong>mã HS</strong> (Chương 4) và <strong>xuất xứ</strong> hàng hoá (Chương 7) — thuế suất ưu đãi FTA có thể thấp hơn rất nhiều so với thuế suất MFN thông thường cho đúng cùng một mặt hàng.</div>`,
  ]]);

const c5q = quiz('glc301-quiz-5', 'Quiz 5 — Valuation & tax|||Quiz 5 — Trị giá & thuế', [
  { id: 'q1', question: 'Phương pháp trị giá hải quan được dùng nhiều nhất là?', options: ['Trị giá khấu trừ', 'Trị giá giao dịch', 'Trị giá tính toán', 'Trị giá dự phòng'], correctIndex: 1, explanation: 'Trị giá giao dịch (phương pháp 1) áp dụng cho phần lớn hàng nhập khẩu theo Hiệp định WTO.' },
  { id: 'q2', question: 'Vì sao trị giá hải quan hàng nhập thường tính theo CIF chứ không phải FOB?', options: ['CIF rẻ hơn FOB', 'CIF đã gộp cước vận chuyển & bảo hiểm tới biên giới', 'FOB không hợp pháp', 'CIF chỉ dùng cho hàng xuất khẩu'], correctIndex: 1, explanation: 'Trị giá giao dịch cộng thêm cước vận chuyển và bảo hiểm đến biên giới Việt Nam — nên tương đương giá CIF.' },
  { id: 'q3', question: 'Thuế GTGT hàng nhập khẩu được tính trên cơ sở nào?', options: ['Chỉ trị giá hải quan', 'Trị giá hải quan cộng thuế nhập khẩu (và TTĐB nếu có)', 'Chỉ thuế nhập khẩu', 'Giá bán lẻ trong nước'], correctIndex: 1, explanation: 'GTGT tính trên (trị giá hải quan + thuế nhập khẩu + thuế TTĐB nếu có), không phải trên giá bán lẻ.' },
]);

const c6 = doc('glc301-6-1-clearance-audit', '6.1 — Clearance process & post-clearance audit|||6.1 — Quy trình thông quan & kiểm tra sau thông quan',
  'Chi tiết luồng xanh/vàng/đỏ; điều kiện giải phóng hàng; kiểm tra sau thông quan (KTSTQ) trong 5 năm; hậu quả vi phạm.',
  [[
    `<span class="eyebrow">GLC301 · Chapter 6 · Lesson 6.1</span>
<h2>The clearance process &amp; post-clearance audit</h2>
<h3>The three channels, in detail</h3>
<pre><code>GREEN  -> System accepts the declaration as-is.
          No document check, no physical inspection. Cleared immediately
          once duties are paid.

YELLOW -> Customs officer reviews the electronic dossier
          (invoice, contract, licenses...) but does NOT open the goods.

RED    -> Document review AND physical inspection of the goods
          themselves (partial or full container check).</code></pre>
<p><strong>Release of goods (giải phóng hàng)</strong> can sometimes happen before duties are fully settled — under a bank guarantee or an approved payment deadline — but full <strong>clearance (thông quan)</strong> requires duties paid and any conditions cleared.</p>
<h3>Post-clearance audit (kiểm tra sau thông quan — KTSTQ)</h3>
<p>Even a green-channel shipment isn't permanently safe from scrutiny. Customs may audit a company's records — at the customs office or at the company's own premises — <strong>within 5 years</strong> of the declaration date, checking classification, valuation, origin claims and license compliance retroactively.</p>
<h3>Consequences of non-compliance</h3>
<ul>
<li><strong>Back-duties (truy thu thuế)</strong> — pay the shortfall plus late-payment interest.</li>
<li><strong>Administrative penalties</strong> — fines proportional to the violation.</li>
<li><strong>Criminal referral</strong> — for smuggling or large-scale fraud, the case can be referred to criminal investigation.</li>
</ul>
<div class="callout"><span class="badge">Practical takeaway</span> "Green channel" reduces friction at the border, not legal responsibility. Businesses must keep supporting documents for at least 5 years — that's exactly the audit window.</div>`,
    `<span class="eyebrow">GLC301 · Chương 6 · Bài 6.1</span>
<h2>Quy trình thông quan &amp; kiểm tra sau thông quan</h2>
<h3>Ba luồng, chi tiết</h3>
<pre><code>XANH -> Hệ thống chấp nhận tờ khai như đã khai.
        Không kiểm tra hồ sơ, không kiểm tra thực tế. Thông quan
        ngay sau khi nộp thuế.

VÀNG -> Công chức hải quan soát hồ sơ điện tử
        (invoice, hợp đồng, giấy phép...) nhưng KHÔNG mở kiểm hàng.

ĐỎ   -> Soát hồ sơ VÀ kiểm tra thực tế hàng hoá
        (kiểm một phần hoặc toàn bộ container).</code></pre>
<p><strong>Giải phóng hàng</strong> đôi khi có thể diễn ra trước khi hoàn tất nộp thuế — nhờ bảo lãnh ngân hàng hoặc hạn nộp được chấp thuận — nhưng <strong>thông quan</strong> đầy đủ đòi hỏi đã nộp thuế và hoàn tất mọi điều kiện.</p>
<h3>Kiểm tra sau thông quan (KTSTQ)</h3>
<p>Ngay cả lô hàng luồng xanh cũng không hoàn toàn tránh khỏi soát xét. Hải quan có thể kiểm tra hồ sơ doanh nghiệp — tại trụ sở hải quan hoặc tại doanh nghiệp — <strong>trong vòng 5 năm</strong> kể từ ngày đăng ký tờ khai, kiểm tra lại phân loại, trị giá, khai báo xuất xứ và tuân thủ giấy phép.</p>
<h3>Hậu quả khi không tuân thủ</h3>
<ul>
<li><strong>Truy thu thuế</strong> — nộp phần thuế thiếu cộng tiền chậm nộp.</li>
<li><strong>Xử phạt hành chính</strong> — phạt tiền theo mức độ vi phạm.</li>
<li><strong>Chuyển hồ sơ hình sự</strong> — với buôn lậu hoặc gian lận quy mô lớn, vụ việc có thể chuyển sang điều tra hình sự.</li>
</ul>
<div class="callout"><span class="badge">Điểm cần nhớ</span> "Luồng xanh" chỉ giảm ma sát tại biên giới, không giảm trách nhiệm pháp lý. Doanh nghiệp phải lưu hồ sơ chứng minh ít nhất 5 năm — đúng bằng cửa sổ kiểm tra sau thông quan.</div>`,
  ]]);

const c6q = quiz('glc301-quiz-6', 'Quiz 6 — Clearance & audit|||Quiz 6 — Thông quan & KTSTQ', [
  { id: 'q1', question: 'Lô hàng luồng "đỏ" phải trải qua bước nào?', options: ['Không kiểm tra gì', 'Chỉ kiểm tra hồ sơ', 'Kiểm tra hồ sơ và kiểm tra thực tế hàng hoá', 'Chỉ nộp thuế'], correctIndex: 2, explanation: 'Luồng đỏ là mức kiểm tra cao nhất: cả hồ sơ và thực tế hàng hoá.' },
  { id: 'q2', question: 'Kiểm tra sau thông quan (KTSTQ) có thể thực hiện trong vòng bao nhiêu năm kể từ ngày đăng ký tờ khai?', options: ['1 năm', '3 năm', '5 năm', '10 năm'], correctIndex: 2, explanation: 'Luật Hải quan cho phép kiểm tra sau thông quan trong vòng 5 năm.' },
  { id: 'q3', question: 'Việc thông quan luồng xanh có nghĩa là gì về trách nhiệm pháp lý của doanh nghiệp?', options: ['Doanh nghiệp hết mọi trách nhiệm ngay khi thông quan', 'Doanh nghiệp vẫn phải lưu hồ sơ và có thể bị kiểm tra sau này', 'Doanh nghiệp không cần nộp thuế', 'Doanh nghiệp tự động được cấp AEO'], correctIndex: 1, explanation: 'Luồng xanh chỉ giảm ma sát tại biên giới; doanh nghiệp vẫn chịu trách nhiệm và có thể bị KTSTQ.' },
]);

const c7 = doc('glc301-7-1-origin-fta', '7.1 — Rules of origin (C/O) & FTA preferences|||7.1 — Xuất xứ hàng hoá (C/O) & ưu đãi thuế quan (FTA)',
  'Xuất xứ thuần túy & chuyển đổi cơ bản (CTC, RVC); các mẫu C/O phổ biến (D, E, EAV, VJ); tự chứng nhận xuất xứ; lợi ích ưu đãi thuế FTA.',
  [[
    `<span class="eyebrow">GLC301 · Chapter 7 · Lesson 7.1</span>
<h2>Rules of origin &amp; FTA tariff preferences</h2>
<h3>How "origin" is determined</h3>
<ul>
<li><strong>Wholly obtained</strong> — goods entirely grown, mined or produced in one country (e.g. raw agricultural products).</li>
<li><strong>Substantial transformation</strong> — for goods made from imported inputs, origin is granted only if the processing is substantial enough, tested by:
  <ul>
  <li><strong>CTC</strong> (Change in Tariff Classification) — the HS chapter/heading changes between input and output.</li>
  <li><strong>RVC</strong> (Regional Value Content) — local/regional value added exceeds a set % threshold (e.g. 40%).</li>
  <li><strong>Specific process</strong> — a defined manufacturing step is required regardless of value.</li>
  </ul>
</li>
</ul>
<h3>Common C/O forms used by Vietnam</h3>
<pre><code>Form D   -> ATIGA (ASEAN Trade in Goods Agreement)
Form E   -> ACFTA (ASEAN - China)
Form AK  -> AKFTA (ASEAN - Korea)
Form EAV -> EVFTA (EU - Vietnam)
Form VJ  -> VJEPA (Vietnam - Japan)</code></pre>
<h3>Preferential vs. self-certified origin</h3>
<p>Older FTAs use a <strong>C/O issued by an authorized body</strong> (e.g. VCCI, Ministry of Industry and Trade). Newer FTAs (CPTPP, EVFTA) increasingly allow <strong>self-certification of origin</strong> by the exporter itself, cutting paperwork but shifting the compliance burden onto the company.</p>
<div class="callout"><span class="badge">The payoff</span> A valid C/O under the right FTA can drop an import duty from a double-digit MFN rate to near <strong>0%</strong> — origin proof is often worth more to the bottom line than any other single customs document.</div>`,
    `<span class="eyebrow">GLC301 · Chương 7 · Bài 7.1</span>
<h2>Xuất xứ hàng hoá (C/O) &amp; ưu đãi thuế quan (FTA)</h2>
<h3>Xuất xứ được xác định thế nào</h3>
<ul>
<li><strong>Xuất xứ thuần túy</strong> — hàng hoá hoàn toàn được trồng, khai thác hoặc sản xuất tại một nước (vd nông sản thô).</li>
<li><strong>Chuyển đổi cơ bản</strong> — với hàng làm từ nguyên liệu nhập khẩu, chỉ được công nhận xuất xứ nếu quá trình gia công đủ "cơ bản", kiểm bằng:
  <ul>
  <li><strong>CTC</strong> (chuyển đổi mã số hàng hoá) — chương/nhóm HS thay đổi giữa đầu vào và sản phẩm.</li>
  <li><strong>RVC</strong> (hàm lượng giá trị khu vực) — giá trị gia tăng nội địa/khu vực vượt ngưỡng % quy định (vd 40%).</li>
  <li><strong>Công đoạn cụ thể</strong> — yêu cầu một bước sản xuất xác định, bất kể giá trị.</li>
  </ul>
</li>
</ul>
<h3>Các mẫu C/O phổ biến Việt Nam dùng</h3>
<pre><code>Mẫu D   -> ATIGA (Thương mại Hàng hoá ASEAN)
Mẫu E   -> ACFTA (ASEAN - Trung Quốc)
Mẫu AK  -> AKFTA (ASEAN - Hàn Quốc)
Mẫu EAV -> EVFTA (EU - Việt Nam)
Mẫu VJ  -> VJEPA (Việt Nam - Nhật Bản)</code></pre>
<h3>Xuất xứ do tổ chức cấp vs. tự chứng nhận</h3>
<p>Các FTA cũ dùng <strong>C/O do tổ chức được ủy quyền cấp</strong> (vd VCCI, Bộ Công Thương). Các FTA mới (CPTPP, EVFTA) ngày càng cho phép <strong>tự chứng nhận xuất xứ</strong> bởi chính nhà xuất khẩu, giảm thủ tục giấy tờ nhưng chuyển gánh trách nhiệm tuân thủ sang doanh nghiệp.</p>
<div class="callout"><span class="badge">Giá trị thực tế</span> Một C/O hợp lệ theo đúng FTA có thể đưa thuế nhập khẩu từ mức MFN hai chữ số xuống gần <strong>0%</strong> — chứng minh xuất xứ thường đáng giá hơn bất kỳ chứng từ hải quan đơn lẻ nào khác.</div>`,
  ]]);

const c7q = quiz('glc301-quiz-7', 'Quiz 7 — Origin & FTA|||Quiz 7 — Xuất xứ & FTA', [
  { id: 'q1', question: 'Tiêu chí RVC trong xác định xuất xứ dùng để đo gì?', options: ['Trọng lượng hàng hoá', 'Hàm lượng giá trị khu vực trong sản phẩm', 'Số lượng chứng từ', 'Thời gian vận chuyển'], correctIndex: 1, explanation: 'RVC (Regional Value Content) đo % giá trị gia tăng nội địa/khu vực trong sản phẩm.' },
  { id: 'q2', question: 'C/O mẫu D được dùng cho hiệp định nào?', options: ['EVFTA', 'ATIGA (ASEAN)', 'VJEPA', 'ACFTA'], correctIndex: 1, explanation: 'Mẫu D là mẫu C/O của ATIGA — Hiệp định Thương mại Hàng hoá ASEAN.' },
  { id: 'q3', question: 'Xu hướng trong các FTA mới như EVFTA/CPTPP về cấp C/O là?', options: ['Bắt buộc C/O giấy do hải quan cấp', 'Cho phép tự chứng nhận xuất xứ bởi nhà xuất khẩu', 'Bỏ hoàn toàn yêu cầu về xuất xứ', 'Chỉ áp dụng cho hàng nông sản'], correctIndex: 1, explanation: 'FTA mới ngày càng cho phép doanh nghiệp tự chứng nhận xuất xứ, giảm thủ tục nhưng tăng trách nhiệm tuân thủ.' },
]);

const c8 = doc('glc301-8-1-risk-aeo-digital', '8.1 — Risk management, AEO & digital customs|||8.1 — Quản lý rủi ro, tuân thủ (AEO) & hải quan số/một cửa quốc gia',
  'Quản lý theo rủi ro (tiêu chí phân luồng); doanh nghiệp ưu tiên AEO & lợi ích; Cơ chế một cửa quốc gia (NSW) & ASEAN (ASW); xu hướng hải quan số.',
  [[
    `<span class="eyebrow">GLC301 · Chapter 8 · Lesson 8.1</span>
<h2>Risk management, AEO &amp; digital customs</h2>
<h3>Risk-based control</h3>
<p>Instead of inspecting every shipment equally, customs concentrates scrutiny where the risk of violation is highest. VNACCS assigns the green/yellow/red channel using criteria such as: company compliance history, product/commodity risk profile, trading partner and route, and declared value consistency.</p>
<h3>Authorized Economic Operator (AEO)</h3>
<p>AEO is a "trusted trader" status, granted to companies with a strong compliance record, financial solvency and internal control systems. Benefits include:</p>
<ul>
<li>Fewer document and physical inspections (mostly green channel).</li>
<li>Priority clearance and dedicated support.</li>
<li>Mutual recognition — some countries' customs authorities honor each other's AEO status, easing clearance abroad too.</li>
</ul>
<h3>National Single Window &amp; ASEAN Single Window</h3>
<pre><code>Without NSW: submit separately to Customs, Ministry of Industry &amp; Trade,
             Ministry of Health, Ministry of Agriculture... (many portals)

With NSW (Cơ chế một cửa quốc gia): ONE electronic portal routes the
             dossier to every relevant ministry/agency automatically.

ASW (ASEAN Single Window): connects national single windows across
             ASEAN member states, e.g. to exchange e-C/O form D data.</code></pre>
<h3>Where digital customs is heading</h3>
<p>Beyond VNACCS: AI-assisted risk profiling, blockchain-based document verification, and a push toward fully <strong>paperless</strong> customs — reducing both clearance time and opportunities for document fraud.</p>
<div class="callout"><span class="badge">Big picture</span> Chapters 1-7 build the rules; this chapter is how modern customs applies them efficiently — trusting compliant traders (AEO), targeting risk narrowly, and connecting government agencies digitally instead of making the trader run between counters.</div>`,
    `<span class="eyebrow">GLC301 · Chương 8 · Bài 8.1</span>
<h2>Quản lý rủi ro, AEO &amp; hải quan số</h2>
<h3>Kiểm soát theo rủi ro</h3>
<p>Thay vì kiểm tra mọi lô hàng như nhau, hải quan tập trung soát xét vào nơi rủi ro vi phạm cao nhất. VNACCS phân luồng xanh/vàng/đỏ dựa trên các tiêu chí như: lịch sử tuân thủ của doanh nghiệp, mức rủi ro của loại hàng, đối tác thương mại và tuyến vận chuyển, tính nhất quán của trị giá khai báo.</p>
<h3>Doanh nghiệp ưu tiên (AEO)</h3>
<p>AEO là quy chế "doanh nghiệp tin cậy", cấp cho doanh nghiệp có lịch sử tuân thủ tốt, năng lực tài chính và hệ thống kiểm soát nội bộ vững. Lợi ích gồm:</p>
<ul>
<li>Ít bị kiểm tra hồ sơ và thực tế hơn (chủ yếu luồng xanh).</li>
<li>Thông quan ưu tiên và hỗ trợ riêng.</li>
<li>Công nhận lẫn nhau — một số nước công nhận quy chế AEO của nhau, giúp thông quan thuận lợi cả ở nước ngoài.</li>
</ul>
<h3>Cơ chế một cửa quốc gia &amp; một cửa ASEAN</h3>
<pre><code>Không có NSW: nộp hồ sơ riêng cho Hải quan, Bộ Công Thương,
             Bộ Y tế, Bộ Nông nghiệp... (nhiều cổng khác nhau)

Có NSW (Cơ chế một cửa quốc gia): MỘT cổng điện tử tự động chuyển
             hồ sơ tới từng bộ/ngành liên quan.

ASW (Một cửa ASEAN): kết nối các cơ chế một cửa quốc gia giữa
             các nước ASEAN, vd để trao đổi dữ liệu e-C/O mẫu D.</code></pre>
<h3>Hải quan số đang đi về đâu</h3>
<p>Ngoài VNACCS: phân tích rủi ro có AI hỗ trợ, xác minh chứng từ bằng blockchain, và hướng tới hải quan <strong>phi giấy tờ</strong> hoàn toàn — giảm cả thời gian thông quan và cơ hội gian lận chứng từ.</p>
<div class="callout"><span class="badge">Tổng quan lớn</span> Chương 1-7 xây quy tắc; chương này là cách hải quan hiện đại áp dụng chúng hiệu quả — tin tưởng doanh nghiệp tuân thủ (AEO), nhắm rủi ro thật hẹp, và kết nối các cơ quan nhà nước bằng điện tử thay vì để doanh nghiệp chạy khắp các quầy.</div>`,
  ]]);

const c8q = quiz('glc301-quiz-8', 'Quiz 8 — Risk, AEO & digital|||Quiz 8 — Rủi ro, AEO & hải quan số', [
  { id: 'q1', question: 'Quản lý theo rủi ro trong hải quan nghĩa là gì?', options: ['Kiểm tra mọi lô hàng như nhau', 'Tập trung soát xét vào nơi rủi ro vi phạm cao nhất', 'Bỏ hết kiểm tra', 'Chỉ kiểm tra hàng giá trị thấp'], correctIndex: 1, explanation: 'Quản lý rủi ro dồn nguồn lực kiểm tra vào những lô hàng/doanh nghiệp có rủi ro cao, để lô rủi ro thấp thông quan nhanh.' },
  { id: 'q2', question: 'Lợi ích chính của quy chế AEO (doanh nghiệp ưu tiên) là?', options: ['Miễn hoàn toàn thuế nhập khẩu', 'Ít bị kiểm tra hơn và thông quan ưu tiên', 'Không cần khai báo hải quan', 'Tự động có C/O mẫu D'], correctIndex: 1, explanation: 'AEO giúp giảm tần suất kiểm tra và được ưu tiên thông quan nhờ lịch sử tuân thủ tốt, không miễn thuế.' },
  { id: 'q3', question: 'Cơ chế một cửa quốc gia (NSW) giải quyết vấn đề gì?', options: ['Thay thế hoàn toàn VNACCS', 'Gộp nhiều cổng nộp hồ sơ của các bộ/ngành thành một cổng duy nhất', 'Xoá bỏ thuế xuất nhập khẩu', 'Chỉ áp dụng cho hàng nông sản'], correctIndex: 1, explanation: 'NSW cho doanh nghiệp nộp một lần, hệ thống tự chuyển hồ sơ tới các bộ/ngành liên quan thay vì nộp riêng từng nơi.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'GLC301',
    slug: 'glc301-e-customs',
    title: 'E-Customs',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/GLC301.webp',
    shortDescription: 'How Vietnam e-customs works — Customs Law & WCO, VNACCS/VCIS declaration, HS classification, customs valuation & duties, clearance & post-clearance audit, C/O & FTA preferences, risk management & AEO. Bilingual, with quizzes.|||Hải quan điện tử Việt Nam hoạt động thế nào — Luật Hải quan & WCO, khai báo VNACCS/VCIS, phân loại mã HS, trị giá & tính thuế XNK, thông quan & kiểm tra sau thông quan, C/O & ưu đãi FTA, quản lý rủi ro & AEO. Song ngữ, có quiz.',
    description: 'Môn <strong>GLC301 — E-Customs</strong> (kỳ 5) giúp hiểu <strong>hải quan điện tử Việt Nam hoạt động thế nào</strong>. Từ <strong>khung pháp lý</strong> (Luật Hải quan 2014 &amp; WCO) → <strong>hệ thống VNACCS/VCIS</strong> (khai báo điện tử, phân luồng xanh/vàng/đỏ) → <strong>phân loại mã HS</strong> → <strong>trị giá hải quan &amp; tính thuế</strong> xuất nhập khẩu → <strong>thông quan &amp; kiểm tra sau thông quan</strong> → <strong>xuất xứ (C/O) &amp; ưu đãi FTA</strong> → <strong>quản lý rủi ro, AEO &amp; hải quan số</strong>/một cửa quốc gia. Bám giáo trình FLM, song ngữ, có ví dụ tính toán và quiz mỗi chương.',
    whatYouLearn: 'Vai trò & chức năng hải quan; Luật Hải quan 2014 & công ước WCO (HS, Kyoto sửa đổi, SAFE); hệ thống VNACCS/VCIS & khai báo điện tử; phân luồng xanh/vàng/đỏ; cấu trúc mã HS & 6 quy tắc GRI; trị giá hải quan (trị giá giao dịch, CIF/FOB) & tính thuế nhập khẩu/GTGT/TTĐB; quy trình thông quan & kiểm tra sau thông quan (5 năm); quy tắc xuất xứ (CTC/RVC) & các mẫu C/O (D, E, EAV, VJ); ưu đãi thuế FTA; quản lý rủi ro, AEO & Cơ chế một cửa quốc gia/ASEAN.',
    requirements: 'Không yêu cầu kiến thức chuyên ngành trước đó. Nên đã học qua các môn nền về logistics/xuất nhập khẩu (nếu có trong khung chương trình) để dễ liên hệ thực tế.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Luật Hải quan, VNACCS/VCIS, WCO, biểu thuế, tra cứu C/O & FTA, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Hải quan là gì, vai trò, từ giấy sang điện tử.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan hải quan|||Chapter 1 — Overview of customs', description: 'Chức năng, các bên liên quan, luồng thông quan cơ bản.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Khung pháp lý & WCO|||Chapter 2 — Legal framework & WCO', description: 'Luật Hải quan 2014, công ước WCO.', lessons: [c2, c2q] },
    { title: 'Chương 3 — VNACCS/VCIS|||Chapter 3 — VNACCS/VCIS', description: 'Hệ thống khai báo điện tử, phân luồng.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Phân loại mã HS|||Chapter 4 — HS classification', description: 'Cấu trúc mã HS, 6 quy tắc GRI, phân loại trước.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Trị giá hải quan & thuế|||Chapter 5 — Valuation & tax', description: 'Trị giá giao dịch, CIF/FOB, tính thuế XNK.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Thông quan & KTSTQ|||Chapter 6 — Clearance & post-audit', description: 'Luồng xanh/vàng/đỏ, kiểm tra sau thông quan.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Xuất xứ & FTA|||Chapter 7 — Origin & FTA', description: 'CTC/RVC, mẫu C/O, ưu đãi thuế quan.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Rủi ro, AEO & hải quan số|||Chapter 8 — Risk, AEO & digital customs', description: 'Quản lý rủi ro, AEO, một cửa quốc gia.', lessons: [c8, c8q] },
  ],
};
