/**
 * DID301 — Data Visualization & Infographic Design. Ngành Thiết kế mỹ thuật số
 * (FPTU), Kỳ 7. Khung chất lượng 8 chương: data viz là gì → nhận thức thị giác
 * → chọn biểu đồ → nguyên tắc thiết kế (Tufte) → màu & typography → kể chuyện
 * bằng dữ liệu (Knaflic) → infographic → công cụ & dashboard. Sách chuẩn:
 * Knaflic "Storytelling with Data", Cairo "The Functional Art", Tufte "The
 * Visual Display of Quantitative Information". Song ngữ + ví dụ biểu đồ thật.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG ${ lồng trong HTML; "&"→"&amp;".
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('did301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn quốc tế (Knaflic, Cairo, Tufte), công cụ (Flourish/Datawrapper/Tableau), lộ trình tự học 4 bước.',
  [[
    `<span class="eyebrow">DID301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>data visualization &amp; infographic design</strong> in one place — from visual perception to storytelling and dashboards. The full official slides &amp; syllabus live on <strong>FLM</strong>; below are the canonical books and free, legal tools.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>The official FPTU syllabus &amp; lecture slides for DID301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Core books</h3>
<ul>
<li><a href="https://www.storytellingwithdata.com/books" target="_blank" rel="noopener">Cole Nussbaumer Knaflic — <em>Storytelling with Data</em></a> — the practical guide to turning charts into a message.</li>
<li><a href="http://www.thefunctionalart.com/" target="_blank" rel="noopener">Alberto Cairo — <em>The Functional Art</em></a> — perception, truthfulness &amp; the craft of visual explanation.</li>
<li><a href="https://www.edwardtufte.com/book/the-visual-display-of-quantitative-information/" target="_blank" rel="noopener">Edward Tufte — <em>The Visual Display of Quantitative Information</em></a> — data-ink, chartjunk, graphical excellence.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://flourish.studio/" target="_blank" rel="noopener">Flourish</a> — story-driven charts &amp; animated visuals in the browser.</li>
<li><a href="https://www.datawrapper.de/" target="_blank" rel="noopener">Datawrapper</a> — fast, honest charts &amp; maps used by newsrooms.</li>
<li><a href="https://www.tableau.com/products/public" target="_blank" rel="noopener">Tableau Public</a> — free interactive dashboards.</li>
<li><a href="https://colorbrewer2.org/" target="_blank" rel="noopener">ColorBrewer</a> — safe sequential/diverging palettes for maps &amp; charts.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>See clearly</strong> — visual perception, preattentive attributes, how the eye reads encodings.</li>
<li><strong>Chart right</strong> — pick the chart for the data &amp; question; apply Tufte's data-ink discipline.</li>
<li><strong>Tell a story</strong> — context, focus, annotation; make one point per chart (Knaflic).</li>
<li><strong>Ship it</strong> — build infographics &amp; interactive dashboards in Flourish/Datawrapper/Tableau — honestly.</li>
</ol></div>`,
    `<span class="eyebrow">DID301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>trực quan hoá dữ liệu &amp; thiết kế infographic</strong> gom về một chỗ — từ nhận thức thị giác đến kể chuyện và dashboard. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là các sách kinh điển và công cụ miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của DID301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách nền tảng</h3>
<ul>
<li><a href="https://www.storytellingwithdata.com/books" target="_blank" rel="noopener">Cole Nussbaumer Knaflic — <em>Storytelling with Data</em></a> — cẩm nang biến biểu đồ thành thông điệp.</li>
<li><a href="http://www.thefunctionalart.com/" target="_blank" rel="noopener">Alberto Cairo — <em>The Functional Art</em></a> — nhận thức, sự trung thực &amp; nghề giải thích bằng hình.</li>
<li><a href="https://www.edwardtufte.com/book/the-visual-display-of-quantitative-information/" target="_blank" rel="noopener">Edward Tufte — <em>The Visual Display of Quantitative Information</em></a> — data-ink, chartjunk, sự xuất sắc đồ hoạ.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://flourish.studio/" target="_blank" rel="noopener">Flourish</a> — biểu đồ kể chuyện &amp; hình động trên trình duyệt.</li>
<li><a href="https://www.datawrapper.de/" target="_blank" rel="noopener">Datawrapper</a> — biểu đồ &amp; bản đồ nhanh, trung thực, được toà soạn dùng.</li>
<li><a href="https://www.tableau.com/products/public" target="_blank" rel="noopener">Tableau Public</a> — dashboard tương tác miễn phí.</li>
<li><a href="https://colorbrewer2.org/" target="_blank" rel="noopener">ColorBrewer</a> — bảng màu sequential/diverging an toàn cho bản đồ &amp; biểu đồ.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nhìn cho rõ</strong> — nhận thức thị giác, thuộc tính tiền chú ý, cách mắt đọc mã hoá.</li>
<li><strong>Chọn đúng biểu đồ</strong> — chọn biểu đồ theo dữ liệu &amp; câu hỏi; áp kỷ luật data-ink của Tufte.</li>
<li><strong>Kể một câu chuyện</strong> — ngữ cảnh, điểm nhấn, annotation; mỗi biểu đồ một thông điệp (Knaflic).</li>
<li><strong>Xuất bản</strong> — dựng infographic &amp; dashboard tương tác bằng Flourish/Datawrapper/Tableau — một cách trung thực.</li>
</ol></div>`,
  ]]);

const intro = doc('did301-0-1-overview', 'Course overview: Data visualization & infographic design|||Tổng quan: Trực quan hoá dữ liệu & thiết kế infographic',
  'Data viz làm gì; từ dữ liệu thô tới hình có nghĩa; lộ trình: nhận thức → chọn biểu đồ → nguyên tắc thiết kế → màu/chữ → kể chuyện → infographic → dashboard.',
  [[
    `<span class="eyebrow">DID301 · Lesson 0.1 · Overview</span>
<h2>Data Visualization &amp; Infographic Design</h2>
<p class="lead">This course teaches you to <strong>turn data into images people understand and trust</strong>. You will learn how the eye reads a chart, how to choose the right chart, how to design it cleanly, and how to wrap it in a story — the craft behind reports, infographics and dashboards.</p>
<h3>Why it matters</h3>
<p>A spreadsheet hides its meaning; a good chart reveals it in a second. Visualization works because it offloads thinking onto the <strong>visual system</strong> — we spot a trend, an outlier or a gap far faster in a picture than in a table. But a careless chart can also mislead, so the discipline is equal parts design and honesty.</p>
<h3>Roadmap</h3>
<p>Perception &amp; encoding → choosing charts → design principles (Tufte's data-ink) → colour &amp; typography → storytelling with data (Knaflic) → infographic design → tools &amp; dashboards. Bilingual, with real chart examples and a quiz each chapter.</p>
<div class="callout"><span class="badge">One idea to keep</span> A visualization is not decoration for data — it is an <em>argument</em> made with data. Every mark should earn its place.</div>`,
    `<span class="eyebrow">DID301 · Bài 0.1 · Tổng quan</span>
<h2>Trực quan hoá dữ liệu &amp; thiết kế infographic</h2>
<p class="lead">Môn này dạy bạn <strong>biến dữ liệu thành hình mà người ta hiểu và tin</strong>. Bạn sẽ học mắt đọc một biểu đồ thế nào, chọn đúng loại biểu đồ ra sao, thiết kế nó gọn gàng, và gói nó trong một câu chuyện — tay nghề đằng sau báo cáo, infographic và dashboard.</p>
<h3>Vì sao quan trọng</h3>
<p>Một bảng tính giấu đi ý nghĩa; một biểu đồ tốt phơi nó ra trong một giây. Trực quan hoá hiệu quả vì nó chuyển việc suy nghĩ sang <strong>hệ thị giác</strong> — ta nhận ra xu hướng, điểm bất thường hay khoảng trống trong hình nhanh hơn nhiều so với trong bảng. Nhưng một biểu đồ cẩu thả cũng có thể đánh lừa, nên nghề này vừa là thiết kế vừa là sự trung thực.</p>
<h3>Lộ trình</h3>
<p>Nhận thức &amp; mã hoá → chọn biểu đồ → nguyên tắc thiết kế (data-ink của Tufte) → màu &amp; typography → kể chuyện bằng dữ liệu (Knaflic) → thiết kế infographic → công cụ &amp; dashboard. Song ngữ, có ví dụ biểu đồ thật và quiz mỗi chương.</p>
<div class="callout"><span class="badge">Một ý cần nhớ</span> Trực quan hoá không phải trang trí cho dữ liệu — nó là một <em>lập luận</em> làm bằng dữ liệu. Mỗi nét vẽ phải xứng đáng có mặt.</div>`,
  ]]);

const c1 = doc('did301-1-1-what-is-dataviz', '1.1 — What is data visualization?|||1.1 — Trực quan hoá dữ liệu là gì?',
  'Định nghĩa data viz; vì sao trực quan hoá; quy trình từ dữ liệu tới hình (câu hỏi → dữ liệu → mã hoá → biểu đồ → đọc); ví dụ dịch tễ của John Snow.',
  [[
    `<span class="eyebrow">DID301 · Chapter 1 · Lesson 1.1</span>
<h2>What is data visualization?</h2>
<p><strong>Data visualization</strong> is the representation of data through visual elements — position, length, colour, shape — so a viewer can perceive patterns, comparisons and relationships. It sits between <em>statistics</em> (what the numbers say) and <em>graphic design</em> (how to show it).</p>
<h3>Why visualize at all?</h3>
<ul>
<li><strong>Speed</strong> — the eye reads a trend line faster than a column of numbers.</li>
<li><strong>Pattern &amp; outlier detection</strong> — clusters, gaps and spikes jump out visually.</li>
<li><strong>Memory &amp; persuasion</strong> — a clear picture is remembered and shared.</li>
</ul>
<h3>From data to picture — the pipeline</h3>
<pre><code>Question   -> what do we want to know?
Data       -> clean, shape, choose the variables
Encoding   -> map each variable to a visual channel
Chart      -> render (bar, line, map...)
Read       -> does it answer the question honestly?
</code></pre>
<p>A classic example: in 1854 <strong>John Snow</strong> plotted cholera deaths as dots on a London street map. The dots clustered around one water pump on Broad Street — the map made the source of the outbreak visible in a way a table of addresses never could.</p>
<div class="callout"><span class="badge">Design ↔ data</span> Good visualization starts from the <em>question</em>, not from the chart type. Pick the picture that answers what the reader actually asked.</div>`,
    `<span class="eyebrow">DID301 · Chương 1 · Bài 1.1</span>
<h2>Trực quan hoá dữ liệu là gì?</h2>
<p><strong>Trực quan hoá dữ liệu</strong> là biểu diễn dữ liệu qua các yếu tố thị giác — vị trí, độ dài, màu, hình dạng — để người xem nhận ra mẫu hình, so sánh và mối quan hệ. Nó nằm giữa <em>thống kê</em> (con số nói gì) và <em>thiết kế đồ hoạ</em> (trình bày thế nào).</p>
<h3>Vì sao phải trực quan hoá?</h3>
<ul>
<li><strong>Tốc độ</strong> — mắt đọc một đường xu hướng nhanh hơn một cột số.</li>
<li><strong>Bắt mẫu &amp; điểm lạ</strong> — cụm, khoảng trống, đột biến hiện ra bằng mắt.</li>
<li><strong>Ghi nhớ &amp; thuyết phục</strong> — một hình rõ ràng được nhớ và được chia sẻ.</li>
</ul>
<h3>Từ dữ liệu tới hình — quy trình</h3>
<pre><code>Câu hỏi   -> ta muốn biết điều gì?
Dữ liệu   -> làm sạch, định hình, chọn biến
Mã hoá    -> ánh xạ mỗi biến vào một kênh thị giác
Biểu đồ   -> vẽ ra (cột, đường, bản đồ...)
Đọc       -> có trả lời câu hỏi một cách trung thực không?
</code></pre>
<p>Ví dụ kinh điển: năm 1854 <strong>John Snow</strong> chấm các ca tử vong do tả thành chấm trên bản đồ phố London. Các chấm tụ quanh một cây bơm nước ở phố Broad — bản đồ làm nguồn dịch hiện ra theo cách mà một bảng địa chỉ không bao giờ làm được.</p>
<div class="callout"><span class="badge">Thiết kế ↔ dữ liệu</span> Trực quan hoá tốt bắt đầu từ <em>câu hỏi</em>, không phải từ loại biểu đồ. Chọn hình trả lời đúng điều người đọc thật sự hỏi.</div>`,
  ]]);

const c1q = quiz('did301-quiz-1', 'Quiz 1 — What is data viz|||Quiz 1 — Data viz là gì', [
  { id: 'q1', question: 'Trực quan hoá dữ liệu chủ yếu làm gì?', options: ['Trang trí cho báo cáo đẹp hơn', 'Biểu diễn dữ liệu qua yếu tố thị giác để thấy mẫu/so sánh', 'Thay thế hoàn toàn thống kê', 'Nén dữ liệu cho nhỏ lại'], correctIndex: 1, explanation: 'Data viz ánh xạ dữ liệu vào kênh thị giác để mắt nhận ra mẫu, so sánh, quan hệ.' },
  { id: 'q2', question: 'Bước ĐẦU TIÊN đúng trong quy trình từ dữ liệu tới hình?', options: ['Chọn màu đẹp', 'Chọn loại biểu đồ trước', 'Xác định câu hỏi cần trả lời', 'Xuất file PNG'], correctIndex: 2, explanation: 'Bắt đầu từ câu hỏi, rồi mới tới dữ liệu, mã hoá, biểu đồ.' },
  { id: 'q3', question: 'Bản đồ dịch tả của John Snow (1854) minh hoạ điều gì?', options: ['Hình có thể phơi bày mẫu mà bảng số giấu đi', 'Màu sắc quan trọng hơn dữ liệu', '3D luôn tốt hơn 2D', 'Càng nhiều chú giải càng tốt'], correctIndex: 0, explanation: 'Chấm ca tử vong trên bản đồ làm lộ nguồn dịch quanh một cây bơm — điều bảng địa chỉ không cho thấy.' },
]);

const c2 = doc('did301-2-1-perception-encoding', '2.1 — Visual perception & encoding|||2.1 — Nhận thức thị giác & mã hoá',
  'Nhận thức thị giác; thuộc tính tiền chú ý (preattentive); thang chính xác của kênh mã hoá (vị trí > độ dài > góc > diện tích > màu); Gestalt.',
  [[
    `<span class="eyebrow">DID301 · Chapter 2 · Lesson 2.1</span>
<h2>Visual perception &amp; encoding</h2>
<p>Charts work because of how the brain sees. <strong>Preattentive attributes</strong> are visual properties we detect in under 250&nbsp;ms, before conscious attention — colour, size, orientation, position. One red dot among grey dots is found instantly; that is the mechanism behind every good highlight.</p>
<h3>Encoding channels are not equal</h3>
<p>Cleveland &amp; McGill ranked how <em>accurately</em> we read each visual channel for quantities. Roughly, most accurate first:</p>
<pre><code>Position on a common scale   (most accurate)
Length
Angle / slope
Area
Colour shade / density        (least accurate)
</code></pre>
<p>This is <em>why</em> a bar chart (length + common baseline) beats a pie chart (angle/area) for precise comparison — we simply judge length better than angle.</p>
<h3>Gestalt grouping</h3>
<p>The eye organises marks automatically: things that are <strong>near</strong>, <strong>similar</strong>, <strong>aligned</strong> or <strong>enclosed</strong> read as a group. Use proximity and alignment to build structure, not boxes and lines.</p>
<div class="callout"><span class="badge">Practical rule</span> Encode your most important quantity with position or length, and reserve colour for categories or one deliberate highlight — never as your only signal.</div>`,
    `<span class="eyebrow">DID301 · Chương 2 · Bài 2.1</span>
<h2>Nhận thức thị giác &amp; mã hoá</h2>
<p>Biểu đồ hiệu quả nhờ cách bộ não nhìn. <strong>Thuộc tính tiền chú ý (preattentive)</strong> là tính chất thị giác ta nhận ra trong chưa tới 250&nbsp;ms, trước khi chú ý có ý thức — màu, kích thước, hướng, vị trí. Một chấm đỏ giữa các chấm xám được tìm thấy ngay lập tức; đó là cơ chế sau mọi cú làm nổi bật tốt.</p>
<h3>Các kênh mã hoá KHÔNG bằng nhau</h3>
<p>Cleveland &amp; McGill xếp hạng độ <em>chính xác</em> khi ta đọc từng kênh thị giác cho lượng. Đại khái, chính xác nhất trước:</p>
<pre><code>Vị trí trên cùng một thang    (chính xác nhất)
Độ dài
Góc / độ dốc
Diện tích
Sắc độ / mật độ màu           (kém chính xác nhất)
</code></pre>
<p>Đây là <em>lý do</em> biểu đồ cột (độ dài + chung một gốc) thắng biểu đồ tròn (góc/diện tích) khi cần so sánh chính xác — ta phán đoán độ dài giỏi hơn góc.</p>
<h3>Nhóm Gestalt</h3>
<p>Mắt tự tổ chức các nét: thứ <strong>gần nhau</strong>, <strong>giống nhau</strong>, <strong>thẳng hàng</strong> hay <strong>được bao</strong> đều đọc thành một nhóm. Dùng sự gần kề và canh hàng để tạo cấu trúc, đừng dùng khung và đường kẻ.</p>
<div class="callout"><span class="badge">Quy tắc thực dụng</span> Mã hoá lượng quan trọng nhất bằng vị trí hoặc độ dài, và dành màu cho phân loại hoặc một điểm nhấn có chủ đích — đừng để màu là tín hiệu duy nhất.</div>`,
  ]]);

const c2q = quiz('did301-quiz-2', 'Quiz 2 — Perception & encoding|||Quiz 2 — Nhận thức & mã hoá', [
  { id: 'q1', question: 'Thuộc tính "tiền chú ý" (preattentive) là gì?', options: ['Thứ chỉ chuyên gia mới thấy', 'Tính chất thị giác não nhận ra trong chưa tới ~250ms', 'Loại phông chữ trang trọng', 'Cỡ file của biểu đồ'], correctIndex: 1, explanation: 'Preattentive: màu/kích thước/hướng/vị trí được nhận ra gần như tức thì, trước chú ý có ý thức.' },
  { id: 'q2', question: 'Theo Cleveland & McGill, kênh nào đọc lượng CHÍNH XÁC nhất?', options: ['Sắc độ màu', 'Diện tích', 'Vị trí trên cùng một thang', 'Góc'], correctIndex: 2, explanation: 'Thang chính xác: vị trí > độ dài > góc > diện tích > màu.' },
  { id: 'q3', question: 'Vì sao biểu đồ cột thường tốt hơn biểu đồ tròn khi so sánh chính xác?', options: ['Cột mã hoá bằng độ dài/gốc chung, ta đọc giỏi hơn góc/diện tích', 'Cột luôn nhiều màu hơn', 'Tròn tốn mực hơn', 'Cột trông hiện đại hơn'], correctIndex: 0, explanation: 'Cột dùng độ dài trên gốc chung; mắt phán đoán độ dài chính xác hơn góc của hình tròn.' },
]);

const c3 = doc('did301-3-1-choosing-charts', '3.1 — Choosing the right chart|||3.1 — Chọn biểu đồ đúng',
  'Loại biểu đồ (bar, line, pie, scatter, area, map...) và mục đích của từng loại; chọn theo dữ liệu và câu hỏi (so sánh/xu hướng/phân bố/quan hệ/thành phần).',
  [[
    `<span class="eyebrow">DID301 · Chapter 3 · Lesson 3.1</span>
<h2>Choosing the right chart</h2>
<p>Pick the chart from the <strong>question</strong>, then check the <strong>data type</strong> (categorical vs. continuous, one variable vs. many). Most needs fall into five families:</p>
<ul>
<li><strong>Comparison</strong> — <em>bar chart</em> (categories side by side). Horizontal bars for long labels.</li>
<li><strong>Trend over time</strong> — <em>line chart</em> (continuous time on the x-axis).</li>
<li><strong>Part-to-whole</strong> — <em>stacked bar</em> or, sparingly, a <em>pie</em> (only for a few slices).</li>
<li><strong>Relationship</strong> — <em>scatter plot</em> (two numeric variables; add colour/size for a third).</li>
<li><strong>Distribution</strong> — <em>histogram</em> or <em>box plot</em> (shape and spread of one variable).</li>
</ul>
<h3>Worked choice</h3>
<pre><code>Q: "How did monthly revenue change this year?"  -> line chart
Q: "Which region sold the most?"                 -> bar chart
Q: "Does ad spend relate to sales?"              -> scatter plot
Q: "What is our budget split?"                   -> stacked bar (or pie, 3-4 slices)
</code></pre>
<p><strong>Pie warning:</strong> a pie is only readable with two or three slices of clearly different size. Beyond that, angles blur together — switch to a sorted bar chart.</p>
<div class="callout"><span class="badge">Rule of thumb</span> If you cannot say in one sentence what the chart should let the reader compare or see, you have not chosen the chart yet — you have only chosen a shape.</div>`,
    `<span class="eyebrow">DID301 · Chương 3 · Bài 3.1</span>
<h2>Chọn biểu đồ đúng</h2>
<p>Chọn biểu đồ từ <strong>câu hỏi</strong>, rồi kiểm <strong>kiểu dữ liệu</strong> (phân loại hay liên tục, một biến hay nhiều biến). Đa số nhu cầu rơi vào năm nhóm:</p>
<ul>
<li><strong>So sánh</strong> — <em>biểu đồ cột</em> (các nhóm cạnh nhau). Cột ngang khi nhãn dài.</li>
<li><strong>Xu hướng theo thời gian</strong> — <em>biểu đồ đường</em> (thời gian liên tục trên trục x).</li>
<li><strong>Thành phần trên tổng</strong> — <em>cột chồng</em> hoặc, dùng dè, một <em>biểu đồ tròn</em> (chỉ vài phần).</li>
<li><strong>Quan hệ</strong> — <em>biểu đồ phân tán</em> (hai biến số; thêm màu/kích thước cho biến thứ ba).</li>
<li><strong>Phân bố</strong> — <em>histogram</em> hoặc <em>box plot</em> (hình dạng và độ trải của một biến).</li>
</ul>
<h3>Chọn theo ví dụ</h3>
<pre><code>H: "Doanh thu từng tháng năm nay đổi thế nào?"  -> biểu đồ đường
H: "Vùng nào bán nhiều nhất?"                    -> biểu đồ cột
H: "Chi quảng cáo có liên hệ doanh số không?"   -> biểu đồ phân tán
H: "Ngân sách chia ra sao?"                       -> cột chồng (hoặc tròn 3-4 phần)
</code></pre>
<p><strong>Cảnh báo biểu đồ tròn:</strong> tròn chỉ đọc được với hai ba phần khác cỡ rõ rệt. Nhiều hơn, các góc lẫn vào nhau — hãy đổi sang cột đã sắp xếp.</p>
<div class="callout"><span class="badge">Mẹo nhớ</span> Nếu không nói được trong một câu biểu đồ cho người đọc so sánh hoặc thấy điều gì, bạn chưa chọn biểu đồ — mới chỉ chọn một hình dạng.</div>`,
  ]]);

const c3q = quiz('did301-quiz-3', 'Quiz 3 — Choosing charts|||Quiz 3 — Chọn biểu đồ', [
  { id: 'q1', question: 'Muốn cho thấy XU HƯỚNG doanh thu theo thời gian, chọn?', options: ['Biểu đồ tròn', 'Biểu đồ đường', 'Biểu đồ phân tán', 'Histogram'], correctIndex: 1, explanation: 'Đường (line) hợp với biến liên tục theo thời gian trên trục x.' },
  { id: 'q2', question: 'Muốn xem QUAN HỆ giữa hai biến số (vd chi quảng cáo vs doanh số)?', options: ['Biểu đồ cột', 'Biểu đồ tròn', 'Biểu đồ phân tán (scatter)', 'Cột chồng'], correctIndex: 2, explanation: 'Scatter đặt hai biến số lên hai trục để lộ quan hệ/tương quan.' },
  { id: 'q3', question: 'Biểu đồ tròn đọc được tốt nhất khi nào?', options: ['Nhiều phần (10+)', 'Chỉ vài phần khác cỡ rõ rệt', 'Khi tất cả phần bằng nhau', 'Luôn tốt hơn cột'], correctIndex: 1, explanation: 'Tròn dựa vào góc/diện tích; chỉ đọc được với 2-3 phần chênh lệch rõ, nhiều hơn nên đổi sang cột.' },
]);

const c4 = doc('did301-4-1-design-principles', '4.1 — Chart design principles|||4.1 — Nguyên tắc thiết kế biểu đồ',
  'Data-ink ratio & chartjunk (Tufte); tránh bóp méo (trục cắt gốc, tỉ lệ, hiệu ứng 3D lừa); trục, nhãn, chú giải, sắp xếp có nghĩa.',
  [[
    `<span class="eyebrow">DID301 · Chapter 4 · Lesson 4.1</span>
<h2>Chart design principles</h2>
<h3>Tufte: maximize data-ink</h3>
<p>Edward Tufte's <strong>data-ink ratio</strong> = ink used to show data ÷ total ink. Push it toward 1: erase everything that does not carry information. <strong>Chartjunk</strong> — heavy gridlines, 3D bevels, background images, redundant legends — competes with the data and should go.</p>
<pre><code>Remove, in order:
  1. 3D effects and drop shadows   (distort area/length)
  2. Dark gridlines               (mute to faint grey or drop)
  3. Redundant borders & fills
  4. Legends when a direct label works
</code></pre>
<h3>Do not distort</h3>
<ul>
<li><strong>Bar charts must start at zero</strong> — a truncated baseline exaggerates differences. (Line charts may use a non-zero axis, but label it.)</li>
<li><strong>Keep aspect ratio honest</strong> — stretching a chart changes the apparent slope of a trend.</li>
<li><strong>Avoid dual y-axes</strong> when they imply a correlation the data does not support.</li>
</ul>
<h3>Axes, labels, order</h3>
<p>Label axes with units; sort categorical bars by value (not alphabetically) so the ranking is the message; put a clear title that states the takeaway, not just the variable.</p>
<div class="callout"><span class="badge">Tufte's test</span> "Above all else, show the data." If an element is not data and not helping the reader find the data, delete it and see if the chart is worse. Usually it is better.</div>`,
    `<span class="eyebrow">DID301 · Chương 4 · Bài 4.1</span>
<h2>Nguyên tắc thiết kế biểu đồ</h2>
<h3>Tufte: tối đa hoá data-ink</h3>
<p><strong>Tỉ lệ data-ink</strong> của Edward Tufte = mực dùng để thể hiện dữ liệu ÷ tổng mực. Đẩy nó về gần 1: xoá mọi thứ không mang thông tin. <strong>Chartjunk</strong> — lưới đậm, vát 3D, ảnh nền, chú giải thừa — cạnh tranh với dữ liệu và nên bỏ.</p>
<pre><code>Bỏ, theo thứ tự:
  1. Hiệu ứng 3D và đổ bóng      (bóp méo diện tích/độ dài)
  2. Đường lưới đậm             (làm nhạt xám mờ hoặc bỏ)
  3. Viền & nền thừa
  4. Chú giải khi nhãn trực tiếp là đủ
</code></pre>
<h3>Đừng bóp méo</h3>
<ul>
<li><strong>Biểu đồ cột phải bắt đầu từ 0</strong> — cắt gốc làm phóng đại khác biệt. (Biểu đồ đường có thể dùng trục không từ 0, nhưng phải ghi rõ.)</li>
<li><strong>Giữ tỉ lệ khung trung thực</strong> — kéo giãn biểu đồ làm đổi độ dốc biểu kiến của xu hướng.</li>
<li><strong>Tránh hai trục y</strong> khi chúng ngụ ý một tương quan mà dữ liệu không có.</li>
</ul>
<h3>Trục, nhãn, thứ tự</h3>
<p>Ghi nhãn trục kèm đơn vị; sắp cột phân loại theo giá trị (không theo bảng chữ cái) để thứ hạng chính là thông điệp; đặt tiêu đề nói rõ điều rút ra, không chỉ tên biến.</p>
<div class="callout"><span class="badge">Phép thử của Tufte</span> "Trên hết, hãy cho thấy dữ liệu." Nếu một yếu tố không phải dữ liệu và không giúp người đọc tìm dữ liệu, hãy xoá nó và xem biểu đồ có tệ đi không. Thường là tốt hơn.</div>`,
  ]]);

const c4q = quiz('did301-quiz-4', 'Quiz 4 — Design principles|||Quiz 4 — Nguyên tắc thiết kế', [
  { id: 'q1', question: 'Tỉ lệ "data-ink" của Tufte khuyên điều gì?', options: ['Thêm nhiều màu và hiệu ứng', 'Tối đa mực dành cho dữ liệu, xoá thứ không mang thông tin', 'Luôn dùng 3D cho đẹp', 'Vẽ lưới thật đậm'], correctIndex: 1, explanation: 'Data-ink = mực thể hiện dữ liệu / tổng mực; đẩy về gần 1 bằng cách bỏ chartjunk.' },
  { id: 'q2', question: 'Vì sao biểu đồ CỘT nên bắt đầu trục từ 0?', options: ['Cho đẹp', 'Vì cắt gốc phóng đại khác biệt, gây hiểu sai', 'Vì phần mềm bắt buộc', 'Để tiết kiệm mực'], correctIndex: 1, explanation: 'Độ dài cột được đọc so với gốc; cắt gốc làm chênh lệch trông lớn hơn thực tế.' },
  { id: 'q3', question: '"Chartjunk" là gì?', options: ['Dữ liệu bị lỗi', 'Yếu tố trang trí thừa (3D, nền, lưới đậm) cạnh tranh với dữ liệu', 'Biểu đồ vẽ tay', 'Chú thích nguồn dữ liệu'], correctIndex: 1, explanation: 'Chartjunk là mực không mang thông tin; nên loại bỏ để dữ liệu nổi lên.' },
]);

const c5 = doc('did301-5-1-color-typography', '5.1 — Colour & typography in data viz|||5.1 — Màu & typography trong data viz',
  'Dùng màu có mục đích; bảng màu categorical/sequential/diverging; màu thân thiện người mù màu; typography: phân cấp, nhãn trực tiếp, căn số theo đơn vị.',
  [[
    `<span class="eyebrow">DID301 · Chapter 5 · Lesson 5.1</span>
<h2>Colour &amp; typography in data viz</h2>
<h3>Colour with a job</h3>
<p>Colour is powerful and easily abused. Use it to <em>mean</em> something, not to fill space. Three palette types cover most cases:</p>
<ul>
<li><strong>Categorical</strong> — distinct hues for unordered groups (regions, products). Keep it to ~6 colours; more become unreadable.</li>
<li><strong>Sequential</strong> — one hue, light→dark, for ordered magnitude (low→high).</li>
<li><strong>Diverging</strong> — two hues from a meaningful midpoint (e.g. below/above target, loss/gain).</li>
</ul>
<h3>Accessibility</h3>
<p>About 8% of men have colour-vision deficiency. Do not rely on red-vs-green alone; pair colour with position, labels or shape, and test palettes (ColorBrewer marks colour-blind-safe sets). Grey is a first-class colour — use it to push context back so one highlight can come forward.</p>
<h3>Typography</h3>
<ul>
<li><strong>Hierarchy</strong> — a bold takeaway title, lighter axis labels, subtle source note.</li>
<li><strong>Direct labels</strong> beat a distant legend — put the series name at the end of its line.</li>
<li><strong>Align numbers right</strong> and keep decimal places consistent; a clean number column is easier to compare.</li>
</ul>
<div class="callout"><span class="badge">Restraint</span> If everything is coloured, nothing is emphasised. Default to grey, then spend one strong colour on the single thing you want the reader to notice.</div>`,
    `<span class="eyebrow">DID301 · Chương 5 · Bài 5.1</span>
<h2>Màu &amp; typography trong data viz</h2>
<h3>Màu phải có việc để làm</h3>
<p>Màu mạnh và dễ bị lạm dụng. Dùng màu để <em>mang nghĩa</em>, không phải để lấp chỗ. Ba loại bảng màu phủ hầu hết trường hợp:</p>
<ul>
<li><strong>Categorical (phân loại)</strong> — các sắc khác nhau cho nhóm không thứ tự (vùng, sản phẩm). Giữ ~6 màu; nhiều hơn là khó đọc.</li>
<li><strong>Sequential (tăng dần)</strong> — một sắc, nhạt→đậm, cho độ lớn có thứ tự (thấp→cao).</li>
<li><strong>Diverging (phân kỳ)</strong> — hai sắc từ một điểm giữa có nghĩa (vd dưới/trên mục tiêu, lỗ/lãi).</li>
</ul>
<h3>Khả năng tiếp cận</h3>
<p>Khoảng 8% nam giới bị rối loạn nhìn màu. Đừng chỉ dựa vào đỏ-với-xanh lá; ghép màu với vị trí, nhãn hoặc hình dạng, và thử bảng màu (ColorBrewer đánh dấu bộ an toàn cho người mù màu). Xám là một màu hạng nhất — dùng nó đẩy ngữ cảnh ra sau để một điểm nhấn nổi lên trước.</p>
<h3>Typography</h3>
<ul>
<li><strong>Phân cấp</strong> — tiêu đề đậm nói điều rút ra, nhãn trục nhẹ hơn, ghi chú nguồn mờ.</li>
<li><strong>Nhãn trực tiếp</strong> thắng chú giải ở xa — đặt tên chuỗi ngay cuối đường của nó.</li>
<li><strong>Căn số về bên phải</strong> và giữ số chữ số thập phân nhất quán; một cột số gọn dễ so sánh hơn.</li>
</ul>
<div class="callout"><span class="badge">Kiềm chế</span> Nếu mọi thứ đều có màu thì chẳng gì được nhấn. Mặc định để xám, rồi tiêu một màu mạnh cho đúng một thứ bạn muốn người đọc để ý.</div>`,
  ]]);

const c5q = quiz('did301-quiz-5', 'Quiz 5 — Colour & typography|||Quiz 5 — Màu & typography', [
  { id: 'q1', question: 'Bảng màu "diverging" (phân kỳ) hợp nhất với dữ liệu nào?', options: ['Nhóm không thứ tự', 'Giá trị có điểm giữa có nghĩa (dưới/trên mục tiêu)', 'Một biến duy nhất tăng dần', 'Dữ liệu văn bản'], correctIndex: 1, explanation: 'Diverging dùng hai sắc từ một điểm giữa, hợp với lệch âm/dương quanh mốc.' },
  { id: 'q2', question: 'Cách tốt để biểu đồ thân thiện người mù màu?', options: ['Chỉ dùng đỏ và xanh lá', 'Ghép màu với vị trí/nhãn/hình dạng, tránh chỉ đỏ-xanh lá', 'Dùng thật nhiều màu', 'Bỏ hết nhãn'], correctIndex: 1, explanation: 'Đừng để màu là tín hiệu duy nhất; kèm vị trí/nhãn/hình và chọn bảng an toàn.' },
  { id: 'q3', question: 'Vai trò của màu XÁM trong một biểu đồ có điểm nhấn?', options: ['Không nên dùng', 'Đẩy ngữ cảnh ra sau để một màu nhấn nổi lên trước', 'Chỉ để in tiết kiệm', 'Làm nền cho chữ'], correctIndex: 1, explanation: 'Xám hạ ngữ cảnh xuống nền, dành một màu mạnh cho điều cần chú ý.' },
]);

const c6 = doc('did301-6-1-storytelling', '6.1 — Storytelling with data|||6.1 — Kể chuyện bằng dữ liệu',
  'Kể chuyện với dữ liệu (Knaflic); ngữ cảnh (ai/điều gì/thế nào); mỗi biểu đồ một thông điệp; điểm nhấn có chủ đích; annotation dẫn dắt mắt người đọc.',
  [[
    `<span class="eyebrow">DID301 · Chapter 6 · Lesson 6.1</span>
<h2>Storytelling with data</h2>
<p>Cole Nussbaumer Knaflic's core idea: a chart is not the end — a <strong>message</strong> is. Move from "here is the data" to "here is what it means and what to do".</p>
<h3>Set the context first</h3>
<ul>
<li><strong>Who</strong> is the audience, and what do they care about / can decide?</li>
<li><strong>What</strong> do you need them to know or do — in one sentence?</li>
<li><strong>How</strong> will data support that message?</li>
</ul>
<h3>One chart, one point</h3>
<p>Give each visual a single, explicit takeaway — and say it in the <em>title</em> ("Support tickets fell 40% after the fix"), not just "Tickets by month". If a chart needs two messages, it is two charts.</p>
<h3>Guide the eye</h3>
<pre><code>Focus techniques:
  - grey everything, colour the one series that matters
  - annotate the key point directly on the chart
  - add a reference line (target, average, launch date)
  - order and spacing so the reader lands where you want
</code></pre>
<p>Knaflic frames this as removing clutter and directing attention: pre-attentive cues (colour, size, position) tell the reader <em>where to look</em> and the annotation tells them <em>why it matters</em>.</p>
<div class="callout"><span class="badge">From report to narrative</span> A dashboard shows everything; a story shows the one thing — then, if asked, the rest. Lead with the message, support with the data.</div>`,
    `<span class="eyebrow">DID301 · Chương 6 · Bài 6.1</span>
<h2>Kể chuyện bằng dữ liệu</h2>
<p>Ý cốt lõi của Cole Nussbaumer Knaflic: biểu đồ không phải đích — <strong>thông điệp</strong> mới là. Chuyển từ "đây là dữ liệu" sang "đây là ý nghĩa và việc cần làm".</p>
<h3>Dựng ngữ cảnh trước</h3>
<ul>
<li><strong>Ai</strong> là người xem, họ quan tâm gì / quyết định được gì?</li>
<li><strong>Điều gì</strong> bạn cần họ biết hoặc làm — trong một câu?</li>
<li><strong>Thế nào</strong> dữ liệu sẽ đỡ cho thông điệp đó?</li>
</ul>
<h3>Một biểu đồ, một điểm</h3>
<p>Cho mỗi hình một điều rút ra duy nhất, rõ ràng — và nói nó trong <em>tiêu đề</em> ("Ticket hỗ trợ giảm 40% sau khi vá"), không chỉ "Ticket theo tháng". Nếu một biểu đồ cần hai thông điệp, đó là hai biểu đồ.</p>
<h3>Dẫn dắt ánh mắt</h3>
<pre><code>Kỹ thuật tạo tiêu điểm:
  - để xám hết, tô màu đúng chuỗi quan trọng
  - annotate điểm mấu chốt ngay trên biểu đồ
  - thêm đường tham chiếu (mục tiêu, trung bình, ngày ra mắt)
  - sắp thứ tự và khoảng cách để mắt đáp đúng chỗ bạn muốn
</code></pre>
<p>Knaflic gọi đây là dọn bừa bộn và điều hướng chú ý: dấu hiệu tiền chú ý (màu, kích thước, vị trí) bảo người đọc <em>nhìn vào đâu</em>, còn annotation bảo họ <em>vì sao nó quan trọng</em>.</p>
<div class="callout"><span class="badge">Từ báo cáo sang tự sự</span> Dashboard bày mọi thứ; câu chuyện bày một thứ — rồi, nếu được hỏi, phần còn lại. Dẫn bằng thông điệp, đỡ bằng dữ liệu.</div>`,
  ]]);

const c6q = quiz('did301-quiz-6', 'Quiz 6 — Storytelling|||Quiz 6 — Kể chuyện dữ liệu', [
  { id: 'q1', question: 'Theo Knaflic, tiêu đề biểu đồ nên nói gì?', options: ['Chỉ tên biến (vd "Ticket theo tháng")', 'Điều rút ra/thông điệp (vd "Ticket giảm 40% sau khi vá")', 'Nguồn dữ liệu', 'Tên tác giả'], correctIndex: 1, explanation: 'Tiêu đề nên phát biểu takeaway để mỗi biểu đồ mang đúng một thông điệp.' },
  { id: 'q2', question: 'Cách tạo tiêu điểm (focus) hiệu quả trên biểu đồ?', options: ['Tô màu tất cả chuỗi', 'Để xám phần còn lại, tô màu + annotate đúng chuỗi quan trọng', 'Thêm nhiều 3D', 'Xoá hết nhãn'], correctIndex: 1, explanation: 'Hạ ngữ cảnh xuống xám, dùng màu/annotation/đường tham chiếu dẫn mắt tới điểm chính.' },
  { id: 'q3', question: 'Bước NÊN làm trước khi vẽ, theo tư duy kể chuyện dữ liệu?', options: ['Chọn phần mềm', 'Xác định người xem và thông điệp một câu', 'Chọn bảng màu', 'Xuất PDF'], correctIndex: 1, explanation: 'Ngữ cảnh trước: ai xem, cần họ biết/làm gì, rồi mới để dữ liệu đỡ thông điệp đó.' },
]);

const c7 = doc('did301-7-1-infographic-design', '7.1 — Infographic design|||7.1 — Thiết kế infographic',
  'Infographic là gì (khác dashboard/biểu đồ đơn); bố cục & luồng đọc; phân cấp thị giác; kết hợp icon/chữ/số liệu; giữ trung thực khi cách điệu.',
  [[
    `<span class="eyebrow">DID301 · Chapter 7 · Lesson 7.1</span>
<h2>Infographic design</h2>
<p>An <strong>infographic</strong> combines charts, icons, numbers and short text into one designed narrative for a general audience. Unlike a single chart (one view) or a dashboard (live monitoring), an infographic is <em>authored</em> — it walks the reader through a story in a fixed order.</p>
<h3>Layout &amp; reading flow</h3>
<p>Design a clear path — usually top-to-bottom or Z-shaped. Break the piece into <strong>sections</strong> with headers, so a scanner gets the gist and a reader gets the depth. Use whitespace to separate ideas instead of boxes.</p>
<h3>Visual hierarchy</h3>
<pre><code>Level 1: headline + one big number   (the hook)
Level 2: section titles              (the structure)
Level 3: charts & supporting stats   (the evidence)
Level 4: source, method, footnotes   (the trust)
</code></pre>
<h3>Icons, words &amp; numbers together</h3>
<ul>
<li><strong>Icons</strong> label and speed recognition — keep one consistent style and weight.</li>
<li><strong>A hero number</strong> anchors each section; format it big and rounded ("2.4M", not "2,431,908").</li>
<li><strong>Short text</strong> gives meaning a chart cannot — but keep it tight.</li>
</ul>
<div class="callout"><span class="badge">Style must not lie</span> Stylising is fine; distorting is not. A pictograph where one icon = 100 people must keep icon <em>size</em> constant — scale by count, not by stretching a single image.</div>`,
    `<span class="eyebrow">DID301 · Chương 7 · Bài 7.1</span>
<h2>Thiết kế infographic</h2>
<p>Một <strong>infographic</strong> kết hợp biểu đồ, icon, con số và chữ ngắn thành một tự sự có thiết kế cho người xem phổ thông. Khác với một biểu đồ đơn (một góc nhìn) hay dashboard (theo dõi trực tiếp), infographic được <em>biên soạn</em> — dẫn người đọc qua một câu chuyện theo thứ tự cố định.</p>
<h3>Bố cục &amp; luồng đọc</h3>
<p>Thiết kế một đường đi rõ ràng — thường trên-xuống-dưới hoặc chữ Z. Chia tác phẩm thành <strong>khối</strong> có tiêu đề, để người lướt nắm ý chính còn người đọc kỹ có chiều sâu. Dùng khoảng trắng để tách ý thay cho khung viền.</p>
<h3>Phân cấp thị giác</h3>
<pre><code>Cấp 1: tít lớn + một con số lớn     (móc câu)
Cấp 2: tiêu đề từng khối            (cấu trúc)
Cấp 3: biểu đồ & số liệu đỡ         (bằng chứng)
Cấp 4: nguồn, phương pháp, chú thích (niềm tin)
</code></pre>
<h3>Icon, chữ &amp; số đi cùng nhau</h3>
<ul>
<li><strong>Icon</strong> gắn nhãn và tăng tốc nhận diện — giữ một phong cách và độ dày nhất quán.</li>
<li><strong>Con số chủ đạo</strong> neo mỗi khối; trình bày lớn và làm tròn ("2,4 triệu", không phải "2.431.908").</li>
<li><strong>Chữ ngắn</strong> cho ý nghĩa mà biểu đồ không nói được — nhưng phải cô đọng.</li>
</ul>
<div class="callout"><span class="badge">Cách điệu không được nói dối</span> Cách điệu thì được; bóp méo thì không. Một pictograph mà một icon = 100 người phải giữ <em>kích thước</em> icon không đổi — tăng theo số lượng icon, đừng kéo giãn một hình.</div>`,
  ]]);

const c7q = quiz('did301-quiz-7', 'Quiz 7 — Infographic|||Quiz 7 — Infographic', [
  { id: 'q1', question: 'Infographic khác một biểu đồ đơn hay dashboard ở chỗ nào?', options: ['Luôn có hoạt hình', 'Là một tự sự được biên soạn theo thứ tự cố định', 'Không được dùng số', 'Chỉ dành cho chuyên gia'], correctIndex: 1, explanation: 'Infographic dẫn người đọc qua một câu chuyện theo trình tự; dashboard để theo dõi trực tiếp.' },
  { id: 'q2', question: 'Phân cấp thị giác trong infographic nên bắt đầu bằng?', options: ['Chú thích nguồn ở đầu', 'Tít lớn + một con số chủ đạo làm móc câu', 'Bảng dữ liệu thô', 'Danh sách tài liệu tham khảo'], correctIndex: 1, explanation: 'Cấp cao nhất là tít + hero number; rồi tiêu đề khối, biểu đồ, cuối cùng nguồn/chú thích.' },
  { id: 'q3', question: 'Với pictograph "một icon = 100 người", để KHÔNG bóp méo cần?', options: ['Kéo giãn một icon to theo số', 'Giữ kích thước icon cố định, tăng theo SỐ LƯỢNG icon', 'Đổi màu icon', 'Dùng 3D'], correctIndex: 1, explanation: 'Diện tích icon phóng đại thị giác; hãy tăng số lượng icon cùng cỡ, đừng phóng to một icon.' },
]);

const c8 = doc('did301-8-1-tools-dashboards', '8.1 — Tools & dashboards|||8.1 — Công cụ & dashboard',
  'Công cụ (Tableau/Power BI/Flourish/Datawrapper); dashboard (bố cục, KPI, tương tác/lọc); đạo đức trực quan hoá — trình bày trung thực, ghi nguồn.',
  [[
    `<span class="eyebrow">DID301 · Chapter 8 · Lesson 8.1</span>
<h2>Tools &amp; dashboards</h2>
<h3>The toolbox</h3>
<ul>
<li><strong>Tableau / Power BI</strong> — connect data, build interactive dashboards for business analytics.</li>
<li><strong>Flourish</strong> — story-driven, animated visuals for the web and presentations.</li>
<li><strong>Datawrapper</strong> — fast, honest charts &amp; maps favoured by newsrooms; sensible defaults.</li>
</ul>
<h3>Designing a dashboard</h3>
<p>A dashboard answers recurring questions at a glance. Put the <strong>most important KPI top-left</strong> (where the eye lands), group related charts, and keep a consistent scale and colour meaning across the whole board.</p>
<pre><code>Dashboard layout:
  top-left   -> headline KPI (the "so what")
  top row    -> supporting KPIs / trend
  middle     -> breakdowns (by region, product...)
  filters    -> global controls that update everything
</code></pre>
<p><strong>Interaction</strong> — filters, tooltips and drill-downs let one layout serve many questions; but do not hide the main message behind clicks.</p>
<h3>Ethics of visualization</h3>
<ul>
<li><strong>Do not distort</strong> — zero baselines for bars, honest axes, no cherry-picked ranges.</li>
<li><strong>Show uncertainty</strong> — a trend on 5 data points is not a law; say so.</li>
<li><strong>Cite the source &amp; method</strong> — every chart should be traceable and reproducible.</li>
</ul>
<div class="callout"><span class="badge">Trust is the product</span> A beautiful chart that misleads is worse than an ugly one that is true. Clarity plus honesty is the whole job of this course.</div>`,
    `<span class="eyebrow">DID301 · Chương 8 · Bài 8.1</span>
<h2>Công cụ &amp; dashboard</h2>
<h3>Bộ công cụ</h3>
<ul>
<li><strong>Tableau / Power BI</strong> — nối dữ liệu, dựng dashboard tương tác cho phân tích kinh doanh.</li>
<li><strong>Flourish</strong> — hình động kể chuyện cho web và thuyết trình.</li>
<li><strong>Datawrapper</strong> — biểu đồ &amp; bản đồ nhanh, trung thực, được toà soạn ưa dùng; mặc định hợp lý.</li>
</ul>
<h3>Thiết kế một dashboard</h3>
<p>Dashboard trả lời các câu hỏi lặp lại trong một cái liếc. Đặt <strong>KPI quan trọng nhất ở góc trên-trái</strong> (nơi mắt đáp xuống), gom các biểu đồ liên quan, và giữ thang đo cùng ý nghĩa màu nhất quán trên toàn bảng.</p>
<pre><code>Bố cục dashboard:
  trên-trái  -> KPI chủ đạo ("để làm gì")
  hàng trên  -> KPI đỡ / xu hướng
  giữa       -> phân rã (theo vùng, sản phẩm...)
  bộ lọc     -> điều khiển chung cập nhật tất cả
</code></pre>
<p><strong>Tương tác</strong> — bộ lọc, tooltip và drill-down giúp một bố cục phục vụ nhiều câu hỏi; nhưng đừng giấu thông điệp chính sau các cú nhấp.</p>
<h3>Đạo đức trực quan hoá</h3>
<ul>
<li><strong>Đừng bóp méo</strong> — cột từ gốc 0, trục trung thực, không chọn khoảng có lợi.</li>
<li><strong>Cho thấy độ bất định</strong> — một xu hướng trên 5 điểm dữ liệu không phải quy luật; hãy nói rõ.</li>
<li><strong>Ghi nguồn &amp; phương pháp</strong> — mọi biểu đồ phải truy được và tái lập được.</li>
</ul>
<div class="callout"><span class="badge">Niềm tin là sản phẩm</span> Một biểu đồ đẹp mà đánh lừa còn tệ hơn một biểu đồ xấu mà đúng. Rõ ràng cộng trung thực là toàn bộ công việc của môn này.</div>`,
  ]]);

const c8q = quiz('did301-quiz-8', 'Quiz 8 — Tools & dashboards|||Quiz 8 — Công cụ & dashboard', [
  { id: 'q1', question: 'Trên một dashboard, nên đặt KPI quan trọng nhất ở đâu?', options: ['Góc dưới-phải', 'Góc trên-trái (nơi mắt đáp xuống trước)', 'Chính giữa dưới cùng', 'Không quan trọng vị trí'], correctIndex: 1, explanation: 'Người đọc (viết trái→phải) quét từ trên-trái; đặt KPI chủ đạo ở đó.' },
  { id: 'q2', question: 'Nguyên tắc đạo đức nào ĐÚNG khi trực quan hoá?', options: ['Chọn khoảng dữ liệu có lợi cho kết luận', 'Cắt gốc cột cho khác biệt trông lớn', 'Ghi nguồn/phương pháp và cho thấy độ bất định', 'Giấu chú thích nguồn'], correctIndex: 2, explanation: 'Trung thực: trục đúng, không cherry-pick, nêu độ bất định, dẫn nguồn để tái lập.' },
  { id: 'q3', question: 'Vai trò của tương tác (lọc, tooltip, drill-down) trên dashboard?', options: ['Thay thế thông điệp chính', 'Cho một bố cục phục vụ nhiều câu hỏi mà không giấu thông điệp chính', 'Làm chậm để trông chuyên nghiệp', 'Bắt buộc phải có 3D'], correctIndex: 1, explanation: 'Tương tác giúp một layout trả lời nhiều câu hỏi; nhưng thông điệp chính vẫn phải thấy ngay.' },
]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'DID301',
    slug: 'did301-data-visualization-infographic-design',
    title: 'Data visualization & Infographic design',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/DID301.webp',
    shortDescription: 'Turn data into images people understand & trust — visual perception & encoding, choosing charts, Tufte data-ink, colour & typography, storytelling with data (Knaflic), infographics, tools & dashboards. Bilingual, real chart examples & quizzes.|||Biến dữ liệu thành hình dễ hiểu & đáng tin — nhận thức thị giác & mã hoá, chọn biểu đồ, data-ink của Tufte, màu & typography, kể chuyện bằng dữ liệu (Knaflic), infographic, công cụ & dashboard. Song ngữ, ví dụ biểu đồ thật & quiz.',
    description: 'Môn <strong>DID301 — Data Visualization &amp; Infographic Design</strong> (ngành Thiết kế mỹ thuật số, kỳ 7) dạy cách <strong>biến dữ liệu thành hình mà người ta hiểu và tin</strong>. Từ <strong>nhận thức thị giác &amp; mã hoá</strong> → <strong>chọn biểu đồ</strong> (cột/đường/tròn/phân tán) → <strong>nguyên tắc thiết kế</strong> (data-ink của Tufte, tránh bóp méo) → <strong>màu &amp; typography</strong> → <strong>kể chuyện bằng dữ liệu</strong> (Knaflic) → <strong>infographic</strong> → <strong>công cụ &amp; dashboard</strong> (Flourish/Datawrapper/Tableau, đạo đức trực quan). Song ngữ, có ví dụ biểu đồ thật và quiz mỗi chương.',
    whatYouLearn: 'Data viz là gì & quy trình từ dữ liệu tới hình; preattentive & thang chính xác của kênh mã hoá; chọn biểu đồ theo dữ liệu/câu hỏi; data-ink & chartjunk (Tufte), tránh cắt gốc/bóp méo; bảng màu categorical/sequential/diverging & thân thiện mù màu; phân cấp typography & nhãn trực tiếp; kể chuyện bằng dữ liệu, ngữ cảnh, annotation (Knaflic); thiết kế infographic (bố cục, phân cấp, icon/chữ/số); dashboard (KPI, tương tác) & đạo đức trực quan.',
    requirements: 'Không cần nền toán/lập trình chuyên sâu. Nên có tài khoản miễn phí Flourish/Datawrapper hoặc Tableau Public để thực hành.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách chuẩn (Knaflic/Cairo/Tufte), công cụ, lộ trình 4 bước.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Data viz làm gì, lộ trình môn.', lessons: [intro] },
    { title: 'Chương 1 — Data viz là gì|||Chapter 1 — What is data viz', description: 'Định nghĩa, vì sao, quy trình từ dữ liệu tới hình.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Nhận thức & mã hoá|||Chapter 2 — Perception & encoding', description: 'Preattentive, thang chính xác kênh mã hoá, Gestalt.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Chọn biểu đồ|||Chapter 3 — Choosing charts', description: 'Bar/line/pie/scatter..., chọn theo dữ liệu & mục đích.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Nguyên tắc thiết kế|||Chapter 4 — Design principles', description: 'Data-ink, chartjunk, tránh bóp méo, trục & nhãn.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Màu & typography|||Chapter 5 — Colour & type', description: 'Categorical/sequential/diverging, mù màu, nhãn.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Kể chuyện bằng dữ liệu|||Chapter 6 — Storytelling', description: 'Ngữ cảnh, một biểu đồ một thông điệp, annotation.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Thiết kế infographic|||Chapter 7 — Infographic', description: 'Bố cục, phân cấp, kết hợp icon/chữ/số liệu.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Công cụ & dashboard|||Chapter 8 — Tools & dashboards', description: 'Tableau/Power BI/Flourish/Datawrapper, dashboard, đạo đức.', lessons: [c8, c8q] },
  ],
};
