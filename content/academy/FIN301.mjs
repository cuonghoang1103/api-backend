/**
 * FIN301 — Financial Markets and Institutions (Thị trường và các định chế tài chính). Khối QTKD, kỳ 3.
 * Bám cấu trúc giáo trình chuẩn quốc tế: Frederic S. Mishkin & Stanley G. Eakins — Financial Markets
 * and Institutions (Pearson); Anthony Saunders & Marcia Millon Cornett — Financial Markets and
 * Institutions (McGraw Hill): hệ thống tài chính & thông tin bất cân xứng, đo lường lãi suất, hành vi
 * và cấu trúc lãi suất, ngân hàng trung ương, thị trường tiền tệ – trái phiếu – cổ phiếu, ngoại hối,
 * phái sinh, ngân hàng thương mại & Basel, định chế phi ngân hàng, quản lý nhà nước & khủng hoảng.
 * Song ngữ + ví dụ số (đã kiểm bằng máy; số liệu là GIẢ ĐỊNH) + 4 bài tập + quiz.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('fin301-0-1-overview', 'Course overview: how money moves through an economy|||Tổng quan: tiền vận động trong nền kinh tế như thế nào',
  'Hệ thống tài chính làm gì, vì sao cần thị trường và định chế tài chính, mối liên hệ với FIN202 và ECO121, cấu trúc năm phần của môn và cách học với số liệu minh hoạ.',
  [[
    `<span class="eyebrow">FIN301 · Lesson 0.1 · Overview</span>
<h2>Financial Markets and Institutions</h2>
<p class="lead">Every economy has people with more money than they can use productively today and people with good uses for money they do not yet have. Financial markets and financial institutions are the machinery that moves funds from the first group to the second — and when that machinery breaks, the whole economy suffers.</p>
<h3>Why this course matters</h3>
<ul>
<li><strong>Interest rates</strong> affect every decision to save, borrow, invest or buy a house. You will learn how they are measured, what moves them and why rates differ across borrowers and maturities.</li>
<li><strong>Central banks</strong> steer short-term interest rates and the money supply; their decisions reach firms through banks and markets.</li>
<li><strong>Markets</strong> — money, bond, stock, foreign exchange and derivatives markets — each solve a different financing or risk problem.</li>
<li><strong>Institutions</strong> — banks, insurers, investment funds, pension funds — collect and allocate most of an economy’s savings, and they are regulated because their failure spreads.</li>
</ul>
<h3>How it connects to other courses</h3>
<table>
<tr><th>Course</th><th>What you already know</th><th>What FIN301 adds</th></tr>
<tr><td>FIN202 — Corporate finance</td><td>Time value of money, bond and stock valuation, CAPM</td><td>The markets where those securities are issued and traded, and who trades them</td></tr>
<tr><td>ECO121 — Macroeconomics</td><td>Money, inflation, monetary and fiscal policy in the aggregate</td><td>The mechanics: how central-bank tools move market rates and bank lending</td></tr>
</table>
<h3>Roadmap</h3>
<p>Part 1: the financial system and measuring interest rates · Part 2: what determines interest rates, the risk and term structure, and central banking · Part 3: money, bond and stock markets (including the Vietnamese market structure) · Part 4: foreign exchange and derivatives · Part 5: banks, other financial institutions, regulation and financial crises. The course follows the structure of standard textbooks such as Mishkin &amp; Eakins and Saunders &amp; Cornett. Every number in the examples is illustrative (assumed) and has been checked by calculation; for real rates, prices and rules, always consult current official sources.</p>
<div class="callout"><span class="badge">One idea to keep</span> A financial system exists to solve two problems: moving funds to their most productive use, and dealing with the fact that the borrower usually knows more than the lender about the project and its risks. Almost every market and institution in this course is an answer to one of those two problems.</div>`,
    `<span class="eyebrow">FIN301 · Bài 0.1 · Tổng quan</span>
<h2>Thị trường và các định chế tài chính</h2>
<p class="lead">Nền kinh tế nào cũng có những người đang có nhiều tiền hơn mức họ có thể dùng hiệu quả ngay lúc này, và những người có cách dùng tiền tốt nhưng chưa có tiền. Thị trường tài chính và định chế tài chính là bộ máy chuyển vốn từ nhóm thứ nhất sang nhóm thứ hai — và khi bộ máy đó hỏng, cả nền kinh tế chịu hậu quả.</p>
<h3>Vì sao môn học này quan trọng</h3>
<ul>
<li><strong>Lãi suất</strong> tác động tới mọi quyết định tiết kiệm, vay, đầu tư hay mua nhà. Bạn sẽ học cách đo lãi suất, điều gì làm nó thay đổi và vì sao lãi suất khác nhau giữa các người vay và các kỳ hạn.</li>
<li><strong>Ngân hàng trung ương</strong> điều hành lãi suất ngắn hạn và cung tiền; quyết định của họ đến với doanh nghiệp thông qua ngân hàng và thị trường.</li>
<li><strong>Các thị trường</strong> — thị trường tiền tệ, trái phiếu, cổ phiếu, ngoại hối và phái sinh — mỗi thị trường giải một bài toán tài trợ vốn hoặc quản lý rủi ro khác nhau.</li>
<li><strong>Các định chế</strong> — ngân hàng, công ty bảo hiểm, quỹ đầu tư, quỹ hưu trí — thu gom và phân bổ phần lớn tiết kiệm của nền kinh tế, và bị quản lý chặt vì sự đổ vỡ của chúng lan truyền.</li>
</ul>
<h3>Liên hệ với các môn khác</h3>
<table>
<tr><th>Môn</th><th>Điều bạn đã biết</th><th>FIN301 bổ sung</th></tr>
<tr><td>FIN202 — Tài chính doanh nghiệp</td><td>Giá trị thời gian của tiền, định giá trái phiếu và cổ phiếu, CAPM</td><td>Các thị trường nơi những chứng khoán đó được phát hành và giao dịch, và ai giao dịch chúng</td></tr>
<tr><td>ECO121 — Kinh tế vĩ mô</td><td>Tiền, lạm phát, chính sách tiền tệ và tài khoá ở tầm tổng thể</td><td>Cơ chế cụ thể: công cụ của ngân hàng trung ương làm thay đổi lãi suất thị trường và tín dụng ngân hàng ra sao</td></tr>
</table>
<h3>Lộ trình</h3>
<p>Phần 1: hệ thống tài chính và đo lường lãi suất · Phần 2: các nhân tố quyết định lãi suất, cấu trúc rủi ro và cấu trúc kỳ hạn, ngân hàng trung ương · Phần 3: thị trường tiền tệ, trái phiếu và cổ phiếu (kể cả cấu trúc thị trường Việt Nam) · Phần 4: ngoại hối và phái sinh · Phần 5: ngân hàng, các định chế tài chính khác, quản lý nhà nước và khủng hoảng tài chính. Môn học bám cấu trúc các giáo trình chuẩn như Mishkin &amp; Eakins và Saunders &amp; Cornett. Mọi con số trong ví dụ là số liệu minh hoạ (giả định) và đã được kiểm bằng tính toán; với lãi suất, giá cả và quy định thật, luôn tra nguồn chính thức hiện hành.</p>
<div class="callout"><span class="badge">Một ý cần giữ</span> Hệ thống tài chính tồn tại để giải hai bài toán: đưa vốn tới nơi sử dụng hiệu quả nhất, và xử lý thực tế là người đi vay thường biết nhiều hơn người cho vay về dự án và rủi ro của nó. Gần như mọi thị trường và định chế trong môn này là lời giải cho một trong hai bài toán đó.</div>`,
  ]]);

const c1 = doc('fin301-1-1-financial-system', '1.1 — The financial system and asymmetric information|||1.1 — Hệ thống tài chính và thông tin bất cân xứng',
  'Chức năng của hệ thống tài chính, tài chính trực tiếp và gián tiếp, cấu trúc thị trường (nợ/vốn, sơ cấp/thứ cấp, sở giao dịch/OTC, tiền tệ/vốn), vai trò trung gian tài chính, lựa chọn bất lợi và rủi ro đạo đức, các loại định chế tài chính.',
  [[
    `<span class="eyebrow">FIN301 · Part 1 · Lesson 1.1</span>
<h2>The financial system and asymmetric information</h2>
<h3>Two routes for funds</h3>
<p>Funds flow from <strong>lender-savers</strong> (households, firms, governments with surpluses) to <strong>borrower-spenders</strong> (firms that invest, governments with deficits, households buying homes).</p>
<ul>
<li><strong>Direct finance:</strong> borrowers sell securities (bonds, shares) directly to lenders in financial markets.</li>
<li><strong>Indirect finance:</strong> a <strong>financial intermediary</strong> — a bank, insurer or fund — takes savers’ money and lends or invests it. In most economies, intermediaries supply far more external funds to firms than securities markets do; in bank-based systems such as Vietnam’s, bank credit is the main channel.</li>
</ul>
<h3>How financial markets are classified</h3>
<table>
<tr><th>Criterion</th><th>Types</th></tr>
<tr><td>Instrument</td><td><strong>Debt</strong> (fixed payments, maturity) vs <strong>equity</strong> (residual claim, no maturity)</td></tr>
<tr><td>Stage of issue</td><td><strong>Primary</strong> (new issues, funds go to the issuer) vs <strong>secondary</strong> (resale between investors; gives liquidity and price signals)</td></tr>
<tr><td>Organisation</td><td><strong>Exchanges</strong> (central venue) vs <strong>over-the-counter</strong> (dealer networks)</td></tr>
<tr><td>Maturity</td><td><strong>Money market</strong> (original maturity of one year or less) vs <strong>capital market</strong> (more than one year: bonds and stocks)</td></tr>
</table>
<h3>Why intermediaries exist</h3>
<ol>
<li><strong>Transaction costs:</strong> economies of scale and expertise make lending cheaper per unit than for an individual saver.</li>
<li><strong>Risk sharing:</strong> intermediaries hold diversified assets and issue safe, liquid claims (deposits) — <em>asset transformation</em>.</li>
<li><strong>Asymmetric information:</strong> one party to a contract knows more than the other.</li>
</ol>
<h3>Adverse selection and moral hazard</h3>
<table>
<tr><th></th><th>Adverse selection</th><th>Moral hazard</th></tr>
<tr><td>When</td><td><strong>Before</strong> the transaction</td><td><strong>After</strong> the transaction</td></tr>
<tr><td>Problem</td><td>The borrowers most eager to borrow are often the riskiest (the “lemons problem”)</td><td>The borrower may take risks or act in ways the lender would not approve of</td></tr>
<tr><td>Remedies</td><td>Screening, credit scores, collateral, net worth, disclosure rules, private information production (banks, rating agencies)</td><td>Monitoring, restrictive covenants, collateral, requiring the owner’s own capital at risk, venture capital board seats</td></tr>
</table>
<p>Banks are good at both remedies because they build long-term relationships and see their customers’ accounts — one reason bank lending remains central everywhere. Asymmetric information also explains <strong>conflicts of interest</strong> when one firm provides several services (for example, underwriting and research).</p>
<h3>Types of financial institutions</h3>
<ul>
<li><strong>Depository institutions:</strong> commercial banks, savings institutions, credit unions (in Vietnam: commercial banks, the cooperative bank, people’s credit funds and microfinance institutions). Vietnam’s finance companies and finance leasing companies are non-bank credit institutions: they cannot take deposits from individuals and fund themselves mainly by borrowing and issuing securities, so they are closer to the finance companies in the investment-intermediary group.</li>
<li><strong>Contractual savings institutions:</strong> insurance companies and pension funds.</li>
<li><strong>Investment intermediaries:</strong> finance companies, mutual funds, money market funds.</li>
<li><strong>Securities market institutions</strong> (not intermediaries in the strict sense, because they do not pool savers’ funds to lend or invest on their behalf): investment banks, brokers and dealers (securities firms).</li>
</ul>
<div class="callout"><span class="badge">Remember</span> Adverse selection is about <em>who</em> shows up to borrow; moral hazard is about <em>what they do</em> with the money. Collateral helps with both.</div>`,
    `<span class="eyebrow">FIN301 · Phần 1 · Bài 1.1</span>
<h2>Hệ thống tài chính và thông tin bất cân xứng</h2>
<h3>Hai con đường của dòng vốn</h3>
<p>Vốn chảy từ <strong>người cho vay – tiết kiệm</strong> (hộ gia đình, doanh nghiệp, chính phủ có thặng dư) sang <strong>người đi vay – chi tiêu</strong> (doanh nghiệp đầu tư, chính phủ thâm hụt, hộ gia đình mua nhà).</p>
<ul>
<li><strong>Tài chính trực tiếp:</strong> người vay bán chứng khoán (trái phiếu, cổ phiếu) thẳng cho người cho vay trên thị trường tài chính.</li>
<li><strong>Tài chính gián tiếp:</strong> một <strong>trung gian tài chính</strong> — ngân hàng, công ty bảo hiểm, quỹ — nhận tiền của người tiết kiệm rồi cho vay hoặc đầu tư. Ở hầu hết các nền kinh tế, trung gian tài chính cung cấp vốn bên ngoài cho doanh nghiệp nhiều hơn hẳn thị trường chứng khoán; trong hệ thống dựa vào ngân hàng như Việt Nam, tín dụng ngân hàng là kênh chính.</li>
</ul>
<h3>Phân loại thị trường tài chính</h3>
<table>
<tr><th>Tiêu chí</th><th>Loại</th></tr>
<tr><td>Công cụ</td><td><strong>Nợ</strong> (khoản trả cố định, có kỳ hạn) và <strong>vốn cổ phần</strong> (quyền đòi phần còn lại, không kỳ hạn)</td></tr>
<tr><td>Giai đoạn phát hành</td><td><strong>Sơ cấp</strong> (phát hành mới, tiền về tổ chức phát hành) và <strong>thứ cấp</strong> (mua bán lại giữa nhà đầu tư; tạo thanh khoản và tín hiệu giá)</td></tr>
<tr><td>Cách tổ chức</td><td><strong>Sở giao dịch</strong> (địa điểm tập trung) và <strong>phi tập trung – OTC</strong> (mạng lưới nhà tạo lập)</td></tr>
<tr><td>Kỳ hạn</td><td><strong>Thị trường tiền tệ</strong> (kỳ hạn gốc từ một năm trở xuống) và <strong>thị trường vốn</strong> (trên một năm: trái phiếu, cổ phiếu)</td></tr>
</table>
<h3>Vì sao cần trung gian tài chính</h3>
<ol>
<li><strong>Chi phí giao dịch:</strong> lợi thế quy mô và chuyên môn làm chi phí cho vay trên mỗi đồng thấp hơn so với một người tiết kiệm đơn lẻ.</li>
<li><strong>Chia sẻ rủi ro:</strong> trung gian nắm danh mục tài sản đa dạng và phát hành các khoản nợ an toàn, thanh khoản cao (tiền gửi) — gọi là <em>chuyển hoá tài sản</em>.</li>
<li><strong>Thông tin bất cân xứng:</strong> một bên của hợp đồng biết nhiều hơn bên kia.</li>
</ol>
<h3>Lựa chọn bất lợi và rủi ro đạo đức</h3>
<table>
<tr><th></th><th>Lựa chọn bất lợi</th><th>Rủi ro đạo đức</th></tr>
<tr><td>Thời điểm</td><td><strong>Trước</strong> giao dịch</td><td><strong>Sau</strong> giao dịch</td></tr>
<tr><td>Vấn đề</td><td>Người háo hức đi vay nhất thường lại là người rủi ro nhất (“vấn đề xe hỏng – lemons”)</td><td>Người vay có thể mạo hiểm hoặc hành động theo cách người cho vay không muốn</td></tr>
<tr><td>Cách xử lý</td><td>Sàng lọc, chấm điểm tín dụng, tài sản bảo đảm, giá trị ròng, quy định công bố thông tin, sản xuất thông tin tư nhân (ngân hàng, tổ chức xếp hạng)</td><td>Giám sát, điều khoản hạn chế, tài sản bảo đảm, buộc chủ sở hữu góp vốn riêng chịu rủi ro, quỹ đầu tư mạo hiểm giữ ghế trong hội đồng quản trị</td></tr>
</table>
<p>Ngân hàng giỏi cả hai cách xử lý vì xây dựng quan hệ lâu dài và nhìn thấy tài khoản của khách hàng — một lý do khiến tín dụng ngân hàng vẫn giữ vai trò trung tâm ở mọi nơi. Thông tin bất cân xứng cũng giải thích <strong>xung đột lợi ích</strong> khi một công ty cung cấp nhiều dịch vụ (ví dụ vừa bảo lãnh phát hành vừa làm phân tích).</p>
<h3>Các loại định chế tài chính</h3>
<ul>
<li><strong>Tổ chức nhận tiền gửi:</strong> ngân hàng thương mại, tổ chức tiết kiệm, hiệp hội tín dụng (ở Việt Nam: ngân hàng thương mại, ngân hàng hợp tác xã, quỹ tín dụng nhân dân và tổ chức tài chính vi mô). Công ty tài chính và công ty cho thuê tài chính ở Việt Nam là tổ chức tín dụng phi ngân hàng: chúng không được nhận tiền gửi của cá nhân và huy động vốn chủ yếu bằng đi vay và phát hành giấy tờ có giá, nên gần với nhóm công ty tài chính trong trung gian đầu tư hơn.</li>
<li><strong>Tổ chức tiết kiệm theo hợp đồng:</strong> công ty bảo hiểm và quỹ hưu trí.</li>
<li><strong>Trung gian đầu tư:</strong> công ty tài chính, quỹ tương hỗ (quỹ mở), quỹ thị trường tiền tệ.</li>
<li><strong>Định chế của thị trường chứng khoán</strong> (không phải trung gian theo nghĩa hẹp, vì không gom vốn của người tiết kiệm để cho vay hay đầu tư thay họ): ngân hàng đầu tư, nhà môi giới và nhà tự doanh (công ty chứng khoán).</li>
</ul>
<div class="callout"><span class="badge">Ghi nhớ</span> Lựa chọn bất lợi là chuyện <em>ai</em> đến vay; rủi ro đạo đức là chuyện <em>họ làm gì</em> với tiền vay. Tài sản bảo đảm giúp xử lý cả hai.</div>`,
  ]]);

const c2 = doc('fin301-1-2-measuring-interest-rates', '1.2 — Measuring interest rates: yield to maturity, returns and real rates|||1.2 — Đo lường lãi suất: lợi suất đến hạn, tỷ suất sinh lợi và lãi suất thực',
  'Bốn loại công cụ nợ (vay đơn, vay trả đều, trái phiếu coupon, trái phiếu chiết khấu), lợi suất đến hạn, lợi suất tính theo chiết khấu, phân biệt lãi suất với tỷ suất sinh lợi, rủi ro lãi suất, lãi suất danh nghĩa và lãi suất thực (phương trình Fisher).',
  [[
    `<span class="eyebrow">FIN301 · Part 1 · Lesson 1.2</span>
<h2>Measuring interest rates</h2>
<p class="lead">The most accurate measure of an interest rate is the <strong>yield to maturity (YTM)</strong>: the rate that makes the present value of a debt instrument’s payments equal to its price today. (Present value was covered in FIN202; here we apply it to market instruments.)</p>
<h3>Four types of credit market instrument</h3>
<pre><code>Simple loan: borrow 100, repay 110 in one year
    100 = 110 / (1 + i)                    →  i = 10%
Fixed-payment loan: 100,000 over 10 years at 7%, equal annual payments
    payment = 100,000 x 0.07 / (1 − 1.07^−10) = 14,237.75
One-year coupon bond: face 1,000, coupon 60, price 980
    980 = 1,060 / (1 + i)                  →  i = 8.16%
One-year discount (zero-coupon) bond: face 1,000, price 950
    i = (1,000 − 950) / 950                →  i = 5.26%</code></pre>
<p>Key facts: when a coupon bond is priced at par, YTM equals the coupon rate; <strong>price and YTM move in opposite directions</strong>; and a coupon rate above the YTM means the bond sells above par.</p>
<h3>Yield on a discount basis</h3>
<p>Money-market dealers traditionally quote Treasury bills on a <strong>discount basis</strong>:</p>
<pre><code>i(db) = (Face − Price) / Face x 360 / days to maturity
One-year bill, face 1,000, price 950, 365 days:
i(db) = 50 / 1,000 x 360 / 365 = 4.93%   (vs YTM 5.26%)</code></pre>
<p>The discount yield <strong>understates</strong> the true yield for two reasons: it divides by face value rather than price, and it uses a 360-day year. It still moves in the same direction as YTM, so it is useful for reading changes. Exercise 1 converts it into a bond-equivalent yield.</p>
<h3>Interest rate ≠ rate of return</h3>
<pre><code>Return R = (Coupon + P(t+1) − P(t)) / P(t) = current yield + capital gain rate
Buy a 10-year, 10% coupon bond at par (1,000). One year later it has 9 years left.
  If market rates rise to 12%: price = 893.44 → R = (100 − 106.56) / 1,000 = −0.66%
  If market rates fall to 8%:  price = 1,124.94 → R = (100 + 124.94) / 1,000 = +22.49%</code></pre>
<p>Only a bond whose maturity equals the holding period has a return equal to its initial yield (exactly so for a one-period holding or a zero-coupon bond; over several years, a coupon bond’s realised return also depends on the rate at which its coupons are reinvested). The longer the maturity, the larger the price change for a given change in rates — this is <strong>interest-rate risk</strong>, and it is why long-term bonds are not “safe” even when default risk is zero.</p>
<h3>Nominal vs real interest rates</h3>
<p>The <strong>real interest rate</strong> adjusts for expected inflation. The <strong>Fisher equation</strong> states i = r + π<sup>e</sup>, so r ≈ i − π<sup>e</sup>. With a nominal rate of 7% and expected inflation of 4%, the real rate is about 3% (exactly 1.07 / 1.04 − 1 = 2.88%). Real rates, not nominal ones, drive incentives: a low real rate encourages borrowing and discourages lending. Inflation-indexed bonds let markets observe real rates directly.</p>
<div class="callout"><span class="badge">Watch out</span> A negative real rate is possible even with a positive nominal rate — savers then lose purchasing power while borrowers gain.</div>`,
    `<span class="eyebrow">FIN301 · Phần 1 · Bài 1.2</span>
<h2>Đo lường lãi suất</h2>
<p class="lead">Thước đo chính xác nhất của lãi suất là <strong>lợi suất đến hạn (YTM)</strong>: mức lãi suất làm cho giá trị hiện tại của các khoản thanh toán từ một công cụ nợ bằng đúng giá của nó hôm nay. (Giá trị hiện tại đã học ở FIN202; ở đây ta áp dụng cho các công cụ trên thị trường.)</p>
<h3>Bốn loại công cụ trên thị trường tín dụng</h3>
<pre><code>Khoản vay đơn: vay 100, sau một năm trả 110
    100 = 110 / (1 + i)                    →  i = 10%
Khoản vay trả đều: 100.000 trong 10 năm, lãi 7%, trả đều hằng năm
    khoản trả = 100.000 x 0,07 / (1 − 1,07^−10) = 14.237,75
Trái phiếu coupon kỳ hạn một năm: mệnh giá 1.000, coupon 60, giá 980
    980 = 1.060 / (1 + i)                  →  i = 8,16%
Trái phiếu chiết khấu (không coupon) kỳ hạn một năm: mệnh giá 1.000, giá 950
    i = (1.000 − 950) / 950                →  i = 5,26%</code></pre>
<p>Những điều cốt lõi: khi trái phiếu coupon có giá bằng mệnh giá, YTM bằng lãi suất coupon; <strong>giá và YTM biến động ngược chiều</strong>; lãi suất coupon cao hơn YTM thì trái phiếu bán trên mệnh giá.</p>
<h3>Lợi suất tính theo chiết khấu</h3>
<p>Trên thị trường tiền tệ, nhà giao dịch theo truyền thống niêm yết tín phiếu kho bạc theo <strong>lợi suất chiết khấu</strong>:</p>
<pre><code>i(ck) = (Mệnh giá − Giá) / Mệnh giá x 360 / số ngày đến hạn
Tín phiếu một năm, mệnh giá 1.000, giá 950, 365 ngày:
i(ck) = 50 / 1.000 x 360 / 365 = 4,93%   (so với YTM 5,26%)</code></pre>
<p>Lợi suất chiết khấu <strong>thấp hơn</strong> lợi suất thật vì hai lẽ: chia cho mệnh giá thay vì giá mua, và dùng năm 360 ngày. Nó vẫn biến động cùng chiều với YTM nên hữu ích khi đọc sự thay đổi. Bài tập 1 sẽ quy đổi nó sang lợi suất tương đương trái phiếu.</p>
<h3>Lãi suất ≠ tỷ suất sinh lợi</h3>
<pre><code>Tỷ suất sinh lợi R = (Coupon + P(t+1) − P(t)) / P(t) = lợi suất hiện hành + tỷ lệ lãi vốn
Mua trái phiếu 10 năm, coupon 10%, theo mệnh giá (1.000). Một năm sau còn 9 năm.
  Nếu lãi suất thị trường tăng lên 12%: giá = 893,44 → R = (100 − 106,56) / 1.000 = −0,66%
  Nếu lãi suất thị trường giảm còn 8%:  giá = 1.124,94 → R = (100 + 124,94) / 1.000 = +22,49%</code></pre>
<p>Chỉ trái phiếu có kỳ hạn bằng đúng thời gian nắm giữ mới cho tỷ suất sinh lợi bằng lợi suất ban đầu (đúng tuyệt đối khi nắm giữ một kỳ hoặc với trái phiếu không coupon; nắm giữ nhiều năm thì tỷ suất sinh lợi thực hiện của trái phiếu coupon còn phụ thuộc lãi suất tái đầu tư các khoản coupon). Kỳ hạn càng dài, giá thay đổi càng mạnh khi lãi suất thay đổi cùng một mức — đó là <strong>rủi ro lãi suất</strong>, và là lý do trái phiếu dài hạn không “an toàn” kể cả khi rủi ro vỡ nợ bằng 0.</p>
<h3>Lãi suất danh nghĩa và lãi suất thực</h3>
<p><strong>Lãi suất thực</strong> điều chỉnh theo lạm phát kỳ vọng. <strong>Phương trình Fisher</strong>: i = r + π<sup>e</sup>, nên r ≈ i − π<sup>e</sup>. Với lãi suất danh nghĩa 7% và lạm phát kỳ vọng 4%, lãi suất thực khoảng 3% (chính xác 1,07 / 1,04 − 1 = 2,88%). Chính lãi suất thực, không phải danh nghĩa, quyết định động cơ: lãi suất thực thấp khuyến khích đi vay và làm nản lòng người cho vay. Trái phiếu chỉ số hoá theo lạm phát giúp thị trường quan sát trực tiếp lãi suất thực.</p>
<div class="callout"><span class="badge">Cẩn thận</span> Lãi suất thực có thể âm ngay cả khi lãi suất danh nghĩa dương — lúc đó người gửi tiết kiệm mất sức mua còn người đi vay được lợi.</div>`,
  ]]);

const c2e = doc('fin301-1-3-exercise', 'Exercise 1 — Treasury bill yields|||Bài tập 1 — lợi suất tín phiếu kho bạc',
  'Bài tập: tính lợi suất chiết khấu, lợi suất tương đương trái phiếu và lãi suất năm thực tế của tín phiếu kho bạc 182 ngày; tìm giá tín phiếu 91 ngày từ lợi suất chiết khấu niêm yết; kèm lời giải.',
  [[
    `<span class="eyebrow">FIN301 · Part 1 · Exercise 1</span>
<h2>Exercise 1 — what does a Treasury bill really yield?</h2>
<div class="callout"><span class="badge">Problem</span> Illustrative numbers, using the US money-market convention. (a) A 182-day Treasury bill with a face value of $10,000 is bought for $9,750. Compute its discount yield. (b) Compute its bond-equivalent yield. (c) Compute its effective annual rate if the proceeds could be reinvested at the same rate. (d) A 91-day bill is quoted at a 5.00% discount yield. Find its price and its bond-equivalent yield.</div>
<h3>Worked solution</h3>
<pre><code class="language-text">Formulas
  discount yield        i(db) = (F − P) / F x 360 / n
  bond-equivalent yield i(be) = (F − P) / P x 365 / n
  effective annual rate EAR   = (F / P)^(365 / n) − 1

(a) i(db) = (10,000 − 9,750) / 10,000 x 360 / 182 = 0.025 x 1.9780 = 4.95%
(b) i(be) = 250 / 9,750 x 365 / 182               = 0.025641 x 2.0055 = 5.14%
(c) EAR   = (10,000 / 9,750)^(365 / 182) − 1      = 5.21%

(d) P = F x (1 − i(db) x n / 360) = 10,000 x (1 − 0.05 x 91 / 360) = $9,873.61
    i(be) = 126.39 / 9,873.61 x 365 / 91 = 5.13%</code></pre>
<p><strong>Why:</strong> the same bill shows three different numbers. The discount yield (4.95%) is the lowest because it divides the $250 gain by face value and uses a 360-day year; the bond-equivalent yield (5.14%) divides by the price actually paid and uses 365 days, so it can be compared with coupon-bond yields; the EAR (5.21%) adds compounding. Always compare yields on the same basis. Conventions differ by market — in Vietnam, the State Treasury may issue Treasury bills (issuance has been infrequent in recent years), while SBV bills are the main short-term bill in open market operations, so check the current auction announcements and the pricing convention they state.</p>`,
    `<span class="eyebrow">FIN301 · Phần 1 · Bài tập 1</span>
<h2>Bài tập 1 — tín phiếu kho bạc thật sự sinh lợi bao nhiêu?</h2>
<div class="callout"><span class="badge">Đề</span> Số liệu minh hoạ, theo quy ước thị trường tiền tệ Mỹ. (a) Một tín phiếu kho bạc kỳ hạn 182 ngày, mệnh giá 10.000 $, được mua với giá 9.750 $. Tính lợi suất chiết khấu. (b) Tính lợi suất tương đương trái phiếu. (c) Tính lãi suất năm thực tế nếu tiền thu về có thể tái đầu tư với cùng mức lãi. (d) Một tín phiếu 91 ngày được niêm yết lợi suất chiết khấu 5,00%. Tìm giá và lợi suất tương đương trái phiếu của nó.</div>
<h3>Lời giải</h3>
<pre><code class="language-text">Công thức
  lợi suất chiết khấu           i(ck) = (F − P) / F x 360 / n
  lợi suất tương đương trái phiếu i(td) = (F − P) / P x 365 / n
  lãi suất năm thực tế          EAR   = (F / P)^(365 / n) − 1

(a) i(ck) = (10.000 − 9.750) / 10.000 x 360 / 182 = 0,025 x 1,9780 = 4,95%
(b) i(td) = 250 / 9.750 x 365 / 182               = 0,025641 x 2,0055 = 5,14%
(c) EAR   = (10.000 / 9.750)^(365 / 182) − 1      = 5,21%

(d) P = F x (1 − i(ck) x n / 360) = 10.000 x (1 − 0,05 x 91 / 360) = 9.873,61 $
    i(td) = 126,39 / 9.873,61 x 365 / 91 = 5,13%</code></pre>
<p><strong>Vì sao:</strong> cùng một tín phiếu cho ra ba con số khác nhau. Lợi suất chiết khấu (4,95%) thấp nhất vì chia khoản chênh lệch 250 $ cho mệnh giá và dùng năm 360 ngày; lợi suất tương đương trái phiếu (5,14%) chia cho giá thực trả và dùng 365 ngày nên so sánh được với lợi suất trái phiếu coupon; EAR (5,21%) tính thêm lãi kép. Luôn so sánh lợi suất trên cùng một cơ sở. Quy ước khác nhau giữa các thị trường — ở Việt Nam, Kho bạc Nhà nước có thể phát hành tín phiếu kho bạc (những năm gần đây rất thưa), còn tín phiếu NHNN là loại tín phiếu ngắn hạn chính trong nghiệp vụ thị trường mở, nên hãy kiểm các thông báo đấu thầu hiện hành và quy ước tính giá ghi trong đó.</p>`,
  ]]);

const c2q = quiz('fin301-quiz-1', 'Quiz 1 — Financial system & interest rates|||Quiz 1 — Hệ thống tài chính & lãi suất', [
  { id: 'q1', question: 'Adverse selection in financial markets refers to…|||Lựa chọn bất lợi trên thị trường tài chính là…', options: ['borrowers taking extra risks after they receive a loan|||người vay mạo hiểm hơn sau khi đã nhận khoản vay', 'the riskiest borrowers being the most eager to seek loans, before the transaction takes place|||những người vay rủi ro nhất lại háo hức tìm khoản vay nhất, trước khi giao dịch diễn ra', 'the high transaction costs faced by small savers|||chi phí giao dịch cao mà người tiết kiệm nhỏ phải chịu', 'central banks setting interest rates too low|||ngân hàng trung ương đặt lãi suất quá thấp'], correctIndex: 1, explanation: 'Adverse selection happens before the deal; risk-taking after the loan is moral hazard.|||Lựa chọn bất lợi xảy ra trước giao dịch; mạo hiểm sau khi vay là rủi ro đạo đức.' },
  { id: 'q2', question: 'A one-year discount bond with a face value of 1,000 sells for 960. Its yield to maturity is about…|||Một trái phiếu chiết khấu kỳ hạn một năm, mệnh giá 1.000, có giá 960. Lợi suất đến hạn xấp xỉ…', options: ['3.95%|||3,95%', '4.00%|||4,00%', '9.60%|||9,60%', '4.17%|||4,17%'], correctIndex: 3, explanation: 'YTM = (1,000 − 960) / 960 = 4.17%. 4.00% divides by face value and 3.95% is the discount-basis yield.|||YTM = (1.000 − 960) / 960 = 4,17%. 4,00% là chia cho mệnh giá, còn 3,95% là lợi suất chiết khấu.' },
  { id: 'q3', question: 'The nominal interest rate is 8% and expected inflation is 5%. The real interest rate is approximately…|||Lãi suất danh nghĩa là 8% và lạm phát kỳ vọng là 5%. Lãi suất thực xấp xỉ…', options: ['3%|||3%', '13%|||13%', '1.6%|||1,6%', '−3%|||−3%'], correctIndex: 0, explanation: 'Fisher equation: r ≈ i − expected inflation = 8% − 5% = 3% (exactly 1.08 / 1.05 − 1 = 2.86%).|||Phương trình Fisher: r ≈ i − lạm phát kỳ vọng = 8% − 5% = 3% (chính xác 1,08 / 1,05 − 1 = 2,86%).' },
]);

const c3 = doc('fin301-2-1-interest-rate-behavior', '2.1 — The behaviour of interest rates|||2.1 — Hành vi của lãi suất',
  'Lý thuyết cầu tài sản, khung cung – cầu trái phiếu (vốn vay), các nhân tố làm dịch chuyển cung và cầu, hiệu ứng Fisher, lãi suất theo chu kỳ kinh doanh, khung ưa thích thanh khoản của Keynes và bốn hiệu ứng khi cung tiền tăng.',
  [[
    `<span class="eyebrow">FIN301 · Part 2 · Lesson 2.1</span>
<h2>The behaviour of interest rates</h2>
<p class="lead">Interest rates are prices, so they move with supply and demand. Two equivalent frameworks explain them: the <strong>bond market (loanable funds)</strong> framework and the <strong>liquidity preference</strong> framework.</p>
<h3>What makes people want to hold an asset</h3>
<p>The theory of asset demand says the quantity demanded of an asset rises with the holder’s <strong>wealth</strong>, with the asset’s <strong>expected return</strong> relative to alternatives and with its <strong>liquidity</strong>, and falls with its <strong>risk</strong> relative to alternatives.</p>
<h3>The bond market: supply and demand</h3>
<p>Plot bond price (or, inversely, the interest rate) against quantity. Buyers of bonds are lenders — bond demand is the <strong>supply of loanable funds</strong>; issuers of bonds are borrowers — bond supply is the <strong>demand for loanable funds</strong>. Illustrative case: a one-year discount bond with a face value of 1,000 trades at 950 (i = 5.26%). If bond demand falls and the price drops to 940, the interest rate rises to 60 / 940 = 6.38%.</p>
<table>
<tr><th>Shifts in bond <strong>demand</strong></th><th>Demand</th><th>Interest rate</th></tr>
<tr><td>Wealth rises (expansion)</td><td>↑</td><td>↓</td></tr>
<tr><td>Expected future interest rates rise (expected capital loss)</td><td>↓</td><td>↑</td></tr>
<tr><td>Expected inflation rises (lower real return)</td><td>↓</td><td>↑</td></tr>
<tr><td>Bonds become riskier relative to other assets</td><td>↓</td><td>↑</td></tr>
<tr><td>Bonds become more liquid</td><td>↑</td><td>↓</td></tr>
<tr><th>Shifts in bond <strong>supply</strong></th><th>Supply</th><th>Interest rate</th></tr>
<tr><td>Expected profitability of investment rises (expansion)</td><td>↑</td><td>↑</td></tr>
<tr><td>Expected inflation rises (lower real cost of borrowing)</td><td>↑</td><td>↑</td></tr>
<tr><td>Government budget deficit rises</td><td>↑</td><td>↑</td></tr>
</table>
<h3>Two applications</h3>
<ul>
<li><strong>The Fisher effect:</strong> when expected inflation rises, bond demand falls and bond supply rises at the same time, so the nominal interest rate rises. This is why countries with high inflation have high nominal rates.</li>
<li><strong>The business cycle:</strong> in an expansion both curves shift right; historically the supply effect tends to dominate, so interest rates tend to be <em>procyclical</em> — rising in booms and falling in recessions.</li>
</ul>
<h3>Liquidity preference: supply and demand for money</h3>
<p>Keynes framed the same question as a choice between holding money (which earns little or no interest) and bonds. Money demand falls as the interest rate rises (the opportunity cost of holding money); the central bank largely controls money supply. Money demand rises with <strong>income</strong> and with the <strong>price level</strong>.</p>
<p>When the money supply increases, four effects compete:</p>
<ol>
<li><strong>Liquidity effect</strong> — more money, lower interest rate (immediate).</li>
<li><strong>Income effect</strong> — more money stimulates income, which raises money demand and rates.</li>
<li><strong>Price-level effect</strong> — a higher price level raises money demand and rates.</li>
<li><strong>Expected-inflation effect</strong> — faster money growth raises expected inflation and rates (Fisher effect).</li>
</ol>
<p>Whether rates end up lower or higher depends on the relative size and speed of these effects — which is why an easy monetary policy lowers short-term rates quickly but may not lower long-term rates if markets expect inflation.</p>
<div class="callout"><span class="badge">Method</span> For any news, ask two questions: does it shift bond demand, bond supply or both? Then read the new equilibrium price — and remember the interest rate moves the opposite way.</div>`,
    `<span class="eyebrow">FIN301 · Phần 2 · Bài 2.1</span>
<h2>Hành vi của lãi suất</h2>
<p class="lead">Lãi suất là giá cả, nên nó biến động theo cung và cầu. Hai khung phân tích tương đương giải thích lãi suất: khung <strong>thị trường trái phiếu (vốn vay)</strong> và khung <strong>ưa thích thanh khoản</strong>.</p>
<h3>Điều gì khiến người ta muốn nắm giữ một tài sản</h3>
<p>Lý thuyết cầu tài sản cho biết lượng cầu một tài sản tăng khi <strong>của cải</strong> của người nắm giữ tăng, khi <strong>lợi nhuận kỳ vọng</strong> của tài sản đó tăng so với các lựa chọn khác và khi <strong>tính thanh khoản</strong> của nó tăng; lượng cầu giảm khi <strong>rủi ro</strong> của nó tăng so với các lựa chọn khác.</p>
<h3>Thị trường trái phiếu: cung và cầu</h3>
<p>Vẽ giá trái phiếu (hay ngược lại, lãi suất) theo lượng. Người mua trái phiếu là người cho vay — cầu trái phiếu chính là <strong>cung vốn vay</strong>; người phát hành trái phiếu là người đi vay — cung trái phiếu chính là <strong>cầu vốn vay</strong>. Tình huống minh hoạ: trái phiếu chiết khấu một năm mệnh giá 1.000 đang có giá 950 (i = 5,26%). Nếu cầu trái phiếu giảm và giá xuống 940, lãi suất tăng lên 60 / 940 = 6,38%.</p>
<table>
<tr><th>Dịch chuyển <strong>cầu</strong> trái phiếu</th><th>Cầu</th><th>Lãi suất</th></tr>
<tr><td>Của cải tăng (kinh tế mở rộng)</td><td>↑</td><td>↓</td></tr>
<tr><td>Lãi suất tương lai kỳ vọng tăng (kỳ vọng lỗ vốn)</td><td>↓</td><td>↑</td></tr>
<tr><td>Lạm phát kỳ vọng tăng (lợi nhuận thực thấp hơn)</td><td>↓</td><td>↑</td></tr>
<tr><td>Trái phiếu rủi ro hơn so với tài sản khác</td><td>↓</td><td>↑</td></tr>
<tr><td>Trái phiếu thanh khoản hơn</td><td>↑</td><td>↓</td></tr>
<tr><th>Dịch chuyển <strong>cung</strong> trái phiếu</th><th>Cung</th><th>Lãi suất</th></tr>
<tr><td>Khả năng sinh lời kỳ vọng của đầu tư tăng (kinh tế mở rộng)</td><td>↑</td><td>↑</td></tr>
<tr><td>Lạm phát kỳ vọng tăng (chi phí vay thực thấp hơn)</td><td>↑</td><td>↑</td></tr>
<tr><td>Thâm hụt ngân sách chính phủ tăng</td><td>↑</td><td>↑</td></tr>
</table>
<h3>Hai ứng dụng</h3>
<ul>
<li><strong>Hiệu ứng Fisher:</strong> khi lạm phát kỳ vọng tăng, cầu trái phiếu giảm đồng thời cung trái phiếu tăng, nên lãi suất danh nghĩa tăng. Đây là lý do các nước lạm phát cao có lãi suất danh nghĩa cao.</li>
<li><strong>Chu kỳ kinh doanh:</strong> khi kinh tế mở rộng, cả hai đường dịch sang phải; theo quan sát lịch sử, tác động phía cung thường lấn át, nên lãi suất có xu hướng <em>thuận chu kỳ</em> — tăng khi kinh tế bùng nổ và giảm khi suy thoái.</li>
</ul>
<h3>Ưa thích thanh khoản: cung và cầu tiền</h3>
<p>Keynes đặt cùng câu hỏi dưới dạng lựa chọn giữa nắm giữ tiền (sinh lãi rất ít hoặc không sinh lãi) và trái phiếu. Cầu tiền giảm khi lãi suất tăng (chi phí cơ hội của việc giữ tiền); cung tiền phần lớn do ngân hàng trung ương kiểm soát. Cầu tiền tăng theo <strong>thu nhập</strong> và theo <strong>mức giá</strong>.</p>
<p>Khi cung tiền tăng, bốn hiệu ứng cạnh tranh nhau:</p>
<ol>
<li><strong>Hiệu ứng thanh khoản</strong> — nhiều tiền hơn, lãi suất giảm (tức thời).</li>
<li><strong>Hiệu ứng thu nhập</strong> — tiền tăng kích thích thu nhập, làm tăng cầu tiền và lãi suất.</li>
<li><strong>Hiệu ứng mức giá</strong> — mức giá cao hơn làm tăng cầu tiền và lãi suất.</li>
<li><strong>Hiệu ứng lạm phát kỳ vọng</strong> — tiền tăng nhanh hơn làm tăng lạm phát kỳ vọng và lãi suất (hiệu ứng Fisher).</li>
</ol>
<p>Lãi suất cuối cùng thấp hơn hay cao hơn phụ thuộc vào độ lớn và tốc độ tương đối của các hiệu ứng này — vì thế chính sách tiền tệ nới lỏng làm lãi suất ngắn hạn giảm nhanh nhưng có thể không làm lãi suất dài hạn giảm nếu thị trường kỳ vọng lạm phát.</p>
<div class="callout"><span class="badge">Phương pháp</span> Với mỗi tin tức, hỏi hai câu: nó làm dịch chuyển cầu trái phiếu, cung trái phiếu hay cả hai? Rồi đọc giá cân bằng mới — và nhớ rằng lãi suất đi theo chiều ngược lại.</div>`,
  ]]);

const c4 = doc('fin301-2-2-risk-term-structure', '2.2 — The risk and term structure of interest rates|||2.2 — Cấu trúc rủi ro và cấu trúc kỳ hạn của lãi suất',
  'Vì sao trái phiếu cùng kỳ hạn có lãi suất khác nhau (rủi ro vỡ nợ, thanh khoản, thuế), phần bù rủi ro, xếp hạng tín nhiệm; đường cong lợi suất, ba thực tế thực nghiệm, lý thuyết kỳ vọng, thị trường phân cách và phần bù thanh khoản, có ví dụ số.',
  [[
    `<span class="eyebrow">FIN301 · Part 2 · Lesson 2.2</span>
<h2>The risk and term structure of interest rates</h2>
<h3>Risk structure: same maturity, different rates</h3>
<ul>
<li><strong>Default risk.</strong> Investors demand a <strong>risk premium</strong> — the spread over a default-free government bond of the same maturity. When the economy weakens, investors move to safety (“flight to quality”) and spreads widen.</li>
<li><strong>Liquidity.</strong> Bonds that are harder to sell quickly without a price cut must offer higher yields.</li>
<li><strong>Income taxes.</strong> Tax-exempt bonds can pay lower yields. In the US, interest on most municipal bonds is exempt from federal income tax: a 4% tax-free municipal bond is worth as much to an investor in a 35% bracket as a taxable bond yielding 4% / (1 − 0.35) = 6.15%.</li>
</ul>
<h3>Credit ratings</h3>
<table>
<tr><th>Moody’s</th><th>S&amp;P and Fitch</th><th>Meaning</th></tr>
<tr><td>Aaa, Aa</td><td>AAA, AA</td><td>Highest and high quality</td></tr>
<tr><td>A, Baa</td><td>A, BBB</td><td>Upper and lower medium grade — still <strong>investment grade</strong></td></tr>
<tr><td>Ba, B</td><td>BB, B</td><td><strong>Speculative</strong> (“junk”, high-yield)</td></tr>
<tr><td>Caa, Ca, C</td><td>CCC, CC, C, D</td><td>Highly speculative to in default</td></tr>
</table>
<p>A rating is an opinion about default risk, not a guarantee; rating agencies are paid by issuers, a conflict of interest that proved costly in the 2007–2009 crisis (Part 5).</p>
<h3>Term structure: same risk, different maturities</h3>
<p>A <strong>yield curve</strong> plots yields on bonds with the same risk, liquidity and tax treatment against maturity. It can be upward-sloping, flat or inverted (downward-sloping). Three empirical facts must be explained:</p>
<ol>
<li>Rates on different maturities move together over time.</li>
<li>When short-term rates are low, the curve is more likely to slope upward; when they are high, it is more likely to be inverted.</li>
<li>The yield curve usually slopes upward.</li>
</ol>
<h3>Three theories</h3>
<table>
<tr><th>Theory</th><th>Key assumption</th><th>Explains facts</th></tr>
<tr><td><strong>Expectations theory</strong></td><td>Bonds of different maturities are perfect substitutes; the long rate is the average of expected future short rates</td><td>1 and 2, not 3</td></tr>
<tr><td><strong>Segmented markets</strong></td><td>Each maturity is a separate market; investors prefer short, less risky bonds</td><td>3, not 1 and 2</td></tr>
<tr><td><strong>Liquidity premium (preferred habitat)</strong></td><td>Bonds are substitutes but not perfect ones; long rate = average of expected short rates + a positive term premium that rises with maturity</td><td>All three</td></tr>
</table>
<pre><code>Expected one-year rates over the next five years (illustrative): 5%, 6%, 7%, 8%, 9%
Expectations theory:  2-year = (5 + 6) / 2 = 5.5%     5-year = (5+6+7+8+9) / 5 = 7.0%
Add liquidity premiums of 0.25%, 0.5%, 0.75%, 1.0% for 2- to 5-year bonds:
                      2-year = 5.75%   3-year = 6.5%   4-year = 7.25%   5-year = 8.0%
If short rates were expected to stay at 5%, the curve would still slope gently up:
                      5.0%, 5.25%, 5.5%, 5.75%, 6.0%</code></pre>
<p>Reading the curve: a steep upward slope suggests markets expect short rates to rise; a mildly upward slope may only reflect the term premium; an <strong>inverted</strong> curve suggests expected declines in short rates — historically it has often preceded recessions, though it is a signal, not a certainty.</p>
<div class="callout"><span class="badge">Remember</span> Risk structure compares bonds of the <em>same maturity</em>; term structure compares bonds of the <em>same risk</em>. Keep the two questions separate.</div>`,
    `<span class="eyebrow">FIN301 · Phần 2 · Bài 2.2</span>
<h2>Cấu trúc rủi ro và cấu trúc kỳ hạn của lãi suất</h2>
<h3>Cấu trúc rủi ro: cùng kỳ hạn, khác lãi suất</h3>
<ul>
<li><strong>Rủi ro vỡ nợ.</strong> Nhà đầu tư đòi một <strong>phần bù rủi ro</strong> — chênh lệch so với trái phiếu chính phủ không có rủi ro vỡ nợ cùng kỳ hạn. Khi kinh tế yếu đi, nhà đầu tư chuyển sang tài sản an toàn (“tìm đến chất lượng”) và chênh lệch nới rộng.</li>
<li><strong>Tính thanh khoản.</strong> Trái phiếu khó bán nhanh mà không phải giảm giá thì phải trả lợi suất cao hơn.</li>
<li><strong>Thuế thu nhập.</strong> Trái phiếu được miễn thuế có thể trả lợi suất thấp hơn. Ở Mỹ, lãi của phần lớn trái phiếu chính quyền địa phương được miễn thuế thu nhập liên bang: với nhà đầu tư chịu thuế suất 35%, trái phiếu địa phương miễn thuế 4% tương đương trái phiếu chịu thuế có lợi suất 4% / (1 − 0,35) = 6,15%.</li>
</ul>
<h3>Xếp hạng tín nhiệm</h3>
<table>
<tr><th>Moody’s</th><th>S&amp;P và Fitch</th><th>Ý nghĩa</th></tr>
<tr><td>Aaa, Aa</td><td>AAA, AA</td><td>Chất lượng cao nhất và cao</td></tr>
<tr><td>A, Baa</td><td>A, BBB</td><td>Trung bình khá và trung bình — vẫn thuộc <strong>hạng đầu tư</strong></td></tr>
<tr><td>Ba, B</td><td>BB, B</td><td><strong>Đầu cơ</strong> (“trái phiếu rác”, lợi suất cao)</td></tr>
<tr><td>Caa, Ca, C</td><td>CCC, CC, C, D</td><td>Đầu cơ cao tới đang vỡ nợ</td></tr>
</table>
<p>Xếp hạng là ý kiến về rủi ro vỡ nợ, không phải lời bảo đảm; tổ chức xếp hạng được chính tổ chức phát hành trả phí, một xung đột lợi ích đã gây hậu quả nặng nề trong khủng hoảng 2007–2009 (Phần 5).</p>
<h3>Cấu trúc kỳ hạn: cùng rủi ro, khác kỳ hạn</h3>
<p><strong>Đường cong lợi suất</strong> biểu diễn lợi suất của các trái phiếu có cùng rủi ro, thanh khoản và đối xử thuế theo kỳ hạn. Nó có thể dốc lên, nằm ngang hoặc đảo ngược (dốc xuống). Có ba thực tế thực nghiệm cần giải thích:</p>
<ol>
<li>Lãi suất các kỳ hạn khác nhau biến động cùng nhau theo thời gian.</li>
<li>Khi lãi suất ngắn hạn thấp, đường cong dễ dốc lên; khi lãi suất ngắn hạn cao, đường cong dễ đảo ngược.</li>
<li>Đường cong lợi suất thường dốc lên.</li>
</ol>
<h3>Ba lý thuyết</h3>
<table>
<tr><th>Lý thuyết</th><th>Giả định chính</th><th>Giải thích được</th></tr>
<tr><td><strong>Lý thuyết kỳ vọng</strong></td><td>Trái phiếu các kỳ hạn là hàng thay thế hoàn hảo; lãi suất dài hạn bằng trung bình các lãi suất ngắn hạn kỳ vọng</td><td>Thực tế 1 và 2, không giải thích được 3</td></tr>
<tr><td><strong>Thị trường phân cách</strong></td><td>Mỗi kỳ hạn là một thị trường riêng; nhà đầu tư thích trái phiếu ngắn hạn, ít rủi ro</td><td>Thực tế 3, không giải thích được 1 và 2</td></tr>
<tr><td><strong>Phần bù thanh khoản (môi trường ưa thích)</strong></td><td>Trái phiếu là hàng thay thế nhưng không hoàn hảo; lãi suất dài hạn = trung bình lãi suất ngắn hạn kỳ vọng + phần bù kỳ hạn dương, tăng theo kỳ hạn</td><td>Cả ba</td></tr>
</table>
<pre><code>Lãi suất một năm kỳ vọng trong năm năm tới (minh hoạ): 5%, 6%, 7%, 8%, 9%
Lý thuyết kỳ vọng:  2 năm = (5 + 6) / 2 = 5,5%     5 năm = (5+6+7+8+9) / 5 = 7,0%
Cộng phần bù thanh khoản 0,25%, 0,5%, 0,75%, 1,0% cho trái phiếu 2 đến 5 năm:
                    2 năm = 5,75%   3 năm = 6,5%   4 năm = 7,25%   5 năm = 8,0%
Nếu lãi suất ngắn hạn được kỳ vọng giữ ở 5%, đường cong vẫn dốc lên nhẹ:
                    5,0%, 5,25%, 5,5%, 5,75%, 6,0%</code></pre>
<p>Đọc đường cong: dốc lên mạnh gợi ý thị trường kỳ vọng lãi suất ngắn hạn tăng; dốc lên nhẹ có thể chỉ phản ánh phần bù kỳ hạn; đường cong <strong>đảo ngược</strong> gợi ý lãi suất ngắn hạn được kỳ vọng giảm — trong lịch sử nó thường xuất hiện trước các cuộc suy thoái, nhưng đó là tín hiệu chứ không phải điều chắc chắn.</p>
<div class="callout"><span class="badge">Ghi nhớ</span> Cấu trúc rủi ro so sánh trái phiếu <em>cùng kỳ hạn</em>; cấu trúc kỳ hạn so sánh trái phiếu <em>cùng rủi ro</em>. Tách bạch hai câu hỏi này.</div>`,
  ]]);

const c4e = doc('fin301-2-3-exercise', 'Exercise 2 — forward rates from the yield curve|||Bài tập 2 — suy lãi suất kỳ hạn từ đường cong lợi suất',
  'Bài tập: từ lãi suất giao ngay 1, 2 và 3 năm suy ra lãi suất kỳ hạn một năm theo lý thuyết kỳ vọng (công thức chính xác và gần đúng), rồi điều chỉnh theo lý thuyết phần bù thanh khoản; kèm lời giải.',
  [[
    `<span class="eyebrow">FIN301 · Part 2 · Exercise 2</span>
<h2>Exercise 2 — what does the yield curve expect?</h2>
<div class="callout"><span class="badge">Problem</span> Illustrative spot rates on government zero-coupon bonds (annual compounding): 1-year 4.0%, 2-year 5.0%, 3-year 5.5%. (a) Under the expectations theory, what one-year rate is expected one year from now? Give the exact and the approximate answer. (b) What one-year rate is expected two years from now? (c) Now assume the liquidity premium theory with a 0.4% premium on the 2-year bond. What one-year rate does the market expect next year?</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) Investing two years at the 2-year rate must equal rolling over two 1-year bonds:
      (1.05)^2 = (1.04) x (1 + f)
      1 + f = 1.1025 / 1.04 = 1.060096  →  f = 6.01%
    Approximation (arithmetic average):  5.0 = (4.0 + f) / 2  →  f = 2 x 5.0 − 4.0 = 6.0%

(b) (1.055)^3 = (1.05)^2 x (1 + f2)
      1 + f2 = 1.174241 / 1.1025 = 1.065071  →  f2 = 6.51%
    Approximation: 3 x 5.5 − 2 x 5.0 = 6.5%

(c) Liquidity premium theory:  i(2) = (i(1) + expected i next year) / 2 + premium
      5.0 = (4.0 + x) / 2 + 0.4   →   x = 2 x (5.0 − 0.4) − 4.0 = 5.2%</code></pre>
<p><strong>Why:</strong> if a two-year investment and two one-year investments did not give the same expected result, investors would switch until they did — that arbitrage is the heart of the expectations theory. The implied forward rates (6.01%, then 6.51%) say the market expects short rates to rise. But part of the upward slope is a reward for bearing interest-rate risk: once a 0.4% term premium is removed, the expected one-year rate next year is only 5.2%. Reading a yield curve as pure forecasts overstates expected rate rises.</p>`,
    `<span class="eyebrow">FIN301 · Phần 2 · Bài tập 2</span>
<h2>Bài tập 2 — đường cong lợi suất đang kỳ vọng điều gì?</h2>
<div class="callout"><span class="badge">Đề</span> Lãi suất giao ngay minh hoạ của trái phiếu chính phủ không coupon (ghép lãi hằng năm): 1 năm 4,0%, 2 năm 5,0%, 3 năm 5,5%. (a) Theo lý thuyết kỳ vọng, lãi suất một năm được kỳ vọng sau một năm nữa là bao nhiêu? Cho đáp số chính xác và gần đúng. (b) Lãi suất một năm được kỳ vọng sau hai năm nữa là bao nhiêu? (c) Giờ giả sử lý thuyết phần bù thanh khoản với phần bù 0,4% cho trái phiếu 2 năm. Thị trường kỳ vọng lãi suất một năm của năm sau là bao nhiêu?</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) Đầu tư hai năm theo lãi suất 2 năm phải bằng đầu tư nối tiếp hai trái phiếu 1 năm:
      (1,05)^2 = (1,04) x (1 + f)
      1 + f = 1,1025 / 1,04 = 1,060096  →  f = 6,01%
    Gần đúng (trung bình cộng):  5,0 = (4,0 + f) / 2  →  f = 2 x 5,0 − 4,0 = 6,0%

(b) (1,055)^3 = (1,05)^2 x (1 + f2)
      1 + f2 = 1,174241 / 1,1025 = 1,065071  →  f2 = 6,51%
    Gần đúng: 3 x 5,5 − 2 x 5,0 = 6,5%

(c) Lý thuyết phần bù thanh khoản:  i(2) = (i(1) + lãi suất kỳ vọng năm sau) / 2 + phần bù
      5,0 = (4,0 + x) / 2 + 0,4   →   x = 2 x (5,0 − 0,4) − 4,0 = 5,2%</code></pre>
<p><strong>Vì sao:</strong> nếu một khoản đầu tư hai năm và hai khoản đầu tư một năm nối tiếp không cho cùng kết quả kỳ vọng, nhà đầu tư sẽ chuyển đổi cho tới khi chúng bằng nhau — cơ chế kinh doanh chênh lệch đó là cốt lõi của lý thuyết kỳ vọng. Các lãi suất kỳ hạn ngầm định (6,01%, rồi 6,51%) cho thấy thị trường kỳ vọng lãi suất ngắn hạn tăng. Nhưng một phần độ dốc là phần thưởng cho việc chịu rủi ro lãi suất: khi bỏ phần bù kỳ hạn 0,4%, lãi suất một năm kỳ vọng cho năm sau chỉ còn 5,2%. Đọc đường cong lợi suất như dự báo thuần tuý sẽ phóng đại mức tăng lãi suất kỳ vọng.</p>`,
  ]]);

const c5 = doc('fin301-2-4-central-banking', '2.4 — Central banks and monetary policy|||2.4 — Ngân hàng trung ương và chính sách tiền tệ',
  'Chức năng ngân hàng trung ương, Cục Dự trữ Liên bang Mỹ và Ngân hàng Nhà nước Việt Nam, quá trình cung tiền và số nhân tiền, công cụ thông thường và phi truyền thống, mục tiêu và quy tắc Taylor, các kênh truyền dẫn chính sách tiền tệ; liên hệ ECO121.',
  [[
    `<span class="eyebrow">FIN301 · Part 2 · Lesson 2.4</span>
<h2>Central banks and monetary policy</h2>
<p class="lead">In ECO121 you saw monetary policy as shifts in aggregate demand. Here we open the machine: how a central bank changes bank reserves, market interest rates and credit.</p>
<h3>What a central bank does</h3>
<ul>
<li>Issues the currency and acts as the <strong>bank of banks</strong> (banks hold reserves at the central bank and settle payments through it).</li>
<li>Acts as <strong>lender of last resort</strong> to prevent bank panics.</li>
<li>Conducts <strong>monetary policy</strong>, and in many countries supervises banks.</li>
</ul>
<p><strong>United States:</strong> the Federal Reserve System consists of the Board of Governors, twelve regional Federal Reserve Banks and the Federal Open Market Committee (FOMC), which sets a target range for the federal funds rate. <strong>Vietnam:</strong> the State Bank of Vietnam (SBV) is a ministry-level agency of the Government; it issues the currency, conducts monetary policy, manages the exchange rate, acts as lender of last resort and supervises credit institutions. Unlike the Fed, it is not independent of the Government.</p>
<h3>The money supply process</h3>
<p>The monetary base MB = currency in circulation + bank reserves. Banks lend out part of their deposits, and loans return as new deposits, so the money supply is a multiple of the base:</p>
<pre><code>Simple deposit multiplier = 1 / required reserve ratio
  rr = 10%: an extra 100 of reserves can support at most 1,000 of new deposits
Realistic money multiplier m = (1 + c) / (rr + e + c)
  c = currency/deposits 0.20, e = excess reserves/deposits 0.02, rr = 0.10
  m = 1.20 / 0.32 = 3.75  →  an extra 100 of base raises M1 by 375</code></pre>
<p>The public (through c) and banks (through e) also affect the money supply, so the central bank controls it only imperfectly — one reason most central banks now target an interest rate rather than a money quantity.</p>
<h3>Policy tools</h3>
<table>
<tr><th>Tool</th><th>How it works</th><th>Vietnamese counterpart (check current SBV rules)</th></tr>
<tr><td>Open market operations</td><td>Buying securities adds reserves and lowers short-term rates; selling does the reverse. The most used tool: flexible, precise, easily reversed</td><td>Repo purchases of valuable papers; issuing SBV bills to absorb liquidity</td></tr>
<tr><td>Discount / lending facilities</td><td>The rate at which banks borrow from the central bank; a ceiling for market rates and a lender-of-last-resort channel</td><td>Refinancing rate and the overnight lending rate in interbank electronic payments (the upper bound of the interbank rate corridor); the lower rediscount rate is often described as the lower bound</td></tr>
<tr><td>Reserve requirements</td><td>Share of deposits banks must hold as reserves; changes are powerful but blunt</td><td>Required reserve ratios</td></tr>
<tr><td>Interest on reserves</td><td>Sets a floor under market rates</td><td>The SBV pays a low rate on required reserves in VND but no interest on excess reserves, so this does not act as a floor</td></tr>
</table>
<p>After 2008 many central banks added <strong>nonconventional tools</strong>: large-scale asset purchases (quantitative easing), forward guidance about future policy and, in some economies, negative policy rates. The SBV has also used administrative tools such as credit-growth targets for individual banks.</p>
<h3>Goals, rules and transmission</h3>
<p>Goals include price stability (often an explicit inflation target), high employment, economic growth and financial and exchange-rate stability. The <strong>Taylor rule</strong> is a benchmark for the policy rate:</p>
<pre><code>policy rate = inflation + equilibrium real rate + 0.5 x (inflation − target) + 0.5 x output gap
inflation 3%, real rate 2%, target 2%, output gap +1%:  3 + 2 + 0.5 + 0.5 = 6%</code></pre>
<p>Policy reaches the economy through several <strong>transmission channels</strong>: interest rates (cost of borrowing for investment and housing), the exchange rate (net exports), asset prices (wealth and Tobin’s q) and the credit channel (bank lending and borrowers’ balance sheets).</p>
<div class="callout"><span class="badge">Connect</span> A central bank directly controls only very short-term rates and reserves. Long-term rates also depend on expectations and term premiums (lesson 2.2) — which is why central banks care so much about their credibility.</div>`,
    `<span class="eyebrow">FIN301 · Phần 2 · Bài 2.4</span>
<h2>Ngân hàng trung ương và chính sách tiền tệ</h2>
<p class="lead">Ở ECO121 bạn thấy chính sách tiền tệ như sự dịch chuyển của tổng cầu. Ở đây ta mở bộ máy ra: ngân hàng trung ương làm thay đổi dự trữ ngân hàng, lãi suất thị trường và tín dụng như thế nào.</p>
<h3>Ngân hàng trung ương làm gì</h3>
<ul>
<li>Phát hành tiền và là <strong>ngân hàng của các ngân hàng</strong> (ngân hàng gửi dự trữ tại ngân hàng trung ương và thanh toán qua đó).</li>
<li>Là <strong>người cho vay cuối cùng</strong> để ngăn hoảng loạn ngân hàng.</li>
<li>Thực thi <strong>chính sách tiền tệ</strong>, và ở nhiều nước còn giám sát ngân hàng.</li>
</ul>
<p><strong>Mỹ:</strong> Hệ thống Dự trữ Liên bang (Fed) gồm Hội đồng Thống đốc, mười hai Ngân hàng Dự trữ Liên bang khu vực và Uỷ ban Thị trường Mở Liên bang (FOMC), cơ quan đặt khung mục tiêu cho lãi suất quỹ liên bang. <strong>Việt Nam:</strong> Ngân hàng Nhà nước Việt Nam (NHNN) là cơ quan ngang bộ của Chính phủ; NHNN phát hành tiền, thực thi chính sách tiền tệ, quản lý tỷ giá, là người cho vay cuối cùng và giám sát các tổ chức tín dụng. Khác Fed, NHNN không độc lập với Chính phủ.</p>
<h3>Quá trình cung ứng tiền</h3>
<p>Tiền cơ sở MB = tiền mặt lưu hành + dự trữ của ngân hàng. Ngân hàng cho vay một phần tiền gửi, khoản vay quay lại thành tiền gửi mới, nên cung tiền là bội số của tiền cơ sở:</p>
<pre><code>Số nhân tiền gửi giản đơn = 1 / tỷ lệ dự trữ bắt buộc
  rr = 10%: thêm 100 dự trữ có thể tạo tối đa 1.000 tiền gửi mới
Số nhân tiền thực tế m = (1 + c) / (rr + e + c)
  c = tiền mặt/tiền gửi 0,20, e = dự trữ dư thừa/tiền gửi 0,02, rr = 0,10
  m = 1,20 / 0,32 = 3,75  →  thêm 100 tiền cơ sở làm M1 tăng 375</code></pre>
<p>Công chúng (qua c) và ngân hàng (qua e) cũng tác động tới cung tiền, nên ngân hàng trung ương chỉ kiểm soát được nó một cách không hoàn hảo — một lý do khiến phần lớn ngân hàng trung ương ngày nay nhắm mục tiêu lãi suất thay vì lượng tiền.</p>
<h3>Công cụ chính sách</h3>
<table>
<tr><th>Công cụ</th><th>Cơ chế</th><th>Tương ứng ở Việt Nam (kiểm quy định hiện hành của NHNN)</th></tr>
<tr><td>Nghiệp vụ thị trường mở</td><td>Mua chứng khoán bơm thêm dự trữ và hạ lãi suất ngắn hạn; bán thì ngược lại. Công cụ dùng nhiều nhất: linh hoạt, chính xác, dễ đảo ngược</td><td>Mua giấy tờ có giá có kỳ hạn (repo); phát hành tín phiếu NHNN để hút thanh khoản</td></tr>
<tr><td>Cho vay chiết khấu / cửa sổ cho vay</td><td>Lãi suất ngân hàng vay từ ngân hàng trung ương; là trần cho lãi suất thị trường và kênh cho vay cuối cùng</td><td>Lãi suất tái cấp vốn và lãi suất cho vay qua đêm trong thanh toán điện tử liên ngân hàng (trần của hành lang lãi suất liên ngân hàng); lãi suất tái chiết khấu, thấp hơn, thường được mô tả là sàn</td></tr>
<tr><td>Dự trữ bắt buộc</td><td>Tỷ lệ tiền gửi ngân hàng phải giữ làm dự trữ; thay đổi có tác động mạnh nhưng thô</td><td>Tỷ lệ dự trữ bắt buộc</td></tr>
<tr><td>Trả lãi dự trữ</td><td>Tạo sàn cho lãi suất thị trường</td><td>NHNN trả lãi suất thấp cho tiền gửi dự trữ bắt buộc bằng VND nhưng không trả lãi cho phần vượt dự trữ bắt buộc, nên khoản lãi này không tạo sàn</td></tr>
</table>
<p>Sau năm 2008 nhiều ngân hàng trung ương bổ sung <strong>công cụ phi truyền thống</strong>: mua tài sản quy mô lớn (nới lỏng định lượng), định hướng trước về chính sách tương lai và, ở một số nền kinh tế, lãi suất chính sách âm. NHNN còn dùng công cụ hành chính như chỉ tiêu tăng trưởng tín dụng cho từng ngân hàng.</p>
<h3>Mục tiêu, quy tắc và truyền dẫn</h3>
<p>Mục tiêu gồm ổn định giá cả (thường là mục tiêu lạm phát công bố rõ), việc làm cao, tăng trưởng kinh tế và ổn định tài chính, tỷ giá. <strong>Quy tắc Taylor</strong> là chuẩn tham chiếu cho lãi suất chính sách:</p>
<pre><code>lãi suất chính sách = lạm phát + lãi suất thực cân bằng + 0,5 x (lạm phát − mục tiêu) + 0,5 x chênh lệch sản lượng
lạm phát 3%, lãi suất thực 2%, mục tiêu 2%, chênh lệch sản lượng +1%:  3 + 2 + 0,5 + 0,5 = 6%</code></pre>
<p>Chính sách đến với nền kinh tế qua nhiều <strong>kênh truyền dẫn</strong>: lãi suất (chi phí vay để đầu tư, mua nhà), tỷ giá (xuất khẩu ròng), giá tài sản (của cải và hệ số q của Tobin) và kênh tín dụng (cho vay ngân hàng và bảng cân đối của người vay).</p>
<div class="callout"><span class="badge">Liên hệ</span> Ngân hàng trung ương chỉ kiểm soát trực tiếp lãi suất rất ngắn hạn và dự trữ. Lãi suất dài hạn còn phụ thuộc kỳ vọng và phần bù kỳ hạn (bài 2.2) — vì thế ngân hàng trung ương rất coi trọng uy tín của mình.</div>`,
  ]]);

const c5q = quiz('fin301-quiz-2', 'Quiz 2 — Interest rates & monetary policy|||Quiz 2 — Lãi suất & chính sách tiền tệ', [
  { id: 'q1', question: 'Expected inflation rises. In the bond market framework, what happens to the nominal interest rate?|||Lạm phát kỳ vọng tăng. Theo khung thị trường trái phiếu, lãi suất danh nghĩa thay đổi thế nào?', options: ['It falls, because bond demand rises|||Giảm, vì cầu trái phiếu tăng', 'It stays the same, because the real rate is unchanged|||Không đổi, vì lãi suất thực không đổi', 'It rises, because bond demand falls and bond supply rises|||Tăng, vì cầu trái phiếu giảm và cung trái phiếu tăng', 'It falls, because the central bank must cut rates|||Giảm, vì ngân hàng trung ương buộc phải hạ lãi suất'], correctIndex: 2, explanation: 'This is the Fisher effect: lenders want less of a bond whose real return has fallen, and borrowers want to issue more.|||Đây là hiệu ứng Fisher: người cho vay muốn nắm ít trái phiếu hơn vì lợi nhuận thực đã giảm, còn người vay muốn phát hành nhiều hơn.' },
  { id: 'q2', question: 'The one-year rate is 3% today and the market expects the one-year rate next year to be 5%. Under the expectations theory, the two-year rate is about…|||Lãi suất một năm hôm nay là 3% và thị trường kỳ vọng lãi suất một năm của năm sau là 5%. Theo lý thuyết kỳ vọng, lãi suất hai năm xấp xỉ…', options: ['3%|||3%', '4%|||4%', '5%|||5%', '8%|||8%'], correctIndex: 1, explanation: 'The long rate is the average of expected short rates: (3% + 5%) / 2 = 4%.|||Lãi suất dài hạn bằng trung bình các lãi suất ngắn hạn kỳ vọng: (3% + 5%) / 2 = 4%.' },
  { id: 'q3', question: 'Which central bank action increases bank reserves and tends to lower short-term interest rates?|||Hành động nào của ngân hàng trung ương làm tăng dự trữ ngân hàng và có xu hướng hạ lãi suất ngắn hạn?', options: ['Raising the required reserve ratio|||Tăng tỷ lệ dự trữ bắt buộc', 'Issuing central bank bills to banks|||Phát hành tín phiếu ngân hàng trung ương cho các ngân hàng', 'Raising the refinancing (discount) rate|||Tăng lãi suất tái cấp vốn (chiết khấu)', 'An open market purchase of government securities|||Mua trái phiếu chính phủ trên thị trường mở'], correctIndex: 3, explanation: 'Buying securities pays banks with new reserves. The other three actions tighten liquidity.|||Mua chứng khoán là trả cho ngân hàng bằng dự trữ mới. Ba hành động còn lại đều thắt chặt thanh khoản.' },
]);

const c6 = doc('fin301-3-1-money-markets', '3.1 — The money market|||3.1 — Thị trường tiền tệ',
  'Đặc điểm và vai trò của thị trường tiền tệ, người tham gia, các công cụ: tín phiếu kho bạc, vốn liên ngân hàng (quỹ liên bang), hợp đồng mua lại (repo), chứng chỉ tiền gửi chuyển nhượng được, thương phiếu, hối phiếu được ngân hàng chấp nhận; lãi suất tham chiếu; ví dụ tính lãi suất repo.',
  [[
    `<span class="eyebrow">FIN301 · Part 3 · Lesson 3.1</span>
<h2>The money market</h2>
<p class="lead">The money market trades debt instruments with original maturities of one year or less. It is a wholesale market: large transactions, borrowers with high credit quality, very low default risk and high liquidity. Its purpose is not long-term financing but <strong>managing liquidity</strong> — parking temporary surplus cash and covering temporary shortfalls.</p>
<h3>Who participates</h3>
<ul>
<li><strong>Governments / treasuries</strong> — borrow short-term to smooth tax receipts and spending.</li>
<li><strong>Central banks</strong> — conduct open market operations here.</li>
<li><strong>Commercial banks</strong> — lend and borrow reserves, issue certificates of deposit, hold bills as liquid assets.</li>
<li><strong>Corporations</strong> — invest idle cash and issue commercial paper.</li>
<li><strong>Money market funds and securities firms</strong> — pool small investors’ money and act as dealers.</li>
</ul>
<h3>The main instruments</h3>
<table>
<tr><th>Instrument</th><th>Issuer / nature</th><th>Key features</th></tr>
<tr><td><strong>Treasury bills</strong></td><td>Central government</td><td>Sold at a discount by auction; almost no default risk; the most liquid instrument and the benchmark for short-term rates</td></tr>
<tr><td><strong>Interbank loans</strong> (US: federal funds)</td><td>Banks lending reserves to each other</td><td>Mostly overnight and unsecured; the rate is the main operating target of monetary policy</td></tr>
<tr><td><strong>Repurchase agreements (repos)</strong></td><td>Sale of securities with an agreement to buy them back</td><td>In effect a short-term loan collateralised by securities; the lender’s side is a reverse repo; a haircut protects the lender</td></tr>
<tr><td><strong>Negotiable certificates of deposit</strong></td><td>Banks</td><td>Large-denomination time deposits that can be sold before maturity</td></tr>
<tr><td><strong>Commercial paper</strong></td><td>Large, highly rated firms and finance companies</td><td>Unsecured short-term notes, usually backed by bank credit lines; in the US typically no longer than 270 days, which avoids registration with the SEC</td></tr>
<tr><td><strong>Banker’s acceptances</strong></td><td>A firm’s time draft guaranteed by its bank</td><td>Used in international trade; the bank’s guarantee replaces the firm’s credit</td></tr>
</table>
<h3>Pricing a repo</h3>
<pre><code>A dealer sells securities for 9,990,000 and agrees to buy them back in 7 days for 10,000,000.
repo rate = (repurchase price − sale price) / sale price x 360 / days
          = 10,000 / 9,990,000 x 360 / 7 = 5.15%      (illustrative numbers)</code></pre>
<h3>Reference rates</h3>
<p>Many loans and derivatives reset against a short-term benchmark rate. For US dollars, the secured overnight financing rate (<strong>SOFR</strong>), based on actual repo transactions, replaced LIBOR, which was phased out after manipulation scandals showed the weakness of rates based on banks’ own estimates. In Vietnam, the SBV publishes average interbank rates by maturity; SBV repo purchases and SBV bills are its main open market instruments, while the State Treasury may issue Treasury bills (issuance has been infrequent in recent years) — check current auction announcements.</p>
<h3>Why rates move together</h3>
<p>Because money-market instruments are close substitutes, their yields move closely together. Spreads reflect small differences in default risk and liquidity: Treasury bills yield least, commercial paper and CDs a little more. Spreads jump when trust between banks breaks down — in 2007–2008 interbank lending froze, and central banks had to act as lenders of last resort.</p>
<div class="callout"><span class="badge">Remember</span> The money market is where the central bank’s decisions land first. A change in the policy rate shows up in interbank and repo rates within hours, then spreads to deposit and lending rates.</div>`,
    `<span class="eyebrow">FIN301 · Phần 3 · Bài 3.1</span>
<h2>Thị trường tiền tệ</h2>
<p class="lead">Thị trường tiền tệ giao dịch các công cụ nợ có kỳ hạn gốc từ một năm trở xuống. Đây là thị trường bán buôn: giao dịch lớn, người vay có chất lượng tín dụng cao, rủi ro vỡ nợ rất thấp và thanh khoản cao. Mục đích của nó không phải tài trợ dài hạn mà là <strong>quản lý thanh khoản</strong> — gửi tạm tiền nhàn rỗi và bù đắp thiếu hụt tạm thời.</p>
<h3>Ai tham gia</h3>
<ul>
<li><strong>Chính phủ / kho bạc</strong> — vay ngắn hạn để điều hoà thu thuế và chi tiêu.</li>
<li><strong>Ngân hàng trung ương</strong> — thực hiện nghiệp vụ thị trường mở tại đây.</li>
<li><strong>Ngân hàng thương mại</strong> — cho vay và vay dự trữ, phát hành chứng chỉ tiền gửi, giữ tín phiếu làm tài sản thanh khoản.</li>
<li><strong>Doanh nghiệp</strong> — đầu tư tiền nhàn rỗi và phát hành thương phiếu.</li>
<li><strong>Quỹ thị trường tiền tệ và công ty chứng khoán</strong> — gom tiền của nhà đầu tư nhỏ và làm nhà tạo lập thị trường.</li>
</ul>
<h3>Các công cụ chính</h3>
<table>
<tr><th>Công cụ</th><th>Tổ chức phát hành / bản chất</th><th>Đặc điểm chính</th></tr>
<tr><td><strong>Tín phiếu kho bạc</strong></td><td>Chính phủ trung ương</td><td>Bán chiết khấu qua đấu thầu; gần như không có rủi ro vỡ nợ; công cụ thanh khoản nhất và là chuẩn cho lãi suất ngắn hạn</td></tr>
<tr><td><strong>Vốn vay liên ngân hàng</strong> (Mỹ: quỹ liên bang)</td><td>Ngân hàng cho nhau vay dự trữ</td><td>Chủ yếu qua đêm và không có tài sản bảo đảm; lãi suất này là mục tiêu điều hành chính của chính sách tiền tệ</td></tr>
<tr><td><strong>Hợp đồng mua lại (repo)</strong></td><td>Bán chứng khoán kèm cam kết mua lại</td><td>Thực chất là khoản vay ngắn hạn có chứng khoán bảo đảm; phía bên cho vay là repo đảo; tỷ lệ chiết khấu tài sản (haircut) bảo vệ bên cho vay</td></tr>
<tr><td><strong>Chứng chỉ tiền gửi chuyển nhượng được</strong></td><td>Ngân hàng</td><td>Tiền gửi có kỳ hạn mệnh giá lớn, có thể bán lại trước khi đáo hạn</td></tr>
<tr><td><strong>Thương phiếu</strong></td><td>Doanh nghiệp lớn, xếp hạng cao và công ty tài chính</td><td>Giấy nợ ngắn hạn không bảo đảm, thường có hạn mức tín dụng ngân hàng hỗ trợ; ở Mỹ thường không quá 270 ngày, nhờ đó tránh phải đăng ký với SEC</td></tr>
<tr><td><strong>Hối phiếu được ngân hàng chấp nhận</strong></td><td>Hối phiếu kỳ hạn của doanh nghiệp được ngân hàng bảo đảm</td><td>Dùng trong thương mại quốc tế; bảo đảm của ngân hàng thay cho tín nhiệm của doanh nghiệp</td></tr>
</table>
<h3>Định giá một hợp đồng repo</h3>
<pre><code>Một nhà giao dịch bán chứng khoán giá 9.990.000 và cam kết mua lại sau 7 ngày với giá 10.000.000.
lãi suất repo = (giá mua lại − giá bán) / giá bán x 360 / số ngày
             = 10.000 / 9.990.000 x 360 / 7 = 5,15%      (số liệu minh hoạ)</code></pre>
<h3>Lãi suất tham chiếu</h3>
<p>Nhiều khoản vay và hợp đồng phái sinh điều chỉnh lãi suất theo một lãi suất chuẩn ngắn hạn. Với đồng đô la Mỹ, lãi suất qua đêm có bảo đảm (<strong>SOFR</strong>), dựa trên giao dịch repo thực tế, đã thay thế LIBOR — lãi suất bị loại bỏ dần sau các vụ thao túng cho thấy điểm yếu của lãi suất dựa trên ước tính của chính các ngân hàng. Ở Việt Nam, NHNN công bố lãi suất bình quân liên ngân hàng theo kỳ hạn; mua giấy tờ có giá có kỳ hạn và tín phiếu NHNN là các công cụ thị trường mở chính, còn Kho bạc Nhà nước có thể phát hành tín phiếu kho bạc (những năm gần đây rất thưa) — kiểm các thông báo đấu thầu hiện hành.</p>
<h3>Vì sao các lãi suất đi cùng nhau</h3>
<p>Vì các công cụ thị trường tiền tệ là những hàng thay thế gần của nhau, lợi suất của chúng biến động rất sát nhau. Chênh lệch phản ánh khác biệt nhỏ về rủi ro vỡ nợ và thanh khoản: tín phiếu kho bạc có lợi suất thấp nhất, thương phiếu và chứng chỉ tiền gửi cao hơn một chút. Chênh lệch tăng vọt khi niềm tin giữa các ngân hàng sụp đổ — năm 2007–2008 thị trường liên ngân hàng đóng băng, và ngân hàng trung ương phải đóng vai người cho vay cuối cùng.</p>
<div class="callout"><span class="badge">Ghi nhớ</span> Thị trường tiền tệ là nơi quyết định của ngân hàng trung ương “tiếp đất” đầu tiên. Thay đổi lãi suất chính sách hiện ra ở lãi suất liên ngân hàng và repo trong vài giờ, rồi lan sang lãi suất huy động và cho vay.</div>`,
  ]]);

const c7 = doc('fin301-3-2-bond-markets', '3.2 — The bond market|||3.2 — Thị trường trái phiếu',
  'Thị trường vốn và người tham gia, trái phiếu chính phủ (kỳ hạn, trái phiếu chỉ số lạm phát, trái phiếu chính phủ Việt Nam đấu thầu qua HNX), trái phiếu doanh nghiệp (khế ước, điều khoản hạn chế, quyền mua lại, chuyển đổi, bảo đảm), trái phiếu chính quyền địa phương, chênh lệch lợi suất.',
  [[
    `<span class="eyebrow">FIN301 · Part 3 · Lesson 3.2</span>
<h2>The bond market</h2>
<p class="lead">The capital market is where long-term funds are raised. Bonds are its largest segment in most economies: governments finance deficits and infrastructure, and firms finance expansion without giving up ownership. How to price a bond was covered in FIN202 — here the focus is on the market itself.</p>
<h3>Government bonds</h3>
<ul>
<li><strong>Central government securities</strong> carry the lowest default risk in their own currency, because the government can tax (and, ultimately, the central bank can create money). They still carry <strong>interest-rate risk</strong> and inflation risk.</li>
<li>US Treasury <em>notes</em> have maturities of 2 to 10 years and <em>bonds</em> 20 to 30 years; <strong>inflation-indexed bonds</strong> (TIPS) adjust principal to inflation, so their yield is a real rate.</li>
<li><strong>Vietnam:</strong> government bonds are issued by the State Treasury, mainly by auction organised on the Hanoi Stock Exchange (HNX), which also runs the secondary market for them. Commercial banks hold the largest share; Vietnam Social Security and insurance companies are the other major holders (shares change over time — check HNX and Ministry of Finance data). Check maturities and auction results in current HNX and State Treasury announcements.</li>
<li>Sub-national governments issue <strong>municipal</strong> bonds: general obligation bonds are backed by tax revenue; revenue bonds by the income of a specific project.</li>
</ul>
<h3>Corporate bonds: the contract matters</h3>
<table>
<tr><th>Feature</th><th>What it means for the investor</th></tr>
<tr><td>Indenture and trustee</td><td>The legal contract; a trustee monitors compliance on behalf of bondholders</td></tr>
<tr><td>Restrictive covenants</td><td>Limits on dividends, extra debt or asset sales — a tool against moral hazard (lesson 1.1)</td></tr>
<tr><td>Call provision</td><td>The issuer may repay early, usually when rates fall; investors face reinvestment risk, so callable bonds must offer a higher yield</td></tr>
<tr><td>Sinking fund</td><td>Part of the issue is retired each year, lowering default risk</td></tr>
<tr><td>Convertibility</td><td>The bond can be exchanged for shares; the option is valuable, so convertibles pay a lower yield</td></tr>
<tr><td>Security</td><td>Secured bonds are backed by specific assets; debentures are unsecured; subordinated debentures rank below other debt</td></tr>
</table>
<p>Bonds rated below Baa/BBB are <strong>high-yield (junk)</strong> bonds; some were issued that way, others are “fallen angels” downgraded after issue.</p>
<h3>Reading spreads</h3>
<pre><code>Illustrative: 5-year government bond 5.0%, 5-year BBB corporate bond 7.2%
Credit spread = 7.2% − 5.0% = 2.2 percentage points = 220 basis points
If the spread widens to 300 bp and the government yield is unchanged,
the corporate yield rises to 8.0% — and the bond’s price falls.</code></pre>
<p>Spreads widen in recessions and financial stress (flight to quality) and narrow in booms. A widening spread raises the cost of new borrowing even if the central bank has not changed its policy rate.</p>
<h3>Primary and secondary bond markets</h3>
<p>New corporate issues are sold either through a <strong>public offering</strong>, with a prospectus and disclosure, or a <strong>private placement</strong> to a limited group of professional investors, which is faster but less transparent. Most secondary trading is over-the-counter between dealers. In Vietnam, the rules on privately placed corporate bonds have been revised several times after the market turbulence of 2022 — always check the regulations currently in force before investing.</p>
<div class="callout"><span class="badge">Watch out</span> A high coupon is compensation, not a gift. Before buying a corporate bond, read the issuer’s financial statements, the collateral, the covenants and the rating (if any) — and ask how you could sell it before maturity.</div>`,
    `<span class="eyebrow">FIN301 · Phần 3 · Bài 3.2</span>
<h2>Thị trường trái phiếu</h2>
<p class="lead">Thị trường vốn là nơi huy động vốn dài hạn. Ở hầu hết các nền kinh tế, trái phiếu là mảng lớn nhất của nó: chính phủ tài trợ thâm hụt và hạ tầng, doanh nghiệp tài trợ mở rộng mà không phải chia quyền sở hữu. Cách định giá trái phiếu đã học ở FIN202 — ở đây trọng tâm là chính thị trường.</p>
<h3>Trái phiếu chính phủ</h3>
<ul>
<li><strong>Chứng khoán của chính phủ trung ương</strong> có rủi ro vỡ nợ thấp nhất khi phát hành bằng nội tệ, vì chính phủ có quyền đánh thuế (và rốt cuộc ngân hàng trung ương có thể tạo tiền). Chúng vẫn chịu <strong>rủi ro lãi suất</strong> và rủi ro lạm phát.</li>
<li>Ở Mỹ, trái phiếu kho bạc loại <em>notes</em> có kỳ hạn 2 đến 10 năm, loại <em>bonds</em> 20 đến 30 năm; <strong>trái phiếu chỉ số hoá theo lạm phát</strong> (TIPS) điều chỉnh gốc theo lạm phát nên lợi suất của chúng là lãi suất thực.</li>
<li><strong>Việt Nam:</strong> trái phiếu chính phủ do Kho bạc Nhà nước phát hành, chủ yếu qua đấu thầu tổ chức tại Sở Giao dịch Chứng khoán Hà Nội (HNX), nơi cũng vận hành thị trường thứ cấp của chúng. Ngân hàng thương mại nắm tỷ trọng lớn nhất; Bảo hiểm xã hội Việt Nam và các công ty bảo hiểm là những người nắm giữ lớn khác (cơ cấu thay đổi theo thời gian — kiểm số liệu của HNX và Bộ Tài chính). Kiểm kỳ hạn và kết quả đấu thầu trong các thông báo hiện hành của HNX và Kho bạc Nhà nước.</li>
<li>Chính quyền địa phương phát hành <strong>trái phiếu chính quyền địa phương</strong>: loại nghĩa vụ chung được bảo đảm bằng nguồn thu thuế; loại doanh thu được bảo đảm bằng thu nhập của một dự án cụ thể.</li>
</ul>
<h3>Trái phiếu doanh nghiệp: hợp đồng là then chốt</h3>
<table>
<tr><th>Đặc điểm</th><th>Ý nghĩa với nhà đầu tư</th></tr>
<tr><td>Khế ước trái phiếu và người đại diện</td><td>Hợp đồng pháp lý; người đại diện người sở hữu trái phiếu giám sát việc tuân thủ</td></tr>
<tr><td>Điều khoản hạn chế</td><td>Giới hạn chia cổ tức, vay thêm hay bán tài sản — công cụ chống rủi ro đạo đức (bài 1.1)</td></tr>
<tr><td>Quyền mua lại trước hạn</td><td>Tổ chức phát hành có thể trả sớm, thường khi lãi suất giảm; nhà đầu tư chịu rủi ro tái đầu tư, nên trái phiếu có quyền mua lại phải trả lợi suất cao hơn</td></tr>
<tr><td>Quỹ trả nợ dần</td><td>Mỗi năm mua lại một phần đợt phát hành, làm giảm rủi ro vỡ nợ</td></tr>
<tr><td>Quyền chuyển đổi</td><td>Có thể đổi trái phiếu lấy cổ phiếu; quyền này có giá trị nên trái phiếu chuyển đổi trả lợi suất thấp hơn</td></tr>
<tr><td>Tài sản bảo đảm</td><td>Trái phiếu có bảo đảm dựa trên tài sản cụ thể; trái phiếu không bảo đảm dựa trên tín nhiệm chung; trái phiếu thứ cấp được trả sau các khoản nợ khác</td></tr>
</table>
<p>Trái phiếu xếp hạng dưới Baa/BBB là trái phiếu <strong>lợi suất cao (trái phiếu rác)</strong>; có loại phát hành ngay ở mức đó, có loại là “thiên thần sa ngã” bị hạ hạng sau khi phát hành.</p>
<h3>Đọc chênh lệch lợi suất</h3>
<pre><code>Minh hoạ: trái phiếu chính phủ 5 năm 5,0%, trái phiếu doanh nghiệp hạng BBB 5 năm 7,2%
Chênh lệch tín dụng = 7,2% − 5,0% = 2,2 điểm phần trăm = 220 điểm cơ bản
Nếu chênh lệch nới lên 300 điểm cơ bản và lợi suất trái phiếu chính phủ không đổi,
lợi suất trái phiếu doanh nghiệp tăng lên 8,0% — và giá trái phiếu đó giảm.</code></pre>
<p>Chênh lệch nới rộng khi suy thoái và căng thẳng tài chính (tìm đến chất lượng) và thu hẹp khi kinh tế bùng nổ. Chênh lệch nới rộng làm tăng chi phí vay mới kể cả khi ngân hàng trung ương chưa đổi lãi suất chính sách.</p>
<h3>Thị trường trái phiếu sơ cấp và thứ cấp</h3>
<p>Trái phiếu doanh nghiệp mới được bán qua <strong>chào bán ra công chúng</strong>, có bản cáo bạch và công bố thông tin, hoặc <strong>phát hành riêng lẻ</strong> cho một nhóm hạn chế nhà đầu tư chuyên nghiệp, nhanh hơn nhưng kém minh bạch hơn. Phần lớn giao dịch thứ cấp diễn ra phi tập trung giữa các nhà tạo lập. Ở Việt Nam, quy định về trái phiếu doanh nghiệp phát hành riêng lẻ đã được sửa đổi nhiều lần sau giai đoạn thị trường biến động năm 2022 — luôn kiểm văn bản đang có hiệu lực trước khi đầu tư.</p>
<div class="callout"><span class="badge">Cẩn thận</span> Coupon cao là khoản bù đắp, không phải quà tặng. Trước khi mua trái phiếu doanh nghiệp, hãy đọc báo cáo tài chính của tổ chức phát hành, tài sản bảo đảm, các điều khoản và xếp hạng (nếu có) — và tự hỏi bạn có thể bán nó trước hạn bằng cách nào.</div>`,
  ]]);

const c8 = doc('fin301-3-3-stock-markets', '3.3 — The stock market|||3.3 — Thị trường cổ phiếu',
  'Cổ phiếu phổ thông và ưu đãi, thị trường sơ cấp (IPO, bảo lãnh phát hành), thị trường thứ cấp (sở giao dịch, OTC, lệnh thị trường và lệnh giới hạn, ký quỹ, bán khống), chỉ số giá theo giá và theo vốn hoá, giả thuyết thị trường hiệu quả; cấu trúc thị trường Việt Nam: UBCKNN, VNX, HOSE, HNX, UPCoM, VSDC.',
  [[
    `<span class="eyebrow">FIN301 · Part 3 · Lesson 3.3</span>
<h2>The stock market</h2>
<h3>What a share gives you</h3>
<p><strong>Common stock</strong> gives a residual claim on the firm’s cash flows and assets, voting rights (to elect the board) and limited liability; dividends are not promised. <strong>Preferred stock</strong> usually pays a fixed dividend with priority over common shareholders, but typically carries no vote — it behaves partly like a bond. Valuation with dividend discount models and CAPM was covered in FIN202.</p>
<h3>The primary market</h3>
<ul>
<li>An <strong>initial public offering (IPO)</strong> is a firm’s first sale of shares to the public; later issues are seasoned offerings.</li>
<li><strong>Investment banks</strong> advise on price and timing and underwrite the issue: in a <em>firm commitment</em> they buy the whole issue and resell it, bearing the price risk; in a <em>best efforts</em> deal they only sell what they can.</li>
<li>A registration and <strong>prospectus</strong> give investors the information needed to reduce adverse selection.</li>
<li>IPOs are, on average, <strong>underpriced</strong>: shares offered at 20 that close at 23 on the first day give a first-day return of 15% (illustrative). Underpricing is a cost to the issuing firm.</li>
</ul>
<h3>The secondary market</h3>
<p>Trading happens on <strong>exchanges</strong> (a central venue, today mostly electronic order matching) or <strong>over the counter</strong> through dealer networks. <strong>Brokers</strong> act as agents for investors; <strong>dealers</strong> trade from their own inventory and earn the bid–ask spread. A <em>market order</em> executes at the best available price; a <em>limit order</em> sets a maximum buy or minimum sell price. <strong>Buying on margin</strong> (borrowing part of the purchase) magnifies gains and losses; <strong>short selling</strong> (selling borrowed shares) profits from price falls, with potentially unlimited losses.</p>
<h3>Stock indices</h3>
<pre><code>Three illustrative stocks        price before → after   shares
A                                  50 → 55              100
B                                  20 → 20              500
C                                 100 → 90               50
Price-weighted index (average price): 56.67 → 55.00   change −2.94%
Value-weighted index (market cap):   20,000 → 20,000  change  0.00%
(−2.94% = 55 / (170 / 3) − 1, computed from the unrounded average 56.666…)</code></pre>
<p>A <strong>price-weighted</strong> index (such as the Dow Jones Industrial Average) is dominated by high-priced stocks: C’s 10-point fall outweighs A’s 5-point rise. A <strong>market-capitalisation-weighted</strong> index (such as the S&amp;P 500 or VN-Index) weights each firm by its size: here +500 and −500 of market value cancel out.</p>
<h3>Market efficiency</h3>
<p>The <strong>efficient market hypothesis</strong> says prices reflect available information: the weak form (past prices), the semi-strong form (all public information) and the strong form (even private information). Evidence broadly supports quick reaction to public news, alongside documented anomalies and episodes of bubbles. The practical lesson: consistently beating the market after costs is hard, which is why low-cost index funds are popular.</p>
<h3>The stock market in Vietnam</h3>
<table>
<tr><th>Body</th><th>Role</th></tr>
<tr><td>State Securities Commission (SSC, under the Ministry of Finance)</td><td>Regulator: licensing, supervision, enforcement</td></tr>
<tr><td>Vietnam Exchange (VNX)</td><td>Parent company of the two stock exchanges</td></tr>
<tr><td>Ho Chi Minh City Stock Exchange (HOSE)</td><td>Listed shares (mostly larger firms), fund certificates and ETFs, covered warrants; indices VN-Index and VN30</td></tr>
<tr><td>Hanoi Stock Exchange (HNX)</td><td>Listed shares (HNX-Index), the government bond market, the derivatives market, and UPCoM</td></tr>
<tr><td>UPCoM</td><td>Trading venue for shares of public companies not listed on HOSE or HNX; UPCoM-Index</td></tr>
<tr><td>Vietnam Securities Depository and Clearing Corporation (VSDC)</td><td>Registration, depository, clearing and settlement</td></tr>
</table>
<p>Daily price limits, trading sessions, settlement cycles and foreign ownership limits are set by regulation and change over time — check current rules on the exchanges’ and SSC’s websites.</p>
<div class="callout"><span class="badge">Remember</span> The primary market raises money for firms; the secondary market does not — but without a liquid secondary market, far fewer investors would buy in the primary market.</div>`,
    `<span class="eyebrow">FIN301 · Phần 3 · Bài 3.3</span>
<h2>Thị trường cổ phiếu</h2>
<h3>Cổ phiếu mang lại cho bạn điều gì</h3>
<p><strong>Cổ phiếu phổ thông</strong> cho quyền đòi phần còn lại đối với dòng tiền và tài sản của doanh nghiệp, quyền biểu quyết (bầu hội đồng quản trị) và trách nhiệm hữu hạn; cổ tức không được cam kết. <strong>Cổ phiếu ưu đãi</strong> thường trả cổ tức cố định và được ưu tiên hơn cổ đông phổ thông, nhưng thường không có quyền biểu quyết — nó vận động phần nào giống trái phiếu. Định giá bằng mô hình chiết khấu cổ tức và CAPM đã học ở FIN202.</p>
<h3>Thị trường sơ cấp</h3>
<ul>
<li><strong>Phát hành lần đầu ra công chúng (IPO)</strong> là lần đầu doanh nghiệp bán cổ phần cho công chúng; các lần sau là phát hành bổ sung.</li>
<li><strong>Ngân hàng đầu tư</strong> tư vấn giá, thời điểm và bảo lãnh phát hành: theo hình thức <em>cam kết chắc chắn</em> họ mua toàn bộ đợt phát hành rồi bán lại, tự chịu rủi ro giá; theo hình thức <em>cố gắng tối đa</em> họ chỉ bán được bao nhiêu hay bấy nhiêu.</li>
<li>Hồ sơ đăng ký và <strong>bản cáo bạch</strong> cung cấp thông tin để nhà đầu tư giảm lựa chọn bất lợi.</li>
<li>Tính trung bình, IPO bị <strong>định giá thấp</strong>: cổ phần chào bán giá 20 đóng cửa ngày đầu ở 23 cho tỷ suất sinh lợi ngày đầu 15% (minh hoạ). Định giá thấp là chi phí đối với doanh nghiệp phát hành.</li>
</ul>
<h3>Thị trường thứ cấp</h3>
<p>Giao dịch diễn ra trên <strong>sở giao dịch</strong> (địa điểm tập trung, ngày nay chủ yếu khớp lệnh điện tử) hoặc <strong>phi tập trung (OTC)</strong> qua mạng lưới nhà tạo lập. <strong>Nhà môi giới</strong> làm đại lý cho nhà đầu tư; <strong>nhà tự doanh (nhà tạo lập)</strong> giao dịch bằng kho hàng của chính mình và hưởng chênh lệch giá mua – bán. <em>Lệnh thị trường</em> khớp ở giá tốt nhất hiện có; <em>lệnh giới hạn</em> đặt giá mua tối đa hoặc giá bán tối thiểu. <strong>Mua ký quỹ</strong> (vay một phần tiền mua) khuếch đại cả lãi lẫn lỗ; <strong>bán khống</strong> (bán cổ phiếu đi vay) có lãi khi giá giảm, với khoản lỗ tiềm năng không giới hạn.</p>
<h3>Chỉ số chứng khoán</h3>
<pre><code>Ba cổ phiếu minh hoạ         giá trước → sau     số cổ phần
A                              50 → 55              100
B                              20 → 20              500
C                             100 → 90               50
Chỉ số tính theo giá (giá bình quân):  56,67 → 55,00   thay đổi −2,94%
Chỉ số tính theo vốn hoá:             20.000 → 20.000  thay đổi  0,00%
(−2,94% = 55 / (170 / 3) − 1, tính từ giá bình quân chưa làm tròn 56,666…)</code></pre>
<p>Chỉ số <strong>tính theo giá</strong> (như Dow Jones Industrial Average) bị chi phối bởi cổ phiếu giá cao: C giảm 10 điểm lấn át A tăng 5 điểm. Chỉ số <strong>tính theo giá trị vốn hoá</strong> (như S&amp;P 500 hay VN-Index) gán trọng số theo quy mô doanh nghiệp: ở đây +500 và −500 giá trị vốn hoá triệt tiêu nhau.</p>
<h3>Thị trường hiệu quả</h3>
<p><strong>Giả thuyết thị trường hiệu quả</strong> cho rằng giá phản ánh thông tin sẵn có: dạng yếu (giá quá khứ), dạng vừa (mọi thông tin công khai) và dạng mạnh (cả thông tin nội bộ). Bằng chứng nhìn chung ủng hộ việc giá phản ứng nhanh với tin công khai, bên cạnh các bất thường đã được ghi nhận và những giai đoạn bong bóng. Bài học thực tế: vượt thị trường một cách đều đặn sau chi phí là rất khó, vì thế các quỹ chỉ số chi phí thấp được ưa chuộng.</p>
<h3>Thị trường cổ phiếu Việt Nam</h3>
<table>
<tr><th>Tổ chức</th><th>Vai trò</th></tr>
<tr><td>Uỷ ban Chứng khoán Nhà nước (UBCKNN, thuộc Bộ Tài chính)</td><td>Cơ quan quản lý: cấp phép, giám sát, xử lý vi phạm</td></tr>
<tr><td>Sở Giao dịch Chứng khoán Việt Nam (VNX)</td><td>Công ty mẹ của hai sở giao dịch</td></tr>
<tr><td>Sở Giao dịch Chứng khoán TP. Hồ Chí Minh (HOSE)</td><td>Cổ phiếu niêm yết (chủ yếu doanh nghiệp lớn), chứng chỉ quỹ và ETF, chứng quyền có bảo đảm; chỉ số VN-Index và VN30</td></tr>
<tr><td>Sở Giao dịch Chứng khoán Hà Nội (HNX)</td><td>Cổ phiếu niêm yết (HNX-Index), thị trường trái phiếu chính phủ, thị trường phái sinh và UPCoM</td></tr>
<tr><td>UPCoM</td><td>Nơi giao dịch cổ phiếu của công ty đại chúng chưa niêm yết trên HOSE hay HNX; chỉ số UPCoM-Index</td></tr>
<tr><td>Tổng công ty Lưu ký và Bù trừ chứng khoán Việt Nam (VSDC)</td><td>Đăng ký, lưu ký, bù trừ và thanh toán</td></tr>
</table>
<p>Biên độ dao động giá trong ngày, phiên giao dịch, chu kỳ thanh toán và tỷ lệ sở hữu nước ngoài do quy định đặt ra và thay đổi theo thời gian — kiểm quy định hiện hành trên website của các sở giao dịch và UBCKNN.</p>
<div class="callout"><span class="badge">Ghi nhớ</span> Thị trường sơ cấp huy động tiền cho doanh nghiệp; thị trường thứ cấp thì không — nhưng nếu không có thị trường thứ cấp thanh khoản, sẽ có ít nhà đầu tư chịu mua trên thị trường sơ cấp hơn nhiều.</div>`,
  ]]);

const c8q = quiz('fin301-quiz-3', 'Quiz 3 — Money, bond & stock markets|||Quiz 3 — Thị trường tiền tệ, trái phiếu & cổ phiếu', [
  { id: 'q1', question: 'Economically, a repurchase agreement (repo) is best described as…|||Về bản chất kinh tế, hợp đồng mua lại (repo) được mô tả đúng nhất là…', options: ['a short-term loan collateralised by securities|||một khoản vay ngắn hạn có chứng khoán bảo đảm', 'an unsecured promissory note issued by a large firm|||một giấy nợ không bảo đảm do doanh nghiệp lớn phát hành', 'a permanent sale of government bonds|||một giao dịch bán hẳn trái phiếu chính phủ', 'a bank deposit that cannot be withdrawn early|||một khoản tiền gửi ngân hàng không được rút trước hạn'], correctIndex: 0, explanation: 'The seller receives cash now and buys the securities back later at a higher price; the difference is the interest, and the securities are the collateral. Option B describes commercial paper.|||Bên bán nhận tiền ngay và sau đó mua lại chứng khoán với giá cao hơn; phần chênh lệch là tiền lãi, còn chứng khoán là tài sản bảo đảm. Phương án B mô tả thương phiếu.' },
  { id: 'q2', question: 'On the AAA-to-D rating scale, which rating is below investment grade?|||Trên thang xếp hạng từ AAA tới D, mức nào nằm dưới hạng đầu tư?', options: ['AA|||AA', 'BBB|||BBB', 'BB|||BB', 'A|||A'], correctIndex: 2, explanation: 'Investment grade runs from AAA down to BBB; BB and below are speculative (high-yield) bonds.|||Hạng đầu tư kéo dài từ AAA xuống BBB; từ BB trở xuống là trái phiếu đầu cơ (lợi suất cao).' },
  { id: 'q3', question: 'In Vietnam, UPCoM is…|||Ở Việt Nam, UPCoM là…', options: ['the securities regulator under the Ministry of Finance|||cơ quan quản lý chứng khoán thuộc Bộ Tài chính', 'a trading venue, operated by HNX, for shares of public companies not listed on HOSE or HNX|||nơi giao dịch do HNX vận hành, dành cho cổ phiếu của công ty đại chúng chưa niêm yết trên HOSE hay HNX', 'the index of the 30 largest stocks on HOSE|||chỉ số của 30 cổ phiếu lớn nhất trên HOSE', 'the body that clears and settles securities trades|||tổ chức bù trừ và thanh toán giao dịch chứng khoán'], correctIndex: 1, explanation: 'The regulator is the SSC, the HOSE large-cap index is VN30 and clearing is done by VSDC.|||Cơ quan quản lý là UBCKNN, chỉ số cổ phiếu lớn trên HOSE là VN30, còn bù trừ do VSDC thực hiện.' },
]);

const c9 = doc('fin301-4-1-foreign-exchange', '4.1 — The foreign exchange market|||4.1 — Thị trường ngoại hối',
  'Cấu trúc thị trường ngoại hối, giao dịch giao ngay và kỳ hạn, cách đọc tỷ giá, lên giá và mất giá, tỷ giá dài hạn (quy luật một giá, ngang giá sức mua), tỷ giá ngắn hạn (cách tiếp cận tài sản, ngang giá lãi suất), ngang giá lãi suất có bảo hiểm, can thiệp của ngân hàng trung ương và cơ chế tỷ giá của Việt Nam.',
  [[
    `<span class="eyebrow">FIN301 · Part 4 · Lesson 4.1</span>
<h2>The foreign exchange market</h2>
<p class="lead">The foreign exchange (FX) market is where currencies — in practice, bank deposits denominated in different currencies — are traded. It is an over-the-counter market, dominated by large banks and dealers, and it is the largest financial market in the world by turnover.</p>
<h3>Spot and forward transactions</h3>
<ul>
<li>A <strong>spot</strong> transaction exchanges currencies almost immediately (normally within two business days) at the <strong>spot rate</strong>.</li>
<li>A <strong>forward</strong> transaction fixes today the rate for an exchange on a future date. Firms use forwards to lock in the value of future foreign-currency payments or receipts.</li>
<li>An <strong>FX swap</strong> combines a spot trade with the opposite forward trade; banks use it to manage liquidity in different currencies.</li>
</ul>
<h3>Reading a quote</h3>
<pre><code>Quote: 25,000 VND/USD  = 25,000 dong per 1 US dollar   (illustrative)
Rate moves to 25,500:
  USD appreciates:  25,500 / 25,000 − 1 = +2.00%
  VND depreciates:  25,000 / 25,500 − 1 = −1.96%</code></pre>
<p>When the domestic currency depreciates, domestic goods become cheaper abroad and foreign goods more expensive at home: exports tend to rise and imports to fall, but firms and governments with foreign-currency debt see their debt burden grow.</p>
<h3>The long run: prices</h3>
<p>The <strong>law of one price</strong> says identical traded goods should cost the same everywhere once converted into one currency. Its extension, <strong>purchasing power parity (PPP)</strong>, says exchange rates adjust to offset differences in price levels. In relative form, the currency of the higher-inflation country tends to depreciate by roughly the inflation differential: with inflation of 4% in Vietnam and 2% in the US, PPP predicts the VND/USD rate rises by about 2% a year (exactly 1.04 / 1.02 − 1 = 1.96%, i.e. the USD appreciates 1.96%), so the VND loses 1.02 / 1.04 − 1 = −1.92% of its dollar value. PPP holds only loosely because many goods are not traded and products differ. Other long-run factors: trade barriers, preferences for domestic vs foreign goods, and productivity.</p>
<h3>The short run: assets and interest parity</h3>
<p>In the short run, exchange rates are driven by the demand for assets denominated in each currency. Investors compare the domestic interest rate with the foreign rate adjusted for the expected change in the exchange rate. The <strong>interest parity condition</strong>: i<sub>D</sub> = i<sub>F</sub> − expected appreciation of the domestic currency. A higher domestic interest rate (with unchanged inflation expectations) makes domestic deposits more attractive and appreciates the currency; a rise in expected inflation does the opposite.</p>
<h3>Covered interest parity</h3>
<p>When the exchange-rate risk is removed with a forward contract, any gap from parity is a riskless arbitrage opportunity, so parity should hold closely in liquid, open markets. Even there, persistent small deviations (the cross-currency basis) have been documented since 2008, linked to limits on banks’ balance sheets; where capital controls or restrictions on foreign-currency lending apply, arbitrage may be impossible and quoted forwards can deviate further:</p>
<pre><code>F / S = (1 + i(domestic)) / (1 + i(foreign))      S and F in domestic currency per unit of foreign
The currency with the higher interest rate trades at a forward DISCOUNT.
Forward premium on the foreign currency (in %) ≈ i(domestic) − i(foreign)</code></pre>
<p>Exercise 3 applies this to VND/USD. A forward rate is therefore not a forecast of the future spot rate; it is mainly the spot rate adjusted for the interest differential.</p>
<h3>Central banks in the FX market</h3>
<p>Central banks buy or sell foreign reserves to influence the exchange rate. Selling reserves supports the domestic currency but also shrinks the monetary base, unless the central bank <em>sterilises</em> the effect with an offsetting open market operation. In Vietnam, the SBV announces a daily central exchange rate for VND/USD and a permitted trading band within which banks set their rates; check the current mechanism and band on the SBV website.</p>
<div class="callout"><span class="badge">Watch out</span> “The VND fell 2%” and “the USD rose 2%” are not the same statement — percentage changes depend on the base. Always write the quote as domestic per foreign and state which currency moved.</div>`,
    `<span class="eyebrow">FIN301 · Phần 4 · Bài 4.1</span>
<h2>Thị trường ngoại hối</h2>
<p class="lead">Thị trường ngoại hối là nơi các đồng tiền — trên thực tế là tiền gửi ngân hàng bằng các loại tiền khác nhau — được mua bán. Đây là thị trường phi tập trung, do các ngân hàng và nhà tạo lập lớn chi phối, và là thị trường tài chính lớn nhất thế giới tính theo doanh số giao dịch.</p>
<h3>Giao dịch giao ngay và kỳ hạn</h3>
<ul>
<li>Giao dịch <strong>giao ngay</strong> trao đổi tiền gần như ngay lập tức (thông thường trong vòng hai ngày làm việc) theo <strong>tỷ giá giao ngay</strong>.</li>
<li>Giao dịch <strong>kỳ hạn</strong> chốt từ hôm nay tỷ giá cho một lần trao đổi vào ngày tương lai. Doanh nghiệp dùng hợp đồng kỳ hạn để khoá giá trị các khoản phải trả hoặc phải thu bằng ngoại tệ trong tương lai.</li>
<li>Giao dịch <strong>hoán đổi ngoại tệ</strong> kết hợp một giao dịch giao ngay với một giao dịch kỳ hạn theo chiều ngược lại; ngân hàng dùng nó để quản lý thanh khoản bằng các loại tiền khác nhau.</li>
</ul>
<h3>Đọc một tỷ giá</h3>
<pre><code>Tỷ giá: 25.000 VND/USD  = 25.000 đồng cho 1 đô la Mỹ   (minh hoạ)
Tỷ giá lên 25.500:
  USD lên giá:  25.500 / 25.000 − 1 = +2,00%
  VND mất giá:  25.000 / 25.500 − 1 = −1,96%</code></pre>
<p>Khi nội tệ mất giá, hàng trong nước trở nên rẻ hơn ở nước ngoài còn hàng nước ngoài đắt hơn ở trong nước: xuất khẩu có xu hướng tăng và nhập khẩu giảm, nhưng doanh nghiệp và chính phủ có nợ bằng ngoại tệ thấy gánh nặng nợ tăng lên.</p>
<h3>Dài hạn: giá cả</h3>
<p><strong>Quy luật một giá</strong> nói hàng hoá giao thương giống hệt nhau phải có cùng giá ở mọi nơi khi quy về một đồng tiền. Mở rộng của nó, <strong>ngang giá sức mua (PPP)</strong>, nói tỷ giá điều chỉnh để bù trừ khác biệt về mức giá. Ở dạng tương đối, đồng tiền của nước có lạm phát cao hơn có xu hướng mất giá xấp xỉ bằng chênh lệch lạm phát: với lạm phát 4% ở Việt Nam và 2% ở Mỹ, PPP dự báo tỷ giá VND/USD tăng khoảng 2% mỗi năm (chính xác 1,04 / 1,02 − 1 = 1,96%, tức USD lên giá 1,96%), nên VND mất 1,02 / 1,04 − 1 = −1,92% giá trị tính bằng USD. PPP chỉ đúng một cách lỏng lẻo vì nhiều hàng hoá không giao thương được và sản phẩm khác nhau. Các nhân tố dài hạn khác: rào cản thương mại, sở thích hàng nội so với hàng ngoại, và năng suất.</p>
<h3>Ngắn hạn: tài sản và ngang giá lãi suất</h3>
<p>Trong ngắn hạn, tỷ giá do cầu đối với tài sản định danh bằng từng đồng tiền quyết định. Nhà đầu tư so sánh lãi suất trong nước với lãi suất nước ngoài đã điều chỉnh theo thay đổi tỷ giá kỳ vọng. <strong>Điều kiện ngang giá lãi suất</strong>: i<sub>D</sub> = i<sub>F</sub> − mức lên giá kỳ vọng của nội tệ. Lãi suất trong nước cao hơn (khi kỳ vọng lạm phát không đổi) làm tiền gửi trong nước hấp dẫn hơn và làm nội tệ lên giá; lạm phát kỳ vọng tăng thì tác động ngược lại.</p>
<h3>Ngang giá lãi suất có bảo hiểm</h3>
<p>Khi rủi ro tỷ giá được loại bỏ bằng hợp đồng kỳ hạn, mọi độ lệch khỏi ngang giá là một cơ hội kinh doanh chênh lệch không rủi ro, nên trên các thị trường mở và thanh khoản ngang giá được thoả mãn khá sát. Ngay cả ở đó, từ sau năm 2008 người ta vẫn ghi nhận những độ lệch nhỏ và dai dẳng (chênh lệch cơ sở tiền tệ chéo – cross-currency basis), gắn với giới hạn bảng cân đối của ngân hàng; nơi có kiểm soát vốn hoặc hạn chế cho vay ngoại tệ, việc kinh doanh chênh lệch có thể không thực hiện được và tỷ giá kỳ hạn niêm yết có thể lệch xa hơn:</p>
<pre><code>F / S = (1 + i(trong nước)) / (1 + i(nước ngoài))      S và F tính bằng nội tệ trên một đơn vị ngoại tệ
Đồng tiền có lãi suất cao hơn được giao dịch kỳ hạn ở mức CHIẾT KHẤU.
Phần bù kỳ hạn của ngoại tệ (theo %) ≈ i(trong nước) − i(nước ngoài)</code></pre>
<p>Bài tập 3 áp dụng điều này cho VND/USD. Vì vậy tỷ giá kỳ hạn không phải là dự báo tỷ giá giao ngay tương lai; về cơ bản nó là tỷ giá giao ngay được điều chỉnh theo chênh lệch lãi suất.</p>
<h3>Ngân hàng trung ương trên thị trường ngoại hối</h3>
<p>Ngân hàng trung ương mua hoặc bán dự trữ ngoại hối để tác động tới tỷ giá. Bán dự trữ giúp đỡ nội tệ nhưng cũng làm co tiền cơ sở, trừ khi ngân hàng trung ương <em>trung hoà</em> tác động đó bằng một nghiệp vụ thị trường mở ngược chiều. Ở Việt Nam, NHNN công bố hằng ngày tỷ giá trung tâm VND/USD và biên độ giao dịch cho phép, trong phạm vi đó các ngân hàng tự niêm yết tỷ giá; kiểm cơ chế và biên độ hiện hành trên website NHNN.</p>
<div class="callout"><span class="badge">Cẩn thận</span> “VND giảm 2%” và “USD tăng 2%” không phải là một câu — phần trăm thay đổi phụ thuộc vào gốc so sánh. Luôn viết tỷ giá theo dạng nội tệ trên ngoại tệ và nói rõ đồng tiền nào biến động.</div>`,
  ]]);

const c9e = doc('fin301-4-2-exercise', 'Exercise 3 — covered interest parity for VND/USD|||Bài tập 3 — ngang giá lãi suất có bảo hiểm cho VND/USD',
  'Bài tập: tính tỷ giá kỳ hạn VND/USD 1 năm và 3 tháng theo ngang giá lãi suất có bảo hiểm với lãi suất và tỷ giá giả định, xây dựng giao dịch kinh doanh chênh lệch lãi suất có bảo hiểm khi tỷ giá niêm yết lệch ngang giá, và phòng ngừa cho nhà nhập khẩu; kèm lời giải.',
  [[
    `<span class="eyebrow">FIN301 · Part 4 · Exercise 3</span>
<h2>Exercise 3 — pricing a VND/USD forward</h2>
<div class="callout"><span class="badge">Problem</span> Assumed market data (illustrative only, not real rates): spot 25,000 VND/USD; one-year interest rate on VND 6%, on USD 4%. (a) Find the one-year forward rate implied by covered interest parity. (b) Find the three-month forward rate, applying the annual rates in proportion to the period (6% x 3/12 and 4% x 3/12). (c) A bank quotes a one-year forward rate of 25,300. Show a covered interest arbitrage and its profit per USD borrowed, ignoring transaction costs. (d) A Vietnamese importer must pay USD 100,000 in one year. What VND cost can it lock in at the parity forward rate?</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) F = S x (1 + i_VND) / (1 + i_USD) = 25,000 x 1.06 / 1.04 = 25,480.77 VND/USD
    USD forward premium (in %) = 25,480.77 / 25,000 − 1 = 1.92%   (≈ 6% − 4% = 2%)
    Forward points = F − S = 25,480.77 − 25,000 = VND 480.77

(b) F(3m) = 25,000 x (1 + 0.06 x 3/12) / (1 + 0.04 x 3/12)
          = 25,000 x 1.015 / 1.010 = 25,123.76 VND/USD

(c) Quoted 25,300 &lt; parity 25,480.77  →  USD is too cheap in the forward market
    Now:      borrow USD 1 at 4%                    (owe USD 1.04 in one year)
              sell USD 1 spot                        → VND 25,000
              deposit VND 25,000 at 6%               → VND 26,500 in one year
              buy USD 1.04 forward at 25,300         (cost VND 26,312 in one year)
    In 1 year: 26,500 − 26,312 = VND 188 riskless profit per USD borrowed

(d) 100,000 x 25,480.769… = VND 2,548,076,923 fixed today   (unrounded forward rate)</code></pre>
<p><strong>Why:</strong> VND pays 2 points more interest, so buying USD for delivery in a year must cost about 2% more than buying it today — otherwise investors could borrow in one currency, lend in the other and remove the exchange-rate risk with a forward, earning a sure profit. In (c) that is exactly what happens; in open, liquid markets such arbitrage pushes the quoted forward up (and interest rates or the spot rate move) until the gap is small. Where capital controls or foreign-currency lending restrictions apply, as for VND, most participants cannot borrow USD, sell it spot and deposit VND as in (c), so arbitrage may be impossible and quoted forwards can deviate from parity. In (d) the forward does not promise the cheapest outcome — if the USD later weakens, the importer would have done better unhedged — but it removes uncertainty from the cost of goods, which is what hedging is for.</p>`,
    `<span class="eyebrow">FIN301 · Phần 4 · Bài tập 3</span>
<h2>Bài tập 3 — định giá hợp đồng kỳ hạn VND/USD</h2>
<div class="callout"><span class="badge">Đề</span> Dữ liệu thị trường giả định (chỉ để minh hoạ, không phải lãi suất thật): tỷ giá giao ngay 25.000 VND/USD; lãi suất một năm của VND 6%, của USD 4%. (a) Tìm tỷ giá kỳ hạn một năm theo ngang giá lãi suất có bảo hiểm. (b) Tìm tỷ giá kỳ hạn ba tháng, áp dụng lãi suất năm theo tỷ lệ thời gian (6% x 3/12 và 4% x 3/12). (c) Một ngân hàng niêm yết tỷ giá kỳ hạn một năm 25.300. Hãy dựng giao dịch kinh doanh chênh lệch lãi suất có bảo hiểm và tính lợi nhuận trên mỗi USD đi vay, bỏ qua chi phí giao dịch. (d) Một nhà nhập khẩu Việt Nam phải trả 100.000 USD sau một năm. Họ có thể khoá chi phí bằng VND là bao nhiêu theo tỷ giá kỳ hạn ngang giá?</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) F = S x (1 + i_VND) / (1 + i_USD) = 25.000 x 1,06 / 1,04 = 25.480,77 VND/USD
    Phần bù kỳ hạn của USD (theo %) = 25.480,77 / 25.000 − 1 = 1,92%   (≈ 6% − 4% = 2%)
    Điểm kỳ hạn = F − S = 25.480,77 − 25.000 = 480,77 VND

(b) F(3 tháng) = 25.000 x (1 + 0,06 x 3/12) / (1 + 0,04 x 3/12)
               = 25.000 x 1,015 / 1,010 = 25.123,76 VND/USD

(c) Niêm yết 25.300 &lt; ngang giá 25.480,77  →  USD kỳ hạn đang quá rẻ
    Hôm nay:      vay 1 USD lãi 4%                        (sau một năm nợ 1,04 USD)
                  bán giao ngay 1 USD                      → 25.000 VND
                  gửi 25.000 VND lãi 6%                    → 26.500 VND sau một năm
                  mua kỳ hạn 1,04 USD giá 25.300           (sau một năm tốn 26.312 VND)
    Sau 1 năm:    26.500 − 26.312 = 188 VND lợi nhuận không rủi ro trên mỗi USD đi vay

(d) 100.000 x 25.480,769… = 2.548.076.923 VND, cố định ngay từ hôm nay   (tỷ giá kỳ hạn chưa làm tròn)</code></pre>
<p><strong>Vì sao:</strong> VND trả lãi cao hơn 2 điểm, nên mua USD giao sau một năm phải đắt hơn mua hôm nay khoảng 2% — nếu không, nhà đầu tư có thể vay bằng đồng tiền này, cho vay bằng đồng tiền kia và loại bỏ rủi ro tỷ giá bằng hợp đồng kỳ hạn, thu lợi nhuận chắc chắn. Ở (c) đúng là điều đó xảy ra; trên các thị trường mở và thanh khoản, giao dịch chênh lệch như vậy đẩy tỷ giá kỳ hạn niêm yết lên (và lãi suất hoặc tỷ giá giao ngay dịch chuyển) cho tới khi độ lệch còn nhỏ. Nơi có kiểm soát vốn hoặc hạn chế cho vay ngoại tệ, như với VND, phần lớn chủ thể không thể vay USD, bán giao ngay rồi gửi VND như ở (c), nên việc kinh doanh chênh lệch có thể không thực hiện được và tỷ giá kỳ hạn niêm yết có thể lệch khỏi ngang giá. Ở (d) hợp đồng kỳ hạn không hứa kết quả rẻ nhất — nếu sau đó USD yếu đi, nhà nhập khẩu không phòng ngừa sẽ lợi hơn — nhưng nó loại bỏ sự bất định khỏi giá vốn hàng hoá, và đó chính là mục đích của phòng ngừa rủi ro.</p>`,
  ]]);

const c10 = doc('fin301-4-3-derivatives', '4.3 — Financial derivatives: forwards, futures, options and swaps|||4.3 — Công cụ phái sinh: kỳ hạn, tương lai, quyền chọn và hoán đổi',
  'Phái sinh để phòng ngừa và đầu cơ, hợp đồng kỳ hạn và hợp đồng tương lai (chuẩn hoá, ký quỹ, thanh toán bù trừ hằng ngày), quyền chọn mua và bán (phí, giá thực hiện, lãi lỗ), hoán đổi lãi suất và tiền tệ, phái sinh tín dụng; thị trường phái sinh Việt Nam.',
  [[
    `<span class="eyebrow">FIN301 · Part 4 · Lesson 4.3</span>
<h2>Financial derivatives</h2>
<p class="lead">A derivative is a contract whose payoff depends on the price of another asset — a bond, a stock index, a currency, a commodity. Derivatives do not create wealth by themselves: one side’s gain is the other side’s loss. Their value lies in <strong>transferring risk</strong> from those who want to shed it (hedgers) to those willing to bear it (speculators).</p>
<h3>Forwards and futures</h3>
<table>
<tr><th></th><th>Forward contract</th><th>Futures contract</th></tr>
<tr><td>Where traded</td><td>Over the counter, negotiated</td><td>On an exchange</td></tr>
<tr><td>Terms</td><td>Customised amount and date</td><td>Standardised contract size and delivery dates</td></tr>
<tr><td>Counterparty</td><td>The other party — default risk</td><td>The clearinghouse — default risk largely removed</td></tr>
<tr><td>Cash flows</td><td>Settled at maturity</td><td>Margin posted and gains/losses settled daily (<strong>marking to market</strong>)</td></tr>
<tr><td>Liquidity</td><td>Hard to exit</td><td>Easy to close out with an offsetting trade; few end in delivery</td></tr>
</table>
<pre><code>Marking to market (illustrative): buy (go long) 1 futures contract on 100 units at 1,000
Day 1 settlement price 1,020:  +20 x 100 = +2,000 credited to the margin account
Day 2 settlement price   985:  −35 x 100 = −3,500 debited (cumulative −1,500)</code></pre>
<p>A <strong>long hedge</strong> (buying futures) protects someone who will buy the asset later; a <strong>short hedge</strong> (selling futures) protects someone who holds the asset or will sell it later. A bank holding government bonds, for example, can sell interest-rate futures: if rates rise, the loss on the bonds is offset by the gain on the futures.</p>
<h3>Options</h3>
<p>An option gives the buyer the <strong>right but not the obligation</strong> to buy (<strong>call</strong>) or sell (<strong>put</strong>) an asset at the <strong>strike price</strong>, only at expiry (European) or at any time up to and including the expiry date (American). The buyer pays a <strong>premium</strong>; the seller (writer) must perform if the buyer exercises.</p>
<pre><code>Call, strike 50, premium 3:   price at expiry 58 → profit 58 − 50 − 3 = +5
                              price at expiry 45 → not exercised, loss = premium = −3
                              break-even price = 50 + 3 = 53
Put, strike 50, premium 2:    price at expiry 44 → profit 50 − 44 − 2 = +4</code></pre>
<p>The buyer’s loss is limited to the premium, while the gain can be large — an asymmetric payoff that futures do not have. Premiums are higher when the underlying price is more volatile and, for American options, when the time to expiry is longer; a higher strike price lowers a call’s premium and raises a put’s.</p>
<h3>Swaps</h3>
<pre><code>Interest-rate swap, notional 10,000,000 (illustrative): firm pays fixed 5%, receives floating
  floating rate 6%:   receives 10,000,000 x (6% − 5%) = +100,000 net
  floating rate 4.5%: pays     10,000,000 x (5% − 4.5%) =  −50,000 net
Only the net interest difference changes hands; the notional is never exchanged.</code></pre>
<p>Swaps let a bank whose assets reprice slowly but whose deposits reprice quickly convert floating-rate exposure into fixed (lesson 5.1). <strong>Currency swaps</strong> exchange payments in two currencies. <strong>Credit default swaps</strong> pay out if a borrower defaults; huge unhedged positions in them helped turn the 2008 crisis into a systemic one and led to the rescue of the insurer AIG.</p>
<h3>Derivatives in Vietnam</h3>
<p>The derivatives market organised by HNX lists futures contracts on the VN30 index and on government bonds, cleared through VSDC; HOSE lists covered warrants. Banks offer FX forwards and swaps, and some offer interest-rate swaps and options, to hedge customers’ exposures. Check the current product list and rules on the exchanges’ and SSC’s websites.</p>
<div class="callout"><span class="badge">Remember</span> The same contract can hedge or speculate: it reduces risk only when it offsets an exposure you already have. Leverage in futures and written options can turn small price moves into large losses.</div>`,
    `<span class="eyebrow">FIN301 · Phần 4 · Bài 4.3</span>
<h2>Công cụ tài chính phái sinh</h2>
<p class="lead">Công cụ phái sinh là hợp đồng có kết quả thanh toán phụ thuộc vào giá của một tài sản khác — trái phiếu, chỉ số cổ phiếu, đồng tiền, hàng hoá. Tự thân phái sinh không tạo ra của cải: phần được của bên này là phần mất của bên kia. Giá trị của chúng nằm ở việc <strong>chuyển giao rủi ro</strong> từ người muốn giảm rủi ro (người phòng ngừa) sang người sẵn sàng gánh rủi ro (nhà đầu cơ).</p>
<h3>Hợp đồng kỳ hạn và hợp đồng tương lai</h3>
<table>
<tr><th></th><th>Hợp đồng kỳ hạn</th><th>Hợp đồng tương lai</th></tr>
<tr><td>Nơi giao dịch</td><td>Phi tập trung, thoả thuận riêng</td><td>Trên sở giao dịch</td></tr>
<tr><td>Điều khoản</td><td>Khối lượng và ngày tuỳ chỉnh</td><td>Quy mô hợp đồng và ngày giao hàng chuẩn hoá</td></tr>
<tr><td>Đối tác</td><td>Bên kia của hợp đồng — có rủi ro vỡ nợ</td><td>Trung tâm thanh toán bù trừ — rủi ro vỡ nợ gần như được loại bỏ</td></tr>
<tr><td>Dòng tiền</td><td>Thanh toán khi đáo hạn</td><td>Nộp ký quỹ và thanh toán lãi lỗ hằng ngày (<strong>điều chỉnh theo giá thị trường</strong>)</td></tr>
<tr><td>Thanh khoản</td><td>Khó thoát vị thế</td><td>Dễ đóng vị thế bằng giao dịch đối ứng; ít hợp đồng đi tới giao hàng</td></tr>
</table>
<pre><code>Điều chỉnh theo giá thị trường (minh hoạ): mở vị thế mua (trường vị) 1 hợp đồng tương lai 100 đơn vị giá 1.000
Ngày 1 giá thanh toán 1.020:  +20 x 100 = +2.000 cộng vào tài khoản ký quỹ
Ngày 2 giá thanh toán   985:  −35 x 100 = −3.500 bị trừ (luỹ kế −1.500)</code></pre>
<p><strong>Phòng ngừa vị thế mua</strong> (mua hợp đồng tương lai) bảo vệ người sẽ mua tài sản sau này; <strong>phòng ngừa vị thế bán</strong> (bán hợp đồng tương lai) bảo vệ người đang nắm hoặc sẽ bán tài sản sau này. Chẳng hạn, một ngân hàng nắm trái phiếu chính phủ có thể bán hợp đồng tương lai lãi suất: nếu lãi suất tăng, khoản lỗ trên trái phiếu được bù bằng khoản lãi trên hợp đồng tương lai.</p>
<h3>Quyền chọn</h3>
<p>Quyền chọn cho người mua <strong>quyền nhưng không phải nghĩa vụ</strong> mua (<strong>quyền chọn mua</strong>) hoặc bán (<strong>quyền chọn bán</strong>) một tài sản theo <strong>giá thực hiện</strong>, chỉ vào ngày đáo hạn (kiểu châu Âu) hoặc bất kỳ lúc nào cho tới và kể cả ngày đáo hạn (kiểu Mỹ). Người mua trả <strong>phí quyền chọn</strong>; người bán phải thực hiện nếu người mua yêu cầu.</p>
<pre><code>Quyền chọn mua, giá thực hiện 50, phí 3:   giá khi đáo hạn 58 → lãi 58 − 50 − 3 = +5
                                           giá khi đáo hạn 45 → không thực hiện, lỗ = phí = −3
                                           giá hoà vốn = 50 + 3 = 53
Quyền chọn bán, giá thực hiện 50, phí 2:   giá khi đáo hạn 44 → lãi 50 − 44 − 2 = +4</code></pre>
<p>Khoản lỗ của người mua giới hạn ở mức phí, còn khoản lãi có thể lớn — một cơ cấu thanh toán bất đối xứng mà hợp đồng tương lai không có. Phí quyền chọn cao hơn khi giá tài sản cơ sở biến động mạnh hơn và, với quyền chọn kiểu Mỹ, khi thời gian tới đáo hạn dài hơn; giá thực hiện cao hơn làm phí quyền chọn mua giảm và phí quyền chọn bán tăng.</p>
<h3>Hoán đổi</h3>
<pre><code>Hoán đổi lãi suất, giá trị danh nghĩa 10.000.000 (minh hoạ): doanh nghiệp trả cố định 5%, nhận thả nổi
  lãi suất thả nổi 6%:   nhận ròng 10.000.000 x (6% − 5%) = +100.000
  lãi suất thả nổi 4,5%: trả ròng  10.000.000 x (5% − 4,5%) =  −50.000
Chỉ phần chênh lệch tiền lãi ròng được chuyển; giá trị danh nghĩa không bao giờ được trao đổi.</code></pre>
<p>Hoán đổi giúp một ngân hàng có tài sản định giá lại chậm nhưng tiền gửi định giá lại nhanh chuyển rủi ro lãi suất thả nổi thành cố định (bài 5.1). <strong>Hoán đổi tiền tệ</strong> trao đổi các khoản thanh toán bằng hai đồng tiền. <strong>Hợp đồng hoán đổi rủi ro tín dụng (CDS)</strong> chi trả khi người vay vỡ nợ; những vị thế CDS khổng lồ không được phòng ngừa đã góp phần biến cuộc khủng hoảng 2008 thành khủng hoảng hệ thống và dẫn tới việc giải cứu công ty bảo hiểm AIG.</p>
<h3>Phái sinh ở Việt Nam</h3>
<p>Thị trường chứng khoán phái sinh do HNX tổ chức niêm yết hợp đồng tương lai chỉ số VN30 và hợp đồng tương lai trái phiếu chính phủ, bù trừ qua VSDC; HOSE niêm yết chứng quyền có bảo đảm. Các ngân hàng cung cấp hợp đồng kỳ hạn và hoán đổi ngoại tệ, một số ngân hàng cung cấp cả hoán đổi lãi suất và quyền chọn, để khách hàng phòng ngừa rủi ro. Kiểm danh mục sản phẩm và quy định hiện hành trên website các sở giao dịch và UBCKNN.</p>
<div class="callout"><span class="badge">Ghi nhớ</span> Cùng một hợp đồng có thể dùng để phòng ngừa hoặc đầu cơ: nó chỉ giảm rủi ro khi bù trừ một rủi ro bạn đã có sẵn. Đòn bẩy trong hợp đồng tương lai và việc bán quyền chọn có thể biến biến động giá nhỏ thành khoản lỗ lớn.</div>`,
  ]]);

const c10q = quiz('fin301-quiz-4', 'Quiz 4 — Foreign exchange & derivatives|||Quiz 4 — Ngoại hối & phái sinh', [
  { id: 'q1', question: 'The VND/USD rate moves from 25,000 to 26,000. Which statement is correct?|||Tỷ giá VND/USD tăng từ 25.000 lên 26.000. Nhận định nào đúng?', options: ['The VND appreciated by 4%|||VND lên giá 4%', 'The VND depreciated by exactly 4% and the USD appreciated by 3.85%|||VND mất giá đúng 4% và USD lên giá 3,85%', 'Neither currency changed in value|||Không đồng tiền nào thay đổi giá trị', 'The USD appreciated by 4% and the VND depreciated by about 3.85%|||USD lên giá 4% và VND mất giá khoảng 3,85%'], correctIndex: 3, explanation: 'One USD now buys 4% more dong (26,000 / 25,000 − 1); one dong buys 3.85% fewer dollars (25,000 / 26,000 − 1 = −3.85%).|||Một USD giờ đổi được nhiều hơn 4% số đồng (26.000 / 25.000 − 1); một đồng đổi được ít hơn 3,85% số đô la (25.000 / 26.000 − 1 = −3,85%).' },
  { id: 'q2', question: 'The VND interest rate is 7% and the USD rate is 3%. Under covered interest parity, the forward VND/USD rate is…|||Lãi suất VND là 7% và lãi suất USD là 3%. Theo ngang giá lãi suất có bảo hiểm, tỷ giá kỳ hạn VND/USD…', options: ['above the spot rate, by about 4% for one year|||cao hơn tỷ giá giao ngay, khoảng 4% cho kỳ hạn một năm', 'below the spot rate, by about 4%|||thấp hơn tỷ giá giao ngay, khoảng 4%', 'equal to the spot rate|||bằng tỷ giá giao ngay', 'impossible to determine without a forecast of the future spot rate|||không xác định được nếu không có dự báo tỷ giá giao ngay tương lai'], correctIndex: 0, explanation: 'F / S = 1.07 / 1.03 = 1.0388: the higher-rate currency (VND) trades at a forward discount, so more dong per dollar forward.|||F / S = 1,07 / 1,03 = 1,0388: đồng tiền lãi suất cao hơn (VND) giao dịch kỳ hạn ở mức chiết khấu, nên kỳ hạn cần nhiều đồng hơn cho một đô la.' },
  { id: 'q3', question: 'The maximum loss for the buyer of a call option is…|||Khoản lỗ tối đa của người mua quyền chọn mua là…', options: ['unlimited|||không giới hạn', 'the strike price|||giá thực hiện', 'the premium paid|||phí quyền chọn đã trả', 'the daily margin call|||khoản ký quỹ bổ sung hằng ngày'], correctIndex: 2, explanation: 'If the price stays below the strike, the buyer simply does not exercise and loses only the premium. Unlimited loss applies to the writer of a call.|||Nếu giá nằm dưới giá thực hiện, người mua chỉ việc không thực hiện và mất phí. Lỗ không giới hạn thuộc về người bán quyền chọn mua.' },
]);

const c11 = doc('fin301-5-1-commercial-banks', '5.1 — Commercial banks: balance sheet and bank management|||5.1 — Ngân hàng thương mại: bảng cân đối và quản trị ngân hàng',
  'Bảng cân đối ngân hàng, chuyển hoá tài sản, bốn nguyên tắc quản trị (thanh khoản, tài sản, nợ, vốn), ví dụ rút tiền gửi và dự trữ bắt buộc, quản trị rủi ro tín dụng, rủi ro lãi suất bằng phân tích khe hở, hoạt động ngoài bảng, chỉ tiêu ROA, ROE, NIM.',
  [[
    `<span class="eyebrow">FIN301 · Part 5 · Lesson 5.1</span>
<h2>Commercial banks: balance sheet and bank management</h2>
<h3>The bank balance sheet</h3>
<table>
<tr><th>Assets (uses of funds)</th><th>Liabilities and capital (sources of funds)</th></tr>
<tr><td><strong>Reserves</strong> — cash in vault and deposits at the central bank (required + excess)</td><td><strong>Demand (checkable) deposits</strong> — payable on demand</td></tr>
<tr><td><strong>Deposits at other banks</strong> and cash items in collection</td><td><strong>Savings and time deposits</strong> — the main funding in most banks</td></tr>
<tr><td><strong>Securities</strong> — mostly government bonds and bills: liquid, low risk, a “secondary reserve”</td><td><strong>Borrowings</strong> — interbank, from the central bank, bonds issued (including subordinated debt)</td></tr>
<tr><td><strong>Loans</strong> — business, real estate, consumer, interbank: the largest and riskiest asset, main source of income</td><td><strong>Bank capital (equity)</strong> — owners’ stake, the cushion against losses</td></tr>
<tr><td>Other assets — premises, equipment</td><td>Other liabilities</td></tr>
</table>
<p>A bank earns the spread between the return on its assets and the cost of its liabilities by <strong>asset transformation</strong>: it issues short-term, liquid, low-risk deposits and holds long-term, illiquid, riskier loans. This is useful — and it is exactly what makes banks fragile.</p>
<h3>Four principles of bank management</h3>
<ol>
<li><strong>Liquidity management</strong> — hold enough liquid assets to meet deposit outflows.</li>
<li><strong>Asset management</strong> — lend to good borrowers at good rates, diversify, and hold enough liquid securities.</li>
<li><strong>Liability management</strong> — obtain funds at low cost (deposits, interbank, bonds).</li>
<li><strong>Capital adequacy management</strong> — keep enough capital to survive losses and satisfy regulators (lesson 5.2).</li>
</ol>
<pre><code>Illustrative bank: reserves 20, securities 10, loans 80 | deposits 100, capital 10
Required reserve ratio 10%  →  required 10, excess 10
Outflow of 10:  deposits 90, reserves 10, required 9  →  still OK (excess 1)
Outflow of 15:  deposits 85, reserves 5, required 8.5 →  shortfall 3.5
Options: borrow interbank or from the central bank, sell securities, reduce loans
(calling in or selling loans is the most costly option)</code></pre>
<p>Excess reserves and liquid securities are insurance against outflows: they earn little, but running out costs much more.</p>
<h3>Managing credit risk</h3>
<p>Credit risk is a direct application of asymmetric information (lesson 1.1): <strong>screening and monitoring</strong>, specialisation in known industries, <strong>restrictive covenants</strong>, <strong>long-term customer relationships</strong>, loan commitments, <strong>collateral</strong> and compensating balances, and <strong>credit rationing</strong> — refusing loans or lending less than requested even at a higher rate, because a higher rate would attract riskier borrowers.</p>
<h3>Managing interest-rate risk: gap analysis</h3>
<pre><code>GAP = rate-sensitive assets (RSA) − rate-sensitive liabilities (RSL)
Change in net interest income = GAP x change in interest rate
RSA 200, RSL 300  →  GAP = −100
Rates rise by 1 percentage point  →  net interest income falls by 100 x 1% = 1</code></pre>
<p>A bank funded by short-term deposits and lending at fixed long-term rates has a negative gap and loses when rates rise. <strong>Duration gap analysis</strong> extends the idea to the market value of the bank’s equity. Tools to reduce the risk: more floating-rate loans, matching maturities, and interest-rate swaps or futures (lesson 4.3). Banks also manage <strong>liquidity, market, foreign-exchange and operational</strong> risk.</p>
<h3>Off-balance-sheet activities and performance</h3>
<p>Banks earn fees from guarantees, letters of credit, loan commitments, payment services, loan sales and trading — income that does not appear as assets but can carry significant risk. Common performance measures: <strong>ROA</strong> = net income / assets; <strong>ROE</strong> = net income / equity; <strong>net interest margin (NIM)</strong> = (interest income − interest expense) / earning assets — for example, (70 − 40) / 900 = 3.33% (illustrative).</p>
<div class="callout"><span class="badge">Remember</span> Every bank balances three things at once: profitability (hold loans), liquidity (hold reserves and securities) and safety (hold capital). Pushing one too far weakens the others.</div>`,
    `<span class="eyebrow">FIN301 · Phần 5 · Bài 5.1</span>
<h2>Ngân hàng thương mại: bảng cân đối và quản trị ngân hàng</h2>
<h3>Bảng cân đối của ngân hàng</h3>
<table>
<tr><th>Tài sản (sử dụng vốn)</th><th>Nợ phải trả và vốn (nguồn vốn)</th></tr>
<tr><td><strong>Dự trữ</strong> — tiền mặt tại quỹ và tiền gửi tại ngân hàng trung ương (bắt buộc + dư thừa)</td><td><strong>Tiền gửi không kỳ hạn (thanh toán)</strong> — phải trả khi khách yêu cầu</td></tr>
<tr><td><strong>Tiền gửi tại ngân hàng khác</strong> và các khoản đang thu</td><td><strong>Tiền gửi tiết kiệm và có kỳ hạn</strong> — nguồn vốn chính của đa số ngân hàng</td></tr>
<tr><td><strong>Chứng khoán</strong> — chủ yếu trái phiếu và tín phiếu chính phủ: thanh khoản, rủi ro thấp, là “dự trữ thứ cấp”</td><td><strong>Vốn vay</strong> — liên ngân hàng, từ ngân hàng trung ương, trái phiếu phát hành (kể cả nợ thứ cấp)</td></tr>
<tr><td><strong>Cho vay</strong> — doanh nghiệp, bất động sản, tiêu dùng, liên ngân hàng: tài sản lớn nhất và rủi ro nhất, nguồn thu nhập chính</td><td><strong>Vốn chủ sở hữu</strong> — phần góp của chủ sở hữu, tấm đệm chống tổn thất</td></tr>
<tr><td>Tài sản khác — trụ sở, thiết bị</td><td>Nợ khác</td></tr>
</table>
<p>Ngân hàng hưởng chênh lệch giữa lợi suất của tài sản và chi phí của nợ nhờ <strong>chuyển hoá tài sản</strong>: phát hành tiền gửi ngắn hạn, thanh khoản, ít rủi ro và nắm các khoản cho vay dài hạn, kém thanh khoản, rủi ro hơn. Điều này hữu ích — và cũng chính là điều khiến ngân hàng dễ đổ vỡ.</p>
<h3>Bốn nguyên tắc quản trị ngân hàng</h3>
<ol>
<li><strong>Quản trị thanh khoản</strong> — giữ đủ tài sản thanh khoản để đáp ứng việc rút tiền gửi.</li>
<li><strong>Quản trị tài sản</strong> — cho người vay tốt vay với lãi suất tốt, đa dạng hoá và giữ đủ chứng khoán thanh khoản.</li>
<li><strong>Quản trị nợ</strong> — huy động vốn với chi phí thấp (tiền gửi, liên ngân hàng, trái phiếu).</li>
<li><strong>Quản trị mức đủ vốn</strong> — giữ đủ vốn để chịu được tổn thất và đáp ứng cơ quan quản lý (bài 5.2).</li>
</ol>
<pre><code>Ngân hàng minh hoạ: dự trữ 20, chứng khoán 10, cho vay 80 | tiền gửi 100, vốn 10
Tỷ lệ dự trữ bắt buộc 10%  →  bắt buộc 10, dư thừa 10
Rút 10:  tiền gửi 90, dự trữ 10, bắt buộc 9   →  vẫn ổn (dư 1)
Rút 15:  tiền gửi 85, dự trữ 5, bắt buộc 8,5  →  thiếu 3,5
Cách xử lý: vay liên ngân hàng hoặc vay ngân hàng trung ương, bán chứng khoán, giảm cho vay
(thu hồi hoặc bán khoản vay là cách tốn kém nhất)</code></pre>
<p>Dự trữ dư thừa và chứng khoán thanh khoản là bảo hiểm cho việc rút tiền: chúng sinh lời ít, nhưng cạn thanh khoản thì tốn kém hơn nhiều.</p>
<h3>Quản trị rủi ro tín dụng</h3>
<p>Rủi ro tín dụng là ứng dụng trực tiếp của thông tin bất cân xứng (bài 1.1): <strong>sàng lọc và giám sát</strong>, chuyên môn hoá vào ngành quen thuộc, <strong>điều khoản hạn chế</strong>, <strong>quan hệ khách hàng lâu dài</strong>, cam kết cho vay, <strong>tài sản bảo đảm</strong> và số dư bù đắp, và <strong>hạn chế tín dụng</strong> — từ chối cho vay hoặc cho vay ít hơn mức đề nghị kể cả khi người vay chịu lãi cao hơn, vì lãi suất cao hơn sẽ thu hút người vay rủi ro hơn.</p>
<h3>Quản trị rủi ro lãi suất: phân tích khe hở</h3>
<pre><code>Khe hở = tài sản nhạy cảm lãi suất (RSA) − nợ nhạy cảm lãi suất (RSL)
Thay đổi thu nhập lãi ròng = khe hở x thay đổi lãi suất
RSA 200, RSL 300  →  khe hở = −100
Lãi suất tăng 1 điểm phần trăm  →  thu nhập lãi ròng giảm 100 x 1% = 1</code></pre>
<p>Ngân hàng huy động bằng tiền gửi ngắn hạn và cho vay lãi cố định dài hạn có khe hở âm và bị thiệt khi lãi suất tăng. <strong>Phân tích khe hở thời lượng</strong> mở rộng ý tưởng này sang giá trị thị trường của vốn chủ sở hữu ngân hàng. Công cụ giảm rủi ro: tăng cho vay lãi thả nổi, khớp kỳ hạn, và dùng hoán đổi lãi suất hoặc hợp đồng tương lai (bài 4.3). Ngân hàng còn quản trị rủi ro <strong>thanh khoản, thị trường, ngoại hối và hoạt động</strong>.</p>
<h3>Hoạt động ngoài bảng và hiệu quả hoạt động</h3>
<p>Ngân hàng thu phí từ bảo lãnh, thư tín dụng, cam kết cho vay, dịch vụ thanh toán, bán khoản vay và kinh doanh — thu nhập không hiện ra dưới dạng tài sản nhưng có thể mang rủi ro đáng kể. Các chỉ tiêu hiệu quả thường dùng: <strong>ROA</strong> = lợi nhuận ròng / tài sản; <strong>ROE</strong> = lợi nhuận ròng / vốn chủ sở hữu; <strong>biên lãi ròng (NIM)</strong> = (thu nhập lãi − chi phí lãi) / tài sản sinh lời — ví dụ (70 − 40) / 900 = 3,33% (minh hoạ).</p>
<div class="callout"><span class="badge">Ghi nhớ</span> Mọi ngân hàng cùng lúc cân bằng ba thứ: khả năng sinh lời (nắm khoản vay), thanh khoản (nắm dự trữ và chứng khoán) và an toàn (nắm vốn). Đẩy một thứ đi quá xa sẽ làm yếu hai thứ còn lại.</div>`,
  ]]);

const c12 = doc('fin301-5-2-regulation-basel-crises', '5.2 — Bank regulation, Basel capital standards and financial crises|||5.2 — Quản lý ngân hàng, chuẩn vốn Basel và khủng hoảng tài chính',
  'Vì sao phải quản lý ngân hàng, lưới an toàn của nhà nước (bảo hiểm tiền gửi, người cho vay cuối cùng) và rủi ro đạo đức, các loại quy định, Basel I–II–III (tỷ lệ vốn, bộ đệm, tỷ lệ đòn bẩy, LCR, NSFR), ba giai đoạn khủng hoảng tài chính, khủng hoảng 2007–2009 và phản ứng chính sách.',
  [[
    `<span class="eyebrow">FIN301 · Part 5 · Lesson 5.2</span>
<h2>Bank regulation, Basel capital standards and financial crises</h2>
<h3>Why banks are regulated</h3>
<p>Depositors cannot easily judge a bank’s loans, so bad news about one bank can trigger <strong>runs</strong> on others — contagion. Governments respond with a <strong>safety net</strong>: <strong>deposit insurance</strong> (in Vietnam, Deposit Insurance of Vietnam pays insured depositors up to a legal limit — check the current limit) and the central bank as <strong>lender of last resort</strong>. The safety net stops panics but creates <strong>moral hazard</strong> (insured depositors stop monitoring, banks take more risk) and <strong>adverse selection</strong> (risk-lovers are attracted to banking). “<strong>Too big to fail</strong>” worsens both: creditors of the largest banks expect to be rescued.</p>
<h3>What regulators do</h3>
<ul>
<li>Restrict risky asset holdings and concentrations of lending.</li>
<li>Impose <strong>capital requirements</strong>, with <strong>prompt corrective action</strong> as capital falls.</li>
<li>License (charter) banks and examine them, often with the <strong>CAMELS</strong> rating: Capital adequacy, Asset quality, Management, Earnings, Liquidity, Sensitivity to market risk.</li>
<li>Assess risk management and run <strong>stress tests</strong>; require disclosure; protect consumers.</li>
<li><strong>Microprudential</strong> rules target individual banks; <strong>macroprudential</strong> policy targets the system as a whole (for example, countercyclical buffers and limits on loan-to-value ratios).</li>
</ul>
<h3>The Basel Accords</h3>
<p>The Basel Committee on Banking Supervision, hosted by the Bank for International Settlements (BIS), sets international capital standards that national regulators adopt.</p>
<table>
<tr><th>Accord</th><th>Main content</th></tr>
<tr><td>Basel I (1988)</td><td>Capital of at least 8% of <strong>risk-weighted assets</strong> (RWA); broad risk-weight classes</td></tr>
<tr><td>Basel II (2004)</td><td>Three pillars: (1) minimum capital with more risk-sensitive weights, including operational risk; (2) supervisory review; (3) market discipline through disclosure</td></tr>
<tr><td>Basel III (after the 2008 crisis, phased in)</td><td>Better-quality capital; minimum ratios to RWA: common equity Tier 1 (CET1) 4.5%, Tier 1 6%, total capital 8%; plus a capital conservation buffer of 2.5% (so 7%, 8.5% and 10.5%), a countercyclical buffer of 0–2.5% and surcharges for global systemically important banks; a <strong>leverage ratio</strong> of at least 3% of Tier 1 to total exposure; liquidity rules — the liquidity coverage ratio (LCR) and net stable funding ratio (NSFR), each at least 100%</td></tr>
</table>
<pre><code>Capital adequacy ratio (CAR) = eligible capital / risk-weighted assets
RWA = sum of (exposure x risk weight)   e.g. cash 0%, a 50% weight halves an exposure</code></pre>
<p>Risk weights mean a bank must hold more capital against a corporate loan than against cash or home-currency government bonds. Criticisms: weights can be gamed, they depend on ratings and models, and a low weight is not the same as low risk — hence the unweighted leverage ratio as a backstop. The State Bank of Vietnam sets minimum capital adequacy ratios for Vietnamese banks based on the Basel framework; check the regulation currently in force for the exact ratios and method.</p>
<h3>How financial crises unfold</h3>
<ol>
<li><strong>Initiation:</strong> a credit boom and bust (often after financial liberalisation or innovation), an asset-price boom and bust, or a spike in uncertainty. Asymmetric information worsens as balance sheets weaken.</li>
<li><strong>Banking crisis:</strong> losses erode bank capital; banks cut lending; runs and failures spread.</li>
<li><strong>Debt deflation</strong> (in some crises): falling prices raise the real burden of debt, deepening the slump.</li>
</ol>
<h3>The global financial crisis of 2007–2009</h3>
<p>Causes combined several ideas from this course: <strong>financial innovation</strong> in mortgage markets (subprime loans packaged into mortgage-backed securities and CDOs); <strong>agency problems</strong> in the originate-to-distribute model, where lenders had little incentive to screen borrowers; conflicts of interest at credit rating agencies; and a housing bubble. When house prices fell, losses spread through banks and the <strong>shadow banking system</strong> (investment banks and funds financed by short-term repo), triggering runs as lenders raised haircuts. The failure of Lehman Brothers in September 2008 turned the crisis into a global panic. Responses included emergency central-bank lending, government capital injections, the US Dodd–Frank Act (2010) and Basel III. Emerging-market crises, such as the 1997 Asian crisis, add a currency channel: depreciation inflates foreign-currency debt and damages balance sheets.</p>
<div class="callout"><span class="badge">Key lesson</span> Crises rarely start with a new kind of risk; they start when an old problem — asymmetric information, leverage, short-term funding of long-term assets — appears in a new form that regulation has not yet caught up with.</div>`,
    `<span class="eyebrow">FIN301 · Phần 5 · Bài 5.2</span>
<h2>Quản lý ngân hàng, chuẩn vốn Basel và khủng hoảng tài chính</h2>
<h3>Vì sao phải quản lý ngân hàng</h3>
<p>Người gửi tiền không dễ đánh giá được các khoản vay của ngân hàng, nên tin xấu về một ngân hàng có thể gây ra <strong>rút tiền hàng loạt</strong> ở các ngân hàng khác — hiệu ứng lây lan. Nhà nước đối phó bằng <strong>lưới an toàn</strong>: <strong>bảo hiểm tiền gửi</strong> (ở Việt Nam, Bảo hiểm tiền gửi Việt Nam chi trả cho người gửi tiền được bảo hiểm tới một hạn mức do pháp luật quy định — kiểm hạn mức hiện hành) và ngân hàng trung ương là <strong>người cho vay cuối cùng</strong>. Lưới an toàn chặn được hoảng loạn nhưng tạo ra <strong>rủi ro đạo đức</strong> (người gửi tiền được bảo hiểm thôi giám sát, ngân hàng mạo hiểm hơn) và <strong>lựa chọn bất lợi</strong> (người ưa mạo hiểm bị thu hút vào ngành ngân hàng). “<strong>Quá lớn để sụp đổ</strong>” làm cả hai tệ hơn: chủ nợ của các ngân hàng lớn nhất kỳ vọng sẽ được giải cứu.</p>
<h3>Cơ quan quản lý làm gì</h3>
<ul>
<li>Hạn chế nắm giữ tài sản rủi ro và tập trung tín dụng.</li>
<li>Áp đặt <strong>yêu cầu về vốn</strong>, kèm <strong>biện pháp can thiệp sớm</strong> khi vốn suy giảm.</li>
<li>Cấp phép thành lập và thanh tra ngân hàng, thường theo khung xếp hạng <strong>CAMELS</strong>: mức đủ vốn, chất lượng tài sản, quản trị, lợi nhuận, thanh khoản, độ nhạy với rủi ro thị trường.</li>
<li>Đánh giá quản trị rủi ro và <strong>kiểm tra sức chịu đựng</strong>; yêu cầu công bố thông tin; bảo vệ người tiêu dùng.</li>
<li>Quy định <strong>an toàn vi mô</strong> nhắm vào từng ngân hàng; chính sách <strong>an toàn vĩ mô</strong> nhắm vào cả hệ thống (ví dụ bộ đệm vốn phản chu kỳ, giới hạn tỷ lệ cho vay trên giá trị tài sản bảo đảm).</li>
</ul>
<h3>Các Hiệp ước Basel</h3>
<p>Uỷ ban Basel về Giám sát Ngân hàng, đặt tại Ngân hàng Thanh toán Quốc tế (BIS), ban hành các chuẩn mực vốn quốc tế để cơ quan quản lý các nước áp dụng.</p>
<table>
<tr><th>Hiệp ước</th><th>Nội dung chính</th></tr>
<tr><td>Basel I (1988)</td><td>Vốn tối thiểu 8% <strong>tài sản có rủi ro</strong> (RWA); các nhóm trọng số rủi ro đơn giản</td></tr>
<tr><td>Basel II (2004)</td><td>Ba trụ cột: (1) vốn tối thiểu với trọng số nhạy rủi ro hơn, có tính cả rủi ro hoạt động; (2) giám sát của cơ quan quản lý; (3) kỷ luật thị trường thông qua công bố thông tin</td></tr>
<tr><td>Basel III (sau khủng hoảng 2008, áp dụng dần)</td><td>Vốn chất lượng cao hơn; tỷ lệ tối thiểu trên RWA: vốn cổ phần phổ thông cấp 1 (CET1) 4,5%, vốn cấp 1 6%, tổng vốn 8%; cộng bộ đệm bảo toàn vốn 2,5% (thành 7%, 8,5% và 10,5%), bộ đệm phản chu kỳ 0–2,5% và phụ phí cho ngân hàng quan trọng mang tính hệ thống toàn cầu; <strong>tỷ lệ đòn bẩy</strong> tối thiểu 3% vốn cấp 1 trên tổng mức phơi nhiễm; quy định thanh khoản — tỷ lệ bao phủ thanh khoản (LCR) và tỷ lệ nguồn vốn ổn định ròng (NSFR), mỗi tỷ lệ tối thiểu 100%</td></tr>
</table>
<pre><code>Tỷ lệ an toàn vốn (CAR) = vốn đủ điều kiện / tài sản có rủi ro
RWA = tổng (giá trị khoản mục x trọng số rủi ro)   vd tiền mặt 0%, trọng số 50% làm giảm một nửa</code></pre>
<p>Trọng số rủi ro khiến ngân hàng phải giữ nhiều vốn cho một khoản vay doanh nghiệp hơn so với tiền mặt hay trái phiếu chính phủ bằng nội tệ. Các phê phán: trọng số có thể bị “lách”, phụ thuộc xếp hạng và mô hình, và trọng số thấp không đồng nghĩa với rủi ro thấp — vì thế có thêm tỷ lệ đòn bẩy không tính trọng số làm chốt chặn. Ngân hàng Nhà nước Việt Nam quy định tỷ lệ an toàn vốn tối thiểu cho các ngân hàng Việt Nam dựa trên khung Basel; kiểm văn bản đang có hiệu lực để biết tỷ lệ và phương pháp tính cụ thể.</p>
<h3>Khủng hoảng tài chính diễn ra thế nào</h3>
<ol>
<li><strong>Khởi phát:</strong> tín dụng bùng nổ rồi đổ vỡ (thường sau tự do hoá hoặc đổi mới tài chính), giá tài sản bùng nổ rồi sụp đổ, hoặc bất định tăng vọt. Thông tin bất cân xứng trầm trọng hơn khi bảng cân đối suy yếu.</li>
<li><strong>Khủng hoảng ngân hàng:</strong> tổn thất bào mòn vốn ngân hàng; ngân hàng cắt giảm cho vay; rút tiền hàng loạt và đổ vỡ lan rộng.</li>
<li><strong>Giảm phát nợ</strong> (ở một số cuộc khủng hoảng): giá cả giảm làm tăng gánh nặng thực của nợ, khiến suy thoái sâu hơn.</li>
</ol>
<h3>Khủng hoảng tài chính toàn cầu 2007–2009</h3>
<p>Nguyên nhân kết hợp nhiều ý trong môn học: <strong>đổi mới tài chính</strong> trên thị trường thế chấp (khoản vay dưới chuẩn được đóng gói thành chứng khoán bảo đảm bằng thế chấp và CDO); <strong>vấn đề người đại diện</strong> trong mô hình “cho vay để bán lại”, nơi bên cho vay ít động cơ sàng lọc người vay; xung đột lợi ích ở các tổ chức xếp hạng tín nhiệm; và bong bóng nhà đất. Khi giá nhà giảm, tổn thất lan qua ngân hàng và <strong>hệ thống ngân hàng bóng</strong> (ngân hàng đầu tư và các quỹ được tài trợ bằng repo ngắn hạn), gây rút vốn hàng loạt khi bên cho vay tăng tỷ lệ chiết khấu tài sản. Sự sụp đổ của Lehman Brothers vào tháng 9 năm 2008 biến cuộc khủng hoảng thành cơn hoảng loạn toàn cầu. Các phản ứng gồm cho vay khẩn cấp của ngân hàng trung ương, nhà nước bơm vốn vào ngân hàng, Đạo luật Dodd–Frank của Mỹ (2010) và Basel III. Khủng hoảng ở các nền kinh tế mới nổi, như khủng hoảng châu Á 1997, có thêm kênh tiền tệ: nội tệ mất giá làm phình nợ bằng ngoại tệ và phá huỷ bảng cân đối.</p>
<div class="callout"><span class="badge">Bài học then chốt</span> Khủng hoảng hiếm khi bắt đầu từ một loại rủi ro mới; nó bắt đầu khi một vấn đề cũ — thông tin bất cân xứng, đòn bẩy, dùng vốn ngắn hạn tài trợ tài sản dài hạn — xuất hiện dưới hình thức mới mà quy định chưa theo kịp.</div>`,
  ]]);

const c12e = doc('fin301-5-3-exercise', 'Exercise 4 — bank balance sheet and capital adequacy|||Bài tập 4 — bảng cân đối ngân hàng và tỷ lệ an toàn vốn',
  'Bài tập: với bảng cân đối ngân hàng giả định, tính ROA, ROE, hệ số nhân vốn, tài sản có rủi ro, các tỷ lệ vốn theo Basel III và tỷ lệ đòn bẩy; đánh giá lại sau khi xoá nợ xấu và tính lượng vốn mới cần huy động; kèm lời giải.',
  [[
    `<span class="eyebrow">FIN301 · Part 5 · Exercise 4</span>
<h2>Exercise 4 — how much capital is enough?</h2>
<div class="callout"><span class="badge">Problem</span> A fictional bank (illustrative numbers, in billions). <em>Assets:</em> cash and central-bank reserves 60; deposits at other banks 40; government bonds 150; corporate loans 500; residential mortgages 200; other assets 50. <em>Liabilities and equity:</em> customer deposits 820; borrowings 80 (of which subordinated debt 15, counted as Tier 2 capital); other liabilities 20; common equity 80 (all CET1). Net income for the year is 12. Use simplified risk weights: cash and government bonds 0%, interbank deposits 20%, mortgages 50%, corporate loans and other assets 100%. (a) Compute ROA, ROE and the equity multiplier. (b) Compute RWA, the CET1, Tier 1 and total capital ratios and the leverage ratio, and compare them with Basel III minima plus the 2.5% conservation buffer (7%, 8.5%, 10.5%) and the 3% leverage ratio. (c) The bank recognises a loss of 40 on corporate loans (no provisions had been made; ignore taxes) and writes them off. Recompute. (d) How much new common equity, raised in cash, restores all ratios?</div>
<h3>Worked solution</h3>
<pre><code class="language-text">Check: assets 60+40+150+500+200+50 = 1,000 = 820+80+20+80

(a) ROA = 12 / 1,000 = 1.2%     ROE = 12 / 80 = 15%
    Equity multiplier = 1,000 / 80 = 12.5      ROE = ROA x EM = 1.2% x 12.5 = 15% ✓

(b) RWA = 60x0 + 40x0.2 + 150x0 + 500x1 + 200x0.5 + 50x1 = 8 + 500 + 100 + 50 = 658
    CET1 = Tier 1 = 80 / 658        = 12.16%   (≥ 7.0% and ≥ 8.5%)  OK
    Total capital = (80 + 15) / 658 = 14.44%   (≥ 10.5%)            OK
    Leverage ratio = 80 / 1,000     = 8.00%    (≥ 3%)               OK

(c) Write-off 40: loans 460, assets 960, equity 80 − 40 = 40, RWA 658 − 40 = 618
    CET1 = Tier 1 = 40 / 618        = 6.47%    below 7.0% and 8.5%  (above the bare 4.5% / 6%)
    Total capital = (40 + 15) / 618 = 8.90%    below 10.5%          (above the bare 8%)
    Leverage ratio = 40 / 960       = 4.17%    OK

(d) Tier 1 needed: 8.5% x 618 = 52.53  →  new equity 52.53 − 40 = 12.53
    Total needed: 10.5% x 618 = 64.89  →  would need only 64.89 − 55 = 9.89
    Raise 12.53 (the binding constraint). New cash has a 0% weight, so RWA stays 618:
    CET1 = Tier 1 = 52.53 / 618 = 8.50%   total = 67.53 / 618 = 10.93%
    leverage = 52.53 / 972.53 = 5.40%</code></pre>
<p><strong>Why:</strong> high leverage makes ROE attractive (15% from a 1.2% ROA) but leaves a thin cushion: a loss equal to 4% of assets wiped out half of the equity and pushed the bank below its buffers. To rebuild, it can raise new equity (diluting owners), retain earnings (paying no dividends) or shrink risk-weighted assets — for example, moving from corporate loans to government bonds. The last option cuts lending to firms, which is how bank losses turn into a <strong>credit crunch</strong> for the economy. The risk weights here are a simplified, Basel-I-style illustration; real weights under Basel II/III depend on ratings or internal models, and Vietnamese banks follow the SBV’s current rules.</p>`,
    `<span class="eyebrow">FIN301 · Phần 5 · Bài tập 4</span>
<h2>Bài tập 4 — bao nhiêu vốn là đủ?</h2>
<div class="callout"><span class="badge">Đề</span> Một ngân hàng giả định (số liệu minh hoạ, đơn vị tỷ). <em>Tài sản:</em> tiền mặt và tiền gửi tại ngân hàng trung ương 60; tiền gửi tại ngân hàng khác 40; trái phiếu chính phủ 150; cho vay doanh nghiệp 500; cho vay mua nhà có thế chấp 200; tài sản khác 50. <em>Nợ và vốn chủ sở hữu:</em> tiền gửi khách hàng 820; vốn vay 80 (trong đó nợ thứ cấp 15, được tính vào vốn cấp 2); nợ khác 20; vốn cổ phần phổ thông 80 (toàn bộ là CET1). Lợi nhuận ròng trong năm là 12. Dùng trọng số rủi ro giản lược: tiền mặt và trái phiếu chính phủ 0%, tiền gửi liên ngân hàng 20%, cho vay thế chấp nhà 50%, cho vay doanh nghiệp và tài sản khác 100%. (a) Tính ROA, ROE và hệ số nhân vốn. (b) Tính RWA, các tỷ lệ CET1, vốn cấp 1, tổng vốn và tỷ lệ đòn bẩy, rồi so với mức tối thiểu Basel III cộng bộ đệm bảo toàn 2,5% (7%, 8,5%, 10,5%) và tỷ lệ đòn bẩy 3%. (c) Ngân hàng ghi nhận khoản lỗ 40 trên cho vay doanh nghiệp (chưa trích lập dự phòng cho khoản này; bỏ qua thuế) và xoá các khoản nợ đó. Tính lại. (d) Cần huy động bao nhiêu vốn cổ phần phổ thông mới, bằng tiền mặt, để khôi phục mọi tỷ lệ?</div>
<h3>Lời giải</h3>
<pre><code class="language-text">Kiểm tra: tài sản 60+40+150+500+200+50 = 1.000 = 820+80+20+80

(a) ROA = 12 / 1.000 = 1,2%     ROE = 12 / 80 = 15%
    Hệ số nhân vốn = 1.000 / 80 = 12,5      ROE = ROA x hệ số nhân = 1,2% x 12,5 = 15% ✓

(b) RWA = 60x0 + 40x0,2 + 150x0 + 500x1 + 200x0,5 + 50x1 = 8 + 500 + 100 + 50 = 658
    CET1 = vốn cấp 1 = 80 / 658      = 12,16%   (≥ 7,0% và ≥ 8,5%)  Đạt
    Tổng vốn = (80 + 15) / 658       = 14,44%   (≥ 10,5%)           Đạt
    Tỷ lệ đòn bẩy = 80 / 1.000       = 8,00%    (≥ 3%)              Đạt

(c) Xoá nợ 40: cho vay 460, tài sản 960, vốn chủ 80 − 40 = 40, RWA 658 − 40 = 618
    CET1 = vốn cấp 1 = 40 / 618      = 6,47%    dưới 7,0% và 8,5%  (trên mức sàn 4,5% / 6%)
    Tổng vốn = (40 + 15) / 618       = 8,90%    dưới 10,5%         (trên mức sàn 8%)
    Tỷ lệ đòn bẩy = 40 / 960         = 4,17%    Đạt

(d) Vốn cấp 1 cần: 8,5% x 618 = 52,53  →  vốn mới 52,53 − 40 = 12,53
    Tổng vốn cần: 10,5% x 618 = 64,89  →  chỉ cần 64,89 − 55 = 9,89
    Huy động 12,53 (ràng buộc chặt nhất). Tiền mặt mới có trọng số 0% nên RWA vẫn là 618:
    CET1 = vốn cấp 1 = 52,53 / 618 = 8,50%   tổng vốn = 67,53 / 618 = 10,93%
    đòn bẩy = 52,53 / 972,53 = 5,40%</code></pre>
<p><strong>Vì sao:</strong> đòn bẩy cao làm ROE hấp dẫn (15% từ ROA 1,2%) nhưng để lại tấm đệm mỏng: một khoản lỗ bằng 4% tài sản đã xoá một nửa vốn chủ sở hữu và đẩy ngân hàng xuống dưới các bộ đệm. Để phục hồi, ngân hàng có thể phát hành thêm cổ phần (pha loãng chủ sở hữu), giữ lại lợi nhuận (không chia cổ tức) hoặc thu hẹp tài sản có rủi ro — ví dụ chuyển từ cho vay doanh nghiệp sang trái phiếu chính phủ. Cách cuối cùng làm giảm tín dụng cho doanh nghiệp, và đó là cách tổn thất của ngân hàng biến thành tình trạng <strong>co thắt tín dụng</strong> (credit crunch) cho nền kinh tế. Trọng số rủi ro ở đây là minh hoạ giản lược theo kiểu Basel I; trọng số thật theo Basel II/III phụ thuộc xếp hạng hoặc mô hình nội bộ, và các ngân hàng Việt Nam tuân theo quy định hiện hành của NHNN.</p>`,
  ]]);

const c13 = doc('fin301-5-4-nonbank-institutions', '5.4 — Insurance companies, investment funds, pension funds and securities firms|||5.4 — Công ty bảo hiểm, quỹ đầu tư, quỹ hưu trí và công ty chứng khoán',
  'Nguyên lý bảo hiểm, bảo hiểm nhân thọ và phi nhân thọ, xử lý lựa chọn bất lợi và rủi ro đạo đức trong bảo hiểm, tỷ lệ kết hợp; quỹ hưu trí xác định trước và đóng góp xác định; quỹ mở, quỹ đóng, ETF, quỹ thị trường tiền tệ, NAV; công ty chứng khoán, ngân hàng đầu tư, công ty tài chính và ngân hàng bóng.',
  [[
    `<span class="eyebrow">FIN301 · Part 5 · Lesson 5.4</span>
<h2>Insurance companies, investment funds, pension funds and securities firms</h2>
<p class="lead">Banks are not the only intermediaries. Contractual savings institutions and investment intermediaries hold a large share of household savings, and they solve different problems: protection against loss, saving for retirement, and cheap access to diversified portfolios.</p>
<h3>Insurance companies</h3>
<p>Insurers collect <strong>premiums</strong> from many policyholders and pay the claims of the few who suffer losses; the law of large numbers makes total claims predictable. <strong>Life insurers</strong> face long-term, fairly predictable liabilities, so they hold long-term bonds, mortgages and some stocks. <strong>Property and casualty (non-life) insurers</strong> face less predictable claims and hold more liquid assets. <strong>Reinsurance</strong> lets insurers pass on part of large risks.</p>
<table>
<tr><th>Problem</th><th>Insurance tools</th></tr>
<tr><td>Adverse selection — those most likely to claim are keenest to buy</td><td>Screening (health checks, driving records), <strong>risk-based premiums</strong>, waiting periods</td></tr>
<tr><td>Moral hazard — insured people take less care</td><td><strong>Deductibles</strong> and <strong>coinsurance</strong> (the policyholder bears part of each loss), restrictive provisions, cancellation, limits on coverage</td></tr>
</table>
<pre><code>Illustrative non-life insurer: premiums 1,000, claims 650, expenses 300
Loss ratio 65% + expense ratio 30% = combined ratio 95%
Below 100% → underwriting profit of 5% of premiums, before investment income</code></pre>
<h3>Pension funds</h3>
<ul>
<li><strong>Defined-benefit (DB)</strong> plans promise a pension based on salary and years of service; the sponsor bears the investment risk, and a plan is <em>underfunded</em> if its assets fall short of the present value of promised benefits.</li>
<li><strong>Defined-contribution (DC)</strong> plans fix the contributions; the pension depends on investment results, so the member bears the risk.</li>
<li>Public schemes are often <strong>pay-as-you-go</strong>: today’s workers’ contributions pay today’s pensioners, which becomes harder as populations age. In Vietnam, compulsory social insurance, including retirement benefits, is administered by Vietnam Social Security, and voluntary supplementary pension products also exist — check the current Law on Social Insurance for the rules.</li>
</ul>
<h3>Investment funds</h3>
<table>
<tr><th>Type</th><th>How it works</th></tr>
<tr><td><strong>Open-end fund</strong></td><td>Issues and redeems units every trading day at net asset value (NAV)</td></tr>
<tr><td><strong>Closed-end fund</strong></td><td>A fixed number of units traded on an exchange; the price can be above or below NAV</td></tr>
<tr><td><strong>Exchange-traded fund (ETF)</strong></td><td>Usually tracks an index; trades on an exchange like a share, with a creation–redemption mechanism keeping its price close to NAV</td></tr>
<tr><td><strong>Money market fund</strong></td><td>Invests in money-market instruments; very liquid, but not a deposit — it is not covered by deposit insurance</td></tr>
<tr><td><strong>Hedge fund</strong></td><td>Lightly regulated, for wealthy and institutional investors; uses leverage, short selling and derivatives</td></tr>
</table>
<pre><code>NAV per unit = (fund assets − fund liabilities) / units outstanding
Illustrative: (520 billion − 20 billion) / 40 million units = VND 12,500 per unit</code></pre>
<p>Funds offer diversification, liquidity and professional management at low cost, in exchange for fees (the expense ratio). In Vietnam, fund management companies are licensed and supervised by the SSC; ETFs and closed-end fund certificates are listed on the exchanges, while open-end fund units are bought and redeemed through distributors at NAV.</p>
<h3>Securities firms, investment banks and finance companies</h3>
<ul>
<li><strong>Securities firms</strong> act as brokers (agents) and dealers (principals), offer margin loans and research; in Vietnam they are licensed by the SSC.</li>
<li><strong>Investment banks</strong> underwrite securities issues (lesson 3.3), advise on mergers and acquisitions, and trade — activities that create conflicts of interest that regulation tries to contain.</li>
<li><strong>Finance companies</strong> raise funds in markets or from banks and lend to consumers and firms; in Vietnam, consumer finance companies are non-bank credit institutions licensed by the SBV.</li>
</ul>
<p>Together, market-based intermediaries that do bank-like maturity transformation without bank regulation — dealers funded by repo, money market funds, securitisation vehicles — are called the <strong>shadow banking system</strong>. Its runs in 2007–2008 (lesson 5.2) showed why regulators now look at activities, not only at institutions that hold a banking licence.</p>
<div class="callout"><span class="badge">Remember</span> Each institution transforms something: banks transform liquidity and maturity, insurers pool risk, pension funds shift income across a lifetime, funds provide diversification. Knowing what an institution transforms tells you where its risk lies.</div>`,
    `<span class="eyebrow">FIN301 · Phần 5 · Bài 5.4</span>
<h2>Công ty bảo hiểm, quỹ đầu tư, quỹ hưu trí và công ty chứng khoán</h2>
<p class="lead">Ngân hàng không phải trung gian duy nhất. Các tổ chức tiết kiệm theo hợp đồng và trung gian đầu tư nắm một phần lớn tiết kiệm của hộ gia đình, và chúng giải những bài toán khác: bảo vệ trước tổn thất, tích luỹ cho tuổi hưu, và tiếp cận danh mục đa dạng với chi phí thấp.</p>
<h3>Công ty bảo hiểm</h3>
<p>Công ty bảo hiểm thu <strong>phí bảo hiểm</strong> từ nhiều người tham gia và bồi thường cho số ít người gặp tổn thất; quy luật số lớn giúp tổng số tiền bồi thường dự đoán được. <strong>Công ty bảo hiểm nhân thọ</strong> có nghĩa vụ dài hạn, khá dễ dự đoán, nên nắm trái phiếu dài hạn, khoản vay thế chấp và một phần cổ phiếu. <strong>Công ty bảo hiểm phi nhân thọ</strong> đối mặt với bồi thường khó dự đoán hơn nên nắm nhiều tài sản thanh khoản hơn. <strong>Tái bảo hiểm</strong> giúp công ty bảo hiểm chuyển bớt một phần rủi ro lớn.</p>
<table>
<tr><th>Vấn đề</th><th>Công cụ của bảo hiểm</th></tr>
<tr><td>Lựa chọn bất lợi — người dễ yêu cầu bồi thường nhất lại muốn mua nhất</td><td>Sàng lọc (khám sức khoẻ, lịch sử lái xe), <strong>phí theo mức rủi ro</strong>, thời gian chờ</td></tr>
<tr><td>Rủi ro đạo đức — người được bảo hiểm kém cẩn thận hơn</td><td><strong>Mức khấu trừ</strong> và <strong>đồng bảo hiểm</strong> (người tham gia tự chịu một phần mỗi tổn thất), điều khoản hạn chế, huỷ hợp đồng, giới hạn mức bảo hiểm</td></tr>
</table>
<pre><code>Công ty bảo hiểm phi nhân thọ minh hoạ: phí 1.000, bồi thường 650, chi phí 300
Tỷ lệ bồi thường 65% + tỷ lệ chi phí 30% = tỷ lệ kết hợp 95%
Dưới 100% → lãi nghiệp vụ bảo hiểm bằng 5% phí, chưa tính thu nhập đầu tư</code></pre>
<h3>Quỹ hưu trí</h3>
<ul>
<li>Chế độ <strong>xác định trước mức hưởng (DB)</strong> hứa một mức lương hưu dựa trên tiền lương và số năm làm việc; bên tài trợ chịu rủi ro đầu tư, và quỹ bị <em>thiếu hụt</em> nếu tài sản thấp hơn giá trị hiện tại của các khoản đã hứa.</li>
<li>Chế độ <strong>xác định trước mức đóng (DC)</strong> cố định mức đóng góp; lương hưu phụ thuộc kết quả đầu tư, nên người tham gia chịu rủi ro.</li>
<li>Các chế độ công thường theo cơ chế <strong>thu – chi hằng năm (pay-as-you-go)</strong>: tiền đóng của người lao động hôm nay trả cho người hưu trí hôm nay, và điều này khó khăn hơn khi dân số già đi. Ở Việt Nam, bảo hiểm xã hội bắt buộc, gồm chế độ hưu trí, do Bảo hiểm xã hội Việt Nam quản lý, và cũng có các sản phẩm bảo hiểm hưu trí bổ sung tự nguyện — kiểm Luật Bảo hiểm xã hội đang có hiệu lực để biết quy định.</li>
</ul>
<h3>Quỹ đầu tư</h3>
<table>
<tr><th>Loại</th><th>Cách hoạt động</th></tr>
<tr><td><strong>Quỹ mở</strong></td><td>Phát hành và mua lại chứng chỉ quỹ vào mỗi ngày giao dịch theo giá trị tài sản ròng (NAV)</td></tr>
<tr><td><strong>Quỹ đóng</strong></td><td>Số chứng chỉ quỹ cố định, giao dịch trên sở giao dịch; giá có thể cao hơn hoặc thấp hơn NAV</td></tr>
<tr><td><strong>Quỹ hoán đổi danh mục (ETF)</strong></td><td>Thường mô phỏng một chỉ số; giao dịch trên sở như cổ phiếu, cơ chế tạo lập – mua lại giữ giá sát NAV</td></tr>
<tr><td><strong>Quỹ thị trường tiền tệ</strong></td><td>Đầu tư vào công cụ thị trường tiền tệ; rất thanh khoản nhưng không phải tiền gửi — không được bảo hiểm tiền gửi</td></tr>
<tr><td><strong>Quỹ phòng hộ</strong></td><td>Quản lý lỏng, dành cho nhà đầu tư giàu có và tổ chức; dùng đòn bẩy, bán khống và phái sinh</td></tr>
</table>
<pre><code>NAV mỗi chứng chỉ quỹ = (tài sản của quỹ − nợ của quỹ) / số chứng chỉ quỹ đang lưu hành
Minh hoạ: (520 tỷ − 20 tỷ) / 40 triệu chứng chỉ = 12.500 đồng mỗi chứng chỉ</code></pre>
<p>Quỹ mang lại đa dạng hoá, thanh khoản và quản lý chuyên nghiệp với chi phí thấp, đổi lại là các khoản phí (tỷ lệ chi phí). Ở Việt Nam, công ty quản lý quỹ được UBCKNN cấp phép và giám sát; ETF và chứng chỉ quỹ đóng được niêm yết trên các sở giao dịch, còn chứng chỉ quỹ mở được mua và bán lại qua đại lý phân phối theo NAV.</p>
<h3>Công ty chứng khoán, ngân hàng đầu tư và công ty tài chính</h3>
<ul>
<li><strong>Công ty chứng khoán</strong> làm môi giới (đại lý) và tự doanh (giao dịch cho chính mình), cho vay ký quỹ và làm phân tích; ở Việt Nam, công ty chứng khoán do UBCKNN cấp phép.</li>
<li><strong>Ngân hàng đầu tư</strong> bảo lãnh phát hành chứng khoán (bài 3.3), tư vấn mua bán và sáp nhập, và kinh doanh — những hoạt động tạo ra xung đột lợi ích mà quy định tìm cách kiềm chế.</li>
<li><strong>Công ty tài chính</strong> huy động vốn trên thị trường hoặc từ ngân hàng rồi cho người tiêu dùng và doanh nghiệp vay; ở Việt Nam, công ty tài chính tiêu dùng là tổ chức tín dụng phi ngân hàng do NHNN cấp phép.</li>
</ul>
<p>Gộp lại, các trung gian dựa vào thị trường thực hiện chuyển hoá kỳ hạn giống ngân hàng mà không chịu quy định như ngân hàng — nhà tạo lập vay bằng repo, quỹ thị trường tiền tệ, các phương tiện chứng khoán hoá — được gọi là <strong>hệ thống ngân hàng bóng</strong>. Các đợt rút vốn khỏi hệ thống này năm 2007–2008 (bài 5.2) cho thấy vì sao cơ quan quản lý giờ đây nhìn vào hoạt động, không chỉ vào những tổ chức có giấy phép ngân hàng.</p>
<div class="callout"><span class="badge">Ghi nhớ</span> Mỗi định chế chuyển hoá một thứ: ngân hàng chuyển hoá thanh khoản và kỳ hạn, công ty bảo hiểm gộp rủi ro, quỹ hưu trí dịch chuyển thu nhập qua cả đời người, quỹ đầu tư mang lại đa dạng hoá. Biết một định chế chuyển hoá cái gì là biết rủi ro của nó nằm ở đâu.</div>`,
  ]]);

const c13q = quiz('fin301-quiz-5', 'Quiz 5 — Financial institutions & regulation|||Quiz 5 — Định chế tài chính & quản lý nhà nước', [
  { id: 'q1', question: 'A bank has rate-sensitive assets of 400 and rate-sensitive liabilities of 500. If interest rates rise by 2 percentage points, net interest income changes by about…|||Một ngân hàng có tài sản nhạy cảm lãi suất 400 và nợ nhạy cảm lãi suất 500. Nếu lãi suất tăng 2 điểm phần trăm, thu nhập lãi ròng thay đổi khoảng…', options: ['+2|||+2', '−2|||−2', '−10|||−10', '0|||0'], correctIndex: 1, explanation: 'GAP = 400 − 500 = −100; change = −100 x 2% = −2. A negative gap loses when rates rise.|||Khe hở = 400 − 500 = −100; thay đổi = −100 x 2% = −2. Khe hở âm bị thiệt khi lãi suất tăng.' },
  { id: 'q2', question: 'Under Basel III, the minimum total capital ratio including the capital conservation buffer is…|||Theo Basel III, tỷ lệ tổng vốn tối thiểu tính cả bộ đệm bảo toàn vốn là…', options: ['10.5% of risk-weighted assets|||10,5% tài sản có rủi ro', '4.5% of risk-weighted assets|||4,5% tài sản có rủi ro', '8% of total assets, unweighted|||8% tổng tài sản, không tính trọng số', '3% of risk-weighted assets|||3% tài sản có rủi ro'], correctIndex: 0, explanation: 'Total capital minimum 8% + conservation buffer 2.5% = 10.5% of RWA. 4.5% is the CET1 minimum; 3% is the leverage ratio, which uses unweighted exposure.|||Tổng vốn tối thiểu 8% + bộ đệm bảo toàn 2,5% = 10,5% RWA. 4,5% là mức tối thiểu của CET1; 3% là tỷ lệ đòn bẩy, tính trên mức phơi nhiễm không trọng số.' },
  { id: 'q3', question: 'Why do insurance policies include deductibles?|||Vì sao hợp đồng bảo hiểm có mức khấu trừ?', options: ['To remove adverse selection completely|||Để loại bỏ hoàn toàn lựa chọn bất lợi', 'To let the insurer avoid paying any claims|||Để công ty bảo hiểm khỏi phải bồi thường', 'To reduce moral hazard by making the policyholder bear part of each loss|||Để giảm rủi ro đạo đức bằng cách buộc người tham gia tự chịu một phần mỗi tổn thất', 'Because regulators require insurers to hold less capital|||Vì cơ quan quản lý yêu cầu công ty bảo hiểm giữ ít vốn hơn'], correctIndex: 2, explanation: 'When part of every loss falls on the policyholder, he or she has a reason to take care. Screening and risk-based premiums address adverse selection.|||Khi một phần mỗi tổn thất rơi vào người tham gia, họ có lý do để cẩn thận. Sàng lọc và phí theo mức rủi ro mới là công cụ xử lý lựa chọn bất lợi.' },
]);

const taiLieu = doc('fin301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (kèm link), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">FIN301 · 📚 Resource hub</span>
<h2>Course materials &amp; references</h2>
<p class="lead">One hub for learning about financial markets and institutions: the official syllabus and slides, textbooks, free official resources, video channels, tools and a self-study roadmap.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>Sign in to <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) with your FPTU account to read the official FIN301 syllabus, learning outcomes, assessment structure and lecture slides. This course follows standard textbook structure; the official syllabus is the reference for what is examined.</p>
<h3>📗 Books</h3>
<ul>
<li><strong>Financial Markets and Institutions</strong> — Frederic S. Mishkin &amp; Stanley G. Eakins (<a href="https://www.pearson.com/" target="_blank" rel="noopener">Pearson</a> — search the title on the publisher’s site): the main reference for interest rates, the risk and term structure, central banking, markets and the economics of regulation and crises.</li>
<li><strong>Financial Markets and Institutions</strong> — Anthony Saunders &amp; Marcia Millon Cornett (<a href="https://www.mheducation.com/" target="_blank" rel="noopener">McGraw Hill</a> — search the title on the publisher’s site): strong on institutions and risk management — gap and duration, credit risk, capital regulation.</li>
</ul>
<h3>🌐 Free official resources</h3>
<ul>
<li><a href="https://openstax.org/details/books/principles-macroeconomics-3e" target="_blank" rel="noopener">OpenStax — Principles of Macroeconomics 3e</a> — free open textbook; its chapters on money, banking, monetary policy and exchange rates link this course with ECO121.</li>
<li><a href="https://www.khanacademy.org/economics-finance-domain" target="_blank" rel="noopener">Khan Academy — Economics &amp; finance</a> — free lessons on interest rates, bonds, stocks, banking and money creation.</li>
<li><a href="https://www.federalreserve.gov/monetarypolicy.htm" target="_blank" rel="noopener">Federal Reserve — Monetary policy</a> — FOMC statements, policy tools and explanations from the US central bank.</li>
<li><a href="https://www.bis.org/bcbs/basel3.htm" target="_blank" rel="noopener">Bank for International Settlements — Basel III</a> — the official framework for bank capital and liquidity.</li>
<li><a href="https://www.sbv.gov.vn/" target="_blank" rel="noopener">State Bank of Vietnam</a> — official exchange rates, interest rates and banking regulations in Vietnam.</li>
<li><a href="https://www.hsx.vn/" target="_blank" rel="noopener">HOSE</a> and <a href="https://www.hnx.vn/" target="_blank" rel="noopener">HNX</a> — Vietnam’s stock exchanges: listings, indices, government bond auctions and derivatives.</li>
<li><a href="https://www.investor.gov/" target="_blank" rel="noopener">Investor.gov (US SEC)</a> — plain-language guides to stocks, bonds, funds and investor protection.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@federalreserve" target="_blank" rel="noopener">Federal Reserve</a> — official explainers and press conferences on monetary policy.</li>
<li><a href="https://www.youtube.com/@IMF" target="_blank" rel="noopener">IMF</a> — short videos on exchange rates, financial stability and crises.</li>
<li><a href="https://www.youtube.com/@MarginalRevolutionUniversity" target="_blank" rel="noopener">Marginal Revolution University</a> — clear lessons on money, banking and the financial crisis.</li>
<li><a href="https://www.youtube.com/@ThePlainBagel" target="_blank" rel="noopener">The Plain Bagel</a> — plain-language explanations of bonds, stocks, funds and markets.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.microsoft.com/en-us/microsoft-365/excel" target="_blank" rel="noopener">Microsoft Excel</a> — YIELD, PRICE and TBILLYIELD-style functions to check every exercise.</li>
<li><a href="https://www.google.com/sheets/about/" target="_blank" rel="noopener">Google Sheets</a> — the same calculations, free and online; good for building a yield curve or a bank capital table.</li>
<li><a href="https://www.newyorkfed.org/markets/reference-rates/sofr" target="_blank" rel="noopener">New York Fed — SOFR</a> — daily data on the main US dollar reference rate (lesson 3.1).</li>
</ul>
<h3>🎯 Self-study roadmap</h3>
<ol>
<li><strong>Foundations (exam core)</strong> — the financial system, asymmetric information and interest-rate measurement, following Parts 1–2 here.</li>
<li><strong>Practise</strong> — redo Exercises 1–3 in a spreadsheet with new numbers until the formulas are automatic.</li>
<li><strong>Go deeper</strong> — read one SBV or Federal Reserve policy announcement and explain which tool changed and through which channel it works.</li>
<li><strong>Apply</strong> — take a listed Vietnamese bank’s published financial statements, rebuild its balance sheet in simplified form and compute ROA, ROE and the capital ratios as in Exercise 4, and NIM as in lesson 5.1.</li>
</ol>
<div class="callout"><span class="badge">Note</span> An original hub of real links — no copyrighted slides or books are embedded. If a link moves, start from the official homepage.</div>`,
    `<span class="eyebrow">FIN301 · 📚 Trung tâm tài liệu</span>
<h2>Tài liệu tham khảo môn học</h2>
<p class="lead">Một nơi gom để học về thị trường và định chế tài chính: giáo trình &amp; slide chính thức, sách giáo khoa, tài liệu miễn phí chính thống, kênh video, công cụ, và lộ trình tự học.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Đăng nhập <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) bằng tài khoản FPTU để đọc đề cương chính thức của FIN301, chuẩn đầu ra, cơ cấu đánh giá và slide bài giảng. Môn học ở đây bám cấu trúc giáo trình chuẩn; đề cương chính thức là căn cứ cho nội dung thi.</p>
<h3>📗 Sách</h3>
<ul>
<li><strong>Financial Markets and Institutions</strong> — Frederic S. Mishkin &amp; Stanley G. Eakins (<a href="https://www.pearson.com/" target="_blank" rel="noopener">Pearson</a> — tra tên sách trên trang nhà xuất bản): tài liệu chính về lãi suất, cấu trúc rủi ro và kỳ hạn, ngân hàng trung ương, các thị trường và kinh tế học của quản lý nhà nước và khủng hoảng.</li>
<li><strong>Financial Markets and Institutions</strong> — Anthony Saunders &amp; Marcia Millon Cornett (<a href="https://www.mheducation.com/" target="_blank" rel="noopener">McGraw Hill</a> — tra tên sách trên trang nhà xuất bản): mạnh về định chế và quản trị rủi ro — khe hở và thời lượng, rủi ro tín dụng, quy định về vốn.</li>
</ul>
<h3>🌐 Tài liệu chính thức miễn phí</h3>
<ul>
<li><a href="https://openstax.org/details/books/principles-macroeconomics-3e" target="_blank" rel="noopener">OpenStax — Principles of Macroeconomics 3e</a> — giáo trình mở miễn phí; các chương về tiền, ngân hàng, chính sách tiền tệ và tỷ giá nối môn này với ECO121.</li>
<li><a href="https://www.khanacademy.org/economics-finance-domain" target="_blank" rel="noopener">Khan Academy — Economics &amp; finance</a> — bài học miễn phí về lãi suất, trái phiếu, cổ phiếu, ngân hàng và quá trình tạo tiền.</li>
<li><a href="https://www.federalreserve.gov/monetarypolicy.htm" target="_blank" rel="noopener">Federal Reserve — Monetary policy</a> — tuyên bố của FOMC, công cụ chính sách và giải thích từ ngân hàng trung ương Mỹ.</li>
<li><a href="https://www.bis.org/bcbs/basel3.htm" target="_blank" rel="noopener">Ngân hàng Thanh toán Quốc tế — Basel III</a> — khung chính thức về vốn và thanh khoản ngân hàng.</li>
<li><a href="https://www.sbv.gov.vn/" target="_blank" rel="noopener">Ngân hàng Nhà nước Việt Nam</a> — tỷ giá, lãi suất chính thức và văn bản quy phạm về ngân hàng ở Việt Nam.</li>
<li><a href="https://www.hsx.vn/" target="_blank" rel="noopener">HOSE</a> và <a href="https://www.hnx.vn/" target="_blank" rel="noopener">HNX</a> — các sở giao dịch chứng khoán Việt Nam: niêm yết, chỉ số, đấu thầu trái phiếu chính phủ và phái sinh.</li>
<li><a href="https://www.investor.gov/" target="_blank" rel="noopener">Investor.gov (SEC Mỹ)</a> — hướng dẫn dễ hiểu về cổ phiếu, trái phiếu, quỹ và bảo vệ nhà đầu tư.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@federalreserve" target="_blank" rel="noopener">Federal Reserve</a> — video giải thích và họp báo chính thức về chính sách tiền tệ.</li>
<li><a href="https://www.youtube.com/@IMF" target="_blank" rel="noopener">IMF</a> — video ngắn về tỷ giá, ổn định tài chính và khủng hoảng.</li>
<li><a href="https://www.youtube.com/@MarginalRevolutionUniversity" target="_blank" rel="noopener">Marginal Revolution University</a> — bài giảng rõ ràng về tiền, ngân hàng và khủng hoảng tài chính.</li>
<li><a href="https://www.youtube.com/@ThePlainBagel" target="_blank" rel="noopener">The Plain Bagel</a> — giải thích trái phiếu, cổ phiếu, quỹ và thị trường bằng ngôn ngữ dễ hiểu.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.microsoft.com/en-us/microsoft-365/excel" target="_blank" rel="noopener">Microsoft Excel</a> — các hàm kiểu YIELD, PRICE, TBILLYIELD để kiểm lại mọi bài tập.</li>
<li><a href="https://www.google.com/sheets/about/" target="_blank" rel="noopener">Google Sheets</a> — cùng các phép tính đó, miễn phí và trực tuyến; hợp để dựng đường cong lợi suất hay bảng vốn ngân hàng.</li>
<li><a href="https://www.newyorkfed.org/markets/reference-rates/sofr" target="_blank" rel="noopener">New York Fed — SOFR</a> — số liệu hằng ngày của lãi suất tham chiếu chính cho đô la Mỹ (bài 3.1).</li>
</ul>
<h3>🎯 Lộ trình tự học</h3>
<ol>
<li><strong>Nền tảng (lõi thi)</strong> — hệ thống tài chính, thông tin bất cân xứng và đo lường lãi suất, theo đúng Phần 1–2 ở đây.</li>
<li><strong>Luyện tập</strong> — làm lại Bài tập 1–3 trên bảng tính với số mới cho tới khi thuộc công thức.</li>
<li><strong>Đào sâu</strong> — đọc một thông cáo chính sách của NHNN hoặc Fed và giải thích công cụ nào thay đổi, tác động qua kênh nào.</li>
<li><strong>Vận dụng</strong> — lấy báo cáo tài chính đã công bố của một ngân hàng niêm yết ở Việt Nam, dựng lại bảng cân đối dạng giản lược và tính ROA, ROE và các tỷ lệ vốn như Bài tập 4, và NIM như bài 5.1.</li>
</ol>
<div class="callout"><span class="badge">Lưu ý</span> Đây là trung tâm liên kết nguyên gốc — không nhúng slide/sách có bản quyền. Link đổi thì vào trang chủ chính thức để tìm.</div>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'FIN301',
    slug: 'fin301-financial-markets-and-institutions-thi-truong-t224i-ch237nh-v224-c225c-inh-che-t224i-ch237nh',
    title: 'Financial Markets and Institutions',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/FIN301.webp',
    shortDescription: 'How funds move from savers to borrowers: asymmetric information, interest rates and the yield curve, central banks, money, bond, stock and FX markets, derivatives, banks and Basel, insurers, funds and crises. Bilingual, with exercises and quizzes.|||Vốn chảy từ người tiết kiệm tới người vay: thông tin bất cân xứng, lãi suất, đường cong lợi suất, ngân hàng trung ương, các thị trường, phái sinh, ngân hàng và Basel, quỹ, khủng hoảng. Song ngữ, có bài tập và quiz.',
    description: 'Môn <strong>FIN301 — Financial Markets and Institutions (Thị trường và các định chế tài chính)</strong> (khối Quản trị Kinh doanh, kỳ 3) giải thích vốn đi từ người tiết kiệm tới người cần vốn như thế nào và vì sao hệ thống đó cần được quản lý. Từ <strong>hệ thống tài chính và thông tin bất cân xứng</strong> (lựa chọn bất lợi, rủi ro đạo đức) → <strong>đo lường lãi suất</strong> (lợi suất đến hạn, lợi suất chiết khấu, lãi suất thực) → <strong>hành vi, cấu trúc rủi ro và cấu trúc kỳ hạn của lãi suất</strong> và <strong>ngân hàng trung ương</strong> → <strong>thị trường tiền tệ, trái phiếu, cổ phiếu</strong> (kể cả HOSE, HNX, UPCoM) → <strong>ngoại hối và phái sinh</strong> (ngang giá lãi suất có bảo hiểm, kỳ hạn, tương lai, quyền chọn, hoán đổi) → <strong>ngân hàng thương mại, chuẩn vốn Basel, định chế phi ngân hàng và khủng hoảng tài chính</strong>. Bám cấu trúc giáo trình Mishkin &amp; Eakins và Saunders &amp; Cornett, song ngữ Anh–Việt, mọi ví dụ số là giả định và đã kiểm bằng máy, có 4 bài tập kèm lời giải và quiz cuối mỗi phần.',
    whatYouLearn: 'Giải thích chức năng của hệ thống tài chính, tài chính trực tiếp và gián tiếp, lựa chọn bất lợi và rủi ro đạo đức\nTính lợi suất đến hạn, lợi suất chiết khấu, lợi suất tương đương trái phiếu và lãi suất thực\nPhân tích biến động lãi suất bằng khung cung – cầu trái phiếu và ưa thích thanh khoản\nĐọc cấu trúc rủi ro, xếp hạng tín nhiệm và đường cong lợi suất; suy lãi suất kỳ hạn theo lý thuyết kỳ vọng\nMô tả công cụ và kênh truyền dẫn của chính sách tiền tệ, liên hệ Fed và Ngân hàng Nhà nước Việt Nam\nPhân biệt các công cụ thị trường tiền tệ, trái phiếu, cổ phiếu và cấu trúc thị trường chứng khoán Việt Nam\nTính tỷ giá kỳ hạn theo ngang giá lãi suất có bảo hiểm; hiểu kỳ hạn, tương lai, quyền chọn và hoán đổi\nPhân tích bảng cân đối ngân hàng, khe hở lãi suất, tỷ lệ an toàn vốn Basel và vai trò của định chế phi ngân hàng',
    requirements: 'Nên học trước FIN202 — Principles of Corporate Finance (giá trị thời gian của tiền, định giá trái phiếu và cổ phiếu)\nNên học trước hoặc song song ECO121 — kinh tế vĩ mô (tiền, lạm phát, chính sách tiền tệ)\nMáy tính cầm tay hoặc bảng tính (Excel, Google Sheets) để luyện bài',
  },
  sections: [
    { title: '📚 Course materials|||📚 Tài liệu tham khảo', description: 'Giáo trình & slide trên FLM, sách, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Course introduction|||Giới thiệu môn học', description: 'Hệ thống tài chính làm gì, liên hệ FIN202 và ECO121, lộ trình.', lessons: [intro] },
    { title: 'Part 1 — The financial system & interest rates|||Phần 1 — Hệ thống tài chính & lãi suất', description: 'Tài chính trực tiếp và gián tiếp, thông tin bất cân xứng, YTM, lợi suất chiết khấu, lãi suất thực.', lessons: [c1, c2, c2e, c2q] },
    { title: 'Part 2 — Interest-rate behaviour, structure & central banking|||Phần 2 — Hành vi, cấu trúc lãi suất & ngân hàng trung ương', description: 'Cung cầu trái phiếu, ưa thích thanh khoản, cấu trúc rủi ro và kỳ hạn, chính sách tiền tệ.', lessons: [c3, c4, c4e, c5, c5q] },
    { title: 'Part 3 — Money, bond & stock markets|||Phần 3 — Thị trường tiền tệ, trái phiếu & cổ phiếu', description: 'Tín phiếu, liên ngân hàng, repo, thương phiếu, trái phiếu, cổ phiếu, HOSE, HNX, UPCoM.', lessons: [c6, c7, c8, c8q] },
    { title: 'Part 4 — Foreign exchange & derivatives|||Phần 4 — Ngoại hối & phái sinh', description: 'Tỷ giá giao ngay và kỳ hạn, PPP, ngang giá lãi suất, kỳ hạn, tương lai, quyền chọn, hoán đổi.', lessons: [c9, c9e, c10, c10q] },
    { title: 'Part 5 — Financial institutions, regulation & crises|||Phần 5 — Định chế tài chính, quản lý nhà nước & khủng hoảng', description: 'Ngân hàng thương mại, Basel, bảo hiểm, quỹ, quỹ hưu trí, khủng hoảng tài chính.', lessons: [c11, c12, c12e, c13, c13q] },
  ],
};
