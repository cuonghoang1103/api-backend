/**
 * BDT202c — Business Digital Transformation. Giáo trình FLM + tham khảo:
 * Westerman/Bonnet/McAfee "Leading Digital"; Rogers "The Digital
 * Transformation Playbook" (5 domains: Customers/Competition/Data/
 * Innovation/Value); Siebel "Digital Transformation" (4 lực hội tụ: cloud,
 * big data, AI, IoT); McKinsey/Gartner/MIT Sloan Review. Song ngữ + ví dụ +
 * mô hình + quiz. Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('bdt202c-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách nền tảng (Westerman, Rogers, Siebel), tài liệu chính thức miễn phí (McKinsey/HBR/Gartner), lộ trình tự học.',
  [[
    `<span class="eyebrow">BDT202c · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Business Digital Transformation — strategy, customer experience, operations, data, technology platforms, culture and roadmapping — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are the reference books this course is built on plus free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for BDT202c are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Core reference books</h3>
<ul>
<li><em>Leading Digital: Turning Technology into Business Transformation</em> — George Westerman, Didier Bonnet &amp; Andrew McAfee (Harvard Business Review Press). The "Digital Master" framework used in Chapter 7.</li>
<li><em>The Digital Transformation Playbook</em> — David L. Rogers (Columbia Business School Publishing). The five domains — Customers, Competition, Data, Innovation, Value — used across Chapters 2-3.</li>
<li><em>Digital Transformation: Survive and Thrive in an Era of Mass Extinction</em> — Thomas M. Siebel (RosettaBooks). The four converging forces — cloud, big data, AI, IoT — used in Chapter 1 and Chapter 6.</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://en.wikipedia.org/wiki/Digital_transformation" target="_blank" rel="noopener">Wikipedia — Digital transformation</a> — definitions &amp; history</li>
<li><a href="https://hbr.org/topic/digital-transformation" target="_blank" rel="noopener">Harvard Business Review — Digital Transformation topic hub</a></li>
<li><a href="https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights" target="_blank" rel="noopener">McKinsey Digital — Insights</a></li>
<li><a href="https://www.gartner.com/en/information-technology/glossary/digital-transformation" target="_blank" rel="noopener">Gartner Glossary — Digital Transformation</a></li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — what digital transformation is and why it matters (Chapter 1), digital strategy and business models (Chapter 2).</li>
<li><strong>Front-office</strong> — digital customer experience &amp; marketing (Chapter 3).</li>
<li><strong>Back-office</strong> — process automation, data, and enabling technology (Chapters 4-6).</li>
<li><strong>Leading it</strong> — change management, culture, maturity, risk and roadmap (Chapters 7-8).</li>
</ol></div>`,
    `<span class="eyebrow">BDT202c · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Chuyển đổi số trong doanh nghiệp — chiến lược, trải nghiệm khách hàng, vận hành, dữ liệu, nền tảng công nghệ và văn hoá — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là các sách nền tảng môn này dựa vào cùng nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của BDT202c có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo nền tảng</h3>
<ul>
<li><em>Leading Digital: Turning Technology into Business Transformation</em> — George Westerman, Didier Bonnet &amp; Andrew McAfee (Harvard Business Review Press). Mô hình "Digital Master" dùng ở Chương 7.</li>
<li><em>The Digital Transformation Playbook</em> — David L. Rogers (Columbia Business School Publishing). Năm miền — Khách hàng, Cạnh tranh, Dữ liệu, Đổi mới, Giá trị — dùng xuyên Chương 2-3.</li>
<li><em>Digital Transformation: Survive and Thrive in an Era of Mass Extinction</em> — Thomas M. Siebel (RosettaBooks). Bốn lực hội tụ — cloud, big data, AI, IoT — dùng ở Chương 1 và Chương 6.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://en.wikipedia.org/wiki/Digital_transformation" target="_blank" rel="noopener">Wikipedia — Digital transformation</a> — định nghĩa &amp; lịch sử</li>
<li><a href="https://hbr.org/topic/digital-transformation" target="_blank" rel="noopener">Harvard Business Review — chuyên mục Digital Transformation</a></li>
<li><a href="https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights" target="_blank" rel="noopener">McKinsey Digital — Insights</a></li>
<li><a href="https://www.gartner.com/en/information-technology/glossary/digital-transformation" target="_blank" rel="noopener">Gartner Glossary — Digital Transformation</a></li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — chuyển đổi số là gì và vì sao cần (Chương 1), chiến lược số &amp; mô hình kinh doanh số (Chương 2).</li>
<li><strong>Tuyến trước (front-office)</strong> — trải nghiệm khách hàng &amp; marketing số (Chương 3).</li>
<li><strong>Tuyến sau (back-office)</strong> — tự động hoá quy trình, dữ liệu, công nghệ nền tảng (Chương 4-6).</li>
<li><strong>Dẫn dắt chuyển đổi</strong> — quản trị thay đổi, văn hoá, đo lường mức độ trưởng thành, rủi ro và lộ trình (Chương 7-8).</li>
</ol></div>`,
  ]]);

const intro = doc('bdt202c-0-1-overview', 'Course overview: Business Digital Transformation|||Tổng quan: Chuyển đổi số trong doanh nghiệp',
  'Chuyển đổi số là gì, vì sao doanh nghiệp buộc phải làm; ba cấp độ digitization/digitalization/digital transformation; lộ trình 8 chương của môn.',
  [[
    `<span class="eyebrow">BDT202c · Lesson 0.1 · Overview</span>
<h2>Business Digital Transformation</h2>
<p class="lead">This course explains <strong>why every business is under pressure to transform digitally</strong>, and gives you the frameworks managers actually use to lead that change — not just "buy some software". You will learn to read a business through a digital lens: strategy, customer experience, operations, data, technology and people.</p>
<h3>Three levels — don't confuse them</h3>
<ul>
<li><strong>Digitization</strong> — converting analog information into digital form (paper contract → PDF).</li>
<li><strong>Digitalization</strong> — using digital technology to change an existing process (manual approval → automated workflow).</li>
<li><strong>Digital transformation</strong> — using digital technology to fundamentally change <em>how a business creates and delivers value</em> — new business models, new customer relationships, a different organization (Westerman, Bonnet &amp; McAfee, <em>Leading Digital</em>).</li>
</ul>
<h3>Why now — Siebel's four converging forces</h3>
<p>Thomas Siebel argues four technologies matured and converged at the same time, making transformation unavoidable: <strong>cloud computing</strong> (elastic, cheap compute), <strong>big data</strong> (data volumes exploding), <strong>artificial intelligence</strong> (usable at scale), and <strong>the Internet of Things</strong> (everything generates data). Together they let a company sense, decide and act faster than competitors who don't.</p>
<h3>Roadmap of this course</h3>
<p>Ch.1 what &amp; why → Ch.2 digital strategy &amp; business models → Ch.3 digital customer experience &amp; marketing → Ch.4 process &amp; operations automation → Ch.5 data-driven decisions → Ch.6 enabling technology platforms → Ch.7 change management &amp; digital culture → Ch.8 maturity, risk &amp; roadmap.</p>`,
    `<span class="eyebrow">BDT202c · Bài 0.1 · Tổng quan</span>
<h2>Chuyển đổi số trong doanh nghiệp</h2>
<p class="lead">Môn này giải thích <strong>vì sao mọi doanh nghiệp đang chịu áp lực phải chuyển đổi số</strong>, và trao cho bạn những mô hình nhà quản lý thực sự dùng để dẫn dắt sự thay đổi đó — chứ không chỉ "mua phần mềm mới". Bạn sẽ học cách nhìn một doanh nghiệp qua lăng kính số: chiến lược, trải nghiệm khách hàng, vận hành, dữ liệu, công nghệ và con người.</p>
<h3>Ba cấp độ — đừng nhầm lẫn</h3>
<ul>
<li><strong>Số hoá dữ liệu (digitization)</strong> — chuyển thông tin analog sang dạng số (hợp đồng giấy → PDF).</li>
<li><strong>Số hoá quy trình (digitalization)</strong> — dùng công nghệ số để thay đổi một quy trình sẵn có (duyệt tay → luồng phê duyệt tự động).</li>
<li><strong>Chuyển đổi số (digital transformation)</strong> — dùng công nghệ số để thay đổi tận gốc <em>cách doanh nghiệp tạo ra và giao giá trị</em> — mô hình kinh doanh mới, quan hệ khách hàng mới, tổ chức khác đi (Westerman, Bonnet &amp; McAfee, <em>Leading Digital</em>).</li>
</ul>
<h3>Vì sao là bây giờ — bốn lực hội tụ của Siebel</h3>
<p>Thomas Siebel lập luận bốn công nghệ chín muồi và hội tụ cùng lúc, khiến chuyển đổi trở thành điều không tránh khỏi: <strong>điện toán đám mây</strong> (tính toán co giãn, rẻ), <strong>dữ liệu lớn</strong> (khối lượng dữ liệu bùng nổ), <strong>trí tuệ nhân tạo</strong> (dùng được ở quy mô lớn), và <strong>Internet vạn vật (IoT)</strong> (mọi thứ đều sinh ra dữ liệu). Cùng nhau, chúng cho phép một công ty cảm nhận, quyết định và hành động nhanh hơn đối thủ không làm vậy.</p>
<h3>Lộ trình môn học</h3>
<p>Ch.1 là gì &amp; vì sao → Ch.2 chiến lược số &amp; mô hình kinh doanh số → Ch.3 trải nghiệm khách hàng &amp; marketing số → Ch.4 tự động hoá quy trình &amp; vận hành → Ch.5 ra quyết định dựa trên dữ liệu → Ch.6 công nghệ nền tảng → Ch.7 quản trị thay đổi &amp; văn hoá số → Ch.8 mức độ trưởng thành, rủi ro &amp; lộ trình.</p>`,
  ]]);

// ---- Chapter 1 ----
const c1 = doc('bdt202c-1-1-what-why', '1.1 — What is digital transformation & why it matters|||1.1 — Chuyển đổi số là gì & vì sao doanh nghiệp cần',
  'Định nghĩa chuyển đổi số (Westerman); áp lực buộc doanh nghiệp thay đổi (khách hàng số, đối thủ digital-native, gián đoạn ngành); ví dụ Kodak/Blockbuster vs Netflix.',
  [[
    `<span class="eyebrow">BDT202c · Chapter 1 · Lesson 1.1</span>
<h2>What is digital transformation, and why now?</h2>
<h3>Definition</h3>
<p><strong>Digital transformation</strong> is the use of technology to radically improve the performance or reach of an enterprise — not just automating a task, but rethinking value creation, customer relationships and organizational capability around what digital technology now makes possible (Westerman, Bonnet &amp; McAfee).</p>
<h3>The pressure to change</h3>
<ul>
<li><strong>Customer expectations shifted</strong> — people compare every experience to the best digital experience they've had anywhere (Amazon delivery speed, Netflix personalization), not just to your industry.</li>
<li><strong>Digital-native competitors</strong> enter with no legacy systems, no legacy org chart, and a cost structure built for the internet age.</li>
<li><strong>Industry disruption</strong> — technology changes who can compete and how value is captured (see the case below).</li>
</ul>
<pre><code>Case: Kodak vs digital photography
 Kodak INVENTED the digital camera (1975) but protected its film
 business -> filed for bankruptcy in 2012.
 Lesson: the risk isn't missing the technology, it's protecting
 the OLD business model instead of building the new one.

Case: Blockbuster vs Netflix
 Blockbuster's model = late fees + physical stores.
 Netflix's model = subscription + streaming, built for the
 customer's convenience, not the store's real-estate.
 Blockbuster passed on buying Netflix in 2000 for $50M;
 Netflix now (as of writing) is worth >100x that.
</code></pre>
<div class="callout"><span class="badge">Key idea</span> Digital transformation is a <strong>business</strong> problem, not an IT problem. Buying new software without changing strategy, processes and culture is digitalization, not transformation.</div>`,
    `<span class="eyebrow">BDT202c · Chương 1 · Bài 1.1</span>
<h2>Chuyển đổi số là gì, và vì sao là bây giờ?</h2>
<h3>Định nghĩa</h3>
<p><strong>Chuyển đổi số</strong> là việc dùng công nghệ để cải thiện tận gốc hiệu suất hoặc tầm với của một doanh nghiệp — không chỉ tự động hoá một tác vụ, mà nghĩ lại cách tạo giá trị, quan hệ khách hàng và năng lực tổ chức xoay quanh những gì công nghệ số hiện cho phép (Westerman, Bonnet &amp; McAfee).</p>
<h3>Áp lực buộc phải thay đổi</h3>
<ul>
<li><strong>Kỳ vọng khách hàng đã đổi</strong> — người dùng so sánh mọi trải nghiệm với trải nghiệm số tốt nhất họ từng có ở bất kỳ đâu (tốc độ giao hàng của Amazon, cá nhân hoá của Netflix), không chỉ so trong ngành của bạn.</li>
<li><strong>Đối thủ digital-native</strong> gia nhập không mang theo hệ thống cũ, không cơ cấu tổ chức cũ, và có cấu trúc chi phí sinh ra cho thời internet.</li>
<li><strong>Ngành bị gián đoạn (disruption)</strong> — công nghệ thay đổi ai có thể cạnh tranh và giá trị được thu về bằng cách nào (xem ca dưới).</li>
</ul>
<pre><code>Ca: Kodak vs nhiếp ảnh số
 Kodak PHÁT MINH ra máy ảnh số (1975) nhưng bảo vệ mảng phim ->
 phá sản năm 2012.
 Bài học: rủi ro không phải là bỏ lỡ công nghệ, mà là bảo vệ
 mô hình kinh doanh CŨ thay vì xây mô hình mới.

Ca: Blockbuster vs Netflix
 Mô hình Blockbuster = phí trễ hạn + cửa hàng vật lý.
 Mô hình Netflix = thuê bao + streaming, xây cho sự tiện lợi
 của khách hàng, không phải cho mặt bằng cửa hàng.
 Năm 2000 Blockbuster từ chối mua Netflix với giá 50 triệu USD;
 Netflix hiện (tại thời điểm viết) có giá trị gấp hơn 100 lần.
</code></pre>
<div class="callout"><span class="badge">Ý chính</span> Chuyển đổi số là bài toán <strong>kinh doanh</strong>, không phải bài toán IT. Mua phần mềm mới mà không đổi chiến lược, quy trình và văn hoá thì đó là số hoá quy trình, không phải chuyển đổi số.</div>`,
  ]]);

const c1q = quiz('bdt202c-quiz-1', 'Quiz 1 — What & why|||Quiz 1 — Là gì & vì sao', [
  { id: 'q1', question: 'Theo Westerman, "digital transformation" khác "digitalization" ở điểm nào?', options: ['Chỉ tốn nhiều tiền hơn', 'Thay đổi tận gốc cách tạo & giao giá trị, không chỉ tự động một quy trình có sẵn', 'Chỉ áp dụng cho công ty công nghệ', 'Không liên quan tới chiến lược'], correctIndex: 1, explanation: 'Digital transformation thay đổi mô hình tạo giá trị, tổ chức và quan hệ khách hàng; digitalization chỉ số hoá một quy trình sẵn có.' },
  { id: 'q2', question: 'Bài học chính từ ca Kodak là gì?', options: ['Kodak không phát minh ra máy ảnh số', 'Có công nghệ mới không đủ — rủi ro là bảo vệ mô hình kinh doanh cũ thay vì xây mô hình mới', 'Máy ảnh số không có tương lai', 'Phá sản là do thiếu vốn'], correctIndex: 1, explanation: 'Kodak sở hữu công nghệ trước ai hết nhưng bảo vệ mảng film hiện tại, không chuyển sang mô hình số.' },
  { id: 'q3', question: 'Theo Siebel, bốn lực hội tụ khiến chuyển đổi số không tránh khỏi gồm?', options: ['Cloud, big data, AI, IoT', 'Marketing, bán hàng, tài chính, nhân sự', 'ERP, CRM, HRM, SCM', 'Facebook, Google, Amazon, Apple'], correctIndex: 0, explanation: 'Bốn công nghệ chín muồi cùng lúc: điện toán đám mây, dữ liệu lớn, AI, và Internet vạn vật (IoT).' },
]);

// ---- Chapter 2 ----
const c2 = doc('bdt202c-2-1-strategy-business-model', '2.1 — Digital strategy & digital business models|||2.1 — Chiến lược số & mô hình kinh doanh số',
  'Khung 5 miền của Rogers (Khách hàng, Cạnh tranh, Dữ liệu, Đổi mới, Giá trị); các mô hình kinh doanh số: nền tảng, thuê bao, freemium, chợ điện tử; ví dụ.',
  [[
    `<span class="eyebrow">BDT202c · Chapter 2 · Lesson 2.1</span>
<h2>Digital strategy &amp; digital business models</h2>
<h3>Rogers' five domains</h3>
<p>David Rogers argues digital strategy is not "one more department" but a lens that changes five domains at once:</p>
<pre><code>1. Customers   : from segments -> to a dynamic NETWORK of customers
2. Competition : from within your industry -> from ANY adjacent platform
3. Data        : from a byproduct -> a strategic ASSET
4. Innovation  : from big, slow bets -> rapid, cheap EXPERIMENTS
5. Value       : from a fixed proposition -> a constantly EVOLVING one
</code></pre>
<h3>Digital business models</h3>
<ul>
<li><strong>Platform / marketplace</strong> — connects two or more sides (buyers &amp; sellers) and earns from the connection, not from owning inventory (Grab, Shopee).</li>
<li><strong>Subscription / SaaS</strong> — recurring revenue for ongoing access instead of one-time sale (Netflix, Spotify, most B2B software).</li>
<li><strong>Freemium</strong> — free tier drives adoption; a paid tier monetizes power users (Zoom, LinkedIn).</li>
<li><strong>Data-driven / data-as-a-service</strong> — the data generated by the core product becomes a sellable asset (e.g. insurers pricing risk from telematics data).</li>
</ul>
<div class="callout"><span class="badge">Strategic question</span> Don't ask "which technology should we buy?" Ask: "which of the five domains changes first for our customers — and are we positioned to lead it or be disrupted by it?"</div>`,
    `<span class="eyebrow">BDT202c · Chương 2 · Bài 2.1</span>
<h2>Chiến lược số &amp; mô hình kinh doanh số</h2>
<h3>Khung năm miền của Rogers</h3>
<p>David Rogers lập luận chiến lược số không phải "thêm một phòng ban" mà là một lăng kính làm đổi cùng lúc năm miền:</p>
<pre><code>1. Khách hàng : từ các phân khúc tĩnh -> MẠNG LƯỚI khách hàng động
2. Cạnh tranh : từ trong ngành của bạn -> từ BẤT KỲ nền tảng lân cận
3. Dữ liệu    : từ sản phẩm phụ -> TÀI SẢN chiến lược
4. Đổi mới    : từ đặt cược lớn, chậm -> THỬ NGHIỆM nhanh, rẻ
5. Giá trị    : từ đề xuất cố định -> đề xuất TIẾN HOÁ liên tục
</code></pre>
<h3>Các mô hình kinh doanh số</h3>
<ul>
<li><strong>Nền tảng / chợ điện tử</strong> — kết nối hai hay nhiều bên (người mua &amp; người bán) và kiếm tiền từ kết nối đó, không phải từ sở hữu hàng tồn kho (Grab, Shopee).</li>
<li><strong>Thuê bao / SaaS</strong> — doanh thu định kỳ cho quyền truy cập liên tục thay vì bán một lần (Netflix, Spotify, phần lớn phần mềm B2B).</li>
<li><strong>Freemium</strong> — gói miễn phí thúc đẩy người dùng mới; gói trả phí kiếm tiền từ người dùng nặng (Zoom, LinkedIn).</li>
<li><strong>Dựa trên dữ liệu / data-as-a-service</strong> — dữ liệu sinh ra từ sản phẩm cốt lõi trở thành tài sản bán được (vd công ty bảo hiểm định giá rủi ro từ dữ liệu telematics).</li>
</ul>
<div class="callout"><span class="badge">Câu hỏi chiến lược</span> Đừng hỏi "nên mua công nghệ nào?" Hãy hỏi: "miền nào trong năm miền sẽ đổi trước với khách hàng của chúng ta — và chúng ta đang ở vị trí dẫn dắt hay bị nó làm gián đoạn?"</div>`,
  ]]);

const c2q = quiz('bdt202c-quiz-2', 'Quiz 2 — Strategy & business models|||Quiz 2 — Chiến lược & mô hình kinh doanh', [
  { id: 'q1', question: 'Trong khung 5 miền của Rogers, dữ liệu được nhìn nhận thế nào?', options: ['Một sản phẩm phụ không quan trọng', 'Một tài sản chiến lược', 'Chỉ dùng để báo cáo cuối năm', 'Chi phí cần cắt giảm'], correctIndex: 1, explanation: 'Rogers chuyển dữ liệu từ "sản phẩm phụ" thành "tài sản chiến lược" cần khai thác chủ động.' },
  { id: 'q2', question: 'Mô hình kinh doanh nào kiếm tiền chủ yếu từ kết nối người mua và người bán, không sở hữu hàng tồn kho?', options: ['Freemium', 'Thuê bao (subscription)', 'Nền tảng / chợ điện tử (platform)', 'Bán lẻ truyền thống'], correctIndex: 2, explanation: 'Mô hình nền tảng/marketplace thu phí từ giao dịch hoặc kết nối, không cần sở hữu hàng hoá.' },
  { id: 'q3', question: 'Theo Rogers, cạnh tranh trong kỷ nguyên số đến từ đâu?', options: ['Chỉ từ đối thủ cùng ngành', 'Từ bất kỳ nền tảng lân cận nào, không chỉ trong ngành', 'Không còn cạnh tranh nữa', 'Chỉ từ công ty lớn hơn'], correctIndex: 1, explanation: 'Miền "Cạnh tranh" trong khung Rogers mở rộng ra bất kỳ ai có thể phục vụ cùng nhu cầu khách hàng, kể cả từ ngành khác.' },
]);

// ---- Chapter 3 ----
const c3 = doc('bdt202c-3-1-customer-experience-marketing', '3.1 — Digital customer experience & digital marketing|||3.1 — Trải nghiệm khách hàng số & marketing số',
  'Hành trình khách hàng đa kênh (omnichannel), cá nhân hoá, phễu marketing số (SEO/SEM, social, content, CRM), nền tảng dữ liệu khách hàng (CDP).',
  [[
    `<span class="eyebrow">BDT202c · Chapter 3 · Lesson 3.1</span>
<h2>Digital customer experience &amp; digital marketing</h2>
<h3>The omnichannel customer journey</h3>
<p>Customers move fluidly across channels — website, app, social media, physical store, call center — and expect the experience to be <strong>consistent and connected</strong>, not siloed. Mapping the journey (awareness → consideration → purchase → onboarding → loyalty → advocacy) reveals where digital friction loses customers.</p>
<h3>The digital marketing funnel</h3>
<pre><code>Reach     : SEO (organic search) + SEM/paid ads + social media
Engage    : content marketing, email, influencer/community
Convert   : landing pages, retargeting, CRM-driven offers
Retain    : loyalty programs, personalization, customer success
</code></pre>
<h3>Personalization &amp; the Customer Data Platform (CDP)</h3>
<p>A <strong>CDP</strong> unifies customer data from every touchpoint (web, app, purchases, support) into one profile, so marketing, sales and service all see the same customer — enabling personalization at scale (a recommendation, a targeted offer, a proactive support message) instead of generic, one-size-fits-all messaging.</p>
<div class="callout"><span class="badge">Metric to watch</span> <strong>Customer Lifetime Value (CLV)</strong> vs <strong>Customer Acquisition Cost (CAC)</strong> — digital channels make both far easier to measure, and a CLV:CAC ratio below ~3:1 is a warning sign for the marketing strategy.</div>`,
    `<span class="eyebrow">BDT202c · Chương 3 · Bài 3.1</span>
<h2>Trải nghiệm khách hàng số &amp; marketing số</h2>
<h3>Hành trình khách hàng đa kênh (omnichannel)</h3>
<p>Khách hàng di chuyển linh hoạt giữa các kênh — website, app, mạng xã hội, cửa hàng vật lý, tổng đài — và kỳ vọng trải nghiệm <strong>nhất quán và liền mạch</strong>, không rời rạc. Vẽ bản đồ hành trình (nhận biết → cân nhắc → mua → làm quen → trung thành → giới thiệu) cho thấy chỗ nào ma sát số đang làm mất khách hàng.</p>
<h3>Phễu marketing số</h3>
<pre><code>Tiếp cận   : SEO (tìm kiếm tự nhiên) + SEM/quảng cáo trả phí + mạng xã hội
Tương tác  : content marketing, email, influencer/cộng đồng
Chuyển đổi : landing page, retargeting, ưu đãi dẫn dắt bởi CRM
Giữ chân   : chương trình trung thành, cá nhân hoá, chăm sóc khách hàng
</code></pre>
<h3>Cá nhân hoá &amp; nền tảng dữ liệu khách hàng (CDP)</h3>
<p>Một <strong>CDP</strong> hợp nhất dữ liệu khách hàng từ mọi điểm chạm (web, app, mua hàng, hỗ trợ) thành một hồ sơ duy nhất, để marketing, bán hàng và dịch vụ đều nhìn thấy cùng một khách hàng — cho phép cá nhân hoá ở quy mô lớn (một gợi ý, một ưu đãi nhắm đúng, một tin nhắn hỗ trợ chủ động) thay vì thông điệp chung chung.</p>
<div class="callout"><span class="badge">Chỉ số cần theo dõi</span> <strong>Giá trị vòng đời khách hàng (CLV)</strong> so với <strong>Chi phí thu hút khách hàng (CAC)</strong> — kênh số giúp đo cả hai dễ hơn nhiều, và tỉ lệ CLV:CAC dưới ~3:1 là dấu hiệu cảnh báo cho chiến lược marketing.</div>`,
  ]]);

const c3q = quiz('bdt202c-quiz-3', 'Quiz 3 — Digital CX & marketing|||Quiz 3 — Trải nghiệm KH & marketing số', [
  { id: 'q1', question: 'Trải nghiệm khách hàng "omnichannel" có nghĩa là gì?', options: ['Chỉ bán qua một kênh duy nhất', 'Trải nghiệm nhất quán, liền mạch dù khách hàng di chuyển qua nhiều kênh', 'Chỉ dùng mạng xã hội', 'Không cần cửa hàng vật lý'], correctIndex: 1, explanation: 'Omnichannel là trải nghiệm liền mạch, nhất quán xuyên suốt các kênh, không phải chỉ dùng một kênh.' },
  { id: 'q2', question: 'Vai trò chính của một Customer Data Platform (CDP) là gì?', options: ['Chạy quảng cáo tự động', 'Hợp nhất dữ liệu khách hàng từ mọi điểm chạm thành một hồ sơ duy nhất', 'Thay thế đội bán hàng', 'Chỉ lưu trữ email khách hàng'], correctIndex: 1, explanation: 'CDP gom dữ liệu từ web/app/mua hàng/hỗ trợ thành một hồ sơ khách hàng thống nhất để cá nhân hoá.' },
  { id: 'q3', question: 'Tỉ lệ CLV:CAC thấp (dưới khoảng 3:1) là dấu hiệu gì?', options: ['Chiến lược marketing đang rất hiệu quả', 'Cảnh báo — chi phí thu hút khách hàng có thể quá cao so với giá trị họ mang lại', 'Không liên quan tới hiệu quả marketing', 'Công ty nên tăng giá ngay lập tức'], correctIndex: 1, explanation: 'CLV:CAC thấp nghĩa là chi phí thu hút gần bằng hoặc vượt giá trị khách hàng mang lại — cảnh báo hiệu quả marketing.' },
]);

// ---- Chapter 4 ----
const c4 = doc('bdt202c-4-1-operations-automation', '4.1 — Operating process transformation: automation, RPA & ERP|||4.1 — Tối ưu quy trình vận hành: tự động hoá, RPA & ERP',
  'Process mining để tìm nút thắt; RPA (Robotic Process Automation) cho tác vụ lặp lại; ERP tích hợp dữ liệu toàn doanh nghiệp; nguyên tắc lean digital.',
  [[
    `<span class="eyebrow">BDT202c · Chapter 4 · Lesson 4.1</span>
<h2>Operating process transformation</h2>
<h3>Find the bottleneck before automating it</h3>
<p><strong>Process mining</strong> uses system event logs (timestamps of who-did-what-when) to reconstruct how a process <em>actually</em> runs — often revealing rework loops, approval delays and exceptions that the official flowchart never showed. Automating a broken process just makes the broken version faster — fix the process, then automate it.</p>
<h3>RPA — Robotic Process Automation</h3>
<p><strong>RPA</strong> uses software "bots" that mimic a human clicking through existing applications — copying data between systems, filling forms, reconciling records — for high-volume, rule-based, repetitive tasks that don't justify a custom system integration. It is fast to deploy but brittle: a bot breaks when the underlying screen layout changes.</p>
<h3>ERP — Enterprise Resource Planning</h3>
<p>An <strong>ERP</strong> system (SAP, Oracle, Odoo…) integrates core functions — finance, procurement, inventory, HR, manufacturing — on one shared data model, so a sale in one module instantly reflects in inventory and finance elsewhere. ERP is the backbone that makes cross-functional automation and reporting possible.</p>
<pre><code>Lean digital principle:
  1. Map the process AS-IS (process mining / value stream map)
  2. Eliminate waste and non-value steps
  3. THEN automate what remains (RPA for tactical gaps,
     ERP/workflow platforms for the redesigned core process)
</code></pre>
<div class="callout"><span class="badge">Common mistake</span> "Paving the cow path" — automating an inefficient manual process exactly as-is, instead of redesigning it first.</div>`,
    `<span class="eyebrow">BDT202c · Chương 4 · Bài 4.1</span>
<h2>Chuyển đổi quy trình vận hành</h2>
<h3>Tìm nút thắt trước khi tự động hoá</h3>
<p><strong>Process mining (khai phá quy trình)</strong> dùng nhật ký sự kiện của hệ thống (ai làm gì, lúc nào) để dựng lại cách một quy trình <em>thực sự</em> chạy — thường lộ ra các vòng làm lại, chậm trễ phê duyệt và ngoại lệ mà sơ đồ chính thức chưa bao giờ thể hiện. Tự động hoá một quy trình lỗi chỉ khiến bản lỗi chạy nhanh hơn — sửa quy trình trước, rồi mới tự động hoá.</p>
<h3>RPA — Tự động hoá quy trình bằng robot phần mềm</h3>
<p><strong>RPA</strong> dùng "bot" phần mềm mô phỏng thao tác click chuột của con người trên các ứng dụng có sẵn — sao chép dữ liệu giữa hệ thống, điền form, đối soát hồ sơ — cho các tác vụ khối lượng lớn, theo quy tắc, lặp lại mà không đủ giá trị để tích hợp hệ thống tuỳ chỉnh. Triển khai nhanh nhưng dễ vỡ: bot hỏng khi giao diện màn hình gốc thay đổi.</p>
<h3>ERP — Hoạch định nguồn lực doanh nghiệp</h3>
<p>Hệ thống <strong>ERP</strong> (SAP, Oracle, Odoo…) tích hợp các chức năng cốt lõi — tài chính, mua hàng, tồn kho, nhân sự, sản xuất — trên một mô hình dữ liệu dùng chung, để một đơn bán ở module này lập tức phản ánh vào tồn kho và tài chính ở module khác. ERP là xương sống giúp tự động hoá và báo cáo liên phòng ban trở nên khả thi.</p>
<pre><code>Nguyên tắc lean digital:
  1. Vẽ quy trình HIỆN TRẠNG (process mining / value stream map)
  2. Loại bỏ lãng phí và bước không tạo giá trị
  3. RỒI mới tự động hoá phần còn lại (RPA cho khoảng trống
     chiến thuật, ERP/nền tảng workflow cho quy trình lõi đã
     tái thiết kế)
</code></pre>
<div class="callout"><span class="badge">Sai lầm thường gặp</span> "Trải nhựa lối mòn" — tự động hoá y nguyên một quy trình thủ công kém hiệu quả, thay vì tái thiết kế nó trước.</div>`,
  ]]);

const c4q = quiz('bdt202c-quiz-4', 'Quiz 4 — Automation, RPA & ERP|||Quiz 4 — Tự động hoá, RPA & ERP', [
  { id: 'q1', question: 'Process mining dùng để làm gì?', options: ['Đào tiền điện tử', 'Dựng lại cách một quy trình THỰC SỰ chạy từ nhật ký hệ thống', 'Thay thế toàn bộ nhân sự', 'Chỉ dùng cho marketing'], correctIndex: 1, explanation: 'Process mining phân tích event log để thấy quy trình thực tế, kể cả nút thắt và ngoại lệ.' },
  { id: 'q2', question: 'RPA phù hợp nhất với loại tác vụ nào?', options: ['Sáng tạo, không quy tắc rõ ràng', 'Khối lượng lớn, lặp lại, theo quy tắc rõ ràng', 'Ra quyết định chiến lược', 'Thiết kế sản phẩm mới'], correctIndex: 1, explanation: 'RPA hiệu quả nhất với tác vụ lặp lại, rule-based, khối lượng lớn — không phù hợp việc cần phán đoán.' },
  { id: 'q3', question: 'Sai lầm "trải nhựa lối mòn" (paving the cow path) nghĩa là gì?', options: ['Xây đường mới cho công ty', 'Tự động hoá nguyên trạng một quy trình kém hiệu quả thay vì tái thiết kế trước', 'Dùng ERP thay vì RPA', 'Bỏ qua tự động hoá hoàn toàn'], correctIndex: 1, explanation: 'Tự động hoá một quy trình lỗi chỉ làm phiên bản lỗi chạy nhanh hơn — cần sửa quy trình trước.' },
]);

// ---- Chapter 5 ----
const c5 = doc('bdt202c-5-1-data-decision', '5.1 — Data & data-driven decision making|||5.1 — Dữ liệu & ra quyết định dựa trên dữ liệu',
  'Dữ liệu là tài sản chiến lược; quản trị dữ liệu (data governance); ba cấp độ phân tích (mô tả/dự đoán/kê đơn); văn hoá quyết định bằng A/B test & dashboard.',
  [[
    `<span class="eyebrow">BDT202c · Chapter 5 · Lesson 5.1</span>
<h2>Data &amp; data-driven decision making</h2>
<h3>Data as a strategic asset</h3>
<p>Traditionally, data was a byproduct of running the business (a receipt, a log entry). In a digital business, data becomes a <strong>product in itself</strong> — worth collecting deliberately, cleaning, governing and reusing across the organization, because the insight it produces (or the model it trains) has real commercial value.</p>
<h3>Data governance</h3>
<p>Without <strong>data governance</strong> — clear ownership, quality standards, access rules and privacy compliance — a company accumulates data it cannot trust or legally use, and decisions get made on "gut feeling that quotes a number" rather than validated evidence.</p>
<h3>Three levels of analytics maturity</h3>
<pre><code>Descriptive  : "What happened?"       -> dashboards, reports
Predictive   : "What will happen?"    -> forecasting, churn models
Prescriptive : "What should we do?"   -> recommendation/optimization
              engines that suggest or automate the next action
</code></pre>
<h3>Build a decision-making culture, not just a dashboard</h3>
<p>Dashboards alone don't change behavior. Leading digital businesses run <strong>A/B tests</strong> before big rollouts, set explicit hypotheses before looking at data (to avoid cherry-picking), and hold regular reviews where a metric that moved the wrong way triggers action, not just discussion.</p>
<div class="callout"><span class="badge">Watch out</span> Correlation in a dashboard is not causation — a spike in sales next to a marketing campaign could be seasonality. Test the causal claim before betting budget on it.</div>`,
    `<span class="eyebrow">BDT202c · Chương 5 · Bài 5.1</span>
<h2>Dữ liệu &amp; ra quyết định dựa trên dữ liệu</h2>
<h3>Dữ liệu là tài sản chiến lược</h3>
<p>Theo cách truyền thống, dữ liệu là sản phẩm phụ của việc vận hành (một hoá đơn, một dòng log). Trong doanh nghiệp số, dữ liệu trở thành <strong>một sản phẩm tự thân</strong> — đáng để thu thập có chủ đích, làm sạch, quản trị và tái sử dụng khắp tổ chức, vì thông tin nó tạo ra (hoặc mô hình nó huấn luyện) mang giá trị thương mại thật.</p>
<h3>Quản trị dữ liệu (data governance)</h3>
<p>Không có <strong>quản trị dữ liệu</strong> — quyền sở hữu rõ ràng, tiêu chuẩn chất lượng, quy tắc truy cập và tuân thủ quyền riêng tư — công ty tích luỹ dữ liệu không thể tin cậy hoặc không được phép dùng hợp pháp, và quyết định bị đưa ra dựa trên "cảm tính có kèm một con số" thay vì bằng chứng đã kiểm chứng.</p>
<h3>Ba cấp độ trưởng thành phân tích</h3>
<pre><code>Mô tả (descriptive)   : "Điều gì đã xảy ra?"    -> dashboard, báo cáo
Dự đoán (predictive)  : "Điều gì sẽ xảy ra?"    -> dự báo, mô hình churn
Kê đơn (prescriptive) : "Nên làm gì tiếp theo?" -> hệ thống gợi ý/tối ưu
                        tự đề xuất hoặc tự động hành động kế tiếp
</code></pre>
<h3>Xây văn hoá ra quyết định, không chỉ xây dashboard</h3>
<p>Chỉ có dashboard không tự thay đổi hành vi. Doanh nghiệp số dẫn đầu chạy <strong>A/B test</strong> trước khi triển khai diện rộng, đặt giả thuyết rõ ràng trước khi nhìn dữ liệu (tránh chọn số liệu có lợi), và tổ chức họp định kỳ nơi một chỉ số đi sai hướng kích hoạt hành động, không chỉ để thảo luận suông.</p>
<div class="callout"><span class="badge">Cẩn thận</span> Tương quan trên dashboard không phải nhân quả — doanh số tăng cạnh một chiến dịch marketing có thể chỉ là tính mùa vụ. Kiểm định quan hệ nhân quả trước khi đặt cược ngân sách vào đó.</div>`,
  ]]);

const c5q = quiz('bdt202c-quiz-5', 'Quiz 5 — Data & decisions|||Quiz 5 — Dữ liệu & quyết định', [
  { id: 'q1', question: 'Phân tích "prescriptive" (kê đơn) trả lời câu hỏi nào?', options: ['Điều gì đã xảy ra?', 'Điều gì sẽ xảy ra?', 'Chúng ta nên làm gì tiếp theo?', 'Ai chịu trách nhiệm?'], correctIndex: 2, explanation: 'Prescriptive analytics đi xa hơn dự báo, gợi ý hoặc tự động hoá hành động nên làm.' },
  { id: 'q2', question: 'Vì sao quản trị dữ liệu (data governance) quan trọng?', options: ['Để làm chậm quá trình ra quyết định', 'Đảm bảo dữ liệu đáng tin cậy, hợp pháp để dùng cho quyết định', 'Chỉ cần thiết cho công ty công nghệ', 'Không liên quan tới tuân thủ pháp lý'], correctIndex: 1, explanation: 'Thiếu quản trị, dữ liệu không đáng tin và có thể vi phạm quy định về quyền riêng tư.' },
  { id: 'q3', question: 'Vì sao thấy tương quan trên dashboard chưa đủ để hành động?', options: ['Dashboard luôn sai', 'Tương quan không chứng minh được nhân quả — cần kiểm định trước khi đặt cược ngân sách', 'Chỉ cần nhìn dashboard là đủ ra quyết định', 'Dashboard chỉ dùng để trang trí'], correctIndex: 1, explanation: 'Tương quan có thể do yếu tố khác (mùa vụ, trùng hợp) — cần A/B test hoặc kiểm định để xác nhận nhân quả.' },
]);

// ---- Chapter 6 ----
const c6 = doc('bdt202c-6-1-technology-platforms', '6.1 — Enabling technology platforms: cloud, AI, IoT, big data|||6.1 — Công nghệ nền tảng: cloud, AI, IoT, big data',
  'Cloud (IaaS/PaaS/SaaS) và điện toán co giãn; AI/machine learning trong doanh nghiệp; IoT sinh dữ liệu thời gian thực; hạ tầng big data; tư duy nền tảng/API.',
  [[
    `<span class="eyebrow">BDT202c · Chapter 6 · Lesson 6.1</span>
<h2>Enabling technology platforms</h2>
<h3>Cloud computing — the foundation</h3>
<pre><code>IaaS (Infrastructure as a Service) : rent servers/storage/network
                                     e.g. AWS EC2, Azure VMs
PaaS (Platform as a Service)       : rent a ready runtime/database
                                     e.g. AWS RDS, Google App Engine
SaaS (Software as a Service)       : rent a finished application
                                     e.g. Salesforce, Google Workspace
</code></pre>
<p>Cloud replaces large upfront capital spend on hardware with <strong>pay-as-you-go</strong> operating expense, and lets a company scale computing up or down in minutes instead of months — the technical foundation that makes rapid digital experimentation affordable.</p>
<h3>AI / machine learning in business</h3>
<p>AI moves from a research topic to a business tool when it's applied to a concrete decision: recommending a product, flagging a fraudulent transaction, forecasting demand, routing a support ticket. The business value comes from the <em>decision it improves</em>, not from the algorithm's sophistication.</p>
<h3>IoT — the Internet of Things</h3>
<p>Sensors embedded in products, machines and vehicles stream real-time data (location, temperature, usage) back to the business — enabling predictive maintenance (fix a machine before it breaks) and usage-based business models (pay-per-use insurance, equipment-as-a-service).</p>
<h3>Big data infrastructure &amp; platform thinking</h3>
<p>Big data platforms (data lakes/warehouses) store the volume, variety and velocity of data IoT and digital channels generate. Modern architecture exposes internal capabilities through <strong>APIs</strong>, so other teams — and sometimes partners — can build on top of what already exists instead of rebuilding it.</p>
<div class="callout"><span class="badge">Key idea</span> These four technologies are Siebel's "four converging forces" from Chapter 1 in practice — cloud gives the compute, big data the fuel, AI the intelligence, IoT the real-time signal.</div>`,
    `<span class="eyebrow">BDT202c · Chương 6 · Bài 6.1</span>
<h2>Công nghệ nền tảng</h2>
<h3>Điện toán đám mây — nền móng</h3>
<pre><code>IaaS (hạ tầng dạng dịch vụ) : thuê máy chủ/lưu trữ/mạng
                              vd AWS EC2, Azure VMs
PaaS (nền tảng dạng dịch vụ): thuê sẵn runtime/cơ sở dữ liệu
                              vd AWS RDS, Google App Engine
SaaS (phần mềm dạng dịch vụ): thuê một ứng dụng hoàn chỉnh
                              vd Salesforce, Google Workspace
</code></pre>
<p>Cloud thay chi phí vốn đầu tư ban đầu lớn cho phần cứng bằng chi phí vận hành <strong>trả theo mức dùng</strong>, và cho phép công ty co giãn năng lực tính toán trong vài phút thay vì vài tháng — nền tảng kỹ thuật khiến thử nghiệm số nhanh trở nên khả thi về chi phí.</p>
<h3>AI / machine learning trong doanh nghiệp</h3>
<p>AI chuyển từ chủ đề nghiên cứu thành công cụ kinh doanh khi được áp vào một quyết định cụ thể: gợi ý sản phẩm, phát hiện giao dịch gian lận, dự báo nhu cầu, định tuyến ticket hỗ trợ. Giá trị kinh doanh đến từ <em>quyết định mà nó cải thiện</em>, không phải từ độ phức tạp của thuật toán.</p>
<h3>IoT — Internet vạn vật</h3>
<p>Cảm biến gắn trong sản phẩm, máy móc, phương tiện truyền dữ liệu thời gian thực (vị trí, nhiệt độ, mức sử dụng) về doanh nghiệp — cho phép bảo trì dự đoán (sửa máy trước khi hỏng) và mô hình kinh doanh theo mức dùng (bảo hiểm trả theo lượt, thiết bị-như-một-dịch-vụ).</p>
<h3>Hạ tầng big data &amp; tư duy nền tảng</h3>
<p>Nền tảng dữ liệu lớn (data lake/data warehouse) lưu trữ khối lượng, sự đa dạng và tốc độ dữ liệu mà IoT và các kênh số sinh ra. Kiến trúc hiện đại phơi bày năng lực nội bộ qua <strong>API</strong>, để các nhóm khác — và đôi khi cả đối tác — có thể xây dựng dựa trên những gì đã có thay vì xây lại từ đầu.</p>
<div class="callout"><span class="badge">Ý chính</span> Bốn công nghệ này chính là "bốn lực hội tụ" của Siebel ở Chương 1 khi áp dụng thực tế — cloud cấp năng lực tính toán, big data là nhiên liệu, AI là trí tuệ, IoT là tín hiệu thời gian thực.</div>`,
  ]]);

const c6q = quiz('bdt202c-quiz-6', 'Quiz 6 — Technology platforms|||Quiz 6 — Công nghệ nền tảng', [
  { id: 'q1', question: 'SaaS (Software as a Service) nghĩa là gì?', options: ['Thuê máy chủ trần', 'Thuê một ứng dụng hoàn chỉnh, không cần tự vận hành hạ tầng', 'Tự xây trung tâm dữ liệu riêng', 'Chỉ dùng cho công ty lớn'], correctIndex: 1, explanation: 'SaaS cung cấp ứng dụng hoàn chỉnh sẵn dùng (vd Salesforce), khác IaaS (thuê hạ tầng) và PaaS (thuê nền tảng runtime).' },
  { id: 'q2', question: 'Giá trị kinh doanh của AI đến từ đâu, theo bài học?', options: ['Độ phức tạp của thuật toán', 'Quyết định cụ thể mà nó cải thiện (gợi ý, phát hiện gian lận, dự báo...)', 'Số lượng dữ liệu huấn luyện', 'Chi phí đầu tư ban đầu'], correctIndex: 1, explanation: 'AI tạo giá trị khi áp vào một quyết định kinh doanh cụ thể, không phải vì thuật toán tinh vi.' },
  { id: 'q3', question: 'IoT cho phép mô hình bảo trì nào?', options: ['Bảo trì phản ứng (chỉ sửa khi hỏng)', 'Bảo trì dự đoán (sửa trước khi hỏng, dựa trên dữ liệu cảm biến thời gian thực)', 'Không cần bảo trì', 'Bảo trì theo lịch cố định không dùng dữ liệu'], correctIndex: 1, explanation: 'Dữ liệu cảm biến thời gian thực từ IoT cho phép dự đoán hỏng hóc trước khi xảy ra.' },
]);

// ---- Chapter 7 ----
const c7 = doc('bdt202c-7-1-change-culture-people', '7.1 — Change management, digital culture & people|||7.1 — Quản trị thay đổi, văn hoá số & con người',
  'Mô hình "Digital Master" của Westerman (Digital Intensity x Leadership Intensity); 8 bước Kotter; văn hoá số; kỹ năng số & cách làm việc agile.',
  [[
    `<span class="eyebrow">BDT202c · Chapter 7 · Lesson 7.1</span>
<h2>Change management, digital culture &amp; people</h2>
<h3>The Digital Master matrix (Westerman, Bonnet & McAfee)</h3>
<pre><code>                     Low Leadership       High Leadership
                     Intensity            Intensity
High Digital     |   Fashionistas     |   DIGITAL MASTERS   |
Intensity        |   (lots of tech,   |   (tech + strong    |
                 |   little control)  |   governance both   |
                 |                    |   deliver results)  |
-----------------+--------------------+----------------------
Low Digital      |   Beginners        |   Conservatives      |
Intensity        |   (neither yet)    |   (strong culture,   |
                 |                    |   cautious on tech)  |
</code></pre>
<p>The lesson: technology alone (Fashionistas) or governance alone (Conservatives) is not enough — <strong>Digital Masters</strong> combine both a clear digital vision and the leadership capability to execute it across the whole organization.</p>
<h3>Kotter's 8-step change model</h3>
<p>1. Create urgency 2. Build a guiding coalition 3. Form a strategic vision 4. Enlist volunteers 5. Enable action by removing barriers 6. Generate short-term wins 7. Sustain acceleration 8. Institute change in culture. Digital transformation fails most often at step 6 — no visible early win — or step 8 — the old culture reasserts itself once attention moves on.</p>
<h3>Digital culture &amp; ways of working</h3>
<p>A digital culture tolerates fast, cheap failure in pursuit of learning (fail small, fail fast, learn), pushes decisions to the team closest to the customer, and works in short <strong>agile</strong> iterations with continuous customer feedback rather than one big annual plan.</p>
<div class="callout"><span class="badge">People risk</span> The biggest transformation risk is rarely the technology — it's middle management whose role and authority the new digital process quietly removes, and who then quietly resist.</div>`,
    `<span class="eyebrow">BDT202c · Chương 7 · Bài 7.1</span>
<h2>Quản trị thay đổi, văn hoá số &amp; con người</h2>
<h3>Ma trận "Digital Master" (Westerman, Bonnet &amp; McAfee)</h3>
<pre><code>                    Năng lực lãnh đạo    Năng lực lãnh đạo
                    THẤP                 CAO
Cường độ số   |  Fashionistas       |   DIGITAL MASTERS      |
CAO           |  (nhiều công nghệ,  |   (công nghệ + quản    |
              |  ít kiểm soát)      |   trị mạnh, cùng tạo   |
              |                     |   kết quả)             |
--------------+---------------------+-------------------------
Cường độ số   |  Beginners          |   Conservatives         |
THẤP          |  (chưa có cả hai)   |   (văn hoá mạnh,        |
              |                     |   thận trọng với CN)    |
</code></pre>
<p>Bài học: chỉ có công nghệ (Fashionistas) hay chỉ có quản trị (Conservatives) đều chưa đủ — <strong>Digital Masters</strong> kết hợp cả tầm nhìn số rõ ràng lẫn năng lực lãnh đạo để thực thi nó khắp tổ chức.</p>
<h3>Mô hình thay đổi 8 bước của Kotter</h3>
<p>1. Tạo tính cấp bách 2. Xây liên minh dẫn dắt 3. Hình thành tầm nhìn chiến lược 4. Kêu gọi người tình nguyện 5. Tạo điều kiện hành động bằng cách dỡ rào cản 6. Tạo chiến thắng ngắn hạn 7. Duy trì đà tăng tốc 8. Ăn sâu thay đổi vào văn hoá. Chuyển đổi số thường thất bại ở bước 6 — không có chiến thắng sớm hiển hiện — hoặc bước 8 — văn hoá cũ quay trở lại khi sự chú ý chuyển hướng.</p>
<h3>Văn hoá số &amp; cách làm việc</h3>
<p>Văn hoá số chấp nhận thất bại nhanh, rẻ để học hỏi (thất bại nhỏ, thất bại nhanh, rút kinh nghiệm), đẩy quyền quyết định về nhóm gần khách hàng nhất, và làm việc theo chu kỳ <strong>agile</strong> ngắn với phản hồi khách hàng liên tục thay vì một kế hoạch năm lớn duy nhất.</p>
<div class="callout"><span class="badge">Rủi ro con người</span> Rủi ro lớn nhất của chuyển đổi hiếm khi là công nghệ — mà là quản lý cấp trung, người mà quy trình số mới âm thầm lấy đi vai trò và quyền hạn, rồi âm thầm chống đối.</div>`,
  ]]);

const c7q = quiz('bdt202c-quiz-7', 'Quiz 7 — Change & culture|||Quiz 7 — Thay đổi & văn hoá', [
  { id: 'q1', question: 'Theo ma trận Digital Master, nhóm nào có cả cường độ số cao lẫn năng lực lãnh đạo cao?', options: ['Beginners', 'Fashionistas', 'Conservatives', 'Digital Masters'], correctIndex: 3, explanation: 'Digital Masters kết hợp cả công nghệ mạnh lẫn quản trị/lãnh đạo mạnh để tạo kết quả thật.' },
  { id: 'q2', question: 'Chuyển đổi số thường thất bại ở bước nào trong mô hình 8 bước của Kotter?', options: ['Bước 1 — tạo tính cấp bách', 'Bước 6 (thiếu chiến thắng ngắn hạn) hoặc bước 8 (văn hoá cũ quay lại)', 'Bước 3 — hình thành tầm nhìn', 'Không bước nào, mô hình luôn thành công'], correctIndex: 1, explanation: 'Thiếu chiến thắng sớm (bước 6) hoặc để văn hoá cũ trở lại sau khi hết chú ý (bước 8) là hai điểm thất bại phổ biến.' },
  { id: 'q3', question: 'Vì sao quản lý cấp trung thường là rủi ro lớn trong chuyển đổi số?', options: ['Vì họ không biết dùng máy tính', 'Vì quy trình số mới có thể âm thầm lấy đi vai trò/quyền hạn của họ, khiến họ chống đối', 'Vì họ luôn ủng hộ thay đổi', 'Vì công ty không cần quản lý cấp trung'], correctIndex: 1, explanation: 'Rủi ro con người lớn nhất thường đến từ quản lý cấp trung bị mất vai trò/quyền hạn, dẫn tới chống đối ngầm.' },
]);

// ---- Chapter 8 ----
const c8 = doc('bdt202c-8-1-maturity-risk-roadmap', '8.1 — Measuring digital maturity, risk & the transformation roadmap|||8.1 — Đo lường mức độ trưởng thành số, rủi ro & lộ trình chuyển đổi',
  'Mô hình digital maturity (McKinsey/Gartner); KPI theo dõi chuyển đổi; rủi ro (an ninh mạng, mệt mỏi thay đổi, nợ kỹ thuật); lộ trình đánh giá-thí điểm-nhân rộng-duy trì.',
  [[
    `<span class="eyebrow">BDT202c · Chapter 8 · Lesson 8.1</span>
<h2>Measuring digital maturity, risk &amp; the roadmap</h2>
<h3>Digital maturity models</h3>
<p>Consulting firms (McKinsey, Gartner) score organizations across dimensions like strategy, customer experience, technology, data, operations and culture, placing a company on a maturity curve from <strong>ad hoc → developing → defined → managed → optimizing</strong>. The score matters less than the exercise of honestly identifying the weakest dimension — transformation stalls at its weakest link, not its strongest.</p>
<h3>KPIs that actually track transformation</h3>
<pre><code>Vanity metric (avoid alone) : "we launched an app"
Leading indicator           : % of transactions through
                               digital channels, cycle time
                               reduction, employee digital
                               adoption rate
Lagging/outcome metric       : revenue from digital channels,
                               customer retention, cost-to-serve
</code></pre>
<h3>Risk in digital transformation</h3>
<ul>
<li><strong>Cybersecurity</strong> — every new digital channel and integration is a new attack surface.</li>
<li><strong>Change fatigue</strong> — too many simultaneous initiatives exhaust the organization's capacity to adopt any of them well.</li>
<li><strong>Technical debt</strong> — quick fixes ("just get the pilot live") accumulate into a fragile system that slows every future change.</li>
</ul>
<h3>A practical roadmap</h3>
<p><strong>Assess</strong> (maturity + strategy) → <strong>Plan</strong> (prioritize by value and feasibility) → <strong>Pilot</strong> (small, measurable, fast) → <strong>Scale</strong> (roll out what the pilot proved) → <strong>Sustain</strong> (embed in culture, KPIs and governance so it doesn't regress once the project team disbands).</p>
<div class="callout"><span class="badge">Closing idea</span> Digital transformation is not a project with an end date — it's a continuous capability. The roadmap's last step, Sustain, is the one most organizations skip, and the one Chapter 7's Digital Masters never do.</div>`,
    `<span class="eyebrow">BDT202c · Chương 8 · Bài 8.1</span>
<h2>Đo lường mức độ trưởng thành số, rủi ro &amp; lộ trình</h2>
<h3>Mô hình mức độ trưởng thành số (digital maturity)</h3>
<p>Các công ty tư vấn (McKinsey, Gartner) chấm điểm tổ chức trên nhiều chiều như chiến lược, trải nghiệm khách hàng, công nghệ, dữ liệu, vận hành và văn hoá, đặt công ty lên đường cong trưởng thành từ <strong>tự phát → đang phát triển → đã định hình → đã quản lý → tối ưu</strong>. Điểm số không quan trọng bằng việc thẳng thắn xác định chiều yếu nhất — chuyển đổi bị chặn lại ở mắt xích yếu nhất, không phải mạnh nhất.</p>
<h3>KPI thực sự theo dõi được chuyển đổi</h3>
<pre><code>Chỉ số "phù phiếm" (đừng dùng một mình) : "đã ra mắt một app"
Chỉ số dẫn dắt (leading)   : % giao dịch qua kênh số,
                              giảm thời gian chu kỳ, tỉ lệ
                              nhân viên áp dụng công cụ số
Chỉ số kết quả (lagging)    : doanh thu từ kênh số,
                              tỉ lệ giữ chân khách hàng,
                              chi phí phục vụ mỗi khách
</code></pre>
<h3>Rủi ro trong chuyển đổi số</h3>
<ul>
<li><strong>An ninh mạng</strong> — mỗi kênh số và tích hợp mới là một bề mặt tấn công mới.</li>
<li><strong>Mệt mỏi vì thay đổi</strong> — quá nhiều sáng kiến chạy song song làm cạn kiệt khả năng tiếp nhận của tổ chức.</li>
<li><strong>Nợ kỹ thuật</strong> — các bản vá nhanh ("cứ chạy thí điểm đã") tích luỹ thành một hệ thống mong manh làm chậm mọi thay đổi sau này.</li>
</ul>
<h3>Lộ trình thực tế</h3>
<p><strong>Đánh giá</strong> (mức độ trưởng thành + chiến lược) → <strong>Lập kế hoạch</strong> (ưu tiên theo giá trị và tính khả thi) → <strong>Thí điểm</strong> (nhỏ, đo được, nhanh) → <strong>Nhân rộng</strong> (triển khai những gì thí điểm đã chứng minh) → <strong>Duy trì</strong> (ăn sâu vào văn hoá, KPI và quản trị để không thụt lùi khi đội dự án giải tán).</p>
<div class="callout"><span class="badge">Ý kết</span> Chuyển đổi số không phải một dự án có ngày kết thúc — đó là một năng lực liên tục. Bước cuối của lộ trình, Duy trì, là bước hầu hết tổ chức bỏ qua, và cũng là bước mà Digital Masters ở Chương 7 không bao giờ bỏ.</div>`,
  ]]);

const c8q = quiz('bdt202c-quiz-8', 'Quiz 8 — Maturity, risk & roadmap|||Quiz 8 — Trưởng thành, rủi ro & lộ trình', [
  { id: 'q1', question: 'Trong mô hình digital maturity, điều gì quan trọng hơn điểm số tổng?', options: ['Điểm càng cao càng tốt, không cần xét gì thêm', 'Xác định thẳng thắn chiều yếu nhất, vì chuyển đổi bị chặn ở mắt xích yếu nhất', 'Chỉ cần so sánh với đối thủ', 'Điểm số không có ý nghĩa gì'], correctIndex: 1, explanation: 'Chuyển đổi bị giới hạn bởi chiều yếu nhất, nên nhận diện đúng điểm yếu quan trọng hơn điểm tổng.' },
  { id: 'q2', question: '"Chỉ số phù phiếm" (vanity metric) như "đã ra mắt một app" có vấn đề gì nếu dùng một mình?', options: ['Không đo được kết quả kinh doanh thực (doanh thu, giữ chân khách hàng...)', 'Luôn luôn sai', 'Không thể đo được', 'Chỉ áp dụng cho công ty nhỏ'], correctIndex: 0, explanation: 'Ra mắt sản phẩm là một cột mốc, không phải kết quả — cần đi kèm chỉ số dẫn dắt và chỉ số kết quả thật.' },
  { id: 'q3', question: 'Bước nào trong lộ trình chuyển đổi số thường bị các tổ chức bỏ qua nhất?', options: ['Đánh giá', 'Thí điểm', 'Duy trì (Sustain) — ăn sâu vào văn hoá và quản trị', 'Lập kế hoạch'], correctIndex: 2, explanation: 'Duy trì là bước dễ bị bỏ qua nhất, khiến kết quả thụt lùi khi đội dự án giải tán.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'BDT202c',
    slug: 'bdt202c-business-digital-transformation',
    title: 'Business Digital Transformation',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/BDT202c.webp',
    shortDescription: 'How digital transformation reshapes business: digital strategy & models, digital CX & marketing, automation (RPA/ERP), data-driven decisions, cloud/AI/IoT, change management & a maturity roadmap.|||Chuyển đổi số định hình lại doanh nghiệp: chiến lược & mô hình số, trải nghiệm KH & marketing số, tự động hoá (RPA/ERP), quyết định từ dữ liệu, cloud/AI/IoT, quản trị thay đổi & lộ trình trưởng thành.',
    description: 'Môn <strong>BDT202c — Business Digital Transformation</strong> (kỳ 3, khối Quản trị Kinh doanh) giúp hiểu <strong>vì sao và làm thế nào doanh nghiệp chuyển đổi số</strong>. Từ <strong>chuyển đổi số là gì &amp; vì sao cần</strong> (Westerman, Siebel) → <strong>chiến lược số &amp; mô hình kinh doanh số</strong> (5 miền của Rogers) → <strong>trải nghiệm khách hàng &amp; marketing số</strong> → <strong>tự động hoá quy trình</strong> (RPA, ERP) → <strong>dữ liệu &amp; ra quyết định</strong> → <strong>công nghệ nền tảng</strong> (cloud, AI, IoT, big data) → <strong>quản trị thay đổi &amp; văn hoá số</strong> (mô hình Digital Master) → <strong>đo lường mức độ trưởng thành, rủi ro &amp; lộ trình</strong>. Bám giáo trình FLM và các sách nền tảng của ngành, song ngữ, có mô hình, ví dụ thực tế và quiz mỗi chương.',
    whatYouLearn: 'Định nghĩa chuyển đổi số & 4 lực hội tụ (cloud/big data/AI/IoT - Siebel); khung 5 miền chiến lược số (Rogers) & mô hình kinh doanh số (platform, subscription, freemium); trải nghiệm khách hàng omnichannel & phễu marketing số; process mining, RPA, ERP; data governance & 3 cấp độ phân tích; cloud (IaaS/PaaS/SaaS), AI, IoT, big data; ma trận Digital Master (Westerman) & mô hình thay đổi 8 bước Kotter; digital maturity, KPI, rủi ro & lộ trình chuyển đổi.',
    requirements: 'Không cần nền tảng công nghệ; nên có kiến thức nhập môn quản trị kinh doanh. Đọc thêm Leading Digital (Westerman), The Digital Transformation Playbook (Rogers), Digital Transformation (Siebel) để đào sâu.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách nền tảng (Westerman/Rogers/Siebel), tài liệu chính thức, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Chuyển đổi số là gì, ba cấp độ, bốn lực hội tụ.', lessons: [intro] },
    { title: 'Chương 1 — Chuyển đổi số là gì & vì sao cần|||Chapter 1 — What & why', description: 'Định nghĩa, áp lực thay đổi, ca Kodak/Blockbuster.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Chiến lược số & mô hình kinh doanh số|||Chapter 2 — Strategy & business models', description: 'Khung 5 miền Rogers, mô hình platform/subscription/freemium.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Trải nghiệm khách hàng số & marketing số|||Chapter 3 — Digital CX & marketing', description: 'Omnichannel, phễu marketing số, CDP.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Tối ưu quy trình vận hành|||Chapter 4 — Operations & automation', description: 'Process mining, RPA, ERP, lean digital.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Dữ liệu & ra quyết định dựa trên dữ liệu|||Chapter 5 — Data & data-driven decisions', description: 'Data governance, 3 cấp độ phân tích, A/B test.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Công nghệ nền tảng|||Chapter 6 — Technology platforms', description: 'Cloud, AI, IoT, big data, tư duy nền tảng/API.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Quản trị thay đổi, văn hoá số & con người|||Chapter 7 — Change management & culture', description: 'Digital Master matrix, Kotter 8 bước, văn hoá agile.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Đo lường trưởng thành, rủi ro & lộ trình|||Chapter 8 — Maturity, risk & roadmap', description: 'Digital maturity, KPI, rủi ro, lộ trình đánh giá-thí điểm-nhân rộng-duy trì.', lessons: [c8, c8q] },
  ],
};
