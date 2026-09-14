/**
 * FIN303 — Advanced Corporate Finance. Giáo trình (trích dẫn, không upload):
 * Brealey/Myers/Allen "Principles of Corporate Finance"; Ross/Westerfield/Jaffe
 * "Corporate Finance"; Damodaran "Applied Corporate Finance". 8 chương nâng cao:
 * TVM & đầu tư, chi phí vốn & cấu trúc vốn (MM), cổ tức & mua lại cổ phiếu, định
 * giá doanh nghiệp (DCF/APV), vốn lưu động, phái sinh & rủi ro, M&A/LBO, tài
 * chính quốc tế & EVA. Song ngữ + ví dụ số (GIẢ ĐỊNH). Giữ NGUYÊN slug/semester.
 * ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('fin303-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Ba giáo trình chuẩn tài chính doanh nghiệp (Brealey/Myers/Allen, Ross/Westerfield/Jaffe, Damodaran), FLM, sách, tài liệu miễn phí, YouTube, công cụ.',
  [[
    `<span class="eyebrow">FIN303 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Capital budgeting, capital structure, valuation, working capital, derivatives, M&amp;A/LBO and international finance — cited from three standard corporate finance textbooks. The official FPTU slides live on FLM; below are free, legal references.</p>
<h3>📘 Textbooks &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for FIN303 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li>Brealey, Myers &amp; Allen — <em>Principles of Corporate Finance</em></li>
<li>Ross, Westerfield &amp; Jaffe — <em>Corporate Finance</em></li>
<li>Damodaran — <em>Applied Corporate Finance</em></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://pages.stern.nyu.edu/~adamodar/" target="_blank" rel="noopener">Aswath Damodaran's NYU Stern page</a> — free valuation datasets, spreadsheets &amp; lecture notes</li>
<li><a href="https://www.investopedia.com/" target="_blank" rel="noopener">Investopedia</a> — corporate finance definitions &amp; calculators</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@khanacademy" target="_blank" rel="noopener">Khan Academy</a> — free finance &amp; valuation fundamentals</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://corporatefinanceinstitute.com/" target="_blank" rel="noopener">Corporate Finance Institute (CFI)</a> — free templates &amp; explainers (WACC, DCF, LBO)</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — TVM, NPV/IRR, WACC, MM propositions.</li>
<li><strong>Practice</strong> — rebuild the worked numeric examples from each chapter by hand.</li>
<li><strong>Go deeper</strong> — DCF valuation and an LBO model from scratch in a spreadsheet.</li>
<li><strong>Job-ready</strong> — read a real annual report and compute its WACC, FCFF and EVA.</li>
</ol></div>`,
    `<span class="eyebrow">FIN303 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Quyết định đầu tư, cấu trúc vốn, định giá, vốn lưu động, phái sinh, M&amp;A/LBO và tài chính quốc tế — trích từ ba giáo trình tài chính doanh nghiệp chuẩn. Slide chính thức FPTU nằm trên FLM; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình &amp; slide bài giảng chính thức FIN303 của FPTU nằm trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li>Brealey, Myers &amp; Allen — <em>Principles of Corporate Finance</em></li>
<li>Ross, Westerfield &amp; Jaffe — <em>Corporate Finance</em></li>
<li>Damodaran — <em>Applied Corporate Finance</em></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://pages.stern.nyu.edu/~adamodar/" target="_blank" rel="noopener">Trang NYU Stern của Aswath Damodaran</a> — dữ liệu định giá, bảng tính &amp; ghi chú bài giảng miễn phí</li>
<li><a href="https://www.investopedia.com/" target="_blank" rel="noopener">Investopedia</a> — định nghĩa &amp; công cụ tính tài chính doanh nghiệp</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@khanacademy" target="_blank" rel="noopener">Khan Academy</a> — nền tảng tài chính &amp; định giá miễn phí</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://corporatefinanceinstitute.com/" target="_blank" rel="noopener">Corporate Finance Institute (CFI)</a> — mẫu &amp; bài giải thích miễn phí (WACC, DCF, LBO)</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — TVM, NPV/IRR, WACC, định lý MM.</li>
<li><strong>Luyện tập</strong> — tự dựng lại các ví dụ số của từng chương bằng tay.</li>
<li><strong>Đào sâu thực tế</strong> — định giá DCF và mô hình LBO từ đầu trên bảng tính.</li>
<li><strong>Sẵn sàng đi làm</strong> — đọc báo cáo thường niên thật và tính WACC, FCFF, EVA của nó.</li>
</ol></div>`,
  ]]);

const intro = doc('fin303-0-1-overview', 'Course overview: Advanced Corporate Finance|||Tổng quan: Tài chính doanh nghiệp nâng cao',
  'Từ quyết định đầu tư & cấu trúc vốn đến định giá, vốn lưu động, phái sinh, M&A/LBO và tài chính quốc tế — 8 chương, mỗi chương có ví dụ số.',
  [[
    `<span class="eyebrow">FIN303 · Lesson 0.1 · Overview</span>
<h2>Advanced Corporate Finance</h2>
<p class="lead">This course builds on introductory finance to tackle the decisions a company's CFO actually makes: how to value long-term investments and the whole firm, how much debt versus equity to raise, what to do with excess cash, how to manage day-to-day liquidity, how to hedge risk with derivatives, and how to structure a merger or a leveraged buyout.</p>
<h3>Roadmap</h3>
<ul>
<li><strong>Ch.1-2</strong> — capital budgeting (NPV/IRR/MIRR) and cost of capital &amp; capital structure (WACC, Modigliani-Miller).</li>
<li><strong>Ch.3-4</strong> — dividend policy &amp; buybacks; business valuation (DCF, multiples, APV).</li>
<li><strong>Ch.5-6</strong> — working capital &amp; short-term financing; derivatives &amp; risk management.</li>
<li><strong>Ch.7-8</strong> — M&amp;A/LBO/restructuring; international finance &amp; value-based management (EVA).</li>
</ul>
<p>Every chapter follows the same logic: what value is, how to measure it, and how a real financial decision moves it — with worked numeric examples throughout (all figures illustrative).</p>`,
    `<span class="eyebrow">FIN303 · Bài 0.1 · Tổng quan</span>
<h2>Tài chính doanh nghiệp nâng cao</h2>
<p class="lead">Môn này xây trên nền tài chính nhập môn để giải quyết các quyết định mà CFO thực sự đưa ra: định giá đầu tư dài hạn và cả doanh nghiệp, huy động bao nhiêu nợ so với vốn cổ phần, làm gì với tiền mặt dư, quản trị thanh khoản hàng ngày, phòng vệ rủi ro bằng phái sinh, và cấu trúc một thương vụ M&amp;A hay LBO.</p>
<h3>Lộ trình</h3>
<ul>
<li><strong>Ch.1-2</strong> — quyết định đầu tư (NPV/IRR/MIRR) và chi phí vốn &amp; cấu trúc vốn (WACC, Modigliani-Miller).</li>
<li><strong>Ch.3-4</strong> — chính sách cổ tức &amp; mua lại cổ phiếu; định giá doanh nghiệp (DCF, bội số, APV).</li>
<li><strong>Ch.5-6</strong> — vốn lưu động &amp; tài trợ ngắn hạn; phái sinh &amp; quản trị rủi ro.</li>
<li><strong>Ch.7-8</strong> — M&amp;A/LBO/tái cấu trúc; tài chính quốc tế &amp; quản trị theo giá trị (EVA).</li>
</ul>
<p>Mỗi chương theo cùng một mạch: giá trị là gì, đo bằng cách nào, và một quyết định tài chính thực tế làm nó thay đổi thế nào — kèm ví dụ số tính toán xuyên suốt (mọi số liệu là giả định).</p>`,
  ]]);

const c1 = doc('fin303-1-1-tvm-capital-budgeting', '1.1 — TVM review & advanced capital budgeting|||1.1 — Ôn giá trị thời gian của tiền & quyết định đầu tư',
  'PV, niên kim, vĩnh viễn; quy tắc NPV/IRR/payback/MIRR; ví dụ so sánh dự án loại trừ nhau.',
  [[
    `<span class="eyebrow">FIN303 · Chapter 1 · Lesson 1.1</span>
<h2>TVM review &amp; advanced capital budgeting</h2>
<h3>Time value of money, fast</h3>
<ul>
<li><strong>Present value:</strong> PV = CF / (1+r)^n — future cash discounted by the required return r.</li>
<li><strong>Annuity PV:</strong> PV = CF × [1 − (1+r)^−n] / r — a level stream of n payments.</li>
<li><strong>Perpetuity PV:</strong> PV = CF / r (growing perpetuity: PV = CF / (r − g)).</li>
</ul>
<h3>Capital budgeting decision rules</h3>
<ul>
<li><strong>NPV</strong> — sum of discounted cash flows minus the initial outlay; accept if NPV > 0. The only rule that always ranks projects correctly.</li>
<li><strong>IRR</strong> — the discount rate that makes NPV = 0; accept if IRR &gt; the required return (hurdle rate). Can give multiple or no real roots with unconventional cash flows.</li>
<li><strong>Payback / discounted payback</strong> — years to recover the investment; ignores (or under-weights) cash flows after the cutoff.</li>
<li><strong>MIRR</strong> — reinvests intermediate cash flows at the cost of capital instead of at IRR, fixing IRR's unrealistic reinvestment assumption.</li>
</ul>
<pre><code>Example (mutually exclusive projects, r = 10%):
 Project A: -1,000 today, +600 in Yr1, +600 in Yr2
  NPV = -1000 + 600/1.10 + 600/1.10^2 = -1000 + 545.45 + 495.87 = 41.32
 Project B: -1,000 today, +1,300 in Yr2 only
  NPV = -1000 + 1300/1.10^2 = -1000 + 1074.38 = 74.38
 Rule: pick B - higher NPV, even though A "pays back" in the same 2 years.
</code></pre>
<div class="callout"><span class="badge">Why NPV wins</span> IRR and payback can rank projects differently when scale or timing differs — only NPV directly measures wealth created in today's dollar.</div>`,
    `<span class="eyebrow">FIN303 · Chương 1 · Bài 1.1</span>
<h2>Ôn giá trị thời gian của tiền &amp; quyết định đầu tư nâng cao</h2>
<h3>Giá trị thời gian của tiền, tóm tắt</h3>
<ul>
<li><strong>Giá trị hiện tại (PV):</strong> PV = CF / (1+r)^n — dòng tiền tương lai chiết khấu theo tỉ suất sinh lời yêu cầu r.</li>
<li><strong>PV niên kim:</strong> PV = CF × [1 − (1+r)^−n] / r — dòng tiền đều trong n kỳ.</li>
<li><strong>PV vĩnh viễn:</strong> PV = CF / r (vĩnh viễn tăng trưởng: PV = CF / (r − g)).</li>
</ul>
<h3>Quy tắc quyết định đầu tư</h3>
<ul>
<li><strong>NPV</strong> — tổng dòng tiền chiết khấu trừ vốn đầu tư ban đầu; chấp nhận nếu NPV > 0. Quy tắc DUY NHẤT luôn xếp hạng dự án đúng.</li>
<li><strong>IRR</strong> — tỉ suất chiết khấu làm NPV = 0; chấp nhận nếu IRR &gt; tỉ suất yêu cầu (hurdle rate). Có thể cho nhiều nghiệm hoặc vô nghiệm thực với dòng tiền không thông thường.</li>
<li><strong>Thời gian hoàn vốn / hoàn vốn có chiết khấu</strong> — số năm thu hồi vốn; bỏ qua (hoặc coi nhẹ) dòng tiền sau điểm cắt.</li>
<li><strong>MIRR</strong> — tái đầu tư dòng tiền trung gian theo chi phí vốn thay vì theo IRR, sửa giả định tái đầu tư thiếu thực tế của IRR.</li>
</ul>
<pre><code>Ví dụ (2 dự án loại trừ nhau, r = 10%):
 Dự án A: -1.000 hôm nay, +600 năm 1, +600 năm 2
  NPV = -1000 + 600/1.10 + 600/1.10^2 = -1000 + 545,45 + 495,87 = 41,32
 Dự án B: -1.000 hôm nay, +1.300 chỉ ở năm 2
  NPV = -1000 + 1300/1.10^2 = -1000 + 1074,38 = 74,38
 Quy tắc: chọn B - NPV cao hơn, dù A và B đều hoàn vốn trong 2 năm.
</code></pre>
<div class="callout"><span class="badge">Vì sao NPV thắng</span> IRR và thời gian hoàn vốn có thể xếp hạng dự án khác NPV khi quy mô hoặc thời điểm dòng tiền khác nhau — chỉ NPV đo trực tiếp giá trị tạo ra bằng đồng tiền hôm nay.</div>`,
  ]]);

const c1q = quiz('fin303-quiz-1', 'Quiz 1 — TVM & capital budgeting|||Quiz 1 — TVM & quyết định đầu tư', [
  { id: 'q1', question: 'Quy tắc nào LUÔN xếp hạng dự án đúng theo giá trị tạo ra?', options: ['NPV', 'IRR', 'Thời gian hoàn vốn', 'MIRR'], correctIndex: 0, explanation: 'NPV đo trực tiếp giá trị tạo ra bằng tiền hôm nay; IRR/payback có thể xếp hạng sai khi quy mô hoặc thời điểm khác nhau.' },
  { id: 'q2', question: 'IRR là tỉ suất chiết khấu làm điều gì?', options: ['NPV = 0', 'NPV lớn nhất', 'Thời gian hoàn vốn bằng 0', 'WACC bằng 0'], correctIndex: 0, explanation: 'IRR định nghĩa là tỉ suất chiết khấu tại đó NPV của dự án bằng 0.' },
  { id: 'q3', question: 'Nhược điểm chính của thời gian hoàn vốn (payback) là gì?', options: ['Bỏ qua dòng tiền sau điểm cắt', 'Tính toán quá phức tạp', 'Không dùng được cho dự án ngắn hạn', 'Luôn cho kết quả âm'], correctIndex: 0, explanation: 'Payback chỉ đo số năm thu hồi vốn, hoàn toàn bỏ qua (hoặc coi nhẹ) giá trị dòng tiền sau điểm cắt.' },
]);

const c2 = doc('fin303-2-1-cost-of-capital-capital-structure', '2.1 — Cost of capital & capital structure (Modigliani-Miller)|||2.1 — Chi phí vốn & cấu trúc vốn (Modigliani-Miller)',
  'CAPM, WACC; MM Định lý I/II không thuế và có thuế; lá chắn thuế; lý thuyết đánh đổi.',
  [[
    `<span class="eyebrow">FIN303 · Chapter 2 · Lesson 2.1</span>
<h2>Cost of capital &amp; capital structure (Modigliani-Miller)</h2>
<h3>Cost of capital</h3>
<ul>
<li><strong>Cost of equity (CAPM):</strong> Re = Rf + β × (Rm − Rf) — the return equity holders require given systematic risk β.</li>
<li><strong>Cost of debt:</strong> Rd × (1 − Tc) — after-tax, since interest is tax-deductible.</li>
<li><strong>WACC:</strong> WACC = (E/V)×Re + (D/V)×Rd×(1−Tc) — the blended discount rate for a firm's average-risk project.</li>
</ul>
<h3>Modigliani-Miller (MM)</h3>
<ul>
<li><strong>MM Proposition I (no taxes):</strong> firm value is independent of capital structure — you can't create value by slicing the same pie differently, under perfect markets.</li>
<li><strong>MM Proposition II (no taxes):</strong> Re rises linearly with the debt-to-equity ratio, because more leverage means more equity risk — WACC stays constant.</li>
<li><strong>With corporate taxes:</strong> VL = VU + Tc × D — leverage adds value through the interest tax shield, so MM implies 100% debt is optimal... in theory.</li>
<li><strong>Trade-off theory:</strong> in reality, the tax shield is offset by rising financial distress/bankruptcy costs as leverage grows — optimal capital structure balances the two.</li>
</ul>
<pre><code>Example: Rf=4%, beta=1.2, market premium=6%, Rd=7%, Tc=20%, E/V=60%, D/V=40%
 Re = 4% + 1.2 x 6% = 11.2%
 After-tax Rd = 7% x (1-0.20) = 5.6%
 WACC = 0.60 x 11.2% + 0.40 x 5.6% = 6.72% + 2.24% = 8.96%
 VU = 10,000,000; D = 4,000,000, so tax shield value = Tc x D = 0.20 x 4,000,000 = 800,000
 VL = VU + 800,000 = 10,800,000
</code></pre>
<div class="callout"><span class="badge">Key takeaway</span> WACC is the discount rate for AVERAGE-risk projects only — using it on a riskier or safer project misprices it.</div>`,
    `<span class="eyebrow">FIN303 · Chương 2 · Bài 2.1</span>
<h2>Chi phí vốn &amp; cấu trúc vốn (Modigliani-Miller)</h2>
<h3>Chi phí vốn</h3>
<ul>
<li><strong>Chi phí vốn cổ phần (CAPM):</strong> Re = Rf + β × (Rm − Rf) — tỉ suất sinh lời cổ đông yêu cầu theo rủi ro hệ thống β.</li>
<li><strong>Chi phí nợ:</strong> Rd × (1 − Tc) — sau thuế, vì lãi vay được khấu trừ thuế.</li>
<li><strong>WACC:</strong> WACC = (E/V)×Re + (D/V)×Rd×(1−Tc) — tỉ suất chiết khấu bình quân cho dự án có rủi ro trung bình của công ty.</li>
</ul>
<h3>Modigliani-Miller (MM)</h3>
<ul>
<li><strong>MM Định lý I (không thuế):</strong> giá trị công ty không phụ thuộc cấu trúc vốn — không thể tạo giá trị chỉ bằng cách chia lại cùng một "miếng bánh", trong thị trường hoàn hảo.</li>
<li><strong>MM Định lý II (không thuế):</strong> Re tăng tuyến tính theo tỉ lệ nợ/vốn cổ phần, vì đòn bẩy cao hơn làm rủi ro vốn cổ phần cao hơn — WACC không đổi.</li>
<li><strong>Có thuế doanh nghiệp:</strong> VL = VU + Tc × D — đòn bẩy tạo giá trị qua lá chắn thuế lãi vay, nên MM ngụ ý 100% nợ là tối ưu... về lý thuyết.</li>
<li><strong>Lý thuyết đánh đổi (trade-off):</strong> thực tế lá chắn thuế bị bù trừ bởi chi phí kiệt quệ tài chính/phá sản tăng theo đòn bẩy — cấu trúc vốn tối ưu cân bằng hai yếu tố.</li>
</ul>
<pre><code>Ví dụ: Rf=4%, beta=1.2, phần bù thị trường=6%, Rd=7%, Tc=20%, E/V=60%, D/V=40%
 Re = 4% + 1.2 x 6% = 11,2%
 Rd sau thuế = 7% x (1-0,20) = 5,6%
 WACC = 0,60 x 11,2% + 0,40 x 5,6% = 6,72% + 2,24% = 8,96%
 VU = 10.000.000; D = 4.000.000, nên giá trị lá chắn thuế = Tc × D = 0,20 × 4.000.000 = 800.000
 VL = VU + 800.000 = 10.800.000
</code></pre>
<div class="callout"><span class="badge">Ghi nhớ</span> WACC chỉ dùng để chiết khấu dự án có rủi ro TRUNG BÌNH — dùng cho dự án rủi ro hơn hoặc an toàn hơn sẽ định giá sai.</div>`,
  ]]);

const c2q = quiz('fin303-quiz-2', 'Quiz 2 — Cost of capital & capital structure|||Quiz 2 — Chi phí vốn & cấu trúc vốn', [
  { id: 'q1', question: 'Theo CAPM, chi phí vốn cổ phần Re được tính bằng?', options: ['Rf + β×(Rm−Rf)', 'Rd×(1−Tc)', '(E/V)Re + (D/V)Rd', 'Rf − β×Rm'], correctIndex: 0, explanation: 'CAPM: Re = Rf + β×(Rm−Rf), phần bù rủi ro theo hệ số beta.' },
  { id: 'q2', question: 'MM Định lý I (không thuế) kết luận gì?', options: ['Giá trị công ty không phụ thuộc cấu trúc vốn', 'Nợ luôn tốt hơn vốn cổ phần', 'WACC giảm khi tăng nợ', 'Cổ tức làm tăng giá trị công ty'], correctIndex: 0, explanation: 'Trong thị trường hoàn hảo không thuế, giá trị công ty chỉ do tài sản/đầu tư quyết định, không do cách tài trợ.' },
  { id: 'q3', question: 'Khi có thuế doanh nghiệp, VL = VU + ?', options: ['Tc × D', 'D/E', 'Rf × D', 'WACC × D'], correctIndex: 0, explanation: 'Đòn bẩy tạo thêm giá trị bằng đúng giá trị lá chắn thuế lãi vay Tc × D.' },
]);

const c3 = doc('fin303-3-1-dividend-policy-buybacks', '3.1 — Dividend policy & share buybacks|||3.1 — Chính sách cổ tức & mua lại cổ phiếu',
  'MM cổ tức không liên quan; thuế, tín hiệu, hiệu ứng khách hàng; cổ tức so với mua lại cổ phiếu, tác động EPS.',
  [[
    `<span class="eyebrow">FIN303 · Chapter 3 · Lesson 3.1</span>
<h2>Dividend policy &amp; share buybacks</h2>
<h3>Does dividend policy matter?</h3>
<ul>
<li><strong>MM dividend irrelevance (no taxes/frictions):</strong> in perfect markets, a firm's value depends on its investment decisions, not on how it splits payout between dividends and retained earnings — investors can create their own "homemade dividends" by selling shares.</li>
<li><strong>Real-world frictions that make it matter:</strong> taxes (dividends vs capital gains taxed differently), signaling (a dividend cut is read as bad news), clientele effects (some investors need income), and agency costs (dividends discipline managers from wasting free cash flow).</li>
</ul>
<h3>Dividends vs buybacks</h3>
<ul>
<li><strong>Cash dividend</strong> — fixed commitment, cutting it signals trouble; taxed as income when received.</li>
<li><strong>Share buyback</strong> — flexible (one-off), returns cash by shrinking share count (raises EPS), lets shareholders choose whether to realize a taxable gain by selling.</li>
<li><strong>Signaling:</strong> both are read as management believing the stock is undervalued or that the firm has excess cash with no better use.</li>
</ul>
<pre><code>Example: Net income = 500,000; shares outstanding = 100,000; price = 20/share
 EPS before = 500,000 / 100,000 = 5.00
 Buyback: spend 200,000 to repurchase 200,000/20 = 10,000 shares
 Shares after = 100,000 - 10,000 = 90,000
 EPS after = 500,000 / 90,000 = 5.56 (same earnings, fewer shares, higher EPS)
</code></pre>
<div class="callout"><span class="badge">Key takeaway</span> A buyback creates no value by itself — it converts cash into higher EPS and lets shareholders pick the timing of their own tax event.</div>`,
    `<span class="eyebrow">FIN303 · Chương 3 · Bài 3.1</span>
<h2>Chính sách cổ tức &amp; mua lại cổ phiếu</h2>
<h3>Chính sách cổ tức có quan trọng không?</h3>
<ul>
<li><strong>MM cổ tức không liên quan (không thuế/không phí):</strong> trong thị trường hoàn hảo, giá trị công ty phụ thuộc quyết định đầu tư, không phụ thuộc cách chia lợi nhuận giữa cổ tức và lợi nhuận giữ lại — nhà đầu tư có thể tự tạo "cổ tức tự chế" bằng cách bán cổ phần.</li>
<li><strong>Yếu tố thực tế làm nó quan trọng:</strong> thuế (cổ tức và lãi vốn bị đánh thuế khác nhau), tín hiệu (cắt cổ tức bị đọc là tin xấu), hiệu ứng khách hàng (một số nhà đầu tư cần thu nhập đều), và chi phí đại diện (cổ tức buộc quản lý không lãng phí dòng tiền tự do).</li>
</ul>
<h3>Cổ tức so với mua lại cổ phiếu</h3>
<ul>
<li><strong>Cổ tức tiền mặt</strong> — cam kết cố định, cắt giảm phát tín hiệu xấu; bị đánh thuế thu nhập khi nhận.</li>
<li><strong>Mua lại cổ phiếu</strong> — linh hoạt (một lần), trả tiền bằng cách giảm số cổ phần (tăng EPS), để cổ đông tự chọn có bán để chịu thuế lãi vốn hay không.</li>
<li><strong>Tín hiệu:</strong> cả hai đều được đọc là quản lý tin cổ phiếu đang bị định giá thấp hoặc công ty dư tiền mặt không có chỗ dùng tốt hơn.</li>
</ul>
<pre><code>Ví dụ: Lợi nhuận thuần = 500.000; số cổ phần = 100.000; giá = 20/cổ phần
 EPS trước = 500.000 / 100.000 = 5,00
 Mua lại: chi 200.000 để mua 200.000/20 = 10.000 cổ phần
 Số cổ phần sau = 100.000 - 10.000 = 90.000
 EPS sau = 500.000 / 90.000 = 5,56 (lợi nhuận không đổi, ít cổ phần hơn, EPS cao hơn)
</code></pre>
<div class="callout"><span class="badge">Ghi nhớ</span> Mua lại cổ phiếu không tạo ra giá trị tự thân — nó chuyển tiền mặt thành EPS cao hơn và cho cổ đông quyền chọn thời điểm chịu thuế.</div>`,
  ]]);

const c3q = quiz('fin303-quiz-3', 'Quiz 3 — Dividend policy & buybacks|||Quiz 3 — Cổ tức & mua lại cổ phiếu', [
  { id: 'q1', question: 'Theo MM cổ tức không liên quan, giá trị công ty phụ thuộc vào?', options: ['Quyết định đầu tư', 'Tỉ lệ chia cổ tức', 'Giá cổ phiếu hôm nay', 'Số lượng cổ đông'], correctIndex: 0, explanation: 'MM: trong thị trường hoàn hảo, giá trị công ty do tài sản/đầu tư tạo ra, không do cách chia lợi nhuận.' },
  { id: 'q2', question: 'Mua lại cổ phiếu ảnh hưởng EPS như thế nào?', options: ['Tăng EPS vì giảm số cổ phần', 'Giảm EPS', 'Không đổi EPS', 'Chỉ ảnh hưởng cổ tức'], correctIndex: 0, explanation: 'Lợi nhuận không đổi nhưng số cổ phần giảm nên EPS = Lợi nhuận/Số cổ phần tăng lên.' },
  { id: 'q3', question: 'Cắt giảm cổ tức thường bị thị trường đọc là tín hiệu gì?', options: ['Tin xấu', 'Tin tốt', 'Không có ý nghĩa', 'Chỉ ảnh hưởng thuế'], correctIndex: 0, explanation: 'Hiệu ứng tín hiệu: nhà đầu tư đọc cắt cổ tức như dấu hiệu công ty gặp khó khăn dòng tiền.' },
]);

const c4 = doc('fin303-4-1-business-valuation', '4.1 — Business valuation: DCF, multiples & APV|||4.1 — Định giá doanh nghiệp: DCF, bội số & APV',
  'FCFF/FCFE, giá trị cuối kỳ (Gordon growth), định giá bội số, APV; ví dụ tính Enterprise Value.',
  [[
    `<span class="eyebrow">FIN303 · Chapter 4 · Lesson 4.1</span>
<h2>Business valuation: DCF, multiples &amp; APV</h2>
<h3>Discounted cash flow (DCF)</h3>
<ul>
<li><strong>FCFF (free cash flow to firm):</strong> EBIT×(1−Tc) + D&amp;A − CapEx − ΔNWC — cash available to ALL capital providers; discount at WACC to get enterprise value.</li>
<li><strong>FCFE (free cash flow to equity):</strong> FCFF − interest×(1−Tc) + net borrowing — cash left for shareholders; discount at cost of equity (Re) to get equity value directly.</li>
<li><strong>Terminal value (Gordon growth):</strong> TV at year n = FCF(n+1) / (WACC − g) — captures all cash flows beyond the explicit forecast horizon; usually the majority of total value, so g must be conservative (≤ long-run GDP growth).</li>
</ul>
<h3>Relative valuation (multiples)</h3>
<ul>
<li><strong>EV/EBITDA, P/E, P/B</strong> — value a firm by applying a comparable company's multiple to its own metric; fast and market-based, but only as good as the peer set chosen.</li>
</ul>
<h3>Adjusted present value (APV)</h3>
<ul>
<li><strong>APV = value if all-equity financed (discount FCFF at the unlevered cost of equity) + PV of financing side effects</strong> (mainly the interest tax shield). Separates the operating decision from the financing decision — useful when leverage changes over time (e.g. LBOs).</li>
</ul>
<pre><code>Example: Year-5 FCFF = 1,200,000; WACC = 9%; long-run growth g = 2.5%
 TV(Yr5) = 1,200,000 x 1.025 / (0.09 - 0.025) = 1,230,000 / 0.065 = 18,923,077
 PV of TV today (5 years, WACC 9%) = 18,923,077 / 1.09^5 = 12,296,392
 Add PV of Yr1-5 explicit FCFF, giving Enterprise Value; subtract net debt for Equity Value
</code></pre>
<div class="callout"><span class="badge">Where DCF breaks</span> Terminal value routinely drives 60-80% of a DCF's total value — a 1-point change in g or WACC can swing the valuation by double digits. Always stress-test both.</div>`,
    `<span class="eyebrow">FIN303 · Chương 4 · Bài 4.1</span>
<h2>Định giá doanh nghiệp: DCF, bội số &amp; APV</h2>
<h3>Chiết khấu dòng tiền (DCF)</h3>
<ul>
<li><strong>FCFF (dòng tiền tự do cho doanh nghiệp):</strong> EBIT×(1−Tc) + Khấu hao − CapEx − ΔVốn lưu động — tiền dành cho TẤT CẢ nhà cấp vốn; chiết khấu theo WACC ra giá trị doanh nghiệp (Enterprise Value).</li>
<li><strong>FCFE (dòng tiền tự do cho cổ phần):</strong> FCFF − lãi vay×(1−Tc) + vay mới thuần — tiền còn lại cho cổ đông; chiết khấu theo chi phí vốn cổ phần (Re) ra trực tiếp giá trị vốn cổ phần.</li>
<li><strong>Giá trị cuối kỳ (Gordon growth):</strong> TV năm n = FCF(n+1) / (WACC − g) — gói toàn bộ dòng tiền sau giai đoạn dự báo rõ; thường chiếm phần lớn tổng giá trị, nên g phải thận trọng (≤ tăng trưởng GDP dài hạn).</li>
</ul>
<h3>Định giá tương đối (bội số)</h3>
<ul>
<li><strong>EV/EBITDA, P/E, P/B</strong> — định giá công ty bằng cách áp bội số của công ty tương đồng vào chỉ số của chính nó; nhanh, dựa trên thị trường, nhưng chỉ tốt bằng nhóm so sánh được chọn.</li>
</ul>
<h3>Giá trị hiện tại điều chỉnh (APV)</h3>
<ul>
<li><strong>APV = giá trị nếu tài trợ toàn bằng vốn cổ phần (chiết khấu FCFF theo chi phí vốn cổ phần KHÔNG đòn bẩy) + PV của tác động phụ từ tài trợ</strong> (chủ yếu lá chắn thuế lãi vay). Tách quyết định vận hành khỏi quyết định tài trợ — hữu ích khi đòn bẩy thay đổi theo thời gian (ví dụ LBO).</li>
</ul>
<pre><code>Ví dụ: FCFF năm 5 = 1.200.000; WACC = 9%; tăng trưởng dài hạn g = 2,5%
 TV(năm 5) = 1.200.000 x 1,025 / (0,09 - 0,025) = 1.230.000 / 0,065 = 18.923.077
 PV của TV hôm nay (5 năm, WACC 9%) = 18.923.077 / 1,09^5 = 12.296.392
 Cộng PV của FCFF năm 1-5 ra Enterprise Value; trừ nợ thuần ra Equity Value
</code></pre>
<div class="callout"><span class="badge">Chỗ DCF dễ vỡ</span> Giá trị cuối kỳ thường chiếm 60-80% tổng giá trị DCF — g hoặc WACC lệch 1 điểm có thể làm định giá lệch hai con số. Luôn kiểm độ nhạy cả hai.</div>`,
  ]]);

const c4q = quiz('fin303-quiz-4', 'Quiz 4 — Business valuation|||Quiz 4 — Định giá doanh nghiệp', [
  { id: 'q1', question: 'FCFF được chiết khấu theo tỉ suất nào để ra giá trị doanh nghiệp?', options: ['WACC', 'Re', 'Rd', 'Rf'], correctIndex: 0, explanation: 'FCFF là dòng tiền cho TẤT CẢ nhà cấp vốn nên chiết khấu theo WACC ra Enterprise Value.' },
  { id: 'q2', question: 'Giá trị cuối kỳ (terminal value) theo Gordon growth thường chiếm bao nhiêu phần tổng giá trị DCF?', options: ['60-80%', 'Dưới 10%', 'Luôn đúng 50%', 'Không đáng kể'], correctIndex: 0, explanation: 'Terminal value thường là phần lớn nhất của tổng giá trị DCF, nên rất nhạy với g và WACC.' },
  { id: 'q3', question: 'APV tách biệt điều gì?', options: ['Quyết định vận hành và quyết định tài trợ', 'Doanh thu và chi phí', 'Nợ ngắn hạn và dài hạn', 'Thuế và khấu hao'], correctIndex: 0, explanation: 'APV cộng giá trị hoạt động (all-equity) với giá trị các tác động phụ của tài trợ (lá chắn thuế).' },
]);

const c5 = doc('fin303-5-1-working-capital-short-term-financing', '5.1 — Working capital management & short-term financing|||5.1 — Quản trị vốn lưu động & tài trợ ngắn hạn',
  'Chu kỳ chuyển đổi tiền mặt (DIO/DSO/DPO/CCC); tín dụng thương mại, hạn mức, thương phiếu, factoring.',
  [[
    `<span class="eyebrow">FIN303 · Chapter 5 · Lesson 5.1</span>
<h2>Working capital management &amp; short-term financing</h2>
<h3>The cash conversion cycle</h3>
<ul>
<li><strong>Days Inventory Outstanding (DIO)</strong> — average days inventory sits before being sold.</li>
<li><strong>Days Sales Outstanding (DSO)</strong> — average days to collect cash from customers after a sale.</li>
<li><strong>Days Payables Outstanding (DPO)</strong> — average days the firm takes to pay its own suppliers.</li>
<li><strong>Cash Conversion Cycle (CCC) = DIO + DSO − DPO</strong> — days cash is tied up in operations; shorter is better (frees cash, reduces financing need).</li>
</ul>
<h3>Short-term financing sources</h3>
<ul>
<li><strong>Trade credit</strong> — supplier-financed, often the cheapest source, but skipping an early-payment discount (e.g. "2/10 net 30") is a very expensive implicit loan.</li>
<li><strong>Line of credit / revolving credit</strong> — bank facility drawn as needed, flexible, usually secured by receivables/inventory.</li>
<li><strong>Commercial paper</strong> — unsecured short-term note issued by large, high-credit firms directly to investors — cheaper than a bank loan but only for the strongest borrowers.</li>
<li><strong>Factoring</strong> — selling receivables to a third party at a discount for immediate cash; trades margin for speed.</li>
</ul>
<pre><code>Example: DIO = 45 days, DSO = 30 days, DPO = 25 days
 CCC = 45 + 30 - 25 = 50 days
 Skipping a 2/10 net 30 discount, implicit annual rate approx
 = (2/98) x (365/(30-10)) = 0.0204 x 18.25 = 37.2% per year
</code></pre>
<div class="callout"><span class="badge">Why it matters</span> A 37%+ implicit rate on trade credit is far above almost any bank loan — taking early-payment discounts (when cash allows) is one of the highest-return, lowest-risk decisions a CFO makes.</div>`,
    `<span class="eyebrow">FIN303 · Chương 5 · Bài 5.1</span>
<h2>Quản trị vốn lưu động &amp; tài trợ ngắn hạn</h2>
<h3>Chu kỳ chuyển đổi tiền mặt</h3>
<ul>
<li><strong>Số ngày tồn kho (DIO)</strong> — số ngày trung bình hàng nằm trong kho trước khi bán.</li>
<li><strong>Số ngày thu tiền (DSO)</strong> — số ngày trung bình để thu tiền từ khách sau khi bán.</li>
<li><strong>Số ngày trả nợ nhà cung cấp (DPO)</strong> — số ngày trung bình công ty trả tiền cho nhà cung cấp của chính mình.</li>
<li><strong>Chu kỳ chuyển đổi tiền mặt (CCC) = DIO + DSO − DPO</strong> — số ngày tiền bị "kẹt" trong vận hành; càng ngắn càng tốt (giải phóng tiền, giảm nhu cầu tài trợ).</li>
</ul>
<h3>Nguồn tài trợ ngắn hạn</h3>
<ul>
<li><strong>Tín dụng thương mại</strong> — do nhà cung cấp tài trợ, thường rẻ nhất, nhưng bỏ qua chiết khấu thanh toán sớm (ví dụ "2/10 net 30") là một khoản vay ngầm rất đắt.</li>
<li><strong>Hạn mức tín dụng / tín dụng xoay vòng</strong> — hạn mức ngân hàng rút theo nhu cầu, linh hoạt, thường thế chấp bằng khoản phải thu/hàng tồn kho.</li>
<li><strong>Thương phiếu (commercial paper)</strong> — giấy nợ ngắn hạn không thế chấp do công ty lớn, tín nhiệm cao phát hành trực tiếp cho nhà đầu tư — rẻ hơn vay ngân hàng nhưng chỉ dành cho bên vay mạnh nhất.</li>
<li><strong>Bao thanh toán (factoring)</strong> — bán khoản phải thu cho bên thứ ba với giá chiết khấu để có tiền ngay; đổi biên lợi nhuận lấy tốc độ.</li>
</ul>
<pre><code>Ví dụ: DIO = 45 ngày, DSO = 30 ngày, DPO = 25 ngày
 CCC = 45 + 30 - 25 = 50 ngày
 Bỏ qua chiết khấu 2/10 net 30, lãi suất ngầm hàng năm xấp xỉ
 = (2/98) x (365/(30-10)) = 0,0204 x 18,25 = 37,2%/năm
</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Lãi ngầm 37%+ của tín dụng thương mại cao hơn hầu hết mọi khoản vay ngân hàng — tận dụng chiết khấu thanh toán sớm (khi có tiền) là một trong những quyết định lợi nhuận cao, rủi ro thấp nhất của CFO.</div>`,
  ]]);

const c5q = quiz('fin303-quiz-5', 'Quiz 5 — Working capital & short-term financing|||Quiz 5 — Vốn lưu động & tài trợ ngắn hạn', [
  { id: 'q1', question: 'Chu kỳ chuyển đổi tiền mặt (CCC) tính bằng?', options: ['DIO + DSO − DPO', 'DIO − DSO + DPO', 'DSO + DPO', 'DIO × DPO'], correctIndex: 0, explanation: 'CCC = số ngày tồn kho + số ngày thu tiền − số ngày trả nợ nhà cung cấp.' },
  { id: 'q2', question: 'Bỏ qua chiết khấu thanh toán sớm kiểu 2/10 net 30 tương đương với?', options: ['Một khoản vay ngầm rất đắt', 'Một khoản vay miễn phí', 'Tăng vốn cổ phần', 'Giảm nợ'], correctIndex: 0, explanation: 'Lãi suất ngầm khi bỏ qua chiết khấu này thường trên 30%/năm, đắt hơn hầu hết vay ngân hàng.' },
  { id: 'q3', question: 'Nguồn tài trợ ngắn hạn nào chỉ dành cho công ty tín nhiệm cao?', options: ['Thương phiếu (commercial paper)', 'Tín dụng thương mại', 'Bao thanh toán (factoring)', 'Hạn mức tín dụng'], correctIndex: 0, explanation: 'Thương phiếu không thế chấp, chỉ công ty lớn, tín nhiệm cao mới phát hành được trực tiếp cho nhà đầu tư.' },
]);

const c6 = doc('fin303-6-1-risk-management-derivatives', '6.1 — Risk management & derivatives|||6.1 — Quản trị rủi ro & phái sinh',
  'Kỳ hạn/tương lai, phòng vệ; quyền chọn (call/put), giá trị nội tại/thời gian, Black-Scholes trực giác; swap, quyền chọn thực.',
  [[
    `<span class="eyebrow">FIN303 · Chapter 6 · Lesson 6.1</span>
<h2>Risk management &amp; derivatives</h2>
<h3>Forwards, futures &amp; hedging</h3>
<ul>
<li><strong>Forward/futures contract</strong> — an obligation to buy/sell an asset at a fixed price on a future date; used to lock in a price and remove uncertainty (e.g. an exporter hedging future USD receipts).</li>
<li><strong>Hedging</strong> — taking a derivative position that offsets an existing exposure; reduces the variance of cash flows, not necessarily the expected value.</li>
</ul>
<h3>Options</h3>
<ul>
<li><strong>Call option</strong> — the right (not obligation) to BUY an asset at the strike price K; payoff at expiry = max(S − K, 0).</li>
<li><strong>Put option</strong> — the right to SELL at K; payoff = max(K − S, 0).</li>
<li><strong>Intrinsic vs time value</strong> — an option's premium = intrinsic value (payoff if exercised now) + time value (chance it becomes more valuable before expiry).</li>
<li><strong>Black-Scholes (intuition, not derivation):</strong> option value rises with volatility, time to expiry, and how far in-the-money the option is expected to be — five inputs drive it: spot price, strike, volatility, time, risk-free rate.</li>
</ul>
<h3>Corporate uses</h3>
<ul>
<li><strong>Interest-rate swap</strong> — exchange fixed for floating interest payments; a firm expecting rates to rise can swap floating debt into fixed.</li>
<li><strong>Real options</strong> — the option to expand, delay, or abandon a project embedded in capital budgeting decisions; standard NPV undervalues flexible projects.</li>
</ul>
<pre><code>Example: call option, strike K = 50, current price S = 58, premium paid = 12
 Payoff at expiry = max(S - K, 0) = max(58-50, 0) = 8
 Profit = payoff - premium = 8 - 12 = -4 (loses money even though the call finished in-the-money)
</code></pre>
<div class="callout"><span class="badge">Common trap</span> "In-the-money" only means payoff > 0 — it says nothing about whether the position is profitable once the premium already paid is counted.</div>`,
    `<span class="eyebrow">FIN303 · Chương 6 · Bài 6.1</span>
<h2>Quản trị rủi ro &amp; phái sinh</h2>
<h3>Hợp đồng kỳ hạn/tương lai &amp; phòng vệ (hedging)</h3>
<ul>
<li><strong>Hợp đồng kỳ hạn/tương lai (forward/futures)</strong> — nghĩa vụ mua/bán một tài sản với giá cố định vào ngày trong tương lai; dùng để chốt giá và loại bỏ rủi ro biến động (ví dụ nhà xuất khẩu phòng vệ khoản thu USD tương lai).</li>
<li><strong>Phòng vệ (hedging)</strong> — mở vị thế phái sinh để bù trừ rủi ro đang có sẵn; giảm phương sai của dòng tiền, không nhất thiết làm tăng giá trị kỳ vọng.</li>
</ul>
<h3>Quyền chọn (options)</h3>
<ul>
<li><strong>Quyền chọn mua (call)</strong> — quyền (không phải nghĩa vụ) MUA tài sản với giá thực hiện K; giá trị đáo hạn = max(S − K, 0).</li>
<li><strong>Quyền chọn bán (put)</strong> — quyền BÁN với giá K; giá trị = max(K − S, 0).</li>
<li><strong>Giá trị nội tại và giá trị thời gian</strong> — phí quyền chọn = giá trị nội tại (giá trị nếu thực hiện ngay) + giá trị thời gian (khả năng còn tăng giá trị trước khi đáo hạn).</li>
<li><strong>Black-Scholes (trực giác, không đi vào chứng minh):</strong> giá trị quyền chọn tăng theo độ bất định (volatility), thời gian còn lại, và mức "trong tiền" kỳ vọng — năm biến số chi phối: giá hiện tại, giá thực hiện, độ bất định, thời gian, lãi suất không rủi ro.</li>
</ul>
<h3>Ứng dụng doanh nghiệp</h3>
<ul>
<li><strong>Hoán đổi lãi suất (swap)</strong> — đổi dòng lãi cố định lấy lãi thả nổi; công ty dự đoán lãi suất tăng có thể đổi nợ thả nổi sang cố định.</li>
<li><strong>Quyền chọn thực (real options)</strong> — quyền mở rộng, trì hoãn hoặc từ bỏ dự án ẩn trong quyết định đầu tư; NPV chuẩn định giá thấp các dự án linh hoạt.</li>
</ul>
<pre><code>Ví dụ: quyền chọn mua, giá thực hiện K = 50, giá hiện tại S = 58, phí đã trả = 12
 Giá trị đáo hạn = max(S - K, 0) = max(58-50, 0) = 8
 Lợi nhuận = giá trị - phí = 8 - 12 = -4 (vẫn lỗ dù quyền chọn kết thúc trong tiền)
</code></pre>
<div class="callout"><span class="badge">Bẫy thường gặp</span> "Trong tiền" chỉ nghĩa là giá trị đáo hạn > 0 — không nói gì về việc vị thế có lãi hay không khi tính cả phí đã trả.</div>`,
  ]]);

const c6q = quiz('fin303-quiz-6', 'Quiz 6 — Risk management & derivatives|||Quiz 6 — Quản trị rủi ro & phái sinh', [
  { id: 'q1', question: 'Giá trị đáo hạn của quyền chọn mua (call) là?', options: ['max(S − K, 0)', 'max(K − S, 0)', 'S − K luôn dương', 'K / S'], correctIndex: 0, explanation: 'Call cho quyền MUA ở giá K, nên chỉ có lãi khi S > K, giá trị = max(S−K,0).' },
  { id: 'q2', question: 'Hedging chủ yếu làm gì với dòng tiền?', options: ['Giảm phương sai', 'Tăng giá trị kỳ vọng', 'Loại bỏ hoàn toàn rủi ro kinh doanh', 'Tăng đòn bẩy'], correctIndex: 0, explanation: 'Hedging bù trừ rủi ro sẵn có, làm dòng tiền ổn định hơn (giảm phương sai), không nhất thiết tăng giá trị kỳ vọng.' },
  { id: 'q3', question: '"Trong tiền" (in-the-money) của quyền chọn có nghĩa là?', options: ['Giá trị đáo hạn > 0', 'Vị thế chắc chắn có lãi', 'Phí quyền chọn bằng 0', 'Hợp đồng đã hết hạn'], correctIndex: 0, explanation: 'Trong tiền chỉ nói giá trị thực hiện dương; có lãi thật hay không còn phụ thuộc phí đã trả.' },
]);

const c7 = doc('fin303-7-1-ma-restructuring-lbo', '7.1 — M&A, restructuring & LBO|||7.1 — M&A, tái cấu trúc & LBO',
  'Sáp nhập ngang/dọc/tập đoàn; giá trị hợp lực & premium tối đa; cơ chế LBO và ba đòn bẩy lợi nhuận.',
  [[
    `<span class="eyebrow">FIN303 · Chapter 7 · Lesson 7.1</span>
<h2>M&amp;A, restructuring &amp; LBO</h2>
<h3>Types of combinations</h3>
<ul>
<li><strong>Horizontal merger</strong> — combining direct competitors (market power, cost synergies via scale).</li>
<li><strong>Vertical merger</strong> — combining a firm with its supplier or customer (control the supply chain).</li>
<li><strong>Conglomerate merger</strong> — unrelated businesses (diversification — usually the weakest rationale, since shareholders can diversify on their own more cheaply).</li>
</ul>
<h3>Valuing a deal</h3>
<ul>
<li><strong>Synergy value = V(combined) − V(acquirer) − V(target)</strong> — the only economic justification for paying a premium; must come from real revenue growth or cost savings, not from wishful thinking.</li>
<li><strong>Maximum premium</strong> a rational acquirer should pay = estimated synergies, otherwise the deal destroys value for the acquirer's own shareholders even if the target's shareholders win.</li>
</ul>
<h3>Leveraged buyout (LBO)</h3>
<ul>
<li><strong>Mechanics:</strong> a private equity sponsor buys a company using mostly debt (often 60-80% of the price), the target's own future cash flows service and repay that debt, and the sponsor exits (IPO or sale) after paying down leverage and (hopefully) growing EBITDA.</li>
<li><strong>Returns driver:</strong> equity return comes from three levers — EBITDA growth, multiple expansion at exit, and debt paydown ("deleveraging") — not just operational improvement.</li>
</ul>
<pre><code>Example LBO: purchase price = 100,000,000 (8x EBITDA of 12,500,000)
 Debt = 70,000,000 (70%); Sponsor equity = 30,000,000
 Year 5: EBITDA grows to 16,000,000; exit multiple still 8x, so exit EV = 128,000,000
 Debt paid down to 30,000,000, so exit equity value = 128,000,000 - 30,000,000 = 98,000,000
 Sponsor return = 98,000,000 / 30,000,000 = 3.27x over 5 years (approx 26.7% IRR)
</code></pre>
<div class="callout"><span class="badge">Why leverage helps returns</span> The SAME EBITDA growth produces a much higher equity return under high leverage than under an all-equity purchase — leverage magnifies both gains and losses.</div>`,
    `<span class="eyebrow">FIN303 · Chương 7 · Bài 7.1</span>
<h2>M&amp;A, tái cấu trúc &amp; LBO</h2>
<h3>Các dạng sáp nhập</h3>
<ul>
<li><strong>Sáp nhập ngang (horizontal)</strong> — hợp nhất đối thủ trực tiếp (quyền lực thị trường, hợp lực chi phí nhờ quy mô).</li>
<li><strong>Sáp nhập dọc (vertical)</strong> — hợp nhất công ty với nhà cung cấp hoặc khách hàng của mình (kiểm soát chuỗi cung ứng).</li>
<li><strong>Sáp nhập tập đoàn (conglomerate)</strong> — ngành nghề không liên quan (đa dạng hoá — thường là lý do yếu nhất, vì cổ đông có thể tự đa dạng hoá rẻ hơn).</li>
</ul>
<h3>Định giá một thương vụ</h3>
<ul>
<li><strong>Giá trị hợp lực (synergy) = V(sau hợp nhất) − V(bên mua) − V(bên bán)</strong> — lý do kinh tế duy nhất để trả giá cao hơn thị trường (premium); phải đến từ tăng trưởng doanh thu hoặc tiết kiệm chi phí thật, không phải kỳ vọng suông.</li>
<li><strong>Mức premium tối đa</strong> bên mua hợp lý nên trả = hợp lực ước tính, nếu không thương vụ phá giá trị của chính cổ đông bên mua dù cổ đông bên bán có lợi.</li>
</ul>
<h3>Mua lại bằng vốn vay (LBO)</h3>
<ul>
<li><strong>Cơ chế:</strong> quỹ đầu tư tư nhân mua công ty chủ yếu bằng nợ (thường 60-80% giá mua), dòng tiền tương lai của chính công ty trả nợ đó, và quỹ thoái vốn (IPO hoặc bán) sau khi giảm nợ và (kỳ vọng) tăng EBITDA.</li>
<li><strong>Động lực lợi nhuận:</strong> lợi nhuận vốn cổ phần đến từ ba đòn bẩy — tăng trưởng EBITDA, mở rộng bội số lúc thoái vốn, và trả bớt nợ ("deleveraging") — không chỉ cải thiện vận hành.</li>
</ul>
<pre><code>Ví dụ LBO: giá mua = 100.000.000 (8 lần EBITDA 12.500.000)
 Nợ = 70.000.000 (70%); Vốn cổ phần quỹ = 30.000.000
 Năm 5: EBITDA tăng lên 16.000.000; bội số thoái vốn vẫn 8x, nên EV lúc thoái = 128.000.000
 Nợ giảm còn 30.000.000, nên giá trị vốn cổ phần lúc thoái = 128.000.000 - 30.000.000 = 98.000.000
 Lợi nhuận quỹ = 98.000.000 / 30.000.000 = 3,27x trong 5 năm (xấp xỉ IRR 26,7%)
</code></pre>
<div class="callout"><span class="badge">Vì sao đòn bẩy tăng lợi nhuận</span> CÙNG một mức tăng trưởng EBITDA tạo ra lợi nhuận vốn cổ phần cao hơn nhiều khi dùng đòn bẩy cao so với mua toàn bằng vốn cổ phần — đòn bẩy khuếch đại cả lãi và lỗ.</div>`,
  ]]);

const c7q = quiz('fin303-quiz-7', 'Quiz 7 — M&A, restructuring & LBO|||Quiz 7 — M&A, tái cấu trúc & LBO', [
  { id: 'q1', question: 'Giá trị hợp lực (synergy) trong M&A được tính bằng?', options: ['V(sau hợp nhất) − V(bên mua) − V(bên bán)', 'V(bên mua) + V(bên bán)', 'Giá mua − giá trị sổ sách', 'Premium × số cổ phần'], correctIndex: 0, explanation: 'Synergy là phần giá trị VƯỢT THÊM so với tổng giá trị hai công ty đứng riêng.' },
  { id: 'q2', question: 'Trong LBO, ai chủ yếu trả nợ mua công ty?', options: ['Dòng tiền tương lai của chính công ty mục tiêu', 'Quỹ đầu tư tư nhân bằng tiền riêng', 'Ngân hàng trung ương', 'Cổ đông cũ của công ty mục tiêu'], correctIndex: 0, explanation: 'Đặc trưng của LBO: nợ mua công ty được trả bằng chính dòng tiền tương lai mà công ty mục tiêu tạo ra.' },
  { id: 'q3', question: 'Đòn bẩy cao trong LBO ảnh hưởng lợi nhuận vốn cổ phần thế nào?', options: ['Khuếch đại cả lãi và lỗ', 'Luôn tăng lợi nhuận chắc chắn', 'Không ảnh hưởng', 'Chỉ giảm rủi ro'], correctIndex: 0, explanation: 'Đòn bẩy là con dao hai lưỡi — cùng một thay đổi EBITDA tạo biến động lợi nhuận vốn cổ phần lớn hơn nhiều.' },
]);

const c8 = doc('fin303-8-1-international-finance-eva', '8.1 — International finance & value-based management (EVA)|||8.1 — Tài chính quốc tế & quản trị theo giá trị (EVA)',
  'Rủi ro giao dịch/chuyển đổi/kinh tế, ngang giá lãi suất; EVA = NOPAT − Vốn đầu tư×WACC.',
  [[
    `<span class="eyebrow">FIN303 · Chapter 8 · Lesson 8.1</span>
<h2>International finance &amp; value-based management (EVA)</h2>
<h3>Exchange rate risk</h3>
<ul>
<li><strong>Transaction exposure</strong> — a specific contracted foreign-currency cash flow (an invoice, a loan) whose home-currency value moves with the exchange rate; hedge with forwards, futures, or options.</li>
<li><strong>Translation exposure</strong> — consolidating a foreign subsidiary's financial statements into the parent's reporting currency changes reported (not cash) value as rates move.</li>
<li><strong>Economic exposure</strong> — a firm's competitive position and long-run cash flows shift with exchange rates even without a specific contract (e.g. an exporter losing price competitiveness when the home currency strengthens).</li>
<li><strong>Interest rate parity (intuition):</strong> the forward exchange rate reflects the interest-rate differential between two currencies — otherwise a riskless arbitrage would exist.</li>
</ul>
<h3>Value-based management: EVA</h3>
<ul>
<li><strong>Economic Value Added (EVA) = NOPAT − (Invested Capital × WACC)</strong> — profit only counts as VALUE CREATED once it exceeds the dollar cost of ALL capital employed, not just accounting profit (which ignores the cost of equity).</li>
<li><strong>Why it matters:</strong> a division can be accounting-profitable and still be destroying value if its return on capital is below its WACC — EVA makes that visible and is often used to tie manager compensation to genuine value creation.</li>
</ul>
<pre><code>Example: NOPAT = 2,400,000; Invested Capital = 20,000,000; WACC = 9%
 Capital charge = 20,000,000 x 0.09 = 1,800,000
 EVA = 2,400,000 - 1,800,000 = 600,000 (value created, even though NOPAT alone looked fine either way)
</code></pre>
<div class="callout"><span class="badge">Global + value lens</span> A foreign division can report a healthy local profit that still destroys parent-company value once its cost of capital AND currency risk are both priced in.</div>`,
    `<span class="eyebrow">FIN303 · Chương 8 · Bài 8.1</span>
<h2>Tài chính quốc tế &amp; quản trị giá trị doanh nghiệp (EVA)</h2>
<h3>Rủi ro tỉ giá</h3>
<ul>
<li><strong>Rủi ro giao dịch (transaction exposure)</strong> — một dòng tiền ngoại tệ đã ký hợp đồng cụ thể (hoá đơn, khoản vay) mà giá trị theo nội tệ biến động theo tỉ giá; phòng vệ bằng kỳ hạn, tương lai hoặc quyền chọn.</li>
<li><strong>Rủi ro chuyển đổi (translation exposure)</strong> — hợp nhất báo cáo tài chính của công ty con nước ngoài vào đồng tiền báo cáo của công ty mẹ làm giá trị SỔ SÁCH (không phải tiền mặt thật) thay đổi theo tỉ giá.</li>
<li><strong>Rủi ro kinh tế (economic exposure)</strong> — vị thế cạnh tranh và dòng tiền dài hạn của công ty thay đổi theo tỉ giá dù không có hợp đồng cụ thể (ví dụ nhà xuất khẩu mất lợi thế giá khi nội tệ mạnh lên).</li>
<li><strong>Ngang giá lãi suất (trực giác):</strong> tỉ giá kỳ hạn phản ánh chênh lệch lãi suất giữa hai đồng tiền — nếu không sẽ có cơ hội arbitrage không rủi ro.</li>
</ul>
<h3>Quản trị theo giá trị: EVA</h3>
<ul>
<li><strong>Giá trị kinh tế gia tăng (EVA) = NOPAT − (Vốn đầu tư × WACC)</strong> — lợi nhuận chỉ được tính là GIÁ TRỊ TẠO RA khi vượt quá chi phí bằng tiền của TOÀN BỘ vốn sử dụng, không chỉ lợi nhuận kế toán (thứ bỏ qua chi phí vốn cổ phần).</li>
<li><strong>Vì sao quan trọng:</strong> một bộ phận có thể có lãi kế toán mà vẫn đang phá giá trị nếu tỉ suất sinh lời trên vốn thấp hơn WACC — EVA làm điều đó hiện rõ và thường được dùng để gắn lương quản lý với giá trị tạo ra thật.</li>
</ul>
<pre><code>Ví dụ: NOPAT = 2.400.000; Vốn đầu tư = 20.000.000; WACC = 9%
 Chi phí vốn = 20.000.000 x 0,09 = 1.800.000
 EVA = 2.400.000 - 1.800.000 = 600.000 (giá trị được tạo ra, dù NOPAT riêng lẻ nhìn vẫn ổn)
</code></pre>
<div class="callout"><span class="badge">Lăng kính toàn cầu + giá trị</span> Một bộ phận nước ngoài có thể báo lãi nội địa tốt mà vẫn phá giá trị công ty mẹ khi tính cả chi phí vốn VÀ rủi ro tỉ giá.</div>`,
  ]]);

const c8q = quiz('fin303-quiz-8', 'Quiz 8 — International finance & EVA|||Quiz 8 — Tài chính quốc tế & EVA', [
  { id: 'q1', question: 'EVA được tính bằng?', options: ['NOPAT − (Vốn đầu tư × WACC)', 'NOPAT − Chi phí lãi vay', 'Doanh thu − Chi phí', 'NOPAT × WACC'], correctIndex: 0, explanation: 'EVA trừ đi chi phí bằng tiền của toàn bộ vốn sử dụng (Vốn đầu tư × WACC) khỏi lợi nhuận hoạt động sau thuế.' },
  { id: 'q2', question: 'Rủi ro tỉ giá khi hợp nhất báo cáo tài chính công ty con nước ngoài gọi là?', options: ['Rủi ro chuyển đổi', 'Rủi ro giao dịch', 'Rủi ro kinh tế', 'Rủi ro lãi suất'], correctIndex: 0, explanation: 'Translation exposure phát sinh khi hợp nhất báo cáo tài chính công ty con nước ngoài, chỉ ảnh hưởng giá trị sổ sách.' },
  { id: 'q3', question: 'EVA dương có nghĩa là?', options: ['Lợi nhuận vượt chi phí vốn sử dụng, tạo giá trị thật', 'Công ty không có nợ', 'Lợi nhuận kế toán dương', 'WACC bằng 0'], correctIndex: 0, explanation: 'EVA dương nghĩa là tỉ suất sinh lời trên vốn cao hơn WACC — công ty thực sự tạo thêm giá trị.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'FIN303',
    slug: 'fin303-advanced-corporate-finance',
    title: 'Advanced Corporate Finance',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/FIN303.webp',
    shortDescription: 'Advanced corporate finance: capital budgeting, cost of capital & capital structure (MM), dividends & buybacks, valuation (DCF/APV), working capital, derivatives, M&A/LBO, international finance & EVA. Bilingual, worked examples & quizzes.|||Tài chính DN nâng cao: quyết định đầu tư, chi phí vốn & cấu trúc vốn (MM), cổ tức & mua lại cổ phiếu, định giá (DCF/APV), vốn lưu động, phái sinh, M&A/LBO, tài chính quốc tế & EVA. Song ngữ, có ví dụ & quiz.',
    description: 'Môn <strong>FIN303 — Advanced Corporate Finance</strong> (kỳ 3) đi sâu vào các quyết định tài chính doanh nghiệp cấp cao: <strong>quyết định đầu tư</strong> (NPV/IRR/MIRR) → <strong>chi phí vốn &amp; cấu trúc vốn</strong> (WACC, Modigliani-Miller) → <strong>chính sách cổ tức &amp; mua lại cổ phiếu</strong> → <strong>định giá doanh nghiệp</strong> (DCF, bội số, APV) → <strong>vốn lưu động &amp; tài trợ ngắn hạn</strong> → <strong>phái sinh &amp; quản trị rủi ro</strong> → <strong>M&amp;A, tái cấu trúc &amp; LBO</strong> → <strong>tài chính quốc tế &amp; EVA</strong>. Trích dẫn từ Brealey/Myers/Allen, Ross/Westerfield/Jaffe, Damodaran; song ngữ, có ví dụ tính toán (số liệu giả định) và quiz mỗi chương.',
    whatYouLearn: 'NPV/IRR/MIRR & payback; CAPM & WACC; MM Định lý I/II (có/không thuế), lá chắn thuế, lý thuyết đánh đổi; cổ tức vs mua lại cổ phiếu, tín hiệu; DCF (FCFF/FCFE), giá trị cuối kỳ, bội số, APV; chu kỳ chuyển đổi tiền mặt & tài trợ ngắn hạn; quyền chọn, hedging, Black-Scholes trực giác; M&A, synergy, cơ chế LBO; rủi ro tỉ giá, EVA.',
    requirements: 'Đã học tài chính doanh nghiệp nhập môn (kế toán tài chính, nguyên lý tài chính). Xem điều kiện tiên quyết chính thức trong khung chương trình khối Quản trị Kinh doanh trên FLM.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Ba giáo trình chuẩn, FLM, sách, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Lộ trình 8 chương tài chính doanh nghiệp nâng cao.', lessons: [intro] },
    { title: 'Chương 1 — TVM & quyết định đầu tư|||Chapter 1 — TVM & capital budgeting', description: 'NPV, IRR, payback, MIRR.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Chi phí vốn & cấu trúc vốn|||Chapter 2 — Cost of capital & capital structure', description: 'CAPM, WACC, Modigliani-Miller.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Chính sách cổ tức & mua lại cổ phiếu|||Chapter 3 — Dividend policy & buybacks', description: 'MM cổ tức, tín hiệu, EPS.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Định giá doanh nghiệp|||Chapter 4 — Business valuation', description: 'DCF, bội số, APV.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Vốn lưu động & tài trợ ngắn hạn|||Chapter 5 — Working capital & short-term financing', description: 'CCC, tín dụng thương mại, thương phiếu.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Quản trị rủi ro & phái sinh|||Chapter 6 — Risk management & derivatives', description: 'Options, futures, hedging.', lessons: [c6, c6q] },
    { title: 'Chương 7 — M&A, tái cấu trúc & LBO|||Chapter 7 — M&A, restructuring & LBO', description: 'Synergy, cơ chế LBO.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Tài chính quốc tế & EVA|||Chapter 8 — International finance & EVA', description: 'Rủi ro tỉ giá, EVA.', lessons: [c8, c8q] },
  ],
};
