/**
 * PSS301 — Purchasing and Supply Strategy (Chiến lược Thu mua và Nguồn cung).
 * Giáo trình FLM (khối Quản trị Kinh doanh — BBA), trích dẫn: "Purchasing and
 * Supply Chain Management" (Monczka/Handfield/Giunipero/Patterson), "Strategic
 * Sourcing Management" (Nicoletti), CIPS Advanced Diploma. Không upload PDF,
 * chỉ trích dẫn tên sách/tổ chức.
 *
 * ⚠️ BẬC CHIẾN LƯỢC — khác PCM301 (Procurement Management, thiên quy trình
 * vận hành P2P/RFx/hợp đồng). PSS301 nhấn: chiến lược nguồn cung dài hạn,
 * category management, làm việc với ban lãnh đạo. 8 chương: vai trò chiến
 * lược & lợi thế cạnh tranh → chiến lược tìm nguồn (make-vs-buy, đơn/đa/toàn
 * cầu) → category management & ma trận Kraljic mở rộng → chiến lược cơ sở
 * NCC & hợp tác chiến lược → rủi ro chuỗi cung & khả năng phục hồi → TCO &
 * tạo giá trị → thu mua bền vững & ESG → chuyển đổi số & đo lường.
 * Song ngữ + ví dụ + quiz. Giữ NGUYÊN semester/courseCode/slug/thumbnailUrl.
 * ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('pss301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình FLM, sách tham khảo (Monczka/Handfield; Nicoletti), CIPS Advanced, tài liệu miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">PSS301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Purchasing and Supply Strategy — the strategic layer that sits above day-to-day buying: sourcing strategy, category management, strategic supplier collaboration, supply risk &amp; resilience, total cost of ownership, sustainable/ESG sourcing and digital procurement — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources plus the standard reference texts.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for PSS301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books (citation only, not for download here)</h3>
<ul>
<li><em>Purchasing and Supply Chain Management</em> — Robert M. Monczka, Robert B. Handfield, Larry C. Giunipero, James L. Patterson. The strategic sourcing, supplier relationship and risk-management chapters underpin this course.</li>
<li><em>Strategic Sourcing Management: Structural and Operational Excellence</em> — Gianpaolo Nicoletti. Category strategy, total cost of ownership and sourcing governance.</li>
<li><a href="https://www.cips.org/" target="_blank" rel="noopener">CIPS Advanced Diploma — Chartered Institute of Procurement &amp; Supply</a> — the professional benchmark for strategic sourcing &amp; category management competencies.</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.cips.org/knowledge/" target="_blank" rel="noopener">CIPS Knowledge Hub</a> — category management &amp; strategic sourcing guides.</li>
<li><a href="https://www.mckinsey.com/capabilities/operations/how-we-help-clients/procurement" target="_blank" rel="noopener">McKinsey — Procurement insights</a> — research on category strategy, resilience and value creation.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@CIPSprocurement" target="_blank" rel="noopener">CIPS</a> — strategic sourcing &amp; category management explained.</li>
<li><a href="https://www.youtube.com/results?search_query=strategic+sourcing+category+management+lecture" target="_blank" rel="noopener">University strategic sourcing lectures</a> — search for open courseware on category management &amp; supply strategy.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.investopedia.com/terms/k/kraljic-matrix.asp" target="_blank" rel="noopener">Kraljic Matrix reference</a> — the base 2x2 this course extends with the Supplier Preferencing Matrix (Chapter 3).</li>
<li>Spreadsheet templates for TCO breakdown, supplier segmentation and risk heat-maps — build your own using the examples in Chapters 3, 5 and 6.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — purchasing's strategic role, make-vs-buy, the extended Kraljic + preferencing matrix.</li>
<li><strong>Practice</strong> — segment a supplier base, build a simple TCO model, map a risk heat-map for one category.</li>
<li><strong>Go deeper</strong> — category strategy roadmaps, strategic supplier collaboration governance, resilience design.</li>
<li><strong>Job-ready</strong> — ESG sourcing due diligence, digital procurement/analytics platforms, strategic-level KPIs.</li>
</ol></div>`,
    `<span class="eyebrow">PSS301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Chiến lược Thu mua và Nguồn cung — tầng chiến lược nằm trên việc mua sắm hằng ngày: chiến lược tìm nguồn, category management, hợp tác chiến lược với nhà cung cấp, rủi ro &amp; khả năng phục hồi cung ứng, tổng chi phí sở hữu, thu mua bền vững/ESG và số hoá thu mua — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp cùng các sách giáo trình chuẩn.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của PSS301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo (chỉ trích dẫn, không tải ở đây)</h3>
<ul>
<li><em>Purchasing and Supply Chain Management</em> — Robert M. Monczka, Robert B. Handfield, Larry C. Giunipero, James L. Patterson. Các chương về tìm nguồn chiến lược, quan hệ nhà cung cấp và quản trị rủi ro làm nền cho môn này.</li>
<li><em>Strategic Sourcing Management: Structural and Operational Excellence</em> — Gianpaolo Nicoletti. Chiến lược category, tổng chi phí sở hữu và quản trị hoạt động tìm nguồn.</li>
<li><a href="https://www.cips.org/" target="_blank" rel="noopener">CIPS Advanced Diploma — Chartered Institute of Procurement &amp; Supply</a> — chuẩn nghề cho năng lực tìm nguồn chiến lược &amp; category management.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.cips.org/knowledge/" target="_blank" rel="noopener">CIPS Knowledge Hub</a> — hướng dẫn category management &amp; tìm nguồn chiến lược.</li>
<li><a href="https://www.mckinsey.com/capabilities/operations/how-we-help-clients/procurement" target="_blank" rel="noopener">McKinsey — Procurement insights</a> — nghiên cứu về chiến lược category, khả năng phục hồi và tạo giá trị.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@CIPSprocurement" target="_blank" rel="noopener">CIPS</a> — giải thích tìm nguồn chiến lược &amp; category management.</li>
<li><a href="https://www.youtube.com/results?search_query=strategic+sourcing+category+management+lecture" target="_blank" rel="noopener">Bài giảng tìm nguồn chiến lược của các trường đại học</a> — tìm khoá học mở về category management &amp; chiến lược cung ứng.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.investopedia.com/terms/k/kraljic-matrix.asp" target="_blank" rel="noopener">Tài liệu về Kraljic Matrix</a> — ma trận 2x2 gốc mà môn này mở rộng thêm Supplier Preferencing Matrix (Chương 3).</li>
<li>Bảng tính mẫu để phân tách TCO, phân khúc nhà cung cấp và vẽ bản đồ nhiệt rủi ro — tự dựng theo ví dụ ở Chương 3, 5 và 6.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — vai trò chiến lược của thu mua, make-vs-buy, ma trận Kraljic mở rộng + preferencing.</li>
<li><strong>Luyện tập</strong> — phân khúc một cơ sở nhà cung cấp, dựng mô hình TCO đơn giản, vẽ bản đồ nhiệt rủi ro cho một category.</li>
<li><strong>Đào sâu</strong> — lộ trình chiến lược category, cơ chế quản trị hợp tác chiến lược với NCC, thiết kế khả năng phục hồi.</li>
<li><strong>Sẵn sàng đi làm</strong> — rà soát ESG nhà cung cấp, nền tảng số hoá/phân tích thu mua, KPI ở cấp chiến lược.</li>
</ol></div>`,
  ]]);

const intro = doc('pss301-0-1-overview', 'Course overview: Purchasing and Supply Strategy|||Tổng quan: Chiến lược Thu mua và Nguồn cung',
  'Thu mua vận hành vs. chiến lược nguồn cung; mô hình định vị chiến lược Reck & Long (passive → integrative); lộ trình 8 chương.',
  [[
    `<span class="eyebrow">PSS301 · Lesson 0.1 · Overview</span>
<h2>Purchasing and Supply Strategy</h2>
<p class="lead">This course sits one level above day-to-day purchasing execution. Instead of "how do we place and pay for an order," it asks <strong>"what supply strategy gives the company a lasting competitive advantage"</strong> — which categories to source how, from how many suppliers, with what risk posture, and how procurement earns a seat at the executive table instead of staying a cost-cutting back office.</p>
<h3>Operational buying vs. strategic sourcing</h3>
<ul>
<li><strong>Operational / tactical procurement</strong> — executing the purchase-to-pay cycle, running individual sourcing events, negotiating individual contracts. Time horizon: weeks to a year.</li>
<li><strong>Strategic sourcing &amp; supply strategy</strong> — deciding the long-term sourcing model for a whole category (make vs. buy, single vs. multiple suppliers, domestic vs. global), shaping the supplier base and the risk/resilience posture, and defining how procurement contributes to competitive advantage. Time horizon: multiple years.</li>
</ul>
<h3>The Reck &amp; Long strategic positioning of purchasing</h3>
<pre><code>Passive       -> purchasing only reacts to requests, no strategic role
Independent   -> purchasing has its own goals, but disconnected from company strategy
Supportive    -> purchasing actively supports the company's competitive strategy
Integrative   -> purchasing strategy is FUSED with corporate strategy at the top
</code></pre>
<p>This course is about moving an organization from "independent" toward "integrative" — the stage at which the Chief Procurement Officer (CPO) sits at the strategy table alongside the CFO and COO.</p>
<h3>Roadmap</h3>
<p>Strategic role &amp; competitive advantage → sourcing strategy (make-vs-buy, single/multiple/global sourcing) → category management &amp; the extended Kraljic matrix → supplier base strategy &amp; strategic collaboration → supply risk &amp; resilience → total cost of ownership &amp; value creation → sustainable procurement &amp; ESG → digital transformation, measurement &amp; future direction. Bilingual, with frameworks and quizzes each chapter.</p>`,
    `<span class="eyebrow">PSS301 · Bài 0.1 · Tổng quan</span>
<h2>Chiến lược Thu mua và Nguồn cung</h2>
<p class="lead">Môn này ở một tầng cao hơn việc thực thi mua sắm hằng ngày. Thay vì hỏi "làm sao đặt hàng và trả tiền," môn này hỏi <strong>"chiến lược nguồn cung nào tạo lợi thế cạnh tranh bền vững cho công ty"</strong> — nhóm hàng nào nên tìm nguồn theo cách nào, từ bao nhiêu nhà cung cấp, với thế trận rủi ro ra sao, và làm sao thu mua có được một chỗ trên bàn lãnh đạo thay vì chỉ là bộ phận hậu cần cắt giảm chi phí.</p>
<h3>Mua sắm vận hành vs. tìm nguồn chiến lược</h3>
<ul>
<li><strong>Thu mua vận hành / tác nghiệp</strong> — thực thi vòng đời purchase-to-pay, chạy từng đợt tìm nguồn riêng lẻ, đàm phán từng hợp đồng. Khung thời gian: vài tuần đến một năm.</li>
<li><strong>Tìm nguồn chiến lược &amp; chiến lược nguồn cung</strong> — quyết định mô hình tìm nguồn dài hạn cho cả một nhóm hàng (make vs. buy, một hay nhiều NCC, trong nước hay toàn cầu), định hình cơ sở nhà cung cấp và thế trận rủi ro/khả năng phục hồi, và xác định thu mua đóng góp thế nào vào lợi thế cạnh tranh. Khung thời gian: nhiều năm.</li>
</ul>
<h3>Mô hình định vị chiến lược của Reck &amp; Long</h3>
<pre><code>Passive (bị động)     -> thu mua chỉ phản ứng theo yêu cầu, không có vai trò chiến lược
Independent (độc lập) -> thu mua có mục tiêu riêng, nhưng tách rời chiến lược công ty
Supportive (hỗ trợ)   -> thu mua chủ động hỗ trợ chiến lược cạnh tranh của công ty
Integrative (tích hợp)-> chiến lược thu mua HOÀ LÀM MỘT với chiến lược công ty ở cấp cao nhất
</code></pre>
<p>Môn này hướng đến việc đưa một tổ chức từ "độc lập" tiến lên "tích hợp" — giai đoạn Giám đốc Thu mua (CPO) ngồi cùng bàn chiến lược với CFO và COO.</p>
<h3>Lộ trình</h3>
<p>Vai trò chiến lược &amp; lợi thế cạnh tranh → chiến lược tìm nguồn (make-vs-buy, đơn/đa/toàn cầu) → category management &amp; ma trận Kraljic mở rộng → chiến lược cơ sở nhà cung cấp &amp; hợp tác chiến lược → rủi ro chuỗi cung &amp; khả năng phục hồi → tổng chi phí sở hữu &amp; tạo giá trị → thu mua bền vững &amp; ESG → chuyển đổi số, đo lường &amp; định hướng tương lai. Song ngữ, có khung phân tích và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('pss301-1-1-strategic-role-competitive-advantage', '1.1 — The strategic role of purchasing in competitive advantage|||1.1 — Vai trò chiến lược của thu mua trong lợi thế cạnh tranh',
  'Từ trung tâm chi phí đến vũ khí chiến lược; đóng góp của thu mua vào chi phí thấp & khác biệt hoá (Porter); CPO ở bàn lãnh đạo; ma trận đóng góp thu mua.',
  [[
    `<span class="eyebrow">PSS301 · Chapter 1 · Lesson 1.1</span>
<h2>The strategic role of purchasing in competitive advantage</h2>
<h3>From cost center to strategic weapon</h3>
<p>For decades, purchasing was treated as a clerical support function — its only mandate was to buy at the lowest price. Modern strategy scholarship (building on Kraljic's 1983 <em>"From Purchasing to Supply Management"</em>) reframes purchasing as a source of <strong>competitive advantage</strong>: it controls the largest cost pool in most firms, shapes product quality and innovation through supplier capability, and manages a growing share of enterprise risk.</p>
<h3>Two levers of Porter's generic strategy</h3>
<p>Michael Porter's two generic strategies — <strong>cost leadership</strong> and <strong>differentiation</strong> — both run through purchasing:</p>
<ul>
<li><strong>Cost leadership</strong> — purchasing drives down total acquisition cost through leverage, standardization and global sourcing, directly lowering the firm's cost base relative to rivals.</li>
<li><strong>Differentiation</strong> — purchasing selects and co-develops with suppliers who bring unique technology, faster time-to-market, or superior quality — turning supplier capability into a feature customers will pay more for.</li>
</ul>
<h3>The purchasing contribution matrix</h3>
<pre><code>                     LOW innovation potential   HIGH innovation potential
LOW cost leverage    Maintain / automate         Selective supplier co-development
HIGH cost leverage   Aggressive cost reduction    Strategic partnership (both cost & innovation)
</code></pre>
<p>Placing a category on this simple matrix tells a purchasing leader whether the strategic story to tell the board is "we saved $X" or "we unlocked a new product feature through supplier Y."</p>
<h3>Purchasing at the top table</h3>
<p>An integrative purchasing function reports to the CEO (or a peer of the CFO/COO), participates in new-product development from the earliest concept stage, and is measured on strategic outcomes (innovation contribution, risk avoided, sustainability score) — not only price variance.</p>
<div class="callout"><span class="badge">Exam tip</span> When asked "how does purchasing create competitive advantage," always name BOTH levers — cost leadership and differentiation — and tie each to a concrete mechanism (leverage/standardization vs. supplier-enabled innovation), not just "it saves money."</div>`,
    `<span class="eyebrow">PSS301 · Chương 1 · Bài 1.1</span>
<h2>Vai trò chiến lược của thu mua trong lợi thế cạnh tranh</h2>
<h3>Từ trung tâm chi phí đến vũ khí chiến lược</h3>
<p>Trong nhiều thập niên, thu mua bị xem là bộ phận hành chính hỗ trợ — nhiệm vụ duy nhất là mua với giá thấp nhất. Lý thuyết chiến lược hiện đại (dựa trên bài viết năm 1983 của Kraljic <em>"From Purchasing to Supply Management"</em>) định hình lại thu mua là nguồn tạo <strong>lợi thế cạnh tranh</strong>: nó kiểm soát khoản chi phí lớn nhất ở hầu hết doanh nghiệp, định hình chất lượng sản phẩm &amp; đổi mới thông qua năng lực nhà cung cấp, và quản lý một phần ngày càng lớn rủi ro doanh nghiệp.</p>
<h3>Hai đòn bẩy trong chiến lược chung của Porter</h3>
<p>Hai chiến lược chung của Michael Porter — <strong>dẫn đầu chi phí</strong> và <strong>khác biệt hoá</strong> — đều đi qua thu mua:</p>
<ul>
<li><strong>Dẫn đầu chi phí</strong> — thu mua kéo giảm tổng chi phí mua sắm qua đòn bẩy khối lượng, chuẩn hoá và tìm nguồn toàn cầu, trực tiếp hạ nền chi phí của doanh nghiệp so với đối thủ.</li>
<li><strong>Khác biệt hoá</strong> — thu mua chọn và cùng phát triển với những nhà cung cấp mang công nghệ độc đáo, tốc độ ra thị trường nhanh hơn, hoặc chất lượng vượt trội — biến năng lực nhà cung cấp thành một tính năng khách hàng chịu trả giá cao hơn.</li>
</ul>
<h3>Ma trận đóng góp của thu mua</h3>
<pre><code>                       Tiềm năng đổi mới THẤP    Tiềm năng đổi mới CAO
Đòn bẩy chi phí THẤP   Duy trì / tự động hoá     Chọn NCC để cùng phát triển
Đòn bẩy chi phí CAO    Giảm chi phí quyết liệt    Đối tác chiến lược (cả chi phí & đổi mới)
</code></pre>
<p>Đặt một nhóm hàng lên ma trận đơn giản này cho người lãnh đạo thu mua biết câu chuyện chiến lược nên kể với hội đồng quản trị là "chúng tôi tiết kiệm được X đô" hay "chúng tôi mở ra một tính năng sản phẩm mới nhờ nhà cung cấp Y."</p>
<h3>Thu mua trên bàn lãnh đạo</h3>
<p>Một chức năng thu mua tích hợp báo cáo trực tiếp cho CEO (hoặc ngang hàng CFO/COO), tham gia phát triển sản phẩm mới từ giai đoạn ý tưởng sớm nhất, và được đo bằng kết quả chiến lược (đóng góp đổi mới, rủi ro tránh được, điểm bền vững) — không chỉ chênh lệch giá.</p>
<div class="callout"><span class="badge">Mẹo thi</span> Khi đề hỏi "thu mua tạo lợi thế cạnh tranh thế nào," luôn nêu CẢ HAI đòn bẩy — dẫn đầu chi phí và khác biệt hoá — và gắn mỗi đòn bẩy với một cơ chế cụ thể (đòn bẩy/chuẩn hoá vs. đổi mới nhờ nhà cung cấp), không chỉ dừng ở "tiết kiệm tiền."</div>`,
  ]]);

const c1q = quiz('pss301-quiz-1', 'Quiz 1 — Strategic role & competitive advantage|||Quiz 1 — Vai trò chiến lược & lợi thế cạnh tranh', [
  { id: 'q1', question: 'Theo Porter, thu mua đóng góp vào lợi thế cạnh tranh qua HAI đòn bẩy chiến lược nào?', options: ['Dẫn đầu chi phí và khác biệt hoá', 'Đa dạng hoá và tập trung hoá', 'Nội bộ hoá và thuê ngoài', 'Tự động hoá và thủ công'], correctIndex: 0, explanation: 'Hai chiến lược chung của Porter là dẫn đầu chi phí (leverage/chuẩn hoá) và khác biệt hoá (đổi mới nhờ NCC).' },
  { id: 'q2', question: 'Trong mô hình định vị chiến lược Reck & Long, giai đoạn nào cho thấy chiến lược thu mua HOÀ LÀM MỘT với chiến lược công ty ở cấp cao nhất?', options: ['Passive', 'Independent', 'Supportive', 'Integrative'], correctIndex: 3, explanation: 'Integrative là giai đoạn cao nhất — CPO ngồi cùng bàn chiến lược, thu mua và chiến lược công ty hợp nhất.' },
  { id: 'q3', question: 'Một nhóm hàng có đòn bẩy chi phí THẤP nhưng tiềm năng đổi mới CAO thì nên xử lý theo hướng nào trong ma trận đóng góp thu mua?', options: ['Giảm chi phí quyết liệt', 'Duy trì / tự động hoá hoàn toàn, bỏ qua nhóm này', 'Chọn nhà cung cấp để cùng phát triển, khai thác đổi mới', 'Không cần chiến lược gì cả'], correctIndex: 2, explanation: 'Đòn bẩy chi phí thấp + đổi mới cao -> hướng đến chọn NCC cùng phát triển để khai thác giá trị đổi mới, không phải ép giá.' },
]);

const c2 = doc('pss301-2-1-sourcing-strategy', '2.1 — Sourcing strategy: make-vs-buy & single/multiple/global sourcing|||2.1 — Chiến lược tìm nguồn: make-vs-buy & đơn/đa/toàn cầu',
  'Khung quyết định make-vs-buy (năng lực lõi, chi phí, kiểm soát, rủi ro); đơn nguồn vs đa nguồn vs song nguồn; nguồn nội địa vs toàn cầu; đánh đổi chi phí-rủi ro.',
  [[
    `<span class="eyebrow">PSS301 · Chapter 2 · Lesson 2.1</span>
<h2>Sourcing strategy: make-vs-buy &amp; single/multiple/global sourcing</h2>
<h3>The make-vs-buy decision</h3>
<p>Every company must decide, category by category, whether to produce an input internally (<strong>make</strong>) or purchase it from the market (<strong>buy</strong>). Four questions drive the decision:</p>
<pre><code>Make-vs-buy decision framework:
 1. Core competency?  -> is this activity part of what makes us uniquely competitive?
 2. Cost comparison?  -> total internal cost vs. total cost of the best external supplier
 3. Control needed?    -> IP protection, quality control, capacity certainty required?
 4. Risk exposure?      -> supply market maturity, switching cost, dependency created
</code></pre>
<p>The rule of thumb: <strong>make</strong> what is core to competitive advantage and where the firm has superior capability; <strong>buy</strong> what specialized suppliers can do better, cheaper, or with more flexibility — this frees internal capacity for what truly differentiates the firm.</p>
<h3>Single, multiple, and dual sourcing</h3>
<ul>
<li><strong>Single sourcing</strong> — one supplier for an item, chosen deliberately (not the only supplier available). Benefits: volume leverage, deeper relationship, lower coordination cost. Risk: total dependency if that supplier fails.</li>
<li><strong>Multiple sourcing</strong> — several suppliers compete for the same item. Benefits: competitive pressure on price, supply continuity if one fails. Cost: split volumes lose scale leverage, more suppliers to manage.</li>
<li><strong>Dual sourcing</strong> — a deliberate middle ground: a primary supplier for most volume plus a qualified secondary supplier kept "warm" for resilience — the most common strategy for critical, high-risk items (ties to Chapter 5).</li>
</ul>
<h3>Domestic, nearshore, and global sourcing</h3>
<pre><code>Sourcing footprint trade-off:
 Domestic  -> short lead time, easy quality control, higher unit cost, low currency/tariff risk
 Nearshore -> moderate lead time, moderate cost, easier collaboration (time zone, culture)
 Global    -> lowest unit cost potential, longest lead time, highest currency/tariff/geopolitical risk
</code></pre>
<p>Global sourcing is not automatically "cheaper" once landed cost (freight, duties, inventory buffer for long lead times, quality risk) is added — this is exactly what Chapter 6's total cost of ownership makes visible.</p>
<div class="callout"><span class="badge">Exam tip</span> A make-vs-buy or sourcing-footprint question is never answered with a single factor — always weigh cost against control, risk and strategic fit together.</div>`,
    `<span class="eyebrow">PSS301 · Chương 2 · Bài 2.1</span>
<h2>Chiến lược tìm nguồn: make-vs-buy &amp; đơn/đa/toàn cầu</h2>
<h3>Quyết định make-vs-buy (tự làm hay mua ngoài)</h3>
<p>Mọi công ty phải quyết định, theo từng nhóm hàng, có nên tự sản xuất đầu vào (<strong>make</strong>) hay mua từ thị trường (<strong>buy</strong>). Bốn câu hỏi dẫn dắt quyết định này:</p>
<pre><code>Khung quyết định make-vs-buy:
 1. Năng lực lõi?      -> hoạt động này có phải điều làm chúng ta cạnh tranh khác biệt?
 2. So sánh chi phí?   -> tổng chi phí nội bộ vs. tổng chi phí của NCC ngoài tốt nhất
 3. Cần kiểm soát?      -> có cần bảo vệ IP, kiểm soát chất lượng, chắc chắn công suất?
 4. Mức rủi ro?         -> độ chín của thị trường cung, chi phí chuyển đổi, sự phụ thuộc tạo ra
</code></pre>
<p>Nguyên tắc chung: <strong>tự làm</strong> những gì là lõi của lợi thế cạnh tranh và nơi công ty có năng lực vượt trội; <strong>mua ngoài</strong> những gì nhà cung cấp chuyên biệt làm tốt hơn, rẻ hơn, hoặc linh hoạt hơn — điều này giải phóng nguồn lực nội bộ cho thứ thực sự làm công ty khác biệt.</p>
<h3>Đơn nguồn, đa nguồn và song nguồn</h3>
<ul>
<li><strong>Đơn nguồn (single sourcing)</strong> — một nhà cung cấp cho một mặt hàng, được CHỌN có chủ đích (không phải vì chỉ có một NCC tồn tại). Lợi ích: đòn bẩy khối lượng, quan hệ sâu hơn, chi phí điều phối thấp hơn. Rủi ro: phụ thuộc hoàn toàn nếu NCC đó gặp vấn đề.</li>
<li><strong>Đa nguồn (multiple sourcing)</strong> — nhiều NCC cạnh tranh cho cùng mặt hàng. Lợi ích: áp lực cạnh tranh về giá, liên tục cung ứng nếu một NCC gặp sự cố. Chi phí: khối lượng bị chia nhỏ mất đòn bẩy quy mô, phải quản lý nhiều NCC hơn.</li>
<li><strong>Song nguồn (dual sourcing)</strong> — trung gian có chủ đích: một NCC chính cho phần lớn khối lượng cộng một NCC phụ đã được chứng nhận, giữ ở trạng thái "sẵn sàng" để tăng khả năng phục hồi — chiến lược phổ biến nhất cho mặt hàng quan trọng, rủi ro cao (liên kết với Chương 5).</li>
</ul>
<h3>Nguồn trong nước, cận biên và toàn cầu</h3>
<pre><code>Đánh đổi phạm vi tìm nguồn:
 Trong nước -> thời gian giao ngắn, dễ kiểm soát chất lượng, giá đơn vị cao hơn, ít rủi ro tiền tệ/thuế
 Cận biên    -> thời gian giao trung bình, chi phí trung bình, hợp tác dễ hơn (múi giờ, văn hoá)
 Toàn cầu    -> giá đơn vị tiềm năng thấp nhất, thời gian giao dài nhất, rủi ro tiền tệ/thuế/địa chính trị cao nhất
</code></pre>
<p>Nguồn toàn cầu không tự động "rẻ hơn" một khi tính đủ chi phí đến tay (vận chuyển, thuế nhập khẩu, tồn kho đệm cho thời gian giao dài, rủi ro chất lượng) — đây chính là điều tổng chi phí sở hữu ở Chương 6 làm hiển lộ.</p>
<div class="callout"><span class="badge">Mẹo thi</span> Câu hỏi về make-vs-buy hay phạm vi tìm nguồn không bao giờ trả lời bằng một yếu tố đơn lẻ — luôn cân chi phí cùng với kiểm soát, rủi ro và mức độ phù hợp chiến lược.</div>`,
  ]]);

const c2q = quiz('pss301-quiz-2', 'Quiz 2 — Sourcing strategy|||Quiz 2 — Chiến lược tìm nguồn', [
  { id: 'q1', question: 'Trong khung make-vs-buy, một hoạt động nên được TỰ LÀM (make) khi nào?', options: ['Khi nó là năng lực lõi, tạo lợi thế cạnh tranh và công ty có năng lực vượt trội', 'Khi bất kỳ NCC nào cũng làm được', 'Khi công ty muốn giảm kiểm soát chất lượng', 'Khi không có rủi ro phụ thuộc'], correctIndex: 0, explanation: 'Make phù hợp khi hoạt động là lõi cạnh tranh và công ty làm tốt hơn thị trường; ngược lại nên buy.' },
  { id: 'q2', question: '"Song nguồn" (dual sourcing) là chiến lược kết hợp điều gì?', options: ['Chỉ dùng đúng một NCC duy nhất mãi mãi', 'Một NCC chính cho phần lớn khối lượng + một NCC phụ đã chứng nhận để dự phòng', 'Luôn chia đều 50/50 cho hai NCC bất kỳ', 'Không cần đánh giá NCC nào cả'], correctIndex: 1, explanation: 'Dual sourcing giữ NCC chính cho khối lượng lớn và NCC phụ "sẵn sàng" để tăng khả năng phục hồi.' },
  { id: 'q3', question: 'Vì sao "nguồn toàn cầu" không tự động rẻ hơn nguồn trong nước?', options: ['Vì luật pháp cấm mua hàng nước ngoài', 'Vì tổng chi phí đến tay gồm vận chuyển, thuế, tồn kho đệm và rủi ro chất lượng có thể vượt phần tiết kiệm giá đơn vị', 'Vì hàng toàn cầu luôn có chất lượng kém hơn', 'Vì không có NCC toàn cầu nào đáng tin'], correctIndex: 1, explanation: 'Chỉ so giá đơn vị bỏ qua chi phí đến tay (landed cost) và rủi ro — đây là điều TCO ở Chương 6 làm rõ.' },
]);

const c3 = doc('pss301-3-1-category-management-extended-kraljic', '3.1 — Category management & the extended Kraljic matrix|||3.1 — Category management & ma trận Kraljic mở rộng',
  'Category management: tổ chức thu mua theo nhóm hàng, đội đa chức năng, lộ trình chiến lược category; mở rộng Kraljic với Supplier Preferencing Matrix để xác định chiến lược đàm phán.',
  [[
    `<span class="eyebrow">PSS301 · Chapter 3 · Lesson 3.1</span>
<h2>Category management &amp; the extended Kraljic matrix</h2>
<h3>What category management is</h3>
<p><strong>Category management</strong> reorganizes purchasing around groups of similar spend ("categories" — e.g. packaging, IT hardware, logistics) rather than around individual transactions. A cross-functional category team (procurement, engineering, finance, operations) owns a multi-year <strong>category strategy</strong> for its spend area.</p>
<pre><code>Category strategy roadmap:
 1. Profile the category -> spend, demand, current suppliers, market structure
 2. Analyze the market   -> supply/demand balance, cost drivers, substitute options
 3. Set the strategy      -> which quadrant (Kraljic), which sourcing model (Ch.2)
 4. Implement             -> re-source, negotiate, migrate suppliers, contract
 5. Review & re-profile   -> yearly: has the category moved quadrant? new risks?
</code></pre>
<h3>The Kraljic matrix, recapped</h3>
<p>Kraljic's 2x2 (profit impact x supply risk) sorts spend into non-critical, leverage, bottleneck, and strategic. It answers "how important and how risky is this category" — but on its own it says nothing about the <em>relationship</em> the supplier feels toward the buyer, which is exactly what determines whether a negotiation strategy will actually work.</p>
<h3>The extension: the Supplier Preferencing Matrix</h3>
<p>Category management pairs Kraljic with a second matrix — <strong>how attractive is OUR business to the supplier</strong> — on two axes: the <strong>value of our business</strong> to the supplier, and the supplier's <strong>perception of us</strong> as a customer.</p>
<pre><code>Supplier Preferencing Matrix          Our attractiveness to the supplier
                                  Low                      High
Value of our business   High  | "Exploitable" - supplier | "Core" - supplier
                              | under-invests in us       | invests, prioritizes us
                         Low  | "Nuisance" - supplier     | "Development" - supplier
                              | avoids/deprioritizes us   | wants to grow with us
</code></pre>
<p>Combine the two matrices: a <strong>Strategic</strong> Kraljic item where the supplier sees us as merely a "Nuisance" account is a red flag — high dependency, low leverage — the category strategy must actively raise our attractiveness (larger volume commitment, joint roadmaps, executive sponsorship) or diversify supply.</p>
<div class="callout"><span class="badge">Why this is the strategic layer</span> Basic Kraljic tells you WHAT strategy a category needs; the preferencing matrix tells you whether the supplier will actually GIVE you that strategy — category management lives in the gap between the two.</div>`,
    `<span class="eyebrow">PSS301 · Chương 3 · Bài 3.1</span>
<h2>Category management &amp; ma trận Kraljic mở rộng</h2>
<h3>Category management là gì</h3>
<p><strong>Category management</strong> tổ chức lại thu mua theo các nhóm chi tiêu tương tự nhau ("category" — vd bao bì, phần cứng CNTT, logistics) thay vì theo từng giao dịch riêng lẻ. Một đội đa chức năng (thu mua, kỹ thuật, tài chính, vận hành) sở hữu <strong>chiến lược category</strong> nhiều năm cho nhóm chi tiêu của mình.</p>
<pre><code>Lộ trình chiến lược category:
 1. Lập hồ sơ category -> chi tiêu, nhu cầu, NCC hiện tại, cấu trúc thị trường
 2. Phân tích thị trường -> cân bằng cung/cầu, yếu tố chi phí, phương án thay thế
 3. Đặt chiến lược        -> nằm ở ô nào (Kraljic), theo mô hình tìm nguồn nào (Ch.2)
 4. Triển khai             -> tìm nguồn lại, đàm phán, chuyển đổi NCC, ký hợp đồng
 5. Rà soát & lập lại hồ sơ -> hằng năm: category có đổi ô không? rủi ro mới?
</code></pre>
<h3>Nhắc lại ma trận Kraljic</h3>
<p>Ma trận 2x2 của Kraljic (tác động lợi nhuận x rủi ro cung ứng) chia chi tiêu thành non-critical, leverage, bottleneck và strategic. Nó trả lời "category này quan trọng và rủi ro đến mức nào" — nhưng riêng nó không nói gì về <em>quan hệ</em> mà nhà cung cấp cảm nhận với người mua, điều quyết định một chiến lược đàm phán có thực sự hiệu quả hay không.</p>
<h3>Phần mở rộng: Supplier Preferencing Matrix</h3>
<p>Category management ghép Kraljic với một ma trận thứ hai — <strong>đơn hàng của CHÚNG TA hấp dẫn nhà cung cấp đến đâu</strong> — theo hai trục: <strong>giá trị đơn hàng của ta</strong> với nhà cung cấp, và <strong>cách nhà cung cấp nhìn ta</strong> như một khách hàng.</p>
<pre><code>Ma trận Supplier Preferencing         Mức hấp dẫn của ta với NCC
                                  Thấp                       Cao
Giá trị đơn   Cao  | "Có thể bị bòn rút" - NCC | "Cốt lõi" - NCC đầu tư,
hàng của ta        | đầu tư dưới mức cho ta      | ưu tiên cho ta
              Thấp | "Gây phiền" - NCC tránh/  | "Phát triển" - NCC muốn
                    | hạ ưu tiên cho ta          | lớn cùng ta
</code></pre>
<p>Kết hợp hai ma trận: một mặt hàng ở ô <strong>Strategic</strong> của Kraljic mà nhà cung cấp lại xem ta là "Gây phiền" là một cảnh báo đỏ — phụ thuộc cao, đòn bẩy thấp — chiến lược category phải chủ động nâng mức hấp dẫn của ta (cam kết khối lượng lớn hơn, lộ trình chung, sự tham gia của lãnh đạo) hoặc đa dạng hoá nguồn cung.</p>
<div class="callout"><span class="badge">Vì sao đây là tầng chiến lược</span> Kraljic cơ bản cho biết một category CẦN chiến lược gì; ma trận preferencing cho biết nhà cung cấp có thực sự SẼ trao chiến lược đó cho ta hay không — category management sống ở khoảng giữa hai điều này.</div>`,
  ]]);

const c3q = quiz('pss301-quiz-3', 'Quiz 3 — Category management & extended Kraljic|||Quiz 3 — Category management & Kraljic mở rộng', [
  { id: 'q1', question: 'Category management khác thu mua theo giao dịch ở điểm nào?', options: ['Không khác gì, chỉ đổi tên gọi', 'Tổ chức thu mua theo nhóm chi tiêu (category), với đội đa chức năng và chiến lược nhiều năm', 'Chỉ áp dụng cho mua hàng văn phòng', 'Loại bỏ hoàn toàn vai trò của thu mua'], correctIndex: 1, explanation: 'Category management gom chi tiêu tương tự lại, giao cho đội đa chức năng sở hữu chiến lược dài hạn — khác cách xử lý từng giao dịch đơn lẻ.' },
  { id: 'q2', question: 'Supplier Preferencing Matrix bổ sung điều gì mà ma trận Kraljic cơ bản KHÔNG có?', options: ['Đo tác động lợi nhuận của mặt hàng', 'Đo rủi ro cung ứng của mặt hàng', 'Đo mức nhà cung cấp xem đơn hàng của ta hấp dẫn đến đâu', 'Đo giá thị trường hiện tại'], correctIndex: 2, explanation: 'Kraljic đo tác động lợi nhuận & rủi ro cung ứng; Preferencing Matrix đo góc nhìn của NCC về mức hấp dẫn của khách hàng.' },
  { id: 'q3', question: 'Một mặt hàng ở ô "Strategic" của Kraljic nhưng NCC xem ta thuộc nhóm "Gây phiền" (Nuisance) trong Preferencing Matrix thì nên làm gì?', options: ['Không cần làm gì, cứ giữ nguyên vì đã là hàng chiến lược', 'Chủ động nâng mức hấp dẫn của ta với NCC hoặc đa dạng hoá nguồn cung', 'Chuyển ngay sang mua theo kiểu leverage', 'Ngừng mua mặt hàng này'], correctIndex: 1, explanation: 'Kết hợp cho thấy phụ thuộc cao nhưng đòn bẩy thấp — cần nâng sức hấp dẫn (cam kết khối lượng, lộ trình chung...) hoặc giảm phụ thuộc.' },
]);

const c4 = doc('pss301-4-1-supplier-base-strategic-collaboration', '4.1 — Supplier base strategy & strategic collaboration|||4.1 — Chiến lược cơ sở nhà cung cấp & hợp tác chiến lược',
  'Hợp lý hoá cơ sở NCC; phân tầng NCC (chiến lược/ưu tiên/giao dịch); early supplier involvement (ESI); cơ chế quản trị đối tác chiến lược (joint business plan, executive sponsorship).',
  [[
    `<span class="eyebrow">PSS301 · Chapter 4 · Lesson 4.1</span>
<h2>Supplier base strategy &amp; strategic collaboration</h2>
<h3>Supplier base rationalization</h3>
<p>An unmanaged supplier base tends to sprawl — hundreds of suppliers doing similar work, each too small to warrant real attention. <strong>Rationalization</strong> deliberately consolidates volume onto fewer, better-capable suppliers: fewer relationships to manage, more volume leverage per supplier, deeper collaboration possible with the survivors. The trade-off is concentration risk — which is why rationalization must be planned alongside Chapter 5's resilience thinking, not against it.</p>
<h3>Supplier tiering</h3>
<pre><code>Supplier tiers:
 Tier 1: Strategic partners  -> few, high-value, co-innovation, joint roadmaps, executive contact
 Tier 2: Preferred suppliers -> good performers, first call for new sourcing, some collaboration
 Tier 3: Transactional / approved -> qualified, competitively managed, price-driven, arm's length
</code></pre>
<p>Tiering lets a category team allocate scarce relationship-management time to the suppliers where it will actually move the needle — mirroring the Kraljic "strategic" quadrant from Chapter 3.</p>
<h3>Early Supplier Involvement (ESI)</h3>
<p>For strategic/Tier-1 suppliers, the highest-value form of collaboration is bringing the supplier into <strong>new-product development before the design is frozen</strong>. Benefits: the supplier's manufacturing knowledge improves design-for-manufacturability, cuts development time, and can surface cost or technology options the buyer's own engineers never considered.</p>
<h3>Governing a strategic partnership</h3>
<pre><code>Strategic partnership governance:
 - Executive sponsorship  -> a senior leader on each side owns the relationship
 - Joint business plan    -> shared goals, roadmap, and success metrics, reviewed regularly
 - Innovation days / labs -> structured time for the supplier to pitch new capability
 - Shared risk & reward   -> gain-sharing on cost reduction, joint investment in capacity
</code></pre>
<div class="callout"><span class="badge">Exam tip</span> "Strategic partnership" is not just "a supplier we like" — it requires a named governance mechanism (joint business plan, executive sponsor). A scenario answer without one of these is describing a good relationship, not a strategic partnership.</div>`,
    `<span class="eyebrow">PSS301 · Chương 4 · Bài 4.1</span>
<h2>Chiến lược cơ sở nhà cung cấp &amp; hợp tác chiến lược</h2>
<h3>Hợp lý hoá cơ sở nhà cung cấp</h3>
<p>Một cơ sở nhà cung cấp không được quản lý có xu hướng phình to — hàng trăm NCC làm những việc tương tự, mỗi NCC quá nhỏ để đáng dành sự quan tâm thật sự. <strong>Hợp lý hoá</strong> chủ động gộp khối lượng vào ít NCC hơn nhưng có năng lực tốt hơn: ít quan hệ cần quản lý hơn, đòn bẩy khối lượng trên mỗi NCC cao hơn, có thể hợp tác sâu hơn với những NCC còn lại. Đánh đổi là rủi ro tập trung — đây là lý do hợp lý hoá phải được lập kế hoạch cùng với tư duy khả năng phục hồi ở Chương 5, không phải trái ngược với nó.</p>
<h3>Phân tầng nhà cung cấp</h3>
<pre><code>Các tầng nhà cung cấp:
 Tầng 1: Đối tác chiến lược  -> ít, giá trị cao, cùng đổi mới, lộ trình chung, tiếp xúc cấp lãnh đạo
 Tầng 2: NCC ưu tiên          -> hiệu suất tốt, được ưu tiên gọi tìm nguồn mới, có hợp tác
 Tầng 3: Giao dịch / được duyệt -> đã được thẩm định, quản lý cạnh tranh, theo giá, quan hệ ở khoảng cách xa
</code></pre>
<p>Phân tầng giúp đội category dành thời gian quản trị quan hệ có hạn cho những NCC thực sự tạo khác biệt — phản chiếu ô "Strategic" của Kraljic ở Chương 3.</p>
<h3>Early Supplier Involvement (ESI) — đưa NCC vào sớm</h3>
<p>Với NCC chiến lược/Tầng 1, hình thức hợp tác giá trị cao nhất là đưa nhà cung cấp vào <strong>phát triển sản phẩm mới trước khi thiết kế được đóng băng</strong>. Lợi ích: kiến thức sản xuất của NCC cải thiện khả năng sản xuất của thiết kế (design-for-manufacturability), rút ngắn thời gian phát triển, và có thể hé lộ phương án chi phí hoặc công nghệ mà kỹ sư của bên mua chưa từng nghĩ tới.</p>
<h3>Quản trị một đối tác chiến lược</h3>
<pre><code>Cơ chế quản trị đối tác chiến lược:
 - Executive sponsorship   -> một lãnh đạo cấp cao mỗi bên chịu trách nhiệm cho quan hệ
 - Joint business plan     -> mục tiêu, lộ trình và chỉ số thành công chung, rà soát định kỳ
 - Innovation day / labs   -> thời gian có cấu trúc cho NCC trình bày năng lực mới
 - Chia sẻ rủi ro & lợi ích -> chia sẻ lợi ích giảm chi phí, đầu tư chung vào công suất
</code></pre>
<div class="callout"><span class="badge">Mẹo thi</span> "Đối tác chiến lược" không chỉ là "một NCC ta thích" — nó cần một cơ chế quản trị được đặt tên (joint business plan, executive sponsor). Câu trả lời cho tình huống mà thiếu cơ chế này chỉ đang mô tả một quan hệ tốt, chưa phải đối tác chiến lược.</div>`,
  ]]);

const c4q = quiz('pss301-quiz-4', 'Quiz 4 — Supplier base & strategic collaboration|||Quiz 4 — Cơ sở nhà cung cấp & hợp tác chiến lược', [
  { id: 'q1', question: 'Rủi ro chính khi HỢP LÝ HOÁ (rationalization) cơ sở nhà cung cấp là gì?', options: ['Không có rủi ro nào', 'Rủi ro tập trung — phụ thuộc quá nhiều vào ít NCC hơn', 'Giá sẽ luôn tăng', 'Chất lượng luôn giảm'], correctIndex: 1, explanation: 'Gộp khối lượng vào ít NCC tăng đòn bẩy nhưng cũng tăng rủi ro tập trung, phải cân với tư duy khả năng phục hồi.' },
  { id: 'q2', question: 'Early Supplier Involvement (ESI) mang lại lợi ích chính nào?', options: ['Giảm chất lượng sản phẩm', 'Đưa NCC vào phát triển sản phẩm sớm, cải thiện khả năng sản xuất và rút ngắn thời gian phát triển', 'Chỉ áp dụng cho NCC Tầng 3', 'Loại bỏ hoàn toàn vai trò kỹ sư nội bộ'], correctIndex: 1, explanation: 'ESI đưa kiến thức sản xuất của NCC vào sớm, cải thiện design-for-manufacturability và tốc độ phát triển.' },
  { id: 'q3', question: 'Điều gì PHÂN BIỆT một "đối tác chiến lược" thật sự với "một NCC ta thích"?', options: ['Không có gì khác biệt', 'Có cơ chế quản trị cụ thể như joint business plan và executive sponsorship', 'Chỉ cần mua hàng của họ nhiều năm', 'Chỉ cần giá rẻ hơn NCC khác'], correctIndex: 1, explanation: 'Đối tác chiến lược cần cơ chế quản trị được đặt tên (joint business plan, sponsor cấp lãnh đạo), không chỉ là quan hệ tốt.' },
]);

const c5 = doc('pss301-5-1-supply-risk-resilience', '5.1 — Supply chain risk management & resilience|||5.1 — Quản trị rủi ro chuỗi cung & khả năng phục hồi',
  'Loại rủi ro cung ứng; ma trận xác suất x tác động; bản đồ chuỗi cung (tier 1/2/3); chiến lược phục hồi (song nguồn, tồn kho đệm, kế hoạch liên tục kinh doanh).',
  [[
    `<span class="eyebrow">PSS301 · Chapter 5 · Lesson 5.1</span>
<h2>Supply chain risk management &amp; resilience</h2>
<h3>Categories of supply risk</h3>
<pre><code>Supply risk categories:
 Supply risk       -> a supplier fails, closes, or can't meet demand
 Demand risk        -> internal forecast is wrong, causing shortage or excess
 Operational risk    -> quality failure, logistics breakdown, plant disruption
 Financial risk       -> supplier bankruptcy, currency swing, price volatility
 Geopolitical risk    -> tariffs, sanctions, war, export controls, border closures
 ESG / reputational   -> supplier misconduct that damages the buyer's brand (Chapter 7)
</code></pre>
<h3>The risk assessment matrix</h3>
<p>Every identified risk is plotted on <strong>probability x impact</strong> — the same logic as the profit-impact/supply-risk axis of Kraljic (Chapter 3), applied to a specific event rather than a whole category. High-probability, high-impact risks demand an active mitigation plan; low-probability, low-impact risks are simply monitored.</p>
<h3>Mapping the supply chain beyond Tier 1</h3>
<p>A resilient strategy cannot stop at direct (Tier 1) suppliers — the actual point of failure is often a Tier 2 or Tier 3 sub-supplier the buyer has never directly engaged with (a single raw-material mine, a single specialty chemical plant). <strong>Supply chain mapping</strong> traces critical inputs down through the tiers to find these hidden single points of failure.</p>
<h3>Resilience strategies</h3>
<pre><code>Building resilience:
 - Dual/multiple sourcing    -> avoid single points of failure (links to Chapter 2)
 - Safety stock / buffer      -> absorb short-term disruption without stopping operations
 - Supply chain mapping       -> know Tier 2/3 dependencies before a crisis, not during one
 - Business continuity plan   -> pre-agreed response: who decides, which backup activates
 - Nearshoring / regionalization -> shorten and diversify the physical supply footprint
</code></pre>
<p>Recent shocks (pandemic-era shutdowns, the Suez Canal blockage, chip shortages) pushed many firms from a pure lowest-cost sourcing model toward one that explicitly prices in resilience — sometimes paying more for a second, geographically distant supplier purely as insurance.</p>
<div class="callout"><span class="badge">Exam tip</span> "Resilience" and "lowest cost" are usually in tension — a strong answer names the trade-off explicitly and justifies which risk category (from the list above) makes the extra cost worth it.</div>`,
    `<span class="eyebrow">PSS301 · Chương 5 · Bài 5.1</span>
<h2>Quản trị rủi ro chuỗi cung &amp; khả năng phục hồi</h2>
<h3>Các nhóm rủi ro cung ứng</h3>
<pre><code>Các nhóm rủi ro cung ứng:
 Rủi ro cung ứng      -> NCC gặp sự cố, đóng cửa, hoặc không đáp ứng được nhu cầu
 Rủi ro nhu cầu         -> dự báo nội bộ sai, gây thiếu hoặc dư hàng
 Rủi ro vận hành         -> lỗi chất lượng, gián đoạn logistics, sự cố nhà máy
 Rủi ro tài chính         -> NCC phá sản, biến động tiền tệ, giá cả bất ổn
 Rủi ro địa chính trị     -> thuế quan, cấm vận, chiến tranh, kiểm soát xuất khẩu, đóng cửa biên giới
 Rủi ro ESG / danh tiếng  -> hành vi sai của NCC làm tổn hại thương hiệu bên mua (Chương 7)
</code></pre>
<h3>Ma trận đánh giá rủi ro</h3>
<p>Mọi rủi ro đã xác định được đặt lên trục <strong>xác suất x tác động</strong> — cùng logic với trục tác động lợi nhuận/rủi ro cung ứng của Kraljic (Chương 3), nhưng áp dụng cho một sự cố cụ thể thay vì cả một category. Rủi ro xác suất cao, tác động cao đòi hỏi một kế hoạch giảm thiểu chủ động; rủi ro xác suất thấp, tác động thấp chỉ cần theo dõi.</p>
<h3>Lập bản đồ chuỗi cung vượt qua Tier 1</h3>
<p>Một chiến lược phục hồi không thể chỉ dừng ở nhà cung cấp trực tiếp (Tier 1) — điểm hỏng thực tế thường nằm ở một nhà cung cấp phụ Tier 2 hoặc Tier 3 mà bên mua chưa từng làm việc trực tiếp (một mỏ nguyên liệu duy nhất, một nhà máy hoá chất chuyên biệt duy nhất). <strong>Lập bản đồ chuỗi cung</strong> lần theo đầu vào quan trọng xuyên qua các tầng để tìm ra những điểm hỏng đơn lẻ bị che khuất này.</p>
<h3>Chiến lược xây khả năng phục hồi</h3>
<pre><code>Xây dựng khả năng phục hồi:
 - Song nguồn/đa nguồn        -> tránh điểm hỏng đơn lẻ (liên kết Chương 2)
 - Tồn kho an toàn / đệm       -> hấp thụ gián đoạn ngắn hạn mà không dừng vận hành
 - Bản đồ chuỗi cung           -> biết phụ thuộc Tier 2/3 trước khủng hoảng, không phải trong lúc khủng hoảng
 - Kế hoạch liên tục kinh doanh -> phản ứng đã thoả thuận trước: ai quyết, phương án dự phòng nào kích hoạt
 - Nearshoring / khu vực hoá   -> rút ngắn và đa dạng hoá phạm vi cung ứng vật lý
</code></pre>
<p>Các cú sốc gần đây (đóng cửa thời đại dịch, tắc nghẽn kênh đào Suez, thiếu chip) đã đẩy nhiều công ty từ mô hình tìm nguồn thuần giá thấp nhất sang mô hình tính rõ chi phí cho khả năng phục hồi — đôi khi chấp nhận trả cao hơn cho một NCC thứ hai ở xa về địa lý chỉ để làm "bảo hiểm."</p>
<div class="callout"><span class="badge">Mẹo thi</span> "Khả năng phục hồi" và "chi phí thấp nhất" thường mâu thuẫn — một câu trả lời tốt nêu rõ sự đánh đổi này và lý giải nhóm rủi ro nào (trong danh sách trên) khiến chi phí thêm là đáng bỏ ra.</div>`,
  ]]);

const c5q = quiz('pss301-quiz-5', 'Quiz 5 — Supply risk & resilience|||Quiz 5 — Rủi ro cung ứng & khả năng phục hồi', [
  { id: 'q1', question: 'Vì sao lập bản đồ chuỗi cung KHÔNG nên chỉ dừng ở nhà cung cấp Tier 1?', options: ['Vì Tier 1 không quan trọng', 'Vì điểm hỏng thực tế thường nằm ở NCC phụ Tier 2/3 mà bên mua chưa từng làm việc trực tiếp', 'Vì Tier 2/3 không tồn tại trong thực tế', 'Vì luật pháp cấm làm việc với Tier 1'], correctIndex: 1, explanation: 'Nhiều điểm hỏng đơn lẻ (một mỏ, một nhà máy hoá chất) nằm sâu ở Tier 2/3, ngoài tầm nhìn trực tiếp nếu chỉ dừng ở Tier 1.' },
  { id: 'q2', question: 'Trên ma trận đánh giá rủi ro (xác suất x tác động), loại rủi ro nào cần kế hoạch giảm thiểu CHỦ ĐỘNG?', options: ['Xác suất thấp, tác động thấp', 'Xác suất cao, tác động cao', 'Chỉ rủi ro tài chính', 'Không loại nào cần kế hoạch'], correctIndex: 1, explanation: 'Rủi ro xác suất cao & tác động cao cần hành động chủ động; xác suất/tác động thấp chỉ cần theo dõi.' },
  { id: 'q3', question: 'Vì sao nhiều công ty sau các cú sốc gần đây (đại dịch, tắc kênh Suez) chấp nhận trả chi phí cao hơn cho NCC thứ hai ở xa về địa lý?', options: ['Vì giá rẻ hơn NCC hiện tại', 'Vì đó là yêu cầu pháp lý bắt buộc', 'Vì đó là hình thức "bảo hiểm" cho khả năng phục hồi, tránh điểm hỏng đơn lẻ', 'Vì NCC thứ hai luôn có chất lượng tốt hơn'], correctIndex: 2, explanation: 'Trả thêm cho NCC dự phòng là đánh đổi chi phí lấy khả năng phục hồi — bảo hiểm chống gián đoạn.' },
]);

const c6 = doc('pss301-6-1-total-cost-of-ownership-value', '6.1 — Total cost of ownership (TCO) & value creation|||6.1 — Tổng chi phí sở hữu (TCO) & tạo giá trị',
  'Cấu trúc TCO (giá mua, chi phí thủ đắc, chi phí sử dụng, chi phí cuối đời); should-cost modeling; value engineering/analysis; giá trị vượt ngoài tiết kiệm.',
  [[
    `<span class="eyebrow">PSS301 · Chapter 6 · Lesson 6.1</span>
<h2>Total cost of ownership (TCO) &amp; value creation</h2>
<h3>Why purchase price is not the real cost</h3>
<p>The sticker price of an item is often a small slice of what it actually costs the business to own and use it. <strong>Total cost of ownership (TCO)</strong> adds up every cost across the item's life:</p>
<pre><code>TCO structure:
 Purchase price          -> the unit price paid to the supplier
 + Acquisition costs      -> freight, duties/tariffs, inspection, order administration
 + Usage costs            -> installation, energy/consumables, maintenance, downtime, training
 + End-of-life costs      -> disposal, decommissioning, warranty/return handling
 = TOTAL COST OF OWNERSHIP
</code></pre>
<pre><code>Worked example — two suppliers for one machine:
                    Supplier A    Supplier B
 Purchase price        $50,000       $42,000   <- B looks cheaper on price
 Freight & duties        $2,000        $6,000   (B ships from further away)
 Energy (5-year use)     $8,000       $15,000   (B is less energy-efficient)
 Maintenance (5-year)    $6,000       $14,000   (B needs more service)
 Disposal                $1,000        $3,000
 --------------------------------------------------
 TOTAL COST OF OWNERSHIP $67,000       $80,000   <- A wins on TCO despite higher price
</code></pre>
<h3>Should-cost modeling</h3>
<p><strong>Should-cost modeling</strong> builds an independent estimate of what a supplier's price "should" be from first principles — raw material cost, labor, overhead, reasonable margin — used to challenge a quote that looks inflated, rather than accepting the supplier's number at face value.</p>
<h3>Value creation beyond savings</h3>
<p>A mature strategic sourcing function reports more than "cost saved." <strong>Value analysis / value engineering</strong> redesigns a specification to deliver the same function at lower cost (or more function at the same cost); other value contributions include faster time-to-market, quality improvement, and risk avoided — each measurable and reportable alongside cost.</p>
<div class="callout"><span class="badge">Exam tip</span> Given a TCO scenario, always compute the full total before declaring a winner — a lower purchase price is a trap if the question hands you usage or disposal costs too.</div>`,
    `<span class="eyebrow">PSS301 · Chương 6 · Bài 6.1</span>
<h2>Tổng chi phí sở hữu (TCO) &amp; tạo giá trị</h2>
<h3>Vì sao giá mua không phải chi phí thật</h3>
<p>Giá niêm yết của một mặt hàng thường chỉ là một phần nhỏ trong tổng chi phí thực tế doanh nghiệp phải trả để sở hữu và sử dụng nó. <strong>Tổng chi phí sở hữu (TCO)</strong> cộng dồn mọi chi phí xuyên suốt vòng đời mặt hàng:</p>
<pre><code>Cấu trúc TCO:
 Giá mua                 -> đơn giá trả cho nhà cung cấp
 + Chi phí thủ đắc         -> vận chuyển, thuế/thuế quan, kiểm định, hành chính đặt hàng
 + Chi phí sử dụng          -> lắp đặt, năng lượng/vật tư tiêu hao, bảo trì, ngừng máy, đào tạo
 + Chi phí cuối đời          -> thải bỏ, ngừng vận hành, xử lý bảo hành/trả hàng
 = TỔNG CHI PHÍ SỞ HỮU
</code></pre>
<pre><code>Ví dụ tính toán — hai NCC cho một máy:
                       NCC A        NCC B
 Giá mua                 50.000$      42.000$   <- B nhìn rẻ hơn về giá
 Vận chuyển & thuế         2.000$       6.000$   (B giao từ xa hơn)
 Năng lượng (5 năm dùng)   8.000$      15.000$   (B kém hiệu suất năng lượng)
 Bảo trì (5 năm)           6.000$      14.000$   (B cần bảo trì nhiều hơn)
 Thải bỏ                    1.000$       3.000$
 --------------------------------------------------
 TỔNG CHI PHÍ SỞ HỮU      67.000$      80.000$   <- A thắng về TCO dù giá cao hơn
</code></pre>
<h3>Should-cost modeling</h3>
<p><strong>Should-cost modeling</strong> dựng một ước lượng độc lập về giá một NCC "nên" ở mức nào, tính từ gốc — chi phí nguyên liệu, nhân công, chi phí gián tiếp, biên lợi nhuận hợp lý — dùng để phản biện một mức giá chào nhìn có vẻ bị thổi phồng, thay vì chấp nhận số của NCC ngay.</p>
<h3>Tạo giá trị vượt ngoài tiết kiệm</h3>
<p>Một chức năng tìm nguồn chiến lược trưởng thành báo cáo nhiều hơn "đã tiết kiệm được." <strong>Value analysis / value engineering</strong> thiết kế lại thông số kỹ thuật để đạt cùng chức năng với chi phí thấp hơn (hoặc nhiều chức năng hơn với cùng chi phí); các đóng góp giá trị khác gồm rút ngắn thời gian ra thị trường, cải thiện chất lượng, và rủi ro tránh được — mỗi loại đều đo được và báo cáo được cùng với chi phí.</p>
<div class="callout"><span class="badge">Mẹo thi</span> Với tình huống TCO, luôn tính đủ tổng trước khi tuyên bố người thắng — giá mua thấp hơn là một cái bẫy nếu đề bài cũng cho chi phí sử dụng hoặc thải bỏ.</div>`,
  ]]);

const c6q = quiz('pss301-quiz-6', 'Quiz 6 — TCO & value creation|||Quiz 6 — TCO & tạo giá trị', [
  { id: 'q1', question: 'TCO (tổng chi phí sở hữu) bao gồm những khoản nào NGOÀI giá mua?', options: ['Chỉ giá mua, không có gì khác', 'Chi phí thủ đắc, chi phí sử dụng, chi phí cuối đời', 'Chỉ chi phí vận chuyển', 'Chỉ lợi nhuận của nhà cung cấp'], correctIndex: 1, explanation: 'TCO = giá mua + chi phí thủ đắc + chi phí sử dụng + chi phí cuối đời, xuyên suốt vòng đời sản phẩm.' },
  { id: 'q2', question: '"Should-cost modeling" dùng để làm gì?', options: ['Chấp nhận ngay giá NCC chào', 'Dựng ước lượng độc lập về giá "nên" ở mức nào để phản biện giá chào có vẻ bị thổi phồng', 'Tính lương cho nhân viên thu mua', 'Chỉ áp dụng cho hàng phi vật chất'], correctIndex: 1, explanation: 'Should-cost modeling tính từ gốc (nguyên liệu, nhân công, chi phí gián tiếp, margin hợp lý) để thẩm định giá chào.' },
  { id: 'q3', question: 'Trong ví dụ TCO máy móc, vì sao NCC A (giá mua cao hơn) lại THẮNG về tổng chi phí sở hữu?', options: ['Vì giá mua luôn quyết định người thắng', 'Vì chi phí năng lượng, bảo trì và thải bỏ của B cao hơn, khiến tổng TCO của B vượt A', 'Vì NCC A có thương hiệu nổi tiếng hơn', 'Vì đề bài chọn A ngẫu nhiên'], correctIndex: 1, explanation: 'Cộng đủ các khoản (năng lượng, bảo trì, thải bỏ...) của B cao hơn A đủ để bù lại chênh lệch giá mua ban đầu.' },
]);

const c7 = doc('pss301-7-1-sustainable-procurement-esg', '7.1 — Sustainable procurement & ESG in the supply chain|||7.1 — Thu mua bền vững & ESG trong chuỗi cung',
  'Khung ESG trong tìm nguồn (môi trường, xã hội, quản trị); chuẩn thu mua bền vững (ISO 20400, UN Global Compact); rà soát ESG NCC & phát thải Scope 3.',
  [[
    `<span class="eyebrow">PSS301 · Chapter 7 · Lesson 7.1</span>
<h2>Sustainable procurement &amp; ESG in the supply chain</h2>
<h3>The ESG framework applied to sourcing</h3>
<pre><code>ESG in the supply chain:
 Environmental -> carbon footprint, waste, resource use, circular-economy design
 Social         -> labor practices, human rights, health & safety, modern-slavery risk
 Governance      -> anti-corruption, supplier code of conduct, transparent contracting
</code></pre>
<p>ESG in supply strategy is not a side project — a company's biggest environmental and social exposure usually sits in its <strong>supply chain</strong>, not its own operations, because suppliers are numerous, geographically spread, and harder to directly oversee.</p>
<h3>Standards &amp; frameworks</h3>
<ul>
<li><strong>ISO 20400</strong> — international guidance standard for sustainable procurement, covering governance, risk and supplier engagement.</li>
<li><strong>UN Global Compact</strong> — ten principles on human rights, labor, environment and anti-corruption that many large buyers require suppliers to commit to.</li>
<li><strong>Supplier code of conduct</strong> — the buyer's own written minimum standard, usually a condition of doing business.</li>
</ul>
<h3>Due diligence &amp; Scope 3 emissions</h3>
<p>ESG due diligence audits a supplier's actual practices (site visits, worker interviews, environmental permits) rather than trusting a signed code of conduct. A growing driver: <strong>Scope 3 emissions</strong> — greenhouse gas emissions from a company's supply chain (purchased goods, transportation) — for most manufacturers this is the largest share of their total carbon footprint, larger than their own factories (Scope 1/2), which makes supplier selection itself a climate-strategy decision.</p>
<div class="callout"><span class="badge">Exam tip</span> When a question asks "why is sustainable sourcing a strategic, not just a compliance, issue," anchor the answer in Scope 3 emissions and reputational/brand risk from supplier misconduct — not simply "it's good ethics."</div>`,
    `<span class="eyebrow">PSS301 · Chương 7 · Bài 7.1</span>
<h2>Thu mua bền vững &amp; ESG trong chuỗi cung</h2>
<h3>Khung ESG áp dụng vào tìm nguồn</h3>
<pre><code>ESG trong chuỗi cung:
 Môi trường (Environmental) -> phát thải carbon, chất thải, sử dụng tài nguyên, thiết kế kinh tế tuần hoàn
 Xã hội (Social)              -> điều kiện lao động, quyền con người, an toàn sức khoẻ, rủi ro lao động cưỡng bức
 Quản trị (Governance)         -> chống tham nhũng, bộ quy tắc ứng xử NCC, hợp đồng minh bạch
</code></pre>
<p>ESG trong chiến lược nguồn cung không phải một dự án phụ — phần lớn phơi nhiễm môi trường và xã hội của một công ty thường nằm ở <strong>chuỗi cung ứng</strong>, không phải hoạt động của chính nó, vì nhà cung cấp đông, trải rộng về địa lý, và khó giám sát trực tiếp.</p>
<h3>Chuẩn &amp; khung tham chiếu</h3>
<ul>
<li><strong>ISO 20400</strong> — chuẩn hướng dẫn quốc tế cho thu mua bền vững, bao trùm quản trị, rủi ro và gắn kết nhà cung cấp.</li>
<li><strong>UN Global Compact</strong> — mười nguyên tắc về quyền con người, lao động, môi trường và chống tham nhũng mà nhiều bên mua lớn yêu cầu nhà cung cấp cam kết.</li>
<li><strong>Bộ quy tắc ứng xử nhà cung cấp</strong> — chuẩn tối thiểu bằng văn bản của chính bên mua, thường là điều kiện để được hợp tác.</li>
</ul>
<h3>Rà soát due diligence &amp; phát thải Scope 3</h3>
<p>Rà soát ESG kiểm tra thực tế hoạt động của nhà cung cấp (thăm cơ sở, phỏng vấn công nhân, giấy phép môi trường) thay vì chỉ tin vào một bộ quy tắc đã ký. Một động lực ngày càng lớn: <strong>phát thải Scope 3</strong> — phát thải khí nhà kính từ chuỗi cung ứng của công ty (hàng hoá mua vào, vận chuyển) — với hầu hết nhà sản xuất, đây là phần lớn nhất trong tổng lượng phát thải carbon, lớn hơn cả nhà máy của chính họ (Scope 1/2), khiến việc chọn nhà cung cấp trở thành một quyết định chiến lược khí hậu.</p>
<div class="callout"><span class="badge">Mẹo thi</span> Khi đề hỏi "vì sao thu mua bền vững là vấn đề chiến lược, không chỉ tuân thủ," hãy neo câu trả lời vào phát thải Scope 3 và rủi ro danh tiếng/thương hiệu từ hành vi sai của nhà cung cấp — không chỉ dừng ở "vì đó là đạo đức tốt."</div>`,
  ]]);

const c7q = quiz('pss301-quiz-7', 'Quiz 7 — Sustainable procurement & ESG|||Quiz 7 — Thu mua bền vững & ESG', [
  { id: 'q1', question: 'Ba trụ cột của ESG trong chuỗi cung là gì?', options: ['Chi phí, chất lượng, thời gian', 'Môi trường, Xã hội, Quản trị', 'Giá, số lượng, nguồn', 'Cung, cầu, giá'], correctIndex: 1, explanation: 'ESG = Environmental (môi trường), Social (xã hội), Governance (quản trị).' },
  { id: 'q2', question: 'Vì sao "phát thải Scope 3" lại quan trọng trong chiến lược thu mua?', options: ['Vì Scope 3 luôn nhỏ hơn phát thải của nhà máy chính công ty', 'Vì với hầu hết nhà sản xuất, Scope 3 (từ chuỗi cung ứng) thường LỚN hơn phát thải của chính công ty (Scope 1/2)', 'Vì Scope 3 không liên quan đến nhà cung cấp', 'Vì luật pháp cấm đo Scope 3'], correctIndex: 1, explanation: 'Scope 3 (hàng mua vào, vận chuyển) thường là phần lớn nhất trong tổng phát thải, khiến chọn NCC là quyết định khí hậu chiến lược.' },
  { id: 'q3', question: 'Vì sao rà soát ESG cần đến DUE DILIGENCE (thăm cơ sở, phỏng vấn) thay vì chỉ dựa vào bộ quy tắc ứng xử đã ký?', options: ['Vì bộ quy tắc ứng xử không cần thiết', 'Vì một bộ quy tắc đã ký không chứng minh được thực tế hoạt động của NCC có tuân thủ hay không', 'Vì due diligence rẻ hơn ký quy tắc', 'Vì NCC luôn nói dối trong bộ quy tắc'], correctIndex: 1, explanation: 'Chữ ký trên quy tắc chỉ là cam kết trên giấy; due diligence kiểm tra thực tế để xác nhận tuân thủ.' },
]);

const c8 = doc('pss301-8-1-digital-transformation-measurement-future', '8.1 — Digital transformation, measurement & future direction|||8.1 — Chuyển đổi số thu mua, đo lường & định hướng tương lai',
  'Phân tích chi tiêu & tìm nguồn dự đoán bằng AI; giám sát rủi ro NCC theo thời gian thực; KPI chiến lược (cost avoidance, chỉ số đổi mới, chỉ số rủi ro); xu hướng tương lai.',
  [[
    `<span class="eyebrow">PSS301 · Chapter 8 · Lesson 8.1</span>
<h2>Digital transformation, measurement &amp; future direction</h2>
<h3>Digital tools reshaping strategic sourcing</h3>
<pre><code>Digital procurement stack:
 AI-driven spend analytics    -> auto-classify spend, spot savings opportunities at scale
 Predictive sourcing           -> forecast market price/risk trends before they hit
 Supplier risk monitoring       -> real-time signals (financial, news, ESG) on the whole supplier base
 Blockchain traceability        -> tamper-proof provenance across supply-chain tiers (Chapter 7 evidence)
</code></pre>
<p>These tools push strategic sourcing from a periodic (yearly) exercise toward a continuously monitored one — a supplier's financial distress or a geopolitical shock can be flagged in near real time instead of discovered at the next contract renewal.</p>
<h3>Strategic-level KPIs</h3>
<p>Strategic sourcing is measured differently from operational procurement (which tracks cycle time and PO compliance). Strategic KPIs answer "did our supply strategy actually create advantage":</p>
<pre><code>Strategic sourcing KPIs:
 Cost avoidance (vs. savings)  -> cost that WOULD have happened but was prevented (e.g. price rise avoided)
 Supplier innovation index      -> value/ideas contributed by strategic suppliers, tracked over time
 Risk exposure index            -> weighted score of unmitigated risk across critical categories
 Sustainability / ESG score     -> supplier ESG performance trend across the strategic supplier base
 Category maturity              -> how many categories have a documented, current category strategy
</code></pre>
<h3>Where strategic sourcing is heading</h3>
<p>Emerging directions include <strong>procurement control towers</strong> (a single dashboard fusing spend, risk and sustainability data across categories), increasing use of <strong>generative AI</strong> to draft first-pass category strategies and negotiation playbooks, and a continued shift of the CPO's mandate from cost control toward being a co-owner of the company's growth, risk and sustainability strategy.</p>
<div class="callout"><span class="badge">Closing the loop</span> This course's eight chapters form one system: strategic role sets the ambition, sourcing strategy and category management set the plan, supplier collaboration and resilience execute it safely, TCO and ESG make the value/risk visible, and digital tools plus strategic KPIs make the whole loop measurable and continuously improvable.</div>`,
    `<span class="eyebrow">PSS301 · Chương 8 · Bài 8.1</span>
<h2>Chuyển đổi số thu mua, đo lường &amp; định hướng tương lai</h2>
<h3>Công cụ số định hình lại tìm nguồn chiến lược</h3>
<pre><code>Bộ công cụ thu mua số:
 Phân tích chi tiêu bằng AI       -> tự phân loại chi tiêu, phát hiện cơ hội tiết kiệm ở quy mô lớn
 Tìm nguồn dự đoán                 -> dự báo xu hướng giá/rủi ro thị trường trước khi nó xảy ra
 Giám sát rủi ro NCC theo thời gian thực -> tín hiệu thời gian thực (tài chính, tin tức, ESG) cho cả cơ sở NCC
 Truy xuất bằng blockchain          -> nguồn gốc chống giả mạo qua các tầng chuỗi cung (làm chứng cho Chương 7)
</code></pre>
<p>Các công cụ này đẩy tìm nguồn chiến lược từ một hoạt động định kỳ (hằng năm) sang một hoạt động được theo dõi LIÊN TỤC — khó khăn tài chính của một NCC hay một cú sốc địa chính trị có thể được cảnh báo gần thời gian thực thay vì chỉ phát hiện ở lần gia hạn hợp đồng kế tiếp.</p>
<h3>KPI ở cấp chiến lược</h3>
<p>Tìm nguồn chiến lược được đo khác với thu mua vận hành (theo dõi cycle time và tuân thủ PO). KPI chiến lược trả lời câu hỏi "chiến lược nguồn cung của ta có thực sự tạo lợi thế không":</p>
<pre><code>KPI tìm nguồn chiến lược:
 Cost avoidance (chi phí tránh được, khác tiết kiệm) -> chi phí LẼ RA đã xảy ra nhưng được ngăn chặn (vd tránh được tăng giá)
 Chỉ số đổi mới từ NCC          -> giá trị/ý tưởng do NCC chiến lược đóng góp, theo dõi theo thời gian
 Chỉ số phơi nhiễm rủi ro        -> điểm có trọng số của rủi ro chưa được giảm thiểu trên các category quan trọng
 Điểm bền vững / ESG             -> xu hướng hiệu suất ESG của NCC trên toàn cơ sở NCC chiến lược
 Độ chín của category            -> bao nhiêu category có chiến lược category bằng văn bản, còn hiệu lực
</code></pre>
<h3>Tìm nguồn chiến lược đang hướng về đâu</h3>
<p>Các xu hướng mới nổi gồm <strong>control tower thu mua</strong> (một bảng điều khiển duy nhất hợp nhất dữ liệu chi tiêu, rủi ro và bền vững trên mọi category), việc dùng ngày càng nhiều <strong>AI tạo sinh</strong> để soạn bản nháp đầu tiên cho chiến lược category và playbook đàm phán, và một dịch chuyển liên tục trong nhiệm vụ của CPO — từ kiểm soát chi phí sang đồng sở hữu chiến lược tăng trưởng, rủi ro và bền vững của công ty.</p>
<div class="callout"><span class="badge">Khép vòng</span> Tám chương của môn này tạo thành một hệ thống: vai trò chiến lược đặt tham vọng, chiến lược tìm nguồn và category management đặt kế hoạch, hợp tác NCC và khả năng phục hồi thực thi kế hoạch một cách an toàn, TCO và ESG làm hiển lộ giá trị/rủi ro, và công cụ số cùng KPI chiến lược làm cho toàn vòng lặp đo lường được và cải tiến liên tục.</div>`,
  ]]);

const c8q = quiz('pss301-quiz-8', 'Quiz 8 — Digital transformation & strategic KPIs|||Quiz 8 — Chuyển đổi số & KPI chiến lược', [
  { id: 'q1', question: 'KPI "cost avoidance" (chi phí tránh được) khác "cost savings" (tiết kiệm chi phí) ở điểm nào?', options: ['Hai khái niệm hoàn toàn giống nhau', 'Cost avoidance đo chi phí LẼ RA đã xảy ra nhưng được ngăn chặn, không phải mức giảm so với chi phí đang trả', 'Cost avoidance chỉ áp dụng cho hàng nhập khẩu', 'Cost savings luôn lớn hơn cost avoidance'], correctIndex: 1, explanation: 'Cost avoidance là chi phí tránh được (vd ngăn một đợt tăng giá), khác với savings là mức giảm thực tế so với chi phí hiện tại.' },
  { id: 'q2', question: 'Giám sát rủi ro nhà cung cấp theo thời gian thực (thay vì chỉ đánh giá định kỳ hằng năm) mang lại lợi ích chính nào?', options: ['Không có lợi ích gì khác biệt', 'Phát hiện khó khăn tài chính hoặc cú sốc địa chính trị của NCC gần thời gian thực, thay vì chỉ biết ở lần gia hạn hợp đồng', 'Giúp giảm giá mua ngay lập tức', 'Loại bỏ hoàn toàn nhu cầu đánh giá NCC'], correctIndex: 1, explanation: 'Giám sát liên tục giúp cảnh báo sớm rủi ro NCC, đẩy tìm nguồn chiến lược từ định kỳ sang theo dõi liên tục.' },
  { id: 'q3', question: 'Xu hướng "procurement control tower" đề cập đến điều gì?', options: ['Một tháp vật lý để giám sát nhà kho', 'Một bảng điều khiển duy nhất hợp nhất dữ liệu chi tiêu, rủi ro và bền vững trên mọi category', 'Một chức danh mới thay cho CPO', 'Một loại hợp đồng thu mua'], correctIndex: 1, explanation: 'Control tower là dashboard hợp nhất dữ liệu chi tiêu/rủi ro/bền vững xuyên category, hỗ trợ ra quyết định chiến lược.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'PSS301',
    slug: 'pss301-purchasing-and-supply-strategychien-luoc-quan-tri-nguon-cung-trong-thu-mua',
    title: 'Purchasing and Supply Strategy',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/PSS301.webp',
    shortDescription: 'Strategic purchasing & supply: sourcing strategy (make-vs-buy, single/multiple/global), category management & the extended Kraljic matrix, strategic supplier collaboration, risk & resilience, TCO, sustainable/ESG sourcing, digital transformation.|||Chiến lược thu mua & nguồn cung: chiến lược tìm nguồn (make-vs-buy, đơn/đa/toàn cầu), category management & Kraljic mở rộng, hợp tác chiến lược với NCC, rủi ro & khả năng phục hồi, TCO, thu mua bền vững/ESG, chuyển đổi số thu mua.',
    description: 'Môn <strong>PSS301 — Purchasing and Supply Strategy</strong> (kỳ 5, khối Quản trị Kinh doanh) dạy cách xây <strong>chiến lược nguồn cung dài hạn</strong> cho toàn tổ chức — khác với thu mua vận hành hằng ngày. Từ <strong>vai trò chiến lược của thu mua trong lợi thế cạnh tranh</strong> → <strong>chiến lược tìm nguồn</strong> (make-vs-buy, đơn/đa/toàn cầu) → <strong>category management &amp; ma trận Kraljic mở rộng</strong> (Supplier Preferencing Matrix) → <strong>chiến lược cơ sở nhà cung cấp &amp; hợp tác chiến lược</strong> (ESI, joint business plan) → <strong>quản trị rủi ro chuỗi cung &amp; khả năng phục hồi</strong> → <strong>tổng chi phí sở hữu (TCO) &amp; tạo giá trị</strong> → <strong>thu mua bền vững &amp; ESG</strong> → <strong>chuyển đổi số thu mua, đo lường &amp; định hướng tương lai</strong>. Bám giáo trình tham khảo Monczka/Handfield và Nicoletti cùng khung CIPS Advanced, song ngữ, có khung phân tích, ví dụ tính toán và quiz mỗi chương.',
    whatYouLearn: 'Vai trò chiến lược của thu mua & mô hình định vị Reck & Long; make-vs-buy; đơn/đa/song nguồn & tìm nguồn toàn cầu vs trong nước; category management & lộ trình chiến lược category; ma trận Kraljic mở rộng với Supplier Preferencing Matrix; hợp lý hoá & phân tầng cơ sở nhà cung cấp; Early Supplier Involvement (ESI) & quản trị đối tác chiến lược; nhóm rủi ro cung ứng, bản đồ chuỗi cung đa tầng, chiến lược khả năng phục hồi; cấu trúc TCO & should-cost modeling; value engineering; khung ESG (môi trường/xã hội/quản trị), ISO 20400, phát thải Scope 3; công cụ số hoá thu mua & KPI chiến lược (cost avoidance, chỉ số đổi mới, chỉ số rủi ro).',
    requirements: 'Không yêu cầu kiến thức chuyên sâu trước đó; nên đã quen khái niệm cơ bản về thu mua/chuỗi cung ứng (vd PCM301). Xem điều kiện tiên quyết chính thức trong khung chương trình khối Quản trị Kinh doanh trên FLM.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình FLM, sách Monczka/Handfield & Nicoletti, CIPS Advanced, tài liệu miễn phí, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Thu mua vận hành vs chiến lược, mô hình Reck & Long, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Vai trò chiến lược & lợi thế cạnh tranh|||Chapter 1 — Strategic role & competitive advantage', description: 'Dẫn đầu chi phí vs khác biệt hoá, ma trận đóng góp thu mua.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Chiến lược tìm nguồn|||Chapter 2 — Sourcing strategy', description: 'Make-vs-buy, đơn/đa/song nguồn, trong nước vs toàn cầu.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Category management & Kraljic mở rộng|||Chapter 3 — Category management & extended Kraljic', description: 'Lộ trình chiến lược category, Supplier Preferencing Matrix.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Cơ sở NCC & hợp tác chiến lược|||Chapter 4 — Supplier base & strategic collaboration', description: 'Hợp lý hoá, phân tầng NCC, ESI, quản trị đối tác.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Rủi ro chuỗi cung & khả năng phục hồi|||Chapter 5 — Supply risk & resilience', description: 'Nhóm rủi ro, bản đồ chuỗi cung, chiến lược phục hồi.', lessons: [c5, c5q] },
    { title: 'Chương 6 — TCO & tạo giá trị|||Chapter 6 — Total cost of ownership & value creation', description: 'Cấu trúc TCO, should-cost modeling, value engineering.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Thu mua bền vững & ESG|||Chapter 7 — Sustainable procurement & ESG', description: 'Khung ESG, ISO 20400, due diligence, Scope 3.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Chuyển đổi số & định hướng tương lai|||Chapter 8 — Digital transformation & future direction', description: 'Công cụ số, KPI chiến lược, control tower.', lessons: [c8, c8q] },
  ],
};
