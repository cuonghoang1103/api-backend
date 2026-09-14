/**
 * FRM301 — Applied Financial Modeling and Risk Management. Khối Quản trị Kinh
 * doanh (BBA), FPTU, Kỳ 7. HƯỚNG DỰ ÁN THỰC TẾ (case-based/capstone-lite):
 * 8 chương = 8 bước dựng một mô hình tài chính hoàn chỉnh trên case công ty
 * giả định, từ thu thập dữ liệu đến báo cáo khuyến nghị đầu tư. Phân biệt
 * FMR301 (lý thuyết tích hợp rủi ro), FMS301 (mô phỏng), FIM302c (cơ bản).
 * Giáo trình trích dẫn: Pignataro "Financial Modeling and Valuation";
 * Benninga; Damodaran "Investment Valuation". KHÔNG upload PDF.
 * Giữ NGUYÊN slug/semester/courseCode/thumbnailUrl. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('frm301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách tham khảo (Pignataro, Benninga, Damodaran), tài liệu miễn phí, YouTube, công cụ Excel, lộ trình tự học.',
  [[
    `<span class="eyebrow">FRM301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to build a real financial model — from historical statements to a valuation and risk report — in one place. The official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal references used by practitioners.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for FRM301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li>Paul Pignataro — <em>Financial Modeling and Valuation: A Practical Guide to Investment Banking and Private Equity</em> (the step-by-step build this course follows: history → drivers → DCF → sensitivity).</li>
<li>Simon Benninga — <em>Financial Modeling</em> (spreadsheet mechanics, corporate &amp; project models).</li>
<li>Aswath Damodaran — <em>Investment Valuation: Tools and Techniques for Determining the Value of Any Asset</em> (DCF theory, multiples, terminal value).</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://pages.stern.nyu.edu/~adamodar/" target="_blank" rel="noopener">Damodaran Online (NYU Stern)</a> — free datasets (industry betas, margins, multiples), spreadsheets, valuation notes.</li>
<li><a href="https://corporatefinanceinstitute.com/resources/financial-modeling/" target="_blank" rel="noopener">Corporate Finance Institute — Financial Modeling resources</a>.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@AswathDamodaranonValuation" target="_blank" rel="noopener">Aswath Damodaran</a> — full valuation lectures, live company walk-throughs.</li>
<li><a href="https://www.youtube.com/@CorporateFinanceInstitute" target="_blank" rel="noopener">Corporate Finance Institute</a> — modeling &amp; Excel technique videos.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><strong>Excel or Google Sheets</strong> — the model itself; no add-in required.</li>
<li>Public financial statements of a listed company (annual report / 20-F / báo cáo tài chính đã kiểm toán) as your case data source.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Pick a real company</strong> with 3–5 years of public financials — the entire course builds one model on it.</li>
<li><strong>Follow the 8 steps in order</strong> — each chapter's output feeds the next; skipping steps breaks the model.</li>
<li><strong>Rebuild, don't just read</strong> — type every formula yourself once; muscle memory is what a model-audit interview actually tests.</li>
<li><strong>Finish with the report</strong> — a model nobody can read is a model nobody trusts.</li>
</ol></div>`,
    `<span class="eyebrow">FRM301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để dựng một mô hình tài chính thật — từ báo cáo lịch sử đến báo cáo định giá &amp; rủi ro — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là tài liệu tham khảo miễn phí, hợp pháp mà người làm nghề vẫn dùng.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của FRM301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li>Paul Pignataro — <em>Financial Modeling and Valuation: A Practical Guide to Investment Banking and Private Equity</em> (đúng trình tự dựng mà môn theo: lịch sử → driver → DCF → độ nhạy).</li>
<li>Simon Benninga — <em>Financial Modeling</em> (kỹ thuật bảng tính, mô hình doanh nghiệp &amp; dự án).</li>
<li>Aswath Damodaran — <em>Investment Valuation: Tools and Techniques for Determining the Value of Any Asset</em> (lý thuyết DCF, bội số, giá trị cuối kỳ).</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://pages.stern.nyu.edu/~adamodar/" target="_blank" rel="noopener">Damodaran Online (NYU Stern)</a> — dữ liệu miễn phí (beta ngành, biên lợi nhuận, bội số), bảng tính mẫu, ghi chú định giá.</li>
<li><a href="https://corporatefinanceinstitute.com/resources/financial-modeling/" target="_blank" rel="noopener">Corporate Finance Institute — tài nguyên Financial Modeling</a>.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@AswathDamodaranonValuation" target="_blank" rel="noopener">Aswath Damodaran</a> — bài giảng định giá đầy đủ, dựng mô hình trên công ty thật.</li>
<li><a href="https://www.youtube.com/@CorporateFinanceInstitute" target="_blank" rel="noopener">Corporate Finance Institute</a> — video kỹ thuật mô hình &amp; Excel.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><strong>Excel hoặc Google Sheets</strong> — chính là mô hình; không cần add-in.</li>
<li>Báo cáo tài chính công khai của một công ty niêm yết (báo cáo thường niên / BCTC đã kiểm toán) làm dữ liệu case.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Chọn một công ty thật</strong> có 3–5 năm BCTC công khai — cả môn dựng một mô hình duy nhất trên công ty đó.</li>
<li><strong>Theo đúng thứ tự 8 bước</strong> — đầu ra mỗi chương là đầu vào chương sau; bỏ bước là gãy mô hình.</li>
<li><strong>Tự dựng lại, không chỉ đọc</strong> — tự gõ từng công thức một lần; đó là phản xạ mà câu hỏi "audit mô hình" khi phỏng vấn thật sự kiểm.</li>
<li><strong>Kết bằng báo cáo</strong> — mô hình không ai đọc hiểu được là mô hình không ai tin.</li>
</ol></div>`,
  ]]);

const intro = doc('frm301-0-1-overview', 'Course overview: Applied Financial Modeling and Risk Management|||Tổng quan: Mô hình hoá tài chính và Quản trị rủi ro ứng dụng',
  'Môn học theo DỰ ÁN: dựng một mô hình tài chính hoàn chỉnh trên một công ty case, từ thu thập dữ liệu đến báo cáo khuyến nghị đầu tư, qua 8 bước. Phân biệt với FMR301/FMS301/FIM302c.',
  [[
    `<span class="eyebrow">FRM301 · Lesson 0.1 · Overview</span>
<h2>Applied Financial Modeling &amp; Risk Management</h2>
<p class="lead">This is a <strong>project-based</strong> course. Instead of studying modeling theory in isolation, you build <strong>one real financial model, end to end, on one real company</strong> — the same case follows you from Chapter 1 to Chapter 8. Each chapter is a step in that build; each chapter's output is the next chapter's input.</p>
<h3>How this differs from related courses</h3>
<ul>
<li><strong>FMR301</strong> teaches integrated risk-management <em>theory</em> (frameworks, standards) — this course applies it inside one working model instead.</li>
<li><strong>FMS301</strong> focuses on <em>simulation</em> techniques (Monte Carlo, stochastic processes) as a subject in itself — here, simulation-style thinking (scenarios, sensitivity) is one step among eight, in service of a valuation.</li>
<li><strong>FIM302c</strong> covers the <em>basics</em> of financial modeling (mechanics, formulas) — this course assumes that foundation and spends its time on judgment: which drivers matter, which risks matter, what to recommend.</li>
</ul>
<h3>The 8-step build</h3>
<ol>
<li><strong>Problem definition &amp; data collection</strong> — what question is the model answering, and where the real numbers come from.</li>
<li><strong>Historical financial statement modeling</strong> — rebuild 3–5 years of income statement, balance sheet, cash flow, linked and checked.</li>
<li><strong>Forecasting &amp; driver assumptions</strong> — turn history into a forward forecast via explicit, defensible drivers.</li>
<li><strong>Valuation modeling</strong> — DCF and trading multiples, triangulated.</li>
<li><strong>Risk analysis integration</strong> — sensitivity and scenario analysis on the valuation's key drivers.</li>
<li><strong>Model testing &amp; validation</strong> — the model audit: does it balance, does it break under stress, is it trustworthy.</li>
<li><strong>Visualization &amp; dashboard</strong> — turn the model into a one-page picture decision-makers can actually read.</li>
<li><strong>Report &amp; recommendation</strong> — write and present the investment case a reader has to be able to act on.</li>
</ol>
<div class="callout"><span class="badge">Case company</span> Pick one real, publicly-listed company with 3–5 years of audited financials before Chapter 1. Every chapter's examples in this course use a hypothetical company, <strong>"TechRetail JSC"</strong> (a mid-size electronics retailer) — treat its numbers as illustrative, and mirror the same steps on your own chosen company.</div>`,
    `<span class="eyebrow">FRM301 · Bài 0.1 · Tổng quan</span>
<h2>Mô hình hoá tài chính và Quản trị rủi ro ứng dụng</h2>
<p class="lead">Đây là môn học theo <strong>DỰ ÁN</strong>. Thay vì học lý thuyết mô hình hoá riêng lẻ, bạn dựng <strong>một mô hình tài chính hoàn chỉnh, từ đầu tới cuối, trên một công ty thật</strong> — cùng một case theo bạn từ Chương 1 tới Chương 8. Mỗi chương là một bước trong quá trình dựng; đầu ra mỗi chương là đầu vào chương sau.</p>
<h3>Khác gì với các môn liên quan</h3>
<ul>
<li><strong>FMR301</strong> dạy <em>lý thuyết</em> quản trị rủi ro tích hợp (khung, chuẩn) — môn này áp dụng lý thuyết đó ngay trong một mô hình đang chạy.</li>
<li><strong>FMS301</strong> tập trung kỹ thuật <em>mô phỏng</em> (Monte Carlo, quá trình ngẫu nhiên) như một môn học riêng — ở đây, tư duy kiểu mô phỏng (kịch bản, độ nhạy) chỉ là một trong tám bước, phục vụ cho việc định giá.</li>
<li><strong>FIM302c</strong> dạy <em>nền tảng</em> mô hình hoá tài chính (kỹ thuật, công thức) — môn này giả định bạn đã có nền đó, và dồn thời gian vào việc ra quyết định: driver nào quan trọng, rủi ro nào đáng lo, khuyến nghị gì.</li>
</ul>
<h3>8 bước dựng dự án</h3>
<ol>
<li><strong>Xác định bài toán &amp; thu thập dữ liệu</strong> — mô hình trả lời câu hỏi gì, và số liệu thật lấy từ đâu.</li>
<li><strong>Xây mô hình báo cáo tài chính lịch sử</strong> — dựng lại 3–5 năm báo cáo kết quả kinh doanh, bảng cân đối, lưu chuyển tiền, liên kết và kiểm tra.</li>
<li><strong>Dự báo &amp; xây dựng giả định (drivers)</strong> — biến lịch sử thành dự báo tương lai qua các driver rõ ràng, bảo vệ được.</li>
<li><strong>Mô hình định giá</strong> — DCF và bội số giao dịch, đối chiếu chéo.</li>
<li><strong>Tích hợp phân tích rủi ro</strong> — độ nhạy và kịch bản trên các driver quan trọng nhất của định giá.</li>
<li><strong>Kiểm tra &amp; xác thực mô hình</strong> — audit mô hình: có cân bằng không, có vỡ khi bị "vặn" không, có tin được không.</li>
<li><strong>Trực quan hoá &amp; dashboard</strong> — biến mô hình thành một bức tranh một trang mà người ra quyết định đọc được ngay.</li>
<li><strong>Báo cáo &amp; khuyến nghị</strong> — viết và trình bày case đầu tư mà người đọc có thể HÀNH ĐỘNG theo.</li>
</ol>
<div class="callout"><span class="badge">Công ty case</span> Chọn một công ty niêm yết thật, có 3–5 năm BCTC đã kiểm toán, trước khi vào Chương 1. Toàn bộ ví dụ trong môn này dùng một công ty giả định, <strong>"TechRetail JSC"</strong> (công ty bán lẻ điện tử quy mô vừa) — coi số liệu là minh hoạ, và lặp lại đúng các bước đó trên công ty bạn chọn.</div>`,
  ]]);

const c1 = doc('frm301-1-1-problem-data', '1.1 — Problem definition & data collection|||1.1 — Xác định bài toán & thu thập dữ liệu',
  'Xác định câu hỏi mô hình trả lời (định giá? tín dụng? đầu tư?), phạm vi & giới hạn, nguồn dữ liệu (BCTC, cáo bạch, dữ liệu ngành), checklist thu thập.',
  [[
    `<span class="eyebrow">FRM301 · Chapter 1 · Lesson 1.1</span>
<h2>Problem definition &amp; data collection</h2>
<h3>Step 1: define the question before you open Excel</h3>
<p>A model is only as good as the question it answers. Before collecting any number, write down, in one sentence: <strong>who is asking, what decision depends on the answer, and by when</strong>. Typical framings for this course:</p>
<ul>
<li><strong>Valuation</strong> — "Is this company's shares worth buying at the current market price?"</li>
<li><strong>Credit / lending</strong> — "Can this company service a new loan over the next 5 years?"</li>
<li><strong>Investment decision</strong> — "Should this company proceed with a new project/expansion?"</li>
</ul>
<p>This course frames the case as a <strong>valuation for an investment recommendation</strong> — pick your case company with that lens.</p>
<h3>Step 2: scope &amp; boundaries</h3>
<p>Write down what the model will <em>not</em> do — e.g. "single-entity, not consolidated group"; "5-year forecast horizon"; "excludes M&amp;A scenarios". A scope statement protects you from an unbounded model later.</p>
<h3>Step 3: data sources, ranked by reliability</h3>
<pre><code>Priority  Source                                  Use for
--------  --------------------------------------  ---------------------------
1         Audited annual financial statements     Historical 3 statements
2         Prospectus / IPO filing (if available)  Business model, risk factors
3         Investor presentations / earnings call  Management guidance, KPIs
4         Industry reports (regulator, association) Market size, peer margins
5         Stock exchange / market data             Share price, peer multiples
</code></pre>
<h3>Data-collection checklist</h3>
<div class="callout"><span class="badge">Before Chapter 2</span>
<ul>
<li>3–5 years of audited income statement, balance sheet, cash flow statement.</li>
<li>Notes to the financial statements (accounting policy changes, one-off items).</li>
<li>Share count &amp; current market price (for multiples later).</li>
<li>2–4 comparable/peer companies in the same industry.</li>
</ul></div>
<p>A model built on incomplete or stale data will look precise and be wrong — precision is not the same thing as accuracy.</p>`,
    `<span class="eyebrow">FRM301 · Chương 1 · Bài 1.1</span>
<h2>Xác định bài toán &amp; thu thập dữ liệu</h2>
<h3>Bước 1: xác định câu hỏi trước khi mở Excel</h3>
<p>Một mô hình chỉ tốt bằng câu hỏi nó trả lời. Trước khi thu thập bất kỳ số liệu nào, viết ra một câu: <strong>ai đang hỏi, quyết định gì phụ thuộc vào câu trả lời, và tới khi nào cần có</strong>. Các khung câu hỏi thường gặp trong môn này:</p>
<ul>
<li><strong>Định giá</strong> — "Cổ phiếu công ty này có đáng mua ở mức giá thị trường hiện tại không?"</li>
<li><strong>Tín dụng / cho vay</strong> — "Công ty này có trả được một khoản vay mới trong 5 năm tới không?"</li>
<li><strong>Quyết định đầu tư</strong> — "Công ty nên triển khai dự án/mở rộng mới hay không?"</li>
</ul>
<p>Môn này khung case theo hướng <strong>định giá phục vụ khuyến nghị đầu tư</strong> — chọn công ty case theo góc nhìn đó.</p>
<h3>Bước 2: phạm vi &amp; giới hạn</h3>
<p>Viết rõ những gì mô hình <em>KHÔNG</em> làm — ví dụ "chỉ một pháp nhân, không hợp nhất tập đoàn"; "dự báo 5 năm"; "không tính kịch bản M&amp;A". Một câu phạm vi rõ ràng bảo vệ bạn khỏi một mô hình phình vô giới hạn về sau.</p>
<h3>Bước 3: nguồn dữ liệu, xếp theo độ tin cậy</h3>
<pre><code>Thứ tự  Nguồn                                     Dùng cho
------  ----------------------------------------  ---------------------------
1       BCTC năm đã kiểm toán                      3 báo cáo tài chính lịch sử
2       Bản cáo bạch / hồ sơ IPO (nếu có)           Mô hình kinh doanh, rủi ro
3       Báo cáo nhà đầu tư / earnings call          Định hướng quản trị, KPI
4       Báo cáo ngành (cơ quan quản lý, hiệp hội)    Quy mô thị trường, biên đối thủ
5       Dữ liệu sàn giao dịch / thị trường           Giá cổ phiếu, bội số đối thủ
</code></pre>
<h3>Checklist thu thập dữ liệu</h3>
<div class="callout"><span class="badge">Trước Chương 2</span>
<ul>
<li>3–5 năm báo cáo kết quả kinh doanh, bảng cân đối, lưu chuyển tiền đã kiểm toán.</li>
<li>Thuyết minh BCTC (thay đổi chính sách kế toán, khoản mục bất thường).</li>
<li>Số lượng cổ phiếu &amp; giá thị trường hiện tại (dùng cho bội số ở chương sau).</li>
<li>2–4 công ty so sánh/đối thủ cùng ngành.</li>
</ul></div>
<p>Một mô hình dựng trên dữ liệu thiếu hoặc cũ sẽ trông chính xác mà lại sai — độ chính xác về hình thức không đồng nghĩa với độ đúng về thực tế.</p>`,
  ]]);

const c1q = quiz('frm301-quiz-1', 'Quiz 1 — Problem & data|||Quiz 1 — Bài toán & dữ liệu', [
  { id: 'q1', question: 'Bước ĐẦU TIÊN khi bắt đầu một dự án mô hình tài chính là gì?', options: ['Mở Excel và nhập số liệu ngay', 'Xác định rõ câu hỏi/quyết định mà mô hình phải trả lời', 'Tải toàn bộ báo cáo ngành có thể tìm được', 'Chọn công thức DCF sẽ dùng'], correctIndex: 1, explanation: 'Phải xác định câu hỏi & quyết định phụ thuộc trước, vì nó quyết định phạm vi, dữ liệu cần và cấu trúc mô hình.' },
  { id: 'q2', question: 'Nguồn dữ liệu ĐÁNG TIN CẬY NHẤT cho 3 báo cáo tài chính lịch sử là gì?', options: ['Bài báo phân tích trên mạng', 'BCTC năm đã kiểm toán', 'Dự báo của một nhà phân tích khác', 'Bài đăng mạng xã hội của công ty'], correctIndex: 1, explanation: 'BCTC đã kiểm toán là nguồn số liệu lịch sử gốc, đáng tin cậy nhất; các nguồn khác chỉ nên bổ sung.' },
  { id: 'q3', question: 'Viết "phạm vi & giới hạn" của mô hình (ví dụ: không tính M&amp;A, dự báo 5 năm) nhằm mục đích gì?', options: ['Làm báo cáo dài hơn cho ấn tượng', 'Ngăn mô hình phình to vô kiểm soát và làm rõ mô hình KHÔNG trả lời câu hỏi gì', 'Thay thế cho việc thu thập dữ liệu', 'Không có tác dụng thực tế'], correctIndex: 1, explanation: 'Một câu phạm vi rõ ràng giới hạn công việc và tránh hiểu nhầm về những gì mô hình có thể trả lời.' },
]);

const c2 = doc('frm301-2-1-historical-statements', '2.1 — Historical financial statement modeling|||2.1 — Xây mô hình báo cáo tài chính lịch sử',
  'Dựng lại 3 báo cáo tài chính (KQKD, cân đối, lưu chuyển tiền) liên kết với nhau, quy ước định dạng (input/formula), phân tích tỉ số & xu hướng lịch sử.',
  [[
    `<span class="eyebrow">FRM301 · Chapter 2 · Lesson 2.1</span>
<h2>Historical financial statement modeling</h2>
<h3>The three linked statements</h3>
<ul>
<li><strong>Income statement</strong> — revenue down to net income, over 3–5 historical years.</li>
<li><strong>Balance sheet</strong> — assets, liabilities, equity at each year-end; must always satisfy <code>Assets = Liabilities + Equity</code>.</li>
<li><strong>Cash flow statement</strong> — operating, investing, financing cash flow; the "cash" line must tie to the balance sheet's cash balance.</li>
</ul>
<p>These three are not independent tabs — net income flows into retained earnings (balance sheet) and into the cash flow statement's operating section; depreciation flows from the balance sheet's fixed-asset schedule into both the income statement and the cash flow statement. Building them <strong>linked</strong>, not as three static tables, is what makes the model usable in Chapter 3.</p>
<h3>Formatting convention (industry standard)</h3>
<pre><code>Blue font   = hardcoded input (typed number, e.g. from the annual report)
Black font  = formula (calculated from other cells)
Green font  = link to another sheet/tab
</code></pre>
<p>This convention lets anyone open the file and instantly see what's an assumption versus what's derived — the single most useful habit for a model an auditor (or your professor) will read.</p>
<h3>Historical ratio &amp; trend analysis</h3>
<p>Once linked, compute year-over-year growth and margin ratios — they become your evidence base for Chapter 3's forecast drivers:</p>
<pre><code>Revenue growth %   = Revenue(t) / Revenue(t-1) − 1
Gross margin %     = Gross profit / Revenue
EBITDA margin %    = EBITDA / Revenue
Net margin %       = Net income / Revenue
</code></pre>
<div class="callout"><span class="badge">Check before moving on</span> The balance sheet must balance in EVERY historical year. If it doesn't, the error is in your linking — not in the company's real financials — and it must be found now, not carried into the forecast.</div>`,
    `<span class="eyebrow">FRM301 · Chương 2 · Bài 2.1</span>
<h2>Xây mô hình báo cáo tài chính lịch sử</h2>
<h3>Ba báo cáo liên kết</h3>
<ul>
<li><strong>Báo cáo kết quả kinh doanh (KQKD)</strong> — từ doanh thu tới lợi nhuận sau thuế, qua 3–5 năm lịch sử.</li>
<li><strong>Bảng cân đối kế toán</strong> — tài sản, nợ phải trả, vốn chủ sở hữu tại mỗi cuối năm; luôn phải thoả <code>Tài sản = Nợ phải trả + Vốn chủ sở hữu</code>.</li>
<li><strong>Báo cáo lưu chuyển tiền tệ</strong> — dòng tiền hoạt động, đầu tư, tài chính; dòng "tiền cuối kỳ" phải khớp số dư tiền trên bảng cân đối.</li>
</ul>
<p>Ba báo cáo này KHÔNG phải ba bảng độc lập — lợi nhuận sau thuế chảy vào lợi nhuận giữ lại (bảng cân đối) và vào phần hoạt động của lưu chuyển tiền; khấu hao chảy từ lịch trình tài sản cố định (bảng cân đối) vào cả KQKD và lưu chuyển tiền. Dựng chúng <strong>có liên kết</strong>, không phải ba bảng tĩnh, là điều làm mô hình dùng được ở Chương 3.</p>
<h3>Quy ước định dạng (chuẩn ngành)</h3>
<pre><code>Chữ xanh (blue)  = số nhập tay (số gõ trực tiếp, ví dụ từ báo cáo năm)
Chữ đen (black)  = công thức (tính từ ô khác)
Chữ xanh lá      = liên kết sang sheet/tab khác
</code></pre>
<p>Quy ước này cho phép bất kỳ ai mở file cũng thấy ngay đâu là giả định, đâu là số tính ra — thói quen hữu ích nhất cho một mô hình mà người audit (hoặc giáo viên) sẽ đọc.</p>
<h3>Phân tích tỉ số &amp; xu hướng lịch sử</h3>
<p>Sau khi liên kết xong, tính tăng trưởng theo năm và các tỉ số biên lợi nhuận — chúng là bằng chứng cho các driver dự báo ở Chương 3:</p>
<pre><code>Tăng trưởng DT %      = Doanh thu(t) / Doanh thu(t-1) − 1
Biên lợi nhuận gộp %  = Lợi nhuận gộp / Doanh thu
Biên EBITDA %         = EBITDA / Doanh thu
Biên lợi nhuận thuần % = Lợi nhuận sau thuế / Doanh thu
</code></pre>
<div class="callout"><span class="badge">Kiểm tra trước khi qua chương sau</span> Bảng cân đối phải CÂN ở MỌI năm lịch sử. Nếu không cân, lỗi nằm ở cách bạn liên kết — không phải ở số liệu thật của công ty — và phải tìm ra ngay bây giờ, không mang lỗi đó vào phần dự báo.</div>`,
  ]]);

const c2q = quiz('frm301-quiz-2', 'Quiz 2 — Historical statements|||Quiz 2 — Báo cáo lịch sử', [
  { id: 'q1', question: 'Vì sao 3 báo cáo tài chính phải được xây LIÊN KẾT với nhau, không phải ba bảng tĩnh riêng?', options: ['Vì Excel yêu cầu vậy', 'Vì lợi nhuận, khấu hao và số dư tiền là các mối nối chảy giữa ba báo cáo, thiếu liên kết mô hình sẽ không dùng được cho dự báo', 'Chỉ để file trông chuyên nghiệp hơn', 'Không có lý do kỹ thuật, chỉ là thói quen'], correctIndex: 1, explanation: 'Net income, khấu hao, số dư tiền là các mối nối thật giữa ba báo cáo; liên kết đúng là điều làm mô hình dự báo được ở chương sau.' },
  { id: 'q2', question: 'Theo quy ước định dạng chuẩn ngành, ô CHỮ XANH (blue) trong mô hình nghĩa là gì?', options: ['Công thức tính từ ô khác', 'Số nhập tay (input), ví dụ lấy từ báo cáo năm', 'Liên kết sang sheet khác', 'Ô có lỗi'], correctIndex: 1, explanation: 'Chữ xanh = input gõ tay; chữ đen = công thức; chữ xanh lá = liên kết sheet khác — giúp người đọc phân biệt giả định và số tính ra.' },
  { id: 'q3', question: 'Nếu bảng cân đối KHÔNG cân ở một năm lịch sử, việc cần làm là gì?', options: ['Bỏ qua vì sai số nhỏ không quan trọng', 'Chuyển sang Chương 3 và sửa sau', 'Tìm và sửa lỗi liên kết ngay trước khi qua chương sau', 'Thêm một dòng "cân chỉnh" để buộc nó cân'], correctIndex: 2, explanation: 'Bảng cân đối lịch sử không cân là lỗi liên kết của người dựng mô hình, không phải của công ty — phải tìm và sửa ngay, không mang lỗi vào dự báo.' },
]);

const c3 = doc('frm301-3-1-forecast-drivers', '3.1 — Forecasting & driver-based assumptions|||3.1 — Dự báo & xây dựng giả định (drivers)',
  'Driver doanh thu (tăng trưởng, số lượng x giá), driver chi phí (% doanh thu), vốn lưu động (DSO/DIO/DPO), lịch trình capex/khấu hao, nguyên tắc dự báo theo driver.',
  [[
    `<span class="eyebrow">FRM301 · Chapter 3 · Lesson 3.1</span>
<h2>Forecasting &amp; driver-based assumptions</h2>
<h3>Why "driver-based", not just "trend-based"</h3>
<p>A weak forecast grows revenue by "historical average %" with no explanation. A driver-based forecast expresses each line as a function of an operational or economic <strong>driver</strong> you can defend in front of a reader — a driver has a reason to move the way you say it will.</p>
<h3>Revenue drivers</h3>
<pre><code>Simple growth driver:   Revenue(t) = Revenue(t-1) × (1 + growth %)
Volume × price driver:  Revenue(t) = Units sold(t) × Average price(t)
Driver source: industry volume growth (from Chapter 1 data) × management's
               pricing guidance, not a single blended "growth rate" guess.
</code></pre>
<h3>Cost &amp; margin drivers</h3>
<p>Most operating costs scale with revenue — model them as a <strong>% of revenue</strong>, anchored to the historical average or a stated efficiency target, not re-guessed each year:</p>
<pre><code>COGS(t)            = Revenue(t) × COGS % (historical average or target)
SG&amp;A(t)             = Revenue(t) × SG&amp;A %
EBITDA(t)           = Revenue(t) − COGS(t) − SG&amp;A(t)
</code></pre>
<h3>Working-capital drivers</h3>
<pre><code>DSO (days sales outstanding) = Accounts receivable / Revenue × 365
DIO (days inventory outstanding) = Inventory / COGS × 365
DPO (days payable outstanding) = Accounts payable / COGS × 365
Forecast: Receivable(t) = DSO(t)/365 × Revenue(t)  — and so on for
inventory/payables — instead of guessing a balance-sheet number directly.
</code></pre>
<h3>Capex &amp; depreciation schedule</h3>
<p>Build a small fixed-asset schedule: opening balance + capex (as % of revenue, or a stated project plan) − depreciation = closing balance. This schedule feeds the cash flow statement (capex as an investing outflow) and the income statement (depreciation expense) — another example of Chapter 2's "linked, not static" discipline.</p>
<div class="callout"><span class="badge">Discipline</span> Every forecast assumption should trace to something concrete: a historical average, a peer benchmark, or a management target. "I picked a number that felt reasonable" is the sentence that fails a model audit in Chapter 6.</div>`,
    `<span class="eyebrow">FRM301 · Chương 3 · Bài 3.1</span>
<h2>Dự báo &amp; xây dựng giả định (drivers)</h2>
<h3>Vì sao "theo driver", không chỉ "theo xu hướng"</h3>
<p>Một dự báo yếu tăng doanh thu theo "trung bình % lịch sử" mà không giải thích được vì sao. Một dự báo theo driver biểu diễn mỗi dòng số như một hàm của một <strong>driver</strong> hoạt động hoặc kinh tế mà bạn có thể bảo vệ được trước người đọc — driver có LÝ DO để di chuyển đúng như bạn nói.</p>
<h3>Driver doanh thu</h3>
<pre><code>Driver tăng trưởng đơn giản: Doanh thu(t) = Doanh thu(t-1) × (1 + tăng trưởng %)
Driver số lượng x giá:      Doanh thu(t) = Số lượng bán(t) × Giá bán TB(t)
Nguồn driver: tăng trưởng khối lượng ngành (dữ liệu Chương 1) × định hướng
              giá của quản trị, KHÔNG phải một con số "tỉ lệ tăng trưởng"
              đoán chung.
</code></pre>
<h3>Driver chi phí &amp; biên lợi nhuận</h3>
<p>Hầu hết chi phí hoạt động biến động theo doanh thu — mô hình hoá dưới dạng <strong>% doanh thu</strong>, gắn với trung bình lịch sử hoặc mục tiêu hiệu quả đã nêu, không đoán lại mỗi năm:</p>
<pre><code>Giá vốn hàng bán(t) = Doanh thu(t) × % giá vốn (trung bình lịch sử hoặc mục tiêu)
SG&amp;A(t)              = Doanh thu(t) × % SG&amp;A
EBITDA(t)            = Doanh thu(t) − Giá vốn(t) − SG&amp;A(t)
</code></pre>
<h3>Driver vốn lưu động</h3>
<pre><code>DSO (số ngày phải thu)  = Phải thu khách hàng / Doanh thu × 365
DIO (số ngày tồn kho)   = Hàng tồn kho / Giá vốn hàng bán × 365
DPO (số ngày phải trả)  = Phải trả người bán / Giá vốn hàng bán × 365
Dự báo: Phải thu(t) = DSO(t)/365 × Doanh thu(t) — và tương tự cho tồn kho/
phải trả — thay vì đoán trực tiếp một con số trên bảng cân đối.
</code></pre>
<h3>Lịch trình capex &amp; khấu hao</h3>
<p>Dựng một lịch trình tài sản cố định nhỏ: số dư đầu kỳ + capex (theo % doanh thu, hoặc theo kế hoạch dự án đã nêu) − khấu hao = số dư cuối kỳ. Lịch trình này chảy vào lưu chuyển tiền (capex là dòng ra đầu tư) và vào KQKD (chi phí khấu hao) — một ví dụ nữa của nguyên tắc "liên kết, không tĩnh" ở Chương 2.</p>
<div class="callout"><span class="badge">Kỷ luật</span> Mọi giả định dự báo phải truy được về một thứ cụ thể: trung bình lịch sử, chuẩn đối thủ ngành, hoặc mục tiêu quản trị. "Tôi chọn một số nghe hợp lý" là câu sẽ trượt phần audit mô hình ở Chương 6.</div>`,
  ]]);

const c3q = quiz('frm301-quiz-3', 'Quiz 3 — Forecast drivers|||Quiz 3 — Driver dự báo', [
  { id: 'q1', question: 'Vì sao mô hình nên dự báo doanh thu theo driver (ví dụ số lượng x giá) thay vì một "tỉ lệ tăng trưởng" đoán chung?', options: ['Vì driver luôn cho kết quả cao hơn', 'Vì driver có thể truy nguồn (dữ liệu ngành, định hướng quản trị) nên bảo vệ được trước người đọc, còn một con số đoán chung thì không', 'Vì driver tính toán ít công thức hơn', 'Không có khác biệt thực chất'], correctIndex: 1, explanation: 'Driver phải truy được về căn cứ cụ thể; một tỉ lệ tăng trưởng đoán chung không giải thích được lý do và sẽ thất bại khi bị hỏi ngược lại.' },
  { id: 'q2', question: 'DSO (days sales outstanding) đo lường điều gì và dùng để dự báo dòng nào?', options: ['Số ngày tồn kho trung bình, dự báo hàng tồn kho', 'Số ngày phải thu khách hàng trung bình, dự báo khoản phải thu', 'Số ngày phải trả người bán, dự báo khoản phải trả', 'Không liên quan tới vốn lưu động'], correctIndex: 1, explanation: 'DSO = Phải thu / Doanh thu × 365; dùng để dự báo khoản phải thu tương lai theo driver này, thay vì đoán trực tiếp.' },
  { id: 'q3', question: 'Lịch trình capex &amp; khấu hao trong Chương 3 chảy vào những đâu trong mô hình?', options: ['Chỉ vào bảng cân đối, không ảnh hưởng gì khác', 'Vào lưu chuyển tiền (capex là dòng ra đầu tư) và vào KQKD (chi phí khấu hao)', 'Chỉ vào KQKD', 'Không liên kết với báo cáo nào khác'], correctIndex: 1, explanation: 'Capex là dòng tiền ra đầu tư trên lưu chuyển tiền; khấu hao là chi phí trên KQKD — đây là ví dụ về nguyên tắc liên kết ba báo cáo từ Chương 2.' },
]);

const c4 = doc('frm301-4-1-valuation', '4.1 — Valuation modeling: DCF & multiples|||4.1 — Mô hình định giá: DCF & bội số',
  'Dòng tiền tự do (FCFF), WACC, giá trị cuối kỳ (Gordon growth / exit multiple), định giá theo bội số so sánh, đối chiếu chéo hai phương pháp.',
  [[
    `<span class="eyebrow">FRM301 · Chapter 4 · Lesson 4.1</span>
<h2>Valuation modeling: DCF &amp; multiples</h2>
<h3>Discounted cash flow (DCF)</h3>
<p>A DCF values the company as the present value of the cash it will generate for <em>all</em> capital providers — free cash flow to the firm (FCFF), discounted at the weighted average cost of capital (WACC):</p>
<pre><code>FCFF  = EBIT × (1 − tax rate) + Depreciation − Capex − Δ Working capital
WACC  = (E/V) × Cost of equity + (D/V) × Cost of debt × (1 − tax rate)
        where E = market value of equity, D = market value of debt, V = E+D
Enterprise value = Σ FCFF(t) / (1+WACC)^t   [explicit forecast years]
                   + Terminal value / (1+WACC)^n
</code></pre>
<h3>Terminal value — two methods</h3>
<pre><code>Gordon growth:  TV(n) = FCFF(n+1) / (WACC − g)     [g = long-run growth]
Exit multiple:  TV(n) = EBITDA(n) × Exit EV/EBITDA multiple (peer-based)
</code></pre>
<p>The terminal value is often over half of total enterprise value in a DCF — which is exactly why Chapter 5 tests its sensitivity to WACC and g in detail.</p>
<h3>Trading multiples (relative valuation)</h3>
<p>Cross-check the DCF against how the market prices comparable companies — pull 2–4 peers (from Chapter 1's data) and their trading multiples:</p>
<pre><code>EV/EBITDA (peer average) × your company's EBITDA = implied enterprise value
P/E (peer average)       × your company's net income = implied equity value
</code></pre>
<h3>From enterprise value to a share price</h3>
<pre><code>Equity value = Enterprise value − Net debt (Debt − Cash)
Value per share = Equity value / Diluted shares outstanding
</code></pre>
<div class="callout"><span class="badge">Triangulate, don't pick one</span> DCF and multiples answer the same question from two different angles — intrinsic value versus what the market currently pays for similar businesses. When they disagree by a lot, that gap IS the finding worth writing about in Chapter 8, not a bug to hide.</div>`,
    `<span class="eyebrow">FRM301 · Chương 4 · Bài 4.1</span>
<h2>Mô hình định giá: DCF &amp; bội số</h2>
<h3>Dòng tiền chiết khấu (DCF)</h3>
<p>DCF định giá công ty bằng giá trị hiện tại của dòng tiền công ty tạo ra cho <em>toàn bộ</em> nhà cấp vốn — dòng tiền tự do cho doanh nghiệp (FCFF), chiết khấu theo chi phí vốn bình quân gia quyền (WACC):</p>
<pre><code>FCFF  = EBIT × (1 − thuế suất) + Khấu hao − Capex − Δ Vốn lưu động
WACC  = (E/V) × Chi phí vốn CSH + (D/V) × Chi phí nợ × (1 − thuế suất)
        với E = giá trị thị trường VCSH, D = giá trị thị trường nợ, V = E+D
Giá trị doanh nghiệp = Σ FCFF(t) / (1+WACC)^t   [các năm dự báo rõ]
                       + Giá trị cuối kỳ / (1+WACC)^n
</code></pre>
<h3>Giá trị cuối kỳ — hai cách tính</h3>
<pre><code>Gordon growth:   GTCK(n) = FCFF(n+1) / (WACC − g)   [g = tăng trưởng dài hạn]
Exit multiple:   GTCK(n) = EBITDA(n) × Bội số EV/EBITDA thoát (theo đối thủ)
</code></pre>
<p>Giá trị cuối kỳ thường chiếm HƠN NỬA tổng giá trị doanh nghiệp trong một DCF — chính vì vậy Chương 5 sẽ kiểm độ nhạy của nó với WACC và g một cách chi tiết.</p>
<h3>Bội số giao dịch (định giá tương đối)</h3>
<p>Đối chiếu DCF với cách thị trường định giá các công ty so sánh — lấy 2–4 đối thủ (từ dữ liệu Chương 1) và bội số giao dịch của họ:</p>
<pre><code>EV/EBITDA (trung bình đối thủ) × EBITDA công ty bạn = giá trị doanh nghiệp ngụ ý
P/E (trung bình đối thủ)       × LNST công ty bạn    = giá trị vốn CSH ngụ ý
</code></pre>
<h3>Từ giá trị doanh nghiệp ra giá cổ phiếu</h3>
<pre><code>Giá trị vốn CSH = Giá trị doanh nghiệp − Nợ thuần (Nợ − Tiền)
Giá trị mỗi cổ phiếu = Giá trị vốn CSH / Số cổ phiếu pha loãng lưu hành
</code></pre>
<div class="callout"><span class="badge">Đối chiếu chéo, không chọn một</span> DCF và bội số trả lời cùng một câu hỏi từ hai góc khác nhau — giá trị nội tại so với giá thị trường đang trả cho các doanh nghiệp tương tự. Khi hai kết quả lệch nhiều, khoảng lệch đó CHÍNH LÀ phát hiện đáng viết ở Chương 8, không phải lỗi cần che đi.</div>`,
  ]]);

const c4q = quiz('frm301-quiz-4', 'Quiz 4 — DCF & multiples|||Quiz 4 — DCF & bội số', [
  { id: 'q1', question: 'WACC dùng để làm gì trong mô hình DCF?', options: ['Tính tăng trưởng doanh thu', 'Chiết khấu dòng tiền tự do trong tương lai về giá trị hiện tại', 'Thay thế cho thuế suất', 'Tính số cổ phiếu pha loãng'], correctIndex: 1, explanation: 'WACC là lãi suất chiết khấu, đưa các FCFF tương lai về giá trị hiện tại để cộng thành giá trị doanh nghiệp.' },
  { id: 'q2', question: 'Giá trị cuối kỳ (terminal value) trong một DCF thường có đặc điểm gì?', options: ['Luôn nhỏ hơn 10% tổng giá trị doanh nghiệp', 'Thường chiếm hơn nửa tổng giá trị doanh nghiệp, nên rất nhạy với WACC và g', 'Không ảnh hưởng tới kết quả định giá', 'Chỉ tính bằng phương pháp exit multiple, không dùng Gordon growth'], correctIndex: 1, explanation: 'Giá trị cuối kỳ thường là phần lớn nhất trong tổng giá trị DCF, nên sai lệch nhỏ ở WACC hoặc g có thể đổi kết quả định giá rất nhiều — lý do Chương 5 kiểm độ nhạy kỹ phần này.' },
  { id: 'q3', question: 'Khi kết quả DCF và bội số giao dịch lệch nhau nhiều, nên xử lý thế nào?', options: ['Luôn tin DCF vì có vẻ khoa học hơn', 'Luôn tin bội số vì dựa vào thị trường thật', 'Coi khoảng lệch đó là một phát hiện cần giải thích trong báo cáo, không phải lỗi cần giấu', 'Bỏ một phương pháp cho đỡ rối'], correctIndex: 2, explanation: 'DCF và bội số nhìn từ hai góc khác nhau (giá trị nội tại và giá thị trường); khi lệch nhiều, đó là thông tin đáng phân tích và trình bày, không phải điều cần loại bỏ.' },
]);

const c5 = doc('frm301-5-1-risk-sensitivity', '5.1 — Risk analysis: sensitivity & scenario|||5.1 — Tích hợp phân tích rủi ro: độ nhạy & kịch bản',
  'Bảng độ nhạy 1 & 2 biến, phân tích kịch bản (base/bull/bear), xác định driver rủi ro trọng yếu, gắn kết quả rủi ro vào định giá.',
  [[
    `<span class="eyebrow">FRM301 · Chapter 5 · Lesson 5.1</span>
<h2>Risk analysis: sensitivity &amp; scenario</h2>
<h3>Why the valuation from Chapter 4 is not "the answer"</h3>
<p>A single DCF number (say, "value per share = $12.40") hides how much that number moves when a single assumption changes. Risk analysis makes that movement visible — it turns one point estimate into a defensible <em>range</em>.</p>
<h3>Sensitivity analysis — one and two variables</h3>
<pre><code>One-variable: hold everything else fixed, flex ONE driver (e.g. revenue
              growth 3%→9%), read the resulting value per share for each.

Two-variable (data table): put WACC across the top, terminal growth (g)
              down the side, and value per share in the grid —
              the classic DCF sensitivity table:

            g = 1.5%   g = 2.0%   g = 2.5%   g = 3.0%
WACC 9%      14.10       14.90      15.85      17.00
WACC 10%     12.40       12.95      13.60      14.35
WACC 11%     11.05       11.45      11.90      12.45
</code></pre>
<h3>Scenario analysis — bundles of drivers, not one at a time</h3>
<p>Sensitivity flexes one driver; a real risk usually moves several drivers together. Build named scenarios that bundle a coherent story:</p>
<pre><code>Base case:  management guidance — revenue growth 6%, margin stable
Bull case:  new market wins + operating leverage — growth 10%, margin +2pp
Bear case:  demand slowdown + input cost inflation — growth 2%, margin -3pp
</code></pre>
<h3>Identifying the key risk drivers</h3>
<p>Rank drivers by how much the value per share swings per unit of change (a "tornado" ranking). In most operating businesses, revenue growth, terminal growth rate, and WACC dominate — spend your remaining analysis time on those, not on a rounding difference in tax rate.</p>
<div class="callout"><span class="badge">The point of this chapter</span> A recommendation should never rest on one number. "Fair value is $12.40, but ranges $9.80–$16.20 across the bear-to-bull scenarios, driven mainly by revenue growth and WACC" is a defensible statement; "fair value is $12.40" alone is not.</div>`,
    `<span class="eyebrow">FRM301 · Chương 5 · Bài 5.1</span>
<h2>Tích hợp phân tích rủi ro: độ nhạy &amp; kịch bản</h2>
<h3>Vì sao kết quả định giá ở Chương 4 KHÔNG phải "câu trả lời cuối"</h3>
<p>Một con số DCF duy nhất (ví dụ "giá trị mỗi cổ phiếu = 12,40") che mất việc con số đó thay đổi bao nhiêu khi một giả định thay đổi. Phân tích rủi ro làm cho sự thay đổi đó hiện ra — biến một điểm ước lượng thành một <em>khoảng</em> bảo vệ được.</p>
<h3>Phân tích độ nhạy — một và hai biến</h3>
<pre><code>Một biến: giữ mọi thứ khác cố định, chỉ đổi MỘT driver (ví dụ tăng trưởng
          doanh thu 3%→9%), đọc giá trị mỗi cổ phiếu tương ứng.

Hai biến (bảng data table): WACC theo hàng ngang, tăng trưởng cuối kỳ (g)
          theo cột dọc, giá trị mỗi cổ phiếu trong lưới —
          bảng độ nhạy DCF kinh điển:

            g = 1,5%   g = 2,0%   g = 2,5%   g = 3,0%
WACC 9%      14,10       14,90      15,85      17,00
WACC 10%     12,40       12,95      13,60      14,35
WACC 11%     11,05       11,45      11,90      12,45
</code></pre>
<h3>Phân tích kịch bản — gộp nhiều driver, không đổi từng cái một</h3>
<p>Độ nhạy đổi một driver; một rủi ro thật thường làm nhiều driver di chuyển cùng lúc. Dựng các kịch bản có tên, gộp thành một câu chuyện logic:</p>
<pre><code>Base case: theo định hướng quản trị — tăng trưởng DT 6%, biên ổn định
Bull case: thắng thị trường mới + tận dụng quy mô — tăng trưởng 10%, biên +2đpt
Bear case: nhu cầu chậm lại + chi phí đầu vào tăng — tăng trưởng 2%, biên -3đpt
</code></pre>
<h3>Xác định driver rủi ro trọng yếu</h3>
<p>Xếp hạng driver theo mức độ giá trị mỗi cổ phiếu thay đổi bao nhiêu trên mỗi đơn vị driver thay đổi (kiểu xếp hạng "tornado"). Ở hầu hết doanh nghiệp hoạt động, tăng trưởng doanh thu, tăng trưởng cuối kỳ và WACC là ba driver chi phối — dồn thời gian phân tích còn lại vào đó, không phải vào một chênh lệch làm tròn của thuế suất.</p>
<div class="callout"><span class="badge">Ý nghĩa của chương này</span> Một khuyến nghị không nên đứng trên một con số duy nhất. "Giá trị hợp lý là 12,40, nhưng dao động 9,80–16,20 giữa kịch bản bear và bull, chủ yếu do tăng trưởng doanh thu và WACC" là một phát biểu bảo vệ được; chỉ nói "giá trị hợp lý là 12,40" thì không.</div>`,
  ]]);

const c5q = quiz('frm301-quiz-5', 'Quiz 5 — Sensitivity & scenario|||Quiz 5 — Độ nhạy & kịch bản', [
  { id: 'q1', question: 'Khác biệt chính giữa "phân tích độ nhạy" và "phân tích kịch bản" là gì?', options: ['Không có khác biệt, hai tên gọi cùng một kỹ thuật', 'Độ nhạy đổi một driver tại một thời điểm; kịch bản gộp nhiều driver cùng thay đổi theo một câu chuyện nhất quán', 'Độ nhạy chỉ dùng cho bội số, kịch bản chỉ dùng cho DCF', 'Kịch bản không cần số liệu, chỉ cần mô tả bằng lời'], correctIndex: 1, explanation: 'Độ nhạy flex một biến (ví dụ chỉ WACC); kịch bản (base/bull/bear) gộp nhiều driver di chuyển cùng lúc theo một logic thống nhất.' },
  { id: 'q2', question: 'Trong bảng độ nhạy 2 biến kinh điển của DCF, hai biến thường đặt theo hàng và cột là gì?', options: ['Doanh thu và chi phí', 'WACC và tăng trưởng cuối kỳ (g)', 'Số cổ phiếu và giá thị trường', 'Thuế suất và khấu hao'], correctIndex: 1, explanation: 'Vì giá trị cuối kỳ chiếm phần lớn tổng giá trị DCF, WACC và g (dùng trong công thức Gordon growth) là hai biến được kiểm độ nhạy phổ biến nhất.' },
  { id: 'q3', question: 'Vì sao nên xếp hạng các driver theo mức ảnh hưởng lên giá trị mỗi cổ phiếu (kiểu "tornado") trước khi phân tích sâu?', options: ['Để báo cáo có thêm một bảng cho đẹp', 'Để dồn thời gian phân tích vào driver ảnh hưởng lớn nhất, thay vì các chênh lệch nhỏ không quan trọng', 'Vì Excel yêu cầu xếp hạng trước khi tính độ nhạy', 'Không có tác dụng thực tế'], correctIndex: 1, explanation: 'Xếp hạng theo mức ảnh hưởng giúp tập trung nguồn lực vào driver trọng yếu (thường là tăng trưởng, WACC, biên lợi nhuận) thay vì phân tích đều tất cả driver.' },
]);

const c6 = doc('frm301-6-1-model-audit', '6.1 — Model testing & validation (model audit)|||6.1 — Kiểm tra & xác thực mô hình (model audit)',
  'Kỹ thuật kiểm tra lỗi (bảng cân đối, tránh circular reference không kiểm soát), checklist audit mô hình, stress test, kiểm dấu công thức, đối chiếu sanity check.',
  [[
    `<span class="eyebrow">FRM301 · Chapter 6 · Lesson 6.1</span>
<h2>Model testing &amp; validation (model audit)</h2>
<h3>Why this chapter exists</h3>
<p>A model that produces a number is not the same as a model that produces a <em>trustworthy</em> number. Before writing a single word of recommendation, the model itself must pass an audit — the same review a bank's model-review team or your professor will run.</p>
<h3>Built-in error checks</h3>
<pre><code>Check 1 — Balance sheet balances: Assets − (Liabilities + Equity) = 0
          in EVERY forecast year, not just historical years.
Check 2 — Cash flow ties: ending cash on the cash flow statement
          = cash balance on the balance sheet, every year.
Check 3 — No circular reference left uncontrolled (e.g. interest expense
          depending on debt, which depends on cash flow, which depends on
          interest expense) — either break the circularity or add an
          explicit "iteration switch" cell the reviewer can see and toggle.
</code></pre>
<h3>Model audit checklist</h3>
<div class="callout"><span class="badge">Run before Chapter 7</span>
<ol>
<li><strong>Formula consistency</strong> — copy a formula across a row; does every cell use the same logic (no stray hardcoded number hiding in the middle)?</li>
<li><strong>Sign convention</strong> — are cash outflows consistently negative (or consistently positive with a label), never mixed?</li>
<li><strong>Units</strong> — is everything in the same currency and scale (thousands vs. millions) throughout?</li>
<li><strong>Sanity check against reality</strong> — does forecast revenue growth stay within a plausible range for the industry, or did a typo produce 40% growth forever?</li>
</ol></div>
<h3>Stress testing</h3>
<p>Push an assumption to an extreme (e.g. revenue growth = 0% for 5 years) and confirm the model still balances and produces a sensible (if low) valuation — a model that breaks under an extreme input has a hidden formula error, not just a "bad scenario".</p>
<div class="callout"><span class="badge">The lesson from real incidents</span> A model that "runs without an error message" has NOT been validated — Excel does not warn you about a wrong sign, a copied-wrong formula, or a hardcoded number pretending to be a link. Only a deliberate audit catches those.</div>`,
    `<span class="eyebrow">FRM301 · Chương 6 · Bài 6.1</span>
<h2>Kiểm tra &amp; xác thực mô hình (model audit)</h2>
<h3>Vì sao chương này tồn tại</h3>
<p>Một mô hình cho ra một con số KHÔNG đồng nghĩa với một mô hình cho ra một con số <em>đáng tin</em>. Trước khi viết một chữ khuyến nghị nào, chính mô hình phải qua được một cuộc audit — đúng loại kiểm tra mà bộ phận model-review của ngân hàng hay giáo viên của bạn sẽ làm.</p>
<h3>Các kiểm tra lỗi tích hợp sẵn</h3>
<pre><code>Kiểm tra 1 — Bảng cân đối cân: Tài sản − (Nợ phải trả + VCSH) = 0
             ở MỌI năm dự báo, không chỉ năm lịch sử.
Kiểm tra 2 — Lưu chuyển tiền khớp: tiền cuối kỳ trên báo cáo lưu chuyển
             tiền = số dư tiền trên bảng cân đối, mọi năm.
Kiểm tra 3 — Không để circular reference (vòng tham chiếu) chạy không
             kiểm soát (ví dụ chi phí lãi vay phụ thuộc nợ vay, nợ vay
             phụ thuộc dòng tiền, dòng tiền phụ thuộc chi phí lãi vay) —
             hoặc phá vòng lặp, hoặc thêm một ô "công tắc lặp" rõ ràng
             mà người kiểm tra thấy và bật/tắt được.
</code></pre>
<h3>Checklist audit mô hình</h3>
<div class="callout"><span class="badge">Chạy trước Chương 7</span>
<ol>
<li><strong>Nhất quán công thức</strong> — kéo công thức dọc một hàng; mọi ô có dùng cùng logic không (không có số gõ tay lạc giữa dòng)?</li>
<li><strong>Quy ước dấu</strong> — dòng tiền ra luôn âm (hoặc luôn dương kèm nhãn rõ), không lẫn lộn?</li>
<li><strong>Đơn vị</strong> — toàn bộ cùng loại tiền và cùng thang đo (nghìn hay triệu) suốt mô hình?</li>
<li><strong>Đối chiếu thực tế</strong> — tăng trưởng doanh thu dự báo có nằm trong khoảng hợp lý của ngành, hay một lỗi gõ tạo ra 40% tăng trưởng mãi mãi?</li>
</ol></div>
<h3>Stress test</h3>
<p>Đẩy một giả định tới cực trị (ví dụ tăng trưởng doanh thu = 0% suốt 5 năm) và xác nhận mô hình vẫn cân và cho ra định giá hợp lý (dù thấp) — một mô hình vỡ khi gặp input cực trị đang có lỗi công thức ẩn, không chỉ là "kịch bản xấu".</p>
<div class="callout"><span class="badge">Bài học từ các sự cố thật</span> Một mô hình "chạy không báo lỗi" KHÔNG có nghĩa là đã được xác thực — Excel không cảnh báo bạn về dấu sai, công thức kéo nhầm, hay một số gõ tay đang giả làm một liên kết. Chỉ một cuộc audit có chủ ý mới bắt được những lỗi đó.</div>`,
  ]]);

const c6q = quiz('frm301-quiz-6', 'Quiz 6 — Model audit|||Quiz 6 — Audit mô hình', [
  { id: 'q1', question: 'Một mô hình "chạy được, không báo lỗi Excel" có đồng nghĩa với "mô hình đã được xác thực" không?', options: ['Có, không báo lỗi là đủ bằng chứng', 'Không — Excel không cảnh báo dấu sai, công thức kéo nhầm hay số gõ tay giả làm liên kết; phải audit có chủ ý mới bắt được', 'Chỉ đúng nếu mô hình được viết bằng công thức phức tạp', 'Không liên quan tới việc audit'], correctIndex: 1, explanation: 'Excel không tự phát hiện lỗi logic như dấu sai hay công thức kéo nhầm — chỉ một quy trình audit có chủ ý (checklist) mới bắt được các lỗi này.' },
  { id: 'q2', question: 'Kiểm tra "bảng cân đối cân" trong audit mô hình cần áp dụng cho phạm vi nào?', options: ['Chỉ năm lịch sử gần nhất', 'Chỉ năm dự báo cuối cùng', 'MỌI năm, cả lịch sử và dự báo', 'Không cần kiểm tra nếu mô hình đã chạy được ở Chương 2'], correctIndex: 2, explanation: 'Bảng cân đối phải cân ở mọi năm — kể cả các năm dự báo mới, vì lỗi liên kết có thể chỉ xuất hiện khi công thức được kéo sang vùng dự báo.' },
  { id: 'q3', question: 'Mục đích của việc stress-test mô hình (ví dụ đặt tăng trưởng doanh thu = 0% suốt 5 năm) là gì?', options: ['Để chứng minh công ty sẽ phá sản', 'Để xác nhận mô hình vẫn cân và cho kết quả hợp lý dưới input cực trị, phát hiện lỗi công thức ẩn', 'Để thay thế cho phân tích kịch bản ở Chương 5', 'Không có mục đích thực tế, chỉ là bài tập lý thuyết'], correctIndex: 1, explanation: 'Một mô hình vỡ (báo lỗi, mất cân, ra số vô lý) dưới input cực trị đang ẩn một lỗi công thức — stress test là cách phát hiện lỗi đó trước khi tin vào kết quả.' },
]);

const c7 = doc('frm301-7-1-dashboard', '7.1 — Visualization & results dashboard|||7.1 — Trực quan hoá & dashboard kết quả',
  'Xây dashboard điều hành (tóm tắt KPI, biểu đồ xu hướng, football field định giá, heatmap độ nhạy), nguyên tắc thiết kế một trang, rõ ràng trên hết.',
  [[
    `<span class="eyebrow">FRM301 · Chapter 7 · Lesson 7.1</span>
<h2>Visualization &amp; results dashboard</h2>
<h3>From a working model to a readable one</h3>
<p>By Chapter 6, the model is correct. That is not the same as <strong>usable</strong> — a decision-maker will not open 8 tabs and read formulas. This chapter compresses the model's results into one page they can actually absorb in two minutes.</p>
<h3>Core dashboard components</h3>
<pre><code>1. Headline KPI strip: revenue, EBITDA margin, net income, implied
   value per share — current vs. forecast, one row, big numbers.
2. Trend chart: revenue &amp; EBITDA margin over historical + forecast
   years, one line chart, clearly marking where "actual" ends and
   "forecast" begins.
3. Valuation football field: a horizontal bar chart showing the value
   range from each method (DCF, EV/EBITDA multiple, P/E multiple) side
   by side, plus the current market price as a reference line.
4. Sensitivity heatmap: the WACC × terminal-growth table from Chapter 5,
   colour-scaled so the reader sees the range at a glance, not just numbers.
</code></pre>
<h3>Design principles</h3>
<ul>
<li><strong>One page, one message</strong> — if it doesn't fit on one screen without scrolling, cut something.</li>
<li><strong>Label the axis, not just the chart title</strong> — a reader should never have to guess units or currency.</li>
<li><strong>Consistent colour meaning</strong> — if green means "base case" in one chart, it must mean the same thing in every other chart on the page.</li>
<li><strong>Show the range, not just the point estimate</strong> — the football field and heatmap exist specifically so nobody reads a single number as false certainty.</li>
</ul>
<div class="callout"><span class="badge">Tooling note</span> Native Excel/Google Sheets charts are enough for this course — the skill being tested is <em>what</em> to show and how to label it, not which charting library to use.</div>`,
    `<span class="eyebrow">FRM301 · Chương 7 · Bài 7.1</span>
<h2>Trực quan hoá &amp; dashboard kết quả</h2>
<h3>Từ mô hình chạy đúng tới mô hình đọc được</h3>
<p>Đến hết Chương 6, mô hình đã đúng. Điều đó không đồng nghĩa với <strong>dùng được</strong> — người ra quyết định sẽ không mở 8 tab và đọc từng công thức. Chương này nén kết quả mô hình vào một trang mà họ đọc hiểu được trong hai phút.</p>
<h3>Các thành phần dashboard cốt lõi</h3>
<pre><code>1. Dải KPI đầu trang: doanh thu, biên EBITDA, LNST, giá trị mỗi cổ phiếu
   ngụ ý — hiện tại vs dự báo, một hàng, số lớn dễ đọc.
2. Biểu đồ xu hướng: doanh thu &amp; biên EBITDA qua các năm lịch sử + dự
   báo, một biểu đồ đường, đánh dấu rõ đâu là "thực tế" và đâu là "dự báo".
3. Football field định giá: biểu đồ cột ngang cho khoảng giá trị từ mỗi
   phương pháp (DCF, bội số EV/EBITDA, bội số P/E) đặt cạnh nhau, cùng
   đường tham chiếu là giá thị trường hiện tại.
4. Heatmap độ nhạy: bảng WACC × tăng trưởng cuối kỳ từ Chương 5, tô màu
   theo thang để người đọc thấy khoảng biến động ngay, không chỉ là số.
</code></pre>
<h3>Nguyên tắc thiết kế</h3>
<ul>
<li><strong>Một trang, một thông điệp</strong> — nếu không vừa một màn hình mà không cần cuộn, phải cắt bớt.</li>
<li><strong>Ghi nhãn trục, không chỉ tiêu đề biểu đồ</strong> — người đọc không bao giờ phải đoán đơn vị hay loại tiền.</li>
<li><strong>Ý nghĩa màu nhất quán</strong> — nếu xanh nghĩa là "base case" ở một biểu đồ, nó phải nghĩa như vậy ở MỌI biểu đồ khác trên trang.</li>
<li><strong>Cho thấy khoảng, không chỉ điểm ước lượng</strong> — football field và heatmap tồn tại chính để không ai đọc một con số duy nhất thành sự chắc chắn giả.</li>
</ul>
<div class="callout"><span class="badge">Ghi chú công cụ</span> Biểu đồ gốc của Excel/Google Sheets là đủ cho môn này — kỹ năng được kiểm là <em>chọn cái gì để hiện</em> và <em>ghi nhãn thế nào</em>, không phải chọn thư viện vẽ biểu đồ nào.</div>`,
  ]]);

const c7q = quiz('frm301-quiz-7', 'Quiz 7 — Dashboard|||Quiz 7 — Dashboard', [
  { id: 'q1', question: 'Vì sao một mô hình "đúng về kỹ thuật" (đã qua audit Chương 6) vẫn cần một dashboard riêng?', options: ['Vì dashboard giúp mô hình chạy nhanh hơn', 'Vì người ra quyết định sẽ không đọc công thức trong 8 tab; dashboard nén kết quả thành thứ đọc hiểu được trong vài phút', 'Vì trường yêu cầu phải có biểu đồ, không có lý do khác', 'Vì dashboard thay thế được việc audit'], correctIndex: 1, explanation: 'Đúng về kỹ thuật không đồng nghĩa với dùng được — dashboard là bước biến mô hình thành thứ người đọc (không mở công thức) có thể hiểu nhanh.' },
  { id: 'q2', question: '"Football field" định giá trong dashboard thể hiện điều gì?', options: ['Chỉ một con số định giá duy nhất', 'Khoảng giá trị từ nhiều phương pháp định giá (DCF, các bội số) đặt cạnh nhau kèm giá thị trường tham chiếu', 'Biểu đồ xu hướng doanh thu qua các năm', 'Bảng kiểm tra lỗi công thức'], correctIndex: 1, explanation: 'Football field là biểu đồ cột ngang so sánh khoảng giá trị từ các phương pháp định giá khác nhau, giúp thấy sự đồng thuận hoặc khác biệt giữa chúng.' },
  { id: 'q3', question: 'Nguyên tắc "ý nghĩa màu nhất quán" trong thiết kế dashboard nghĩa là gì?', options: ['Mỗi biểu đồ có thể tự chọn màu tuỳ ý, không cần liên quan biểu đồ khác', 'Nếu một màu đại diện cho một ý nghĩa (ví dụ base case) ở một biểu đồ, nó phải giữ đúng ý nghĩa đó ở mọi biểu đồ khác trên trang', 'Chỉ cần dùng đúng hai màu cho toàn bộ dashboard', 'Không quan trọng vì người đọc sẽ tự hiểu qua tiêu đề'], correctIndex: 1, explanation: 'Màu không nhất quán giữa các biểu đồ khiến người đọc hiểu sai; giữ đúng một ý nghĩa cho mỗi màu xuyên suốt trang là nguyên tắc thiết kế cơ bản.' },
]);

const c8 = doc('frm301-8-1-report', '8.1 — Report, investment recommendation & presentation|||8.1 — Viết báo cáo, khuyến nghị đầu tư & trình bày',
  'Cấu trúc báo cáo/IC memo (tóm tắt, tổng quan công ty, phân tích tài chính, định giá, rủi ro, khuyến nghị), truyền đạt sự không chắc chắn, mẹo trình bày, peer review.',
  [[
    `<span class="eyebrow">FRM301 · Chapter 8 · Lesson 8.1</span>
<h2>Report, investment recommendation &amp; presentation</h2>
<h3>The report is the deliverable, not the model</h3>
<p>No one outside this course will ever open your spreadsheet. What gets read, forwarded, and acted on is the report. Chapters 1–7 exist to produce the evidence for this chapter — writing it badly wastes everything before it.</p>
<h3>Standard structure (investment committee memo style)</h3>
<pre><code>1. Executive summary       — the recommendation and why, in 4-6 sentences,
                              readable in under a minute.
2. Company overview        — business model, industry position (from Ch.1).
3. Financial analysis       — historical trends &amp; ratios (from Ch.2).
4. Forecast &amp; assumptions  — key drivers and why (from Ch.3).
5. Valuation                — DCF + multiples, triangulated (from Ch.4).
6. Risk analysis             — sensitivity/scenario range, key drivers
                              (from Ch.5), and what would change the
                              recommendation.
7. Recommendation            — Buy/Hold/Sell (or equivalent), target price
                              or range, and the time horizon it applies to.
</code></pre>
<h3>Communicating uncertainty honestly</h3>
<p>State the valuation as a range with a central case, not a single false-precise number: "our base-case fair value is $12.40, with a bear-to-bull range of $9.80–$16.20; the current market price of $10.50 sits inside that range, closer to the bear case." That single sentence carries more real information than a bare price target.</p>
<h3>Presentation tips</h3>
<ul>
<li>Lead with the recommendation, not with the methodology — the reader decides in the first 30 seconds whether to keep listening.</li>
<li>Every number on a slide should trace back to a page in the report or a tab in the model — be ready to open that tab live if asked.</li>
<li>Anticipate the hardest question in the room (usually: "what if your key driver is wrong?") and have the sensitivity table ready before it's asked.</li>
</ul>
<div class="callout"><span class="badge">Before you submit</span> Have someone else (a peer) read your executive summary alone, with the model closed. If they cannot state your recommendation and its main risk back to you in one sentence, the report — not the model — needs another pass.</div>`,
    `<span class="eyebrow">FRM301 · Chương 8 · Bài 8.1</span>
<h2>Viết báo cáo, khuyến nghị đầu tư &amp; trình bày</h2>
<h3>Báo cáo là sản phẩm cuối, không phải mô hình</h3>
<p>Không ai ngoài môn học này sẽ mở file Excel của bạn. Thứ được đọc, chuyển tiếp và dùng để hành động là báo cáo. Các Chương 1–7 tồn tại để tạo bằng chứng cho chương này — viết báo cáo kém sẽ làm lãng phí mọi công sức trước đó.</p>
<h3>Cấu trúc chuẩn (kiểu memo trình hội đồng đầu tư)</h3>
<pre><code>1. Tóm tắt điều hành      — khuyến nghị và lý do, trong 4-6 câu, đọc
                             xong trong dưới một phút.
2. Tổng quan công ty       — mô hình kinh doanh, vị thế ngành (từ Ch.1).
3. Phân tích tài chính      — xu hướng &amp; tỉ số lịch sử (từ Ch.2).
4. Dự báo &amp; giả định       — driver chính và lý do (từ Ch.3).
5. Định giá                 — DCF + bội số, đối chiếu chéo (từ Ch.4).
6. Phân tích rủi ro          — khoảng độ nhạy/kịch bản, driver trọng yếu
                             (từ Ch.5), và điều gì sẽ đổi khuyến nghị.
7. Khuyến nghị               — Mua/Giữ/Bán (hoặc tương đương), giá mục
                             tiêu hoặc khoảng giá, và khung thời gian
                             áp dụng.
</code></pre>
<h3>Truyền đạt sự không chắc chắn một cách thẳng thắn</h3>
<p>Nêu định giá dưới dạng một khoảng với một kịch bản trung tâm, không phải một con số giả-chính-xác duy nhất: "giá trị hợp lý base case của chúng tôi là 12,40, khoảng bear-đến-bull là 9,80–16,20; giá thị trường hiện tại 10,50 nằm trong khoảng đó, gần kịch bản bear hơn." Một câu như vậy chứa nhiều thông tin thật hơn một mức giá mục tiêu trần trụi.</p>
<h3>Mẹo trình bày</h3>
<ul>
<li>Mở đầu bằng khuyến nghị, không bằng phương pháp luận — người nghe quyết định trong 30 giây đầu có tiếp tục nghe không.</li>
<li>Mọi số liệu trên slide phải truy được về một trang trong báo cáo hoặc một tab trong mô hình — sẵn sàng mở tab đó ngay nếu bị hỏi.</li>
<li>Chuẩn bị trước cho câu hỏi khó nhất trong phòng (thường là: "nếu driver chính của bạn sai thì sao?") và có sẵn bảng độ nhạy trước khi bị hỏi.</li>
</ul>
<div class="callout"><span class="badge">Trước khi nộp</span> Cho một người khác (bạn học) đọc riêng phần tóm tắt điều hành, không mở mô hình. Nếu họ không nói lại được khuyến nghị của bạn và rủi ro chính của nó trong một câu, thì báo cáo — không phải mô hình — cần sửa lại lần nữa.</div>`,
  ]]);

const c8q = quiz('frm301-quiz-8', 'Quiz 8 — Report & recommendation|||Quiz 8 — Báo cáo & khuyến nghị', [
  { id: 'q1', question: 'Vì sao chương này nói "báo cáo là sản phẩm cuối, không phải mô hình Excel"?', options: ['Vì mô hình Excel không quan trọng và có thể bỏ qua', 'Vì người đọc bên ngoài môn học (nhà đầu tư, hội đồng) sẽ đọc và hành động theo báo cáo, không mở file mô hình', 'Vì báo cáo dễ viết hơn mô hình nên nên ưu tiên', 'Không có lý do cụ thể'], correctIndex: 1, explanation: 'Mô hình tạo ra bằng chứng, nhưng thứ được đọc, chuyển tiếp và dùng để ra quyết định là báo cáo — nên chất lượng viết báo cáo quyết định giá trị thực tế của cả dự án.' },
  { id: 'q2', question: 'Cách truyền đạt định giá "thẳng thắn" theo chương này là gì?', options: ['Chỉ nêu một con số giá mục tiêu duy nhất cho gọn', 'Nêu một khoảng giá trị với kịch bản trung tâm, cùng vị trí giá thị trường hiện tại trong khoảng đó', 'Không nêu con số, chỉ nói định tính', 'Nêu càng nhiều số liệu chi tiết mô hình càng tốt'], correctIndex: 1, explanation: 'Một khoảng (kèm kịch bản trung tâm và vị trí giá thị trường trong khoảng đó) truyền đạt đúng mức độ không chắc chắn, thay vì một con số giả-chính-xác.' },
  { id: 'q3', question: 'Phép kiểm "cho bạn học đọc riêng phần tóm tắt điều hành, không mở mô hình" dùng để kiểm tra điều gì?', options: ['Kiểm tra công thức Excel có đúng không', 'Kiểm tra báo cáo có tự đứng được — người đọc nắm được khuyến nghị và rủi ro chính chỉ từ phần tóm tắt', 'Kiểm tra tốc độ đọc của bạn học', 'Không có mục đích thực tế'], correctIndex: 1, explanation: 'Nếu người đọc không nắm được khuyến nghị và rủi ro chính chỉ từ tóm tắt điều hành, phần viết (không phải mô hình) cần được sửa lại.' },
]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'FRM301',
    slug: 'frm301-applied-financial-modeling-and-risk-management',
    title: 'Applied Financial modeling and Risk management',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/FRM301.webp',
    shortDescription: 'Build one financial model on a company case: data, 3-statement, driver forecasts, DCF & multiples, sensitivity/scenario risk, model audit, dashboard, investment report. Project-based, bilingual.|||Dựng một mô hình tài chính trên case công ty: dữ liệu, 3 báo cáo tài chính, dự báo theo driver, DCF & bội số, rủi ro (độ nhạy/kịch bản), audit, dashboard, báo cáo đầu tư. Học theo dự án, song ngữ.',
    description: 'Môn <strong>FRM301 — Applied Financial Modeling and Risk Management</strong> (khối Quản trị Kinh doanh, kỳ 7) là môn học theo <strong>dự án thực tế (case-based)</strong>: bạn dựng <strong>một mô hình tài chính hoàn chỉnh</strong> trên một công ty case, qua 8 bước — từ <strong>xác định bài toán &amp; thu thập dữ liệu</strong> → <strong>mô hình báo cáo tài chính lịch sử</strong> → <strong>dự báo theo driver</strong> → <strong>định giá (DCF &amp; bội số)</strong> → <strong>phân tích rủi ro (độ nhạy &amp; kịch bản)</strong> → <strong>audit mô hình</strong> → <strong>dashboard trực quan</strong> → <strong>báo cáo &amp; khuyến nghị đầu tư</strong>. Trích dẫn giáo trình Pignataro, Benninga, Damodaran. Song ngữ, có ví dụ công thức và quiz mỗi chương.',
    whatYouLearn: 'Xác định bài toán & nguồn dữ liệu tài chính đáng tin; dựng 3 báo cáo tài chính liên kết & kiểm tra cân đối; xây driver dự báo (doanh thu, chi phí, vốn lưu động, capex/khấu hao); định giá DCF (FCFF, WACC, giá trị cuối kỳ) & bội số so sánh; phân tích độ nhạy 1-2 biến & kịch bản base/bull/bear; audit mô hình (kiểm lỗi, stress test, quy ước dấu); dựng dashboard một trang (KPI, football field, heatmap); viết báo cáo/IC memo & trình bày khuyến nghị đầu tư.',
    requirements: 'Đã học qua nền tảng mô hình hoá tài chính (tương đương FIM302c) và kiến thức tài chính doanh nghiệp cơ bản. Cần Excel hoặc Google Sheets và chọn sẵn một công ty niêm yết có báo cáo tài chính công khai 3-5 năm để làm case xuyên suốt môn.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách (Pignataro, Benninga, Damodaran), tài liệu chính thức, YouTube, công cụ.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Môn theo dự án; 8 bước dựng mô hình; phân biệt FMR301/FMS301/FIM302c.', lessons: [intro] },
    { title: 'Chương 1 — Bài toán & dữ liệu|||Chapter 1 — Problem & data', description: 'Xác định câu hỏi mô hình, nguồn dữ liệu, checklist thu thập.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Báo cáo tài chính lịch sử|||Chapter 2 — Historical statements', description: '3 báo cáo liên kết, quy ước định dạng, tỉ số lịch sử.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Dự báo & driver|||Chapter 3 — Forecast & drivers', description: 'Driver doanh thu/chi phí/vốn lưu động, lịch trình capex.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Định giá DCF & bội số|||Chapter 4 — DCF & multiples valuation', description: 'FCFF, WACC, giá trị cuối kỳ, bội số so sánh.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Phân tích rủi ro|||Chapter 5 — Risk analysis', description: 'Độ nhạy 1-2 biến, kịch bản base/bull/bear, driver rủi ro.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Audit mô hình|||Chapter 6 — Model audit', description: 'Kiểm tra lỗi, stress test, checklist audit.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Dashboard kết quả|||Chapter 7 — Results dashboard', description: 'KPI, biểu đồ xu hướng, football field, heatmap.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Báo cáo & khuyến nghị|||Chapter 8 — Report & recommendation', description: 'Cấu trúc IC memo, truyền đạt rủi ro, trình bày.', lessons: [c8, c8q] },
  ],
};
