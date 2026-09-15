/**
 * TPM301 — Technology in Procurement Management. Giáo trình (trích dẫn, KHÔNG
 * upload PDF): "Digital Procurement" (Deloitte/CIPS whitepapers); "Purchasing
 * and Supply Chain Management" (Monczka — chương công nghệ); tài liệu SAP
 * Ariba/Coupa. Nhấn CÔNG NGHỆ & SỐ HOÁ thu mua (e-procurement, hệ thống, tự
 * động hoá, AI/blockchain) — không dựng lại quy trình/chiến lược của
 * PCM301/PSS301/SCM302. Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('tpm301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: whitepaper Deloitte/CIPS, sách Monczka (chương công nghệ), tài liệu SAP Ariba/Coupa, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">TPM301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn how <strong>technology reshapes procurement</strong> — e-procurement systems, e-sourcing, spend analytics, automation, blockchain and SaaS platforms — in one place. The official FPTU giáo trình &amp; slides live on <strong>FLM</strong>; below are free, publicly-cited resources this course draws on.</p>
<h3>📘 Core references (cited, not uploaded)</h3>
<ul>
<li><em>Digital Procurement</em> — Deloitte / CIPS whitepapers on digital transformation, e-sourcing and procurement analytics.</li>
<li><em>Purchasing and Supply Chain Management</em> — Monczka, Handfield, Giunipero, Patterson — chapters on procurement technology and e-procurement systems.</li>
<li>SAP Ariba &amp; Coupa public documentation — platform architecture, modules, implementation guides.</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.cips.org/knowledge/procurement-topics-and-skills/digital-procurement/" target="_blank" rel="noopener">CIPS — Digital procurement knowledge hub</a></li>
<li><a href="https://help.sap.com/docs/SAP_ARIBA" target="_blank" rel="noopener">SAP Ariba help documentation</a></li>
<li><a href="https://compass.coupa.com/" target="_blank" rel="noopener">Coupa Compass — product documentation</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@SAPAriba" target="_blank" rel="noopener">SAP Ariba</a> — product walkthroughs, e-sourcing &amp; P2P demos</li>
<li><a href="https://www.youtube.com/@CoupaSoftware" target="_blank" rel="noopener">Coupa Software</a> — spend management &amp; platform features</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.sap.com/products/spend-management/ariba-network.html" target="_blank" rel="noopener">SAP Ariba Network</a> — e-procurement &amp; supplier network</li>
<li><a href="https://www.coupa.com/" target="_blank" rel="noopener">Coupa</a> — cloud spend-management SaaS platform</li>
<li><a href="https://unspsc.org/" target="_blank" rel="noopener">UNSPSC</a> — standard commodity classification used in spend analytics</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — digital transformation drivers, Procure-to-Pay flow, e-sourcing vs e-auction vs e-tendering.</li>
<li><strong>Practice</strong> — read a public Ariba/Coupa module page and map it to a P2P step; build a mini spend cube from a sample dataset.</li>
<li><strong>Go deeper</strong> — spend analytics/BI, RPA &amp; AI use cases, blockchain/IoT traceability.</li>
<li><strong>Job-ready</strong> — compare SaaS platforms, understand implementation risk, data security and change management.</li>
</ol></div>`,
    `<span class="eyebrow">TPM301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>công nghệ thay đổi thu mua thế nào</strong> — hệ thống e-procurement, đấu thầu điện tử, phân tích chi tiêu, tự động hoá và nền tảng SaaS — gom về một chỗ. Giáo trình &amp; slide chính thức của FPTU nằm trên <strong>FLM</strong>; bên dưới là nguồn được trích dẫn công khai mà môn này dựa vào.</p>
<h3>📘 Nguồn trích dẫn chính (không upload)</h3>
<ul>
<li><em>Digital Procurement</em> — whitepaper Deloitte / CIPS về chuyển đổi số, đấu thầu điện tử và phân tích thu mua.</li>
<li><em>Purchasing and Supply Chain Management</em> — Monczka, Handfield, Giunipero, Patterson — chương công nghệ thu mua và hệ thống e-procurement.</li>
<li>Tài liệu công khai của SAP Ariba &amp; Coupa — kiến trúc nền tảng, các module, hướng dẫn triển khai.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.cips.org/knowledge/procurement-topics-and-skills/digital-procurement/" target="_blank" rel="noopener">CIPS — Trung tâm kiến thức thu mua số</a></li>
<li><a href="https://help.sap.com/docs/SAP_ARIBA" target="_blank" rel="noopener">Tài liệu hỗ trợ SAP Ariba</a></li>
<li><a href="https://compass.coupa.com/" target="_blank" rel="noopener">Coupa Compass — tài liệu sản phẩm</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@SAPAriba" target="_blank" rel="noopener">SAP Ariba</a> — giới thiệu sản phẩm, demo e-sourcing &amp; P2P</li>
<li><a href="https://www.youtube.com/@CoupaSoftware" target="_blank" rel="noopener">Coupa Software</a> — quản trị chi tiêu &amp; tính năng nền tảng</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.sap.com/products/spend-management/ariba-network.html" target="_blank" rel="noopener">SAP Ariba Network</a> — e-procurement &amp; mạng nhà cung cấp</li>
<li><a href="https://www.coupa.com/" target="_blank" rel="noopener">Coupa</a> — nền tảng SaaS quản trị chi tiêu trên mây</li>
<li><a href="https://unspsc.org/" target="_blank" rel="noopener">UNSPSC</a> — bảng phân loại hàng hoá chuẩn dùng trong phân tích chi tiêu</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — động lực chuyển đổi số, chuỗi Procure-to-Pay, phân biệt e-sourcing / e-auction / e-tendering.</li>
<li><strong>Luyện tập</strong> — đọc một trang module công khai của Ariba/Coupa và gắn vào đúng bước P2P; dựng thử một spend cube nhỏ từ dữ liệu mẫu.</li>
<li><strong>Đào sâu thực tế</strong> — phân tích chi tiêu/BI, ứng dụng RPA &amp; AI, blockchain/IoT minh bạch chuỗi cung.</li>
<li><strong>Sẵn sàng đi làm</strong> — so sánh các nền tảng SaaS, hiểu rủi ro triển khai, an ninh dữ liệu và quản trị thay đổi.</li>
</ol></div>`,
  ]]);

const intro = doc('tpm301-0-1-overview', 'Course overview: Technology in Procurement Management|||Tổng quan: Công nghệ trong Quản trị Thu mua',
  'Vì sao thu mua cần công nghệ; phân biệt TPM301 (công nghệ & số hoá) với PCM301/PSS301 (quy trình/chiến lược) và SCM302 (chuỗi cung); lộ trình 8 chương.',
  [[
    `<span class="eyebrow">TPM301 · Lesson 0.1 · Overview</span>
<h2>Technology in Procurement Management</h2>
<p class="lead">This course is about <strong>the technology layer of procurement</strong> — the systems, digital processes and emerging tools (e-procurement, e-sourcing, analytics, automation, blockchain, SaaS platforms) that make modern purchasing faster, more transparent and more controllable. It does <em>not</em> re-teach sourcing strategy or the supply-chain process itself — those live in <strong>PCM301</strong> (procurement process), <strong>PSS301</strong> (strategic sourcing) and <strong>SCM302</strong> (supply chain management).</p>
<h3>Why procurement needs technology</h3>
<ul>
<li><strong>Speed &amp; cost</strong> — manual, paper-based purchasing is slow, error-prone and hard to audit.</li>
<li><strong>Control &amp; compliance</strong> — digital workflows enforce approval limits and leave a full audit trail.</li>
<li><strong>Visibility</strong> — you cannot manage what you cannot measure; digital systems make spend data usable.</li>
<li><strong>Scale</strong> — as purchasing volume grows, only software (not more people) keeps pace.</li>
</ul>
<h3>Roadmap (8 chapters)</h3>
<p>Digital transformation overview → e-procurement &amp; e-Procure-to-Pay → e-sourcing / e-auction / e-tendering → e-catalogs &amp; digital contracts → spend analytics &amp; BI → RPA &amp; AI in procurement → blockchain, IoT &amp; supply-chain transparency → SaaS platforms (Ariba/Coupa), security &amp; implementation.</p>
<div class="callout"><span class="badge">Scope note</span> Where PCM301/PSS301/SCM302 ask "what should we buy, from whom, and how should the process flow", TPM301 asks "what <strong>system</strong> runs that process, and what <strong>technology</strong> makes it faster, cheaper and more transparent."</div>`,
    `<span class="eyebrow">TPM301 · Bài 0.1 · Tổng quan</span>
<h2>Công nghệ trong Quản trị Thu mua</h2>
<p class="lead">Môn này nói về <strong>lớp công nghệ của hoạt động thu mua</strong> — các hệ thống, quy trình số hoá và công cụ mới (e-procurement, e-sourcing, phân tích dữ liệu, tự động hoá, blockchain, nền tảng SaaS) giúp việc mua hàng hiện đại nhanh hơn, minh bạch hơn và kiểm soát được. Môn <em>không</em> dạy lại chiến lược sourcing hay quy trình chuỗi cung — những phần đó thuộc <strong>PCM301</strong> (quy trình thu mua), <strong>PSS301</strong> (sourcing chiến lược) và <strong>SCM302</strong> (quản trị chuỗi cung ứng).</p>
<h3>Vì sao thu mua cần công nghệ</h3>
<ul>
<li><strong>Tốc độ &amp; chi phí</strong> — mua hàng thủ công trên giấy chậm, dễ sai và khó truy vết.</li>
<li><strong>Kiểm soát &amp; tuân thủ</strong> — luồng công việc số hoá thực thi hạn mức phê duyệt và lưu vết đầy đủ.</li>
<li><strong>Minh bạch</strong> — không thể quản lý cái không đo được; hệ thống số hoá làm dữ liệu chi tiêu dùng được.</li>
<li><strong>Quy mô</strong> — khi khối lượng mua hàng tăng, chỉ phần mềm (không phải thêm người) mới theo kịp.</li>
</ul>
<h3>Lộ trình (8 chương)</h3>
<p>Tổng quan chuyển đổi số → e-procurement &amp; Procure-to-Pay điện tử → đấu thầu điện tử (e-sourcing/e-auction/e-tendering) → danh mục &amp; hợp đồng số → phân tích chi tiêu &amp; BI → RPA &amp; AI trong thu mua → blockchain, IoT &amp; minh bạch chuỗi cung → nền tảng SaaS (Ariba/Coupa), an ninh &amp; triển khai.</p>
<div class="callout"><span class="badge">Ghi chú phạm vi</span> Nếu PCM301/PSS301/SCM302 hỏi "nên mua gì, từ ai, quy trình chạy thế nào" thì TPM301 hỏi "<strong>hệ thống</strong> nào chạy quy trình đó, và <strong>công nghệ</strong> nào làm nó nhanh hơn, rẻ hơn, minh bạch hơn."</div>`,
  ]]);

const c1 = doc('tpm301-1-1-digital-transformation', '1.1 — Digital transformation in procurement|||1.1 — Chuyển đổi số trong thu mua',
  'Nỗi đau của thu mua thủ công; động lực chuyển đổi số; 4 nấc trưởng thành số (giấy → ERP → e-procurement → thu mua thông minh/tự vận hành).',
  [[
    `<span class="eyebrow">TPM301 · Chapter 1 · Lesson 1.1</span>
<h2>Digital transformation in procurement</h2>
<h3>The pain of manual procurement</h3>
<ul>
<li><strong>Slow cycle times</strong> — paper requisitions and email approvals can take days.</li>
<li><strong>No visibility</strong> — spend data sits in scattered spreadsheets, invisible to management until month-end.</li>
<li><strong>Maverick spend</strong> — buying outside approved contracts/suppliers because the "proper" process is too slow.</li>
<li><strong>Weak audit trail</strong> — hard to prove who approved what, and when, during a compliance check.</li>
</ul>
<h3>Digital maturity ladder</h3>
<pre><code>Stage 1: Paper / email       -> manual forms, no data trail
Stage 2: ERP module          -> basic PO/invoice in one system (e.g. SAP MM)
Stage 3: e-Procurement suite -> full P2P, e-sourcing, catalogs, analytics
Stage 4: Intelligent/autonomous -> AI-assisted decisions, RPA, predictive insight
</code></pre>
<p>Most large enterprises today sit between Stage 2 and Stage 3; Stage 4 is the emerging frontier this course revisits in chapters 6-7.</p>
<div class="callout"><span class="badge">Key driver</span> Digital transformation in procurement is driven by three forces: <strong>cost pressure</strong> (do more with less), <strong>risk/compliance</strong> (prove controls work), and <strong>data</strong> (spend visibility enables better decisions).</div>`,
    `<span class="eyebrow">TPM301 · Chương 1 · Bài 1.1</span>
<h2>Chuyển đổi số trong thu mua</h2>
<h3>Nỗi đau của thu mua thủ công</h3>
<ul>
<li><strong>Chu kỳ chậm</strong> — phiếu đề nghị mua trên giấy và phê duyệt qua email có thể mất nhiều ngày.</li>
<li><strong>Không thấy được toàn cảnh</strong> — dữ liệu chi tiêu nằm rải rác trên nhiều file Excel, chỉ hiện ra cuối tháng.</li>
<li><strong>Chi tiêu ngoài luồng (maverick spend)</strong> — mua ngoài hợp đồng/nhà cung cấp đã duyệt vì quy trình "đúng chuẩn" quá chậm.</li>
<li><strong>Vết kiểm toán yếu</strong> — khó chứng minh ai đã duyệt gì, lúc nào, khi bị kiểm tra tuân thủ.</li>
</ul>
<h3>Nấc thang trưởng thành số</h3>
<pre><code>Nấc 1: Giấy / email          -> phiếu tay, không có vết dữ liệu
Nấc 2: Module ERP            -> PO/hoá đơn cơ bản trong một hệ thống (vd SAP MM)
Nấc 3: Bộ e-Procurement      -> P2P đầy đủ, e-sourcing, catalog, phân tích
Nấc 4: Thông minh/tự vận hành -> quyết định có AI hỗ trợ, RPA, dự báo
</code></pre>
<p>Phần lớn doanh nghiệp lớn hiện nay đang ở giữa Nấc 2 và Nấc 3; Nấc 4 là biên giới mới mà môn quay lại ở chương 6-7.</p>
<div class="callout"><span class="badge">Động lực chính</span> Chuyển đổi số trong thu mua đến từ ba lực: <strong>sức ép chi phí</strong> (làm nhiều hơn với ít hơn), <strong>rủi ro/tuân thủ</strong> (chứng minh kiểm soát có hiệu lực), và <strong>dữ liệu</strong> (thấy được chi tiêu giúp quyết định tốt hơn).</div>`,
  ]]);

const c1q = quiz('tpm301-quiz-1', 'Quiz 1 — Digital transformation|||Quiz 1 — Chuyển đổi số', [
  { id: 'q1', question: 'Chi tiêu ngoài luồng (maverick spend) xảy ra khi?', options: ['Nhà cung cấp giao hàng trễ', 'Nhân viên mua ngoài hợp đồng/quy trình đã duyệt vì quy trình chính thức quá chậm', 'Hệ thống ERP bị lỗi', 'Giá nguyên liệu tăng'], correctIndex: 1, explanation: 'Maverick spend là hệ quả trực tiếp của quy trình mua hàng thủ công chậm.' },
  { id: 'q2', question: 'Ở nấc trưởng thành số nào thu mua có đầy đủ P2P, e-sourcing, catalog và phân tích trong một bộ?', options: ['Nấc 1 — Giấy/email', 'Nấc 2 — Module ERP', 'Nấc 3 — Bộ e-Procurement', 'Không nấc nào'], correctIndex: 2, explanation: 'Nấc 3 là bộ e-Procurement đầy đủ, hợp nhất P2P/e-sourcing/catalog/phân tích.' },
  { id: 'q3', question: 'Ba lực chính thúc đẩy chuyển đổi số trong thu mua là?', options: ['Thời trang công nghệ, quảng cáo, đối thủ', 'Sức ép chi phí, rủi ro/tuân thủ, dữ liệu', 'Lãi suất, tỷ giá, lạm phát', 'Thời tiết, mùa vụ, lễ tết'], correctIndex: 1, explanation: 'Ba động lực: chi phí, tuân thủ/rủi ro, và khả năng dùng dữ liệu.' },
]);

const c2 = doc('tpm301-2-1-e-procurement-p2p', '2.1 — e-Procurement systems & electronic Procure-to-Pay|||2.1 — Hệ thống e-procurement & Procure-to-Pay điện tử',
  'Chuỗi Procure-to-Pay (yêu cầu → duyệt → PO → nhận hàng → hoá đơn → thanh toán); đối chiếu 3 chiều (3-way match); hệ thống ERP module vs e-procurement độc lập.',
  [[
    `<span class="eyebrow">TPM301 · Chapter 2 · Lesson 2.1</span>
<h2>e-Procurement systems &amp; electronic Procure-to-Pay</h2>
<h3>The Procure-to-Pay (P2P) chain</h3>
<pre><code>Requisition -> Approval -> Purchase Order (PO)
            -> Goods Receipt -> Invoice -> 3-way match -> Payment
</code></pre>
<p>An <strong>electronic P2P</strong> system runs every one of those steps as a digital record instead of a paper form: the requester submits online, approval routes automatically by spend threshold, the PO is issued electronically to the supplier, goods receipt is confirmed in-system, and the invoice is matched before payment.</p>
<h3>3-way match</h3>
<p>Before an invoice is paid, the system automatically checks that three documents agree: the <strong>Purchase Order</strong> (what was ordered), the <strong>Goods Receipt</strong> (what actually arrived), and the <strong>Invoice</strong> (what the supplier is billing). A mismatch — wrong quantity, wrong price — blocks payment until resolved.</p>
<h3>Where the system lives</h3>
<ul>
<li><strong>ERP module</strong> (e.g. SAP MM, Oracle Procurement) — procurement built into the company's core system; strong integration, less specialised e-sourcing/analytics.</li>
<li><strong>Standalone e-procurement suite</strong> (e.g. SAP Ariba, Coupa) — purpose-built for purchasing, often integrated to the ERP for finance/accounting.</li>
</ul>
<div class="callout"><span class="badge">Why it matters</span> Electronic P2P is the backbone every later chapter builds on: e-sourcing feeds POs into it, e-catalogs speed up the requisition step, and spend analytics is built from the data it records.</div>`,
    `<span class="eyebrow">TPM301 · Chương 2 · Bài 2.1</span>
<h2>Hệ thống e-procurement &amp; Procure-to-Pay điện tử</h2>
<h3>Chuỗi Procure-to-Pay (P2P)</h3>
<pre><code>Yêu cầu mua -> Phê duyệt -> Đơn mua hàng (PO)
            -> Nhận hàng -> Hoá đơn -> Đối chiếu 3 chiều -> Thanh toán
</code></pre>
<p>Một hệ thống <strong>P2P điện tử</strong> chạy toàn bộ các bước đó dưới dạng bản ghi số thay vì phiếu giấy: người yêu cầu nộp online, phê duyệt tự định tuyến theo hạn mức chi, PO phát điện tử cho nhà cung cấp, nhận hàng xác nhận trong hệ thống, và hoá đơn được đối chiếu trước khi thanh toán.</p>
<h3>Đối chiếu 3 chiều (3-way match)</h3>
<p>Trước khi trả một hoá đơn, hệ thống tự động kiểm tra ba tài liệu có khớp nhau: <strong>Đơn mua hàng (PO)</strong> (đặt gì), <strong>Phiếu nhận hàng</strong> (thực nhận gì), và <strong>Hoá đơn</strong> (nhà cung cấp tính tiền gì). Lệch — sai số lượng, sai giá — sẽ chặn thanh toán cho tới khi giải quyết.</p>
<h3>Hệ thống nằm ở đâu</h3>
<ul>
<li><strong>Module ERP</strong> (vd SAP MM, Oracle Procurement) — thu mua tích hợp sẵn trong hệ thống lõi công ty; tích hợp mạnh, e-sourcing/phân tích chuyên sâu ít hơn.</li>
<li><strong>Bộ e-procurement độc lập</strong> (vd SAP Ariba, Coupa) — dựng riêng cho mua hàng, thường tích hợp sang ERP để phục vụ tài chính/kế toán.</li>
</ul>
<div class="callout"><span class="badge">Vì sao quan trọng</span> P2P điện tử là bộ xương mà mọi chương sau dựng lên trên: e-sourcing đưa PO vào đây, e-catalog làm nhanh bước yêu cầu, và phân tích chi tiêu được xây từ đúng dữ liệu nó ghi lại.</div>`,
  ]]);

const c2q = quiz('tpm301-quiz-2', 'Quiz 2 — e-Procurement & P2P|||Quiz 2 — e-Procurement & P2P', [
  { id: 'q1', question: 'Đối chiếu 3 chiều (3-way match) so khớp ba tài liệu nào?', options: ['Hợp đồng, catalog, PO', 'PO, Phiếu nhận hàng, Hoá đơn', 'RFQ, RFP, RFI', 'Ngân sách, dự báo, thực chi'], correctIndex: 1, explanation: '3-way match đối chiếu PO – nhận hàng – hoá đơn trước khi thanh toán.' },
  { id: 'q2', question: 'Chuỗi Procure-to-Pay đúng thứ tự là?', options: ['PO → Yêu cầu → Duyệt → Thanh toán', 'Yêu cầu → Duyệt → PO → Nhận hàng → Hoá đơn → Thanh toán', 'Thanh toán → Hoá đơn → PO', 'Duyệt → Thanh toán → Yêu cầu'], correctIndex: 1, explanation: 'P2P đi từ yêu cầu mua đến thanh toán, qua duyệt, PO, nhận hàng, hoá đơn.' },
  { id: 'q3', question: 'Khác biệt chính giữa module ERP và bộ e-procurement độc lập là?', options: ['ERP không lưu dữ liệu', 'e-procurement độc lập chuyên sâu cho mua hàng, thường tích hợp sang ERP', 'Chúng giống nhau hoàn toàn', 'ERP chỉ dùng cho kế toán'], correctIndex: 1, explanation: 'Module ERP tích hợp sẵn nhưng ít chuyên sâu; bộ độc lập (Ariba/Coupa) chuyên biệt hơn.' },
]);

const c3 = doc('tpm301-3-1-e-sourcing-auction-tendering', '3.1 — e-Sourcing, e-Auction & e-Tendering|||3.1 — Đấu thầu điện tử: e-sourcing, e-auction, e-tendering',
  'e-Sourcing (RFI/RFP/RFQ điện tử), e-tendering (đấu thầu công khai qua nền tảng số), e-auction (đấu giá ngược reverse auction) — cơ chế và khi nào dùng cái nào.',
  [[
    `<span class="eyebrow">TPM301 · Chapter 3 · Lesson 3.1</span>
<h2>e-Sourcing, e-Auction &amp; e-Tendering</h2>
<h3>e-Sourcing: the electronic RFI/RFP/RFQ</h3>
<p><strong>e-Sourcing</strong> platforms digitize the supplier-selection paperwork: an <strong>RFI</strong> (Request for Information) screens capability, an <strong>RFP</strong> (Request for Proposal) asks for a full solution and price, an <strong>RFQ</strong> (Request for Quotation) asks for a price on a defined spec. Doing this online means every supplier answers the same structured questions, on the same deadline, scored automatically.</p>
<h3>e-Tendering</h3>
<p><strong>e-Tendering</strong> runs a formal, often public/regulated bidding process entirely through a digital portal — bid submission, sealed opening, and evaluation are all logged, which is why it's common in public-sector and large-value procurement (audit and fairness matter most there).</p>
<h3>e-Auction — especially the reverse auction</h3>
<pre><code>Reverse auction mechanics:
 1. Buyer publishes specification + starting price ceiling
 2. Qualified suppliers see rivals' current best bid (anonymised)
 3. Suppliers repeatedly UNDERCUT each other's price, live
 4. Auction closes at a deadline; lowest qualifying bid wins
</code></pre>
<p>Unlike a normal auction (price goes up), a <strong>reverse auction</strong> drives price <em>down</em> because suppliers are competing to sell, not to buy. It works best for well-specified, commodity-like items where price is the deciding factor — not for complex, differentiated services.</p>
<div class="callout"><span class="badge">Picking the right tool</span> RFQ/e-tendering when the spec is fixed and you need a clean, defensible paper trail; reverse e-auction when you want live price competition on a commodity; RFP/RFI when you're still evaluating capability, not just price.</div>`,
    `<span class="eyebrow">TPM301 · Chương 3 · Bài 3.1</span>
<h2>Đấu thầu điện tử: e-sourcing, e-auction, e-tendering</h2>
<h3>e-Sourcing: RFI/RFP/RFQ điện tử</h3>
<p>Nền tảng <strong>e-Sourcing</strong> số hoá giấy tờ chọn nhà cung cấp: <strong>RFI</strong> (Request for Information) sàng lọc năng lực, <strong>RFP</strong> (Request for Proposal) yêu cầu giải pháp đầy đủ kèm giá, <strong>RFQ</strong> (Request for Quotation) yêu cầu giá trên một đặc tả đã xác định. Làm điều này trực tuyến nghĩa là mọi nhà cung cấp trả lời cùng bộ câu hỏi có cấu trúc, cùng hạn, được chấm tự động.</p>
<h3>e-Tendering</h3>
<p><strong>e-Tendering</strong> chạy một quy trình đấu thầu chính thức, thường công khai/có quy định, hoàn toàn qua cổng số — nộp hồ sơ, mở thầu, và đánh giá đều được ghi log, đó là lý do nó phổ biến trong mua sắm công và các gói giá trị lớn (nơi kiểm toán và công bằng quan trọng nhất).</p>
<h3>e-Auction — đặc biệt là đấu giá ngược</h3>
<pre><code>Cơ chế đấu giá ngược (reverse auction):
 1. Bên mua công bố đặc tả + giá trần khởi điểm
 2. Nhà cung cấp đủ điều kiện thấy giá tốt nhất hiện tại của đối thủ (ẩn danh)
 3. Các nhà cung cấp liên tục HẠ giá lẫn nhau, theo thời gian thực
 4. Đấu giá đóng theo hạn; giá thấp nhất đạt điều kiện thắng
</code></pre>
<p>Khác đấu giá thường (giá tăng lên), <strong>đấu giá ngược</strong> đẩy giá <em>xuống</em> vì nhà cung cấp đang cạnh tranh để bán, không phải để mua. Nó phù hợp nhất với hàng hoá có đặc tả rõ, dạng hàng thông thường (commodity) khi giá là yếu tố quyết định — không phù hợp với dịch vụ phức tạp, khác biệt hoá.</p>
<div class="callout"><span class="badge">Chọn đúng công cụ</span> RFQ/e-tendering khi đặc tả cố định và cần vết hồ sơ sạch, có thể bảo vệ được; đấu giá ngược khi muốn cạnh tranh giá trực tiếp trên hàng thông thường; RFP/RFI khi còn đang đánh giá năng lực, chưa chỉ nhìn vào giá.</div>`,
  ]]);

const c3q = quiz('tpm301-quiz-3', 'Quiz 3 — e-Sourcing/auction/tendering|||Quiz 3 — e-Sourcing/auction/tendering', [
  { id: 'q1', question: 'Trong đấu giá ngược (reverse auction), giá diễn biến thế nào?', options: ['Tăng dần vì người mua tranh nhau', 'Giảm dần vì nhà cung cấp tranh nhau bán', 'Cố định suốt cuộc đấu', 'Do bên mua tự đặt, không thay đổi'], correctIndex: 1, explanation: 'Đấu giá ngược: nhà cung cấp hạ giá để cạnh tranh bán, khác đấu giá thường.' },
  { id: 'q2', question: 'RFQ (Request for Quotation) phù hợp nhất khi?', options: ['Chưa biết đặc tả sản phẩm', 'Đặc tả đã xác định rõ, chỉ cần hỏi giá', 'Cần đánh giá năng lực tổng thể nhà cung cấp', 'Không cần văn bản gì'], correctIndex: 1, explanation: 'RFQ hỏi giá trên một đặc tả (spec) đã cố định.' },
  { id: 'q3', question: 'e-Tendering phổ biến trong mua sắm công vì?', options: ['Rẻ hơn e-auction', 'Toàn bộ nộp/mở/đánh giá thầu được ghi log, phục vụ minh bạch & kiểm toán', 'Không cần nhà cung cấp đăng ký', 'Chạy nhanh hơn mọi phương thức khác'], correctIndex: 1, explanation: 'e-Tendering ghi log toàn quy trình, đáp ứng yêu cầu minh bạch/công bằng của mua sắm công.' },
]);

const c4 = doc('tpm301-4-1-catalog-contract', '4.1 — e-Catalogs & digital contracts|||4.1 — Danh mục & catalog điện tử, hợp đồng số',
  'Catalog nội bộ vs punch-out (cXML/OCI); quản lý nội dung catalog; hợp đồng điện tử: chữ ký số, quản lý vòng đời hợp đồng (CLM), thư viện điều khoản, cảnh báo tái ký.',
  [[
    `<span class="eyebrow">TPM301 · Chapter 4 · Lesson 4.1</span>
<h2>e-Catalogs &amp; digital contracts</h2>
<h3>Two ways to shop from a catalog</h3>
<ul>
<li><strong>Hosted/internal catalog</strong> — pre-negotiated items are loaded directly into the buyer's e-procurement system; the requester picks and adds to cart without leaving the platform.</li>
<li><strong>Punch-out catalog</strong> — the requester is redirected to the supplier's own web store (their real-time pricing/stock), fills a cart there, and the cart is sent BACK into the buyer's system as a structured order. This round-trip runs on standards like <strong>cXML</strong> or <strong>OCI</strong>.</li>
</ul>
<pre><code>Punch-out flow:
 Buyer's e-Proc system -> (redirect) -> Supplier's web store
 User builds cart on supplier's site -> cart data sent back (cXML/OCI)
 -> becomes a requisition in the buyer's system, follows normal approval
</code></pre>
<h3>Digital contracts &amp; Contract Lifecycle Management (CLM)</h3>
<ul>
<li><strong>Digital/e-signature</strong> — legally binding sign-off without a printed page, speeding up execution.</li>
<li><strong>CLM system</strong> — tracks a contract from drafting → negotiation → signature → active → renewal/expiry, all in one record.</li>
<li><strong>Clause libraries</strong> — pre-approved, legally-vetted contract language that drafters reuse instead of writing from scratch.</li>
<li><strong>Renewal/expiry alerts</strong> — automatic reminders before a contract lapses, so procurement never gets caught buying off-contract by accident.</li>
</ul>
<div class="callout"><span class="badge">Why it matters</span> Catalogs make the FRONT of procurement (what gets ordered) fast and compliant; CLM makes the BACK of it (the legal agreement) visible instead of buried in someone's inbox.</div>`,
    `<span class="eyebrow">TPM301 · Chương 4 · Bài 4.1</span>
<h2>Danh mục &amp; catalog điện tử, hợp đồng số</h2>
<h3>Hai cách mua từ catalog</h3>
<ul>
<li><strong>Catalog nội bộ (hosted)</strong> — các mặt hàng đã đàm phán trước được nạp thẳng vào hệ thống e-procurement của bên mua; người yêu cầu chọn và thêm vào giỏ mà không rời khỏi nền tảng.</li>
<li><strong>Catalog punch-out</strong> — người yêu cầu được chuyển sang đúng cửa hàng web của nhà cung cấp (giá/kho thời gian thực), chọn hàng vào giỏ ở đó, rồi giỏ hàng được gửi NGƯỢC LẠI hệ thống bên mua dưới dạng đơn có cấu trúc. Vòng qua-lại này chạy theo chuẩn như <strong>cXML</strong> hoặc <strong>OCI</strong>.</li>
</ul>
<pre><code>Luồng punch-out:
 Hệ thống e-Proc bên mua -> (chuyển hướng) -> Cửa hàng web nhà cung cấp
 Người dùng chọn hàng trên site NCC -> dữ liệu giỏ hàng gửi về (cXML/OCI)
 -> thành một yêu cầu mua trong hệ thống bên mua, đi qua phê duyệt bình thường
</code></pre>
<h3>Hợp đồng số &amp; Quản lý vòng đời hợp đồng (CLM)</h3>
<ul>
<li><strong>Chữ ký số / e-signature</strong> — ký có giá trị pháp lý mà không cần in giấy, làm nhanh việc ký kết.</li>
<li><strong>Hệ thống CLM</strong> — theo dõi hợp đồng từ soạn thảo → đàm phán → ký → hiệu lực → tái ký/hết hạn, tất cả trong một bản ghi.</li>
<li><strong>Thư viện điều khoản (clause library)</strong> — ngôn ngữ hợp đồng đã được pháp lý duyệt trước, người soạn dùng lại thay vì viết từ đầu.</li>
<li><strong>Cảnh báo tái ký/hết hạn</strong> — nhắc tự động trước khi hợp đồng hết hiệu lực, để thu mua không bao giờ vô tình mua ngoài hợp đồng.</li>
</ul>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Catalog làm nhanh &amp; đúng tuân thủ phần ĐẦU của thu mua (đặt hàng gì); CLM làm hiện rõ phần SAU của nó (thoả thuận pháp lý) thay vì chôn trong hộp mail của ai đó.</div>`,
  ]]);

const c4q = quiz('tpm301-quiz-4', 'Quiz 4 — Catalog & digital contracts|||Quiz 4 — Catalog & hợp đồng số', [
  { id: 'q1', question: 'Catalog punch-out khác catalog nội bộ ở điểm nào?', options: ['Không cần chuẩn kỹ thuật gì', 'Người dùng chuyển sang web nhà cung cấp, giỏ hàng gửi ngược về qua cXML/OCI', 'Chỉ dùng được cho hàng miễn phí', 'Không đi qua phê duyệt'], correctIndex: 1, explanation: 'Punch-out redirect sang site NCC, dữ liệu giỏ hàng gửi về qua chuẩn cXML/OCI.' },
  { id: 'q2', question: 'Hệ thống CLM (Contract Lifecycle Management) dùng để?', options: ['Đấu giá ngược', 'Theo dõi hợp đồng từ soạn thảo đến tái ký/hết hạn', 'Đối chiếu 3 chiều hoá đơn', 'Phân loại hàng hoá theo UNSPSC'], correctIndex: 1, explanation: 'CLM quản lý toàn vòng đời hợp đồng, không phải đối chiếu hoá đơn hay đấu giá.' },
  { id: 'q3', question: 'Thư viện điều khoản (clause library) giúp gì?', options: ['Tăng giá hợp đồng', 'Tái sử dụng ngôn ngữ hợp đồng đã được pháp lý duyệt trước, thay vì viết lại từ đầu', 'Xoá bỏ nhu cầu ký hợp đồng', 'Chỉ dùng cho catalog nội bộ'], correctIndex: 1, explanation: 'Clause library là ngôn ngữ hợp đồng đã duyệt, tái dùng để soạn nhanh và an toàn pháp lý.' },
]);

const c5 = doc('tpm301-5-1-spend-analytics-bi', '5.1 — Spend analytics & BI in procurement|||5.1 — Phân tích dữ liệu chi tiêu (spend analytics) & BI trong thu mua',
  'Spend cube (nhà cung cấp/danh mục/đơn vị/thời gian); làm sạch & phân loại dữ liệu (UNSPSC); dashboard BI; KPI: tiết kiệm, maverick spend, tập trung nhà cung cấp.',
  [[
    `<span class="eyebrow">TPM301 · Chapter 5 · Lesson 5.1</span>
<h2>Spend analytics &amp; BI in procurement</h2>
<h3>The spend cube</h3>
<p>Raw purchasing data becomes useful once it's organised into a <strong>spend cube</strong> — the same transaction viewed along several dimensions at once: <strong>who</strong> we bought from (supplier), <strong>what</strong> we bought (category/commodity), <strong>who inside the company</strong> bought it (business unit), and <strong>when</strong> (time period). Slicing the cube along any dimension answers a different question — "how much do we spend with Supplier X across all units?" or "how much does Marketing spend on IT hardware?"</p>
<h3>Data cleansing &amp; classification</h3>
<p>Before analysis, raw data must be cleaned: duplicate supplier names merged ("ABC Co." vs "ABC Company"), missing fields filled, and every line item tagged with a standard commodity code — most commonly <strong>UNSPSC</strong> — so items are comparable across departments and systems.</p>
<pre><code>Spend cube dimensions:
  Supplier  x  Category (UNSPSC)  x  Business Unit  x  Time period
</code></pre>
<h3>Key KPIs a BI dashboard tracks</h3>
<ul>
<li><strong>Savings realized vs. negotiated</strong> — did the discount agreed at sourcing actually show up in what we paid?</li>
<li><strong>Maverick spend %</strong> — share of spend happening outside approved contracts/catalogs.</li>
<li><strong>Supplier concentration</strong> — how much spend sits with a small number of suppliers (a concentration risk signal).</li>
</ul>
<div class="callout"><span class="badge">Why it matters</span> You cannot negotiate, consolidate, or reduce risk on spend you cannot see. Analytics/BI turns thousands of transactions into the three or four numbers a procurement leader actually acts on.</div>`,
    `<span class="eyebrow">TPM301 · Chương 5 · Bài 5.1</span>
<h2>Phân tích dữ liệu chi tiêu &amp; BI trong thu mua</h2>
<h3>Spend cube</h3>
<p>Dữ liệu mua hàng thô chỉ có giá trị khi được sắp vào một <strong>spend cube</strong> — cùng một giao dịch nhưng nhìn theo nhiều chiều đồng thời: <strong>mua từ ai</strong> (nhà cung cấp), <strong>mua gì</strong> (danh mục/hàng hoá), <strong>ai trong công ty mua</strong> (đơn vị kinh doanh), và <strong>khi nào</strong> (kỳ thời gian). Cắt lát cube theo từng chiều trả lời một câu hỏi khác nhau — "tổng chi cho Nhà cung cấp X trên toàn công ty là bao nhiêu?" hoặc "phòng Marketing chi bao nhiêu cho phần cứng IT?"</p>
<h3>Làm sạch &amp; phân loại dữ liệu</h3>
<p>Trước khi phân tích, dữ liệu thô phải được làm sạch: gộp tên nhà cung cấp trùng ("Công ty ABC" vs "ABC Co."), điền trường thiếu, và gắn mỗi dòng hàng vào một mã hàng hoá chuẩn — phổ biến nhất là <strong>UNSPSC</strong> — để có thể so sánh hàng hoá giữa các phòng ban và hệ thống.</p>
<pre><code>Các chiều của spend cube:
  Nhà cung cấp  x  Danh mục (UNSPSC)  x  Đơn vị kinh doanh  x  Kỳ thời gian
</code></pre>
<h3>KPI chính mà dashboard BI theo dõi</h3>
<ul>
<li><strong>Tiết kiệm thực tế so với đã đàm phán</strong> — mức giảm giá thoả thuận lúc sourcing có thực sự phản ánh vào số tiền đã trả không?</li>
<li><strong>% chi tiêu ngoài luồng (maverick spend)</strong> — phần chi tiêu xảy ra ngoài hợp đồng/catalog đã duyệt.</li>
<li><strong>Mức tập trung nhà cung cấp</strong> — bao nhiêu chi tiêu nằm ở một số ít nhà cung cấp (dấu hiệu rủi ro tập trung).</li>
</ul>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Không thể đàm phán, hợp nhất, hay giảm rủi ro trên phần chi tiêu mà mình không thấy được. Phân tích/BI biến hàng nghìn giao dịch thành ba-bốn con số mà lãnh đạo thu mua thực sự hành động theo.</div>`,
  ]]);

const c5q = quiz('tpm301-quiz-5', 'Quiz 5 — Spend analytics & BI|||Quiz 5 — Spend analytics & BI', [
  { id: 'q1', question: 'Spend cube tổ chức dữ liệu chi tiêu theo các chiều nào?', options: ['Chỉ theo thời gian', 'Nhà cung cấp, danh mục, đơn vị kinh doanh, thời gian', 'Chỉ theo giá', 'Chỉ theo số lượng đơn hàng'], correctIndex: 1, explanation: 'Spend cube nhìn cùng dữ liệu theo 4 chiều: nhà cung cấp/danh mục/đơn vị/thời gian.' },
  { id: 'q2', question: 'UNSPSC được dùng để làm gì trong phân tích chi tiêu?', options: ['Ký hợp đồng số', 'Chuẩn hoá/phân loại mã hàng hoá để so sánh được giữa phòng ban, hệ thống', 'Chạy đấu giá ngược', 'Gửi hoá đơn điện tử'], correctIndex: 1, explanation: 'UNSPSC là bảng phân loại hàng hoá chuẩn, phục vụ làm sạch & so sánh dữ liệu chi tiêu.' },
  { id: 'q3', question: '"Maverick spend %" trong dashboard BI đo lường điều gì?', options: ['Tỷ lệ hàng lỗi', 'Tỷ lệ chi tiêu xảy ra ngoài hợp đồng/catalog đã duyệt', 'Tỷ lệ nhân viên nghỉ việc', 'Tỷ lệ nhà cung cấp mới'], correctIndex: 1, explanation: 'Maverick spend % là phần chi tiêu ngoài luồng đã duyệt — một KPI kiểm soát quan trọng.' },
]);

const c6 = doc('tpm301-6-1-rpa-ai', '6.1 — RPA & AI in procurement|||6.1 — Tự động hoá quy trình (RPA) & AI trong thu mua',
  'RPA cho việc lặp lại (tạo PO, đối chiếu hoá đơn); AI: chatbot hỗ trợ nhà cung cấp, dự báo nhu cầu, trích xuất điều khoản hợp đồng bằng NLP.',
  [[
    `<span class="eyebrow">TPM301 · Chapter 6 · Lesson 6.1</span>
<h2>RPA &amp; AI in procurement</h2>
<h3>RPA — automating the repetitive</h3>
<p><strong>Robotic Process Automation (RPA)</strong> uses software "bots" that mimic a human clicking through a screen — reading a field, copying a value, filling a form — to run high-volume, rule-based tasks without changing the underlying systems. In procurement it typically handles:</p>
<ul>
<li>Auto-creating a <strong>PO</strong> from an approved requisition that matches a known catalog item.</li>
<li>Running the <strong>3-way invoice match</strong> and flagging only the exceptions for a human to review.</li>
<li>Pulling supplier master-data updates into multiple systems at once.</li>
</ul>
<p>RPA is <em>rule-based</em>: it follows fixed if/then logic, so it's fast and cheap to deploy, but it breaks if the input format changes unexpectedly.</p>
<h3>Where AI goes further</h3>
<ul>
<li><strong>Chatbots / virtual assistants</strong> — answer routine supplier or requester questions ("where is my order?") without a human agent.</li>
<li><strong>Demand forecasting (ML)</strong> — predicts future purchase volumes from historical patterns, feeding better negotiated volumes into sourcing.</li>
<li><strong>NLP contract-clause extraction</strong> — reads scanned/PDF contracts and automatically pulls out key terms (payment terms, renewal date, liability cap) into a structured database.</li>
</ul>
<pre><code>RPA:  fixed rules, structured data, "do exactly this, every time"
AI:   learns patterns, handles unstructured input, makes a judgment call
</code></pre>
<div class="callout"><span class="badge">Not either/or</span> Mature procurement functions layer both: RPA clears the repetitive volume, freeing buyers for the judgment calls AI then helps them make faster.</div>`,
    `<span class="eyebrow">TPM301 · Chương 6 · Bài 6.1</span>
<h2>RPA &amp; AI trong thu mua</h2>
<h3>RPA — tự động hoá việc lặp lại</h3>
<p><strong>Robotic Process Automation (RPA)</strong> dùng "bot" phần mềm mô phỏng người dùng bấm qua màn hình — đọc một trường, sao chép giá trị, điền vào form — để chạy các việc lặp lại, theo quy tắc, với khối lượng lớn mà không cần đổi hệ thống nền. Trong thu mua, RPA thường xử lý:</p>
<ul>
<li>Tự tạo <strong>PO</strong> từ một yêu cầu đã duyệt khớp với mặt hàng catalog đã biết.</li>
<li>Chạy <strong>đối chiếu hoá đơn 3 chiều</strong> và chỉ báo lên các trường hợp bất thường cho người xem lại.</li>
<li>Kéo cập nhật dữ liệu chủ nhà cung cấp vào nhiều hệ thống cùng lúc.</li>
</ul>
<p>RPA chạy <em>theo quy tắc</em>: tuân theo logic if/then cố định, nên triển khai nhanh và rẻ, nhưng dễ vỡ nếu định dạng đầu vào thay đổi bất ngờ.</p>
<h3>AI đi xa hơn ở đâu</h3>
<ul>
<li><strong>Chatbot / trợ lý ảo</strong> — trả lời câu hỏi thường gặp của nhà cung cấp hoặc người yêu cầu ("đơn của tôi đang ở đâu?") mà không cần nhân viên trực.</li>
<li><strong>Dự báo nhu cầu (ML)</strong> — dự đoán khối lượng mua tương lai từ dữ liệu lịch sử, đưa vào sourcing để đàm phán khối lượng tốt hơn.</li>
<li><strong>Trích xuất điều khoản hợp đồng bằng NLP</strong> — đọc hợp đồng dạng scan/PDF và tự động rút ra các điều khoản chính (điều kiện thanh toán, ngày tái ký, trần trách nhiệm) vào cơ sở dữ liệu có cấu trúc.</li>
</ul>
<pre><code>RPA:  quy tắc cố định, dữ liệu có cấu trúc, "làm đúng thế này, mọi lần"
AI:   học mẫu hình, xử lý đầu vào không cấu trúc, đưa ra phán đoán
</code></pre>
<div class="callout"><span class="badge">Không phải chọn một</span> Các bộ phận thu mua trưởng thành dùng cả hai: RPA dọn sạch khối lượng lặp lại, giải phóng người mua cho các phán đoán mà AI sau đó giúp họ làm nhanh hơn.</div>`,
  ]]);

const c6q = quiz('tpm301-quiz-6', 'Quiz 6 — RPA & AI|||Quiz 6 — RPA & AI', [
  { id: 'q1', question: 'RPA phù hợp nhất với loại việc nào trong thu mua?', options: ['Việc cần phán đoán phức tạp, không có quy tắc rõ', 'Việc lặp lại, theo quy tắc cố định, khối lượng lớn', 'Việc chỉ xảy ra một lần', 'Việc cần sáng tạo nội dung mới'], correctIndex: 1, explanation: 'RPA chạy theo quy tắc if/then cố định, phù hợp việc lặp lại khối lượng lớn.' },
  { id: 'q2', question: 'NLP trong thu mua thường được dùng để?', options: ['Đấu giá ngược', 'Trích xuất điều khoản chính từ hợp đồng scan/PDF vào dữ liệu có cấu trúc', 'Tạo catalog punch-out', 'Đối chiếu 3 chiều'], correctIndex: 1, explanation: 'NLP đọc hợp đồng và rút ra điều khoản (thanh toán, tái ký, trách nhiệm) tự động.' },
  { id: 'q3', question: 'Khác biệt cốt lõi giữa RPA và AI là?', options: ['Không có khác biệt', 'RPA theo quy tắc cố định; AI học mẫu hình và xử lý đầu vào không cấu trúc', 'RPA chỉ dùng cho tài chính', 'AI luôn rẻ hơn RPA'], correctIndex: 1, explanation: 'RPA tuân quy tắc cố định; AI học từ dữ liệu và đưa phán đoán trên đầu vào không cấu trúc.' },
]);

const c7 = doc('tpm301-7-1-blockchain-iot', '7.1 — Blockchain, IoT & supply-chain transparency|||7.1 — Blockchain, IoT & minh bạch chuỗi cung',
  'Smart contract tự kích hoạt thanh toán; blockchain cho khả năng truy xuất nguồn gốc (provenance); IoT theo dõi vận chuyển & điều kiện hàng hoá; kết hợp cho minh bạch chuỗi cung.',
  [[
    `<span class="eyebrow">TPM301 · Chapter 7 · Lesson 7.1</span>
<h2>Blockchain, IoT &amp; supply-chain transparency</h2>
<h3>Blockchain: a shared, tamper-resistant ledger</h3>
<p>A <strong>blockchain</strong> is a record of transactions shared across every party in a supply chain, where each new entry is cryptographically linked to the one before — making past entries effectively impossible to alter quietly. For procurement, that solves a specific problem: today, buyer, supplier and logistics provider each keep their <em>own</em> record of the same shipment, and reconciling them is slow and disputable.</p>
<h3>Smart contracts</h3>
<p>A <strong>smart contract</strong> is code stored on the blockchain that executes automatically when a condition is met — e.g. "release payment to the supplier the moment the IoT sensor confirms delivery at the warehouse." This removes the manual step of someone checking a delivery note before triggering payment.</p>
<h3>IoT: sensing the physical shipment</h3>
<ul>
<li><strong>Location tracking</strong> — GPS tags confirm where a shipment actually is, in real time.</li>
<li><strong>Condition monitoring</strong> — temperature/humidity sensors on sensitive goods (food, pharma) prove the cold chain was never broken.</li>
</ul>
<pre><code>IoT sensor reads shipment data
   -> written to the shared blockchain ledger (all parties see the same record)
   -> smart contract checks the condition
   -> payment/next step triggers automatically, no manual sign-off needed
</code></pre>
<div class="callout"><span class="badge">Provenance</span> Combined, blockchain + IoT let a buyer prove exactly where a product (or its raw materials) came from and how it was handled — increasingly required for ethical sourcing and regulatory compliance.</div>`,
    `<span class="eyebrow">TPM301 · Chương 7 · Bài 7.1</span>
<h2>Blockchain, IoT &amp; minh bạch chuỗi cung</h2>
<h3>Blockchain: sổ cái dùng chung, khó bị sửa</h3>
<p><strong>Blockchain</strong> là một sổ ghi giao dịch được chia sẻ giữa mọi bên trong chuỗi cung, trong đó mỗi mục mới được liên kết mã hoá với mục trước đó — khiến việc sửa lặng lẽ các mục cũ gần như không thể. Với thu mua, điều này giải quyết một vấn đề cụ thể: hiện nay bên mua, nhà cung cấp và đơn vị logistics mỗi bên giữ <em>bản ghi riêng</em> của cùng một lô hàng, và đối soát chúng chậm và dễ tranh cãi.</p>
<h3>Hợp đồng thông minh (smart contract)</h3>
<p>Một <strong>smart contract</strong> là mã lưu trên blockchain, tự thực thi khi một điều kiện được đáp ứng — vd "giải ngân thanh toán cho nhà cung cấp ngay khi cảm biến IoT xác nhận đã giao tới kho." Điều này bỏ đi bước thủ công phải có người kiểm phiếu giao hàng trước khi kích hoạt thanh toán.</p>
<h3>IoT: cảm nhận lô hàng vật lý</h3>
<ul>
<li><strong>Theo dõi vị trí</strong> — thẻ GPS xác nhận lô hàng đang thực sự ở đâu, theo thời gian thực.</li>
<li><strong>Giám sát điều kiện</strong> — cảm biến nhiệt độ/độ ẩm trên hàng nhạy cảm (thực phẩm, dược) chứng minh chuỗi lạnh chưa từng bị ngắt.</li>
</ul>
<pre><code>Cảm biến IoT đọc dữ liệu lô hàng
   -> ghi vào sổ blockchain dùng chung (mọi bên thấy cùng một bản ghi)
   -> smart contract kiểm tra điều kiện
   -> thanh toán/bước kế tiếp tự kích hoạt, không cần ký duyệt tay
</code></pre>
<div class="callout"><span class="badge">Truy xuất nguồn gốc</span> Kết hợp blockchain + IoT cho phép bên mua chứng minh chính xác sản phẩm (hoặc nguyên liệu của nó) đến từ đâu và được xử lý thế nào — ngày càng bắt buộc với sourcing có đạo đức và tuân thủ quy định.</div>`,
  ]]);

const c7q = quiz('tpm301-quiz-7', 'Quiz 7 — Blockchain & IoT|||Quiz 7 — Blockchain & IoT', [
  { id: 'q1', question: 'Vấn đề chính blockchain giải quyết trong chuỗi cung là gì?', options: ['Giá hàng hoá biến động', 'Mỗi bên giữ bản ghi riêng của cùng giao dịch, đối soát chậm và dễ tranh cãi', 'Thiếu nhà cung cấp', 'Chi phí vận chuyển cao'], correctIndex: 1, explanation: 'Blockchain tạo sổ ghi dùng chung, khó sửa, thay cho các bản ghi riêng lẻ khó đối soát.' },
  { id: 'q2', question: 'Smart contract hoạt động bằng cách nào?', options: ['Cần người duyệt tay mọi bước', 'Tự động thực thi khi một điều kiện được đáp ứng, ví dụ xác nhận giao hàng', 'Chỉ dùng để ký hợp đồng giấy', 'Không liên quan blockchain'], correctIndex: 1, explanation: 'Smart contract là mã trên blockchain, tự chạy khi điều kiện đã định được thoả.' },
  { id: 'q3', question: 'IoT đóng vai trò gì trong minh bạch chuỗi cung?', options: ['Thay thế hoàn toàn con người trong đàm phán giá', 'Cảm nhận vị trí & điều kiện vật lý thực tế của lô hàng (GPS, nhiệt độ...)', 'Chỉ dùng để gửi email', 'Không liên quan đến chuỗi cung'], correctIndex: 1, explanation: 'IoT cung cấp dữ liệu thực tế (vị trí, điều kiện) làm đầu vào cho smart contract/blockchain.' },
]);

const c8 = doc('tpm301-8-1-saas-security-implementation', '8.1 — SaaS procurement platforms, security & implementation|||8.1 — Nền tảng SaaS thu mua (Ariba/Coupa), an ninh & triển khai công nghệ',
  'Kiến trúc SaaS vs on-premise; tổng quan module Ariba/Coupa; rủi ro triển khai (tích hợp, di chuyển dữ liệu, quản trị thay đổi); an ninh: kiểm soát truy cập, bảo mật dữ liệu, rủi ro nhà cung cấp cloud.',
  [[
    `<span class="eyebrow">TPM301 · Chapter 8 · Lesson 8.1</span>
<h2>SaaS procurement platforms, security &amp; implementation</h2>
<h3>SaaS vs on-premise</h3>
<p>An <strong>on-premise</strong> system runs on the company's own servers — full control, but the company owns every upgrade and maintenance cost. A <strong>SaaS (Software-as-a-Service)</strong> platform like <strong>SAP Ariba</strong> or <strong>Coupa</strong> runs in the vendor's cloud: the buyer accesses it over the internet, the vendor handles upgrades, uptime and infrastructure, and the buyer pays a subscription instead of running its own data center.</p>
<h3>What these platforms typically bundle</h3>
<ul>
<li><strong>Sourcing/e-auction module</strong> — RFx and reverse auction tooling (chapter 3).</li>
<li><strong>Procurement/P2P module</strong> — requisition-to-payment, catalogs, punch-out (chapters 2 &amp; 4).</li>
<li><strong>Supplier network</strong> — a shared marketplace connecting many buyers to many suppliers on one platform.</li>
<li><strong>Analytics/spend visibility module</strong> — the BI layer from chapter 5, built in rather than bolted on.</li>
</ul>
<h3>Implementation risk</h3>
<pre><code>Common failure points when rolling out a SaaS procurement platform:
  Integration     -> connecting to the existing ERP/finance system (APIs, EDI)
  Data migration  -> supplier master data & historical spend must move cleanly
  Change management -> buyers/suppliers must actually adopt the new workflow
</code></pre>
<h3>Security in a cloud platform</h3>
<ul>
<li><strong>Access control</strong> — role-based permissions so only authorized users approve spend at each threshold.</li>
<li><strong>Data privacy</strong> — supplier pricing and contract terms are commercially sensitive; the vendor's data handling must be contractually specified.</li>
<li><strong>Vendor/cloud risk</strong> — the buyer's procurement data now depends on a third party's uptime and security posture, not just its own IT.</li>
</ul>
<div class="callout"><span class="badge">Closing the loop</span> Every chapter of this course — e-procurement, e-sourcing, catalogs, analytics, RPA/AI, blockchain/IoT — usually ships as modules INSIDE a platform like this. Choosing and rolling one out well is the practical endpoint of "technology in procurement management."</div>`,
    `<span class="eyebrow">TPM301 · Chương 8 · Bài 8.1</span>
<h2>Nền tảng SaaS thu mua, an ninh &amp; triển khai công nghệ</h2>
<h3>SaaS vs on-premise</h3>
<p>Hệ thống <strong>on-premise</strong> chạy trên máy chủ riêng của công ty — kiểm soát toàn phần, nhưng công ty tự chịu mọi chi phí nâng cấp và vận hành. Nền tảng <strong>SaaS (Software-as-a-Service)</strong> như <strong>SAP Ariba</strong> hay <strong>Coupa</strong> chạy trên cloud của nhà cung cấp: bên mua truy cập qua internet, nhà cung cấp lo nâng cấp, thời gian hoạt động và hạ tầng, còn bên mua trả phí thuê thay vì tự vận hành trung tâm dữ liệu.</p>
<h3>Các nền tảng này thường tích hợp gì</h3>
<ul>
<li><strong>Module sourcing/e-auction</strong> — công cụ RFx và đấu giá ngược (chương 3).</li>
<li><strong>Module Procurement/P2P</strong> — từ yêu cầu đến thanh toán, catalog, punch-out (chương 2 &amp; 4).</li>
<li><strong>Mạng nhà cung cấp (supplier network)</strong> — một chợ dùng chung kết nối nhiều bên mua với nhiều nhà cung cấp trên một nền tảng.</li>
<li><strong>Module phân tích/hiển thị chi tiêu</strong> — lớp BI từ chương 5, tích hợp sẵn thay vì gắn thêm.</li>
</ul>
<h3>Rủi ro triển khai</h3>
<pre><code>Điểm hay thất bại khi triển khai nền tảng SaaS thu mua:
  Tích hợp       -> kết nối với ERP/hệ thống tài chính hiện có (API, EDI)
  Di chuyển dữ liệu -> dữ liệu chủ nhà cung cấp & lịch sử chi tiêu phải chuyển sạch
  Quản trị thay đổi -> người mua/nhà cung cấp phải THỰC SỰ dùng luồng mới
</code></pre>
<h3>An ninh trong nền tảng cloud</h3>
<ul>
<li><strong>Kiểm soát truy cập</strong> — phân quyền theo vai trò để chỉ người được phép duyệt chi ở đúng hạn mức.</li>
<li><strong>Bảo mật dữ liệu</strong> — giá nhà cung cấp và điều khoản hợp đồng nhạy cảm về thương mại; cách nhà cung cấp nền tảng xử lý dữ liệu phải được quy định rõ trong hợp đồng.</li>
<li><strong>Rủi ro nhà cung cấp/cloud</strong> — dữ liệu thu mua của bên mua giờ phụ thuộc vào thời gian hoạt động và mức an ninh của bên thứ ba, không chỉ IT nội bộ.</li>
</ul>
<div class="callout"><span class="badge">Khép vòng</span> Mọi chương của môn này — e-procurement, e-sourcing, catalog, phân tích, RPA/AI, blockchain/IoT — thường được đóng gói thành các module BÊN TRONG một nền tảng như thế này. Chọn đúng và triển khai tốt một nền tảng chính là đích thực hành của "công nghệ trong quản trị thu mua."</div>`,
  ]]);

const c8q = quiz('tpm301-quiz-8', 'Quiz 8 — SaaS platforms & security|||Quiz 8 — Nền tảng SaaS & an ninh', [
  { id: 'q1', question: 'Khác biệt chính giữa SaaS và on-premise là?', options: ['SaaS không có module phân tích', 'SaaS chạy trên cloud nhà cung cấp, trả phí thuê; on-premise tự vận hành hạ tầng riêng', 'On-premise luôn rẻ hơn', 'Không có khác biệt thực tế'], correctIndex: 1, explanation: 'SaaS: cloud của vendor, trả subscription; on-premise: công ty tự lo hạ tầng & nâng cấp.' },
  { id: 'q2', question: 'Ba điểm rủi ro triển khai phổ biến của nền tảng SaaS thu mua là?', options: ['Giá, thời tiết, mùa vụ', 'Tích hợp với ERP, di chuyển dữ liệu, quản trị thay đổi', 'Chỉ có vấn đề bảo mật mạng', 'Không có rủi ro nào vì là cloud'], correctIndex: 1, explanation: 'Tích hợp hệ thống, di chuyển dữ liệu sạch, và người dùng thực sự đổi thói quen là ba điểm hay vỡ.' },
  { id: 'q3', question: 'Rủi ro nhà cung cấp/cloud trong an ninh nền tảng SaaS nghĩa là?', options: ['Không có rủi ro vì vendor luôn an toàn', 'Dữ liệu thu mua của công ty phụ thuộc vào an ninh & uptime của bên thứ ba', 'Chỉ ảnh hưởng tới giá dịch vụ', 'Chỉ xảy ra với on-premise'], correctIndex: 1, explanation: 'Chuyển lên cloud nghĩa là dữ liệu phụ thuộc thêm vào bảo mật/vận hành của nhà cung cấp nền tảng.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'TPM301',
    slug: 'tpm301-technology-in-procurement-management',
    title: 'Technology in Procurement Management',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/TPM301.webp',
    shortDescription: 'How tech reshapes procurement — e-procurement & Procure-to-Pay, e-sourcing/auction/tendering, e-catalogs & digital contracts, spend analytics, RPA & AI, blockchain/IoT, SaaS platforms (Ariba/Coupa) & security.|||Công nghệ thay đổi thu mua thế nào — e-procurement & Procure-to-Pay, đấu thầu điện tử, catalog & hợp đồng số, phân tích chi tiêu, RPA & AI, blockchain/IoT, nền tảng SaaS (Ariba/Coupa) & an ninh.',
    description: 'Môn <strong>TPM301 — Technology in Procurement Management</strong> (kỳ 3, khối Quản trị Kinh doanh) nhấn vào <strong>công nghệ &amp; số hoá</strong> hoạt động thu mua — khác với PCM301/PSS301 (quy trình/chiến lược) và SCM302 (chuỗi cung). Từ <strong>chuyển đổi số</strong> → <strong>hệ thống e-procurement &amp; Procure-to-Pay điện tử</strong> → <strong>đấu thầu điện tử</strong> (e-sourcing/e-auction/e-tendering) → <strong>catalog &amp; hợp đồng số</strong> → <strong>phân tích chi tiêu &amp; BI</strong> → <strong>RPA &amp; AI</strong> → <strong>blockchain, IoT &amp; minh bạch chuỗi cung</strong> → <strong>nền tảng SaaS (Ariba/Coupa), an ninh &amp; triển khai</strong>. Trích dẫn Deloitte/CIPS, Monczka, tài liệu SAP Ariba/Coupa; song ngữ, có quiz mỗi chương.',
    whatYouLearn: 'Động lực & nấc thang chuyển đổi số thu mua; chuỗi Procure-to-Pay điện tử & đối chiếu 3 chiều; e-sourcing (RFI/RFP/RFQ), e-tendering, đấu giá ngược (reverse auction); catalog nội bộ vs punch-out (cXML/OCI), quản lý vòng đời hợp đồng (CLM), chữ ký số; spend cube, UNSPSC, KPI phân tích chi tiêu; RPA vs AI trong thu mua (chatbot, dự báo nhu cầu, NLP hợp đồng); blockchain/smart contract & IoT cho minh bạch chuỗi cung; kiến trúc SaaS (Ariba/Coupa), rủi ro triển khai và an ninh dữ liệu.',
    requirements: 'Đã học hoặc đang học các môn nền thu mua/chuỗi cung (PCM301/PSS301/SCM302) sẽ dễ tiếp cận hơn, không bắt buộc. Không cần kiến thức lập trình.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Whitepaper Deloitte/CIPS, sách Monczka, tài liệu Ariba/Coupa, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Vì sao thu mua cần công nghệ; phân biệt với PCM301/PSS301/SCM302.', lessons: [intro] },
    { title: 'Chương 1 — Chuyển đổi số trong thu mua|||Chapter 1 — Digital transformation', description: 'Nỗi đau thủ công, động lực, nấc thang trưởng thành số.', lessons: [c1, c1q] },
    { title: 'Chương 2 — e-Procurement & Procure-to-Pay|||Chapter 2 — e-Procurement & P2P', description: 'Chuỗi P2P điện tử, đối chiếu 3 chiều, ERP module vs e-procurement độc lập.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Đấu thầu điện tử|||Chapter 3 — e-Sourcing/e-Auction/e-Tendering', description: 'RFI/RFP/RFQ, e-tendering, đấu giá ngược.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Catalog & hợp đồng số|||Chapter 4 — e-Catalogs & digital contracts', description: 'Catalog nội bộ vs punch-out, CLM, chữ ký số.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Phân tích chi tiêu & BI|||Chapter 5 — Spend analytics & BI', description: 'Spend cube, UNSPSC, KPI tiết kiệm/maverick spend.', lessons: [c5, c5q] },
    { title: 'Chương 6 — RPA & AI trong thu mua|||Chapter 6 — RPA & AI', description: 'Tự động hoá quy trình, chatbot, dự báo nhu cầu, NLP hợp đồng.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Blockchain, IoT & minh bạch chuỗi cung|||Chapter 7 — Blockchain, IoT & transparency', description: 'Smart contract, truy xuất nguồn gốc, cảm biến IoT.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Nền tảng SaaS, an ninh & triển khai|||Chapter 8 — SaaS platforms, security & implementation', description: 'Ariba/Coupa, rủi ro triển khai, an ninh dữ liệu.', lessons: [c8, c8q] },
  ],
};
