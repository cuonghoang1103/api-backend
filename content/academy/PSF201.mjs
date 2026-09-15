/**
 * PSF201 — Personal Finance. Giáo trình FLM (trích dẫn, không upload PDF):
 * "Personal Finance" (Kapoor/Dlabay/Hughes); "Personal Finance" (Madura);
 * "The Psychology of Money" (Housel). 8 chương: tổng quan & lập kế hoạch,
 * ngân sách & dòng tiền, nợ & tín dụng, tiết kiệm & quỹ khẩn cấp, đầu tư cơ
 * bản, bảo hiểm & rủi ro, thuế TNCN & nghỉ hưu, tài sản & tâm lý tiền bạc.
 * Giữ NGUYÊN slug/semester/thumb(v3). KHÔNG backtick/${}; "\n" -> \\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('psf201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (kèm trích dẫn), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">PSF201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Personal Finance — financial planning, budgeting, debt, saving, investing, insurance, taxes, retirement and estate planning — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giao trinh &amp; lecture slides for PSF201 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><strong>Personal Finance</strong> — Kapoor, Dlabay &amp; Hughes (McGraw Hill). Core FLM textbook: financial planning, budgeting, credit, investing, insurance and retirement, chapter by chapter.</li>
<li><strong>Personal Finance</strong> — Jeff Madura (Pearson). A second widely used course text, strong on the math behind budgeting, credit cost and investment returns.</li>
<li><a href="https://en.wikipedia.org/wiki/The_Psychology_of_Money" target="_blank" rel="noopener"><em>The Psychology of Money</em> — Morgan Housel</a>. Short, non-technical: why behavior — not formulas — decides most financial outcomes.</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.investor.gov/" target="_blank" rel="noopener">Investor.gov (U.S. SEC)</a> — plain-language guides on saving, investing and avoiding fraud, plus free calculators.</li>
<li><a href="https://www.consumerfinance.gov/consumer-tools/" target="_blank" rel="noopener">Consumer Financial Protection Bureau — consumer tools</a> — budgeting, credit reports, debt and mortgages.</li>
<li><a href="https://www.investopedia.com/personal-finance-4427760" target="_blank" rel="noopener">Investopedia — Personal Finance hub</a> — glossary-depth articles on every topic in this course.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@TheFinancialDiet" target="_blank" rel="noopener">The Financial Diet</a> — budgeting, debt and money habits for young adults.</li>
<li><a href="https://www.youtube.com/@twocentspbs" target="_blank" rel="noopener">Two Cents (PBS)</a> — short, well-researched explainers on saving, credit and investing.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator" target="_blank" rel="noopener">Investor.gov — Compound Interest Calculator</a></li>
<li><a href="https://www.nerdwallet.com/article/finance/budget-calculator" target="_blank" rel="noopener">NerdWallet — Budget Calculator (50/30/20)</a></li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — net worth, cash flow, the 50/30/20 rule, credit score basics, compound interest.</li>
<li><strong>Practice</strong> — build a one-month budget from your own numbers and a net-worth statement.</li>
<li><strong>Go deeper</strong> — debt payoff strategy, stocks vs bonds vs funds, insurance types, tax brackets.</li>
<li><strong>Job-ready</strong> — set a retirement contribution rate and write a one-page personal financial plan.</li>
</ol></div>`,
    `<span class="eyebrow">PSF201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Tài chính Cá nhân — lập kế hoạch tài chính, ngân sách, nợ, tiết kiệm, đầu tư, bảo hiểm, thuế và nghỉ hưu — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của PSF201 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><strong>Personal Finance</strong> — Kapoor, Dlabay &amp; Hughes (McGraw Hill). Giáo trình gốc của FLM: lập kế hoạch tài chính, ngân sách, tín dụng, đầu tư, bảo hiểm và nghỉ hưu, theo từng chương.</li>
<li><strong>Personal Finance</strong> — Jeff Madura (Pearson). Giáo trình phổ biến thứ hai, mạnh về phần toán học đằng sau ngân sách, chi phí tín dụng và lợi suất đầu tư.</li>
<li><a href="https://en.wikipedia.org/wiki/The_Psychology_of_Money" target="_blank" rel="noopener"><em>The Psychology of Money</em> — Morgan Housel</a>. Ngắn, không cần toán: hành vi — không phải công thức — quyết định phần lớn kết quả tài chính.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.investor.gov/" target="_blank" rel="noopener">Investor.gov (SEC Hoa Kỳ)</a> — hướng dẫn dễ hiểu về tiết kiệm, đầu tư, tránh lừa đảo, kèm công cụ tính miễn phí.</li>
<li><a href="https://www.consumerfinance.gov/consumer-tools/" target="_blank" rel="noopener">Consumer Financial Protection Bureau — công cụ cho người tiêu dùng</a> — ngân sách, báo cáo tín dụng, nợ và vay mua nhà.</li>
<li><a href="https://www.investopedia.com/personal-finance-4427760" target="_blank" rel="noopener">Investopedia — chuyên mục Personal Finance</a> — bài viết chi tiết cho mọi chủ đề trong môn này.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@TheFinancialDiet" target="_blank" rel="noopener">The Financial Diet</a> — ngân sách, nợ và thói quen tiền bạc cho người trẻ.</li>
<li><a href="https://www.youtube.com/@twocentspbs" target="_blank" rel="noopener">Two Cents (PBS)</a> — video ngắn, nghiên cứu kỹ về tiết kiệm, tín dụng và đầu tư.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator" target="_blank" rel="noopener">Investor.gov — máy tính lãi kép</a></li>
<li><a href="https://www.nerdwallet.com/article/finance/budget-calculator" target="_blank" rel="noopener">NerdWallet — máy tính ngân sách (50/30/20)</a></li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — tài sản thuần, dòng tiền, quy tắc 50/30/20, điểm tín dụng, lãi kép.</li>
<li><strong>Luyện tập</strong> — tự dựng ngân sách một tháng và bảng tài sản thuần từ số liệu của chính bạn.</li>
<li><strong>Đào sâu thực tế</strong> — chiến lược trả nợ, cổ phiếu vs trái phiếu vs quỹ, các loại bảo hiểm, khung thuế.</li>
<li><strong>Sẵn sàng đi làm</strong> — đặt tỉ lệ đóng góp nghỉ hưu và viết một trang kế hoạch tài chính cá nhân.</li>
</ol></div>`,
  ]]);

const intro = doc('psf201-0-1-overview', 'Course overview: Personal Finance|||Tổng quan: Tài chính Cá nhân',
  'Tài chính cá nhân làm gì; tài sản thuần, dòng tiền; lộ trình: lập kế hoạch → ngân sách → nợ/tín dụng → tiết kiệm → đầu tư → bảo hiểm → thuế/nghỉ hưu → tài sản & tâm lý tiền bạc.',
  [[
    `<span class="eyebrow">PSF201 · Lesson 0.1 · Overview</span>
<h2>Personal Finance</h2>
<p class="lead">This course helps you make <strong>deliberate decisions about your own money</strong> — how much to spend, save, borrow and invest so your income actually moves you toward your goals, instead of just disappearing. You will build the habit of measuring where you stand and planning where you are going.</p>
<h3>The three fundamentals</h3>
<ul>
<li><strong>Net worth</strong> — what you own minus what you owe; your financial snapshot at a point in time.</li>
<li><strong>Cash flow</strong> — money in minus money out over a period; whether you are gaining or losing ground.</li>
<li><strong>Financial goals</strong> — specific, time-bound targets (an emergency fund, a house, retirement) that turn saving into a plan instead of a vague wish.</li>
</ul>
<p>Nearly every topic in this course is one of these three ideas applied to a specific decision: a budget is cash flow made explicit, an investment portfolio is net worth working for you, insurance protects your net worth from a single bad event.</p>
<h3>Roadmap</h3>
<p>Overview &amp; financial planning → budgeting &amp; cash flow → debt &amp; credit → saving &amp; emergency funds → basic investing → insurance &amp; risk management → income tax &amp; retirement → estate planning, long-term goals and the psychology of money. Bilingual, with worked examples and quizzes.</p>`,
    `<span class="eyebrow">PSF201 · Bài 0.1 · Tổng quan</span>
<h2>Tài chính Cá nhân</h2>
<p class="lead">Môn này giúp bạn <strong>ra quyết định có chủ đích với tiền của chính mình</strong> — chi bao nhiêu, để dành bao nhiêu, vay và đầu tư thế nào để thu nhập thật sự đưa bạn tới mục tiêu, thay vì chỉ biến mất. Bạn sẽ hình thành thói quen đo xem mình đang ở đâu và lên kế hoạch cho việc mình sẽ đi đâu.</p>
<h3>Ba đại lượng nền tảng</h3>
<ul>
<li><strong>Tài sản thuần (net worth)</strong> — thứ bạn sở hữu trừ thứ bạn nợ; ảnh chụp tài chính tại một thời điểm.</li>
<li><strong>Dòng tiền (cash flow)</strong> — tiền vào trừ tiền ra trong một kỳ; bạn đang tiến hay lùi.</li>
<li><strong>Mục tiêu tài chính</strong> — chỉ tiêu cụ thể, có hạn thời gian (quỹ khẩn cấp, mua nhà, nghỉ hưu) biến việc để dành thành một kế hoạch thay vì một ước muốn mơ hồ.</li>
</ul>
<p>Gần như mọi chủ đề trong môn này là một trong ba ý tưởng trên áp vào một quyết định cụ thể: ngân sách là dòng tiền được viết ra rõ ràng, danh mục đầu tư là tài sản thuần đang làm việc cho bạn, bảo hiểm bảo vệ tài sản thuần khỏi một sự cố xấu duy nhất.</p>
<h3>Lộ trình</h3>
<p>Tổng quan &amp; lập kế hoạch tài chính → ngân sách &amp; dòng tiền → nợ &amp; tín dụng → tiết kiệm &amp; quỹ khẩn cấp → đầu tư cơ bản → bảo hiểm &amp; quản trị rủi ro → thuế thu nhập &amp; nghỉ hưu → hoạch định tài sản, mục tiêu dài hạn và tâm lý tiền bạc. Song ngữ, có ví dụ mẫu và quiz.</p>`,
  ]]);

const c1 = doc('psf201-1-1-overview-planning', '1.1 — Personal finance overview & financial planning|||1.1 — Tổng quan tài chính cá nhân & lập kế hoạch',
  'Tài chính cá nhân là gì, quy trình lập kế hoạch 5 bước, tài sản thuần (net worth), chu kỳ đời tài chính.',
  [[
    `<span class="eyebrow">PSF201 · Chapter 1 · Lesson 1.1</span>
<h2>Personal finance overview &amp; financial planning</h2>
<h3>What is personal finance?</h3>
<p><strong>Personal finance</strong> is the practice of managing your money — earning, spending, saving, borrowing, investing and protecting it — to meet your life goals. It is not about being rich; it is about making your limited income do what you actually want it to do.</p>
<h3>The financial planning process</h3>
<ol>
<li><strong>Set SMART goals</strong> — specific, measurable, achievable, relevant, time-bound (e.g. "save 30,000,000 VND in 12 months for an emergency fund").</li>
<li><strong>Assess your current situation</strong> — build a net worth statement and a cash flow statement.</li>
<li><strong>Create a plan</strong> — choose the budgeting, saving and investing actions that close the gap between where you are and your goal.</li>
<li><strong>Implement the plan</strong> — automate transfers, open the right accounts, start.</li>
<li><strong>Review &amp; revise</strong> — life changes; revisit the plan at least once a year.</li>
</ol>
<h3>Net worth: your financial snapshot</h3>
<pre><code>Net Worth = Total Assets − Total Liabilities

 Assets (what you own):
   cash, savings, investments, property, vehicle
 Liabilities (what you owe):
   credit card balance, student loan, car loan, mortgage
</code></pre>
<div class="callout"><span class="badge">Financial life cycle</span> Young adults typically focus on building income and managing early debt; mid-career shifts toward growing investments and funding a family; near retirement shifts again toward preserving what was built. The RIGHT plan changes with the stage — there is no single plan for everyone.</div>`,
    `<span class="eyebrow">PSF201 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan tài chính cá nhân &amp; lập kế hoạch tài chính</h2>
<h3>Tài chính cá nhân là gì?</h3>
<p><strong>Tài chính cá nhân</strong> là việc quản lý tiền của bạn — kiếm, chi, để dành, vay, đầu tư và bảo vệ nó — để đạt các mục tiêu sống. Đây không phải là làm giàu; đây là làm cho khoản thu nhập có hạn của bạn thực hiện đúng điều bạn muốn.</p>
<h3>Quy trình lập kế hoạch tài chính</h3>
<ol>
<li><strong>Đặt mục tiêu SMART</strong> — cụ thể, đo được, khả thi, liên quan, có hạn thời gian (vd "để dành 30.000.000đ trong 12 tháng làm quỹ khẩn cấp").</li>
<li><strong>Đánh giá tình hình hiện tại</strong> — lập bảng tài sản thuần và bảng dòng tiền.</li>
<li><strong>Lập kế hoạch</strong> — chọn hành động ngân sách, tiết kiệm, đầu tư để lấp khoảng cách giữa hiện tại và mục tiêu.</li>
<li><strong>Thực hiện kế hoạch</strong> — tự động hoá chuyển khoản, mở đúng loại tài khoản, bắt đầu ngay.</li>
<li><strong>Xem lại &amp; điều chỉnh</strong> — cuộc sống thay đổi; xem lại kế hoạch ít nhất mỗi năm một lần.</li>
</ol>
<h3>Tài sản thuần: ảnh chụp tài chính của bạn</h3>
<pre><code>Tài sản thuần = Tổng Tài sản − Tổng Nợ phải trả

 Tài sản (thứ bạn sở hữu):
   tiền mặt, tiết kiệm, đầu tư, bất động sản, xe
 Nợ phải trả (thứ bạn nợ):
   dư nợ thẻ tín dụng, vay sinh viên, vay mua xe, vay mua nhà
</code></pre>
<div class="callout"><span class="badge">Chu kỳ đời tài chính</span> Người trẻ thường tập trung xây thu nhập và quản lý nợ ban đầu; giữa sự nghiệp chuyển sang tăng trưởng đầu tư và nuôi gia đình; gần nghỉ hưu lại chuyển sang gìn giữ những gì đã xây được. Kế hoạch ĐÚNG thay đổi theo giai đoạn — không có một kế hoạch duy nhất cho mọi người.</div>`,
  ]]);

const c1q = quiz('psf201-quiz-1', 'Quiz 1 — Overview & planning|||Quiz 1 — Tổng quan & lập kế hoạch', [
  { id: 'q1', question: 'Công thức tính tài sản thuần (net worth) là gì?', options: ['Tổng thu nhập − Tổng chi phí', 'Tổng Tài sản − Tổng Nợ phải trả', 'Tổng Tài sản + Tổng Nợ phải trả', 'Tiền mặt − Nợ thẻ tín dụng'], correctIndex: 1, explanation: 'Net worth = Tài sản (thứ bạn sở hữu) trừ Nợ phải trả (thứ bạn nợ).' },
  { id: 'q2', question: 'Mục tiêu tài chính "SMART" nhấn mạnh những đặc điểm nào?', options: ['Sáng tạo, mạo hiểm, mới lạ', 'Cụ thể, đo được, khả thi, liên quan, có hạn thời gian', 'Số tiền lớn, mua ngay, trả sau', 'Bí mật, không chia sẻ'], correctIndex: 1, explanation: 'SMART = specific, measurable, achievable, relevant, time-bound.' },
  { id: 'q3', question: 'Bước đầu tiên trong quy trình lập kế hoạch tài chính là gì?', options: ['Thực hiện kế hoạch ngay', 'Đặt mục tiêu tài chính rõ ràng', 'Xem lại kế hoạch mỗi năm', 'Vay tiền để đầu tư'], correctIndex: 1, explanation: 'Quy trình bắt đầu từ việc đặt mục tiêu SMART, rồi mới đánh giá, lập kế hoạch, thực hiện, xem lại.' },
]);

const c2 = doc('psf201-2-1-budgeting-cashflow', '2.1 — Budgeting & cash flow management|||2.1 — Lập ngân sách & quản lý dòng tiền',
  'Bảng dòng tiền, quy tắc 50/30/20, ngân sách từ-số-0 (zero-based), trả cho mình trước.',
  [[
    `<span class="eyebrow">PSF201 · Chapter 2 · Lesson 2.1</span>
<h2>Budgeting &amp; cash flow management</h2>
<h3>The cash flow statement</h3>
<pre><code>Net Cash Flow = Total Income − Total Expenses

 Income:  salary, side income, interest, gifts
 Expenses: fixed (rent, loan payment) + variable (food, transport, entertainment)
</code></pre>
<p>A positive net cash flow is money available to save or invest; a negative one means you are spending more than you earn — usually financed by debt.</p>
<h3>Budgeting methods</h3>
<ul>
<li><strong>50/30/20 rule</strong> — a simple starting split: 50% needs (rent, food, utilities), 30% wants (dining out, entertainment), 20% savings &amp; debt payoff.</li>
<li><strong>Zero-based budgeting</strong> — every unit of income is assigned a job (spend, save or invest) until Income − Allocations = 0; nothing is left unaccounted for.</li>
</ul>
<pre><code>Example monthly budget (income 15,000,000 VND):
 Needs      50% = 7,500,000  (rent, utilities, groceries)
 Wants      30% = 4,500,000  (dining out, entertainment)
 Savings    20% = 3,000,000  (emergency fund + investing)
</code></pre>
<div class="callout"><span class="badge">Pay yourself first</span> Transfer the savings portion to a separate account the moment income arrives — before any spending happens. What is spent first is rarely what gets saved last.</div>`,
    `<span class="eyebrow">PSF201 · Chương 2 · Bài 2.1</span>
<h2>Lập ngân sách &amp; quản lý dòng tiền</h2>
<h3>Bảng dòng tiền</h3>
<pre><code>Dòng tiền thuần = Tổng Thu nhập − Tổng Chi phí

 Thu nhập: lương, thu nhập phụ, tiền lãi, quà tặng
 Chi phí: cố định (thuê nhà, trả nợ vay) + biến đổi (ăn uống, đi lại, giải trí)
</code></pre>
<p>Dòng tiền thuần dương là tiền có sẵn để tiết kiệm hoặc đầu tư; dòng tiền thuần âm nghĩa là bạn chi nhiều hơn kiếm được — thường được bù bằng nợ.</p>
<h3>Các phương pháp lập ngân sách</h3>
<ul>
<li><strong>Quy tắc 50/30/20</strong> — cách chia đơn giản để bắt đầu: 50% nhu cầu thiết yếu (thuê nhà, ăn uống, điện nước), 30% mong muốn (ăn ngoài, giải trí), 20% tiết kiệm &amp; trả nợ.</li>
<li><strong>Ngân sách từ-số-0 (zero-based)</strong> — mỗi đồng thu nhập được giao một nhiệm vụ (chi, để dành hoặc đầu tư) cho tới khi Thu nhập − Phân bổ = 0; không có đồng nào bị bỏ sót.</li>
</ul>
<pre><code>Ví dụ ngân sách tháng (thu nhập 15.000.000đ):
 Nhu cầu    50% = 7.500.000  (thuê nhà, điện nước, thực phẩm)
 Mong muốn  30% = 4.500.000  (ăn ngoài, giải trí)
 Tiết kiệm  20% = 3.000.000  (quỹ khẩn cấp + đầu tư)
</code></pre>
<div class="callout"><span class="badge">Trả cho mình trước</span> Chuyển phần tiết kiệm sang một tài khoản riêng ngay khi thu nhập về — trước khi chi tiêu bất cứ gì. Cái gì chi trước thường là cái không bao giờ được để dành sau.</div>`,
  ]]);

const c2q = quiz('psf201-quiz-2', 'Quiz 2 — Budgeting & cash flow|||Quiz 2 — Ngân sách & dòng tiền', [
  { id: 'q1', question: 'Theo quy tắc 50/30/20, phần dành cho tiết kiệm & trả nợ là bao nhiêu?', options: ['50%', '30%', '20%', '10%'], correctIndex: 2, explanation: 'Quy tắc 50/30/20: 50% nhu cầu, 30% mong muốn, 20% tiết kiệm & trả nợ.' },
  { id: 'q2', question: 'Ngân sách "từ-số-0" (zero-based) nghĩa là gì?', options: ['Không chi tiêu gì cả trong tháng', 'Mọi đồng thu nhập được giao một nhiệm vụ cho tới khi phần chưa phân bổ bằng 0', 'Chỉ áp dụng khi thu nhập bằng 0', 'Xoá hết ngân sách cũ mỗi năm'], correctIndex: 1, explanation: 'Zero-based: Thu nhập − Phân bổ (chi + tiết kiệm + đầu tư) = 0.' },
  { id: 'q3', question: '"Trả cho mình trước" (pay yourself first) có nghĩa là?', options: ['Ưu tiên mua sắm cho bản thân trước', 'Chuyển phần tiết kiệm sang riêng ngay khi có thu nhập, trước khi chi tiêu', 'Trả hết nợ trước khi chi tiêu', 'Rút tiền tiết kiệm ra dùng trước'], correctIndex: 1, explanation: 'Nguyên tắc này đảm bảo phần tiết kiệm không bị "nuốt" bởi chi tiêu phát sinh.' },
]);

const c3 = doc('psf201-3-1-debt-credit', '3.1 — Debt & credit management|||3.1 — Quản lý nợ & tín dụng',
  'Điểm tín dụng, chi phí của nợ (APR), bẫy trả góp tối thiểu, chiến lược trả nợ snowball vs avalanche, tỉ lệ nợ/thu nhập (DTI).',
  [[
    `<span class="eyebrow">PSF201 · Chapter 3 · Lesson 3.1</span>
<h2>Debt &amp; credit management</h2>
<h3>What builds a credit score</h3>
<ul>
<li><strong>Payment history</strong> — the single biggest factor; paying on time, every time.</li>
<li><strong>Amounts owed</strong> — how much of your available credit you are using (utilization).</li>
<li><strong>Length of credit history</strong> — older, well-managed accounts help.</li>
<li><strong>New credit &amp; credit mix</strong> — too many new accounts at once, or only one type of credit, both hurt slightly.</li>
</ul>
<h3>The real cost of debt</h3>
<p>The <strong>APR</strong> (annual percentage rate) is the yearly cost of borrowing. Paying only the <strong>minimum payment</strong> on a credit card stretches a balance out for years and multiplies the interest paid — the single most expensive habit in personal finance.</p>
<h3>Debt-to-income ratio (DTI)</h3>
<pre><code>DTI = Total monthly debt payments / Gross monthly income

Example: 5,000,000 VND debt payments / 20,000,000 VND income = 25% DTI
 (lenders generally see under 36% as manageable)
</code></pre>
<h3>Two payoff strategies</h3>
<ul>
<li><strong>Debt snowball</strong> — pay off the smallest balance first, then roll that payment into the next smallest. Builds motivation fast.</li>
<li><strong>Debt avalanche</strong> — pay off the highest-interest debt first. Saves the most money mathematically.</li>
</ul>
<div class="callout"><span class="badge">Rule of thumb</span> Pick avalanche if you want the cheapest payoff; pick snowball if you need the early wins to stay motivated. Either beats paying only minimums.</div>`,
    `<span class="eyebrow">PSF201 · Chương 3 · Bài 3.1</span>
<h2>Quản lý nợ &amp; tín dụng</h2>
<h3>Điều gì xây nên điểm tín dụng</h3>
<ul>
<li><strong>Lịch sử thanh toán</strong> — yếu tố lớn nhất; trả đúng hạn, mọi lần.</li>
<li><strong>Số tiền đang nợ</strong> — bạn đang dùng bao nhiêu phần hạn mức tín dụng khả dụng (tỉ lệ sử dụng).</li>
<li><strong>Độ dài lịch sử tín dụng</strong> — tài khoản lâu năm, quản lý tốt sẽ có lợi.</li>
<li><strong>Tín dụng mới &amp; đa dạng tín dụng</strong> — mở quá nhiều tài khoản mới cùng lúc, hoặc chỉ có một loại tín dụng, cả hai đều gây bất lợi nhẹ.</li>
</ul>
<h3>Chi phí thật của nợ</h3>
<p><strong>APR</strong> (lãi suất theo năm) là chi phí vay tính theo năm. Chỉ trả <strong>khoản tối thiểu</strong> trên thẻ tín dụng kéo dài dư nợ ra nhiều năm và nhân số tiền lãi phải trả — thói quen đắt giá nhất trong tài chính cá nhân.</p>
<h3>Tỉ lệ nợ trên thu nhập (DTI)</h3>
<pre><code>DTI = Tổng khoản trả nợ hàng tháng / Thu nhập gộp hàng tháng

Ví dụ: 5.000.000đ trả nợ / 20.000.000đ thu nhập = 25% DTI
 (bên cho vay thường coi dưới 36% là quản lý được)
</code></pre>
<h3>Hai chiến lược trả nợ</h3>
<ul>
<li><strong>Debt snowball (quả cầu tuyết)</strong> — trả hết dư nợ nhỏ nhất trước, rồi dồn khoản đó vào món nợ nhỏ thứ hai. Tạo động lực nhanh.</li>
<li><strong>Debt avalanche (thác lũ)</strong> — trả hết nợ lãi suất cao nhất trước. Tiết kiệm nhiều tiền nhất về mặt toán học.</li>
</ul>
<div class="callout"><span class="badge">Quy tắc chọn</span> Chọn avalanche nếu muốn trả nợ rẻ nhất; chọn snowball nếu cần chiến thắng sớm để giữ động lực. Cả hai đều tốt hơn chỉ trả khoản tối thiểu.</div>`,
  ]]);

const c3q = quiz('psf201-quiz-3', 'Quiz 3 — Debt & credit|||Quiz 3 — Nợ & tín dụng', [
  { id: 'q1', question: 'Yếu tố nào ảnh hưởng lớn nhất đến điểm tín dụng?', options: ['Độ dài lịch sử tín dụng', 'Lịch sử thanh toán (trả đúng hạn)', 'Loại thẻ đang dùng', 'Số lần đăng nhập app ngân hàng'], correctIndex: 1, explanation: 'Lịch sử thanh toán đúng hạn là yếu tố nặng nhất trong điểm tín dụng.' },
  { id: 'q2', question: 'Chiến lược "debt snowball" trả nợ theo thứ tự nào?', options: ['Lãi suất cao nhất trước', 'Dư nợ nhỏ nhất trước', 'Ngẫu nhiên', 'Nợ mới nhất trước'], correctIndex: 1, explanation: 'Snowball: trả hết dư nợ NHỎ NHẤT trước để tạo động lực, khác avalanche (lãi suất cao nhất trước).' },
  { id: 'q3', question: 'Tỉ lệ nợ trên thu nhập (DTI) được tính bằng?', options: ['Tổng nợ / Tổng tài sản', 'Tổng khoản trả nợ hàng tháng / Thu nhập gộp hàng tháng', 'Thu nhập / Chi phí', 'Điểm tín dụng / 100'], correctIndex: 1, explanation: 'DTI = tổng khoản trả nợ mỗi tháng chia cho thu nhập gộp mỗi tháng.' },
]);

const c4 = doc('psf201-4-1-saving-emergency-fund', '4.1 — Saving & the emergency fund|||4.1 — Tiết kiệm & quỹ khẩn cấp',
  'Vì sao cần tiết kiệm, quy mô quỹ khẩn cấp (3-6 tháng chi phí), nơi gửi (thanh khoản), tự động hoá tiết kiệm.',
  [[
    `<span class="eyebrow">PSF201 · Chapter 4 · Lesson 4.1</span>
<h2>Saving &amp; the emergency fund</h2>
<h3>Why save before you invest</h3>
<p>Saving builds a cushion for the unpredictable — a job loss, a medical bill, a broken motorbike — without forcing you to sell investments at a bad time or take on high-interest debt. It is the foundation everything else in this course sits on.</p>
<h3>How much: the emergency fund</h3>
<pre><code>Emergency fund target = 3 to 6 months of essential expenses

Example: essential expenses 8,000,000 VND / month
 3 months = 24,000,000 VND (minimum cushion)
 6 months = 48,000,000 VND (comfortable, e.g. unstable income)
</code></pre>
<h3>Where to keep it</h3>
<p>An emergency fund needs to be <strong>liquid</strong> (accessible within days, no penalty) and <strong>low-risk</strong> (its value must not drop right when you need it) — a high-yield savings account, not the stock market. There is an explicit trade-off here: liquid, safe money earns a lower return than investments do.</p>
<h3>Automate it</h3>
<p>Set an automatic transfer to a separate savings account on payday, before spending happens. Willpower is unreliable; automation is not.</p>
<div class="callout"><span class="badge">The cushion, not the goal</span> An emergency fund is not an investment — its job is to be there, boring and intact, on the worst day. Growth comes later, from investing (Chapter 5).</div>`,
    `<span class="eyebrow">PSF201 · Chương 4 · Bài 4.1</span>
<h2>Tiết kiệm &amp; quỹ khẩn cấp</h2>
<h3>Vì sao tiết kiệm trước khi đầu tư</h3>
<p>Tiết kiệm tạo lớp đệm cho những điều không thể đoán trước — mất việc, hoá đơn y tế, xe hỏng — mà không phải bán tháo đầu tư vào thời điểm xấu hay vay nợ lãi suất cao. Đây là nền tảng để mọi thứ khác trong môn này đứng vững trên đó.</p>
<h3>Bao nhiêu là đủ: quỹ khẩn cấp</h3>
<pre><code>Mục tiêu quỹ khẩn cấp = 3 đến 6 tháng chi phí thiết yếu

Ví dụ: chi phí thiết yếu 8.000.000đ / tháng
 3 tháng = 24.000.000đ (lớp đệm tối thiểu)
 6 tháng = 48.000.000đ (dư dả hơn, vd thu nhập không ổn định)
</code></pre>
<h3>Gửi ở đâu</h3>
<p>Quỹ khẩn cấp cần <strong>thanh khoản</strong> (rút được trong vài ngày, không phạt) và <strong>ít rủi ro</strong> (giá trị không được sụt đúng lúc bạn cần) — một tài khoản tiết kiệm lãi suất tốt, không phải thị trường cổ phiếu. Có một sự đánh đổi rõ ràng ở đây: tiền thanh khoản, an toàn sinh lời thấp hơn đầu tư.</p>
<h3>Tự động hoá</h3>
<p>Đặt lệnh chuyển tiền tự động sang tài khoản tiết kiệm riêng ngay ngày lương về, trước khi chi tiêu diễn ra. Ý chí không đáng tin cậy; tự động hoá thì có.</p>
<div class="callout"><span class="badge">Lớp đệm, không phải mục tiêu tăng trưởng</span> Quỹ khẩn cấp không phải một khoản đầu tư — việc của nó là ở đó, buồn tẻ và còn nguyên, vào ngày xấu nhất. Tăng trưởng đến sau, từ đầu tư (Chương 5).</div>`,
  ]]);

const c4q = quiz('psf201-quiz-4', 'Quiz 4 — Saving & emergency fund|||Quiz 4 — Tiết kiệm & quỹ khẩn cấp', [
  { id: 'q1', question: 'Quy mô khuyến nghị của quỹ khẩn cấp là bao nhiêu tháng chi phí thiết yếu?', options: ['1 tháng', '3 đến 6 tháng', '12 tháng', '24 tháng'], correctIndex: 1, explanation: 'Mức phổ biến được khuyến nghị là 3-6 tháng chi phí thiết yếu, tuỳ độ ổn định thu nhập.' },
  { id: 'q2', question: 'Đặc điểm quan trọng nhất của nơi gửi quỹ khẩn cấp là gì?', options: ['Lợi suất cao nhất có thể', 'Thanh khoản cao & ít rủi ro', 'Khó rút để tránh tiêu', 'Gắn với thị trường cổ phiếu'], correctIndex: 1, explanation: 'Quỹ khẩn cấp cần rút được nhanh và không mất giá đúng lúc cần dùng.' },
  { id: 'q3', question: 'Lợi ích chính của việc tự động hoá tiết kiệm là gì?', options: ['Tăng lãi suất ngân hàng', 'Loại bỏ phụ thuộc vào ý chí — tiền được chuyển đi trước khi có cơ hội chi tiêu', 'Giúp tránh thuế', 'Tăng điểm tín dụng'], correctIndex: 1, explanation: 'Tự động hoá đảm bảo phần tiết kiệm được chuyển đi ngay, không phụ thuộc vào việc "nhớ" hay "cố gắng".' },
]);

const c5 = doc('psf201-5-1-basic-investing', '5.1 — Basic investing: stocks, bonds, funds & compound interest|||5.1 — Đầu tư cơ bản: cổ phiếu, trái phiếu, quỹ & lãi kép',
  'Cổ phiếu (sở hữu), trái phiếu (cho vay), quỹ tương hỗ/ETF (đa dạng hoá), đánh đổi rủi ro-lợi suất, lãi kép, quy tắc 72.',
  [[
    `<span class="eyebrow">PSF201 · Chapter 5 · Lesson 5.1</span>
<h2>Basic investing: stocks, bonds, funds &amp; compound interest</h2>
<h3>The main asset classes</h3>
<ul>
<li><strong>Stocks</strong> — buying a small piece of ownership in a company. Higher potential return, higher risk (the price can fall a lot).</li>
<li><strong>Bonds</strong> — lending money to a government or company for a fixed interest rate. Generally lower risk and lower return than stocks.</li>
<li><strong>Mutual funds / ETFs</strong> — a basket of many stocks or bonds bought as a single unit, giving instant <strong>diversification</strong> without picking individual companies.</li>
</ul>
<h3>Risk &amp; return move together</h3>
<p>Higher expected return generally requires accepting higher risk (larger possible swings). <strong>Diversification</strong> — not putting all your money in one company or one asset — reduces the damage any single bad outcome can do, without eliminating risk entirely.</p>
<h3>The power of compound interest</h3>
<pre><code>Future Value = Present Value × (1 + r) ^ n
  r = annual return rate, n = number of years

Rule of 72 (quick estimate of years to double):
  Years to double ≈ 72 / (annual return rate in %)
  Example: at 8% per year -> 72 / 8 = 9 years to double
</code></pre>
<div class="callout"><span class="badge">Time in the market beats timing the market</span> The biggest driver of long-term compounding is not picking the perfect moment to invest — it is starting early and staying invested through the ups and downs.</div>`,
    `<span class="eyebrow">PSF201 · Chương 5 · Bài 5.1</span>
<h2>Đầu tư cơ bản: cổ phiếu, trái phiếu, quỹ &amp; lãi kép</h2>
<h3>Các lớp tài sản chính</h3>
<ul>
<li><strong>Cổ phiếu</strong> — mua một phần sở hữu nhỏ trong một công ty. Lợi suất kỳ vọng cao hơn, rủi ro cao hơn (giá có thể giảm nhiều).</li>
<li><strong>Trái phiếu</strong> — cho chính phủ hoặc công ty vay tiền với lãi suất cố định. Nói chung rủi ro thấp hơn và lợi suất thấp hơn cổ phiếu.</li>
<li><strong>Quỹ tương hỗ / ETF</strong> — một rổ gồm nhiều cổ phiếu hoặc trái phiếu được mua như một đơn vị duy nhất, mang lại <strong>đa dạng hoá</strong> ngay lập tức mà không cần chọn từng công ty riêng lẻ.</li>
</ul>
<h3>Rủi ro & lợi suất di chuyển cùng nhau</h3>
<p>Lợi suất kỳ vọng cao hơn thường đòi hỏi chấp nhận rủi ro cao hơn (biến động lớn hơn). <strong>Đa dạng hoá</strong> — không đặt hết tiền vào một công ty hay một loại tài sản — giảm thiệt hại từ một kết quả xấu duy nhất, chứ không loại bỏ hoàn toàn rủi ro.</p>
<h3>Sức mạnh của lãi kép</h3>
<pre><code>Giá trị tương lai = Giá trị hiện tại × (1 + r) ^ n
  r = lãi suất năm, n = số năm

Quy tắc 72 (ước lượng nhanh số năm để gấp đôi):
  Số năm để gấp đôi ≈ 72 / (lãi suất năm, tính theo %)
  Ví dụ: lãi suất 8%/năm -> 72 / 8 = 9 năm để gấp đôi
</code></pre>
<div class="callout"><span class="badge">Thời gian trên thị trường thắng canh đúng thời điểm</span> Yếu tố lớn nhất quyết định lãi kép dài hạn không phải là chọn đúng thời điểm hoàn hảo để đầu tư — mà là bắt đầu sớm và ở lại thị trường qua mọi lên xuống.</div>`,
  ]]);

const c5q = quiz('psf201-quiz-5', 'Quiz 5 — Basic investing|||Quiz 5 — Đầu tư cơ bản', [
  { id: 'q1', question: 'So với trái phiếu, cổ phiếu thường có đặc điểm gì?', options: ['Lợi suất kỳ vọng thấp hơn, rủi ro thấp hơn', 'Lợi suất kỳ vọng cao hơn, rủi ro cao hơn', 'Luôn đảm bảo lãi suất cố định', 'Không có rủi ro mất giá'], correctIndex: 1, explanation: 'Cổ phiếu là sở hữu công ty, thường rủi ro cao hơn nhưng lợi suất kỳ vọng cao hơn trái phiếu (cho vay lãi cố định).' },
  { id: 'q2', question: 'Theo quy tắc 72, với lãi suất 8%/năm, cần khoảng bao nhiêu năm để số tiền gấp đôi?', options: ['3 năm', '6 năm', '9 năm', '15 năm'], correctIndex: 2, explanation: '72 / 8 = 9 năm (ước lượng nhanh, không thay cho công thức lãi kép chính xác).' },
  { id: 'q3', question: 'Lợi ích chính của quỹ tương hỗ / ETF là gì?', options: ['Đa dạng hoá — sở hữu nhiều cổ phiếu/trái phiếu qua một đơn vị duy nhất', 'Loại bỏ hoàn toàn rủi ro', 'Luôn có lợi suất cao hơn cổ phiếu đơn lẻ', 'Không cần đóng thuế khi bán'], correctIndex: 0, explanation: 'Quỹ gộp nhiều tài sản lại, giảm rủi ro tập trung vào một công ty duy nhất.' },
]);

const c6 = doc('psf201-6-1-insurance-risk', '6.1 — Insurance & personal risk management|||6.1 — Bảo hiểm & quản trị rủi ro cá nhân',
  'Bốn cách xử lý rủi ro (tránh/giảm/chuyển giao/chấp nhận), các loại bảo hiểm cá nhân chính, phí bảo hiểm & mức khấu trừ.',
  [[
    `<span class="eyebrow">PSF201 · Chapter 6 · Lesson 6.1</span>
<h2>Insurance &amp; personal risk management</h2>
<h3>Four ways to handle risk</h3>
<ul>
<li><strong>Avoid</strong> — do not take on the risk at all (e.g. do not ride a motorbike without a helmet).</li>
<li><strong>Reduce</strong> — lower the odds or the damage (defensive driving, a home fire alarm).</li>
<li><strong>Transfer</strong> — pay someone else (an insurer) to take on the financial consequence. This is what insurance is.</li>
<li><strong>Retain</strong> — accept small, affordable risks yourself instead of paying to insure them.</li>
</ul>
<h3>Main personal insurance types</h3>
<ul>
<li><strong>Life insurance</strong> — pays your dependents if you die; matters most when others rely on your income.</li>
<li><strong>Health insurance</strong> — covers medical costs; protects against the single biggest wildcard expense most people face.</li>
<li><strong>Auto / property insurance</strong> — covers damage to or loss of a vehicle or home/belongings.</li>
<li><strong>Disability insurance</strong> — replaces part of your income if illness or injury stops you from working; often overlooked, often more important than life insurance for a young single person.</li>
</ul>
<h3>Key terms</h3>
<pre><code>Premium   = what you pay (e.g. monthly) to keep the policy active
Deductible = what YOU pay out of pocket before the insurer pays
Coverage limit = the maximum the insurer will pay

Example: 10,000,000 VND repair bill, 2,000,000 VND deductible
 -> you pay 2,000,000 VND, insurer pays 8,000,000 VND
</code></pre>
<div class="callout"><span class="badge">Insure the big, retain the small</span> Buy insurance for losses that would be financially devastating (a house fire, a major surgery) and self-insure the small, affordable ones — that trade-off is what keeps premiums reasonable.</div>`,
    `<span class="eyebrow">PSF201 · Chương 6 · Bài 6.1</span>
<h2>Bảo hiểm &amp; quản trị rủi ro cá nhân</h2>
<h3>Bốn cách xử lý rủi ro</h3>
<ul>
<li><strong>Tránh (avoid)</strong> — không nhận rủi ro đó ngay từ đầu (vd không đi xe máy mà không đội nón bảo hiểm).</li>
<li><strong>Giảm (reduce)</strong> — hạ xác suất hoặc mức thiệt hại (lái xe an toàn, lắp báo cháy trong nhà).</li>
<li><strong>Chuyển giao (transfer)</strong> — trả tiền cho người khác (công ty bảo hiểm) để họ nhận hậu quả tài chính. Đây chính là bảo hiểm.</li>
<li><strong>Chấp nhận (retain)</strong> — tự nhận những rủi ro nhỏ, có thể chi trả được, thay vì trả tiền để bảo hiểm chúng.</li>
</ul>
<h3>Các loại bảo hiểm cá nhân chính</h3>
<ul>
<li><strong>Bảo hiểm nhân thọ</strong> — trả cho người phụ thuộc nếu bạn qua đời; quan trọng nhất khi có người khác dựa vào thu nhập của bạn.</li>
<li><strong>Bảo hiểm sức khoẻ</strong> — chi trả chi phí y tế; bảo vệ khỏi khoản chi bất ngờ lớn nhất mà hầu hết người ta gặp phải.</li>
<li><strong>Bảo hiểm xe / tài sản</strong> — chi trả thiệt hại hoặc mất mát xe hoặc nhà/tài sản.</li>
<li><strong>Bảo hiểm mất khả năng lao động</strong> — thay thế một phần thu nhập nếu bệnh/chấn thương khiến bạn không làm việc được; thường bị bỏ quên, thường quan trọng hơn cả bảo hiểm nhân thọ với người trẻ, độc thân.</li>
</ul>
<h3>Các thuật ngữ chính</h3>
<pre><code>Phí bảo hiểm (premium) = số tiền bạn trả (vd hàng tháng) để hợp đồng còn hiệu lực
Mức khấu trừ (deductible) = số tiền BẠN trả trước khi công ty bảo hiểm trả
Hạn mức chi trả = số tiền tối đa công ty bảo hiểm sẽ trả

Ví dụ: hoá đơn sửa chữa 10.000.000đ, mức khấu trừ 2.000.000đ
 -> bạn trả 2.000.000đ, công ty bảo hiểm trả 8.000.000đ
</code></pre>
<div class="callout"><span class="badge">Bảo hiểm cái lớn, tự chịu cái nhỏ</span> Mua bảo hiểm cho những tổn thất có thể gây thiệt hại tài chính nặng (cháy nhà, phẫu thuật lớn) và tự chịu những rủi ro nhỏ, chi trả được — sự đánh đổi này giữ phí bảo hiểm ở mức hợp lý.</div>`,
  ]]);

const c6q = quiz('psf201-quiz-6', 'Quiz 6 — Insurance & risk|||Quiz 6 — Bảo hiểm & rủi ro', [
  { id: 'q1', question: 'Mua bảo hiểm là ví dụ của cách xử lý rủi ro nào?', options: ['Tránh (avoid)', 'Giảm (reduce)', 'Chuyển giao (transfer)', 'Chấp nhận (retain)'], correctIndex: 2, explanation: 'Bảo hiểm là trả tiền cho công ty bảo hiểm để chuyển giao hậu quả tài chính của rủi ro.' },
  { id: 'q2', question: '"Mức khấu trừ" (deductible) trong hợp đồng bảo hiểm là gì?', options: ['Số tiền công ty bảo hiểm trả tối đa', 'Số tiền bạn phải trả trước khi công ty bảo hiểm trả phần còn lại', 'Phí bảo hiểm hàng tháng', 'Tiền hoàn lại nếu không có sự cố'], correctIndex: 1, explanation: 'Deductible là phần bạn tự trả trước; công ty bảo hiểm chi trả phần vượt mức đó, tới hạn mức hợp đồng.' },
  { id: 'q3', question: 'Loại bảo hiểm nào bảo vệ thu nhập khi bạn không thể làm việc do bệnh/chấn thương?', options: ['Bảo hiểm tài sản', 'Bảo hiểm mất khả năng lao động', 'Bảo hiểm xe', 'Bảo hiểm nhân thọ'], correctIndex: 1, explanation: 'Bảo hiểm mất khả năng lao động (disability insurance) thay thế một phần thu nhập khi bạn không làm việc được.' },
]);

const c7 = doc('psf201-7-1-income-tax-retirement', '7.1 — Personal income tax & retirement planning|||7.1 — Thuế thu nhập cá nhân & kế hoạch nghỉ hưu',
  'Thuế theo luỹ tiến (bậc thuế biên), tài khoản nghỉ hưu do công ty tài trợ (401(k)) & tài khoản cá nhân (IRA truyền thống vs Roth), vì sao bắt đầu sớm quan trọng.',
  [[
    `<span class="eyebrow">PSF201 · Chapter 7 · Lesson 7.1</span>
<h2>Personal income tax &amp; retirement planning</h2>
<h3>Progressive income tax</h3>
<p>Most income tax systems are <strong>progressive</strong>: income is split into brackets, and each bracket is taxed at its own rate — only the income WITHIN a bracket is taxed at that bracket's rate, not your entire income.</p>
<pre><code>Simplified bracket example:
  Bracket 1: first  10,000 (any currency) taxed at 5%
  Bracket 2: next   20,000            taxed at 10%
  Bracket 3: above  30,000            taxed at 15%

Your "marginal rate" = the rate on your LAST dollar/đồng earned,
NOT the rate on your whole income.
</code></pre>
<h3>Retirement accounts</h3>
<ul>
<li><strong>Employer-sponsored plans (e.g. 401(k))</strong> — contributions often come with an <strong>employer match</strong> (free money) and reduce taxable income today.</li>
<li><strong>Traditional individual retirement account</strong> — contribute pre-tax, get a tax break now, pay tax on withdrawals in retirement.</li>
<li><strong>Roth individual retirement account</strong> — contribute after-tax (no break now), withdrawals in retirement are tax-free.</li>
</ul>
<h3>Why starting early matters</h3>
<p>Retirement saving is compound interest (Chapter 5) applied over decades — the same monthly amount invested at 25 vs. 35 can end up nearly double, purely from extra years of compounding.</p>
<div class="callout"><span class="badge">Never leave the match on the table</span> If an employer matches retirement contributions, not contributing enough to get the full match is turning down free money — it is usually the single best "return" available anywhere.</div>`,
    `<span class="eyebrow">PSF201 · Chương 7 · Bài 7.1</span>
<h2>Thuế thu nhập cá nhân &amp; kế hoạch nghỉ hưu</h2>
<h3>Thuế thu nhập theo luỹ tiến</h3>
<p>Hầu hết hệ thống thuế thu nhập đều <strong>luỹ tiến</strong>: thu nhập được chia thành các bậc, mỗi bậc chịu một mức thuế riêng — chỉ phần thu nhập NẰM TRONG một bậc mới chịu mức thuế của bậc đó, không phải toàn bộ thu nhập.</p>
<pre><code>Ví dụ bậc thuế đơn giản hoá:
  Bậc 1: 10.000 đơn vị tiền đầu tiên  chịu thuế 5%
  Bậc 2: 20.000 đơn vị tiếp theo      chịu thuế 10%
  Bậc 3: phần trên 30.000             chịu thuế 15%

"Thuế suất biên" = mức thuế trên đồng thu nhập CUỐI CÙNG,
KHÔNG phải mức thuế trên toàn bộ thu nhập của bạn.
</code></pre>
<h3>Các tài khoản nghỉ hưu</h3>
<ul>
<li><strong>Kế hoạch do công ty tài trợ (vd 401(k))</strong> — khoản đóng góp thường được công ty <strong>đối ứng thêm</strong> (tiền miễn phí) và giảm thu nhập chịu thuế ngay bây giờ.</li>
<li><strong>Tài khoản nghỉ hưu cá nhân truyền thống (Traditional IRA)</strong> — đóng góp trước thuế, được giảm thuế ngay, nộp thuế khi rút ra lúc nghỉ hưu.</li>
<li><strong>Tài khoản nghỉ hưu cá nhân Roth</strong> — đóng góp sau thuế (không giảm thuế ngay), khi rút ra lúc nghỉ hưu thì miễn thuế hoàn toàn.</li>
</ul>
<h3>Vì sao bắt đầu sớm quan trọng</h3>
<p>Tiết kiệm nghỉ hưu là lãi kép (Chương 5) áp dụng trong nhiều thập kỷ — cùng một số tiền đóng mỗi tháng, đầu tư từ tuổi 25 so với tuổi 35 có thể chênh gần gấp đôi, chỉ vì có thêm nhiều năm lãi kép.</p>
<div class="callout"><span class="badge">Đừng bỏ phần đối ứng trên bàn</span> Nếu công ty đối ứng khoản đóng nghỉ hưu, không đóng đủ để nhận trọn phần đối ứng đó là từ chối tiền miễn phí — thường đây là "lợi suất" tốt nhất có thể tìm được ở bất cứ đâu.</div>`,
  ]]);

const c7q = quiz('psf201-quiz-7', 'Quiz 7 — Income tax & retirement|||Quiz 7 — Thuế TNCN & nghỉ hưu', [
  { id: 'q1', question: '"Thuế suất biên" (marginal tax rate) là mức thuế áp dụng cho phần nào?', options: ['Toàn bộ thu nhập', 'Chỉ phần thu nhập trong bậc thuế cao nhất bạn chạm tới', 'Chỉ tiền tiết kiệm', 'Chỉ thu nhập từ đầu tư'], correctIndex: 1, explanation: 'Thuế luỹ tiến: mỗi bậc thu nhập chịu mức thuế riêng; thuế suất biên là mức trên đồng thu nhập cuối cùng.' },
  { id: 'q2', question: 'Khác biệt chính giữa Traditional IRA và Roth IRA là gì?', options: ['Traditional không được rút tiền, Roth được', 'Traditional giảm thuế lúc đóng góp & chịu thuế lúc rút; Roth đóng sau thuế & rút miễn thuế', 'Roth chỉ dành cho công ty lớn', 'Không có khác biệt'], correctIndex: 1, explanation: 'Traditional: giảm thuế ngay, đánh thuế khi rút. Roth: đóng sau thuế, rút miễn thuế lúc nghỉ hưu.' },
  { id: 'q3', question: 'Vì sao bắt đầu đóng góp nghỉ hưu sớm lại quan trọng?', options: ['Vì luật bắt buộc', 'Vì lãi kép cần nhiều năm để phát huy tác dụng lớn', 'Vì đóng sớm được miễn hoàn toàn thuế', 'Vì công ty chỉ đối ứng cho người trẻ'], correctIndex: 1, explanation: 'Thêm vài năm lãi kép có thể tạo ra chênh lệch rất lớn về số tiền cuối cùng.' },
]);

const c8 = doc('psf201-8-1-estate-goals-psychology', '8.1 — Estate planning, long-term goals & the psychology of money|||8.1 — Hoạch định tài sản, mục tiêu dài hạn & tâm lý tiền bạc',
  'Di chúc & người thụ hưởng, gắn mục tiêu tài chính với chân trời thời gian, ý tưởng chính của "The Psychology of Money" (Housel).',
  [[
    `<span class="eyebrow">PSF201 · Chapter 8 · Lesson 8.1</span>
<h2>Estate planning, long-term goals &amp; the psychology of money</h2>
<h3>Estate planning basics</h3>
<ul>
<li><strong>A will</strong> — a legal document stating who receives your assets when you die; without one, the law decides for you.</li>
<li><strong>Beneficiary designations</strong> — the named person who directly receives an account (e.g. life insurance, retirement account) — this usually overrides even what a will says.</li>
<li><strong>Power of attorney</strong> — names someone to make financial (or medical) decisions for you if you become unable to.</li>
</ul>
<h3>Linking goals to a time horizon</h3>
<p>A goal's time horizon should drive which tools from this whole course you use: a short-term goal (an emergency fund, next year's trip) belongs in savings (Chapter 4) — safe and liquid; a long-term goal (retirement, a child's education 15 years out) can afford the volatility of investing (Chapter 5) because there is time to recover from downturns.</p>
<h3>The psychology of money (Morgan Housel)</h3>
<ul>
<li><strong>Wealth is what you do not spend</strong> — the unseen assets, not the visible car or watch (which is "riches", not wealth).</li>
<li><strong>Behavior beats formulas</strong> — most financial outcomes are decided by habits and temperament, not by knowing the smartest possible move.</li>
<li><strong>Save what you can control</strong> — you cannot control markets or the economy, but you control your savings rate.</li>
<li><strong>"Enough" matters</strong> — knowing when a goal is reached prevents taking reckless risk to chase more.</li>
</ul>
<div class="callout"><span class="badge">The best plan is the one you can keep</span> A "perfect" plan you abandon after two months is worse than a "good enough" plan you actually follow for years — consistency, not optimization, is what compounds.</div>`,
    `<span class="eyebrow">PSF201 · Chương 8 · Bài 8.1</span>
<h2>Hoạch định tài sản, mục tiêu dài hạn &amp; tâm lý tiền bạc</h2>
<h3>Cơ bản về hoạch định tài sản</h3>
<ul>
<li><strong>Di chúc</strong> — văn bản pháp lý nêu ai nhận tài sản của bạn khi bạn qua đời; không có di chúc, pháp luật sẽ quyết định thay bạn.</li>
<li><strong>Chỉ định người thụ hưởng</strong> — người được nêu tên nhận trực tiếp một tài khoản (vd bảo hiểm nhân thọ, tài khoản nghỉ hưu) — điều này thường có hiệu lực cao hơn cả nội dung di chúc.</li>
<li><strong>Giấy uỷ quyền</strong> — chỉ định ai đó ra quyết định tài chính (hoặc y tế) thay bạn nếu bạn không còn khả năng tự quyết định.</li>
</ul>
<h3>Gắn mục tiêu với chân trời thời gian</h3>
<p>Chân trời thời gian của một mục tiêu nên quyết định bạn dùng công cụ nào trong cả môn học này: mục tiêu ngắn hạn (quỹ khẩn cấp, chuyến đi năm sau) thuộc về tiết kiệm (Chương 4) — an toàn, thanh khoản; mục tiêu dài hạn (nghỉ hưu, học phí con 15 năm sau) có thể chấp nhận biến động của đầu tư (Chương 5) vì có đủ thời gian để hồi phục sau các đợt sụt giảm.</p>
<h3>Tâm lý tiền bạc (Morgan Housel)</h3>
<ul>
<li><strong>Sự giàu có (wealth) là thứ bạn KHÔNG chi tiêu</strong> — tài sản vô hình, không phải cái xe hay đồng hồ nhìn thấy được (đó là "riches" — sự sung túc bề ngoài, không phải wealth).</li>
<li><strong>Hành vi thắng công thức</strong> — hầu hết kết quả tài chính được quyết định bởi thói quen và tính khí, không phải bởi biết được nước đi thông minh nhất.</li>
<li><strong>Để dành phần bạn kiểm soát được</strong> — bạn không kiểm soát được thị trường hay kinh tế, nhưng kiểm soát được tỉ lệ tiết kiệm của mình.</li>
<li><strong>"Đủ" là quan trọng</strong> — biết khi nào mục tiêu đã đạt giúp tránh liều lĩnh để chạy theo nhiều hơn.</li>
</ul>
<div class="callout"><span class="badge">Kế hoạch tốt nhất là kế hoạch bạn giữ được</span> Một kế hoạch "hoàn hảo" mà bạn bỏ sau hai tháng còn tệ hơn một kế hoạch "đủ tốt" mà bạn thực sự theo trong nhiều năm — tính nhất quán, không phải sự tối ưu, mới là thứ sinh lãi kép.</div>`,
  ]]);

const c8q = quiz('psf201-quiz-8', 'Quiz 8 — Estate planning & psychology|||Quiz 8 — Hoạch định tài sản & tâm lý', [
  { id: 'q1', question: 'Văn bản pháp lý nêu ai nhận tài sản của bạn khi qua đời gọi là gì?', options: ['Giấy uỷ quyền', 'Di chúc (a will)', 'Hợp đồng bảo hiểm', 'Bảng tài sản thuần'], correctIndex: 1, explanation: 'Di chúc là văn bản pháp lý xác định người thừa kế tài sản.' },
  { id: 'q2', question: 'Theo Morgan Housel ("The Psychology of Money"), kết quả tài chính chủ yếu được quyết định bởi điều gì?', options: ['Công thức toán tài chính phức tạp', 'Hành vi & thói quen tiền bạc, nhiều hơn là kiến thức thuần túy', 'May mắn hoàn toàn, không kiểm soát được', 'Chỉ số IQ'], correctIndex: 1, explanation: 'Housel nhấn mạnh hành vi (kiên trì, tiết chế) quan trọng hơn việc biết nước đi "thông minh" nhất.' },
  { id: 'q3', question: 'Mục tiêu tài chính dài hạn (vd nghỉ hưu) thường phù hợp với công cụ nào hơn?', options: ['Chỉ tiền mặt trong tủ', 'Đầu tư (chấp nhận biến động vì có đủ thời gian hồi phục)', 'Vay tiêu dùng', 'Không cần công cụ nào'], correctIndex: 1, explanation: 'Chân trời thời gian dài cho phép chấp nhận biến động ngắn hạn của đầu tư để đổi lấy lợi suất cao hơn.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'PSF201',
    slug: 'psf201-personal-finance',
    title: 'Personal Finance',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/PSF201.webp',
    shortDescription: 'How to manage your own money — financial planning, budgeting & cash flow, debt & credit, saving, basic investing (stocks, bonds, funds, compound interest), insurance & risk, income tax & retirement, estate planning & the psychology of money.|||Quản lý tiền của chính bạn — lập kế hoạch tài chính, ngân sách & dòng tiền, nợ & tín dụng, tiết kiệm, đầu tư cơ bản (cổ phiếu, trái phiếu, quỹ, lãi kép), bảo hiểm & rủi ro, thuế thu nhập & nghỉ hưu, hoạch định tài sản & tâm lý tiền bạc.',
    description: 'Môn <strong>PSF201 — Personal Finance</strong> (kỳ 5) giúp bạn <strong>quản lý tiền của chính mình một cách có chủ đích</strong>. Từ <strong>lập kế hoạch tài chính &amp; tài sản thuần</strong> → <strong>ngân sách &amp; dòng tiền</strong> (quy tắc 50/30/20) → <strong>nợ &amp; tín dụng</strong> (điểm tín dụng, snowball/avalanche) → <strong>tiết kiệm &amp; quỹ khẩn cấp</strong> → <strong>đầu tư cơ bản</strong> (cổ phiếu, trái phiếu, quỹ, lãi kép) → <strong>bảo hiểm &amp; quản trị rủi ro</strong> → <strong>thuế thu nhập cá nhân &amp; nghỉ hưu</strong> → <strong>hoạch định tài sản, mục tiêu dài hạn &amp; tâm lý tiền bạc</strong>. Bám giáo trình FLM (Kapoor/Dlabay/Hughes, Madura, Housel), song ngữ, có ví dụ tính toán và quiz mỗi chương.',
    whatYouLearn: 'Lập kế hoạch tài chính & tài sản thuần (net worth); ngân sách & dòng tiền (quy tắc 50/30/20, zero-based); điểm tín dụng, APR, DTI, chiến lược trả nợ snowball/avalanche; quỹ khẩn cấp (3-6 tháng chi phí); cổ phiếu/trái phiếu/quỹ, đa dạng hoá, lãi kép & quy tắc 72; bốn cách xử lý rủi ro & các loại bảo hiểm cá nhân; thuế thu nhập luỹ tiến, tài khoản nghỉ hưu (401(k), IRA truyền thống/Roth); di chúc, mục tiêu dài hạn và tâm lý tiền bạc.',
    requirements: 'Không yêu cầu kiến thức tài chính trước đó; chỉ cần toán cơ bản (phần trăm, cộng trừ nhân chia). Nên chuẩn bị sẵn số liệu thu nhập/chi tiêu cá nhân để thực hành ngân sách.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Tài chính cá nhân, tài sản thuần, dòng tiền.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan & lập kế hoạch|||Chapter 1 — Overview & planning', description: 'Quy trình lập kế hoạch, tài sản thuần, chu kỳ đời tài chính.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Ngân sách & dòng tiền|||Chapter 2 — Budgeting & cash flow', description: 'Bảng dòng tiền, quy tắc 50/30/20, zero-based.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Nợ & tín dụng|||Chapter 3 — Debt & credit', description: 'Điểm tín dụng, APR, DTI, snowball vs avalanche.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Tiết kiệm & quỹ khẩn cấp|||Chapter 4 — Saving & emergency fund', description: 'Quy mô quỹ khẩn cấp, thanh khoản, tự động hoá.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Đầu tư cơ bản|||Chapter 5 — Basic investing', description: 'Cổ phiếu, trái phiếu, quỹ, lãi kép, quy tắc 72.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Bảo hiểm & rủi ro cá nhân|||Chapter 6 — Insurance & personal risk', description: 'Bốn cách xử lý rủi ro, các loại bảo hiểm, khấu trừ.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Thuế TNCN & nghỉ hưu|||Chapter 7 — Income tax & retirement', description: 'Thuế luỹ tiến, 401(k), IRA truyền thống/Roth.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Tài sản, mục tiêu dài hạn & tâm lý tiền bạc|||Chapter 8 — Estate, long-term goals & psychology', description: 'Di chúc, chân trời thời gian, tâm lý tiền bạc (Housel).', lessons: [c8, c8q] },
  ],
};
