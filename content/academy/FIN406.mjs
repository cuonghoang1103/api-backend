/**
 * FIN406 — Financial Risk Management. Giáo trình (trích dẫn, không upload PDF):
 * Jorion "Value at Risk"; Hull "Risk Management and Financial Institutions";
 * GARP FRM curriculum. 8 chương: tổng quan & phân loại rủi ro → rủi ro thị
 * trường & VaR → rủi ro tín dụng → rủi ro thanh khoản & vận hành → phòng ngừa
 * bằng phái sinh → rủi ro danh mục & đa dạng hoá → khung Basel → stress
 * testing/ERM. Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; số ví
 * dụ trong <pre><code> là GIẢ ĐỊNH, ký hiệu chữ Latin (VaR, SD, PD, LGD, EAD,
 * CAR, RWA, LCR, NSFR...).
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('fin406-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: Jorion, Hull, GARP FRM, BIS Basel, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">FIN406 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to study <strong>Financial Risk Management</strong> — market, credit, liquidity and operational risk, hedging, portfolio risk, Basel and ERM — in one place. The official FPTU slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal references used worldwide by risk professionals.</p>
<h3>📘 Core textbooks</h3>
<ul>
<li><a href="https://www.wiley.com/en-us/Value+at+Risk" target="_blank" rel="noopener">Philippe Jorion — <em>Value at Risk: The New Benchmark for Managing Financial Risk</em></a></li>
<li><a href="https://www.wiley.com/en-us/Risk+Management+and+Financial+Institutions" target="_blank" rel="noopener">John Hull — <em>Risk Management and Financial Institutions</em></a></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.garp.org/frm" target="_blank" rel="noopener">GARP — Financial Risk Manager (FRM) curriculum outline</a></li>
<li><a href="https://www.bis.org/bcbs/basel3.htm" target="_blank" rel="noopener">Bank for International Settlements — Basel III framework (official texts)</a></li>
<li><a href="https://www.investopedia.com/terms/v/var.asp" target="_blank" rel="noopener">Investopedia — Value at Risk (VaR) explained</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@wallstreetmojo" target="_blank" rel="noopener">WallStreetMojo</a> — risk management &amp; corporate finance explainers</li>
<li><a href="https://www.youtube.com/@FinanceTrainingCourse" target="_blank" rel="noopener">Finance Training Course</a> — VaR, derivatives &amp; risk modeling walkthroughs</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.investing.com/" target="_blank" rel="noopener">Investing.com</a> — live market data to build historical VaR datasets</li>
<li><a href="https://docs.google.com/spreadsheets" target="_blank" rel="noopener">Google Sheets</a> — enough to build VaR, hedge-ratio and portfolio models by hand</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — risk taxonomy, VaR (parametric/historical), PD-LGD-EAD, hedge ratio.</li>
<li><strong>Practice</strong> — compute VaR and a hedge ratio on a toy portfolio in a spreadsheet.</li>
<li><strong>Go deeper</strong> — Basel capital ratios, stress testing, ERM frameworks (COSO).</li>
<li><strong>Job-ready</strong> — read a bank's Pillar 3 disclosure and map it back to VaR/RWA/LCR.</li>
</ol></div>`,
    `<span class="eyebrow">FIN406 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Quản trị rủi ro tài chính</strong> — rủi ro thị trường, tín dụng, thanh khoản &amp; vận hành, phòng ngừa bằng phái sinh, rủi ro danh mục, Basel và ERM — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp mà dân quản trị rủi ro dùng khắp thế giới.</p>
<h3>📘 Sách nền tảng</h3>
<ul>
<li><a href="https://www.wiley.com/en-us/Value+at+Risk" target="_blank" rel="noopener">Philippe Jorion — <em>Value at Risk: The New Benchmark for Managing Financial Risk</em></a></li>
<li><a href="https://www.wiley.com/en-us/Risk+Management+and+Financial+Institutions" target="_blank" rel="noopener">John Hull — <em>Risk Management and Financial Institutions</em></a></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.garp.org/frm" target="_blank" rel="noopener">GARP — khung chương trình FRM (Financial Risk Manager)</a></li>
<li><a href="https://www.bis.org/bcbs/basel3.htm" target="_blank" rel="noopener">BIS — văn bản chính thức khung Basel III</a></li>
<li><a href="https://www.investopedia.com/terms/v/var.asp" target="_blank" rel="noopener">Investopedia — giải thích Value at Risk (VaR)</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@wallstreetmojo" target="_blank" rel="noopener">WallStreetMojo</a> — giảng quản trị rủi ro &amp; tài chính doanh nghiệp</li>
<li><a href="https://www.youtube.com/@FinanceTrainingCourse" target="_blank" rel="noopener">Finance Training Course</a> — VaR, phái sinh &amp; mô hình rủi ro</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.investing.com/" target="_blank" rel="noopener">Investing.com</a> — dữ liệu thị trường để dựng bộ VaR lịch sử</li>
<li><a href="https://docs.google.com/spreadsheets" target="_blank" rel="noopener">Google Sheets</a> — đủ để tự tính VaR, hedge ratio, mô hình danh mục</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — phân loại rủi ro, VaR (tham số/lịch sử), PD-LGD-EAD, hedge ratio.</li>
<li><strong>Luyện tập</strong> — tự tính VaR và hedge ratio trên một danh mục giả định bằng bảng tính.</li>
<li><strong>Đào sâu</strong> — tỉ lệ vốn Basel, stress testing, khung ERM (COSO).</li>
<li><strong>Sẵn sàng đi làm</strong> — đọc báo cáo Pillar 3 của một ngân hàng và đối chiếu với VaR/RWA/LCR.</li>
</ol></div>`,
  ]]);

const intro = doc('fin406-0-1-overview', 'Course overview: Financial Risk Management|||Tổng quan: Quản trị rủi ro tài chính',
  'Rủi ro là gì; vì sao quản trị rủi ro không phải loại bỏ rủi ro; lộ trình 8 chương: phân loại → VaR → tín dụng → thanh khoản/vận hành → phái sinh → danh mục → Basel → stress testing/ERM.',
  [[
    `<span class="eyebrow">FIN406 · Lesson 0.1 · Overview</span>
<h2>Financial Risk Management</h2>
<p class="lead">This course is about one question every finance professional must answer: <strong>how much can we lose, and how do we control it?</strong> You will learn to identify, measure, and manage the main risks facing a firm or bank — market, credit, liquidity, operational — and to use derivatives and capital frameworks to keep those risks inside an acceptable bound.</p>
<h3>Why risk management exists</h3>
<ul>
<li><strong>Risk</strong> — the chance that an outcome differs from what was expected, measured in money or in probability.</li>
<li><strong>Risk management</strong> is not the same as risk elimination — it is choosing which risks to keep, which to transfer, and how much capital or hedge to hold against the rest.</li>
<li>Nearly every major financial crisis (1998 LTCM, 2008 subprime, 2023 SVB) is, in hindsight, a risk-management failure — risk was mismeasured, hidden, or ignored.</li>
</ul>
<h3>Roadmap</h3>
<p>Risk taxonomy &amp; governance → market risk &amp; VaR → credit risk (PD/LGD/EAD) → liquidity &amp; operational risk → hedging with derivatives → portfolio risk &amp; diversification → Basel capital framework → stress testing &amp; enterprise risk management (ERM). Bilingual, with worked numerical examples (assumed figures) and a quiz per chapter.</p>`,
    `<span class="eyebrow">FIN406 · Bài 0.1 · Tổng quan</span>
<h2>Quản trị rủi ro tài chính</h2>
<p class="lead">Môn này xoay quanh một câu hỏi mà bất kỳ người làm tài chính nào cũng phải trả lời: <strong>có thể mất bao nhiêu, và kiểm soát nó bằng cách nào?</strong> Bạn sẽ học nhận diện, đo lường và quản trị các loại rủi ro chính mà doanh nghiệp hay ngân hàng đối mặt — thị trường, tín dụng, thanh khoản, vận hành — và dùng phái sinh cùng khung vốn để giữ rủi ro trong ngưỡng chấp nhận được.</p>
<h3>Vì sao có quản trị rủi ro</h3>
<ul>
<li><strong>Rủi ro</strong> — khả năng kết quả thực tế khác với kỳ vọng, đo bằng tiền hoặc xác suất.</li>
<li><strong>Quản trị rủi ro</strong> không đồng nghĩa loại bỏ rủi ro — đó là chọn giữ rủi ro nào, chuyển giao rủi ro nào, và giữ bao nhiêu vốn/hedge cho phần còn lại.</li>
<li>Gần như mọi cuộc khủng hoảng tài chính lớn (LTCM 1998, subprime 2008, SVB 2023) nhìn lại đều là một thất bại quản trị rủi ro — rủi ro bị đo sai, che giấu, hoặc bỏ qua.</li>
</ul>
<h3>Lộ trình</h3>
<p>Phân loại rủi ro &amp; quản trị điều hành → rủi ro thị trường &amp; VaR → rủi ro tín dụng (PD/LGD/EAD) → rủi ro thanh khoản &amp; vận hành → phòng ngừa bằng phái sinh → rủi ro danh mục &amp; đa dạng hoá → khung vốn Basel → stress testing &amp; quản trị rủi ro doanh nghiệp (ERM). Song ngữ, có ví dụ tính toán (số giả định) và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('fin406-1-1-overview-risk-types', '1.1 — Risk classification & risk management process|||1.1 — Phân loại rủi ro & quy trình quản trị',
  'Rủi ro thị trường/tín dụng/thanh khoản/vận hành; quy trình nhận diện-đo lường-kiểm soát-giám sát; risk appetite, ba lớp phòng vệ.',
  [[
    `<span class="eyebrow">FIN406 · Chapter 1 · Lesson 1.1</span>
<h2>Overview of financial risk management &amp; risk classification</h2>
<h3>What is financial risk?</h3>
<p><strong>Financial risk</strong> is the possibility of an adverse financial outcome — a loss in value, income, or capital — caused by uncertainty in markets, counterparties, or operations. The job of risk management is to <strong>identify → measure → control → monitor</strong> these exposures, not to avoid them entirely: a firm that takes zero risk also earns zero return.</p>
<h3>The five main risk types</h3>
<ul>
<li><strong>Market risk</strong> — loss from changes in prices: interest rates, FX rates, equity prices, commodity prices.</li>
<li><strong>Credit risk</strong> — loss when a borrower or counterparty fails to pay (default).</li>
<li><strong>Liquidity risk</strong> — inability to meet cash obligations, or to sell an asset without a large price concession.</li>
<li><strong>Operational risk</strong> — loss from failed people, processes, systems, or external events (fraud, IT outage, natural disaster).</li>
<li><strong>Other risks</strong> — legal/compliance risk, reputational risk, strategic risk — harder to quantify but still managed.</li>
</ul>
<h3>The risk management process</h3>
<pre><code>1. Identify   -- list what can go wrong and why
2. Measure    -- quantify exposure (VaR, PD, duration, ...)
3. Control    -- set limits, hedge, diversify, hold capital
4. Monitor    -- track exposure vs limits; report; escalate
</code></pre>
<h3>Risk appetite &amp; governance</h3>
<p>A board sets a firm's <strong>risk appetite</strong> — how much risk it is willing to accept in pursuit of return, usually expressed as limits (e.g. maximum daily VaR, maximum single-counterparty exposure). The <strong>three lines of defense</strong> model separates: (1) risk-taking business units, (2) an independent risk management &amp; compliance function, (3) internal audit.</p>
<div class="callout"><span class="badge">Key idea</span> Risk management is a trade-off, not a shield: the goal is to take the risks the firm is paid to take (e.g. credit risk at a bank) and to control or transfer the risks it is not paid to take (e.g. an unhedged FX exposure on a supply contract).</div>`,
    `<span class="eyebrow">FIN406 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan quản trị rủi ro tài chính &amp; phân loại rủi ro</h2>
<h3>Rủi ro tài chính là gì?</h3>
<p><strong>Rủi ro tài chính</strong> là khả năng xảy ra kết quả tài chính bất lợi — mất giá trị, thu nhập, hoặc vốn — do bất định từ thị trường, đối tác, hoặc vận hành. Việc của quản trị rủi ro là <strong>nhận diện → đo lường → kiểm soát → giám sát</strong> các mối lộ diện này, không phải né tránh hoàn toàn: một doanh nghiệp không nhận rủi ro nào cũng không có lợi nhuận nào.</p>
<h3>Năm loại rủi ro chính</h3>
<ul>
<li><strong>Rủi ro thị trường</strong> — mất mát do thay đổi giá: lãi suất, tỷ giá, giá cổ phiếu, giá hàng hoá.</li>
<li><strong>Rủi ro tín dụng</strong> — mất mát khi bên vay hoặc đối tác không thanh toán (vỡ nợ).</li>
<li><strong>Rủi ro thanh khoản</strong> — không đủ khả năng đáp ứng nghĩa vụ tiền mặt, hoặc phải bán tài sản với mức giảm giá lớn.</li>
<li><strong>Rủi ro vận hành</strong> — mất mát do con người, quy trình, hệ thống thất bại, hoặc sự cố ngoại cảnh (gian lận, sập hệ thống IT, thiên tai).</li>
<li><strong>Rủi ro khác</strong> — rủi ro pháp lý/tuân thủ, rủi ro danh tiếng, rủi ro chiến lược — khó định lượng hơn nhưng vẫn được quản trị.</li>
</ul>
<h3>Quy trình quản trị rủi ro</h3>
<pre><code>1. Nhận diện  -- liệt kê điều gì có thể sai và vì sao
2. Đo lường   -- định lượng mức lộ diện (VaR, PD, duration...)
3. Kiểm soát  -- đặt hạn mức, hedge, đa dạng hoá, giữ vốn
4. Giám sát   -- theo dõi so với hạn mức; báo cáo; leo thang
</code></pre>
<h3>Khẩu vị rủi ro &amp; quản trị điều hành</h3>
<p>Hội đồng quản trị đặt <strong>khẩu vị rủi ro (risk appetite)</strong> — mức rủi ro doanh nghiệp sẵn sàng chấp nhận để đổi lấy lợi nhuận, thường thể hiện bằng hạn mức (vd VaR tối đa mỗi ngày, mức lộ diện tối đa với một đối tác). Mô hình <strong>ba lớp phòng vệ</strong> tách biệt: (1) đơn vị kinh doanh chịu rủi ro, (2) bộ phận quản trị rủi ro &amp; tuân thủ độc lập, (3) kiểm toán nội bộ.</p>
<div class="callout"><span class="badge">Ý chính</span> Quản trị rủi ro là một sự đánh đổi, không phải cái khiên: mục tiêu là nhận đúng loại rủi ro mà doanh nghiệp được trả tiền để nhận (vd rủi ro tín dụng ở ngân hàng) và kiểm soát hoặc chuyển giao loại rủi ro không được trả tiền để nhận (vd rủi ro tỷ giá chưa phòng ngừa trên hợp đồng cung ứng).</div>`,
  ]]);

const c1q = quiz('fin406-quiz-1', 'Quiz 1 — Overview & risk types|||Quiz 1 — Tổng quan & phân loại rủi ro', [
  { id: 'q1', question: 'Rủi ro thị trường là loại mất mát nào?', options: ['Do bên vay không trả nợ', 'Do thay đổi giá (lãi suất, tỷ giá, cổ phiếu, hàng hoá)', 'Do hệ thống IT sập', 'Do thiếu tiền mặt trả nợ đến hạn'], correctIndex: 1, explanation: 'Rủi ro thị trường phát sinh từ biến động giá trên thị trường, khác rủi ro tín dụng (vỡ nợ) hay vận hành (hệ thống/con người).' },
  { id: 'q2', question: 'Mô hình "ba lớp phòng vệ" (three lines of defense) gồm những gì?', options: ['Ba loại rủi ro thị trường', 'Đơn vị kinh doanh; quản trị rủi ro & tuân thủ độc lập; kiểm toán nội bộ', 'Ba ngưỡng VaR khác nhau', 'Ba loại vốn Tier 1/2/3'], correctIndex: 1, explanation: 'Ba lớp phòng vệ tách biệt bên chịu rủi ro, bên giám sát độc lập, và kiểm toán nội bộ.' },
  { id: 'q3', question: 'Mục tiêu của quản trị rủi ro là gì?', options: ['Loại bỏ hoàn toàn mọi rủi ro', 'Chọn giữ/chuyển giao rủi ro và kiểm soát trong ngưỡng chấp nhận', 'Chỉ tập trung vào rủi ro vận hành', 'Tối đa hoá VaR mỗi ngày'], correctIndex: 1, explanation: 'Rủi ro bằng 0 cũng có nghĩa lợi nhuận bằng 0; quản trị rủi ro là đánh đổi có chủ đích, không phải né tránh tuyệt đối.' },
]);

const c2 = doc('fin406-2-1-market-risk-var', '2.1 — Measuring market risk & Value at Risk (VaR)|||2.1 — Đo lường rủi ro thị trường & Value at Risk (VaR)',
  'VaR tham số/lịch sử/Monte Carlo; ví dụ tính VaR 1 ngày 99%; Expected Shortfall và điểm mù của VaR.',
  [[
    `<span class="eyebrow">FIN406 · Chapter 2 · Lesson 2.1</span>
<h2>Measuring market risk &amp; Value at Risk (VaR)</h2>
<h3>What VaR answers</h3>
<p><strong>Value at Risk (VaR)</strong> answers one question: "Over the next t days, at confidence level c, what is the maximum loss we do not expect to exceed?" It compresses an entire distribution of possible portfolio outcomes into a single number.</p>
<h3>Three ways to compute VaR</h3>
<ul>
<li><strong>Parametric (variance-covariance)</strong> — assumes returns are normally distributed: <code>VaR = z × SD × V × sqrt(t)</code>, where z is the confidence z-score (1.65 for 95%, 2.33 for 99%), SD is the daily return standard deviation, V is portfolio value, t is the holding period in days.</li>
<li><strong>Historical simulation</strong> — replay actual past daily returns onto today's portfolio, sort the outcomes, and read off the loss at the desired percentile. No normality assumption.</li>
<li><strong>Monte Carlo simulation</strong> — simulate thousands of random future price paths from an assumed model, and read the loss percentile off the simulated distribution.</li>
</ul>
<pre><code>Example (assumed figures, parametric VaR):
 Portfolio value V = 10,000,000,000 VND
 Daily return SD    = 1.2%
 Confidence 99% -- z = 2.33
 Holding period t    = 1 day

 1-day 99% VaR = 2.33 x 1.2% x 10,000,000,000
              = 279,600,000 VND

 Reading: we do not expect to lose more than about
 279.6 million VND in one day, 99% of the time.
</code></pre>
<h3>VaR's blind spot: Expected Shortfall</h3>
<p>VaR says nothing about how bad the loss is in the worst 1% of cases (the tail). <strong>Expected Shortfall (ES)</strong>, also called Conditional VaR, is the average loss <em>given that</em> the loss already exceeds the VaR threshold — it is the metric Basel now requires for market-risk capital precisely because it captures tail severity, not just a cutoff.</p>
<div class="callout"><span class="badge">Limits of VaR</span> VaR is a threshold, not a worst case — a portfolio can be constructed to have a low VaR while carrying a catastrophic 1%-probability tail (this is exactly what happened to several funds before 2008). Backtesting (comparing predicted VaR breaches to actual breaches) is required to keep a model honest.</div>`,
    `<span class="eyebrow">FIN406 · Chương 2 · Bài 2.1</span>
<h2>Đo lường rủi ro thị trường &amp; Value at Risk (VaR)</h2>
<h3>VaR trả lời câu hỏi gì</h3>
<p><strong>Value at Risk (VaR)</strong> trả lời một câu hỏi: "Trong t ngày tới, với độ tin cậy c, mức lỗ tối đa mà ta không kỳ vọng vượt qua là bao nhiêu?" VaR nén toàn bộ phân phối các kết quả có thể của danh mục thành một con số duy nhất.</p>
<h3>Ba cách tính VaR</h3>
<ul>
<li><strong>Tham số (variance-covariance)</strong> — giả định lợi suất phân phối chuẩn: <code>VaR = z × SD × V × sqrt(t)</code>, với z là z-score theo độ tin cậy (1.65 cho 95%, 2.33 cho 99%), SD là độ lệch chuẩn lợi suất ngày, V là giá trị danh mục, t là số ngày nắm giữ.</li>
<li><strong>Mô phỏng lịch sử (historical simulation)</strong> — chạy lại lợi suất thực trong quá khứ lên danh mục hiện tại, sắp xếp kết quả, và đọc mức lỗ tại phân vị mong muốn. Không giả định phân phối chuẩn.</li>
<li><strong>Mô phỏng Monte Carlo</strong> — mô phỏng hàng nghìn đường giá tương lai ngẫu nhiên từ một mô hình giả định, rồi đọc phân vị lỗ từ phân phối mô phỏng.</li>
</ul>
<pre><code>Ví dụ (số giả định, VaR tham số):
 Giá trị danh mục V = 10.000.000.000 VND
 Độ lệch chuẩn lợi suất ngày SD = 1,2%
 Độ tin cậy 99% -- z = 2,33
 Kỳ nắm giữ t = 1 ngày

 VaR 1 ngày, 99% = 2,33 x 1,2% x 10.000.000.000
                = 279.600.000 VND

 Đọc kết quả: không kỳ vọng lỗ quá khoảng
 279,6 triệu VND trong một ngày, với xác suất 99%.
</code></pre>
<h3>Điểm mù của VaR: Expected Shortfall</h3>
<p>VaR không nói gì về mức lỗ tệ tới đâu trong 1% trường hợp xấu nhất (phần đuôi). <strong>Expected Shortfall (ES)</strong>, còn gọi Conditional VaR, là mức lỗ trung bình <em>với điều kiện</em> lỗ đã vượt ngưỡng VaR — đây là chỉ số Basel hiện yêu cầu cho vốn rủi ro thị trường vì nó nắm bắt mức độ nghiêm trọng của phần đuôi, không chỉ một ngưỡng cắt.</p>
<div class="callout"><span class="badge">Giới hạn của VaR</span> VaR là một ngưỡng, không phải trường hợp xấu nhất — một danh mục có thể được dựng để có VaR thấp mà vẫn mang phần đuôi 1% thảm khốc (đây chính xác là điều xảy ra với nhiều quỹ trước 2008). Backtesting (so lần vi phạm VaR dự báo với thực tế) là bắt buộc để giữ mô hình trung thực.</div>`,
  ]]);

const c2q = quiz('fin406-quiz-2', 'Quiz 2 — Market risk & VaR|||Quiz 2 — Rủi ro thị trường & VaR', [
  { id: 'q1', question: 'VaR trả lời câu hỏi nào?', options: ['Doanh thu kỳ vọng là bao nhiêu', 'Mức lỗ tối đa không kỳ vọng vượt qua ở một độ tin cậy, trong t ngày', 'Xác suất vỡ nợ của bên vay', 'Tỉ lệ vốn an toàn của ngân hàng'], correctIndex: 1, explanation: 'VaR nén phân phối kết quả danh mục thành một ngưỡng lỗ tối đa ở độ tin cậy cho trước.' },
  { id: 'q2', question: 'Công thức VaR tham số dùng những biến nào?', options: ['PD, LGD, EAD', 'z, SD, V, t', 'CAR, RWA', 'w, corr'], correctIndex: 1, explanation: 'VaR tham số = z (z-score theo độ tin cậy) x SD (độ lệch chuẩn) x V (giá trị danh mục) x sqrt(t).' },
  { id: 'q3', question: 'Expected Shortfall (ES) khác VaR ở điểm nào?', options: ['ES chỉ dùng cho rủi ro tín dụng', 'ES đo mức lỗ trung bình trong phần đuôi vượt ngưỡng VaR', 'ES luôn nhỏ hơn VaR', 'ES không cần độ tin cậy'], correctIndex: 1, explanation: 'ES (Conditional VaR) là lỗ trung bình khi lỗ đã vượt ngưỡng VaR, nắm bắt mức độ nghiêm trọng của phần đuôi.' },
]);

const c3 = doc('fin406-3-1-credit-risk', '3.1 — Credit risk & measurement models|||3.1 — Rủi ro tín dụng & mô hình đo lường',
  'PD/LGD/EAD, Expected Loss, rủi ro tập trung, credit scoring, expected vs unexpected loss.',
  [[
    `<span class="eyebrow">FIN406 · Chapter 3 · Lesson 3.1</span>
<h2>Credit risk &amp; measurement models</h2>
<h3>What credit risk is</h3>
<p><strong>Credit risk</strong> is the risk that a borrower, bond issuer, or trading counterparty fails to meet its contractual obligation. It is the largest risk type on a typical commercial bank's balance sheet.</p>
<h3>The three building blocks: PD, LGD, EAD</h3>
<ul>
<li><strong>PD (Probability of Default)</strong> — the likelihood the borrower defaults within a given horizon (usually 1 year), estimated from credit ratings, financial ratios, or statistical models (e.g. logistic regression, Altman Z-score).</li>
<li><strong>LGD (Loss Given Default)</strong> — the fraction of exposure not recovered after default, after collateral and recovery efforts (e.g. LGD = 45% means 55% is typically recovered).</li>
<li><strong>EAD (Exposure At Default)</strong> — the expected amount outstanding at the moment of default (for a loan, roughly the drawn balance; for a credit line, drawn plus a likely further draw-down).</li>
</ul>
<pre><code>Expected Loss:  EL = PD x LGD x EAD

Example (assumed figures):
 PD = 2%,  LGD = 45%,  EAD = 1,000,000,000 VND
 EL = 0.02 x 0.45 x 1,000,000,000 = 9,000,000 VND

 Reading: on average, this loan is expected to cost
 the bank 9 million VND per year in credit losses.
</code></pre>
<h3>Concentration &amp; credit scoring</h3>
<p><strong>Concentration risk</strong> arises when exposure is not diversified — too much lent to one borrower, sector, or region; a single default (or one sector-wide shock) then causes outsized loss. Banks manage it with single-counterparty and sector exposure limits. <strong>Credit scoring/rating</strong> (internal or agency, e.g. AAA-to-D) converts qualitative and financial information into a PD estimate used for both pricing and capital.</p>
<div class="callout"><span class="badge">Expected vs unexpected loss</span> EL (the average) is priced into interest margins and covered by loan-loss provisions; the <em>volatility</em> around EL — unexpected loss — is what regulatory capital exists to absorb, because a bad year can produce losses far above the average.</div>`,
    `<span class="eyebrow">FIN406 · Chương 3 · Bài 3.1</span>
<h2>Rủi ro tín dụng &amp; mô hình đo lường</h2>
<h3>Rủi ro tín dụng là gì</h3>
<p><strong>Rủi ro tín dụng</strong> là rủi ro bên vay, tổ chức phát hành trái phiếu, hoặc đối tác giao dịch không thực hiện được nghĩa vụ hợp đồng. Đây là loại rủi ro lớn nhất trên bảng cân đối của một ngân hàng thương mại thông thường.</p>
<h3>Ba khối xây dựng: PD, LGD, EAD</h3>
<ul>
<li><strong>PD (Probability of Default — xác suất vỡ nợ)</strong> — khả năng bên vay vỡ nợ trong một khoảng thời gian cho trước (thường 1 năm), ước lượng từ xếp hạng tín dụng, chỉ số tài chính, hoặc mô hình thống kê (vd hồi quy logistic, Altman Z-score).</li>
<li><strong>LGD (Loss Given Default — tỉ lệ mất khi vỡ nợ)</strong> — phần lộ diện không thu hồi được sau khi vỡ nợ, sau khi xử lý tài sản đảm bảo và thu hồi (vd LGD = 45% nghĩa là thường thu hồi được 55%).</li>
<li><strong>EAD (Exposure At Default — lộ diện tại thời điểm vỡ nợ)</strong> — số dư dự kiến tại thời điểm vỡ nợ (với khoản vay, xấp xỉ dư nợ đã giải ngân; với hạn mức tín dụng, dư nợ hiện tại cộng phần khả năng rút thêm).</li>
</ul>
<pre><code>Tổn thất kỳ vọng:  EL = PD x LGD x EAD

Ví dụ (số giả định):
 PD = 2%,  LGD = 45%,  EAD = 1.000.000.000 VND
 EL = 0,02 x 0,45 x 1.000.000.000 = 9.000.000 VND

 Đọc kết quả: trung bình, khoản vay này dự kiến gây
 tổn thất tín dụng 9 triệu VND mỗi năm cho ngân hàng.
</code></pre>
<h3>Rủi ro tập trung &amp; xếp hạng tín dụng</h3>
<p><strong>Rủi ro tập trung (concentration risk)</strong> phát sinh khi lộ diện không được đa dạng hoá — cho vay quá nhiều vào một bên vay, ngành, hoặc khu vực; một vụ vỡ nợ đơn lẻ (hoặc một cú sốc toàn ngành) gây tổn thất quá lớn. Ngân hàng kiểm soát bằng hạn mức lộ diện theo đối tác đơn lẻ và theo ngành. <strong>Chấm điểm/xếp hạng tín dụng (credit scoring/rating)</strong> (nội bộ hoặc từ tổ chức xếp hạng, vd AAA đến D) chuyển thông tin định tính và tài chính thành ước lượng PD, dùng cho cả định giá và tính vốn.</p>
<div class="callout"><span class="badge">Tổn thất kỳ vọng vs bất định</span> EL (giá trị trung bình) được đưa vào biên lãi suất và bù đắp bằng dự phòng nợ xấu; <em>độ dao động</em> quanh EL — tổn thất bất định (unexpected loss) — là thứ mà vốn quy định tồn tại để hấp thụ, vì một năm xấu có thể gây tổn thất vượt xa mức trung bình.</div>`,
  ]]);

const c3q = quiz('fin406-quiz-3', 'Quiz 3 — Credit risk|||Quiz 3 — Rủi ro tín dụng', [
  { id: 'q1', question: 'Công thức Expected Loss (EL) dùng ba biến nào?', options: ['VaR, SD, V', 'PD, LGD, EAD', 'CAR, RWA, Tier 1', 'w, r, corr'], correctIndex: 1, explanation: 'EL = PD (xác suất vỡ nợ) x LGD (tỉ lệ mất khi vỡ nợ) x EAD (lộ diện tại thời điểm vỡ nợ).' },
  { id: 'q2', question: 'LGD (Loss Given Default) là gì?', options: ['Xác suất bên vay vỡ nợ', 'Phần lộ diện không thu hồi được sau khi vỡ nợ', 'Số dư dự kiến tại thời điểm vỡ nợ', 'Xếp hạng tín dụng của bên vay'], correctIndex: 1, explanation: 'LGD là tỉ lệ tổn thất thực tế sau khi trừ phần thu hồi được từ tài sản đảm bảo/xử lý nợ.' },
  { id: 'q3', question: 'Rủi ro tập trung (concentration risk) xảy ra khi nào?', options: ['Khi lộ diện được chia đều nhiều bên vay/ngành', 'Khi cho vay quá nhiều vào một bên vay, ngành hoặc khu vực', 'Khi PD bằng 0', 'Khi LGD bằng 100%'], correctIndex: 1, explanation: 'Thiếu đa dạng hoá khiến một cú sốc đơn lẻ (một bên vay hoặc một ngành) gây tổn thất quá lớn.' },
]);

const c4 = doc('fin406-4-1-liquidity-operational-risk', '4.1 — Liquidity risk & operational risk|||4.1 — Rủi ro thanh khoản & rủi ro vận hành',
  'Funding vs market liquidity risk, LCR, buffer thanh khoản, rủi ro vận hành và KRI.',
  [[
    `<span class="eyebrow">FIN406 · Chapter 4 · Lesson 4.1</span>
<h2>Liquidity risk &amp; operational risk</h2>
<h3>Two faces of liquidity risk</h3>
<ul>
<li><strong>Funding liquidity risk</strong> — the firm cannot meet its cash obligations as they fall due (e.g. depositors withdraw faster than the bank can raise cash) — this is what kills a bank in days, even if it is solvent on paper.</li>
<li><strong>Market (asset) liquidity risk</strong> — the firm can only sell an asset at a large discount to its "fair" value because the market for it is thin (wide bid-ask spread, few buyers).</li>
</ul>
<h3>Measuring &amp; managing liquidity</h3>
<pre><code>Liquidity Coverage Ratio (LCR):
 LCR = High-Quality Liquid Assets / Net Cash Outflow (30 days) &gt;= 100%

Example (assumed figures):
 HQLA = 500,000,000,000 VND
 Net cash outflow (30-day stress) = 420,000,000,000 VND
 LCR = 500 / 420 = 119%   -- passes the 100% minimum
</code></pre>
<p>Firms also build a <strong>liquidity buffer</strong> (cash + assets sellable within a day) and a <strong>contingency funding plan</strong> for a stress scenario (deposit run, credit line drawdowns, collateral calls).</p>
<h3>Operational risk</h3>
<p><strong>Operational risk</strong> is loss from failed internal processes, people, systems, or external events — fraud, a coding error that mis-books trades, a data-center outage, a cyberattack, a natural disaster interrupting operations. Unlike market or credit risk, it has no upside — only downside — and it is managed through internal controls, a loss-event database, key risk indicators (KRIs), and business-continuity planning.</p>
<div class="callout"><span class="badge">Why liquidity kills fast</span> A bank can survive being technically insolvent for a while if it can still borrow; it cannot survive even one day of being unable to pay depositors. Liquidity risk is why bank runs, not credit losses alone, are usually the proximate cause of a bank's failure.</div>`,
    `<span class="eyebrow">FIN406 · Chương 4 · Bài 4.1</span>
<h2>Rủi ro thanh khoản &amp; rủi ro vận hành</h2>
<h3>Hai mặt của rủi ro thanh khoản</h3>
<ul>
<li><strong>Rủi ro thanh khoản tài trợ (funding liquidity risk)</strong> — doanh nghiệp không đáp ứng được nghĩa vụ tiền mặt khi đến hạn (vd người gửi rút tiền nhanh hơn ngân hàng huy động được) — đây là điều giết một ngân hàng trong vài ngày, dù trên giấy vẫn còn khả năng thanh toán.</li>
<li><strong>Rủi ro thanh khoản thị trường (market/asset liquidity risk)</strong> — doanh nghiệp chỉ có thể bán một tài sản với mức giảm giá lớn so với giá trị "hợp lý" vì thị trường của nó mỏng (chênh lệch mua-bán rộng, ít người mua).</li>
</ul>
<h3>Đo lường &amp; quản trị thanh khoản</h3>
<pre><code>Tỉ lệ đảm bảo thanh khoản (LCR):
 LCR = Tài sản thanh khoản chất lượng cao / Dòng ra ròng (30 ngày) &gt;= 100%

Ví dụ (số giả định):
 HQLA = 500.000.000.000 VND
 Dòng ra ròng (căng thẳng 30 ngày) = 420.000.000.000 VND
 LCR = 500 / 420 = 119%   -- vượt mức tối thiểu 100%
</code></pre>
<p>Doanh nghiệp cũng xây <strong>bộ đệm thanh khoản</strong> (tiền mặt + tài sản bán được trong một ngày) và <strong>kế hoạch tài trợ dự phòng</strong> cho kịch bản căng thẳng (rút tiền hàng loạt, rút hạn mức tín dụng, yêu cầu bổ sung tài sản đảm bảo).</p>
<h3>Rủi ro vận hành</h3>
<p><strong>Rủi ro vận hành</strong> là mất mát do quy trình nội bộ, con người, hệ thống thất bại, hoặc sự cố ngoại cảnh — gian lận, lỗi mã hoá ghi sai giao dịch, sập trung tâm dữ liệu, tấn công mạng, thiên tai làm ngưng vận hành. Khác rủi ro thị trường hay tín dụng, nó không có mặt lợi — chỉ có mặt lỗ — và được quản trị qua kiểm soát nội bộ, cơ sở dữ liệu sự cố tổn thất, chỉ số rủi ro chính (KRI), và kế hoạch duy trì hoạt động.</p>
<div class="callout"><span class="badge">Vì sao thanh khoản giết nhanh</span> Một ngân hàng có thể sống sót một thời gian dù về kỹ thuật đã mất khả năng thanh toán, nếu vẫn vay được; nhưng không thể sống sót dù chỉ một ngày không trả được tiền cho người gửi. Rủi ro thanh khoản là lý do sự cố rút tiền hàng loạt, không chỉ tổn thất tín dụng, thường là nguyên nhân trực tiếp khiến ngân hàng sụp đổ.</div>`,
  ]]);

const c4q = quiz('fin406-quiz-4', 'Quiz 4 — Liquidity & operational risk|||Quiz 4 — Rủi ro thanh khoản & vận hành', [
  { id: 'q1', question: 'LCR (Liquidity Coverage Ratio) đo điều gì?', options: ['Tỉ lệ vốn trên tài sản rủi ro', 'Tài sản thanh khoản chất lượng cao trên dòng ra ròng 30 ngày', 'Xác suất vỡ nợ', 'Độ lệch chuẩn lợi suất'], correctIndex: 1, explanation: 'LCR kiểm tra khả năng sống sót 30 ngày dưới căng thẳng thanh khoản.' },
  { id: 'q2', question: 'Rủi ro thanh khoản thị trường (market/asset liquidity risk) là gì?', options: ['Không trả được nợ đến hạn', 'Chỉ bán được tài sản với mức giảm giá lớn vì thị trường mỏng', 'Bên vay vỡ nợ', 'Hệ thống IT bị tấn công'], correctIndex: 1, explanation: 'Đây là rủi ro về khả năng thanh khoản của TÀI SẢN trên thị trường, khác với rủi ro thanh khoản tài trợ.' },
  { id: 'q3', question: 'Rủi ro vận hành khác rủi ro thị trường/tín dụng ở điểm nào?', options: ['Luôn có mặt lợi và mặt lỗ như nhau', 'Chỉ có mặt lỗ, không có mặt lợi', 'Không thể quản trị được', 'Chỉ xảy ra ở ngân hàng'], correctIndex: 1, explanation: 'Không giống rủi ro thị trường/tín dụng (có thể sinh lời), rủi ro vận hành chỉ mang lại tổn thất khi xảy ra.' },
]);

const c5 = doc('fin406-5-1-hedging-derivatives', '5.1 — Hedging risk with derivatives|||5.1 — Phòng ngừa rủi ro bằng phái sinh',
  'Forward/future/option/swap; hedge ratio; rủi ro cơ sở; hedging khác speculation.',
  [[
    `<span class="eyebrow">FIN406 · Chapter 5 · Lesson 5.1</span>
<h2>Hedging risk with derivatives</h2>
<h3>The idea of a hedge</h3>
<p>A <strong>hedge</strong> takes an offsetting position so that a loss on the original (underlying) exposure is compensated by a gain on the hedge, reducing net exposure — at the cost of also giving up some potential upside. The four core instruments are <strong>forwards, futures, options, and swaps</strong>.</p>
<h3>Four instruments, four uses</h3>
<ul>
<li><strong>Forward</strong> — an OTC contract to buy/sell an asset at a fixed price F on a future date; locks in the price, customizable, but carries counterparty risk.</li>
<li><strong>Futures</strong> — an exchange-traded, standardized forward with daily margining, which removes most counterparty risk.</li>
<li><strong>Option</strong> — the right (not obligation) to buy (call) or sell (put) at a strike price K, for a premium; caps the downside while keeping upside, unlike a forward/future.</li>
<li><strong>Swap</strong> — an exchange of cash-flow streams (e.g. fixed-rate for floating-rate interest) between two counterparties, used mainly to hedge interest-rate or currency risk over a longer term.</li>
</ul>
<h3>Sizing a hedge: the hedge ratio</h3>
<pre><code>Hedge ratio: h = (SD of spot / SD of futures) x corr(spot, futures)

Example (assumed figures):
 Exposure to hedge = 1,000,000 USD of commodity
 SD(spot) = 8%, SD(futures) = 10%, corr = 0.9
 h = (8 / 10) x 0.9 = 0.72

 Reading: hedge about 72% of the exposure with futures
 (a full 1-for-1 hedge would over- or under-hedge here).
</code></pre>
<h3>Basis risk</h3>
<p><strong>Basis risk</strong> is the risk that the hedge instrument does not move in exact lock-step with the underlying exposure (different asset, different maturity, different location) — a hedge is rarely perfect, and this residual mismatch is what the hedge ratio above tries to minimize, not eliminate.</p>
<div class="callout"><span class="badge">Hedging is not speculation</span> A hedge is entered to offset an existing exposure the firm already has (e.g. an exporter hedging FX revenue); the same instrument (a forward, an option) used without an underlying exposure to bet on price direction is speculation, not hedging — same tool, opposite intent.</div>`,
    `<span class="eyebrow">FIN406 · Chương 5 · Bài 5.1</span>
<h2>Phòng ngừa rủi ro bằng phái sinh</h2>
<h3>Ý tưởng của một hedge</h3>
<p>Một <strong>hedge (phòng ngừa)</strong> mở một vị thế đối ứng sao cho khoản lỗ trên lộ diện gốc (underlying) được bù đắp bằng khoản lãi trên hedge, giảm lộ diện thuần — đổi lại là mất một phần khả năng lãi thêm. Bốn công cụ nền tảng là <strong>forward, future, option, và swap</strong>.</p>
<h3>Bốn công cụ, bốn cách dùng</h3>
<ul>
<li><strong>Forward</strong> — hợp đồng OTC mua/bán tài sản ở giá cố định F vào một ngày trong tương lai; khoá giá, tuỳ biến được, nhưng mang rủi ro đối tác.</li>
<li><strong>Future</strong> — một forward được chuẩn hoá, giao dịch trên sàn, ký quỹ hàng ngày, loại bỏ hầu hết rủi ro đối tác.</li>
<li><strong>Option (quyền chọn)</strong> — quyền (không phải nghĩa vụ) mua (call) hoặc bán (put) ở giá thực hiện K, đổi lấy phí quyền chọn; giới hạn mức lỗ mà vẫn giữ khả năng lãi, khác forward/future.</li>
<li><strong>Swap (hoán đổi)</strong> — trao đổi các dòng tiền (vd lãi suất cố định đổi lãi suất thả nổi) giữa hai đối tác, dùng chủ yếu để phòng ngừa rủi ro lãi suất hoặc tỷ giá trong thời gian dài.</li>
</ul>
<h3>Định lượng hedge: hedge ratio</h3>
<pre><code>Hệ số phòng ngừa: h = (SD giao ngay / SD hợp đồng future) x corr(giao ngay, future)

Ví dụ (số giả định):
 Lộ diện cần phòng ngừa = 1.000.000 USD hàng hoá
 SD(giao ngay) = 8%, SD(future) = 10%, corr = 0,9
 h = (8 / 10) x 0,9 = 0,72

 Đọc kết quả: phòng ngừa khoảng 72% lộ diện bằng future
 (hedge 1-đổi-1 toàn phần sẽ thừa hoặc thiếu ở đây).
</code></pre>
<h3>Rủi ro cơ sở (basis risk)</h3>
<p><strong>Rủi ro cơ sở</strong> là rủi ro công cụ hedge không di chuyển đồng bộ tuyệt đối với lộ diện gốc (tài sản khác, kỳ hạn khác, địa điểm khác) — một hedge hiếm khi hoàn hảo, và phần lệch còn lại này là điều hedge ratio ở trên cố gắng giảm thiểu, không loại bỏ hoàn toàn.</p>
<div class="callout"><span class="badge">Hedging không phải đầu cơ</span> Một hedge được mở để bù đắp một lộ diện đã có sẵn của doanh nghiệp (vd nhà xuất khẩu phòng ngừa doanh thu ngoại tệ); cùng công cụ đó (forward, option) dùng KHÔNG có lộ diện gốc để cược vào chiều biến động giá là đầu cơ, không phải phòng ngừa — cùng công cụ, mục đích ngược nhau.</div>`,
  ]]);

const c5q = quiz('fin406-quiz-5', 'Quiz 5 — Hedging with derivatives|||Quiz 5 — Phòng ngừa bằng phái sinh', [
  { id: 'q1', question: 'Bốn công cụ phái sinh cơ bản dùng để phòng ngừa rủi ro là gì?', options: ['Cổ phiếu, trái phiếu, tiền gửi, vàng', 'Forward, future, option, swap', 'VaR, PD, LGD, EAD', 'CAR, RWA, LCR, NSFR'], correctIndex: 1, explanation: 'Bốn công cụ phái sinh nền tảng: forward, future, option, swap.' },
  { id: 'q2', question: 'Option khác forward/future ở điểm nào?', options: ['Option là nghĩa vụ bắt buộc mua/bán', 'Option là quyền (không phải nghĩa vụ), giới hạn mức lỗ mà giữ khả năng lãi', 'Option không có phí quyền chọn', 'Option chỉ dùng cho lãi suất'], correctIndex: 1, explanation: 'Người mua option chỉ thực hiện quyền khi có lợi; forward/future là nghĩa vụ bắt buộc cả hai chiều.' },
  { id: 'q3', question: 'Rủi ro cơ sở (basis risk) là gì?', options: ['Rủi ro đối tác không thanh toán margin', 'Rủi ro công cụ hedge không di chuyển đồng bộ tuyệt đối với lộ diện gốc', 'Rủi ro giá quyền chọn bằng 0', 'Rủi ro swap không có kỳ hạn'], correctIndex: 1, explanation: 'Basis risk là phần lệch còn lại giữa hedge và lộ diện gốc do khác tài sản/kỳ hạn/địa điểm.' },
]);

const c6 = doc('fin406-6-1-portfolio-diversification', '6.1 — Portfolio risk management & diversification|||6.1 — Quản trị rủi ro danh mục & đa dạng hoá',
  'Rủi ro danh mục hai tài sản, tương quan, rủi ro hệ thống vs riêng lẻ, Sharpe ratio.',
  [[
    `<span class="eyebrow">FIN406 · Chapter 6 · Lesson 6.1</span>
<h2>Portfolio risk management &amp; diversification</h2>
<h3>Why diversification works</h3>
<p>Combining assets whose returns do not move in perfect lock-step reduces portfolio risk below the weighted-average risk of the individual assets — this is <strong>diversification</strong>, and it works because of imperfect <strong>correlation</strong> between returns, not because any single asset became less risky.</p>
<h3>Two-asset portfolio risk</h3>
<pre><code>Portfolio variance (two assets A, B, weights wA, wB):
 Var(P) = wA^2 x SDA^2 + wB^2 x SDB^2
         + 2 x wA x wB x SDA x SDB x corr(A,B)

Example (assumed figures):
 wA = 0.6, SDA = 20%;  wB = 0.4, SDB = 15%;  corr(A,B) = 0.3
 Var(P) = 0.6^2 x 0.20^2 + 0.4^2 x 0.15^2
         + 2 x 0.6 x 0.4 x 0.20 x 0.15 x 0.3
        = 0.0144 + 0.0036 + 0.00432 = 0.02232
 SD(P) = sqrt(0.02232) = 14.9%

 Reading: 14.9% is LESS than the weighted average
 (0.6 x 20% + 0.4 x 15% = 18%) -- diversification benefit.
</code></pre>
<h3>Systematic vs unsystematic risk</h3>
<ul>
<li><strong>Unsystematic (idiosyncratic) risk</strong> — specific to one firm or sector; can be reduced, in theory toward zero, by adding more uncorrelated assets.</li>
<li><strong>Systematic (market) risk</strong> — affects the whole market (recession, rate shock); cannot be diversified away, and is what beta (b) in the CAPM measures the sensitivity to.</li>
</ul>
<h3>Risk-adjusted return: the Sharpe ratio</h3>
<pre><code>Sharpe ratio: S = (r - rf) / SD

Example: r = 12%, rf = 4%, SD = 16%
 S = (12 - 4) / 16 = 0.5
</code></pre>
<div class="callout"><span class="badge">Key idea</span> A higher raw return is not automatically better — the Sharpe ratio compares return per unit of risk taken, which is why a portfolio manager's job is to maximize risk-adjusted return, not return alone.</div>`,
    `<span class="eyebrow">FIN406 · Chương 6 · Bài 6.1</span>
<h2>Quản trị rủi ro danh mục &amp; đa dạng hoá</h2>
<h3>Vì sao đa dạng hoá có hiệu quả</h3>
<p>Kết hợp các tài sản mà lợi suất không di chuyển hoàn toàn đồng bộ làm giảm rủi ro danh mục xuống dưới mức trung bình có trọng số của rủi ro từng tài sản riêng lẻ — đây là <strong>đa dạng hoá</strong>, và nó hiệu quả nhờ <strong>tương quan</strong> không hoàn hảo giữa các lợi suất, không phải vì một tài sản nào đó trở nên ít rủi ro hơn.</p>
<h3>Rủi ro danh mục hai tài sản</h3>
<pre><code>Phương sai danh mục (hai tài sản A, B, trọng số wA, wB):
 Var(P) = wA^2 x SDA^2 + wB^2 x SDB^2
         + 2 x wA x wB x SDA x SDB x corr(A,B)

Ví dụ (số giả định):
 wA = 0,6, SDA = 20%;  wB = 0,4, SDB = 15%;  corr(A,B) = 0,3
 Var(P) = 0,6^2 x 0,20^2 + 0,4^2 x 0,15^2
         + 2 x 0,6 x 0,4 x 0,20 x 0,15 x 0,3
        = 0,0144 + 0,0036 + 0,00432 = 0,02232
 SD(P) = sqrt(0,02232) = 14,9%

 Đọc kết quả: 14,9% THẤP HƠN trung bình có trọng số
 (0,6 x 20% + 0,4 x 15% = 18%) -- lợi ích đa dạng hoá.
</code></pre>
<h3>Rủi ro hệ thống vs rủi ro riêng lẻ</h3>
<ul>
<li><strong>Rủi ro riêng lẻ (unsystematic/idiosyncratic)</strong> — đặc thù của một doanh nghiệp hoặc ngành; có thể giảm, về lý thuyết tiến tới không, bằng cách thêm nhiều tài sản không tương quan.</li>
<li><strong>Rủi ro hệ thống (systematic/market)</strong> — ảnh hưởng toàn thị trường (suy thoái, sốc lãi suất); không thể đa dạng hoá để loại bỏ, và đây chính là điều beta (b) trong CAPM đo mức độ nhạy cảm.</li>
</ul>
<h3>Lợi suất điều chỉnh theo rủi ro: Sharpe ratio</h3>
<pre><code>Sharpe ratio: S = (r - rf) / SD

Ví dụ: r = 12%, rf = 4%, SD = 16%
 S = (12 - 4) / 16 = 0,5
</code></pre>
<div class="callout"><span class="badge">Ý chính</span> Lợi suất thô cao hơn không tự động tốt hơn — Sharpe ratio so sánh lợi suất trên mỗi đơn vị rủi ro chấp nhận, đó là lý do công việc của một nhà quản lý danh mục là tối đa hoá lợi suất điều chỉnh theo rủi ro, không phải chỉ lợi suất.</div>`,
  ]]);

const c6q = quiz('fin406-quiz-6', 'Quiz 6 — Portfolio & diversification|||Quiz 6 — Danh mục & đa dạng hoá', [
  { id: 'q1', question: 'Đa dạng hoá làm giảm rủi ro danh mục nhờ điều gì?', options: ['Mua càng nhiều tài sản rủi ro cao càng tốt', 'Tương quan không hoàn hảo giữa lợi suất các tài sản', 'Bỏ hết tài sản rủi ro thấp', 'Tăng đòn bẩy'], correctIndex: 1, explanation: 'Khi tương quan giữa các tài sản nhỏ hơn 1, kết hợp chúng giảm rủi ro dưới mức trung bình có trọng số.' },
  { id: 'q2', question: 'Rủi ro hệ thống (systematic risk) khác rủi ro riêng lẻ (unsystematic) ở điểm nào?', options: ['Rủi ro hệ thống có thể loại bỏ hoàn toàn bằng đa dạng hoá', 'Rủi ro hệ thống ảnh hưởng toàn thị trường và không thể đa dạng hoá để loại bỏ', 'Rủi ro riêng lẻ luôn lớn hơn rủi ro hệ thống', 'Hai loại này giống nhau'], correctIndex: 1, explanation: 'Rủi ro hệ thống (vd suy thoái) tác động toàn thị trường; chỉ rủi ro riêng lẻ giảm được qua đa dạng hoá.' },
  { id: 'q3', question: 'Sharpe ratio đo điều gì?', options: ['Tổng lợi suất tuyệt đối', 'Lợi suất vượt trội trên mỗi đơn vị rủi ro (độ lệch chuẩn)', 'Xác suất vỡ nợ của danh mục', 'Hệ số tương quan giữa hai tài sản'], correctIndex: 1, explanation: 'Sharpe ratio = (lợi suất - lãi suất không rủi ro) / độ lệch chuẩn — lợi suất điều chỉnh theo rủi ro.' },
]);

const c7 = doc('fin406-7-1-basel-bank-risk', '7.1 — The Basel framework & bank risk management|||7.1 — Khung Basel & quản trị rủi ro ngân hàng',
  'CAR, RWA, ba trụ cột Basel, LCR/NSFR — vốn và thanh khoản là hai lớp phòng vệ khác nhau.',
  [[
    `<span class="eyebrow">FIN406 · Chapter 7 · Lesson 7.1</span>
<h2>The Basel framework &amp; bank risk management</h2>
<h3>Why banks need a capital rule</h3>
<p>A bank is highly leveraged by nature (mostly funded by depositor and creditor money, not equity), so regulators impose minimum <strong>capital</strong> a bank must hold against its risks — enough to absorb unexpected losses without depositors or the financial system taking the hit. The international standard for this is the <strong>Basel framework</strong>, set by the Basel Committee on Banking Supervision (BIS).</p>
<h3>The core ratio: CAR</h3>
<pre><code>Capital Adequacy Ratio (CAR):
 CAR = (Tier 1 Capital + Tier 2 Capital) / RWA &gt;= 8% (Basel III minimum)

Example (assumed figures):
 Tier 1 = 70,000,000,000 VND
 Tier 2 = 20,000,000,000 VND
 RWA (risk-weighted assets) = 900,000,000,000 VND
 CAR = (70 + 20) / 900 = 10.0%  -- above the 8% minimum
</code></pre>
<p><strong>RWA (Risk-Weighted Assets)</strong> weights each exposure by its riskiness (e.g. a government bond gets a low weight, an unsecured consumer loan a high weight) — a bank with riskier assets needs more capital for the same total lending.</p>
<h3>Basel's three pillars</h3>
<ul>
<li><strong>Pillar 1</strong> — minimum capital requirements (credit, market, operational risk) computed via CAR and RWA.</li>
<li><strong>Pillar 2</strong> — supervisory review; regulators can require extra capital for risks Pillar 1 does not fully capture.</li>
<li><strong>Pillar 3</strong> — market discipline through public disclosure (banks publish their risk and capital metrics).</li>
</ul>
<h3>Liquidity standards added after 2008</h3>
<p>Basel III added two liquidity ratios: the <strong>LCR</strong> (30-day survival under stress, see Chapter 4) and the <strong>NSFR (Net Stable Funding Ratio)</strong>, which requires stable long-term funding for illiquid long-term assets — closing the gap that let banks fund long-term mortgages with overnight borrowing before 2008.</p>
<div class="callout"><span class="badge">Key idea</span> Capital and liquidity are two different defenses: capital absorbs <em>losses</em>; liquidity buffers absorb a <em>cash</em> shortfall. A bank can be well-capitalized and still fail from a liquidity run (or vice versa) — Basel III requires both.</div>`,
    `<span class="eyebrow">FIN406 · Chương 7 · Bài 7.1</span>
<h2>Khung Basel &amp; quản trị rủi ro ngân hàng</h2>
<h3>Vì sao ngân hàng cần quy định vốn</h3>
<p>Ngân hàng vốn dĩ có đòn bẩy rất cao (chủ yếu được tài trợ bằng tiền của người gửi và chủ nợ, không phải vốn chủ sở hữu), nên cơ quan quản lý yêu cầu ngân hàng giữ <strong>vốn</strong> tối thiểu tương ứng với rủi ro — đủ để hấp thụ tổn thất bất định mà không đẩy gánh nặng lên người gửi hay cả hệ thống tài chính. Chuẩn quốc tế cho việc này là <strong>khung Basel</strong>, do Ủy ban Basel về Giám sát Ngân hàng (BIS) đặt ra.</p>
<h3>Tỉ lệ cốt lõi: CAR</h3>
<pre><code>Tỉ lệ an toàn vốn (CAR):
 CAR = (Vốn Tier 1 + Vốn Tier 2) / RWA &gt;= 8% (mức tối thiểu Basel III)

Ví dụ (số giả định):
 Tier 1 = 70.000.000.000 VND
 Tier 2 = 20.000.000.000 VND
 RWA (tài sản có rủi ro điều chỉnh) = 900.000.000.000 VND
 CAR = (70 + 20) / 900 = 10,0%  -- cao hơn mức tối thiểu 8%
</code></pre>
<p><strong>RWA (Risk-Weighted Assets — tài sản có rủi ro điều chỉnh)</strong> gán trọng số rủi ro cho từng lộ diện (vd trái phiếu chính phủ có trọng số thấp, khoản vay tiêu dùng không đảm bảo có trọng số cao) — ngân hàng có tài sản rủi ro cao hơn cần nhiều vốn hơn cho cùng tổng dư nợ.</p>
<h3>Ba trụ cột của Basel</h3>
<ul>
<li><strong>Trụ cột 1 (Pillar 1)</strong> — yêu cầu vốn tối thiểu (rủi ro tín dụng, thị trường, vận hành) tính qua CAR và RWA.</li>
<li><strong>Trụ cột 2 (Pillar 2)</strong> — rà soát giám sát; cơ quan quản lý có thể yêu cầu vốn bổ sung cho rủi ro mà Trụ cột 1 chưa nắm bắt đủ.</li>
<li><strong>Trụ cột 3 (Pillar 3)</strong> — kỷ luật thị trường qua công bố thông tin công khai (ngân hàng công bố các chỉ số rủi ro và vốn).</li>
</ul>
<h3>Chuẩn thanh khoản bổ sung sau 2008</h3>
<p>Basel III bổ sung hai tỉ lệ thanh khoản: <strong>LCR</strong> (sống sót 30 ngày dưới căng thẳng, xem Chương 4) và <strong>NSFR (Net Stable Funding Ratio — tỉ lệ tài trợ ổn định thuần)</strong>, yêu cầu tài trợ dài hạn ổn định cho tài sản dài hạn kém thanh khoản — bịt lỗ hổng từng cho phép ngân hàng tài trợ khoản vay mua nhà dài hạn bằng vốn vay qua đêm trước 2008.</p>
<div class="callout"><span class="badge">Ý chính</span> Vốn và thanh khoản là hai lớp phòng vệ khác nhau: vốn hấp thụ <em>tổn thất</em>; bộ đệm thanh khoản hấp thụ <em>thiếu hụt tiền mặt</em>. Một ngân hàng có thể đủ vốn mà vẫn sụp đổ vì rút tiền hàng loạt (hoặc ngược lại) — Basel III yêu cầu cả hai.</div>`,
  ]]);

const c7q = quiz('fin406-quiz-7', 'Quiz 7 — Basel & bank risk|||Quiz 7 — Khung Basel & rủi ro ngân hàng', [
  { id: 'q1', question: 'CAR (Capital Adequacy Ratio) tính bằng công thức nào?', options: ['Vốn Tier 1 + Tier 2, chia RWA', 'Tài sản thanh khoản chia dòng ra ròng', 'PD x LGD x EAD', 'Lợi suất chia độ lệch chuẩn'], correctIndex: 0, explanation: 'CAR = (Tier 1 + Tier 2) / RWA, tối thiểu 8% theo Basel III.' },
  { id: 'q2', question: 'RWA (Risk-Weighted Assets) dùng để làm gì?', options: ['Đo lãi suất thị trường', 'Gán trọng số rủi ro cho từng lộ diện để tính yêu cầu vốn', 'Đo thanh khoản 30 ngày', 'Tính hedge ratio'], correctIndex: 1, explanation: 'RWA điều chỉnh tổng tài sản theo mức rủi ro, làm mẫu số cho CAR.' },
  { id: 'q3', question: 'NSFR bổ sung sau 2008 nhằm giải quyết vấn đề gì?', options: ['Ngân hàng cho vay quá ít', 'Tài trợ tài sản dài hạn kém thanh khoản bằng vốn vay ngắn hạn/qua đêm', 'Vốn Tier 1 quá cao', 'PD ước lượng sai'], correctIndex: 1, explanation: 'NSFR yêu cầu nguồn tài trợ ổn định dài hạn cho tài sản dài hạn, bịt lỗ hổng lệch kỳ hạn trước 2008.' },
]);

const c8 = doc('fin406-8-1-stress-testing-erm', '8.1 — Stress testing, ERM & crisis lessons|||8.1 — Stress testing, quản trị rủi ro doanh nghiệp & bài học khủng hoảng',
  'Stress testing lịch sử/giả định, ERM (COSO), bài học LTCM/2008/SVB.',
  [[
    `<span class="eyebrow">FIN406 · Chapter 8 · Lesson 8.1</span>
<h2>Stress testing, enterprise risk management &amp; crisis lessons</h2>
<h3>Why VaR is not enough</h3>
<p>VaR and CAR are calibrated on historical volatility and correlations — both of which can break down exactly when a crisis hits (correlations that were low can jump to near 1, "quiet" volatility can spike tenfold). <strong>Stress testing</strong> asks a different question: "what happens to the firm under a specific severe-but-plausible scenario?", independent of historical probability.</p>
<h3>Two stress-testing approaches</h3>
<ul>
<li><strong>Historical scenario</strong> — replay a real past crisis (2008 subprime, 2020 COVID shock) onto today's portfolio or balance sheet.</li>
<li><strong>Hypothetical scenario</strong> — construct a scenario that has not happened yet but is plausible (e.g. a simultaneous rate spike + currency devaluation + credit-spread widening), often built by regulators for system-wide bank stress tests.</li>
</ul>
<pre><code>Example (assumed figures, simple stress P&amp;L):
 Bond portfolio duration D = 5, value V = 200,000,000,000 VND
 Stress scenario: interest rates rise by 2 percentage points (dY = 2%)
 Approx loss = D x dY x V = 5 x 0.02 x 200,000,000,000
             = 20,000,000,000 VND  (10% of portfolio value)
</code></pre>
<h3>Enterprise Risk Management (ERM)</h3>
<p><strong>ERM</strong> is the practice of managing all risk types (market, credit, liquidity, operational, strategic, reputational) together, at the whole-firm level, rather than in separate silos — because risks correlate and compound in a crisis (a liquidity problem triggers a credit downgrade, which triggers a bigger liquidity problem). The <strong>COSO ERM framework</strong> is the most widely referenced standard, tying risk management to strategy and governance, not just to compliance.</p>
<h3>Lessons from real crises</h3>
<ul>
<li><strong>LTCM, 1998</strong> — models assumed correlations that held in normal markets; a Russian default shock made "uncorrelated" positions move together, and extreme leverage turned a moderate loss into insolvency.</li>
<li><strong>2008 subprime</strong> — credit risk was mismeasured (rating agencies underestimated mortgage-backed security default correlation) and liquidity risk was underestimated (short-term funding of long-term assets).</li>
<li><strong>SVB, 2023</strong> — interest-rate risk on a "safe" government-bond book plus a concentrated, uninsured depositor base turned a solvency non-event into a liquidity failure within days.</li>
</ul>
<div class="callout"><span class="badge">Key idea</span> Every major crisis combines at least two risk types that were managed separately and correlated exactly when it hurt most — this is why the course ends with ERM: risk management's job is to see the whole balance sheet, not one risk at a time.</div>`,
    `<span class="eyebrow">FIN406 · Chương 8 · Bài 8.1</span>
<h2>Stress testing, quản trị rủi ro doanh nghiệp &amp; bài học khủng hoảng</h2>
<h3>Vì sao VaR chưa đủ</h3>
<p>VaR và CAR được hiệu chỉnh dựa trên độ dao động và tương quan lịch sử — cả hai đều có thể gãy vỡ đúng lúc khủng hoảng xảy ra (tương quan từng thấp có thể nhảy lên gần 1, độ dao động "yên tĩnh" có thể tăng gấp mười). <strong>Stress testing</strong> đặt một câu hỏi khác: "điều gì xảy ra với doanh nghiệp dưới một kịch bản cụ thể, nghiêm trọng nhưng khả dĩ?", không phụ thuộc xác suất lịch sử.</p>
<h3>Hai cách tiếp cận stress testing</h3>
<ul>
<li><strong>Kịch bản lịch sử</strong> — chạy lại một cuộc khủng hoảng thực đã xảy ra (subprime 2008, sốc COVID 2020) lên danh mục hoặc bảng cân đối hiện tại.</li>
<li><strong>Kịch bản giả định</strong> — dựng một kịch bản chưa từng xảy ra nhưng khả dĩ (vd lãi suất tăng vọt + đồng tiền mất giá + chênh lệch tín dụng nới rộng cùng lúc), thường do cơ quan quản lý xây dựng cho stress test toàn hệ thống ngân hàng.</li>
</ul>
<pre><code>Ví dụ (số giả định, P&amp;L stress đơn giản):
 Danh mục trái phiếu duration D = 5, giá trị V = 200.000.000.000 VND
 Kịch bản stress: lãi suất tăng 2 điểm phần trăm (dY = 2%)
 Lỗ ước tính = D x dY x V = 5 x 0,02 x 200.000.000.000
             = 20.000.000.000 VND  (10% giá trị danh mục)
</code></pre>
<h3>Quản trị rủi ro doanh nghiệp (ERM)</h3>
<p><strong>ERM</strong> là thực hành quản trị TẤT CẢ loại rủi ro (thị trường, tín dụng, thanh khoản, vận hành, chiến lược, danh tiếng) cùng nhau, ở cấp toàn doanh nghiệp, thay vì từng silo riêng biệt — vì rủi ro tương quan và cộng hưởng trong khủng hoảng (một vấn đề thanh khoản kéo theo hạ xếp hạng tín dụng, kéo theo vấn đề thanh khoản lớn hơn). <strong>Khung COSO ERM</strong> là chuẩn được tham chiếu rộng rãi nhất, gắn quản trị rủi ro với chiến lược và quản trị điều hành, không chỉ với tuân thủ.</p>
<h3>Bài học từ các cuộc khủng hoảng thực tế</h3>
<ul>
<li><strong>LTCM, 1998</strong> — mô hình giả định tương quan chỉ đúng trong thị trường bình thường; cú sốc Nga vỡ nợ khiến các vị thế "không tương quan" di chuyển cùng chiều, và đòn bẩy cực cao biến một khoản lỗ vừa phải thành mất khả năng thanh toán.</li>
<li><strong>Subprime 2008</strong> — rủi ro tín dụng bị đo sai (tổ chức xếp hạng đánh giá thấp mức tương quan vỡ nợ của chứng khoán đảm bảo bằng thế chấp) và rủi ro thanh khoản bị đánh giá thấp (tài trợ tài sản dài hạn bằng vốn ngắn hạn).</li>
<li><strong>SVB, 2023</strong> — rủi ro lãi suất trên danh mục trái phiếu chính phủ "an toàn" cộng với cơ sở người gửi tập trung, không được bảo hiểm, biến một vấn đề vốn không nghiêm trọng thành sụp đổ thanh khoản chỉ trong vài ngày.</li>
</ul>
<div class="callout"><span class="badge">Ý chính</span> Mọi cuộc khủng hoảng lớn đều kết hợp ít nhất hai loại rủi ro từng được quản trị riêng biệt và tương quan đúng lúc gây tổn hại nhất — đây là lý do môn học kết thúc bằng ERM: việc của quản trị rủi ro là nhìn toàn bộ bảng cân đối, không phải từng rủi ro riêng lẻ.</div>`,
  ]]);

const c8q = quiz('fin406-quiz-8', 'Quiz 8 — Stress testing & ERM|||Quiz 8 — Stress testing & ERM', [
  { id: 'q1', question: 'Stress testing khác VaR ở điểm nào?', options: ['Stress testing dựa trên kịch bản cụ thể, không dựa xác suất lịch sử', 'Stress testing chỉ dùng cho rủi ro vận hành', 'Stress testing luôn cho kết quả nhỏ hơn VaR', 'Stress testing không cần dữ liệu'], correctIndex: 0, explanation: 'Stress testing hỏi "điều gì xảy ra nếu kịch bản X xảy ra", độc lập với xác suất lịch sử mà VaR dựa vào.' },
  { id: 'q2', question: 'ERM (Enterprise Risk Management) là gì?', options: ['Chỉ quản trị rủi ro tín dụng', 'Quản trị tất cả loại rủi ro cùng nhau ở cấp toàn doanh nghiệp', 'Một loại phái sinh hedging', 'Một tỉ lệ vốn theo Basel'], correctIndex: 1, explanation: 'ERM nhìn rủi ro ở cấp toàn doanh nghiệp, vì các loại rủi ro tương quan và cộng hưởng trong khủng hoảng.' },
  { id: 'q3', question: 'Bài học chung từ LTCM/2008/SVB là gì?', options: ['Mỗi khủng hoảng chỉ do một loại rủi ro duy nhất', 'Nhiều loại rủi ro cùng tương quan và cộng hưởng đúng lúc khủng hoảng', 'VaR luôn dự báo đúng các cuộc khủng hoảng này', 'Basel III đã ngăn được cả ba cuộc khủng hoảng'], correctIndex: 1, explanation: 'Cả ba trường hợp đều kết hợp ít nhất hai loại rủi ro (thị trường/tín dụng/thanh khoản) tương quan cùng lúc.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'FIN406',
    slug: 'fin406-financial-risk-management',
    title: 'Financial Risk Management',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/FIN406.webp',
    shortDescription: 'How firms & banks manage financial risk — risk types, VaR, credit risk (PD/LGD/EAD), liquidity/operational risk, hedging, diversification, Basel capital rules, stress testing & ERM. Bilingual, with worked examples & quizzes.|||Doanh nghiệp & ngân hàng quản trị rủi ro tài chính thế nào — phân loại rủi ro, VaR, rủi ro tín dụng (PD/LGD/EAD), rủi ro thanh khoản/vận hành, phòng ngừa phái sinh, đa dạng hoá, khung Basel, stress testing & ERM. Song ngữ, có ví dụ & quiz.',
    description: 'Môn <strong>FIN406 — Financial Risk Management</strong> (kỳ 5) trang bị nền tảng <strong>quản trị rủi ro tài chính</strong> cho doanh nghiệp và ngân hàng. Từ <strong>phân loại rủi ro</strong> (thị trường, tín dụng, thanh khoản, vận hành) → đo lường <strong>rủi ro thị trường bằng VaR</strong> → <strong>rủi ro tín dụng</strong> (PD/LGD/EAD) → <strong>rủi ro thanh khoản &amp; vận hành</strong> → <strong>phòng ngừa bằng phái sinh</strong> (forward/future/option/swap) → <strong>quản trị rủi ro danh mục &amp; đa dạng hoá</strong> → <strong>khung Basel</strong> (CAR, RWA, LCR, NSFR) → <strong>stress testing &amp; ERM</strong>, đúc kết từ các cuộc khủng hoảng thực tế (LTCM, 2008, SVB). Bám giáo trình GARP FRM/Jorion/Hull, song ngữ, có ví dụ tính toán (số giả định) và quiz mỗi chương.',
    whatYouLearn: 'Phân loại rủi ro tài chính & mô hình ba lớp phòng vệ; đo VaR (tham số/lịch sử/Monte Carlo) & Expected Shortfall; PD-LGD-EAD & Expected Loss; LCR & rủi ro vận hành; hedge ratio & basis risk với forward/future/option/swap; rủi ro danh mục, tương quan, Sharpe ratio; CAR, RWA, ba trụ cột Basel, NSFR; stress testing & ERM (COSO), bài học từ LTCM/2008/SVB.',
    requirements: 'Đã học qua Tài chính doanh nghiệp (Corporate Finance) & Thống kê cơ bản (kỳ vọng, phương sai, tương quan). Biết dùng bảng tính (Excel/Google Sheets) để làm ví dụ tính toán.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Jorion, Hull, GARP FRM, BIS Basel, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Rủi ro là gì, vì sao có quản trị rủi ro, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan & phân loại rủi ro|||Chapter 1 — Overview & risk types', description: 'Năm loại rủi ro, quy trình quản trị, risk appetite.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Rủi ro thị trường & VaR|||Chapter 2 — Market risk & VaR', description: 'VaR tham số/lịch sử/Monte Carlo, Expected Shortfall.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Rủi ro tín dụng|||Chapter 3 — Credit risk', description: 'PD/LGD/EAD, Expected Loss, rủi ro tập trung.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Rủi ro thanh khoản & vận hành|||Chapter 4 — Liquidity & operational risk', description: 'Funding vs market liquidity, LCR, rủi ro vận hành.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Phòng ngừa bằng phái sinh|||Chapter 5 — Hedging with derivatives', description: 'Forward/future/option/swap, hedge ratio, basis risk.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Rủi ro danh mục & đa dạng hoá|||Chapter 6 — Portfolio risk & diversification', description: 'Tương quan, rủi ro hệ thống, Sharpe ratio.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Khung Basel & rủi ro ngân hàng|||Chapter 7 — Basel framework & bank risk', description: 'CAR, RWA, ba trụ cột Basel, LCR/NSFR.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Stress testing, ERM & bài học khủng hoảng|||Chapter 8 — Stress testing, ERM & crisis lessons', description: 'Stress testing, COSO ERM, LTCM/2008/SVB.', lessons: [c8, c8q] },
  ],
};
