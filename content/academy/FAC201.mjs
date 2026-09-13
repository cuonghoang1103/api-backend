/**
 * FAC201 — Financial Accounting (Kế toán tài chính). Khối Quản trị Kinh doanh, kỳ 3.
 * Bám cấu trúc giáo trình kế toán tài chính theo IFRS chuẩn quốc tế (Kieso, Weygandt & Warfield —
 * Intermediate Accounting: IFRS Edition; Weygandt, Kimmel & Kieso — Financial Accounting with IFRS;
 * đọc thêm OpenStax Principles of Accounting Vol. 1 — sách này theo US GAAP, KHÔNG phải IFRS): Khung khái niệm, chu trình kế toán, doanh thu IFRS 15,
 * phải thu & tổn thất tín dụng, hàng tồn kho IAS 2, TSCĐ IAS 16, suy giảm giá trị IAS 36, dự phòng IAS 37,
 * trái phiếu (lãi suất thực tế), thuê tài sản IFRS 16, vốn chủ sở hữu, lưu chuyển tiền tệ, phân tích BCTC.
 * Song ngữ + ví dụ số (đã kiểm bằng máy; doanh nghiệp và số liệu là GIẢ ĐỊNH) + bài tập + quiz.
 * FLM gõ nhầm tên môn là "Accouting": title đã sửa, slug GIỮ NGUYÊN.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('fac201-0-1-overview', 'Course overview: what financial accounting reports|||Tổng quan: kế toán tài chính báo cáo điều gì',
  'Kế toán tài chính khác kế toán quản trị ở đâu, ai ban hành chuẩn mực IFRS, lộ trình áp dụng IFRS ở Việt Nam, bộ báo cáo tài chính đầy đủ theo IAS 1, IFRS 18 và lộ trình môn học.',
  [[
    `<span class="eyebrow">FAC201 · Lesson 0.1 · Overview</span>
<h2>Financial Accounting</h2>
<p class="lead">Financial accounting produces the general-purpose financial statements that investors, lenders and other creditors use to decide whether to provide resources to a business. This course moves from the recording skills of ACC101 to the <strong>recognition and measurement rules of IFRS Accounting Standards</strong>: when an item enters the statements, at what amount, and how it is presented.</p>
<h3>Financial vs management accounting</h3>
<table>
<tr><th></th><th>Financial accounting (this course)</th><th>Management accounting</th></tr>
<tr><td>Users</td><td>External: investors, lenders, suppliers, regulators</td><td>Internal: managers at every level</td></tr>
<tr><td>Rules</td><td>Accounting standards (IFRS or national standards), usually audited</td><td>No mandatory rules; designed for each decision</td></tr>
<tr><td>Focus</td><td>The entity as a whole; past transactions and current values</td><td>Products, departments, customers; plans and forecasts</td></tr>
<tr><td>Frequency</td><td>Periodic: annual and interim reports</td><td>Whenever a decision needs it</td></tr>
</table>
<h3>Who sets the rules</h3>
<p>IFRS Accounting Standards are issued by the <strong>International Accounting Standards Board (IASB)</strong>, an independent body of the IFRS Foundation. Older standards carry the name <strong>IAS</strong> (International Accounting Standards), newer ones <strong>IFRS</strong>; both remain in force until replaced. Many jurisdictions require or permit IFRS for listed companies. <strong>Vietnam</strong> has a roadmap for applying IFRS, beginning with voluntary adoption by enterprises that are ready, while most entities still report under the Vietnamese Accounting Standards (VAS). The roadmap (Decision 345/QĐ-BTC, 2020) has a voluntary phase (2022–2025) followed, after 2025, by a mandatory phase for specified groups of entities, as guided by the Ministry of Finance. The scope and timetable are set by the Ministry of Finance — check the regulations currently in force before relying on any detail.</p>
<h3>The complete set of financial statements (IAS 1)</h3>
<ul>
<li>A <strong>statement of financial position</strong> (balance sheet) at the end of the period;</li>
<li>A <strong>statement of profit or loss and other comprehensive income</strong> for the period;</li>
<li>A <strong>statement of changes in equity</strong>;</li>
<li>A <strong>statement of cash flows</strong>;</li>
<li><strong>Notes</strong>, including material accounting policy information — plus comparative figures for the previous period.</li>
</ul>
<p><strong>IFRS 18</strong> <em>Presentation and Disclosure in Financial Statements</em> replaces IAS 1 for annual periods beginning on or after 1 January 2027. It adds required subtotals such as operating profit and new disclosure rules, but it does not change the recognition and measurement topics of this course.</p>
<h3>Roadmap</h3>
<p>Part 1: the Conceptual Framework and a refresher of the accounting cycle · Part 2: revenue (IFRS 15), receivables and credit losses (IFRS 9), inventories (IAS 2) · Part 3: property, plant and equipment (IAS 16) and impairment (IAS 36) · Part 4: liabilities — provisions (IAS 37), bonds, leases (IFRS 16) · Part 5: equity, the statement of cash flows (IAS 7) and financial statement analysis. All companies are fictional, all numbers are illustrative, and every calculation has been checked.</p>
<div class="callout"><span class="badge">One idea to keep</span> Almost every question in this course comes down to two tests: does the item meet the definition of an element (asset, liability, equity, income, expense), and would recognising it give users relevant and faithfully represented information?</div>`,
    `<span class="eyebrow">FAC201 · Bài 0.1 · Tổng quan</span>
<h2>Kế toán tài chính</h2>
<p class="lead">Kế toán tài chính lập ra các báo cáo tài chính cho mục đích chung mà nhà đầu tư, người cho vay và các chủ nợ khác dùng để quyết định có cung cấp nguồn lực cho doanh nghiệp hay không. Môn học đi tiếp từ kỹ năng ghi sổ của ACC101 tới <strong>các quy định ghi nhận và đo lường của Chuẩn mực Kế toán IFRS</strong>: khi nào một khoản mục được đưa vào báo cáo, theo giá trị nào và trình bày ra sao.</p>
<h3>Kế toán tài chính và kế toán quản trị</h3>
<table>
<tr><th></th><th>Kế toán tài chính (môn này)</th><th>Kế toán quản trị</th></tr>
<tr><td>Người sử dụng</td><td>Bên ngoài: nhà đầu tư, người cho vay, nhà cung cấp, cơ quan quản lý</td><td>Bên trong: nhà quản lý các cấp</td></tr>
<tr><td>Quy tắc</td><td>Chuẩn mực kế toán (IFRS hoặc chuẩn mực quốc gia), thường được kiểm toán</td><td>Không có quy tắc bắt buộc; thiết kế theo từng quyết định</td></tr>
<tr><td>Trọng tâm</td><td>Toàn bộ đơn vị; giao dịch đã xảy ra và giá trị hiện hành</td><td>Sản phẩm, bộ phận, khách hàng; kế hoạch và dự báo</td></tr>
<tr><td>Tần suất</td><td>Định kỳ: báo cáo năm và giữa niên độ</td><td>Bất cứ khi nào quyết định cần</td></tr>
</table>
<h3>Ai ban hành quy tắc</h3>
<p>Chuẩn mực Kế toán IFRS do <strong>Hội đồng Chuẩn mực Kế toán Quốc tế (IASB)</strong> ban hành — một cơ quan độc lập thuộc Quỹ IFRS. Các chuẩn mực cũ mang tên <strong>IAS</strong> (Chuẩn mực Kế toán Quốc tế), các chuẩn mực mới mang tên <strong>IFRS</strong>; cả hai đều có hiệu lực cho tới khi bị thay thế. Nhiều quốc gia bắt buộc hoặc cho phép công ty niêm yết dùng IFRS. <strong>Việt Nam</strong> có lộ trình áp dụng IFRS, bắt đầu bằng giai đoạn tự nguyện cho các doanh nghiệp đã sẵn sàng, trong khi phần lớn đơn vị vẫn lập báo cáo theo Chuẩn mực Kế toán Việt Nam (VAS). Lộ trình (Quyết định 345/QĐ-BTC, năm 2020) gồm giai đoạn tự nguyện (2022–2025), tiếp theo là giai đoạn bắt buộc sau năm 2025 cho những nhóm đơn vị cụ thể, theo hướng dẫn của Bộ Tài chính. Phạm vi và thời gian do Bộ Tài chính quy định — hãy kiểm văn bản đang có hiệu lực trước khi dựa vào bất kỳ chi tiết nào.</p>
<h3>Bộ báo cáo tài chính đầy đủ (IAS 1)</h3>
<ul>
<li><strong>Báo cáo tình hình tài chính</strong> (bảng cân đối kế toán) tại ngày cuối kỳ;</li>
<li><strong>Báo cáo lãi lỗ và thu nhập toàn diện khác</strong> của kỳ;</li>
<li><strong>Báo cáo thay đổi vốn chủ sở hữu</strong>;</li>
<li><strong>Báo cáo lưu chuyển tiền tệ</strong>;</li>
<li><strong>Thuyết minh</strong>, gồm thông tin trọng yếu về chính sách kế toán — cùng số liệu so sánh của kỳ trước.</li>
</ul>
<p><strong>IFRS 18</strong> <em>Trình bày và thuyết minh báo cáo tài chính</em> thay thế IAS 1 cho các kỳ kế toán năm bắt đầu từ ngày 1/1/2027. Chuẩn mực này bổ sung các chỉ tiêu tổng bắt buộc như lợi nhuận hoạt động và quy định thuyết minh mới, nhưng không thay đổi các nội dung ghi nhận và đo lường của môn học.</p>
<h3>Lộ trình</h3>
<p>Phần 1: Khung khái niệm và ôn nhanh chu trình kế toán · Phần 2: doanh thu (IFRS 15), phải thu và tổn thất tín dụng (IFRS 9), hàng tồn kho (IAS 2) · Phần 3: tài sản cố định hữu hình (IAS 16) và suy giảm giá trị (IAS 36) · Phần 4: nợ phải trả — dự phòng (IAS 37), trái phiếu, thuê tài sản (IFRS 16) · Phần 5: vốn chủ sở hữu, báo cáo lưu chuyển tiền tệ (IAS 7) và phân tích báo cáo tài chính. Mọi doanh nghiệp đều là giả định, mọi con số là số liệu minh hoạ và mọi phép tính đã được kiểm tra.</p>
<div class="callout"><span class="badge">Một ý cần giữ</span> Gần như mọi câu hỏi trong môn đều quy về hai phép thử: khoản mục có thoả định nghĩa của một yếu tố (tài sản, nợ phải trả, vốn chủ sở hữu, thu nhập, chi phí) không, và ghi nhận nó có cho người sử dụng thông tin thích hợp, được trình bày trung thực không?</div>`,
  ]]);

const c1 = doc('fac201-1-1-conceptual-framework', '1.1 — The IFRS Conceptual Framework|||1.1 — Khung khái niệm IFRS',
  'Mục tiêu của báo cáo tài chính cho mục đích chung, người sử dụng chính, các đặc tính chất lượng cơ bản và bổ trợ, giả định hoạt động liên tục, năm yếu tố của báo cáo tài chính, tiêu chí ghi nhận và các cơ sở đo lường.',
  [[
    `<span class="eyebrow">FAC201 · Part 1 · Lesson 1.1</span>
<h2>The IFRS Conceptual Framework</h2>
<p class="lead">The <em>Conceptual Framework for Financial Reporting</em> (revised in 2018) is not a standard and never overrides one. It is the set of concepts the IASB uses to develop standards, and that preparers use to choose a policy when no standard applies to a transaction.</p>
<h3>Objective and primary users</h3>
<p>The objective of general-purpose financial reporting is to provide financial information about the reporting entity that is useful to <strong>existing and potential investors, lenders and other creditors</strong> in making decisions about providing resources to the entity — buying, selling or holding shares and debt, lending, and voting on management’s actions. Users also need the information to assess management’s <strong>stewardship</strong> of the entity’s economic resources. Financial reports cannot tell users everything; they also use information about the economy, the industry and the company’s prospects.</p>
<h3>Qualitative characteristics of useful information</h3>
<table>
<tr><th>Level</th><th>Characteristic</th><th>Meaning</th></tr>
<tr><td rowspan="2">Fundamental</td><td>Relevance</td><td>Capable of making a difference to decisions through <em>predictive value</em>, <em>confirmatory value</em> or both. <strong>Materiality</strong> is the entity-specific side of relevance: information is material if omitting, misstating or obscuring it could reasonably be expected to influence users’ decisions.</td></tr>
<tr><td>Faithful representation</td><td>Complete, neutral and free from error; it depicts the <em>substance</em> of an economic phenomenon, not merely its legal form. <strong>Prudence</strong> — caution when making judgements under uncertainty — supports neutrality; it does not permit deliberately understating assets or overstating liabilities.</td></tr>
<tr><td>Enhancing</td><td>Comparability · verifiability · timeliness · understandability</td><td>Make relevant, faithfully represented information more useful; they cannot rescue information that is irrelevant or misleading.</td></tr>
<tr><td>Constraint</td><td>Cost</td><td>The benefits of reporting information should justify the cost of providing and using it.</td></tr>
</table>
<p>Statements are prepared on the <strong>going concern</strong> assumption (the entity will continue operating for the foreseeable future) and on the <strong>accrual basis</strong>: effects of transactions are recorded in the periods in which they occur, even if cash is received or paid in a different period.</p>
<h3>The five elements</h3>
<table>
<tr><th>Element</th><th>Definition (Conceptual Framework 2018)</th></tr>
<tr><td>Asset</td><td>A present economic resource controlled by the entity as a result of past events. An economic resource is a right that has the potential to produce economic benefits.</td></tr>
<tr><td>Liability</td><td>A present obligation of the entity to transfer an economic resource as a result of past events.</td></tr>
<tr><td>Equity</td><td>The residual interest in the assets of the entity after deducting all its liabilities.</td></tr>
<tr><td>Income</td><td>Increases in assets, or decreases in liabilities, that result in increases in equity, other than those relating to contributions from holders of equity claims.</td></tr>
<tr><td>Expenses</td><td>Decreases in assets, or increases in liabilities, that result in decreases in equity, other than those relating to distributions to holders of equity claims.</td></tr>
</table>
<h3>Recognition and measurement</h3>
<p>An item is <strong>recognised</strong> — included in the statements with words and an amount — only if it meets the definition of an element <em>and</em> recognition provides users with relevant information and a faithful representation. Great uncertainty about whether an asset or liability exists, a very low probability of flows of economic benefits, or very high measurement uncertainty can mean that disclosure in the notes is more useful than recognition.</p>
<ul>
<li><strong>Historical cost</strong> — the price paid for an asset or received for a liability, adjusted for depreciation, impairment and so on.</li>
<li><strong>Current value</strong> — <em>fair value</em> (the price that would be received to sell an asset or paid to transfer a liability in an orderly transaction between market participants at the measurement date, IFRS 13), <em>value in use</em> for assets and <em>fulfilment value</em> for liabilities, and <em>current cost</em>.</li>
</ul>
<p>Individual standards choose the basis: inventories at the lower of cost and net realisable value (IAS 2), property, plant and equipment under the cost or revaluation model (IAS 16), financial instruments at amortised cost or fair value (IFRS 9).</p>
<div class="callout"><span class="badge">Test yourself</span> A company places an order with a supplier for delivery next month. Normally neither an asset nor a liability is recognised yet: neither party has performed (an <em>executory contract</em>). The exception comes when the contract becomes onerous — lesson 4.1.</div>`,
    `<span class="eyebrow">FAC201 · Phần 1 · Bài 1.1</span>
<h2>Khung khái niệm IFRS</h2>
<p class="lead"><em>Khung khái niệm cho báo cáo tài chính</em> (sửa đổi năm 2018) không phải là một chuẩn mực và không bao giờ được ưu tiên hơn chuẩn mực. Đó là bộ khái niệm mà IASB dùng để xây dựng chuẩn mực, và người lập báo cáo dùng để chọn chính sách khi chưa có chuẩn mực nào điều chỉnh giao dịch.</p>
<h3>Mục tiêu và người sử dụng chính</h3>
<p>Mục tiêu của báo cáo tài chính cho mục đích chung là cung cấp thông tin tài chính về đơn vị báo cáo, hữu ích cho <strong>nhà đầu tư, người cho vay và các chủ nợ khác, hiện tại và tiềm năng</strong> khi ra quyết định cung cấp nguồn lực cho đơn vị — mua, bán hoặc nắm giữ cổ phần và công cụ nợ, cho vay, và biểu quyết về hành động của ban điều hành. Người sử dụng cũng cần thông tin để đánh giá <strong>trách nhiệm quản lý</strong> của ban điều hành đối với nguồn lực kinh tế của đơn vị. Báo cáo tài chính không thể cho người sử dụng biết mọi thứ; họ còn dùng thông tin về nền kinh tế, ngành và triển vọng của công ty.</p>
<h3>Các đặc tính chất lượng của thông tin hữu ích</h3>
<table>
<tr><th>Cấp độ</th><th>Đặc tính</th><th>Ý nghĩa</th></tr>
<tr><td rowspan="2">Cơ bản</td><td>Thích hợp</td><td>Có khả năng làm thay đổi quyết định nhờ <em>giá trị dự đoán</em>, <em>giá trị xác nhận</em> hoặc cả hai. <strong>Trọng yếu</strong> là khía cạnh riêng của từng đơn vị trong tính thích hợp: thông tin là trọng yếu nếu việc bỏ sót, trình bày sai hoặc che khuất nó có thể được kỳ vọng một cách hợp lý là ảnh hưởng tới quyết định của người sử dụng.</td></tr>
<tr><td>Trình bày trung thực</td><td>Đầy đủ, trung lập và không có sai sót; phản ánh <em>bản chất</em> của hiện tượng kinh tế chứ không chỉ hình thức pháp lý. <strong>Thận trọng</strong> — sự cẩn trọng khi xét đoán trong điều kiện không chắc chắn — hỗ trợ tính trung lập; nó không cho phép cố ý ghi thấp tài sản hay ghi cao nợ phải trả.</td></tr>
<tr><td>Bổ trợ</td><td>Có thể so sánh · có thể kiểm chứng · kịp thời · dễ hiểu</td><td>Làm cho thông tin thích hợp, trung thực trở nên hữu ích hơn; không thể cứu một thông tin không thích hợp hoặc gây hiểu nhầm.</td></tr>
<tr><td>Giới hạn</td><td>Chi phí</td><td>Lợi ích của việc báo cáo thông tin phải bù đắp được chi phí cung cấp và sử dụng thông tin đó.</td></tr>
</table>
<p>Báo cáo được lập trên giả định <strong>hoạt động liên tục</strong> (đơn vị sẽ tiếp tục hoạt động trong tương lai gần) và trên <strong>cơ sở dồn tích</strong>: ảnh hưởng của giao dịch được ghi nhận vào kỳ phát sinh, kể cả khi tiền được thu hoặc chi ở kỳ khác.</p>
<h3>Năm yếu tố</h3>
<table>
<tr><th>Yếu tố</th><th>Định nghĩa (Khung khái niệm 2018)</th></tr>
<tr><td>Tài sản</td><td>Nguồn lực kinh tế hiện tại do đơn vị kiểm soát, là kết quả của các sự kiện trong quá khứ. Nguồn lực kinh tế là một quyền có tiềm năng tạo ra lợi ích kinh tế.</td></tr>
<tr><td>Nợ phải trả</td><td>Nghĩa vụ hiện tại của đơn vị phải chuyển giao một nguồn lực kinh tế, là kết quả của các sự kiện trong quá khứ.</td></tr>
<tr><td>Vốn chủ sở hữu</td><td>Phần lợi ích còn lại trong tài sản của đơn vị sau khi trừ toàn bộ nợ phải trả.</td></tr>
<tr><td>Thu nhập</td><td>Sự tăng tài sản hoặc giảm nợ phải trả làm tăng vốn chủ sở hữu, ngoại trừ phần liên quan tới góp vốn của người nắm giữ quyền đối với vốn chủ sở hữu.</td></tr>
<tr><td>Chi phí</td><td>Sự giảm tài sản hoặc tăng nợ phải trả làm giảm vốn chủ sở hữu, ngoại trừ phần liên quan tới phân phối cho người nắm giữ quyền đối với vốn chủ sở hữu.</td></tr>
</table>
<h3>Ghi nhận và đo lường</h3>
<p>Một khoản mục được <strong>ghi nhận</strong> — đưa vào báo cáo bằng tên gọi và số tiền — chỉ khi nó thoả định nghĩa của một yếu tố <em>và</em> việc ghi nhận cung cấp cho người sử dụng thông tin thích hợp, được trình bày trung thực. Sự không chắc chắn lớn về việc tài sản hay nợ phải trả có tồn tại không, xác suất rất thấp của dòng lợi ích kinh tế, hoặc mức không chắc chắn đo lường rất cao có thể khiến việc thuyết minh hữu ích hơn việc ghi nhận.</p>
<ul>
<li><strong>Giá gốc</strong> — giá đã trả để có tài sản hoặc đã nhận khi phát sinh nợ, được điều chỉnh cho khấu hao, suy giảm giá trị và các yếu tố tương tự.</li>
<li><strong>Giá trị hiện hành</strong> — <em>giá trị hợp lý</em> (giá sẽ nhận được khi bán một tài sản hoặc phải trả để chuyển giao một khoản nợ trong giao dịch có tổ chức giữa các bên tham gia thị trường tại ngày đo lường, IFRS 13), <em>giá trị sử dụng</em> với tài sản và <em>giá trị thực hiện nghĩa vụ</em> với nợ phải trả, và <em>chi phí hiện hành</em>.</li>
</ul>
<p>Từng chuẩn mực chọn cơ sở đo lường: hàng tồn kho theo giá thấp hơn giữa giá gốc và giá trị thuần có thể thực hiện được (IAS 2), tài sản cố định hữu hình theo mô hình giá gốc hoặc đánh giá lại (IAS 16), công cụ tài chính theo giá trị phân bổ hoặc giá trị hợp lý (IFRS 9).</p>
<div class="callout"><span class="badge">Tự kiểm tra</span> Một công ty đặt hàng với nhà cung cấp, giao tháng sau. Thông thường chưa ghi nhận tài sản hay nợ phải trả nào: chưa bên nào thực hiện nghĩa vụ (<em>hợp đồng chưa thực hiện</em>). Ngoại lệ là khi hợp đồng trở thành hợp đồng có rủi ro lớn (bất lợi) — bài 4.1.</div>`,
  ]]);

const c2 = doc('fac201-1-2-accounting-cycle', '1.2 — The accounting cycle & accrual adjustments|||1.2 — Chu trình kế toán & bút toán điều chỉnh dồn tích',
  'Ôn nhanh phương trình kế toán, quy tắc Nợ – Có, chín bước của chu trình kế toán, bốn nhóm bút toán điều chỉnh (chi phí trả trước, doanh thu nhận trước, doanh thu dồn tích, chi phí dồn tích) cùng các bút toán ước tính (khấu hao, tổn thất tín dụng) và ví dụ số Công ty Lotus.',
  [[
    `<span class="eyebrow">FAC201 · Part 1 · Lesson 1.2</span>
<h2>The accounting cycle &amp; accrual adjustments (refresher)</h2>
<p class="lead">ACC101 taught the mechanics of double entry. This lesson is the compact version you need for every later lesson, plus the adjusting entries that turn cash records into accrual-basis financial statements.</p>
<h3>The equation and the debit–credit rules</h3>
<pre><code>Assets = Liabilities + Equity
Equity = Share capital + Retained earnings (+ other reserves)
Retained earnings rise with income and fall with expenses and dividends

Debit increases:   assets, expenses, dividends
Credit increases:  liabilities, equity, income</code></pre>
<h3>The nine steps of the cycle</h3>
<ol>
<li>Analyse transactions from source documents (invoices, contracts, bank statements).</li>
<li>Journalise them.</li>
<li>Post to the ledger accounts.</li>
<li>Prepare an unadjusted trial balance.</li>
<li>Record adjusting entries at the end of the period.</li>
<li>Prepare an adjusted trial balance.</li>
<li>Prepare the financial statements.</li>
<li>Close income, expense and dividend accounts to retained earnings.</li>
<li>Prepare a post-closing trial balance.</li>
</ol>
<h3>Families of adjusting entries</h3>
<table>
<tr><th>Type</th><th>Situation</th><th>Entry</th></tr>
<tr><td>Deferral — prepaid expense</td><td>Cash paid before the expense is incurred</td><td>Dr Expense / Cr Prepaid asset</td></tr>
<tr><td>Deferral — unearned revenue</td><td>Cash received before the entity performs</td><td>Dr Unearned revenue (contract liability) / Cr Revenue</td></tr>
<tr><td>Accrual — accrued revenue</td><td>Performed, not yet billed or received</td><td>Dr Receivable / Cr Revenue</td></tr>
<tr><td>Accrual — accrued expense</td><td>Incurred, not yet paid</td><td>Dr Expense / Cr Payable</td></tr>
<tr><td>Estimates</td><td>Depreciation, credit losses</td><td>Dr Depreciation expense / Cr Accumulated depreciation</td></tr>
</table>
<h3>Worked example — Lotus Co. (fictional), year ending 31 December</h3>
<pre><code>1 Insurance: 12,000 paid on 1 Oct for 12 months -> 3 months used
  Dr Insurance expense       3,000  / Cr Prepaid insurance         3,000
2 A customer paid 24,000 on 1 Nov for 6 months of service -> 2 months earned
  Dr Unearned revenue        8,000  / Cr Service revenue           8,000
3 Services performed in December, not yet billed: 5,000
  Dr Accounts receivable     5,000  / Cr Service revenue           5,000
4 Salaries earned by staff in December, payable in January: 4,000
  Dr Salaries expense        4,000  / Cr Salaries payable          4,000
5 Note payable 60,000 at 10% a year, issued 1 Sep -> 4 months of interest
  60,000 x 10% x 4/12 = 2,000
  Dr Interest expense        2,000  / Cr Interest payable          2,000
6 Depreciation of equipment: 7,500
  Dr Depreciation expense    7,500  / Cr Accumulated depreciation  7,500

Effect on profit: + 8,000 + 5,000 − 3,000 − 4,000 − 2,000 − 7,500 = − 3,500
Unadjusted profit 50,000  ->  adjusted profit 46,500</code></pre>
<p>Every adjusting entry touches one statement-of-financial-position account and one income-statement account, and none of them involves cash. That is why adjustments are recorded at the end of the period — nothing in the bank account prompts them.</p>
<h3>Closing the books</h3>
<p>After the statements are prepared, income and expense accounts are closed (brought to zero) and their net balance — profit or loss — is transferred to retained earnings, together with dividends declared. Only statement-of-financial-position accounts carry forward into the new year.</p>
<div class="callout"><span class="badge">Watch out</span> Missing an adjustment does not only misstate profit: it also misstates an asset or a liability. For accruals and deferrals the error usually reverses (counterbalances) in the next period, so two years are wrong instead of one; an omitted depreciation charge does not reverse and stays in the accounts until the asset is disposed of.</div>`,
    `<span class="eyebrow">FAC201 · Phần 1 · Bài 1.2</span>
<h2>Chu trình kế toán &amp; bút toán điều chỉnh dồn tích (ôn tập)</h2>
<p class="lead">ACC101 đã dạy kỹ thuật ghi sổ kép. Bài này là bản tóm gọn bạn cần cho mọi bài sau, cùng các bút toán điều chỉnh biến số liệu ghi theo tiền thành báo cáo tài chính theo cơ sở dồn tích.</p>
<h3>Phương trình kế toán và quy tắc Nợ – Có</h3>
<pre><code>Tài sản = Nợ phải trả + Vốn chủ sở hữu
Vốn chủ sở hữu = Vốn cổ phần + Lợi nhuận giữ lại (+ các quỹ, dự trữ khác)
Lợi nhuận giữ lại tăng theo thu nhập, giảm theo chi phí và cổ tức

Ghi Nợ làm tăng:  tài sản, chi phí, cổ tức
Ghi Có làm tăng:  nợ phải trả, vốn chủ sở hữu, thu nhập</code></pre>
<h3>Chín bước của chu trình</h3>
<ol>
<li>Phân tích giao dịch từ chứng từ gốc (hoá đơn, hợp đồng, sao kê ngân hàng).</li>
<li>Ghi nhật ký.</li>
<li>Chuyển sổ cái.</li>
<li>Lập bảng cân đối thử chưa điều chỉnh.</li>
<li>Ghi các bút toán điều chỉnh cuối kỳ.</li>
<li>Lập bảng cân đối thử sau điều chỉnh.</li>
<li>Lập báo cáo tài chính.</li>
<li>Khoá sổ các tài khoản thu nhập, chi phí và cổ tức vào lợi nhuận giữ lại.</li>
<li>Lập bảng cân đối thử sau khoá sổ.</li>
</ol>
<h3>Các nhóm bút toán điều chỉnh</h3>
<table>
<tr><th>Loại</th><th>Tình huống</th><th>Bút toán</th></tr>
<tr><td>Hoãn lại — chi phí trả trước</td><td>Đã trả tiền trước khi chi phí phát sinh</td><td>Nợ Chi phí / Có Chi phí trả trước (tài sản)</td></tr>
<tr><td>Hoãn lại — doanh thu nhận trước</td><td>Đã nhận tiền trước khi đơn vị thực hiện</td><td>Nợ Doanh thu nhận trước (nợ phải trả theo hợp đồng) / Có Doanh thu</td></tr>
<tr><td>Dồn tích — doanh thu dồn tích</td><td>Đã thực hiện, chưa lập hoá đơn hay thu tiền</td><td>Nợ Phải thu / Có Doanh thu</td></tr>
<tr><td>Dồn tích — chi phí dồn tích</td><td>Đã phát sinh, chưa trả tiền</td><td>Nợ Chi phí / Có Phải trả</td></tr>
<tr><td>Ước tính</td><td>Khấu hao, tổn thất tín dụng</td><td>Nợ Chi phí khấu hao / Có Hao mòn luỹ kế</td></tr>
</table>
<h3>Ví dụ — Công ty Lotus (giả định), năm tài chính kết thúc 31/12</h3>
<pre><code>1 Bảo hiểm: trả 12.000 ngày 1/10 cho 12 tháng -> đã dùng 3 tháng
  Nợ Chi phí bảo hiểm        3.000  / Có Chi phí trả trước         3.000
2 Khách hàng trả 24.000 ngày 1/11 cho 6 tháng dịch vụ -> đã thực hiện 2 tháng
  Nợ Doanh thu nhận trước    8.000  / Có Doanh thu dịch vụ         8.000
3 Dịch vụ đã làm trong tháng 12, chưa lập hoá đơn: 5.000
  Nợ Phải thu khách hàng     5.000  / Có Doanh thu dịch vụ         5.000
4 Lương nhân viên tháng 12, trả vào tháng 1: 4.000
  Nợ Chi phí lương           4.000  / Có Phải trả người lao động   4.000
5 Thương phiếu phải trả 60.000, lãi 10%/năm, phát hành 1/9 -> lãi 4 tháng
  60.000 x 10% x 4/12 = 2.000
  Nợ Chi phí lãi vay         2.000  / Có Lãi vay phải trả          2.000
6 Khấu hao thiết bị: 7.500
  Nợ Chi phí khấu hao        7.500  / Có Hao mòn luỹ kế            7.500

Ảnh hưởng tới lợi nhuận: + 8.000 + 5.000 − 3.000 − 4.000 − 2.000 − 7.500 = − 3.500
Lợi nhuận chưa điều chỉnh 50.000  ->  lợi nhuận sau điều chỉnh 46.500</code></pre>
<p>Mỗi bút toán điều chỉnh chạm tới một tài khoản trên báo cáo tình hình tài chính và một tài khoản trên báo cáo kết quả kinh doanh, và không bút toán nào liên quan tới tiền. Vì thế các điều chỉnh được ghi vào cuối kỳ — không có biến động nào trên tài khoản ngân hàng nhắc bạn ghi chúng.</p>
<h3>Khoá sổ</h3>
<p>Sau khi lập báo cáo, các tài khoản thu nhập và chi phí được khoá sổ (đưa về 0) và số chênh lệch — lãi hoặc lỗ — được kết chuyển vào lợi nhuận giữ lại, cùng với cổ tức đã công bố. Chỉ các tài khoản trên báo cáo tình hình tài chính mới mang sang năm mới.</p>
<div class="callout"><span class="badge">Cẩn thận</span> Bỏ sót một bút toán điều chỉnh không chỉ làm sai lợi nhuận: nó còn làm sai một tài sản hoặc một khoản nợ. Với các khoản dồn tích và hoãn lại, sai sót thường tự đảo ngược (tự triệt tiêu) ở kỳ sau, nên sai hai năm chứ không phải một; còn bỏ sót khấu hao thì không tự đảo ngược mà nằm lại trên sổ cho tới khi tài sản được thanh lý.</div>`,
  ]]);

const c2q = quiz('fac201-quiz-1', 'Quiz 1 — Framework & accounting cycle|||Quiz 1 — Khung khái niệm & chu trình kế toán', [
  { id: 'q1', question: 'Under the IFRS Conceptual Framework, which two are the fundamental qualitative characteristics?|||Theo Khung khái niệm IFRS, hai đặc tính chất lượng cơ bản là gì?', options: ['Comparability and verifiability|||Có thể so sánh và có thể kiểm chứng', 'Timeliness and understandability|||Kịp thời và dễ hiểu', 'Relevance and faithful representation|||Thích hợp và trình bày trung thực', 'Prudence and consistency|||Thận trọng và nhất quán'], correctIndex: 2, explanation: 'Relevance and faithful representation are fundamental; comparability, verifiability, timeliness and understandability are enhancing characteristics.|||Thích hợp và trình bày trung thực là đặc tính cơ bản; có thể so sánh, có thể kiểm chứng, kịp thời và dễ hiểu là các đặc tính bổ trợ.' },
  { id: 'q2', question: 'On 1 October a company pays 12,000 for 12 months of insurance and records it as a prepaid asset. What is the adjusting entry at 31 December?|||Ngày 1/10 công ty trả 12.000 tiền bảo hiểm cho 12 tháng và ghi nhận là chi phí trả trước. Bút toán điều chỉnh ngày 31/12 là gì?', options: ['Dr Insurance expense 3,000 / Cr Prepaid insurance 3,000|||Nợ Chi phí bảo hiểm 3.000 / Có Chi phí trả trước 3.000', 'Dr Insurance expense 9,000 / Cr Prepaid insurance 9,000|||Nợ Chi phí bảo hiểm 9.000 / Có Chi phí trả trước 9.000', 'Dr Prepaid insurance 3,000 / Cr Cash 3,000|||Nợ Chi phí trả trước 3.000 / Có Tiền 3.000', 'No entry until the policy expires|||Không ghi gì cho tới khi hợp đồng bảo hiểm hết hạn'], correctIndex: 0, explanation: 'Three months (October to December) have been used: 12,000 x 3/12 = 3,000. The remaining 9,000 is still an asset.|||Đã dùng ba tháng (tháng 10 tới tháng 12): 12.000 x 3/12 = 3.000. Phần 9.000 còn lại vẫn là tài sản.' },
  { id: 'q3', question: 'Which is the Conceptual Framework definition of a liability?|||Định nghĩa nợ phải trả theo Khung khái niệm là gì?', options: ['Any payment the entity plans to make next year|||Mọi khoản chi mà đơn vị dự định trả trong năm tới', 'The residual interest in assets after deducting all liabilities|||Phần lợi ích còn lại trong tài sản sau khi trừ toàn bộ nợ phải trả', 'A decrease in economic benefits during the period|||Sự giảm lợi ích kinh tế trong kỳ', 'A present obligation to transfer an economic resource as a result of past events|||Nghĩa vụ hiện tại phải chuyển giao một nguồn lực kinh tế, là kết quả của sự kiện trong quá khứ'], correctIndex: 3, explanation: 'A plan alone creates no obligation; the residual interest is equity; a decrease in economic benefits describes expenses.|||Một dự định đơn thuần không tạo ra nghĩa vụ; phần lợi ích còn lại là vốn chủ sở hữu; sự giảm lợi ích kinh tế mô tả chi phí.' },
]);

const c3 = doc('fac201-2-1-revenue-ifrs15', '2.1 — Revenue from contracts with customers (IFRS 15)|||2.1 — Doanh thu từ hợp đồng với khách hàng (IFRS 15)',
  'Nguyên tắc cốt lõi và mô hình 5 bước của IFRS 15: hợp đồng, nghĩa vụ thực hiện, giá giao dịch, phân bổ theo giá bán riêng lẻ, ghi nhận theo thời điểm hoặc theo thời gian; ví dụ gói sản phẩm, phương pháp đầu vào, tài sản và nợ phải trả theo hợp đồng, bảo hành, bên chính và bên đại lý.',
  [[
    `<span class="eyebrow">FAC201 · Part 2 · Lesson 2.1</span>
<h2>Revenue from contracts with customers — IFRS 15</h2>
<p class="lead">IFRS 15 has one core principle: recognise revenue to depict the transfer of promised goods or services to customers, in an amount that reflects the consideration the entity expects to be entitled to in exchange. The same five steps apply to a cup of coffee, a software licence and a three-year construction project.</p>
<h3>The five-step model</h3>
<table>
<tr><th>Step</th><th>What you do</th><th>Key points</th></tr>
<tr><td>1. Identify the contract</td><td>Find an agreement that creates enforceable rights and obligations</td><td>Approved and the parties committed; rights and payment terms identifiable; commercial substance; collection of the consideration probable</td></tr>
<tr><td>2. Identify the performance obligations</td><td>List the promises to transfer goods or services</td><td>Each <strong>distinct</strong> good or service is a separate obligation: capable of being distinct (the customer can benefit from it on its own or with readily available resources) and distinct in the context of the contract (not highly integrated with, significantly modifying or highly interdependent on other promises)</td></tr>
<tr><td>3. Determine the transaction price</td><td>Measure the consideration expected</td><td>Excludes amounts collected for third parties, such as VAT; <em>variable consideration</em> (discounts, rebates, bonuses, penalties) is estimated by the expected value or the most likely amount and included only to the extent a significant reversal is highly probable not to occur; adjust for a significant financing component, non-cash consideration and consideration payable to the customer</td></tr>
<tr><td>4. Allocate the transaction price</td><td>Split it over the performance obligations</td><td>In proportion to <strong>stand-alone selling prices</strong> (SSP). If an SSP is not observable, estimate it: adjusted market assessment, expected cost plus a margin, or — only in limited cases — the residual approach. A discount is spread proportionally unless evidence links it to specific obligations</td></tr>
<tr><td>5. Recognise revenue</td><td>When (or as) each obligation is satisfied</td><td>An obligation is satisfied when <strong>control</strong> of the good or service passes to the customer — over time or at a point in time</td></tr>
</table>
<h3>Over time or at a point in time?</h3>
<p>A performance obligation is satisfied <strong>over time</strong> if any one of three criteria is met: (1) the customer simultaneously receives and consumes the benefits as the entity performs (cleaning, maintenance); (2) the entity’s performance creates or enhances an asset that the customer controls (building on the customer’s land); (3) the performance creates an asset with no alternative use to the entity <em>and</em> the entity has an enforceable right to payment for performance completed to date. Otherwise it is satisfied <strong>at a point in time</strong>, judged by indicators of control: a present right to payment, legal title, physical possession, the significant risks and rewards of ownership, and customer acceptance. Progress over time is measured by <em>output methods</em> (units delivered, milestones) or <em>input methods</em> (costs incurred relative to total expected costs).</p>
<h3>Two short examples (fictional)</h3>
<pre><code>Example 1 — a bundle. A fitness club sells a package for VND 9,000,000:
a smartwatch + 12 months of coaching.
SSP: smartwatch 4,000,000; coaching 8,000,000; total 12,000,000
Allocation: smartwatch 9,000,000 x 4/12 = 3,000,000 -> revenue when handed over
            coaching   9,000,000 x 8/12 = 6,000,000 -> 500,000 a month for 12 months
Cash received up front:
  Dr Cash 9,000,000 / Cr Revenue 3,000,000 / Cr Contract liability 6,000,000

Example 2 — over time, input method. A builder signs a contract for 10,000,000;
estimated total cost 8,000,000; costs incurred to date 2,000,000.
Progress = 2,000,000 / 8,000,000 = 25%  ->  revenue to date = 10,000,000 x 25% = 2,500,000</code></pre>
<h3>Contract balances, warranties, principal or agent</h3>
<ul>
<li><strong>Contract liability</strong>: the customer has paid (or payment is due) before the entity performs — the "unearned revenue" of lesson 1.2. <strong>Contract asset</strong>: the entity has performed but its right to consideration is conditional on something other than the passage of time; once the right is unconditional it becomes a <strong>receivable</strong>.</li>
<li><strong>Assurance-type warranty</strong> (the product works as promised) is not a separate obligation: its expected cost is a provision under IAS 37 (lesson 4.1). A <strong>service-type warranty</strong> (sold separately, or extra service beyond assurance) is a separate performance obligation, and part of the price is deferred.</li>
<li><strong>Principal or agent</strong>: an entity that controls the good or service before it is transferred is a principal and reports gross revenue; an agent that arranges for another party to supply it reports only its commission (net).</li>
</ul>
<div class="callout"><span class="badge">Key lesson</span> Revenue follows control, not cash. Cash received in advance is a liability; revenue earned but not yet billed is an asset.</div>`,
    `<span class="eyebrow">FAC201 · Phần 2 · Bài 2.1</span>
<h2>Doanh thu từ hợp đồng với khách hàng — IFRS 15</h2>
<p class="lead">IFRS 15 có một nguyên tắc cốt lõi: ghi nhận doanh thu để phản ánh việc chuyển giao hàng hoá hoặc dịch vụ đã hứa cho khách hàng, theo số tiền phản ánh khoản thanh toán mà đơn vị kỳ vọng được hưởng khi đổi lấy chúng. Cùng năm bước đó áp dụng cho một ly cà phê, một giấy phép phần mềm và một dự án xây dựng ba năm.</p>
<h3>Mô hình năm bước</h3>
<table>
<tr><th>Bước</th><th>Việc cần làm</th><th>Điểm chính</th></tr>
<tr><td>1. Xác định hợp đồng</td><td>Tìm thoả thuận tạo ra quyền và nghĩa vụ có hiệu lực thi hành</td><td>Được phê duyệt và các bên cam kết thực hiện; xác định được quyền và điều khoản thanh toán; có bản chất thương mại; có khả năng thu được khoản thanh toán</td></tr>
<tr><td>2. Xác định các nghĩa vụ thực hiện</td><td>Liệt kê các cam kết chuyển giao hàng hoá, dịch vụ</td><td>Mỗi hàng hoá, dịch vụ <strong>riêng biệt</strong> là một nghĩa vụ: có khả năng riêng biệt (khách hàng hưởng lợi từ nó một mình hoặc cùng nguồn lực sẵn có) và riêng biệt trong bối cảnh hợp đồng (không tích hợp chặt, không làm thay đổi đáng kể, không phụ thuộc lẫn nhau cao với cam kết khác)</td></tr>
<tr><td>3. Xác định giá giao dịch</td><td>Đo lường khoản thanh toán dự kiến</td><td>Không gồm khoản thu hộ bên thứ ba như thuế GTGT; <em>khoản thanh toán biến đổi</em> (chiết khấu, giảm giá, thưởng, phạt) ước tính theo giá trị kỳ vọng hoặc số tiền có khả năng nhất và chỉ đưa vào trong phạm vi rất có khả năng không bị đảo ngược đáng kể; điều chỉnh cho thành phần tài chính đáng kể, khoản thanh toán phi tiền tệ và khoản phải trả cho khách hàng</td></tr>
<tr><td>4. Phân bổ giá giao dịch</td><td>Chia cho các nghĩa vụ thực hiện</td><td>Theo tỷ lệ <strong>giá bán riêng lẻ</strong> (SSP). Nếu không quan sát được SSP thì ước tính: đánh giá thị trường có điều chỉnh, chi phí dự kiến cộng lợi nhuận biên, hoặc — chỉ trong trường hợp hạn chế — phương pháp phần còn lại. Khoản chiết khấu được chia theo tỷ lệ, trừ khi có bằng chứng nó gắn với nghĩa vụ cụ thể</td></tr>
<tr><td>5. Ghi nhận doanh thu</td><td>Khi (hoặc trong khi) từng nghĩa vụ được hoàn thành</td><td>Nghĩa vụ được hoàn thành khi <strong>quyền kiểm soát</strong> hàng hoá, dịch vụ chuyển sang khách hàng — theo thời gian hoặc tại một thời điểm</td></tr>
</table>
<h3>Theo thời gian hay tại một thời điểm?</h3>
<p>Một nghĩa vụ thực hiện được hoàn thành <strong>theo thời gian</strong> nếu thoả một trong ba tiêu chí: (1) khách hàng đồng thời nhận và sử dụng lợi ích khi đơn vị thực hiện (vệ sinh, bảo trì); (2) việc thực hiện tạo ra hoặc làm tăng giá trị một tài sản do khách hàng kiểm soát (xây trên đất của khách hàng); (3) việc thực hiện tạo ra tài sản không có mục đích sử dụng khác với đơn vị <em>và</em> đơn vị có quyền được thanh toán, có hiệu lực thi hành, cho phần việc đã hoàn thành tới nay. Nếu không, nghĩa vụ được hoàn thành <strong>tại một thời điểm</strong>, xét theo các dấu hiệu kiểm soát: quyền hiện tại được thanh toán, quyền sở hữu pháp lý, chiếm hữu vật chất, rủi ro và lợi ích đáng kể của quyền sở hữu, và sự chấp nhận của khách hàng. Tiến độ theo thời gian được đo bằng <em>phương pháp đầu ra</em> (số đơn vị đã giao, mốc hoàn thành) hoặc <em>phương pháp đầu vào</em> (chi phí đã phát sinh so với tổng chi phí dự kiến).</p>
<h3>Hai ví dụ ngắn (giả định)</h3>
<pre><code>Ví dụ 1 — gói sản phẩm. Một câu lạc bộ thể hình bán gói giá 9.000.000 đồng:
một đồng hồ thông minh + 12 tháng huấn luyện.
SSP: đồng hồ 4.000.000; huấn luyện 8.000.000; tổng 12.000.000
Phân bổ: đồng hồ    9.000.000 x 4/12 = 3.000.000 -> doanh thu khi bàn giao
         huấn luyện 9.000.000 x 8/12 = 6.000.000 -> 500.000 mỗi tháng trong 12 tháng
Thu tiền ngay từ đầu:
  Nợ Tiền 9.000.000 / Có Doanh thu 3.000.000 / Có Nợ phải trả theo hợp đồng 6.000.000

Ví dụ 2 — theo thời gian, phương pháp đầu vào. Nhà thầu ký hợp đồng 10.000.000;
tổng chi phí dự kiến 8.000.000; chi phí đã phát sinh tới nay 2.000.000.
Tiến độ = 2.000.000 / 8.000.000 = 25%  ->  doanh thu luỹ kế = 10.000.000 x 25% = 2.500.000</code></pre>
<h3>Số dư hợp đồng, bảo hành, bên chính hay bên đại lý</h3>
<ul>
<li><strong>Nợ phải trả theo hợp đồng</strong>: khách hàng đã trả (hoặc đã tới hạn trả) trước khi đơn vị thực hiện — chính là "doanh thu nhận trước" ở bài 1.2. <strong>Tài sản theo hợp đồng</strong>: đơn vị đã thực hiện nhưng quyền được thanh toán còn phụ thuộc vào điều kiện khác ngoài thời gian; khi quyền trở thành vô điều kiện thì chuyển thành <strong>khoản phải thu</strong>.</li>
<li><strong>Bảo hành đảm bảo</strong> (sản phẩm hoạt động như cam kết) không phải nghĩa vụ riêng: chi phí dự kiến là khoản dự phòng theo IAS 37 (bài 4.1). <strong>Bảo hành dịch vụ</strong> (bán riêng, hoặc dịch vụ thêm ngoài mức đảm bảo) là nghĩa vụ thực hiện riêng, và một phần giá bán bị hoãn ghi nhận.</li>
<li><strong>Bên chính hay bên đại lý</strong>: đơn vị kiểm soát hàng hoá, dịch vụ trước khi chuyển giao là bên chính và ghi nhận doanh thu theo tổng; bên đại lý chỉ sắp xếp để bên khác cung cấp thì chỉ ghi nhận hoa hồng (theo thuần).</li>
</ul>
<div class="callout"><span class="badge">Bài học chính</span> Doanh thu đi theo quyền kiểm soát, không đi theo tiền. Tiền nhận trước là nợ phải trả; doanh thu đã thực hiện nhưng chưa lập hoá đơn là tài sản.</div>`,
  ]]);

const c3e = doc('fac201-2-2-exercise', 'Exercise 1 — machine, installation and two years of maintenance|||Bài tập 1 — máy, lắp đặt và hai năm bảo trì',
  'Bài tập IFRS 15: xác định ba nghĩa vụ thực hiện, phân bổ giá giao dịch 144.000 theo giá bán riêng lẻ, ghi nhận doanh thu theo từng năm, số dư nợ phải trả theo hợp đồng, bút toán tháng 7 và trường hợp lắp đặt không riêng biệt; kèm lời giải.',
  [[
    `<span class="eyebrow">FAC201 · Part 2 · Exercise</span>
<h2>Exercise 1 — machine, installation and two years of maintenance</h2>
<div class="callout"><span class="badge">Problem</span> On 1 July 20X1, TechMach Co. (a fictional company) signs a contract to sell a packaging machine, install it and maintain it for 24 months (1 July 20X1 – 30 June 20X3) for a total price of $144,000, received in cash on 1 July. The machine is delivered and accepted on 1 July; installation — a standard job that other firms also offer — is completed on 15 July. Stand-alone selling prices: machine $120,000; installation $12,000; 24-month maintenance $28,000. Assume the contract contains no significant financing component (the effect is immaterial). Year-end: 31 December. (a) Identify the performance obligations. (b) Allocate the transaction price. (c) Compute revenue for 20X1, 20X2 and 20X3 and the contract liability at 31 December 20X1 and 20X2. (d) Record the entries for July 20X1. (e) What changes if only TechMach could install the machine and installation significantly modified it? (Illustrative figures.)</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) Three performance obligations:
    Machine       -> point in time (control passes on delivery and acceptance, 1 July)
    Installation  -> distinct (other firms can do it); satisfied on completion, 15 July
    Maintenance   -> over time (the customer receives and consumes the service
                     as it is provided); straight-line over 24 months

(b) Total SSP = 120,000 + 12,000 + 28,000 = 160,000   (discount 16,000 = 10%)
    Machine       144,000 x 120/160 = 108,000
    Installation  144,000 x  12/160 =  10,800
    Maintenance   144,000 x  28/160 =  25,200  ->  25,200 / 24 = 1,050 a month
    Check: 108,000 + 10,800 + 25,200 = 144,000 ✓

(c) Revenue 20X1 = 108,000 + 10,800 + 6 x 1,050 = 125,100
    Revenue 20X2 = 12 x 1,050                    =  12,600
    Revenue 20X3 =  6 x 1,050                    =   6,300
    Total                                          144,000 ✓
    Contract liability 31 Dec 20X1 = 144,000 − 125,100 = 18,900
    Contract liability 31 Dec 20X2 =  18,900 −  12,600 =  6,300

(d) 1 July   Dr Cash                  144,000
                Cr Revenue — machine            108,000
                Cr Contract liability            36,000
    15 July  Dr Contract liability     10,800
                Cr Revenue — installation        10,800
    31 July  Dr Contract liability      1,050
                Cr Revenue — maintenance          1,050   (repeated every month)

(e) Machine + installation become ONE obligation (not distinct in the context
    of the contract): 108,000 + 10,800 = 118,800 recognised when installation
    is complete and control passes (15 July). Maintenance is unchanged.
    Both dates fall in 20X1, so annual revenue is still 125,100 — it would
    differ if installation straddled the year-end.</code></pre>
<p><strong>Why:</strong> the 10% discount is spread over all three obligations because nothing shows it belongs to one of them. Booking the full $144,000 as revenue on 1 July would overstate 20X1 revenue by 18,900 and hide a real obligation — 18 more months of maintenance the customer has already paid for. The contract liability is exactly the part of the price for which the service is still owed.</p>`,
    `<span class="eyebrow">FAC201 · Phần 2 · Bài tập</span>
<h2>Bài tập 1 — máy, lắp đặt và hai năm bảo trì</h2>
<div class="callout"><span class="badge">Đề</span> Ngày 1/7/20X1, Công ty TechMach (doanh nghiệp giả định) ký hợp đồng bán một máy đóng gói, lắp đặt và bảo trì máy trong 24 tháng (1/7/20X1 – 30/6/20X3) với tổng giá 144.000 $, thu bằng tiền ngày 1/7. Máy được giao và nghiệm thu ngày 1/7; việc lắp đặt — một công việc tiêu chuẩn mà các công ty khác cũng cung cấp — hoàn thành ngày 15/7. Giá bán riêng lẻ: máy 120.000 $; lắp đặt 12.000 $; bảo trì 24 tháng 28.000 $. Giả định hợp đồng không có thành phần tài chính đáng kể (ảnh hưởng không trọng yếu). Năm tài chính kết thúc 31/12. (a) Xác định các nghĩa vụ thực hiện. (b) Phân bổ giá giao dịch. (c) Tính doanh thu năm 20X1, 20X2, 20X3 và nợ phải trả theo hợp đồng tại 31/12/20X1 và 31/12/20X2. (d) Ghi các bút toán tháng 7/20X1. (e) Điều gì thay đổi nếu chỉ TechMach lắp được máy và việc lắp đặt làm thay đổi đáng kể chiếc máy? (Số liệu minh hoạ.)</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) Ba nghĩa vụ thực hiện:
    Máy        -> tại một thời điểm (quyền kiểm soát chuyển khi giao và nghiệm thu, 1/7)
    Lắp đặt    -> riêng biệt (công ty khác làm được); hoàn thành khi xong việc, 15/7
    Bảo trì    -> theo thời gian (khách hàng nhận và sử dụng dịch vụ ngay khi
                  được cung cấp); phân bổ đều trong 24 tháng

(b) Tổng SSP = 120.000 + 12.000 + 28.000 = 160.000   (chiết khấu 16.000 = 10%)
    Máy        144.000 x 120/160 = 108.000
    Lắp đặt    144.000 x  12/160 =  10.800
    Bảo trì    144.000 x  28/160 =  25.200  ->  25.200 / 24 = 1.050 mỗi tháng
    Kiểm tra: 108.000 + 10.800 + 25.200 = 144.000 ✓

(c) Doanh thu 20X1 = 108.000 + 10.800 + 6 x 1.050 = 125.100
    Doanh thu 20X2 = 12 x 1.050                    =  12.600
    Doanh thu 20X3 =  6 x 1.050                    =   6.300
    Tổng                                             144.000 ✓
    Nợ phải trả theo hợp đồng 31/12/20X1 = 144.000 − 125.100 = 18.900
    Nợ phải trả theo hợp đồng 31/12/20X2 =  18.900 −  12.600 =  6.300

(d) 1/7    Nợ Tiền                              144.000
              Có Doanh thu — máy                         108.000
              Có Nợ phải trả theo hợp đồng                36.000
    15/7   Nợ Nợ phải trả theo hợp đồng          10.800
              Có Doanh thu — lắp đặt                      10.800
    31/7   Nợ Nợ phải trả theo hợp đồng           1.050
              Có Doanh thu — bảo trì                       1.050   (lặp lại mỗi tháng)

(e) Máy + lắp đặt thành MỘT nghĩa vụ (không riêng biệt trong bối cảnh hợp đồng):
    108.000 + 10.800 = 118.800 ghi nhận khi lắp đặt xong và quyền kiểm soát
    chuyển giao (15/7). Bảo trì không đổi. Cả hai ngày đều thuộc năm 20X1 nên
    doanh thu năm vẫn là 125.100 — sẽ khác nếu việc lắp đặt kéo qua ngày
    kết thúc năm tài chính.</code></pre>
<p><strong>Vì sao:</strong> khoản chiết khấu 10% được chia cho cả ba nghĩa vụ vì không có gì cho thấy nó thuộc về riêng một nghĩa vụ. Ghi toàn bộ 144.000 $ là doanh thu ngày 1/7 sẽ thổi phồng doanh thu 20X1 thêm 18.900 và che giấu một nghĩa vụ có thật — 18 tháng bảo trì nữa mà khách hàng đã trả tiền. Nợ phải trả theo hợp đồng chính là phần giá mà dịch vụ vẫn còn nợ khách hàng.</p>`,
  ]]);

const c4 = doc('fac201-2-3-receivables', '2.3 — Receivables & expected credit losses|||2.3 — Phải thu & dự phòng tổn thất tín dụng',
  'Ghi nhận khoản phải thu, mô hình tổn thất tín dụng dự kiến của IFRS 9 (cách tiếp cận đơn giản cho phải thu thương mại, ma trận dự phòng), bảng phân tích tuổi nợ có ví dụ số, bút toán lập dự phòng, xoá sổ và thu hồi nợ đã xoá.',
  [[
    `<span class="eyebrow">FAC201 · Part 2 · Lesson 2.3</span>
<h2>Receivables &amp; expected credit losses</h2>
<p class="lead">Selling on credit creates a receivable — a financial asset. Some customers will not pay, so the statement of financial position must show receivables at the amount the entity expects to collect, and the loss must be recognised when it is expected, not when a customer finally defaults.</p>
<h3>Recognition</h3>
<ul>
<li>A trade receivable arises when the right to consideration becomes unconditional (lesson 2.1). Without a significant financing component it is initially measured at the transaction price.</li>
<li>Sales returns, allowances and trade discounts reduce revenue and the receivable.</li>
<li>A <strong>note receivable</strong> is a written promise that usually carries interest: interest = principal x annual rate x time.</li>
</ul>
<h3>The expected credit loss (ECL) model — IFRS 9</h3>
<p>IFRS 9 requires a <strong>loss allowance</strong> for expected credit losses. The model is forward-looking: losses are estimated from past experience, current conditions and reasonable, supportable forecasts. For <strong>trade receivables</strong> (and contract assets) without a significant financing component, the <strong>simplified approach</strong> applies: the allowance always equals <em>lifetime</em> expected credit losses. Other financial assets follow the general approach (12-month ECL until credit risk increases significantly, then lifetime ECL). A common practical tool is a <strong>provision matrix</strong>: historical loss rates by age band, adjusted for forward-looking information. The direct write-off method — expensing a debt only when it proves uncollectible — records the loss too late and is not consistent with IFRS 9 when amounts are material.</p>
<h3>Worked example — aging schedule (fictional, 31 December)</h3>
<pre><code>Age band          Balance   Loss rate   Allowance needed
Not yet due       300,000       1%            3,000
1–30 days past     80,000       4%            3,200
31–60 days past    50,000      10%            5,000
61–90 days past    20,000      25%            5,000
Over 90 days       10,000      50%            5,000
Total             460,000                    21,200

Allowance before adjustment: CREDIT balance 6,000
Adjustment needed = 21,200 − 6,000 = 15,200
  Dr Impairment loss on receivables 15,200 / Cr Loss allowance 15,200
Carrying amount (net) = 460,000 − 21,200 = 438,800

If the allowance had a DEBIT balance of 2,000 (write-offs exceeded the estimate):
  loss = 21,200 + 2,000 = 23,200</code></pre>
<h3>Write-off and recovery</h3>
<pre><code>Customer K (1,500) goes bankrupt — write off:
  Dr Loss allowance 1,500 / Cr Accounts receivable 1,500
  -> no effect on profit and no effect on the net carrying amount
Customer K later pays after all — reinstate, then collect:
  Dr Accounts receivable 1,500 / Cr Loss allowance 1,500
  Dr Cash 1,500 / Cr Accounts receivable 1,500</code></pre>
<p>The expense was recognised when the allowance was built. A write-off is only a bookkeeping step that removes a debt already provided for; that is why it changes neither profit nor the net receivable.</p>
<div class="callout"><span class="badge">Remember</span> Loss rates are management estimates. Optimistic rates raise profit today and reverse later, so auditors and analysts watch the allowance closely — and so should you when you compare companies (lesson 5.4).</div>`,
    `<span class="eyebrow">FAC201 · Phần 2 · Bài 2.3</span>
<h2>Phải thu &amp; dự phòng tổn thất tín dụng</h2>
<p class="lead">Bán chịu tạo ra một khoản phải thu — một tài sản tài chính. Sẽ có khách hàng không trả, nên báo cáo tình hình tài chính phải trình bày khoản phải thu theo số đơn vị kỳ vọng thu được, và tổn thất phải được ghi nhận khi nó được dự kiến, chứ không phải khi khách hàng cuối cùng vỡ nợ.</p>
<h3>Ghi nhận</h3>
<ul>
<li>Khoản phải thu thương mại phát sinh khi quyền được thanh toán trở thành vô điều kiện (bài 2.1). Nếu không có thành phần tài chính đáng kể, nó được đo lường ban đầu theo giá giao dịch.</li>
<li>Hàng bán bị trả lại, giảm giá hàng bán và chiết khấu thương mại làm giảm doanh thu và khoản phải thu.</li>
<li><strong>Thương phiếu phải thu</strong> là cam kết trả tiền bằng văn bản, thường có lãi: lãi = gốc x lãi suất năm x thời gian.</li>
</ul>
<h3>Mô hình tổn thất tín dụng dự kiến (ECL) — IFRS 9</h3>
<p>IFRS 9 yêu cầu lập <strong>dự phòng tổn thất</strong> cho tổn thất tín dụng dự kiến. Mô hình mang tính hướng tới tương lai: tổn thất được ước tính từ kinh nghiệm quá khứ, điều kiện hiện tại và các dự báo hợp lý, có cơ sở. Với <strong>phải thu thương mại</strong> (và tài sản theo hợp đồng) không có thành phần tài chính đáng kể, áp dụng <strong>cách tiếp cận đơn giản</strong>: dự phòng luôn bằng tổn thất tín dụng dự kiến <em>trong toàn bộ thời gian tồn tại</em>. Các tài sản tài chính khác theo cách tiếp cận chung (ECL 12 tháng cho tới khi rủi ro tín dụng tăng đáng kể, sau đó là ECL toàn bộ thời gian tồn tại). Công cụ thực hành phổ biến là <strong>ma trận dự phòng</strong>: tỷ lệ tổn thất lịch sử theo nhóm tuổi nợ, điều chỉnh theo thông tin tương lai. Phương pháp xoá sổ trực tiếp — chỉ ghi chi phí khi khoản nợ chắc chắn không thu được — ghi nhận tổn thất quá muộn và không phù hợp với IFRS 9 khi số tiền là trọng yếu.</p>
<h3>Ví dụ — bảng phân tích tuổi nợ (giả định, ngày 31/12)</h3>
<pre><code>Nhóm tuổi nợ        Số dư     Tỷ lệ tổn thất   Dự phòng cần có
Chưa tới hạn       300.000        1%              3.000
Quá hạn 1–30 ngày   80.000        4%              3.200
Quá hạn 31–60 ngày  50.000       10%              5.000
Quá hạn 61–90 ngày  20.000       25%              5.000
Quá hạn trên 90     10.000       50%              5.000
Tổng               460.000                       21.200

Dự phòng trước điều chỉnh: số dư CÓ 6.000
Số cần điều chỉnh = 21.200 − 6.000 = 15.200
  Nợ Tổn thất suy giảm giá trị phải thu 15.200 / Có Dự phòng tổn thất 15.200
Giá trị ghi sổ (thuần) = 460.000 − 21.200 = 438.800

Nếu tài khoản dự phòng có số dư NỢ 2.000 (xoá sổ nhiều hơn ước tính):
  tổn thất = 21.200 + 2.000 = 23.200</code></pre>
<h3>Xoá sổ và thu hồi</h3>
<pre><code>Khách hàng K (1.500) phá sản — xoá sổ:
  Nợ Dự phòng tổn thất 1.500 / Có Phải thu khách hàng 1.500
  -> không ảnh hưởng lợi nhuận và không ảnh hưởng giá trị ghi sổ thuần
Sau đó khách hàng K vẫn trả — khôi phục rồi thu tiền:
  Nợ Phải thu khách hàng 1.500 / Có Dự phòng tổn thất 1.500
  Nợ Tiền 1.500 / Có Phải thu khách hàng 1.500</code></pre>
<p>Chi phí đã được ghi nhận khi lập dự phòng. Xoá sổ chỉ là bước ghi chép loại bỏ một khoản nợ đã được dự phòng; vì thế nó không làm thay đổi lợi nhuận hay khoản phải thu thuần.</p>
<div class="callout"><span class="badge">Ghi nhớ</span> Tỷ lệ tổn thất là ước tính của ban điều hành. Tỷ lệ lạc quan làm tăng lợi nhuận hôm nay và đảo ngược về sau, nên kiểm toán viên và nhà phân tích theo dõi sát khoản dự phòng — bạn cũng nên như vậy khi so sánh các công ty (bài 5.4).</div>`,
  ]]);

const c5 = doc('fac201-2-4-inventories', '2.4 — Inventories (IAS 2)|||2.4 — Hàng tồn kho (IAS 2)',
  'Các khoản được và không được tính vào giá gốc hàng tồn kho, phương pháp tính giá (thực tế đích danh, FIFO, bình quân gia quyền; LIFO bị cấm), ví dụ số so sánh FIFO và bình quân, nguyên tắc giá thấp hơn giữa giá gốc và giá trị thuần có thể thực hiện được, ghi giảm theo từng mặt hàng và hoàn nhập.',
  [[
    `<span class="eyebrow">FAC201 · Part 2 · Lesson 2.4</span>
<h2>Inventories — IAS 2</h2>
<p class="lead">Inventories are assets held for sale in the ordinary course of business, in the process of production for such sale, or as materials and supplies to be consumed in production or in rendering services. IAS 2 has one measurement rule: the <strong>lower of cost and net realisable value</strong>.</p>
<h3>What goes into cost</h3>
<table>
<tr><th>Include</th><th>Exclude (expense when incurred)</th></tr>
<tr><td>Costs of purchase: purchase price, import duties and non-recoverable taxes, transport and handling, less trade discounts and rebates</td><td>Taxes the entity can recover, such as input VAT that is reclaimable</td></tr>
<tr><td>Costs of conversion: direct labour and a systematic allocation of fixed and variable production overheads (fixed overheads based on normal capacity)</td><td>Abnormal amounts of wasted materials, labour or other production costs</td></tr>
<tr><td>Other costs incurred to bring inventories to their present location and condition</td><td>Storage costs (unless necessary in production before a further stage), administrative overheads that do not contribute to that location and condition, selling costs</td></tr>
</table>
<h3>Cost formulas</h3>
<ul>
<li><strong>Specific identification</strong> — required for items that are not ordinarily interchangeable or are produced for specific projects.</li>
<li><strong>First-in, first-out (FIFO)</strong> — the items bought first are assumed to be sold first.</li>
<li><strong>Weighted average cost</strong> — cost of goods available divided by units available (recalculated after every purchase in a perpetual system: the moving average).</li>
<li><strong>LIFO is prohibited</strong> under IAS 2. US GAAP still allows it — beware of US-based materials. The same formula must be used for all inventories of a similar nature and use.</li>
</ul>
<h3>Worked example (fictional, periodic system)</h3>
<pre><code>Opening inventory   100 units x 10 = 1,000
Purchase (March)    200 units x 12 = 2,400
Purchase (August)   200 units x 13 = 2,600
Goods available     500 units        6,000   -> average cost 6,000 / 500 = 12.00
Sold 300 units at 20 each (sales 6,000); ending inventory 200 units

                     FIFO    Weighted average   (LIFO — not allowed)
Ending inventory    2,600        2,400              (2,200)
Cost of sales       3,400        3,600              (3,800)
Gross profit        2,600        2,400              (2,200)</code></pre>
<p>When prices are rising, FIFO reports a higher inventory and a higher profit because cost of sales uses the older, cheaper costs; weighted average smooths the effect. The choice changes the reported numbers, not the goods or the cash (ignoring tax).</p>
<h3>Lower of cost and net realisable value (NRV)</h3>
<pre><code>NRV = estimated selling price − estimated costs of completion − estimated costs to sell
Selling price 14.00 per unit, costs to sell 1.50  ->  NRV 12.50
FIFO cost 13.00 &gt; 12.50  ->  write down 200 x 0.50 = 100
  Dr Cost of sales (inventory write-down) 100 / Cr Inventories 100
Weighted average cost 12.00 &lt; 12.50  ->  no write-down

Item by item, not in total:
Item    Cost     NRV     Lower
A      5,000    6,200    5,000
B      3,000    2,400    2,400
C      4,000    4,100    4,000
Total 12,000   12,700   11,400   -> write-down 600
(comparing totals, 12,000 against 12,700, would wrongly show no write-down)</code></pre>
<p>Write-downs are normally made item by item, or for groups of similar or related items — never for a whole category such as "finished goods". If NRV later recovers, the write-down is reversed, but only up to the original write-down: inventory is never carried above cost.</p>
<div class="callout"><span class="badge">Key lesson</span> Cost flows to the income statement as cost of sales; the cost formula decides <em>which</em> costs stay on the statement of financial position. NRV sets the ceiling.</div>`,
    `<span class="eyebrow">FAC201 · Phần 2 · Bài 2.4</span>
<h2>Hàng tồn kho — IAS 2</h2>
<p class="lead">Hàng tồn kho là tài sản được giữ để bán trong kỳ kinh doanh bình thường, đang trong quá trình sản xuất để bán, hoặc là nguyên vật liệu, công cụ dùng trong sản xuất hay cung cấp dịch vụ. IAS 2 có một quy tắc đo lường: <strong>giá thấp hơn giữa giá gốc và giá trị thuần có thể thực hiện được</strong>.</p>
<h3>Những gì được tính vào giá gốc</h3>
<table>
<tr><th>Được tính</th><th>Không được tính (ghi chi phí khi phát sinh)</th></tr>
<tr><td>Chi phí mua: giá mua, thuế nhập khẩu và các loại thuế không được hoàn lại, vận chuyển, bốc xếp, trừ chiết khấu thương mại và giảm giá</td><td>Các khoản thuế đơn vị được hoàn lại, như thuế GTGT đầu vào được khấu trừ</td></tr>
<tr><td>Chi phí chế biến: nhân công trực tiếp và phần phân bổ có hệ thống của chi phí sản xuất chung cố định và biến đổi (chi phí cố định phân bổ theo công suất bình thường)</td><td>Nguyên vật liệu, nhân công hoặc chi phí sản xuất khác bị lãng phí bất thường</td></tr>
<tr><td>Chi phí khác phát sinh để đưa hàng tồn kho tới địa điểm và trạng thái hiện tại</td><td>Chi phí bảo quản (trừ khi cần thiết cho sản xuất trước công đoạn tiếp theo), chi phí quản lý không góp phần đưa hàng tới địa điểm và trạng thái đó, chi phí bán hàng</td></tr>
</table>
<h3>Phương pháp tính giá</h3>
<ul>
<li><strong>Thực tế đích danh</strong> — bắt buộc với hàng không thể thay thế cho nhau thông thường hoặc được sản xuất cho dự án riêng.</li>
<li><strong>Nhập trước, xuất trước (FIFO)</strong> — giả định hàng mua trước được bán trước.</li>
<li><strong>Bình quân gia quyền</strong> — giá gốc hàng sẵn có để bán chia cho số đơn vị sẵn có (với kê khai thường xuyên thì tính lại sau mỗi lần mua: bình quân liên hoàn).</li>
<li><strong>LIFO bị cấm</strong> theo IAS 2. US GAAP vẫn cho phép — cẩn thận với tài liệu theo chuẩn Mỹ. Phải dùng cùng một phương pháp cho mọi hàng tồn kho có cùng tính chất và công dụng.</li>
</ul>
<h3>Ví dụ (giả định, kiểm kê định kỳ)</h3>
<pre><code>Tồn đầu kỳ        100 đơn vị x 10 = 1.000
Mua (tháng 3)     200 đơn vị x 12 = 2.400
Mua (tháng 8)     200 đơn vị x 13 = 2.600
Hàng sẵn có       500 đơn vị        6.000   -> giá bình quân 6.000 / 500 = 12,00
Bán 300 đơn vị giá 20 (doanh thu 6.000); tồn cuối kỳ 200 đơn vị

                     FIFO    Bình quân gia quyền   (LIFO — không được phép)
Tồn kho cuối kỳ     2.600         2.400                (2.200)
Giá vốn hàng bán    3.400         3.600                (3.800)
Lợi nhuận gộp       2.600         2.400                (2.200)</code></pre>
<p>Khi giá tăng, FIFO cho hàng tồn kho và lợi nhuận cao hơn vì giá vốn dùng các chi phí cũ, rẻ hơn; bình quân gia quyền làm dịu tác động. Lựa chọn phương pháp thay đổi con số báo cáo, không thay đổi hàng hoá hay tiền (bỏ qua thuế).</p>
<h3>Giá thấp hơn giữa giá gốc và giá trị thuần có thể thực hiện được (NRV)</h3>
<pre><code>NRV = giá bán ước tính − chi phí ước tính để hoàn thành − chi phí ước tính để bán
Giá bán 14,00 mỗi đơn vị, chi phí bán 1,50  ->  NRV 12,50
Giá gốc FIFO 13,00 &gt; 12,50  ->  ghi giảm 200 x 0,50 = 100
  Nợ Giá vốn hàng bán (ghi giảm hàng tồn kho) 100 / Có Hàng tồn kho 100
Giá gốc bình quân 12,00 &lt; 12,50  ->  không ghi giảm

Theo từng mặt hàng, không theo tổng:
Mặt hàng  Giá gốc    NRV    Giá thấp hơn
A          5.000    6.200     5.000
B          3.000    2.400     2.400
C          4.000    4.100     4.000
Tổng      12.000   12.700    11.400   -> ghi giảm 600
(so sánh theo tổng, 12.000 với 12.700, sẽ sai lầm cho thấy không cần ghi giảm)</code></pre>
<p>Việc ghi giảm thường thực hiện theo từng mặt hàng, hoặc theo nhóm mặt hàng tương tự, liên quan — không bao giờ theo cả một loại lớn như "thành phẩm". Nếu NRV sau đó tăng trở lại thì hoàn nhập, nhưng chỉ tới mức đã ghi giảm ban đầu: hàng tồn kho không bao giờ được ghi cao hơn giá gốc.</p>
<div class="callout"><span class="badge">Bài học chính</span> Giá gốc chảy sang báo cáo kết quả kinh doanh dưới dạng giá vốn; phương pháp tính giá quyết định chi phí <em>nào</em> ở lại trên báo cáo tình hình tài chính. NRV đặt mức trần.</div>`,
  ]]);

const c5q = quiz('fac201-quiz-2', 'Quiz 2 — Revenue, receivables & inventories|||Quiz 2 — Doanh thu, phải thu & hàng tồn kho', [
  { id: 'q1', question: 'In the IFRS 15 five-step model, what is step 4?|||Trong mô hình 5 bước của IFRS 15, bước 4 là gì?', options: ['Identify the performance obligations|||Xác định các nghĩa vụ thực hiện', 'Allocate the transaction price to the performance obligations|||Phân bổ giá giao dịch cho các nghĩa vụ thực hiện', 'Recognise revenue when a performance obligation is satisfied|||Ghi nhận doanh thu khi nghĩa vụ thực hiện được hoàn thành', 'Determine the transaction price|||Xác định giá giao dịch'], correctIndex: 1, explanation: 'The order is: contract, performance obligations, transaction price, allocation (by relative stand-alone selling prices), recognition.|||Thứ tự là: hợp đồng, nghĩa vụ thực hiện, giá giao dịch, phân bổ (theo tỷ lệ giá bán riêng lẻ), ghi nhận.' },
  { id: 'q2', question: 'An aging schedule shows a required loss allowance of 18,000. Before adjustment the allowance account has a DEBIT balance of 1,500. What impairment loss is recognised?|||Bảng phân tích tuổi nợ cho thấy dự phòng cần có là 18.000. Trước điều chỉnh, tài khoản dự phòng có số dư NỢ 1.500. Tổn thất suy giảm giá trị được ghi nhận là bao nhiêu?', options: ['16,500|||16.500', '18,000|||18.000', '19,500|||19.500', '1,500|||1.500'], correctIndex: 2, explanation: 'The entry must turn a 1,500 debit balance into an 18,000 credit balance: 18,000 + 1,500 = 19,500.|||Bút toán phải biến số dư Nợ 1.500 thành số dư Có 18.000: 18.000 + 1.500 = 19.500.' },
  { id: 'q3', question: 'An inventory item cost 50. Its estimated selling price is 60, estimated costs to complete are 8 and estimated selling costs are 4. At what amount is it carried under IAS 2?|||Một mặt hàng tồn kho có giá gốc 50. Giá bán ước tính 60, chi phí ước tính để hoàn thành 8 và chi phí bán ước tính 4. Theo IAS 2, mặt hàng được ghi nhận theo giá trị nào?', options: ['48|||48', '50|||50', '56|||56', '60|||60'], correctIndex: 0, explanation: 'NRV = 60 − 8 − 4 = 48, which is below the cost of 50, so the item is written down by 2 to 48.|||NRV = 60 − 8 − 4 = 48, thấp hơn giá gốc 50, nên mặt hàng được ghi giảm 2 xuống 48.' },
]);

const c6 = doc('fac201-3-1-ppe-depreciation', '3.1 — Property, plant & equipment and depreciation (IAS 16)|||3.1 — Tài sản cố định hữu hình & khấu hao (IAS 16)',
  'Điều kiện ghi nhận và nguyên giá TSCĐ hữu hình, ba phương pháp khấu hao (đường thẳng, số dư giảm dần, sản lượng) có bảng số, xem xét lại ước tính, mô hình giá gốc và mô hình đánh giá lại, thanh lý và lãi lỗ thanh lý.',
  [[
    `<span class="eyebrow">FAC201 · Part 3 · Lesson 3.1</span>
<h2>Property, plant &amp; equipment and depreciation — IAS 16</h2>
<p class="lead">Property, plant and equipment (PPE) are tangible items held for use in the production or supply of goods or services, for rental to others or for administrative purposes, and expected to be used during more than one period.</p>
<h3>Recognition and initial cost</h3>
<p>An item of PPE is recognised when it is probable that future economic benefits will flow to the entity and its cost can be measured reliably. Cost includes the purchase price (with import duties and non-refundable purchase taxes, less trade discounts), costs directly attributable to bringing the asset to the location and condition necessary for it to operate as intended (site preparation, delivery, installation, testing, professional fees), and the initial estimate of costs of dismantling and restoring the site. It excludes costs of opening a new facility, advertising, staff training and general administration.</p>
<pre><code>Machine (fictional)
List price 200,000 − trade discount 10,000      190,000
+ delivery 4,000 + installation 5,000 + testing 1,000
= Cost                                           200,000
Staff training 2,000 -> expense, not part of cost</code></pre>
<h3>Depreciation</h3>
<p>The <strong>depreciable amount</strong> (cost − residual value) is allocated on a systematic basis over the <strong>useful life</strong>, starting when the asset is available for use. Land is normally not depreciated; each significant component with a different life is depreciated separately. The residual value, useful life and method are reviewed at least at each financial year-end; a change is a change in accounting estimate, applied prospectively. The method should reflect the pattern in which the asset’s benefits are consumed.</p>
<pre><code>Residual value 20,000; useful life 5 years; expected output 90,000 units

Year   Straight-line   Diminishing balance (40%)   Carrying amount (DB)
1         36,000              80,000                    120,000
2         36,000              48,000                     72,000
3         36,000              28,800                     43,200
4         36,000              17,280                     25,920
5         36,000               5,920 *                   20,000
Total    180,000             180,000
* limited so that the carrying amount stops at the residual value

Straight-line: (200,000 − 20,000) / 5 = 36,000 a year
Diminishing balance: double the straight-line rate (2 x 20% = 40%) x opening carrying amount
Units of production: (200,000 − 20,000) / 90,000 = 2.00 per unit;
                     24,000 units in year 1 -> 48,000</code></pre>
<p>In the diminishing-balance method the residual value is not deducted before applying the rate, but depreciation stops once the carrying amount reaches it. All three methods depreciate the same 180,000 in total; they differ only in timing.</p>
<h3>Cost model or revaluation model</h3>
<p>After recognition the entity chooses a model for each <em>class</em> of PPE. <strong>Cost model</strong>: cost − accumulated depreciation − accumulated impairment losses. <strong>Revaluation model</strong>: fair value at the revaluation date − subsequent depreciation and impairment; revaluations must be regular enough that the carrying amount does not differ materially from fair value, and the whole class is revalued. An increase goes to other comprehensive income and accumulates in equity as a <strong>revaluation surplus</strong> (unless it reverses a decrease previously charged to profit or loss); a decrease goes to profit or loss (unless there is a surplus for that asset to absorb it). The surplus may be transferred directly to retained earnings when the asset is derecognised — it is never recycled through profit or loss. Example: land at cost 500,000 revalued to 650,000 — Dr Land 150,000 / Cr Revaluation surplus (OCI) 150,000.</p>
<h3>Derecognition</h3>
<pre><code>The machine is sold at the end of year 3 (straight-line) for 100,000
Carrying amount = 200,000 − 3 x 36,000 = 92,000  ->  gain 8,000
  Dr Cash                       100,000
  Dr Accumulated depreciation   108,000
     Cr Machine                          200,000
     Cr Gain on disposal                   8,000</code></pre>
<p>A gain on disposal is presented in profit or loss but is not revenue.</p>
<div class="callout"><span class="badge">Watch out</span> Depreciation is cost allocation, not valuation: a carrying amount of 92,000 does not mean the machine is worth 92,000. That gap is why impairment testing exists (lesson 3.2).</div>`,
    `<span class="eyebrow">FAC201 · Phần 3 · Bài 3.1</span>
<h2>Tài sản cố định hữu hình &amp; khấu hao — IAS 16</h2>
<p class="lead">Tài sản cố định hữu hình (TSCĐ, IAS 16 gọi là bất động sản, nhà xưởng và thiết bị) là tài sản có hình thái vật chất, được giữ để dùng trong sản xuất hoặc cung cấp hàng hoá, dịch vụ, để cho thuê hoặc cho mục đích quản lý, và dự kiến được sử dụng trong hơn một kỳ.</p>
<h3>Ghi nhận và nguyên giá</h3>
<p>Một TSCĐ được ghi nhận khi có khả năng đơn vị thu được lợi ích kinh tế trong tương lai và nguyên giá xác định được một cách đáng tin cậy. Nguyên giá gồm giá mua (cộng thuế nhập khẩu và thuế mua hàng không được hoàn lại, trừ chiết khấu thương mại), các chi phí liên quan trực tiếp tới việc đưa tài sản tới địa điểm và trạng thái sẵn sàng hoạt động như dự kiến (chuẩn bị mặt bằng, vận chuyển, lắp đặt, chạy thử, phí chuyên gia), và ước tính ban đầu về chi phí tháo dỡ, khôi phục mặt bằng. Không gồm chi phí khai trương cơ sở mới, quảng cáo, đào tạo nhân viên và chi phí quản lý chung.</p>
<pre><code>Máy (giả định)
Giá niêm yết 200.000 − chiết khấu thương mại 10.000   190.000
+ vận chuyển 4.000 + lắp đặt 5.000 + chạy thử 1.000
= Nguyên giá                                            200.000
Đào tạo nhân viên 2.000 -> ghi chi phí, không vào nguyên giá</code></pre>
<h3>Khấu hao</h3>
<p><strong>Giá trị phải khấu hao</strong> (nguyên giá − giá trị thanh lý ước tính) được phân bổ có hệ thống trong <strong>thời gian sử dụng hữu ích</strong>, bắt đầu khi tài sản sẵn sàng sử dụng. Đất thường không khấu hao; mỗi bộ phận quan trọng có thời gian sử dụng khác nhau được khấu hao riêng. Giá trị thanh lý, thời gian sử dụng và phương pháp khấu hao được xem xét lại ít nhất vào cuối mỗi năm tài chính; thay đổi là thay đổi ước tính kế toán, áp dụng phi hồi tố. Phương pháp phải phản ánh cách thức lợi ích của tài sản được tiêu dùng.</p>
<pre><code>Giá trị thanh lý 20.000; thời gian sử dụng 5 năm; sản lượng dự kiến 90.000 đơn vị

Năm   Đường thẳng   Số dư giảm dần (40%)   Giá trị ghi sổ (SDGD)
1        36.000           80.000                120.000
2        36.000           48.000                 72.000
3        36.000           28.800                 43.200
4        36.000           17.280                 25.920
5        36.000            5.920 *               20.000
Tổng    180.000          180.000
* giới hạn để giá trị ghi sổ dừng ở giá trị thanh lý

Đường thẳng: (200.000 − 20.000) / 5 = 36.000 mỗi năm
Số dư giảm dần: gấp đôi tỷ lệ đường thẳng (2 x 20% = 40%) x giá trị ghi sổ đầu năm
Sản lượng: (200.000 − 20.000) / 90.000 = 2,00 mỗi đơn vị;
           năm 1 sản xuất 24.000 đơn vị -> 48.000</code></pre>
<p>Với phương pháp số dư giảm dần, không trừ giá trị thanh lý trước khi áp tỷ lệ, nhưng dừng khấu hao khi giá trị ghi sổ chạm tới giá trị thanh lý. Cả ba phương pháp đều khấu hao tổng cộng 180.000; chúng chỉ khác nhau về thời điểm.</p>
<h3>Mô hình giá gốc hay mô hình đánh giá lại</h3>
<p>Sau ghi nhận ban đầu, đơn vị chọn mô hình cho từng <em>nhóm</em> TSCĐ. <strong>Mô hình giá gốc</strong>: nguyên giá − hao mòn luỹ kế − tổn thất suy giảm giá trị luỹ kế. <strong>Mô hình đánh giá lại</strong>: giá trị hợp lý tại ngày đánh giá lại − khấu hao và suy giảm giá trị sau đó; phải đánh giá lại đủ thường xuyên để giá trị ghi sổ không khác trọng yếu so với giá trị hợp lý, và đánh giá lại cả nhóm. Phần tăng ghi vào thu nhập toàn diện khác và tích luỹ trong vốn chủ sở hữu dưới dạng <strong>thặng dư đánh giá lại</strong> (trừ khi nó bù lại một khoản giảm trước đây đã ghi vào lãi lỗ); phần giảm ghi vào lãi lỗ (trừ khi còn thặng dư của chính tài sản đó để bù trừ). Thặng dư có thể chuyển thẳng sang lợi nhuận giữ lại khi tài sản bị dừng ghi nhận — không bao giờ chuyển qua lãi lỗ. Ví dụ: đất giá gốc 500.000 được đánh giá lại lên 650.000 — Nợ Đất 150.000 / Có Thặng dư đánh giá lại (OCI) 150.000.</p>
<h3>Dừng ghi nhận</h3>
<pre><code>Máy được bán vào cuối năm 3 (khấu hao đường thẳng) với giá 100.000
Giá trị ghi sổ = 200.000 − 3 x 36.000 = 92.000  ->  lãi 8.000
  Nợ Tiền                       100.000
  Nợ Hao mòn luỹ kế             108.000
     Có Máy móc                          200.000
     Có Lãi thanh lý TSCĐ                  8.000</code></pre>
<p>Lãi thanh lý được trình bày trong lãi lỗ nhưng không phải là doanh thu.</p>
<div class="callout"><span class="badge">Cẩn thận</span> Khấu hao là phân bổ chi phí, không phải định giá: giá trị ghi sổ 92.000 không có nghĩa chiếc máy đáng giá 92.000. Chính khoảng cách đó là lý do phải kiểm tra suy giảm giá trị (bài 3.2).</div>`,
  ]]);

const c7 = doc('fac201-3-2-impairment', '3.2 — Impairment of assets (IAS 36)|||3.2 — Suy giảm giá trị tài sản (IAS 36)',
  'Khi nào phải kiểm tra suy giảm giá trị, dấu hiệu bên ngoài và bên trong, giá trị có thể thu hồi = giá trị lớn hơn giữa giá trị hợp lý trừ chi phí thanh lý và giá trị sử dụng, ví dụ số, khấu hao sau suy giảm, đơn vị tạo tiền và hoàn nhập.',
  [[
    `<span class="eyebrow">FAC201 · Part 3 · Lesson 3.2</span>
<h2>Impairment of assets — IAS 36</h2>
<p class="lead">An asset must not be carried at more than the amount it can recover, whether by using it or by selling it. IAS 36 says when to test, how to measure the recoverable amount and how to record the loss.</p>
<h3>When to test</h3>
<p>At the end of each reporting period the entity assesses whether there is any <strong>indication</strong> that an asset may be impaired; if there is, it estimates the recoverable amount. Goodwill, intangible assets with an indefinite useful life and intangible assets not yet available for use are tested <strong>at least annually</strong>, whether or not there is an indication.</p>
<table>
<tr><th>External indications</th><th>Internal indications</th></tr>
<tr><td>A significant fall in the asset’s market value; adverse changes in the technological, market, economic or legal environment; higher market interest rates that raise the discount rate; the carrying amount of net assets exceeds the entity’s market capitalisation</td><td>Evidence of obsolescence or physical damage; plans to discontinue or restructure the operation, or to dispose of the asset early; internal reports showing the asset’s economic performance is, or will be, worse than expected</td></tr>
</table>
<h3>Recoverable amount</h3>
<pre><code>Recoverable amount = the HIGHER of
   Fair value less costs of disposal  (what a buyer would pay, minus disposal costs)
   Value in use                        (present value of the future cash flows from
                                        continuing use and final disposal)
Impairment loss = Carrying amount − Recoverable amount   (only if positive)</code></pre>
<p>Why the higher of the two? A rational owner would either keep using the asset or sell it — whichever yields more — so the asset is impaired only if <em>both</em> routes recover less than its carrying amount. Value in use uses cash flows for the asset in its current condition (excluding future restructurings or improvements, financing and tax) and a pre-tax discount rate reflecting the time value of money and the risks specific to the asset.</p>
<h3>Worked example — the machine from lesson 3.1 (fictional)</h3>
<pre><code>End of year 3: carrying amount 92,000 (straight-line)
Indication: a competitor launches a much faster machine
Fair value 70,000 − costs of disposal 3,000 = 67,000
Value in use: cash flows 38,500 (year 4) and 36,300 (year 5, incl. disposal), rate 10%
   38,500 / 1.10 + 36,300 / 1.10^2 = 35,000 + 30,000 = 65,000
Recoverable amount = max(67,000; 65,000) = 67,000
Impairment loss    = 92,000 − 67,000   = 25,000
   Dr Impairment loss (profit or loss) 25,000 / Cr Accumulated impairment losses 25,000
New depreciation: (67,000 − 20,000) / 2 remaining years = 23,500 a year</code></pre>
<h3>Cash-generating units and reversals</h3>
<ul>
<li>If an asset does not generate cash inflows that are largely independent of other assets, it is tested as part of the smallest identifiable group that does — a <strong>cash-generating unit</strong> (CGU), such as a factory or a store. Goodwill is allocated to CGUs for testing.</li>
<li>For an asset under the revaluation model, an impairment loss is treated as a revaluation decrease (first against its revaluation surplus).</li>
<li>If the estimates used later improve, an impairment loss on an asset other than goodwill is <strong>reversed</strong>, but the carrying amount may not exceed what it would have been, net of depreciation, had no impairment been recognised. An impairment loss on <strong>goodwill is never reversed</strong>.</li>
</ul>
<div class="callout"><span class="badge">Key lesson</span> Depreciation sets the slope at which the carrying amount falls; the recoverable amount sets the ceiling it may never exceed.</div>`,
    `<span class="eyebrow">FAC201 · Phần 3 · Bài 3.2</span>
<h2>Suy giảm giá trị tài sản — IAS 36</h2>
<p class="lead">Một tài sản không được ghi sổ cao hơn số tiền có thể thu hồi từ nó, dù bằng cách sử dụng hay bán. IAS 36 quy định khi nào phải kiểm tra, cách đo lường giá trị có thể thu hồi và cách ghi nhận tổn thất.</p>
<h3>Khi nào phải kiểm tra</h3>
<p>Vào cuối mỗi kỳ báo cáo, đơn vị đánh giá xem có <strong>dấu hiệu</strong> nào cho thấy tài sản có thể bị suy giảm giá trị không; nếu có, đơn vị ước tính giá trị có thể thu hồi. Lợi thế thương mại, tài sản vô hình có thời gian sử dụng không xác định và tài sản vô hình chưa sẵn sàng sử dụng phải được kiểm tra <strong>ít nhất mỗi năm một lần</strong>, dù có dấu hiệu hay không.</p>
<table>
<tr><th>Dấu hiệu bên ngoài</th><th>Dấu hiệu bên trong</th></tr>
<tr><td>Giá trị thị trường của tài sản giảm đáng kể; thay đổi bất lợi về công nghệ, thị trường, kinh tế hoặc pháp lý; lãi suất thị trường tăng làm tăng lãi suất chiết khấu; giá trị ghi sổ của tài sản thuần lớn hơn giá trị vốn hoá thị trường của đơn vị</td><td>Bằng chứng tài sản lỗi thời hoặc hư hỏng vật chất; kế hoạch ngừng hoặc tái cấu trúc hoạt động, hoặc thanh lý tài sản sớm; báo cáo nội bộ cho thấy hiệu quả kinh tế của tài sản đang hoặc sẽ kém hơn dự kiến</td></tr>
</table>
<h3>Giá trị có thể thu hồi</h3>
<pre><code>Giá trị có thể thu hồi = giá trị LỚN HƠN giữa
   Giá trị hợp lý trừ chi phí thanh lý  (người mua sẵn sàng trả, trừ chi phí thanh lý)
   Giá trị sử dụng                       (giá trị hiện tại của dòng tiền tương lai từ
                                          việc tiếp tục sử dụng và thanh lý cuối cùng)
Tổn thất suy giảm giá trị = Giá trị ghi sổ − Giá trị có thể thu hồi   (chỉ khi dương)</code></pre>
<p>Vì sao lấy giá trị lớn hơn? Một chủ sở hữu hợp lý sẽ hoặc tiếp tục dùng tài sản, hoặc bán nó — cách nào thu được nhiều hơn — nên tài sản chỉ bị suy giảm giá trị khi <em>cả hai</em> cách đều thu về ít hơn giá trị ghi sổ. Giá trị sử dụng dùng dòng tiền của tài sản ở trạng thái hiện tại (không tính tái cấu trúc hay nâng cấp trong tương lai, không tính dòng tiền tài chính và thuế) và lãi suất chiết khấu trước thuế phản ánh giá trị thời gian của tiền và rủi ro riêng của tài sản.</p>
<h3>Ví dụ — chiếc máy ở bài 3.1 (giả định)</h3>
<pre><code>Cuối năm 3: giá trị ghi sổ 92.000 (khấu hao đường thẳng)
Dấu hiệu: đối thủ tung ra loại máy nhanh hơn nhiều
Giá trị hợp lý 70.000 − chi phí thanh lý 3.000 = 67.000
Giá trị sử dụng: dòng tiền 38.500 (năm 4) và 36.300 (năm 5, gồm thanh lý), lãi suất 10%
   38.500 / 1,10 + 36.300 / 1,10^2 = 35.000 + 30.000 = 65.000
Giá trị có thể thu hồi = max(67.000; 65.000) = 67.000
Tổn thất suy giảm giá trị = 92.000 − 67.000 = 25.000
   Nợ Tổn thất suy giảm giá trị (lãi lỗ) 25.000 / Có Suy giảm giá trị luỹ kế 25.000
Khấu hao mới: (67.000 − 20.000) / 2 năm còn lại = 23.500 mỗi năm</code></pre>
<h3>Đơn vị tạo tiền và hoàn nhập</h3>
<ul>
<li>Nếu một tài sản không tạo ra dòng tiền vào độc lập phần lớn với tài sản khác, nó được kiểm tra trong nhóm nhỏ nhất xác định được có tạo ra dòng tiền độc lập — <strong>đơn vị tạo tiền</strong> (CGU), như một nhà máy hay một cửa hàng. Lợi thế thương mại được phân bổ cho các CGU để kiểm tra.</li>
<li>Với tài sản theo mô hình đánh giá lại, tổn thất suy giảm được xử lý như một khoản giảm do đánh giá lại (trước hết trừ vào thặng dư đánh giá lại của tài sản đó).</li>
<li>Nếu các ước tính sau đó được cải thiện, tổn thất của tài sản không phải lợi thế thương mại được <strong>hoàn nhập</strong>, nhưng giá trị ghi sổ không được vượt quá giá trị lẽ ra có (sau khấu hao) nếu chưa từng ghi nhận suy giảm. Tổn thất của <strong>lợi thế thương mại không bao giờ được hoàn nhập</strong>.</li>
</ul>
<div class="callout"><span class="badge">Bài học chính</span> Khấu hao đặt độ dốc mà giá trị ghi sổ giảm xuống; giá trị có thể thu hồi đặt mức trần mà giá trị ghi sổ không được vượt qua.</div>`,
  ]]);

const c7q = quiz('fac201-quiz-3', 'Quiz 3 — PPE & impairment|||Quiz 3 — TSCĐ & suy giảm giá trị', [
  { id: 'q1', question: 'Which cost is NOT included in the cost of a new machine under IAS 16?|||Chi phí nào KHÔNG được tính vào nguyên giá máy mới theo IAS 16?', options: ['Training staff to operate the machine|||Đào tạo nhân viên vận hành máy', 'Delivery and installation|||Vận chuyển và lắp đặt', 'Testing whether the machine functions properly|||Chạy thử để kiểm tra máy hoạt động đúng', 'Non-refundable import duties|||Thuế nhập khẩu không được hoàn lại'], correctIndex: 0, explanation: 'Training does not bring the asset to the location and condition needed to operate; it is an expense. The other three are directly attributable costs.|||Đào tạo không đưa tài sản tới địa điểm và trạng thái sẵn sàng hoạt động; đó là chi phí trong kỳ. Ba khoản còn lại là chi phí liên quan trực tiếp.' },
  { id: 'q2', question: 'An asset has a carrying amount of 500, fair value less costs of disposal of 420 and value in use of 450. What is the impairment loss?|||Một tài sản có giá trị ghi sổ 500, giá trị hợp lý trừ chi phí thanh lý 420 và giá trị sử dụng 450. Tổn thất suy giảm giá trị là bao nhiêu?', options: ['80|||80', '0|||0', '50|||50', '30|||30'], correctIndex: 2, explanation: 'Recoverable amount is the higher of 420 and 450, i.e. 450; loss = 500 − 450 = 50.|||Giá trị có thể thu hồi là giá trị lớn hơn giữa 420 và 450, tức 450; tổn thất = 500 − 450 = 50.' },
  { id: 'q3', question: 'A machine costs 100,000, with a residual value of 10,000 and a useful life of 5 years. Using the double-declining-balance method (40%), what is depreciation in year 2?|||Máy có nguyên giá 100.000, giá trị thanh lý ước tính 10.000, thời gian sử dụng 5 năm. Theo phương pháp số dư giảm dần kép (40%), khấu hao năm 2 là bao nhiêu?', options: ['18,000|||18.000', '24,000|||24.000', '36,000|||36.000', '21,600|||21.600'], correctIndex: 1, explanation: 'Year 1: 100,000 x 40% = 40,000; year 2: (100,000 − 40,000) x 40% = 24,000. The residual value is not deducted before applying the rate.|||Năm 1: 100.000 x 40% = 40.000; năm 2: (100.000 − 40.000) x 40% = 24.000. Không trừ giá trị thanh lý trước khi áp tỷ lệ.' },
]);

const c8 = doc('fac201-4-1-liabilities-provisions', '4.1 — Current liabilities, provisions & contingencies (IAS 37)|||4.1 — Nợ ngắn hạn, dự phòng phải trả & nợ tiềm tàng (IAS 37)',
  'Phân loại nợ ngắn hạn và dài hạn theo IAS 1, các khoản nợ ngắn hạn điển hình, thuế GTGT thu hộ, ba điều kiện ghi nhận dự phòng phải trả, ước tính tốt nhất (ví dụ bảo hành theo giá trị kỳ vọng), bảng phân biệt dự phòng – nợ tiềm tàng – tài sản tiềm tàng, hợp đồng bất lợi và tái cấu trúc.',
  [[
    `<span class="eyebrow">FAC201 · Part 4 · Lesson 4.1</span>
<h2>Current liabilities, provisions &amp; contingencies</h2>
<p class="lead">A liability is a present obligation to transfer an economic resource as a result of past events. Some are certain in amount and date (a supplier’s invoice), some must be estimated (a warranty), and some are only possible (a lawsuit the entity may win).</p>
<h3>Current or non-current?</h3>
<p>IAS 1 classifies a liability as <strong>current</strong> when it is expected to be settled in the normal operating cycle, is held primarily for trading, is due within twelve months after the reporting period, or the entity does not have a right at the end of the reporting period to defer settlement for at least twelve months. The right to defer must exist at the reporting date; management’s intention to pay early does not change the classification. The portion of long-term debt due within twelve months is current.</p>
<ul>
<li>Trade payables and short-term borrowings; the current portion of long-term debt.</li>
<li>Accrued expenses (salaries, interest — lesson 1.2) and contract liabilities (lesson 2.1).</li>
<li>Taxes payable and amounts withheld from employees’ pay; dividends payable once declared (lesson 5.1).</li>
</ul>
<pre><code>Sales tax collected for the state is a liability, not revenue:
Sale 100,000 + VAT at an assumed 10% = 110,000
  Dr Cash 110,000 / Cr Revenue 100,000 / Cr VAT payable 10,000</code></pre>
<h3>Provisions — IAS 37</h3>
<p>A <strong>provision</strong> is a liability of uncertain timing or amount. It is recognised only when all three conditions hold: (1) the entity has a <strong>present obligation</strong> — legal or <em>constructive</em> (created by the entity’s established practice or published policy) — as a result of a past event; (2) an outflow of resources is <strong>probable</strong>, meaning more likely than not; (3) a <strong>reliable estimate</strong> can be made. It is measured at the <strong>best estimate</strong> of the amount needed to settle the obligation: an expected value for a large population of items, the most likely outcome (considering the other outcomes) for a single obligation, discounted when the time value of money is material, and reviewed at each reporting date.</p>
<pre><code>Warranty (fictional): 10,000 units sold with a one-year assurance warranty
Experience: 94% no defect; 5% minor defects (cost 200 each); 1% major defects (cost 1,000 each)
Expected cost = 10,000 x (5% x 200 + 1% x 1,000) = 10,000 x (10 + 10) = 200,000
  Dr Warranty expense 200,000 / Cr Warranty provision 200,000</code></pre>
<h3>Provision, contingent liability — or nothing?</h3>
<table>
<tr><th>Outflow of resources</th><th>Reliable estimate?</th><th>Treatment</th></tr>
<tr><td>Probable (more likely than not)</td><td>Yes</td><td>Recognise a provision</td></tr>
<tr><td>Probable</td><td>No (extremely rare)</td><td>Disclose a contingent liability</td></tr>
<tr><td>Possible but not probable</td><td>—</td><td>Disclose a contingent liability</td></tr>
<tr><td>Remote</td><td>—</td><td>Neither recognise nor disclose</td></tr>
</table>
<p>A <strong>contingent asset</strong> (for example, a lawsuit the entity expects to win) is never recognised; it is disclosed when an inflow is probable, and becomes a recognised asset only when its realisation is virtually certain.</p>
<ul>
<li>No provision is made for <strong>future operating losses</strong> — there is no present obligation.</li>
<li>An <strong>onerous contract</strong>, where the unavoidable costs of meeting the obligations exceed the expected benefits, requires a provision.</li>
<li>A <strong>restructuring</strong> provision needs a constructive obligation: a detailed formal plan <em>and</em> a valid expectation raised in those affected, by starting to implement the plan or announcing its main features to them.</li>
</ul>
<div class="callout"><span class="badge">Remember</span> In IAS 37, "probable" means more likely than not — above 50% — a lower bar than the everyday word suggests. It is generally read as lower than "probable" (likely to occur) under US GAAP, which practice often puts at roughly 70–75%; US GAAP itself gives no number.</div>`,
    `<span class="eyebrow">FAC201 · Phần 4 · Bài 4.1</span>
<h2>Nợ ngắn hạn, dự phòng phải trả &amp; nợ tiềm tàng</h2>
<p class="lead">Nợ phải trả là nghĩa vụ hiện tại phải chuyển giao một nguồn lực kinh tế, là kết quả của sự kiện trong quá khứ. Có khoản chắc chắn về số tiền và thời điểm (hoá đơn của nhà cung cấp), có khoản phải ước tính (bảo hành), và có khoản chỉ là có thể xảy ra (một vụ kiện đơn vị có thể thắng).</p>
<h3>Ngắn hạn hay dài hạn?</h3>
<p>IAS 1 phân loại một khoản nợ là <strong>ngắn hạn</strong> khi nó dự kiến được thanh toán trong chu kỳ kinh doanh bình thường, được nắm giữ chủ yếu cho mục đích kinh doanh, đến hạn trong vòng mười hai tháng sau kỳ báo cáo, hoặc đơn vị không có quyền, tại cuối kỳ báo cáo, hoãn thanh toán ít nhất mười hai tháng. Quyền hoãn thanh toán phải tồn tại tại ngày báo cáo; ý định trả sớm của ban điều hành không làm thay đổi phân loại. Phần nợ dài hạn đến hạn trả trong mười hai tháng là nợ ngắn hạn.</p>
<ul>
<li>Phải trả người bán và vay ngắn hạn; nợ dài hạn đến hạn trả.</li>
<li>Chi phí phải trả (lương, lãi vay — bài 1.2) và nợ phải trả theo hợp đồng (bài 2.1).</li>
<li>Thuế phải nộp và các khoản khấu trừ từ lương người lao động; cổ tức phải trả sau khi đã công bố (bài 5.1).</li>
</ul>
<pre><code>Thuế thu hộ nhà nước là nợ phải trả, không phải doanh thu:
Bán hàng 100.000 + thuế GTGT theo thuế suất giả định 10% = 110.000
  Nợ Tiền 110.000 / Có Doanh thu 100.000 / Có Thuế GTGT phải nộp 10.000</code></pre>
<h3>Dự phòng phải trả — IAS 37</h3>
<p><strong>Dự phòng phải trả</strong> là khoản nợ không chắc chắn về thời điểm hoặc số tiền. Chỉ được ghi nhận khi thoả cả ba điều kiện: (1) đơn vị có <strong>nghĩa vụ hiện tại</strong> — pháp lý hoặc <em>ngầm định</em> (hình thành từ thông lệ hoặc chính sách đã công bố của đơn vị) — do một sự kiện trong quá khứ; (2) <strong>có khả năng</strong> phải chi ra nguồn lực, nghĩa là khả năng xảy ra cao hơn không xảy ra; (3) ước tính được <strong>một cách đáng tin cậy</strong>. Dự phòng được đo lường theo <strong>ước tính tốt nhất</strong> số tiền cần để thanh toán nghĩa vụ: giá trị kỳ vọng với một tập hợp lớn các khoản mục, kết quả có khả năng nhất (có cân nhắc các kết quả khác) với một nghĩa vụ đơn lẻ, được chiết khấu khi giá trị thời gian của tiền là trọng yếu, và được xem xét lại vào mỗi ngày báo cáo.</p>
<pre><code>Bảo hành (giả định): bán 10.000 sản phẩm kèm bảo hành đảm bảo một năm
Kinh nghiệm: 94% không lỗi; 5% lỗi nhỏ (chi phí 200 mỗi chiếc); 1% lỗi lớn (chi phí 1.000 mỗi chiếc)
Chi phí kỳ vọng = 10.000 x (5% x 200 + 1% x 1.000) = 10.000 x (10 + 10) = 200.000
  Nợ Chi phí bảo hành 200.000 / Có Dự phòng bảo hành 200.000</code></pre>
<h3>Dự phòng, nợ tiềm tàng — hay không làm gì?</h3>
<table>
<tr><th>Khả năng chi ra nguồn lực</th><th>Ước tính đáng tin cậy?</th><th>Xử lý</th></tr>
<tr><td>Có khả năng (cao hơn không xảy ra)</td><td>Có</td><td>Ghi nhận dự phòng phải trả</td></tr>
<tr><td>Có khả năng</td><td>Không (cực kỳ hiếm)</td><td>Thuyết minh nợ tiềm tàng</td></tr>
<tr><td>Có thể xảy ra nhưng không tới mức có khả năng</td><td>—</td><td>Thuyết minh nợ tiềm tàng</td></tr>
<tr><td>Rất ít khả năng</td><td>—</td><td>Không ghi nhận, không thuyết minh</td></tr>
</table>
<p><strong>Tài sản tiềm tàng</strong> (ví dụ một vụ kiện đơn vị dự kiến thắng) không bao giờ được ghi nhận; nó được thuyết minh khi có khả năng thu được lợi ích, và chỉ trở thành tài sản được ghi nhận khi việc thu được gần như chắc chắn.</p>
<ul>
<li>Không lập dự phòng cho <strong>các khoản lỗ hoạt động trong tương lai</strong> — không có nghĩa vụ hiện tại.</li>
<li><strong>Hợp đồng có rủi ro lớn (bất lợi)</strong>, khi chi phí không thể tránh để thực hiện nghĩa vụ vượt quá lợi ích dự kiến, phải lập dự phòng.</li>
<li>Dự phòng <strong>tái cấu trúc</strong> cần có nghĩa vụ ngầm định: một kế hoạch chính thức chi tiết <em>và</em> đã tạo ra kỳ vọng hợp lý ở những người bị ảnh hưởng, bằng việc bắt đầu thực hiện kế hoạch hoặc công bố các nội dung chính cho họ.</li>
</ul>
<div class="callout"><span class="badge">Ghi nhớ</span> Trong IAS 37, "có khả năng" (probable) nghĩa là khả năng xảy ra cao hơn không xảy ra — trên 50% — một ngưỡng thấp hơn nghĩa thông thường của từ này. Ngưỡng này thường được hiểu là thấp hơn "probable" (có khả năng xảy ra) của US GAAP, mà thực hành hay đặt vào khoảng 70–75%; bản thân US GAAP không nêu con số nào.</div>`,
  ]]);

const c9 = doc('fac201-4-2-bonds', '4.2 — Bonds payable & the effective interest method|||4.2 — Trái phiếu phải trả & phương pháp lãi suất thực tế',
  'Định giá trái phiếu khi phát hành bằng giá trị hiện tại, phát hành ngang giá, chiết khấu, phụ trội; phương pháp lãi suất thực tế theo IFRS 9; ví dụ trái phiếu phát hành phụ trội có bảng phân bổ 3 kỳ và bút toán; chi phí giao dịch và mua lại trước hạn.',
  [[
    `<span class="eyebrow">FAC201 · Part 4 · Lesson 4.2</span>
<h2>Bonds payable &amp; the effective interest method</h2>
<p class="lead">A bond is a long-term borrowing divided into many units sold to investors. The issuer promises periodic interest at the <strong>coupon (stated) rate</strong> and repayment of the <strong>face value</strong> at maturity. The price investors pay depends on how the coupon rate compares with the <strong>market rate</strong> for similar bonds on the issue date.</p>
<h3>Pricing at issue</h3>
<pre><code>Issue price = PV of the face value + PV of the coupons, both at the MARKET rate
Coupon rate = market rate  ->  issued at par (face value)
Coupon rate &lt; market rate  ->  issued at a DISCOUNT (below face value)
Coupon rate &gt; market rate  ->  issued at a PREMIUM (above face value)</code></pre>
<h3>The effective interest method</h3>
<p>Bonds payable are financial liabilities measured at <strong>amortised cost</strong> under IFRS 9, using the effective interest method:</p>
<pre><code>Interest expense = opening carrying amount x effective (market) rate
Cash paid        = face value x coupon rate
Amortisation     = the difference; it moves the carrying amount to face value by maturity</code></pre>
<p>Transaction costs of issuing the bonds are deducted from the initial carrying amount, which raises the effective rate slightly above the market rate. IFRS-based textbooks usually record the bond at its net amount; some texts use a separate discount or premium account — the net carrying amount is identical. Straight-line amortisation of a discount or premium is not permitted under IFRS.</p>
<h3>Worked example — a premium bond (fictional)</h3>
<pre><code>Face 100,000; coupon 10% paid annually; 3 years; market rate 8%
PV of coupons = 10,000 x 2.5770970  =  25,770.97
PV of face    = 100,000 x 0.7938322 =  79,383.22
Issue price                          = 105,154.19   (premium 5,154.19)

Year  Opening CA   Interest 8%   Cash 10%   Amortisation   Closing CA
1     105,154.19    8,412.34     10,000.00    (1,587.66)    103,566.53
2     103,566.53    8,285.32     10,000.00    (1,714.68)    101,851.85
3     101,851.85    8,148.15     10,000.00    (1,851.85)    100,000.00
Total              24,845.81     30,000.00    (5,154.19)

Issue:     Dr Cash 105,154.19 / Cr Bonds payable 105,154.19
Year 1:    Dr Interest expense 8,412.34 / Dr Bonds payable 1,587.66 / Cr Cash 10,000.00
Maturity:  Dr Bonds payable 100,000.00 / Cr Cash 100,000.00</code></pre>
<p>Total interest expense (24,845.81) equals the cash coupons (30,000) minus the premium (5,154.19): investors paid extra up front because the coupon beat the market rate, and that extra reduces the true cost of borrowing. The rate on the carrying amount stays at 8% every year (exactly, before rounding to cents).</p>
<h3>Retiring bonds before maturity</h3>
<p>If the issuer buys its bonds back early, the difference between the carrying amount at that date and the price paid is a gain or loss in profit or loss.</p>
<div class="callout"><span class="badge">Intuition</span> A bond issued at a discount is cheap money only in appearance: the discount is extra interest, recognised a little each year as the carrying amount climbs to face value.</div>`,
    `<span class="eyebrow">FAC201 · Phần 4 · Bài 4.2</span>
<h2>Trái phiếu phải trả &amp; phương pháp lãi suất thực tế</h2>
<p class="lead">Trái phiếu là khoản vay dài hạn được chia thành nhiều đơn vị bán cho nhà đầu tư. Tổ chức phát hành cam kết trả lãi định kỳ theo <strong>lãi suất danh nghĩa (lãi suất coupon)</strong> và hoàn trả <strong>mệnh giá</strong> khi đáo hạn. Giá nhà đầu tư trả phụ thuộc vào việc so sánh lãi suất danh nghĩa với <strong>lãi suất thị trường</strong> của trái phiếu tương tự tại ngày phát hành.</p>
<h3>Định giá khi phát hành</h3>
<pre><code>Giá phát hành = PV của mệnh giá + PV của các khoản lãi coupon, đều theo lãi suất THỊ TRƯỜNG
Lãi suất danh nghĩa = lãi suất thị trường  ->  phát hành ngang giá (bằng mệnh giá)
Lãi suất danh nghĩa &lt; lãi suất thị trường  ->  phát hành CHIẾT KHẤU (dưới mệnh giá)
Lãi suất danh nghĩa &gt; lãi suất thị trường  ->  phát hành PHỤ TRỘI (trên mệnh giá)</code></pre>
<h3>Phương pháp lãi suất thực tế</h3>
<p>Trái phiếu phải trả là nợ phải trả tài chính đo lường theo <strong>giá trị phân bổ</strong> theo IFRS 9, dùng phương pháp lãi suất thực tế:</p>
<pre><code>Chi phí lãi vay = giá trị ghi sổ đầu kỳ x lãi suất thực tế (thị trường)
Tiền trả        = mệnh giá x lãi suất danh nghĩa
Phân bổ         = chênh lệch; nó đưa giá trị ghi sổ về mệnh giá khi đáo hạn</code></pre>
<p>Chi phí giao dịch phát hành trái phiếu được trừ vào giá trị ghi sổ ban đầu, làm lãi suất thực tế cao hơn lãi suất thị trường một chút. Giáo trình theo IFRS thường ghi trái phiếu theo giá trị thuần; một số giáo trình dùng tài khoản chiết khấu hoặc phụ trội riêng — giá trị ghi sổ thuần vẫn như nhau. IFRS không cho phép phân bổ chiết khấu hay phụ trội theo đường thẳng.</p>
<h3>Ví dụ — trái phiếu phát hành phụ trội (giả định)</h3>
<pre><code>Mệnh giá 100.000; lãi suất danh nghĩa 10% trả hằng năm; 3 năm; lãi suất thị trường 8%
PV của lãi coupon = 10.000 x 2,5770970  =  25.770,97
PV của mệnh giá   = 100.000 x 0,7938322 =  79.383,22
Giá phát hành                             = 105.154,19   (phụ trội 5.154,19)

Năm  GTGS đầu kỳ   Lãi vay 8%   Tiền trả 10%   Phân bổ       GTGS cuối kỳ
1    105.154,19     8.412,34     10.000,00     (1.587,66)    103.566,53
2    103.566,53     8.285,32     10.000,00     (1.714,68)    101.851,85
3    101.851,85     8.148,15     10.000,00     (1.851,85)    100.000,00
Tổng               24.845,81     30.000,00     (5.154,19)

Phát hành:  Nợ Tiền 105.154,19 / Có Trái phiếu phải trả 105.154,19
Năm 1:      Nợ Chi phí lãi vay 8.412,34 / Nợ Trái phiếu phải trả 1.587,66 / Có Tiền 10.000,00
Đáo hạn:    Nợ Trái phiếu phải trả 100.000,00 / Có Tiền 100.000,00</code></pre>
<p>Tổng chi phí lãi vay (24.845,81) bằng tổng tiền lãi coupon (30.000) trừ phụ trội (5.154,19): nhà đầu tư trả thêm ngay từ đầu vì lãi coupon cao hơn lãi suất thị trường, và phần trả thêm đó làm giảm chi phí vay thực sự. Lãi suất tính trên giá trị ghi sổ luôn là 8% mỗi năm (đúng tuyệt đối trước khi làm tròn tới xu).</p>
<h3>Mua lại trái phiếu trước hạn</h3>
<p>Nếu tổ chức phát hành mua lại trái phiếu trước hạn, chênh lệch giữa giá trị ghi sổ tại ngày đó và giá phải trả là lãi hoặc lỗ ghi vào lãi lỗ.</p>
<div class="callout"><span class="badge">Trực giác</span> Trái phiếu phát hành chiết khấu chỉ trông như vốn rẻ: phần chiết khấu là tiền lãi bổ sung, được ghi nhận dần mỗi năm khi giá trị ghi sổ tăng dần về mệnh giá.</div>`,
  ]]);

const c9e = doc('fac201-4-3-exercise', 'Exercise 2 — a bond issued at a discount|||Bài tập 2 — trái phiếu phát hành chiết khấu',
  'Bài tập: tính giá phát hành trái phiếu mệnh giá 1.000.000, lãi 6%, lãi suất thị trường 8%, kỳ hạn 4 năm bằng giá trị hiện tại; lập bảng phân bổ chiết khấu theo lãi suất thực tế 4 kỳ, bút toán, tổng chi phí lãi vay và phân loại ngắn hạn; kèm lời giải.',
  [[
    `<span class="eyebrow">FAC201 · Part 4 · Exercise</span>
<h2>Exercise 2 — a bond issued at a discount</h2>
<div class="callout"><span class="badge">Problem</span> On 1 January 20X1, Delta Co. (a fictional company) issues bonds with a face value of $1,000,000, a 6% coupon paid annually on 31 December, maturing on 31 December 20X4. The market rate for similar bonds is 8%. Ignore transaction costs. (a) Compute the issue price. (b) Prepare the effective-interest amortisation schedule. (c) Record the entries at issue, on 31 December 20X1 and at maturity. (d) What is the total interest cost over the bond’s life? (e) How is the bond classified at 31 December 20X3? (Illustrative figures.)</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) PV of face    = 1,000,000 / 1.08^4 = 1,000,000 x 0.73502985 = 735,029.85
    PV of coupons = 60,000 x [1 − 1.08^−4] / 0.08 = 60,000 x 3.31212684 = 198,727.61
    Issue price   = 933,757.46      ->  discount = 1,000,000 − 933,757.46 = 66,242.54

(b) Year  Opening CA    Interest 8%   Cash 6%     Amortisation   Closing CA
    20X1   933,757.46    74,700.60    60,000.00    14,700.60     948,458.06
    20X2   948,458.06    75,876.64    60,000.00    15,876.64     964,334.70
    20X3   964,334.70    77,146.78    60,000.00    17,146.78     981,481.48
    20X4   981,481.48    78,518.52    60,000.00    18,518.52   1,000,000.00
    Total               306,242.54   240,000.00    66,242.54
    Check: total amortisation 66,242.54 = discount 66,242.54 ✓ (no rounding plug needed)

(c) 1 Jan 20X1   Dr Cash                933,757.46
                    Cr Bonds payable                  933,757.46
    31 Dec 20X1  Dr Interest expense     74,700.60
                    Cr Cash                            60,000.00
                    Cr Bonds payable                   14,700.60
    31 Dec 20X4  (after the last interest entry)
                 Dr Bonds payable     1,000,000.00
                    Cr Cash                         1,000,000.00

(d) Total interest cost = cash coupons 240,000.00 + discount 66,242.54 = 306,242.54
    = the sum of the interest column ✓

(e) At 31 Dec 20X3 the bonds (carrying amount 981,481.48) are due within
    twelve months -> current liability. At 31 Dec 20X1 and 20X2: non-current.</code></pre>
<p><strong>Why:</strong> investors accepted a 6% coupon only because they paid less than face value; the 66,242.54 discount is additional interest earned over four years. Because interest expense is 8% of a rising carrying amount, it grows every year. Straight-line amortisation would give 16,560.64 each year — a constant amount but a changing rate — and is not allowed under IFRS. In practice schedules rounded to cents sometimes need a final-year plug of a few cents; always check that the last closing balance equals face value exactly.</p>`,
    `<span class="eyebrow">FAC201 · Phần 4 · Bài tập</span>
<h2>Bài tập 2 — trái phiếu phát hành chiết khấu</h2>
<div class="callout"><span class="badge">Đề</span> Ngày 1/1/20X1, Công ty Delta (doanh nghiệp giả định) phát hành trái phiếu mệnh giá 1.000.000 $, lãi suất danh nghĩa 6% trả hằng năm vào ngày 31/12, đáo hạn ngày 31/12/20X4. Lãi suất thị trường của trái phiếu tương tự là 8%. Bỏ qua chi phí giao dịch. (a) Tính giá phát hành. (b) Lập bảng phân bổ theo lãi suất thực tế. (c) Ghi bút toán khi phát hành, ngày 31/12/20X1 và khi đáo hạn. (d) Tổng chi phí lãi vay trong suốt kỳ hạn là bao nhiêu? (e) Trái phiếu được phân loại thế nào tại 31/12/20X3? (Số liệu minh hoạ.)</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) PV mệnh giá    = 1.000.000 / 1,08^4 = 1.000.000 x 0,73502985 = 735.029,85
    PV lãi coupon  = 60.000 x [1 − 1,08^−4] / 0,08 = 60.000 x 3,31212684 = 198.727,61
    Giá phát hành  = 933.757,46      ->  chiết khấu = 1.000.000 − 933.757,46 = 66.242,54

(b) Năm   GTGS đầu kỳ   Lãi vay 8%    Tiền trả 6%   Phân bổ       GTGS cuối kỳ
    20X1   933.757,46    74.700,60    60.000,00     14.700,60     948.458,06
    20X2   948.458,06    75.876,64    60.000,00     15.876,64     964.334,70
    20X3   964.334,70    77.146,78    60.000,00     17.146,78     981.481,48
    20X4   981.481,48    78.518,52    60.000,00     18.518,52   1.000.000,00
    Tổng                306.242,54   240.000,00     66.242,54
    Kiểm tra: tổng phân bổ 66.242,54 = chiết khấu 66.242,54 ✓ (không cần điều chỉnh làm tròn)

(c) 1/1/20X1    Nợ Tiền                     933.757,46
                   Có Trái phiếu phải trả               933.757,46
    31/12/20X1  Nợ Chi phí lãi vay           74.700,60
                   Có Tiền                               60.000,00
                   Có Trái phiếu phải trả                14.700,60
    31/12/20X4  (sau bút toán lãi cuối cùng)
                Nợ Trái phiếu phải trả    1.000.000,00
                   Có Tiền                            1.000.000,00

(d) Tổng chi phí lãi vay = tiền lãi coupon 240.000,00 + chiết khấu 66.242,54 = 306.242,54
    = tổng cột lãi vay ✓

(e) Tại 31/12/20X3 trái phiếu (giá trị ghi sổ 981.481,48) đến hạn trong vòng
    mười hai tháng -> nợ ngắn hạn. Tại 31/12/20X1 và 20X2: nợ dài hạn.</code></pre>
<p><strong>Vì sao:</strong> nhà đầu tư chấp nhận lãi coupon 6% chỉ vì họ trả ít hơn mệnh giá; khoản chiết khấu 66.242,54 là tiền lãi bổ sung họ nhận được trong bốn năm. Vì chi phí lãi vay bằng 8% của giá trị ghi sổ đang tăng dần nên nó tăng mỗi năm. Phân bổ đường thẳng sẽ cho 16.560,64 mỗi năm — số tiền cố định nhưng lãi suất thay đổi — và không được phép theo IFRS. Trong thực tế, bảng làm tròn tới xu đôi khi cần điều chỉnh vài xu ở năm cuối; luôn kiểm tra số dư cuối cùng bằng đúng mệnh giá.</p>`,
  ]]);

const c10 = doc('fac201-4-4-leases', '4.4 — Leases for the lessee (IFRS 16, introduction)|||4.4 — Thuê tài sản phía bên thuê (IFRS 16, nhập môn)',
  'Định nghĩa thuê tài sản, mô hình duy nhất của bên thuê theo IFRS 16: tài sản quyền sử dụng và nợ thuê bằng giá trị hiện tại tiền thuê, miễn trừ thuê ngắn hạn và tài sản giá trị thấp, ví dụ số thuê xe 3 năm có bảng nợ thuê và bút toán, ảnh hưởng tới các tỷ số.',
  [[
    `<span class="eyebrow">FAC201 · Part 4 · Lesson 4.4</span>
<h2>Leases for the lessee — IFRS 16 (introduction)</h2>
<p class="lead">A lease is a contract that conveys the right to control the use of an identified asset for a period of time in exchange for consideration. Since 2019, IFRS 16 puts almost all leases on the lessee’s statement of financial position.</p>
<h3>One model for lessees</h3>
<ul>
<li>At the commencement date the lessee recognises a <strong>right-of-use (ROU) asset</strong> and a <strong>lease liability</strong>.</li>
<li><strong>Lease liability</strong> = present value of the lease payments not yet paid, discounted at the interest rate implicit in the lease or, if that rate cannot be readily determined, the lessee’s <strong>incremental borrowing rate</strong>.</li>
<li><strong>ROU asset</strong> = lease liability + lease payments made at or before commencement − lease incentives received + initial direct costs + estimated costs of dismantling or restoring the asset.</li>
<li>Afterwards the liability is measured with the effective interest method (as for bonds, lesson 4.2) and the ROU asset is depreciated — usually straight-line over the shorter of the lease term and the useful life (the useful life if ownership transfers or a purchase option is reasonably certain to be exercised).</li>
<li>Optional exemptions: <strong>short-term leases</strong> (12 months or less, no purchase option) and leases of <strong>low-value assets</strong> may be expensed straight-line instead.</li>
</ul>
<h3>Worked example (fictional)</h3>
<pre><code>A delivery van is leased for 3 years; 50,000 is paid at the END of each year;
incremental borrowing rate 8%; no initial direct costs, incentives or guarantees
Lease liability = 50,000 x [1 − 1.08^−3] / 0.08 = 50,000 x 2.5770970 = 128,854.85
  Dr Right-of-use asset 128,854.85 / Cr Lease liability 128,854.85

Year  Opening liability  Interest 8%   Payment     Closing liability
1        128,854.85       10,308.39    50,000.00      89,163.24
2         89,163.24        7,133.06    50,000.00      46,296.30
3         46,296.30        3,703.70    50,000.00           0.00

Year 1 entries:
  Dr Interest expense 10,308.39 / Dr Lease liability 39,691.61 / Cr Cash 50,000.00
  Dr Depreciation expense 42,951.62 / Cr Accumulated depreciation — ROU 42,951.62
     (128,854.85 / 3; the year-3 charge is 42,951.61 because of rounding)
Year 1 total expense = 10,308.39 + 42,951.62 = 53,260.01  (more than the 50,000 paid)
Liability at the end of year 1: current 42,866.94 (principal repaid in year 2),
                                non-current 46,296.30</code></pre>
<h3>Why it matters</h3>
<p>Before IFRS 16, under IAS 17, lessees kept <em>operating</em> leases off the statement of financial position and simply expensed the rent. Now assets and liabilities are both higher, debt ratios rise and asset turnover falls, EBITDA rises (rent is replaced by depreciation and interest), and total expense is front-loaded because interest is highest in the early years. In the statement of cash flows, the principal part of lease payments is a financing outflow. Lessors still classify leases as finance or operating leases — that side is beyond this course.</p>
<div class="callout"><span class="badge">Remember</span> Under IFRS 16 the question is not "who owns the van?" but "who controls its use?". Control of use for a period is itself an asset, and the promise to pay for it is a liability.</div>`,
    `<span class="eyebrow">FAC201 · Phần 4 · Bài 4.4</span>
<h2>Thuê tài sản phía bên thuê — IFRS 16 (nhập môn)</h2>
<p class="lead">Thuê tài sản là hợp đồng chuyển giao quyền kiểm soát việc sử dụng một tài sản xác định trong một khoảng thời gian để đổi lấy khoản thanh toán. Từ năm 2019, IFRS 16 đưa gần như mọi hợp đồng thuê lên báo cáo tình hình tài chính của bên thuê.</p>
<h3>Một mô hình duy nhất cho bên thuê</h3>
<ul>
<li>Tại ngày bắt đầu thuê, bên thuê ghi nhận <strong>tài sản quyền sử dụng</strong> và <strong>nợ thuê</strong>.</li>
<li><strong>Nợ thuê</strong> = giá trị hiện tại của các khoản tiền thuê chưa trả, chiết khấu theo lãi suất ngầm định trong hợp đồng thuê hoặc, nếu không xác định được ngay, theo <strong>lãi suất đi vay tăng thêm</strong> của bên thuê.</li>
<li><strong>Tài sản quyền sử dụng</strong> = nợ thuê + tiền thuê đã trả tại hoặc trước ngày bắt đầu − ưu đãi thuê đã nhận + chi phí trực tiếp ban đầu + chi phí ước tính tháo dỡ, khôi phục tài sản.</li>
<li>Sau đó nợ thuê được đo lường theo phương pháp lãi suất thực tế (như trái phiếu, bài 4.2) và tài sản quyền sử dụng được khấu hao — thường theo đường thẳng trong thời gian ngắn hơn giữa thời hạn thuê và thời gian sử dụng hữu ích (theo thời gian sử dụng hữu ích nếu quyền sở hữu được chuyển giao hoặc chắc chắn một cách hợp lý sẽ thực hiện quyền chọn mua).</li>
<li>Miễn trừ tuỳ chọn: <strong>thuê ngắn hạn</strong> (từ 12 tháng trở xuống, không có quyền chọn mua) và thuê <strong>tài sản giá trị thấp</strong> có thể ghi chi phí theo đường thẳng.</li>
</ul>
<h3>Ví dụ (giả định)</h3>
<pre><code>Thuê một xe giao hàng trong 3 năm; trả 50.000 vào CUỐI mỗi năm;
lãi suất đi vay tăng thêm 8%; không có chi phí trực tiếp ban đầu, ưu đãi hay bảo lãnh
Nợ thuê = 50.000 x [1 − 1,08^−3] / 0,08 = 50.000 x 2,5770970 = 128.854,85
  Nợ Tài sản quyền sử dụng 128.854,85 / Có Nợ thuê 128.854,85

Năm  Nợ thuê đầu kỳ   Lãi 8%      Tiền trả     Nợ thuê cuối kỳ
1      128.854,85     10.308,39   50.000,00      89.163,24
2       89.163,24      7.133,06   50.000,00      46.296,30
3       46.296,30      3.703,70   50.000,00           0,00

Bút toán năm 1:
  Nợ Chi phí lãi vay 10.308,39 / Nợ Nợ thuê 39.691,61 / Có Tiền 50.000,00
  Nợ Chi phí khấu hao 42.951,62 / Có Hao mòn luỹ kế — tài sản quyền sử dụng 42.951,62
     (128.854,85 / 3; khấu hao năm 3 là 42.951,61 do làm tròn)
Tổng chi phí năm 1 = 10.308,39 + 42.951,62 = 53.260,01  (lớn hơn 50.000 đã trả)
Nợ thuê cuối năm 1: ngắn hạn 42.866,94 (gốc trả trong năm 2),
                    dài hạn 46.296,30</code></pre>
<h3>Vì sao quan trọng</h3>
<p>Trước IFRS 16, theo IAS 17, bên thuê để thuê <em>hoạt động</em> nằm ngoài báo cáo tình hình tài chính và chỉ ghi chi phí thuê. Nay cả tài sản và nợ phải trả đều cao hơn, tỷ số nợ tăng và vòng quay tài sản giảm, EBITDA tăng (tiền thuê được thay bằng khấu hao và lãi vay), và tổng chi phí dồn về những năm đầu vì lãi vay cao nhất ở đầu kỳ. Trên báo cáo lưu chuyển tiền tệ, phần gốc của tiền thuê là dòng tiền chi cho hoạt động tài chính. Bên cho thuê vẫn phân loại thuê tài chính hay thuê hoạt động — phía đó nằm ngoài phạm vi môn học.</p>
<div class="callout"><span class="badge">Ghi nhớ</span> Theo IFRS 16, câu hỏi không phải "ai sở hữu chiếc xe?" mà là "ai kiểm soát việc sử dụng nó?". Quyền kiểm soát việc sử dụng trong một khoảng thời gian tự nó là một tài sản, và cam kết trả tiền cho quyền đó là một khoản nợ.</div>`,
  ]]);

const c10q = quiz('fac201-quiz-4', 'Quiz 4 — Liabilities, bonds & leases|||Quiz 4 — Nợ phải trả, trái phiếu & thuê tài sản', [
  { id: 'q1', question: 'A company is being sued. Its lawyers judge that a loss is possible but less likely than not, and not remote. Under IAS 37 the company should…|||Công ty đang bị kiện. Luật sư đánh giá khả năng thua kiện là có thể xảy ra nhưng thấp hơn khả năng không xảy ra, và không phải rất ít khả năng. Theo IAS 37, công ty nên…', options: ['recognise a provision|||ghi nhận một khoản dự phòng phải trả', 'disclose a contingent liability in the notes|||thuyết minh một khoản nợ tiềm tàng', 'neither recognise nor disclose anything|||không ghi nhận cũng không thuyết minh gì', 'recognise a contingent asset|||ghi nhận một tài sản tiềm tàng'], correctIndex: 1, explanation: 'A provision needs an outflow that is probable (more likely than not). A possible but not probable outflow is disclosed as a contingent liability; only remote ones are ignored.|||Dự phòng đòi hỏi khả năng chi ra là có khả năng (cao hơn không xảy ra). Khoản có thể xảy ra nhưng không tới mức có khả năng được thuyết minh là nợ tiềm tàng; chỉ khoản rất ít khả năng mới bỏ qua.' },
  { id: 'q2', question: 'A bond has an opening carrying amount of 950,000, a face value of 1,000,000, a coupon rate of 8% and an effective rate of 10%. What is the interest expense for the year?|||Trái phiếu có giá trị ghi sổ đầu kỳ 950.000, mệnh giá 1.000.000, lãi suất danh nghĩa 8% và lãi suất thực tế 10%. Chi phí lãi vay trong năm là bao nhiêu?', options: ['80,000|||80.000', '100,000|||100.000', '15,000|||15.000', '95,000|||95.000'], correctIndex: 3, explanation: '950,000 x 10% = 95,000. Cash paid is 1,000,000 x 8% = 80,000; the 15,000 difference is discount amortisation added to the carrying amount.|||950.000 x 10% = 95.000. Tiền trả là 1.000.000 x 8% = 80.000; chênh lệch 15.000 là phần phân bổ chiết khấu cộng vào giá trị ghi sổ.' },
  { id: 'q3', question: 'Under IFRS 16, at the commencement date a lessee measures the lease liability at…|||Theo IFRS 16, tại ngày bắt đầu thuê, bên thuê đo lường nợ thuê theo…', options: ['the total undiscounted lease payments|||tổng tiền thuê chưa chiết khấu', 'the fair value of the leased asset|||giá trị hợp lý của tài sản thuê', 'the present value of the lease payments not yet paid|||giá trị hiện tại của các khoản tiền thuê chưa trả', 'zero, because rent is expensed as it is paid|||bằng 0, vì tiền thuê được ghi chi phí khi trả'], correctIndex: 2, explanation: 'The payments are discounted at the rate implicit in the lease or, if that cannot be readily determined, at the lessee’s incremental borrowing rate.|||Các khoản tiền thuê được chiết khấu theo lãi suất ngầm định trong hợp đồng hoặc, nếu không xác định được ngay, theo lãi suất đi vay tăng thêm của bên thuê.' },
]);

const c11 = doc('fac201-5-1-equity', '5.1 — Equity: shares, treasury shares, dividends & EPS|||5.1 — Vốn chủ sở hữu: cổ phiếu, cổ phiếu quỹ, cổ tức & EPS',
  'Các thành phần vốn chủ sở hữu, cổ phiếu phổ thông và cổ phiếu ưu đãi (phân loại theo IAS 32), ví dụ số Công ty Nova: phát hành, mua lại và tái phát hành cổ phiếu quỹ, công bố cổ tức, cổ tức luỹ kế; cổ tức bằng cổ phiếu, tách cổ phiếu và lãi cơ bản trên cổ phiếu (IAS 33).',
  [[
    `<span class="eyebrow">FAC201 · Part 5 · Lesson 5.1</span>
<h2>Equity: shares, treasury shares, dividends &amp; EPS</h2>
<p class="lead">Equity is the residual interest in the assets after deducting all liabilities (lesson 1.1). It is never measured on its own — it is what is left. One rule runs through the whole lesson: <strong>transactions with owners</strong> (issuing shares, buying them back, paying dividends) go directly to equity and never pass through profit or loss.</p>
<h3>Components of equity</h3>
<table>
<tr><th>Component</th><th>What it records</th></tr>
<tr><td>Share capital (ordinary, preference)</td><td>The nominal (par) value of the shares issued</td></tr>
<tr><td>Share premium</td><td>The amount received above par value</td></tr>
<tr><td>Treasury shares</td><td>The entity’s own shares bought back and not cancelled — a deduction from equity, never an asset</td></tr>
<tr><td>Retained earnings</td><td>Accumulated profits less dividends and other distributions</td></tr>
<tr><td>Other reserves</td><td>Items of other comprehensive income, such as the revaluation surplus (lesson 3.1)</td></tr>
</table>
<p>US-based textbooks say common stock and additional paid-in capital where IFRS-based texts say share capital and share premium. The <strong>statement of changes in equity</strong> reconciles the opening and closing balance of each component.</p>
<h3>Ordinary and preference shares</h3>
<p><strong>Ordinary shares</strong> carry votes and the residual claim; their dividends depend on the board’s decision. <strong>Preference shares</strong> usually carry no vote but have priority over ordinary shares for a fixed-rate dividend and for repayment on liquidation. If they are <strong>cumulative</strong>, any missed dividend (<em>in arrears</em>) must be paid before ordinary shareholders receive anything; arrears are disclosed but are not a liability until declared. Under IAS 32, classification follows substance: a preference share that the issuer <em>must</em> redeem, or that the holder can require the issuer to redeem, is a <strong>financial liability</strong>; if dividends are mandatory, the dividend obligation is a liability (the instrument may be a liability or a compound instrument with a liability component); a non-redeemable share with discretionary dividends is equity.</p>
<h3>Worked example — Nova Co. (fictional), 20X1</h3>
<pre><code>1 Jan   Issues 100,000 ordinary shares, par 1, at 5 each
        Dr Cash 500,000 / Cr Share capital — ordinary 100,000 / Cr Share premium 400,000
1 Jan   Issues 10,000 5% cumulative preference shares, par 10, at par
        (non-redeemable, dividends at the board’s discretion -> equity)
        Dr Cash 100,000 / Cr Share capital — preference 100,000
1 Apr   Buys back 10,000 of its ordinary shares at 6 each
        Dr Treasury shares 60,000 / Cr Cash 60,000
1 Oct   Reissues 4,000 treasury shares at 8 each (cost 6 each)
        Dr Cash 32,000 / Cr Treasury shares 24,000 / Cr Share premium 8,000
15 Dec  Declares dividends: preference 5,000 + ordinary 0.50 x 94,000 shares = 47,000
        Dr Retained earnings 52,000 / Cr Dividends payable 52,000
        (record date: no entry; payment in January: Dr Dividends payable / Cr Cash)

Equity at 31 December 20X1 (profit for the year 200,000)
Share capital — ordinary              100,000
Share capital — preference            100,000
Share premium                         408,000
Treasury shares (6,000 shares)        (36,000)
Retained earnings                     148,000   (200,000 − 52,000)
Total equity                          720,000</code></pre>
<p>The 8,000 received above cost on reissue is <strong>not a gain</strong>: IAS 32 forbids recognising any gain or loss in profit or loss on the purchase, sale, issue or cancellation of the entity’s own equity instruments. A reissue below cost is likewise charged to equity (typically share premium, then retained earnings). Treasury shares carry no votes or dividends, so outstanding shares are 100,000 issued − 6,000 held = 94,000.</p>
<h3>Cash dividends, share dividends and splits</h3>
<ul>
<li>A cash dividend involves three dates: <strong>declaration</strong> (the liability arises), <strong>record</strong> (who is entitled) and <strong>payment</strong>. A dividend declared after the reporting period is not a liability at the year-end; it is disclosed (IAS 10).</li>
<li><strong>Cumulative arrears</strong>: suppose Nova declared nothing in 20X2 and 20X3. If it declares 40,000 in 20X4, preference shareholders first receive 3 x 5,000 = 15,000 (two years in arrears plus the current year); ordinary shareholders receive the remaining 25,000.</li>
<li>A <strong>share dividend</strong> distributes shares instead of cash: an amount moves from retained earnings to share capital (and premium), and total equity is unchanged. A <strong>share split</strong> increases the number of shares and reduces the par value proportionally; no entry is needed. Neither changes the entity’s resources.</li>
</ul>
<h3>Earnings per share — IAS 33</h3>
<pre><code>Basic EPS = (profit − preference dividends) / weighted average ordinary shares outstanding

Nova 20X1: 100,000 x 12/12 − 10,000 x 9/12 + 4,000 x 3/12
         = 100,000 − 7,500 + 1,000 = 93,500 shares
Basic EPS = (200,000 − 5,000) / 93,500 = 2.09</code></pre>
<p>For cumulative preference shares, the dividend for the period is deducted whether or not it has been declared. <strong>Diluted EPS</strong> also assumes the conversion of convertible instruments and the exercise of options — beyond this course. EPS is presented on the face of the statement of profit or loss by listed companies and feeds the P/E ratio (FIN202).</p>
<div class="callout"><span class="badge">Note for Vietnam</span> Vietnamese statements use the terms owners’ contributed capital, share premium, treasury shares and undistributed profit after tax, and the Law on Securities 2019 (Article 13) sets the par value of shares offered to the public at VND 10,000. Check the regulations currently in force for the details.</div>`,
    `<span class="eyebrow">FAC201 · Phần 5 · Bài 5.1</span>
<h2>Vốn chủ sở hữu: cổ phiếu, cổ phiếu quỹ, cổ tức &amp; EPS</h2>
<p class="lead">Vốn chủ sở hữu là phần lợi ích còn lại trong tài sản sau khi trừ toàn bộ nợ phải trả (bài 1.1). Nó không bao giờ được đo lường riêng — nó là phần còn lại. Một quy tắc xuyên suốt bài: <strong>giao dịch với chủ sở hữu</strong> (phát hành cổ phiếu, mua lại cổ phiếu, trả cổ tức) ghi thẳng vào vốn chủ sở hữu và không bao giờ đi qua lãi lỗ.</p>
<h3>Các thành phần vốn chủ sở hữu</h3>
<table>
<tr><th>Thành phần</th><th>Ghi nhận điều gì</th></tr>
<tr><td>Vốn cổ phần (phổ thông, ưu đãi)</td><td>Mệnh giá của số cổ phiếu đã phát hành</td></tr>
<tr><td>Thặng dư vốn cổ phần</td><td>Số tiền nhận được vượt quá mệnh giá</td></tr>
<tr><td>Cổ phiếu quỹ</td><td>Cổ phiếu của chính đơn vị đã mua lại và chưa huỷ — một khoản giảm trừ vốn chủ sở hữu, không bao giờ là tài sản</td></tr>
<tr><td>Lợi nhuận giữ lại</td><td>Lợi nhuận luỹ kế trừ cổ tức và các khoản phân phối khác</td></tr>
<tr><td>Các quỹ, dự trữ khác</td><td>Các khoản thu nhập toàn diện khác, như thặng dư đánh giá lại (bài 3.1)</td></tr>
</table>
<p>Giáo trình theo chuẩn Mỹ dùng common stock và additional paid-in capital, còn giáo trình theo IFRS dùng share capital và share premium. <strong>Báo cáo thay đổi vốn chủ sở hữu</strong> đối chiếu số dư đầu kỳ và cuối kỳ của từng thành phần.</p>
<h3>Cổ phiếu phổ thông và cổ phiếu ưu đãi</h3>
<p><strong>Cổ phiếu phổ thông</strong> có quyền biểu quyết và quyền đối với phần còn lại; cổ tức phụ thuộc quyết định của hội đồng quản trị. <strong>Cổ phiếu ưu đãi</strong> thường không có quyền biểu quyết nhưng được ưu tiên hơn cổ phiếu phổ thông về cổ tức theo tỷ lệ cố định và về hoàn vốn khi giải thể. Nếu là cổ phiếu ưu đãi <strong>cổ tức luỹ kế</strong>, mọi khoản cổ tức bị bỏ lỡ (<em>còn nợ</em>) phải được trả trước khi cổ đông phổ thông nhận được gì; phần còn nợ được thuyết minh nhưng chưa là nợ phải trả cho tới khi được công bố. Theo IAS 32, việc phân loại theo bản chất: cổ phiếu ưu đãi mà tổ chức phát hành <em>bắt buộc</em> phải mua lại, hoặc người nắm giữ có quyền yêu cầu tổ chức phát hành mua lại, là <strong>nợ phải trả tài chính</strong>; nếu cổ tức là bắt buộc thì nghĩa vụ trả cổ tức là nợ phải trả (công cụ đó có thể là nợ phải trả hoặc công cụ phức hợp có cấu phần nợ); cổ phiếu không được mua lại và có cổ tức tuỳ ý là vốn chủ sở hữu.</p>
<h3>Ví dụ — Công ty Nova (giả định), năm 20X1</h3>
<pre><code>1/1    Phát hành 100.000 cổ phiếu phổ thông, mệnh giá 1, giá 5 mỗi cổ phiếu
       Nợ Tiền 500.000 / Có Vốn cổ phần — phổ thông 100.000 / Có Thặng dư vốn cổ phần 400.000
1/1    Phát hành 10.000 cổ phiếu ưu đãi cổ tức luỹ kế 5%, mệnh giá 10, theo mệnh giá
       (không được mua lại, cổ tức do hội đồng quản trị quyết định -> vốn chủ sở hữu)
       Nợ Tiền 100.000 / Có Vốn cổ phần — ưu đãi 100.000
1/4    Mua lại 10.000 cổ phiếu phổ thông của chính mình, giá 6 mỗi cổ phiếu
       Nợ Cổ phiếu quỹ 60.000 / Có Tiền 60.000
1/10   Tái phát hành 4.000 cổ phiếu quỹ, giá 8 mỗi cổ phiếu (giá gốc 6 mỗi cổ phiếu)
       Nợ Tiền 32.000 / Có Cổ phiếu quỹ 24.000 / Có Thặng dư vốn cổ phần 8.000
15/12  Công bố cổ tức: ưu đãi 5.000 + phổ thông 0,50 x 94.000 cổ phiếu = 47.000
       Nợ Lợi nhuận giữ lại 52.000 / Có Cổ tức phải trả 52.000
       (ngày chốt danh sách: không ghi sổ; trả vào tháng 1: Nợ Cổ tức phải trả / Có Tiền)

Vốn chủ sở hữu tại 31/12/20X1 (lợi nhuận trong năm 200.000)
Vốn cổ phần — phổ thông               100.000
Vốn cổ phần — ưu đãi                  100.000
Thặng dư vốn cổ phần                  408.000
Cổ phiếu quỹ (6.000 cổ phiếu)         (36.000)
Lợi nhuận giữ lại                     148.000   (200.000 − 52.000)
Tổng vốn chủ sở hữu                   720.000</code></pre>
<p>Khoản 8.000 thu vượt giá gốc khi tái phát hành <strong>không phải là lãi</strong>: IAS 32 cấm ghi nhận lãi hay lỗ vào lãi lỗ khi mua, bán, phát hành hoặc huỷ công cụ vốn chủ sở hữu của chính đơn vị. Tái phát hành thấp hơn giá gốc cũng được ghi vào vốn chủ sở hữu (thường trừ vào thặng dư vốn cổ phần, sau đó vào lợi nhuận giữ lại). Cổ phiếu quỹ không có quyền biểu quyết hay nhận cổ tức, nên số cổ phiếu đang lưu hành là 100.000 đã phát hành − 6.000 đang giữ = 94.000.</p>
<h3>Cổ tức bằng tiền, cổ tức bằng cổ phiếu và tách cổ phiếu</h3>
<ul>
<li>Cổ tức bằng tiền gắn với ba ngày: <strong>ngày công bố</strong> (phát sinh nợ phải trả), <strong>ngày chốt danh sách</strong> (ai được hưởng) và <strong>ngày thanh toán</strong>. Cổ tức công bố sau kỳ báo cáo không phải là nợ phải trả tại ngày cuối năm; nó được thuyết minh (IAS 10).</li>
<li><strong>Cổ tức luỹ kế còn nợ</strong>: giả sử Nova không công bố cổ tức nào trong năm 20X2 và 20X3. Nếu năm 20X4 công bố 40.000, cổ đông ưu đãi nhận trước 3 x 5.000 = 15.000 (hai năm còn nợ cộng năm hiện tại); cổ đông phổ thông nhận 25.000 còn lại.</li>
<li><strong>Cổ tức bằng cổ phiếu</strong> phân phối cổ phiếu thay cho tiền: một khoản được chuyển từ lợi nhuận giữ lại sang vốn cổ phần (và thặng dư), tổng vốn chủ sở hữu không đổi. <strong>Tách cổ phiếu</strong> làm tăng số cổ phiếu và giảm mệnh giá theo cùng tỷ lệ; không cần bút toán. Cả hai đều không làm thay đổi nguồn lực của đơn vị.</li>
</ul>
<h3>Lãi trên cổ phiếu — IAS 33</h3>
<pre><code>EPS cơ bản = (lợi nhuận − cổ tức ưu đãi) / số cổ phiếu phổ thông lưu hành bình quân gia quyền

Nova 20X1: 100.000 x 12/12 − 10.000 x 9/12 + 4.000 x 3/12
         = 100.000 − 7.500 + 1.000 = 93.500 cổ phiếu
EPS cơ bản = (200.000 − 5.000) / 93.500 = 2,09</code></pre>
<p>Với cổ phiếu ưu đãi cổ tức luỹ kế, cổ tức của kỳ được trừ dù đã công bố hay chưa. <strong>EPS suy giảm</strong> còn giả định chuyển đổi các công cụ có thể chuyển đổi và thực hiện quyền chọn — nằm ngoài phạm vi môn học. Công ty niêm yết trình bày EPS ngay trên báo cáo lãi lỗ, và EPS là đầu vào của hệ số P/E (FIN202).</p>
<div class="callout"><span class="badge">Lưu ý với Việt Nam</span> Báo cáo tài chính ở Việt Nam dùng các thuật ngữ vốn góp của chủ sở hữu, thặng dư vốn cổ phần, cổ phiếu quỹ và lợi nhuận sau thuế chưa phân phối, và Luật Chứng khoán 2019 (Điều 13) quy định cổ phiếu chào bán ra công chúng có mệnh giá 10.000 đồng. Hãy kiểm văn bản đang có hiệu lực để biết chi tiết.</div>`,
  ]]);

const c12 = doc('fac201-5-2-cash-flows', '5.2 — The statement of cash flows (IAS 7), indirect method|||5.2 — Báo cáo lưu chuyển tiền tệ (IAS 7), phương pháp gián tiếp',
  'Tiền và tương đương tiền, ba nhóm hoạt động (kinh doanh, đầu tư, tài chính), phân loại lãi vay và cổ tức (và thay đổi do IFRS 18), phương pháp trực tiếp và gián tiếp, bảng điều chỉnh của phương pháp gián tiếp, ví dụ số Công ty Orchid, giao dịch phi tiền tệ và cách đọc báo cáo.',
  [[
    `<span class="eyebrow">FAC201 · Part 5 · Lesson 5.2</span>
<h2>The statement of cash flows — IAS 7, indirect method</h2>
<p class="lead">The statement of cash flows explains how cash and cash equivalents changed during the period, split into three activities. It answers questions that accrual profit cannot: can the business pay its bills, fund its investment and pay dividends from its own operations?</p>
<h3>Cash and cash equivalents</h3>
<p><strong>Cash equivalents</strong> are short-term, highly liquid investments that are readily convertible to known amounts of cash and subject to an insignificant risk of changes in value — normally with a maturity of three months or less from the date of acquisition. Bank overdrafts repayable on demand may be included where they form an integral part of cash management.</p>
<h3>Three activities</h3>
<table>
<tr><th>Activity</th><th>Typical cash flows</th></tr>
<tr><td>Operating</td><td>Receipts from customers; payments to suppliers and employees; income taxes paid (unless specifically identified with investing or financing)</td></tr>
<tr><td>Investing</td><td>Purchase and sale of PPE, intangible assets and investments in other entities; loans made to other parties and their collection</td></tr>
<tr><td>Financing</td><td>Issuing shares; buying treasury shares; borrowing and repaying loans and bonds; the principal part of lease payments (lesson 4.4)</td></tr>
</table>
<p><strong>Interest and dividends.</strong> IAS 7 currently lets an entity classify interest paid, interest received and dividends received as operating, or as financing (interest paid) and investing (interest and dividends received); dividends paid may be financing or operating. The choice must be applied consistently. <strong>IFRS 18</strong>, effective for annual periods beginning on or after 1 January 2027, amends IAS 7: for most non-financial companies interest and dividends paid become financing and interest and dividends received become investing, and the indirect method starts from <em>operating profit</em>.</p>
<h3>Direct or indirect method</h3>
<p>Operating cash flow can be shown by the <strong>direct method</strong> (gross receipts and payments — encouraged by IAS 7) or the <strong>indirect method</strong> (profit adjusted for non-cash items and working-capital changes — the method most companies use). Both give the same operating total; investing and financing sections are identical under either method.</p>
<table>
<tr><th>Indirect method: start from profit, then…</th><th>Why</th></tr>
<tr><td>+ Depreciation, amortisation, impairment losses, increases in provisions</td><td>Expenses that used no cash in the period</td></tr>
<tr><td>− Gains / + losses on disposal of non-current assets</td><td>The whole cash proceeds belong in investing</td></tr>
<tr><td>− Increase / + decrease in receivables, inventories, prepayments</td><td>More cash is tied up in (or released from) operating assets</td></tr>
<tr><td>+ Increase / − decrease in payables, accrued expenses, tax payable</td><td>Expenses recognised but not yet paid (or paid from last year)</td></tr>
</table>
<h3>Worked example — Orchid Co. (fictional, $ thousands)</h3>
<pre><code>Profit for the year                                  120
+ Depreciation                                        30
− Gain on sale of equipment                           (5)
− Increase in trade receivables                      (20)
+ Decrease in inventories                             10
− Increase in prepayments                             (2)
+ Increase in trade payables                          15
− Decrease in accrued expenses                        (3)
Net cash from operating activities                   145</code></pre>
<p>Read each line as a story about cash. Receivables rose by 20: that much revenue is in profit but not yet in the bank. Payables rose by 15: that much cost is in profit but has not been paid yet. The gain of 5 is removed because the full selling price of the equipment will appear under investing activities.</p>
<h3>Non-cash transactions and reading the statement</h3>
<ul>
<li>Investing and financing transactions that use no cash — acquiring an asset by issuing shares, converting debt into equity, a new lease (lesson 4.4) — are excluded from the statement and disclosed in the notes.</li>
<li>A healthy, mature company usually shows positive operating cash flow, negative investing cash flow (it keeps investing) and financing flows that depend on its dividend and debt policy.</li>
<li>Operating cash flow persistently below profit is a warning sign: profit may rest on revenue not yet collected or on inventory piling up. <strong>Free cash flow</strong> = operating cash flow − capital expenditure (FIN202).</li>
</ul>
<div class="callout"><span class="badge">Sign rule</span> An increase in an operating asset is cash going out; an increase in an operating liability is cash staying in. If you are unsure about a sign, ask: did this change put cash in the bank or take it out?</div>`,
    `<span class="eyebrow">FAC201 · Phần 5 · Bài 5.2</span>
<h2>Báo cáo lưu chuyển tiền tệ — IAS 7, phương pháp gián tiếp</h2>
<p class="lead">Báo cáo lưu chuyển tiền tệ giải thích tiền và các khoản tương đương tiền đã thay đổi thế nào trong kỳ, chia theo ba nhóm hoạt động. Nó trả lời những câu hỏi mà lợi nhuận dồn tích không trả lời được: doanh nghiệp có trả được các hoá đơn, tự tài trợ cho đầu tư và trả cổ tức từ chính hoạt động của mình không?</p>
<h3>Tiền và các khoản tương đương tiền</h3>
<p><strong>Tương đương tiền</strong> là các khoản đầu tư ngắn hạn, có tính thanh khoản cao, dễ dàng chuyển đổi thành một lượng tiền xác định và ít rủi ro thay đổi giá trị — thường có thời hạn gốc không quá ba tháng kể từ ngày mua. Khoản thấu chi ngân hàng phải trả khi có yêu cầu có thể được tính vào nếu nó là một phần không tách rời của việc quản lý tiền.</p>
<h3>Ba nhóm hoạt động</h3>
<table>
<tr><th>Hoạt động</th><th>Dòng tiền điển hình</th></tr>
<tr><td>Kinh doanh</td><td>Tiền thu từ khách hàng; tiền trả nhà cung cấp và người lao động; thuế thu nhập doanh nghiệp đã nộp (trừ khi gắn cụ thể với hoạt động đầu tư hay tài chính)</td></tr>
<tr><td>Đầu tư</td><td>Mua, bán TSCĐ hữu hình, tài sản vô hình và các khoản đầu tư vào đơn vị khác; cho bên khác vay và thu hồi các khoản cho vay</td></tr>
<tr><td>Tài chính</td><td>Phát hành cổ phiếu; mua cổ phiếu quỹ; đi vay và trả nợ vay, trái phiếu; phần gốc của tiền thuê tài sản (bài 4.4)</td></tr>
</table>
<p><strong>Lãi vay và cổ tức.</strong> IAS 7 hiện cho phép đơn vị phân loại lãi vay đã trả, lãi đã nhận và cổ tức đã nhận vào hoạt động kinh doanh, hoặc vào hoạt động tài chính (lãi vay đã trả) và đầu tư (lãi và cổ tức đã nhận); cổ tức đã trả có thể thuộc hoạt động tài chính hoặc kinh doanh. Lựa chọn phải được áp dụng nhất quán. <strong>IFRS 18</strong>, có hiệu lực cho các kỳ kế toán năm bắt đầu từ ngày 1/1/2027, sửa đổi IAS 7: với phần lớn công ty phi tài chính, lãi vay và cổ tức đã trả chuyển về hoạt động tài chính, lãi và cổ tức đã nhận chuyển về hoạt động đầu tư, và phương pháp gián tiếp bắt đầu từ <em>lợi nhuận hoạt động</em>.</p>
<h3>Phương pháp trực tiếp hay gián tiếp</h3>
<p>Dòng tiền từ hoạt động kinh doanh có thể trình bày theo <strong>phương pháp trực tiếp</strong> (tổng tiền thu và tổng tiền chi — được IAS 7 khuyến khích) hoặc <strong>phương pháp gián tiếp</strong> (lợi nhuận điều chỉnh cho các khoản phi tiền tệ và thay đổi vốn lưu động — phương pháp phần lớn công ty dùng). Hai phương pháp cho cùng một tổng dòng tiền kinh doanh; phần đầu tư và tài chính giống hệt nhau.</p>
<table>
<tr><th>Phương pháp gián tiếp: bắt đầu từ lợi nhuận, rồi…</th><th>Vì sao</th></tr>
<tr><td>+ Khấu hao, phân bổ, tổn thất suy giảm giá trị, tăng dự phòng</td><td>Chi phí không dùng tiền trong kỳ</td></tr>
<tr><td>− Lãi / + lỗ thanh lý tài sản dài hạn</td><td>Toàn bộ tiền thu thanh lý thuộc hoạt động đầu tư</td></tr>
<tr><td>− Tăng / + giảm phải thu, hàng tồn kho, chi phí trả trước</td><td>Nhiều tiền hơn bị giam vào (hoặc được giải phóng khỏi) tài sản hoạt động</td></tr>
<tr><td>+ Tăng / − giảm phải trả người bán, chi phí phải trả, thuế phải nộp</td><td>Chi phí đã ghi nhận nhưng chưa trả (hoặc trả cho khoản của năm trước)</td></tr>
</table>
<h3>Ví dụ — Công ty Orchid (giả định, nghìn $)</h3>
<pre><code>Lợi nhuận trong năm                                  120
+ Khấu hao                                            30
− Lãi thanh lý thiết bị                               (5)
− Tăng phải thu khách hàng                           (20)
+ Giảm hàng tồn kho                                   10
− Tăng chi phí trả trước                              (2)
+ Tăng phải trả người bán                             15
− Giảm chi phí phải trả                               (3)
Lưu chuyển tiền thuần từ hoạt động kinh doanh        145</code></pre>
<p>Hãy đọc mỗi dòng như một câu chuyện về tiền. Phải thu tăng 20: phần doanh thu đó đã nằm trong lợi nhuận nhưng chưa về tài khoản ngân hàng. Phải trả người bán tăng 15: phần chi phí đó đã nằm trong lợi nhuận nhưng chưa trả. Khoản lãi 5 bị loại ra vì toàn bộ giá bán thiết bị sẽ xuất hiện ở hoạt động đầu tư.</p>
<h3>Giao dịch phi tiền tệ và cách đọc báo cáo</h3>
<ul>
<li>Các giao dịch đầu tư và tài chính không dùng tiền — mua tài sản bằng cách phát hành cổ phiếu, chuyển nợ thành vốn chủ sở hữu, một hợp đồng thuê mới (bài 4.4) — không đưa vào báo cáo mà được thuyết minh.</li>
<li>Một công ty trưởng thành, lành mạnh thường có dòng tiền kinh doanh dương, dòng tiền đầu tư âm (vẫn tiếp tục đầu tư) và dòng tiền tài chính tuỳ theo chính sách cổ tức và nợ vay.</li>
<li>Dòng tiền kinh doanh liên tục thấp hơn lợi nhuận là tín hiệu cảnh báo: lợi nhuận có thể dựa vào doanh thu chưa thu được tiền hoặc hàng tồn kho đang ứ đọng. <strong>Dòng tiền tự do</strong> = dòng tiền kinh doanh − chi đầu tư TSCĐ (FIN202).</li>
</ul>
<div class="callout"><span class="badge">Quy tắc dấu</span> Tài sản hoạt động tăng là tiền đi ra; nợ phải trả hoạt động tăng là tiền được giữ lại. Khi không chắc về dấu, hãy hỏi: thay đổi này đưa tiền vào ngân hàng hay rút tiền ra?</div>`,
  ]]);

const c12e = doc('fac201-5-3-exercise', 'Exercise 3 — operating cash flow by the indirect method|||Bài tập 3 — lưu chuyển tiền từ hoạt động kinh doanh theo phương pháp gián tiếp',
  'Bài tập: từ bảng cân đối so sánh và báo cáo kết quả kinh doanh giả định của Công ty Kappa, lập lưu chuyển tiền từ hoạt động kinh doanh theo phương pháp gián tiếp, tính dòng tiền đầu tư và tài chính, đối chiếu với thay đổi của tiền, kiểm lại bằng phương pháp trực tiếp và nhận xét; kèm lời giải.',
  [[
    `<span class="eyebrow">FAC201 · Part 5 · Exercise</span>
<h2>Exercise 3 — operating cash flow by the indirect method</h2>
<div class="callout"><span class="badge">Problem</span> Kappa Co. (a fictional company; illustrative figures in $) reports the following. (a) Prepare net cash from operating activities by the indirect method (interest paid is classified as operating). (b) Compute net cash from investing and financing activities. (c) Reconcile the net change in cash with the statements of financial position. (d) Check the operating figure by the direct method. (e) Comment on the quality of Kappa’s profit.</div>
<pre><code class="language-text">STATEMENT OF PROFIT OR LOSS, 20X2
Sales revenue                        900,000
Cost of sales                       (540,000)
Gross profit                         360,000
Operating expenses (excl. depr.)    (150,000)
Depreciation                         (40,000)
Gain on sale of equipment              6,000
Operating profit                     176,000
Interest expense                     (16,000)
Profit before tax                    160,000
Income tax (20%)                     (32,000)
Profit for the year                  128,000

STATEMENT OF FINANCIAL POSITION     31 Dec 20X1   31 Dec 20X2
Cash                                    30,000        62,000
Trade receivables                       80,000        95,000
Inventories                            120,000       110,000
Prepayments                              6,000         8,000
Equipment at cost                      400,000       460,000
Accumulated depreciation              (100,000)     (120,000)
Total assets                           536,000       615,000
Trade payables                          70,000        82,000
Accrued expenses                        10,000         7,000
Income tax payable                       9,000        11,000
Long-term bank loan                    150,000       120,000
Share capital                          200,000       230,000
Retained earnings                       97,000       165,000
Total equity and liabilities           536,000       615,000

Additional information: equipment costing 50,000 (accumulated depreciation 20,000)
was sold for 36,000 cash; all other equipment was bought for cash; new shares were
issued for 30,000 cash; 30,000 of the loan was repaid; dividends paid 60,000;
interest payable was nil at both dates (interest paid = interest expense).
The 30,000 repayment was a voluntary early repayment, not contractually due in
20X2; at neither year-end is any instalment of the loan due within twelve months,
so the whole loan is non-current at both dates.</code></pre>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) Profit for the year                              128,000
    + Depreciation                                    40,000
    − Gain on sale of equipment                       (6,000)
    − Increase in trade receivables (95 − 80)        (15,000)
    + Decrease in inventories (110 − 120)             10,000
    − Increase in prepayments (8 − 6)                 (2,000)
    + Increase in trade payables (82 − 70)            12,000
    − Decrease in accrued expenses (7 − 10)           (3,000)
    + Increase in income tax payable (11 − 9)          2,000
    Net cash from operating activities               166,000

(b) Equipment sold: carrying amount 50,000 − 20,000 = 30,000; proceeds 36,000
    -> gain 6,000 ✓ (matches the income statement)
    Equipment bought = closing 460,000 − opening 400,000 + cost sold 50,000 = 110,000
    Check accumulated depreciation: 100,000 + 40,000 − 20,000 = 120,000 ✓

    Investing:  proceeds from sale 36,000 − purchases 110,000      = (74,000)
    Financing:  shares issued 30,000 − loan repaid 30,000
                − dividends paid 60,000                            = (60,000)
    Check retained earnings: 97,000 + 128,000 − 60,000 = 165,000 ✓

(c) Net change in cash = 166,000 − 74,000 − 60,000 = 32,000
    Opening cash 30,000 + 32,000 = closing cash 62,000 ✓

(d) Direct method:
    Cash from customers    = 900,000 − 15,000 (receivables up)          885,000
    Paid to suppliers      = purchases (540,000 − 10,000 = 530,000)
                             − 12,000 (payables up)                    (518,000)
    Operating expenses paid = 150,000 + 2,000 (prepayments up)
                             + 3,000 (accruals down)                   (155,000)
    Interest paid                                                       (16,000)
    Income tax paid        = 32,000 − 2,000 (tax payable up)            (30,000)
    Net cash from operating activities                                  166,000 ✓

(e) Operating cash flow / profit = 166,000 / 128,000 = 1.30
    Free cash flow = 166,000 − 110,000 = 56,000</code></pre>
<p><strong>Why:</strong> Kappa’s operating cash flow exceeds its profit mainly because depreciation (40,000) is a non-cash expense, trade payables rose by 12,000 and inventories fell by 10,000; the rise in receivables (15,000) is the only large drain. Profit is backed by cash, and after buying 110,000 of equipment the business still generated 56,000 of free cash flow — close to the 60,000 dividend it paid. Every figure was checked against the statements: if the three activities do not add up to the change in cash, a working-capital sign is almost always the culprit.</p>`,
    `<span class="eyebrow">FAC201 · Phần 5 · Bài tập</span>
<h2>Bài tập 3 — lưu chuyển tiền từ hoạt động kinh doanh theo phương pháp gián tiếp</h2>
<div class="callout"><span class="badge">Đề</span> Công ty Kappa (doanh nghiệp giả định; số liệu minh hoạ, đơn vị $) có số liệu dưới đây. (a) Lập lưu chuyển tiền thuần từ hoạt động kinh doanh theo phương pháp gián tiếp (lãi vay đã trả được phân loại vào hoạt động kinh doanh). (b) Tính lưu chuyển tiền thuần từ hoạt động đầu tư và tài chính. (c) Đối chiếu thay đổi thuần của tiền với báo cáo tình hình tài chính. (d) Kiểm lại số liệu hoạt động kinh doanh bằng phương pháp trực tiếp. (e) Nhận xét về chất lượng lợi nhuận của Kappa.</div>
<pre><code class="language-text">BÁO CÁO LÃI LỖ, NĂM 20X2
Doanh thu bán hàng                   900.000
Giá vốn hàng bán                    (540.000)
Lợi nhuận gộp                        360.000
Chi phí hoạt động (chưa gồm KH)     (150.000)
Khấu hao                             (40.000)
Lãi thanh lý thiết bị                  6.000
Lợi nhuận hoạt động                  176.000
Chi phí lãi vay                      (16.000)
Lợi nhuận trước thuế                 160.000
Thuế thu nhập doanh nghiệp (20%)     (32.000)
Lợi nhuận trong năm                  128.000

BÁO CÁO TÌNH HÌNH TÀI CHÍNH          31/12/20X1    31/12/20X2
Tiền                                    30.000        62.000
Phải thu khách hàng                     80.000        95.000
Hàng tồn kho                           120.000       110.000
Chi phí trả trước                        6.000         8.000
Thiết bị theo nguyên giá               400.000       460.000
Hao mòn luỹ kế                        (100.000)     (120.000)
Tổng tài sản                           536.000       615.000
Phải trả người bán                      70.000        82.000
Chi phí phải trả                        10.000         7.000
Thuế TNDN phải nộp                       9.000        11.000
Vay ngân hàng dài hạn                  150.000       120.000
Vốn cổ phần                            200.000       230.000
Lợi nhuận giữ lại                       97.000       165.000
Tổng nguồn vốn                         536.000       615.000

Thông tin bổ sung: thiết bị nguyên giá 50.000 (hao mòn luỹ kế 20.000) được bán thu
36.000 bằng tiền; mọi thiết bị khác đều mua bằng tiền; phát hành cổ phiếu mới thu
30.000 bằng tiền; trả bớt 30.000 nợ vay; cổ tức đã trả 60.000; lãi vay phải trả
bằng 0 ở cả hai thời điểm (lãi vay đã trả = chi phí lãi vay).
Khoản trả 30.000 là trả trước hạn tự nguyện, không tới hạn theo hợp đồng trong năm
20X2; ở cả hai thời điểm cuối năm không có kỳ trả nợ gốc nào tới hạn trong 12 tháng,
nên toàn bộ khoản vay là nợ dài hạn ở cả hai thời điểm.</code></pre>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) Lợi nhuận trong năm                              128.000
    + Khấu hao                                        40.000
    − Lãi thanh lý thiết bị                           (6.000)
    − Tăng phải thu khách hàng (95 − 80)             (15.000)
    + Giảm hàng tồn kho (110 − 120)                   10.000
    − Tăng chi phí trả trước (8 − 6)                  (2.000)
    + Tăng phải trả người bán (82 − 70)               12.000
    − Giảm chi phí phải trả (7 − 10)                  (3.000)
    + Tăng thuế TNDN phải nộp (11 − 9)                 2.000
    Lưu chuyển tiền thuần từ hoạt động kinh doanh    166.000

(b) Thiết bị bán: giá trị ghi sổ 50.000 − 20.000 = 30.000; tiền thu 36.000
    -> lãi 6.000 ✓ (khớp báo cáo lãi lỗ)
    Thiết bị mua = cuối kỳ 460.000 − đầu kỳ 400.000 + nguyên giá đã bán 50.000 = 110.000
    Kiểm tra hao mòn luỹ kế: 100.000 + 40.000 − 20.000 = 120.000 ✓

    Đầu tư:     tiền thu thanh lý 36.000 − tiền mua 110.000          = (74.000)
    Tài chính:  phát hành cổ phiếu 30.000 − trả nợ vay 30.000
                − cổ tức đã trả 60.000                               = (60.000)
    Kiểm tra lợi nhuận giữ lại: 97.000 + 128.000 − 60.000 = 165.000 ✓

(c) Thay đổi thuần của tiền = 166.000 − 74.000 − 60.000 = 32.000
    Tiền đầu kỳ 30.000 + 32.000 = tiền cuối kỳ 62.000 ✓

(d) Phương pháp trực tiếp:
    Tiền thu từ khách hàng  = 900.000 − 15.000 (phải thu tăng)          885.000
    Tiền trả nhà cung cấp   = hàng mua (540.000 − 10.000 = 530.000)
                              − 12.000 (phải trả tăng)                 (518.000)
    Tiền chi hoạt động      = 150.000 + 2.000 (trả trước tăng)
                              + 3.000 (chi phí phải trả giảm)          (155.000)
    Lãi vay đã trả                                                      (16.000)
    Thuế TNDN đã nộp        = 32.000 − 2.000 (thuế phải nộp tăng)       (30.000)
    Lưu chuyển tiền thuần từ hoạt động kinh doanh                       166.000 ✓

(e) Dòng tiền kinh doanh / lợi nhuận = 166.000 / 128.000 = 1,30
    Dòng tiền tự do = 166.000 − 110.000 = 56.000</code></pre>
<p><strong>Vì sao:</strong> dòng tiền kinh doanh của Kappa lớn hơn lợi nhuận chủ yếu vì khấu hao (40.000) là chi phí không bằng tiền, phải trả người bán tăng 12.000 và hàng tồn kho giảm 10.000; phải thu tăng (15.000) là khoản hút tiền lớn duy nhất. Lợi nhuận có tiền đứng sau, và sau khi mua 110.000 thiết bị doanh nghiệp vẫn tạo ra 56.000 dòng tiền tự do — gần bằng 60.000 cổ tức đã trả. Mọi con số đã được đối chiếu với báo cáo: nếu ba nhóm hoạt động cộng lại không bằng thay đổi của tiền, thủ phạm gần như luôn là dấu của một khoản vốn lưu động.</p>`,
  ]]);

const c13 = doc('fac201-5-4-analysis', '5.4 — Financial statement analysis|||5.4 — Phân tích báo cáo tài chính',
  'Phân tích theo chiều ngang, theo chiều dọc và phân tích tỷ số trên số liệu Công ty Kappa: thanh khoản, đòn bẩy, hiệu quả hoạt động, khả năng sinh lời, DuPont và chỉ tiêu dòng tiền; các giới hạn do chính sách kế toán và ước tính; liên hệ FIN202.',
  [[
    `<span class="eyebrow">FAC201 · Part 5 · Lesson 5.4</span>
<h2>Financial statement analysis</h2>
<p class="lead">Everything in this course ends up as numbers in the statements. Analysis turns those numbers into answers: is the company liquid, how much does it rely on debt, how well does it use its assets, and how profitable is it? FIN202 treats the same ratios from a financial manager’s point of view; here the focus is on how accounting choices shape them.</p>
<h3>Three tools</h3>
<ul>
<li><strong>Horizontal (trend) analysis</strong> compares a line across periods: Kappa’s receivables rose 18.8% (80,000 to 95,000) and total assets 14.7% (536,000 to 615,000).</li>
<li><strong>Vertical (common-size) analysis</strong> expresses each line as a percentage of a base — sales for the income statement, total assets for the statement of financial position: Kappa’s cost of sales is 60.0% of sales, operating expenses 16.7%, operating profit 19.6%, profit 14.2%.</li>
<li><strong>Ratio analysis</strong> relates lines to each other, making companies of different sizes comparable.</li>
</ul>
<h3>Kappa Co. (Exercise 3) — key ratios</h3>
<table>
<tr><th>Group</th><th>Ratio</th><th>20X2</th><th>20X1</th></tr>
<tr><td rowspan="3">Liquidity</td><td>Current ratio = current assets / current liabilities</td><td>275,000 / 100,000 = 2.75</td><td>236,000 / 89,000 = 2.65</td></tr>
<tr><td>Quick ratio = (cash + receivables) / current liabilities</td><td>157,000 / 100,000 = 1.57</td><td>110,000 / 89,000 = 1.24</td></tr>
<tr><td>Operating cash flow / average current liabilities</td><td>166,000 / 94,500 = 1.76</td><td>—</td></tr>
<tr><td rowspan="3">Leverage (solvency)</td><td>Debt to assets = total liabilities / total assets</td><td>220,000 / 615,000 = 35.8%</td><td>239,000 / 536,000 = 44.6%</td></tr>
<tr><td>Debt to equity = total liabilities / equity</td><td>220,000 / 395,000 = 0.56</td><td>239,000 / 297,000 = 0.80</td></tr>
<tr><td>Times interest earned = operating profit / interest expense</td><td>176,000 / 16,000 = 11.0</td><td>—</td></tr>
<tr><td rowspan="3">Efficiency</td><td>Receivables turnover = sales / average receivables</td><td>900,000 / 87,500 = 10.29 times · 35.5 days</td><td>—</td></tr>
<tr><td>Inventory turnover = cost of sales / average inventories</td><td>540,000 / 115,000 = 4.70 times · 77.7 days</td><td>—</td></tr>
<tr><td>Asset turnover = sales / average total assets</td><td>900,000 / 575,500 = 1.56</td><td>—</td></tr>
<tr><td rowspan="4">Profitability</td><td>Gross margin = gross profit / sales</td><td>360,000 / 900,000 = 40.0%</td><td>—</td></tr>
<tr><td>Net profit margin = profit / sales</td><td>128,000 / 900,000 = 14.2%</td><td>—</td></tr>
<tr><td>Return on assets = profit / average total assets</td><td>128,000 / 575,500 = 22.2%</td><td>—</td></tr>
<tr><td>Return on equity = profit / average equity</td><td>128,000 / 346,000 = 37.0%</td><td>—</td></tr>
</table>
<p>Ratios that use averages need two statements of financial position, so only 20X2 can be computed, and no 20X1 income statement is given, so the income-statement ratios are shown for 20X2 only; days = 365 / turnover. The DuPont identity (FIN202) checks the profitability figures:</p>
<pre><code>ROE = net profit margin x asset turnover x equity multiplier
    = 14.22% x 1.564 x 1.663 (575,500 / 346,000) = 37.0%   ✓</code></pre>
<h3>What the numbers say</h3>
<p>Kappa became more liquid and less leveraged in 20X2: it repaid part of its loan, issued shares and retained profit, so debt to assets fell from 44.6% to 35.8%. Interest is covered eleven times. The main watch-point is working capital: receivables grew while inventories fell, so the collection period (35.5 days) should be compared with Kappa’s credit terms and with its competitors.</p>
<h3>Limits — why accounting knowledge matters</h3>
<ul>
<li><strong>Policy choices</strong> change ratios without changing the business: FIFO or weighted average (lesson 2.4), the cost or revaluation model (lesson 3.1).</li>
<li><strong>Changes in standards</strong> also move ratios: IFRS 16 (lesson 4.4) is not a choice — it brought almost all leases onto the statement of financial position from 2019, raising both assets and liabilities (only its short-term and low-value exemptions are optional), so compare figures from before and after 2019 with care.</li>
<li><strong>Estimates</strong> — credit loss rates, useful lives, residual values, provisions — can move profit from one year to another.</li>
<li><strong>One-off items</strong> such as disposal gains (Kappa’s 6,000) or impairment losses distort a single year; look at the trend.</li>
<li>Year-end figures can be <strong>window-dressed</strong>, for example by delaying payments to suppliers to lift cash, and ratios only mean something against the company’s history and its industry peers.</li>
</ul>
<div class="callout"><span class="badge">Key lesson</span> A ratio is a question, not an answer. Read it together with the statement of cash flows and the notes on accounting policies and estimates.</div>`,
    `<span class="eyebrow">FAC201 · Phần 5 · Bài 5.4</span>
<h2>Phân tích báo cáo tài chính</h2>
<p class="lead">Mọi thứ trong môn học cuối cùng đều trở thành con số trên báo cáo. Phân tích biến những con số đó thành câu trả lời: công ty có đủ thanh khoản không, dựa vào nợ tới mức nào, sử dụng tài sản hiệu quả ra sao, và sinh lời thế nào? FIN202 xem xét cùng các tỷ số này dưới góc nhìn nhà quản trị tài chính; ở đây trọng tâm là các lựa chọn kế toán định hình chúng ra sao.</p>
<h3>Ba công cụ</h3>
<ul>
<li><strong>Phân tích theo chiều ngang (xu hướng)</strong> so sánh một chỉ tiêu qua các kỳ: phải thu của Kappa tăng 18,8% (80.000 lên 95.000) và tổng tài sản tăng 14,7% (536.000 lên 615.000).</li>
<li><strong>Phân tích theo chiều dọc (quy mô chung)</strong> biểu diễn mỗi chỉ tiêu theo phần trăm của một gốc — doanh thu với báo cáo kết quả kinh doanh, tổng tài sản với báo cáo tình hình tài chính: giá vốn của Kappa bằng 60,0% doanh thu, chi phí hoạt động 16,7%, lợi nhuận hoạt động 19,6%, lợi nhuận 14,2%.</li>
<li><strong>Phân tích tỷ số</strong> đặt các chỉ tiêu trong quan hệ với nhau, giúp so sánh các công ty có quy mô khác nhau.</li>
</ul>
<h3>Công ty Kappa (Bài tập 3) — các tỷ số chính</h3>
<table>
<tr><th>Nhóm</th><th>Tỷ số</th><th>20X2</th><th>20X1</th></tr>
<tr><td rowspan="3">Thanh khoản</td><td>Thanh toán hiện hành = tài sản ngắn hạn / nợ ngắn hạn</td><td>275.000 / 100.000 = 2,75</td><td>236.000 / 89.000 = 2,65</td></tr>
<tr><td>Thanh toán nhanh = (tiền + phải thu) / nợ ngắn hạn</td><td>157.000 / 100.000 = 1,57</td><td>110.000 / 89.000 = 1,24</td></tr>
<tr><td>Dòng tiền kinh doanh / nợ ngắn hạn bình quân</td><td>166.000 / 94.500 = 1,76</td><td>—</td></tr>
<tr><td rowspan="3">Đòn bẩy (khả năng thanh toán dài hạn)</td><td>Nợ trên tài sản = tổng nợ phải trả / tổng tài sản</td><td>220.000 / 615.000 = 35,8%</td><td>239.000 / 536.000 = 44,6%</td></tr>
<tr><td>Nợ trên vốn chủ = tổng nợ phải trả / vốn chủ sở hữu</td><td>220.000 / 395.000 = 0,56</td><td>239.000 / 297.000 = 0,80</td></tr>
<tr><td>Khả năng trả lãi = lợi nhuận hoạt động / chi phí lãi vay</td><td>176.000 / 16.000 = 11,0</td><td>—</td></tr>
<tr><td rowspan="3">Hiệu quả hoạt động</td><td>Vòng quay phải thu = doanh thu / phải thu bình quân</td><td>900.000 / 87.500 = 10,29 vòng · 35,5 ngày</td><td>—</td></tr>
<tr><td>Vòng quay hàng tồn kho = giá vốn / hàng tồn kho bình quân</td><td>540.000 / 115.000 = 4,70 vòng · 77,7 ngày</td><td>—</td></tr>
<tr><td>Vòng quay tài sản = doanh thu / tổng tài sản bình quân</td><td>900.000 / 575.500 = 1,56</td><td>—</td></tr>
<tr><td rowspan="4">Khả năng sinh lời</td><td>Biên lợi nhuận gộp = lợi nhuận gộp / doanh thu</td><td>360.000 / 900.000 = 40,0%</td><td>—</td></tr>
<tr><td>Biên lợi nhuận ròng = lợi nhuận / doanh thu</td><td>128.000 / 900.000 = 14,2%</td><td>—</td></tr>
<tr><td>ROA = lợi nhuận / tổng tài sản bình quân</td><td>128.000 / 575.500 = 22,2%</td><td>—</td></tr>
<tr><td>ROE = lợi nhuận / vốn chủ sở hữu bình quân</td><td>128.000 / 346.000 = 37,0%</td><td>—</td></tr>
</table>
<p>Các tỷ số dùng số bình quân cần hai báo cáo tình hình tài chính, nên chỉ tính được cho năm 20X2, và đề không cho báo cáo lãi lỗ năm 20X1 nên các tỷ số dựa trên lãi lỗ chỉ tính cho 20X2; số ngày = 365 / số vòng quay. Đẳng thức DuPont (FIN202) kiểm lại các chỉ tiêu sinh lời:</p>
<pre><code>ROE = biên lợi nhuận ròng x vòng quay tài sản x hệ số nhân vốn chủ
    = 14,22% x 1,564 x 1,663 (575.500 / 346.000) = 37,0%   ✓</code></pre>
<h3>Các con số nói gì</h3>
<p>Năm 20X2 Kappa có thanh khoản tốt hơn và đòn bẩy thấp hơn: công ty trả bớt nợ vay, phát hành cổ phiếu và giữ lại lợi nhuận, nên tỷ số nợ trên tài sản giảm từ 44,6% xuống 35,8%. Lãi vay được bù đắp mười một lần. Điểm cần theo dõi chính là vốn lưu động: phải thu tăng trong khi hàng tồn kho giảm, nên kỳ thu tiền (35,5 ngày) cần được so với điều khoản tín dụng của Kappa và với các đối thủ.</p>
<h3>Giới hạn — vì sao cần hiểu kế toán</h3>
<ul>
<li><strong>Lựa chọn chính sách</strong> làm thay đổi tỷ số mà không thay đổi hoạt động kinh doanh: FIFO hay bình quân gia quyền (bài 2.4), mô hình giá gốc hay đánh giá lại (bài 3.1).</li>
<li><strong>Thay đổi chuẩn mực</strong> cũng làm dịch chuyển tỷ số: IFRS 16 (bài 4.4) không phải một lựa chọn — từ năm 2019 nó đưa gần như mọi hợp đồng thuê lên báo cáo tình hình tài chính, làm tăng cả tài sản lẫn nợ phải trả (chỉ các miễn trừ thuê ngắn hạn và tài sản giá trị thấp là tuỳ chọn), nên hãy thận trọng khi so số liệu trước và sau năm 2019.</li>
<li><strong>Ước tính</strong> — tỷ lệ tổn thất tín dụng, thời gian sử dụng hữu ích, giá trị thanh lý, dự phòng — có thể dịch chuyển lợi nhuận giữa các năm.</li>
<li><strong>Khoản bất thường</strong> như lãi thanh lý (6.000 của Kappa) hay tổn thất suy giảm giá trị làm méo một năm riêng lẻ; hãy nhìn xu hướng.</li>
<li>Số liệu cuối năm có thể được <strong>làm đẹp</strong>, ví dụ hoãn trả nhà cung cấp để tăng tiền, và tỷ số chỉ có ý nghĩa khi so với lịch sử của chính công ty và với các công ty cùng ngành.</li>
</ul>
<div class="callout"><span class="badge">Bài học chính</span> Tỷ số là câu hỏi, không phải câu trả lời. Hãy đọc nó cùng báo cáo lưu chuyển tiền tệ và thuyết minh về chính sách, ước tính kế toán.</div>`,
  ]]);

const c13q = quiz('fac201-quiz-5', 'Quiz 5 — Equity, cash flows & analysis|||Quiz 5 — Vốn chủ, lưu chuyển tiền tệ & phân tích', [
  { id: 'q1', question: 'A company reissues treasury shares that cost 24,000 for 32,000 in cash. How is the 8,000 difference recognised under IFRS?|||Công ty tái phát hành số cổ phiếu quỹ có giá gốc 24.000, thu 32.000 bằng tiền. Theo IFRS, khoản chênh lệch 8.000 được ghi nhận thế nào?', options: ['As a gain in profit or loss|||Là khoản lãi trong lãi lỗ', 'As other comprehensive income|||Là thu nhập toàn diện khác', 'As a reduction of retained earnings|||Là khoản giảm lợi nhuận giữ lại', 'Directly in equity, for example as share premium|||Trực tiếp vào vốn chủ sở hữu, ví dụ vào thặng dư vốn cổ phần'], correctIndex: 3, explanation: 'IAS 32 prohibits recognising a gain or loss in profit or loss on transactions in the entity’s own equity instruments; the excess over cost goes directly to equity.|||IAS 32 cấm ghi nhận lãi hay lỗ vào lãi lỗ khi giao dịch công cụ vốn chủ sở hữu của chính đơn vị; phần vượt giá gốc ghi thẳng vào vốn chủ sở hữu.' },
  { id: 'q2', question: 'Profit is 200, depreciation 50, receivables increased by 30, trade payables increased by 20, and there was a gain of 10 on selling equipment. What is net cash from operating activities (indirect method)?|||Lợi nhuận 200, khấu hao 50, phải thu tăng 30, phải trả người bán tăng 20, và có khoản lãi 10 khi bán thiết bị. Lưu chuyển tiền thuần từ hoạt động kinh doanh (phương pháp gián tiếp) là bao nhiêu?', options: ['230|||230', '250|||250', '270|||270', '180|||180'], correctIndex: 0, explanation: '200 + 50 − 30 + 20 − 10 = 230. The gain is deducted because the sale proceeds are reported in investing activities.|||200 + 50 − 30 + 20 − 10 = 230. Khoản lãi bị trừ ra vì tiền thu từ việc bán được trình bày ở hoạt động đầu tư.' },
  { id: 'q3', question: 'A company has a net profit margin of 10%, an asset turnover of 1.5 and an equity multiplier of 2.0. What is its ROE?|||Một công ty có biên lợi nhuận ròng 10%, vòng quay tài sản 1,5 và hệ số nhân vốn chủ 2,0. ROE của công ty là bao nhiêu?', options: ['15%|||15%', '7.5%|||7,5%', '30%|||30%', '20%|||20%'], correctIndex: 2, explanation: 'DuPont: 10% x 1.5 x 2.0 = 30%. 15% is the ROA (margin x turnover), before the effect of leverage.|||DuPont: 10% x 1,5 x 2,0 = 30%. 15% là ROA (biên lợi nhuận x vòng quay), trước tác động của đòn bẩy.' },
]);

const taiLieu = doc('fac201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (kèm link), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">FAC201 · 📚 Resource hub</span>
<h2>Course materials &amp; references</h2>
<p class="lead">One hub for learning financial accounting under IFRS: the official syllabus and slides, books, free official resources, video channels, tools and a self-study roadmap.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>Sign in to <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) with your FPTU account to read the official FAC201 syllabus and lecture slides.</p>
<h3>📗 Books</h3>
<ul>
<li><a href="https://openstax.org/details/books/principles-financial-accounting" target="_blank" rel="noopener">Principles of Accounting, Volume 1: Financial Accounting</a> — OpenStax: a free, peer-reviewed open textbook covering the accounting cycle, receivables, inventories, long-term assets, liabilities, equity and the statement of cash flows. Note: OpenStax follows US GAAP — where it differs from IFRS (for example LIFO, terminology such as common stock, some measurement rules), follow the lessons and the IFRS standards.</li>
<li><a href="https://www.wiley.com/" target="_blank" rel="noopener">Intermediate Accounting: IFRS Edition</a> — Kieso, Weygandt &amp; Warfield (Wiley): the standard IFRS-based reference for every topic in this course; the shorter <em>Financial Accounting with IFRS</em> by Weygandt, Kimmel &amp; Kieso suits a first reading. Search for the titles on the publisher’s site.</li>
</ul>
<h3>🌐 Free official resources</h3>
<ul>
<li><a href="https://www.ifrs.org/issued-standards/list-of-standards/" target="_blank" rel="noopener">IFRS Foundation — list of standards</a> — a page for every IAS and IFRS with its summary; the standards themselves can be read after free registration.</li>
<li><a href="https://www.ifrs.org/projects/completed-projects/2018/conceptual-framework/" target="_blank" rel="noopener">Conceptual Framework 2018</a> — the IASB’s project page for the framework studied in lesson 1.1.</li>
<li><a href="https://www.ifrs.org/issued-standards/list-of-standards/ifrs-15-revenue-from-contracts-with-customers/" target="_blank" rel="noopener">IFRS 15 Revenue from Contracts with Customers</a> — the official page for the five-step model of Part 2.</li>
<li><a href="https://mof.gov.vn/" target="_blank" rel="noopener">Ministry of Finance of Vietnam</a> — the official source for Vietnamese accounting regulations and the IFRS adoption roadmap; always check which documents are currently in force.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@IFRSFoundation" target="_blank" rel="noopener">IFRS Foundation</a> — official videos on new and amended standards.</li>
<li><a href="https://www.youtube.com/@Edspira" target="_blank" rel="noopener">Edspira</a> — short video lectures on accounting and finance topics, useful for revising individual lessons.</li>
<li><a href="https://www.youtube.com/@AccountingStuff" target="_blank" rel="noopener">Accounting Stuff</a> — friendly explanations of debits and credits and the financial statements.</li>
<li><a href="https://www.youtube.com/@CorporateFinanceInstitute" target="_blank" rel="noopener">Corporate Finance Institute</a> — tutorials on reading statements and ratio analysis.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.microsoft.com/en-us/microsoft-365/excel" target="_blank" rel="noopener">Microsoft Excel</a> — PV and PMT functions for bond and lease schedules, and a template for the cash flow exercise.</li>
<li><a href="https://www.google.com/sheets/about/" target="_blank" rel="noopener">Google Sheets</a> — the same functions, free and online; share your schedules with a study group.</li>
</ul>
<h3>🎯 Self-study roadmap</h3>
<ol>
<li><strong>Foundations (exam core)</strong> — the Conceptual Framework and adjusting entries (Part 1), then revenue, receivables and inventories (Part 2).</li>
<li><strong>Practise</strong> — rebuild every table in this course in a spreadsheet: the IFRS 15 allocation, the depreciation schedules and the bond amortisation, until the checks match.</li>
<li><strong>Go deeper</strong> — read the official summary of IFRS 15, IAS 16, IAS 37 and IFRS 16 on the IFRS Foundation site and compare them with the lessons.</li>
<li><strong>Apply</strong> — take a listed company’s annual report, find its accounting policies note, rebuild its operating cash flow from the indirect-method lines and compute the ratios of lesson 5.4.</li>
</ol>
<div class="callout"><span class="badge">Note</span> An original hub of real links — no copyrighted slides, standards or books are embedded. If a link moves, start from the official homepage.</div>`,
    `<span class="eyebrow">FAC201 · 📚 Trung tâm tài liệu</span>
<h2>Tài liệu tham khảo môn học</h2>
<p class="lead">Một nơi gom để học kế toán tài chính theo IFRS: giáo trình &amp; slide chính thức, sách, tài liệu miễn phí chính thống, kênh video, công cụ, và lộ trình tự học.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Đăng nhập <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) bằng tài khoản FPTU để đọc giáo trình và slide bài giảng chính thức của FAC201.</p>
<h3>📗 Sách</h3>
<ul>
<li><a href="https://openstax.org/details/books/principles-financial-accounting" target="_blank" rel="noopener">Principles of Accounting, Volume 1: Financial Accounting</a> — OpenStax: giáo trình mở miễn phí, có bình duyệt, bao quát chu trình kế toán, phải thu, hàng tồn kho, tài sản dài hạn, nợ phải trả, vốn chủ sở hữu và báo cáo lưu chuyển tiền tệ. Lưu ý: OpenStax viết theo US GAAP — chỗ nào khác IFRS (ví dụ LIFO, thuật ngữ như common stock, một số quy tắc đo lường) thì theo bài giảng và chuẩn mực IFRS.</li>
<li><a href="https://www.wiley.com/" target="_blank" rel="noopener">Intermediate Accounting: IFRS Edition</a> — Kieso, Weygandt &amp; Warfield (Wiley): sách tham khảo chuẩn theo IFRS cho mọi chủ đề của môn; cuốn ngắn hơn <em>Financial Accounting with IFRS</em> của Weygandt, Kimmel &amp; Kieso hợp để đọc lần đầu. Tra tên sách trên trang nhà xuất bản.</li>
</ul>
<h3>🌐 Tài liệu chính thức miễn phí</h3>
<ul>
<li><a href="https://www.ifrs.org/issued-standards/list-of-standards/" target="_blank" rel="noopener">IFRS Foundation — danh sách chuẩn mực</a> — mỗi IAS và IFRS có một trang kèm tóm tắt; bản thân chuẩn mực đọc được sau khi đăng ký miễn phí.</li>
<li><a href="https://www.ifrs.org/projects/completed-projects/2018/conceptual-framework/" target="_blank" rel="noopener">Khung khái niệm 2018</a> — trang dự án của IASB về khung khái niệm học ở bài 1.1.</li>
<li><a href="https://www.ifrs.org/issued-standards/list-of-standards/ifrs-15-revenue-from-contracts-with-customers/" target="_blank" rel="noopener">IFRS 15 Doanh thu từ hợp đồng với khách hàng</a> — trang chính thức của mô hình năm bước ở Phần 2.</li>
<li><a href="https://mof.gov.vn/" target="_blank" rel="noopener">Bộ Tài chính</a> — nguồn chính thức về các quy định kế toán Việt Nam và lộ trình áp dụng IFRS; luôn kiểm văn bản nào đang có hiệu lực.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@IFRSFoundation" target="_blank" rel="noopener">IFRS Foundation</a> — video chính thức về các chuẩn mực mới và sửa đổi.</li>
<li><a href="https://www.youtube.com/@Edspira" target="_blank" rel="noopener">Edspira</a> — bài giảng video ngắn về các chủ đề kế toán và tài chính, hữu ích để ôn lại từng bài.</li>
<li><a href="https://www.youtube.com/@AccountingStuff" target="_blank" rel="noopener">Accounting Stuff</a> — giải thích dễ hiểu về ghi Nợ, ghi Có và các báo cáo tài chính.</li>
<li><a href="https://www.youtube.com/@CorporateFinanceInstitute" target="_blank" rel="noopener">Corporate Finance Institute</a> — hướng dẫn đọc báo cáo và phân tích tỷ số.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.microsoft.com/en-us/microsoft-365/excel" target="_blank" rel="noopener">Microsoft Excel</a> — hàm PV và PMT cho bảng phân bổ trái phiếu và nợ thuê, và làm mẫu cho bài tập lưu chuyển tiền tệ.</li>
<li><a href="https://www.google.com/sheets/about/" target="_blank" rel="noopener">Google Sheets</a> — cùng các hàm đó, miễn phí và trực tuyến; chia sẻ bảng tính với nhóm học.</li>
</ul>
<h3>🎯 Lộ trình tự học</h3>
<ol>
<li><strong>Nền tảng (lõi thi)</strong> — Khung khái niệm và bút toán điều chỉnh (Phần 1), rồi doanh thu, phải thu và hàng tồn kho (Phần 2).</li>
<li><strong>Luyện tập</strong> — dựng lại mọi bảng trong môn trên bảng tính: phân bổ theo IFRS 15, bảng khấu hao và bảng phân bổ trái phiếu, cho tới khi các phép kiểm tra khớp.</li>
<li><strong>Đào sâu</strong> — đọc tóm tắt chính thức của IFRS 15, IAS 16, IAS 37 và IFRS 16 trên trang IFRS Foundation và đối chiếu với bài giảng.</li>
<li><strong>Vận dụng</strong> — lấy báo cáo thường niên của một công ty niêm yết, tìm thuyết minh chính sách kế toán, dựng lại dòng tiền kinh doanh từ các dòng của phương pháp gián tiếp và tính các tỷ số ở bài 5.4.</li>
</ol>
<div class="callout"><span class="badge">Lưu ý</span> Đây là trung tâm liên kết nguyên gốc — không nhúng slide, chuẩn mực hay sách có bản quyền. Link đổi thì vào trang chủ chính thức để tìm.</div>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'FAC201',
    slug: 'fac201-financial-accouting',
    title: 'Financial Accounting',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/FAC201.webp',
    shortDescription: 'Financial accounting under IFRS: the Conceptual Framework, accruals, IFRS 15 revenue, credit losses, inventories, PPE and impairment, provisions, bonds, leases, equity, cash flows and ratios. Bilingual, with worked exercises and quizzes.|||Kế toán tài chính theo IFRS: Khung khái niệm, dồn tích, doanh thu IFRS 15, tổn thất tín dụng, hàng tồn kho, TSCĐ, suy giảm giá trị, dự phòng, trái phiếu, thuê tài sản, vốn chủ, lưu chuyển tiền tệ, tỷ số. Song ngữ, có bài tập và quiz.',
    description: 'Môn <strong>FAC201 — Financial Accounting (Kế toán tài chính)</strong> (khối Quản trị Kinh doanh, kỳ 3) đi tiếp từ kỹ năng ghi sổ của ACC101 tới <strong>các quy định ghi nhận, đo lường và trình bày của Chuẩn mực Kế toán IFRS</strong>. Từ <strong>Khung khái niệm</strong> và ôn nhanh chu trình kế toán → <strong>doanh thu theo IFRS 15</strong> (mô hình 5 bước), <strong>phải thu và tổn thất tín dụng dự kiến</strong>, <strong>hàng tồn kho theo IAS 2</strong> → <strong>TSCĐ hữu hình và khấu hao</strong> (IAS 16), <strong>suy giảm giá trị</strong> (IAS 36) → <strong>dự phòng và nợ tiềm tàng</strong> (IAS 37), <strong>trái phiếu theo phương pháp lãi suất thực tế</strong>, <strong>thuê tài sản theo IFRS 16</strong> → <strong>vốn chủ sở hữu, báo cáo lưu chuyển tiền tệ</strong> (phương pháp gián tiếp) và <strong>phân tích báo cáo tài chính</strong>. Bám cấu trúc giáo trình kế toán tài chính theo IFRS chuẩn quốc tế, song ngữ Anh–Việt, mọi doanh nghiệp là giả định và mọi ví dụ số đã kiểm bằng máy, có bài tập kèm lời giải và quiz cuối mỗi phần. Phần liên hệ Việt Nam chỉ nêu định hướng chung — luôn kiểm văn bản đang có hiệu lực.',
    whatYouLearn: 'Giải thích mục tiêu, đặc tính chất lượng và năm yếu tố của báo cáo tài chính theo Khung khái niệm IFRS\nLập bút toán điều chỉnh dồn tích và đọc bộ báo cáo tài chính đầy đủ\nÁp dụng mô hình 5 bước của IFRS 15: phân bổ giá giao dịch theo giá bán riêng lẻ, ghi nhận theo thời điểm hoặc theo thời gian\nƯớc tính dự phòng tổn thất tín dụng bằng bảng tuổi nợ; tính giá hàng tồn kho theo FIFO, bình quân và nguyên tắc giá thấp hơn NRV\nTính nguyên giá, khấu hao ba phương pháp và tổn thất suy giảm giá trị theo IAS 16 và IAS 36\nPhân biệt dự phòng, nợ tiềm tàng; lập bảng phân bổ trái phiếu theo lãi suất thực tế và bảng nợ thuê IFRS 16\nGhi nhận phát hành cổ phiếu, cổ phiếu quỹ, cổ tức và tính EPS cơ bản\nLập lưu chuyển tiền từ hoạt động kinh doanh theo phương pháp gián tiếp và phân tích tỷ số thanh khoản, đòn bẩy, sinh lời',
    requirements: 'Nên học trước ACC101 — Principles of Accounting (ghi sổ kép, bảng cân đối thử)\nBiết giá trị thời gian của tiền ở mức cơ bản (giá trị hiện tại, niên kim) — học song song hoặc sau FIN202 đều được\nBảng tính (Excel, Google Sheets) để dựng lại các bảng khấu hao, phân bổ và lưu chuyển tiền tệ',
  },
  sections: [
    { title: '📚 Course materials|||📚 Tài liệu tham khảo', description: 'Giáo trình & slide trên FLM, sách, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Course introduction|||Giới thiệu môn học', description: 'Kế toán tài chính, IASB và IFRS, bộ báo cáo tài chính đầy đủ, lộ trình môn.', lessons: [intro] },
    { title: 'Part 1 — The Conceptual Framework & the accounting cycle|||Phần 1 — Khung khái niệm & chu trình kế toán', description: 'Mục tiêu, đặc tính chất lượng, năm yếu tố, ghi nhận và đo lường; bút toán điều chỉnh.', lessons: [c1, c2, c2q] },
    { title: 'Part 2 — Revenue, receivables & inventories|||Phần 2 — Doanh thu, phải thu & hàng tồn kho', description: 'IFRS 15 mô hình 5 bước, tổn thất tín dụng dự kiến, IAS 2.', lessons: [c3, c3e, c4, c5, c5q] },
    { title: 'Part 3 — Property, plant & equipment and impairment|||Phần 3 — Tài sản cố định hữu hình & suy giảm giá trị', description: 'Nguyên giá, khấu hao, mô hình đánh giá lại, IAS 36.', lessons: [c6, c7, c7q] },
    { title: 'Part 4 — Liabilities: provisions, bonds & leases|||Phần 4 — Nợ phải trả: dự phòng, trái phiếu & thuê tài sản', description: 'IAS 37, trái phiếu theo lãi suất thực tế, IFRS 16 phía bên thuê.', lessons: [c8, c9, c9e, c10, c10q] },
    { title: 'Part 5 — Equity, cash flows & financial statement analysis|||Phần 5 — Vốn chủ sở hữu, lưu chuyển tiền tệ & phân tích báo cáo tài chính', description: 'Cổ phiếu, cổ phiếu quỹ, cổ tức, EPS, IAS 7 phương pháp gián tiếp, tỷ số.', lessons: [c11, c12, c12e, c13, c13q] },
  ],
};
