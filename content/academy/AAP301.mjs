/**
 * AAP301 — Asset Allocation and Portfolio Management. Khối Quản trị Kinh
 * doanh (BBA), FPTU. Giáo trình tham khảo: Bodie/Kane/Marcus "Investments";
 * Reilly/Brown "Investment Analysis and Portfolio Management";
 * Maginn/Tuttle "Managing Investment Portfolios"; CFA curriculum.
 * 8 chương: (1) Tổng quan & IPS, (2) Rủi ro & lợi nhuận, (3) Lý thuyết danh
 * mục hiện đại (Markowitz), (4) CAPM & APT, (5) Phân bổ chiến lược vs chiến
 * thuật, (6) Quản lý danh mục cổ phiếu, (7) Quản lý danh mục trái phiếu,
 * (8) Đánh giá hiệu quả & tái cân bằng. Song ngữ + ví dụ số GIẢ ĐỊNH + quiz.
 * Giữ NGUYÊN slug/semester/thumb. Không upload PDF giáo trình, chỉ trích dẫn.
 * KHÔNG backtick lồng/${; công thức viết chữ Latin (beta, sigma, alpha).
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('aap301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách kinh điển, tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">AAP301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Asset Allocation and Portfolio Management — investment policy statements, risk &amp; return, modern portfolio theory, asset pricing models, strategic/tactical allocation, equity &amp; fixed-income management, and performance evaluation — in one place. The full official slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giao trinh &amp; lecture slides for AAP301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><em>Investments</em> — Bodie, Kane &amp; Marcus (McGraw-Hill) — the standard investments textbook, covers portfolio theory, CAPM/APT and performance evaluation in depth.</li>
<li><em>Investment Analysis and Portfolio Management</em> — Reilly &amp; Brown (Cengage) — strong on asset allocation and equity/fixed-income portfolio strategies.</li>
<li><em>Managing Investment Portfolios: A Dynamic Process</em> — Maginn, Tuttle, Pinto &amp; McLeavey (CFA Institute) — the IPS and portfolio management process framework used across this course.</li>
<li><a href="https://www.cfainstitute.org/en/membership/professional-development/refresher-readings" target="_blank" rel="noopener">CFA Program curriculum readings</a> — portfolio management topic area, free overview pages.</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.investopedia.com/investing-4427685" target="_blank" rel="noopener">Investopedia — Investing &amp; Portfolio Management hub</a></li>
<li><a href="https://en.wikipedia.org/wiki/Modern_portfolio_theory" target="_blank" rel="noopener">Wikipedia — Modern Portfolio Theory</a></li>
<li><a href="https://en.wikipedia.org/wiki/Capital_asset_pricing_model" target="_blank" rel="noopener">Wikipedia — Capital Asset Pricing Model</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@Ben_Felix" target="_blank" rel="noopener">Ben Felix</a> — evidence-based portfolio theory and asset allocation explainers</li>
<li><a href="https://www.youtube.com/@MarketBeat" target="_blank" rel="noopener">Various CFA prep channels</a> — search "CAPM", "efficient frontier", "duration" for worked walkthroughs</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.portfoliovisualizer.com/" target="_blank" rel="noopener">Portfolio Visualizer</a> — backtest asset allocations, efficient frontier, factor analysis</li>
<li>Spreadsheet (Excel/Google Sheets) — build the two-asset variance and CAPM examples in this course yourself with real numbers</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — the investment process &amp; IPS, expected return/variance/covariance, the CAPM formula.</li>
<li><strong>Practice</strong> — compute two-asset portfolio risk and CAPM required return by hand with made-up numbers until it is automatic.</li>
<li><strong>Go deeper</strong> — efficient frontier, strategic vs tactical allocation, active vs passive equity, duration/convexity for bonds.</li>
<li><strong>Job-ready</strong> — read a real fund fact sheet and compute its Sharpe ratio and tracking error from public return data.</li>
</ol></div>`,
    `<span class="eyebrow">AAP301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Phân bổ tài sản và Quản lý danh mục đầu tư — tuyên bố chính sách đầu tư, rủi ro &amp; lợi nhuận, lý thuyết danh mục hiện đại, mô hình định giá tài sản, phân bổ chiến lược/chiến thuật, quản lý cổ phiếu &amp; trái phiếu, đánh giá hiệu quả — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của AAP301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><em>Investments</em> — Bodie, Kane &amp; Marcus (McGraw-Hill) — sách giáo khoa đầu tư chuẩn, có đủ lý thuyết danh mục, CAPM/APT và đánh giá hiệu quả.</li>
<li><em>Investment Analysis and Portfolio Management</em> — Reilly &amp; Brown (Cengage) — mạnh về phân bổ tài sản và chiến lược danh mục cổ phiếu/trái phiếu.</li>
<li><em>Managing Investment Portfolios: A Dynamic Process</em> — Maginn, Tuttle, Pinto &amp; McLeavey (CFA Institute) — khung IPS và quy trình quản lý danh mục dùng xuyên suốt môn.</li>
<li><a href="https://www.cfainstitute.org/en/membership/professional-development/refresher-readings" target="_blank" rel="noopener">Tài liệu chương trình CFA</a> — mảng quản lý danh mục, có trang tổng quan miễn phí.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.investopedia.com/investing-4427685" target="_blank" rel="noopener">Investopedia — mục Đầu tư &amp; Quản lý danh mục</a></li>
<li><a href="https://en.wikipedia.org/wiki/Modern_portfolio_theory" target="_blank" rel="noopener">Wikipedia — Lý thuyết danh mục hiện đại</a></li>
<li><a href="https://en.wikipedia.org/wiki/Capital_asset_pricing_model" target="_blank" rel="noopener">Wikipedia — Mô hình định giá tài sản vốn (CAPM)</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@Ben_Felix" target="_blank" rel="noopener">Ben Felix</a> — giải thích lý thuyết danh mục và phân bổ tài sản dựa trên bằng chứng</li>
<li><a href="https://www.youtube.com/@MarketBeat" target="_blank" rel="noopener">Các kênh luyện CFA</a> — tìm "CAPM", "efficient frontier", "duration" để xem giải bài mẫu</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.portfoliovisualizer.com/" target="_blank" rel="noopener">Portfolio Visualizer</a> — backtest phân bổ tài sản, đường biên hiệu quả, phân tích nhân tố</li>
<li>Bảng tính (Excel/Google Sheets) — tự dựng lại ví dụ phương sai hai tài sản và CAPM trong môn bằng số liệu thật</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — quy trình đầu tư &amp; IPS, lợi nhuận kỳ vọng/phương sai/hiệp phương sai, công thức CAPM.</li>
<li><strong>Luyện tập</strong> — tự tính rủi ro danh mục hai tài sản và lợi nhuận yêu cầu theo CAPM bằng số liệu tự đặt đến khi thành phản xạ.</li>
<li><strong>Đào sâu</strong> — đường biên hiệu quả, phân bổ chiến lược vs chiến thuật, cổ phiếu chủ động vs bị động, duration/convexity cho trái phiếu.</li>
<li><strong>Sẵn sàng đi làm</strong> — đọc bản cáo bạch một quỹ thật và tự tính Sharpe ratio, tracking error từ dữ liệu lợi nhuận công khai.</li>
</ol></div>`,
  ]]);

const intro = doc('aap301-0-1-overview', 'Course overview: Asset Allocation and Portfolio Management|||Tổng quan: Phân bổ tài sản và Quản lý danh mục đầu tư',
  'Quản lý danh mục là gì, vì sao đầu tư theo danh mục thay vì từng tài sản đơn lẻ; lộ trình 8 chương từ quy trình đầu tư đến đánh giá hiệu quả.',
  [[
    `<span class="eyebrow">AAP301 · Lesson 0.1 · Overview</span>
<h2>Asset Allocation &amp; Portfolio Management</h2>
<p class="lead">This course teaches you how professional investors and fund managers build, allocate and evaluate <strong>portfolios</strong> — combinations of assets — rather than picking single stocks in isolation. You will learn the investment process, how to measure risk and return, how diversification reduces risk (Markowitz), how assets are priced (CAPM/APT), how to allocate across asset classes, and how to manage and evaluate equity and bond portfolios.</p>
<h3>Why a portfolio, not a single asset</h3>
<ul>
<li><strong>Diversification</strong> — combining imperfectly correlated assets reduces total risk without necessarily reducing expected return.</li>
<li><strong>Goals &amp; constraints</strong> — every investor has a return objective, a risk tolerance, a time horizon and liquidity needs; the portfolio must fit the investor, not the other way around.</li>
<li><strong>Trade-off</strong> — higher expected return generally requires accepting higher risk; portfolio management is about finding the best trade-off for a given investor.</li>
</ul>
<h3>Roadmap</h3>
<p>Investment process &amp; investment policy statement (IPS) → risk &amp; return measurement → modern portfolio theory (Markowitz, efficient frontier) → asset pricing models (CAPM, APT) → strategic vs tactical asset allocation → equity portfolio management → fixed-income portfolio management → performance evaluation &amp; rebalancing. Bilingual, with worked numeric examples (assumed figures) and a quiz per chapter.</p>`,
    `<span class="eyebrow">AAP301 · Bài 0.1 · Tổng quan</span>
<h2>Phân bổ tài sản &amp; Quản lý danh mục đầu tư</h2>
<p class="lead">Môn này dạy cách nhà đầu tư chuyên nghiệp và người quản lý quỹ xây dựng, phân bổ và đánh giá <strong>danh mục đầu tư</strong> — tổ hợp nhiều tài sản — thay vì chọn từng cổ phiếu riêng lẻ. Bạn sẽ học quy trình đầu tư, cách đo rủi ro &amp; lợi nhuận, cách đa dạng hoá giảm rủi ro (Markowitz), cách tài sản được định giá (CAPM/APT), cách phân bổ giữa các lớp tài sản, và cách quản lý &amp; đánh giá danh mục cổ phiếu, trái phiếu.</p>
<h3>Vì sao là danh mục, không phải một tài sản đơn lẻ</h3>
<ul>
<li><strong>Đa dạng hoá</strong> — kết hợp các tài sản không tương quan hoàn hảo giúp giảm tổng rủi ro mà không nhất thiết giảm lợi nhuận kỳ vọng.</li>
<li><strong>Mục tiêu &amp; ràng buộc</strong> — mỗi nhà đầu tư có mục tiêu lợi nhuận, mức chấp nhận rủi ro, khung thời gian và nhu cầu thanh khoản riêng; danh mục phải khớp với nhà đầu tư, không phải ngược lại.</li>
<li><strong>Đánh đổi</strong> — lợi nhuận kỳ vọng cao hơn thường đòi chấp nhận rủi ro cao hơn; quản lý danh mục là tìm đánh đổi tốt nhất cho một nhà đầu tư cụ thể.</li>
</ul>
<h3>Lộ trình</h3>
<p>Quy trình đầu tư &amp; tuyên bố chính sách đầu tư (IPS) → đo rủi ro &amp; lợi nhuận → lý thuyết danh mục hiện đại (Markowitz, đường biên hiệu quả) → mô hình định giá tài sản (CAPM, APT) → phân bổ tài sản chiến lược vs chiến thuật → quản lý danh mục cổ phiếu → quản lý danh mục trái phiếu → đánh giá hiệu quả &amp; tái cân bằng. Song ngữ, có ví dụ số minh hoạ (số liệu giả định) và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('aap301-1-1-process-ips', '1.1 — The investment process & the Investment Policy Statement|||1.1 — Quy trình đầu tư & Tuyên bố chính sách đầu tư (IPS)',
  'Quy trình quản lý danh mục 3 bước (Lập kế hoạch → Thực thi → Phản hồi); nội dung IPS: mục tiêu (lợi nhuận, rủi ro) và ràng buộc (thanh khoản, thời gian, thuế, pháp lý, đặc thù).',
  [[
    `<span class="eyebrow">AAP301 · Chapter 1 · Lesson 1.1</span>
<h2>The investment process &amp; the Investment Policy Statement</h2>
<h3>The portfolio management process</h3>
<ul>
<li><strong>Planning</strong> — understand the investor, write the Investment Policy Statement (IPS), form capital market expectations, decide the strategic asset allocation.</li>
<li><strong>Execution</strong> — select specific asset classes and securities, build the actual portfolio.</li>
<li><strong>Feedback</strong> — monitor the portfolio, rebalance, and evaluate performance against objectives; loop back into planning.</li>
</ul>
<h3>The Investment Policy Statement (IPS)</h3>
<p>The IPS is the governing document that ties every later decision back to the investor. It has two parts:</p>
<ul>
<li><strong>Objectives</strong> — <strong>return objective</strong> (what growth/income the investor needs) and <strong>risk tolerance</strong> (both willingness and ability to bear risk).</li>
<li><strong>Constraints</strong> — <strong>liquidity</strong> needs (cash outflows expected), <strong>time horizon</strong> (single- or multi-stage), <strong>tax</strong> situation, <strong>legal &amp; regulatory</strong> factors, and <strong>unique circumstances</strong> (e.g. ethical restrictions, concentrated positions).</li>
</ul>
<pre><code>Example (IPS snapshot, assumed figures):
 Investor: 35-year-old professional, 25-year horizon to retirement
 Return objective : 7% nominal per year (to reach a target nest egg)
 Risk tolerance    : Above-average (high ability: long horizon, stable income)
 Liquidity need    : Low (emergency fund held separately)
 Time horizon      : Multi-stage (accumulation now, then decumulation at 65)
 -> Strategic asset allocation consistent with this IPS: growth-tilted,
    e.g. 80% equity / 20% fixed income (illustrative only)
</code></pre>
<div class="callout"><span class="badge">IPS first, portfolio second</span> A portfolio manager never picks securities before the IPS is written — every allocation decision downstream must be traceable back to the objectives and constraints in it.</div>`,
    `<span class="eyebrow">AAP301 · Chương 1 · Bài 1.1</span>
<h2>Quy trình đầu tư &amp; Tuyên bố chính sách đầu tư (IPS)</h2>
<h3>Quy trình quản lý danh mục</h3>
<ul>
<li><strong>Lập kế hoạch</strong> — hiểu nhà đầu tư, viết Tuyên bố chính sách đầu tư (IPS), hình thành kỳ vọng thị trường vốn, quyết định phân bổ tài sản chiến lược.</li>
<li><strong>Thực thi</strong> — chọn lớp tài sản và chứng khoán cụ thể, dựng danh mục thật.</li>
<li><strong>Phản hồi</strong> — giám sát danh mục, tái cân bằng, và đánh giá hiệu quả so với mục tiêu; vòng lặp quay lại bước lập kế hoạch.</li>
</ul>
<h3>Tuyên bố chính sách đầu tư (IPS)</h3>
<p>IPS là văn bản chi phối, gắn mọi quyết định sau này với nhà đầu tư. Gồm hai phần:</p>
<ul>
<li><strong>Mục tiêu</strong> — <strong>mục tiêu lợi nhuận</strong> (cần tăng trưởng/thu nhập bao nhiêu) và <strong>mức chấp nhận rủi ro</strong> (cả sẵn lòng lẫn khả năng chịu rủi ro).</li>
<li><strong>Ràng buộc</strong> — nhu cầu <strong>thanh khoản</strong> (dòng tiền ra dự kiến), <strong>khung thời gian</strong> (một hay nhiều giai đoạn), tình trạng <strong>thuế</strong>, yếu tố <strong>pháp lý &amp; quy định</strong>, và <strong>hoàn cảnh đặc thù</strong> (vd hạn chế đạo đức, vị thế tập trung).</li>
</ul>
<pre><code>Ví dụ (tóm tắt IPS, số liệu giả định):
 Nhà đầu tư: chuyên viên 35 tuổi, còn 25 năm tới khi nghỉ hưu
 Mục tiêu lợi nhuận : 7% danh nghĩa mỗi năm (để đạt khoản tích luỹ mục tiêu)
 Mức chấp nhận rủi ro: Trên trung bình (khả năng cao: khung thời gian dài, thu nhập ổn định)
 Nhu cầu thanh khoản : Thấp (quỹ khẩn cấp giữ riêng)
 Khung thời gian      : Nhiều giai đoạn (tích luỹ nay, rút dần sau 65 tuổi)
 -> Phân bổ tài sản chiến lược khớp IPS này: nghiêng tăng trưởng,
    vd 80% cổ phiếu / 20% thu nhập cố định (chỉ minh hoạ)
</code></pre>
<div class="callout"><span class="badge">IPS trước, danh mục sau</span> Người quản lý danh mục không bao giờ chọn chứng khoán trước khi có IPS — mọi quyết định phân bổ về sau phải truy ngược được về mục tiêu và ràng buộc trong đó.</div>`,
  ]]);

const c1q = quiz('aap301-quiz-1', 'Quiz 1 — Quy trinh dau tu va IPS|||Quiz 1 — Investment process & IPS', [
  { id: 'q1', question: 'Ba buoc cua quy trinh quan ly danh muc la?', options: ['Lap ke hoach, Thuc thi, Phan hoi', 'Mua, Ban, Giu', 'Phan tich, Du bao, Bao cao', 'Thu thap, Xu ly, Luu tru'], correctIndex: 0, explanation: 'Quy trinh gom Lap ke hoach (IPS, ky vong thi truong, phan bo chien luoc), Thuc thi (chon tai san), Phan hoi (giam sat, tai can bang, danh gia).' },
  { id: 'q2', question: 'IPS (Tuyen bo chinh sach dau tu) gom hai phan chinh nao?', options: ['Muc tieu va Rang buoc', 'Loi nhuan va Thue', 'Co phieu va Trai phieu', 'Ngan han va Dai han'], correctIndex: 0, explanation: 'IPS gom Muc tieu (loi nhuan, muc chap nhan rui ro) va Rang buoc (thanh khoan, thoi gian, thue, phap ly, dac thu).' },
  { id: 'q3', question: 'Vi sao phai viet IPS truoc khi chon chung khoan cu the?', options: ['De co van ban dep nop cho khach hang', 'De moi quyet dinh phan bo truy nguoc duoc ve muc tieu va rang buoc cua nha dau tu', 'Vi luat bat buoc moi nuoc', 'De tinh thue thap hon'], correctIndex: 1, explanation: 'IPS la kim chi nam: danh muc phai khop voi nha dau tu, khong phai nguoc lai.' },
]);

const c2 = doc('aap301-2-1-risk-return', '2.1 — Risk, return & measurement|||2.1 — Rủi ro, lợi nhuận & đo lường',
  'Lợi nhuận nắm giữ (HPR), lợi nhuận kỳ vọng, phương sai & độ lệch chuẩn, hiệp phương sai & hệ số tương quan giữa hai tài sản.',
  [[
    `<span class="eyebrow">AAP301 · Chapter 2 · Lesson 2.1</span>
<h2>Risk, return &amp; measurement</h2>
<h3>Return</h3>
<p>The <strong>holding period return (HPR)</strong> over one period: <code>HPR = (Ending price - Beginning price + Cash flow) / Beginning price</code>. Over multiple scenarios, the <strong>expected return</strong> is the probability-weighted average: <code>E(R) = sum of [probability(i) x return(i)]</code>.</p>
<h3>Risk</h3>
<p><strong>Variance</strong> measures how spread out returns are around the expected return; <strong>standard deviation (SD)</strong> is its square root and is expressed in the same unit as return (percent).</p>
<pre><code>Example (assumed figures, 3 scenarios for Asset A):
 Scenario   Probability   Return
 Boom          0.3          20%
 Normal        0.5           8%
 Recession     0.2          -6%

 E(R) = 0.3(20%) + 0.5(8%) + 0.2(-6%) = 6.0% + 4.0% - 1.2% = 8.8%
 Variance = 0.3(20-8.8)^2 + 0.5(8-8.8)^2 + 0.2(-6-8.8)^2
          = 0.3(125.44) + 0.5(0.64) + 0.2(219.04)
          = 37.63 + 0.32 + 43.81 = 81.76
 SD = sqrt(81.76) = 9.04%
</code></pre>
<h3>Covariance &amp; correlation between two assets</h3>
<p><strong>Covariance</strong> shows whether two assets move together (positive) or oppositely (negative). <strong>Correlation</strong> rescales covariance to between -1 and +1: <code>Correlation(A,B) = Covariance(A,B) / (SD(A) x SD(B))</code>. Correlation below +1 is exactly what makes diversification work (Chapter 3).</p>
<div class="callout"><span class="badge">Units matter</span> Variance is in "percent-squared" and is hard to interpret directly — always convert back to standard deviation (percent) when communicating risk.</div>`,
    `<span class="eyebrow">AAP301 · Chương 2 · Bài 2.1</span>
<h2>Rủi ro, lợi nhuận &amp; đo lường</h2>
<h3>Lợi nhuận</h3>
<p><strong>Lợi nhuận nắm giữ (HPR)</strong> trong một kỳ: <code>HPR = (Giá cuối - Giá đầu + Dòng tiền nhận) / Giá đầu</code>. Với nhiều kịch bản, <strong>lợi nhuận kỳ vọng</strong> là trung bình có trọng số xác suất: <code>E(R) = tổng của [xác suất(i) x lợi nhuận(i)]</code>.</p>
<h3>Rủi ro</h3>
<p><strong>Phương sai</strong> đo mức độ phân tán của lợi nhuận quanh giá trị kỳ vọng; <strong>độ lệch chuẩn (SD)</strong> là căn bậc hai của phương sai, cùng đơn vị với lợi nhuận (phần trăm).</p>
<pre><code>Vi du (so lieu gia dinh, 3 kich ban cho Tai san A):
 Kich ban    Xac suat     Loi nhuan
 Tang truong    0.3          20%
 Binh thuong    0.5           8%
 Suy thoai      0.2          -6%

 E(R) = 0.3(20%) + 0.5(8%) + 0.2(-6%) = 6.0% + 4.0% - 1.2% = 8.8%
 Phuong sai = 0.3(20-8.8)^2 + 0.5(8-8.8)^2 + 0.2(-6-8.8)^2
            = 0.3(125.44) + 0.5(0.64) + 0.2(219.04)
            = 37.63 + 0.32 + 43.81 = 81.76
 SD = sqrt(81.76) = 9.04%
</code></pre>
<h3>Hiệp phương sai &amp; hệ số tương quan giữa hai tài sản</h3>
<p><strong>Hiệp phương sai (covariance)</strong> cho biết hai tài sản di chuyển cùng chiều (dương) hay ngược chiều (âm). <strong>Hệ số tương quan (correlation)</strong> quy hiệp phương sai về khoảng -1 đến +1: <code>Correlation(A,B) = Covariance(A,B) / (SD(A) x SD(B))</code>. Tương quan nhỏ hơn +1 chính là điều làm đa dạng hoá có tác dụng (Chương 3).</p>
<div class="callout"><span class="badge">Chú ý đơn vị</span> Phương sai có đơn vị "phần trăm bình phương", khó diễn giải trực tiếp — luôn quy về độ lệch chuẩn (phần trăm) khi trình bày rủi ro.</div>`,
  ]]);

const c2q = quiz('aap301-quiz-2', 'Quiz 2 — Rui ro va loi nhuan|||Quiz 2 — Risk & return', [
  { id: 'q1', question: 'Loi nhuan ky vong E(R) duoc tinh bang cach nao?', options: ['Trung binh cong don gian cua cac loi nhuan', 'Trung binh co trong so xac suat cua cac loi nhuan theo kich ban', 'Loi nhuan cao nhat trong cac kich ban', 'Do lech chuan cua loi nhuan'], correctIndex: 1, explanation: 'E(R) = tong cua [xac suat(i) x loi nhuan(i)] qua tat ca kich ban.' },
  { id: 'q2', question: 'Do lech chuan (SD) lien he the nao voi phuong sai?', options: ['SD la binh phuong cua phuong sai', 'SD la can bac hai cua phuong sai', 'SD va phuong sai khong lien quan', 'SD luon lon hon phuong sai'], correctIndex: 1, explanation: 'SD = sqrt(Phuong sai); SD co cung don vi voi loi nhuan (phan tram) nen de dien giai hon.' },
  { id: 'q3', question: 'He so tuong quan (correlation) giua hai tai san nam trong khoang nao?', options: ['0 den 100', '-1 den +1', 'Khong co gioi han', '0 den 1 mà thoi'], correctIndex: 1, explanation: 'Correlation = Covariance/(SD_A x SD_B), luon nam trong [-1, +1].' },
]);

const c3 = doc('aap301-3-1-mpt', '3.1 — Modern Portfolio Theory & the efficient frontier|||3.1 — Lý thuyết danh mục hiện đại & đường biên hiệu quả',
  'Markowitz: phương sai danh mục hai tài sản, lợi ích đa dạng hoá, đường biên hiệu quả, danh mục phương sai tối thiểu.',
  [[
    `<span class="eyebrow">AAP301 · Chapter 3 · Lesson 3.1</span>
<h2>Modern Portfolio Theory &amp; the efficient frontier</h2>
<h3>Two-asset portfolio variance</h3>
<p>Harry Markowitz showed that a portfolio's risk depends not just on each asset's own risk, but on how they move together. For two assets A and B with weights w(A) and w(B) = 1 - w(A):</p>
<pre><code>Portfolio variance:
 Var(p) = w(A)^2 x Var(A) + w(B)^2 x Var(B)
          + 2 x w(A) x w(B) x Covariance(A,B)

Example (assumed figures):
 SD(A) = 20%, SD(B) = 12%, Correlation(A,B) = 0.30
 Covariance(A,B) = 0.30 x 20 x 12 = 72
 Weights: 60% A, 40% B
 Var(p) = 0.6^2(20^2) + 0.4^2(12^2) + 2(0.6)(0.4)(72)
        = 0.36(400) + 0.16(144) + 0.48(72)
        = 144 + 23.04 + 34.56 = 201.6
 SD(p) = sqrt(201.6) = 14.20%
 (Note: 14.20% is LESS than the weighted average SD of 0.6(20)+0.4(12)=16.8% —
  this gap IS the diversification benefit, and it grows as correlation falls.)
</code></pre>
<h3>The efficient frontier</h3>
<p>Plotting every possible combination of weights on a risk-return graph traces out a curve. The <strong>efficient frontier</strong> is the upper-left edge of that curve — portfolios offering the highest expected return for each level of risk (or lowest risk for each level of return). The <strong>minimum-variance portfolio</strong> is the single point on the frontier with the lowest possible risk.</p>
<div class="callout"><span class="badge">Diversification is not free lunch magic</span> It works because correlation is below +1, not because risk simply disappears. Combining two assets with correlation of exactly +1 gives NO diversification benefit at all — Var(p) collapses to the plain weighted average.</div>`,
    `<span class="eyebrow">AAP301 · Chương 3 · Bài 3.1</span>
<h2>Lý thuyết danh mục hiện đại &amp; đường biên hiệu quả</h2>
<h3>Phương sai danh mục hai tài sản</h3>
<p>Harry Markowitz chỉ ra rằng rủi ro của danh mục không chỉ phụ thuộc vào rủi ro riêng từng tài sản, mà còn vào cách chúng di chuyển cùng nhau. Với hai tài sản A và B có tỉ trọng w(A) và w(B) = 1 - w(A):</p>
<pre><code>Phuong sai danh muc:
 Var(p) = w(A)^2 x Var(A) + w(B)^2 x Var(B)
          + 2 x w(A) x w(B) x Covariance(A,B)

Vi du (so lieu gia dinh):
 SD(A) = 20%, SD(B) = 12%, Correlation(A,B) = 0.30
 Covariance(A,B) = 0.30 x 20 x 12 = 72
 Ti trong: 60% A, 40% B
 Var(p) = 0.6^2(20^2) + 0.4^2(12^2) + 2(0.6)(0.4)(72)
        = 0.36(400) + 0.16(144) + 0.48(72)
        = 144 + 23.04 + 34.56 = 201.6
 SD(p) = sqrt(201.6) = 14.20%
 (Chu y: 14.20% NHO HON trung binh co trong so cua SD la 0.6(20)+0.4(12)=16.8% —
  khoang chenh nay CHINH LA loi ich da dang hoa, va lon dan khi tuong quan giam.)
</code></pre>
<h3>Đường biên hiệu quả</h3>
<p>Vẽ mọi tổ hợp tỉ trọng có thể lên đồ thị rủi ro-lợi nhuận sẽ ra một đường cong. <strong>Đường biên hiệu quả</strong> là mép trên-trái của đường cong đó — các danh mục cho lợi nhuận kỳ vọng cao nhất ở mỗi mức rủi ro (hoặc rủi ro thấp nhất ở mỗi mức lợi nhuận). <strong>Danh mục phương sai tối thiểu</strong> là điểm duy nhất trên đường biên có rủi ro thấp nhất có thể.</p>
<div class="callout"><span class="badge">Đa dạng hoá không phải phép màu miễn phí</span> Nó có tác dụng vì tương quan nhỏ hơn +1, không phải vì rủi ro tự nhiên biến mất. Kết hợp hai tài sản có tương quan đúng bằng +1 thì KHÔNG có lợi ích đa dạng hoá nào cả — Var(p) rút gọn về đúng trung bình có trọng số.</div>`,
  ]]);

const c3q = quiz('aap301-quiz-3', 'Quiz 3 — Ly thuyet danh muc hien dai|||Quiz 3 — Modern portfolio theory', [
  { id: 'q1', question: 'Yeu to nao trong cong thuc phuong sai danh muc hai tai san the hien loi ich da dang hoa?', options: ['w(A)^2 x Var(A)', 'w(B)^2 x Var(B)', 'So hang hiep phuong sai 2 x w(A) x w(B) x Covariance(A,B)', 'Tong ti trong w(A) + w(B)'], correctIndex: 2, explanation: 'So hang hiep phuong sai am hoac nho hon tuong quan +1 lam giam Var(p) so voi trung binh co trong so gian don.' },
  { id: 'q2', question: 'Neu tuong quan giua hai tai san dung bang +1 thi dieu gi xay ra?', options: ['Rui ro danh muc bang 0', 'Khong co loi ich da dang hoa, Var(p) bang trung binh co trong so gian don', 'Loi nhuan ky vong tang gap doi', 'Danh muc tu dong toi uu'], correctIndex: 1, explanation: 'Tuong quan +1 nghia la hai tai san di chuyen hoan toan cung chieu, khong co gi de trung hoa lan nhau.' },
  { id: 'q3', question: 'Danh muc phuong sai toi thieu la gi?', options: ['Danh muc chi gom mot tai san rui ro nhat', 'Diem tren duong bien hieu qua co rui ro thap nhat co the', 'Danh muc co loi nhuan ky vong cao nhat', 'Danh muc khong co tai san rui ro'], correctIndex: 1, explanation: 'Do la diem duy nhat tren duong bien hieu qua ung voi muc rui ro (Var/SD) thap nhat co the dat duoc.' },
]);

const c4 = doc('aap301-4-1-capm-apt', '4.1 — Asset pricing models: CAPM & APT|||4.1 — Mô hình định giá tài sản: CAPM & APT',
  'CAPM: beta, đường thị trường chứng khoán (SML), lợi nhuận yêu cầu; APT: mô hình đa nhân tố.',
  [[
    `<span class="eyebrow">AAP301 · Chapter 4 · Lesson 4.1</span>
<h2>Asset pricing models: CAPM &amp; APT</h2>
<h3>The Capital Asset Pricing Model (CAPM)</h3>
<p>CAPM says only <strong>systematic (market) risk</strong> — risk that cannot be diversified away — should earn a return premium. That risk is measured by <strong>beta</strong>: <code>beta = Covariance(Ri, Rm) / Variance(Rm)</code>, where Rm is the market return. Beta of 1.0 moves with the market; above 1.0 amplifies market moves; below 1.0 dampens them.</p>
<pre><code>CAPM formula:
 E(Ri) = Rf + beta x [E(Rm) - Rf]

Example (assumed figures):
 Risk-free rate Rf = 3%
 Expected market return E(Rm) = 9%  -> market risk premium = 6%
 Stock beta = 1.4
 E(Ri) = 3% + 1.4 x (9% - 3%) = 3% + 1.4(6%) = 3% + 8.4% = 11.4%
 -> This is the "required" return for taking on this stock's systematic risk.
</code></pre>
<h3>The Security Market Line (SML)</h3>
<p>Plotting E(Ri) against beta for all assets traces the SML — a straight line. An asset priced ABOVE the SML (expected return higher than CAPM says it should be for its beta) is considered undervalued; below the line, overvalued.</p>
<h3>Arbitrage Pricing Theory (APT)</h3>
<p>APT generalizes CAPM: instead of one risk factor (the market), return depends on multiple macro factors (e.g. inflation, interest rates, industrial production), each with its own sensitivity (b1, b2, ...): <code>E(Ri) = Rf + b1 x F1 + b2 x F2 + ...</code>. APT does not specify which factors matter — that is determined empirically.</p>
<div class="callout"><span class="badge">Systematic vs unsystematic</span> Diversification (Chapter 3) removes unsystematic (firm-specific) risk almost entirely in a large portfolio. What is left — and what CAPM/APT price — is systematic risk that no amount of diversification can remove.</div>`,
    `<span class="eyebrow">AAP301 · Chương 4 · Bài 4.1</span>
<h2>Mô hình định giá tài sản: CAPM &amp; APT</h2>
<h3>Mô hình định giá tài sản vốn (CAPM)</h3>
<p>CAPM cho rằng chỉ <strong>rủi ro hệ thống (thị trường)</strong> — rủi ro không thể loại bỏ bằng đa dạng hoá — mới xứng đáng có phần bù lợi nhuận. Rủi ro đó đo bằng <strong>beta</strong>: <code>beta = Covariance(Ri, Rm) / Variance(Rm)</code>, với Rm là lợi nhuận thị trường. Beta = 1.0 di chuyển đúng theo thị trường; trên 1.0 khuếch đại biến động thị trường; dưới 1.0 làm giảm nhẹ.</p>
<pre><code>Cong thuc CAPM:
 E(Ri) = Rf + beta x [E(Rm) - Rf]

Vi du (so lieu gia dinh):
 Lai suat phi rui ro Rf = 3%
 Loi nhuan thi truong ky vong E(Rm) = 9%  -> phan bu rui ro thi truong = 6%
 Beta co phieu = 1.4
 E(Ri) = 3% + 1.4 x (9% - 3%) = 3% + 1.4(6%) = 3% + 8.4% = 11.4%
 -> Day la loi nhuan "yeu cau" de chap nhan rui ro he thong cua co phieu nay.
</code></pre>
<h3>Đường thị trường chứng khoán (SML)</h3>
<p>Vẽ E(Ri) theo beta cho mọi tài sản sẽ ra đường SML — một đường thẳng. Tài sản định giá NẰM TRÊN SML (lợi nhuận kỳ vọng cao hơn mức CAPM nói nên có với beta đó) được xem là định giá thấp; nằm dưới đường thì bị định giá cao.</p>
<h3>Lý thuyết định giá kinh doanh chênh lệch (APT)</h3>
<p>APT tổng quát hoá CAPM: thay vì một nhân tố rủi ro (thị trường), lợi nhuận phụ thuộc vào nhiều nhân tố vĩ mô (vd lạm phát, lãi suất, sản xuất công nghiệp), mỗi nhân tố có độ nhạy riêng (b1, b2, ...): <code>E(Ri) = Rf + b1 x F1 + b2 x F2 + ...</code>. APT không chỉ rõ nhân tố nào quan trọng — điều đó được xác định bằng thực nghiệm.</p>
<div class="callout"><span class="badge">Hệ thống vs phi hệ thống</span> Đa dạng hoá (Chương 3) loại gần như hết rủi ro phi hệ thống (đặc thù công ty) trong một danh mục lớn. Phần còn lại — và cũng là phần CAPM/APT định giá — là rủi ro hệ thống mà không đa dạng hoá nào loại bỏ được.</div>`,
  ]]);

const c4q = quiz('aap301-quiz-4', 'Quiz 4 — CAPM va APT|||Quiz 4 — CAPM & APT', [
  { id: 'q1', question: 'Beta trong CAPM do luong dieu gi?', options: ['Tong rui ro cua tai san', 'Rui ro he thong (nhay voi thi truong)', 'Rui ro phi he thong (dac thu cong ty)', 'Ty le co tuc'], correctIndex: 1, explanation: 'Beta = Covariance(Ri,Rm)/Variance(Rm), do do nhay cua tai san voi bien dong thi truong.' },
  { id: 'q2', question: 'Voi Rf=3%, E(Rm)=9%, beta=1.4, loi nhuan yeu cau theo CAPM la bao nhieu?', options: ['9.0%', '11.4%', '12.6%', '6.0%'], correctIndex: 1, explanation: 'E(Ri) = 3% + 1.4 x (9%-3%) = 3% + 8.4% = 11.4%.' },
  { id: 'q3', question: 'Khac biet chinh giua APT va CAPM la gi?', options: ['APT dung nhieu nhan tot rui ro thay vi chi mot nhan to thi truong', 'APT khong can lai suat phi rui ro', 'CAPM dung cho trai phieu, APT dung cho co phieu', 'APT va CAPM giong het nhau'], correctIndex: 0, explanation: 'APT tong quat hoa CAPM bang mo hinh da nhan to (F1, F2, ...) thay vi chi mot nhan to thi truong.' },
]);

const c5 = doc('aap301-5-1-saa-taa', '5.1 — Strategic vs tactical asset allocation|||5.1 — Phân bổ tài sản chiến lược vs chiến thuật',
  'Phân bổ chiến lược (SAA) đặt tỉ trọng mục tiêu dài hạn theo IPS; phân bổ chiến thuật (TAA) lệch ngắn hạn theo quan điểm thị trường trong biên độ cho phép; cách tiếp cận core-satellite.',
  [[
    `<span class="eyebrow">AAP301 · Chapter 5 · Lesson 5.1</span>
<h2>Strategic vs tactical asset allocation</h2>
<h3>Strategic Asset Allocation (SAA)</h3>
<p>SAA sets long-run <strong>target weights</strong> across asset classes (equity, fixed income, cash, alternatives) that best match the investor's IPS — return objective, risk tolerance and time horizon — combined with long-term capital market expectations. It is meant to be held through market cycles, not changed on short-term news.</p>
<h3>Tactical Asset Allocation (TAA)</h3>
<p>TAA allows short-term, deliberate deviations from the strategic targets to exploit a market view (e.g. overweighting equity because valuations look cheap). Deviations are usually kept inside pre-agreed <strong>rebalancing bands</strong> so tactical bets cannot silently turn into a different strategy.</p>
<pre><code>Example (assumed figures):
 Strategic target: 60% equity / 40% fixed income
 Rebalancing band: +/- 5 percentage points around each target
 Manager's tactical view: equities look undervalued this quarter
 -> Tactical position: 64% equity / 36% fixed income (within the +/-5% band)
 If equity drifted to 68% from market gains alone (outside the band)
 -> Trigger a REBALANCING trade back toward 60/40, regardless of view.
</code></pre>
<h3>Core-satellite approach</h3>
<p>A common structure: a large, low-cost <strong>core</strong> holding tracks the strategic allocation (often passively), while a smaller <strong>satellite</strong> sleeve is actively managed to express tactical views — limiting how much any one tactical bet can hurt the whole portfolio.</p>
<div class="callout"><span class="badge">Bands do two jobs</span> They give the tactical manager room to act on a view, AND they force a rebalancing trade automatically if pure market drift pushes weights too far — discipline against both extremes.</div>`,
    `<span class="eyebrow">AAP301 · Chương 5 · Bài 5.1</span>
<h2>Phân bổ tài sản chiến lược vs chiến thuật</h2>
<h3>Phân bổ tài sản chiến lược (SAA)</h3>
<p>SAA đặt <strong>tỉ trọng mục tiêu</strong> dài hạn giữa các lớp tài sản (cổ phiếu, thu nhập cố định, tiền mặt, tài sản thay thế) khớp nhất với IPS của nhà đầu tư — mục tiêu lợi nhuận, mức chấp nhận rủi ro và khung thời gian — kết hợp với kỳ vọng thị trường vốn dài hạn. Nó được giữ xuyên suốt các chu kỳ thị trường, không đổi theo tin tức ngắn hạn.</p>
<h3>Phân bổ tài sản chiến thuật (TAA)</h3>
<p>TAA cho phép lệch ngắn hạn, có chủ đích khỏi tỉ trọng chiến lược để tận dụng một quan điểm thị trường (vd tăng tỉ trọng cổ phiếu vì định giá đang rẻ). Độ lệch thường được giữ trong <strong>biên độ tái cân bằng</strong> đã thống nhất trước để đặt cược chiến thuật không âm thầm biến thành một chiến lược khác.</p>
<pre><code>Vi du (so lieu gia dinh):
 Ti trong chien luoc muc tieu: 60% co phieu / 40% thu nhap co dinh
 Bien do tai can bang: +/- 5 diem phan tram quanh moi muc tieu
 Quan diem chien thuat cua nguoi quan ly: co phieu dinh gia re quy nay
 -> Vi the chien thuat: 64% co phieu / 36% thu nhap co dinh (trong bien +/-5%)
 Neu co phieu troi len 68% chi do thi truong tang (vuot bien do)
 -> Kich hoat giao dich TAI CAN BANG ve lai 60/40, bat ke quan diem the nao.
</code></pre>
<h3>Cách tiếp cận core-satellite</h3>
<p>Một cấu trúc phổ biến: phần <strong>lõi (core)</strong> lớn, chi phí thấp bám theo phân bổ chiến lược (thường thụ động), trong khi phần <strong>vệ tinh (satellite)</strong> nhỏ hơn được quản lý chủ động để thể hiện quan điểm chiến thuật — giới hạn mức thiệt hại một đặt cược chiến thuật có thể gây ra cho cả danh mục.</p>
<div class="callout"><span class="badge">Biên độ làm hai việc</span> Nó vừa cho người quản lý chiến thuật không gian để hành động theo quan điểm, VỪA tự động buộc giao dịch tái cân bằng nếu thị trường trôi dạt quá xa — kỷ luật chống lại cả hai thái cực.</div>`,
  ]]);

const c5q = quiz('aap301-quiz-5', 'Quiz 5 — SAA vs TAA|||Quiz 5 — Strategic vs tactical allocation', [
  { id: 'q1', question: 'Phan bo tai san chien luoc (SAA) duoc xay dung dua tren gi?', options: ['Tin tuc thi truong tuan nay', 'IPS cua nha dau tu va ky vong thi truong von dai han', 'Gia co phieu hom qua', 'Loi khuyen tu mang xa hoi'], correctIndex: 1, explanation: 'SAA la ti trong muc tieu dai han khop voi IPS (loi nhuan, rui ro, thoi gian) va ky vong dai han.' },
  { id: 'q2', question: 'Bien do tai can bang (+/-5% quanh muc tieu) dung de lam gi?', options: ['Chi de trang tri bao cao', 'Cho phep vi the chien thuat nhung buoc tai can bang khi troi dat qua xa', 'Bat buoc ban het danh muc moi thang', 'Tang phi quan ly quy'], correctIndex: 1, explanation: 'Bien do vua cho khong gian hanh dong theo quan diem, vua tu dong kich hoat tai can bang khi vuot nguong.' },
  { id: 'q3', question: 'Cau truc core-satellite hoat dong the nao?', options: ['Toan bo danh muc deu chu dong', 'Phan loi lon bam chien luoc (thuong thu dong), phan ve tinh nho chu dong theo quan diem', 'Toan bo danh muc deu thu dong', 'Chi dau tu vao mot co phieu duy nhat'], correctIndex: 1, explanation: 'Core bam SAA (thu dong), satellite the hien TAA (chu dong) nhung gioi han quy mo anh huong.' },
]);

const c6 = doc('aap301-6-1-equity-mgmt', '6.1 — Equity portfolio management: active vs passive|||6.1 — Quản lý danh mục cổ phiếu: chủ động vs bị động',
  'Đầu tư bị động (dập khuôn chỉ số, lấy mẫu), đầu tư chủ động (value/growth, định lượng), đầu tư tăng cường (enhanced indexing); sai số bám sát (tracking error).',
  [[
    `<span class="eyebrow">AAP301 · Chapter 6 · Lesson 6.1</span>
<h2>Equity portfolio management: active vs passive</h2>
<h3>Passive equity management</h3>
<p>The goal is to <strong>replicate</strong> a benchmark index (e.g. VN-Index, S&amp;P 500), not beat it. Methods: <strong>full replication</strong> (hold every stock at its index weight) or <strong>sampling</strong> (hold a representative subset to cut trading costs). Passive funds keep fees low and rarely deviate from the benchmark.</p>
<h3>Active equity management</h3>
<p>Active managers try to <strong>beat</strong> a benchmark by picking stocks they believe are mispriced. Common styles: <strong>value</strong> (buy cheap relative to fundamentals), <strong>growth</strong> (buy companies with above-average earnings growth), and <strong>quantitative</strong> (systematic factor-based models). Active management costs more and can underperform after fees.</p>
<h3>Enhanced indexing</h3>
<p>A middle ground: stay close to the benchmark's risk profile while making small, controlled tilts intended to add a little extra return.</p>
<h3>Tracking error</h3>
<pre><code>Tracking error = Standard deviation of (Rp - Rb), where:
 Rp = portfolio return each period, Rb = benchmark return each period

Example (assumed figures, quarterly excess returns Rp - Rb):
 +0.4%, -0.2%, +0.6%, -0.3%, +0.1%   (5 quarters)
 -> A passive fund should show tracking error near zero (e.g. 0.1-0.3%);
    an active fund deliberately runs a higher tracking error to seek outperformance.
</code></pre>
<div class="callout"><span class="badge">Low tracking error is not automatically good</span> A LOW tracking error is the goal for a passive/index fund but a sign of "closet indexing" (charging active fees for passive-like behavior) if the fund claims to be actively managed.</div>`,
    `<span class="eyebrow">AAP301 · Chương 6 · Bài 6.1</span>
<h2>Quản lý danh mục cổ phiếu: chủ động vs bị động</h2>
<h3>Quản lý cổ phiếu bị động</h3>
<p>Mục tiêu là <strong>mô phỏng lại</strong> một chỉ số tham chiếu (vd VN-Index, S&amp;P 500), không phải đánh bại nó. Phương pháp: <strong>dập khuôn toàn phần</strong> (giữ mọi cổ phiếu đúng tỉ trọng trong chỉ số) hoặc <strong>lấy mẫu</strong> (giữ tập con đại diện để giảm chi phí giao dịch). Quỹ bị động giữ phí thấp và hiếm khi lệch khỏi chỉ số tham chiếu.</p>
<h3>Quản lý cổ phiếu chủ động</h3>
<p>Người quản lý chủ động cố gắng <strong>đánh bại</strong> chỉ số tham chiếu bằng cách chọn cổ phiếu họ tin là định giá sai. Các phong cách phổ biến: <strong>value</strong> (mua rẻ so với nền tảng cơ bản), <strong>growth</strong> (mua công ty tăng trưởng lợi nhuận trên trung bình), và <strong>định lượng</strong> (mô hình hệ thống theo nhân tố). Quản lý chủ động tốn phí hơn và có thể kém hơn sau khi trừ phí.</p>
<h3>Đầu tư tăng cường (enhanced indexing)</h3>
<p>Một điểm giữa: giữ gần hồ sơ rủi ro của chỉ số tham chiếu trong khi nghiêng nhẹ, có kiểm soát để thêm chút lợi nhuận.</p>
<h3>Sai số bám sát (tracking error)</h3>
<pre><code>Tracking error = Do lech chuan cua (Rp - Rb), voi:
 Rp = loi nhuan danh muc moi ky, Rb = loi nhuan chi so tham chieu moi ky

Vi du (so lieu gia dinh, chenh lech loi nhuan Rp - Rb theo quy):
 +0.4%, -0.2%, +0.6%, -0.3%, +0.1%   (5 quy)
 -> Quy bi dong nen co tracking error gan 0 (vd 0.1-0.3%);
    quy chu dong co tinh chay tracking error cao hon de tim loi nhuan vuot troi.
</code></pre>
<div class="callout"><span class="badge">Tracking error thap khong tu dong la tot</span> Tracking error THAP la muc tieu cho quy bi dong/dap khuon chi so, nhung lai la dau hieu "gia danh chu dong" (thu phi chu dong ma hanh xu nhu bi dong) neu quy tu nhan la quan ly chu dong.</div>`,
  ]]);

const c6q = quiz('aap301-quiz-6', 'Quiz 6 — Quan ly danh muc co phieu|||Quiz 6 — Equity portfolio management', [
  { id: 'q1', question: 'Muc tieu cua quan ly co phieu bi dong la gi?', options: ['Danh bai chi so tham chieu cang nhieu cang tot', 'Mo phong lai chi so tham chieu voi chi phi thap', 'Chi mua co phieu vua IPO', 'Khong giu co phieu nao ca'], correctIndex: 1, explanation: 'Bi dong dap khuon hoac lay mau de bam sat chi so, khong co gang danh bai no.' },
  { id: 'q2', question: 'Phong cach "value" trong quan ly chu dong nghia la gi?', options: ['Mua cong ty tang truong loi nhuan cao', 'Mua co phieu dinh gia re so voi nen tang co ban', 'Chi dau tu trai phieu', 'Sao chep dung ti trong chi so'], correctIndex: 1, explanation: 'Value tim co phieu bi dinh gia thap hon gia tri thuc theo cac chi so co ban.' },
  { id: 'q3', question: 'Tracking error do luong dieu gi?', options: ['Loi nhuan tuyet doi cua danh muc', 'Do lech chuan cua chenh lech loi nhuan danh muc so voi chi so tham chieu', 'So luong co phieu trong danh muc', 'Ty le co tuc'], correctIndex: 1, explanation: 'Tracking error = SD(Rp - Rb); quy bi dong muon no gan 0, quy chu dong chap nhan no cao hon.' },
]);

const c7 = doc('aap301-7-1-fixed-income', '7.1 — Fixed-income portfolio management|||7.1 — Quản lý danh mục trái phiếu',
  'Duration (Macaulay & hiệu chỉnh), độ lồi (convexity), miễn dịch hoá (immunization), chiến lược bậc thang/tạ đôi/tập trung (ladder/barbell/bullet).',
  [[
    `<span class="eyebrow">AAP301 · Chapter 7 · Lesson 7.1</span>
<h2>Fixed-income portfolio management</h2>
<h3>Duration — interest-rate sensitivity</h3>
<p><strong>Macaulay duration</strong> is the weighted-average time (in years) to receive a bond's cash flows. <strong>Modified duration</strong> converts that into a direct estimate of price sensitivity to yield changes:</p>
<pre><code>Approximate price change formula:
 % Price change = - Modified Duration x (change in yield, in %)

Example (assumed figures):
 Modified duration = 7.0 years
 Yield rises by 0.50 percentage points (+0.50%)
 % Price change = -7.0 x 0.50% = -3.5%
 -> A 100,000 (currency units) bond position would fall to about 96,500.
</code></pre>
<p><strong>Convexity</strong> corrects for the fact that the price-yield relationship is curved, not a straight line — duration alone understates the price GAIN when yields fall and overstates the price LOSS when yields rise; convexity adds back that curvature.</p>
<h3>Immunization</h3>
<p><strong>Immunization</strong> matches the portfolio's duration to a liability's due date so that a change in interest rates affects the bond price and the reinvestment income in offsetting ways, locking in a target return regardless of rate moves.</p>
<h3>Structuring strategies</h3>
<ul>
<li><strong>Bullet</strong> — bonds concentrated around one maturity, matching a single known liability date.</li>
<li><strong>Barbell</strong> — bonds concentrated at the short and long ends, none in the middle, for flexibility plus long-duration exposure.</li>
<li><strong>Ladder</strong> — bonds spread evenly across many maturities, reducing reinvestment and interest-rate timing risk.</li>
</ul>
<div class="callout"><span class="badge">Duration is not maturity</span> Duration is usually shorter than a bond's stated maturity because it accounts for coupon payments received along the way — only a zero-coupon bond has duration exactly equal to its maturity.</div>`,
    `<span class="eyebrow">AAP301 · Chương 7 · Bài 7.1</span>
<h2>Quản lý danh mục trái phiếu</h2>
<h3>Duration — độ nhạy với lãi suất</h3>
<p><strong>Macaulay duration</strong> là thời gian trung bình có trọng số (theo năm) để nhận lại các dòng tiền của trái phiếu. <strong>Duration hiệu chỉnh (modified duration)</strong> quy đổi con số đó thành ước lượng trực tiếp độ nhạy giá theo thay đổi lợi suất:</p>
<pre><code>Cong thuc uoc luong thay doi gia:
 % Thay doi gia = - Duration hieu chinh x (thay doi loi suat, tinh theo %)

Vi du (so lieu gia dinh):
 Duration hieu chinh = 7.0 nam
 Loi suat tang 0.50 diem phan tram (+0.50%)
 % Thay doi gia = -7.0 x 0.50% = -3.5%
 -> Vi the trai phieu 100,000 (don vi tien te) se giam con khoang 96,500.
</code></pre>
<p><strong>Độ lồi (convexity)</strong> điều chỉnh cho việc quan hệ giá-lợi suất là đường cong, không phải đường thẳng — chỉ dùng duration sẽ đánh giá thấp mức TĂNG giá khi lợi suất giảm và đánh giá quá cao mức GIẢM giá khi lợi suất tăng; convexity bù lại độ cong đó.</p>
<h3>Miễn dịch hoá (immunization)</h3>
<p><strong>Miễn dịch hoá</strong> khớp duration của danh mục với ngày đáo hạn của một khoản nợ, để thay đổi lãi suất tác động đến giá trái phiếu và thu nhập tái đầu tư theo hướng triệt tiêu lẫn nhau, khoá được lợi nhuận mục tiêu bất kể lãi suất biến động thế nào.</p>
<h3>Các chiến lược cấu trúc danh mục</h3>
<ul>
<li><strong>Bullet (tập trung)</strong> — trái phiếu tập trung quanh một kỳ đáo hạn, khớp với một khoản nợ đã biết trước ngày.</li>
<li><strong>Barbell (tạ đôi)</strong> — trái phiếu tập trung ở hai đầu ngắn hạn và dài hạn, không có ở giữa, để vừa linh hoạt vừa có phần bù duration dài.</li>
<li><strong>Ladder (bậc thang)</strong> — trái phiếu trải đều qua nhiều kỳ đáo hạn, giảm rủi ro tái đầu tư và rủi ro chọn thời điểm lãi suất.</li>
</ul>
<div class="callout"><span class="badge">Duration khong phai ky han</span> Duration thường ngắn hơn kỳ hạn danh nghĩa của trái phiếu vì nó tính cả các khoản coupon nhận dọc đường — chỉ trái phiếu zero-coupon mới có duration đúng bằng kỳ hạn.</div>`,
  ]]);

const c7q = quiz('aap301-quiz-7', 'Quiz 7 — Quan ly danh muc trai phieu|||Quiz 7 — Fixed-income portfolio management', [
  { id: 'q1', question: 'Voi duration hieu chinh 7.0 nam va loi suat tang 0.50%, gia trai phieu thay doi khoang bao nhieu?', options: ['+3.5%', '-3.5%', '-7.0%', '+0.5%'], correctIndex: 1, explanation: '% Thay doi gia = -7.0 x 0.50% = -3.5% (gia giam khi loi suat tang).' },
  { id: 'q2', question: 'Mien dich hoa (immunization) danh muc trai phieu nham muc dich gi?', options: ['Toi da hoa loi nhuan bang moi gia', 'Khop duration danh muc voi ngay dao han cua mot khoan no de khoa loi nhuan muc tieu', 'Chi mua trai phieu ky han ngan nhat', 'Tranh hoan toan trai phieu chinh phu'], correctIndex: 1, explanation: 'Khop duration lam gia trai phieu va thu nhap tai dau tu bu tru lan nhau khi lai suat doi.' },
  { id: 'q3', question: 'Chien luoc "barbell" (ta doi) la gi?', options: ['Trai phieu tap trung mot ky han duy nhat', 'Trai phieu trai deu qua nhieu ky han', 'Trai phieu tap trung o hai dau ngan han va dai han, khong co o giua', 'Chi giu tien mat'], correctIndex: 2, explanation: 'Barbell dat trai phieu o hai cuc ngan/dai de vua linh hoat vua co duration dai, khac voi ladder (trai deu) va bullet (tap trung mot diem).' },
]);

const c8 = doc('aap301-8-1-performance-rebalancing', '8.1 — Performance evaluation & rebalancing|||8.1 — Đánh giá hiệu quả danh mục & tái cân bằng',
  'Chỉ số Sharpe, Treynor, alpha của Jensen; tái cân bằng theo lịch và theo biên độ tỉ trọng.',
  [[
    `<span class="eyebrow">AAP301 · Chapter 8 · Lesson 8.1</span>
<h2>Performance evaluation &amp; rebalancing</h2>
<h3>Risk-adjusted performance measures</h3>
<pre><code>Sharpe ratio  = (Rp - Rf) / SD(p)            [uses TOTAL risk]
Treynor ratio = (Rp - Rf) / beta(p)          [uses SYSTEMATIC risk only]
Jensen's alpha = Rp - [Rf + beta(p) x (Rm - Rf)]   [excess return vs CAPM]

Example (assumed figures, one year):
 Fund return Rp = 12%,  Rf = 3%,  Fund SD = 18%,  Fund beta = 1.2
 Market return Rm = 10%

 Sharpe  = (12% - 3%) / 18% = 0.50
 Treynor = (12% - 3%) / 1.2 = 7.50 (percentage points per unit of beta)
 CAPM-required return = 3% + 1.2 x (10% - 3%) = 3% + 8.4% = 11.4%
 Jensen's alpha = 12% - 11.4% = +0.6%   (fund beat its risk-adjusted benchmark)
</code></pre>
<p>Use <strong>Sharpe</strong> to compare a fund that IS an investor's entire portfolio (total risk matters). Use <strong>Treynor</strong> or <strong>alpha</strong> when the fund is one piece of a diversified portfolio (only systematic risk should be priced).</p>
<h3>Rebalancing</h3>
<ul>
<li><strong>Calendar-based</strong> — rebalance back to target weights on a fixed schedule (e.g. every quarter), regardless of how far weights have drifted.</li>
<li><strong>Percentage-of-portfolio (band-based)</strong> — rebalance only when a weight drifts outside its allowed band (see Chapter 5), whenever that happens.</li>
</ul>
<div class="callout"><span class="badge">Rebalancing is a risk-control discipline</span> Left alone, winning assets grow to dominate a portfolio, quietly raising its risk beyond what the IPS calls for. Rebalancing sells some winners and buys some laggards — mechanically enforcing "buy low, sell high" and keeping risk aligned with the IPS.</div>`,
    `<span class="eyebrow">AAP301 · Chương 8 · Bài 8.1</span>
<h2>Đánh giá hiệu quả danh mục &amp; tái cân bằng</h2>
<h3>Các chỉ số hiệu quả điều chỉnh theo rủi ro</h3>
<pre><code>Ty so Sharpe   = (Rp - Rf) / SD(p)            [dung TONG rui ro]
Ty so Treynor  = (Rp - Rf) / beta(p)          [chi dung rui ro HE THONG]
Alpha Jensen   = Rp - [Rf + beta(p) x (Rm - Rf)]   [loi nhuan vuot troi so voi CAPM]

Vi du (so lieu gia dinh, mot nam):
 Loi nhuan quy Rp = 12%,  Rf = 3%,  SD quy = 18%,  Beta quy = 1.2
 Loi nhuan thi truong Rm = 10%

 Sharpe  = (12% - 3%) / 18% = 0.50
 Treynor = (12% - 3%) / 1.2 = 7.50 (diem phan tram tren moi don vi beta)
 Loi nhuan yeu cau theo CAPM = 3% + 1.2 x (10% - 3%) = 3% + 8.4% = 11.4%
 Alpha Jensen = 12% - 11.4% = +0.6%   (quy vuot chi so tham chieu da dieu chinh rui ro)
</code></pre>
<p>Dùng <strong>Sharpe</strong> khi quỹ LÀ toàn bộ danh mục của nhà đầu tư (tổng rủi ro quan trọng). Dùng <strong>Treynor</strong> hoặc <strong>alpha</strong> khi quỹ chỉ là một phần của danh mục đa dạng hoá (chỉ rủi ro hệ thống đáng được định giá).</p>
<h3>Tái cân bằng</h3>
<ul>
<li><strong>Theo lịch</strong> — tái cân bằng về tỉ trọng mục tiêu theo lịch cố định (vd mỗi quý), bất kể tỉ trọng đã trôi dạt bao xa.</li>
<li><strong>Theo phần trăm danh mục (theo biên độ)</strong> — chỉ tái cân bằng khi một tỉ trọng trôi ra ngoài biên độ cho phép (xem Chương 5), bất cứ khi nào điều đó xảy ra.</li>
</ul>
<div class="callout"><span class="badge">Tái cân bằng là kỷ luật kiểm soát rủi ro</span> Để yên, tài sản thắng lớn sẽ ngày càng chiếm ưu thế trong danh mục, âm thầm đẩy rủi ro vượt mức IPS cho phép. Tái cân bằng bán bớt tài sản thắng và mua thêm tài sản kém hơn — cơ chế hoá nguyên tắc "mua thấp, bán cao" và giữ rủi ro khớp với IPS.</div>`,
  ]]);

const c8q = quiz('aap301-quiz-8', 'Quiz 8 — Danh gia hieu qua va tai can bang|||Quiz 8 — Performance evaluation & rebalancing', [
  { id: 'q1', question: 'Ty so Sharpe dung loai rui ro nao lam mau so?', options: ['Chi rui ro he thong (beta)', 'Tong rui ro (do lech chuan)', 'Chi rui ro lai suat', 'Khong dung rui ro nao'], correctIndex: 1, explanation: 'Sharpe = (Rp-Rf)/SD(p), dung TONG rui ro nen phu hop khi quy la toan bo danh muc nha dau tu.' },
  { id: 'q2', question: 'Alpha Jensen duong (+) co y nghia gi?', options: ['Quy co rui ro thap hon thi truong', 'Quy dat loi nhuan cao hon muc CAPM yeu cau ung voi beta cua no', 'Quy khong co beta', 'Quy chi dau tu trai phieu'], correctIndex: 1, explanation: 'Alpha = Rp - [Rf + beta x (Rm-Rf)]; duong nghia la vuot troi so voi loi nhuan CAPM yeu cau.' },
  { id: 'q3', question: 'Tai can bang theo bien do (percentage-of-portfolio) kich hoat khi nao?', options: ['Dung dinh ky moi thang bat ke ti trong the nao', 'Khi mot ti trong troi ra ngoai bien do cho phep quanh muc tieu', 'Chi khi nha dau tu yeu cau bang mieng', 'Khong bao gio can tai can bang'], correctIndex: 1, explanation: 'Khac voi tai can bang theo lich, kieu theo bien do chi giao dich khi ti trong vuot nguong da dat truoc.' },
]);

export default {
  semester: { code: 'FPTU_Hola8', name: 'Kỳ 8', ordinal: 10 },
  course: {
    courseCode: 'AAP301',
    slug: 'aap301-asset-allocation-and-portfolio-management',
    title: 'Asset Allocation and Portfolio Management',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/AAP301.webp',
    shortDescription: 'How portfolio managers allocate & evaluate portfolios — IPS, risk & return, Markowitz theory, CAPM & APT, strategic vs tactical allocation, equity & bond management, Sharpe/Treynor/alpha & rebalancing. Bilingual, worked examples & quizzes.|||Nhà quản lý danh mục phân bổ & đánh giá danh mục ra sao — IPS, rủi ro & lợi nhuận, lý thuyết Markowitz, CAPM & APT, phân bổ chiến lược vs chiến thuật, quản lý cổ phiếu & trái phiếu, Sharpe/Treynor/alpha & tái cân bằng. Song ngữ, ví dụ & quiz.',
    description: 'Môn <strong>AAP301 — Asset Allocation and Portfolio Management</strong> (kỳ 8, khối Quản trị Kinh doanh) dạy cách <strong>xây dựng, phân bổ và đánh giá danh mục đầu tư</strong>. Từ <strong>quy trình đầu tư &amp; IPS</strong> (mục tiêu, ràng buộc) → <strong>rủi ro &amp; lợi nhuận</strong> (phương sai, hiệp phương sai) → <strong>lý thuyết danh mục hiện đại</strong> (Markowitz, đường biên hiệu quả) → <strong>CAPM &amp; APT</strong> (beta, SML, đa nhân tố) → <strong>phân bổ chiến lược vs chiến thuật</strong> → <strong>quản lý danh mục cổ phiếu</strong> (chủ động/bị động) → <strong>quản lý danh mục trái phiếu</strong> (duration, convexity, miễn dịch hoá) → <strong>đánh giá hiệu quả</strong> (Sharpe, Treynor, alpha) &amp; tái cân bằng. Bám giáo trình Bodie/Kane/Marcus, Reilly/Brown, Maginn/Tuttle (CFA curriculum), song ngữ, có ví dụ tính toán (số liệu giả định) và quiz mỗi chương.',
    whatYouLearn: 'Quy trình quản lý danh mục & viết IPS (mục tiêu, ràng buộc); đo lợi nhuận kỳ vọng, phương sai, hiệp phương sai, tương quan; phương sai danh mục hai tài sản & đường biên hiệu quả (Markowitz); CAPM (beta, SML) & APT đa nhân tố; phân bổ tài sản chiến lược (SAA) vs chiến thuật (TAA), core-satellite; quản lý cổ phiếu chủ động vs bị động, tracking error; duration/convexity, miễn dịch hoá, chiến lược bullet/barbell/ladder cho trái phiếu; Sharpe, Treynor, alpha Jensen; tái cân bằng theo lịch vs theo biên độ.',
    requirements: 'Kiến thức tài chính doanh nghiệp & thống kê cơ bản (giá trị thời gian của tiền, phương sai, độ lệch chuẩn). Nên dùng bảng tính (Excel/Google Sheets) để tự thực hành các ví dụ số.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách kinh điển, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Vì sao danh mục, không phải tài sản đơn lẻ; lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Quy trình đầu tư & IPS|||Chapter 1 — Investment process & IPS', description: 'Lập kế hoạch, thực thi, phản hồi; mục tiêu & ràng buộc trong IPS.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Rủi ro & lợi nhuận|||Chapter 2 — Risk & return', description: 'HPR, lợi nhuận kỳ vọng, phương sai, hiệp phương sai, tương quan.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Lý thuyết danh mục hiện đại|||Chapter 3 — Modern portfolio theory', description: 'Markowitz, phương sai danh mục hai tài sản, đường biên hiệu quả.', lessons: [c3, c3q] },
    { title: 'Chương 4 — CAPM & APT|||Chapter 4 — CAPM & APT', description: 'Beta, đường thị trường chứng khoán, mô hình đa nhân tố.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Phân bổ chiến lược vs chiến thuật|||Chapter 5 — Strategic vs tactical allocation', description: 'SAA, TAA, biên độ tái cân bằng, core-satellite.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Quản lý danh mục cổ phiếu|||Chapter 6 — Equity portfolio management', description: 'Chủ động vs bị động, tracking error.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Quản lý danh mục trái phiếu|||Chapter 7 — Fixed-income portfolio management', description: 'Duration, convexity, miễn dịch hoá, bullet/barbell/ladder.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Đánh giá hiệu quả & tái cân bằng|||Chapter 8 — Performance evaluation & rebalancing', description: 'Sharpe, Treynor, alpha Jensen, tái cân bằng.', lessons: [c8, c8q] },
  ],
};
