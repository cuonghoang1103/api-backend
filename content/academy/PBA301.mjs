/**
 * PBA301 — Python for Business Analytics. Giáo trình tham khảo: "Python for
 * Data Analysis" (Wes McKinney), "Python for Finance" (Yves Hilpisch), tài
 * liệu chính thức pandas/NumPy/matplotlib. 8 chương: Python cơ bản → NumPy →
 * pandas → làm sạch/biến đổi → trực quan hoá → thống kê/EDA → hồi quy/dự báo
 * → dashboard & case study. Song ngữ + ví dụ + quiz.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('pba301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: sách nền (kèm link), tài liệu chính thức pandas/NumPy/matplotlib, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">PBA301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Python for Business Analytics</strong> — from core Python to NumPy, pandas, visualization, statistics, basic forecasting and reporting — in one place.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://wesmckinney.com/book/" target="_blank" rel="noopener"><em>Python for Data Analysis</em> — Wes McKinney (creator of pandas)</a></li>
<li><a href="https://home.tpq.io/books/py4fi2nd/" target="_blank" rel="noopener"><em>Python for Finance</em> — Yves Hilpisch</a></li>
</ul>
<h3>🌐 Official documentation</h3>
<ul>
<li><a href="https://pandas.pydata.org/docs/" target="_blank" rel="noopener">pandas documentation</a></li>
<li><a href="https://numpy.org/doc/stable/" target="_blank" rel="noopener">NumPy documentation</a></li>
<li><a href="https://matplotlib.org/stable/" target="_blank" rel="noopener">matplotlib documentation</a></li>
<li><a href="https://seaborn.pydata.org/" target="_blank" rel="noopener">seaborn documentation</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@coreyms" target="_blank" rel="noopener">Corey Schafer</a> — Python &amp; pandas tutorials</li>
<li><a href="https://www.youtube.com/@krishnaik06" target="_blank" rel="noopener">Krish Naik</a> — data analytics &amp; ML in Python</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://colab.research.google.com/" target="_blank" rel="noopener">Google Colab</a> — chạy Python/pandas miễn phí trên trình duyệt, không cần cài đặt</li>
<li><a href="https://jupyter.org/" target="_blank" rel="noopener">Jupyter Notebook</a> — môi trường chuẩn để phân tích dữ liệu từng bước</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — Python syntax, variables, control flow, functions.</li>
<li><strong>Arrays &amp; tables</strong> — NumPy arrays, pandas Series/DataFrame, reading real files (CSV/Excel).</li>
<li><strong>Practice</strong> — clean messy business data (missing values, merges, groupby summaries).</li>
<li><strong>Go deeper</strong> — visualize, describe statistically, run a simple regression/forecast.</li>
<li><strong>Job-ready</strong> — turn an analysis into a repeatable report/dashboard on a real business case.</li>
</ol></div>`,
    `<span class="eyebrow">PBA301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Python cho Phân tích Kinh doanh</strong> — từ Python nền tới NumPy, pandas, trực quan hoá, thống kê và dự báo/báo cáo cơ bản — gom về một chỗ.</p>
<h3>📗 Sách nền</h3>
<ul>
<li><a href="https://wesmckinney.com/book/" target="_blank" rel="noopener"><em>Python for Data Analysis</em> — Wes McKinney (người tạo ra pandas)</a></li>
<li><a href="https://home.tpq.io/books/py4fi2nd/" target="_blank" rel="noopener"><em>Python for Finance</em> — Yves Hilpisch</a></li>
</ul>
<h3>🌐 Tài liệu chính thức</h3>
<ul>
<li><a href="https://pandas.pydata.org/docs/" target="_blank" rel="noopener">Tài liệu pandas</a></li>
<li><a href="https://numpy.org/doc/stable/" target="_blank" rel="noopener">Tài liệu NumPy</a></li>
<li><a href="https://matplotlib.org/stable/" target="_blank" rel="noopener">Tài liệu matplotlib</a></li>
<li><a href="https://seaborn.pydata.org/" target="_blank" rel="noopener">Tài liệu seaborn</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@coreyms" target="_blank" rel="noopener">Corey Schafer</a> — hướng dẫn Python &amp; pandas</li>
<li><a href="https://www.youtube.com/@krishnaik06" target="_blank" rel="noopener">Krish Naik</a> — phân tích dữ liệu &amp; ML với Python</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://colab.research.google.com/" target="_blank" rel="noopener">Google Colab</a> — chạy Python/pandas miễn phí trên trình duyệt, không cần cài đặt</li>
<li><a href="https://jupyter.org/" target="_blank" rel="noopener">Jupyter Notebook</a> — môi trường chuẩn để phân tích dữ liệu từng bước</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — cú pháp Python, biến, cấu trúc điều khiển, hàm.</li>
<li><strong>Mảng &amp; bảng</strong> — mảng NumPy, Series/DataFrame của pandas, đọc file thật (CSV/Excel).</li>
<li><strong>Luyện tập</strong> — làm sạch dữ liệu kinh doanh lộn xộn (thiếu dữ liệu, merge, tổng hợp groupby).</li>
<li><strong>Đào sâu</strong> — trực quan hoá, mô tả bằng thống kê, chạy một mô hình hồi quy/dự báo đơn giản.</li>
<li><strong>Sẵn sàng đi làm</strong> — biến một phân tích thành báo cáo/dashboard lặp lại được trên case kinh doanh thật.</li>
</ol></div>`,
  ]]);

const intro = doc('pba301-0-1-overview', 'Course overview: Python for Business Analytics|||Tổng quan: Python cho Phân tích Kinh doanh',
  'Vì sao dân kinh doanh cần Python; bộ công cụ (NumPy, pandas, matplotlib); lộ trình 8 chương từ cú pháp tới dashboard.',
  [[
    `<span class="eyebrow">PBA301 · Lesson 0.1 · Overview</span>
<h2>Python for Business Analytics</h2>
<p class="lead">Excel is great for a few hundred rows and one-off charts. The moment data grows to millions of rows, needs cleaning every week, or must feed the same report every month, <strong>Python</strong> takes over: it is repeatable, scriptable, and free.</p>
<h3>Why Python for business analytics</h3>
<ul>
<li><strong>Scale</strong> — handles millions of rows that would freeze a spreadsheet.</li>
<li><strong>Repeatability</strong> — a script run twice gives the same result; a spreadsheet clicked twice does not.</li>
<li><strong>Ecosystem</strong> — free, industry-standard libraries for every step of analysis.</li>
</ul>
<h3>The toolbox</h3>
<ul>
<li><strong>NumPy</strong> — fast numeric arrays, the engine underneath everything else.</li>
<li><strong>pandas</strong> — spreadsheet-like tables (DataFrame) with real code behind them.</li>
<li><strong>matplotlib / seaborn</strong> — charts.</li>
<li><strong>Statistics &amp; a touch of ML</strong> — describing data and forecasting simple trends.</li>
</ul>
<h3>Roadmap (8 chapters)</h3>
<p>Python basics → NumPy → pandas (Series/DataFrame, read/write) → cleaning &amp; transforming (missing data, groupby, merge) → visualization → descriptive statistics &amp; EDA → basic regression/forecasting → dashboards, automated reports &amp; a business case study.</p>`,
    `<span class="eyebrow">PBA301 · Bài 0.1 · Tổng quan</span>
<h2>Python cho Phân tích Kinh doanh</h2>
<p class="lead">Excel rất tốt cho vài trăm dòng và vài biểu đồ làm một lần. Khi dữ liệu lớn lên hàng triệu dòng, phải làm sạch mỗi tuần, hoặc phải nộp cùng một báo cáo mỗi tháng, <strong>Python</strong> lên thay: nó lặp lại được, viết thành script, và miễn phí.</p>
<h3>Vì sao Python cho phân tích kinh doanh</h3>
<ul>
<li><strong>Quy mô</strong> — xử lý được hàng triệu dòng mà bảng tính sẽ đứng máy.</li>
<li><strong>Lặp lại được</strong> — chạy script hai lần ra cùng một kết quả; bấm bảng tính hai lần thì không chắc.</li>
<li><strong>Hệ sinh thái</strong> — thư viện miễn phí, chuẩn ngành cho mọi bước phân tích.</li>
</ul>
<h3>Bộ công cụ</h3>
<ul>
<li><strong>NumPy</strong> — mảng số tốc độ cao, động cơ nằm dưới mọi thứ khác.</li>
<li><strong>pandas</strong> — bảng kiểu bảng tính (DataFrame) nhưng có code thật đứng sau.</li>
<li><strong>matplotlib / seaborn</strong> — vẽ biểu đồ.</li>
<li><strong>Thống kê &amp; một chút ML</strong> — mô tả dữ liệu và dự báo xu hướng đơn giản.</li>
</ul>
<h3>Lộ trình (8 chương)</h3>
<p>Python cơ bản → NumPy → pandas (Series/DataFrame, đọc/ghi) → làm sạch &amp; biến đổi (dữ liệu thiếu, groupby, merge) → trực quan hoá → thống kê mô tả &amp; EDA → hồi quy/dự báo cơ bản → dashboard, báo cáo tự động &amp; case study kinh doanh.</p>`,
  ]]);

const c1 = doc('pba301-1-1-python-basics', '1.1 — Python basics for business analytics|||1.1 — Python cơ bản cho phân tích kinh doanh',
  'Biến, kiểu dữ liệu (số, chuỗi, bool), danh sách/từ điển, cấu trúc điều khiển (if, for), hàm.',
  [[
    `<span class="eyebrow">PBA301 · Chapter 1 · Lesson 1.1</span>
<h2>Python basics for business analytics</h2>
<h3>Variables &amp; data types</h3>
<p>A <strong>variable</strong> is a name bound to a value. The types you'll use constantly:</p>
<ul>
<li><strong>int / float</strong> — whole and decimal numbers (revenue, quantity, price).</li>
<li><strong>str</strong> — text (customer name, product category).</li>
<li><strong>bool</strong> — True/False (is this order paid?).</li>
<li><strong>list</strong> — an ordered collection: <code>[100, 200, 150]</code>.</li>
<li><strong>dict</strong> — key → value pairs: <code>{"Hanoi": 100, "HCMC": 250}</code>.</li>
</ul>
<pre><code>revenue = 1_250_000        # int
growth_rate = 0.08          # float
region = "Hanoi"            # str
is_target_met = True        # bool
monthly_sales = [120, 135, 150, 142]   # list
sales_by_city = {"Hanoi": 120, "HCMC": 250}  # dict
</code></pre>
<h3>Control flow</h3>
<p><strong>if / elif / else</strong> branches on a condition; <strong>for</strong> repeats over a collection.</p>
<pre><code>for city, sales in sales_by_city.items():
    if sales &gt;= 200:
        print(city, "high performer")
    elif sales &gt;= 100:
        print(city, "on target")
    else:
        print(city, "needs attention")
</code></pre>
<h3>Functions</h3>
<p>A <strong>function</strong> packages reusable logic — write it once, call it for every product/region/month.</p>
<pre><code>def growth_pct(old_value, new_value):
    return (new_value - old_value) / old_value * 100

growth_pct(120, 135)   # 12.5
</code></pre>
<div class="callout"><span class="badge">Why it matters</span> Every pandas/NumPy operation you'll learn next is built from exactly these four pieces: variables, types, control flow, functions.</div>`,
    `<span class="eyebrow">PBA301 · Chương 1 · Bài 1.1</span>
<h2>Python cơ bản cho phân tích kinh doanh</h2>
<h3>Biến &amp; kiểu dữ liệu</h3>
<p>Một <strong>biến</strong> là một tên gắn với một giá trị. Các kiểu bạn dùng liên tục:</p>
<ul>
<li><strong>int / float</strong> — số nguyên và số thực (doanh thu, số lượng, giá).</li>
<li><strong>str</strong> — chuỗi văn bản (tên khách hàng, nhóm sản phẩm).</li>
<li><strong>bool</strong> — True/False (đơn hàng này đã thanh toán chưa?).</li>
<li><strong>list</strong> — tập hợp có thứ tự: <code>[100, 200, 150]</code>.</li>
<li><strong>dict</strong> — cặp khoá → giá trị: <code>{"Hanoi": 100, "HCMC": 250}</code>.</li>
</ul>
<pre><code>revenue = 1_250_000        # int
growth_rate = 0.08          # float
region = "Hanoi"            # str
is_target_met = True        # bool
monthly_sales = [120, 135, 150, 142]   # list
sales_by_city = {"Hanoi": 120, "HCMC": 250}  # dict
</code></pre>
<h3>Cấu trúc điều khiển</h3>
<p><strong>if / elif / else</strong> rẽ nhánh theo điều kiện; <strong>for</strong> lặp qua một tập hợp.</p>
<pre><code>for city, sales in sales_by_city.items():
    if sales &gt;= 200:
        print(city, "vượt mục tiêu")
    elif sales &gt;= 100:
        print(city, "đạt mục tiêu")
    else:
        print(city, "cần chú ý")
</code></pre>
<h3>Hàm (functions)</h3>
<p>Một <strong>hàm</strong> đóng gói logic dùng lại được — viết một lần, gọi cho mọi sản phẩm/khu vực/tháng.</p>
<pre><code>def growth_pct(old_value, new_value):
    return (new_value - old_value) / old_value * 100

growth_pct(120, 135)   # 12.5
</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Mọi phép tính NumPy/pandas bạn học sau đều dựng từ đúng bốn khối này: biến, kiểu dữ liệu, cấu trúc điều khiển, hàm.</div>`,
  ]]);

const c1q = quiz('pba301-quiz-1', 'Quiz 1 — Python basics|||Quiz 1 — Python cơ bản', [
  { id: 'q1', question: 'Kiểu dữ liệu nào lưu cặp khoá → giá trị, ví dụ {"Hanoi": 120}?', options: ['list', 'dict', 'bool', 'str'], correctIndex: 1, explanation: 'dict lưu cặp khoá → giá trị; list lưu tập hợp có thứ tự không có khoá.' },
  { id: 'q2', question: 'Cấu trúc nào dùng để lặp qua từng phần tử của một danh sách?', options: ['if', 'def', 'for', 'import'], correctIndex: 2, explanation: 'for lặp qua từng phần tử của một collection (list, dict, ...).' },
  { id: 'q3', question: 'Viết logic dùng lại được (ví dụ tính % tăng trưởng) nên đóng gói vào?', options: ['Một biến float', 'Một hàm (function)', 'Một chuỗi str', 'Một vòng lặp for duy nhất'], correctIndex: 1, explanation: 'Hàm (def) đóng gói logic để gọi lại nhiều lần cho các dữ liệu khác nhau.' },
]);

const c2 = doc('pba301-2-1-numpy', '2.1 — Data structures & NumPy|||2.1 — Cấu trúc dữ liệu & NumPy',
  'Mảng NumPy (ndarray) so với list; phép toán theo phần tử (vectorized), chỉ số/slicing, thống kê nhanh.',
  [[
    `<span class="eyebrow">PBA301 · Chapter 2 · Lesson 2.1</span>
<h2>Data structures &amp; NumPy</h2>
<h3>Why not just use lists?</h3>
<p>A Python <code>list</code> can hold anything, but doing math on it is slow and awkward — you'd need a loop just to add 5% to every price. <strong>NumPy's <code>ndarray</code></strong> stores numbers in a compact, uniform block of memory and applies math to the <em>whole array at once</em> — this is called <strong>vectorization</strong>.</p>
<pre><code>import numpy as np

prices = np.array([10.0, 25.5, 8.0, 42.0])
prices_with_vat = prices * 1.10      # every element × 1.10, no loop
prices.mean()                         # 21.375
prices.sum()                          # 85.5
prices[prices &gt; 20]                   # array([25.5, 42.0]) — boolean filter
</code></pre>
<h3>Indexing &amp; slicing</h3>
<p>Same style as Python lists, but works on N dimensions:</p>
<pre><code>sales = np.array([[100, 120, 90], [200, 210, 195]])  # 2 regions × 3 months
sales[0]        # first region's row: array([100, 120, 90])
sales[:, 1]     # every region's month-2 column: array([120, 210])
sales.shape     # (2, 3) — 2 rows, 3 columns
</code></pre>
<h3>Quick statistics</h3>
<p><code>np.mean</code>, <code>np.std</code>, <code>np.min/max</code>, <code>np.sum</code> — the building blocks for every KPI you'll compute later in pandas (pandas is built on top of NumPy).</p>
<div class="callout"><span class="badge">Rule of thumb</span> If you're writing a Python <code>for</code> loop to do arithmetic across a whole column of numbers, there's almost always a faster, one-line NumPy/pandas way.</div>`,
    `<span class="eyebrow">PBA301 · Chương 2 · Bài 2.1</span>
<h2>Cấu trúc dữ liệu &amp; NumPy</h2>
<h3>Vì sao không dùng list là đủ?</h3>
<p>Một <code>list</code> của Python chứa được bất cứ gì, nhưng tính toán trên nó chậm và cồng kềnh — bạn cần một vòng lặp chỉ để tăng 5% cho mọi giá. <strong><code>ndarray</code> của NumPy</strong> lưu số trong một khối bộ nhớ đặc, đồng nhất và áp phép toán lên <em>cả mảng một lúc</em> — gọi là <strong>vector hoá (vectorization)</strong>.</p>
<pre><code>import numpy as np

prices = np.array([10.0, 25.5, 8.0, 42.0])
prices_with_vat = prices * 1.10      # mọi phần tử × 1.10, không cần lặp
prices.mean()                         # 21.375
prices.sum()                          # 85.5
prices[prices &gt; 20]                   # array([25.5, 42.0]) — lọc bằng điều kiện
</code></pre>
<h3>Chỉ số &amp; slicing</h3>
<p>Cùng cách với list của Python, nhưng hoạt động trên nhiều chiều:</p>
<pre><code>sales = np.array([[100, 120, 90], [200, 210, 195]])  # 2 khu vực × 3 tháng
sales[0]        # dòng khu vực đầu: array([100, 120, 90])
sales[:, 1]     # cột tháng 2 của mọi khu vực: array([120, 210])
sales.shape     # (2, 3) — 2 dòng, 3 cột
</code></pre>
<h3>Thống kê nhanh</h3>
<p><code>np.mean</code>, <code>np.std</code>, <code>np.min/max</code>, <code>np.sum</code> — các khối dựng cho mọi KPI bạn sẽ tính sau này trong pandas (pandas được xây trên nền NumPy).</p>
<div class="callout"><span class="badge">Quy tắc chung</span> Nếu bạn đang viết vòng lặp <code>for</code> để tính toán trên cả một cột số, gần như luôn có cách NumPy/pandas nhanh hơn, viết trong một dòng.</div>`,
  ]]);

const c2q = quiz('pba301-quiz-2', 'Quiz 2 — NumPy|||Quiz 2 — NumPy', [
  { id: 'q1', question: 'Vì sao NumPy array tính toán nhanh hơn list thông thường?', options: ['Vì nó lưu chữ, không lưu số', 'Vì phép toán áp lên cả mảng cùng lúc (vectorized), không cần lặp', 'Vì nó không có chỉ số', 'Vì nó luôn có 1 chiều'], correctIndex: 1, explanation: 'Vectorization: NumPy áp phép toán lên toàn mảng một lượt, nhanh hơn vòng lặp Python.' },
  { id: 'q2', question: 'Với sales.shape = (2, 3), số 3 nghĩa là gì?', options: ['2 khu vực', '3 cột (ví dụ 3 tháng)', '3 khu vực', '6 phần tử'], correctIndex: 1, explanation: 'shape (dòng, cột) — 2 dòng (khu vực), 3 cột (tháng).' },
  { id: 'q3', question: 'prices[prices > 20] trả về gì?', options: ['Chỉ số của các phần tử lớn hơn 20', 'Các phần tử của prices có giá trị lớn hơn 20', 'Toàn bộ mảng prices', 'Lỗi cú pháp'], correctIndex: 1, explanation: 'Đây là lọc bằng điều kiện (boolean indexing): trả về các giá trị thoả điều kiện.' },
]);

const c3 = doc('pba301-3-1-pandas', '3.1 — pandas: Series/DataFrame, reading & writing data|||3.1 — pandas: Series/DataFrame, đọc/ghi dữ liệu',
  'Series (một cột có nhãn), DataFrame (bảng nhiều cột); đọc CSV/Excel với read_csv/read_excel, ghi ra file, xem nhanh với head/info.',
  [[
    `<span class="eyebrow">PBA301 · Chapter 3 · Lesson 3.1</span>
<h2>pandas: Series/DataFrame, reading &amp; writing data</h2>
<h3>Series &amp; DataFrame</h3>
<p>A <strong>Series</strong> is one labeled column of data (like a single spreadsheet column with row names). A <strong>DataFrame</strong> is a full table — multiple Series sharing the same row index, exactly like a spreadsheet with rows and columns.</p>
<pre><code>import pandas as pd

df = pd.DataFrame({
    "order_id": [1, 2, 3],
    "city": ["Hanoi", "HCMC", "Hanoi"],
    "revenue": [1200000, 850000, 990000],
})
df["revenue"]     # a Series — the revenue column
df.head()          # first 5 rows
df.info()          # column names, types, non-null counts
</code></pre>
<h3>Reading real business files</h3>
<pre><code>sales = pd.read_csv("sales_2026.csv")
sales_excel = pd.read_excel("sales_2026.xlsx", sheet_name="Q1")
</code></pre>
<h3>Writing results back out</h3>
<pre><code>summary = sales.groupby("city")["revenue"].sum()
summary.to_csv("summary_by_city.csv")
sales.to_excel("cleaned_sales.xlsx", index=False)
</code></pre>
<div class="callout"><span class="badge">The daily habit</span> After loading ANY file, run <code>.head()</code> and <code>.info()</code> before doing anything else — they catch wrong delimiters, unexpected columns and datatype surprises early.</div>`,
    `<span class="eyebrow">PBA301 · Chương 3 · Bài 3.1</span>
<h2>pandas: Series/DataFrame, đọc/ghi dữ liệu</h2>
<h3>Series &amp; DataFrame</h3>
<p>Một <strong>Series</strong> là một cột dữ liệu có nhãn (giống một cột bảng tính có tên dòng). Một <strong>DataFrame</strong> là cả một bảng — nhiều Series chung chỉ số dòng, giống hệt bảng tính có dòng và cột.</p>
<pre><code>import pandas as pd

df = pd.DataFrame({
    "order_id": [1, 2, 3],
    "city": ["Hanoi", "HCMC", "Hanoi"],
    "revenue": [1200000, 850000, 990000],
})
df["revenue"]     # một Series — cột doanh thu
df.head()          # 5 dòng đầu
df.info()          # tên cột, kiểu dữ liệu, số ô không rỗng
</code></pre>
<h3>Đọc file kinh doanh thật</h3>
<pre><code>sales = pd.read_csv("sales_2026.csv")
sales_excel = pd.read_excel("sales_2026.xlsx", sheet_name="Q1")
</code></pre>
<h3>Ghi kết quả ra file</h3>
<pre><code>summary = sales.groupby("city")["revenue"].sum()
summary.to_csv("summary_by_city.csv")
sales.to_excel("cleaned_sales.xlsx", index=False)
</code></pre>
<div class="callout"><span class="badge">Thói quen hằng ngày</span> Sau khi đọc BẤT KỲ file nào, chạy <code>.head()</code> và <code>.info()</code> trước khi làm gì khác — chúng bắt được dấu phân tách sai, cột lạ và kiểu dữ liệu bất ngờ từ sớm.</div>`,
  ]]);

const c3q = quiz('pba301-quiz-3', 'Quiz 3 — pandas Series/DataFrame|||Quiz 3 — pandas Series/DataFrame', [
  { id: 'q1', question: 'DataFrame khác Series ở điểm nào?', options: ['DataFrame chỉ có 1 cột, Series có nhiều cột', 'DataFrame là cả bảng nhiều cột, Series là một cột có nhãn', 'Chúng hoàn toàn giống nhau', 'Series chỉ dùng cho số, DataFrame chỉ dùng cho chữ'], correctIndex: 1, explanation: 'Series = một cột có nhãn; DataFrame = bảng gồm nhiều Series chung chỉ số dòng.' },
  { id: 'q2', question: 'Hàm nào đọc file CSV vào một DataFrame?', options: ['pd.read_excel()', 'pd.read_csv()', 'pd.to_csv()', 'df.info()'], correctIndex: 1, explanation: 'pd.read_csv() đọc CSV; pd.to_csv() dùng để GHI ra CSV.' },
  { id: 'q3', question: 'Nên làm gì ngay sau khi đọc một file dữ liệu mới?', options: ['Xoá toàn bộ dữ liệu thiếu ngay', 'Chạy .head() và .info() để kiểm tra nhanh', 'Vẽ biểu đồ ngay', 'Ghi lại file y như cũ'], correctIndex: 1, explanation: '.head()/.info() giúp phát hiện sớm cột sai, kiểu dữ liệu lạ trước khi xử lý sâu hơn.' },
]);

const c4 = doc('pba301-4-1-cleaning', '4.1 — Cleaning & transforming data|||4.1 — Làm sạch & biến đổi dữ liệu',
  'Dữ liệu thiếu (isna, dropna, fillna), gom nhóm & tổng hợp (groupby), gộp nhiều bảng (merge).',
  [[
    `<span class="eyebrow">PBA301 · Chapter 4 · Lesson 4.1</span>
<h2>Cleaning &amp; transforming data</h2>
<h3>Missing data</h3>
<p>Real business data always has gaps — a skipped survey field, a failed sensor reading. pandas marks missing values as <code>NaN</code>.</p>
<pre><code>df.isna().sum()                 # how many missing values per column
df.dropna()                      # drop rows with any missing value
df["revenue"].fillna(0)          # fill missing revenue with 0
df["revenue"].fillna(df["revenue"].mean())   # fill with the column average
</code></pre>
<h3>groupby — the analyst's most-used tool</h3>
<p><strong><code>groupby</code></strong> answers "totals/averages, broken down by category" — total revenue by city, average order size by month.</p>
<pre><code>df.groupby("city")["revenue"].sum()
df.groupby("city")["revenue"].agg(["sum", "mean", "count"])
</code></pre>
<h3>merge — combining tables</h3>
<p>Business data usually lives in more than one table: orders in one, customers in another. <strong><code>merge</code></strong> joins them on a shared key, like a spreadsheet VLOOKUP but for entire tables at once.</p>
<pre><code>orders = pd.DataFrame({"order_id": [1, 2], "customer_id": [10, 20], "revenue": [500, 700]})
customers = pd.DataFrame({"customer_id": [10, 20], "name": ["A Corp", "B Ltd"]})
pd.merge(orders, customers, on="customer_id", how="left")
</code></pre>
<div class="callout"><span class="badge">how=</span> <code>"left"</code> keeps every row of the left table even without a match; <code>"inner"</code> keeps only rows that matched in BOTH tables.</div>`,
    `<span class="eyebrow">PBA301 · Chương 4 · Bài 4.1</span>
<h2>Làm sạch &amp; biến đổi dữ liệu</h2>
<h3>Dữ liệu thiếu</h3>
<p>Dữ liệu kinh doanh thật luôn có lỗ hổng — một ô khảo sát bị bỏ trống, một cảm biến lỗi. pandas đánh dấu giá trị thiếu là <code>NaN</code>.</p>
<pre><code>df.isna().sum()                 # mỗi cột thiếu bao nhiêu giá trị
df.dropna()                      # bỏ các dòng có bất kỳ giá trị thiếu
df["revenue"].fillna(0)          # điền 0 cho doanh thu thiếu
df["revenue"].fillna(df["revenue"].mean())   # điền bằng giá trị trung bình cột
</code></pre>
<h3>groupby — công cụ dùng nhiều nhất của người phân tích</h3>
<p><strong><code>groupby</code></strong> trả lời câu "tổng/trung bình, chia theo nhóm" — tổng doanh thu theo thành phố, quy mô đơn hàng trung bình theo tháng.</p>
<pre><code>df.groupby("city")["revenue"].sum()
df.groupby("city")["revenue"].agg(["sum", "mean", "count"])
</code></pre>
<h3>merge — gộp nhiều bảng</h3>
<p>Dữ liệu kinh doanh thường nằm ở nhiều bảng: đơn hàng ở một bảng, khách hàng ở bảng khác. <strong><code>merge</code></strong> gộp chúng theo một khoá chung, giống VLOOKUP của bảng tính nhưng làm cho cả bảng một lượt.</p>
<pre><code>orders = pd.DataFrame({"order_id": [1, 2], "customer_id": [10, 20], "revenue": [500, 700]})
customers = pd.DataFrame({"customer_id": [10, 20], "name": ["A Corp", "B Ltd"]})
pd.merge(orders, customers, on="customer_id", how="left")
</code></pre>
<div class="callout"><span class="badge">how=</span> <code>"left"</code> giữ mọi dòng của bảng trái dù không khớp; <code>"inner"</code> chỉ giữ các dòng khớp ở CẢ HAI bảng.</div>`,
  ]]);

const c4q = quiz('pba301-quiz-4', 'Quiz 4 — Cleaning & transforming|||Quiz 4 — Làm sạch & biến đổi', [
  { id: 'q1', question: 'pandas đánh dấu một giá trị bị thiếu bằng gì?', options: ['0', 'NaN', 'null string', '-1'], correctIndex: 1, explanation: 'Giá trị thiếu trong pandas được biểu diễn bằng NaN (Not a Number).' },
  { id: 'q2', question: 'groupby("city")["revenue"].sum() trả lời câu hỏi nào?', options: ['Doanh thu trung bình toàn công ty', 'Tổng doanh thu theo từng thành phố', 'Số đơn hàng bị thiếu dữ liệu', 'Danh sách khách hàng'], correctIndex: 1, explanation: 'groupby gom theo "city" rồi sum() tính tổng doanh thu cho từng nhóm.' },
  { id: 'q3', question: 'merge với how="inner" giữ lại những dòng nào?', options: ['Mọi dòng của cả hai bảng', 'Chỉ các dòng khớp khoá ở CẢ HAI bảng', 'Chỉ dòng của bảng trái', 'Không dòng nào'], correctIndex: 1, explanation: 'inner join chỉ giữ các dòng có khoá khớp ở cả hai bảng; left giữ toàn bộ bảng trái.' },
]);

const c5 = doc('pba301-5-1-visualization', '5.1 — Visualization with matplotlib & seaborn|||5.1 — Trực quan hoá với matplotlib & seaborn',
  'Biểu đồ đường (xu hướng theo thời gian), biểu đồ cột (so sánh nhóm), scatter (mối quan hệ hai biến); chọn đúng loại biểu đồ.',
  [[
    `<span class="eyebrow">PBA301 · Chapter 5 · Lesson 5.1</span>
<h2>Visualization with matplotlib &amp; seaborn</h2>
<h3>matplotlib — the foundation</h3>
<pre><code>import matplotlib.pyplot as plt

monthly_revenue.plot(kind="line", title="Revenue by month")
plt.xlabel("Month"); plt.ylabel("Revenue"); plt.show()
</code></pre>
<h3>seaborn — statistical charts, less code</h3>
<pre><code>import seaborn as sns

sns.barplot(data=df, x="city", y="revenue")     # compare categories
sns.scatterplot(data=df, x="ad_spend", y="revenue")  # relationship between two numbers
sns.heatmap(df.corr(), annot=True)                # correlation matrix at a glance
</code></pre>
<h3>Choosing the right chart</h3>
<ul>
<li><strong>Line chart</strong> — a trend over time (monthly revenue).</li>
<li><strong>Bar chart</strong> — comparing categories (revenue by city).</li>
<li><strong>Scatter plot</strong> — the relationship between two numeric variables (ad spend vs. revenue).</li>
<li><strong>Histogram</strong> — the distribution/spread of one variable (order sizes).</li>
</ul>
<div class="callout"><span class="badge">Rule of thumb</span> Pick the chart type from the QUESTION you're answering (trend? comparison? relationship? spread?) — not from what looks pretty.</div>`,
    `<span class="eyebrow">PBA301 · Chương 5 · Bài 5.1</span>
<h2>Trực quan hoá với matplotlib &amp; seaborn</h2>
<h3>matplotlib — nền tảng</h3>
<pre><code>import matplotlib.pyplot as plt

monthly_revenue.plot(kind="line", title="Doanh thu theo tháng")
plt.xlabel("Tháng"); plt.ylabel("Doanh thu"); plt.show()
</code></pre>
<h3>seaborn — biểu đồ thống kê, ít code hơn</h3>
<pre><code>import seaborn as sns

sns.barplot(data=df, x="city", y="revenue")     # so sánh các nhóm
sns.scatterplot(data=df, x="ad_spend", y="revenue")  # quan hệ giữa hai biến số
sns.heatmap(df.corr(), annot=True)                # nhìn nhanh ma trận tương quan
</code></pre>
<h3>Chọn đúng loại biểu đồ</h3>
<ul>
<li><strong>Biểu đồ đường</strong> — xu hướng theo thời gian (doanh thu theo tháng).</li>
<li><strong>Biểu đồ cột</strong> — so sánh các nhóm (doanh thu theo thành phố).</li>
<li><strong>Scatter plot</strong> — mối quan hệ giữa hai biến số (chi phí quảng cáo và doanh thu).</li>
<li><strong>Histogram</strong> — phân bố/độ trải rộng của một biến (quy mô đơn hàng).</li>
</ul>
<div class="callout"><span class="badge">Quy tắc chung</span> Chọn loại biểu đồ theo CÂU HỎI bạn đang trả lời (xu hướng? so sánh? quan hệ? phân bố?) — không chọn theo cái nhìn bắt mắt.</div>`,
  ]]);

const c5q = quiz('pba301-quiz-5', 'Quiz 5 — Visualization|||Quiz 5 — Trực quan hoá', [
  { id: 'q1', question: 'Muốn xem xu hướng doanh thu theo từng tháng trong năm, nên dùng biểu đồ nào?', options: ['Biểu đồ đường (line)', 'Scatter plot', 'Heatmap', 'Pie chart'], correctIndex: 0, explanation: 'Biểu đồ đường phù hợp nhất để thể hiện xu hướng theo thời gian.' },
  { id: 'q2', question: 'sns.scatterplot dùng để thể hiện điều gì?', options: ['So sánh các nhóm riêng biệt', 'Mối quan hệ giữa hai biến số', 'Phân bố của một biến duy nhất', 'Tổng theo thời gian'], correctIndex: 1, explanation: 'Scatter plot thể hiện quan hệ giữa hai biến số, ví dụ chi tiêu quảng cáo và doanh thu.' },
  { id: 'q3', question: 'Nên chọn loại biểu đồ dựa vào điều gì?', options: ['Màu sắc đẹp nhất', 'Câu hỏi phân tích đang cần trả lời', 'Loại biểu đồ dùng lần trước', 'Số cột dữ liệu có sẵn'], correctIndex: 1, explanation: 'Loại biểu đồ nên chọn theo câu hỏi (xu hướng/so sánh/quan hệ/phân bố), không theo hình thức.' },
]);

const c6 = doc('pba301-6-1-stats-eda', '6.1 — Descriptive statistics & exploratory data analysis (EDA)|||6.1 — Thống kê mô tả & phân tích khám phá (EDA)',
  'Trung bình, trung vị, độ lệch chuẩn, describe(); tương quan (correlation); quy trình EDA để hiểu dữ liệu trước khi mô hình hoá.',
  [[
    `<span class="eyebrow">PBA301 · Chapter 6 · Lesson 6.1</span>
<h2>Descriptive statistics &amp; EDA</h2>
<h3>The core descriptive numbers</h3>
<ul>
<li><strong>Mean</strong> — the average; sensitive to extreme values (outliers).</li>
<li><strong>Median</strong> — the middle value; NOT affected by extreme outliers — often a better "typical" figure for skewed data like income.</li>
<li><strong>Standard deviation</strong> — how spread out the values are around the mean.</li>
</ul>
<pre><code>df["revenue"].mean()
df["revenue"].median()
df["revenue"].std()
df.describe()      # all of the above, for every numeric column, at once
</code></pre>
<h3>Correlation</h3>
<p><strong>Correlation</strong> (−1 to +1) measures how strongly two numeric variables move together. +1 = move perfectly together, −1 = move perfectly opposite, 0 = no relationship.</p>
<pre><code>df[["ad_spend", "revenue"]].corr()
</code></pre>
<h3>Exploratory Data Analysis (EDA)</h3>
<p><strong>EDA</strong> is the habit of understanding a dataset BEFORE building any model: check shape (<code>.shape</code>), types (<code>.info()</code>), missing values, describe(), and a few quick charts. Skipping EDA is the #1 cause of building a model on garbage data.</p>
<div class="callout"><span class="badge">Mean vs. median</span> Correlation does NOT imply causation — ad spend and revenue moving together doesn't prove the ads caused the sales.</div>`,
    `<span class="eyebrow">PBA301 · Chương 6 · Bài 6.1</span>
<h2>Thống kê mô tả &amp; EDA</h2>
<h3>Các số mô tả cốt lõi</h3>
<ul>
<li><strong>Trung bình (mean)</strong> — giá trị bình quân; nhạy với giá trị bất thường (outlier).</li>
<li><strong>Trung vị (median)</strong> — giá trị nằm giữa; KHÔNG bị ảnh hưởng bởi outlier — thường là con số "điển hình" tốt hơn cho dữ liệu lệch như thu nhập.</li>
<li><strong>Độ lệch chuẩn (std)</strong> — dữ liệu trải rộng quanh trung bình bao nhiêu.</li>
</ul>
<pre><code>df["revenue"].mean()
df["revenue"].median()
df["revenue"].std()
df.describe()      # tất cả số trên, cho mọi cột số, một lượt
</code></pre>
<h3>Tương quan (correlation)</h3>
<p><strong>Tương quan</strong> (từ −1 đến +1) đo mức độ hai biến số di chuyển cùng nhau. +1 = cùng chiều hoàn toàn, −1 = ngược chiều hoàn toàn, 0 = không liên quan.</p>
<pre><code>df[["ad_spend", "revenue"]].corr()
</code></pre>
<h3>Phân tích khám phá dữ liệu (EDA)</h3>
<p><strong>EDA</strong> là thói quen hiểu dữ liệu TRƯỚC KHI dựng bất kỳ mô hình nào: kiểm kích thước (<code>.shape</code>), kiểu dữ liệu (<code>.info()</code>), giá trị thiếu, describe(), và vài biểu đồ nhanh. Bỏ qua EDA là nguyên nhân số 1 khiến mô hình dựng trên dữ liệu rác.</p>
<div class="callout"><span class="badge">Trung bình vs. trung vị</span> Tương quan KHÔNG chứng minh nhân quả — chi quảng cáo và doanh thu cùng tăng không chứng minh quảng cáo là nguyên nhân gây ra doanh số.</div>`,
  ]]);

const c6q = quiz('pba301-quiz-6', 'Quiz 6 — Descriptive stats & EDA|||Quiz 6 — Thống kê mô tả & EDA', [
  { id: 'q1', question: 'Khi dữ liệu có vài giá trị bất thường rất lớn, số nào ít bị ảnh hưởng hơn?', options: ['Trung bình (mean)', 'Trung vị (median)', 'Tổng (sum)', 'Độ lệch chuẩn (std)'], correctIndex: 1, explanation: 'Trung vị không bị kéo lệch bởi outlier như trung bình.' },
  { id: 'q2', question: 'Hệ số tương quan bằng 0 nghĩa là gì?', options: ['Hai biến luôn bằng nhau', 'Hai biến không có quan hệ tuyến tính rõ rệt', 'Hai biến ngược chiều hoàn toàn', 'Dữ liệu bị lỗi'], correctIndex: 1, explanation: 'Tương quan 0 nghĩa là không thấy quan hệ tuyến tính giữa hai biến.' },
  { id: 'q3', question: 'EDA nên được thực hiện vào lúc nào trong quy trình phân tích?', options: ['Sau khi đã dựng xong mô hình dự báo', 'Trước khi dựng bất kỳ mô hình nào', 'Chỉ khi báo cáo bị sai', 'Không cần thiết nếu dữ liệu đến từ CSV'], correctIndex: 1, explanation: 'EDA giúp hiểu và phát hiện vấn đề của dữ liệu trước khi mô hình hoá, tránh "rác vào, rác ra".' },
]);

const c7 = doc('pba301-7-1-regression', '7.1 — Regression & basic business forecasting|||7.1 — Hồi quy & dự báo kinh doanh cơ bản',
  'Hồi quy tuyến tính đơn biến (y = a + bx); dùng scikit-learn để khớp mô hình và dự báo; đánh giá bằng R².',
  [[
    `<span class="eyebrow">PBA301 · Chapter 7 · Lesson 7.1</span>
<h2>Regression &amp; basic business forecasting</h2>
<h3>Linear regression — the simplest forecasting model</h3>
<p><strong>Linear regression</strong> fits a straight line <code>y = a + b·x</code> through the data, letting you predict <code>y</code> (e.g. revenue) from <code>x</code> (e.g. ad spend or month number). <code>b</code> is the slope — how much <code>y</code> changes per unit of <code>x</code>.</p>
<pre><code>from sklearn.linear_model import LinearRegression

X = df[["ad_spend"]]     # features must be 2D
y = df["revenue"]

model = LinearRegression()
model.fit(X, y)

model.coef_        # b — revenue gained per extra dollar of ad spend
model.intercept_   # a — baseline revenue with zero ad spend
model.predict([[5000]])   # forecast: revenue if ad_spend = 5000
</code></pre>
<h3>How good is the model?</h3>
<p><strong>R² (R-squared)</strong>, from 0 to 1, tells you how much of the variation in <code>y</code> the model explains. R² = 0.8 means the model explains 80% of the pattern; the rest is noise or missing factors.</p>
<pre><code>model.score(X, y)   # R²
</code></pre>
<div class="callout"><span class="badge">Extrapolation warning</span> A model fit on ad spend between $1,000–$10,000 should NOT be trusted to forecast at $100,000 — you're extrapolating far outside the data it learned from.</div>`,
    `<span class="eyebrow">PBA301 · Chương 7 · Bài 7.1</span>
<h2>Hồi quy &amp; dự báo kinh doanh cơ bản</h2>
<h3>Hồi quy tuyến tính — mô hình dự báo đơn giản nhất</h3>
<p><strong>Hồi quy tuyến tính</strong> khớp một đường thẳng <code>y = a + b·x</code> qua dữ liệu, cho phép dự báo <code>y</code> (vd doanh thu) từ <code>x</code> (vd chi quảng cáo hoặc số thứ tự tháng). <code>b</code> là độ dốc — <code>y</code> thay đổi bao nhiêu khi <code>x</code> tăng một đơn vị.</p>
<pre><code>from sklearn.linear_model import LinearRegression

X = df[["ad_spend"]]     # đặc trưng (feature) phải là dạng 2 chiều
y = df["revenue"]

model = LinearRegression()
model.fit(X, y)

model.coef_        # b — doanh thu tăng thêm trên mỗi đô la chi quảng cáo
model.intercept_   # a — doanh thu nền khi chi quảng cáo bằng 0
model.predict([[5000]])   # dự báo: doanh thu nếu chi quảng cáo = 5000
</code></pre>
<h3>Mô hình tốt tới đâu?</h3>
<p><strong>R² (R-squared)</strong>, từ 0 tới 1, cho biết mô hình giải thích được bao nhiêu phần biến động của <code>y</code>. R² = 0,8 nghĩa là mô hình giải thích được 80% quy luật; phần còn lại là nhiễu hoặc yếu tố còn thiếu.</p>
<pre><code>model.score(X, y)   # R²
</code></pre>
<div class="callout"><span class="badge">Cảnh báo ngoại suy</span> Một mô hình khớp trên dữ liệu chi quảng cáo từ 1.000–10.000 đô KHÔNG nên được tin để dự báo ở mức 100.000 đô — đó là ngoại suy quá xa dữ liệu đã học.</div>`,
  ]]);

const c7q = quiz('pba301-quiz-7', 'Quiz 7 — Regression & forecasting|||Quiz 7 — Hồi quy & dự báo', [
  { id: 'q1', question: 'Trong hồi quy tuyến tính y = a + b·x, hệ số b đại diện cho điều gì?', options: ['Giá trị y khi x = 0', 'Độ dốc — y thay đổi bao nhiêu khi x tăng 1 đơn vị', 'Số lượng quan sát', 'Sai số của mô hình'], correctIndex: 1, explanation: 'b là độ dốc của đường hồi quy, thể hiện mức thay đổi của y theo x.' },
  { id: 'q2', question: 'R² = 0,8 có nghĩa là gì?', options: ['Mô hình sai 80%', 'Mô hình giải thích được 80% biến động của y', 'Có 80% dữ liệu bị thiếu', 'Độ dốc b bằng 0,8'], correctIndex: 1, explanation: 'R² đo tỉ lệ biến động của biến phụ thuộc được mô hình giải thích.' },
  { id: 'q3', question: 'Vì sao không nên dùng mô hình để dự báo ở mức x vượt xa dữ liệu huấn luyện?', options: ['Vì Python sẽ báo lỗi', 'Vì đó là ngoại suy, mô hình không được kiểm chứng ở vùng đó', 'Vì R² sẽ tự động giảm về 0', 'Vì scikit-learn cấm điều này'], correctIndex: 1, explanation: 'Ngoại suy ra ngoài phạm vi dữ liệu học không đảm bảo quan hệ tuyến tính vẫn đúng.' },
]);

const c8 = doc('pba301-8-1-dashboard-case-study', '8.1 — Application: dashboards, automated reports & a business case study|||8.1 — Ứng dụng: dashboard, báo cáo tự động & case study kinh doanh',
  'Từ phân tích rời rạc tới báo cáo lặp lại được; ghép notebook thành pipeline; case study: phân tích doanh thu theo khu vực.',
  [[
    `<span class="eyebrow">PBA301 · Chapter 8 · Lesson 8.1</span>
<h2>Application: dashboards, automated reports &amp; a business case study</h2>
<h3>From one-off analysis to a repeatable report</h3>
<p>Everything in Chapters 1–7 — load, clean, group, chart, describe, forecast — can be chained into ONE script that runs every time new data arrives, instead of being redone by hand.</p>
<pre><code>def monthly_report(csv_path):
    df = pd.read_csv(csv_path)
    df = df.dropna(subset=["revenue"])
    by_city = df.groupby("city")["revenue"].sum().sort_values(ascending=False)

    by_city.plot(kind="bar", title="Revenue by city")
    plt.savefig("report_chart.png")

    by_city.to_csv("report_summary.csv")
    return by_city

monthly_report("sales_2026_09.csv")   # re-run every month with the new file
</code></pre>
<h3>Case study — regional revenue analysis</h3>
<p>A retail chain wants to know: which cities are underperforming, and why? A typical analyst workflow:</p>
<ol>
<li><strong>Load &amp; clean</strong> — orders CSV, drop rows with missing revenue.</li>
<li><strong>groupby city</strong> — total &amp; average revenue per city.</li>
<li><strong>Visualize</strong> — bar chart of revenue by city, line chart of the trend over months.</li>
<li><strong>Correlate</strong> — does ad spend per city explain the difference?</li>
<li><strong>Forecast</strong> — a simple linear regression to project next quarter per city.</li>
<li><strong>Report</strong> — one script that regenerates the chart + summary CSV for management, every month.</li>
</ol>
<div class="callout"><span class="badge">The real skill</span> The Python syntax is the easy part. The valuable skill is turning a business question ("why is Da Nang underperforming?") into the right sequence of pandas operations — that only comes from practicing on real, messy data.</div>`,
    `<span class="eyebrow">PBA301 · Chương 8 · Bài 8.1</span>
<h2>Ứng dụng: dashboard, báo cáo tự động &amp; case study kinh doanh</h2>
<h3>Từ phân tích rời rạc tới báo cáo lặp lại được</h3>
<p>Mọi thứ ở Chương 1–7 — đọc, làm sạch, gom nhóm, vẽ biểu đồ, mô tả, dự báo — có thể ghép thành MỘT script chạy lại mỗi khi có dữ liệu mới, thay vì làm tay lại từ đầu.</p>
<pre><code>def monthly_report(csv_path):
    df = pd.read_csv(csv_path)
    df = df.dropna(subset=["revenue"])
    by_city = df.groupby("city")["revenue"].sum().sort_values(ascending=False)

    by_city.plot(kind="bar", title="Doanh thu theo thành phố")
    plt.savefig("report_chart.png")

    by_city.to_csv("report_summary.csv")
    return by_city

monthly_report("sales_2026_09.csv")   # chạy lại mỗi tháng với file mới
</code></pre>
<h3>Case study — phân tích doanh thu theo khu vực</h3>
<p>Một chuỗi bán lẻ muốn biết: thành phố nào đang kém hiệu quả, và vì sao? Quy trình điển hình của người phân tích:</p>
<ol>
<li><strong>Đọc &amp; làm sạch</strong> — CSV đơn hàng, bỏ dòng thiếu doanh thu.</li>
<li><strong>groupby theo thành phố</strong> — tổng &amp; trung bình doanh thu mỗi thành phố.</li>
<li><strong>Trực quan hoá</strong> — biểu đồ cột doanh thu theo thành phố, biểu đồ đường xu hướng theo tháng.</li>
<li><strong>Tương quan</strong> — chi quảng cáo theo thành phố có giải thích được sự khác biệt không?</li>
<li><strong>Dự báo</strong> — hồi quy tuyến tính đơn giản để ước tính quý sau cho mỗi thành phố.</li>
<li><strong>Báo cáo</strong> — một script tự sinh lại biểu đồ + file CSV tổng hợp cho quản lý, mỗi tháng.</li>
</ol>
<div class="callout"><span class="badge">Kỹ năng thật sự</span> Cú pháp Python là phần dễ. Kỹ năng đáng giá là biến một câu hỏi kinh doanh ("vì sao Đà Nẵng kém hiệu quả?") thành đúng chuỗi thao tác pandas — điều này chỉ có được khi luyện tập trên dữ liệu thật, lộn xộn.</div>`,
  ]]);

const c8q = quiz('pba301-quiz-8', 'Quiz 8 — Dashboards & case study|||Quiz 8 — Dashboard & case study', [
  { id: 'q1', question: 'Vì sao nên đóng gói các bước phân tích thành một hàm/script?', options: ['Để chạy chậm hơn cho chắc', 'Để chạy lại được mỗi khi có dữ liệu mới, không cần làm tay lại', 'Vì pandas yêu cầu bắt buộc', 'Để tránh dùng groupby'], correctIndex: 1, explanation: 'Đóng gói thành script/hàm giúp báo cáo lặp lại được, tiết kiệm công sức mỗi kỳ.' },
  { id: 'q2', question: 'Trong case study doanh thu theo khu vực, bước nào dùng để so sánh các thành phố với nhau?', options: ['Đọc file CSV', 'groupby theo thành phố', 'Import thư viện', 'Đặt tên biến'], correctIndex: 1, explanation: 'groupby theo thành phố cho phép tổng hợp và so sánh doanh thu giữa các thành phố.' },
  { id: 'q3', question: 'Kỹ năng quan trọng nhất của một nhà phân tích, theo bài học này, là gì?', options: ['Nhớ hết cú pháp Python', 'Biến câu hỏi kinh doanh thành đúng chuỗi thao tác dữ liệu', 'Vẽ biểu đồ nhiều màu', 'Viết code càng dài càng tốt'], correctIndex: 1, explanation: 'Cú pháp là công cụ; giá trị thật nằm ở việc chuyển câu hỏi kinh doanh thành các bước xử lý dữ liệu đúng.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'PBA301',
    slug: 'pba301-python-for-business-analytics',
    title: 'Python for Business Analytics',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/PBA301.webp',
    shortDescription: 'Python for business analytics — variables & control flow, NumPy arrays, pandas Series/DataFrame, data cleaning (missing values, groupby, merge), visualization, descriptive stats & EDA, basic regression/forecasting, dashboards & reports.|||Python cho phân tích kinh doanh — biến & cấu trúc điều khiển, mảng NumPy, pandas Series/DataFrame, làm sạch dữ liệu (thiếu dữ liệu, groupby, merge), trực quan hoá, thống kê mô tả & EDA, hồi quy/dự báo cơ bản, dashboard & báo cáo.',
    description: 'Môn <strong>PBA301 — Python for Business Analytics</strong> (kỳ 3) trang bị kỹ năng dùng <strong>Python</strong> để phân tích dữ liệu kinh doanh. Từ <strong>Python cơ bản</strong> (biến, cấu trúc điều khiển) → <strong>NumPy</strong> (mảng, vector hoá) → <strong>pandas</strong> (Series/DataFrame, đọc/ghi dữ liệu) → <strong>làm sạch &amp; biến đổi</strong> (dữ liệu thiếu, groupby, merge) → <strong>trực quan hoá</strong> (matplotlib/seaborn) → <strong>thống kê mô tả &amp; EDA</strong> → <strong>hồi quy/dự báo cơ bản</strong> → <strong>dashboard, báo cáo tự động &amp; case study</strong>. Tham khảo "Python for Data Analysis" (McKinney) &amp; "Python for Finance" (Hilpisch). Song ngữ, có ví dụ mã và quiz mỗi chương.',
    whatYouLearn: 'Biến, kiểu dữ liệu, cấu trúc điều khiển, hàm; mảng NumPy & phép toán vector hoá; pandas Series/DataFrame, đọc/ghi CSV/Excel; xử lý dữ liệu thiếu, groupby, merge; vẽ biểu đồ đường/cột/scatter với matplotlib & seaborn; thống kê mô tả (mean/median/std), tương quan, quy trình EDA; hồi quy tuyến tính & dự báo cơ bản với scikit-learn, đánh giá bằng R²; đóng gói phân tích thành báo cáo/dashboard tự động qua case study kinh doanh thật.',
    requirements: 'Đã quen cú pháp Python cơ bản (biến, vòng lặp, hàm) là một lợi thế nhưng không bắt buộc — chương 1 ôn lại từ đầu. Nên dùng Google Colab hoặc Jupyter Notebook để thực hành theo bài.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách nền, tài liệu chính thức pandas/NumPy/matplotlib, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Vì sao dùng Python, bộ công cụ, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Python cơ bản|||Chapter 1 — Python basics', description: 'Biến, kiểu dữ liệu, cấu trúc điều khiển, hàm.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Cấu trúc dữ liệu & NumPy|||Chapter 2 — Data structures & NumPy', description: 'ndarray, vector hoá, chỉ số/slicing, thống kê nhanh.', lessons: [c2, c2q] },
    { title: 'Chương 3 — pandas: Series/DataFrame|||Chapter 3 — pandas: Series/DataFrame', description: 'Series, DataFrame, đọc/ghi CSV/Excel.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Làm sạch & biến đổi dữ liệu|||Chapter 4 — Cleaning & transforming data', description: 'Dữ liệu thiếu, groupby, merge.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Trực quan hoá|||Chapter 5 — Visualization', description: 'matplotlib/seaborn, chọn đúng loại biểu đồ.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Thống kê mô tả & EDA|||Chapter 6 — Descriptive statistics & EDA', description: 'Mean/median/std, tương quan, quy trình EDA.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Hồi quy & dự báo|||Chapter 7 — Regression & forecasting', description: 'Hồi quy tuyến tính, scikit-learn, R².', lessons: [c7, c7q] },
    { title: 'Chương 8 — Dashboard & case study|||Chapter 8 — Dashboards & case study', description: 'Báo cáo tự động, case study doanh thu theo khu vực.', lessons: [c8, c8q] },
  ],
};
