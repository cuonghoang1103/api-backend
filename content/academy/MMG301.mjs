/**
 * MMG301 — Marketing Management (Quản trị marketing). Khối Quản trị Kinh doanh, kỳ 2
 * (học sau MKT101). Bám cấu trúc giáo trình quản trị marketing chuẩn quốc tế (Kotler &
 * Keller — Marketing Management; Keller — Strategic Brand Management cho CBBE): marketing
 * toàn diện & kế hoạch, tiềm năng thị trường & dự báo, giá trị khách hàng – CLV – CRM, thị
 * trường tiêu dùng & tổ chức, định vị – tài sản thương hiệu – cạnh tranh, sản phẩm – dịch vụ
 * – giá, kênh & truyền thông số, tổ chức – thực thi – kiểm soát. Song ngữ + ví dụ số (đã
 * kiểm bằng script; tình huống là GIẢ ĐỊNH, không có số liệu thị trường thật) + bài tập + quiz.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('mmg301-0-1-overview', 'Course overview: from marketing principles to marketing management|||Tổng quan: từ nguyên lý marketing đến quản trị marketing',
  'MMG301 khác MKT101 ở đâu, sáu nhiệm vụ của nhà quản trị marketing, lộ trình 4 phần và bảng công thức sẽ dùng xuyên suốt môn (tiềm năng thị trường, thị phần, CLV, CAC, ROMI, NPS).',
  [[
    `<span class="eyebrow">MMG301 · Lesson 0.1 · Overview</span>
<h2>Marketing Management</h2>
<p class="lead">MKT101 asked <em>what</em> marketing is. MMG301 asks how a marketing manager <strong>decides, plans, measures and controls</strong>: which markets are worth entering, how much demand to expect, which customers are worth keeping, how to build a brand competitors cannot easily copy, and whether the money spent on marketing actually paid back.</p>
<h3>From principles to management</h3>
<table>
<tr><th>MKT101 — Principles</th><th>MMG301 — Management</th></tr>
<tr><td>Defines needs, the 4Ps and STP</td><td>Uses them to choose between options under a limited budget</td></tr>
<tr><td>Describes the research process</td><td>Sizes markets and forecasts demand in numbers</td></tr>
<tr><td>Explains satisfaction and loyalty</td><td>Values customers as assets (CLV) and compares that value with the cost of acquiring them</td></tr>
<tr><td>Introduces brands and positioning</td><td>Builds and measures brand equity; plans moves against competitors</td></tr>
<tr><td>Lists the promotion tools</td><td>Measures funnels, ROMI and the performance of the marketing plan</td></tr>
</table>
<h3>The marketing manager's core tasks</h3>
<ol>
<li>Develop marketing strategies and plans.</li>
<li>Capture marketing insights and forecast demand.</li>
<li>Connect with customers — create value, satisfaction and loyalty.</li>
<li>Build strong brands and deal with competition.</li>
<li>Shape, price, deliver and communicate the offering.</li>
<li>Organize, implement and control marketing for long-term growth.</li>
</ol>
<h3>Roadmap</h3>
<p>Part 1: holistic marketing, the marketing plan, market potential and demand forecasting · Part 2: customer value, CLV and CRM, consumer and business buying · Part 3: positioning, brand equity, competitive strategy, product, service and pricing · Part 4: channels, integrated and digital communications, organization and control. Parts 1, 2 and 4 include a worked exercise; every part ends with a quiz.</p>
<h3>The manager's formula sheet (built up during the course)</h3>
<pre><code class="language-text">Total market potential  Q = n × q × p
Market share            = company sales / total market sales
CLV (simple)            = m / (1 + i − r)
CAC                     = acquisition spending / number of new customers
ROMI                    = (incremental gross profit − marketing cost) / marketing cost
NPS                     = % promoters − % detractors</code></pre>
<div class="callout"><span class="badge">Mindset</span> A marketing manager turns every "we should do more marketing" into three questions: <em>for which customers, to achieve what measurable result, and how will we know it worked?</em></div>`,
    `<span class="eyebrow">MMG301 · Bài 0.1 · Tổng quan</span>
<h2>Quản trị marketing</h2>
<p class="lead">MKT101 trả lời câu hỏi marketing <em>là gì</em>. MMG301 hỏi nhà quản trị marketing <strong>ra quyết định, lập kế hoạch, đo lường và kiểm soát</strong> thế nào: thị trường nào đáng tham gia, kỳ vọng bao nhiêu nhu cầu, khách hàng nào đáng giữ, làm sao xây một thương hiệu mà đối thủ khó sao chép, và tiền chi cho marketing có thực sự sinh lời hay không.</p>
<h3>Từ nguyên lý đến quản trị</h3>
<table>
<tr><th>MKT101 — Nguyên lý</th><th>MMG301 — Quản trị</th></tr>
<tr><td>Định nghĩa nhu cầu, 4P và STP</td><td>Dùng chúng để chọn giữa các phương án khi ngân sách có hạn</td></tr>
<tr><td>Mô tả quy trình nghiên cứu</td><td>Ước lượng quy mô thị trường và dự báo nhu cầu bằng con số</td></tr>
<tr><td>Giải thích sự hài lòng và lòng trung thành</td><td>Định giá khách hàng như tài sản (CLV) và so giá trị đó với chi phí thu hút họ</td></tr>
<tr><td>Giới thiệu thương hiệu và định vị</td><td>Xây dựng và đo lường tài sản thương hiệu; hoạch định nước đi trước đối thủ</td></tr>
<tr><td>Liệt kê các công cụ xúc tiến</td><td>Đo phễu, ROMI và kết quả thực hiện kế hoạch marketing</td></tr>
</table>
<h3>Các nhiệm vụ cốt lõi của nhà quản trị marketing</h3>
<ol>
<li>Xây dựng chiến lược và kế hoạch marketing.</li>
<li>Nắm bắt insight thị trường và dự báo nhu cầu.</li>
<li>Kết nối với khách hàng — tạo giá trị, sự hài lòng và lòng trung thành.</li>
<li>Xây dựng thương hiệu mạnh và đối phó với cạnh tranh.</li>
<li>Định hình, định giá, phân phối và truyền thông sản phẩm chào bán.</li>
<li>Tổ chức, thực thi và kiểm soát marketing để tăng trưởng dài hạn.</li>
</ol>
<h3>Lộ trình</h3>
<p>Phần 1: marketing toàn diện, kế hoạch marketing, tiềm năng thị trường và dự báo nhu cầu · Phần 2: giá trị khách hàng, CLV và CRM, hành vi mua của người tiêu dùng và tổ chức · Phần 3: định vị, tài sản thương hiệu, chiến lược cạnh tranh, sản phẩm, dịch vụ và giá · Phần 4: kênh phân phối, truyền thông tích hợp và số, tổ chức và kiểm soát. Phần 1, 2 và 4 có bài tập kèm lời giải; mỗi phần kết thúc bằng một bài quiz.</p>
<h3>Bảng công thức của nhà quản trị (hoàn thiện dần qua môn học)</h3>
<pre><code class="language-text">Tổng tiềm năng thị trường  Q = n × q × p
Thị phần                   = doanh số công ty / tổng doanh số thị trường
CLV (dạng đơn giản)        = m / (1 + i − r)
CAC                        = chi phí thu hút / số khách hàng mới
ROMI                       = (lợi nhuận gộp tăng thêm − chi phí marketing) / chi phí marketing
NPS                        = % người ủng hộ − % người phản đối</code></pre>
<div class="callout"><span class="badge">Tư duy</span> Nhà quản trị marketing biến mọi câu "ta nên làm marketing nhiều hơn" thành ba câu hỏi: <em>cho khách hàng nào, để đạt kết quả đo được nào, và làm sao biết nó hiệu quả?</em></div>`,
  ]]);

const c1 = doc('mmg301-1-1-holistic-planning', '1.1 — Holistic marketing & the strategic marketing plan|||1.1 — Marketing toàn diện & kế hoạch marketing chiến lược',
  'Bốn thành phần của marketing toàn diện và 4P hiện đại, quy trình chuyển giao giá trị, hoạch định chiến lược ở cấp đơn vị kinh doanh (sứ mệnh, SWOT, mục tiêu, chiến lược tổng quát của Porter), cấu trúc một bản kế hoạch marketing.',
  [[
    `<span class="eyebrow">MMG301 · Part 1 · Lesson 1.1</span>
<h2>Holistic marketing &amp; the strategic marketing plan</h2>
<p class="lead"><strong>Holistic marketing</strong> recognizes that "everything matters" — customers, employees, partners, competitors and society — and that a broad, integrated perspective is needed to develop, design and implement marketing programs.</p>
<h3>Four components of holistic marketing</h3>
<table>
<tr><th>Component</th><th>What it means</th><th>Manager's question</th></tr>
<tr><td>Relationship marketing</td><td>Mutually satisfying long-term relationships with customers, employees, channel partners and financiers — the firm's <em>marketing network</em></td><td>Which relationships create most of our value?</td></tr>
<tr><td>Integrated marketing</td><td>Activities designed so the whole exceeds the sum: every channel and message reinforces the others</td><td>Do price, channels and messages tell one story?</td></tr>
<tr><td>Internal marketing</td><td>Hiring, training and motivating people who want to serve customers well; marketing is everyone's job</td><td>Do front-line staff deliver what our ads promise?</td></tr>
<tr><td>Performance marketing</td><td>Financial and non-financial returns of marketing — sales, brand and customer equity, plus ethics, law, environment and community</td><td>Can we show what marketing contributed?</td></tr>
</table>
<p>The 4Ps remain useful, but a holistic view adds four modern Ps: <strong>people</strong> (employees and customers as individuals), <strong>processes</strong> (the structure and discipline behind marketing decisions), <strong>programs</strong> (all customer-directed activities, including the old 4Ps) and <strong>performance</strong> (financial and non-financial outcomes).</p>
<h3>The value delivery process</h3>
<p>Instead of "make and sell", strategic marketing works in three phases: <strong>choose the value</strong> (segmentation, targeting, positioning), <strong>provide the value</strong> (product features, prices, distribution) and <strong>communicate the value</strong> (sales force, advertising, digital, promotion).</p>
<h3>Strategic planning at the business-unit level</h3>
<p>Plans are made at four levels: corporate, division, business unit and product. (Portfolio tools such as the BCG matrix and Ansoff grid were covered in MKT101.) Each business unit follows this process:</p>
<ol>
<li><strong>Business mission</strong> — which needs, for which customers, with which competencies.</li>
<li><strong>SWOT analysis</strong> — external opportunities and threats, internal strengths and weaknesses. Keep only the factors that matter for the chosen customers.</li>
<li><strong>Goal formulation</strong> — goals should be <em>hierarchical</em> (from most to least important), <em>quantitative</em>, <em>realistic</em> and <em>consistent</em>: "raise market share from 12% to 15% within two years", not "grow share".</li>
<li><strong>Strategy formulation</strong> — Porter's generic strategies: <em>overall cost leadership</em>, <em>differentiation</em> or <em>focus</em> on a narrow segment. A firm "stuck in the middle" does none of them well.</li>
<li><strong>Program formulation and implementation</strong>, followed by <strong>feedback and control</strong>.</li>
</ol>
<h3>What goes into a marketing plan</h3>
<table>
<tr><th>Section</th><th>Content</th></tr>
<tr><td>Executive summary &amp; contents</td><td>Main goals and recommendations, for busy senior managers</td></tr>
<tr><td>Situation analysis</td><td>Sales, costs, the market, competitors, macro-environment forces; SWOT</td></tr>
<tr><td>Marketing strategy</td><td>Mission, marketing and financial objectives, target segments, positioning and value proposition, and the program decisions (product, price, channel, communications) with timing and owners</td></tr>
<tr><td>Financial projections</td><td>Sales forecast, expense forecast, break-even analysis</td></tr>
<tr><td>Implementation controls</td><td>Monthly or quarterly targets, the metrics to track them, and contingency plans</td></tr>
</table>
<div class="callout"><span class="badge">Good practice</span> A plan is only as good as its control section. A goal with no metric, no owner and no review date is a wish, not a plan.</div>`,
    `<span class="eyebrow">MMG301 · Phần 1 · Bài 1.1</span>
<h2>Marketing toàn diện &amp; kế hoạch marketing chiến lược</h2>
<p class="lead"><strong>Marketing toàn diện</strong> (holistic marketing) thừa nhận rằng "mọi thứ đều quan trọng" — khách hàng, nhân viên, đối tác, đối thủ và xã hội — và cần một góc nhìn rộng, tích hợp để phát triển, thiết kế và triển khai các chương trình marketing.</p>
<h3>Bốn thành phần của marketing toàn diện</h3>
<table>
<tr><th>Thành phần</th><th>Ý nghĩa</th><th>Câu hỏi của nhà quản trị</th></tr>
<tr><td>Marketing quan hệ</td><td>Quan hệ dài hạn, đôi bên cùng hài lòng với khách hàng, nhân viên, đối tác kênh và nhà tài chính — <em>mạng lưới marketing</em> của doanh nghiệp</td><td>Những mối quan hệ nào tạo ra phần lớn giá trị của ta?</td></tr>
<tr><td>Marketing tích hợp</td><td>Thiết kế hoạt động để tổng thể lớn hơn tổng các phần: mỗi kênh, mỗi thông điệp củng cố cho nhau</td><td>Giá, kênh và thông điệp có kể cùng một câu chuyện?</td></tr>
<tr><td>Marketing nội bộ</td><td>Tuyển dụng, đào tạo và tạo động lực cho những người muốn phục vụ khách hàng tốt; marketing là việc của mọi người</td><td>Nhân viên tuyến đầu có làm đúng điều quảng cáo hứa không?</td></tr>
<tr><td>Marketing hiệu quả (performance marketing)</td><td>Lợi ích tài chính và phi tài chính của marketing — doanh số, tài sản thương hiệu và tài sản khách hàng, cùng đạo đức, pháp luật, môi trường và cộng đồng</td><td>Ta có chứng minh được marketing đã đóng góp gì không?</td></tr>
</table>
<p>4P vẫn hữu ích, nhưng góc nhìn toàn diện bổ sung bốn chữ P hiện đại: <strong>con người</strong> (nhân viên và khách hàng như những cá nhân), <strong>quy trình</strong> (cấu trúc và kỷ luật đằng sau các quyết định marketing), <strong>chương trình</strong> (mọi hoạt động hướng tới khách hàng, kể cả 4P cũ) và <strong>hiệu quả</strong> (kết quả tài chính và phi tài chính).</p>
<h3>Quy trình chuyển giao giá trị</h3>
<p>Thay vì "làm ra rồi bán", marketing chiến lược đi qua ba giai đoạn: <strong>lựa chọn giá trị</strong> (phân khúc, chọn thị trường mục tiêu, định vị), <strong>cung cấp giá trị</strong> (tính năng sản phẩm, giá, phân phối) và <strong>truyền thông giá trị</strong> (lực lượng bán hàng, quảng cáo, kỹ thuật số, khuyến mại).</p>
<h3>Hoạch định chiến lược ở cấp đơn vị kinh doanh</h3>
<p>Kế hoạch được lập ở bốn cấp: công ty, bộ phận, đơn vị kinh doanh và sản phẩm. (Công cụ danh mục như ma trận BCG và ma trận Ansoff đã học ở MKT101.) Mỗi đơn vị kinh doanh đi theo quy trình:</p>
<ol>
<li><strong>Sứ mệnh kinh doanh</strong> — đáp ứng nhu cầu nào, cho khách hàng nào, bằng năng lực nào.</li>
<li><strong>Phân tích SWOT</strong> — cơ hội và thách thức bên ngoài, điểm mạnh và điểm yếu bên trong. Chỉ giữ những yếu tố quan trọng với khách hàng đã chọn.</li>
<li><strong>Xây dựng mục tiêu</strong> — mục tiêu cần <em>có thứ bậc</em> (từ quan trọng nhất đến ít quan trọng nhất), <em>định lượng</em>, <em>thực tế</em> và <em>nhất quán</em>: "tăng thị phần từ 12% lên 15% trong hai năm", không phải "tăng thị phần".</li>
<li><strong>Xây dựng chiến lược</strong> — các chiến lược tổng quát của Porter: <em>dẫn đầu về chi phí</em>, <em>khác biệt hoá</em> hoặc <em>tập trung</em> vào một phân khúc hẹp. Doanh nghiệp "kẹt ở giữa" thì không làm tốt được cách nào.</li>
<li><strong>Xây dựng và triển khai chương trình</strong>, sau đó là <strong>phản hồi và kiểm soát</strong>.</li>
</ol>
<h3>Một bản kế hoạch marketing gồm những gì</h3>
<table>
<tr><th>Phần</th><th>Nội dung</th></tr>
<tr><td>Tóm tắt điều hành &amp; mục lục</td><td>Mục tiêu và khuyến nghị chính, dành cho lãnh đạo cấp cao bận rộn</td></tr>
<tr><td>Phân tích tình hình</td><td>Doanh số, chi phí, thị trường, đối thủ, các lực lượng vĩ mô; SWOT</td></tr>
<tr><td>Chiến lược marketing</td><td>Sứ mệnh, mục tiêu marketing và tài chính, phân khúc mục tiêu, định vị và tuyên bố giá trị, cùng các quyết định chương trình (sản phẩm, giá, kênh, truyền thông) kèm thời hạn và người phụ trách</td></tr>
<tr><td>Dự phóng tài chính</td><td>Dự báo doanh số, dự báo chi phí, phân tích hoà vốn</td></tr>
<tr><td>Kiểm soát thực thi</td><td>Chỉ tiêu theo tháng hoặc quý, các chỉ số để theo dõi và kế hoạch dự phòng</td></tr>
</table>
<div class="callout"><span class="badge">Thực hành tốt</span> Kế hoạch chỉ tốt bằng phần kiểm soát của nó. Một mục tiêu không có chỉ số đo, không có người chịu trách nhiệm và không có ngày rà soát là một mong ước, không phải kế hoạch.</div>`,
  ]]);

const c2 = doc('mmg301-1-2-demand-forecasting', '1.2 — Market potential & demand forecasting|||1.2 — Tiềm năng thị trường & dự báo nhu cầu',
  'Các cấp độ thị trường, cầu thị trường – tiềm năng thị trường – cầu của công ty – dự báo doanh số, công thức Q = n × q × p, phương pháp chuỗi tỷ lệ, tổng hợp thị trường và chỉ số đa yếu tố, năm phương pháp dự báo nhu cầu tương lai.',
  [[
    `<span class="eyebrow">MMG301 · Part 1 · Lesson 1.2</span>
<h2>Market potential &amp; demand forecasting</h2>
<p class="lead">Before committing a budget, a manager must answer three questions: how big is the opportunity, how much of it can we win, and how sure are we? Research (MKT101) collects the data; demand measurement turns it into the numbers of the plan.</p>
<h3>Which market are we measuring?</h3>
<table>
<tr><th>Level</th><th>Definition</th></tr>
<tr><td>Potential market</td><td>Consumers with sufficient interest in the offer</td></tr>
<tr><td>Available market</td><td>Consumers with interest, income and access to the offer</td></tr>
<tr><td>Qualified available market</td><td>Those who also meet any requirements (e.g., a minimum age or a licence)</td></tr>
<tr><td>Target (served) market</td><td>The part of the qualified available market the company decides to pursue</td></tr>
<tr><td>Penetrated market</td><td>Consumers already buying the product, from us or from competitors</td></tr>
</table>
<h3>Key demand concepts</h3>
<ul>
<li><strong>Market demand</strong> — the total volume bought by a defined customer group, in a defined area and time period, in a defined marketing environment, under a defined marketing program. It is a <em>function</em>, not a single number: it rises with industry marketing effort, from a <em>market minimum</em> (sales with no marketing spending) towards a ceiling.</li>
<li><strong>Market potential</strong> — that ceiling: the limit market demand approaches as industry marketing expenditure approaches infinity, for a given environment.</li>
<li><strong>Company demand</strong> — the company's estimated share of market demand at alternative levels of its marketing effort. The <strong>company sales forecast</strong> is the expected level of sales under the chosen marketing plan.</li>
<li><strong>Market share</strong> = company sales ÷ total market sales, in units or in value — always say which.</li>
</ul>
<h3>Estimating current demand</h3>
<pre><code class="language-text">Total market potential  Q = n × q × p
  n = number of buyers of the product under given assumptions
  q = quantity bought by an average buyer per period
  p = price of an average unit</code></pre>
<ul>
<li><strong>Chain-ratio method</strong> — estimate n by multiplying a base number by a chain of adjusting percentages (population → target age group → category users → interested in the new variant).</li>
<li><strong>Market-buildup method</strong> — common in business markets: identify all potential buyers in each area and add up their estimated purchases.</li>
<li><strong>Multiple-factor index method</strong> — weight several indicators (income, retail sales, population) to rank geographic areas by potential and allocate sales effort.</li>
</ul>
<h3>Forecasting future demand</h3>
<table>
<tr><th>Method</th><th>Suits</th><th>Watch out for</th></tr>
<tr><td>Survey of buyers' intentions</td><td>Durable goods; business markets with few buyers</td><td>Stated intentions often exceed actual purchases</td></tr>
<tr><td>Composite of sales-force opinions</td><td>Business markets with close customer contact</td><td>Optimism, or low estimates to get easier quotas</td></tr>
<tr><td>Expert opinion (e.g., Delphi rounds)</td><td>New markets without sales history</td><td>Experts may share the same bias</td></tr>
<tr><td>Past-sales (time-series) analysis: trend, cycle, seasonal and erratic components</td><td>Stable markets with a long history</td><td>Structural breaks — new technology, crises</td></tr>
<tr><td>Market-test method</td><td>New products, new channels or regions</td><td>Cost, delay, and competitors watching the test</td></tr>
</table>
<div class="callout"><span class="badge">Manager's rule</span> Every forecast is a chain of assumptions. Write each link down, show a pessimistic and an optimistic case, and update the numbers as soon as real sales arrive.</div>`,
    `<span class="eyebrow">MMG301 · Phần 1 · Bài 1.2</span>
<h2>Tiềm năng thị trường &amp; dự báo nhu cầu</h2>
<p class="lead">Trước khi cam kết ngân sách, nhà quản trị phải trả lời ba câu hỏi: cơ hội lớn đến đâu, ta giành được bao nhiêu phần, và ta chắc chắn tới mức nào? Nghiên cứu (MKT101) thu thập dữ liệu; đo lường nhu cầu biến dữ liệu thành những con số trong kế hoạch.</p>
<h3>Ta đang đo thị trường nào?</h3>
<table>
<tr><th>Cấp độ</th><th>Định nghĩa</th></tr>
<tr><td>Thị trường tiềm năng</td><td>Người tiêu dùng có đủ quan tâm tới sản phẩm chào bán</td></tr>
<tr><td>Thị trường sẵn có</td><td>Người có quan tâm, có thu nhập và tiếp cận được sản phẩm</td></tr>
<tr><td>Thị trường sẵn có đủ điều kiện</td><td>Những người còn đáp ứng các điều kiện bắt buộc (vd tuổi tối thiểu hoặc giấy phép)</td></tr>
<tr><td>Thị trường mục tiêu (được phục vụ)</td><td>Phần của thị trường sẵn có đủ điều kiện mà công ty quyết định theo đuổi</td></tr>
<tr><td>Thị trường đã thâm nhập</td><td>Người tiêu dùng đang mua sản phẩm, của ta hoặc của đối thủ</td></tr>
</table>
<h3>Các khái niệm then chốt về nhu cầu</h3>
<ul>
<li><strong>Cầu thị trường</strong> — tổng khối lượng được mua bởi một nhóm khách hàng xác định, ở một khu vực và khoảng thời gian xác định, trong một môi trường marketing xác định, dưới một chương trình marketing xác định. Nó là một <em>hàm số</em>, không phải một con số duy nhất: nó tăng theo nỗ lực marketing của ngành, từ <em>mức cầu tối thiểu</em> (doanh số khi không chi cho marketing) tiến dần tới một mức trần.</li>
<li><strong>Tiềm năng thị trường</strong> — chính mức trần đó: giới hạn mà cầu thị trường tiến tới khi chi tiêu marketing của ngành tiến tới vô hạn, trong một môi trường nhất định.</li>
<li><strong>Cầu của công ty</strong> — phần cầu thị trường mà công ty ước tính giành được ứng với các mức nỗ lực marketing khác nhau. <strong>Dự báo doanh số của công ty</strong> là mức doanh số kỳ vọng theo kế hoạch marketing đã chọn.</li>
<li><strong>Thị phần</strong> = doanh số công ty ÷ tổng doanh số thị trường, tính theo số lượng hoặc giá trị — luôn ghi rõ cách tính.</li>
</ul>
<h3>Ước tính nhu cầu hiện tại</h3>
<pre><code class="language-text">Tổng tiềm năng thị trường  Q = n × q × p
  n = số người mua sản phẩm theo các giả định cho trước
  q = số lượng một người mua trung bình mua trong một kỳ
  p = giá của một đơn vị trung bình</code></pre>
<ul>
<li><strong>Phương pháp chuỗi tỷ lệ</strong> — ước tính n bằng cách nhân một con số gốc với một chuỗi tỷ lệ điều chỉnh (dân số → nhóm tuổi mục tiêu → người dùng ngành hàng → người quan tâm tới biến thể mới).</li>
<li><strong>Phương pháp tổng hợp thị trường</strong> — phổ biến ở thị trường doanh nghiệp: xác định mọi người mua tiềm năng ở từng khu vực rồi cộng dồn lượng mua ước tính của họ.</li>
<li><strong>Phương pháp chỉ số đa yếu tố</strong> — gán trọng số cho nhiều chỉ tiêu (thu nhập, doanh số bán lẻ, dân số) để xếp hạng các khu vực theo tiềm năng và phân bổ nỗ lực bán hàng.</li>
</ul>
<h3>Dự báo nhu cầu tương lai</h3>
<table>
<tr><th>Phương pháp</th><th>Phù hợp với</th><th>Cần cảnh giác</th></tr>
<tr><td>Khảo sát ý định của người mua</td><td>Hàng lâu bền; thị trường doanh nghiệp ít người mua</td><td>Ý định nói ra thường cao hơn lượng mua thực tế</td></tr>
<tr><td>Tổng hợp ý kiến lực lượng bán hàng</td><td>Thị trường doanh nghiệp, tiếp xúc gần với khách</td><td>Lạc quan quá mức, hoặc cố ý ước thấp để được giao chỉ tiêu nhẹ</td></tr>
<tr><td>Ý kiến chuyên gia (vd các vòng Delphi)</td><td>Thị trường mới chưa có lịch sử doanh số</td><td>Các chuyên gia có thể cùng một thiên kiến</td></tr>
<tr><td>Phân tích doanh số quá khứ (chuỗi thời gian): xu hướng, chu kỳ, mùa vụ, bất thường</td><td>Thị trường ổn định, lịch sử dài</td><td>Những cú gãy cấu trúc — công nghệ mới, khủng hoảng</td></tr>
<tr><td>Phương pháp thị trường thử nghiệm</td><td>Sản phẩm mới, kênh hoặc khu vực mới</td><td>Tốn kém, chậm, và đối thủ theo dõi cuộc thử</td></tr>
</table>
<div class="callout"><span class="badge">Nguyên tắc</span> Mọi dự báo đều là một chuỗi giả định. Hãy viết ra từng mắt xích, trình bày một kịch bản bi quan và một kịch bản lạc quan, và cập nhật con số ngay khi có doanh số thật.</div>`,
  ]]);

const c2e = doc('mmg301-1-3-exercise', 'Exercise 1 — Chain-ratio estimate of market potential|||Bài tập 1 — Ước tính tiềm năng thị trường bằng chuỗi tỷ lệ',
  'Bài tập tình huống giả định: trà xanh ít đường đóng chai ở một thành phố — tính số người mua bằng chuỗi tỷ lệ, tổng tiềm năng theo số chai và theo tiền, dự báo doanh số năm đầu với thị phần 5%, phân tích độ nhạy ba kịch bản; kèm lời giải.',
  [[
    `<span class="eyebrow">MMG301 · Part 1 · Exercise 1</span>
<h2>Exercise 1 — how big is the low-sugar tea market?</h2>
<div class="callout"><span class="badge">Problem</span> A beverage start-up (a fictional case, illustrative numbers) plans a ready-to-drink low-sugar green tea in one city. Assumptions: adult population 2,000,000; share aged 18–40: 45%; of those, regular buyers of bottled drinks: 60%; of those, interested in a low-sugar tea: 25%; an average buyer purchases 52 bottles a year (one a week) at an average price of VND 12,000. (a) Estimate the number of potential buyers n with the chain-ratio method. (b) Compute the total market potential in bottles and in VND. (c) The company expects a 5% share of that potential in year 1 — what is its sales forecast? (d) The "interested" ratio is the weakest assumption: recompute for 20% (pessimistic) and 30% (optimistic). (e) What should the company do before committing the launch budget?</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) n = 2,000,000 × 0.45 × 0.60 × 0.25
      = 900,000 × 0.60 × 0.25 = 540,000 × 0.25 = 135,000 buyers

(b) Q (units) = 135,000 × 52        = 7,020,000 bottles a year
    Q (value) = 7,020,000 × 12,000  = VND 84,240,000,000  (≈ VND 84.24 billion)

(c) Year-1 forecast = 5% × 7,020,000 = 351,000 bottles
                    = 351,000 × 12,000 = VND 4,212,000,000  (≈ VND 4.21 billion)</code></pre>
<table>
<tr><th>(d) Scenario</th><th>Interested</th><th>Buyers n</th><th>Potential (bottles)</th><th>Potential (VND)</th><th>Year-1 forecast at 5% (bottles)</th></tr>
<tr><td>Pessimistic</td><td>20%</td><td>108,000</td><td>5,616,000</td><td>67,392,000,000</td><td>280,800</td></tr>
<tr><td>Base</td><td>25%</td><td>135,000</td><td>7,020,000</td><td>84,240,000,000</td><td>351,000</td></tr>
<tr><td>Optimistic</td><td>30%</td><td>162,000</td><td>8,424,000</td><td>101,088,000,000</td><td>421,200</td></tr>
</table>
<p><strong>(e)</strong> Test the weakest links with primary research before spending: a concept test or survey to estimate the share of interested buyers, and a small market test to measure trial and repeat purchase (which checks q). Plan production for the base case, with enough flexibility to move towards either end of the range.</p>
<p><strong>Why:</strong> the chain is multiplicative, so a 20% error in any single link moves the final potential by exactly 20% (20/25 = 0.8, and 5,616,000 / 7,020,000 = 0.8). Research money should go to the most uncertain link — not to refining figures that are already reliable, such as population statistics. Note also that potential is not a forecast: the 5% share depends on the company's marketing effort compared with competitors'.</p>`,
    `<span class="eyebrow">MMG301 · Phần 1 · Bài tập 1</span>
<h2>Bài tập 1 — thị trường trà ít đường lớn cỡ nào?</h2>
<div class="callout"><span class="badge">Đề</span> Một doanh nghiệp khởi nghiệp ngành đồ uống (tình huống giả định, số liệu minh hoạ giả định) dự định bán trà xanh ít đường đóng chai uống liền tại một thành phố. Giả định: dân số trưởng thành 2.000.000 người; tỷ lệ 18–40 tuổi: 45%; trong đó người thường xuyên mua đồ uống đóng chai: 60%; trong đó người quan tâm tới trà ít đường: 25%; một người mua trung bình mua 52 chai mỗi năm (mỗi tuần một chai) với giá trung bình 12.000 đồng. (a) Ước tính số người mua tiềm năng n bằng phương pháp chuỗi tỷ lệ. (b) Tính tổng tiềm năng thị trường theo số chai và theo tiền. (c) Công ty kỳ vọng giành 5% tiềm năng đó trong năm đầu — dự báo doanh số là bao nhiêu? (d) Tỷ lệ "quan tâm" là giả định yếu nhất: tính lại với 20% (bi quan) và 30% (lạc quan). (e) Công ty nên làm gì trước khi cam kết ngân sách ra mắt?</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) n = 2.000.000 × 0,45 × 0,60 × 0,25
      = 900.000 × 0,60 × 0,25 = 540.000 × 0,25 = 135.000 người mua

(b) Q (số lượng) = 135.000 × 52        = 7.020.000 chai mỗi năm
    Q (giá trị)  = 7.020.000 × 12.000  = 84.240.000.000 đồng  (≈ 84,24 tỷ đồng)

(c) Dự báo năm đầu = 5% × 7.020.000 = 351.000 chai
                   = 351.000 × 12.000 = 4.212.000.000 đồng  (≈ 4,21 tỷ đồng)</code></pre>
<table>
<tr><th>(d) Kịch bản</th><th>Quan tâm</th><th>Người mua n</th><th>Tiềm năng (chai)</th><th>Tiềm năng (đồng)</th><th>Dự báo năm đầu với 5% (chai)</th></tr>
<tr><td>Bi quan</td><td>20%</td><td>108.000</td><td>5.616.000</td><td>67.392.000.000</td><td>280.800</td></tr>
<tr><td>Cơ sở</td><td>25%</td><td>135.000</td><td>7.020.000</td><td>84.240.000.000</td><td>351.000</td></tr>
<tr><td>Lạc quan</td><td>30%</td><td>162.000</td><td>8.424.000</td><td>101.088.000.000</td><td>421.200</td></tr>
</table>
<p><strong>(e)</strong> Kiểm tra các mắt xích yếu nhất bằng nghiên cứu sơ cấp trước khi chi tiền: thử nghiệm khái niệm hoặc khảo sát để ước tính tỷ lệ người quan tâm, và một cuộc thử nghiệm thị trường nhỏ để đo tỷ lệ dùng thử và mua lại (qua đó kiểm tra q). Lên kế hoạch sản xuất theo kịch bản cơ sở, đủ linh hoạt để dịch về một trong hai đầu của khoảng.</p>
<p><strong>Vì sao:</strong> chuỗi là phép nhân, nên sai 20% ở bất kỳ mắt xích nào cũng làm tiềm năng cuối cùng lệch đúng 20% (20/25 = 0,8, và 5.616.000 / 7.020.000 = 0,8). Tiền nghiên cứu nên dồn vào mắt xích bất định nhất — không phải để làm tinh những con số vốn đã đáng tin như thống kê dân số. Cũng lưu ý tiềm năng không phải là dự báo: thị phần 5% phụ thuộc vào nỗ lực marketing của công ty so với đối thủ.</p>`,
  ]]);

const c1q = quiz('mmg301-quiz-1', 'Quiz 1 — Planning & market potential|||Quiz 1 — Hoạch định & tiềm năng thị trường', [
  { id: 'q1', question: 'The limit that market demand approaches as industry marketing expenditure approaches infinity, in a given environment, is called…|||Giới hạn mà cầu thị trường tiến tới khi chi tiêu marketing của ngành tiến tới vô hạn, trong một môi trường nhất định, được gọi là…', options: ['the market minimum|||mức cầu tối thiểu của thị trường', 'the market potential|||tiềm năng thị trường', 'the company sales forecast|||dự báo doanh số của công ty', 'the penetrated market|||thị trường đã thâm nhập'], correctIndex: 1, explanation: 'Market potential is the ceiling of the market demand function; the market minimum is demand with no marketing spending, and the sales forecast is what one company expects under its chosen plan.|||Tiềm năng thị trường là mức trần của hàm cầu thị trường; mức cầu tối thiểu là cầu khi không chi marketing, còn dự báo doanh số là mức một công ty kỳ vọng theo kế hoạch đã chọn.' },
  { id: 'q2', question: 'Chain-ratio estimate: base population 1,000,000 × 40% × 50% × 20% buyers; each buys 10 units a year at VND 30,000. Total market potential in value?|||Ước tính chuỗi tỷ lệ: dân số gốc 1.000.000 × 40% × 50% × 20% người mua; mỗi người mua 10 đơn vị/năm với giá 30.000 đồng. Tổng tiềm năng thị trường theo giá trị?', options: ['VND 1.2 billion|||1,2 tỷ đồng', 'VND 4 billion|||4 tỷ đồng', 'VND 12 billion|||12 tỷ đồng', 'VND 120 billion|||120 tỷ đồng'], correctIndex: 2, explanation: 'n = 1,000,000 × 0.4 × 0.5 × 0.2 = 40,000; Q = 40,000 × 10 × 30,000 = VND 12,000,000,000.|||n = 1.000.000 × 0,4 × 0,5 × 0,2 = 40.000; Q = 40.000 × 10 × 30.000 = 12.000.000.000 đồng.' },
  { id: 'q3', question: 'Training and motivating front-line staff so that they deliver the promise made in advertising belongs to which component of holistic marketing?|||Đào tạo và tạo động lực cho nhân viên tuyến đầu để họ thực hiện đúng lời hứa của quảng cáo thuộc thành phần nào của marketing toàn diện?', options: ['Internal marketing|||Marketing nội bộ', 'Performance marketing|||Marketing hiệu quả', 'Relationship marketing|||Marketing quan hệ', 'Integrated marketing|||Marketing tích hợp'], correctIndex: 0, explanation: 'Internal marketing makes sure everyone in the organization — not only the marketing department — embraces serving customers.|||Marketing nội bộ bảo đảm mọi người trong tổ chức — không chỉ phòng marketing — cùng hướng tới phục vụ khách hàng.' },
]);

const c3 = doc('mmg301-2-1-customer-value-clv', '2.1 — Customer value, loyalty, CLV & CRM|||2.1 — Giá trị khách hàng, lòng trung thành, CLV & CRM',
  'Giá trị cảm nhận của khách hàng, đo sự hài lòng và chỉ số NPS, giá trị vòng đời khách hàng (CLV) với công thức đơn giản và giả định đi kèm, tài sản khách hàng, so CLV với CAC, ba đòn bẩy thu hút – giữ chân – phát triển, quản trị quan hệ khách hàng (CRM).',
  [[
    `<span class="eyebrow">MMG301 · Part 2 · Lesson 2.1</span>
<h2>Customer value, loyalty, CLV &amp; CRM</h2>
<p class="lead">Customers buy from the firm they believe offers the highest <strong>customer-perceived value</strong>. Management's job is to raise that value, keep customers satisfied and loyal, and invest more in the customers who are worth more.</p>
<h3>Customer-perceived value</h3>
<pre><code class="language-text">Customer-perceived value = total customer benefit − total customer cost
  benefit: product, services, personnel, image
  cost:    monetary, time, energy, psychological</code></pre>
<p>To win a customer who prefers a rival, a seller can raise benefits (better product, service or image) or lower costs — not only the price, but also time (faster delivery), energy (easier ordering) and psychological cost (less risk, thanks to warranties and easy returns).</p>
<h3>Satisfaction and how to measure it</h3>
<p><strong>Satisfaction</strong> results from comparing perceived performance with expectations: below expectations → dissatisfied; matching → satisfied; exceeding → highly satisfied or delighted. Inflating expectations in advertising can win the first sale but create dissatisfaction later. Measurement tools include periodic surveys, customer loss (churn) rates, mystery shopping, complaint analysis and benchmarking against competitors.</p>
<p>The <strong>Net Promoter Score (NPS)</strong> asks "How likely is it that you would recommend us to a friend or colleague?" on a 0–10 scale:</p>
<pre><code class="language-text">Promoters 9–10 · Passives 7–8 · Detractors 0–6
NPS = % promoters − % detractors            (range −100 to +100)
Illustrative: 400 answers → 220 promoters (55%), 100 passives (25%),
              80 detractors (20%) → NPS = 55 − 20 = 35</code></pre>
<h3>Customer lifetime value (CLV)</h3>
<p><strong>CLV</strong> is the net present value of the stream of future profits expected over a customer's lifetime purchases. A widely used simplified formula assumes a constant annual margin, a constant retention rate and a discount rate:</p>
<pre><code class="language-text">CLV = m / (1 + i − r)
  m = annual contribution margin per customer, received at the end of each year
  r = annual retention rate;   i = annual discount rate
  (the customer is active in year 1 and survives each later year with probability r;
   the horizon is unlimited)
Illustrative: m = 1,000,000; r = 60%; i = 10%
  CLV = 1,000,000 / (1 + 0.10 − 0.60) = 1,000,000 / 0.50 = 2,000,000</code></pre>
<p>Textbooks also use variants — for example m × r / (1 + i − r) when the first-year margin is not counted — so always state your assumptions. Summing the CLV of all current and potential customers gives <strong>customer equity</strong>.</p>
<h3>Three levers: attract, retain, grow</h3>
<ul>
<li><strong>Attract</strong> — compare CLV with the <strong>customer acquisition cost</strong> (CAC = acquisition spending ÷ number of new customers). Paying more to acquire a customer than the customer is worth destroys value.</li>
<li><strong>Retain</strong> — measure the retention rate, find the causes of defection, and fix those that cost less to fix than the profit they lose. Because retention sits in the denominator of CLV, small gains raise CLV sharply.</li>
<li><strong>Grow</strong> — cross-selling and up-selling raise m.</li>
</ul>
<h3>Customer relationship management (CRM)</h3>
<p>CRM manages detailed information about individual customers and all their touchpoints in order to maximize loyalty. Its tools: a customer database; <strong>customer profitability analysis</strong> (many firms find that a minority of customers produces most of the profit while some customers are unprofitable); personalization; loyalty (frequency) and club programmes; service recovery for complaints; and win-back campaigns for lapsed customers.</p>
<div class="callout"><span class="badge">Manager's view</span> Treat customers as assets: acquire them when CLV &gt; CAC, invest in keeping the valuable ones, and do not chase satisfaction scores that do not change behaviour.</div>`,
    `<span class="eyebrow">MMG301 · Phần 2 · Bài 2.1</span>
<h2>Giá trị khách hàng, lòng trung thành, CLV &amp; CRM</h2>
<p class="lead">Khách hàng mua của doanh nghiệp mà họ tin là mang lại <strong>giá trị cảm nhận</strong> cao nhất. Việc của nhà quản trị là nâng giá trị đó, giữ khách hàng hài lòng và trung thành, và đầu tư nhiều hơn vào những khách hàng có giá trị cao hơn.</p>
<h3>Giá trị cảm nhận của khách hàng</h3>
<pre><code class="language-text">Giá trị cảm nhận = tổng lợi ích của khách hàng − tổng chi phí của khách hàng
  lợi ích: sản phẩm, dịch vụ, nhân sự, hình ảnh
  chi phí: tiền bạc, thời gian, công sức, tâm lý</code></pre>
<p>Để giành một khách hàng đang chuộng đối thủ, người bán có thể tăng lợi ích (sản phẩm, dịch vụ hay hình ảnh tốt hơn) hoặc giảm chi phí — không chỉ giá, mà cả thời gian (giao nhanh hơn), công sức (đặt hàng dễ hơn) và chi phí tâm lý (ít rủi ro hơn nhờ bảo hành, đổi trả dễ).</p>
<h3>Sự hài lòng và cách đo</h3>
<p><strong>Sự hài lòng</strong> đến từ việc so kết quả cảm nhận với kỳ vọng: thấp hơn kỳ vọng → không hài lòng; bằng kỳ vọng → hài lòng; vượt kỳ vọng → rất hài lòng hoặc thích thú. Thổi phồng kỳ vọng trong quảng cáo có thể giành được lần mua đầu nhưng gây thất vọng về sau. Công cụ đo gồm khảo sát định kỳ, tỷ lệ mất khách (churn), khách hàng bí mật, phân tích khiếu nại và so sánh với đối thủ.</p>
<p><strong>Chỉ số khách hàng thiện cảm (NPS)</strong> hỏi "Bạn có sẵn lòng giới thiệu chúng tôi cho bạn bè hoặc đồng nghiệp không?" trên thang 0–10:</p>
<pre><code class="language-text">Người ủng hộ 9–10 · Người trung lập 7–8 · Người phản đối 0–6
NPS = % người ủng hộ − % người phản đối      (từ −100 đến +100)
Minh hoạ: 400 câu trả lời → 220 người ủng hộ (55%), 100 trung lập (25%),
          80 phản đối (20%) → NPS = 55 − 20 = 35</code></pre>
<h3>Giá trị vòng đời khách hàng (CLV)</h3>
<p><strong>CLV</strong> là giá trị hiện tại ròng của dòng lợi nhuận tương lai kỳ vọng thu được từ các lần mua của một khách hàng trong suốt thời gian họ gắn bó. Một công thức đơn giản được dùng rộng rãi giả định biên lợi nhuận hằng năm không đổi, tỷ lệ giữ chân không đổi và một lãi suất chiết khấu:</p>
<pre><code class="language-text">CLV = m / (1 + i − r)
  m = số dư đảm phí mỗi khách hàng mỗi năm, nhận vào cuối mỗi năm
  r = tỷ lệ giữ chân hằng năm;   i = lãi suất chiết khấu hằng năm
  (khách chắc chắn còn ở năm 1 và ở lại mỗi năm sau với xác suất r;
   không giới hạn số năm)
Minh hoạ: m = 1.000.000; r = 60%; i = 10%
  CLV = 1.000.000 / (1 + 0,10 − 0,60) = 1.000.000 / 0,50 = 2.000.000</code></pre>
<p>Các giáo trình còn dùng biến thể — ví dụ m × r / (1 + i − r) khi không tính biên lợi nhuận năm đầu — nên luôn ghi rõ giả định. Cộng CLV của mọi khách hàng hiện tại và tiềm năng được <strong>tài sản khách hàng</strong> (customer equity).</p>
<h3>Ba đòn bẩy: thu hút, giữ chân, phát triển</h3>
<ul>
<li><strong>Thu hút</strong> — so CLV với <strong>chi phí thu hút khách hàng</strong> (CAC = chi phí thu hút ÷ số khách hàng mới). Trả để có một khách hàng nhiều hơn giá trị của chính khách hàng đó là phá huỷ giá trị.</li>
<li><strong>Giữ chân</strong> — đo tỷ lệ giữ chân, tìm nguyên nhân khách rời bỏ, và khắc phục những nguyên nhân có chi phí sửa thấp hơn lợi nhuận bị mất. Vì tỷ lệ giữ chân nằm ở mẫu số của CLV, cải thiện nhỏ cũng làm CLV tăng mạnh.</li>
<li><strong>Phát triển</strong> — bán chéo và bán nâng cấp làm tăng m.</li>
</ul>
<h3>Quản trị quan hệ khách hàng (CRM)</h3>
<p>CRM quản lý thông tin chi tiết về từng khách hàng và mọi điểm tiếp xúc của họ để tối đa hoá lòng trung thành. Công cụ: cơ sở dữ liệu khách hàng; <strong>phân tích khả năng sinh lời theo khách hàng</strong> (nhiều doanh nghiệp nhận ra một nhóm nhỏ khách hàng tạo phần lớn lợi nhuận, trong khi một số khách hàng lại gây lỗ); cá nhân hoá; chương trình khách hàng thân thiết (tích điểm) và câu lạc bộ; khắc phục dịch vụ khi có khiếu nại; chiến dịch lôi kéo khách cũ quay lại.</p>
<div class="callout"><span class="badge">Góc nhìn quản trị</span> Hãy coi khách hàng là tài sản: thu hút khi CLV &gt; CAC, đầu tư giữ những khách hàng giá trị, và đừng chạy theo điểm hài lòng nếu nó không làm thay đổi hành vi.</div>`,
  ]]);

const c4 = doc('mmg301-2-2-consumer-business-markets', '2.2 — Analyzing consumer & business markets|||2.2 — Phân tích thị trường người tiêu dùng & thị trường tổ chức',
  'Tâm lý người tiêu dùng mà nhà quản trị dùng (Maslow, Herzberg, nhận thức, trí nhớ liên tưởng), mô hình kỳ vọng – giá trị, lối tắt quyết định và thiên kiến; thị trường tổ chức: đặc điểm, ba tình huống mua, bảy vai trò trong trung tâm mua và tám giai đoạn mua.',
  [[
    `<span class="eyebrow">MMG301 · Part 2 · Lesson 2.2</span>
<h2>Analyzing consumer &amp; business markets</h2>
<p class="lead">MKT101 described the buyer decision process. A manager also needs to know <em>why</em> real buyers deviate from it — and how organizational buying differs, because a business sale is won or lost inside a group of people.</p>
<h3>Consumer psychology that managers use</h3>
<table>
<tr><th>Concept</th><th>Idea</th><th>Implication</th></tr>
<tr><td>Motivation — Maslow</td><td>Needs are arranged from the most to the least pressing: physiological, safety, social, esteem, self-actualization</td><td>Position the offer on the need it really serves</td></tr>
<tr><td>Motivation — Herzberg</td><td>Two factors: <em>dissatisfiers</em> (their absence causes dissatisfaction) and <em>satisfiers</em> (their presence creates satisfaction)</td><td>Remove dissatisfiers first; then add satisfiers competitors lack</td></tr>
<tr><td>Perception</td><td>Selective attention, distortion and retention filter what buyers notice and remember</td><td>Messages must break through and fit existing beliefs</td></tr>
<tr><td>Memory</td><td>Brand knowledge is stored as an associative network of nodes and links</td><td>Build strong, favourable and unique brand associations</td></tr>
</table>
<h3>How consumers actually decide</h3>
<ul>
<li><strong>Expectancy-value model</strong> — buyers form beliefs about each brand on each attribute, weight the attributes by importance and choose the highest total. It is <em>compensatory</em>: a weakness can be offset by a strength.</li>
<li><strong>Non-compensatory shortcuts</strong> — <em>conjunctive</em> (a minimum level on every attribute), <em>lexicographic</em> (the best brand on the most important attribute), <em>elimination-by-aspects</em> (drop brands that fail a cut-off, one attribute at a time).</li>
<li><strong>Heuristics</strong> — <em>availability</em> (what comes to mind easily feels more likely), <em>representativeness</em> (judging by similarity to a typical example — why look-alike packaging works), <em>anchoring and adjustment</em> (a first number, such as a crossed-out "original price", anchors the judgment).</li>
<li><strong>Framing and mental accounting</strong> — the same offer, presented as a gain or as a loss, or placed in a different mental "account", is evaluated differently.</li>
</ul>
<h3>Business (organizational) markets</h3>
<p>Business buyers are fewer and larger; demand is <em>derived</em> from consumer demand; short-run demand is often price-inelastic but <em>fluctuating</em> (a small change in consumer demand can cause a large change in demand for equipment); purchasing is professional and involves many people.</p>
<table>
<tr><th>Buying situation</th><th>Description</th><th>Supplier's task</th></tr>
<tr><td>Straight rebuy</td><td>Routine reorder from an approved list</td><td>"In" suppliers maintain quality and service; "out" suppliers look for an opening</td></tr>
<tr><td>Modified rebuy</td><td>The buyer wants to change specifications, prices, terms or suppliers</td><td>Defend the account, or seize the chance to enter</td></tr>
<tr><td>New task</td><td>First-time purchase; the highest cost and risk, the largest buying centre</td><td>Reach many influencers early with information and support</td></tr>
</table>
<p>The <strong>buying centre</strong> includes everyone who takes part in the decision, playing up to seven roles: <strong>initiators</strong>, <strong>users</strong>, <strong>influencers</strong>, <strong>deciders</strong>, <strong>approvers</strong>, <strong>buyers</strong> and <strong>gatekeepers</strong> (who control the flow of information). A new-task purchase typically moves through eight stages: problem recognition → general need description → product specification → supplier search → proposal solicitation → supplier selection → order-routine specification → performance review.</p>
<div class="callout"><span class="badge">Selling to organizations</span> Map the buying centre before pitching: the user cares about ease of use, the decider about total cost of ownership, the gatekeeper about receiving the right documents on time. One message will not win all of them.</div>`,
    `<span class="eyebrow">MMG301 · Phần 2 · Bài 2.2</span>
<h2>Phân tích thị trường người tiêu dùng &amp; thị trường tổ chức</h2>
<p class="lead">MKT101 đã mô tả quy trình quyết định mua. Nhà quản trị còn cần biết <em>vì sao</em> người mua thật lại lệch khỏi quy trình đó — và việc mua của tổ chức khác ra sao, vì một thương vụ với doanh nghiệp được hay mất ngay bên trong một nhóm người.</p>
<h3>Tâm lý người tiêu dùng mà nhà quản trị vận dụng</h3>
<table>
<tr><th>Khái niệm</th><th>Ý tưởng</th><th>Hàm ý</th></tr>
<tr><td>Động cơ — Maslow</td><td>Nhu cầu được sắp từ cấp bách nhất đến ít cấp bách nhất: sinh lý, an toàn, xã hội, được tôn trọng, tự khẳng định</td><td>Định vị sản phẩm vào đúng nhu cầu mà nó thực sự đáp ứng</td></tr>
<tr><td>Động cơ — Herzberg</td><td>Hai nhóm yếu tố: <em>yếu tố gây bất mãn</em> (thiếu thì gây bất mãn) và <em>yếu tố tạo hài lòng</em> (có thì tạo hài lòng)</td><td>Loại bỏ yếu tố gây bất mãn trước; sau đó thêm yếu tố tạo hài lòng mà đối thủ không có</td></tr>
<tr><td>Nhận thức</td><td>Sự chú ý, bóp méo và ghi nhớ có chọn lọc lọc bớt những gì người mua để ý và nhớ</td><td>Thông điệp phải vượt qua được bộ lọc và phù hợp với niềm tin sẵn có</td></tr>
<tr><td>Trí nhớ</td><td>Hiểu biết về thương hiệu được lưu thành một mạng liên tưởng gồm các nút và liên kết</td><td>Xây liên tưởng thương hiệu mạnh, tích cực và độc đáo</td></tr>
</table>
<h3>Người tiêu dùng thực sự quyết định thế nào</h3>
<ul>
<li><strong>Mô hình kỳ vọng – giá trị</strong> — người mua hình thành niềm tin về từng thương hiệu trên từng thuộc tính, gán trọng số theo mức quan trọng và chọn thương hiệu có tổng điểm cao nhất. Đây là mô hình <em>bù trừ</em>: điểm yếu có thể được bù bằng điểm mạnh.</li>
<li><strong>Lối tắt không bù trừ</strong> — <em>kết hợp</em> (đạt mức tối thiểu ở mọi thuộc tính), <em>từ điển</em> (chọn thương hiệu tốt nhất ở thuộc tính quan trọng nhất), <em>loại trừ theo khía cạnh</em> (loại dần các thương hiệu không đạt ngưỡng, từng thuộc tính một).</li>
<li><strong>Thiên kiến kinh nghiệm (heuristics)</strong> — <em>tính sẵn có</em> (điều dễ nghĩ tới có vẻ dễ xảy ra hơn), <em>tính đại diện</em> (đánh giá theo mức giống một ví dụ điển hình — lý do bao bì na ná có hiệu quả), <em>neo và điều chỉnh</em> (con số đầu tiên, như "giá gốc" bị gạch, trở thành mỏ neo cho phán đoán).</li>
<li><strong>Đóng khung và kế toán tâm lý</strong> — cùng một ưu đãi, trình bày như được hay mất, hoặc đặt vào một "tài khoản" tâm lý khác, sẽ được đánh giá khác nhau.</li>
</ul>
<h3>Thị trường doanh nghiệp (tổ chức)</h3>
<p>Người mua doanh nghiệp ít hơn nhưng quy mô lớn hơn; cầu là <em>cầu phát sinh</em> từ cầu của người tiêu dùng; cầu ngắn hạn thường ít co giãn theo giá nhưng <em>biến động mạnh</em> (một thay đổi nhỏ ở cầu tiêu dùng có thể gây thay đổi lớn ở cầu thiết bị); việc mua mang tính chuyên nghiệp và có nhiều người tham gia.</p>
<table>
<tr><th>Tình huống mua</th><th>Mô tả</th><th>Nhiệm vụ của nhà cung cấp</th></tr>
<tr><td>Mua lại thẳng</td><td>Đặt hàng lại theo thông lệ từ danh sách đã duyệt</td><td>Nhà cung cấp "trong danh sách" giữ chất lượng và dịch vụ; nhà cung cấp "ngoài danh sách" tìm kẽ hở</td></tr>
<tr><td>Mua lại có điều chỉnh</td><td>Người mua muốn đổi quy cách, giá, điều khoản hoặc nhà cung cấp</td><td>Bảo vệ khách hàng hiện có, hoặc chớp cơ hội để chen vào</td></tr>
<tr><td>Mua mới</td><td>Mua lần đầu; chi phí và rủi ro cao nhất, trung tâm mua lớn nhất</td><td>Tiếp cận sớm nhiều người ảnh hưởng bằng thông tin và hỗ trợ</td></tr>
</table>
<p><strong>Trung tâm mua</strong> gồm mọi người tham gia vào quyết định, với tối đa bảy vai trò: <strong>người khởi xướng</strong>, <strong>người sử dụng</strong>, <strong>người ảnh hưởng</strong>, <strong>người quyết định</strong>, <strong>người phê duyệt</strong>, <strong>người mua</strong> và <strong>người gác cổng</strong> (kiểm soát dòng thông tin). Một lần mua mới thường đi qua tám giai đoạn: nhận biết vấn đề → mô tả nhu cầu tổng quát → xác định quy cách sản phẩm → tìm nhà cung cấp → mời chào hàng → chọn nhà cung cấp → xác định quy trình đặt hàng → đánh giá kết quả thực hiện.</p>
<div class="callout"><span class="badge">Bán cho tổ chức</span> Vẽ sơ đồ trung tâm mua trước khi chào hàng: người sử dụng quan tâm tính dễ dùng, người quyết định quan tâm tổng chi phí sở hữu, người gác cổng quan tâm việc nhận đúng giấy tờ đúng hạn. Một thông điệp không thể thuyết phục tất cả.</div>`,
  ]]);

const c3e = doc('mmg301-2-3-exercise', 'Exercise 2 — CLV versus CAC for a subscription service|||Bài tập 2 — So CLV với CAC cho dịch vụ thuê bao',
  'Bài tập tình huống giả định: ứng dụng học tiếng Anh thuê bao — tính CLV bằng công thức m / (1 + i − r) và kiểm bằng bảng 5 năm, tính CAC, tỷ lệ CLV/CAC, thời gian hoàn vốn, rồi so hai phương án: chương trình giữ chân và kênh quảng cáo mới; kèm lời giải.',
  [[
    `<span class="eyebrow">MMG301 · Part 2 · Exercise 2</span>
<h2>Exercise 2 — is a new subscriber worth what we pay for them?</h2>
<div class="callout"><span class="badge">Problem</span> An online English-learning subscription (a fictional case, illustrative numbers) earns an annual contribution margin of m = VND 1,200,000 per customer (VND 100,000 a month). Annual retention is 70% and the discount rate is 10%. Last quarter the company spent VND 900,000,000 on acquisition campaigns and gained 1,000 new subscribers. (a) Compute CLV with CLV = m / (1 + i − r) (margin at the end of each year, customer active in year 1). (b) Compute CAC and the CLV/CAC ratio. (c) How many months of margin recover the CAC (ignoring discounting)? (d) Management considers two options: (1) a retention programme that lifts retention to 80% but costs enough to cut the annual margin to VND 1,100,000; (2) a new advertising channel on which CAC would be VND 1,500,000. Evaluate both.</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) CLV = 1,200,000 / (1 + 0.10 − 0.70) = 1,200,000 / 0.40 = 3,000,000

    Check with the first five years (margin × r^(t−1) / 1.1^t, rounded):
      Year 1  1,200,000 × 1.0000 / 1.1000 = 1,090,909
      Year 2  1,200,000 × 0.7000 / 1.2100 =   694,215
      Year 3  1,200,000 × 0.4900 / 1.3310 =   441,773
      Year 4  1,200,000 × 0.3430 / 1.4641 =   281,128
      Year 5  1,200,000 × 0.2401 / 1.6105 =   178,900
      Five-year total ≈ 2,686,925; later years add ≈ 313,075 → 3,000,000

(b) CAC = 900,000,000 / 1,000 = 900,000
    CLV / CAC = 3,000,000 / 900,000 ≈ 3.33

(c) Payback = 900,000 / 100,000 per month = 9 months

(d1) CLV = 1,100,000 / (1 + 0.10 − 0.80) = 1,100,000 / 0.30 ≈ 3,666,667
(d2) CLV stays 3,000,000; CAC = 1,500,000</code></pre>
<table>
<tr><th>Option</th><th>CLV</th><th>CAC</th><th>CLV / CAC</th><th>Value created per customer (CLV − CAC)</th></tr>
<tr><td>Current</td><td>3,000,000</td><td>900,000</td><td>3.33</td><td>2,100,000</td></tr>
<tr><td>(1) Retention programme</td><td>3,666,667</td><td>900,000</td><td>4.07</td><td>2,766,667</td></tr>
<tr><td>(2) New ad channel</td><td>3,000,000</td><td>1,500,000</td><td>2.00</td><td>1,500,000</td></tr>
</table>
<p><strong>Why:</strong> retention sits in the denominator, so ten extra points of retention raise CLV by about 22% (3,666,667 / 3,000,000 ≈ 1.22) even after a lower margin — option (1) is attractive. Option (2) still creates value per customer (CLV &gt; CAC), so it is worth running <em>if</em> it reaches customers the current channel cannot; judge it on total value created (number of customers × (CLV − CAC)), not on the ratio alone. The "CLV/CAC of about 3" often quoted in industry is a rule of thumb, not a law. Finally, CLV is sensitive to r and i: before deciding, rerun the numbers with a less favourable retention rate.</p>`,
    `<span class="eyebrow">MMG301 · Phần 2 · Bài tập 2</span>
<h2>Bài tập 2 — một thuê bao mới có đáng số tiền ta bỏ ra?</h2>
<div class="callout"><span class="badge">Đề</span> Một ứng dụng học tiếng Anh thuê bao trực tuyến (tình huống giả định, số liệu minh hoạ giả định) thu số dư đảm phí hằng năm m = 1.200.000 đồng mỗi khách hàng (100.000 đồng mỗi tháng). Tỷ lệ giữ chân hằng năm 70%, lãi suất chiết khấu 10%. Quý trước công ty chi 900.000.000 đồng cho các chiến dịch thu hút và có thêm 1.000 thuê bao mới. (a) Tính CLV theo CLV = m / (1 + i − r) (số dư nhận cuối mỗi năm, khách chắc chắn còn ở năm 1). (b) Tính CAC và tỷ lệ CLV/CAC. (c) Cần bao nhiêu tháng số dư để thu hồi CAC (bỏ qua chiết khấu)? (d) Ban lãnh đạo cân nhắc hai phương án: (1) chương trình giữ chân nâng tỷ lệ giữ chân lên 80% nhưng tốn kém tới mức số dư hằng năm giảm còn 1.100.000 đồng; (2) một kênh quảng cáo mới có CAC 1.500.000 đồng. Đánh giá cả hai.</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) CLV = 1.200.000 / (1 + 0,10 − 0,70) = 1.200.000 / 0,40 = 3.000.000

    Kiểm bằng năm năm đầu (số dư × r^(t−1) / 1,1^t, làm tròn):
      Năm 1  1.200.000 × 1,0000 / 1,1000 = 1.090.909
      Năm 2  1.200.000 × 0,7000 / 1,2100 =   694.215
      Năm 3  1.200.000 × 0,4900 / 1,3310 =   441.773
      Năm 4  1.200.000 × 0,3430 / 1,4641 =   281.128
      Năm 5  1.200.000 × 0,2401 / 1,6105 =   178.900
      Cộng năm năm ≈ 2.686.925; các năm sau thêm ≈ 313.075 → 3.000.000

(b) CAC = 900.000.000 / 1.000 = 900.000
    CLV / CAC = 3.000.000 / 900.000 ≈ 3,33

(c) Thời gian hoàn vốn = 900.000 / 100.000 mỗi tháng = 9 tháng

(d1) CLV = 1.100.000 / (1 + 0,10 − 0,80) = 1.100.000 / 0,30 ≈ 3.666.667
(d2) CLV giữ nguyên 3.000.000; CAC = 1.500.000</code></pre>
<table>
<tr><th>Phương án</th><th>CLV</th><th>CAC</th><th>CLV / CAC</th><th>Giá trị tạo ra mỗi khách (CLV − CAC)</th></tr>
<tr><td>Hiện tại</td><td>3.000.000</td><td>900.000</td><td>3,33</td><td>2.100.000</td></tr>
<tr><td>(1) Chương trình giữ chân</td><td>3.666.667</td><td>900.000</td><td>4,07</td><td>2.766.667</td></tr>
<tr><td>(2) Kênh quảng cáo mới</td><td>3.000.000</td><td>1.500.000</td><td>2,00</td><td>1.500.000</td></tr>
</table>
<p><strong>Vì sao:</strong> tỷ lệ giữ chân nằm ở mẫu số, nên thêm mười điểm phần trăm giữ chân làm CLV tăng khoảng 22% (3.666.667 / 3.000.000 ≈ 1,22) dù số dư đã giảm — phương án (1) hấp dẫn. Phương án (2) vẫn tạo giá trị trên mỗi khách hàng (CLV &gt; CAC), nên đáng triển khai <em>nếu</em> nó tiếp cận được những khách hàng mà kênh hiện tại không với tới; hãy đánh giá bằng tổng giá trị tạo ra (số khách × (CLV − CAC)), không chỉ bằng tỷ lệ. Mức "CLV/CAC khoảng 3" hay được nhắc trong giới kinh doanh chỉ là kinh nghiệm, không phải quy luật. Cuối cùng, CLV nhạy với r và i: trước khi quyết định, hãy tính lại với một tỷ lệ giữ chân kém thuận lợi hơn.</p>`,
  ]]);

const c3q = quiz('mmg301-quiz-2', 'Quiz 2 — Customer value & buying behaviour|||Quiz 2 — Giá trị khách hàng & hành vi mua', [
  { id: 'q1', question: 'A survey gets 300 answers: 150 promoters (9–10), 90 passives (7–8) and 60 detractors (0–6). What is the NPS?|||Một khảo sát có 300 câu trả lời: 150 người ủng hộ (9–10), 90 trung lập (7–8) và 60 người phản đối (0–6). NPS là bao nhiêu?', options: ['20|||20', '30|||30', '50|||50', '80|||80'], correctIndex: 1, explanation: 'Promoters 150/300 = 50%, detractors 60/300 = 20%; NPS = 50 − 20 = 30. Passives are not counted.|||Người ủng hộ 150/300 = 50%, người phản đối 60/300 = 20%; NPS = 50 − 20 = 30. Người trung lập không được tính.' },
  { id: 'q2', question: 'Annual margin m = VND 2,000,000, retention r = 75%, discount rate i = 15%. Using CLV = m / (1 + i − r), the CLV is…|||Số dư hằng năm m = 2.000.000 đồng, tỷ lệ giữ chân r = 75%, lãi suất chiết khấu i = 15%. Theo CLV = m / (1 + i − r), CLV bằng…', options: ['VND 3,750,000|||3.750.000 đồng', 'VND 8,000,000|||8.000.000 đồng', 'VND 5,000,000|||5.000.000 đồng', 'VND 2,000,000|||2.000.000 đồng'], correctIndex: 2, explanation: '2,000,000 / (1 + 0.15 − 0.75) = 2,000,000 / 0.40 = 5,000,000. The 8,000,000 answer ignores discounting (m / (1 − r)); 3,750,000 uses the variant m × r / (1 + i − r).|||2.000.000 / (1 + 0,15 − 0,75) = 2.000.000 / 0,40 = 5.000.000. Đáp án 8.000.000 bỏ qua chiết khấu (m / (1 − r)); 3.750.000 là biến thể m × r / (1 + i − r).' },
  { id: 'q3', question: 'In a business buying centre, the purchasing assistant who decides which supplier brochures reach the engineers plays the role of…|||Trong trung tâm mua của doanh nghiệp, trợ lý mua hàng quyết định tài liệu nào của nhà cung cấp được chuyển tới các kỹ sư đóng vai trò…', options: ['gatekeeper|||người gác cổng', 'influencer|||người ảnh hưởng', 'approver|||người phê duyệt', 'decider|||người quyết định'], correctIndex: 0, explanation: 'Gatekeepers control the flow of information to the other members of the buying centre, so suppliers must win their cooperation too.|||Người gác cổng kiểm soát dòng thông tin tới các thành viên khác của trung tâm mua, nên nhà cung cấp cũng phải có được sự hợp tác của họ.' },
]);

const c5 = doc('mmg301-3-1-positioning-brand-equity', '3.1 — Brand positioning & brand equity|||3.1 — Định vị & tài sản thương hiệu',
  'Khung tham chiếu cạnh tranh, điểm tương đồng và điểm khác biệt; tài sản thương hiệu dựa trên khách hàng (CBBE) và kim tự tháp cộng hưởng thương hiệu của Keller; tiêu chí chọn yếu tố thương hiệu, chuỗi giá trị thương hiệu, kiến trúc thương hiệu và mở rộng thương hiệu.',
  [[
    `<span class="eyebrow">MMG301 · Part 3 · Lesson 3.1</span>
<h2>Brand positioning &amp; brand equity</h2>
<p class="lead">Positioning decides <em>what place</em> the brand should hold in the target customer's mind; brand equity is the <em>value</em> that place creates. Both are built deliberately and measured, not left to chance.</p>
<h3>Positioning: frame, parity and difference</h3>
<ul>
<li><strong>Competitive frame of reference</strong> — the category and competitors the brand is compared with: a ready-to-drink tea may be framed against other teas, soft drinks or bottled water, each calling for a different message.</li>
<li><strong>Points of parity (POPs)</strong> — associations the brand must share: to be a credible member of the category (<em>category</em> POPs), to neutralize doubts created by its own strengths (<em>correlational</em> POPs, e.g. "low price, yet reliable"), or to cancel competitors' advantages (<em>competitive</em> POPs).</li>
<li><strong>Points of difference (PODs)</strong> — attributes or benefits customers strongly associate with the brand, evaluate positively and believe they cannot find to the same extent elsewhere. A good POD is <em>desirable</em> to customers, <em>deliverable</em> by the company and <em>differentiating</em> from competitors.</li>
</ul>
<h3>Customer-based brand equity (CBBE)</h3>
<p>Keller defines customer-based brand equity as the differential effect that brand knowledge has on consumer response to the marketing of that brand. His <strong>brand resonance pyramid</strong> builds a brand in four ascending steps, each answering a customer question:</p>
<table>
<tr><th>Step</th><th>Customer's question</th><th>Building blocks</th></tr>
<tr><td>1. Identity</td><td>Who are you?</td><td><strong>Salience</strong> — how easily and in how many situations the brand comes to mind (depth and breadth of awareness)</td></tr>
<tr><td>2. Meaning</td><td>What are you?</td><td><strong>Performance</strong> (how well it meets functional needs) and <strong>imagery</strong> (the psychological and social needs it meets)</td></tr>
<tr><td>3. Response</td><td>What about you?</td><td><strong>Judgments</strong> (quality, credibility, consideration, superiority) and <strong>feelings</strong> (warmth, fun, excitement, security, social approval, self-respect)</td></tr>
<tr><td>4. Relationships</td><td>What about you and me?</td><td><strong>Resonance</strong> — behavioural loyalty, attitudinal attachment, sense of community, active engagement</td></tr>
</table>
<p>Performance and judgments form the "rational route", imagery and feelings the "emotional route"; strong brands build both, and resonance is reachable only on top of them.</p>
<h3>Brand elements and the brand value chain</h3>
<p>Brand elements (name, logo, symbol, slogan, packaging) should be <strong>memorable, meaningful and likable</strong> (to build the brand) and <strong>transferable, adaptable and protectable</strong> (to defend it). The <strong>brand value chain</strong> traces how value is created: marketing program investment → customer mindset (awareness, associations, attitudes, attachment, activity) → brand performance in the market (price premiums, share, successful extensions) → shareholder value.</p>
<h3>Brand architecture</h3>
<table>
<tr><th>Strategy</th><th>How it works</th><th>Trade-off</th></tr>
<tr><td>Branded house (master brand)</td><td>One corporate name across all products</td><td>Efficient, trust transfers easily — but one failure can hurt every product</td></tr>
<tr><td>House of brands</td><td>Separate brand names; the parent stays in the background</td><td>Each brand owns its segment — but each needs its own budget</td></tr>
<tr><td>Sub-brand</td><td>Master brand plus a new name</td><td>Links existing trust to a distinct offer</td></tr>
<tr><td>Endorsed brand</td><td>A stand-alone brand "backed" by the parent</td><td>Adds credibility with limited risk to the parent</td></tr>
</table>
<p><strong>Brand extensions</strong> cut launch costs, but a poor fit dilutes the parent brand — test perceived fit first.</p>
<div class="callout"><span class="badge">Measure it</span> Examine brand equity with a <em>brand audit</em> (a comprehensive review of its sources) and follow it with regular <em>brand tracking</em> of salience, associations, preference and loyalty.</div>`,
    `<span class="eyebrow">MMG301 · Phần 3 · Bài 3.1</span>
<h2>Định vị &amp; tài sản thương hiệu</h2>
<p class="lead">Định vị quyết định thương hiệu nên chiếm <em>chỗ nào</em> trong tâm trí khách hàng mục tiêu; tài sản thương hiệu là <em>giá trị</em> mà chỗ đứng đó tạo ra. Cả hai đều phải được xây dựng có chủ đích và đo lường, không phó mặc cho may rủi.</p>
<h3>Định vị: khung tham chiếu, tương đồng và khác biệt</h3>
<ul>
<li><strong>Khung tham chiếu cạnh tranh</strong> — ngành hàng và các đối thủ mà thương hiệu được đem ra so sánh: một loại trà uống liền có thể được đặt cạnh các loại trà khác, nước ngọt hoặc nước đóng chai, mỗi khung đòi hỏi một thông điệp khác.</li>
<li><strong>Điểm tương đồng (POP)</strong> — những liên tưởng thương hiệu buộc phải có: để là thành viên đáng tin của ngành hàng (POP <em>ngành hàng</em>), để hoá giải nghi ngờ do chính điểm mạnh của mình gây ra (POP <em>tương quan</em>, vd "giá thấp mà vẫn bền"), hoặc để vô hiệu hoá lợi thế của đối thủ (POP <em>cạnh tranh</em>).</li>
<li><strong>Điểm khác biệt (POD)</strong> — thuộc tính hoặc lợi ích mà khách hàng liên tưởng mạnh với thương hiệu, đánh giá tích cực và tin rằng không tìm được ở mức tương đương nơi khác. Một POD tốt phải <em>đáng mong muốn</em> với khách hàng, <em>thực hiện được</em> bởi công ty và <em>khác biệt</em> so với đối thủ.</li>
</ul>
<h3>Tài sản thương hiệu dựa trên khách hàng (CBBE)</h3>
<p>Keller định nghĩa tài sản thương hiệu dựa trên khách hàng là tác động khác biệt mà hiểu biết về thương hiệu tạo ra lên phản ứng của người tiêu dùng đối với hoạt động marketing của thương hiệu đó. <strong>Kim tự tháp cộng hưởng thương hiệu</strong> của ông xây thương hiệu qua bốn bậc đi lên, mỗi bậc trả lời một câu hỏi của khách hàng:</p>
<table>
<tr><th>Bậc</th><th>Câu hỏi của khách hàng</th><th>Khối xây dựng</th></tr>
<tr><td>1. Nhận diện</td><td>Bạn là ai?</td><td><strong>Mức độ nổi bật</strong> — thương hiệu hiện lên trong đầu dễ dàng tới đâu và trong bao nhiêu tình huống (độ sâu và độ rộng của nhận biết)</td></tr>
<tr><td>2. Ý nghĩa</td><td>Bạn là gì?</td><td><strong>Công năng</strong> (đáp ứng nhu cầu chức năng tốt tới đâu) và <strong>hình tượng</strong> (nhu cầu tâm lý, xã hội mà nó đáp ứng)</td></tr>
<tr><td>3. Phản hồi</td><td>Tôi nghĩ gì về bạn?</td><td><strong>Đánh giá</strong> (chất lượng, uy tín, mức được cân nhắc, tính vượt trội) và <strong>cảm xúc</strong> (ấm áp, vui vẻ, hào hứng, an tâm, được xã hội công nhận, tự trọng)</td></tr>
<tr><td>4. Quan hệ</td><td>Giữa bạn và tôi thì sao?</td><td><strong>Cộng hưởng</strong> — trung thành về hành vi, gắn bó về thái độ, cảm giác cộng đồng, chủ động tham gia</td></tr>
</table>
<p>Công năng và đánh giá tạo nên "con đường lý trí", hình tượng và cảm xúc là "con đường cảm xúc"; thương hiệu mạnh xây cả hai, và chỉ trên nền đó mới đạt được sự cộng hưởng.</p>
<h3>Yếu tố thương hiệu và chuỗi giá trị thương hiệu</h3>
<p>Các yếu tố thương hiệu (tên, logo, biểu tượng, khẩu hiệu, bao bì) nên <strong>dễ nhớ, có ý nghĩa và dễ mến</strong> (để xây thương hiệu) và <strong>dễ chuyển đổi, dễ thích nghi, bảo hộ được</strong> (để bảo vệ thương hiệu). <strong>Chuỗi giá trị thương hiệu</strong> lần theo cách giá trị được tạo ra: đầu tư vào chương trình marketing → tâm trí khách hàng (nhận biết, liên tưởng, thái độ, gắn bó, hoạt động) → kết quả thương hiệu trên thị trường (giá bán cao hơn, thị phần, mở rộng thành công) → giá trị cho cổ đông.</p>
<h3>Kiến trúc thương hiệu</h3>
<table>
<tr><th>Chiến lược</th><th>Cách vận hành</th><th>Đánh đổi</th></tr>
<tr><td>Ngôi nhà thương hiệu (thương hiệu chủ)</td><td>Một tên doanh nghiệp dùng cho mọi sản phẩm</td><td>Tiết kiệm, niềm tin lan toả dễ — nhưng một thất bại có thể ảnh hưởng mọi sản phẩm</td></tr>
<tr><td>Ngôi nhà của các thương hiệu</td><td>Các tên thương hiệu riêng biệt; công ty mẹ đứng phía sau</td><td>Mỗi thương hiệu làm chủ phân khúc của mình — nhưng mỗi cái cần ngân sách riêng</td></tr>
<tr><td>Thương hiệu phụ</td><td>Thương hiệu chủ cộng một tên mới</td><td>Nối niềm tin sẵn có với một sản phẩm khác biệt</td></tr>
<tr><td>Thương hiệu bảo chứng</td><td>Một thương hiệu độc lập được công ty mẹ "đứng sau bảo lãnh"</td><td>Tăng uy tín mà rủi ro cho công ty mẹ hạn chế</td></tr>
</table>
<p><strong>Mở rộng thương hiệu</strong> giảm chi phí ra mắt, nhưng nếu không phù hợp sẽ làm loãng thương hiệu gốc — hãy kiểm tra mức phù hợp cảm nhận trước.</p>
<div class="callout"><span class="badge">Hãy đo</span> Rà soát tài sản thương hiệu bằng <em>kiểm toán thương hiệu</em> (đánh giá toàn diện các nguồn tạo tài sản) và <em>theo dõi thương hiệu</em> định kỳ về mức độ nổi bật, liên tưởng, ưa chuộng và trung thành.</div>`,
  ]]);

const c6 = doc('mmg301-3-2-competitive-dynamics', '3.2 — Competitive dynamics: leaders, challengers, followers & nichers|||3.2 — Động thái cạnh tranh: dẫn đầu, thách thức, theo sau & nép góc',
  'Nhận diện đối thủ theo góc nhìn ngành và thị trường, phân tích giá trị khách hàng; chiến lược của doanh nghiệp dẫn đầu (mở rộng thị trường, sáu kiểu phòng thủ, tăng thị phần), thách thức (năm kiểu tấn công), theo sau (nhân bản, mô phỏng, cải biến) và nép góc.',
  [[
    `<span class="eyebrow">MMG301 · Part 3 · Lesson 3.2</span>
<h2>Competitive dynamics</h2>
<p class="lead">Strategy depends on the firm's role in its target market. A classic textbook illustration of market structure: the leader holds about 40% of the market, the challenger 30%, followers 20% and nichers the remaining 10%.</p>
<h3>Identifying and analysing competitors</h3>
<p>Competitors include not only firms selling the same product (<em>industry view</em>) but all firms satisfying the same customer need (<em>market view</em>) — a cinema competes with streaming services and cafés for an evening out. For each key competitor, analyse objectives, strategy, strengths, weaknesses and likely reactions. A <strong>customer value analysis</strong> asks customers to rate the firm and its rivals on the attributes they value most, revealing where to attack and where to defend.</p>
<h3>Market-leader strategies</h3>
<ul>
<li><strong>Expand total market demand</strong> — find new customers (new segments or regions) or increase usage (more occasions, larger quantities). The leader gains most when the whole market grows.</li>
<li><strong>Protect market share</strong> with a defence: <em>position</em> (build a strong brand that is hard to attack), <em>flank</em> (guard weak fronts, e.g. with a lower-priced fighter brand), <em>pre-emptive</em> (attack before the rival does), <em>counteroffensive</em> (strike back, e.g. in the attacker's core market), <em>mobile</em> (broaden or diversify into new territories) and <em>contraction</em> (withdraw from weak markets to concentrate strength).</li>
<li><strong>Increase market share</strong> — only when the extra share is profitable: winning share can cost more than it is worth, and competition authorities may step in.</li>
</ul>
<h3>Market-challenger strategies</h3>
<p>First define the strategic objective and the opponent: the leader, firms of similar size that are underperforming, or small local firms. Then choose an attack:</p>
<table>
<tr><th>Attack</th><th>Idea</th></tr>
<tr><td>Frontal</td><td>Match the opponent's product, price and promotion — requires superior resources</td></tr>
<tr><td>Flank</td><td>Attack regions or segments where the opponent is weak or absent</td></tr>
<tr><td>Encirclement</td><td>A grand offensive on several fronts at once, to capture a large part of the opponent's territory</td></tr>
<tr><td>Bypass</td><td>Avoid confrontation: diversify into unrelated products or new markets, or leapfrog with a new technology</td></tr>
<tr><td>Guerrilla</td><td>Small, intermittent attacks (selective price cuts, bursts of promotion) to harass and weaken the opponent</td></tr>
</table>
<h3>Followers and nichers</h3>
<p><strong>Market followers</strong> avoid costly battles and build on the leader's innovations: <em>cloners</em> emulate the leader's products and packaging closely; <em>imitators</em> copy some things but differentiate on packaging, advertising or pricing; <em>adapters</em> improve on the leader's products, often for different markets, and may later become challengers. <em>Counterfeiters</em>, who sell fakes, act illegally and are not a legitimate strategy.</p>
<p><strong>Market nichers</strong> serve small segments that larger firms ignore and earn high margins through specialization — by end user, customer size, specific customer, geography, product feature, quality-price level, service or channel. The main risk is that the niche dries up or is attacked; <em>multiple niching</em> spreads that risk.</p>
<div class="callout"><span class="badge">Balance</span> A purely competitor-centred firm gets trapped in tit-for-tat moves; a purely customer-centred firm may be surprised by rivals. Good strategy watches both — and starts from what customers value.</div>`,
    `<span class="eyebrow">MMG301 · Phần 3 · Bài 3.2</span>
<h2>Động thái cạnh tranh</h2>
<p class="lead">Chiến lược phụ thuộc vào vai trò của doanh nghiệp trên thị trường mục tiêu. Một minh hoạ kinh điển trong giáo trình về cấu trúc thị trường: người dẫn đầu nắm khoảng 40% thị trường, người thách thức 30%, những người theo sau 20% và người nép góc 10% còn lại.</p>
<h3>Nhận diện và phân tích đối thủ</h3>
<p>Đối thủ không chỉ là doanh nghiệp bán cùng sản phẩm (<em>góc nhìn ngành</em>) mà là mọi doanh nghiệp thoả mãn cùng một nhu cầu của khách hàng (<em>góc nhìn thị trường</em>) — rạp chiếu phim cạnh tranh với dịch vụ xem phim trực tuyến và quán cà phê cho một buổi tối đi chơi. Với mỗi đối thủ chính, phân tích mục tiêu, chiến lược, điểm mạnh, điểm yếu và khả năng phản ứng. <strong>Phân tích giá trị khách hàng</strong> đề nghị khách hàng chấm điểm doanh nghiệp và các đối thủ trên những thuộc tính họ coi trọng nhất, từ đó thấy nên tấn công ở đâu và phòng thủ ở đâu.</p>
<h3>Chiến lược của người dẫn đầu thị trường</h3>
<ul>
<li><strong>Mở rộng tổng cầu thị trường</strong> — tìm khách hàng mới (phân khúc hoặc khu vực mới) hoặc tăng mức sử dụng (thêm dịp dùng, dùng nhiều hơn). Người dẫn đầu được lợi nhiều nhất khi cả thị trường lớn lên.</li>
<li><strong>Bảo vệ thị phần</strong> bằng phòng thủ: <em>vị trí</em> (xây thương hiệu mạnh khó bị tấn công), <em>bên sườn</em> (canh giữ mặt yếu, vd bằng một thương hiệu giá thấp để đối đầu), <em>phủ đầu</em> (tấn công trước khi đối thủ ra tay), <em>phản công</em> (đánh trả, vd vào thị trường cốt lõi của kẻ tấn công), <em>cơ động</em> (mở rộng hoặc đa dạng hoá sang lãnh địa mới) và <em>co cụm</em> (rút khỏi thị trường yếu để dồn lực).</li>
<li><strong>Tăng thị phần</strong> — chỉ khi phần tăng thêm có lãi: giành thị phần có thể tốn hơn giá trị nó mang lại, và cơ quan quản lý cạnh tranh có thể can thiệp.</li>
</ul>
<h3>Chiến lược của người thách thức</h3>
<p>Trước hết xác định mục tiêu chiến lược và đối thủ: người dẫn đầu, các doanh nghiệp cùng quy mô đang làm ăn kém, hoặc các doanh nghiệp nhỏ ở địa phương. Sau đó chọn cách tấn công:</p>
<table>
<tr><th>Kiểu tấn công</th><th>Ý tưởng</th></tr>
<tr><td>Trực diện</td><td>Đối chọi ngang bằng sản phẩm, giá và xúc tiến của đối thủ — đòi hỏi nguồn lực vượt trội</td></tr>
<tr><td>Bên sườn</td><td>Tấn công vào khu vực hoặc phân khúc mà đối thủ yếu hoặc bỏ trống</td></tr>
<tr><td>Bao vây</td><td>Tổng tấn công trên nhiều mặt trận cùng lúc để chiếm phần lớn lãnh địa của đối thủ</td></tr>
<tr><td>Đánh vòng</td><td>Tránh đối đầu: đa dạng hoá sang sản phẩm không liên quan hoặc thị trường mới, hoặc nhảy vọt bằng công nghệ mới</td></tr>
<tr><td>Du kích</td><td>Những đòn nhỏ, rải rác (giảm giá cục bộ, khuyến mại dồn dập từng đợt) để quấy rối và làm suy yếu đối thủ</td></tr>
</table>
<h3>Người theo sau và người nép góc</h3>
<p><strong>Người theo sau</strong> tránh những cuộc chiến tốn kém và dựa trên đổi mới của người dẫn đầu: <em>người nhân bản</em> mô phỏng sát sản phẩm và bao bì của người dẫn đầu; <em>người mô phỏng</em> sao chép một số điểm nhưng khác biệt ở bao bì, quảng cáo hoặc giá; <em>người cải biến</em> cải tiến sản phẩm của người dẫn đầu, thường cho thị trường khác, và về sau có thể thành người thách thức. <em>Kẻ làm giả</em> bán hàng nhái là hành vi phạm pháp, không phải một chiến lược chính đáng.</p>
<p><strong>Người nép góc</strong> phục vụ những phân khúc nhỏ mà doanh nghiệp lớn bỏ qua và thu biên lợi nhuận cao nhờ chuyên môn hoá — theo người dùng cuối, quy mô khách hàng, khách hàng cụ thể, địa lý, tính năng sản phẩm, mức chất lượng – giá, dịch vụ hoặc kênh. Rủi ro chính là thị trường ngách cạn kiệt hoặc bị tấn công; <em>nép nhiều góc</em> giúp dàn trải rủi ro đó.</p>
<div class="callout"><span class="badge">Cân bằng</span> Doanh nghiệp chỉ nhìn đối thủ sẽ sa vào vòng ăn miếng trả miếng; doanh nghiệp chỉ nhìn khách hàng có thể bị đối thủ bất ngờ. Chiến lược tốt quan sát cả hai — và bắt đầu từ điều khách hàng coi trọng.</div>`,
  ]]);

const c7 = doc('mmg301-3-3-product-service-pricing', '3.3 — Product, service & pricing strategy|||3.3 — Chiến lược sản phẩm, dịch vụ & giá',
  'Danh mục và dòng sản phẩm, mô hình năm khoảng cách chất lượng dịch vụ và năm yếu tố của SERVQUAL (mô tả định tính), khuếch tán đổi mới, sáu bước định giá, độ co giãn của cầu và phép tính số dư đảm phí khi giảm hoặc tăng giá.',
  [[
    `<span class="eyebrow">MMG301 · Part 3 · Lesson 3.3</span>
<h2>Product, service &amp; pricing strategy</h2>
<p class="lead">The offering is where positioning becomes real. Managers shape the product mix, close the gaps in service quality, manage the adoption of innovations — and set prices that capture the value they create.</p>
<h3>Product mix and line decisions</h3>
<p>A product mix has <strong>width</strong> (number of lines), <strong>length</strong> (total items), <strong>depth</strong> (variants per product) and <strong>consistency</strong> (how closely lines relate). Line decisions: <em>stretching</em> (down-market, up-market or both), <em>filling</em>, <em>modernizing</em>, <em>featuring</em> and <em>pruning</em> weak items.</p>
<h3>Service quality: the gaps model</h3>
<p>Parasuraman, Zeithaml and Berry identified five gaps that cause unsuccessful service delivery:</p>
<ol>
<li>Between customer expectations and <strong>management's perception</strong> of those expectations.</li>
<li>Between management's perception and the <strong>service-quality specifications</strong>.</li>
<li>Between the specifications and actual <strong>service delivery</strong> (staff poorly trained or overloaded).</li>
<li>Between service delivery and <strong>external communications</strong> (advertising promises more than is delivered).</li>
<li>Between <strong>perceived</strong> service and <strong>expected</strong> service — the customer's gap, the result of gaps 1–4.</li>
</ol>
<p>The same researchers identified five determinants of service quality, measured by the SERVQUAL questionnaire, which compares what customers expect with what they perceive: <strong>reliability</strong> (performing the promised service dependably and accurately), <strong>responsiveness</strong> (willingness to help promptly), <strong>assurance</strong> (knowledge, courtesy and the ability to convey trust), <strong>empathy</strong> (caring, individualized attention) and <strong>tangibles</strong> (facilities, equipment, staff appearance, materials).</p>
<h3>Innovation adoption</h3>
<p>Adopter categories along the diffusion curve: innovators (2.5%), early adopters (13.5%), early majority (34%), late majority (34%) and laggards (16%). Adoption is faster when an innovation has a clear <strong>relative advantage</strong>, high <strong>compatibility</strong> with users' values and habits, low <strong>complexity</strong>, <strong>divisibility</strong> (it can be tried on a limited basis) and <strong>communicability</strong> (its results are easy to observe and describe).</p>
<h3>Setting the price in six steps</h3>
<ol>
<li>Select the pricing objective — survival, maximum current profit, maximum market share, market skimming or product-quality leadership.</li>
<li>Determine demand — price sensitivity and the <strong>price elasticity</strong> of demand: E = % change in quantity ÷ % change in price.</li>
<li>Estimate costs — including how costs fall with accumulated production and differ by customer.</li>
<li>Analyse competitors' costs, prices and offers.</li>
<li>Select a pricing method — markup, target-return, <em>perceived-value</em>, <em>value</em> pricing (including everyday low pricing versus high-low pricing), going-rate or auction-type pricing.</li>
<li>Select the final price — considering psychological effects, the rest of the mix, company policy, and the impact on channel partners, the sales force, competitors and regulators.</li>
</ol>
<h3>The arithmetic of a price change</h3>
<pre><code class="language-text">Illustrative: price 100,000; variable cost 60,000 → contribution margin m = 40%
Cut the price by d = 10% → new unit contribution 30,000 (was 40,000)
Volume increase needed to keep total contribution = d / (m − d)
                                                   = 0.10 / (0.40 − 0.10) ≈ 33.3%
If volume rises only 25% (E = +25% / −10% = −2.5, elastic demand):
  revenue      : 0.90 × 1.25 = 1.125           → +12.5%
  contribution : 30,000 × 1.25 = 37,500 vs 40,000 → −6.25%
Raise the price by d = 10% → volume may fall by up to d / (m + d)
                                                   = 0.10 / 0.50 = 20% before contribution drops</code></pre>
<div class="callout"><span class="badge">Trap</span> A price cut can raise revenue and still lower profit. Check the break-even volume change before cutting — and remember that competitors may follow, erasing the volume gain.</div>`,
    `<span class="eyebrow">MMG301 · Phần 3 · Bài 3.3</span>
<h2>Chiến lược sản phẩm, dịch vụ &amp; giá</h2>
<p class="lead">Sản phẩm chào bán là nơi định vị trở thành hiện thực. Nhà quản trị định hình danh mục sản phẩm, thu hẹp các khoảng cách chất lượng dịch vụ, quản lý việc chấp nhận đổi mới — và đặt giá để thu về giá trị mà mình tạo ra.</p>
<h3>Danh mục và dòng sản phẩm</h3>
<p>Danh mục sản phẩm có <strong>chiều rộng</strong> (số dòng), <strong>chiều dài</strong> (tổng số mặt hàng), <strong>chiều sâu</strong> (số biến thể mỗi sản phẩm) và <strong>độ đồng nhất</strong> (các dòng liên quan chặt tới đâu). Quyết định về dòng: <em>kéo dãn</em> (xuống cấp thấp, lên cấp cao hoặc cả hai), <em>lấp đầy</em>, <em>hiện đại hoá</em>, <em>làm nổi bật</em> và <em>cắt tỉa</em> mặt hàng yếu.</p>
<h3>Chất lượng dịch vụ: mô hình khoảng cách</h3>
<p>Parasuraman, Zeithaml và Berry chỉ ra năm khoảng cách khiến dịch vụ không thành công:</p>
<ol>
<li>Giữa kỳ vọng của khách hàng và <strong>nhận thức của nhà quản lý</strong> về kỳ vọng đó.</li>
<li>Giữa nhận thức của nhà quản lý và <strong>tiêu chuẩn chất lượng dịch vụ</strong> được đặt ra.</li>
<li>Giữa tiêu chuẩn và việc <strong>cung ứng dịch vụ</strong> thực tế (nhân viên thiếu đào tạo hoặc quá tải).</li>
<li>Giữa dịch vụ cung ứng và <strong>truyền thông bên ngoài</strong> (quảng cáo hứa nhiều hơn thực tế).</li>
<li>Giữa dịch vụ <strong>cảm nhận</strong> và dịch vụ <strong>kỳ vọng</strong> — khoảng cách của khách hàng, là hệ quả của khoảng cách 1–4.</li>
</ol>
<p>Cũng các nhà nghiên cứu này xác định năm yếu tố quyết định chất lượng dịch vụ, được đo bằng bảng hỏi SERVQUAL (so sánh điều khách hàng kỳ vọng với điều họ cảm nhận): <strong>độ tin cậy</strong> (thực hiện dịch vụ đã hứa một cách ổn định và chính xác), <strong>khả năng đáp ứng</strong> (sẵn lòng giúp đỡ nhanh chóng), <strong>sự đảm bảo</strong> (kiến thức, sự lịch sự và khả năng tạo niềm tin), <strong>sự đồng cảm</strong> (quan tâm, chăm sóc từng cá nhân) và <strong>phương tiện hữu hình</strong> (cơ sở vật chất, thiết bị, diện mạo nhân viên, tài liệu).</p>
<h3>Chấp nhận đổi mới</h3>
<p>Các nhóm người chấp nhận dọc đường khuếch tán: người đổi mới (2,5%), người chấp nhận sớm (13,5%), đa số sớm (34%), đa số muộn (34%) và người chậm chân (16%). Việc chấp nhận diễn ra nhanh hơn khi đổi mới có <strong>lợi thế tương đối</strong> rõ ràng, <strong>tính tương thích</strong> cao với giá trị và thói quen của người dùng, <strong>độ phức tạp</strong> thấp, <strong>khả năng dùng thử từng phần</strong> và <strong>khả năng truyền đạt</strong> (kết quả dễ thấy, dễ mô tả).</p>
<h3>Định giá qua sáu bước</h3>
<ol>
<li>Chọn mục tiêu định giá — tồn tại, tối đa hoá lợi nhuận hiện tại, tối đa hoá thị phần, hớt váng thị trường hoặc dẫn đầu về chất lượng sản phẩm.</li>
<li>Xác định cầu — độ nhạy cảm về giá và <strong>độ co giãn của cầu theo giá</strong>: E = % thay đổi lượng cầu ÷ % thay đổi giá.</li>
<li>Ước tính chi phí — kể cả việc chi phí giảm theo sản lượng tích luỹ và khác nhau theo khách hàng.</li>
<li>Phân tích chi phí, giá và sản phẩm chào bán của đối thủ.</li>
<li>Chọn phương pháp định giá — cộng lãi, theo lợi nhuận mục tiêu, <em>theo giá trị cảm nhận</em>, <em>theo giá trị</em> (gồm giá thấp hằng ngày so với giá cao – thấp luân phiên), theo giá hiện hành hoặc kiểu đấu giá.</li>
<li>Chọn giá cuối cùng — cân nhắc tác động tâm lý, các yếu tố còn lại của marketing mix, chính sách công ty, và ảnh hưởng tới đối tác kênh, lực lượng bán hàng, đối thủ và cơ quan quản lý.</li>
</ol>
<h3>Phép tính khi thay đổi giá</h3>
<pre><code class="language-text">Minh hoạ: giá 100.000; chi phí biến đổi 60.000 → tỷ lệ số dư đảm phí m = 40%
Giảm giá d = 10% → số dư đảm phí mỗi đơn vị còn 30.000 (trước là 40.000)
Sản lượng phải tăng để giữ nguyên tổng số dư = d / (m − d)
                                             = 0,10 / (0,40 − 0,10) ≈ 33,3%
Nếu sản lượng chỉ tăng 25% (E = +25% / −10% = −2,5, cầu co giãn):
  doanh thu    : 0,90 × 1,25 = 1,125               → +12,5%
  số dư đảm phí: 30.000 × 1,25 = 37.500 so với 40.000 → −6,25%
Tăng giá d = 10% → sản lượng được phép giảm tối đa d / (m + d)
                                             = 0,10 / 0,50 = 20% trước khi tổng số dư giảm</code></pre>
<div class="callout"><span class="badge">Cái bẫy</span> Giảm giá có thể làm tăng doanh thu mà vẫn giảm lợi nhuận. Hãy tính mức thay đổi sản lượng hoà vốn trước khi giảm giá — và nhớ rằng đối thủ có thể giảm theo, xoá mất phần sản lượng tăng thêm.</div>`,
  ]]);

const c5q = quiz('mmg301-quiz-3', 'Quiz 3 — Brands, competition & the offering|||Quiz 3 — Thương hiệu, cạnh tranh & sản phẩm chào bán', [
  { id: 'q1', question: 'In Keller’s brand resonance pyramid, the customer question "What about you and me?" at the top corresponds to…|||Trong kim tự tháp cộng hưởng thương hiệu của Keller, câu hỏi của khách hàng "Giữa bạn và tôi thì sao?" ở đỉnh ứng với…', options: ['salience|||mức độ nổi bật', 'performance and imagery|||công năng và hình tượng', 'judgments and feelings|||đánh giá và cảm xúc', 'resonance|||sự cộng hưởng'], correctIndex: 3, explanation: 'Resonance — loyalty, attachment, community and engagement — is the relationship level, reachable only after salience, meaning and response are built.|||Cộng hưởng — trung thành, gắn bó, cộng đồng và chủ động tham gia — là cấp độ quan hệ, chỉ đạt được sau khi đã xây mức độ nổi bật, ý nghĩa và phản hồi.' },
  { id: 'q2', question: 'A challenger avoids direct confrontation with the leader by leapfrogging to a new technology. This is a…|||Người thách thức tránh đối đầu trực tiếp với người dẫn đầu bằng cách nhảy vọt sang công nghệ mới. Đây là kiểu tấn công…', options: ['bypass attack|||đánh vòng', 'frontal attack|||trực diện', 'flank attack|||bên sườn', 'guerrilla attack|||du kích'], correctIndex: 0, explanation: 'A bypass attack goes around the opponent — new products, new markets or new technology — instead of meeting it head-on.|||Tấn công đánh vòng đi vòng qua đối thủ — sản phẩm mới, thị trường mới hoặc công nghệ mới — thay vì đối đầu trực diện.' },
  { id: 'q3', question: 'Price VND 200,000, variable cost VND 120,000 per unit. By how much must volume rise to keep total contribution unchanged after a 5% price cut?|||Giá 200.000 đồng, chi phí biến đổi 120.000 đồng mỗi đơn vị. Sau khi giảm giá 5%, sản lượng phải tăng bao nhiêu để giữ nguyên tổng số dư đảm phí?', options: ['5.0%|||5,0%', '12.5%|||12,5%', 'About 14.3%|||Khoảng 14,3%', '40.0%|||40,0%'], correctIndex: 2, explanation: 'm = 80,000 / 200,000 = 40%; d / (m − d) = 0.05 / 0.35 ≈ 14.3%. Check: new contribution 190,000 − 120,000 = 70,000, and 80,000 / 70,000 ≈ 1.143.|||m = 80.000 / 200.000 = 40%; d / (m − d) = 0,05 / 0,35 ≈ 14,3%. Kiểm tra: số dư mới 190.000 − 120.000 = 70.000, và 80.000 / 70.000 ≈ 1,143.' },
]);

const c8 = doc('mmg301-4-1-channels-imc-digital', '4.1 — Channels, omnichannel retailing & integrated digital communications|||4.1 — Kênh phân phối, bán lẻ đa kênh & truyền thông tích hợp trên nền số',
  'Thiết kế và quản trị kênh (mức dịch vụ đầu ra, độ bao phủ, quyền lực và xung đột kênh), bán lẻ đa kênh, truyền thông trả phí – sở hữu – lan truyền, phễu khách hàng và các chỉ số số (CTR, CPC, CPM, tỷ lệ chuyển đổi, CPA, ROAS), cảnh báo về phân bổ đóng góp.',
  [[
    `<span class="eyebrow">MMG301 · Part 4 · Lesson 4.1</span>
<h2>Channels, omnichannel retailing &amp; integrated digital communications</h2>
<p class="lead">Delivering and communicating value are now intertwined: customers discover, compare, buy and complain across stores, platforms and social media. Managers must design channels and communications as one system — and measure it.</p>
<h3>Designing and managing channels</h3>
<ul>
<li><strong>Start from the service outputs customers want</strong>: lot size, waiting and delivery time, spatial convenience, product variety and service backup.</li>
<li><strong>Choose coverage</strong>: <em>exclusive</em> (very few outlets — protects image and control), <em>selective</em> (more than one but not all willing outlets), <em>intensive</em> (as many outlets as possible — for convenience goods).</li>
<li><strong>Evaluate alternatives</strong> on economic, control and adaptive criteria.</li>
<li><strong>Manage members</strong>: select, train, motivate and evaluate them. Power over partners can be coercive, reward, legitimate, expert or referent; expert and referent power build commitment, coercion breeds resentment.</li>
<li><strong>Manage conflict</strong> — vertical, horizontal and multichannel — with superordinate goals, dual compensation (paying the sales force for online orders in its territory), joint memberships, diplomacy, mediation or arbitration.</li>
</ul>
<h3>Omnichannel retailing</h3>
<p>Customers <em>showroom</em> (examine in store, buy online) and <em>webroom</em> (research online, buy in store). An omnichannel strategy integrates inventory, prices, promotions and customer data so customers move between channels without friction: buy online and pick up in store, return anywhere, see one loyalty balance everywhere. Retailers compete on target market, assortment, prices, services, store atmosphere, experiences, communications and location; many develop <strong>private labels</strong> to raise margins and differentiate.</p>
<h3>Integrated communications across the funnel</h3>
<p>The communications mix spans advertising, sales promotion, events and experiences, public relations, online and social media, mobile, direct and database marketing, and personal selling. Media are <strong>paid</strong> (ads), <strong>owned</strong> (website, app, social pages) or <strong>earned</strong> (reviews, shares, press coverage). Integration means assigning each tool a job along the customer funnel:</p>
<table>
<tr><th>Funnel stage</th><th>Typical tools</th><th>Metrics</th></tr>
<tr><td>Awareness</td><td>Video, display, creators, PR</td><td>Impressions, reach, frequency, CPM</td></tr>
<tr><td>Consideration</td><td>Search, content, reviews</td><td>Click-through rate (CTR), engagement, time on site</td></tr>
<tr><td>Conversion</td><td>Retargeting, promotions, landing pages</td><td>Conversion rate, cost per acquisition (CPA)</td></tr>
<tr><td>Loyalty &amp; advocacy</td><td>Email, CRM, loyalty programmes, community</td><td>Repeat rate, retention, NPS, referrals</td></tr>
</table>
<pre><code class="language-text">CTR = clicks / impressions           CPC = cost / clicks
CPM = cost / impressions × 1,000     Conversion rate = conversions / clicks
CPA = cost / conversions             ROAS = attributed revenue / ad spend

Illustrative campaign: 500,000 impressions, 6,000 clicks, cost VND 30,000,000,
240 purchases, attributed revenue VND 120,000,000
→ CTR 1.2% · CPC 5,000 · CPM 60,000 · conversion rate 4% · CPA 125,000 · ROAS 4.0</code></pre>
<div class="callout"><span class="badge">Attribution warning</span> Last-click attribution gives all the credit to the final touchpoint (often search or retargeting) and ignores the video that created the demand. ROAS measures <em>attributed</em> revenue, not <em>incremental</em> revenue — use controlled tests (hold-out groups, geographic tests) to learn what marketing actually caused.</div>`,
    `<span class="eyebrow">MMG301 · Phần 4 · Bài 4.1</span>
<h2>Kênh phân phối, bán lẻ đa kênh &amp; truyền thông tích hợp trên nền số</h2>
<p class="lead">Chuyển giao và truyền thông giá trị giờ đan vào nhau: khách hàng khám phá, so sánh, mua và phàn nàn qua cửa hàng, sàn thương mại điện tử và mạng xã hội. Nhà quản trị phải thiết kế kênh và truyền thông như một hệ thống — và đo lường nó.</p>
<h3>Thiết kế và quản trị kênh</h3>
<ul>
<li><strong>Bắt đầu từ mức dịch vụ đầu ra khách hàng mong muốn</strong>: quy mô lô hàng, thời gian chờ và giao hàng, sự thuận tiện về địa điểm, sự đa dạng sản phẩm và dịch vụ hỗ trợ.</li>
<li><strong>Chọn mức bao phủ</strong>: <em>độc quyền</em> (rất ít điểm bán — giữ hình ảnh và quyền kiểm soát), <em>chọn lọc</em> (nhiều hơn một nhưng không phải mọi điểm bán muốn tham gia), <em>đại trà</em> (càng nhiều điểm bán càng tốt — cho hàng tiện dụng).</li>
<li><strong>Đánh giá các phương án</strong> theo tiêu chí kinh tế, khả năng kiểm soát và khả năng thích ứng.</li>
<li><strong>Quản lý thành viên kênh</strong>: tuyển chọn, đào tạo, tạo động lực và đánh giá. Quyền lực với đối tác có thể là cưỡng chế, khen thưởng, hợp pháp, chuyên môn hoặc uy tín; quyền lực chuyên môn và uy tín tạo sự gắn kết, còn cưỡng chế gây oán giận.</li>
<li><strong>Quản lý xung đột</strong> — dọc, ngang và đa kênh — bằng mục tiêu chung cao hơn, trả thưởng kép (vẫn trả thưởng cho lực lượng bán hàng với đơn trực tuyến trong địa bàn của họ), thành viên chung trong các hiệp hội, ngoại giao, hoà giải hoặc trọng tài.</li>
</ul>
<h3>Bán lẻ đa kênh (omnichannel)</h3>
<p>Khách hàng <em>showrooming</em> (xem ở cửa hàng, mua trực tuyến) và <em>webrooming</em> (tìm hiểu trực tuyến, mua ở cửa hàng). Chiến lược đa kênh tích hợp tồn kho, giá, khuyến mại và dữ liệu khách hàng để khách chuyển kênh không vướng víu: mua trực tuyến nhận tại cửa hàng, trả hàng ở bất cứ đâu, thấy cùng một số điểm thành viên ở mọi nơi. Nhà bán lẻ cạnh tranh bằng thị trường mục tiêu, chủng loại hàng, giá, dịch vụ, không khí cửa hàng, trải nghiệm, truyền thông và địa điểm; nhiều nhà bán lẻ phát triển <strong>nhãn hàng riêng</strong> để tăng biên lợi nhuận và tạo khác biệt.</p>
<h3>Truyền thông tích hợp dọc theo phễu</h3>
<p>Hỗn hợp truyền thông gồm quảng cáo, khuyến mại, sự kiện và trải nghiệm, quan hệ công chúng, marketing trực tuyến và mạng xã hội, marketing di động, marketing trực tiếp và dựa trên cơ sở dữ liệu, và bán hàng cá nhân. Phương tiện truyền thông có loại <strong>trả phí</strong> (quảng cáo), <strong>sở hữu</strong> (website, ứng dụng, trang mạng xã hội) và <strong>lan truyền</strong> (đánh giá, lượt chia sẻ, báo chí đưa tin). Tích hợp nghĩa là giao cho mỗi công cụ một nhiệm vụ dọc theo phễu khách hàng:</p>
<table>
<tr><th>Giai đoạn phễu</th><th>Công cụ điển hình</th><th>Chỉ số</th></tr>
<tr><td>Nhận biết</td><td>Video, quảng cáo hiển thị, nhà sáng tạo nội dung, PR</td><td>Lượt hiển thị, độ phủ, tần suất, CPM</td></tr>
<tr><td>Cân nhắc</td><td>Tìm kiếm, nội dung, đánh giá</td><td>Tỷ lệ nhấp (CTR), mức tương tác, thời gian trên trang</td></tr>
<tr><td>Chuyển đổi</td><td>Tiếp thị lại, khuyến mại, trang đích</td><td>Tỷ lệ chuyển đổi, chi phí mỗi chuyển đổi (CPA)</td></tr>
<tr><td>Trung thành &amp; ủng hộ</td><td>Email, CRM, chương trình thành viên, cộng đồng</td><td>Tỷ lệ mua lại, tỷ lệ giữ chân, NPS, lượt giới thiệu</td></tr>
</table>
<pre><code class="language-text">CTR = lượt nhấp / lượt hiển thị           CPC = chi phí / lượt nhấp
CPM = chi phí / lượt hiển thị × 1.000     Tỷ lệ chuyển đổi = số chuyển đổi / lượt nhấp
CPA = chi phí / số chuyển đổi             ROAS = doanh thu được ghi nhận / chi phí quảng cáo

Chiến dịch minh hoạ: 500.000 lượt hiển thị, 6.000 lượt nhấp, chi phí 30.000.000 đồng,
240 đơn hàng, doanh thu được ghi nhận 120.000.000 đồng
→ CTR 1,2% · CPC 5.000 · CPM 60.000 · tỷ lệ chuyển đổi 4% · CPA 125.000 · ROAS 4,0</code></pre>
<div class="callout"><span class="badge">Cảnh báo về phân bổ</span> Cách ghi nhận theo lần nhấp cuối trao toàn bộ công lao cho điểm chạm cuối cùng (thường là tìm kiếm hoặc tiếp thị lại) và bỏ qua video đã tạo ra nhu cầu. ROAS đo doanh thu <em>được ghi nhận</em>, không phải doanh thu <em>tăng thêm</em> — hãy dùng thử nghiệm có đối chứng (nhóm giữ lại không xem quảng cáo, thử nghiệm theo khu vực địa lý) để biết marketing thực sự tạo ra điều gì.</div>`,
  ]]);

const c9 = doc('mmg301-4-2-organization-control', '4.2 — Organizing, implementing & controlling marketing|||4.2 — Tổ chức, thực thi & kiểm soát marketing',
  'Năm hình thức tổ chức bộ phận marketing, thực thi marketing, bốn loại kiểm soát (kế hoạch năm, khả năng sinh lời, hiệu suất, chiến lược), kiểm toán marketing và bảng chỉ số cốt lõi: thị phần, thị phần tương đối, CAC, tỷ lệ giữ chân, CLV, ROMI, NPS.',
  [[
    `<span class="eyebrow">MMG301 · Part 4 · Lesson 4.2</span>
<h2>Organizing, implementing &amp; controlling marketing</h2>
<p class="lead">A brilliant plan fails without the right organization and disciplined control. This lesson closes the loop: who does the work, how progress is measured, and what the key marketing metrics mean.</p>
<h3>Organizing the marketing department</h3>
<table>
<tr><th>Form</th><th>Organized around</th><th>Suits / drawback</th></tr>
<tr><td>Functional</td><td>Activities: advertising, research, sales, digital</td><td>Few products and markets; simple, but no one owns a product's results</td></tr>
<tr><td>Geographic</td><td>Regions and territories</td><td>Markets that differ by area</td></tr>
<tr><td>Product or brand management</td><td>A manager for each product or brand</td><td>Many distinct products; clear ownership, but costly and prone to short-term focus</td></tr>
<tr><td>Market (customer) management</td><td>A manager for each customer group or industry</td><td>Customers with distinct needs and buying practices</td></tr>
<tr><td>Matrix (product-market)</td><td>Both products and markets</td><td>Large diversified firms; flexible, but complex with dual reporting lines</td></tr>
</table>
<p><strong>Implementation</strong> turns plans into action assignments — who, where, when and how. Many failures are implementation failures: unclear responsibilities, weak coordination with sales, finance and operations, or rewards that encourage short-term tactics over strategy.</p>
<h3>Four types of marketing control</h3>
<table>
<tr><th>Type</th><th>Primary responsibility</th><th>Purpose</th><th>Tools</th></tr>
<tr><td>Annual-plan control</td><td>Top and middle management</td><td>Are the planned results being achieved?</td><td>Sales analysis, market-share analysis, marketing-expense-to-sales ratios, financial analysis, scorecards</td></tr>
<tr><td>Profitability control</td><td>Marketing controller</td><td>Where is the company making and losing money?</td><td>Profitability by product, territory, customer, segment and channel</td></tr>
<tr><td>Efficiency control</td><td>Line and staff management; marketing controller</td><td>How can spending efficiency be improved?</td><td>Efficiency of the sales force, advertising, sales promotion and distribution</td></tr>
<tr><td>Strategic control</td><td>Top management; marketing auditor</td><td>Is the company pursuing its best opportunities?</td><td>Marketing effectiveness review, marketing audit, ethical and social responsibility review</td></tr>
</table>
<p>A <strong>marketing audit</strong> is a comprehensive, systematic, independent and periodic examination of the company's marketing environment, strategy, organization, systems, productivity and functions, with recommendations for action.</p>
<h3>Core marketing metrics</h3>
<pre><code class="language-text">Market share (%)          = company sales / total market sales × 100   (units or value)
Relative market share     = company share / share of the largest competitor
Customer acquisition cost = acquisition spending / number of new customers
Retention rate            = customers at the start still active at the end / customers at the start
Churn rate                = 1 − retention rate
CLV (simple)              = m / (1 + i − r)
ROMI                      = (incremental gross profit − marketing cost) / marketing cost
NPS                       = % promoters − % detractors</code></pre>
<p>Illustrative: a firm sells VND 60 billion in a VND 400 billion market (share 15%); its largest competitor holds 30%, so relative market share = 15 / 30 = 0.5. A campaign costing VND 200 million generates VND 750 million of incremental revenue at a 40% gross margin → incremental gross profit 300 million → ROMI = (300 − 200) / 200 = 50%.</p>
<div class="callout"><span class="badge">Dashboard discipline</span> Combine a few <em>leading</em> metrics (awareness, consideration, NPS) with <em>lagging</em> financial ones (share, CLV, ROMI). Leading metrics warn early; lagging metrics prove results.</div>`,
    `<span class="eyebrow">MMG301 · Phần 4 · Bài 4.2</span>
<h2>Tổ chức, thực thi &amp; kiểm soát marketing</h2>
<p class="lead">Một kế hoạch xuất sắc vẫn thất bại nếu thiếu tổ chức phù hợp và kiểm soát có kỷ luật. Bài này khép vòng: ai làm việc, đo tiến độ thế nào, và các chỉ số marketing then chốt có ý nghĩa gì.</p>
<h3>Tổ chức bộ phận marketing</h3>
<table>
<tr><th>Hình thức</th><th>Tổ chức xoay quanh</th><th>Phù hợp / hạn chế</th></tr>
<tr><td>Theo chức năng</td><td>Các hoạt động: quảng cáo, nghiên cứu, bán hàng, kỹ thuật số</td><td>Ít sản phẩm và thị trường; đơn giản, nhưng không ai chịu trách nhiệm kết quả của từng sản phẩm</td></tr>
<tr><td>Theo địa lý</td><td>Vùng và địa bàn</td><td>Thị trường khác nhau theo khu vực</td></tr>
<tr><td>Quản trị theo sản phẩm hoặc thương hiệu</td><td>Mỗi sản phẩm hoặc thương hiệu có một người quản lý</td><td>Nhiều sản phẩm khác biệt; trách nhiệm rõ, nhưng tốn kém và dễ nặng về ngắn hạn</td></tr>
<tr><td>Quản trị theo thị trường (khách hàng)</td><td>Mỗi nhóm khách hàng hoặc ngành có một người quản lý</td><td>Khách hàng có nhu cầu và cách mua khác biệt</td></tr>
<tr><td>Ma trận (sản phẩm – thị trường)</td><td>Cả sản phẩm lẫn thị trường</td><td>Doanh nghiệp lớn đa ngành; linh hoạt, nhưng phức tạp vì báo cáo hai tuyến</td></tr>
</table>
<p><strong>Thực thi</strong> biến kế hoạch thành phân công hành động — ai, ở đâu, khi nào và bằng cách nào. Nhiều thất bại thực chất là thất bại thực thi: trách nhiệm không rõ, phối hợp yếu với bán hàng, tài chính và vận hành, hoặc cơ chế thưởng khuyến khích chiêu thức ngắn hạn thay vì chiến lược.</p>
<h3>Bốn loại kiểm soát marketing</h3>
<table>
<tr><th>Loại</th><th>Người chịu trách nhiệm chính</th><th>Mục đích</th><th>Công cụ</th></tr>
<tr><td>Kiểm soát kế hoạch năm</td><td>Lãnh đạo cấp cao và cấp trung</td><td>Kết quả kế hoạch có đang đạt được không?</td><td>Phân tích doanh số, phân tích thị phần, tỷ lệ chi phí marketing trên doanh số, phân tích tài chính, thẻ điểm</td></tr>
<tr><td>Kiểm soát khả năng sinh lời</td><td>Kiểm soát viên marketing</td><td>Công ty đang lãi và lỗ ở đâu?</td><td>Khả năng sinh lời theo sản phẩm, địa bàn, khách hàng, phân khúc và kênh</td></tr>
<tr><td>Kiểm soát hiệu suất</td><td>Quản lý trực tuyến và tham mưu; kiểm soát viên marketing</td><td>Làm sao chi tiêu hiệu quả hơn?</td><td>Hiệu suất của lực lượng bán hàng, quảng cáo, khuyến mại và phân phối</td></tr>
<tr><td>Kiểm soát chiến lược</td><td>Lãnh đạo cấp cao; kiểm toán viên marketing</td><td>Công ty có đang theo đuổi những cơ hội tốt nhất không?</td><td>Rà soát hiệu lực marketing, kiểm toán marketing, rà soát đạo đức và trách nhiệm xã hội</td></tr>
</table>
<p><strong>Kiểm toán marketing</strong> là việc xem xét toàn diện, có hệ thống, độc lập và định kỳ về môi trường, chiến lược, tổ chức, hệ thống, năng suất và các chức năng marketing của công ty, kèm khuyến nghị hành động.</p>
<h3>Các chỉ số marketing cốt lõi</h3>
<pre><code class="language-text">Thị phần (%)                = doanh số công ty / tổng doanh số thị trường × 100   (số lượng hoặc giá trị)
Thị phần tương đối          = thị phần công ty / thị phần của đối thủ lớn nhất
Chi phí thu hút khách hàng  = chi phí thu hút / số khách hàng mới
Tỷ lệ giữ chân              = số khách đầu kỳ còn hoạt động cuối kỳ / số khách đầu kỳ
Tỷ lệ rời bỏ (churn)        = 1 − tỷ lệ giữ chân
CLV (dạng đơn giản)         = m / (1 + i − r)
ROMI                        = (lợi nhuận gộp tăng thêm − chi phí marketing) / chi phí marketing
NPS                         = % người ủng hộ − % người phản đối</code></pre>
<p>Minh hoạ: một công ty bán 60 tỷ đồng trong thị trường 400 tỷ đồng (thị phần 15%); đối thủ lớn nhất nắm 30%, nên thị phần tương đối = 15 / 30 = 0,5. Một chiến dịch tốn 200 triệu đồng tạo ra 750 triệu đồng doanh thu tăng thêm với biên lợi nhuận gộp 40% → lợi nhuận gộp tăng thêm 300 triệu → ROMI = (300 − 200) / 200 = 50%.</p>
<div class="callout"><span class="badge">Kỷ luật bảng điều khiển</span> Kết hợp vài chỉ số <em>dẫn dắt</em> (nhận biết, cân nhắc, NPS) với các chỉ số tài chính <em>trễ</em> (thị phần, CLV, ROMI). Chỉ số dẫn dắt cảnh báo sớm; chỉ số trễ chứng minh kết quả.</div>`,
  ]]);

const c9e = doc('mmg301-4-3-exercise', 'Exercise 3 — ROMI and the budget decision for two campaigns|||Bài tập 3 — ROMI và quyết định ngân sách cho hai chiến dịch',
  'Bài tập tình huống giả định: nhà bán lẻ mỹ phẩm trực tuyến so hai chiến dịch — tính ROAS theo ghi nhận và ROMI theo doanh thu tăng thêm, rồi chọn cách phân bổ ngân sách 400 triệu đồng dựa trên lợi nhuận ròng tăng thêm và ROMI biên; kèm lời giải.',
  [[
    `<span class="eyebrow">MMG301 · Part 4 · Exercise 3</span>
<h2>Exercise 3 — where should the next VND 400 million go?</h2>
<div class="callout"><span class="badge">Problem</span> A cosmetics e-retailer (a fictional case, illustrative numbers; amounts in VND million) earns a 40% gross margin. Last quarter it ran two campaigns. <strong>Campaign A</strong> — search and retargeting ads: cost 150; revenue attributed by the ad platform (last click) 1,000; a hold-out test (a random group not shown the ads) shows that 700 of that revenue would have happened anyway. <strong>Campaign B</strong> — short-video and creator campaign: cost 250; attributed revenue 1,100; a geographic test estimates incremental revenue of 1,000. (a) Compute the attributed ROAS and the ROMI (on incremental revenue) of each campaign. (b) Next quarter's budget is 400. The team estimates that scaling B to 400 would produce incremental revenue of 1,450. Compare three plans: (1) repeat A at 150 and B at 250; (2) put all 400 into B; (3) run only B at 250 and keep 150 unspent. (c) Recommend a plan and explain.</div>
<h3>Worked solution</h3>
<table>
<tr><th>(a) VND million</th><th>Campaign A</th><th>Campaign B</th></tr>
<tr><td>Attributed ROAS</td><td>1,000 / 150 ≈ 6.67</td><td>1,100 / 250 = 4.40</td></tr>
<tr><td>Incremental revenue</td><td>1,000 − 700 = 300</td><td>1,000</td></tr>
<tr><td>Incremental gross profit (× 40%)</td><td>120</td><td>400</td></tr>
<tr><td>ROMI = (gross profit − cost) / cost</td><td>(120 − 150) / 150 = −20%</td><td>(400 − 250) / 250 = +60%</td></tr>
</table>
<pre><code class="language-text">(b) Net incremental profit = incremental gross profit − marketing cost   (VND million)
    Plan 1  A 150 + B 250 : (120 − 150) + (400 − 250) = −30 + 150 = 120
    Plan 2  B at 400      : 1,450 × 40% = 580 → 580 − 400 = 180     (ROMI = 180 / 400 = 45%)
    Plan 3  B at 250 only : gross profit 400 − cost 250 = 150        (150 kept)

    Scaling B from 250 to 400: extra gross profit = 580 − 400 = 180; extra cost = 150
    Marginal ROMI = (180 − 150) / 150 = +20%</code></pre>
<p><strong>(c)</strong> Choose plan 2: it gives the highest net incremental profit (180, against 150 and 120). B's average ROMI falls from 60% to 45% as it scales, but each extra đồng still returns more than it costs (marginal ROMI +20%), while money spent on A in its current form destroys value (−20%). Redesign A — for example, exclude recent buyers from retargeting — and re-test it on a small budget before bringing it back.</p>
<p><strong>Why:</strong> A looked like the best campaign on attributed ROAS (6.67) because retargeting mostly reached people who were about to buy anyway; only the hold-out test revealed how little it added. Budgets should follow <em>incremental</em> profit and <em>marginal</em> returns, not the highest average ratio. Plan 3 would win only if the company had another use for the 150 that returns more than 20%.</p>`,
    `<span class="eyebrow">MMG301 · Phần 4 · Bài tập 3</span>
<h2>Bài tập 3 — 400 triệu đồng tiếp theo nên đổ vào đâu?</h2>
<div class="callout"><span class="badge">Đề</span> Một nhà bán lẻ mỹ phẩm trực tuyến (tình huống giả định, số liệu minh hoạ giả định; đơn vị triệu đồng) có biên lợi nhuận gộp 40%. Quý trước công ty chạy hai chiến dịch. <strong>Chiến dịch A</strong> — quảng cáo tìm kiếm và tiếp thị lại: chi phí 150; doanh thu được nền tảng quảng cáo ghi nhận (theo lần nhấp cuối) 1.000; thử nghiệm nhóm giữ lại (một nhóm ngẫu nhiên không được xem quảng cáo) cho thấy 700 trong số doanh thu đó vẫn sẽ xảy ra dù không có quảng cáo. <strong>Chiến dịch B</strong> — video ngắn và nhà sáng tạo nội dung: chi phí 250; doanh thu được ghi nhận 1.100; thử nghiệm theo khu vực địa lý ước tính doanh thu tăng thêm 1.000. (a) Tính ROAS theo ghi nhận và ROMI (theo doanh thu tăng thêm) của từng chiến dịch. (b) Ngân sách quý tới là 400. Nhóm ước tính nếu nâng B lên 400 thì doanh thu tăng thêm đạt 1.450. So sánh ba phương án: (1) lặp lại A 150 và B 250; (2) dồn cả 400 vào B; (3) chỉ chạy B 250 và giữ lại 150. (c) Đề xuất phương án và giải thích.</div>
<h3>Lời giải</h3>
<table>
<tr><th>(a) Triệu đồng</th><th>Chiến dịch A</th><th>Chiến dịch B</th></tr>
<tr><td>ROAS theo ghi nhận</td><td>1.000 / 150 ≈ 6,67</td><td>1.100 / 250 = 4,40</td></tr>
<tr><td>Doanh thu tăng thêm</td><td>1.000 − 700 = 300</td><td>1.000</td></tr>
<tr><td>Lợi nhuận gộp tăng thêm (× 40%)</td><td>120</td><td>400</td></tr>
<tr><td>ROMI = (lợi nhuận gộp − chi phí) / chi phí</td><td>(120 − 150) / 150 = −20%</td><td>(400 − 250) / 250 = +60%</td></tr>
</table>
<pre><code class="language-text">(b) Lợi nhuận ròng tăng thêm = lợi nhuận gộp tăng thêm − chi phí marketing   (triệu đồng)
    PA 1  A 150 + B 250 : (120 − 150) + (400 − 250) = −30 + 150 = 120
    PA 2  B với 400     : 1.450 × 40% = 580 → 580 − 400 = 180     (ROMI = 180 / 400 = 45%)
    PA 3  chỉ B 250     : lợi nhuận gộp 400 − chi phí 250 = 150     (giữ lại 150)

    Nâng B từ 250 lên 400: lợi nhuận gộp thêm = 580 − 400 = 180; chi phí thêm = 150
    ROMI biên = (180 − 150) / 150 = +20%</code></pre>
<p><strong>(c)</strong> Chọn phương án 2: lợi nhuận ròng tăng thêm cao nhất (180, so với 150 và 120). ROMI bình quân của B giảm từ 60% xuống 45% khi mở rộng quy mô, nhưng mỗi đồng chi thêm vẫn thu về nhiều hơn chính nó (ROMI biên +20%), còn tiền chi cho A ở dạng hiện tại thì phá huỷ giá trị (−20%). Hãy thiết kế lại A — ví dụ loại khách vừa mua khỏi danh sách tiếp thị lại — và thử lại với ngân sách nhỏ trước khi dùng tiếp.</p>
<p><strong>Vì sao:</strong> A trông như chiến dịch tốt nhất nếu nhìn ROAS theo ghi nhận (6,67) vì tiếp thị lại chủ yếu chạm tới những người đằng nào cũng sắp mua; chỉ thử nghiệm nhóm giữ lại mới cho thấy nó đóng góp ít đến mức nào. Ngân sách nên đi theo lợi nhuận <em>tăng thêm</em> và lợi suất <em>biên</em>, không theo tỷ lệ bình quân cao nhất. Phương án 3 chỉ thắng nếu công ty có cách dùng 150 kia với lợi suất cao hơn 20%.</p>`,
  ]]);

const c8q = quiz('mmg301-quiz-4', 'Quiz 4 — Channels, communications & control|||Quiz 4 — Kênh, truyền thông & kiểm soát', [
  { id: 'q1', question: 'A campaign costs VND 20,000,000 and delivers 400,000 impressions, 4,000 clicks and 100 purchases. What is the cost per acquisition (CPA)?|||Một chiến dịch tốn 20.000.000 đồng, đạt 400.000 lượt hiển thị, 4.000 lượt nhấp và 100 đơn hàng. Chi phí mỗi chuyển đổi (CPA) là bao nhiêu?', options: ['VND 200,000|||200.000 đồng', 'VND 5,000|||5.000 đồng', 'VND 50,000|||50.000 đồng', 'VND 2,000|||2.000 đồng'], correctIndex: 0, explanation: 'CPA = 20,000,000 / 100 = 200,000. 5,000 is the cost per click (20,000,000 / 4,000) and 50,000 the CPM (20,000,000 / 400,000 × 1,000).|||CPA = 20.000.000 / 100 = 200.000. 5.000 là chi phí mỗi lượt nhấp (20.000.000 / 4.000) và 50.000 là CPM (20.000.000 / 400.000 × 1.000).' },
  { id: 'q2', question: 'Which type of marketing control asks "Is the company pursuing its best opportunities?" and uses the marketing audit as a key tool?|||Loại kiểm soát marketing nào đặt câu hỏi "Công ty có đang theo đuổi những cơ hội tốt nhất không?" và dùng kiểm toán marketing làm công cụ chính?', options: ['Efficiency control|||Kiểm soát hiệu suất', 'Strategic control|||Kiểm soát chiến lược', 'Annual-plan control|||Kiểm soát kế hoạch năm', 'Profitability control|||Kiểm soát khả năng sinh lời'], correctIndex: 1, explanation: 'Strategic control, led by top management and marketing auditors, checks whether strategy still fits the opportunities; annual-plan control checks whether planned results are being met.|||Kiểm soát chiến lược, do lãnh đạo cấp cao và kiểm toán viên marketing phụ trách, xem chiến lược còn phù hợp với cơ hội không; kiểm soát kế hoạch năm xem kết quả kế hoạch có đạt không.' },
  { id: 'q3', question: 'A campaign costs VND 100 million and produces VND 400 million of incremental revenue at a 30% gross margin. What is its ROMI?|||Một chiến dịch tốn 100 triệu đồng và tạo ra 400 triệu đồng doanh thu tăng thêm với biên lợi nhuận gộp 30%. ROMI của chiến dịch là bao nhiêu?', options: ['300%|||300%', '120%|||120%', '20%|||20%', '30%|||30%'], correctIndex: 2, explanation: 'Incremental gross profit = 400 × 30% = 120; ROMI = (120 − 100) / 100 = 20%. 300% wrongly uses revenue instead of gross profit; 120% forgets to subtract the cost.|||Lợi nhuận gộp tăng thêm = 400 × 30% = 120; ROMI = (120 − 100) / 100 = 20%. 300% dùng nhầm doanh thu thay cho lợi nhuận gộp; 120% quên trừ chi phí.' },
]);

const taiLieu = doc('mmg301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), hai giáo trình chuẩn (kèm link nhà xuất bản), tài liệu chính thức miễn phí, kênh YouTube, công cụ đo lường – khảo sát – dự báo, lộ trình tự học.',
  [[
    `<span class="eyebrow">MMG301 · 📚 Resource hub</span>
<h2>Course materials &amp; references</h2>
<p class="lead">One hub for marketing management: the official syllabus &amp; slides, the two standard textbooks, free high-quality reading, video channels, practical measurement tools and a self-study roadmap.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>Sign in to <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) with your FPTU account to read the official MMG301 syllabus, learning outcomes, assessment structure and lecture slides. This course follows the standard structure of international marketing-management textbooks; wherever the official syllabus differs, the syllabus comes first.</p>
<h3>📗 Books</h3>
<ul>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/marketing-management/P200000005952" target="_blank" rel="noopener">Marketing Management</a> — Philip Kotler &amp; Kevin Lane Keller (with co-authors in recent editions), Pearson: the reference textbook whose structure this course follows.</li>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/strategic-brand-management-building-measuring-and-managing-brand-equity/P200000005947" target="_blank" rel="noopener">Strategic Brand Management: Building, Measuring, and Managing Brand Equity</a> — Kevin Lane Keller &amp; Vanitha Swaminathan, Pearson: the home of the CBBE model and the brand resonance pyramid.</li>
</ul>
<h3>🌐 Free reading</h3>
<ul>
<li><a href="https://hbr.org/topic/subject/marketing" target="_blank" rel="noopener">Harvard Business Review — Marketing</a> — articles on strategy, customers, pricing and brands (some articles are behind a paywall).</li>
<li><a href="https://www.thinkwithgoogle.com/" target="_blank" rel="noopener">Think with Google</a> — consumer insights, digital marketing research and measurement.</li>
<li><a href="https://blog.hubspot.com/marketing" target="_blank" rel="noopener">HubSpot Marketing Blog</a> — practical guides on content, email, funnels and marketing metrics.</li>
<li><a href="https://www.ama.org/the-definition-of-marketing-what-is-marketing/" target="_blank" rel="noopener">American Marketing Association — definition of marketing</a> — the AMA's official definitions and professional resources.</li>
<li><a href="https://skillshop.withgoogle.com/" target="_blank" rel="noopener">Google Skillshop</a> — free official training and certificates for Google Analytics and Google Ads.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@harvardbusinessreview" target="_blank" rel="noopener">Harvard Business Review</a> — strategy and management ideas, explained briefly.</li>
<li><a href="https://www.youtube.com/@KelloggSchool" target="_blank" rel="noopener">Kellogg School of Management</a> — faculty talks on marketing and strategy.</li>
<li><a href="https://www.youtube.com/@thinkwithgoogle" target="_blank" rel="noopener">Think with Google</a> — marketing insights and measurement.</li>
<li><a href="https://www.youtube.com/@HubSpotMarketing" target="_blank" rel="noopener">HubSpot Marketing</a> — hands-on digital and inbound marketing.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://marketingplatform.google.com/about/analytics/" target="_blank" rel="noopener">Google Analytics</a> — traffic, funnels and conversions for websites and apps.</li>
<li><a href="https://trends.google.com/trends/" target="_blank" rel="noopener">Google Trends</a> — search interest over time and by region: a quick secondary-data check on demand.</li>
<li><a href="https://lookerstudio.google.com/" target="_blank" rel="noopener">Looker Studio</a> — free dashboards for marketing metrics.</li>
<li><a href="https://www.google.com/forms/about/" target="_blank" rel="noopener">Google Forms</a> — satisfaction, NPS and purchase-intention surveys.</li>
</ul>
<h3>🎯 Self-study roadmap</h3>
<ol>
<li><strong>Foundations</strong> — refresh MKT101 (STP, 4Ps, buyer behaviour), then work through the lessons here in order.</li>
<li><strong>Numbers</strong> — rebuild the three exercises in a spreadsheet and change the assumptions to see which ones matter most.</li>
<li><strong>Apply</strong> — pick a brand you know and write a one-page marketing plan from public information: target, positioning, competitive role, three metrics.</li>
<li><strong>Portfolio</strong> — build a small dashboard (funnel, CAC, retention, ROMI) from sample data and explain one budget decision it supports.</li>
</ol>
<div class="callout"><span class="badge">Note</span> An original hub of real links — no copyrighted slides or books are embedded. If a link moves, start from the publisher's or organization's homepage.</div>`,
    `<span class="eyebrow">MMG301 · 📚 Trung tâm tài liệu</span>
<h2>Tài liệu tham khảo môn học</h2>
<p class="lead">Một nơi gom cho quản trị marketing: giáo trình &amp; slide chính thức, hai giáo trình chuẩn, tài liệu đọc miễn phí chất lượng cao, kênh video, công cụ đo lường thực hành và lộ trình tự học.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Đăng nhập <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) bằng tài khoản FPTU để đọc đề cương chính thức của MMG301, chuẩn đầu ra, cơ cấu đánh giá và slide bài giảng. Môn học ở đây bám cấu trúc chuẩn của các giáo trình quản trị marketing quốc tế; chỗ nào đề cương chính thức khác thì theo đề cương.</p>
<h3>📗 Sách</h3>
<ul>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/marketing-management/P200000005952" target="_blank" rel="noopener">Marketing Management</a> — Philip Kotler &amp; Kevin Lane Keller (các lần tái bản gần đây có thêm đồng tác giả), Pearson: giáo trình tham chiếu mà cấu trúc môn học này bám theo.</li>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/strategic-brand-management-building-measuring-and-managing-brand-equity/P200000005947" target="_blank" rel="noopener">Strategic Brand Management: Building, Measuring, and Managing Brand Equity</a> — Kevin Lane Keller &amp; Vanitha Swaminathan, Pearson: nơi trình bày đầy đủ mô hình CBBE và kim tự tháp cộng hưởng thương hiệu.</li>
</ul>
<h3>🌐 Tài liệu miễn phí</h3>
<ul>
<li><a href="https://hbr.org/topic/subject/marketing" target="_blank" rel="noopener">Harvard Business Review — Marketing</a> — bài viết về chiến lược, khách hàng, giá và thương hiệu (một số bài cần trả phí).</li>
<li><a href="https://www.thinkwithgoogle.com/" target="_blank" rel="noopener">Think with Google</a> — insight người tiêu dùng, nghiên cứu và đo lường marketing số.</li>
<li><a href="https://blog.hubspot.com/marketing" target="_blank" rel="noopener">HubSpot Marketing Blog</a> — hướng dẫn thực hành về nội dung, email, phễu và chỉ số marketing.</li>
<li><a href="https://www.ama.org/the-definition-of-marketing-what-is-marketing/" target="_blank" rel="noopener">Hiệp hội Marketing Hoa Kỳ (AMA) — định nghĩa marketing</a> — các định nghĩa chính thức và tài nguyên nghề nghiệp của AMA.</li>
<li><a href="https://skillshop.withgoogle.com/" target="_blank" rel="noopener">Google Skillshop</a> — khoá học và chứng chỉ chính thức, miễn phí cho Google Analytics và Google Ads.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@harvardbusinessreview" target="_blank" rel="noopener">Harvard Business Review</a> — ý tưởng chiến lược và quản trị, giải thích ngắn gọn.</li>
<li><a href="https://www.youtube.com/@KelloggSchool" target="_blank" rel="noopener">Kellogg School of Management</a> — bài nói của giảng viên về marketing và chiến lược.</li>
<li><a href="https://www.youtube.com/@thinkwithgoogle" target="_blank" rel="noopener">Think with Google</a> — insight và đo lường marketing.</li>
<li><a href="https://www.youtube.com/@HubSpotMarketing" target="_blank" rel="noopener">HubSpot Marketing</a> — marketing số và inbound thực hành.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://marketingplatform.google.com/about/analytics/" target="_blank" rel="noopener">Google Analytics</a> — lưu lượng, phễu và chuyển đổi cho website và ứng dụng.</li>
<li><a href="https://trends.google.com/trends/" target="_blank" rel="noopener">Google Trends</a> — mức quan tâm tìm kiếm theo thời gian và khu vực: một phép kiểm nhanh bằng dữ liệu thứ cấp về nhu cầu.</li>
<li><a href="https://lookerstudio.google.com/" target="_blank" rel="noopener">Looker Studio</a> — bảng điều khiển miễn phí cho chỉ số marketing.</li>
<li><a href="https://www.google.com/forms/about/" target="_blank" rel="noopener">Google Forms</a> — khảo sát hài lòng, NPS và ý định mua.</li>
</ul>
<h3>🎯 Lộ trình tự học</h3>
<ol>
<li><strong>Nền tảng</strong> — ôn lại MKT101 (STP, 4P, hành vi người mua), rồi học lần lượt các bài ở đây.</li>
<li><strong>Con số</strong> — dựng lại ba bài tập trên bảng tính và thay đổi giả định để thấy giả định nào quan trọng nhất.</li>
<li><strong>Vận dụng</strong> — chọn một thương hiệu quen thuộc và viết kế hoạch marketing một trang từ thông tin công khai: khách hàng mục tiêu, định vị, vai trò cạnh tranh, ba chỉ số đo.</li>
<li><strong>Hồ sơ năng lực</strong> — dựng một bảng điều khiển nhỏ (phễu, CAC, tỷ lệ giữ chân, ROMI) từ dữ liệu mẫu và giải thích một quyết định ngân sách mà nó hỗ trợ.</li>
</ol>
<div class="callout"><span class="badge">Lưu ý</span> Đây là trung tâm liên kết nguyên gốc — không nhúng slide hay sách có bản quyền. Link đổi thì vào trang chủ của nhà xuất bản hoặc tổ chức để tìm.</div>`,
  ]]);

export default {
  semester: { code: 'KY2', name: 'Kỳ 2', ordinal: 2 },
  course: {
    courseCode: 'MMG301',
    slug: 'mmg301-marketing-management',
    title: 'Marketing Management',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/MMG301.webp',
    shortDescription: 'Marketing from the manager’s seat: the marketing plan, market potential and forecasting, customer value, CLV and CRM, brand equity, competitive strategy, service quality, pricing, omnichannel, digital metrics and control. Bilingual, with exercises and quizzes.|||Marketing từ vị trí nhà quản trị: kế hoạch marketing, dự báo nhu cầu, CLV và CRM, tài sản thương hiệu, cạnh tranh, dịch vụ, định giá, đa kênh, chỉ số số và kiểm soát. Song ngữ, có bài tập và quiz.',
    description: 'Môn <strong>MMG301 — Marketing Management (Quản trị marketing)</strong> (khối Quản trị Kinh doanh, kỳ 2) đưa người học từ nguyên lý (MKT101) lên <strong>vị trí nhà quản trị marketing</strong>: ra quyết định, lập kế hoạch, đo lường và kiểm soát. Từ <strong>marketing toàn diện và kế hoạch marketing</strong> → <strong>tiềm năng thị trường và dự báo nhu cầu</strong> (chuỗi tỷ lệ) → <strong>giá trị khách hàng, NPS, CLV và CRM</strong> cùng hành vi mua của người tiêu dùng và tổ chức → <strong>định vị, tài sản thương hiệu</strong> (kim tự tháp CBBE của Keller, kiến trúc thương hiệu) và <strong>động thái cạnh tranh</strong> → <strong>sản phẩm, chất lượng dịch vụ</strong> (mô hình khoảng cách, SERVQUAL) và <strong>định giá nâng cao</strong> → <strong>kênh đa kênh, truyền thông số</strong> và <strong>tổ chức – kiểm soát</strong> với thị phần, CAC, ROMI. Bám cấu trúc giáo trình quản trị marketing chuẩn quốc tế (Kotler &amp; Keller), song ngữ Anh–Việt, có ba bài tập tình huống (giả định) kèm lời giải và quiz cuối mỗi phần.',
    whatYouLearn: 'Lập kế hoạch marketing theo tư duy marketing toàn diện: sứ mệnh, SWOT, mục tiêu, chiến lược, kiểm soát\nƯớc tính tiềm năng thị trường bằng phương pháp chuỗi tỷ lệ và chọn phương pháp dự báo nhu cầu phù hợp\nĐo giá trị cảm nhận, sự hài lòng và NPS; tính giá trị vòng đời khách hàng (CLV) và so với CAC\nPhân tích tâm lý người tiêu dùng, trung tâm mua và quy trình mua của tổ chức\nĐịnh vị bằng điểm tương đồng và điểm khác biệt; xây tài sản thương hiệu theo kim tự tháp CBBE của Keller\nChọn chiến lược cạnh tranh cho doanh nghiệp dẫn đầu, thách thức, theo sau và nép góc\nQuản trị chất lượng dịch vụ (mô hình khoảng cách, SERVQUAL) và ra quyết định giá dựa trên số dư đảm phí\nQuản trị kênh đa kênh, đo phễu số (CTR, CPA, ROAS) và kiểm soát marketing bằng thị phần, CLV, ROMI',
    requirements: 'Nên học xong MKT101 — Marketing Principles (hoặc nắm vững STP, 4P, hành vi người mua); điều kiện tiên quyết chính thức xem trên FLM\nTính toán với phần trăm và dùng bảng tính (Excel hoặc Google Sheets)\nThói quen đọc tin kinh doanh và quan sát các chiến dịch marketing thực tế',
  },
  sections: [
    { title: '📚 Course materials|||📚 Tài liệu tham khảo', description: 'Giáo trình & slide trên FLM, sách, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Course introduction|||Giới thiệu môn học', description: 'Từ nguyên lý đến quản trị, nhiệm vụ của nhà quản trị marketing, lộ trình, bảng công thức.', lessons: [intro] },
    { title: 'Part 1 — Planning & market potential|||Phần 1 — Hoạch định & tiềm năng thị trường', description: 'Marketing toàn diện, kế hoạch marketing, cầu và tiềm năng thị trường, chuỗi tỷ lệ, dự báo.', lessons: [c1, c2, c2e, c1q] },
    { title: 'Part 2 — Customer value & buying behaviour|||Phần 2 — Giá trị khách hàng & hành vi mua', description: 'Giá trị cảm nhận, NPS, CLV, CAC, CRM, tâm lý người tiêu dùng, trung tâm mua của tổ chức.', lessons: [c3, c4, c3e, c3q] },
    { title: 'Part 3 — Brands, competition & the offering|||Phần 3 — Thương hiệu, cạnh tranh & sản phẩm chào bán', description: 'POP/POD, CBBE, kiến trúc thương hiệu, chiến lược cạnh tranh, dịch vụ, đổi mới, định giá.', lessons: [c5, c6, c7, c5q] },
    { title: 'Part 4 — Delivering, communicating & controlling|||Phần 4 — Phân phối, truyền thông & kiểm soát', description: 'Quản trị kênh, đa kênh, phễu và chỉ số số, tổ chức, bốn loại kiểm soát, ROMI.', lessons: [c8, c9, c9e, c8q] },
  ],
};
