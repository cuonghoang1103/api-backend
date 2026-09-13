/**
 * OPM301 — Operations Management (Quản trị vận hành). Khối Quản trị Kinh doanh, kỳ 3.
 * Bám cấu trúc giáo trình quản trị vận hành chuẩn quốc tế (Heizer, Render & Munson — Operations
 * Management; Stevenson — Operations Management; Slack, Brandon-Jones & Burgess — Operations
 * Management): chiến lược vận hành & năng suất, dự báo, thiết kế sản phẩm & quy trình, công suất,
 * hoà vốn, cây quyết định, địa điểm & mặt bằng, TQM, Six Sigma, SPC, hoạch định tổng hợp, MRP,
 * điều độ, tinh gọn/JIT, dự án CPM/PERT. EOQ & tồn kho đã dạy kỹ ở SCM202 nên chỉ nhắc để liên hệ.
 * Song ngữ + ví dụ số (đã kiểm bằng máy; tình huống & số liệu là GIẢ ĐỊNH) + bài tập + quiz.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('opm301-0-1-overview', 'Course overview: what operations managers do|||Tổng quan: nhà quản trị vận hành làm gì',
  'Quản trị vận hành là gì, mô hình chuyển hoá đầu vào – đầu ra, khác biệt giữa hàng hoá và dịch vụ, mười quyết định chiến lược của quản trị vận hành, năm mục tiêu hoạt động, những người đặt nền móng và lộ trình môn học.',
  [[
    `<span class="eyebrow">OPM301 · Lesson 0.1 · Overview</span>
<h2>Operations Management</h2>
<p class="lead">Operations management (OM) is the set of activities that creates value in the form of goods and services by transforming inputs into outputs. Every organization — a factory, a hospital, a bank, a coffee chain — has an operations function, and it is often the part that employs the most people and accounts for the largest share of costs.</p>
<h3>The transformation model</h3>
<pre><code>INPUTS                        TRANSFORMATION                OUTPUTS
materials, labour,      →     fabricate, assemble,     →    goods and services
capital, energy,              transport, store,             that customers value
information, customers        inspect, serve
                 ← feedback: measure, compare, correct ←</code></pre>
<p>Marketing (generating demand), finance (raising and tracking money) and operations (creating the product) are the three core functions of any organization. Operations decisions determine cost, quality and delivery, so they shape competitiveness directly.</p>
<h3>Goods versus services</h3>
<table>
<tr><th>Goods</th><th>Services</th></tr>
<tr><td>Tangible; can be stored in inventory</td><td>Intangible; usually cannot be inventoried</td></tr>
<tr><td>Produced before they are consumed</td><td>Often produced and consumed at the same time</td></tr>
<tr><td>Little customer contact during production</td><td>High customer interaction, often with the customer present</td></tr>
<tr><td>Standardized, easier to automate</td><td>Often customized and variable from one delivery to the next</td></tr>
<tr><td>Quality measured against specifications</td><td>Quality harder to measure; depends on perception</td></tr>
</table>
<p>Most offerings are a bundle of both: a restaurant meal combines food (a good) with table service; a new motorbike comes with financing and warranty service.</p>
<h3>The ten strategic OM decisions</h3>
<p>Heizer, Render and Munson organize the field around ten decisions:</p>
<ol>
<li>Design of goods and services — Part 2</li>
<li>Managing quality — Part 3</li>
<li>Process and capacity design — Part 2</li>
<li>Location strategy — Part 2</li>
<li>Layout strategy — Part 2</li>
<li>Human resources and job design</li>
<li>Supply-chain management</li>
<li>Inventory management — covered in depth in SCM202 and linked here in Parts 4–5</li>
<li>Scheduling, intermediate and short term — Part 4</li>
<li>Maintenance</li>
</ol>
<h3>Five performance objectives</h3>
<p>Slack, Brandon-Jones and Burgess describe what operations must deliver through five performance objectives: <strong>quality</strong> (doing things right), <strong>speed</strong> (doing things fast), <strong>dependability</strong> (doing things on time), <strong>flexibility</strong> (being able to change what is done) and <strong>cost</strong> (doing things cheaply). Improving the first four usually lowers cost as well, because errors, delays and confusion are expensive.</p>
<h3>Where the ideas came from</h3>
<p>Frederick W. Taylor's scientific management studied work methods systematically; Henry Ford's moving assembly line brought mass production; Walter Shewhart introduced statistical control charts; W. Edwards Deming and Joseph M. Juran spread quality management; Taiichi Ohno built the Toyota Production System, the root of lean operations. Today OM also deals with global supply chains, digital technology and sustainability.</p>
<h3>Roadmap</h3>
<p>Part 1: operations strategy, productivity and forecasting · Part 2: product and process design, capacity, location and layout · Part 3: quality management and statistical process control · Part 4: aggregate planning, MRP and scheduling · Part 5: lean operations and project management. All companies in the examples are fictional and all numbers are illustrative; every calculation has been checked.</p>
<div class="callout"><span class="badge">One idea to keep</span> Operations is where strategy becomes real: a promise of "fast, cheap and reliable" is only as good as the processes that deliver it every day.</div>`,
    `<span class="eyebrow">OPM301 · Bài 0.1 · Tổng quan</span>
<h2>Quản trị vận hành</h2>
<p class="lead">Quản trị vận hành (operations management — OM) là tập hợp các hoạt động tạo ra giá trị dưới dạng hàng hoá và dịch vụ bằng cách chuyển hoá đầu vào thành đầu ra. Mọi tổ chức — nhà máy, bệnh viện, ngân hàng, chuỗi cà phê — đều có chức năng vận hành, và đây thường là bộ phận sử dụng nhiều lao động nhất và chiếm phần chi phí lớn nhất.</p>
<h3>Mô hình chuyển hoá</h3>
<pre><code>ĐẦU VÀO                       CHUYỂN HOÁ                    ĐẦU RA
nguyên vật liệu, lao động, →  chế tạo, lắp ráp,        →    hàng hoá và dịch vụ
vốn, năng lượng,              vận chuyển, lưu kho,          mà khách hàng coi trọng
thông tin, khách hàng         kiểm tra, phục vụ
                 ← phản hồi: đo lường, so sánh, điều chỉnh ←</code></pre>
<p>Marketing (tạo ra nhu cầu), tài chính (huy động và theo dõi tiền) và vận hành (tạo ra sản phẩm) là ba chức năng cốt lõi của mọi tổ chức. Quyết định vận hành quyết định chi phí, chất lượng và khả năng giao hàng, nên chúng trực tiếp định hình năng lực cạnh tranh.</p>
<h3>Hàng hoá và dịch vụ</h3>
<table>
<tr><th>Hàng hoá</th><th>Dịch vụ</th></tr>
<tr><td>Hữu hình; có thể lưu kho</td><td>Vô hình; thường không lưu kho được</td></tr>
<tr><td>Được sản xuất trước khi tiêu dùng</td><td>Thường được tạo ra và tiêu dùng cùng lúc</td></tr>
<tr><td>Ít tiếp xúc với khách hàng khi sản xuất</td><td>Tương tác cao với khách hàng, thường có khách hàng hiện diện</td></tr>
<tr><td>Chuẩn hoá, dễ tự động hoá hơn</td><td>Thường cá biệt hoá và thay đổi giữa các lần cung cấp</td></tr>
<tr><td>Chất lượng đo theo quy cách kỹ thuật</td><td>Chất lượng khó đo hơn; phụ thuộc cảm nhận</td></tr>
</table>
<p>Phần lớn sản phẩm là sự kết hợp của cả hai: một bữa ăn ở nhà hàng gồm món ăn (hàng hoá) và phục vụ tại bàn (dịch vụ); một chiếc xe máy mới đi kèm dịch vụ trả góp và bảo hành.</p>
<h3>Mười quyết định chiến lược của quản trị vận hành</h3>
<p>Heizer, Render và Munson tổ chức lĩnh vực này quanh mười quyết định:</p>
<ol>
<li>Thiết kế hàng hoá và dịch vụ — Phần 2</li>
<li>Quản trị chất lượng — Phần 3</li>
<li>Thiết kế quy trình và công suất — Phần 2</li>
<li>Chiến lược địa điểm — Phần 2</li>
<li>Chiến lược bố trí mặt bằng — Phần 2</li>
<li>Nguồn nhân lực và thiết kế công việc</li>
<li>Quản trị chuỗi cung ứng</li>
<li>Quản trị tồn kho — đã học kỹ ở SCM202, được liên hệ lại ở Phần 4–5</li>
<li>Điều độ trung hạn và ngắn hạn — Phần 4</li>
<li>Bảo trì</li>
</ol>
<h3>Năm mục tiêu hoạt động</h3>
<p>Slack, Brandon-Jones và Burgess mô tả điều mà vận hành phải mang lại qua năm mục tiêu hoạt động (performance objectives): <strong>chất lượng</strong> (làm đúng), <strong>tốc độ</strong> (làm nhanh), <strong>độ tin cậy</strong> (làm đúng hẹn), <strong>tính linh hoạt</strong> (có thể thay đổi việc đang làm) và <strong>chi phí</strong> (làm với chi phí thấp). Cải thiện bốn mục tiêu đầu thường cũng làm giảm chi phí, vì sai sót, chậm trễ và lộn xộn đều tốn tiền.</p>
<h3>Những người đặt nền móng</h3>
<p>Quản lý khoa học của Frederick W. Taylor nghiên cứu phương pháp làm việc một cách hệ thống; dây chuyền lắp ráp di động của Henry Ford mở ra sản xuất hàng loạt; Walter Shewhart đưa ra biểu đồ kiểm soát thống kê; W. Edwards Deming và Joseph M. Juran phổ biến quản trị chất lượng; Taiichi Ohno xây dựng Hệ thống sản xuất Toyota, gốc rễ của vận hành tinh gọn. Ngày nay quản trị vận hành còn xử lý chuỗi cung ứng toàn cầu, công nghệ số và phát triển bền vững.</p>
<h3>Lộ trình</h3>
<p>Phần 1: chiến lược vận hành, năng suất và dự báo · Phần 2: thiết kế sản phẩm và quy trình, công suất, địa điểm và mặt bằng · Phần 3: quản trị chất lượng và kiểm soát quá trình bằng thống kê · Phần 4: hoạch định tổng hợp, MRP và điều độ · Phần 5: vận hành tinh gọn và quản trị dự án. Mọi doanh nghiệp trong ví dụ đều là tình huống giả định, mọi con số là số liệu minh hoạ giả định; mọi phép tính đã được kiểm tra.</p>
<div class="callout"><span class="badge">Một ý cần giữ</span> Vận hành là nơi chiến lược trở thành hiện thực: lời hứa "nhanh, rẻ và đáng tin cậy" chỉ có giá trị khi các quy trình thực hiện được nó mỗi ngày.</div>`,
  ]]);

const c1 = doc('opm301-1-1-strategy-productivity', '1.1 — Operations strategy & productivity|||1.1 — Chiến lược vận hành & năng suất',
  'Sứ mệnh và chiến lược, ba cách tạo lợi thế cạnh tranh (khác biệt hoá, dẫn đầu chi phí, phản ứng nhanh), tiêu chí đủ điều kiện và tiêu chí giành đơn hàng, các bước xây dựng chiến lược vận hành, đo năng suất đơn yếu tố và đa yếu tố có ví dụ số.',
  [[
    `<span class="eyebrow">OPM301 · Part 1 · Lesson 1.1</span>
<h2>Operations strategy &amp; productivity</h2>
<p class="lead">An organization's mission states why it exists; its strategy is the action plan for achieving that mission; operations strategy turns the plan into concrete decisions about processes, capacity, quality and people.</p>
<h3>Three ways to build competitive advantage</h3>
<table>
<tr><th>Strategy</th><th>Idea</th><th>What operations must do</th></tr>
<tr><td>Differentiation</td><td>Offer something customers perceive as unique and worth more</td><td>Distinctive product and service design; consistently high quality; a memorable customer experience</td></tr>
<tr><td>Cost leadership</td><td>Deliver acceptable value at the lowest cost</td><td>Economies of scale, standardized processes, high utilization, low waste</td></tr>
<tr><td>Response</td><td>Be fast, flexible and reliable</td><td>Short lead times, quick product development, dependable delivery, flexible capacity</td></tr>
</table>
<h3>Order qualifiers and order winners</h3>
<p>An <strong>order qualifier</strong> is a characteristic a product must have just to be considered by customers — for example, meeting basic safety standards or falling within an acceptable price range. An <strong>order winner</strong> is the characteristic that makes customers choose you over competitors — for example, the fastest delivery in town. Qualifiers change over time: yesterday's winner, such as online ordering, often becomes today's qualifier.</p>
<h3>Developing an operations strategy</h3>
<ul>
<li><strong>Analyse the environment</strong> — a SWOT analysis of strengths, weaknesses, opportunities and threats.</li>
<li><strong>Identify key success factors</strong> — the few activities the firm must do well to win — and the <strong>core competencies</strong> (skills and capabilities) it can build on.</li>
<li><strong>Integrate the OM decisions</strong> — make the ten decisions support each other, and decide what to do in-house and what to <strong>outsource</strong>.</li>
<li><strong>Adapt over the product life cycle</strong> — early stages stress design and flexibility; maturity stresses cost and process efficiency.</li>
</ul>
<h3>Measuring productivity</h3>
<p><strong>Productivity</strong> is the ratio of outputs (goods and services) to inputs (labour, materials, energy, capital, management). Raising productivity means doing more with the same resources — the main source of lower unit costs for firms and of rising living standards for countries.</p>
<pre><code>Single-factor productivity = output / one input
Multifactor productivity   = output / (labour + material + energy + capital + overhead)

Minh An Furniture — a fictional workshop, illustrative weekly figures
                           Before new jig        After new jig
Chairs produced                 240                  288
Labour-hours                    160                  160
Labour productivity       1.5 chairs/hour      1.8 chairs/hour     (+20.0%)
Inputs ($): labour 1,600 · materials 2,400 → 2,880 · energy 200 → 220
            capital 500 → 600 · overhead 300
Total inputs ($)              5,000                5,600
Multifactor productivity  0.0480 chairs/$     0.0514 chairs/$     (+7.1%)</code></pre>
<p>Labour productivity rose 20%, but the extra chairs also consumed more material, energy and capital (the jig itself), so multifactor productivity rose only about 7.1%. Single-factor measures are easy to track; multifactor measures give a fuller picture of efficiency.</p>
<h3>What drives productivity</h3>
<p>Three variables drive productivity growth: <strong>labour</strong> (education, skills, motivation), <strong>capital</strong> (equipment, technology) and <strong>management</strong> (organizing labour and capital effectively). Measuring productivity is harder in services, because the work is often labour-intensive, customized and intellectual, and quality is difficult to count — a doctor who sees more patients per hour is not necessarily more productive.</p>
<div class="callout"><span class="badge">Watch out</span> Productivity measures efficiency, not effectiveness. Producing more units that customers do not want, or of poor quality, raises the ratio while destroying value.</div>`,
    `<span class="eyebrow">OPM301 · Phần 1 · Bài 1.1</span>
<h2>Chiến lược vận hành &amp; năng suất</h2>
<p class="lead">Sứ mệnh cho biết tổ chức tồn tại để làm gì; chiến lược là kế hoạch hành động để đạt sứ mệnh đó; chiến lược vận hành biến kế hoạch thành các quyết định cụ thể về quy trình, công suất, chất lượng và con người.</p>
<h3>Ba cách tạo lợi thế cạnh tranh</h3>
<table>
<tr><th>Chiến lược</th><th>Ý tưởng</th><th>Vận hành phải làm gì</th></tr>
<tr><td>Khác biệt hoá</td><td>Mang lại điều khách hàng cảm nhận là độc đáo và đáng giá hơn</td><td>Thiết kế sản phẩm, dịch vụ khác biệt; chất lượng cao ổn định; trải nghiệm khách hàng đáng nhớ</td></tr>
<tr><td>Dẫn đầu về chi phí</td><td>Mang lại giá trị chấp nhận được với chi phí thấp nhất</td><td>Lợi thế kinh tế nhờ quy mô, quy trình chuẩn hoá, mức sử dụng cao, ít lãng phí</td></tr>
<tr><td>Phản ứng nhanh</td><td>Nhanh, linh hoạt và đáng tin cậy</td><td>Thời gian chờ ngắn, phát triển sản phẩm nhanh, giao hàng đúng hẹn, công suất linh hoạt</td></tr>
</table>
<h3>Tiêu chí đủ điều kiện và tiêu chí giành đơn hàng</h3>
<p><strong>Tiêu chí đủ điều kiện</strong> (order qualifier) là đặc điểm sản phẩm bắt buộc phải có chỉ để được khách hàng đưa vào cân nhắc — ví dụ đạt tiêu chuẩn an toàn cơ bản hoặc có giá trong khoảng chấp nhận được. <strong>Tiêu chí giành đơn hàng</strong> (order winner) là đặc điểm khiến khách hàng chọn bạn thay vì đối thủ — ví dụ giao hàng nhanh nhất thành phố. Tiêu chí đủ điều kiện thay đổi theo thời gian: yếu tố giành đơn hàng hôm qua, như đặt hàng trực tuyến, thường trở thành tiêu chí đủ điều kiện hôm nay.</p>
<h3>Xây dựng chiến lược vận hành</h3>
<ul>
<li><strong>Phân tích môi trường</strong> — phân tích SWOT về điểm mạnh, điểm yếu, cơ hội và thách thức.</li>
<li><strong>Xác định các yếu tố thành công then chốt</strong> — số ít hoạt động doanh nghiệp buộc phải làm tốt để thắng — và <strong>năng lực cốt lõi</strong> (kỹ năng, khả năng) có thể dựa vào.</li>
<li><strong>Tích hợp các quyết định vận hành</strong> — để mười quyết định hỗ trợ lẫn nhau, và quyết định việc gì tự làm, việc gì <strong>thuê ngoài</strong>.</li>
<li><strong>Điều chỉnh theo chu kỳ sống sản phẩm</strong> — giai đoạn đầu chú trọng thiết kế và tính linh hoạt; giai đoạn bão hoà chú trọng chi phí và hiệu quả quy trình.</li>
</ul>
<h3>Đo lường năng suất</h3>
<p><strong>Năng suất</strong> là tỷ số giữa đầu ra (hàng hoá, dịch vụ) và đầu vào (lao động, nguyên vật liệu, năng lượng, vốn, quản lý). Tăng năng suất nghĩa là làm được nhiều hơn với cùng nguồn lực — nguồn gốc chính của chi phí đơn vị thấp hơn với doanh nghiệp và mức sống cao hơn với quốc gia.</p>
<pre><code>Năng suất đơn yếu tố = đầu ra / một đầu vào
Năng suất đa yếu tố  = đầu ra / (lao động + vật liệu + năng lượng + vốn + chi phí chung)

Xưởng Nội thất Minh An — tình huống giả định, số liệu minh hoạ theo tuần
                           Trước khi có đồ gá     Sau khi có đồ gá
Số ghế sản xuất                  240                   288
Giờ công lao động                160                   160
Năng suất lao động         1,5 ghế/giờ           1,8 ghế/giờ          (+20,0%)
Đầu vào ($): lao động 1.600 · vật liệu 2.400 → 2.880 · năng lượng 200 → 220
             vốn 500 → 600 · chi phí chung 300
Tổng đầu vào ($)               5.000                 5.600
Năng suất đa yếu tố        0,0480 ghế/$          0,0514 ghế/$         (+7,1%)</code></pre>
<p>Năng suất lao động tăng 20%, nhưng số ghế tăng thêm cũng tiêu tốn thêm vật liệu, năng lượng và vốn (chính chiếc đồ gá), nên năng suất đa yếu tố chỉ tăng khoảng 7,1%. Chỉ số đơn yếu tố dễ theo dõi; chỉ số đa yếu tố cho bức tranh đầy đủ hơn về hiệu quả.</p>
<h3>Điều gì thúc đẩy năng suất</h3>
<p>Ba biến số thúc đẩy tăng năng suất: <strong>lao động</strong> (giáo dục, kỹ năng, động lực), <strong>vốn</strong> (máy móc, công nghệ) và <strong>quản lý</strong> (tổ chức lao động và vốn hiệu quả). Đo năng suất trong dịch vụ khó hơn, vì công việc thường thâm dụng lao động, cá biệt hoá và mang tính trí tuệ, còn chất lượng thì khó đếm — một bác sĩ khám được nhiều bệnh nhân hơn mỗi giờ chưa chắc đã năng suất hơn.</p>
<div class="callout"><span class="badge">Cẩn thận</span> Năng suất đo hiệu suất (làm việc đúng cách), không đo hiệu quả (làm đúng việc). Sản xuất thêm những sản phẩm khách hàng không cần, hoặc kém chất lượng, làm tỷ số tăng lên trong khi phá huỷ giá trị.</div>`,
  ]]);

const c2 = doc('opm301-1-2-forecasting', '1.2 — Forecasting demand|||1.2 — Dự báo nhu cầu',
  'Tầm dự báo, phương pháp định tính và định lượng, bốn thành phần của chuỗi thời gian, trung bình động (có trọng số), san bằng mũ, đường xu hướng bình phương nhỏ nhất, chỉ số mùa vụ, sai số MAD, MSE, MAPE và tín hiệu theo dõi, có ví dụ số.',
  [[
    `<span class="eyebrow">OPM301 · Part 1 · Lesson 1.2</span>
<h2>Forecasting demand</h2>
<p class="lead">Almost every operations decision — capacity, staffing, purchasing, scheduling — starts from a forecast of demand. Forecasts are always wrong to some degree; the goal is to be useful and to know how wrong you are likely to be.</p>
<h3>Horizons and approaches</h3>
<table>
<tr><th>Horizon</th><th>Typical span</th><th>Used for</th></tr>
<tr><td>Short range</td><td>Up to 1 year, generally under 3 months</td><td>Purchasing, job scheduling, workforce levels</td></tr>
<tr><td>Medium range</td><td>3 months to 3 years</td><td>Sales and production planning, budgeting</td></tr>
<tr><td>Long range</td><td>3 years or more</td><td>New products, facility location, capital expenditure</td></tr>
</table>
<p><strong>Qualitative methods</strong> rely on judgement: the jury of executive opinion, the <strong>Delphi method</strong> (anonymous rounds of expert opinion until views converge), the sales-force composite and consumer market surveys. They suit new products and long horizons with no history. <strong>Quantitative methods</strong> use data: <em>time-series</em> models project the past forward (naive, moving averages, exponential smoothing, trend projection), while <em>associative</em> models such as linear regression link demand to other variables (price, advertising, income).</p>
<p>A time series has four components: <strong>trend</strong>, <strong>seasonality</strong> (a pattern repeating within a year, week or day), <strong>cycles</strong> (multi-year waves linked to the economy) and <strong>random variation</strong>.</p>
<h3>Moving averages and exponential smoothing</h3>
<pre><code>Demand (units, illustrative): months 1–6 = 120, 130, 110, 140, 150, 145

Naive forecast for month 7        = last actual                    = 145
3-month moving average            = (140 + 150 + 145) / 3          = 145.00
Weighted MA (weights 3, 2, 1; most recent month weighs most)
                                  = (3x145 + 2x150 + 1x140) / 6    = 145.83
Exponential smoothing:  F(t+1) = F(t) + α x [A(t) − F(t)]
  F(6) = 142, A(6) = 145, α = 0.2  → F(7) = 142 + 0.2 x 3        = 142.60</code></pre>
<p>A longer moving average smooths more but reacts more slowly to real changes. In exponential smoothing the constant α (between 0 and 1) sets the balance: a high α follows recent demand closely; a low α filters out noise. Both methods <strong>lag behind a trend</strong>; trend-adjusted exponential smoothing adds a second smoothed term for the trend.</p>
<h3>Trend projection (least squares)</h3>
<pre><code>ŷ = a + b x      b = (Σxy − n x̄ ȳ) / (Σx² − n x̄²)      a = ȳ − b x̄

Annual sales (thousand units, illustrative): years 1–5 = 20, 24, 27, 31, 33
n = 5, Σx = 15, Σy = 135, Σxy = 438, Σx² = 55, x̄ = 3, ȳ = 27
b = (438 − 5 x 3 x 27) / (55 − 5 x 3²) = 33 / 10 = 3.3
a = 27 − 3.3 x 3 = 17.1
Forecast for year 6 = 17.1 + 3.3 x 6 = 36.9 thousand units</code></pre>
<p>For seasonal data, compute a <strong>seasonal index</strong> for each period (average demand in that season ÷ average demand over all seasons) and multiply the trend forecast by it.</p>
<h3>Measuring forecast error</h3>
<pre><code>Error = Actual − Forecast
MAD  = Σ|error| / n                     mean absolute deviation
MSE  = Σ(error)² / n                    mean squared error — punishes large errors
MAPE = Σ(100 x |error| / actual) / n    mean absolute percent error

Actual     100   110    95   120
Forecast   105   104   100   112
Error       −5    +6    −5    +8
MAD = 24 / 4 = 6.0      MSE = 150 / 4 = 37.5      MAPE ≈ 5.6%</code></pre>
<p>Always compare methods over the same periods. To monitor bias, divide the running sum of errors by MAD to obtain the <strong>tracking signal</strong> (here 4 / 6 ≈ 0.67). A signal that drifts beyond preset limits (for example ±4 MADs) shows that the forecast is consistently too high or too low and must be revised.</p>
<div class="callout"><span class="badge">Remember</span> A good forecast states its error. A plan built on a single number with no error estimate leaves no room for the variability that will certainly come.</div>`,
    `<span class="eyebrow">OPM301 · Phần 1 · Bài 1.2</span>
<h2>Dự báo nhu cầu</h2>
<p class="lead">Gần như mọi quyết định vận hành — công suất, nhân sự, mua hàng, điều độ — đều bắt đầu từ dự báo nhu cầu. Dự báo luôn sai ở một mức nào đó; mục tiêu là dự báo hữu ích và biết mình có thể sai bao nhiêu.</p>
<h3>Tầm dự báo và cách tiếp cận</h3>
<table>
<tr><th>Tầm dự báo</th><th>Khoảng thời gian điển hình</th><th>Dùng cho</th></tr>
<tr><td>Ngắn hạn</td><td>Tới 1 năm, thường dưới 3 tháng</td><td>Mua hàng, điều độ công việc, mức nhân lực</td></tr>
<tr><td>Trung hạn</td><td>Từ 3 tháng tới 3 năm</td><td>Kế hoạch bán hàng và sản xuất, lập ngân sách</td></tr>
<tr><td>Dài hạn</td><td>Từ 3 năm trở lên</td><td>Sản phẩm mới, chọn địa điểm, chi đầu tư</td></tr>
</table>
<p><strong>Phương pháp định tính</strong> dựa vào phán đoán: lấy ý kiến ban điều hành, <strong>phương pháp Delphi</strong> (nhiều vòng lấy ý kiến chuyên gia ẩn danh cho tới khi các ý kiến hội tụ), tổng hợp ý kiến lực lượng bán hàng và khảo sát người tiêu dùng. Chúng phù hợp với sản phẩm mới và tầm dài hạn khi chưa có dữ liệu. <strong>Phương pháp định lượng</strong> dùng dữ liệu: mô hình <em>chuỗi thời gian</em> kéo dài quá khứ về phía trước (dự báo giản đơn, trung bình động, san bằng mũ, đường xu hướng), còn mô hình <em>nhân quả</em> như hồi quy tuyến tính gắn nhu cầu với biến khác (giá, quảng cáo, thu nhập).</p>
<p>Chuỗi thời gian có bốn thành phần: <strong>xu hướng</strong>, <strong>mùa vụ</strong> (khuôn mẫu lặp lại trong năm, tuần hay ngày), <strong>chu kỳ</strong> (những làn sóng nhiều năm gắn với nền kinh tế) và <strong>biến động ngẫu nhiên</strong>.</p>
<h3>Trung bình động và san bằng mũ</h3>
<pre><code>Nhu cầu (sản phẩm, số liệu minh hoạ): tháng 1–6 = 120, 130, 110, 140, 150, 145

Dự báo giản đơn cho tháng 7        = thực tế kỳ gần nhất            = 145
Trung bình động 3 tháng            = (140 + 150 + 145) / 3          = 145,00
Trung bình động có trọng số (trọng số 3, 2, 1; tháng gần nhất nặng nhất)
                                   = (3x145 + 2x150 + 1x140) / 6    = 145,83
San bằng mũ:  F(t+1) = F(t) + α x [A(t) − F(t)]
  F(6) = 142, A(6) = 145, α = 0,2  → F(7) = 142 + 0,2 x 3         = 142,60</code></pre>
<p>Trung bình động càng dài càng làm trơn nhiều nhưng phản ứng càng chậm với thay đổi thật. Trong san bằng mũ, hệ số α (từ 0 đến 1) quyết định sự cân bằng: α cao bám sát nhu cầu gần đây; α thấp lọc bớt nhiễu. Cả hai phương pháp đều <strong>đi chậm sau xu hướng</strong>; san bằng mũ có điều chỉnh xu hướng thêm một thành phần san bằng thứ hai cho xu hướng.</p>
<h3>Đường xu hướng (bình phương nhỏ nhất)</h3>
<pre><code>ŷ = a + b x      b = (Σxy − n x̄ ȳ) / (Σx² − n x̄²)      a = ȳ − b x̄

Doanh số năm (nghìn sản phẩm, số liệu minh hoạ): năm 1–5 = 20, 24, 27, 31, 33
n = 5, Σx = 15, Σy = 135, Σxy = 438, Σx² = 55, x̄ = 3, ȳ = 27
b = (438 − 5 x 3 x 27) / (55 − 5 x 3²) = 33 / 10 = 3,3
a = 27 − 3,3 x 3 = 17,1
Dự báo năm 6 = 17,1 + 3,3 x 6 = 36,9 nghìn sản phẩm</code></pre>
<p>Với dữ liệu có mùa vụ, tính <strong>chỉ số mùa vụ</strong> cho từng kỳ (nhu cầu trung bình của mùa đó ÷ nhu cầu trung bình của mọi mùa) rồi nhân dự báo theo xu hướng với chỉ số này.</p>
<h3>Đo sai số dự báo</h3>
<pre><code>Sai số = Thực tế − Dự báo
MAD  = Σ|sai số| / n                    độ lệch tuyệt đối trung bình
MSE  = Σ(sai số)² / n                   sai số bình phương trung bình — phạt nặng sai số lớn
MAPE = Σ(100 x |sai số| / thực tế) / n  sai số phần trăm tuyệt đối trung bình

Thực tế    100   110    95   120
Dự báo     105   104   100   112
Sai số      −5    +6    −5    +8
MAD = 24 / 4 = 6,0      MSE = 150 / 4 = 37,5      MAPE ≈ 5,6%</code></pre>
<p>Luôn so sánh các phương pháp trên cùng những kỳ. Để theo dõi độ chệch, chia tổng cộng dồn của sai số cho MAD để có <strong>tín hiệu theo dõi</strong> (ở đây 4 / 6 ≈ 0,67). Tín hiệu trôi ra ngoài giới hạn đặt trước (ví dụ ±4 MAD) cho thấy dự báo luôn cao quá hoặc thấp quá và phải được điều chỉnh.</p>
<div class="callout"><span class="badge">Ghi nhớ</span> Một dự báo tốt luôn nêu kèm sai số. Kế hoạch dựa trên một con số duy nhất, không có ước lượng sai số, sẽ không chừa chỗ cho biến động chắc chắn sẽ xảy ra.</div>`,
  ]]);

const c2e = doc('opm301-1-3-exercise', 'Exercise 1 — moving average vs exponential smoothing|||Bài tập 1 — trung bình động và san bằng mũ',
  'Bài tập: dự báo nhu cầu 8 tháng bằng trung bình động 3 kỳ và san bằng mũ α = 0,3, tính MAD trên cùng các tháng 4–8, chọn phương pháp và giải thích vì sao cả hai đều dự báo thấp khi nhu cầu có xu hướng tăng; kèm lời giải.',
  [[
    `<span class="eyebrow">OPM301 · Part 1 · Exercise 1</span>
<h2>Exercise 1 — which forecast is better for the café?</h2>
<div class="callout"><span class="badge">Problem</span> A fictional café sells bottled cold brew. Monthly demand (bottles) for months 1–8 was 50, 54, 51, 57, 60, 58, 63, 65 (illustrative numbers). (a) Forecast months 4–9 with a 3-month moving average. (b) Forecast months 2–9 with exponential smoothing, α = 0.3, taking the forecast for month 1 as 50. (c) Compare the MAD of both methods over months 4–8 and recommend one. What do the signs of the errors tell you?</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) 3-month moving average
Month  Actual  Forecast   Error   |Error|
  4      57     51.67     5.33     5.33      (50 + 54 + 51) / 3
  5      60     54.00     6.00     6.00
  6      58     56.00     2.00     2.00
  7      63     58.33     4.67     4.67
  8      65     60.33     4.67     4.67
MAD = 22.67 / 5 = 4.53          Forecast for month 9 = (58 + 63 + 65) / 3 = 62.00

(b) Exponential smoothing, α = 0.3, F(1) = 50
F(2) = 50    + 0.3 x (50 − 50)    = 50.00
F(3) = 50    + 0.3 x (54 − 50)    = 51.20
F(4) = 51.20 + 0.3 x (51 − 51.20) = 51.14
F(5) = 51.14 + 0.3 x (57 − 51.14) = 52.90
F(6) = 52.90 + 0.3 x (60 − 52.90) = 55.03
F(7) = 55.03 + 0.3 x (58 − 55.03) = 55.92
F(8) = 55.92 + 0.3 x (63 − 55.92) = 58.04
F(9) = 58.04 + 0.3 x (65 − 58.04) = 60.13
Errors, months 4–8: 5.86, 7.10, 2.97, 7.08, 6.96
MAD = 29.97 / 5 = 5.99

(c) MAD: moving average 4.53  &lt;  exponential smoothing 5.99
    → prefer the 3-month moving average for this series
    Every error in both methods is positive → both forecasts are too low</code></pre>
<p><strong>Why:</strong> demand has an upward trend, and averaging methods always trail a trend, so every error is positive — a sign of bias that MAD alone does not show. With α = 0.3 the smoothing gives heavy weight to old months and lags even more than the 3-month average. Raising α to 0.5 cuts the MAD to about 4.46, and a trend-adjusted method or a trend line would do better still. Always check the pattern of error signs, not just the size of the MAD.</p>`,
    `<span class="eyebrow">OPM301 · Phần 1 · Bài tập 1</span>
<h2>Bài tập 1 — dự báo nào tốt hơn cho quán cà phê?</h2>
<div class="callout"><span class="badge">Đề</span> Một quán cà phê (tình huống giả định) bán cà phê ủ lạnh đóng chai. Nhu cầu các tháng 1–8 (chai) là 50, 54, 51, 57, 60, 58, 63, 65 (số liệu minh hoạ giả định). (a) Dự báo tháng 4–9 bằng trung bình động 3 tháng. (b) Dự báo tháng 2–9 bằng san bằng mũ, α = 0,3, lấy dự báo tháng 1 là 50. (c) So sánh MAD của hai phương pháp trên các tháng 4–8 và đề xuất một phương pháp. Dấu của các sai số cho bạn biết điều gì?</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) Trung bình động 3 tháng
Tháng  Thực tế  Dự báo   Sai số   |Sai số|
  4      57     51,67     5,33     5,33      (50 + 54 + 51) / 3
  5      60     54,00     6,00     6,00
  6      58     56,00     2,00     2,00
  7      63     58,33     4,67     4,67
  8      65     60,33     4,67     4,67
MAD = 22,67 / 5 = 4,53          Dự báo tháng 9 = (58 + 63 + 65) / 3 = 62,00

(b) San bằng mũ, α = 0,3, F(1) = 50
F(2) = 50    + 0,3 x (50 − 50)    = 50,00
F(3) = 50    + 0,3 x (54 − 50)    = 51,20
F(4) = 51,20 + 0,3 x (51 − 51,20) = 51,14
F(5) = 51,14 + 0,3 x (57 − 51,14) = 52,90
F(6) = 52,90 + 0,3 x (60 − 52,90) = 55,03
F(7) = 55,03 + 0,3 x (58 − 55,03) = 55,92
F(8) = 55,92 + 0,3 x (63 − 55,92) = 58,04
F(9) = 58,04 + 0,3 x (65 − 58,04) = 60,13
Sai số tháng 4–8: 5,86; 7,10; 2,97; 7,08; 6,96
MAD = 29,97 / 5 = 5,99

(c) MAD: trung bình động 4,53  &lt;  san bằng mũ 5,99
    → chọn trung bình động 3 tháng cho chuỗi số liệu này
    Mọi sai số của cả hai phương pháp đều dương → cả hai đều dự báo thấp</code></pre>
<p><strong>Vì sao:</strong> nhu cầu có xu hướng tăng, mà các phương pháp lấy trung bình luôn đi sau xu hướng, nên mọi sai số đều dương — dấu hiệu của độ chệch mà riêng MAD không cho thấy. Với α = 0,3, phép san bằng đặt trọng số lớn vào các tháng cũ nên còn chậm hơn cả trung bình 3 tháng. Nâng α lên 0,5 thì MAD giảm còn khoảng 4,46, và một phương pháp có điều chỉnh xu hướng hoặc một đường xu hướng sẽ còn tốt hơn nữa. Luôn xem khuôn mẫu dấu của sai số, không chỉ độ lớn của MAD.</p>`,
  ]]);

const c2q = quiz('opm301-quiz-1', 'Quiz 1 — Strategy, productivity & forecasting|||Quiz 1 — Chiến lược, năng suất & dự báo', [
  { id: 'q1', question: 'A team produces 400 units in 80 labour-hours. Its labour productivity is…|||Một tổ sản xuất 400 sản phẩm trong 80 giờ công. Năng suất lao động của tổ là…', options: ['0.2 units per labour-hour|||0,2 sản phẩm/giờ công', '5 units per labour-hour|||5 sản phẩm/giờ công', '320 units|||320 sản phẩm', '480 units|||480 sản phẩm'], correctIndex: 1, explanation: 'Productivity = output / input = 400 / 80 = 5 units per labour-hour.|||Năng suất = đầu ra / đầu vào = 400 / 80 = 5 sản phẩm/giờ công.' },
  { id: 'q2', question: 'Last period’s forecast was 100, actual demand was 120 and α = 0.4. The exponential smoothing forecast for the next period is…|||Dự báo kỳ trước là 100, nhu cầu thực tế là 120 và α = 0,4. Dự báo san bằng mũ cho kỳ tới là…', options: ['104|||104', '112|||112', '120|||120', '108|||108'], correctIndex: 3, explanation: 'F = 100 + 0.4 x (120 − 100) = 100 + 8 = 108.|||F = 100 + 0,4 x (120 − 100) = 100 + 8 = 108.' },
  { id: 'q3', question: 'Which forecast error measure gives the most weight to large errors?|||Thước đo sai số dự báo nào đặt trọng số lớn nhất vào các sai số lớn?', options: ['MAD|||MAD', 'MAPE|||MAPE', 'MSE|||MSE', 'The tracking signal|||Tín hiệu theo dõi'], correctIndex: 2, explanation: 'MSE squares each error, so one error of 10 counts as much as four errors of 5.|||MSE bình phương từng sai số, nên một sai số 10 được tính nặng bằng bốn sai số 5.' },
]);

const c3 = doc('opm301-2-1-product-process-design', '2.1 — Designing goods, services & processes|||2.1 — Thiết kế sản phẩm, dịch vụ & quy trình',
  'Chu kỳ sống sản phẩm, công cụ phát triển sản phẩm (QFD và ngôi nhà chất lượng, kỹ thuật đồng thời, phân tích giá trị, thiết kế vững, mô-đun, CAD/CAM, đánh giá vòng đời), bốn chiến lược quy trình, ma trận sản phẩm – quy trình (Hayes và Wheelwright), ma trận quy trình dịch vụ và các công cụ phân tích quy trình.',
  [[
    `<span class="eyebrow">OPM301 · Part 2 · Lesson 2.1</span>
<h2>Designing goods, services &amp; processes</h2>
<p class="lead">Product decisions define what the firm offers; process decisions define how it will be made. Both lock in a large share of future cost and quality, so they should be made together.</p>
<h3>The product life cycle</h3>
<table>
<tr><th>Stage</th><th>Operations focus</th></tr>
<tr><td>Introduction</td><td>Frequent design changes, short production runs, high costs, few models; attention to R&amp;D and quality</td></tr>
<tr><td>Growth</td><td>Design stabilizes; forecast capacity accurately and add it in time; improve reliability</td></tr>
<tr><td>Maturity</td><td>Standardization, fewer changes, long runs; cost cutting and process optimization</td></tr>
<tr><td>Decline</td><td>Little differentiation; cost minimization; consider dropping items that no longer contribute</td></tr>
</table>
<h3>Product development tools</h3>
<ul>
<li><strong>Quality function deployment (QFD)</strong> translates what customers want into how the product will deliver it. Its main tool, the <strong>house of quality</strong>, relates customer requirements to technical attributes, weights their importance and compares competitors.</li>
<li><strong>Product development teams</strong> and <strong>concurrent engineering</strong> bring design, manufacturing, marketing and suppliers together from the start, instead of passing the design "over the wall" from one department to the next.</li>
<li><strong>Manufacturability and value engineering</strong> simplify the design, reduce the number of parts and use cheaper materials without losing function; <strong>value analysis</strong> does the same for products already in production.</li>
<li><strong>Robust design</strong> keeps the product working despite small variations in production or use; <strong>modular design</strong> builds variety from standard modules; <strong>computer-aided design (CAD)</strong> and <strong>computer-aided manufacturing (CAM)</strong> speed up design and link it directly to production.</li>
<li><strong>Sustainability</strong>: a <strong>life cycle assessment</strong> evaluates environmental impact from raw materials to disposal; designs increasingly plan for remanufacturing and recycling.</li>
</ul>
<h3>Four process strategies</h3>
<table>
<tr><th>Strategy</th><th>Volume and variety</th><th>Examples (illustrative)</th></tr>
<tr><td>Process focus (job shop)</td><td>Low volume, high variety; general-purpose equipment grouped by function</td><td>A print shop, a hospital, a machine shop</td></tr>
<tr><td>Repetitive focus</td><td>Standard modules assembled on a line; moderate volume and variety</td><td>Motorbike assembly, a fast-food kitchen</td></tr>
<tr><td>Product focus (continuous)</td><td>High volume, low variety; specialized equipment</td><td>A bottling plant, a steel mill, a flour mill</td></tr>
<tr><td>Mass customization</td><td>High volume <em>and</em> high variety through modular design, flexible processes and fast supply chains</td><td>Build-to-order laptops, customized sneakers</td></tr>
</table>
<p>The <strong>product–process matrix</strong> (Hayes and Wheelwright) shows that the right process moves from job shop toward continuous flow as volume rises and variety falls; operating far off this diagonal usually wastes money. A <strong>crossover chart</strong> compares the total cost of alternative processes at different volumes — the break-even logic of lesson 2.2.</p>
<h3>Designing service processes</h3>
<p>Services are classified by the degree of <strong>customer interaction and customization</strong> and by <strong>labour intensity</strong>, giving four quadrants: the <em>service factory</em> (low on both — e.g., airlines, hotels), the <em>service shop</em> (high interaction, low labour intensity — e.g., hospitals, auto repair), <em>mass service</em> (low interaction, high labour intensity — e.g., retailing, schools) and <em>professional service</em> (high on both — e.g., doctors, lawyers, consultants). Moving toward less interaction usually lowers cost; moving toward more interaction can raise value for the customer.</p>
<h3>Process analysis tools</h3>
<ul>
<li><strong>Flowcharts</strong> show the steps and the flow between them.</li>
<li><strong>Time-function mapping</strong> adds time on the horizontal axis to reveal waiting and hand-offs.</li>
<li><strong>Value-stream mapping</strong> separates value-added from non-value-added steps across the whole supply chain.</li>
<li><strong>Process charts</strong> classify steps into operations, transports, inspections, delays and storage.</li>
<li><strong>Service blueprinting</strong> marks the line of customer interaction and the points where the service can fail.</li>
</ul>
<div class="callout"><span class="badge">Key lesson</span> Much of a product's cost is committed at the design stage. Changing a drawing is cheap; changing a factory is not.</div>`,
    `<span class="eyebrow">OPM301 · Phần 2 · Bài 2.1</span>
<h2>Thiết kế sản phẩm, dịch vụ &amp; quy trình</h2>
<p class="lead">Quyết định sản phẩm xác định doanh nghiệp cung cấp gì; quyết định quy trình xác định sản phẩm được làm ra như thế nào. Cả hai đều khoá chặt phần lớn chi phí và chất lượng trong tương lai, nên cần được quyết định cùng nhau.</p>
<h3>Chu kỳ sống sản phẩm</h3>
<table>
<tr><th>Giai đoạn</th><th>Trọng tâm vận hành</th></tr>
<tr><td>Giới thiệu</td><td>Thiết kế thay đổi thường xuyên, loạt sản xuất ngắn, chi phí cao, ít mẫu mã; chú trọng nghiên cứu – phát triển và chất lượng</td></tr>
<tr><td>Tăng trưởng</td><td>Thiết kế ổn định dần; dự báo chính xác và bổ sung công suất kịp thời; nâng độ tin cậy</td></tr>
<tr><td>Bão hoà</td><td>Chuẩn hoá, ít thay đổi, loạt sản xuất dài; cắt giảm chi phí và tối ưu quy trình</td></tr>
<tr><td>Suy thoái</td><td>Ít khác biệt; tối thiểu hoá chi phí; cân nhắc loại bỏ mặt hàng không còn đóng góp</td></tr>
</table>
<h3>Công cụ phát triển sản phẩm</h3>
<ul>
<li><strong>Triển khai chức năng chất lượng (QFD)</strong> chuyển điều khách hàng muốn thành cách sản phẩm đáp ứng điều đó. Công cụ chính của nó là <strong>ngôi nhà chất lượng</strong>, liên kết yêu cầu khách hàng với thuộc tính kỹ thuật, gán trọng số mức quan trọng và so sánh với đối thủ.</li>
<li><strong>Nhóm phát triển sản phẩm</strong> và <strong>kỹ thuật đồng thời</strong> đưa thiết kế, sản xuất, marketing và nhà cung cấp làm việc cùng nhau ngay từ đầu, thay vì "ném bản thiết kế qua tường" từ phòng này sang phòng khác.</li>
<li><strong>Thiết kế dễ sản xuất và kỹ thuật giá trị</strong> đơn giản hoá thiết kế, giảm số chi tiết và dùng vật liệu rẻ hơn mà không mất chức năng; <strong>phân tích giá trị</strong> làm điều tương tự với sản phẩm đang sản xuất.</li>
<li><strong>Thiết kế vững</strong> (robust design) giúp sản phẩm vẫn hoạt động tốt dù sản xuất hay sử dụng có sai lệch nhỏ; <strong>thiết kế mô-đun</strong> tạo sự đa dạng từ các mô-đun chuẩn; <strong>thiết kế có máy tính hỗ trợ (CAD)</strong> và <strong>sản xuất có máy tính hỗ trợ (CAM)</strong> đẩy nhanh thiết kế và nối thẳng nó với sản xuất.</li>
<li><strong>Phát triển bền vững</strong>: <strong>đánh giá vòng đời</strong> xem xét tác động môi trường từ nguyên liệu thô tới khi thải bỏ; thiết kế ngày càng tính trước việc tái chế tạo và tái chế.</li>
</ul>
<h3>Bốn chiến lược quy trình</h3>
<table>
<tr><th>Chiến lược</th><th>Sản lượng và mức đa dạng</th><th>Ví dụ (minh hoạ)</th></tr>
<tr><td>Tập trung theo quá trình (xưởng gia công theo đơn)</td><td>Sản lượng thấp, đa dạng cao; máy móc đa năng xếp theo chức năng</td><td>Xưởng in, bệnh viện, xưởng cơ khí</td></tr>
<tr><td>Tập trung lặp lại</td><td>Các mô-đun chuẩn lắp ráp trên dây chuyền; sản lượng và mức đa dạng trung bình</td><td>Lắp ráp xe máy, bếp đồ ăn nhanh</td></tr>
<tr><td>Tập trung theo sản phẩm (liên tục)</td><td>Sản lượng cao, đa dạng thấp; máy móc chuyên dùng</td><td>Nhà máy đóng chai, nhà máy thép, nhà máy bột mì</td></tr>
<tr><td>Cá biệt hoá đại trà</td><td>Sản lượng cao <em>và</em> đa dạng cao nhờ thiết kế mô-đun, quy trình linh hoạt và chuỗi cung ứng nhanh</td><td>Máy tính xách tay lắp theo đơn, giày thể thao theo yêu cầu</td></tr>
</table>
<p><strong>Ma trận sản phẩm – quy trình</strong> (Hayes và Wheelwright) cho thấy quy trình phù hợp chuyển dần từ xưởng gia công theo đơn sang dòng chảy liên tục khi sản lượng tăng và mức đa dạng giảm; vận hành quá xa đường chéo này thường gây lãng phí. <strong>Đồ thị điểm giao</strong> (crossover chart) so sánh tổng chi phí của các quy trình thay thế ở những mức sản lượng khác nhau — chính là logic hoà vốn ở bài 2.2.</p>
<h3>Thiết kế quy trình dịch vụ</h3>
<p>Dịch vụ được phân loại theo mức <strong>tương tác và cá biệt hoá với khách hàng</strong> và theo <strong>mức thâm dụng lao động</strong>, tạo thành bốn ô: <em>nhà máy dịch vụ</em> (thấp ở cả hai — vd hãng hàng không, khách sạn), <em>xưởng dịch vụ</em> (tương tác cao, thâm dụng lao động thấp — vd bệnh viện, sửa chữa ô tô), <em>dịch vụ đại trà</em> (tương tác thấp, thâm dụng lao động cao — vd bán lẻ, trường học) và <em>dịch vụ chuyên nghiệp</em> (cao ở cả hai — vd bác sĩ, luật sư, tư vấn). Giảm mức tương tác thường làm giảm chi phí; tăng mức tương tác có thể nâng giá trị cho khách hàng.</p>
<h3>Công cụ phân tích quy trình</h3>
<ul>
<li><strong>Lưu đồ</strong> thể hiện các bước và dòng chảy giữa chúng.</li>
<li><strong>Sơ đồ thời gian – chức năng</strong> thêm trục thời gian để lộ ra chỗ chờ đợi và chuyển giao.</li>
<li><strong>Sơ đồ chuỗi giá trị</strong> tách bước tạo giá trị khỏi bước không tạo giá trị trên toàn chuỗi cung ứng.</li>
<li><strong>Biểu đồ quy trình</strong> phân loại các bước thành thao tác, vận chuyển, kiểm tra, chờ đợi và lưu kho.</li>
<li><strong>Bản thiết kế dịch vụ</strong> (service blueprint) đánh dấu ranh giới tương tác với khách hàng và những điểm dịch vụ có thể hỏng.</li>
</ul>
<div class="callout"><span class="badge">Bài học then chốt</span> Phần lớn chi phí của sản phẩm đã được quyết định ở giai đoạn thiết kế. Sửa một bản vẽ thì rẻ; sửa một nhà máy thì không.</div>`,
  ]]);

const c4 = doc('opm301-2-2-capacity-breakeven', '2.2 — Capacity, break-even & decision trees|||2.2 — Công suất, hoà vốn & cây quyết định',
  'Công suất thiết kế, công suất hiệu quả, mức sử dụng và hiệu suất; phân tích điểm nghẽn và lý thuyết ràng buộc; chiến lược công suất đi trước, đi sau, bám sát; phân tích hoà vốn; cây quyết định với EMV và giá trị của thông tin hoàn hảo, có ví dụ số.',
  [[
    `<span class="eyebrow">OPM301 · Part 2 · Lesson 2.2</span>
<h2>Capacity, break-even &amp; decision trees</h2>
<p class="lead">Capacity is the throughput, or the number of units, a facility can hold, receive, store or produce in a period. Too little capacity loses customers; too much ties up money in idle resources.</p>
<h3>Design capacity, effective capacity, utilization and efficiency</h3>
<pre><code>Design capacity    = maximum theoretical output under ideal conditions
Effective capacity = output expected given product mix, scheduling,
                     maintenance and quality standards
Utilization = actual output / design capacity
Efficiency  = actual output / effective capacity

A fictional bakery: design 1,200 loaves/day, effective 1,000, actual 850
Utilization = 850 / 1,200 = 70.8%        Efficiency = 850 / 1,000 = 85.0%</code></pre>
<h3>Bottleneck analysis</h3>
<p>The <strong>bottleneck</strong> is the step with the lowest effective capacity; it limits the output of the whole system. The <strong>bottleneck time</strong> — the time of the slowest step — sets the pace: one finished unit leaves the process every bottleneck time. The <strong>throughput time</strong> is the time one unit takes to pass through all steps from start to finish (with no waiting, it is the sum of the step times).</p>
<pre><code>Three steps in series, one worker each: 4 min → 6 min → 5 min per unit
Bottleneck = step 2 (6 min) → capacity = 60 / 6 = 10 units per hour
Throughput time = 4 + 6 + 5 = 15 minutes
Add a second worker at step 2 → effectively 3 min per unit; new bottleneck = step 3
New capacity = 60 / 5 = 12 units per hour</code></pre>
<p>The <strong>theory of constraints</strong> (Goldratt) turns this into five focusing steps: identify the constraint, exploit it, subordinate everything else to it, elevate it (add capacity) and, once it is broken, go back to step 1. An hour lost at the bottleneck is an hour lost for the whole system; an hour saved at a non-bottleneck is a mirage.</p>
<h3>Capacity strategy</h3>
<p>A firm can <strong>lead</strong> demand (add capacity in advance — protects sales, risks idle capacity), <strong>lag</strong> demand (add capacity only when demand is proven — high utilization, risks lost sales) or <strong>match</strong> it with smaller, more frequent increments. Other considerations are economies and diseconomies of scale, flexibility, and a <strong>capacity cushion</strong> kept above expected demand.</p>
<h3>Break-even analysis</h3>
<pre><code>Break-even point in units     BEPx = F / (P − V)
Break-even point in dollars   BEP$ = F / (1 − V/P)
Profit                        = (P − V) x Q − F

Fixed cost F = $60,000; price P = $40; variable cost V = $25 per unit (illustrative)
BEPx = 60,000 / 15 = 4,000 units       BEP$ = 60,000 / (1 − 25/40) = $160,000
Profit at 5,000 units = 15 x 5,000 − 60,000 = $15,000
Volume needed for a $30,000 profit = (60,000 + 30,000) / 15 = 6,000 units</code></pre>
<p>Break-even assumes that price and costs are linear and that fixed and variable costs can be separated. It is the logic behind a crossover chart: a process with high fixed and low variable cost wins at high volumes.</p>
<h3>Decision trees under uncertainty</h3>
<p>A decision tree lays out decisions (squares), chance events (circles) and payoffs, then picks the alternative with the highest <strong>expected monetary value (EMV)</strong>.</p>
<pre><code>A fictional firm: build a large plant, a small plant, or do nothing
P(favourable market) = 0.45, P(unfavourable market) = 0.55
               Favourable   Unfavourable   EMV
Large plant     +240,000     −150,000      0.45 x 240,000 − 0.55 x 150,000 = 25,500
Small plant     +110,000      −30,000      0.45 x 110,000 − 0.55 x 30,000  = 33,000
Do nothing             0            0                                        0
Best choice: small plant (EMV $33,000)

Expected value WITH perfect information = 0.45 x 240,000 + 0.55 x 0 = 108,000
EVPI = 108,000 − 33,000 = $75,000   (the most worth paying for a perfect market study)</code></pre>
<p>The large plant would become the best choice only if the probability of a favourable market rose above 0.48 — a quick sensitivity check that tells managers which estimate deserves more research.</p>
<div class="callout"><span class="badge">Intuition</span> Capacity decisions are lumpy and long-lived. Break-even and EMV do not remove the risk; they show how much is at stake and which assumptions matter most.</div>`,
    `<span class="eyebrow">OPM301 · Phần 2 · Bài 2.2</span>
<h2>Công suất, hoà vốn &amp; cây quyết định</h2>
<p class="lead">Công suất là khối lượng đầu ra, hay số đơn vị, mà một cơ sở có thể chứa, tiếp nhận, lưu trữ hoặc sản xuất trong một khoảng thời gian. Công suất quá ít làm mất khách hàng; quá nhiều làm tiền bị giam trong nguồn lực nhàn rỗi.</p>
<h3>Công suất thiết kế, công suất hiệu quả, mức sử dụng và hiệu suất</h3>
<pre><code>Công suất thiết kế = sản lượng tối đa lý thuyết trong điều kiện lý tưởng
Công suất hiệu quả = sản lượng kỳ vọng khi tính tới cơ cấu sản phẩm, điều độ,
                     bảo trì và tiêu chuẩn chất lượng
Mức sử dụng = sản lượng thực tế / công suất thiết kế
Hiệu suất   = sản lượng thực tế / công suất hiệu quả

Một lò bánh (giả định): thiết kế 1.200 ổ/ngày, hiệu quả 1.000, thực tế 850
Mức sử dụng = 850 / 1.200 = 70,8%        Hiệu suất = 850 / 1.000 = 85,0%</code></pre>
<h3>Phân tích điểm nghẽn</h3>
<p><strong>Điểm nghẽn</strong> (nút cổ chai) là bước có công suất hiệu quả thấp nhất; nó giới hạn đầu ra của cả hệ thống. <strong>Thời gian điểm nghẽn</strong> — thời gian của bước chậm nhất — quyết định nhịp: cứ sau mỗi khoảng thời gian đó lại có một thành phẩm rời quy trình. <strong>Thời gian thông qua</strong> là thời gian để một đơn vị đi qua tất cả các bước từ đầu đến cuối (nếu không phải chờ, nó bằng tổng thời gian các bước).</p>
<pre><code>Ba bước nối tiếp, mỗi bước một người: 4 phút → 6 phút → 5 phút mỗi sản phẩm
Điểm nghẽn = bước 2 (6 phút) → công suất = 60 / 6 = 10 sản phẩm/giờ
Thời gian thông qua = 4 + 6 + 5 = 15 phút
Thêm người thứ hai ở bước 2 → thực tế còn 3 phút/sản phẩm; điểm nghẽn mới = bước 3
Công suất mới = 60 / 5 = 12 sản phẩm/giờ</code></pre>
<p><strong>Lý thuyết ràng buộc</strong> (Goldratt) biến điều này thành năm bước trọng tâm: xác định ràng buộc, khai thác tối đa nó, cho mọi thứ khác phục tùng nó, nâng cấp nó (thêm công suất) và khi đã phá được ràng buộc thì quay lại bước 1. Một giờ mất ở điểm nghẽn là một giờ mất của cả hệ thống; một giờ tiết kiệm ở chỗ không nghẽn chỉ là ảo ảnh.</p>
<h3>Chiến lược công suất</h3>
<p>Doanh nghiệp có thể <strong>đi trước</strong> nhu cầu (tăng công suất trước — giữ được doanh số, rủi ro công suất nhàn rỗi), <strong>đi sau</strong> nhu cầu (chỉ tăng khi nhu cầu đã rõ — mức sử dụng cao, rủi ro mất doanh số) hoặc <strong>bám sát</strong> nhu cầu bằng những bước tăng nhỏ và thường xuyên hơn. Các cân nhắc khác gồm lợi thế và bất lợi kinh tế theo quy mô, tính linh hoạt và <strong>công suất dự phòng</strong> giữ cao hơn nhu cầu dự kiến.</p>
<h3>Phân tích hoà vốn</h3>
<pre><code>Điểm hoà vốn theo sản lượng   BEPx = F / (P − V)
Điểm hoà vốn theo doanh thu   BEP$ = F / (1 − V/P)
Lợi nhuận                     = (P − V) x Q − F

Định phí F = 60.000 $; giá P = 40 $; biến phí V = 25 $/sản phẩm (số liệu minh hoạ)
BEPx = 60.000 / 15 = 4.000 sản phẩm    BEP$ = 60.000 / (1 − 25/40) = 160.000 $
Lợi nhuận tại 5.000 sản phẩm = 15 x 5.000 − 60.000 = 15.000 $
Sản lượng cần cho lợi nhuận 30.000 $ = (60.000 + 30.000) / 15 = 6.000 sản phẩm</code></pre>
<p>Phân tích hoà vốn giả định giá và chi phí tuyến tính, định phí và biến phí tách được. Đây là logic của đồ thị điểm giao: quy trình có định phí cao và biến phí thấp sẽ thắng ở sản lượng lớn.</p>
<h3>Cây quyết định trong điều kiện không chắc chắn</h3>
<p>Cây quyết định thể hiện các quyết định (hình vuông), các biến cố ngẫu nhiên (hình tròn) và kết quả, rồi chọn phương án có <strong>giá trị tiền tệ kỳ vọng (EMV)</strong> cao nhất.</p>
<pre><code>Một doanh nghiệp (giả định): xây nhà máy lớn, nhà máy nhỏ hay không làm gì
P(thị trường thuận lợi) = 0,45, P(thị trường bất lợi) = 0,55
                 Thuận lợi   Bất lợi      EMV
Nhà máy lớn      +240.000    −150.000     0,45 x 240.000 − 0,55 x 150.000 = 25.500
Nhà máy nhỏ      +110.000     −30.000     0,45 x 110.000 − 0,55 x 30.000  = 33.000
Không làm gì            0           0                                        0
Lựa chọn tốt nhất: nhà máy nhỏ (EMV 33.000 $)

Giá trị kỳ vọng KHI CÓ thông tin hoàn hảo = 0,45 x 240.000 + 0,55 x 0 = 108.000
EVPI = 108.000 − 33.000 = 75.000 $   (mức tối đa đáng trả cho một nghiên cứu thị trường hoàn hảo)</code></pre>
<p>Nhà máy lớn chỉ trở thành lựa chọn tốt nhất nếu xác suất thị trường thuận lợi vượt 0,48 — một phép kiểm tra độ nhạy nhanh cho nhà quản trị biết ước lượng nào cần nghiên cứu thêm.</p>
<div class="callout"><span class="badge">Trực giác</span> Quyết định công suất diễn ra theo từng bước lớn và kéo dài nhiều năm. Hoà vốn và EMV không xoá bỏ rủi ro; chúng cho thấy có bao nhiêu tiền đang bị đặt cược và giả định nào quan trọng nhất.</div>`,
  ]]);

const c5 = doc('opm301-2-3-location-layout', '2.3 — Location strategy & facility layout|||2.3 — Chiến lược địa điểm & bố trí mặt bằng',
  'Các yếu tố chọn địa điểm, phương pháp cho điểm có trọng số, phương pháp trọng tâm, bảy loại bố trí mặt bằng và cân bằng dây chuyền (thời gian chu kỳ, số trạm tối thiểu, hiệu suất), có ví dụ số.',
  [[
    `<span class="eyebrow">OPM301 · Part 2 · Lesson 2.3</span>
<h2>Location strategy &amp; facility layout</h2>
<p class="lead">Location sets a large part of a firm's long-run cost and revenue and is hard to reverse; layout determines how efficiently people, materials and information move inside the facility.</p>
<h3>Location factors</h3>
<ul>
<li><strong>Costs</strong> — tangible (labour, land, utilities, transport, taxes) and intangible (quality of education, attitudes toward the industry, quality of life).</li>
<li><strong>Labour productivity</strong> — low wages are no bargain if output per hour is also low: compare labour cost per unit, not wage per hour.</li>
<li><strong>Proximity</strong> to markets, suppliers and competitors — clusters of related firms share skilled labour, suppliers and know-how.</li>
<li><strong>Political risk, government incentives, exchange rates and regulation.</strong></li>
</ul>
<p>Manufacturers usually choose locations to minimize cost; service firms usually choose them to maximize revenue, because being close to customers drives sales.</p>
<h3>Factor-rating method</h3>
<pre><code>Two candidate sites for a fictional plant (scores out of 100)
Factor                          Weight  Site A  Site B   A weighted  B weighted
Labour cost &amp; availability       0.30     80      70        24.0        21.0
Proximity to market              0.25     70      90        17.5        22.5
Infrastructure                   0.20     90      80        18.0        16.0
Proximity to suppliers           0.15     60      80         9.0        12.0
Quality of life                  0.10     70      60         7.0         6.0
Total                            1.00                        75.5        77.5</code></pre>
<p>Site B scores slightly higher. Because weights and scores are subjective, run a <strong>sensitivity check</strong>: if a small change in one weight flips the ranking, study that factor further before deciding.</p>
<h3>Centre-of-gravity method</h3>
<pre><code>Locate a distribution centre serving four stores (map grid, weekly loads)
Store    x     y     Load
S1      30   120    2,000
S2      90   110    1,000
S3     130   130    1,000
S4      60    40    2,000
Cx = Σ(x x load) / Σload = 400,000 / 6,000 = 66.7
Cy = Σ(y x load) / Σload = 560,000 / 6,000 = 93.3</code></pre>
<p>The point (66.7; 93.3) is a starting point: it minimizes the load-weighted sum of <em>squared</em> distances and only approximates the point that minimizes total distance x load; then check roads, land availability and costs nearby. Other tools include <strong>locational cost–volume analysis</strong> (a crossover chart for sites) and the <strong>transportation model</strong> of linear programming.</p>
<h3>Types of layout</h3>
<table>
<tr><th>Layout</th><th>Main objective</th></tr>
<tr><td>Office</td><td>Position workers and equipment to support the flow of information and collaboration</td></tr>
<tr><td>Retail</td><td>Allocate shelf space and route customers to maximize profit per square metre</td></tr>
<tr><td>Warehouse</td><td>Balance storage space against material-handling cost</td></tr>
<tr><td>Fixed-position</td><td>Bring resources to a large project that stays in place (ships, buildings)</td></tr>
<tr><td>Process-oriented</td><td>Group similar equipment by function for low-volume, high-variety work; minimize Σ(loads x distance)</td></tr>
<tr><td>Work cell</td><td>Group the people and machines needed for one product family in a small area</td></tr>
<tr><td>Product-oriented</td><td>Arrange a line for high-volume, standardized products; balance the work between stations</td></tr>
</table>
<h3>Assembly-line balancing</h3>
<pre><code>Cycle time           = production time available per day / units required per day
Minimum workstations = Σ task times / cycle time   (round up)
Efficiency           = Σ task times / (actual workstations x cycle time)

480 min per day, demand 96 units per day, total task time 18 min (illustrative)
Cycle time = 480 / 96 = 5 min        Minimum stations = 18 / 5 = 3.6 → 4
With 4 stations: efficiency = 18 / (4 x 5) = 90%     With 5 stations: 72%</code></pre>
<p>Whether four stations are enough depends on <strong>precedence</strong> (which tasks must come first) and on no single task being longer than the cycle time. Heuristics such as "longest task time first" or "most following tasks first" assign tasks to stations one at a time.</p>
<div class="callout"><span class="badge">Remember</span> Location is a strategic, long-term decision; layout is where daily efficiency is won or lost. A poor layout creates waste every single day.</div>`,
    `<span class="eyebrow">OPM301 · Phần 2 · Bài 2.3</span>
<h2>Chiến lược địa điểm &amp; bố trí mặt bằng</h2>
<p class="lead">Địa điểm quyết định phần lớn chi phí và doanh thu dài hạn của doanh nghiệp và khó đảo ngược; bố trí mặt bằng quyết định con người, vật tư và thông tin di chuyển bên trong cơ sở hiệu quả tới đâu.</p>
<h3>Các yếu tố chọn địa điểm</h3>
<ul>
<li><strong>Chi phí</strong> — hữu hình (lao động, đất, điện nước, vận tải, thuế) và vô hình (chất lượng giáo dục, thái độ của địa phương với ngành, chất lượng cuộc sống).</li>
<li><strong>Năng suất lao động</strong> — lương thấp chẳng rẻ gì nếu sản lượng mỗi giờ cũng thấp: hãy so chi phí lao động trên mỗi sản phẩm, không so lương theo giờ.</li>
<li><strong>Sự gần gũi</strong> với thị trường, nhà cung cấp và đối thủ — cụm doanh nghiệp liên quan dùng chung lao động lành nghề, nhà cung cấp và bí quyết.</li>
<li><strong>Rủi ro chính trị, ưu đãi của nhà nước, tỷ giá và quy định pháp lý.</strong></li>
</ul>
<p>Doanh nghiệp sản xuất thường chọn địa điểm để tối thiểu hoá chi phí; doanh nghiệp dịch vụ thường chọn để tối đa hoá doanh thu, vì ở gần khách hàng là yếu tố thúc đẩy doanh số.</p>
<h3>Phương pháp cho điểm có trọng số</h3>
<pre><code>Hai địa điểm ứng viên cho một nhà máy (giả định), điểm trên thang 100
Yếu tố                          Trọng số  Điểm A  Điểm B   A có trọng số  B có trọng số
Chi phí &amp; nguồn lao động          0,30      80      70         24,0          21,0
Gần thị trường                    0,25      70      90         17,5          22,5
Hạ tầng                           0,20      90      80         18,0          16,0
Gần nhà cung cấp                  0,15      60      80          9,0          12,0
Chất lượng cuộc sống              0,10      70      60          7,0           6,0
Tổng                              1,00                         75,5          77,5</code></pre>
<p>Địa điểm B đạt điểm cao hơn một chút. Vì trọng số và điểm mang tính chủ quan, hãy <strong>kiểm tra độ nhạy</strong>: nếu thay đổi nhỏ ở một trọng số làm đảo thứ hạng thì cần nghiên cứu kỹ yếu tố đó trước khi quyết định.</p>
<h3>Phương pháp trọng tâm</h3>
<pre><code>Đặt một trung tâm phân phối phục vụ bốn cửa hàng (lưới bản đồ, khối lượng hằng tuần)
Cửa hàng   x     y     Khối lượng
S1        30   120     2.000
S2        90   110     1.000
S3       130   130     1.000
S4        60    40     2.000
Cx = Σ(x x khối lượng) / Σkhối lượng = 400.000 / 6.000 = 66,7
Cy = Σ(y x khối lượng) / Σkhối lượng = 560.000 / 6.000 = 93,3</code></pre>
<p>Điểm (66,7; 93,3) là điểm xuất phát: nó tối thiểu hoá tổng khoảng cách <em>bình phương</em> có trọng số theo khối lượng và chỉ xấp xỉ điểm tối thiểu hoá tổng quãng đường x khối lượng; sau đó kiểm tra đường sá, quỹ đất và chi phí quanh đó. Các công cụ khác gồm <strong>phân tích chi phí – sản lượng theo địa điểm</strong> (đồ thị điểm giao cho các địa điểm) và <strong>mô hình vận tải</strong> của quy hoạch tuyến tính.</p>
<h3>Các loại bố trí mặt bằng</h3>
<table>
<tr><th>Loại bố trí</th><th>Mục tiêu chính</th></tr>
<tr><td>Văn phòng</td><td>Sắp xếp người và thiết bị để hỗ trợ dòng thông tin và sự phối hợp</td></tr>
<tr><td>Bán lẻ</td><td>Phân bổ không gian kệ và dẫn lối khách hàng để tối đa hoá lợi nhuận trên mỗi mét vuông</td></tr>
<tr><td>Kho hàng</td><td>Cân bằng giữa không gian lưu trữ và chi phí bốc xếp, di chuyển vật tư</td></tr>
<tr><td>Vị trí cố định</td><td>Đưa nguồn lực tới một dự án lớn nằm yên một chỗ (tàu thuỷ, công trình xây dựng)</td></tr>
<tr><td>Theo quá trình</td><td>Nhóm máy móc tương tự theo chức năng cho công việc sản lượng thấp, đa dạng cao; tối thiểu hoá Σ(khối lượng x khoảng cách)</td></tr>
<tr><td>Ô làm việc (cell)</td><td>Tập hợp người và máy cần cho một họ sản phẩm vào một khu vực nhỏ</td></tr>
<tr><td>Theo sản phẩm</td><td>Bố trí dây chuyền cho sản phẩm chuẩn hoá, sản lượng lớn; cân bằng khối lượng công việc giữa các trạm</td></tr>
</table>
<h3>Cân bằng dây chuyền lắp ráp</h3>
<pre><code>Thời gian chu kỳ    = thời gian sản xuất có trong ngày / số sản phẩm cần mỗi ngày
Số trạm tối thiểu   = Σ thời gian công việc / thời gian chu kỳ   (làm tròn lên)
Hiệu suất           = Σ thời gian công việc / (số trạm thực tế x thời gian chu kỳ)

480 phút mỗi ngày, nhu cầu 96 sản phẩm/ngày, tổng thời gian công việc 18 phút (minh hoạ)
Thời gian chu kỳ = 480 / 96 = 5 phút     Số trạm tối thiểu = 18 / 5 = 3,6 → 4
Với 4 trạm: hiệu suất = 18 / (4 x 5) = 90%     Với 5 trạm: 72%</code></pre>
<p>Bốn trạm có đủ hay không còn tuỳ vào <strong>quan hệ trước – sau</strong> (công việc nào phải làm trước) và vào việc không có công việc đơn lẻ nào dài hơn thời gian chu kỳ. Các quy tắc kinh nghiệm như "công việc dài nhất trước" hay "công việc có nhiều việc theo sau nhất trước" gán từng công việc vào các trạm.</p>
<div class="callout"><span class="badge">Ghi nhớ</span> Địa điểm là quyết định chiến lược, dài hạn; bố trí mặt bằng là nơi hiệu quả hằng ngày được giành hay mất. Mặt bằng bố trí kém tạo ra lãng phí mỗi ngày.</div>`,
  ]]);

const c5q = quiz('opm301-quiz-2', 'Quiz 2 — Design, capacity, location & layout|||Quiz 2 — Thiết kế, công suất, địa điểm & mặt bằng', [
  { id: 'q1', question: 'Fixed cost is $30,000, price is $20 and variable cost is $12 per unit. The break-even point is…|||Định phí 30.000 $, giá bán 20 $ và biến phí 12 $/sản phẩm. Điểm hoà vốn là…', options: ['1,500 units|||1.500 sản phẩm', '2,500 units|||2.500 sản phẩm', '3,750 units|||3.750 sản phẩm', '75,000 units|||75.000 sản phẩm'], correctIndex: 2, explanation: 'BEP = F / (P − V) = 30,000 / 8 = 3,750 units. The figure 75,000 is the break-even point in dollars (3,750 x 20), not in units.|||BEP = F / (P − V) = 30.000 / 8 = 3.750 sản phẩm. Con số 75.000 là điểm hoà vốn tính bằng tiền (3.750 x 20), không phải bằng sản phẩm.' },
  { id: 'q2', question: 'Design capacity is 500 units, effective capacity 400 and actual output 360. Efficiency is…|||Công suất thiết kế 500 sản phẩm, công suất hiệu quả 400, sản lượng thực tế 360. Hiệu suất là…', options: ['72%|||72%', '90%|||90%', '80%|||80%', '111%|||111%'], correctIndex: 1, explanation: 'Efficiency = actual / effective = 360 / 400 = 90%. 72% is utilization (360 / 500).|||Hiệu suất = thực tế / hiệu quả = 360 / 400 = 90%. 72% là mức sử dụng (360 / 500).' },
  { id: 'q3', question: 'Which layout suits a high-volume, standardized product?|||Kiểu bố trí nào phù hợp với sản phẩm chuẩn hoá, sản lượng lớn?', options: ['Process-oriented layout|||Bố trí theo quá trình', 'Fixed-position layout|||Bố trí vị trí cố định', 'Retail layout|||Bố trí bán lẻ', 'Product-oriented (assembly-line) layout|||Bố trí theo sản phẩm (dây chuyền)'], correctIndex: 3, explanation: 'A product-oriented layout arranges a balanced line dedicated to the product; process layouts suit low volume and high variety.|||Bố trí theo sản phẩm dựng một dây chuyền cân bằng dành riêng cho sản phẩm; bố trí theo quá trình hợp với sản lượng thấp, đa dạng cao.' },
]);

const c6 = doc('opm301-3-1-tqm-six-sigma', '3.1 — Quality management: TQM, Six Sigma & the cost of quality|||3.1 — Quản trị chất lượng: TQM, Six Sigma & chi phí chất lượng',
  'Các cách định nghĩa chất lượng, những người đặt nền móng (Deming, Juran, Crosby, Ishikawa, Taguchi), bộ ISO 9000, bốn loại chi phí chất lượng, các khái niệm của TQM và bảy công cụ, Six Sigma với DMAIC và cách tính DPMO, có ví dụ số.',
  [[
    `<span class="eyebrow">OPM301 · Part 3 · Lesson 3.1</span>
<h2>Quality management: TQM, Six Sigma &amp; the cost of quality</h2>
<p class="lead">Quality is the ability of a product or service to meet customer needs. It affects reputation, product liability and cost — and poor quality is expensive long before a customer complains.</p>
<h3>Defining quality</h3>
<ul>
<li><strong>User-based</strong>: quality lies in the eyes of the beholder — what the customer wants.</li>
<li><strong>Manufacturing-based</strong>: conformance to standards, "making it right the first time".</li>
<li><strong>Product-based</strong>: quality as a precise, measurable variable of the product.</li>
</ul>
<p>Pioneers shaped the field: <strong>W. Edwards Deming</strong> (his 14 points; management causes most quality problems), <strong>Joseph M. Juran</strong> (quality as "fitness for use"), <strong>Philip B. Crosby</strong> ("quality is free"; zero defects), <strong>Kaoru Ishikawa</strong> (the cause-and-effect diagram, quality circles) and <strong>Genichi Taguchi</strong> (robust design and the quality loss function: any deviation from the target imposes a cost). The <strong>ISO 9000</strong> family sets international standards for quality management systems; ISO 9001 is the standard organizations are certified against (check the edition currently in force).</p>
<h3>The four costs of quality</h3>
<table>
<tr><th>Category</th><th>Examples</th></tr>
<tr><td>Prevention costs</td><td>Training, quality planning, process design, supplier development</td></tr>
<tr><td>Appraisal costs</td><td>Inspection, testing, audits, test equipment</td></tr>
<tr><td>Internal failure costs</td><td>Scrap, rework, downtime — defects found before delivery</td></tr>
<tr><td>External failure costs</td><td>Returns, warranty claims, recalls, lost goodwill — defects found by customers</td></tr>
</table>
<pre><code>A fictional firm, annual cost of quality ($ thousands, illustrative)
Prevention 20 · Appraisal 30 · Internal failure 60 · External failure 90
Total = 200, of which failure costs = 150 (75%)</code></pre>
<p>When failure costs make up most of the total, as in this example, spending more on prevention usually cuts failure costs by more than the extra spending — Crosby's argument that "quality is free". The actual gain has to be measured, not assumed.</p>
<h3>Total quality management (TQM)</h3>
<p>TQM means managing the entire organization so that it excels in every aspect of products and services that matters to the customer. Its main concepts:</p>
<ul>
<li><strong>Continuous improvement</strong> (kaizen) using the <strong>PDCA cycle</strong> — Plan, Do, Check, Act (the Shewhart or Deming cycle).</li>
<li><strong>Six Sigma</strong> — see below.</li>
<li><strong>Employee empowerment</strong> — involving the people closest to the work, for example through quality circles.</li>
<li><strong>Benchmarking</strong> — comparing against best-in-class organizations and adapting their practices.</li>
<li><strong>Just-in-time</strong> — small lots expose problems quickly (Part 5).</li>
<li><strong>Taguchi concepts</strong> — robust design and target-oriented quality.</li>
<li><strong>Knowledge of the TQM tools</strong>: check sheets, scatter diagrams, cause-and-effect (fishbone) diagrams, Pareto charts (the vital few causes behind most problems), flowcharts, histograms and statistical process control charts.</li>
</ul>
<h3>Six Sigma</h3>
<p>Statistically, Six Sigma describes a process that produces no more than <strong>3.4 defects per million opportunities (DPMO)</strong>. That figure assumes the process mean may drift by 1.5σ (equivalent to Cpk ≈ 1.5); a perfectly centred six-sigma process (Cp = 2.0) would give only about 0.002 DPMO. Six Sigma began at Motorola in the mid-1980s and was popularised by General Electric; as a programme it follows <strong>DMAIC</strong> — Define, Measure, Analyse, Improve, Control — led by trained Green Belts, Black Belts and Master Black Belts.</p>
<pre><code>DPMO = defects / (units x opportunities per unit) x 1,000,000

2,000 invoices, 5 fields per invoice that could be wrong, 34 errors found (illustrative)
DPMO = 34 / (2,000 x 5) x 1,000,000 = 3,400
≈ 4.2 sigma (with the conventional 1.5-sigma shift) — 1,000 times the Six Sigma rate</code></pre>
<div class="callout"><span class="badge">Key lesson</span> Inspection finds defects; it does not prevent them. Quality is built into the design and the process, not inspected into the product.</div>`,
    `<span class="eyebrow">OPM301 · Phần 3 · Bài 3.1</span>
<h2>Quản trị chất lượng: TQM, Six Sigma &amp; chi phí chất lượng</h2>
<p class="lead">Chất lượng là khả năng của sản phẩm hay dịch vụ đáp ứng nhu cầu khách hàng. Nó ảnh hưởng tới danh tiếng, trách nhiệm pháp lý về sản phẩm và chi phí — và chất lượng kém đã tốn kém từ rất lâu trước khi khách hàng phàn nàn.</p>
<h3>Định nghĩa chất lượng</h3>
<ul>
<li><strong>Theo người dùng</strong>: chất lượng nằm trong mắt người sử dụng — là điều khách hàng mong muốn.</li>
<li><strong>Theo sản xuất</strong>: phù hợp với tiêu chuẩn, "làm đúng ngay từ lần đầu".</li>
<li><strong>Theo sản phẩm</strong>: chất lượng là một biến số chính xác, đo được của sản phẩm.</li>
</ul>
<p>Những người đặt nền móng: <strong>W. Edwards Deming</strong> (14 nguyên tắc; phần lớn vấn đề chất lượng do quản lý gây ra), <strong>Joseph M. Juran</strong> (chất lượng là "sự phù hợp để sử dụng"), <strong>Philip B. Crosby</strong> ("chất lượng là miễn phí"; không sai lỗi), <strong>Kaoru Ishikawa</strong> (biểu đồ nhân quả, nhóm chất lượng) và <strong>Genichi Taguchi</strong> (thiết kế vững và hàm tổn thất chất lượng: mọi sai lệch khỏi giá trị mục tiêu đều gây tổn thất). Bộ tiêu chuẩn <strong>ISO 9000</strong> đặt ra chuẩn mực quốc tế cho hệ thống quản lý chất lượng; ISO 9001 là tiêu chuẩn mà tổ chức được chứng nhận theo (kiểm tra phiên bản đang có hiệu lực).</p>
<h3>Bốn loại chi phí chất lượng</h3>
<table>
<tr><th>Loại</th><th>Ví dụ</th></tr>
<tr><td>Chi phí phòng ngừa</td><td>Đào tạo, hoạch định chất lượng, thiết kế quy trình, phát triển nhà cung cấp</td></tr>
<tr><td>Chi phí đánh giá (kiểm tra)</td><td>Kiểm tra, thử nghiệm, đánh giá nội bộ, thiết bị thử nghiệm</td></tr>
<tr><td>Chi phí sai hỏng bên trong</td><td>Phế phẩm, làm lại, máy dừng — lỗi phát hiện trước khi giao hàng</td></tr>
<tr><td>Chi phí sai hỏng bên ngoài</td><td>Hàng trả lại, yêu cầu bảo hành, thu hồi sản phẩm, mất uy tín — lỗi do khách hàng phát hiện</td></tr>
</table>
<pre><code>Một doanh nghiệp (giả định), chi phí chất lượng năm (nghìn $, số liệu minh hoạ)
Phòng ngừa 20 · Đánh giá 30 · Sai hỏng bên trong 60 · Sai hỏng bên ngoài 90
Tổng = 200, trong đó chi phí sai hỏng = 150 (75%)</code></pre>
<p>Khi chi phí sai hỏng đang chiếm phần lớn, như ví dụ trên, chi thêm cho phòng ngừa thường làm chi phí sai hỏng giảm nhiều hơn khoản chi thêm — đó là lập luận "chất lượng là miễn phí" của Crosby. Mức lợi cụ thể phải được đo, không mặc nhiên.</p>
<h3>Quản trị chất lượng toàn diện (TQM)</h3>
<p>TQM là quản trị toàn bộ tổ chức sao cho tổ chức xuất sắc ở mọi khía cạnh của sản phẩm và dịch vụ mà khách hàng coi trọng. Các khái niệm chính:</p>
<ul>
<li><strong>Cải tiến liên tục</strong> (kaizen) theo <strong>chu trình PDCA</strong> — Lập kế hoạch, Thực hiện, Kiểm tra, Hành động (chu trình Shewhart hay Deming).</li>
<li><strong>Six Sigma</strong> — xem bên dưới.</li>
<li><strong>Trao quyền cho nhân viên</strong> — thu hút người gần công việc nhất tham gia, ví dụ qua nhóm chất lượng.</li>
<li><strong>Đối sánh chuẩn</strong> (benchmarking) — so sánh với tổ chức giỏi nhất và vận dụng cách làm của họ.</li>
<li><strong>Sản xuất đúng thời điểm</strong> — lô nhỏ làm lộ vấn đề nhanh (Phần 5).</li>
<li><strong>Khái niệm của Taguchi</strong> — thiết kế vững và chất lượng hướng tới giá trị mục tiêu.</li>
<li><strong>Nắm vững các công cụ TQM</strong>: phiếu kiểm tra, biểu đồ phân tán, biểu đồ nhân quả (xương cá), biểu đồ Pareto (số ít nguyên nhân quan trọng gây ra phần lớn vấn đề), lưu đồ, biểu đồ tần suất (histogram) và biểu đồ kiểm soát quá trình bằng thống kê.</li>
</ul>
<h3>Six Sigma</h3>
<p>Về thống kê, Six Sigma mô tả một quá trình tạo ra không quá <strong>3,4 lỗi trên một triệu cơ hội (DPMO)</strong>. Con số này giả định trung bình quá trình có thể dịch 1,5σ (tương ứng Cpk ≈ 1,5); nếu nằm đúng tâm, một quá trình sáu sigma (Cp = 2,0) chỉ cho khoảng 0,002 DPMO. Six Sigma khởi đầu tại Motorola (giữa thập niên 1980) và được General Electric phổ biến rộng; về chương trình, nó theo trình tự <strong>DMAIC</strong> — Xác định, Đo lường, Phân tích, Cải tiến, Kiểm soát — do các chuyên viên được đào tạo (Đai xanh, Đai đen, Đai đen bậc thầy) dẫn dắt.</p>
<pre><code>DPMO = số lỗi / (số đơn vị x số cơ hội lỗi mỗi đơn vị) x 1.000.000

2.000 hoá đơn, mỗi hoá đơn có 5 trường có thể sai, phát hiện 34 lỗi (số liệu minh hoạ)
DPMO = 34 / (2.000 x 5) x 1.000.000 = 3.400
≈ 4,2 sigma (theo quy ước dịch chuyển 1,5 sigma) — gấp 1.000 lần tỷ lệ Six Sigma</code></pre>
<div class="callout"><span class="badge">Bài học then chốt</span> Kiểm tra chỉ tìm ra lỗi, không ngăn được lỗi. Chất lượng được xây vào thiết kế và quy trình, chứ không phải được "kiểm tra vào" sản phẩm.</div>`,
  ]]);

const c7 = doc('opm301-3-2-spc', '3.2 — Statistical process control|||3.2 — Kiểm soát quá trình bằng thống kê',
  'Biến động tự nhiên và biến động có nguyên nhân, biểu đồ x̄ và R với bảng hệ số A2, D3, D4, biểu đồ p và c, cách đọc biểu đồ kiểm soát, giới hạn kiểm soát và giới hạn quy cách, năng lực quá trình Cp và Cpk, lấy mẫu chấp nhận, có ví dụ số.',
  [[
    `<span class="eyebrow">OPM301 · Part 3 · Lesson 3.2</span>
<h2>Statistical process control</h2>
<p class="lead">Statistical process control (SPC) monitors a process while it runs, using small samples, so that problems are caught before large numbers of defective units are made.</p>
<h3>Natural versus assignable variation</h3>
<p>Every process varies. <strong>Natural (common-cause) variation</strong> comes from many small, random sources and is expected; a process showing only natural variation is <strong>in control</strong>. <strong>Assignable (special-cause) variation</strong> comes from a specific cause — a worn tool, a new operator, a bad batch of material — and should be found and removed. A control chart plots a sample statistic against a centre line and upper and lower control limits (UCL, LCL), usually set at ±3 standard deviations, which cover 99.73% of natural variation.</p>
<h3>Charts for variables: x̄ and R</h3>
<p>For measured characteristics (weight, length, temperature), take small samples — often n = 4 or 5 — at regular intervals. The <strong>x̄-chart</strong> tracks the sample mean (central tendency); the <strong>R-chart</strong> tracks the sample range (dispersion). Use both: a process can hold its average while its spread gets worse.</p>
<pre><code>x̿ = average of the sample means       R̄ = average of the sample ranges
x̄-chart:  UCL = x̿ + A2 x R̄      LCL = x̿ − A2 x R̄
R-chart:  UCL = D4 x R̄          LCL = D3 x R̄

Factors from standard SPC tables
n = 4:   A2 = 0.729   D3 = 0   D4 = 2.282
n = 5:   A2 = 0.577   D3 = 0   D4 = 2.114</code></pre>
<p>If the process standard deviation σ is known, the x̄ limits can instead be set at x̿ ± z x σ / √n.</p>
<h3>Charts for attributes: p and c</h3>
<pre><code>p-chart (proportion defective):   UCL, LCL = p̄ ± z x √[p̄(1 − p̄) / n]
c-chart (number of defects per unit):   UCL, LCL = c̄ ± 3√c̄

20 samples of 100 forms each; 80 defective forms in total (illustrative)
p̄ = 80 / 2,000 = 0.04        σp = √(0.04 x 0.96 / 100) = 0.0196
UCL = 0.04 + 3 x 0.0196 = 0.0988
LCL = 0.04 − 3 x 0.0196 = −0.0188 → a proportion cannot be negative, so LCL = 0</code></pre>
<h3>Reading a control chart</h3>
<ul>
<li>A point outside the control limits signals an assignable cause — stop and investigate.</li>
<li>Even inside the limits, <strong>non-random patterns</strong> — a run of several points on one side of the centre line, a steady upward or downward trend, repeating cycles — also suggest an assignable cause.</li>
<li>Control limits come from the process; <strong>specification limits</strong> come from the customer or the designer. A process can be in control and still produce parts outside specification.</li>
</ul>
<h3>Process capability</h3>
<pre><code>Cp  = (USL − LSL) / 6σ
Cpk = min[(USL − μ) / 3σ , (μ − LSL) / 3σ]

Specification 200 ± 6 g (LSL 194, USL 206); process mean μ = 201 g, σ = 1.5 g
Cp  = 12 / 9 = 1.33
Cpk = min(5 / 4.5 , 7 / 4.5) = min(1.11 , 1.56) = 1.11</code></pre>
<p>Cp compares the width of the specification with the natural spread of the process: Cp ≥ 1.0 means the process could fit inside the specification, and many firms target 1.33 or more. Cpk also accounts for centring: here the mean sits closer to the upper limit, so Cpk is lower than Cp. A Six Sigma process has Cp = 2.0; with the conventional 1.5σ shift of the mean, its Cpk = 1.5.</p>
<h3>Acceptance sampling</h3>
<p>Acceptance sampling inspects a sample from a lot and accepts or rejects the whole lot. Its <strong>operating characteristic (OC) curve</strong> shows the probability of accepting lots of different quality. The <strong>acceptable quality level (AQL)</strong> with the producer's risk (α), and the <strong>lot tolerance percent defective (LTPD)</strong> — the defect level the buyer regards as a bad lot that should be rejected — with the consumer's risk (β), the probability of still accepting a lot at that level, define the plan. Sampling checks output after the fact; SPC improves the process itself.</p>
<div class="callout"><span class="badge">Watch out</span> Do not adjust an in-control process in response to every point. Reacting to natural variation — "tampering" — adds variation. React to signals, not to noise.</div>`,
    `<span class="eyebrow">OPM301 · Phần 3 · Bài 3.2</span>
<h2>Kiểm soát quá trình bằng thống kê</h2>
<p class="lead">Kiểm soát quá trình bằng thống kê (SPC) giám sát một quá trình ngay khi nó đang chạy bằng các mẫu nhỏ, để phát hiện vấn đề trước khi hàng loạt sản phẩm lỗi được làm ra.</p>
<h3>Biến động tự nhiên và biến động có nguyên nhân</h3>
<p>Mọi quá trình đều biến động. <strong>Biến động tự nhiên (do nguyên nhân chung)</strong> đến từ nhiều nguồn nhỏ, ngẫu nhiên và là điều bình thường; quá trình chỉ có biến động tự nhiên là quá trình <strong>trong tầm kiểm soát</strong>. <strong>Biến động có nguyên nhân xác định (nguyên nhân đặc biệt)</strong> đến từ một nguyên nhân cụ thể — dụng cụ mòn, công nhân mới, lô nguyên liệu kém — và cần được tìm ra, loại bỏ. Biểu đồ kiểm soát vẽ một đại lượng thống kê của mẫu so với đường trung tâm và giới hạn kiểm soát trên, dưới (UCL, LCL), thường đặt ở ±3 độ lệch chuẩn, bao phủ 99,73% biến động tự nhiên.</p>
<h3>Biểu đồ cho biến định lượng: x̄ và R</h3>
<p>Với đặc tính đo được (khối lượng, chiều dài, nhiệt độ), lấy mẫu nhỏ — thường n = 4 hoặc 5 — theo chu kỳ đều đặn. <strong>Biểu đồ x̄</strong> theo dõi trung bình mẫu (xu hướng trung tâm); <strong>biểu đồ R</strong> theo dõi khoảng biến thiên của mẫu (độ phân tán). Dùng cả hai: một quá trình có thể giữ nguyên giá trị trung bình trong khi độ phân tán xấu đi.</p>
<pre><code>x̿ = trung bình các trung bình mẫu     R̄ = trung bình các khoảng biến thiên mẫu
Biểu đồ x̄:  UCL = x̿ + A2 x R̄      LCL = x̿ − A2 x R̄
Biểu đồ R:  UCL = D4 x R̄          LCL = D3 x R̄

Hệ số tra từ bảng SPC chuẩn
n = 4:   A2 = 0,729   D3 = 0   D4 = 2,282
n = 5:   A2 = 0,577   D3 = 0   D4 = 2,114</code></pre>
<p>Nếu biết độ lệch chuẩn σ của quá trình, có thể đặt giới hạn của biểu đồ x̄ là x̿ ± z x σ / √n.</p>
<h3>Biểu đồ cho thuộc tính: p và c</h3>
<pre><code>Biểu đồ p (tỷ lệ phế phẩm):   UCL, LCL = p̄ ± z x √[p̄(1 − p̄) / n]
Biểu đồ c (số lỗi trên mỗi đơn vị):   UCL, LCL = c̄ ± 3√c̄

20 mẫu, mỗi mẫu 100 biểu mẫu; tổng cộng 80 biểu mẫu lỗi (số liệu minh hoạ)
p̄ = 80 / 2.000 = 0,04        σp = √(0,04 x 0,96 / 100) = 0,0196
UCL = 0,04 + 3 x 0,0196 = 0,0988
LCL = 0,04 − 3 x 0,0196 = −0,0188 → tỷ lệ không thể âm, nên LCL = 0</code></pre>
<h3>Đọc biểu đồ kiểm soát</h3>
<ul>
<li>Một điểm nằm ngoài giới hạn kiểm soát báo hiệu có nguyên nhân đặc biệt — dừng lại và điều tra.</li>
<li>Kể cả khi nằm trong giới hạn, <strong>các khuôn mẫu không ngẫu nhiên</strong> — một chuỗi nhiều điểm liên tiếp ở cùng một phía đường trung tâm, xu hướng tăng hoặc giảm đều, chu kỳ lặp lại — cũng gợi ý có nguyên nhân đặc biệt.</li>
<li>Giới hạn kiểm soát đến từ quá trình; <strong>giới hạn quy cách</strong> (dung sai) đến từ khách hàng hoặc người thiết kế. Một quá trình có thể trong tầm kiểm soát mà vẫn làm ra sản phẩm ngoài quy cách.</li>
</ul>
<h3>Năng lực quá trình</h3>
<pre><code>Cp  = (USL − LSL) / 6σ
Cpk = min[(USL − μ) / 3σ , (μ − LSL) / 3σ]

Quy cách 200 ± 6 g (LSL 194, USL 206); trung bình quá trình μ = 201 g, σ = 1,5 g
Cp  = 12 / 9 = 1,33
Cpk = min(5 / 4,5 ; 7 / 4,5) = min(1,11 ; 1,56) = 1,11</code></pre>
<p>Cp so sánh độ rộng của quy cách với độ phân tán tự nhiên của quá trình: Cp ≥ 1,0 nghĩa là quá trình có thể nằm gọn trong quy cách, và nhiều doanh nghiệp đặt mục tiêu từ 1,33 trở lên. Cpk tính thêm độ lệch tâm: ở đây trung bình nằm gần giới hạn trên hơn, nên Cpk thấp hơn Cp. Một quá trình Six Sigma có Cp = 2,0; với quy ước trung bình dịch 1,5σ thì Cpk = 1,5.</p>
<h3>Lấy mẫu chấp nhận</h3>
<p>Lấy mẫu chấp nhận kiểm tra một mẫu từ lô hàng rồi chấp nhận hoặc từ chối cả lô. <strong>Đường đặc tính vận hành (OC)</strong> cho biết xác suất chấp nhận các lô có chất lượng khác nhau. <strong>Mức chất lượng chấp nhận được (AQL)</strong> đi cùng rủi ro của nhà sản xuất (α), và <strong>tỷ lệ phế phẩm dung sai của lô (LTPD)</strong> — mức phế phẩm mà người mua coi là lô xấu, cần bị từ chối — đi cùng rủi ro của người mua (β), tức xác suất vẫn chấp nhận lô ở mức này, xác định phương án lấy mẫu. Lấy mẫu kiểm tra đầu ra sau khi đã làm xong; SPC cải thiện chính quá trình.</p>
<div class="callout"><span class="badge">Cẩn thận</span> Đừng chỉnh một quá trình đang trong tầm kiểm soát theo từng điểm dữ liệu. Phản ứng với biến động tự nhiên — "can thiệp quá mức" — chỉ làm biến động tăng thêm. Hãy phản ứng với tín hiệu, không phản ứng với nhiễu.</div>`,
  ]]);

const c7e = doc('opm301-3-3-exercise', 'Exercise 2 — x-bar and R control charts for a bottling line|||Bài tập 2 — biểu đồ kiểm soát x̄ và R cho dây chuyền đóng chai',
  'Bài tập: lập biểu đồ x̄ và R từ 10 mẫu n = 5 với A2 = 0,577, D3 = 0, D4 = 2,114, kết luận quá trình có trong tầm kiểm soát không, rồi đánh giá ba mẫu mới (một mẫu lệch trung bình, một mẫu lệch độ phân tán); kèm lời giải.',
  [[
    `<span class="eyebrow">OPM301 · Part 3 · Exercise 2</span>
<h2>Exercise 2 — is the bottling line in control?</h2>
<div class="callout"><span class="badge">Problem</span> A fictional bottling line fills 500 ml bottles. Every hour a sample of n = 5 bottles is measured. Ten samples gave these means (x̄) and ranges (R), in ml (illustrative numbers):<br>x̄: 499.8 · 500.4 · 500.1 · 499.6 · 500.6 · 500.3 · 499.9 · 500.5 · 500.0 · 500.8<br>R: 2.1 · 1.8 · 2.4 · 2.0 · 1.6 · 2.3 · 1.9 · 2.2 · 2.5 · 1.2<br>The five readings of sample 1 were 498.9, 500.2, 501.0, 499.4 and 499.5. Using A2 = 0.577, D3 = 0 and D4 = 2.114: (a) verify x̄ and R for sample 1; (b) compute the control limits of the x̄-chart and the R-chart; (c) was the process in control during these ten samples? (d) Three new samples arrive: #11 x̄ = 500.9, R = 2.0; #12 x̄ = 501.6, R = 1.9; #13 x̄ = 500.1, R = 4.8. What do you conclude?</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) Sample 1: x̄ = (498.9 + 500.2 + 501.0 + 499.4 + 499.5) / 5 = 2,499.0 / 5 = 499.8
              R = largest − smallest = 501.0 − 498.9 = 2.1            ✓

(b) x̿ = Σx̄ / 10 = 5,002.0 / 10 = 500.2 ml
    R̄ = ΣR / 10 = 20.0 / 10    = 2.0 ml
    x̄-chart: UCL = 500.2 + 0.577 x 2.0 = 500.2 + 1.154 = 501.354
             LCL = 500.2 − 1.154                     = 499.046
    R-chart: UCL = 2.114 x 2.0 = 4.228
             LCL = 0 x 2.0     = 0

(c) Sample means range from 499.6 to 500.8 → all within 499.046 – 501.354
    Sample ranges go up to 2.5              → all within 0 – 4.228
    → in control; these limits can be used to monitor production

(d) #11: x̄ 500.9 inside, R 2.0 inside   → no signal, keep running
    #12: x̄ 501.6 &gt; 501.354              → mean out of control (spread normal)
    #13: R 4.8 &gt; 4.228                   → spread out of control (mean looks normal)</code></pre>
<p><strong>Why:</strong> the two charts watch different things. Sample 12 says the average fill has shifted upward — look for a cause such as a drifting filler setting. Sample 13 has an almost perfect mean, yet its spread is more than twice R̄ — only the R-chart reveals it; look for causes such as a worn valve or unstable pressure. Note also that the centre line (500.2 ml) is not the 500 ml target, and that being in control says nothing yet about meeting the specification — that is a process capability question (Cp, Cpk).</p>`,
    `<span class="eyebrow">OPM301 · Phần 3 · Bài tập 2</span>
<h2>Bài tập 2 — dây chuyền đóng chai có trong tầm kiểm soát?</h2>
<div class="callout"><span class="badge">Đề</span> Một dây chuyền đóng chai (tình huống giả định) rót chai 500 ml. Mỗi giờ lấy một mẫu n = 5 chai để đo. Mười mẫu cho các giá trị trung bình (x̄) và khoảng biến thiên (R) sau, đơn vị ml (số liệu minh hoạ giả định):<br>x̄: 499,8 · 500,4 · 500,1 · 499,6 · 500,6 · 500,3 · 499,9 · 500,5 · 500,0 · 500,8<br>R: 2,1 · 1,8 · 2,4 · 2,0 · 1,6 · 2,3 · 1,9 · 2,2 · 2,5 · 1,2<br>Năm số đo của mẫu 1 là 498,9; 500,2; 501,0; 499,4 và 499,5. Dùng A2 = 0,577, D3 = 0 và D4 = 2,114: (a) kiểm tra lại x̄ và R của mẫu 1; (b) tính giới hạn kiểm soát của biểu đồ x̄ và biểu đồ R; (c) trong mười mẫu này quá trình có trong tầm kiểm soát không? (d) Có thêm ba mẫu mới: #11 x̄ = 500,9, R = 2,0; #12 x̄ = 501,6, R = 1,9; #13 x̄ = 500,1, R = 4,8. Bạn kết luận gì?</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) Mẫu 1: x̄ = (498,9 + 500,2 + 501,0 + 499,4 + 499,5) / 5 = 2.499,0 / 5 = 499,8
           R = lớn nhất − nhỏ nhất = 501,0 − 498,9 = 2,1               ✓

(b) x̿ = Σx̄ / 10 = 5.002,0 / 10 = 500,2 ml
    R̄ = ΣR / 10 = 20,0 / 10    = 2,0 ml
    Biểu đồ x̄: UCL = 500,2 + 0,577 x 2,0 = 500,2 + 1,154 = 501,354
               LCL = 500,2 − 1,154                     = 499,046
    Biểu đồ R: UCL = 2,114 x 2,0 = 4,228
               LCL = 0 x 2,0     = 0

(c) Trung bình mẫu từ 499,6 tới 500,8 → đều nằm trong 499,046 – 501,354
    Khoảng biến thiên cao nhất 2,5    → đều nằm trong 0 – 4,228
    → trong tầm kiểm soát; có thể dùng các giới hạn này để giám sát sản xuất

(d) #11: x̄ 500,9 trong giới hạn, R 2,0 trong giới hạn → không có tín hiệu, tiếp tục chạy
    #12: x̄ 501,6 &gt; 501,354   → trung bình ngoài tầm kiểm soát (độ phân tán bình thường)
    #13: R 4,8 &gt; 4,228        → độ phân tán ngoài tầm kiểm soát (trung bình trông bình thường)</code></pre>
<p><strong>Vì sao:</strong> hai biểu đồ theo dõi hai thứ khác nhau. Mẫu 12 cho thấy lượng rót trung bình đã dịch lên — hãy tìm nguyên nhân như cài đặt máy rót bị trôi. Mẫu 13 có trung bình gần như hoàn hảo nhưng độ phân tán lớn hơn gấp đôi R̄ — chỉ biểu đồ R phát hiện được; hãy tìm nguyên nhân như van bị mòn hay áp suất không ổn định. Lưu ý thêm: đường trung tâm (500,2 ml) không trùng giá trị mục tiêu 500 ml, và việc quá trình trong tầm kiểm soát chưa nói gì về việc đạt quy cách — đó là câu hỏi về năng lực quá trình (Cp, Cpk).</p>`,
  ]]);

const c7q = quiz('opm301-quiz-3', 'Quiz 3 — Quality management & SPC|||Quiz 3 — Quản trị chất lượng & SPC', [
  { id: 'q1', question: 'Warranty claims and product recalls belong to which cost of quality?|||Chi phí bảo hành và thu hồi sản phẩm thuộc loại chi phí chất lượng nào?', options: ['Prevention costs|||Chi phí phòng ngừa', 'Appraisal costs|||Chi phí đánh giá (kiểm tra)', 'Internal failure costs|||Chi phí sai hỏng bên trong', 'External failure costs|||Chi phí sai hỏng bên ngoài'], correctIndex: 3, explanation: 'They arise from defects that reached the customer, which makes them external failure costs — usually the most expensive category.|||Chúng phát sinh từ lỗi đã tới tay khách hàng, nên là chi phí sai hỏng bên ngoài — thường là loại tốn kém nhất.' },
  { id: 'q2', question: 'A p-chart has p̄ = 0.05, sample size n = 100 and z = 3. The upper control limit is about…|||Biểu đồ p có p̄ = 0,05, cỡ mẫu n = 100 và z = 3. Giới hạn kiểm soát trên xấp xỉ…', options: ['0.0718|||0,0718', '0.0936|||0,0936', '0.1154|||0,1154', '0.1500|||0,1500'], correctIndex: 2, explanation: 'σp = √(0.05 x 0.95 / 100) ≈ 0.0218, so UCL = 0.05 + 3 x 0.0218 ≈ 0.1154. 0.0718 and 0.0936 use 1 and 2 standard deviations.|||σp = √(0,05 x 0,95 / 100) ≈ 0,0218, nên UCL = 0,05 + 3 x 0,0218 ≈ 0,1154. 0,0718 và 0,0936 là kết quả khi dùng 1 và 2 độ lệch chuẩn.' },
  { id: 'q3', question: 'Specification limits are 90 and 110 and the process standard deviation is 4. What is Cp?|||Giới hạn quy cách là 90 và 110, độ lệch chuẩn của quá trình là 4. Cp bằng bao nhiêu?', options: ['0.83 — the process is not capable|||0,83 — quá trình không đủ năng lực', '1.20 — the process is capable|||1,20 — quá trình đủ năng lực', '2.50 — Six Sigma level|||2,50 — mức Six Sigma', '5.00 — highly capable|||5,00 — năng lực rất cao'], correctIndex: 0, explanation: 'Cp = (110 − 90) / (6 x 4) = 20 / 24 ≈ 0.83. Below 1.0, the natural spread is wider than the specification.|||Cp = (110 − 90) / (6 x 4) = 20 / 24 ≈ 0,83. Dưới 1,0 nghĩa là độ phân tán tự nhiên rộng hơn quy cách.' },
]);

const c8 = doc('opm301-4-1-aggregate-mrp', '4.1 — Aggregate planning & MRP|||4.1 — Hoạch định tổng hợp & MRP',
  'Các cấp hoạch định, phương án cung và cầu trong hoạch định tổng hợp, chiến lược ổn định, bám đuổi và hỗn hợp có so sánh chi phí bằng số, quản trị doanh thu trong dịch vụ; lịch trình sản xuất chính, MRP với danh mục vật tư, nhu cầu ròng, bù thời gian chờ, cỡ lô, MRP II và ERP.',
  [[
    `<span class="eyebrow">OPM301 · Part 4 · Lesson 4.1</span>
<h2>Aggregate planning &amp; material requirements planning</h2>
<p class="lead">Planning runs from long range (capacity, facilities) through intermediate range (aggregate planning, roughly 3 to 18 months) to short range (scheduling, days to weeks). Aggregate planning fixes the overall production rate, workforce and inventory; MRP turns that plan into exact orders for every part.</p>
<h3>Aggregate planning options</h3>
<table>
<tr><th>Capacity (supply) options</th><th>Demand options</th></tr>
<tr><td>Change inventory levels — build ahead in slack periods</td><td>Influence demand — pricing, promotion, advertising</td></tr>
<tr><td>Hire or lay off workers</td><td>Back-order during high-demand periods</td></tr>
<tr><td>Use overtime or accept idle time</td><td>Counterseasonal product and service mixing</td></tr>
<tr><td>Subcontract; use part-time workers</td><td>—</td></tr>
</table>
<p>A <strong>level strategy</strong> keeps production and workforce constant and lets inventory absorb the gap; a <strong>chase strategy</strong> matches production to demand each period by changing the workforce or working hours. A <strong>mixed strategy</strong> combines several options. Services, which cannot build inventory, rely more on flexible staffing, appointments and <strong>yield (revenue) management</strong> — varying prices to fill fixed capacity, as airlines and hotels do.</p>
<pre><code>A fictional plant, 6-month demand (units): 800, 700, 900, 1,200, 1,400, 1,000 = 6,000
Each worker makes 50 units a month; 20 workers at the start; no back orders
Holding cost $5 per unit per month (on ending inventory); hiring $300; layoff $500

LEVEL: produce 6,000 / 6 = 1,000 a month with 20 workers
  Ending inventory: 200, 500, 600, 400, 0, 0   → Σ = 1,700 unit-months
  Holding cost = 1,700 x 5 = $8,500

CHASE: workers needed = demand / 50 = 16, 14, 18, 24, 28, 20
  Month-to-month change (starting from 20): −4, −2, +4, +6, +4, −8   → 14 hired, 14 laid off
  Cost = 14 x 300 + 14 x 500 = 4,200 + 7,000 = $11,200

Regular wages are equal in both plans (120 worker-months) → the level plan is cheaper here</code></pre>
<p>Change the costs — for example, a very high holding cost for perishable goods — and the chase strategy may win: aggregate planning is always a trade-off. Larger problems are solved with spreadsheets or with linear programming (the transportation method).</p>
<h3>From the master production schedule to MRP</h3>
<p>The aggregate plan is broken down into a <strong>master production schedule (MPS)</strong>: which end items, how many and when. <strong>Material requirements planning (MRP)</strong> then calculates the dependent demand for components from five inputs: the MPS, the <strong>bill of materials (BOM)</strong>, inventory records, outstanding purchase orders (scheduled receipts) and lead times.</p>
<pre><code>Product A = 2 units of B + 1 unit of C      Lead times: A 1 week, B 2 weeks, C 1 week
MPS: 100 units of A due in week 6.   On hand: A 20, B 30, C 0.   No scheduled receipts.

Item   Gross requirement        On hand   Net requirement   Planned order release
A      100 (week 6)                20            80          week 5  (6 − 1)
B      2 x 80 = 160 (week 5)       30           130          week 3  (5 − 2)
C      1 x 80 =  80 (week 5)        0            80          week 4  (5 − 1)</code></pre>
<p>Net requirement = gross requirement − on hand − scheduled receipts. Each planned order release is offset by the item's lead time (<strong>time phasing</strong>), and a parent's planned order release becomes the gross requirement of its components — here, A's release of 80 in week 5 creates the requirements for B and C.</p>
<p><strong>Lot sizing.</strong> <em>Lot-for-lot</em> orders exactly the net requirement and is common in MRP and lean systems. Other rules include the economic order quantity and the periodic order quantity; the EOQ logic of balancing ordering and holding costs was covered in depth in SCM202 and is only referenced here. MRP has grown into <strong>closed-loop MRP</strong> and <strong>MRP II</strong> (adding capacity, labour and financial planning) and finally <strong>enterprise resource planning (ERP)</strong>, which integrates operations, finance, human resources and the supply chain in one system.</p>
<div class="callout"><span class="badge">Key lesson</span> Independent demand (finished goods) must be forecast; dependent demand (components) should be calculated. MRP replaces guessing about parts with arithmetic.</div>`,
    `<span class="eyebrow">OPM301 · Phần 4 · Bài 4.1</span>
<h2>Hoạch định tổng hợp &amp; hoạch định nhu cầu vật tư</h2>
<p class="lead">Hoạch định trải từ dài hạn (công suất, cơ sở vật chất) qua trung hạn (hoạch định tổng hợp, khoảng 3 tới 18 tháng) tới ngắn hạn (điều độ, theo ngày tới tuần). Hoạch định tổng hợp ấn định mức sản xuất chung, lực lượng lao động và tồn kho; MRP biến kế hoạch đó thành các đơn hàng chính xác cho từng chi tiết.</p>
<h3>Các phương án của hoạch định tổng hợp</h3>
<table>
<tr><th>Phương án về công suất (cung)</th><th>Phương án về nhu cầu</th></tr>
<tr><td>Thay đổi mức tồn kho — sản xuất trước vào lúc thấp điểm</td><td>Tác động tới nhu cầu — giá, khuyến mại, quảng cáo</td></tr>
<tr><td>Tuyển thêm hoặc cho nghỉ việc</td><td>Nhận đơn và hẹn giao sau (back order) lúc cao điểm</td></tr>
<tr><td>Làm thêm giờ hoặc chấp nhận thời gian nhàn rỗi</td><td>Kết hợp sản phẩm, dịch vụ có mùa vụ ngược nhau</td></tr>
<tr><td>Thuê gia công ngoài; dùng lao động bán thời gian</td><td>—</td></tr>
</table>
<p><strong>Chiến lược ổn định</strong> giữ sản lượng và lao động không đổi, để tồn kho hấp thụ chênh lệch; <strong>chiến lược bám đuổi</strong> điều chỉnh sản lượng khớp nhu cầu từng kỳ bằng cách thay đổi số lao động hoặc giờ làm. <strong>Chiến lược hỗn hợp</strong> kết hợp nhiều phương án. Dịch vụ không tích trữ được đầu ra nên dựa nhiều hơn vào bố trí nhân sự linh hoạt, hẹn lịch và <strong>quản trị doanh thu (yield management)</strong> — thay đổi giá để lấp đầy công suất cố định, như hãng hàng không và khách sạn vẫn làm.</p>
<pre><code>Một nhà máy (giả định), nhu cầu 6 tháng (sản phẩm): 800, 700, 900, 1.200, 1.400, 1.000 = 6.000
Mỗi công nhân làm 50 sản phẩm/tháng; đầu kỳ có 20 công nhân; không nhận đơn giao sau
Chi phí tồn trữ 5 $/sản phẩm/tháng (tính trên tồn cuối kỳ); tuyển 300 $; cho nghỉ 500 $

ỔN ĐỊNH: sản xuất 6.000 / 6 = 1.000 mỗi tháng với 20 công nhân
  Tồn cuối kỳ: 200, 500, 600, 400, 0, 0   → Σ = 1.700 sản phẩm-tháng
  Chi phí tồn trữ = 1.700 x 5 = 8.500 $

BÁM ĐUỔI: số công nhân cần = nhu cầu / 50 = 16, 14, 18, 24, 28, 20
  Thay đổi so với tháng trước (bắt đầu từ 20): −4, −2, +4, +6, +4, −8   → tuyển 14, cho nghỉ 14
  Chi phí = 14 x 300 + 14 x 500 = 4.200 + 7.000 = 11.200 $

Lương thường ở hai phương án bằng nhau (120 công nhân-tháng) → ở đây phương án ổn định rẻ hơn</code></pre>
<p>Thay đổi chi phí — ví dụ chi phí tồn trữ rất cao với hàng dễ hỏng — thì chiến lược bám đuổi có thể thắng: hoạch định tổng hợp luôn là một sự đánh đổi. Bài toán lớn hơn được giải bằng bảng tính hoặc quy hoạch tuyến tính (phương pháp bài toán vận tải).</p>
<h3>Từ lịch trình sản xuất chính tới MRP</h3>
<p>Kế hoạch tổng hợp được chia nhỏ thành <strong>lịch trình sản xuất chính (MPS)</strong>: sản phẩm cuối cùng nào, bao nhiêu và khi nào. <strong>Hoạch định nhu cầu vật tư (MRP)</strong> sau đó tính nhu cầu phụ thuộc của các chi tiết từ năm đầu vào: MPS, <strong>danh mục vật tư (BOM)</strong>, hồ sơ tồn kho, đơn mua hàng đang về (lượng tiếp nhận theo kế hoạch) và thời gian chờ.</p>
<pre><code>Sản phẩm A = 2 đơn vị B + 1 đơn vị C      Thời gian chờ: A 1 tuần, B 2 tuần, C 1 tuần
MPS: cần 100 đơn vị A vào tuần 6.   Tồn kho: A 20, B 30, C 0.   Không có hàng đang về.

Mặt hàng  Nhu cầu tổng              Tồn kho   Nhu cầu ròng   Phát lệnh đặt hàng
A         100 (tuần 6)                 20          80         tuần 5  (6 − 1)
B         2 x 80 = 160 (tuần 5)        30         130         tuần 3  (5 − 2)
C         1 x 80 =  80 (tuần 5)         0          80         tuần 4  (5 − 1)</code></pre>
<p>Nhu cầu ròng = nhu cầu tổng − tồn kho − lượng tiếp nhận theo kế hoạch. Mỗi lệnh đặt hàng được lùi sớm đúng bằng thời gian chờ của mặt hàng (<strong>phân kỳ theo thời gian</strong>), và lệnh đặt hàng của sản phẩm cha trở thành nhu cầu tổng của các chi tiết con — ở đây lệnh 80 đơn vị A ở tuần 5 tạo ra nhu cầu cho B và C.</p>
<p><strong>Xác định cỡ lô.</strong> <em>Lô theo lô</em> (lot-for-lot) đặt đúng bằng nhu cầu ròng, phổ biến trong MRP và hệ thống tinh gọn. Các quy tắc khác gồm lượng đặt hàng kinh tế và lượng đặt hàng theo chu kỳ; logic EOQ cân bằng chi phí đặt hàng và chi phí tồn trữ đã học kỹ ở SCM202 nên ở đây chỉ nhắc lại. MRP đã phát triển thành <strong>MRP vòng kín</strong> và <strong>MRP II</strong> (thêm hoạch định công suất, lao động và tài chính), rồi <strong>hoạch định nguồn lực doanh nghiệp (ERP)</strong>, tích hợp vận hành, tài chính, nhân sự và chuỗi cung ứng trong một hệ thống.</p>
<div class="callout"><span class="badge">Bài học then chốt</span> Nhu cầu độc lập (thành phẩm) phải được dự báo; nhu cầu phụ thuộc (chi tiết) nên được tính toán. MRP thay việc đoán số chi tiết bằng phép tính.</div>`,
  ]]);

const c9 = doc('opm301-4-2-scheduling', '4.2 — Short-term scheduling|||4.2 — Điều độ ngắn hạn',
  'Điều độ tiến và lùi, phân giao công việc, các quy tắc ưu tiên FCFS, SPT, EDD, LPT và tỷ số tới hạn, bốn chỉ số đánh giá lịch trình, quy tắc Johnson cho hai máy nối tiếp có ví dụ số, điều độ trong dịch vụ.',
  [[
    `<span class="eyebrow">OPM301 · Part 4 · Lesson 4.2</span>
<h2>Short-term scheduling</h2>
<p class="lead">Scheduling assigns jobs to resources and sets their order and timing — in days, hours and minutes. Good schedules deliver on time with fewer resources and less work-in-process.</p>
<h3>Forward scheduling, backward scheduling and loading</h3>
<ul>
<li><strong>Forward scheduling</strong> starts as soon as the requirements are known and works forward — jobs may finish early and build inventory.</li>
<li><strong>Backward scheduling</strong> starts from the due date and schedules the last operation first — used when due dates are firm, and common with MRP.</li>
<li><strong>Loading</strong> assigns jobs to work centres, using input–output control, Gantt load and schedule charts, and the assignment (Hungarian) method for one-to-one allocations.</li>
</ul>
<h3>Priority rules for sequencing</h3>
<table>
<tr><th>Rule</th><th>Process next the job with…</th><th>Typical strength or weakness</th></tr>
<tr><td>FCFS — first come, first served</td><td>the earliest arrival</td><td>Seen as fair by customers; usually weak on time measures</td></tr>
<tr><td>SPT — shortest processing time</td><td>the shortest processing time</td><td>Minimizes average completion time and average number of jobs in the system; long jobs may wait</td></tr>
<tr><td>EDD — earliest due date</td><td>the earliest due date</td><td>Minimizes the maximum lateness at a single work centre</td></tr>
<tr><td>LPT — longest processing time</td><td>the longest processing time</td><td>Starts big jobs early; usually poor on completion time</td></tr>
<tr><td>CR — critical ratio</td><td>the smallest CR = time remaining to due date / work days remaining</td><td>Dynamic; CR &lt; 1 means the job is already behind schedule</td></tr>
</table>
<pre><code>Measures of effectiveness
Average completion (flow) time   = Σ flow time / number of jobs
Utilization                      = Σ processing time / Σ flow time
Average number of jobs in system = Σ flow time / Σ processing time
Average job lateness             = Σ lateness / number of jobs,  lateness = max(0, finish − due)

Critical ratio: job X due in 10 days with 4 days of work left → CR = 10 / 4 = 2.5 (ahead)
                job Y due in 3 days with 5 days of work left  → CR = 3 / 5  = 0.6 (behind — do first)</code></pre>
<p>Two of these measures follow Heizer's conventions. <strong>Utilization</strong> here = Σ processing time / Σ flow time: it measures the share of the time jobs spend in the system that they are actually being worked on. It is <em>not</em> the share of time the machine is busy (the machine may be busy 100% of the time), and it differs from capacity utilization (actual output / design capacity) in Lesson 2.2. <strong>Lateness</strong> here is max(0, finish − due); many other texts call this <em>tardiness</em> and define lateness as finish − due, which can be negative.</p>
<h3>Johnson's rule: two work centres in sequence</h3>
<p>When every job passes through the same two work centres in the same order, <strong>Johnson's rule</strong> minimizes the total time to finish all jobs (the makespan — the moment the last job leaves centre 2, not the sum of the individual completion times): (1) list each job's time on both centres; (2) pick the shortest remaining time; (3) if it is on centre 1, schedule that job as early as possible; if it is on centre 2, as late as possible; (4) remove the job and repeat.</p>
<pre><code>Job   Centre 1   Centre 2       (hours, illustrative)
J1        5          3
J2        2          6
J3        8          5
J4        4          7
J5        6          1
Shortest 1 (J5, centre 2) → last        Next 2 (J2, centre 1) → first
Next 3 (J1, centre 2) → 4th             Next 4 (J4, centre 1) → 2nd        J3 → 3rd
Sequence: J2 → J4 → J3 → J1 → J5
Centre 1:  J2 0–2,  J4 2–6,  J3 6–14,  J1 14–19, J5 19–25
Centre 2:  J2 2–8,  J4 8–15, J3 15–20, J1 20–23, J5 25–26
Makespan = 26 hours   (processing in the order J1…J5 would take 28)</code></pre>
<h3>Scheduling services</h3>
<p>Services cannot store their output, so they schedule <strong>staff and customers</strong>: appointment systems, reservations, and cyclical staff schedules that follow demand varying by hour and day while respecting days off. Finite capacity scheduling software lets planners test a schedule on screen before releasing it.</p>
<div class="callout"><span class="badge">Remember</span> No rule is best on every measure. Choose the rule that matches the goal: SPT for fast average flow, EDD for meeting due dates, FCFS where perceived fairness matters most.</div>`,
    `<span class="eyebrow">OPM301 · Phần 4 · Bài 4.2</span>
<h2>Điều độ ngắn hạn</h2>
<p class="lead">Điều độ phân giao công việc cho nguồn lực và định thứ tự, thời điểm thực hiện — theo ngày, giờ và phút. Lịch trình tốt giao hàng đúng hẹn với ít nguồn lực hơn và ít sản phẩm dở dang hơn.</p>
<h3>Điều độ tiến, điều độ lùi và phân giao công việc</h3>
<ul>
<li><strong>Điều độ tiến</strong> bắt đầu ngay khi biết yêu cầu và tính dần về phía trước — công việc có thể xong sớm và tạo tồn kho.</li>
<li><strong>Điều độ lùi</strong> bắt đầu từ ngày hạn và xếp công đoạn cuối cùng trước — dùng khi ngày hạn cố định, phổ biến cùng MRP.</li>
<li><strong>Phân giao công việc</strong> (loading) gán công việc cho các trung tâm làm việc, dùng kiểm soát đầu vào – đầu ra, biểu đồ Gantt về tải và lịch trình, và phương pháp phân công (phương pháp Hungary) cho việc phân bổ một – một.</li>
</ul>
<h3>Quy tắc ưu tiên để sắp xếp thứ tự</h3>
<table>
<tr><th>Quy tắc</th><th>Làm tiếp công việc có…</th><th>Điểm mạnh hoặc yếu điển hình</th></tr>
<tr><td>FCFS — đến trước, làm trước</td><td>thời điểm đến sớm nhất</td><td>Khách hàng thấy công bằng; thường kém ở các chỉ số thời gian</td></tr>
<tr><td>SPT — thời gian xử lý ngắn nhất</td><td>thời gian xử lý ngắn nhất</td><td>Tối thiểu hoá thời gian hoàn thành trung bình và số công việc trung bình trong hệ thống; việc dài có thể phải chờ lâu</td></tr>
<tr><td>EDD — ngày hạn sớm nhất</td><td>ngày hạn sớm nhất</td><td>Tối thiểu hoá mức trễ lớn nhất tại một trung tâm làm việc</td></tr>
<tr><td>LPT — thời gian xử lý dài nhất</td><td>thời gian xử lý dài nhất</td><td>Khởi động sớm việc lớn; thường kém về thời gian hoàn thành</td></tr>
<tr><td>CR — tỷ số tới hạn</td><td>CR nhỏ nhất, CR = thời gian còn lại tới hạn / số ngày làm việc còn lại</td><td>Linh động; CR &lt; 1 nghĩa là công việc đã chậm tiến độ</td></tr>
</table>
<pre><code>Các chỉ số đánh giá
Thời gian hoàn thành trung bình     = Σ thời gian hoàn thành / số công việc
Mức sử dụng                         = Σ thời gian xử lý / Σ thời gian hoàn thành
Số công việc trung bình trong hệ thống = Σ thời gian hoàn thành / Σ thời gian xử lý
Thời gian trễ trung bình            = Σ thời gian trễ / số công việc,  trễ = max(0, lúc xong − ngày hạn)

Tỷ số tới hạn: việc X hạn sau 10 ngày, còn 4 ngày làm → CR = 10 / 4 = 2,5 (đang sớm)
               việc Y hạn sau 3 ngày, còn 5 ngày làm  → CR = 3 / 5  = 0,6 (đang chậm — làm trước)</code></pre>
<p>Hai chỉ số trên theo quy ước của Heizer. <strong>Mức sử dụng</strong> ở đây = Σ thời gian xử lý / Σ thời gian hoàn thành: nó đo tỷ lệ thời gian công việc thực sự được xử lý so với thời gian nằm trong hệ thống. Nó <em>không</em> phải tỷ lệ máy bận (máy có thể bận 100% thời gian), và khác với mức sử dụng công suất (sản lượng thực tế / công suất thiết kế) ở bài 2.2. <strong>Thời gian trễ</strong> ở đây là max(0, lúc xong − ngày hạn); nhiều tài liệu khác gọi đại lượng này là <em>tardiness</em> (độ trễ hạn), còn lateness = lúc xong − ngày hạn, có thể âm.</p>
<h3>Quy tắc Johnson: hai trung tâm làm việc nối tiếp</h3>
<p>Khi mọi công việc đều đi qua cùng hai trung tâm làm việc theo cùng một thứ tự, <strong>quy tắc Johnson</strong> tối thiểu hoá makespan — thời điểm công việc cuối cùng rời trung tâm 2, tức tổng thời gian để làm xong cả loạt việc (không phải Σ thời gian hoàn thành của từng việc): (1) liệt kê thời gian của từng việc trên cả hai trung tâm; (2) chọn thời gian nhỏ nhất còn lại; (3) nếu nó thuộc trung tâm 1, xếp việc đó sớm nhất có thể; nếu thuộc trung tâm 2, xếp muộn nhất có thể; (4) loại việc đó ra và lặp lại.</p>
<pre><code>Việc   Trung tâm 1   Trung tâm 2     (giờ, số liệu minh hoạ)
J1         5             3
J2         2             6
J3         8             5
J4         4             7
J5         6             1
Nhỏ nhất 1 (J5, trung tâm 2) → cuối cùng    Tiếp 2 (J2, trung tâm 1) → đầu tiên
Tiếp 3 (J1, trung tâm 2) → thứ 4            Tiếp 4 (J4, trung tâm 1) → thứ 2      J3 → thứ 3
Thứ tự: J2 → J4 → J3 → J1 → J5
Trung tâm 1:  J2 0–2,  J4 2–6,  J3 6–14,  J1 14–19, J5 19–25
Trung tâm 2:  J2 2–8,  J4 8–15, J3 15–20, J1 20–23, J5 25–26
Thời gian hoàn tất cả loạt (makespan) = 26 giờ   (làm theo thứ tự J1…J5 sẽ mất 28 giờ)</code></pre>
<h3>Điều độ trong dịch vụ</h3>
<p>Dịch vụ không lưu trữ được đầu ra nên phải điều độ <strong>nhân viên và khách hàng</strong>: hệ thống hẹn lịch, đặt chỗ trước, và lịch làm việc xoay vòng bám theo nhu cầu thay đổi theo giờ, theo ngày mà vẫn bảo đảm ngày nghỉ. Phần mềm điều độ theo công suất hữu hạn cho phép người lập kế hoạch thử lịch trình trên màn hình trước khi ban hành.</p>
<div class="callout"><span class="badge">Ghi nhớ</span> Không quy tắc nào tốt nhất ở mọi chỉ số. Hãy chọn quy tắc hợp với mục tiêu: SPT khi cần dòng chảy trung bình nhanh, EDD khi cần đúng hạn, FCFS khi cảm nhận công bằng quan trọng nhất.</div>`,
  ]]);

const c9e = doc('opm301-4-3-exercise', 'Exercise 3 — sequencing jobs with FCFS, SPT and EDD|||Bài tập 3 — sắp xếp công việc theo FCFS, SPT và EDD',
  'Bài tập: sắp xếp năm công việc của một xưởng in theo FCFS, SPT và EDD, tính thời gian hoàn thành trung bình, mức sử dụng, số công việc trung bình trong hệ thống, thời gian trễ trung bình và trễ lớn nhất, rồi chọn quy tắc; kèm lời giải.',
  [[
    `<span class="eyebrow">OPM301 · Part 4 · Exercise 3</span>
<h2>Exercise 3 — which rule for the print shop?</h2>
<div class="callout"><span class="badge">Problem</span> A fictional print shop has five jobs waiting at one machine, listed in order of arrival. Processing times and due dates are in days from now (illustrative numbers): A 4 days, due day 6 · B 7 days, due day 14 · C 2 days, due day 5 · D 5 days, due day 18 · E 3 days, due day 9. Sequence the jobs by FCFS, SPT and EDD. For each rule compute the average completion time, utilization, average number of jobs in the system, average lateness and maximum lateness, then recommend a rule.</div>
<h3>Worked solution</h3>
<pre><code class="language-text">Σ processing time = 4 + 7 + 2 + 5 + 3 = 21 days

FCFS: A B C D E                SPT: C E A D B                 EDD: C A E B D
Job Proc Finish Due Late       Job Proc Finish Due Late       Job Proc Finish Due Late
 A    4     4    6    0         C    2     2    5    0         C    2     2    5    0
 B    7    11   14    0         E    3     5    9    0         A    4     6    6    0
 C    2    13    5    8         A    4     9    6    3         E    3     9    9    0
 D    5    18   18    0         D    5    14   18    0         B    7    16   14    2
 E    3    21    9   12         B    7    21   14    7         D    5    21   18    3
Σ finish 67, Σ late 20         Σ finish 51, Σ late 10         Σ finish 54, Σ late 5

Rule   Avg completion   Utilization     Jobs in system   Avg lateness   Max lateness
FCFS   67/5 = 13.4      21/67 = 31.3%   67/21 = 3.19     20/5 = 4.0          12
SPT    51/5 = 10.2      21/51 = 41.2%   51/21 = 2.43     10/5 = 2.0           7
EDD    54/5 = 10.8      21/54 = 38.9%   54/21 = 2.57      5/5 = 1.0           3</code></pre>
<p><strong>Why:</strong> theory guarantees that SPT minimizes the average completion time (and with it the average number of jobs in the system) and that EDD minimizes the maximum lateness. Here SPT is indeed best on average completion time, utilization and number of jobs waiting, because short jobs leave the queue quickly, and EDD gives the smallest maximum lateness (3 days, against 7 with SPT and 12 with FCFS). EDD also gives the lowest average lateness in this problem, but that is not guaranteed for every data set. Utilization follows Heizer's convention (Σ processing time / Σ flow time): the machine itself is busy for all 21 days under every rule, so the 31–41% figures measure how much of each job's time in the shop is spent being worked on, not machine idleness. FCFS is worst on every measure here, although customers may see it as fair. Note that each rule still leaves two jobs late. If the shop competes on keeping delivery promises, choose EDD; if the aim is to cut work-in-process, SPT.</p>`,
    `<span class="eyebrow">OPM301 · Phần 4 · Bài tập 3</span>
<h2>Bài tập 3 — xưởng in nên dùng quy tắc nào?</h2>
<div class="callout"><span class="badge">Đề</span> Một xưởng in (tình huống giả định) có năm công việc đang chờ trên một máy, xếp theo thứ tự đến. Thời gian xử lý và ngày hạn tính bằng ngày kể từ hôm nay (số liệu minh hoạ giả định): A 4 ngày, hạn ngày 6 · B 7 ngày, hạn ngày 14 · C 2 ngày, hạn ngày 5 · D 5 ngày, hạn ngày 18 · E 3 ngày, hạn ngày 9. Sắp xếp các công việc theo FCFS, SPT và EDD. Với mỗi quy tắc, tính thời gian hoàn thành trung bình, mức sử dụng, số công việc trung bình trong hệ thống, thời gian trễ trung bình và thời gian trễ lớn nhất, rồi đề xuất một quy tắc.</div>
<h3>Lời giải</h3>
<pre><code class="language-text">Σ thời gian xử lý = 4 + 7 + 2 + 5 + 3 = 21 ngày

FCFS: A B C D E                SPT: C E A D B                 EDD: C A E B D
Việc XL  Xong  Hạn Trễ          Việc XL  Xong  Hạn Trễ          Việc XL  Xong  Hạn Trễ
 A    4     4    6    0         C    2     2    5    0         C    2     2    5    0
 B    7    11   14    0         E    3     5    9    0         A    4     6    6    0
 C    2    13    5    8         A    4     9    6    3         E    3     9    9    0
 D    5    18   18    0         D    5    14   18    0         B    7    16   14    2
 E    3    21    9   12         B    7    21   14    7         D    5    21   18    3
Σ xong 67, Σ trễ 20            Σ xong 51, Σ trễ 10            Σ xong 54, Σ trễ 5

Quy tắc  TG hoàn thành TB  Mức sử dụng     Số việc TB      Trễ TB        Trễ lớn nhất
FCFS     67/5 = 13,4       21/67 = 31,3%   67/21 = 3,19    20/5 = 4,0        12
SPT      51/5 = 10,2       21/51 = 41,2%   51/21 = 2,43    10/5 = 2,0         7
EDD      54/5 = 10,8       21/54 = 38,9%   54/21 = 2,57     5/5 = 1,0         3
(XL = thời gian xử lý; Xong = thời điểm hoàn thành)</code></pre>
<p><strong>Vì sao:</strong> lý thuyết bảo đảm SPT tối thiểu hoá thời gian hoàn thành trung bình (kéo theo số công việc trung bình trong hệ thống) và EDD tối thiểu hoá mức trễ lớn nhất. Ở đây SPT đúng là tốt nhất về thời gian hoàn thành trung bình, mức sử dụng và số công việc chờ, vì việc ngắn rời hàng đợi nhanh; còn EDD cho mức trễ lớn nhất nhỏ nhất (3 ngày, so với 7 ngày của SPT và 12 ngày của FCFS). Trong bài này EDD cũng cho thời gian trễ trung bình thấp nhất, nhưng điều đó không được bảo đảm cho mọi bộ dữ liệu. Mức sử dụng theo quy ước của Heizer (Σ thời gian xử lý / Σ thời gian hoàn thành): bản thân máy bận suốt 21 ngày với mọi quy tắc, nên các con số 31–41% đo phần thời gian mỗi việc nằm trong xưởng thực sự được xử lý, không phải thời gian máy nhàn rỗi. FCFS kém nhất ở mọi chỉ số trong bài này, dù khách hàng có thể thấy nó công bằng. Lưu ý quy tắc nào cũng vẫn để hai công việc trễ. Nếu xưởng cạnh tranh bằng việc giữ đúng lời hẹn giao hàng, chọn EDD; nếu mục tiêu là giảm sản phẩm dở dang, chọn SPT.</p>`,
  ]]);

const c9q = quiz('opm301-quiz-4', 'Quiz 4 — Aggregate planning, MRP & scheduling|||Quiz 4 — Hoạch định tổng hợp, MRP & điều độ', [
  { id: 'q1', question: 'A chase strategy in aggregate planning…|||Chiến lược bám đuổi trong hoạch định tổng hợp…', options: ['matches output to demand each period by changing the workforce or working hours|||điều chỉnh sản lượng khớp nhu cầu từng kỳ bằng cách thay đổi số lao động hoặc giờ làm', 'keeps output constant and lets inventory absorb changes in demand|||giữ sản lượng không đổi và để tồn kho hấp thụ biến động nhu cầu', 'relies only on subcontracting|||chỉ dựa vào thuê gia công ngoài', 'refuses all orders above average demand|||từ chối mọi đơn hàng vượt mức nhu cầu trung bình'], correctIndex: 0, explanation: 'Chase follows demand period by period; keeping output constant is the level strategy.|||Bám đuổi đi theo nhu cầu từng kỳ; giữ sản lượng không đổi là chiến lược ổn định.' },
  { id: 'q2', question: 'In MRP, an item has a gross requirement of 200, 50 units on hand and a scheduled receipt of 30. The net requirement is…|||Trong MRP, một mặt hàng có nhu cầu tổng 200, tồn kho 50 và lượng tiếp nhận theo kế hoạch 30. Nhu cầu ròng là…', options: ['280|||280', '170|||170', '150|||150', '120|||120'], correctIndex: 3, explanation: 'Net = gross − on hand − scheduled receipts = 200 − 50 − 30 = 120.|||Nhu cầu ròng = nhu cầu tổng − tồn kho − lượng tiếp nhận = 200 − 50 − 30 = 120.' },
  { id: 'q3', question: 'At a single work centre, which priority rule minimizes the average completion time of jobs?|||Tại một trung tâm làm việc, quy tắc ưu tiên nào tối thiểu hoá thời gian hoàn thành trung bình của các công việc?', options: ['FCFS|||FCFS', 'EDD|||EDD', 'SPT|||SPT', 'LPT|||LPT'], correctIndex: 2, explanation: 'Doing the shortest jobs first lets most jobs finish early, which minimizes average completion time; EDD instead minimizes the maximum lateness.|||Làm việc ngắn nhất trước giúp phần lớn công việc xong sớm, nên tối thiểu hoá thời gian hoàn thành trung bình; còn EDD tối thiểu hoá mức trễ lớn nhất.' },
]);

const c10 = doc('opm301-5-1-lean-jit', '5.1 — Lean operations & just-in-time|||5.1 — Vận hành tinh gọn & sản xuất đúng thời điểm',
  'Hệ thống sản xuất Toyota, bảy lãng phí, các thực hành tinh gọn cốt lõi (5S, hệ thống kéo, kanban, SMED, heijunka, jidoka, poka-yoke, TPM, kaizen), công thức số thẻ kanban, liên hệ ngắn với EOQ đã học ở SCM202, tinh gọn trong dịch vụ.',
  [[
    `<span class="eyebrow">OPM301 · Part 5 · Lesson 5.1</span>
<h2>Lean operations &amp; just-in-time</h2>
<p class="lead">Lean operations supply customers with exactly what they want, when they want it, without waste, through continuous improvement. Its roots are the Toyota Production System (TPS), developed under Taiichi Ohno; just-in-time (JIT) is its core production philosophy.</p>
<h3>The seven wastes</h3>
<table>
<tr><th>Waste</th><th>Examples (illustrative)</th></tr>
<tr><td>Overproduction</td><td>Making more, or earlier, than the next step or the customer needs — the waste that hides all others</td></tr>
<tr><td>Waiting (queues)</td><td>Operators waiting for material; jobs queuing in front of a machine</td></tr>
<tr><td>Transportation</td><td>Moving materials between distant departments more than necessary</td></tr>
<tr><td>Inventory</td><td>Raw materials, work-in-process and finished goods beyond immediate need</td></tr>
<tr><td>Motion</td><td>Walking, reaching and searching for tools, which add no value</td></tr>
<tr><td>Over-processing</td><td>Work the customer does not value — extra polishing, duplicate approvals</td></tr>
<tr><td>Defective product</td><td>Scrap, rework, returns and warranty repairs</td></tr>
</table>
<p>Many lean practitioners add an eighth waste: <strong>unused human talent</strong> — employees' ideas that are never asked for.</p>
<h3>Core lean practices</h3>
<ul>
<li><strong>5S</strong> — sort, set in order, shine, standardize, sustain: an orderly workplace makes problems visible.</li>
<li><strong>Pull system</strong> — produce only when the next step signals a need, instead of pushing work to a forecast; the signal is often a <strong>kanban</strong> card or an empty container.</li>
<li><strong>Setup reduction</strong> — SMED (single-minute exchange of dies — changeovers in under ten minutes) cuts changeover time so that small lots become economical.</li>
<li><strong>Level scheduling (heijunka)</strong> — a steady, mixed sequence of small lots instead of large batches.</li>
<li><strong>Jidoka and poka-yoke</strong> — machines and workers stop when a defect appears (an andon signal calls for help), and foolproof devices prevent errors in the first place.</li>
<li><strong>Total productive maintenance (TPM)</strong> — preventing breakdowns, because low inventory leaves no buffer.</li>
<li><strong>Kaizen and respect for people</strong> — continuous small improvements by empowered employees, with standard work as the baseline to improve from.</li>
<li><strong>Supplier partnerships</strong> — frequent, small, high-quality deliveries from a few trusted suppliers.</li>
</ul>
<h3>How many kanbans?</h3>
<pre><code>Number of kanbans = (demand during lead time + safety stock) / container size

Daily demand 400 units, replenishment lead time 2 days,
safety stock half a day (200 units), each container holds 100 units (illustrative)
Kanbans = (400 x 2 + 200) / 100 = 1,000 / 100 = 10 containers</code></pre>
<p>Removing a kanban deliberately lowers inventory and exposes the next problem to solve — the "lower the water to see the rocks" logic of JIT.</p>
<h3>Why small lots make sense: a link to EOQ</h3>
<p>SCM202 derived the economic order quantity Q* = √(2DS / H), where D is annual demand, S the setup (or ordering) cost and H the holding cost per unit per year. Lean attacks S directly. With D = 12,000 units, H = $6 and S = $100, Q* ≈ 632 units; cut the setup cost to $25 and Q* falls to about 316. <strong>Cutting the setup cost to a quarter halves the economic lot size</strong> — which is why setup reduction must come before smaller lots.</p>
<h3>Lean in services</h3>
<p>Hospitals, banks and restaurants apply the same ideas: standard work for repeated tasks, visual management boards, pull-based replenishment of supplies, and mapping the patient's or customer's journey to remove waiting.</p>
<div class="callout"><span class="badge">Watch out</span> Lean is not "zero inventory at any cost". Cutting inventory before reducing variability and setup times simply creates shortages. Fix the process first, then remove the buffer.</div>`,
    `<span class="eyebrow">OPM301 · Phần 5 · Bài 5.1</span>
<h2>Vận hành tinh gọn &amp; sản xuất đúng thời điểm</h2>
<p class="lead">Vận hành tinh gọn cung cấp cho khách hàng đúng thứ họ muốn, đúng lúc họ cần, không lãng phí, thông qua cải tiến liên tục. Gốc rễ của nó là Hệ thống sản xuất Toyota (TPS), được phát triển dưới sự dẫn dắt của Taiichi Ohno; sản xuất đúng thời điểm (JIT) là triết lý sản xuất cốt lõi của hệ thống này.</p>
<h3>Bảy lãng phí</h3>
<table>
<tr><th>Lãng phí</th><th>Ví dụ (minh hoạ)</th></tr>
<tr><td>Sản xuất thừa</td><td>Làm nhiều hơn, hoặc sớm hơn, mức mà công đoạn sau hay khách hàng cần — lãng phí che giấu mọi lãng phí khác</td></tr>
<tr><td>Chờ đợi (xếp hàng)</td><td>Công nhân chờ vật tư; công việc xếp hàng trước một máy</td></tr>
<tr><td>Vận chuyển</td><td>Di chuyển vật tư giữa các bộ phận xa nhau nhiều hơn mức cần thiết</td></tr>
<tr><td>Tồn kho</td><td>Nguyên vật liệu, bán thành phẩm và thành phẩm vượt nhu cầu trước mắt</td></tr>
<tr><td>Thao tác thừa</td><td>Đi lại, với tay, tìm dụng cụ — không tạo thêm giá trị</td></tr>
<tr><td>Gia công thừa</td><td>Làm những việc khách hàng không coi trọng — đánh bóng thêm, duyệt trùng lặp</td></tr>
<tr><td>Sản phẩm lỗi</td><td>Phế phẩm, làm lại, hàng trả về, sửa chữa bảo hành</td></tr>
</table>
<p>Nhiều người thực hành tinh gọn bổ sung lãng phí thứ tám: <strong>tài năng con người không được dùng tới</strong> — những ý tưởng của nhân viên không bao giờ được hỏi đến.</p>
<h3>Các thực hành tinh gọn cốt lõi</h3>
<ul>
<li><strong>5S</strong> — sàng lọc, sắp xếp, sạch sẽ, săn sóc (tiêu chuẩn hoá), sẵn sàng (duy trì): nơi làm việc ngăn nắp làm vấn đề lộ ra.</li>
<li><strong>Hệ thống kéo</strong> — chỉ sản xuất khi công đoạn sau phát tín hiệu cần, thay vì đẩy hàng theo dự báo; tín hiệu thường là một thẻ <strong>kanban</strong> hoặc một thùng rỗng.</li>
<li><strong>Giảm thời gian chuẩn bị</strong> — SMED (single-minute exchange of dies — thay khuôn trong dưới 10 phút) rút ngắn thời gian chuyển đổi để lô nhỏ trở nên kinh tế.</li>
<li><strong>Bình chuẩn hoá sản xuất (heijunka)</strong> — một chuỗi đều đặn, xen kẽ các lô nhỏ thay vì các mẻ lớn.</li>
<li><strong>Jidoka và poka-yoke</strong> — máy và người dừng lại khi xuất hiện lỗi (tín hiệu andon gọi hỗ trợ), và cơ cấu chống sai lỗi ngăn lỗi xảy ra ngay từ đầu.</li>
<li><strong>Bảo trì năng suất toàn diện (TPM)</strong> — ngăn máy hỏng, vì tồn kho thấp không còn vùng đệm.</li>
<li><strong>Kaizen và tôn trọng con người</strong> — cải tiến nhỏ, liên tục do nhân viên được trao quyền thực hiện, lấy công việc chuẩn làm mốc để cải tiến.</li>
<li><strong>Quan hệ đối tác với nhà cung cấp</strong> — giao hàng thường xuyên, lô nhỏ, chất lượng cao từ một số ít nhà cung cấp tin cậy.</li>
</ul>
<h3>Cần bao nhiêu thẻ kanban?</h3>
<pre><code>Số thẻ kanban = (nhu cầu trong thời gian chờ + tồn kho an toàn) / sức chứa mỗi thùng

Nhu cầu 400 sản phẩm/ngày, thời gian bổ sung 2 ngày,
tồn kho an toàn nửa ngày (200 sản phẩm), mỗi thùng chứa 100 sản phẩm (số liệu minh hoạ)
Số kanban = (400 x 2 + 200) / 100 = 1.000 / 100 = 10 thùng</code></pre>
<p>Chủ động rút bớt một thẻ kanban làm giảm tồn kho và làm lộ ra vấn đề kế tiếp cần giải quyết — logic "hạ mực nước để thấy đá ngầm" của JIT.</p>
<h3>Vì sao lô nhỏ hợp lý: liên hệ với EOQ</h3>
<p>SCM202 đã xây dựng công thức lượng đặt hàng kinh tế Q* = √(2DS / H), trong đó D là nhu cầu năm, S là chi phí chuẩn bị (hoặc đặt hàng) và H là chi phí tồn trữ mỗi đơn vị mỗi năm. Tinh gọn tấn công thẳng vào S. Với D = 12.000 sản phẩm, H = 6 $ và S = 100 $, Q* ≈ 632 sản phẩm; giảm chi phí chuẩn bị xuống 25 $ thì Q* còn khoảng 316. <strong>Giảm chi phí chuẩn bị còn một phần tư thì cỡ lô kinh tế giảm một nửa</strong> — vì thế phải giảm thời gian chuẩn bị trước rồi mới thu nhỏ lô.</p>
<h3>Tinh gọn trong dịch vụ</h3>
<p>Bệnh viện, ngân hàng và nhà hàng áp dụng cùng những ý tưởng đó: công việc chuẩn cho các nhiệm vụ lặp lại, bảng quản lý trực quan, bổ sung vật tư theo cơ chế kéo, và vẽ hành trình của bệnh nhân hay khách hàng để loại bỏ thời gian chờ.</p>
<div class="callout"><span class="badge">Cẩn thận</span> Tinh gọn không phải là "tồn kho bằng không bằng mọi giá". Cắt tồn kho trước khi giảm biến động và thời gian chuẩn bị chỉ tạo ra thiếu hàng. Hãy sửa quy trình trước, rồi mới bỏ vùng đệm.</div>`,
  ]]);

const c11 = doc('opm301-5-2-project-management', '5.2 — Project management: CPM & PERT|||5.2 — Quản trị dự án: CPM & PERT',
  'Ba giai đoạn quản trị dự án, WBS, biểu đồ Gantt, sơ đồ mạng AON, lượt tính xuôi và ngược, thời gian dự trữ và đường găng, PERT với ba ước lượng thời gian, phương sai và xác suất hoàn thành, rút ngắn dự án với chi phí thấp nhất, có ví dụ số.',
  [[
    `<span class="eyebrow">OPM301 · Part 5 · Lesson 5.2</span>
<h2>Project management: CPM &amp; PERT</h2>
<p class="lead">A project is a one-time series of related tasks directed toward a major output — a product launch, a factory move, an ERP implementation. Project management has three phases: planning, scheduling and controlling.</p>
<h3>Planning and scheduling tools</h3>
<ul>
<li><strong>Work breakdown structure (WBS)</strong> — divides the project into smaller and smaller components, down to individual activities.</li>
<li><strong>Gantt chart</strong> — a bar chart of activities against time; easy to read but weak at showing dependencies.</li>
<li><strong>Network diagram</strong> — shows activities and their precedence. In the <strong>activity-on-node (AON)</strong> convention used here, each node is an activity and arrows show which activities must finish first.</li>
<li><strong>CPM</strong> (critical path method) uses one time estimate per activity; <strong>PERT</strong> (program evaluation and review technique) uses three estimates to handle uncertainty.</li>
</ul>
<h3>Forward pass, backward pass and slack</h3>
<pre><code>Forward pass:   ES = largest EF of all immediate predecessors (0 at the start)
                EF = ES + activity time
Backward pass:  LF = smallest LS of all immediate successors (project end for the last ones)
                LS = LF − activity time
Slack = LS − ES = LF − EF
Critical path  = the longest path through the network = the activities with zero slack</code></pre>
<p>Any delay to a critical activity delays the whole project. A non-critical activity can slip by up to its slack without moving the finish date — but slack is often shared by several activities on the same path, so using it in one place removes it elsewhere. Exercise 4 works through a full network.</p>
<h3>PERT: three time estimates</h3>
<pre><code>a = optimistic time, m = most likely time, b = pessimistic time
Expected time  t = (a + 4m + b) / 6          Variance = [(b − a) / 6]²

Activity with a = 2, m = 5, b = 14 weeks:  t = (2 + 20 + 14) / 6 = 6 weeks
                                           variance = (12 / 6)² = 4

Project variance = Σ variances of the activities on the critical path
Critical path: expected length 30 weeks, variance 9 (σ = 3) — illustrative
P(finish within 33 weeks): z = (33 − 30) / 3 = 1.00 → about 84.1%
P(finish within 36 weeks): z = (36 − 30) / 3 = 2.00 → about 97.7%</code></pre>
<p>PERT assumes that activity times follow a beta distribution and that the project time is approximately normal when the critical path has enough activities. It ignores near-critical paths, which can become critical if they slip — a known limitation.</p>
<h3>Crashing: shortening the project at the lowest cost</h3>
<pre><code>Crash cost per period = (crash cost − normal cost) / (normal time − crash time)
Activity: normal 8 weeks at $4,000; crash 5 weeks at $7,000
→ (7,000 − 4,000) / (8 − 5) = $1,000 per week</code></pre>
<p>Crash only <strong>critical</strong> activities, the cheapest per period first, one period at a time; after each step re-check the critical path, because another path may become critical. Stop when the deadline is met or when crashing costs more than it saves (for example, a late penalty avoided or an early-completion bonus earned).</p>
<div class="callout"><span class="badge">Key lesson</span> Watch the critical path closely — but not only the critical path. Near-critical activities with very little slack deserve attention too.</div>`,
    `<span class="eyebrow">OPM301 · Phần 5 · Bài 5.2</span>
<h2>Quản trị dự án: CPM &amp; PERT</h2>
<p class="lead">Dự án là một chuỗi công việc liên quan, thực hiện một lần, hướng tới một kết quả lớn — ra mắt sản phẩm, chuyển nhà máy, triển khai ERP. Quản trị dự án gồm ba giai đoạn: lập kế hoạch, lập tiến độ và kiểm soát.</p>
<h3>Công cụ lập kế hoạch và lập tiến độ</h3>
<ul>
<li><strong>Cấu trúc phân chia công việc (WBS)</strong> — chia dự án thành các phần ngày càng nhỏ, tới từng hoạt động riêng lẻ.</li>
<li><strong>Biểu đồ Gantt</strong> — biểu đồ thanh thể hiện các hoạt động theo thời gian; dễ đọc nhưng yếu ở việc thể hiện quan hệ phụ thuộc.</li>
<li><strong>Sơ đồ mạng</strong> — thể hiện các hoạt động và quan hệ trước – sau. Theo quy ước <strong>hoạt động trên nút (AON)</strong> dùng ở đây, mỗi nút là một hoạt động và mũi tên cho biết hoạt động nào phải xong trước.</li>
<li><strong>CPM</strong> (phương pháp đường găng) dùng một ước lượng thời gian cho mỗi hoạt động; <strong>PERT</strong> (kỹ thuật đánh giá và xem xét chương trình) dùng ba ước lượng để xử lý sự không chắc chắn.</li>
</ul>
<h3>Lượt tính xuôi, lượt tính ngược và thời gian dự trữ</h3>
<pre><code>Tính xuôi:  ES = EF lớn nhất của các hoạt động đứng ngay trước (bằng 0 ở điểm bắt đầu)
            EF = ES + thời gian hoạt động
Tính ngược: LF = LS nhỏ nhất của các hoạt động đứng ngay sau (bằng thời điểm kết thúc dự án với hoạt động cuối)
            LS = LF − thời gian hoạt động
Thời gian dự trữ = LS − ES = LF − EF
Đường găng = đường dài nhất qua sơ đồ mạng = các hoạt động có thời gian dự trữ bằng 0
(ES/EF: bắt đầu/kết thúc sớm nhất; LS/LF: bắt đầu/kết thúc muộn nhất)</code></pre>
<p>Mọi sự chậm trễ ở hoạt động găng đều làm chậm cả dự án. Hoạt động không găng có thể trễ tối đa bằng thời gian dự trữ của nó mà không dời ngày kết thúc — nhưng thời gian dự trữ thường được nhiều hoạt động trên cùng một đường dùng chung, nên dùng nó ở chỗ này là mất ở chỗ khác. Bài tập 4 đi qua một sơ đồ mạng đầy đủ.</p>
<h3>PERT: ba ước lượng thời gian</h3>
<pre><code>a = thời gian lạc quan, m = thời gian thường gặp nhất, b = thời gian bi quan
Thời gian kỳ vọng  t = (a + 4m + b) / 6          Phương sai = [(b − a) / 6]²

Hoạt động có a = 2, m = 5, b = 14 tuần:  t = (2 + 20 + 14) / 6 = 6 tuần
                                         phương sai = (12 / 6)² = 4

Phương sai dự án = Σ phương sai các hoạt động trên đường găng
Đường găng: độ dài kỳ vọng 30 tuần, phương sai 9 (σ = 3) — số liệu minh hoạ
P(xong trong 33 tuần): z = (33 − 30) / 3 = 1,00 → khoảng 84,1%
P(xong trong 36 tuần): z = (36 − 30) / 3 = 2,00 → khoảng 97,7%</code></pre>
<p>PERT giả định thời gian hoạt động theo phân phối beta và thời gian dự án xấp xỉ phân phối chuẩn khi đường găng có đủ nhiều hoạt động. Nó bỏ qua các đường gần găng, vốn có thể trở thành găng nếu bị trễ — một hạn chế đã được biết rõ.</p>
<h3>Rút ngắn dự án với chi phí thấp nhất</h3>
<pre><code>Chi phí rút ngắn mỗi kỳ = (chi phí khi rút ngắn − chi phí bình thường) / (thời gian bình thường − thời gian rút ngắn)
Hoạt động: bình thường 8 tuần, 4.000 $; rút ngắn còn 5 tuần, 7.000 $
→ (7.000 − 4.000) / (8 − 5) = 1.000 $ mỗi tuần</code></pre>
<p>Chỉ rút ngắn hoạt động <strong>găng</strong>, hoạt động có chi phí mỗi kỳ rẻ nhất trước, mỗi lần một kỳ; sau mỗi bước phải kiểm tra lại đường găng, vì một đường khác có thể trở thành găng. Dừng lại khi đã đạt thời hạn hoặc khi chi phí rút ngắn lớn hơn lợi ích (ví dụ tiền phạt trễ hạn tránh được hay tiền thưởng hoàn thành sớm).</p>
<div class="callout"><span class="badge">Bài học then chốt</span> Theo dõi sát đường găng — nhưng không chỉ đường găng. Các hoạt động gần găng, có rất ít thời gian dự trữ, cũng cần được chú ý.</div>`,
  ]]);

const c11e = doc('opm301-5-3-exercise', 'Exercise 4 — CPM network: critical path and slack|||Bài tập 4 — sơ đồ mạng CPM: đường găng và thời gian dự trữ',
  'Bài tập: dự án mở cửa hàng tạm thời với bảy hoạt động; tính ES, EF, LS, LF bằng lượt tính xuôi và ngược, thời gian dự trữ, đường găng và thời gian dự án, rồi phân tích tác động khi một hoạt động bị trễ; kèm lời giải.',
  [[
    `<span class="eyebrow">OPM301 · Part 5 · Exercise 4</span>
<h2>Exercise 4 — opening a pop-up store</h2>
<div class="callout"><span class="badge">Problem</span> A fictional team is opening a pop-up store. Activities, times in weeks and immediate predecessors (illustrative):<br>A — sign the lease and design the store: 3, none · B — order fixtures: 4, none · C — hire staff: 1, after A · D — fit out the store: 5, after A · E — train staff on the fixtures: 3, after B and C · F — install stock and systems: 4, after D and E · G — run the launch campaign: 2, after E.<br>(a) Use the forward and backward passes to find ES, EF, LS and LF for every activity. (b) Compute slack, identify the critical path and state the project duration. (c) What happens if E is delayed by 2 weeks? If G is delayed by 3 weeks?</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a)(b)  Forward pass: ES = max EF of predecessors;  Backward pass: LF = min LS of successors
Act  Time  Pred.   ES   EF   LS   LF   Slack
 A     3    —       0    3    0    3     0   ← critical
 B     4    —       0    4    1    5     1
 C     1    A       3    4    4    5     1
 D     5    A       3    8    3    8     0   ← critical
 E     3    B, C    4    7    5    8     1       ES = max(EF B 4, EF C 4) = 4
 F     4    D, E    8   12    8   12     0   ← critical   ES = max(8, 7) = 8
 G     2    E       7    9   10   12     3
Project duration = 12 weeks        Critical path: A → D → F  (3 + 5 + 4 = 12)
Other paths: A–C–E–F = 11,  B–E–F = 11,  A–C–E–G = 9,  B–E–G = 9
E: LF = min(LS F 8, LS G 10) = 8;  A: LF = min(LS C 4, LS D 3) = 3

(c) E delayed 2 weeks: E has only 1 week of slack
    → paths A–C–E–F and B–E–F become 13 weeks → the project finishes in 13 weeks (1 week late)
    G delayed 3 weeks: G has exactly 3 weeks of slack
    → the project still finishes in 12 weeks, but paths A–C–E–G and B–E–G now also take 12 weeks
      (3 + 1 + 3 + 5 and 4 + 3 + 5), so G, E, B and C lose all their slack — every activity becomes critical</code></pre>
<p><strong>Why:</strong> the forward pass gives the earliest each activity can happen; the backward pass gives the latest it may happen without delaying the finish; their difference is slack. Only A, D and F have zero slack, so managers should watch them most closely. But the paths through E are only one week shorter than the critical path, so E is near-critical: a 2-week slip makes it critical and delays the project. Slack is also shared — if B slips by 1 week, E loses its slack too.</p>`,
    `<span class="eyebrow">OPM301 · Phần 5 · Bài tập 4</span>
<h2>Bài tập 4 — mở một cửa hàng tạm thời</h2>
<div class="callout"><span class="badge">Đề</span> Một nhóm (tình huống giả định) chuẩn bị mở một cửa hàng tạm thời (pop-up store). Các hoạt động, thời gian tính bằng tuần và hoạt động đứng ngay trước (số liệu minh hoạ):<br>A — ký hợp đồng thuê và thiết kế cửa hàng: 3, không có · B — đặt mua kệ, quầy: 4, không có · C — tuyển nhân viên: 1, sau A · D — thi công nội thất: 5, sau A · E — đào tạo nhân viên với kệ, quầy: 3, sau B và C · F — nhập hàng và cài đặt hệ thống: 4, sau D và E · G — chạy chiến dịch ra mắt: 2, sau E.<br>(a) Dùng lượt tính xuôi và tính ngược để tìm ES, EF, LS và LF của mọi hoạt động. (b) Tính thời gian dự trữ, xác định đường găng và thời gian thực hiện dự án. (c) Điều gì xảy ra nếu E bị trễ 2 tuần? Nếu G bị trễ 3 tuần?</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a)(b)  Tính xuôi: ES = EF lớn nhất của việc trước;  Tính ngược: LF = LS nhỏ nhất của việc sau
Việc  TG  Việc trước  ES   EF   LS   LF   Dự trữ
 A     3    —          0    3    0    3     0   ← găng
 B     4    —          0    4    1    5     1
 C     1    A          3    4    4    5     1
 D     5    A          3    8    3    8     0   ← găng
 E     3    B, C       4    7    5    8     1       ES = max(EF B 4, EF C 4) = 4
 F     4    D, E       8   12    8   12     0   ← găng   ES = max(8, 7) = 8
 G     2    E          7    9   10   12     3
Thời gian dự án = 12 tuần        Đường găng: A → D → F  (3 + 5 + 4 = 12)
Các đường khác: A–C–E–F = 11,  B–E–F = 11,  A–C–E–G = 9,  B–E–G = 9
E: LF = min(LS F 8, LS G 10) = 8;  A: LF = min(LS C 4, LS D 3) = 3

(c) E trễ 2 tuần: E chỉ có 1 tuần dự trữ
    → đường A–C–E–F và B–E–F thành 13 tuần → dự án xong sau 13 tuần (trễ 1 tuần)
    G trễ 3 tuần: G có đúng 3 tuần dự trữ
    → dự án vẫn xong sau 12 tuần, nhưng đường A–C–E–G và B–E–G cũng dài 12 tuần
      (3 + 1 + 3 + 5 và 4 + 3 + 5), nên G, E, B và C mất hết dự trữ — mọi hoạt động đều thành găng</code></pre>
<p><strong>Vì sao:</strong> lượt tính xuôi cho thời điểm sớm nhất mỗi hoạt động có thể diễn ra; lượt tính ngược cho thời điểm muộn nhất được phép mà không làm trễ ngày kết thúc; hiệu số của chúng là thời gian dự trữ. Chỉ A, D và F có dự trữ bằng 0, nên nhà quản trị cần theo dõi chúng sát nhất. Nhưng các đường đi qua E chỉ ngắn hơn đường găng một tuần, nên E là hoạt động gần găng: trễ 2 tuần là nó thành găng và làm dự án trễ. Thời gian dự trữ còn được dùng chung — nếu B trễ 1 tuần thì E cũng mất luôn thời gian dự trữ.</p>`,
  ]]);

const c11q = quiz('opm301-quiz-5', 'Quiz 5 — Lean operations & project management|||Quiz 5 — Vận hành tinh gọn & quản trị dự án', [
  { id: 'q1', question: 'Which of the following is NOT one of the seven wastes of lean operations?|||Điều nào sau đây KHÔNG thuộc bảy lãng phí của vận hành tinh gọn?', options: ['Standardized work|||Công việc chuẩn hoá', 'Overproduction|||Sản xuất thừa', 'Waiting|||Chờ đợi', 'Unnecessary motion|||Thao tác thừa'], correctIndex: 0, explanation: 'Standardized work is a lean practice — the baseline for improvement — not a waste.|||Công việc chuẩn hoá là một thực hành tinh gọn — mốc để cải tiến — chứ không phải lãng phí.' },
  { id: 'q2', question: 'Daily demand is 200 units, lead time 3 days, safety stock 100 units and each container holds 50 units. How many kanbans are needed?|||Nhu cầu 200 sản phẩm/ngày, thời gian chờ 3 ngày, tồn kho an toàn 100 sản phẩm, mỗi thùng chứa 50 sản phẩm. Cần bao nhiêu thẻ kanban?', options: ['12|||12', '14|||14', '16|||16', '700|||700'], correctIndex: 1, explanation: '(200 x 3 + 100) / 50 = 700 / 50 = 14. Leaving out the safety stock gives 12; 700 is the number of units, not containers.|||(200 x 3 + 100) / 50 = 700 / 50 = 14. Bỏ quên tồn kho an toàn sẽ ra 12; 700 là số sản phẩm, không phải số thùng.' },
  { id: 'q3', question: 'A PERT activity has a = 4, m = 7 and b = 16 weeks. Its expected time is…|||Một hoạt động PERT có a = 4, m = 7 và b = 16 tuần. Thời gian kỳ vọng là…', options: ['7 weeks|||7 tuần', '9 weeks|||9 tuần', '10 weeks|||10 tuần', '8 weeks|||8 tuần'], correctIndex: 3, explanation: 't = (4 + 4 x 7 + 16) / 6 = 48 / 6 = 8 weeks. 9 is the simple average of a, m and b; 10 is the midpoint of a and b.|||t = (4 + 4 x 7 + 16) / 6 = 48 / 6 = 8 tuần. 9 là trung bình cộng đơn giản của a, m, b; 10 là trung điểm của a và b.' },
]);

const taiLieu = doc('opm301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (kèm link), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">OPM301 · 📚 Resource hub</span>
<h2>Course materials &amp; references</h2>
<p class="lead">One hub for learning operations management: the official syllabus and slides, textbooks, free official resources, video channels, tools and a self-study roadmap.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>Sign in to <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) with your FPTU account to read the official OPM301 syllabus, learning outcomes and lecture slides. This page does not reproduce the syllabus — always follow the version on FLM.</p>
<h3>📗 Books</h3>
<ul>
<li><a href="https://www.pearson.com/" target="_blank" rel="noopener">Operations Management</a> — Jay Heizer, Barry Render &amp; Chuck Munson (Pearson): the standard structure followed in this course, built around the ten strategic OM decisions. Search the title on the publisher's site. Pearson also publishes <em>Operations Management</em> by Slack, Brandon-Jones &amp; Burgess.</li>
<li><a href="https://www.mheducation.com/" target="_blank" rel="noopener">Operations Management</a> — William J. Stevenson (McGraw Hill): clear worked examples on forecasting, capacity, quality and scheduling. Search the title on the publisher's site.</li>
</ul>
<h3>🌐 Free official resources</h3>
<ul>
<li><a href="https://openstax.org/books/introduction-business/pages/10-introduction" target="_blank" rel="noopener">OpenStax — Introduction to Business, Chapter 10</a> — a free, peer-reviewed chapter on world-class operations management.</li>
<li><a href="https://www.itl.nist.gov/div898/handbook/pmc/pmc.htm" target="_blank" rel="noopener">NIST/SEMATECH e-Handbook of Statistical Methods — Chapter 6</a> — process and product monitoring: control charts and process capability.</li>
<li><a href="https://ocw.mit.edu/courses/15-760b-introduction-to-operations-management-spring-2004/" target="_blank" rel="noopener">MIT OpenCourseWare — Introduction to Operations Management</a> — free course materials from MIT Sloan.</li>
<li><a href="https://www.lean.org/" target="_blank" rel="noopener">Lean Enterprise Institute</a> — articles on lean thinking and practice.</li>
<li><a href="https://asq.org/" target="_blank" rel="noopener">ASQ</a> — explanations of quality tools and methods (some content requires membership).</li>
<li><a href="https://www.ascm.org/" target="_blank" rel="noopener">ASCM (APICS)</a> — professional association for supply chain and operations planning.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@MITCTL" target="_blank" rel="noopener">MIT Center for Transportation &amp; Logistics</a> — lectures on supply chain and operations.</li>
<li><a href="https://www.youtube.com/@GembaAcademy" target="_blank" rel="noopener">Gemba Academy</a> — short videos on lean and Six Sigma tools.</li>
<li><a href="https://www.youtube.com/@tutor2u" target="_blank" rel="noopener">tutor2u</a> — short explainers on business topics, including operations.</li>
<li><a href="https://www.youtube.com/@khanacademy" target="_blank" rel="noopener">Khan Academy</a> — a statistics refresher (normal distribution, sampling) for SPC and PERT.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://support.microsoft.com/en-us/excel" target="_blank" rel="noopener">Microsoft Excel</a> (official help &amp; learning) — forecasts, break-even, control charts; the Solver add-in for linear programming.</li>
<li><a href="https://www.google.com/sheets/about/" target="_blank" rel="noopener">Google Sheets</a> — the same calculations, free and online.</li>
<li><a href="https://www.ganttproject.biz/" target="_blank" rel="noopener">GanttProject</a> — a free desktop tool for Gantt charts and project networks.</li>
<li><a href="https://miro.com/" target="_blank" rel="noopener">Miro</a> — online whiteboard for flowcharts, value-stream maps and fishbone diagrams.</li>
</ul>
<h3>🎯 Self-study roadmap</h3>
<ol>
<li><strong>Foundations (exam core)</strong> — forecasting and its errors, break-even, control charts and CPM: redo the four exercises here by hand.</li>
<li><strong>Practise</strong> — rebuild every exercise in a spreadsheet, then change α, costs or activity times and watch the answer move.</li>
<li><strong>Go deeper</strong> — read NIST chapter 6 on control charts and capability; draw a Pareto chart and a fishbone diagram for a real problem in your club or dormitory.</li>
<li><strong>Apply</strong> — map a real process (for example, the canteen queue at lunchtime), find the bottleneck and the wastes, and propose an improvement backed by numbers.</li>
</ol>
<div class="callout"><span class="badge">Note</span> An original hub of real links — no copyrighted slides or books are embedded. If a link moves, start from the official homepage.</div>`,
    `<span class="eyebrow">OPM301 · 📚 Trung tâm tài liệu</span>
<h2>Tài liệu tham khảo môn học</h2>
<p class="lead">Một nơi gom để học quản trị vận hành: giáo trình &amp; slide chính thức, sách, tài liệu miễn phí chính thống, kênh video, công cụ, và lộ trình tự học.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Đăng nhập <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) bằng tài khoản FPTU để đọc đề cương, chuẩn đầu ra và slide bài giảng chính thức của OPM301. Trang này không chép lại đề cương — luôn theo phiên bản trên FLM.</p>
<h3>📗 Sách</h3>
<ul>
<li><a href="https://www.pearson.com/" target="_blank" rel="noopener">Operations Management</a> — Jay Heizer, Barry Render &amp; Chuck Munson (Pearson): cấu trúc chuẩn mà môn học này bám theo, xây quanh mười quyết định chiến lược của quản trị vận hành. Tra tên sách trên trang nhà xuất bản. Pearson cũng xuất bản cuốn <em>Operations Management</em> của Slack, Brandon-Jones &amp; Burgess.</li>
<li><a href="https://www.mheducation.com/" target="_blank" rel="noopener">Operations Management</a> — William J. Stevenson (McGraw Hill): ví dụ giải mẫu rõ ràng về dự báo, công suất, chất lượng và điều độ. Tra tên sách trên trang nhà xuất bản.</li>
</ul>
<h3>🌐 Tài liệu chính thức miễn phí</h3>
<ul>
<li><a href="https://openstax.org/books/introduction-business/pages/10-introduction" target="_blank" rel="noopener">OpenStax — Introduction to Business, Chương 10</a> — chương sách mở miễn phí, có bình duyệt, về quản trị vận hành đẳng cấp thế giới.</li>
<li><a href="https://www.itl.nist.gov/div898/handbook/pmc/pmc.htm" target="_blank" rel="noopener">NIST/SEMATECH e-Handbook of Statistical Methods — Chương 6</a> — giám sát quá trình và sản phẩm: biểu đồ kiểm soát và năng lực quá trình.</li>
<li><a href="https://ocw.mit.edu/courses/15-760b-introduction-to-operations-management-spring-2004/" target="_blank" rel="noopener">MIT OpenCourseWare — Introduction to Operations Management</a> — tài liệu môn học miễn phí của MIT Sloan.</li>
<li><a href="https://www.lean.org/" target="_blank" rel="noopener">Lean Enterprise Institute</a> — bài viết về tư duy và thực hành tinh gọn.</li>
<li><a href="https://asq.org/" target="_blank" rel="noopener">ASQ</a> — giải thích các công cụ và phương pháp chất lượng (một số nội dung yêu cầu hội viên).</li>
<li><a href="https://www.ascm.org/" target="_blank" rel="noopener">ASCM (APICS)</a> — hiệp hội nghề nghiệp về chuỗi cung ứng và hoạch định vận hành.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@MITCTL" target="_blank" rel="noopener">MIT Center for Transportation &amp; Logistics</a> — bài giảng về chuỗi cung ứng và vận hành.</li>
<li><a href="https://www.youtube.com/@GembaAcademy" target="_blank" rel="noopener">Gemba Academy</a> — video ngắn về các công cụ tinh gọn và Six Sigma.</li>
<li><a href="https://www.youtube.com/@tutor2u" target="_blank" rel="noopener">tutor2u</a> — giải thích ngắn các chủ đề kinh doanh, có phần vận hành.</li>
<li><a href="https://www.youtube.com/@khanacademy" target="_blank" rel="noopener">Khan Academy</a> — ôn thống kê (phân phối chuẩn, lấy mẫu) cho SPC và PERT.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://support.microsoft.com/en-us/excel" target="_blank" rel="noopener">Microsoft Excel</a> (trang trợ giúp &amp; học chính thức) — dự báo, hoà vốn, biểu đồ kiểm soát; tiện ích Solver cho quy hoạch tuyến tính.</li>
<li><a href="https://www.google.com/sheets/about/" target="_blank" rel="noopener">Google Sheets</a> — cùng các phép tính đó, miễn phí và trực tuyến.</li>
<li><a href="https://www.ganttproject.biz/" target="_blank" rel="noopener">GanttProject</a> — công cụ miễn phí trên máy tính để vẽ biểu đồ Gantt và sơ đồ mạng dự án.</li>
<li><a href="https://miro.com/" target="_blank" rel="noopener">Miro</a> — bảng trắng trực tuyến để vẽ lưu đồ, sơ đồ chuỗi giá trị và biểu đồ xương cá.</li>
</ul>
<h3>🎯 Lộ trình tự học</h3>
<ol>
<li><strong>Nền tảng (lõi thi)</strong> — dự báo và sai số, hoà vốn, biểu đồ kiểm soát và CPM: làm lại bằng tay bốn bài tập ở đây.</li>
<li><strong>Luyện tập</strong> — dựng lại mọi bài tập trên bảng tính, rồi đổi α, chi phí hay thời gian hoạt động và xem đáp án thay đổi.</li>
<li><strong>Đào sâu</strong> — đọc chương 6 của NIST về biểu đồ kiểm soát và năng lực quá trình; vẽ biểu đồ Pareto và biểu đồ xương cá cho một vấn đề thật ở câu lạc bộ hay ký túc xá.</li>
<li><strong>Vận dụng</strong> — vẽ một quy trình thật (ví dụ hàng chờ ở căng tin giờ trưa), tìm điểm nghẽn và các lãng phí, đề xuất cải tiến có số liệu chứng minh.</li>
</ol>
<div class="callout"><span class="badge">Lưu ý</span> Đây là trung tâm liên kết nguyên gốc — không nhúng slide/sách có bản quyền. Link đổi thì vào trang chủ chính thức để tìm.</div>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'OPM301',
    slug: 'opm301-operations-management',
    title: 'Operations Management',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/OPM301.webp',
    shortDescription: 'How organizations turn inputs into goods and services: strategy, productivity, forecasting, process design, capacity, location, layout, quality and SPC, aggregate planning, MRP, scheduling, lean and CPM/PERT. Bilingual, with worked exercises and quizzes.|||Cách doanh nghiệp biến đầu vào thành hàng hoá, dịch vụ: chiến lược, năng suất, dự báo, quy trình, công suất, địa điểm, mặt bằng, chất lượng, SPC, hoạch định, MRP, điều độ, tinh gọn, CPM/PERT. Song ngữ, có bài tập và quiz.',
    description: 'Môn <strong>OPM301 — Operations Management (Quản trị vận hành)</strong> (khối Quản trị Kinh doanh, kỳ 3) trả lời câu hỏi: <strong>làm thế nào để tạo ra hàng hoá và dịch vụ tốt, nhanh, đúng hẹn và rẻ</strong>. Từ <strong>chiến lược vận hành, năng suất và dự báo</strong> (trung bình động, san bằng mũ, đường xu hướng, MAD/MSE/MAPE) → <strong>thiết kế sản phẩm và quy trình, công suất, hoà vốn, cây quyết định, địa điểm và bố trí mặt bằng</strong> → <strong>quản trị chất lượng</strong> (TQM, Six Sigma, chi phí chất lượng, biểu đồ kiểm soát x̄–R và p, năng lực quá trình) → <strong>hoạch định tổng hợp, MRP và điều độ</strong> (FCFS, SPT, EDD, quy tắc Johnson) → <strong>vận hành tinh gọn/JIT và quản trị dự án CPM/PERT</strong>. Bám cấu trúc giáo trình quản trị vận hành chuẩn quốc tế (Heizer, Render &amp; Munson; Stevenson; Slack và cộng sự), song ngữ Anh–Việt, mọi ví dụ số đã kiểm bằng máy, có bài tập kèm lời giải và quiz cuối mỗi phần. EOQ và tồn kho đã học ở SCM202 nên chỉ được nhắc để liên hệ.',
    whatYouLearn: 'Giải thích vai trò của quản trị vận hành, mười quyết định chiến lược và năm mục tiêu hoạt động (performance objectives)\nĐo năng suất đơn yếu tố và đa yếu tố; phân biệt tiêu chí đủ điều kiện và tiêu chí giành đơn hàng\nDự báo bằng trung bình động, san bằng mũ, đường xu hướng và so sánh bằng MAD, MSE, MAPE\nTính công suất, mức sử dụng, hiệu suất, điểm nghẽn, điểm hoà vốn và EMV trên cây quyết định\nChọn địa điểm bằng phương pháp cho điểm và trọng tâm; cân bằng dây chuyền lắp ráp\nÁp dụng TQM, Six Sigma, chi phí chất lượng; lập biểu đồ x̄–R, p và tính Cp, Cpk\nLập kế hoạch tổng hợp ổn định và bám đuổi, tính MRP; sắp xếp công việc theo FCFS, SPT, EDD và quy tắc Johnson\nNhận diện bảy lãng phí, tính số kanban; lập mạng CPM, tìm đường găng, thời gian dự trữ và xác suất PERT',
    requirements: 'Thống kê căn bản: trung bình, độ lệch chuẩn, phân phối chuẩn (có thể học song song MAS202 — Applied Statistics for Business)\nĐại số phổ thông và phần trăm; biết EOQ và tồn kho ở SCM202 sẽ giúp liên hệ nhưng không bắt buộc\nBảng tính (Excel hoặc Google Sheets) để luyện dự báo, biểu đồ kiểm soát và mạng CPM',
  },
  sections: [
    { title: '📚 Course materials|||📚 Tài liệu tham khảo', description: 'Giáo trình & slide trên FLM, sách, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Course introduction|||Giới thiệu môn học', description: 'Quản trị vận hành là gì, hàng hoá và dịch vụ, mười quyết định, năm mục tiêu hoạt động.', lessons: [intro] },
    { title: 'Part 1 — Operations strategy, productivity & forecasting|||Phần 1 — Chiến lược vận hành, năng suất & dự báo', description: 'Lợi thế cạnh tranh, năng suất, trung bình động, san bằng mũ, đường xu hướng, MAD/MSE/MAPE.', lessons: [c1, c2, c2e, c2q] },
    { title: 'Part 2 — Designing the system: products, processes, capacity, location & layout|||Phần 2 — Thiết kế hệ thống: sản phẩm, quy trình, công suất, địa điểm & mặt bằng', description: 'QFD, chiến lược quy trình, công suất, điểm nghẽn, hoà vốn, cây quyết định, chọn địa điểm, bố trí mặt bằng.', lessons: [c3, c4, c5, c5q] },
    { title: 'Part 3 — Quality management|||Phần 3 — Quản trị chất lượng', description: 'TQM, Six Sigma, chi phí chất lượng, biểu đồ x̄–R, p, năng lực quá trình.', lessons: [c6, c7, c7e, c7q] },
    { title: 'Part 4 — Planning & scheduling|||Phần 4 — Hoạch định & điều độ', description: 'Hoạch định tổng hợp, MRP, quy tắc FCFS, SPT, EDD, quy tắc Johnson.', lessons: [c8, c9, c9e, c9q] },
    { title: 'Part 5 — Lean operations & project management|||Phần 5 — Vận hành tinh gọn & quản trị dự án', description: 'Bảy lãng phí, JIT, kanban, CPM, PERT, rút ngắn dự án.', lessons: [c10, c11, c11e, c11q] },
  ],
};
