/**
 * IPM301 — Investments and Portfolio Management. Giáo trình tham khảo (trích
 * dẫn, KHÔNG upload PDF): Bodie/Kane/Marcus "Investments"; Reilly/Brown
 * "Investment Analysis and Portfolio Management"; CFA curriculum. Nhấn ĐẦU TƯ
 * (chứng khoán, định giá) — khác AAP301 (Asset Allocation, nhấn PHÂN BỔ).
 * 8 chương: tổng quan & môi trường đầu tư → thị trường & công cụ (cổ phiếu,
 * trái phiếu) → rủi ro/lợi nhuận & lý thuyết danh mục → định giá cổ phiếu
 * (DDM, P/E) → định giá trái phiếu & lãi suất → CAPM & thị trường hiệu quả →
 * xây dựng & quản lý danh mục → đánh giá hiệu quả, tài chính hành vi & thị
 * trường Việt Nam (HOSE/HNX). Số liệu ví dụ đều GIẢ ĐỊNH. KHÔNG khuyến nghị
 * đầu tư. Song ngữ + ví dụ + quiz. Giữ NGUYÊN slug/semester/thumb(v3).
 * ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('ipm301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình tham khảo (Bodie/Kane/Marcus, Reilly/Brown, CFA), tài liệu chính thức miễn phí, YouTube, công cụ tra dữ liệu, lộ trình tự học.',
  [[
    `<span class="eyebrow">IPM301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Investments and Portfolio Management — markets &amp; instruments, risk/return, valuation of stocks &amp; bonds, CAPM, portfolio construction and performance evaluation — in one place. This subject leans toward <strong>investment analysis and valuation</strong>; if you want a deep dive into strategic/tactical asset allocation across asset classes, that is covered separately in <strong>AAP301</strong>.</p>
<h3>📘 Reference textbooks (cited, not distributed)</h3>
<ul>
<li><em>Investments</em> — Bodie, Kane &amp; Marcus (McGraw-Hill) — the standard reference for this subject's core: markets, risk/return, CAPM, market efficiency, equity &amp; bond valuation.</li>
<li><em>Investment Analysis and Portfolio Management</em> — Reilly &amp; Brown (Cengage) — strong on portfolio management process and performance evaluation.</li>
<li>CFA Institute curriculum (Level I) — Equity, Fixed Income and Portfolio Management readings — a free, official syllabus outline is on the CFA Institute site.</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.investopedia.com/" target="_blank" rel="noopener">Investopedia</a> — definitions and worked examples for every term in this course.</li>
<li><a href="https://www.cfainstitute.org/" target="_blank" rel="noopener">CFA Institute</a> — official curriculum topic outlines.</li>
<li><a href="https://www.hsx.vn/" target="_blank" rel="noopener">HOSE — Sở Giao dịch Chứng khoán TP.HCM</a> — dữ liệu &amp; quy chế thị trường Việt Nam.</li>
<li><a href="https://hnx.vn/" target="_blank" rel="noopener">HNX — Sở Giao dịch Chứng khoán Hà Nội</a>.</li>
<li><a href="https://www.ssc.gov.vn/" target="_blank" rel="noopener">UBCKNN (SSC)</a> — cơ quan quản lý thị trường chứng khoán Việt Nam.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@Investopedia" target="_blank" rel="noopener">Investopedia</a> — short explainer videos on investing concepts.</li>
<li><a href="https://www.youtube.com/@PatrickBoyleOnFinance" target="_blank" rel="noopener">Patrick Boyle</a> — portfolio theory &amp; market structure with a critical eye.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://finance.yahoo.com/" target="_blank" rel="noopener">Yahoo Finance</a> — free stock/bond quotes, historical prices, financial statements.</li>
<li><a href="https://cafef.vn/" target="_blank" rel="noopener">CafeF</a>, <a href="https://vietstock.vn/" target="_blank" rel="noopener">Vietstock</a> — dữ liệu &amp; tin tức thị trường Việt Nam.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — investment environment, markets &amp; instruments, holding period return, risk &amp; diversification.</li>
<li><strong>Practice</strong> — recompute the worked (assumed) examples in each lesson by hand before trusting a spreadsheet.</li>
<li><strong>Go deeper</strong> — DDM &amp; P/E valuation, bond pricing, CAPM, efficient markets, portfolio construction.</li>
<li><strong>Exam-ready</strong> — performance ratios (Sharpe/Treynor/Jensen), behavioral biases, Vietnam market mechanics (HOSE/HNX, T+, room ngoại).</li>
</ol></div>
<div class="callout"><span class="badge">Not investment advice</span> Every number in this course is an assumed teaching example, not a live quote or a recommendation to buy/sell any security. Real markets carry real risk of loss.</div>`,
    `<span class="eyebrow">IPM301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Đầu tư và Quản lý danh mục — thị trường &amp; công cụ, rủi ro/lợi nhuận, định giá cổ phiếu &amp; trái phiếu, CAPM, xây dựng danh mục và đánh giá hiệu quả — gom về một chỗ. Môn này nghiêng về <strong>phân tích &amp; định giá đầu tư</strong>; nếu muốn đào sâu phân bổ tài sản chiến lược/chiến thuật qua nhiều lớp tài sản, phần đó nằm riêng ở môn <strong>AAP301</strong>.</p>
<h3>📘 Giáo trình tham khảo (trích dẫn, không phát hành lại)</h3>
<ul>
<li><em>Investments</em> — Bodie, Kane &amp; Marcus (McGraw-Hill) — tài liệu chuẩn cho phần lõi môn này: thị trường, rủi ro/lợi nhuận, CAPM, thị trường hiệu quả, định giá cổ phiếu &amp; trái phiếu.</li>
<li><em>Investment Analysis and Portfolio Management</em> — Reilly &amp; Brown (Cengage) — mạnh về quy trình quản lý danh mục và đánh giá hiệu quả.</li>
<li>Giáo trình CFA Institute (Level I) — phần Equity, Fixed Income và Portfolio Management — đề cương chính thức miễn phí trên trang CFA Institute.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.investopedia.com/" target="_blank" rel="noopener">Investopedia</a> — định nghĩa và ví dụ tính toán cho mọi thuật ngữ của môn.</li>
<li><a href="https://www.cfainstitute.org/" target="_blank" rel="noopener">CFA Institute</a> — đề cương chương trình chính thức.</li>
<li><a href="https://www.hsx.vn/" target="_blank" rel="noopener">HOSE — Sở Giao dịch Chứng khoán TP.HCM</a> — dữ liệu &amp; quy chế thị trường Việt Nam.</li>
<li><a href="https://hnx.vn/" target="_blank" rel="noopener">HNX — Sở Giao dịch Chứng khoán Hà Nội</a>.</li>
<li><a href="https://www.ssc.gov.vn/" target="_blank" rel="noopener">UBCKNN (SSC)</a> — cơ quan quản lý thị trường chứng khoán Việt Nam.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@Investopedia" target="_blank" rel="noopener">Investopedia</a> — video ngắn giải thích khái niệm đầu tư.</li>
<li><a href="https://www.youtube.com/@PatrickBoyleOnFinance" target="_blank" rel="noopener">Patrick Boyle</a> — lý thuyết danh mục &amp; cấu trúc thị trường, góc nhìn phản biện.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://finance.yahoo.com/" target="_blank" rel="noopener">Yahoo Finance</a> — báo giá cổ phiếu/trái phiếu, giá lịch sử, báo cáo tài chính miễn phí.</li>
<li><a href="https://cafef.vn/" target="_blank" rel="noopener">CafeF</a>, <a href="https://vietstock.vn/" target="_blank" rel="noopener">Vietstock</a> — dữ liệu &amp; tin tức thị trường Việt Nam.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — môi trường đầu tư, thị trường &amp; công cụ, tỉ suất sinh lợi nắm giữ, rủi ro &amp; đa dạng hoá.</li>
<li><strong>Luyện tập</strong> — tự tính lại ví dụ giả định trong từng bài bằng tay trước khi tin bảng tính.</li>
<li><strong>Đào sâu</strong> — định giá DDM &amp; P/E, định giá trái phiếu, CAPM, thị trường hiệu quả, xây dựng danh mục.</li>
<li><strong>Sẵn sàng thi</strong> — các tỉ số hiệu quả (Sharpe/Treynor/Jensen), thiên lệch hành vi, cơ chế thị trường Việt Nam (HOSE/HNX, T+, room ngoại).</li>
</ol></div>
<div class="callout"><span class="badge">Không phải lời khuyên đầu tư</span> Mọi số liệu trong môn này là ví dụ giả định để học, không phải giá thật hay khuyến nghị mua/bán. Thị trường thật luôn có rủi ro mất tiền.</div>`,
  ]]);

const intro = doc('ipm301-0-1-overview', 'Course overview: Investments and Portfolio Management|||Tổng quan môn: Đầu tư và Quản lý danh mục',
  'Đầu tư là gì; vì sao học môn này (phân tích & định giá, khác AAP301 nhấn phân bổ); lộ trình 8 chương; nguyên tắc: mọi ví dụ đều giả định, không khuyến nghị đầu tư.',
  [[
    `<span class="eyebrow">IPM301 · Lesson 0.1 · Overview</span>
<h2>Investments and Portfolio Management</h2>
<p class="lead">This course teaches you how to <strong>analyze and value financial securities</strong> — mainly stocks and bonds — and how to combine them into a portfolio, measure risk, and judge whether the result performed well. It sits next to <strong>AAP301 (Asset Allocation and Portfolio Management)</strong>, but the two emphasize different things: AAP301 focuses on <em>allocation</em> — how much to put into stocks vs bonds vs other asset classes; IPM301 focuses on <em>investment analysis</em> — how to price an individual stock or bond and understand the risk/return trade-off behind it.</p>
<h3>Why this matters</h3>
<p>Every saver eventually faces the same question: where to put money so it grows without unacceptable risk of loss. This course gives you the vocabulary and the formulas — holding period return, standard deviation, DDM, YTM, CAPM, Sharpe ratio — to reason about that question rigorously instead of by gut feeling.</p>
<h3>Roadmap (8 chapters)</h3>
<ol>
<li>Investment overview &amp; the investment environment</li>
<li>Financial markets &amp; instruments (stocks, bonds)</li>
<li>Risk, return &amp; portfolio theory</li>
<li>Equity valuation (DDM, P/E, fundamental analysis)</li>
<li>Bond valuation &amp; interest rates</li>
<li>CAPM &amp; market efficiency</li>
<li>Portfolio construction &amp; management</li>
<li>Performance evaluation, behavioral finance &amp; Vietnam's stock market (HOSE/HNX)</li>
</ol>
<div class="callout"><span class="badge">Ground rule</span> Every number used as an example in this course — prices, dividends, rates, betas — is <strong>assumed</strong> for teaching purposes. Nothing here is a recommendation to buy or sell any real security; real investing carries real risk of loss.</div>`,
    `<span class="eyebrow">IPM301 · Bài 0.1 · Tổng quan</span>
<h2>Đầu tư và Quản lý danh mục</h2>
<p class="lead">Môn này dạy bạn <strong>phân tích và định giá chứng khoán</strong> — chủ yếu là cổ phiếu và trái phiếu — rồi kết hợp chúng thành một danh mục, đo rủi ro, và đánh giá kết quả có tốt hay không. Môn này nằm cạnh <strong>AAP301 (Asset Allocation and Portfolio Management)</strong>, nhưng hai môn nhấn khác nhau: AAP301 nhấn <em>phân bổ</em> — bao nhiêu tiền vào cổ phiếu, trái phiếu, hay lớp tài sản khác; IPM301 nhấn <em>phân tích đầu tư</em> — cách định giá một cổ phiếu hay trái phiếu cụ thể và hiểu đánh đổi rủi ro/lợi nhuận phía sau nó.</p>
<h3>Vì sao môn này quan trọng</h3>
<p>Ai tiết kiệm rồi cũng gặp câu hỏi: nên để tiền ở đâu để sinh lời mà không chịu rủi ro mất tiền quá mức. Môn này cho bạn từ vựng và công thức — tỉ suất sinh lợi nắm giữ, độ lệch chuẩn, DDM, YTM, CAPM, tỉ số Sharpe — để suy luận câu hỏi đó một cách chặt chẽ, thay vì theo cảm tính.</p>
<h3>Lộ trình (8 chương)</h3>
<ol>
<li>Tổng quan đầu tư &amp; môi trường đầu tư</li>
<li>Thị trường &amp; công cụ tài chính (cổ phiếu, trái phiếu)</li>
<li>Rủi ro, lợi nhuận &amp; lý thuyết danh mục</li>
<li>Định giá cổ phiếu (DDM, P/E, phân tích cơ bản)</li>
<li>Định giá trái phiếu &amp; lãi suất</li>
<li>CAPM &amp; thị trường hiệu quả</li>
<li>Xây dựng &amp; quản lý danh mục đầu tư</li>
<li>Đánh giá hiệu quả, tài chính hành vi &amp; thị trường Việt Nam (HOSE/HNX)</li>
</ol>
<div class="callout"><span class="badge">Nguyên tắc nền</span> Mọi số liệu dùng làm ví dụ trong môn này — giá, cổ tức, lãi suất, beta — đều là số <strong>giả định</strong> để học. Không có nội dung nào ở đây là khuyến nghị mua/bán chứng khoán thật; đầu tư thật luôn có rủi ro mất tiền.</div>`,
  ]]);

const c1 = doc('ipm301-1-1-tong-quan-moi-truong', '1.1 — Investment overview & the investment environment|||1.1 — Tổng quan đầu tư & môi trường đầu tư',
  'Đầu tư = hoãn tiêu dùng hôm nay để đổi lấy lợi ích lớn hơn tương lai; tài sản thực vs tài sản tài chính; các bên tham gia; thị trường sơ cấp vs thứ cấp.',
  [[
    `<span class="eyebrow">IPM301 · Chapter 1 · Lesson 1.1</span>
<h2>Investment overview &amp; the investment environment</h2>
<h3>What is "investing"?</h3>
<p><strong>Investing</strong> means committing money now in exchange for expected benefits later — giving up certain current consumption for (uncertain) greater future consumption. The core trade-off running through this whole course is <strong>risk vs return</strong>: higher expected return generally requires accepting higher risk of loss.</p>
<h3>Real assets vs financial assets</h3>
<ul>
<li><strong>Real assets</strong> — land, buildings, machinery, knowledge — determine the productive capacity of an economy; they generate real income.</li>
<li><strong>Financial assets</strong> — stocks, bonds, deposits — are claims on the income generated by real assets. They don't add to society's wealth directly, but they let households, firms and governments allocate consumption and risk efficiently across time and across people.</li>
</ul>
<h3>Players in the investment environment</h3>
<ul>
<li><strong>Firms</strong> — usually net borrowers; issue securities to fund real investment.</li>
<li><strong>Households</strong> — usually net savers/lenders; buy securities to grow wealth for future consumption (retirement, education).</li>
<li><strong>Government</strong> — can be either, financing deficits by issuing bonds.</li>
<li><strong>Financial intermediaries</strong> (banks, insurance companies, investment funds) and <strong>investment banks</strong> connect savers to borrowers and help firms issue new securities.</li>
</ul>
<h3>Primary vs secondary markets</h3>
<p>The <strong>primary market</strong> is where a security is sold for the first time (e.g. an IPO) — the issuer receives the proceeds. The <strong>secondary market</strong> (e.g. a stock exchange) is where existing securities trade between investors — the issuer receives nothing further, but secondary trading provides the <em>liquidity</em> that makes investors willing to buy in the primary market in the first place.</p>
<pre><code>Flow of funds (simplified):
 Households (savers) --money--&gt; Financial intermediaries / markets --money--&gt; Firms &amp; Government (borrowers)
 Firms &amp; Government --securities (stocks, bonds)--&gt; Households (via markets)
</code></pre>
<div class="callout"><span class="badge">Regulator, Vietnam</span> In Vietnam, securities markets are supervised by the <strong>State Securities Commission (UBCKNN/SSC)</strong>, with trading organized on HOSE and HNX exchanges — covered in Chapter 8.</div>`,
    `<span class="eyebrow">IPM301 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan đầu tư &amp; môi trường đầu tư</h2>
<h3>"Đầu tư" là gì?</h3>
<p><strong>Đầu tư</strong> là bỏ tiền ra ở hiện tại để đổi lấy lợi ích kỳ vọng trong tương lai — hy sinh tiêu dùng chắc chắn hôm nay để đổi lấy tiêu dùng (không chắc chắn) lớn hơn sau này. Đánh đổi cốt lõi chạy suốt môn này là <strong>rủi ro và lợi nhuận</strong>: lợi nhuận kỳ vọng cao hơn thường đi kèm rủi ro mất tiền cao hơn.</p>
<h3>Tài sản thực vs tài sản tài chính</h3>
<ul>
<li><strong>Tài sản thực</strong> — đất, nhà máy, máy móc, kiến thức — quyết định năng lực sản xuất của nền kinh tế; chúng tạo ra thu nhập thực.</li>
<li><strong>Tài sản tài chính</strong> — cổ phiếu, trái phiếu, tiền gửi — là quyền đòi trên thu nhập do tài sản thực tạo ra. Chúng không trực tiếp làm giàu xã hội, nhưng giúp hộ gia đình, doanh nghiệp, chính phủ phân bổ tiêu dùng và rủi ro hiệu quả qua thời gian và giữa các bên.</li>
</ul>
<h3>Các bên tham gia môi trường đầu tư</h3>
<ul>
<li><strong>Doanh nghiệp</strong> — thường là bên đi vay ròng; phát hành chứng khoán để tài trợ đầu tư thực.</li>
<li><strong>Hộ gia đình</strong> — thường là bên tiết kiệm/cho vay ròng; mua chứng khoán để tăng tài sản cho tiêu dùng tương lai (hưu trí, học tập).</li>
<li><strong>Chính phủ</strong> — có thể là cả hai vai, tài trợ thâm hụt bằng phát hành trái phiếu.</li>
<li><strong>Trung gian tài chính</strong> (ngân hàng, công ty bảo hiểm, quỹ đầu tư) và <strong>ngân hàng đầu tư</strong> kết nối người tiết kiệm với người vay và giúp doanh nghiệp phát hành chứng khoán mới.</li>
</ul>
<h3>Thị trường sơ cấp vs thứ cấp</h3>
<p><strong>Thị trường sơ cấp</strong> là nơi chứng khoán được bán lần đầu (ví dụ IPO) — tổ chức phát hành nhận tiền. <strong>Thị trường thứ cấp</strong> (ví dụ sàn giao dịch) là nơi chứng khoán đã phát hành mua bán giữa các nhà đầu tư — tổ chức phát hành không nhận thêm gì, nhưng giao dịch thứ cấp tạo ra <em>tính thanh khoản</em> khiến nhà đầu tư sẵn lòng mua ở thị trường sơ cấp ngay từ đầu.</p>
<pre><code>Luồng vốn (đơn giản hoá):
 Hộ gia đình (tiết kiệm) --tiền--&gt; Trung gian tài chính / thị trường --tiền--&gt; Doanh nghiệp &amp; Chính phủ (đi vay)
 Doanh nghiệp &amp; Chính phủ --chứng khoán (cổ phiếu, trái phiếu)--&gt; Hộ gia đình (qua thị trường)
</code></pre>
<div class="callout"><span class="badge">Cơ quan quản lý ở Việt Nam</span> Ở Việt Nam, thị trường chứng khoán do <strong>Uỷ ban Chứng khoán Nhà nước (UBCKNN)</strong> quản lý, giao dịch tổ chức trên sàn HOSE và HNX — nội dung chi tiết ở Chương 8.</div>`,
  ]]);

const c1q = quiz('ipm301-quiz-1', 'Quiz 1 — Investment environment|||Quiz 1 — Môi trường đầu tư', [
  { id: 'q1', question: 'Tài sản nào là "tài sản tài chính" (financial asset)?', options: ['Nhà máy sản xuất', 'Trái phiếu doanh nghiệp', 'Kiến thức/công nghệ', 'Đất đai'], correctIndex: 1, explanation: 'Trái phiếu là quyền đòi trên thu nhập của tài sản thực — đó là tài sản tài chính. Nhà máy, đất, kiến thức là tài sản thực.' },
  { id: 'q2', question: 'Thị trường sơ cấp (primary market) khác thị trường thứ cấp (secondary market) ở điểm nào?', options: ['Sơ cấp chỉ giao dịch trái phiếu', 'Sơ cấp là nơi phát hành lần đầu, tiền về tổ chức phát hành', 'Thứ cấp không cần thanh khoản', 'Không có sự khác biệt'], correctIndex: 1, explanation: 'Sơ cấp: bán lần đầu, tổ chức phát hành nhận tiền. Thứ cấp: nhà đầu tư mua bán lại với nhau.' },
  { id: 'q3', question: 'Vai trò của trung gian tài chính (ngân hàng, quỹ đầu tư) là gì?', options: ['Tự tạo ra tài sản thực', 'Kết nối người tiết kiệm với người cần vốn', 'Xoá bỏ hoàn toàn rủi ro đầu tư', 'Ấn định giá cổ phiếu cố định'], correctIndex: 1, explanation: 'Trung gian tài chính giúp dòng vốn chảy từ người tiết kiệm sang người cần vốn (doanh nghiệp, chính phủ).' },
]);

const c2 = doc('ipm301-2-1-thi-truong-cong-cu', '2.1 — Financial markets & instruments (stocks, bonds)|||2.1 — Thị trường & công cụ tài chính (cổ phiếu, trái phiếu)',
  'Thị trường tiền tệ vs thị trường vốn; cổ phiếu thường & ưu đãi (quyền biểu quyết, cổ tức); trái phiếu (mệnh giá, coupon, kỳ hạn).',
  [[
    `<span class="eyebrow">IPM301 · Chapter 2 · Lesson 2.1</span>
<h2>Financial markets &amp; instruments</h2>
<h3>Money market vs capital market</h3>
<ul>
<li><strong>Money market</strong> — short-term (under 1 year), highly liquid, low-risk instruments: T-bills, commercial paper, certificates of deposit. Used for cash management, not long-term growth.</li>
<li><strong>Capital market</strong> — longer-term instruments: stocks (no maturity) and bonds (maturity typically &gt; 1 year). This is where most long-term investing and this course happen.</li>
</ul>
<h3>Common stock</h3>
<p><strong>Common stock</strong> represents residual ownership in a firm. Holders get: (1) <strong>voting rights</strong> on major decisions (e.g. electing the board); (2) a claim on profits paid as <strong>dividends</strong>, at the board's discretion — not guaranteed; (3) <strong>capital gains</strong> if the share price rises. Common stockholders are paid last in a liquidation, after all creditors and preferred stockholders — they bear the most risk but keep all the upside.</p>
<h3>Preferred stock</h3>
<p><strong>Preferred stock</strong> pays a fixed dividend (like a bond) and ranks above common stock — but usually below bonds — in a liquidation. It typically carries no voting rights. It sits "between" debt and common equity in risk and payoff.</p>
<h3>Bonds (fixed-income securities)</h3>
<ul>
<li><strong>Face value (par value)</strong> — the amount repaid at maturity (e.g. an assumed 1,000).</li>
<li><strong>Coupon rate</strong> — the fixed annual interest rate paid on face value (e.g. an assumed 6% coupon pays 60/year on a 1,000 face value bond).</li>
<li><strong>Maturity</strong> — the date the face value is repaid.</li>
</ul>
<pre><code>Assumed example — a corporate bond:
 Face value = 1,000 ; Coupon rate = 6% ; Maturity = 5 years
 Annual coupon = 6% x 1,000 = 60
 At maturity: bondholder receives the final coupon (60) + face value (1,000)
</code></pre>
<div class="callout"><span class="badge">Key contrast</span> Bondholders are <strong>creditors</strong> with a contractual, fixed claim; stockholders are <strong>owners</strong> with a residual, variable claim. That difference drives every valuation formula in Chapters 4 and 5.</div>`,
    `<span class="eyebrow">IPM301 · Chương 2 · Bài 2.1</span>
<h2>Thị trường &amp; công cụ tài chính</h2>
<h3>Thị trường tiền tệ vs thị trường vốn</h3>
<ul>
<li><strong>Thị trường tiền tệ (money market)</strong> — công cụ ngắn hạn (dưới 1 năm), thanh khoản cao, rủi ro thấp: tín phiếu kho bạc, thương phiếu, chứng chỉ tiền gửi. Dùng để quản lý tiền mặt, không phải để tăng trưởng dài hạn.</li>
<li><strong>Thị trường vốn (capital market)</strong> — công cụ dài hạn hơn: cổ phiếu (không có kỳ hạn) và trái phiếu (kỳ hạn thường &gt; 1 năm). Đây là nơi phần lớn hoạt động đầu tư dài hạn và nội dung môn này diễn ra.</li>
</ul>
<h3>Cổ phiếu thường</h3>
<p><strong>Cổ phiếu thường</strong> đại diện quyền sở hữu còn lại trong doanh nghiệp. Người nắm giữ có: (1) <strong>quyền biểu quyết</strong> trong các quyết định lớn (vd bầu hội đồng quản trị); (2) quyền hưởng lợi nhuận trả dưới dạng <strong>cổ tức</strong>, do hội đồng quản trị quyết định — không được đảm bảo; (3) <strong>lãi vốn (capital gain)</strong> nếu giá cổ phiếu tăng. Cổ đông thường được trả sau cùng khi giải thể, sau mọi chủ nợ và cổ phiếu ưu đãi — chịu rủi ro cao nhất nhưng giữ toàn bộ phần lợi nhuận tăng thêm.</p>
<h3>Cổ phiếu ưu đãi</h3>
<p><strong>Cổ phiếu ưu đãi</strong> trả cổ tức cố định (giống trái phiếu) và đứng trên cổ phiếu thường — nhưng thường dưới trái phiếu — khi giải thể. Thường không có quyền biểu quyết. Nó nằm "giữa" nợ và vốn chủ sở hữu thường về rủi ro và lợi ích.</p>
<h3>Trái phiếu (công cụ thu nhập cố định)</h3>
<ul>
<li><strong>Mệnh giá (face value)</strong> — số tiền được trả lại khi đến hạn (ví dụ giả định 1.000).</li>
<li><strong>Lãi suất coupon</strong> — tỉ lệ lãi hàng năm cố định trên mệnh giá (vd coupon giả định 6% trả 60/năm cho trái phiếu mệnh giá 1.000).</li>
<li><strong>Kỳ hạn (maturity)</strong> — ngày mệnh giá được trả lại.</li>
</ul>
<pre><code>Ví dụ giả định — một trái phiếu doanh nghiệp:
 Mệnh giá = 1.000 ; Lãi coupon = 6% ; Kỳ hạn = 5 năm
 Coupon hàng năm = 6% x 1.000 = 60
 Khi đến hạn: người nắm trái phiếu nhận coupon cuối (60) + mệnh giá (1.000)
</code></pre>
<div class="callout"><span class="badge">Đối chiếu cốt lõi</span> Người nắm trái phiếu là <strong>chủ nợ</strong> với quyền đòi cố định theo hợp đồng; cổ đông là <strong>chủ sở hữu</strong> với quyền đòi còn lại, biến động. Sự khác biệt này chi phối mọi công thức định giá ở Chương 4 và 5.</div>`,
  ]]);

const c2q = quiz('ipm301-quiz-2', 'Quiz 2 — Markets & instruments|||Quiz 2 — Thị trường & công cụ', [
  { id: 'q1', question: 'Công cụ nào thuộc thị trường tiền tệ (money market)?', options: ['Cổ phiếu thường', 'Trái phiếu 10 năm', 'Tín phiếu kho bạc (T-bill)', 'Cổ phiếu ưu đãi'], correctIndex: 2, explanation: 'Tín phiếu kho bạc là công cụ ngắn hạn, thanh khoản cao — đặc trưng của thị trường tiền tệ.' },
  { id: 'q2', question: 'Cổ đông thường (common stockholder) được trả khi doanh nghiệp giải thể ở vị trí nào?', options: ['Đầu tiên, trước cả chủ nợ', 'Sau cùng, sau chủ nợ và cổ phiếu ưu đãi', 'Ngang hàng với chủ nợ', 'Không được trả trong mọi trường hợp'], correctIndex: 1, explanation: 'Cổ đông thường có quyền đòi "còn lại" — được trả sau cùng, nên chịu rủi ro cao nhất.' },
  { id: 'q3', question: 'Trái phiếu mệnh giá 1.000, coupon 6% trả hàng năm bao nhiêu tiền lãi?', options: ['6', '60', '600', '106'], correctIndex: 1, explanation: 'Coupon hàng năm = tỉ lệ coupon x mệnh giá = 6% x 1.000 = 60.' },
]);

const c3 = doc('ipm301-3-1-rui-ro-loi-nhuan', '3.1 — Risk, return & portfolio theory|||3.1 — Rủi ro, lợi nhuận & lý thuyết danh mục',
  'Tỉ suất sinh lợi nắm giữ (HPR); lợi nhuận kỳ vọng, phương sai, độ lệch chuẩn; đa dạng hoá; rủi ro hệ thống vs không hệ thống.',
  [[
    `<span class="eyebrow">IPM301 · Chapter 3 · Lesson 3.1</span>
<h2>Risk, return &amp; portfolio theory</h2>
<h3>Holding period return (HPR)</h3>
<p>The return earned from holding an asset over one period combines price change and any income received:</p>
<pre><code>HPR = (P1 - P0 + D) / P0
 P0 = beginning price, P1 = ending price, D = dividend/interest received

Assumed example:
 P0 = 100 ; P1 = 108 ; D = 2
 HPR = (108 - 100 + 2) / 100 = 10 / 100 = 10%
</code></pre>
<h3>Expected return &amp; risk</h3>
<p>Because future prices are uncertain, we work with a probability-weighted <strong>expected return E(r)</strong> and measure risk as <strong>variance (σ²)</strong> / <strong>standard deviation (σ)</strong> of possible returns around that expectation — the more spread-out the possible outcomes, the riskier the asset.</p>
<h3>Diversification &amp; portfolio risk</h3>
<p>Combining assets whose returns don't move in lockstep reduces portfolio risk without sacrificing expected return proportionally — the heart of portfolio theory. For a two-asset portfolio with weights w1, w2:</p>
<pre><code>Portfolio variance (two assets):
 sigma_p^2 = w1^2*sigma1^2 + w2^2*sigma2^2 + 2*w1*w2*Cov(r1,r2)
 Cov(r1,r2) = correlation(r1,r2) x sigma1 x sigma2

If correlation &lt; 1, sigma_p is LESS than the weighted average of sigma1 and sigma2
-&gt; diversification lowers risk whenever assets aren't perfectly correlated.
</code></pre>
<h3>Systematic vs unsystematic risk</h3>
<ul>
<li><strong>Unsystematic (firm-specific) risk</strong> — a lawsuit, a factory fire, a bad product launch. Diversification across many stocks can largely eliminate this.</li>
<li><strong>Systematic (market) risk</strong> — recessions, interest rate moves, inflation shocks that affect nearly everything. Diversification cannot eliminate this — it is the risk investors are actually compensated for bearing (Chapter 6, CAPM).</li>
</ul>
<div class="callout"><span class="badge">Takeaway</span> A well-diversified portfolio removes firm-specific noise, leaving mainly market risk — which is why "put everything in one stock" is a textbook example of avoidable, uncompensated risk.</div>`,
    `<span class="eyebrow">IPM301 · Chương 3 · Bài 3.1</span>
<h2>Rủi ro, lợi nhuận &amp; lý thuyết danh mục</h2>
<h3>Tỉ suất sinh lợi nắm giữ (HPR)</h3>
<p>Lợi nhuận thu được khi nắm giữ một tài sản trong một kỳ gồm cả thay đổi giá và thu nhập nhận được:</p>
<pre><code>HPR = (P1 - P0 + D) / P0
 P0 = giá đầu kỳ, P1 = giá cuối kỳ, D = cổ tức/lãi nhận được

Ví dụ giả định:
 P0 = 100 ; P1 = 108 ; D = 2
 HPR = (108 - 100 + 2) / 100 = 10 / 100 = 10%
</code></pre>
<h3>Lợi nhuận kỳ vọng &amp; rủi ro</h3>
<p>Vì giá tương lai không chắc chắn, ta dùng <strong>lợi nhuận kỳ vọng E(r)</strong> tính theo xác suất, và đo rủi ro bằng <strong>phương sai (σ²)</strong> / <strong>độ lệch chuẩn (σ)</strong> của các kết quả có thể xảy ra quanh giá trị kỳ vọng đó — kết quả càng phân tán, tài sản càng rủi ro.</p>
<h3>Đa dạng hoá &amp; rủi ro danh mục</h3>
<p>Kết hợp các tài sản mà lợi nhuận không di chuyển cùng chiều tuyệt đối sẽ giảm rủi ro danh mục mà không giảm lợi nhuận kỳ vọng theo tỉ lệ tương ứng — đây là trọng tâm của lý thuyết danh mục. Với danh mục 2 tài sản, tỉ trọng w1, w2:</p>
<pre><code>Phương sai danh mục (2 tài sản):
 sigma_p^2 = w1^2*sigma1^2 + w2^2*sigma2^2 + 2*w1*w2*Cov(r1,r2)
 Cov(r1,r2) = tương quan(r1,r2) x sigma1 x sigma2

Nếu hệ số tương quan nhỏ hơn 1, sigma_p sẽ NHỎ HƠN trung bình có trọng số của sigma1 và sigma2
-&gt; đa dạng hoá giảm rủi ro mỗi khi các tài sản không tương quan hoàn hảo.
</code></pre>
<h3>Rủi ro hệ thống vs không hệ thống</h3>
<ul>
<li><strong>Rủi ro không hệ thống (riêng doanh nghiệp)</strong> — một vụ kiện, hoả hoạn nhà máy, sản phẩm ra mắt thất bại. Đa dạng hoá qua nhiều cổ phiếu có thể loại bỏ phần lớn rủi ro này.</li>
<li><strong>Rủi ro hệ thống (thị trường)</strong> — suy thoái, biến động lãi suất, sốc lạm phát ảnh hưởng gần như mọi thứ. Đa dạng hoá KHÔNG loại bỏ được rủi ro này — đây là rủi ro nhà đầu tư thực sự được đền bù khi chấp nhận (Chương 6, CAPM).</li>
</ul>
<div class="callout"><span class="badge">Rút ra</span> Một danh mục đa dạng hoá tốt loại bỏ nhiễu riêng của từng doanh nghiệp, chỉ còn lại chủ yếu rủi ro thị trường — đó là lý do "bỏ hết tiền vào một cổ phiếu" là ví dụ kinh điển của rủi ro có thể tránh mà không được đền bù.</div>`,
  ]]);

const c3q = quiz('ipm301-quiz-3', 'Quiz 3 — Risk & portfolio theory|||Quiz 3 — Rủi ro & lý thuyết danh mục', [
  { id: 'q1', question: 'Cổ phiếu có P0=100, P1=108, cổ tức D=2. HPR là bao nhiêu?', options: ['2%', '8%', '10%', '12%'], correctIndex: 2, explanation: 'HPR = (108-100+2)/100 = 10/100 = 10%.' },
  { id: 'q2', question: 'Đa dạng hoá danh mục giúp giảm loại rủi ro nào?', options: ['Rủi ro hệ thống (thị trường)', 'Rủi ro không hệ thống (riêng doanh nghiệp)', 'Cả hai loại rủi ro', 'Không giảm được rủi ro nào'], correctIndex: 1, explanation: 'Đa dạng hoá loại bỏ phần lớn rủi ro riêng doanh nghiệp; rủi ro thị trường vẫn còn.' },
  { id: 'q3', question: 'Điều kiện nào khiến đa dạng hoá giảm rủi ro danh mục?', options: ['Hai tài sản tương quan hoàn hảo (correlation = 1)', 'Hai tài sản tương quan nhỏ hơn 1', 'Tỉ trọng w1 = w2 = 100%', 'Không cần điều kiện gì'], correctIndex: 1, explanation: 'Khi hệ số tương quan nhỏ hơn 1, phương sai danh mục nhỏ hơn trung bình có trọng số của phương sai từng tài sản.' },
]);

const c4 = doc('ipm301-4-1-dinh-gia-co-phieu', '4.1 — Equity valuation (DDM, P/E, fundamental analysis)|||4.1 — Định giá cổ phiếu (DDM, P/E, phân tích cơ bản)',
  'Phân tích cơ bản top-down (kinh tế→ngành→doanh nghiệp); mô hình chiết khấu cổ tức (DDM/Gordon growth); tỉ số P/E; hạn chế của mô hình.',
  [[
    `<span class="eyebrow">IPM301 · Chapter 4 · Lesson 4.1</span>
<h2>Equity valuation</h2>
<h3>Fundamental analysis: a top-down view</h3>
<p><strong>Fundamental analysis</strong> estimates a stock's "intrinsic value" from economic and financial data, typically top-down: (1) macroeconomy — growth, inflation, interest rates; (2) industry — competitive structure, growth stage; (3) company — financial statements, management, competitive position. The idea: buy when intrinsic value exceeds market price, sell (or avoid) when it doesn't.</p>
<h3>Dividend Discount Model (DDM) — Gordon growth model</h3>
<p>If a stock pays a growing dividend forever, its value is the present value of all future dividends. With a constant growth rate g and required return r &gt; g:</p>
<pre><code>Gordon growth model:
 P0 = D1 / (r - g)
 D1 = expected dividend next year, r = required rate of return, g = constant dividend growth rate

Assumed example:
 D1 = 3 ; r = 10% ; g = 4%
 P0 = 3 / (0.10 - 0.04) = 3 / 0.06 = 50
</code></pre>
<p>The model is sensitive to its inputs — a small change in g or r near r can swing P0 a lot, which is why it works best for stable, mature dividend payers, not high-growth or non-dividend firms.</p>
<h3>P/E ratio</h3>
<p>The <strong>price-to-earnings (P/E) ratio</strong> = price per share / earnings per share. It's a quick relative-valuation shortcut: compare a firm's P/E to its industry peers or its own history — a much higher P/E can mean the market expects faster growth, or that the stock is simply expensive.</p>
<pre><code>Assumed example:
 Price = 50 ; EPS = 5
 P/E = 50 / 5 = 10x
</code></pre>
<div class="callout"><span class="badge">Limitations</span> DDM assumes a stable, forecastable dividend growth rate — rarely exactly true. P/E ignores growth differences and accounting differences across firms unless paired with growth (PEG) or industry context. Use these as starting points for analysis, not final answers, and never as a buy/sell signal on their own.</div>`,
    `<span class="eyebrow">IPM301 · Chương 4 · Bài 4.1</span>
<h2>Định giá cổ phiếu</h2>
<h3>Phân tích cơ bản: góc nhìn top-down</h3>
<p><strong>Phân tích cơ bản</strong> ước lượng "giá trị nội tại" của cổ phiếu từ dữ liệu kinh tế và tài chính, thường theo hướng top-down: (1) kinh tế vĩ mô — tăng trưởng, lạm phát, lãi suất; (2) ngành — cấu trúc cạnh tranh, giai đoạn tăng trưởng; (3) doanh nghiệp — báo cáo tài chính, quản trị, vị thế cạnh tranh. Ý tưởng: mua khi giá trị nội tại cao hơn giá thị trường, bán (hoặc tránh) khi ngược lại.</p>
<h3>Mô hình chiết khấu cổ tức (DDM) — mô hình tăng trưởng Gordon</h3>
<p>Nếu cổ phiếu trả cổ tức tăng trưởng mãi mãi, giá trị của nó là giá trị hiện tại của toàn bộ cổ tức tương lai. Với tỉ lệ tăng trưởng không đổi g và lợi nhuận yêu cầu r &gt; g:</p>
<pre><code>Mô hình tăng trưởng Gordon:
 P0 = D1 / (r - g)
 D1 = cổ tức kỳ vọng năm tới, r = lợi nhuận yêu cầu, g = tỉ lệ tăng trưởng cổ tức không đổi

Ví dụ giả định:
 D1 = 3 ; r = 10% ; g = 4%
 P0 = 3 / (0,10 - 0,04) = 3 / 0,06 = 50
</code></pre>
<p>Mô hình nhạy với dữ liệu đầu vào — thay đổi nhỏ ở g hay r gần bằng r có thể làm P0 dao động mạnh, nên nó hợp nhất với doanh nghiệp trả cổ tức ổn định, đã trưởng thành, không hợp với doanh nghiệp tăng trưởng cao hoặc không trả cổ tức.</p>
<h3>Tỉ số P/E</h3>
<p><strong>Tỉ số giá trên lợi nhuận (P/E)</strong> = giá mỗi cổ phiếu / lợi nhuận mỗi cổ phiếu (EPS). Đây là cách định giá tương đối nhanh: so P/E của doanh nghiệp với đối thủ cùng ngành hoặc lịch sử của chính nó — P/E cao hơn nhiều có thể do thị trường kỳ vọng tăng trưởng nhanh hơn, hoặc đơn giản là cổ phiếu đang đắt.</p>
<pre><code>Ví dụ giả định:
 Giá = 50 ; EPS = 5
 P/E = 50 / 5 = 10 lần
</code></pre>
<div class="callout"><span class="badge">Hạn chế</span> DDM giả định tỉ lệ tăng trưởng cổ tức ổn định, dự báo được — hiếm khi đúng chính xác. P/E bỏ qua khác biệt tăng trưởng và khác biệt kế toán giữa doanh nghiệp nếu không đi kèm tăng trưởng (PEG) hay bối cảnh ngành. Dùng chúng làm điểm khởi đầu phân tích, không phải câu trả lời cuối, và không bao giờ là tín hiệu mua/bán một mình.</div>`,
  ]]);

const c4q = quiz('ipm301-quiz-4', 'Quiz 4 — Equity valuation|||Quiz 4 — Định giá cổ phiếu', [
  { id: 'q1', question: 'Theo mô hình Gordon, D1=4, r=12%, g=4%. P0 bằng bao nhiêu?', options: ['33,3', '40', '50', '100'], correctIndex: 2, explanation: 'P0 = D1/(r-g) = 4/(0,12-0,04) = 4/0,08 = 50.' },
  { id: 'q2', question: 'Mô hình DDM (Gordon growth) phù hợp nhất với loại doanh nghiệp nào?', options: ['Doanh nghiệp không trả cổ tức, tăng trưởng rất nhanh', 'Doanh nghiệp trả cổ tức ổn định, đã trưởng thành', 'Doanh nghiệp mới IPO chưa có lịch sử cổ tức', 'Mọi doanh nghiệp không phân biệt'], correctIndex: 1, explanation: 'DDM giả định tăng trưởng cổ tức ổn định — hợp với doanh nghiệp trưởng thành, trả cổ tức đều.' },
  { id: 'q3', question: 'Tỉ số P/E được tính bằng?', options: ['Giá / EPS', 'EPS / Giá', 'Giá x EPS', 'Cổ tức / Giá'], correctIndex: 0, explanation: 'P/E = giá mỗi cổ phiếu chia lợi nhuận mỗi cổ phiếu (EPS).' },
]);

const c5 = doc('ipm301-5-1-dinh-gia-trai-phieu', '5.1 — Bond valuation & interest rates|||5.1 — Định giá trái phiếu & lãi suất',
  'Giá trái phiếu = giá trị hiện tại của coupon + mệnh giá; lợi suất đến hạn (YTM); quan hệ ngược giá–lãi suất; đường cong lãi suất.',
  [[
    `<span class="eyebrow">IPM301 · Chapter 5 · Lesson 5.1</span>
<h2>Bond valuation &amp; interest rates</h2>
<h3>How a bond is priced</h3>
<p>A bond's price is the present value of its promised cash flows — the coupons plus the face value at maturity — discounted at the market's required yield y:</p>
<pre><code>Bond price = sum over t=1..n of [Coupon / (1+y)^t] + FaceValue / (1+y)^n

Assumed example:
 Face value = 1,000 ; Coupon = 60/year (6%) ; n = 3 years ; required yield y = 8%
 Price = 60/(1.08)^1 + 60/(1.08)^2 + (60+1000)/(1.08)^3
       ~= 55.6 + 51.4 + 841.2 ~= 948.2  (a discount bond, priced below face value)
</code></pre>
<h3>Yield to maturity (YTM)</h3>
<p><strong>YTM</strong> is the single discount rate that makes the present value of a bond's cash flows equal its current market price — the bond's "internal rate of return" if held to maturity. It's the standard way to compare bonds with different coupons and maturities on an apples-to-apples basis.</p>
<h3>The inverse price–interest rate relationship</h3>
<p>Bond prices and market interest rates (yields) move <strong>inversely</strong>: when required yields rise, the present value of fixed future cash flows falls, so bond prices fall — and vice versa. This is the single most important relationship in fixed-income investing.</p>
<h3>Duration (concept) &amp; the term structure</h3>
<p><strong>Duration</strong> is a measure of a bond's sensitivity to interest-rate changes — longer maturity and lower coupons generally mean higher duration (more price sensitivity). The <strong>term structure of interest rates (yield curve)</strong> plots yields against maturities for otherwise similar bonds; it is normally upward-sloping (longer maturities demand higher yields for extra risk/uncertainty), but can flatten or invert ahead of economic slowdowns.</p>
<div class="callout"><span class="badge">Risk note</span> "Safe" fixed-income does not mean risk-free: rising interest rates can still cause bond prices — and the market value of a bond portfolio — to fall before maturity.</div>`,
    `<span class="eyebrow">IPM301 · Chương 5 · Bài 5.1</span>
<h2>Định giá trái phiếu &amp; lãi suất</h2>
<h3>Cách định giá một trái phiếu</h3>
<p>Giá trái phiếu là giá trị hiện tại của các luồng tiền đã hứa — coupon cộng mệnh giá khi đến hạn — chiết khấu theo lợi suất yêu cầu của thị trường y:</p>
<pre><code>Giá trái phiếu = tổng t=1..n của [Coupon / (1+y)^t] + Mệnh giá / (1+y)^n

Ví dụ giả định:
 Mệnh giá = 1.000 ; Coupon = 60/năm (6%) ; n = 3 năm ; lợi suất yêu cầu y = 8%
 Giá = 60/(1,08)^1 + 60/(1,08)^2 + (60+1000)/(1,08)^3
     ~= 55,6 + 51,4 + 841,2 ~= 948,2  (trái phiếu chiết khấu, giá dưới mệnh giá)
</code></pre>
<h3>Lợi suất đến hạn (YTM)</h3>
<p><strong>YTM</strong> là mức lãi suất chiết khấu duy nhất làm giá trị hiện tại của các luồng tiền trái phiếu bằng đúng giá thị trường hiện tại — "tỉ suất sinh lợi nội bộ" của trái phiếu nếu giữ đến khi đáo hạn. Đây là cách chuẩn để so sánh các trái phiếu có coupon và kỳ hạn khác nhau trên cùng một thước đo.</p>
<h3>Quan hệ ngược giữa giá và lãi suất</h3>
<p>Giá trái phiếu và lãi suất thị trường (lợi suất) di chuyển <strong>ngược chiều</strong>: khi lợi suất yêu cầu tăng, giá trị hiện tại của các luồng tiền cố định tương lai giảm, nên giá trái phiếu giảm — và ngược lại. Đây là quan hệ quan trọng nhất trong đầu tư thu nhập cố định.</p>
<h3>Khái niệm duration &amp; cấu trúc kỳ hạn lãi suất</h3>
<p><strong>Duration</strong> đo độ nhạy của trái phiếu với thay đổi lãi suất — kỳ hạn dài hơn và coupon thấp hơn thường nghĩa là duration cao hơn (nhạy giá hơn). <strong>Cấu trúc kỳ hạn lãi suất (đường cong lợi suất)</strong> vẽ lợi suất theo kỳ hạn cho các trái phiếu tương tự nhau; thường dốc lên (kỳ hạn dài hơn yêu cầu lợi suất cao hơn để đền bù rủi ro/bất định thêm), nhưng có thể đi ngang hoặc đảo chiều trước khi kinh tế suy giảm.</p>
<div class="callout"><span class="badge">Ghi chú rủi ro</span> Thu nhập cố định "an toàn" không có nghĩa là không rủi ro: lãi suất tăng vẫn có thể làm giá trái phiếu — và giá trị thị trường của một danh mục trái phiếu — giảm trước khi đến hạn.</div>`,
  ]]);

const c5q = quiz('ipm301-quiz-5', 'Quiz 5 — Bond valuation|||Quiz 5 — Định giá trái phiếu', [
  { id: 'q1', question: 'Khi lợi suất yêu cầu của thị trường TĂNG, giá trái phiếu (đã phát hành, coupon cố định) sẽ?', options: ['Tăng theo', 'Giảm', 'Không đổi', 'Luôn về đúng mệnh giá'], correctIndex: 1, explanation: 'Giá trái phiếu và lãi suất/lợi suất di chuyển ngược chiều — lợi suất tăng làm giá giảm.' },
  { id: 'q2', question: 'YTM (yield to maturity) của một trái phiếu là gì?', options: ['Lãi coupon ghi trên trái phiếu', 'Mức chiết khấu làm PV luồng tiền bằng giá thị trường hiện tại', 'Mệnh giá chia coupon', 'Lợi nhuận đảm bảo mỗi năm'], correctIndex: 1, explanation: 'YTM là lãi suất chiết khấu duy nhất khiến PV các luồng tiền của trái phiếu bằng giá thị trường hiện tại.' },
  { id: 'q3', question: 'Trái phiếu nào (các yếu tố khác giống nhau) thường có duration CAO hơn?', options: ['Kỳ hạn ngắn, coupon cao', 'Kỳ hạn dài, coupon thấp', 'Kỳ hạn ngắn, coupon thấp', 'Duration không liên quan kỳ hạn/coupon'], correctIndex: 1, explanation: 'Kỳ hạn dài hơn và coupon thấp hơn làm trái phiếu nhạy hơn với thay đổi lãi suất — duration cao hơn.' },
]);

const c6 = doc('ipm301-6-1-capm-thi-truong-hieu-qua', '6.1 — CAPM & market efficiency|||6.1 — Mô hình CAPM & thị trường hiệu quả',
  'Mô hình định giá tài sản vốn (CAPM): E(r)=rf+β(E(rm)-rf); ý nghĩa hệ số beta; đường thị trường chứng khoán (SML); giả thuyết thị trường hiệu quả (EMH) 3 dạng.',
  [[
    `<span class="eyebrow">IPM301 · Chapter 6 · Lesson 6.1</span>
<h2>CAPM &amp; market efficiency</h2>
<h3>The Capital Asset Pricing Model (CAPM)</h3>
<p>CAPM says only <strong>systematic (market) risk</strong> should be rewarded with extra expected return, since unsystematic risk can be diversified away for free. The model:</p>
<pre><code>E(r) = rf + beta x (E(rm) - rf)
 rf = risk-free rate ; E(rm) = expected market return ; beta = asset's sensitivity to market moves

Assumed example:
 rf = 3% ; E(rm) = 9% ; beta = 1.2
 E(r) = 3% + 1.2 x (9% - 3%) = 3% + 7.2% = 10.2%
</code></pre>
<h3>Interpreting beta</h3>
<ul>
<li><strong>β = 1</strong> — moves with the market on average.</li>
<li><strong>β &gt; 1</strong> — more volatile than the market (amplifies market moves).</li>
<li><strong>β &lt; 1</strong> — less volatile than the market.</li>
<li><strong>β = 0</strong> — (in theory) uncorrelated with the market, like a risk-free asset.</li>
</ul>
<h3>The Security Market Line (SML)</h3>
<p>The <strong>SML</strong> plots CAPM's required return against beta — a straight line from (β=0, r=rf). A stock trading above the line (assumed) offers more return than its beta justifies (potentially undervalued); below the line, less (potentially overvalued) — always as a starting hypothesis, not a certainty.</p>
<h3>Efficient Market Hypothesis (EMH)</h3>
<p>EMH says prices already reflect available information, making it hard to consistently "beat the market." Three forms:</p>
<ul>
<li><strong>Weak form</strong> — prices reflect all past price/volume data (technical analysis on price patterns alone shouldn't work reliably).</li>
<li><strong>Semi-strong form</strong> — prices reflect all public information (fundamental analysis on public data shouldn't reliably beat the market either).</li>
<li><strong>Strong form</strong> — prices reflect all information, public and private (even insider information wouldn't help — the least realistic form).</li>
</ul>
<div class="callout"><span class="badge">Implication</span> The more efficient markets are believed to be, the stronger the case for low-cost, diversified <strong>passive</strong> investing over trying to consistently pick winners — an ongoing debate, not a settled fact, and beta/CAPM numbers here are assumed teaching values.</div>`,
    `<span class="eyebrow">IPM301 · Chương 6 · Bài 6.1</span>
<h2>Mô hình CAPM &amp; thị trường hiệu quả</h2>
<h3>Mô hình định giá tài sản vốn (CAPM)</h3>
<p>CAPM cho rằng chỉ <strong>rủi ro hệ thống (thị trường)</strong> mới nên được đền bù bằng lợi nhuận kỳ vọng thêm, vì rủi ro không hệ thống có thể loại bỏ miễn phí qua đa dạng hoá. Mô hình:</p>
<pre><code>E(r) = rf + beta x (E(rm) - rf)
 rf = lãi suất không rủi ro ; E(rm) = lợi nhuận kỳ vọng thị trường ; beta = độ nhạy của tài sản với biến động thị trường

Ví dụ giả định:
 rf = 3% ; E(rm) = 9% ; beta = 1,2
 E(r) = 3% + 1,2 x (9% - 3%) = 3% + 7,2% = 10,2%
</code></pre>
<h3>Ý nghĩa hệ số beta</h3>
<ul>
<li><strong>β = 1</strong> — di chuyển trung bình theo thị trường.</li>
<li><strong>β &gt; 1</strong> — biến động mạnh hơn thị trường (khuếch đại biến động thị trường).</li>
<li><strong>β &lt; 1</strong> — biến động ít hơn thị trường.</li>
<li><strong>β = 0</strong> — (về lý thuyết) không tương quan với thị trường, như tài sản không rủi ro.</li>
</ul>
<h3>Đường thị trường chứng khoán (SML)</h3>
<p><strong>SML</strong> vẽ lợi nhuận yêu cầu theo CAPM so với beta — một đường thẳng bắt đầu từ (β=0, r=rf). Một cổ phiếu nằm trên đường này (giả định) mang lợi nhuận cao hơn mức beta của nó biện minh (có thể bị định giá thấp); nằm dưới đường thì thấp hơn (có thể bị định giá cao) — luôn là giả thuyết khởi đầu, không phải điều chắc chắn.</p>
<h3>Giả thuyết thị trường hiệu quả (EMH)</h3>
<p>EMH cho rằng giá đã phản ánh thông tin sẵn có, khiến việc "đánh bại thị trường" liên tục rất khó. Ba dạng:</p>
<ul>
<li><strong>Dạng yếu</strong> — giá phản ánh mọi dữ liệu giá/khối lượng trong quá khứ (phân tích kỹ thuật chỉ dựa mẫu giá không nên hiệu quả bền vững).</li>
<li><strong>Dạng trung bình</strong> — giá phản ánh mọi thông tin công khai (phân tích cơ bản dựa dữ liệu công khai cũng không nên đánh bại thị trường liên tục).</li>
<li><strong>Dạng mạnh</strong> — giá phản ánh mọi thông tin, cả công khai và nội bộ (ngay cả thông tin nội gián cũng không giúp được — dạng ít thực tế nhất).</li>
</ul>
<div class="callout"><span class="badge">Ý nghĩa thực tiễn</span> Càng tin thị trường hiệu quả, càng nghiêng về đầu tư <strong>bị động</strong>, chi phí thấp, đa dạng hoá thay vì cố gắng chọn "cổ phiếu thắng" liên tục — đây là tranh luận đang diễn ra, không phải sự thật đã ngã ngũ, và các số beta/CAPM ở trên đều là giá trị giả định để học.</div>`,
  ]]);

const c6q = quiz('ipm301-quiz-6', 'Quiz 6 — CAPM & EMH|||Quiz 6 — CAPM & thị trường hiệu quả', [
  { id: 'q1', question: 'Theo CAPM: rf=4%, E(rm)=10%, beta=1,5. E(r) bằng bao nhiêu?', options: ['9%', '13%', '15%', '19%'], correctIndex: 1, explanation: 'E(r) = 4% + 1,5 x (10%-4%) = 4% + 9% = 13%.' },
  { id: 'q2', question: 'Một cổ phiếu có beta = 0,5 nghĩa là gì?', options: ['Không rủi ro', 'Biến động mạnh hơn thị trường', 'Biến động ít hơn thị trường (bằng một nửa)', 'Luôn sinh lời dương'], correctIndex: 2, explanation: 'Beta = 0,5 nghĩa là biến động trung bình chỉ bằng một nửa biến động thị trường.' },
  { id: 'q3', question: 'Theo dạng YẾU của EMH, loại phân tích nào KHÔNG nên hiệu quả bền vững?', options: ['Phân tích kỹ thuật dựa mẫu giá quá khứ', 'Phân tích cơ bản dựa báo cáo tài chính công khai', 'Thông tin nội gián', 'Không loại nào bị ảnh hưởng'], correctIndex: 0, explanation: 'Dạng yếu: giá đã phản ánh hết dữ liệu giá/khối lượng quá khứ, nên phân tích kỹ thuật thuần không nên thắng bền vững.' },
]);

const c7 = doc('ipm301-7-1-xay-dung-danh-muc', '7.1 — Portfolio construction & management|||7.1 — Xây dựng & quản lý danh mục đầu tư',
  'Quy trình quản lý danh mục: mục tiêu → ràng buộc → phân bổ & chọn chứng khoán → thực thi → giám sát; bản tuyên bố chính sách đầu tư (IPS); quản lý bị động vs chủ động; tái cân bằng.',
  [[
    `<span class="eyebrow">IPM301 · Chapter 7 · Lesson 7.1</span>
<h2>Portfolio construction &amp; management</h2>
<h3>The portfolio management process</h3>
<pre><code>1. Set objectives &amp; constraints (write an Investment Policy Statement)
2. Decide broad allocation &amp; select individual securities
3. Execute (buy the chosen securities)
4. Monitor performance &amp; conditions
5. Rebalance back toward target when drift is too large
   (loop back to step 4)
</code></pre>
<h3>Investment Policy Statement (IPS)</h3>
<p>An <strong>IPS</strong> documents an investor's objectives and constraints before any security is bought, so decisions aren't made emotionally in the moment:</p>
<ul>
<li><strong>Return objective</strong> — what return is needed/desired.</li>
<li><strong>Risk tolerance</strong> — how much loss the investor can bear financially and emotionally.</li>
<li><strong>Time horizon</strong> — when the money will be needed.</li>
<li><strong>Liquidity needs</strong> — how much must be accessible on short notice.</li>
<li><strong>Tax &amp; legal constraints, unique circumstances</strong> — anything else specific to the investor.</li>
</ul>
<h3>Passive vs active management</h3>
<ul>
<li><strong>Passive management</strong> — track a benchmark (e.g. buy the whole index), accepting market returns; lower cost, consistent with a highly efficient-market view.</li>
<li><strong>Active management</strong> — try to pick securities or time markets to beat a benchmark; higher cost, requires a genuine, repeatable information or analytical edge to be worth it net of fees.</li>
</ul>
<h3>Rebalancing</h3>
<p>Over time, price moves drift a portfolio away from its target weights (winners grow into a bigger share). <strong>Rebalancing</strong> — periodically selling some winners and buying laggards back to target weights — keeps the portfolio's risk level consistent with the original IPS, though it triggers transaction costs and, for taxable accounts, possible taxes.</p>
<div class="callout"><span class="badge">Not advice</span> This lesson describes a process, not a recommended allocation. Any numbers used are illustrative only.</div>`,
    `<span class="eyebrow">IPM301 · Chương 7 · Bài 7.1</span>
<h2>Xây dựng &amp; quản lý danh mục đầu tư</h2>
<h3>Quy trình quản lý danh mục</h3>
<pre><code>1. Đặt mục tiêu &amp; ràng buộc (viết bản Tuyên bố Chính sách Đầu tư - IPS)
2. Quyết định phân bổ tổng quát &amp; chọn từng chứng khoán
3. Thực thi (mua các chứng khoán đã chọn)
4. Giám sát hiệu quả &amp; điều kiện thị trường
5. Tái cân bằng về tỉ trọng mục tiêu khi lệch quá nhiều
   (lặp lại từ bước 4)
</code></pre>
<h3>Bản Tuyên bố Chính sách Đầu tư (IPS)</h3>
<p><strong>IPS</strong> ghi lại mục tiêu và ràng buộc của nhà đầu tư trước khi mua bất kỳ chứng khoán nào, để quyết định không bị chi phối bởi cảm xúc tức thời:</p>
<ul>
<li><strong>Mục tiêu lợi nhuận</strong> — mức lợi nhuận cần/mong muốn.</li>
<li><strong>Khả năng chịu rủi ro</strong> — nhà đầu tư chịu được bao nhiêu mất mát về tài chính và cảm xúc.</li>
<li><strong>Khung thời gian</strong> — khi nào cần dùng tiền.</li>
<li><strong>Nhu cầu thanh khoản</strong> — bao nhiêu cần tiếp cận được ngay.</li>
<li><strong>Ràng buộc thuế &amp; pháp lý, hoàn cảnh riêng</strong> — bất cứ điều gì đặc thù của nhà đầu tư đó.</li>
</ul>
<h3>Quản lý bị động vs chủ động</h3>
<ul>
<li><strong>Quản lý bị động</strong> — theo sát một chuẩn tham chiếu (vd mua cả chỉ số), chấp nhận lợi nhuận thị trường; chi phí thấp, phù hợp quan điểm thị trường rất hiệu quả.</li>
<li><strong>Quản lý chủ động</strong> — cố gắng chọn chứng khoán hoặc bắt thời điểm thị trường để vượt chuẩn tham chiếu; chi phí cao hơn, cần một lợi thế thông tin hoặc phân tích thật, lặp lại được, để bù được phí.</li>
</ul>
<h3>Tái cân bằng (rebalancing)</h3>
<p>Theo thời gian, biến động giá làm danh mục lệch khỏi tỉ trọng mục tiêu (tài sản thắng lớn dần chiếm tỉ trọng cao hơn). <strong>Tái cân bằng</strong> — định kỳ bán một phần tài sản thắng và mua thêm tài sản tụt lại để về đúng tỉ trọng mục tiêu — giữ mức rủi ro danh mục nhất quán với IPS ban đầu, dù nó phát sinh chi phí giao dịch và, với tài khoản chịu thuế, có thể phát sinh thuế.</p>
<div class="callout"><span class="badge">Không phải lời khuyên</span> Bài này mô tả một quy trình, không phải một phân bổ được khuyến nghị. Mọi số liệu chỉ mang tính minh hoạ.</div>`,
  ]]);

const c7q = quiz('ipm301-quiz-7', 'Quiz 7 — Portfolio construction|||Quiz 7 — Xây dựng danh mục', [
  { id: 'q1', question: 'Bản IPS (Investment Policy Statement) được viết ở bước nào?', options: ['Sau khi đã mua hết chứng khoán', 'Trước khi chọn hay mua bất kỳ chứng khoán nào', 'Chỉ khi thị trường giảm', 'Không cần viết, chỉ cần nhớ trong đầu'], correctIndex: 1, explanation: 'IPS ghi mục tiêu/ràng buộc TRƯỚC khi ra quyết định mua, để tránh quyết định theo cảm xúc.' },
  { id: 'q2', question: 'Quản lý bị động (passive) khác quản lý chủ động (active) ở điểm nào?', options: ['Bị động cố gắng đánh bại chỉ số', 'Bị động theo sát chuẩn tham chiếu, chi phí thấp hơn', 'Chủ động luôn rẻ hơn bị động', 'Không có khác biệt'], correctIndex: 1, explanation: 'Bị động chấp nhận lợi nhuận thị trường với chi phí thấp; chủ động cố vượt chuẩn với chi phí cao hơn.' },
  { id: 'q3', question: 'Tái cân bằng (rebalancing) danh mục nhằm mục đích gì?', options: ['Tăng rủi ro để tăng lợi nhuận', 'Đưa danh mục về lại tỉ trọng mục tiêu ban đầu', 'Xoá bỏ hoàn toàn phí giao dịch', 'Chỉ áp dụng cho trái phiếu'], correctIndex: 1, explanation: 'Rebalancing đưa tỉ trọng các tài sản về lại mức mục tiêu đã đặt trong IPS, sau khi bị lệch do biến động giá.' },
]);

const c8 = doc('ipm301-8-1-danh-gia-hieu-qua-hanh-vi-vn', '8.1 — Performance evaluation, behavioral finance & Vietnam\'s stock market|||8.1 — Đánh giá hiệu quả, tài chính hành vi & thị trường Việt Nam',
  'Tỉ số Sharpe/Treynor/Jensen alpha; thiên lệch hành vi phổ biến (quá tự tin, hiệu ứng đám đông, e ngại mất mát); cơ chế thị trường Việt Nam (HOSE, HNX, UPCoM, VN-Index, T+, room ngoại).',
  [[
    `<span class="eyebrow">IPM301 · Chapter 8 · Lesson 8.1</span>
<h2>Performance evaluation, behavioral finance &amp; Vietnam's market</h2>
<h3>Risk-adjusted performance measures</h3>
<p>Raw return alone can't tell if a manager took excessive risk to get there. Three standard risk-adjusted ratios:</p>
<pre><code>Sharpe ratio  = (rp - rf) / sigma_p        (return per unit of TOTAL risk)
Treynor ratio = (rp - rf) / beta_p         (return per unit of MARKET risk)
Jensen's alpha = rp - [rf + beta_p x (rm - rf)]   (excess return vs CAPM prediction)

Assumed example:
 rp = 12% ; rf = 3% ; sigma_p = 15% ; beta_p = 1.1 ; rm = 9%
 Sharpe = (12-3)/15 = 0.60
 Treynor = (12-3)/1.1 = 8.18
 Jensen's alpha = 12% - [3% + 1.1 x (9%-3%)] = 12% - 9.6% = 2.4%
</code></pre>
<p>A positive Jensen's alpha (in this assumed example) suggests the portfolio beat what CAPM predicted for its risk level — but a single period says little; results must be checked across time and against fees.</p>
<h3>Behavioral finance — common biases</h3>
<ul>
<li><strong>Overconfidence</strong> — overestimating one's own forecasting ability, trading too much.</li>
<li><strong>Herding</strong> — following the crowd into or out of a trade regardless of fundamentals.</li>
<li><strong>Loss aversion</strong> — feeling losses more painfully than equivalent gains feel good, leading to holding losers too long.</li>
<li><strong>Anchoring</strong> — fixating on an arbitrary reference price (e.g. the purchase price) when deciding to sell.</li>
</ul>
<h3>Vietnam's stock market</h3>
<ul>
<li><strong>HOSE</strong> (Ho Chi Minh City Stock Exchange) — the main board, home of the <strong>VN-Index</strong>.</li>
<li><strong>HNX</strong> (Hanoi Stock Exchange) — a second listed board, plus the government bond market.</li>
<li><strong>UPCoM</strong> — an unlisted public-company trading platform, generally less strict listing conditions.</li>
<li><strong>T+ settlement</strong> — shares bought typically become sellable a few business days after the trade (the exact T+n has changed over time — check current exchange rules rather than assuming a fixed number).</li>
<li><strong>Foreign ownership limits ("room ngoại")</strong> — many Vietnamese listed firms cap the % of shares foreign investors may hold, which can affect a stock's price relative to its "room."</li>
</ul>
<div class="callout"><span class="badge">Final risk disclaimer</span> Past performance and every ratio above do not guarantee future results. Nothing in this course is investment advice — always do independent research and consider your own risk tolerance (or consult a licensed professional) before investing real money.</div>`,
    `<span class="eyebrow">IPM301 · Chương 8 · Bài 8.1</span>
<h2>Đánh giá hiệu quả, tài chính hành vi &amp; thị trường Việt Nam</h2>
<h3>Các thước đo hiệu quả điều chỉnh theo rủi ro</h3>
<p>Chỉ nhìn lợi nhuận thô không cho biết nhà quản lý có chấp nhận rủi ro quá mức để đạt được nó hay không. Ba tỉ số điều chỉnh rủi ro chuẩn:</p>
<pre><code>Tỉ số Sharpe  = (rp - rf) / sigma_p        (lợi nhuận trên mỗi đơn vị rủi ro TOÀN PHẦN)
Tỉ số Treynor = (rp - rf) / beta_p         (lợi nhuận trên mỗi đơn vị rủi ro THỊ TRƯỜNG)
Alpha Jensen  = rp - [rf + beta_p x (rm - rf)]   (lợi nhuận vượt so với dự báo của CAPM)

Ví dụ giả định:
 rp = 12% ; rf = 3% ; sigma_p = 15% ; beta_p = 1,1 ; rm = 9%
 Sharpe = (12-3)/15 = 0,60
 Treynor = (12-3)/1,1 = 8,18
 Alpha Jensen = 12% - [3% + 1,1 x (9%-3%)] = 12% - 9,6% = 2,4%
</code></pre>
<p>Alpha Jensen dương (trong ví dụ giả định này) gợi ý danh mục vượt mức CAPM dự báo cho mức rủi ro của nó — nhưng một kỳ duy nhất nói lên rất ít; kết quả cần kiểm qua nhiều kỳ và đối chiếu với phí.</p>
<h3>Tài chính hành vi — các thiên lệch phổ biến</h3>
<ul>
<li><strong>Quá tự tin</strong> — đánh giá quá cao khả năng dự báo của bản thân, giao dịch quá nhiều.</li>
<li><strong>Hiệu ứng đám đông (herding)</strong> — chạy theo số đông vào/ra một giao dịch bất kể yếu tố cơ bản.</li>
<li><strong>E ngại mất mát (loss aversion)</strong> — cảm thấy mất mát đau hơn mức vui khi được lợi tương đương, dẫn đến giữ cổ phiếu lỗ quá lâu.</li>
<li><strong>Bám mốc (anchoring)</strong> — bám chặt một giá tham chiếu tuỳ ý (vd giá mua ban đầu) khi quyết định bán.</li>
</ul>
<h3>Thị trường chứng khoán Việt Nam</h3>
<ul>
<li><strong>HOSE</strong> (Sở Giao dịch Chứng khoán TP.HCM) — sàn chính, nơi tính <strong>VN-Index</strong>.</li>
<li><strong>HNX</strong> (Sở Giao dịch Chứng khoán Hà Nội) — sàn niêm yết thứ hai, cùng thị trường trái phiếu chính phủ.</li>
<li><strong>UPCoM</strong> — nền tảng giao dịch cho công ty đại chúng chưa niêm yết, điều kiện thường nhẹ hơn niêm yết.</li>
<li><strong>Cơ chế T+</strong> — cổ phiếu mua thường bán được sau vài ngày làm việc kể từ ngày giao dịch (số T+n cụ thể từng thay đổi theo thời gian — nên kiểm quy định hiện hành của sàn thay vì giả định một con số cố định).</li>
<li><strong>Giới hạn sở hữu nước ngoài ("room ngoại")</strong> — nhiều doanh nghiệp niêm yết Việt Nam giới hạn % cổ phần nhà đầu tư nước ngoài được nắm giữ, có thể ảnh hưởng giá cổ phiếu so với "room" còn lại.</li>
</ul>
<div class="callout"><span class="badge">Cảnh báo rủi ro cuối cùng</span> Hiệu quả quá khứ và mọi tỉ số ở trên không đảm bảo kết quả tương lai. Không có nội dung nào trong môn này là lời khuyên đầu tư — luôn tự nghiên cứu độc lập và xem xét khả năng chịu rủi ro của bản thân (hoặc hỏi chuyên gia được cấp phép) trước khi đầu tư tiền thật.</div>`,
  ]]);

const c8q = quiz('ipm301-quiz-8', 'Quiz 8 — Performance, behavior & Vietnam market|||Quiz 8 — Hiệu quả, hành vi & thị trường VN', [
  { id: 'q1', question: 'Tỉ số Sharpe đo lợi nhuận vượt trội trên mỗi đơn vị của loại rủi ro nào?', options: ['Chỉ rủi ro hệ thống (beta)', 'Rủi ro toàn phần (độ lệch chuẩn)', 'Rủi ro thanh khoản', 'Rủi ro tỉ giá'], correctIndex: 1, explanation: 'Sharpe = (rp-rf)/sigma_p — chia theo độ lệch chuẩn, tức rủi ro TOÀN PHẦN, khác Treynor (chia theo beta).' },
  { id: 'q2', question: 'Nhà đầu tư giữ cổ phiếu đang lỗ quá lâu vì "chưa muốn chấp nhận thua" là ví dụ của thiên lệch nào?', options: ['Quá tự tin', 'E ngại mất mát (loss aversion)', 'Hiệu ứng đám đông', 'Bám mốc'], correctIndex: 1, explanation: 'Loss aversion: cảm giác đau khi mất mát mạnh hơn vui khi được lợi tương đương, khiến giữ cổ phiếu lỗ quá lâu.' },
  { id: 'q3', question: 'VN-Index là chỉ số của sàn giao dịch nào?', options: ['HNX', 'UPCoM', 'HOSE', 'Sàn OTC tự do'], correctIndex: 2, explanation: 'VN-Index được tính trên Sở Giao dịch Chứng khoán TP.HCM (HOSE).' },
]);

export default {
  semester: { code: 'FPTU_Hola8', name: 'Kỳ 8', ordinal: 10 },
  course: {
    courseCode: 'IPM301',
    slug: 'ipm301-investments-and-portfolio-management',
    title: 'Investments and Portfolio Management',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/IPM301.webp',
    shortDescription: 'Stocks & bonds: risk-return & portfolio theory, valuation (DDM, P/E, YTM), CAPM & efficient markets, portfolio management, performance & behavioral finance, Vietnam market (HOSE/HNX). Bilingual, quizzes. Not investment advice.|||Cổ phiếu & trái phiếu: rủi ro-lợi nhuận & lý thuyết danh mục, định giá (DDM, P/E, YTM), CAPM & thị trường hiệu quả, quản lý danh mục, đánh giá hiệu quả & hành vi, thị trường Việt Nam (HOSE/HNX). Song ngữ, có quiz. Không khuyến nghị đầu tư.',
    description: 'Môn <strong>IPM301 — Investments and Portfolio Management</strong> (kỳ 8) dạy <strong>phân tích &amp; định giá đầu tư</strong> — trọng tâm khác AAP301 (nhấn phân bổ tài sản). Từ <strong>môi trường đầu tư &amp; thị trường</strong> (cổ phiếu, trái phiếu) → <strong>rủi ro/lợi nhuận &amp; lý thuyết danh mục</strong> → <strong>định giá cổ phiếu</strong> (DDM, P/E) → <strong>định giá trái phiếu &amp; lãi suất</strong> → <strong>CAPM &amp; thị trường hiệu quả</strong> → <strong>xây dựng &amp; quản lý danh mục</strong> → <strong>đánh giá hiệu quả, tài chính hành vi &amp; thị trường Việt Nam</strong> (HOSE/HNX). Bám giáo trình tham khảo (Bodie/Kane/Marcus, Reilly/Brown, CFA), song ngữ, ví dụ tính toán GIẢ ĐỊNH, quiz mỗi chương. Không khuyến nghị đầu tư.',
    whatYouLearn: 'Môi trường đầu tư (tài sản thực vs tài chính, thị trường sơ cấp/thứ cấp); thị trường tiền tệ vs vốn; cổ phiếu thường/ưu đãi, trái phiếu; tỉ suất sinh lợi nắm giữ (HPR), lợi nhuận kỳ vọng, phương sai/độ lệch chuẩn, đa dạng hoá, rủi ro hệ thống vs không hệ thống; định giá cổ phiếu bằng DDM (Gordon growth) và P/E; định giá trái phiếu, YTM, quan hệ giá-lãi suất, duration, đường cong lợi suất; CAPM, beta, SML, giả thuyết thị trường hiệu quả (EMH); quy trình quản lý danh mục, IPS, quản lý bị động vs chủ động, tái cân bằng; tỉ số Sharpe/Treynor/Jensen alpha, thiên lệch hành vi, cơ chế thị trường Việt Nam (HOSE, HNX, UPCoM, VN-Index, T+, room ngoại).',
    requirements: 'Kiến thức tài chính doanh nghiệp cơ bản (giá trị thời gian của tiền, lãi suất) và toán phổ thông. Nên xem trước môn Tài chính doanh nghiệp/Nguyên lý kế toán trong khung chương trình.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình tham khảo (Bodie/Kane/Marcus, Reilly/Brown, CFA), tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Đầu tư là gì, khác biệt với AAP301, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan đầu tư & môi trường đầu tư|||Chapter 1 — Investment overview & environment', description: 'Tài sản thực vs tài chính, các bên tham gia, thị trường sơ cấp/thứ cấp.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Thị trường & công cụ tài chính|||Chapter 2 — Markets & instruments', description: 'Thị trường tiền tệ vs vốn, cổ phiếu, trái phiếu.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Rủi ro, lợi nhuận & lý thuyết danh mục|||Chapter 3 — Risk, return & portfolio theory', description: 'HPR, phương sai, đa dạng hoá, rủi ro hệ thống.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Định giá cổ phiếu|||Chapter 4 — Equity valuation', description: 'Phân tích cơ bản, DDM (Gordon growth), P/E.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Định giá trái phiếu & lãi suất|||Chapter 5 — Bond valuation & interest rates', description: 'Giá trái phiếu, YTM, quan hệ giá-lãi suất, đường cong lợi suất.', lessons: [c5, c5q] },
    { title: 'Chương 6 — CAPM & thị trường hiệu quả|||Chapter 6 — CAPM & market efficiency', description: 'CAPM, beta, SML, giả thuyết thị trường hiệu quả (EMH).', lessons: [c6, c6q] },
    { title: 'Chương 7 — Xây dựng & quản lý danh mục|||Chapter 7 — Portfolio construction & management', description: 'Quy trình quản lý danh mục, IPS, bị động vs chủ động, tái cân bằng.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Đánh giá hiệu quả, hành vi & thị trường Việt Nam|||Chapter 8 — Performance, behavioral finance & Vietnam market', description: 'Sharpe/Treynor/Jensen, thiên lệch hành vi, HOSE/HNX/UPCoM.', lessons: [c8, c8q] },
  ],
};
