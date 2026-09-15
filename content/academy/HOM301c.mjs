/**
 * HOM301c — Hotel Revenue Management. Giáo trình (trích dẫn, không upload PDF):
 * Landman "Hotel Revenue Management"; Cross "Revenue Management"; Tranter
 * "Revenue Management for Hospitality and Tourism". 8 chương: tổng quan &
 * lịch sử RM; chỉ số cốt lõi (ADR/RevPAR/occupancy/GOPPAR); dự báo nhu cầu;
 * định giá & pricing động; kiểm soát tồn kho phòng & overbooking; phân khúc
 * & kênh phân phối (OTA/GDS); hệ thống RMS & công nghệ; total revenue
 * management, đo lường & xu hướng. Song ngữ. Giữ NGUYÊN slug/semester/thumb.
 * ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('hom301c-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình tham khảo (Landman, Cross, Tranter), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">HOM301c · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Hotel Revenue Management — core metrics, forecasting, pricing, inventory control, segmentation &amp; distribution, RMS technology and total revenue management — in one place. The official FPTU giáo trình &amp; slides live on <strong>FLM</strong>; below are the reference textbooks and free resources this course draws on.</p>
<h3>📗 Reference textbooks</h3>
<ul>
<li><em>Hotel Revenue Management: From Theory to Practice</em> — Alexander Landman</li>
<li><em>Revenue Management: A Practical Pricing Perspective</em> — Ian Yeoman &amp; Cathy Cross</li>
<li><em>Revenue Management for Hospitality and Tourism</em> — Christopher Tranter, Trevor Stuart-Hill &amp; Juston Parker</li>
</ul>
<h3>📘 Official slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for HOM301c are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>🌐 Free / industry resources</h3>
<ul>
<li><a href="https://www.hospitalitynet.org/" target="_blank" rel="noopener">Hospitality Net</a> — industry news &amp; revenue management articles</li>
<li><a href="https://www.hotel-online.com/" target="_blank" rel="noopener">Hotel-Online</a> — industry news, trends and case studies</li>
<li><a href="https://www.hsmai.org/" target="_blank" rel="noopener">HSMAI (Hospitality Sales &amp; Marketing Association International)</a> — revenue management resources &amp; certification</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@HotelRevenueManagement" target="_blank" rel="noopener">Hotel revenue management explainers</a> — search "hotel revenue management" for RevPAR/ADR tutorials</li>
<li><a href="https://www.youtube.com/results?search_query=demand+forecasting+hotel" target="_blank" rel="noopener">Demand forecasting for hotels</a> — worked examples</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.smartsheet.com/" target="_blank" rel="noopener">Spreadsheet models</a> — build your own ADR/RevPAR/forecast trackers</li>
<li>PMS/RMS vendor demo sites (Opera Cloud, IDeaS, Duetto) — public product tours for seeing a real RMS dashboard</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — RM history &amp; philosophy, ADR/RevPAR/occupancy/GOPPAR, demand vs. supply.</li>
<li><strong>Practice</strong> — compute the core metrics and a simple demand forecast from a sample data set.</li>
<li><strong>Go deeper</strong> — pricing strategy, overbooking math, segmentation and OTA/GDS distribution economics.</li>
<li><strong>Job-ready</strong> — read an RMS dashboard, understand total revenue management, and track industry trends.</li>
</ol></div>`,
    `<span class="eyebrow">HOM301c · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Quản trị Doanh thu Khách sạn — chỉ số cốt lõi, dự báo nhu cầu, định giá, kiểm soát tồn kho, phân khúc &amp; phân phối, công nghệ RMS và total revenue management — gom về một chỗ. Giáo trình &amp; slide chính thức của FPTU nằm trên <strong>FLM</strong>; bên dưới là các sách tham khảo môn này dựa vào và nguồn miễn phí.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><em>Hotel Revenue Management: From Theory to Practice</em> — Alexander Landman</li>
<li><em>Revenue Management: A Practical Pricing Perspective</em> — Ian Yeoman &amp; Cathy Cross</li>
<li><em>Revenue Management for Hospitality and Tourism</em> — Christopher Tranter, Trevor Stuart-Hill &amp; Juston Parker</li>
</ul>
<h3>📘 Slide chính thức</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của HOM301c có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>🌐 Tài liệu ngành / miễn phí</h3>
<ul>
<li><a href="https://www.hospitalitynet.org/" target="_blank" rel="noopener">Hospitality Net</a> — tin ngành &amp; bài viết về revenue management</li>
<li><a href="https://www.hotel-online.com/" target="_blank" rel="noopener">Hotel-Online</a> — tin ngành, xu hướng và case study</li>
<li><a href="https://www.hsmai.org/" target="_blank" rel="noopener">HSMAI</a> — tài nguyên revenue management &amp; chứng chỉ</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/results?search_query=hotel+revenue+management" target="_blank" rel="noopener">Video giải thích hotel revenue management</a> — tìm "hotel revenue management" để có bài giảng ADR/RevPAR</li>
<li><a href="https://www.youtube.com/results?search_query=demand+forecasting+hotel" target="_blank" rel="noopener">Dự báo nhu cầu cho khách sạn</a> — ví dụ tính toán</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.smartsheet.com/" target="_blank" rel="noopener">Bảng tính mẫu</a> — tự dựng bảng theo dõi ADR/RevPAR/dự báo</li>
<li>Trang demo của các hãng PMS/RMS (Opera Cloud, IDeaS, Duetto) — xem giao diện RMS thật qua tour sản phẩm công khai</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — lịch sử &amp; triết lý RM, ADR/RevPAR/occupancy/GOPPAR, cung-cầu.</li>
<li><strong>Luyện tập</strong> — tính các chỉ số cốt lõi và một dự báo nhu cầu đơn giản từ dữ liệu mẫu.</li>
<li><strong>Đào sâu</strong> — chiến lược định giá, toán overbooking, phân khúc và kinh tế kênh phân phối OTA/GDS.</li>
<li><strong>Sẵn sàng đi làm</strong> — đọc dashboard RMS, hiểu total revenue management, theo dõi xu hướng ngành.</li>
</ol></div>`,
  ]]);

const intro = doc('hom301c-0-1-overview', 'Course overview: Hotel Revenue Management|||Tổng quan: Quản trị Doanh thu Khách sạn',
  'Revenue management là gì; tại sao khách sạn cần nó; lộ trình 8 chương từ chỉ số cốt lõi đến total revenue management.',
  [[
    `<span class="eyebrow">HOM301c · Lesson 0.1 · Overview</span>
<h2>Hotel Revenue Management</h2>
<p class="lead">This course teaches you to <strong>sell the right room, to the right customer, at the right price, through the right channel, at the right time</strong> — the classic definition of revenue management (RM). You'll learn the metrics hotels live by, how demand is forecast, how prices move with demand, how room inventory is controlled, how channels are managed, and how modern RMS software ties it all together.</p>
<h3>Why revenue management exists</h3>
<p>A hotel room is a <strong>perishable, fixed-capacity</strong> product: an unsold room tonight is lost forever, and you cannot build a 201st room overnight. RM emerged from the airline industry in the 1980s (American Airlines' yield management) and moved into hotels because they share the same problem — fixed capacity, perishable inventory, and demand that fluctuates by day, season and event.</p>
<h3>Roadmap</h3>
<p>Core metrics (ADR, RevPAR, occupancy, GOPPAR) → demand forecasting → pricing strategy &amp; dynamic pricing → inventory control &amp; overbooking → market segmentation &amp; distribution (OTA, GDS) → RMS systems &amp; technology → total revenue management, measurement &amp; trends. Bilingual, with worked numeric examples each chapter.</p>`,
    `<span class="eyebrow">HOM301c · Bài 0.1 · Tổng quan</span>
<h2>Quản trị Doanh thu Khách sạn</h2>
<p class="lead">Môn này dạy bạn cách <strong>bán đúng phòng, cho đúng khách, đúng giá, đúng kênh, đúng thời điểm</strong> — định nghĩa kinh điển của revenue management (RM). Bạn sẽ học các chỉ số khách sạn sống bằng, cách dự báo nhu cầu, cách giá di chuyển theo nhu cầu, cách kiểm soát tồn kho phòng, cách quản lý kênh phân phối, và cách phần mềm RMS hiện đại gắn kết tất cả lại.</p>
<h3>Vì sao revenue management ra đời</h3>
<p>Một phòng khách sạn là sản phẩm <strong>dễ hư hỏng, công suất cố định</strong>: một phòng không bán được đêm nay là mất vĩnh viễn, và bạn không thể xây thêm phòng 201 chỉ trong một đêm. RM xuất phát từ ngành hàng không thập niên 1980 (yield management của American Airlines) rồi lan sang khách sạn vì cùng vấn đề — công suất cố định, tồn kho dễ hư hỏng, nhu cầu biến động theo ngày, mùa và sự kiện.</p>
<h3>Lộ trình</h3>
<p>Chỉ số cốt lõi (ADR, RevPAR, occupancy, GOPPAR) → dự báo nhu cầu → chiến lược định giá &amp; pricing động → kiểm soát tồn kho &amp; overbooking → phân khúc thị trường &amp; phân phối (OTA, GDS) → hệ thống RMS &amp; công nghệ → total revenue management, đo lường &amp; xu hướng. Song ngữ, có ví dụ tính toán mỗi chương.</p>`,
  ]]);

const c1 = doc('hom301c-1-1-overview-history', '1.1 — Overview & history of revenue management|||1.1 — Tổng quan & lịch sử revenue management',
  'Định nghĩa RM; nguồn gốc từ hàng không (yield management); 5 điều kiện để RM áp dụng được; triết lý bán đúng phòng-đúng khách-đúng giá-đúng kênh-đúng lúc.',
  [[
    `<span class="eyebrow">HOM301c · Chapter 1 · Lesson 1.1</span>
<h2>Overview &amp; history of revenue management</h2>
<h3>Definition</h3>
<p><strong>Revenue management (RM)</strong> is the application of disciplined analytics to predict customer behavior and optimize product availability and price to maximize revenue growth. In hotels, the classic formulation is:</p>
<pre><code>Sell the RIGHT room
to the RIGHT customer
at the RIGHT price
through the RIGHT channel
at the RIGHT time
</code></pre>
<h3>Where it came from</h3>
<p>RM began as <strong>yield management</strong> in the U.S. airline industry after deregulation (1978), when American Airlines built systems to sell the same seat at different prices to different segments (business vs. leisure) depending on how far in advance it was booked. Hotels adopted the same logic in the late 1980s/1990s because they share the same structural traits.</p>
<h3>Conditions for RM to apply</h3>
<ul>
<li><strong>Fixed, perishable capacity</strong> — a fixed number of rooms; an unsold room-night is gone forever.</li>
<li><strong>High fixed costs, low variable cost</strong> — the marginal cost of one more occupied room is small, so almost any price above it adds profit.</li>
<li><strong>Segmentable demand</strong> — different customer types (corporate, leisure, group) have different willingness to pay.</li>
<li><strong>Advance booking</strong> — demand arrives over time, allowing prices to change as the date approaches.</li>
<li><strong>Fluctuating demand</strong> — demand varies by day of week, season, and events, creating both scarcity and slack to manage.</li>
</ul>
<div class="callout"><span class="badge">Mindset shift</span> Classic hotel pricing set one rate and left it fixed. RM instead treats price as a <strong>lever that moves continuously</strong> with forecasted demand — the core mindset behind every chapter that follows.</div>`,
    `<span class="eyebrow">HOM301c · Chương 1 · Bài 1.1</span>
<h2>Tổng quan &amp; lịch sử revenue management</h2>
<h3>Định nghĩa</h3>
<p><strong>Revenue management (RM)</strong> là việc áp dụng phân tích có kỷ luật để dự đoán hành vi khách hàng và tối ưu tính khả dụng sản phẩm cùng giá bán, nhằm tối đa hoá tăng trưởng doanh thu. Trong khách sạn, công thức kinh điển là:</p>
<pre><code>Bán ĐÚNG phòng
cho ĐÚNG khách
ĐÚNG giá
qua ĐÚNG kênh
ĐÚNG thời điểm
</code></pre>
<h3>Nguồn gốc</h3>
<p>RM bắt đầu như <strong>yield management</strong> trong ngành hàng không Mỹ sau khi bãi bỏ quản lý giá (1978), khi American Airlines xây hệ thống bán cùng một ghế với giá khác nhau cho các phân khúc khác nhau (công vụ vs. du lịch) tuỳ theo đặt trước bao lâu. Khách sạn áp dụng logic tương tự cuối thập niên 1980/1990 vì có cùng đặc điểm cấu trúc.</p>
<h3>Điều kiện để RM áp dụng được</h3>
<ul>
<li><strong>Công suất cố định, dễ hư hỏng</strong> — số phòng cố định; một đêm phòng không bán được là mất vĩnh viễn.</li>
<li><strong>Chi phí cố định cao, chi phí biến đổi thấp</strong> — chi phí biên cho một phòng bán thêm rất nhỏ, nên hầu như mọi mức giá trên đó đều tăng lợi nhuận.</li>
<li><strong>Nhu cầu phân khúc được</strong> — các nhóm khách khác nhau (công vụ, du lịch, đoàn) có mức sẵn lòng chi trả khác nhau.</li>
<li><strong>Đặt trước</strong> — nhu cầu đến theo thời gian, cho phép giá thay đổi khi ngày đến gần.</li>
<li><strong>Nhu cầu biến động</strong> — nhu cầu thay đổi theo ngày trong tuần, theo mùa và sự kiện, tạo ra cả sự khan hiếm và khoảng trống để quản lý.</li>
</ul>
<div class="callout"><span class="badge">Thay đổi tư duy</span> Định giá khách sạn cổ điển đặt một mức giá rồi giữ cố định. RM ngược lại xem giá như <strong>cần điều khiển di chuyển liên tục</strong> theo nhu cầu dự báo — tư duy nền cho mọi chương tiếp theo.</div>`,
  ]]);

const c1q = quiz('hom301c-quiz-1', 'Quiz 1 — Overview & history|||Quiz 1 — Tổng quan & lịch sử', [
  { id: 'q1', question: 'Định nghĩa kinh điển của revenue management trong khách sạn là gì?', options: ['Bán phòng rẻ nhất có thể cho mọi khách', 'Bán đúng phòng, đúng khách, đúng giá, đúng kênh, đúng lúc', 'Giữ một mức giá cố định quanh năm', 'Chỉ bán phòng qua kênh trực tiếp'], correctIndex: 1, explanation: 'RM = tối ưu 5 chữ "đúng" cùng lúc, không chỉ giá thấp hay giá cố định.' },
  { id: 'q2', question: 'Revenue management (yield management) khởi nguồn từ ngành nào?', options: ['Bán lẻ', 'Hàng không (American Airlines)', 'Ngân hàng', 'Nông nghiệp'], correctIndex: 1, explanation: 'Yield management ra đời trong ngành hàng không Mỹ sau bãi bỏ quản lý giá 1978.' },
  { id: 'q3', question: 'Đặc điểm nào của phòng khách sạn KHIẾN revenue management cần thiết?', options: ['Có thể lưu kho vô hạn', 'Công suất cố định & dễ hư hỏng (không bán đêm nay là mất)', 'Chi phí biến đổi rất cao', 'Nhu cầu luôn ổn định, không đổi'], correctIndex: 1, explanation: 'Công suất cố định + tồn kho dễ hư hỏng là lý do cốt lõi RM tồn tại.' },
]);

const c2 = doc('hom301c-2-1-core-metrics', '2.1 — Core metrics: ADR, RevPAR, occupancy, GOPPAR|||2.1 — Chỉ số cốt lõi: ADR, RevPAR, occupancy, GOPPAR',
  'Công thức & ý nghĩa của Occupancy, ADR, RevPAR, GOPPAR; vì sao mỗi chỉ số riêng lẻ có thể gây hiểu sai; ví dụ tính toán.',
  [[
    `<span class="eyebrow">HOM301c · Chapter 2 · Lesson 2.1</span>
<h2>Core metrics: ADR, RevPAR, occupancy, GOPPAR</h2>
<h3>The four numbers every hotel lives by</h3>
<pre><code>Occupancy % = Rooms sold / Rooms available
ADR (Average Daily Rate) = Room revenue / Rooms sold
RevPAR (Revenue per Available Room) = Room revenue / Rooms available
           = Occupancy % x ADR
GOPPAR (Gross Operating Profit per Available Room)
           = Gross operating profit / Rooms available
</code></pre>
<h3>Worked example</h3>
<pre><code>Hotel: 100 rooms available
Rooms sold: 70   Room revenue: $10,500

Occupancy = 70 / 100        = 70%
ADR       = 10,500 / 70     = $150
RevPAR    = 10,500 / 100    = $105
  check: 70% x $150         = $105  (matches)
</code></pre>
<h3>Why one metric alone misleads</h3>
<ul>
<li><strong>High occupancy, low ADR</strong> — rooms sold too cheap; RevPAR may still be mediocre.</li>
<li><strong>High ADR, low occupancy</strong> — priced too high, too many empty rooms; RevPAR suffers too.</li>
<li><strong>RevPAR ignores cost</strong> — two hotels with equal RevPAR can have very different profitability if one spends far more to achieve it. <strong>GOPPAR</strong> closes that gap by looking at profit, not just revenue, per available room.</li>
</ul>
<div class="callout"><span class="badge">Rule of thumb</span> RevPAR is the classic RM scoreboard for <em>top-line</em> performance; GOPPAR is the scoreboard that also asks "...and did it make money?" — this is the bridge to total revenue management in Chapter 8.</div>`,
    `<span class="eyebrow">HOM301c · Chương 2 · Bài 2.1</span>
<h2>Chỉ số cốt lõi: ADR, RevPAR, occupancy, GOPPAR</h2>
<h3>Bốn số mà mọi khách sạn sống bằng</h3>
<pre><code>Occupancy % (Công suất phòng) = Phòng đã bán / Phòng có sẵn
ADR (Giá phòng trung bình) = Doanh thu phòng / Phòng đã bán
RevPAR (Doanh thu trên mỗi phòng có sẵn) = Doanh thu phòng / Phòng có sẵn
           = Occupancy % x ADR
GOPPAR (Lợi nhuận gộp trên mỗi phòng có sẵn)
           = Lợi nhuận hoạt động gộp / Phòng có sẵn
</code></pre>
<h3>Ví dụ tính toán</h3>
<pre><code>Khách sạn: 100 phòng có sẵn
Phòng đã bán: 70   Doanh thu phòng: 10.500 USD

Occupancy = 70 / 100        = 70%
ADR       = 10.500 / 70     = 150 USD
RevPAR    = 10.500 / 100    = 105 USD
  kiểm lại: 70% x 150 USD   = 105 USD  (khớp)
</code></pre>
<h3>Vì sao một chỉ số đơn lẻ dễ gây hiểu sai</h3>
<ul>
<li><strong>Occupancy cao, ADR thấp</strong> — bán phòng quá rẻ; RevPAR vẫn có thể tầm thường.</li>
<li><strong>ADR cao, occupancy thấp</strong> — giá quá cao, nhiều phòng trống; RevPAR cũng chịu ảnh hưởng.</li>
<li><strong>RevPAR bỏ qua chi phí</strong> — hai khách sạn RevPAR bằng nhau có thể lợi nhuận rất khác nếu một bên tốn nhiều chi phí hơn để đạt được nó. <strong>GOPPAR</strong> lấp khoảng trống này bằng cách nhìn vào lợi nhuận, không chỉ doanh thu, trên mỗi phòng có sẵn.</li>
</ul>
<div class="callout"><span class="badge">Quy tắc nhớ</span> RevPAR là bảng điểm RM kinh điển cho hiệu suất <em>doanh thu</em>; GOPPAR là bảng điểm còn hỏi thêm "...và có sinh lời không?" — đây là cầu nối sang total revenue management ở Chương 8.</div>`,
  ]]);

const c2q = quiz('hom301c-quiz-2', 'Quiz 2 — Core metrics|||Quiz 2 — Chỉ số cốt lõi', [
  { id: 'q1', question: 'RevPAR được tính bằng công thức nào?', options: ['ADR / Occupancy', 'Occupancy % x ADR', 'Doanh thu phòng x số phòng bán', 'Lợi nhuận gộp / phòng bán'], correctIndex: 1, explanation: 'RevPAR = Doanh thu phòng / Phòng có sẵn = Occupancy % x ADR.' },
  { id: 'q2', question: 'Khách sạn 100 phòng, bán 70 phòng, doanh thu phòng 10.500 USD. ADR là bao nhiêu?', options: ['105 USD', '150 USD', '70 USD', '10.500 USD'], correctIndex: 1, explanation: 'ADR = Doanh thu phòng / Phòng đã bán = 10.500 / 70 = 150 USD.' },
  { id: 'q3', question: 'Vì sao GOPPAR quan trọng dù RevPAR đã cao?', options: ['GOPPAR luôn bằng RevPAR', 'GOPPAR tính theo lợi nhuận, không chỉ doanh thu, nên phản ánh chi phí', 'GOPPAR chỉ dùng cho khách sạn nhỏ', 'GOPPAR thay thế hoàn toàn occupancy'], correctIndex: 1, explanation: 'RevPAR cao nhưng chi phí cao vẫn có thể lợi nhuận thấp — GOPPAR bắt được điều đó.' },
]);

const c3 = doc('hom301c-3-1-demand-forecasting', '3.1 — Demand forecasting|||3.1 — Dự báo nhu cầu',
  'Vì sao dự báo là nền của RM; dữ liệu đầu vào (booking pace, pickup, history); phương pháp cơ bản (unconstrained demand, pickup method); horizon ngắn/dài hạn.',
  [[
    `<span class="eyebrow">HOM301c · Chapter 3 · Lesson 3.1</span>
<h2>Demand forecasting</h2>
<h3>Why forecasting is the foundation</h3>
<p>Every RM decision — price, inventory control, overbooking level — is a bet on <strong>future demand</strong>. A hotel that under-forecasts sells too cheap too early; one that over-forecasts holds rooms empty waiting for demand that never comes. Forecasting turns raw booking data into a number the rest of RM can act on.</p>
<h3>Key inputs</h3>
<ul>
<li><strong>Booking pace</strong> — how fast rooms are being booked for a future date compared to the same point in previous cycles.</li>
<li><strong>Pickup</strong> — the change in bookings for a date between two observation points (e.g. bookings added this week for a date 30 days out).</li>
<li><strong>Historical patterns</strong> — day-of-week seasonality, local events, holidays.</li>
<li><strong>Unconstrained demand</strong> — the demand that WOULD have occurred if capacity were unlimited, estimated by adding back demand turned away when the hotel was sold out (critical: raw booking counts alone understate true demand on sold-out nights).</li>
</ul>
<h3>A simple pickup-method example</h3>
<pre><code>Target date: 30 days out
Bookings on hand today:         120 rooms
Same point, last similar week:  100 rooms
Pickup ratio = 120 / 100 = 1.20

Final bookings last similar week (at arrival): 180 rooms
Forecast for target date = 180 x 1.20 = 216 rooms (capped at hotel capacity)
</code></pre>
<h3>Horizons</h3>
<p>Hotels typically run <strong>short-term</strong> forecasts (0-30 days, drives daily pricing/overbooking decisions) and <strong>long-term</strong> forecasts (90+ days, drives budgeting, group sales strategy, and staffing).</p>
<div class="callout"><span class="badge">Garbage in, garbage out</span> No pricing model in Chapter 4 can fix a bad forecast — accurate demand forecasting is the single highest-leverage skill in revenue management.</div>`,
    `<span class="eyebrow">HOM301c · Chương 3 · Bài 3.1</span>
<h2>Dự báo nhu cầu</h2>
<h3>Vì sao dự báo là nền tảng</h3>
<p>Mọi quyết định RM — giá, kiểm soát tồn kho, mức overbooking — là một cú đặt cược vào <strong>nhu cầu tương lai</strong>. Khách sạn dự báo thấp sẽ bán quá rẻ quá sớm; dự báo cao lại giữ phòng trống chờ nhu cầu không bao giờ đến. Dự báo biến dữ liệu đặt phòng thô thành một con số mà phần còn lại của RM có thể hành động theo.</p>
<h3>Dữ liệu đầu vào chính</h3>
<ul>
<li><strong>Booking pace (tốc độ đặt phòng)</strong> — tốc độ phòng được đặt cho một ngày tương lai so với cùng điểm mốc ở các chu kỳ trước.</li>
<li><strong>Pickup</strong> — thay đổi số phòng đặt cho một ngày giữa hai điểm quan sát (vd số phòng đặt thêm trong tuần này cho ngày cách 30 ngày nữa).</li>
<li><strong>Mẫu hình lịch sử</strong> — tính mùa theo ngày trong tuần, sự kiện địa phương, ngày lễ.</li>
<li><strong>Unconstrained demand (nhu cầu không bị chặn)</strong> — nhu cầu ĐÃ XẢY RA nếu công suất không giới hạn, ước tính bằng cách cộng lại phần nhu cầu bị từ chối khi khách sạn hết phòng (quan trọng: chỉ đếm số đặt phòng thô sẽ đánh giá thấp nhu cầu thật vào những đêm hết phòng).</li>
</ul>
<h3>Ví dụ đơn giản bằng phương pháp pickup</h3>
<pre><code>Ngày mục tiêu: cách 30 ngày
Số phòng đã đặt hôm nay:            120 phòng
Cùng điểm mốc, tuần tương tự trước: 100 phòng
Tỉ lệ pickup = 120 / 100 = 1,20

Số phòng cuối cùng tuần tương tự trước (lúc khách đến): 180 phòng
Dự báo cho ngày mục tiêu = 180 x 1,20 = 216 phòng (chặn ở công suất khách sạn)
</code></pre>
<h3>Khung thời gian</h3>
<p>Khách sạn thường chạy dự báo <strong>ngắn hạn</strong> (0-30 ngày, dẫn quyết định giá/overbooking hàng ngày) và <strong>dài hạn</strong> (90+ ngày, dẫn dự toán ngân sách, chiến lược bán đoàn, và nhân sự).</p>
<div class="callout"><span class="badge">Đầu vào rác, đầu ra rác</span> Không mô hình định giá nào ở Chương 4 sửa được một dự báo tồi — dự báo nhu cầu chính xác là kỹ năng có đòn bẩy cao nhất trong revenue management.</div>`,
  ]]);

const c3q = quiz('hom301c-quiz-3', 'Quiz 3 — Demand forecasting|||Quiz 3 — Dự báo nhu cầu', [
  { id: 'q1', question: '"Unconstrained demand" trong dự báo nhu cầu nghĩa là gì?', options: ['Số phòng đã bán thực tế', 'Nhu cầu sẽ có nếu công suất không bị giới hạn (kể cả khách bị từ chối lúc hết phòng)', 'Doanh thu phòng trung bình', 'Số phòng trống vào cuối tuần'], correctIndex: 1, explanation: 'Unconstrained demand cộng lại nhu cầu bị chặn lúc sold-out, không chỉ đếm booking thô.' },
  { id: 'q2', question: 'Theo ví dụ pickup method trong bài, tỉ lệ pickup 1,20 nghĩa là gì?', options: ['Nhu cầu giảm 20%', 'Booking hiện tại cao hơn 20% so với cùng điểm mốc kỳ trước', 'Giá phòng tăng 20%', 'Occupancy đạt 120%'], correctIndex: 1, explanation: 'Pickup ratio = booking hiện tại / booking cùng điểm mốc kỳ trước = 120/100 = 1,20 (cao hơn 20%).' },
  { id: 'q3', question: 'Vì sao dự báo nhu cầu được xem là nền tảng của toàn bộ revenue management?', options: ['Vì nó không ảnh hưởng đến giá', 'Vì mọi quyết định giá, tồn kho, overbooking đều dựa trên ước tính nhu cầu tương lai', 'Vì nó chỉ cần dùng một lần khi mở khách sạn', 'Vì nó thay thế hoàn toàn cho ADR'], correctIndex: 1, explanation: 'Dự báo sai làm mọi quyết định RM phía sau (giá, tồn kho, overbooking) đều sai theo.' },
]);

const c4 = doc('hom301c-4-1-pricing-dynamic', '4.1 — Pricing strategy & dynamic pricing|||4.1 — Chiến lược định giá & pricing động',
  'Best Available Rate (BAR) & rate fences; định giá theo nhu cầu (dynamic pricing) thay cho giá cố định theo mùa; rate parity; ví dụ curve giá theo occupancy dự báo.',
  [[
    `<span class="eyebrow">HOM301c · Chapter 4 · Lesson 4.1</span>
<h2>Pricing strategy &amp; dynamic pricing</h2>
<h3>From fixed seasons to dynamic pricing</h3>
<p>Traditional hotel pricing set a handful of seasonal rates (low/shoulder/high) fixed months in advance. <strong>Dynamic pricing</strong> instead adjusts the rate continuously based on the <em>current</em> demand forecast, booking pace and remaining inventory for that specific date — the same room can carry a different price today than it did yesterday, for the same future arrival date.</p>
<h3>Best Available Rate (BAR) &amp; rate fences</h3>
<p>Most hotels sell around a <strong>BAR</strong> — the best publicly available rate for a given date and room type, which moves with demand. Other rates (corporate, group, package) are set as fenced discounts or premiums off BAR. <strong>Rate fences</strong> are the rules that keep segments separate (advance-purchase non-refundable, minimum length of stay, corporate ID) so a price-sensitive segment doesn't cannibalize a segment willing to pay more.</p>
<h3>A simple pricing curve</h3>
<pre><code>Forecasted occupancy for the date -> suggested rate action
   &lt; 50%   -> discount below BAR to stimulate demand
  50-75%    -> hold at standard BAR
  75-90%    -> raise rate above BAR (demand exceeds easy supply)
   &gt; 90%    -> raise further + close cheapest rate plans (near sell-out)
</code></pre>
<h3>Rate parity</h3>
<p>Many hotels commit to <strong>rate parity</strong> — the same room type/date priced the same across the hotel's own website and OTAs — to protect the direct channel from being undercut and to satisfy OTA contract terms (this connects directly to distribution economics in Chapter 6).</p>
<div class="callout"><span class="badge">Price is a lever, not a label</span> Dynamic pricing works because the forecast (Chapter 3) tells you WHEN demand is high — pricing is simply the mechanism that responds to it.</div>`,
    `<span class="eyebrow">HOM301c · Chương 4 · Bài 4.1</span>
<h2>Chiến lược định giá &amp; pricing động</h2>
<h3>Từ giá cố định theo mùa sang định giá động</h3>
<p>Định giá khách sạn truyền thống đặt vài mức giá theo mùa (thấp/giữa/cao điểm) cố định trước nhiều tháng. <strong>Pricing động (dynamic pricing)</strong> ngược lại điều chỉnh giá liên tục dựa trên dự báo nhu cầu <em>hiện tại</em>, tốc độ đặt phòng và tồn kho còn lại cho đúng ngày đó — cùng một phòng có thể mang giá khác hôm nay so với hôm qua, cho cùng một ngày khách đến trong tương lai.</p>
<h3>Best Available Rate (BAR) &amp; rate fences</h3>
<p>Hầu hết khách sạn bán quanh mức <strong>BAR</strong> — giá công khai tốt nhất cho một ngày và loại phòng, di chuyển theo nhu cầu. Các mức giá khác (công vụ, đoàn, gói) được đặt là chiết khấu hoặc phụ thu có điều kiện so với BAR. <strong>Rate fences (hàng rào giá)</strong> là các quy tắc giữ các phân khúc tách biệt (mua trước không hoàn tiền, số đêm tối thiểu, mã công vụ) để phân khúc nhạy giá không "ăn thịt" phân khúc sẵn lòng chi trả cao hơn.</p>
<h3>Một đường cong giá đơn giản</h3>
<pre><code>Occupancy dự báo cho ngày đó -> hành động giá gợi ý
   &lt; 50%   -> giảm giá dưới BAR để kích cầu
  50-75%    -> giữ ở mức BAR chuẩn
  75-90%    -> tăng giá trên BAR (nhu cầu vượt cung dễ)
   &gt; 90%    -> tăng thêm + đóng các gói giá rẻ nhất (gần hết phòng)
</code></pre>
<h3>Rate parity</h3>
<p>Nhiều khách sạn cam kết <strong>rate parity</strong> — cùng loại phòng/ngày có giá giống nhau trên website riêng của khách sạn và trên OTA — để bảo vệ kênh trực tiếp khỏi bị phá giá và để thoả điều khoản hợp đồng OTA (liên quan trực tiếp đến kinh tế phân phối ở Chương 6).</p>
<div class="callout"><span class="badge">Giá là cần điều khiển, không phải nhãn dán</span> Pricing động hiệu quả vì dự báo (Chương 3) cho biết KHI NÀO nhu cầu cao — định giá chỉ là cơ chế phản hồi lại điều đó.</div>`,
  ]]);

const c4q = quiz('hom301c-quiz-4', 'Quiz 4 — Pricing & dynamic pricing|||Quiz 4 — Định giá & pricing động', [
  { id: 'q1', question: 'Dynamic pricing khác định giá theo mùa cố định ở điểm nào?', options: ['Không bao giờ đổi giá', 'Giá di chuyển liên tục theo nhu cầu dự báo hiện tại, không chỉ theo mùa cố định trước', 'Chỉ áp dụng cho khách đoàn', 'Luôn tăng giá mỗi ngày'], correctIndex: 1, explanation: 'Dynamic pricing phản hồi theo forecast/booking pace/tồn kho hiện tại, thay vì mức giá mùa đã ấn định.' },
  { id: 'q2', question: '"Rate fences" dùng để làm gì?', options: ['Tăng công suất phòng', 'Giữ các phân khúc khách tách biệt để phân khúc trả cao không bị mất vào phân khúc nhạy giá', 'Thay thế hoàn toàn cho BAR', 'Chỉ dùng để tính RevPAR'], correctIndex: 1, explanation: 'Rate fences (mua trước không hoàn tiền, LOS tối thiểu...) ngăn cannibalization giữa các phân khúc.' },
  { id: 'q3', question: 'Rate parity trong định giá khách sạn nghĩa là gì?', options: ['Giá đoàn luôn thấp hơn giá lẻ', 'Cùng loại phòng/ngày có giá giống nhau trên website khách sạn và OTA', 'Giá không đổi quanh năm', 'Chỉ bán online mới có giá'], correctIndex: 1, explanation: 'Rate parity = nhất quán giá giữa kênh trực tiếp và OTA cho cùng phòng/ngày.' },
]);

const c5 = doc('hom301c-5-1-inventory-overbooking', '5.1 — Room inventory control & overbooking|||5.1 — Kiểm soát tồn kho phòng & overbooking',
  'Length-of-stay controls, closed-to-arrival; vì sao overbooking hợp lý; công thức mức overbooking dựa trên tỉ lệ no-show/cancellation kỳ vọng; đánh đổi chi phí walk vs. phòng trống.',
  [[
    `<span class="eyebrow">HOM301c · Chapter 5 · Lesson 5.1</span>
<h2>Room inventory control &amp; overbooking</h2>
<h3>Inventory controls</h3>
<p>Beyond price, hotels control WHO can book WHAT by restricting availability itself:</p>
<ul>
<li><strong>Length-of-stay (LOS) controls</strong> — e.g. requiring a minimum 2-night stay on a high-demand Saturday so a short 1-night booking doesn't block a longer, more valuable stay around it.</li>
<li><strong>Closed-to-arrival (CTA)</strong> — blocking NEW arrivals on a specific date (while still honoring stays that arrived earlier and are passing through), used when one night in a multi-night stretch is the true bottleneck.</li>
<li><strong>Rate plan closures</strong> — closing the cheapest rate plans first as a date fills up, discussed in Chapter 4's pricing curve.</li>
</ul>
<h3>Why overbook on purpose</h3>
<p>Every hotel has <strong>no-shows</strong> and <strong>late cancellations</strong>. Selling exactly 100 rooms for 100 physical rooms guarantees empty, unpaid rooms whenever a guest doesn't show. Deliberately confirming slightly MORE reservations than physical rooms — informed by the historical no-show/cancellation rate — captures that lost revenue, at the calculated risk of occasionally having to "walk" a guest to another hotel.</p>
<h3>A simple overbooking calculation</h3>
<pre><code>Physical rooms: 100
Historical no-show + late-cancel rate: 8%

Overbooking level = Rooms / (1 - no-show rate)
                   = 100 / (1 - 0.08)
                   = 100 / 0.92
                   ≈ 109 reservations to confirm

Expected result: ~109 x 8% ≈ 9 no-shows -> ~100 guests actually arrive
</code></pre>
<h3>The cost trade-off</h3>
<p>The right level balances two costs: the <strong>cost of an empty, unpaid room</strong> (lost revenue) against the <strong>cost of walking a guest</strong> (paying for their room elsewhere, transport, goodwill/reputation damage, possible compensation). RM sets the overbooking level where the expected cost of these two errors is balanced, not simply maximized for occupancy.</p>
<div class="callout"><span class="badge">Not guesswork</span> Good overbooking is a statistical bet built on measured no-show history per segment (a corporate no-show rate differs sharply from an OTA leisure booking's), not a flat percentage picked once and left alone.</div>`,
    `<span class="eyebrow">HOM301c · Chương 5 · Bài 5.1</span>
<h2>Kiểm soát tồn kho phòng &amp; overbooking</h2>
<h3>Kiểm soát tồn kho</h3>
<p>Ngoài giá, khách sạn còn kiểm soát AI được đặt CÁI GÌ bằng cách hạn chế chính tính khả dụng:</p>
<ul>
<li><strong>Kiểm soát số đêm tối thiểu (LOS)</strong> — vd yêu cầu ở tối thiểu 2 đêm vào thứ Bảy cao điểm để một booking 1 đêm ngắn không chặn mất một kỳ ở dài hơn, giá trị hơn bao quanh nó.</li>
<li><strong>Closed-to-arrival (CTA)</strong> — chặn khách MỚI ĐẾN vào một ngày cụ thể (vẫn giữ nguyên các kỳ ở đã đến trước đó và đang lưu trú qua ngày đó), dùng khi một đêm trong một chuỗi nhiều đêm là nút thắt thật.</li>
<li><strong>Đóng gói giá</strong> — đóng các gói giá rẻ nhất trước khi một ngày lấp đầy, đã nói ở đường cong giá Chương 4.</li>
</ul>
<h3>Vì sao chủ động overbooking</h3>
<p>Khách sạn nào cũng có <strong>no-show</strong> và <strong>hủy phòng trễ</strong>. Bán đúng 100 phòng cho 100 phòng thật đảm bảo có phòng trống, không thu tiền, mỗi khi có khách không đến. Chủ động xác nhận nhiều đặt phòng hơn số phòng thật MỘT CHÚT — dựa trên tỉ lệ no-show/hủy lịch sử — thu lại phần doanh thu bị mất đó, đổi lại rủi ro đã tính toán là đôi khi phải "walk" khách sang khách sạn khác.</p>
<h3>Ví dụ tính toán overbooking đơn giản</h3>
<pre><code>Phòng thật: 100
Tỉ lệ no-show + hủy trễ lịch sử: 8%

Mức overbooking = Số phòng / (1 - tỉ lệ no-show)
                = 100 / (1 - 0,08)
                = 100 / 0,92
                ≈ 109 đặt phòng cần xác nhận

Kết quả kỳ vọng: ~109 x 8% ≈ 9 no-show -> ~100 khách thực đến
</code></pre>
<h3>Đánh đổi chi phí</h3>
<p>Mức đúng cân bằng hai loại chi phí: <strong>chi phí phòng trống không thu tiền</strong> (mất doanh thu) so với <strong>chi phí "walk" khách</strong> (trả tiền phòng ở khách sạn khác cho họ, chi phí di chuyển, tổn hại uy tín, có thể bồi thường). RM đặt mức overbooking ở điểm hai loại chi phí kỳ vọng này cân bằng, không đơn giản là tối đa hoá occupancy.</p>
<div class="callout"><span class="badge">Không phải đoán mò</span> Overbooking tốt là một cú đặt cược thống kê dựa trên lịch sử no-show đo được theo từng phân khúc (tỉ lệ no-show khách công vụ khác hẳn khách lẻ đặt qua OTA), không phải một tỉ lệ cố định chọn một lần rồi bỏ đó.</div>`,
  ]]);

const c5q = quiz('hom301c-quiz-5', 'Quiz 5 — Inventory & overbooking|||Quiz 5 — Tồn kho & overbooking', [
  { id: 'q1', question: '"Closed-to-arrival" (CTA) là kiểm soát tồn kho nghĩa là gì?', options: ['Đóng toàn bộ khách sạn', 'Chặn khách MỚI đến vào một ngày cụ thể, vẫn giữ khách đang lưu trú qua ngày đó', 'Giảm giá phòng ngày đó', 'Chỉ bán phòng cho khách đoàn'], correctIndex: 1, explanation: 'CTA chặn arrival mới ở một ngày là nút thắt, không ảnh hưởng khách đã ở qua ngày đó.' },
  { id: 'q2', question: 'Khách sạn 100 phòng, tỉ lệ no-show/hủy trễ lịch sử 8%. Mức overbooking hợp lý theo công thức trong bài là bao nhiêu đặt phòng?', options: ['92', '100', '≈109', '120'], correctIndex: 2, explanation: '100 / (1 - 0,08) = 100/0,92 ≈ 109 đặt phòng cần xác nhận.' },
  { id: 'q3', question: 'Mức overbooking tối ưu được chọn dựa trên đánh đổi nào?', options: ['Chi phí phòng trống so với chi phí phải "walk" khách', 'ADR so với RevPAR', 'Occupancy so với GOPPAR', 'Booking pace so với pickup'], correctIndex: 0, explanation: 'RM cân bằng chi phí kỳ vọng của phòng trống (mất doanh thu) và chi phí walk khách (bồi thường, uy tín).' },
]);

const c6 = doc('hom301c-6-1-segmentation-distribution', '6.1 — Market segmentation & distribution channels|||6.1 — Phân khúc thị trường & kênh phân phối',
  'Phân khúc theo mục đích đi & độ nhạy giá (corporate, leisure, group, contract); kênh phân phối trực tiếp vs. gián tiếp; OTA & GDS; chi phí hoa hồng và net RevPAR theo kênh.',
  [[
    `<span class="eyebrow">HOM301c · Chapter 6 · Lesson 6.1</span>
<h2>Market segmentation &amp; distribution channels</h2>
<h3>Segmenting the market</h3>
<p>Not all guests are alike. Hotels typically segment by <strong>purpose of travel</strong> and <strong>price sensitivity</strong>:</p>
<ul>
<li><strong>Corporate/transient</strong> — books close to arrival, less price-sensitive, values flexibility.</li>
<li><strong>Leisure/transient</strong> — books further ahead, more price-sensitive, will trade flexibility for a lower rate.</li>
<li><strong>Group/MICE</strong> — books far ahead, large room blocks, negotiated rates, low per-room margin but high total volume.</li>
<li><strong>Contract/negotiated</strong> — airline crew, long-stay corporate accounts — steady volume at a fixed discounted rate.</li>
</ul>
<h3>Distribution channels</h3>
<p>Rooms reach guests through <strong>direct</strong> channels (hotel website, phone, walk-in) and <strong>indirect</strong> channels — chiefly <strong>OTAs</strong> (Online Travel Agencies — Booking.com, Expedia) and the <strong>GDS</strong> (Global Distribution System — the network travel agents use, e.g. Sabre/Amadeus, mainly for corporate/agent bookings).</p>
<h3>Why the channel matters as much as the rate</h3>
<pre><code>Gross rate booked via OTA:      $150
OTA commission (typ. 15-25%):   -$30  (at 20%)
Net rate to the hotel:          $120

Same $150 rate booked direct:   $150
(minus a small payment/booking-engine fee, far below 20%)
</code></pre>
<p>The same headline ADR of $150 nets very differently depending on channel — this is why RM tracks <strong>net RevPAR by channel</strong>, not just gross booked rate, and why hotels invest in growing the direct channel even when OTAs bring volume.</p>
<div class="callout"><span class="badge">Volume vs. margin</span> OTAs and the GDS extend reach the hotel's own website cannot match on its own — the RM job is to use them for incremental demand while protecting the higher-margin direct channel, not to treat every channel as equally profitable.</div>`,
    `<span class="eyebrow">HOM301c · Chương 6 · Bài 6.1</span>
<h2>Phân khúc thị trường &amp; kênh phân phối</h2>
<h3>Phân khúc thị trường</h3>
<p>Không phải khách nào cũng giống nhau. Khách sạn thường phân khúc theo <strong>mục đích đi</strong> và <strong>độ nhạy giá</strong>:</p>
<ul>
<li><strong>Công vụ/lẻ (corporate/transient)</strong> — đặt gần ngày đến, ít nhạy giá, coi trọng linh hoạt.</li>
<li><strong>Du lịch/lẻ (leisure/transient)</strong> — đặt xa trước hơn, nhạy giá hơn, sẵn sàng đổi linh hoạt để lấy giá thấp.</li>
<li><strong>Đoàn/MICE</strong> — đặt rất xa trước, khối lượng phòng lớn, giá đàm phán, biên lợi nhuận mỗi phòng thấp nhưng tổng khối lượng cao.</li>
<li><strong>Hợp đồng/thoả thuận</strong> — tổ bay hàng không, tài khoản công vụ dài hạn — khối lượng ổn định ở mức giá chiết khấu cố định.</li>
</ul>
<h3>Kênh phân phối</h3>
<p>Phòng đến tay khách qua kênh <strong>trực tiếp</strong> (website khách sạn, điện thoại, khách vào thẳng) và kênh <strong>gián tiếp</strong> — chủ yếu là <strong>OTA</strong> (Đại lý du lịch trực tuyến — Booking.com, Expedia) và <strong>GDS</strong> (Hệ thống phân phối toàn cầu — mạng lưới các đại lý du lịch dùng, vd Sabre/Amadeus, chủ yếu cho đặt phòng công vụ/qua đại lý).</p>
<h3>Vì sao kênh quan trọng ngang giá</h3>
<pre><code>Giá gộp đặt qua OTA:              150 USD
Hoa hồng OTA (thường 15-25%):     -30 USD  (ở mức 20%)
Giá thực về khách sạn:            120 USD

Cùng giá 150 USD đặt trực tiếp:    150 USD
(trừ phí thanh toán/booking engine nhỏ, thấp hơn 20% rất nhiều)
</code></pre>
<p>Cùng một ADR niêm yết 150 USD nhưng về thực khác nhau rất nhiều tuỳ kênh — đây là lý do RM theo dõi <strong>net RevPAR theo kênh</strong>, không chỉ giá gộp đã đặt, và vì sao khách sạn đầu tư phát triển kênh trực tiếp dù OTA mang lại khối lượng.</p>
<div class="callout"><span class="badge">Khối lượng vs. biên lợi nhuận</span> OTA và GDS mở rộng tầm với mà website riêng của khách sạn không tự làm được — việc của RM là dùng chúng cho nhu cầu tăng thêm trong khi bảo vệ kênh trực tiếp biên lợi nhuận cao hơn, không coi mọi kênh sinh lời như nhau.</div>`,
  ]]);

const c6q = quiz('hom301c-quiz-6', 'Quiz 6 — Segmentation & distribution|||Quiz 6 — Phân khúc & phân phối', [
  { id: 'q1', question: 'Phân khúc "group/MICE" có đặc điểm gì?', options: ['Đặt gần ngày đến, ít nhạy giá', 'Đặt xa trước, khối lượng phòng lớn, giá đàm phán, biên lợi nhuận mỗi phòng thấp', 'Luôn đặt qua GDS', 'Không bao giờ đặt trước'], correctIndex: 1, explanation: 'Group/MICE đặt rất xa trước với khối phòng lớn và giá đàm phán, biên thấp nhưng khối lượng cao.' },
  { id: 'q2', question: 'GDS (Global Distribution System) chủ yếu phục vụ loại đặt phòng nào?', options: ['Khách lẻ đặt qua app OTA', 'Đặt phòng qua đại lý du lịch/công vụ (vd Sabre, Amadeus)', 'Khách vào thẳng khách sạn (walk-in)', 'Chỉ đặt phòng cho nhân viên khách sạn'], correctIndex: 1, explanation: 'GDS là mạng lưới đại lý du lịch dùng, chủ yếu cho booking công vụ/qua đại lý.' },
  { id: 'q3', question: 'Vì sao RM theo dõi "net RevPAR theo kênh" thay vì chỉ giá gộp đã đặt?', options: ['Vì giá gộp luôn sai', 'Vì hoa hồng OTA (15-25%) làm giá thực về khách sạn thấp hơn hẳn cùng giá đặt trực tiếp', 'Vì net RevPAR dễ tính hơn ADR', 'Vì kênh không ảnh hưởng đến doanh thu thực'], correctIndex: 1, explanation: 'Cùng ADR niêm yết nhưng về thực khác nhau nhiều tuỳ kênh do hoa hồng OTA/GDS.' },
]);

const c7 = doc('hom301c-7-1-rms-technology', '7.1 — RMS systems & technology|||7.1 — Hệ thống RMS & công nghệ',
  'RMS là gì & vì sao thay bảng tính thủ công; kiến trúc dữ liệu vào-ra (PMS/CRS/RMS); rate shopping & competitor rate tracking; con người vẫn cần override.',
  [[
    `<span class="eyebrow">HOM301c · Chapter 7 · Lesson 7.1</span>
<h2>RMS systems &amp; technology</h2>
<h3>Why software replaced the spreadsheet</h3>
<p>Early revenue managers ran forecasts and pricing decisions in spreadsheets, one hotel, one analyst at a time. A modern <strong>Revenue Management System (RMS)</strong> — e.g. IDeaS, Duetto, Opera Cloud RMS — automates the forecasting and pricing math from Chapters 3-4 at a scale and speed no spreadsheet can match: hundreds of rate/room-type/date combinations recalculated multiple times a day.</p>
<h3>How the data flows</h3>
<pre><code>PMS (Property Management System)
   -> holds today's reservations, rates, guest data
CRS (Central Reservation System)
   -> distributes availability/rates to booking channels
RMS (Revenue Management System)
   -> pulls history + current bookings from PMS/CRS
   -> runs demand forecast + pricing model
   -> pushes updated rate/inventory decisions back to CRS/PMS
</code></pre>
<h3>Rate shopping &amp; competitor tracking</h3>
<p>An RMS (or a companion tool) also ingests <strong>competitor rates</strong> ("rate shopping" data from public OTA listings) so pricing decisions account for what comparable hotels are charging for the same dates, not demand data alone.</p>
<h3>Automation still needs a human</h3>
<p>RMS output is a <strong>recommendation</strong>, not a blind rule. Revenue managers keep the ability to <strong>override</strong> the system — a citywide event the system's history doesn't know about yet, a strategic decision to hold a group block, or a data anomaly all call for judgment the algorithm doesn't have.</p>
<div class="callout"><span class="badge">Tool, not autopilot</span> The RMS scales the math from earlier chapters; it does not remove the revenue manager's job — it changes it from "compute the numbers" to "supervise and correct the machine that computes them."</div>`,
    `<span class="eyebrow">HOM301c · Chương 7 · Bài 7.1</span>
<h2>Hệ thống RMS &amp; công nghệ</h2>
<h3>Vì sao phần mềm thay thế bảng tính</h3>
<p>Revenue manager thời đầu chạy dự báo và quyết định giá trên bảng tính, từng khách sạn, từng chuyên viên một lúc. Một <strong>Revenue Management System (RMS)</strong> hiện đại — vd IDeaS, Duetto, Opera Cloud RMS — tự động hoá toán dự báo và định giá ở Chương 3-4 với quy mô và tốc độ không bảng tính nào theo được: hàng trăm tổ hợp giá/loại phòng/ngày được tính lại nhiều lần mỗi ngày.</p>
<h3>Dữ liệu chảy như thế nào</h3>
<pre><code>PMS (Hệ thống quản lý khách sạn)
   -> giữ đặt phòng, giá, dữ liệu khách hôm nay
CRS (Hệ thống đặt phòng trung tâm)
   -> phân phối tính khả dụng/giá tới các kênh bán
RMS (Hệ thống quản trị doanh thu)
   -> lấy lịch sử + đặt phòng hiện tại từ PMS/CRS
   -> chạy mô hình dự báo nhu cầu + định giá
   -> đẩy quyết định giá/tồn kho mới về lại CRS/PMS
</code></pre>
<h3>Rate shopping &amp; theo dõi đối thủ</h3>
<p>Một RMS (hoặc công cụ đi kèm) còn nạp <strong>giá đối thủ</strong> (dữ liệu "rate shopping" từ các trang OTA công khai) để quyết định giá tính cả việc các khách sạn tương đương đang bán giá bao nhiêu cho cùng ngày, không chỉ dữ liệu nhu cầu riêng.</p>
<h3>Tự động vẫn cần con người</h3>
<p>Đầu ra của RMS là một <strong>gợi ý</strong>, không phải một quy tắc mù quáng. Revenue manager vẫn giữ quyền <strong>override (đè lên)</strong> hệ thống — một sự kiện toàn thành phố mà lịch sử hệ thống chưa biết, một quyết định chiến lược giữ khối phòng đoàn, hay một bất thường dữ liệu đều cần phán đoán mà thuật toán không có.</p>
<div class="callout"><span class="badge">Công cụ, không phải lái tự động</span> RMS nhân quy mô toán học của các chương trước; nó không xoá bỏ công việc của revenue manager — nó đổi công việc đó từ "tính số" thành "giám sát và sửa cái máy tính số".</div>`,
  ]]);

const c7q = quiz('hom301c-quiz-7', 'Quiz 7 — RMS & technology|||Quiz 7 — RMS & công nghệ', [
  { id: 'q1', question: 'Trong kiến trúc dữ liệu, RMS lấy dữ liệu từ đâu để chạy dự báo & định giá?', options: ['Chỉ từ website khách sạn', 'Từ PMS/CRS (lịch sử + đặt phòng hiện tại)', 'Từ mạng xã hội', 'RMS không cần dữ liệu vào'], correctIndex: 1, explanation: 'RMS lấy lịch sử + booking hiện tại từ PMS/CRS rồi đẩy quyết định trở lại.' },
  { id: 'q2', question: '"Rate shopping" trong RMS dùng để làm gì?', options: ['Theo dõi giá đối thủ từ các trang OTA công khai', 'Tính lương nhân viên', 'Đặt phòng cho khách VIP', 'Xoá dữ liệu booking cũ'], correctIndex: 0, explanation: 'Rate shopping nạp giá đối thủ để quyết định giá tính cả cạnh tranh, không chỉ nhu cầu riêng.' },
  { id: 'q3', question: 'Vì sao revenue manager vẫn cần override quyết định của RMS?', options: ['Vì RMS luôn sai', 'Vì có tình huống (sự kiện mới, quyết định chiến lược, bất thường dữ liệu) hệ thống chưa biết hoặc không đủ phán đoán', 'Vì luật yêu cầu con người ký mọi giá', 'Vì RMS không kết nối được PMS'], correctIndex: 1, explanation: 'RMS đưa ra gợi ý dựa trên dữ liệu lịch sử; các tình huống mới/chiến lược cần phán đoán con người.' },
]);

const c8 = doc('hom301c-8-1-total-revenue-trends', '8.1 — Total revenue management, measurement & trends|||8.1 — Total revenue management, đo lường & xu hướng',
  'Total revenue management (TRM) mở rộng RM ra F&B/spa/hội nghị; KPI đo lường thành công (RevPAR index, GOPPAR, TRevPAR); xu hướng: AI/machine learning, personalization, attribute-based selling.',
  [[
    `<span class="eyebrow">HOM301c · Chapter 8 · Lesson 8.1</span>
<h2>Total revenue management, measurement &amp; trends</h2>
<h3>From rooms to total revenue</h3>
<p>Everything so far focused on the room. <strong>Total revenue management (TRM)</strong> applies the same discipline — forecast demand, price dynamically, control availability — to <strong>every</strong> revenue stream: food &amp; beverage, spa, meeting/event space, parking. A hotel that maximizes RevPAR but ignores an under-forecast, underpriced banquet hall is leaving profit on the table.</p>
<pre><code>TRevPAR (Total Revenue per Available Room)
   = Total hotel revenue (rooms + F&amp;B + spa + events + ...) / Rooms available
</code></pre>
<h3>Measuring success</h3>
<ul>
<li><strong>RevPAR index (RGI)</strong> — a hotel's RevPAR divided by its competitive set's average RevPAR x 100; above 100 means outperforming the local competitive set, independent of whether the whole market is up or down.</li>
<li><strong>GOPPAR</strong> (Chapter 2) — ties revenue performance to actual profitability.</li>
<li><strong>TRevPAR</strong> — the TRM-era scoreboard that captures the whole property, not just rooms.</li>
</ul>
<h3>Where the field is heading</h3>
<ul>
<li><strong>AI/machine-learning forecasting</strong> — replacing rule-based pickup methods with models that learn nonlinear demand patterns automatically.</li>
<li><strong>Personalization &amp; attribute-based selling</strong> — pricing and selling specific room attributes (view, floor, bed type) individually rather than one flat rate per room type, closer to how airlines sell seat attributes.</li>
<li><strong>Continued OTA/direct-channel tension</strong> — the distribution economics of Chapter 6 keep pushing hotels to invest in direct booking technology and loyalty programs.</li>
</ul>
<div class="callout"><span class="badge">The through-line</span> Every chapter — metrics, forecasting, pricing, inventory, distribution, technology — feeds into one goal: maximize sustainable total profit from a fixed, perishable asset. That is revenue management.</div>`,
    `<span class="eyebrow">HOM301c · Chương 8 · Bài 8.1</span>
<h2>Total revenue management, đo lường &amp; xu hướng</h2>
<h3>Từ phòng đến tổng doanh thu</h3>
<p>Mọi thứ từ đầu đến giờ tập trung vào phòng. <strong>Total revenue management (TRM)</strong> áp cùng kỷ luật đó — dự báo nhu cầu, định giá động, kiểm soát tính khả dụng — cho <strong>mọi</strong> nguồn doanh thu: ẩm thực, spa, không gian hội nghị/sự kiện, bãi đỗ xe. Một khách sạn tối đa hoá RevPAR nhưng bỏ mặc một sảnh tiệc dự báo thiếu, định giá thấp là đang để lợi nhuận rơi rớt.</p>
<pre><code>TRevPAR (Tổng doanh thu trên mỗi phòng có sẵn)
   = Tổng doanh thu khách sạn (phòng + F&amp;B + spa + sự kiện + ...) / Phòng có sẵn
</code></pre>
<h3>Đo lường thành công</h3>
<ul>
<li><strong>RevPAR index (RGI)</strong> — RevPAR của khách sạn chia cho RevPAR trung bình của nhóm cạnh tranh x 100; trên 100 nghĩa là vượt trội so với nhóm cạnh tranh địa phương, bất kể cả thị trường đang lên hay xuống.</li>
<li><strong>GOPPAR</strong> (Chương 2) — gắn hiệu suất doanh thu với lợi nhuận thực.</li>
<li><strong>TRevPAR</strong> — bảng điểm thời TRM nắm bắt toàn bộ khách sạn, không chỉ phòng.</li>
</ul>
<h3>Ngành đang đi về đâu</h3>
<ul>
<li><strong>Dự báo bằng AI/machine learning</strong> — thay các phương pháp pickup theo quy tắc bằng mô hình tự học các mẫu hình nhu cầu phi tuyến.</li>
<li><strong>Cá nhân hoá &amp; attribute-based selling</strong> — định giá và bán riêng từng thuộc tính phòng (view, tầng, loại giường) thay vì một giá bằng cho cả loại phòng, gần với cách hàng không bán thuộc tính ghế.</li>
<li><strong>Căng giữa OTA và kênh trực tiếp còn tiếp diễn</strong> — kinh tế phân phối ở Chương 6 tiếp tục thúc khách sạn đầu tư công nghệ đặt trực tiếp và chương trình khách hàng thân thiết.</li>
</ul>
<div class="callout"><span class="badge">Mạch xuyên suốt</span> Mọi chương — chỉ số, dự báo, định giá, tồn kho, phân phối, công nghệ — đều dồn về một mục tiêu: tối đa hoá lợi nhuận tổng bền vững từ một tài sản cố định, dễ hư hỏng. Đó là revenue management.</div>`,
  ]]);

const c8q = quiz('hom301c-quiz-8', 'Quiz 8 — Total revenue & trends|||Quiz 8 — Total revenue & xu hướng', [
  { id: 'q1', question: 'Total revenue management (TRM) mở rộng revenue management ra đâu so với RM truyền thống?', options: ['Chỉ tập trung sâu hơn vào giá phòng', 'Mọi nguồn doanh thu của khách sạn: F&B, spa, hội nghị/sự kiện, bãi đỗ xe...', 'Chỉ áp dụng cho khách đoàn', 'Chỉ dùng cho khách sạn 5 sao'], correctIndex: 1, explanation: 'TRM áp cùng kỷ luật RM (dự báo, định giá, kiểm soát tồn kho) cho mọi nguồn doanh thu, không chỉ phòng.' },
  { id: 'q2', question: 'RevPAR index (RGI) trên 100 nghĩa là gì?', options: ['Khách sạn lỗ', 'Khách sạn có RevPAR vượt trội hơn trung bình nhóm cạnh tranh, bất kể thị trường chung lên hay xuống', 'Occupancy đạt 100%', 'ADR bằng giá đối thủ'], correctIndex: 1, explanation: 'RGI = RevPAR khách sạn / RevPAR trung bình nhóm cạnh tranh x 100; >100 là vượt trội tương đối.' },
  { id: 'q3', question: 'Xu hướng nào được nêu trong bài là hướng đi của revenue management hiện đại?', options: ['Bỏ hẳn dự báo nhu cầu', 'Dự báo bằng AI/machine learning và attribute-based selling (bán riêng thuộc tính phòng)', 'Quay lại giá cố định theo mùa', 'Xoá bỏ hoàn toàn kênh OTA'], correctIndex: 1, explanation: 'Bài nêu rõ AI/ML forecasting và attribute-based selling là hai xu hướng chính đang phát triển.' },
]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'HOM301c',
    slug: 'hom301c-hotel-revenue-management',
    title: 'Hotel Revenue Management',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/HOM301c.webp',
    shortDescription: 'Sell the right room, right guest, right price, right channel, right time: ADR/RevPAR/GOPPAR, demand forecasting, dynamic pricing, overbooking, segmentation & OTA/GDS distribution, RMS technology, total revenue management. Bilingual, worked examples & quizzes.|||Bán đúng phòng-đúng khách-đúng giá-đúng kênh-đúng lúc: ADR/RevPAR/GOPPAR, dự báo nhu cầu, pricing động, overbooking, phân khúc & phân phối OTA/GDS, công nghệ RMS, total revenue management. Song ngữ, có ví dụ & quiz.',
    description: 'Môn <strong>HOM301c — Hotel Revenue Management</strong> (kỳ 7, khối Quản trị Kinh doanh) dạy cách tối đa hoá doanh thu khách sạn từ một tài sản cố định, dễ hư hỏng. Từ <strong>tổng quan &amp; lịch sử RM</strong> → <strong>chỉ số cốt lõi</strong> (ADR, RevPAR, occupancy, GOPPAR) → <strong>dự báo nhu cầu</strong> → <strong>chiến lược định giá &amp; pricing động</strong> → <strong>kiểm soát tồn kho &amp; overbooking</strong> → <strong>phân khúc thị trường &amp; kênh phân phối</strong> (OTA, GDS) → <strong>hệ thống RMS &amp; công nghệ</strong> → <strong>total revenue management, đo lường &amp; xu hướng</strong>. Trích dẫn giáo trình Landman, Cross, Tranter; song ngữ, có ví dụ tính toán và quiz mỗi chương.',
    whatYouLearn: 'Triết lý & lịch sử revenue management; ADR/RevPAR/occupancy/GOPPAR/TRevPAR; dự báo nhu cầu (booking pace, pickup, unconstrained demand); BAR & rate fences, dynamic pricing, rate parity; LOS control, closed-to-arrival, toán overbooking; phân khúc (corporate/leisure/group/contract), OTA & GDS, net RevPAR theo kênh; kiến trúc PMS/CRS/RMS, rate shopping; total revenue management, RevPAR index, xu hướng AI & attribute-based selling.',
    requirements: 'Kiến thức cơ bản về quản trị khách sạn & marketing (tương đương các môn nền khối Quản trị Kinh doanh trước kỳ 7). Nên xem giáo trình chính thức trên FLM song song.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách Landman/Cross/Tranter, tài liệu ngành, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Revenue management là gì, vì sao cần, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan & lịch sử|||Chapter 1 — Overview & history', description: 'Định nghĩa RM, nguồn gốc hàng không, điều kiện áp dụng.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Chỉ số cốt lõi|||Chapter 2 — Core metrics', description: 'ADR, RevPAR, occupancy, GOPPAR.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Dự báo nhu cầu|||Chapter 3 — Demand forecasting', description: 'Booking pace, pickup, unconstrained demand.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Định giá & pricing động|||Chapter 4 — Pricing & dynamic pricing', description: 'BAR, rate fences, đường cong giá, rate parity.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Tồn kho & overbooking|||Chapter 5 — Inventory & overbooking', description: 'LOS control, CTA, toán overbooking, đánh đổi chi phí.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Phân khúc & phân phối|||Chapter 6 — Segmentation & distribution', description: 'Corporate/leisure/group, OTA, GDS, net RevPAR.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Hệ thống RMS & công nghệ|||Chapter 7 — RMS & technology', description: 'Kiến trúc PMS/CRS/RMS, rate shopping, override.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Total revenue & xu hướng|||Chapter 8 — Total revenue & trends', description: 'TRevPAR, RevPAR index, AI, attribute-based selling.', lessons: [c8, c8q] },
  ],
};
