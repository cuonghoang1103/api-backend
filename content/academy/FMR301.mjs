/**
 * FMR301 — Applied Financial modelling and risk management.
 * Mô hình tài chính TÍCH HỢP quản trị rủi ro (VaR, scenario trong mô hình) —
 * khối Quản trị Kinh doanh (BBA), FPTU, Kỳ 7. Trích dẫn giáo trình: Benninga
 * "Financial Modeling"; Jorion "Value at Risk"; Hull "Risk Management".
 * Phân biệt: FIM302c = dựng mô hình cơ bản; FMS301 = thiên mô phỏng Monte
 * Carlo; FRM301 = dự án ERM độc lập. Song ngữ + ví dụ Excel (GIẢ ĐỊNH).
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('fmr301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (kèm link), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình.',
  [[
    `<span class="eyebrow">FMR301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Applied Financial Modelling and Risk Management — building spreadsheet models that have risk measurement (VaR, scenarios, stress tests) <strong>built directly into them</strong>, not bolted on afterwards. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal reference sources this course draws on.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for FMR301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books cited by the syllabus</h3>
<ul>
<li><a href="https://www.wiley.com/en-us/Financial+Modeling+and+Valuation" target="_blank" rel="noopener">Simon Benninga — <em>Financial Modeling</em> (MIT Press)</a> — spreadsheet mechanics: 3-statement models, circularity, sensitivity/data tables.</li>
<li><a href="https://www.wiley.com/en-us/Value+at+Risk" target="_blank" rel="noopener">Philippe Jorion — <em>Value at Risk</em></a> — VaR methodology (parametric, historical), backtesting.</li>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/risk-management-and-financial-institutions" target="_blank" rel="noopener">John Hull — <em>Risk Management and Financial Institutions</em></a> — market/credit risk, stress testing, ERM.</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.investopedia.com/terms/v/var.asp" target="_blank" rel="noopener">Investopedia — Value at Risk (VaR)</a></li>
<li><a href="https://corporatefinanceinstitute.com/resources/valuation/financial-modeling/" target="_blank" rel="noopener">Corporate Finance Institute — Financial Modeling</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@wallstreetprep" target="_blank" rel="noopener">Wall Street Prep</a> — 3-statement modelling, DCF walkthroughs</li>
<li><a href="https://www.youtube.com/@FinancialEdgeTraining" target="_blank" rel="noopener">Financial Edge Training</a> — risk &amp; valuation concepts</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li>Microsoft Excel — Data Tables, Scenario Manager, Solver (built-in, no install needed for the course exercises)</li>
<li><a href="https://www.google.com/sheets/about/" target="_blank" rel="noopener">Google Sheets</a> — for collaborative model drafts</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — 3-statement links, circularity, sensitivity tables, DCF/NPV/IRR.</li>
<li><strong>Risk layer</strong> — volatility, VaR (parametric &amp; historical), portfolio variance, credit risk (PD/LGD/EAD).</li>
<li><strong>Integration</strong> — scenario &amp; stress-test switches wired into the same model, not a separate memo.</li>
<li><strong>Job-ready</strong> — read a real model, spot the single-formula-rule violations, and build a risk dashboard on top.</li>
</ol></div>`,
    `<span class="eyebrow">FMR301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Mô hình hoá tài chính ứng dụng và Quản trị rủi ro — dựng bảng tính có đo lường rủi ro (VaR, kịch bản, stress test) <strong>nằm ngay trong mô hình</strong>, không phải báo cáo rời gắn thêm sau. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn tham khảo miễn phí, hợp pháp mà môn này bám theo.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của FMR301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo theo đề cương</h3>
<ul>
<li><a href="https://www.wiley.com/en-us/Financial+Modeling+and+Valuation" target="_blank" rel="noopener">Simon Benninga — <em>Financial Modeling</em> (MIT Press)</a> — cơ chế bảng tính: mô hình 3 báo cáo, circularity, bảng độ nhạy/data table.</li>
<li><a href="https://www.wiley.com/en-us/Value+at+Risk" target="_blank" rel="noopener">Philippe Jorion — <em>Value at Risk</em></a> — phương pháp VaR (parametric, historical), backtesting.</li>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/risk-management-and-financial-institutions" target="_blank" rel="noopener">John Hull — <em>Risk Management and Financial Institutions</em></a> — rủi ro thị trường/tín dụng, stress testing, ERM.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.investopedia.com/terms/v/var.asp" target="_blank" rel="noopener">Investopedia — Value at Risk (VaR)</a></li>
<li><a href="https://corporatefinanceinstitute.com/resources/valuation/financial-modeling/" target="_blank" rel="noopener">Corporate Finance Institute — Financial Modeling</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@wallstreetprep" target="_blank" rel="noopener">Wall Street Prep</a> — dựng mô hình 3 báo cáo, DCF từng bước</li>
<li><a href="https://www.youtube.com/@FinancialEdgeTraining" target="_blank" rel="noopener">Financial Edge Training</a> — khái niệm rủi ro &amp; định giá</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li>Microsoft Excel — Data Table, Scenario Manager, Solver (có sẵn, không cần cài thêm cho bài tập môn này)</li>
<li><a href="https://www.google.com/sheets/about/" target="_blank" rel="noopener">Google Sheets</a> — soạn mô hình cộng tác</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — liên kết 3 báo cáo, circularity, bảng độ nhạy, DCF/NPV/IRR.</li>
<li><strong>Lớp rủi ro</strong> — volatility, VaR (parametric &amp; historical), phương sai danh mục, rủi ro tín dụng (PD/LGD/EAD).</li>
<li><strong>Tích hợp</strong> — nút chuyển kịch bản &amp; stress test gắn ngay trong mô hình, không phải một bản ghi nhớ tách riêng.</li>
<li><strong>Sẵn sàng đi làm</strong> — đọc một mô hình thật, phát hiện vi phạm quy tắc một-công-thức, dựng dashboard rủi ro lên trên.</li>
</ol></div>`,
  ]]);

const intro = doc('fmr301-0-1-overview', 'Course overview: Applied financial modelling & risk management|||Tổng quan: Mô hình hoá tài chính ứng dụng & Quản trị rủi ro',
  'Vì sao mô hình tài chính cần TÍCH HỢP rủi ro ngay bên trong; phân biệt với FIM302c (mô hình cơ bản), FMS301 (Monte Carlo), FRM301 (dự án ERM); lộ trình 8 chương.',
  [[
    `<span class="eyebrow">FMR301 · Lesson 0.1 · Overview</span>
<h2>Applied Financial Modelling &amp; Risk Management</h2>
<p class="lead">This course is about ONE thing: a financial model where <strong>risk measurement lives inside the spreadsheet</strong> — sensitivity tables, scenario switches, VaR, stress tests — rather than being written up separately after the model is "done". A model that only forecasts revenue and profit tells you the base case; a model with risk built in tells you <strong>how bad it could get, and how likely that is</strong>.</p>
<h3>How this differs from other modelling courses</h3>
<ul>
<li><strong>FIM302c (Introduction to Financial Modelling)</strong> — teaches the mechanics of a base 3-statement model: formulas, links, no circularity errors. FMR301 assumes you can already build that, and adds a risk layer on top of it.</li>
<li><strong>FMS301 (Financial Modelling &amp; Simulation)</strong> — goes deep on Monte Carlo simulation (thousands of random draws, probability distributions). FMR301 touches Monte Carlo only briefly in Chapter 4; its centre of gravity is <strong>VaR, scenarios and stress tests</strong>, which are faster and more common in day-to-day corporate/credit risk work.</li>
<li><strong>FRM301 (Financial Risk Management)</strong> — is a project-based course on enterprise risk management as a <strong>process</strong> (policy, governance, ERM framework). FMR301 is about the <strong>spreadsheet model itself</strong> — the numbers, formulas and switches that make risk visible and decision-ready.</li>
</ul>
<h3>Roadmap (8 chapters)</h3>
<p>Integrated modelling overview → 3-statement model &amp; sensitivity → cash-flow &amp; project risk (DCF/NPV) → risk measurement (volatility, VaR) → portfolio &amp; risk-return optimisation → scenario &amp; stress testing → credit risk &amp; risk-adjusted valuation → integrated ERM model &amp; decision reporting.</p>
<div class="callout"><span class="badge">Core idea</span> Every chapter after this one ends with the SAME question: "what does this add to the model that lets someone make a better risk-aware decision?" — not "what does this add to a separate risk report?"</div>`,
    `<span class="eyebrow">FMR301 · Bài 0.1 · Tổng quan</span>
<h2>Mô hình hoá tài chính ứng dụng &amp; Quản trị rủi ro</h2>
<p class="lead">Môn này chỉ xoay quanh MỘT điều: một mô hình tài chính có <strong>đo lường rủi ro nằm ngay trong bảng tính</strong> — bảng độ nhạy, nút chuyển kịch bản, VaR, stress test — thay vì viết riêng ra sau khi mô hình đã "xong". Một mô hình chỉ dự báo doanh thu và lợi nhuận cho biết kịch bản cơ sở; một mô hình có tích hợp rủi ro cho biết <strong>xấu tới mức nào, và khả năng xảy ra là bao nhiêu</strong>.</p>
<h3>Khác gì với các môn mô hình hoá khác</h3>
<ul>
<li><strong>FIM302c (Nhập môn Mô hình hoá tài chính)</strong> — dạy cơ chế dựng mô hình 3 báo cáo cơ bản: công thức, liên kết, không lỗi vòng lặp (circularity). FMR301 giả định bạn đã dựng được mô hình đó, và thêm một lớp rủi ro lên trên.</li>
<li><strong>FMS301 (Mô hình hoá &amp; Mô phỏng tài chính)</strong> — đi sâu vào mô phỏng Monte Carlo (hàng nghìn lượt lấy số ngẫu nhiên, phân phối xác suất). FMR301 chỉ chạm Monte Carlo ngắn ở Chương 4; trọng tâm là <strong>VaR, kịch bản và stress test</strong> — nhanh hơn và phổ biến hơn trong công việc rủi ro doanh nghiệp/tín dụng hàng ngày.</li>
<li><strong>FRM301 (Quản trị rủi ro tài chính)</strong> — là môn theo dự án về quản trị rủi ro doanh nghiệp như một <strong>quy trình</strong> (chính sách, quản trị, khung ERM). FMR301 xoay quanh <strong>chính mô hình bảng tính</strong> — các số, công thức và nút chuyển làm cho rủi ro hiện rõ và sẵn sàng ra quyết định.</li>
</ul>
<h3>Lộ trình (8 chương)</h3>
<p>Tổng quan mô hình tích hợp → mô hình 3 báo cáo &amp; độ nhạy → dòng tiền &amp; rủi ro dự án (DCF/NPV) → đo lường rủi ro (volatility, VaR) → danh mục &amp; tối ưu rủi ro-lợi nhuận → kịch bản &amp; stress test → rủi ro tín dụng &amp; định giá có rủi ro → mô hình ERM tích hợp &amp; báo cáo ra quyết định.</p>
<div class="callout"><span class="badge">Ý chính</span> Mọi chương sau chương này đều kết bằng CÙNG một câu hỏi: "phần này thêm gì vào mô hình để ai đó ra quyết định biết-rủi-ro tốt hơn?" — không phải "thêm gì vào một báo cáo rủi ro tách riêng?"</div>`,
  ]]);

const c1 = doc('fmr301-1-1-integrated-model', '1.1 — Integrated financial models: risk built in, not bolted on|||1.1 — Mô hình tài chính tích hợp rủi ro: xây SẴN, không gắn thêm',
  'Kiến trúc mô hình tích hợp rủi ro: sheet giả định, quy tắc một công thức, nút chuyển circularity, bảng độ nhạy, lớp rủi ro (best/base/worst) là một CELL, không phải file khác.',
  [[
    `<span class="eyebrow">FMR301 · Chapter 1 · Lesson 1.1</span>
<h2>Integrated financial models: risk built in, not bolted on</h2>
<h3>What "integrated" actually means</h3>
<p>A model is <strong>integrated</strong> when a risk question can be answered by flipping a switch inside the SAME workbook, not by opening a different file. Concretely: the discount rate, the revenue growth assumption, and the "what-if downturn" scenario all live on one <strong>Assumptions</strong> tab, and every output (NPV, equity value, covenant ratio) recalculates instantly when you change them.</p>
<h3>Four building blocks of the architecture</h3>
<ul>
<li><strong>Assumptions sheet</strong> — every input (growth %, margin %, WACC, tax rate, volatility) lives in ONE place, colour-coded (blue = input, black = formula). No hard-coded number inside a formula anywhere else.</li>
<li><strong>Single-formula rule</strong> — the same formula, copied across a row/column, with no manual overrides. Breaking this is the #1 source of "the model gives a different answer depending on which cell you look at".</li>
<li><strong>Circularity switch</strong> — when interest expense depends on the cash balance which depends on interest expense (a debt schedule with a cash sweep), add an explicit IF-switch cell that can zero out the circular term, so the model doesn't silently show #REF or wrong numbers when calculation is set to manual.</li>
<li><strong>Risk overlay</strong> — best/base/worst is a single "scenario ID" cell that every driver reads via CHOOSE/INDEX, so the ENTIRE model (income statement, cash flow, valuation) shifts with one click — not three separate copies of the file.</li>
</ul>
<pre><code>Assumptions tab (excerpt, illustrative):
 B2  Revenue growth %      =CHOOSE(ScenarioID, 0.02, 0.06, 0.12)   ' worst/base/best
 B3  Gross margin %        =CHOOSE(ScenarioID, 0.28, 0.35, 0.40)
 B4  WACC                  =CHOOSE(ScenarioID, 0.12, 0.10, 0.09)
 B1  ScenarioID (1/2/3)    2   ' <- the ONE cell that drives everything
</code></pre>
<div class="callout"><span class="badge">Why it matters</span> If risk lives in a separate memo, nobody re-checks it when the model's assumptions change next quarter. If risk lives in the model, it updates automatically — that is the entire point of "applied" in this course's title.</div>`,
    `<span class="eyebrow">FMR301 · Chương 1 · Bài 1.1</span>
<h2>Mô hình tài chính tích hợp rủi ro: xây sẵn, không gắn thêm</h2>
<h3>"Tích hợp" thực ra nghĩa là gì</h3>
<p>Một mô hình được gọi là <strong>tích hợp</strong> khi câu hỏi về rủi ro được trả lời bằng cách bật một nút chuyển ngay trong CÙNG một workbook, không phải mở file khác. Cụ thể: lãi suất chiết khấu, giả định tăng trưởng doanh thu, và kịch bản "nếu suy thoái thì sao" đều nằm trên một tab <strong>Assumptions</strong>, và mọi kết quả (NPV, giá trị vốn chủ, tỷ lệ covenant) tính lại ngay khi bạn đổi chúng.</p>
<h3>Bốn khối xây dựng của kiến trúc</h3>
<ul>
<li><strong>Sheet giả định</strong> — mọi input (tăng trưởng %, biên lợi nhuận %, WACC, thuế suất, volatility) nằm ở MỘT nơi, mã màu (xanh = input, đen = công thức). Không có số cứng nào nằm trong công thức ở chỗ khác.</li>
<li><strong>Quy tắc một công thức</strong> — cùng một công thức, copy dọc theo hàng/cột, không ghi đè tay. Vi phạm quy tắc này là nguyên nhân #1 khiến "mô hình trả về câu trả lời khác nhau tuỳ ô đang xem".</li>
<li><strong>Nút chuyển circularity</strong> — khi chi phí lãi vay phụ thuộc số dư tiền mặt mà số dư tiền mặt lại phụ thuộc chi phí lãi vay (lịch nợ có cash sweep), thêm một ô IF-switch rõ ràng có thể triệt tiêu phần vòng lặp, để mô hình không âm thầm ra #REF hoặc số sai khi chế độ tính đặt là thủ công.</li>
<li><strong>Lớp phủ rủi ro</strong> — best/base/worst là một ô "ScenarioID" duy nhất mà mọi driver đọc qua CHOOSE/INDEX, nên TOÀN BỘ mô hình (báo cáo kết quả, dòng tiền, định giá) đổi theo một click — không phải ba bản file riêng.</li>
</ul>
<pre><code>Tab Assumptions (trích, GIẢ ĐỊNH):
 B2  Tăng trưởng doanh thu %  =CHOOSE(ScenarioID, 0.02, 0.06, 0.12)  ' xấu/cơ sở/tốt
 B3  Biên lợi nhuận gộp %     =CHOOSE(ScenarioID, 0.28, 0.35, 0.40)
 B4  WACC                     =CHOOSE(ScenarioID, 0.12, 0.10, 0.09)
 B1  ScenarioID (1/2/3)       2   ' <- MỘT ô duy nhất điều khiển tất cả
</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Nếu rủi ro nằm trong một bản ghi nhớ riêng, không ai kiểm lại nó khi giả định của mô hình đổi vào quý sau. Nếu rủi ro nằm trong mô hình, nó tự cập nhật — đó chính là ý nghĩa của "ứng dụng" trong tên môn học.</div>`,
  ]]);

const c1q = quiz('fmr301-quiz-1', 'Quiz 1 — Integrated modelling|||Quiz 1 — Mô hình tích hợp', [
  { id: 'q1', question: 'Điểm khác biệt chính của FMR301 so với FIM302c là gì?', options: ['FMR301 không dùng Excel', 'FMR301 tích hợp đo lường rủi ro (VaR, kịch bản) ngay trong mô hình cơ bản', 'FMR301 chỉ học lý thuyết, không thực hành', 'FMR301 thay thế hoàn toàn 3 báo cáo tài chính'], correctIndex: 1, explanation: 'FIM302c dạy cơ chế mô hình cơ bản; FMR301 thêm lớp rủi ro (VaR, scenario) tích hợp ngay trong mô hình đó.' },
  { id: 'q2', question: '"Quy tắc một công thức" (single-formula rule) trong dựng mô hình nghĩa là gì?', options: ['Chỉ dùng đúng một sheet cho cả mô hình', 'Cùng một công thức được copy dọc hàng/cột, không ghi đè tay từng ô', 'Mỗi công thức chỉ được tham chiếu một ô khác', 'Chỉ dùng hàm SUM duy nhất'], correctIndex: 1, explanation: 'Vi phạm quy tắc này (ghi đè tay) là nguyên nhân phổ biến khiến mô hình cho kết quả không nhất quán.' },
  { id: 'q3', question: '"Lớp phủ rủi ro" (risk overlay) kiểu ScenarioID trong mô hình tích hợp dùng để làm gì?', options: ['Xoá dữ liệu cũ mỗi khi mở file', 'Cho phép một ô duy nhất chuyển đổi toàn bộ giả định best/base/worst trong cả mô hình', 'Ẩn công thức khỏi người xem', 'Tự động gửi email báo cáo'], correctIndex: 1, explanation: 'Một ô ScenarioID (qua CHOOSE/INDEX) điều khiển toàn bộ driver, giúp cả mô hình đổi theo một click thay vì nhiều file rời.' },
]);

const c2 = doc('fmr301-2-1-three-statement-sensitivity', '2.1 — 3-statement model & risk sensitivity analysis|||2.1 — Mô hình 3 báo cáo & phân tích độ nhạy rủi ro',
  'Liên kết Income Statement–Balance Sheet–Cash Flow; kiểm tra balance check; Data Table 1-chiều/2-chiều; biểu đồ tornado xếp hạng driver rủi ro.',
  [[
    `<span class="eyebrow">FMR301 · Chapter 2 · Lesson 2.1</span>
<h2>3-statement model &amp; risk sensitivity analysis</h2>
<h3>The three links</h3>
<ul>
<li><strong>Income Statement → Balance Sheet</strong>: net income flows into retained earnings.</li>
<li><strong>Balance Sheet → Cash Flow</strong>: changes in working-capital lines (AR, AP, inventory) and capex/depreciation feed the cash-flow statement.</li>
<li><strong>Cash Flow → Balance Sheet</strong>: the ending cash balance closes the loop back onto the balance sheet's cash line.</li>
</ul>
<h3>The balance check</h3>
<p>Every properly linked model has one cell: <code>Balance check = Total assets − (Total liabilities + Equity)</code>. It MUST equal zero in every scenario, every period. A non-zero balance check is not a rounding issue — it is a broken link, and every risk number computed downstream (sensitivity, VaR) is meaningless until it is fixed.</p>
<h3>Sensitivity as a risk-ranking tool</h3>
<p>A <strong>one-way Data Table</strong> flexes one assumption (e.g. revenue growth) and shows the resulting output (e.g. EBITDA or equity value) across a range. A <strong>two-way Data Table</strong> flexes two assumptions at once (e.g. growth × margin) into a grid. Sorting each driver's swing (max − min output) from largest to smallest and charting it produces a <strong>tornado chart</strong> — the fastest way to answer "which assumption is our biggest risk?" without running a single Monte Carlo draw.</p>
<pre><code>Two-way Data Table (illustrative), output = EBITDA ($m):
                Margin 28%   Margin 35%   Margin 40%
 Growth 2%         39.2         49.0         56.0
 Growth 6%         42.8         53.5         61.2
 Growth 12%         48.7         60.9         69.6

Tornado ranking (swing on EBITDA, same base case):
 Margin       : 56.0 - 39.2 = 16.8   <- biggest risk driver
 Growth       : 48.7 - 39.2 =  9.5
</code></pre>
<div class="callout"><span class="badge">Risk lens</span> The sensitivity table is not a modelling exercise — it IS a risk assessment. The variable with the widest swing is the one a risk manager should monitor and hedge first.</div>`,
    `<span class="eyebrow">FMR301 · Chương 2 · Bài 2.1</span>
<h2>Mô hình 3 báo cáo &amp; phân tích độ nhạy rủi ro</h2>
<h3>Ba mối liên kết</h3>
<ul>
<li><strong>Báo cáo kết quả → Cân đối kế toán</strong>: lợi nhuận sau thuế chảy vào lợi nhuận giữ lại.</li>
<li><strong>Cân đối kế toán → Dòng tiền</strong>: biến động các dòng vốn lưu động (phải thu, phải trả, hàng tồn) và capex/khấu hao đưa vào báo cáo dòng tiền.</li>
<li><strong>Dòng tiền → Cân đối kế toán</strong>: số dư tiền cuối kỳ khép vòng trở lại dòng tiền mặt trên cân đối kế toán.</li>
</ul>
<h3>Kiểm tra cân đối (balance check)</h3>
<p>Mọi mô hình liên kết đúng đều có một ô: <code>Balance check = Tổng tài sản − (Tổng nợ + Vốn chủ)</code>. Ô này PHẢI bằng 0 ở mọi kịch bản, mọi kỳ. Balance check khác 0 không phải là lỗi làm tròn — đó là liên kết bị hỏng, và mọi số rủi ro tính sau đó (độ nhạy, VaR) đều vô nghĩa cho tới khi sửa xong.</p>
<h3>Độ nhạy như công cụ xếp hạng rủi ro</h3>
<p><strong>Data Table một chiều</strong> lay một giả định (ví dụ tăng trưởng doanh thu) và cho ra kết quả (ví dụ EBITDA hoặc giá trị vốn chủ) theo một dải giá trị. <strong>Data Table hai chiều</strong> lay hai giả định cùng lúc (ví dụ tăng trưởng × biên lợi nhuận) thành một lưới. Sắp xếp độ dao động của mỗi driver (kết quả lớn nhất trừ nhỏ nhất) từ lớn đến nhỏ và vẽ thành biểu đồ tạo ra <strong>tornado chart</strong> — cách nhanh nhất trả lời "giả định nào là rủi ro lớn nhất?" mà không cần chạy một lượt Monte Carlo nào.</p>
<pre><code>Data Table hai chiều (GIẢ ĐỊNH), kết quả = EBITDA (tỷ):
                Biên 28%     Biên 35%     Biên 40%
 Tăng trưởng 2%    39.2         49.0         56.0
 Tăng trưởng 6%    42.8         53.5         61.2
 Tăng trưởng 12%   48.7         60.9         69.6

Xếp hạng tornado (dao động EBITDA, cùng kịch bản cơ sở):
 Biên lợi nhuận  : 56.0 - 39.2 = 16.8   <- driver rủi ro lớn nhất
 Tăng trưởng     : 48.7 - 39.2 =  9.5
</code></pre>
<div class="callout"><span class="badge">Góc nhìn rủi ro</span> Bảng độ nhạy không phải bài tập dựng mô hình — nó CHÍNH LÀ đánh giá rủi ro. Biến có độ dao động rộng nhất là biến người quản trị rủi ro nên theo dõi và phòng ngừa trước tiên.</div>`,
  ]]);

const c2q = quiz('fmr301-quiz-2', 'Quiz 2 — 3-statement & sensitivity|||Quiz 2 — 3 báo cáo & độ nhạy', [
  { id: 'q1', question: 'Balance check khác 0 trong mô hình 3 báo cáo có nghĩa là gì?', options: ['Chỉ là lỗi làm tròn, có thể bỏ qua', 'Một liên kết trong mô hình bị hỏng, cần sửa trước khi tin bất kỳ số nào khác', 'Mô hình đang ở kịch bản xấu nhất', 'Thuế suất đang bằng 0'], correctIndex: 1, explanation: 'Balance check phải luôn bằng 0; khác 0 là dấu hiệu liên kết 3 báo cáo bị sai, không phải hiện tượng bình thường.' },
  { id: 'q2', question: 'Data Table hai chiều trong Excel dùng để làm gì?', options: ['Vẽ biểu đồ tròn', 'Cho ra kết quả khi lay ĐỒNG THỜI hai giả định trên một lưới giá trị', 'Xoá công thức trùng lặp', 'Tính thuế thu nhập doanh nghiệp'], correctIndex: 1, explanation: 'Two-way Data Table thay đổi hai input cùng lúc (ví dụ tăng trưởng × biên lợi nhuận) và hiển thị kết quả thành lưới.' },
  { id: 'q3', question: 'Biểu đồ tornado (tornado chart) trong phân tích độ nhạy dùng để?', options: ['Dự báo thời tiết ảnh hưởng doanh thu', 'Xếp hạng các giả định theo độ dao động kết quả, từ lớn đến nhỏ, để thấy rủi ro nào lớn nhất', 'Thay thế hoàn toàn báo cáo dòng tiền', 'Tính lãi suất chiết khấu WACC'], correctIndex: 1, explanation: 'Tornado chart sắp driver theo swing (max-min) giảm dần — driver rủi ro lớn nhất nằm trên cùng.' },
]);

const c3 = doc('fmr301-3-1-cashflow-project-risk', '3.1 — Cash-flow modelling & project risk (DCF, NPV, IRR)|||3.1 — Mô hình dòng tiền & rủi ro dự án (DCF, NPV, IRR)',
  'Free cash flow, chiết khấu theo WACC, NPV/IRR; điều chỉnh rủi ro qua discount rate (RADR) hoặc certainty equivalent; cây quyết định cho rủi ro dự án.',
  [[
    `<span class="eyebrow">FMR301 · Chapter 3 · Lesson 3.1</span>
<h2>Cash-flow modelling &amp; project risk</h2>
<h3>DCF fundamentals</h3>
<p><strong>Free Cash Flow (FCF)</strong> = EBIT×(1−tax) + Depreciation − Capex − ΔWorking capital. Discounting each period's FCF at the <strong>WACC</strong> and summing gives the <strong>NPV</strong>. The <strong>IRR</strong> is the discount rate that makes NPV = 0 — a project is attractive when IRR &gt; WACC (or equivalently NPV &gt; 0).</p>
<h3>Two ways to put risk into the discount step</h3>
<ul>
<li><strong>Risk-Adjusted Discount Rate (RADR)</strong> — add a risk premium to WACC for riskier projects (e.g. WACC + 3% for a new-market expansion). Simple, but crude: it penalises far-future cash flows disproportionately.</li>
<li><strong>Certainty Equivalent (CE)</strong> — instead of raising the discount rate, shrink the risky cash flow itself to its "certain-equivalent" value (e.g. multiply by a certainty factor &lt; 1 that falls over time as uncertainty compounds), then discount at the RISK-FREE rate. More correct in theory, harder to defend the certainty factor in practice.</li>
</ul>
<h3>Decision trees for project risk</h3>
<p>When a project has a small number of distinct outcomes (e.g. "regulatory approval: yes/no"), a <strong>decision tree</strong> with probabilities at each branch computes an <strong>Expected NPV</strong> = Σ (probability × NPV of that branch). This captures project risk WITHOUT needing a full Monte Carlo simulation (that heavier machinery is FMS301's territory).</p>
<pre><code>Decision tree (illustrative), Expected NPV of a plant expansion:
 P(approval)=0.7 -> NPV = 42.0m
 P(rejection)=0.3 -> NPV = -8.0m  (sunk permitting cost)
 Expected NPV = 0.7*42.0 + 0.3*(-8.0) = 29.4 - 2.4 = 27.0m

Sensitivity of NPV to WACC (base FCF stream, illustrative):
 WACC 9%  -> NPV = 34.1m
 WACC 10% -> NPV = 29.4m   (base case)
 WACC 12% -> NPV = 21.0m
</code></pre>
<div class="callout"><span class="badge">Model, not memo</span> Both RADR and the decision-tree probabilities are cells the model reads from the Assumptions tab — so a risk manager can stress the discount rate or the approval probability and watch NPV react instantly.</div>`,
    `<span class="eyebrow">FMR301 · Chương 3 · Bài 3.1</span>
<h2>Mô hình dòng tiền &amp; rủi ro dự án</h2>
<h3>Nền tảng DCF</h3>
<p><strong>Dòng tiền tự do (FCF)</strong> = EBIT×(1−thuế) + Khấu hao − Capex − ΔVốn lưu động. Chiết khấu FCF từng kỳ theo <strong>WACC</strong> và cộng lại cho ra <strong>NPV</strong>. <strong>IRR</strong> là lãi suất chiết khấu làm NPV = 0 — dự án hấp dẫn khi IRR &gt; WACC (tương đương NPV &gt; 0).</p>
<h3>Hai cách đưa rủi ro vào bước chiết khấu</h3>
<ul>
<li><strong>Lãi suất chiết khấu điều chỉnh rủi ro (RADR)</strong> — cộng thêm phần bù rủi ro vào WACC cho dự án rủi ro cao hơn (ví dụ WACC + 3% cho mở rộng thị trường mới). Đơn giản, nhưng thô: nó phạt dòng tiền ở tương lai xa quá mức.</li>
<li><strong>Tương đương chắc chắn (Certainty Equivalent - CE)</strong> — thay vì nâng lãi suất chiết khấu, thu nhỏ chính dòng tiền rủi ro về giá trị "tương đương chắc chắn" (ví dụ nhân với hệ số chắc chắn &lt; 1, giảm dần theo thời gian khi độ bất định tích luỹ), sau đó chiết khấu theo lãi suất KHÔNG rủi ro. Đúng về lý thuyết hơn, nhưng khó bảo vệ hệ số chắc chắn trong thực tế.</li>
</ul>
<h3>Cây quyết định cho rủi ro dự án</h3>
<p>Khi dự án có ít kết quả rời rạc rõ ràng (ví dụ "được cấp phép: có/không"), <strong>cây quyết định</strong> có xác suất ở mỗi nhánh tính ra <strong>NPV kỳ vọng</strong> = Σ (xác suất × NPV của nhánh đó). Cách này bắt được rủi ro dự án MÀ KHÔNG cần mô phỏng Monte Carlo đầy đủ (công cụ nặng đó thuộc địa hạt của FMS301).</p>
<pre><code>Cây quyết định (GIẢ ĐỊNH), NPV kỳ vọng của dự án mở rộng nhà máy:
 P(được cấp phép)=0.7 -> NPV = 42.0 tỷ
 P(bị bác)=0.3       -> NPV = -8.0 tỷ  (chi phí xin phép đã chìm)
 NPV kỳ vọng = 0.7*42.0 + 0.3*(-8.0) = 29.4 - 2.4 = 27.0 tỷ

Độ nhạy NPV theo WACC (dòng FCF cơ sở, GIẢ ĐỊNH):
 WACC 9%  -> NPV = 34.1 tỷ
 WACC 10% -> NPV = 29.4 tỷ  (kịch bản cơ sở)
 WACC 12% -> NPV = 21.0 tỷ
</code></pre>
<div class="callout"><span class="badge">Là mô hình, không phải ghi nhớ</span> Cả RADR và xác suất trong cây quyết định đều là ô mô hình đọc từ tab Assumptions — nên người quản trị rủi ro có thể stress lãi suất chiết khấu hoặc xác suất cấp phép và thấy NPV phản ứng ngay.</div>`,
  ]]);

const c3q = quiz('fmr301-quiz-3', 'Quiz 3 — Cash flow & project risk|||Quiz 3 — Dòng tiền & rủi ro dự án', [
  { id: 'q1', question: 'Một dự án được coi là hấp dẫn về tài chính khi nào?', options: ['IRR < WACC', 'IRR > WACC (tương đương NPV > 0)', 'NPV luôn âm', 'FCF bằng 0 mọi kỳ'], correctIndex: 1, explanation: 'Dự án hấp dẫn khi tỷ suất sinh lời nội bộ (IRR) vượt chi phí vốn (WACC), tương đương NPV dương.' },
  { id: 'q2', question: 'Phương pháp Certainty Equivalent (CE) điều chỉnh rủi ro bằng cách nào?', options: ['Tăng lãi suất chiết khấu lên', 'Thu nhỏ chính dòng tiền rủi ro rồi chiết khấu bằng lãi suất KHÔNG rủi ro', 'Bỏ hẳn dòng tiền năm cuối', 'Nhân đôi thuế suất'], correctIndex: 1, explanation: 'CE hạ giá trị dòng tiền về mức "tương đương chắc chắn" rồi chiết khấu ở lãi suất risk-free, khác với RADR (nâng lãi suất chiết khấu).' },
  { id: 'q3', question: 'Cây quyết định (decision tree) với NPV kỳ vọng phù hợp nhất khi nào?', options: ['Dự án có hàng nghìn biến số liên tục', 'Dự án có ít kết quả rời rạc rõ ràng kèm xác suất (ví dụ được/không được cấp phép)', 'Không cần biết xác suất gì cả', 'Chỉ dùng khi lãi suất chiết khấu bằng 0'], correctIndex: 1, explanation: 'Cây quyết định phù hợp với số nhánh kết quả ít, rời rạc; nhiều biến liên tục thì cần Monte Carlo (thuộc FMS301).' },
]);

const c4 = doc('fmr301-4-1-var-volatility', '4.1 — Risk measurement in the model: volatility & Value at Risk (VaR)|||4.1 — Đo lường rủi ro trong mô hình: volatility & Value at Risk (VaR)',
  'Tính lợi suất & volatility, quy đổi theo năm; VaR tham số (variance-covariance) và VaR lịch sử; mức tin cậy, hệ số z; Expected Shortfall (CVaR).',
  [[
    `<span class="eyebrow">FMR301 · Chapter 4 · Lesson 4.1</span>
<h2>Risk measurement in the model: volatility &amp; VaR</h2>
<h3>From returns to volatility</h3>
<p>Daily return: <code>rt = (Pt − Pt−1) / Pt−1</code>. <strong>Volatility (σ)</strong> is the standard deviation of returns. To annualise a daily volatility: <code>σ_annual = σ_daily × √252</code> (252 trading days); for monthly data use √12.</p>
<h3>Value at Risk (VaR) — the headline risk number</h3>
<p><strong>VaR</strong> answers: "what is the most I could lose over N days, at confidence level X%, under normal conditions?" Two model-friendly methods (Jorion):</p>
<ul>
<li><strong>Parametric / variance-covariance VaR</strong> — assumes returns are normally distributed: <code>VaR = z × σ × Value × √t</code>. Common z-scores: 95% confidence → z = 1.645; 99% confidence → z = 2.33.</li>
<li><strong>Historical VaR</strong> — no normality assumption: sort actual historical returns and read off the percentile directly (e.g. the 5th-worst percentile for 95% VaR). More robust to fat tails, needs enough historical data.</li>
</ul>
<p>A brief note on <strong>Monte Carlo VaR</strong>: simulate thousands of random return paths and read the percentile off the simulated distribution — the most flexible method, but full simulation machinery (and dedicated tooling) is FMS301's focus; this course uses it only as a sanity check, not as the primary technique.</p>
<h3>Beyond VaR: Expected Shortfall (CVaR)</h3>
<p>VaR says "you won't lose more than $X, 95% of the time" — but says nothing about how bad the OTHER 5% could be. <strong>Expected Shortfall (CVaR)</strong> = the average loss GIVEN that the loss exceeds the VaR threshold. Regulators increasingly prefer CVaR because it captures tail severity, not just a cutoff.</p>
<pre><code>Parametric VaR (illustrative):
 Portfolio value = $10,000,000
 Daily volatility (sigma) = 1.5%
 1-day 95% VaR = 1.645 * 0.015 * 10,000,000 = $246,750
 10-day 95% VaR = 246,750 * sqrt(10) = $780,500   (square-root-of-time rule)
</code></pre>
<div class="callout"><span class="badge">Model wiring</span> VaR is a formula reading σ and the confidence level off the Assumptions tab — change the confidence level from 95% to 99% and the whole risk dashboard updates, same as any other driver in Chapter 1's architecture.</div>`,
    `<span class="eyebrow">FMR301 · Chương 4 · Bài 4.1</span>
<h2>Đo lường rủi ro trong mô hình: volatility &amp; VaR</h2>
<h3>Từ lợi suất đến volatility</h3>
<p>Lợi suất ngày: <code>rt = (Pt − Pt−1) / Pt−1</code>. <strong>Volatility (σ)</strong> là độ lệch chuẩn của lợi suất. Quy đổi volatility ngày ra năm: <code>σ_năm = σ_ngày × √252</code> (252 ngày giao dịch); dữ liệu tháng thì dùng √12.</p>
<h3>Value at Risk (VaR) — con số rủi ro trung tâm</h3>
<p><strong>VaR</strong> trả lời: "tôi có thể lỗ tối đa bao nhiêu trong N ngày, ở mức tin cậy X%, trong điều kiện bình thường?" Hai phương pháp thân thiện với mô hình (theo Jorion):</p>
<ul>
<li><strong>VaR tham số / variance-covariance</strong> — giả định lợi suất phân phối chuẩn: <code>VaR = z × σ × Giá trị × √t</code>. Hệ số z thường dùng: tin cậy 95% → z = 1.645; tin cậy 99% → z = 2.33.</li>
<li><strong>VaR lịch sử</strong> — không giả định phân phối chuẩn: sắp xếp lợi suất lịch sử thực tế và đọc trực tiếp phân vị (ví dụ phân vị xấu thứ 5% cho VaR 95%). Bền hơn với đuôi phân phối dày (fat tail), cần đủ dữ liệu lịch sử.</li>
</ul>
<p>Một ghi chú ngắn về <strong>VaR Monte Carlo</strong>: mô phỏng hàng nghìn đường lợi suất ngẫu nhiên và đọc phân vị từ phân phối mô phỏng — phương pháp linh hoạt nhất, nhưng bộ máy mô phỏng đầy đủ (và công cụ chuyên dụng) thuộc trọng tâm của FMS301; môn này chỉ dùng nó để kiểm tra chéo, không phải kỹ thuật chính.</p>
<h3>Vượt ra ngoài VaR: Expected Shortfall (CVaR)</h3>
<p>VaR nói "bạn không lỗ hơn $X, 95% thời gian" — nhưng không nói gì về 5% còn lại có thể tệ tới đâu. <strong>Expected Shortfall (CVaR)</strong> = mức lỗ trung bình VỚI ĐIỀU KIỆN lỗ vượt ngưỡng VaR. Cơ quan quản lý ngày càng ưa CVaR vì nó nắm được độ nghiêm trọng của đuôi phân phối, không chỉ một ngưỡng cắt.</p>
<pre><code>VaR tham số (GIẢ ĐỊNH):
 Giá trị danh mục = 10.000.000.000 đ
 Volatility ngày (sigma) = 1.5%
 VaR 1 ngày, tin cậy 95% = 1.645 * 0.015 * 10.000.000.000 = 246.750.000 đ
 VaR 10 ngày, tin cậy 95% = 246.750.000 * sqrt(10) = 780.500.000 đ  (quy tắc căn-thời-gian)
</code></pre>
<div class="callout"><span class="badge">Nối vào mô hình</span> VaR là một công thức đọc σ và mức tin cậy từ tab Assumptions — đổi mức tin cậy từ 95% sang 99% thì cả dashboard rủi ro cập nhật theo, giống mọi driver khác trong kiến trúc ở Chương 1.</div>`,
  ]]);

const c4q = quiz('fmr301-quiz-4', 'Quiz 4 — Volatility & VaR|||Quiz 4 — Volatility & VaR', [
  { id: 'q1', question: 'Công thức VaR tham số (variance-covariance) là gì?', options: ['VaR = σ / z', 'VaR = z × σ × Giá trị × √t', 'VaR = Giá trị / σ', 'VaR = z − σ'], correctIndex: 1, explanation: 'VaR tham số giả định phân phối chuẩn, tính bằng hệ số z (theo mức tin cậy) nhân volatility nhân giá trị danh mục nhân căn thời gian.' },
  { id: 'q2', question: 'VaR lịch sử (historical VaR) khác VaR tham số ở điểm nào?', options: ['Không giả định phân phối chuẩn, đọc trực tiếp phân vị từ lợi suất lịch sử thực tế', 'Chỉ áp dụng cho cổ phiếu, không áp dụng cho danh mục', 'Luôn cho kết quả giống VaR tham số', 'Không cần dữ liệu lịch sử'], correctIndex: 0, explanation: 'VaR lịch sử sắp xếp lợi suất thực tế và đọc phân vị, không cần giả định phân phối chuẩn như VaR tham số.' },
  { id: 'q3', question: 'Expected Shortfall (CVaR) đo lường điều gì mà VaR không nắm được?', options: ['Mức lỗ trung bình khi lỗ đã vượt ngưỡng VaR (độ nghiêm trọng phần đuôi)', 'Tổng doanh thu của công ty', 'Lãi suất chiết khấu WACC', 'Thuế suất áp dụng'], correctIndex: 0, explanation: 'CVaR là mức lỗ trung bình có điều kiện khi vượt ngưỡng VaR, cho biết phần đuôi tệ tới đâu — điều VaR không thể hiện.' },
]);

const c5 = doc('fmr301-5-1-portfolio-risk-return', '5.1 — Portfolio modelling & risk-return optimisation|||5.1 — Mô hình danh mục & tối ưu rủi ro-lợi nhuận',
  'Lợi suất & phương sai danh mục (Markowitz), hiệu ứng đa dạng hoá qua correlation, đường biên hiệu quả, Sharpe ratio, Solver tối ưu trọng số.',
  [[
    `<span class="eyebrow">FMR301 · Chapter 5 · Lesson 5.1</span>
<h2>Portfolio modelling &amp; risk-return optimisation</h2>
<h3>Mean-variance basics (Markowitz)</h3>
<p>Portfolio expected return: <code>Rp = Σ wi × Ri</code> (weighted average). Portfolio <strong>variance</strong> is NOT a simple weighted average of individual variances — it also depends on how the assets move together: <code>σp² = Σ Σ wi × wj × Cov(i,j)</code>. When correlation between assets is less than +1, combining them REDUCES total risk below the weighted-average of individual risks — this is <strong>diversification</strong>, the mathematical reason a portfolio can beat the sum of its parts on a risk-adjusted basis.</p>
<h3>The efficient frontier &amp; Sharpe ratio</h3>
<p>Plotting every feasible weight combination on a return (y-axis) vs risk (x-axis) chart, the top-left boundary is the <strong>efficient frontier</strong> — the best return achievable for each level of risk. The <strong>Sharpe ratio</strong> = (Rp − Rf) / σp measures return earned per unit of risk taken; the portfolio with the highest Sharpe ratio is the "optimal" risk-adjusted choice.</p>
<h3>Solving for optimal weights in the model</h3>
<p>Excel's <strong>Solver</strong> add-in finds the weight vector that either (a) minimises σp for a target return, or (b) maximises the Sharpe ratio, subject to constraints (weights sum to 1, no short-selling i.e. wi ≥ 0). This turns the abstract "efficient frontier" into one concrete, model-driven recommendation.</p>
<pre><code>2-asset portfolio (illustrative):
 Asset A: Return 8%,  sigma 12%
 Asset B: Return 14%, sigma 22%
 Correlation(A,B) = 0.30
 Weights wA=0.6, wB=0.4:
 Rp = 0.6*8% + 0.4*14% = 10.4%
 sigma_p = sqrt(0.6^2*0.12^2 + 0.4^2*0.22^2 + 2*0.6*0.4*0.30*0.12*0.22) = 13.1%
 Sharpe (Rf=3%) = (10.4% - 3%) / 13.1% = 0.565
</code></pre>
<div class="callout"><span class="badge">Risk lens</span> This is the same "risk built into the model" idea as Chapter 1 — but the risk metric here is portfolio variance/Sharpe, and the "switch" is Solver re-optimising weights whenever an asset's return, volatility or correlation assumption changes.</div>`,
    `<span class="eyebrow">FMR301 · Chương 5 · Bài 5.1</span>
<h2>Mô hình danh mục &amp; tối ưu rủi ro-lợi nhuận</h2>
<h3>Nền tảng mean-variance (Markowitz)</h3>
<p>Lợi suất kỳ vọng danh mục: <code>Rp = Σ wi × Ri</code> (trung bình có trọng số). <strong>Phương sai</strong> danh mục KHÔNG phải trung bình có trọng số đơn giản của phương sai từng tài sản — nó còn phụ thuộc cách các tài sản di chuyển cùng nhau: <code>σp² = Σ Σ wi × wj × Cov(i,j)</code>. Khi tương quan giữa các tài sản nhỏ hơn +1, kết hợp chúng LÀM GIẢM tổng rủi ro xuống dưới trung bình có trọng số của rủi ro từng phần — đây là <strong>đa dạng hoá (diversification)</strong>, lý do toán học khiến một danh mục vượt tổng các phần của nó xét trên cơ sở điều chỉnh rủi ro.</p>
<h3>Đường biên hiệu quả &amp; Sharpe ratio</h3>
<p>Vẽ mọi tổ hợp trọng số khả thi lên biểu đồ lợi suất (trục y) so với rủi ro (trục x), đường viền trên-trái là <strong>đường biên hiệu quả (efficient frontier)</strong> — lợi suất tốt nhất đạt được ở mỗi mức rủi ro. <strong>Sharpe ratio</strong> = (Rp − Rf) / σp đo lợi suất kiếm được trên mỗi đơn vị rủi ro chịu; danh mục có Sharpe ratio cao nhất là lựa chọn "tối ưu" theo điều chỉnh rủi ro.</p>
<h3>Giải trọng số tối ưu trong mô hình</h3>
<p>Add-in <strong>Solver</strong> của Excel tìm vector trọng số sao cho (a) tối thiểu hoá σp với lợi suất mục tiêu cho trước, hoặc (b) tối đa hoá Sharpe ratio, với ràng buộc (tổng trọng số bằng 1, không bán khống tức wi ≥ 0). Cách này biến "đường biên hiệu quả" trừu tượng thành một khuyến nghị cụ thể, do mô hình dẫn dắt.</p>
<pre><code>Danh mục 2 tài sản (GIẢ ĐỊNH):
 Tài sản A: Lợi suất 8%,  sigma 12%
 Tài sản B: Lợi suất 14%, sigma 22%
 Tương quan(A,B) = 0.30
 Trọng số wA=0.6, wB=0.4:
 Rp = 0.6*8% + 0.4*14% = 10.4%
 sigma_p = sqrt(0.6^2*0.12^2 + 0.4^2*0.22^2 + 2*0.6*0.4*0.30*0.12*0.22) = 13.1%
 Sharpe (Rf=3%) = (10.4% - 3%) / 13.1% = 0.565
</code></pre>
<div class="callout"><span class="badge">Góc nhìn rủi ro</span> Đây vẫn là ý tưởng "rủi ro xây sẵn trong mô hình" như Chương 1 — nhưng chỉ số rủi ro ở đây là phương sai danh mục/Sharpe, và "nút chuyển" là Solver tối ưu lại trọng số mỗi khi giả định lợi suất, volatility hoặc tương quan của một tài sản thay đổi.</div>`,
  ]]);

const c5q = quiz('fmr301-quiz-5', 'Quiz 5 — Portfolio & optimisation|||Quiz 5 — Danh mục & tối ưu', [
  { id: 'q1', question: 'Vì sao phương sai danh mục KHÔNG phải trung bình có trọng số đơn giản của phương sai từng tài sản?', options: ['Vì lãi suất luôn thay đổi', 'Vì phương sai danh mục còn phụ thuộc hiệp phương sai (correlation) giữa các tài sản', 'Vì Excel không tính được tổng', 'Vì phương sai luôn bằng 0'], correctIndex: 1, explanation: 'Công thức σp² = ΣΣ wi wj Cov(i,j) có phần chéo phụ thuộc tương quan — đây là cơ sở của đa dạng hoá.' },
  { id: 'q2', question: 'Sharpe ratio đo lường điều gì?', options: ['Tổng lợi suất tuyệt đối', 'Lợi suất vượt trội trên mỗi đơn vị rủi ro chịu, tức (Rp - Rf)/σp', 'Thuế suất áp dụng cho danh mục', 'Số lượng tài sản trong danh mục'], correctIndex: 1, explanation: 'Sharpe ratio = (Rp - Rf)/σp, đo hiệu quả rủi ro-lợi nhuận; càng cao càng tốt.' },
  { id: 'q3', question: 'Trong mô hình, Solver được dùng để làm gì khi tối ưu danh mục?', options: ['Vẽ logo công ty', 'Tìm vector trọng số tối thiểu hoá rủi ro hoặc tối đa hoá Sharpe ratio dưới ràng buộc cho trước', 'Tính thuế thu nhập cá nhân', 'Xoá dữ liệu cũ trong workbook'], correctIndex: 1, explanation: 'Solver giải bài toán tối ưu có ràng buộc (tổng trọng số = 1, không bán khống) để tìm trọng số tối ưu.' },
]);

const c6 = doc('fmr301-6-1-scenario-stress-testing', '6.1 — Scenario & stress testing inside the model|||6.1 — Kịch bản & stress testing trong mô hình',
  'Scenario Manager (best/base/worst) khác gì độ nhạy; stress test (shock cực đoan nhưng khả dĩ) đồng thời nhiều biến; reverse stress test tìm điểm vỡ.',
  [[
    `<span class="eyebrow">FMR301 · Chapter 6 · Lesson 6.1</span>
<h2>Scenario &amp; stress testing inside the model</h2>
<h3>Scenario ≠ sensitivity</h3>
<p><strong>Sensitivity</strong> (Chapter 2) isolates ONE variable to see its individual impact. A <strong>scenario</strong> changes SEVERAL assumptions simultaneously to represent one coherent story — e.g. "recession": revenue growth drops AND margin compresses AND interest rates rise, all at once, because in a real recession these move together, not independently.</p>
<h3>Building scenarios into the model</h3>
<p>Excel's <strong>Scenario Manager</strong> stores named sets of input values (Base, Recession, Boom) that can be swapped in with one click; the same effect is achieved more transparently in a well-built model with the <strong>ScenarioID switch</strong> from Chapter 1 (CHOOSE/INDEX reading a scenario table).</p>
<h3>Stress testing: extreme but plausible</h3>
<p>A <strong>stress test</strong> pushes several risk factors to an extreme simultaneously — not "what's likely" but "what's the worst combination a regulator or lender would still find plausible" (e.g. −30% revenue AND +300bps borrowing rate AND a 60-day slip in receivables collection, all at once). The purpose: check whether a covenant (e.g. interest coverage &gt; 2.5x) or a liquidity line still holds.</p>
<h3>Reverse stress testing</h3>
<p>Instead of asking "what happens under this shock", a <strong>reverse stress test</strong> asks "how big a shock would it take to BREAK the model" (breach a covenant, run out of cash) — then works backward to size that shock and judge how plausible it is. This flips passive risk reporting into an active early-warning tool.</p>
<pre><code>Stress scenario vs base (illustrative), interest coverage ratio:
 Base case:      EBITDA 120m / Interest 22m = 5.5x   (covenant floor 2.5x — safe)
 Stress scenario: EBITDA 78m  / Interest 34m = 2.3x   (BELOW covenant — breach)

Reverse stress test: solve for revenue decline % that drives coverage to exactly 2.5x
 -> found at revenue decline = 22% (holding other stresses at base)
</code></pre>
<div class="callout"><span class="badge">Risk lens</span> A stress test that lives in the model (one switch, applied to every linked statement) catches covenant breaches BEFORE the lender's covenant test does — a separate memo cannot do that.</div>`,
    `<span class="eyebrow">FMR301 · Chương 6 · Bài 6.1</span>
<h2>Kịch bản &amp; stress testing trong mô hình</h2>
<h3>Kịch bản ≠ độ nhạy</h3>
<p><strong>Độ nhạy</strong> (Chương 2) cô lập MỘT biến để xem tác động riêng của nó. <strong>Kịch bản (scenario)</strong> đổi NHIỀU giả định đồng thời để tạo thành một câu chuyện gắn kết — ví dụ "suy thoái": tăng trưởng doanh thu giảm VÀ biên lợi nhuận co lại VÀ lãi suất tăng, tất cả cùng lúc, vì trong suy thoái thật các yếu tố này di chuyển cùng nhau, không độc lập.</p>
<h3>Dựng kịch bản vào mô hình</h3>
<p><strong>Scenario Manager</strong> của Excel lưu các bộ giá trị input được đặt tên (Cơ sở, Suy thoái, Bùng nổ) có thể đổi vào bằng một click; hiệu ứng tương tự đạt được rõ ràng hơn trong mô hình dựng tốt bằng <strong>nút chuyển ScenarioID</strong> từ Chương 1 (CHOOSE/INDEX đọc từ bảng kịch bản).</p>
<h3>Stress test: cực đoan nhưng khả dĩ</h3>
<p><strong>Stress test</strong> đẩy nhiều yếu tố rủi ro tới cực đoan đồng thời — không phải "cái gì có khả năng xảy ra" mà "tổ hợp xấu nhất mà cơ quan quản lý hay bên cho vay vẫn thấy khả dĩ" (ví dụ doanh thu giảm 30% VÀ lãi suất vay tăng 300 điểm cơ bản VÀ thu hồi phải thu trễ 60 ngày, tất cả cùng lúc). Mục đích: kiểm tra covenant (ví dụ hệ số bao phủ lãi vay &gt; 2.5x) hoặc hạn mức thanh khoản có còn giữ được không.</p>
<h3>Reverse stress test</h3>
<p>Thay vì hỏi "shock này xảy ra thì sao", <strong>reverse stress test</strong> hỏi "cần shock lớn tới đâu để LÀM VỠ mô hình" (vi phạm covenant, hết tiền mặt) — rồi lùi lại để đo kích thước shock đó và đánh giá nó khả dĩ tới đâu. Cách này biến báo cáo rủi ro bị động thành công cụ cảnh báo sớm chủ động.</p>
<pre><code>Kịch bản stress so với cơ sở (GIẢ ĐỊNH), hệ số bao phủ lãi vay:
 Cơ sở:  EBITDA 120 tỷ / Lãi vay 22 tỷ = 5.5x   (sàn covenant 2.5x — an toàn)
 Stress: EBITDA 78 tỷ  / Lãi vay 34 tỷ = 2.3x   (DƯỚI covenant — vi phạm)

Reverse stress test: giải % doanh thu giảm để hệ số về đúng 2.5x
 -> tìm được ở mức giảm doanh thu = 22% (giữ các stress khác ở mức cơ sở)
</code></pre>
<div class="callout"><span class="badge">Góc nhìn rủi ro</span> Một stress test nằm trong mô hình (một nút chuyển, áp lên mọi báo cáo liên kết) bắt được vi phạm covenant TRƯỚC khi bên cho vay kiểm tra covenant — một bản ghi nhớ tách riêng không làm được điều đó.</div>`,
  ]]);

const c6q = quiz('fmr301-quiz-6', 'Quiz 6 — Scenario & stress testing|||Quiz 6 — Kịch bản & stress test', [
  { id: 'q1', question: 'Khác biệt chính giữa "kịch bản" (scenario) và "độ nhạy" (sensitivity) là gì?', options: ['Không có khác biệt gì', 'Độ nhạy cô lập một biến; kịch bản đổi nhiều giả định đồng thời theo một câu chuyện gắn kết', 'Kịch bản chỉ dùng cho cổ phiếu', 'Độ nhạy chỉ áp dụng cho quý IV'], correctIndex: 1, explanation: 'Sensitivity xét tác động riêng của một biến; scenario đổi nhiều biến cùng lúc để mô phỏng một tình huống thực tế như suy thoái.' },
  { id: 'q2', question: 'Mục đích chính của stress test trong mô hình tài chính là gì?', options: ['Tăng doanh thu công ty', 'Kiểm tra covenant hoặc thanh khoản còn giữ được không dưới tổ hợp shock cực đoan nhưng khả dĩ', 'Thay thế hoàn toàn báo cáo kiểm toán', 'Tính lại thuế suất doanh nghiệp'], correctIndex: 1, explanation: 'Stress test đẩy nhiều yếu tố rủi ro tới cực đoan đồng thời để kiểm tra covenant/thanh khoản, không phải để tăng doanh thu.' },
  { id: 'q3', question: 'Reverse stress test khác stress test thông thường ở điểm nào?', options: ['Không khác gì cả', 'Nó đi ngược: tìm shock cần bao lớn để làm vỡ mô hình, thay vì áp shock cho sẵn rồi xem kết quả', 'Chỉ áp dụng cho ngân hàng trung ương', 'Luôn cho kết quả covenant an toàn'], correctIndex: 1, explanation: 'Reverse stress test giải ngược: tìm mức shock (ví dụ % doanh thu giảm) khiến covenant bị vi phạm, rồi đánh giá mức đó có khả dĩ không.' },
]);

const c7 = doc('fmr301-7-1-credit-risk-valuation', '7.1 — Credit risk modelling & risk-adjusted valuation|||7.1 — Mô hình rủi ro tín dụng & định giá có rủi ro',
  'PD, LGD, EAD & Expected Loss; Altman Z-score; điều chỉnh định giá theo rủi ro qua credit spread hoặc điều chỉnh dòng tiền theo xác suất vỡ nợ.',
  [[
    `<span class="eyebrow">FMR301 · Chapter 7 · Lesson 7.1</span>
<h2>Credit risk modelling &amp; risk-adjusted valuation</h2>
<h3>The three building blocks of credit risk</h3>
<ul>
<li><strong>PD (Probability of Default)</strong> — the likelihood the borrower defaults within a given horizon (e.g. 1 year).</li>
<li><strong>LGD (Loss Given Default)</strong> — the fraction of exposure NOT recovered if default happens (1 − recovery rate).</li>
<li><strong>EAD (Exposure at Default)</strong> — the outstanding amount at risk at the moment of default.</li>
</ul>
<p><strong>Expected Loss (EL) = PD × LGD × EAD</strong> — the single number a lending or credit-risk model needs to price a loan or size a provision.</p>
<h3>Altman Z-score inside the model</h3>
<p>The <strong>Altman Z-score</strong> combines five balance-sheet/income-statement ratios (working capital/assets, retained earnings/assets, EBIT/assets, market value of equity/liabilities, sales/assets) into a single bankruptcy-risk score. Because every input is already sitting in the 3-statement model (Chapter 2), the Z-score is just one more formula cell — a cheap, model-native early-warning signal that needs no external credit-rating subscription.</p>
<h3>Risk-adjusted valuation</h3>
<p>Two model-consistent ways to price default risk into a valuation:</p>
<ul>
<li><strong>Credit-spread-adjusted discount rate</strong> — discount at the risk-free rate plus a credit spread that widens with PD (this is why riskier borrowers pay higher yields).</li>
<li><strong>Credit-adjusted DCF</strong> — instead of touching the discount rate, multiply each period's expected cash flow by its survival probability (1 − cumulative PD up to that period), then discount at the risk-free rate. Conceptually the credit-risk twin of the Certainty Equivalent method from Chapter 3.</li>
</ul>
<pre><code>Expected Loss (illustrative):
 EAD = $5,000,000 loan outstanding
 PD (1-year) = 3%
 LGD = 45% (recovery rate 55%)
 Expected Loss = 0.03 * 0.45 * 5,000,000 = $67,500

Credit-adjusted DCF, one period (illustrative):
 Expected CF = $1,000,000, survival probability = 97%
 Risk-free rate = 4%
 PV = (1,000,000 * 0.97) / 1.04 = $932,692
</code></pre>
<div class="callout"><span class="badge">Model, not a separate rating</span> PD/LGD/EAD and the Z-score read the SAME assumption cells as every other chapter — a downgrade in the growth or margin assumption should visibly move the Z-score and the credit spread, not just the equity valuation.</div>`,
    `<span class="eyebrow">FMR301 · Chương 7 · Bài 7.1</span>
<h2>Mô hình rủi ro tín dụng &amp; định giá có rủi ro</h2>
<h3>Ba khối xây dựng rủi ro tín dụng</h3>
<ul>
<li><strong>PD (Probability of Default — xác suất vỡ nợ)</strong> — khả năng bên vay vỡ nợ trong một khoảng thời gian cho trước (ví dụ 1 năm).</li>
<li><strong>LGD (Loss Given Default — tỷ lệ tổn thất khi vỡ nợ)</strong> — phần rủi ro KHÔNG thu hồi được nếu vỡ nợ xảy ra (1 − tỷ lệ thu hồi).</li>
<li><strong>EAD (Exposure at Default — dư nợ tại thời điểm vỡ nợ)</strong> — số tiền còn chịu rủi ro vào lúc vỡ nợ.</li>
</ul>
<p><strong>Tổn thất kỳ vọng (EL) = PD × LGD × EAD</strong> — con số duy nhất mà mô hình cho vay hoặc rủi ro tín dụng cần để định giá khoản vay hoặc tính mức trích lập dự phòng.</p>
<h3>Altman Z-score trong mô hình</h3>
<p><strong>Altman Z-score</strong> kết hợp năm tỷ số từ cân đối kế toán/báo cáo kết quả (vốn lưu động/tài sản, lợi nhuận giữ lại/tài sản, EBIT/tài sản, giá trị thị trường vốn chủ/nợ, doanh thu/tài sản) thành một điểm rủi ro phá sản duy nhất. Vì mọi input đã có sẵn trong mô hình 3 báo cáo (Chương 2), Z-score chỉ là thêm một ô công thức — tín hiệu cảnh báo sớm rẻ, gắn ngay trong mô hình, không cần đăng ký dịch vụ xếp hạng tín dụng bên ngoài.</p>
<h3>Định giá có điều chỉnh rủi ro</h3>
<p>Hai cách nhất quán với mô hình để đưa rủi ro vỡ nợ vào định giá:</p>
<ul>
<li><strong>Lãi suất chiết khấu điều chỉnh theo credit spread</strong> — chiết khấu bằng lãi suất không rủi ro cộng credit spread nới rộng theo PD (đây là lý do bên vay rủi ro cao hơn phải trả lợi suất cao hơn).</li>
<li><strong>DCF điều chỉnh tín dụng</strong> — thay vì đụng vào lãi suất chiết khấu, nhân dòng tiền kỳ vọng mỗi kỳ với xác suất sống sót (1 − PD tích lũy đến kỳ đó), rồi chiết khấu ở lãi suất không rủi ro. Về bản chất là "anh em" của phương pháp Certainty Equivalent ở Chương 3, áp cho rủi ro tín dụng.</li>
</ul>
<pre><code>Tổn thất kỳ vọng (GIẢ ĐỊNH):
 EAD = 5.000.000.000 đ dư nợ vay
 PD (1 năm) = 3%
 LGD = 45% (tỷ lệ thu hồi 55%)
 Tổn thất kỳ vọng = 0.03 * 0.45 * 5.000.000.000 = 67.500.000 đ

DCF điều chỉnh tín dụng, một kỳ (GIẢ ĐỊNH):
 Dòng tiền kỳ vọng = 1.000.000.000 đ, xác suất sống sót = 97%
 Lãi suất không rủi ro = 4%
 PV = (1.000.000.000 * 0.97) / 1.04 = 932.692.000 đ
</code></pre>
<div class="callout"><span class="badge">Là mô hình, không phải xếp hạng rời</span> PD/LGD/EAD và Z-score đọc CÙNG các ô giả định như mọi chương khác — hạ giả định tăng trưởng hoặc biên lợi nhuận phải làm Z-score và credit spread thay đổi rõ ràng, không chỉ định giá vốn chủ.</div>`,
  ]]);

const c7q = quiz('fmr301-quiz-7', 'Quiz 7 — Credit risk & valuation|||Quiz 7 — Rủi ro tín dụng & định giá', [
  { id: 'q1', question: 'Công thức Tổn thất kỳ vọng (Expected Loss) trong rủi ro tín dụng là gì?', options: ['EL = PD + LGD + EAD', 'EL = PD × LGD × EAD', 'EL = EAD / PD', 'EL = LGD − PD'], correctIndex: 1, explanation: 'Tổn thất kỳ vọng = xác suất vỡ nợ × tỷ lệ tổn thất khi vỡ nợ × dư nợ tại thời điểm vỡ nợ.' },
  { id: 'q2', question: 'Altman Z-score dùng để đo điều gì, và vì sao có thể tính ngay trong mô hình 3 báo cáo?', options: ['Đo lãi suất thị trường; cần dữ liệu bên ngoài', 'Đo rủi ro phá sản từ các tỷ số cân đối kế toán/kết quả kinh doanh đã có sẵn trong mô hình', 'Đo thuế suất; lấy từ cơ quan thuế', 'Đo tỷ giá hối đoái; cần API riêng'], correctIndex: 1, explanation: 'Z-score kết hợp 5 tỷ số tài chính vốn đã có trong mô hình 3 báo cáo, nên tính được ngay mà không cần nguồn ngoài.' },
  { id: 'q3', question: 'DCF điều chỉnh tín dụng (credit-adjusted DCF) làm gì khác so với chỉ nâng lãi suất chiết khấu?', options: ['Nhân dòng tiền kỳ vọng với xác suất sống sót rồi chiết khấu ở lãi suất không rủi ro', 'Bỏ hẳn dòng tiền năm cuối', 'Không thay đổi gì so với DCF thường', 'Chỉ áp dụng cho cổ phiếu, không áp dụng cho khoản vay'], correctIndex: 0, explanation: 'Thay vì nâng discount rate, phương pháp này thu nhỏ dòng tiền theo xác suất sống sót rồi chiết khấu ở lãi suất risk-free — giống Certainty Equivalent áp cho rủi ro tín dụng.' },
]);

const c8 = doc('fmr301-8-1-integrated-erm-reporting', '8.1 — Integrated ERM model & decision-support reporting|||8.1 — Mô hình ERM tích hợp & báo cáo cho ra quyết định',
  'Dashboard rủi ro một trang (KRI, VaR, kịch bản, covenant headroom, tornado); liên kết với khung ERM (COSO) qua ngưỡng chấp nhận rủi ro; RAROC.',
  [[
    `<span class="eyebrow">FMR301 · Chapter 8 · Lesson 8.1</span>
<h2>Integrated ERM model &amp; decision-support reporting</h2>
<h3>Pulling every chapter onto one dashboard</h3>
<p>The capstone of this course is a single risk dashboard sheet that reads live outputs from every earlier chapter's model logic: the <strong>tornado chart</strong> (Ch. 2) ranking sensitivity drivers, the <strong>VaR / Expected Shortfall</strong> figure (Ch. 4), the <strong>scenario P&amp;L</strong> comparison across best/base/worst/stress (Ch. 1, 6), the <strong>covenant headroom</strong> gauge (Ch. 6), and the <strong>credit metrics</strong> — Z-score and expected loss (Ch. 7). Nothing on this sheet is retyped; every cell is a formula pointing back into the model.</p>
<h3>Linking the model to the ERM framework (COSO)</h3>
<p>Hull's risk-management view and the widely used <strong>COSO ERM framework</strong> describe risk management as a governance process (risk appetite → identification → assessment → response → monitoring). FMR301's job is narrower and mechanical: turn the organisation's stated <strong>risk appetite</strong> (e.g. "VaR must stay under 2% of portfolio value", "interest coverage must stay above 2.5x") into <strong>threshold cells</strong> in the model that flag red/amber/green automatically. The model doesn't set the policy — FRM301's ERM project does that — but it is where the policy becomes a live, checkable number.</p>
<h3>Risk-adjusted performance for the decision</h3>
<p><strong>RAROC (Risk-Adjusted Return on Capital)</strong> = Expected return / Economic capital (capital sized to cover the risk taken, e.g. from VaR or expected loss). Comparing RAROC across two projects or business lines lets a decision-maker choose the option with the better return PER UNIT of risk consumed — not just the higher raw return.</p>
<pre><code>One-page risk dashboard (illustrative, all cells = live formulas):
 Base-case EBITDA .......... 120m         (Ch.2 model)
 Biggest sensitivity driver . Margin, swing 16.8m   (Ch.2 tornado)
 1-day 95% VaR .............. $246,750     (Ch.4)
 Stress-case interest cover . 2.3x  <- RED (floor 2.5x)  (Ch.6)
 Altman Z-score .............. 2.4  <- AMBER (distress zone 1.8-3.0) (Ch.7)
 RAROC (Project A vs B) ...... A: 18.2%  |  B: 14.9%  -> choose A
</code></pre>
<div class="callout"><span class="badge">Course thesis, restated</span> This dashboard is the whole point of FMR301: risk that used to live in a separate memo now lives in the SAME model that produces the valuation — so the decision-maker sees return and risk on one screen, updating together, always.</div>`,
    `<span class="eyebrow">FMR301 · Chương 8 · Bài 8.1</span>
<h2>Mô hình ERM tích hợp &amp; báo cáo cho ra quyết định</h2>
<h3>Gom mọi chương về một dashboard</h3>
<p>Bài học tổng kết của môn là một sheet dashboard rủi ro duy nhất đọc kết quả sống từ logic mô hình của mọi chương trước: <strong>tornado chart</strong> (Ch.2) xếp hạng driver độ nhạy, con số <strong>VaR / Expected Shortfall</strong> (Ch.4), so sánh <strong>P&amp;L theo kịch bản</strong> giữa tốt/cơ sở/xấu/stress (Ch.1, 6), đồng hồ <strong>khoảng đệm covenant</strong> (Ch.6), và các <strong>chỉ số tín dụng</strong> — Z-score và tổn thất kỳ vọng (Ch.7). Không có gì trên sheet này được gõ lại tay; mọi ô là công thức trỏ ngược về mô hình.</p>
<h3>Nối mô hình với khung ERM (COSO)</h3>
<p>Góc nhìn quản trị rủi ro của Hull và <strong>khung ERM COSO</strong> được dùng rộng rãi mô tả quản trị rủi ro như một quy trình quản trị (mức chấp nhận rủi ro → nhận diện → đánh giá → phản ứng → giám sát). Việc của FMR301 hẹp hơn và mang tính cơ chế: biến <strong>mức chấp nhận rủi ro</strong> (risk appetite) mà tổ chức công bố (ví dụ "VaR phải dưới 2% giá trị danh mục", "hệ số bao phủ lãi vay phải trên 2.5x") thành các <strong>ô ngưỡng</strong> trong mô hình tự động báo đỏ/vàng/xanh. Mô hình không đặt ra chính sách — đó là việc của dự án ERM ở FRM301 — nhưng đây là chỗ chính sách trở thành một con số sống, kiểm được ngay.</p>
<h3>Hiệu suất điều chỉnh rủi ro cho quyết định</h3>
<p><strong>RAROC (Risk-Adjusted Return on Capital)</strong> = Lợi suất kỳ vọng / Vốn kinh tế (vốn được tính đủ để bù rủi ro chịu, ví dụ từ VaR hoặc tổn thất kỳ vọng). So sánh RAROC giữa hai dự án hoặc mảng kinh doanh cho phép người ra quyết định chọn phương án có lợi suất TỐT HƠN TRÊN MỖI ĐƠN VỊ rủi ro tiêu tốn — không chỉ lợi suất tuyệt đối cao hơn.</p>
<pre><code>Dashboard rủi ro một trang (GIẢ ĐỊNH, mọi ô = công thức sống):
 EBITDA kịch bản cơ sở ....... 120 tỷ        (mô hình Ch.2)
 Driver độ nhạy lớn nhất ...... Biên lợi nhuận, dao động 16.8 tỷ (tornado Ch.2)
 VaR 1 ngày, tin cậy 95% ...... 246.750.000 đ  (Ch.4)
 Hệ số bao phủ lãi vay stress .. 2.3x  <- ĐỎ (sàn 2.5x)  (Ch.6)
 Altman Z-score ................ 2.4  <- VÀNG (vùng cảnh báo 1.8-3.0) (Ch.7)
 RAROC (Dự án A vs B) .......... A: 18.2%  |  B: 14.9%  -> chọn A
</code></pre>
<div class="callout"><span class="badge">Luận điểm của môn, nói lại</span> Dashboard này chính là trọng tâm của FMR301: rủi ro trước đây nằm trong một bản ghi nhớ riêng nay nằm ngay trong CÙNG mô hình cho ra định giá — nên người ra quyết định thấy lợi suất và rủi ro trên một màn hình, luôn cập nhật cùng nhau.</div>`,
  ]]);

const c8q = quiz('fmr301-quiz-8', 'Quiz 8 — Integrated ERM & reporting|||Quiz 8 — ERM tích hợp & báo cáo', [
  { id: 'q1', question: 'Vai trò của "ô ngưỡng" (threshold cell) trong mô hình ERM tích hợp là gì?', options: ['Trang trí giao diện Excel', 'Biến mức chấp nhận rủi ro (risk appetite) đã công bố thành một con số sống, tự báo đỏ/vàng/xanh trong mô hình', 'Xoá dữ liệu quá hạn', 'Tính lại thuế thu nhập doanh nghiệp'], correctIndex: 1, explanation: 'Threshold cell biến chính sách rủi ro (ví dụ VaR < 2%, coverage > 2.5x) thành cảnh báo tự động ngay trong mô hình.' },
  { id: 'q2', question: 'RAROC (Risk-Adjusted Return on Capital) dùng để so sánh gì giữa hai dự án?', options: ['Chỉ so sánh lợi suất tuyệt đối, bỏ qua rủi ro', 'So sánh lợi suất kỳ vọng trên mỗi đơn vị vốn kinh tế (rủi ro) tiêu tốn', 'So sánh số nhân viên của mỗi dự án', 'So sánh vị trí địa lý của dự án'], correctIndex: 1, explanation: 'RAROC = lợi suất kỳ vọng / vốn kinh tế, cho phép chọn dự án tốt hơn trên cơ sở điều chỉnh rủi ro, không chỉ lợi suất thô.' },
  { id: 'q3', question: 'Theo môn FMR301, mô hình (spreadsheet) khác gì so với dự án ERM ở FRM301?', options: ['Không khác gì, hai môn trùng lặp hoàn toàn', 'Mô hình biến chính sách rủi ro thành con số sống, kiểm được ngay; FRM301 là quy trình/dự án đặt ra chính sách đó', 'Mô hình chỉ dùng cho ngân hàng, không dùng cho doanh nghiệp khác', 'FRM301 không liên quan gì đến rủi ro'], correctIndex: 1, explanation: 'FMR301 tập trung vào cơ chế mô hình hoá con số rủi ro; FRM301 là dự án về quy trình/khung quản trị (chính sách, governance) tạo ra các ngưỡng đó.' },
]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'FMR301',
    slug: 'fmr301-applied-financial-modelling-and-risk-management',
    title: 'Applied Financial modelling and risk management',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/FMR301.webp',
    shortDescription: 'Financial models with risk built directly in — sensitivity/scenario switches, VaR, portfolio optimisation, credit risk, stress testing. Distinct from base modelling, Monte Carlo simulation and standalone ERM projects.|||Mô hình tài chính TÍCH HỢP quản trị rủi ro ngay trong bảng tính — độ nhạy, kịch bản, VaR, tối ưu danh mục, rủi ro tín dụng, stress test. Phân biệt với mô hình cơ bản, mô phỏng Monte Carlo và dự án ERM độc lập.',
    description: 'Môn <strong>FMR301 — Applied Financial Modelling and Risk Management</strong> (khối Quản trị Kinh doanh, kỳ 7) dạy cách dựng mô hình tài chính có <strong>quản trị rủi ro nằm ngay trong bảng tính</strong> — không phải báo cáo rủi ro tách riêng.<br><br>Từ <strong>kiến trúc mô hình tích hợp</strong> (giả định, nút chuyển kịch bản) → <strong>mô hình 3 báo cáo &amp; độ nhạy</strong> → <strong>dòng tiền &amp; rủi ro dự án</strong> (DCF/NPV) → <strong>đo lường rủi ro</strong> (volatility, VaR) → <strong>danh mục &amp; tối ưu rủi ro-lợi nhuận</strong> → <strong>kịch bản &amp; stress test</strong> → <strong>rủi ro tín dụng &amp; định giá có rủi ro</strong> → <strong>dashboard ERM tích hợp</strong> cho ra quyết định.<br><br>Bám theo giáo trình FLM, trích dẫn Benninga (<em>Financial Modeling</em>), Jorion (<em>Value at Risk</em>) và Hull (<em>Risk Management and Financial Institutions</em>). Song ngữ, có ví dụ công thức Excel (GIẢ ĐỊNH) và quiz mỗi chương.',
    whatYouLearn: 'Kiến trúc mô hình tích hợp rủi ro (assumptions, quy tắc một công thức, nút chuyển circularity, ScenarioID); liên kết 3 báo cáo & balance check; Data Table 1/2-chiều & tornado chart; DCF/NPV/IRR, RADR & Certainty Equivalent, cây quyết định; volatility & annualisation; VaR tham số & lịch sử, Expected Shortfall; phương sai danh mục Markowitz, đường biên hiệu quả, Sharpe ratio, Solver; Scenario Manager, stress test & reverse stress test, covenant; PD/LGD/EAD, Expected Loss, Altman Z-score, DCF điều chỉnh tín dụng; dashboard ERM một trang & RAROC.',
    requirements: 'Đã học một môn mô hình hoá tài chính cơ bản (ví dụ FIM302c) hoặc biết dựng mô hình 3 báo cáo trên Excel; kiến thức thống kê cơ bản (trung bình, độ lệch chuẩn); Excel có Data Table, Scenario Manager, Solver.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Mô hình tích hợp rủi ro là gì; phân biệt FIM302c/FMS301/FRM301.', lessons: [intro] },
    { title: 'Chương 1 — Mô hình tích hợp rủi ro tổng quan|||Chapter 1 — Integrated model overview', description: 'Assumptions, quy tắc một công thức, circularity, ScenarioID.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Mô hình 3 báo cáo & độ nhạy|||Chapter 2 — 3-statement model & sensitivity', description: 'Liên kết 3 báo cáo, balance check, Data Table, tornado.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Dòng tiền & rủi ro dự án|||Chapter 3 — Cash flow & project risk', description: 'DCF/NPV/IRR, RADR, Certainty Equivalent, cây quyết định.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Đo lường rủi ro trong mô hình|||Chapter 4 — Risk measurement (VaR)', description: 'Volatility, VaR tham số & lịch sử, Expected Shortfall.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Mô hình danh mục & tối ưu rủi ro-lợi nhuận|||Chapter 5 — Portfolio & optimisation', description: 'Markowitz, đường biên hiệu quả, Sharpe ratio, Solver.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Kịch bản & stress testing|||Chapter 6 — Scenario & stress testing', description: 'Scenario Manager, stress test, reverse stress test, covenant.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Rủi ro tín dụng & định giá có rủi ro|||Chapter 7 — Credit risk & valuation', description: 'PD/LGD/EAD, Expected Loss, Altman Z-score, DCF tín dụng.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Mô hình ERM tích hợp & báo cáo|||Chapter 8 — Integrated ERM & reporting', description: 'Dashboard rủi ro, khung COSO, RAROC.', lessons: [c8, c8q] },
  ],
};
