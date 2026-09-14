/**
 * ABI301c — AI for BI Analysts (AI cho Chuyên viên phân tích kinh doanh thông
 * minh), khối Quản trị Kinh doanh (BBA) FPTU, Kỳ 5.
 * Môn ỨNG DỤNG AI vào công việc Business Intelligence hằng ngày (không phải
 * xây mô hình AI từ đầu). Nguồn chuẩn: Provost & Fawcett "Data Science for
 * Business"; Microsoft Power BI + Copilot docs; "Storytelling with Data"
 * (Cole Nussbaumer Knaflic); OpenAI/Google AI cho phân tích. Song ngữ + ví dụ
 * SQL/Python/DAX/prompt thật.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${; & → &amp;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('abi301c-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn quốc tế, tài liệu Power BI/Copilot chính thức, công cụ, lộ trình tự học 4 bước.',
  [[
    `<span class="eyebrow">ABI301c · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to use <strong>AI inside Business Intelligence work</strong> — data prep, augmented analytics, natural-language Q&amp;A, AI-powered dashboards, forecasting and generative reporting — in one place. The official slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for ABI301c are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://data-science-for-biz.com/" target="_blank" rel="noopener"><em>Data Science for Business</em> — Provost &amp; Fawcett</a> (the mental models behind every "AI insight")</li>
<li><a href="https://www.storytellingwithdata.com/" target="_blank" rel="noopener"><em>Storytelling with Data</em> — Cole Nussbaumer Knaflic</a> (turn a chart into a decision)</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://learn.microsoft.com/en-us/power-bi/" target="_blank" rel="noopener">Microsoft Learn — Power BI documentation</a></li>
<li><a href="https://learn.microsoft.com/en-us/power-bi/create-reports/copilot-introduction" target="_blank" rel="noopener">Copilot in Power BI — official docs</a></li>
<li><a href="https://platform.openai.com/docs" target="_blank" rel="noopener">OpenAI documentation</a> — prompting &amp; API basics</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.microsoft.com/en-us/power-platform/products/power-bi/downloads" target="_blank" rel="noopener">Power BI Desktop</a> — free, has Quick Insights &amp; Key Influencers built in</li>
<li><a href="https://colab.research.google.com/" target="_blank" rel="noopener">Google Colab</a> — free Python notebooks for data profiling (pandas)</li>
<li><a href="https://chat.openai.com/" target="_blank" rel="noopener">ChatGPT</a> / Microsoft Copilot — practice AI-drafted summaries &amp; text-to-SQL</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundations</strong> — what changes when AI joins BI; the analyst's job shifts from building reports to framing questions and checking AI's work.</li>
<li><strong>Prepare &amp; explore</strong> — use AI to profile and clean data faster; ask questions of data in plain language.</li>
<li><strong>Analyze &amp; predict</strong> — augmented analytics, auto-insights, no-code forecasting inside the BI tool.</li>
<li><strong>Communicate responsibly</strong> — let generative AI draft the narrative, but verify every number and check for bias before it reaches a decision-maker.</li>
</ol></div>`,
    `<span class="eyebrow">ABI301c · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để dùng <strong>AI trong công việc BI</strong> — chuẩn bị dữ liệu, phân tích tăng cường, hỏi đáp ngôn ngữ tự nhiên, dashboard có AI, dự báo và viết báo cáo bằng AI tạo sinh — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của ABI301c có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://data-science-for-biz.com/" target="_blank" rel="noopener"><em>Data Science for Business</em> — Provost &amp; Fawcett</a> (khung tư duy đứng sau mọi "insight do AI sinh ra")</li>
<li><a href="https://www.storytellingwithdata.com/" target="_blank" rel="noopener"><em>Storytelling with Data</em> — Cole Nussbaumer Knaflic</a> (biến một biểu đồ thành một quyết định)</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://learn.microsoft.com/en-us/power-bi/" target="_blank" rel="noopener">Microsoft Learn — tài liệu Power BI</a></li>
<li><a href="https://learn.microsoft.com/en-us/power-bi/create-reports/copilot-introduction" target="_blank" rel="noopener">Copilot trong Power BI — tài liệu chính thức</a></li>
<li><a href="https://platform.openai.com/docs" target="_blank" rel="noopener">Tài liệu OpenAI</a> — prompting &amp; cơ bản về API</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.microsoft.com/en-us/power-platform/products/power-bi/downloads" target="_blank" rel="noopener">Power BI Desktop</a> — miễn phí, có sẵn Quick Insights &amp; Key Influencers</li>
<li><a href="https://colab.research.google.com/" target="_blank" rel="noopener">Google Colab</a> — notebook Python miễn phí để profiling dữ liệu (pandas)</li>
<li><a href="https://chat.openai.com/" target="_blank" rel="noopener">ChatGPT</a> / Microsoft Copilot — luyện viết tóm tắt bằng AI &amp; text-to-SQL</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — AI thay đổi gì trong BI; việc của analyst chuyển từ dựng báo cáo sang đặt câu hỏi đúng và kiểm lại kết quả AI.</li>
<li><strong>Chuẩn bị &amp; khám phá</strong> — dùng AI để profiling, làm sạch dữ liệu nhanh hơn; hỏi dữ liệu bằng ngôn ngữ tự nhiên.</li>
<li><strong>Phân tích &amp; dự đoán</strong> — phân tích tăng cường, auto-insights, dự báo no-code ngay trong công cụ BI.</li>
<li><strong>Truyền đạt có trách nhiệm</strong> — để AI tạo sinh soạn câu chuyện, nhưng phải kiểm lại từng con số và soi thiên lệch trước khi tới người ra quyết định.</li>
</ol></div>`,
  ]]);

const intro = doc('abi301c-0-1-overview', 'Course overview: AI for BI Analysts|||Tổng quan: AI cho Chuyên viên phân tích kinh doanh thông minh',
  'Môn học làm gì; BI truyền thống vs BI được AI tăng cường; lộ trình 8 chương: từ vai trò analyst đang đổi → chuẩn bị dữ liệu, phân tích tăng cường, NLP → AI trong dashboard, dự báo → generative AI & đạo đức.',
  [[
    `<span class="eyebrow">ABI301c · Lesson 0.1 · Overview</span>
<h2>AI for BI Analysts</h2>
<p class="lead">This course is about <strong>using AI to do Business Intelligence better and faster</strong> — not about training machine-learning models from scratch. A BI analyst's core job stays the same (turn data into decisions); AI changes <em>how</em> that job gets done, at every step from raw data to the executive summary.</p>
<h3>Traditional BI vs AI-augmented BI</h3>
<ul>
<li><strong>Traditional BI</strong> — analyst writes SQL/DAX, builds charts, manually spots patterns, writes the narrative by hand. Slow, and only as deep as the analyst has time to dig.</li>
<li><strong>AI-augmented BI</strong> — AI profiles the data, surfaces patterns and outliers automatically, answers plain-language questions, drafts the narrative — the analyst frames the question, judges what the AI found, and owns the final call.</li>
</ul>
<h3>Roadmap (8 chapters)</h3>
<p>Where AI meets BI &amp; the analyst's changing role → AI-assisted data prep &amp; understanding → augmented analytics &amp; auto-insights → NLP &amp; natural-language Q&amp;A over data → AI inside the dashboard (Copilot, Quick Insights) → forecasting with no-code/low-code models → generative AI for reporting &amp; storytelling → AI ethics, data bias &amp; governance. Bilingual, with SQL/Python/DAX/prompt examples and a quiz per chapter.</p>
<div class="callout"><span class="badge">The one rule that never changes</span> AI can find a pattern faster than you. It cannot tell you whether that pattern matters to the business, or whether it is even real. That judgment call is still the analyst's job.</div>`,
    `<span class="eyebrow">ABI301c · Bài 0.1 · Tổng quan</span>
<h2>AI cho Chuyên viên phân tích kinh doanh thông minh</h2>
<p class="lead">Môn này nói về việc <strong>dùng AI để làm Business Intelligence tốt hơn và nhanh hơn</strong> — không phải huấn luyện mô hình máy học từ đầu. Việc cốt lõi của BI analyst không đổi (biến dữ liệu thành quyết định); AI đổi <em>cách</em> việc đó được làm, ở mọi bước từ dữ liệu thô tới bản tóm tắt gửi ban lãnh đạo.</p>
<h3>BI truyền thống so với BI được AI tăng cường</h3>
<ul>
<li><strong>BI truyền thống</strong> — analyst tự viết SQL/DAX, dựng biểu đồ, tự tay tìm mẫu hình, tự viết câu chuyện. Chậm, và chỉ sâu bằng thời gian analyst bỏ ra đào.</li>
<li><strong>BI được AI tăng cường</strong> — AI tự profiling dữ liệu, tự nêu mẫu hình &amp; điểm bất thường, trả lời câu hỏi bằng ngôn ngữ thường, tự soạn câu chuyện — analyst đặt đúng câu hỏi, đánh giá điều AI tìm ra, và chịu trách nhiệm cho quyết định cuối.</li>
</ul>
<h3>Lộ trình (8 chương)</h3>
<p>AI &amp; BI giao thoa, vai trò analyst đang đổi → chuẩn bị &amp; hiểu dữ liệu với hỗ trợ AI → phân tích tăng cường &amp; auto-insights → NLP &amp; hỏi đáp ngôn ngữ tự nhiên trên dữ liệu → AI trong dashboard (Copilot, Quick Insights) → dự báo bằng mô hình no-code/low-code → AI tạo sinh cho báo cáo &amp; storytelling → đạo đức AI, thiên lệch dữ liệu &amp; quản trị. Song ngữ, có ví dụ SQL/Python/DAX/prompt và quiz mỗi chương.</p>
<div class="callout"><span class="badge">Một quy tắc không bao giờ đổi</span> AI tìm ra mẫu hình nhanh hơn bạn. Nhưng nó không biết mẫu hình đó có quan trọng với doanh nghiệp hay không, hay liệu nó có thật hay không. Phán đoán đó vẫn là việc của analyst.</div>`,
  ]]);

const c1 = doc('abi301c-1-1-ai-bi-role', "1.1 — Where AI meets BI: the analyst's changing role|||1.1 — AI & BI giao thoa: vai trò analyst đang đổi",
  'BI là gì (thu thập→chuẩn hoá→trực quan hoá→quyết định); AI thêm vào đâu trong vòng lặp đó; vai trò analyst chuyển từ "người dựng báo cáo" sang "người giám sát & diễn giải AI".',
  [[
    `<span class="eyebrow">ABI301c · Chapter 1 · Lesson 1.1</span>
<h2>Where AI meets BI</h2>
<h3>What Business Intelligence does</h3>
<p><strong>BI</strong> turns raw operational data into charts, dashboards and reports that support decisions: collect data → clean &amp; model it → visualize it → decide and act. This loop existed long before AI — AI does not replace it, it speeds up and deepens every stage.</p>
<pre><code>Traditional BI loop:
  Collect -&gt; Clean (manual) -&gt; Visualize -&gt; Analyst reads it -&gt; Decide

AI-augmented BI loop:
  Collect -&gt; AI-assisted clean &amp; profile -&gt; AI auto-insights + NL Q&amp;A
          -&gt; Analyst verifies &amp; frames -&gt; AI drafts narrative -&gt; Decide
</code></pre>
<h3>The analyst's job is shifting, not disappearing</h3>
<ul>
<li><strong>Less</strong> time writing repetitive SQL/DAX and formatting charts by hand.</li>
<li><strong>More</strong> time asking sharper business questions, judging whether an AI-found pattern is real or noise, and being accountable for what gets shipped to decision-makers.</li>
<li><strong>New skill</strong> — "AI literacy": knowing what these tools are good at (finding patterns in large data fast) and bad at (knowing which patterns matter, or telling truth from a confident-sounding guess).</li>
</ul>
<div class="callout"><span class="badge">Why this matters</span> A BI analyst who cannot use AI tools works slower than one who can. A BI analyst who trusts AI output without checking it ships wrong numbers faster than ever. This course builds both halves.</div>`,
    `<span class="eyebrow">ABI301c · Chương 1 · Bài 1.1</span>
<h2>AI &amp; BI giao thoa ở đâu</h2>
<h3>Business Intelligence làm gì</h3>
<p><strong>BI</strong> biến dữ liệu vận hành thô thành biểu đồ, dashboard và báo cáo phục vụ ra quyết định: thu thập dữ liệu → làm sạch &amp; mô hình hoá → trực quan hoá → ra quyết định và hành động. Vòng lặp này có từ trước AI — AI không thay thế nó, mà tăng tốc và đào sâu từng bước.</p>
<pre><code>Vòng lặp BI truyền thống:
  Thu thập -&gt; Làm sạch (thủ công) -&gt; Trực quan hoá -&gt; Analyst đọc -&gt; Quyết định

Vòng lặp BI được AI tăng cường:
  Thu thập -&gt; AI hỗ trợ làm sạch &amp; profiling -&gt; AI tự nêu insight + hỏi đáp NL
          -&gt; Analyst kiểm lại &amp; đóng khung -&gt; AI soạn câu chuyện -&gt; Quyết định
</code></pre>
<h3>Việc của analyst đang chuyển, không biến mất</h3>
<ul>
<li><strong>Bớt</strong> thời gian viết SQL/DAX lặp lại và định dạng biểu đồ bằng tay.</li>
<li><strong>Thêm</strong> thời gian đặt câu hỏi kinh doanh sắc hơn, đánh giá mẫu hình AI tìm ra có thật hay chỉ là nhiễu, và chịu trách nhiệm cho thứ gửi tới người ra quyết định.</li>
<li><strong>Kỹ năng mới</strong> — "hiểu biết về AI": biết công cụ này giỏi gì (tìm mẫu hình trong dữ liệu lớn thật nhanh) và dở gì (biết mẫu hình nào quan trọng, hay phân biệt sự thật với một câu trả lời nghe chắc chắn nhưng sai).</li>
</ul>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Một BI analyst không dùng được AI thì làm việc chậm hơn người dùng được. Một BI analyst tin AI mà không kiểm lại thì gửi số liệu sai còn nhanh hơn trước. Môn này dựng cả hai nửa đó.</div>`,
  ]]);

const c1q = quiz('abi301c-quiz-1', 'Quiz 1 — AI & BI role|||Quiz 1 — AI & BI, vai trò analyst', [
  { id: 'q1', question: 'Vòng lặp cốt lõi của Business Intelligence là gì?', options: ['Thu thập → làm sạch → trực quan hoá → quyết định', 'Chỉ trực quan hoá', 'Chỉ thu thập dữ liệu', 'Huấn luyện mô hình máy học'], correctIndex: 0, explanation: 'BI biến dữ liệu thô thành quyết định qua chuỗi thu thập, làm sạch/mô hình hoá, trực quan hoá, rồi ra quyết định.' },
  { id: 'q2', question: 'AI thay đổi điều gì trong công việc BI analyst?', options: ['Xoá bỏ hoàn toàn vai trò analyst', 'Tăng tốc profiling/insight/soạn báo cáo, còn phán đoán & trách nhiệm vẫn của analyst', 'Chỉ dùng để vẽ biểu đồ đẹp hơn', 'Không thay đổi gì'], correctIndex: 1, explanation: 'AI làm nhanh các bước lặp lại; đánh giá mẫu hình có ý nghĩa hay không và chịu trách nhiệm vẫn là việc của con người.' },
  { id: 'q3', question: '"Hiểu biết về AI" (AI literacy) trong BI nghĩa là gì?', options: ['Biết lập trình mô hình AI từ đầu', 'Biết AI giỏi tìm mẫu hình nhanh nhưng không tự biết mẫu hình nào quan trọng hay đúng', 'Tin tuyệt đối mọi kết quả AI đưa ra', 'Không cần dùng AI trong công việc'], correctIndex: 1, explanation: 'AI literacy là biết giới hạn của công cụ: nhanh ở tìm mẫu hình, yếu ở phán đoán ý nghĩa kinh doanh và độ tin cậy.' },
]);

const c2 = doc('abi301c-2-1-data-prep-ai', '2.1 — Data prep & understanding with AI assistance|||2.1 — Chuẩn bị & hiểu dữ liệu với hỗ trợ AI',
  'Data profiling (kiểu dữ liệu, giá trị thiếu, outlier); AI hỗ trợ làm sạch & mô tả dữ liệu nhanh hơn; ví dụ Python/pandas profiling và prompt yêu cầu AI tóm tắt báo cáo profiling.',
  [[
    `<span class="eyebrow">ABI301c · Chapter 2 · Lesson 2.1</span>
<h2>Data prep &amp; understanding with AI assistance</h2>
<h3>Data profiling — know your data before you trust it</h3>
<p>Before any chart or model, an analyst checks: what type is each column, how many values are missing, are there outliers or duplicates? This is called <strong>data profiling</strong>. Doing it by eye on a wide table is slow; AI-assisted tools (in Power BI, or a quick Python script) do it in seconds.</p>
<pre><code>Python (pandas) — quick profiling:

import pandas as pd
df = pd.read_csv("sales.csv")

print(df.dtypes)              # column types
print(df.isnull().sum())      # missing values per column
print(df.describe())          # min/max/mean, spot outliers
print(df["region"].value_counts())   # category balance
</code></pre>
<h3>Letting AI summarize the profile</h3>
<p>Instead of reading every number yourself, you can hand the profiling output to an AI assistant and ask it to flag what matters:</p>
<pre><code>Prompt:
"Đây là kết quả pandas .describe() và .isnull().sum() của bảng sales.
 Chỉ ra cột nào đáng lo (thiếu nhiều dữ liệu, outlier, lệch đơn vị)
 và đề xuất bước làm sạch. Không suy diễn số liệu tôi chưa đưa."
</code></pre>
<div class="callout"><span class="badge">The catch</span> AI can describe a profile faster than you — but it can only see the numbers you paste in. It doesn't know that "region = 99" is a broken code for "unknown," unless you tell it. Domain knowledge still has to come from the analyst.</div>`,
    `<span class="eyebrow">ABI301c · Chương 2 · Bài 2.1</span>
<h2>Chuẩn bị &amp; hiểu dữ liệu với hỗ trợ AI</h2>
<h3>Data profiling — hiểu dữ liệu trước khi tin nó</h3>
<p>Trước khi vẽ bất kỳ biểu đồ hay mô hình nào, analyst phải kiểm: mỗi cột kiểu gì, thiếu bao nhiêu giá trị, có outlier hay bản ghi trùng không? Đây gọi là <strong>data profiling</strong>. Nhìn bằng mắt trên một bảng rộng thì chậm; công cụ có AI hỗ trợ (trong Power BI, hoặc một script Python nhanh) làm việc này trong vài giây.</p>
<pre><code>Python (pandas) — profiling nhanh:

import pandas as pd
df = pd.read_csv("sales.csv")

print(df.dtypes)              # kiểu dữ liệu từng cột
print(df.isnull().sum())      # số giá trị thiếu mỗi cột
print(df.describe())          # min/max/mean, phát hiện outlier
print(df["region"].value_counts())   # độ cân bằng theo nhóm
</code></pre>
<h3>Để AI tóm tắt báo cáo profiling</h3>
<p>Thay vì tự đọc từng con số, bạn có thể đưa kết quả profiling cho trợ lý AI và yêu cầu nó nêu bật điều đáng chú ý:</p>
<pre><code>Prompt:
"Đây là kết quả pandas .describe() và .isnull().sum() của bảng sales.
 Chỉ ra cột nào đáng lo (thiếu nhiều dữ liệu, outlier, lệch đơn vị)
 và đề xuất bước làm sạch. Không suy diễn số liệu tôi chưa đưa."
</code></pre>
<div class="callout"><span class="badge">Cái bẫy</span> AI mô tả một bản profiling nhanh hơn bạn — nhưng nó chỉ thấy những con số bạn dán vào. Nó không biết "region = 99" là mã lỗi nghĩa là "không rõ", trừ khi bạn nói cho nó biết. Kiến thức ngành vẫn phải đến từ analyst.</div>`,
  ]]);

const c2q = quiz('abi301c-quiz-2', 'Quiz 2 — Data prep with AI|||Quiz 2 — Chuẩn bị dữ liệu với AI', [
  { id: 'q1', question: 'Data profiling là bước kiểm tra điều gì?', options: ['Kiểu dữ liệu, giá trị thiếu, outlier, trùng lặp', 'Chỉ kiểm màu sắc biểu đồ', 'Chỉ đếm số dòng', 'Huấn luyện mô hình dự báo'], correctIndex: 0, explanation: 'Profiling là bước hiểu dữ liệu: kiểu cột, thiếu dữ liệu, outlier, trùng lặp — trước khi phân tích tiếp.' },
  { id: 'q2', question: 'Trong pandas, lệnh nào cho biết số giá trị thiếu mỗi cột?', options: ['df.describe()', 'df.isnull().sum()', 'df.dtypes', 'df.value_counts()'], correctIndex: 1, explanation: 'df.isnull().sum() đếm số ô rỗng (NaN) theo từng cột.' },
  { id: 'q3', question: 'Vì sao AI tóm tắt profiling nhanh vẫn cần analyst kiểm lại?', options: ['AI luôn sai hoàn toàn', 'AI chỉ thấy số liệu được đưa vào, không có kiến thức ngành (vd mã lỗi ẩn trong dữ liệu)', 'AI không đọc được số', 'Không cần kiểm lại, AI luôn đúng'], correctIndex: 1, explanation: 'AI thiếu ngữ cảnh nghiệp vụ (như mã 99 = "không rõ"); analyst phải cung cấp và kiểm lại kết luận.' },
]);

const c3 = doc('abi301c-3-1-augmented-analytics', '3.1 — Augmented analytics & auto-insights|||3.1 — Phân tích tăng cường & auto-insights',
  'Augmented analytics là gì (ML nhúng sẵn trong công cụ BI để tự tìm mẫu hình); Power BI Quick Insights & Key Influencers; ví dụ output auto-insight và cách đọc nó.',
  [[
    `<span class="eyebrow">ABI301c · Chapter 3 · Lesson 3.1</span>
<h2>Augmented analytics &amp; auto-insights</h2>
<h3>What "augmented analytics" means</h3>
<p><strong>Augmented analytics</strong> is machine learning built directly into a BI tool so it automatically preps data, finds patterns, and explains them in plain language — without the analyst writing any statistical code. Two features in Power BI are the clearest example:</p>
<ul>
<li><strong>Quick Insights</strong> — scans a dataset and surfaces things like trends, seasonality, category outliers and correlations on its own.</li>
<li><strong>Key Influencers visual</strong> — you pick a metric (e.g. "customer churn = yes") and it ranks which other columns most strongly explain it, with plain-language sentences.</li>
</ul>
<pre><code>Example Key Influencers output (read, not written by hand):

"Customers are 2.3x more likely to churn when
 SupportTickets &gt; 3 in the last 30 days"

"Customers are 1.6x more likely to churn when
 ContractType = Month-to-month"
</code></pre>
<h3>Reading an auto-insight like an analyst, not a headline</h3>
<ul>
<li><strong>Correlation ≠ causation</strong> — "more support tickets → more churn" might mean tickets cause churn, or it might mean unhappy customers file tickets AND churn (same root cause, two effects).</li>
<li><strong>Check sample size</strong> — a 2.3x pattern from 8 customers is noise, not a strategy.</li>
<li><strong>Ask "so what?"</strong> — an auto-insight is a lead to investigate, not a decision to act on immediately.</li>
</ul>
<div class="callout"><span class="badge">The analyst's real job here</span> The tool finds the correlation in seconds. Deciding whether it's actionable, and safe to act on, still takes a human who understands the business.</div>`,
    `<span class="eyebrow">ABI301c · Chương 3 · Bài 3.1</span>
<h2>Phân tích tăng cường &amp; auto-insights</h2>
<h3>"Phân tích tăng cường" (augmented analytics) nghĩa là gì</h3>
<p><strong>Augmented analytics</strong> là máy học được nhúng sẵn vào công cụ BI để nó tự chuẩn bị dữ liệu, tự tìm mẫu hình, và tự giải thích bằng ngôn ngữ thường — mà analyst không cần viết code thống kê nào. Hai tính năng trong Power BI là ví dụ rõ nhất:</p>
<ul>
<li><strong>Quick Insights</strong> — quét một tập dữ liệu và tự nêu ra xu hướng, tính mùa vụ, điểm bất thường theo nhóm, tương quan.</li>
<li><strong>Key Influencers visual</strong> — bạn chọn một chỉ số (vd "khách rời bỏ = có") và nó xếp hạng cột nào giải thích mạnh nhất cho điều đó, bằng câu văn thường.</li>
</ul>
<pre><code>Ví dụ output Key Influencers (đọc, không tự viết tay):

"Khách hàng có khả năng rời bỏ cao gấp 2.3 lần khi
 SupportTickets &gt; 3 trong 30 ngày gần nhất"

"Khách hàng có khả năng rời bỏ cao gấp 1.6 lần khi
 ContractType = Theo tháng"
</code></pre>
<h3>Đọc auto-insight như analyst, không phải như tít báo</h3>
<ul>
<li><strong>Tương quan ≠ nhân quả</strong> — "nhiều ticket hỗ trợ hơn → rời bỏ nhiều hơn" có thể là ticket gây ra rời bỏ, hoặc khách không hài lòng vừa gửi ticket vừa rời bỏ (cùng một nguyên nhân gốc, hai kết quả).</li>
<li><strong>Kiểm cỡ mẫu</strong> — mẫu hình 2.3 lần từ 8 khách hàng là nhiễu, không phải chiến lược.</li>
<li><strong>Hỏi "vậy thì sao?"</strong> — một auto-insight là manh mối để điều tra tiếp, không phải quyết định để hành động ngay.</li>
</ul>
<div class="callout"><span class="badge">Việc thật của analyst ở đây</span> Công cụ tìm ra tương quan trong vài giây. Quyết định nó có đáng hành động và an toàn để hành động hay không vẫn cần một người hiểu doanh nghiệp.</div>`,
  ]]);

const c3q = quiz('abi301c-quiz-3', 'Quiz 3 — Augmented analytics|||Quiz 3 — Phân tích tăng cường', [
  { id: 'q1', question: 'Augmented analytics trong công cụ BI làm gì?', options: ['Tự tìm mẫu hình & giải thích bằng ngôn ngữ thường, không cần viết code thống kê', 'Chỉ đổi màu biểu đồ', 'Xoá dữ liệu thừa tự động vĩnh viễn', 'Thay thế hoàn toàn việc ra quyết định của con người'], correctIndex: 0, explanation: 'Augmented analytics nhúng ML vào công cụ BI để tự động tìm & diễn giải mẫu hình.' },
  { id: 'q2', question: 'Vì sao "tương quan không phải nhân quả" quan trọng khi đọc Key Influencers?', options: ['Vì công cụ luôn tính sai', 'Vì hai biến có thể cùng do một nguyên nhân gốc, không phải biến này gây ra biến kia', 'Vì tương quan không bao giờ có ý nghĩa', 'Vì Key Influencers không dùng được cho churn'], correctIndex: 1, explanation: 'Một yếu tố thứ ba có thể gây ra cả hai hiện tượng cùng lúc, khiến chúng tương quan mà không nhân quả.' },
  { id: 'q3', question: 'Khi thấy một auto-insight với cỡ mẫu rất nhỏ (vd 8 khách hàng), analyst nên làm gì?', options: ['Hành động ngay vì AI đã tính toán', 'Coi là manh mối cần kiểm chứng thêm, không vội hành động', 'Bỏ qua toàn bộ tính năng auto-insight', 'Tăng ngân sách marketing ngay lập tức'], correctIndex: 1, explanation: 'Cỡ mẫu nhỏ dễ là nhiễu; auto-insight là gợi ý để điều tra, không phải kết luận cuối.' },
]);

const c4 = doc('abi301c-4-1-nlp-qa', '4.1 — NLP & natural-language Q&A over data|||4.1 — NLP & hỏi đáp ngôn ngữ tự nhiên trên dữ liệu',
  'NLP giúp gì cho BI; text-to-SQL & tính năng Q&A trong Power BI; ví dụ câu hỏi tiếng Việt được dịch thành SQL; giới hạn khi câu hỏi mơ hồ.',
  [[
    `<span class="eyebrow">ABI301c · Chapter 4 · Lesson 4.1</span>
<h2>NLP &amp; natural-language Q&amp;A over data</h2>
<h3>Ask data a question, in plain language</h3>
<p><strong>Natural Language Processing (NLP)</strong> lets a BI tool understand a typed question and turn it into a query. Power BI's <strong>Q&amp;A visual</strong> does exactly this: type "total sales by region last quarter" and it builds the chart — no SQL, no drag-and-drop required. Under the hood, a "text-to-SQL" model maps your words to columns, filters and aggregations.</p>
<pre><code>Câu hỏi (ngôn ngữ tự nhiên):
"Tổng doanh thu quý 3 theo khu vực là bao nhiêu?"

SQL được AI sinh ra:
SELECT region, SUM(revenue) AS total_revenue
FROM sales
WHERE quarter = 3
GROUP BY region
ORDER BY total_revenue DESC;
</code></pre>
<h3>Where it breaks: ambiguity</h3>
<ul>
<li><strong>Vague terms</strong> — "top customers" could mean by revenue, by order count, or by profit. The tool guesses; the analyst must confirm which one was used.</li>
<li><strong>Wrong column match</strong> — "revenue" might match a gross-sales column when the business actually means net revenue. Always check the generated query/field, not just the chart.</li>
<li><strong>Missing context</strong> — the model doesn't know your fiscal year starts in April unless the model/dataset says so.</li>
</ul>
<div class="callout"><span class="badge">Rule of thumb</span> Treat a natural-language answer like a junior analyst's first draft: fast, often right, but check the query it actually ran before you present the number.</div>`,
    `<span class="eyebrow">ABI301c · Chương 4 · Bài 4.1</span>
<h2>NLP &amp; hỏi đáp ngôn ngữ tự nhiên trên dữ liệu</h2>
<h3>Hỏi dữ liệu bằng ngôn ngữ thường</h3>
<p><strong>Xử lý ngôn ngữ tự nhiên (NLP)</strong> giúp công cụ BI hiểu một câu hỏi gõ tay và biến nó thành truy vấn. Tính năng <strong>Q&amp;A visual</strong> của Power BI làm đúng việc này: gõ "tổng doanh thu theo khu vực quý trước" là nó tự dựng biểu đồ — không cần SQL, không cần kéo thả. Bên dưới, một mô hình "text-to-SQL" ánh xạ chữ của bạn sang cột, điều kiện lọc và phép tổng hợp.</p>
<pre><code>Câu hỏi (ngôn ngữ tự nhiên):
"Tổng doanh thu quý 3 theo khu vực là bao nhiêu?"

SQL được AI sinh ra:
SELECT region, SUM(revenue) AS total_revenue
FROM sales
WHERE quarter = 3
GROUP BY region
ORDER BY total_revenue DESC;
</code></pre>
<h3>Chỗ nó dễ hỏng: sự mơ hồ</h3>
<ul>
<li><strong>Từ ngữ mơ hồ</strong> — "khách hàng hàng đầu" có thể là theo doanh thu, theo số đơn, hay theo lợi nhuận. Công cụ tự đoán một cách; analyst phải xác nhận nó đã hiểu theo cách nào.</li>
<li><strong>Khớp sai cột</strong> — "doanh thu" có thể khớp nhầm vào cột doanh số gộp trong khi doanh nghiệp thật ra muốn doanh thu ròng. Luôn kiểm lại truy vấn/trường đã dùng, đừng chỉ nhìn biểu đồ.</li>
<li><strong>Thiếu ngữ cảnh</strong> — mô hình không biết năm tài chính của bạn bắt đầu từ tháng 4 trừ khi mô hình/dữ liệu được khai báo điều đó.</li>
</ul>
<div class="callout"><span class="badge">Quy tắc ngón tay cái</span> Xem câu trả lời từ ngôn ngữ tự nhiên như bản nháp đầu tiên của một analyst mới: nhanh, thường đúng, nhưng phải kiểm lại truy vấn nó thực sự chạy trước khi trình bày con số.</div>`,
  ]]);

const c4q = quiz('abi301c-quiz-4', 'Quiz 4 — NLP & natural-language Q&A|||Quiz 4 — NLP & hỏi đáp ngôn ngữ tự nhiên', [
  { id: 'q1', question: 'Tính năng Q&A trong Power BI làm gì?', options: ['Chuyển câu hỏi ngôn ngữ tự nhiên thành truy vấn dữ liệu & biểu đồ', 'Chỉ dịch ngôn ngữ này sang ngôn ngữ khác', 'Tự động gửi email báo cáo', 'Kiểm tra chính tả trong bảng dữ liệu'], correctIndex: 0, explanation: 'Q&A dùng NLP/text-to-SQL để biến câu hỏi gõ tay thành truy vấn và trực quan hoá.' },
  { id: 'q2', question: 'Vì sao câu hỏi như "top khách hàng" dễ gây hiểu sai cho công cụ NLP?', options: ['Vì công cụ không đọc được tiếng Việt', 'Vì "top" có thể theo doanh thu, số đơn, hay lợi nhuận — công cụ phải đoán một cách', 'Vì dữ liệu không có khách hàng', 'Vì Power BI không hỗ trợ Q&A'], correctIndex: 1, explanation: 'Thuật ngữ mơ hồ khiến mô hình phải tự chọn tiêu chí, có thể không khớp ý người hỏi.' },
  { id: 'q3', question: 'Trước khi trình bày số liệu từ câu trả lời ngôn ngữ tự nhiên, analyst nên làm gì?', options: ['Trình bày ngay vì AI luôn hiểu đúng ý', 'Kiểm lại truy vấn/trường dữ liệu mà công cụ thực sự đã dùng', 'Xoá câu hỏi gốc', 'Không cần kiểm gì cả'], correctIndex: 1, explanation: 'Phải xác nhận công cụ hiểu đúng cột/điều kiện trước khi coi kết quả là đáng tin.' },
]);

const c5 = doc('abi301c-5-1-copilot-dashboard', '5.1 — AI inside the dashboard: Copilot & quick insights|||5.1 — AI trong dashboard: Copilot & quick insights',
  'Power BI Copilot làm gì (tạo trang báo cáo, tóm tắt visual, viết DAX từ mô tả); ví dụ prompt yêu cầu Copilot dựng trang tóm tắt; khi nào phải tự sửa lại kết quả Copilot.',
  [[
    `<span class="eyebrow">ABI301c · Chapter 5 · Lesson 5.1</span>
<h2>AI inside the dashboard</h2>
<h3>What Power BI Copilot actually does</h3>
<p><strong>Copilot in Power BI</strong> is a chat panel built into the report canvas. Typed in plain language, it can: draft a whole report page from a dataset, summarize what a visual is showing in a short paragraph, and write a DAX measure from a description instead of you writing the formula.</p>
<pre><code>Prompt gửi cho Copilot:
"Tạo một trang tóm tắt: doanh số theo khu vực (cột), xu hướng
 doanh số theo tháng (đường), và top 5 sản phẩm bán chạy (bảng).
 Dùng bảng Sales và Products đã có sẵn trong model."
</code></pre>
<h3>Copilot writing a DAX measure from a description</h3>
<pre><code>Yêu cầu: "Tính tỉ lệ tăng trưởng doanh thu so với cùng kỳ năm trước"

DAX Copilot sinh ra (ví dụ):
YoY Growth % =
DIVIDE(
    [Total Revenue] - CALCULATE([Total Revenue], SAMEPERIODLASTYEAR('Date'[Date])),
    CALCULATE([Total Revenue], SAMEPERIODLASTYEAR('Date'[Date]))
)
</code></pre>
<h3>Where the analyst still has to step in</h3>
<ul>
<li><strong>Wrong relationship or filter context</strong> — a generated DAX measure can be syntactically correct but logically wrong if the data model's relationships aren't what Copilot assumed.</li>
<li><strong>Generic layout</strong> — the first draft report page is a starting point, not the final design; it still needs your judgment on what the audience actually needs to see.</li>
<li><strong>Summaries can miss the real story</strong> — a text summary of a chart may state the average while missing the one outlier that matters most.</li>
</ul>
<div class="callout"><span class="badge">Workflow, not magic</span> Use Copilot to skip the blank-page problem and the repetitive DAX — then review every measure and every sentence before it goes to a stakeholder.</div>`,
    `<span class="eyebrow">ABI301c · Chương 5 · Bài 5.1</span>
<h2>AI trong dashboard</h2>
<h3>Power BI Copilot thực sự làm gì</h3>
<p><strong>Copilot trong Power BI</strong> là một khung chat gắn ngay trong khung báo cáo. Gõ bằng ngôn ngữ thường, nó có thể: soạn cả một trang báo cáo từ một tập dữ liệu, tóm tắt một visual đang thể hiện điều gì bằng một đoạn ngắn, và viết một measure DAX từ mô tả thay vì bạn tự gõ công thức.</p>
<pre><code>Prompt gửi cho Copilot:
"Tạo một trang tóm tắt: doanh số theo khu vực (cột), xu hướng
 doanh số theo tháng (đường), và top 5 sản phẩm bán chạy (bảng).
 Dùng bảng Sales và Products đã có sẵn trong model."
</code></pre>
<h3>Copilot viết DAX measure từ mô tả</h3>
<pre><code>Yêu cầu: "Tính tỉ lệ tăng trưởng doanh thu so với cùng kỳ năm trước"

DAX Copilot sinh ra (ví dụ):
YoY Growth % =
DIVIDE(
    [Total Revenue] - CALCULATE([Total Revenue], SAMEPERIODLASTYEAR('Date'[Date])),
    CALCULATE([Total Revenue], SAMEPERIODLASTYEAR('Date'[Date]))
)
</code></pre>
<h3>Chỗ analyst vẫn phải can thiệp</h3>
<ul>
<li><strong>Sai quan hệ bảng hoặc sai ngữ cảnh lọc</strong> — một measure DAX sinh ra có thể đúng cú pháp nhưng sai logic nếu quan hệ trong data model không giống điều Copilot giả định.</li>
<li><strong>Bố cục chung chung</strong> — trang báo cáo bản nháp đầu tiên là điểm khởi đầu, không phải thiết kế cuối; vẫn cần phán đoán của bạn về điều khán giả thật sự cần thấy.</li>
<li><strong>Tóm tắt có thể bỏ sót câu chuyện thật</strong> — bản tóm tắt chữ của một biểu đồ có thể nêu số trung bình mà bỏ qua chính điểm bất thường quan trọng nhất.</li>
</ul>
<div class="callout"><span class="badge">Là quy trình, không phải phép màu</span> Dùng Copilot để bỏ qua vấn đề "trang trắng" và DAX lặp lại — rồi kiểm lại từng measure, từng câu trước khi gửi tới stakeholder.</div>`,
  ]]);

const c5q = quiz('abi301c-quiz-5', 'Quiz 5 — Copilot in dashboards|||Quiz 5 — Copilot trong dashboard', [
  { id: 'q1', question: 'Power BI Copilot KHÔNG thể làm gì trong ba việc chính?', options: ['Soạn trang báo cáo từ mô tả', 'Viết measure DAX từ mô tả bằng lời', 'Tóm tắt một visual bằng đoạn văn ngắn', 'Tự động đảm bảo model quan hệ dữ liệu luôn đúng logic nghiệp vụ'], correctIndex: 3, explanation: 'Copilot hỗ trợ soạn báo cáo/DAX/tóm tắt, nhưng không tự biết đúng-sai logic nghiệp vụ của quan hệ dữ liệu — analyst phải kiểm.' },
  { id: 'q2', question: 'Vì sao một DAX measure do Copilot sinh ra có thể "đúng cú pháp nhưng sai logic"?', options: ['Vì DAX không có cú pháp', 'Vì nó có thể dựa trên giả định sai về quan hệ/ngữ cảnh lọc trong data model', 'Vì Copilot không viết được DAX', 'Vì measure luôn tự động đúng 100%'], correctIndex: 1, explanation: 'Công thức chạy được không đảm bảo nó phản ánh đúng cấu trúc quan hệ thật của model.' },
  { id: 'q3', question: 'Cách dùng Copilot hợp lý nhất là gì?', options: ['Dùng làm điểm khởi đầu nhanh, rồi kiểm lại từng measure/câu trước khi gửi đi', 'Không bao giờ dùng vì luôn sai', 'Dùng và gửi thẳng cho khách hàng không cần xem lại', 'Chỉ dùng để đổi màu biểu đồ'], correctIndex: 0, explanation: 'Copilot tăng tốc bản nháp; việc kiểm chứng và chịu trách nhiệm vẫn thuộc về analyst.' },
]);

const c6 = doc('abi301c-6-1-forecasting-nocode', '6.1 — Forecasting & no-code/low-code prediction|||6.1 — Dự báo & mô hình dự đoán no-code/low-code',
  'Dự báo tích hợp sẵn trong Power BI (exponential smoothing trên biểu đồ đường); khoảng tin cậy nghĩa là gì; AutoML/no-code cho dự đoán mà không cần viết mô hình.',
  [[
    `<span class="eyebrow">ABI301c · Chapter 6 · Lesson 6.1</span>
<h2>Forecasting &amp; no-code/low-code prediction</h2>
<h3>Forecasting built into the chart</h3>
<p>Power BI's line chart has a built-in <strong>Forecast</strong> option (exponential smoothing under the hood) — turn it on and it draws a projected line past your last data point, plus a <strong>confidence interval</strong> band around it, with a couple of settings: forecast length and seasonality.</p>
<pre><code>Steps (no code):
1. Build a line chart: Date (axis) x Revenue (value)
2. Analytics pane -&gt; Forecast -&gt; turn on
3. Set "Forecast length" (e.g. 6 months) and, if known, "Seasonality"
4. Read the shaded confidence band -&gt; wider band = less certain forecast
</code></pre>
<h3>What the confidence interval is telling you</h3>
<ul>
<li>The forecast line is the model's single best guess, not a promise.</li>
<li>A <strong>wide</strong> band (typical 95%) means the model is uncertain — treat the number as a rough range, not a precise target.</li>
<li>A forecast trained on 6 months of data during a one-off promotion will extrapolate the promotion, not "normal" demand — always check what period the model learned from.</li>
</ul>
<h3>Beyond the chart: AutoML for no-code prediction</h3>
<p>For a business question beyond a simple time trend (e.g. "which customers will likely churn next month?"), low-code AutoML tools (Power BI's AI Insights / Power Automate AI Builder, Azure Machine Learning's automated ML) let you point at a labeled dataset and get a trained classifier without writing model code — the tool tries several algorithms and reports which works best.</p>
<div class="callout"><span class="badge">Still ask the analyst question</span> "Is 6 months of history enough to trust a 12-month forecast?" is not something the forecast tool will ever ask itself.</div>`,
    `<span class="eyebrow">ABI301c · Chương 6 · Bài 6.1</span>
<h2>Dự báo &amp; mô hình dự đoán no-code/low-code</h2>
<h3>Dự báo tích hợp sẵn trong biểu đồ</h3>
<p>Biểu đồ đường của Power BI có sẵn tuỳ chọn <strong>Forecast</strong> (bên dưới là exponential smoothing) — bật lên và nó vẽ một đường dự phóng sau điểm dữ liệu cuối cùng, kèm dải <strong>khoảng tin cậy</strong> quanh nó, với vài tuỳ chỉnh: độ dài dự báo và tính mùa vụ.</p>
<pre><code>Các bước (không cần code):
1. Dựng biểu đồ đường: Ngày (trục) x Doanh thu (giá trị)
2. Analytics pane -&gt; Forecast -&gt; bật lên
3. Đặt "Forecast length" (vd 6 tháng) và, nếu biết, "Seasonality"
4. Đọc dải tô mờ khoảng tin cậy -&gt; dải càng rộng = dự báo càng kém chắc chắn
</code></pre>
<h3>Khoảng tin cậy đang nói lên điều gì</h3>
<ul>
<li>Đường dự báo là phỏng đoán tốt nhất của mô hình, không phải một lời hứa.</li>
<li>Dải <strong>rộng</strong> (thường 95%) nghĩa là mô hình không chắc chắn — coi con số như một khoảng ước lượng, không phải mục tiêu chính xác.</li>
<li>Một dự báo huấn luyện trên 6 tháng dữ liệu trùng đợt khuyến mãi đặc biệt sẽ ngoại suy chính đợt khuyến mãi đó, không phải nhu cầu "bình thường" — luôn kiểm giai đoạn mô hình học từ đâu.</li>
</ul>
<h3>Ngoài biểu đồ: AutoML cho dự đoán không cần code</h3>
<p>Với câu hỏi kinh doanh vượt ngoài một xu hướng thời gian đơn giản (vd "khách hàng nào có khả năng rời bỏ tháng tới?"), công cụ AutoML low-code (AI Insights của Power BI / AI Builder trong Power Automate, automated ML của Azure Machine Learning) cho bạn trỏ vào một tập dữ liệu đã gán nhãn và nhận về một mô hình phân loại đã huấn luyện mà không cần viết code mô hình — công cụ tự thử nhiều thuật toán và báo cái nào tốt nhất.</p>
<div class="callout"><span class="badge">Vẫn phải tự hỏi</span> "6 tháng lịch sử có đủ để tin một dự báo 12 tháng không?" là câu hỏi mà công cụ dự báo không bao giờ tự đặt ra cho chính nó.</div>`,
  ]]);

const c6q = quiz('abi301c-quiz-6', 'Quiz 6 — Forecasting & no-code prediction|||Quiz 6 — Dự báo & dự đoán no-code', [
  { id: 'q1', question: 'Dải khoảng tin cậy quanh đường dự báo rộng có ý nghĩa gì?', options: ['Mô hình rất chắc chắn', 'Mô hình kém chắc chắn hơn, nên coi con số là một khoảng, không phải giá trị chính xác', 'Dữ liệu bị lỗi hoàn toàn', 'Biểu đồ vẽ sai màu'], correctIndex: 1, explanation: 'Dải tin cậy càng rộng, mô hình càng ít chắc chắn về giá trị dự báo chính xác.' },
  { id: 'q2', question: 'AutoML/AI Builder cho phép analyst làm gì mà không cần viết code mô hình?', options: ['Trỏ vào dữ liệu đã gán nhãn và nhận về mô hình dự đoán đã huấn luyện', 'Tự động xoá dữ liệu xấu vĩnh viễn', 'Thay thế hoàn toàn vai trò phân tích kinh doanh', 'Chỉ dùng để đổi giao diện dashboard'], correctIndex: 0, explanation: 'AutoML tự thử nhiều thuật toán trên dữ liệu gán nhãn và chọn ra mô hình tốt nhất mà không cần code tay.' },
  { id: 'q3', question: 'Vì sao phải kiểm giai đoạn dữ liệu mà mô hình dự báo đã học?', options: ['Không cần kiểm, mô hình luôn đúng', 'Vì nếu giai đoạn đó có sự kiện bất thường (vd khuyến mãi), dự báo sẽ ngoại suy sai lệch đó thay vì mức bình thường', 'Vì Power BI không lưu lịch sử dữ liệu', 'Vì dự báo không liên quan đến dữ liệu lịch sử'], correctIndex: 1, explanation: 'Mô hình học từ đúng giai đoạn nào sẽ ngoại suy đặc điểm của giai đoạn đó, kể cả các bất thường tạm thời.' },
]);

const c7 = doc('abi301c-7-1-genai-storytelling', '7.1 — Generative AI for reporting & storytelling|||7.1 — AI tạo sinh cho báo cáo & storytelling',
  'Nguyên tắc storytelling with data (Knaflic): giảm nhiễu, hướng sự chú ý, có mạch truyện; dùng AI tạo sinh soạn tóm tắt điều hành từ số liệu; ví dụ prompt và rủi ro AI bịa số.',
  [[
    `<span class="eyebrow">ABI301c · Chapter 7 · Lesson 7.1</span>
<h2>Generative AI for reporting &amp; storytelling</h2>
<h3>Storytelling with data, in three moves</h3>
<p>Cole Nussbaumer Knaflic's <strong><em>Storytelling with Data</em></strong> boils good business communication down to: (1) <strong>declutter</strong> — remove every element that doesn't help the point (gridlines, 3D, redundant labels); (2) <strong>focus attention</strong> — use color/size deliberately to point at the one number that matters; (3) <strong>tell a narrative</strong> — context → insight → so-what, not a wall of charts.</p>
<h3>Using generative AI to draft the narrative</h3>
<p>Once you already trust the numbers, generative AI is good at turning them into a first-draft executive summary fast:</p>
<pre><code>Prompt:
"Viết tóm tắt điều hành 4 câu từ các số liệu sau, theo mạch
 bối cảnh -&gt; phát hiện chính -&gt; nguyên nhân khả dĩ -&gt; đề xuất.
 KHÔNG được thêm số liệu nào ngoài danh sách dưới đây:
 - Doanh thu Q3: 4.2 tỷ (Q2: 3.8 tỷ)
 - Khu vực Miền Nam giảm 12% so với Q2
 - SupportTickets khu vực Miền Nam tăng 40%"
</code></pre>
<h3>The real risk: confident, wrong numbers</h3>
<ul>
<li>Generative AI can <strong>hallucinate</strong> — invent a percentage that sounds plausible but was never in your data. Every number in an AI-drafted paragraph must be traceable back to a source figure.</li>
<li>It can also over-claim causation ("tickets caused the drop") from a correlation you gave it as background — instruct it explicitly to flag possible causes as "possible," not fact.</li>
<li>The fix is always the same: give it only verified numbers, and read the output as a draft to fact-check, not a finished report to forward.</li>
</ul>
<div class="callout"><span class="badge">Storytelling didn't get easier, it got faster</span> AI removes the blank-page problem. It doesn't remove the analyst's job of deciding what story the data actually supports.</div>`,
    `<span class="eyebrow">ABI301c · Chương 7 · Bài 7.1</span>
<h2>AI tạo sinh cho báo cáo &amp; storytelling</h2>
<h3>Storytelling with data, gói gọn trong ba việc</h3>
<p>Cuốn <strong><em>Storytelling with Data</em></strong> của Cole Nussbaumer Knaflic rút gọn giao tiếp kinh doanh tốt thành: (1) <strong>giảm nhiễu</strong> — bỏ mọi chi tiết không giúp ích cho luận điểm (đường lưới, hiệu ứng 3D, nhãn thừa); (2) <strong>hướng sự chú ý</strong> — dùng màu/kích thước có chủ đích để chỉ vào đúng con số quan trọng; (3) <strong>kể một mạch truyện</strong> — bối cảnh → phát hiện → vậy thì sao, chứ không phải một bức tường biểu đồ.</p>
<h3>Dùng AI tạo sinh để soạn bản nháp câu chuyện</h3>
<p>Khi đã tin vào con số, AI tạo sinh giỏi biến chúng thành bản nháp tóm tắt điều hành thật nhanh:</p>
<pre><code>Prompt:
"Viết tóm tắt điều hành 4 câu từ các số liệu sau, theo mạch
 bối cảnh -&gt; phát hiện chính -&gt; nguyên nhân khả dĩ -&gt; đề xuất.
 KHÔNG được thêm số liệu nào ngoài danh sách dưới đây:
 - Doanh thu Q3: 4.2 tỷ (Q2: 3.8 tỷ)
 - Khu vực Miền Nam giảm 12% so với Q2
 - SupportTickets khu vực Miền Nam tăng 40%"
</code></pre>
<h3>Rủi ro thật: số liệu nghe chắc chắn nhưng sai</h3>
<ul>
<li>AI tạo sinh có thể <strong>bịa</strong> (hallucinate) — sinh ra một phần trăm nghe hợp lý nhưng chưa từng có trong dữ liệu. Mọi con số trong đoạn văn AI soạn phải lần lại được nguồn gốc.</li>
<li>Nó cũng có thể khẳng định nhân quả quá đà ("ticket gây ra sụt giảm") từ một tương quan bạn chỉ đưa làm bối cảnh — yêu cầu nó nói rõ nguyên nhân là "có thể", không phải sự thật.</li>
<li>Cách sửa luôn giống nhau: chỉ đưa số liệu đã kiểm chứng, và đọc kết quả AI như bản nháp cần fact-check, không phải báo cáo hoàn chỉnh để gửi đi luôn.</li>
</ul>
<div class="callout"><span class="badge">Storytelling không dễ hơn, chỉ nhanh hơn</span> AI xoá bỏ vấn đề "trang trắng". Nó không xoá bỏ việc analyst phải quyết định dữ liệu thực sự ủng hộ câu chuyện nào.</div>`,
  ]]);

const c7q = quiz('abi301c-quiz-7', 'Quiz 7 — GenAI for reporting|||Quiz 7 — AI tạo sinh cho báo cáo', [
  { id: 'q1', question: 'Ba bước cốt lõi của "storytelling with data" là gì?', options: ['Thêm nhiều màu sắc, thêm hiệu ứng 3D, thêm nhãn', 'Giảm nhiễu, hướng sự chú ý, kể mạch truyện', 'Chỉ cần một bảng số liệu lớn', 'Không cần cấu trúc, cứ trình bày hết mọi biểu đồ'], correctIndex: 1, explanation: 'Knaflic nhấn mạnh: declutter, focus attention, tell a narrative.' },
  { id: 'q2', question: '"Hallucinate" của AI tạo sinh trong ngữ cảnh báo cáo BI nghĩa là gì?', options: ['AI luôn im lặng không trả lời', 'AI bịa ra số liệu/nội dung nghe hợp lý nhưng không có trong dữ liệu thật', 'AI chạy chậm', 'AI từ chối viết báo cáo'], correctIndex: 1, explanation: 'Hallucination là hiện tượng AI tạo sinh sinh ra thông tin sai lệch, nghe tự tin nhưng không có căn cứ.' },
  { id: 'q3', question: 'Cách an toàn nhất khi dùng AI soạn tóm tắt điều hành là gì?', options: ['Gửi thẳng bản AI soạn cho ban lãnh đạo không cần đọc lại', 'Chỉ đưa số liệu đã kiểm chứng, yêu cầu không thêm số ngoài danh sách, và fact-check trước khi gửi', 'Không bao giờ dùng AI cho báo cáo', 'Để AI tự chọn số liệu từ internet'], correctIndex: 1, explanation: 'Kiểm soát đầu vào và fact-check đầu ra là cách giảm rủi ro số liệu sai/bịa.' },
]);

const c8 = doc('abi301c-8-1-ethics-bias-governance', '8.1 — AI ethics, data bias & governance|||8.1 — Đạo đức AI, thiên lệch dữ liệu & quản trị',
  'Thiên lệch dữ liệu lan vào auto-insight/dự báo thế nào; kiểm tra đại diện nhóm bằng SQL; quản trị dữ liệu cho BI có AI (lineage, quyền truy cập, khả năng giải thích, trách nhiệm giải trình).',
  [[
    `<span class="eyebrow">ABI301c · Chapter 8 · Lesson 8.1</span>
<h2>AI ethics, data bias &amp; governance</h2>
<h3>Bias doesn't come from the AI — it comes from the data</h3>
<p>An augmented-analytics tool or a forecast model only learns patterns that already exist in the data you feed it. If the historical data under-represents a region, product line or customer segment, the AI's "insight" or "forecast" will quietly under-serve that same group — and state it with total confidence, since it has no idea it's biased.</p>
<pre><code>SQL — check group representation before trusting a model:

SELECT customer_segment, COUNT(*) AS n,
       ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 1) AS pct
FROM customers
GROUP BY customer_segment
ORDER BY n;

-- If one segment is &lt; 2% of rows, any "insight" about it
-- from an auto-analytics tool rests on a tiny, noisy sample.
</code></pre>
<h3>Governance for AI-augmented BI</h3>
<ul>
<li><strong>Data lineage</strong> — know where a number came from and what transformed it, so an AI-drafted claim can be traced back and verified.</li>
<li><strong>Access control</strong> — an NLP Q&amp;A or Copilot feature must respect the same row/column-level security as the underlying dataset; it should never answer a question the user isn't allowed to see the answer to.</li>
<li><strong>Explainability</strong> — prefer tools/features that show <em>why</em> (e.g. Key Influencers' plain-language reasons) over a black-box score with no explanation.</li>
<li><strong>Accountability</strong> — a human must be named as responsible for every AI-assisted number or recommendation that reaches a decision-maker; "the AI said so" is not an acceptable answer if it's wrong.</li>
</ul>
<div class="callout"><span class="badge">The closing principle of this course</span> AI makes BI faster at every step. It does not make anyone less responsible for what the numbers say — if anything, being able to move faster raises the cost of an unchecked mistake.</div>`,
    `<span class="eyebrow">ABI301c · Chương 8 · Bài 8.1</span>
<h2>Đạo đức AI, thiên lệch dữ liệu &amp; quản trị</h2>
<h3>Thiên lệch không đến từ AI — nó đến từ dữ liệu</h3>
<p>Một công cụ phân tích tăng cường hay một mô hình dự báo chỉ học những mẫu hình đã có sẵn trong dữ liệu bạn đưa vào. Nếu dữ liệu lịch sử đại diện thiếu cho một khu vực, dòng sản phẩm hay phân khúc khách hàng, "insight" hay "dự báo" của AI sẽ âm thầm phục vụ kém nhóm đó — và nói ra điều đó với vẻ hoàn toàn chắc chắn, vì nó không hề biết mình đang thiên lệch.</p>
<pre><code>SQL — kiểm đại diện nhóm trước khi tin một mô hình:

SELECT customer_segment, COUNT(*) AS n,
       ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 1) AS pct
FROM customers
GROUP BY customer_segment
ORDER BY n;

-- Nếu một phân khúc chiếm &lt; 2% số dòng, bất kỳ "insight" nào
-- về nó từ công cụ auto-analytics đều dựa trên mẫu quá nhỏ, dễ nhiễu.
</code></pre>
<h3>Quản trị cho BI được AI tăng cường</h3>
<ul>
<li><strong>Data lineage (truy vết nguồn gốc)</strong> — biết một con số đến từ đâu và bị biến đổi thế nào, để một khẳng định do AI soạn có thể được lần lại và kiểm chứng.</li>
<li><strong>Kiểm soát quyền truy cập</strong> — tính năng Q&amp;A/Copilot phải tôn trọng đúng phân quyền theo dòng/cột như tập dữ liệu gốc; không bao giờ được trả lời câu hỏi mà người dùng không có quyền thấy câu trả lời.</li>
<li><strong>Khả năng giải thích</strong> — ưu tiên công cụ/tính năng cho biết <em>vì sao</em> (như lý do bằng ngôn ngữ thường của Key Influencers) hơn một điểm số hộp đen không giải thích.</li>
<li><strong>Trách nhiệm giải trình</strong> — phải có một người cụ thể chịu trách nhiệm cho mỗi con số/khuyến nghị có hỗ trợ của AI khi nó tới người ra quyết định; "AI nói vậy" không phải câu trả lời chấp nhận được nếu nó sai.</li>
</ul>
<div class="callout"><span class="badge">Nguyên tắc khép lại môn học</span> AI làm BI nhanh hơn ở mọi bước. Nó không làm ai bớt trách nhiệm với điều con số nói ra — ngược lại, làm nhanh hơn còn khiến cái giá của một sai sót không được kiểm cao hơn.</div>`,
  ]]);

const c8q = quiz('abi301c-quiz-8', 'Quiz 8 — Ethics, bias & governance|||Quiz 8 — Đạo đức, thiên lệch & quản trị', [
  { id: 'q1', question: 'Thiên lệch (bias) trong insight do AI sinh ra chủ yếu đến từ đâu?', options: ['Từ chính thuật toán AI luôn cố ý gây hại', 'Từ dữ liệu lịch sử đại diện thiếu cho một số nhóm', 'Từ màu sắc biểu đồ', 'Từ tốc độ xử lý của máy chủ'], correctIndex: 1, explanation: 'AI học từ dữ liệu có sẵn; nếu dữ liệu thiếu đại diện, kết quả AI sẽ phản ánh & khuếch đại thiếu sót đó.' },
  { id: 'q2', question: 'Data lineage trong quản trị BI có AI dùng để làm gì?', options: ['Trang trí dashboard', 'Truy vết một con số đến từ đâu và đã bị biến đổi thế nào, để kiểm chứng khẳng định của AI', 'Tăng tốc độ truy vấn SQL', 'Thay thế phân quyền truy cập'], correctIndex: 1, explanation: 'Lineage giúp lần lại nguồn gốc dữ liệu để xác minh một con số/khẳng định do AI đưa ra.' },
  { id: 'q3', question: 'Nguyên tắc trách nhiệm giải trình (accountability) nói gì?', options: ['"AI nói vậy" là lý do đủ để chấp nhận một số liệu sai', 'Luôn phải có một người cụ thể chịu trách nhiệm cho số liệu/khuyến nghị có AI hỗ trợ khi tới người ra quyết định', 'Không ai cần chịu trách nhiệm khi có AI', 'Chỉ cần AI càng thông minh thì càng ít cần kiểm tra'], correctIndex: 1, explanation: 'Trách nhiệm giải trình yêu cầu một con người cụ thể đứng sau mỗi kết quả AI hỗ trợ được dùng để quyết định.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'ABI301c',
    slug: 'abi301c-ai-for-bi-analysts',
    title: 'AI for BI Analysts',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/ABI301c.webp',
    shortDescription: 'AI-augmented Business Intelligence — the analyst\'s changing role, AI-assisted data prep, augmented analytics & auto-insights, natural-language Q&A, Power BI Copilot, no-code forecasting, generative storytelling, ethics & governance.|||BI được AI tăng cường — vai trò analyst đang đổi, chuẩn bị dữ liệu có AI hỗ trợ, phân tích tăng cường & auto-insights, hỏi đáp ngôn ngữ tự nhiên, Power BI Copilot, dự báo no-code, AI tạo sinh kể chuyện, đạo đức & quản trị.',
    description: 'Môn <strong>ABI301c — AI for BI Analysts</strong> (khối Quản trị Kinh doanh, kỳ 5) dạy cách <strong>dùng AI để làm Business Intelligence hiệu quả hơn</strong> — không phải xây mô hình AI từ đầu. Từ <strong>AI &amp; BI giao thoa</strong> (vai trò analyst đang đổi) → <strong>chuẩn bị &amp; hiểu dữ liệu với hỗ trợ AI</strong> → <strong>phân tích tăng cường &amp; auto-insights</strong> → <strong>NLP &amp; hỏi đáp ngôn ngữ tự nhiên</strong> trên dữ liệu → <strong>AI trong dashboard</strong> (Power BI Copilot, Quick Insights) → <strong>dự báo no-code/low-code</strong> → <strong>AI tạo sinh cho báo cáo &amp; storytelling</strong> → <strong>đạo đức AI, thiên lệch dữ liệu &amp; quản trị</strong>. Bám giáo trình chuẩn quốc tế (Provost &amp; Fawcett, tài liệu Power BI + Copilot của Microsoft, Storytelling with Data của Knaflic), song ngữ, có ví dụ SQL/Python/DAX/prompt thật và quiz mỗi chương.',
    whatYouLearn: 'AI & BI giao thoa, vai trò BI analyst thời AI; chuẩn bị & hiểu dữ liệu với hỗ trợ AI (profiling, phát hiện bất thường); phân tích tăng cường (augmented analytics), auto-insights, Key Influencers; NLP & truy vấn ngôn ngữ tự nhiên trên dữ liệu (text-to-SQL, Q&A); AI trong dashboard — Power BI Copilot, Quick Insights; dự báo & mô hình dự đoán no-code/low-code (Power BI Forecast, AutoML); AI tạo sinh cho viết báo cáo, tóm tắt điều hành & storytelling; đạo đức AI, thiên lệch dữ liệu (bias), quản trị & trách nhiệm giải trình.',
    requirements: 'Đã học qua các môn nền phân tích dữ liệu/BI cơ bản (thống kê, SQL, Power BI/Excel). Nên có tài khoản Power BI (bản miễn phí) và ChatGPT/Copilot để thực hành. Xem điều kiện tiên quyết của khối Quản trị Kinh doanh trên FLM.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách chuẩn quốc tế, tài liệu Power BI/Copilot, công cụ, lộ trình 4 bước.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'BI truyền thống vs BI được AI tăng cường, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — AI & BI giao thoa|||Chapter 1 — Where AI meets BI', description: 'Vòng lặp BI, vai trò analyst đang đổi.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Chuẩn bị dữ liệu với AI|||Chapter 2 — Data prep with AI', description: 'Profiling, làm sạch, AI tóm tắt profiling.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Phân tích tăng cường|||Chapter 3 — Augmented analytics', description: 'Auto-insights, Quick Insights, Key Influencers.', lessons: [c3, c3q] },
    { title: 'Chương 4 — NLP & hỏi đáp trên dữ liệu|||Chapter 4 — NLP & data Q&A', description: 'Text-to-SQL, Power BI Q&A, giới hạn khi mơ hồ.', lessons: [c4, c4q] },
    { title: 'Chương 5 — AI trong dashboard|||Chapter 5 — AI in dashboards', description: 'Power BI Copilot, viết DAX từ mô tả.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Dự báo no-code/low-code|||Chapter 6 — No-code forecasting', description: 'Forecast trong Power BI, khoảng tin cậy, AutoML.', lessons: [c6, c6q] },
    { title: 'Chương 7 — AI tạo sinh cho báo cáo|||Chapter 7 — Generative AI for reporting', description: 'Storytelling with data, prompt tóm tắt điều hành, rủi ro bịa số.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Đạo đức & quản trị|||Chapter 8 — Ethics & governance', description: 'Thiên lệch dữ liệu, data lineage, trách nhiệm giải trình.', lessons: [c8, c8q] },
  ],
};
