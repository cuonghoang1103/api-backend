/**
 * BFC301 — Credit Analysis and Loan Management. Giáo trình FLM (khối Quản trị
 * Kinh doanh, kỳ 5): tín dụng ngân hàng, 5C, phân tích báo cáo tài chính
 * người vay, chấm điểm & xếp hạng tín dụng, thẩm định & phê duyệt khoản vay,
 * tài sản bảo đảm & cấu trúc khoản vay, giám sát & xử lý nợ xấu, Basel
 * III/khung NHNN. Song ngữ + ví dụ (số giả định) + quiz. Giữ NGUYÊN
 * slug/semester/thumb của stub. ⚠️ KHÔNG backtick/${; tránh dấu "<" trần.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('bfc301-0-1-overview', 'Course overview: Credit analysis and loan management|||Tổng quan môn học: Phân tích tín dụng và quản lý khoản vay',
  'Tín dụng ngân hàng, vai trò phân tích tín dụng, lộ trình môn học.',
  [[
    `<span class="eyebrow">BFC301 · Lesson 0.1 · Overview</span>
<h2>Credit Analysis and Loan Management</h2>
<p class="lead">This course teaches you how a bank decides <strong>who to lend to, how much, and on what terms</strong> — the analytical and process discipline behind every loan on a bank balance sheet. You will learn to read a borrower like a lender, structure a loan that survives a downturn, and recognize the early warning signs of a bad one.</p>
<h3>Why credit analysis matters</h3>
<ul>
<li><strong>Credit risk</strong> is the single largest risk most banks carry — the chance a borrower fails to repay principal or interest as agreed.</li>
<li>A single mis-priced or badly structured loan can erase the profit of hundreds of good ones.</li>
<li>Regulators (Basel III, and in Vietnam the SBV/NHNN) hold banks to minimum capital and provisioning standards precisely because of this risk.</li>
</ul>
<h3>Roadmap</h3>
<p>Role of credit in banking &amp; the credit life cycle → the 5Cs framework → borrower financial statement analysis → credit scoring &amp; rating → loan origination &amp; approval workflow → collateral &amp; loan structuring → monitoring &amp; non-performing loan (NPL) workout → credit risk governance under Basel III / SBV rules.</p>`,
    `<span class="eyebrow">BFC301 · Bài 0.1 · Tổng quan</span>
<h2>Phân tích tín dụng và quản lý khoản vay</h2>
<p class="lead">Môn này dạy cách một ngân hàng quyết định <strong>cho ai vay, vay bao nhiêu, và theo điều kiện nào</strong> — kỷ luật phân tích và quy trình đứng sau mọi khoản vay trên bảng cân đối ngân hàng. Bạn sẽ học đọc khách hàng vay như một người cho vay thực thụ, cấu trúc khoản vay sống sót qua suy thoái, và nhận ra dấu hiệu cảnh báo sớm của một khoản vay xấu.</p>
<h3>Vì sao phân tích tín dụng quan trọng</h3>
<ul>
<li><strong>Rủi ro tín dụng</strong> là rủi ro lớn nhất mà hầu hết ngân hàng gánh chịu — khả năng khách hàng không trả được gốc hoặc lãi như cam kết.</li>
<li>Một khoản vay định giá sai hoặc cấu trúc kém có thể xoá sạch lợi nhuận của hàng trăm khoản vay tốt.</li>
<li>Cơ quan quản lý (Basel III, và tại Việt Nam là NHNN) buộc ngân hàng giữ vốn tối thiểu và trích lập dự phòng chính vì rủi ro này.</li>
</ul>
<h3>Lộ trình</h3>
<p>Vai trò tín dụng &amp; vòng đời khoản vay → khung 5C → phân tích báo cáo tài chính người vay → chấm điểm &amp; xếp hạng tín dụng → quy trình thẩm định &amp; phê duyệt → tài sản bảo đảm &amp; cấu trúc khoản vay → giám sát &amp; xử lý nợ xấu (NPL) → quản trị rủi ro tín dụng theo Basel III / khung NHNN.</p>`,
  ]]);

const c1 = doc('bfc301-1-1-tong-quan-tin-dung', '1.1 — Overview of bank credit & the role of the credit analyst|||1.1 — Tổng quan tín dụng ngân hàng & vai trò của chuyên viên tín dụng',
  'Sản phẩm tín dụng, vòng đời khoản vay, ba tuyến phòng thủ.',
  [[
    `<span class="eyebrow">BFC301 · Chapter 1 · Lesson 1.1</span>
<h2>Bank credit: an overview &amp; the role of the credit analyst</h2>
<h3>What bank credit is</h3>
<p><strong>Credit</strong> is a bank lending money (or a promise to pay, e.g. a guarantee) today in exchange for a promise of repayment plus interest later. Common products: <strong>working capital loans</strong> (short-term, funds an operating cycle), <strong>term loans</strong> (multi-year, funds fixed assets), <strong>trade finance</strong> (letters of credit, guarantees), <strong>overdrafts</strong>, and <strong>retail credit</strong> (mortgages, credit cards, auto loans).</p>
<h3>The credit life cycle</h3>
<pre><code>Origination -> Underwriting/analysis -> Approval -> Documentation &amp; disbursement
    -> Monitoring (during the loan term) -> Repayment or Workout (if it turns bad)
</code></pre>
<h3>Who does what</h3>
<ul>
<li><strong>Relationship manager (RM)</strong> — sources the deal, gathers information, is the client-facing owner.</li>
<li><strong>Credit analyst</strong> — independently assesses the risk: financials, industry, collateral, and writes the credit memo.</li>
<li><strong>Credit committee</strong> — approves or declines based on the memo, within a delegated approval authority.</li>
</ul>
<h3>Three lines of defense</h3>
<p>1) The business line (RM) that takes the risk. 2) Independent risk management (credit analysis, credit committee) that assesses and controls it. 3) Internal audit that checks both. Separating these keeps origination pressure from overriding risk judgment — a classic cause of credit losses.</p>
<div class="callout"><span class="badge">Core idea</span> Every lending decision balances two questions: can this borrower repay, and what happens to the bank if the borrower cannot?</div>`,
    `<span class="eyebrow">BFC301 · Chương 1 · Bài 1.1</span>
<h2>Tín dụng ngân hàng: tổng quan &amp; vai trò của chuyên viên tín dụng</h2>
<h3>Tín dụng ngân hàng là gì</h3>
<p><strong>Tín dụng</strong> là việc ngân hàng cho vay tiền (hoặc cam kết trả thay, vd bảo lãnh) ngay hôm nay để đổi lấy lời hứa hoàn trả gốc cộng lãi sau này. Sản phẩm phổ biến: <strong>vay vốn lưu động</strong> (ngắn hạn, tài trợ chu kỳ kinh doanh), <strong>vay trung/dài hạn</strong> (tài trợ tài sản cố định), <strong>tài trợ thương mại</strong> (thư tín dụng, bảo lãnh), <strong>thấu chi</strong>, và <strong>tín dụng bán lẻ</strong> (vay mua nhà, thẻ tín dụng, vay mua xe).</p>
<h3>Vòng đời một khoản tín dụng</h3>
<pre><code>Khởi tạo hồ sơ -> Thẩm định/phân tích -> Phê duyệt -> Ký hợp đồng &amp; giải ngân
    -> Giám sát (trong suốt thời hạn vay) -> Thu nợ hoặc Xử lý nợ (nếu chuyển xấu)
</code></pre>
<h3>Ai làm gì</h3>
<ul>
<li><strong>Chuyên viên quan hệ khách hàng (RM)</strong> — tìm khách hàng, thu thập thông tin, đầu mối tiếp xúc khách hàng.</li>
<li><strong>Chuyên viên phân tích tín dụng</strong> — độc lập đánh giá rủi ro: tài chính, ngành, tài sản bảo đảm, và soạn credit memo (tờ trình tín dụng).</li>
<li><strong>Hội đồng tín dụng</strong> — phê duyệt hoặc từ chối dựa trên tờ trình, trong hạn mức phê duyệt được phân cấp.</li>
</ul>
<h3>Ba tuyến phòng thủ</h3>
<p>1) Đơn vị kinh doanh (RM) — nơi chấp nhận rủi ro. 2) Bộ phận quản lý rủi ro độc lập (phân tích tín dụng, hội đồng tín dụng) — nơi đánh giá và kiểm soát rủi ro. 3) Kiểm toán nội bộ — kiểm tra cả hai tuyến trên. Tách bạch các tuyến này giúp áp lực tìm kiếm khách hàng không lấn át đánh giá rủi ro — nguyên nhân kinh điển gây tổn thất tín dụng.</p>
<div class="callout"><span class="badge">Ý tưởng cốt lõi</span> Mọi quyết định cho vay đều cân bằng hai câu hỏi: khách hàng này có trả được nợ không, và nếu không trả được thì ngân hàng chịu hậu quả gì?</div>`,
  ]]);

const c1q = quiz('bfc301-quiz-1', 'Quiz 1 — Overview of bank credit|||Quiz 1 — Tổng quan tín dụng ngân hàng', [
  { id: 'q1', question: 'Thứ tự đúng của vòng đời một khoản tín dụng là?', options: ['Giải ngân -> Khởi tạo -> Phê duyệt -> Giám sát', 'Khởi tạo -> Thẩm định -> Phê duyệt -> Giải ngân -> Giám sát', 'Giám sát -> Phê duyệt -> Khởi tạo -> Giải ngân', 'Phê duyệt -> Khởi tạo -> Giám sát -> Giải ngân'], correctIndex: 1, explanation: 'Vòng đời tín dụng đi từ khởi tạo hồ sơ, thẩm định, phê duyệt, giải ngân, rồi giám sát trong suốt thời hạn vay.' },
  { id: 'q2', question: 'Ai độc lập đánh giá rủi ro và soạn credit memo (tờ trình tín dụng)?', options: ['Chuyên viên quan hệ khách hàng (RM)', 'Chuyên viên phân tích tín dụng', 'Chính khách hàng vay', 'Kiểm toán nội bộ'], correctIndex: 1, explanation: 'Chuyên viên phân tích tín dụng đánh giá độc lập tài chính, ngành, tài sản bảo đảm và soạn tờ trình cho hội đồng tín dụng.' },
  { id: 'q3', question: 'Mô hình "ba tuyến phòng thủ" tách biệt điều gì?', options: ['Tách khách hàng lớn và khách hàng nhỏ', 'Tách đơn vị chấp nhận rủi ro, đơn vị kiểm soát rủi ro, và kiểm toán nội bộ', 'Tách khoản vay ngắn hạn và dài hạn', 'Tách chi nhánh và hội sở'], correctIndex: 1, explanation: 'Ba tuyến: đơn vị kinh doanh chấp nhận rủi ro, quản lý rủi ro độc lập kiểm soát, kiểm toán nội bộ kiểm tra cả hai.' },
]);

const c2 = doc('bfc301-2-1-5c', '2.1 — The 5Cs of credit analysis|||2.1 — Nguyên tắc 5C trong phân tích tín dụng',
  '5C: Character, Capacity, Capital, Collateral, Conditions.',
  [[
    `<span class="eyebrow">BFC301 · Chapter 2 · Lesson 2.1</span>
<h2>The 5Cs of credit analysis</h2>
<p>The <strong>5Cs</strong> is the classic qualitative framework lenders use to judge a borrower before ever running a ratio.</p>
<pre><code>Character   -> Willingness to repay: credit history, management reputation, track record
Capacity    -> Ability to repay: cash flow, income stability, debt service coverage
Capital     -> Skin in the game: owner equity invested, net worth, leverage
Collateral  -> Secondary source of repayment if cash flow fails: assets pledged
Conditions  -> External environment: industry outlook, economic cycle, loan purpose &amp; terms
</code></pre>
<h3>Character &amp; Capacity: the two that matter most</h3>
<p>Capacity is usually the primary source of repayment — repayment should come from ongoing cash flow, not from selling collateral. Character predicts whether a technically capable borrower will actually choose to repay when it is inconvenient.</p>
<h3>Worked example (assumed numbers)</h3>
<pre><code>Borrower: retail trading company requests a 2,000,000,000 VND working capital loan
 Character:  5-year banking relationship, no history of late payment -> good
 Capacity:   average monthly operating cash flow 250,000,000 VND, monthly debt service 90,000,000 VND
             -> debt service coverage looks comfortable
 Capital:    owner equity is 40% of total assets -> moderate cushion
 Collateral: warehouse pledged, appraised at 3,500,000,000 VND -> covers the loan
 Conditions: retail sector stable this year, loan purpose is seasonal inventory build -> reasonable
</code></pre>
<div class="callout"><span class="badge">Rule of thumb</span> Collateral is a backup plan, not a reason to lend — a loan approved mainly on collateral, with weak capacity, is a warning sign, not a strength.</div>`,
    `<span class="eyebrow">BFC301 · Chương 2 · Bài 2.1</span>
<h2>Nguyên tắc 5C trong phân tích tín dụng</h2>
<p><strong>5C</strong> là khung định tính kinh điển mà người cho vay dùng để đánh giá khách hàng trước cả khi tính bất kỳ chỉ số tài chính nào.</p>
<pre><code>Character (Tư cách) -> Thiện chí trả nợ: lịch sử tín dụng, uy tín ban lãnh đạo, quá trình hoạt động
Capacity (Năng lực)  -> Khả năng trả nợ: dòng tiền, thu nhập ổn định, khả năng trả nợ vay
Capital (Vốn)        -> Mức độ cam kết: vốn chủ sở hữu đã đầu tư, giá trị ròng, đòn bẩy
Collateral (Bảo đảm) -> Nguồn trả nợ thứ hai nếu dòng tiền không đủ: tài sản thế chấp
Conditions (Điều kiện)-> Môi trường bên ngoài: triển vọng ngành, chu kỳ kinh tế, mục đích &amp; điều kiện vay
</code></pre>
<h3>Character &amp; Capacity: hai yếu tố quan trọng nhất</h3>
<p>Capacity thường là nguồn trả nợ chính — việc trả nợ nên đến từ dòng tiền hoạt động liên tục, không phải từ việc bán tài sản bảo đảm. Character dự đoán liệu một khách hàng đủ năng lực về mặt kỹ thuật có thực sự chọn trả nợ khi điều đó bất tiện hay không.</p>
<h3>Ví dụ minh hoạ (số giả định)</h3>
<pre><code>Khách hàng: công ty thương mại bán lẻ đề nghị vay vốn lưu động 2.000.000.000 VND
 Character:  quan hệ ngân hàng 5 năm, chưa từng trễ hạn -> tốt
 Capacity:   dòng tiền hoạt động trung bình 250.000.000 VND/tháng, nghĩa vụ nợ 90.000.000 VND/tháng
             -> khả năng trả nợ khá thoải mái
 Capital:    vốn chủ sở hữu chiếm 40% tổng tài sản -> đệm an toàn vừa phải
 Collateral: kho hàng thế chấp, định giá 3.500.000.000 VND -> đủ che khoản vay
 Conditions: ngành bán lẻ ổn định năm nay, mục đích vay là tích trữ hàng theo mùa -> hợp lý
</code></pre>
<div class="callout"><span class="badge">Quy tắc kinh nghiệm</span> Tài sản bảo đảm là phương án dự phòng, không phải lý do để cho vay — một khoản vay được duyệt chủ yếu dựa vào tài sản bảo đảm trong khi năng lực trả nợ yếu là dấu hiệu cảnh báo, không phải điểm mạnh.</div>`,
  ]]);

const c2q = quiz('bfc301-quiz-2', 'Quiz 2 — The 5Cs|||Quiz 2 — Nguyên tắc 5C', [
  { id: 'q1', question: 'Yếu tố 5C nào nói về khả năng trả nợ từ dòng tiền hoạt động?', options: ['Character', 'Capacity', 'Collateral', 'Conditions'], correctIndex: 1, explanation: 'Capacity (Năng lực) đo khả năng trả nợ từ dòng tiền, thu nhập ổn định.' },
  { id: 'q2', question: 'Trong khung 5C, tài sản bảo đảm (Collateral) đóng vai trò gì?', options: ['Nguồn trả nợ chính, thay cho dòng tiền', 'Nguồn trả nợ thứ hai, dự phòng nếu dòng tiền không đủ', 'Chỉ dùng để tính lãi suất', 'Không liên quan đến quyết định cho vay'], correctIndex: 1, explanation: 'Collateral là phương án dự phòng — nguồn trả nợ thứ hai, không phải nguồn trả nợ chính.' },
  { id: 'q3', question: 'Một khoản vay được duyệt chủ yếu vì tài sản bảo đảm tốt trong khi dòng tiền yếu là dấu hiệu gì?', options: ['Khoản vay an toàn tuyệt đối', 'Dấu hiệu cảnh báo rủi ro', 'Không cần giám sát thêm', 'Nên tăng thêm hạn mức'], correctIndex: 1, explanation: 'Dựa chủ yếu vào tài sản bảo đảm thay vì năng lực trả nợ là một cảnh báo, không phải điểm mạnh.' },
]);

const c3 = doc('bfc301-3-1-financial-statement', '3.1 — Analyzing the borrower financial statements|||3.1 — Phân tích báo cáo tài chính người vay',
  'Thanh khoản, đòn bẩy, khả năng sinh lời, DSCR.',
  [[
    `<span class="eyebrow">BFC301 · Chapter 3 · Lesson 3.1</span>
<h2>Analyzing the borrower financial statements</h2>
<h3>Four ratio families</h3>
<ul>
<li><strong>Liquidity</strong> — can short-term obligations be met? Current ratio = Current assets / Current liabilities.</li>
<li><strong>Leverage</strong> — how much debt funds the business? Debt-to-equity = Total debt / Equity.</li>
<li><strong>Profitability</strong> — Return on assets (ROA) = Net income / Total assets; Return on equity (ROE) = Net income / Equity.</li>
<li><strong>Coverage</strong> — can operating cash flow service the debt? Debt Service Coverage Ratio (DSCR) = Operating cash flow / (Principal + interest due).</li>
</ul>
<h3>Worked example (assumed numbers)</h3>
<pre><code>Current assets = 6,000,000,000 | Current liabilities = 4,000,000,000
 Current ratio = 6,000,000,000 / 4,000,000,000 = 1.5x  (above 1.0x is generally acceptable)

Total debt = 8,000,000,000 | Equity = 5,000,000,000
 Debt-to-equity = 8,000,000,000 / 5,000,000,000 = 1.6x

Operating cash flow = 1,200,000,000 | Annual principal + interest due = 800,000,000
 DSCR = 1,200,000,000 / 800,000,000 = 1.5x  (lenders typically want a DSCR of 1.2x or higher)
</code></pre>
<h3>Beyond the ratios</h3>
<p>Ratios describe a snapshot; a lender reads at least 3 years of trend, checks the quality of earnings (one-off gains, related-party transactions), and cross-checks the numbers against tax filings and bank statements — a spreadsheet accepts whatever is typed into it.</p>
<div class="callout"><span class="badge">Cash flow, not accounting profit, repays loans</span> A profitable company can still default if profit is tied up in receivables or inventory and cash never arrives.</div>`,
    `<span class="eyebrow">BFC301 · Chương 3 · Bài 3.1</span>
<h2>Phân tích báo cáo tài chính người vay</h2>
<h3>Bốn nhóm chỉ số</h3>
<ul>
<li><strong>Thanh khoản</strong> — có đáp ứng được nghĩa vụ ngắn hạn không? Current ratio (hệ số thanh toán hiện hành) = Tài sản ngắn hạn / Nợ ngắn hạn.</li>
<li><strong>Đòn bẩy</strong> — bao nhiêu phần hoạt động được tài trợ bằng nợ? Debt-to-equity = Tổng nợ / Vốn chủ sở hữu.</li>
<li><strong>Khả năng sinh lời</strong> — ROA (Return on assets) = Lợi nhuận ròng / Tổng tài sản; ROE (Return on equity) = Lợi nhuận ròng / Vốn chủ sở hữu.</li>
<li><strong>Khả năng trả nợ</strong> — dòng tiền hoạt động có đủ trả nợ không? DSCR (Debt Service Coverage Ratio) = Dòng tiền hoạt động / (Gốc + lãi phải trả).</li>
</ul>
<h3>Ví dụ minh hoạ (số giả định)</h3>
<pre><code>Tài sản ngắn hạn = 6.000.000.000 | Nợ ngắn hạn = 4.000.000.000
 Current ratio = 6.000.000.000 / 4.000.000.000 = 1,5 lần  (trên 1,0 lần thường được chấp nhận)

Tổng nợ = 8.000.000.000 | Vốn chủ sở hữu = 5.000.000.000
 Debt-to-equity = 8.000.000.000 / 5.000.000.000 = 1,6 lần

Dòng tiền hoạt động = 1.200.000.000 | Gốc + lãi phải trả trong năm = 800.000.000
 DSCR = 1.200.000.000 / 800.000.000 = 1,5 lần  (ngân hàng thường muốn DSCR từ 1,2 lần trở lên)
</code></pre>
<h3>Xa hơn các chỉ số</h3>
<p>Chỉ số chỉ mô tả một lát cắt thời điểm; người cho vay đọc xu hướng ít nhất 3 năm, kiểm tra chất lượng lợi nhuận (khoản lãi bất thường, giao dịch bên liên quan), và đối chiếu số liệu với hồ sơ thuế và sao kê ngân hàng — một bảng tính chấp nhận bất kỳ con số nào được gõ vào nó.</p>
<div class="callout"><span class="badge">Dòng tiền, không phải lợi nhuận kế toán, trả được nợ</span> Một công ty có lãi vẫn có thể vỡ nợ nếu lợi nhuận nằm ở khoản phải thu hoặc hàng tồn kho và tiền chưa bao giờ về thực tế.</div>`,
  ]]);

const c3q = quiz('bfc301-quiz-3', 'Quiz 3 — Financial statement analysis|||Quiz 3 — Phân tích báo cáo tài chính', [
  { id: 'q1', question: 'DSCR (Debt Service Coverage Ratio) đo điều gì?', options: ['Tỉ lệ nợ trên vốn chủ sở hữu', 'Khả năng dòng tiền hoạt động trả gốc và lãi', 'Tỉ suất sinh lời trên tài sản', 'Tỉ lệ tài sản ngắn hạn trên nợ ngắn hạn'], correctIndex: 1, explanation: 'DSCR = Dòng tiền hoạt động / (Gốc + lãi phải trả), đo khả năng trả nợ từ dòng tiền.' },
  { id: 'q2', question: 'Với tài sản ngắn hạn 6 tỷ và nợ ngắn hạn 4 tỷ đồng, current ratio là?', options: ['0,67 lần', '1,0 lần', '1,5 lần', '4,0 lần'], correctIndex: 2, explanation: 'Current ratio = 6.000.000.000 / 4.000.000.000 = 1,5 lần.' },
  { id: 'q3', question: 'Vì sao một công ty có lợi nhuận kế toán cao vẫn có thể không trả được nợ?', options: ['Vì lợi nhuận luôn bằng tiền mặt', 'Vì lợi nhuận có thể nằm ở khoản phải thu/hàng tồn kho, tiền chưa về', 'Vì current ratio luôn thấp', 'Vì ROE luôn âm'], correctIndex: 1, explanation: 'Lợi nhuận kế toán không đồng nghĩa có tiền mặt — dòng tiền mới thực sự trả được nợ.' },
]);

const c4 = doc('bfc301-4-1-credit-scoring', '4.1 — Credit scoring & credit rating|||4.1 — Chấm điểm & xếp hạng tín dụng',
  'Chấm điểm tín dụng, xếp hạng, định giá theo rủi ro.',
  [[
    `<span class="eyebrow">BFC301 · Chapter 4 · Lesson 4.1</span>
<h2>Credit scoring &amp; credit rating</h2>
<h3>Scoring vs rating</h3>
<p><strong>Credit scoring</strong> (mostly retail/SME) reduces many factors to one number using a statistical or point-based model — fast, consistent, good for high volume. <strong>Credit rating</strong> (mostly corporate) is a judgmental grade (e.g. AAA down to D) built by an analyst or agency, blending quantitative ratios with qualitative judgment.</p>
<h3>A simplified point-based scorecard (assumed weights)</h3>
<pre><code>Factor                      Weight   Score band (0-100)
Repayment history           30%      100 = never late  ... 0 = history of default
Debt Service Coverage       25%      100 = DSCR 2.0x or higher ... 0 = DSCR below 1.0x
Leverage (debt/equity)      20%      100 = below 0.5x ... 0 = above 3.0x
Collateral coverage         15%      100 = fully secured ... 0 = unsecured
Industry/Conditions         10%      100 = low-risk sector ... 0 = high-risk sector

Example borrower: 85, 70, 60, 90, 75 (weighted) -> total score 76 -> Rating "BB - acceptable risk"
</code></pre>
<h3>From rating to pricing</h3>
<p>A worse rating usually means: higher interest margin, more collateral required, tighter covenants, or the loan is declined outright. This is <strong>risk-based pricing</strong> — the seed of what Chapter 8 formalizes into Probability of Default (PD), Loss Given Default (LGD) and Exposure at Default (EAD).</p>
<div class="callout"><span class="badge">A rating is a forecast, not a fact</span> It should be reviewed at least once a year, and immediately after any material bad news about the borrower.</div>`,
    `<span class="eyebrow">BFC301 · Chương 4 · Bài 4.1</span>
<h2>Chấm điểm &amp; xếp hạng tín dụng</h2>
<h3>Chấm điểm vs xếp hạng</h3>
<p><strong>Chấm điểm tín dụng (credit scoring)</strong> (chủ yếu bán lẻ/SME) quy nhiều yếu tố thành một con số bằng mô hình thống kê hoặc chấm điểm — nhanh, nhất quán, phù hợp khối lượng lớn. <strong>Xếp hạng tín dụng (credit rating)</strong> (chủ yếu doanh nghiệp) là một hạng đánh giá định tính (vd từ AAA xuống D) do chuyên viên hoặc tổ chức xếp hạng xây dựng, kết hợp chỉ số định lượng với nhận định định tính.</p>
<h3>Bảng điểm đơn giản hoá (trọng số giả định)</h3>
<pre><code>Yếu tố                      Trọng số   Thang điểm (0-100)
Lịch sử trả nợ               30%       100 = chưa từng trễ hạn ... 0 = từng vỡ nợ
Khả năng trả nợ (DSCR)       25%       100 = DSCR từ 2,0 lần trở lên ... 0 = DSCR dưới 1,0 lần
Đòn bẩy (nợ/vốn CSH)         20%       100 = dưới 0,5 lần ... 0 = trên 3,0 lần
Mức độ bảo đảm               15%       100 = bảo đảm đầy đủ ... 0 = không có bảo đảm
Ngành/Điều kiện              10%       100 = ngành rủi ro thấp ... 0 = ngành rủi ro cao

Ví dụ khách hàng: 85, 70, 60, 90, 75 (theo trọng số) -> tổng điểm 76 -> Xếp hạng "BB - rủi ro chấp nhận được"
</code></pre>
<h3>Từ xếp hạng đến định giá</h3>
<p>Xếp hạng càng thấp thường dẫn đến: biên lãi suất cao hơn, yêu cầu bảo đảm nhiều hơn, điều khoản ràng buộc (covenant) chặt hơn, hoặc bị từ chối cho vay. Đây là <strong>định giá theo rủi ro (risk-based pricing)</strong> — nền tảng mà Chương 8 sẽ hình thức hoá thành Xác suất vỡ nợ (PD), Tỉ lệ tổn thất khi vỡ nợ (LGD) và Dư nợ tại thời điểm vỡ nợ (EAD).</p>
<div class="callout"><span class="badge">Xếp hạng là một dự báo, không phải sự thật cố định</span> Cần đánh giá lại ít nhất mỗi năm một lần, và ngay lập tức khi có tin xấu trọng yếu về khách hàng.</div>`,
  ]]);

const c4q = quiz('bfc301-quiz-4', 'Quiz 4 — Credit scoring & rating|||Quiz 4 — Chấm điểm & xếp hạng tín dụng', [
  { id: 'q1', question: 'Chấm điểm tín dụng (credit scoring) thường dùng cho phân khúc nào?', options: ['Doanh nghiệp lớn duy nhất', 'Bán lẻ/SME khối lượng lớn', 'Chỉ trái phiếu chính phủ', 'Chỉ giao dịch liên ngân hàng'], correctIndex: 1, explanation: 'Scoring phù hợp khối lượng lớn, cần tốc độ và tính nhất quán — điển hình ở bán lẻ/SME.' },
  { id: 'q2', question: 'Xếp hạng tín dụng thấp hơn thường dẫn tới điều gì?', options: ['Lãi suất thấp hơn và ít điều kiện hơn', 'Lãi suất cao hơn, yêu cầu thêm bảo đảm, covenant chặt hơn', 'Không ảnh hưởng gì đến điều kiện vay', 'Ngân hàng bắt buộc phải duyệt vay'], correctIndex: 1, explanation: 'Rủi ro cao hơn (xếp hạng thấp hơn) được bù đắp bằng giá cao hơn và điều kiện chặt hơn — định giá theo rủi ro.' },
  { id: 'q3', question: 'Khi nào cần đánh giá lại xếp hạng tín dụng của khách hàng ngay, không chờ chu kỳ định kỳ?', options: ['Khi khách hàng đổi số điện thoại', 'Khi có tin xấu trọng yếu về khách hàng', 'Khi lãi suất thị trường tăng nhẹ', 'Không bao giờ cần đánh giá lại'], correctIndex: 1, explanation: 'Tin xấu trọng yếu (sự kiện ảnh hưởng khả năng trả nợ) đòi hỏi đánh giá lại xếp hạng ngay lập tức.' },
]);

const c5 = doc('bfc301-5-1-loan-origination', '5.1 — Loan origination & the approval workflow|||5.1 — Quy trình thẩm định & phê duyệt khoản vay',
  'Credit memo, hạn mức phê duyệt, điều kiện giải ngân.',
  [[
    `<span class="eyebrow">BFC301 · Chapter 5 · Lesson 5.1</span>
<h2>Loan origination &amp; the approval workflow</h2>
<h3>From application to disbursement</h3>
<pre><code>1. Application intake        - purpose, amount, tenor requested
2. KYC &amp; document collection - legal, financial statements, tax, ownership
3. Credit analysis           - 5Cs, ratios, scoring/rating (Chapters 2-4)
4. Credit memo               - analyst recommendation + conditions
5. Credit committee approval - within delegated authority, or escalate upward
6. Loan agreement &amp; covenants - legal documentation signed
7. Disbursement              - funds released, often against conditions precedent
</code></pre>
<h3>What a credit memo contains</h3>
<ul>
<li>Borrower &amp; facility summary (amount, tenor, purpose, pricing).</li>
<li>Financial analysis and the 5Cs assessment.</li>
<li>Risk rating and proposed covenants/conditions.</li>
<li>Analyst recommendation: approve, approve with conditions, or decline.</li>
</ul>
<h3>Delegated authority</h3>
<p>Banks set approval limits by seniority — a branch manager may approve small facilities alone; larger or riskier ones escalate to a regional or head-office credit committee. This keeps big risks in front of more experienced, more independent judgment.</p>
<div class="callout"><span class="badge">Conditions precedent</span> Funds are usually released only after conditions are met — e.g. collateral registered, insurance in place, guarantee signed. Skipping this step is a common operational-risk loss.</div>`,
    `<span class="eyebrow">BFC301 · Chương 5 · Bài 5.1</span>
<h2>Quy trình thẩm định &amp; phê duyệt khoản vay</h2>
<h3>Từ tiếp nhận hồ sơ đến giải ngân</h3>
<pre><code>1. Tiếp nhận hồ sơ          - mục đích, số tiền, kỳ hạn đề nghị vay
2. Thu thập hồ sơ &amp; KYC     - pháp lý, báo cáo tài chính, thuế, sở hữu
3. Phân tích tín dụng       - 5C, các chỉ số, chấm điểm/xếp hạng (Chương 2-4)
4. Tờ trình tín dụng        - đề xuất của chuyên viên + điều kiện kèm theo
5. Phê duyệt hội đồng tín dụng - trong hạn mức phân cấp, hoặc trình cấp cao hơn
6. Ký hợp đồng &amp; điều khoản  - hoàn tất hồ sơ pháp lý
7. Giải ngân                - giải ngân sau khi đáp ứng điều kiện tiên quyết
</code></pre>
<h3>Tờ trình tín dụng (credit memo) gồm những gì</h3>
<ul>
<li>Tóm tắt khách hàng &amp; khoản cấp tín dụng (số tiền, kỳ hạn, mục đích, lãi suất).</li>
<li>Phân tích tài chính và đánh giá theo 5C.</li>
<li>Xếp hạng rủi ro và đề xuất điều khoản/điều kiện ràng buộc.</li>
<li>Đề xuất của chuyên viên: duyệt, duyệt có điều kiện, hoặc từ chối.</li>
</ul>
<h3>Hạn mức phê duyệt phân cấp</h3>
<p>Ngân hàng đặt hạn mức phê duyệt theo cấp bậc — trưởng chi nhánh có thể tự duyệt khoản nhỏ; khoản lớn hoặc rủi ro cao hơn phải trình lên hội đồng tín dụng khu vực hoặc hội sở. Cách này đảm bảo rủi ro lớn được xét duyệt bởi cấp có kinh nghiệm và độc lập hơn.</p>
<div class="callout"><span class="badge">Điều kiện tiên quyết (conditions precedent)</span> Tiền thường chỉ được giải ngân sau khi đáp ứng điều kiện — vd tài sản bảo đảm đã đăng ký, đã mua bảo hiểm, đã ký bảo lãnh. Bỏ qua bước này là nguyên nhân phổ biến gây tổn thất rủi ro vận hành.</div>`,
  ]]);

const c5q = quiz('bfc301-quiz-5', 'Quiz 5 — Loan origination & approval|||Quiz 5 — Thẩm định & phê duyệt khoản vay', [
  { id: 'q1', question: 'Bước nào diễn ra NGAY TRƯỚC khi hội đồng tín dụng phê duyệt?', options: ['Giải ngân', 'Soạn tờ trình tín dụng (credit memo)', 'Ký hợp đồng', 'Giám sát khoản vay'], correctIndex: 1, explanation: 'Tờ trình tín dụng được soạn xong rồi mới trình hội đồng tín dụng xét duyệt.' },
  { id: 'q2', question: 'Tờ trình tín dụng KHÔNG bắt buộc phải có nội dung nào sau đây?', options: ['Phân tích tài chính và đánh giá 5C', 'Đề xuất của chuyên viên (duyệt/từ chối)', 'Kế hoạch marketing của khách hàng', 'Xếp hạng rủi ro và điều kiện kèm theo'], correctIndex: 2, explanation: 'Kế hoạch marketing của khách hàng không phải nội dung cốt lõi của tờ trình tín dụng.' },
  { id: 'q3', question: '"Điều kiện tiên quyết" (conditions precedent) trong giải ngân nghĩa là gì?', options: ['Điều kiện phải đáp ứng trước khi tiền được giải ngân', 'Điều kiện chỉ áp dụng sau khi trả hết nợ', 'Một loại lãi suất ưu đãi', 'Một loại tài sản bảo đảm duy nhất'], correctIndex: 0, explanation: 'Conditions precedent là các điều kiện phải hoàn tất (đăng ký bảo đảm, bảo hiểm...) trước khi giải ngân.' },
]);

const c6 = doc('bfc301-6-1-collateral-structuring', '6.1 — Collateral & loan structuring|||6.1 — Tài sản bảo đảm & cấu trúc khoản vay',
  'Loại tài sản bảo đảm, LTV, kỳ hạn, covenant.',
  [[
    `<span class="eyebrow">BFC301 · Chapter 6 · Lesson 6.1</span>
<h2>Collateral &amp; loan structuring</h2>
<h3>Types of collateral</h3>
<ul>
<li><strong>Real estate</strong> — land, buildings; commonly the most stable and liquid form.</li>
<li><strong>Movable assets</strong> — machinery, vehicles, inventory; depreciate and are harder to value and liquidate.</li>
<li><strong>Receivables</strong> — assigned accounts receivable; quality depends on debtor concentration and aging.</li>
<li><strong>Guarantees</strong> — a third party (parent company, individual) promises to pay if the borrower cannot.</li>
</ul>
<h3>Loan-to-value (LTV)</h3>
<pre><code>LTV = Loan amount / Collateral appraised value

Example: Loan 3,000,000,000 VND, collateral appraised at 5,000,000,000 VND
 LTV = 3,000,000,000 / 5,000,000,000 = 60%   (a lower LTV means more cushion for the bank)
</code></pre>
<h3>Structuring the loan</h3>
<ul>
<li><strong>Tenor</strong> — match the loan term to the useful life of what it funds (short-term inventory, long-term equipment).</li>
<li><strong>Amortization schedule</strong> — equal installments vs a bullet payment at maturity; a bullet concentrates repayment risk at one date.</li>
<li><strong>Covenants</strong> — financial (e.g. maintain a DSCR of 1.2x or higher, keep leverage at or below 2.0x) and non-financial (e.g. no additional debt without consent) promises that trigger review or default when broken.</li>
</ul>
<div class="callout"><span class="badge">Structure controls risk that pricing alone cannot</span> A well-structured loan with the right tenor, amortization and covenants can be safer than a higher-priced but loosely structured one.</div>`,
    `<span class="eyebrow">BFC301 · Chương 6 · Bài 6.1</span>
<h2>Tài sản bảo đảm &amp; cấu trúc khoản vay</h2>
<h3>Các loại tài sản bảo đảm</h3>
<ul>
<li><strong>Bất động sản</strong> — đất, công trình; thường là hình thức ổn định và thanh khoản nhất.</li>
<li><strong>Động sản</strong> — máy móc, phương tiện, hàng tồn kho; mất giá theo thời gian và khó định giá, khó xử lý hơn.</li>
<li><strong>Khoản phải thu</strong> — quyền đòi nợ được chuyển nhượng; chất lượng phụ thuộc mức tập trung và tuổi nợ của khách nợ.</li>
<li><strong>Bảo lãnh</strong> — bên thứ ba (công ty mẹ, cá nhân) cam kết trả thay nếu khách hàng không trả được.</li>
</ul>
<h3>Tỉ lệ cho vay trên giá trị tài sản (LTV)</h3>
<pre><code>LTV = Số tiền vay / Giá trị tài sản bảo đảm được định giá

Ví dụ: Vay 3.000.000.000 VND, tài sản bảo đảm định giá 5.000.000.000 VND
 LTV = 3.000.000.000 / 5.000.000.000 = 60%   (LTV càng thấp, đệm an toàn cho ngân hàng càng lớn)
</code></pre>
<h3>Cấu trúc khoản vay</h3>
<ul>
<li><strong>Kỳ hạn</strong> — khớp thời hạn vay với vòng đời hữu ích của thứ được tài trợ (hàng tồn kho ngắn hạn, máy móc dài hạn).</li>
<li><strong>Lịch trả nợ</strong> — trả góp đều theo kỳ so với trả một lần (bullet) khi đáo hạn; trả một lần dồn toàn bộ rủi ro trả nợ vào một thời điểm.</li>
<li><strong>Covenant (điều khoản ràng buộc)</strong> — tài chính (vd duy trì DSCR từ 1,2 lần trở lên, giữ đòn bẩy ở mức 2,0 lần trở xuống) và phi tài chính (vd không vay thêm nợ khi chưa được đồng ý) — vi phạm sẽ kích hoạt xem xét lại hoặc coi là vi phạm hợp đồng.</li>
</ul>
<div class="callout"><span class="badge">Cấu trúc kiểm soát rủi ro mà giá cả một mình không làm được</span> Một khoản vay được cấu trúc tốt — đúng kỳ hạn, đúng lịch trả nợ, đúng covenant — có thể an toàn hơn một khoản vay lãi suất cao nhưng cấu trúc lỏng lẻo.</div>`,
  ]]);

const c6q = quiz('bfc301-quiz-6', 'Quiz 6 — Collateral & loan structuring|||Quiz 6 — Tài sản bảo đảm & cấu trúc khoản vay', [
  { id: 'q1', question: 'Với khoản vay 3 tỷ và tài sản bảo đảm định giá 5 tỷ đồng, LTV là?', options: ['40%', '60%', '80%', '150%'], correctIndex: 1, explanation: 'LTV = 3.000.000.000 / 5.000.000.000 = 60%.' },
  { id: 'q2', question: 'Covenant (điều khoản ràng buộc) trong hợp đồng vay dùng để làm gì?', options: ['Tăng lãi suất mỗi tháng tự động', 'Đặt điều kiện tài chính/phi tài chính, vi phạm sẽ kích hoạt xem xét lại hoặc vi phạm hợp đồng', 'Chỉ áp dụng cho khoản vay tiêu dùng cá nhân', 'Thay thế hoàn toàn cho tài sản bảo đảm'], correctIndex: 1, explanation: 'Covenant là cam kết duy trì các chỉ số/điều kiện nhất định trong suốt thời hạn vay.' },
  { id: 'q3', question: 'So với lịch trả góp đều theo kỳ, khoản vay trả một lần (bullet) khi đáo hạn có đặc điểm gì?', options: ['Rủi ro trả nợ dàn đều theo thời gian', 'Rủi ro trả nợ dồn vào một thời điểm duy nhất', 'Không có rủi ro trả nợ', 'Luôn an toàn hơn trả góp'], correctIndex: 1, explanation: 'Trả một lần (bullet) dồn toàn bộ nghĩa vụ trả nợ gốc vào ngày đáo hạn, tập trung rủi ro tại một thời điểm.' },
]);

const c7 = doc('bfc301-7-1-monitoring-npl', '7.1 — Loan monitoring & non-performing loan (NPL) management|||7.1 — Quản lý & giám sát khoản vay, xử lý nợ xấu (NPL)',
  'Cảnh báo sớm, phân loại nợ NHNN, xử lý nợ xấu.',
  [[
    `<span class="eyebrow">BFC301 · Chapter 7 · Lesson 7.1</span>
<h2>Loan monitoring &amp; non-performing loan (NPL) management</h2>
<h3>Ongoing monitoring</h3>
<ul>
<li><strong>Covenant compliance</strong> — checked at each reporting period (quarterly/annually).</li>
<li><strong>Account conduct</strong> — overdrafts, late payments, bounced checks are early signals.</li>
<li><strong>Periodic review</strong> — full re-analysis of the borrower, typically annually or on facility renewal.</li>
</ul>
<h3>Early warning indicators</h3>
<p>Declining sales, stretched payment to suppliers, frequent management or ownership changes, unexplained large related-party transactions, and repeated requests to extend or restructure are classic red flags analysts are trained to catch early — well before a payment is actually missed.</p>
<h3>Loan classification (Vietnam, per SBV/NHNN groups)</h3>
<pre><code>Group 1 - Pass/Current              - on time
Group 2 - Special mention           - overdue 10-90 days
Group 3 - Substandard               - overdue 91-180 days
Group 4 - Doubtful                  - overdue 181-360 days
Group 5 - Loss                      - overdue more than 360 days

NPL ratio = (Group 3 + Group 4 + Group 5) / Total outstanding loans
</code></pre>
<h3>Workout options once a loan turns bad</h3>
<p><strong>Restructuring</strong> (extend tenor, reduce rate, grace period), <strong>debt sale</strong> (to an asset management company such as VAMC in Vietnam), and <strong>collateral foreclosure</strong> (last resort — slow, costly, and value-destructive compared to a cooperative restructuring).</p>
<div class="callout"><span class="badge">Provisioning</span> Banks must set aside loan loss provisions once a loan is classified into groups 2-5 — the worse the group, the higher the required provision rate.</div>`,
    `<span class="eyebrow">BFC301 · Chương 7 · Bài 7.1</span>
<h2>Quản lý &amp; giám sát khoản vay, xử lý nợ xấu (NPL)</h2>
<h3>Giám sát thường xuyên</h3>
<ul>
<li><strong>Tuân thủ covenant</strong> — kiểm tra tại mỗi kỳ báo cáo (quý/năm).</li>
<li><strong>Hành vi tài khoản</strong> — thấu chi, trễ hạn, séc bị từ chối là tín hiệu sớm.</li>
<li><strong>Rà soát định kỳ</strong> — phân tích lại toàn diện khách hàng, thường mỗi năm hoặc khi gia hạn hạn mức.</li>
</ul>
<h3>Chỉ báo cảnh báo sớm</h3>
<p>Doanh thu sụt giảm, kéo dài thời gian trả nợ nhà cung cấp, ban lãnh đạo hoặc chủ sở hữu thay đổi liên tục, giao dịch bên liên quan lớn không rõ lý do, và liên tục xin gia hạn hoặc cơ cấu lại nợ là những dấu hiệu cảnh báo kinh điển mà chuyên viên tín dụng được đào tạo để phát hiện sớm — trước khi khoản vay thực sự bị trễ hạn.</p>
<h3>Phân loại nợ (Việt Nam, theo nhóm nợ NHNN)</h3>
<pre><code>Nhóm 1 - Nợ đủ tiêu chuẩn       - đúng hạn
Nhóm 2 - Nợ cần chú ý           - quá hạn 10-90 ngày
Nhóm 3 - Nợ dưới tiêu chuẩn     - quá hạn 91-180 ngày
Nhóm 4 - Nợ nghi ngờ            - quá hạn 181-360 ngày
Nhóm 5 - Nợ có khả năng mất vốn - quá hạn trên 360 ngày

Tỉ lệ nợ xấu (NPL ratio) = (Nhóm 3 + Nhóm 4 + Nhóm 5) / Tổng dư nợ
</code></pre>
<h3>Các phương án xử lý khi khoản vay chuyển xấu</h3>
<p><strong>Cơ cấu lại nợ</strong> (gia hạn kỳ hạn, giảm lãi suất, ân hạn), <strong>bán nợ</strong> (cho công ty quản lý tài sản như VAMC tại Việt Nam), và <strong>phát mại tài sản bảo đảm</strong> (phương án cuối cùng — chậm, tốn kém, và làm mất giá trị nhiều hơn so với cơ cấu lại nợ có hợp tác).</p>
<div class="callout"><span class="badge">Trích lập dự phòng</span> Ngân hàng phải trích lập dự phòng rủi ro khi khoản vay bị phân loại vào nhóm 2-5 — nhóm nợ càng xấu, tỉ lệ trích lập dự phòng bắt buộc càng cao.</div>`,
  ]]);

const c7q = quiz('bfc301-quiz-7', 'Quiz 7 — Monitoring & NPL management|||Quiz 7 — Giám sát khoản vay & xử lý nợ xấu', [
  { id: 'q1', question: 'Khoản nợ quá hạn 91-180 ngày thuộc nhóm nào theo phân loại NHNN?', options: ['Nhóm 2 - Nợ cần chú ý', 'Nhóm 3 - Nợ dưới tiêu chuẩn', 'Nhóm 4 - Nợ nghi ngờ', 'Nhóm 5 - Nợ có khả năng mất vốn'], correctIndex: 1, explanation: 'Quá hạn 91-180 ngày ứng với Nhóm 3 - Nợ dưới tiêu chuẩn.' },
  { id: 'q2', question: 'Tỉ lệ nợ xấu (NPL ratio) được tính bằng?', options: ['(Nhóm 1 + Nhóm 2) / Tổng dư nợ', '(Nhóm 3 + Nhóm 4 + Nhóm 5) / Tổng dư nợ', 'Nhóm 5 / Vốn chủ sở hữu', 'Tổng dư nợ / Vốn điều lệ'], correctIndex: 1, explanation: 'NPL ratio gồm các nhóm nợ xấu thực sự: Nhóm 3, 4, 5, chia cho tổng dư nợ.' },
  { id: 'q3', question: 'Phương án nào là LỰA CHỌN CUỐI CÙNG khi xử lý một khoản nợ xấu?', options: ['Cơ cấu lại nợ (gia hạn, giảm lãi)', 'Bán nợ cho công ty quản lý tài sản', 'Phát mại tài sản bảo đảm', 'Tăng thêm hạn mức cho khách hàng'], correctIndex: 2, explanation: 'Phát mại tài sản bảo đảm chậm, tốn kém và mất giá trị hơn, nên là phương án cuối cùng sau khi các cách khác không hiệu quả.' },
]);

const c8 = doc('bfc301-8-1-basel-sbv', '8.1 — Credit risk governance: Basel III & the SBV framework|||8.1 — Quản trị rủi ro tín dụng: khung Basel III & NHNN',
  'CAR, PD/LGD/EAD, ba trụ cột Basel III, khung NHNN.',
  [[
    `<span class="eyebrow">BFC301 · Chapter 8 · Lesson 8.1</span>
<h2>Credit risk governance: Basel III &amp; the SBV framework</h2>
<h3>The three pillars of Basel III</h3>
<ul>
<li><strong>Pillar 1 — Minimum capital requirements</strong>: banks must hold capital proportional to risk-weighted assets (RWA).</li>
<li><strong>Pillar 2 — Supervisory review</strong>: regulators assess whether a bank capital is adequate for its actual risk profile, beyond the Pillar 1 minimum.</li>
<li><strong>Pillar 3 — Market discipline</strong>: banks must disclose enough risk information for the market to judge them.</li>
</ul>
<h3>Capital Adequacy Ratio (CAR)</h3>
<pre><code>CAR = (Tier 1 capital + Tier 2 capital) / Risk-weighted assets (RWA)

Basel III minimum CAR = 8%  (plus a capital conservation buffer of 2.5%)
Example: Capital = 1,200,000,000,000 VND | RWA = 10,000,000,000,000 VND
 CAR = 1,200,000,000,000 / 10,000,000,000,000 = 12%  -> above the 8% minimum
</code></pre>
<h3>PD, LGD, EAD — the building blocks of expected loss</h3>
<pre><code>Expected Loss (EL) = PD x LGD x EAD

PD  (Probability of Default)  - likelihood the borrower defaults within a horizon (e.g. 1 year)
LGD (Loss Given Default)      - portion of exposure not recovered after default
EAD (Exposure at Default)     - the outstanding amount at the moment of default
</code></pre>
<h3>Vietnam: the SBV framework</h3>
<p>The State Bank of Vietnam (SBV/NHNN) sets local rules mirroring Basel principles: minimum CAR, loan classification and provisioning circulars (Chapter 7), and — for banks adopting the internal ratings-based (IRB) approach — their own PD/LGD/EAD models validated by the regulator.</p>
<div class="callout"><span class="badge">Why this closes the course</span> Every earlier chapter — the 5Cs, ratios, scoring, structuring, monitoring — ultimately feeds one number regulators and management both watch: how much capital does the bank need to hold against the credit risk it has taken on.</div>`,
    `<span class="eyebrow">BFC301 · Chương 8 · Bài 8.1</span>
<h2>Quản trị rủi ro tín dụng: khung Basel III &amp; NHNN</h2>
<h3>Ba trụ cột của Basel III</h3>
<ul>
<li><strong>Trụ cột 1 — Yêu cầu vốn tối thiểu</strong>: ngân hàng phải giữ vốn tương ứng với tài sản có rủi ro (RWA).</li>
<li><strong>Trụ cột 2 — Rà soát giám sát</strong>: cơ quan quản lý đánh giá vốn ngân hàng có đủ so với hồ sơ rủi ro thực tế hay không, ngoài mức tối thiểu của Trụ cột 1.</li>
<li><strong>Trụ cột 3 — Kỷ luật thị trường</strong>: ngân hàng phải công bố đủ thông tin rủi ro để thị trường tự đánh giá.</li>
</ul>
<h3>Tỉ lệ an toàn vốn (CAR)</h3>
<pre><code>CAR = (Vốn cấp 1 + Vốn cấp 2) / Tài sản có rủi ro (RWA)

Basel III yêu cầu CAR tối thiểu 8%  (cộng thêm vùng đệm bảo toàn vốn 2,5%)
Ví dụ: Vốn = 1.200.000.000.000 VND | RWA = 10.000.000.000.000 VND
 CAR = 1.200.000.000.000 / 10.000.000.000.000 = 12%  -> cao hơn mức tối thiểu 8%
</code></pre>
<h3>PD, LGD, EAD — các cấu phần của tổn thất kỳ vọng</h3>
<pre><code>Tổn thất kỳ vọng (Expected Loss) = PD x LGD x EAD

PD  (Xác suất vỡ nợ)              - khả năng khách hàng vỡ nợ trong một khoảng thời gian (vd 1 năm)
LGD (Tỉ lệ tổn thất khi vỡ nợ)    - phần dư nợ không thu hồi được sau khi vỡ nợ
EAD (Dư nợ tại thời điểm vỡ nợ)   - số dư nợ tại đúng thời điểm khách hàng vỡ nợ
</code></pre>
<h3>Việt Nam: khung của Ngân hàng Nhà nước</h3>
<p>Ngân hàng Nhà nước Việt Nam (SBV/NHNN) đặt ra quy định trong nước phản ánh nguyên tắc Basel: CAR tối thiểu, thông tư về phân loại nợ và trích lập dự phòng (Chương 7), và — với ngân hàng áp dụng phương pháp xếp hạng nội bộ (IRB) — mô hình PD/LGD/EAD riêng được cơ quan quản lý phê duyệt.</p>
<div class="callout"><span class="badge">Vì sao chương này khép lại môn học</span> Mọi chương trước đó — 5C, các chỉ số, chấm điểm, cấu trúc khoản vay, giám sát — cuối cùng đều dồn vào một con số mà cả cơ quan quản lý lẫn ban lãnh đạo ngân hàng cùng theo dõi: ngân hàng cần giữ bao nhiêu vốn cho rủi ro tín dụng đã nhận.</div>`,
  ]]);

const c8q = quiz('bfc301-quiz-8', 'Quiz 8 — Basel III & SBV framework|||Quiz 8 — Khung Basel III & NHNN', [
  { id: 'q1', question: 'Basel III yêu cầu tỉ lệ an toàn vốn (CAR) tối thiểu bao nhiêu, chưa tính vùng đệm bảo toàn vốn?', options: ['4%', '6%', '8%', '12%'], correctIndex: 2, explanation: 'Basel III đặt mức CAR tối thiểu 8%, cộng thêm vùng đệm bảo toàn vốn 2,5%.' },
  { id: 'q2', question: 'Công thức tính Tổn thất kỳ vọng (Expected Loss) là?', options: ['PD + LGD + EAD', 'PD x LGD x EAD', 'PD / LGD / EAD', 'PD - LGD + EAD'], correctIndex: 1, explanation: 'Expected Loss = PD x LGD x EAD — xác suất vỡ nợ nhân tỉ lệ tổn thất nhân dư nợ tại thời điểm vỡ nợ.' },
  { id: 'q3', question: 'Trụ cột nào của Basel III yêu cầu ngân hàng công bố đủ thông tin rủi ro để thị trường tự đánh giá?', options: ['Trụ cột 1 - Yêu cầu vốn tối thiểu', 'Trụ cột 2 - Rà soát giám sát', 'Trụ cột 3 - Kỷ luật thị trường', 'Không trụ cột nào yêu cầu công bố thông tin'], correctIndex: 2, explanation: 'Trụ cột 3 (Market discipline) yêu cầu minh bạch thông tin rủi ro để thị trường giám sát ngân hàng.' },
]);

const taiLieu = doc('bfc301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Giáo trình FLM, sách tham khảo, tài liệu chính thức, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">BFC301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Credit Analysis and Loan Management — the 5Cs, financial statement analysis, scoring &amp; rating, loan structuring, NPL management, and Basel III — in one place. The full official slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources plus the reference textbooks used in the curriculum (cited, not uploaded).</p>
<h3>📗 Reference textbooks (cited — not uploaded)</h3>
<ul>
<li><em>Credit Risk Management</em> — Joetta Colquitt (McGraw-Hill Education)</li>
<li><em>The Bank Credit Analysis Handbook</em> — Jonathan Golin &amp; Philippe Delhaise (Wiley)</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.bis.org/bcbs/basel3.htm" target="_blank" rel="noopener">Basel III: international regulatory framework for banks (BIS)</a></li>
<li><a href="https://www.sbv.gov.vn" target="_blank" rel="noopener">State Bank of Vietnam (SBV/NHNN)</a> — official circulars on loan classification &amp; provisioning</li>
<li><a href="https://www.investopedia.com/terms/c/creditanalysis.asp" target="_blank" rel="noopener">Investopedia — Credit Analysis</a></li>
<li><a href="https://corporatefinanceinstitute.com/resources/commercial-lending/credit-analysis-process/" target="_blank" rel="noopener">Corporate Finance Institute — Credit Analysis Process</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@corporatefinanceinstitute" target="_blank" rel="noopener">Corporate Finance Institute (CFI)</a> — credit &amp; lending tutorials</li>
<li><a href="https://www.youtube.com/@WallStreetPrep" target="_blank" rel="noopener">Wall Street Prep</a> — financial statement &amp; ratio analysis</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.bis.org/basel_framework/index.htm" target="_blank" rel="noopener">BIS Basel Framework (searchable)</a> — full text of Basel III standards</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — the 5Cs, key ratios (liquidity, leverage, profitability, DSCR), and the loan approval workflow.</li>
<li><strong>Practice</strong> — analyze a sample financial statement and compute the ratios until they match a worked answer key.</li>
<li><strong>Go deeper</strong> — credit scoring/rating, collateral &amp; loan structuring, NPL classification &amp; workout.</li>
<li><strong>Job-ready</strong> — read Basel III/SBV requirements, draft a mock credit memo, and practice defending a lending recommendation.</li>
</ol></div>`,
    `<span class="eyebrow">BFC301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Phân tích tín dụng và Quản lý khoản vay — 5C, phân tích báo cáo tài chính, chấm điểm &amp; xếp hạng, cấu trúc khoản vay, xử lý nợ xấu, và Basel III — gom về một chỗ. Slide &amp; đề cương chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp cùng các sách giáo trình được dùng trong khung chương trình (trích dẫn, không tải file lên).</p>
<h3>📗 Sách giáo trình tham khảo (trích dẫn — không tải file)</h3>
<ul>
<li><em>Credit Risk Management</em> — Joetta Colquitt (McGraw-Hill Education)</li>
<li><em>The Bank Credit Analysis Handbook</em> — Jonathan Golin &amp; Philippe Delhaise (Wiley)</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.bis.org/bcbs/basel3.htm" target="_blank" rel="noopener">Basel III: khung quy định quốc tế cho ngân hàng (BIS)</a></li>
<li><a href="https://www.sbv.gov.vn" target="_blank" rel="noopener">Ngân hàng Nhà nước Việt Nam (SBV/NHNN)</a> — thông tư chính thức về phân loại nợ &amp; trích lập dự phòng</li>
<li><a href="https://www.investopedia.com/terms/c/creditanalysis.asp" target="_blank" rel="noopener">Investopedia — Credit Analysis</a></li>
<li><a href="https://corporatefinanceinstitute.com/resources/commercial-lending/credit-analysis-process/" target="_blank" rel="noopener">Corporate Finance Institute — Credit Analysis Process</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@corporatefinanceinstitute" target="_blank" rel="noopener">Corporate Finance Institute (CFI)</a> — hướng dẫn tín dụng &amp; cho vay</li>
<li><a href="https://www.youtube.com/@WallStreetPrep" target="_blank" rel="noopener">Wall Street Prep</a> — phân tích báo cáo tài chính &amp; chỉ số</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.bis.org/basel_framework/index.htm" target="_blank" rel="noopener">BIS Basel Framework (tra cứu được)</a> — toàn văn chuẩn Basel III</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — 5C, các chỉ số chính (thanh khoản, đòn bẩy, khả năng sinh lời, DSCR), và quy trình phê duyệt khoản vay.</li>
<li><strong>Luyện tập</strong> — phân tích một báo cáo tài chính mẫu và tính các chỉ số đến khi khớp đáp án mẫu.</li>
<li><strong>Đào sâu thực tế</strong> — chấm điểm/xếp hạng tín dụng, tài sản bảo đảm &amp; cấu trúc khoản vay, phân loại &amp; xử lý nợ xấu.</li>
<li><strong>Sẵn sàng đi làm</strong> — đọc yêu cầu Basel III/NHNN, soạn thử một tờ trình tín dụng, và tập bảo vệ đề xuất cho vay.</li>
</ol></div>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'BFC301',
    slug: 'bfc301-credit-analysis-and-loan-management',
    title: 'Credit analysis and loan management',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/BFC301.webp',
    shortDescription: 'Bank credit analysis & loan management: the 5Cs, borrower financial analysis, credit scoring & rating, loan approval, collateral & structuring, monitoring & NPL workout, risk governance under Basel III & SBV rules.|||Phân tích tín dụng ngân hàng & quản lý khoản vay: 5C, phân tích tài chính người vay, chấm điểm & xếp hạng tín dụng, thẩm định & phê duyệt vay, tài sản bảo đảm & cấu trúc vay, giám sát & xử lý nợ xấu, quản trị rủi ro theo Basel III & NHNN.',
    description: 'Môn <strong>BFC301 — Credit Analysis and Loan Management</strong> (kỳ 5) trang bị cách một ngân hàng ra quyết định <strong>cho ai vay, vay bao nhiêu, và theo điều kiện nào</strong>. Từ <strong>vai trò tín dụng &amp; vòng đời khoản vay</strong> → <strong>nguyên tắc 5C</strong> (Character, Capacity, Capital, Collateral, Conditions) → <strong>phân tích báo cáo tài chính người vay</strong> (thanh khoản, đòn bẩy, khả năng trả nợ) → <strong>chấm điểm &amp; xếp hạng tín dụng</strong> → <strong>quy trình thẩm định &amp; phê duyệt</strong> → <strong>tài sản bảo đảm &amp; cấu trúc khoản vay</strong> → <strong>giám sát khoản vay &amp; xử lý nợ xấu (NPL)</strong> → <strong>quản trị rủi ro tín dụng theo Basel III &amp; khung NHNN</strong>. Bám sát giáo trình FLM, song ngữ, có ví dụ tính toán (số giả định) và quiz mỗi chương.',
    whatYouLearn: 'Vai trò tín dụng & vòng đời khoản vay, ba tuyến phòng thủ; nguyên tắc 5C (Character, Capacity, Capital, Collateral, Conditions); đọc báo cáo tài chính người vay (current ratio, debt-to-equity, ROA/ROE, DSCR); chấm điểm & xếp hạng tín dụng, từ điểm số đến định giá theo rủi ro; quy trình thẩm định — credit memo, hạn mức phê duyệt phân cấp, điều kiện tiên quyết; tài sản bảo đảm, LTV, cấu trúc khoản vay & covenant; giám sát khoản vay, phân loại nợ theo nhóm NHNN, xử lý nợ xấu (NPL); CAR, PD/LGD/EAD và ba trụ cột Basel III.',
    requirements: 'Kiến thức tài chính doanh nghiệp cơ bản (đọc hiểu báo cáo tài chính) là một lợi thế nhưng không bắt buộc. Nên tham khảo thêm giáo trình chính thức trên FLM (flm.fpt.edu.vn).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình FLM, sách tham khảo, tài liệu chính thức, YouTube, công cụ, lộ trình tự học.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Tín dụng ngân hàng, vai trò phân tích tín dụng, lộ trình môn học.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan tín dụng ngân hàng|||Chapter 1 — Overview of bank credit', description: 'Sản phẩm tín dụng, vòng đời khoản vay, ba tuyến phòng thủ.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Nguyên tắc 5C|||Chapter 2 — The 5Cs framework', description: '5C: Character, Capacity, Capital, Collateral, Conditions.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Phân tích báo cáo tài chính người vay|||Chapter 3 — Borrower financial statement analysis', description: 'Thanh khoản, đòn bẩy, khả năng sinh lời, DSCR.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Chấm điểm & xếp hạng tín dụng|||Chapter 4 — Credit scoring & rating', description: 'Chấm điểm tín dụng, xếp hạng, định giá theo rủi ro.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Thẩm định & phê duyệt khoản vay|||Chapter 5 — Loan origination & approval', description: 'Credit memo, hạn mức phê duyệt, điều kiện giải ngân.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Tài sản bảo đảm & cấu trúc khoản vay|||Chapter 6 — Collateral & loan structuring', description: 'Loại tài sản bảo đảm, LTV, kỳ hạn, covenant.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Giám sát khoản vay & xử lý nợ xấu|||Chapter 7 — Loan monitoring & NPL management', description: 'Cảnh báo sớm, phân loại nợ NHNN, xử lý nợ xấu.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Quản trị rủi ro tín dụng & Basel/NHNN|||Chapter 8 — Credit risk governance & Basel/SBV', description: 'CAR, PD/LGD/EAD, ba trụ cột Basel III, khung NHNN.', lessons: [c8, c8q] },
  ],
};
