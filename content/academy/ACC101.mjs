/**
 * ACC101 — Principles of Accounting (Nguyên lý kế toán). Giáo trình FLM (syl 14030):
 * Wild, Kwok & Venkatesh — Fundamental Accounting Principles (McGraw Hill): ch1–6, 8–11
 * + thuế GTGT Việt Nam (CLO4). Song ngữ + ví dụ số (đã kiểm cân) + bài tập có lời giải + quiz.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('acc101-0-1-overview', 'Course overview: Principles of Accounting|||Tổng quan: Nguyên lý kế toán',
  'Kế toán là gì, ai dùng thông tin kế toán, 6 chuẩn đầu ra theo đề cương FLM, lộ trình 5 phần, cách học và cách đánh giá.',
  [[
    `<span class="eyebrow">ACC101 · Lesson 0.1 · Overview</span>
<h2>Principles of Accounting</h2>
<p class="lead">Accounting is the <strong>language of business</strong>: an information system that <strong>identifies, records and communicates</strong> an organization's economic events to the people who make decisions. In this course you learn to read and write that language — from a single transaction to a complete set of financial statements.</p>
<h3>Who uses accounting information?</h3>
<ul>
<li><strong>Internal users</strong> — owners, managers, department heads. They plan, control and evaluate the business; serving them is the job of <em>managerial accounting</em>.</li>
<li><strong>External users</strong> — investors, lenders, suppliers, customers and the tax authority. They judge profitability and solvency from published reports; serving them is the job of <em>financial accounting</em>, the focus of this course.</li>
</ul>
<h3>Learning outcomes (FLM syllabus)</h3>
<table>
<tr><th>CLO</th><th>You will be able to…</th></tr>
<tr><td>CLO1</td><td>Explain the nature and purpose of financial statements for decision making</td></tr>
<tr><td>CLO2</td><td>Use the accounting equation to analyze how transactions affect the records and the statements</td></tr>
<tr><td>CLO3</td><td>Apply accounting concepts, principles and frameworks to analyze and communicate information</td></tr>
<tr><td>CLO4</td><td>Understand Value Added Tax and the Vietnamese accounting framework</td></tr>
<tr><td>CLO5</td><td>Develop a simple accounting budget</td></tr>
<tr><td>CLO6</td><td>Work self-reliantly, both independently and in teams</td></tr>
</table>
<h3>Roadmap</h3>
<table>
<tr><th>Part</th><th>Textbook chapters</th><th>Key question</th></tr>
<tr><td>1</td><td>Ch 1–2 · Accounting in business, recording transactions</td><td>How does a transaction change the accounting equation?</td></tr>
<tr><td>2</td><td>Ch 3–4 · Adjusting accounts, the accounting cycle</td><td>Why are the books "out of date" at the end of a period?</td></tr>
<tr><td>3</td><td>Ch 5–6 · Merchandising, inventories</td><td>What did the goods we sold actually cost?</td></tr>
<tr><td>4</td><td>Ch 8–11 · Cash, receivables, plant assets, liabilities, payroll + Vietnamese VAT</td><td>How do we protect and value assets, and what do we owe?</td></tr>
</table>
<p>Textbook: <em>Fundamental Accounting Principles</em> — Wild, Kwok &amp; Venkatesh (McGraw Hill). Assessment in the syllabus: participation 10%, two quizzes 10%, individual assignment 20%, group assignment 30%, final exam 30% (50 multiple-choice questions in 60 minutes).</p>
<div class="callout"><span class="badge">How to study</span> Learn one equation by heart — <strong>Assets = Liabilities + Equity</strong> — and check it after every transaction. Accounting is a skill: work each exercise by hand before you read the solution.</div>`,
    `<span class="eyebrow">ACC101 · Bài 0.1 · Tổng quan</span>
<h2>Nguyên lý kế toán</h2>
<p class="lead">Kế toán là <strong>ngôn ngữ của kinh doanh</strong>: một hệ thống thông tin <strong>nhận diện, ghi chép và truyền đạt</strong> các sự kiện kinh tế của một tổ chức tới những người ra quyết định. Trong môn này bạn học đọc và "viết" ngôn ngữ đó — từ một nghiệp vụ đơn lẻ tới một bộ báo cáo tài chính hoàn chỉnh.</p>
<h3>Ai dùng thông tin kế toán?</h3>
<ul>
<li><strong>Người dùng bên trong</strong> — chủ sở hữu, nhà quản lý, trưởng bộ phận. Họ lập kế hoạch, kiểm soát và đánh giá doanh nghiệp; phục vụ họ là việc của <em>kế toán quản trị</em>.</li>
<li><strong>Người dùng bên ngoài</strong> — nhà đầu tư, ngân hàng cho vay, nhà cung cấp, khách hàng và cơ quan thuế. Họ đánh giá khả năng sinh lời và khả năng thanh toán qua báo cáo được công bố; phục vụ họ là việc của <em>kế toán tài chính</em>, trọng tâm của môn này.</li>
</ul>
<h3>Chuẩn đầu ra (đề cương FLM)</h3>
<table>
<tr><th>CLO</th><th>Bạn sẽ có thể…</th></tr>
<tr><td>CLO1</td><td>Giải thích bản chất và mục đích của báo cáo tài chính trong việc ra quyết định</td></tr>
<tr><td>CLO2</td><td>Dùng phương trình kế toán để phân tích ảnh hưởng của nghiệp vụ tới sổ sách và báo cáo</td></tr>
<tr><td>CLO3</td><td>Vận dụng khái niệm, nguyên tắc và khuôn khổ kế toán để phân tích và truyền đạt thông tin</td></tr>
<tr><td>CLO4</td><td>Hiểu thuế giá trị gia tăng (GTGT) và khuôn khổ kế toán Việt Nam</td></tr>
<tr><td>CLO5</td><td>Lập được một ngân sách kế toán đơn giản</td></tr>
<tr><td>CLO6</td><td>Tự chủ khi làm việc độc lập và làm việc nhóm</td></tr>
</table>
<h3>Lộ trình</h3>
<table>
<tr><th>Phần</th><th>Chương giáo trình</th><th>Câu hỏi then chốt</th></tr>
<tr><td>1</td><td>Ch 1–2 · Kế toán trong kinh doanh, ghi chép nghiệp vụ</td><td>Một nghiệp vụ làm phương trình kế toán thay đổi thế nào?</td></tr>
<tr><td>2</td><td>Ch 3–4 · Điều chỉnh tài khoản, chu trình kế toán</td><td>Vì sao cuối kỳ sổ sách bị "lỗi thời"?</td></tr>
<tr><td>3</td><td>Ch 5–6 · Kế toán thương mại, hàng tồn kho</td><td>Hàng đã bán thực sự có giá vốn bao nhiêu?</td></tr>
<tr><td>4</td><td>Ch 8–11 · Tiền, phải thu, tài sản cố định, nợ phải trả, tiền lương + thuế GTGT Việt Nam</td><td>Bảo vệ và định giá tài sản thế nào, và ta đang nợ những gì?</td></tr>
</table>
<p>Giáo trình: <em>Fundamental Accounting Principles</em> — Wild, Kwok &amp; Venkatesh (McGraw Hill). Đánh giá theo đề cương: chuyên cần 10%, hai bài quiz 10%, bài tập cá nhân 20%, bài tập nhóm 30%, thi cuối kỳ 30% (50 câu trắc nghiệm trong 60 phút).</p>
<div class="callout"><span class="badge">Cách học</span> Thuộc lòng một phương trình — <strong>Tài sản = Nợ phải trả + Vốn chủ sở hữu</strong> — và kiểm lại sau mỗi nghiệp vụ. Kế toán là kỹ năng: tự làm từng bài tập bằng tay trước khi đọc lời giải.</div>`,
  ]]);

const c1 = doc('acc101-1-1-accounting-equation', '1.1 — Accounting in business & the accounting equation|||1.1 — Kế toán trong kinh doanh & phương trình kế toán',
  'Nguyên tắc và giả định kế toán (IFRS/GAAP/VAS), phương trình Tài sản = Nợ phải trả + Vốn chủ sở hữu, phân tích 8 nghiệp vụ, 4 báo cáo tài chính và thứ tự lập.',
  [[
    `<span class="eyebrow">ACC101 · Chapter 1 · Lesson 1.1</span>
<h2>Accounting in business &amp; the accounting equation</h2>
<h3>The rules of the game</h3>
<p>Financial statements follow generally accepted rules — <strong>IFRS</strong> internationally, <strong>US GAAP</strong> in the United States, and in Vietnam the <strong>Vietnamese Accounting Standards (VAS)</strong> together with the enterprise accounting regime issued by the Ministry of Finance. A handful of ideas sit underneath all of them:</p>
<table>
<tr><th>Concept</th><th>Meaning</th></tr>
<tr><td>Business entity</td><td>The business is separate from its owner — the owner's personal spending is not a business expense.</td></tr>
<tr><td>Going concern</td><td>Assume the business will keep operating, so assets are not reported at liquidation value.</td></tr>
<tr><td>Monetary unit &amp; time period</td><td>Record in one currency; report for fixed periods (month, quarter, year).</td></tr>
<tr><td>Measurement (cost) principle</td><td>Record assets at their actual cost when acquired.</td></tr>
<tr><td>Revenue recognition</td><td>Record revenue when it is earned (goods or services delivered), not when cash arrives.</td></tr>
<tr><td>Expense recognition (matching)</td><td>Record an expense in the period in which it helps generate revenue.</td></tr>
<tr><td>Full disclosure</td><td>Report everything that would change users' decisions, in the statements or in the notes.</td></tr>
</table>
<h3>The accounting equation</h3>
<p><strong>Assets = Liabilities + Equity.</strong> Assets are resources the business controls; liabilities are the claims of creditors; equity is the owner's claim. Equity grows with owner investments and revenues, and shrinks with withdrawals and expenses:</p>
<pre><code>Assets = Liabilities + Owner capital − Withdrawals + Revenues − Expenses</code></pre>
<p>Every transaction keeps the equation in balance. Example — a new service business in its first month:</p>
<table>
<tr><th>#</th><th>Transaction</th><th>Assets</th><th>Liabilities</th><th>Equity</th></tr>
<tr><td>1</td><td>Owner invests $20,000 cash</td><td>Cash +20,000</td><td></td><td>Capital +20,000</td></tr>
<tr><td>2</td><td>Buys equipment for $8,000 cash</td><td>Cash −8,000; Equipment +8,000</td><td></td><td></td></tr>
<tr><td>3</td><td>Buys supplies of $1,500 on credit</td><td>Supplies +1,500</td><td>Accounts payable +1,500</td><td></td></tr>
<tr><td>4</td><td>Provides services for $5,000 cash</td><td>Cash +5,000</td><td></td><td>Revenue +5,000</td></tr>
<tr><td>5</td><td>Provides services of $3,000 on credit</td><td>Accounts receivable +3,000</td><td></td><td>Revenue +3,000</td></tr>
<tr><td>6</td><td>Pays rent $1,200 and salaries $1,800</td><td>Cash −3,000</td><td></td><td>Expenses −3,000</td></tr>
<tr><td>7</td><td>Pays $500 to the supplier of transaction 3</td><td>Cash −500</td><td>Accounts payable −500</td><td></td></tr>
<tr><td>8</td><td>Owner withdraws $1,000 for personal use</td><td>Cash −1,000</td><td></td><td>Withdrawals −1,000</td></tr>
<tr><td></td><td><strong>Totals</strong></td><td><strong>25,000</strong></td><td><strong>1,000</strong></td><td><strong>24,000</strong></td></tr>
</table>
<p>Check: Cash 12,500 + Receivable 3,000 + Supplies 1,500 + Equipment 8,000 = <strong>25,000</strong> = Liabilities 1,000 + Equity 24,000 ✓</p>
<h3>The four financial statements</h3>
<pre><code>1. Income statement            Revenues 8,000 − Expenses 3,000 = Net income 5,000
2. Statement of owner's equity Capital 0 + Investment 20,000 + Net income 5,000
                               − Withdrawals 1,000 = 24,000
3. Balance sheet               Assets 25,000 = Liabilities 1,000 + Equity 24,000
4. Statement of cash flows     Operating +1,500 · Investing −8,000 · Financing +19,000
                               = Net change in cash +12,500</code></pre>
<p>They are prepared in this order because each one feeds the next: net income flows into equity, ending equity goes to the balance sheet, and the cash-flow statement explains how the cash line moved. (Operating cash: +5,000 from customers − 3,000 rent and salaries − 500 to the supplier.)</p>
<div class="callout"><span class="badge">In Vietnam</span> The statutory set under the enterprise accounting regime is the Balance sheet, the Income statement, the Cash flow statement and the Notes to the financial statements; changes in owner's equity are presented in the notes.</div>`,
    `<span class="eyebrow">ACC101 · Chương 1 · Bài 1.1</span>
<h2>Kế toán trong kinh doanh &amp; phương trình kế toán</h2>
<h3>Luật chơi</h3>
<p>Báo cáo tài chính tuân theo các chuẩn mực được thừa nhận chung — <strong>IFRS</strong> ở phạm vi quốc tế, <strong>US GAAP</strong> ở Mỹ, và ở Việt Nam là <strong>Chuẩn mực kế toán Việt Nam (VAS)</strong> cùng chế độ kế toán doanh nghiệp do Bộ Tài chính ban hành. Bên dưới tất cả là vài ý tưởng bạn sẽ dùng hằng ngày:</p>
<table>
<tr><th>Khái niệm</th><th>Ý nghĩa</th></tr>
<tr><td>Thực thể kinh doanh</td><td>Doanh nghiệp tách biệt với chủ sở hữu — chi tiêu cá nhân của chủ không phải chi phí của doanh nghiệp.</td></tr>
<tr><td>Hoạt động liên tục</td><td>Giả định doanh nghiệp sẽ tiếp tục hoạt động, nên tài sản không trình bày theo giá thanh lý.</td></tr>
<tr><td>Đơn vị tiền tệ &amp; kỳ kế toán</td><td>Ghi chép bằng một đơn vị tiền tệ; báo cáo theo các kỳ cố định (tháng, quý, năm).</td></tr>
<tr><td>Nguyên tắc giá gốc</td><td>Ghi nhận tài sản theo chi phí thực tế khi có được tài sản.</td></tr>
<tr><td>Ghi nhận doanh thu</td><td>Ghi doanh thu khi đã thực hiện (đã giao hàng hoặc cung cấp dịch vụ), không phải khi thu tiền.</td></tr>
<tr><td>Ghi nhận chi phí (phù hợp)</td><td>Ghi chi phí vào kỳ mà chi phí đó giúp tạo ra doanh thu.</td></tr>
<tr><td>Công khai đầy đủ</td><td>Trình bày mọi thông tin có thể làm thay đổi quyết định của người dùng, trên báo cáo hoặc trong thuyết minh.</td></tr>
</table>
<h3>Phương trình kế toán</h3>
<p><strong>Tài sản = Nợ phải trả + Vốn chủ sở hữu.</strong> Tài sản là nguồn lực doanh nghiệp kiểm soát; nợ phải trả là quyền đòi của chủ nợ; vốn chủ sở hữu là quyền của chủ sở hữu. Vốn chủ sở hữu tăng khi chủ góp vốn và khi có doanh thu, giảm khi chủ rút vốn và khi phát sinh chi phí:</p>
<pre><code>Tài sản = Nợ phải trả + Vốn góp − Rút vốn + Doanh thu − Chi phí</code></pre>
<p>Mọi nghiệp vụ đều giữ phương trình cân bằng. Ví dụ — một doanh nghiệp dịch vụ mới trong tháng đầu:</p>
<table>
<tr><th>#</th><th>Nghiệp vụ</th><th>Tài sản</th><th>Nợ phải trả</th><th>Vốn chủ sở hữu</th></tr>
<tr><td>1</td><td>Chủ góp vốn 20.000 $ tiền mặt</td><td>Tiền +20.000</td><td></td><td>Vốn góp +20.000</td></tr>
<tr><td>2</td><td>Mua thiết bị 8.000 $ trả tiền mặt</td><td>Tiền −8.000; Thiết bị +8.000</td><td></td><td></td></tr>
<tr><td>3</td><td>Mua vật tư 1.500 $ chưa trả tiền</td><td>Vật tư +1.500</td><td>Phải trả người bán +1.500</td><td></td></tr>
<tr><td>4</td><td>Cung cấp dịch vụ thu tiền mặt 5.000 $</td><td>Tiền +5.000</td><td></td><td>Doanh thu +5.000</td></tr>
<tr><td>5</td><td>Cung cấp dịch vụ 3.000 $ khách chưa trả</td><td>Phải thu khách hàng +3.000</td><td></td><td>Doanh thu +3.000</td></tr>
<tr><td>6</td><td>Trả tiền thuê 1.200 $ và lương 1.800 $</td><td>Tiền −3.000</td><td></td><td>Chi phí −3.000</td></tr>
<tr><td>7</td><td>Trả 500 $ cho nhà cung cấp ở nghiệp vụ 3</td><td>Tiền −500</td><td>Phải trả người bán −500</td><td></td></tr>
<tr><td>8</td><td>Chủ rút 1.000 $ tiêu dùng cá nhân</td><td>Tiền −1.000</td><td></td><td>Rút vốn −1.000</td></tr>
<tr><td></td><td><strong>Cộng</strong></td><td><strong>25.000</strong></td><td><strong>1.000</strong></td><td><strong>24.000</strong></td></tr>
</table>
<p>Kiểm tra: Tiền 12.500 + Phải thu 3.000 + Vật tư 1.500 + Thiết bị 8.000 = <strong>25.000</strong> = Nợ phải trả 1.000 + Vốn chủ sở hữu 24.000 ✓</p>
<h3>Bốn báo cáo tài chính</h3>
<pre><code>1. Báo cáo kết quả kinh doanh   Doanh thu 8.000 − Chi phí 3.000 = Lợi nhuận 5.000
2. Báo cáo vốn chủ sở hữu       Đầu kỳ 0 + Góp vốn 20.000 + Lợi nhuận 5.000
                                − Rút vốn 1.000 = 24.000
3. Bảng cân đối kế toán         Tài sản 25.000 = Nợ phải trả 1.000 + Vốn CSH 24.000
4. Báo cáo lưu chuyển tiền tệ   Kinh doanh +1.500 · Đầu tư −8.000 · Tài chính +19.000
                                = Tiền tăng thêm +12.500</code></pre>
<p>Các báo cáo được lập theo đúng thứ tự này vì báo cáo trước "nuôi" báo cáo sau: lợi nhuận chảy vào vốn chủ sở hữu, vốn cuối kỳ đưa lên bảng cân đối, còn báo cáo lưu chuyển tiền tệ giải thích dòng tiền đã thay đổi thế nào. (Tiền từ hoạt động kinh doanh: +5.000 thu khách − 3.000 thuê và lương − 500 trả nhà cung cấp.)</p>
<div class="callout"><span class="badge">Ở Việt Nam</span> Bộ báo cáo tài chính theo chế độ kế toán doanh nghiệp gồm Bảng cân đối kế toán, Báo cáo kết quả hoạt động kinh doanh, Báo cáo lưu chuyển tiền tệ và Thuyết minh báo cáo tài chính; biến động vốn chủ sở hữu được trình bày trong phần thuyết minh.</div>`,
  ]]);

const c2 = doc('acc101-1-2-double-entry', '1.2 — Recording transactions: debits, credits, journal & ledger|||1.2 — Ghi chép nghiệp vụ: Nợ, Có, nhật ký & sổ cái',
  'Tài khoản và hệ thống tài khoản Việt Nam, quy tắc Nợ/Có, ghi sổ kép, quy trình chứng từ → nhật ký → sổ cái → bảng cân đối thử và giới hạn của nó.',
  [[
    `<span class="eyebrow">ACC101 · Chapter 2 · Lesson 1.2</span>
<h2>Recording transactions: accounts, debits &amp; credits</h2>
<h3>Accounts and the chart of accounts</h3>
<p>An <strong>account</strong> records the increases and decreases of one item — Cash, Accounts receivable, Service revenue and so on. The list of all accounts a company uses is its <strong>chart of accounts</strong>. In Vietnam, account numbers are standardized by the accounting regime:</p>
<table>
<tr><th>Group</th><th>Typical accounts</th><th>Vietnamese chart (examples)</th></tr>
<tr><td>Assets</td><td>Cash, Cash in bank, Accounts receivable, Inventory, Equipment</td><td>111, 112, 131, 152 / 156, 211</td></tr>
<tr><td>Contra-asset</td><td>Accumulated depreciation</td><td>214</td></tr>
<tr><td>Liabilities</td><td>Accounts payable, Taxes payable, Salaries payable</td><td>331, 333, 334</td></tr>
<tr><td>Equity</td><td>Owner's capital, Retained earnings (undistributed profit)</td><td>411, 421</td></tr>
<tr><td>Revenues</td><td>Sales and service revenue</td><td>511</td></tr>
<tr><td>Expenses</td><td>Cost of goods sold, Selling expenses, Administrative expenses</td><td>632, 641, 642</td></tr>
</table>
<h3>Debit and credit</h3>
<p>A <strong>T-account</strong> has a left side called <strong>debit</strong> (Dr) and a right side called <strong>credit</strong> (Cr). "Debit" means neither good nor bad — only <em>left</em>. Which side increases an account depends on its type:</p>
<table>
<tr><th>Account type</th><th>Increase</th><th>Decrease</th><th>Normal balance</th></tr>
<tr><td>Assets</td><td>Debit</td><td>Credit</td><td>Debit</td></tr>
<tr><td>Expenses, Withdrawals</td><td>Debit</td><td>Credit</td><td>Debit</td></tr>
<tr><td>Liabilities</td><td>Credit</td><td>Debit</td><td>Credit</td></tr>
<tr><td>Owner's capital, Revenues</td><td>Credit</td><td>Debit</td><td>Credit</td></tr>
</table>
<p><strong>Double-entry accounting</strong>: every transaction is recorded with at least one debit and one credit, and <em>total debits = total credits</em>. That is exactly why the accounting equation always stays in balance.</p>
<h3>Journal → ledger → trial balance</h3>
<p>Source documents (invoices, receipts, bank slips) are first recorded in the <strong>journal</strong> in date order, then <strong>posted</strong> to each account in the <strong>ledger</strong>. The eight transactions of lesson 1.1 in journal form:</p>
<pre><code>(1) Dr Cash                   20,000
        Cr Owner capital               20,000
(2) Dr Equipment               8,000
        Cr Cash                         8,000
(3) Dr Supplies                1,500
        Cr Accounts payable             1,500
(4) Dr Cash                    5,000
        Cr Service revenue              5,000
(5) Dr Accounts receivable     3,000
        Cr Service revenue              3,000
(6) Dr Rent expense            1,200
    Dr Salaries expense        1,800
        Cr Cash                         3,000
(7) Dr Accounts payable          500
        Cr Cash                           500
(8) Dr Owner withdrawals       1,000
        Cr Cash                         1,000</code></pre>
<p>At the end of the period the ledger balances are listed in a <strong>trial balance</strong>:</p>
<table>
<tr><th>Account</th><th>Debit</th><th>Credit</th></tr>
<tr><td>Cash</td><td>12,500</td><td></td></tr>
<tr><td>Accounts receivable</td><td>3,000</td><td></td></tr>
<tr><td>Supplies</td><td>1,500</td><td></td></tr>
<tr><td>Equipment</td><td>8,000</td><td></td></tr>
<tr><td>Accounts payable</td><td></td><td>1,000</td></tr>
<tr><td>Owner capital</td><td></td><td>20,000</td></tr>
<tr><td>Owner withdrawals</td><td>1,000</td><td></td></tr>
<tr><td>Service revenue</td><td></td><td>8,000</td></tr>
<tr><td>Rent expense</td><td>1,200</td><td></td></tr>
<tr><td>Salaries expense</td><td>1,800</td><td></td></tr>
<tr><td><strong>Total</strong></td><td><strong>29,000</strong></td><td><strong>29,000</strong></td></tr>
</table>
<div class="callout"><span class="badge">Limits of the trial balance</span> Equal totals only prove that debits equal credits. A trial balance cannot detect a transaction that was never recorded, an entry posted to the wrong account, or the same mistake made on both sides.</div>`,
    `<span class="eyebrow">ACC101 · Chương 2 · Bài 1.2</span>
<h2>Ghi chép nghiệp vụ: tài khoản, Nợ &amp; Có</h2>
<h3>Tài khoản và hệ thống tài khoản</h3>
<p>Một <strong>tài khoản</strong> ghi các khoản tăng, giảm của một đối tượng — Tiền mặt, Phải thu khách hàng, Doanh thu dịch vụ… Danh sách mọi tài khoản doanh nghiệp dùng gọi là <strong>hệ thống tài khoản</strong>. Ở Việt Nam, số hiệu tài khoản được chuẩn hoá theo chế độ kế toán:</p>
<table>
<tr><th>Nhóm</th><th>Tài khoản tiêu biểu</th><th>Số hiệu Việt Nam (ví dụ)</th></tr>
<tr><td>Tài sản</td><td>Tiền mặt, Tiền gửi ngân hàng, Phải thu khách hàng, Hàng tồn kho, Thiết bị</td><td>111, 112, 131, 152 / 156, 211</td></tr>
<tr><td>Điều chỉnh giảm tài sản</td><td>Hao mòn luỹ kế</td><td>214</td></tr>
<tr><td>Nợ phải trả</td><td>Phải trả người bán, Thuế phải nộp, Phải trả người lao động</td><td>331, 333, 334</td></tr>
<tr><td>Vốn chủ sở hữu</td><td>Vốn góp của chủ sở hữu, Lợi nhuận sau thuế chưa phân phối</td><td>411, 421</td></tr>
<tr><td>Doanh thu</td><td>Doanh thu bán hàng và cung cấp dịch vụ</td><td>511</td></tr>
<tr><td>Chi phí</td><td>Giá vốn hàng bán, Chi phí bán hàng, Chi phí quản lý doanh nghiệp</td><td>632, 641, 642</td></tr>
</table>
<h3>Nợ và Có</h3>
<p>Một <strong>tài khoản chữ T</strong> có bên trái gọi là <strong>Nợ</strong> (Debit) và bên phải gọi là <strong>Có</strong> (Credit). "Nợ" không có nghĩa tốt hay xấu — chỉ có nghĩa là <em>bên trái</em>. Bên nào làm tăng tài khoản phụ thuộc vào loại tài khoản:</p>
<table>
<tr><th>Loại tài khoản</th><th>Tăng</th><th>Giảm</th><th>Số dư thông thường</th></tr>
<tr><td>Tài sản</td><td>Nợ</td><td>Có</td><td>Nợ</td></tr>
<tr><td>Chi phí, Rút vốn</td><td>Nợ</td><td>Có</td><td>Nợ</td></tr>
<tr><td>Nợ phải trả</td><td>Có</td><td>Nợ</td><td>Có</td></tr>
<tr><td>Vốn góp, Doanh thu</td><td>Có</td><td>Nợ</td><td>Có</td></tr>
</table>
<p><strong>Ghi sổ kép</strong>: mỗi nghiệp vụ được ghi ít nhất một bên Nợ và một bên Có, và <em>tổng Nợ = tổng Có</em>. Đó chính là lý do phương trình kế toán luôn cân bằng.</p>
<h3>Nhật ký → sổ cái → bảng cân đối thử</h3>
<p>Chứng từ gốc (hoá đơn, phiếu thu, giấy báo ngân hàng) được ghi trước vào <strong>sổ nhật ký</strong> theo thứ tự thời gian, rồi <strong>chuyển sổ</strong> sang từng tài khoản trong <strong>sổ cái</strong>. Tám nghiệp vụ của bài 1.1 dưới dạng bút toán:</p>
<pre><code>(1) Nợ Tiền mặt                20.000
        Có Vốn góp                     20.000
(2) Nợ Thiết bị                 8.000
        Có Tiền mặt                     8.000
(3) Nợ Vật tư                   1.500
        Có Phải trả người bán           1.500
(4) Nợ Tiền mặt                 5.000
        Có Doanh thu dịch vụ            5.000
(5) Nợ Phải thu khách hàng      3.000
        Có Doanh thu dịch vụ            3.000
(6) Nợ Chi phí thuê             1.200
    Nợ Chi phí lương            1.800
        Có Tiền mặt                     3.000
(7) Nợ Phải trả người bán         500
        Có Tiền mặt                       500
(8) Nợ Rút vốn                  1.000
        Có Tiền mặt                     1.000</code></pre>
<p>Cuối kỳ, số dư các tài khoản trên sổ cái được liệt kê vào <strong>bảng cân đối thử</strong> (bảng cân đối tài khoản):</p>
<table>
<tr><th>Tài khoản</th><th>Nợ</th><th>Có</th></tr>
<tr><td>Tiền mặt</td><td>12.500</td><td></td></tr>
<tr><td>Phải thu khách hàng</td><td>3.000</td><td></td></tr>
<tr><td>Vật tư</td><td>1.500</td><td></td></tr>
<tr><td>Thiết bị</td><td>8.000</td><td></td></tr>
<tr><td>Phải trả người bán</td><td></td><td>1.000</td></tr>
<tr><td>Vốn góp</td><td></td><td>20.000</td></tr>
<tr><td>Rút vốn</td><td>1.000</td><td></td></tr>
<tr><td>Doanh thu dịch vụ</td><td></td><td>8.000</td></tr>
<tr><td>Chi phí thuê</td><td>1.200</td><td></td></tr>
<tr><td>Chi phí lương</td><td>1.800</td><td></td></tr>
<tr><td><strong>Cộng</strong></td><td><strong>29.000</strong></td><td><strong>29.000</strong></td></tr>
</table>
<div class="callout"><span class="badge">Giới hạn của bảng cân đối thử</span> Hai cột bằng nhau chỉ chứng minh tổng Nợ bằng tổng Có. Bảng cân đối thử không phát hiện được nghiệp vụ bị bỏ sót, bút toán ghi nhầm tài khoản, hay cùng một sai sót xảy ra ở cả hai bên.</div>`,
  ]]);

const c1e = doc('acc101-1-3-exercise', 'Exercise 1 — from transactions to a trial balance|||Bài tập 1 — từ nghiệp vụ tới bảng cân đối thử',
  'Bài tập: định khoản 9 nghiệp vụ của một studio thiết kế, lập bảng cân đối thử, tính lợi nhuận và tổng tài sản; kèm lời giải và phép kiểm phương trình kế toán.',
  [[
    `<span class="eyebrow">ACC101 · Chapter 2 · Exercise</span>
<h2>Exercise 1 — Mai Design Studio, month of June</h2>
<div class="callout"><span class="badge">Problem</span> (1) The owner invests $15,000 cash. (2) Buys computer equipment for $6,000: pays $2,000 cash, the rest on account. (3) Buys supplies for $800 cash. (4) Completes design work for $3,500 cash. (5) Completes work for $2,200 on credit. (6) Pays office rent of $900. (7) Collects $1,200 from the customer in (5). (8) Pays $1,000 of the amount owed for the equipment. (9) The owner withdraws $500. <br>Required: (a) journal entries; (b) a trial balance; (c) net income and total assets.</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) Journal
(1) Dr Cash               15,000 / Cr Owner capital       15,000
(2) Dr Equipment           6,000 / Cr Cash                 2,000
                                   Cr Accounts payable     4,000
(3) Dr Supplies              800 / Cr Cash                   800
(4) Dr Cash                3,500 / Cr Service revenue      3,500
(5) Dr Accounts receivable 2,200 / Cr Service revenue      2,200
(6) Dr Rent expense          900 / Cr Cash                   900
(7) Dr Cash                1,200 / Cr Accounts receivable  1,200
(8) Dr Accounts payable    1,000 / Cr Cash                 1,000
(9) Dr Owner withdrawals     500 / Cr Cash                   500

(b) Trial balance, 30 June            Debit     Credit
Cash (15,000−2,000−800+3,500−900+1,200−1,000−500)
                                     14,500
Accounts receivable (2,200 − 1,200)   1,000
Supplies                                800
Equipment                             6,000
Accounts payable (4,000 − 1,000)                 3,000
Owner capital                                   15,000
Owner withdrawals                       500
Service revenue (3,500 + 2,200)                  5,700
Rent expense                            900
Total                                23,700     23,700

(c) Net income   = 5,700 − 900 = 4,800
    Total assets = 14,500 + 1,000 + 800 + 6,000 = 22,300
    Check: Liabilities 3,000 + Equity (15,000 − 500 + 4,800 = 19,300) = 22,300 ✓</code></pre>
<p><strong>Why:</strong> transaction (7) only swaps one asset for another (receivable → cash), so revenue is <em>not</em> recorded again — it was earned in (5). The withdrawal in (9) reduces equity but is not an expense, so it does not reduce net income.</p>`,
    `<span class="eyebrow">ACC101 · Chương 2 · Bài tập</span>
<h2>Bài tập 1 — Mai Design Studio, tháng 6</h2>
<div class="callout"><span class="badge">Đề</span> (1) Chủ góp vốn 15.000 $ tiền mặt. (2) Mua máy tính 6.000 $: trả 2.000 $ tiền mặt, còn lại nợ người bán. (3) Mua vật tư 800 $ trả tiền mặt. (4) Hoàn thành thiết kế thu tiền mặt 3.500 $. (5) Hoàn thành thiết kế 2.200 $ khách chưa trả. (6) Trả tiền thuê văn phòng 900 $. (7) Thu 1.200 $ của khách hàng ở (5). (8) Trả 1.000 $ tiền còn nợ khi mua máy. (9) Chủ rút 500 $. <br>Yêu cầu: (a) định khoản; (b) lập bảng cân đối thử; (c) tính lợi nhuận và tổng tài sản.</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) Định khoản
(1) Nợ Tiền mặt           15.000 / Có Vốn góp             15.000
(2) Nợ Thiết bị            6.000 / Có Tiền mặt             2.000
                                   Có Phải trả người bán   4.000
(3) Nợ Vật tư                800 / Có Tiền mặt               800
(4) Nợ Tiền mặt            3.500 / Có Doanh thu dịch vụ    3.500
(5) Nợ Phải thu KH         2.200 / Có Doanh thu dịch vụ    2.200
(6) Nợ Chi phí thuê          900 / Có Tiền mặt               900
(7) Nợ Tiền mặt            1.200 / Có Phải thu KH          1.200
(8) Nợ Phải trả người bán  1.000 / Có Tiền mặt             1.000
(9) Nợ Rút vốn               500 / Có Tiền mặt               500

(b) Bảng cân đối thử, 30/6              Nợ         Có
Tiền mặt (15.000−2.000−800+3.500−900+1.200−1.000−500)
                                     14.500
Phải thu KH (2.200 − 1.200)           1.000
Vật tư                                  800
Thiết bị                              6.000
Phải trả người bán (4.000 − 1.000)               3.000
Vốn góp                                         15.000
Rút vốn                                 500
Doanh thu dịch vụ (3.500 + 2.200)                5.700
Chi phí thuê                            900
Cộng                                 23.700     23.700

(c) Lợi nhuận    = 5.700 − 900 = 4.800
    Tổng tài sản = 14.500 + 1.000 + 800 + 6.000 = 22.300
    Kiểm tra: Nợ phải trả 3.000 + Vốn CSH (15.000 − 500 + 4.800 = 19.300) = 22.300 ✓</code></pre>
<p><strong>Vì sao:</strong> nghiệp vụ (7) chỉ đổi tài sản này lấy tài sản khác (phải thu → tiền), nên <em>không</em> ghi doanh thu lần nữa — doanh thu đã ghi ở (5). Khoản rút vốn ở (9) làm giảm vốn chủ sở hữu nhưng không phải chi phí, nên không làm giảm lợi nhuận.</p>`,
  ]]);

const c1q = quiz('acc101-quiz-1', 'Quiz 1 — The equation & double-entry|||Quiz 1 — Phương trình & ghi sổ kép', [
  { id: 'q1', question: 'The owner invests $10,000 cash in the business. What happens to the accounting equation?|||Chủ sở hữu góp 10.000 $ tiền mặt vào doanh nghiệp. Phương trình kế toán thay đổi thế nào?', options: ['Assets +, Liabilities +|||Tài sản +, Nợ phải trả +', 'Assets +, Equity +|||Tài sản +, Vốn chủ sở hữu +', 'Assets −, Equity +|||Tài sản −, Vốn chủ sở hữu +', 'Liabilities +, Equity −|||Nợ phải trả +, Vốn chủ sở hữu −'], correctIndex: 1, explanation: 'Cash (an asset) rises and the owner claim (equity) rises by the same amount, so the equation stays balanced.|||Tiền (tài sản) tăng và quyền của chủ sở hữu (vốn chủ sở hữu) tăng cùng một lượng, nên phương trình vẫn cân bằng.' },
  { id: 'q2', question: 'Which pair of accounts normally has a DEBIT balance?|||Cặp tài khoản nào thông thường có số dư NỢ?', options: ['Revenues and Liabilities|||Doanh thu và Nợ phải trả', 'Assets and Expenses|||Tài sản và Chi phí', 'Owner capital and Revenues|||Vốn góp và Doanh thu', 'Liabilities and Withdrawals|||Nợ phải trả và Rút vốn'], correctIndex: 1, explanation: 'Assets, expenses and withdrawals increase on the debit side; liabilities, capital and revenues increase on the credit side.|||Tài sản, chi phí và rút vốn tăng bên Nợ; nợ phải trả, vốn góp và doanh thu tăng bên Có.' },
  { id: 'q3', question: 'A trial balance whose totals are equal guarantees that…|||Bảng cân đối thử có hai cột bằng nhau đảm bảo rằng…', options: ['there are no errors at all|||không có sai sót nào', 'total debits equal total credits|||tổng Nợ bằng tổng Có', 'every transaction was recorded|||mọi nghiệp vụ đều đã được ghi', 'every account was classified correctly|||mọi tài khoản đều được phân loại đúng'], correctIndex: 1, explanation: 'Omitted transactions, wrong accounts and equal errors on both sides all leave the totals equal.|||Nghiệp vụ bị bỏ sót, ghi nhầm tài khoản, hay sai như nhau ở cả hai bên đều vẫn làm hai cột bằng nhau.' },
]);

const c3 = doc('acc101-2-1-adjusting-closing', '2.1 — Adjusting entries & completing the accounting cycle|||2.1 — Bút toán điều chỉnh & hoàn tất chu trình kế toán',
  'Kế toán dồn tích, 5 loại bút toán điều chỉnh có ví dụ số, hao mòn luỹ kế, 4 bút toán khoá sổ (TK 911 → 421), chu trình kế toán, bảng cân đối phân loại và hệ số thanh toán hiện hành.',
  [[
    `<span class="eyebrow">ACC101 · Chapters 3–4 · Lesson 2.1</span>
<h2>Adjusting entries &amp; completing the accounting cycle</h2>
<h3>Why adjust?</h3>
<p>Under <strong>accrual accounting</strong>, revenues are recorded when earned and expenses when incurred — not when cash moves. Some things happen continuously (supplies are used up, equipment wears out, wages build up day by day) and are not recorded as they happen. So at the end of each period, before preparing statements, we make <strong>adjusting entries</strong>. Each one touches <strong>one income-statement account and one balance-sheet account</strong> — and never Cash.</p>
<table>
<tr><th>Type</th><th>Situation</th><th>Adjusting entry</th></tr>
<tr><td>Prepaid expense</td><td>Paid in advance, now used up (supplies, insurance, rent)</td><td>Dr Expense / Cr Prepaid asset</td></tr>
<tr><td>Depreciation</td><td>Part of a plant asset's cost belongs to this period</td><td>Dr Depreciation expense / Cr Accumulated depreciation</td></tr>
<tr><td>Unearned revenue</td><td>Cash received in advance, now earned</td><td>Dr Unearned revenue / Cr Revenue</td></tr>
<tr><td>Accrued expense</td><td>Incurred but not yet paid or recorded (wages, interest)</td><td>Dr Expense / Cr Payable</td></tr>
<tr><td>Accrued revenue</td><td>Earned but not yet billed or recorded</td><td>Dr Receivable / Cr Revenue</td></tr>
</table>
<h3>Worked examples (month ending 31 December)</h3>
<pre><code>a) Supplies: balance 1,500; count on hand 600 -> 900 used
   Dr Supplies expense          900 / Cr Supplies                    900
b) Insurance: 2,400 paid on 1 Dec for 12 months -> 1 month expired
   Dr Insurance expense         200 / Cr Prepaid insurance           200
c) Equipment 9,000, 5-year life, no salvage -> 1,800 a year = 150 a month
   Dr Depreciation expense      150 / Cr Accumulated depreciation    150
d) 3,000 received in advance for 3 months of service starting this month
   Dr Unearned revenue        1,000 / Cr Service revenue           1,000
e) Salaries earned by staff but not yet paid: 700
   Dr Salaries expense          700 / Cr Salaries payable            700
f) Services performed but not yet billed: 400
   Dr Accounts receivable       400 / Cr Service revenue             400</code></pre>
<p>Accumulated depreciation is a <strong>contra-asset</strong> account: the balance sheet shows Equipment 9,000 − Accumulated depreciation 150 = <strong>book value 8,850</strong>. Depreciation allocates cost; it does not measure market value.</p>
<h3>Closing entries</h3>
<p><strong>Temporary accounts</strong> (revenues, expenses, withdrawals) measure one period only, so they are reset to zero at period end; <strong>permanent accounts</strong> (assets, liabilities, capital) carry their balances forward. Closing uses a clearing account called <em>Income Summary</em>:</p>
<pre><code>1. Dr Revenues        / Cr Income summary     (close revenues)
2. Dr Income summary  / Cr Expenses           (close expenses)
3. Dr Income summary  / Cr Owner capital      (transfer net income)
4. Dr Owner capital   / Cr Owner withdrawals  (close withdrawals)</code></pre>
<p>In the Vietnamese regime, account <strong>911</strong> (determination of business results) plays the role of Income Summary, and the result is transferred to account <strong>421</strong> (undistributed profit after tax).</p>
<h3>The accounting cycle &amp; the classified balance sheet</h3>
<p>Analyze → journalize → post → unadjusted trial balance → adjust → adjusted trial balance → prepare statements → close → post-closing trial balance (only permanent accounts remain). A <strong>classified balance sheet</strong> groups items so readers can judge liquidity: <em>current assets</em> (cash, receivables, inventory, prepaid items — used within one year or the operating cycle), long-term investments, plant assets at book value, intangible assets; <em>current</em> and <em>long-term liabilities</em>; equity. A quick liquidity test is the <strong>current ratio = current assets ÷ current liabilities</strong>.</p>
<div class="callout"><span class="badge">Tip</span> If an adjusting entry you wrote touches Cash, it is wrong — cash transactions were already recorded when they happened.</div>`,
    `<span class="eyebrow">ACC101 · Chương 3–4 · Bài 2.1</span>
<h2>Bút toán điều chỉnh &amp; hoàn tất chu trình kế toán</h2>
<h3>Vì sao phải điều chỉnh?</h3>
<p>Theo <strong>kế toán dồn tích</strong>, doanh thu được ghi khi đã thực hiện và chi phí được ghi khi đã phát sinh — không phải khi tiền dịch chuyển. Có những việc diễn ra liên tục (vật tư bị dùng dần, thiết bị hao mòn, tiền lương tích luỹ theo ngày) mà không được ghi chép ngay khi xảy ra. Vì vậy cuối mỗi kỳ, trước khi lập báo cáo, ta lập <strong>bút toán điều chỉnh</strong>. Mỗi bút toán chạm <strong>một tài khoản trên báo cáo kết quả kinh doanh và một tài khoản trên bảng cân đối</strong> — và không bao giờ chạm Tiền.</p>
<table>
<tr><th>Loại</th><th>Tình huống</th><th>Bút toán điều chỉnh</th></tr>
<tr><td>Chi phí trả trước</td><td>Đã trả trước, nay đã dùng (vật tư, bảo hiểm, tiền thuê)</td><td>Nợ Chi phí / Có Tài sản trả trước</td></tr>
<tr><td>Khấu hao</td><td>Một phần nguyên giá tài sản cố định thuộc về kỳ này</td><td>Nợ Chi phí khấu hao / Có Hao mòn luỹ kế</td></tr>
<tr><td>Doanh thu chưa thực hiện</td><td>Đã nhận tiền trước, nay đã cung cấp dịch vụ</td><td>Nợ Doanh thu chưa thực hiện / Có Doanh thu</td></tr>
<tr><td>Chi phí dồn tích (phải trả)</td><td>Đã phát sinh nhưng chưa trả, chưa ghi (lương, lãi vay)</td><td>Nợ Chi phí / Có Phải trả</td></tr>
<tr><td>Doanh thu dồn tích (phải thu)</td><td>Đã thực hiện nhưng chưa lập hoá đơn, chưa ghi</td><td>Nợ Phải thu / Có Doanh thu</td></tr>
</table>
<h3>Ví dụ có số (kỳ kết thúc 31/12)</h3>
<pre><code>a) Vật tư: số dư 1.500; kiểm kê còn 600 -> đã dùng 900
   Nợ Chi phí vật tư            900 / Có Vật tư                      900
b) Bảo hiểm: trả 2.400 ngày 1/12 cho 12 tháng -> hết hạn 1 tháng
   Nợ Chi phí bảo hiểm          200 / Có Bảo hiểm trả trước          200
c) Thiết bị 9.000, dùng 5 năm, không giá trị thu hồi -> 1.800/năm = 150/tháng
   Nợ Chi phí khấu hao          150 / Có Hao mòn luỹ kế              150
d) Nhận trước 3.000 cho 3 tháng dịch vụ, bắt đầu từ tháng này
   Nợ Doanh thu chưa thực hiện 1.000 / Có Doanh thu dịch vụ        1.000
e) Lương nhân viên đã làm nhưng chưa trả: 700
   Nợ Chi phí lương             700 / Có Phải trả người lao động     700
f) Dịch vụ đã làm nhưng chưa lập hoá đơn: 400
   Nợ Phải thu khách hàng       400 / Có Doanh thu dịch vụ           400</code></pre>
<p>Hao mòn luỹ kế là tài khoản <strong>điều chỉnh giảm tài sản</strong>: bảng cân đối trình bày Thiết bị 9.000 − Hao mòn luỹ kế 150 = <strong>giá trị còn lại 8.850</strong>. Khấu hao là phân bổ nguyên giá, không phải đo giá thị trường.</p>
<h3>Bút toán khoá sổ</h3>
<p><strong>Tài khoản tạm thời</strong> (doanh thu, chi phí, rút vốn) chỉ đo một kỳ nên được đưa về 0 cuối kỳ; <strong>tài khoản thường xuyên</strong> (tài sản, nợ phải trả, vốn góp) mang số dư sang kỳ sau. Khoá sổ dùng một tài khoản trung gian gọi là <em>Xác định kết quả</em> (Income Summary):</p>
<pre><code>1. Nợ Doanh thu            / Có Xác định kết quả   (kết chuyển doanh thu)
2. Nợ Xác định kết quả     / Có Chi phí            (kết chuyển chi phí)
3. Nợ Xác định kết quả     / Có Vốn góp            (kết chuyển lợi nhuận)
4. Nợ Vốn góp              / Có Rút vốn            (khoá sổ rút vốn)</code></pre>
<p>Trong chế độ kế toán Việt Nam, tài khoản <strong>911</strong> (Xác định kết quả kinh doanh) đóng vai trò Income Summary, và kết quả được kết chuyển sang tài khoản <strong>421</strong> (Lợi nhuận sau thuế chưa phân phối).</p>
<h3>Chu trình kế toán &amp; bảng cân đối phân loại</h3>
<p>Phân tích → định khoản → chuyển sổ → cân đối thử trước điều chỉnh → điều chỉnh → cân đối thử sau điều chỉnh → lập báo cáo → khoá sổ → cân đối thử sau khoá sổ (chỉ còn tài khoản thường xuyên). <strong>Bảng cân đối phân loại</strong> nhóm các khoản để người đọc đánh giá khả năng thanh toán: <em>tài sản ngắn hạn</em> (tiền, phải thu, hàng tồn kho, khoản trả trước — dùng trong vòng một năm hoặc một chu kỳ kinh doanh), đầu tư dài hạn, tài sản cố định theo giá trị còn lại, tài sản vô hình; <em>nợ ngắn hạn</em> và <em>nợ dài hạn</em>; vốn chủ sở hữu. Phép thử nhanh là <strong>hệ số thanh toán hiện hành = tài sản ngắn hạn ÷ nợ ngắn hạn</strong>.</p>
<div class="callout"><span class="badge">Mẹo</span> Nếu bút toán điều chỉnh bạn viết có chạm tài khoản Tiền thì nó sai — nghiệp vụ tiền đã được ghi ngay khi xảy ra.</div>`,
  ]]);

const c3e = doc('acc101-2-2-exercise', 'Exercise 2 — year-end adjusting entries|||Bài tập 2 — bút toán điều chỉnh cuối năm',
  'Bài tập: lập 6 bút toán điều chỉnh cuối năm (vật tư, bảo hiểm, khấu hao, doanh thu nhận trước, lương và doanh thu dồn tích) và tính ảnh hưởng tới lợi nhuận; kèm lời giải.',
  [[
    `<span class="eyebrow">ACC101 · Chapter 3 · Exercise</span>
<h2>Exercise 2 — Binh Minh Consulting, year ending 31 December</h2>
<div class="callout"><span class="badge">Problem</span> Unadjusted balances: Supplies $2,000; Prepaid insurance $3,600 (a 12-month policy bought on 1 September); Equipment $12,000 (bought 1 January, 4-year life, no salvage value); Unearned consulting revenue $4,500 (received 1 November for three months: November–January). Year-end information: supplies on hand $650; wages earned but unpaid $1,100; services performed but not yet billed $800. <br>Required: (a) the adjusting entries; (b) the total effect on net income.</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) Adjusting entries, 31 December
a) Supplies used = 2,000 − 650 = 1,350
   Dr Supplies expense           1,350 / Cr Supplies                    1,350
b) Insurance 3,600 / 12 = 300 a month; Sep–Dec = 4 months = 1,200
   Dr Insurance expense          1,200 / Cr Prepaid insurance           1,200
c) Depreciation 12,000 / 4 years = 3,000 for the year
   Dr Depreciation expense       3,000 / Cr Accumulated depreciation    3,000
d) Unearned 4,500 / 3 = 1,500 a month; Nov–Dec earned = 3,000
   Dr Unearned consulting revenue 3,000 / Cr Consulting revenue        3,000
e) Accrued wages
   Dr Wages expense              1,100 / Cr Wages payable               1,100
f) Accrued revenue
   Dr Accounts receivable          800 / Cr Consulting revenue            800

(b) Revenues  +3,000 + 800                         = +3,800
    Expenses  +1,350 + 1,200 + 3,000 + 1,100       = +6,650
    Net income changes by 3,800 − 6,650            = −2,850

Balances after adjustment: Supplies 650 · Prepaid insurance 2,400
Accumulated depreciation 3,000 · Unearned consulting revenue 1,500</code></pre>
<p><strong>Why:</strong> without these entries, assets would be overstated (supplies, prepaid insurance, equipment at full cost), liabilities understated (wages payable) and net income overstated by $2,850 — exactly the distortion the matching principle is meant to remove.</p>`,
    `<span class="eyebrow">ACC101 · Chương 3 · Bài tập</span>
<h2>Bài tập 2 — Công ty Tư vấn Bình Minh, năm kết thúc 31/12</h2>
<div class="callout"><span class="badge">Đề</span> Số dư trước điều chỉnh: Vật tư 2.000 $; Bảo hiểm trả trước 3.600 $ (hợp đồng 12 tháng mua ngày 1/9); Thiết bị 12.000 $ (mua 1/1, dùng 4 năm, không có giá trị thu hồi); Doanh thu tư vấn nhận trước 4.500 $ (nhận ngày 1/11 cho 3 tháng: tháng 11 – tháng 1). Thông tin cuối năm: vật tư còn 650 $; lương nhân viên đã làm nhưng chưa trả 1.100 $; dịch vụ đã làm nhưng chưa lập hoá đơn 800 $. <br>Yêu cầu: (a) lập các bút toán điều chỉnh; (b) tính tổng ảnh hưởng tới lợi nhuận.</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) Bút toán điều chỉnh ngày 31/12
a) Vật tư đã dùng = 2.000 − 650 = 1.350
   Nợ Chi phí vật tư             1.350 / Có Vật tư                      1.350
b) Bảo hiểm 3.600 / 12 = 300 mỗi tháng; tháng 9–12 = 4 tháng = 1.200
   Nợ Chi phí bảo hiểm           1.200 / Có Bảo hiểm trả trước          1.200
c) Khấu hao 12.000 / 4 năm = 3.000 cho năm nay
   Nợ Chi phí khấu hao           3.000 / Có Hao mòn luỹ kế              3.000
d) Nhận trước 4.500 / 3 = 1.500 mỗi tháng; đã thực hiện tháng 11–12 = 3.000
   Nợ Doanh thu nhận trước       3.000 / Có Doanh thu tư vấn            3.000
e) Lương phải trả dồn tích
   Nợ Chi phí lương              1.100 / Có Phải trả người lao động     1.100
f) Doanh thu dồn tích
   Nợ Phải thu khách hàng          800 / Có Doanh thu tư vấn              800

(b) Doanh thu tăng  +3.000 + 800                     = +3.800
    Chi phí tăng    +1.350 + 1.200 + 3.000 + 1.100   = +6.650
    Lợi nhuận thay đổi 3.800 − 6.650                 = −2.850

Số dư sau điều chỉnh: Vật tư 650 · Bảo hiểm trả trước 2.400
Hao mòn luỹ kế 3.000 · Doanh thu nhận trước 1.500</code></pre>
<p><strong>Vì sao:</strong> nếu không điều chỉnh, tài sản bị ghi cao (vật tư, bảo hiểm trả trước, thiết bị theo nguyên giá), nợ phải trả bị ghi thấp (lương phải trả) và lợi nhuận bị thổi phồng 2.850 $ — đúng loại sai lệch mà nguyên tắc phù hợp muốn loại bỏ.</p>`,
  ]]);

const c3q = quiz('acc101-quiz-2', 'Quiz 2 — Adjusting & closing|||Quiz 2 — Điều chỉnh & khoá sổ', [
  { id: 'q1', question: 'Which account is closed at the end of the period?|||Tài khoản nào được khoá sổ (đưa về 0) vào cuối kỳ?', options: ['Cash|||Tiền mặt', 'Accounts payable|||Phải trả người bán', 'Service revenue|||Doanh thu dịch vụ', 'Equipment|||Thiết bị'], correctIndex: 2, explanation: 'Revenues, expenses and withdrawals are temporary accounts; assets, liabilities and capital are permanent.|||Doanh thu, chi phí và rút vốn là tài khoản tạm thời; tài sản, nợ phải trả và vốn góp là tài khoản thường xuyên.' },
  { id: 'q2', question: 'Employees earned $500 of wages that are unpaid at period end. The adjusting entry is…|||Nhân viên đã làm công 500 $ nhưng cuối kỳ chưa được trả. Bút toán điều chỉnh là…', options: ['Dr Wages payable / Cr Cash|||Nợ Phải trả người lao động / Có Tiền', 'Dr Wages expense / Cr Wages payable|||Nợ Chi phí lương / Có Phải trả người lao động', 'Dr Cash / Cr Wages expense|||Nợ Tiền / Có Chi phí lương', 'No entry until the wages are paid|||Không ghi gì cho tới khi trả lương'], correctIndex: 1, explanation: 'An accrued expense: record the expense in the period it was incurred and a liability for the amount owed.|||Chi phí dồn tích: ghi chi phí vào kỳ phát sinh và ghi nhận khoản nợ phải trả tương ứng.' },
  { id: 'q3', question: 'Accumulated depreciation is…|||Hao mòn luỹ kế là…', options: ['a liability|||một khoản nợ phải trả', 'an expense|||một khoản chi phí', 'a contra-asset account|||tài khoản điều chỉnh giảm tài sản', 'a revenue|||một khoản doanh thu'], correctIndex: 2, explanation: 'It carries a credit balance that is deducted from the asset cost to show book value.|||Nó có số dư bên Có và được trừ vào nguyên giá để ra giá trị còn lại.' },
]);

const c5 = doc('acc101-3-1-merchandising-inventory', '3.1 — Merchandising operations & inventory costing|||3.1 — Kế toán thương mại & tính giá hàng tồn kho',
  'Doanh nghiệp thương mại tạo lợi nhuận thế nào, hệ thống kê khai thường xuyên và kiểm kê định kỳ, chiết khấu 2/10 n/30, bút toán mua bán, báo cáo nhiều bước, FIFO/bình quân/đích danh, LIFO và giá trị thuần có thể thực hiện.',
  [[
    `<span class="eyebrow">ACC101 · Chapters 5–6 · Lesson 3.1</span>
<h2>Merchandising operations &amp; inventory costing</h2>
<h3>How a merchandiser earns income</h3>
<pre><code>Net sales
− Cost of goods sold (COGS)
= Gross profit
− Operating expenses (selling, general and administrative)
= Net income</code></pre>
<p>A merchandiser — a retailer or wholesaler — buys goods and resells them, so its key current asset is <strong>merchandise inventory</strong>. Under a <strong>perpetual</strong> system, inventory and COGS are updated with every purchase and sale (the norm with barcode and POS software); under a <strong>periodic</strong> system, COGS is worked out only at period end from a physical count.</p>
<h3>Perpetual-system entries</h3>
<pre><code>Buy 100 units at $50 on credit, terms 2/10, n/30
   Dr Merchandise inventory  5,000 / Cr Accounts payable       5,000
Pay within the 10-day discount period (2% x 5,000 = 100)
   Dr Accounts payable       5,000 / Cr Merchandise inventory    100
                                     Cr Cash                   4,900
Sell 60 units at $80 on credit (unit cost is now 4,900 / 100 = 49)
   Dr Accounts receivable    4,800 / Cr Sales                  4,800
   Dr Cost of goods sold     2,940 / Cr Merchandise inventory  2,940
Gross profit on this sale = 4,800 − 2,940 = 1,860</code></pre>
<p>Each sale needs <strong>two</strong> entries: one at selling price (revenue) and one at cost (expense). "2/10, n/30" means a 2% discount if paid within 10 days, otherwise the full amount is due in 30 days. Sales discounts and sales returns and allowances are <strong>contra-revenue</strong> accounts subtracted from sales to reach net sales. Freight on purchases paid by the buyer (FOB shipping point) is added to the cost of inventory.</p>
<p>The <strong>multi-step income statement</strong> shows the steps: net sales − COGS = gross profit; − selling expenses − general and administrative expenses = income from operations; ± other revenues and expenses = net income. The <strong>gross margin ratio</strong> = gross profit ÷ net sales.</p>
<h3>Inventory costing methods</h3>
<p>When identical units were bought at different prices, which cost goes to COGS and which stays in ending inventory?</p>
<table>
<tr><th>Method</th><th>Assumption</th><th>When purchase prices are rising…</th></tr>
<tr><td>Specific identification</td><td>Track the actual cost of each unit sold (cars, jewellery)</td><td>Exact, but practical only for distinct, high-value items</td></tr>
<tr><td>FIFO</td><td>The first units bought are the first sold</td><td>Lowest COGS, highest profit; ending inventory close to current cost</td></tr>
<tr><td>Weighted average</td><td>Each unit carries the average cost of the goods available</td><td>Results in between; smooths price swings</td></tr>
<tr><td>LIFO</td><td>The last units bought are the first sold</td><td>Highest COGS, lowest profit — allowed under US GAAP but <strong>not</strong> under IFRS or the current Vietnamese regime</td></tr>
</table>
<p>Inventory is reported at the <strong>lower of cost and net realizable value</strong> (in Vietnam: a provision for the decline in inventory value). An <strong>inventory error</strong> flows straight into COGS: overstating ending inventory understates COGS and overstates this period's profit — then reverses in the next period.</p>
<div class="callout"><span class="badge">Consistency</span> A company chooses its costing method but must apply it consistently from period to period and disclose it in the notes, so that profits remain comparable.</div>`,
    `<span class="eyebrow">ACC101 · Chương 5–6 · Bài 3.1</span>
<h2>Kế toán thương mại &amp; tính giá hàng tồn kho</h2>
<h3>Doanh nghiệp thương mại tạo lợi nhuận thế nào</h3>
<pre><code>Doanh thu thuần
− Giá vốn hàng bán
= Lợi nhuận gộp
− Chi phí hoạt động (bán hàng, quản lý doanh nghiệp)
= Lợi nhuận</code></pre>
<p>Doanh nghiệp thương mại — bán lẻ hay bán buôn — mua hàng về rồi bán lại, nên tài sản ngắn hạn then chốt là <strong>hàng hoá tồn kho</strong>. Theo phương pháp <strong>kê khai thường xuyên</strong>, hàng tồn kho và giá vốn được cập nhật sau mỗi lần mua, bán (chuẩn mực khi dùng mã vạch và phần mềm bán hàng); theo phương pháp <strong>kiểm kê định kỳ</strong>, giá vốn chỉ được tính cuối kỳ dựa trên kiểm kê thực tế.</p>
<h3>Bút toán theo kê khai thường xuyên</h3>
<pre><code>Mua 100 đơn vị giá 50 $, chưa trả tiền, điều khoản 2/10, n/30
   Nợ Hàng hoá               5.000 / Có Phải trả người bán     5.000
Trả trong 10 ngày được chiết khấu (2% x 5.000 = 100)
   Nợ Phải trả người bán     5.000 / Có Hàng hoá                 100
                                     Có Tiền                   4.900
Bán 60 đơn vị giá 80 $, khách chưa trả (giá vốn đơn vị nay = 4.900 / 100 = 49)
   Nợ Phải thu khách hàng    4.800 / Có Doanh thu bán hàng     4.800
   Nợ Giá vốn hàng bán       2.940 / Có Hàng hoá               2.940
Lợi nhuận gộp của lần bán = 4.800 − 2.940 = 1.860</code></pre>
<p>Mỗi lần bán cần <strong>hai</strong> bút toán: một theo giá bán (doanh thu) và một theo giá vốn (chi phí). "2/10, n/30" nghĩa là được giảm 2% nếu trả trong 10 ngày, nếu không phải trả đủ trong 30 ngày. Chiết khấu bán hàng và hàng bán bị trả lại, giảm giá là các tài khoản <strong>giảm trừ doanh thu</strong>, lấy doanh thu trừ đi các khoản này ra doanh thu thuần. Chi phí vận chuyển hàng mua do bên mua chịu (FOB nơi đi) được cộng vào giá gốc hàng tồn kho.</p>
<p><strong>Báo cáo kết quả kinh doanh nhiều bước</strong> trình bày từng tầng: doanh thu thuần − giá vốn = lợi nhuận gộp; − chi phí bán hàng − chi phí quản lý = lợi nhuận từ hoạt động kinh doanh; ± thu nhập và chi phí khác = lợi nhuận. <strong>Tỷ suất lợi nhuận gộp</strong> = lợi nhuận gộp ÷ doanh thu thuần.</p>
<h3>Các phương pháp tính giá hàng tồn kho</h3>
<p>Khi những đơn vị hàng giống hệt nhau được mua ở các mức giá khác nhau, giá nào vào giá vốn và giá nào nằm lại trong tồn kho cuối kỳ?</p>
<table>
<tr><th>Phương pháp</th><th>Giả định</th><th>Khi giá mua đang tăng…</th></tr>
<tr><td>Thực tế đích danh</td><td>Theo dõi đúng giá gốc của từng đơn vị bán ra (ô tô, trang sức)</td><td>Chính xác, nhưng chỉ khả thi với hàng riêng biệt, giá trị cao</td></tr>
<tr><td>Nhập trước – xuất trước (FIFO)</td><td>Hàng mua trước được bán trước</td><td>Giá vốn thấp nhất, lợi nhuận cao nhất; tồn kho cuối kỳ gần giá hiện hành</td></tr>
<tr><td>Bình quân gia quyền</td><td>Mỗi đơn vị mang giá bình quân của hàng sẵn có để bán</td><td>Kết quả ở giữa; làm mượt biến động giá</td></tr>
<tr><td>Nhập sau – xuất trước (LIFO)</td><td>Hàng mua sau được bán trước</td><td>Giá vốn cao nhất, lợi nhuận thấp nhất — được dùng theo US GAAP nhưng <strong>không</strong> được dùng theo IFRS và chế độ kế toán Việt Nam hiện hành</td></tr>
</table>
<p>Hàng tồn kho được trình bày theo <strong>giá thấp hơn giữa giá gốc và giá trị thuần có thể thực hiện</strong> (ở Việt Nam: trích lập dự phòng giảm giá hàng tồn kho). <strong>Sai sót hàng tồn kho</strong> chảy thẳng vào giá vốn: ghi tồn kho cuối kỳ cao hơn thực tế làm giá vốn thấp đi và lợi nhuận kỳ này bị thổi phồng — rồi đảo ngược ở kỳ sau.</p>
<div class="callout"><span class="badge">Nhất quán</span> Doanh nghiệp được chọn phương pháp tính giá nhưng phải áp dụng nhất quán giữa các kỳ và công bố trong thuyết minh, để lợi nhuận các kỳ so sánh được với nhau.</div>`,
  ]]);

const c5e = doc('acc101-3-2-exercise', 'Exercise 3 — FIFO vs weighted average|||Bài tập 3 — FIFO và bình quân gia quyền',
  'Bài tập: tính giá vốn, tồn kho cuối kỳ và lợi nhuận gộp theo FIFO và bình quân gia quyền (kiểm kê định kỳ) khi giá mua tăng; kèm lời giải và giải thích chênh lệch.',
  [[
    `<span class="eyebrow">ACC101 · Chapter 6 · Exercise</span>
<h2>Exercise 3 — costing the same inventory two ways</h2>
<div class="callout"><span class="badge">Problem</span> A shop uses a periodic system. January data: beginning inventory 200 units at $20; purchase on 10 January 300 units at $22; purchase on 20 January 500 units at $25. During January it sold 700 units at $40 each. <br>Required: cost of goods sold, ending inventory and gross profit under (a) FIFO and (b) weighted average.</div>
<h3>Worked solution</h3>
<pre><code class="language-text">Goods available: 200 x 20 = 4,000
                 300 x 22 = 6,600
                 500 x 25 = 12,500
                 1,000 units      23,100
Ending inventory = 1,000 − 700 = 300 units
Sales            = 700 x 40 = 28,000

(a) FIFO — the oldest costs go to COGS
    COGS = 200 x 20 + 300 x 22 + 200 x 25 = 4,000 + 6,600 + 5,000 = 15,600
    Ending inventory = 300 x 25 = 7,500     (15,600 + 7,500 = 23,100 ✓)
    Gross profit = 28,000 − 15,600 = 12,400

(b) Weighted average
    Average cost = 23,100 / 1,000 = 23.10 per unit
    COGS = 700 x 23.10 = 16,170
    Ending inventory = 300 x 23.10 = 6,930  (16,170 + 6,930 = 23,100 ✓)
    Gross profit = 28,000 − 16,170 = 11,830</code></pre>
<p><strong>Why:</strong> prices were rising, so FIFO sends the cheaper, older costs to COGS and keeps the newest $25 units in ending inventory — gross profit is $570 higher than under weighted average. Neither method changes the cash spent; they only split the same $23,100 differently between the income statement and the balance sheet.</p>`,
    `<span class="eyebrow">ACC101 · Chương 6 · Bài tập</span>
<h2>Bài tập 3 — tính giá cùng một lô hàng theo hai cách</h2>
<div class="callout"><span class="badge">Đề</span> Một cửa hàng dùng phương pháp kiểm kê định kỳ. Số liệu tháng 1: tồn đầu kỳ 200 đơn vị giá 20 $; ngày 10/1 mua 300 đơn vị giá 22 $; ngày 20/1 mua 500 đơn vị giá 25 $. Trong tháng bán 700 đơn vị, giá bán 40 $ mỗi đơn vị. <br>Yêu cầu: tính giá vốn hàng bán, tồn kho cuối kỳ và lợi nhuận gộp theo (a) FIFO và (b) bình quân gia quyền.</div>
<h3>Lời giải</h3>
<pre><code class="language-text">Hàng sẵn có để bán: 200 x 20 = 4.000
                    300 x 22 = 6.600
                    500 x 25 = 12.500
                    1.000 đơn vị      23.100
Tồn cuối kỳ = 1.000 − 700 = 300 đơn vị
Doanh thu   = 700 x 40 = 28.000

(a) FIFO — giá cũ nhất vào giá vốn
    Giá vốn = 200 x 20 + 300 x 22 + 200 x 25 = 4.000 + 6.600 + 5.000 = 15.600
    Tồn cuối kỳ = 300 x 25 = 7.500          (15.600 + 7.500 = 23.100 ✓)
    Lợi nhuận gộp = 28.000 − 15.600 = 12.400

(b) Bình quân gia quyền
    Giá bình quân = 23.100 / 1.000 = 23,10 mỗi đơn vị
    Giá vốn = 700 x 23,10 = 16.170
    Tồn cuối kỳ = 300 x 23,10 = 6.930       (16.170 + 6.930 = 23.100 ✓)
    Lợi nhuận gộp = 28.000 − 16.170 = 11.830</code></pre>
<p><strong>Vì sao:</strong> giá đang tăng nên FIFO đưa giá cũ, rẻ hơn vào giá vốn và giữ những đơn vị 25 $ mới nhất trong tồn kho — lợi nhuận gộp cao hơn bình quân gia quyền 570 $. Không phương pháp nào làm thay đổi số tiền đã chi; chúng chỉ chia cùng 23.100 $ khác nhau giữa báo cáo kết quả kinh doanh và bảng cân đối.</p>`,
  ]]);

const c5q = quiz('acc101-quiz-3', 'Quiz 3 — Merchandising & inventory|||Quiz 3 — Thương mại & hàng tồn kho', [
  { id: 'q1', question: 'Under a perpetual system, a credit sale is recorded with…|||Theo kê khai thường xuyên, một lần bán chịu được ghi bằng…', options: ['only Dr Accounts receivable / Cr Sales|||chỉ Nợ Phải thu / Có Doanh thu', 'Dr Accounts receivable / Cr Sales AND Dr COGS / Cr Inventory|||Nợ Phải thu / Có Doanh thu VÀ Nợ Giá vốn / Có Hàng hoá', 'Dr COGS / Cr Sales|||Nợ Giá vốn / Có Doanh thu', 'Dr Inventory / Cr Sales|||Nợ Hàng hoá / Có Doanh thu'], correctIndex: 1, explanation: 'One entry records revenue at selling price, the other moves the cost out of inventory into cost of goods sold.|||Một bút toán ghi doanh thu theo giá bán, bút toán kia chuyển giá gốc từ hàng tồn kho sang giá vốn hàng bán.' },
  { id: 'q2', question: 'When purchase prices are rising, which method reports the highest gross profit?|||Khi giá mua đang tăng, phương pháp nào cho lợi nhuận gộp cao nhất?', options: ['FIFO|||FIFO', 'Weighted average|||Bình quân gia quyền', 'LIFO|||LIFO', 'All methods give the same result|||Mọi phương pháp cho kết quả như nhau'], correctIndex: 0, explanation: 'FIFO assigns the oldest, cheapest costs to COGS, so COGS is lowest and gross profit highest.|||FIFO đưa giá cũ, rẻ nhất vào giá vốn, nên giá vốn thấp nhất và lợi nhuận gộp cao nhất.' },
  { id: 'q3', question: 'Gross profit equals…|||Lợi nhuận gộp bằng…', options: ['net sales − operating expenses|||doanh thu thuần − chi phí hoạt động', 'net sales − cost of goods sold|||doanh thu thuần − giá vốn hàng bán', 'sales − net income|||doanh thu − lợi nhuận', 'COGS − expenses|||giá vốn − chi phí'], correctIndex: 1, explanation: 'Operating expenses are deducted after gross profit to reach income from operations.|||Chi phí hoạt động được trừ sau lợi nhuận gộp để ra lợi nhuận từ hoạt động kinh doanh.' },
]);

const c8 = doc('acc101-4-1-cash-receivables', '4.1 — Cash, internal control & receivables|||4.1 — Tiền, kiểm soát nội bộ & phải thu',
  'Nguyên tắc kiểm soát nội bộ, quỹ tiền mặt tạm ứng, lập bảng đối chiếu ngân hàng có ví dụ số, phương pháp dự phòng phải thu khó đòi (theo doanh thu và theo tuổi nợ), xoá sổ nợ và lãi thương phiếu.',
  [[
    `<span class="eyebrow">ACC101 · Chapters 8–9 · Lesson 4.1</span>
<h2>Cash, internal control &amp; receivables</h2>
<h3>Internal control</h3>
<p><strong>Internal control</strong> is the set of policies that protect assets, keep records reliable, promote efficiency and ensure policies are followed. Core principles: establish responsibility for each task; maintain adequate records; insure assets and bond key employees; <strong>separate record-keeping from custody of assets</strong>; divide responsibility for related transactions; apply technological controls; perform regular independent reviews. For cash this means: the person who receives cash does not record it, cash is deposited daily, and payments are made by bank transfer or approved cheque. Small payments come from a <strong>petty cash fund</strong> that is replenished when it runs low (Dr the expenses / Cr Cash).</p>
<h3>Bank reconciliation</h3>
<p>The bank statement balance and the company's book balance rarely agree on the same day. A bank reconciliation explains every difference:</p>
<pre><code>Bank statement balance            8,200     Book balance                 7,760
+ Deposit in transit              1,000     + Interest earned               70
− Outstanding cheques            (1,650)    − Bank service fee             (30)
                                            − NSF cheque from customer    (250)
Adjusted bank balance             7,550     Adjusted book balance        7,550 ✓</code></pre>
<p>Only the <strong>book-side</strong> items need journal entries, because the company did not know about them yet: Dr Cash 70 / Cr Interest revenue 70; Dr Bank service expense 30 / Cr Cash 30; Dr Accounts receivable 250 / Cr Cash 250 (the customer still owes the money).</p>
<h3>Receivables and bad debts</h3>
<p>Selling on credit brings more customers — and some will never pay. The <strong>allowance method</strong> (required when bad debts are material) estimates the loss in the same period as the sale, following the matching principle:</p>
<ul>
<li><strong>Percent of sales</strong> (income-statement approach): bad debts expense = a % of credit sales.</li>
<li><strong>Percent of receivables / aging</strong> (balance-sheet approach): estimate the allowance balance that should exist, then adjust to it.</li>
</ul>
<pre><code>Aging of receivables (total 50,000)
Not yet due      30,000 x  1% =   300
1–30 days late   12,000 x  3% =   360
31–60 days late   5,000 x 10% =   500
Over 60 days      3,000 x 40% = 1,200
Required allowance              2,360
Allowance already has a credit balance of 500 -> adjustment 1,860
   Dr Bad debts expense 1,860 / Cr Allowance for doubtful accounts 1,860
Net realizable value of receivables = 50,000 − 2,360 = 47,640</code></pre>
<p>When a specific customer is written off (say $400): Dr Allowance 400 / Cr Accounts receivable 400. No expense is recorded and the net realizable value does not change (49,600 − 1,960 = 47,640), because the loss was already estimated. In Vietnam this is the <em>provision for doubtful receivables</em>.</p>
<p>A <strong>note receivable</strong> is a written promise to pay with interest: interest = principal × rate × time. A $6,000, 10%, 90-day note earns 6,000 × 10% × 90/360 = <strong>$150</strong>.</p>
<div class="callout"><span class="badge">Remember</span> Writing off an account under the allowance method hits the allowance, not the expense — the expense was recognized when the estimate was made.</div>`,
    `<span class="eyebrow">ACC101 · Chương 8–9 · Bài 4.1</span>
<h2>Tiền, kiểm soát nội bộ &amp; phải thu</h2>
<h3>Kiểm soát nội bộ</h3>
<p><strong>Kiểm soát nội bộ</strong> là tập hợp chính sách nhằm bảo vệ tài sản, bảo đảm sổ sách đáng tin cậy, nâng cao hiệu quả và bảo đảm chính sách được tuân thủ. Các nguyên tắc cốt lõi: quy định rõ trách nhiệm cho từng việc; lưu giữ chứng từ, sổ sách đầy đủ; mua bảo hiểm tài sản và ràng buộc trách nhiệm nhân viên then chốt; <strong>tách người ghi sổ khỏi người giữ tài sản</strong>; chia trách nhiệm cho các nghiệp vụ liên quan; áp dụng kiểm soát bằng công nghệ; kiểm tra độc lập định kỳ. Với tiền, điều đó nghĩa là: người thu tiền không ghi sổ, tiền được nộp ngân hàng hằng ngày, và chi trả bằng chuyển khoản hoặc séc đã duyệt. Các khoản chi nhỏ lấy từ <strong>quỹ tiền mặt tạm ứng</strong> và được bù lại khi quỹ vơi (Nợ các khoản chi phí / Có Tiền).</p>
<h3>Đối chiếu ngân hàng</h3>
<p>Số dư trên sổ phụ ngân hàng và số dư trên sổ sách doanh nghiệp hiếm khi khớp nhau trong cùng một ngày. Bảng đối chiếu ngân hàng giải thích từng khoản chênh lệch:</p>
<pre><code>Số dư sổ phụ ngân hàng            8.200     Số dư sổ sách                7.760
+ Tiền đang chuyển (chưa báo có)   1.000     + Lãi tiền gửi                  70
− Séc đã phát hành chưa thanh toán (1.650)   − Phí dịch vụ ngân hàng        (30)
                                             − Séc khách hàng bị từ chối   (250)
Số dư ngân hàng sau điều chỉnh    7.550     Số dư sổ sách sau điều chỉnh 7.550 ✓</code></pre>
<p>Chỉ các khoản <strong>bên sổ sách</strong> mới cần ghi bút toán, vì trước đó doanh nghiệp chưa biết: Nợ Tiền 70 / Có Doanh thu lãi 70; Nợ Chi phí dịch vụ ngân hàng 30 / Có Tiền 30; Nợ Phải thu khách hàng 250 / Có Tiền 250 (khách hàng vẫn còn nợ số tiền đó).</p>
<h3>Phải thu và nợ khó đòi</h3>
<p>Bán chịu giúp có thêm khách hàng — và sẽ có người không bao giờ trả. <strong>Phương pháp dự phòng</strong> (bắt buộc khi nợ khó đòi trọng yếu) ước tính tổn thất ngay trong kỳ bán hàng, theo nguyên tắc phù hợp:</p>
<ul>
<li><strong>Theo % doanh thu</strong> (tiếp cận báo cáo kết quả kinh doanh): chi phí nợ khó đòi = một tỉ lệ % của doanh thu bán chịu.</li>
<li><strong>Theo % phải thu / phân tích tuổi nợ</strong> (tiếp cận bảng cân đối): ước tính số dư dự phòng cần có, rồi điều chỉnh cho đủ.</li>
</ul>
<pre><code>Phân tích tuổi nợ (tổng phải thu 50.000)
Chưa đến hạn          30.000 x  1% =   300
Quá hạn 1–30 ngày     12.000 x  3% =   360
Quá hạn 31–60 ngày     5.000 x 10% =   500
Quá hạn trên 60 ngày   3.000 x 40% = 1.200
Dự phòng cần có                      2.360
Dự phòng đang có số dư Có 500 -> trích thêm 1.860
   Nợ Chi phí nợ khó đòi 1.860 / Có Dự phòng phải thu khó đòi 1.860
Giá trị thuần có thể thu hồi = 50.000 − 2.360 = 47.640</code></pre>
<p>Khi xoá sổ nợ của một khách hàng cụ thể (giả sử 400 $): Nợ Dự phòng 400 / Có Phải thu khách hàng 400. Không ghi thêm chi phí và giá trị thuần không đổi (49.600 − 1.960 = 47.640), vì tổn thất đã được ước tính từ trước. Ở Việt Nam, đây là khoản <em>dự phòng phải thu khó đòi</em>.</p>
<p><strong>Thương phiếu phải thu</strong> là cam kết trả tiền bằng văn bản, có lãi: lãi = gốc × lãi suất × thời gian. Thương phiếu 6.000 $, lãi 10%, kỳ hạn 90 ngày có lãi 6.000 × 10% × 90/360 = <strong>150 $</strong>.</p>
<div class="callout"><span class="badge">Ghi nhớ</span> Theo phương pháp dự phòng, xoá sổ một khoản nợ ghi vào tài khoản dự phòng chứ không vào chi phí — chi phí đã được ghi nhận khi lập ước tính.</div>`,
  ]]);

const c10 = doc('acc101-4-2-long-term-assets', '4.2 — Plant assets, natural resources & intangibles|||4.2 — Tài sản cố định, tài nguyên & tài sản vô hình',
  'Xác định nguyên giá, 3 phương pháp khấu hao (đường thẳng, sản lượng, số dư giảm dần kép) có bảng tính, chi phí vốn hoá và chi phí trong kỳ, thanh lý tài sản, khấu hao tài nguyên và tài sản vô hình.',
  [[
    `<span class="eyebrow">ACC101 · Chapter 10 · Lesson 4.2</span>
<h2>Plant assets, natural resources &amp; intangibles</h2>
<h3>Cost of a plant asset</h3>
<p><strong>Plant assets</strong> (property, plant and equipment) are tangible, used in operations and last more than one period. Their cost includes every expenditure needed to get the asset ready for use: purchase price (net of discounts), non-refundable taxes, transport, installation and testing. In Vietnam an item is recognized as a fixed asset when its useful life exceeds one year and its cost is at least VND 30 million, under the current rules on fixed-asset management and depreciation.</p>
<h3>Depreciation methods</h3>
<p>Depreciation allocates <em>cost minus salvage value</em> over the useful life — it is cost allocation, not valuation. Example: a machine costs $50,000, salvage value $5,000, useful life 5 years or 90,000 units.</p>
<pre><code>Straight-line     (50,000 − 5,000) / 5 years  = 9,000 per year
Units-of-output   (50,000 − 5,000) / 90,000   = 0.50 per unit
                  Year 1 produces 20,000 units -> 10,000
Double-declining  rate = 2 / 5 = 40% of the BEGINNING book value
Year   Beginning BV   Depreciation        Ending BV
 1        50,000       20,000 (40%)        30,000
 2        30,000       12,000              18,000
 3        18,000        7,200              10,800
 4        10,800        4,320               6,480
 5         6,480        1,480 (to salvage)  5,000
Total                  45,000 = 50,000 − 5,000 ✓</code></pre>
<p>Declining balance ignores salvage in the rate but never depreciates below salvage — hence the smaller final year. In Vietnam the permitted methods are straight-line, declining balance with an adjustment coefficient, and units of production.</p>
<h3>Spending after acquisition and disposal</h3>
<ul>
<li><strong>Revenue expenditures</strong> (ordinary repairs, maintenance) keep the asset working — expense them.</li>
<li><strong>Capital expenditures</strong> (betterments, major overhauls that extend life or capacity) — add them to the asset's cost.</li>
</ul>
<p>On disposal, record depreciation up to the date, remove the cost and the accumulated depreciation, and recognize a gain or loss = proceeds − book value. Selling equipment that cost $20,000 with $15,000 accumulated depreciation (book value $5,000) for $6,500:</p>
<pre><code>Dr Cash                       6,500
Dr Accumulated depreciation  15,000
    Cr Equipment                      20,000
    Cr Gain on sale of equipment       1,500</code></pre>
<h3>Natural resources and intangibles</h3>
<p><strong>Natural resources</strong> (mines, timber) are expensed through <em>depletion</em>, calculated like units-of-output. <strong>Intangible assets</strong> (patents, copyrights, trademarks, software) with a limited life are <em>amortized</em> over that life. <strong>Goodwill</strong> arises only when a business is purchased for more than the fair value of its net assets; under IFRS and US GAAP it is not amortized but tested for impairment.</p>
<div class="callout"><span class="badge">Watch out</span> Choosing a depreciation method changes the timing of expense, not the total: all three methods above depreciate exactly $45,000 over the asset's life.</div>`,
    `<span class="eyebrow">ACC101 · Chương 10 · Bài 4.2</span>
<h2>Tài sản cố định, tài nguyên &amp; tài sản vô hình</h2>
<h3>Nguyên giá tài sản cố định</h3>
<p><strong>Tài sản cố định hữu hình</strong> là tài sản có hình thái vật chất, dùng cho hoạt động kinh doanh và sử dụng qua nhiều kỳ. Nguyên giá gồm mọi khoản chi cần thiết để đưa tài sản vào trạng thái sẵn sàng sử dụng: giá mua (trừ chiết khấu), các khoản thuế không được hoàn lại, vận chuyển, lắp đặt và chạy thử. Ở Việt Nam, một tài sản được ghi nhận là tài sản cố định khi thời gian sử dụng trên một năm và nguyên giá từ 30 triệu đồng trở lên, theo quy định hiện hành về quản lý và trích khấu hao tài sản cố định.</p>
<h3>Các phương pháp khấu hao</h3>
<p>Khấu hao phân bổ <em>nguyên giá trừ giá trị thu hồi</em> qua thời gian sử dụng — đó là phân bổ chi phí, không phải định giá. Ví dụ: máy có nguyên giá 50.000 $, giá trị thu hồi 5.000 $, dùng 5 năm hoặc 90.000 sản phẩm.</p>
<pre><code>Đường thẳng           (50.000 − 5.000) / 5 năm   = 9.000 mỗi năm
Theo sản lượng        (50.000 − 5.000) / 90.000  = 0,50 mỗi sản phẩm
                      Năm 1 sản xuất 20.000 sp -> 10.000
Số dư giảm dần kép    tỉ lệ = 2 / 5 = 40% giá trị còn lại ĐẦU NĂM
Năm   GTCL đầu năm   Khấu hao           GTCL cuối năm
 1       50.000       20.000 (40%)        30.000
 2       30.000       12.000              18.000
 3       18.000        7.200              10.800
 4       10.800        4.320               6.480
 5        6.480        1.480 (về giá trị thu hồi) 5.000
Cộng                  45.000 = 50.000 − 5.000 ✓</code></pre>
<p>Số dư giảm dần không trừ giá trị thu hồi khi tính tỉ lệ nhưng không bao giờ khấu hao xuống dưới giá trị thu hồi — vì thế năm cuối nhỏ hơn. Ở Việt Nam, các phương pháp được phép là đường thẳng, số dư giảm dần có điều chỉnh (nhân hệ số điều chỉnh) và theo số lượng, khối lượng sản phẩm.</p>
<h3>Chi tiêu sau khi mua và thanh lý</h3>
<ul>
<li><strong>Chi phí trong kỳ</strong> (sửa chữa thường xuyên, bảo trì) giữ tài sản hoạt động bình thường — ghi vào chi phí.</li>
<li><strong>Chi phí vốn hoá</strong> (nâng cấp, đại tu làm tăng tuổi thọ hoặc công suất) — cộng vào nguyên giá.</li>
</ul>
<p>Khi thanh lý: trích khấu hao tới ngày thanh lý, ghi giảm nguyên giá và hao mòn luỹ kế, ghi nhận lãi hoặc lỗ = số tiền thu − giá trị còn lại. Bán thiết bị nguyên giá 20.000 $, đã hao mòn 15.000 $ (giá trị còn lại 5.000 $) với giá 6.500 $:</p>
<pre><code>Nợ Tiền                      6.500
Nợ Hao mòn luỹ kế           15.000
    Có Thiết bị                       20.000
    Có Lãi thanh lý thiết bị           1.500</code></pre>
<h3>Tài nguyên thiên nhiên và tài sản vô hình</h3>
<p><strong>Tài nguyên thiên nhiên</strong> (mỏ, rừng) được đưa vào chi phí qua <em>khấu hao tài nguyên (depletion)</em>, tính giống phương pháp sản lượng. <strong>Tài sản vô hình</strong> (bằng sáng chế, bản quyền, nhãn hiệu, phần mềm) có thời hạn sử dụng xác định được <em>phân bổ</em> dần theo thời hạn đó. <strong>Lợi thế thương mại</strong> chỉ phát sinh khi mua một doanh nghiệp với giá cao hơn giá trị hợp lý của tài sản thuần; theo IFRS và US GAAP nó không được phân bổ mà được kiểm tra suy giảm giá trị.</p>
<div class="callout"><span class="badge">Lưu ý</span> Chọn phương pháp khấu hao chỉ thay đổi thời điểm ghi chi phí, không thay đổi tổng số: cả ba phương pháp trên đều khấu hao đúng 45.000 $ trong suốt đời tài sản.</div>`,
  ]]);

const c11 = doc('acc101-4-3-liabilities-payroll-vat', '4.3 — Current liabilities, payroll & Vietnamese VAT|||4.3 — Nợ ngắn hạn, tiền lương & thuế GTGT Việt Nam',
  'Nợ phải trả xác định, ước tính và tiềm tàng; thương phiếu phải trả; hạch toán tiền lương và các khoản trích theo lương ở Việt Nam; thuế GTGT theo phương pháp khấu trừ và trực tiếp với bút toán TK 133/3331.',
  [[
    `<span class="eyebrow">ACC101 · Chapter 11 · Lesson 4.3</span>
<h2>Current liabilities, payroll &amp; Vietnamese VAT</h2>
<h3>Three kinds of liabilities</h3>
<table>
<tr><th>Kind</th><th>Examples</th><th>Treatment</th></tr>
<tr><td>Known (definite)</td><td>Accounts payable, short-term notes, taxes payable, unearned revenue, current portion of long-term debt</td><td>Record at the amount owed</td></tr>
<tr><td>Estimated</td><td>Warranties, employee bonuses</td><td>Record an estimate in the period of the related sale or work</td></tr>
<tr><td>Contingent</td><td>A pending lawsuit, a guarantee of another party's debt</td><td>Record if probable and estimable; disclose in the notes if only possible; ignore if remote</td></tr>
</table>
<pre><code>Short-term note: borrow 10,000 at 12% for 90 days
   Interest = 10,000 x 12% x 90/360 = 300
   At maturity: Dr Notes payable 10,000 / Dr Interest expense 300 / Cr Cash 10,300
Warranty: 1,000 units sold; 2% expected to need repair at $50 each
   Dr Warranty expense 1,000 / Cr Estimated warranty liability 1,000</code></pre>
<h3>Payroll</h3>
<p>Gross pay − employee withholdings (personal income tax, the employee's share of social, health and unemployment insurance) = <strong>net pay</strong>. The employer's own contributions are an <em>extra</em> expense on top of gross pay. A Vietnamese example with a gross monthly salary of VND 20,000,000, using the commonly applied rates (employee 10.5%: social 8%, health 1.5%, unemployment 1%; employer 21.5%: social 17.5%, health 3%, unemployment 1%; plus a 2% trade-union fee) — always check the rates in force:</p>
<pre><code>Salary expense                    Dr 642  20,000,000 / Cr 334  20,000,000
Employer contributions (21.5%+2%) Dr 642   4,700,000 / Cr 338   4,700,000
Employee deductions (10.5%)       Dr 334   2,100,000 / Cr 338   2,100,000
Pay net salary (before PIT)       Dr 334  17,900,000 / Cr 112  17,900,000
Total cost to the employer = 20,000,000 + 4,700,000 = 24,700,000</code></pre>
<h3>Value Added Tax (VAT) in Vietnam</h3>
<p>VAT is an indirect tax on the value added at each stage of production and distribution; the final consumer bears it. Businesses using the <strong>credit (deduction) method</strong> charge <em>output VAT</em> on sales and deduct the <em>input VAT</em> paid on purchases:</p>
<pre><code>VAT payable = Output VAT − Deductible input VAT</code></pre>
<p>Rates are 0% (mainly exports), 5% (certain essential goods and services) and 10% (the standard rate); in some recent periods the government has temporarily reduced the 10% rate for selected goods, so check the regulation in force. Small businesses and household businesses without full bookkeeping may use the <strong>direct method</strong>: VAT = revenue × a fixed percentage by type of activity.</p>
<pre><code>Buy goods 100,000,000 + VAT 10% on credit
   Dr 156  100,000,000 / Dr 1331 10,000,000 / Cr 331 110,000,000
Sell them for 150,000,000 + VAT 10% on credit
   Dr 131  165,000,000 / Cr 511 150,000,000 / Cr 33311 15,000,000
Month-end offset of input against output VAT
   Dr 33311 10,000,000 / Cr 1331 10,000,000
Pay the balance: 15,000,000 − 10,000,000 = 5,000,000
   Dr 33311  5,000,000 / Cr 112 5,000,000</code></pre>
<div class="callout"><span class="badge">Key idea</span> For a business on the credit method, VAT is neither revenue nor expense: output VAT is a liability to the state (3331) and input VAT is a receivable from it (133). Revenue is recorded net of VAT.</div>`,
    `<span class="eyebrow">ACC101 · Chương 11 · Bài 4.3</span>
<h2>Nợ ngắn hạn, tiền lương &amp; thuế GTGT Việt Nam</h2>
<h3>Ba loại nợ phải trả</h3>
<table>
<tr><th>Loại</th><th>Ví dụ</th><th>Cách xử lý</th></tr>
<tr><td>Xác định</td><td>Phải trả người bán, thương phiếu ngắn hạn, thuế phải nộp, doanh thu nhận trước, nợ dài hạn đến hạn trả</td><td>Ghi theo số phải trả</td></tr>
<tr><td>Ước tính</td><td>Bảo hành sản phẩm, thưởng nhân viên</td><td>Ghi số ước tính vào kỳ phát sinh doanh thu hoặc công việc liên quan</td></tr>
<tr><td>Tiềm tàng</td><td>Vụ kiện đang chờ xử, bảo lãnh nợ cho bên khác</td><td>Ghi nhận nếu có khả năng xảy ra và ước tính được; chỉ thuyết minh nếu chỉ có thể xảy ra; bỏ qua nếu khả năng rất thấp</td></tr>
</table>
<pre><code>Thương phiếu ngắn hạn: vay 10.000, lãi 12%, kỳ hạn 90 ngày
   Lãi = 10.000 x 12% x 90/360 = 300
   Khi đáo hạn: Nợ Thương phiếu phải trả 10.000 / Nợ Chi phí lãi vay 300 / Có Tiền 10.300
Bảo hành: bán 1.000 sản phẩm; dự kiến 2% cần sửa, 50 $ mỗi chiếc
   Nợ Chi phí bảo hành 1.000 / Có Dự phòng bảo hành phải trả 1.000</code></pre>
<h3>Tiền lương</h3>
<p>Lương gộp − các khoản khấu trừ của người lao động (thuế thu nhập cá nhân, phần bảo hiểm xã hội, y tế, thất nghiệp do người lao động đóng) = <strong>lương thực lĩnh</strong>. Phần doanh nghiệp đóng là chi phí <em>thêm</em> ngoài lương gộp. Ví dụ Việt Nam với lương gộp tháng 20.000.000 đồng, theo các tỉ lệ đang áp dụng phổ biến (người lao động 10,5%: BHXH 8%, BHYT 1,5%, BHTN 1%; doanh nghiệp 21,5%: BHXH 17,5%, BHYT 3%, BHTN 1%; cộng kinh phí công đoàn 2%) — luôn kiểm tỉ lệ đang có hiệu lực:</p>
<pre><code>Chi phí tiền lương                 Nợ 642  20.000.000 / Có 334  20.000.000
Doanh nghiệp đóng (21,5% + 2%)      Nợ 642   4.700.000 / Có 338   4.700.000
Khấu trừ lương người lao động 10,5% Nợ 334   2.100.000 / Có 338   2.100.000
Trả lương thực lĩnh (trước thuế TNCN) Nợ 334 17.900.000 / Có 112 17.900.000
Tổng chi phí của doanh nghiệp = 20.000.000 + 4.700.000 = 24.700.000</code></pre>
<h3>Thuế giá trị gia tăng (GTGT) ở Việt Nam</h3>
<p>Thuế GTGT là thuế gián thu tính trên phần giá trị tăng thêm ở mỗi khâu sản xuất, lưu thông; người tiêu dùng cuối cùng là người chịu thuế. Doanh nghiệp theo <strong>phương pháp khấu trừ</strong> tính <em>thuế GTGT đầu ra</em> trên hàng bán và được khấu trừ <em>thuế GTGT đầu vào</em> đã trả khi mua hàng:</p>
<pre><code>Thuế GTGT phải nộp = Thuế GTGT đầu ra − Thuế GTGT đầu vào được khấu trừ</code></pre>
<p>Thuế suất gồm 0% (chủ yếu hàng xuất khẩu), 5% (một số hàng hoá, dịch vụ thiết yếu) và 10% (thuế suất phổ thông); trong một số giai đoạn gần đây Nhà nước tạm giảm mức 10% cho một số nhóm hàng, nên cần kiểm văn bản đang có hiệu lực. Hộ và doanh nghiệp nhỏ không thực hiện đầy đủ chế độ kế toán có thể áp dụng <strong>phương pháp trực tiếp</strong>: thuế GTGT = doanh thu × tỉ lệ % cố định theo từng nhóm ngành nghề.</p>
<pre><code>Mua hàng 100.000.000 + thuế GTGT 10%, chưa trả tiền
   Nợ 156  100.000.000 / Nợ 1331 10.000.000 / Có 331 110.000.000
Bán số hàng đó giá 150.000.000 + thuế GTGT 10%, khách chưa trả
   Nợ 131  165.000.000 / Có 511 150.000.000 / Có 33311 15.000.000
Cuối tháng khấu trừ thuế đầu vào với đầu ra
   Nợ 33311 10.000.000 / Có 1331 10.000.000
Nộp phần còn lại: 15.000.000 − 10.000.000 = 5.000.000
   Nợ 33311  5.000.000 / Có 112 5.000.000</code></pre>
<div class="callout"><span class="badge">Ý chính</span> Với doanh nghiệp theo phương pháp khấu trừ, thuế GTGT không phải doanh thu hay chi phí: thuế đầu ra là khoản phải nộp Nhà nước (TK 3331), thuế đầu vào là khoản được khấu trừ (TK 133). Doanh thu được ghi theo giá chưa có thuế GTGT.</div>`,
  ]]);

const c8q = quiz('acc101-quiz-4', 'Quiz 4 — Cash, assets, liabilities & VAT|||Quiz 4 — Tiền, tài sản, nợ phải trả & thuế GTGT', [
  { id: 'q1', question: 'In a bank reconciliation, a deposit in transit is…|||Trong bảng đối chiếu ngân hàng, khoản tiền đang chuyển được…', options: ['subtracted from the book balance|||trừ vào số dư sổ sách', 'added to the bank statement balance|||cộng vào số dư sổ phụ ngân hàng', 'subtracted from the bank statement balance|||trừ vào số dư sổ phụ ngân hàng', 'added to the book balance with a journal entry|||cộng vào số dư sổ sách kèm bút toán'], correctIndex: 1, explanation: 'The company has already recorded the deposit; only the bank has not, so it is added on the bank side and needs no entry.|||Doanh nghiệp đã ghi khoản nộp này, chỉ ngân hàng chưa ghi, nên cộng bên ngân hàng và không cần bút toán.' },
  { id: 'q2', question: 'Cost $40,000, salvage value $4,000, useful life 6 years. Annual straight-line depreciation?|||Nguyên giá 40.000 $, giá trị thu hồi 4.000 $, dùng 6 năm. Khấu hao đường thẳng mỗi năm?', options: ['$6,000|||6.000 $', '$6,667|||6.667 $', '$7,200|||7.200 $', '$4,000|||4.000 $'], correctIndex: 0, explanation: '(40,000 − 4,000) / 6 = 6,000 per year.|||(40.000 − 4.000) / 6 = 6.000 mỗi năm.' },
  { id: 'q3', question: 'A business on the VAT credit method has output VAT of 30 million and deductible input VAT of 22 million. VAT payable?|||Doanh nghiệp theo phương pháp khấu trừ có thuế GTGT đầu ra 30 triệu, đầu vào được khấu trừ 22 triệu. Thuế GTGT phải nộp?', options: ['52 million|||52 triệu', '8 million|||8 triệu', '30 million|||30 triệu', '22 million|||22 triệu'], correctIndex: 1, explanation: 'VAT payable = output VAT − deductible input VAT = 30 − 22 = 8 million.|||Thuế phải nộp = đầu ra − đầu vào được khấu trừ = 30 − 22 = 8 triệu.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'ACC101',
    slug: 'acc101-principles-of-accounting',
    title: 'Principles of Accounting',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/ACC101.webp',
    shortDescription: 'The language of business: the accounting equation, debits and credits, adjusting and closing entries, inventory costing (FIFO, weighted average), bank reconciliation, receivables, depreciation, payroll and Vietnamese VAT. Bilingual, with exercises and quizzes.|||Ngôn ngữ của kinh doanh: phương trình kế toán, Nợ/Có, điều chỉnh và khoá sổ, tính giá hàng tồn kho (FIFO, bình quân), đối chiếu ngân hàng, phải thu, khấu hao, tiền lương và thuế GTGT. Song ngữ, có bài tập và quiz.',
    description: 'Môn <strong>ACC101 — Principles of Accounting (Nguyên lý kế toán)</strong> dạy nền tảng kế toán tài chính theo giáo trình Wild — <em>Fundamental Accounting Principles</em>. Từ <strong>phương trình kế toán</strong> và <strong>ghi sổ kép</strong> (Nợ/Có, nhật ký, sổ cái, bảng cân đối thử) → <strong>bút toán điều chỉnh, khoá sổ</strong> và chu trình kế toán → <strong>kế toán thương mại</strong> và <strong>tính giá hàng tồn kho</strong> → <strong>tiền, phải thu, tài sản cố định</strong> → <strong>nợ phải trả, tiền lương và thuế GTGT Việt Nam</strong>. Song ngữ Anh–Việt, bám đề cương FLM, mọi ví dụ số đều kiểm cân được, có bài tập kèm lời giải và quiz cuối mỗi chương.',
    whatYouLearn: 'Đọc và giải thích 4 báo cáo tài chính cùng mối liên hệ giữa chúng\nPhân tích nghiệp vụ bằng phương trình Tài sản = Nợ phải trả + Vốn chủ sở hữu\nGhi sổ kép: quy tắc Nợ/Có, sổ nhật ký, sổ cái và bảng cân đối thử\nLập bút toán điều chỉnh (trả trước, khấu hao, nhận trước, dồn tích) và bút toán khoá sổ\nHạch toán mua bán hàng theo kê khai thường xuyên; tính giá vốn theo FIFO và bình quân gia quyền\nLập bảng đối chiếu ngân hàng; ước tính dự phòng phải thu khó đòi theo tuổi nợ\nTính khấu hao đường thẳng, theo sản lượng, số dư giảm dần; ghi thanh lý tài sản\nHạch toán nợ ngắn hạn, tiền lương và thuế GTGT theo phương pháp khấu trừ',
    requirements: 'Không cần kiến thức kế toán trước (môn không có môn tiên quyết)\nToán phổ thông: cộng trừ nhân chia và tỉ lệ phần trăm\nNên dùng bảng tính (Excel hoặc Google Sheets) để luyện bài tập',
  },
  sections: [
    { title: 'Course introduction|||Giới thiệu môn học', description: 'Kế toán là gì, ai dùng, chuẩn đầu ra, lộ trình.', lessons: [intro] },
    { title: 'Chapters 1–2 — The accounting equation & double-entry|||Chương 1–2 — Phương trình kế toán & ghi sổ kép', description: 'Nguyên tắc, phương trình kế toán, 4 báo cáo, Nợ/Có, nhật ký, sổ cái, cân đối thử.', lessons: [c1, c2, c1e, c1q] },
    { title: 'Chapters 3–4 — Adjusting & the accounting cycle|||Chương 3–4 — Điều chỉnh & chu trình kế toán', description: 'Dồn tích, 5 loại bút toán điều chỉnh, khoá sổ, bảng cân đối phân loại.', lessons: [c3, c3e, c3q] },
    { title: 'Chapters 5–6 — Merchandising & inventories|||Chương 5–6 — Kế toán thương mại & hàng tồn kho', description: 'Kê khai thường xuyên, chiết khấu, giá vốn, FIFO/bình quân, giá trị thuần.', lessons: [c5, c5e, c5q] },
    { title: 'Chapters 8–11 — Cash, receivables, assets, liabilities & VAT|||Chương 8–11 — Tiền, phải thu, tài sản, nợ phải trả & thuế GTGT', description: 'Kiểm soát nội bộ, đối chiếu ngân hàng, dự phòng, khấu hao, tiền lương, thuế GTGT.', lessons: [c8, c10, c11, c8q] },
  ],
};
