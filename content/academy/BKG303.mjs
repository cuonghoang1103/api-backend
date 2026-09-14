/**
 * BKG303 — Investment Project Appraisal (Thẩm định dự án đầu tư). Giáo trình
 * (syl): chu trình & thẩm định dự án; giá trị thời gian của tiền; dòng tiền
 * tăng thêm; NPV/IRR/hoàn vốn/PI; WACC; phân tích rủi ro; thẩm định kinh tế-xã
 * hội & môi trường; ra quyết định. Song ngữ + ví dụ + bài tập.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('bkg303-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách tham khảo quốc tế, tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">BKG303 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Investment Project Appraisal — time value of money, cash flow estimation, NPV/IRR, WACC, risk and economic appraisal — in one place. The full official slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal references.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU syllabus &amp; lecture slides for BKG303 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li>Brealey, Myers &amp; Allen — <em>Principles of Corporate Finance</em> (capital budgeting &amp; risk chapters)</li>
<li>Ross, Westerfield &amp; Jaffe — <em>Corporate Finance</em> (capital budgeting &amp; cost of capital chapters)</li>
<li>Götze, Northcott &amp; Schuster — <em>Investment Appraisal: Methods and Models</em></li>
<li>World Bank — <em>Guidelines for the Economic Analysis of Projects</em></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://corporatefinanceinstitute.com/resources/valuation/npv-net-present-value/" target="_blank" rel="noopener">Corporate Finance Institute — NPV &amp; capital budgeting guides</a></li>
<li><a href="https://pages.stern.nyu.edu/~adamodar/" target="_blank" rel="noopener">Aswath Damodaran (NYU Stern) — valuation &amp; cost of capital notes</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@AswathDamodaranonValuation" target="_blank" rel="noopener">Aswath Damodaran</a> — valuation &amp; corporate finance lectures</li>
<li><a href="https://www.youtube.com/@corporatefinanceinstitute" target="_blank" rel="noopener">Corporate Finance Institute</a> — NPV/IRR/WACC walkthroughs</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li>Excel/Google Sheets <code>NPV()</code> and <code>IRR()</code> functions — build the cash flow table, then check by hand.</li>
<li><a href="https://www.worldbank.org/en/topic/publicprivatepartnerships" target="_blank" rel="noopener">World Bank — project &amp; PPP appraisal resources</a></li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — time value of money, discounting, NPV/IRR/payback/PI formulas.</li>
<li><strong>Practice</strong> — build a full cash flow table for a sample project and compute all four criteria by hand and in Excel.</li>
<li><strong>Go deeper</strong> — WACC/CAPM, sensitivity &amp; scenario analysis, economic &amp; environmental appraisal.</li>
<li><strong>Job-ready</strong> — write a short appraisal report combining financial, risk and non-financial verdicts.</li>
</ol></div>`,
    `<span class="eyebrow">BKG303 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Thẩm định dự án đầu tư — giá trị thời gian của tiền, ước lượng dòng tiền, NPV/IRR, WACC, phân tích rủi ro và thẩm định kinh tế — gom về một chỗ. Giáo trình &amp; slide chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của BKG303 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li>Brealey, Myers &amp; Allen — <em>Principles of Corporate Finance</em> (chương thẩm định dự án &amp; rủi ro)</li>
<li>Ross, Westerfield &amp; Jaffe — <em>Corporate Finance</em> (chương thẩm định &amp; chi phí vốn)</li>
<li>Götze, Northcott &amp; Schuster — <em>Investment Appraisal: Methods and Models</em></li>
<li>World Bank — <em>Guidelines for the Economic Analysis of Projects</em></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://corporatefinanceinstitute.com/resources/valuation/npv-net-present-value/" target="_blank" rel="noopener">Corporate Finance Institute — hướng dẫn NPV &amp; thẩm định vốn</a></li>
<li><a href="https://pages.stern.nyu.edu/~adamodar/" target="_blank" rel="noopener">Aswath Damodaran (NYU Stern) — ghi chú định giá &amp; chi phí vốn</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@AswathDamodaranonValuation" target="_blank" rel="noopener">Aswath Damodaran</a> — bài giảng định giá &amp; tài chính doanh nghiệp</li>
<li><a href="https://www.youtube.com/@corporatefinanceinstitute" target="_blank" rel="noopener">Corporate Finance Institute</a> — giải thích NPV/IRR/WACC</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li>Hàm <code>NPV()</code> và <code>IRR()</code> của Excel/Google Sheets — dựng bảng dòng tiền rồi kiểm lại bằng tay.</li>
<li><a href="https://www.worldbank.org/en/topic/publicprivatepartnerships" target="_blank" rel="noopener">World Bank — tài liệu thẩm định dự án &amp; PPP</a></li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — giá trị thời gian của tiền, chiết khấu, công thức NPV/IRR/hoàn vốn/PI.</li>
<li><strong>Luyện tập</strong> — dựng bảng dòng tiền đầy đủ cho một dự án mẫu và tính cả 4 chỉ tiêu bằng tay và trên Excel.</li>
<li><strong>Đào sâu</strong> — WACC/CAPM, phân tích độ nhạy &amp; kịch bản, thẩm định kinh tế &amp; môi trường.</li>
<li><strong>Sẵn sàng đi làm</strong> — viết báo cáo thẩm định ngắn kết hợp kết luận tài chính, rủi ro và phi tài chính.</li>
</ol></div>`,
  ]]);

const intro = doc('bkg303-0-1-overview', 'Course overview: Investment Project Appraisal|||Tổng quan: Thẩm định dự án đầu tư',
  'Thẩm định dự án đầu tư trả lời câu hỏi có nên đầu tư hay không; lộ trình: chu trình dự án → giá trị thời gian của tiền → dòng tiền tăng thêm → NPV/IRR/hoàn vốn/PI → WACC → rủi ro → kinh tế-xã hội & môi trường → quyết định.',
  [[
    `<span class="eyebrow">BKG303 · Lesson 0.1 · Overview</span>
<h2>Investment Project Appraisal</h2>
<p class="lead">This course teaches you to answer one question rigorously: <strong>should this project be undertaken?</strong> You'll learn to build a project's cash flows, discount them correctly, apply decision criteria (NPV, IRR, payback, PI), price the cost of capital (WACC), stress-test the result under risk, and — for projects with public impact — weigh the economic, social and environmental case alongside the financial one.</p>
<h3>Roadmap</h3>
<p>Project cycle &amp; appraisal dimensions → time value of money → estimating incremental cash flows → NPV/IRR/payback/PI → WACC → risk analysis (sensitivity/scenario/Monte Carlo) → economic-social &amp; environmental appraisal → the investment decision &amp; appraisal report.</p>
<h3>Why this matters</h3>
<p>Every capital allocation decision — a new factory, a software platform, a highway, a solar farm — uses this same toolkit. Get it wrong and capital is locked into a losing project for years; get it right and you consistently fund the projects that create the most value.</p>`,
    `<span class="eyebrow">BKG303 · Bài 0.1 · Tổng quan</span>
<h2>Thẩm định dự án đầu tư</h2>
<p class="lead">Môn này dạy bạn trả lời chặt chẽ một câu hỏi: <strong>có nên thực hiện dự án này hay không?</strong> Bạn sẽ học cách dựng dòng tiền của dự án, chiết khấu đúng cách, áp dụng các tiêu chí quyết định (NPV, IRR, hoàn vốn, PI), định giá chi phí vốn (WACC), kiểm định kết quả dưới rủi ro, và — với dự án có tác động công — cân nhắc khía cạnh kinh tế, xã hội, môi trường cùng với khía cạnh tài chính.</p>
<h3>Lộ trình</h3>
<p>Chu trình &amp; các khía cạnh thẩm định dự án → giá trị thời gian của tiền → ước lượng dòng tiền tăng thêm → NPV/IRR/hoàn vốn/PI → WACC → phân tích rủi ro (độ nhạy/kịch bản/Monte Carlo) → thẩm định kinh tế-xã hội &amp; môi trường → ra quyết định đầu tư &amp; lập báo cáo thẩm định.</p>
<h3>Vì sao môn này quan trọng</h3>
<p>Mọi quyết định phân bổ vốn — một nhà máy mới, một nền tảng phần mềm, một tuyến cao tốc, một trang trại điện mặt trời — đều dùng đúng bộ công cụ này. Quyết định sai sẽ khoá vốn vào một dự án thua lỗ trong nhiều năm; quyết định đúng sẽ liên tục đưa vốn vào những dự án tạo giá trị lớn nhất.</p>`,
  ]]);

const c1 = doc('bkg303-1-1-overview-cycle', '1.1 — Appraisal overview & the project cycle|||1.1 — Tổng quan thẩm định & chu trình dự án',
  'Định nghĩa thẩm định dự án; chu trình dự án (identification → preparation → appraisal → implementation → evaluation); các khía cạnh thẩm định: kỹ thuật, tài chính, kinh tế-xã hội, môi trường, pháp lý.',
  [[
    `<span class="eyebrow">BKG303 · Chapter 1 · Lesson 1.1</span>
<h2>Overview of investment appraisal &amp; the project cycle</h2>
<h3>What is investment project appraisal?</h3>
<p><strong>Investment project appraisal</strong> is the systematic process of evaluating whether a proposed capital project is worth undertaking — technically feasible, financially profitable, and (for public/large projects) beneficial to the economy and environment — <em>before</em> capital is committed.</p>
<h3>Why it matters</h3>
<ul>
<li>Capital is scarce and irreversible once sunk — a wrong "go" decision locks up resources for years.</li>
<li>Appraisal ranks competing projects so limited capital goes to the highest-value uses.</li>
<li>It creates the baseline (forecasted cash flows, assumptions) against which the project is later monitored and post-audited.</li>
</ul>
<h3>The project cycle (World Bank-style)</h3>
<pre><code>1. Identification  -> spot the investment opportunity, screen against strategy
2. Preparation     -> technical design, market study, cost &amp; benefit estimates
3. Appraisal        -> financial, economic, technical, environmental analysis -> go/no-go
4. Implementation  -> construction/execution, disbursement, monitoring
5. Evaluation       -> post-audit: compare actual vs. forecast, capture lessons
</code></pre>
<h3>Dimensions of appraisal</h3>
<ul>
<li><strong>Technical</strong> — is the design/technology feasible and available?</li>
<li><strong>Financial</strong> — does the project earn an acceptable return for its investors (NPV, IRR — Chapters 2-5)?</li>
<li><strong>Economic &amp; social</strong> — does it create net value for society, beyond the investor (Chapter 7)?</li>
<li><strong>Environmental</strong> — what are the ecological costs, and can they be mitigated?</li>
<li><strong>Institutional/legal</strong> — can the sponsor legally and organizationally deliver it?</li>
</ul>
<div class="callout"><span class="badge">One process, many lenses</span> The rest of this course builds the financial lens step by step — time value of money, cash flow estimation, decision criteria, cost of capital, risk — then adds the economic &amp; social lens, and closes with how it all becomes one appraisal decision.</div>`,
    `<span class="eyebrow">BKG303 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan thẩm định dự án &amp; chu trình dự án</h2>
<h3>Thẩm định dự án đầu tư là gì?</h3>
<p><strong>Thẩm định dự án đầu tư</strong> là quy trình đánh giá có hệ thống xem một dự án đầu tư đề xuất có đáng thực hiện hay không — khả thi về kỹ thuật, có lãi về tài chính, và (với dự án công/lớn) có lợi cho kinh tế &amp; môi trường — <em>trước khi</em> vốn được cam kết.</p>
<h3>Vì sao cần thẩm định</h3>
<ul>
<li>Vốn khan hiếm và không thể thu hồi khi đã bỏ ra — một quyết định "làm" sai sẽ khoá nguồn lực trong nhiều năm.</li>
<li>Thẩm định giúp xếp hạng các dự án cạnh tranh để vốn hạn chế chảy vào nơi tạo giá trị cao nhất.</li>
<li>Nó tạo ra đường cơ sở (dòng tiền dự báo, giả định) để sau này theo dõi và hậu kiểm dự án.</li>
</ul>
<h3>Chu trình dự án (kiểu World Bank)</h3>
<pre><code>1. Xác định (Identification) -> phát hiện cơ hội đầu tư, sàng lọc theo chiến lược
2. Chuẩn bị (Preparation)    -> thiết kế kỹ thuật, nghiên cứu thị trường, ước lượng chi phí &amp; lợi ích
3. Thẩm định (Appraisal)      -> phân tích tài chính, kinh tế, kỹ thuật, môi trường -> quyết định làm/không
4. Thực hiện (Implementation) -> xây dựng/triển khai, giải ngân, giám sát
5. Đánh giá (Evaluation)      -> hậu kiểm: so kết quả thực tế với dự báo, rút kinh nghiệm
</code></pre>
<h3>Các khía cạnh thẩm định</h3>
<ul>
<li><strong>Kỹ thuật</strong> — thiết kế/công nghệ có khả thi và sẵn có không?</li>
<li><strong>Tài chính</strong> — dự án có mang lại lợi nhuận đủ cho nhà đầu tư không (NPV, IRR — Chương 2-5)?</li>
<li><strong>Kinh tế &amp; xã hội</strong> — dự án có tạo giá trị ròng cho xã hội, vượt ngoài nhà đầu tư (Chương 7)?</li>
<li><strong>Môi trường</strong> — chi phí sinh thái là gì, có giảm thiểu được không?</li>
<li><strong>Tổ chức/pháp lý</strong> — chủ đầu tư có đủ tư cách pháp lý và năng lực tổ chức để thực hiện không?</li>
</ul>
<div class="callout"><span class="badge">Một quy trình, nhiều lăng kính</span> Phần còn lại của môn xây dần lăng kính tài chính — giá trị thời gian của tiền, ước lượng dòng tiền, tiêu chí quyết định, chi phí vốn, rủi ro — rồi thêm lăng kính kinh tế &amp; xã hội, và kết ở việc tất cả gộp thành một quyết định thẩm định.</div>`,
  ]]);

const c1q = quiz('bkg303-quiz-1', 'Quiz 1 — Overview & project cycle|||Quiz 1 — Tổng quan & chu trình dự án', [
  { id: 'q1', question: 'Thẩm định dự án đầu tư nhằm mục đích gì?', options: ['Chỉ tính thuế phải nộp', 'Đánh giá tính khả thi và hiệu quả trước khi quyết định đầu tư', 'Lập báo cáo tài chính định kỳ', 'Tính lương nhân viên dự án'], correctIndex: 1, explanation: 'Thẩm định giúp trả lời có nên thực hiện dự án hay không, trước khi cam kết vốn.' },
  { id: 'q2', question: 'Chu trình dự án theo kiểu World Bank thường KHÔNG gồm giai đoạn nào?', options: ['Xác định dự án (Identification)', 'Chuẩn bị & thẩm định (Preparation & Appraisal)', 'Thực hiện (Implementation)', 'Thanh lý công ty mẹ'], correctIndex: 3, explanation: 'Chu trình gồm Xác định → Chuẩn bị → Thẩm định → Thực hiện → Đánh giá (hậu kiểm), không có bước thanh lý công ty mẹ.' },
  { id: 'q3', question: 'Thẩm định kỹ thuật, tài chính, kinh tế-xã hội và môi trường là các...', options: ['khía cạnh khác nhau của một dự án cần thẩm định', 'bước thay thế nhau, chỉ chọn một', 'chỉ áp dụng cho dự án nước ngoài', 'không liên quan đến quyết định đầu tư'], correctIndex: 0, explanation: 'Đây là các khía cạnh (lăng kính) khác nhau, thường cần xem xét đồng thời.' },
]);

const c2 = doc('bkg303-2-1-time-value', '2.1 — Time value of money & discounting|||2.1 — Giá trị thời gian của tiền & chiết khấu',
  'Nguyên lý giá trị thời gian của tiền; công thức FV/PV; annuity; suất chiết khấu; danh nghĩa vs thực.',
  [[
    `<span class="eyebrow">BKG303 · Chapter 2 · Lesson 2.1</span>
<h2>Time value of money &amp; discounted cash flow</h2>
<h3>Why a dollar today beats a dollar tomorrow</h3>
<p>Money available today can be invested to earn a return, so it is worth more than the same amount received later — this is the <strong>time value of money</strong>, the foundation of every appraisal technique in this course.</p>
<h3>Future value &amp; present value</h3>
<pre><code>Future value:   FV = PV × (1 + r)^n
Present value:  PV = FV / (1 + r)^n = FV × (1 + r)^(−n)

r = discount rate (cost of capital / required return)
n = number of periods
(1 + r)^(−n) = discount factor
</code></pre>
<h3>Annuities</h3>
<p>An equal cash flow (CF) repeated for n periods is an <strong>annuity</strong>; its present value uses the annuity factor:</p>
<pre><code>PV(annuity) = CF × [1 − (1+r)^(−n)] / r

Example: r = 10%, n = 5  -> annuity factor ≈ 3.7908
CF = 300 (triệu đồng/năm) -> PV = 300 × 3.7908 ≈ 1,137.2 (triệu đồng)
</code></pre>
<h3>Nominal vs. real rates</h3>
<p>Discount nominal cash flows with a nominal rate, or real cash flows with a real rate — never mix a nominal rate with real (inflation-stripped) cash flows.</p>
<div class="callout"><span class="badge">This is the engine</span> Every technique from Chapter 4 onward — NPV, IRR, the cost-of-capital discount rate — is built on this single idea: move cash flows through time using (1+r)^n.</div>`,
    `<span class="eyebrow">BKG303 · Chương 2 · Bài 2.1</span>
<h2>Giá trị thời gian của tiền &amp; chiết khấu dòng tiền</h2>
<h3>Vì sao một đồng hôm nay đáng giá hơn một đồng ngày mai</h3>
<p>Tiền có sẵn hôm nay có thể được đầu tư để sinh lời, nên nó đáng giá hơn cùng số tiền nhận sau — đây là <strong>giá trị thời gian của tiền</strong>, nền tảng của mọi kỹ thuật thẩm định trong môn này.</p>
<h3>Giá trị tương lai &amp; giá trị hiện tại</h3>
<pre><code>Giá trị tương lai: FV = PV × (1 + r)^n
Giá trị hiện tại:  PV = FV / (1 + r)^n = FV × (1 + r)^(−n)

r = suất chiết khấu (chi phí vốn / tỉ suất sinh lời yêu cầu)
n = số kỳ
(1 + r)^(−n) = hệ số chiết khấu
</code></pre>
<h3>Dòng tiền đều (annuity)</h3>
<p>Một dòng tiền bằng nhau (CF) lặp lại trong n kỳ gọi là <strong>annuity</strong>; giá trị hiện tại của nó dùng hệ số annuity:</p>
<pre><code>PV(annuity) = CF × [1 − (1+r)^(−n)] / r

Ví dụ: r = 10%, n = 5  -> hệ số annuity ≈ 3.7908
CF = 300 (triệu đồng/năm) -> PV = 300 × 3.7908 ≈ 1.137,2 (triệu đồng)
</code></pre>
<h3>Lãi suất danh nghĩa vs thực</h3>
<p>Chiết khấu dòng tiền danh nghĩa bằng lãi suất danh nghĩa, hoặc dòng tiền thực bằng lãi suất thực — không bao giờ trộn lãi suất danh nghĩa với dòng tiền thực (đã loại lạm phát).</p>
<div class="callout"><span class="badge">Đây là bộ máy chính</span> Mọi kỹ thuật từ Chương 4 trở đi — NPV, IRR, suất chiết khấu theo chi phí vốn — đều dựng trên đúng một ý tưởng: dịch chuyển dòng tiền qua thời gian bằng (1+r)^n.</div>`,
  ]]);

const c2q = quiz('bkg303-quiz-2', 'Quiz 2 — Time value of money|||Quiz 2 — Giá trị thời gian của tiền', [
  { id: 'q1', question: 'Giá trị thời gian của tiền phản ánh nguyên tắc gì?', options: ['1 đồng hôm nay có giá trị hơn 1 đồng nhận trong tương lai', 'Tiền không đổi giá trị theo thời gian', 'Lạm phát luôn bằng 0', 'Chỉ áp dụng cho dự án dài hạn'], correctIndex: 0, explanation: 'Vì tiền hôm nay có thể đầu tư sinh lời, nên nó đáng giá hơn tiền nhận sau.' },
  { id: 'q2', question: 'Công thức tính giá trị hiện tại (PV) của một dòng tiền CF nhận sau n năm với suất chiết khấu r là?', options: ['PV = CF × (1+r)^n', 'PV = CF / (1+r)^n', 'PV = CF × n × r', 'PV = CF − r'], correctIndex: 1, explanation: 'PV = FV / (1+r)^n, tức chiết khấu ngược dòng tiền tương lai về hiện tại.' },
  { id: 'q3', question: 'Suất chiết khấu (discount rate) dùng để làm gì?', options: ['Tính thuế thu nhập doanh nghiệp', 'Quy đổi dòng tiền tương lai về giá trị hiện tại, phản ánh chi phí cơ hội & rủi ro', 'Tính khấu hao tài sản cố định', 'Xác định giá bán sản phẩm'], correctIndex: 1, explanation: 'Suất chiết khấu thể hiện tỉ suất sinh lời yêu cầu, dùng để đưa dòng tiền tương lai về hiện tại.' },
]);

const c3 = doc('bkg303-3-1-cash-flow', '3.1 — Estimating incremental project cash flows|||3.1 — Ước lượng dòng tiền tăng thêm của dự án',
  'Nguyên tắc dòng tiền tăng thêm; chi phí chìm, chi phí cơ hội, hiệu ứng phụ; dựng OCF; dòng tiền đầu tư & kết thúc dự án.',
  [[
    `<span class="eyebrow">BKG303 · Chapter 3 · Lesson 3.1</span>
<h2>Estimating project cash flows (incremental basis)</h2>
<h3>The incremental principle</h3>
<p>Appraise the <strong>difference</strong> the project makes to the firm's total cash flow — "with the project" minus "without it" — not the project's accounting profit.</p>
<ul>
<li><strong>Ignore sunk costs</strong> — money already spent doesn't change with today's decision.</li>
<li><strong>Include opportunity costs</strong> — the value of an asset/resource the project uses, even if no cash changes hands.</li>
<li><strong>Include side effects</strong> — erosion/synergy on the firm's other products caused by this project.</li>
<li><strong>Exclude financing costs</strong> from operating cash flow — interest is captured in the discount rate (WACC), not twice.</li>
</ul>
<h3>Building operating cash flow (indirect method)</h3>
<pre><code>Revenue                        1,200
(-) Operating cost (COGS)       (600)
(-) Depreciation                (150)
= EBIT                           450
(-) Tax (20%)                     (90)
= NOPAT (EBIT after tax)         360
(+) Depreciation (non-cash)      150
= Operating cash flow (OCF)      510
</code></pre>
<h3>Investment &amp; terminal cash flow</h3>
<pre><code>Free cash flow (FCF) = OCF − CapEx − ΔWorking capital

Terminal year adds back:
 + Net working capital recovered
 + After-tax salvage value of fixed assets
</code></pre>
<div class="callout"><span class="badge">Garbage in, garbage out</span> NPV/IRR in Chapter 4 are only as good as the cash flow forecast built here — this is usually where real appraisals go wrong, not in the discounting formula.</div>`,
    `<span class="eyebrow">BKG303 · Chương 3 · Bài 3.1</span>
<h2>Ước lượng dòng tiền dự án (theo nguyên tắc tăng thêm)</h2>
<h3>Nguyên tắc dòng tiền tăng thêm</h3>
<p>Thẩm định phần <strong>chênh lệch</strong> mà dự án tạo ra cho tổng dòng tiền của công ty — "có dự án" trừ "không có dự án" — không phải lợi nhuận kế toán của dự án.</p>
<ul>
<li><strong>Bỏ qua chi phí chìm</strong> — tiền đã chi rồi không thay đổi theo quyết định hôm nay.</li>
<li><strong>Tính cả chi phí cơ hội</strong> — giá trị của tài sản/nguồn lực dự án sử dụng, dù không có tiền mặt thực chi.</li>
<li><strong>Tính cả hiệu ứng phụ</strong> — sự ăn mòn/hỗ trợ lên các sản phẩm khác của công ty do dự án gây ra.</li>
<li><strong>Loại chi phí tài trợ</strong> khỏi dòng tiền hoạt động — lãi vay đã được phản ánh trong suất chiết khấu (WACC), không tính hai lần.</li>
</ul>
<h3>Dựng dòng tiền hoạt động (phương pháp gián tiếp)</h3>
<pre><code>Doanh thu                       1.200
(-) Chi phí hoạt động (COGS)     (600)
(-) Khấu hao                     (150)
= EBIT                            450
(-) Thuế (20%)                     (90)
= NOPAT (EBIT sau thuế)           360
(+) Khấu hao (phi tiền mặt)       150
= Dòng tiền hoạt động (OCF)       510
</code></pre>
<h3>Dòng tiền đầu tư &amp; dòng tiền kết thúc dự án</h3>
<pre><code>Dòng tiền tự do (FCF) = OCF − Vốn đầu tư (CapEx) − ΔVốn lưu động

Năm cuối dự án cộng thêm:
 + Vốn lưu động thu hồi
 + Giá trị thanh lý tài sản cố định (sau thuế)
</code></pre>
<div class="callout"><span class="badge">Đầu vào sai, kết quả sai</span> NPV/IRR ở Chương 4 chỉ tốt bằng đúng dự báo dòng tiền dựng ở đây — thực tế thẩm định thường sai ở bước này, không phải ở công thức chiết khấu.</div>`,
  ]]);

const c3q = quiz('bkg303-quiz-3', 'Quiz 3 — Estimating cash flows|||Quiz 3 — Ước lượng dòng tiền', [
  { id: 'q1', question: 'Dòng tiền tăng thêm (incremental cash flow) của dự án là?', options: ['Toàn bộ dòng tiền của công ty trước và sau dự án cộng lại', 'Chênh lệch dòng tiền của công ty CÓ dự án so với KHÔNG có dự án', 'Chi phí chìm (sunk cost) của dự án', 'Lợi nhuận kế toán ghi trên báo cáo'], correctIndex: 1, explanation: 'Chỉ tính phần chênh lệch dòng tiền do dự án tạo ra, không phải toàn bộ dòng tiền công ty.' },
  { id: 'q2', question: 'Chi phí chìm (sunk cost) khi thẩm định dự án nên được xử lý thế nào?', options: ['Luôn cộng vào vốn đầu tư ban đầu', 'Bỏ qua vì đã phát sinh và không đổi theo quyết định hiện tại', 'Chia đều cho các năm của dự án', 'Chỉ tính nếu dự án thất bại'], correctIndex: 1, explanation: 'Sunk cost không thay đổi theo quyết định hôm nay nên không đưa vào dòng tiền tăng thêm.' },
  { id: 'q3', question: 'Dòng tiền hoạt động (OCF) theo cách tính gián tiếp thường bằng?', options: ['Doanh thu trừ chi phí lãi vay', 'EBIT×(1−thuế) + Khấu hao', 'Lợi nhuận sau thuế trừ khấu hao', 'Vốn chủ sở hữu cộng nợ vay'], correctIndex: 1, explanation: 'OCF = NOPAT (EBIT sau thuế) cộng lại khấu hao vì khấu hao là chi phí phi tiền mặt.' },
]);

const c4 = doc('bkg303-4-1-npv-irr-payback-pi', '4.1 — NPV, IRR, payback period & PI|||4.1 — NPV, IRR, thời gian hoàn vốn & PI',
  'Công thức và quy tắc quyết định của NPV, IRR, thời gian hoàn vốn, chỉ số sinh lời PI; ví dụ tính toán số liệu giả định.',
  [[
    `<span class="eyebrow">BKG303 · Chapter 4 · Lesson 4.1</span>
<h2>Decision criteria: NPV, IRR, payback &amp; PI</h2>
<h3>Net present value (NPV)</h3>
<pre><code>NPV = Σ [ CFt / (1+r)^t ]  for t = 1..n,  minus initial investment CF0

Decision rule: NPV &gt; 0 -&gt; accept (adds value); NPV &lt; 0 -&gt; reject
</code></pre>
<h3>Internal rate of return (IRR)</h3>
<p>IRR is the discount rate that makes NPV = 0. Decision rule: accept if IRR is greater than the required rate (hurdle rate/WACC).</p>
<h3>Payback period &amp; profitability index (PI)</h3>
<pre><code>Payback period = year cash flows fully recover the initial investment
 (fast, intuitive, but ignores cash flows after payback and time value of money)

PI = PV of future cash inflows / initial investment
 Decision rule: PI &gt; 1 -&gt; accept (same signal as NPV &gt; 0)
</code></pre>
<h3>Worked example</h3>
<p>Initial investment 1,000 (triệu đồng); 5 years of CF = 300/year; r = 10%.</p>
<pre><code>PV of inflows  = 300 × 3.7908 ≈ 1,137.2
NPV            = 1,137.2 − 1,000 = +137.2   -> accept
IRR            ≈ 15.3%  (higher than the 10% hurdle) -> accept
Payback        ≈ 3.33 years (900 by yr 3, +100/300 into yr 4)
PI             = 1,137.2 / 1,000 = 1.14      -> accept
</code></pre>
<div class="callout"><span class="badge">When criteria disagree</span> For independent projects they usually agree. For mutually exclusive projects with conflicting rankings, <strong>NPV wins</strong> — it directly measures value created in currency, which IRR (a %) and payback (ignores time value) do not.</div>`,
    `<span class="eyebrow">BKG303 · Chương 4 · Bài 4.1</span>
<h2>Tiêu chí quyết định: NPV, IRR, hoàn vốn &amp; PI</h2>
<h3>Giá trị hiện tại thuần (NPV)</h3>
<pre><code>NPV = Σ [ CFt / (1+r)^t ]  với t = 1..n,  trừ vốn đầu tư ban đầu CF0

Quy tắc quyết định: NPV &gt; 0 -&gt; chấp nhận (tạo thêm giá trị); NPV &lt; 0 -&gt; loại bỏ
</code></pre>
<h3>Tỉ suất hoàn vốn nội bộ (IRR)</h3>
<p>IRR là suất chiết khấu làm NPV = 0. Quy tắc quyết định: chấp nhận nếu IRR lớn hơn tỉ suất yêu cầu (hurdle rate/WACC).</p>
<h3>Thời gian hoàn vốn &amp; chỉ số sinh lời (PI)</h3>
<pre><code>Thời gian hoàn vốn = số năm để dòng tiền thu hồi đủ vốn đầu tư ban đầu
 (nhanh, trực quan, nhưng bỏ qua dòng tiền sau điểm hoàn vốn và giá trị thời gian của tiền)

PI = PV dòng tiền vào tương lai / vốn đầu tư ban đầu
 Quy tắc quyết định: PI &gt; 1 -&gt; chấp nhận (cùng tín hiệu với NPV &gt; 0)
</code></pre>
<h3>Ví dụ tính toán</h3>
<p>Vốn đầu tư ban đầu 1.000 (triệu đồng); dòng tiền 5 năm = 300/năm; r = 10%.</p>
<pre><code>PV dòng tiền vào = 300 × 3,7908 ≈ 1.137,2
NPV               = 1.137,2 − 1.000 = +137,2   -&gt; chấp nhận
IRR               ≈ 15,3%  (cao hơn tỉ suất yêu cầu 10%) -&gt; chấp nhận
Thời gian hoàn vốn ≈ 3,33 năm (900 sau năm 3, +100/300 vào năm 4)
PI                = 1.137,2 / 1.000 = 1,14      -&gt; chấp nhận
</code></pre>
<div class="callout"><span class="badge">Khi các tiêu chí mâu thuẫn</span> Với dự án độc lập, các tiêu chí thường đồng thuận. Với dự án loại trừ nhau và xếp hạng trái ngược, <strong>NPV thắng</strong> — vì nó đo trực tiếp giá trị tạo ra bằng tiền, còn IRR (là %) và hoàn vốn (bỏ qua giá trị thời gian) thì không.</div>`,
  ]]);

const c4q = quiz('bkg303-quiz-4', 'Quiz 4 — NPV, IRR, payback, PI|||Quiz 4 — NPV, IRR, hoàn vốn, PI', [
  { id: 'q1', question: 'Dự án được chấp nhận theo tiêu chí NPV khi?', options: ['NPV < 0', 'NPV = 0', 'NPV > 0', 'NPV bất kỳ giá trị nào'], correctIndex: 2, explanation: 'NPV dương nghĩa là dự án tạo thêm giá trị cho nhà đầu tư.' },
  { id: 'q2', question: 'IRR là suất chiết khấu làm cho?', options: ['NPV của dự án bằng 0', 'Thời gian hoàn vốn bằng 0', 'Chi phí vốn bằng 0', 'Doanh thu bằng chi phí'], correctIndex: 0, explanation: 'Theo định nghĩa, IRR là suất chiết khấu khiến NPV = 0.' },
  { id: 'q3', question: 'Hạn chế lớn của chỉ tiêu Thời gian hoàn vốn (Payback Period) là?', options: ['Không tính được bằng số nguyên năm', 'Bỏ qua dòng tiền sau điểm hoàn vốn và giá trị thời gian của tiền (bản gốc)', 'Chỉ dùng được cho dự án ngắn hạn', 'Luôn cho kết quả giống NPV'], correctIndex: 1, explanation: 'Payback gốc không chiết khấu và không xét dòng tiền sau điểm hoàn vốn.' },
]);

const c5 = doc('bkg303-5-1-wacc', '5.1 — Cost of capital (WACC) & the discount rate|||5.1 — Chi phí vốn (WACC) & suất chiết khấu',
  'Chi phí vốn chủ sở hữu theo CAPM; chi phí nợ sau thuế; công thức WACC; ví dụ tính toán số liệu giả định.',
  [[
    `<span class="eyebrow">BKG303 · Chapter 5 · Lesson 5.1</span>
<h2>Cost of capital (WACC) &amp; the discount rate</h2>
<h3>Why the discount rate is the WACC</h3>
<p>The discount rate in NPV should reflect the return investors require for the project's risk — the firm's <strong>weighted average cost of capital (WACC)</strong>, blending the cost of equity and after-tax cost of debt by their weight in the financing mix.</p>
<h3>Cost of equity (CAPM)</h3>
<pre><code>Ke = Rf + β × (Rm − Rf)

Rf = risk-free rate, β = equity beta (systematic risk), Rm = expected market return
</code></pre>
<h3>Cost of debt (after tax)</h3>
<pre><code>Kd(after tax) = Kd × (1 − t)

Interest is tax-deductible -> the "tax shield" lowers the effective cost of debt
</code></pre>
<h3>WACC formula &amp; example</h3>
<pre><code>WACC = (E/V) × Ke + (D/V) × Kd × (1 − t)

Example: Rf=5%, β=1.2, Rm=11% -> Ke = 5% + 1.2×(11%−5%) = 12.2%
Kd = 8%, t = 20%              -> Kd(after tax) = 8%×0.8 = 6.4%
E/V = 60%, D/V = 40%
WACC = 0.6×12.2% + 0.4×6.4% = 7.32% + 2.56% = 9.88%
</code></pre>
<div class="callout"><span class="badge">One rate doesn't fit all projects</span> WACC reflects the FIRM's average risk. A project riskier or safer than the firm's typical business should be discounted at a risk-adjusted rate, not the plain company-wide WACC.</div>`,
    `<span class="eyebrow">BKG303 · Chương 5 · Bài 5.1</span>
<h2>Chi phí vốn (WACC) &amp; suất chiết khấu</h2>
<h3>Vì sao suất chiết khấu chính là WACC</h3>
<p>Suất chiết khấu trong NPV cần phản ánh tỉ suất sinh lời nhà đầu tư yêu cầu cho mức rủi ro của dự án — đó là <strong>chi phí vốn bình quân gia quyền (WACC)</strong> của công ty, kết hợp chi phí vốn chủ sở hữu và chi phí nợ sau thuế theo tỉ trọng trong cơ cấu vốn.</p>
<h3>Chi phí vốn chủ sở hữu (mô hình CAPM)</h3>
<pre><code>Ke = Rf + β × (Rm − Rf)

Rf = lãi suất không rủi ro, β = hệ số beta cổ phiếu (rủi ro hệ thống), Rm = tỉ suất sinh lời kỳ vọng của thị trường
</code></pre>
<h3>Chi phí nợ vay (sau thuế)</h3>
<pre><code>Kd(sau thuế) = Kd × (1 − t)

Lãi vay được khấu trừ thuế -> "lá chắn thuế" làm giảm chi phí nợ vay thực tế
</code></pre>
<h3>Công thức WACC &amp; ví dụ</h3>
<pre><code>WACC = (E/V) × Ke + (D/V) × Kd × (1 − t)

Ví dụ: Rf=5%, β=1,2, Rm=11% -> Ke = 5% + 1,2×(11%−5%) = 12,2%
Kd = 8%, t = 20%             -> Kd(sau thuế) = 8%×0,8 = 6,4%
E/V = 60%, D/V = 40%
WACC = 0,6×12,2% + 0,4×6,4% = 7,32% + 2,56% = 9,88%
</code></pre>
<div class="callout"><span class="badge">Một mức lãi không hợp với mọi dự án</span> WACC phản ánh rủi ro TRUNG BÌNH của công ty. Dự án rủi ro cao hơn hoặc thấp hơn hoạt động thường ngày của công ty nên được chiết khấu bằng suất đã điều chỉnh rủi ro, không phải WACC chung của công ty.</div>`,
  ]]);

const c5q = quiz('bkg303-quiz-5', 'Quiz 5 — WACC & discount rate|||Quiz 5 — WACC & suất chiết khấu', [
  { id: 'q1', question: 'WACC là?', options: ['Chi phí vốn bình quân gia quyền giữa vốn chủ sở hữu và nợ vay', 'Lãi suất vay ngân hàng duy nhất', 'Tỷ lệ lạm phát kỳ vọng', 'Thuế suất thu nhập doanh nghiệp'], correctIndex: 0, explanation: 'WACC = (E/V)×Ke + (D/V)×Kd×(1−t), bình quân gia quyền theo cơ cấu vốn.' },
  { id: 'q2', question: 'Theo mô hình CAPM, chi phí vốn chủ sở hữu (Ke) phụ thuộc vào?', options: ['Lãi suất không rủi ro, hệ số beta và phần bù rủi ro thị trường', 'Chỉ số giá tiêu dùng CPI', 'Tổng tài sản công ty', 'Số lượng cổ đông'], correctIndex: 0, explanation: 'Ke = Rf + β×(Rm − Rf).' },
  { id: 'q3', question: 'Vì sao chi phí nợ vay (Kd) được điều chỉnh theo thuế (1−t) khi tính WACC?', options: ['Vì lãi vay được trừ trước thuế nên tạo lá chắn thuế (tax shield)', 'Vì nợ vay không phải trả lãi', 'Vì cổ tức được khấu trừ thuế', 'Vì quy định kế toán bắt buộc mọi chi phí'], correctIndex: 0, explanation: 'Lãi vay là chi phí được trừ thuế, làm giảm chi phí nợ thực tế xuống Kd×(1−t).' },
]);

const c6 = doc('bkg303-6-1-risk-analysis', '6.1 — Risk analysis: sensitivity, scenario & Monte Carlo|||6.1 — Phân tích rủi ro: độ nhạy, kịch bản & Monte Carlo',
  'Phân tích độ nhạy (một biến), phân tích kịch bản (nhiều biến đồng thời), mô phỏng Monte Carlo, phân tích điểm hoà vốn.',
  [[
    `<span class="eyebrow">BKG303 · Chapter 6 · Lesson 6.1</span>
<h2>Risk analysis: sensitivity, scenario &amp; Monte Carlo</h2>
<h3>Sensitivity analysis</h3>
<p>Vary <em>one</em> input at a time (sales price, volume, cost, discount rate) holding others constant, and recompute NPV — reveals which assumptions the project's value is most fragile to.</p>
<pre><code>Base case NPV       = +137.2
Sales price −10%    -> NPV ≈ −60   (turns negative — high sensitivity)
Discount rate +2pp   -> NPV ≈ +95   (still positive — lower sensitivity)
</code></pre>
<h3>Scenario analysis</h3>
<p>Change several variables <em>together</em>, consistently, to build coherent best-case / base-case / worst-case stories — captures that bad sales and bad costs often happen together, which one-variable sensitivity misses.</p>
<h3>Monte Carlo simulation</h3>
<p>Assign a probability distribution to each uncertain input, then run thousands of random draws through the cash flow model to get a full <strong>distribution of NPV/IRR outcomes</strong> — not just one number, but the probability the project loses money.</p>
<h3>Break-even analysis</h3>
<p>Find the sales volume (or price) at which NPV = 0 — the minimum performance the project must hit to be worthwhile.</p>
<div class="callout"><span class="badge">Risk needs a range, not a point</span> A single NPV number hides how much that number depends on assumptions. These three tools turn "NPV = +137" into "how likely is it to stay positive?"</div>`,
    `<span class="eyebrow">BKG303 · Chương 6 · Bài 6.1</span>
<h2>Phân tích rủi ro: độ nhạy, kịch bản &amp; Monte Carlo</h2>
<h3>Phân tích độ nhạy</h3>
<p>Thay đổi <em>một</em> biến đầu vào mỗi lần (giá bán, sản lượng, chi phí, suất chiết khấu) trong khi giữ các biến khác cố định, rồi tính lại NPV — cho thấy giá trị dự án nhạy nhất với giả định nào.</p>
<pre><code>NPV kịch bản cơ sở  = +137,2
Giá bán giảm 10%     -&gt; NPV ≈ −60   (chuyển âm — độ nhạy cao)
Suất chiết khấu +2 điểm % -&gt; NPV ≈ +95   (vẫn dương — độ nhạy thấp hơn)
</code></pre>
<h3>Phân tích kịch bản</h3>
<p>Thay đổi <em>đồng thời</em> nhiều biến một cách nhất quán, để dựng các kịch bản tốt nhất / cơ sở / xấu nhất mạch lạc — nắm bắt được việc doanh số kém và chi phí xấu thường xảy ra cùng nhau, điều mà phân tích độ nhạy một biến bỏ lỡ.</p>
<h3>Mô phỏng Monte Carlo</h3>
<p>Gán một phân phối xác suất cho mỗi biến đầu vào không chắc chắn, rồi chạy hàng nghìn lượt lấy mẫu ngẫu nhiên qua mô hình dòng tiền để có toàn bộ <strong>phân phối kết quả NPV/IRR</strong> — không chỉ một con số, mà cả xác suất dự án bị lỗ.</p>
<h3>Phân tích điểm hoà vốn</h3>
<p>Tìm sản lượng (hoặc giá bán) tại đó NPV = 0 — mức hiệu quả tối thiểu dự án phải đạt để đáng thực hiện.</p>
<div class="callout"><span class="badge">Rủi ro cần một khoảng, không phải một điểm</span> Một con số NPV duy nhất che giấu việc nó phụ thuộc bao nhiêu vào giả định. Ba công cụ này biến "NPV = +137" thành "khả năng nó vẫn dương là bao nhiêu?"</div>`,
  ]]);

const c6q = quiz('bkg303-quiz-6', 'Quiz 6 — Risk analysis|||Quiz 6 — Phân tích rủi ro', [
  { id: 'q1', question: 'Phân tích độ nhạy (sensitivity analysis) giúp trả lời câu hỏi?', options: ['NPV thay đổi thế nào khi MỘT biến đầu vào thay đổi trong khi các biến khác giữ nguyên', 'Dự án chắc chắn lãi bao nhiêu', 'Thuế suất bao nhiêu là hợp lý', 'Vốn điều lệ công ty là bao nhiêu'], correctIndex: 0, explanation: 'Sensitivity analysis chỉ thay đổi một biến mỗi lần để xem NPV nhạy đến đâu.' },
  { id: 'q2', question: 'Phân tích kịch bản (scenario analysis) khác phân tích độ nhạy ở điểm nào?', options: ['Chỉ dùng một biến duy nhất', 'Thay đổi ĐỒNG THỜI nhiều biến theo các kịch bản nhất quán (tốt/xấu/cơ sở)', 'Không liên quan đến NPV', 'Chỉ áp dụng sau khi dự án đã triển khai'], correctIndex: 1, explanation: 'Scenario analysis thay đổi nhiều biến cùng lúc theo một câu chuyện nhất quán.' },
  { id: 'q3', question: 'Mô phỏng Monte Carlo trong thẩm định rủi ro dự án dùng để?', options: ['Tính chính xác tuyệt đối NPV', 'Mô phỏng hàng nghìn kịch bản dựa trên phân phối xác suất của các biến đầu vào để ước lượng phân phối NPV/IRR', 'Thay thế hoàn toàn báo cáo tài chính', 'Chỉ dùng cho dự án bất động sản'], correctIndex: 1, explanation: 'Monte Carlo cho ra một phân phối kết quả, không phải một con số duy nhất.' },
]);

const c7 = doc('bkg303-7-1-economic-environmental', '7.1 — Economic, social & environmental appraisal|||7.1 — Thẩm định kinh tế, xã hội & môi trường',
  'Thẩm định tài chính vs kinh tế; giá ẩn (shadow price); ngoại tác & suất chiết khấu xã hội; đánh giá tác động môi trường (EIA).',
  [[
    `<span class="eyebrow">BKG303 · Chapter 7 · Lesson 7.1</span>
<h2>Economic, social &amp; environmental appraisal</h2>
<h3>Financial vs. economic appraisal</h3>
<p><strong>Financial appraisal</strong> (Chapters 2-5) asks: is this good for the investor, using market prices? <strong>Economic (social) appraisal</strong> asks: is this good for society as a whole, including effects the investor doesn't pay for or profit from.</p>
<h3>Shadow prices</h3>
<p>When market prices are distorted (subsidies, taxes, controlled exchange rates, unemployed labor), economic appraisal replaces them with <strong>shadow prices</strong> that better reflect true opportunity cost to the economy — e.g. the shadow wage of workers who would otherwise be unemployed is below the market wage.</p>
<h3>Externalities &amp; the social discount rate</h3>
<ul>
<li><strong>Positive externalities</strong> (jobs, skills transfer, infrastructure spillovers) and <strong>negative externalities</strong> (pollution, congestion) must be added into the economic cash flow even though no cash changes hands.</li>
<li>Public projects often use a <strong>social discount rate</strong> lower than a commercial WACC, reflecting society's longer time horizon.</li>
</ul>
<h3>Environmental impact assessment (EIA)</h3>
<p>A structured study to identify, measure, and propose mitigation for a project's environmental effects (emissions, land use, water, biodiversity) before approval — mandatory for many project categories under national and World Bank safeguard policies.</p>
<div class="callout"><span class="badge">A project can pass one test and fail another</span> A financially profitable project can be economically or environmentally unacceptable, and vice versa — appraisal reports carry both verdicts, not just the financial one.</div>`,
    `<span class="eyebrow">BKG303 · Chương 7 · Bài 7.1</span>
<h2>Thẩm định kinh tế, xã hội &amp; môi trường</h2>
<h3>Thẩm định tài chính vs kinh tế</h3>
<p><strong>Thẩm định tài chính</strong> (Chương 2-5) hỏi: dự án có lợi cho nhà đầu tư, dùng giá thị trường? <strong>Thẩm định kinh tế (xã hội)</strong> hỏi: dự án có lợi cho toàn xã hội, kể cả những tác động mà nhà đầu tư không phải trả hoặc không hưởng lợi trực tiếp.</p>
<h3>Giá ẩn (shadow price)</h3>
<p>Khi giá thị trường bị bóp méo (trợ giá, thuế, tỉ giá kiểm soát, lao động thất nghiệp), thẩm định kinh tế thay bằng <strong>giá ẩn (shadow price)</strong> phản ánh đúng hơn chi phí cơ hội thực cho nền kinh tế — vd tiền lương ẩn của lao động vốn sẽ thất nghiệp thấp hơn lương thị trường.</p>
<h3>Ngoại tác &amp; suất chiết khấu xã hội</h3>
<ul>
<li><strong>Ngoại tác tích cực</strong> (việc làm, chuyển giao kỹ năng, lợi ích lan toả từ hạ tầng) và <strong>ngoại tác tiêu cực</strong> (ô nhiễm, ùn tắc) phải được cộng vào dòng tiền kinh tế dù không có tiền mặt thực chi.</li>
<li>Dự án công thường dùng <strong>suất chiết khấu xã hội</strong> thấp hơn WACC thương mại, phản ánh tầm nhìn dài hạn của xã hội.</li>
</ul>
<h3>Đánh giá tác động môi trường (EIA)</h3>
<p>Một nghiên cứu có hệ thống để nhận diện, đo lường và đề xuất giảm thiểu tác động môi trường của dự án (khí thải, sử dụng đất, nước, đa dạng sinh học) trước khi phê duyệt — bắt buộc với nhiều loại dự án theo quy định quốc gia và chính sách an toàn của World Bank.</p>
<div class="callout"><span class="badge">Một dự án có thể đạt bài kiểm này nhưng trượt bài kiểm khác</span> Một dự án có lãi về tài chính vẫn có thể không chấp nhận được về kinh tế hoặc môi trường, và ngược lại — báo cáo thẩm định phải mang cả hai kết luận, không chỉ kết luận tài chính.</div>`,
  ]]);

const c7q = quiz('bkg303-quiz-7', 'Quiz 7 — Economic, social & environmental|||Quiz 7 — Kinh tế, xã hội & môi trường', [
  { id: 'q1', question: 'Thẩm định kinh tế - xã hội khác thẩm định tài chính chủ yếu ở điểm nào?', options: ['Dùng giá ẩn (shadow price) thay giá thị trường và tính cả lợi ích/chi phí ngoại tác cho toàn xã hội', 'Chỉ tính cho nhà đầu tư tư nhân', 'Không cần suất chiết khấu', 'Không liên quan đến dòng tiền'], correctIndex: 0, explanation: 'Thẩm định kinh tế mở rộng góc nhìn ra toàn xã hội và dùng giá ẩn khi giá thị trường bị bóp méo.' },
  { id: 'q2', question: 'Giá ẩn (shadow price) được dùng khi?', options: ['Giá thị trường không phản ánh đúng chi phí/lợi ích thực cho xã hội (vd lao động thất nghiệp, ngoại tệ được kiểm soát)', 'Giá thị trường luôn chính xác', 'Chỉ áp dụng cho vàng và ngoại tệ', 'Không bao giờ cần dùng'], correctIndex: 0, explanation: 'Shadow price thay thế giá thị trường bị bóp méo bằng giá phản ánh đúng chi phí cơ hội thực.' },
  { id: 'q3', question: 'Đánh giá tác động môi trường (EIA) của dự án nhằm?', options: ['Tăng doanh thu dự án', 'Nhận diện, đo lường và đề xuất giảm thiểu tác động tiêu cực đến môi trường trước khi triển khai', 'Thay thế thẩm định tài chính', 'Chỉ bắt buộc với dự án nước ngoài'], correctIndex: 1, explanation: 'EIA là nghiên cứu có hệ thống về tác động môi trường và biện pháp giảm thiểu, trước khi phê duyệt dự án.' },
]);

const c8 = doc('bkg303-8-1-decision-report', '8.1 — Investment decision & the appraisal report|||8.1 — Ra quyết định đầu tư & lập báo cáo thẩm định',
  'Tổng hợp các tiêu chí; xử lý mâu thuẫn NPV/IRR và giới hạn vốn; cấu trúc báo cáo thẩm định; hậu kiểm dự án.',
  [[
    `<span class="eyebrow">BKG303 · Chapter 8 · Lesson 8.1</span>
<h2>Investment decision &amp; the appraisal report</h2>
<h3>Bringing the criteria together</h3>
<p>A final "go/no-go" combines: financial results (NPV/IRR/PI/payback), risk analysis (how fragile is the base case), economic &amp; social verdict, environmental clearance, and qualitative/strategic fit — no single number decides alone.</p>
<h3>Handling conflicting signals</h3>
<pre><code>Independent projects, all criteria positive       -> accept all that clear the hurdle
Mutually exclusive projects, NPV vs IRR disagree  -> NPV wins (measures value in money)
Capital-rationed portfolio                        -> rank by Profitability Index (PI), pick highest PI first
</code></pre>
<h3>Structure of an appraisal report</h3>
<pre><code>1. Executive summary          -> recommendation up front
2. Project description        -> scope, technology, market
3. Financial analysis         -> cash flows, NPV/IRR/PI/payback, WACC
4. Risk analysis              -> sensitivity/scenario/Monte Carlo
5. Economic &amp; social analysis -> shadow prices, externalities
6. Environmental assessment   -> EIA findings, mitigation plan
7. Conclusion &amp; recommendation
</code></pre>
<h3>Post-audit: closing the loop</h3>
<p>After implementation, <strong>post-audit</strong> compares actual results to the appraisal's forecasts — not to punish, but to find where estimation was systematically biased and improve the next appraisal.</p>
<div class="callout"><span class="badge">Appraisal is a process, not a formula</span> Chapters 1-7 built the tools; this chapter is where they become one defensible investment decision — and where the cycle from Chapter 1 closes with evaluation.</div>`,
    `<span class="eyebrow">BKG303 · Chương 8 · Bài 8.1</span>
<h2>Ra quyết định đầu tư &amp; lập báo cáo thẩm định</h2>
<h3>Tổng hợp các tiêu chí</h3>
<p>Quyết định cuối cùng "làm/không làm" kết hợp: kết quả tài chính (NPV/IRR/PI/hoàn vốn), phân tích rủi ro (kịch bản cơ sở mong manh đến đâu), kết luận kinh tế &amp; xã hội, sự chấp thuận về môi trường, và mức phù hợp chiến lược/định tính — không một con số nào quyết định một mình.</p>
<h3>Xử lý tín hiệu mâu thuẫn</h3>
<pre><code>Dự án độc lập, mọi tiêu chí đều tích cực        -&gt; chấp nhận tất cả dự án vượt tỉ suất yêu cầu
Dự án loại trừ nhau, NPV vs IRR trái ngược      -&gt; NPV thắng (đo trực tiếp giá trị bằng tiền)
Vốn bị giới hạn (capital rationing)             -&gt; xếp hạng theo chỉ số sinh lời (PI), chọn PI cao nhất trước
</code></pre>
<h3>Cấu trúc báo cáo thẩm định</h3>
<pre><code>1. Tóm tắt tổng quan (Executive summary) -&gt; kiến nghị nêu ngay từ đầu
2. Mô tả dự án                           -&gt; phạm vi, công nghệ, thị trường
3. Phân tích tài chính                   -&gt; dòng tiền, NPV/IRR/PI/hoàn vốn, WACC
4. Phân tích rủi ro                      -&gt; độ nhạy/kịch bản/Monte Carlo
5. Phân tích kinh tế &amp; xã hội            -&gt; giá ẩn, ngoại tác
6. Đánh giá môi trường                   -&gt; kết quả EIA, kế hoạch giảm thiểu
7. Kết luận &amp; kiến nghị
</code></pre>
<h3>Hậu kiểm: khép lại vòng thẩm định</h3>
<p>Sau khi triển khai, <strong>hậu kiểm (post-audit)</strong> so kết quả thực tế với dự báo của báo cáo thẩm định — không để quy trách nhiệm, mà để tìm ra chỗ ước lượng bị lệch có hệ thống và cải thiện lần thẩm định sau.</p>
<div class="callout"><span class="badge">Thẩm định là một quy trình, không phải một công thức</span> Chương 1-7 dựng công cụ; chương này là nơi chúng gộp thành một quyết định đầu tư có thể bảo vệ được — và nơi chu trình từ Chương 1 khép lại bằng bước đánh giá.</div>`,
  ]]);

const c8q = quiz('bkg303-quiz-8', 'Quiz 8 — Decision & report|||Quiz 8 — Quyết định & báo cáo thẩm định', [
  { id: 'q1', question: 'Khi NPV và IRR đưa ra kết luận trái ngược ở dự án loại trừ nhau (mutually exclusive), tiêu chí nào thường được ưu tiên?', options: ['IRR vì tính bằng %', 'Payback vì đơn giản', 'NPV vì đo trực tiếp giá trị tăng thêm bằng tiền', 'PI luôn đúng tuyệt đối'], correctIndex: 2, explanation: 'NPV đo trực tiếp giá trị tạo ra bằng đơn vị tiền, nên được ưu tiên khi các tiêu chí mâu thuẫn.' },
  { id: 'q2', question: 'Báo cáo thẩm định dự án đầu tư thường KHÔNG cần phần nào sau đây?', options: ['Tóm tắt tổng quan dự án (Executive Summary)', 'Phân tích tài chính & rủi ro', 'Kết luận & kiến nghị', 'Danh sách toàn bộ email nội bộ công ty'], correctIndex: 3, explanation: 'Báo cáo thẩm định tập trung vào phân tích và kết luận, không phải hồ sơ hành chính nội bộ.' },
  { id: 'q3', question: 'Hậu kiểm dự án (post-audit) sau khi triển khai nhằm mục đích gì?', options: ['Xoá bỏ hồ sơ dự án cũ', 'So sánh kết quả thực tế với dự báo ban đầu để rút kinh nghiệm cho các dự án sau', 'Tính lại thuế thu nhập cá nhân', 'Không có tác dụng thực tế'], correctIndex: 1, explanation: 'Post-audit giúp phát hiện sai lệch dự báo có hệ thống và cải thiện thẩm định trong tương lai.' },
]);

export default {
  semester: { code: 'FPTU_Hola8', name: 'Kỳ 8', ordinal: 10 },
  course: {
    courseCode: 'BKG303',
    slug: 'bkg303-investment-project-appraisal',
    title: 'Investment Project Appraisal',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/BKG303.webp',
    shortDescription: 'How to decide whether to invest — discounting, incremental cash flows, NPV/IRR/payback/PI, WACC, risk analysis, economic & environmental appraisal, investment decision. Bilingual, with examples & quizzes.|||Cách quyết định có nên đầu tư — chiết khấu, dòng tiền tăng thêm, NPV/IRR/hoàn vốn/PI, WACC, phân tích rủi ro, thẩm định kinh tế-xã hội & môi trường, ra quyết định đầu tư. Song ngữ, có ví dụ & quiz.',
    description: 'Môn <strong>BKG303 — Investment Project Appraisal</strong> (kỳ 8) trang bị công cụ để quyết định <strong>có nên thực hiện một dự án đầu tư hay không</strong>. Từ <strong>chu trình dự án</strong> → <strong>giá trị thời gian của tiền &amp; chiết khấu</strong> → <strong>ước lượng dòng tiền tăng thêm</strong> → <strong>NPV, IRR, thời gian hoàn vốn, PI</strong> → <strong>chi phí vốn (WACC)</strong> → <strong>phân tích rủi ro</strong> (độ nhạy/kịch bản/Monte Carlo) → <strong>thẩm định kinh tế-xã hội &amp; môi trường</strong> → <strong>ra quyết định đầu tư</strong> &amp; lập báo cáo thẩm định. Bám giáo trình quốc tế (Brealey/Myers/Allen, Ross/Westerfield/Jaffe, World Bank), song ngữ, có ví dụ tính toán và quiz mỗi chương.',
    whatYouLearn: 'Chu trình & các khía cạnh thẩm định dự án; giá trị thời gian của tiền (PV/FV/annuity); ước lượng dòng tiền tăng thêm, chi phí chìm, chi phí cơ hội; NPV, IRR, thời gian hoàn vốn, chỉ số sinh lời PI; chi phí vốn WACC (CAPM, chi phí nợ sau thuế); phân tích độ nhạy, kịch bản, Monte Carlo; thẩm định kinh tế-xã hội, giá ẩn (shadow price), đánh giá tác động môi trường (EIA); ra quyết định đầu tư & cấu trúc báo cáo thẩm định.',
    requirements: 'Kiến thức tài chính doanh nghiệp cơ bản (Nguyên lý kế toán, Tài chính doanh nghiệp). Nên biết dùng Excel/Google Sheets (hàm NPV, IRR).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách tham khảo quốc tế, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Thẩm định dự án là gì, lộ trình môn học.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan & chu trình dự án|||Chapter 1 — Overview & project cycle', description: 'Định nghĩa thẩm định, chu trình dự án, các khía cạnh thẩm định.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Giá trị thời gian của tiền|||Chapter 2 — Time value of money', description: 'FV/PV, annuity, suất chiết khấu.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Ước lượng dòng tiền dự án|||Chapter 3 — Estimating project cash flows', description: 'Dòng tiền tăng thêm, OCF, dòng tiền kết thúc dự án.', lessons: [c3, c3q] },
    { title: 'Chương 4 — NPV, IRR, hoàn vốn & PI|||Chapter 4 — NPV, IRR, payback & PI', description: 'Công thức, quy tắc quyết định, ví dụ tính toán.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Chi phí vốn (WACC)|||Chapter 5 — Cost of capital (WACC)', description: 'CAPM, chi phí nợ sau thuế, công thức WACC.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Phân tích rủi ro|||Chapter 6 — Risk analysis', description: 'Độ nhạy, kịch bản, Monte Carlo, điểm hoà vốn.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Thẩm định kinh tế-xã hội & môi trường|||Chapter 7 — Economic, social & environmental appraisal', description: 'Giá ẩn, ngoại tác, đánh giá tác động môi trường.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Ra quyết định & báo cáo thẩm định|||Chapter 8 — Investment decision & appraisal report', description: 'Tổng hợp tiêu chí, cấu trúc báo cáo, hậu kiểm.', lessons: [c8, c8q] },
  ],
};
