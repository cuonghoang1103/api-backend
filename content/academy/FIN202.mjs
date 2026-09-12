/**
 * FIN202 — Principles of Corporate Finance (Nguyên lý tài chính doanh nghiệp). Khối QTKD, kỳ 2.
 * Bám cấu trúc giáo trình tài chính doanh nghiệp nhập môn chuẩn (vd Ross, Westerfield & Jordan —
 * Fundamentals of Corporate Finance; Brealey, Myers & Marcus): báo cáo & tỷ số tài chính,
 * giá trị thời gian của tiền, định giá trái phiếu/cổ phiếu, rủi ro–CAPM–WACC, thẩm định dự án,
 * cơ cấu vốn, vốn lưu động. Song ngữ + ví dụ số (đã kiểm bằng máy; số liệu là GIẢ ĐỊNH) + bài tập + quiz.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('fin202-0-1-overview', 'Course overview: what financial managers decide|||Tổng quan: nhà quản trị tài chính quyết định gì',
  'Ba quyết định của tài chính doanh nghiệp, mục tiêu tối đa hoá giá trị cho cổ đông, vấn đề người đại diện, loại hình doanh nghiệp, vai trò của thị trường tài chính, lộ trình môn.',
  [[
    `<span class="eyebrow">FIN202 · Lesson 0.1 · Overview</span>
<h2>Principles of Corporate Finance</h2>
<p class="lead">Corporate finance studies how a firm raises money and how it spends it. Every financial manager answers three questions — and the answers decide whether the business creates or destroys value.</p>
<h3>The three core decisions</h3>
<table>
<tr><th>Decision</th><th>Question</th><th>Tool you will learn</th></tr>
<tr><td>Capital budgeting (investment)</td><td>Which long-term projects and assets should we invest in?</td><td>NPV, IRR, payback</td></tr>
<tr><td>Capital structure (financing)</td><td>How should we pay for them — debt or equity, and in what mix?</td><td>Cost of capital, leverage</td></tr>
<tr><td>Working capital management</td><td>How do we manage day-to-day cash, inventory, receivables and payables?</td><td>Operating and cash cycles</td></tr>
</table>
<h3>The goal: maximize the value of the firm for its owners</h3>
<p>For a corporation, the goal of financial management is to <strong>maximize the current value per share</strong> of existing stock. Profit alone is not enough: it ignores <em>timing</em> (money today is worth more than money later) and <em>risk</em>. Because shareholders own the firm but managers run it, an <strong>agency problem</strong> can arise; it is reduced through corporate governance, managers' pay linked to performance, the board of directors and the threat of takeovers. Value must also be created legally and ethically.</p>
<h3>Forms of business and financial markets</h3>
<p>A <strong>sole proprietorship</strong> and a <strong>partnership</strong> are simple but carry unlimited liability; a <strong>corporation</strong> (in Vietnam, joint-stock and limited-liability companies) offers limited liability, easy transfer of ownership and access to capital markets. Firms raise money in <strong>primary</strong> markets and investors trade securities in <strong>secondary</strong> markets; banks and other intermediaries channel savings to borrowers.</p>
<h3>Roadmap</h3>
<p>Part 1: financial statements and ratio analysis · Part 2: the time value of money · Part 3: valuing bonds and stocks, risk and return, the cost of capital · Part 4: capital budgeting, capital structure and working capital. All examples use illustrative (assumed) numbers and have been checked.</p>
<div class="callout"><span class="badge">One idea to keep</span> A dollar today is worth more than a dollar tomorrow, and a safe dollar is worth more than a risky one. Almost everything in this course follows from that sentence.</div>`,
    `<span class="eyebrow">FIN202 · Bài 0.1 · Tổng quan</span>
<h2>Nguyên lý tài chính doanh nghiệp</h2>
<p class="lead">Tài chính doanh nghiệp nghiên cứu cách một doanh nghiệp huy động vốn và sử dụng vốn. Mọi nhà quản trị tài chính đều trả lời ba câu hỏi — và câu trả lời quyết định doanh nghiệp tạo ra hay phá huỷ giá trị.</p>
<h3>Ba quyết định cốt lõi</h3>
<table>
<tr><th>Quyết định</th><th>Câu hỏi</th><th>Công cụ sẽ học</th></tr>
<tr><td>Hoạch định ngân sách vốn (đầu tư)</td><td>Nên đầu tư vào dự án, tài sản dài hạn nào?</td><td>NPV, IRR, thời gian hoàn vốn</td></tr>
<tr><td>Cơ cấu vốn (tài trợ)</td><td>Nên tài trợ bằng gì — nợ hay vốn chủ sở hữu, theo tỷ lệ nào?</td><td>Chi phí vốn, đòn bẩy</td></tr>
<tr><td>Quản trị vốn lưu động</td><td>Quản lý tiền, hàng tồn kho, khoản phải thu, phải trả hằng ngày thế nào?</td><td>Chu kỳ kinh doanh và chu kỳ tiền mặt</td></tr>
</table>
<h3>Mục tiêu: tối đa hoá giá trị doanh nghiệp cho chủ sở hữu</h3>
<p>Với công ty cổ phần, mục tiêu của quản trị tài chính là <strong>tối đa hoá giá trị hiện tại của mỗi cổ phần</strong>. Chỉ nhìn lợi nhuận là chưa đủ: lợi nhuận bỏ qua <em>thời điểm</em> (tiền hôm nay giá trị hơn tiền mai sau) và <em>rủi ro</em>. Vì cổ đông sở hữu còn nhà quản lý điều hành, có thể phát sinh <strong>vấn đề người đại diện</strong>; vấn đề này được giảm bớt nhờ quản trị công ty, thù lao gắn với kết quả, hội đồng quản trị và nguy cơ bị thâu tóm. Giá trị cũng phải được tạo ra một cách hợp pháp và có đạo đức.</p>
<h3>Loại hình doanh nghiệp và thị trường tài chính</h3>
<p><strong>Doanh nghiệp tư nhân</strong> và <strong>công ty hợp danh</strong> đơn giản nhưng chịu trách nhiệm vô hạn; <strong>công ty</strong> (ở Việt Nam là công ty cổ phần và công ty trách nhiệm hữu hạn) có trách nhiệm hữu hạn, dễ chuyển nhượng quyền sở hữu và tiếp cận được thị trường vốn. Doanh nghiệp huy động vốn trên thị trường <strong>sơ cấp</strong>, nhà đầu tư mua bán chứng khoán trên thị trường <strong>thứ cấp</strong>; ngân hàng và các trung gian khác chuyển tiền tiết kiệm tới người cần vốn.</p>
<h3>Lộ trình</h3>
<p>Phần 1: báo cáo tài chính và phân tích tỷ số · Phần 2: giá trị thời gian của tiền · Phần 3: định giá trái phiếu và cổ phiếu, rủi ro và lợi nhuận, chi phí vốn · Phần 4: thẩm định dự án, cơ cấu vốn và vốn lưu động. Mọi ví dụ dùng số liệu minh hoạ (giả định) và đã được kiểm tra.</p>
<div class="callout"><span class="badge">Một ý cần giữ</span> Một đồng hôm nay đáng giá hơn một đồng ngày mai, và một đồng chắc chắn đáng giá hơn một đồng rủi ro. Gần như mọi thứ trong môn học đều suy ra từ câu này.</div>`,
  ]]);

const c1 = doc('fin202-1-1-statements-cash-flow', '1.1 — Financial statements & cash flow|||1.1 — Báo cáo tài chính & dòng tiền',
  'Đọc bảng cân đối và báo cáo kết quả kinh doanh dưới góc nhìn tài chính, giá trị sổ sách và giá trị thị trường, thuế, dòng tiền hoạt động (OCF) và dòng tiền tự do từ tài sản, có ví dụ số.',
  [[
    `<span class="eyebrow">FIN202 · Part 1 · Lesson 1.1</span>
<h2>Financial statements &amp; cash flow</h2>
<h3>A company in two statements</h3>
<p>Illustrative (assumed) figures for Alpha Co., in $ thousands:</p>
<pre><code>BALANCE SHEET (end of year)
Cash                    50     Accounts payable        120
Accounts receivable    150     Short-term notes         80
Inventory              200     Current liabilities     200
Current assets         400     Long-term debt          300
Net fixed assets       600     Equity                  500
Total assets         1,000     Total L + E           1,000

INCOME STATEMENT
Sales                        1,200
− Cost of goods sold          (720)
− Selling, general, admin     (180)
− Depreciation                 (60)
= EBIT                          240
− Interest                     (30)
= Taxable income                210
− Tax (20%)                    (42)
= Net income                    168   (dividends 68, retained 100)</code></pre>
<h3>What finance looks at differently</h3>
<ul>
<li><strong>Book vs market value.</strong> Balance-sheet values are mostly historical costs; what matters for decisions is the <em>market</em> value of assets and equity.</li>
<li><strong>Cash, not accounting income.</strong> Depreciation is a non-cash expense; revenue booked on credit is not cash yet.</li>
<li><strong>Taxes matter.</strong> Interest is tax-deductible, which is one reason debt can be attractive (Part 4).</li>
</ul>
<h3>Operating cash flow and free cash flow</h3>
<pre><code>Operating cash flow (OCF) = EBIT + Depreciation − Taxes
                          = 240 + 60 − 42 = 258
Cash flow from assets (free cash flow)
    = OCF − Net capital spending − Change in net working capital
    = 258 − 100 − 20 = 138      (assumed: capex net 100, NWC up 20)</code></pre>
<p>Free cash flow is the cash the firm's assets generate after paying for their own growth — the amount available to pay creditors and shareholders. It is the quantity that valuation and capital budgeting are built on.</p>
<div class="callout"><span class="badge">Watch out</span> A profitable firm can run out of cash if its receivables and inventory grow faster than its sales collections — profit and cash flow are different things.</div>`,
    `<span class="eyebrow">FIN202 · Phần 1 · Bài 1.1</span>
<h2>Báo cáo tài chính &amp; dòng tiền</h2>
<h3>Một doanh nghiệp qua hai báo cáo</h3>
<p>Số liệu minh hoạ (giả định) của Công ty Alpha, đơn vị nghìn $:</p>
<pre><code>BẢNG CÂN ĐỐI KẾ TOÁN (cuối năm)
Tiền                    50     Phải trả người bán      120
Phải thu khách hàng    150     Vay ngắn hạn             80
Hàng tồn kho           200     Nợ ngắn hạn             200
Tài sản ngắn hạn       400     Nợ dài hạn              300
TSCĐ thuần             600     Vốn chủ sở hữu          500
Tổng tài sản         1.000     Tổng nguồn vốn        1.000

BÁO CÁO KẾT QUẢ KINH DOANH
Doanh thu                    1.200
− Giá vốn hàng bán            (720)
− Chi phí bán hàng, quản lý   (180)
− Khấu hao                     (60)
= EBIT (lợi nhuận trước lãi vay và thuế)   240
− Lãi vay                      (30)
= Thu nhập chịu thuế           210
− Thuế (20%)                   (42)
= Lợi nhuận ròng               168   (cổ tức 68, giữ lại 100)</code></pre>
<h3>Tài chính nhìn khác kế toán ở đâu</h3>
<ul>
<li><strong>Giá trị sổ sách và giá trị thị trường.</strong> Số trên bảng cân đối chủ yếu là giá gốc; điều quan trọng cho quyết định là giá trị <em>thị trường</em> của tài sản và vốn chủ sở hữu.</li>
<li><strong>Tiền, không phải lợi nhuận kế toán.</strong> Khấu hao là chi phí không bằng tiền; doanh thu bán chịu chưa phải là tiền.</li>
<li><strong>Thuế quan trọng.</strong> Lãi vay được trừ khi tính thuế, một lý do khiến nợ có thể hấp dẫn (Phần 4).</li>
</ul>
<h3>Dòng tiền hoạt động và dòng tiền tự do</h3>
<pre><code>Dòng tiền hoạt động (OCF) = EBIT + Khấu hao − Thuế
                          = 240 + 60 − 42 = 258
Dòng tiền từ tài sản (dòng tiền tự do)
    = OCF − Chi đầu tư TSCĐ thuần − Thay đổi vốn lưu động ròng
    = 258 − 100 − 20 = 138      (giả định: chi đầu tư thuần 100, vốn lưu động tăng 20)</code></pre>
<p>Dòng tiền tự do là tiền mà tài sản của doanh nghiệp tạo ra sau khi đã chi cho sự tăng trưởng của chính chúng — phần có thể trả cho chủ nợ và cổ đông. Đây là đại lượng mà việc định giá và thẩm định dự án dựa vào.</p>
<div class="callout"><span class="badge">Cẩn thận</span> Một doanh nghiệp có lãi vẫn có thể cạn tiền nếu khoản phải thu và hàng tồn kho tăng nhanh hơn tiền thu về — lợi nhuận và dòng tiền là hai thứ khác nhau.</div>`,
  ]]);

const c2 = doc('fin202-1-2-ratios', '1.2 — Ratio analysis & the DuPont identity|||1.2 — Phân tích tỷ số & đẳng thức DuPont',
  'Năm nhóm tỷ số tài chính (thanh khoản, đòn bẩy, hiệu quả hoạt động, khả năng sinh lời, giá thị trường) tính trên số liệu Công ty Alpha, phân tích ROE bằng đẳng thức DuPont và giới hạn của phân tích tỷ số.',
  [[
    `<span class="eyebrow">FIN202 · Part 1 · Lesson 1.2</span>
<h2>Ratio analysis &amp; the DuPont identity</h2>
<p>Ratios make firms of different sizes comparable. Using Alpha Co. (lesson 1.1):</p>
<table>
<tr><th>Group</th><th>Ratio</th><th>Alpha</th></tr>
<tr><td rowspan="2">Liquidity</td><td>Current ratio = current assets / current liabilities</td><td>400 / 200 = 2.0</td></tr>
<tr><td>Quick ratio = (current assets − inventory) / current liabilities</td><td>200 / 200 = 1.0</td></tr>
<tr><td rowspan="3">Leverage</td><td>Debt ratio = total debt / total assets</td><td>500 / 1,000 = 0.50</td></tr>
<tr><td>Equity multiplier = total assets / equity</td><td>1,000 / 500 = 2.0</td></tr>
<tr><td>Times interest earned = EBIT / interest</td><td>240 / 30 = 8.0</td></tr>
<tr><td rowspan="3">Efficiency</td><td>Inventory turnover = COGS / inventory (days = 365 / turnover)</td><td>3.6 times · 101.4 days</td></tr>
<tr><td>Receivables turnover = sales / receivables (days = 365 / turnover)</td><td>8.0 times · 45.6 days</td></tr>
<tr><td>Total asset turnover = sales / total assets</td><td>1.2</td></tr>
<tr><td rowspan="3">Profitability</td><td>Profit margin = net income / sales</td><td>168 / 1,200 = 14%</td></tr>
<tr><td>Return on assets (ROA) = net income / total assets</td><td>16.8%</td></tr>
<tr><td>Return on equity (ROE) = net income / equity</td><td>33.6%</td></tr>
<tr><td>Market value</td><td>EPS = 168 / 100 shares = 1.68; P/E = 20 / 1.68; market-to-book = 2,000 / 500</td><td>P/E 11.9 · M/B 4.0 (price $20, assumed)</td></tr>
</table>
<h3>The DuPont identity</h3>
<pre><code>ROE = Profit margin x Total asset turnover x Equity multiplier
    = (NI / Sales) x (Sales / Assets) x (Assets / Equity)
Alpha: 14% x 1.2 x 2.0 = 33.6%   ✓</code></pre>
<p>DuPont tells you <em>why</em> ROE is high or low: operating efficiency (margin), asset use efficiency (turnover) or financial leverage (equity multiplier). Two firms with the same ROE can have very different risk if one gets there through heavy borrowing.</p>
<h3>Using ratios well</h3>
<p>Compare against the firm's own history (<em>trend analysis</em>) and against peers in the same industry (<em>peer group analysis</em>). Beware differences in accounting methods, seasonal businesses, one-off items and firms that operate in several industries.</p>
<div class="callout"><span class="badge">Remember</span> A ratio is a question, not an answer. A current ratio of 2.0 is comfortable for a retailer and may be excessive for a firm that collects cash instantly.</div>`,
    `<span class="eyebrow">FIN202 · Phần 1 · Bài 1.2</span>
<h2>Phân tích tỷ số &amp; đẳng thức DuPont</h2>
<p>Tỷ số giúp so sánh các doanh nghiệp có quy mô khác nhau. Dùng số liệu Công ty Alpha (bài 1.1):</p>
<table>
<tr><th>Nhóm</th><th>Tỷ số</th><th>Alpha</th></tr>
<tr><td rowspan="2">Thanh khoản</td><td>Thanh toán hiện hành = tài sản ngắn hạn / nợ ngắn hạn</td><td>400 / 200 = 2,0</td></tr>
<tr><td>Thanh toán nhanh = (tài sản ngắn hạn − hàng tồn kho) / nợ ngắn hạn</td><td>200 / 200 = 1,0</td></tr>
<tr><td rowspan="3">Đòn bẩy</td><td>Tỷ số nợ = tổng nợ / tổng tài sản</td><td>500 / 1.000 = 0,50</td></tr>
<tr><td>Hệ số nhân vốn chủ = tổng tài sản / vốn chủ sở hữu</td><td>1.000 / 500 = 2,0</td></tr>
<tr><td>Khả năng trả lãi = EBIT / lãi vay</td><td>240 / 30 = 8,0</td></tr>
<tr><td rowspan="3">Hiệu quả hoạt động</td><td>Vòng quay hàng tồn kho = giá vốn / hàng tồn kho (số ngày = 365 / vòng quay)</td><td>3,6 vòng · 101,4 ngày</td></tr>
<tr><td>Vòng quay phải thu = doanh thu / phải thu (số ngày = 365 / vòng quay)</td><td>8,0 vòng · 45,6 ngày</td></tr>
<tr><td>Vòng quay tổng tài sản = doanh thu / tổng tài sản</td><td>1,2</td></tr>
<tr><td rowspan="3">Khả năng sinh lời</td><td>Biên lợi nhuận = lợi nhuận ròng / doanh thu</td><td>168 / 1.200 = 14%</td></tr>
<tr><td>ROA = lợi nhuận ròng / tổng tài sản</td><td>16,8%</td></tr>
<tr><td>ROE = lợi nhuận ròng / vốn chủ sở hữu</td><td>33,6%</td></tr>
<tr><td>Giá thị trường</td><td>EPS = 168 / 100 cổ phần = 1,68; P/E = 20 / 1,68; giá thị trường / giá sổ sách = 2.000 / 500</td><td>P/E 11,9 · M/B 4,0 (giá 20 $, giả định)</td></tr>
</table>
<h3>Đẳng thức DuPont</h3>
<pre><code>ROE = Biên lợi nhuận x Vòng quay tổng tài sản x Hệ số nhân vốn chủ
    = (LNR / Doanh thu) x (Doanh thu / Tài sản) x (Tài sản / Vốn chủ)
Alpha: 14% x 1,2 x 2,0 = 33,6%   ✓</code></pre>
<p>DuPont cho biết <em>vì sao</em> ROE cao hay thấp: do hiệu quả kinh doanh (biên lợi nhuận), hiệu quả sử dụng tài sản (vòng quay) hay đòn bẩy tài chính (hệ số nhân vốn chủ). Hai doanh nghiệp cùng ROE có thể rủi ro rất khác nhau nếu một bên đạt được nhờ vay nợ nhiều.</p>
<h3>Dùng tỷ số cho đúng</h3>
<p>So với lịch sử của chính doanh nghiệp (<em>phân tích xu hướng</em>) và với các doanh nghiệp cùng ngành (<em>phân tích so sánh ngành</em>). Cẩn thận với khác biệt phương pháp kế toán, doanh nghiệp có tính mùa vụ, khoản bất thường và doanh nghiệp hoạt động ở nhiều ngành.</p>
<div class="callout"><span class="badge">Ghi nhớ</span> Một tỷ số là câu hỏi chứ không phải câu trả lời. Thanh toán hiện hành 2,0 là thoải mái với một nhà bán lẻ nhưng có thể là thừa với một doanh nghiệp thu tiền ngay lập tức.</div>`,
  ]]);

const c2e = doc('fin202-1-3-exercise', 'Exercise 1 — ratios and DuPont for Beta Co.|||Bài tập 1 — tỷ số và DuPont của Công ty Beta',
  'Bài tập: tính thanh toán hiện hành, thanh toán nhanh, vòng quay hàng tồn kho, ROE và phân tích DuPont cho Công ty Beta; so sánh hai cách nâng ROE (tăng biên lợi nhuận hay tăng đòn bẩy); kèm lời giải.',
  [[
    `<span class="eyebrow">FIN202 · Part 1 · Exercise</span>
<h2>Exercise 1 — where does Beta's ROE come from?</h2>
<div class="callout"><span class="badge">Problem</span> Beta Co. (assumed figures, $ thousands): sales 2,000; COGS 1,400; net income 100; total assets 1,600; equity 800; current assets 500 (of which inventory 200); current liabilities 250. (a) Compute the current and quick ratios and inventory turnover in times and days. (b) Break ROE into its DuPont components. (c) Beta wants a 15% ROE. Compare raising the profit margin to 6% with raising the equity multiplier to 2.5.</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) Current ratio      = 500 / 250           = 2.0
    Quick ratio        = (500 − 200) / 250   = 1.2
    Inventory turnover = 1,400 / 200         = 7.0 times  ->  365 / 7 = 52.1 days

(b) Profit margin      = 100 / 2,000   = 5%
    Asset turnover     = 2,000 / 1,600 = 1.25
    Equity multiplier  = 1,600 / 800   = 2.0
    ROE = 5% x 1.25 x 2.0 = 12.5%       (check: 100 / 800 = 12.5% ✓)

(c) Margin 6%, same turnover and leverage:   6% x 1.25 x 2.0 = 15.0%
    Margin 5%, equity multiplier 2.5:         5% x 1.25 x 2.5 = 15.6%</code></pre>
<p><strong>Why:</strong> both routes reach roughly 15%, but they are not equal. Higher margin comes from better pricing or cost control and adds no financial risk. A higher equity multiplier means more debt: interest must be paid in bad years too, so ROE becomes more volatile. Always ask which DuPont lever moved.</p>`,
    `<span class="eyebrow">FIN202 · Phần 1 · Bài tập</span>
<h2>Bài tập 1 — ROE của Beta đến từ đâu?</h2>
<div class="callout"><span class="badge">Đề</span> Công ty Beta (số liệu giả định, nghìn $): doanh thu 2.000; giá vốn 1.400; lợi nhuận ròng 100; tổng tài sản 1.600; vốn chủ sở hữu 800; tài sản ngắn hạn 500 (trong đó hàng tồn kho 200); nợ ngắn hạn 250. (a) Tính thanh toán hiện hành, thanh toán nhanh và vòng quay hàng tồn kho theo số vòng và số ngày. (b) Tách ROE thành các thành phần DuPont. (c) Beta muốn ROE 15%. So sánh cách nâng biên lợi nhuận lên 6% với cách nâng hệ số nhân vốn chủ lên 2,5.</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) Thanh toán hiện hành = 500 / 250           = 2,0
    Thanh toán nhanh     = (500 − 200) / 250   = 1,2
    Vòng quay tồn kho    = 1.400 / 200         = 7,0 vòng  ->  365 / 7 = 52,1 ngày

(b) Biên lợi nhuận       = 100 / 2.000   = 5%
    Vòng quay tài sản    = 2.000 / 1.600 = 1,25
    Hệ số nhân vốn chủ   = 1.600 / 800   = 2,0
    ROE = 5% x 1,25 x 2,0 = 12,5%        (kiểm tra: 100 / 800 = 12,5% ✓)

(c) Biên 6%, giữ vòng quay và đòn bẩy:   6% x 1,25 x 2,0 = 15,0%
    Biên 5%, hệ số nhân vốn chủ 2,5:     5% x 1,25 x 2,5 = 15,6%</code></pre>
<p><strong>Vì sao:</strong> cả hai cách đều đạt khoảng 15%, nhưng không tương đương. Biên lợi nhuận cao hơn đến từ định giá tốt hơn hoặc kiểm soát chi phí và không thêm rủi ro tài chính. Hệ số nhân vốn chủ cao hơn nghĩa là vay nhiều hơn: năm xấu vẫn phải trả lãi, nên ROE biến động mạnh hơn. Luôn hỏi đòn bẩy DuPont nào đã thay đổi.</p>`,
  ]]);

const c2q = quiz('fin202-quiz-1', 'Quiz 1 — Statements & ratios|||Quiz 1 — Báo cáo & tỷ số', [
  { id: 'q1', question: 'Which expression is the DuPont identity?|||Biểu thức nào là đẳng thức DuPont?', options: ['ROE = ROA − debt ratio|||ROE = ROA − tỷ số nợ', 'ROE = profit margin x total asset turnover x equity multiplier|||ROE = biên lợi nhuận x vòng quay tổng tài sản x hệ số nhân vốn chủ', 'ROE = EBIT / interest|||ROE = EBIT / lãi vay', 'ROE = current ratio x quick ratio|||ROE = thanh toán hiện hành x thanh toán nhanh'], correctIndex: 1, explanation: 'Multiplying NI/Sales x Sales/Assets x Assets/Equity cancels down to NI/Equity.|||Nhân LNR/Doanh thu x Doanh thu/Tài sản x Tài sản/Vốn chủ rút gọn thành LNR/Vốn chủ.' },
  { id: 'q2', question: 'Current assets are 600 and current liabilities are 400. The current ratio is…|||Tài sản ngắn hạn 600 và nợ ngắn hạn 400. Hệ số thanh toán hiện hành là…', options: ['0.67|||0,67', '1.5|||1,5', '2.0|||2,0', '200|||200'], correctIndex: 1, explanation: '600 / 400 = 1.5.|||600 / 400 = 1,5.' },
  { id: 'q3', question: 'Operating cash flow (OCF) is calculated as…|||Dòng tiền hoạt động (OCF) được tính bằng…', options: ['Net income + dividends|||Lợi nhuận ròng + cổ tức', 'EBIT + depreciation − taxes|||EBIT + khấu hao − thuế', 'Sales − cost of goods sold|||Doanh thu − giá vốn', 'Total assets − total liabilities|||Tổng tài sản − tổng nợ'], correctIndex: 1, explanation: 'Depreciation is added back because it is a non-cash expense; taxes are a real cash outflow.|||Khấu hao được cộng lại vì là chi phí không bằng tiền; thuế là dòng tiền chi ra thật.' },
]);

const c3 = doc('fin202-2-1-time-value', '2.1 — The time value of money|||2.1 — Giá trị thời gian của tiền',
  'Giá trị tương lai và hiện tại, lãi kép, quy tắc 72, dòng tiền nhiều kỳ, niên kim, dòng tiền vĩnh viễn (có tăng trưởng), lãi suất danh nghĩa năm (APR) và lãi suất thực tế năm (EAR), khoản vay trả góp và bảng trả nợ.',
  [[
    `<span class="eyebrow">FIN202 · Part 2 · Lesson 2.1</span>
<h2>The time value of money</h2>
<h3>Future value and present value</h3>
<pre><code>FV = PV x (1 + r)^t            PV = FV / (1 + r)^t
1,000 invested at 8% for 5 years:   1,000 x 1.08^5  = 1,469.33
10,000 received in 6 years at 10%:  10,000 / 1.1^6  = 5,644.74
Rule of 72: money doubles in about 72 / 8 = 9 years at 8% (exact: 9.01)</code></pre>
<p>Compounding means earning interest on interest. Discounting — finding present value — is compounding run backwards; the rate r is the <strong>discount rate</strong> (the return you could earn on an investment of similar risk).</p>
<h3>Annuities and perpetuities</h3>
<pre><code>Annuity (equal payment C for t periods):
   PV = C x [1 − 1 / (1 + r)^t] / r         FV = C x [(1 + r)^t − 1] / r
Perpetuity (C forever):              PV = C / r
Growing perpetuity (C1, growing g):  PV = C1 / (r − g),  r &gt; g</code></pre>
<h3>Interest rates: APR vs EAR</h3>
<p>A quoted annual rate (<strong>APR</strong>) compounded m times a year gives a higher <strong>effective annual rate</strong>: EAR = (1 + APR/m)^m − 1. A 12% APR compounded monthly is an EAR of 1.01^12 − 1 = <strong>12.68%</strong>. Always compare rates as EARs.</p>
<h3>Loan amortization</h3>
<pre><code>Loan 100,000, 5 annual payments, 10% a year
Payment C = 100,000 x 0.10 / (1 − 1.1^−5) = 26,379.75
Year 1: interest 100,000 x 10% = 10,000; principal 26,379.75 − 10,000 = 16,379.75
        balance 100,000 − 16,379.75 = 83,620.25   (interest share falls each year)</code></pre>
<div class="callout"><span class="badge">Method</span> Draw a timeline for every problem: mark each cash flow, its date and sign. Most mistakes come from putting a payment in the wrong period.</div>`,
    `<span class="eyebrow">FIN202 · Phần 2 · Bài 2.1</span>
<h2>Giá trị thời gian của tiền</h2>
<h3>Giá trị tương lai và giá trị hiện tại</h3>
<pre><code>FV = PV x (1 + r)^t            PV = FV / (1 + r)^t
Đầu tư 1.000 với lãi 8% trong 5 năm:   1.000 x 1,08^5  = 1.469,33
Nhận 10.000 sau 6 năm, lãi suất 10%:   10.000 / 1,1^6  = 5.644,74
Quy tắc 72: với lãi 8%, tiền tăng gấp đôi sau khoảng 72 / 8 = 9 năm (chính xác: 9,01)</code></pre>
<p>Lãi kép là lãi sinh ra trên cả lãi. Chiết khấu — tìm giá trị hiện tại — là lãi kép chạy ngược; lãi suất r là <strong>lãi suất chiết khấu</strong> (mức lợi nhuận có thể đạt được ở một khoản đầu tư có rủi ro tương đương).</p>
<h3>Niên kim và dòng tiền vĩnh viễn</h3>
<pre><code>Niên kim (khoản đều C trong t kỳ):
   PV = C x [1 − 1 / (1 + r)^t] / r         FV = C x [(1 + r)^t − 1] / r
Dòng tiền vĩnh viễn (C mãi mãi):              PV = C / r
Vĩnh viễn tăng trưởng (C1, tăng đều g):       PV = C1 / (r − g),  r &gt; g</code></pre>
<h3>Lãi suất: APR và EAR</h3>
<p>Lãi suất danh nghĩa năm (<strong>APR</strong>) ghép lãi m lần mỗi năm cho <strong>lãi suất thực tế năm</strong> cao hơn: EAR = (1 + APR/m)^m − 1. APR 12% ghép lãi hằng tháng tương đương EAR = 1,01^12 − 1 = <strong>12,68%</strong>. Luôn so sánh lãi suất theo EAR.</p>
<h3>Khoản vay trả góp</h3>
<pre><code>Vay 100.000, trả 5 lần mỗi năm một lần, lãi 10%/năm
Khoản trả C = 100.000 x 0,10 / (1 − 1,1^−5) = 26.379,75
Năm 1: lãi 100.000 x 10% = 10.000; gốc 26.379,75 − 10.000 = 16.379,75
       dư nợ 100.000 − 16.379,75 = 83.620,25   (phần lãi giảm dần mỗi năm)</code></pre>
<div class="callout"><span class="badge">Phương pháp</span> Vẽ trục thời gian cho mọi bài: đánh dấu từng dòng tiền, thời điểm và dấu của nó. Phần lớn sai sót đến từ việc đặt một khoản thanh toán vào sai kỳ.</div>`,
  ]]);

const c3e = doc('fin202-2-2-exercise', 'Exercise 2 — saving, borrowing and choosing|||Bài tập 2 — tiết kiệm, vay và lựa chọn',
  'Bài tập: giá trị tương lai của khoản tiết kiệm hằng tháng, khoản trả góp hằng tháng của khoản vay mua xe, so sánh nhận tiền hôm nay với nhận tiền sau ba năm, và lãi suất thực tế năm; kèm lời giải bằng đồng Việt Nam.',
  [[
    `<span class="eyebrow">FIN202 · Part 2 · Exercise</span>
<h2>Exercise 2 — four everyday TVM decisions</h2>
<div class="callout"><span class="badge">Problem</span> (a) You save VND 2,000,000 at the end of every month for 3 years at 6% APR compounded monthly. How much will you have? (b) You borrow VND 300,000,000 for a car, repaid monthly over 3 years at 12% APR compounded monthly. What is the monthly payment? (c) Would you rather receive VND 100 million today or VND 130 million in 3 years if the discount rate is 8% a year? (d) A lender quotes 18% APR compounded monthly. What is the EAR? (All rates and amounts are illustrative.)</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) r = 6% / 12 = 0.5% a month, n = 36
    FV = 2,000,000 x [(1.005^36 − 1) / 0.005] = 2,000,000 x 39.3361 ≈ VND 78,672,210

(b) r = 12% / 12 = 1% a month, n = 36
    C = 300,000,000 x 0.01 / (1 − 1.01^−36) ≈ VND 9,964,293 a month

(c) PV of 130 million = 130 / 1.08^3 = 130 / 1.259712 ≈ 103.20 million
    103.20 &gt; 100  ->  take the 130 million in 3 years

(d) EAR = (1 + 0.18 / 12)^12 − 1 = 1.015^12 − 1 ≈ 19.56%</code></pre>
<p><strong>Why:</strong> in (a) you deposit 72 million and interest adds about 6.7 million; in (b) you repay 36 × 9,964,293 ≈ 358.7 million for 300 million borrowed. In (c) money can only be compared at the same date — here, today. In (d) the "18%" understates the true cost because interest is charged monthly.</p>`,
    `<span class="eyebrow">FIN202 · Phần 2 · Bài tập</span>
<h2>Bài tập 2 — bốn quyết định tài chính thường ngày</h2>
<div class="callout"><span class="badge">Đề</span> (a) Cuối mỗi tháng bạn gửi tiết kiệm 2.000.000 đồng trong 3 năm, lãi suất 6%/năm ghép lãi hằng tháng. Cuối kỳ bạn có bao nhiêu? (b) Bạn vay 300.000.000 đồng mua xe, trả góp hằng tháng trong 3 năm, lãi suất 12%/năm ghép lãi hằng tháng. Mỗi tháng trả bao nhiêu? (c) Bạn muốn nhận 100 triệu đồng hôm nay hay 130 triệu đồng sau 3 năm nếu lãi suất chiết khấu là 8%/năm? (d) Một bên cho vay báo lãi suất 18%/năm ghép lãi hằng tháng. Lãi suất thực tế năm là bao nhiêu? (Mọi lãi suất và số tiền đều là số liệu minh hoạ.)</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) r = 6% / 12 = 0,5% mỗi tháng, n = 36
    FV = 2.000.000 x [(1,005^36 − 1) / 0,005] = 2.000.000 x 39,3361 ≈ 78.672.210 đồng

(b) r = 12% / 12 = 1% mỗi tháng, n = 36
    C = 300.000.000 x 0,01 / (1 − 1,01^−36) ≈ 9.964.293 đồng mỗi tháng

(c) PV của 130 triệu = 130 / 1,08^3 = 130 / 1,259712 ≈ 103,20 triệu
    103,20 &gt; 100  ->  chọn nhận 130 triệu sau 3 năm

(d) EAR = (1 + 0,18 / 12)^12 − 1 = 1,015^12 − 1 ≈ 19,56%</code></pre>
<p><strong>Vì sao:</strong> ở (a) bạn gửi vào 72 triệu và tiền lãi thêm khoảng 6,7 triệu; ở (b) bạn trả 36 × 9.964.293 ≈ 358,7 triệu cho 300 triệu tiền vay. Ở (c) chỉ so sánh được các khoản tiền tại cùng một thời điểm — ở đây là hôm nay. Ở (d) con số "18%" thể hiện thấp hơn chi phí thật vì lãi được tính hằng tháng.</p>`,
  ]]);

const c3q = quiz('fin202-quiz-2', 'Quiz 2 — Time value of money|||Quiz 2 — Giá trị thời gian của tiền', [
  { id: 'q1', question: 'What is the future value of 100 invested for 2 years at 10% compounded annually?|||Giá trị tương lai của 100 đầu tư trong 2 năm với lãi 10%/năm ghép lãi hằng năm là bao nhiêu?', options: ['110|||110', '120|||120', '121|||121', '200|||200'], correctIndex: 2, explanation: '100 x 1.1^2 = 121 — the extra 1 is interest on the first year’s interest.|||100 x 1,1^2 = 121 — phần 1 dôi ra là lãi của tiền lãi năm đầu.' },
  { id: 'q2', question: 'A perpetuity pays 50 a year forever and the discount rate is 5%. Its present value is…|||Một dòng tiền vĩnh viễn trả 50 mỗi năm mãi mãi, lãi suất chiết khấu 5%. Giá trị hiện tại là…', options: ['250|||250', '500|||500', '1,000|||1.000', 'infinite|||vô hạn'], correctIndex: 2, explanation: 'PV = C / r = 50 / 0.05 = 1,000.|||PV = C / r = 50 / 0,05 = 1.000.' },
  { id: 'q3', question: 'Which loan is cheaper: 12% APR compounded monthly, or 12.5% compounded annually?|||Khoản vay nào rẻ hơn: 12%/năm ghép lãi hằng tháng hay 12,5%/năm ghép lãi hằng năm?', options: ['12% monthly, because 12 &lt; 12.5|||12% hằng tháng, vì 12 &lt; 12,5', '12.5% annually, because its EAR (12.5%) is below 12.68%|||12,5% hằng năm, vì EAR của nó (12,5%) thấp hơn 12,68%', 'They cost the same|||Chi phí như nhau', 'It cannot be compared|||Không so sánh được'], correctIndex: 1, explanation: '12% compounded monthly has an EAR of 1.01^12 − 1 = 12.68%, which is higher than 12.5%.|||12% ghép lãi hằng tháng có EAR = 1,01^12 − 1 = 12,68%, cao hơn 12,5%.' },
]);

const c4 = doc('fin202-3-1-bonds-stocks', '3.1 — Valuing bonds and stocks|||3.1 — Định giá trái phiếu và cổ phiếu',
  'Các yếu tố của trái phiếu, định giá bằng hiện giá dòng tiền, lợi suất đến hạn, quan hệ ngược chiều giữa giá và lãi suất, trái phiếu chiết khấu và thặng giá, rủi ro lãi suất; định giá cổ phiếu bằng mô hình chiết khấu cổ tức, mô hình tăng trưởng đều Gordon, cổ phiếu ưu đãi, P/E.',
  [[
    `<span class="eyebrow">FIN202 · Part 3 · Lesson 3.1</span>
<h2>Valuing bonds and stocks</h2>
<p>The value of any financial asset is the present value of the cash flows it is expected to produce.</p>
<h3>Bonds</h3>
<p>A bond promises fixed <strong>coupon</strong> payments and the <strong>face value</strong> at <strong>maturity</strong>. The discount rate the market applies is the <strong>yield to maturity (YTM)</strong>.</p>
<pre><code>Bond price = Coupon x [1 − 1/(1 + YTM)^t] / YTM  +  Face / (1 + YTM)^t
Face 1,000, 8% annual coupon (80), 10 years
YTM 10%: 80 x 6.144567 + 1,000 / 1.1^10  = 491.57 + 385.54 = 877.11   (discount)
YTM  6%: 80 x 7.360087 + 1,000 / 1.06^10 = 588.81 + 558.39 = 1,147.20 (premium)</code></pre>
<ul>
<li>Bond prices and interest rates move in <strong>opposite directions</strong>.</li>
<li>Coupon rate &lt; YTM → the bond sells at a <strong>discount</strong>; coupon rate &gt; YTM → at a <strong>premium</strong>; equal → at par.</li>
<li><strong>Interest-rate risk</strong> is larger for longer maturities and lower coupons.</li>
<li>Current yield = annual coupon / price (80 / 877.11 = 9.12%), which differs from YTM because it ignores the gain from 877 back to 1,000.</li>
</ul>
<h3>Stocks</h3>
<p>A share is worth the present value of all future dividends (the <strong>dividend discount model</strong>). If dividends grow at a constant rate g forever:</p>
<pre><code>Gordon growth model:  P0 = D1 / (r − g)          (requires r &gt; g)
D0 = 2.00, g = 5%, r = 12%  ->  D1 = 2.10  ->  P0 = 2.10 / 0.07 = 30.00
Rearranged: r = D1 / P0 + g = dividend yield + capital gains yield = 7% + 5%
Preferred stock (fixed dividend 8, r = 10%) is a perpetuity: 8 / 0.10 = 80</code></pre>
<p>Analysts also compare firms using multiples such as the <strong>price/earnings (P/E) ratio</strong>. Unlike bonds, shareholders have no promised payments and a residual claim, so equity is riskier — and investors demand a higher return.</p>
<div class="callout"><span class="badge">Intuition</span> When market rates rise, the fixed coupons of an existing bond look less attractive, so its price must fall until its yield matches the market.</div>`,
    `<span class="eyebrow">FIN202 · Phần 3 · Bài 3.1</span>
<h2>Định giá trái phiếu và cổ phiếu</h2>
<p>Giá trị của bất kỳ tài sản tài chính nào cũng bằng giá trị hiện tại của các dòng tiền mà nó được kỳ vọng mang lại.</p>
<h3>Trái phiếu</h3>
<p>Trái phiếu cam kết trả <strong>lãi coupon</strong> cố định và <strong>mệnh giá</strong> khi <strong>đáo hạn</strong>. Lãi suất chiết khấu mà thị trường áp dụng là <strong>lợi suất đến hạn (YTM)</strong>.</p>
<pre><code>Giá trái phiếu = Coupon x [1 − 1/(1 + YTM)^t] / YTM  +  Mệnh giá / (1 + YTM)^t
Mệnh giá 1.000, coupon 8%/năm (80), kỳ hạn 10 năm
YTM 10%: 80 x 6,144567 + 1.000 / 1,1^10  = 491,57 + 385,54 = 877,11   (chiết khấu)
YTM  6%: 80 x 7,360087 + 1.000 / 1,06^10 = 588,81 + 558,39 = 1.147,20 (thặng giá)</code></pre>
<ul>
<li>Giá trái phiếu và lãi suất biến động <strong>ngược chiều</strong>.</li>
<li>Lãi suất coupon &lt; YTM → trái phiếu bán <strong>dưới mệnh giá</strong>; coupon &gt; YTM → <strong>trên mệnh giá</strong>; bằng nhau → bằng mệnh giá.</li>
<li><strong>Rủi ro lãi suất</strong> lớn hơn khi kỳ hạn dài hơn và coupon thấp hơn.</li>
<li>Lợi suất hiện hành = coupon năm / giá (80 / 877,11 = 9,12%), khác YTM vì bỏ qua phần lãi vốn từ 877 lên 1.000.</li>
</ul>
<h3>Cổ phiếu</h3>
<p>Một cổ phiếu có giá trị bằng hiện giá của mọi cổ tức tương lai (<strong>mô hình chiết khấu cổ tức</strong>). Nếu cổ tức tăng đều với tốc độ g mãi mãi:</p>
<pre><code>Mô hình tăng trưởng Gordon:  P0 = D1 / (r − g)          (cần r &gt; g)
D0 = 2,00, g = 5%, r = 12%  ->  D1 = 2,10  ->  P0 = 2,10 / 0,07 = 30,00
Biến đổi: r = D1 / P0 + g = tỷ suất cổ tức + tỷ suất lãi vốn = 7% + 5%
Cổ phiếu ưu đãi (cổ tức cố định 8, r = 10%) là dòng tiền vĩnh viễn: 8 / 0,10 = 80</code></pre>
<p>Nhà phân tích còn so sánh doanh nghiệp bằng các bội số như <strong>hệ số giá/thu nhập (P/E)</strong>. Khác trái phiếu, cổ đông không được cam kết khoản trả nào và chỉ có quyền đòi phần còn lại, nên vốn cổ phần rủi ro hơn — và nhà đầu tư đòi lợi nhuận cao hơn.</p>
<div class="callout"><span class="badge">Trực giác</span> Khi lãi suất thị trường tăng, coupon cố định của trái phiếu đang lưu hành kém hấp dẫn đi, nên giá của nó phải giảm cho tới khi lợi suất bằng mức thị trường.</div>`,
  ]]);

const c5 = doc('fin202-3-2-risk-cost-of-capital', '3.2 — Risk, return & the cost of capital|||3.2 — Rủi ro, lợi nhuận & chi phí vốn',
  'Lợi nhuận nắm giữ, lợi nhuận kỳ vọng và độ lệch chuẩn theo kịch bản, đa dạng hoá, rủi ro hệ thống và phi hệ thống, hệ số beta, mô hình CAPM, chi phí vốn bình quân gia quyền (WACC) có ví dụ số.',
  [[
    `<span class="eyebrow">FIN202 · Part 3 · Lesson 3.2</span>
<h2>Risk, return &amp; the cost of capital</h2>
<h3>Measuring return and risk</h3>
<pre><code>Holding-period return = (dividend + price change) / starting price
Buy at 50, receive a dividend of 2, sell at 55:  (2 + 5) / 50 = 14%

Scenarios (assumed)   Probability   Return
Boom                      0.3         30%
Normal                    0.5         12%
Recession                 0.2        −10%
Expected return  = 0.3 x 30 + 0.5 x 12 + 0.2 x (−10) = 13%
Variance         = 0.3 x 17^2 + 0.5 x (−1)^2 + 0.2 x (−23)^2 = 193
Standard deviation = √193 ≈ 13.89%</code></pre>
<h3>Diversification and beta</h3>
<p>Total risk has two parts. <strong>Unsystematic</strong> (firm-specific) risk — a strike, a lawsuit, a failed product — can be almost eliminated by holding many stocks. <strong>Systematic</strong> (market) risk — recessions, interest-rate changes — affects nearly all firms and cannot be diversified away. Because investors can diversify for free, the market rewards only systematic risk, measured by <strong>beta (β)</strong>: β = 1 moves with the market, β &gt; 1 amplifies it, β &lt; 1 dampens it. A portfolio's beta is the weighted average of its assets' betas.</p>
<h3>The capital asset pricing model (CAPM)</h3>
<pre><code>E(R) = Rf + β x [E(Rm) − Rf]
Risk-free rate 4%, market risk premium 6%, β = 1.2  ->  E(R) = 4% + 1.2 x 6% = 11.2%</code></pre>
<h3>Weighted average cost of capital (WACC)</h3>
<p>A firm's cost of capital is the return its investors require, weighted by market values. Interest is tax-deductible, so debt's cost is taken after tax:</p>
<pre><code>WACC = (E/V) x Re + (D/V) x Rd x (1 − Tc)
E = 600, D = 400 (V = 1,000), Re = 11.2% (CAPM), Rd = 7%, Tc = 20%
WACC = 0.6 x 11.2% + 0.4 x 7% x 0.8 = 6.72% + 2.24% = 8.96%</code></pre>
<p>WACC is the discount rate for projects with the same risk as the firm's existing business. A project that is riskier than the firm should be discounted at a higher rate.</p>
<div class="callout"><span class="badge">Key lesson</span> Risk that can be diversified away is not rewarded. Expected return depends on beta, not on total volatility.</div>`,
    `<span class="eyebrow">FIN202 · Phần 3 · Bài 3.2</span>
<h2>Rủi ro, lợi nhuận &amp; chi phí vốn</h2>
<h3>Đo lường lợi nhuận và rủi ro</h3>
<pre><code>Lợi nhuận nắm giữ = (cổ tức + chênh lệch giá) / giá ban đầu
Mua giá 50, nhận cổ tức 2, bán giá 55:  (2 + 5) / 50 = 14%

Kịch bản (giả định)   Xác suất   Lợi nhuận
Tăng trưởng mạnh         0,3        30%
Bình thường              0,5        12%
Suy thoái                0,2       −10%
Lợi nhuận kỳ vọng = 0,3 x 30 + 0,5 x 12 + 0,2 x (−10) = 13%
Phương sai        = 0,3 x 17^2 + 0,5 x (−1)^2 + 0,2 x (−23)^2 = 193
Độ lệch chuẩn     = √193 ≈ 13,89%</code></pre>
<h3>Đa dạng hoá và beta</h3>
<p>Tổng rủi ro gồm hai phần. Rủi ro <strong>phi hệ thống</strong> (riêng của doanh nghiệp) — đình công, kiện tụng, sản phẩm thất bại — gần như loại bỏ được bằng cách nắm giữ nhiều cổ phiếu. Rủi ro <strong>hệ thống</strong> (rủi ro thị trường) — suy thoái, lãi suất thay đổi — tác động tới gần như mọi doanh nghiệp và không đa dạng hoá được. Vì nhà đầu tư đa dạng hoá gần như không tốn gì, thị trường chỉ trả thưởng cho rủi ro hệ thống, được đo bằng <strong>beta (β)</strong>: β = 1 biến động cùng thị trường, β &gt; 1 khuếch đại, β &lt; 1 giảm nhẹ. Beta của danh mục là bình quân gia quyền beta của các tài sản.</p>
<h3>Mô hình định giá tài sản vốn (CAPM)</h3>
<pre><code>E(R) = Rf + β x [E(Rm) − Rf]
Lãi suất phi rủi ro 4%, phần bù rủi ro thị trường 6%, β = 1,2  ->  E(R) = 4% + 1,2 x 6% = 11,2%</code></pre>
<h3>Chi phí vốn bình quân gia quyền (WACC)</h3>
<p>Chi phí vốn của doanh nghiệp là mức lợi nhuận các nhà đầu tư đòi hỏi, lấy quyền số theo giá trị thị trường. Lãi vay được trừ khi tính thuế, nên chi phí nợ tính sau thuế:</p>
<pre><code>WACC = (E/V) x Re + (D/V) x Rd x (1 − Tc)
E = 600, D = 400 (V = 1.000), Re = 11,2% (CAPM), Rd = 7%, Tc = 20%
WACC = 0,6 x 11,2% + 0,4 x 7% x 0,8 = 6,72% + 2,24% = 8,96%</code></pre>
<p>WACC là lãi suất chiết khấu cho các dự án có rủi ro tương đương hoạt động hiện tại của doanh nghiệp. Dự án rủi ro hơn doanh nghiệp phải được chiết khấu ở mức cao hơn.</p>
<div class="callout"><span class="badge">Bài học chính</span> Rủi ro có thể đa dạng hoá thì không được trả thưởng. Lợi nhuận kỳ vọng phụ thuộc vào beta, không phụ thuộc vào tổng mức biến động.</div>`,
  ]]);

const c5q = quiz('fin202-quiz-3', 'Quiz 3 — Valuation, risk & cost of capital|||Quiz 3 — Định giá, rủi ro & chi phí vốn', [
  { id: 'q1', question: 'Market interest rates rise. What happens to the price of an existing fixed-coupon bond?|||Lãi suất thị trường tăng. Giá của một trái phiếu coupon cố định đang lưu hành thay đổi thế nào?', options: ['It rises|||Tăng', 'It falls|||Giảm', 'It stays at face value|||Giữ nguyên bằng mệnh giá', 'It depends only on the coupon|||Chỉ phụ thuộc vào coupon'], correctIndex: 1, explanation: 'Bond prices and yields move in opposite directions: the price falls until the bond’s yield matches the new market rate.|||Giá và lợi suất trái phiếu ngược chiều: giá giảm cho tới khi lợi suất bằng lãi suất thị trường mới.' },
  { id: 'q2', question: 'Risk-free rate 3%, beta 1.5, market risk premium 6%. The required return by CAPM is…|||Lãi suất phi rủi ro 3%, beta 1,5, phần bù rủi ro thị trường 6%. Lợi nhuận yêu cầu theo CAPM là…', options: ['9%|||9%', '10.5%|||10,5%', '12%|||12%', '13.5%|||13,5%'], correctIndex: 2, explanation: '3% + 1.5 x 6% = 12%.|||3% + 1,5 x 6% = 12%.' },
  { id: 'q3', question: 'Holding a large, well-diversified portfolio eliminates mainly…|||Nắm giữ một danh mục lớn, đa dạng hoá tốt chủ yếu loại bỏ được…', options: ['systematic (market) risk|||rủi ro hệ thống (thị trường)', 'unsystematic (firm-specific) risk|||rủi ro phi hệ thống (riêng doanh nghiệp)', 'all risk|||mọi rủi ro', 'interest-rate risk of bonds|||rủi ro lãi suất của trái phiếu'], correctIndex: 1, explanation: 'Firm-specific shocks cancel out across many stocks; market-wide shocks do not — that is what beta measures.|||Các cú sốc riêng của từng doanh nghiệp bù trừ nhau trong danh mục; cú sốc toàn thị trường thì không — đó là thứ beta đo.' },
]);

const c6 = doc('fin202-4-1-capital-budgeting', '4.1 — Capital budgeting: NPV and other rules|||4.1 — Thẩm định dự án: NPV và các tiêu chuẩn khác',
  'Tiêu chuẩn NPV, IRR và hạn chế của IRR, thời gian hoàn vốn (thường và có chiết khấu), chỉ số sinh lời, xác định dòng tiền tăng thêm: chi phí chìm, chi phí cơ hội, tác động phụ, vốn lưu động, lá chắn thuế khấu hao.',
  [[
    `<span class="eyebrow">FIN202 · Part 4 · Lesson 4.1</span>
<h2>Capital budgeting: NPV and other rules</h2>
<h3>Net present value</h3>
<p><strong>NPV</strong> = present value of the project's future cash flows − the initial investment, discounted at the project's cost of capital. <strong>Accept if NPV &gt; 0</strong>: the project earns more than investors could get elsewhere at the same risk, so it adds that amount to the value of the firm.</p>
<pre><code>Project A at 10%:   Year 0: −500   Year 1: 200   Year 2: 250   Year 3: 300
NPV = −500 + 200/1.1 + 250/1.1^2 + 300/1.1^3 = −500 + 181.82 + 206.61 + 225.39 = 113.82
IRR (the rate that makes NPV = 0) ≈ 21.65% &gt; 10%  -> accept
Payback: 200 + 250 = 450 after 2 years; 50 more of 300  -> 2 + 50/300 ≈ 2.17 years</code></pre>
<h3>Other rules and their limits</h3>
<table>
<tr><th>Rule</th><th>Accept if…</th><th>Weakness</th></tr>
<tr><td>Internal rate of return (IRR)</td><td>IRR &gt; required return</td><td>Can give several or no IRRs when cash-flow signs change more than once; can rank mutually exclusive projects wrongly (scale, timing)</td></tr>
<tr><td>Payback period</td><td>Payback &lt; a cutoff</td><td>Ignores the time value of money and all cash flows after the cutoff</td></tr>
<tr><td>Discounted payback</td><td>Discounted payback &lt; a cutoff</td><td>Still ignores cash flows after the cutoff</td></tr>
<tr><td>Profitability index (PI)</td><td>PV of inflows / investment &gt; 1</td><td>Useful when capital is rationed; can mislead for exclusive projects</td></tr>
</table>
<p>When the rules disagree, <strong>NPV wins</strong>: it measures value created in money terms and respects timing and risk.</p>
<h3>Which cash flows count?</h3>
<ul>
<li>Use <strong>incremental</strong> cash flows — the difference the project makes to the firm.</li>
<li>Ignore <strong>sunk costs</strong> (a market study already paid for); include <strong>opportunity costs</strong> (land the firm owns could be sold); include <strong>side effects</strong> such as erosion of existing sales.</li>
<li>Include the investment in <strong>net working capital</strong> at the start and its recovery at the end.</li>
<li>Operating cash flow: OCF = (Sales − Costs) × (1 − T) + Depreciation × T. The last term is the <strong>depreciation tax shield</strong>. Financing costs (interest) are not subtracted — they are captured in the discount rate.</li>
</ul>
<div class="callout"><span class="badge">Key rule</span> Discount cash flows, not profits — and discount them at a rate that reflects the project's own risk.</div>`,
    `<span class="eyebrow">FIN202 · Phần 4 · Bài 4.1</span>
<h2>Thẩm định dự án: NPV và các tiêu chuẩn khác</h2>
<h3>Giá trị hiện tại ròng</h3>
<p><strong>NPV</strong> = hiện giá các dòng tiền tương lai của dự án − vốn đầu tư ban đầu, chiết khấu theo chi phí vốn của dự án. <strong>Chấp nhận nếu NPV &gt; 0</strong>: dự án mang lại nhiều hơn mức nhà đầu tư có thể đạt được ở nơi khác với cùng rủi ro, nên nó làm giá trị doanh nghiệp tăng đúng bằng phần đó.</p>
<pre><code>Dự án A với lãi suất 10%:   Năm 0: −500   Năm 1: 200   Năm 2: 250   Năm 3: 300
NPV = −500 + 200/1,1 + 250/1,1^2 + 300/1,1^3 = −500 + 181,82 + 206,61 + 225,39 = 113,82
IRR (lãi suất làm NPV = 0) ≈ 21,65% &gt; 10%  -> chấp nhận
Hoàn vốn: 200 + 250 = 450 sau 2 năm; cần thêm 50 trong 300  -> 2 + 50/300 ≈ 2,17 năm</code></pre>
<h3>Các tiêu chuẩn khác và hạn chế</h3>
<table>
<tr><th>Tiêu chuẩn</th><th>Chấp nhận nếu…</th><th>Điểm yếu</th></tr>
<tr><td>Tỷ suất hoàn vốn nội bộ (IRR)</td><td>IRR &gt; lợi nhuận yêu cầu</td><td>Có thể có nhiều IRR hoặc không có IRR khi dòng tiền đổi dấu hơn một lần; có thể xếp hạng sai các dự án loại trừ nhau (quy mô, thời điểm)</td></tr>
<tr><td>Thời gian hoàn vốn</td><td>Hoàn vốn &lt; mốc giới hạn</td><td>Bỏ qua giá trị thời gian của tiền và mọi dòng tiền sau mốc</td></tr>
<tr><td>Hoàn vốn có chiết khấu</td><td>Hoàn vốn chiết khấu &lt; mốc giới hạn</td><td>Vẫn bỏ qua dòng tiền sau mốc</td></tr>
<tr><td>Chỉ số sinh lời (PI)</td><td>Hiện giá dòng tiền vào / vốn đầu tư &gt; 1</td><td>Hữu ích khi vốn bị giới hạn; có thể sai với dự án loại trừ nhau</td></tr>
</table>
<p>Khi các tiêu chuẩn mâu thuẫn, <strong>NPV thắng</strong>: nó đo giá trị tạo ra bằng tiền và tôn trọng thời điểm và rủi ro.</p>
<h3>Dòng tiền nào được tính?</h3>
<ul>
<li>Dùng dòng tiền <strong>tăng thêm</strong> — phần chênh lệch mà dự án tạo ra cho doanh nghiệp.</li>
<li>Bỏ qua <strong>chi phí chìm</strong> (nghiên cứu thị trường đã chi); tính <strong>chi phí cơ hội</strong> (mảnh đất doanh nghiệp đang có có thể bán được); tính <strong>tác động phụ</strong> như doanh số sản phẩm hiện có bị ăn mòn.</li>
<li>Tính khoản đầu tư vào <strong>vốn lưu động ròng</strong> lúc đầu và phần thu hồi lúc cuối.</li>
<li>Dòng tiền hoạt động: OCF = (Doanh thu − Chi phí) × (1 − T) + Khấu hao × T. Số hạng cuối là <strong>lá chắn thuế từ khấu hao</strong>. Không trừ chi phí tài trợ (lãi vay) — nó đã nằm trong lãi suất chiết khấu.</li>
</ul>
<div class="callout"><span class="badge">Quy tắc then chốt</span> Chiết khấu dòng tiền chứ không phải lợi nhuận — và chiết khấu ở mức phản ánh đúng rủi ro của chính dự án.</div>`,
  ]]);

const c6e = doc('fin202-4-2-exercise', 'Exercise 3 — should the firm buy the new machine?|||Bài tập 3 — doanh nghiệp có nên mua máy mới?',
  'Bài tập: dự án 4 năm có đầu tư máy, khấu hao đường thẳng, thuế 20%, vốn lưu động thu hồi cuối kỳ — tính OCF, NPV, IRR, thời gian hoàn vốn và chỉ số sinh lời, kết luận; kèm lời giải.',
  [[
    `<span class="eyebrow">FIN202 · Part 4 · Exercise</span>
<h2>Exercise 3 — a four-year project</h2>
<div class="callout"><span class="badge">Problem</span> A firm can buy a machine for 1,000 (assumed figures, $ thousands). It lasts 4 years and is depreciated straight-line to zero. It adds sales of 900 and cash costs of 450 each year. The tax rate is 20%. The project needs net working capital of 100 at the start, fully recovered at the end of year 4. The required return is 10%. A feasibility study already cost 30. Compute OCF, the cash-flow timeline, NPV, IRR, payback and PI, and decide.</div>
<h3>Worked solution</h3>
<pre><code class="language-text">Depreciation = 1,000 / 4 = 250 a year
OCF = (900 − 450) x (1 − 0.20) + 250 x 0.20 = 360 + 50 = 410 a year
The 30 study cost is sunk -> ignored.

Year        0        1      2      3      4
Machine  −1,000
NWC        −100                        +100
OCF                 410    410    410    410
Total    −1,100     410    410    410    510

Discount factors at 10%: 0.9091  0.8264  0.7513  0.6830
PV of inflows = 410 x (0.9091 + 0.8264 + 0.7513) + 510 x 0.6830 ≈ 1,367.95
NPV = 1,367.95 − 1,100 ≈ 267.95   -> positive
IRR ≈ 20.45% (&gt; 10%)
Payback: −1,100 + 410 + 410 = −280 after 2 years -> 2 + 280/410 ≈ 2.68 years
PI = 1,367.95 / 1,100 ≈ 1.24</code></pre>
<p><strong>Why:</strong> every rule says "accept", and NPV tells us by how much: about 268 of value is created. Note the two traps avoided — the sunk study cost is left out, and the working capital is both invested and recovered, which matters because money tied up in stock and receivables has a time cost.</p>`,
    `<span class="eyebrow">FIN202 · Phần 4 · Bài tập</span>
<h2>Bài tập 3 — một dự án bốn năm</h2>
<div class="callout"><span class="badge">Đề</span> Một doanh nghiệp có thể mua máy giá 1.000 (số liệu giả định, nghìn $). Máy dùng 4 năm, khấu hao đường thẳng về 0. Mỗi năm máy tạo thêm doanh thu 900 và chi phí bằng tiền 450. Thuế suất 20%. Dự án cần vốn lưu động ròng 100 lúc đầu, thu hồi toàn bộ cuối năm 4. Lợi nhuận yêu cầu 10%. Nghiên cứu khả thi đã tốn 30. Tính OCF, trục dòng tiền, NPV, IRR, thời gian hoàn vốn và PI, rồi ra quyết định.</div>
<h3>Lời giải</h3>
<pre><code class="language-text">Khấu hao = 1.000 / 4 = 250 mỗi năm
OCF = (900 − 450) x (1 − 0,20) + 250 x 0,20 = 360 + 50 = 410 mỗi năm
Chi phí nghiên cứu 30 là chi phí chìm -> bỏ qua.

Năm          0        1      2      3      4
Máy       −1.000
VLĐ ròng    −100                        +100
OCF                  410    410    410    410
Cộng      −1.100     410    410    410    510

Hệ số chiết khấu 10%: 0,9091  0,8264  0,7513  0,6830
Hiện giá dòng tiền vào = 410 x (0,9091 + 0,8264 + 0,7513) + 510 x 0,6830 ≈ 1.367,95
NPV = 1.367,95 − 1.100 ≈ 267,95   -> dương
IRR ≈ 20,45% (&gt; 10%)
Hoàn vốn: −1.100 + 410 + 410 = −280 sau 2 năm -> 2 + 280/410 ≈ 2,68 năm
PI = 1.367,95 / 1.100 ≈ 1,24</code></pre>
<p><strong>Vì sao:</strong> mọi tiêu chuẩn đều nói "chấp nhận", và NPV cho biết bao nhiêu: khoảng 268 giá trị được tạo ra. Để ý hai cái bẫy đã tránh — chi phí nghiên cứu đã chi là chi phí chìm nên không tính, và vốn lưu động vừa được đầu tư vừa được thu hồi, điều quan trọng vì tiền nằm trong hàng tồn kho và khoản phải thu có chi phí thời gian.</p>`,
  ]]);

const c7 = doc('fin202-4-3-financing-working-capital', '4.3 — Capital structure, payout & working capital|||4.3 — Cơ cấu vốn, chính sách cổ tức & vốn lưu động',
  'Đòn bẩy tài chính, định lý Modigliani–Miller (không thuế và có thuế), lý thuyết đánh đổi và trật tự phân hạng, chính sách cổ tức và mua lại cổ phần, chu kỳ kinh doanh, chu kỳ tiền mặt và chi phí của việc bỏ lỡ chiết khấu thanh toán.',
  [[
    `<span class="eyebrow">FIN202 · Part 4 · Lesson 4.3</span>
<h2>Capital structure, payout &amp; working capital</h2>
<h3>How much debt?</h3>
<p><strong>Financial leverage</strong> magnifies returns to shareholders in good years and losses in bad years. The classic theory:</p>
<ul>
<li><strong>Modigliani–Miller without taxes:</strong> in a perfect market, capital structure does not change firm value — the pie is the same however it is sliced (but the cost of equity rises with leverage).</li>
<li><strong>With corporate taxes:</strong> interest is deductible, so debt creates a <em>tax shield</em>: V<sub>L</sub> = V<sub>U</sub> + T<sub>c</sub> × D. With a 20% tax rate and 400 of permanent debt, the shield is worth 0.2 × 400 = 80.</li>
<li><strong>Static trade-off theory:</strong> firms balance tax benefits against the rising costs of <strong>financial distress</strong> (bankruptcy costs, lost customers and suppliers), so there is an optimal, moderate amount of debt.</li>
<li><strong>Pecking order:</strong> in practice firms prefer internal funds first, then debt, and issue new equity last, partly because issuing shares can signal that managers think the stock is overvalued.</li>
</ul>
<h3>Payout policy</h3>
<p>Firms return cash through <strong>dividends</strong> or <strong>share repurchases</strong>. In perfect markets payout policy is irrelevant too (Modigliani–Miller); in reality taxes, signalling (dividend cuts are read as bad news) and investor clienteles make firms keep dividends stable.</p>
<h3>Working capital: operating and cash cycles</h3>
<pre><code>Operating cycle = inventory period + receivables period
Cash cycle      = operating cycle − payables period
Alpha Co.: inventory period 365 / 3.6 = 101.4 days; receivables period 365 / 8 = 45.6 days
           payables period = 120 / 720 x 365 = 60.8 days
           operating cycle ≈ 147.0 days; cash cycle ≈ 86.2 days</code></pre>
<p>The cash cycle is how long money is tied up between paying suppliers and collecting from customers; a shorter cycle needs less financing. Credit terms matter: skipping a "2/10, net 30" discount means paying 2% to keep 98 for 20 more days — an effective annual cost of (1 + 2/98)^(365/20) − 1 ≈ <strong>44.6%</strong>, so firms should usually borrow to take the discount.</p>
<div class="callout"><span class="badge">Balance</span> Debt is cheap because of taxes but dangerous because of distress; working capital is necessary but costly. Good financial management is about finding the right level of each.</div>`,
    `<span class="eyebrow">FIN202 · Phần 4 · Bài 4.3</span>
<h2>Cơ cấu vốn, chính sách cổ tức &amp; vốn lưu động</h2>
<h3>Vay bao nhiêu là vừa?</h3>
<p><strong>Đòn bẩy tài chính</strong> khuếch đại lợi nhuận cho cổ đông trong năm tốt và khuếch đại thua lỗ trong năm xấu. Lý thuyết kinh điển:</p>
<ul>
<li><strong>Modigliani–Miller không có thuế:</strong> trong thị trường hoàn hảo, cơ cấu vốn không làm thay đổi giá trị doanh nghiệp — chiếc bánh vẫn vậy dù cắt thế nào (nhưng chi phí vốn chủ sở hữu tăng theo đòn bẩy).</li>
<li><strong>Có thuế thu nhập doanh nghiệp:</strong> lãi vay được trừ khi tính thuế, nên nợ tạo ra <em>lá chắn thuế</em>: V<sub>L</sub> = V<sub>U</sub> + T<sub>c</sub> × D. Với thuế suất 20% và khoản nợ vĩnh viễn 400, lá chắn thuế trị giá 0,2 × 400 = 80.</li>
<li><strong>Lý thuyết đánh đổi tĩnh:</strong> doanh nghiệp cân bằng lợi ích thuế với chi phí <strong>kiệt quệ tài chính</strong> tăng dần (chi phí phá sản, mất khách hàng và nhà cung cấp), nên có một mức nợ tối ưu, vừa phải.</li>
<li><strong>Trật tự phân hạng:</strong> trên thực tế doanh nghiệp ưu tiên nguồn nội bộ trước, rồi đến vay nợ, phát hành cổ phần mới sau cùng, một phần vì phát hành cổ phần có thể phát tín hiệu rằng ban lãnh đạo cho là cổ phiếu đang bị định giá cao.</li>
</ul>
<h3>Chính sách chi trả</h3>
<p>Doanh nghiệp trả tiền cho cổ đông qua <strong>cổ tức</strong> hoặc <strong>mua lại cổ phần</strong>. Trong thị trường hoàn hảo, chính sách chi trả cũng không ảnh hưởng tới giá trị (Modigliani–Miller); trên thực tế thuế, tín hiệu (cắt cổ tức bị hiểu là tin xấu) và nhóm nhà đầu tư ưa thích khiến doanh nghiệp giữ cổ tức ổn định.</p>
<h3>Vốn lưu động: chu kỳ kinh doanh và chu kỳ tiền mặt</h3>
<pre><code>Chu kỳ kinh doanh = kỳ tồn kho + kỳ thu tiền
Chu kỳ tiền mặt   = chu kỳ kinh doanh − kỳ trả tiền
Công ty Alpha: kỳ tồn kho 365 / 3,6 = 101,4 ngày; kỳ thu tiền 365 / 8 = 45,6 ngày
               kỳ trả tiền = 120 / 720 x 365 = 60,8 ngày
               chu kỳ kinh doanh ≈ 147,0 ngày; chu kỳ tiền mặt ≈ 86,2 ngày</code></pre>
<p>Chu kỳ tiền mặt là khoảng thời gian tiền bị "giam" từ lúc trả nhà cung cấp tới lúc thu tiền khách hàng; chu kỳ càng ngắn càng cần ít vốn tài trợ. Điều khoản tín dụng rất quan trọng: bỏ qua chiết khấu "2/10, net 30" nghĩa là trả 2% để giữ 98 thêm 20 ngày — chi phí thực tế năm là (1 + 2/98)^(365/20) − 1 ≈ <strong>44,6%</strong>, nên doanh nghiệp thường nên vay để hưởng chiết khấu.</p>
<div class="callout"><span class="badge">Cân bằng</span> Nợ rẻ nhờ thuế nhưng nguy hiểm vì rủi ro kiệt quệ; vốn lưu động cần thiết nhưng tốn kém. Quản trị tài chính giỏi là tìm ra mức vừa đủ cho từng thứ.</div>`,
  ]]);

const c7q = quiz('fin202-quiz-4', 'Quiz 4 — Capital budgeting & financing|||Quiz 4 — Thẩm định dự án & tài trợ', [
  { id: 'q1', question: 'Under the NPV rule, a firm should accept an independent project when…|||Theo tiêu chuẩn NPV, doanh nghiệp nên chấp nhận một dự án độc lập khi…', options: ['its payback is under 5 years|||thời gian hoàn vốn dưới 5 năm', 'its NPV is greater than zero|||NPV lớn hơn 0', 'its accounting profit is positive|||lợi nhuận kế toán dương', 'its IRR is below the cost of capital|||IRR thấp hơn chi phí vốn'], correctIndex: 1, explanation: 'A positive NPV means the project adds value after covering the return investors require.|||NPV dương nghĩa là dự án tạo thêm giá trị sau khi đã bù đủ lợi nhuận nhà đầu tư đòi hỏi.' },
  { id: 'q2', question: 'Last year the firm spent 50 on a market study for a project. When evaluating the project today, this 50 should be…|||Năm ngoái doanh nghiệp đã chi 50 cho nghiên cứu thị trường của một dự án. Khi thẩm định dự án hôm nay, khoản 50 này nên…', options: ['added to the initial investment|||cộng vào vốn đầu tư ban đầu', 'ignored, because it is a sunk cost|||bỏ qua, vì là chi phí chìm', 'depreciated over the project life|||khấu hao theo đời dự án', 'subtracted from year-1 cash flow|||trừ vào dòng tiền năm 1'], correctIndex: 1, explanation: 'Sunk costs are spent whether or not the project goes ahead, so they are not incremental.|||Chi phí chìm đã chi dù dự án có thực hiện hay không, nên không phải dòng tiền tăng thêm.' },
  { id: 'q3', question: 'The cash cycle equals…|||Chu kỳ tiền mặt bằng…', options: ['inventory period + payables period|||kỳ tồn kho + kỳ trả tiền', 'operating cycle − payables period|||chu kỳ kinh doanh − kỳ trả tiền', 'receivables period − inventory period|||kỳ thu tiền − kỳ tồn kho', 'operating cycle + payables period|||chu kỳ kinh doanh + kỳ trả tiền'], correctIndex: 1, explanation: 'Paying suppliers later shortens the time the firm’s own cash is tied up.|||Trả nhà cung cấp muộn hơn làm ngắn thời gian tiền của chính doanh nghiệp bị giam.' },
]);

const taiLieu = doc('fin202-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (kèm link), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">FIN202 · 📚 Resource hub</span>
<h2>Course materials &amp; references</h2>
<p class="lead">One hub for learning corporate finance: the official syllabus and slides, books, free official resources, video channels, tools and a self-study roadmap.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>Sign in to <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) with your FPTU account to read the official FIN202 syllabus and lecture slides.</p>
<h3>📗 Books</h3>
<ul>
<li><a href="https://openstax.org/details/books/principles-finance" target="_blank" rel="noopener">Principles of Finance</a> — OpenStax: a free, peer-reviewed open textbook.</li>
<li><a href="https://pages.stern.nyu.edu/~adamodar/" target="_blank" rel="noopener">Applied Corporate Finance</a> — Aswath Damodaran (Wiley) — the author’s site also offers free lectures and datasets on the cost of capital.</li>
</ul>
<h3>🌐 Free official resources</h3>
<ul>
<li><a href="https://www.khanacademy.org/economics-finance-domain" target="_blank" rel="noopener">Khan Academy — Finance</a> — free lessons on interest, present value, stocks and bonds.</li>
<li><a href="https://www.ifrs.org/" target="_blank" rel="noopener">IFRS Foundation</a> — the standards behind published financial statements.</li>
<li><a href="https://www.sbv.gov.vn/" target="_blank" rel="noopener">State Bank of Vietnam</a> — official interest and exchange rates — inputs for discount rates.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@AswathDamodaranonValuation" target="_blank" rel="noopener">Aswath Damodaran</a> — valuation and corporate finance lectures.</li>
<li><a href="https://www.youtube.com/@CorporateFinanceInstitute" target="_blank" rel="noopener">Corporate Finance Institute</a> — financial modelling and ratio tutorials.</li>
<li><a href="https://www.youtube.com/@ThePlainBagel" target="_blank" rel="noopener">The Plain Bagel</a> — plain-language explanations of markets and investing.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.microsoft.com/en-us/microsoft-365/excel" target="_blank" rel="noopener">Microsoft Excel</a> — NPV, IRR, PMT and XNPV functions for every exercise.</li>
<li><a href="https://www.google.com/sheets/about/" target="_blank" rel="noopener">Google Sheets</a> — the same finance functions, free and online.</li>
</ul>
<h3>🎯 Self-study roadmap</h3>
<ol>
<li><strong>Foundations (exam core)</strong> — statements, ratios and the time value of money, following Parts 1–2 here.</li>
<li><strong>Practise</strong> — solve five time-value problems a week in a spreadsheet, then check by formula.</li>
<li><strong>Go deeper</strong> — estimate a listed firm’s cost of equity with CAPM using Damodaran’s data.</li>
<li><strong>Apply</strong> — build an NPV model for a small project, with a sensitivity table for price and volume.</li>
</ol>
<div class="callout"><span class="badge">Note</span> An original hub of real links — no copyrighted slides or books are embedded. If a link moves, start from the official homepage.</div>`,
    `<span class="eyebrow">FIN202 · 📚 Trung tâm tài liệu</span>
<h2>Tài liệu tham khảo môn học</h2>
<p class="lead">Một nơi gom để học tài chính doanh nghiệp: giáo trình &amp; slide chính thức, sách, tài liệu miễn phí chính thống, kênh video, công cụ, và lộ trình tự học.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Đăng nhập <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) bằng tài khoản FPTU để đọc giáo trình và slide bài giảng chính thức của FIN202.</p>
<h3>📗 Sách</h3>
<ul>
<li><a href="https://openstax.org/details/books/principles-finance" target="_blank" rel="noopener">Principles of Finance</a> — OpenStax: giáo trình mở miễn phí, có bình duyệt.</li>
<li><a href="https://pages.stern.nyu.edu/~adamodar/" target="_blank" rel="noopener">Applied Corporate Finance</a> — Aswath Damodaran (Wiley) — trang tác giả còn có bài giảng và bộ dữ liệu miễn phí về chi phí vốn.</li>
</ul>
<h3>🌐 Tài liệu chính thức miễn phí</h3>
<ul>
<li><a href="https://www.khanacademy.org/economics-finance-domain" target="_blank" rel="noopener">Khan Academy — Finance</a> — bài học miễn phí về lãi suất, giá trị hiện tại, cổ phiếu và trái phiếu.</li>
<li><a href="https://www.ifrs.org/" target="_blank" rel="noopener">IFRS Foundation</a> — chuẩn mực đứng sau các báo cáo tài chính được công bố.</li>
<li><a href="https://www.sbv.gov.vn/" target="_blank" rel="noopener">State Bank of Vietnam</a> — lãi suất và tỷ giá chính thức — đầu vào cho lãi suất chiết khấu.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@AswathDamodaranonValuation" target="_blank" rel="noopener">Aswath Damodaran</a> — bài giảng định giá và tài chính doanh nghiệp.</li>
<li><a href="https://www.youtube.com/@CorporateFinanceInstitute" target="_blank" rel="noopener">Corporate Finance Institute</a> — hướng dẫn mô hình tài chính và tỷ số.</li>
<li><a href="https://www.youtube.com/@ThePlainBagel" target="_blank" rel="noopener">The Plain Bagel</a> — giải thích thị trường và đầu tư bằng ngôn ngữ dễ hiểu.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.microsoft.com/en-us/microsoft-365/excel" target="_blank" rel="noopener">Microsoft Excel</a> — hàm NPV, IRR, PMT và XNPV cho mọi bài tập.</li>
<li><a href="https://www.google.com/sheets/about/" target="_blank" rel="noopener">Google Sheets</a> — cùng các hàm tài chính đó, miễn phí và trực tuyến.</li>
</ul>
<h3>🎯 Lộ trình tự học</h3>
<ol>
<li><strong>Nền tảng (lõi thi)</strong> — báo cáo, tỷ số và giá trị thời gian của tiền, theo đúng Phần 1–2 ở đây.</li>
<li><strong>Luyện tập</strong> — mỗi tuần giải năm bài giá trị thời gian trên bảng tính, rồi kiểm lại bằng công thức.</li>
<li><strong>Đào sâu</strong> — ước tính chi phí vốn chủ sở hữu của một công ty niêm yết bằng CAPM với dữ liệu của Damodaran.</li>
<li><strong>Vận dụng</strong> — dựng mô hình NPV cho một dự án nhỏ, kèm bảng độ nhạy theo giá và sản lượng.</li>
</ol>
<div class="callout"><span class="badge">Lưu ý</span> Đây là trung tâm liên kết nguyên gốc — không nhúng slide/sách có bản quyền. Link đổi thì vào trang chủ chính thức để tìm.</div>`,
  ]]);

export default {
  semester: { code: 'KY2', name: 'Kỳ 2', ordinal: 2 },
  course: {
    courseCode: 'FIN202',
    slug: 'fin202-principles-of-corporate-finance',
    title: 'Principles of Corporate Finance',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/FIN202.webp',
    shortDescription: 'How firms raise and invest money: financial statements and ratios, the time value of money, bond and stock valuation, risk, CAPM and WACC, NPV and IRR, capital structure and working capital. Bilingual, with worked exercises and quizzes.|||Doanh nghiệp huy động và đầu tư vốn thế nào: báo cáo và tỷ số tài chính, giá trị thời gian của tiền, định giá trái phiếu, cổ phiếu, CAPM, WACC, NPV, IRR, cơ cấu vốn. Song ngữ, có bài tập và quiz.',
    description: 'Môn <strong>FIN202 — Principles of Corporate Finance (Nguyên lý tài chính doanh nghiệp)</strong> (khối Quản trị Kinh doanh, kỳ 2) trả lời ba câu hỏi của nhà quản trị tài chính: <strong>đầu tư vào đâu, tài trợ bằng gì, quản lý vốn lưu động ra sao</strong>. Từ <strong>báo cáo tài chính, dòng tiền và phân tích tỷ số</strong> (DuPont) → <strong>giá trị thời gian của tiền</strong> (niên kim, APR/EAR, trả góp) → <strong>định giá trái phiếu và cổ phiếu</strong>, <strong>rủi ro, CAPM và WACC</strong> → <strong>thẩm định dự án</strong> (NPV, IRR, hoàn vốn, dòng tiền tăng thêm) → <strong>cơ cấu vốn, chính sách cổ tức và chu kỳ tiền mặt</strong>. Bám cấu trúc giáo trình tài chính doanh nghiệp nhập môn chuẩn, song ngữ Anh–Việt, mọi ví dụ số đã kiểm bằng máy, có bài tập kèm lời giải và quiz cuối mỗi phần.',
    whatYouLearn: 'Đọc báo cáo tài chính dưới góc nhìn dòng tiền; tính OCF và dòng tiền tự do\nPhân tích tỷ số thanh khoản, đòn bẩy, hiệu quả, sinh lời và tách ROE bằng DuPont\nTính giá trị hiện tại, tương lai, niên kim, dòng tiền vĩnh viễn và khoản trả góp\nSo sánh lãi suất bằng EAR thay vì APR\nĐịnh giá trái phiếu theo YTM và cổ phiếu theo mô hình Gordon\nĐo rủi ro, phân biệt rủi ro hệ thống và phi hệ thống; áp dụng CAPM và WACC\nThẩm định dự án bằng NPV, IRR, hoàn vốn, PI với dòng tiền tăng thêm đúng chuẩn\nGiải thích đòn bẩy, Modigliani–Miller, chu kỳ tiền mặt và chi phí của tín dụng thương mại',
    requirements: 'Nên học trước ACC101 — Principles of Accounting (đọc được báo cáo tài chính)\nĐại số phổ thông, luỹ thừa và phần trăm\nMáy tính cầm tay tài chính hoặc bảng tính (Excel, Google Sheets) để luyện bài',
  },
  sections: [
    { title: '📚 Course materials|||📚 Tài liệu tham khảo', description: 'Giáo trình & slide trên FLM, sách, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Course introduction|||Giới thiệu môn học', description: 'Ba quyết định tài chính, mục tiêu giá trị, người đại diện.', lessons: [intro] },
    { title: 'Part 1 — Financial statements & analysis|||Phần 1 — Báo cáo tài chính & phân tích', description: 'Dòng tiền, OCF, dòng tiền tự do, tỷ số, DuPont.', lessons: [c1, c2, c2e, c2q] },
    { title: 'Part 2 — The time value of money|||Phần 2 — Giá trị thời gian của tiền', description: 'FV, PV, niên kim, vĩnh viễn, APR/EAR, trả góp.', lessons: [c3, c3e, c3q] },
    { title: 'Part 3 — Valuation, risk & the cost of capital|||Phần 3 — Định giá, rủi ro & chi phí vốn', description: 'Trái phiếu, cổ phiếu, beta, CAPM, WACC.', lessons: [c4, c5, c5q] },
    { title: 'Part 4 — Capital budgeting, financing & working capital|||Phần 4 — Thẩm định dự án, tài trợ & vốn lưu động', description: 'NPV, IRR, dòng tiền dự án, cơ cấu vốn, chu kỳ tiền mặt.', lessons: [c6, c6e, c7, c7q] },
  ],
};
