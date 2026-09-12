/**
 * MAS202 — Applied Statistics for Business (Thống kê ứng dụng trong kinh doanh). Khối QTKD, kỳ 3.
 * Bám cấu trúc giáo trình thống kê kinh doanh chuẩn quốc tế (vd Anderson, Sweeney & Williams —
 * Statistics for Business and Economics; Levine et al. — Statistics for Managers Using Microsoft Excel;
 * OpenStax — Introductory Business Statistics): dữ liệu & thống kê mô tả, xác suất & Bayes, phân phối
 * nhị thức/Poisson/chuẩn, phân phối mẫu & định lý giới hạn trung tâm, khoảng tin cậy, kiểm định giả thuyết
 * (z, t, tỷ lệ, hai mẫu, khi bình phương, ANOVA), tương quan & hồi quy. Song ngữ + ví dụ số (đã kiểm bằng
 * máy; dữ liệu là GIẢ ĐỊNH) + bài tập + quiz.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('mas202-0-1-overview', 'Course overview: statistics for business decisions|||Tổng quan: thống kê cho quyết định kinh doanh',
  'Thống kê mô tả và thống kê suy diễn, tổng thể và mẫu, tham số và thống kê, các loại dữ liệu và bốn thang đo, cách chọn mẫu, bảng và biểu đồ theo loại dữ liệu, lộ trình môn.',
  [[
    `<span class="eyebrow">MAS202 · Lesson 0.1 · Overview</span>
<h2>Applied Statistics for Business</h2>
<p class="lead">Managers decide under uncertainty every day: how much stock to order, whether a campaign worked, which supplier is more reliable. Statistics is the discipline of collecting, describing and analysing data so that those decisions rest on evidence rather than on hunches.</p>
<h3>Descriptive vs inferential statistics</h3>
<p><strong>Descriptive statistics</strong> summarises the data you have — tables, charts, averages, measures of spread. <strong>Inferential statistics</strong> uses a <strong>sample</strong> to draw conclusions about a larger <strong>population</strong> and states how confident we can be. A number that describes a population (μ, σ, p) is a <strong>parameter</strong>; the matching number computed from a sample (x̄, s, p̂) is a <strong>statistic</strong> and is used to estimate the parameter.</p>
<h3>Types of data and scales of measurement</h3>
<table>
<tr><th>Scale</th><th>What it allows</th><th>Business example</th></tr>
<tr><td>Nominal</td><td>Labels only: count categories, find the mode</td><td>Payment method, region, product category</td></tr>
<tr><td>Ordinal</td><td>Order, but the gaps are not equal</td><td>Satisfaction rating 1–5, credit rating AAA / AA / A</td></tr>
<tr><td>Interval</td><td>Equal gaps but no true zero: differences make sense, ratios do not</td><td>Temperature in °C, calendar year</td></tr>
<tr><td>Ratio</td><td>Equal gaps and a true zero: all arithmetic is meaningful</td><td>Revenue, price, units sold, delivery time</td></tr>
</table>
<p>Nominal and ordinal data are <strong>categorical</strong> (qualitative); interval and ratio data are <strong>quantitative</strong>. Quantitative data are either <strong>discrete</strong> (counts: customers per hour) or <strong>continuous</strong> (measurements: weight, time). Data collected across many units at one point in time are <strong>cross-sectional</strong>; data on one unit over time form a <strong>time series</strong>.</p>
<h3>Collecting data: samples</h3>
<ul>
<li><strong>Simple random sample</strong> — every member of the population has the same chance of being selected; all the formulas in this course assume it.</li>
<li><strong>Systematic</strong> (every k-th item on a list), <strong>stratified</strong> (random samples within groups such as regions) and <strong>cluster</strong> sampling (randomly chosen whole groups such as stores) are practical variations.</li>
<li><strong>Convenience</strong> samples (whoever answers an online poll) are cheap but can be badly biased — no formula can repair a biased sample.</li>
</ul>
<h3>Summarising with tables and charts</h3>
<p>Categorical data: frequency and relative-frequency tables, bar charts and pie charts; two categorical variables: a <strong>contingency table</strong> (crosstab). Quantitative data: frequency distributions with classes, <strong>histograms</strong>, stem-and-leaf displays and box plots; two quantitative variables: a <strong>scatter plot</strong>; data over time: a line chart. Excel (PivotTables and the Analysis ToolPak), jamovi or R produce all of them.</p>
<h3>Roadmap</h3>
<p>Part 1: numerical descriptive measures · Part 2: probability and probability distributions · Part 3: sampling distributions, confidence intervals and hypothesis tests · Part 4: comparing groups (two-sample t, chi-square, ANOVA) and regression. Every data set in this course is illustrative (assumed), and every number has been checked by computer and rounded as shown.</p>
<div class="callout"><span class="badge">One idea to keep</span> A statistic computed from a sample changes from one sample to the next. Inference is the art of measuring that variation and deciding whether a pattern is real or just sampling noise.</div>`,
    `<span class="eyebrow">MAS202 · Bài 0.1 · Tổng quan</span>
<h2>Thống kê ứng dụng trong kinh doanh</h2>
<p class="lead">Nhà quản lý ra quyết định trong điều kiện bất định mỗi ngày: đặt bao nhiêu hàng, chiến dịch quảng cáo có hiệu quả không, nhà cung cấp nào đáng tin cậy hơn. Thống kê là môn khoa học về thu thập, mô tả và phân tích dữ liệu để các quyết định đó dựa trên bằng chứng chứ không dựa trên cảm tính.</p>
<h3>Thống kê mô tả và thống kê suy diễn</h3>
<p><strong>Thống kê mô tả</strong> tóm tắt dữ liệu đang có — bảng, biểu đồ, số trung bình, các thước đo độ phân tán. <strong>Thống kê suy diễn</strong> dùng một <strong>mẫu</strong> để rút ra kết luận về một <strong>tổng thể</strong> lớn hơn và cho biết mức độ tin cậy của kết luận. Một con số mô tả tổng thể (μ, σ, p) là <strong>tham số</strong>; con số tương ứng tính từ mẫu (x̄, s, p̂) là <strong>thống kê</strong> và được dùng để ước lượng tham số.</p>
<h3>Các loại dữ liệu và thang đo</h3>
<table>
<tr><th>Thang đo</th><th>Cho phép làm gì</th><th>Ví dụ trong kinh doanh</th></tr>
<tr><td>Định danh</td><td>Chỉ là nhãn: đếm số lượng mỗi loại, tìm mốt</td><td>Phương thức thanh toán, khu vực, nhóm sản phẩm</td></tr>
<tr><td>Thứ bậc</td><td>Có thứ tự, nhưng khoảng cách giữa các mức không bằng nhau</td><td>Mức hài lòng 1–5, xếp hạng tín nhiệm AAA / AA / A</td></tr>
<tr><td>Khoảng</td><td>Khoảng cách đều nhưng không có điểm 0 tuyệt đối: hiệu số có nghĩa, tỷ số thì không</td><td>Nhiệt độ °C, năm dương lịch</td></tr>
<tr><td>Tỷ lệ</td><td>Khoảng cách đều và có điểm 0 tuyệt đối: mọi phép tính đều có nghĩa</td><td>Doanh thu, giá bán, số đơn vị bán, thời gian giao hàng</td></tr>
</table>
<p>Dữ liệu định danh và thứ bậc là dữ liệu <strong>định tính</strong> (phân loại); dữ liệu khoảng và tỷ lệ là dữ liệu <strong>định lượng</strong>. Dữ liệu định lượng có thể <strong>rời rạc</strong> (đếm được: số khách mỗi giờ) hoặc <strong>liên tục</strong> (đo lường: khối lượng, thời gian). Dữ liệu thu thập trên nhiều đối tượng tại cùng một thời điểm là <strong>dữ liệu chéo</strong>; dữ liệu của một đối tượng theo thời gian là <strong>chuỗi thời gian</strong>.</p>
<h3>Thu thập dữ liệu: chọn mẫu</h3>
<ul>
<li><strong>Mẫu ngẫu nhiên đơn giản</strong> — mọi phần tử của tổng thể có cùng khả năng được chọn; mọi công thức trong môn này đều giả định điều đó.</li>
<li>Chọn mẫu <strong>hệ thống</strong> (cứ k phần tử lấy một trong danh sách), <strong>phân tầng</strong> (lấy mẫu ngẫu nhiên trong từng nhóm như khu vực) và <strong>cả khối</strong> (chọn ngẫu nhiên nguyên cả nhóm như cửa hàng) là các biến thể thực tế.</li>
<li>Mẫu <strong>thuận tiện</strong> (ai trả lời khảo sát trực tuyến thì lấy người đó) rẻ nhưng có thể thiên lệch nặng — không công thức nào sửa được một mẫu thiên lệch.</li>
</ul>
<h3>Tóm tắt bằng bảng và biểu đồ</h3>
<p>Dữ liệu định tính: bảng tần số và tần suất, biểu đồ cột, biểu đồ tròn; hai biến định tính: <strong>bảng chéo</strong> (bảng tiếp liên). Dữ liệu định lượng: bảng phân phối tần số theo tổ, <strong>biểu đồ tần số (histogram)</strong>, biểu đồ thân–lá và biểu đồ hộp; hai biến định lượng: <strong>biểu đồ phân tán</strong>; dữ liệu theo thời gian: biểu đồ đường. Excel (PivotTable và Analysis ToolPak), jamovi hoặc R đều vẽ được tất cả.</p>
<h3>Lộ trình</h3>
<p>Phần 1: các thước đo mô tả bằng số · Phần 2: xác suất và phân phối xác suất · Phần 3: phân phối mẫu, khoảng tin cậy và kiểm định giả thuyết · Phần 4: so sánh nhóm (t hai mẫu, khi bình phương, ANOVA) và hồi quy. Mọi bộ dữ liệu trong môn là dữ liệu minh hoạ giả định, mọi con số đều đã được kiểm bằng máy và làm tròn như ghi trong bài.</p>
<div class="callout"><span class="badge">Một ý cần giữ</span> Một thống kê tính từ mẫu sẽ thay đổi từ mẫu này sang mẫu khác. Suy diễn thống kê là nghệ thuật đo sự biến thiên đó và quyết định một quy luật là có thật hay chỉ là nhiễu do chọn mẫu.</div>`,
  ]]);

const c1 = doc('mas202-1-1-descriptive-measures', '1.1 — Numerical descriptive measures|||1.1 — Các thước đo mô tả bằng số',
  'Trung bình, trung vị, mốt; khoảng biến thiên, phương sai và độ lệch chuẩn mẫu (chia n − 1), hệ số biến thiên; tứ phân vị, IQR, biểu đồ hộp và giá trị ngoại lai; điểm z, quy tắc thực nghiệm và định lý Chebyshev, trên một bộ dữ liệu thời gian giao hàng.',
  [[
    `<span class="eyebrow">MAS202 · Part 1 · Lesson 1.1</span>
<h2>Numerical descriptive measures</h2>
<p class="lead">Three questions describe any quantitative variable: where is the centre, how spread out are the values, and where does an individual value stand relative to the rest?</p>
<p>Illustrative data — delivery times (minutes) of 10 orders from an online shop: 22, 25, 18, 30, 27, 24, 35, 21, 26, 52. Sorted: 18, 21, 22, 24, 25, 26, 27, 30, 35, 52.</p>
<h3>Measures of centre</h3>
<pre><code>Mean     x̄ = Σx / n = 280 / 10 = 28.0 minutes
Median   middle of the sorted data; n = 10 is even → (25 + 26) / 2 = 25.5
Mode     most frequent value — none here (every value appears once)</code></pre>
<p>The mean uses every value, so one extreme value (52) pulls it up; the median is <strong>resistant</strong> to outliers. Without the 52 the mean falls to 25.33 while the median barely moves (25). When mean &gt; median the distribution is usually <strong>right-skewed</strong>; mean &lt; median suggests left skew. For skewed data such as incomes or house prices, report the median.</p>
<h3>Measures of spread</h3>
<pre><code>Range                     = max − min = 52 − 18 = 34
Sample variance           s² = Σ(x − x̄)² / (n − 1) = 844 / 9 = 93.78
Sample standard deviation s = √93.78 = 9.68 minutes
Coefficient of variation  CV = s / x̄ × 100% = 9.68 / 28 = 34.6%</code></pre>
<p>For a sample we divide by <strong>n − 1</strong>, not n: this makes s² an unbiased estimator of the population variance σ². In Excel use VAR.S and STDEV.S; VAR.P and STDEV.P divide by N and are meant for a whole population (here they would give σ = 9.19). The CV compares variability between variables with different units or very different means.</p>
<h3>Measures of position: quartiles, IQR and the box plot</h3>
<pre><code>Position of the p-th percentile: L = p × (n + 1)          (Excel QUARTILE.EXC)
Q1: L = 0.25 × 11 = 2.75 → 21 + 0.75 × (22 − 21) = 21.75
Q3: L = 0.75 × 11 = 8.25 → 30 + 0.25 × (35 − 30) = 31.25
IQR = Q3 − Q1 = 9.5
Fences: Q1 − 1.5 × IQR = 7.5     Q3 + 1.5 × IQR = 45.5     → 52 is an outlier</code></pre>
<p>A <strong>box plot</strong> draws a box from Q1 to Q3 with a line at the median, whiskers out to the most extreme values inside the fences, and marks outliers individually. The five-number summary here is 18 · 21.75 · 25.5 · 31.25 · 52; because 52 is plotted as an outlier, the upper whisker stops at 35. Software uses slightly different quartile rules (Excel QUARTILE.INC gives 22.5 and 29.25), so small differences between tools are normal.</p>
<h3>z-scores, the empirical rule and Chebyshev’s theorem</h3>
<pre><code>z = (x − x̄) / s        z(52) = (52 − 28) / 9.68 = 2.48        z(18) = −1.03</code></pre>
<p>A z-score tells how many standard deviations a value lies from the mean. For <strong>bell-shaped</strong> data the <strong>empirical rule</strong> says that about 68% of values lie within ±1s of the mean, 95% within ±2s and 99.7% within ±3s, so |z| &gt; 3 is a common outlier flag. For <strong>any</strong> distribution, <strong>Chebyshev’s theorem</strong> guarantees that at least 1 − 1/k² of the values lie within k standard deviations: at least 75% within ±2s and 88.9% within ±3s.</p>
<div class="callout"><span class="badge">Watch out</span> The two outlier rules disagree here: the box plot flags 52, but its z-score is only 2.48. The outlier inflates s (9.68 with it, 5.05 without it), and that hides it from the z-score rule. Quartile-based rules are more robust.</div>`,
    `<span class="eyebrow">MAS202 · Phần 1 · Bài 1.1</span>
<h2>Các thước đo mô tả bằng số</h2>
<p class="lead">Ba câu hỏi mô tả mọi biến định lượng: trung tâm nằm ở đâu, các giá trị phân tán đến mức nào, và một giá trị cụ thể đứng ở vị trí nào so với phần còn lại?</p>
<p>Dữ liệu minh hoạ giả định — thời gian giao hàng (phút) của 10 đơn hàng từ một cửa hàng trực tuyến: 22, 25, 18, 30, 27, 24, 35, 21, 26, 52. Sắp xếp tăng dần: 18, 21, 22, 24, 25, 26, 27, 30, 35, 52.</p>
<h3>Thước đo xu hướng trung tâm</h3>
<pre><code>Trung bình   x̄ = Σx / n = 280 / 10 = 28,0 phút
Trung vị     giá trị ở giữa dãy đã sắp xếp; n = 10 chẵn → (25 + 26) / 2 = 25,5
Mốt          giá trị xuất hiện nhiều nhất — ở đây không có (mỗi giá trị xuất hiện một lần)</code></pre>
<p>Trung bình dùng mọi giá trị nên một giá trị cực đoan (52) kéo nó lên; trung vị thì <strong>ít bị ảnh hưởng</strong> bởi giá trị ngoại lai. Bỏ giá trị 52 thì trung bình giảm còn 25,33 trong khi trung vị gần như không đổi (25). Khi trung bình &gt; trung vị, phân phối thường <strong>lệch phải</strong>; trung bình &lt; trung vị gợi ý lệch trái. Với dữ liệu lệch như thu nhập hay giá nhà, nên báo cáo trung vị.</p>
<h3>Thước đo độ phân tán</h3>
<pre><code>Khoảng biến thiên      = max − min = 52 − 18 = 34
Phương sai mẫu         s² = Σ(x − x̄)² / (n − 1) = 844 / 9 = 93,78
Độ lệch chuẩn mẫu      s = √93,78 = 9,68 phút
Hệ số biến thiên       CV = s / x̄ × 100% = 9,68 / 28 = 34,6%</code></pre>
<p>Với mẫu, ta chia cho <strong>n − 1</strong> chứ không chia cho n: cách này làm s² là ước lượng không chệch của phương sai tổng thể σ². Trong Excel dùng VAR.S và STDEV.S; VAR.P và STDEV.P chia cho N và dành cho toàn bộ tổng thể (ở đây sẽ cho σ = 9,19). Hệ số biến thiên dùng để so sánh độ biến động giữa các biến có đơn vị khác nhau hoặc có trung bình chênh lệch lớn.</p>
<h3>Thước đo vị trí: tứ phân vị, IQR và biểu đồ hộp</h3>
<pre><code>Vị trí của phân vị thứ p: L = p × (n + 1)                (Excel QUARTILE.EXC)
Q1: L = 0,25 × 11 = 2,75 → 21 + 0,75 × (22 − 21) = 21,75
Q3: L = 0,75 × 11 = 8,25 → 30 + 0,25 × (35 − 30) = 31,25
IQR = Q3 − Q1 = 9,5
Hàng rào: Q1 − 1,5 × IQR = 7,5     Q3 + 1,5 × IQR = 45,5     → 52 là giá trị ngoại lai</code></pre>
<p><strong>Biểu đồ hộp</strong> vẽ một hộp từ Q1 đến Q3 với một vạch tại trung vị, hai "râu" kéo tới giá trị xa nhất còn nằm trong hàng rào, và đánh dấu riêng từng giá trị ngoại lai. Tóm tắt năm số ở đây là 18 · 21,75 · 25,5 · 31,25 · 52; vì 52 được vẽ như giá trị ngoại lai nên râu trên dừng ở 35. Các phần mềm dùng quy tắc tính tứ phân vị hơi khác nhau (Excel QUARTILE.INC cho 22,5 và 29,25), nên chênh lệch nhỏ giữa các công cụ là bình thường.</p>
<h3>Điểm z, quy tắc thực nghiệm và định lý Chebyshev</h3>
<pre><code>z = (x − x̄) / s        z(52) = (52 − 28) / 9,68 = 2,48        z(18) = −1,03</code></pre>
<p>Điểm z cho biết một giá trị cách trung bình bao nhiêu độ lệch chuẩn. Với dữ liệu có <strong>dạng hình chuông</strong>, <strong>quy tắc thực nghiệm</strong> cho biết khoảng 68% giá trị nằm trong ±1s quanh trung bình, 95% trong ±2s và 99,7% trong ±3s, nên |z| &gt; 3 là dấu hiệu ngoại lai thường dùng. Với <strong>mọi</strong> phân phối, <strong>định lý Chebyshev</strong> bảo đảm ít nhất 1 − 1/k² số giá trị nằm trong k độ lệch chuẩn: ít nhất 75% trong ±2s và 88,9% trong ±3s.</p>
<div class="callout"><span class="badge">Cẩn thận</span> Hai quy tắc phát hiện ngoại lai cho kết quả khác nhau ở đây: biểu đồ hộp đánh dấu 52, nhưng điểm z của nó chỉ là 2,48. Chính giá trị ngoại lai làm s phình ra (9,68 khi có nó, 5,05 khi bỏ nó), và điều đó che nó khỏi quy tắc điểm z. Quy tắc dựa trên tứ phân vị vững hơn.</div>`,
  ]]);

const c1e = doc('mas202-1-2-exercise', 'Exercise 1 — describing a sales team|||Bài tập 1 — mô tả một đội bán hàng',
  'Bài tập: tính trung bình, trung vị, mốt, phương sai và độ lệch chuẩn mẫu, hệ số biến thiên, tứ phân vị, IQR và kiểm tra ngoại lai cho doanh số 9 nhân viên; dùng điểm z và CV so sánh hai đội; kèm lời giải.',
  [[
    `<span class="eyebrow">MAS202 · Part 1 · Exercise 1</span>
<h2>Exercise 1 — who really sold the most?</h2>
<div class="callout"><span class="badge">Problem</span> Units sold last month by the 9 sales representatives of Team 1 (illustrative data): 12, 15, 9, 20, 14, 17, 11, 15, 22. (a) Find the mean, median and mode. (b) Find the range, sample variance, sample standard deviation and coefficient of variation. (c) Find Q1 and Q3 with the rule L = p(n + 1), the IQR, and check for outliers with the 1.5 × IQR rule. (d) Compute the z-score of Team 1’s top seller (22). In Team 2 the mean is 18 units and the standard deviation is 6; its top seller sold 26. Who performed better relative to their own team? Which team is more consistent?</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) Sorted: 9, 11, 12, 14, 15, 15, 17, 20, 22
    x̄ = 135 / 9 = 15        median = 5th value = 15        mode = 15

(b) Range = 22 − 9 = 13
    Deviations x − x̄: −6, −4, −3, −1, 0, 0, 2, 5, 7         (sum = 0 ✓)
    Σ(x − x̄)² = 36 + 16 + 9 + 1 + 0 + 0 + 4 + 25 + 49 = 140
    s² = 140 / 8 = 17.5      s = √17.5 = 4.18      CV = 4.18 / 15 = 27.9%

(c) Q1: L = 0.25 × 10 = 2.5 → 11 + 0.5 × (12 − 11) = 11.5
    Q3: L = 0.75 × 10 = 7.5 → 17 + 0.5 × (20 − 17) = 18.5
    IQR = 7       fences: 11.5 − 10.5 = 1  and  18.5 + 10.5 = 29  → no outliers

(d) Team 1 top seller:  z = (22 − 15) / 4.18 = 1.67
    Team 2 top seller:  z = (26 − 18) / 6    = 1.33
    CV of Team 2 = 6 / 18 = 33.3%  (Team 1: 27.9%)</code></pre>
<p><strong>Why:</strong> in absolute terms 26 beats 22, but relative to their own teams the Team 1 representative stands 1.67 standard deviations above the average versus 1.33 — the z-score removes differences in both mean and spread. Team 1 is also more consistent (lower CV). Mean, median and mode all equal 15, so the data are roughly symmetric; the empirical rule would place about 95% of representatives between 15 ± 2 × 4.18, i.e. 6.6 to 23.4 — and all nine are inside that range.</p>`,
    `<span class="eyebrow">MAS202 · Phần 1 · Bài tập 1</span>
<h2>Bài tập 1 — ai thực sự bán giỏi nhất?</h2>
<div class="callout"><span class="badge">Đề</span> Số sản phẩm bán được tháng trước của 9 nhân viên Đội 1 (dữ liệu minh hoạ giả định): 12, 15, 9, 20, 14, 17, 11, 15, 22. (a) Tính trung bình, trung vị và mốt. (b) Tính khoảng biến thiên, phương sai mẫu, độ lệch chuẩn mẫu và hệ số biến thiên. (c) Tính Q1 và Q3 theo quy tắc L = p(n + 1), IQR, và kiểm tra giá trị ngoại lai bằng quy tắc 1,5 × IQR. (d) Tính điểm z của người bán giỏi nhất Đội 1 (22). Ở Đội 2, trung bình là 18 sản phẩm và độ lệch chuẩn là 6; người bán giỏi nhất đội này bán 26. Ai làm tốt hơn so với chính đội của mình? Đội nào đồng đều hơn?</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) Sắp xếp: 9, 11, 12, 14, 15, 15, 17, 20, 22
    x̄ = 135 / 9 = 15        trung vị = giá trị thứ 5 = 15        mốt = 15

(b) Khoảng biến thiên = 22 − 9 = 13
    Độ lệch x − x̄: −6, −4, −3, −1, 0, 0, 2, 5, 7         (tổng = 0 ✓)
    Σ(x − x̄)² = 36 + 16 + 9 + 1 + 0 + 0 + 4 + 25 + 49 = 140
    s² = 140 / 8 = 17,5      s = √17,5 = 4,18      CV = 4,18 / 15 = 27,9%

(c) Q1: L = 0,25 × 10 = 2,5 → 11 + 0,5 × (12 − 11) = 11,5
    Q3: L = 0,75 × 10 = 7,5 → 17 + 0,5 × (20 − 17) = 18,5
    IQR = 7       hàng rào: 11,5 − 10,5 = 1  và  18,5 + 10,5 = 29  → không có ngoại lai

(d) Người giỏi nhất Đội 1:  z = (22 − 15) / 4,18 = 1,67
    Người giỏi nhất Đội 2:  z = (26 − 18) / 6    = 1,33
    CV của Đội 2 = 6 / 18 = 33,3%  (Đội 1: 27,9%)</code></pre>
<p><strong>Vì sao:</strong> xét con số tuyệt đối thì 26 hơn 22, nhưng so với chính đội của mình, nhân viên Đội 1 cao hơn trung bình 1,67 độ lệch chuẩn, còn nhân viên Đội 2 chỉ 1,33 — điểm z loại bỏ khác biệt về cả trung bình lẫn độ phân tán. Đội 1 cũng đồng đều hơn (CV thấp hơn). Trung bình, trung vị và mốt đều bằng 15 nên dữ liệu gần đối xứng; quy tắc thực nghiệm dự báo khoảng 95% nhân viên nằm trong 15 ± 2 × 4,18, tức từ 6,6 đến 23,4 — và cả chín người đều nằm trong khoảng đó.</p>`,
  ]]);

const c1q = quiz('mas202-quiz-1', 'Quiz 1 — Descriptive statistics|||Quiz 1 — Thống kê mô tả', [
  { id: 'q1', question: 'Household incomes in a city are strongly right-skewed. Which measure best represents a typical household?|||Thu nhập hộ gia đình ở một thành phố lệch phải mạnh. Thước đo nào đại diện tốt nhất cho một hộ điển hình?', options: ['The mean|||Trung bình', 'The median|||Trung vị', 'The range|||Khoảng biến thiên', 'The standard deviation|||Độ lệch chuẩn'], correctIndex: 1, explanation: 'A few very high incomes pull the mean up; the median is resistant to extreme values.|||Một vài hộ thu nhập rất cao kéo trung bình lên; trung vị ít bị ảnh hưởng bởi giá trị cực đoan.' },
  { id: 'q2', question: 'Why is the sample variance divided by n − 1 rather than n?|||Vì sao phương sai mẫu chia cho n − 1 chứ không chia cho n?', options: ['To make the result smaller|||Để kết quả nhỏ hơn', 'Because one observation is always an outlier|||Vì luôn có một quan sát là ngoại lai', 'Because spreadsheets require it|||Vì bảng tính bắt buộc như vậy', 'So that s² is an unbiased estimator of the population variance|||Để s² là ước lượng không chệch của phương sai tổng thể'], correctIndex: 3, explanation: 'Deviations are measured from x̄, which is fitted to the same data; dividing by n would underestimate σ² on average.|||Độ lệch được đo từ x̄, vốn được tính từ chính dữ liệu đó; chia cho n sẽ ước lượng thấp σ² một cách hệ thống.' },
  { id: 'q3', question: 'Weekly sales are bell-shaped with mean 200 and standard deviation 20. About what share of weeks have sales between 160 and 240?|||Doanh số hằng tuần có dạng hình chuông, trung bình 200, độ lệch chuẩn 20. Khoảng bao nhiêu phần trăm số tuần có doanh số từ 160 đến 240?', options: ['About 95%|||Khoảng 95%', 'About 68%|||Khoảng 68%', 'About 99.7%|||Khoảng 99,7%', 'Exactly 75%|||Đúng 75%'], correctIndex: 0, explanation: '160 and 240 are 2 standard deviations from the mean, so the empirical rule gives about 95% (Chebyshev only guarantees at least 75% for any shape).|||160 và 240 cách trung bình 2 độ lệch chuẩn, nên quy tắc thực nghiệm cho khoảng 95% (Chebyshev chỉ bảo đảm ít nhất 75% với mọi dạng phân phối).' },
]);

const c2 = doc('mas202-2-1-probability', '2.1 — Probability rules & Bayes’ theorem|||2.1 — Quy tắc xác suất & định lý Bayes',
  'Không gian mẫu, biến cố, ba cách xác định xác suất; quy tắc bù, cộng, nhân; xác suất biên, đồng thời, có điều kiện trên bảng chéo 400 khách hàng; biến cố xung khắc và độc lập; định lý Bayes với bài toán hai máy sản xuất.',
  [[
    `<span class="eyebrow">MAS202 · Part 2 · Lesson 2.1</span>
<h2>Probability rules &amp; Bayes’ theorem</h2>
<p class="lead">Probability measures uncertainty on a scale from 0 (impossible) to 1 (certain). Businesses use it to price risk, forecast demand and read test results correctly.</p>
<h3>Basic ideas</h3>
<p>An <strong>experiment</strong> produces outcomes; the set of all possible outcomes is the <strong>sample space</strong>; an <strong>event</strong> is a set of outcomes. Probabilities can be <strong>classical</strong> (equally likely outcomes), based on <strong>relative frequency</strong> (historical data) or <strong>subjective</strong> (expert judgement). Each lies between 0 and 1, and the probabilities of all outcomes sum to 1.</p>
<h3>The rules, on a contingency table</h3>
<p>Illustrative survey of 400 customers by purchase channel and plan chosen:</p>
<table>
<tr><th></th><th>Premium</th><th>Basic</th><th>Total</th></tr>
<tr><td>Online</td><td>72</td><td>168</td><td>240</td></tr>
<tr><td>In store</td><td>28</td><td>132</td><td>160</td></tr>
<tr><td>Total</td><td>100</td><td>300</td><td>400</td></tr>
</table>
<pre><code>Marginal:        P(Online) = 240 / 400 = 0.60       P(Premium) = 100 / 400 = 0.25
Joint:           P(Online and Premium) = 72 / 400 = 0.18
Complement:      P(not Premium) = 1 − 0.25 = 0.75
Addition:        P(Online or Premium) = P(O) + P(P) − P(O and P)
                                      = 0.60 + 0.25 − 0.18 = 0.67
Conditional:     P(Premium | Online)   = P(P and O) / P(O) = 0.18 / 0.60 = 0.30
                 P(Premium | In store) = 28 / 160 = 0.175
Multiplication:  P(O and P) = P(O) × P(P | O) = 0.60 × 0.30 = 0.18 ✓</code></pre>
<p>Events are <strong>mutually exclusive</strong> if they cannot occur together; then P(A and B) = 0 and the addition rule loses its last term. Events are <strong>independent</strong> if knowing that one occurred does not change the probability of the other: P(A | B) = P(A), or equivalently P(A and B) = P(A) × P(B). Here P(Premium | Online) = 0.30 differs from P(Premium) = 0.25, so channel and plan are <strong>not</strong> independent — online buyers are more likely to choose Premium. (Lesson 4.1 tests whether such a gap is statistically significant.)</p>
<h3>Bayes’ theorem: updating with new information</h3>
<pre><code>P(A | B) = P(B | A) × P(A) / P(B),     where  P(B) = Σ P(B | Ai) × P(Ai)</code></pre>
<p>Illustrative: machine M1 makes 60% of the output with a 2% defect rate; machine M2 makes 40% with a 5% defect rate. An item is found to be defective (D). Which machine probably made it?</p>
<pre><code>P(D) = 0.60 × 0.02 + 0.40 × 0.05 = 0.012 + 0.020 = 0.032
P(M2 | D) = 0.020 / 0.032 = 0.625          P(M1 | D) = 0.012 / 0.032 = 0.375</code></pre>
<p>The <strong>prior</strong> probability that an item came from M2 was 0.40; after observing a defect, the <strong>posterior</strong> probability rises to 0.625. A tree diagram (machine first, then defective or not) keeps these calculations organised.</p>
<div class="callout"><span class="badge">Common trap</span> P(A | B) is not P(B | A). Here P(Online | Premium) = 72 / 100 = 0.72, while P(Premium | Online) = 0.30. Mixing up the two is the most frequent error when reading test results, surveys and risk reports.</div>`,
    `<span class="eyebrow">MAS202 · Phần 2 · Bài 2.1</span>
<h2>Quy tắc xác suất &amp; định lý Bayes</h2>
<p class="lead">Xác suất đo mức độ bất định trên thang từ 0 (không thể xảy ra) đến 1 (chắc chắn). Doanh nghiệp dùng xác suất để định giá rủi ro, dự báo nhu cầu và đọc đúng kết quả kiểm tra.</p>
<h3>Khái niệm cơ bản</h3>
<p>Một <strong>phép thử</strong> cho ra các kết quả; tập hợp mọi kết quả có thể là <strong>không gian mẫu</strong>; một <strong>biến cố</strong> là một tập hợp kết quả. Xác suất có thể xác định theo cách <strong>cổ điển</strong> (các kết quả đồng khả năng), theo <strong>tần suất</strong> (dữ liệu lịch sử) hoặc <strong>chủ quan</strong> (đánh giá của chuyên gia). Mỗi xác suất nằm trong khoảng từ 0 đến 1, và tổng xác suất của mọi kết quả bằng 1.</p>
<h3>Các quy tắc, minh hoạ trên bảng chéo</h3>
<p>Khảo sát minh hoạ giả định 400 khách hàng theo kênh mua và gói dịch vụ đã chọn:</p>
<table>
<tr><th></th><th>Cao cấp</th><th>Cơ bản</th><th>Tổng</th></tr>
<tr><td>Trực tuyến</td><td>72</td><td>168</td><td>240</td></tr>
<tr><td>Tại cửa hàng</td><td>28</td><td>132</td><td>160</td></tr>
<tr><td>Tổng</td><td>100</td><td>300</td><td>400</td></tr>
</table>
<pre><code>Xác suất biên:        P(Trực tuyến) = 240 / 400 = 0,60     P(Cao cấp) = 100 / 400 = 0,25
Xác suất đồng thời:   P(Trực tuyến và Cao cấp) = 72 / 400 = 0,18
Quy tắc bù:           P(không Cao cấp) = 1 − 0,25 = 0,75
Quy tắc cộng:         P(Trực tuyến hoặc Cao cấp) = P(T) + P(C) − P(T và C)
                                                 = 0,60 + 0,25 − 0,18 = 0,67
Có điều kiện:         P(Cao cấp | Trực tuyến)   = P(C và T) / P(T) = 0,18 / 0,60 = 0,30
                      P(Cao cấp | Tại cửa hàng) = 28 / 160 = 0,175
Quy tắc nhân:         P(T và C) = P(T) × P(C | T) = 0,60 × 0,30 = 0,18 ✓</code></pre>
<p>Hai biến cố <strong>xung khắc</strong> nếu không thể cùng xảy ra; khi đó P(A và B) = 0 và quy tắc cộng mất số hạng cuối. Hai biến cố <strong>độc lập</strong> nếu việc biết một biến cố đã xảy ra không làm thay đổi xác suất của biến cố kia: P(A | B) = P(A), hay tương đương P(A và B) = P(A) × P(B). Ở đây P(Cao cấp | Trực tuyến) = 0,30 khác P(Cao cấp) = 0,25, nên kênh mua và gói dịch vụ <strong>không</strong> độc lập — khách mua trực tuyến có xu hướng chọn gói Cao cấp nhiều hơn. (Bài 4.1 sẽ kiểm định xem chênh lệch đó có ý nghĩa thống kê hay không.)</p>
<h3>Định lý Bayes: cập nhật khi có thông tin mới</h3>
<pre><code>P(A | B) = P(B | A) × P(A) / P(B),     trong đó  P(B) = Σ P(B | Ai) × P(Ai)</code></pre>
<p>Minh hoạ: máy M1 sản xuất 60% sản lượng với tỷ lệ lỗi 2%; máy M2 sản xuất 40% với tỷ lệ lỗi 5%. Một sản phẩm bị phát hiện lỗi (L). Nhiều khả năng máy nào đã làm ra nó?</p>
<pre><code>P(L) = 0,60 × 0,02 + 0,40 × 0,05 = 0,012 + 0,020 = 0,032
P(M2 | L) = 0,020 / 0,032 = 0,625          P(M1 | L) = 0,012 / 0,032 = 0,375</code></pre>
<p>Xác suất <strong>tiên nghiệm</strong> để một sản phẩm đến từ M2 là 0,40; sau khi quan sát thấy lỗi, xác suất <strong>hậu nghiệm</strong> tăng lên 0,625. Sơ đồ cây (nhánh máy trước, rồi nhánh lỗi hay không lỗi) giúp sắp xếp các phép tính này gọn gàng.</p>
<div class="callout"><span class="badge">Bẫy thường gặp</span> P(A | B) không phải là P(B | A). Ở đây P(Trực tuyến | Cao cấp) = 72 / 100 = 0,72, trong khi P(Cao cấp | Trực tuyến) = 0,30. Nhầm lẫn hai đại lượng này là lỗi phổ biến nhất khi đọc kết quả xét nghiệm, khảo sát và báo cáo rủi ro.</div>`,
  ]]);

const c3 = doc('mas202-2-2-distributions', '2.2 — Discrete and normal probability distributions|||2.2 — Phân phối rời rạc và phân phối chuẩn',
  'Biến ngẫu nhiên rời rạc, kỳ vọng và phương sai; phân phối nhị thức và Poisson với ví dụ kinh doanh; phân phối chuẩn, chuẩn hoá về Z, tính xác suất và tra ngược để đặt mức tồn kho; khi nào dùng phân phối nào.',
  [[
    `<span class="eyebrow">MAS202 · Part 2 · Lesson 2.2</span>
<h2>Discrete and normal probability distributions</h2>
<p class="lead">A random variable assigns a number to each outcome of an experiment. Its probability distribution tells us which values are likely — the bridge between probability and data.</p>
<h3>Discrete random variables</h3>
<pre><code>Cars sold per day (assumed):   x      0     1     2     3
                               p(x)  0.2   0.4   0.3   0.1
Expected value  E(X) = μ = Σ x p(x) = 0 + 0.4 + 0.6 + 0.3 = 1.3 cars
Variance        σ² = Σ x² p(x) − μ² = 2.5 − 1.69 = 0.81        σ = 0.9</code></pre>
<p>The expected value is the long-run average: over many days the dealer sells 1.3 cars per day on average, although no single day has 1.3 sales.</p>
<h3>Binomial distribution</h3>
<p>Use it when there are <strong>n independent trials</strong>, each ending in success or failure with the <strong>same probability p</strong>, and X counts the successes.</p>
<pre><code>P(X = k) = C(n, k) × p^k × (1 − p)^(n − k)       μ = np       σ = √(np(1 − p))
10 visitors, each buys with probability p = 0.2:
P(X = 3) = 120 × 0.2^3 × 0.8^7 = 0.2013
P(X ≥ 1) = 1 − 0.8^10 = 1 − 0.1074 = 0.8926
P(X ≤ 2) = 0.6778              μ = 2 buyers        σ = √1.6 = 1.26</code></pre>
<h3>Poisson distribution</h3>
<p>Use it for the number of events in a fixed interval of time or space (calls per hour, defects per metre) when events occur independently at a constant average rate λ.</p>
<pre><code>P(X = k) = e^(−λ) × λ^k / k!          μ = σ² = λ
A help desk receives on average λ = 3 calls per hour:
P(X = 0) = e^(−3) = 0.0498            P(X = 2) = e^(−3) × 3^2 / 2! = 0.2240
P(X ≤ 2) = e^(−3) × (1 + 3 + 4.5) = 0.4232        → P(X ≥ 3) = 0.5768</code></pre>
<h3>The normal distribution</h3>
<p>A continuous, symmetric, bell-shaped distribution fully described by its mean μ and standard deviation σ. For a continuous variable, probability is an <strong>area</strong> under the curve, so P(X = a) = 0. Any normal variable can be <strong>standardised</strong> to Z ~ N(0, 1), whose areas come from the z-table or Excel NORM.S.DIST.</p>
<pre><code>Z = (X − μ) / σ
Monthly demand X ~ N(μ = 500, σ = 80) units (assumed)
P(X &gt; 620)       = P(Z &gt; 1.50)              = 0.0668
P(400 &lt; X &lt; 600) = P(−1.25 &lt; Z &lt; 1.25)     = 0.7887
Stock level that meets demand in 95% of months:
x = μ + z × σ = 500 + 1.645 × 80 = 631.6 → 632 units   (z = 1.645 leaves 5% in the upper tail)</code></pre>
<p>The last line runs the calculation backwards (Excel NORM.INV): find the z for the required area, then convert it back to x. This is how service levels and safety stocks are set.</p>
<div class="callout"><span class="badge">Which one?</span> A fixed number of yes/no trials → binomial. Counts per interval with no fixed upper limit → Poisson. Continuous measurements clustering symmetrically around a mean → normal. The binomial is approximately normal when np ≥ 5 and n(1 − p) ≥ 5.</div>`,
    `<span class="eyebrow">MAS202 · Phần 2 · Bài 2.2</span>
<h2>Phân phối rời rạc và phân phối chuẩn</h2>
<p class="lead">Biến ngẫu nhiên gán một con số cho mỗi kết quả của phép thử. Phân phối xác suất của nó cho biết giá trị nào dễ xảy ra — đó là cầu nối giữa xác suất và dữ liệu.</p>
<h3>Biến ngẫu nhiên rời rạc</h3>
<pre><code>Số xe bán mỗi ngày (giả định):   x      0     1     2     3
                                 p(x)  0,2   0,4   0,3   0,1
Kỳ vọng     E(X) = μ = Σ x p(x) = 0 + 0,4 + 0,6 + 0,3 = 1,3 xe
Phương sai  σ² = Σ x² p(x) − μ² = 2,5 − 1,69 = 0,81        σ = 0,9</code></pre>
<p>Kỳ vọng là mức trung bình trong dài hạn: qua nhiều ngày, đại lý bán trung bình 1,3 xe mỗi ngày, dù không có ngày nào bán đúng 1,3 xe.</p>
<h3>Phân phối nhị thức</h3>
<p>Dùng khi có <strong>n phép thử độc lập</strong>, mỗi phép thử chỉ có thành công hoặc thất bại với <strong>cùng xác suất p</strong>, và X đếm số lần thành công.</p>
<pre><code>P(X = k) = C(n, k) × p^k × (1 − p)^(n − k)       μ = np       σ = √(np(1 − p))
10 khách ghé thăm, mỗi người mua với xác suất p = 0,2:
P(X = 3) = 120 × 0,2^3 × 0,8^7 = 0,2013
P(X ≥ 1) = 1 − 0,8^10 = 1 − 0,1074 = 0,8926
P(X ≤ 2) = 0,6778              μ = 2 người mua        σ = √1,6 = 1,26</code></pre>
<h3>Phân phối Poisson</h3>
<p>Dùng cho số lần xảy ra sự kiện trong một khoảng thời gian hoặc không gian cố định (số cuộc gọi mỗi giờ, số lỗi trên mỗi mét) khi các sự kiện xảy ra độc lập với tốc độ trung bình không đổi λ.</p>
<pre><code>P(X = k) = e^(−λ) × λ^k / k!          μ = σ² = λ
Bộ phận hỗ trợ nhận trung bình λ = 3 cuộc gọi mỗi giờ:
P(X = 0) = e^(−3) = 0,0498            P(X = 2) = e^(−3) × 3^2 / 2! = 0,2240
P(X ≤ 2) = e^(−3) × (1 + 3 + 4,5) = 0,4232        → P(X ≥ 3) = 0,5768</code></pre>
<h3>Phân phối chuẩn</h3>
<p>Phân phối liên tục, đối xứng, hình chuông, được xác định hoàn toàn bởi trung bình μ và độ lệch chuẩn σ. Với biến liên tục, xác suất là <strong>diện tích</strong> dưới đường cong, nên P(X = a) = 0. Mọi biến chuẩn đều có thể <strong>chuẩn hoá</strong> về Z ~ N(0, 1), với diện tích tra từ bảng z hoặc hàm NORM.S.DIST của Excel.</p>
<pre><code>Z = (X − μ) / σ
Nhu cầu hằng tháng X ~ N(μ = 500, σ = 80) sản phẩm (giả định)
P(X &gt; 620)       = P(Z &gt; 1,50)              = 0,0668
P(400 &lt; X &lt; 600) = P(−1,25 &lt; Z &lt; 1,25)     = 0,7887
Mức tồn kho đáp ứng nhu cầu trong 95% số tháng:
x = μ + z × σ = 500 + 1,645 × 80 = 631,6 → 632 sản phẩm   (z = 1,645 để lại 5% ở đuôi phải)</code></pre>
<p>Dòng cuối là tính ngược (hàm NORM.INV của Excel): tìm z ứng với diện tích yêu cầu rồi đổi ngược về x. Đây chính là cách đặt mức phục vụ và tồn kho an toàn.</p>
<div class="callout"><span class="badge">Chọn phân phối nào?</span> Số phép thử có/không cố định → nhị thức. Đếm số sự kiện trong một khoảng, không có giới hạn trên cố định → Poisson. Số đo liên tục, tập trung đối xứng quanh trung bình → chuẩn. Phân phối nhị thức xấp xỉ chuẩn khi np ≥ 5 và n(1 − p) ≥ 5.</div>`,
  ]]);

const c3e = doc('mas202-2-3-exercise', 'Exercise 2 — audits, deliveries and credit scoring|||Bài tập 2 — kiểm toán, giao hàng và chấm điểm tín dụng',
  'Bài tập: xác suất nhị thức khi kiểm toán 15 hoá đơn, xác suất chuẩn và mức cam kết thời gian giao hàng 90%, định lý Bayes với mô hình chấm điểm tín dụng (hiệu ứng tỷ lệ nền); kèm lời giải.',
  [[
    `<span class="eyebrow">MAS202 · Part 2 · Exercise 2</span>
<h2>Exercise 2 — three probability decisions</h2>
<div class="callout"><span class="badge">Problem</span> All figures are illustrative. (a) 8% of a company’s invoices contain an error. An auditor randomly checks 15 invoices. Find the probability of no errors, the probability of at least 2 errors, and the expected number of errors. (b) A courier’s delivery time is normal with mean 3.2 days and standard deviation 0.6 days. What share of parcels take more than 4 days? What delivery promise will the courier meet for 90% of parcels? (c) 5% of loan applicants eventually default. A scoring model flags 90% of applicants who default, but also wrongly flags 8% of applicants who repay. If an applicant is flagged, what is the probability that they will default?</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) Binomial, n = 15, p = 0.08
    P(X = 0) = 0.92^15 = 0.2863
    P(X = 1) = 15 × 0.08 × 0.92^14 = 0.3734
    P(X ≥ 2) = 1 − 0.2863 − 0.3734 = 0.3403
    E(X) = np = 15 × 0.08 = 1.2 invoices     σ = √(15 × 0.08 × 0.92) = 1.05

(b) z = (4 − 3.2) / 0.6 = 1.333  →  P(X &gt; 4) = P(Z &gt; 1.333) = 0.0912  (about 9.1%)
    (a z-table with z rounded to 1.33 gives 0.0918)
    90th percentile: z = 1.2816  →  x = 3.2 + 1.2816 × 0.6 = 3.97 days
    A "4-day" promise is met for 1 − 0.0912 = 90.9% of parcels

(c) P(Flag) = 0.05 × 0.90 + 0.95 × 0.08 = 0.045 + 0.076 = 0.121
    P(Default | Flag)        = 0.045 / 0.121 = 0.372
    P(Default | Not flagged) = (0.05 × 0.10) / 0.879 = 0.0057</code></pre>
<p><strong>Why:</strong> in (a) a completely clean sample happens 28.6% of the time even though 8% of invoices are wrong, so "no errors found" is weak evidence of good controls. In (b) the z-score converts days into standard units, and the reverse lookup turns a target service level into a promise customers can rely on. In (c) the model catches 90% of defaulters, yet only 37% of flagged applicants default: defaulters are rare (5%), so most flags come from the large group of good borrowers. This <strong>base-rate effect</strong> means a flag should trigger a manual review, not an automatic rejection — while an unflagged applicant is very safe (0.57% default).</p>`,
    `<span class="eyebrow">MAS202 · Phần 2 · Bài tập 2</span>
<h2>Bài tập 2 — ba quyết định dựa trên xác suất</h2>
<div class="callout"><span class="badge">Đề</span> Mọi số liệu đều là minh hoạ giả định. (a) 8% hoá đơn của một công ty có sai sót. Kiểm toán viên chọn ngẫu nhiên 15 hoá đơn để kiểm tra. Tính xác suất không có hoá đơn sai nào, xác suất có ít nhất 2 hoá đơn sai, và số hoá đơn sai kỳ vọng. (b) Thời gian giao hàng của một hãng chuyển phát có phân phối chuẩn, trung bình 3,2 ngày, độ lệch chuẩn 0,6 ngày. Bao nhiêu phần trăm bưu kiện mất hơn 4 ngày? Hãng nên cam kết thời gian giao bao lâu để đáp ứng được 90% bưu kiện? (c) 5% người vay cuối cùng không trả được nợ (vỡ nợ). Một mô hình chấm điểm gắn cờ 90% số người sẽ vỡ nợ, nhưng cũng gắn cờ nhầm 8% số người trả nợ đầy đủ. Nếu một người vay bị gắn cờ, xác suất người đó vỡ nợ là bao nhiêu?</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) Nhị thức, n = 15, p = 0,08
    P(X = 0) = 0,92^15 = 0,2863
    P(X = 1) = 15 × 0,08 × 0,92^14 = 0,3734
    P(X ≥ 2) = 1 − 0,2863 − 0,3734 = 0,3403
    E(X) = np = 15 × 0,08 = 1,2 hoá đơn     σ = √(15 × 0,08 × 0,92) = 1,05

(b) z = (4 − 3,2) / 0,6 = 1,333  →  P(X &gt; 4) = P(Z &gt; 1,333) = 0,0912  (khoảng 9,1%)
    (tra bảng z với z làm tròn 1,33 được 0,0918)
    Phân vị 90: z = 1,2816  →  x = 3,2 + 1,2816 × 0,6 = 3,97 ngày
    Cam kết "4 ngày" đáp ứng được 1 − 0,0912 = 90,9% số bưu kiện

(c) P(Gắn cờ) = 0,05 × 0,90 + 0,95 × 0,08 = 0,045 + 0,076 = 0,121
    P(Vỡ nợ | Gắn cờ)          = 0,045 / 0,121 = 0,372
    P(Vỡ nợ | Không gắn cờ)    = (0,05 × 0,10) / 0,879 = 0,0057</code></pre>
<p><strong>Vì sao:</strong> ở (a), một mẫu hoàn toàn "sạch" vẫn xảy ra 28,6% số lần dù 8% hoá đơn bị sai, nên "không tìm thấy lỗi" là bằng chứng yếu về kiểm soát nội bộ tốt. Ở (b), điểm z đổi số ngày sang đơn vị chuẩn, còn phép tra ngược biến một mức phục vụ mục tiêu thành lời cam kết khách hàng có thể tin. Ở (c), mô hình bắt được 90% người vỡ nợ, nhưng chỉ 37% người bị gắn cờ thực sự vỡ nợ: người vỡ nợ hiếm (5%), nên phần lớn lượt gắn cờ đến từ nhóm đông đảo những người vay tốt. <strong>Hiệu ứng tỷ lệ nền</strong> này nghĩa là gắn cờ nên dẫn tới thẩm định thủ công chứ không tự động từ chối — trong khi người không bị gắn cờ rất an toàn (chỉ 0,57% vỡ nợ).</p>`,
  ]]);

const c3q = quiz('mas202-quiz-2', 'Quiz 2 — Probability & distributions|||Quiz 2 — Xác suất & phân phối', [
  { id: 'q1', question: 'Events A and B are independent when…|||Hai biến cố A và B độc lập khi…', options: ['P(A and B) = 0|||P(A và B) = 0', 'P(A | B) = P(B | A)|||P(A | B) = P(B | A)', 'P(A | B) = P(A)|||P(A | B) = P(A)', 'P(A) + P(B) = 1|||P(A) + P(B) = 1'], correctIndex: 2, explanation: 'Knowing B occurred does not change the probability of A. P(A and B) = 0 describes mutually exclusive events, which are dependent whenever both have positive probability.|||Biết B đã xảy ra không làm thay đổi xác suất của A. P(A và B) = 0 là biến cố xung khắc — khi cả hai có xác suất dương thì chúng phụ thuộc nhau.' },
  { id: 'q2', question: 'Calls reach a call centre at an average rate of 4 per minute. Which distribution best models the number of calls in one minute?|||Cuộc gọi đến tổng đài với tốc độ trung bình 4 cuộc mỗi phút. Phân phối nào mô tả tốt nhất số cuộc gọi trong một phút?', options: ['Poisson with λ = 4|||Poisson với λ = 4', 'Binomial with n = 4|||Nhị thức với n = 4', 'Normal with mean 4 and standard deviation 4|||Chuẩn với trung bình 4, độ lệch chuẩn 4', 'Uniform from 0 to 8|||Đều từ 0 đến 8'], correctIndex: 0, explanation: 'Counts of independent events in a fixed interval at a constant rate follow a Poisson distribution; there is no fixed number of trials n.|||Số sự kiện độc lập trong một khoảng cố định với tốc độ không đổi tuân theo phân phối Poisson; không có số phép thử n cố định.' },
  { id: 'q3', question: 'X is normal with mean 50 and standard deviation 5. P(X &gt; 60) is closest to…|||X có phân phối chuẩn, trung bình 50, độ lệch chuẩn 5. P(X &gt; 60) gần nhất với…', options: ['0.1587|||0,1587', '0.4772|||0,4772', '0.9772|||0,9772', '0.0228|||0,0228'], correctIndex: 3, explanation: 'z = (60 − 50) / 5 = 2 and P(Z &gt; 2) = 1 − 0.9772 = 0.0228.|||z = (60 − 50) / 5 = 2 và P(Z &gt; 2) = 1 − 0,9772 = 0,0228.' },
]);

const c4 = doc('mas202-3-1-sampling-estimation', '3.1 — Sampling distributions & confidence intervals|||3.1 — Phân phối mẫu & khoảng tin cậy',
  'Phân phối mẫu của trung bình và của tỷ lệ, sai số chuẩn, định lý giới hạn trung tâm; khoảng tin cậy cho trung bình khi biết σ (z) và khi không biết σ (phân phối t), cho tỷ lệ; xác định cỡ mẫu; diễn giải đúng mức tin cậy 95%.',
  [[
    `<span class="eyebrow">MAS202 · Part 3 · Lesson 3.1</span>
<h2>Sampling distributions &amp; confidence intervals</h2>
<p class="lead">A sample mean is itself a random variable: draw another sample and you get another x̄. Knowing how x̄ varies lets us attach a margin of error to any estimate.</p>
<h3>The sampling distribution of x̄ and the central limit theorem</h3>
<pre><code>E(x̄) = μ              standard error  σx̄ = σ / √n
Central limit theorem (CLT): for a large sample (rule of thumb n ≥ 30), x̄ is
approximately normal whatever the shape of the population; if the population
itself is normal, x̄ is normal for any n.</code></pre>
<p>Illustrative: purchase amounts at a store are right-skewed with μ = 250 and σ = 90 (thousand VND). For random samples of n = 36 purchases:</p>
<pre><code>σx̄ = 90 / √36 = 15
P(x̄ &gt; 275) = P(Z &gt; (275 − 250) / 15) = P(Z &gt; 1.667) = 0.0478</code></pre>
<p>A single purchase above 275 is common, but the <em>average</em> of 36 purchases exceeds 275 only about 5% of the time — averaging cancels much of the variability. Because the standard error shrinks with √n, quadrupling the sample size only halves it.</p>
<h3>The sampling distribution of p̂</h3>
<pre><code>E(p̂) = p       σp̂ = √(p(1 − p) / n)       approximately normal if np ≥ 5 and n(1 − p) ≥ 5
p = 0.40, n = 150:  σp̂ = √(0.40 × 0.60 / 150) = 0.04
P(p̂ &lt; 0.35) = P(Z &lt; −1.25) = 0.1056</code></pre>
<h3>Confidence intervals</h3>
<p>Every interval has the form <strong>point estimate ± margin of error</strong>, where the margin = critical value × standard error.</p>
<table>
<tr><th>Case</th><th>Interval</th><th>Illustrative 95% result</th></tr>
<tr><td>Mean, σ known</td><td>x̄ ± z<sub>α/2</sub> × σ / √n</td><td>n = 36, x̄ = 262, σ = 90: 262 ± 1.96 × 15 = 262 ± 29.4 → (232.6, 291.4)</td></tr>
<tr><td>Mean, σ unknown</td><td>x̄ ± t<sub>α/2, n−1</sub> × s / √n</td><td>n = 16, x̄ = 48.5, s = 6.2: t = 2.131, 48.5 ± 2.131 × 1.55 = 48.5 ± 3.30 → (45.20, 51.80)</td></tr>
<tr><td>Proportion</td><td>p̂ ± z<sub>α/2</sub> × √(p̂(1 − p̂) / n)</td><td>112 of 400 say yes: 0.28 ± 1.96 × 0.02245 = 0.28 ± 0.044 → (0.236, 0.324)</td></tr>
</table>
<p>Common z values: 1.645 (90%), 1.96 (95%), 2.576 (99%). The <strong>t distribution</strong> is used when σ is estimated by s. It has fatter tails than the normal, which widens the interval to allow for the extra uncertainty, and it approaches the normal as the degrees of freedom (n − 1) grow; with z instead of t, the margin in the second row would have been 3.04 instead of 3.30. Excel: CONFIDENCE.NORM, CONFIDENCE.T, T.INV.2T.</p>
<h3>Choosing the sample size</h3>
<pre><code>Mean:        n = (z × σ / E)²          σ = 90, E = 10, 95%:  (1.96 × 90 / 10)² = 311.2 → 312
Proportion:  n = z² × p(1 − p) / E²    p = 0.5 (most cautious), E = 0.03:  1,067.1 → 1,068</code></pre>
<p>Always round <strong>up</strong>. Using p = 0.5 gives the largest possible n when no earlier estimate of p exists; halving the margin E quadruples the required sample.</p>
<div class="callout"><span class="badge">Interpretation</span> "95% confident" means that 95% of intervals built this way would contain the true μ. It does not mean that there is a 95% probability that μ lies in this particular interval — μ is fixed; it is the interval that varies from sample to sample.</div>`,
    `<span class="eyebrow">MAS202 · Phần 3 · Bài 3.1</span>
<h2>Phân phối mẫu &amp; khoảng tin cậy</h2>
<p class="lead">Trung bình mẫu cũng là một biến ngẫu nhiên: lấy mẫu khác sẽ được một x̄ khác. Hiểu x̄ biến động thế nào giúp ta gắn một sai số biên cho bất kỳ ước lượng nào.</p>
<h3>Phân phối mẫu của x̄ và định lý giới hạn trung tâm</h3>
<pre><code>E(x̄) = μ              sai số chuẩn  σx̄ = σ / √n
Định lý giới hạn trung tâm (CLT): với mẫu đủ lớn (quy tắc kinh nghiệm n ≥ 30),
x̄ có phân phối xấp xỉ chuẩn bất kể hình dạng của tổng thể; nếu bản thân tổng
thể có phân phối chuẩn thì x̄ có phân phối chuẩn với mọi n.</code></pre>
<p>Minh hoạ giả định: giá trị mỗi lần mua tại một cửa hàng lệch phải, với μ = 250 và σ = 90 (nghìn đồng). Với các mẫu ngẫu nhiên n = 36 lần mua:</p>
<pre><code>σx̄ = 90 / √36 = 15
P(x̄ &gt; 275) = P(Z &gt; (275 − 250) / 15) = P(Z &gt; 1,667) = 0,0478</code></pre>
<p>Một lần mua trên 275 là chuyện thường, nhưng <em>trung bình</em> của 36 lần mua vượt 275 chỉ xảy ra khoảng 5% số lần — lấy trung bình triệt tiêu phần lớn sự biến động. Vì sai số chuẩn giảm theo √n, tăng cỡ mẫu gấp bốn chỉ làm sai số chuẩn giảm một nửa.</p>
<h3>Phân phối mẫu của p̂</h3>
<pre><code>E(p̂) = p       σp̂ = √(p(1 − p) / n)       xấp xỉ chuẩn nếu np ≥ 5 và n(1 − p) ≥ 5
p = 0,40, n = 150:  σp̂ = √(0,40 × 0,60 / 150) = 0,04
P(p̂ &lt; 0,35) = P(Z &lt; −1,25) = 0,1056</code></pre>
<h3>Khoảng tin cậy</h3>
<p>Mọi khoảng tin cậy đều có dạng <strong>ước lượng điểm ± sai số biên</strong>, trong đó sai số biên = giá trị tới hạn × sai số chuẩn.</p>
<table>
<tr><th>Trường hợp</th><th>Khoảng tin cậy</th><th>Kết quả minh hoạ 95%</th></tr>
<tr><td>Trung bình, biết σ</td><td>x̄ ± z<sub>α/2</sub> × σ / √n</td><td>n = 36, x̄ = 262, σ = 90: 262 ± 1,96 × 15 = 262 ± 29,4 → (232,6; 291,4)</td></tr>
<tr><td>Trung bình, không biết σ</td><td>x̄ ± t<sub>α/2, n−1</sub> × s / √n</td><td>n = 16, x̄ = 48,5, s = 6,2: t = 2,131, 48,5 ± 2,131 × 1,55 = 48,5 ± 3,30 → (45,20; 51,80)</td></tr>
<tr><td>Tỷ lệ</td><td>p̂ ± z<sub>α/2</sub> × √(p̂(1 − p̂) / n)</td><td>112 trên 400 người trả lời "có": 0,28 ± 1,96 × 0,02245 = 0,28 ± 0,044 → (0,236; 0,324)</td></tr>
</table>
<p>Các giá trị z thường dùng: 1,645 (90%), 1,96 (95%), 2,576 (99%). <strong>Phân phối t</strong> được dùng khi σ phải ước lượng bằng s. Nó có đuôi dày hơn phân phối chuẩn, làm khoảng tin cậy rộng hơn để bù cho phần bất định thêm vào, và tiến dần về phân phối chuẩn khi bậc tự do (n − 1) tăng; nếu dùng z thay cho t, sai số biên ở dòng thứ hai sẽ là 3,04 thay vì 3,30. Excel: CONFIDENCE.NORM, CONFIDENCE.T, T.INV.2T.</p>
<h3>Xác định cỡ mẫu</h3>
<pre><code>Trung bình:  n = (z × σ / E)²          σ = 90, E = 10, 95%:  (1,96 × 90 / 10)² = 311,2 → 312
Tỷ lệ:       n = z² × p(1 − p) / E²    p = 0,5 (thận trọng nhất), E = 0,03:  1.067,1 → 1.068</code></pre>
<p>Luôn làm tròn <strong>lên</strong>. Dùng p = 0,5 cho cỡ mẫu lớn nhất có thể khi chưa có ước lượng nào trước đó về p; giảm sai số biên E đi một nửa thì cỡ mẫu cần thiết tăng gấp bốn.</p>
<div class="callout"><span class="badge">Diễn giải</span> "Tin cậy 95%" nghĩa là 95% các khoảng được xây dựng theo cách này sẽ chứa μ thật. Nó không có nghĩa là có 95% xác suất μ nằm trong khoảng cụ thể này — μ là cố định; chính khoảng tin cậy mới thay đổi từ mẫu này sang mẫu khác.</div>`,
  ]]);

const c5 = doc('mas202-3-2-hypothesis-testing', '3.2 — Hypothesis testing: logic and one-sample tests|||3.2 — Kiểm định giả thuyết: lập luận và kiểm định một mẫu',
  'Sáu bước kiểm định, giả thuyết không H0 và giả thuyết đối H1, kiểm định một phía và hai phía, sai lầm loại I và loại II, mức ý nghĩa α, trị số p; kiểm định z cho trung bình, kiểm định t, kiểm định tỷ lệ; liên hệ giữa kiểm định và khoảng tin cậy.',
  [[
    `<span class="eyebrow">MAS202 · Part 3 · Lesson 3.2</span>
<h2>Hypothesis testing: logic and one-sample tests</h2>
<p class="lead">A hypothesis test asks whether sample evidence is strong enough to reject a claim about a population. It works like a trial: the null hypothesis is "innocent" until the data show otherwise beyond reasonable doubt.</p>
<h3>Six steps</h3>
<ol>
<li>State the <strong>null hypothesis H0</strong> (the status quo, containing "=") and the <strong>alternative H1</strong> (what you want evidence for): two-tailed (≠) or one-tailed (&lt; or &gt;), decided <em>before</em> looking at the data.</li>
<li>Choose the <strong>significance level α</strong> (commonly 0.05).</li>
<li>Compute the <strong>test statistic</strong> from the sample.</li>
<li>Find the <strong>p-value</strong> (or the critical value).</li>
<li>Decide: reject H0 if p-value ≤ α — equivalently, if the statistic falls in the rejection region.</li>
<li>State the conclusion in business language.</li>
</ol>
<h3>Two kinds of error</h3>
<table>
<tr><th>Decision</th><th>H0 true</th><th>H0 false</th></tr>
<tr><td>Reject H0</td><td>Type I error (probability α)</td><td>Correct (power = 1 − β)</td></tr>
<tr><td>Do not reject H0</td><td>Correct</td><td>Type II error (probability β)</td></tr>
</table>
<p>For a given sample size, lowering α reduces Type I errors but raises β; only a larger sample reduces both. We say "do not reject H0", never "accept H0": a lack of evidence against H0 does not prove it true.</p>
<h3>The p-value</h3>
<p>The p-value is the probability, <em>assuming H0 is true</em>, of getting a test statistic at least as extreme as the one observed. A small p-value means the data would be surprising if H0 were true. It is <strong>not</strong> the probability that H0 is true.</p>
<h3>One-sample tests</h3>
<pre><code>Mean, σ known:     z = (x̄ − μ0) / (σ / √n)
Mean, σ unknown:   t = (x̄ − μ0) / (s / √n),   df = n − 1        (worked in Exercise 3)
Proportion:        z = (p̂ − p0) / √(p0(1 − p0) / n)</code></pre>
<p><strong>Example 1 — two-tailed z-test.</strong> A machine should fill bags with μ = 500 g; σ = 12 g is known from long experience. A sample of 36 bags has x̄ = 495.2 g. H0: μ = 500 vs H1: μ ≠ 500, α = 0.05.</p>
<pre><code>z = (495.2 − 500) / (12 / √36) = −4.8 / 2 = −2.40
p-value = 2 × P(Z &lt; −2.40) = 0.0164 ≤ 0.05        → reject H0
Critical values ±1.96: −2.40 lies in the rejection region  → same decision
95% CI: 495.2 ± 1.96 × 2 = (491.28, 499.12), which does not contain 500</code></pre>
<p>Conclusion: the machine is underfilling on average and should be recalibrated. Note the link: a two-tailed test at level α rejects H0 exactly when μ0 lies outside the (1 − α) confidence interval.</p>
<p><strong>Example 2 — one-tailed test for a proportion.</strong> A website’s historical conversion rate is 10%. After a redesign, 62 of 500 visitors buy. Is there evidence of improvement? H0: p = 0.10 vs H1: p &gt; 0.10, α = 0.05.</p>
<pre><code>p̂ = 62 / 500 = 0.124        standard error under H0 = √(0.10 × 0.90 / 500) = 0.01342
z = (0.124 − 0.10) / 0.01342 = 1.789
p-value = P(Z &gt; 1.789) = 0.0368 ≤ 0.05     → reject H0   (critical value 1.645)</code></pre>
<p>Tested two-tailed, the same data would give p = 0.0736 and no rejection — which is exactly why the direction of H1 must come from the business question in advance, not from the result.</p>
<div class="callout"><span class="badge">Significant ≠ important</span> With a very large sample, a difference too small to matter commercially can be "statistically significant". Always report the size of the effect, with a confidence interval, alongside the p-value.</div>`,
    `<span class="eyebrow">MAS202 · Phần 3 · Bài 3.2</span>
<h2>Kiểm định giả thuyết: lập luận và kiểm định một mẫu</h2>
<p class="lead">Kiểm định giả thuyết đặt câu hỏi: bằng chứng từ mẫu có đủ mạnh để bác bỏ một nhận định về tổng thể không? Nó giống một phiên toà: giả thuyết không được coi là "vô tội" cho tới khi dữ liệu chứng minh điều ngược lại vượt quá mọi nghi ngờ hợp lý.</p>
<h3>Sáu bước</h3>
<ol>
<li>Phát biểu <strong>giả thuyết không H0</strong> (hiện trạng, chứa dấu "=") và <strong>giả thuyết đối H1</strong> (điều muốn tìm bằng chứng): hai phía (≠) hoặc một phía (&lt; hoặc &gt;), quyết định <em>trước khi</em> xem dữ liệu.</li>
<li>Chọn <strong>mức ý nghĩa α</strong> (thường là 0,05).</li>
<li>Tính <strong>thống kê kiểm định</strong> từ mẫu.</li>
<li>Tìm <strong>trị số p</strong> (hoặc giá trị tới hạn).</li>
<li>Quyết định: bác bỏ H0 nếu trị số p ≤ α — tương đương với việc thống kê kiểm định rơi vào miền bác bỏ.</li>
<li>Phát biểu kết luận bằng ngôn ngữ kinh doanh.</li>
</ol>
<h3>Hai loại sai lầm</h3>
<table>
<tr><th>Quyết định</th><th>H0 đúng</th><th>H0 sai</th></tr>
<tr><td>Bác bỏ H0</td><td>Sai lầm loại I (xác suất α)</td><td>Đúng (lực kiểm định = 1 − β)</td></tr>
<tr><td>Không bác bỏ H0</td><td>Đúng</td><td>Sai lầm loại II (xác suất β)</td></tr>
</table>
<p>Với cỡ mẫu cho trước, giảm α làm giảm sai lầm loại I nhưng làm tăng β; chỉ tăng cỡ mẫu mới giảm được cả hai. Ta nói "không bác bỏ H0", không bao giờ nói "chấp nhận H0": thiếu bằng chứng chống lại H0 không chứng minh H0 đúng.</p>
<h3>Trị số p</h3>
<p>Trị số p là xác suất, <em>với giả định H0 đúng</em>, thu được một thống kê kiểm định ít nhất cũng cực đoan như giá trị đã quan sát. Trị số p nhỏ nghĩa là dữ liệu sẽ rất đáng ngạc nhiên nếu H0 đúng. Nó <strong>không</strong> phải là xác suất để H0 đúng.</p>
<h3>Kiểm định một mẫu</h3>
<pre><code>Trung bình, biết σ:        z = (x̄ − μ0) / (σ / √n)
Trung bình, không biết σ:  t = (x̄ − μ0) / (s / √n),   bậc tự do = n − 1   (xem Bài tập 3)
Tỷ lệ:                     z = (p̂ − p0) / √(p0(1 − p0) / n)</code></pre>
<p><strong>Ví dụ 1 — kiểm định z hai phía.</strong> Một máy đóng gói phải rót mỗi túi μ = 500 g; σ = 12 g đã biết từ kinh nghiệm lâu năm. Một mẫu 36 túi có x̄ = 495,2 g. H0: μ = 500 và H1: μ ≠ 500, α = 0,05.</p>
<pre><code>z = (495,2 − 500) / (12 / √36) = −4,8 / 2 = −2,40
Trị số p = 2 × P(Z &lt; −2,40) = 0,0164 ≤ 0,05        → bác bỏ H0
Giá trị tới hạn ±1,96: −2,40 nằm trong miền bác bỏ   → cùng quyết định
KTC 95%: 495,2 ± 1,96 × 2 = (491,28; 499,12), không chứa 500</code></pre>
<p>Kết luận: máy đang rót thiếu so với mức chuẩn và cần hiệu chỉnh lại. Lưu ý mối liên hệ: kiểm định hai phía ở mức α bác bỏ H0 đúng khi và chỉ khi μ0 nằm ngoài khoảng tin cậy (1 − α).</p>
<p><strong>Ví dụ 2 — kiểm định một phía cho tỷ lệ.</strong> Tỷ lệ chuyển đổi trước đây của một website là 10%. Sau khi thiết kế lại, 62 trên 500 khách truy cập mua hàng. Có bằng chứng về sự cải thiện không? H0: p = 0,10 và H1: p &gt; 0,10, α = 0,05.</p>
<pre><code>p̂ = 62 / 500 = 0,124        sai số chuẩn khi H0 đúng = √(0,10 × 0,90 / 500) = 0,01342
z = (0,124 − 0,10) / 0,01342 = 1,789
Trị số p = P(Z &gt; 1,789) = 0,0368 ≤ 0,05     → bác bỏ H0   (giá trị tới hạn 1,645)</code></pre>
<p>Nếu kiểm định hai phía, cùng dữ liệu đó cho p = 0,0736 và không bác bỏ — đó chính là lý do chiều của H1 phải xuất phát từ câu hỏi kinh doanh và được chọn từ trước, chứ không dựa vào kết quả.</p>
<div class="callout"><span class="badge">Có ý nghĩa thống kê ≠ quan trọng</span> Với mẫu rất lớn, một chênh lệch quá nhỏ để có giá trị kinh doanh vẫn có thể "có ý nghĩa thống kê". Luôn báo cáo độ lớn của tác động, kèm khoảng tin cậy, bên cạnh trị số p.</div>`,
  ]]);

const c5e = doc('mas202-3-3-exercise', 'Exercise 3 — confidence interval and one-sample t-test|||Bài tập 3 — khoảng tin cậy và kiểm định t một mẫu',
  'Bài tập: từ 12 giao dịch sau chương trình khách hàng thân thiết, tính trung bình, độ lệch chuẩn mẫu, sai số chuẩn, khoảng tin cậy 95% theo phân phối t, kiểm định t hai phía bằng giá trị tới hạn và trị số p, đối chiếu hai cách và nêu giới hạn của kết luận; kèm lời giải.',
  [[
    `<span class="eyebrow">MAS202 · Part 3 · Exercise 3</span>
<h2>Exercise 3 — did the loyalty programme change the average basket?</h2>
<div class="callout"><span class="badge">Problem</span> Before a loyalty programme, a retail chain’s average transaction value was 185 (thousand VND). After the launch, a random sample of 12 transactions gives (illustrative data): 192, 178, 205, 188, 199, 210, 184, 196, 173, 201, 190, 207. Assume transaction values are approximately normal. (a) Compute x̄, s and the standard error. (b) Build a 95% confidence interval for the new mean. (c) At α = 0.05, test whether the mean has changed (H0: μ = 185 vs H1: μ ≠ 185) using both the critical-value and the p-value approach. (d) Explain why (b) and (c) agree, and what the result does and does not prove.</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) Σx = 2,323        x̄ = 2,323 / 12 = 193.58
    Σ(x − x̄)² = 1,474.92        s = √(1,474.92 / 11) = 11.58
    SE = s / √n = 11.58 / √12 = 3.343

(b) df = 11, t(0.025; 11) = 2.201
    Margin of error = 2.201 × 3.343 = 7.36
    95% CI: 193.58 ± 7.36  →  (186.23, 200.94)

(c) t = (193.58 − 185) / 3.343 = 2.57
    Critical-value approach: |2.57| &gt; 2.201           → reject H0
    p-value approach: two-tailed p (df = 11) = 0.026 ≤ 0.05  → reject H0
    Excel: =T.DIST.2T(2.568, 11) returns 0.026

(d) 185 lies outside the 95% CI (186.23 to 200.94), so a two-tailed
    test at the 5% level must reject H0 — the two methods always agree.</code></pre>
<p><strong>Why:</strong> the sample suggests that the average transaction rose by about 8.6 thousand VND, and the interval says the true increase is plausibly anywhere from about 1.2 to 15.9. We use t because σ is unknown and estimated by s; with only 12 observations the normality assumption matters, so check a histogram or box plot first. The evidence is not overwhelming: at α = 0.01 we would not reject (the 99% CI, 183.20 to 203.97, contains 185). Above all, the test shows that the mean changed, not <em>why</em>: season, prices or a new product could explain the rise. A causal claim needs a comparison group, such as stores without the programme or a randomised A/B design.</p>`,
    `<span class="eyebrow">MAS202 · Phần 3 · Bài tập 3</span>
<h2>Bài tập 3 — chương trình khách hàng thân thiết có làm đổi giá trị giỏ hàng trung bình?</h2>
<div class="callout"><span class="badge">Đề</span> Trước chương trình khách hàng thân thiết, giá trị giao dịch trung bình của một chuỗi bán lẻ là 185 (nghìn đồng). Sau khi triển khai, một mẫu ngẫu nhiên 12 giao dịch cho kết quả (dữ liệu minh hoạ giả định): 192, 178, 205, 188, 199, 210, 184, 196, 173, 201, 190, 207. Giả sử giá trị giao dịch có phân phối xấp xỉ chuẩn. (a) Tính x̄, s và sai số chuẩn. (b) Xây dựng khoảng tin cậy 95% cho trung bình mới. (c) Với α = 0,05, kiểm định xem trung bình có thay đổi không (H0: μ = 185 và H1: μ ≠ 185) bằng cả cách giá trị tới hạn lẫn cách trị số p. (d) Giải thích vì sao (b) và (c) thống nhất, và kết quả chứng minh được gì, không chứng minh được gì.</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) Σx = 2.323        x̄ = 2.323 / 12 = 193,58
    Σ(x − x̄)² = 1.474,92        s = √(1.474,92 / 11) = 11,58
    SE = s / √n = 11,58 / √12 = 3,343

(b) Bậc tự do = 11, t(0,025; 11) = 2,201
    Sai số biên = 2,201 × 3,343 = 7,36
    KTC 95%: 193,58 ± 7,36  →  (186,23; 200,94)

(c) t = (193,58 − 185) / 3,343 = 2,57
    Cách giá trị tới hạn: |2,57| &gt; 2,201                  → bác bỏ H0
    Cách trị số p: p hai phía (bậc tự do 11) = 0,026 ≤ 0,05  → bác bỏ H0
    Excel: =T.DIST.2T(2,568; 11) trả về 0,026

(d) 185 nằm ngoài KTC 95% (186,23 đến 200,94), nên kiểm định hai phía
    ở mức 5% chắc chắn bác bỏ H0 — hai cách luôn cho cùng kết luận.</code></pre>
<p><strong>Vì sao:</strong> mẫu cho thấy giá trị giao dịch trung bình tăng khoảng 8,6 nghìn đồng, và khoảng tin cậy cho biết mức tăng thật có thể nằm đâu đó từ khoảng 1,2 đến 15,9. Ta dùng t vì σ chưa biết và phải ước lượng bằng s; với chỉ 12 quan sát, giả định phân phối chuẩn rất quan trọng, nên hãy xem histogram hoặc biểu đồ hộp trước. Bằng chứng không quá áp đảo: ở α = 0,01 ta sẽ không bác bỏ (KTC 99%, từ 183,20 đến 203,97, chứa 185). Quan trọng nhất, kiểm định chỉ cho thấy trung bình đã thay đổi, không cho biết <em>vì sao</em>: mùa vụ, giá bán hay một sản phẩm mới đều có thể giải thích mức tăng. Muốn kết luận nhân quả cần có nhóm đối chứng, như các cửa hàng không áp dụng chương trình hoặc một thiết kế A/B ngẫu nhiên.</p>`,
  ]]);

const c5q = quiz('mas202-quiz-3', 'Quiz 3 — Sampling, estimation & testing|||Quiz 3 — Phân phối mẫu, ước lượng & kiểm định', [
  { id: 'q1', question: 'The sample size increases from 25 to 100. What happens to the standard error of the mean?|||Cỡ mẫu tăng từ 25 lên 100. Sai số chuẩn của trung bình thay đổi thế nào?', options: ['It doubles|||Tăng gấp đôi', 'It is halved|||Giảm một nửa', 'It is divided by 4|||Giảm còn một phần tư', 'It does not change|||Không đổi'], correctIndex: 1, explanation: 'SE = σ / √n; the sample size is 4 times larger and √4 = 2, so SE is halved.|||SE = σ / √n; cỡ mẫu lớn gấp 4 lần và √4 = 2, nên SE giảm một nửa.' },
  { id: 'q2', question: 'A 95% confidence interval for a mean is (40, 48). A two-tailed test of H0: μ = 50 at α = 0.05 would…|||Khoảng tin cậy 95% của một trung bình là (40; 48). Kiểm định hai phía H0: μ = 50 ở α = 0,05 sẽ…', options: ['not reject H0|||không bác bỏ H0', 'reject H0 only if n is above 30|||chỉ bác bỏ H0 nếu n lớn hơn 30', 'need the p-value before any decision|||cần trị số p mới quyết định được', 'reject H0|||bác bỏ H0'], correctIndex: 3, explanation: '50 lies outside the 95% interval, and a two-tailed test at 5% rejects exactly the values outside that interval.|||50 nằm ngoài khoảng tin cậy 95%, mà kiểm định hai phía ở mức 5% bác bỏ đúng những giá trị nằm ngoài khoảng đó.' },
  { id: 'q3', question: 'A test gives a p-value of 0.03. What does this mean?|||Một kiểm định cho trị số p = 0,03. Điều này có nghĩa là gì?', options: ['There is a 3% chance that H0 is true|||Có 3% khả năng H0 đúng', 'The effect size is 3%|||Độ lớn tác động là 3%', 'If H0 were true, a result at least this extreme would occur about 3% of the time|||Nếu H0 đúng, kết quả ít nhất cực đoan như vậy chỉ xảy ra khoảng 3% số lần', 'H1 is true with 97% probability|||H1 đúng với xác suất 97%'], correctIndex: 2, explanation: 'The p-value is computed assuming H0 is true; it is not the probability that H0 or H1 is true, and it says nothing about the size of the effect.|||Trị số p được tính với giả định H0 đúng; nó không phải xác suất để H0 hay H1 đúng, và không nói gì về độ lớn của tác động.' },
]);

const c6 = doc('mas202-4-1-comparing-groups', '4.1 — Comparing groups: two-sample t, chi-square and ANOVA|||4.1 — So sánh nhóm: t hai mẫu, khi bình phương và ANOVA',
  'Kiểm định t hai mẫu độc lập (phương sai gộp, Welch) và kiểm định t cặp; kiểm định khi bình phương về tính độc lập trên bảng chéo 400 khách hàng; phân tích phương sai một yếu tố so sánh ba chương trình khuyến mãi; cách chọn kiểm định.',
  [[
    `<span class="eyebrow">MAS202 · Part 4 · Lesson 4.1</span>
<h2>Comparing groups: two-sample t, chi-square and ANOVA</h2>
<p class="lead">Many business questions compare groups: is layout A better than layout B, does plan choice depend on channel, do three promotions produce different sales? Each question has its own test, but the six-step logic of lesson 3.2 stays the same.</p>
<h3>Two independent means: the two-sample t-test</h3>
<p>Illustrative A/B test: 25 stores use layout A (average basket x̄1 = 72, s1 = 10, thousand VND) and 25 stores use layout B (x̄2 = 66, s2 = 12). H0: μ1 = μ2 vs H1: μ1 ≠ μ2, α = 0.05.</p>
<pre><code>Pooled variance  sp² = [(n1 − 1)s1² + (n2 − 1)s2²] / (n1 + n2 − 2)
                     = (24 × 100 + 24 × 144) / 48 = 122          sp = 11.05
t = (x̄1 − x̄2) / (sp × √(1/n1 + 1/n2)) = 6 / 3.124 = 1.92       df = 48
Critical value t(0.025; 48) = 2.011;  p-value = 0.061  → do not reject H0
95% CI for μ1 − μ2: 6 ± 2.011 × 3.124 = (−0.28, 12.28)</code></pre>
<p>A 6-point gap looks large, but with this much variation between stores it could be chance — the interval includes 0. The pooled test assumes equal population variances; when in doubt use <strong>Welch’s t-test</strong> (Excel: "t-Test: Two-Sample Assuming Unequal Variances"), which here gives almost the same result (df ≈ 46.5, p = 0.061). When the same units are measured twice — before and after, or the same customers rating two products — use the <strong>paired t-test</strong> on the differences instead.</p>
<h3>Chi-square test of independence</h3>
<p>For two categorical variables. Using the 400-customer table of lesson 2.1 — H0: channel and plan are independent; H1: they are related.</p>
<pre><code>Expected count  E = row total × column total / grand total
                 Premium              Basic
Online      O = 72,  E = 60      O = 168, E = 180
In store    O = 28,  E = 40      O = 132, E = 120
χ² = Σ (O − E)² / E = 2.4 + 0.8 + 3.6 + 1.2 = 8.00
df = (rows − 1)(columns − 1) = 1;  critical value 3.841;  p-value = 0.0047  → reject H0</code></pre>
<p>Plan choice depends on channel: online customers choose Premium more often than independence would predict. The test requires every expected count to be at least 5.</p>
<h3>One-way ANOVA</h3>
<p>To compare three or more means at once — running many separate t-tests would inflate the overall Type I error. Illustrative weekly sales (million VND) of 15 similar stores, 5 per promotion:</p>
<pre><code>Promotion A: 22 25 24 27 22    mean 24
Promotion B: 28 30 27 31 29    mean 29
Promotion C: 23 26 25 24 22    mean 24            grand mean 25.67

Source     SS       df    MS       F
Between    83.33     2    41.67    13.16
Within     38.00    12     3.17
Total     121.33    14
F critical (2, 12; α = 0.05) = 3.885;  p-value = 0.0009  → reject H0: μA = μB = μC</code></pre>
<p>Rejecting H0 says that <em>at least one</em> mean differs, not which one; a post hoc comparison such as Tukey’s procedure identifies it — here clearly promotion B. ANOVA assumes independent random samples, approximately normal populations and similar variances.</p>
<div class="callout"><span class="badge">Choosing a test</span> Numeric outcome, 2 groups → two-sample t (paired if the same units). Numeric outcome, 3 or more groups → ANOVA. Two categorical variables → chi-square. Numeric outcome and a numeric predictor → regression (next lesson).</div>`,
    `<span class="eyebrow">MAS202 · Phần 4 · Bài 4.1</span>
<h2>So sánh nhóm: t hai mẫu, khi bình phương và ANOVA</h2>
<p class="lead">Nhiều câu hỏi kinh doanh là so sánh các nhóm: cách bày hàng A có tốt hơn B không, lựa chọn gói dịch vụ có phụ thuộc kênh mua không, ba chương trình khuyến mãi có cho doanh số khác nhau không? Mỗi câu hỏi có kiểm định riêng, nhưng lập luận sáu bước ở bài 3.2 vẫn giữ nguyên.</p>
<h3>Hai trung bình độc lập: kiểm định t hai mẫu</h3>
<p>Thử nghiệm A/B minh hoạ giả định: 25 cửa hàng bày hàng kiểu A (giá trị giỏ hàng trung bình x̄1 = 72, s1 = 10, nghìn đồng) và 25 cửa hàng kiểu B (x̄2 = 66, s2 = 12). H0: μ1 = μ2 và H1: μ1 ≠ μ2, α = 0,05.</p>
<pre><code>Phương sai gộp  sp² = [(n1 − 1)s1² + (n2 − 1)s2²] / (n1 + n2 − 2)
                    = (24 × 100 + 24 × 144) / 48 = 122          sp = 11,05
t = (x̄1 − x̄2) / (sp × √(1/n1 + 1/n2)) = 6 / 3,124 = 1,92       bậc tự do = 48
Giá trị tới hạn t(0,025; 48) = 2,011;  trị số p = 0,061  → không bác bỏ H0
KTC 95% cho μ1 − μ2: 6 ± 2,011 × 3,124 = (−0,28; 12,28)</code></pre>
<p>Chênh lệch 6 điểm trông có vẻ lớn, nhưng với mức biến động giữa các cửa hàng như vậy thì nó có thể do ngẫu nhiên — khoảng tin cậy chứa 0. Kiểm định gộp giả định phương sai hai tổng thể bằng nhau; khi không chắc, hãy dùng <strong>kiểm định t Welch</strong> (Excel: "t-Test: Two-Sample Assuming Unequal Variances"), ở đây cho kết quả gần như y hệt (bậc tự do ≈ 46,5, p = 0,061). Khi cùng một đối tượng được đo hai lần — trước và sau, hoặc cùng khách hàng đánh giá hai sản phẩm — hãy dùng <strong>kiểm định t cặp</strong> trên các chênh lệch.</p>
<h3>Kiểm định khi bình phương về tính độc lập</h3>
<p>Dùng cho hai biến định tính. Lấy bảng 400 khách hàng ở bài 2.1 — H0: kênh mua và gói dịch vụ độc lập; H1: chúng có liên hệ.</p>
<pre><code>Tần số kỳ vọng  E = tổng hàng × tổng cột / tổng chung
                 Cao cấp              Cơ bản
Trực tuyến  O = 72,  E = 60      O = 168, E = 180
Cửa hàng    O = 28,  E = 40      O = 132, E = 120
χ² = Σ (O − E)² / E = 2,4 + 0,8 + 3,6 + 1,2 = 8,00
Bậc tự do = (số hàng − 1)(số cột − 1) = 1;  giá trị tới hạn 3,841;  trị số p = 0,0047  → bác bỏ H0</code></pre>
<p>Lựa chọn gói dịch vụ phụ thuộc vào kênh mua: khách trực tuyến chọn gói Cao cấp nhiều hơn mức mà giả thuyết độc lập dự báo. Kiểm định đòi hỏi mọi tần số kỳ vọng đều từ 5 trở lên.</p>
<h3>Phân tích phương sai (ANOVA) một yếu tố</h3>
<p>Dùng để so sánh cùng lúc ba trung bình trở lên — chạy nhiều kiểm định t riêng rẽ sẽ làm tăng xác suất sai lầm loại I tổng thể. Doanh số tuần minh hoạ giả định (triệu đồng) của 15 cửa hàng tương tự nhau, mỗi chương trình khuyến mãi 5 cửa hàng:</p>
<pre><code>Khuyến mãi A: 22 25 24 27 22    trung bình 24
Khuyến mãi B: 28 30 27 31 29    trung bình 29
Khuyến mãi C: 23 26 25 24 22    trung bình 24       trung bình chung 25,67

Nguồn          SS       df    MS       F
Giữa nhóm      83,33     2    41,67    13,16
Trong nhóm     38,00    12     3,17
Tổng          121,33    14
F tới hạn (2, 12; α = 0,05) = 3,885;  trị số p = 0,0009  → bác bỏ H0: μA = μB = μC</code></pre>
<p>Bác bỏ H0 chỉ cho biết <em>ít nhất một</em> trung bình khác biệt, không cho biết là trung bình nào; phép so sánh hậu kiểm như phương pháp Tukey sẽ xác định — ở đây rõ ràng là khuyến mãi B. ANOVA giả định các mẫu ngẫu nhiên độc lập, tổng thể xấp xỉ chuẩn và phương sai tương đương nhau.</p>
<div class="callout"><span class="badge">Chọn kiểm định</span> Biến kết quả định lượng, 2 nhóm → t hai mẫu (t cặp nếu cùng đối tượng). Biến kết quả định lượng, từ 3 nhóm trở lên → ANOVA. Hai biến định tính → khi bình phương. Biến kết quả định lượng và biến giải thích định lượng → hồi quy (bài tiếp theo).</div>`,
  ]]);

const c7 = doc('mas202-4-2-regression', '4.2 — Correlation & simple linear regression|||4.2 — Tương quan & hồi quy tuyến tính đơn',
  'Biểu đồ phân tán, hiệp phương sai, hệ số tương quan r; đường hồi quy bình phương nhỏ nhất, diễn giải hệ số chặn và độ dốc; R², sai số chuẩn của ước lượng; kiểm định t cho độ dốc, các giả định LINE; giới thiệu hồi quy bội và R² hiệu chỉnh.',
  [[
    `<span class="eyebrow">MAS202 · Part 4 · Lesson 4.2</span>
<h2>Correlation &amp; simple linear regression</h2>
<p class="lead">Regression turns a relationship into an equation: how much do sales change, on average, when advertising rises by one unit — and how reliable is that estimate?</p>
<h3>Scatter plot, covariance and correlation</h3>
<pre><code>Sxx = Σ(x − x̄)²       Syy = Σ(y − ȳ)²       Sxy = Σ(x − x̄)(y − ȳ)
Sample covariance   sxy = Sxy / (n − 1)
Correlation         r = Sxy / √(Sxx × Syy),     −1 ≤ r ≤ 1</code></pre>
<p>Always plot the data first. r measures the strength and direction of a <strong>linear</strong> relationship only; it has no units; an r near 0 can hide a strong curved pattern; and correlation does not prove causation — a third variable, such as the season, may drive both.</p>
<h3>The least-squares line</h3>
<pre><code>ŷ = b0 + b1 x        b1 = Sxy / Sxx        b0 = ȳ − b1 x̄
Illustrative summary, 8 months: x = advertising, y = sales (both million VND)
n = 8, x̄ = 5, ȳ = 40, Sxx = 42, Sxy = 126, Syy = 450
b1 = 126 / 42 = 3.0       b0 = 40 − 3 × 5 = 25       ŷ = 25 + 3x
r = 126 / √(42 × 450) = 0.917
Prediction for x = 7:  ŷ = 25 + 3 × 7 = 46</code></pre>
<p>Least squares chooses the line that minimises the sum of squared residuals Σ(y − ŷ)². <strong>Slope:</strong> each extra million VND of advertising is associated with 3 million VND more sales, on average. <strong>Intercept:</strong> the predicted sales with no advertising — meaningful only if x = 0 lies within the observed data; otherwise it is simply where the line is anchored.</p>
<h3>How good is the fit? R² and the standard error</h3>
<pre><code>SST = Syy = 450        SSR = b1 × Sxy = 378        SSE = SST − SSR = 72
R² = SSR / SST = 0.84                     (in simple regression R² = r²)
Standard error of the estimate  se = √(SSE / (n − 2)) = √12 = 3.46</code></pre>
<p>R² = 0.84 means that 84% of the variation in sales is explained by the linear relationship with advertising. se is the typical size of a prediction error, in the units of y.</p>
<h3>Is the slope significant?</h3>
<pre><code>H0: β1 = 0 (no linear relationship)    vs    H1: β1 ≠ 0
SE(b1) = se / √Sxx = 3.464 / √42 = 0.535
t = b1 / SE(b1) = 3 / 0.535 = 5.61,      df = n − 2 = 6
t(0.025; 6) = 2.447;  p-value = 0.0014  → reject H0
95% CI for β1: 3 ± 2.447 × 0.535 = (1.69, 4.31)</code></pre>
<p>The regression assumptions are summarised as <strong>LINE</strong>: Linearity, Independence of errors, Normality of errors and Equal variance of errors. Check them with residual plots: residuals should scatter randomly around 0, with no curve and no funnel shape.</p>
<h3>A first look at multiple regression</h3>
<p>With several predictors, ŷ = b0 + b1x1 + b2x2 + … + bkxk. Illustrative estimated model: Sales (units) = 120 + 4.5 × Advertising (million VND) − 8.0 × Price (thousand VND). Each coefficient is the effect of its variable <strong>holding the others constant</strong>: at the same advertising level, a price 1 thousand VND higher is associated with 8 fewer units. Prediction for advertising 20 and price 15: 120 + 90 − 120 = 90 units. Use the <strong>F-test</strong> for the model as a whole, t-tests for individual coefficients, and <strong>adjusted R²</strong> = 1 − (1 − R²)(n − 1) / (n − k − 1) to compare models, because plain R² never falls when a variable is added (R² = 0.80, n = 30, k = 2 gives adjusted R² = 0.785). Watch for multicollinearity (strongly correlated predictors), and use dummy (0/1) variables for categories.</p>
<div class="callout"><span class="badge">Do not extrapolate</span> The line is only reliable within the range of x values observed. Predicting sales for an advertising budget ten times larger than anything in the data assumes the relationship stays linear — it rarely does.</div>`,
    `<span class="eyebrow">MAS202 · Phần 4 · Bài 4.2</span>
<h2>Tương quan &amp; hồi quy tuyến tính đơn</h2>
<p class="lead">Hồi quy biến một mối liên hệ thành một phương trình: trung bình doanh số thay đổi bao nhiêu khi chi phí quảng cáo tăng thêm một đơn vị — và ước lượng đó đáng tin đến mức nào?</p>
<h3>Biểu đồ phân tán, hiệp phương sai và hệ số tương quan</h3>
<pre><code>Sxx = Σ(x − x̄)²       Syy = Σ(y − ȳ)²       Sxy = Σ(x − x̄)(y − ȳ)
Hiệp phương sai mẫu   sxy = Sxy / (n − 1)
Hệ số tương quan      r = Sxy / √(Sxx × Syy),     −1 ≤ r ≤ 1</code></pre>
<p>Luôn vẽ dữ liệu trước. r chỉ đo cường độ và chiều của mối liên hệ <strong>tuyến tính</strong>; nó không có đơn vị; r gần 0 vẫn có thể che giấu một quan hệ dạng cong rất rõ; và tương quan không chứng minh quan hệ nhân quả — một biến thứ ba, chẳng hạn mùa vụ, có thể tác động lên cả hai.</p>
<h3>Đường hồi quy bình phương nhỏ nhất</h3>
<pre><code>ŷ = b0 + b1 x        b1 = Sxy / Sxx        b0 = ȳ − b1 x̄
Số liệu tóm tắt minh hoạ, 8 tháng: x = chi phí quảng cáo, y = doanh số (đều tính bằng triệu đồng)
n = 8, x̄ = 5, ȳ = 40, Sxx = 42, Sxy = 126, Syy = 450
b1 = 126 / 42 = 3,0       b0 = 40 − 3 × 5 = 25       ŷ = 25 + 3x
r = 126 / √(42 × 450) = 0,917
Dự báo với x = 7:  ŷ = 25 + 3 × 7 = 46</code></pre>
<p>Phương pháp bình phương nhỏ nhất chọn đường thẳng làm tổng bình phương phần dư Σ(y − ŷ)² nhỏ nhất. <strong>Độ dốc:</strong> mỗi triệu đồng quảng cáo tăng thêm gắn với doanh số tăng trung bình 3 triệu đồng. <strong>Hệ số chặn:</strong> doanh số dự báo khi không quảng cáo — chỉ có ý nghĩa nếu x = 0 nằm trong phạm vi dữ liệu quan sát; nếu không, nó chỉ là điểm neo của đường thẳng.</p>
<h3>Mô hình phù hợp đến đâu? R² và sai số chuẩn</h3>
<pre><code>SST = Syy = 450        SSR = b1 × Sxy = 378        SSE = SST − SSR = 72
R² = SSR / SST = 0,84                     (trong hồi quy đơn, R² = r²)
Sai số chuẩn của ước lượng  se = √(SSE / (n − 2)) = √12 = 3,46</code></pre>
<p>R² = 0,84 nghĩa là 84% biến động của doanh số được giải thích bởi mối liên hệ tuyến tính với chi phí quảng cáo. se là độ lớn điển hình của sai số dự báo, tính theo đơn vị của y.</p>
<h3>Độ dốc có ý nghĩa thống kê không?</h3>
<pre><code>H0: β1 = 0 (không có quan hệ tuyến tính)    và    H1: β1 ≠ 0
SE(b1) = se / √Sxx = 3,464 / √42 = 0,535
t = b1 / SE(b1) = 3 / 0,535 = 5,61,      bậc tự do = n − 2 = 6
t(0,025; 6) = 2,447;  trị số p = 0,0014  → bác bỏ H0
KTC 95% cho β1: 3 ± 2,447 × 0,535 = (1,69; 4,31)</code></pre>
<p>Các giả định của hồi quy được tóm tắt là <strong>LINE</strong>: tuyến tính (Linearity), sai số độc lập (Independence), sai số phân phối chuẩn (Normality) và phương sai sai số không đổi (Equal variance). Kiểm tra bằng đồ thị phần dư: phần dư phải phân tán ngẫu nhiên quanh 0, không có dạng cong và không có hình phễu.</p>
<h3>Làm quen với hồi quy bội</h3>
<p>Khi có nhiều biến giải thích, ŷ = b0 + b1x1 + b2x2 + … + bkxk. Mô hình ước lượng minh hoạ giả định: Doanh số (sản phẩm) = 120 + 4,5 × Quảng cáo (triệu đồng) − 8,0 × Giá (nghìn đồng). Mỗi hệ số là tác động của biến đó <strong>khi giữ nguyên các biến khác</strong>: với cùng mức quảng cáo, giá cao hơn 1 nghìn đồng gắn với doanh số ít hơn 8 sản phẩm. Dự báo với quảng cáo 20 và giá 15: 120 + 90 − 120 = 90 sản phẩm. Dùng <strong>kiểm định F</strong> cho toàn bộ mô hình, kiểm định t cho từng hệ số, và <strong>R² hiệu chỉnh</strong> = 1 − (1 − R²)(n − 1) / (n − k − 1) để so sánh các mô hình, vì R² thông thường không bao giờ giảm khi thêm biến (R² = 0,80, n = 30, k = 2 cho R² hiệu chỉnh = 0,785). Cảnh giác với đa cộng tuyến (các biến giải thích tương quan mạnh với nhau), và dùng biến giả (0/1) cho các biến định tính.</p>
<div class="callout"><span class="badge">Đừng ngoại suy</span> Đường hồi quy chỉ đáng tin trong phạm vi các giá trị x đã quan sát. Dự báo doanh số cho ngân sách quảng cáo lớn gấp mười lần mọi mức trong dữ liệu là mặc nhiên cho rằng quan hệ vẫn tuyến tính — điều hiếm khi đúng.</div>`,
  ]]);

const c7e = doc('mas202-4-3-exercise', 'Exercise 4 — fitting a regression line by hand|||Bài tập 4 — tính tay đường hồi quy',
  'Bài tập: với 6 tuần số liệu cuộc gọi bán hàng và số sản phẩm được đặt, tính tay hệ số hồi quy bình phương nhỏ nhất, diễn giải độ dốc và hệ số chặn, tính r, R², phần dư, kiểm định t cho độ dốc, dự báo và cảnh báo ngoại suy; kèm lời giải.',
  [[
    `<span class="eyebrow">MAS202 · Part 4 · Exercise 4</span>
<h2>Exercise 4 — do more sales calls bring more orders?</h2>
<div class="callout"><span class="badge">Problem</span> For 6 weeks a distributor records the number of sales calls x made by one representative and the units ordered y (illustrative data): x = 2, 4, 5, 7, 8, 10 and y = 21, 29, 35, 37, 43, 45. (a) Fit the least-squares line by hand. (b) Interpret the slope and the intercept. (c) Compute r, the residuals and R². (d) Test whether the slope is significant at α = 0.05. (e) Predict the units ordered for 6 calls, and comment on a prediction for 20 calls.</div>
<h3>Worked solution</h3>
<pre><code class="language-text">x̄ = 36 / 6 = 6          ȳ = 210 / 6 = 35
x − x̄ :   −4    −2    −1     1     2     4
y − ȳ :  −14    −6     0     2     8    10
product:   56    12     0     2    16    40
Sxx = 16 + 4 + 1 + 1 + 4 + 16         = 42
Sxy = 56 + 12 + 0 + 2 + 16 + 40       = 126
Syy = 196 + 36 + 0 + 4 + 64 + 100     = 400

(a) b1 = 126 / 42 = 3        b0 = 35 − 3 × 6 = 17        ŷ = 17 + 3x

(c) r = 126 / √(42 × 400) = 126 / 129.61 = 0.972
    ŷ:          23    29    32    38    41    47
    residual:   −2     0     3    −1     2    −2        (sum = 0 ✓)
    SSE = 4 + 0 + 9 + 1 + 4 + 4 = 22     SSR = 400 − 22 = 378
    R² = 378 / 400 = 0.945  (= r²)

(d) se = √(22 / 4) = 2.345        SE(b1) = 2.345 / √42 = 0.362
    t = 3 / 0.362 = 8.29,  df = 4,  t(0.025; 4) = 2.776,  p-value = 0.0012
    → reject H0: β1 = 0;   95% CI for β1: 3 ± 2.776 × 0.362 = (2.00, 4.00)

(e) ŷ(6) = 17 + 3 × 6 = 35 units
    ŷ(20) = 77 units, but 20 lies far outside the observed range 2–10</code></pre>
<p><strong>Why:</strong> the slope says that each additional call is associated with about 3 more units ordered on average (plausibly 2 to 4). The intercept, 17 units with zero calls, is an extrapolation because x = 0 was never observed — treat it as the anchor of the line, not a forecast. R² = 0.945 means 94.5% of the week-to-week variation in orders is explained by the number of calls, and the residuals show no obvious pattern. Two cautions: with only six weeks the estimate is fragile, and correlation is not causation — a representative may simply call more often in weeks when clients are already ordering more. The prediction for 20 calls assumes the line continues far beyond the data, which it may not (customers have limited demand).</p>`,
    `<span class="eyebrow">MAS202 · Phần 4 · Bài tập 4</span>
<h2>Bài tập 4 — gọi điện chào hàng nhiều hơn có được nhiều đơn hơn?</h2>
<div class="callout"><span class="badge">Đề</span> Trong 6 tuần, một nhà phân phối ghi lại số cuộc gọi chào hàng x của một nhân viên và số sản phẩm được đặt y (dữ liệu minh hoạ giả định): x = 2, 4, 5, 7, 8, 10 và y = 21, 29, 35, 37, 43, 45. (a) Tính tay đường hồi quy bình phương nhỏ nhất. (b) Diễn giải độ dốc và hệ số chặn. (c) Tính r, các phần dư và R². (d) Kiểm định độ dốc có ý nghĩa thống kê ở α = 0,05 không. (e) Dự báo số sản phẩm được đặt khi có 6 cuộc gọi, và nhận xét về dự báo cho 20 cuộc gọi.</div>
<h3>Lời giải</h3>
<pre><code class="language-text">x̄ = 36 / 6 = 6          ȳ = 210 / 6 = 35
x − x̄ :   −4    −2    −1     1     2     4
y − ȳ :  −14    −6     0     2     8    10
tích:      56    12     0     2    16    40
Sxx = 16 + 4 + 1 + 1 + 4 + 16         = 42
Sxy = 56 + 12 + 0 + 2 + 16 + 40       = 126
Syy = 196 + 36 + 0 + 4 + 64 + 100     = 400

(a) b1 = 126 / 42 = 3        b0 = 35 − 3 × 6 = 17        ŷ = 17 + 3x

(c) r = 126 / √(42 × 400) = 126 / 129,61 = 0,972
    ŷ:          23    29    32    38    41    47
    phần dư:    −2     0     3    −1     2    −2        (tổng = 0 ✓)
    SSE = 4 + 0 + 9 + 1 + 4 + 4 = 22     SSR = 400 − 22 = 378
    R² = 378 / 400 = 0,945  (= r²)

(d) se = √(22 / 4) = 2,345        SE(b1) = 2,345 / √42 = 0,362
    t = 3 / 0,362 = 8,29,  bậc tự do = 4,  t(0,025; 4) = 2,776,  trị số p = 0,0012
    → bác bỏ H0: β1 = 0;   KTC 95% cho β1: 3 ± 2,776 × 0,362 = (2,00; 4,00)

(e) ŷ(6) = 17 + 3 × 6 = 35 sản phẩm
    ŷ(20) = 77 sản phẩm, nhưng 20 nằm rất xa ngoài phạm vi quan sát 2–10</code></pre>
<p><strong>Vì sao:</strong> độ dốc cho biết mỗi cuộc gọi thêm gắn với trung bình khoảng 3 sản phẩm được đặt thêm (hợp lý trong khoảng từ 2 đến 4). Hệ số chặn, 17 sản phẩm khi không gọi cuộc nào, là một phép ngoại suy vì chưa từng quan sát x = 0 — hãy xem nó là điểm neo của đường thẳng chứ không phải một dự báo. R² = 0,945 nghĩa là 94,5% biến động số đơn đặt giữa các tuần được giải thích bởi số cuộc gọi, và phần dư không có quy luật rõ ràng. Hai lưu ý: chỉ có sáu tuần nên ước lượng còn mong manh, và tương quan không phải nhân quả — có thể nhân viên chỉ đơn giản gọi nhiều hơn vào những tuần khách hàng vốn đã đặt nhiều. Dự báo cho 20 cuộc gọi mặc nhiên cho rằng đường thẳng kéo dài mãi ra ngoài dữ liệu, điều có thể không đúng (nhu cầu của khách hàng có hạn).</p>`,
  ]]);

const c7q = quiz('mas202-quiz-4', 'Quiz 4 — Comparing groups & regression|||Quiz 4 — So sánh nhóm & hồi quy', [
  { id: 'q1', question: 'An analyst wants to know whether satisfaction level (low / medium / high) depends on region (North / Central / South). Which test fits?|||Một chuyên viên muốn biết mức hài lòng (thấp / trung bình / cao) có phụ thuộc vào vùng (Bắc / Trung / Nam) không. Kiểm định nào phù hợp?', options: ['One-way ANOVA|||ANOVA một yếu tố', 'Paired t-test|||Kiểm định t cặp', 'Chi-square test of independence|||Kiểm định khi bình phương về tính độc lập', 'Simple linear regression|||Hồi quy tuyến tính đơn'], correctIndex: 2, explanation: 'Both variables are categorical, so a contingency table and a chi-square test are used, here with df = (3 − 1)(3 − 1) = 4.|||Cả hai biến đều là biến định tính, nên dùng bảng chéo và kiểm định khi bình phương, ở đây bậc tự do = (3 − 1)(3 − 1) = 4.' },
  { id: 'q2', question: 'A regression of sales on advertising gives R² = 0.64. Which statement is correct?|||Hồi quy doanh số theo chi phí quảng cáo cho R² = 0,64. Phát biểu nào đúng?', options: ['64% of the variation in sales is explained by the linear relationship with advertising|||64% biến động của doanh số được giải thích bởi mối liên hệ tuyến tính với quảng cáo', 'Advertising causes 64% of sales|||Quảng cáo tạo ra 64% doanh số', 'The slope of the line is 0.64|||Độ dốc của đường hồi quy là 0,64', 'The correlation coefficient is 0.64|||Hệ số tương quan là 0,64'], correctIndex: 0, explanation: 'R² is the share of variation explained. The correlation would be ±0.8 (√0.64), and neither number proves causation.|||R² là tỷ lệ biến động được giải thích. Hệ số tương quan sẽ là ±0,8 (√0,64), và cả hai con số đều không chứng minh quan hệ nhân quả.' },
  { id: 'q3', question: 'A one-way ANOVA comparing 4 promotions rejects H0. What can you conclude?|||Phân tích ANOVA một yếu tố so sánh 4 chương trình khuyến mãi bác bỏ H0. Có thể kết luận gì?', options: ['All four means are different|||Cả bốn trung bình đều khác nhau', 'The promotion with the highest sample mean is significantly the best|||Chương trình có trung bình mẫu cao nhất chắc chắn tốt nhất một cách có ý nghĩa', 'All four means are equal|||Cả bốn trung bình bằng nhau', 'At least one population mean differs from the others|||Ít nhất một trung bình tổng thể khác các trung bình còn lại'], correctIndex: 3, explanation: 'ANOVA only says that the means are not all equal; a post hoc test such as Tukey’s shows which pairs differ.|||ANOVA chỉ cho biết các trung bình không bằng nhau hết; cần phép hậu kiểm như Tukey để biết cặp nào khác nhau.' },
]);

const taiLieu = doc('mas202-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (kèm link), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">MAS202 · 📚 Resource hub</span>
<h2>Course materials &amp; references</h2>
<p class="lead">One hub for applied business statistics: the official syllabus &amp; slides, books, free references, video channels, tools, and a self-study roadmap.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>Sign in to <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) with your FPTU account to read the official MAS202 syllabus, the assigned textbook and the lecture slides. The lessons here follow the standard structure of international business statistics courses; for exact learning outcomes and assessment weights, always check FLM.</p>
<h3>📗 Books</h3>
<ul>
<li><a href="https://openstax.org/details/books/introductory-business-statistics-2e" target="_blank" rel="noopener">Introductory Business Statistics 2e</a> — OpenStax: a complete business statistics textbook, free to read online.</li>
<li><a href="https://openintro-ims.netlify.app/" target="_blank" rel="noopener">Introduction to Modern Statistics (2e)</a> — Mine Çetinkaya-Rundel &amp; Johanna Hardin, OpenIntro: modern, data-first treatment of inference and regression (free online).</li>
</ul>
<h3>🌐 Free references</h3>
<ul>
<li><a href="https://www.khanacademy.org/" target="_blank" rel="noopener">Khan Academy</a> — free "Statistics and probability" course with practice exercises.</li>
<li><a href="https://www.stattrek.com/" target="_blank" rel="noopener">Stat Trek</a> — concise tutorials, distribution calculators and statistical tables.</li>
<li><a href="https://docs.scipy.org/doc/scipy/reference/stats.html" target="_blank" rel="noopener">SciPy scipy.stats</a> — official reference for distributions and tests in Python.</li>
<li><a href="https://pandas.pydata.org/docs/" target="_blank" rel="noopener">pandas documentation</a> — loading, cleaning and summarising data tables in Python.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@StatQuest" target="_blank" rel="noopener">StatQuest with Josh Starmer</a> — clear visual explanations of p-values, t-tests, regression.</li>
<li><a href="https://www.youtube.com/@jbstatistics" target="_blank" rel="noopener">jbstatistics</a> — short, rigorous videos on distributions, intervals and tests.</li>
<li><a href="https://www.youtube.com/@PatrickJMT" target="_blank" rel="noopener">PatrickJMT</a> — worked examples, step by step.</li>
<li><a href="https://www.youtube.com/@khanacademy" target="_blank" rel="noopener">Khan Academy</a> — the official channel.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://support.microsoft.com/en-us/office/load-the-analysis-toolpak-in-excel-6a63e598-cd6d-42e3-9317-6b40ba1a66b4" target="_blank" rel="noopener">Excel Analysis ToolPak</a> — descriptive statistics, t-tests, ANOVA and regression in Excel (how to enable it).</li>
<li><a href="https://www.jamovi.org/" target="_blank" rel="noopener">jamovi</a> — free, point-and-click statistics software.</li>
<li><a href="https://www.r-project.org/" target="_blank" rel="noopener">R</a> — the free language and environment for statistical computing.</li>
</ul>
<h3>🎯 Self-study roadmap</h3>
<ol>
<li><strong>Foundations (exam core)</strong> — descriptive measures, probability rules and the binomial, Poisson and normal distributions, following the lessons here.</li>
<li><strong>Inference by hand</strong> — redo every worked example with a calculator until confidence intervals and the six-step test feel routine.</li>
<li><strong>Same work in software</strong> — reproduce the exercises in Excel (ToolPak) or jamovi and check that the output matches your hand calculations.</li>
<li><strong>Real data</strong> — take a public data set, ask a business question, and answer it with a test or a regression, reporting effect sizes and limitations.</li>
</ol>
<div class="callout"><span class="badge">Note</span> An original hub of real links — no copyrighted slides or books are embedded. If a link moves, start from the official homepage.</div>`,
    `<span class="eyebrow">MAS202 · 📚 Trung tâm tài liệu</span>
<h2>Tài liệu tham khảo môn học</h2>
<p class="lead">Một nơi gom cho thống kê ứng dụng trong kinh doanh: giáo trình &amp; slide chính thức, sách, tài liệu tham khảo miễn phí, kênh video, công cụ, và lộ trình tự học.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Đăng nhập <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) bằng tài khoản FPTU để đọc đề cương chính thức của MAS202, giáo trình được chỉ định và slide bài giảng. Các bài ở đây bám cấu trúc chuẩn của các môn thống kê kinh doanh quốc tế; chuẩn đầu ra và tỷ trọng đánh giá chính xác thì luôn xem trên FLM.</p>
<h3>📗 Sách</h3>
<ul>
<li><a href="https://openstax.org/details/books/introductory-business-statistics-2e" target="_blank" rel="noopener">Introductory Business Statistics 2e</a> — OpenStax: giáo trình thống kê kinh doanh đầy đủ, đọc online miễn phí.</li>
<li><a href="https://openintro-ims.netlify.app/" target="_blank" rel="noopener">Introduction to Modern Statistics (2e)</a> — Mine Çetinkaya-Rundel &amp; Johanna Hardin, OpenIntro: trình bày hiện đại, đi từ dữ liệu, về suy diễn và hồi quy (miễn phí online).</li>
</ul>
<h3>🌐 Tài liệu tham khảo miễn phí</h3>
<ul>
<li><a href="https://www.khanacademy.org/" target="_blank" rel="noopener">Khan Academy</a> — khoá "Statistics and probability" miễn phí, có bài luyện tập.</li>
<li><a href="https://www.stattrek.com/" target="_blank" rel="noopener">Stat Trek</a> — hướng dẫn ngắn gọn, máy tính phân phối và bảng thống kê.</li>
<li><a href="https://docs.scipy.org/doc/scipy/reference/stats.html" target="_blank" rel="noopener">SciPy scipy.stats</a> — tài liệu chính thức về phân phối và kiểm định trong Python.</li>
<li><a href="https://pandas.pydata.org/docs/" target="_blank" rel="noopener">Tài liệu pandas</a> — nạp, làm sạch và tóm tắt bảng dữ liệu bằng Python.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@StatQuest" target="_blank" rel="noopener">StatQuest with Josh Starmer</a> — giải thích trực quan, dễ hiểu về trị số p, kiểm định t, hồi quy.</li>
<li><a href="https://www.youtube.com/@jbstatistics" target="_blank" rel="noopener">jbstatistics</a> — video ngắn, chặt chẽ về phân phối, khoảng tin cậy và kiểm định.</li>
<li><a href="https://www.youtube.com/@PatrickJMT" target="_blank" rel="noopener">PatrickJMT</a> — ví dụ giải từng bước.</li>
<li><a href="https://www.youtube.com/@khanacademy" target="_blank" rel="noopener">Khan Academy</a> — kênh chính thức.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://support.microsoft.com/en-us/office/load-the-analysis-toolpak-in-excel-6a63e598-cd6d-42e3-9317-6b40ba1a66b4" target="_blank" rel="noopener">Excel Analysis ToolPak</a> — thống kê mô tả, kiểm định t, ANOVA và hồi quy ngay trong Excel (cách bật tính năng).</li>
<li><a href="https://www.jamovi.org/" target="_blank" rel="noopener">jamovi</a> — phần mềm thống kê miễn phí, thao tác bằng chuột.</li>
<li><a href="https://www.r-project.org/" target="_blank" rel="noopener">R</a> — ngôn ngữ và môi trường tính toán thống kê miễn phí.</li>
</ul>
<h3>🎯 Lộ trình tự học</h3>
<ol>
<li><strong>Nền tảng (lõi thi)</strong> — các thước đo mô tả, quy tắc xác suất và các phân phối nhị thức, Poisson, chuẩn, theo đúng các bài ở đây.</li>
<li><strong>Suy diễn bằng tay</strong> — làm lại mọi ví dụ bằng máy tính cầm tay tới khi khoảng tin cậy và kiểm định sáu bước trở thành phản xạ.</li>
<li><strong>Làm lại bằng phần mềm</strong> — giải lại các bài tập bằng Excel (ToolPak) hoặc jamovi và đối chiếu kết quả với phần tính tay.</li>
<li><strong>Dữ liệu thật</strong> — lấy một bộ dữ liệu công khai, đặt một câu hỏi kinh doanh và trả lời bằng kiểm định hoặc hồi quy, kèm độ lớn tác động và giới hạn của phân tích.</li>
</ol>
<div class="callout"><span class="badge">Lưu ý</span> Đây là trung tâm liên kết nguyên gốc — không nhúng slide/sách có bản quyền. Link đổi thì vào trang chủ chính thức để tìm.</div>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'MAS202',
    slug: 'mas202-applied-statistics-for-business',
    title: 'Applied Statistics for Business',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/MAS202.webp',
    shortDescription: 'Statistics for business decisions: descriptive measures, probability and Bayes, binomial, Poisson and normal distributions, the central limit theorem, confidence intervals, hypothesis tests (t, chi-square, ANOVA) and regression. Bilingual, with exercises and quizzes.|||Thống kê cho quyết định kinh doanh: thống kê mô tả, xác suất, các phân phối, định lý giới hạn trung tâm, khoảng tin cậy, kiểm định giả thuyết và hồi quy. Song ngữ, có bài tập và quiz.',
    description: 'Môn <strong>MAS202 — Applied Statistics for Business (Thống kê ứng dụng trong kinh doanh)</strong> (khối Quản trị Kinh doanh, kỳ 3) trang bị công cụ để ra quyết định dựa trên dữ liệu: <strong>mô tả dữ liệu</strong> (trung bình, trung vị, độ lệch chuẩn, tứ phân vị, biểu đồ hộp, điểm z) → <strong>xác suất và định lý Bayes</strong> → <strong>phân phối nhị thức, Poisson và chuẩn</strong> → <strong>phân phối mẫu, định lý giới hạn trung tâm và khoảng tin cậy</strong> → <strong>kiểm định giả thuyết</strong> (z, t, tỷ lệ, t hai mẫu, khi bình phương, ANOVA) → <strong>tương quan và hồi quy tuyến tính</strong>. Bám cấu trúc giáo trình thống kê kinh doanh chuẩn quốc tế, song ngữ Anh–Việt, mọi ví dụ dùng dữ liệu minh hoạ giả định và đã kiểm bằng máy, có bài tập kèm lời giải và quiz cuối mỗi phần.',
    whatYouLearn: 'Phân loại dữ liệu theo thang đo và chọn bảng, biểu đồ phù hợp\nTính và diễn giải trung bình, trung vị, độ lệch chuẩn, hệ số biến thiên, tứ phân vị, biểu đồ hộp và điểm z\nÁp dụng quy tắc cộng, nhân, xác suất có điều kiện và định lý Bayes cho tình huống kinh doanh\nTính xác suất với phân phối nhị thức, Poisson và phân phối chuẩn; tra ngược để đặt mức phục vụ\nHiểu phân phối mẫu, sai số chuẩn và định lý giới hạn trung tâm\nXây dựng khoảng tin cậy cho trung bình và tỷ lệ, xác định cỡ mẫu cần thiết\nThực hiện kiểm định z, t, tỷ lệ, t hai mẫu, khi bình phương và ANOVA; đọc đúng trị số p và hai loại sai lầm\nƯớc lượng, diễn giải và kiểm định hồi quy tuyến tính đơn; làm quen hồi quy bội',
    requirements: 'Toán phổ thông: đại số, luỹ thừa, căn bậc hai, phần trăm\nKhông cần biết thống kê trước; điều kiện tiên quyết chính thức xem trong khung chương trình trên FLM\nMáy tính cầm tay hoặc bảng tính (Excel, Google Sheets) để luyện bài; jamovi hoặc R nếu muốn đi xa hơn',
  },
  sections: [
    { title: '📚 Course materials|||📚 Tài liệu tham khảo', description: 'Giáo trình & slide trên FLM, sách, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Course introduction|||Giới thiệu môn học', description: 'Thống kê mô tả và suy diễn, loại dữ liệu, thang đo, chọn mẫu.', lessons: [intro] },
    { title: 'Part 1 — Descriptive statistics|||Phần 1 — Thống kê mô tả', description: 'Trung bình, trung vị, độ lệch chuẩn, tứ phân vị, biểu đồ hộp, điểm z.', lessons: [c1, c1e, c1q] },
    { title: 'Part 2 — Probability & probability distributions|||Phần 2 — Xác suất & phân phối xác suất', description: 'Quy tắc xác suất, Bayes, nhị thức, Poisson, phân phối chuẩn.', lessons: [c2, c3, c3e, c3q] },
    { title: 'Part 3 — Sampling, estimation & hypothesis testing|||Phần 3 — Phân phối mẫu, ước lượng & kiểm định giả thuyết', description: 'Định lý giới hạn trung tâm, khoảng tin cậy, cỡ mẫu, kiểm định z, t, tỷ lệ.', lessons: [c4, c5, c5e, c5q] },
    { title: 'Part 4 — Comparing groups & regression|||Phần 4 — So sánh nhóm & hồi quy', description: 'T hai mẫu, khi bình phương, ANOVA, tương quan, hồi quy tuyến tính.', lessons: [c6, c7, c7e, c7q] },
  ],
};
