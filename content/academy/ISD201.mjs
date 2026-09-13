/**
 * ISD201 — Information Systems in the Digital Age (Hệ thống thông tin trong
 * kỷ nguyên số). Ngành Chuyển đổi số FPTU, kỳ 3. Môn KHÔNG có syllabus FLM
 * chi tiết → dựng theo giáo trình chuẩn quốc tế (Laudon & Laudon "Management
 * Information Systems"; Rainer "Introduction to Information Systems"; kèm HBR
 * Digital, Gartner/McKinsey). 8 chương, mỗi chương 1 DOCUMENT song ngữ + 1
 * QUIZ. Song ngữ + mô hình + ví dụ doanh nghiệp thật. Giữ NGUYÊN slug/semester/
 * courseCode/thumb. ⚠️ KHÔNG backtick/${ trong HTML; & → &amp; trong content.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('isd201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn (Laudon & Laudon, Rainer), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">ISD201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Information Systems</strong> — what an IS is, how it supports strategy, IT infrastructure, data, the main system types, e-commerce, digital transformation and security — in one place. The official slides &amp; textbook live on <strong>FLM</strong>; below are widely used references and free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for ISD201 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li>Kenneth &amp; Jane Laudon — <em>Management Information Systems: Managing the Digital Firm</em> (the standard MIS text)</li>
<li>R. Kelly Rainer &amp; Brad Prince — <em>Introduction to Information Systems</em></li>
<li>James O'Brien &amp; George Marakas — <em>Management Information Systems</em></li>
</ul>
<h3>🌐 Official / free resources</h3>
<ul>
<li><a href="https://hbr.org/topic/subject/digital-transformation" target="_blank" rel="noopener">Harvard Business Review — Digital Transformation</a></li>
<li><a href="https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights" target="_blank" rel="noopener">McKinsey Digital — insights</a></li>
<li><a href="https://www.gartner.com/en/information-technology" target="_blank" rel="noopener">Gartner — IT research &amp; glossary</a></li>
</ul>
<h3>▶️ YouTube &amp; talks</h3>
<ul>
<li><a href="https://www.youtube.com/results?search_query=management+information+systems+explained" target="_blank" rel="noopener">Management Information Systems — explainer talks</a></li>
<li><a href="https://www.youtube.com/results?search_query=digital+transformation+case+study" target="_blank" rel="noopener">Digital transformation case studies</a></li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.lucidchart.com/" target="_blank" rel="noopener">Lucidchart</a> — draw process &amp; data-flow diagrams</li>
<li><a href="https://www.draw.io/" target="_blank" rel="noopener">diagrams.net</a> — free ER &amp; system diagrams</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — what an information system is, its components, and how data becomes knowledge.</li>
<li><strong>Business value</strong> — how IS supports strategy, competitive advantage and the value chain.</li>
<li><strong>Build blocks</strong> — IT infrastructure &amp; cloud, data &amp; databases, and the main IS types (ERP/CRM/SCM).</li>
<li><strong>Digital age</strong> — e-commerce, digital transformation, emerging tech, then security, ethics &amp; governance.</li>
</ol></div>`,
    `<span class="eyebrow">ISD201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Hệ thống thông tin</strong> — HTTT là gì, hỗ trợ chiến lược thế nào, hạ tầng CNTT, dữ liệu, các loại hệ thống chính, thương mại điện tử, chuyển đổi số và an ninh — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là các sách chuẩn và nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của ISD201 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li>Kenneth &amp; Jane Laudon — <em>Management Information Systems: Managing the Digital Firm</em> (giáo trình MIS chuẩn)</li>
<li>R. Kelly Rainer &amp; Brad Prince — <em>Introduction to Information Systems</em></li>
<li>James O'Brien &amp; George Marakas — <em>Management Information Systems</em></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://hbr.org/topic/subject/digital-transformation" target="_blank" rel="noopener">Harvard Business Review — Chuyển đổi số</a></li>
<li><a href="https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights" target="_blank" rel="noopener">McKinsey Digital — bài phân tích</a></li>
<li><a href="https://www.gartner.com/en/information-technology" target="_blank" rel="noopener">Gartner — nghiên cứu &amp; từ điển thuật ngữ CNTT</a></li>
</ul>
<h3>▶️ YouTube &amp; talk</h3>
<ul>
<li><a href="https://www.youtube.com/results?search_query=management+information+systems+explained" target="_blank" rel="noopener">Hệ thống thông tin quản lý — video giảng</a></li>
<li><a href="https://www.youtube.com/results?search_query=digital+transformation+case+study" target="_blank" rel="noopener">Case study chuyển đổi số</a></li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.lucidchart.com/" target="_blank" rel="noopener">Lucidchart</a> — vẽ sơ đồ quy trình &amp; luồng dữ liệu</li>
<li><a href="https://www.draw.io/" target="_blank" rel="noopener">diagrams.net</a> — vẽ ER &amp; sơ đồ hệ thống miễn phí</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền</strong> — hệ thống thông tin là gì, các thành phần, và dữ liệu thành tri thức thế nào.</li>
<li><strong>Giá trị kinh doanh</strong> — HTTT hỗ trợ chiến lược, lợi thế cạnh tranh và chuỗi giá trị ra sao.</li>
<li><strong>Khối dựng</strong> — hạ tầng CNTT &amp; cloud, dữ liệu &amp; CSDL, và các loại HTTT chính (ERP/CRM/SCM).</li>
<li><strong>Kỷ nguyên số</strong> — thương mại điện tử, chuyển đổi số, công nghệ mới nổi, rồi an ninh, đạo đức &amp; quản trị.</li>
</ol></div>`,
  ]]);

const intro = doc('isd201-0-1-overview', 'Course overview: Information Systems in the Digital Age|||Tổng quan: Hệ thống thông tin trong kỷ nguyên số',
  'HTTT là gì & vì sao mọi tổ chức số vận hành trên nó; lộ trình môn: khái niệm & thành phần → chiến lược → hạ tầng & dữ liệu → các loại HTTT → TMĐT → chuyển đổi số → an ninh & quản trị.',
  [[
    `<span class="eyebrow">ISD201 · Lesson 0.1 · Overview</span>
<h2>Information Systems in the Digital Age</h2>
<p class="lead">This course helps you understand <strong>how organisations run on information</strong>. An information system (IS) is not just software — it combines <strong>people, processes, data and technology</strong> to collect, store and turn raw facts into decisions. In the digital age, IS is the backbone of every firm, from a coffee shop's point-of-sale to Amazon's global supply chain.</p>
<h3>Why this matters</h3>
<p>Managers do not need to build systems, but they must know what systems <em>can do</em> — which technology to invest in, how data creates value, and where the risks are. This course is that manager's-eye view: the concepts, models and vocabulary of information systems.</p>
<h3>Roadmap</h3>
<ul>
<li><strong>Ch1–2</strong> — what an IS is (data → information → knowledge) and how it drives business strategy.</li>
<li><strong>Ch3–4</strong> — the technology base: IT infrastructure &amp; cloud, then data &amp; data governance.</li>
<li><strong>Ch5</strong> — the main IS types managers use (TPS, MIS, DSS, ESS, ERP, CRM, SCM).</li>
<li><strong>Ch6–7</strong> — e-commerce &amp; digital business, then digital transformation &amp; emerging tech.</li>
<li><strong>Ch8</strong> — security, privacy, ethics and IS governance.</li>
</ul>
<div class="callout"><span class="badge">One idea to keep</span> Technology alone is not an information system. Value appears only when technology, data, people and business processes are designed to work together.</div>`,
    `<span class="eyebrow">ISD201 · Bài 0.1 · Tổng quan</span>
<h2>Hệ thống thông tin trong kỷ nguyên số</h2>
<p class="lead">Môn này giúp bạn hiểu <strong>tổ chức vận hành trên thông tin thế nào</strong>. Hệ thống thông tin (HTTT) không chỉ là phần mềm — nó kết hợp <strong>con người, quy trình, dữ liệu và công nghệ</strong> để thu thập, lưu trữ và biến dữ liệu thô thành quyết định. Trong kỷ nguyên số, HTTT là xương sống của mọi doanh nghiệp, từ máy tính tiền của quán cà phê tới chuỗi cung ứng toàn cầu của Amazon.</p>
<h3>Vì sao quan trọng</h3>
<p>Nhà quản lý không cần tự viết hệ thống, nhưng phải biết hệ thống <em>làm được gì</em> — nên đầu tư công nghệ nào, dữ liệu tạo giá trị ra sao, và rủi ro nằm ở đâu. Môn này là góc nhìn của nhà quản lý: khái niệm, mô hình và thuật ngữ của hệ thống thông tin.</p>
<h3>Lộ trình</h3>
<ul>
<li><strong>Ch1–2</strong> — HTTT là gì (dữ liệu → thông tin → tri thức) và thúc đẩy chiến lược kinh doanh thế nào.</li>
<li><strong>Ch3–4</strong> — nền công nghệ: hạ tầng CNTT &amp; cloud, rồi dữ liệu &amp; quản trị dữ liệu.</li>
<li><strong>Ch5</strong> — các loại HTTT nhà quản lý dùng (TPS, MIS, DSS, ESS, ERP, CRM, SCM).</li>
<li><strong>Ch6–7</strong> — thương mại điện tử &amp; kinh doanh số, rồi chuyển đổi số &amp; công nghệ mới nổi.</li>
<li><strong>Ch8</strong> — an ninh, quyền riêng tư, đạo đức và quản trị HTTT.</li>
</ul>
<div class="callout"><span class="badge">Một ý cần nhớ</span> Công nghệ đơn thuần chưa phải hệ thống thông tin. Giá trị chỉ xuất hiện khi công nghệ, dữ liệu, con người và quy trình kinh doanh được thiết kế phối hợp với nhau.</div>`,
  ]]);

const c1 = doc('isd201-1-1-what-is-is', '1.1 — What an information system is|||1.1 — Hệ thống thông tin là gì',
  'Chuỗi data → information → knowledge → wisdom; năm thành phần của HTTT (people, process, data, hardware, software/network); chức năng input–process–output–feedback; vai trò trong tổ chức.',
  [[
    `<span class="eyebrow">ISD201 · Chapter 1 · Lesson 1.1</span>
<h2>What an information system is</h2>
<h3>Data, information, knowledge</h3>
<ul>
<li><strong>Data</strong> — raw, unorganised facts: "3, 12, 47".</li>
<li><strong>Information</strong> — data given context and meaning: "47 units sold today, up from 12 yesterday".</li>
<li><strong>Knowledge</strong> — information combined with experience to act: "sales spike on paydays, so schedule more staff".</li>
</ul>
<p>An IS is the machinery that climbs this ladder — turning facts into decisions.</p>
<h3>The five components</h3>
<pre><code>People    -> users &amp; specialists who run and use the system
Process   -> the business procedures the system supports
Data      -> the facts the system stores and manages
Hardware  -> the physical devices
Software  -> programs (with the network tying it together)</code></pre>
<p>Miss any component and the system fails: great software with untrained people, or clean data with a broken process, delivers no value.</p>
<h3>Input–process–output–feedback</h3>
<p>Every IS <strong>inputs</strong> raw data, <strong>processes</strong> it, produces <strong>output</strong> (reports, dashboards), and uses <strong>feedback</strong> to correct itself — the classic systems model.</p>
<div class="callout"><span class="badge">Real example</span> A supermarket checkout scan is <em>data</em>; the day's sales report is <em>information</em>; deciding which products to reorder is <em>knowledge</em> in action — all produced by one point-of-sale information system.</div>`,
    `<span class="eyebrow">ISD201 · Chương 1 · Bài 1.1</span>
<h2>Hệ thống thông tin là gì</h2>
<h3>Dữ liệu, thông tin, tri thức</h3>
<ul>
<li><strong>Dữ liệu (data)</strong> — sự kiện thô, chưa sắp xếp: "3, 12, 47".</li>
<li><strong>Thông tin (information)</strong> — dữ liệu được đặt vào ngữ cảnh và có ý nghĩa: "hôm nay bán 47 sản phẩm, tăng từ 12 hôm qua".</li>
<li><strong>Tri thức (knowledge)</strong> — thông tin kết hợp kinh nghiệm để hành động: "doanh số vọt vào ngày lương, nên xếp thêm nhân viên".</li>
</ul>
<p>HTTT là cỗ máy leo lên nấc thang này — biến sự kiện thành quyết định.</p>
<h3>Năm thành phần</h3>
<pre><code>Con người  -> người dùng &amp; chuyên gia vận hành hệ thống
Quy trình  -> thủ tục kinh doanh mà hệ thống hỗ trợ
Dữ liệu    -> các sự kiện hệ thống lưu và quản lý
Phần cứng  -> thiết bị vật lý
Phần mềm   -> chương trình (mạng gắn kết tất cả lại)</code></pre>
<p>Thiếu bất kỳ thành phần nào là hệ thống hỏng: phần mềm xịn mà người dùng không được đào tạo, hay dữ liệu sạch mà quy trình gãy, đều không tạo giá trị.</p>
<h3>Đầu vào–xử lý–đầu ra–phản hồi</h3>
<p>Mọi HTTT <strong>nhận</strong> dữ liệu thô, <strong>xử lý</strong> nó, tạo <strong>đầu ra</strong> (báo cáo, dashboard), và dùng <strong>phản hồi</strong> để tự điều chỉnh — mô hình hệ thống kinh điển.</p>
<div class="callout"><span class="badge">Ví dụ thật</span> Một lượt quét ở quầy thu ngân siêu thị là <em>dữ liệu</em>; báo cáo doanh số trong ngày là <em>thông tin</em>; quyết định nhập lại hàng nào là <em>tri thức</em> khi hành động — tất cả do một hệ thống điểm bán (POS) tạo ra.</div>`,
  ]]);

const c1q = quiz('isd201-quiz-1', 'Quiz 1 — What an IS is|||Quiz 1 — HTTT là gì', [
  { id: 'q1', question: 'Thứ tự đúng của chuỗi giá trị dữ liệu là?', options: ['Tri thức → thông tin → dữ liệu', 'Dữ liệu → thông tin → tri thức', 'Thông tin → dữ liệu → tri thức', 'Dữ liệu → tri thức → thông tin'], correctIndex: 1, explanation: 'Dữ liệu thô → đặt ngữ cảnh thành thông tin → kết hợp kinh nghiệm thành tri thức để hành động.' },
  { id: 'q2', question: 'Đâu KHÔNG phải là một trong năm thành phần của HTTT?', options: ['Con người', 'Quy trình', 'Đối thủ cạnh tranh', 'Dữ liệu'], correctIndex: 2, explanation: 'Năm thành phần: con người, quy trình, dữ liệu, phần cứng, phần mềm (mạng). Đối thủ không nằm trong hệ thống.' },
  { id: 'q3', question: 'Trong mô hình hệ thống, "feedback" (phản hồi) dùng để?', options: ['Lưu trữ dữ liệu thô', 'Bán sản phẩm', 'Điều chỉnh/sửa lại hệ thống dựa trên kết quả đầu ra', 'Thay thế phần cứng'], correctIndex: 2, explanation: 'Phản hồi đưa kết quả đầu ra quay lại để hệ thống tự điều chỉnh.' },
]);

const c2 = doc('isd201-2-1-is-strategy', '2.1 — IS & business strategy|||2.1 — HTTT & chiến lược kinh doanh',
  'HTTT tạo lợi thế cạnh tranh; mô hình 5 lực & 3 chiến lược tổng quát của Porter; chuỗi giá trị (value chain); digital business & khác biệt hoá bằng công nghệ.',
  [[
    `<span class="eyebrow">ISD201 · Chapter 2 · Lesson 2.1</span>
<h2>Information systems &amp; business strategy</h2>
<h3>IS as a source of competitive advantage</h3>
<p>Systems do more than cut costs — they can build <strong>competitive advantage</strong>. Michael Porter's <strong>five forces</strong> (rivalry, new entrants, substitutes, buyer power, supplier power) shape an industry, and IS can blunt or bend each force — for example, high switching costs from a deeply integrated system keep customers in.</p>
<h3>Porter's three generic strategies</h3>
<ul>
<li><strong>Cost leadership</strong> — use IS to be the lowest-cost operator (Walmart's supply-chain systems).</li>
<li><strong>Differentiation</strong> — use IS to offer something rivals cannot (Netflix's recommendation engine).</li>
<li><strong>Focus</strong> — use IS to serve a niche extremely well.</li>
</ul>
<h3>The value chain</h3>
<p>Porter's <strong>value chain</strong> breaks a firm into <em>primary</em> activities (inbound logistics, operations, outbound logistics, marketing/sales, service) and <em>support</em> activities (infrastructure, HR, technology, procurement). IS adds value at each link — and, across firms, forms a <strong>value web</strong>.</p>
<h3>Digital business</h3>
<p>A <strong>digital business</strong> runs core operations and customer relationships through digital platforms, not as an add-on. Data and software become the product, not just support for it.</p>
<div class="callout"><span class="badge">Real example</span> <strong>Amazon</strong> combines cost leadership (warehouse &amp; logistics systems) with differentiation (1-click, recommendations, Prime) — its information systems are the strategy, not a back office.</div>`,
    `<span class="eyebrow">ISD201 · Chương 2 · Bài 2.1</span>
<h2>Hệ thống thông tin &amp; chiến lược kinh doanh</h2>
<h3>HTTT là nguồn lợi thế cạnh tranh</h3>
<p>Hệ thống không chỉ để cắt chi phí — nó có thể tạo <strong>lợi thế cạnh tranh</strong>. Mô hình <strong>năm lực lượng</strong> của Michael Porter (cạnh tranh nội bộ, đối thủ mới, sản phẩm thay thế, quyền lực người mua, quyền lực nhà cung cấp) định hình một ngành, và HTTT có thể làm dịu hoặc bẻ cong từng lực — ví dụ, chi phí chuyển đổi cao từ một hệ thống tích hợp sâu giữ chân khách hàng.</p>
<h3>Ba chiến lược tổng quát của Porter</h3>
<ul>
<li><strong>Dẫn đầu chi phí</strong> — dùng HTTT để vận hành với chi phí thấp nhất (hệ thống chuỗi cung ứng của Walmart).</li>
<li><strong>Khác biệt hoá</strong> — dùng HTTT để cung cấp thứ đối thủ không có (bộ máy gợi ý của Netflix).</li>
<li><strong>Tập trung</strong> — dùng HTTT phục vụ một ngách cực tốt.</li>
</ul>
<h3>Chuỗi giá trị</h3>
<p><strong>Chuỗi giá trị (value chain)</strong> của Porter chia doanh nghiệp thành hoạt động <em>chính</em> (logistics đầu vào, vận hành, logistics đầu ra, marketing/bán, dịch vụ) và hoạt động <em>hỗ trợ</em> (hạ tầng, nhân sự, công nghệ, mua sắm). HTTT thêm giá trị ở mỗi mắt xích — và, xuyên nhiều doanh nghiệp, tạo thành <strong>mạng giá trị (value web)</strong>.</p>
<h3>Kinh doanh số</h3>
<p><strong>Kinh doanh số (digital business)</strong> vận hành hoạt động cốt lõi và quan hệ khách hàng qua nền tảng số, không phải như phần đính kèm. Dữ liệu và phần mềm trở thành chính sản phẩm, không chỉ hỗ trợ cho nó.</p>
<div class="callout"><span class="badge">Ví dụ thật</span> <strong>Amazon</strong> kết hợp dẫn đầu chi phí (hệ thống kho &amp; logistics) với khác biệt hoá (mua 1 chạm, gợi ý, Prime) — hệ thống thông tin của họ chính là chiến lược, không phải hậu cần.</div>`,
  ]]);

const c2q = quiz('isd201-quiz-2', 'Quiz 2 — IS & strategy|||Quiz 2 — HTTT & chiến lược', [
  { id: 'q1', question: 'Mô hình "năm lực lượng" (five forces) của Porter dùng để?', options: ['Thiết kế cơ sở dữ liệu', 'Phân tích mức độ cạnh tranh & sức hấp dẫn của một ngành', 'Đo tốc độ mạng', 'Quản lý nhân sự'], correctIndex: 1, explanation: 'Five forces phân tích cạnh tranh nội bộ, đối thủ mới, thay thế, quyền lực người mua/nhà cung cấp.' },
  { id: 'q2', question: 'Netflix dùng bộ máy gợi ý để nổi bật so với đối thủ. Đó là chiến lược tổng quát nào?', options: ['Dẫn đầu chi phí', 'Khác biệt hoá', 'Rút lui khỏi thị trường', 'Sáp nhập'], correctIndex: 1, explanation: 'Cung cấp thứ đối thủ khó sao chép (gợi ý cá nhân hoá) là khác biệt hoá.' },
  { id: 'q3', question: 'Trong chuỗi giá trị của Porter, "logistics đầu vào" và "vận hành" thuộc nhóm?', options: ['Hoạt động hỗ trợ', 'Hoạt động chính (primary)', 'Hoạt động tài chính', 'Không thuộc chuỗi giá trị'], correctIndex: 1, explanation: 'Chúng là hoạt động chính; hạ tầng, nhân sự, công nghệ, mua sắm là hoạt động hỗ trợ.' },
]);

const c3 = doc('isd201-3-1-it-infrastructure', '3.1 — IT infrastructure & cloud|||3.1 — Hạ tầng CNTT & điện toán đám mây',
  'Bảy thành phần hạ tầng CNTT; phần cứng (client–server, data center), phần mềm (hệ thống vs ứng dụng), mạng & Internet (giao thức, băng thông); điện toán đám mây (IaaS/PaaS/SaaS).',
  [[
    `<span class="eyebrow">ISD201 · Chapter 3 · Lesson 3.1</span>
<h2>IT infrastructure &amp; cloud computing</h2>
<h3>What infrastructure is</h3>
<p><strong>IT infrastructure</strong> is the shared technology foundation a firm runs on: computing hardware, software, networks, data storage and the services that manage them. It is a platform, like roads and power — many applications ride on it.</p>
<h3>Hardware, software, networks</h3>
<ul>
<li><strong>Hardware</strong> — client devices, servers, and <em>data centers</em> that house them. The <strong>client–server</strong> model splits work between a requester (client) and a provider (server).</li>
<li><strong>Software</strong> — <em>system software</em> (operating systems that manage the machine) vs <em>application software</em> (programs that do business work).</li>
<li><strong>Networks &amp; the Internet</strong> — devices connect via protocols (TCP/IP); the Internet is the global network of networks. Bandwidth is how much data a link carries per second.</li>
</ul>
<h3>Cloud computing</h3>
<pre><code>IaaS -> rent raw compute/storage      (AWS EC2, S3)
PaaS -> rent a platform to build on   (Google App Engine)
SaaS -> rent finished software        (Gmail, Salesforce)</code></pre>
<p>Cloud shifts IT from a <strong>capital cost</strong> (buy servers) to an <strong>operating cost</strong> (pay as you go) and scales on demand.</p>
<div class="callout"><span class="badge">Real example</span> <strong>Netflix</strong> runs almost entirely on <strong>AWS</strong> — instead of building data centers it rents cloud capacity, scaling up for peak-hour streaming and down overnight, paying only for what it uses.</div>`,
    `<span class="eyebrow">ISD201 · Chương 3 · Bài 3.1</span>
<h2>Hạ tầng CNTT &amp; điện toán đám mây</h2>
<h3>Hạ tầng là gì</h3>
<p><strong>Hạ tầng CNTT</strong> là nền công nghệ dùng chung mà doanh nghiệp vận hành trên đó: phần cứng tính toán, phần mềm, mạng, lưu trữ dữ liệu và các dịch vụ quản lý chúng. Nó là một nền tảng, như đường sá và điện — nhiều ứng dụng chạy trên đó.</p>
<h3>Phần cứng, phần mềm, mạng</h3>
<ul>
<li><strong>Phần cứng</strong> — thiết bị máy khách, máy chủ, và <em>trung tâm dữ liệu</em> chứa chúng. Mô hình <strong>client–server</strong> chia việc giữa bên yêu cầu (client) và bên cung cấp (server).</li>
<li><strong>Phần mềm</strong> — <em>phần mềm hệ thống</em> (hệ điều hành quản lý máy) và <em>phần mềm ứng dụng</em> (chương trình làm việc kinh doanh).</li>
<li><strong>Mạng &amp; Internet</strong> — thiết bị kết nối qua giao thức (TCP/IP); Internet là mạng của các mạng toàn cầu. Băng thông là lượng dữ liệu một đường truyền tải mỗi giây.</li>
</ul>
<h3>Điện toán đám mây</h3>
<pre><code>IaaS -> thuê tài nguyên tính toán/lưu trữ thô (AWS EC2, S3)
PaaS -> thuê nền tảng để xây dựng            (Google App Engine)
SaaS -> thuê phần mềm hoàn chỉnh             (Gmail, Salesforce)</code></pre>
<p>Cloud chuyển CNTT từ <strong>chi phí vốn</strong> (mua máy chủ) sang <strong>chi phí vận hành</strong> (trả theo mức dùng) và co giãn theo nhu cầu.</p>
<div class="callout"><span class="badge">Ví dụ thật</span> <strong>Netflix</strong> chạy gần như hoàn toàn trên <strong>AWS</strong> — thay vì xây trung tâm dữ liệu, họ thuê năng lực đám mây, tăng lên giờ cao điểm và giảm về đêm, chỉ trả cho phần đã dùng.</div>`,
  ]]);

const c3q = quiz('isd201-quiz-3', 'Quiz 3 — Infrastructure & cloud|||Quiz 3 — Hạ tầng & cloud', [
  { id: 'q1', question: 'Trong mô hình điện toán đám mây, thuê một phần mềm hoàn chỉnh dùng ngay (như Gmail, Salesforce) là?', options: ['IaaS', 'PaaS', 'SaaS', 'On-premise'], correctIndex: 2, explanation: 'SaaS = Software as a Service: phần mềm hoàn chỉnh, dùng qua Internet.' },
  { id: 'q2', question: 'Sự khác nhau giữa phần mềm hệ thống và phần mềm ứng dụng?', options: ['Không có khác biệt', 'Phần mềm hệ thống quản lý máy (OS); phần mềm ứng dụng làm việc kinh doanh cụ thể', 'Phần mềm ứng dụng chạy phần cứng', 'Phần mềm hệ thống chỉ là game'], correctIndex: 1, explanation: 'OS quản lý tài nguyên máy; ứng dụng thực hiện tác vụ của người dùng.' },
  { id: 'q3', question: 'Một lợi ích cốt lõi của cloud so với tự mua máy chủ là?', options: ['Không cần Internet', 'Chuyển từ chi phí vốn sang trả theo mức dùng & co giãn theo nhu cầu', 'Luôn rẻ hơn trong mọi trường hợp', 'Không cần bảo mật'], correctIndex: 1, explanation: 'Cloud biến CAPEX thành OPEX và cho phép mở rộng/thu hẹp linh hoạt.' },
]);

const c4 = doc('isd201-4-1-data-management', '4.1 — Data & data management|||4.1 — Dữ liệu & quản trị dữ liệu',
  'Database & DBMS, mô hình quan hệ (bảng, khoá, SQL); data warehouse & OLAP; big data (5V) & analytics; quản trị dữ liệu (data governance), chất lượng dữ liệu.',
  [[
    `<span class="eyebrow">ISD201 · Chapter 4 · Lesson 4.1</span>
<h2>Data &amp; data management</h2>
<h3>Databases &amp; the DBMS</h3>
<p>A <strong>database</strong> is an organised collection of related data; a <strong>DBMS</strong> (database management system, e.g. PostgreSQL, Oracle) stores, secures and queries it. The dominant model is <strong>relational</strong>: data lives in <em>tables</em> (rows &amp; columns), rows are identified by a <em>primary key</em>, and tables link through <em>foreign keys</em>. <strong>SQL</strong> is the query language.</p>
<h3>From operations to analysis</h3>
<ul>
<li><strong>Operational databases</strong> — run daily transactions (orders, payments).</li>
<li><strong>Data warehouse</strong> — a separate store that consolidates data from many systems for analysis; <strong>OLAP</strong> lets analysts slice it by product, region, time.</li>
</ul>
<h3>Big data &amp; the five Vs</h3>
<p><strong>Big data</strong> is data too large or fast for traditional tools, described by five Vs: <strong>Volume, Velocity, Variety, Veracity, Value</strong>. Analytics turns it into insight.</p>
<h3>Data governance</h3>
<p><strong>Data governance</strong> is the policies and roles ensuring data is accurate, consistent, secure and used responsibly. Poor <strong>data quality</strong> — duplicates, errors, gaps — silently corrupts every decision built on it.</p>
<div class="callout"><span class="badge">Real example</span> <strong>Walmart</strong> feeds sales from thousands of stores into a massive data warehouse; analysts spotted that before hurricanes, demand for <em>strawberry Pop-Tarts</em> spikes — a data-driven stocking decision no manager would guess.</div>`,
    `<span class="eyebrow">ISD201 · Chương 4 · Bài 4.1</span>
<h2>Dữ liệu &amp; quản trị dữ liệu</h2>
<h3>Cơ sở dữ liệu &amp; DBMS</h3>
<p><strong>Cơ sở dữ liệu (database)</strong> là tập hợp dữ liệu liên quan được tổ chức; <strong>DBMS</strong> (hệ quản trị CSDL, vd PostgreSQL, Oracle) lưu trữ, bảo mật và truy vấn nó. Mô hình phổ biến nhất là <strong>quan hệ</strong>: dữ liệu nằm trong <em>bảng</em> (hàng &amp; cột), mỗi hàng có <em>khoá chính</em>, các bảng nối nhau qua <em>khoá ngoại</em>. <strong>SQL</strong> là ngôn ngữ truy vấn.</p>
<h3>Từ vận hành tới phân tích</h3>
<ul>
<li><strong>CSDL vận hành</strong> — chạy giao dịch hằng ngày (đơn hàng, thanh toán).</li>
<li><strong>Kho dữ liệu (data warehouse)</strong> — kho riêng tổng hợp dữ liệu từ nhiều hệ thống để phân tích; <strong>OLAP</strong> cho phép cắt lát theo sản phẩm, vùng, thời gian.</li>
</ul>
<h3>Big data &amp; năm chữ V</h3>
<p><strong>Big data</strong> là dữ liệu quá lớn hoặc quá nhanh cho công cụ truyền thống, mô tả bằng năm chữ V: <strong>Volume (khối lượng), Velocity (tốc độ), Variety (đa dạng), Veracity (độ tin cậy), Value (giá trị)</strong>. Analytics biến nó thành hiểu biết.</p>
<h3>Quản trị dữ liệu</h3>
<p><strong>Quản trị dữ liệu (data governance)</strong> là chính sách và vai trò bảo đảm dữ liệu chính xác, nhất quán, an toàn và dùng có trách nhiệm. <strong>Chất lượng dữ liệu</strong> kém — trùng lặp, sai sót, thiếu — âm thầm phá hỏng mọi quyết định dựa trên nó.</p>
<div class="callout"><span class="badge">Ví dụ thật</span> <strong>Walmart</strong> nạp doanh số từ hàng nghìn cửa hàng vào một kho dữ liệu khổng lồ; nhà phân tích phát hiện trước bão, nhu cầu <em>bánh Pop-Tarts vị dâu</em> tăng vọt — một quyết định trữ hàng dựa trên dữ liệu mà không quản lý nào đoán ra.</div>`,
  ]]);

const c4q = quiz('isd201-quiz-4', 'Quiz 4 — Data management|||Quiz 4 — Quản trị dữ liệu', [
  { id: 'q1', question: 'Trong mô hình quan hệ, thứ dùng để nối hai bảng với nhau là?', options: ['Khoá ngoại (foreign key)', 'Băng thông', 'Giao thức', 'Dashboard'], correctIndex: 0, explanation: 'Khoá ngoại tham chiếu khoá chính của bảng khác, tạo liên kết giữa các bảng.' },
  { id: 'q2', question: 'Kho dữ liệu (data warehouse) khác cơ sở dữ liệu vận hành ở chỗ?', options: ['Chỉ lưu ảnh', 'Tổng hợp dữ liệu từ nhiều hệ thống phục vụ PHÂN TÍCH, thay vì chạy giao dịch hằng ngày', 'Không dùng SQL bao giờ', 'Chỉ chạy trên điện thoại'], correctIndex: 1, explanation: 'Warehouse tối ưu cho phân tích (OLAP); CSDL vận hành tối ưu cho giao dịch.' },
  { id: 'q3', question: 'Năm chữ V của big data KHÔNG bao gồm cái nào sau đây?', options: ['Volume (khối lượng)', 'Velocity (tốc độ)', 'Validation (kiểm thử phần mềm)', 'Variety (đa dạng)'], correctIndex: 2, explanation: 'Năm V: Volume, Velocity, Variety, Veracity, Value. Validation không thuộc nhóm này.' },
]);

const c5 = doc('isd201-5-1-types-of-is', '5.1 — Types of information systems|||5.1 — Các loại hệ thống thông tin',
  'Kim tự tháp theo cấp quản lý: TPS (tác nghiệp), MIS & DSS (quản lý), ESS (điều hành); hệ thống doanh nghiệp tích hợp: ERP, CRM, SCM.',
  [[
    `<span class="eyebrow">ISD201 · Chapter 5 · Lesson 5.1</span>
<h2>Types of information systems</h2>
<h3>Systems by management level</h3>
<ul>
<li><strong>TPS (Transaction Processing System)</strong> — records daily operational transactions: sales, payroll, orders. The factual foundation everything else builds on.</li>
<li><strong>MIS (Management Information System)</strong> — summarises TPS data into routine reports for middle managers ("this month vs last").</li>
<li><strong>DSS (Decision Support System)</strong> — interactive models for semi-structured decisions ("what if we raise price 5%?").</li>
<li><strong>ESS (Executive Support System)</strong> — high-level dashboards for senior leaders, combining internal and external data.</li>
</ul>
<h3>Enterprise systems (cross-functional)</h3>
<pre><code>ERP -> one integrated system across finance, HR, operations (SAP, Oracle)
CRM -> manages the customer relationship &amp; sales pipeline (Salesforce)
SCM -> coordinates suppliers, inventory &amp; logistics</code></pre>
<p>These break down departmental "silos" by sharing one database, so a sale updates finance, inventory and shipping at once.</p>
<div class="callout"><span class="badge">Real example</span> <strong>Coca-Cola</strong> runs <strong>SAP ERP</strong> so bottling, finance and distribution across countries share one system — an order in one region instantly reflects in inventory and accounts, no manual re-keying.</div>`,
    `<span class="eyebrow">ISD201 · Chương 5 · Bài 5.1</span>
<h2>Các loại hệ thống thông tin</h2>
<h3>Hệ thống theo cấp quản lý</h3>
<ul>
<li><strong>TPS (Hệ xử lý giao dịch)</strong> — ghi nhận giao dịch tác nghiệp hằng ngày: bán hàng, lương, đơn hàng. Nền sự kiện mà mọi thứ khác dựa vào.</li>
<li><strong>MIS (Hệ thông tin quản lý)</strong> — tóm tắt dữ liệu TPS thành báo cáo định kỳ cho quản lý cấp trung ("tháng này so với tháng trước").</li>
<li><strong>DSS (Hệ hỗ trợ ra quyết định)</strong> — mô hình tương tác cho quyết định bán cấu trúc ("nếu tăng giá 5% thì sao?").</li>
<li><strong>ESS (Hệ hỗ trợ điều hành)</strong> — dashboard cấp cao cho lãnh đạo, kết hợp dữ liệu nội bộ và bên ngoài.</li>
</ul>
<h3>Hệ thống doanh nghiệp (xuyên chức năng)</h3>
<pre><code>ERP -> một hệ tích hợp xuyên tài chính, nhân sự, vận hành (SAP, Oracle)
CRM -> quản lý quan hệ khách hàng &amp; phễu bán hàng (Salesforce)
SCM -> điều phối nhà cung cấp, tồn kho &amp; logistics</code></pre>
<p>Chúng phá "silo" phòng ban bằng cách dùng chung một cơ sở dữ liệu, nên một giao dịch bán cập nhật cả tài chính, tồn kho và giao hàng cùng lúc.</p>
<div class="callout"><span class="badge">Ví dụ thật</span> <strong>Coca-Cola</strong> chạy <strong>SAP ERP</strong> để đóng chai, tài chính và phân phối qua nhiều quốc gia dùng chung một hệ thống — một đơn hàng ở vùng này lập tức phản ánh vào tồn kho và sổ sách, không phải nhập tay lại.</div>`,
  ]]);

const c5q = quiz('isd201-quiz-5', 'Quiz 5 — Types of IS|||Quiz 5 — Các loại HTTT', [
  { id: 'q1', question: 'Hệ thống ghi nhận giao dịch tác nghiệp hằng ngày (bán hàng, lương) là?', options: ['ESS', 'TPS', 'DSS', 'CRM'], correctIndex: 1, explanation: 'TPS (Transaction Processing System) xử lý giao dịch hằng ngày, làm nền cho các hệ khác.' },
  { id: 'q2', question: 'Hệ thống tích hợp tài chính, nhân sự, vận hành vào MỘT hệ dùng chung một CSDL là?', options: ['CRM', 'SCM', 'ERP', 'MIS'], correctIndex: 2, explanation: 'ERP (Enterprise Resource Planning) hợp nhất nhiều chức năng vào một hệ thống.' },
  { id: 'q3', question: 'Câu hỏi "nếu tăng giá 5% thì lợi nhuận thay đổi thế nào?" phù hợp nhất với loại hệ thống nào?', options: ['TPS', 'DSS (hệ hỗ trợ ra quyết định)', 'SCM', 'Máy tính tiền'], correctIndex: 1, explanation: 'DSS dùng mô hình tương tác để phân tích "what-if" cho quyết định bán cấu trúc.' },
]);

const c6 = doc('isd201-6-1-ecommerce', '6.1 — E-commerce & digital business|||6.1 — Thương mại điện tử & kinh doanh số',
  'Các mô hình TMĐT (B2C, B2B, C2C, C2B); mô hình doanh thu (bán hàng, quảng cáo, đăng ký, phí giao dịch); nền tảng số & hiệu ứng mạng; e-business vs e-commerce.',
  [[
    `<span class="eyebrow">ISD201 · Chapter 6 · Lesson 6.1</span>
<h2>E-commerce &amp; digital business</h2>
<h3>E-commerce models by participant</h3>
<ul>
<li><strong>B2C</strong> — business to consumer (Tiki, Shopee selling to shoppers).</li>
<li><strong>B2B</strong> — business to business (Alibaba wholesale between firms).</li>
<li><strong>C2C</strong> — consumer to consumer (eBay, marketplace resellers).</li>
<li><strong>C2B</strong> — consumer to business (a freelancer or influencer selling to a firm).</li>
</ul>
<h3>Revenue models</h3>
<pre><code>Sales        -> sell goods/services directly
Advertising  -> free service, sell attention (Google, Facebook)
Subscription -> recurring fee for access (Netflix, Spotify)
Transaction  -> take a cut of each deal (Grab, marketplaces)</code></pre>
<h3>Digital platforms &amp; network effects</h3>
<p>A <strong>platform</strong> connects two or more groups (buyers and sellers, riders and drivers). Its power is the <strong>network effect</strong>: each new user makes it more valuable to everyone — which is why platform markets tend toward a few winners.</p>
<h3>E-business vs e-commerce</h3>
<p><strong>E-commerce</strong> is buying and selling online; <strong>e-business</strong> is broader — running <em>all</em> internal and partner processes digitally (procurement, HR, collaboration), whether or not money changes hands.</p>
<div class="callout"><span class="badge">Real example</span> <strong>Grab</strong> is a platform: more riders attract more drivers, and vice-versa (network effect); it earns via the <em>transaction</em> model (a commission per ride) — no vehicles owned.</div>`,
    `<span class="eyebrow">ISD201 · Chương 6 · Bài 6.1</span>
<h2>Thương mại điện tử &amp; kinh doanh số</h2>
<h3>Mô hình TMĐT theo đối tượng</h3>
<ul>
<li><strong>B2C</strong> — doanh nghiệp tới người tiêu dùng (Tiki, Shopee bán cho người mua).</li>
<li><strong>B2B</strong> — doanh nghiệp tới doanh nghiệp (Alibaba bán sỉ giữa các công ty).</li>
<li><strong>C2C</strong> — người tiêu dùng tới người tiêu dùng (eBay, người bán lại trên sàn).</li>
<li><strong>C2B</strong> — người tiêu dùng tới doanh nghiệp (freelancer hay KOL bán cho công ty).</li>
</ul>
<h3>Mô hình doanh thu</h3>
<pre><code>Bán hàng    -> bán trực tiếp hàng hoá/dịch vụ
Quảng cáo   -> dịch vụ miễn phí, bán sự chú ý (Google, Facebook)
Đăng ký     -> phí định kỳ để truy cập (Netflix, Spotify)
Giao dịch   -> ăn phần trăm mỗi thương vụ (Grab, các sàn)</code></pre>
<h3>Nền tảng số &amp; hiệu ứng mạng</h3>
<p><strong>Nền tảng (platform)</strong> kết nối hai hay nhiều nhóm (người mua và người bán, khách và tài xế). Sức mạnh của nó là <strong>hiệu ứng mạng (network effect)</strong>: mỗi người dùng mới làm nó giá trị hơn với tất cả — nên thị trường nền tảng thường dồn về vài kẻ thắng.</p>
<h3>E-business vs e-commerce</h3>
<p><strong>Thương mại điện tử (e-commerce)</strong> là mua bán trực tuyến; <strong>kinh doanh số (e-business)</strong> rộng hơn — vận hành <em>mọi</em> quy trình nội bộ và với đối tác bằng phương thức số (mua sắm, nhân sự, cộng tác), dù có hay không có tiền trao tay.</p>
<div class="callout"><span class="badge">Ví dụ thật</span> <strong>Grab</strong> là một nền tảng: càng nhiều khách càng hút tài xế, và ngược lại (hiệu ứng mạng); họ kiếm tiền theo mô hình <em>giao dịch</em> (hoa hồng mỗi chuyến) — không sở hữu chiếc xe nào.</div>`,
  ]]);

const c6q = quiz('isd201-quiz-6', 'Quiz 6 — E-commerce|||Quiz 6 — TMĐT', [
  { id: 'q1', question: 'Shopee bán hàng trực tiếp cho người tiêu dùng là mô hình TMĐT nào?', options: ['B2B', 'B2C', 'C2C', 'C2B'], correctIndex: 1, explanation: 'B2C = Business to Consumer: doanh nghiệp bán cho người tiêu dùng.' },
  { id: 'q2', question: '"Hiệu ứng mạng" (network effect) nghĩa là?', options: ['Mạng càng nhanh giá càng rẻ', 'Mỗi người dùng mới làm nền tảng giá trị hơn với mọi người dùng khác', 'Càng nhiều máy chủ càng an toàn', 'Quảng cáo càng nhiều càng tốt'], correctIndex: 1, explanation: 'Giá trị nền tảng tăng theo số người dùng — nên thị trường dồn về vài kẻ thắng.' },
  { id: 'q3', question: 'Google và Facebook cung cấp dịch vụ miễn phí và kiếm tiền chủ yếu theo mô hình doanh thu nào?', options: ['Đăng ký', 'Quảng cáo', 'Bán phần cứng', 'Phí giao dịch mua bán'], correctIndex: 1, explanation: 'Họ dùng mô hình quảng cáo: dịch vụ miễn phí, bán sự chú ý của người dùng.' },
]);

const c7 = doc('isd201-7-1-digital-transformation', '7.1 — Digital transformation & emerging tech|||7.1 — Chuyển đổi số & công nghệ mới nổi',
  'Số hoá vs chuyển đổi số; ba trụ cột (trải nghiệm khách hàng, quy trình vận hành, mô hình kinh doanh); tổng quan AI/ML, IoT, blockchain và ý nghĩa với doanh nghiệp.',
  [[
    `<span class="eyebrow">ISD201 · Chapter 7 · Lesson 7.1</span>
<h2>Digital transformation &amp; emerging technologies</h2>
<h3>Digitisation vs digital transformation</h3>
<p>Putting a paper form online is <strong>digitisation</strong>. <strong>Digital transformation</strong> is deeper — rethinking business models, processes and customer experience around digital capabilities. It is a strategy and culture change, not an IT project (McKinsey/HBR stress that most failures are about people, not technology).</p>
<h3>Three areas transformed</h3>
<ul>
<li><strong>Customer experience</strong> — understanding and serving customers digitally.</li>
<li><strong>Operational processes</strong> — automating and instrumenting how work is done.</li>
<li><strong>Business models</strong> — new digital products, platforms or revenue streams.</li>
</ul>
<h3>Emerging technologies (overview)</h3>
<pre><code>AI / Machine Learning -> systems that learn from data to predict/decide
IoT (Internet of Things) -> everyday devices with sensors, online
Blockchain -> a shared, tamper-resistant distributed ledger</code></pre>
<p>Each is a tool, not magic: the manager's job is to ask <em>which problem</em> it solves and whether the value beats the cost and risk.</p>
<div class="callout"><span class="badge">Real example</span> <strong>Domino's</strong> rebranded as "a tech company that sells pizza" — ordering via app, voice and watch, AI demand forecasting, GPS delivery tracking. Transformation of the whole model, not one website.</div>`,
    `<span class="eyebrow">ISD201 · Chương 7 · Bài 7.1</span>
<h2>Chuyển đổi số &amp; công nghệ mới nổi</h2>
<h3>Số hoá vs chuyển đổi số</h3>
<p>Đưa một tờ khai giấy lên mạng là <strong>số hoá (digitisation)</strong>. <strong>Chuyển đổi số (digital transformation)</strong> sâu hơn — nghĩ lại mô hình kinh doanh, quy trình và trải nghiệm khách hàng quanh năng lực số. Đó là thay đổi chiến lược và văn hoá, không phải dự án CNTT (McKinsey/HBR nhấn mạnh phần lớn thất bại nằm ở con người, không phải công nghệ).</p>
<h3>Ba lĩnh vực được chuyển đổi</h3>
<ul>
<li><strong>Trải nghiệm khách hàng</strong> — hiểu và phục vụ khách hàng bằng phương thức số.</li>
<li><strong>Quy trình vận hành</strong> — tự động hoá và số hoá cách công việc được làm.</li>
<li><strong>Mô hình kinh doanh</strong> — sản phẩm số, nền tảng hay dòng doanh thu mới.</li>
</ul>
<h3>Công nghệ mới nổi (tổng quan)</h3>
<pre><code>AI / Học máy -> hệ thống học từ dữ liệu để dự đoán/quyết định
IoT (Internet vạn vật) -> thiết bị đời thường gắn cảm biến, lên mạng
Blockchain -> sổ cái phân tán dùng chung, chống sửa đổi</code></pre>
<p>Mỗi thứ là một công cụ, không phải phép màu: việc của nhà quản lý là hỏi nó giải <em>bài toán nào</em> và giá trị có vượt chi phí cùng rủi ro không.</p>
<div class="callout"><span class="badge">Ví dụ thật</span> <strong>Domino's</strong> tự định vị lại là "công ty công nghệ bán pizza" — đặt hàng qua app, giọng nói và đồng hồ, AI dự báo nhu cầu, theo dõi giao hàng bằng GPS. Chuyển đổi cả mô hình, không chỉ một website.</div>`,
  ]]);

const c7q = quiz('isd201-quiz-7', 'Quiz 7 — Digital transformation|||Quiz 7 — Chuyển đổi số', [
  { id: 'q1', question: 'Khác biệt cốt lõi giữa "số hoá" và "chuyển đổi số" là?', options: ['Không có khác biệt', 'Số hoá là đưa cái cũ lên mạng; chuyển đổi số nghĩ lại mô hình, quy trình & trải nghiệm quanh năng lực số', 'Chuyển đổi số chỉ là mua phần mềm mới', 'Số hoá tốn kém hơn'], correctIndex: 1, explanation: 'Chuyển đổi số là thay đổi chiến lược/văn hoá, không chỉ số hoá tài liệu.' },
  { id: 'q2', question: 'Công nghệ nào được mô tả là "sổ cái phân tán dùng chung, chống sửa đổi"?', options: ['IoT', 'Blockchain', 'OLAP', 'TPS'], correctIndex: 1, explanation: 'Blockchain là sổ cái phân tán, chống can thiệp, dùng chung giữa nhiều bên.' },
  { id: 'q3', question: 'Theo McKinsey/HBR, nguyên nhân phổ biến nhất khiến chuyển đổi số thất bại là?', options: ['Thiếu phần cứng mạnh', 'Yếu tố con người & văn hoá, không phải công nghệ', 'Internet quá chậm', 'Không có đủ dữ liệu'], correctIndex: 1, explanation: 'Chuyển đổi số là thay đổi con người/tổ chức; phần lớn thất bại đến từ đó.' },
]);

const c8 = doc('isd201-8-1-security-ethics-governance', '8.1 — Security, ethics & IS governance|||8.1 — An ninh, đạo đức & quản trị HTTT',
  'Bộ ba CIA (confidentiality, integrity, availability); mối đe doạ & kiểm soát; quyền riêng tư & đạo đức thông tin; quản trị CNTT (IT governance); tổng quan quản lý dự án HTTT.',
  [[
    `<span class="eyebrow">ISD201 · Chapter 8 · Lesson 8.1</span>
<h2>Security, ethics &amp; IS governance</h2>
<h3>Information security: the CIA triad</h3>
<ul>
<li><strong>Confidentiality</strong> — only authorised people see the data.</li>
<li><strong>Integrity</strong> — data is accurate and unaltered.</li>
<li><strong>Availability</strong> — the system is up when needed.</li>
</ul>
<p>Threats include malware, phishing, ransomware and insider error; controls include access control, encryption, firewalls, backups and user training.</p>
<h3>Privacy &amp; ethics</h3>
<p>Systems collect huge personal data, raising <strong>privacy</strong> duties. Laws like the EU's <strong>GDPR</strong> and Vietnam's PDPD govern how data is used. Ethics goes beyond law — fairness, transparency, avoiding harm and algorithmic bias.</p>
<h3>IT governance</h3>
<p><strong>IT governance</strong> aligns IT decisions with business goals — who decides investments, how risk is managed, how value is measured (frameworks like COBIT/ITIL).</p>
<h3>Managing IS projects</h3>
<p>Systems are delivered as <strong>projects</strong> balancing scope, time and cost. Many fail from poor requirements or change management — success is as much organisational as technical.</p>
<div class="callout"><span class="badge">Real example</span> The <strong>2017 Equifax breach</strong> exposed 147 million people's data via one unpatched component — a failure of security controls and governance, showing that neglected basics, not exotic attacks, cause most disasters.</div>`,
    `<span class="eyebrow">ISD201 · Chương 8 · Bài 8.1</span>
<h2>An ninh, đạo đức &amp; quản trị HTTT</h2>
<h3>An ninh thông tin: bộ ba CIA</h3>
<ul>
<li><strong>Bảo mật (Confidentiality)</strong> — chỉ người được phép mới xem được dữ liệu.</li>
<li><strong>Toàn vẹn (Integrity)</strong> — dữ liệu chính xác và không bị sửa đổi.</li>
<li><strong>Sẵn sàng (Availability)</strong> — hệ thống hoạt động khi cần.</li>
</ul>
<p>Mối đe doạ gồm mã độc, lừa đảo (phishing), ransomware và sai sót nội bộ; biện pháp kiểm soát gồm kiểm soát truy cập, mã hoá, tường lửa, sao lưu và đào tạo người dùng.</p>
<h3>Quyền riêng tư &amp; đạo đức</h3>
<p>Hệ thống thu thập lượng lớn dữ liệu cá nhân, làm nảy sinh bổn phận về <strong>quyền riêng tư</strong>. Các luật như <strong>GDPR</strong> của EU và Nghị định bảo vệ dữ liệu cá nhân (PDPD) của Việt Nam điều chỉnh cách dùng dữ liệu. Đạo đức vượt trên luật — công bằng, minh bạch, tránh gây hại và thiên lệch thuật toán.</p>
<h3>Quản trị CNTT</h3>
<p><strong>Quản trị CNTT (IT governance)</strong> gắn quyết định CNTT với mục tiêu kinh doanh — ai quyết đầu tư, quản rủi ro thế nào, đo giá trị ra sao (khung như COBIT/ITIL).</p>
<h3>Quản lý dự án HTTT</h3>
<p>Hệ thống được triển khai dưới dạng <strong>dự án</strong> cân bằng phạm vi, thời gian và chi phí. Nhiều dự án thất bại vì yêu cầu kém hoặc quản lý thay đổi kém — thành công vừa mang tính tổ chức vừa mang tính kỹ thuật.</p>
<div class="callout"><span class="badge">Ví dụ thật</span> <strong>Vụ rò rỉ Equifax 2017</strong> làm lộ dữ liệu của 147 triệu người qua một thành phần chưa vá lỗi — một thất bại về kiểm soát an ninh và quản trị, cho thấy những điều cơ bản bị bỏ bê, chứ không phải đòn tấn công kỳ lạ, mới gây ra phần lớn thảm hoạ.</div>`,
  ]]);

const c8q = quiz('isd201-quiz-8', 'Quiz 8 — Security & governance|||Quiz 8 — An ninh & quản trị', [
  { id: 'q1', question: 'Bộ ba CIA trong an ninh thông tin gồm?', options: ['Cost, Interest, Access', 'Confidentiality, Integrity, Availability', 'Client, Internet, Application', 'Control, Input, Analysis'], correctIndex: 1, explanation: 'CIA = Bảo mật (Confidentiality), Toàn vẹn (Integrity), Sẵn sàng (Availability).' },
  { id: 'q2', question: 'GDPR (EU) và Nghị định bảo vệ dữ liệu cá nhân (VN) chủ yếu điều chỉnh điều gì?', options: ['Tốc độ mạng', 'Cách tổ chức thu thập & sử dụng dữ liệu cá nhân (quyền riêng tư)', 'Giá phần mềm', 'Kích thước máy chủ'], correctIndex: 1, explanation: 'Đây là luật/quy định về bảo vệ dữ liệu cá nhân và quyền riêng tư.' },
  { id: 'q3', question: '"Quản trị CNTT" (IT governance) nhằm mục đích chính là?', options: ['Viết mã nhanh hơn', 'Gắn quyết định CNTT với mục tiêu kinh doanh, quản rủi ro & đo giá trị', 'Thay toàn bộ nhân viên bằng máy', 'Tắt hết tường lửa'], correctIndex: 1, explanation: 'IT governance bảo đảm đầu tư/rủi ro CNTT phục vụ mục tiêu tổ chức (COBIT/ITIL).' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'ISD201',
    slug: 'isd201-information-systems-in-the-digital-age',
    title: 'Information Systems in the Digital Age',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/ISD201.webp',
    shortDescription: 'What information systems are & how organisations run on them — data to knowledge, IS & business strategy, IT infrastructure & cloud, data & databases, IS types (ERP/CRM/SCM), e-commerce, digital transformation & security. Bilingual with real cases & quizzes.|||HTTT là gì & tổ chức vận hành trên nó ra sao — từ dữ liệu tới tri thức, chiến lược, hạ tầng & cloud, dữ liệu & CSDL, các loại HTTT (ERP/CRM/SCM), TMĐT, chuyển đổi số & an ninh. Song ngữ, có case thật & quiz.',
    description: 'Môn <strong>ISD201 — Information Systems in the Digital Age</strong> (Hệ thống thông tin trong kỷ nguyên số, ngành Chuyển đổi số, kỳ 3) giúp hiểu <strong>tổ chức vận hành trên thông tin thế nào</strong>. Từ <strong>HTTT là gì</strong> (dữ liệu → thông tin → tri thức, năm thành phần) → <strong>HTTT &amp; chiến lược</strong> (Porter, chuỗi giá trị, kinh doanh số) → <strong>hạ tầng CNTT &amp; cloud</strong> (IaaS/PaaS/SaaS) → <strong>dữ liệu &amp; quản trị dữ liệu</strong> (CSDL, data warehouse, big data, governance) → <strong>các loại HTTT</strong> (TPS/MIS/DSS/ESS/ERP/CRM/SCM) → <strong>thương mại điện tử &amp; kinh doanh số</strong> → <strong>chuyển đổi số &amp; công nghệ mới nổi</strong> (AI, IoT, blockchain) → <strong>an ninh, đạo đức &amp; quản trị HTTT</strong>. Bám giáo trình chuẩn quốc tế (Laudon &amp; Laudon, Rainer), song ngữ, có mô hình và ví dụ doanh nghiệp thật, quiz mỗi chương.',
    whatYouLearn: 'HTTT là gì (data → information → knowledge), năm thành phần & mô hình input–process–output; HTTT & chiến lược: Porter (5 forces, 3 chiến lược), chuỗi giá trị, digital business; hạ tầng CNTT (phần cứng, phần mềm, mạng) & điện toán đám mây (IaaS/PaaS/SaaS); dữ liệu (CSDL quan hệ, SQL, data warehouse, big data 5V) & data governance; các loại HTTT (TPS, MIS, DSS, ESS, ERP, CRM, SCM); mô hình TMĐT (B2C/B2B/C2C), doanh thu & nền tảng số; chuyển đổi số & công nghệ mới nổi (AI, IoT, blockchain); an ninh (CIA), quyền riêng tư, đạo đức, IT governance & quản lý dự án HTTT.',
    requirements: 'Không cần kiến thức nền chuyên ngành. Quen dùng máy tính & Internet cơ bản là đủ. Tham khảo giáo trình trên FLM (flm.fpt.edu.vn).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách chuẩn (Laudon, Rainer), tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'HTTT là gì, vì sao tổ chức vận hành trên nó, lộ trình môn.', lessons: [intro] },
    { title: 'Chương 1 — HTTT là gì|||Chapter 1 — What an IS is', description: 'Data → information → knowledge, năm thành phần, input–process–output.', lessons: [c1, c1q] },
    { title: 'Chương 2 — HTTT & chiến lược|||Chapter 2 — IS & strategy', description: 'Porter (5 forces, 3 chiến lược), chuỗi giá trị, kinh doanh số.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Hạ tầng & cloud|||Chapter 3 — Infrastructure & cloud', description: 'Phần cứng, phần mềm, mạng, điện toán đám mây (IaaS/PaaS/SaaS).', lessons: [c3, c3q] },
    { title: 'Chương 4 — Dữ liệu & quản trị dữ liệu|||Chapter 4 — Data management', description: 'CSDL & DBMS, data warehouse, big data (5V), data governance.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Các loại HTTT|||Chapter 5 — Types of IS', description: 'TPS, MIS, DSS, ESS, ERP, CRM, SCM.', lessons: [c5, c5q] },
    { title: 'Chương 6 — TMĐT & kinh doanh số|||Chapter 6 — E-commerce', description: 'Mô hình B2C/B2B/C2C, doanh thu, nền tảng số, e-business.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Chuyển đổi số & công nghệ mới|||Chapter 7 — Digital transformation', description: 'Số hoá vs chuyển đổi số, AI, IoT, blockchain.', lessons: [c7, c7q] },
    { title: 'Chương 8 — An ninh, đạo đức & quản trị|||Chapter 8 — Security & governance', description: 'CIA, quyền riêng tư, đạo đức, IT governance, quản lý dự án.', lessons: [c8, c8q] },
  ],
};
