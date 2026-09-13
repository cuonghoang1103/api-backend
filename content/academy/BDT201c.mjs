/**
 * BDT201c — Business Digital Transformation. Chuyển đổi số doanh nghiệp,
 * khối Công nghệ Truyền thông FPTU. Khung chất lượng, song ngữ VI+EN.
 * Sách chuẩn: Rogers "The Digital Transformation Playbook"; Westerman/Bonnet/
 * McAfee "Leading Digital"; Siebel "Digital Transformation"; McKinsey/MIT Sloan.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('bdt201c-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn quốc tế (Rogers, Westerman, Siebel), báo cáo McKinsey/Deloitte/MIT Sloan, YouTube, công cụ, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">BDT201c · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Business Digital Transformation</strong> — what DX is, digital strategy, the digital customer, data, innovation, enabling tech, culture and the roadmap — in one place. The official slides &amp; syllabus live on <strong>FLM</strong>; below are the canonical books and free reports.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for BDT201c are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books (the standard four)</h3>
<ul>
<li><em>The Digital Transformation Playbook</em> — David L. Rogers (Columbia Business School Publishing). The 5 domains: customers, competition, data, innovation, value.</li>
<li><em>Leading Digital</em> — George Westerman, Didier Bonnet &amp; Andrew McAfee (Harvard Business Review Press). "Digital Masters" = digital capability × leadership capability.</li>
<li><em>Digital Transformation</em> — Thomas M. Siebel. Cloud, big data, AI &amp; IoT as the four forces of mass extinction &amp; survival.</li>
<li><em>Competing in the Age of AI</em> — Iansiti &amp; Lakhani; and McKinsey's DX research library.</li>
</ul>
<h3>🌐 Free reports &amp; research</h3>
<ul>
<li><a href="https://www.mckinsey.com/capabilities/mckinsey-digital" target="_blank" rel="noopener">McKinsey Digital</a> — DX insights &amp; the "Why do most transformations fail?" studies.</li>
<li><a href="https://sloanreview.mit.edu/big-ideas/digital-leadership/" target="_blank" rel="noopener">MIT Sloan Management Review — Digital Leadership</a>.</li>
<li><a href="https://www2.deloitte.com/us/en/insights/topics/digital-transformation.html" target="_blank" rel="noopener">Deloitte Insights — Digital Transformation</a>.</li>
</ul>
<h3>▶️ YouTube / talks</h3>
<ul>
<li><a href="https://www.youtube.com/results?search_query=david+rogers+digital+transformation" target="_blank" rel="noopener">David Rogers — Digital Transformation talks</a>.</li>
<li><a href="https://www.youtube.com/@McKinsey" target="_blank" rel="noopener">McKinsey &amp; Company</a> — digital &amp; AI strategy.</li>
</ul>
<h3>🛠️ Frameworks &amp; tools</h3>
<ul>
<li>Business Model Canvas (Osterwalder) — map &amp; redesign a business model.</li>
<li>Value Proposition Canvas — fit product to customer jobs/pains/gains.</li>
<li>Digital Maturity Model (Deloitte/Westerman) — assess where a firm stands.</li>
</ul>
<div class="callout"><span class="badge">Self-study path (4 steps)</span>
<ol>
<li><strong>Understand</strong> — DX vs digitization vs digitalization; why firms transform.</li>
<li><strong>Strategy &amp; customer</strong> — digital strategy, business-model innovation, the digital customer &amp; experience.</li>
<li><strong>Enablers</strong> — data as an asset, rapid experimentation, cloud/AI/IoT, digital culture.</li>
<li><strong>Execute &amp; measure</strong> — build a roadmap, a maturity model and KPIs; manage risk.</li>
</ol></div>`,
    `<span class="eyebrow">BDT201c · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Chuyển đổi số doanh nghiệp</strong> — DX là gì, chiến lược số, khách hàng số, dữ liệu, đổi mới, công nghệ nền, văn hoá và lộ trình — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là các sách kinh điển và báo cáo miễn phí.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của BDT201c có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo (bốn cuốn chuẩn)</h3>
<ul>
<li><em>The Digital Transformation Playbook</em> — David L. Rogers. Năm miền: khách hàng, cạnh tranh, dữ liệu, đổi mới, giá trị.</li>
<li><em>Leading Digital</em> — Westerman, Bonnet &amp; McAfee. "Digital Masters" = năng lực số × năng lực lãnh đạo.</li>
<li><em>Digital Transformation</em> — Thomas M. Siebel. Cloud, big data, AI &amp; IoT — bốn lực của tuyệt chủng &amp; sống sót.</li>
<li><em>Competing in the Age of AI</em> — Iansiti &amp; Lakhani; và kho nghiên cứu DX của McKinsey.</li>
</ul>
<h3>🌐 Báo cáo &amp; nghiên cứu miễn phí</h3>
<ul>
<li><a href="https://www.mckinsey.com/capabilities/mckinsey-digital" target="_blank" rel="noopener">McKinsey Digital</a> — góc nhìn DX &amp; nghiên cứu "vì sao đa số chuyển đổi thất bại".</li>
<li><a href="https://sloanreview.mit.edu/big-ideas/digital-leadership/" target="_blank" rel="noopener">MIT Sloan Management Review — Digital Leadership</a>.</li>
<li><a href="https://www2.deloitte.com/us/en/insights/topics/digital-transformation.html" target="_blank" rel="noopener">Deloitte Insights — Digital Transformation</a>.</li>
</ul>
<h3>▶️ YouTube / bài nói</h3>
<ul>
<li><a href="https://www.youtube.com/results?search_query=david+rogers+digital+transformation" target="_blank" rel="noopener">David Rogers — các bài nói về chuyển đổi số</a>.</li>
<li><a href="https://www.youtube.com/@McKinsey" target="_blank" rel="noopener">McKinsey &amp; Company</a> — chiến lược số &amp; AI.</li>
</ul>
<h3>🛠️ Khung &amp; công cụ</h3>
<ul>
<li>Business Model Canvas (Osterwalder) — vẽ &amp; thiết kế lại mô hình kinh doanh.</li>
<li>Value Proposition Canvas — khớp sản phẩm với việc/nỗi đau/mong muốn của khách.</li>
<li>Digital Maturity Model (Deloitte/Westerman) — đánh giá doanh nghiệp đang ở đâu.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học (4 bước)</span>
<ol>
<li><strong>Hiểu</strong> — DX vs số hoá (digitization) vs số hoá quy trình (digitalization); vì sao doanh nghiệp chuyển đổi.</li>
<li><strong>Chiến lược &amp; khách hàng</strong> — chiến lược số, đổi mới mô hình kinh doanh, khách hàng số &amp; trải nghiệm.</li>
<li><strong>Yếu tố nền</strong> — dữ liệu như tài sản, thử nghiệm nhanh, cloud/AI/IoT, văn hoá số.</li>
<li><strong>Thực thi &amp; đo lường</strong> — dựng lộ trình, mô hình trưởng thành và KPI; quản trị rủi ro.</li>
</ol></div>`,
  ]]);

const intro = doc('bdt201c-0-1-overview', 'Course overview: Business Digital Transformation|||Tổng quan: Chuyển đổi số doanh nghiệp',
  'DX là gì và vì sao quan trọng; phân biệt digitization/digitalization/transformation; lộ trình 8 chương: khái niệm → chiến lược → khách hàng → dữ liệu → đổi mới → công nghệ nền → con người → lộ trình & đo lường.',
  [[
    `<span class="eyebrow">BDT201c · Lesson 0.1 · Overview</span>
<h2>Business Digital Transformation</h2>
<p class="lead">This course explains <strong>how digital technology reshapes businesses</strong> — not just buying new software, but rethinking strategy, business models, customers, data and culture. It is a <em>business</em> course about technology, not a coding course.</p>
<h3>Three words people confuse</h3>
<ul>
<li><strong>Digitization</strong> — turning analog information into digital form (a paper form → a PDF).</li>
<li><strong>Digitalization</strong> — using digital tech to improve a process (paper approval → an online workflow).</li>
<li><strong>Digital transformation</strong> — rethinking the <em>whole business</em>: strategy, model, customer, how value is created.</li>
</ul>
<h3>Why it matters</h3>
<p>Digital-native firms (Amazon, Netflix, Grab) disrupted incumbents in retail, media and transport within a decade. McKinsey finds most transformations fail — usually on <strong>people and culture</strong>, not technology. That is why this course spends as much time on customers, data and culture as on cloud and AI.</p>
<h3>Roadmap (8 chapters)</h3>
<p>What DX is → digital strategy &amp; business models → the digital customer → data as an asset → innovation &amp; rapid experimentation → enabling tech (cloud/AI/IoT) → people &amp; culture → roadmap, maturity &amp; measurement. Bilingual, with real company cases and a quiz per chapter.</p>`,
    `<span class="eyebrow">BDT201c · Bài 0.1 · Tổng quan</span>
<h2>Chuyển đổi số doanh nghiệp</h2>
<p class="lead">Môn này giải thích <strong>công nghệ số định hình lại doanh nghiệp thế nào</strong> — không chỉ mua phần mềm mới, mà tư duy lại chiến lược, mô hình kinh doanh, khách hàng, dữ liệu và văn hoá. Đây là môn <em>kinh doanh</em> về công nghệ, không phải môn lập trình.</p>
<h3>Ba từ hay bị nhầm</h3>
<ul>
<li><strong>Số hoá dữ liệu (digitization)</strong> — biến thông tin analog thành số (tờ giấy → file PDF).</li>
<li><strong>Số hoá quy trình (digitalization)</strong> — dùng công nghệ số cải thiện một quy trình (duyệt giấy → luồng duyệt online).</li>
<li><strong>Chuyển đổi số (transformation)</strong> — tư duy lại <em>cả doanh nghiệp</em>: chiến lược, mô hình, khách hàng, cách tạo giá trị.</li>
</ul>
<h3>Vì sao quan trọng</h3>
<p>Các hãng sinh ra từ số (Amazon, Netflix, Grab) đảo lộn doanh nghiệp truyền thống trong bán lẻ, truyền thông, vận tải chỉ trong một thập kỷ. McKinsey chỉ ra đa số cuộc chuyển đổi thất bại — thường vì <strong>con người và văn hoá</strong>, không phải công nghệ. Vì vậy môn này dành cho khách hàng, dữ liệu và văn hoá nhiều thời gian ngang với cloud và AI.</p>
<h3>Lộ trình (8 chương)</h3>
<p>DX là gì → chiến lược số &amp; mô hình kinh doanh → khách hàng số → dữ liệu như tài sản → đổi mới &amp; thử nghiệm nhanh → công nghệ nền (cloud/AI/IoT) → con người &amp; văn hoá → lộ trình, trưởng thành &amp; đo lường. Song ngữ, có ví dụ doanh nghiệp thật và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('bdt201c-1-1-what-is-dx', '1.1 — What digital transformation is|||1.1 — Chuyển đổi số là gì',
  'Định nghĩa DX; phân biệt digitization / digitalization / transformation; động lực (khách hàng, cạnh tranh, công nghệ, đại dịch); vì sao doanh nghiệp phải chuyển đổi. Ví dụ: Kodak vs Fujifilm.',
  [[
    `<span class="eyebrow">BDT201c · Chapter 1 · Lesson 1.1</span>
<h2>What digital transformation is</h2>
<h3>A precise definition</h3>
<p><strong>Digital transformation (DX)</strong> is the use of digital technology and new ways of working to fundamentally change how an organization creates, delivers and captures value — its strategy, business model, operations, customer relationships and culture. It is <em>organizational</em> change enabled by technology, not a technology project.</p>
<h3>The three levels (do not mix them up)</h3>
<pre><code>Digitization    -> analog to digital        (scan a contract to PDF)
Digitalization  -> digitize a process       (e-signature workflow)
Transformation  -> reinvent the business    (SaaS model, platform, new value)
</code></pre>
<h3>What drives DX</h3>
<ul>
<li><strong>Customers</strong> — always-connected, higher expectations, one tap from a competitor.</li>
<li><strong>Competition</strong> — digital-native entrants with no legacy cost.</li>
<li><strong>Technology</strong> — cloud, mobile, AI and data got cheap and ubiquitous.</li>
<li><strong>Shocks</strong> — COVID-19 forced remote work, e-commerce and digital channels overnight.</li>
</ul>
<div class="callout"><span class="badge">Case — Kodak vs Fujifilm</span> Kodak <em>invented</em> the digital camera but protected its film business and went bankrupt in 2012. Fujifilm, facing the same collapse of film, transformed into cosmetics, healthcare and materials — and survived. Same shock; the difference was willingness to reinvent the business, not the technology.</div>`,
    `<span class="eyebrow">BDT201c · Chương 1 · Bài 1.1</span>
<h2>Chuyển đổi số là gì</h2>
<h3>Một định nghĩa rõ ràng</h3>
<p><strong>Chuyển đổi số (DX)</strong> là việc dùng công nghệ số và cách làm việc mới để thay đổi tận gốc cách một tổ chức tạo ra, trao và thu về giá trị — chiến lược, mô hình kinh doanh, vận hành, quan hệ khách hàng và văn hoá. Đó là thay đổi <em>tổ chức</em> nhờ công nghệ, không phải một dự án công nghệ.</p>
<h3>Ba mức độ (đừng lẫn lộn)</h3>
<pre><code>Số hoá dữ liệu   -> analog thành số        (scan hợp đồng ra PDF)
Số hoá quy trình -> số hoá một quy trình   (luồng ký điện tử)
Chuyển đổi số    -> tái tạo doanh nghiệp   (mô hình SaaS, nền tảng, giá trị mới)
</code></pre>
<h3>Điều gì thúc đẩy DX</h3>
<ul>
<li><strong>Khách hàng</strong> — luôn kết nối, kỳ vọng cao, cách đối thủ chỉ một cú chạm.</li>
<li><strong>Cạnh tranh</strong> — đối thủ sinh ra từ số, không gánh chi phí di sản.</li>
<li><strong>Công nghệ</strong> — cloud, di động, AI và dữ liệu rẻ và phổ biến.</li>
<li><strong>Cú sốc</strong> — COVID-19 buộc làm việc từ xa, thương mại điện tử, kênh số chỉ sau một đêm.</li>
</ul>
<div class="callout"><span class="badge">Ví dụ — Kodak vs Fujifilm</span> Kodak <em>phát minh</em> máy ảnh số nhưng bảo vệ mảng phim và phá sản năm 2012. Fujifilm, đối mặt cùng sự sụp đổ của phim, chuyển sang mỹ phẩm, y tế và vật liệu — và sống sót. Cùng cú sốc; khác biệt là sẵn sàng tái tạo doanh nghiệp, không phải công nghệ.</div>`,
  ]]);

const c1q = quiz('bdt201c-quiz-1', 'Quiz 1 — What DX is|||Quiz 1 — DX là gì', [
  { id: 'q1', question: 'Scan một hợp đồng giấy thành file PDF là ví dụ của?', options: ['Chuyển đổi số (transformation)', 'Số hoá dữ liệu (digitization)', 'Đổi mới mô hình', 'Số hoá quy trình'], correctIndex: 1, explanation: 'Digitization = biến thông tin analog thành dạng số; chưa đổi quy trình hay mô hình.' },
  { id: 'q2', question: 'Chuyển đổi số (DX) về bản chất là?', options: ['Một dự án cài phần mềm mới', 'Thay đổi tận gốc cách doanh nghiệp tạo & trao giá trị', 'Mua thêm máy chủ', 'Lập website'], correctIndex: 1, explanation: 'DX là thay đổi tổ chức (chiến lược, mô hình, khách hàng, văn hoá) nhờ công nghệ.' },
  { id: 'q3', question: 'Bài học Kodak vs Fujifilm cho thấy yếu tố quyết định là?', options: ['Ai có công nghệ trước', 'Sẵn sàng tái tạo mô hình kinh doanh', 'Ngân sách IT lớn hơn', 'Số bằng sáng chế'], correctIndex: 1, explanation: 'Kodak có công nghệ số trước nhưng không dám đổi mô hình; Fujifilm chuyển đổi và sống sót.' },
]);

const c2 = doc('bdt201c-2-1-strategy-model', '2.1 — Digital strategy & business models|||2.1 — Chiến lược số & mô hình kinh doanh',
  'Chiến lược số (không phải chiến lược IT); đổi mới mô hình kinh doanh; nền tảng (platform) & hiệu ứng mạng; đột phá (disruption); Business Model Canvas. Ví dụ: Netflix, Amazon.',
  [[
    `<span class="eyebrow">BDT201c · Chapter 2 · Lesson 2.1</span>
<h2>Digital strategy &amp; business models</h2>
<h3>Digital strategy is not IT strategy</h3>
<p>A <strong>digital strategy</strong> answers "how does digital change what we sell, to whom, and how we make money?" — a <em>business</em> question. Buying tools is IT; changing the <strong>business model</strong> is strategy. The unit of change is the <strong>business model</strong>: value proposition, customer segments, channels, revenue streams and cost structure (the Business Model Canvas).</p>
<h3>Three model shifts DX enables</h3>
<ul>
<li><strong>Product → service (subscription)</strong> — sell access, not a one-off unit (Adobe Creative Cloud, Microsoft 365).</li>
<li><strong>Pipeline → platform</strong> — connect producers and consumers and take a cut; value grows with <em>network effects</em> (more users → more value → more users).</li>
<li><strong>Owning assets → orchestrating them</strong> — Uber owns no cars, Airbnb owns no rooms.</li>
</ul>
<h3>Disruption</h3>
<p>A <strong>disruptor</strong> serves customers a cheaper/simpler way that incumbents ignore, then moves upmarket. Incumbents are slowed by their own profitable legacy — the "innovator's dilemma".</p>
<div class="callout"><span class="badge">Case — Netflix</span> Netflix changed its model twice: DVD-by-mail disrupted Blockbuster's late fees; then streaming disrupted its <em>own</em> DVD business; then original content (<em>House of Cards</em>, chosen with viewing data) made it a studio. Each step was a business-model change, not just new tech.</div>`,
    `<span class="eyebrow">BDT201c · Chương 2 · Bài 2.1</span>
<h2>Chiến lược số &amp; mô hình kinh doanh</h2>
<h3>Chiến lược số không phải chiến lược IT</h3>
<p><strong>Chiến lược số</strong> trả lời "số hoá thay đổi ta bán gì, cho ai, kiếm tiền thế nào?" — một câu hỏi <em>kinh doanh</em>. Mua công cụ là IT; đổi <strong>mô hình kinh doanh</strong> mới là chiến lược. Đơn vị thay đổi là <strong>mô hình kinh doanh</strong>: giá trị đề xuất, phân khúc khách, kênh, dòng doanh thu và cấu trúc chi phí (Business Model Canvas).</p>
<h3>Ba dịch chuyển mô hình mà DX mở ra</h3>
<ul>
<li><strong>Sản phẩm → dịch vụ (thuê bao)</strong> — bán quyền dùng, không bán một lần (Adobe Creative Cloud, Microsoft 365).</li>
<li><strong>Chuỗi → nền tảng</strong> — nối người bán và người mua rồi thu phần; giá trị lớn theo <em>hiệu ứng mạng</em> (nhiều người dùng → nhiều giá trị → nhiều người dùng).</li>
<li><strong>Sở hữu tài sản → điều phối tài sản</strong> — Uber không có xe, Airbnb không có phòng.</li>
</ul>
<h3>Đột phá (disruption)</h3>
<p>Một <strong>kẻ đột phá</strong> phục vụ khách theo cách rẻ/đơn giản hơn mà doanh nghiệp lớn bỏ qua, rồi tiến lên phân khúc cao. Doanh nghiệp lớn bị chính di sản sinh lời của mình níu lại — "thế lưỡng nan của nhà đổi mới".</p>
<div class="callout"><span class="badge">Ví dụ — Netflix</span> Netflix đổi mô hình hai lần: gửi DVD qua thư đánh bại phí trễ của Blockbuster; rồi streaming phá chính mảng DVD của mình; rồi nội dung gốc (<em>House of Cards</em>, chọn bằng dữ liệu xem) biến nó thành hãng phim. Mỗi bước là đổi mô hình kinh doanh, không chỉ công nghệ mới.</div>`,
  ]]);

const c2q = quiz('bdt201c-quiz-2', 'Quiz 2 — Strategy & models|||Quiz 2 — Chiến lược & mô hình', [
  { id: 'q1', question: 'Điểm khác của mô hình "nền tảng" (platform) so với "chuỗi" (pipeline) là?', options: ['Tự sản xuất mọi thứ', 'Nối người bán & người mua, mạnh lên nhờ hiệu ứng mạng', 'Không dùng công nghệ', 'Chỉ bán một lần'], correctIndex: 1, explanation: 'Platform kết nối hai phía và lớn theo network effects; Uber/Airbnb là ví dụ.' },
  { id: 'q2', question: 'Chuyển từ bán sản phẩm một lần sang thu phí thuê bao là dịch chuyển gì?', options: ['Product → service (subscription)', 'Platform → pipeline', 'Digitization', 'Outsourcing'], correctIndex: 0, explanation: 'Adobe Creative Cloud, Microsoft 365 chuyển sang bán quyền dùng theo thuê bao.' },
  { id: 'q3', question: 'Chiến lược số khác chiến lược IT ở chỗ nó tập trung vào?', options: ['Chọn máy chủ', 'Thay đổi mô hình kinh doanh & cách tạo giá trị', 'Cài đặt phần mềm', 'Bảo trì mạng'], correctIndex: 1, explanation: 'Chiến lược số là câu hỏi kinh doanh về mô hình; mua công cụ chỉ là IT.' },
]);

const c3 = doc('bdt201c-3-1-digital-customer', '3.1 — The customer in the digital age|||3.1 — Khách hàng trong kỷ nguyên số',
  'Mạng lưới khách hàng (customer network) thay chuỗi phễu; trải nghiệm số & hành trình đa kênh; kỳ vọng mới (tức thì, cá nhân hoá, minh bạch); 5 hành vi của Rogers. Ví dụ: Nike, Starbucks.',
  [[
    `<span class="eyebrow">BDT201c · Chapter 3 · Lesson 3.1</span>
<h2>The customer in the digital age</h2>
<h3>From funnel to network</h3>
<p>The old model was a <strong>funnel</strong>: a firm broadcast a message and pushed customers toward a sale. Rogers argues customers are now a <strong>dynamic network</strong> — connected to each other, reviewing, sharing and co-creating. Marketing shifts from "push to a mass" to "earn a place in the network".</p>
<h3>Five customer behaviors to design for (Rogers)</h3>
<ul>
<li><strong>Access</strong> — faster, easier, everywhere (mobile-first).</li>
<li><strong>Engage</strong> — offer valuable content, not just ads.</li>
<li><strong>Customize</strong> — let customers tailor the experience.</li>
<li><strong>Connect</strong> — join the conversation and community.</li>
<li><strong>Collaborate</strong> — invite customers to co-create.</li>
</ul>
<h3>New expectations</h3>
<p>Digital customers expect <strong>instant</strong> service, <strong>personalization</strong> (relevant, by name, by history), <strong>omnichannel</strong> consistency (app, web, store, call — one identity) and <strong>transparency</strong>. A broken hand-off between channels now reads as a broken brand.</p>
<div class="callout"><span class="badge">Case — Nike</span> Nike moved from wholesale to a <em>direct-to-consumer</em> digital relationship: the Nike / SNKRS / Run Club apps give members personalization, exclusive drops and training — and Nike owns the customer data instead of the retailer. Membership, not just shoes, is the product.</div>`,
    `<span class="eyebrow">BDT201c · Chương 3 · Bài 3.1</span>
<h2>Khách hàng trong kỷ nguyên số</h2>
<h3>Từ phễu sang mạng lưới</h3>
<p>Mô hình cũ là một <strong>cái phễu</strong>: doanh nghiệp phát đi thông điệp và đẩy khách tới lúc mua. Rogers cho rằng khách hàng nay là một <strong>mạng lưới động</strong> — kết nối với nhau, đánh giá, chia sẻ và đồng sáng tạo. Marketing chuyển từ "đẩy tới đám đông" sang "giành một chỗ trong mạng lưới".</p>
<h3>Năm hành vi khách hàng cần thiết kế theo (Rogers)</h3>
<ul>
<li><strong>Tiếp cận (Access)</strong> — nhanh hơn, dễ hơn, ở mọi nơi (ưu tiên di động).</li>
<li><strong>Thu hút (Engage)</strong> — cho nội dung giá trị, không chỉ quảng cáo.</li>
<li><strong>Cá nhân hoá (Customize)</strong> — để khách tự chỉnh trải nghiệm.</li>
<li><strong>Kết nối (Connect)</strong> — tham gia cuộc trò chuyện và cộng đồng.</li>
<li><strong>Hợp tác (Collaborate)</strong> — mời khách cùng sáng tạo.</li>
</ul>
<h3>Kỳ vọng mới</h3>
<p>Khách hàng số kỳ vọng dịch vụ <strong>tức thì</strong>, <strong>cá nhân hoá</strong> (liên quan, gọi tên, theo lịch sử), nhất quán <strong>đa kênh (omnichannel)</strong> (app, web, cửa hàng, tổng đài — một danh tính) và <strong>minh bạch</strong>. Một chỗ đứt gãy giữa các kênh nay bị hiểu là thương hiệu đứt gãy.</p>
<div class="callout"><span class="badge">Ví dụ — Nike</span> Nike chuyển từ bán sỉ sang quan hệ <em>trực tiếp với người dùng</em> qua số: các app Nike / SNKRS / Run Club cho thành viên cá nhân hoá, hàng độc quyền và huấn luyện — và Nike nắm dữ liệu khách thay vì nhà bán lẻ. Sản phẩm là tư cách thành viên, không chỉ đôi giày.</div>`,
  ]]);

const c3q = quiz('bdt201c-quiz-3', 'Quiz 3 — Digital customer|||Quiz 3 — Khách hàng số', [
  { id: 'q1', question: 'Theo Rogers, khách hàng ngày nay được hiểu tốt nhất là?', options: ['Một cái phễu tuyến tính', 'Một mạng lưới động kết nối với nhau', 'Một danh sách gửi email', 'Một con số doanh thu'], correctIndex: 1, explanation: 'Customer network thay mô hình funnel: khách kết nối, chia sẻ, đồng sáng tạo.' },
  { id: 'q2', question: '"Omnichannel" nghĩa là?', options: ['Chỉ bán online', 'Trải nghiệm nhất quán qua mọi kênh với một danh tính', 'Nhiều quảng cáo hơn', 'Một kênh duy nhất'], correctIndex: 1, explanation: 'App, web, cửa hàng, tổng đài liền mạch quanh cùng một khách hàng.' },
  { id: 'q3', question: 'Nike chuyển sang mô hình direct-to-consumer chủ yếu để?', options: ['Giảm giá giày', 'Sở hữu quan hệ & dữ liệu khách hàng', 'Bỏ sản xuất', 'Rời khỏi thể thao'], correctIndex: 1, explanation: 'App thành viên cho cá nhân hoá và giúp Nike nắm dữ liệu thay vì nhà bán lẻ.' },
]);

const c4 = doc('bdt201c-4-1-data-asset', '4.1 — Data as a strategic asset|||4.1 — Dữ liệu như tài sản chiến lược',
  'Dữ liệu là tài sản; ra quyết định dựa trên dữ liệu (data-driven); các mức phân tích (mô tả/chẩn đoán/dự báo/đề xuất); dữ liệu như lợi thế cạnh tranh; quản trị & đạo đức dữ liệu. Ví dụ: Amazon.',
  [[
    `<span class="eyebrow">BDT201c · Chapter 4 · Lesson 4.1</span>
<h2>Data as a strategic asset</h2>
<h3>Data is an asset, not exhaust</h3>
<p>In Rogers' framework, data is a source of <strong>value and competitive advantage</strong>, not a by-product of operations. Every interaction — a click, a search, a purchase, a sensor reading — is an asset that, combined, reveals customers, operations and markets.</p>
<h3>Four levels of analytics</h3>
<pre><code>Descriptive  -> What happened?      (dashboards, reports)
Diagnostic   -> Why did it happen?  (drill-down, correlation)
Predictive   -> What will happen?   (forecasts, churn models)
Prescriptive -> What should we do?  (recommendations, optimization)
</code></pre>
<h3>Data-driven decisions</h3>
<p>A <strong>data-driven</strong> culture replaces "HiPPO" (the Highest-Paid Person's Opinion) with evidence: A/B tests, cohort analysis and metrics. But data has duties — <strong>governance</strong> (quality, ownership, single source of truth), <strong>privacy</strong> (GDPR, Vietnam's PDPD) and <strong>ethics</strong> (bias, consent). Bad data confidently used is worse than no data.</p>
<div class="callout"><span class="badge">Case — Amazon</span> Amazon turns data into a flywheel: purchase and browsing data power <em>recommendations</em> ("customers also bought"), demand forecasts stock warehouses, and dynamic pricing adjusts millions of prices a day. The data advantage compounds — more customers → more data → better recommendations → more customers.</div>`,
    `<span class="eyebrow">BDT201c · Chương 4 · Bài 4.1</span>
<h2>Dữ liệu như tài sản chiến lược</h2>
<h3>Dữ liệu là tài sản, không phải rác thải</h3>
<p>Trong khung của Rogers, dữ liệu là nguồn <strong>giá trị và lợi thế cạnh tranh</strong>, không phải sản phẩm phụ của vận hành. Mỗi tương tác — một cú nhấp, một lượt tìm, một đơn hàng, một số đọc cảm biến — là tài sản mà khi ghép lại sẽ lộ ra khách hàng, vận hành và thị trường.</p>
<h3>Bốn mức phân tích</h3>
<pre><code>Mô tả (descriptive)   -> Đã xảy ra gì?      (dashboard, báo cáo)
Chẩn đoán (diagnostic)-> Vì sao xảy ra?     (khoan sâu, tương quan)
Dự báo (predictive)   -> Sẽ xảy ra gì?      (dự báo, mô hình rời bỏ)
Đề xuất (prescriptive)-> Nên làm gì?        (gợi ý, tối ưu)
</code></pre>
<h3>Ra quyết định dựa trên dữ liệu</h3>
<p>Văn hoá <strong>data-driven</strong> thay "ý của sếp lương cao nhất" (HiPPO) bằng bằng chứng: A/B test, phân tích cohort và chỉ số. Nhưng dữ liệu có bổn phận — <strong>quản trị</strong> (chất lượng, quyền sở hữu, một nguồn sự thật), <strong>quyền riêng tư</strong> (GDPR, Nghị định 13 của Việt Nam) và <strong>đạo đức</strong> (thiên lệch, sự đồng ý). Dữ liệu xấu mà tin chắc còn tệ hơn không có dữ liệu.</p>
<div class="callout"><span class="badge">Ví dụ — Amazon</span> Amazon biến dữ liệu thành bánh đà: dữ liệu mua và duyệt tạo <em>gợi ý</em> ("khách cũng mua"), dự báo nhu cầu để nhập kho, và giá động chỉnh hàng triệu mức giá mỗi ngày. Lợi thế dữ liệu cộng dồn — nhiều khách → nhiều dữ liệu → gợi ý tốt hơn → nhiều khách hơn.</div>`,
  ]]);

const c4q = quiz('bdt201c-quiz-4', 'Quiz 4 — Data as asset|||Quiz 4 — Dữ liệu tài sản', [
  { id: 'q1', question: 'Phân tích trả lời "Sẽ xảy ra gì?" thuộc mức nào?', options: ['Mô tả (descriptive)', 'Chẩn đoán (diagnostic)', 'Dự báo (predictive)', 'Đề xuất (prescriptive)'], correctIndex: 2, explanation: 'Predictive dự báo tương lai (churn, nhu cầu); prescriptive mới nói NÊN làm gì.' },
  { id: 'q2', question: 'Văn hoá "data-driven" thay điều gì bằng bằng chứng?', options: ['Khách hàng', 'Ý kiến của người lương cao nhất (HiPPO)', 'Dữ liệu', 'Quản trị'], correctIndex: 1, explanation: 'Data-driven dùng A/B test và chỉ số thay cho quyết định theo cảm tính của sếp.' },
  { id: 'q3', question: 'Bánh đà dữ liệu của Amazon vận hành theo vòng nào?', options: ['Nhiều khách → nhiều dữ liệu → gợi ý tốt hơn → nhiều khách', 'Ít dữ liệu → giá cao', 'Không cần khách hàng', 'Dữ liệu chỉ để lưu trữ'], correctIndex: 0, explanation: 'Lợi thế dữ liệu cộng dồn qua vòng lặp tự củng cố.' },
]);

const c5 = doc('bdt201c-5-1-innovation-experiment', '5.1 — Innovation & rapid experimentation|||5.1 — Đổi mới & thử nghiệm nhanh',
  'Đổi mới qua thử nghiệm nhanh; MVP & build-measure-learn (Lean Startup); "fail fast" & học rẻ; A/B testing; agile vs waterfall. Ví dụ: Amazon (Kindle, thất bại Fire Phone), Google.',
  [[
    `<span class="eyebrow">BDT201c · Chapter 5 · Lesson 5.1</span>
<h2>Innovation &amp; rapid experimentation</h2>
<h3>Innovate by experiment, not by bet</h3>
<p>The old model made big, slow, expensive bets on a "finished" product. Rogers reframes innovation as <strong>rapid experimentation</strong>: run many small, cheap tests, learn from real customers, and scale only what works.</p>
<h3>The core loop — Build, Measure, Learn</h3>
<pre><code>Idea -> Build an MVP (minimum viable product, smallest testable thing)
     -> Measure with real users (data, not opinion)
     -> Learn: persevere, pivot, or kill
     -> repeat, faster and cheaper each cycle
</code></pre>
<p>An <strong>MVP</strong> is the smallest version that yields a real learning; the goal is <em>validated learning</em>, not a launch. <strong>A/B testing</strong> serves two versions to real users and lets data pick the winner.</p>
<h3>Fail fast, fail cheap</h3>
<p>"<strong>Fail fast</strong>" is not celebrating failure — it is finding out cheaply and early <em>before</em> spending a year building the wrong thing. This needs <strong>agile</strong> (short iterations, working increments) instead of <strong>waterfall</strong> (one big up-front plan), and a culture that is safe to test.</p>
<div class="callout"><span class="badge">Case — Amazon's culture of experiments</span> Amazon runs thousands of experiments a year and treats failures as tuition: the <em>Fire Phone</em> flopped, but the same "keep experimenting" culture produced AWS, Kindle and Alexa. As Bezos put it, invention requires being willing to be misunderstood — and to fail — repeatedly.</div>`,
    `<span class="eyebrow">BDT201c · Chương 5 · Bài 5.1</span>
<h2>Đổi mới &amp; thử nghiệm nhanh</h2>
<h3>Đổi mới bằng thử nghiệm, không bằng canh bạc</h3>
<p>Mô hình cũ đặt những canh bạc lớn, chậm, tốn kém vào một sản phẩm "hoàn thiện". Rogers định nghĩa lại đổi mới thành <strong>thử nghiệm nhanh</strong>: chạy nhiều phép thử nhỏ, rẻ, học từ khách thật, và chỉ nhân rộng thứ hiệu quả.</p>
<h3>Vòng lặp lõi — Dựng, Đo, Học</h3>
<pre><code>Ý tưởng -> Dựng MVP (sản phẩm khả dụng tối thiểu, thứ nhỏ nhất kiểm được)
        -> Đo với người dùng thật (dữ liệu, không phải ý kiến)
        -> Học: giữ hướng, xoay trục (pivot), hoặc bỏ
        -> lặp lại, mỗi vòng nhanh và rẻ hơn
</code></pre>
<p><strong>MVP</strong> là bản nhỏ nhất tạo ra một bài học thật; mục tiêu là <em>học đã kiểm chứng</em>, không phải ra mắt. <strong>A/B testing</strong> đưa hai phiên bản cho người dùng thật để dữ liệu chọn bản thắng.</p>
<h3>Thất bại nhanh, thất bại rẻ</h3>
<p>"<strong>Fail fast</strong>" không phải ca ngợi thất bại — mà là phát hiện rẻ và sớm <em>trước khi</em> tốn cả năm dựng nhầm thứ. Điều này cần <strong>agile</strong> (vòng ngắn, phần chạy được) thay cho <strong>waterfall</strong> (một kế hoạch lớn từ đầu), và một văn hoá an toàn để thử.</p>
<div class="callout"><span class="badge">Ví dụ — văn hoá thử nghiệm của Amazon</span> Amazon chạy hàng nghìn thử nghiệm mỗi năm và coi thất bại là học phí: <em>Fire Phone</em> thất bại, nhưng cùng văn hoá "cứ thử tiếp" đã sinh ra AWS, Kindle và Alexa. Như Bezos nói, phát minh đòi sẵn lòng bị hiểu lầm — và thất bại — nhiều lần.</div>`,
  ]]);

const c5q = quiz('bdt201c-quiz-5', 'Quiz 5 — Innovation|||Quiz 5 — Đổi mới', [
  { id: 'q1', question: 'MVP (minimum viable product) là?', options: ['Sản phẩm hoàn chỉnh cuối cùng', 'Bản nhỏ nhất đủ tạo ra một bài học thật', 'Bản demo bán hàng', 'Phiên bản đắt nhất'], correctIndex: 1, explanation: 'MVP nhằm học đã kiểm chứng với chi phí nhỏ nhất, không phải ra mắt hoành tráng.' },
  { id: 'q2', question: 'Vòng lặp lõi của thử nghiệm nhanh (Lean) là?', options: ['Plan → Approve → Ship', 'Build → Measure → Learn', 'Buy → Install → Forget', 'Design → Document → Archive'], correctIndex: 1, explanation: 'Build-Measure-Learn lặp lại, mỗi vòng nhanh và rẻ hơn.' },
  { id: 'q3', question: '"Fail fast" thực chất nghĩa là?', options: ['Ăn mừng thất bại', 'Phát hiện rẻ & sớm để không tốn cả năm làm nhầm', 'Không bao giờ thử', 'Bỏ dự án ngay lần đầu'], correctIndex: 1, explanation: 'Học rẻ và sớm trước khi đầu tư lớn; cần agile và văn hoá an toàn để thử.' },
]);

const c6 = doc('bdt201c-6-1-enabling-tech', '6.1 — Enabling technologies (concept level)|||6.1 — Công nghệ nền (mức khái niệm)',
  'Cloud (co giãn, trả theo dùng); AI/ML (học từ dữ liệu); IoT (vạn vật kết nối); big data (4V); tự động hoá (RPA). Mỗi công nghệ giải bài toán kinh doanh gì. Ví dụ: Viettel, Vietcombank.',
  [[
    `<span class="eyebrow">BDT201c · Chapter 6 · Lesson 6.1</span>
<h2>Enabling technologies (concept level)</h2>
<p class="lead">You do not need to build these — but a business leader must know <em>what each solves</em>. Siebel calls cloud, big data, AI and IoT the four forces reshaping every industry.</p>
<h3>The building blocks</h3>
<ul>
<li><strong>Cloud</strong> — computing on demand, rented and elastic (pay-as-you-go). Removes the up-front server cost, so a startup can scale like a giant. This is the <em>foundation</em> the rest sit on.</li>
<li><strong>Big data</strong> — data too large/fast/varied for old tools; the "4 V" (Volume, Velocity, Variety, Veracity). The fuel for AI.</li>
<li><strong>AI / Machine Learning</strong> — software that learns patterns from data instead of being explicitly programmed: recommendations, fraud detection, chatbots, forecasting.</li>
<li><strong>IoT (Internet of Things)</strong> — physical objects with sensors sending data (smart meters, factory machines, logistics trackers) — the real world becomes a data source.</li>
<li><strong>Automation / RPA</strong> — software robots doing repetitive digital tasks (data entry, reconciliation), freeing people for higher-value work.</li>
</ul>
<h3>Match the tech to the problem</h3>
<p>The mistake is buying tech for its own sake. Start from a <strong>business problem</strong> — "reduce fraud", "predict demand", "personalize the app" — and choose the enabler that fits. Technology is a means; the value is the business outcome.</p>
<div class="callout"><span class="badge">Case — Viettel</span> Viettel built cloud data centers, big-data analytics and AI (Vietnamese speech &amp; language) to move from a telecom operator toward a digital-services group — digital banking, e-government and IoT — showing how the four forces combine inside one Vietnamese enterprise.</div>`,
    `<span class="eyebrow">BDT201c · Chương 6 · Bài 6.1</span>
<h2>Công nghệ nền (mức khái niệm)</h2>
<p class="lead">Bạn không cần tự dựng chúng — nhưng lãnh đạo kinh doanh phải biết <em>mỗi thứ giải bài toán gì</em>. Siebel gọi cloud, big data, AI và IoT là bốn lực định hình lại mọi ngành.</p>
<h3>Các khối nền</h3>
<ul>
<li><strong>Cloud (điện toán đám mây)</strong> — tính toán theo yêu cầu, thuê và co giãn (trả theo dùng). Bỏ chi phí máy chủ ban đầu, nên startup mở rộng được như gã khổng lồ. Đây là <em>nền móng</em> cho phần còn lại.</li>
<li><strong>Big data</strong> — dữ liệu quá lớn/nhanh/đa dạng cho công cụ cũ; "4 V" (Khối lượng, Tốc độ, Đa dạng, Độ tin). Là nhiên liệu cho AI.</li>
<li><strong>AI / Học máy</strong> — phần mềm học quy luật từ dữ liệu thay vì được lập trình tường minh: gợi ý, phát hiện gian lận, chatbot, dự báo.</li>
<li><strong>IoT (Internet vạn vật)</strong> — vật lý gắn cảm biến gửi dữ liệu (công tơ thông minh, máy nhà xưởng, thiết bị theo dõi logistics) — thế giới thực thành nguồn dữ liệu.</li>
<li><strong>Tự động hoá / RPA</strong> — robot phần mềm làm việc số lặp lại (nhập liệu, đối soát), giải phóng con người cho việc giá trị cao hơn.</li>
</ul>
<h3>Khớp công nghệ với bài toán</h3>
<p>Sai lầm là mua công nghệ vì công nghệ. Hãy bắt đầu từ một <strong>bài toán kinh doanh</strong> — "giảm gian lận", "dự báo nhu cầu", "cá nhân hoá app" — rồi chọn công nghệ nền phù hợp. Công nghệ là phương tiện; giá trị là kết quả kinh doanh.</p>
<div class="callout"><span class="badge">Ví dụ — Viettel</span> Viettel dựng trung tâm dữ liệu đám mây, phân tích big data và AI (giọng &amp; ngôn ngữ tiếng Việt) để đi từ nhà mạng viễn thông sang tập đoàn dịch vụ số — ngân hàng số, chính phủ điện tử và IoT — cho thấy bốn lực kết hợp thế nào trong một doanh nghiệp Việt.</div>`,
  ]]);

const c6q = quiz('bdt201c-quiz-6', 'Quiz 6 — Enabling tech|||Quiz 6 — Công nghệ nền', [
  { id: 'q1', question: 'Lợi ích chính của điện toán đám mây (cloud) cho doanh nghiệp là?', options: ['Máy chủ đẹp hơn', 'Tính toán co giãn, trả theo dùng, bỏ chi phí đầu tư lớn ban đầu', 'Internet nhanh hơn', 'Không cần dữ liệu'], correctIndex: 1, explanation: 'Cloud = tài nguyên thuê, co giãn, pay-as-you-go; nền móng cho AI/big data.' },
  { id: 'q2', question: 'IoT (Internet vạn vật) biến điều gì thành nguồn dữ liệu?', options: ['Chỉ máy tính', 'Các vật lý gắn cảm biến (máy, xe, công tơ)', 'Chỉ điện thoại', 'Mạng xã hội'], correctIndex: 1, explanation: 'Cảm biến trên vật thực gửi dữ liệu về; thế giới vật lý thành dữ liệu.' },
  { id: 'q3', question: 'Nguyên tắc đúng khi chọn công nghệ nền là?', options: ['Mua công nghệ mới nhất', 'Bắt đầu từ bài toán kinh doanh rồi chọn công nghệ phù hợp', 'Chọn thứ đắt nhất', 'Sao chép đối thủ'], correctIndex: 1, explanation: 'Công nghệ là phương tiện; giá trị là kết quả kinh doanh, nên đi từ bài toán.' },
]);

const c7 = doc('bdt201c-7-1-people-culture', '7.1 — People, culture & digital capability|||7.1 — Con người, văn hoá & năng lực số',
  'Văn hoá số (thử nghiệm, hợp tác, dữ liệu, lấy khách làm trung tâm); quản trị thay đổi (Kotter); kỹ năng & nâng cấp năng lực (reskill/upskill); lãnh đạo số & tầm nhìn. Vì sao 70% DX thất bại vì con người.',
  [[
    `<span class="eyebrow">BDT201c · Chapter 7 · Lesson 7.1</span>
<h2>People, culture &amp; digital capability</h2>
<h3>Culture eats strategy</h3>
<p>McKinsey and others report that around <strong>70% of transformations fall short</strong> — and the failure is rarely the technology. It is <strong>people</strong>: resistance to change, silos, fear, and no shared vision. A <strong>digital culture</strong> is experiment-friendly, collaborative, data-informed and customer-centric, with a tolerance for smart failure.</p>
<h3>Leading change (Kotter, simplified)</h3>
<ul>
<li><strong>Urgency</strong> — make the "why change now" real and honest.</li>
<li><strong>Vision &amp; coalition</strong> — a clear digital vision and leaders who back it.</li>
<li><strong>Empower &amp; quick wins</strong> — remove blockers, ship visible early wins to build belief.</li>
<li><strong>Anchor it</strong> — bake new ways of working into processes and rewards.</li>
</ul>
<h3>Skills &amp; digital leadership</h3>
<p>DX needs both <strong>reskilling</strong> (new roles) and <strong>upskilling</strong> (raising current staff — data literacy, agile, digital tools). <strong>Digital leaders</strong> set the vision, model new behaviors, and give teams the autonomy to experiment. In <em>Leading Digital</em>, "Digital Masters" combine <strong>digital capability</strong> (the tech &amp; data) with <strong>leadership capability</strong> (the vision &amp; governance) — you need both.</p>
<div class="callout"><span class="badge">Case — DBS Bank</span> Singapore's DBS reframed itself as "a tech company delivering banking", retraining thousands of staff, embedding agile squads and measuring itself against Amazon and Google — showing DX is won or lost on culture and capability, not just apps.</div>`,
    `<span class="eyebrow">BDT201c · Chương 7 · Bài 7.1</span>
<h2>Con người, văn hoá &amp; năng lực số</h2>
<h3>Văn hoá "ăn" chiến lược</h3>
<p>McKinsey và nhiều nơi cho thấy khoảng <strong>70% cuộc chuyển đổi không đạt mục tiêu</strong> — và thất bại hiếm khi do công nghệ. Đó là <strong>con người</strong>: chống lại thay đổi, silo, sợ hãi, và thiếu tầm nhìn chung. Một <strong>văn hoá số</strong> ưa thử nghiệm, hợp tác, dựa trên dữ liệu và lấy khách làm trung tâm, chấp nhận thất bại thông minh.</p>
<h3>Dẫn dắt thay đổi (Kotter, rút gọn)</h3>
<ul>
<li><strong>Tính cấp bách</strong> — làm cho "vì sao phải đổi ngay" trở nên thật và trung thực.</li>
<li><strong>Tầm nhìn &amp; liên minh</strong> — một tầm nhìn số rõ ràng và các lãnh đạo hậu thuẫn.</li>
<li><strong>Trao quyền &amp; thắng lợi sớm</strong> — dẹp rào cản, tạo kết quả sớm nhìn thấy được để xây niềm tin.</li>
<li><strong>Neo lại</strong> — cài cách làm mới vào quy trình và cơ chế khen thưởng.</li>
</ul>
<h3>Kỹ năng &amp; lãnh đạo số</h3>
<p>DX cần cả <strong>đào tạo lại (reskill)</strong> (vai trò mới) và <strong>nâng cấp (upskill)</strong> (nâng nhân sự hiện có — hiểu dữ liệu, agile, công cụ số). <strong>Lãnh đạo số</strong> đặt tầm nhìn, làm gương hành vi mới, và trao quyền để đội ngũ thử nghiệm. Trong <em>Leading Digital</em>, "Digital Masters" kết hợp <strong>năng lực số</strong> (công nghệ &amp; dữ liệu) với <strong>năng lực lãnh đạo</strong> (tầm nhìn &amp; quản trị) — phải có cả hai.</p>
<div class="callout"><span class="badge">Ví dụ — DBS Bank</span> DBS của Singapore tự định nghĩa lại là "một công ty công nghệ làm ngân hàng", đào tạo lại hàng nghìn nhân sự, cài các squad agile và tự so mình với Amazon, Google — cho thấy DX thắng hay thua ở văn hoá và năng lực, không chỉ ở app.</div>`,
  ]]);

const c7q = quiz('bdt201c-quiz-7', 'Quiz 7 — People & culture|||Quiz 7 — Con người & văn hoá', [
  { id: 'q1', question: 'Nguyên nhân phổ biến nhất khiến ~70% cuộc chuyển đổi số thất bại là?', options: ['Công nghệ quá yếu', 'Con người & văn hoá (chống đổi, thiếu tầm nhìn)', 'Thiếu máy chủ', 'Internet chậm'], correctIndex: 1, explanation: 'Thất bại hiếm khi do công nghệ; chủ yếu là con người, văn hoá và lãnh đạo.' },
  { id: 'q2', question: 'Theo Westerman, "Digital Masters" kết hợp?', options: ['Nhiều tiền + nhiều nhân viên', 'Năng lực số + năng lực lãnh đạo', 'Chỉ công nghệ', 'Chỉ marketing'], correctIndex: 1, explanation: 'Cần cả năng lực số (tech/dữ liệu) và năng lực lãnh đạo (tầm nhìn/quản trị).' },
  { id: 'q3', question: 'Trong dẫn dắt thay đổi (Kotter), vì sao cần "thắng lợi sớm"?', options: ['Để tiêu hết ngân sách', 'Tạo kết quả nhìn thấy được, xây niềm tin & động lực', 'Để bỏ dự án', 'Để thay lãnh đạo'], correctIndex: 1, explanation: 'Quick wins chứng minh hướng đi đúng và giảm sức chống lại thay đổi.' },
]);

const c8 = doc('bdt201c-8-1-roadmap-measure', '8.1 — DX roadmap, maturity & measurement|||8.1 — Lộ trình, trưởng thành & đo lường',
  'Lộ trình chuyển đổi (assess → vision → prioritize → pilot → scale); mô hình trưởng thành số; KPI & OKR đo DX; quản trị rủi ro (an ninh mạng, phụ thuộc, đổi mà không có giá trị). Ví dụ chuyển đổi thật: Vietcombank.',
  [[
    `<span class="eyebrow">BDT201c · Chapter 8 · Lesson 8.1</span>
<h2>DX roadmap, maturity &amp; measurement</h2>
<h3>A roadmap, not a big bang</h3>
<p>Transformation is a journey run in stages, not one giant launch. A workable <strong>roadmap</strong>:</p>
<pre><code>1 Assess     -> where are we? (maturity model, gaps)
2 Vision     -> where do we want to be? (digital vision, goals)
3 Prioritize -> which initiatives give most value / least risk?
4 Pilot      -> run small experiments, prove value
5 Scale      -> roll out what works; embed &amp; repeat
</code></pre>
<h3>Maturity models</h3>
<p>A <strong>digital maturity model</strong> (e.g. Deloitte, Westerman) rates a firm across dimensions — strategy, customer, data, technology, operations, culture — from "beginner / laggard" to "digital master". It turns "are we digital?" into a measurable, comparable score you can track over time.</p>
<h3>Measure it: KPIs &amp; OKRs</h3>
<ul>
<li><strong>Customer</strong> — NPS, digital adoption rate, churn, CAC.</li>
<li><strong>Operations</strong> — cycle time, cost-to-serve, automation rate.</li>
<li><strong>Growth</strong> — % revenue from digital channels/products, time-to-market.</li>
</ul>
<h3>Manage the risks</h3>
<p>DX brings <strong>cybersecurity</strong> and privacy exposure, vendor/tech <strong>lock-in</strong>, and "transformation theater" — activity that changes tools but not value. Govern with clear ownership, security-by-design and a hard link from every initiative to a business outcome.</p>
<div class="callout"><span class="badge">Case — Vietcombank / Vietnamese banks</span> Vietnam's banks moved from branch-first to <em>digital-first</em>: mobile banking, eKYC onboarding, QR payments and AI service. Adoption jumped when the pandemic pushed customers online — a real transformation measured in digital-transaction share and cost-to-serve, not in press releases.</div>`,
    `<span class="eyebrow">BDT201c · Chương 8 · Bài 8.1</span>
<h2>Lộ trình, trưởng thành &amp; đo lường</h2>
<h3>Một lộ trình, không phải "vụ nổ lớn"</h3>
<p>Chuyển đổi là hành trình chạy theo giai đoạn, không phải một cú ra mắt khổng lồ. Một <strong>lộ trình</strong> khả thi:</p>
<pre><code>1 Đánh giá   -> ta đang ở đâu? (mô hình trưởng thành, khoảng trống)
2 Tầm nhìn   -> ta muốn tới đâu? (tầm nhìn số, mục tiêu)
3 Ưu tiên    -> sáng kiến nào giá trị cao / rủi ro thấp nhất?
4 Thí điểm   -> chạy thử nghiệm nhỏ, chứng minh giá trị
5 Nhân rộng  -> mở rộng thứ hiệu quả; cài vào & lặp lại
</code></pre>
<h3>Mô hình trưởng thành</h3>
<p>Một <strong>mô hình trưởng thành số</strong> (vd Deloitte, Westerman) chấm điểm doanh nghiệp trên nhiều chiều — chiến lược, khách hàng, dữ liệu, công nghệ, vận hành, văn hoá — từ "mới bắt đầu / tụt hậu" tới "digital master". Nó biến "ta đã số chưa?" thành điểm số đo được, so sánh được, theo dõi theo thời gian.</p>
<h3>Đo lường: KPI &amp; OKR</h3>
<ul>
<li><strong>Khách hàng</strong> — NPS, tỉ lệ dùng kênh số, tỉ lệ rời bỏ, chi phí thu hút (CAC).</li>
<li><strong>Vận hành</strong> — thời gian chu trình, chi phí phục vụ, tỉ lệ tự động hoá.</li>
<li><strong>Tăng trưởng</strong> — % doanh thu từ kênh/sản phẩm số, thời gian ra thị trường.</li>
</ul>
<h3>Quản trị rủi ro</h3>
<p>DX kéo theo rủi ro <strong>an ninh mạng</strong> và quyền riêng tư, <strong>lệ thuộc</strong> nhà cung cấp/công nghệ, và "diễn kịch chuyển đổi" — hoạt động đổi công cụ mà không đổi giá trị. Quản trị bằng phân quyền rõ, an toàn từ thiết kế và ràng buộc chặt mỗi sáng kiến với một kết quả kinh doanh.</p>
<div class="callout"><span class="badge">Ví dụ — Vietcombank / ngân hàng Việt</span> Ngân hàng Việt Nam chuyển từ ưu tiên chi nhánh sang <em>ưu tiên số</em>: mobile banking, mở tài khoản eKYC, thanh toán QR và dịch vụ AI. Tỉ lệ dùng tăng vọt khi đại dịch đẩy khách lên online — một cuộc chuyển đổi thật, đo bằng tỉ trọng giao dịch số và chi phí phục vụ, không phải bằng thông cáo báo chí.</div>`,
  ]]);

const c8q = quiz('bdt201c-quiz-8', 'Quiz 8 — Roadmap & measure|||Quiz 8 — Lộ trình & đo lường', [
  { id: 'q1', question: 'Thứ tự hợp lý của một lộ trình chuyển đổi số là?', options: ['Nhân rộng → Đánh giá → Tầm nhìn', 'Đánh giá → Tầm nhìn → Ưu tiên → Thí điểm → Nhân rộng', 'Thí điểm → Bỏ → Mua công cụ', 'Tầm nhìn → Nhân rộng ngay'], correctIndex: 1, explanation: 'Chuyển đổi là hành trình theo giai đoạn, không phải một cú "big bang".' },
  { id: 'q2', question: 'Mô hình trưởng thành số (maturity model) dùng để?', options: ['Chọn nhà cung cấp', 'Chấm điểm doanh nghiệp theo nhiều chiều & theo dõi theo thời gian', 'Tính lương', 'Thiết kế logo'], correctIndex: 1, explanation: 'Biến "ta đã số chưa?" thành điểm đo được, so sánh được qua các chiều.' },
  { id: 'q3', question: '"Transformation theater" (diễn kịch chuyển đổi) là rủi ro gì?', options: ['Đổi công cụ nhưng không đổi giá trị kinh doanh', 'Bảo mật quá chặt', 'Quá nhiều khách hàng', 'Dữ liệu quá sạch'], correctIndex: 0, explanation: 'Hoạt động sôi nổi đổi tool mà không tạo kết quả; cần ràng buộc mỗi sáng kiến với outcome.' },
]);

export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'BDT201c',
    slug: 'bdt201c-business-digital-transformation',
    title: 'Business Digital Transformation',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/BDT201c.webp',
    shortDescription: 'Digital transformation from strategy to roadmap — new business models, the digital customer, data as an asset, rapid experimentation, enabling tech (cloud, AI, IoT) & digital culture. Real cases: Netflix, Amazon, Nike, Viettel. Bilingual, with quizzes.|||Chuyển đổi số từ chiến lược tới lộ trình — mô hình kinh doanh mới, khách hàng số, dữ liệu như tài sản, thử nghiệm nhanh, công nghệ nền (cloud, AI, IoT) & văn hoá số. Ví dụ thật: Netflix, Amazon, Nike, Viettel. Song ngữ, có quiz.',
    description: 'Môn <strong>BDT201c — Business Digital Transformation</strong> (Chuyển đổi số doanh nghiệp, khối Công nghệ Truyền thông, kỳ 1) giúp hiểu <strong>công nghệ số định hình lại doanh nghiệp thế nào</strong>. Từ <strong>DX là gì</strong> (phân biệt số hoá / số hoá quy trình / chuyển đổi) → <strong>chiến lược &amp; mô hình kinh doanh</strong> (nền tảng, đột phá) → <strong>khách hàng số, dữ liệu như tài sản, đổi mới &amp; thử nghiệm nhanh</strong> → <strong>công nghệ nền</strong> (cloud, AI, IoT) → <strong>con người &amp; văn hoá</strong> → <strong>lộ trình, trưởng thành &amp; đo lường</strong>. Bám sách chuẩn (Rogers, Westerman, Siebel, McKinsey), song ngữ, ví dụ doanh nghiệp thật (Netflix, Amazon, Nike, Viettel, Vietcombank), quiz mỗi chương.',
    whatYouLearn: 'Phân biệt digitization / digitalization / transformation; chiến lược số &amp; đổi mới mô hình kinh doanh (nền tảng, hiệu ứng mạng, disruption); mạng lưới khách hàng &amp; trải nghiệm đa kênh; dữ liệu như tài sản, 4 mức phân tích, ra quyết định dựa trên dữ liệu; MVP &amp; Build-Measure-Learn, fail fast, A/B testing; công nghệ nền (cloud, big data, AI, IoT, RPA) ở mức khái niệm; văn hoá số, quản trị thay đổi (Kotter), lãnh đạo số; lộ trình DX, mô hình trưởng thành, KPI/OKR và quản trị rủi ro.',
    requirements: 'Không cần nền lập trình — đây là môn kinh doanh về công nghệ. Nên có hiểu biết cơ bản về doanh nghiệp/kinh tế. Xem giáo trình chính thức của môn trên FLM (flm.fpt.edu.vn).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide FLM, sách chuẩn (Rogers, Westerman, Siebel), báo cáo McKinsey/Deloitte/MIT, công cụ, lộ trình 4 bước.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'DX là gì, vì sao quan trọng, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Chuyển đổi số là gì|||Chapter 1 — What DX is', description: 'Định nghĩa, ba mức độ, động lực, Kodak vs Fujifilm.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Chiến lược & mô hình|||Chapter 2 — Strategy & models', description: 'Chiến lược số, đổi mô hình, nền tảng, disruption, Netflix.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Khách hàng số|||Chapter 3 — Digital customer', description: 'Mạng lưới khách hàng, trải nghiệm đa kênh, kỳ vọng mới, Nike.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Dữ liệu như tài sản|||Chapter 4 — Data as asset', description: '4 mức phân tích, quyết định dựa dữ liệu, quản trị, Amazon.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Đổi mới & thử nghiệm nhanh|||Chapter 5 — Innovation', description: 'MVP, Build-Measure-Learn, fail fast, A/B testing, Amazon.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Công nghệ nền|||Chapter 6 — Enabling tech', description: 'Cloud, big data, AI, IoT, RPA ở mức khái niệm, Viettel.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Con người & văn hoá|||Chapter 7 — People & culture', description: 'Văn hoá số, quản trị thay đổi, kỹ năng, lãnh đạo số, DBS.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Lộ trình & đo lường|||Chapter 8 — Roadmap & measure', description: 'Lộ trình DX, mô hình trưởng thành, KPI, rủi ro, Vietcombank.', lessons: [c8, c8q] },
  ],
};
