/**
 * RMI301 — Financial Risk Management and Investment Decision Making.
 * Khối Quản trị Kinh doanh (BBA), FPTU, Kỳ 4. Giáo trình tham khảo (trích dẫn,
 * KHÔNG upload PDF): "Financial Risk Manager Handbook" (Jorion); "Options,
 * Futures, and Other Derivatives" (Hull); "Investments" (Bodie/Kane/Marcus).
 * 8 chương song ngữ + quiz. Giữ NGUYÊN slug/semester/thumb.
 * ⚠️ KHÔNG backtick/${} lồng nhau; "\n"→\\n trong chuỗi thường.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('rmi301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình tham khảo (Jorion, Hull, Bodie/Kane/Marcus), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">RMI301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Financial Risk Management and Investment Decision Making — risk measurement, hedging, portfolio theory, valuation, derivatives and enterprise risk governance — in one place. The full official slides &amp; syllabus live on <strong>FLM</strong>; below are the reference textbooks and free, legal resources this course is built from.</p>
<h3>📘 Core reference textbooks</h3>
<ul>
<li><em>Financial Risk Manager Handbook</em> — Philippe Jorion (GARP FRM reference) — risk measurement, VaR, credit &amp; operational risk.</li>
<li><em>Options, Futures, and Other Derivatives</em> — John C. Hull — the standard text on forwards, futures, options and swaps.</li>
<li><em>Investments</em> — Bodie, Kane &amp; Marcus — portfolio theory, CAPM, market efficiency and security analysis.</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.garp.org/" target="_blank" rel="noopener">GARP (Global Association of Risk Professionals)</a> — FRM body of knowledge, free study materials.</li>
<li><a href="https://www.bis.org/bcbs/" target="_blank" rel="noopener">Basel Committee on Banking Supervision (BIS)</a> — the original Basel I/II/III accords.</li>
<li><a href="https://www.investopedia.com/" target="_blank" rel="noopener">Investopedia</a> — plain-language explanations of every term below.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@FinanceLady" target="_blank" rel="noopener">The Finance Storyteller</a> — risk, valuation and corporate finance explained visually.</li>
<li><a href="https://www.youtube.com/@MarinTrenkFRM" target="_blank" rel="noopener">FRM / risk-management focused channels</a> — VaR, Expected Shortfall and derivatives walkthroughs.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li>Spreadsheet (Excel/Google Sheets) — build VaR, NPV/IRR and portfolio-variance models by hand first, before trusting any black box.</li>
<li><a href="https://www.investopedia.com/terms/b/blackscholes.asp" target="_blank" rel="noopener">Black-Scholes calculators</a> — sanity-check option pricing intuition.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — risk types, ERM process, volatility, VaR, market/credit/liquidity risk.</li>
<li><strong>Practice</strong> — compute VaR, portfolio variance, CAPM beta and NPV/IRR by hand on small numeric examples.</li>
<li><strong>Go deeper</strong> — hedging with derivatives (forwards, futures, options, swaps), real options.</li>
<li><strong>Job-ready</strong> — read a bank's Basel Pillar 3 disclosure and an annual report's risk-management section end to end.</li>
</ol></div>`,
    `<span class="eyebrow">RMI301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Quản trị Rủi ro Tài chính &amp; Ra quyết định Đầu tư — đo lường rủi ro, phòng ngừa, lý thuyết danh mục, định giá và quản trị rủi ro doanh nghiệp — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là các sách tham khảo gốc và nguồn miễn phí, hợp pháp mà môn học này dựa vào.</p>
<h3>📘 Sách giáo trình tham khảo chính</h3>
<ul>
<li><em>Financial Risk Manager Handbook</em> — Philippe Jorion (tài liệu chuẩn của GARP FRM) — đo lường rủi ro, VaR, rủi ro tín dụng &amp; vận hành.</li>
<li><em>Options, Futures, and Other Derivatives</em> — John C. Hull — sách chuẩn về forwards, futures, options và swaps.</li>
<li><em>Investments</em> — Bodie, Kane &amp; Marcus — lý thuyết danh mục, CAPM, hiệu quả thị trường và phân tích chứng khoán.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.garp.org/" target="_blank" rel="noopener">GARP (Global Association of Risk Professionals)</a> — khung kiến thức FRM, tài liệu học miễn phí.</li>
<li><a href="https://www.bis.org/bcbs/" target="_blank" rel="noopener">Basel Committee on Banking Supervision (BIS)</a> — văn bản gốc các hiệp ước Basel I/II/III.</li>
<li><a href="https://www.investopedia.com/" target="_blank" rel="noopener">Investopedia</a> — giải thích dễ hiểu mọi thuật ngữ bên dưới.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@FinanceLady" target="_blank" rel="noopener">The Finance Storyteller</a> — rủi ro, định giá và tài chính doanh nghiệp giảng bằng hình ảnh.</li>
<li><a href="https://www.youtube.com/@MarinTrenkFRM" target="_blank" rel="noopener">Các kênh chuyên FRM</a> — hướng dẫn tính VaR, Expected Shortfall và phái sinh.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li>Bảng tính (Excel/Google Sheets) — tự dựng mô hình VaR, NPV/IRR và phương sai danh mục bằng tay trước, đừng tin ngay công cụ tự động.</li>
<li><a href="https://www.investopedia.com/terms/b/blackscholes.asp" target="_blank" rel="noopener">Máy tính Black-Scholes</a> — kiểm tra trực giác về định giá quyền chọn.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — các loại rủi ro, quy trình ERM, độ biến động, VaR, rủi ro thị trường/tín dụng/thanh khoản.</li>
<li><strong>Luyện tập</strong> — tính VaR, phương sai danh mục, beta CAPM và NPV/IRR bằng tay trên ví dụ số nhỏ.</li>
<li><strong>Đào sâu</strong> — phòng ngừa bằng phái sinh (forwards, futures, options, swaps), real options.</li>
<li><strong>Sẵn sàng đi làm</strong> — đọc trọn phần công bố Pillar 3 Basel của một ngân hàng và phần quản trị rủi ro trong báo cáo thường niên.</li>
</ol></div>`,
  ]]);

const intro = doc('rmi301-0-1-overview', 'Course overview: Financial Risk Management and Investment Decision Making|||Tổng quan: Quản trị Rủi ro Tài chính & Ra quyết định Đầu tư',
  'Rủi ro tài chính là gì, vì sao doanh nghiệp/nhà đầu tư phải quản trị nó; lộ trình 8 chương: tổng quan & ERM → đo lường rủi ro → thị trường & hedging → tín dụng & thanh khoản → danh mục & CAPM → định giá & đầu tư → phái sinh → ERM tích hợp & Basel.',
  [[
    `<span class="eyebrow">RMI301 · Lesson 0.1 · Overview</span>
<h2>Financial Risk Management and Investment Decision Making</h2>
<p class="lead">This course helps you understand <strong>how firms and investors identify, measure and control financial risk</strong> — and how that same discipline feeds into <strong>investment decisions</strong>. You will learn to quantify risk (volatility, VaR, Expected Shortfall), hedge it with derivatives, build diversified portfolios (Markowitz, CAPM), and value investment projects (NPV, IRR, real options) inside an enterprise-wide risk framework (ERM, Basel).</p>
<h3>Why this matters</h3>
<ul>
<li><strong>Firms</strong> face market, credit, liquidity and operational risk that can wipe out earnings — or the firm itself — if unmanaged.</li>
<li><strong>Investors</strong> must trade off risk and expected return when building a portfolio and choosing which projects or securities to fund.</li>
<li><strong>Regulators</strong> (Basel Committee) impose capital and risk-management standards on banks precisely because unmanaged risk is systemic.</li>
</ul>
<h3>Roadmap — 8 chapters</h3>
<ol>
<li>Overview of financial risk &amp; enterprise risk management (ERM)</li>
<li>Risk measurement: volatility, Value-at-Risk (VaR), Expected Shortfall</li>
<li>Market risk &amp; hedging</li>
<li>Credit risk &amp; liquidity risk</li>
<li>Portfolio theory &amp; diversification (Markowitz, CAPM)</li>
<li>Asset valuation &amp; investment decisions (NPV, IRR, real options)</li>
<li>Derivatives in risk management (forwards, futures, options, swaps)</li>
<li>Integrated enterprise risk management (ERM), Basel &amp; governance framework</li>
</ol>
<p>Bilingual, with worked numeric examples and a quiz after every chapter. References: Jorion&#39;s <em>Financial Risk Manager Handbook</em>, Hull&#39;s <em>Options, Futures, and Other Derivatives</em>, Bodie/Kane/Marcus&#39;s <em>Investments</em>.</p>`,
    `<span class="eyebrow">RMI301 · Bài 0.1 · Tổng quan</span>
<h2>Quản trị Rủi ro Tài chính &amp; Ra quyết định Đầu tư</h2>
<p class="lead">Môn này giúp bạn hiểu <strong>doanh nghiệp và nhà đầu tư nhận diện, đo lường và kiểm soát rủi ro tài chính như thế nào</strong> — và cách kỷ luật đó dẫn vào <strong>quyết định đầu tư</strong>. Bạn sẽ học định lượng rủi ro (độ biến động, VaR, Expected Shortfall), phòng ngừa bằng phái sinh, xây danh mục đa dạng hoá (Markowitz, CAPM), và định giá các dự án đầu tư (NPV, IRR, real options) trong một khung quản trị rủi ro toàn doanh nghiệp (ERM, Basel).</p>
<h3>Vì sao môn này quan trọng</h3>
<ul>
<li><strong>Doanh nghiệp</strong> đối mặt rủi ro thị trường, tín dụng, thanh khoản và vận hành — có thể xoá sổ lợi nhuận, thậm chí cả doanh nghiệp, nếu không được kiểm soát.</li>
<li><strong>Nhà đầu tư</strong> phải đánh đổi giữa rủi ro và lợi nhuận kỳ vọng khi xây danh mục và chọn dự án/chứng khoán để đầu tư.</li>
<li><strong>Cơ quan quản lý</strong> (Basel Committee) đặt chuẩn vốn và quản trị rủi ro cho ngân hàng đúng vì rủi ro không kiểm soát có tính hệ thống.</li>
</ul>
<h3>Lộ trình — 8 chương</h3>
<ol>
<li>Tổng quan rủi ro tài chính &amp; quản trị rủi ro doanh nghiệp (ERM)</li>
<li>Đo lường rủi ro: độ biến động, Value-at-Risk (VaR), Expected Shortfall</li>
<li>Rủi ro thị trường &amp; phòng ngừa (hedging)</li>
<li>Rủi ro tín dụng &amp; rủi ro thanh khoản</li>
<li>Lý thuyết danh mục &amp; đa dạng hoá (Markowitz, CAPM)</li>
<li>Định giá tài sản &amp; ra quyết định đầu tư (NPV, IRR, real options)</li>
<li>Công cụ phái sinh trong quản trị rủi ro (forwards, futures, options, swaps)</li>
<li>Quản trị rủi ro doanh nghiệp tích hợp (ERM), Basel &amp; khung quản trị</li>
</ol>
<p>Song ngữ, có ví dụ tính toán mẫu và quiz sau mỗi chương. Tài liệu tham khảo: <em>Financial Risk Manager Handbook</em> của Jorion, <em>Options, Futures, and Other Derivatives</em> của Hull, <em>Investments</em> của Bodie/Kane/Marcus.</p>`,
  ]]);

const c1 = doc('rmi301-1-1-overview-erm', '1.1 — Types of financial risk & the ERM process|||1.1 — Các loại rủi ro tài chính & quy trình ERM',
  'Bốn loại rủi ro tài chính chính (thị trường, tín dụng, thanh khoản, vận hành); quy trình quản trị rủi ro (nhận diện → đo lường → kiểm soát → giám sát); risk appetite/tolerance; ERM là gì.',
  [[
    `<span class="eyebrow">RMI301 · Chapter 1 · Lesson 1.1</span>
<h2>Types of financial risk &amp; the ERM process</h2>
<h3>Four core types of financial risk</h3>
<ul>
<li><strong>Market risk</strong> — losses from changes in market prices: interest rates, exchange rates, equity prices, commodity prices.</li>
<li><strong>Credit risk</strong> — losses when a counterparty fails to meet its obligations (default).</li>
<li><strong>Liquidity risk</strong> — inability to meet cash obligations, or to unwind a position without a large price concession.</li>
<li><strong>Operational risk</strong> — losses from failed internal processes, people, systems, or external events (fraud, IT failure, natural disaster).</li>
</ul>
<h3>The risk management process</h3>
<pre><code>Identify  -> what can go wrong, which risk factors matter
Measure   -> quantify exposure (volatility, VaR, credit exposure...)
Control   -> mitigate: hedge, diversify, set limits, transfer (insurance)
Monitor   -> track exposure &amp; limits continuously, report to management
</code></pre>
<h3>Risk appetite &amp; risk tolerance</h3>
<p><strong>Risk appetite</strong> is the amount and type of risk an organization is willing to accept in pursuit of its objectives; <strong>risk tolerance</strong> is the acceptable range of variation around that appetite (e.g. a specific VaR limit). Both are set by the board and cascade down into limits for each business line.</p>
<h3>Enterprise Risk Management (ERM)</h3>
<p><strong>ERM</strong> manages all risk types together, across the whole organization, instead of each department managing its own risk in a silo. It links risk management directly to strategy: a firm decides how much risk to take on in order to pursue a given return, not as an afterthought.</p>
<div class="callout"><span class="badge">Key idea</span> Risk management is not about eliminating risk — it is about taking the RIGHT risks, at a size the firm can survive, in return for an expected reward.</div>`,
    `<span class="eyebrow">RMI301 · Chương 1 · Bài 1.1</span>
<h2>Các loại rủi ro tài chính &amp; quy trình ERM</h2>
<h3>Bốn loại rủi ro tài chính chính</h3>
<ul>
<li><strong>Rủi ro thị trường (market risk)</strong> — thua lỗ do thay đổi giá trên thị trường: lãi suất, tỷ giá, giá cổ phiếu, giá hàng hoá.</li>
<li><strong>Rủi ro tín dụng (credit risk)</strong> — thua lỗ khi đối tác không thực hiện nghĩa vụ (vỡ nợ).</li>
<li><strong>Rủi ro thanh khoản (liquidity risk)</strong> — không đủ tiền để đáp ứng nghĩa vụ, hoặc phải bán tài sản với mức giảm giá lớn để thanh lý.</li>
<li><strong>Rủi ro vận hành (operational risk)</strong> — thua lỗ do quy trình, con người, hệ thống nội bộ lỗi, hoặc yếu tố bên ngoài (gian lận, sự cố IT, thiên tai).</li>
</ul>
<h3>Quy trình quản trị rủi ro</h3>
<pre><code>Nhận diện -> điều gì có thể sai, yếu tố rủi ro nào quan trọng
Đo lường  -> định lượng mức phơi nhiễm (độ biến động, VaR, phơi nhiễm tín dụng...)
Kiểm soát -> giảm thiểu: hedging, đa dạng hoá, đặt hạn mức, chuyển giao (bảo hiểm)
Giám sát  -> theo dõi phơi nhiễm &amp; hạn mức liên tục, báo cáo cho ban lãnh đạo
</code></pre>
<h3>Risk appetite &amp; risk tolerance</h3>
<p><strong>Risk appetite (mức chấp nhận rủi ro)</strong> là loại và lượng rủi ro tổ chức sẵn sàng chấp nhận để đạt mục tiêu; <strong>risk tolerance (độ dung sai rủi ro)</strong> là phạm vi biến động chấp nhận được quanh mức đó (vd một hạn mức VaR cụ thể). Cả hai do hội đồng quản trị đặt ra và phân bổ xuống thành hạn mức cho từng đơn vị kinh doanh.</p>
<h3>Quản trị rủi ro doanh nghiệp (ERM)</h3>
<p><strong>ERM</strong> quản trị mọi loại rủi ro cùng lúc, trên toàn tổ chức, thay vì từng phòng ban tự quản trị rủi ro riêng lẻ. ERM gắn quản trị rủi ro trực tiếp với chiến lược: doanh nghiệp chủ động quyết định chấp nhận bao nhiêu rủi ro để theo đuổi một mức lợi nhuận nhất định, không phải xử lý sau khi việc đã xảy ra.</p>
<div class="callout"><span class="badge">Ý chính</span> Quản trị rủi ro không phải để loại bỏ rủi ro — mà để chấp nhận ĐÚNG loại rủi ro, ở mức quy mô doanh nghiệp có thể chịu được, đổi lại một phần thưởng kỳ vọng.</div>`,
  ]]);

const c1q = quiz('rmi301-quiz-1', 'Quiz 1 — Overview & ERM|||Quiz 1 — Tổng quan & ERM', [
  { id: 'q1', question: 'Rủi ro doanh nghiệp thua lỗ vì đối tác không thực hiện nghĩa vụ (vỡ nợ) gọi là?', options: ['Rủi ro thị trường', 'Rủi ro tín dụng', 'Rủi ro thanh khoản', 'Rủi ro vận hành'], correctIndex: 1, explanation: 'Rủi ro tín dụng (credit risk) là rủi ro đối tác không trả được nợ/nghĩa vụ.' },
  { id: 'q2', question: 'Thứ tự đúng của quy trình quản trị rủi ro là?', options: ['Đo lường → Nhận diện → Kiểm soát → Giám sát', 'Nhận diện → Đo lường → Kiểm soát → Giám sát', 'Kiểm soát → Giám sát → Nhận diện → Đo lường', 'Giám sát → Kiểm soát → Đo lường → Nhận diện'], correctIndex: 1, explanation: 'Quy trình chuẩn: nhận diện rủi ro → đo lường mức phơi nhiễm → kiểm soát/giảm thiểu → giám sát liên tục.' },
  { id: 'q3', question: 'Đặc điểm nổi bật của ERM (quản trị rủi ro doanh nghiệp) so với quản trị rủi ro theo từng phòng ban riêng lẻ là gì?', options: ['Chỉ tập trung vào rủi ro thị trường', 'Quản trị mọi loại rủi ro cùng lúc, gắn với chiến lược toàn doanh nghiệp', 'Loại bỏ hoàn toàn rủi ro khỏi doanh nghiệp', 'Chỉ áp dụng cho ngân hàng'], correctIndex: 1, explanation: 'ERM nhìn rủi ro ở cấp toàn doanh nghiệp, tích hợp với mục tiêu chiến lược, không theo silo từng phòng ban.' },
]);

const c2 = doc('rmi301-2-1-var-es', '2.1 — Risk measurement: volatility, VaR, Expected Shortfall|||2.1 — Đo lường rủi ro: độ biến động, VaR, Expected Shortfall',
  'Độ biến động (volatility) đo bằng độ lệch chuẩn; Value-at-Risk (VaR) — mức thua lỗ tối đa với một độ tin cậy cho trước; Expected Shortfall (CVaR) — thua lỗ trung bình khi vượt VaR; ví dụ tính toán.',
  [[
    `<span class="eyebrow">RMI301 · Chapter 2 · Lesson 2.1</span>
<h2>Risk measurement: volatility, VaR, Expected Shortfall</h2>
<h3>Volatility — the basic risk measure</h3>
<p><strong>Volatility (σ)</strong> is the standard deviation of returns — how much a return typically deviates from its average. Daily volatility is usually annualized by multiplying by the square root of the number of trading days (≈252): <code>σ_annual = σ_daily × √252</code>.</p>
<h3>Value-at-Risk (VaR)</h3>
<p><strong>VaR</strong> answers: "What is the maximum loss I should expect, over a given horizon, with a given confidence level?" For example, a 1-day 99% VaR of $1 million means there is only a 1% chance of losing more than $1 million in one day.</p>
<pre><code>Parametric (variance-covariance) VaR:
 VaR = z × σ × √t × Portfolio Value
 z = 2.33 for 99% confidence, z = 1.65 for 95% confidence

Example: Portfolio = $10,000,000, daily σ = 1.5%, 1-day, 99% VaR
 VaR = 2.33 × 0.015 × 1 × 10,000,000 ≈ $349,500
</code></pre>
<p>Three common methods: <strong>parametric</strong> (assumes normal distribution), <strong>historical simulation</strong> (replays actual past returns), and <strong>Monte Carlo simulation</strong> (generates many random scenarios).</p>
<h3>Expected Shortfall (ES / CVaR)</h3>
<p>VaR tells you the threshold loss, but nothing about how bad losses get BEYOND that threshold. <strong>Expected Shortfall</strong> fixes this: it is the AVERAGE loss in the worst (1 − confidence) % of cases — e.g. the average of all losses beyond the 99% VaR point. ES is a <em>coherent</em> risk measure (it properly rewards diversification); plain VaR is not.</p>
<div class="callout"><span class="badge">Limitation of VaR</span> VaR says nothing about the SIZE of losses in the tail beyond it. Two portfolios with identical VaR can have very different Expected Shortfall — one may have a much fatter, more dangerous tail.</div>`,
    `<span class="eyebrow">RMI301 · Chương 2 · Bài 2.1</span>
<h2>Đo lường rủi ro: độ biến động, VaR, Expected Shortfall</h2>
<h3>Độ biến động — thước đo rủi ro cơ bản</h3>
<p><strong>Độ biến động (volatility, σ)</strong> là độ lệch chuẩn của lợi nhuận — mức lợi nhuận thường lệch bao nhiêu so với trung bình. Độ biến động ngày thường được quy về năm bằng cách nhân với căn bậc hai số ngày giao dịch (≈252): <code>σ_năm = σ_ngày × √252</code>.</p>
<h3>Value-at-Risk (VaR)</h3>
<p><strong>VaR</strong> trả lời câu hỏi: "Mức thua lỗ tối đa tôi nên dự kiến, trong một khoảng thời gian cho trước, với một độ tin cậy cho trước, là bao nhiêu?" Ví dụ, VaR 1 ngày ở mức tin cậy 99% là 1 triệu USD nghĩa là chỉ có 1% khả năng thua lỗ hơn 1 triệu USD trong một ngày.</p>
<pre><code>VaR tham số (variance-covariance):
 VaR = z × σ × √t × Giá trị danh mục
 z = 2,33 với độ tin cậy 99%, z = 1,65 với độ tin cậy 95%

Ví dụ: Danh mục = 10.000.000 USD, σ ngày = 1,5%, 1 ngày, VaR 99%
 VaR = 2,33 × 0,015 × 1 × 10.000.000 ≈ 349.500 USD
</code></pre>
<p>Ba phương pháp phổ biến: <strong>tham số (parametric)</strong> (giả định phân phối chuẩn), <strong>mô phỏng lịch sử (historical simulation)</strong> (chạy lại lợi nhuận thực trong quá khứ), và <strong>mô phỏng Monte Carlo</strong> (sinh nhiều kịch bản ngẫu nhiên).</p>
<h3>Expected Shortfall (ES / CVaR)</h3>
<p>VaR chỉ cho biết ngưỡng thua lỗ, không nói gì về mức độ tồi tệ của thua lỗ VƯỢT NGƯỠNG đó. <strong>Expected Shortfall</strong> khắc phục điều này: đó là mức thua lỗ TRUNG BÌNH trong (1 − độ tin cậy)% trường hợp xấu nhất — vd trung bình mọi khoản thua lỗ vượt điểm VaR 99%. ES là thước đo rủi ro <em>coherent</em> (thưởng đúng cho đa dạng hoá); VaR thường thì không.</p>
<div class="callout"><span class="badge">Hạn chế của VaR</span> VaR không nói gì về ĐỘ LỚN của thua lỗ ở phần đuôi vượt ngưỡng. Hai danh mục có VaR giống nhau có thể có Expected Shortfall rất khác — một trong hai có thể có đuôi phân phối béo hơn, nguy hiểm hơn nhiều.</div>`,
  ]]);

const c2q = quiz('rmi301-quiz-2', 'Quiz 2 — VaR & Expected Shortfall|||Quiz 2 — VaR & Expected Shortfall', [
  { id: 'q1', question: 'VaR (Value-at-Risk) 1 ngày ở mức tin cậy 99% cho biết điều gì?', options: ['Lợi nhuận trung bình mỗi ngày', 'Mức thua lỗ tối đa dự kiến với chỉ 1% khả năng bị vượt trong 1 ngày', 'Tổng vốn của danh mục', 'Lãi suất phi rủi ro'], correctIndex: 1, explanation: 'VaR 99% là ngưỡng thua lỗ mà chỉ có 1% khả năng bị vượt qua trong khoảng thời gian đo.' },
  { id: 'q2', question: 'Vì sao Expected Shortfall (ES) thường được coi là thước đo rủi ro tốt hơn VaR?', options: ['ES luôn có giá trị nhỏ hơn VaR', 'ES đo được mức độ nghiêm trọng của thua lỗ vượt ngưỡng, còn VaR không', 'ES không cần dữ liệu lịch sử', 'ES chỉ áp dụng cho rủi ro tín dụng'], correctIndex: 1, explanation: 'ES là trung bình các khoản thua lỗ vượt ngưỡng VaR, nên phản ánh được độ nặng của phần đuôi mà VaR bỏ qua.' },
  { id: 'q3', question: 'Phương pháp VaR nào KHÔNG giả định phân phối lợi nhuận theo dạng chuẩn mà dùng lại dữ liệu lợi nhuận thực trong quá khứ?', options: ['Parametric (variance-covariance)', 'Historical simulation', 'CAPM', 'Black-Scholes'], correctIndex: 1, explanation: 'Historical simulation chạy lại các lợi nhuận thực đã xảy ra trong quá khứ để ước lượng VaR, không giả định phân phối chuẩn.' },
]);

const c3 = doc('rmi301-3-1-market-risk-hedging', '3.1 — Market risk & hedging|||3.1 — Rủi ro thị trường & phòng ngừa',
  'Bốn yếu tố rủi ro thị trường (lãi suất, tỷ giá, cổ phiếu, hàng hoá); hedging là gì; hedge ratio; ví dụ phòng ngừa rủi ro tỷ giá bằng hợp đồng kỳ hạn (forward).',
  [[
    `<span class="eyebrow">RMI301 · Chapter 3 · Lesson 3.1</span>
<h2>Market risk &amp; hedging</h2>
<h3>The four market risk factors</h3>
<ul>
<li><strong>Interest rate risk</strong> — bond and loan values move inversely with interest rates.</li>
<li><strong>Foreign exchange (FX) risk</strong> — the value of foreign-currency cash flows changes as exchange rates move.</li>
<li><strong>Equity risk</strong> — stock prices fluctuate with company performance and market sentiment.</li>
<li><strong>Commodity risk</strong> — input/output prices (oil, metals, grain) fluctuate, affecting costs and revenue.</li>
</ul>
<h3>What hedging does</h3>
<p><strong>Hedging</strong> takes an offsetting position so that a loss on the underlying exposure is compensated (fully or partly) by a gain on the hedge instrument. It reduces the RANGE of outcomes — it does not guarantee a profit, and it also gives up upside gains in exchange for protection against downside.</p>
<h3>Hedge ratio</h3>
<p>The <strong>hedge ratio</strong> is the size of the hedging position relative to the exposure being hedged. A hedge ratio of 1 (a "full hedge") offsets the exposure one-for-one; a ratio below 1 is a partial hedge.</p>
<pre><code>Example — hedging FX risk with a forward contract:
 A Vietnamese exporter will receive USD 1,000,000 in 3 months.
 Risk: if VND strengthens against USD, converted VND revenue falls.
 Hedge: sell USD 1,000,000 forward today at a fixed rate F.
 Result: the VND amount received in 3 months is LOCKED IN at F,
         regardless of where the spot rate ends up.
</code></pre>
<div class="callout"><span class="badge">Trade-off</span> A firm that hedges its FX exposure removes the downside if the currency moves against it — but it also gives up the upside if the currency moves in its favor. Hedging is about reducing uncertainty, not about maximizing profit.</div>`,
    `<span class="eyebrow">RMI301 · Chương 3 · Bài 3.1</span>
<h2>Rủi ro thị trường &amp; phòng ngừa (hedging)</h2>
<h3>Bốn yếu tố rủi ro thị trường</h3>
<ul>
<li><strong>Rủi ro lãi suất</strong> — giá trái phiếu và khoản vay biến động ngược chiều với lãi suất.</li>
<li><strong>Rủi ro tỷ giá (FX)</strong> — giá trị dòng tiền ngoại tệ thay đổi theo biến động tỷ giá.</li>
<li><strong>Rủi ro cổ phiếu</strong> — giá cổ phiếu biến động theo kết quả kinh doanh và tâm lý thị trường.</li>
<li><strong>Rủi ro hàng hoá</strong> — giá đầu vào/đầu ra (dầu, kim loại, nông sản) biến động, ảnh hưởng chi phí và doanh thu.</li>
</ul>
<h3>Hedging làm gì</h3>
<p><strong>Hedging (phòng ngừa rủi ro)</strong> là mở một vị thế bù trừ để khoản thua lỗ ở phần rủi ro gốc được bù (toàn phần hoặc một phần) bởi khoản lãi từ công cụ phòng ngừa. Hedging làm hẹp KHOẢNG kết quả có thể xảy ra — nó không đảm bảo có lợi nhuận, và cũng đánh đổi lợi ích tăng thêm để lấy sự bảo vệ khỏi rủi ro giảm.</p>
<h3>Hedge ratio (tỷ lệ phòng ngừa)</h3>
<p><strong>Hedge ratio</strong> là quy mô vị thế phòng ngừa so với phần rủi ro gốc cần phòng ngừa. Hedge ratio = 1 ("phòng ngừa toàn phần") bù trừ đúng 1-1 với rủi ro gốc; tỷ lệ nhỏ hơn 1 là phòng ngừa một phần.</p>
<pre><code>Ví dụ — phòng ngừa rủi ro tỷ giá bằng hợp đồng kỳ hạn (forward):
 Một nhà xuất khẩu Việt Nam sẽ nhận 1.000.000 USD sau 3 tháng.
 Rủi ro: nếu VND mạnh lên so với USD, doanh thu quy đổi VND giảm.
 Phòng ngừa: bán kỳ hạn 1.000.000 USD ngay hôm nay ở tỷ giá cố định F.
 Kết quả: số VND nhận được sau 3 tháng được CHỐT ở mức F,
          bất kể tỷ giá giao ngay khi đó là bao nhiêu.
</code></pre>
<div class="callout"><span class="badge">Sự đánh đổi</span> Doanh nghiệp phòng ngừa rủi ro tỷ giá loại bỏ được phần thiệt hại nếu tỷ giá đi ngược lại — nhưng cũng mất phần lợi thêm nếu tỷ giá đi thuận lợi. Hedging là để giảm tính bất định, không phải để tối đa hoá lợi nhuận.</div>`,
  ]]);

const c3q = quiz('rmi301-quiz-3', 'Quiz 3 — Market risk & hedging|||Quiz 3 — Rủi ro thị trường & phòng ngừa', [
  { id: 'q1', question: 'Rủi ro giá trị trái phiếu biến động ngược chiều với lãi suất thị trường thuộc loại nào?', options: ['Rủi ro tỷ giá', 'Rủi ro lãi suất', 'Rủi ro hàng hoá', 'Rủi ro tín dụng'], correctIndex: 1, explanation: 'Rủi ro lãi suất (interest rate risk) là rủi ro giá trị tài sản có lãi suất cố định biến động ngược chiều với lãi suất thị trường.' },
  { id: 'q2', question: 'Hedge ratio = 1 (phòng ngừa toàn phần) nghĩa là gì?', options: ['Không phòng ngừa gì cả', 'Vị thế phòng ngừa bù trừ đúng 1-1 với phần rủi ro gốc', 'Chỉ phòng ngừa 50% rủi ro', 'Chuyển toàn bộ rủi ro thành lợi nhuận'], correctIndex: 1, explanation: 'Hedge ratio = 1 là phòng ngừa toàn phần, khớp quy mô vị thế hedge với đúng phần rủi ro gốc.' },
  { id: 'q3', question: 'Khi một doanh nghiệp hedging rủi ro tỷ giá bằng hợp đồng kỳ hạn, điều gì họ phải đánh đổi?', options: ['Không đánh đổi gì, chỉ có lợi', 'Mất khả năng hưởng lợi thêm nếu tỷ giá đi thuận lợi', 'Phải trả thuế cao hơn', 'Mất quyền sở hữu tài sản gốc'], correctIndex: 1, explanation: 'Hedging chốt kết quả ở một mức cố định, nên doanh nghiệp từ bỏ phần lợi thêm nếu thị trường di chuyển có lợi cho họ.' },
]);

const c4 = doc('rmi301-4-1-credit-liquidity-risk', '4.1 — Credit risk & liquidity risk|||4.1 — Rủi ro tín dụng & rủi ro thanh khoản',
  'Rủi ro tín dụng: PD, LGD, EAD, Expected Loss; xếp hạng tín dụng, credit spread. Rủi ro thanh khoản: funding liquidity vs market liquidity, Liquidity Coverage Ratio.',
  [[
    `<span class="eyebrow">RMI301 · Chapter 4 · Lesson 4.1</span>
<h2>Credit risk &amp; liquidity risk</h2>
<h3>Credit risk — the components of loss</h3>
<p>Credit risk is broken down into three measurable pieces:</p>
<ul>
<li><strong>PD (Probability of Default)</strong> — the likelihood the counterparty defaults within a given horizon.</li>
<li><strong>LGD (Loss Given Default)</strong> — the fraction of exposure lost if default happens (1 − recovery rate).</li>
<li><strong>EAD (Exposure at Default)</strong> — the amount outstanding at the moment default occurs.</li>
</ul>
<pre><code>Expected Loss (EL) = PD × LGD × EAD

Example: Loan = $1,000,000, PD = 2%, LGD = 60%
 EL = 0.02 × 0.60 × 1,000,000 = $12,000
</code></pre>
<p><strong>Credit ratings</strong> (AAA...D from agencies like Moody's/S&amp;P) summarize PD for a borrower. The <strong>credit spread</strong> — the extra yield a risky bond pays over a risk-free government bond — is the market's price for bearing that credit risk.</p>
<h3>Liquidity risk — two distinct kinds</h3>
<ul>
<li><strong>Funding liquidity risk</strong> — the firm cannot meet its cash obligations as they come due (it runs out of cash), even if it is solvent on paper.</li>
<li><strong>Market liquidity risk</strong> — the firm cannot sell/unwind a position quickly without moving the price significantly against itself (wide bid-ask spread, thin trading volume).</li>
</ul>
<p>Banks measure funding liquidity with the <strong>Liquidity Coverage Ratio (LCR)</strong>: high-quality liquid assets divided by expected net cash outflows over 30 days, required to be ≥ 100% under Basel III.</p>
<div class="callout"><span class="badge">Why liquidity risk kills fast</span> A firm can be technically SOLVENT (assets &gt; liabilities) and still fail because it cannot convert assets to cash fast enough to pay what is due today — this is exactly what happens in a bank run.</div>`,
    `<span class="eyebrow">RMI301 · Chương 4 · Bài 4.1</span>
<h2>Rủi ro tín dụng &amp; rủi ro thanh khoản</h2>
<h3>Rủi ro tín dụng — các thành phần của tổn thất</h3>
<p>Rủi ro tín dụng được tách thành ba phần đo được:</p>
<ul>
<li><strong>PD (Probability of Default — xác suất vỡ nợ)</strong> — khả năng đối tác vỡ nợ trong một khoảng thời gian cho trước.</li>
<li><strong>LGD (Loss Given Default — tỷ lệ tổn thất khi vỡ nợ)</strong> — phần phơi nhiễm bị mất nếu vỡ nợ xảy ra (1 − tỷ lệ thu hồi).</li>
<li><strong>EAD (Exposure at Default — phơi nhiễm tại thời điểm vỡ nợ)</strong> — số dư còn lại tại đúng thời điểm vỡ nợ xảy ra.</li>
</ul>
<pre><code>Expected Loss (EL — tổn thất kỳ vọng) = PD × LGD × EAD

Ví dụ: Khoản vay = 1.000.000 USD, PD = 2%, LGD = 60%
 EL = 0,02 × 0,60 × 1.000.000 = 12.000 USD
</code></pre>
<p><strong>Xếp hạng tín dụng</strong> (AAA...D từ các tổ chức như Moody&#39;s/S&amp;P) tóm tắt mức PD của một bên vay. <strong>Credit spread (chênh lệch lợi suất tín dụng)</strong> — phần lợi suất thêm mà trái phiếu rủi ro trả cao hơn trái phiếu chính phủ phi rủi ro — là mức giá thị trường đặt cho việc gánh rủi ro tín dụng đó.</p>
<h3>Rủi ro thanh khoản — hai loại khác nhau</h3>
<ul>
<li><strong>Rủi ro thanh khoản tài trợ (funding liquidity risk)</strong> — doanh nghiệp không đủ tiền để đáp ứng nghĩa vụ đến hạn (hết tiền mặt), dù trên sổ sách vẫn còn khả năng thanh toán (solvent).</li>
<li><strong>Rủi ro thanh khoản thị trường (market liquidity risk)</strong> — doanh nghiệp không thể bán/thanh lý vị thế nhanh mà không làm giá di chuyển mạnh ngược lại (chênh lệch mua-bán rộng, khối lượng giao dịch mỏng).</li>
</ul>
<p>Ngân hàng đo rủi ro thanh khoản tài trợ bằng <strong>Liquidity Coverage Ratio (LCR)</strong>: tài sản có tính lỏng cao chia cho dòng tiền ra thuần dự kiến trong 30 ngày, yêu cầu ≥ 100% theo Basel III.</p>
<div class="callout"><span class="badge">Vì sao rủi ro thanh khoản giết nhanh</span> Một doanh nghiệp có thể vẫn CÓ KHẢ NĂNG THANH TOÁN về mặt kỹ thuật (tài sản &gt; nợ) nhưng vẫn sụp đổ vì không chuyển đổi tài sản thành tiền mặt đủ nhanh để trả nợ đến hạn hôm nay — đây chính xác là điều xảy ra trong một cuộc rút tiền hàng loạt (bank run).</div>`,
  ]]);

const c4q = quiz('rmi301-quiz-4', 'Quiz 4 — Credit & liquidity risk|||Quiz 4 — Rủi ro tín dụng & thanh khoản', [
  { id: 'q1', question: 'Expected Loss (tổn thất kỳ vọng) trong rủi ro tín dụng được tính bằng công thức nào?', options: ['PD + LGD + EAD', 'PD × LGD × EAD', 'PD / LGD', 'EAD − LGD'], correctIndex: 1, explanation: 'Expected Loss = PD × LGD × EAD — xác suất vỡ nợ nhân tỷ lệ tổn thất nhân phơi nhiễm tại thời điểm vỡ nợ.' },
  { id: 'q2', question: 'Rủi ro không thể bán/thanh lý một vị thế nhanh mà không làm giá bị ép mạnh gọi là gì?', options: ['Rủi ro thanh khoản tài trợ (funding liquidity risk)', 'Rủi ro thanh khoản thị trường (market liquidity risk)', 'Rủi ro tín dụng', 'Rủi ro lãi suất'], correctIndex: 1, explanation: 'Đây là market liquidity risk — liên quan đến khả năng thanh lý tài sản trên thị trường mà không làm biến động giá lớn.' },
  { id: 'q3', question: 'Một doanh nghiệp vẫn có tài sản lớn hơn nợ (solvent) nhưng sụp đổ vì hết tiền mặt để trả nợ đến hạn — đây là ví dụ của loại rủi ro nào?', options: ['Rủi ro tín dụng', 'Rủi ro thanh khoản tài trợ', 'Rủi ro thị trường', 'Rủi ro vận hành'], correctIndex: 1, explanation: 'Đây là funding liquidity risk — mất khả năng đáp ứng nghĩa vụ tiền mặt dù về lý thuyết vẫn còn khả năng thanh toán.' },
]);

const c5 = doc('rmi301-5-1-portfolio-capm', '5.1 — Portfolio theory & diversification (Markowitz, CAPM)|||5.1 — Lý thuyết danh mục & đa dạng hoá (Markowitz, CAPM)',
  'Lợi nhuận kỳ vọng & rủi ro danh mục; đa dạng hoá giảm rủi ro phi hệ thống; biên hiệu quả Markowitz; CAPM: E(R) = Rf + β(E(Rm) − Rf); beta là gì.',
  [[
    `<span class="eyebrow">RMI301 · Chapter 5 · Lesson 5.1</span>
<h2>Portfolio theory &amp; diversification (Markowitz, CAPM)</h2>
<h3>Diversification reduces risk — but not all of it</h3>
<p>Combining assets whose returns are not perfectly correlated reduces the portfolio's overall volatility below the weighted average of the individual assets' volatilities. This eliminates <strong>unsystematic (idiosyncratic) risk</strong> — the part specific to one company or asset. It cannot eliminate <strong>systematic (market) risk</strong> — the part that affects the whole market (recessions, interest-rate shocks).</p>
<pre><code>Two-asset portfolio variance:
 σ²p = w1²σ1² + w2²σ2² + 2·w1·w2·ρ12·σ1·σ2
 w1, w2 = weights ; σ1, σ2 = volatilities ; ρ12 = correlation

Lower ρ12 (even negative) -> lower σp for the SAME expected return.
</code></pre>
<h3>The Markowitz efficient frontier</h3>
<p>Plotting expected return against risk (σ) for every possible portfolio combination traces out a curve. The <strong>efficient frontier</strong> is the set of portfolios that deliver the HIGHEST expected return for each level of risk (or equivalently, the LOWEST risk for each level of return) — no rational investor should hold a portfolio below this frontier.</p>
<h3>CAPM — pricing systematic risk</h3>
<p>The <strong>Capital Asset Pricing Model</strong> says an asset's expected return depends only on its <strong>systematic</strong> risk, measured by <strong>beta (β)</strong>:</p>
<pre><code>E(R) = Rf + β × [E(Rm) − Rf]

Rf     = risk-free rate
E(Rm)  = expected market return
β      = asset's sensitivity to market moves (β=1 moves with the market)
</code></pre>
<p>β &gt; 1 means the asset amplifies market moves (more systematic risk, higher expected return); β &lt; 1 means it dampens them. Unsystematic risk earns NO extra expected return, because it can be diversified away for free.</p>
<div class="callout"><span class="badge">Key insight</span> The market only rewards risk that CANNOT be diversified away. That is why CAPM prices assets on β, not on total volatility σ.</div>`,
    `<span class="eyebrow">RMI301 · Chương 5 · Bài 5.1</span>
<h2>Lý thuyết danh mục &amp; đa dạng hoá (Markowitz, CAPM)</h2>
<h3>Đa dạng hoá giảm rủi ro — nhưng không giảm hết</h3>
<p>Kết hợp các tài sản có lợi nhuận không tương quan hoàn hảo giúp giảm độ biến động tổng của danh mục xuống dưới mức trung bình có trọng số của độ biến động từng tài sản riêng lẻ. Điều này loại bỏ được <strong>rủi ro phi hệ thống (unsystematic/idiosyncratic risk)</strong> — phần rủi ro riêng của một công ty hay tài sản. Nó KHÔNG loại bỏ được <strong>rủi ro hệ thống (systematic/market risk)</strong> — phần ảnh hưởng cả thị trường (suy thoái, sốc lãi suất).</p>
<pre><code>Phương sai danh mục hai tài sản:
 σ²p = w1²σ1² + w2²σ2² + 2·w1·w2·ρ12·σ1·σ2
 w1, w2 = trọng số ; σ1, σ2 = độ biến động ; ρ12 = hệ số tương quan

ρ12 thấp hơn (thậm chí âm) -> σp thấp hơn với CÙNG lợi nhuận kỳ vọng.
</code></pre>
<h3>Biên hiệu quả Markowitz (efficient frontier)</h3>
<p>Vẽ lợi nhuận kỳ vọng theo rủi ro (σ) cho mọi kết hợp danh mục có thể sẽ vẽ ra một đường cong. <strong>Biên hiệu quả</strong> là tập hợp các danh mục cho lợi nhuận kỳ vọng CAO NHẤT ở mỗi mức rủi ro (hay tương đương, rủi ro THẤP NHẤT ở mỗi mức lợi nhuận) — không nhà đầu tư hợp lý nào nên giữ một danh mục nằm dưới biên này.</p>
<h3>CAPM — định giá rủi ro hệ thống</h3>
<p><strong>Capital Asset Pricing Model (CAPM)</strong> nói rằng lợi nhuận kỳ vọng của một tài sản chỉ phụ thuộc vào rủi ro <strong>hệ thống</strong> của nó, đo bằng <strong>beta (β)</strong>:</p>
<pre><code>E(R) = Rf + β × [E(Rm) − Rf]

Rf     = lãi suất phi rủi ro
E(Rm)  = lợi nhuận kỳ vọng của thị trường
β      = độ nhạy của tài sản với biến động thị trường (β=1 di chuyển cùng thị trường)
</code></pre>
<p>β &gt; 1 nghĩa là tài sản khuếch đại biến động thị trường (rủi ro hệ thống cao hơn, lợi nhuận kỳ vọng cao hơn); β &lt; 1 nghĩa là làm giảm nhẹ biến động đó. Rủi ro phi hệ thống KHÔNG được thưởng thêm lợi nhuận kỳ vọng, vì nó có thể được đa dạng hoá loại bỏ miễn phí.</p>
<div class="callout"><span class="badge">Ý chính</span> Thị trường chỉ thưởng cho rủi ro KHÔNG THỂ đa dạng hoá loại bỏ được. Đó là lý do CAPM định giá tài sản theo β, không theo tổng độ biến động σ.</div>`,
  ]]);

const c5q = quiz('rmi301-quiz-5', 'Quiz 5 — Portfolio theory & CAPM|||Quiz 5 — Lý thuyết danh mục & CAPM', [
  { id: 'q1', question: 'Đa dạng hoá danh mục giúp loại bỏ được loại rủi ro nào?', options: ['Rủi ro hệ thống (market risk)', 'Rủi ro phi hệ thống (unsystematic risk)', 'Cả hai loại rủi ro', 'Không loại bỏ được rủi ro nào'], correctIndex: 1, explanation: 'Đa dạng hoá loại bỏ được rủi ro phi hệ thống (riêng của từng tài sản); rủi ro hệ thống ảnh hưởng cả thị trường thì không loại bỏ được.' },
  { id: 'q2', question: 'Trong công thức CAPM E(R) = Rf + β×[E(Rm) − Rf], beta (β) đo lường điều gì?', options: ['Lãi suất phi rủi ro', 'Độ nhạy của tài sản với biến động của thị trường', 'Tổng độ biến động của tài sản', 'Tỷ lệ vỡ nợ của tài sản'], correctIndex: 1, explanation: 'β đo mức độ tài sản biến động cùng chiều và mạnh yếu ra sao so với thị trường chung — đó là rủi ro hệ thống.' },
  { id: 'q3', question: 'Biên hiệu quả Markowitz (efficient frontier) là gì?', options: ['Danh mục có beta = 1', 'Tập hợp danh mục cho lợi nhuận kỳ vọng cao nhất ở mỗi mức rủi ro', 'Danh mục chỉ gồm một tài sản duy nhất', 'Danh mục có lãi suất phi rủi ro cao nhất'], correctIndex: 1, explanation: 'Biên hiệu quả là tập các danh mục tối ưu: lợi nhuận kỳ vọng cao nhất cho mỗi mức rủi ro, hoặc rủi ro thấp nhất cho mỗi mức lợi nhuận.' },
]);

const c6 = doc('rmi301-6-1-npv-irr-real-options', '6.1 — Asset valuation & investment decisions (NPV, IRR, real options)|||6.1 — Định giá tài sản & ra quyết định đầu tư (NPV, IRR, real options)',
  'Giá trị thời gian của tiền; NPV (Net Present Value) — quy tắc quyết định; IRR (Internal Rate of Return); real options — giá trị của sự linh hoạt (trì hoãn, mở rộng, từ bỏ).',
  [[
    `<span class="eyebrow">RMI301 · Chapter 6 · Lesson 6.1</span>
<h2>Asset valuation &amp; investment decisions (NPV, IRR, real options)</h2>
<h3>Time value of money</h3>
<p>A dollar today is worth more than a dollar in the future, because today's dollar can be invested to earn a return. All valuation methods below discount future cash flows back to today at a required rate of return (the discount rate).</p>
<h3>Net Present Value (NPV)</h3>
<pre><code>NPV = Σ [CFt / (1+r)^t]  −  Initial Investment
 CFt = cash flow in period t ; r = discount rate ; t = period

Decision rule: NPV &gt; 0 -> ACCEPT the project (it creates value)
               NPV &lt; 0 -> REJECT the project (it destroys value)
</code></pre>
<h3>Internal Rate of Return (IRR)</h3>
<p><strong>IRR</strong> is the discount rate that makes NPV exactly zero — the project's own break-even rate of return. Decision rule: accept if IRR &gt; the required (hurdle) rate. NPV is generally the more reliable rule when the two disagree (e.g. for mutually exclusive projects or unconventional cash flows), because NPV directly measures value created in dollar terms.</p>
<h3>Real options — the value of flexibility</h3>
<p>Traditional NPV assumes a "now or never" decision. In reality, management often has <strong>flexibility</strong> that itself has value:</p>
<ul>
<li><strong>Option to delay</strong> — wait for more information before committing capital.</li>
<li><strong>Option to expand</strong> — scale up if the project succeeds.</li>
<li><strong>Option to abandon</strong> — cut losses and exit if the project fails.</li>
</ul>
<p>A project's TOTAL value = static NPV + value of its embedded real options. This is why a project with a slightly negative static NPV can still be worth pursuing, if the flexibility it creates (e.g. the option to expand later) is valuable enough.</p>
<div class="callout"><span class="badge">Practical link</span> The same discounting logic used for NPV also prices bonds, values firms, and — combined with option pricing (Chapter 7) — values real options.</div>`,
    `<span class="eyebrow">RMI301 · Chương 6 · Bài 6.1</span>
<h2>Định giá tài sản &amp; ra quyết định đầu tư (NPV, IRR, real options)</h2>
<h3>Giá trị thời gian của tiền</h3>
<p>Một đồng hôm nay có giá trị hơn một đồng trong tương lai, vì đồng hôm nay có thể được đầu tư để sinh lời. Mọi phương pháp định giá dưới đây đều chiết khấu dòng tiền tương lai về hiện tại theo một mức lợi nhuận yêu cầu (discount rate).</p>
<h3>Giá trị hiện tại thuần (NPV)</h3>
<pre><code>NPV = Σ [CFt / (1+r)^t]  −  Vốn đầu tư ban đầu
 CFt = dòng tiền tại thời điểm t ; r = tỷ lệ chiết khấu ; t = thời điểm

Quy tắc quyết định: NPV &gt; 0 -> CHẤP NHẬN dự án (tạo ra giá trị)
                     NPV &lt; 0 -> TỪ CHỐI dự án (phá huỷ giá trị)
</code></pre>
<h3>Tỷ suất sinh lời nội bộ (IRR)</h3>
<p><strong>IRR</strong> là mức tỷ lệ chiết khấu làm NPV bằng đúng 0 — tỷ suất sinh lời hoà vốn của chính dự án. Quy tắc quyết định: chấp nhận nếu IRR &gt; tỷ lệ yêu cầu (hurdle rate). NPV nói chung là quy tắc đáng tin hơn khi hai chỉ số mâu thuẫn (vd với các dự án loại trừ nhau hoặc dòng tiền bất thường), vì NPV đo trực tiếp giá trị tạo ra bằng số tiền cụ thể.</p>
<h3>Real options — giá trị của sự linh hoạt</h3>
<p>NPV truyền thống giả định quyết định "làm ngay hoặc không bao giờ làm". Trong thực tế, ban quản trị thường có <strong>sự linh hoạt</strong> mà bản thân nó cũng có giá trị:</p>
<ul>
<li><strong>Quyền trì hoãn (option to delay)</strong> — chờ thêm thông tin trước khi cam kết vốn.</li>
<li><strong>Quyền mở rộng (option to expand)</strong> — mở rộng quy mô nếu dự án thành công.</li>
<li><strong>Quyền từ bỏ (option to abandon)</strong> — cắt lỗ và rút khỏi dự án nếu dự án thất bại.</li>
</ul>
<p>Giá trị TỔNG của một dự án = NPV tĩnh + giá trị của các real option gắn liền. Đây là lý do một dự án có NPV tĩnh hơi âm vẫn có thể đáng theo đuổi, nếu sự linh hoạt nó tạo ra (vd quyền mở rộng sau này) đủ giá trị.</p>
<div class="callout"><span class="badge">Liên hệ thực tế</span> Cùng logic chiết khấu dùng cho NPV cũng dùng để định giá trái phiếu, định giá doanh nghiệp, và — kết hợp với định giá quyền chọn (Chương 7) — định giá real options.</div>`,
  ]]);

const c6q = quiz('rmi301-quiz-6', 'Quiz 6 — NPV, IRR & real options|||Quiz 6 — NPV, IRR & real options', [
  { id: 'q1', question: 'Theo quy tắc NPV, một dự án nên được chấp nhận khi nào?', options: ['NPV = 0', 'NPV &gt; 0', 'NPV &lt; 0', 'IRR = 0'], correctIndex: 1, explanation: 'NPV dương nghĩa là dự án tạo ra giá trị vượt vốn đầu tư ban đầu sau khi chiết khấu, nên nên được chấp nhận.' },
  { id: 'q2', question: 'IRR (Internal Rate of Return) được định nghĩa là gì?', options: ['Lãi suất phi rủi ro của thị trường', 'Tỷ lệ chiết khấu làm NPV của dự án bằng đúng 0', 'Tổng dòng tiền của dự án', 'Tỷ lệ lạm phát dự kiến'], correctIndex: 1, explanation: 'IRR là mức tỷ lệ chiết khấu mà tại đó NPV = 0 — tỷ suất sinh lời hoà vốn của chính dự án.' },
  { id: 'q3', question: 'Real option "quyền mở rộng" (option to expand) làm gì với giá trị một dự án?', options: ['Luôn làm giảm giá trị dự án', 'Có thể làm tăng giá trị tổng của dự án so với NPV tĩnh', 'Không ảnh hưởng gì đến giá trị dự án', 'Chỉ áp dụng cho dự án đã lỗ'], correctIndex: 1, explanation: 'Giá trị tổng = NPV tĩnh + giá trị các real option; quyền mở rộng khi dự án thành công làm tăng thêm giá trị này.' },
]);

const c7 = doc('rmi301-7-1-derivatives', '7.1 — Derivatives in risk management (forwards, futures, options, swaps)|||7.1 — Công cụ phái sinh trong quản trị rủi ro (forwards, futures, options, swaps)',
  'Forward vs futures; quyền chọn (call/put) và payoff; hợp đồng hoán đổi (swap) lãi suất & tiền tệ; dùng phái sinh để phòng ngừa (hedge) hay đầu cơ (speculate).',
  [[
    `<span class="eyebrow">RMI301 · Chapter 7 · Lesson 7.1</span>
<h2>Derivatives in risk management (forwards, futures, options, swaps)</h2>
<h3>Forwards vs futures</h3>
<p>Both are agreements to buy/sell an asset at a fixed price on a future date. A <strong>forward</strong> is a private, customizable contract (OTC) with counterparty (credit) risk; a <strong>futures</strong> contract is standardized, exchange-traded, and marked-to-market daily through a clearinghouse, which largely removes counterparty risk.</p>
<h3>Options — the right, not the obligation</h3>
<ul>
<li><strong>Call option</strong> — the right (not obligation) to BUY an asset at a fixed strike price K. Payoff at expiry = max(S − K, 0).</li>
<li><strong>Put option</strong> — the right to SELL an asset at strike K. Payoff at expiry = max(K − S, 0).</li>
</ul>
<pre><code>Call payoff:  max(S − K, 0)   -- profits if the price rises above K
Put payoff:   max(K − S, 0)   -- profits if the price falls below K

Because the holder can choose NOT to exercise, the option's payoff can
never be negative -- but the buyer pays an upfront premium for that right.
</code></pre>
<h3>Swaps</h3>
<p>A <strong>swap</strong> is an agreement to exchange cash flows over time. An <strong>interest rate swap</strong> typically exchanges a fixed rate for a floating rate on the same notional amount — used to convert floating-rate debt into fixed-rate debt (or vice versa). A <strong>currency swap</strong> exchanges principal and interest payments in two different currencies.</p>
<h3>Hedging vs speculation with the same instruments</h3>
<p>The exact same derivative can be used to <strong>hedge</strong> (reduce an existing exposure) or to <strong>speculate</strong> (take on a new directional bet with no underlying exposure to offset). The instrument is neutral — its risk role depends entirely on whether the user already holds the opposite exposure.</p>
<div class="callout"><span class="badge">Connection to Chapter 3</span> The forward contract used to hedge FX risk in Chapter 3 is exactly this family of instruments — Chapter 7 formalizes the tools, Chapter 3 showed one use of them.</div>`,
    `<span class="eyebrow">RMI301 · Chương 7 · Bài 7.1</span>
<h2>Công cụ phái sinh trong quản trị rủi ro (forwards, futures, options, swaps)</h2>
<h3>Forward vs futures</h3>
<p>Cả hai đều là thoả thuận mua/bán một tài sản ở mức giá cố định vào một ngày trong tương lai. <strong>Forward (kỳ hạn)</strong> là hợp đồng riêng, tuỳ biến (OTC), có rủi ro đối tác (tín dụng); <strong>futures (tương lai)</strong> là hợp đồng chuẩn hoá, giao dịch trên sàn, được định giá lại theo thị trường (mark-to-market) hằng ngày qua một trung tâm thanh toán, nên loại bỏ được phần lớn rủi ro đối tác.</p>
<h3>Options (quyền chọn) — QUYỀN, không phải NGHĨA VỤ</h3>
<ul>
<li><strong>Call option (quyền chọn mua)</strong> — quyền (không phải nghĩa vụ) MUA một tài sản ở mức giá thực hiện K. Payoff khi đáo hạn = max(S − K, 0).</li>
<li><strong>Put option (quyền chọn bán)</strong> — quyền BÁN một tài sản ở mức giá thực hiện K. Payoff khi đáo hạn = max(K − S, 0).</li>
</ul>
<pre><code>Payoff call:  max(S − K, 0)   -- có lợi nếu giá tăng vượt K
Payoff put:   max(K − S, 0)   -- có lợi nếu giá giảm dưới K

Vì người nắm quyền có thể chọn KHÔNG thực hiện, payoff của option
không bao giờ âm -- nhưng người mua phải trả một khoản phí (premium)
trước để có được quyền đó.
</code></pre>
<h3>Swaps (hoán đổi)</h3>
<p>Một <strong>swap</strong> là thoả thuận trao đổi dòng tiền theo thời gian. Một <strong>interest rate swap (hoán đổi lãi suất)</strong> thường trao đổi lãi suất cố định với lãi suất thả nổi trên cùng một số vốn danh nghĩa — dùng để chuyển nợ lãi thả nổi thành nợ lãi cố định (hoặc ngược lại). Một <strong>currency swap (hoán đổi tiền tệ)</strong> trao đổi cả gốc và lãi bằng hai loại tiền khác nhau.</p>
<h3>Hedging vs đầu cơ với cùng một công cụ</h3>
<p>Đúng cùng một công cụ phái sinh có thể được dùng để <strong>phòng ngừa (hedge)</strong> (giảm phơi nhiễm hiện có) hoặc để <strong>đầu cơ (speculate)</strong> (mở một cược có định hướng mới, không có phơi nhiễm gốc để bù trừ). Bản thân công cụ trung tính — vai trò rủi ro của nó phụ thuộc hoàn toàn vào việc người dùng đã có phơi nhiễm ngược lại hay chưa.</p>
<div class="callout"><span class="badge">Liên hệ Chương 3</span> Hợp đồng forward dùng để phòng ngừa rủi ro tỷ giá ở Chương 3 chính là nhóm công cụ này — Chương 7 hệ thống hoá công cụ, Chương 3 đã cho thấy một cách dùng cụ thể.</div>`,
  ]]);

const c7q = quiz('rmi301-quiz-7', 'Quiz 7 — Derivatives|||Quiz 7 — Công cụ phái sinh', [
  { id: 'q1', question: 'Khác biệt chính giữa forward và futures là gì?', options: ['Forward giao dịch trên sàn, futures là hợp đồng riêng OTC', 'Futures chuẩn hoá, giao dịch trên sàn và mark-to-market hằng ngày; forward là hợp đồng riêng OTC', 'Cả hai đều không có rủi ro đối tác', 'Forward chỉ dùng cho cổ phiếu'], correctIndex: 1, explanation: 'Futures chuẩn hoá, giao dịch qua sàn/trung tâm thanh toán và được mark-to-market hằng ngày; forward là hợp đồng OTC tuỳ biến, có rủi ro đối tác cao hơn.' },
  { id: 'q2', question: 'Payoff của một call option khi đáo hạn được tính bằng công thức nào?', options: ['max(K − S, 0)', 'max(S − K, 0)', 'S − K (luôn nhận giá trị này)', 'K − S (luôn nhận giá trị này)'], correctIndex: 1, explanation: 'Call option có lợi khi giá tài sản S vượt giá thực hiện K, payoff = max(S − K, 0), không bao giờ âm.' },
  { id: 'q3', question: 'Một interest rate swap (hoán đổi lãi suất) thường được dùng để làm gì?', options: ['Chuyển đổi nợ lãi thả nổi thành nợ lãi cố định (hoặc ngược lại)', 'Mua bán cổ phiếu trên sàn', 'Bảo hiểm rủi ro vỡ nợ', 'Định giá quyền chọn'], correctIndex: 0, explanation: 'Interest rate swap trao đổi dòng tiền lãi cố định và lãi thả nổi trên cùng vốn danh nghĩa, thường dùng để chuyển đổi loại lãi suất của một khoản nợ.' },
]);

const c8 = doc('rmi301-8-1-erm-basel', '8.1 — Integrated ERM, Basel & governance framework|||8.1 — Quản trị rủi ro doanh nghiệp tích hợp (ERM), Basel & khung quản trị',
  'Ba trụ cột Basel II/III (vốn tối thiểu, giám sát, kỷ luật thị trường); LCR/vốn Basel III; khung COSO ERM; quản trị: hội đồng quản trị, ủy ban rủi ro, văn hoá rủi ro.',
  [[
    `<span class="eyebrow">RMI301 · Chapter 8 · Lesson 8.1</span>
<h2>Integrated ERM, Basel &amp; governance framework</h2>
<h3>The Basel Accords</h3>
<p>The <strong>Basel Committee on Banking Supervision</strong> sets global standards so banks hold enough capital to absorb losses without collapsing — the same regulator-facing discipline that Chapters 2 and 4 (VaR, credit risk) exist to feed. Basel evolved: <strong>Basel I</strong> (1988, simple risk-weighted capital ratio) → <strong>Basel II</strong> (2004, risk-sensitive, three pillars) → <strong>Basel III</strong> (post-2008 crisis, higher &amp; better-quality capital plus liquidity rules like the LCR from Chapter 4).</p>
<h3>Basel II's three pillars</h3>
<pre><code>Pillar 1 -> Minimum capital requirements (credit, market, operational risk)
Pillar 2 -> Supervisory review (regulators assess a bank's own risk models)
Pillar 3 -> Market discipline (mandatory public risk disclosure)
</code></pre>
<h3>The COSO ERM framework</h3>
<p>Beyond banking, the <strong>COSO ERM framework</strong> gives any organization a common structure: (1) governance &amp; culture, (2) strategy &amp; objective-setting, (3) performance (identify, assess, prioritize, respond to risk), (4) review &amp; revision, (5) information, communication &amp; reporting. It ties every chapter of this course together — risk types (Ch.1), measurement (Ch.2-4), portfolio &amp; valuation decisions (Ch.5-6), and hedging tools (Ch.7) all feed into this one integrated process.</p>
<h3>Governance — who is accountable</h3>
<ul>
<li><strong>Board of Directors</strong> — sets overall risk appetite, approves the risk framework.</li>
<li><strong>Risk committee</strong> — oversees risk management execution, reviews limit breaches.</li>
<li><strong>Chief Risk Officer (CRO)</strong> — independent of business lines, reports directly to the board/risk committee.</li>
<li><strong>Risk culture</strong> — the shared values and behaviors that determine whether risk limits are actually respected day-to-day, not just written on paper.</li>
</ul>
<div class="callout"><span class="badge">Course closing idea</span> Every tool in this course — VaR, hedging, CAPM, NPV, derivatives — is only as good as the GOVERNANCE that decides how it is used, monitored and enforced. Numbers do not manage risk; people and processes do.</div>`,
    `<span class="eyebrow">RMI301 · Chương 8 · Bài 8.1</span>
<h2>Quản trị rủi ro doanh nghiệp tích hợp (ERM), Basel &amp; khung quản trị</h2>
<h3>Các hiệp ước Basel</h3>
<p><strong>Basel Committee on Banking Supervision</strong> đặt chuẩn toàn cầu để ngân hàng giữ đủ vốn hấp thụ thua lỗ mà không sụp đổ — đúng kỷ luật hướng tới cơ quan quản lý mà Chương 2 và 4 (VaR, rủi ro tín dụng) tồn tại để phục vụ. Basel phát triển qua các giai đoạn: <strong>Basel I</strong> (1988, tỷ lệ vốn theo trọng số rủi ro đơn giản) → <strong>Basel II</strong> (2004, nhạy với rủi ro, ba trụ cột) → <strong>Basel III</strong> (sau khủng hoảng 2008, yêu cầu vốn cao hơn &amp; chất lượng tốt hơn cùng quy định thanh khoản như LCR ở Chương 4).</p>
<h3>Ba trụ cột của Basel II</h3>
<pre><code>Trụ cột 1 -> Yêu cầu vốn tối thiểu (rủi ro tín dụng, thị trường, vận hành)
Trụ cột 2 -> Giám sát của cơ quan quản lý (đánh giá mô hình rủi ro nội bộ ngân hàng)
Trụ cột 3 -> Kỷ luật thị trường (bắt buộc công bố thông tin rủi ro ra công chúng)
</code></pre>
<h3>Khung COSO ERM</h3>
<p>Vượt ra ngoài ngành ngân hàng, <strong>khung COSO ERM</strong> cho mọi tổ chức một cấu trúc chung: (1) quản trị &amp; văn hoá, (2) chiến lược &amp; xác định mục tiêu, (3) hiệu quả thực hiện (nhận diện, đánh giá, ưu tiên, ứng phó rủi ro), (4) rà soát &amp; điều chỉnh, (5) thông tin, truyền thông &amp; báo cáo. Khung này kết nối mọi chương của môn học lại với nhau — các loại rủi ro (Chương 1), đo lường (Chương 2-4), quyết định danh mục &amp; định giá (Chương 5-6), và công cụ phòng ngừa (Chương 7) đều chảy vào đúng một quy trình tích hợp này.</p>
<h3>Quản trị — ai chịu trách nhiệm</h3>
<ul>
<li><strong>Hội đồng quản trị (Board of Directors)</strong> — đặt mức chấp nhận rủi ro tổng thể, phê duyệt khung quản trị rủi ro.</li>
<li><strong>Ủy ban rủi ro (risk committee)</strong> — giám sát việc thực thi quản trị rủi ro, rà soát các vi phạm hạn mức.</li>
<li><strong>Giám đốc rủi ro (Chief Risk Officer, CRO)</strong> — độc lập với các đơn vị kinh doanh, báo cáo trực tiếp cho hội đồng quản trị/ủy ban rủi ro.</li>
<li><strong>Văn hoá rủi ro (risk culture)</strong> — giá trị và hành vi chung quyết định hạn mức rủi ro có thực sự được tuân thủ hằng ngày hay không, không chỉ nằm trên giấy.</li>
</ul>
<div class="callout"><span class="badge">Ý kết môn</span> Mọi công cụ trong môn học này — VaR, hedging, CAPM, NPV, phái sinh — chỉ tốt bằng đúng phần QUẢN TRỊ quyết định cách nó được dùng, giám sát và thực thi. Con số không tự quản trị rủi ro — con người và quy trình mới làm điều đó.</div>`,
  ]]);

const c8q = quiz('rmi301-quiz-8', 'Quiz 8 — ERM & Basel|||Quiz 8 — ERM & Basel', [
  { id: 'q1', question: 'Trụ cột nào của Basel II yêu cầu ngân hàng công bố thông tin rủi ro ra công chúng?', options: ['Trụ cột 1 — Yêu cầu vốn tối thiểu', 'Trụ cột 2 — Giám sát của cơ quan quản lý', 'Trụ cột 3 — Kỷ luật thị trường', 'Không trụ cột nào'], correctIndex: 2, explanation: 'Trụ cột 3 (market discipline) bắt buộc công bố thông tin rủi ro công khai để thị trường tự giám sát ngân hàng.' },
  { id: 'q2', question: 'Trong khung COSO ERM, thành phần nào đứng đầu, làm nền cho toàn bộ khung?', options: ['Thông tin & báo cáo', 'Quản trị & văn hoá (governance & culture)', 'Rà soát & điều chỉnh', 'Chiến lược & mục tiêu'], correctIndex: 1, explanation: 'Governance & culture là nền tảng đầu tiên của COSO ERM — mọi thành phần khác đều dựa trên đó.' },
  { id: 'q3', question: 'Vai trò của Chief Risk Officer (CRO) trong cấu trúc quản trị rủi ro là gì?', options: ['Báo cáo cho trưởng đơn vị kinh doanh mình phụ trách', 'Độc lập với các đơn vị kinh doanh, báo cáo trực tiếp cho hội đồng quản trị/ủy ban rủi ro', 'Chỉ chịu trách nhiệm về lợi nhuận', 'Không có vai trò chính thức trong quản trị rủi ro'], correctIndex: 1, explanation: 'CRO cần độc lập với các đơn vị kinh doanh để giám sát rủi ro khách quan, báo cáo trực tiếp lên cấp cao nhất.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'RMI301',
    slug: 'rmi301-financial-risk-management-and-investment-decision-making',
    title: 'Financial risk management and investment decision making',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/RMI301.webp',
    shortDescription: 'Financial risk management & investment decisions: risk types & ERM, volatility/VaR/Expected Shortfall, market risk & hedging, credit & liquidity risk, Markowitz & CAPM, NPV/IRR & real options, derivatives, Basel & ERM framework.|||Quản trị rủi ro tài chính & ra quyết định đầu tư: các loại rủi ro & ERM, độ biến động/VaR/Expected Shortfall, rủi ro thị trường & phòng ngừa, rủi ro tín dụng & thanh khoản, Markowitz & CAPM, NPV/IRR & real options, phái sinh, khung Basel & ERM.',
    description: 'Môn <strong>RMI301 — Financial Risk Management and Investment Decision Making</strong> (kỳ 4, khối Quản trị Kinh doanh) đi từ <strong>tổng quan rủi ro tài chính &amp; ERM</strong> → <strong>đo lường rủi ro</strong> (độ biến động, VaR, Expected Shortfall) → <strong>rủi ro thị trường &amp; phòng ngừa</strong> → <strong>rủi ro tín dụng &amp; thanh khoản</strong> → <strong>lý thuyết danh mục</strong> (Markowitz, CAPM) → <strong>định giá &amp; ra quyết định đầu tư</strong> (NPV, IRR, real options) → <strong>công cụ phái sinh</strong> (forwards, futures, options, swaps) → <strong>ERM tích hợp &amp; Basel</strong>. Song ngữ, có ví dụ tính toán và quiz mỗi chương. Tham khảo: <em>Financial Risk Manager Handbook</em> (Jorion), <em>Options, Futures, and Other Derivatives</em> (Hull), <em>Investments</em> (Bodie/Kane/Marcus).',
    whatYouLearn: 'Các loại rủi ro tài chính & quy trình ERM; đo lường rủi ro (volatility, VaR, Expected Shortfall); rủi ro thị trường & hedging (forward); rủi ro tín dụng (PD/LGD/EAD, Expected Loss) & rủi ro thanh khoản (LCR); lý thuyết danh mục Markowitz, CAPM & beta; NPV, IRR & real options; forwards/futures/options/swaps trong quản trị rủi ro; ERM tích hợp, ba trụ cột Basel & khung quản trị (governance).',
    requirements: 'Kiến thức nền tài chính doanh nghiệp & xác suất thống kê cơ bản. Không cần công cụ đặc biệt — bảng tính (Excel/Google Sheets) là đủ cho các ví dụ tính toán trong môn.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách tham khảo (Jorion, Hull, Bodie/Kane/Marcus), tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Rủi ro tài chính là gì, vì sao phải quản trị, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan & ERM|||Chapter 1 — Overview & ERM', description: 'Bốn loại rủi ro, quy trình quản trị rủi ro, risk appetite, ERM.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Đo lường rủi ro: VaR & ES|||Chapter 2 — Risk measurement: VaR & ES', description: 'Volatility, VaR (parametric/historical/Monte Carlo), Expected Shortfall.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Rủi ro thị trường & hedging|||Chapter 3 — Market risk & hedging', description: 'Bốn yếu tố rủi ro thị trường, hedge ratio, ví dụ forward FX.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Rủi ro tín dụng & thanh khoản|||Chapter 4 — Credit & liquidity risk', description: 'PD/LGD/EAD, Expected Loss, credit spread, LCR.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Danh mục & CAPM|||Chapter 5 — Portfolio theory & CAPM', description: 'Đa dạng hoá, biên hiệu quả Markowitz, CAPM & beta.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Định giá & đầu tư|||Chapter 6 — Valuation & investment', description: 'NPV, IRR, real options (trì hoãn/mở rộng/từ bỏ).', lessons: [c6, c6q] },
    { title: 'Chương 7 — Công cụ phái sinh|||Chapter 7 — Derivatives', description: 'Forward/futures, options (call/put), swaps, hedging vs đầu cơ.', lessons: [c7, c7q] },
    { title: 'Chương 8 — ERM tích hợp & Basel|||Chapter 8 — Integrated ERM & Basel', description: 'Ba trụ cột Basel, COSO ERM, quản trị & văn hoá rủi ro.', lessons: [c8, c8q] },
  ],
};
