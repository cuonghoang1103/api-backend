/**
 * MKT101 — Marketing Principles (Nguyên lý marketing). Khối Quản trị Kinh doanh, kỳ 1.
 * Bám cấu trúc giáo trình marketing căn bản chuẩn (vd Kotler & Armstrong — Principles of
 * Marketing): quy trình marketing, chiến lược & môi trường, nghiên cứu, hành vi khách hàng,
 * STP, sản phẩm & giá, phân phối & truyền thông. Song ngữ + ví dụ (số đã kiểm; tình huống là
 * GIẢ ĐỊNH, không có số liệu thị trường thật) + bài tập + quiz.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('mkt101-0-1-overview', 'Course overview: what marketing really is|||Tổng quan: marketing thực chất là gì',
  'Định nghĩa marketing, quy trình marketing 5 bước, nhu cầu – mong muốn – cầu, sản phẩm chào bán, giá trị và sự hài lòng, 5 triết lý quản trị marketing, lộ trình môn.',
  [[
    `<span class="eyebrow">MKT101 · Lesson 0.1 · Overview</span>
<h2>Marketing Principles</h2>
<p class="lead">Marketing is not just advertising or selling. It is the process of <strong>engaging customers</strong>, building <strong>strong relationships</strong> with them and <strong>creating value</strong> for them, so that the company <strong>captures value</strong> — sales, profits, loyalty — in return.</p>
<h3>The marketing process in five steps</h3>
<ol>
<li>Understand the marketplace and customer needs and wants.</li>
<li>Design a customer value-driven marketing strategy (whom to serve, how to create value).</li>
<li>Construct an integrated marketing programme — the <strong>marketing mix</strong> (4Ps: product, price, place, promotion) — that delivers superior value.</li>
<li>Engage customers and build profitable relationships.</li>
<li>Capture value from customers: profits, loyalty and <em>customer equity</em>.</li>
</ol>
<h3>Core concepts</h3>
<ul>
<li><strong>Needs</strong> are states of felt deprivation (food, belonging); <strong>wants</strong> are needs shaped by culture and personality (a bowl of phở, a café with friends); <strong>demands</strong> are wants backed by buying power.</li>
<li><strong>Market offerings</strong> combine products, services, information and experiences.</li>
<li><strong>Customer value</strong> is the difference between the benefits a customer gets and the costs they bear, compared with competitors; <strong>satisfaction</strong> depends on how performance meets expectations.</li>
<li><strong>Exchange</strong> — obtaining something desired by offering something in return — and long-term <strong>relationships</strong> are what marketing manages.</li>
</ul>
<h3>Five marketing management orientations</h3>
<table>
<tr><th>Concept</th><th>Belief</th></tr>
<tr><td>Production</td><td>Customers favour products that are available and cheap — focus on efficiency</td></tr>
<tr><td>Product</td><td>Customers favour the best quality and features — focus on improving the product</td></tr>
<tr><td>Selling</td><td>Customers will not buy enough unless the firm sells and promotes aggressively</td></tr>
<tr><td>Marketing</td><td>Success comes from knowing target customers' needs and delivering value better than competitors</td></tr>
<tr><td>Societal marketing</td><td>Also consider consumers' long-term interests and society's well-being</td></tr>
</table>
<h3>Roadmap</h3>
<p>Part 1: strategy, environment and research · Part 2: customers and STP (segmentation, targeting, positioning) · Part 3: product and price · Part 4: place and promotion. Each part ends with a quiz; parts 2 and 3 include exercises.</p>
<div class="callout"><span class="badge">Mindset</span> Start with the customer, not the product: "What problem am I solving, for whom, better than the alternatives?"</div>`,
    `<span class="eyebrow">MKT101 · Bài 0.1 · Tổng quan</span>
<h2>Nguyên lý marketing</h2>
<p class="lead">Marketing không chỉ là quảng cáo hay bán hàng. Đó là quá trình <strong>gắn kết khách hàng</strong>, xây dựng <strong>mối quan hệ bền chặt</strong> với họ và <strong>tạo ra giá trị</strong> cho họ, để doanh nghiệp <strong>thu về giá trị</strong> — doanh số, lợi nhuận, lòng trung thành — đổi lại.</p>
<h3>Quy trình marketing năm bước</h3>
<ol>
<li>Hiểu thị trường và nhu cầu, mong muốn của khách hàng.</li>
<li>Thiết kế chiến lược marketing hướng tới giá trị khách hàng (phục vụ ai, tạo giá trị thế nào).</li>
<li>Xây dựng chương trình marketing tích hợp — <strong>marketing mix</strong> (4P: sản phẩm, giá, phân phối, xúc tiến) — mang lại giá trị vượt trội.</li>
<li>Gắn kết khách hàng và xây dựng mối quan hệ có lợi nhuận.</li>
<li>Thu giá trị từ khách hàng: lợi nhuận, lòng trung thành và <em>giá trị vòng đời khách hàng</em>.</li>
</ol>
<h3>Các khái niệm cốt lõi</h3>
<ul>
<li><strong>Nhu cầu</strong> là trạng thái cảm thấy thiếu hụt (ăn uống, được thuộc về một nhóm); <strong>mong muốn</strong> là nhu cầu được văn hoá và cá tính định hình (một bát phở, một buổi cà phê với bạn); <strong>cầu</strong> là mong muốn đi kèm khả năng chi trả.</li>
<li><strong>Sản phẩm chào bán</strong> kết hợp sản phẩm, dịch vụ, thông tin và trải nghiệm.</li>
<li><strong>Giá trị cho khách hàng</strong> là chênh lệch giữa lợi ích khách nhận được và chi phí họ bỏ ra, so với đối thủ; <strong>sự hài lòng</strong> phụ thuộc vào việc sản phẩm đáp ứng kỳ vọng tới đâu.</li>
<li><strong>Trao đổi</strong> — có được thứ mình muốn bằng cách đưa lại một thứ khác — và <strong>mối quan hệ</strong> dài hạn là những gì marketing quản lý.</li>
</ul>
<h3>Năm triết lý quản trị marketing</h3>
<table>
<tr><th>Triết lý</th><th>Niềm tin</th></tr>
<tr><td>Sản xuất</td><td>Khách hàng chuộng sản phẩm sẵn có và rẻ — tập trung vào hiệu suất</td></tr>
<tr><td>Sản phẩm</td><td>Khách hàng chuộng chất lượng và tính năng tốt nhất — tập trung cải tiến sản phẩm</td></tr>
<tr><td>Bán hàng</td><td>Khách hàng sẽ không mua đủ nếu doanh nghiệp không đẩy mạnh bán và quảng bá</td></tr>
<tr><td>Marketing</td><td>Thành công đến từ việc hiểu nhu cầu khách hàng mục tiêu và mang lại giá trị tốt hơn đối thủ</td></tr>
<tr><td>Marketing xã hội</td><td>Cân nhắc thêm lợi ích dài hạn của người tiêu dùng và phúc lợi của xã hội</td></tr>
</table>
<h3>Lộ trình</h3>
<p>Phần 1: chiến lược, môi trường và nghiên cứu · Phần 2: khách hàng và STP (phân khúc, chọn thị trường mục tiêu, định vị) · Phần 3: sản phẩm và giá · Phần 4: phân phối và xúc tiến. Mỗi phần kết thúc bằng một bài quiz; phần 2 và 3 có bài tập.</p>
<div class="callout"><span class="badge">Tư duy</span> Bắt đầu từ khách hàng, không phải từ sản phẩm: "Tôi đang giải quyết vấn đề gì, cho ai, tốt hơn các lựa chọn khác ra sao?"</div>`,
  ]]);

const c1 = doc('mkt101-1-1-strategy-environment', '1.1 — Marketing strategy & the marketing environment|||1.1 — Chiến lược marketing & môi trường marketing',
  'Hoạch định chiến lược toàn công ty (sứ mệnh hướng thị trường, mục tiêu, danh mục kinh doanh: ma trận BCG và ma trận Ansoff), vai trò của marketing, môi trường vi mô (6 tác nhân) và môi trường vĩ mô (6 lực lượng).',
  [[
    `<span class="eyebrow">MKT101 · Part 1 · Lesson 1.1</span>
<h2>Marketing strategy &amp; the marketing environment</h2>
<h3>Company-wide strategic planning</h3>
<p>Strategy starts with a <strong>market-oriented mission</strong> — defined by the customer need served ("we help people stay connected"), not by the product ("we sell phones"). The mission becomes concrete <strong>objectives</strong>, and management then designs the <strong>business portfolio</strong>:</p>
<table>
<tr><th>BCG growth–share matrix</th><th>Market growth</th><th>Relative share</th><th>Typical action</th></tr>
<tr><td>Star</td><td>High</td><td>High</td><td>Invest to keep growing</td></tr>
<tr><td>Cash cow</td><td>Low</td><td>High</td><td>Harvest cash to fund other units</td></tr>
<tr><td>Question mark</td><td>High</td><td>Low</td><td>Build selectively or drop</td></tr>
<tr><td>Dog</td><td>Low</td><td>Low</td><td>Keep only if useful, or divest</td></tr>
</table>
<p>For growth, the <strong>product/market expansion grid</strong> (Ansoff) offers four routes: <strong>market penetration</strong> (more sales of current products to current markets), <strong>market development</strong> (new markets for current products), <strong>product development</strong> (new products for current markets) and <strong>diversification</strong> (new products for new markets — the riskiest).</p>
<h3>The marketing environment</h3>
<p>Marketing operates among actors and forces it does not fully control.</p>
<table>
<tr><th>Microenvironment (close to the company)</th><th>Macroenvironment (larger societal forces)</th></tr>
<tr><td>The company (other departments), suppliers, marketing intermediaries (resellers, logistics firms, agencies, financial intermediaries), competitors, publics (media, government, citizen groups), customers</td><td>Demographic (age structure, urbanization), economic (income, spending patterns), natural (resources, climate), technological, political and social (laws, regulation), cultural (values, beliefs)</td></tr>
</table>
<p>Smart marketers do not just react: they monitor trends, anticipate changes and sometimes shape the environment (through lobbying, partnerships or public relations).</p>
<div class="callout"><span class="badge">Example of reasoning</span> A fast-urbanizing population with rising incomes (demographic and economic forces) plus widespread smartphones (technology) creates an opportunity for delivery services — but also attracts competitors and new regulation.</div>`,
    `<span class="eyebrow">MKT101 · Phần 1 · Bài 1.1</span>
<h2>Chiến lược marketing &amp; môi trường marketing</h2>
<h3>Hoạch định chiến lược toàn công ty</h3>
<p>Chiến lược bắt đầu từ một <strong>sứ mệnh hướng thị trường</strong> — xác định bằng nhu cầu khách hàng được phục vụ ("chúng tôi giúp mọi người luôn kết nối"), không phải bằng sản phẩm ("chúng tôi bán điện thoại"). Sứ mệnh được cụ thể hoá thành <strong>mục tiêu</strong>, rồi ban lãnh đạo thiết kế <strong>danh mục kinh doanh</strong>:</p>
<table>
<tr><th>Ma trận tăng trưởng – thị phần BCG</th><th>Tăng trưởng thị trường</th><th>Thị phần tương đối</th><th>Hành động điển hình</th></tr>
<tr><td>Ngôi sao</td><td>Cao</td><td>Cao</td><td>Đầu tư để tiếp tục tăng trưởng</td></tr>
<tr><td>Bò sữa</td><td>Thấp</td><td>Cao</td><td>Thu tiền để nuôi các đơn vị khác</td></tr>
<tr><td>Dấu hỏi</td><td>Cao</td><td>Thấp</td><td>Xây dựng có chọn lọc hoặc loại bỏ</td></tr>
<tr><td>Con chó</td><td>Thấp</td><td>Thấp</td><td>Chỉ giữ nếu còn hữu ích, hoặc thoái vốn</td></tr>
</table>
<p>Để tăng trưởng, <strong>ma trận mở rộng sản phẩm/thị trường</strong> (Ansoff) có bốn hướng: <strong>thâm nhập thị trường</strong> (bán nhiều hơn sản phẩm hiện có ở thị trường hiện có), <strong>phát triển thị trường</strong> (thị trường mới cho sản phẩm hiện có), <strong>phát triển sản phẩm</strong> (sản phẩm mới cho thị trường hiện có) và <strong>đa dạng hoá</strong> (sản phẩm mới cho thị trường mới — rủi ro nhất).</p>
<h3>Môi trường marketing</h3>
<p>Marketing hoạt động giữa những tác nhân và lực lượng mà doanh nghiệp không kiểm soát hoàn toàn.</p>
<table>
<tr><th>Môi trường vi mô (gần doanh nghiệp)</th><th>Môi trường vĩ mô (các lực lượng xã hội rộng lớn)</th></tr>
<tr><td>Bản thân doanh nghiệp (các phòng ban khác), nhà cung cấp, trung gian marketing (người bán lại, công ty logistics, đại lý dịch vụ marketing, trung gian tài chính), đối thủ cạnh tranh, công chúng (truyền thông, chính quyền, nhóm công dân), khách hàng</td><td>Nhân khẩu học (cơ cấu tuổi, đô thị hoá), kinh tế (thu nhập, cơ cấu chi tiêu), tự nhiên (tài nguyên, khí hậu), công nghệ, chính trị – xã hội (luật, quy định), văn hoá (giá trị, niềm tin)</td></tr>
</table>
<p>Người làm marketing giỏi không chỉ phản ứng: họ theo dõi xu hướng, dự đoán thay đổi và đôi khi định hình môi trường (qua vận động chính sách, hợp tác hay quan hệ công chúng).</p>
<div class="callout"><span class="badge">Ví dụ lập luận</span> Dân số đô thị hoá nhanh với thu nhập tăng (lực lượng nhân khẩu và kinh tế) cộng với điện thoại thông minh phổ biến (công nghệ) tạo ra cơ hội cho dịch vụ giao hàng — nhưng cũng thu hút đối thủ và quy định mới.</div>`,
  ]]);

const c2 = doc('mkt101-1-2-research', '1.2 — Marketing information & research|||1.2 — Thông tin & nghiên cứu marketing',
  'Hệ thống thông tin marketing và insight khách hàng, quy trình nghiên cứu 4 bước (xác định vấn đề, lập kế hoạch, thực hiện, diễn giải), nghiên cứu khám phá – mô tả – nhân quả, dữ liệu sơ cấp và thứ cấp, quan sát – khảo sát – thực nghiệm, chọn mẫu, lỗi hay gặp khi đặt câu hỏi.',
  [[
    `<span class="eyebrow">MKT101 · Part 1 · Lesson 1.2</span>
<h2>Marketing information &amp; research</h2>
<p>Good decisions rest on <strong>customer insights</strong> — fresh understanding of customers' needs and motives. A marketing information system gathers them from internal databases (sales, customer records), <strong>marketing intelligence</strong> (public information about competitors and trends) and <strong>marketing research</strong>.</p>
<h3>The research process</h3>
<ol>
<li><strong>Define the problem and research objectives</strong> — <em>exploratory</em> (gather preliminary information), <em>descriptive</em> (describe who buys, how much), or <em>causal</em> (test cause and effect, e.g. does a 10% price cut raise sales?).</li>
<li><strong>Develop the research plan</strong> — what information is needed, from where, how.</li>
<li><strong>Implement the plan</strong> — collect and process the data.</li>
<li><strong>Interpret and report the findings</strong> — turn data into decisions.</li>
</ol>
<h3>Data and methods</h3>
<table>
<tr><th>Choice</th><th>Options</th></tr>
<tr><td>Data type</td><td><strong>Secondary data</strong> already exist, collected for another purpose (reports, statistics, the firm's own records) — quick and cheap, but may not fit; <strong>primary data</strong> are collected for the current purpose — relevant, but costly</td></tr>
<tr><td>Approach</td><td><strong>Observation</strong> (watch behaviour, including online behaviour), <strong>surveys</strong> (descriptive information), <strong>experiments</strong> (causal relationships)</td></tr>
<tr><td>Contact method</td><td>Online, telephone, personal interviews, focus groups</td></tr>
<tr><td>Sampling</td><td>Who is surveyed (sampling unit), how many (sample size), how chosen — probability samples allow estimates of sampling error</td></tr>
</table>
<h3>Writing questions that work</h3>
<ul>
<li>Avoid <strong>leading</strong> questions: "Don't you agree our new flavour is delicious?"</li>
<li>Avoid <strong>double-barrelled</strong> questions: "Is our app fast and easy to use?" — two questions in one.</li>
<li>Use clear, neutral wording and answer scales that cover all options.</li>
</ul>
<div class="callout"><span class="badge">Ethics</span> Respect privacy: tell respondents how their data will be used, collect only what you need and keep it secure.</div>`,
    `<span class="eyebrow">MKT101 · Phần 1 · Bài 1.2</span>
<h2>Thông tin &amp; nghiên cứu marketing</h2>
<p>Quyết định tốt dựa trên <strong>insight khách hàng</strong> — những hiểu biết mới mẻ về nhu cầu và động cơ của khách hàng. Hệ thống thông tin marketing thu thập chúng từ dữ liệu nội bộ (doanh số, hồ sơ khách hàng), <strong>tình báo marketing</strong> (thông tin công khai về đối thủ và xu hướng) và <strong>nghiên cứu marketing</strong>.</p>
<h3>Quy trình nghiên cứu</h3>
<ol>
<li><strong>Xác định vấn đề và mục tiêu nghiên cứu</strong> — <em>khám phá</em> (thu thập thông tin sơ bộ), <em>mô tả</em> (mô tả ai mua, mua bao nhiêu), hoặc <em>nhân quả</em> (kiểm định quan hệ nhân quả, vd giảm giá 10% có làm tăng doanh số không?).</li>
<li><strong>Lập kế hoạch nghiên cứu</strong> — cần thông tin gì, lấy từ đâu, bằng cách nào.</li>
<li><strong>Thực hiện kế hoạch</strong> — thu thập và xử lý dữ liệu.</li>
<li><strong>Diễn giải và báo cáo kết quả</strong> — biến dữ liệu thành quyết định.</li>
</ol>
<h3>Dữ liệu và phương pháp</h3>
<table>
<tr><th>Lựa chọn</th><th>Các phương án</th></tr>
<tr><td>Loại dữ liệu</td><td><strong>Dữ liệu thứ cấp</strong> đã có sẵn, được thu thập cho mục đích khác (báo cáo, số liệu thống kê, hồ sơ của chính doanh nghiệp) — nhanh và rẻ nhưng có thể không phù hợp; <strong>dữ liệu sơ cấp</strong> được thu thập cho mục đích hiện tại — sát vấn đề nhưng tốn kém</td></tr>
<tr><td>Cách tiếp cận</td><td><strong>Quan sát</strong> (theo dõi hành vi, kể cả hành vi trực tuyến), <strong>khảo sát</strong> (thông tin mô tả), <strong>thực nghiệm</strong> (quan hệ nhân quả)</td></tr>
<tr><td>Phương thức tiếp xúc</td><td>Trực tuyến, điện thoại, phỏng vấn trực tiếp, thảo luận nhóm tập trung</td></tr>
<tr><td>Chọn mẫu</td><td>Khảo sát ai (đơn vị mẫu), bao nhiêu người (cỡ mẫu), chọn thế nào — mẫu xác suất cho phép ước lượng sai số chọn mẫu</td></tr>
</table>
<h3>Viết câu hỏi hiệu quả</h3>
<ul>
<li>Tránh câu hỏi <strong>dẫn dắt</strong>: "Bạn có đồng ý rằng hương vị mới của chúng tôi rất ngon không?"</li>
<li>Tránh câu hỏi <strong>kép</strong>: "Ứng dụng của chúng tôi có nhanh và dễ dùng không?" — hai câu hỏi trong một.</li>
<li>Dùng từ ngữ rõ ràng, trung lập và thang trả lời bao quát mọi lựa chọn.</li>
</ul>
<div class="callout"><span class="badge">Đạo đức</span> Tôn trọng quyền riêng tư: cho người trả lời biết dữ liệu sẽ được dùng thế nào, chỉ thu thập những gì cần và bảo mật dữ liệu.</div>`,
  ]]);

const c1q = quiz('mkt101-quiz-1', 'Quiz 1 — Strategy, environment & research|||Quiz 1 — Chiến lược, môi trường & nghiên cứu', [
  { id: 'q1', question: 'The marketing concept holds that achieving organizational goals depends on…|||Triết lý marketing cho rằng đạt được mục tiêu của tổ chức phụ thuộc vào…', options: ['producing at the lowest possible cost|||sản xuất với chi phí thấp nhất có thể', 'knowing target customers’ needs and delivering value better than competitors|||hiểu nhu cầu khách hàng mục tiêu và mang lại giá trị tốt hơn đối thủ', 'aggressive selling and promotion|||bán hàng và quảng bá quyết liệt', 'constantly adding product features|||liên tục thêm tính năng cho sản phẩm'], correctIndex: 1, explanation: 'The marketing concept starts from the customer; the other options describe the production, selling and product concepts.|||Triết lý marketing bắt đầu từ khách hàng; các phương án kia mô tả triết lý sản xuất, bán hàng và sản phẩm.' },
  { id: 'q2', question: 'Which of the following belongs to the MACROenvironment?|||Yếu tố nào thuộc môi trường VĨ MÔ?', options: ['The company’s suppliers|||Nhà cung cấp của doanh nghiệp', 'Competitors|||Đối thủ cạnh tranh', 'Population ageing and urbanization|||Già hoá dân số và đô thị hoá', 'Marketing intermediaries|||Trung gian marketing'], correctIndex: 2, explanation: 'Demographic trends are broad societal forces; suppliers, competitors and intermediaries are microenvironment actors.|||Xu hướng nhân khẩu học là lực lượng xã hội rộng lớn; nhà cung cấp, đối thủ, trung gian là tác nhân vi mô.' },
  { id: 'q3', question: 'Secondary data are…|||Dữ liệu thứ cấp là…', options: ['data collected specifically for the current study|||dữ liệu thu thập riêng cho nghiên cứu hiện tại', 'information that already exists, collected for another purpose|||thông tin đã có sẵn, được thu thập cho mục đích khác', 'always more accurate than primary data|||luôn chính xác hơn dữ liệu sơ cấp', 'only obtained from experiments|||chỉ có được từ thực nghiệm'], correctIndex: 1, explanation: 'Secondary data are quick and cheap but must be checked for relevance, accuracy and timeliness.|||Dữ liệu thứ cấp nhanh và rẻ nhưng phải kiểm tra tính phù hợp, chính xác và cập nhật.' },
]);

const c3 = doc('mkt101-2-1-consumer-behaviour', '2.1 — Consumer buyer behaviour|||2.1 — Hành vi người mua tiêu dùng',
  'Mô hình kích thích – phản ứng và "hộp đen" người mua, bốn nhóm yếu tố (văn hoá, xã hội, cá nhân, tâm lý), bốn kiểu hành vi mua, quy trình quyết định mua 5 bước và bất hoà sau mua, khác biệt của thị trường doanh nghiệp.',
  [[
    `<span class="eyebrow">MKT101 · Part 2 · Lesson 2.1</span>
<h2>Consumer buyer behaviour</h2>
<p>Marketing stimuli (the 4Ps) and other stimuli (economic, technological, social, cultural) enter the buyer's <strong>"black box"</strong> — their characteristics and decision process — and come out as responses: which product, brand, retailer, timing and amount.</p>
<h3>Four groups of factors</h3>
<table>
<tr><th>Group</th><th>Factors</th></tr>
<tr><td>Cultural</td><td>Culture (basic values), subcultures (regional, religious, generational), social class</td></tr>
<tr><td>Social</td><td>Reference groups and opinion leaders (including online influencers), family, roles and status</td></tr>
<tr><td>Personal</td><td>Age and life-cycle stage, occupation, economic situation, lifestyle, personality and self-concept</td></tr>
<tr><td>Psychological</td><td>Motivation (Maslow's needs), perception (selective attention, distortion, retention), learning, beliefs and attitudes</td></tr>
</table>
<h3>Four types of buying behaviour</h3>
<table>
<tr><th></th><th>High involvement</th><th>Low involvement</th></tr>
<tr><td><strong>Big differences between brands</strong></td><td>Complex buying (a laptop, a motorbike)</td><td>Variety-seeking (snacks, soft drinks)</td></tr>
<tr><td><strong>Few differences</strong></td><td>Dissonance-reducing (tiles, a mattress)</td><td>Habitual (salt, fish sauce, detergent)</td></tr>
</table>
<h3>The buyer decision process</h3>
<ol>
<li><strong>Need recognition</strong> — an internal or external trigger.</li>
<li><strong>Information search</strong> — personal, commercial, public and experiential sources; reviews and social media matter more and more.</li>
<li><strong>Evaluation of alternatives</strong> — comparing brands on the attributes the buyer cares about.</li>
<li><strong>Purchase decision</strong> — can still be changed by others' attitudes or unexpected situations.</li>
<li><strong>Post-purchase behaviour</strong> — satisfaction or <strong>cognitive dissonance</strong> (post-purchase doubt); satisfied customers buy again and recommend.</li>
</ol>
<p><strong>Business markets</strong> differ: fewer but larger buyers, derived demand, more professional purchasing, buying centres with several people involved, and long-term relationships.</p>
<div class="callout"><span class="badge">Marketing implication</span> Each stage is a job for marketing: triggers for stage 1, visibility and reviews for stage 2, clear comparisons for stage 3, easy buying for stage 4, and follow-up care for stage 5.</div>`,
    `<span class="eyebrow">MKT101 · Phần 2 · Bài 2.1</span>
<h2>Hành vi người mua tiêu dùng</h2>
<p>Các kích thích marketing (4P) và kích thích khác (kinh tế, công nghệ, xã hội, văn hoá) đi vào <strong>"hộp đen"</strong> của người mua — đặc điểm và quy trình ra quyết định của họ — rồi đi ra thành phản ứng: chọn sản phẩm, thương hiệu, nơi mua, thời điểm và số lượng nào.</p>
<h3>Bốn nhóm yếu tố</h3>
<table>
<tr><th>Nhóm</th><th>Yếu tố</th></tr>
<tr><td>Văn hoá</td><td>Nền văn hoá (giá trị cơ bản), nhánh văn hoá (vùng miền, tôn giáo, thế hệ), tầng lớp xã hội</td></tr>
<tr><td>Xã hội</td><td>Nhóm tham khảo và người dẫn dắt dư luận (kể cả người có ảnh hưởng trên mạng), gia đình, vai trò và địa vị</td></tr>
<tr><td>Cá nhân</td><td>Tuổi và giai đoạn trong vòng đời, nghề nghiệp, hoàn cảnh kinh tế, lối sống, cá tính và quan niệm về bản thân</td></tr>
<tr><td>Tâm lý</td><td>Động cơ (các nhu cầu của Maslow), nhận thức (chú ý, bóp méo, ghi nhớ có chọn lọc), học hỏi, niềm tin và thái độ</td></tr>
</table>
<h3>Bốn kiểu hành vi mua</h3>
<table>
<tr><th></th><th>Mức độ quan tâm cao</th><th>Mức độ quan tâm thấp</th></tr>
<tr><td><strong>Các thương hiệu khác nhau nhiều</strong></td><td>Mua phức tạp (máy tính xách tay, xe máy)</td><td>Mua tìm kiếm sự đa dạng (đồ ăn vặt, nước ngọt)</td></tr>
<tr><td><strong>Ít khác biệt</strong></td><td>Mua giảm bất hoà (gạch lát, nệm)</td><td>Mua theo thói quen (muối, nước mắm, bột giặt)</td></tr>
</table>
<h3>Quy trình quyết định mua</h3>
<ol>
<li><strong>Nhận biết nhu cầu</strong> — do tác nhân bên trong hoặc bên ngoài.</li>
<li><strong>Tìm kiếm thông tin</strong> — nguồn cá nhân, thương mại, công cộng và kinh nghiệm; đánh giá của người dùng và mạng xã hội ngày càng quan trọng.</li>
<li><strong>Đánh giá các phương án</strong> — so sánh thương hiệu theo những thuộc tính người mua quan tâm.</li>
<li><strong>Quyết định mua</strong> — vẫn có thể thay đổi vì thái độ của người khác hoặc tình huống bất ngờ.</li>
<li><strong>Hành vi sau mua</strong> — hài lòng hoặc <strong>bất hoà nhận thức</strong> (băn khoăn sau khi mua); khách hài lòng sẽ mua lại và giới thiệu cho người khác.</li>
</ol>
<p><strong>Thị trường doanh nghiệp</strong> khác biệt: ít người mua nhưng mua lớn, cầu phát sinh, mua hàng chuyên nghiệp hơn, trung tâm mua có nhiều người tham gia, và quan hệ dài hạn.</p>
<div class="callout"><span class="badge">Hàm ý marketing</span> Mỗi giai đoạn là một việc của marketing: tạo tác nhân cho giai đoạn 1, hiện diện và đánh giá tốt cho giai đoạn 2, so sánh rõ ràng cho giai đoạn 3, mua dễ dàng cho giai đoạn 4, và chăm sóc sau bán cho giai đoạn 5.</div>`,
  ]]);

const c4 = doc('mkt101-2-2-stp', '2.2 — Segmentation, targeting & positioning (STP)|||2.2 — Phân khúc, chọn thị trường mục tiêu & định vị (STP)',
  'Bốn cơ sở phân khúc thị trường tiêu dùng, năm yêu cầu của phân khúc hiệu quả, đánh giá phân khúc và bốn chiến lược chọn thị trường mục tiêu, khác biệt hoá, tuyên bố giá trị và câu định vị, bản đồ nhận thức.',
  [[
    `<span class="eyebrow">MKT101 · Part 2 · Lesson 2.2</span>
<h2>Segmentation, targeting &amp; positioning (STP)</h2>
<h3>1. Segmentation</h3>
<table>
<tr><th>Basis</th><th>Variables</th></tr>
<tr><td>Geographic</td><td>Region, city size, urban/rural, climate</td></tr>
<tr><td>Demographic</td><td>Age, life-cycle stage, gender, income, occupation, education</td></tr>
<tr><td>Psychographic</td><td>Lifestyle, personality, social class, values</td></tr>
<tr><td>Behavioural</td><td>Occasions, benefits sought, user status, usage rate, loyalty</td></tr>
</table>
<p>Useful segments are <strong>measurable</strong>, <strong>accessible</strong>, <strong>substantial</strong> (large or profitable enough), <strong>differentiable</strong> (respond differently to marketing) and <strong>actionable</strong> (the firm can design programmes for them).</p>
<h3>2. Targeting</h3>
<p>Evaluate each segment's size and growth, its structural attractiveness (competitors, substitutes, buyer and supplier power) and its fit with the company's objectives and resources. Then choose a coverage strategy:</p>
<table>
<tr><th>Strategy</th><th>Meaning</th></tr>
<tr><td>Undifferentiated (mass)</td><td>One offer for the whole market</td></tr>
<tr><td>Differentiated (segmented)</td><td>Separate offers for several segments</td></tr>
<tr><td>Concentrated (niche)</td><td>A large share of one or a few small segments — ideal for firms with limited resources</td></tr>
<tr><td>Micromarketing</td><td>Tailoring to local areas or even individuals</td></tr>
</table>
<h3>3. Differentiation and positioning</h3>
<p>A brand's <strong>position</strong> is the place it occupies in consumers' minds relative to competitors. Differentiate through the product, services, channels, people or image, and choose a <strong>value proposition</strong> — for example "more for more" (premium), "the same for less" or "more for less". A <strong>perceptual map</strong> plots brands on two attributes buyers care about (e.g. price and convenience) to spot empty spaces. A positioning statement follows a simple form:</p>
<pre><code>To (target segment and need), our (brand) is (the category)
that (the point of difference).</code></pre>
<div class="callout"><span class="badge">Order matters</span> Decide whom you serve before deciding what to say. A positioning without a clear target speaks to everyone and convinces no one.</div>`,
    `<span class="eyebrow">MKT101 · Phần 2 · Bài 2.2</span>
<h2>Phân khúc, chọn thị trường mục tiêu &amp; định vị (STP)</h2>
<h3>1. Phân khúc thị trường</h3>
<table>
<tr><th>Cơ sở</th><th>Biến số</th></tr>
<tr><td>Địa lý</td><td>Vùng miền, quy mô thành phố, thành thị/nông thôn, khí hậu</td></tr>
<tr><td>Nhân khẩu học</td><td>Tuổi, giai đoạn vòng đời, giới tính, thu nhập, nghề nghiệp, học vấn</td></tr>
<tr><td>Tâm lý</td><td>Lối sống, cá tính, tầng lớp xã hội, giá trị</td></tr>
<tr><td>Hành vi</td><td>Dịp mua, lợi ích tìm kiếm, tình trạng sử dụng, mức độ sử dụng, lòng trung thành</td></tr>
</table>
<p>Phân khúc hữu ích phải <strong>đo lường được</strong>, <strong>tiếp cận được</strong>, <strong>đủ lớn</strong> (đủ quy mô hoặc đủ lợi nhuận), <strong>phân biệt được</strong> (phản ứng khác nhau với marketing) và <strong>hành động được</strong> (doanh nghiệp thiết kế được chương trình cho họ).</p>
<h3>2. Chọn thị trường mục tiêu</h3>
<p>Đánh giá quy mô và tốc độ tăng trưởng của từng phân khúc, sức hấp dẫn về cấu trúc (đối thủ, sản phẩm thay thế, quyền lực người mua và nhà cung cấp) và mức phù hợp với mục tiêu, nguồn lực của doanh nghiệp. Sau đó chọn chiến lược bao phủ:</p>
<table>
<tr><th>Chiến lược</th><th>Ý nghĩa</th></tr>
<tr><td>Không phân biệt (đại trà)</td><td>Một sản phẩm chào bán cho toàn thị trường</td></tr>
<tr><td>Phân biệt (theo phân khúc)</td><td>Các sản phẩm chào bán riêng cho nhiều phân khúc</td></tr>
<tr><td>Tập trung (thị trường ngách)</td><td>Chiếm thị phần lớn ở một hoặc vài phân khúc nhỏ — lý tưởng cho doanh nghiệp ít nguồn lực</td></tr>
<tr><td>Marketing vi mô</td><td>Điều chỉnh theo từng địa phương, thậm chí từng cá nhân</td></tr>
</table>
<h3>3. Khác biệt hoá và định vị</h3>
<p><strong>Vị thế</strong> của một thương hiệu là chỗ nó chiếm trong tâm trí người tiêu dùng so với đối thủ. Khác biệt hoá qua sản phẩm, dịch vụ, kênh phân phối, con người hoặc hình ảnh, và chọn một <strong>tuyên bố giá trị</strong> — ví dụ "nhiều hơn với giá cao hơn" (cao cấp), "như nhau với giá thấp hơn" hay "nhiều hơn với giá thấp hơn". <strong>Bản đồ nhận thức</strong> đặt các thương hiệu lên hai thuộc tính người mua quan tâm (vd giá và sự tiện lợi) để tìm khoảng trống. Câu định vị theo một khuôn đơn giản:</p>
<pre><code>Với (phân khúc mục tiêu và nhu cầu), (thương hiệu) của chúng tôi là (loại sản phẩm)
mang lại (điểm khác biệt).</code></pre>
<div class="callout"><span class="badge">Thứ tự quan trọng</span> Quyết định phục vụ ai trước khi quyết định nói gì. Một định vị không có khách hàng mục tiêu rõ ràng là nói với tất cả mà không thuyết phục được ai.</div>`,
  ]]);

const c4e = doc('mkt101-2-3-exercise', 'Exercise 1 — STP for a new cold-brew coffee brand|||Bài tập 1 — STP cho một thương hiệu cà phê ủ lạnh mới',
  'Bài tập tình huống giả định: chấm điểm bốn phân khúc bằng tiêu chí có trọng số, chọn chiến lược thị trường mục tiêu, viết câu định vị và suy ra hàm ý cho 4P; kèm lời giải.',
  [[
    `<span class="eyebrow">MKT101 · Part 2 · Exercise</span>
<h2>Exercise 1 — choosing whom to serve</h2>
<div class="callout"><span class="badge">Problem</span> A start-up (a fictional case) plans a bottled cold-brew coffee sold in big cities. It has identified four segments and scored them from 1 to 5 on segment size and growth (weight 0.4), low competitive intensity (0.3) and fit with its resources (0.3): office workers aged 25–35 — 5, 3, 5; university students — 4, 2, 3; health-conscious buyers who want less sugar — 3, 4, 4; specialty-coffee enthusiasts — 2, 3, 2. (a) Score the segments. (b) Recommend a targeting strategy. (c) Write a positioning statement. (d) Give one implication for each P.</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) Office workers  = 0.4x5 + 0.3x3 + 0.3x5 = 2.0 + 0.9 + 1.5 = 4.4   <- first
    Students        = 0.4x4 + 0.3x2 + 0.3x3 = 1.6 + 0.6 + 0.9 = 3.1
    Health-conscious= 0.4x3 + 0.3x4 + 0.3x4 = 1.2 + 1.2 + 1.2 = 3.6   <- second
    Specialty fans  = 0.4x2 + 0.3x3 + 0.3x2 = 0.8 + 0.9 + 0.6 = 2.3

(b) Concentrated strategy on office workers first (limited resources),
    with a possible later extension to health-conscious buyers.

(c) "To busy young office workers who want a quality coffee boost without queuing,
    [Brand] is the ready-to-drink cold brew that tastes café-fresh and less sweet
    than typical canned coffee."</code></pre>
<table>
<tr><th>P</th><th>Implication</th></tr>
<tr><td>Product</td><td>Consistent café-quality taste, reduced sugar, a bottle that fits a bag</td></tr>
<tr><td>Price</td><td>Above canned coffee, below a café cup — "more for the same" versus a café</td></tr>
<tr><td>Place</td><td>Convenience stores near offices, office-delivery apps, corporate pantries</td></tr>
<tr><td>Promotion</td><td>Morning-commute messages, sampling in office buildings, workplace social media</td></tr>
</table>
<p><strong>Why:</strong> the office segment is large, fits the company's resources and is only moderately contested. A small firm spreading itself across all four segments would be outspent everywhere; concentrating lets it build a clear position first.</p>`,
    `<span class="eyebrow">MKT101 · Phần 2 · Bài tập</span>
<h2>Bài tập 1 — chọn khách hàng để phục vụ</h2>
<div class="callout"><span class="badge">Đề</span> Một doanh nghiệp khởi nghiệp (tình huống giả định) dự định bán cà phê ủ lạnh đóng chai ở các thành phố lớn. Doanh nghiệp xác định bốn phân khúc và chấm điểm từ 1 đến 5 theo quy mô và tăng trưởng (trọng số 0,4), mức cạnh tranh thấp (0,3) và mức phù hợp với nguồn lực (0,3): nhân viên văn phòng 25–35 tuổi — 5, 3, 5; sinh viên đại học — 4, 2, 3; người quan tâm sức khoẻ muốn ít đường — 3, 4, 4; người mê cà phê đặc sản — 2, 3, 2. (a) Tính điểm các phân khúc. (b) Đề xuất chiến lược chọn thị trường mục tiêu. (c) Viết câu định vị. (d) Nêu một hàm ý cho mỗi chữ P.</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) Nhân viên văn phòng = 0,4x5 + 0,3x3 + 0,3x5 = 2,0 + 0,9 + 1,5 = 4,4   <- thứ nhất
    Sinh viên           = 0,4x4 + 0,3x2 + 0,3x3 = 1,6 + 0,6 + 0,9 = 3,1
    Quan tâm sức khoẻ   = 0,4x3 + 0,3x4 + 0,3x4 = 1,2 + 1,2 + 1,2 = 3,6   <- thứ hai
    Mê cà phê đặc sản   = 0,4x2 + 0,3x3 + 0,3x2 = 0,8 + 0,9 + 0,6 = 2,3

(b) Chiến lược tập trung vào nhân viên văn phòng trước (nguồn lực có hạn),
    có thể mở rộng sau sang nhóm quan tâm sức khoẻ.

(c) "Với những nhân viên văn phòng trẻ, bận rộn, muốn một ly cà phê chất lượng mà không phải
    xếp hàng, [Thương hiệu] là cà phê ủ lạnh uống liền có vị tươi như ở quán và ít ngọt hơn
    cà phê lon thông thường."</code></pre>
<table>
<tr><th>P</th><th>Hàm ý</th></tr>
<tr><td>Sản phẩm</td><td>Vị ổn định chuẩn quán, giảm đường, chai vừa túi xách</td></tr>
<tr><td>Giá</td><td>Cao hơn cà phê lon, thấp hơn một ly ở quán — "nhiều hơn với giá như nhau" so với quán</td></tr>
<tr><td>Phân phối</td><td>Cửa hàng tiện lợi gần văn phòng, ứng dụng giao hàng tới văn phòng, pantry doanh nghiệp</td></tr>
<tr><td>Xúc tiến</td><td>Thông điệp giờ đi làm buổi sáng, phát mẫu thử ở toà nhà văn phòng, mạng xã hội dân công sở</td></tr>
</table>
<p><strong>Vì sao:</strong> phân khúc văn phòng lớn, hợp nguồn lực của doanh nghiệp và cạnh tranh ở mức vừa phải. Một doanh nghiệp nhỏ dàn trải cả bốn phân khúc sẽ bị đối thủ vượt ngân sách ở mọi nơi; tập trung giúp nó xây một vị thế rõ ràng trước.</p>`,
  ]]);

const c4q = quiz('mkt101-quiz-2', 'Quiz 2 — Customers & STP|||Quiz 2 — Khách hàng & STP', [
  { id: 'q1', question: 'What is the correct order of the buyer decision process?|||Thứ tự đúng của quy trình quyết định mua là?', options: ['Search → need → purchase → evaluation → post-purchase|||Tìm kiếm → nhu cầu → mua → đánh giá → sau mua', 'Need recognition → information search → evaluation → purchase → post-purchase|||Nhận biết nhu cầu → tìm thông tin → đánh giá → mua → sau mua', 'Evaluation → need → search → purchase → post-purchase|||Đánh giá → nhu cầu → tìm kiếm → mua → sau mua', 'Purchase → need → search → evaluation → post-purchase|||Mua → nhu cầu → tìm kiếm → đánh giá → sau mua'], correctIndex: 1, explanation: 'The process starts with a need and continues after the purchase, when satisfaction or dissonance appears.|||Quy trình bắt đầu từ nhu cầu và tiếp tục sau khi mua, khi xuất hiện sự hài lòng hoặc bất hoà.' },
  { id: 'q2', question: 'Dividing a market by lifestyle, values and personality is…|||Chia thị trường theo lối sống, giá trị và cá tính là…', options: ['geographic segmentation|||phân khúc theo địa lý', 'demographic segmentation|||phân khúc theo nhân khẩu học', 'psychographic segmentation|||phân khúc theo tâm lý', 'behavioural segmentation|||phân khúc theo hành vi'], correctIndex: 2, explanation: 'Psychographic variables describe how people live and think; behavioural variables describe how they use and buy.|||Biến tâm lý mô tả cách người ta sống và nghĩ; biến hành vi mô tả cách họ dùng và mua.' },
  { id: 'q3', question: 'A small firm that focuses on winning a large share of one niche segment uses…|||Doanh nghiệp nhỏ tập trung giành thị phần lớn ở một phân khúc ngách đang dùng…', options: ['undifferentiated marketing|||marketing không phân biệt', 'differentiated marketing|||marketing phân biệt', 'concentrated marketing|||marketing tập trung', 'mass marketing|||marketing đại trà'], correctIndex: 2, explanation: 'Concentrated (niche) marketing suits limited resources, at the risk of depending on one segment.|||Marketing tập trung (ngách) hợp với nguồn lực hạn chế, đổi lại rủi ro phụ thuộc một phân khúc.' },
]);

const c5 = doc('mkt101-3-1-product-brand', '3.1 — Products, services, brands & the product life cycle|||3.1 — Sản phẩm, dịch vụ, thương hiệu & vòng đời sản phẩm',
  'Ba cấp độ sản phẩm, phân loại hàng tiêu dùng, bốn đặc tính của dịch vụ, quyết định về thương hiệu và bốn chiến lược phát triển thương hiệu, quy trình phát triển sản phẩm mới 8 bước, chu kỳ sống sản phẩm và chiến lược từng giai đoạn.',
  [[
    `<span class="eyebrow">MKT101 · Part 3 · Lesson 3.1</span>
<h2>Products, services, brands &amp; the product life cycle</h2>
<h3>Three levels of a product</h3>
<ul>
<li><strong>Core customer value</strong> — the problem solved or benefit bought (a phone buyer buys connection and convenience).</li>
<li><strong>Actual product</strong> — features, design, quality level, brand name and packaging.</li>
<li><strong>Augmented product</strong> — extra services and benefits: warranty, delivery, installation, after-sales support.</li>
</ul>
<p>Consumer products are <strong>convenience</strong> (bought often with little effort), <strong>shopping</strong> (compared on quality and price), <strong>specialty</strong> (unique, strong preference) or <strong>unsought</strong> products (not actively sought, e.g. insurance). Services have four special characteristics: <strong>intangibility</strong>, <strong>inseparability</strong> (produced and consumed together), <strong>variability</strong> (quality depends on who, when, where) and <strong>perishability</strong> (cannot be stored).</p>
<h3>Brands</h3>
<p>A brand's value to the company is its <strong>brand equity</strong> — the differential effect that knowing the brand name has on customer response. Brand development has four options:</p>
<table>
<tr><th></th><th>Existing product category</th><th>New product category</th></tr>
<tr><td><strong>Existing brand name</strong></td><td>Line extension (a new flavour)</td><td>Brand extension (the brand enters a new category)</td></tr>
<tr><td><strong>New brand name</strong></td><td>Multibrands (several brands in one category)</td><td>New brand</td></tr>
</table>
<h3>New product development</h3>
<p>Idea generation → idea screening → concept development and testing → marketing strategy → business analysis → product development → test marketing → commercialization. Most ideas are dropped along the way; the early, cheap stages exist to kill weak ideas before they become expensive.</p>
<h3>The product life cycle</h3>
<table>
<tr><th>Stage</th><th>Sales and profit</th><th>Typical strategy</th></tr>
<tr><td>Introduction</td><td>Slow sales, losses</td><td>Build awareness and trial; limited range</td></tr>
<tr><td>Growth</td><td>Rapid sales growth, rising profit</td><td>Improve quality, add features, enter new segments and channels</td></tr>
<tr><td>Maturity</td><td>Sales growth slows; competition is most intense</td><td>Modify the market, the product or the marketing mix</td></tr>
<tr><td>Decline</td><td>Falling sales</td><td>Maintain, harvest or drop the product</td></tr>
</table>
<div class="callout"><span class="badge">Remember</span> The augmented level is often where competition happens today: when core features converge, service and experience make the difference.</div>`,
    `<span class="eyebrow">MKT101 · Phần 3 · Bài 3.1</span>
<h2>Sản phẩm, dịch vụ, thương hiệu &amp; vòng đời sản phẩm</h2>
<h3>Ba cấp độ của sản phẩm</h3>
<ul>
<li><strong>Giá trị cốt lõi cho khách hàng</strong> — vấn đề được giải quyết hay lợi ích được mua (người mua điện thoại mua sự kết nối và tiện lợi).</li>
<li><strong>Sản phẩm cụ thể</strong> — tính năng, thiết kế, mức chất lượng, tên thương hiệu và bao bì.</li>
<li><strong>Sản phẩm bổ sung</strong> — dịch vụ và lợi ích thêm: bảo hành, giao hàng, lắp đặt, hỗ trợ sau bán.</li>
</ul>
<p>Hàng tiêu dùng gồm hàng <strong>tiện lợi</strong> (mua thường xuyên, ít công sức), hàng <strong>mua có so sánh</strong> (so sánh chất lượng và giá), hàng <strong>đặc biệt</strong> (độc đáo, được ưa chuộng mạnh) và hàng <strong>không được tìm kiếm</strong> (không chủ động tìm mua, vd bảo hiểm). Dịch vụ có bốn đặc tính riêng: <strong>vô hình</strong>, <strong>không tách rời</strong> (sản xuất và tiêu dùng đồng thời), <strong>không đồng nhất</strong> (chất lượng tuỳ ai làm, khi nào, ở đâu) và <strong>không lưu trữ được</strong>.</p>
<h3>Thương hiệu</h3>
<p>Giá trị của thương hiệu với doanh nghiệp là <strong>tài sản thương hiệu</strong> — tác động khác biệt mà việc biết tên thương hiệu tạo ra lên phản ứng của khách hàng. Phát triển thương hiệu có bốn hướng:</p>
<table>
<tr><th></th><th>Loại sản phẩm hiện có</th><th>Loại sản phẩm mới</th></tr>
<tr><td><strong>Tên thương hiệu hiện có</strong></td><td>Mở rộng dòng (một hương vị mới)</td><td>Mở rộng thương hiệu (thương hiệu bước sang loại sản phẩm mới)</td></tr>
<tr><td><strong>Tên thương hiệu mới</strong></td><td>Đa thương hiệu (nhiều thương hiệu trong một loại)</td><td>Thương hiệu mới</td></tr>
</table>
<h3>Phát triển sản phẩm mới</h3>
<p>Hình thành ý tưởng → sàng lọc ý tưởng → phát triển và thử nghiệm khái niệm → chiến lược marketing → phân tích kinh doanh → phát triển sản phẩm → thử nghiệm thị trường → thương mại hoá. Phần lớn ý tưởng bị loại dọc đường; các bước đầu, rẻ tiền, tồn tại để loại ý tưởng yếu trước khi chúng trở nên tốn kém.</p>
<h3>Chu kỳ sống của sản phẩm</h3>
<table>
<tr><th>Giai đoạn</th><th>Doanh số và lợi nhuận</th><th>Chiến lược điển hình</th></tr>
<tr><td>Giới thiệu</td><td>Doanh số chậm, thua lỗ</td><td>Tạo nhận biết và dùng thử; ít mẫu mã</td></tr>
<tr><td>Tăng trưởng</td><td>Doanh số tăng nhanh, lợi nhuận tăng</td><td>Nâng chất lượng, thêm tính năng, vào phân khúc và kênh mới</td></tr>
<tr><td>Bão hoà</td><td>Doanh số tăng chậm lại; cạnh tranh gay gắt nhất</td><td>Điều chỉnh thị trường, sản phẩm hoặc marketing mix</td></tr>
<tr><td>Suy thoái</td><td>Doanh số giảm</td><td>Duy trì, thu hoạch hoặc loại bỏ sản phẩm</td></tr>
</table>
<div class="callout"><span class="badge">Ghi nhớ</span> Ngày nay cạnh tranh thường diễn ra ở cấp sản phẩm bổ sung: khi tính năng cốt lõi ngày càng giống nhau, dịch vụ và trải nghiệm tạo ra khác biệt.</div>`,
  ]]);

const c6 = doc('mkt101-3-2-pricing', '3.2 — Pricing: understanding and capturing customer value|||3.2 — Định giá: hiểu và thu về giá trị khách hàng',
  'Ba chiến lược định giá chính (theo giá trị khách hàng, theo chi phí, theo cạnh tranh), định giá cộng lãi và phân tích hoà vốn, các yếu tố ảnh hưởng, định giá hớt váng và thâm nhập, định giá theo danh mục sản phẩm, các cách điều chỉnh giá.',
  [[
    `<span class="eyebrow">MKT101 · Part 3 · Lesson 3.2</span>
<h2>Pricing: understanding and capturing customer value</h2>
<p>Price is the only element of the marketing mix that produces revenue; all the others are costs. The price must sit between a <strong>ceiling</strong> set by customers' perceived value and a <strong>floor</strong> set by the product's costs, with competitors' prices in between as a reference.</p>
<h3>Three major strategies</h3>
<table>
<tr><th>Strategy</th><th>Logic</th></tr>
<tr><td>Customer value-based</td><td>Start from what customers value, then design a product and cost structure to deliver it — <em>good-value</em> pricing (quality at a fair price) or <em>value-added</em> pricing (add features to justify higher prices)</td></tr>
<tr><td>Cost-based</td><td>Add a standard markup to cost, or find the price or volume needed to break even or reach a target profit</td></tr>
<tr><td>Competition-based</td><td>Set prices relative to competitors' strategies, prices, costs and offers</td></tr>
</table>
<pre><code>Unit cost        = variable cost + fixed cost / expected unit sales
Markup price     = unit cost / (1 − desired return on sales)
Break-even units = fixed cost / (price − variable cost)
Units for a target profit = (fixed cost + target profit) / (price − variable cost)</code></pre>
<p>Other factors: the overall marketing strategy and objectives, the rest of the marketing mix, the nature of the market (price elasticity of demand — how strongly quantity responds to price), the economy and resellers' needs.</p>
<h3>Pricing strategies</h3>
<ul>
<li><strong>New products:</strong> <em>market-skimming</em> (a high initial price for buyers who value novelty, then lower over time) or <em>market-penetration</em> (a low price to win share fast, when the market is price-sensitive and costs fall with volume).</li>
<li><strong>Product mix:</strong> product-line pricing (price steps between models), optional-product, captive-product (razors and blades, printers and ink), by-product and bundle pricing.</li>
<li><strong>Price adjustments:</strong> discounts and allowances, segmented pricing (student prices), psychological pricing (99,000 instead of 100,000), promotional pricing, geographical pricing, dynamic and personalized pricing online, and international pricing.</li>
</ul>
<div class="callout"><span class="badge">Warning</span> Cost-plus pricing is simple but ignores demand and competitors: a price that "covers costs" may be one that nobody wants to pay.</div>`,
    `<span class="eyebrow">MKT101 · Phần 3 · Bài 3.2</span>
<h2>Định giá: hiểu và thu về giá trị khách hàng</h2>
<p>Giá là yếu tố duy nhất của marketing mix tạo ra doanh thu; mọi yếu tố khác đều là chi phí. Giá phải nằm giữa một <strong>mức trần</strong> do giá trị khách hàng cảm nhận quyết định và một <strong>mức sàn</strong> do chi phí sản phẩm quyết định, với giá của đối thủ làm mốc tham chiếu ở giữa.</p>
<h3>Ba chiến lược chính</h3>
<table>
<tr><th>Chiến lược</th><th>Logic</th></tr>
<tr><td>Theo giá trị khách hàng</td><td>Bắt đầu từ điều khách hàng coi trọng, rồi thiết kế sản phẩm và cơ cấu chi phí để đáp ứng — định giá <em>giá trị tốt</em> (chất lượng với giá hợp lý) hoặc định giá <em>giá trị gia tăng</em> (thêm tính năng để biện minh cho giá cao hơn)</td></tr>
<tr><td>Theo chi phí</td><td>Cộng một tỷ lệ lãi chuẩn vào chi phí, hoặc tìm giá hay sản lượng cần để hoà vốn hoặc đạt lợi nhuận mục tiêu</td></tr>
<tr><td>Theo cạnh tranh</td><td>Đặt giá dựa trên chiến lược, giá, chi phí và sản phẩm của đối thủ</td></tr>
</table>
<pre><code>Chi phí đơn vị      = chi phí biến đổi + chi phí cố định / sản lượng bán dự kiến
Giá cộng lãi        = chi phí đơn vị / (1 − tỷ suất lợi nhuận mong muốn trên doanh thu)
Sản lượng hoà vốn   = chi phí cố định / (giá − chi phí biến đổi)
Sản lượng cho lợi nhuận mục tiêu = (chi phí cố định + lợi nhuận mục tiêu) / (giá − chi phí biến đổi)</code></pre>
<p>Các yếu tố khác: chiến lược và mục tiêu marketing tổng thể, các yếu tố còn lại của marketing mix, bản chất thị trường (độ co giãn của cầu theo giá — lượng phản ứng mạnh tới đâu khi giá đổi), nền kinh tế và nhu cầu của người bán lại.</p>
<h3>Các chiến lược giá</h3>
<ul>
<li><strong>Sản phẩm mới:</strong> <em>hớt váng thị trường</em> (giá khởi điểm cao cho người mua coi trọng sự mới lạ, rồi giảm dần) hoặc <em>thâm nhập thị trường</em> (giá thấp để giành thị phần nhanh, khi thị trường nhạy cảm về giá và chi phí giảm theo quy mô).</li>
<li><strong>Danh mục sản phẩm:</strong> định giá dòng sản phẩm (các bậc giá giữa các mẫu), sản phẩm tuỳ chọn, sản phẩm bắt buộc đi kèm (dao cạo và lưỡi, máy in và mực), phụ phẩm và định giá trọn gói.</li>
<li><strong>Điều chỉnh giá:</strong> chiết khấu và trợ giá, định giá phân khúc (giá sinh viên), định giá tâm lý (99.000 thay vì 100.000), định giá khuyến mại, định giá theo địa lý, định giá linh hoạt và cá nhân hoá trực tuyến, và định giá quốc tế.</li>
</ul>
<div class="callout"><span class="badge">Cảnh báo</span> Định giá cộng lãi đơn giản nhưng bỏ qua cầu và đối thủ: một mức giá "bù được chi phí" có thể là mức giá không ai muốn trả.</div>`,
  ]]);

const c6e = doc('mkt101-3-3-exercise', 'Exercise 2 — markup and break-even pricing|||Bài tập 2 — định giá cộng lãi và hoà vốn',
  'Bài tập: bình nước giữ nhiệt với chi phí cố định 300 triệu, biến phí 60.000 đồng/chiếc — tính chi phí đơn vị, giá cộng lãi 25%, sản lượng hoà vốn, sản lượng cho lợi nhuận mục tiêu và nhận xét khi đối thủ bán 90.000 đồng; kèm lời giải.',
  [[
    `<span class="eyebrow">MKT101 · Part 3 · Exercise</span>
<h2>Exercise 2 — pricing an insulated water bottle</h2>
<div class="callout"><span class="badge">Problem</span> A company (a fictional case) makes an insulated water bottle. Fixed costs are VND 300,000,000 a year, variable cost is VND 60,000 per bottle and it expects to sell 20,000 bottles. (a) Compute the unit cost. (b) Find the price that gives a 25% markup on the selling price. (c) At that price, how many bottles must it sell to break even? (d) How many to earn a profit of VND 200,000,000? (e) Competitors sell similar bottles at VND 90,000. What should the company consider?</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) Unit cost = 60,000 + 300,000,000 / 20,000 = 60,000 + 15,000 = 75,000

(b) Markup price = 75,000 / (1 − 0.25) = 75,000 / 0.75 = 100,000
    (check: 25% of 100,000 = 25,000 = 100,000 − 75,000 ✓)

(c) Contribution per bottle = 100,000 − 60,000 = 40,000
    Break-even volume = 300,000,000 / 40,000 = 7,500 bottles

(d) Volume for the target profit = (300,000,000 + 200,000,000) / 40,000 = 12,500 bottles</code></pre>
<p><strong>(e)</strong> The cost-plus price (100,000) is 10,000 above competitors. The company should ask whether customers see enough extra value — better insulation, design, warranty — to pay more (value-based pricing). If not, a price of 90,000 still leaves a contribution of 30,000 per bottle, but the break-even volume rises to 300,000,000 / 30,000 = 10,000 bottles. Pricing is therefore a strategic decision, not just arithmetic on costs.</p>`,
    `<span class="eyebrow">MKT101 · Phần 3 · Bài tập</span>
<h2>Bài tập 2 — định giá bình nước giữ nhiệt</h2>
<div class="callout"><span class="badge">Đề</span> Một công ty (tình huống giả định) sản xuất bình nước giữ nhiệt. Chi phí cố định 300.000.000 đồng mỗi năm, chi phí biến đổi 60.000 đồng mỗi bình và dự kiến bán 20.000 bình. (a) Tính chi phí đơn vị. (b) Tìm giá bán để có tỷ lệ lãi 25% trên giá bán. (c) Với giá đó, phải bán bao nhiêu bình để hoà vốn? (d) Bao nhiêu bình để lãi 200.000.000 đồng? (e) Đối thủ bán bình tương tự giá 90.000 đồng. Công ty nên cân nhắc gì?</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) Chi phí đơn vị = 60.000 + 300.000.000 / 20.000 = 60.000 + 15.000 = 75.000

(b) Giá cộng lãi = 75.000 / (1 − 0,25) = 75.000 / 0,75 = 100.000
    (kiểm tra: 25% của 100.000 = 25.000 = 100.000 − 75.000 ✓)

(c) Số dư đảm phí mỗi bình = 100.000 − 60.000 = 40.000
    Sản lượng hoà vốn = 300.000.000 / 40.000 = 7.500 bình

(d) Sản lượng cho lợi nhuận mục tiêu = (300.000.000 + 200.000.000) / 40.000 = 12.500 bình</code></pre>
<p><strong>(e)</strong> Giá cộng lãi (100.000) cao hơn đối thủ 10.000 đồng. Công ty cần hỏi liệu khách hàng có thấy đủ giá trị tăng thêm — giữ nhiệt tốt hơn, thiết kế đẹp hơn, bảo hành — để trả nhiều hơn không (định giá theo giá trị). Nếu không, giá 90.000 vẫn còn số dư đảm phí 30.000 mỗi bình, nhưng sản lượng hoà vốn tăng lên 300.000.000 / 30.000 = 10.000 bình. Vì vậy định giá là quyết định chiến lược, không chỉ là phép tính trên chi phí.</p>`,
  ]]);

const c6q = quiz('mkt101-quiz-3', 'Quiz 3 — Product & price|||Quiz 3 — Sản phẩm & giá', [
  { id: 'q1', question: 'A warranty, free delivery and after-sales support belong to which product level?|||Bảo hành, giao hàng miễn phí và hỗ trợ sau bán thuộc cấp độ sản phẩm nào?', options: ['Core customer value|||Giá trị cốt lõi', 'Actual product|||Sản phẩm cụ thể', 'Augmented product|||Sản phẩm bổ sung', 'Unsought product|||Sản phẩm không được tìm kiếm'], correctIndex: 2, explanation: 'The augmented product adds services and benefits around the actual product.|||Sản phẩm bổ sung thêm dịch vụ và lợi ích bao quanh sản phẩm cụ thể.' },
  { id: 'q2', question: 'In which stage of the product life cycle does sales growth slow and competition become most intense?|||Ở giai đoạn nào của chu kỳ sống, doanh số tăng chậm lại và cạnh tranh gay gắt nhất?', options: ['Introduction|||Giới thiệu', 'Growth|||Tăng trưởng', 'Maturity|||Bão hoà', 'Decline|||Suy thoái'], correctIndex: 2, explanation: 'In maturity most buyers already own the product; firms fight for share by modifying the market, product or mix.|||Ở giai đoạn bão hoà phần lớn người mua đã có sản phẩm; doanh nghiệp giành thị phần bằng cách điều chỉnh thị trường, sản phẩm hoặc marketing mix.' },
  { id: 'q3', question: 'Fixed costs are 50 million, price is 25,000 and variable cost is 15,000 per unit. Break-even volume?|||Chi phí cố định 50 triệu, giá 25.000 và chi phí biến đổi 15.000 mỗi đơn vị. Sản lượng hoà vốn?', options: ['2,000 units|||2.000 đơn vị', '3,333 units|||3.333 đơn vị', '5,000 units|||5.000 đơn vị', '10,000 units|||10.000 đơn vị'], correctIndex: 2, explanation: '50,000,000 / (25,000 − 15,000) = 5,000 units.|||50.000.000 / (25.000 − 15.000) = 5.000 đơn vị.' },
]);

const c7 = doc('mkt101-4-1-channels', '4.1 — Marketing channels & logistics|||4.1 — Kênh phân phối & logistics',
  'Mạng lưới chuyển giao giá trị, vai trò của trung gian, số cấp kênh, xung đột kênh, hệ thống marketing dọc (tập đoàn, hợp đồng – nhượng quyền, được quản lý), hệ thống ngang và đa kênh, quyết định thiết kế kênh, bán lẻ, bán buôn và logistics.',
  [[
    `<span class="eyebrow">MKT101 · Part 4 · Lesson 4.1</span>
<h2>Marketing channels &amp; logistics</h2>
<p>A <strong>marketing channel</strong> is a set of interdependent organizations that help make a product available to consumers. Intermediaries add value because they reduce the number of transactions and perform key functions: information, promotion, contact, matching, negotiation, physical distribution, financing and risk taking.</p>
<h3>Channel levels</h3>
<pre><code>Direct (0 levels):  Manufacturer -> Consumer                        (brand website, own stores)
1 level:            Manufacturer -> Retailer -> Consumer
2 levels:           Manufacturer -> Wholesaler -> Retailer -> Consumer
3 levels:           Manufacturer -> Wholesaler -> Jobber -> Retailer -> Consumer</code></pre>
<h3>Channel behaviour and organization</h3>
<p>Members depend on each other, but <strong>channel conflict</strong> arises — horizontal (between firms at the same level) or vertical (between levels, e.g. a producer selling online below its dealers' prices). A <strong>vertical marketing system</strong> makes the channel act as one unit:</p>
<table>
<tr><th>Type</th><th>How it is coordinated</th></tr>
<tr><td>Corporate VMS</td><td>Common ownership of successive stages</td></tr>
<tr><td>Contractual VMS</td><td>Contracts, especially <strong>franchise</strong> organizations</td></tr>
<tr><td>Administered VMS</td><td>The size and power of one dominant member</td></tr>
</table>
<p>Firms also form <strong>horizontal</strong> alliances and run <strong>multichannel</strong> (omni-channel) systems that combine stores, e-commerce platforms and social commerce so customers can move smoothly between them. Channel design starts from customer needs (convenience, assortment, speed, service), then sets objectives, identifies alternatives and evaluates them on economic, control and adaptability criteria.</p>
<h3>Retailing, wholesaling and logistics</h3>
<p><strong>Retailers</strong> sell to final consumers (supermarkets, convenience stores, specialty stores, online retailers); <strong>wholesalers</strong> sell to businesses. <strong>Marketing logistics</strong> — warehousing, inventory management, transportation and information flows — must balance customer service against cost.</p>
<div class="callout"><span class="badge">Key idea</span> You can eliminate intermediaries, but not their functions: someone still has to store, deliver, finance and inform.</div>`,
    `<span class="eyebrow">MKT101 · Phần 4 · Bài 4.1</span>
<h2>Kênh phân phối &amp; logistics</h2>
<p><strong>Kênh marketing</strong> là tập hợp các tổ chức phụ thuộc lẫn nhau giúp đưa sản phẩm tới tay người tiêu dùng. Trung gian tạo thêm giá trị vì họ giảm số giao dịch và thực hiện các chức năng then chốt: thông tin, xúc tiến, tiếp xúc, kết nối cung cầu, thương lượng, phân phối vật chất, tài trợ và gánh chịu rủi ro.</p>
<h3>Các cấp kênh</h3>
<pre><code>Trực tiếp (0 cấp):  Nhà sản xuất -> Người tiêu dùng                   (website thương hiệu, cửa hàng riêng)
1 cấp:              Nhà sản xuất -> Nhà bán lẻ -> Người tiêu dùng
2 cấp:              Nhà sản xuất -> Nhà bán buôn -> Nhà bán lẻ -> Người tiêu dùng
3 cấp:              Nhà sản xuất -> Nhà bán buôn -> Người môi giới -> Nhà bán lẻ -> Người tiêu dùng</code></pre>
<h3>Hành vi và tổ chức kênh</h3>
<p>Các thành viên phụ thuộc lẫn nhau, nhưng <strong>xung đột kênh</strong> vẫn xảy ra — theo chiều ngang (giữa các doanh nghiệp cùng cấp) hoặc chiều dọc (giữa các cấp, vd nhà sản xuất bán trực tuyến rẻ hơn giá của đại lý). <strong>Hệ thống marketing dọc (VMS)</strong> làm cả kênh vận hành như một thể thống nhất:</p>
<table>
<tr><th>Loại</th><th>Cách phối hợp</th></tr>
<tr><td>VMS tập đoàn</td><td>Cùng sở hữu các khâu nối tiếp nhau</td></tr>
<tr><td>VMS hợp đồng</td><td>Hợp đồng, đặc biệt là hệ thống <strong>nhượng quyền thương mại</strong></td></tr>
<tr><td>VMS được quản lý</td><td>Quy mô và quyền lực của một thành viên chi phối</td></tr>
</table>
<p>Doanh nghiệp còn liên minh theo <strong>chiều ngang</strong> và vận hành hệ thống <strong>đa kênh</strong> (omni-channel) kết hợp cửa hàng, sàn thương mại điện tử và thương mại trên mạng xã hội để khách hàng chuyển đổi liền mạch giữa các kênh. Thiết kế kênh bắt đầu từ nhu cầu khách hàng (tiện lợi, chủng loại, tốc độ, dịch vụ), rồi đặt mục tiêu, xác định các phương án và đánh giá theo tiêu chí kinh tế, khả năng kiểm soát và khả năng thích ứng.</p>
<h3>Bán lẻ, bán buôn và logistics</h3>
<p><strong>Nhà bán lẻ</strong> bán cho người tiêu dùng cuối cùng (siêu thị, cửa hàng tiện lợi, cửa hàng chuyên doanh, nhà bán lẻ trực tuyến); <strong>nhà bán buôn</strong> bán cho doanh nghiệp. <strong>Logistics marketing</strong> — kho bãi, quản lý tồn kho, vận chuyển và dòng thông tin — phải cân bằng giữa mức phục vụ khách hàng và chi phí.</p>
<div class="callout"><span class="badge">Ý chính</span> Có thể loại bỏ trung gian, nhưng không loại bỏ được chức năng của họ: vẫn phải có ai đó lưu kho, giao hàng, tài trợ và cung cấp thông tin.</div>`,
  ]]);

const c8 = doc('mkt101-4-2-promotion', '4.2 — Integrated marketing communications|||4.2 — Truyền thông marketing tích hợp',
  'Năm công cụ của hỗn hợp xúc tiến, truyền thông marketing tích hợp (IMC), các bước xây dựng truyền thông hiệu quả (công chúng mục tiêu, các giai đoạn sẵn sàng mua, AIDA, phương tiện, nguồn tin, phản hồi), bốn cách lập ngân sách, chiến lược đẩy và kéo, marketing bền vững và đạo đức.',
  [[
    `<span class="eyebrow">MKT101 · Part 4 · Lesson 4.2</span>
<h2>Integrated marketing communications</h2>
<h3>The promotion mix</h3>
<table>
<tr><th>Tool</th><th>What it is</th><th>Strength</th></tr>
<tr><td>Advertising</td><td>Paid, non-personal presentation of ideas or products by an identified sponsor</td><td>Reaches many people; builds image</td></tr>
<tr><td>Sales promotion</td><td>Short-term incentives: coupons, discounts, samples, contests</td><td>Quick response</td></tr>
<tr><td>Personal selling</td><td>Personal presentation by the sales force</td><td>Two-way, builds relationships; costly</td></tr>
<tr><td>Public relations</td><td>Building good relations with publics through publicity, events, sponsorship</td><td>High credibility</td></tr>
<tr><td>Direct and digital marketing</td><td>Engaging individual consumers directly: websites, email, social media, mobile, online video</td><td>Targeted, interactive, measurable</td></tr>
</table>
<p><strong>Integrated marketing communications (IMC)</strong> coordinates all these channels so they deliver one clear, consistent and compelling message about the brand, across every touchpoint.</p>
<h3>Developing effective communication</h3>
<ol>
<li><strong>Identify the target audience.</strong></li>
<li><strong>Determine the objectives</strong> — move buyers through the stages of readiness: awareness → knowledge → liking → preference → conviction → purchase.</li>
<li><strong>Design the message</strong> — often using the AIDA framework: get <em>Attention</em>, hold <em>Interest</em>, arouse <em>Desire</em>, obtain <em>Action</em>.</li>
<li><strong>Choose the media</strong> — personal or non-personal channels.</li>
<li><strong>Select the message source</strong> — credible, likeable sources increase persuasion.</li>
<li><strong>Collect feedback</strong> — measure recall, attitudes and behaviour.</li>
</ol>
<h3>Budget and strategy</h3>
<p>Four budgeting methods: <strong>affordable</strong> (what the firm thinks it can spend), <strong>percentage-of-sales</strong>, <strong>competitive-parity</strong> (match competitors' spending) and <strong>objective-and-task</strong> (define objectives, the tasks needed and their cost — the most logical). A <strong>push strategy</strong> uses the sales force and trade promotion to push the product through the channel; a <strong>pull strategy</strong> uses advertising and consumer promotion so that consumers ask for the product.</p>
<h3>Sustainable and ethical marketing</h3>
<p><strong>Sustainable marketing</strong> meets the present needs of consumers and businesses while preserving the ability of future generations to meet theirs. Avoid deceptive claims ("greenwashing"), respect consumer privacy and protect vulnerable groups such as children.</p>
<div class="callout"><span class="badge">One voice</span> Customers do not separate "the ad", "the salesperson" and "the Facebook page" — to them it is all the brand. That is why integration matters.</div>`,
    `<span class="eyebrow">MKT101 · Phần 4 · Bài 4.2</span>
<h2>Truyền thông marketing tích hợp</h2>
<h3>Hỗn hợp xúc tiến</h3>
<table>
<tr><th>Công cụ</th><th>Là gì</th><th>Điểm mạnh</th></tr>
<tr><td>Quảng cáo</td><td>Giới thiệu ý tưởng hay sản phẩm một cách phi cá nhân, có trả tiền, bởi một nhà tài trợ xác định</td><td>Tiếp cận nhiều người; xây dựng hình ảnh</td></tr>
<tr><td>Khuyến mại</td><td>Ưu đãi ngắn hạn: phiếu giảm giá, chiết khấu, hàng mẫu, cuộc thi</td><td>Tạo phản ứng nhanh</td></tr>
<tr><td>Bán hàng cá nhân</td><td>Lực lượng bán hàng giới thiệu trực tiếp</td><td>Hai chiều, xây dựng quan hệ; tốn kém</td></tr>
<tr><td>Quan hệ công chúng</td><td>Xây dựng quan hệ tốt với công chúng qua truyền thông, sự kiện, tài trợ</td><td>Độ tin cậy cao</td></tr>
<tr><td>Marketing trực tiếp và kỹ thuật số</td><td>Gắn kết trực tiếp với từng người tiêu dùng: website, email, mạng xã hội, di động, video trực tuyến</td><td>Nhắm chọn, tương tác, đo lường được</td></tr>
</table>
<p><strong>Truyền thông marketing tích hợp (IMC)</strong> phối hợp mọi kênh để cùng truyền đi một thông điệp rõ ràng, nhất quán và thuyết phục về thương hiệu, ở mọi điểm tiếp xúc.</p>
<h3>Xây dựng truyền thông hiệu quả</h3>
<ol>
<li><strong>Xác định công chúng mục tiêu.</strong></li>
<li><strong>Xác định mục tiêu</strong> — đưa người mua qua các giai đoạn sẵn sàng mua: nhận biết → hiểu biết → thích → ưa chuộng → tin tưởng → mua.</li>
<li><strong>Thiết kế thông điệp</strong> — thường theo mô hình AIDA: gây <em>Chú ý</em>, giữ <em>Quan tâm</em>, khơi <em>Mong muốn</em>, thúc đẩy <em>Hành động</em>.</li>
<li><strong>Chọn phương tiện</strong> — kênh cá nhân hoặc phi cá nhân.</li>
<li><strong>Chọn nguồn phát thông điệp</strong> — nguồn đáng tin, dễ mến làm tăng sức thuyết phục.</li>
<li><strong>Thu thập phản hồi</strong> — đo mức ghi nhớ, thái độ và hành vi.</li>
</ol>
<h3>Ngân sách và chiến lược</h3>
<p>Bốn cách lập ngân sách: <strong>theo khả năng</strong> (mức doanh nghiệp nghĩ mình chi được), <strong>theo % doanh thu</strong>, <strong>ngang bằng cạnh tranh</strong> (chi như đối thủ) và <strong>theo mục tiêu – nhiệm vụ</strong> (xác định mục tiêu, nhiệm vụ cần làm và chi phí của chúng — logic nhất). <strong>Chiến lược đẩy</strong> dùng lực lượng bán hàng và khuyến mại thương mại để đẩy sản phẩm qua kênh; <strong>chiến lược kéo</strong> dùng quảng cáo và khuyến mại người tiêu dùng để người tiêu dùng tự tìm mua sản phẩm.</p>
<h3>Marketing bền vững và đạo đức</h3>
<p><strong>Marketing bền vững</strong> đáp ứng nhu cầu hiện tại của người tiêu dùng và doanh nghiệp mà vẫn giữ khả năng đáp ứng nhu cầu của các thế hệ sau. Tránh tuyên bố gây hiểu lầm ("tẩy xanh"), tôn trọng quyền riêng tư của người tiêu dùng và bảo vệ các nhóm dễ tổn thương như trẻ em.</p>
<div class="callout"><span class="badge">Một tiếng nói</span> Khách hàng không tách bạch "quảng cáo", "nhân viên bán hàng" và "trang Facebook" — với họ tất cả là thương hiệu. Vì thế cần tích hợp.</div>`,
  ]]);

const c8q = quiz('mkt101-quiz-4', 'Quiz 4 — Place & promotion|||Quiz 4 — Phân phối & xúc tiến', [
  { id: 'q1', question: 'A franchise organization is an example of which type of vertical marketing system?|||Hệ thống nhượng quyền thương mại là ví dụ của loại hệ thống marketing dọc nào?', options: ['Corporate VMS|||VMS tập đoàn', 'Contractual VMS|||VMS hợp đồng', 'Administered VMS|||VMS được quản lý', 'Horizontal marketing system|||Hệ thống marketing ngang'], correctIndex: 1, explanation: 'Independent firms at different levels are tied together by contracts.|||Các doanh nghiệp độc lập ở các cấp khác nhau được gắn với nhau bằng hợp đồng.' },
  { id: 'q2', question: 'A manufacturer relies mainly on its sales force and trade promotions to get retailers to stock and sell its product. This is a…|||Nhà sản xuất chủ yếu dùng lực lượng bán hàng và khuyến mại thương mại để nhà bán lẻ nhập và bán sản phẩm. Đây là…', options: ['pull strategy|||chiến lược kéo', 'push strategy|||chiến lược đẩy', 'penetration pricing strategy|||chiến lược giá thâm nhập', 'concentrated targeting strategy|||chiến lược mục tiêu tập trung'], correctIndex: 1, explanation: 'Push moves the product through the channel; pull creates consumer demand that draws it through.|||Chiến lược đẩy đưa sản phẩm đi qua kênh; chiến lược kéo tạo cầu của người tiêu dùng để kéo sản phẩm qua kênh.' },
  { id: 'q3', question: 'Setting the promotion budget to match what competitors spend is the…|||Lập ngân sách xúc tiến bằng mức đối thủ đang chi là phương pháp…', options: ['affordable method|||theo khả năng', 'percentage-of-sales method|||theo % doanh thu', 'competitive-parity method|||ngang bằng cạnh tranh', 'objective-and-task method|||theo mục tiêu – nhiệm vụ'], correctIndex: 2, explanation: 'Competitive parity follows rivals; objective-and-task starts from what the promotion must achieve.|||Ngang bằng cạnh tranh chạy theo đối thủ; mục tiêu – nhiệm vụ bắt đầu từ việc xúc tiến phải đạt được gì.' },
]);

export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'MKT101',
    slug: 'mkt101-marketing-principles',
    title: 'Marketing Principles',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/MKT101.webp',
    shortDescription: 'Creating value for customers: the marketing process, strategy and environment, research, consumer behaviour, segmentation, targeting and positioning, products and brands, pricing, channels and integrated communications. Bilingual, with exercises and quizzes.|||Tạo giá trị cho khách hàng: quy trình marketing, chiến lược, môi trường, nghiên cứu, hành vi mua, STP, sản phẩm, thương hiệu, định giá, phân phối và truyền thông tích hợp. Song ngữ, có bài tập và quiz.',
    description: 'Môn <strong>MKT101 — Marketing Principles (Nguyên lý marketing)</strong> (khối Quản trị Kinh doanh, kỳ 1) trình bày marketing như quá trình <strong>tạo giá trị cho khách hàng để thu về giá trị</strong>. Từ <strong>quy trình marketing và các triết lý</strong> → <strong>chiến lược</strong> (BCG, Ansoff), <strong>môi trường và nghiên cứu marketing</strong> → <strong>hành vi người mua</strong> và <strong>STP</strong> (phân khúc, chọn thị trường mục tiêu, định vị) → <strong>sản phẩm, thương hiệu, vòng đời</strong> và <strong>định giá</strong> (giá trị, chi phí, hoà vốn) → <strong>kênh phân phối</strong> và <strong>truyền thông marketing tích hợp</strong>. Bám cấu trúc giáo trình marketing căn bản chuẩn, song ngữ Anh–Việt, có bài tập tình huống (giả định) kèm lời giải và quiz cuối mỗi phần.',
    whatYouLearn: 'Giải thích marketing, quy trình 5 bước và 5 triết lý quản trị marketing\nPhân tích danh mục kinh doanh bằng ma trận BCG và hướng tăng trưởng theo Ansoff\nNhận diện các tác nhân vi mô và lực lượng vĩ mô của môi trường marketing\nLập kế hoạch nghiên cứu: dữ liệu sơ cấp, thứ cấp, phương pháp và cách đặt câu hỏi\nPhân tích hành vi người mua và quy trình quyết định mua\nThực hiện STP và viết câu định vị\nQuyết định về sản phẩm, thương hiệu, vòng đời; tính giá cộng lãi và điểm hoà vốn\nThiết kế kênh phân phối và kế hoạch truyền thông marketing tích hợp',
    requirements: 'Không cần kiến thức marketing trước\nTính toán cơ bản với phần trăm\nThói quen quan sát quảng cáo, cửa hàng và hành vi mua sắm xung quanh',
  },
  sections: [
    { title: 'Course introduction|||Giới thiệu môn học', description: 'Marketing là gì, quy trình 5 bước, các triết lý.', lessons: [intro] },
    { title: 'Part 1 — Strategy, environment & research|||Phần 1 — Chiến lược, môi trường & nghiên cứu', description: 'BCG, Ansoff, môi trường vi mô và vĩ mô, nghiên cứu marketing.', lessons: [c1, c2, c1q] },
    { title: 'Part 2 — Customers & STP|||Phần 2 — Khách hàng & STP', description: 'Hành vi người mua, phân khúc, chọn thị trường, định vị.', lessons: [c3, c4, c4e, c4q] },
    { title: 'Part 3 — Product & price|||Phần 3 — Sản phẩm & giá', description: 'Cấp độ sản phẩm, thương hiệu, vòng đời, chiến lược giá.', lessons: [c5, c6, c6e, c6q] },
    { title: 'Part 4 — Place & promotion|||Phần 4 — Phân phối & xúc tiến', description: 'Kênh phân phối, logistics, IMC, ngân sách, đẩy và kéo.', lessons: [c7, c8, c8q] },
  ],
};
