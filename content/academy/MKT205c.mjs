/**
 * MKT205c — International Marketing (Marketing quốc tế). Khối Quản trị Kinh
 * doanh (BBA), FPTU, Kỳ 5. Giáo trình tham khảo (trích dẫn, KHÔNG upload PDF):
 * Keegan "Global Marketing Management"; Cateora "International Marketing";
 * Kotler. 8 chương: tổng quan & toàn cầu hoá; môi trường quốc tế (kinh tế,
 * văn hoá, chính trị-pháp lý); nghiên cứu & lựa chọn thị trường; phương thức
 * thâm nhập; sản phẩm & thương hiệu toàn cầu; định giá & phân phối quốc tế;
 * truyền thông & quảng cáo xuyên văn hoá; marketing số toàn cầu & DN Việt ra
 * thế giới. Song ngữ + ví dụ + quiz. Giữ NGUYÊN slug/semester/thumb.
 * ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('mkt205c-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình (Keegan, Cateora, Kotler), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">MKT205c · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn International Marketing — globalization, entry modes, global product/pricing/promotion strategy, and digital go-global — in one place. The full official slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources plus the reference textbooks this course draws on.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for MKT205c are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><em>Global Marketing Management</em> — Warren J. Keegan &amp; Mark C. Green</li>
<li><em>International Marketing</em> — Philip R. Cateora, Mary C. Gilly &amp; John L. Graham</li>
<li><em>Principles of Marketing</em> (global edition) — Philip Kotler &amp; Gary Armstrong</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.wto.org/" target="_blank" rel="noopener">WTO — trade rules, tariffs, dispute data</a></li>
<li><a href="https://www.trade.gov/" target="_blank" rel="noopener">Trade.gov — country commercial guides, market intel</a></li>
<li><a href="https://www.export.gov/" target="_blank" rel="noopener" data-note="redirects to trade.gov">export.gov market research library</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/results?search_query=global+marketing+management+keegan" target="_blank" rel="noopener">Global Marketing Management lecture playlists</a> — search "Global Marketing Management Keegan"</li>
<li><a href="https://www.youtube.com/@MarketingWithMustafa" target="_blank" rel="noopener">Marketing with Mustafa</a> — global branding &amp; strategy explainers</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.hofstede-insights.com/country-comparison-tool" target="_blank" rel="noopener">Hofstede Country Comparison Tool</a> — compare cultural dimensions between markets</li>
<li><a href="https://tradingeconomics.com/" target="_blank" rel="noopener">Trading Economics</a> — macro indicators for market screening</li>
<li><a href="https://www.internationalseo.com/" target="_blank" rel="noopener" data-note="general reference">International SEO checklists for global digital go-to-market</a></li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — globalization drivers, EPRG framework, the three environment pillars (economic/cultural/political-legal).</li>
<li><strong>Practice</strong> — run a country-screening exercise; map entry-mode trade-offs (risk vs control) for a real product.</li>
<li><strong>Go deeper</strong> — global product/brand strategy (standardization vs adaptation), pricing traps (dumping, gray market), cross-cultural campaigns.</li>
<li><strong>Job-ready</strong> — build a one-page go-to-market plan for a Vietnamese brand entering one ASEAN market, digital-first.</li>
</ol></div>`,
    `<span class="eyebrow">MKT205c · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Marketing quốc tế — toàn cầu hoá, phương thức thâm nhập, chiến lược sản phẩm/giá/truyền thông toàn cầu, và ra thế giới bằng digital — gom về một chỗ. Slide &amp; đề cương chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp cùng các sách giáo trình môn này dựa vào.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của MKT205c có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><em>Global Marketing Management</em> — Warren J. Keegan &amp; Mark C. Green</li>
<li><em>International Marketing</em> — Philip R. Cateora, Mary C. Gilly &amp; John L. Graham</li>
<li><em>Principles of Marketing</em> (bản toàn cầu) — Philip Kotler &amp; Gary Armstrong</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.wto.org/" target="_blank" rel="noopener">WTO — quy tắc thương mại, thuế quan, số liệu tranh chấp</a></li>
<li><a href="https://www.trade.gov/" target="_blank" rel="noopener">Trade.gov — hồ sơ thương mại từng quốc gia, thông tin thị trường</a></li>
<li><a href="https://www.export.gov/" target="_blank" rel="noopener" data-note="chuyển hướng về trade.gov">Thư viện nghiên cứu thị trường export.gov</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/results?search_query=global+marketing+management+keegan" target="_blank" rel="noopener">Playlist bài giảng Global Marketing Management</a> — tìm "Global Marketing Management Keegan"</li>
<li><a href="https://www.youtube.com/@MarketingWithMustafa" target="_blank" rel="noopener">Marketing with Mustafa</a> — giải thích thương hiệu &amp; chiến lược toàn cầu</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.hofstede-insights.com/country-comparison-tool" target="_blank" rel="noopener">Hofstede Country Comparison Tool</a> — so sánh chiều văn hoá giữa các thị trường</li>
<li><a href="https://tradingeconomics.com/" target="_blank" rel="noopener">Trading Economics</a> — chỉ số vĩ mô để sàng lọc thị trường</li>
<li><a href="https://www.internationalseo.com/" target="_blank" rel="noopener" data-note="tham khảo chung">Checklist SEO quốc tế cho go-to-market số toàn cầu</a></li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — động lực toàn cầu hoá, khung EPRG, ba trụ môi trường (kinh tế/văn hoá/chính trị-pháp lý).</li>
<li><strong>Luyện tập</strong> — làm bài tập sàng lọc quốc gia; vẽ đánh đổi rủi ro-kiểm soát cho từng phương thức thâm nhập với một sản phẩm thật.</li>
<li><strong>Đào sâu</strong> — chiến lược sản phẩm/thương hiệu toàn cầu (chuẩn hoá vs thích nghi), bẫy định giá (bán phá giá, chợ xám), chiến dịch xuyên văn hoá.</li>
<li><strong>Sẵn sàng đi làm</strong> — dựng kế hoạch go-to-market một trang cho một thương hiệu Việt vào một thị trường ASEAN, ưu tiên digital.</li>
</ol></div>`,
  ]]);

const intro = doc('mkt205c-0-1-overview', 'Course overview: International Marketing|||Tổng quan: Marketing quốc tế',
  'Marketing quốc tế là gì; vì sao doanh nghiệp vượt biên giới; lộ trình 8 chương từ toàn cầu hoá đến marketing số & DN Việt ra thế giới.',
  [[
    `<span class="eyebrow">MKT205c · Lesson 0.1 · Overview</span>
<h2>International Marketing</h2>
<p class="lead">This course teaches you how marketing decisions change once a firm crosses national borders — the same 4Ps (Product, Price, Place, Promotion), but now filtered through <strong>different economies, cultures, laws, and competitive structures</strong> at the same time.</p>
<h3>What is international marketing?</h3>
<p><strong>International marketing</strong> is the performance of business activities that direct the flow of a company's goods and services to consumers in more than one nation, for a profit. It differs from domestic marketing because the <strong>uncontrollable environment</strong> — economic, cultural, political-legal, competitive — multiplies: what works in Vietnam may fail, offend, or even be illegal elsewhere.</p>
<h3>Why firms go international</h3>
<ul>
<li><strong>Pull factors</strong> — attractive foreign demand, saturated home market, favorable trade agreements.</li>
<li><strong>Push factors</strong> — small or declining home market, excess capacity, need for economies of scale.</li>
</ul>
<h3>Roadmap</h3>
<p>Globalization &amp; the EPRG mindset → economic/cultural/political-legal environment → market research &amp; selection → entry modes → global product &amp; brand strategy → international pricing &amp; distribution → cross-cultural communication → digital marketing &amp; Vietnamese firms going global.</p>`,
    `<span class="eyebrow">MKT205c · Bài 0.1 · Tổng quan</span>
<h2>Marketing quốc tế</h2>
<p class="lead">Môn này dạy cách các quyết định marketing thay đổi khi doanh nghiệp vượt qua biên giới quốc gia — vẫn là 4P (Sản phẩm, Giá, Phân phối, Truyền thông), nhưng giờ phải lọc qua <strong>nhiều nền kinh tế, văn hoá, luật pháp và cấu trúc cạnh tranh khác nhau cùng lúc</strong>.</p>
<h3>Marketing quốc tế là gì?</h3>
<p><strong>Marketing quốc tế</strong> là việc thực hiện các hoạt động kinh doanh nhằm đưa dòng hàng hoá &amp; dịch vụ của doanh nghiệp tới người tiêu dùng ở nhiều hơn một quốc gia, để tạo lợi nhuận. Nó khác marketing nội địa vì <strong>môi trường không kiểm soát được</strong> — kinh tế, văn hoá, chính trị-pháp lý, cạnh tranh — nhân lên nhiều lần: điều hiệu quả ở Việt Nam có thể thất bại, xúc phạm, hoặc thậm chí bất hợp pháp ở nơi khác.</p>
<h3>Vì sao doanh nghiệp ra nước ngoài</h3>
<ul>
<li><strong>Yếu tố kéo (pull)</strong> — nhu cầu nước ngoài hấp dẫn, thị trường nội địa bão hoà, hiệp định thương mại thuận lợi.</li>
<li><strong>Yếu tố đẩy (push)</strong> — thị trường nội địa nhỏ hoặc suy giảm, dư công suất, cần lợi thế quy mô.</li>
</ul>
<h3>Lộ trình</h3>
<p>Toàn cầu hoá &amp; tư duy EPRG → môi trường kinh tế/văn hoá/chính trị-pháp lý → nghiên cứu &amp; lựa chọn thị trường → phương thức thâm nhập → chiến lược sản phẩm &amp; thương hiệu toàn cầu → định giá &amp; phân phối quốc tế → truyền thông xuyên văn hoá → marketing số &amp; doanh nghiệp Việt ra thế giới.</p>`,
  ]]);

const c1 = doc('mkt205c-1-1-globalization', '1.1 — International marketing & globalization|||1.1 — Marketing quốc tế & toàn cầu hoá',
  'Định nghĩa marketing quốc tế; động lực toàn cầu hoá (thương mại, công nghệ, vận tải); các nấc phát triển; khung EPRG.',
  [[
    `<span class="eyebrow">MKT205c · Chapter 1 · Lesson 1.1</span>
<h2>International marketing &amp; globalization</h2>
<h3>Drivers of globalization</h3>
<ul>
<li><strong>Trade liberalization</strong> — WTO rules, free trade agreements (ASEAN, CPTPP, EVFTA) lower tariffs.</li>
<li><strong>Technology</strong> — internet &amp; digital platforms let even small firms reach global customers.</li>
<li><strong>Transportation &amp; logistics</strong> — containerization, air freight cut cost and time to market.</li>
<li><strong>Capital flows</strong> — foreign direct investment (FDI) and global supply chains link economies.</li>
</ul>
<h3>Stages of international involvement</h3>
<pre><code>Domestic marketing -> Export marketing -> International marketing
 -> Multinational marketing -> Global marketing
</code></pre>
<p>Firms typically move from serving only the home market, to exporting opportunistically, to committing resources abroad, to finally coordinating strategy across markets as one integrated system.</p>
<h3>The EPRG framework</h3>
<p>Management orientation shapes strategy:</p>
<ul>
<li><strong>Ethnocentric</strong> — home country is superior; foreign markets are an extension of domestic.</li>
<li><strong>Polycentric</strong> — each country is unique; subsidiaries operate independently.</li>
<li><strong>Regiocentric</strong> — the world is divided into regions, strategy is coordinated per region.</li>
<li><strong>Geocentric</strong> — the world is one market; strategy blends global efficiency with local relevance.</li>
</ul>
<div class="callout"><span class="badge">Global vs multidomestic</span> A <strong>global strategy</strong> treats the world as one market and standardizes for efficiency; a <strong>multidomestic strategy</strong> adapts fully to each country. Most real firms sit somewhere in between — "glocal".</div>`,
    `<span class="eyebrow">MKT205c · Chương 1 · Bài 1.1</span>
<h2>Marketing quốc tế &amp; toàn cầu hoá</h2>
<h3>Động lực toàn cầu hoá</h3>
<ul>
<li><strong>Tự do hoá thương mại</strong> — quy tắc WTO, các hiệp định tự do (ASEAN, CPTPP, EVFTA) hạ thuế quan.</li>
<li><strong>Công nghệ</strong> — internet &amp; nền tảng số giúp cả doanh nghiệp nhỏ tiếp cận khách hàng toàn cầu.</li>
<li><strong>Vận tải &amp; logistics</strong> — container hoá, vận chuyển hàng không giảm chi phí và thời gian ra thị trường.</li>
<li><strong>Dòng vốn</strong> — đầu tư trực tiếp nước ngoài (FDI) và chuỗi cung ứng toàn cầu kết nối các nền kinh tế.</li>
</ul>
<h3>Các nấc tham gia quốc tế</h3>
<pre><code>Marketing nội địa -> Marketing xuất khẩu -> Marketing quốc tế
 -> Marketing đa quốc gia -> Marketing toàn cầu
</code></pre>
<p>Doanh nghiệp thường đi từ chỉ phục vụ thị trường nội địa, đến xuất khẩu tùy cơ hội, đến đầu tư nguồn lực ra nước ngoài, và cuối cùng điều phối chiến lược xuyên các thị trường như một hệ thống thống nhất.</p>
<h3>Khung EPRG</h3>
<p>Định hướng quản trị định hình chiến lược:</p>
<ul>
<li><strong>Ethnocentric (vị chủng)</strong> — nước nhà là chuẩn; thị trường nước ngoài chỉ là phần mở rộng của nội địa.</li>
<li><strong>Polycentric (đa tâm)</strong> — mỗi quốc gia là duy nhất; các chi nhánh hoạt động độc lập.</li>
<li><strong>Regiocentric (vùng tâm)</strong> — thế giới chia theo vùng, chiến lược điều phối theo vùng.</li>
<li><strong>Geocentric (địa tâm)</strong> — thế giới là một thị trường; chiến lược hoà trộn hiệu quả toàn cầu với phù hợp địa phương.</li>
</ul>
<div class="callout"><span class="badge">Toàn cầu vs đa nội địa</span> <strong>Chiến lược toàn cầu</strong> coi thế giới là một thị trường và chuẩn hoá để hiệu quả; <strong>chiến lược đa nội địa</strong> thích nghi hoàn toàn theo từng nước. Đa số doanh nghiệp thật nằm ở giữa — "glocal".</div>`,
  ]]);

const c1q = quiz('mkt205c-quiz-1', 'Quiz 1 — Globalization & EPRG|||Quiz 1 — Toàn cầu hoá & EPRG', [
  { id: 'q1', question: 'Định hướng quản trị coi thế giới là MỘT thị trường, hoà trộn hiệu quả toàn cầu và phù hợp địa phương, gọi là gì?', options: ['Ethnocentric', 'Polycentric', 'Regiocentric', 'Geocentric'], correctIndex: 3, explanation: 'Geocentric: xem thế giới như một thị trường thống nhất, cân bằng hiệu quả và thích nghi.' },
  { id: 'q2', question: 'Thứ tự đúng của các nấc tham gia quốc tế là?', options: ['Toàn cầu → xuất khẩu → nội địa', 'Nội địa → xuất khẩu → quốc tế → đa quốc gia → toàn cầu', 'Đa quốc gia → nội địa → toàn cầu', 'Xuất khẩu → toàn cầu → nội địa'], correctIndex: 1, explanation: 'Doanh nghiệp thường đi từ nội địa đến xuất khẩu, quốc tế, đa quốc gia, rồi toàn cầu.' },
  { id: 'q3', question: 'Yếu tố nào sau đây KHÔNG phải động lực chính của toàn cầu hoá?', options: ['Tự do hoá thương mại (WTO, FTA)', 'Công nghệ & internet', 'Vận tải/logistics rẻ hơn', 'Mỗi quốc gia đóng cửa biên giới hoàn toàn'], correctIndex: 3, explanation: 'Đóng cửa biên giới đi ngược lại toàn cầu hoá; ba yếu tố kia đều thúc đẩy nó.' },
]);

const c2 = doc('mkt205c-2-1-environment', '2.1 — International marketing environment|||2.1 — Môi trường marketing quốc tế',
  'Môi trường kinh tế (mức phát triển, hội nhập kinh tế), văn hoá (Hofstede, self-reference criterion), chính trị-pháp lý (rủi ro chính trị, rào cản thương mại).',
  [[
    `<span class="eyebrow">MKT205c · Chapter 2 · Lesson 2.1</span>
<h2>The international marketing environment</h2>
<h3>Economic environment</h3>
<p>Countries differ in income level, infrastructure, and market structure. Key concepts:</p>
<ul>
<li><strong>Stages of economic development</strong> — from least-developed to developing to industrialized, affecting purchasing power and product needs.</li>
<li><strong>Economic integration</strong> — free trade areas, customs unions, common markets (e.g. ASEAN, EU) reduce barriers between member countries but can raise them against outsiders.</li>
</ul>
<h3>Cultural environment</h3>
<p>Culture shapes what people buy, how they decide, and how they respond to marketing. <strong>Hofstede's cultural dimensions</strong> — individualism vs collectivism, power distance, uncertainty avoidance, masculinity vs femininity, long-term orientation — help compare markets systematically.</p>
<div class="callout"><span class="badge">Self-Reference Criterion (SRC)</span> The unconscious tendency to judge a foreign situation using your OWN culture's values. It is the single most common source of international marketing mistakes — always check a decision against the host country's own norms, not your own.</div>
<h3>Political-legal environment</h3>
<ul>
<li><strong>Political risk</strong> — instability, expropriation, sanctions, sudden regulatory change.</li>
<li><strong>Trade barriers</strong> — <strong>tariff</strong> (a tax on imports) vs <strong>non-tariff</strong> (quotas, licensing, technical standards, local-content rules).</li>
<li><strong>Legal issues</strong> — intellectual property protection varies sharply between countries; contracts and dispute resolution must be planned for.</li>
</ul>`,
    `<span class="eyebrow">MKT205c · Chương 2 · Bài 2.1</span>
<h2>Môi trường marketing quốc tế</h2>
<h3>Môi trường kinh tế</h3>
<p>Các quốc gia khác nhau về mức thu nhập, hạ tầng, và cấu trúc thị trường. Khái niệm chính:</p>
<ul>
<li><strong>Các nấc phát triển kinh tế</strong> — từ kém phát triển đến đang phát triển đến công nghiệp hoá, ảnh hưởng sức mua và nhu cầu sản phẩm.</li>
<li><strong>Hội nhập kinh tế</strong> — khu vực mậu dịch tự do, liên minh thuế quan, thị trường chung (vd ASEAN, EU) giảm rào cản giữa nước thành viên nhưng có thể tăng rào cản với nước ngoài khối.</li>
</ul>
<h3>Môi trường văn hoá</h3>
<p>Văn hoá định hình cái người ta mua, cách họ quyết định, và cách họ phản ứng với marketing. <strong>Các chiều văn hoá của Hofstede</strong> — chủ nghĩa cá nhân vs tập thể, khoảng cách quyền lực, né tránh bất định, nam tính vs nữ tính, định hướng dài hạn — giúp so sánh thị trường một cách hệ thống.</p>
<div class="callout"><span class="badge">Self-Reference Criterion (SRC)</span> Xu hướng vô thức đánh giá tình huống nước ngoài bằng giá trị văn hoá CỦA CHÍNH MÌNH. Đây là nguồn sai lầm phổ biến nhất trong marketing quốc tế — luôn kiểm tra quyết định theo chuẩn của nước sở tại, không theo chuẩn của mình.</div>
<h3>Môi trường chính trị-pháp lý</h3>
<ul>
<li><strong>Rủi ro chính trị</strong> — bất ổn, quốc hữu hoá, cấm vận, thay đổi quy định đột ngột.</li>
<li><strong>Rào cản thương mại</strong> — <strong>thuế quan</strong> (thuế đánh vào hàng nhập) vs <strong>phi thuế quan</strong> (hạn ngạch, cấp phép, tiêu chuẩn kỹ thuật, quy định nội địa hoá).</li>
<li><strong>Vấn đề pháp lý</strong> — bảo hộ sở hữu trí tuệ khác nhau rõ rệt giữa các nước; hợp đồng và giải quyết tranh chấp phải được lên kế hoạch trước.</li>
</ul>`,
  ]]);

const c2q = quiz('mkt205c-quiz-2', 'Quiz 2 — Môi trường quốc tế|||Quiz 2 — International environment', [
  { id: 'q1', question: 'Self-Reference Criterion (SRC) là gì?', options: ['Một loại thuế nhập khẩu', 'Xu hướng đánh giá thị trường nước ngoài bằng chuẩn văn hoá của chính mình', 'Một chỉ số phát triển kinh tế', 'Một hiệp định thương mại tự do'], correctIndex: 1, explanation: 'SRC là thiên kiến vô thức dùng chuẩn văn hoá bản thân để đánh giá tình huống nước ngoài — nguồn sai lầm phổ biến nhất.' },
  { id: 'q2', question: 'Hạn ngạch nhập khẩu và yêu cầu nội địa hoá thuộc loại rào cản thương mại nào?', options: ['Thuế quan', 'Phi thuế quan', 'Hiệp định tự do', 'Chỉ số Hofstede'], correctIndex: 1, explanation: 'Thuế quan là thuế; hạn ngạch/cấp phép/nội địa hoá là rào cản phi thuế quan.' },
  { id: 'q3', question: 'Chiều văn hoá Hofstede đo mức độ xã hội đề cao lợi ích cá nhân hơn nhóm là?', options: ['Uncertainty avoidance', 'Power distance', 'Individualism vs collectivism', 'Long-term orientation'], correctIndex: 2, explanation: 'Individualism vs collectivism đo cá nhân hay nhóm được đề cao hơn.' },
]);

const c3 = doc('mkt205c-3-1-research-selection', '3.1 — Market research & selection|||3.1 — Nghiên cứu & lựa chọn thị trường',
  'Quy trình nghiên cứu thị trường quốc tế (dữ liệu thứ cấp/sơ cấp); sàng lọc & lựa chọn thị trường; ma trận hấp dẫn quốc gia.',
  [[
    `<span class="eyebrow">MKT205c · Chapter 3 · Lesson 3.1</span>
<h2>International market research &amp; selection</h2>
<h3>Research process &amp; challenges</h3>
<ul>
<li><strong>Secondary data</strong> — government trade statistics, industry reports, existing studies — cheap but comparability across countries can be weak.</li>
<li><strong>Primary data</strong> — surveys, interviews, observation collected specifically for the decision — more relevant but costly and hard to standardize across cultures/languages.</li>
<li><strong>Common pitfalls</strong> — data may not exist or be reliable in some markets; translation and equivalence of concepts (does the survey question mean the same thing everywhere?).</li>
</ul>
<h3>Market screening &amp; selection funnel</h3>
<pre><code>All countries in the world
 -&gt; Screen on macro indicators (GDP, population, growth, political risk)
 -&gt; Screen on product-market fit (demand, competitive intensity, entry cost)
 -&gt; Field research on shortlisted countries
 -&gt; Final selection + entry-mode decision
</code></pre>
<h3>Country attractiveness vs competitive strength</h3>
<p>A simple <strong>portfolio matrix</strong> plots each candidate market's <strong>attractiveness</strong> (market size, growth, risk) against the firm's own <strong>competitive strength</strong> there (brand recognition, existing distribution, cost position) to prioritize where to invest first.</p>
<div class="callout"><span class="badge">Indicators to screen with</span> Market size &amp; growth · income per capita · ease of doing business · political/economic risk score · existing competitors · trade agreement membership.</div>`,
    `<span class="eyebrow">MKT205c · Chương 3 · Bài 3.1</span>
<h2>Nghiên cứu &amp; lựa chọn thị trường quốc tế</h2>
<h3>Quy trình nghiên cứu &amp; thách thức</h3>
<ul>
<li><strong>Dữ liệu thứ cấp</strong> — thống kê thương mại chính phủ, báo cáo ngành, nghiên cứu có sẵn — rẻ nhưng khả năng so sánh giữa các nước có thể yếu.</li>
<li><strong>Dữ liệu sơ cấp</strong> — khảo sát, phỏng vấn, quan sát thu thập riêng cho quyết định — sát thực tế hơn nhưng đắt và khó chuẩn hoá giữa các văn hoá/ngôn ngữ.</li>
<li><strong>Bẫy thường gặp</strong> — dữ liệu có thể không tồn tại hoặc không đáng tin ở một số thị trường; vấn đề dịch thuật và tương đương khái niệm (câu hỏi khảo sát có mang nghĩa giống nhau ở mọi nơi không?).</li>
</ul>
<h3>Sàng lọc & phễu lựa chọn thị trường</h3>
<pre><code>Tất cả các quốc gia trên thế giới
 -&gt; Sàng theo chỉ số vĩ mô (GDP, dân số, tăng trưởng, rủi ro chính trị)
 -&gt; Sàng theo độ phù hợp sản phẩm-thị trường (nhu cầu, mức cạnh tranh, chi phí gia nhập)
 -&gt; Nghiên cứu thực địa các nước vào chung kết
 -&gt; Chọn thị trường cuối + quyết định phương thức thâm nhập
</code></pre>
<h3>Độ hấp dẫn quốc gia vs sức mạnh cạnh tranh</h3>
<p>Một <strong>ma trận danh mục</strong> đơn giản đặt <strong>độ hấp dẫn</strong> (quy mô, tăng trưởng, rủi ro) của mỗi thị trường ứng viên đối chiếu với <strong>sức mạnh cạnh tranh</strong> của doanh nghiệp tại đó (nhận diện thương hiệu, hệ thống phân phối sẵn có, vị trí chi phí) để ưu tiên đầu tư trước vào đâu.</p>
<div class="callout"><span class="badge">Chỉ số dùng để sàng lọc</span> Quy mô &amp; tăng trưởng thị trường · thu nhập đầu người · độ dễ kinh doanh · điểm rủi ro chính trị/kinh tế · đối thủ hiện có · thành viên hiệp định thương mại.</div>`,
  ]]);

const c3q = quiz('mkt205c-quiz-3', 'Quiz 3 — Nghiên cứu & lựa chọn thị trường|||Quiz 3 — Research & selection', [
  { id: 'q1', question: 'Dữ liệu thứ cấp trong nghiên cứu thị trường quốc tế có nhược điểm chính là gì?', options: ['Luôn đắt hơn dữ liệu sơ cấp', 'Khả năng so sánh giữa các nước có thể yếu', 'Không bao giờ tồn tại', 'Chỉ dùng được cho thị trường nội địa'], correctIndex: 1, explanation: 'Dữ liệu thứ cấp rẻ và có sẵn nhưng độ tin cậy/khả năng so sánh giữa các nước thường không đồng đều.' },
  { id: 'q2', question: 'Ma trận danh mục thị trường quốc tế thường đối chiếu độ hấp dẫn thị trường với yếu tố nào?', options: ['Tỷ giá hối đoái', 'Sức mạnh cạnh tranh của doanh nghiệp tại thị trường đó', 'Số lượng ngôn ngữ được nói', 'Diện tích quốc gia'], correctIndex: 1, explanation: 'Ma trận cân đối độ hấp dẫn thị trường với sức mạnh cạnh tranh hiện có của doanh nghiệp, để ưu tiên đầu tư.' },
  { id: 'q3', question: 'Bước ĐẦU TIÊN trong phễu sàng lọc thị trường quốc tế là gì?', options: ['Nghiên cứu thực địa chi tiết', 'Quyết định phương thức thâm nhập', 'Sàng lọc theo chỉ số vĩ mô (GDP, dân số, rủi ro)', 'Ký hợp đồng phân phối'], correctIndex: 2, explanation: 'Phễu bắt đầu từ sàng lọc vĩ mô trên toàn bộ quốc gia rồi mới thu hẹp dần.' },
]);

const c4 = doc('mkt205c-4-1-entry-modes', '4.1 — International market entry modes|||4.1 — Phương thức thâm nhập thị trường quốc tế',
  'Xuất khẩu, nhượng quyền/cấp phép, liên doanh, liên minh chiến lược, công ty con sở hữu toàn bộ; đánh đổi rủi ro-kiểm soát.',
  [[
    `<span class="eyebrow">MKT205c · Chapter 4 · Lesson 4.1</span>
<h2>International market entry modes</h2>
<h3>The main entry modes</h3>
<ul>
<li><strong>Exporting</strong> (indirect via intermediaries, or direct) — lowest risk and investment, limited control.</li>
<li><strong>Licensing</strong> — a foreign firm pays to use your trademark/patent/process; low investment, limited control, risk of creating a future competitor.</li>
<li><strong>Franchising</strong> — license a complete business format (brand + operating system); common in food service and retail.</li>
<li><strong>Joint venture</strong> — shared ownership with a local partner; shares risk and gains local knowledge, but shares control and profit too.</li>
<li><strong>Strategic alliance</strong> — cooperation without necessarily sharing equity (e.g. co-marketing, technology sharing).</li>
<li><strong>Wholly owned subsidiary</strong> — greenfield (build from scratch) or acquisition (buy an existing firm); highest investment and risk, but full control.</li>
<li><strong>Turnkey / management contract</strong> — build and hand over a complete operating facility, or manage it for a fee, without long-term ownership.</li>
</ul>
<h3>The risk-control trade-off</h3>
<pre><code>Low control/risk -----------------------------&gt; High control/risk
Exporting -&gt; Licensing -&gt; Franchising -&gt; Joint venture -&gt; Wholly owned subsidiary
</code></pre>
<div class="callout"><span class="badge">What drives the choice</span> Market size &amp; growth potential · capital available · desired speed of entry · political/legal restrictions on foreign ownership · need to protect proprietary technology.</div>`,
    `<span class="eyebrow">MKT205c · Chương 4 · Bài 4.1</span>
<h2>Phương thức thâm nhập thị trường quốc tế</h2>
<h3>Các phương thức chính</h3>
<ul>
<li><strong>Xuất khẩu</strong> (gián tiếp qua trung gian, hoặc trực tiếp) — rủi ro và đầu tư thấp nhất, kiểm soát hạn chế.</li>
<li><strong>Cấp phép (licensing)</strong> — doanh nghiệp nước ngoài trả tiền để dùng nhãn hiệu/bằng sáng chế/quy trình; đầu tư thấp, kiểm soát hạn chế, rủi ro tạo ra đối thủ tương lai.</li>
<li><strong>Nhượng quyền (franchising)</strong> — cấp phép cả mô hình kinh doanh hoàn chỉnh (thương hiệu + hệ thống vận hành); phổ biến trong ẩm thực và bán lẻ.</li>
<li><strong>Liên doanh (joint venture)</strong> — chia sẻ sở hữu với đối tác địa phương; chia sẻ rủi ro và có kiến thức bản địa, nhưng cũng chia sẻ quyền kiểm soát và lợi nhuận.</li>
<li><strong>Liên minh chiến lược</strong> — hợp tác không nhất thiết chia sẻ vốn cổ phần (vd đồng marketing, chia sẻ công nghệ).</li>
<li><strong>Công ty con sở hữu toàn bộ</strong> — greenfield (xây mới hoàn toàn) hoặc mua lại (acquisition) doanh nghiệp có sẵn; đầu tư và rủi ro cao nhất, nhưng kiểm soát toàn phần.</li>
<li><strong>Turnkey / hợp đồng quản lý</strong> — xây và bàn giao một cơ sở vận hành hoàn chỉnh, hoặc quản lý nó để lấy phí, không sở hữu dài hạn.</li>
</ul>
<h3>Đánh đổi rủi ro-kiểm soát</h3>
<pre><code>Kiểm soát/rủi ro thấp -------------------------&gt; Kiểm soát/rủi ro cao
Xuất khẩu -&gt; Cấp phép -&gt; Nhượng quyền -&gt; Liên doanh -&gt; Công ty con sở hữu toàn bộ
</code></pre>
<div class="callout"><span class="badge">Yếu tố quyết định lựa chọn</span> Quy mô &amp; tiềm năng tăng trưởng thị trường · vốn có sẵn · tốc độ thâm nhập mong muốn · hạn chế chính trị/pháp lý về sở hữu nước ngoài · nhu cầu bảo vệ công nghệ độc quyền.</div>`,
  ]]);

const c4q = quiz('mkt205c-quiz-4', 'Quiz 4 — Phương thức thâm nhập|||Quiz 4 — Entry modes', [
  { id: 'q1', question: 'Phương thức thâm nhập nào có mức kiểm soát CAO NHẤT nhưng cũng rủi ro/đầu tư cao nhất?', options: ['Xuất khẩu gián tiếp', 'Cấp phép (licensing)', 'Liên doanh', 'Công ty con sở hữu toàn bộ'], correctIndex: 3, explanation: 'Công ty con sở hữu toàn bộ (greenfield hoặc mua lại) cho kiểm soát toàn phần nhưng đòi vốn và rủi ro cao nhất.' },
  { id: 'q2', question: 'Nhượng quyền (franchising) khác cấp phép (licensing) chủ yếu ở điểm nào?', options: ['Nhượng quyền không cần thương hiệu', 'Nhượng quyền cấp cả mô hình vận hành kinh doanh hoàn chỉnh, không chỉ nhãn hiệu/công nghệ', 'Cấp phép luôn rủi ro cao hơn', 'Nhượng quyền chỉ dùng trong sản xuất'], correctIndex: 1, explanation: 'Franchising đi kèm cả hệ thống vận hành, không chỉ quyền dùng tài sản trí tuệ như licensing.' },
  { id: 'q3', question: 'Yếu tố nào KHÔNG phải là điều thường ảnh hưởng đến lựa chọn phương thức thâm nhập?', options: ['Vốn có sẵn của doanh nghiệp', 'Hạn chế pháp lý về sở hữu nước ngoài', 'Tốc độ thâm nhập mong muốn', 'Màu sắc logo của đối thủ'], correctIndex: 3, explanation: 'Màu logo đối thủ không liên quan; ba yếu tố còn lại đều là tiêu chí thật khi chọn phương thức thâm nhập.' },
]);

const c5 = doc('mkt205c-5-1-product-brand', '5.1 — Global product & brand strategy|||5.1 — Chiến lược sản phẩm & thương hiệu toàn cầu',
  'Chuẩn hoá vs thích nghi sản phẩm; chiến lược thương hiệu toàn cầu; hiệu ứng xuất xứ (country of origin).',
  [[
    `<span class="eyebrow">MKT205c · Chapter 5 · Lesson 5.1</span>
<h2>Global product &amp; brand strategy</h2>
<h3>Standardization vs adaptation</h3>
<p>Should a product be the <strong>same everywhere</strong> (standardization — economies of scale, consistent brand image) or <strong>changed per market</strong> (adaptation — fits local tastes, regulations, usage conditions)? Most real products sit on a spectrum, not at either extreme.</p>
<ul>
<li><strong>Mandatory adaptation</strong> — legal/technical requirements (voltage, safety standards, labeling laws) leave no choice.</li>
<li><strong>Discretionary adaptation</strong> — taste, packaging size, color, or features changed to fit local preference even when not required.</li>
</ul>
<h3>Global branding strategies</h3>
<ul>
<li><strong>Global brand</strong> — one name, one identity everywhere (e.g. a single worldwide logo and positioning).</li>
<li><strong>Local brand</strong> — different brand names per market, tailored to local associations.</li>
<li><strong>Combination</strong> — a global "masterbrand" with locally adapted sub-brands or product names ("glocal" branding).</li>
</ul>
<h3>Country-of-origin effect</h3>
<p>Where a product is <strong>perceived</strong> to come from shapes buyer trust and willingness to pay — before they even try it. This can be an asset (precision from Germany, tech from Japan) or a liability, and firms actively manage it through labeling and communication.</p>
<div class="callout"><span class="badge">Decision rule</span> Standardize what is invisible to the customer and costly to vary (core formula, platform); adapt what customers directly experience (taste, size, language, regulation).</div>`,
    `<span class="eyebrow">MKT205c · Chương 5 · Bài 5.1</span>
<h2>Chiến lược sản phẩm &amp; thương hiệu toàn cầu</h2>
<h3>Chuẩn hoá vs thích nghi</h3>
<p>Sản phẩm nên <strong>giống nhau ở mọi nơi</strong> (chuẩn hoá — lợi thế quy mô, hình ảnh thương hiệu nhất quán) hay <strong>thay đổi theo từng thị trường</strong> (thích nghi — phù hợp thị hiếu, quy định, điều kiện sử dụng địa phương)? Đa số sản phẩm thật nằm trên một quang phổ, không ở cực nào tuyệt đối.</p>
<ul>
<li><strong>Thích nghi bắt buộc</strong> — yêu cầu pháp lý/kỹ thuật (điện áp, tiêu chuẩn an toàn, luật ghi nhãn) không cho lựa chọn khác.</li>
<li><strong>Thích nghi tuỳ chọn</strong> — vị, kích cỡ đóng gói, màu sắc, hoặc tính năng thay đổi để phù hợp thị hiếu địa phương dù không bị bắt buộc.</li>
</ul>
<h3>Chiến lược thương hiệu toàn cầu</h3>
<ul>
<li><strong>Thương hiệu toàn cầu</strong> — một tên, một nhận diện ở mọi nơi (vd một logo và định vị duy nhất trên toàn thế giới).</li>
<li><strong>Thương hiệu địa phương</strong> — tên thương hiệu khác nhau theo thị trường, phù hợp liên tưởng địa phương.</li>
<li><strong>Kết hợp</strong> — một "thương hiệu mẹ" toàn cầu với thương hiệu con hoặc tên sản phẩm thích nghi theo địa phương (thương hiệu "glocal").</li>
</ul>
<h3>Hiệu ứng xuất xứ (country of origin)</h3>
<p>Nơi mà một sản phẩm <strong>được cho là</strong> xuất xứ định hình niềm tin và sự sẵn lòng chi trả của người mua — trước cả khi họ thử. Điều này có thể là lợi thế (sự chính xác của Đức, công nghệ của Nhật) hoặc bất lợi, và doanh nghiệp chủ động quản lý nó qua ghi nhãn và truyền thông.</p>
<div class="callout"><span class="badge">Quy tắc quyết định</span> Chuẩn hoá những gì khách hàng không thấy và tốn kém khi thay đổi (công thức lõi, nền tảng); thích nghi những gì khách hàng trực tiếp trải nghiệm (vị, kích cỡ, ngôn ngữ, quy định).</div>`,
  ]]);

const c5q = quiz('mkt205c-quiz-5', 'Quiz 5 — Sản phẩm & thương hiệu toàn cầu|||Quiz 5 — Global product & brand', [
  { id: 'q1', question: 'Thích nghi sản phẩm do yêu cầu pháp lý/kỹ thuật bắt buộc (điện áp, an toàn) gọi là gì?', options: ['Thích nghi tuỳ chọn', 'Thích nghi bắt buộc', 'Chuẩn hoá toàn phần', 'Định vị lại thương hiệu'], correctIndex: 1, explanation: 'Khi luật/kỹ thuật không cho lựa chọn khác, đó là thích nghi bắt buộc.' },
  { id: 'q2', question: 'Chiến lược thương hiệu dùng một "thương hiệu mẹ" toàn cầu kèm thương hiệu con thích nghi theo từng thị trường gọi là?', options: ['Thương hiệu toàn cầu thuần tuý', 'Thương hiệu địa phương thuần tuý', 'Thương hiệu kết hợp ("glocal")', 'Thương hiệu vô danh'], correctIndex: 2, explanation: 'Đây là chiến lược kết hợp/glocal — masterbrand toàn cầu với sub-brand địa phương.' },
  { id: 'q3', question: 'Hiệu ứng xuất xứ (country of origin) ảnh hưởng đến điều gì?', options: ['Chỉ ảnh hưởng giá vận chuyển', 'Niềm tin và sự sẵn lòng chi trả của người mua trước khi họ thử sản phẩm', 'Chỉ áp dụng cho hàng nông sản', 'Không có tác động thực tế nào'], correctIndex: 1, explanation: 'Nơi được cho là xuất xứ định hình cảm nhận và giá trị sản phẩm trong mắt người mua.' },
]);

const c6 = doc('mkt205c-6-1-pricing-distribution', '6.1 — International pricing & distribution|||6.1 — Định giá & kênh phân phối quốc tế',
  'Chiến lược định giá quốc tế (leo thang giá, bán phá giá, chợ xám, chuyển giá nội bộ); cấu trúc kênh phân phối quốc tế.',
  [[
    `<span class="eyebrow">MKT205c · Chapter 6 · Lesson 6.1</span>
<h2>International pricing &amp; distribution</h2>
<h3>Pricing strategies &amp; traps</h3>
<ul>
<li><strong>Price escalation</strong> — tariffs, extra shipping, distributor margins and taxes stack up along the export chain, so the final foreign retail price can be far higher than the domestic price for the "same" product.</li>
<li><strong>Dumping</strong> — selling below cost or below the home-market price to gain share abroad; illegal under WTO rules and can trigger anti-dumping duties.</li>
<li><strong>Gray market (parallel imports)</strong> — genuine goods bought cheap in one market and resold in another without the brand owner's authorization, undercutting official distributors.</li>
<li><strong>Transfer pricing</strong> — the price charged between units of the same multinational firm across borders; tax authorities scrutinize it closely to prevent profit-shifting.</li>
</ul>
<h3>International distribution channels</h3>
<pre><code>Producer -&gt; Export intermediary (optional)
         -&gt; Importer / national distributor
         -&gt; Wholesaler -&gt; Retailer -&gt; Consumer
</code></pre>
<p>Channels are typically <strong>longer</strong> internationally than at home, because local partners bring market knowledge, relationships, and regulatory compliance the foreign firm lacks. <strong>Incoterms</strong> (e.g. FOB, CIF) define exactly where shipping cost/risk transfers between seller and buyer.</p>
<div class="callout"><span class="badge">Direct vs indirect channel</span> Direct channels (own sales force, e-commerce) give more control and margin but require more investment and local expertise; indirect channels (agents, distributors) are faster to set up but reduce control and share.</div>`,
    `<span class="eyebrow">MKT205c · Chương 6 · Bài 6.1</span>
<h2>Định giá &amp; kênh phân phối quốc tế</h2>
<h3>Chiến lược định giá &amp; các bẫy</h3>
<ul>
<li><strong>Leo thang giá (price escalation)</strong> — thuế quan, phí vận chuyển thêm, hoa hồng nhà phân phối và thuế cộng dồn theo chuỗi xuất khẩu, nên giá bán lẻ cuối cùng ở nước ngoài có thể cao hơn nhiều giá nội địa cho cùng sản phẩm.</li>
<li><strong>Bán phá giá (dumping)</strong> — bán dưới giá thành hoặc dưới giá thị trường nội địa để chiếm thị phần nước ngoài; bất hợp pháp theo quy định WTO và có thể bị áp thuế chống phá giá.</li>
<li><strong>Chợ xám (gray market / nhập khẩu song hành)</strong> — hàng chính hãng mua rẻ ở một thị trường và bán lại ở thị trường khác không được chủ thương hiệu cho phép, làm giảm giá của nhà phân phối chính thức.</li>
<li><strong>Chuyển giá nội bộ (transfer pricing)</strong> — giá tính giữa các đơn vị của cùng một công ty đa quốc gia qua biên giới; cơ quan thuế giám sát chặt để ngăn chuyển lợi nhuận.</li>
</ul>
<h3>Kênh phân phối quốc tế</h3>
<pre><code>Nhà sản xuất -&gt; Trung gian xuất khẩu (tuỳ chọn)
             -&gt; Nhà nhập khẩu / phân phối quốc gia
             -&gt; Bán sỉ -&gt; Bán lẻ -&gt; Người tiêu dùng
</code></pre>
<p>Kênh phân phối quốc tế thường <strong>dài hơn</strong> so với nội địa, vì đối tác địa phương mang lại hiểu biết thị trường, quan hệ, và tuân thủ quy định mà doanh nghiệp nước ngoài còn thiếu. <strong>Incoterms</strong> (vd FOB, CIF) xác định chính xác nơi chi phí/rủi ro vận chuyển chuyển giao giữa người bán và người mua.</p>
<div class="callout"><span class="badge">Kênh trực tiếp vs gián tiếp</span> Kênh trực tiếp (lực lượng bán hàng riêng, e-commerce) cho nhiều kiểm soát và lợi nhuận hơn nhưng cần đầu tư và am hiểu địa phương nhiều hơn; kênh gián tiếp (đại lý, nhà phân phối) dựng nhanh hơn nhưng giảm kiểm soát và phần chia.</div>`,
  ]]);

const c6q = quiz('mkt205c-quiz-6', 'Quiz 6 — Định giá & phân phối quốc tế|||Quiz 6 — International pricing & distribution', [
  { id: 'q1', question: 'Hiện tượng giá bán lẻ ở nước ngoài cao hơn nhiều giá nội địa do thuế, phí vận chuyển, hoa hồng cộng dồn gọi là gì?', options: ['Bán phá giá', 'Leo thang giá (price escalation)', 'Chợ xám', 'Chuyển giá nội bộ'], correctIndex: 1, explanation: 'Price escalation: chi phí cộng dồn theo chuỗi xuất khẩu làm giá cuối cao hơn nhiều.' },
  { id: 'q2', question: 'Bán hàng chính hãng mua rẻ ở một nước rồi bán lại ở nước khác mà không được hãng cho phép gọi là?', options: ['Bán phá giá', 'Chuyển giá nội bộ', 'Chợ xám (gray market)', 'Định giá thâm nhập'], correctIndex: 2, explanation: 'Đây chính là định nghĩa chợ xám / nhập khẩu song hành.' },
  { id: 'q3', question: 'Vì sao kênh phân phối quốc tế thường DÀI HƠN kênh nội địa?', options: ['Vì sản phẩm quốc tế luôn đắt hơn', 'Vì đối tác địa phương mang hiểu biết thị trường, quan hệ và tuân thủ quy định', 'Vì luật pháp cấm bán hàng trực tiếp', 'Vì Incoterms yêu cầu vậy'], correctIndex: 1, explanation: 'Đối tác trung gian địa phương bù đắp thiếu hiểu biết và quan hệ của doanh nghiệp nước ngoài.' },
]);

const c7 = doc('mkt205c-7-1-communication', '7.1 — International communication & cross-cultural advertising|||7.1 — Truyền thông marketing quốc tế & quảng cáo xuyên văn hoá',
  'Chuẩn hoá vs bản địa hoá chiến dịch; bẫy dịch thuật & biểu tượng; chiến lược đẩy vs kéo; PR quốc tế.',
  [[
    `<span class="eyebrow">MKT205c · Chapter 7 · Lesson 7.1</span>
<h2>International communication &amp; cross-cultural advertising</h2>
<h3>Standardized vs localized campaigns</h3>
<p>A <strong>standardized</strong> campaign reuses the same creative and message worldwide — cheaper, consistent brand image, but risks missing local relevance. A <strong>localized</strong> campaign is built per market — more relevant but costlier and harder to control for brand consistency. Many firms use a "glocal" approach: a global core idea, locally adapted execution.</p>
<h3>Cross-cultural pitfalls</h3>
<ul>
<li><strong>Translation errors</strong> — literal translation can create nonsense or unintended meaning; back-translation testing catches most of these.</li>
<li><strong>Symbolism &amp; color</strong> — colors, numbers, gestures, and imagery carry different (sometimes opposite) meanings across cultures — what signals luck in one market can signal misfortune in another.</li>
<li><strong>Humor &amp; taboo topics</strong> — humor rarely travels well; religion, politics, and gender roles need extra sensitivity.</li>
</ul>
<h3>Push vs pull strategy</h3>
<ul>
<li><strong>Push</strong> — the company sells to and incentivizes intermediaries (trade promotions, distributor margins) who then push the product to end consumers.</li>
<li><strong>Pull</strong> — the company communicates directly to end consumers (advertising, digital, PR) who then demand the product from retailers.</li>
</ul>
<div class="callout"><span class="badge">International PR</span> Public relations must adapt to local media systems, journalist relationships, and what counts as newsworthy — a message that lands well at home can be ignored, or backfire, abroad.</div>`,
    `<span class="eyebrow">MKT205c · Chương 7 · Bài 7.1</span>
<h2>Truyền thông marketing quốc tế &amp; quảng cáo xuyên văn hoá</h2>
<h3>Chiến dịch chuẩn hoá vs bản địa hoá</h3>
<p>Chiến dịch <strong>chuẩn hoá</strong> dùng lại cùng ý tưởng sáng tạo và thông điệp trên toàn thế giới — rẻ hơn, hình ảnh thương hiệu nhất quán, nhưng có rủi ro bỏ lỡ mức liên quan địa phương. Chiến dịch <strong>bản địa hoá</strong> được dựng riêng theo từng thị trường — liên quan hơn nhưng tốn kém hơn và khó kiểm soát tính nhất quán thương hiệu. Nhiều doanh nghiệp dùng cách "glocal": ý tưởng lõi toàn cầu, thực thi thích nghi theo địa phương.</p>
<h3>Bẫy xuyên văn hoá</h3>
<ul>
<li><strong>Sai sót dịch thuật</strong> — dịch theo nghĩa đen có thể tạo ra câu vô nghĩa hoặc mang nghĩa không mong muốn; kiểm tra dịch ngược (back-translation) bắt được đa số lỗi này.</li>
<li><strong>Biểu tượng &amp; màu sắc</strong> — màu sắc, số, cử chỉ, và hình ảnh mang ý nghĩa khác nhau (đôi khi đối lập) giữa các văn hoá — thứ báo hiệu may mắn ở một thị trường có thể báo hiệu xui xẻo ở nơi khác.</li>
<li><strong>Hài hước &amp; đề tài nhạy cảm</strong> — hài hước hiếm khi "đi xa" tốt; tôn giáo, chính trị, và vai trò giới cần cẩn trọng thêm.</li>
</ul>
<h3>Chiến lược đẩy vs kéo</h3>
<ul>
<li><strong>Đẩy (push)</strong> — doanh nghiệp bán và tạo động lực cho trung gian (khuyến mãi thương mại, hoa hồng nhà phân phối), rồi trung gian đẩy sản phẩm tới người tiêu dùng cuối.</li>
<li><strong>Kéo (pull)</strong> — doanh nghiệp truyền thông trực tiếp tới người tiêu dùng cuối (quảng cáo, digital, PR), rồi người tiêu dùng yêu cầu sản phẩm từ nhà bán lẻ.</li>
</ul>
<div class="callout"><span class="badge">PR quốc tế</span> Quan hệ công chúng phải thích nghi với hệ thống truyền thông địa phương, quan hệ với nhà báo, và điều gì được coi là "có giá trị tin tức" — một thông điệp thành công ở nước nhà có thể bị bỏ qua, hoặc phản tác dụng, ở nước ngoài.</div>`,
  ]]);

const c7q = quiz('mkt205c-quiz-7', 'Quiz 7 — Truyền thông xuyên văn hoá|||Quiz 7 — Cross-cultural communication', [
  { id: 'q1', question: 'Chiến lược "glocal" trong truyền thông quốc tế là gì?', options: ['Chỉ dùng quảng cáo địa phương, bỏ ý tưởng toàn cầu', 'Ý tưởng lõi toàn cầu, thực thi thích nghi theo địa phương', 'Cấm dùng ngôn ngữ địa phương', 'Chỉ áp dụng cho PR, không áp dụng cho quảng cáo'], correctIndex: 1, explanation: 'Glocal kết hợp ý tưởng chung toàn cầu với thực thi phù hợp từng thị trường.' },
  { id: 'q2', question: 'Chiến lược "kéo" (pull) trong truyền thông marketing quốc tế nghĩa là gì?', options: ['Tạo động lực cho trung gian đẩy hàng ra thị trường', 'Truyền thông trực tiếp tới người tiêu dùng cuối để họ yêu cầu sản phẩm từ nhà bán lẻ', 'Chỉ bán qua chợ xám', 'Không cần quảng cáo'], correctIndex: 1, explanation: 'Pull nhắm vào người tiêu dùng cuối để tạo nhu cầu kéo sản phẩm qua kênh.' },
  { id: 'q3', question: 'Cách nào giúp phát hiện lỗi dịch thuật trong quảng cáo quốc tế?', options: ['Dịch máy một lượt rồi dùng ngay', 'Kiểm tra dịch ngược (back-translation)', 'Bỏ hẳn phần chữ trong quảng cáo', 'Chỉ dùng tiếng Anh ở mọi thị trường'], correctIndex: 1, explanation: 'Back-translation dịch ngược lại ngôn ngữ gốc để phát hiện sai lệch nghĩa.' },
]);

const c8 = doc('mkt205c-8-1-digital-vietnam', '8.1 — Global digital marketing & Vietnamese firms going global|||8.1 — Marketing số toàn cầu & doanh nghiệp Việt Nam ra thế giới',
  'Marketing số xuyên biên giới (SEO/localization, mạng xã hội, e-commerce); DN Việt ra thế giới: chiến lược, ví dụ, hỗ trợ chính sách.',
  [[
    `<span class="eyebrow">MKT205c · Chapter 8 · Lesson 8.1</span>
<h2>Global digital marketing &amp; Vietnamese firms going global</h2>
<h3>Digital marketing across borders</h3>
<ul>
<li><strong>Cross-border e-commerce</strong> — platforms like Amazon, Alibaba, and regional marketplaces let even small firms sell abroad without a physical presence.</li>
<li><strong>International SEO &amp; localization</strong> — separate content per language/market (not just translated, but adapted to local search behavior and keywords).</li>
<li><strong>Social media by market</strong> — platform popularity varies sharply by country (e.g. different dominant platforms in different regions); one global social strategy rarely fits all.</li>
<li><strong>Data &amp; privacy rules</strong> — regulations on customer data differ by country/region and must be respected when running digital campaigns.</li>
</ul>
<h3>Vietnamese firms going global</h3>
<p>Vietnamese exporters increasingly move beyond pure commodity export toward <strong>branded international marketing</strong>:</p>
<ul>
<li><strong>Vinamilk</strong> — dairy exports and overseas subsidiaries/joint ventures across multiple markets, building brand presence rather than just shipping product.</li>
<li><strong>Vietnamese coffee &amp; agricultural exporters</strong> — moving from raw-commodity export toward branded, value-added products (roasted, packaged) for retail shelves abroad.</li>
<li><strong>Textile &amp; garment firms</strong> — leveraging free trade agreements (EVFTA, CPTPP) to access preferential tariffs in the EU and other member markets.</li>
</ul>
<h3>Government &amp; institutional support</h3>
<p>Vietnamese firms going abroad can draw on trade promotion programs, FTA preferential tariffs, and export credit/insurance support — reducing some of the risk and cost of the entry modes covered in Chapter 4.</p>
<div class="callout"><span class="badge">Putting it together</span> A Vietnamese SME entering one ASEAN market today typically combines: digital-first market entry (e-commerce/social) + a moderate-risk entry mode (export or distributor partnership) + a "glocal" product/brand adaptation — testing before committing bigger capital.</div>`,
    `<span class="eyebrow">MKT205c · Chương 8 · Bài 8.1</span>
<h2>Marketing số toàn cầu &amp; doanh nghiệp Việt Nam ra thế giới</h2>
<h3>Marketing số xuyên biên giới</h3>
<ul>
<li><strong>E-commerce xuyên biên giới</strong> — các nền tảng như Amazon, Alibaba, và chợ khu vực cho phép cả doanh nghiệp nhỏ bán ra nước ngoài mà không cần hiện diện vật lý.</li>
<li><strong>SEO quốc tế &amp; bản địa hoá</strong> — nội dung riêng theo ngôn ngữ/thị trường (không chỉ dịch, mà thích nghi theo hành vi tìm kiếm và từ khoá địa phương).</li>
<li><strong>Mạng xã hội theo thị trường</strong> — độ phổ biến nền tảng khác nhau rõ rệt theo quốc gia (vd nền tảng thống trị khác nhau ở các vùng khác nhau); một chiến lược mạng xã hội toàn cầu hiếm khi phù hợp mọi nơi.</li>
<li><strong>Quy định dữ liệu &amp; quyền riêng tư</strong> — quy định về dữ liệu khách hàng khác nhau theo quốc gia/khu vực và phải được tuân thủ khi chạy chiến dịch số.</li>
</ul>
<h3>Doanh nghiệp Việt Nam ra thế giới</h3>
<p>Doanh nghiệp xuất khẩu Việt Nam ngày càng đi xa hơn xuất khẩu hàng hoá thô, hướng tới <strong>marketing quốc tế có thương hiệu</strong>:</p>
<ul>
<li><strong>Vinamilk</strong> — xuất khẩu sữa và các công ty con/liên doanh ở nước ngoài trên nhiều thị trường, xây dựng sự hiện diện thương hiệu thay vì chỉ vận chuyển sản phẩm.</li>
<li><strong>Cà phê &amp; nông sản xuất khẩu Việt Nam</strong> — chuyển từ xuất khẩu hàng thô sang sản phẩm có thương hiệu, giá trị gia tăng (rang, đóng gói) cho quầy bán lẻ nước ngoài.</li>
<li><strong>Doanh nghiệp dệt may</strong> — tận dụng hiệp định thương mại tự do (EVFTA, CPTPP) để tiếp cận thuế ưu đãi vào EU và các thị trường thành viên khác.</li>
</ul>
<h3>Hỗ trợ từ chính phủ &amp; tổ chức</h3>
<p>Doanh nghiệp Việt ra nước ngoài có thể tận dụng các chương trình xúc tiến thương mại, thuế ưu đãi từ FTA, và hỗ trợ tín dụng/bảo hiểm xuất khẩu — giảm bớt một phần rủi ro và chi phí của các phương thức thâm nhập đã học ở Chương 4.</p>
<div class="callout"><span class="badge">Ghép lại</span> Một SME Việt Nam vào một thị trường ASEAN hôm nay thường kết hợp: thâm nhập ưu tiên digital (e-commerce/mạng xã hội) + phương thức thâm nhập rủi ro trung bình (xuất khẩu hoặc hợp tác nhà phân phối) + thích nghi sản phẩm/thương hiệu theo hướng "glocal" — thử nghiệm trước khi rót vốn lớn hơn.</div>`,
  ]]);

const c8q = quiz('mkt205c-quiz-8', 'Quiz 8 — Marketing số & DN Việt ra thế giới|||Quiz 8 — Digital & Vietnamese firms going global', [
  { id: 'q1', question: 'Vì sao "một chiến lược mạng xã hội toàn cầu" hiếm khi phù hợp mọi thị trường?', options: ['Vì mạng xã hội chỉ có ở châu Á', 'Vì độ phổ biến nền tảng khác nhau rõ rệt theo quốc gia', 'Vì mạng xã hội bị cấm ở mọi nơi', 'Vì SEO không liên quan mạng xã hội'], correctIndex: 1, explanation: 'Nền tảng thống trị khác nhau theo vùng, nên chiến lược cần điều chỉnh theo thị trường.' },
  { id: 'q2', question: 'Xu hướng nào mô tả đúng sự chuyển dịch của xuất khẩu cà phê/nông sản Việt Nam gần đây?', options: ['Chỉ xuất khẩu hàng thô, không thay đổi', 'Chuyển từ hàng thô sang sản phẩm có thương hiệu, giá trị gia tăng', 'Ngừng xuất khẩu hoàn toàn', 'Chỉ bán nội địa'], correctIndex: 1, explanation: 'Xu hướng là tăng giá trị gia tăng (rang, đóng gói, thương hiệu) thay vì chỉ bán nguyên liệu thô.' },
  { id: 'q3', question: 'Hiệp định thương mại tự do như EVFTA/CPTPP hỗ trợ doanh nghiệp Việt ra nước ngoài chủ yếu qua cách nào?', options: ['Cấm nhập khẩu từ nước khác', 'Cho tiếp cận thuế ưu đãi vào thị trường thành viên', 'Bắt buộc liên doanh với mọi đối tác', 'Tăng thuế xuất khẩu để bảo hộ'], correctIndex: 1, explanation: 'FTA giảm/miễn thuế quan cho hàng xuất khẩu vào các nước thành viên, giúp DN Việt cạnh tranh hơn.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'MKT205c',
    slug: 'mkt205c-international-marketing',
    title: 'International Marketing',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/MKT205c.webp',
    shortDescription: 'International marketing: globalization, market environment, market selection, entry modes, global product/brand, pricing & distribution, cross-cultural promotion, digital go-global for Vietnamese firms. Bilingual, with examples & quizzes.|||Marketing quốc tế: toàn cầu hoá, môi trường thị trường, chọn thị trường, phương thức thâm nhập, sản phẩm/thương hiệu toàn cầu, giá & phân phối, truyền thông xuyên văn hoá, marketing số cho DN Việt ra thế giới. Song ngữ, có ví dụ & quiz.',
    description: 'Môn <strong>MKT205c — International Marketing</strong> (kỳ 5, khối Quản trị Kinh doanh) giúp hiểu <strong>marketing hoạt động thế nào khi vượt biên giới quốc gia</strong>. Từ <strong>toàn cầu hoá &amp; khung EPRG</strong> → <strong>môi trường kinh tế, văn hoá, chính trị-pháp lý</strong> → <strong>nghiên cứu &amp; lựa chọn thị trường</strong> → <strong>phương thức thâm nhập</strong> (xuất khẩu, cấp phép, liên doanh, sở hữu toàn bộ) → <strong>chiến lược sản phẩm &amp; thương hiệu toàn cầu</strong> (chuẩn hoá vs thích nghi) → <strong>định giá &amp; phân phối quốc tế</strong> → <strong>truyền thông xuyên văn hoá</strong> → <strong>marketing số toàn cầu &amp; doanh nghiệp Việt Nam ra thế giới</strong>. Bám giáo trình Keegan/Cateora/Kotler, song ngữ, có ví dụ và quiz mỗi chương.',
    whatYouLearn: 'Toàn cầu hoá & khung EPRG; môi trường kinh tế/văn hoá (Hofstede, SRC)/chính trị-pháp lý; quy trình nghiên cứu & sàng lọc-lựa chọn thị trường; phương thức thâm nhập & đánh đổi rủi ro-kiểm soát; chuẩn hoá vs thích nghi sản phẩm, chiến lược thương hiệu toàn cầu; leo thang giá, bán phá giá, chợ xám, chuyển giá; kênh phân phối quốc tế; chiến dịch xuyên văn hoá, push vs pull; marketing số xuyên biên giới; doanh nghiệp Việt Nam ra thế giới.',
    requirements: 'Kiến thức marketing căn bản (4P) là một lợi thế nhưng không bắt buộc. Nên đọc trước giáo trình chính thức trên FLM (flm.fpt.edu.vn).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình Keegan/Cateora/Kotler, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Marketing quốc tế là gì, vì sao DN ra nước ngoài.', lessons: [intro] },
    { title: 'Chương 1 — Toàn cầu hoá & EPRG|||Chapter 1 — Globalization & EPRG', description: 'Động lực toàn cầu hoá, các nấc phát triển, khung EPRG.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Môi trường quốc tế|||Chapter 2 — International environment', description: 'Kinh tế, văn hoá (Hofstede, SRC), chính trị-pháp lý.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Nghiên cứu & lựa chọn thị trường|||Chapter 3 — Research & market selection', description: 'Quy trình nghiên cứu, sàng lọc, ma trận hấp dẫn.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Phương thức thâm nhập|||Chapter 4 — Entry modes', description: 'Xuất khẩu, cấp phép, liên doanh, sở hữu toàn bộ.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Sản phẩm & thương hiệu toàn cầu|||Chapter 5 — Global product & brand', description: 'Chuẩn hoá vs thích nghi, chiến lược thương hiệu, xuất xứ.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Định giá & phân phối quốc tế|||Chapter 6 — Pricing & distribution', description: 'Leo thang giá, bán phá giá, chợ xám, kênh phân phối.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Truyền thông xuyên văn hoá|||Chapter 7 — Cross-cultural communication', description: 'Chuẩn hoá vs bản địa hoá, bẫy văn hoá, push vs pull.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Marketing số & DN Việt ra thế giới|||Chapter 8 — Digital & Vietnamese firms going global', description: 'E-commerce, SEO quốc tế, ví dụ DN Việt.', lessons: [c8, c8q] },
  ],
};
