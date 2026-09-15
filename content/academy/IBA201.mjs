/**
 * IBA201 — Introduction to Business Analytics. Giáo trình tham khảo (trích
 * dẫn, KHÔNG upload PDF): Camm et al "Business Analytics"; Provost & Fawcett
 * "Data Science for Business"; Evans "Business Analytics". 8 chương nhập
 * môn — khái niệm & tư duy phân tích, KHÔNG đi sâu công cụ như BDA201 (Business
 * Data Analytics, đã có riêng). Song ngữ + ví dụ + quiz.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('iba201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình (trích dẫn), tài liệu chính thức miễn phí, YouTube, công cụ (Excel/Google Sheets), lộ trình tự học.',
  [[
    `<span class="eyebrow">IBA201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn the fundamentals of <strong>Business Analytics</strong> — analytics types, data-driven thinking, descriptive statistics, visualization, simple regression, what-if analysis — in one place. The full official slides &amp; giáo trình live on <strong>FLM</strong>; below are free, legal references and tools.</p>
<h3>📘 Textbooks (reference — not uploaded here)</h3>
<ul>
<li>Camm, Cochran, Fry, Ohlmann — <em>Business Analytics</em> (Cengage)</li>
<li>Provost &amp; Fawcett — <em>Data Science for Business</em> (O'Reilly)</li>
<li>Evans — <em>Business Analytics</em> (Pearson)</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — official FPTU giáo trình &amp; slides, sign in with your FPTU account</li>
<li><a href="https://www.investopedia.com/terms/b/business-analytics.asp" target="_blank" rel="noopener">Investopedia — Business Analytics</a></li>
<li><a href="https://www.coursera.org/articles/business-analytics" target="_blank" rel="noopener">Coursera — What Is Business Analytics?</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@ExcelIsFun" target="_blank" rel="noopener">ExcelIsFun</a> — spreadsheet functions, PivotTables, what-if tools</li>
<li><a href="https://www.youtube.com/@AlexTheAnalyst" target="_blank" rel="noopener">Alex The Analyst</a> — analytics career &amp; concepts explained simply</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li>Microsoft Excel or <a href="https://sheets.google.com" target="_blank" rel="noopener">Google Sheets</a> — charts, PivotTables, Goal Seek, Solver</li>
<li><a href="https://www.tableau.com/trial" target="_blank" rel="noopener">Tableau Public</a> — free data visualization</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — 3 types of analytics, data types &amp; quality, descriptive statistics.</li>
<li><strong>Practice</strong> — build charts and simple summaries in Excel/Sheets from a small dataset.</li>
<li><strong>Go deeper</strong> — simple regression, what-if analysis, basic optimization.</li>
<li><strong>Job-ready</strong> — tell a clear data story and make a defensible, ethical recommendation from real data.</li>
</ol></div>`,
    `<span class="eyebrow">IBA201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học nền tảng <strong>Phân tích kinh doanh</strong> — các loại phân tích, tư duy dựa trên dữ liệu, thống kê mô tả, trực quan hoá, hồi quy đơn giản, phân tích what-if — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là tài liệu tham khảo và công cụ miễn phí, hợp pháp.</p>
<h3>📘 Sách tham khảo (trích dẫn — không upload ở đây)</h3>
<ul>
<li>Camm, Cochran, Fry, Ohlmann — <em>Business Analytics</em> (Cengage)</li>
<li>Provost &amp; Fawcett — <em>Data Science for Business</em> (O'Reilly)</li>
<li>Evans — <em>Business Analytics</em> (Pearson)</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — giáo trình &amp; slide chính thức FPTU, đăng nhập bằng tài khoản FPTU</li>
<li><a href="https://www.investopedia.com/terms/b/business-analytics.asp" target="_blank" rel="noopener">Investopedia — Business Analytics</a></li>
<li><a href="https://www.coursera.org/articles/business-analytics" target="_blank" rel="noopener">Coursera — Business Analytics là gì?</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@ExcelIsFun" target="_blank" rel="noopener">ExcelIsFun</a> — hàm bảng tính, PivotTable, công cụ what-if</li>
<li><a href="https://www.youtube.com/@AlexTheAnalyst" target="_blank" rel="noopener">Alex The Analyst</a> — nghề &amp; khái niệm phân tích, giải thích đơn giản</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li>Microsoft Excel hoặc <a href="https://sheets.google.com" target="_blank" rel="noopener">Google Sheets</a> — biểu đồ, PivotTable, Goal Seek, Solver</li>
<li><a href="https://www.tableau.com/trial" target="_blank" rel="noopener">Tableau Public</a> — trực quan hoá dữ liệu miễn phí</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — 3 loại phân tích, loại &amp; chất lượng dữ liệu, thống kê mô tả.</li>
<li><strong>Luyện tập</strong> — dựng biểu đồ và bảng tóm tắt đơn giản trên Excel/Sheets từ một bộ dữ liệu nhỏ.</li>
<li><strong>Đào sâu</strong> — hồi quy đơn giản, phân tích what-if, tối ưu cơ bản.</li>
<li><strong>Sẵn sàng đi làm</strong> — kể một câu chuyện dữ liệu rõ ràng và đưa ra khuyến nghị có căn cứ, có đạo đức từ dữ liệu thật.</li>
</ol></div>`,
  ]]);

const intro = doc('iba201-0-1-overview', 'Course overview: Introduction to Business Analytics|||Tổng quan: Nhập môn Phân tích kinh doanh',
  'Business analytics là gì; vì sao doanh nghiệp cần nó; lộ trình 8 chương từ khái niệm đến kể chuyện dữ liệu & ra quyết định.',
  [[
    `<span class="eyebrow">IBA201 · Lesson 0.1 · Overview</span>
<h2>Introduction to Business Analytics</h2>
<p class="lead">This course is the <strong>conceptual foundation</strong> for using data in business decisions. You will not go deep into any single software tool here — that is covered by <strong>BDA201 (Business Data Analytics)</strong>. Instead you build the <strong>mental model</strong>: what business analytics is, the 3 types of analytics, what makes data trustworthy, how to summarize and visualize it, and how to turn numbers into a decision.</p>
<h3>Why it matters</h3>
<p>Every manager today is handed reports, dashboards and spreadsheets. The skill that separates a good analyst from a great one is not running the software — it's asking the right question, judging whether the data can answer it, and communicating the answer clearly.</p>
<h3>Roadmap (8 chapters)</h3>
<ol>
<li>What is business analytics &amp; its 3 types</li>
<li>Data-driven thinking &amp; the analyst's role</li>
<li>Data: types, sources &amp; quality</li>
<li>Descriptive statistics basics</li>
<li>Data visualization &amp; spreadsheets</li>
<li>Intro to predictive analytics (simple regression)</li>
<li>What-if analysis &amp; basic optimization</li>
<li>Data ethics, storytelling &amp; decision-making</li>
</ol>`,
    `<span class="eyebrow">IBA201 · Bài 0.1 · Tổng quan</span>
<h2>Nhập môn Phân tích kinh doanh</h2>
<p class="lead">Môn này là <strong>nền tảng khái niệm</strong> để dùng dữ liệu trong ra quyết định kinh doanh. Môn KHÔNG đi sâu vào một công cụ cụ thể — phần đó thuộc <strong>BDA201 (Business Data Analytics)</strong>. Thay vào đó bạn xây <strong>mô hình tư duy</strong>: business analytics là gì, 3 loại phân tích, điều gì làm dữ liệu đáng tin, cách tóm tắt và trực quan hoá nó, và cách biến số liệu thành quyết định.</p>
<h3>Vì sao quan trọng</h3>
<p>Mọi quản lý hôm nay đều nhận báo cáo, dashboard, bảng tính. Kỹ năng phân biệt một người phân tích tốt với xuất sắc không phải là chạy phần mềm — mà là hỏi đúng câu hỏi, đánh giá dữ liệu có trả lời được câu hỏi đó không, và truyền đạt câu trả lời rõ ràng.</p>
<h3>Lộ trình (8 chương)</h3>
<ol>
<li>Business analytics là gì &amp; 3 loại</li>
<li>Tư duy dựa trên dữ liệu &amp; vai trò người phân tích</li>
<li>Dữ liệu: loại, nguồn &amp; chất lượng</li>
<li>Thống kê mô tả cơ bản</li>
<li>Trực quan hoá dữ liệu &amp; bảng tính</li>
<li>Nhập môn phân tích dự đoán (hồi quy đơn giản)</li>
<li>Phân tích what-if &amp; tối ưu cơ bản</li>
<li>Đạo đức dữ liệu, kể chuyện &amp; ra quyết định</li>
</ol>`,
  ]]);

const c1 = doc('iba201-1-1-three-types', '1.1 — What is business analytics? The 3 types|||1.1 — Business analytics là gì? 3 loại phân tích',
  'Business analytics: dùng dữ liệu & mô hình để ra quyết định tốt hơn. 3 loại: mô tả (đã xảy ra gì), dự đoán (sẽ xảy ra gì), đề xuất (nên làm gì).',
  [[
    `<span class="eyebrow">IBA201 · Chapter 1 · Lesson 1.1</span>
<h2>What is business analytics? The 3 types</h2>
<p><strong>Business analytics</strong> is the practice of using data, statistical analysis and models to understand the past, anticipate the future and support better business decisions. It sits at the intersection of <em>data</em>, <em>math/statistics</em> and <em>business judgment</em>.</p>
<h3>The 3 types of analytics</h3>
<ul>
<li><strong>Descriptive analytics</strong> — "What happened?" Summarizes historical data: sales reports, dashboards, averages. Uses simple statistics and visualization.</li>
<li><strong>Predictive analytics</strong> — "What is likely to happen?" Uses patterns in historical data to forecast the future: regression, trend lines, churn prediction.</li>
<li><strong>Prescriptive analytics</strong> — "What should we do?" Recommends the best action given constraints: optimization, what-if simulation, decision rules.</li>
</ul>
<pre><code>Question type       Analytics type    Example
"How did we do?"  -> Descriptive   -> Last quarter's revenue by region
"What's next?"    -> Predictive    -> Forecast next month's demand
"What now?"       -> Prescriptive  -> Which product mix maximizes profit
</code></pre>
<p>Difficulty and value both increase from descriptive to prescriptive — but descriptive analytics is where every analysis starts, because you cannot predict or prescribe from data you have not first understood.</p>
<div class="callout"><span class="badge">Not the same as BDA201</span> This course stays at the <em>concept</em> level — one simple example per type. BDA201 (Business Data Analytics) goes deep into the tools and techniques for each type.</div>`,
    `<span class="eyebrow">IBA201 · Chương 1 · Bài 1.1</span>
<h2>Business analytics là gì? 3 loại phân tích</h2>
<p><strong>Business analytics</strong> (phân tích kinh doanh) là việc dùng dữ liệu, phân tích thống kê và mô hình để hiểu quá khứ, dự đoán tương lai và hỗ trợ ra quyết định kinh doanh tốt hơn. Nó nằm ở giao điểm của <em>dữ liệu</em>, <em>toán/thống kê</em> và <em>đánh giá kinh doanh</em>.</p>
<h3>3 loại phân tích</h3>
<ul>
<li><strong>Phân tích mô tả (descriptive)</strong> — "Đã xảy ra gì?" Tóm tắt dữ liệu lịch sử: báo cáo doanh số, dashboard, số trung bình. Dùng thống kê đơn giản và trực quan hoá.</li>
<li><strong>Phân tích dự đoán (predictive)</strong> — "Sắp xảy ra gì?" Dùng quy luật trong dữ liệu lịch sử để dự báo tương lai: hồi quy, đường xu hướng, dự đoán khách rời bỏ.</li>
<li><strong>Phân tích đề xuất (prescriptive)</strong> — "Nên làm gì?" Đề xuất hành động tốt nhất trong điều kiện giới hạn: tối ưu hoá, mô phỏng what-if, quy tắc ra quyết định.</li>
</ul>
<pre><code>Loại câu hỏi         Loại phân tích     Ví dụ
"Đã làm thế nào?"  -> Mô tả          -> Doanh thu quý trước theo vùng
"Sắp tới ra sao?"  -> Dự đoán        -> Dự báo nhu cầu tháng tới
"Giờ làm gì?"      -> Đề xuất        -> Cơ cấu sản phẩm nào tối đa lợi nhuận
</code></pre>
<p>Độ khó và giá trị đều tăng dần từ mô tả đến đề xuất — nhưng phân tích mô tả là nơi mọi phân tích bắt đầu, vì bạn không thể dự đoán hay đề xuất từ dữ liệu mà mình chưa hiểu.</p>
<div class="callout"><span class="badge">Không trùng BDA201</span> Môn này chỉ ở mức <em>khái niệm</em> — một ví dụ đơn giản cho mỗi loại. BDA201 (Business Data Analytics) mới đào sâu công cụ và kỹ thuật cho từng loại.</div>`,
  ]]);

const c1q = quiz('iba201-quiz-1', 'Quiz 1 — 3 types of analytics|||Quiz 1 — 3 loại phân tích', [
  { id: 'q1', question: 'Phân tích trả lời câu hỏi "Đã xảy ra gì?" là loại nào?', options: ['Predictive', 'Descriptive', 'Prescriptive', 'Diagnostic-only'], correctIndex: 1, explanation: 'Descriptive (mô tả) tóm tắt dữ liệu lịch sử — trả lời "đã xảy ra gì".' },
  { id: 'q2', question: 'Dự báo nhu cầu bán hàng tháng tới thuộc loại phân tích nào?', options: ['Descriptive', 'Predictive', 'Prescriptive', 'Không thuộc loại nào'], correctIndex: 1, explanation: 'Dự báo tương lai dựa trên quy luật dữ liệu quá khứ là predictive.' },
  { id: 'q3', question: 'Vì sao phân tích mô tả luôn là bước đầu tiên?', options: ['Vì nó rẻ nhất', 'Vì không thể dự đoán/đề xuất từ dữ liệu chưa hiểu', 'Vì luật yêu cầu', 'Vì phần mềm chỉ hỗ trợ nó'], correctIndex: 1, explanation: 'Phải hiểu dữ liệu đã xảy ra trước khi dự đoán hoặc đề xuất hành động.' },
]);

const c2 = doc('iba201-2-1-data-driven', '2.1 — Data-driven thinking & the analyst\'s role|||2.1 — Tư duy dựa trên dữ liệu & vai trò người phân tích',
  'Ra quyết định dựa dữ liệu vs. cảm tính; quy trình phân tích (hỏi→lấy→phân tích→quyết định); các vai trò trong doanh nghiệp dùng analytics.',
  [[
    `<span class="eyebrow">IBA201 · Chapter 2 · Lesson 2.1</span>
<h2>Data-driven thinking &amp; the analyst's role</h2>
<h3>Data-driven vs. intuition-only decisions</h3>
<p><strong>Data-driven thinking</strong> means forming a business decision by first asking a clear question, then checking what the data actually shows, before relying on gut feeling alone. It does not eliminate judgment — it disciplines it. Intuition still matters for questions data cannot answer (new markets, sudden events), but it should not override evidence that data clearly provides.</p>
<pre><code>A simple analytics cycle:
 1. Ask a business question   ("Why did churn rise last month?")
 2. Get the relevant data     (usage logs, support tickets, surveys)
 3. Analyze                   (descriptive stats, charts, comparisons)
 4. Decide &amp; act              (fix onboarding, adjust pricing)
 5. Measure the result -> back to step 1
</code></pre>
<h3>Who uses analytics in a business</h3>
<ul>
<li><strong>Business analyst</strong> — translates a business problem into a data question, interprets results for managers.</li>
<li><strong>Data analyst</strong> — closer to the data itself: cleans, summarizes, builds reports/dashboards.</li>
<li><strong>Manager/decision-maker</strong> — consumes the analysis, combines it with context and judgment, makes the call.</li>
</ul>
<div class="callout"><span class="badge">A common trap</span> "We have a dashboard" is not the same as "we are data-driven". A dashboard nobody reads before deciding changes nothing — the habit of checking data before deciding is what matters.</div>`,
    `<span class="eyebrow">IBA201 · Chương 2 · Bài 2.1</span>
<h2>Tư duy dựa trên dữ liệu &amp; vai trò người phân tích</h2>
<h3>Ra quyết định dựa dữ liệu vs. chỉ theo cảm tính</h3>
<p><strong>Tư duy dựa trên dữ liệu</strong> nghĩa là hình thành quyết định kinh doanh bằng cách trước tiên đặt câu hỏi rõ ràng, rồi kiểm tra dữ liệu thực sự cho thấy gì, trước khi chỉ dựa vào cảm tính. Nó không loại bỏ sự phán đoán — nó kỷ luật hoá phán đoán đó. Cảm tính vẫn quan trọng cho những câu hỏi dữ liệu không trả lời được (thị trường mới, biến cố bất ngờ), nhưng không nên lấn át bằng chứng mà dữ liệu đã cho thấy rõ.</p>
<pre><code>Chu trình phân tích đơn giản:
 1. Đặt câu hỏi kinh doanh   ("Vì sao khách rời bỏ tăng tháng trước?")
 2. Lấy dữ liệu liên quan    (log sử dụng, ticket hỗ trợ, khảo sát)
 3. Phân tích                (thống kê mô tả, biểu đồ, so sánh)
 4. Quyết định &amp; hành động   (sửa onboarding, chỉnh giá)
 5. Đo kết quả -> lặp lại bước 1
</code></pre>
<h3>Ai dùng analytics trong doanh nghiệp</h3>
<ul>
<li><strong>Business analyst</strong> — chuyển vấn đề kinh doanh thành câu hỏi dữ liệu, diễn giải kết quả cho quản lý.</li>
<li><strong>Data analyst</strong> — gần dữ liệu hơn: làm sạch, tóm tắt, dựng báo cáo/dashboard.</li>
<li><strong>Quản lý/người ra quyết định</strong> — tiếp nhận phân tích, kết hợp với bối cảnh và phán đoán, đưa ra quyết định cuối.</li>
</ul>
<div class="callout"><span class="badge">Cái bẫy thường gặp</span> "Chúng tôi có dashboard" không giống "chúng tôi dựa trên dữ liệu". Một dashboard không ai xem trước khi quyết định thì không thay đổi gì — thói quen kiểm tra dữ liệu trước khi quyết định mới là điều quan trọng.</div>`,
  ]]);

const c2q = quiz('iba201-quiz-2', 'Quiz 2 — Data-driven thinking|||Quiz 2 — Tư duy dựa trên dữ liệu', [
  { id: 'q1', question: 'Tư duy dựa trên dữ liệu nghĩa là gì?', options: ['Bỏ hẳn cảm tính', 'Kiểm tra dữ liệu trước khi quyết định, không chỉ theo cảm tính', 'Chỉ tin dashboard', 'Không cần hỏi câu hỏi kinh doanh'], correctIndex: 1, explanation: 'Nó kỷ luật hoá phán đoán bằng cách xem dữ liệu trước, không loại bỏ phán đoán.' },
  { id: 'q2', question: 'Trong chu trình phân tích, bước nào diễn ra TRƯỚC "lấy dữ liệu"?', options: ['Quyết định & hành động', 'Đo kết quả', 'Đặt câu hỏi kinh doanh', 'Dựng dashboard'], correctIndex: 2, explanation: 'Phải có câu hỏi rõ ràng trước khi biết cần lấy dữ liệu nào.' },
  { id: 'q3', question: 'Vì sao "có dashboard" chưa chắc là "dựa trên dữ liệu"?', options: ['Dashboard luôn sai', 'Nếu không ai xem trước khi quyết định thì nó không đổi được gì', 'Dashboard tốn tiền', 'Dashboard chỉ dành cho IT'], correctIndex: 1, explanation: 'Cái quyết định là thói quen kiểm tra dữ liệu trước khi hành động, không phải công cụ.' },
]);

const c3 = doc('iba201-3-1-data-types-quality', '3.1 — Data: types, sources & quality|||3.1 — Dữ liệu: loại, nguồn & chất lượng',
  'Dữ liệu có cấu trúc/không cấu trúc; nguồn nội bộ/bên ngoài, sơ cấp/thứ cấp; các chiều chất lượng dữ liệu; garbage in, garbage out.',
  [[
    `<span class="eyebrow">IBA201 · Chapter 3 · Lesson 3.1</span>
<h2>Data: types, sources &amp; quality</h2>
<h3>Types of data</h3>
<ul>
<li><strong>Structured</strong> — fits neatly into rows/columns (a sales spreadsheet, a database table).</li>
<li><strong>Unstructured</strong> — no fixed format (customer reviews, emails, images, social media posts).</li>
</ul>
<h3>Sources of data</h3>
<ul>
<li><strong>Internal</strong> — generated by the business itself: sales records, website logs, CRM.</li>
<li><strong>External</strong> — from outside: market reports, government statistics, social media.</li>
<li><strong>Primary</strong> — collected first-hand for a specific purpose (a survey you run yourself).</li>
<li><strong>Secondary</strong> — collected by someone else for another purpose, that you reuse.</li>
</ul>
<h3>Data quality dimensions</h3>
<pre><code>Accuracy     - is the value correct?
Completeness - are fields/records missing?
Consistency  - does the same fact match across systems?
Timeliness   - is the data recent enough to still be useful?
</code></pre>
<div class="callout"><span class="badge">Garbage in, garbage out (GIGO)</span> No analysis technique — however advanced — can produce a trustworthy result from bad data. Checking data quality FIRST is not optional busywork; it is the difference between a real insight and a confident-sounding mistake.</div>`,
    `<span class="eyebrow">IBA201 · Chương 3 · Bài 3.1</span>
<h2>Dữ liệu: loại, nguồn &amp; chất lượng</h2>
<h3>Các loại dữ liệu</h3>
<ul>
<li><strong>Có cấu trúc (structured)</strong> — nằm gọn trong hàng/cột (bảng tính doanh số, bảng trong database).</li>
<li><strong>Không cấu trúc (unstructured)</strong> — không có khuôn cố định (đánh giá của khách hàng, email, hình ảnh, bài đăng mạng xã hội).</li>
</ul>
<h3>Các nguồn dữ liệu</h3>
<ul>
<li><strong>Nội bộ</strong> — do chính doanh nghiệp sinh ra: hồ sơ bán hàng, log website, CRM.</li>
<li><strong>Bên ngoài</strong> — từ ngoài doanh nghiệp: báo cáo thị trường, thống kê nhà nước, mạng xã hội.</li>
<li><strong>Sơ cấp (primary)</strong> — thu thập trực tiếp cho một mục đích cụ thể (khảo sát bạn tự thực hiện).</li>
<li><strong>Thứ cấp (secondary)</strong> — do người khác thu thập cho mục đích khác, mà bạn dùng lại.</li>
</ul>
<h3>Các chiều chất lượng dữ liệu</h3>
<pre><code>Chính xác (accuracy)     - giá trị có đúng không?
Đầy đủ (completeness)    - có trường/bản ghi bị thiếu không?
Nhất quán (consistency)  - cùng một sự kiện có khớp giữa các hệ thống không?
Kịp thời (timeliness)    - dữ liệu còn đủ mới để dùng được không?
</code></pre>
<div class="callout"><span class="badge">Garbage in, garbage out (GIGO)</span> Không kỹ thuật phân tích nào — dù hiện đại đến đâu — cho ra kết quả đáng tin từ dữ liệu tồi. Kiểm tra chất lượng dữ liệu TRƯỚC không phải việc phụ; đó là sự khác biệt giữa một hiểu biết thật và một sai lầm nghe rất tự tin.</div>`,
  ]]);

const c3q = quiz('iba201-quiz-3', 'Quiz 3 — Data types & quality|||Quiz 3 — Loại & chất lượng dữ liệu', [
  { id: 'q1', question: 'Đánh giá của khách hàng viết tự do (không theo cột cố định) là loại dữ liệu gì?', options: ['Có cấu trúc', 'Không cấu trúc', 'Sơ cấp', 'Nội bộ'], correctIndex: 1, explanation: 'Không có khuôn cố định (rows/columns) → dữ liệu không cấu trúc.' },
  { id: 'q2', question: 'Chiều chất lượng dữ liệu nào hỏi "cùng một sự kiện có khớp giữa các hệ thống không?"', options: ['Accuracy', 'Timeliness', 'Consistency', 'Completeness'], correctIndex: 2, explanation: 'Consistency (nhất quán) kiểm tra sự khớp giữa các hệ thống/nguồn.' },
  { id: 'q3', question: '"Garbage in, garbage out" muốn nói gì?', options: ['Dữ liệu cũ luôn tốt hơn dữ liệu mới', 'Kỹ thuật phân tích hiện đại luôn khắc phục được dữ liệu tồi', 'Dữ liệu tồi thì kết quả phân tích cũng không đáng tin, dù kỹ thuật gì', 'Chỉ cần nhiều dữ liệu là đủ'], correctIndex: 2, explanation: 'Không kỹ thuật nào cứu được kết quả nếu đầu vào (dữ liệu) đã tồi.' },
]);

const c4 = doc('iba201-4-1-descriptive-statistics', '4.1 — Descriptive statistics basics|||4.1 — Thống kê mô tả cơ bản',
  'Đo xu hướng trung tâm (trung bình, trung vị, mode) & đo độ phân tán (khoảng biến thiên, phương sai, độ lệch chuẩn).',
  [[
    `<span class="eyebrow">IBA201 · Chapter 4 · Lesson 4.1</span>
<h2>Descriptive statistics basics</h2>
<h3>Central tendency — "where is the middle?"</h3>
<ul>
<li><strong>Mean</strong> — the average; sum of values divided by count. Sensitive to extreme values (outliers).</li>
<li><strong>Median</strong> — the middle value when sorted. Not affected by outliers — better for skewed data (e.g. salaries, house prices).</li>
<li><strong>Mode</strong> — the most frequent value. Useful for categorical data.</li>
</ul>
<h3>Dispersion — "how spread out?"</h3>
<ul>
<li><strong>Range</strong> — maximum minus minimum. Simple but sensitive to a single extreme value.</li>
<li><strong>Variance</strong> — the average squared distance from the mean.</li>
<li><strong>Standard deviation</strong> — the square root of variance; same unit as the data, so it's easier to interpret.</li>
</ul>
<pre><code>Monthly sales (5 months): 80, 85, 90, 95, 400
Mean   = (80+85+90+95+400) / 5 = 150
Median = 90                          &lt;- much more representative here
(the mean is pulled up hard by the 400 outlier)
</code></pre>
<div class="callout"><span class="badge">Choose the right average</span> When data has extreme outliers, the median usually tells the more honest story than the mean.</div>`,
    `<span class="eyebrow">IBA201 · Chương 4 · Bài 4.1</span>
<h2>Thống kê mô tả cơ bản</h2>
<h3>Đo xu hướng trung tâm — "trung tâm nằm ở đâu?"</h3>
<ul>
<li><strong>Trung bình (mean)</strong> — tổng giá trị chia số lượng. Nhạy với giá trị cực đoan (outlier).</li>
<li><strong>Trung vị (median)</strong> — giá trị nằm giữa khi sắp xếp. Không bị outlier ảnh hưởng — tốt hơn cho dữ liệu lệch (vd lương, giá nhà).</li>
<li><strong>Mode (yếu vị)</strong> — giá trị xuất hiện nhiều nhất. Hữu ích cho dữ liệu phân loại.</li>
</ul>
<h3>Đo độ phân tán — "trải rộng thế nào?"</h3>
<ul>
<li><strong>Khoảng biến thiên (range)</strong> — lớn nhất trừ nhỏ nhất. Đơn giản nhưng nhạy với một giá trị cực đoan duy nhất.</li>
<li><strong>Phương sai (variance)</strong> — khoảng cách bình phương trung bình so với trung bình.</li>
<li><strong>Độ lệch chuẩn (standard deviation)</strong> — căn bậc hai của phương sai; cùng đơn vị với dữ liệu, nên dễ diễn giải hơn.</li>
</ul>
<pre><code>Doanh số tháng (5 tháng): 80, 85, 90, 95, 400
Trung bình = (80+85+90+95+400) / 5 = 150
Trung vị   = 90                        &lt;- đại diện thực tế hơn nhiều ở đây
(trung bình bị kéo lên mạnh bởi outlier 400)
</code></pre>
<div class="callout"><span class="badge">Chọn đúng loại trung bình</span> Khi dữ liệu có giá trị cực đoan, trung vị thường kể câu chuyện trung thực hơn trung bình.</div>`,
  ]]);

const c4q = quiz('iba201-quiz-4', 'Quiz 4 — Descriptive statistics|||Quiz 4 — Thống kê mô tả', [
  { id: 'q1', question: 'Đo xu hướng trung tâm nào KHÔNG bị ảnh hưởng bởi giá trị cực đoan (outlier)?', options: ['Trung bình (mean)', 'Trung vị (median)', 'Range', 'Variance'], correctIndex: 1, explanation: 'Trung vị chỉ lấy giá trị giữa khi sắp xếp, không bị outlier kéo lệch.' },
  { id: 'q2', question: 'Độ lệch chuẩn (standard deviation) là?', options: ['Lớn nhất trừ nhỏ nhất', 'Giá trị xuất hiện nhiều nhất', 'Căn bậc hai của phương sai', 'Trung bình cộng'], correctIndex: 2, explanation: 'Standard deviation = √variance, cùng đơn vị với dữ liệu gốc.' },
  { id: 'q3', question: 'Với dữ liệu doanh số 80,85,90,95,400 — vì sao trung vị (90) đại diện tốt hơn trung bình (150)?', options: ['Vì trung vị luôn đúng hơn', 'Vì trung bình bị kéo lệch mạnh bởi giá trị 400', 'Vì trung vị tính nhanh hơn', 'Vì có 5 số liệu'], correctIndex: 1, explanation: 'Giá trị cực đoan 400 kéo trung bình lên cao, không phản ánh đa số các tháng.' },
]);

const c5 = doc('iba201-5-1-visualization-spreadsheets', '5.1 — Data visualization & spreadsheets|||5.1 — Trực quan hoá dữ liệu & bảng tính',
  'Chọn đúng loại biểu đồ (cột, đường, tròn, phân tán); nguyên tắc dashboard rõ ràng; hàm & PivotTable cơ bản trong Excel/Sheets.',
  [[
    `<span class="eyebrow">IBA201 · Chapter 5 · Lesson 5.1</span>
<h2>Data visualization &amp; spreadsheets</h2>
<h3>Choosing the right chart</h3>
<ul>
<li><strong>Bar chart</strong> — comparing categories (sales by product).</li>
<li><strong>Line chart</strong> — trend over time (revenue by month).</li>
<li><strong>Pie chart</strong> — share of a whole, only with few categories (market share).</li>
<li><strong>Scatter plot</strong> — relationship between two numeric variables (advertising spend vs. sales).</li>
</ul>
<h3>Dashboard principles</h3>
<p>A good dashboard answers a specific question at a glance: it has a clear title, the most important number is the most visible, and it avoids clutter (no more than a handful of charts per screen, consistent colors, no unnecessary 3D or decoration).</p>
<h3>Everyday spreadsheet building blocks</h3>
<pre><code>=AVERAGE(range)         - mean
=MEDIAN(range)          - median
=STDEV.S(range)         - sample standard deviation
PivotTable              - summarize/group large tables interactively
Conditional formatting  - highlight values above/below a threshold
</code></pre>
<div class="callout"><span class="badge">Common mistake</span> A pie chart with 12 slices is unreadable — that's a bar chart's job. Pick the chart for the QUESTION, not for looking impressive.</div>`,
    `<span class="eyebrow">IBA201 · Chương 5 · Bài 5.1</span>
<h2>Trực quan hoá dữ liệu &amp; bảng tính</h2>
<h3>Chọn đúng loại biểu đồ</h3>
<ul>
<li><strong>Biểu đồ cột (bar)</strong> — so sánh giữa các nhóm (doanh số theo sản phẩm).</li>
<li><strong>Biểu đồ đường (line)</strong> — xu hướng theo thời gian (doanh thu theo tháng).</li>
<li><strong>Biểu đồ tròn (pie)</strong> — tỉ trọng trong tổng, chỉ khi ít nhóm (thị phần).</li>
<li><strong>Biểu đồ phân tán (scatter)</strong> — quan hệ giữa hai biến số (chi quảng cáo vs. doanh số).</li>
</ul>
<h3>Nguyên tắc dashboard</h3>
<p>Một dashboard tốt trả lời một câu hỏi cụ thể ngay khi nhìn: có tiêu đề rõ ràng, số quan trọng nhất nổi bật nhất, và tránh rối mắt (không quá vài biểu đồ mỗi màn hình, màu nhất quán, không hiệu ứng 3D/trang trí thừa).</p>
<h3>Các khối bảng tính dùng hằng ngày</h3>
<pre><code>=AVERAGE(range)         - trung bình
=MEDIAN(range)          - trung vị
=STDEV.S(range)         - độ lệch chuẩn mẫu
PivotTable              - tóm tắt/nhóm bảng lớn tương tác
Conditional formatting  - tô nổi giá trị trên/dưới ngưỡng
</code></pre>
<div class="callout"><span class="badge">Lỗi thường gặp</span> Biểu đồ tròn với 12 múi là không thể đọc — đó là việc của biểu đồ cột. Chọn biểu đồ theo CÂU HỎI, không theo vẻ đẹp mắt.</div>`,
  ]]);

const c5q = quiz('iba201-quiz-5', 'Quiz 5 — Visualization & spreadsheets|||Quiz 5 — Trực quan hoá & bảng tính', [
  { id: 'q1', question: 'Muốn thấy xu hướng doanh thu qua 12 tháng, nên dùng biểu đồ nào?', options: ['Pie', 'Line', 'Scatter cho 1 biến', 'Không cần biểu đồ'], correctIndex: 1, explanation: 'Line chart phù hợp thể hiện xu hướng theo thời gian.' },
  { id: 'q2', question: 'Hàm Excel/Sheets nào cho độ lệch chuẩn mẫu?', options: ['=AVERAGE()', '=MEDIAN()', '=STDEV.S()', '=SUM()'], correctIndex: 2, explanation: 'STDEV.S tính độ lệch chuẩn mẫu.' },
  { id: 'q3', question: 'Vì sao biểu đồ tròn với 12 múi thường không phù hợp?', options: ['Pie chart luôn sai', 'Quá nhiều múi nhỏ khó so sánh, nên dùng bar chart', 'Excel không vẽ được', 'Chỉ dùng được với số âm'], correctIndex: 1, explanation: 'Pie chart chỉ đọc tốt với ít nhóm; nhiều nhóm nên dùng bar chart để so sánh.' },
]);

const c6 = doc('iba201-6-1-simple-regression', '6.1 — Intro to predictive analytics: simple regression|||6.1 — Nhập môn phân tích dự đoán: hồi quy đơn giản',
  'Tương quan (correlation) vs. quan hệ nhân quả; hồi quy tuyến tính đơn giản y = b0 + b1x; đọc R² để đánh giá độ khớp mô hình.',
  [[
    `<span class="eyebrow">IBA201 · Chapter 6 · Lesson 6.1</span>
<h2>Intro to predictive analytics: simple regression</h2>
<h3>Correlation is not causation</h3>
<p><strong>Correlation</strong> measures how strongly two variables move together, from -1 (perfectly opposite) to +1 (perfectly together). A strong correlation does NOT prove one variable causes the other — both could be driven by a third factor.</p>
<h3>Simple linear regression</h3>
<p>Regression fits a straight line through the data to predict a numeric outcome (<strong>y</strong>, e.g. sales) from one predictor (<strong>x</strong>, e.g. ad spend):</p>
<pre><code>y = b0 + b1 * x

b0 = intercept (predicted y when x = 0)
b1 = slope (change in y for each 1-unit increase in x)

Example: y = 20 + 3x  (x = thousand $ spent on ads, y = units sold)
 x = 10  ->  y = 20 + 3*10 = 50 units predicted
</code></pre>
<h3>How good is the fit? R²</h3>
<p><strong>R² (R-squared)</strong> ranges 0 to 1 and tells you what share of the variation in y is explained by x. R² = 0.70 means 70% of the change in sales is explained by ad spend — the rest is other factors (or noise).</p>
<div class="callout"><span class="badge">Extrapolation warning</span> A regression line is only trustworthy inside the range of x values you actually observed. Predicting far outside that range is guessing, not analytics.</div>`,
    `<span class="eyebrow">IBA201 · Chương 6 · Bài 6.1</span>
<h2>Nhập môn phân tích dự đoán: hồi quy đơn giản</h2>
<h3>Tương quan không phải quan hệ nhân quả</h3>
<p><strong>Tương quan (correlation)</strong> đo mức độ hai biến di chuyển cùng nhau, từ -1 (ngược hoàn toàn) đến +1 (cùng chiều hoàn toàn). Tương quan mạnh KHÔNG chứng minh biến này gây ra biến kia — cả hai có thể do một yếu tố thứ ba tác động.</p>
<h3>Hồi quy tuyến tính đơn giản</h3>
<p>Hồi quy khớp một đường thẳng qua dữ liệu để dự đoán một kết quả dạng số (<strong>y</strong>, vd doanh số) từ một biến dự báo (<strong>x</strong>, vd chi quảng cáo):</p>
<pre><code>y = b0 + b1 * x

b0 = hệ số chặn (y dự đoán khi x = 0)
b1 = độ dốc (y thay đổi bao nhiêu khi x tăng 1 đơn vị)

Ví dụ: y = 20 + 3x  (x = nghìn $ chi quảng cáo, y = số sản phẩm bán)
 x = 10  ->  y = 20 + 3*10 = 50 sản phẩm dự đoán
</code></pre>
<h3>Mô hình khớp tốt đến đâu? R²</h3>
<p><strong>R² (R-squared)</strong> nằm trong khoảng 0 đến 1, cho biết bao nhiêu phần biến động của y được giải thích bởi x. R² = 0.70 nghĩa là 70% thay đổi doanh số được giải thích bởi chi quảng cáo — phần còn lại là các yếu tố khác (hoặc nhiễu).</p>
<div class="callout"><span class="badge">Cảnh báo suy diễn ngoài phạm vi</span> Đường hồi quy chỉ đáng tin trong khoảng giá trị x mà bạn thực sự đã quan sát. Dự đoán xa ngoài khoảng đó là đoán, không phải phân tích.</div>`,
  ]]);

const c6q = quiz('iba201-quiz-6', 'Quiz 6 — Simple regression|||Quiz 6 — Hồi quy đơn giản', [
  { id: 'q1', question: 'Tương quan mạnh giữa hai biến có chứng minh biến này gây ra biến kia không?', options: ['Có, luôn luôn', 'Không — có thể do yếu tố thứ ba', 'Chỉ đúng khi R²=1', 'Chỉ đúng với dữ liệu lớn'], correctIndex: 1, explanation: 'Correlation không phải causation; một yếu tố thứ ba có thể tác động cả hai.' },
  { id: 'q2', question: 'Trong y = b0 + b1x, b1 nghĩa là gì?', options: ['Giá trị y khi x=0', 'Độ dốc — y thay đổi bao nhiêu khi x tăng 1 đơn vị', 'Số quan sát', 'Sai số ngẫu nhiên'], correctIndex: 1, explanation: 'b1 là hệ số góc (slope) của đường hồi quy.' },
  { id: 'q3', question: 'R² = 0.70 nghĩa là gì?', options: ['Mô hình đúng 70% số lần', '70% biến động của y được giải thích bởi x', 'Có 70 quan sát', 'Độ dốc bằng 0.70'], correctIndex: 1, explanation: 'R² là tỉ lệ phương sai của y được giải thích bởi biến x trong mô hình.' },
]);

const c7 = doc('iba201-7-1-what-if-optimization', '7.1 — What-if analysis & basic optimization|||7.1 — Phân tích what-if & tối ưu cơ bản',
  'Phân tích tình huống (scenario) & độ nhạy (sensitivity); Goal Seek/Data Table trong Excel; khái niệm tối ưu: biến quyết định, hàm mục tiêu, ràng buộc.',
  [[
    `<span class="eyebrow">IBA201 · Chapter 7 · Lesson 7.1</span>
<h2>What-if analysis &amp; basic optimization</h2>
<h3>What-if analysis</h3>
<p><strong>What-if analysis</strong> asks "if this input changes, what happens to the result?" — without changing anything for real. Two common forms:</p>
<ul>
<li><strong>Scenario analysis</strong> — compare a small set of named futures (best case / expected / worst case).</li>
<li><strong>Sensitivity analysis</strong> — vary ONE input across a range and watch how the output responds (e.g. Excel's <strong>Data Table</strong>); <strong>Goal Seek</strong> works backward: "what input gives me this target output?"</li>
</ul>
<h3>Basic optimization</h3>
<p>Optimization finds the BEST decision under limits, described with 3 pieces:</p>
<pre><code>Decision variables - what you can choose (units of product A and B to make)
Objective function  - what you're maximizing/minimizing (total profit)
Constraints          - limits you must respect (machine hours, budget, demand)

Example:
 Maximize profit = 5*A + 8*B
 subject to:  2*A + 3*B &lt;= 100   (machine hours)
              A &gt;= 0, B &gt;= 0
</code></pre>
<p>Spreadsheets solve small problems like this with <strong>Solver</strong> (Excel) or Google Sheets' equivalent add-on.</p>
<div class="callout"><span class="badge">Why it's prescriptive</span> This is the "what should we do" layer from Chapter 1 — optimization and what-if analysis turn a model into a recommended action, not just a number.</div>`,
    `<span class="eyebrow">IBA201 · Chương 7 · Bài 7.1</span>
<h2>Phân tích what-if &amp; tối ưu cơ bản</h2>
<h3>Phân tích what-if</h3>
<p><strong>Phân tích what-if</strong> hỏi "nếu đầu vào này thay đổi, kết quả sẽ ra sao?" — mà không thực sự thay đổi gì. Hai dạng phổ biến:</p>
<ul>
<li><strong>Phân tích tình huống (scenario)</strong> — so sánh vài tương lai được đặt tên (tốt nhất / kỳ vọng / xấu nhất).</li>
<li><strong>Phân tích độ nhạy (sensitivity)</strong> — thay đổi MỘT đầu vào trên một khoảng và xem đầu ra phản ứng thế nào (vd <strong>Data Table</strong> trong Excel); <strong>Goal Seek</strong> làm ngược lại: "đầu vào nào cho tôi đầu ra mục tiêu này?"</li>
</ul>
<h3>Tối ưu cơ bản</h3>
<p>Tối ưu hoá tìm quyết định TỐT NHẤT trong giới hạn, mô tả bằng 3 phần:</p>
<pre><code>Biến quyết định   - thứ bạn được chọn (số đơn vị sản phẩm A và B cần làm)
Hàm mục tiêu       - thứ bạn tối đa/tối thiểu hoá (tổng lợi nhuận)
Ràng buộc          - giới hạn phải tuân theo (giờ máy, ngân sách, nhu cầu)

Ví dụ:
 Tối đa lợi nhuận = 5*A + 8*B
 với ràng buộc:  2*A + 3*B &lt;= 100   (giờ máy)
                 A &gt;= 0, B &gt;= 0
</code></pre>
<p>Bảng tính giải các bài toán nhỏ như trên bằng <strong>Solver</strong> (Excel) hoặc add-on tương đương của Google Sheets.</p>
<div class="callout"><span class="badge">Vì sao thuộc "đề xuất"</span> Đây là tầng "nên làm gì" từ Chương 1 — tối ưu hoá và what-if biến một mô hình thành một hành động được khuyến nghị, không chỉ là một con số.</div>`,
  ]]);

const c7q = quiz('iba201-quiz-7', 'Quiz 7 — What-if & optimization|||Quiz 7 — What-if & tối ưu', [
  { id: 'q1', question: 'Công cụ Excel nào tìm "đầu vào nào cho tôi đầu ra mục tiêu này?"', options: ['Data Table', 'Goal Seek', 'PivotTable', 'Conditional Formatting'], correctIndex: 1, explanation: 'Goal Seek đi ngược từ kết quả mong muốn để tìm đầu vào cần có.' },
  { id: 'q2', question: 'Trong bài toán tối ưu, "hàm mục tiêu" là gì?', options: ['Giới hạn phải tuân theo', 'Thứ bạn tối đa/tối thiểu hoá', 'Biến bạn được chọn', 'Công cụ giải trong Excel'], correctIndex: 1, explanation: 'Hàm mục tiêu (objective function) là đại lượng cần tối đa hoặc tối thiểu hoá.' },
  { id: 'q3', question: 'Phân tích tình huống (scenario analysis) làm gì?', options: ['Thay đổi một đầu vào trên một khoảng liên tục', 'So sánh vài tương lai được đặt tên (tốt/kỳ vọng/xấu)', 'Giải phương trình hồi quy', 'Vẽ biểu đồ tròn'], correctIndex: 1, explanation: 'Scenario analysis so sánh một số ít tương lai đặt tên cụ thể, khác với sensitivity analysis dò liên tục.' },
]);

const c8 = doc('iba201-8-1-ethics-storytelling', '8.1 — Data ethics, storytelling & decision-making|||8.1 — Đạo đức dữ liệu, kể chuyện & ra quyết định',
  'Quyền riêng tư & thiên lệch (bias) trong dữ liệu/mô hình; nguyên tắc kể chuyện dữ liệu; kết hợp phân tích với phán đoán để ra quyết định cuối.',
  [[
    `<span class="eyebrow">IBA201 · Chapter 8 · Lesson 8.1</span>
<h2>Data ethics, storytelling &amp; decision-making</h2>
<h3>Data ethics</h3>
<ul>
<li><strong>Privacy</strong> — collect and use only what's needed; protect personal data; be transparent about how it's used.</li>
<li><strong>Bias</strong> — historical data can encode unfair patterns (e.g. past hiring data reflecting past discrimination); a model trained on it can repeat that unfairness at scale.</li>
<li><strong>Transparency</strong> — a recommendation backed by data should be explainable, not a black box nobody can question.</li>
</ul>
<h3>Data storytelling</h3>
<p>Numbers alone rarely change a decision — a clear story does. Good data storytelling has 3 parts:</p>
<pre><code>Audience   - what does THIS reader already know/care about?
Narrative  - one clear message, not ten charts with no point
Visual     - the simplest chart that makes the message obvious
</code></pre>
<h3>From analysis to decision</h3>
<p>Closing the loop from Chapter 1: descriptive analytics shows what happened, predictive shows what's likely, prescriptive suggests an action — but the final decision still combines that analysis with business context, ethics, and human judgment. Analytics informs the decision; it does not replace the decision-maker.</p>
<div class="callout"><span class="badge">Course wrap-up</span> You now have the full loop: define the question → check the data → describe/predict/prescribe with the right method → tell the story → decide responsibly.</div>`,
    `<span class="eyebrow">IBA201 · Chương 8 · Bài 8.1</span>
<h2>Đạo đức dữ liệu, kể chuyện &amp; ra quyết định</h2>
<h3>Đạo đức dữ liệu</h3>
<ul>
<li><strong>Quyền riêng tư</strong> — chỉ thu thập và dùng những gì cần thiết; bảo vệ dữ liệu cá nhân; minh bạch về cách dùng.</li>
<li><strong>Thiên lệch (bias)</strong> — dữ liệu lịch sử có thể mang định kiến bất công (vd dữ liệu tuyển dụng cũ phản ánh phân biệt trước đây); mô hình huấn luyện từ đó có thể lặp lại sự bất công đó ở quy mô lớn.</li>
<li><strong>Minh bạch</strong> — một khuyến nghị dựa trên dữ liệu cần giải thích được, không phải hộp đen không ai kiểm chứng được.</li>
</ul>
<h3>Kể chuyện dữ liệu (data storytelling)</h3>
<p>Chỉ riêng số liệu hiếm khi làm thay đổi quyết định — một câu chuyện rõ ràng mới làm được. Kể chuyện dữ liệu tốt có 3 phần:</p>
<pre><code>Người nghe   - người đọc NÀY đã biết/quan tâm điều gì?
Câu chuyện   - một thông điệp rõ ràng, không phải mười biểu đồ vô định
Hình ảnh     - biểu đồ đơn giản nhất làm thông điệp rõ ràng nhất
</code></pre>
<h3>Từ phân tích đến quyết định</h3>
<p>Khép lại vòng lặp từ Chương 1: phân tích mô tả cho biết đã xảy ra gì, dự đoán cho biết sắp xảy ra gì, đề xuất gợi ý hành động — nhưng quyết định cuối cùng vẫn kết hợp phân tích đó với bối cảnh kinh doanh, đạo đức và phán đoán con người. Analytics hỗ trợ quyết định; nó không thay thế người ra quyết định.</p>
<div class="callout"><span class="badge">Tổng kết môn</span> Bạn đã có đủ vòng lặp: xác định câu hỏi → kiểm tra dữ liệu → mô tả/dự đoán/đề xuất bằng phương pháp đúng → kể câu chuyện → ra quyết định có trách nhiệm.</div>`,
  ]]);

const c8q = quiz('iba201-quiz-8', 'Quiz 8 — Ethics, storytelling & decision-making|||Quiz 8 — Đạo đức, kể chuyện & ra quyết định', [
  { id: 'q1', question: 'Vì sao dữ liệu lịch sử có thể tạo ra mô hình thiên lệch (bias)?', options: ['Vì dữ liệu luôn ngẫu nhiên', 'Vì nó có thể mang định kiến bất công từ quá khứ, mô hình lặp lại điều đó', 'Vì dữ liệu lịch sử luôn thiếu', 'Vì mô hình không dùng dữ liệu cũ'], correctIndex: 1, explanation: 'Dữ liệu phản ánh định kiến quá khứ (vd tuyển dụng) có thể bị mô hình học lại và lặp ở quy mô lớn.' },
  { id: 'q2', question: 'Ba phần của kể chuyện dữ liệu tốt là gì?', options: ['Người nghe, câu chuyện, hình ảnh', 'Trung bình, trung vị, mode', 'Nội bộ, bên ngoài, sơ cấp', 'Mô tả, dự đoán, đề xuất'], correctIndex: 0, explanation: 'Data storytelling cần hiểu người nghe, có một câu chuyện rõ, và hình ảnh đơn giản làm nổi thông điệp.' },
  { id: 'q3', question: 'Analytics có thay thế người ra quyết định không?', options: ['Có, hoàn toàn', 'Không — nó hỗ trợ, quyết định cuối vẫn cần bối cảnh & phán đoán con người', 'Chỉ khi R² = 1', 'Chỉ với dữ liệu sơ cấp'], correctIndex: 1, explanation: 'Phân tích cung cấp thông tin cho quyết định, nhưng bối cảnh, đạo đức và phán đoán con người vẫn cần thiết.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'IBA201',
    slug: 'iba201-introduction-to-business-analytics',
    title: 'Introduction to Business Analytics',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/IBA201.webp',
    shortDescription: '3 types of analytics, data-driven thinking, data quality, descriptive statistics, visualization, simple regression, what-if & optimization, data ethics. Concept-focused, bilingual, with examples & quizzes.|||3 loại phân tích, tư duy dữ liệu, chất lượng dữ liệu, thống kê mô tả, trực quan hoá, hồi quy đơn giản, what-if & tối ưu, đạo đức dữ liệu. Tập trung khái niệm, song ngữ, có ví dụ & quiz.',
    description: 'Môn <strong>IBA201 — Introduction to Business Analytics</strong> (kỳ 3) là <strong>nền tảng khái niệm &amp; tư duy phân tích</strong> cho khối Quản trị Kinh doanh — khác với BDA201 (Business Data Analytics) đi sâu công cụ. Từ <strong>3 loại phân tích</strong> (mô tả/dự đoán/đề xuất) → <strong>tư duy dựa trên dữ liệu</strong> → <strong>dữ liệu &amp; chất lượng dữ liệu</strong> → <strong>thống kê mô tả</strong> → <strong>trực quan hoá &amp; bảng tính</strong> → <strong>hồi quy đơn giản</strong> → <strong>what-if &amp; tối ưu cơ bản</strong> → <strong>đạo đức dữ liệu &amp; kể chuyện</strong>. Song ngữ, có ví dụ tính toán và quiz mỗi chương.',
    whatYouLearn: '3 loại phân tích (descriptive/predictive/prescriptive); chu trình ra quyết định dựa dữ liệu; loại/nguồn/chất lượng dữ liệu (GIGO); trung bình/trung vị/mode, range/variance/độ lệch chuẩn; chọn biểu đồ & hàm bảng tính cơ bản; correlation vs. causation, hồi quy tuyến tính đơn giản & R²; scenario/sensitivity analysis, Goal Seek, khái niệm tối ưu (biến quyết định/hàm mục tiêu/ràng buộc); đạo đức dữ liệu & kể chuyện dữ liệu.',
    requirements: 'Không cần kiến thức phân tích trước đó. Nên có Excel hoặc Google Sheets để thực hành ví dụ.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình tham khảo, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Business analytics là gì, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — 3 loại phân tích|||Chapter 1 — The 3 types of analytics', description: 'Mô tả, dự đoán, đề xuất.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Tư duy dựa trên dữ liệu|||Chapter 2 — Data-driven thinking', description: 'Chu trình phân tích, vai trò trong doanh nghiệp.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Dữ liệu: loại, nguồn & chất lượng|||Chapter 3 — Data: types, sources & quality', description: 'Cấu trúc/không cấu trúc, GIGO.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Thống kê mô tả cơ bản|||Chapter 4 — Descriptive statistics basics', description: 'Trung bình, trung vị, độ lệch chuẩn.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Trực quan hoá & bảng tính|||Chapter 5 — Visualization & spreadsheets', description: 'Chọn biểu đồ, dashboard, Excel/Sheets.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Nhập môn phân tích dự đoán|||Chapter 6 — Intro to predictive analytics', description: 'Hồi quy đơn giản, R².', lessons: [c6, c6q] },
    { title: 'Chương 7 — What-if & tối ưu cơ bản|||Chapter 7 — What-if & basic optimization', description: 'Scenario, sensitivity, Goal Seek, Solver.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Đạo đức, kể chuyện & ra quyết định|||Chapter 8 — Ethics, storytelling & decision-making', description: 'Bias, data storytelling, quyết định cuối.', lessons: [c8, c8q] },
  ],
};
