/**
 * PCM301 — Procurement Management (Quản trị Thu mua). Giáo trình FLM (khối
 * Quản trị Kinh doanh — BBA), trích dẫn: "Purchasing and Supply Chain
 * Management" (Monczka et al.), "Procurement and Supply Chain Management"
 * (Baily/Farmer et al.), CIPS. Không upload PDF, chỉ trích dẫn tên sách/tổ
 * chức. 8 chương: tổng quan & vai trò chiến lược → quy trình P2P → phân tích
 * chi tiêu & Kraljic matrix → tìm nguồn & đánh giá NCC (RFx) → đàm phán &
 * hợp đồng → SRM & hiệu suất → bền vững/đạo đức/rủi ro → số hoá & KPI.
 * Song ngữ + ví dụ + quiz. Giữ NGUYÊN slug/semester/thumb.
 * ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('pcm301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình FLM, sách tham khảo (Monczka; Baily/Farmer), CIPS, tài liệu miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">PCM301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Procurement Management — strategic sourcing, purchase-to-pay, negotiation, supplier relationship management, sustainability and digital procurement — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources plus the standard reference texts.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for PCM301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books (citation only, not for download here)</h3>
<ul>
<li><em>Purchasing and Supply Chain Management</em> — Robert M. Monczka, Robert B. Handfield, Larry C. Giunipero, James L. Patterson.</li>
<li><em>Procurement and Supply Chain Management</em> — Peter Baily, David Farmer, David Jessop, David Jones (and later editions with Barry Crocker).</li>
<li><a href="https://www.cips.org/" target="_blank" rel="noopener">CIPS — Chartered Institute of Procurement &amp; Supply</a> — professional body: knowledge hub, ethics code, qualifications.</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.cips.org/knowledge/" target="_blank" rel="noopener">CIPS Knowledge Hub</a> — free procurement guides &amp; case studies.</li>
<li><a href="https://www.ism.ws/" target="_blank" rel="noopener">Institute for Supply Management (ISM)</a> — profession standards &amp; research.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@CIPSprocurement" target="_blank" rel="noopener">CIPS</a> — procurement &amp; supply concepts explained.</li>
<li><a href="https://www.youtube.com/results?search_query=supply+chain+management+lecture" target="_blank" rel="noopener">University supply chain management lectures</a> — search for open courseware on procurement &amp; SCM.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.investopedia.com/terms/k/kraljic-matrix.asp" target="_blank" rel="noopener">Kraljic Matrix reference</a> — spend categorization framework.</li>
<li>Spreadsheet templates for weighted supplier scoring, RFQ comparison and Kraljic mapping — build your own using the examples in Chapters 3–4.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — the 5 rights of procurement, the purchase-to-pay (P2P) cycle, spend analysis and the Kraljic matrix.</li>
<li><strong>Practice</strong> — draft an RFQ, build a weighted supplier scorecard, map one purchase category onto the Kraljic matrix.</li>
<li><strong>Go deeper</strong> — negotiation preparation (BATNA), contract types, supplier relationship management (SRM).</li>
<li><strong>Job-ready</strong> — sustainable/ethical sourcing, supply risk management, e-procurement platforms and procurement KPIs.</li>
</ol></div>`,
    `<span class="eyebrow">PCM301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Quản trị Thu mua — tìm nguồn chiến lược, quy trình purchase-to-pay, đàm phán, quản trị quan hệ nhà cung cấp, bền vững và thu mua số — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp cùng các sách giáo trình chuẩn.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của PCM301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo (chỉ trích dẫn, không tải ở đây)</h3>
<ul>
<li><em>Purchasing and Supply Chain Management</em> — Robert M. Monczka, Robert B. Handfield, Larry C. Giunipero, James L. Patterson.</li>
<li><em>Procurement and Supply Chain Management</em> — Peter Baily, David Farmer, David Jessop, David Jones (bản sau có thêm Barry Crocker).</li>
<li><a href="https://www.cips.org/" target="_blank" rel="noopener">CIPS — Chartered Institute of Procurement &amp; Supply</a> — hiệp hội nghề: kho kiến thức, bộ quy tắc đạo đức, chứng chỉ.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.cips.org/knowledge/" target="_blank" rel="noopener">CIPS Knowledge Hub</a> — hướng dẫn &amp; case study thu mua miễn phí.</li>
<li><a href="https://www.ism.ws/" target="_blank" rel="noopener">Institute for Supply Management (ISM)</a> — chuẩn nghề &amp; nghiên cứu.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@CIPSprocurement" target="_blank" rel="noopener">CIPS</a> — giải thích khái niệm thu mua &amp; cung ứng.</li>
<li><a href="https://www.youtube.com/results?search_query=supply+chain+management+lecture" target="_blank" rel="noopener">Bài giảng SCM của các trường đại học</a> — tìm khoá học mở về thu mua &amp; SCM.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.investopedia.com/terms/k/kraljic-matrix.asp" target="_blank" rel="noopener">Tài liệu về Kraljic Matrix</a> — khung phân loại chi tiêu.</li>
<li>Bảng tính mẫu để chấm điểm NCC theo trọng số, so sánh RFQ và vẽ ma trận Kraljic — tự dựng theo ví dụ ở Chương 3–4.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — 5 đúng của thu mua, vòng đời purchase-to-pay (P2P), phân tích chi tiêu và ma trận Kraljic.</li>
<li><strong>Luyện tập</strong> — soạn một RFQ, dựng bảng chấm điểm NCC theo trọng số, đặt một nhóm hàng vào ma trận Kraljic.</li>
<li><strong>Đào sâu</strong> — chuẩn bị đàm phán (BATNA), các loại hợp đồng, quản trị quan hệ nhà cung cấp (SRM).</li>
<li><strong>Sẵn sàng đi làm</strong> — thu mua bền vững/đạo đức, quản trị rủi ro cung ứng, nền tảng e-procurement và KPI thu mua.</li>
</ol></div>`,
  ]]);

const intro = doc('pcm301-0-1-overview', 'Course overview: Procurement Management|||Tổng quan: Quản trị Thu mua',
  'Thu mua khác mua sắm/chuỗi cung ứng ra sao; vai trò chiến lược; lộ trình 8 chương: tổng quan → P2P → chi tiêu/Kraljic → tìm nguồn/RFx → đàm phán/hợp đồng → SRM → bền vững/rủi ro → số hoá/KPI.',
  [[
    `<span class="eyebrow">PCM301 · Lesson 0.1 · Overview</span>
<h2>Procurement Management</h2>
<p class="lead">This course teaches how organizations <strong>acquire the goods and services they need</strong> — from a single purchase requisition to a multi-year strategic supplier partnership. You will learn the <strong>procure-to-pay process</strong>, how to analyze and categorize spend, how to source and evaluate suppliers, how to negotiate and structure contracts, and how to manage supplier relationships, risk, ethics and digital procurement tools.</p>
<h3>Purchasing vs. procurement vs. supply chain management</h3>
<ul>
<li><strong>Purchasing</strong> — the transactional act of buying: raising a purchase order, placing it, paying the invoice.</li>
<li><strong>Procurement</strong> — the broader, strategic function: identifying needs, sourcing suppliers, negotiating, managing relationships and risk — purchasing is one step inside it.</li>
<li><strong>Supply chain management (SCM)</strong> — the widest scope: procurement plus logistics, manufacturing, inventory and distribution, end to end.</li>
</ul>
<h3>Why procurement is strategic, not clerical</h3>
<p>For most companies, purchased goods and services are the single largest cost line — often 50–80% of revenue in manufacturing. A 1% reduction in procurement cost can have the same bottom-line effect as a much larger increase in sales. Beyond cost, procurement also manages <strong>supply risk</strong>, drives <strong>supplier-led innovation</strong>, and increasingly owns the company's <strong>sustainability and ethics</strong> exposure in its supply base.</p>
<h3>Roadmap</h3>
<p>Overview &amp; strategic role → purchase-to-pay (P2P) process → spend analysis &amp; the Kraljic matrix → sourcing &amp; supplier evaluation (RFx) → negotiation &amp; contracts → supplier relationship management (SRM) → sustainable procurement, ethics &amp; risk → digital procurement &amp; KPIs. Bilingual, with worked examples and quizzes each chapter.</p>`,
    `<span class="eyebrow">PCM301 · Bài 0.1 · Tổng quan</span>
<h2>Quản trị Thu mua</h2>
<p class="lead">Môn này dạy cách một tổ chức <strong>mua được hàng hoá &amp; dịch vụ mình cần</strong> — từ một phiếu yêu cầu mua hàng đơn lẻ đến một quan hệ đối tác chiến lược với nhà cung cấp kéo dài nhiều năm. Bạn sẽ học <strong>quy trình procure-to-pay</strong>, cách phân tích và phân loại chi tiêu, cách tìm nguồn và đánh giá nhà cung cấp, cách đàm phán và dựng hợp đồng, và cách quản trị quan hệ nhà cung cấp, rủi ro, đạo đức và công cụ thu mua số.</p>
<h3>Mua sắm (purchasing) vs. thu mua (procurement) vs. quản trị chuỗi cung ứng (SCM)</h3>
<ul>
<li><strong>Mua sắm (purchasing)</strong> — hành động giao dịch: lập đơn mua hàng, đặt hàng, thanh toán hoá đơn.</li>
<li><strong>Thu mua (procurement)</strong> — chức năng chiến lược rộng hơn: xác định nhu cầu, tìm nguồn nhà cung cấp, đàm phán, quản trị quan hệ và rủi ro — mua sắm chỉ là một bước bên trong.</li>
<li><strong>Quản trị chuỗi cung ứng (SCM)</strong> — phạm vi rộng nhất: thu mua cộng thêm logistics, sản xuất, tồn kho và phân phối, từ đầu đến cuối.</li>
</ul>
<h3>Vì sao thu mua là chiến lược, không phải việc hành chính</h3>
<p>Với hầu hết doanh nghiệp, hàng hoá &amp; dịch vụ mua vào là khoản chi phí lớn nhất — thường chiếm 50–80% doanh thu trong sản xuất. Giảm 1% chi phí thu mua có thể tác động lên lợi nhuận tương đương với việc tăng doanh số nhiều hơn thế rất nhiều. Ngoài chi phí, thu mua còn quản lý <strong>rủi ro cung ứng</strong>, thúc đẩy <strong>đổi mới từ nhà cung cấp</strong>, và ngày càng chịu trách nhiệm về <strong>bền vững &amp; đạo đức</strong> trong toàn bộ mạng lưới cung ứng của công ty.</p>
<h3>Lộ trình</h3>
<p>Tổng quan &amp; vai trò chiến lược → quy trình purchase-to-pay (P2P) → phân tích chi tiêu &amp; ma trận Kraljic → tìm nguồn &amp; đánh giá nhà cung cấp (RFx) → đàm phán &amp; hợp đồng → quản trị quan hệ nhà cung cấp (SRM) → thu mua bền vững, đạo đức &amp; rủi ro → thu mua số &amp; KPI. Song ngữ, có ví dụ mẫu và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('pcm301-1-1-overview-strategic-role', '1.1 — Procurement overview & strategic role|||1.1 — Tổng quan thu mua & vai trò chiến lược',
  'Định nghĩa thu mua; "5 đúng"; tiến hoá từ mua sắm giao dịch → tìm nguồn chiến lược → tích hợp chuỗi cung ứng; đóng góp của thu mua vào chiến lược công ty.',
  [[
    `<span class="eyebrow">PCM301 · Chapter 1 · Lesson 1.1</span>
<h2>Procurement overview &amp; strategic role</h2>
<h3>The "5 Rights" of procurement</h3>
<p>Classic procurement theory defines the objective as acquiring:</p>
<pre><code>The 5 Rights of Procurement:
 1. Right QUALITY   - meets the specification, no more, no less
 2. Right QUANTITY  - matches actual demand, avoids excess stock
 3. Right PRICE     - the best total cost achievable, not just the lowest sticker price
 4. Right TIME       - delivered when needed, neither late nor wastefully early
 5. Right SOURCE     - a supplier that is reliable, capable and appropriate for the item
</code></pre>
<h3>From transactional buying to strategic sourcing</h3>
<ul>
<li><strong>Transactional / clerical buying</strong> — react to requisitions, place orders, chase deliveries. Little supplier selection, little planning.</li>
<li><strong>Strategic sourcing</strong> — proactively analyze categories of spend, run competitive sourcing events, build supplier relationships, and align purchases with company strategy.</li>
<li><strong>Supply chain integration</strong> — procurement collaborates cross-functionally (R&amp;D, operations, finance) and with suppliers on forecasting, cost reduction and innovation, not just at the point of order.</li>
</ul>
<h3>Why it matters to the whole business</h3>
<p>Procurement's leverage over cost, quality, risk and sustainability means procurement decisions show up in a company's product cost, its exposure to supply disruption, and its brand reputation (e.g. a supplier's labor practices or environmental record). A modern Chief Procurement Officer (CPO) sits at the same table as the CFO and COO.</p>
<div class="callout"><span class="badge">Exam tip</span> When asked to "justify the strategic importance of procurement," anchor the answer in cost leverage (spend as % of revenue), risk exposure, and supplier-enabled innovation — not just "it saves money."</div>`,
    `<span class="eyebrow">PCM301 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan thu mua &amp; vai trò chiến lược</h2>
<h3>"5 đúng" của thu mua</h3>
<p>Lý thuyết thu mua cổ điển định nghĩa mục tiêu là mua được:</p>
<pre><code>5 đúng của thu mua:
 1. Đúng CHẤT LƯỢNG  - đạt đúng thông số kỹ thuật, không hơn không kém
 2. Đúng SỐ LƯỢNG    - khớp nhu cầu thực tế, tránh dư tồn kho
 3. Đúng GIÁ         - tổng chi phí tốt nhất có thể, không chỉ là giá niêm yết thấp nhất
 4. Đúng THỜI ĐIỂM   - giao đúng lúc cần, không trễ và không sớm gây lãng phí
 5. Đúng NGUỒN       - nhà cung cấp đáng tin cậy, đủ năng lực và phù hợp với món hàng
</code></pre>
<h3>Từ mua sắm giao dịch đến tìm nguồn chiến lược</h3>
<ul>
<li><strong>Mua sắm hành chính / giao dịch</strong> — phản ứng theo phiếu yêu cầu, đặt hàng, đôn đốc giao hàng. Ít chọn lọc nhà cung cấp, ít lập kế hoạch.</li>
<li><strong>Tìm nguồn chiến lược (strategic sourcing)</strong> — chủ động phân tích từng nhóm chi tiêu, tổ chức các đợt tìm nguồn cạnh tranh, xây quan hệ nhà cung cấp, và gắn việc mua với chiến lược công ty.</li>
<li><strong>Tích hợp chuỗi cung ứng</strong> — thu mua phối hợp liên bộ phận (R&amp;D, vận hành, tài chính) và với nhà cung cấp về dự báo, giảm chi phí và đổi mới, không chỉ tại điểm đặt hàng.</li>
</ul>
<h3>Vì sao quan trọng với toàn doanh nghiệp</h3>
<p>Đòn bẩy của thu mua lên chi phí, chất lượng, rủi ro và bền vững nghĩa là các quyết định thu mua thể hiện thẳng vào chi phí sản phẩm, mức phơi nhiễm rủi ro gián đoạn cung ứng, và danh tiếng thương hiệu (ví dụ: điều kiện lao động hay hồ sơ môi trường của nhà cung cấp). Một Giám đốc Thu mua (CPO) hiện đại ngồi cùng bàn với CFO và COO.</p>
<div class="callout"><span class="badge">Mẹo thi</span> Khi đề yêu cầu "chứng minh vai trò chiến lược của thu mua," hãy neo câu trả lời vào đòn bẩy chi phí (chi tiêu tính theo % doanh thu), mức phơi nhiễm rủi ro, và đổi mới nhờ nhà cung cấp — không chỉ dừng ở "tiết kiệm tiền."</div>`,
  ]]);

const c1q = quiz('pcm301-quiz-1', 'Quiz 1 — Overview & strategic role|||Quiz 1 — Tổng quan & vai trò chiến lược', [
  { id: 'q1', question: 'Cụm "5 đúng" của thu mua KHÔNG bao gồm yếu tố nào?', options: ['Đúng chất lượng', 'Đúng số lượng', 'Đúng thương hiệu', 'Đúng nguồn'], correctIndex: 2, explanation: '5 đúng: chất lượng, số lượng, giá, thời điểm, nguồn — không có "thương hiệu".' },
  { id: 'q2', question: 'Sự khác biệt chính giữa "mua sắm" (purchasing) và "thu mua" (procurement) là?', options: ['Không khác gì cả', 'Mua sắm rộng hơn thu mua', 'Thu mua là chức năng chiến lược rộng hơn, mua sắm là bước giao dịch bên trong nó', 'Thu mua chỉ áp dụng cho hàng nhập khẩu'], correctIndex: 2, explanation: 'Purchasing là hành động đặt hàng/trả tiền; procurement bao trùm cả tìm nguồn, đàm phán, quản trị rủi ro & quan hệ.' },
  { id: 'q3', question: 'Vì sao thu mua được xem là chức năng CHIẾN LƯỢC?', options: ['Vì thu mua chỉ xử lý giấy tờ', 'Vì chi tiêu mua vào thường chiếm tỉ trọng lớn doanh thu, ảnh hưởng chi phí, rủi ro & đổi mới', 'Vì thu mua không liên quan tài chính công ty', 'Vì thu mua chỉ làm việc với một nhà cung cấp duy nhất'], correctIndex: 1, explanation: 'Chi tiêu mua vào lớn (50–80% doanh thu ở sản xuất) nên đòn bẩy chi phí/rủi ro/đổi mới của thu mua rất lớn.' },
]);

const c2 = doc('pcm301-2-1-p2p-process', '2.1 — The procurement process (P2P: purchase-to-pay)|||2.1 — Quy trình thu mua (P2P: purchase-to-pay)',
  'Các bước P2P: nhận diện nhu cầu → phiếu yêu cầu → phê duyệt → đặt hàng (PO) → nhận hàng (GRN) → khớp hoá đơn (3-way match) → thanh toán; vai trò kiểm soát nội bộ.',
  [[
    `<span class="eyebrow">PCM301 · Chapter 2 · Lesson 2.1</span>
<h2>The procurement process (P2P: purchase-to-pay)</h2>
<p>The <strong>purchase-to-pay (P2P)</strong> cycle is the operational backbone of procurement — the end-to-end flow from recognizing a need to paying the supplier.</p>
<pre><code>Purchase-to-Pay (P2P) flow:
 1. Need identification    -> a department identifies a need for goods/services
 2. Purchase requisition   -> internal request, states what/how much/when
 3. Approval               -> authorized approver signs off (budget check)
 4. Sourcing / PO creation -> select supplier, issue a Purchase Order (PO)
 5. Order placement        -> PO sent to supplier, supplier confirms
 6. Goods/service receipt  -> Goods Receipt Note (GRN) recorded on arrival
 7. Invoice matching       -> 3-way match: PO vs GRN vs Invoice
 8. Payment                -> invoice approved & paid per agreed terms
</code></pre>
<h3>The 3-way match — the core financial control</h3>
<p>Before paying any invoice, procurement (or accounts payable) checks that three documents agree: the <strong>Purchase Order</strong> (what was ordered, at what price), the <strong>Goods Receipt Note</strong> (what actually arrived), and the <strong>Invoice</strong> (what the supplier is billing for). A mismatch — wrong quantity, wrong price, goods never received — blocks payment until resolved. This single control prevents overpayment, duplicate payment and fraud.</p>
<h3>Requisition vs. purchase order</h3>
<ul>
<li><strong>Purchase requisition (PR)</strong> — an internal document; a request, not yet a commitment to a supplier.</li>
<li><strong>Purchase order (PO)</strong> — a legally binding commercial document sent to the supplier once approved; it becomes the contract for that transaction.</li>
</ul>
<div class="callout"><span class="badge">Common failure mode</span> "Maverick spend" — purchases made outside the approved P2P process (no PR, no PO) — breaks the 3-way match, hides spend from analysis, and is one of the most common audit findings in procurement.</div>`,
    `<span class="eyebrow">PCM301 · Chương 2 · Bài 2.1</span>
<h2>Quy trình thu mua (P2P: purchase-to-pay)</h2>
<p>Vòng đời <strong>purchase-to-pay (P2P)</strong> là xương sống vận hành của thu mua — luồng từ đầu đến cuối, từ lúc nhận diện nhu cầu đến lúc thanh toán cho nhà cung cấp.</p>
<pre><code>Luồng Purchase-to-Pay (P2P):
 1. Nhận diện nhu cầu       -> một bộ phận xác định cần mua hàng hoá/dịch vụ
 2. Phiếu yêu cầu mua hàng  -> yêu cầu nội bộ, ghi rõ mua gì/bao nhiêu/khi nào
 3. Phê duyệt               -> người có quyền ký duyệt (kiểm tra ngân sách)
 4. Tìm nguồn / lập PO      -> chọn nhà cung cấp, phát hành Purchase Order (PO)
 5. Đặt hàng                -> gửi PO cho nhà cung cấp, NCC xác nhận
 6. Nhận hàng/dịch vụ       -> ghi Goods Receipt Note (GRN, phiếu nhận hàng) khi hàng đến
 7. Khớp hoá đơn            -> khớp 3 chiều (3-way match): PO vs GRN vs Hoá đơn
 8. Thanh toán               -> hoá đơn được duyệt & trả theo điều khoản đã thoả thuận
</code></pre>
<h3>Khớp 3 chiều — kiểm soát tài chính then chốt</h3>
<p>Trước khi trả bất kỳ hoá đơn nào, thu mua (hoặc kế toán công nợ) kiểm tra ba tài liệu có khớp nhau: <strong>Purchase Order</strong> (đã đặt gì, giá bao nhiêu), <strong>Goods Receipt Note</strong> (thực tế đã nhận gì), và <strong>Hoá đơn</strong> (nhà cung cấp đang tính tiền cho gì). Nếu lệch — sai số lượng, sai giá, hàng chưa nhận — thanh toán bị chặn lại cho đến khi giải quyết. Một kiểm soát duy nhất này ngăn được trả thừa, trả trùng và gian lận.</p>
<h3>Phiếu yêu cầu vs. đơn đặt hàng</h3>
<ul>
<li><strong>Phiếu yêu cầu mua hàng (PR)</strong> — tài liệu nội bộ; là một yêu cầu, chưa phải cam kết với nhà cung cấp.</li>
<li><strong>Đơn đặt hàng (PO)</strong> — tài liệu thương mại có ràng buộc pháp lý gửi cho nhà cung cấp sau khi được duyệt; nó trở thành hợp đồng cho giao dịch đó.</li>
</ul>
<div class="callout"><span class="badge">Lỗi thường gặp</span> "Maverick spend" — mua hàng ngoài quy trình P2P được duyệt (không có PR, không có PO) — làm hỏng khớp 3 chiều, che giấu chi tiêu khỏi phân tích, và là một trong những phát hiện kiểm toán phổ biến nhất trong thu mua.</div>`,
  ]]);

const c2q = quiz('pcm301-quiz-2', 'Quiz 2 — P2P process|||Quiz 2 — Quy trình P2P', [
  { id: 'q1', question: 'Trong "3-way match", ba tài liệu được đối chiếu là?', options: ['PR, hợp đồng, biên bản họp', 'Purchase Order, Goods Receipt Note, Hoá đơn', 'Báo giá, hợp đồng, phiếu lương', 'PO, PR, ngân sách năm'], correctIndex: 1, explanation: '3-way match khớp PO (đặt gì), GRN (nhận gì), và Hoá đơn (tính tiền gì).' },
  { id: 'q2', question: 'Điểm khác biệt cốt lõi giữa phiếu yêu cầu (PR) và đơn đặt hàng (PO) là?', options: ['PR và PO là một, chỉ khác tên gọi', 'PR là yêu cầu nội bộ chưa ràng buộc; PO là tài liệu thương mại ràng buộc gửi cho nhà cung cấp', 'PO luôn lập trước PR', 'PR chỉ dùng cho dịch vụ, PO chỉ dùng cho hàng hoá'], correctIndex: 1, explanation: 'PR là nội bộ, chưa cam kết; PO khi phát hành cho NCC trở thành hợp đồng ràng buộc.' },
  { id: 'q3', question: '"Maverick spend" là gì và vì sao có hại?', options: ['Chi tiêu vượt định mức được duyệt trước, không hại gì', 'Mua hàng ngoài quy trình P2P (không PR/PO), làm hỏng kiểm soát khớp 3 chiều và che giấu chi tiêu', 'Một loại hợp đồng dài hạn với NCC chiến lược', 'Chi phí vận chuyển phát sinh ngoài dự tính'], correctIndex: 1, explanation: 'Maverick spend đi vòng quy trình chính thức, phá vỡ 3-way match và là rủi ro kiểm toán.' },
]);

const c3 = doc('pcm301-3-1-spend-analysis-kraljic', '3.1 — Spend analysis & categorization (Kraljic matrix)|||3.1 — Phân tích chi tiêu & phân loại (ma trận Kraljic)',
  'Phân tích chi tiêu (ABC, phân theo nhà cung cấp/hạng mục); ma trận Kraljic 2x2 (tác động lợi nhuận x rủi ro cung ứng) → 4 nhóm hàng &amp; chiến lược tương ứng.',
  [[
    `<span class="eyebrow">PCM301 · Chapter 3 · Lesson 3.1</span>
<h2>Spend analysis &amp; categorization (Kraljic matrix)</h2>
<h3>Spend analysis — know where the money goes</h3>
<p>Before you can manage spend strategically, you must see it clearly: what is bought, from whom, how much, and how often. <strong>ABC analysis</strong> ranks items by spend value — typically a small share of suppliers/items (Class A) accounts for the majority of total spend, following the Pareto (80/20) pattern — and it tells procurement where to focus effort first.</p>
<h3>The Kraljic matrix</h3>
<p>Developed by Peter Kraljic (1983), this 2x2 matrix classifies every purchased item on two axes: <strong>profit impact</strong> (how much the item affects the bottom line) and <strong>supply risk</strong> (how hard it is to source — few suppliers, long lead times, volatile prices).</p>
<pre><code>Kraljic Matrix                     SUPPLY RISK
                              Low               High
             +-------------------------------+---------------------------+
   High      | LEVERAGE items                | STRATEGIC items          |
 PROFIT      | many suppliers, big spend      | few suppliers, big spend |
 IMPACT      | -> compete suppliers, tender   | -> partner, long-term deal|
             +-------------------------------+---------------------------+
   Low       | NON-CRITICAL items             | BOTTLENECK items          |
             | many suppliers, small spend    | few suppliers, small spend|
             | -> simplify, e-catalog buying  | -> secure supply, stock up|
             +-------------------------------+---------------------------+
</code></pre>
<h3>Strategy per quadrant</h3>
<ul>
<li><strong>Non-critical</strong> (e.g. office supplies) — reduce process cost: e-catalogs, purchasing cards, standardize.</li>
<li><strong>Leverage</strong> (e.g. commodity raw material with many suppliers) — use buying power: competitive tendering, volume consolidation.</li>
<li><strong>Bottleneck</strong> (e.g. a single-source spare part) — secure supply: safety stock, qualify alternative suppliers, contracts with guaranteed volumes.</li>
<li><strong>Strategic</strong> (e.g. a critical, high-value, sole-source component) — build partnership: joint development, long-term contracts, deep supplier relationship (this feeds directly into Chapter 6, SRM).</li>
</ul>
<div class="callout"><span class="badge">Exam tip</span> Given a scenario, place the item first on profit impact, then on supply risk — the matrix is diagnostic, not decorative: the quadrant tells you the sourcing strategy to apply.</div>`,
    `<span class="eyebrow">PCM301 · Chương 3 · Bài 3.1</span>
<h2>Phân tích chi tiêu &amp; phân loại (ma trận Kraljic)</h2>
<h3>Phân tích chi tiêu — biết tiền đi đâu</h3>
<p>Trước khi quản lý chi tiêu một cách chiến lược, phải nhìn rõ nó: mua gì, từ ai, bao nhiêu tiền, và tần suất nào. <strong>Phân tích ABC</strong> xếp hạng các mặt hàng theo giá trị chi tiêu — thường một tỉ trọng nhỏ nhà cung cấp/mặt hàng (nhóm A) chiếm phần lớn tổng chi tiêu, theo quy luật Pareto (80/20) — và điều này cho thu mua biết nên tập trung nguồn lực vào đâu trước.</p>
<h3>Ma trận Kraljic</h3>
<p>Được Peter Kraljic phát triển (1983), ma trận 2x2 này phân loại mọi mặt hàng mua vào theo hai trục: <strong>tác động lợi nhuận</strong> (mặt hàng ảnh hưởng đến lợi nhuận bao nhiêu) và <strong>rủi ro cung ứng</strong> (khó tìm nguồn đến mức nào — ít nhà cung cấp, thời gian giao hàng dài, giá biến động).</p>
<pre><code>Ma trận Kraljic                    RỦI RO CUNG ỨNG
                              Thấp              Cao
             +-------------------------------+---------------------------+
   Cao       | Nhóm LEVERAGE (đòn bẩy)        | Nhóm STRATEGIC (chiến lược)|
 TÁC ĐỘNG    | nhiều NCC, chi tiêu lớn        | ít NCC, chi tiêu lớn      |
 LỢI NHUẬN   | -> cho NCC cạnh tranh, đấu thầu| -> hợp tác, hợp đồng dài  |
             +-------------------------------+---------------------------+
   Thấp      | Nhóm NON-CRITICAL              | Nhóm BOTTLENECK (nút cổ chai)|
             | nhiều NCC, chi tiêu nhỏ         | ít NCC, chi tiêu nhỏ      |
             | -> đơn giản hoá, mua qua e-catalog | -> bảo đảm nguồn, dự trữ|
             +-------------------------------+---------------------------+
</code></pre>
<h3>Chiến lược theo từng nhóm</h3>
<ul>
<li><strong>Non-critical</strong> (vd văn phòng phẩm) — giảm chi phí xử lý: mua qua e-catalog, thẻ mua hàng, chuẩn hoá.</li>
<li><strong>Leverage</strong> (vd nguyên liệu phổ thông có nhiều NCC) — dùng sức mua: đấu thầu cạnh tranh, gộp khối lượng.</li>
<li><strong>Bottleneck</strong> (vd linh kiện thay thế chỉ một nguồn) — bảo đảm nguồn cung: dự trữ an toàn, chứng nhận thêm NCC thay thế, hợp đồng cam kết khối lượng.</li>
<li><strong>Strategic</strong> (vd linh kiện quan trọng, giá trị cao, độc quyền nguồn) — xây dựng đối tác: phát triển chung, hợp đồng dài hạn, quan hệ nhà cung cấp sâu (dẫn thẳng vào Chương 6, SRM).</li>
</ul>
<div class="callout"><span class="badge">Mẹo thi</span> Với một tình huống cho sẵn, hãy đặt mặt hàng lên trục tác động lợi nhuận trước, rồi trục rủi ro cung ứng — ma trận dùng để CHẨN ĐOÁN, không chỉ trang trí: ô nào cho biết chiến lược tìm nguồn nào cần áp dụng.</div>`,
  ]]);

const c3q = quiz('pcm301-quiz-3', 'Quiz 3 — Spend analysis & Kraljic matrix|||Quiz 3 — Phân tích chi tiêu & Kraljic', [
  { id: 'q1', question: 'Ma trận Kraljic phân loại mặt hàng mua vào theo hai trục nào?', options: ['Giá cả và thời gian giao hàng', 'Tác động lợi nhuận và rủi ro cung ứng', 'Số lượng và chất lượng', 'Doanh thu và chi phí vận chuyển'], correctIndex: 1, explanation: 'Kraljic dùng 2 trục: profit impact (tác động lợi nhuận) và supply risk (rủi ro cung ứng).' },
  { id: 'q2', question: 'Một linh kiện quan trọng, giá trị cao, chỉ có DUY NHẤT một nhà cung cấp thuộc nhóm nào của Kraljic?', options: ['Non-critical', 'Leverage', 'Bottleneck', 'Strategic'], correctIndex: 3, explanation: 'Tác động lợi nhuận cao + rủi ro cung ứng cao = nhóm Strategic — cần xây quan hệ đối tác dài hạn.' },
  { id: 'q3', question: 'Chiến lược phù hợp cho nhóm "Leverage" (đòn bẩy) trong Kraljic là?', options: ['Xây quan hệ đối tác dài hạn duy nhất một NCC', 'Dự trữ an toàn vì nguồn cung khan hiếm', 'Dùng sức mua để đấu thầu cạnh tranh giữa nhiều NCC', 'Bỏ qua vì chi tiêu quá nhỏ'], correctIndex: 2, explanation: 'Leverage có nhiều NCC & chi tiêu lớn -> tận dụng sức mua qua đấu thầu/cạnh tranh giá.' },
]);

const c4 = doc('pcm301-4-1-sourcing-supplier-evaluation', '4.1 — Sourcing & supplier evaluation (RFx)|||4.1 — Tìm nguồn & đánh giá nhà cung cấp (RFx)',
  'Quy trình tìm nguồn (identify → RFI → RFP/RFQ → đánh giá → chọn); phân biệt RFI/RFP/RFQ; tiêu chí đánh giá NCC & mô hình chấm điểm theo trọng số.',
  [[
    `<span class="eyebrow">PCM301 · Chapter 4 · Lesson 4.1</span>
<h2>Sourcing &amp; supplier evaluation (RFx)</h2>
<h3>The sourcing process</h3>
<pre><code>Sourcing process:
 1. Identify potential suppliers   -> market research, existing database
 2. RFI  (Request for Information) -> screen capability, capacity, general fit
 3. RFP  (Request for Proposal)    -> for complex needs: ask HOW they would solve it
 4. RFQ  (Request for Quotation)   -> for well-defined needs: ask price for a fixed spec
 5. Evaluate & shortlist            -> score against weighted criteria
 6. Select & award                  -> negotiate terms, issue contract/PO
</code></pre>
<h3>RFI vs. RFP vs. RFQ — the "RFx" family</h3>
<ul>
<li><strong>RFI (Request for Information)</strong> — broad, exploratory: "tell us about your company and capabilities." Used early, to build a longlist.</li>
<li><strong>RFP (Request for Proposal)</strong> — used when the solution is not fully defined: suppliers propose HOW they would meet the need (approach, methodology, price). Common for services and complex projects.</li>
<li><strong>RFQ (Request for Quotation)</strong> — used when the specification is fixed and clear: suppliers simply quote a PRICE for exactly what is specified. Common for standard goods.</li>
</ul>
<h3>Supplier evaluation criteria</h3>
<p>Beyond price, a sound evaluation weighs several dimensions — commonly abbreviated as the supplier "scorecard":</p>
<pre><code>Weighted supplier scoring example:
 Criterion              Weight   Supplier A   Supplier B
 Quality (defect rate)    30%       9/10         7/10
 Cost                     25%       7/10         9/10
 Delivery reliability     20%       8/10         6/10
 Financial stability      15%       9/10         8/10
 ESG / sustainability     10%       6/10         7/10
 --------------------------------------------------------
 Weighted total          100%     7.95          7.35   <- Supplier A wins
</code></pre>
<div class="callout"><span class="badge">Why weighted scoring</span> Picking on price alone ignores hidden costs (defects, late delivery, financial risk of a supplier going bankrupt mid-contract). A weighted model forces evaluators to make trade-offs explicit and defensible.</div>`,
    `<span class="eyebrow">PCM301 · Chương 4 · Bài 4.1</span>
<h2>Tìm nguồn &amp; đánh giá nhà cung cấp (RFx)</h2>
<h3>Quy trình tìm nguồn</h3>
<pre><code>Quy trình tìm nguồn:
 1. Xác định NCC tiềm năng      -> nghiên cứu thị trường, cơ sở dữ liệu sẵn có
 2. RFI (yêu cầu thông tin)      -> lọc năng lực, công suất, mức độ phù hợp chung
 3. RFP (yêu cầu đề xuất)        -> cho nhu cầu phức tạp: hỏi HỌ SẼ giải quyết ra sao
 4. RFQ (yêu cầu chào giá)       -> cho nhu cầu đã rõ: hỏi GIÁ cho một thông số cố định
 5. Đánh giá & lập shortlist     -> chấm điểm theo tiêu chí có trọng số
 6. Chọn & trao hợp đồng          -> đàm phán điều khoản, phát hành hợp đồng/PO
</code></pre>
<h3>RFI vs. RFP vs. RFQ — nhóm "RFx"</h3>
<ul>
<li><strong>RFI (Request for Information)</strong> — rộng, khai thác: "cho biết về công ty và năng lực của bạn." Dùng ở bước đầu để lập longlist.</li>
<li><strong>RFP (Request for Proposal)</strong> — dùng khi giải pháp chưa được xác định rõ: nhà cung cấp đề xuất SẼ đáp ứng nhu cầu ra sao (cách làm, phương pháp, giá). Thường dùng cho dịch vụ và dự án phức tạp.</li>
<li><strong>RFQ (Request for Quotation)</strong> — dùng khi thông số kỹ thuật đã cố định và rõ ràng: nhà cung cấp chỉ cần chào GIÁ cho đúng thứ được nêu. Thường dùng cho hàng hoá tiêu chuẩn.</li>
</ul>
<h3>Tiêu chí đánh giá nhà cung cấp</h3>
<p>Ngoài giá, một đánh giá tốt cân nhắc nhiều chiều — thường gọi là "bảng chấm điểm" (scorecard) nhà cung cấp:</p>
<pre><code>Ví dụ chấm điểm NCC theo trọng số:
 Tiêu chí                 Trọng số  NCC A       NCC B
 Chất lượng (tỉ lệ lỗi)     30%      9/10        7/10
 Chi phí                    25%      7/10        9/10
 Độ tin cậy giao hàng       20%      8/10        6/10
 Sức khoẻ tài chính         15%      9/10        8/10
 ESG / bền vững              10%      6/10        7/10
 --------------------------------------------------------
 Tổng có trọng số          100%     7,95        7,35   <- NCC A thắng
</code></pre>
<div class="callout"><span class="badge">Vì sao chấm điểm theo trọng số</span> Chọn chỉ theo giá bỏ qua các chi phí ẩn (lỗi hàng, giao trễ, rủi ro tài chính khi NCC phá sản giữa hợp đồng). Mô hình có trọng số buộc người đánh giá phải làm rõ và bảo vệ được sự đánh đổi của mình.</div>`,
  ]]);

const c4q = quiz('pcm301-quiz-4', 'Quiz 4 — Sourcing & RFx|||Quiz 4 — Tìm nguồn & RFx', [
  { id: 'q1', question: 'Khi thông số kỹ thuật đã cố định và rõ ràng, công cụ tìm nguồn phù hợp nhất là?', options: ['RFI', 'RFP', 'RFQ', 'SLA'], correctIndex: 2, explanation: 'RFQ dùng khi spec đã rõ, chỉ cần NCC chào giá.' },
  { id: 'q2', question: 'RFP (Request for Proposal) khác RFQ ở điểm nào?', options: ['RFP chỉ hỏi giá, RFQ hỏi cách làm', 'RFP yêu cầu NCC đề xuất CÁCH giải quyết nhu cầu chưa xác định rõ; RFQ chỉ hỏi giá cho spec cố định', 'RFP và RFQ hoàn toàn giống nhau', 'RFP chỉ dùng nội bộ, không gửi ra ngoài'], correctIndex: 1, explanation: 'RFP: đề xuất giải pháp cho nhu cầu phức tạp. RFQ: chào giá cho spec đã rõ.' },
  { id: 'q3', question: 'Vì sao nên dùng mô hình chấm điểm theo TRỌNG SỐ khi chọn nhà cung cấp, thay vì chỉ chọn giá thấp nhất?', options: ['Vì luật pháp bắt buộc', 'Vì giá thấp nhất luôn là lựa chọn tốt nhất', 'Vì nó tính đến các yếu tố khác như chất lượng, giao hàng, tài chính — tránh chi phí ẩn', 'Vì mô hình trọng số dễ tính hơn giá'], correctIndex: 2, explanation: 'Chấm điểm theo trọng số cân nhắc chất lượng/giao hàng/tài chính/ESG, tránh bỏ qua chi phí ẩn khi chỉ nhìn giá.' },
]);

const c5 = doc('pcm301-5-1-negotiation-contracts', '5.1 — Negotiation & procurement contracts|||5.1 — Đàm phán & hợp đồng mua sắm',
  'Chuẩn bị đàm phán (BATNA, mục tiêu/điểm rút lui); đàm phán hợp tác vs. vị thế; các loại hợp đồng (fixed price, cost-plus, time & materials); điều khoản chính (SLA, phạt, thanh toán).',
  [[
    `<span class="eyebrow">PCM301 · Chapter 5 · Lesson 5.1</span>
<h2>Negotiation &amp; procurement contracts</h2>
<h3>Preparing to negotiate</h3>
<p>Effective negotiation is won mostly <em>before</em> the meeting starts. Two concepts anchor preparation:</p>
<pre><code>Negotiation prep checklist:
 - Target price / terms       -> what you would be happy to achieve
 - Walk-away point            -> the worst terms you will still accept
 - BATNA (Best Alternative To -> what happens if THIS negotiation fails
   a Negotiated Agreement)       (another supplier? delay the purchase?)
 - Leverage                   -> your volume, alternatives, urgency vs theirs
 - Facts & benchmarks         -> market prices, competitor quotes, cost breakdown
</code></pre>
<p>A strong <strong>BATNA</strong> — a credible alternative supplier or option — is the single biggest source of negotiating power; it lets you walk away rather than accept a bad deal.</p>
<h3>Collaborative vs. positional negotiation</h3>
<ul>
<li><strong>Positional (win-lose)</strong> — each side stakes a position and concedes slowly; works for one-off, low-value, arm's-length purchases.</li>
<li><strong>Collaborative (win-win / integrative)</strong> — both sides explore underlying interests to find a deal that grows the total value (e.g. longer contract for lower price, or joint cost-reduction ideas); appropriate for strategic/bottleneck items where an ongoing relationship matters (links back to the Kraljic matrix).</li>
</ul>
<h3>Common contract types</h3>
<ul>
<li><strong>Fixed price</strong> — one agreed price regardless of the supplier's actual cost; buyer risk is low, supplier bears cost-overrun risk.</li>
<li><strong>Cost-plus</strong> — buyer pays the supplier's actual cost plus an agreed margin; used when scope is uncertain, but weak incentive to control cost.</li>
<li><strong>Time &amp; materials (T&amp;M)</strong> — pay for hours worked plus materials used; flexible for changing-scope work (common in services/IT), but requires tight monitoring.</li>
</ul>
<h3>Key contract terms</h3>
<p>Beyond price and quantity, contracts typically fix: <strong>SLA</strong> (Service Level Agreement — measurable performance standards), <strong>penalty/liquidated-damages clauses</strong> for late delivery or missed SLAs, <strong>payment terms</strong> (e.g. Net 30/60/90 days), and — for international purchases — <strong>Incoterms</strong> (who bears cost/risk at each point of transport, e.g. FOB, CIF, DDP).</p>
<div class="callout"><span class="badge">Exam tip</span> A question that gives you "uncertain scope, needs flexibility" is pointing at T&amp;M or cost-plus; "well-defined scope, buyer wants price certainty" is pointing at fixed price.</div>`,
    `<span class="eyebrow">PCM301 · Chương 5 · Bài 5.1</span>
<h2>Đàm phán &amp; hợp đồng mua sắm</h2>
<h3>Chuẩn bị đàm phán</h3>
<p>Đàm phán hiệu quả được quyết định chủ yếu <em>trước khi</em> buổi họp bắt đầu. Hai khái niệm làm nền cho việc chuẩn bị:</p>
<pre><code>Checklist chuẩn bị đàm phán:
 - Giá/điều khoản mục tiêu   -> mức bạn sẽ hài lòng nếu đạt được
 - Điểm rút lui (walk-away)  -> điều khoản xấu nhất bạn vẫn còn chấp nhận
 - BATNA (Phương án thay thế -> điều gì xảy ra nếu đàm phán NÀY thất bại
   tốt nhất nếu không đạt      (một NCC khác? trì hoãn việc mua?)
   thoả thuận)
 - Đòn bẩy (leverage)        -> khối lượng, phương án thay thế, mức khẩn của bạn so với họ
 - Dữ kiện & tham chiếu      -> giá thị trường, báo giá đối thủ, cơ cấu chi phí
</code></pre>
<p>Một <strong>BATNA</strong> mạnh — một nhà cung cấp hoặc lựa chọn thay thế đáng tin cậy — là nguồn sức mạnh đàm phán lớn nhất; nó cho phép bạn rời khỏi bàn đàm phán thay vì chấp nhận một thoả thuận tồi.</p>
<h3>Đàm phán hợp tác vs. vị thế</h3>
<ul>
<li><strong>Vị thế (win-lose)</strong> — mỗi bên giữ một lập trường và nhượng bộ dần; phù hợp cho các giao dịch một lần, giá trị thấp, quan hệ hời hợt.</li>
<li><strong>Hợp tác (win-win / integrative)</strong> — cả hai bên khai thác lợi ích nền tảng để tìm thoả thuận làm tăng tổng giá trị (vd hợp đồng dài hơn đổi giá thấp hơn, hoặc ý tưởng giảm chi phí chung); phù hợp cho hàng nhóm strategic/bottleneck nơi quan hệ lâu dài quan trọng (liên hệ ngược lại ma trận Kraljic).</li>
</ul>
<h3>Các loại hợp đồng phổ biến</h3>
<ul>
<li><strong>Giá cố định (fixed price)</strong> — một mức giá đã thoả thuận bất kể chi phí thực tế của NCC; rủi ro cho bên mua thấp, NCC chịu rủi ro vượt chi phí.</li>
<li><strong>Cost-plus (chi phí cộng lãi)</strong> — bên mua trả chi phí thực tế của NCC cộng một biên lợi nhuận đã thoả thuận; dùng khi phạm vi công việc chưa rõ, nhưng ít động lực kiểm soát chi phí.</li>
<li><strong>Time &amp; materials (T&amp;M — theo giờ công & vật tư)</strong> — trả theo số giờ làm việc cộng vật tư sử dụng; linh hoạt cho công việc có phạm vi thay đổi (phổ biến trong dịch vụ/IT), nhưng cần giám sát chặt.</li>
</ul>
<h3>Điều khoản hợp đồng then chốt</h3>
<p>Ngoài giá và số lượng, hợp đồng thường cố định: <strong>SLA</strong> (Service Level Agreement — cam kết hiệu suất có thể đo lường), <strong>điều khoản phạt/bồi thường thiệt hại ấn định</strong> cho giao trễ hoặc không đạt SLA, <strong>điều khoản thanh toán</strong> (vd Net 30/60/90 ngày), và — với hàng mua quốc tế — <strong>Incoterms</strong> (bên nào chịu chi phí/rủi ro tại từng điểm vận chuyển, vd FOB, CIF, DDP).</p>
<div class="callout"><span class="badge">Mẹo thi</span> Đề cho "phạm vi công việc chưa rõ, cần linh hoạt" là gợi ý T&amp;M hoặc cost-plus; "phạm vi đã rõ, bên mua cần chắc chắn về giá" là gợi ý giá cố định.</div>`,
  ]]);

const c5q = quiz('pcm301-quiz-5', 'Quiz 5 — Negotiation & contracts|||Quiz 5 — Đàm phán & hợp đồng', [
  { id: 'q1', question: 'BATNA nghĩa là gì và vì sao quan trọng trong đàm phán?', options: ['Một loại hợp đồng cố định giá', 'Phương án thay thế tốt nhất nếu đàm phán thất bại — càng mạnh, sức mạnh đàm phán càng lớn', 'Một điều khoản phạt trong hợp đồng', 'Tên viết tắt của ma trận Kraljic'], correctIndex: 1, explanation: 'BATNA = Best Alternative To a Negotiated Agreement; BATNA mạnh cho phép rời bàn đàm phán khi cần.' },
  { id: 'q2', question: 'Với hàng nhóm "strategic" (theo Kraljic), phong cách đàm phán phù hợp hơn là?', options: ['Vị thế (win-lose), càng cứng càng tốt', 'Hợp tác (win-win/integrative), vì cần quan hệ lâu dài', 'Không đàm phán, chấp nhận giá NCC đưa ra', 'Chỉ đàm phán qua email, không gặp mặt'], correctIndex: 1, explanation: 'Hàng chiến lược cần quan hệ đối tác dài hạn -> đàm phán hợp tác/win-win phù hợp hơn.' },
  { id: 'q3', question: 'Loại hợp đồng nào phù hợp khi phạm vi công việc CHƯA rõ và cần linh hoạt theo giờ công?', options: ['Giá cố định (fixed price)', 'Time & materials (T&M)', 'Không cần hợp đồng', 'Chỉ dùng đơn đặt hàng miệng'], correctIndex: 1, explanation: 'T&M trả theo giờ công + vật tư, linh hoạt cho phạm vi công việc thay đổi.' },
]);

const c6 = doc('pcm301-6-1-srm-performance', '6.1 — Supplier relationship management (SRM) & performance|||6.1 — Quản trị quan hệ nhà cung cấp (SRM) & hiệu suất',
  'Định nghĩa SRM; phân khúc nhà cung cấp (đối tác chiến lược vs giao dịch); vòng đời quan hệ; đo hiệu suất NCC qua scorecard & KPI.',
  [[
    `<span class="eyebrow">PCM301 · Chapter 6 · Lesson 6.1</span>
<h2>Supplier relationship management (SRM) &amp; performance</h2>
<h3>What SRM is — and why it isn't the same for every supplier</h3>
<p><strong>Supplier Relationship Management (SRM)</strong> is the systematic approach to managing interactions with suppliers over time — segmenting them, setting the appropriate level of engagement, measuring performance, and jointly improving. Not every supplier deserves the same treatment: SRM effort should track the <strong>Kraljic segmentation</strong> from Chapter 3 — strategic and bottleneck suppliers get deep, resourced relationships; leverage and non-critical suppliers get lighter-touch, transactional management.</p>
<h3>The supplier relationship lifecycle</h3>
<pre><code>Supplier relationship lifecycle:
 1. Onboarding      -> qualify, set up in systems, agree SLA/KPIs
 2. Performance      -> ongoing tracking against scorecard, regular reviews
    management
 3. Development       -> joint improvement plans, cost-reduction workshops,
                          innovation collaboration (for strategic suppliers)
 4. Exit / offboarding -> planned transition if the relationship ends, to
                          avoid supply disruption
</code></pre>
<h3>Measuring supplier performance — the scorecard</h3>
<p>A supplier scorecard tracks agreed KPIs over time, typically including:</p>
<ul>
<li><strong>On-time delivery rate (%)</strong> — orders delivered by the promised date.</li>
<li><strong>Quality / defect rate</strong> — parts-per-million defective, or rejection rate at inspection.</li>
<li><strong>Cost performance</strong> — price stability, cost savings delivered versus baseline.</li>
<li><strong>Responsiveness</strong> — lead time for quotes, issue resolution speed.</li>
</ul>
<div class="callout"><span class="badge">Segmentation in practice</span> Treating a low-value, easily-replaced stationery supplier with the same quarterly business review as a sole-source strategic component supplier wastes resources on the former and under-invests in the latter — segment first, then decide the engagement model.</div>`,
    `<span class="eyebrow">PCM301 · Chương 6 · Bài 6.1</span>
<h2>Quản trị quan hệ nhà cung cấp (SRM) &amp; hiệu suất</h2>
<h3>SRM là gì — và vì sao không giống nhau cho mọi nhà cung cấp</h3>
<p><strong>Quản trị quan hệ nhà cung cấp (SRM)</strong> là cách tiếp cận có hệ thống để quản lý tương tác với nhà cung cấp theo thời gian — phân khúc họ, xác định mức độ gắn kết phù hợp, đo hiệu suất, và cùng cải tiến. Không phải nhà cung cấp nào cũng đáng được đối xử như nhau: mức đầu tư cho SRM nên đi theo <strong>phân khúc Kraljic</strong> ở Chương 3 — nhà cung cấp nhóm strategic và bottleneck nhận quan hệ sâu, có nguồn lực; nhóm leverage và non-critical được quản lý nhẹ nhàng, mang tính giao dịch.</p>
<h3>Vòng đời quan hệ nhà cung cấp</h3>
<pre><code>Vòng đời quan hệ nhà cung cấp:
 1. Onboarding (khởi tạo) -> thẩm định, thiết lập trong hệ thống, thống nhất SLA/KPI
 2. Quản lý hiệu suất       -> theo dõi liên tục theo scorecard, đánh giá định kỳ
 3. Phát triển               -> kế hoạch cải tiến chung, hội thảo giảm chi phí,
                                hợp tác đổi mới (cho NCC chiến lược)
 4. Kết thúc / chuyển giao   -> chuyển tiếp có kế hoạch nếu quan hệ kết thúc, để
                                tránh gián đoạn cung ứng
</code></pre>
<h3>Đo hiệu suất nhà cung cấp — bảng scorecard</h3>
<p>Bảng scorecard nhà cung cấp theo dõi các KPI đã thống nhất theo thời gian, thường gồm:</p>
<ul>
<li><strong>Tỉ lệ giao hàng đúng hạn (%)</strong> — số đơn giao đúng ngày đã hứa.</li>
<li><strong>Tỉ lệ lỗi / chất lượng</strong> — số phần lỗi trên triệu, hoặc tỉ lệ bị loại khi kiểm tra.</li>
<li><strong>Hiệu suất chi phí</strong> — độ ổn định giá, khoản tiết kiệm đạt được so với mốc gốc.</li>
<li><strong>Độ phản hồi</strong> — thời gian báo giá, tốc độ xử lý sự cố.</li>
</ul>
<div class="callout"><span class="badge">Phân khúc trong thực tế</span> Đối xử với một NCC văn phòng phẩm giá trị thấp, dễ thay thế bằng đúng quy trình đánh giá kinh doanh hàng quý như với một NCC linh kiện chiến lược độc quyền nguồn là lãng phí nguồn lực cho bên đầu và đầu tư thiếu cho bên sau — phân khúc trước, rồi mới quyết định mô hình gắn kết.</div>`,
  ]]);

const c6q = quiz('pcm301-quiz-6', 'Quiz 6 — SRM & performance|||Quiz 6 — SRM & hiệu suất', [
  { id: 'q1', question: 'Vì sao mức đầu tư vào SRM nên khác nhau giữa các nhóm nhà cung cấp?', options: ['Vì luật yêu cầu đối xử khác nhau', 'Vì nhà cung cấp chiến lược/bottleneck cần quan hệ sâu, còn leverage/non-critical chỉ cần quản lý nhẹ', 'Vì tất cả NCC đều giống nhau nên không cần phân biệt', 'Vì giá hợp đồng luôn quyết định mức đầu tư'], correctIndex: 1, explanation: 'Mức SRM nên theo phân khúc Kraljic — nguồn lực tập trung vào NCC chiến lược/bottleneck.' },
  { id: 'q2', question: 'Một bảng "scorecard" nhà cung cấp thường đo những gì?', options: ['Chỉ giá mua', 'Giao hàng đúng hạn, tỉ lệ lỗi/chất lượng, hiệu suất chi phí, độ phản hồi', 'Chỉ số lượng nhân viên của NCC', 'Chỉ vị trí địa lý của NCC'], correctIndex: 1, explanation: 'Scorecard theo dõi nhiều KPI: giao hàng, chất lượng, chi phí, phản hồi — không chỉ giá.' },
  { id: 'q3', question: 'Bước nào trong vòng đời quan hệ nhà cung cấp liên quan đến hợp tác đổi mới và kế hoạch cải tiến chung?', options: ['Onboarding', 'Quản lý hiệu suất', 'Phát triển (development)', 'Kết thúc/chuyển giao'], correctIndex: 2, explanation: 'Giai đoạn phát triển là nơi diễn ra hợp tác đổi mới & cải tiến chung, đặc biệt với NCC chiến lược.' },
]);

const c7 = doc('pcm301-7-1-sustainable-ethics-risk', '7.1 — Sustainable procurement, ethics & risk|||7.1 — Thu mua bền vững, đạo đức & rủi ro',
  'Thu mua bền vững (3 trụ cột kinh tế/xã hội/môi trường); đạo đức thu mua (xung đột lợi ích, hối lộ); quản trị rủi ro cung ứng (loại rủi ro, ma trận khả năng x tác động, giảm thiểu).',
  [[
    `<span class="eyebrow">PCM301 · Chapter 7 · Lesson 7.1</span>
<h2>Sustainable procurement, ethics &amp; risk</h2>
<h3>Sustainable procurement — the triple bottom line</h3>
<p>Sustainable procurement extends the traditional cost/quality/delivery focus to also weigh <strong>economic, social and environmental</strong> impact ("triple bottom line") across the whole supply base: fair labor practices, carbon footprint, resource use, and community impact — not just at the buyer's own site, but through the supplier's operations too.</p>
<h3>Procurement ethics</h3>
<ul>
<li><strong>Conflict of interest</strong> — a buyer must not have a personal financial stake in a supplier they select; declare and recuse.</li>
<li><strong>Bribery &amp; corruption</strong> — gifts, kickbacks or favors that influence a sourcing decision are prohibited by professional codes (e.g. the <strong>CIPS Code of Conduct</strong>) and often by law.</li>
<li><strong>Fair competition</strong> — every qualified bidder gets the same information and deadline; favoritism undermines both ethics and the quality of the outcome.</li>
</ul>
<h3>Supply risk management</h3>
<pre><code>Risk matrix (likelihood x impact):
                       Low impact          High impact
 High likelihood   |  Monitor            |  URGENT: mitigate now
 Low likelihood    |  Accept             |  Contingency plan ready
</code></pre>
<p>Common supply risk types: <strong>disruption risk</strong> (natural disaster, factory fire, logistics failure), <strong>financial risk</strong> (a key supplier goes bankrupt), <strong>geopolitical risk</strong> (tariffs, export bans, war), and <strong>single-source dependency</strong> (no alternative supplier exists for a critical item — the exact "bottleneck/strategic" quadrant risk from the Kraljic matrix).</p>
<h3>Mitigation levers</h3>
<p>Dual/multi-sourcing for critical items, safety stock for long-lead-time components, regular supplier financial-health audits, and contractual business-continuity clauses are the standard toolkit for reducing supply risk exposure.</p>
<div class="callout"><span class="badge">Where this connects</span> Sustainable/ethical requirements and risk criteria should be built INTO the supplier evaluation scorecard from Chapter 4 — not treated as an afterthought once a supplier is already selected.</div>`,
    `<span class="eyebrow">PCM301 · Chương 7 · Bài 7.1</span>
<h2>Thu mua bền vững, đạo đức &amp; rủi ro</h2>
<h3>Thu mua bền vững — ba trụ cột</h3>
<p>Thu mua bền vững mở rộng trọng tâm truyền thống chi phí/chất lượng/giao hàng để cân nhắc thêm tác động <strong>kinh tế, xã hội và môi trường</strong> ("triple bottom line" — ba trụ cột) trên toàn mạng lưới cung ứng: điều kiện lao động công bằng, dấu chân carbon, sử dụng tài nguyên, và tác động đến cộng đồng — không chỉ tại cơ sở của bên mua, mà cả trong hoạt động của nhà cung cấp.</p>
<h3>Đạo đức thu mua</h3>
<ul>
<li><strong>Xung đột lợi ích</strong> — người mua không được có lợi ích tài chính cá nhân với nhà cung cấp mình chọn; phải khai báo và rút khỏi quyết định.</li>
<li><strong>Hối lộ &amp; tham nhũng</strong> — quà tặng, hoa hồng hay ưu ái nhằm ảnh hưởng quyết định tìm nguồn bị cấm theo bộ quy tắc nghề nghiệp (vd <strong>CIPS Code of Conduct</strong>) và thường bị cấm theo luật.</li>
<li><strong>Cạnh tranh công bằng</strong> — mọi nhà thầu đủ điều kiện nhận cùng thông tin và cùng thời hạn; thiên vị làm hỏng cả đạo đức và chất lượng kết quả.</li>
</ul>
<h3>Quản trị rủi ro cung ứng</h3>
<pre><code>Ma trận rủi ro (khả năng xảy ra x tác động):
                       Tác động thấp        Tác động cao
 Khả năng cao      |  Theo dõi           |  KHẨN: giảm thiểu ngay
 Khả năng thấp     |  Chấp nhận          |  Chuẩn bị kế hoạch dự phòng
</code></pre>
<p>Các loại rủi ro cung ứng phổ biến: <strong>rủi ro gián đoạn</strong> (thiên tai, cháy nhà máy, đứt gãy logistics), <strong>rủi ro tài chính</strong> (một NCC then chốt phá sản), <strong>rủi ro địa chính trị</strong> (thuế quan, lệnh cấm xuất khẩu, chiến tranh), và <strong>phụ thuộc nguồn duy nhất</strong> (không có NCC thay thế cho một mặt hàng thiết yếu — đúng rủi ro của ô "bottleneck/strategic" trong ma trận Kraljic).</p>
<h3>Công cụ giảm thiểu</h3>
<p>Tìm nguồn kép/đa nguồn cho mặt hàng thiết yếu, dự trữ an toàn cho linh kiện có thời gian giao hàng dài, kiểm tra định kỳ sức khoẻ tài chính nhà cung cấp, và điều khoản hợp đồng về duy trì kinh doanh liên tục là bộ công cụ chuẩn để giảm mức phơi nhiễm rủi ro cung ứng.</p>
<div class="callout"><span class="badge">Liên hệ ngược</span> Yêu cầu bền vững/đạo đức và tiêu chí rủi ro nên được đưa VÀO bảng chấm điểm đánh giá NCC ở Chương 4 ngay từ đầu — không phải là việc nghĩ đến sau khi đã chọn xong nhà cung cấp.</div>`,
  ]]);

const c7q = quiz('pcm301-quiz-7', 'Quiz 7 — Sustainability, ethics & risk|||Quiz 7 — Bền vững, đạo đức & rủi ro', [
  { id: 'q1', question: '"Triple bottom line" trong thu mua bền vững gồm ba trụ cột nào?', options: ['Giá, chất lượng, thời gian', 'Kinh tế, xã hội, môi trường', 'Nội bộ, đối tác, khách hàng', 'Ngắn hạn, trung hạn, dài hạn'], correctIndex: 1, explanation: 'Triple bottom line = kinh tế + xã hội + môi trường, mở rộng ngoài chi phí/chất lượng/giao hàng.' },
  { id: 'q2', question: 'Theo bộ quy tắc đạo đức nghề (vd CIPS), người mua nhận quà/hoa hồng để ảnh hưởng quyết định chọn NCC là hành vi gì?', options: ['Bình thường, được khuyến khích', 'Xung đột lợi ích hoặc hối lộ — bị cấm', 'Một hình thức đàm phán hợp lệ', 'Chỉ vi phạm nếu giá trị quà quá 10 triệu đồng'], correctIndex: 1, explanation: 'Nhận quà/hoa hồng ảnh hưởng quyết định là hối lộ/xung đột lợi ích, bị cấm theo quy tắc đạo đức & luật.' },
  { id: 'q3', question: 'Rủi ro "phụ thuộc nguồn duy nhất" (single-source dependency) tương ứng với ô nào trong ma trận Kraljic?', options: ['Non-critical', 'Leverage', 'Bottleneck / Strategic', 'Không liên quan đến Kraljic'], correctIndex: 2, explanation: 'Chỉ một NCC cho mặt hàng thiết yếu chính là rủi ro cung ứng cao của nhóm bottleneck/strategic.' },
]);

const c8 = doc('pcm301-8-1-digital-procurement-kpi', '8.1 — Digital procurement & e-procurement, KPI measurement|||8.1 — Thu mua số & e-procurement, đo lường KPI',
  'Công cụ e-procurement (e-catalog, e-auction, e-sourcing, tích hợp ERP); lợi ích số hoá; KPI thu mua (tiết kiệm, thời gian chu kỳ, maverick spend); xu hướng AI/blockchain.',
  [[
    `<span class="eyebrow">PCM301 · Chapter 8 · Lesson 8.1</span>
<h2>Digital procurement &amp; e-procurement, KPI measurement</h2>
<h3>e-Procurement tools</h3>
<ul>
<li><strong>e-Catalogs</strong> — pre-negotiated items available for one-click ordering, typically for non-critical/leverage spend — removes manual RFQ steps for routine buys.</li>
<li><strong>e-Auctions / reverse auctions</strong> — suppliers bid the price DOWN in real time for a well-specified item; drives competitive pricing fast, best for leverage-category commodities.</li>
<li><strong>e-Sourcing platforms</strong> — digitize the RFI/RFP/RFQ process end-to-end: publish, collect bids, score, and audit-trail every step.</li>
<li><strong>ERP integration</strong> (e.g. SAP Ariba, Coupa, Oracle Procurement) — connects procurement directly to the P2P cycle (Chapter 2), finance, and inventory systems.</li>
</ul>
<h3>Why digitize</h3>
<p>Automation cuts cycle time and manual errors, enforces the 3-way match and approval workflow automatically, gives real-time spend visibility (feeding the spend analysis in Chapter 3), and creates a full audit trail — directly supporting the ethics and compliance goals of Chapter 7.</p>
<h3>Procurement KPIs</h3>
<pre><code>Common procurement KPI dashboard:
 - Cost savings (%)        -> negotiated price reduction vs. baseline/prior year
 - Cycle time              -> average days from requisition to PO issued
 - Supplier lead time      -> average days from PO to delivery
 - PO compliance rate (%)  -> spend that went through approved P2P process
 - Maverick spend (%)      -> spend OUTSIDE the approved process (lower = better)
 - Supplier on-time rate   -> % of orders delivered by promised date
</code></pre>
<h3>Emerging trends</h3>
<p><strong>AI in procurement</strong> — demand forecasting, automated supplier risk scoring, contract-clause analysis. <strong>Blockchain</strong> — tamper-proof traceability of goods across multi-tier supply chains, useful for verifying ethical/sustainable sourcing claims from Chapter 7.</p>
<div class="callout"><span class="badge">Closing the loop</span> A mature procurement function runs the whole course as one system: Kraljic segmentation directs sourcing strategy, RFx and scorecards select the right supplier, contracts and negotiation lock in terms, SRM sustains the relationship, risk/ethics protect the company, and e-procurement + KPIs make the whole cycle visible and measurable.</div>`,
    `<span class="eyebrow">PCM301 · Chương 8 · Bài 8.1</span>
<h2>Thu mua số &amp; e-procurement, đo lường KPI</h2>
<h3>Công cụ e-procurement</h3>
<ul>
<li><strong>e-Catalog</strong> — các mặt hàng đã đàm phán sẵn, đặt hàng một chạm, thường cho chi tiêu nhóm non-critical/leverage — bỏ qua bước RFQ thủ công cho các lần mua thường lệ.</li>
<li><strong>e-Auction / đấu giá ngược</strong> — nhà cung cấp chào giá GIẢM dần theo thời gian thực cho một mặt hàng đã xác định rõ; tạo giá cạnh tranh nhanh, phù hợp nhất cho hàng hoá nhóm leverage.</li>
<li><strong>Nền tảng e-sourcing</strong> — số hoá toàn bộ quy trình RFI/RFP/RFQ: công bố, thu thập chào giá, chấm điểm, và lưu vết kiểm toán từng bước.</li>
<li><strong>Tích hợp ERP</strong> (vd SAP Ariba, Coupa, Oracle Procurement) — kết nối thu mua trực tiếp với vòng đời P2P (Chương 2), tài chính và hệ thống tồn kho.</li>
</ul>
<h3>Vì sao cần số hoá</h3>
<p>Tự động hoá cắt giảm thời gian chu kỳ và lỗi thủ công, tự động thực thi khớp 3 chiều và luồng phê duyệt, cho hiển thị chi tiêu theo thời gian thực (nạp vào phân tích chi tiêu ở Chương 3), và tạo dấu vết kiểm toán đầy đủ — hỗ trợ trực tiếp mục tiêu đạo đức &amp; tuân thủ ở Chương 7.</p>
<h3>KPI thu mua</h3>
<pre><code>Bảng KPI thu mua phổ biến:
 - Tỉ lệ tiết kiệm chi phí (%)  -> mức giảm giá đàm phán được so với mốc/năm trước
 - Thời gian chu kỳ              -> số ngày trung bình từ yêu cầu đến khi phát hành PO
 - Thời gian giao hàng của NCC   -> số ngày trung bình từ PO đến khi nhận hàng
 - Tỉ lệ tuân thủ PO (%)         -> chi tiêu đi đúng quy trình P2P được duyệt
 - Maverick spend (%)            -> chi tiêu NGOÀI quy trình được duyệt (càng thấp càng tốt)
 - Tỉ lệ giao đúng hạn của NCC   -> % đơn hàng giao đúng ngày đã hứa
</code></pre>
<h3>Xu hướng mới</h3>
<p><strong>AI trong thu mua</strong> — dự báo nhu cầu, chấm điểm rủi ro nhà cung cấp tự động, phân tích điều khoản hợp đồng. <strong>Blockchain</strong> — truy xuất nguồn gốc chống giả mạo qua nhiều tầng chuỗi cung ứng, hữu ích để xác minh cam kết tìm nguồn đạo đức/bền vững ở Chương 7.</p>
<div class="callout"><span class="badge">Khép vòng</span> Một chức năng thu mua trưởng thành vận hành cả môn học này như MỘT hệ thống: phân khúc Kraljic định hướng chiến lược tìm nguồn, RFx và scorecard chọn đúng nhà cung cấp, hợp đồng và đàm phán khoá chặt điều khoản, SRM duy trì quan hệ, rủi ro/đạo đức bảo vệ công ty, và e-procurement + KPI làm cho toàn bộ vòng lặp hiển thị và đo lường được.</div>`,
  ]]);

const c8q = quiz('pcm301-quiz-8', 'Quiz 8 — Digital procurement & KPI|||Quiz 8 — Thu mua số & KPI', [
  { id: 'q1', question: 'Công cụ e-procurement nào phù hợp nhất để tạo giá cạnh tranh nhanh cho một mặt hàng nhóm "leverage" đã xác định rõ thông số?', options: ['e-Catalog', 'e-Auction (đấu giá ngược)', 'Nền tảng e-sourcing cho RFP phức tạp', 'Tích hợp ERP'], correctIndex: 1, explanation: 'e-Auction (đấu giá ngược) cho NCC cạnh tranh giá theo thời gian thực, hiệu quả nhất với hàng leverage đã rõ spec.' },
  { id: 'q2', question: 'KPI "Maverick spend (%)" đo lường điều gì, và mức tốt là cao hay thấp?', options: ['Tỉ lệ giao hàng đúng hạn — càng cao càng tốt', 'Chi tiêu ngoài quy trình P2P được duyệt — càng THẤP càng tốt', 'Tỉ lệ tiết kiệm chi phí — càng cao càng tốt', 'Thời gian giao hàng của NCC — không có mức tốt/xấu'], correctIndex: 1, explanation: 'Maverick spend là chi tiêu đi ngoài quy trình chuẩn -> mục tiêu là giảm nó xuống thấp nhất.' },
  { id: 'q3', question: 'Ứng dụng của blockchain trong thu mua hiện đại thường liên quan đến việc gì?', options: ['Thay thế hoàn toàn hợp đồng giấy', 'Truy xuất nguồn gốc chống giả mạo qua nhiều tầng chuỗi cung ứng', 'Tính lương cho nhân viên thu mua', 'Chỉ dùng để gửi email cho nhà cung cấp'], correctIndex: 1, explanation: 'Blockchain hỗ trợ truy xuất nguồn gốc minh bạch, chống giả mạo — hữu ích xác minh cam kết bền vững/đạo đức.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'PCM301',
    slug: 'pcm301-procurement-management',
    title: 'Procurement Management',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/PCM301.webp',
    shortDescription: 'Procurement management: P2P process, spend analysis & the Kraljic matrix, RFx sourcing, negotiation & contracts, supplier relationship management, sustainable/ethical sourcing & risk, e-procurement & KPIs. Bilingual, with diagrams & quizzes.|||Quản trị thu mua: quy trình P2P, phân tích chi tiêu & ma trận Kraljic, tìm nguồn RFx, đàm phán & hợp đồng, quản trị quan hệ NCC, thu mua bền vững/đạo đức & rủi ro, e-procurement & KPI. Song ngữ, có sơ đồ & quiz.',
    description: 'Môn <strong>PCM301 — Procurement Management</strong> (kỳ 3, khối Quản trị Kinh doanh) dạy cách một tổ chức <strong>mua hàng hoá &amp; dịch vụ một cách chiến lược</strong>. Từ <strong>vai trò chiến lược &amp; "5 đúng"</strong> của thu mua → <strong>quy trình purchase-to-pay (P2P)</strong> và khớp 3 chiều → <strong>phân tích chi tiêu &amp; ma trận Kraljic</strong> → <strong>tìm nguồn &amp; đánh giá nhà cung cấp (RFI/RFP/RFQ)</strong> → <strong>đàm phán (BATNA) &amp; các loại hợp đồng</strong> → <strong>quản trị quan hệ nhà cung cấp (SRM)</strong> → <strong>thu mua bền vững, đạo đức &amp; rủi ro cung ứng</strong> → <strong>thu mua số (e-procurement) &amp; KPI</strong>. Bám giáo trình tham khảo Monczka và Baily/Farmer cùng khung CIPS, song ngữ, có sơ đồ quy trình, ví dụ tính toán và quiz mỗi chương.',
    whatYouLearn: '5 đúng của thu mua & vai trò chiến lược; quy trình purchase-to-pay (PR → PO → GRN → khớp 3 chiều → thanh toán); phân tích chi tiêu (ABC) & ma trận Kraljic (leverage/non-critical/bottleneck/strategic); RFI/RFP/RFQ & chấm điểm NCC theo trọng số; chuẩn bị đàm phán (BATNA), hợp đồng fixed price/cost-plus/T&M, SLA & Incoterms; SRM & vòng đời quan hệ NCC, scorecard hiệu suất; thu mua bền vững (triple bottom line), đạo đức (xung đột lợi ích, hối lộ), quản trị rủi ro cung ứng; e-procurement (e-catalog, e-auction, e-sourcing, ERP) & KPI (tiết kiệm, cycle time, maverick spend).',
    requirements: 'Không yêu cầu kiến thức chuyên sâu trước đó; nên đã quen khái niệm cơ bản về quản trị kinh doanh/chuỗi cung ứng. Xem điều kiện tiên quyết chính thức trong khung chương trình khối Quản trị Kinh doanh trên FLM.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình FLM, sách Monczka/Baily-Farmer, CIPS, tài liệu miễn phí, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Thu mua vs mua sắm vs SCM, vai trò chiến lược, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan & vai trò chiến lược|||Chapter 1 — Overview & strategic role', description: '5 đúng, từ giao dịch đến chiến lược.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Quy trình thu mua (P2P)|||Chapter 2 — Procurement process (P2P)', description: 'PR/PO/GRN, khớp 3 chiều, maverick spend.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Phân tích chi tiêu & Kraljic|||Chapter 3 — Spend analysis & Kraljic matrix', description: 'ABC analysis, ma trận Kraljic, chiến lược theo nhóm.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Tìm nguồn & đánh giá NCC (RFx)|||Chapter 4 — Sourcing & supplier evaluation (RFx)', description: 'RFI/RFP/RFQ, chấm điểm theo trọng số.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Đàm phán & hợp đồng|||Chapter 5 — Negotiation & contracts', description: 'BATNA, win-win vs win-lose, loại hợp đồng, SLA.', lessons: [c5, c5q] },
    { title: 'Chương 6 — SRM & hiệu suất|||Chapter 6 — Supplier relationship management (SRM)', description: 'Phân khúc NCC, vòng đời quan hệ, scorecard.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Bền vững, đạo đức & rủi ro|||Chapter 7 — Sustainability, ethics & risk', description: 'Triple bottom line, đạo đức, ma trận rủi ro.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Thu mua số & KPI|||Chapter 8 — Digital procurement & KPI', description: 'e-procurement, ERP, KPI, AI/blockchain.', lessons: [c8, c8q] },
  ],
};
