/**
 * IDV301 — Interactive Data Visualization for Business Analytics. Giáo trình
 * trích dẫn (KHÔNG upload PDF): Tufte "The Visual Display of Quantitative
 * Information"; Knaflic "Storytelling with Data"; Few "Now You See It";
 * tài liệu Power BI/Tableau. 8 chương: nhận thức thị giác → chọn biểu đồ →
 * nguyên tắc thiết kế → Power BI cơ bản → Power BI nâng cao (DAX) → Tableau
 * → dashboard tương tác → data storytelling. Song ngữ + ví dụ + quiz.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('idv301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: sách kinh điển (Tufte, Knaflic, Few), tài liệu chính thức Power BI/Tableau, YouTube, công cụ luyện tập, lộ trình tự học.',
  [[
    `<span class="eyebrow">IDV301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn interactive data visualization for business — visual perception, chart choice, dashboard design in <strong>Power BI</strong> &amp; <strong>Tableau</strong>, and storytelling with data — in one place. The full official slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for IDV301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books (cited by the syllabus)</h3>
<ul>
<li>Edward Tufte — <em>The Visual Display of Quantitative Information</em> — the classic on data-ink ratio and graphical integrity.</li>
<li>Cole Nussbaumer Knaflic — <em>Storytelling with Data</em> — turning charts into a narrative decision-makers act on.</li>
<li>Stephen Few — <em>Now You See It</em> — visual analysis and dashboard design for business.</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://learn.microsoft.com/power-bi/" target="_blank" rel="noopener">Microsoft Learn — Power BI documentation</a></li>
<li><a href="https://learn.microsoft.com/dax/" target="_blank" rel="noopener">Microsoft Learn — DAX reference</a></li>
<li><a href="https://help.tableau.com/" target="_blank" rel="noopener">Tableau Help</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@GuyinaCube" target="_blank" rel="noopener">Guy in a Cube</a> — Power BI tips straight from Microsoft staff</li>
<li><a href="https://www.youtube.com/@storytellingwithdata" target="_blank" rel="noopener">Storytelling with Data</a> — Knaflic's own channel</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://powerbi.microsoft.com/desktop/" target="_blank" rel="noopener">Power BI Desktop</a> — free authoring tool</li>
<li><a href="https://www.tableau.com/products/public" target="_blank" rel="noopener">Tableau Public</a> — free version to publish dashboards</li>
<li><a href="https://www.data-to-viz.com/" target="_blank" rel="noopener">Data to Viz</a> — pick the right chart for your data shape</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — perception principles, chart selection, data-ink ratio and misleading-chart traps.</li>
<li><strong>Practice</strong> — rebuild the same dataset in Power BI and Tableau; compare the workflow.</li>
<li><strong>Go deeper</strong> — DAX measures, data model relationships, interactive filters &amp; drill-down.</li>
<li><strong>Job-ready</strong> — turn one dashboard into a 3-minute story for a non-technical executive.</li>
</ol></div>`,
    `<span class="eyebrow">IDV301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học trực quan hoá dữ liệu tương tác cho kinh doanh — nhận thức thị giác, chọn biểu đồ, thiết kế dashboard trong <strong>Power BI</strong> &amp; <strong>Tableau</strong>, và kể chuyện bằng dữ liệu — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của IDV301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo (theo giáo trình)</h3>
<ul>
<li>Edward Tufte — <em>The Visual Display of Quantitative Information</em> — kinh điển về tỉ lệ data-ink và sự trung thực của biểu đồ.</li>
<li>Cole Nussbaumer Knaflic — <em>Storytelling with Data</em> — biến biểu đồ thành câu chuyện khiến người ra quyết định hành động.</li>
<li>Stephen Few — <em>Now You See It</em> — phân tích trực quan và thiết kế dashboard cho doanh nghiệp.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://learn.microsoft.com/power-bi/" target="_blank" rel="noopener">Microsoft Learn — tài liệu Power BI</a></li>
<li><a href="https://learn.microsoft.com/dax/" target="_blank" rel="noopener">Microsoft Learn — tham khảo DAX</a></li>
<li><a href="https://help.tableau.com/" target="_blank" rel="noopener">Tableau Help</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@GuyinaCube" target="_blank" rel="noopener">Guy in a Cube</a> — mẹo Power BI từ chính nhân viên Microsoft</li>
<li><a href="https://www.youtube.com/@storytellingwithdata" target="_blank" rel="noopener">Storytelling with Data</a> — kênh của chính Knaflic</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://powerbi.microsoft.com/desktop/" target="_blank" rel="noopener">Power BI Desktop</a> — công cụ dựng báo cáo miễn phí</li>
<li><a href="https://www.tableau.com/products/public" target="_blank" rel="noopener">Tableau Public</a> — bản miễn phí để công bố dashboard</li>
<li><a href="https://www.data-to-viz.com/" target="_blank" rel="noopener">Data to Viz</a> — chọn đúng biểu đồ theo dạng dữ liệu</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — nguyên lý nhận thức, chọn biểu đồ, tỉ lệ data-ink và bẫy biểu đồ gây hiểu lầm.</li>
<li><strong>Luyện tập</strong> — dựng lại cùng một bộ dữ liệu trong Power BI và Tableau; so sánh quy trình.</li>
<li><strong>Đào sâu</strong> — DAX measure, quan hệ trong mô hình dữ liệu, filter &amp; drill-down tương tác.</li>
<li><strong>Sẵn sàng đi làm</strong> — biến một dashboard thành câu chuyện 3 phút cho lãnh đạo không rành kỹ thuật.</li>
</ol></div>`,
  ]]);

const intro = doc('idv301-0-1-overview', 'Course overview: Interactive Data Visualization for Business Analytics|||Tổng quan: Trực quan hoá dữ liệu tương tác cho Phân tích kinh doanh',
  'Vì sao trực quan hoá dữ liệu quan trọng với kinh doanh; lộ trình môn: nhận thức thị giác → chọn biểu đồ → nguyên tắc thiết kế → Power BI → DAX → Tableau → dashboard tương tác → kể chuyện dữ liệu.',
  [[
    `<span class="eyebrow">IDV301 · Lesson 0.1 · Overview</span>
<h2>Interactive Data Visualization for Business Analytics</h2>
<p class="lead">Raw numbers rarely change a business decision by themselves — a well-designed chart does. This course teaches you to turn tables of data into <strong>visuals people understand in seconds</strong>, then package them into <strong>interactive dashboards</strong> (Power BI, Tableau) that let a manager explore, filter and drill down without asking an analyst first.</p>
<h3>Why this matters</h3>
<ul>
<li><strong>Perception first</strong> — the human eye is very good at comparing length and position, very bad at comparing area and angle (pie slices, bubble sizes). Design that respects this, or the chart lies without anyone intending it to.</li>
<li><strong>The right chart, not the prettiest one</strong> — a line chart for a trend, a bar chart for a comparison, a scatter plot for a relationship. Matching form to the question is the single biggest lever on clarity.</li>
<li><strong>Interactivity</strong> — a static chart answers one question; a dashboard with filters and drill-down lets an executive ask their own.</li>
</ul>
<h3>Roadmap</h3>
<p>Visual perception &amp; Gestalt principles → choosing the right chart type → design principles (data-ink ratio, avoiding misleading charts) → Power BI basics → Power BI advanced (DAX, data relationships) → Tableau &amp; interactive dashboards → effective dashboard design (filter, drill-down) → data storytelling for executives. Bilingual, with worked examples in both tools.</p>`,
    `<span class="eyebrow">IDV301 · Bài 0.1 · Tổng quan</span>
<h2>Trực quan hoá dữ liệu tương tác cho Phân tích kinh doanh</h2>
<p class="lead">Số liệu thô hiếm khi tự nó thay đổi một quyết định kinh doanh — một biểu đồ được thiết kế tốt thì có thể. Môn này dạy bạn biến bảng dữ liệu thành <strong>hình ảnh người khác hiểu trong vài giây</strong>, rồi gói chúng vào <strong>dashboard tương tác</strong> (Power BI, Tableau) để một quản lý tự khám phá, lọc và drill-down mà không cần hỏi lại nhà phân tích.</p>
<h3>Vì sao quan trọng</h3>
<ul>
<li><strong>Nhận thức trước tiên</strong> — mắt người rất giỏi so sánh độ dài và vị trí, rất kém so sánh diện tích và góc (miếng bánh pie, kích cỡ bubble). Thiết kế tôn trọng điều này, không thì biểu đồ nói sai dù không ai cố ý.</li>
<li><strong>Đúng biểu đồ, không phải biểu đồ đẹp nhất</strong> — line chart cho xu hướng, bar chart cho so sánh, scatter plot cho quan hệ. Khớp hình thức với câu hỏi là đòn bẩy lớn nhất cho sự rõ ràng.</li>
<li><strong>Tính tương tác</strong> — biểu đồ tĩnh trả lời một câu hỏi; dashboard có filter và drill-down cho lãnh đạo tự hỏi câu của riêng họ.</li>
</ul>
<h3>Lộ trình</h3>
<p>Nhận thức thị giác &amp; nguyên lý Gestalt → chọn đúng loại biểu đồ → nguyên tắc thiết kế (tỉ lệ data-ink, tránh biểu đồ gây hiểu lầm) → Power BI cơ bản → Power BI nâng cao (DAX, quan hệ dữ liệu) → Tableau &amp; dashboard tương tác → thiết kế dashboard hiệu quả (filter, drill-down) → data storytelling cho lãnh đạo. Song ngữ, có ví dụ thực hành trên cả hai công cụ.</p>`,
  ]]);

const c1 = doc('idv301-1-1-perception', '1.1 — Visual perception & principles of visualization|||1.1 — Nhận thức thị giác & nguyên lý trực quan hoá',
  'Preattentive attributes (màu, kích cỡ, vị trí), nguyên lý Gestalt (gần nhau, tương đồng, khép kín), thang đo chính xác nhận thức của Cleveland — vì sao trục dài/vị trí dễ đọc hơn diện tích/góc.',
  [[
    `<span class="eyebrow">IDV301 · Chapter 1 · Lesson 1.1</span>
<h2>Visual perception &amp; principles of visualization</h2>
<h3>Preattentive attributes</h3>
<p>Some visual properties are processed by the brain in milliseconds, before conscious attention — <strong>color, size, position, shape</strong>. A chart that encodes the important number with a preattentive attribute (e.g. one bar colored red among gray bars) is read instantly; one that relies on reading labels is not.</p>
<h3>Gestalt principles</h3>
<ul>
<li><strong>Proximity</strong> — items placed close together are perceived as a group (grouping legend items near their bars instead of a separate legend).</li>
<li><strong>Similarity</strong> — items sharing color/shape are perceived as related (use one color per category consistently across all charts in a dashboard).</li>
<li><strong>Enclosure</strong> — a border or shaded background groups items even more strongly than proximity alone.</li>
</ul>
<h3>Cleveland &amp; McGill's ranking of accuracy</h3>
<p>Research (cited across the course's references, notably Tufte and Few) ranks how accurately humans judge different visual encodings, from best to worst: <strong>position along a common scale</strong> &gt; <strong>length</strong> &gt; <strong>angle/slope</strong> &gt; <strong>area</strong> &gt; <strong>volume</strong> &gt; <strong>color hue/saturation</strong>.</p>
<pre><code>Practical consequence:
 Bar chart (length from a common baseline) is read more accurately than
 Pie chart (angle) is read more accurately than
 Bubble chart (area) for the SAME comparison task.
</code></pre>
<div class="callout"><span class="badge">Rule of thumb</span> When the goal is an accurate comparison of values, prefer position/length encodings (bar, line, dot plot) over area/angle encodings (pie, bubble, donut) — save the latter for when the point is a rough impression, not a precise read.</div>`,
    `<span class="eyebrow">IDV301 · Chương 1 · Bài 1.1</span>
<h2>Nhận thức thị giác &amp; nguyên lý trực quan hoá</h2>
<h3>Thuộc tính tiền chú ý (preattentive)</h3>
<p>Một số thuộc tính thị giác được não xử lý trong vài mili giây, trước khi có sự chú ý có ý thức — <strong>màu, kích cỡ, vị trí, hình dạng</strong>. Một biểu đồ mã hoá số quan trọng bằng thuộc tính tiền chú ý (vd một cột màu đỏ giữa các cột xám) được đọc ngay lập tức; một biểu đồ phải đọc nhãn chữ thì không.</p>
<h3>Nguyên lý Gestalt</h3>
<ul>
<li><strong>Gần nhau (proximity)</strong> — các phần tử đặt gần nhau được nhận thức là một nhóm (đặt chú giải sát cạnh cột thay vì để riêng một legend).</li>
<li><strong>Tương đồng (similarity)</strong> — các phần tử cùng màu/hình được nhận thức là liên quan (dùng một màu cố định cho mỗi hạng mục trên toàn dashboard).</li>
<li><strong>Khép kín (enclosure)</strong> — đường viền hoặc nền tô nhóm các phần tử mạnh hơn cả proximity.</li>
</ul>
<h3>Thang đo độ chính xác của Cleveland &amp; McGill</h3>
<p>Nghiên cứu (được các tài liệu tham khảo của môn, đặc biệt Tufte và Few, trích dẫn) xếp hạng độ chính xác con người đọc các cách mã hoá thị giác khác nhau, từ tốt nhất đến kém nhất: <strong>vị trí trên một thang chung</strong> &gt; <strong>độ dài</strong> &gt; <strong>góc/độ dốc</strong> &gt; <strong>diện tích</strong> &gt; <strong>thể tích</strong> &gt; <strong>tông màu/độ bão hoà</strong>.</p>
<pre><code>Hệ quả thực tế:
 Bar chart (độ dài từ đường gốc chung) đọc chính xác hơn
 Pie chart (góc) đọc chính xác hơn
 Bubble chart (diện tích) cho CÙNG một việc so sánh.
</code></pre>
<div class="callout"><span class="badge">Quy tắc ngón tay cái</span> Khi mục tiêu là so sánh giá trị chính xác, chọn mã hoá vị trí/độ dài (bar, line, dot plot) hơn diện tích/góc (pie, bubble, donut) — chỉ dùng nhóm sau khi mục đích là cảm nhận thô, không cần đọc số chính xác.</div>`,
  ]]);

const c1q = quiz('idv301-quiz-1', 'Quiz 1 — Visual perception|||Quiz 1 — Nhận thức thị giác', [
  { id: 'q1', question: 'Theo Cleveland & McGill, con người đọc thuộc tính thị giác nào chính xác NHẤT khi so sánh giá trị?', options: ['Màu sắc (hue)', 'Diện tích', 'Vị trí trên một thang chung', 'Thể tích'], correctIndex: 2, explanation: 'Vị trí trên một thang chung được xếp hạng chính xác nhất, kế đến là độ dài.' },
  { id: 'q2', question: 'Nguyên lý Gestalt nào giải thích việc đặt chú giải sát cạnh cột thay vì để legend riêng giúp dễ đọc hơn?', options: ['Tương đồng (similarity)', 'Gần nhau (proximity)', 'Khép kín (enclosure)', 'Liên tục (continuity)'], correctIndex: 1, explanation: 'Proximity: các phần tử gần nhau được nhận thức là một nhóm.' },
  { id: 'q3', question: 'Vì sao pie chart dễ đọc sai hơn bar chart khi so sánh giá trị chính xác?', options: ['Pie chart luôn thiếu màu', 'Con người đọc góc/diện tích kém chính xác hơn vị trí/độ dài', 'Pie chart không cho phép có nhãn số', 'Bar chart luôn có nhiều màu hơn'], correctIndex: 1, explanation: 'Pie chart mã hoá bằng góc — kém chính xác hơn mã hoá bằng độ dài/vị trí của bar chart.' },
]);

const c2 = doc('idv301-2-1-chart-selection', '2.1 — Choosing the right chart type|||2.1 — Chọn loại biểu đồ phù hợp dữ liệu',
  'Khớp loại biểu đồ với mục đích: so sánh (bar), xu hướng theo thời gian (line), phân phối (histogram/boxplot), quan hệ (scatter), thành phần (stacked bar, tránh pie nhiều lát).',
  [[
    `<span class="eyebrow">IDV301 · Chapter 2 · Lesson 2.1</span>
<h2>Choosing the right chart type</h2>
<p>Every chart answers ONE of a handful of questions. Pick the chart by starting from the <strong>question</strong>, not from what looks impressive.</p>
<pre><code>Question              -> Chart
Comparison (categories) -> Bar chart (horizontal for long labels)
Trend over time         -> Line chart
Distribution of values  -> Histogram, box plot
Relationship (2 vars)   -> Scatter plot
Part-to-whole           -> Stacked bar (100%), treemap
Ranking                 -> Sorted bar chart
Geographic pattern      -> Map (choropleth)
</code></pre>
<h3>Charts to use with caution</h3>
<ul>
<li><strong>Pie / donut chart</strong> — only for 2-3 slices with a clearly dominant one; beyond that, a sorted bar chart communicates faster and more accurately.</li>
<li><strong>3D charts</strong> — perspective distorts area and position judgments; almost never improves on a 2D equivalent.</li>
<li><strong>Dual-axis line chart</strong> — two different scales on one chart can visually suggest a correlation that doesn't exist; use only when the reader clearly understands both axes.</li>
</ul>
<div class="callout"><span class="badge">Ask first</span> Before opening any chart tool, write down the ONE question the chart must answer for the reader. The chart type follows from the question, not the other way around.</div>`,
    `<span class="eyebrow">IDV301 · Chương 2 · Bài 2.1</span>
<h2>Chọn loại biểu đồ phù hợp dữ liệu</h2>
<p>Mỗi biểu đồ chỉ trả lời MỘT trong vài loại câu hỏi. Chọn biểu đồ bắt đầu từ <strong>câu hỏi</strong>, không phải từ cái nào trông ấn tượng.</p>
<pre><code>Câu hỏi                  -> Biểu đồ
So sánh (hạng mục)          -> Bar chart (nằm ngang nếu nhãn dài)
Xu hướng theo thời gian      -> Line chart
Phân phối giá trị            -> Histogram, box plot
Quan hệ (2 biến)              -> Scatter plot
Thành phần trong tổng thể     -> Stacked bar (100%), treemap
Xếp hạng                      -> Bar chart đã sắp xếp
Mẫu hình địa lý                -> Bản đồ (choropleth)
</code></pre>
<h3>Biểu đồ cần dùng thận trọng</h3>
<ul>
<li><strong>Pie / donut chart</strong> — chỉ dùng cho 2-3 lát với một lát rõ chiếm ưu thế; nhiều hơn thì bar chart đã sắp xếp truyền đạt nhanh và chính xác hơn.</li>
<li><strong>Biểu đồ 3D</strong> — góc nhìn làm sai lệch cảm nhận diện tích và vị trí; hầu như không bao giờ tốt hơn bản 2D tương ứng.</li>
<li><strong>Line chart hai trục (dual-axis)</strong> — hai thang đo khác nhau trên một biểu đồ có thể gợi ý một tương quan không thật; chỉ dùng khi người đọc hiểu rõ cả hai trục.</li>
</ul>
<div class="callout"><span class="badge">Hỏi trước</span> Trước khi mở bất kỳ công cụ vẽ biểu đồ nào, viết ra MỘT câu hỏi mà biểu đồ phải trả lời cho người đọc. Loại biểu đồ theo sau câu hỏi, không phải ngược lại.</div>`,
  ]]);

const c2q = quiz('idv301-quiz-2', 'Quiz 2 — Chart selection|||Quiz 2 — Chọn biểu đồ', [
  { id: 'q1', question: 'Muốn thể hiện xu hướng doanh thu theo 12 tháng, nên dùng biểu đồ gì?', options: ['Pie chart', 'Line chart', 'Bubble chart 3D', 'Donut chart'], correctIndex: 1, explanation: 'Xu hướng theo thời gian khớp với line chart.' },
  { id: 'q2', question: 'Vì sao nên tránh pie chart khi có hơn 5-6 hạng mục?', options: ['Pie chart không tô được màu', 'Góc/diện tích khó so sánh chính xác khi có nhiều lát nhỏ', 'Pie chart không có tiêu đề', 'Pie chart chỉ dùng cho dữ liệu âm'], correctIndex: 1, explanation: 'Nhiều lát nhỏ làm việc so sánh góc/diện tích trở nên khó và dễ sai.' },
  { id: 'q3', question: 'Bước ĐẦU TIÊN khi chọn loại biểu đồ nên là gì?', options: ['Chọn màu đẹp nhất', 'Xác định câu hỏi mà biểu đồ phải trả lời cho người đọc', 'Dùng biểu đồ 3D cho ấn tượng', 'Copy biểu đồ của báo cáo khác'], correctIndex: 1, explanation: 'Loại biểu đồ nên theo sau câu hỏi/mục đích, không phải chọn trước rồi ép dữ liệu vào.' },
]);

const c3 = doc('idv301-3-1-design-principles', '3.1 — Design principles: data-ink ratio & avoiding misleading charts|||3.1 — Nguyên tắc thiết kế: tỉ lệ data-ink & tránh biểu đồ gây hiểu lầm',
  'Tỉ lệ data-ink của Tufte (tối đa hoá mực thể hiện dữ liệu, xoá chartjunk), bẫy thường gặp: trục Y bị cắt, trục kép không khớp, tỉ lệ diện tích sai trong bubble chart.',
  [[
    `<span class="eyebrow">IDV301 · Chapter 3 · Lesson 3.1</span>
<h2>Design principles: data-ink ratio &amp; avoiding misleading charts</h2>
<h3>The data-ink ratio (Tufte)</h3>
<p>Tufte defines <strong>data-ink ratio = ink used to show data ÷ total ink printed</strong>. Maximize it: every gridline, 3D bevel, background image, redundant legend and heavy border that doesn't carry information is <strong>chartjunk</strong> — remove it. A clean chart with fewer decorative elements is read faster and trusted more.</p>
<pre><code>Chartjunk checklist — remove unless it carries information:
 - Gridlines heavier than the data itself
 - Gradient/3D fills on 2D bars
 - Redundant data labels + legend + axis for the same number
 - Decorative background images behind the plot area
</code></pre>
<h3>Common ways charts mislead — without anyone intending it</h3>
<ul>
<li><strong>Truncated Y-axis</strong> — starting a bar chart's axis at 90 instead of 0 makes a 2% change look like a 300% change. Bar charts must start at zero; line charts showing rate-of-change can sometimes justify it, but always label it.</li>
<li><strong>Mismatched dual axes</strong> — two lines on different scales can be dragged visually on top of each other by picking the axis ranges, implying a correlation that isn't there.</li>
<li><strong>Area misrepresenting value</strong> — doubling a bubble's <em>radius</em> quadruples its <em>area</em>; readers judge by area, so radius must scale with the square root of the value.</li>
</ul>
<div class="callout"><span class="badge">Integrity check</span> Before publishing any chart, ask: does the visual size of the change on screen match the size of the change in the underlying number? If not, it is misleading regardless of intent.</div>`,
    `<span class="eyebrow">IDV301 · Chương 3 · Bài 3.1</span>
<h2>Nguyên tắc thiết kế: tỉ lệ data-ink &amp; tránh biểu đồ gây hiểu lầm</h2>
<h3>Tỉ lệ data-ink (Tufte)</h3>
<p>Tufte định nghĩa <strong>tỉ lệ data-ink = mực dùng để thể hiện dữ liệu ÷ tổng mực in ra</strong>. Tối đa hoá tỉ lệ này: mọi gridline, hiệu ứng vát 3D, ảnh nền, legend thừa và viền dày không mang thông tin đều là <strong>chartjunk</strong> — xoá bỏ. Một biểu đồ sạch, ít trang trí được đọc nhanh hơn và được tin tưởng hơn.</p>
<pre><code>Danh sách chartjunk cần xoá (trừ khi mang thông tin):
 - Gridline đậm hơn chính dữ liệu
 - Hiệu ứng gradient/3D lên cột 2D
 - Nhãn số + legend + trục cùng lặp lại một con số
 - Ảnh nền trang trí phía sau vùng vẽ
</code></pre>
<h3>Những cách biểu đồ gây hiểu lầm phổ biến — mà không ai cố ý</h3>
<ul>
<li><strong>Trục Y bị cắt</strong> — cho trục bar chart bắt đầu từ 90 thay vì 0 làm một thay đổi 2% trông như 300%. Bar chart phải bắt đầu từ 0; line chart thể hiện tốc độ thay đổi đôi khi có thể biện minh, nhưng luôn phải ghi rõ.</li>
<li><strong>Trục kép không khớp</strong> — hai đường trên hai thang khác nhau có thể được "kéo" trùng nhau về mặt hình ảnh bằng cách chọn khoảng trục, ngụ ý một tương quan không thật.</li>
<li><strong>Diện tích thể hiện sai giá trị</strong> — tăng gấp đôi <em>bán kính</em> của bubble làm <em>diện tích</em> tăng gấp bốn; người đọc cảm nhận theo diện tích, nên bán kính phải theo căn bậc hai của giá trị.</li>
</ul>
<div class="callout"><span class="badge">Kiểm tra trung thực</span> Trước khi công bố bất kỳ biểu đồ nào, hỏi: kích thước hình ảnh của sự thay đổi trên màn hình có khớp với kích thước thay đổi của con số gốc không? Nếu không, biểu đồ gây hiểu lầm bất kể có cố ý hay không.</div>`,
  ]]);

const c3q = quiz('idv301-quiz-3', 'Quiz 3 — Design principles|||Quiz 3 — Nguyên tắc thiết kế', [
  { id: 'q1', question: 'Tỉ lệ data-ink của Tufte đo điều gì?', options: ['Số màu dùng trong biểu đồ', 'Mực thể hiện dữ liệu chia cho tổng mực in ra', 'Số lượng gridline', 'Độ phân giải hình ảnh'], correctIndex: 1, explanation: 'Data-ink ratio = ink dùng cho dữ liệu ÷ tổng ink in ra; nên tối đa hoá.' },
  { id: 'q2', question: 'Vì sao cắt trục Y (không bắt đầu từ 0) ở bar chart dễ gây hiểu lầm?', options: ['Làm biểu đồ chậm tải hơn', 'Làm thay đổi nhỏ trông như thay đổi rất lớn', 'Làm mất màu sắc', 'Không liên quan đến hiểu lầm'], correctIndex: 1, explanation: 'Cắt trục phóng đại độ dài cột một cách không tương xứng với thay đổi thật.' },
  { id: 'q3', question: 'Khi vẽ bubble chart, kích thước bubble nên theo quy tắc nào để không gây hiểu lầm?', options: ['Bán kính tỉ lệ thuận trực tiếp với giá trị', 'Bán kính tỉ lệ theo căn bậc hai của giá trị (vì người đọc cảm nhận theo diện tích)', 'Đường kính cố định cho mọi bubble', 'Không cần quy tắc nào'], correctIndex: 1, explanation: 'Diện tích = π·r²; để diện tích tỉ lệ đúng với giá trị, bán kính phải theo căn bậc hai của giá trị.' },
]);

const c4 = doc('idv301-4-1-powerbi-basics', '4.1 — Power BI basics: Get Data, Power Query & first visuals|||4.1 — Power BI cơ bản: Get Data, Power Query & biểu đồ đầu tiên',
  'Ba khung nhìn Power BI Desktop (Report/Data/Model), Get Data & Power Query (làm sạch dữ liệu), kéo-thả tạo biểu đồ đầu tiên, field well và định dạng trực quan.',
  [[
    `<span class="eyebrow">IDV301 · Chapter 4 · Lesson 4.1</span>
<h2>Power BI basics: Get Data, Power Query &amp; first visuals</h2>
<h3>Three views in Power BI Desktop</h3>
<ul>
<li><strong>Report view</strong> — where you build visuals (charts, tables, cards) on a canvas.</li>
<li><strong>Data view</strong> — inspect the raw rows of each loaded table.</li>
<li><strong>Model view</strong> — see and edit relationships between tables (covered in 5.1).</li>
</ul>
<h3>Get Data &amp; Power Query</h3>
<p><strong>Get Data</strong> connects to a source (Excel, CSV, SQL database, web). <strong>Power Query Editor</strong> then lets you clean and reshape the data BEFORE it loads into the model — remove columns, fix data types, filter rows, unpivot columns — all recorded as reusable steps (no manual re-cleaning next time the source refreshes).</p>
<pre><code>Typical Power Query cleanup steps:
 1. Remove unused columns
 2. Change data types (Date, Whole Number, Text)
 3. Filter out blank/error rows
 4. Rename columns to business-friendly names
 5. Close & Apply -> loads the cleaned table into the model
</code></pre>
<h3>Building your first visual</h3>
<p>Drag a category field (e.g. Product) to the <strong>Axis</strong> well and a numeric field (e.g. Sales) to the <strong>Values</strong> well of a bar chart visual — Power BI auto-aggregates (usually SUM). Format the visual in the <strong>Format pane</strong>: title, data labels, colors, axis.</p>
<div class="callout"><span class="badge">Clean once, reuse forever</span> Every Power Query step is saved. When the source data refreshes, re-running the same cleaning steps is one click — this is the core productivity win over manually cleaning data in Excel every time.</div>`,
    `<span class="eyebrow">IDV301 · Chương 4 · Bài 4.1</span>
<h2>Power BI cơ bản: Get Data, Power Query &amp; biểu đồ đầu tiên</h2>
<h3>Ba khung nhìn trong Power BI Desktop</h3>
<ul>
<li><strong>Report view</strong> — nơi dựng biểu đồ (chart, table, card) trên canvas.</li>
<li><strong>Data view</strong> — xem các dòng dữ liệu thô của mỗi bảng đã nạp.</li>
<li><strong>Model view</strong> — xem và chỉnh quan hệ giữa các bảng (học ở bài 5.1).</li>
</ul>
<h3>Get Data &amp; Power Query</h3>
<p><strong>Get Data</strong> kết nối tới nguồn (Excel, CSV, database SQL, web). <strong>Power Query Editor</strong> sau đó cho phép làm sạch và định hình lại dữ liệu TRƯỚC khi nạp vào model — xoá cột, sửa kiểu dữ liệu, lọc dòng, unpivot cột — tất cả được ghi lại thành các bước có thể tái sử dụng (không phải làm sạch lại bằng tay mỗi lần dữ liệu nguồn refresh).</p>
<pre><code>Các bước làm sạch Power Query điển hình:
 1. Xoá cột không dùng
 2. Đổi kiểu dữ liệu (Date, Whole Number, Text)
 3. Lọc bỏ dòng trống/lỗi
 4. Đặt lại tên cột dễ hiểu cho nghiệp vụ
 5. Close & Apply -> nạp bảng đã làm sạch vào model
</code></pre>
<h3>Dựng biểu đồ đầu tiên</h3>
<p>Kéo một trường hạng mục (vd Product) vào ô <strong>Axis</strong> và một trường số (vd Sales) vào ô <strong>Values</strong> của biểu đồ bar — Power BI tự tổng hợp (thường là SUM). Định dạng biểu đồ ở <strong>Format pane</strong>: tiêu đề, nhãn dữ liệu, màu, trục.</p>
<div class="callout"><span class="badge">Làm sạch một lần, dùng lại mãi</span> Mỗi bước Power Query đều được lưu. Khi dữ liệu nguồn refresh, chạy lại các bước làm sạch chỉ mất một click — đây là lợi ích năng suất chính so với làm sạch dữ liệu bằng tay trong Excel mỗi lần.</div>`,
  ]]);

const c4q = quiz('idv301-quiz-4', 'Quiz 4 — Power BI basics|||Quiz 4 — Power BI cơ bản', [
  { id: 'q1', question: 'Trong Power BI Desktop, nơi dùng để làm sạch và định hình lại dữ liệu TRƯỚC khi nạp vào model là gì?', options: ['Report view', 'Power Query Editor', 'Format pane', 'Model view'], correctIndex: 1, explanation: 'Power Query Editor xử lý và làm sạch dữ liệu trước khi Close & Apply nạp vào model.' },
  { id: 'q2', question: 'Lợi ích chính của việc các bước Power Query được ghi lại (recorded steps) là gì?', options: ['Biểu đồ đẹp hơn', 'Chạy lại làm sạch dữ liệu tự động mỗi khi refresh, không cần làm tay lại', 'Tăng tốc độ mạng', 'Không cần Get Data nữa'], correctIndex: 1, explanation: 'Các bước được lưu lại và áp dụng lại tự động mỗi lần dữ liệu nguồn refresh.' },
  { id: 'q3', question: 'Khi kéo một trường số vào ô Values của biểu đồ, Power BI mặc định làm gì?', options: ['Bỏ qua trường đó', 'Tự động tổng hợp (thường là SUM)', 'Xoá dữ liệu trùng', 'Chuyển thành văn bản'], correctIndex: 1, explanation: 'Power BI tự động tổng hợp trường số, mặc định là SUM (có thể đổi sang AVERAGE, COUNT...).' },
]);

const c5 = doc('idv301-5-1-powerbi-advanced', '5.1 — Power BI advanced: DAX & data relationships|||5.1 — Power BI nâng cao: DAX & quan hệ dữ liệu',
  'Mô hình dữ liệu dạng star schema (bảng fact/dimension), quan hệ 1-nhiều, measure vs calculated column, hàm DAX cơ bản (SUM, CALCULATE, FILTER).',
  [[
    `<span class="eyebrow">IDV301 · Chapter 5 · Lesson 5.1</span>
<h2>Power BI advanced: DAX &amp; data relationships</h2>
<h3>The star schema</h3>
<p>A good Power BI model separates <strong>fact tables</strong> (transactions — one row per sale, with numeric measures) from <strong>dimension tables</strong> (Product, Customer, Date — descriptive attributes to filter/group by). A <strong>one-to-many relationship</strong> connects each dimension's key to the fact table's foreign key. This "star schema" makes filters propagate correctly and keeps the model fast.</p>
<pre><code>        Dim_Product
              |
Dim_Date -- Fact_Sales -- Dim_Customer
              |
        Dim_Region
(one dimension row relates to MANY fact rows)
</code></pre>
<h3>Calculated column vs measure</h3>
<ul>
<li><strong>Calculated column</strong> — computed row-by-row, stored in the table (e.g. Profit = Sales[Revenue] − Sales[Cost]). Uses more memory; good for slicing/filtering by the result.</li>
<li><strong>Measure</strong> — computed on the fly, in the context of whatever filters are currently applied (e.g. Total Sales = SUM). Preferred for aggregations because it always respects the current filter/slicer context.</li>
</ul>
<h3>Core DAX functions</h3>
<pre><code>Total Sales := SUM('Fact_Sales'[Revenue])

Sales Last Year :=
CALCULATE(
    [Total Sales],
    SAMEPERIODLASTYEAR('Dim_Date'[Date])
)

High Value Orders :=
CALCULATE(
    [Total Sales],
    FILTER('Fact_Sales', 'Fact_Sales'[Revenue] > 1000)
)
</code></pre>
<div class="callout"><span class="badge">Filter context is everything</span> A DAX measure's result changes depending on which rows are currently visible (filters, slicers, the row/column of a table visual) — this "filter context" is the concept that makes DAX both powerful and, at first, confusing.</div>`,
    `<span class="eyebrow">IDV301 · Chương 5 · Bài 5.1</span>
<h2>Power BI nâng cao: DAX &amp; quan hệ dữ liệu</h2>
<h3>Mô hình star schema</h3>
<p>Một model Power BI tốt tách <strong>bảng fact</strong> (giao dịch — mỗi dòng là một lượt bán, kèm số liệu đo) khỏi <strong>bảng dimension</strong> (Product, Customer, Date — thuộc tính mô tả để lọc/nhóm theo). Một <strong>quan hệ một-nhiều</strong> nối khoá của mỗi dimension với khoá ngoại của bảng fact. "Star schema" này giúp filter lan truyền đúng và giữ model chạy nhanh.</p>
<pre><code>        Dim_Product
              |
Dim_Date -- Fact_Sales -- Dim_Customer
              |
        Dim_Region
(một dòng dimension liên kết với NHIỀU dòng fact)
</code></pre>
<h3>Calculated column vs measure</h3>
<ul>
<li><strong>Calculated column</strong> — tính theo từng dòng, lưu trong bảng (vd Profit = Sales[Revenue] − Sales[Cost]). Tốn nhiều bộ nhớ hơn; tốt khi cần lọc/nhóm theo kết quả đó.</li>
<li><strong>Measure</strong> — tính tại thời điểm hiển thị, theo ngữ cảnh của các filter đang áp dụng (vd Total Sales = SUM). Ưu tiên dùng cho tổng hợp vì luôn tôn trọng ngữ cảnh filter/slicer hiện tại.</li>
</ul>
<h3>Các hàm DAX cốt lõi</h3>
<pre><code>Total Sales := SUM('Fact_Sales'[Revenue])

Sales Last Year :=
CALCULATE(
    [Total Sales],
    SAMEPERIODLASTYEAR('Dim_Date'[Date])
)

High Value Orders :=
CALCULATE(
    [Total Sales],
    FILTER('Fact_Sales', 'Fact_Sales'[Revenue] > 1000)
)
</code></pre>
<div class="callout"><span class="badge">Ngữ cảnh filter là tất cả</span> Kết quả của một measure DAX thay đổi tuỳ theo dòng nào đang hiển thị (filter, slicer, dòng/cột của một table visual) — khái niệm "filter context" này khiến DAX vừa mạnh vừa gây bối rối lúc đầu.</div>`,
  ]]);

const c5q = quiz('idv301-quiz-5', 'Quiz 5 — Power BI advanced (DAX)|||Quiz 5 — Power BI nâng cao (DAX)', [
  { id: 'q1', question: 'Trong mô hình star schema, bảng chứa các giao dịch (mỗi dòng một lượt bán) gọi là gì?', options: ['Bảng dimension', 'Bảng fact', 'Bảng lookup', 'Bảng calendar'], correctIndex: 1, explanation: 'Bảng fact chứa giao dịch/số liệu đo; bảng dimension chứa thuộc tính mô tả để lọc/nhóm.' },
  { id: 'q2', question: 'Khác biệt chính giữa calculated column và measure trong DAX là gì?', options: ['Không khác gì cả', 'Calculated column tính theo dòng và lưu trong bảng; measure tính động theo ngữ cảnh filter hiện tại', 'Measure luôn chậm hơn calculated column', 'Calculated column chỉ dùng cho văn bản'], correctIndex: 1, explanation: 'Calculated column lưu sẵn theo dòng; measure tính lại theo filter context mỗi lần hiển thị.' },
  { id: 'q3', question: 'Hàm DAX nào thường dùng để thay đổi ngữ cảnh filter khi tính một measure (vd so với cùng kỳ năm trước)?', options: ['SUM', 'CALCULATE', 'CONCATENATE', 'IF'], correctIndex: 1, explanation: 'CALCULATE cho phép áp thêm/đổi điều kiện filter khi tính một measure.' },
]);

const c6 = doc('idv301-6-1-tableau', '6.1 — Tableau: interface, dimensions/measures & interactive dashboards|||6.1 — Tableau: giao diện, dimensions/measures & dashboard tương tác',
  'Giao diện Tableau (Data pane, Shelves, Marks card), phân biệt Dimensions (xanh, hạng mục) vs Measures (xanh lá, số), kéo-thả dựng worksheet, gộp nhiều worksheet vào Dashboard.',
  [[
    `<span class="eyebrow">IDV301 · Chapter 6 · Lesson 6.1</span>
<h2>Tableau: interface, dimensions/measures &amp; interactive dashboards</h2>
<h3>Dimensions vs Measures</h3>
<p>Tableau auto-classifies every field on connection: <strong>Dimensions</strong> (blue pills — categorical, e.g. Product, Region, Date-as-category) describe and slice data; <strong>Measures</strong> (green pills — numeric, e.g. Sales, Profit) are aggregated (SUM, AVG, COUNT). Most charts are built by dragging a dimension to Rows/Columns and a measure to the other axis.</p>
<h3>Shelves &amp; Marks card</h3>
<ul>
<li><strong>Rows / Columns shelves</strong> — define the axes of the view.</li>
<li><strong>Marks card</strong> — controls the visual encoding: mark type (bar, line, circle), plus Color, Size, Label, Detail, Tooltip — each is a field you can drag in.</li>
<li><strong>Filters shelf</strong> — restricts which rows are shown in this worksheet.</li>
</ul>
<h3>From worksheet to dashboard</h3>
<p>A single chart lives in a <strong>worksheet</strong>. A <strong>dashboard</strong> combines several worksheets on one canvas, plus interactive controls (filters, legends). The killer feature is <strong>Use as Filter</strong>: clicking a mark in one worksheet filters every other worksheet on the dashboard — turning static charts into a linked, explorable view.</p>
<pre><code>Worksheet 1 (Sales by Region, map)  --click a region-->
Worksheet 2 (Sales trend, line)      auto-filters to that region
Worksheet 3 (Top products, bar)      auto-filters to that region
</code></pre>
<div class="callout"><span class="badge">Design for exploration</span> A Tableau dashboard's value isn't the initial view — it's how many useful questions a reader can answer themselves by clicking, without exporting the data or asking an analyst.</div>`,
    `<span class="eyebrow">IDV301 · Chương 6 · Bài 6.1</span>
<h2>Tableau: giao diện, dimensions/measures &amp; dashboard tương tác</h2>
<h3>Dimensions vs Measures</h3>
<p>Tableau tự phân loại mỗi trường khi kết nối: <strong>Dimensions</strong> (thẻ xanh dương — hạng mục, vd Product, Region, Date dạng phân loại) mô tả và cắt lát dữ liệu; <strong>Measures</strong> (thẻ xanh lá — số, vd Sales, Profit) được tổng hợp (SUM, AVG, COUNT). Hầu hết biểu đồ được dựng bằng cách kéo một dimension vào Rows/Columns và một measure vào trục còn lại.</p>
<h3>Shelves &amp; Marks card</h3>
<ul>
<li><strong>Shelf Rows / Columns</strong> — định nghĩa trục của view.</li>
<li><strong>Marks card</strong> — điều khiển mã hoá trực quan: loại mark (bar, line, circle), cùng Color, Size, Label, Detail, Tooltip — mỗi cái là một trường có thể kéo vào.</li>
<li><strong>Shelf Filters</strong> — hạn chế dòng nào được hiển thị trong worksheet này.</li>
</ul>
<h3>Từ worksheet đến dashboard</h3>
<p>Một biểu đồ đơn nằm trong một <strong>worksheet</strong>. Một <strong>dashboard</strong> gộp nhiều worksheet trên một canvas, cùng các điều khiển tương tác (filter, legend). Tính năng đắt giá là <strong>Use as Filter</strong>: click vào một mark ở worksheet này sẽ lọc mọi worksheet khác trên dashboard — biến các biểu đồ tĩnh thành một view liên kết, khám phá được.</p>
<pre><code>Worksheet 1 (Sales by Region, map)  --click một vùng-->
Worksheet 2 (Sales trend, line)      tự lọc theo vùng đó
Worksheet 3 (Top products, bar)      tự lọc theo vùng đó
</code></pre>
<div class="callout"><span class="badge">Thiết kế để khám phá</span> Giá trị của một dashboard Tableau không nằm ở view ban đầu — mà ở việc người đọc tự trả lời được bao nhiêu câu hỏi hữu ích bằng cách click, mà không cần xuất dữ liệu hoặc hỏi lại nhà phân tích.</div>`,
  ]]);

const c6q = quiz('idv301-quiz-6', 'Quiz 6 — Tableau|||Quiz 6 — Tableau', [
  { id: 'q1', question: 'Trong Tableau, thẻ (pill) màu xanh dương thường đại diện cho loại trường nào?', options: ['Measure (số, được tổng hợp)', 'Dimension (hạng mục, mô tả)', 'Filter', 'Parameter'], correctIndex: 1, explanation: 'Dimension hiển thị màu xanh dương — trường hạng mục dùng để mô tả/cắt lát dữ liệu.' },
  { id: 'q2', question: 'Marks card trong Tableau dùng để làm gì?', options: ['Kết nối dữ liệu nguồn', 'Điều khiển mã hoá trực quan: loại mark, Color, Size, Label, Tooltip', 'Xuất báo cáo PDF', 'Tạo bảng tính mới'], correctIndex: 1, explanation: 'Marks card điều khiển cách một worksheet được vẽ: loại mark và các thuộc tính mã hoá.' },
  { id: 'q3', question: 'Tính năng nào cho phép click vào một mark ở một worksheet để tự động lọc các worksheet khác trên cùng dashboard?', options: ['Use as Filter', 'Power Query', 'CALCULATE', 'Data Blending'], correctIndex: 0, explanation: '"Use as Filter" liên kết các worksheet trong dashboard theo lựa chọn của người dùng.' },
]);

const c7 = doc('idv301-7-1-dashboard-design', '7.1 — Effective interactive dashboard design: filters & drill-down|||7.1 — Thiết kế dashboard hiệu quả & tương tác: filter & drill-down',
  'Bố cục dashboard theo thứ tự đọc mắt người (Z/F-pattern), nhóm KPI ở trên cùng, filter/slicer toàn dashboard, drill-down vs drill-through, số lượng biểu đồ tối ưu trên một màn hình.',
  [[
    `<span class="eyebrow">IDV301 · Chapter 7 · Lesson 7.1</span>
<h2>Effective interactive dashboard design: filters &amp; drill-down</h2>
<h3>Layout follows eye movement</h3>
<p>Readers scan a screen in a predictable pattern (top-left first, roughly Z or F shaped). Put the <strong>most important KPIs top-left</strong>, supporting detail below/right, and keep the whole story visible without scrolling when possible — Stephen Few's research on dashboard design (<em>Now You See It</em>) is the syllabus reference here.</p>
<h3>Filters and slicers</h3>
<p>A dashboard-level filter (date range, region, product category) narrows every visual on the page at once — this is what makes a dashboard <em>interactive</em> rather than a static report. Default filters to a sensible starting view (e.g. "This Year") so the first thing a viewer sees is already useful.</p>
<h3>Drill-down vs drill-through</h3>
<ul>
<li><strong>Drill-down</strong> — expand a hierarchy IN PLACE on the same visual (Year → Quarter → Month) without leaving the page.</li>
<li><strong>Drill-through</strong> — click a data point to jump to a DIFFERENT, more detailed page filtered to that context (e.g. click a region on the summary page to open a region-detail page).</li>
</ul>
<pre><code>Summary dashboard (Region-level KPIs)
      --drill-through on a region-->
Detail page (that region's products, customers, trend)
</code></pre>
<h3>Don't overload one screen</h3>
<p>A common failure is packing 10+ charts on one dashboard "to show everything" — this defeats the point. Few charts per screen, each answering a clear question, linked by filters, beats one dense screen every time.</p>
<div class="callout"><span class="badge">Test with a stranger</span> Show the dashboard to someone unfamiliar with it and time how long it takes them to answer "what's the single most important thing here?" — if it's more than a few seconds, redesign.</div>`,
    `<span class="eyebrow">IDV301 · Chương 7 · Bài 7.1</span>
<h2>Thiết kế dashboard hiệu quả &amp; tương tác: filter &amp; drill-down</h2>
<h3>Bố cục theo đường đi của mắt</h3>
<p>Người đọc quét màn hình theo một mẫu hình có thể đoán được (trên-trái trước, đại khái hình Z hoặc F). Đặt <strong>KPI quan trọng nhất ở trên-trái</strong>, chi tiết hỗ trợ ở dưới/bên phải, và giữ toàn bộ câu chuyện nằm trong tầm nhìn không cần cuộn khi có thể — nghiên cứu của Stephen Few về thiết kế dashboard (<em>Now You See It</em>) là tài liệu tham khảo ở đây.</p>
<h3>Filter và slicer</h3>
<p>Một filter cấp dashboard (khoảng ngày, vùng, hạng mục sản phẩm) thu hẹp mọi biểu đồ trên trang cùng lúc — đây là điều biến một dashboard thành <em>tương tác</em> thay vì một báo cáo tĩnh. Đặt filter mặc định về một view khởi đầu hợp lý (vd "Năm nay") để thứ đầu tiên người xem thấy đã có ích.</p>
<h3>Drill-down vs drill-through</h3>
<ul>
<li><strong>Drill-down</strong> — mở rộng một hệ thứ bậc NGAY TẠI CHỖ trên cùng biểu đồ (Năm → Quý → Tháng) mà không rời trang.</li>
<li><strong>Drill-through</strong> — click vào một điểm dữ liệu để nhảy tới một trang KHÁC, chi tiết hơn, đã lọc theo ngữ cảnh đó (vd click một vùng ở trang tổng quan để mở trang chi tiết vùng đó).</li>
</ul>
<pre><code>Dashboard tổng quan (KPI theo vùng)
      --drill-through vào một vùng-->
Trang chi tiết (sản phẩm, khách hàng, xu hướng của vùng đó)
</code></pre>
<h3>Đừng nhồi quá nhiều vào một màn hình</h3>
<p>Lỗi thường gặp là nhồi 10+ biểu đồ vào một dashboard "để thấy hết mọi thứ" — điều này phản tác dụng. Ít biểu đồ mỗi màn hình, mỗi cái trả lời rõ một câu hỏi, liên kết bằng filter, luôn tốt hơn một màn hình dày đặc.</p>
<div class="callout"><span class="badge">Kiểm bằng người lạ</span> Cho một người chưa từng thấy dashboard xem, đo thời gian họ trả lời "thứ quan trọng nhất ở đây là gì?" — nếu hơn vài giây, hãy thiết kế lại.</div>`,
  ]]);

const c7q = quiz('idv301-quiz-7', 'Quiz 7 — Dashboard design|||Quiz 7 — Thiết kế dashboard', [
  { id: 'q1', question: 'Khác biệt giữa drill-down và drill-through là gì?', options: ['Không khác gì cả', 'Drill-down mở rộng hệ thứ bậc ngay tại chỗ; drill-through nhảy sang một trang chi tiết khác', 'Drill-through luôn nhanh hơn drill-down', 'Drill-down chỉ dùng cho pie chart'], correctIndex: 1, explanation: 'Drill-down ở lại cùng visual/trang; drill-through chuyển sang trang khác đã lọc theo ngữ cảnh.' },
  { id: 'q2', question: 'Theo nguyên tắc bố cục dashboard, KPI quan trọng nhất nên đặt ở đâu?', options: ['Góc dưới-phải', 'Góc trên-trái, theo đường quét mắt tự nhiên', 'Giữa trang, cỡ chữ nhỏ', 'Không quan trọng vị trí'], correctIndex: 1, explanation: 'Người đọc quét màn hình theo mẫu Z/F, bắt đầu từ trên-trái — nơi cần đặt thông tin quan trọng nhất.' },
  { id: 'q3', question: 'Vì sao nhồi 10+ biểu đồ vào một dashboard thường phản tác dụng?', options: ['Vì máy sẽ hết dung lượng lưu trữ', 'Vì làm loãng trọng tâm, người xem khó tìm ra điều quan trọng nhất', 'Vì Power BI/Tableau giới hạn số biểu đồ', 'Vì màu sắc sẽ trùng nhau'], correctIndex: 1, explanation: 'Quá nhiều biểu đồ làm mất trọng tâm — ít biểu đồ rõ câu hỏi, liên kết filter, hiệu quả hơn.' },
]);

const c8 = doc('idv301-8-1-storytelling', '8.1 — Data storytelling: presenting insight to executives|||8.1 — Data storytelling: trình bày insight cho lãnh đạo',
  'Cấu trúc kể chuyện bằng dữ liệu của Knaflic (bối cảnh → xung đột → giải pháp), một insight rõ ràng mỗi slide, dùng preattentive attributes để dẫn mắt, "so what?" test trước khi trình bày.',
  [[
    `<span class="eyebrow">IDV301 · Chapter 8 · Lesson 8.1</span>
<h2>Data storytelling: presenting insight to executives</h2>
<h3>From dashboard to story</h3>
<p>A dashboard is for <strong>exploration</strong> — a viewer clicks around to find their own answer. A story is for <strong>persuasion</strong> — you already know the answer and must lead a busy executive to the same conclusion in minutes, without them clicking anything. These require different design choices, per Cole Nussbaumer Knaflic's <em>Storytelling with Data</em>.</p>
<h3>Narrative structure</h3>
<pre><code>Setting (context)  -> What's the business situation? Why does it matter now?
Conflict (tension)  -> What's the problem/opportunity the data reveals?
Resolution (call to action) -> What decision or action does this support?
</code></pre>
<h3>One idea per slide</h3>
<p>Each slide/chart should make exactly ONE point. Give it a plain-language, conclusion-style title ("Retention dropped 12% after the price change" — not "Retention by Month"). Strip every element that doesn't support that one point; highlight the key number with a preattentive attribute (color, bold) so the eye lands there first.</p>
<h3>The "so what?" test</h3>
<p>Before presenting any chart, ask: if the audience sees only this one visual for 3 seconds, what decision or action follows? If the answer is "nothing, it's just information," the chart isn't ready for an executive audience — it belongs in an appendix, not the main story.</p>
<div class="callout"><span class="badge">Executives buy conclusions, not charts</span> A senior audience wants the takeaway and the recommended action first; the supporting chart earns its place only if it makes that takeaway undeniable at a glance.</div>`,
    `<span class="eyebrow">IDV301 · Chương 8 · Bài 8.1</span>
<h2>Data storytelling: trình bày insight cho lãnh đạo</h2>
<h3>Từ dashboard đến câu chuyện</h3>
<p>Dashboard dành cho <strong>khám phá</strong> — người xem tự click để tìm câu trả lời của riêng họ. Câu chuyện dành cho <strong>thuyết phục</strong> — bạn đã biết câu trả lời và phải dẫn một lãnh đạo bận rộn tới cùng kết luận trong vài phút, mà họ không cần click gì cả. Hai mục đích này cần lựa chọn thiết kế khác nhau, theo <em>Storytelling with Data</em> của Cole Nussbaumer Knaflic.</p>
<h3>Cấu trúc kể chuyện</h3>
<pre><code>Bối cảnh (setting)  -> Tình huống kinh doanh là gì? Vì sao quan trọng lúc này?
Xung đột (conflict)  -> Vấn đề/cơ hội mà dữ liệu hé lộ là gì?
Giải pháp (call to action) -> Quyết định/hành động nào được ủng hộ?
</code></pre>
<h3>Một ý mỗi slide</h3>
<p>Mỗi slide/biểu đồ nên chỉ nêu đúng MỘT điểm. Đặt tiêu đề dạng kết luận, ngôn ngữ thường ("Tỉ lệ giữ chân giảm 12% sau khi đổi giá" — không phải "Tỉ lệ giữ chân theo tháng"). Loại bỏ mọi yếu tố không hỗ trợ điểm đó; làm nổi số liệu chính bằng thuộc tính tiền chú ý (màu, đậm) để mắt rơi vào đó trước tiên.</p>
<h3>Phép thử "so what?"</h3>
<p>Trước khi trình bày bất kỳ biểu đồ nào, hỏi: nếu người nghe chỉ thấy đúng biểu đồ này trong 3 giây, quyết định hay hành động nào theo sau? Nếu câu trả lời là "không gì cả, chỉ là thông tin", biểu đồ chưa sẵn sàng cho lãnh đạo — nó thuộc phần phụ lục, không phải câu chuyện chính.</p>
<div class="callout"><span class="badge">Lãnh đạo mua kết luận, không mua biểu đồ</span> Người nghe cấp cao muốn nghe kết luận và hành động đề xuất trước; biểu đồ hỗ trợ chỉ đáng có mặt nếu nó khiến kết luận đó hiển nhiên chỉ với một cái nhìn.</div>`,
  ]]);

const c8q = quiz('idv301-quiz-8', 'Quiz 8 — Data storytelling|||Quiz 8 — Kể chuyện bằng dữ liệu', [
  { id: 'q1', question: 'Khác biệt chính giữa một dashboard (khám phá) và một câu chuyện dữ liệu (thuyết phục) là gì?', options: ['Không có khác biệt', 'Dashboard để người xem tự khám phá; câu chuyện dẫn người nghe tới một kết luận đã biết trước', 'Câu chuyện luôn dùng nhiều màu hơn', 'Dashboard chỉ dùng cho Power BI'], correctIndex: 1, explanation: 'Dashboard phục vụ khám phá tự do; câu chuyện dữ liệu dẫn dắt tới một kết luận cụ thể.' },
  { id: 'q2', question: 'Theo nguyên tắc "một ý mỗi slide", tiêu đề slide nên viết theo dạng nào?', options: ['Tên trường dữ liệu kỹ thuật (vd "Retention by Month")', 'Kết luận bằng ngôn ngữ thường (vd "Tỉ lệ giữ chân giảm 12% sau khi đổi giá")', 'Chỉ để trống, không cần tiêu đề', 'Câu hỏi mở không có đáp án'], correctIndex: 1, explanation: 'Tiêu đề dạng kết luận giúp người xem nắm ngay điểm chính mà không cần tự diễn giải biểu đồ.' },
  { id: 'q3', question: 'Phép thử "so what?" dùng để làm gì trước khi trình bày một biểu đồ cho lãnh đạo?', options: ['Kiểm tra màu sắc có đẹp không', 'Kiểm tra xem biểu đồ có dẫn tới một quyết định/hành động rõ ràng không', 'Kiểm tra tốc độ tải trang', 'Kiểm tra số lượng dòng dữ liệu'], correctIndex: 1, explanation: 'Nếu biểu đồ không dẫn tới hành động/quyết định nào, nó chưa sẵn sàng cho phần trình bày chính.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'IDV301',
    slug: 'idv301-interactive-data-visualization-for-business-analytics',
    title: 'Interactive Data Visualization for Business Analytics',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/IDV301.webp',
    shortDescription: 'Turn data into insight people act on — visual perception, chart selection, data-ink ratio, Power BI (Power Query, DAX), Tableau dashboards, filters/drill-down, data storytelling for executives. Bilingual, with quizzes.|||Biến dữ liệu thành insight khiến người khác hành động — nhận thức thị giác, chọn biểu đồ, tỉ lệ data-ink, Power BI (Power Query, DAX), dashboard Tableau, filter/drill-down, kể chuyện dữ liệu cho lãnh đạo. Song ngữ, có quiz.',
    description: 'Môn <strong>IDV301 — Interactive Data Visualization for Business Analytics</strong> (kỳ 5) dạy cách biến dữ liệu thành <strong>hình ảnh người khác hiểu và hành động theo</strong>. Từ <strong>nhận thức thị giác &amp; nguyên lý Gestalt</strong> → <strong>chọn loại biểu đồ phù hợp</strong> → <strong>nguyên tắc thiết kế</strong> (tỉ lệ data-ink, tránh biểu đồ gây hiểu lầm) → <strong>Power BI cơ bản</strong> (Get Data, Power Query) → <strong>Power BI nâng cao</strong> (DAX, quan hệ dữ liệu star schema) → <strong>Tableau &amp; dashboard tương tác</strong> → <strong>thiết kế dashboard hiệu quả</strong> (filter, drill-down) → <strong>data storytelling</strong> cho lãnh đạo. Bám giáo trình FLM, trích dẫn Tufte, Knaflic, Few; song ngữ, có ví dụ cấu hình biểu đồ/DAX và quiz mỗi chương.',
    whatYouLearn: 'Preattentive attributes & nguyên lý Gestalt; thang đo chính xác nhận thức Cleveland-McGill; chọn loại biểu đồ theo câu hỏi (so sánh/xu hướng/phân phối/quan hệ/thành phần); tỉ lệ data-ink & chartjunk; bẫy biểu đồ gây hiểu lầm (trục cắt, trục kép, diện tích sai); Power BI: Get Data, Power Query, Report/Data/Model view; DAX (measure vs calculated column, CALCULATE, FILTER), star schema; Tableau: dimensions/measures, Marks card, Use as Filter; thiết kế dashboard (bố cục, filter, drill-down/drill-through); data storytelling (cấu trúc bối cảnh-xung đột-giải pháp, "so what?" test).',
    requirements: 'Kiến thức Excel cơ bản (bảng, công thức đơn giản). Nên cài Power BI Desktop (miễn phí) và có thể dùng Tableau Public (miễn phí) để thực hành.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách kinh điển (Tufte, Knaflic, Few), tài liệu Power BI/Tableau, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Vì sao trực quan hoá dữ liệu quan trọng, lộ trình môn.', lessons: [intro] },
    { title: 'Chương 1 — Nhận thức thị giác|||Chapter 1 — Visual perception', description: 'Preattentive attributes, Gestalt, thang đo Cleveland-McGill.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Chọn loại biểu đồ|||Chapter 2 — Chart selection', description: 'Khớp biểu đồ với câu hỏi; biểu đồ cần thận trọng.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Nguyên tắc thiết kế|||Chapter 3 — Design principles', description: 'Tỉ lệ data-ink, chartjunk, bẫy gây hiểu lầm.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Power BI cơ bản|||Chapter 4 — Power BI basics', description: 'Get Data, Power Query, biểu đồ đầu tiên.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Power BI nâng cao|||Chapter 5 — Power BI advanced', description: 'DAX, star schema, quan hệ dữ liệu.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Tableau|||Chapter 6 — Tableau', description: 'Dimensions/measures, Marks card, dashboard tương tác.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Thiết kế dashboard tương tác|||Chapter 7 — Interactive dashboard design', description: 'Bố cục, filter, drill-down/drill-through.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Data storytelling|||Chapter 8 — Data storytelling', description: 'Kể chuyện bằng dữ liệu, "so what?" test.', lessons: [c8, c8q] },
  ],
};
