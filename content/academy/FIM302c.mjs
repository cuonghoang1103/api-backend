/**
 * FIM302c — Financial Modelling. Giáo trình tham khảo: Benninga "Financial
 * Modeling"; Pignataro "Financial Modeling and Valuation"; Wall Street
 * Prep / CFI courses. 8 chương: tổng quan & chuẩn Excel, kỹ thuật Excel,
 * mô hình 3 báo cáo tài chính, dự báo doanh thu/chi phí, vốn lưu động &
 * lịch khấu hao/nợ, DCF & WACC, độ nhạy/kịch bản, LBO/M&A cơ bản. Số liệu
 * trong ví dụ là GIẢ ĐỊNH. Song ngữ. Giữ NGUYÊN slug/semester/thumb(v3).
 * ⚠️ KHÔNG backtick/${ trong nội dung; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('fim302c-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: sách tham khảo (Benninga, Pignataro), khoá học Wall Street Prep/CFI, tài liệu miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">FIM302c · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Financial Modelling</strong> — Excel best practices, the 3-statement model, forecasting, valuation and LBO/M&amp;A basics — in one place. The official FPTU syllabus &amp; slides live on <strong>FLM</strong>; below are widely used reference books and free resources (cited, not reproduced).</p>
<h3>📘 Reference textbooks</h3>
<ul>
<li><em>Financial Modeling</em> — Simon Benninga (MIT Press) — the standard Excel-based corporate finance modelling text.</li>
<li><em>Financial Modeling and Valuation</em> — Paul Pignataro (Wiley) — 3-statement modelling, DCF and LBO from the banker's playbook.</li>
</ul>
<h3>🌐 Official / free documentation &amp; courses</h3>
<ul>
<li><a href="https://www.wallstreetprep.com/knowledge/" target="_blank" rel="noopener">Wall Street Prep — Knowledge Center</a> — free articles on 3-statement models, DCF, LBO.</li>
<li><a href="https://corporatefinanceinstitute.com/resources/financial-modeling/" target="_blank" rel="noopener">CFI — Financial Modeling resources</a></li>
<li><a href="https://support.microsoft.com/en-us/excel" target="_blank" rel="noopener">Microsoft Excel official support &amp; function reference</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@Kenji-Explains" target="_blank" rel="noopener">Kenji Explains</a> — practical Excel &amp; finance modelling walkthroughs.</li>
<li><a href="https://www.youtube.com/@corporatefinanceinstitute" target="_blank" rel="noopener">Corporate Finance Institute</a> — modelling &amp; valuation tutorials.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li>Microsoft Excel (or Google Sheets) — the only tool required for this course.</li>
<li><a href="https://www.investopedia.com/" target="_blank" rel="noopener">Investopedia</a> — quick lookups for finance terms while modelling.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — Excel best practices, formulas, error checks (Chapters 1-2).</li>
<li><strong>Core build</strong> — link the 3 statements, then forecast revenue/costs, working capital and debt (Chapters 3-5).</li>
<li><strong>Valuation</strong> — discount the model's own cash flows with DCF/WACC (Chapter 6).</li>
<li><strong>Stress-test &amp; present</strong> — sensitivity/scenario analysis, then LBO/M&amp;A basics and a presentable output (Chapters 7-8).</li>
</ol></div>`,
    `<span class="eyebrow">FIM302c · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Mô hình hoá tài chính</strong> — chuẩn Excel, mô hình 3 báo cáo tài chính, dự báo, định giá và LBO/M&amp;A cơ bản — gom về một chỗ. Giáo trình &amp; slide chính thức của FPTU nằm trên <strong>FLM</strong>; bên dưới là sách tham khảo phổ biến và nguồn miễn phí (chỉ trích dẫn, không sao chép).</p>
<h3>📘 Sách tham khảo</h3>
<ul>
<li><em>Financial Modeling</em> — Simon Benninga (MIT Press) — giáo trình mô hình hoá tài chính doanh nghiệp trên Excel, được dùng chuẩn trong ngành.</li>
<li><em>Financial Modeling and Valuation</em> — Paul Pignataro (Wiley) — mô hình 3 báo cáo tài chính, DCF và LBO theo lối làm của ngân hàng đầu tư.</li>
</ul>
<h3>🌐 Tài liệu / khoá học chính thức, miễn phí</h3>
<ul>
<li><a href="https://www.wallstreetprep.com/knowledge/" target="_blank" rel="noopener">Wall Street Prep — Knowledge Center</a> — bài viết miễn phí về mô hình 3 báo cáo, DCF, LBO.</li>
<li><a href="https://corporatefinanceinstitute.com/resources/financial-modeling/" target="_blank" rel="noopener">CFI — Financial Modeling resources</a></li>
<li><a href="https://support.microsoft.com/en-us/excel" target="_blank" rel="noopener">Trang hỗ trợ Excel chính thức &amp; tra hàm của Microsoft</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@Kenji-Explains" target="_blank" rel="noopener">Kenji Explains</a> — hướng dẫn Excel &amp; mô hình tài chính thực tế.</li>
<li><a href="https://www.youtube.com/@corporatefinanceinstitute" target="_blank" rel="noopener">Corporate Finance Institute</a> — video mô hình hoá &amp; định giá.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li>Microsoft Excel (hoặc Google Sheets) — công cụ duy nhất cần cho môn này.</li>
<li><a href="https://www.investopedia.com/" target="_blank" rel="noopener">Investopedia</a> — tra nhanh thuật ngữ tài chính khi dựng mô hình.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — chuẩn Excel, hàm, kiểm tra lỗi (Chương 1-2).</li>
<li><strong>Dựng cốt lõi</strong> — liên kết 3 báo cáo tài chính, rồi dự báo doanh thu/chi phí, vốn lưu động và nợ (Chương 3-5).</li>
<li><strong>Định giá</strong> — chiết khấu dòng tiền của chính mô hình bằng DCF/WACC (Chương 6).</li>
<li><strong>Kiểm định &amp; trình bày</strong> — độ nhạy/kịch bản, rồi LBO/M&amp;A cơ bản và một bản trình bày gọn (Chương 7-8).</li>
</ol></div>`,
  ]]);

const intro = doc('fim302c-0-1-overview', 'Course overview: Financial Modelling|||Tổng quan: Mô hình hoá tài chính',
  'Mô hình tài chính là gì, dùng để làm gì; lộ trình 8 chương từ chuẩn Excel đến 3 báo cáo tài chính, dự báo, DCF/WACC, độ nhạy/kịch bản và LBO/M&A.',
  [[
    `<span class="eyebrow">FIM302c · Lesson 0.1 · Overview</span>
<h2>What is a financial model?</h2>
<p class="lead">A <strong>financial model</strong> is a spreadsheet that turns a set of <strong>assumptions</strong> (growth rate, margins, interest rate...) into projected <strong>financial statements and outputs</strong> (valuation, cash needs, returns) — built so that changing one assumption automatically flows through every downstream number. It answers "what if" questions: what if revenue grows 8% instead of 5%? What if we take on more debt?</p>
<h3>Why it matters</h3>
<ul>
<li><strong>Valuation</strong> — DCF models estimate what a company is worth.</li>
<li><strong>Fundraising &amp; budgeting</strong> — forecast cash needs, plan a budget.</li>
<li><strong>M&amp;A / LBO</strong> — decide whether a deal creates value and how it is financed.</li>
<li><strong>Decision support</strong> — compare scenarios (best/base/worst case) before committing capital.</li>
</ul>
<h3>Roadmap (8 chapters)</h3>
<p>Excel best practices &amp; techniques (1-2) → the 3-statement model (3) → forecasting revenue &amp; costs (4) → working capital &amp; debt schedules (5) → DCF valuation &amp; cost of capital (6) → sensitivity &amp; scenario analysis (7) → LBO/M&amp;A basics &amp; presenting a model (8). All numbers in worked examples are <strong>assumed</strong>, for illustration only.</p>`,
    `<span class="eyebrow">FIM302c · Bài 0.1 · Tổng quan</span>
<h2>Mô hình tài chính là gì?</h2>
<p class="lead">Một <strong>mô hình tài chính</strong> là một bảng tính biến các <strong>giả định</strong> (tốc độ tăng trưởng, biên lợi nhuận, lãi suất...) thành <strong>báo cáo tài chính dự phóng và các kết quả</strong> (định giá, nhu cầu tiền mặt, lợi nhuận) — được dựng sao cho đổi một giả định thì mọi số phía sau tự chảy theo. Nó trả lời câu hỏi "nếu thì": nếu doanh thu tăng 8% thay vì 5% thì sao? Nếu vay thêm nợ thì sao?</p>
<h3>Vì sao quan trọng</h3>
<ul>
<li><strong>Định giá</strong> — mô hình DCF ước lượng giá trị một doanh nghiệp.</li>
<li><strong>Gọi vốn &amp; lập ngân sách</strong> — dự báo nhu cầu tiền mặt, lập kế hoạch ngân sách.</li>
<li><strong>M&amp;A / LBO</strong> — quyết định một giao dịch có tạo giá trị không và được tài trợ ra sao.</li>
<li><strong>Hỗ trợ quyết định</strong> — so sánh kịch bản (tốt nhất/cơ sở/xấu nhất) trước khi bỏ vốn.</li>
</ul>
<h3>Lộ trình (8 chương)</h3>
<p>Chuẩn &amp; kỹ thuật Excel (1-2) → mô hình 3 báo cáo tài chính (3) → dự báo doanh thu &amp; chi phí (4) → vốn lưu động &amp; lịch khấu hao/nợ (5) → định giá DCF &amp; chi phí vốn (6) → phân tích độ nhạy &amp; kịch bản (7) → LBO/M&amp;A cơ bản &amp; trình bày mô hình (8). Mọi số trong ví dụ đều là <strong>GIẢ ĐỊNH</strong>, chỉ để minh hoạ.</p>`,
  ]]);

const c1 = doc('fim302c-1-1-overview-excel-practices', '1.1 — Financial modelling & Excel best practices|||1.1 — Mô hình hoá tài chính & chuẩn Excel',
  'Quy trình dựng mô hình (giả định→báo cáo→kết quả); chuẩn màu ô (xanh dương/đen/xanh lá); một dòng chảy trái→phải, không hardcode trong công thức, dòng kiểm tra cân đối.',
  [[
    `<span class="eyebrow">FIM302c · Chapter 1 · Lesson 1.1</span>
<h2>Financial modelling &amp; Excel best practices</h2>
<h3>The modelling flow</h3>
<p>Every model follows the same shape: <strong>Assumptions</strong> (inputs you control) → <strong>Statements</strong> (formulas that compute from assumptions) → <strong>Outputs</strong> (valuation, charts, a summary dashboard). Keep these on separate sheets or clearly separated blocks — never bury an assumption inside a formula on statement sheets.</p>
<h3>The color convention (industry standard)</h3>
<pre><code>Blue font   = hardcoded input (an assumption you typed, e.g. 5%)
Black font  = formula (calculated from other cells on the SAME sheet)
Green font  = link (pulls a value from ANOTHER sheet/workbook)
Red font    = flags a check that failed, or a number to double-check
</code></pre>
<p>This lets anyone open the file and instantly tell what is an assumption vs. a calculation vs. a link — without reading a single formula.</p>
<h3>Structural rules</h3>
<ul>
<li><strong>One formula, one direction</strong> — build left to right, top to bottom (time flows left-to-right across columns); never reference a cell to the right of the current one.</li>
<li><strong>Never hardcode inside a formula.</strong> Wrong: <code>=Revenue*1.05</code>. Right: <code>=Revenue*(1+GrowthRateCell)</code> where GrowthRateCell is a blue input.</li>
<li><strong>One row, one consistent formula</strong> — copy the same formula across every period in a row; a broken pattern is the #1 source of silent errors.</li>
<li><strong>Add check rows</strong> — e.g. a balance-sheet check that must equal zero every period:</li>
</ul>
<pre><code>Row: Balance check = Total Assets - (Total Liabilities + Total Equity)
Formula: =B_Assets - (B_Liabilities + B_Equity)
Expect: 0 in every single period. Any nonzero value = a modelling bug.</code></pre>
<div class="callout"><span class="badge">Why it matters</span> A model is read by other people (investors, your boss, a banker) far more often than it is built. Consistent structure and color coding are what make a model <em>auditable</em> — the actual skill being graded in this course.</div>`,
    `<span class="eyebrow">FIM302c · Chương 1 · Bài 1.1</span>
<h2>Mô hình hoá tài chính &amp; chuẩn Excel</h2>
<h3>Dòng chảy dựng mô hình</h3>
<p>Mọi mô hình đều theo một hình dạng: <strong>Giả định</strong> (đầu vào bạn kiểm soát) → <strong>Báo cáo</strong> (công thức tính từ giả định) → <strong>Kết quả</strong> (định giá, biểu đồ, bảng tổng hợp). Tách các phần này thành sheet riêng hoặc khối rõ ràng — không bao giờ giấu một giả định trong công thức ở sheet báo cáo.</p>
<h3>Quy ước màu (chuẩn ngành)</h3>
<pre><code>Chữ xanh dương = số nhập tay (giả định bạn gõ, vd 5%)
Chữ đen        = công thức (tính từ ô khác trên CÙNG sheet)
Chữ xanh lá    = liên kết (lấy giá trị từ sheet/file KHÁC)
Chữ đỏ         = báo hiệu kiểm tra thất bại, hoặc số cần soát lại
</code></pre>
<p>Nhờ vậy ai mở file cũng biết ngay đâu là giả định, đâu là tính toán, đâu là liên kết — không cần đọc từng công thức.</p>
<h3>Quy tắc cấu trúc</h3>
<ul>
<li><strong>Một chiều công thức</strong> — dựng từ trái sang phải, trên xuống dưới (thời gian chạy trái→phải theo cột); không tham chiếu tới ô bên phải ô hiện tại.</li>
<li><strong>Không bao giờ hardcode trong công thức.</strong> Sai: <code>=Revenue*1.05</code>. Đúng: <code>=Revenue*(1+GrowthRateCell)</code> với GrowthRateCell là ô xanh dương.</li>
<li><strong>Một dòng, một công thức nhất quán</strong> — sao chép cùng công thức qua mọi kỳ trên một dòng; công thức bị gãy giữa dòng là nguồn lỗi âm thầm số 1.</li>
<li><strong>Thêm dòng kiểm tra</strong> — vd dòng cân đối bảng cân đối kế toán, phải bằng 0 mọi kỳ:</li>
</ul>
<pre><code>Dòng: Kiểm tra cân đối = Tổng tài sản - (Tổng nợ + Tổng vốn chủ)
Công thức: =B_TaiSan - (B_No + B_VonChu)
Kỳ vọng: 0 ở MỌI kỳ. Bất kỳ số khác 0 = mô hình có lỗi.</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Một mô hình được ĐỌC bởi người khác (nhà đầu tư, cấp trên, banker) nhiều hơn hẳn số lần được DỰNG. Cấu trúc nhất quán và quy ước màu là thứ giúp mô hình <em>kiểm chứng được</em> — kỹ năng thực sự được đánh giá trong môn này.</div>`,
  ]]);

const q1 = quiz('fim302c-quiz-1', 'Quiz 1 — Overview & best practices|||Quiz 1 — Tổng quan & chuẩn Excel', [
  { id: 'q1', question: 'Theo quy ước màu chuẩn ngành, chữ MÀU XANH DƯƠNG trong Excel model thể hiện điều gì?', options: ['Công thức tính từ ô khác', 'Số nhập tay (giả định)', 'Liên kết từ sheet khác', 'Ô đang có lỗi'], correctIndex: 1, explanation: 'Xanh dương = hardcode, tức số giả định bạn tự gõ vào.' },
  { id: 'q2', question: 'Vì sao KHÔNG nên viết công thức dạng =Revenue*1.05 để tăng trưởng 5%?', options: ['Excel không tính được số thập phân', 'Vì 1.05 hardcode ngay trong công thức, phải tách ra ô giả định riêng', 'Vì công thức quá ngắn', 'Vì phải dùng hàm SUM'], correctIndex: 1, explanation: 'Số giả định phải nằm ở một ô riêng (xanh dương) để đổi một chỗ, khớp mọi công thức liên quan.' },
  { id: 'q3', question: 'Dòng "kiểm tra cân đối" (balance check) trên bảng cân đối kế toán nên bằng bao nhiêu ở mọi kỳ nếu mô hình đúng?', options: ['1', '100', '0', 'Bằng doanh thu'], correctIndex: 2, explanation: 'Tài sản = Nợ + Vốn chủ luôn đúng; check = Tài sản − (Nợ+Vốn chủ) phải = 0.' },
]);

const c2 = doc('fim302c-2-1-excel-techniques', '2.1 — Excel techniques for finance|||2.1 — Kỹ thuật Excel cho tài chính',
  'Hàm cốt lõi (IF/IFERROR, SUMIF, INDEX/MATCH thay VLOOKUP); định dạng số nhất quán; kiểm tra lỗi & bật/tắt tham chiếu vòng (circularity switch).',
  [[
    `<span class="eyebrow">FIM302c · Chapter 2 · Lesson 2.1</span>
<h2>Excel techniques for finance</h2>
<h3>Functions you will use constantly</h3>
<ul>
<li><strong>IF / IFERROR</strong> — branch logic and swallow errors gracefully: <code>=IFERROR(Revenue/Units,0)</code> avoids a #DIV/0 crashing the model.</li>
<li><strong>SUMIF / SUMIFS</strong> — total a range based on a condition, e.g. sum all costs tagged "Variable".</li>
<li><strong>INDEX/MATCH</strong> — preferred over VLOOKUP: it looks up in either direction and does not break when a column is inserted. <code>=INDEX(range, MATCH(lookup_value, lookup_range, 0))</code>.</li>
<li><strong>CHOOSE / OFFSET</strong> — build a scenario switch that returns a different input set depending on a toggle cell (used heavily in Chapter 7).</li>
</ul>
<h3>Consistent formatting</h3>
<pre><code>Currency:      #,##0        (no decimals for large $ figures)
Percentages:   0.0%         (one decimal, always as %)
Negatives:     (1,234)      (parentheses, red for negative — never a bare minus in a P&amp;L)
Multiples:     0.0x         (for valuation multiples, e.g. 8.5x EBITDA)
</code></pre>
<h3>Error checks &amp; circularity</h3>
<p>When interest expense depends on a debt balance that itself depends on cash flow (which depends on interest expense), Excel creates a <strong>circular reference</strong>. Handle it with a manual "circularity switch":</p>
<pre><code>Switch cell (blue input): CircSwitch = 1  (or 0)
Interest expense formula: =IF(CircSwitch=1, AvgDebtBalance*RatePct, 0)
</code></pre>
<p>Setting CircSwitch to 0 breaks the loop instantly so you can debug the rest of the model, then flip it back to 1.</p>
<div class="callout"><span class="badge">Rule of thumb</span> If a formula needs more than one screen-width to read, it is doing too much — split it into a labelled helper row instead.</div>`,
    `<span class="eyebrow">FIM302c · Chương 2 · Bài 2.1</span>
<h2>Kỹ thuật Excel cho tài chính</h2>
<h3>Các hàm dùng liên tục</h3>
<ul>
<li><strong>IF / IFERROR</strong> — rẽ nhánh logic và nuốt lỗi an toàn: <code>=IFERROR(Revenue/Units,0)</code> tránh #DIV/0 làm sập mô hình.</li>
<li><strong>SUMIF / SUMIFS</strong> — cộng một vùng theo điều kiện, vd cộng mọi chi phí gắn nhãn "Biến đổi".</li>
<li><strong>INDEX/MATCH</strong> — nên dùng thay VLOOKUP: tra được cả hai chiều và không gãy khi chèn thêm cột. <code>=INDEX(range, MATCH(lookup_value, lookup_range, 0))</code>.</li>
<li><strong>CHOOSE / OFFSET</strong> — dựng công tắc kịch bản trả về bộ giả định khác nhau theo một ô bật/tắt (dùng nhiều ở Chương 7).</li>
</ul>
<h3>Định dạng nhất quán</h3>
<pre><code>Tiền:          #,##0        (không lẻ với số $ lớn)
Phần trăm:     0.0%         (một số lẻ, luôn kèm %)
Số âm:         (1.234)      (dấu ngoặc, màu đỏ — không dùng dấu trừ trần trong P&amp;L)
Hệ số định giá: 0.0x         (vd 8.5x EBITDA)
</code></pre>
<h3>Kiểm tra lỗi &amp; tham chiếu vòng</h3>
<p>Khi chi phí lãi vay phụ thuộc dư nợ, mà dư nợ lại phụ thuộc dòng tiền (dòng tiền lại phụ thuộc chi phí lãi vay), Excel tạo ra <strong>tham chiếu vòng</strong>. Xử lý bằng công tắc thủ công:</p>
<pre><code>Ô công tắc (nhập tay): CircSwitch = 1  (hoặc 0)
Công thức lãi vay: =IF(CircSwitch=1, AvgDebtBalance*RatePct, 0)
</code></pre>
<p>Đặt CircSwitch = 0 phá vòng ngay để bạn debug phần còn lại của mô hình, rồi bật lại thành 1.</p>
<div class="callout"><span class="badge">Nguyên tắc</span> Nếu một công thức dài quá một màn hình mới đọc hết, nó đang làm quá nhiều việc — tách ra một dòng phụ có nhãn rõ.</div>`,
  ]]);

const q2 = quiz('fim302c-quiz-2', 'Quiz 2 — Excel techniques|||Quiz 2 — Kỹ thuật Excel', [
  { id: 'q1', question: 'Vì sao INDEX/MATCH thường được ưu tiên hơn VLOOKUP trong mô hình tài chính?', options: ['INDEX/MATCH chạy nhanh hơn 10 lần', 'INDEX/MATCH tra được cả hai chiều và không gãy khi chèn thêm cột', 'VLOOKUP không tồn tại trong Excel mới', 'INDEX/MATCH không cần vùng tra cứu'], correctIndex: 1, explanation: 'VLOOKUP gãy nếu chèn cột vào giữa vùng tra; INDEX/MATCH linh hoạt và bền hơn.' },
  { id: 'q2', question: '"Công tắc tham chiếu vòng" (circularity switch) dùng để làm gì?', options: ['Tăng tốc độ tính toán của Excel', 'Cho phép tạm ngắt vòng lặp lãi vay↔dư nợ để debug mô hình', 'Đổi định dạng số âm', 'Tự động sửa lỗi #DIV/0'], correctIndex: 1, explanation: 'Đặt CircSwitch=0 để phá vòng lặp khi cần kiểm tra phần còn lại của mô hình.' },
  { id: 'q3', question: 'Trong bảng lãi lỗ (P&L) chuẩn, số âm nên được trình bày thế nào?', options: ['Dấu trừ trần, màu đen', 'Ngoặc đơn, thường tô màu đỏ, KHÔNG dùng dấu trừ trần', 'Viết chữ "âm" trước số', 'Bỏ dấu, chỉ ghi giá trị tuyệt đối'], correctIndex: 1, explanation: 'Chuẩn ngành: số âm trong ngoặc và/hoặc đỏ, không dùng dấu "-" trần.' },
]);

const c3 = doc('fim302c-3-1-three-statement-model', '3.1 — The 3-statement model|||3.1 — Mô hình 3 báo cáo tài chính',
  'Income statement, balance sheet, cash flow statement và cách chúng liên kết: lãi ròng→lợi nhuận giữ lại→dòng tiền (gián tiếp)→tiền cuối kỳ→bảng cân đối; nút thắt là dòng "plug" (revolver/tiền mặt).',
  [[
    `<span class="eyebrow">FIM302c · Chapter 3 · Lesson 3.1</span>
<h2>The 3-statement model</h2>
<h3>Three statements, one story</h3>
<ul>
<li><strong>Income statement</strong> — revenue minus costs over a period; ends in <strong>Net income</strong>.</li>
<li><strong>Balance sheet</strong> — a snapshot at one point in time: Assets = Liabilities + Equity.</li>
<li><strong>Cash flow statement</strong> — explains the change in cash: Operating + Investing + Financing activities.</li>
</ul>
<h3>The three links that connect them</h3>
<pre><code>Link 1: Net income (Income Statement) -&gt; Retained Earnings (Balance Sheet)
        Retained Earnings_t = Retained Earnings_(t-1) + Net Income_t - Dividends

Link 2: Net income + non-cash items (Depreciation) +/- working capital changes
        = Cash Flow from Operations (start of the Cash Flow Statement)

Link 3: Ending Cash (bottom of Cash Flow Statement) -&gt; Cash (Balance Sheet, Assets)
</code></pre>
<h3>Worked example (assumed numbers)</h3>
<pre><code>Net income (Year 1)              = 200
+ Depreciation (non-cash)        = 50
- Increase in Working Capital    = (30)
= Cash Flow from Operations      = 220
- Capex (Investing)              = (80)
- Debt repayment (Financing)     = (40)
= Net change in cash             = 100
Beginning cash                   = 150
Ending cash                      = 250  -&gt; flows into Balance Sheet as Cash
</code></pre>
<h3>The plug that keeps it balanced</h3>
<p>If, after every link is built, Assets still do not equal Liabilities+Equity, the model has a real error — <strong>never</strong> force-balance by hardcoding a number. In a full model, a <strong>cash sweep / revolver</strong> line (excess cash pays down debt; a cash shortfall draws on a credit line) is the intentional "plug" that keeps the balance sheet balanced as a genuine financing decision, not a hack.</p>
<div class="callout"><span class="badge">Build order</span> Build the Income Statement first (it needs the fewest links), then the Cash Flow Statement, then the Balance Sheet last — it depends on both of the others.</div>`,
    `<span class="eyebrow">FIM302c · Chương 3 · Bài 3.1</span>
<h2>Mô hình 3 báo cáo tài chính</h2>
<h3>Ba báo cáo, một câu chuyện</h3>
<ul>
<li><strong>Báo cáo kết quả kinh doanh (P&amp;L)</strong> — doanh thu trừ chi phí trong một kỳ; kết thúc bằng <strong>Lãi ròng</strong>.</li>
<li><strong>Bảng cân đối kế toán</strong> — ảnh chụp tại một thời điểm: Tài sản = Nợ + Vốn chủ sở hữu.</li>
<li><strong>Báo cáo lưu chuyển tiền tệ</strong> — giải thích thay đổi tiền mặt: Hoạt động kinh doanh + Đầu tư + Tài chính.</li>
</ul>
<h3>Ba liên kết nối chúng lại</h3>
<pre><code>Liên kết 1: Lãi ròng (P&amp;L) -&gt; Lợi nhuận giữ lại (Bảng cân đối)
            LNGL_năm t = LNGL_(t-1) + Lãi ròng_t - Cổ tức

Liên kết 2: Lãi ròng + khoản không phải tiền (khấu hao) +/- thay đổi vốn lưu động
            = Dòng tiền từ hoạt động kinh doanh (đầu báo cáo lưu chuyển tiền tệ)

Liên kết 3: Tiền cuối kỳ (cuối báo cáo lưu chuyển tiền tệ) -&gt; Tiền mặt (Bảng cân đối, phần Tài sản)
</code></pre>
<h3>Ví dụ minh hoạ (số giả định)</h3>
<pre><code>Lãi ròng (Năm 1)                 = 200
+ Khấu hao (không phải tiền)     = 50
- Tăng vốn lưu động              = (30)
= Dòng tiền từ HĐKD              = 220
- Chi đầu tư (Capex)             = (80)
- Trả nợ vay (Tài chính)         = (40)
= Thay đổi tiền mặt thuần        = 100
Tiền đầu kỳ                      = 150
Tiền cuối kỳ                     = 250  -&gt; nạp vào Bảng cân đối là Tiền mặt
</code></pre>
<h3>"Plug" giữ cân đối</h3>
<p>Nếu sau khi dựng đủ các liên kết mà Tài sản vẫn không bằng Nợ+Vốn chủ, mô hình đang có lỗi thật — <strong>không bao giờ</strong> ép cân bằng bằng cách gõ số cứng. Trong mô hình đầy đủ, dòng <strong>cash sweep / revolver</strong> (tiền dư trả nợ; thiếu tiền thì rút hạn mức tín dụng) chính là "plug" có chủ đích, giữ bảng cân đối luôn cân bằng như một quyết định tài chính thật, không phải mẹo vá lỗi.</p>
<div class="callout"><span class="badge">Thứ tự dựng</span> Dựng P&amp;L trước (ít liên kết nhất), rồi báo cáo lưu chuyển tiền tệ, và Bảng cân đối dựng SAU CÙNG — vì nó phụ thuộc cả hai báo cáo trên.</div>`,
  ]]);

const q3 = quiz('fim302c-quiz-3', 'Quiz 3 — 3-statement model|||Quiz 3 — Mô hình 3 báo cáo tài chính', [
  { id: 'q1', question: 'Lãi ròng từ P&L chảy vào Bảng cân đối kế toán qua khoản mục nào?', options: ['Tiền mặt', 'Lợi nhuận giữ lại (Retained Earnings)', 'Hàng tồn kho', 'Nợ dài hạn'], correctIndex: 1, explanation: 'Retained Earnings_t = Retained Earnings_(t-1) + Lãi ròng_t - Cổ tức.' },
  { id: 'q2', question: 'Thứ tự dựng 3 báo cáo tài chính hợp lý nhất là gì?', options: ['Bảng cân đối → P&L → lưu chuyển tiền tệ', 'P&L → lưu chuyển tiền tệ → Bảng cân đối', 'Lưu chuyển tiền tệ → Bảng cân đối → P&L', 'Dựng đồng thời cả ba, không có thứ tự'], correctIndex: 1, explanation: 'P&L ít liên kết nhất nên dựng trước; Bảng cân đối phụ thuộc cả hai báo cáo khác nên dựng sau cùng.' },
  { id: 'q3', question: 'Nếu Tài sản không bằng Nợ + Vốn chủ sau khi dựng xong mô hình, nên làm gì?', options: ['Gõ cứng một số vào ô Vốn chủ để ép bằng', 'Tìm lỗi liên kết thật trong mô hình, hoặc dùng dòng "plug" hợp lý (revolver/cash sweep)', 'Xoá bảng cân đối, chỉ giữ P&L', 'Bỏ qua vì sai lệch nhỏ luôn bình thường'], correctIndex: 1, explanation: 'Ép bằng bằng số cứng là che giấu lỗi; cần sửa liên kết hoặc dùng plug tài chính thật (revolver).' },
]);

const c4 = doc('fim302c-4-1-revenue-cost-forecasting', '4.1 — Forecasting revenue & costs (drivers)|||4.1 — Dự báo doanh thu & chi phí (drivers)',
  'Dự báo theo driver: doanh thu = số lượng×giá hoặc %tăng trưởng; chi phí biến đổi (%doanh thu) vs cố định; phân tích xu hướng lịch sử làm điểm neo giả định.',
  [[
    `<span class="eyebrow">FIM302c · Chapter 4 · Lesson 4.1</span>
<h2>Forecasting revenue &amp; costs (driver-based)</h2>
<h3>Two ways to forecast revenue</h3>
<ul>
<li><strong>Growth-rate method</strong> — simplest: <code>Revenue_t = Revenue_(t-1) * (1+g%)</code>. Good for a quick top-down estimate.</li>
<li><strong>Driver (build-up) method</strong> — more defensible: <code>Revenue = Units sold × Average price</code>, or <code>Revenue = # customers × Revenue per customer</code>. Forecast each driver separately using its own trend/assumption.</li>
</ul>
<h3>Costs: fixed vs. variable</h3>
<pre><code>Variable cost (moves with revenue): COGS = Revenue * COGS% (e.g. 60% of revenue)
Fixed cost (does not move with volume): Rent = a flat $ amount, escalated by inflation%
Semi-variable: Staff cost = Fixed headcount cost + Revenue-linked bonus %
</code></pre>
<h3>Worked example (assumed numbers, 3-year forecast)</h3>
<pre><code>                    Year 1   Year 2   Year 3
Units sold           1,000    1,100    1,210   (+10%/yr driver)
Avg price ($)           50       52       54   (+~4%/yr)
Revenue             50,000   57,200   65,340   = Units * Price
COGS (60% of Rev)   30,000   34,320   39,204
Gross profit        20,000   22,880   26,136
</code></pre>
<h3>Anchoring assumptions</h3>
<p>Every forecast assumption should be anchored to something observable: last 3 years' historical growth/margin average, management guidance, or an industry benchmark — never a number invented to "make the model work." Label every assumption cell with its source in a comment or an adjacent note column.</p>
<div class="callout"><span class="badge">Sanity check</span> After forecasting, compare projected margins to historical margins — a jump from a 60% to an 80% gross margin with no stated reason is almost always a modelling mistake, not a real improvement.</div>`,
    `<span class="eyebrow">FIM302c · Chương 4 · Bài 4.1</span>
<h2>Dự báo doanh thu &amp; chi phí (theo driver)</h2>
<h3>Hai cách dự báo doanh thu</h3>
<ul>
<li><strong>Theo tốc độ tăng trưởng</strong> — đơn giản nhất: <code>Doanh thu_t = Doanh thu_(t-1) * (1+g%)</code>. Phù hợp ước lượng nhanh từ trên xuống.</li>
<li><strong>Theo driver (build-up)</strong> — có cơ sở hơn: <code>Doanh thu = Số lượng bán × Giá bình quân</code>, hoặc <code>Doanh thu = Số khách hàng × Doanh thu/khách</code>. Dự báo từng driver riêng theo xu hướng/giả định của nó.</li>
</ul>
<h3>Chi phí: cố định vs biến đổi</h3>
<pre><code>Chi phí biến đổi (theo doanh thu): COGS = Doanh thu * %COGS (vd 60% doanh thu)
Chi phí cố định (không theo sản lượng): Thuê mặt bằng = một số $ cố định, tăng theo %lạm phát
Bán biến đổi: Chi phí nhân sự = Chi phí cố định theo đầu người + %thưởng theo doanh thu
</code></pre>
<h3>Ví dụ minh hoạ (số giả định, dự báo 3 năm)</h3>
<pre><code>                    Năm 1    Năm 2    Năm 3
Số lượng bán         1.000    1.100    1.210   (driver +10%/năm)
Giá bình quân ($)        50       52       54   (+~4%/năm)
Doanh thu            50.000   57.200   65.340   = Số lượng * Giá
COGS (60% DT)        30.000   34.320   39.204
Lãi gộp              20.000   22.880   26.136
</code></pre>
<h3>Neo giả định vào cơ sở thật</h3>
<p>Mọi giả định dự báo phải neo vào thứ quan sát được: bình quân tăng trưởng/biên lợi nhuận lịch sử 3 năm, hướng dẫn của ban lãnh đạo, hoặc chuẩn ngành — không bao giờ bịa số để "cho mô hình ra đúng ý". Ghi rõ nguồn của mỗi giả định trong comment hoặc cột chú thích bên cạnh.</p>
<div class="callout"><span class="badge">Kiểm tra hợp lý</span> Sau khi dự báo, so biên lợi nhuận dự phóng với lịch sử — biên lợi nhuận gộp nhảy từ 60% lên 80% mà không có lý do nêu rõ hầu như luôn là lỗi mô hình, không phải cải thiện thật.</div>`,
  ]]);

const q4 = quiz('fim302c-quiz-4', 'Quiz 4 — Revenue & cost forecasting|||Quiz 4 — Dự báo doanh thu & chi phí', [
  { id: 'q1', question: 'Phương pháp "driver (build-up)" dự báo doanh thu khác gì phương pháp tốc độ tăng trưởng?', options: ['Không cần dữ liệu lịch sử', 'Tách doanh thu thành các driver riêng (vd số lượng × giá) và dự báo từng phần', 'Chỉ dùng cho công ty mới thành lập', 'Luôn cho kết quả thấp hơn'], correctIndex: 1, explanation: 'Build-up dự báo từng driver (số lượng, giá...) riêng biệt, có cơ sở hơn một tỉ lệ tăng trưởng đơn.' },
  { id: 'q2', question: 'Chi phí COGS thường được mô hình hoá là loại chi phí nào?', options: ['Cố định, không đổi theo doanh thu', 'Biến đổi, theo % doanh thu', 'Luôn bằng 0', 'Chỉ phát sinh một lần'], correctIndex: 1, explanation: 'COGS thường tăng/giảm cùng doanh thu, nên mô hình theo %doanh thu.' },
  { id: 'q3', question: 'Nếu biên lợi nhuận gộp dự phóng nhảy từ 60% lên 80% mà không có lý do rõ, nên nghĩ gì?', options: ['Đó là kết quả tốt, không cần kiểm tra', 'Nhiều khả năng là lỗi mô hình, cần soát lại giả định/công thức', 'Luôn đúng nếu Excel không báo lỗi', 'Chỉ cần làm tròn số lại'], correctIndex: 1, explanation: 'Thay đổi biên lợi nhuận bất thường không có cơ sở là dấu hiệu lỗi công thức/giả định, phải kiểm tra lại.' },
]);

const c5 = doc('fim302c-5-1-working-capital-debt-schedule', '5.1 — Working capital & depreciation/debt schedules|||5.1 — Vốn lưu động & lịch khấu hao/nợ',
  'Chu kỳ vốn lưu động (DSO/DPO/DIO), tác động lên dòng tiền; lịch khấu hao đường thẳng; lịch nợ vay (dư đầu kỳ, giải ngân/trả nợ, lãi vay) và vòng lặp lãi vay-dư nợ.',
  [[
    `<span class="eyebrow">FIM302c · Chapter 5 · Lesson 5.1</span>
<h2>Working capital &amp; depreciation/debt schedules</h2>
<h3>Working capital, in days</h3>
<ul>
<li><strong>DSO (Days Sales Outstanding)</strong> — how long customers take to pay: <code>AR = Revenue * DSO/365</code>.</li>
<li><strong>DIO (Days Inventory Outstanding)</strong> — how long inventory sits: <code>Inventory = COGS * DIO/365</code>.</li>
<li><strong>DPO (Days Payable Outstanding)</strong> — how long you take to pay suppliers: <code>AP = COGS * DPO/365</code>.</li>
</ul>
<pre><code>Net Working Capital (NWC) = Accounts Receivable + Inventory - Accounts Payable
Change in NWC (cash flow impact) = NWC_(t-1) - NWC_t
  (an INCREASE in NWC ties up cash -&gt; SUBTRACTED in the cash flow statement)
</code></pre>
<h3>Depreciation schedule (straight-line, assumed numbers)</h3>
<pre><code>Existing PP&amp;E, net (BoP)        = 500
+ New Capex this year            = 100
- Depreciation this year         = (80)   [= Capex base / Useful life, simplified]
= PP&amp;E, net (EoP)                = 520     -&gt; feeds Balance Sheet
</code></pre>
<h3>Debt schedule &amp; the interest circularity</h3>
<pre><code>Beginning debt balance   = 1,000
+ New draws               = 0
- Mandatory repayment     = (100)
= Ending debt balance     = 900
Interest expense = Average balance * Rate% = ((1,000+900)/2) * 8% = 76
</code></pre>
<p>Because interest depends on the average of beginning and ending balance, and ending balance depends on cash flow (which is reduced by interest expense), this is circular — resolve with the circularity switch from Chapter 2.</p>
<div class="callout"><span class="badge">Common pitfall</span> Using the PRIOR year's ending balance (instead of the average) to compute interest understates interest expense whenever the company is paying down debt during the year.</div>`,
    `<span class="eyebrow">FIM302c · Chương 5 · Bài 5.1</span>
<h2>Vốn lưu động &amp; lịch khấu hao/nợ</h2>
<h3>Vốn lưu động, tính theo ngày</h3>
<ul>
<li><strong>DSO (số ngày thu tiền)</strong> — khách hàng trả tiền sau bao lâu: <code>Phải thu = Doanh thu * DSO/365</code>.</li>
<li><strong>DIO (số ngày tồn kho)</strong> — hàng nằm kho bao lâu: <code>Tồn kho = COGS * DIO/365</code>.</li>
<li><strong>DPO (số ngày trả tiền nhà cung cấp)</strong> — mình trả nhà cung cấp sau bao lâu: <code>Phải trả = COGS * DPO/365</code>.</li>
</ul>
<pre><code>Vốn lưu động thuần (NWC) = Phải thu + Tồn kho - Phải trả
Thay đổi NWC (ảnh hưởng dòng tiền) = NWC_(t-1) - NWC_t
  (NWC TĂNG -&gt; giữ chân tiền mặt -&gt; bị TRỪ trong báo cáo lưu chuyển tiền tệ)
</code></pre>
<h3>Lịch khấu hao (đường thẳng, số giả định)</h3>
<pre><code>Tài sản cố định thuần đầu kỳ   = 500
+ Capex mới trong năm           = 100
- Khấu hao trong năm            = (80)   [= giá trị Capex / thời gian sử dụng, đơn giản hoá]
= Tài sản cố định thuần cuối kỳ = 520     -&gt; nạp vào Bảng cân đối
</code></pre>
<h3>Lịch nợ vay &amp; vòng lặp lãi vay</h3>
<pre><code>Dư nợ đầu kỳ        = 1.000
+ Giải ngân mới      = 0
- Trả nợ gốc bắt buộc = (100)
= Dư nợ cuối kỳ      = 900
Chi phí lãi vay = Dư nợ bình quân * Lãi suất = ((1.000+900)/2) * 8% = 76
</code></pre>
<p>Vì lãi vay phụ thuộc dư nợ bình quân (đầu+cuối kỳ), mà dư nợ cuối kỳ lại phụ thuộc dòng tiền (dòng tiền bị trừ bởi chính lãi vay), đây là tham chiếu vòng — xử lý bằng công tắc tham chiếu vòng ở Chương 2.</p>
<div class="callout"><span class="badge">Lỗi thường gặp</span> Dùng dư nợ CUỐI KỲ NĂM TRƯỚC (thay vì bình quân) để tính lãi vay sẽ làm chi phí lãi vay bị tính THIẾU mỗi khi công ty đang trả dần nợ trong năm.</div>`,
  ]]);

const q5 = quiz('fim302c-quiz-5', 'Quiz 5 — Working capital & debt schedule|||Quiz 5 — Vốn lưu động & lịch nợ', [
  { id: 'q1', question: 'Nếu Vốn lưu động thuần (NWC) TĂNG so với kỳ trước, điều này ảnh hưởng dòng tiền thế nào?', options: ['Làm tăng dòng tiền hoạt động', 'Làm giảm dòng tiền hoạt động (tiền bị giữ chân)', 'Không ảnh hưởng gì tới dòng tiền', 'Chỉ ảnh hưởng dòng tiền đầu tư'], correctIndex: 1, explanation: 'NWC tăng nghĩa là tiền bị giữ trong phải thu/tồn kho nhiều hơn, làm giảm dòng tiền từ hoạt động kinh doanh.' },
  { id: 'q2', question: 'Vì sao lãi vay thường được tính trên dư nợ BÌNH QUÂN (đầu kỳ + cuối kỳ)/2 thay vì chỉ dư nợ cuối kỳ?', options: ['Vì Excel yêu cầu vậy', 'Vì phản ánh đúng hơn số dư nợ thực tế trong suốt kỳ khi công ty đang trả/vay thêm nợ', 'Vì dư nợ cuối kỳ luôn bằng 0', 'Vì lãi suất luôn thay đổi giữa kỳ'], correctIndex: 1, explanation: 'Dư nợ thay đổi trong kỳ; lấy bình quân đầu-cuối phản ánh sát hơn mức nợ thực mang lãi.' },
  { id: 'q3', question: 'Việc lãi vay phụ thuộc dư nợ, dư nợ phụ thuộc dòng tiền, dòng tiền lại phụ thuộc lãi vay tạo ra hiện tượng gì trong Excel?', options: ['Lỗi cú pháp công thức', 'Tham chiếu vòng (circular reference)', 'Lỗi định dạng số', 'Không có hiện tượng gì đặc biệt'], correctIndex: 1, explanation: 'Đây là vòng lặp phụ thuộc kinh điển trong mô hình tài chính, cần công tắc tham chiếu vòng để xử lý.' },
]);

const c6 = doc('fim302c-6-1-dcf-wacc', '6.1 — DCF valuation & cost of capital (WACC)|||6.1 — Định giá DCF & chi phí vốn (WACC)',
  'Dòng tiền tự do (unlevered FCF); WACC = tỉ trọng vốn CSH×Re + tỉ trọng nợ×Rd×(1-thuế); CAPM tính Re; giá trị cuối kỳ (Gordon growth); chiết khấu về hiện tại → giá trị doanh nghiệp.',
  [[
    `<span class="eyebrow">FIM302c · Chapter 6 · Lesson 6.1</span>
<h2>DCF valuation &amp; cost of capital (WACC)</h2>
<h3>Unlevered Free Cash Flow (FCF)</h3>
<pre><code>EBIT
- Taxes (EBIT * Tax rate)
= NOPAT (Net Operating Profit After Tax)
+ Depreciation &amp; Amortization (non-cash)
- Capex
- Increase in Net Working Capital
= Unlevered Free Cash Flow (FCF)
</code></pre>
<h3>WACC — the discount rate</h3>
<pre><code>WACC = (E/V) * Re + (D/V) * Rd * (1 - Tax rate)
  E = market value of equity, D = market value of debt, V = E + D
  Re = cost of equity (via CAPM), Rd = cost of debt (pre-tax borrowing rate)

CAPM: Re = Rf + Beta * (Rm - Rf)
  Rf = risk-free rate (assumed 3%), Beta = 1.2, Market risk premium (Rm-Rf) = 6%
  Re = 3% + 1.2*6% = 10.2%
</code></pre>
<h3>Terminal value &amp; enterprise value (worked example, assumed numbers)</h3>
<pre><code>Terminal Value (Gordon growth) = FCF_finalYear * (1+g) / (WACC - g)
  FCF Year 5 = 300, perpetual growth g = 2.5%, WACC = 9%
  TV = 300*(1.025)/(0.09-0.025) = 307.5/0.065 = 4,731

Enterprise Value = PV(FCF Year1..5) + PV(Terminal Value)
  (discount each year's FCF and the TV back at WACC using 1/(1+WACC)^n)

Equity Value = Enterprise Value - Net Debt (Total Debt - Cash)
</code></pre>
<div class="callout"><span class="badge">Sanity check</span> Terminal value is usually 60-80% of total Enterprise Value in a DCF — if it is over 90%, the explicit forecast period is too short, or g is set dangerously close to WACC.</div>`,
    `<span class="eyebrow">FIM302c · Chương 6 · Bài 6.1</span>
<h2>Định giá DCF &amp; chi phí vốn (WACC)</h2>
<h3>Dòng tiền tự do không vay nợ (Unlevered FCF)</h3>
<pre><code>EBIT
- Thuế (EBIT * Thuế suất)
= NOPAT (Lãi hoạt động sau thuế)
+ Khấu hao (không phải tiền)
- Capex
- Tăng vốn lưu động thuần
= Dòng tiền tự do không vay nợ (FCF)
</code></pre>
<h3>WACC — lãi suất chiết khấu</h3>
<pre><code>WACC = (E/V) * Re + (D/V) * Rd * (1 - Thuế suất)
  E = giá trị thị trường vốn CSH, D = giá trị thị trường nợ vay, V = E + D
  Re = chi phí vốn CSH (tính bằng CAPM), Rd = chi phí nợ vay (lãi suất vay trước thuế)

CAPM: Re = Rf + Beta * (Rm - Rf)
  Rf = lãi suất không rủi ro (giả định 3%), Beta = 1,2, phần bù rủi ro thị trường (Rm-Rf) = 6%
  Re = 3% + 1,2*6% = 10,2%
</code></pre>
<h3>Giá trị cuối kỳ &amp; giá trị doanh nghiệp (ví dụ, số giả định)</h3>
<pre><code>Giá trị cuối kỳ (Gordon growth) = FCF_năm cuối * (1+g) / (WACC - g)
  FCF Năm 5 = 300, tăng trưởng vĩnh viễn g = 2,5%, WACC = 9%
  TV = 300*(1,025)/(0,09-0,025) = 307,5/0,065 = 4.731

Giá trị doanh nghiệp = PV(FCF Năm1..5) + PV(Giá trị cuối kỳ)
  (chiết khấu dòng tiền mỗi năm và TV về hiện tại theo 1/(1+WACC)^n)

Giá trị vốn CSH = Giá trị doanh nghiệp - Nợ vay thuần (Tổng nợ - Tiền mặt)
</code></pre>
<div class="callout"><span class="badge">Kiểm tra hợp lý</span> Giá trị cuối kỳ thường chiếm 60-80% tổng Giá trị doanh nghiệp trong DCF — nếu vượt 90%, giai đoạn dự báo rõ ràng quá ngắn, hoặc g được đặt quá gần WACC.</div>`,
  ]]);

const q6 = quiz('fim302c-quiz-6', 'Quiz 6 — DCF & WACC|||Quiz 6 — DCF & WACC', [
  { id: 'q1', question: 'Dòng tiền tự do không vay nợ (Unlevered FCF) được tính bắt đầu từ đâu?', options: ['Lãi ròng (Net income)', 'NOPAT (EBIT sau thuế)', 'Doanh thu', 'Tiền mặt đầu kỳ'], correctIndex: 1, explanation: 'Unlevered FCF = NOPAT + khấu hao - Capex - tăng vốn lưu động, không tính lãi vay (unlevered).' },
  { id: 'q2', question: 'Trong công thức WACC, vì sao chi phí nợ vay Rd được nhân với (1 - Thuế suất)?', options: ['Vì nợ vay luôn rẻ hơn vốn CSH', 'Vì chi phí lãi vay được khấu trừ thuế, tạo "lá chắn thuế" làm giảm chi phí nợ thực', 'Vì thuế suất luôn bằng chi phí nợ', 'Đó chỉ là quy ước không có ý nghĩa'], correctIndex: 1, explanation: 'Lãi vay được trừ trước thuế nên chi phí nợ thực tế thấp hơn lãi suất danh nghĩa, phản ánh bằng (1-thuế suất).' },
  { id: 'q3', question: 'Nếu giá trị cuối kỳ (terminal value) chiếm hơn 90% tổng giá trị doanh nghiệp trong DCF, điều này gợi ý gì?', options: ['Mô hình chắc chắn đúng, không cần kiểm tra', 'Giai đoạn dự báo rõ có thể quá ngắn, hoặc g quá gần WACC', 'Công ty đang lỗ', 'WACC bị tính bằng 0'], correctIndex: 1, explanation: 'Tỉ trọng terminal value quá cao là dấu hiệu cần kéo dài giai đoạn dự báo hoặc kiểm tra lại giả định g so với WACC.' },
]);

const c7 = doc('fim302c-7-1-sensitivity-scenario-data-table', '7.1 — Sensitivity, scenario analysis & data tables|||7.1 — Phân tích độ nhạy, kịch bản & data table',
  'Data table một chiều/hai chiều trong Excel để soát biến; công tắc kịch bản (Base/Bull/Bear) bằng CHOOSE; đọc kết quả để tìm biến ảnh hưởng lớn nhất tới output.',
  [[
    `<span class="eyebrow">FIM302c · Chapter 7 · Lesson 7.1</span>
<h2>Sensitivity, scenario analysis &amp; data tables</h2>
<h3>Why sensitize a model</h3>
<p>Every assumption is an estimate, not a fact. <strong>Sensitivity analysis</strong> answers: "how much does the output (e.g. Enterprise Value) move if this one assumption is wrong?" It turns a single-point answer into a range decision-makers can actually use.</p>
<h3>Excel data tables</h3>
<pre><code>One-way data table: vary ONE input (e.g. revenue growth%), read ONE output (e.g. Equity Value)
  Setup: put growth% values down a column, formula reference in the top-left corner cell,
  select the range, Data -&gt; What-If Analysis -&gt; Data Table -&gt; Column input cell = growth% cell.

Two-way data table: vary TWO inputs at once (e.g. WACC% down rows, growth% across columns),
  read the SAME output in a grid — shows how Enterprise Value changes across a 5x5 grid of
  WACC (8%-10%) x terminal growth (1.5%-3.5%) combinations.
</code></pre>
<h3>Scenario switches</h3>
<pre><code>Scenario toggle cell (blue input): ScenarioSwitch = 1 (Base), 2 (Bull), 3 (Bear)
Revenue growth% = CHOOSE(ScenarioSwitch, 5%, 9%, 2%)
Gross margin%   = CHOOSE(ScenarioSwitch, 40%, 44%, 35%)
</code></pre>
<p>One toggle cell instantly re-runs the entire model under a different growth/margin story — far faster than editing ten cells by hand for every case.</p>
<div class="callout"><span class="badge">Reading the output</span> The variable that swings the output the MOST across a reasonable range (often shown as a "tornado chart") is the one worth double-checking most carefully — and the one to discuss first with a decision-maker.</div>`,
    `<span class="eyebrow">FIM302c · Chương 7 · Bài 7.1</span>
<h2>Phân tích độ nhạy, kịch bản &amp; data table</h2>
<h3>Vì sao phải làm độ nhạy</h3>
<p>Mọi giả định đều là ước lượng, không phải sự thật. <strong>Phân tích độ nhạy</strong> trả lời: "kết quả (vd Giá trị doanh nghiệp) thay đổi bao nhiêu nếu một giả định này sai?" Nó biến một con số đơn lẻ thành một khoảng để người ra quyết định thực sự dùng được.</p>
<h3>Data table trong Excel</h3>
<pre><code>Data table một chiều: đổi MỘT biến (vd %tăng trưởng doanh thu), đọc MỘT kết quả (vd Giá trị vốn CSH)
  Thiết lập: liệt kê các mức %tăng trưởng theo cột, ô công thức ở góc trên-trái,
  chọn vùng, Data -&gt; What-If Analysis -&gt; Data Table -&gt; Column input cell = ô %tăng trưởng.

Data table hai chiều: đổi HAI biến cùng lúc (vd WACC% theo dòng, %tăng trưởng theo cột),
  đọc CÙNG một kết quả trong một lưới — cho thấy Giá trị doanh nghiệp thay đổi thế nào trên
  lưới 5x5 tổ hợp WACC (8%-10%) x tăng trưởng cuối kỳ (1,5%-3,5%).
</code></pre>
<h3>Công tắc kịch bản</h3>
<pre><code>Ô công tắc kịch bản (nhập tay): ScenarioSwitch = 1 (Cơ sở), 2 (Khả quan), 3 (Xấu)
%Tăng trưởng doanh thu = CHOOSE(ScenarioSwitch, 5%, 9%, 2%)
%Biên lợi nhuận gộp    = CHOOSE(ScenarioSwitch, 40%, 44%, 35%)
</code></pre>
<p>Một ô công tắc chạy lại toàn bộ mô hình theo câu chuyện tăng trưởng/biên lợi nhuận khác ngay lập tức — nhanh hơn nhiều so với sửa tay mười ô cho mỗi trường hợp.</p>
<div class="callout"><span class="badge">Đọc kết quả</span> Biến làm kết quả dao động MẠNH NHẤT trong một khoảng hợp lý (thường vẽ dưới dạng "tornado chart") là biến cần soát lại kỹ nhất — và là biến nên bàn đầu tiên với người ra quyết định.</div>`,
  ]]);

const q7 = quiz('fim302c-quiz-7', 'Quiz 7 — Sensitivity & scenario|||Quiz 7 — Độ nhạy & kịch bản', [
  { id: 'q1', question: 'Data table HAI CHIỀU trong Excel dùng để làm gì?', options: ['Đổi một biến, đọc nhiều kết quả', 'Đổi hai biến cùng lúc, đọc CÙNG một kết quả trên một lưới', 'Chỉ dùng để định dạng số', 'Thay thế hoàn toàn cho công thức IF'], correctIndex: 1, explanation: 'Data table hai chiều đặt biến 1 theo dòng, biến 2 theo cột, và đọc một output duy nhất tại mỗi giao điểm.' },
  { id: 'q2', question: 'Hàm CHOOSE(ScenarioSwitch, 5%, 9%, 2%) dùng để làm gì trong công tắc kịch bản?', options: ['Luôn trả về giá trị đầu tiên (5%)', 'Trả về một trong ba giá trị tuỳ theo ô ScenarioSwitch đang là 1, 2 hay 3', 'Tính tổng ba giá trị', 'Chỉ hoạt động với số nguyên dương'], correctIndex: 1, explanation: 'CHOOSE chọn giá trị thứ N trong danh sách theo chỉ số N — đây là cách dựng công tắc Base/Bull/Bear.' },
  { id: 'q3', question: 'Biến nào nên được soát kỹ nhất sau khi chạy phân tích độ nhạy?', options: ['Biến ít ảnh hưởng tới kết quả nhất', 'Biến làm kết quả dao động mạnh nhất trong khoảng hợp lý', 'Biến có màu xanh dương', 'Biến xuất hiện đầu tiên trong mô hình'], correctIndex: 1, explanation: 'Biến gây dao động lớn nhất tới output là rủi ro/đòn bẩy lớn nhất của mô hình, cần soát và bàn kỹ nhất.' },
]);

const c8 = doc('fim302c-8-1-lbo-ma-presentation', '8.1 — Basic LBO/M&A models & presenting a model|||8.1 — Mô hình LBO/M&A cơ bản & trình bày mô hình',
  'Cấu trúc LBO (sources & uses, trả nợ, IRR/MOIC); accretion/dilution trong M&A; nguyên tắc trình bày mô hình gọn, dễ đọc, sẵn sàng gửi đi.',
  [[
    `<span class="eyebrow">FIM302c · Chapter 8 · Lesson 8.1</span>
<h2>Basic LBO/M&amp;A models &amp; presenting a model</h2>
<h3>LBO basics: buy with debt, pay it down, sell</h3>
<pre><code>Sources &amp; Uses (assumed numbers, entry at 8.0x EBITDA of 100 = 800 purchase price)
Uses:                      Sources:
  Purchase Enterprise Value  800   Debt (5.0x EBITDA)         500
                                   Sponsor Equity (plug)      300
  Total Uses                 800   Total Sources              800

Over the hold period: pay down debt with FCF -&gt; equity grows as debt shrinks
Exit (Year 5, still at 8.0x EBITDA of 140) = 1,120 Enterprise Value
Exit equity = 1,120 - Remaining debt (250) = 870
MOIC (Multiple of Invested Capital) = 870 / 300 = 2.9x
IRR (5 years, MOIC 2.9x) ≈ 23.7% per year
</code></pre>
<h3>M&amp;A basics: is the deal accretive or dilutive?</h3>
<p>An acquisition is <strong>accretive</strong> if the combined company's pro-forma EPS is HIGHER than the acquirer's standalone EPS (dilutive if lower). It depends on the price paid, how the deal is financed (cash/debt/stock), and expected <strong>synergies</strong> (cost savings, cross-selling) — synergies must be realistic and time-phased, never assumed at 100% from day one.</p>
<h3>Presenting a model — the last, most-graded step</h3>
<ul>
<li><strong>One summary/dashboard tab</strong> up front — key assumptions and outputs a reader sees in 10 seconds, without digging into statement sheets.</li>
<li><strong>Hide helper columns/rows, not delete them</strong> — keep the audit trail, just tidy the view.</li>
<li><strong>Print-ready layout</strong> — page breaks, headers/footers, consistent number formatting across every tab.</li>
<li><strong>Label every sheet and every section</strong> — a model nobody but its author can navigate has failed at its main job: communicating.</li>
</ul>
<div class="callout"><span class="badge">Final check</span> Before sending a model out, re-run every check row (Chapter 1), re-toggle the circularity switch on (Chapter 2), and confirm the balance sheet still balances in EVERY period, including the terminal year.</div>`,
    `<span class="eyebrow">FIM302c · Chương 8 · Bài 8.1</span>
<h2>Mô hình LBO/M&amp;A cơ bản &amp; trình bày mô hình</h2>
<h3>LBO cơ bản: mua bằng nợ, trả dần, rồi bán</h3>
<pre><code>Sources &amp; Uses (số giả định, mua vào 8,0x EBITDA=100 -&gt; giá mua 800)
Sử dụng vốn:                Nguồn vốn:
  Giá mua doanh nghiệp  800    Nợ vay (5,0x EBITDA)      500
                               Vốn góp nhà đầu tư (plug) 300
  Tổng sử dụng vốn      800    Tổng nguồn vốn            800

Trong thời gian giữ: dùng FCF trả nợ -&gt; vốn CSH tăng khi nợ giảm
Bán ra (Năm 5, vẫn 8,0x EBITDA=140) = 1.120 giá trị doanh nghiệp
Vốn CSH khi bán = 1.120 - Nợ còn lại (250) = 870
MOIC (Bội số vốn đầu tư) = 870 / 300 = 2,9x
IRR (5 năm, MOIC 2,9x) ≈ 23,7%/năm
</code></pre>
<h3>M&amp;A cơ bản: giao dịch làm tăng hay giảm EPS?</h3>
<p>Một giao dịch mua lại được gọi là <strong>accretive (tăng EPS)</strong> nếu EPS hợp nhất sau sáp nhập CAO HƠN EPS độc lập của bên mua (dilutive/giảm EPS nếu thấp hơn). Điều này phụ thuộc giá mua, cách tài trợ giao dịch (tiền mặt/nợ/cổ phiếu), và <strong>synergies</strong> kỳ vọng (tiết giảm chi phí, bán chéo) — synergies phải thực tế và có tiến độ theo thời gian, không bao giờ giả định đạt 100% ngay từ ngày đầu.</p>
<h3>Trình bày mô hình — bước cuối, cũng là bước bị đánh giá nhiều nhất</h3>
<ul>
<li><strong>Một tab tổng hợp/dashboard</strong> ở đầu — giả định và kết quả chính người đọc thấy trong 10 giây, không cần lục vào các sheet báo cáo.</li>
<li><strong>Ẩn cột/dòng phụ trợ, không xoá</strong> — giữ dấu vết kiểm chứng, chỉ dọn gọn màn hình.</li>
<li><strong>Bố cục sẵn sàng in</strong> — ngắt trang, header/footer, định dạng số nhất quán trên mọi tab.</li>
<li><strong>Ghi nhãn mọi sheet và mọi phần</strong> — một mô hình chỉ tác giả mới đọc được là đã thất bại ở việc quan trọng nhất: truyền đạt.</li>
</ul>
<div class="callout"><span class="badge">Kiểm tra cuối</span> Trước khi gửi mô hình đi, chạy lại mọi dòng kiểm tra (Chương 1), bật lại công tắc tham chiếu vòng (Chương 2), và xác nhận bảng cân đối vẫn cân bằng ở MỌI kỳ, kể cả năm cuối cùng.</div>`,
  ]]);

const q8 = quiz('fim302c-quiz-8', 'Quiz 8 — LBO/M&A & presentation|||Quiz 8 — LBO/M&A & trình bày mô hình', [
  { id: 'q1', question: 'Trong cấu trúc "Sources & Uses" của một giao dịch LBO, khoản "Vốn góp nhà đầu tư" (Sponsor Equity) thường đóng vai trò gì?', options: ['Luôn bằng 0', 'Là phần "plug" bù cho phần Giá mua không được tài trợ bằng nợ vay', 'Là khoản vay lãi suất cao nhất', 'Chỉ xuất hiện khi công ty phá sản'], correctIndex: 1, explanation: 'Sponsor Equity lấp đầy phần còn lại của giá mua sau khi trừ đi phần tài trợ bằng nợ vay.' },
  { id: 'q2', question: 'Một giao dịch M&A được gọi là "accretive" khi nào?', options: ['Khi giá mua càng cao càng tốt', 'Khi EPS hợp nhất sau sáp nhập CAO HƠN EPS độc lập của bên mua', 'Khi công ty mục tiêu đang lỗ', 'Khi không có synergies nào cả'], correctIndex: 1, explanation: 'Accretive nghĩa là EPS pro-forma tăng so với EPS độc lập của bên mua; ngược lại là dilutive.' },
  { id: 'q3', question: 'Trước khi gửi một mô hình tài chính đi cho người khác xem, bước kiểm tra cuối cùng quan trọng nhất là gì?', options: ['Đổi toàn bộ màu chữ thành đen', 'Chạy lại mọi dòng kiểm tra cân đối và xác nhận bảng cân đối vẫn cân bằng ở mọi kỳ', 'Xoá hết các sheet phụ trợ', 'Đổi tên file thành "Final_v99"'], correctIndex: 1, explanation: 'Các dòng check (Chương 1) và việc bảng cân đối luôn bằng 0 ở mọi kỳ là bằng chứng mô hình không có lỗi liên kết.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'FIM302c',
    slug: 'fim302c-financial-modelling',
    title: 'Financial modelling',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/FIM302c.webp',
    shortDescription: 'Build a financial model from scratch: Excel best practices, the 3-statement model, revenue/cost forecasting, working capital & debt schedules, DCF & WACC, sensitivity/scenario analysis, and basic LBO/M&A models. Bilingual, with worked examples & quizzes.|||Dựng mô hình tài chính từ đầu: chuẩn Excel, mô hình 3 báo cáo tài chính, dự báo doanh thu/chi phí, vốn lưu động & lịch khấu hao/nợ, DCF & WACC, độ nhạy/kịch bản, và LBO/M&A cơ bản. Song ngữ, có ví dụ & quiz.',
    description: 'Môn <strong>FIM302c — Financial Modelling</strong> (khối Quản trị Kinh doanh, kỳ 5) dạy cách <strong>dựng một mô hình tài chính từ con số 0 trên Excel</strong>. Từ <strong>chuẩn &amp; kỹ thuật Excel</strong> (quy ước màu, hàm, kiểm tra lỗi) → <strong>mô hình 3 báo cáo tài chính</strong> liên kết → <strong>dự báo doanh thu &amp; chi phí</strong> theo driver → <strong>vốn lưu động &amp; lịch khấu hao/nợ</strong> → <strong>định giá DCF &amp; WACC</strong> → <strong>phân tích độ nhạy/kịch bản</strong> → <strong>LBO/M&amp;A cơ bản &amp; trình bày mô hình</strong>. Bám tinh thần giáo trình Benninga, Pignataro và các khoá Wall Street Prep/CFI, song ngữ, có ví dụ tính toán (số giả định) và quiz mỗi chương.',
    whatYouLearn: 'Quy ước màu & cấu trúc mô hình chuẩn; hàm Excel cho tài chính (IF/IFERROR, SUMIF, INDEX/MATCH, CHOOSE); dòng kiểm tra & công tắc tham chiếu vòng; liên kết P&L-Bảng cân đối-Lưu chuyển tiền tệ; dự báo doanh thu/chi phí theo driver; DSO/DPO/DIO & vốn lưu động; lịch khấu hao & lịch nợ vay; Unlevered FCF, WACC (CAPM), giá trị cuối kỳ, DCF; data table 1 chiều/2 chiều & công tắc kịch bản; cấu trúc LBO (Sources & Uses, IRR/MOIC), accretion/dilution M&A; trình bày mô hình chuyên nghiệp.',
    requirements: 'Kiến thức Kế toán tài chính & Tài chính doanh nghiệp cơ bản (đã học các môn nền BBA). Có Microsoft Excel hoặc Google Sheets.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách tham khảo (Benninga, Pignataro), khoá học Wall Street Prep/CFI, tài liệu miễn phí, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Mô hình tài chính là gì, dùng để làm gì, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan & chuẩn Excel|||Chapter 1 — Overview & Excel best practices', description: 'Quy trình dựng mô hình, quy ước màu, cấu trúc, dòng kiểm tra.', lessons: [c1, q1] },
    { title: 'Chương 2 — Kỹ thuật Excel cho tài chính|||Chapter 2 — Excel techniques for finance', description: 'Hàm cốt lõi, định dạng, kiểm tra lỗi & tham chiếu vòng.', lessons: [c2, q2] },
    { title: 'Chương 3 — Mô hình 3 báo cáo tài chính|||Chapter 3 — The 3-statement model', description: 'P&L, Bảng cân đối, lưu chuyển tiền tệ và các liên kết.', lessons: [c3, q3] },
    { title: 'Chương 4 — Dự báo doanh thu & chi phí|||Chapter 4 — Revenue & cost forecasting', description: 'Dự báo theo driver, chi phí cố định/biến đổi, neo giả định.', lessons: [c4, q4] },
    { title: 'Chương 5 — Vốn lưu động & lịch khấu hao/nợ|||Chapter 5 — Working capital & debt schedule', description: 'DSO/DPO/DIO, lịch khấu hao, lịch nợ & vòng lặp lãi vay.', lessons: [c5, q5] },
    { title: 'Chương 6 — Định giá DCF & WACC|||Chapter 6 — DCF valuation & WACC', description: 'Unlevered FCF, WACC/CAPM, giá trị cuối kỳ, chiết khấu.', lessons: [c6, q6] },
    { title: 'Chương 7 — Độ nhạy, kịch bản & data table|||Chapter 7 — Sensitivity, scenario & data tables', description: 'Data table 1/2 chiều, công tắc kịch bản, đọc kết quả.', lessons: [c7, q7] },
    { title: 'Chương 8 — LBO/M&A cơ bản & trình bày mô hình|||Chapter 8 — Basic LBO/M&A & presenting a model', description: 'Sources & Uses, IRR/MOIC, accretion/dilution, trình bày.', lessons: [c8, q8] },
  ],
};
