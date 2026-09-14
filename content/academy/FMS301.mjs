/**
 * FMS301 — Applied Financial Modelling and Simulation. Khối Quản trị Kinh
 * doanh (BBA), FPTU, Kỳ 7. Trọng tâm: MÔ PHỎNG (Monte Carlo, stochastic) —
 * khác FIM302c (mô hình tài chính CƠ BẢN, tất định), FMR301 (quản trị RỦI RO
 * tài chính, chính sách/hedging), FRM301 (rủi ro DỰ ÁN, sổ rủi ro). Giáo
 * trình trích dẫn: Benninga "Financial Modeling"; Glasserman "Monte Carlo
 * Methods in Financial Engineering"; tài liệu @RISK / Crystal Ball. Song ngữ
 * + ví dụ minh hoạ (số liệu GIẢ ĐỊNH) + quiz. Giữ NGUYÊN slug/semester/thumb.
 * ⚠️ KHÔNG backtick/${; escape &amp;/&lt; trong HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('fms301-0-1-overview', 'Course overview: Applied Financial Modelling and Simulation|||Tổng quan: Mô hình hoá tài chính ứng dụng & Mô phỏng',
  'Vì sao cần mô phỏng khi mô hình tất định (FIM302c) không đủ; luồng học 8 chương: biến ngẫu nhiên → phân phối/RNG → Monte Carlo NPV → giá tài sản → VaR danh mục → quyền chọn → kịch bản/tối ưu → công cụ.',
  [[
    `<span class="eyebrow">FMS301 · Lesson 0.1 · Overview</span>
<h2>Applied Financial Modelling &amp; Simulation</h2>
<p class="lead">A <strong>deterministic</strong> financial model (the kind you built in FIM302c) plugs in one fixed number per input and gets one fixed answer — one NPV, one valuation. Real inputs (revenue growth, costs, interest rates, stock returns) are <em>uncertain</em>. This course replaces single-point guesses with <strong>probability distributions</strong> and uses <strong>Monte Carlo simulation</strong> — thousands of randomized trials — to see the whole <em>range</em> of possible outcomes, not just one.</p>
<h3>How this differs from nearby courses</h3>
<ul>
<li><strong>FIM302c (Financial Modelling — basic)</strong> — builds the deterministic model itself (formulas, statements, one scenario at a time).</li>
<li><strong>FMS301 (this course)</strong> — takes an uncertain input and runs it through a <strong>simulation engine</strong>: random variables, Monte Carlo, stochastic asset paths, simulated risk metrics.</li>
<li><strong>FMR301 (Financial Risk Management)</strong> — the risk <em>policy</em> layer: risk appetite, hedging strategy, governance — uses risk numbers, doesn't build the simulation that produces them.</li>
<li><strong>FRM301 (Project Risk Management)</strong> — project-level risk register, mostly qualitative + some quantitative tools, for project decisions specifically.</li>
</ul>
<h3>Roadmap (8 chapters)</h3>
<p>Random variables &amp; why simulate → probability distributions &amp; random number generation → Monte Carlo NPV (uncertain cash flows) → asset price paths (random walk, Geometric Brownian Motion) → portfolio risk &amp; simulated VaR → option pricing by Monte Carlo → scenario/sensitivity analysis &amp; simulation optimization → tools (@RISK, Crystal Ball, Python) &amp; decision-making.</p>
<div class="callout"><span class="badge">Textbooks</span> Benninga, <em>Financial Modeling</em>; Glasserman, <em>Monte Carlo Methods in Financial Engineering</em>; official @RISK / Crystal Ball documentation. See the Materials lesson for links.</div>`,
    `<span class="eyebrow">FMS301 · Bài 0.1 · Tổng quan</span>
<h2>Mô hình hoá tài chính ứng dụng &amp; Mô phỏng</h2>
<p class="lead">Một mô hình tài chính <strong>tất định</strong> (như bạn đã xây ở FIM302c) gán mỗi biến đầu vào MỘT số cố định và ra MỘT kết quả cố định — một NPV, một mức định giá. Nhưng đầu vào thật (tăng trưởng doanh thu, chi phí, lãi suất, lợi suất cổ phiếu) đều <em>bất định</em>. Môn này thay việc đoán một số bằng <strong>phân phối xác suất</strong>, rồi dùng <strong>mô phỏng Monte Carlo</strong> — hàng nghìn lượt thử ngẫu nhiên — để thấy cả một <em>khoảng</em> kết quả có thể xảy ra, không chỉ một con số.</p>
<h3>Khác gì các môn lân cận</h3>
<ul>
<li><strong>FIM302c (Mô hình tài chính — cơ bản)</strong> — dựng mô hình tất định (công thức, báo cáo, một tình huống tại một lần).</li>
<li><strong>FMS301 (môn này)</strong> — đưa một đầu vào bất định qua <strong>bộ máy mô phỏng</strong>: biến ngẫu nhiên, Monte Carlo, đường đi giá stochastic, chỉ số rủi ro mô phỏng.</li>
<li><strong>FMR301 (Quản trị rủi ro tài chính)</strong> — lớp <em>chính sách</em> rủi ro: mức chấp nhận rủi ro, chiến lược hedging, quản trị — dùng số liệu rủi ro, không tự dựng mô phỏng sinh ra chúng.</li>
<li><strong>FRM301 (Quản trị rủi ro dự án)</strong> — sổ rủi ro cấp dự án, phần lớn định tính + vài công cụ định lượng, cho quyết định cấp dự án.</li>
</ul>
<h3>Lộ trình (8 chương)</h3>
<p>Biến ngẫu nhiên &amp; vì sao phải mô phỏng → phân phối xác suất &amp; sinh số ngẫu nhiên → Monte Carlo cho NPV (dòng tiền bất định) → đường đi giá tài sản (random walk, Geometric Brownian Motion) → rủi ro danh mục &amp; VaR mô phỏng → định giá quyền chọn bằng Monte Carlo → phân tích kịch bản/độ nhạy &amp; tối ưu mô phỏng → công cụ (@RISK, Crystal Ball, Python) &amp; ra quyết định.</p>
<div class="callout"><span class="badge">Giáo trình</span> Benninga, <em>Financial Modeling</em>; Glasserman, <em>Monte Carlo Methods in Financial Engineering</em>; tài liệu chính thức @RISK / Crystal Ball. Xem bài Tài liệu để lấy liên kết.</div>`,
  ]]);

const c1 = doc('fms301-1-1-random-variables', '1.1 — Simulation overview & random variables|||1.1 — Tổng quan mô phỏng & biến ngẫu nhiên',
  'Mô phỏng vs mô hình tất định; biến ngẫu nhiên rời rạc/liên tục; vì sao tài chính cần mô phỏng; 5 bước của một nghiên cứu mô phỏng.',
  [[
    `<span class="eyebrow">FMS301 · Chapter 1 · Lesson 1.1</span>
<h2>Simulation overview &amp; random variables</h2>
<h3>Deterministic vs. simulation model</h3>
<p>A <strong>deterministic</strong> model: fixed inputs in → one fixed output out. A <strong>simulation</strong> model: input distributions in → an <strong>output distribution</strong> out (a whole range of possible NPVs, prices, losses), from which you read a mean, a worst case, a probability of loss.</p>
<h3>Random variable</h3>
<p>A <strong>random variable</strong> is a quantity whose value is uncertain but follows a known probability pattern.</p>
<ul>
<li><strong>Discrete</strong> — takes a countable set of values (e.g. number of defaulting loans out of 10).</li>
<li><strong>Continuous</strong> — takes any value in a range (e.g. tomorrow's stock return, next quarter's revenue).</li>
</ul>
<h3>Why simulate in finance</h3>
<p>Cash flows, asset prices and portfolio losses are all driven by uncertain inputs. Simulation lets you answer questions a single-point model cannot: "what's the <em>probability</em> this project loses money?", "what loss could we suffer 95% of the time we won't exceed?" (Value at Risk, Chapter 5), "what's a fair price for an option whose payoff has no closed-form formula?" (Chapter 6).</p>
<h3>Five steps of a simulation study</h3>
<pre><code>1. Identify the uncertain input variables (revenue growth, cost, rate, return...)
2. Assign each one a probability distribution (Chapter 2)
3. Draw one random value per variable -> compute ONE output (one "trial")
4. Repeat step 3 thousands of times (N trials)
5. Analyze the N outputs: mean, percentiles, probability of a bad outcome
</code></pre>
<div class="callout"><span class="badge">One law, everywhere</span> Every chapter after this one is the same five steps applied to a different output: NPV, a stock price path, a portfolio loss, an option payoff.</div>`,
    `<span class="eyebrow">FMS301 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan mô phỏng &amp; biến ngẫu nhiên</h2>
<h3>Mô hình tất định vs. mô hình mô phỏng</h3>
<p>Mô hình <strong>tất định</strong>: đầu vào cố định → MỘT đầu ra cố định. Mô hình <strong>mô phỏng</strong>: đầu vào là phân phối → đầu ra là <strong>một phân phối</strong> (cả một khoảng NPV, giá, mức lỗ có thể xảy ra), từ đó đọc ra giá trị trung bình, tình huống xấu nhất, xác suất lỗ.</p>
<h3>Biến ngẫu nhiên</h3>
<p><strong>Biến ngẫu nhiên</strong> là đại lượng có giá trị bất định nhưng tuân theo một quy luật xác suất đã biết.</p>
<ul>
<li><strong>Rời rạc</strong> — nhận một tập giá trị đếm được (vd số khoản vay vỡ nợ trong 10 khoản).</li>
<li><strong>Liên tục</strong> — nhận bất kỳ giá trị trong một khoảng (vd lợi suất cổ phiếu ngày mai, doanh thu quý tới).</li>
</ul>
<h3>Vì sao tài chính cần mô phỏng</h3>
<p>Dòng tiền, giá tài sản và mức lỗ danh mục đều do các đầu vào bất định chi phối. Mô phỏng trả lời được câu hỏi mô hình một-điểm không trả lời được: "xác suất dự án này LỖ là bao nhiêu?", "mức lỗ nào mà 95% thời gian ta không vượt quá?" (Value at Risk, Chương 5), "giá hợp lý cho một quyền chọn không có công thức đóng là bao nhiêu?" (Chương 6).</p>
<h3>Năm bước của một nghiên cứu mô phỏng</h3>
<pre><code>1. Xác định biến đầu vào bất định (tăng trưởng doanh thu, chi phí, lãi suất, lợi suất...)
2. Gán cho mỗi biến một phân phối xác suất (Chương 2)
3. Rút một giá trị ngẫu nhiên mỗi biến -> tính MỘT đầu ra ("một lượt thử")
4. Lặp lại bước 3 hàng nghìn lần (N lượt)
5. Phân tích N đầu ra: trung bình, phân vị, xác suất kết quả xấu
</code></pre>
<div class="callout"><span class="badge">Một quy luật, xuyên suốt</span> Mọi chương sau chỉ là năm bước này áp cho một đầu ra khác: NPV, một đường đi giá cổ phiếu, mức lỗ danh mục, payoff quyền chọn.</div>`,
  ]]);

const c1q = quiz('fms301-quiz-1', 'Quiz 1 — Simulation overview|||Quiz 1 — Tổng quan mô phỏng', [
  { id: 'q1', question: 'Khác biệt chính giữa mô hình tất định và mô hình mô phỏng là gì?', options: ['Mô phỏng chỉ dùng cho cổ phiếu', 'Tất định ra một kết quả; mô phỏng ra cả một phân phối kết quả', 'Tất định luôn đúng hơn', 'Không có khác biệt'], correctIndex: 1, explanation: 'Tất định: đầu vào cố định → một đầu ra. Mô phỏng: đầu vào là phân phối → một phân phối đầu ra.' },
  { id: 'q2', question: 'FMS301 khác FIM302c ở điểm nào?', options: ['FMS301 không dùng Excel', 'FIM302c dựng mô hình tất định; FMS301 mô phỏng đầu vào bất định qua Monte Carlo', 'Hai môn giống nhau hoàn toàn', 'FIM302c chỉ học lý thuyết'], correctIndex: 1, explanation: 'FIM302c là mô hình cơ bản/tất định; FMS301 là lớp mô phỏng/stochastic đặt lên trên.' },
  { id: 'q3', question: 'Bước ĐẦU TIÊN của một nghiên cứu mô phỏng là?', options: ['Chạy hàng nghìn lượt thử ngay', 'Xác định các biến đầu vào bất định', 'Tính trung bình đầu ra', 'Vẽ biểu đồ kết quả'], correctIndex: 1, explanation: 'Phải xác định biến bất định trước, rồi mới gán phân phối và chạy lượt thử.' },
]);

const c2 = doc('fms301-2-1-distributions-rng', '2.1 — Probability distributions & random number generation|||2.1 — Phân phối xác suất & sinh số ngẫu nhiên',
  'Uniform, Normal, Triangular, Lognormal; sinh số ngẫu nhiên bằng inverse transform; số lượt thử & sai số chuẩn.',
  [[
    `<span class="eyebrow">FMS301 · Chapter 2 · Lesson 2.1</span>
<h2>Probability distributions &amp; random number generation</h2>
<h3>Distributions used in financial simulation</h3>
<ul>
<li><strong>Uniform(a, b)</strong> — every value between a and b is equally likely. Good when you only know a range (e.g. "cost is somewhere between 80 and 120").</li>
<li><strong>Normal(μ, σ)</strong> — symmetric bell curve. Common for returns, forecast errors.</li>
<li><strong>Triangular(min, mode, max)</strong> — set by a three-point expert estimate (worst, most-likely, best); the most-used distribution in @RISK/Crystal Ball because managers can estimate it without statistics training.</li>
<li><strong>Lognormal</strong> — always positive, right-skewed; the standard choice for <strong>asset prices</strong> (a price can't go below 0) — the foundation for Chapter 4's GBM.</li>
</ul>
<h3>Generating random draws</h3>
<p>A computer's random number generator (RNG) produces <code>U ~ Uniform(0,1)</code>. <strong>Inverse transform sampling</strong> converts that into any target distribution: <code>X = F⁻¹(U)</code>, where F⁻¹ is the inverse cumulative distribution function.</p>
<pre><code>Excel:   =NORM.INV(RAND(), mean, stdev)      (Normal draw)
         =min + RAND()*(max-min)             (Uniform draw)
Python:  numpy.random.normal(mean, stdev, size=N)
         numpy.random.lognormal(mu, sigma, size=N)
</code></pre>
<h3>How many trials?</h3>
<p>By the law of large numbers, the simulated average converges to the true mean as N grows. The <strong>standard error</strong> of that average shrinks like <code>σ/√N</code> — quadrupling N only halves the error, so beyond a few thousand trials the gain per extra trial is small.</p>
<div class="callout"><span class="badge">Assumed numbers</span> All figures in this course's examples are illustrative/assumed for teaching purposes, not real market data.</div>`,
    `<span class="eyebrow">FMS301 · Chương 2 · Bài 2.1</span>
<h2>Phân phối xác suất &amp; sinh số ngẫu nhiên</h2>
<h3>Các phân phối dùng trong mô phỏng tài chính</h3>
<ul>
<li><strong>Uniform(a, b)</strong> — mọi giá trị giữa a và b đều có xác suất bằng nhau. Dùng khi chỉ biết một khoảng (vd "chi phí đâu đó giữa 80 và 120").</li>
<li><strong>Normal(μ, σ)</strong> — hình chuông đối xứng. Thường dùng cho lợi suất, sai số dự báo.</li>
<li><strong>Triangular(min, mode, max)</strong> — đặt bằng ước lượng ba điểm của chuyên gia (xấu nhất, khả năng cao nhất, tốt nhất); phân phối được dùng nhiều nhất trong @RISK/Crystal Ball vì quản lý ước lượng được mà không cần học thống kê.</li>
<li><strong>Lognormal</strong> — luôn dương, lệch phải; lựa chọn chuẩn cho <strong>giá tài sản</strong> (giá không thể âm) — nền tảng cho GBM ở Chương 4.</li>
</ul>
<h3>Sinh số ngẫu nhiên</h3>
<p>Bộ sinh số ngẫu nhiên (RNG) của máy tính cho ra <code>U ~ Uniform(0,1)</code>. <strong>Inverse transform sampling</strong> biến nó thành phân phối mục tiêu: <code>X = F⁻¹(U)</code>, với F⁻¹ là hàm nghịch đảo của hàm phân phối tích lũy.</p>
<pre><code>Excel:   =NORM.INV(RAND(), mean, stdev)      (rút giá trị Normal)
         =min + RAND()*(max-min)             (rút giá trị Uniform)
Python:  numpy.random.normal(mean, stdev, size=N)
         numpy.random.lognormal(mu, sigma, size=N)
</code></pre>
<h3>Cần chạy bao nhiêu lượt thử?</h3>
<p>Theo luật số lớn, trung bình mô phỏng tiến về trung bình thật khi N tăng. <strong>Sai số chuẩn</strong> của trung bình đó giảm theo <code>σ/√N</code> — tăng N gấp 4 lần chỉ giảm sai số một nửa, nên qua vài nghìn lượt thì thêm lượt lợi ích rất nhỏ.</p>
<div class="callout"><span class="badge">Số liệu giả định</span> Mọi số liệu trong ví dụ của môn này là minh hoạ/giả định cho mục đích giảng dạy, không phải dữ liệu thị trường thật.</div>`,
  ]]);

const c2q = quiz('fms301-quiz-2', 'Quiz 2 — Distributions & RNG|||Quiz 2 — Phân phối & sinh số ngẫu nhiên', [
  { id: 'q1', question: 'Phân phối nào phù hợp nhất cho ước lượng ba điểm (xấu nhất/khả năng cao nhất/tốt nhất) từ chuyên gia?', options: ['Uniform', 'Triangular', 'Lognormal', 'Nhị thức'], correctIndex: 1, explanation: 'Triangular(min, mode, max) chính là ước lượng ba điểm — được dùng nhiều nhất trong @RISK/Crystal Ball.' },
  { id: 'q2', question: 'Vì sao giá tài sản thường dùng phân phối Lognormal chứ không phải Normal?', options: ['Lognormal dễ tính hơn', 'Lognormal luôn dương và lệch phải, khớp việc giá không thể âm', 'Normal không tồn tại trong Excel', 'Không có lý do đặc biệt'], correctIndex: 1, explanation: 'Giá không thể âm; Lognormal luôn dương nên phù hợp mô hình giá tài sản (nền cho GBM).' },
  { id: 'q3', question: 'Tăng số lượt thử (N) từ 1.000 lên 4.000 làm sai số chuẩn thay đổi thế nào?', options: ['Giảm một nửa', 'Giảm 4 lần', 'Không đổi', 'Tăng gấp đôi'], correctIndex: 0, explanation: 'Sai số chuẩn ~ σ/√N; N gấp 4 thì √N gấp 2 → sai số giảm một nửa.' },
]);

const c3 = doc('fms301-3-1-monte-carlo-npv', '3.1 — Basic Monte Carlo simulation: NPV with uncertain cash flows|||3.1 — Monte Carlo cơ bản: NPV với dòng tiền bất định',
  'Công thức NPV; gán phân phối cho dòng tiền; chạy N lượt để có phân phối NPV; đọc xác suất lỗ và phân vị.',
  [[
    `<span class="eyebrow">FMS301 · Chapter 3 · Lesson 3.1</span>
<h2>Monte Carlo simulation for NPV</h2>
<h3>From one NPV to a distribution of NPVs</h3>
<p>Recall: <code>NPV = Σ CFt / (1+r)^t − CF0</code>. In FIM302c you plugged in one value for each <code>CFt</code>. Here, assign each uncertain cash flow a distribution (e.g. revenue ~ Triangular, cost ~ Normal), then run the five-step loop from Chapter 1: draw once, compute one NPV, repeat N times.</p>
<pre><code>Illustrative example (ASSUMED figures, 3-year project):
 CF0 = -1,000 (fixed)
 Revenue_t ~ Triangular(min=350, mode=450, max=600) each year
 Cost_t    ~ Normal(mean=150, sd=30) each year
 CF_t = Revenue_t - Cost_t ;  r = 10%

 One trial: draw Revenue_1..3 and Cost_1..3 -> compute CF_1..3 -> NPV
 Repeat 10,000 trials -> a distribution of 10,000 NPV values
</code></pre>
<h3>Reading the output</h3>
<ul>
<li><strong>Mean NPV</strong> — the expected outcome across all trials.</li>
<li><strong>P(NPV &lt; 0)</strong> — probability of loss, something a single-point NPV can never tell you.</li>
<li><strong>Percentiles (P10 / P50 / P90)</strong> — e.g. "90% of trials give an NPV above P10" — a range for decision-makers, not one number.</li>
</ul>
<div class="callout"><span class="badge">vs. FRM301</span> FRM301 asks "what risks threaten this project and how do we manage them" (qualitative register + light quantitative tools). This chapter builds the actual simulation model that could feed numbers INTO that register.</div>`,
    `<span class="eyebrow">FMS301 · Chương 3 · Bài 3.1</span>
<h2>Mô phỏng Monte Carlo cho NPV</h2>
<h3>Từ một NPV thành một phân phối NPV</h3>
<p>Nhắc lại: <code>NPV = Σ CFt / (1+r)^t − CF0</code>. Ở FIM302c bạn điền một giá trị cho mỗi <code>CFt</code>. Ở đây, gán cho mỗi dòng tiền bất định một phân phối (vd doanh thu ~ Triangular, chi phí ~ Normal), rồi chạy vòng năm bước ở Chương 1: rút một lần, tính một NPV, lặp N lần.</p>
<pre><code>Ví dụ minh hoạ (số liệu GIẢ ĐỊNH, dự án 3 năm):
 CF0 = -1.000 (cố định)
 Doanh thu_t ~ Triangular(min=350, mode=450, max=600) mỗi năm
 Chi phí_t   ~ Normal(mean=150, sd=30) mỗi năm
 CF_t = Doanh thu_t - Chi phí_t ;  r = 10%

 Một lượt: rút Doanh thu_1..3 và Chi phí_1..3 -> tính CF_1..3 -> NPV
 Lặp 10.000 lượt -> một phân phối gồm 10.000 giá trị NPV
</code></pre>
<h3>Đọc kết quả</h3>
<ul>
<li><strong>NPV trung bình</strong> — kết quả kỳ vọng qua tất cả lượt thử.</li>
<li><strong>P(NPV &lt; 0)</strong> — xác suất lỗ, điều một NPV một-điểm không bao giờ cho biết.</li>
<li><strong>Phân vị (P10 / P50 / P90)</strong> — vd "90% lượt thử cho NPV cao hơn P10" — một khoảng cho người ra quyết định, không phải một số.</li>
</ul>
<div class="callout"><span class="badge">So với FRM301</span> FRM301 hỏi "dự án này bị đe doạ bởi rủi ro gì và quản trị thế nào" (sổ rủi ro định tính + công cụ định lượng nhẹ). Chương này dựng mô hình mô phỏng thật có thể cấp số liệu VÀO sổ đó.</div>`,
  ]]);

const c3q = quiz('fms301-quiz-3', 'Quiz 3 — Monte Carlo NPV|||Quiz 3 — Monte Carlo NPV', [
  { id: 'q1', question: 'Trong mô phỏng NPV, mỗi "lượt thử" (trial) là gì?', options: ['Một lần đọc báo cáo tài chính', 'Rút một giá trị ngẫu nhiên cho mỗi biến bất định rồi tính ra MỘT NPV', 'Chạy lại toàn bộ 10.000 lượt', 'Một năm trong dự án'], correctIndex: 1, explanation: 'Một trial = một bộ giá trị ngẫu nhiên → một NPV; lặp N lần cho ra phân phối NPV.' },
  { id: 'q2', question: 'P(NPV &lt; 0) trong kết quả mô phỏng có nghĩa là gì?', options: ['NPV trung bình luôn âm', 'Xác suất dự án lỗ (NPV âm) ước tính từ các lượt thử', 'Số lượt thử bị lỗi', 'Tỉ lệ chiết khấu'], correctIndex: 1, explanation: 'Đây là tỉ lệ lượt thử cho NPV âm — thước đo rủi ro mà NPV một-điểm không có.' },
  { id: 'q3', question: 'Vì sao mô hình NPV mô phỏng khác mô hình NPV tất định ở FIM302c?', options: ['Không khác, chỉ đổi tên', 'Mô phỏng gán phân phối cho dòng tiền và ra một phân phối NPV, thay vì một số cố định', 'Mô phỏng không cần tỉ lệ chiết khấu', 'Mô phỏng chỉ dùng cho cổ phiếu'], correctIndex: 1, explanation: 'Tất định: một giá trị mỗi biến → một NPV. Mô phỏng: phân phối mỗi biến → phân phối NPV.' },
]);

const c4 = doc('fms301-4-1-asset-price-simulation', '4.1 — Asset price simulation: random walk & Geometric Brownian Motion|||4.1 — Mô phỏng giá tài sản: random walk & Geometric Brownian Motion',
  'Random walk cho giá; công thức GBM rời rạc hoá; mô phỏng đường đi giá qua nhiều bước thời gian; ước lượng drift/volatility.',
  [[
    `<span class="eyebrow">FMS301 · Chapter 4 · Lesson 4.1</span>
<h2>Asset price simulation</h2>
<h3>Random walk</h3>
<p>The efficient-market idea: each price change is an unpredictable random step, independent of the past. A pure random walk on the price level itself, though, can go negative — not realistic for a stock price.</p>
<h3>Geometric Brownian Motion (GBM)</h3>
<p>GBM instead applies the random walk to <em>returns</em>, keeping price positive (a Lognormal outcome, from Chapter 2). Continuous-time form: <code>dS = μS dt + σS dW</code>. For simulation we use the discretized, exact-solution version:</p>
<pre><code>S(t+Δt) = S(t) × exp[ (μ − σ²/2)·Δt + σ·√Δt·Z ],   Z ~ Normal(0,1)

Illustrative example (ASSUMED): S0 = 100, μ = 8%/yr, σ = 25%/yr, Δt = 1 day (1/252)
 One day's draw Z = 0.40:
 S1 = 100 × exp[(0.08 − 0.25²/2)/252 + 0.25×√(1/252)×0.40] ≈ 100.63
</code></pre>
<h3>Simulating a path, then many paths</h3>
<p>Repeat the formula over many time steps to build ONE price <strong>path</strong> to the horizon (e.g. 252 daily steps = one year). Repeat that whole path thousands of times (each with fresh random draws) to get a <strong>distribution of ending prices</strong> — the input Chapters 5 and 6 build on.</p>
<h3>Estimating μ and σ</h3>
<p>In practice, drift (μ) and volatility (σ) are estimated from historical log-returns (mean and standard deviation of ln(S_t/S_{t-1}), annualized).</p>`,
    `<span class="eyebrow">FMS301 · Chương 4 · Bài 4.1</span>
<h2>Mô phỏng giá tài sản</h2>
<h3>Random walk</h3>
<p>Ý tưởng thị trường hiệu quả: mỗi thay đổi giá là một bước ngẫu nhiên không đoán trước được, độc lập với quá khứ. Nhưng random walk thuần trên MỨC giá có thể xuống âm — không thực tế cho giá cổ phiếu.</p>
<h3>Geometric Brownian Motion (GBM)</h3>
<p>GBM áp random walk lên <em>lợi suất</em> thay vì mức giá, giữ giá luôn dương (kết quả Lognormal, từ Chương 2). Dạng liên tục: <code>dS = μS dt + σS dW</code>. Để mô phỏng ta dùng dạng rời rạc hoá, nghiệm chính xác:</p>
<pre><code>S(t+Δt) = S(t) × exp[ (μ − σ²/2)·Δt + σ·√Δt·Z ],   Z ~ Normal(0,1)

Ví dụ minh hoạ (GIẢ ĐỊNH): S0 = 100, μ = 8%/năm, σ = 25%/năm, Δt = 1 ngày (1/252)
 Rút Z = 0,40 cho một ngày:
 S1 = 100 × exp[(0,08 − 0,25²/2)/252 + 0,25×√(1/252)×0,40] ≈ 100,63
</code></pre>
<h3>Mô phỏng một đường đi, rồi nhiều đường đi</h3>
<p>Lặp công thức qua nhiều bước thời gian để dựng MỘT <strong>đường đi</strong> giá tới hạn (vd 252 bước ngày = một năm). Lặp toàn đường đi đó hàng nghìn lần (mỗi lần rút số ngẫu nhiên mới) để có <strong>phân phối giá kết thúc</strong> — đầu vào cho Chương 5 và 6.</p>
<h3>Ước lượng μ và σ</h3>
<p>Trong thực tế, drift (μ) và độ bất định (σ) được ước lượng từ lợi suất log lịch sử (trung bình và độ lệch chuẩn của ln(S_t/S_&#123;t-1&#125;), quy về năm).</p>`,
  ]]);

const c4q = quiz('fms301-quiz-4', 'Quiz 4 — Asset price simulation|||Quiz 4 — Mô phỏng giá tài sản', [
  { id: 'q1', question: 'Vì sao dùng GBM (áp random walk lên lợi suất) thay vì random walk thuần trên giá?', options: ['GBM tính nhanh hơn', 'Random walk thuần trên giá có thể ra giá âm, không thực tế; GBM giữ giá luôn dương', 'GBM không cần số ngẫu nhiên', 'Không có khác biệt'], correctIndex: 1, explanation: 'Áp random walk lên lợi suất (dạng log) giữ giá dương — khớp phân phối Lognormal.' },
  { id: 'q2', question: 'Trong công thức GBM rời rạc, biến Z đóng vai trò gì?', options: ['Lãi suất phi rủi ro', 'Một lượt rút ngẫu nhiên từ Normal(0,1), tạo phần bất định của bước giá', 'Giá ban đầu S0', 'Số bước thời gian'], correctIndex: 1, explanation: 'Z ~ Normal(0,1) là nguồn ngẫu nhiên; mỗi bước thời gian rút một Z mới.' },
  { id: 'q3', question: 'Để có phân phối giá kết thúc (không chỉ một đường đi), ta cần làm gì?', options: ['Chỉ chạy một đường đi rồi nhân đôi', 'Lặp lại việc mô phỏng cả đường đi hàng nghìn lần với số ngẫu nhiên mới mỗi lần', 'Tăng σ lên rất lớn', 'Đặt μ = 0'], correctIndex: 1, explanation: 'Mỗi đường đi độc lập cho một giá kết thúc; lặp nhiều đường đi mới có phân phối.' },
]);

const c5 = doc('fms301-5-1-portfolio-var', '5.1 — Portfolio risk simulation & simulated Value at Risk (VaR)|||5.1 — Mô phỏng rủi ro danh mục & VaR mô phỏng',
  'VaR là gì; VaR tham số vs VaR mô phỏng; các bước tính VaR mô phỏng cho danh mục nhiều tài sản có tương quan.',
  [[
    `<span class="eyebrow">FMS301 · Chapter 5 · Lesson 5.1</span>
<h2>Portfolio risk simulation &amp; simulated VaR</h2>
<h3>Value at Risk (VaR)</h3>
<p><strong>VaR</strong> answers: "over a given horizon, what loss will we NOT exceed with (1−α) confidence?" e.g. a 1-day 95% VaR of 50 means: on 95% of days, the loss stays below 50 (and on the remaining 5%, it can be worse).</p>
<h3>Parametric (analytical) VaR vs. simulated (Monte Carlo) VaR</h3>
<ul>
<li><strong>Parametric VaR</strong> — assumes returns are Normal, uses a formula (mean, std dev, z-score). Fast, but breaks down for non-normal returns, non-linear instruments (options), or complex correlations.</li>
<li><strong>Simulated VaR</strong> — simulates thousands of joint portfolio outcomes directly (any distribution shape, any correlation structure, options included), then reads the loss percentile straight off the simulated results. Slower, but far more general — the reason it matters for this course.</li>
</ul>
<h3>Steps for a simulated portfolio VaR</h3>
<pre><code>1. Simulate CORRELATED returns for every asset in the portfolio
   (correlation via a Cholesky decomposition of the covariance matrix)
2. In each trial, compute portfolio value/loss from those simulated returns
3. Repeat for N trials -> N simulated portfolio losses
4. Sort the losses; the 95% VaR is the loss at the 5th percentile
   (5% of trials lose MORE than this)
</code></pre>
<div class="callout"><span class="badge">vs. FMR301</span> FMR301 sets the risk appetite and hedging policy ON TOP of a VaR number. This chapter is where that VaR number actually comes from.</div>`,
    `<span class="eyebrow">FMS301 · Chương 5 · Bài 5.1</span>
<h2>Mô phỏng rủi ro danh mục &amp; VaR mô phỏng</h2>
<h3>Value at Risk (VaR)</h3>
<p><strong>VaR</strong> trả lời: "trong một khoảng thời gian, mức lỗ nào ta KHÔNG vượt quá với độ tin cậy (1−α)?" vd VaR 1 ngày mức 95% bằng 50 nghĩa là: 95% số ngày mức lỗ dưới 50 (5% còn lại có thể lỗ nặng hơn).</p>
<h3>VaR tham số (giải tích) vs. VaR mô phỏng (Monte Carlo)</h3>
<ul>
<li><strong>VaR tham số</strong> — giả định lợi suất Normal, dùng công thức (trung bình, độ lệch chuẩn, z-score). Nhanh, nhưng sai lệch khi lợi suất không Normal, công cụ phi tuyến (quyền chọn), hoặc tương quan phức tạp.</li>
<li><strong>VaR mô phỏng</strong> — mô phỏng trực tiếp hàng nghìn kết quả danh mục đồng thời (bất kỳ dạng phân phối, bất kỳ cấu trúc tương quan, gồm cả quyền chọn), rồi đọc phân vị lỗ ngay từ kết quả mô phỏng. Chậm hơn, nhưng tổng quát hơn nhiều — lý do môn này quan trọng.</li>
</ul>
<h3>Các bước tính VaR danh mục mô phỏng</h3>
<pre><code>1. Mô phỏng lợi suất TƯƠNG QUAN cho mọi tài sản trong danh mục
   (tương quan qua phân rã Cholesky của ma trận hiệp phương sai)
2. Ở mỗi lượt thử, tính giá trị/mức lỗ danh mục từ các lợi suất mô phỏng đó
3. Lặp N lượt -> N mức lỗ danh mục mô phỏng
4. Sắp xếp mức lỗ; VaR 95% là mức lỗ ở phân vị thứ 5
   (5% lượt thử lỗ NHIỀU HƠN mức này)
</code></pre>
<div class="callout"><span class="badge">So với FMR301</span> FMR301 đặt mức chấp nhận rủi ro và chính sách hedging TRÊN một số VaR. Chương này là nơi số VaR đó thực sự được sinh ra.</div>`,
  ]]);

const c5q = quiz('fms301-quiz-5', 'Quiz 5 — Portfolio VaR|||Quiz 5 — VaR danh mục', [
  { id: 'q1', question: 'VaR 1 ngày mức 95% bằng 50 có nghĩa là gì?', options: ['Lỗ chắc chắn đúng 50 mỗi ngày', '95% số ngày mức lỗ không vượt quá 50', 'Danh mục luôn có giá trị 50', 'Không liên quan đến xác suất'], correctIndex: 1, explanation: 'VaR là ngưỡng lỗ không vượt quá với độ tin cậy cho trước (ở đây 95%).' },
  { id: 'q2', question: 'VaR mô phỏng có ưu điểm gì so với VaR tham số?', options: ['Luôn nhanh hơn', 'Xử lý được lợi suất không Normal, công cụ phi tuyến (quyền chọn) và tương quan phức tạp', 'Không cần dữ liệu lịch sử', 'Không cần giả định gì cả'], correctIndex: 1, explanation: 'VaR tham số dựa giả định Normal; VaR mô phỏng tổng quát hơn nhờ mô phỏng trực tiếp.' },
  { id: 'q3', question: 'Sau khi có N mức lỗ mô phỏng, cách lấy VaR 95% là?', options: ['Lấy giá trị lỗ trung bình', 'Sắp xếp mức lỗ và lấy giá trị ở phân vị thứ 5', 'Lấy mức lỗ lớn nhất trong N lượt', 'Lấy mức lỗ nhỏ nhất'], correctIndex: 1, explanation: 'VaR 95% = phân vị thứ 5 của phân phối lỗ đã sắp xếp (5% lượt lỗ nặng hơn).' },
]);

const c6 = doc('fms301-6-1-option-pricing-monte-carlo', '6.1 — Option pricing via Monte Carlo|||6.1 — Định giá quyền chọn bằng Monte Carlo',
  'Payoff quyền chọn mua/bán; mô phỏng giá kết thúc theo GBM rủi ro-trung tính; chiết khấu trung bình payoff; ưu thế cho quyền chọn phụ thuộc đường đi.',
  [[
    `<span class="eyebrow">FMS301 · Chapter 6 · Lesson 6.1</span>
<h2>Option pricing via Monte Carlo</h2>
<h3>Option payoff</h3>
<p>A European <strong>call</strong> pays <code>max(S_T − K, 0)</code> at maturity T; a <strong>put</strong> pays <code>max(K − S_T, 0)</code>, where K is the strike and S_T is the terminal stock price.</p>
<h3>Monte Carlo pricing recipe</h3>
<p>Use the GBM formula from Chapter 4 to simulate many terminal prices S_T, but under the <strong>risk-neutral drift</strong> (replace μ with the risk-free rate r — the no-arbitrage pricing assumption), compute each path's payoff, discount back to today, and average:</p>
<pre><code>C ≈ e^(−r·T) × (1/N) × Σ max(S_T,i − K, 0),   i = 1..N

Illustrative example (ASSUMED): S0=100, K=100, r=5%, σ=20%, T=1yr, N=10,000
 Simulate 10,000 terminal prices S_T under risk-neutral GBM
 Average the 10,000 payoffs max(S_T-100, 0), discount at e^(-0.05)
 -> Monte Carlo call price estimate (converges toward the Black-Scholes value)
</code></pre>
<h3>Where Monte Carlo actually earns its keep</h3>
<p>For plain European options, the closed-form <strong>Black-Scholes</strong> formula is faster and exact. Monte Carlo's real value is <strong>path-dependent</strong> payoffs with no closed form — Asian options (average price), barrier options (knock-in/knock-out), and other exotics where you must track the whole simulated path, not just the ending price.</p>
<div class="callout"><span class="badge">Precision cost</span> Pricing error shrinks only as 1/√N (Chapter 2) — doubling accuracy needs 4× the trials, a real computing-cost trade-off in practice.</div>`,
    `<span class="eyebrow">FMS301 · Chương 6 · Bài 6.1</span>
<h2>Định giá quyền chọn bằng Monte Carlo</h2>
<h3>Payoff quyền chọn</h3>
<p>Quyền chọn mua (call) kiểu Âu trả <code>max(S_T − K, 0)</code> khi đến hạn T; quyền chọn bán (put) trả <code>max(K − S_T, 0)</code>, với K là giá thực hiện và S_T là giá cổ phiếu lúc đáo hạn.</p>
<h3>Cách định giá bằng Monte Carlo</h3>
<p>Dùng công thức GBM ở Chương 4 để mô phỏng nhiều giá kết thúc S_T, nhưng dưới <strong>drift rủi ro-trung tính</strong> (thay μ bằng lãi suất phi rủi ro r — giả định định giá không có arbitrage), tính payoff mỗi đường đi, chiết khấu về hiện tại, rồi lấy trung bình:</p>
<pre><code>C ≈ e^(−r·T) × (1/N) × Σ max(S_T,i − K, 0),   i = 1..N

Ví dụ minh hoạ (GIẢ ĐỊNH): S0=100, K=100, r=5%, σ=20%, T=1 năm, N=10.000
 Mô phỏng 10.000 giá kết thúc S_T dưới GBM rủi ro-trung tính
 Lấy trung bình 10.000 payoff max(S_T-100, 0), chiết khấu bằng e^(-0,05)
 -> Giá quyền chọn ước lượng bằng Monte Carlo (tiến gần giá trị Black-Scholes)
</code></pre>
<h3>Monte Carlo thực sự có giá trị ở đâu</h3>
<p>Với quyền chọn Âu thuần, công thức đóng <strong>Black-Scholes</strong> nhanh hơn và chính xác. Giá trị thật của Monte Carlo nằm ở payoff <strong>phụ thuộc đường đi</strong> không có công thức đóng — quyền chọn châu Á (giá trung bình), quyền chọn rào (knock-in/knock-out) và các quyền chọn kỳ lạ khác, nơi phải theo dõi cả đường đi mô phỏng, không chỉ giá cuối.</p>
<div class="callout"><span class="badge">Cái giá của độ chính xác</span> Sai số định giá chỉ giảm theo 1/√N (Chương 2) — gấp đôi độ chính xác cần 4 lần số lượt thử, một đánh đổi chi phí tính toán thật trong thực tế.</div>`,
  ]]);

const c6q = quiz('fms301-quiz-6', 'Quiz 6 — Option pricing by Monte Carlo|||Quiz 6 — Định giá quyền chọn bằng Monte Carlo', [
  { id: 'q1', question: 'Payoff của một quyền chọn mua (call) kiểu Âu là?', options: ['max(K - S_T, 0)', 'max(S_T - K, 0)', 'S_T - K luôn dương', 'K - S_T luôn dương'], correctIndex: 1, explanation: 'Call trả phần S_T vượt K (nếu có), tức max(S_T-K, 0); put mới là max(K-S_T,0).' },
  { id: 'q2', question: 'Khi mô phỏng giá để định giá quyền chọn, ta dùng drift nào cho GBM?', options: ['Drift lịch sử thực tế μ', 'Drift rủi ro-trung tính (lãi suất phi rủi ro r)', 'Drift bằng 0 luôn', 'Không cần drift'], correctIndex: 1, explanation: 'Định giá không-arbitrage dùng drift rủi ro-trung tính = r, không phải μ lịch sử.' },
  { id: 'q3', question: 'Monte Carlo có ưu thế rõ nhất so với Black-Scholes ở loại quyền chọn nào?', options: ['Quyền chọn Âu thuần, không phụ thuộc đường đi', 'Quyền chọn phụ thuộc đường đi (Asian, rào) không có công thức đóng', 'Mọi loại quyền chọn như nhau', 'Chỉ quyền chọn cổ phiếu blue-chip'], correctIndex: 1, explanation: 'Black-Scholes nhanh & đúng cho Âu thuần; Monte Carlo cần cho payoff phụ thuộc cả đường đi.' },
]);

const c7 = doc('fms301-7-1-scenario-sensitivity-optimization', '7.1 — Scenario analysis, sensitivity & simulation optimization|||7.1 — Phân tích kịch bản, độ nhạy & tối ưu mô phỏng',
  'Kịch bản rời rạc vs mô phỏng liên tục; biểu đồ tornado (độ nhạy theo tương quan hạng); tối ưu mô phỏng (RISKOptimizer/OptQuest).',
  [[
    `<span class="eyebrow">FMS301 · Chapter 7 · Lesson 7.1</span>
<h2>Scenario analysis, sensitivity &amp; simulation optimization</h2>
<h3>Scenario analysis vs. full simulation</h3>
<p><strong>Scenario analysis</strong> picks a handful of discrete cases (best / base / worst) and computes an output for each — simple, communicates well, but only ever sees three points. <strong>Full simulation</strong> (Chapters 3-6) covers the whole continuous range with a probability attached to every outcome. In practice teams use both: scenarios to frame the story, simulation to quantify it.</p>
<h3>Sensitivity analysis: the tornado chart</h3>
<p>Which input variable's uncertainty actually drives the output's uncertainty most? Simulation software ranks inputs by their <strong>rank correlation</strong> with the output across all trials, then draws a <strong>tornado chart</strong> — bars sorted from most-influential input at top to least at bottom.</p>
<pre><code>Illustrative tornado ranking (ASSUMED, NPV model from Chapter 3):
 Revenue growth  |################| rank corr. 0.71   (biggest driver)
 Discount rate   |########........| rank corr. 0.34
 Fixed cost      |###.............| rank corr. 0.12   (smallest driver)
</code></pre>
<p>This tells you exactly where to focus data-gathering effort: refining the revenue-growth estimate matters far more than refining fixed cost.</p>
<h3>Simulation optimization</h3>
<p>Tools like <strong>@RISK's RISKOptimizer</strong> or <strong>Crystal Ball's OptQuest</strong> go one step further: they search over decision variables (e.g. order quantity, hedge ratio, portfolio weights) to optimize an objective (maximize expected NPV, minimize probability of shortfall) subject to constraints — combining a simulation model with a search algorithm (often genetic-algorithm based) instead of a human trying values by hand.</p>`,
    `<span class="eyebrow">FMS301 · Chương 7 · Bài 7.1</span>
<h2>Phân tích kịch bản, độ nhạy &amp; tối ưu mô phỏng</h2>
<h3>Phân tích kịch bản vs. mô phỏng đầy đủ</h3>
<p><strong>Phân tích kịch bản</strong> chọn vài trường hợp rời rạc (tốt nhất / cơ sở / xấu nhất) và tính đầu ra cho mỗi trường hợp — đơn giản, dễ trình bày, nhưng chỉ nhìn thấy ba điểm. <strong>Mô phỏng đầy đủ</strong> (Chương 3-6) phủ cả khoảng liên tục với xác suất gắn cho từng kết quả. Thực tế các nhóm dùng cả hai: kịch bản để kể câu chuyện, mô phỏng để định lượng nó.</p>
<h3>Phân tích độ nhạy: biểu đồ tornado</h3>
<p>Biến đầu vào bất định nào thực sự chi phối độ bất định của đầu ra nhiều nhất? Phần mềm mô phỏng xếp hạng các biến đầu vào theo <strong>tương quan hạng (rank correlation)</strong> với đầu ra qua mọi lượt thử, rồi vẽ <strong>biểu đồ tornado</strong> — các thanh sắp từ biến ảnh hưởng nhiều nhất ở trên xuống ít nhất ở dưới.</p>
<pre><code>Xếp hạng tornado minh hoạ (GIẢ ĐỊNH, mô hình NPV ở Chương 3):
 Tăng trưởng doanh thu |################| tương quan hạng 0,71   (chi phối nhất)
 Tỉ lệ chiết khấu       |########........| tương quan hạng 0,34
 Chi phí cố định        |###.............| tương quan hạng 0,12   (ít chi phối nhất)
</code></pre>
<p>Điều này cho biết chính xác nên tập trung thu thập dữ liệu ở đâu: cải thiện ước lượng tăng trưởng doanh thu quan trọng hơn hẳn cải thiện ước lượng chi phí cố định.</p>
<h3>Tối ưu mô phỏng</h3>
<p>Công cụ như <strong>RISKOptimizer</strong> của @RISK hay <strong>OptQuest</strong> của Crystal Ball đi xa hơn: tìm kiếm trên các biến quyết định (vd số lượng đặt hàng, tỉ lệ hedging, trọng số danh mục) để tối ưu một mục tiêu (tối đa NPV kỳ vọng, tối thiểu xác suất thiếu hụt) chịu ràng buộc — kết hợp mô hình mô phỏng với thuật toán tìm kiếm (thường dựa trên thuật toán di truyền) thay vì con người thử tay từng giá trị.</p>`,
  ]]);

const c7q = quiz('fms301-quiz-7', 'Quiz 7 — Scenario, sensitivity & optimization|||Quiz 7 — Kịch bản, độ nhạy & tối ưu', [
  { id: 'q1', question: 'Khác biệt chính giữa phân tích kịch bản và mô phỏng đầy đủ là gì?', options: ['Kịch bản dùng phân phối liên tục, mô phỏng dùng vài điểm', 'Kịch bản chỉ xét vài trường hợp rời rạc; mô phỏng phủ cả khoảng liên tục có xác suất', 'Hai cách hoàn toàn giống nhau', 'Kịch bản chính xác hơn mô phỏng'], correctIndex: 1, explanation: 'Kịch bản = vài điểm (tốt/cơ sở/xấu); mô phỏng = phân phối liên tục đầy đủ với xác suất.' },
  { id: 'q2', question: 'Biểu đồ tornado dùng để làm gì?', options: ['Vẽ đường đi giá cổ phiếu', 'Xếp hạng biến đầu vào theo mức ảnh hưởng (tương quan hạng) tới đầu ra', 'Tính NPV trung bình', 'Sinh số ngẫu nhiên'], correctIndex: 1, explanation: 'Tornado chart xếp các biến đầu vào theo tương quan hạng với đầu ra, biến ảnh hưởng nhiều nhất ở trên.' },
  { id: 'q3', question: 'Tối ưu mô phỏng (vd RISKOptimizer/OptQuest) khác mô phỏng thông thường ở điểm nào?', options: ['Không dùng số ngẫu nhiên', 'Kết hợp mô hình mô phỏng với thuật toán tìm kiếm để tối ưu biến quyết định, không chỉ chạy một cấu hình cố định', 'Chỉ chạy được trong Excel', 'Không cần ràng buộc'], correctIndex: 1, explanation: 'Tối ưu mô phỏng tìm kiếm trên biến quyết định để tối ưu mục tiêu, thay vì chỉ mô phỏng một cấu hình.' },
]);

const c8 = doc('fms301-8-1-tools-decision-making', '8.1 — Tools (@RISK, Crystal Ball, Python) & decision-making applications|||8.1 — Công cụ (@RISK, Crystal Ball, Python) & ứng dụng ra quyết định',
  '@RISK/Crystal Ball (add-in Excel) vs Python (numpy/scipy); khi nào chọn công cụ nào; ứng dụng thực tế và bảng phân biệt 4 môn.',
  [[
    `<span class="eyebrow">FMS301 · Chapter 8 · Lesson 8.1</span>
<h2>Tools &amp; decision-making applications</h2>
<h3>@RISK &amp; Crystal Ball — Excel add-ins</h3>
<p><strong>@RISK</strong> (Palisade) and <strong>Crystal Ball</strong> (Oracle) both plug into Excel: define a distribution directly in a cell, mark an output cell, press "run simulation" — thousands of trials, output distribution, statistics and tornado charts appear inside the familiar spreadsheet. This is the most widely adopted route in finance/corporate teams because no programming is required.</p>
<h3>Python — full programmatic control</h3>
<p><strong>numpy</strong>/<strong>scipy</strong> generate random draws and run the trial loop; <strong>pandas</strong> organizes results; <strong>matplotlib</strong> plots the output distribution. More setup effort, but far more flexible: custom correlation structures, huge trial counts, integration with other systems, reproducible scripts instead of manual spreadsheet clicks.</p>
<pre><code>Excel add-in:  fast to build, easy for finance teams, tied to spreadsheet limits
Python:        more code, but scalable / automatable / integrable
</code></pre>
<h3>Decision-making applications</h3>
<ul>
<li><strong>Capital budgeting</strong> — choose between projects using their simulated NPV distributions, not one number each (Chapter 3).</li>
<li><strong>Risk-adjusted project selection</strong> — combine expected NPV with P(NPV&lt;0) from the simulation.</li>
<li><strong>Portfolio risk reporting</strong> — simulated VaR feeds directly into FMR301-style risk dashboards (Chapter 5).</li>
<li><strong>Derivative valuation</strong> — Monte Carlo pricing for path-dependent options (Chapter 6).</li>
</ul>
<h3>The four courses, side by side</h3>
<pre><code>FIM302c  -> deterministic modelling basics (one scenario, fixed inputs)
FMS301   -> THIS course: stochastic simulation engine (random inputs, Monte Carlo)
FMR301   -> risk management policy layer (appetite, hedging, governance)
FRM301   -> project risk register (qualitative + light quantitative, project-scoped)
</code></pre>
<div class="callout"><span class="badge">Course wrap-up</span> Every prior chapter's technique — distributions, Monte Carlo NPV, GBM paths, VaR, option pricing, sensitivity/optimization — is what these tools actually run under the hood.</div>`,
    `<span class="eyebrow">FMS301 · Chương 8 · Bài 8.1</span>
<h2>Công cụ &amp; ứng dụng ra quyết định</h2>
<h3>@RISK &amp; Crystal Ball — add-in Excel</h3>
<p><strong>@RISK</strong> (Palisade) và <strong>Crystal Ball</strong> (Oracle) đều gắn vào Excel: đặt phân phối ngay trong ô, đánh dấu ô đầu ra, bấm "run simulation" — hàng nghìn lượt thử, phân phối đầu ra, thống kê và biểu đồ tornado hiện ngay trong bảng tính quen thuộc. Đây là hướng được dùng nhiều nhất trong các nhóm tài chính/doanh nghiệp vì không cần biết lập trình.</p>
<h3>Python — toàn quyền kiểm soát bằng mã</h3>
<p><strong>numpy</strong>/<strong>scipy</strong> sinh số ngẫu nhiên và chạy vòng lượt thử; <strong>pandas</strong> tổ chức kết quả; <strong>matplotlib</strong> vẽ phân phối đầu ra. Tốn công thiết lập hơn, nhưng linh hoạt hơn nhiều: cấu trúc tương quan tùy chỉnh, số lượt thử rất lớn, tích hợp hệ thống khác, script tái lập được thay vì bấm tay trên bảng tính.</p>
<pre><code>Add-in Excel:  dựng nhanh, dễ dùng cho nhóm tài chính, giới hạn theo bảng tính
Python:        nhiều mã hơn, nhưng mở rộng / tự động hoá / tích hợp tốt hơn
</code></pre>
<h3>Ứng dụng ra quyết định</h3>
<ul>
<li><strong>Duyệt vốn đầu tư (capital budgeting)</strong> — chọn giữa các dự án bằng phân phối NPV mô phỏng, không phải một số mỗi dự án (Chương 3).</li>
<li><strong>Chọn dự án theo rủi ro</strong> — kết hợp NPV kỳ vọng với P(NPV&lt;0) từ mô phỏng.</li>
<li><strong>Báo cáo rủi ro danh mục</strong> — VaR mô phỏng cấp trực tiếp vào bảng điều khiển rủi ro kiểu FMR301 (Chương 5).</li>
<li><strong>Định giá công cụ phái sinh</strong> — định giá Monte Carlo cho quyền chọn phụ thuộc đường đi (Chương 6).</li>
</ul>
<h3>Bốn môn, đặt cạnh nhau</h3>
<pre><code>FIM302c  -> nền mô hình tất định (một tình huống, đầu vào cố định)
FMS301   -> môn NÀY: bộ máy mô phỏng stochastic (đầu vào ngẫu nhiên, Monte Carlo)
FMR301   -> lớp chính sách quản trị rủi ro (mức chấp nhận, hedging, quản trị)
FRM301   -> sổ rủi ro dự án (định tính + định lượng nhẹ, phạm vi dự án)
</code></pre>
<div class="callout"><span class="badge">Tổng kết môn</span> Mọi kỹ thuật ở các chương trước — phân phối, Monte Carlo NPV, đường đi GBM, VaR, định giá quyền chọn, độ nhạy/tối ưu — chính là thứ các công cụ này chạy ngầm bên dưới.</div>`,
  ]]);

const c8q = quiz('fms301-quiz-8', 'Quiz 8 — Tools & decision-making|||Quiz 8 — Công cụ & ra quyết định', [
  { id: 'q1', question: 'Ưu điểm chính của @RISK/Crystal Ball so với viết mô phỏng bằng Python là?', options: ['Chạy nhanh hơn Python trong mọi trường hợp', 'Gắn ngay vào Excel, không cần biết lập trình, phù hợp nhóm tài chính', 'Không cần dữ liệu đầu vào', 'Chỉ dùng được cho quyền chọn'], correctIndex: 1, explanation: '@RISK/Crystal Ball là add-in Excel — dễ tiếp cận cho người không viết code, phổ biến trong doanh nghiệp.' },
  { id: 'q2', question: 'Python có ưu thế nào so với add-in Excel khi mô phỏng quy mô lớn?', options: ['Không cần số ngẫu nhiên', 'Linh hoạt hơn: cấu trúc tương quan tùy chỉnh, số lượt thử lớn, tích hợp hệ thống, script tái lập', 'Luôn miễn phí còn Excel luôn trả phí', 'Không cần hiểu phân phối xác suất'], correctIndex: 1, explanation: 'Python cho toàn quyền kiểm soát bằng mã: mở rộng, tự động hoá, tích hợp tốt hơn add-in Excel.' },
  { id: 'q3', question: 'Trong bốn môn liên quan, FMS301 đóng vai trò gì?', options: ['Chính sách quản trị rủi ro tổng thể', 'Sổ rủi ro cấp dự án', 'Bộ máy mô phỏng stochastic (Monte Carlo) đặt trên mô hình tất định', 'Chỉ dạy Excel cơ bản'], correctIndex: 2, explanation: 'FMS301 là lớp mô phỏng/stochastic; FIM302c là nền tất định, FMR301 là chính sách rủi ro, FRM301 là sổ rủi ro dự án.' },
]);

const taiLieu = doc('fms301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình (FLM), sách tham khảo (Benninga, Glasserman), tài liệu @RISK/Crystal Ball, YouTube, công cụ Python/Excel, lộ trình tự học.',
  [[
    `<span class="eyebrow">FMS301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Applied Financial Modelling and Simulation — random variables, Monte Carlo NPV, asset-price simulation, simulated VaR, option pricing, scenario/sensitivity/optimization, and the tools — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are cited references and free resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for FMS301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books (cited, not uploaded)</h3>
<ul>
<li><a href="https://mitpress.mit.edu/" target="_blank" rel="noopener">Simon Benninga — <em>Financial Modeling</em> (MIT Press)</a> — the standard Excel-based financial modelling reference.</li>
<li><a href="https://link.springer.com/" target="_blank" rel="noopener">Paul Glasserman — <em>Monte Carlo Methods in Financial Engineering</em> (Springer)</a> — the core reference for simulation methods used in this course.</li>
<li><a href="https://en.wikipedia.org/wiki/Monte_Carlo_methods_in_finance" target="_blank" rel="noopener">Monte Carlo methods in finance — overview (Wikipedia)</a></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.palisade.com/risk/" target="_blank" rel="noopener">@RISK documentation (Palisade)</a> — distributions, RiskOptimizer, tornado charts.</li>
<li><a href="https://www.oracle.com/applications/crystalball/" target="_blank" rel="noopener">Crystal Ball documentation (Oracle)</a> — OptQuest, sensitivity analysis.</li>
<li><a href="https://numpy.org/doc/stable/reference/random/index.html" target="_blank" rel="noopener">NumPy random — official docs</a> — Python random number generation for simulation.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@wallstreetprep" target="_blank" rel="noopener">Wall Street Prep</a> — financial modelling walkthroughs.</li>
<li><a href="https://www.youtube.com/@quantpy" target="_blank" rel="noopener">QuantPy</a> — Monte Carlo &amp; quantitative finance in Python.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://support.microsoft.com/excel" target="_blank" rel="noopener">Excel Data Analysis / RAND functions</a> — build simple simulations without an add-in.</li>
<li><a href="https://www.palisade.com/risk/" target="_blank" rel="noopener">@RISK trial</a> and <a href="https://www.oracle.com/applications/crystalball/" target="_blank" rel="noopener">Crystal Ball</a> — industry-standard Excel simulation add-ins.</li>
<li><a href="https://numpy.org/" target="_blank" rel="noopener">Python (numpy/scipy/pandas/matplotlib)</a> — code-based simulation.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — random variables, distributions, random number generation (Chapters 1-2).</li>
<li><strong>Core technique</strong> — Monte Carlo NPV, asset-price paths, portfolio VaR (Chapters 3-5).</li>
<li><strong>Go deeper</strong> — option pricing, scenario/sensitivity, simulation optimization (Chapters 6-7).</li>
<li><strong>Job-ready</strong> — build the same model in an @RISK/Crystal Ball spreadsheet AND in Python (Chapter 8), and be able to explain which of FIM302c/FMS301/FMR301/FRM301 a given task actually belongs to.</li>
</ol></div>`,
    `<span class="eyebrow">FMS301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Mô hình hoá tài chính ứng dụng và Mô phỏng — biến ngẫu nhiên, Monte Carlo cho NPV, mô phỏng giá tài sản, VaR mô phỏng, định giá quyền chọn, kịch bản/độ nhạy/tối ưu, và các công cụ — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là tài liệu trích dẫn và nguồn miễn phí.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của FMS301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo (trích dẫn, không upload)</h3>
<ul>
<li><a href="https://mitpress.mit.edu/" target="_blank" rel="noopener">Simon Benninga — <em>Financial Modeling</em> (MIT Press)</a> — tài liệu chuẩn về mô hình tài chính trên Excel.</li>
<li><a href="https://link.springer.com/" target="_blank" rel="noopener">Paul Glasserman — <em>Monte Carlo Methods in Financial Engineering</em> (Springer)</a> — tài liệu gốc về phương pháp mô phỏng dùng trong môn này.</li>
<li><a href="https://en.wikipedia.org/wiki/Monte_Carlo_methods_in_finance" target="_blank" rel="noopener">Monte Carlo methods in finance — tổng quan (Wikipedia)</a></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.palisade.com/risk/" target="_blank" rel="noopener">Tài liệu @RISK (Palisade)</a> — phân phối, RiskOptimizer, biểu đồ tornado.</li>
<li><a href="https://www.oracle.com/applications/crystalball/" target="_blank" rel="noopener">Tài liệu Crystal Ball (Oracle)</a> — OptQuest, phân tích độ nhạy.</li>
<li><a href="https://numpy.org/doc/stable/reference/random/index.html" target="_blank" rel="noopener">NumPy random — tài liệu chính thức</a> — sinh số ngẫu nhiên Python cho mô phỏng.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@wallstreetprep" target="_blank" rel="noopener">Wall Street Prep</a> — hướng dẫn mô hình tài chính.</li>
<li><a href="https://www.youtube.com/@quantpy" target="_blank" rel="noopener">QuantPy</a> — Monte Carlo &amp; tài chính định lượng bằng Python.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://support.microsoft.com/excel" target="_blank" rel="noopener">Hàm RAND / Data Analysis trong Excel</a> — dựng mô phỏng đơn giản không cần add-in.</li>
<li><a href="https://www.palisade.com/risk/" target="_blank" rel="noopener">@RISK (bản thử)</a> và <a href="https://www.oracle.com/applications/crystalball/" target="_blank" rel="noopener">Crystal Ball</a> — add-in mô phỏng Excel chuẩn ngành.</li>
<li><a href="https://numpy.org/" target="_blank" rel="noopener">Python (numpy/scipy/pandas/matplotlib)</a> — mô phỏng bằng mã.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — biến ngẫu nhiên, phân phối, sinh số ngẫu nhiên (Chương 1-2).</li>
<li><strong>Kỹ thuật lõi</strong> — Monte Carlo cho NPV, đường đi giá tài sản, VaR danh mục (Chương 3-5).</li>
<li><strong>Đào sâu</strong> — định giá quyền chọn, kịch bản/độ nhạy, tối ưu mô phỏng (Chương 6-7).</li>
<li><strong>Sẵn sàng đi làm</strong> — dựng cùng một mô hình trong bảng tính @RISK/Crystal Ball VÀ trong Python (Chương 8), và giải thích được một việc cụ thể thuộc về FIM302c/FMS301/FMR301/FRM301 nào.</li>
</ol></div>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'FMS301',
    slug: 'fms301-applied-financial-modelling-and-simulation',
    title: 'Applied financial modelling and simulation',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/FMS301.webp',
    shortDescription: 'Building the SIMULATION engine for finance: distributions, Monte Carlo NPV, asset-price paths (GBM), portfolio VaR, option pricing, scenario/sensitivity & optimization, @RISK/Crystal Ball/Python.|||Dựng MÔ PHỎNG cho tài chính: phân phối, Monte Carlo cho NPV, mô phỏng giá tài sản (GBM), VaR danh mục, định giá quyền chọn, kịch bản/độ nhạy & tối ưu, công cụ @RISK/Crystal Ball/Python.',
    description: 'Môn <strong>FMS301 — Applied Financial Modelling and Simulation</strong> (khối Quản trị Kinh doanh, kỳ 7) tập trung vào <strong>MÔ PHỎNG</strong> (Monte Carlo, stochastic) — khác <strong>FIM302c</strong> (mô hình tất định cơ bản), <strong>FMR301</strong> (chính sách quản trị rủi ro) và <strong>FRM301</strong> (sổ rủi ro dự án). Từ <strong>biến ngẫu nhiên &amp; phân phối xác suất</strong> → <strong>Monte Carlo cho NPV</strong> (dòng tiền bất định) → <strong>mô phỏng giá tài sản</strong> (random walk, Geometric Brownian Motion) → <strong>VaR danh mục mô phỏng</strong> → <strong>định giá quyền chọn bằng Monte Carlo</strong> → <strong>kịch bản, độ nhạy &amp; tối ưu mô phỏng</strong> → <strong>công cụ</strong> (@RISK, Crystal Ball, Python) &amp; ứng dụng ra quyết định. Trích dẫn Benninga <em>Financial Modeling</em>, Glasserman <em>Monte Carlo Methods in Financial Engineering</em>, tài liệu @RISK/Crystal Ball. Song ngữ, ví dụ minh hoạ (số liệu giả định), quiz mỗi chương.',
    whatYouLearn: 'Biến ngẫu nhiên rời rạc/liên tục; phân phối Uniform/Normal/Triangular/Lognormal & sinh số ngẫu nhiên (inverse transform); mô phỏng Monte Carlo cho NPV (dòng tiền bất định, xác suất lỗ, phân vị); random walk & Geometric Brownian Motion cho giá tài sản; VaR tham số vs VaR mô phỏng cho danh mục tương quan; định giá quyền chọn bằng Monte Carlo (rủi ro-trung tính, quyền chọn phụ thuộc đường đi); phân tích kịch bản, biểu đồ tornado, tối ưu mô phỏng (RISKOptimizer/OptQuest); dựng mô hình bằng @RISK/Crystal Ball và Python (numpy/scipy).',
    requirements: 'Đã học FIM302c (mô hình tài chính cơ bản) hoặc tương đương; xác suất thống kê nền tảng; Excel; khuyến khích biết Python cơ bản (numpy).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách (Benninga, Glasserman), tài liệu @RISK/Crystal Ball, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Vì sao cần mô phỏng; khác FIM302c/FMR301/FRM301; lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan mô phỏng & biến ngẫu nhiên|||Chapter 1 — Simulation overview & random variables', description: 'Tất định vs mô phỏng, biến ngẫu nhiên, 5 bước nghiên cứu mô phỏng.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Phân phối xác suất & sinh số ngẫu nhiên|||Chapter 2 — Probability distributions & RNG', description: 'Uniform/Normal/Triangular/Lognormal, inverse transform, số lượt thử.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Monte Carlo cơ bản cho NPV|||Chapter 3 — Basic Monte Carlo simulation (NPV)', description: 'NPV với dòng tiền bất định, xác suất lỗ, phân vị.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Mô phỏng giá tài sản|||Chapter 4 — Asset price simulation', description: 'Random walk, Geometric Brownian Motion, đường đi giá.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Rủi ro danh mục & VaR mô phỏng|||Chapter 5 — Portfolio risk & simulated VaR', description: 'VaR tham số vs mô phỏng, tương quan, phân vị lỗ.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Định giá quyền chọn bằng Monte Carlo|||Chapter 6 — Option pricing via Monte Carlo', description: 'Payoff, drift rủi ro-trung tính, quyền chọn phụ thuộc đường đi.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Kịch bản, độ nhạy & tối ưu mô phỏng|||Chapter 7 — Scenario, sensitivity & simulation optimization', description: 'Tornado chart, RISKOptimizer/OptQuest.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Công cụ & ứng dụng ra quyết định|||Chapter 8 — Tools & decision-making applications', description: '@RISK, Crystal Ball, Python; bảng phân biệt 4 môn.', lessons: [c8, c8q] },
  ],
};
