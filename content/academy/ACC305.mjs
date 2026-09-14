/**
 * ACC305 — Financial Statement Analysis. Giáo trình FLM (khối Quản trị Kinh
 * doanh, kỳ 5): khuôn khổ phân tích, ba báo cáo tài chính, phân tích tỷ số,
 * DuPont, dự báo & định giá cơ bản, phát hiện gian lận & phân tích tín dụng.
 * Trích dẫn: Subramanyam FSA, Penman, White/Sondhi/Fried, CFA curriculum.
 * Song ngữ + ví dụ số (Công ty ABC, giả định) + quiz. Giữ NGUYÊN
 * slug/semester/thumb của stub. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('acc305-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình chuẩn (Subramanyam, Penman, White/Sondhi/Fried, CFA), tài liệu miễn phí (SEC EDGAR, CFI), YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">ACC305 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Financial Statement Analysis</strong> — reading the balance sheet, income statement and cash flow statement, ratio and DuPont analysis, forecasting, valuation, and spotting earnings management — in one place. Full official slides &amp; syllabus are on <strong>FLM</strong>; below are widely used academic references and free resources.</p>
<h3>📘 Core textbooks (giáo trình chuẩn)</h3>
<ul>
<li><em>Financial Statement Analysis</em> — K.R. Subramanyam &amp; John Wild — the standard FSA textbook used by most university courses, including CFA-aligned programs.</li>
<li><em>Financial Statement Analysis and Security Valuation</em> — Stephen Penman — links accounting numbers to equity valuation.</li>
<li><em>The Analysis and Use of Financial Statements</em> — White, Sondhi &amp; Fried — deep coverage of accounting quality and ratio analysis.</li>
<li>CFA Program Curriculum — Financial Statement Analysis readings (Level I &amp; II) — the professional-certification treatment of this course's topics.</li>
</ul>
<h3>🌐 Free / official resources</h3>
<ul>
<li><a href="https://www.sec.gov/edgar/search/" target="_blank" rel="noopener">SEC EDGAR full-text search</a> — real 10-K/10-Q filings to practice on real companies.</li>
<li><a href="https://corporatefinanceinstitute.com/resources/accounting/" target="_blank" rel="noopener">Corporate Finance Institute — Accounting &amp; FSA resources</a></li>
<li><a href="https://www.investopedia.com/financial-statement-analysis-4689809" target="_blank" rel="noopener">Investopedia — Financial Statement Analysis guide</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@AswathDamodaranonValuation" target="_blank" rel="noopener">Aswath Damodaran</a> — NYU Stern professor, valuation &amp; corporate finance lectures.</li>
<li><a href="https://www.youtube.com/@corporatefinanceinstitute" target="_blank" rel="noopener">Corporate Finance Institute</a> — ratio analysis &amp; financial modeling walkthroughs.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://stockanalysis.com/" target="_blank" rel="noopener">stockanalysis.com</a> — free real financial statements &amp; ratios for listed companies.</li>
<li>Microsoft Excel / Google Sheets — building common-size statements, ratio dashboards and forecasts.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — the three statements (balance sheet, income statement, cash flows) and how they connect.</li>
<li><strong>Practice</strong> — compute the core ratios (liquidity, efficiency, leverage, profitability) on a real 10-K from EDGAR.</li>
<li><strong>Go deeper</strong> — DuPont decomposition, forecasting, basic valuation multiples.</li>
<li><strong>Job-ready</strong> — recognize earnings-management red flags and apply a basic credit-risk score.</li>
</ol></div>`,
    `<span class="eyebrow">ACC305 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Phân tích báo cáo tài chính</strong> — đọc bảng cân đối kế toán, kết quả kinh doanh và lưu chuyển tiền tệ, phân tích tỷ số &amp; DuPont, dự báo, định giá, và phát hiện gian lận lợi nhuận — gom về một chỗ. Slide &amp; đề cương chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là tài liệu học thuật phổ biến và nguồn miễn phí.</p>
<h3>📘 Giáo trình chuẩn</h3>
<ul>
<li><em>Financial Statement Analysis</em> — K.R. Subramanyam &amp; John Wild — giáo trình FSA chuẩn được hầu hết các trường dùng, kể cả chương trình theo chuẩn CFA.</li>
<li><em>Financial Statement Analysis and Security Valuation</em> — Stephen Penman — nối số liệu kế toán với định giá cổ phiếu.</li>
<li><em>The Analysis and Use of Financial Statements</em> — White, Sondhi &amp; Fried — đào sâu chất lượng kế toán và phân tích tỷ số.</li>
<li>Giáo trình CFA — phần Financial Statement Analysis (Level I &amp; II) — cách tiếp cận theo chuẩn chứng chỉ nghề nghiệp.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.sec.gov/edgar/search/" target="_blank" rel="noopener">SEC EDGAR full-text search</a> — báo cáo 10-K/10-Q thật để luyện tập trên công ty thật.</li>
<li><a href="https://corporatefinanceinstitute.com/resources/accounting/" target="_blank" rel="noopener">Corporate Finance Institute — tài liệu Kế toán &amp; FSA</a></li>
<li><a href="https://www.investopedia.com/financial-statement-analysis-4689809" target="_blank" rel="noopener">Investopedia — hướng dẫn Phân tích BCTC</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@AswathDamodaranonValuation" target="_blank" rel="noopener">Aswath Damodaran</a> — giáo sư NYU Stern, bài giảng định giá &amp; tài chính doanh nghiệp.</li>
<li><a href="https://www.youtube.com/@corporatefinanceinstitute" target="_blank" rel="noopener">Corporate Finance Institute</a> — hướng dẫn phân tích tỷ số &amp; mô hình tài chính.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://stockanalysis.com/" target="_blank" rel="noopener">stockanalysis.com</a> — BCTC thật &amp; tỷ số miễn phí của các công ty niêm yết.</li>
<li>Microsoft Excel / Google Sheets — dựng báo cáo common-size, bảng tỷ số và dự báo.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — ba báo cáo tài chính (cân đối kế toán, kết quả kinh doanh, lưu chuyển tiền tệ) và cách chúng liên kết.</li>
<li><strong>Luyện tập</strong> — tính các tỷ số cốt lõi (thanh khoản, hiệu quả, đòn bẩy, sinh lời) trên một báo cáo 10-K thật từ EDGAR.</li>
<li><strong>Đào sâu</strong> — phân rã DuPont, dự báo, các bội số định giá cơ bản.</li>
<li><strong>Sẵn sàng đi làm</strong> — nhận diện dấu hiệu earnings management và áp dụng một điểm số tín dụng cơ bản.</li>
</ol></div>`,
  ]]);

const intro = doc('acc305-0-1-overview', 'Course overview: Financial Statement Analysis|||Tổng quan: Phân tích báo cáo tài chính',
  'Phân tích BCTC là gì, ai dùng và để làm gì; ba báo cáo tài chính cốt lõi; lộ trình 8 chương của môn.',
  [[
    `<span class="eyebrow">ACC305 · Lesson 0.1 · Overview</span>
<h2>Financial Statement Analysis</h2>
<p class="lead">This course teaches you to <strong>read a company's financial statements and judge its financial health</strong> — the same skill used by equity investors picking stocks, bank credit officers deciding on a loan, and managers benchmarking their own company against competitors.</p>
<h3>Who uses financial statement analysis, and for what</h3>
<ul>
<li><strong>Equity investors</strong> — is the company profitable and growing? Is the stock cheap or expensive relative to its earnings?</li>
<li><strong>Creditors / banks</strong> — can this company repay its debt? What's the risk of default?</li>
<li><strong>Management &amp; boards</strong> — how does our performance compare to competitors and to our own past?</li>
<li><strong>Auditors &amp; regulators</strong> — are the numbers reliable, or is something being hidden?</li>
</ul>
<h3>The three core financial statements</h3>
<ul>
<li><strong>Balance sheet</strong> — a snapshot of what the company owns (assets) and owes (liabilities), and what's left for owners (equity), at one point in time.</li>
<li><strong>Income statement</strong> — revenue, expenses and profit over a period (e.g. one year).</li>
<li><strong>Statement of cash flows</strong> — where cash actually came from and went, over the same period.</li>
</ul>
<p>They connect: net income from the income statement flows into equity on the balance sheet and is the starting point of the cash flow statement.</p>
<h3>Roadmap (8 chapters)</h3>
<p>Analytical framework &amp; environment → balance sheet → income statement &amp; earnings quality → cash flow statement → ratio analysis → DuPont decomposition → forecasting &amp; valuation → fraud detection &amp; credit analysis. Bilingual, with a running worked example (fictional "ABC Corp") and a quiz after every chapter.</p>`,
    `<span class="eyebrow">ACC305 · Bài 0.1 · Tổng quan</span>
<h2>Phân tích báo cáo tài chính</h2>
<p class="lead">Môn này dạy bạn <strong>đọc báo cáo tài chính của một công ty và đánh giá sức khoẻ tài chính của nó</strong> — đúng kỹ năng mà nhà đầu tư cổ phiếu, chuyên viên tín dụng ngân hàng, hay nhà quản lý dùng để so sánh công ty mình với đối thủ.</p>
<h3>Ai dùng phân tích BCTC, và để làm gì</h3>
<ul>
<li><strong>Nhà đầu tư cổ phiếu</strong> — công ty có sinh lời và tăng trưởng không? Cổ phiếu đang rẻ hay đắt so với lợi nhuận?</li>
<li><strong>Chủ nợ / ngân hàng</strong> — công ty có trả được nợ không? Rủi ro vỡ nợ ra sao?</li>
<li><strong>Ban lãnh đạo</strong> — hiệu quả của mình so với đối thủ và so với chính mình trong quá khứ thế nào?</li>
<li><strong>Kiểm toán viên &amp; cơ quan quản lý</strong> — số liệu có đáng tin, hay đang có gì bị che giấu?</li>
</ul>
<h3>Ba báo cáo tài chính cốt lõi</h3>
<ul>
<li><strong>Bảng cân đối kế toán</strong> — ảnh chụp những gì công ty sở hữu (tài sản) và nợ (nợ phải trả), phần còn lại cho chủ sở hữu (vốn chủ), tại một thời điểm.</li>
<li><strong>Báo cáo kết quả kinh doanh</strong> — doanh thu, chi phí và lợi nhuận trong một kỳ (vd một năm).</li>
<li><strong>Báo cáo lưu chuyển tiền tệ</strong> — tiền thực sự đến từ đâu và đi đâu, trong cùng kỳ đó.</li>
</ul>
<p>Chúng liên kết với nhau: lợi nhuận ròng từ báo cáo kết quả kinh doanh chảy vào vốn chủ trên bảng cân đối kế toán, và là điểm khởi đầu của báo cáo lưu chuyển tiền tệ.</p>
<h3>Lộ trình (8 chương)</h3>
<p>Khuôn khổ phân tích &amp; môi trường → bảng cân đối kế toán → kết quả kinh doanh &amp; chất lượng lợi nhuận → lưu chuyển tiền tệ → phân tích tỷ số → phân rã DuPont → dự báo &amp; định giá → phát hiện gian lận &amp; phân tích tín dụng. Song ngữ, có ví dụ tính toán xuyên suốt (công ty giả định "ABC Corp") và quiz sau mỗi chương.</p>`,
  ]]);

const c1 = doc('acc305-1-1-framework', '1.1 — Analytical framework & business environment|||1.1 — Khuôn khổ phân tích & môi trường kinh doanh',
  '4 bước phân tích BCTC (chiến lược, kế toán, tài chính, dự phóng); người dùng & câu hỏi của họ; giới hạn của BCTC.',
  [[
    `<span class="eyebrow">ACC305 · Chapter 1 · Lesson 1.1</span>
<h2>Analytical framework &amp; business environment</h2>
<h3>The 4-step analysis framework</h3>
<ul>
<li><strong>1. Business strategy analysis</strong> — understand the industry and the company's competitive strategy before looking at a single number; the same ratio means different things in different industries.</li>
<li><strong>2. Accounting analysis</strong> — evaluate whether the reported numbers actually reflect the underlying economics (accounting policy choices, estimates, potential distortions).</li>
<li><strong>3. Financial analysis</strong> — use ratios, common-size statements and cash flow analysis to evaluate current performance and financial health.</li>
<li><strong>4. Prospective analysis</strong> — forecast future performance and value the company, building on steps 1-3.</li>
</ul>
<h3>Users and their key questions</h3>
<pre><code>User            Key question
--------------  -----------------------------------------
Equity investor Is the stock under/overvalued? Growth OK?
Creditor/bank   Can this company service its debt on time?
Manager         Where are we losing/gaining vs competitors?
Auditor         Do the numbers fairly represent reality?
</code></pre>
<h3>Limitations of financial statements</h3>
<ul>
<li><strong>Historical cost</strong> — many assets are recorded at what was paid, not current value.</li>
<li><strong>Accounting choices &amp; estimates</strong> — depreciation method, inventory costing, allowance for bad debts all involve judgment.</li>
<li><strong>Missing non-financial information</strong> — brand strength, employee morale, customer relationships don't appear on the balance sheet.</li>
</ul>
<div class="callout"><span class="badge">Why this matters first</span> Skipping straight to ratios without understanding the business and its accounting choices is the most common analyst mistake — a ratio is only as meaningful as the numbers behind it.</div>`,
    `<span class="eyebrow">ACC305 · Chương 1 · Bài 1.1</span>
<h2>Khuôn khổ phân tích &amp; môi trường kinh doanh</h2>
<h3>Khung phân tích 4 bước</h3>
<ul>
<li><strong>1. Phân tích chiến lược kinh doanh</strong> — hiểu ngành và chiến lược cạnh tranh của công ty trước khi nhìn vào bất kỳ con số nào; cùng một tỷ số có ý nghĩa khác nhau ở mỗi ngành.</li>
<li><strong>2. Phân tích kế toán</strong> — đánh giá xem số liệu báo cáo có thực sự phản ánh bản chất kinh tế hay không (lựa chọn chính sách kế toán, ước tính, khả năng bị bóp méo).</li>
<li><strong>3. Phân tích tài chính</strong> — dùng tỷ số, báo cáo common-size và phân tích dòng tiền để đánh giá hiệu quả hiện tại và sức khoẻ tài chính.</li>
<li><strong>4. Phân tích dự phóng</strong> — dự báo hiệu quả tương lai và định giá công ty, dựa trên 3 bước trên.</li>
</ul>
<h3>Người dùng và câu hỏi chính của họ</h3>
<pre><code>Người dùng      Câu hỏi chính
--------------  -----------------------------------------
Nhà đầu tư      Cổ phiếu định giá thấp/cao? Tăng trưởng OK?
Chủ nợ/ngân hàng Công ty có trả nợ đúng hạn được không?
Quản lý         Đang thua/thắng đối thủ ở đâu?
Kiểm toán       Số liệu có phản ánh đúng thực tế không?
</code></pre>
<h3>Giới hạn của báo cáo tài chính</h3>
<ul>
<li><strong>Giá gốc lịch sử</strong> — nhiều tài sản được ghi theo giá đã trả, không phải giá trị hiện tại.</li>
<li><strong>Lựa chọn &amp; ước tính kế toán</strong> — phương pháp khấu hao, tính giá tồn kho, dự phòng nợ xấu đều mang tính chủ quan.</li>
<li><strong>Thiếu thông tin phi tài chính</strong> — sức mạnh thương hiệu, tinh thần nhân viên, quan hệ khách hàng không xuất hiện trên bảng cân đối kế toán.</li>
</ul>
<div class="callout"><span class="badge">Vì sao phải làm bước này trước</span> Nhảy thẳng vào tính tỷ số mà không hiểu ngành và lựa chọn kế toán của công ty là lỗi phổ biến nhất của người phân tích — một tỷ số chỉ có ý nghĩa bằng đúng độ tin cậy của con số đứng sau nó.</div>`,
  ]]);

const c1q = quiz('acc305-quiz-1', 'Quiz 1 — Analytical framework|||Quiz 1 — Khuôn khổ phân tích', [
  { id: 'q1', question: 'Bước đầu tiên trong khung phân tích BCTC 4 bước là gì?', options: ['Phân tích tài chính', 'Phân tích chiến lược kinh doanh', 'Phân tích kế toán', 'Dự phóng tương lai'], correctIndex: 1, explanation: 'Phải hiểu ngành & chiến lược cạnh tranh trước khi nhìn vào con số.' },
  { id: 'q2', question: 'Vì sao nói BCTC có "giới hạn"?', options: ['Vì luôn sai', 'Vì dùng giá gốc lịch sử & có ước tính kế toán mang tính chủ quan', 'Vì không ai đọc', 'Vì chỉ ngân hàng mới dùng được'], correctIndex: 1, explanation: 'Giá gốc lịch sử và các ước tính (khấu hao, dự phòng nợ xấu...) làm số liệu không phản ánh hoàn toàn giá trị thực.' },
  { id: 'q3', question: 'Ngân hàng cho vay quan tâm nhất câu hỏi nào?', options: ['Cổ phiếu có bị định giá thấp không', 'Công ty có trả nợ đúng hạn được không', 'Nhân viên có hài lòng không', 'Thương hiệu có mạnh không'], correctIndex: 1, explanation: 'Chủ nợ quan tâm khả năng trả nợ (khả năng thanh toán), không phải định giá cổ phiếu.' },
]);

const c2 = doc('acc305-2-1-balance-sheet', '2.1 — Balance sheet & analysis of assets, liabilities & equity|||2.1 — Bảng cân đối kế toán & phân tích tài sản, nợ, vốn chủ',
  'Phương trình kế toán A=L+E; phân loại ngắn/dài hạn; ví dụ số liệu; vốn lưu động; chất lượng tài sản.',
  [[
    `<span class="eyebrow">ACC305 · Chapter 2 · Lesson 2.1</span>
<h2>Balance sheet &amp; analysis of assets, liabilities &amp; equity</h2>
<h3>The accounting equation</h3>
<p><strong>Assets = Liabilities + Equity</strong>. Everything a company owns (assets) was financed either by borrowing (liabilities) or by owners' capital and retained profits (equity). The balance sheet is a snapshot at one date, not a period.</p>
<h3>Current vs. non-current</h3>
<ul>
<li><strong>Current assets</strong> — expected to convert to cash within one year (cash, receivables, inventory).</li>
<li><strong>Current liabilities</strong> — due within one year (payables, short-term debt).</li>
<li><strong>Working capital</strong> = Current assets − Current liabilities — the cash cushion for day-to-day operations.</li>
</ul>
<h3>Worked example — ABC Corp (assumed figures, unit: VND billion)</h3>
<pre><code>ABC Corp - Balance sheet (assumed, VND billion)
ASSETS                        LIABILITIES &amp; EQUITY
Cash                 50       Accounts payable        90
Accounts receivable 120       Short-term debt          60
Inventory           150       -----------------------------
-----------------------       Current liabilities     150
Current assets       320       Long-term debt          250
Net PP&amp;E             480       -----------------------------
                                Total liabilities       400
                                Equity                  400
-----------------------       -----------------------------
TOTAL ASSETS          800      TOTAL LIAB. &amp; EQUITY     800

Working capital = 320 - 150 = 170
</code></pre>
<h3>Quality of assets</h3>
<p>Not all assets are equally "real": receivables that keep aging without being collected, inventory that isn't selling, or goodwill from an overpaid acquisition can overstate the balance sheet. Always ask what an asset would actually fetch if sold.</p>
<div class="callout"><span class="badge">Keep the numbers</span> ABC Corp's figures above are used again in Chapters 3-6 to build the income statement, cash flow, ratios and DuPont example — so the whole picture stays consistent.</div>`,
    `<span class="eyebrow">ACC305 · Chương 2 · Bài 2.1</span>
<h2>Bảng cân đối kế toán &amp; phân tích tài sản, nợ, vốn chủ</h2>
<h3>Phương trình kế toán</h3>
<p><strong>Tài sản = Nợ phải trả + Vốn chủ sở hữu</strong>. Mọi thứ công ty sở hữu (tài sản) đều được tài trợ bằng vay nợ (nợ phải trả) hoặc vốn góp &amp; lợi nhuận giữ lại của chủ sở hữu (vốn chủ). Bảng cân đối kế toán là ảnh chụp tại một ngày, không phải một kỳ.</p>
<h3>Ngắn hạn vs dài hạn</h3>
<ul>
<li><strong>Tài sản ngắn hạn</strong> — dự kiến chuyển thành tiền trong vòng một năm (tiền mặt, phải thu, tồn kho).</li>
<li><strong>Nợ ngắn hạn</strong> — đến hạn trong vòng một năm (phải trả người bán, vay ngắn hạn).</li>
<li><strong>Vốn lưu động</strong> = Tài sản ngắn hạn − Nợ ngắn hạn — đệm tiền mặt cho hoạt động hằng ngày.</li>
</ul>
<h3>Ví dụ tính toán — Công ty ABC (số liệu giả định, đơn vị: tỷ đồng)</h3>
<pre><code>Công ty ABC - Bảng cân đối kế toán (giả định, tỷ đồng)
TÀI SẢN                        NGUỒN VỐN
Tiền mặt              50       Phải trả người bán       90
Phải thu khách hàng  120       Vay ngắn hạn             60
Hàng tồn kho         150       -----------------------------
-----------------------        Nợ ngắn hạn             150
Tài sản ngắn hạn      320       Vay dài hạn             250
TSCĐ ròng             480       -----------------------------
                                 Tổng nợ phải trả        400
                                 Vốn chủ sở hữu          400
-----------------------        -----------------------------
TỔNG TÀI SẢN           800      TỔNG NGUỒN VỐN          800

Vốn lưu động = 320 - 150 = 170
</code></pre>
<h3>Chất lượng tài sản</h3>
<p>Không phải tài sản nào cũng "thật" như nhau: phải thu cứ già đi mà không thu được, tồn kho không bán được, hay lợi thế thương mại từ một thương vụ mua đắt có thể làm phồng bảng cân đối kế toán. Luôn tự hỏi tài sản đó thực sự bán được bao nhiêu nếu phải bán ngay.</p>
<div class="callout"><span class="badge">Giữ lại số liệu này</span> Các con số của Công ty ABC ở trên được dùng lại xuyên suốt Chương 3-6 để dựng báo cáo kết quả kinh doanh, lưu chuyển tiền tệ, tỷ số và ví dụ DuPont — để bức tranh luôn nhất quán.</div>`,
  ]]);

const c2q = quiz('acc305-quiz-2', 'Quiz 2 — Balance sheet|||Quiz 2 — Bảng cân đối kế toán', [
  { id: 'q1', question: 'Phương trình kế toán cơ bản là?', options: ['Tài sản = Nợ phải trả − Vốn chủ', 'Tài sản = Nợ phải trả + Vốn chủ sở hữu', 'Vốn chủ = Tài sản + Nợ phải trả', 'Nợ phải trả = Tài sản + Vốn chủ'], correctIndex: 1, explanation: 'A = L + E: tài sản được tài trợ bởi nợ và vốn chủ sở hữu.' },
  { id: 'q2', question: 'Vốn lưu động (working capital) được tính bằng?', options: ['Tổng tài sản − Tổng nợ', 'Tài sản ngắn hạn − Nợ ngắn hạn', 'Tài sản dài hạn − Nợ dài hạn', 'Vốn chủ sở hữu − Nợ vay'], correctIndex: 1, explanation: 'Vốn lưu động = TS ngắn hạn − Nợ ngắn hạn, đệm thanh khoản cho hoạt động hằng ngày.' },
  { id: 'q3', question: 'Vì sao khoản phải thu khách hàng bị "già" (lâu không thu được) đáng lo ngại?', options: ['Vì nó làm tăng tiền mặt', 'Vì nó có thể không phản ánh giá trị thu hồi thực, làm "phồng" tài sản', 'Vì kế toán bắt buộc phải xoá nó ngay', 'Vì nó không liên quan tới chất lượng tài sản'], correctIndex: 1, explanation: 'Phải thu tồn đọng lâu có nguy cơ không đòi được, khiến tài sản trên sổ sách cao hơn giá trị thực.' },
]);

const c3 = doc('acc305-3-1-income-statement', '3.1 — Income statement & earnings quality|||3.1 — Báo cáo kết quả kinh doanh & chất lượng lợi nhuận',
  'Ghi nhận doanh thu; hoạt động kinh doanh chính vs bất thường; ví dụ số liệu; dấu hiệu chất lượng lợi nhuận thấp.',
  [[
    `<span class="eyebrow">ACC305 · Chapter 3 · Lesson 3.1</span>
<h2>Income statement &amp; earnings quality</h2>
<h3>Revenue recognition &amp; the structure of the income statement</h3>
<p>Revenue is recognized when it is <strong>earned</strong> (goods/services delivered), not necessarily when cash is received. The income statement separates <strong>operating</strong> results (the core, recurring business) from <strong>non-operating</strong> items (interest, one-time gains/losses) — operating income is the best measure of ongoing profitability.</p>
<h3>Worked example — ABC Corp (assumed figures, VND billion)</h3>
<pre><code>ABC Corp - Income statement (assumed, VND billion)
Revenue                        1,000
Cost of goods sold               (650)
------------------------------------
Gross profit                      350   (gross margin 35.0%)
Operating expenses                (200)
------------------------------------
EBIT (operating income)           150
Interest expense                   (30)
------------------------------------
Earnings before tax (EBT)         120
Tax expense (20%)                  (24)
------------------------------------
Net income                          96   (net margin 9.6%)
</code></pre>
<h3>Earnings quality — red flags</h3>
<ul>
<li><strong>Aggressive revenue recognition</strong> — booking revenue before it's truly earned (e.g. before delivery/acceptance).</li>
<li><strong>One-time gains dressed as recurring</strong> — a gain from selling an asset boosting net income once, then vanishing.</li>
<li><strong>Net income growing while operating cash flow doesn't</strong> — profit on paper not turning into cash (see Chapter 4).</li>
</ul>
<div class="callout"><span class="badge">Rule of thumb</span> High-quality earnings are recurring, backed by cash, and come from the core business — not from accounting choices or one-off items.</div>`,
    `<span class="eyebrow">ACC305 · Chương 3 · Bài 3.1</span>
<h2>Báo cáo kết quả kinh doanh &amp; chất lượng lợi nhuận</h2>
<h3>Ghi nhận doanh thu &amp; cấu trúc báo cáo kết quả kinh doanh</h3>
<p>Doanh thu được ghi nhận khi đã <strong>kiếm được</strong> (hàng hoá/dịch vụ đã giao), không nhất thiết khi nhận được tiền. Báo cáo kết quả kinh doanh tách kết quả <strong>hoạt động</strong> (kinh doanh cốt lõi, lặp lại) khỏi các khoản <strong>ngoài hoạt động</strong> (lãi vay, lãi/lỗ bất thường) — lợi nhuận hoạt động là thước đo tốt nhất cho khả năng sinh lời lâu dài.</p>
<h3>Ví dụ tính toán — Công ty ABC (số liệu giả định, tỷ đồng)</h3>
<pre><code>Công ty ABC - Báo cáo kết quả kinh doanh (giả định, tỷ đồng)
Doanh thu                       1,000
Giá vốn hàng bán                  (650)
------------------------------------
Lợi nhuận gộp                      350   (biên LN gộp 35,0%)
Chi phí hoạt động                  (200)
------------------------------------
EBIT (lợi nhuận hoạt động)         150
Chi phí lãi vay                     (30)
------------------------------------
Lợi nhuận trước thuế (EBT)         120
Thuế TNDN (20%)                     (24)
------------------------------------
Lợi nhuận ròng                       96   (biên LN ròng 9,6%)
</code></pre>
<h3>Chất lượng lợi nhuận — dấu hiệu cảnh báo</h3>
<ul>
<li><strong>Ghi nhận doanh thu quá sớm</strong> — ghi doanh thu trước khi thực sự kiếm được (vd trước khi giao/nghiệm thu hàng).</li>
<li><strong>Lãi bất thường được "khoác áo" thường xuyên</strong> — lãi từ bán tài sản làm tăng lợi nhuận ròng một lần rồi biến mất.</li>
<li><strong>Lợi nhuận ròng tăng nhưng dòng tiền hoạt động không tăng</strong> — lợi nhuận trên sổ sách chưa chuyển thành tiền thật (xem Chương 4).</li>
</ul>
<div class="callout"><span class="badge">Nguyên tắc chung</span> Lợi nhuận chất lượng cao là lợi nhuận lặp lại, có tiền mặt hậu thuẫn, và đến từ hoạt động kinh doanh cốt lõi — không phải từ lựa chọn kế toán hay khoản bất thường.</div>`,
  ]]);

const c3q = quiz('acc305-quiz-3', 'Quiz 3 — Income statement|||Quiz 3 — Kết quả kinh doanh', [
  { id: 'q1', question: 'Doanh thu được ghi nhận khi nào theo nguyên tắc kế toán dồn tích?', options: ['Khi nhận được tiền mặt', 'Khi hàng hoá/dịch vụ đã được chuyển giao (đã kiếm được)', 'Khi ký hợp đồng', 'Khi xuất hoá đơn bất kể đã giao hàng chưa'], correctIndex: 1, explanation: 'Ghi nhận doanh thu khi đã "kiếm được" — hàng/dịch vụ đã giao — không phải khi có tiền.' },
  { id: 'q2', question: 'Lợi nhuận hoạt động (EBIT) khác gì lợi nhuận ròng?', options: ['EBIT đã trừ thuế và lãi vay', 'EBIT chưa trừ lãi vay và thuế, phản ánh hoạt động kinh doanh cốt lõi', 'EBIT là doanh thu trừ giá vốn', 'Không có khác biệt'], correctIndex: 1, explanation: 'EBIT = lợi nhuận trước lãi vay & thuế, đo hiệu quả hoạt động cốt lõi, tách khỏi cấu trúc vốn và thuế.' },
  { id: 'q3', question: 'Dấu hiệu cảnh báo chất lượng lợi nhuận thấp là gì?', options: ['Lợi nhuận tăng đều cùng dòng tiền hoạt động', 'Lợi nhuận tăng nhưng dòng tiền hoạt động không tăng tương ứng', 'Biên lợi nhuận gộp ổn định nhiều năm', 'Doanh thu đến từ khách hàng lâu năm'], correctIndex: 1, explanation: 'Lợi nhuận trên sổ sách tăng mà không chuyển thành tiền thật là dấu hiệu cần soi kỹ.' },
]);

const c4 = doc('acc305-4-1-cash-flow', '4.1 — Statement of cash flows|||4.1 — Báo cáo lưu chuyển tiền tệ',
  'Ba dòng tiền: hoạt động/đầu tư/tài chính; phương pháp gián tiếp; dòng tiền tự do; vì sao tiền mặt khó "làm giả" hơn lợi nhuận.',
  [[
    `<span class="eyebrow">ACC305 · Chapter 4 · Lesson 4.1</span>
<h2>Statement of cash flows</h2>
<h3>Three sections</h3>
<ul>
<li><strong>Operating (CFO)</strong> — cash generated by the core business.</li>
<li><strong>Investing (CFI)</strong> — cash spent on/received from long-term assets (capex, acquisitions, asset sales).</li>
<li><strong>Financing (CFF)</strong> — cash flows with lenders and shareholders (debt issued/repaid, dividends, share buybacks/issuance).</li>
</ul>
<h3>Indirect method: net income → operating cash flow</h3>
<p>Start from net income, add back non-cash expenses (depreciation), then adjust for changes in working-capital accounts: an <em>increase</em> in receivables or inventory is a <em>use</em> of cash; an <em>increase</em> in payables is a <em>source</em> of cash.</p>
<h3>Worked example — ABC Corp (assumed figures, VND billion; continues Ch.2-3)</h3>
<pre><code>ABC Corp - Cash flow statement, indirect method (assumed, VND billion)
Net income                          96
+ Depreciation &amp; amortization       40
- Increase in receivables          (20)
- Increase in inventory            (10)
+ Increase in payables              15
--------------------------------------
Cash flow from operations (CFO)    121

Capital expenditures (capex)       (80)
--------------------------------------
Cash flow from investing (CFI)     (80)

Debt repayment                     (20)
Dividends paid                     (15)
--------------------------------------
Cash flow from financing (CFF)     (35)

Net change in cash                    6

Free cash flow = CFO - capex = 121 - 80 = 41
</code></pre>
<div class="callout"><span class="badge">Why analysts trust cash flow more</span> Net income depends on accounting estimates and accruals; cash flow shows money that actually moved. A company reporting rising profit with falling operating cash flow deserves a closer look.</div>`,
    `<span class="eyebrow">ACC305 · Chương 4 · Bài 4.1</span>
<h2>Báo cáo lưu chuyển tiền tệ</h2>
<h3>Ba phần chính</h3>
<ul>
<li><strong>Hoạt động (CFO)</strong> — tiền tạo ra từ kinh doanh cốt lõi.</li>
<li><strong>Đầu tư (CFI)</strong> — tiền chi cho/thu về từ tài sản dài hạn (mua sắm TSCĐ, mua công ty, bán tài sản).</li>
<li><strong>Tài chính (CFF)</strong> — dòng tiền với chủ nợ và cổ đông (vay/trả nợ, cổ tức, mua lại/phát hành cổ phiếu).</li>
</ul>
<h3>Phương pháp gián tiếp: lợi nhuận ròng → dòng tiền hoạt động</h3>
<p>Bắt đầu từ lợi nhuận ròng, cộng lại chi phí không bằng tiền (khấu hao), rồi điều chỉnh theo thay đổi các khoản vốn lưu động: <em>tăng</em> phải thu hoặc tồn kho là một khoản <em>sử dụng</em> tiền; <em>tăng</em> phải trả là một khoản <em>tạo ra</em> tiền.</p>
<h3>Ví dụ tính toán — Công ty ABC (số liệu giả định, tỷ đồng; nối tiếp Ch.2-3)</h3>
<pre><code>Công ty ABC - Báo cáo LCTT, phương pháp gián tiếp (giả định, tỷ đồng)
Lợi nhuận ròng                        96
+ Khấu hao                            40
- Tăng khoản phải thu                (20)
- Tăng hàng tồn kho                  (10)
+ Tăng khoản phải trả                 15
--------------------------------------
Dòng tiền từ hoạt động (CFO)        121

Chi tiêu vốn (capex)                (80)
--------------------------------------
Dòng tiền từ đầu tư (CFI)           (80)

Trả nợ gốc vay                      (20)
Chi trả cổ tức                      (15)
--------------------------------------
Dòng tiền từ tài chính (CFF)        (35)

Thay đổi tiền thuần                    6

Dòng tiền tự do = CFO - capex = 121 - 80 = 41
</code></pre>
<div class="callout"><span class="badge">Vì sao nhà phân tích tin dòng tiền hơn</span> Lợi nhuận ròng phụ thuộc vào ước tính và dồn tích kế toán; dòng tiền cho thấy tiền thực sự đã dịch chuyển. Một công ty báo lợi nhuận tăng nhưng dòng tiền hoạt động giảm cần được xem xét kỹ hơn.</div>`,
  ]]);

const c4q = quiz('acc305-quiz-4', 'Quiz 4 — Cash flow statement|||Quiz 4 — Lưu chuyển tiền tệ', [
  { id: 'q1', question: 'Báo cáo lưu chuyển tiền tệ có mấy phần chính?', options: ['2 phần', '3 phần: hoạt động, đầu tư, tài chính', '4 phần', '1 phần duy nhất'], correctIndex: 1, explanation: 'Ba dòng: hoạt động (CFO), đầu tư (CFI), tài chính (CFF).' },
  { id: 'q2', question: 'Khoản phải thu TĂNG sẽ ảnh hưởng thế nào tới dòng tiền hoạt động (phương pháp gián tiếp)?', options: ['Làm tăng CFO', 'Làm giảm CFO (là một khoản sử dụng tiền)', 'Không ảnh hưởng', 'Làm tăng CFI'], correctIndex: 1, explanation: 'Phải thu tăng nghĩa là doanh thu chưa thu được tiền → trừ ra khỏi CFO.' },
  { id: 'q3', question: 'Dòng tiền tự do (free cash flow) thường được tính bằng?', options: ['Lợi nhuận ròng + khấu hao', 'CFO trừ chi tiêu vốn (capex)', 'CFO cộng CFI cộng CFF', 'Doanh thu trừ giá vốn'], correctIndex: 1, explanation: 'FCF = CFO − capex, phần tiền còn lại sau khi duy trì/mở rộng tài sản cố định.' },
]);

const c5 = doc('acc305-5-1-ratio-analysis', '5.1 — Ratio analysis: liquidity, efficiency, leverage & profitability|||5.1 — Phân tích tỷ số: thanh khoản, hiệu quả, đòn bẩy & sinh lời',
  'Bốn nhóm tỷ số tài chính, công thức & ví dụ tính trên số liệu Công ty ABC.',
  [[
    `<span class="eyebrow">ACC305 · Chapter 5 · Lesson 5.1</span>
<h2>Ratio analysis: liquidity, efficiency, leverage &amp; profitability</h2>
<h3>Four families of ratios</h3>
<ul>
<li><strong>Liquidity</strong> — can the company meet short-term obligations? (current ratio, quick ratio)</li>
<li><strong>Efficiency</strong> — how well are assets being used? (turnover ratios)</li>
<li><strong>Leverage</strong> — how much debt financing, and can it service it? (debt-to-equity, interest coverage)</li>
<li><strong>Profitability</strong> — how much profit per dollar of sales/assets/equity? (margins, ROA, ROE)</li>
</ul>
<h3>Worked example — ABC Corp (assumed data from Chapters 2-4)</h3>
<pre><code>Liquidity
  Current ratio    = Current assets / Current liab.  = 320/150 = 2.13x
  Quick ratio      = (CA - Inventory) / Current liab. = 170/150 = 1.13x

Efficiency
  Inventory turnover   = COGS / Inventory        = 650/150  = 4.33x
  Receivables turnover = Revenue / Receivables   = 1000/120 = 8.33x
  Asset turnover       = Revenue / Total assets  = 1000/800 = 1.25x

Leverage
  Debt-to-equity    = Total liabilities / Equity = 400/400 = 1.00x
  Interest coverage = EBIT / Interest expense    = 150/30  = 5.00x

Profitability
  Gross margin = Gross profit / Revenue = 350/1000 = 35.0%
  Net margin   = Net income / Revenue   =  96/1000 =  9.6%
  ROA = Net income / Total assets =  96/800 = 12.0%
  ROE = Net income / Equity       =  96/400 = 24.0%
</code></pre>
<h3>Reading ratios right</h3>
<p>A ratio alone means little — always compare it against (1) the company's own history (trend), (2) industry peers, and (3) a sensible benchmark (e.g. current ratio &lt; 1 is a liquidity warning in most industries).</p>
<div class="callout"><span class="badge">Next step</span> Chapter 6 breaks ROE down further with DuPont analysis — showing exactly which of these ratios is driving ABC Corp's 24% ROE.</div>`,
    `<span class="eyebrow">ACC305 · Chương 5 · Bài 5.1</span>
<h2>Phân tích tỷ số: thanh khoản, hiệu quả, đòn bẩy &amp; sinh lời</h2>
<h3>Bốn nhóm tỷ số</h3>
<ul>
<li><strong>Thanh khoản</strong> — công ty có đáp ứng được nghĩa vụ ngắn hạn không? (current ratio, quick ratio)</li>
<li><strong>Hiệu quả</strong> — tài sản được sử dụng hiệu quả đến đâu? (các tỷ số vòng quay)</li>
<li><strong>Đòn bẩy</strong> — dùng bao nhiêu nợ vay, và có trả nổi không? (nợ/vốn chủ, khả năng trả lãi)</li>
<li><strong>Sinh lời</strong> — lời được bao nhiêu trên mỗi đồng doanh thu/tài sản/vốn chủ? (biên lợi nhuận, ROA, ROE)</li>
</ul>
<h3>Ví dụ tính toán — Công ty ABC (số liệu giả định từ Chương 2-4)</h3>
<pre><code>Thanh khoản
  Current ratio = TS ngắn hạn / Nợ ngắn hạn        = 320/150 = 2,13 lần
  Quick ratio   = (TS ngắn hạn - Tồn kho)/Nợ NH    = 170/150 = 1,13 lần

Hiệu quả
  Vòng quay tồn kho   = Giá vốn / Tồn kho          = 650/150  = 4,33 lần
  Vòng quay phải thu  = Doanh thu / Phải thu       = 1000/120 = 8,33 lần
  Vòng quay tài sản   = Doanh thu / Tổng tài sản   = 1000/800 = 1,25 lần

Đòn bẩy
  Nợ/Vốn chủ       = Tổng nợ phải trả / Vốn chủ   = 400/400 = 1,00 lần
  Khả năng trả lãi = EBIT / Chi phí lãi vay        = 150/30  = 5,00 lần

Sinh lời
  Biên LN gộp = Lợi nhuận gộp/Doanh thu = 350/1000 = 35,0%
  Biên LN ròng = Lợi nhuận ròng/Doanh thu = 96/1000 = 9,6%
  ROA = Lợi nhuận ròng/Tổng tài sản = 96/800 = 12,0%
  ROE = Lợi nhuận ròng/Vốn chủ = 96/400 = 24,0%
</code></pre>
<h3>Đọc tỷ số cho đúng</h3>
<p>Một tỷ số đứng một mình gần như vô nghĩa — luôn so sánh với (1) lịch sử của chính công ty (xu hướng), (2) đối thủ cùng ngành, và (3) một mốc tham chiếu hợp lý (vd current ratio &lt; 1 là cảnh báo thanh khoản ở hầu hết ngành).</p>
<div class="callout"><span class="badge">Bước tiếp theo</span> Chương 6 phân rã ROE sâu hơn bằng phân tích DuPont — chỉ ra chính xác tỷ số nào đang tạo ra ROE 24% của Công ty ABC.</div>`,
  ]]);

const c5q = quiz('acc305-quiz-5', 'Quiz 5 — Ratio analysis|||Quiz 5 — Phân tích tỷ số', [
  { id: 'q1', question: 'Hệ số thanh toán hiện hành (current ratio) đo lường điều gì?', options: ['Khả năng sinh lời dài hạn', 'Khả năng trả nợ ngắn hạn bằng tài sản ngắn hạn', 'Hiệu quả sử dụng tài sản cố định', 'Mức độ vay nợ dài hạn'], correctIndex: 1, explanation: 'Current ratio = TS ngắn hạn / Nợ ngắn hạn — đo khả năng thanh khoản ngắn hạn.' },
  { id: 'q2', question: 'Vòng quay hàng tồn kho cao thường cho thấy điều gì (trong điều kiện bình thường)?', options: ['Hàng tồn kho bán chậm, ứ đọng', 'Hàng tồn kho được bán và thay mới nhanh', 'Công ty vay nợ nhiều', 'Biên lợi nhuận gộp thấp'], correctIndex: 1, explanation: 'Vòng quay = Giá vốn/Tồn kho; cao nghĩa là hàng luân chuyển nhanh.' },
  { id: 'q3', question: 'Vì sao không nên đọc một tỷ số tài chính một mình, tách rời?', options: ['Vì công thức luôn sai', 'Vì cần so sánh với lịch sử công ty & đối thủ cùng ngành để có ý nghĩa', 'Vì tỷ số chỉ dùng cho ngân hàng', 'Vì tỷ số không liên quan tới BCTC'], correctIndex: 1, explanation: 'Một tỷ số chỉ có ý nghĩa khi đặt cạnh xu hướng của chính công ty và mức trung bình ngành.' },
]);

const c6 = doc('acc305-6-1-dupont', '6.1 — DuPont analysis & profitability drivers|||6.1 — Phân tích DuPont & động lực sinh lời',
  'Phân rã ROE 3 bước (biên LN, vòng quay TS, đòn bẩy TC); ví dụ số trên Công ty ABC; dùng DuPont để chẩn đoán ROE.',
  [[
    `<span class="eyebrow">ACC305 · Chapter 6 · Lesson 6.1</span>
<h2>DuPont analysis &amp; profitability drivers</h2>
<h3>3-step DuPont decomposition</h3>
<p>DuPont breaks <strong>ROE</strong> into three drivers, so you can see WHERE profitability is coming from, not just what it is:</p>
<pre><code>ROE = Net margin  x  Asset turnover  x  Equity multiplier
    = (NI/Sales)  x  (Sales/Assets)  x  (Assets/Equity)
</code></pre>
<ul>
<li><strong>Net margin</strong> — profitability of sales (pricing power, cost control).</li>
<li><strong>Asset turnover</strong> — how efficiently assets generate sales.</li>
<li><strong>Equity multiplier</strong> — financial leverage (Assets/Equity); more debt raises this and, mechanically, ROE — but also raises risk.</li>
</ul>
<h3>Worked example — ABC Corp (assumed, continues Ch.2-5)</h3>
<pre><code>ROE = Net margin  x  Asset turnover  x  Equity multiplier
    =    9.6%      x      1.25x       x      2.00x
    =                24.0%

Equity multiplier = Total assets / Equity = 800/400 = 2.00x
</code></pre>
<h3>Diagnosing ROE</h3>
<p>Two companies can both show 24% ROE for very different reasons: one earns it through fat margins and light leverage, another through thin margins and heavy debt. DuPont exposes which one you're looking at — and heavy leverage is a red flag, not a strength, if it's the main driver.</p>
<div class="callout"><span class="badge">Extended DuPont</span> A 5-step version further splits net margin into tax burden (Net income/EBT) and interest burden (EBT/EBIT), isolating the effect of taxes and debt cost separately from operating margin.</div>`,
    `<span class="eyebrow">ACC305 · Chương 6 · Bài 6.1</span>
<h2>Phân tích DuPont &amp; động lực sinh lời</h2>
<h3>Phân rã DuPont 3 bước</h3>
<p>DuPont phân rã <strong>ROE</strong> thành ba động lực, để thấy khả năng sinh lời ĐẾN TỪ ĐÂU, không chỉ nó là bao nhiêu:</p>
<pre><code>ROE = Biên LN ròng  x  Vòng quay tài sản  x  Đòn bẩy tài chính
    = (LNR/DThu)     x  (DThu/Tổng TS)     x  (Tổng TS/Vốn chủ)
</code></pre>
<ul>
<li><strong>Biên lợi nhuận ròng</strong> — khả năng sinh lời của doanh thu (sức mạnh định giá, kiểm soát chi phí).</li>
<li><strong>Vòng quay tài sản</strong> — tài sản tạo ra doanh thu hiệu quả đến đâu.</li>
<li><strong>Đòn bẩy tài chính (equity multiplier)</strong> — Tổng tài sản/Vốn chủ; nợ nhiều hơn đẩy chỉ số này lên và, về mặt cơ học, đẩy ROE lên — nhưng cũng tăng rủi ro.</li>
</ul>
<h3>Ví dụ tính toán — Công ty ABC (giả định, nối tiếp Ch.2-5)</h3>
<pre><code>ROE = Biên LN ròng  x  Vòng quay TS  x  Đòn bẩy tài chính
    =     9,6%       x     1,25 lần   x      2,00 lần
    =                  24,0%

Đòn bẩy tài chính = Tổng tài sản / Vốn chủ = 800/400 = 2,00 lần
</code></pre>
<h3>Chẩn đoán ROE</h3>
<p>Hai công ty cùng có ROE 24% có thể vì hai lý do rất khác nhau: một công ty đạt được nhờ biên lợi nhuận dày và ít vay nợ, công ty kia nhờ biên lợi nhuận mỏng nhưng vay nợ nhiều. DuPont vạch rõ bạn đang nhìn vào trường hợp nào — và đòn bẩy nặng là dấu hiệu rủi ro, không phải điểm mạnh, nếu nó là động lực chính.</p>
<div class="callout"><span class="badge">DuPont mở rộng</span> Phiên bản 5 bước tách biên lợi nhuận ròng thành gánh nặng thuế (LN ròng/EBT) và gánh nặng lãi vay (EBT/EBIT), cô lập ảnh hưởng của thuế và chi phí nợ vay khỏi biên lợi nhuận hoạt động.</div>`,
  ]]);

const c6q = quiz('acc305-quiz-6', 'Quiz 6 — DuPont analysis|||Quiz 6 — Phân tích DuPont', [
  { id: 'q1', question: 'Công thức DuPont 3 bước phân rã ROE thành?', options: ['Doanh thu, chi phí, lợi nhuận', 'Biên lợi nhuận ròng x Vòng quay tài sản x Đòn bẩy tài chính', 'Tài sản, nợ, vốn chủ', 'Dòng tiền hoạt động x Capex'], correctIndex: 1, explanation: 'ROE = Net margin x Asset turnover x Equity multiplier.' },
  { id: 'q2', question: 'Đòn bẩy tài chính (equity multiplier) cao có nghĩa là gì?', options: ['Công ty không vay nợ', 'Công ty dùng nhiều nợ vay tương đối so với vốn chủ, làm tăng ROE nhưng cũng tăng rủi ro', 'Công ty có biên lợi nhuận cao', 'Tài sản quay vòng nhanh'], correctIndex: 1, explanation: 'Equity multiplier = Tổng tài sản/Vốn chủ; cao nghĩa là dùng nhiều nợ, đẩy ROE lên cơ học nhưng rủi ro hơn.' },
  { id: 'q3', question: 'Vì sao DuPont hữu ích hơn việc chỉ nhìn con số ROE?', options: ['Vì nó cho con số ROE chính xác hơn', 'Vì nó cho biết ROE đến từ biên lợi nhuận, hiệu quả tài sản hay đòn bẩy — giúp chẩn đoán chất lượng của ROE', 'Vì nó thay thế hoàn toàn báo cáo tài chính', 'Vì nó không cần dữ liệu bảng cân đối kế toán'], correctIndex: 1, explanation: 'DuPont tách ROE thành 3 nguồn gốc, giúp biết ROE cao là "tốt" hay "rủi ro" (đến từ đòn bẩy).' },
]);

const c7 = doc('acc305-7-1-forecasting-valuation', '7.1 — Financial forecasting & basic valuation|||7.1 — Dự báo tài chính & định giá cơ bản',
  'Dự báo theo phần trăm doanh thu (percent-of-sales); định giá tương đối (P/E, P/B, EV/EBITDA); giới thiệu định giá nội tại (DCF).',
  [[
    `<span class="eyebrow">ACC305 · Chapter 7 · Lesson 7.1</span>
<h2>Financial forecasting &amp; basic valuation</h2>
<h3>Percent-of-sales forecasting</h3>
<p>The simplest forecasting method: project revenue growth first, then assume most other line items (COGS, opex) stay a constant <strong>percentage of revenue</strong> based on historical ratios — refining assumptions where you have better information (e.g. a known price increase).</p>
<h3>Worked example — ABC Corp (assumed, +10% revenue growth)</h3>
<pre><code>Year N revenue           1,000
Year N+1 revenue         1,100   (x 1.10)

Assume COGS stays 65% of revenue, opex stays 20% of revenue:
COGS (N+1)   = 1,100 x 65% =   715
Opex (N+1)   = 1,100 x 20% =   220
EBIT (N+1)   = 1,100 - 715 - 220 = 165
</code></pre>
<h3>Relative valuation (multiples)</h3>
<p>Compare the company to peers using a multiple of an earnings/asset metric: <strong>P/E</strong> (price / earnings per share), <strong>P/B</strong> (price / book value per share), <strong>EV/EBITDA</strong> (enterprise value / EBITDA — useful across different capital structures).</p>
<pre><code>Relative valuation example (assumed)
Peer average P/E        = 12x
ABC Corp EPS (assumed)  = 2,400 VND
Implied share price     = 12 x 2,400 = 28,800 VND
</code></pre>
<h3>Intrinsic valuation (introduction)</h3>
<p>A <strong>discounted cash flow (DCF)</strong> model values a company as the present value of its future free cash flows — more rigorous than multiples but far more sensitive to assumptions (growth rate, discount rate). Covered conceptually here; full DCF mechanics belong to a corporate-finance/valuation course.</p>
<div class="callout"><span class="badge">Forecast quality</span> A forecast is only as good as its assumptions — always state and stress-test the growth rate and margin assumptions rather than treating the output as certain.</div>`,
    `<span class="eyebrow">ACC305 · Chương 7 · Bài 7.1</span>
<h2>Dự báo tài chính &amp; định giá cơ bản</h2>
<h3>Dự báo theo phần trăm doanh thu (percent-of-sales)</h3>
<p>Phương pháp dự báo đơn giản nhất: dự phóng tăng trưởng doanh thu trước, sau đó giả định hầu hết khoản mục khác (giá vốn, chi phí hoạt động) giữ nguyên <strong>tỷ lệ % trên doanh thu</strong> dựa theo tỷ lệ lịch sử — tinh chỉnh giả định khi có thông tin tốt hơn (vd biết trước một đợt tăng giá).</p>
<h3>Ví dụ tính toán — Công ty ABC (giả định, doanh thu tăng 10%)</h3>
<pre><code>Doanh thu năm N           1.000
Doanh thu năm N+1         1.100   (x 1,10)

Giả định giá vốn giữ 65% doanh thu, chi phí HĐ giữ 20% doanh thu:
Giá vốn (N+1) = 1.100 x 65% =   715
Chi phí HĐ (N+1) = 1.100 x 20% =   220
EBIT (N+1)   = 1.100 - 715 - 220 = 165
</code></pre>
<h3>Định giá tương đối (bội số)</h3>
<p>So sánh công ty với đối thủ cùng ngành bằng một bội số của lợi nhuận/tài sản: <strong>P/E</strong> (giá cổ phiếu / lợi nhuận trên mỗi cổ phiếu), <strong>P/B</strong> (giá / giá trị sổ sách mỗi cổ phiếu), <strong>EV/EBITDA</strong> (giá trị doanh nghiệp / EBITDA — hữu ích khi so sánh các công ty có cấu trúc vốn khác nhau).</p>
<pre><code>Ví dụ định giá tương đối (giả định)
P/E trung bình ngành       = 12 lần
EPS Công ty ABC (giả định) = 2.400 đồng
Giá cổ phiếu ngụ ý         = 12 x 2.400 = 28.800 đồng
</code></pre>
<h3>Định giá nội tại (giới thiệu)</h3>
<p>Mô hình <strong>chiết khấu dòng tiền (DCF)</strong> định giá công ty bằng giá trị hiện tại của các dòng tiền tự do tương lai — chặt chẽ hơn bội số nhưng nhạy hơn nhiều với giả định (tốc độ tăng trưởng, tỷ lệ chiết khấu). Giới thiệu ở mức khái niệm; cơ chế DCF đầy đủ thuộc môn tài chính doanh nghiệp/định giá.</p>
<div class="callout"><span class="badge">Chất lượng dự báo</span> Một dự báo chỉ tốt bằng đúng giả định đứng sau nó — luôn nêu rõ và kiểm định lại giả định tăng trưởng và biên lợi nhuận thay vì coi kết quả là chắc chắn.</div>`,
  ]]);

const c7q = quiz('acc305-quiz-7', 'Quiz 7 — Forecasting & valuation|||Quiz 7 — Dự báo & định giá', [
  { id: 'q1', question: 'Phương pháp dự báo "percent-of-sales" giả định điều gì?', options: ['Mọi chi phí đều cố định, không đổi theo doanh thu', 'Hầu hết khoản mục (giá vốn, chi phí HĐ) giữ tỷ lệ % không đổi so với doanh thu', 'Doanh thu không thể dự báo được', 'Chỉ áp dụng được cho dòng tiền'], correctIndex: 1, explanation: 'Percent-of-sales giả định các khoản mục chính tỷ lệ thuận với doanh thu dựa trên tỷ lệ lịch sử.' },
  { id: 'q2', question: 'EV/EBITDA thường được ưa dùng hơn P/E khi so sánh các công ty có?', options: ['Cùng ngành, cùng cấu trúc vốn hệt nhau', 'Cấu trúc vốn (tỷ lệ nợ/vốn chủ) khác nhau', 'Không có doanh thu', 'Không có tài sản cố định'], correctIndex: 1, explanation: 'EV/EBITDA trung lập với cấu trúc vốn vì EV đã gồm cả nợ, nên so sánh công bằng hơn P/E khi đòn bẩy khác nhau.' },
  { id: 'q3', question: 'Mô hình chiết khấu dòng tiền (DCF) nhạy cảm nhất với giả định nào?', options: ['Màu logo công ty', 'Tốc độ tăng trưởng và tỷ lệ chiết khấu', 'Số lượng nhân viên', 'Địa chỉ trụ sở'], correctIndex: 1, explanation: 'DCF rất nhạy với giả định tăng trưởng dòng tiền và lãi suất chiết khấu — sai lệch nhỏ tạo chênh lệch giá trị lớn.' },
]);

const c8 = doc('acc305-8-1-fraud-credit', '8.1 — Fraud detection, earnings management & credit analysis|||8.1 — Phát hiện gian lận, earnings management & phân tích tín dụng',
  'Kỹ thuật thổi phồng lợi nhuận thường gặp; dấu hiệu cảnh báo; mô hình Altman Z-score; 5 chữ C phân tích tín dụng.',
  [[
    `<span class="eyebrow">ACC305 · Chapter 8 · Lesson 8.1</span>
<h2>Fraud detection, earnings management &amp; credit analysis</h2>
<h3>Common earnings-management techniques</h3>
<ul>
<li><strong>Channel stuffing</strong> — pushing extra product to distributors near quarter-end to inflate current-period revenue, borrowing from future sales.</li>
<li><strong>Cookie-jar reserves</strong> — over-reserving expenses in good years to release them and smooth earnings in bad years.</li>
<li><strong>Big bath</strong> — dumping all possible write-offs into one already-bad year, so future years look better by comparison.</li>
</ul>
<h3>Red flags to watch for</h3>
<ul>
<li>Net income rising while operating cash flow is flat or falling (see Chapter 4) — profit not turning into cash.</li>
<li>Receivables or inventory growing much faster than revenue.</li>
<li>Frequent, large "one-time" or "non-recurring" items, quarter after quarter.</li>
<li>Aggressive or frequently changing accounting policies/estimates.</li>
</ul>
<h3>Altman Z-Score (concept, for a listed manufacturer)</h3>
<pre><code>Z = 1.2*X1 + 1.4*X2 + 3.3*X3 + 0.6*X4 + 1.0*X5
X1 = Working capital / Total assets
X2 = Retained earnings / Total assets
X3 = EBIT / Total assets
X4 = Market value of equity / Total liabilities
X5 = Sales / Total assets

Z &gt; 2.99   -&gt; safe zone
1.81-2.99  -&gt; grey zone
Z &lt; 1.81   -&gt; distress zone
</code></pre>
<h3>Credit analysis — the 5 Cs</h3>
<p><strong>Character</strong> (management integrity/track record), <strong>Capacity</strong> (ability to repay, from cash flow), <strong>Capital</strong> (equity cushion), <strong>Collateral</strong> (assets pledged), <strong>Conditions</strong> (industry/economic environment).</p>
<div class="callout"><span class="badge">Course wrap-up</span> Chapters 1-8 form one pipeline: understand the business (Ch.1) → read the three statements (Ch.2-4) → measure performance with ratios &amp; DuPont (Ch.5-6) → forecast &amp; value (Ch.7) → stay skeptical of the numbers (Ch.8).</div>`,
    `<span class="eyebrow">ACC305 · Chương 8 · Bài 8.1</span>
<h2>Phát hiện gian lận, earnings management &amp; phân tích tín dụng</h2>
<h3>Các kỹ thuật thổi phồng lợi nhuận thường gặp</h3>
<ul>
<li><strong>Channel stuffing</strong> — đẩy hàng dư thừa cho nhà phân phối gần cuối quý để thổi phồng doanh thu kỳ hiện tại, "mượn" từ doanh số tương lai.</li>
<li><strong>Cookie-jar reserves</strong> — trích lập dự phòng chi phí quá mức ở năm tốt để hoàn nhập, làm mượt lợi nhuận ở năm xấu.</li>
<li><strong>Big bath</strong> — dồn hết các khoản xoá sổ có thể vào một năm đã xấu sẵn, để các năm sau trông tốt hơn khi so sánh.</li>
</ul>
<h3>Dấu hiệu cảnh báo cần chú ý</h3>
<ul>
<li>Lợi nhuận ròng tăng trong khi dòng tiền hoạt động đi ngang hoặc giảm (xem Chương 4) — lợi nhuận chưa chuyển thành tiền.</li>
<li>Phải thu hoặc tồn kho tăng nhanh hơn nhiều so với doanh thu.</li>
<li>Xuất hiện thường xuyên các khoản "bất thường"/"không lặp lại" với giá trị lớn, quý này qua quý khác.</li>
<li>Chính sách/ước tính kế toán thay đổi thường xuyên hoặc theo hướng có lợi bất thường.</li>
</ul>
<h3>Điểm số Altman Z-Score (khái niệm, cho doanh nghiệp sản xuất niêm yết)</h3>
<pre><code>Z = 1,2*X1 + 1,4*X2 + 3,3*X3 + 0,6*X4 + 1,0*X5
X1 = Vốn lưu động / Tổng tài sản
X2 = Lợi nhuận giữ lại / Tổng tài sản
X3 = EBIT / Tổng tài sản
X4 = Giá trị thị trường vốn chủ / Tổng nợ phải trả
X5 = Doanh thu / Tổng tài sản

Z &gt; 2,99   -&gt; vùng an toàn
1,81-2,99  -&gt; vùng xám
Z &lt; 1,81   -&gt; vùng nguy hiểm (kiệt quệ tài chính)
</code></pre>
<h3>Phân tích tín dụng — 5 chữ C</h3>
<p><strong>Character</strong> (uy tín/lịch sử của ban lãnh đạo), <strong>Capacity</strong> (khả năng trả nợ, dựa trên dòng tiền), <strong>Capital</strong> (đệm vốn chủ sở hữu), <strong>Collateral</strong> (tài sản thế chấp), <strong>Conditions</strong> (điều kiện ngành/kinh tế vĩ mô).</p>
<div class="callout"><span class="badge">Tổng kết môn học</span> Chương 1-8 tạo thành một chuỗi liền mạch: hiểu doanh nghiệp (Ch.1) → đọc ba báo cáo tài chính (Ch.2-4) → đo hiệu quả bằng tỷ số &amp; DuPont (Ch.5-6) → dự báo &amp; định giá (Ch.7) → luôn hoài nghi có căn cứ với con số (Ch.8).</div>`,
  ]]);

const c8q = quiz('acc305-quiz-8', 'Quiz 8 — Fraud & credit analysis|||Quiz 8 — Gian lận & tín dụng', [
  { id: 'q1', question: '"Channel stuffing" là kỹ thuật gì?', options: ['Giảm giá bán để tăng doanh số thật', 'Đẩy hàng dư thừa cho nhà phân phối gần cuối kỳ để thổi phồng doanh thu kỳ hiện tại', 'Mua lại cổ phiếu quỹ', 'Tăng khấu hao tài sản cố định'], correctIndex: 1, explanation: 'Channel stuffing mượn doanh số từ tương lai bằng cách đẩy hàng dư ra kênh phân phối trước kỳ báo cáo.' },
  { id: 'q2', question: 'Theo mô hình Altman Z-Score, điểm Z càng thấp (dưới 1,81) cho thấy điều gì?', options: ['Công ty rất an toàn tài chính', 'Công ty ở vùng nguy cơ phá sản/kiệt quệ tài chính cao', 'Công ty có lợi nhuận cao nhất ngành', 'Không liên quan tới rủi ro tài chính'], correctIndex: 1, explanation: 'Z dưới 1,81 rơi vào "vùng nguy hiểm" — rủi ro kiệt quệ tài chính cao.' },
  { id: 'q3', question: 'Trong "5 chữ C" phân tích tín dụng, "Capacity" đề cập tới điều gì?', options: ['Uy tín/đạo đức của ban lãnh đạo', 'Khả năng trả nợ dựa trên dòng tiền tạo ra', 'Tài sản thế chấp', 'Điều kiện kinh tế vĩ mô'], correctIndex: 1, explanation: 'Capacity là khả năng trả nợ, đánh giá chủ yếu qua dòng tiền tạo ra được.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'ACC305',
    slug: 'acc305-financial-statement-analysis',
    title: 'Financial Statement Analysis',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/ACC305.webp',
    shortDescription: 'How to read financial statements — balance sheet, income statement, cash flows, ratio & DuPont analysis, forecasting, valuation & spotting earnings management. Bilingual, worked examples & quizzes.|||Cách đọc báo cáo tài chính — bảng cân đối kế toán, kết quả kinh doanh, lưu chuyển tiền tệ, phân tích tỷ số & DuPont, dự báo, định giá & phát hiện gian lận lợi nhuận. Song ngữ, có ví dụ & quiz.',
    description: 'Môn <strong>ACC305 — Financial Statement Analysis</strong> (kỳ 5) dạy cách <strong>đọc và đánh giá sức khoẻ tài chính</strong> của một doanh nghiệp qua ba báo cáo tài chính. Từ <strong>khuôn khổ phân tích</strong> (chiến lược, kế toán, tài chính, dự phóng) → <strong>bảng cân đối kế toán</strong> → <strong>báo cáo kết quả kinh doanh</strong> (chất lượng lợi nhuận) → <strong>báo cáo lưu chuyển tiền tệ</strong> → <strong>phân tích tỷ số</strong> (thanh khoản, hiệu quả, đòn bẩy, sinh lời) → <strong>DuPont</strong> → <strong>dự báo &amp; định giá cơ bản</strong> → <strong>phát hiện gian lận &amp; phân tích tín dụng</strong>. Bám giáo trình Subramanyam/Penman/CFA, song ngữ, có ví dụ tính toán xuyên suốt (Công ty ABC, giả định) và quiz mỗi chương.',
    whatYouLearn: 'Khuôn khổ phân tích BCTC 4 bước; đọc bảng cân đối kế toán & vốn lưu động; báo cáo kết quả kinh doanh & chất lượng lợi nhuận; báo cáo lưu chuyển tiền tệ & dòng tiền tự do; tỷ số thanh khoản/hiệu quả/đòn bẩy/sinh lời; phân rã DuPont (ROE); dự báo percent-of-sales & định giá P/E, P/B, EV/EBITDA; nhận diện earnings management, Altman Z-Score & 5 chữ C tín dụng.',
    requirements: 'Kiến thức nguyên lý kế toán cơ bản (ACC1xx). Xem giáo trình chi tiết trên FLM (flm.fpt.edu.vn).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình chuẩn (Subramanyam, Penman, White/Sondhi/Fried, CFA), tài liệu miễn phí, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Phân tích BCTC là gì, ai dùng, ba báo cáo tài chính cốt lõi.', lessons: [intro] },
    { title: 'Chương 1 — Khuôn khổ phân tích|||Chapter 1 — Analytical framework', description: '4 bước phân tích, người dùng, giới hạn BCTC.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Bảng cân đối kế toán|||Chapter 2 — Balance sheet', description: 'Tài sản, nợ, vốn chủ; vốn lưu động; chất lượng tài sản.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Kết quả kinh doanh|||Chapter 3 — Income statement', description: 'Ghi nhận doanh thu, chất lượng lợi nhuận.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Lưu chuyển tiền tệ|||Chapter 4 — Cash flows', description: 'Ba dòng tiền, phương pháp gián tiếp, dòng tiền tự do.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Phân tích tỷ số|||Chapter 5 — Ratio analysis', description: 'Thanh khoản, hiệu quả, đòn bẩy, sinh lời.', lessons: [c5, c5q] },
    { title: 'Chương 6 — DuPont|||Chapter 6 — DuPont analysis', description: 'Phân rã ROE, chẩn đoán động lực sinh lời.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Dự báo & định giá|||Chapter 7 — Forecasting & valuation', description: 'Percent-of-sales, P/E, P/B, EV/EBITDA, DCF khái niệm.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Gian lận & tín dụng|||Chapter 8 — Fraud & credit analysis', description: 'Earnings management, Altman Z-Score, 5 chữ C.', lessons: [c8, c8q] },
  ],
};
