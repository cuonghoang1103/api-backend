/**
 * CEM501 — Macroeconomics (taught in Chinese) / Kinh tế Vĩ mô giảng bằng
 * tiếng Trung. Khối Ngôn ngữ Trung FPTU, Kỳ 7. Nội dung là KINH TẾ HỌC VĨ MÔ
 * (GDP, AD-AS, thất nghiệp/lạm phát, tiền tệ, tài khoá, tỷ giá, chu kỳ kinh
 * tế), nhấn thuật ngữ chuyên ngành tiếng Trung (汉字 + pinyin) để SV Ngôn ngữ
 * Trung học chuyên ngành bằng tiếng Trung — KHÁC các môn CHI kỹ năng ngôn ngữ.
 * Giáo trình tham khảo (trích dẫn, không upload PDF): "宏观经济学"
 * (Macroeconomics, 高鸿业 — giáo trình chuẩn TQ); "Macroeconomics" (Mankiw).
 * 8 chương vĩ mô kinh điển, mỗi chương có bảng thuật ngữ 汉字/pīnyīn/nghĩa.
 * Giữ NGUYÊN slug/semester/courseCode/thumb.
 * ⚠️ KHÔNG backtick lồng/${; trong HTML content "&" → "&amp;".
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const c1 = doc('cem501-1-1-intro-variables', 'Chapter 1 — Introduction to macroeconomics & key variables (宏观经济学导论)|||Chương 1 — Nhập môn kinh tế vĩ mô & các biến số cơ bản (宏观经济学导论)',
  'Kinh tế vĩ mô là gì, khác kinh tế vi mô ra sao; 4 biến số/mục tiêu kinh điển: tăng trưởng, thất nghiệp, lạm phát, cán cân đối ngoại; hai công cụ chính sách 财政政策/货币政策.',
  [[
    `<span class="eyebrow">CEM501 · Chapter 1</span>
<h2>What is macroeconomics? (什么是宏观经济学)</h2>
<p class="lead"><strong>Macroeconomics (宏观经济学, hóngguān jīngjìxué)</strong> studies the economy <em>as a whole</em> — total output, the overall price level, aggregate employment — as opposed to <strong>microeconomics (微观经济学, wēiguān jīngjìxué)</strong>, which studies individual households, firms and single markets. If micro asks "why is the price of one product X", macro asks "why did the WHOLE economy grow/shrink, and why do prices rise everywhere at once."</p>
<h3>Key terms (关键词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>宏观经济学</td><td>hóngguān jīngjìxué</td><td>macroeconomics</td></tr>
<tr><td>微观经济学</td><td>wēiguān jīngjìxué</td><td>microeconomics</td></tr>
<tr><td>经济增长</td><td>jīngjì zēngzhǎng</td><td>economic growth</td></tr>
<tr><td>通货膨胀</td><td>tōnghuò péngzhàng</td><td>inflation</td></tr>
<tr><td>失业率</td><td>shīyèlǜ</td><td>unemployment rate</td></tr>
<tr><td>国内生产总值</td><td>guónèi shēngchǎn zǒngzhí</td><td>GDP (gross domestic product)</td></tr>
<tr><td>经济周期</td><td>jīngjì zhōuqī</td><td>business cycle</td></tr>
<tr><td>宏观经济政策</td><td>hóngguān jīngjì zhèngcè</td><td>macroeconomic policy</td></tr>
</table>
<h3>The four classic macro goals (宏观经济政策的四大目标)</h3>
<ul>
<li><strong>Fast, stable growth (经济增长)</strong> — the economy should produce more goods/services over time.</li>
<li><strong>Low unemployment (低失业率)</strong> — most people who want a job should have one.</li>
<li><strong>Price stability (物价稳定)</strong> — inflation should be low and predictable, not runaway.</li>
<li><strong>External balance (对外经济平衡)</strong> — trade and exchange rates should not be wildly out of balance with the rest of the world.</li>
</ul>
<h3>The two policy levers (两大政策工具)</h3>
<p>Governments chase those four goals mainly with two levers, each covered in a later chapter: <strong>货币政策 (huòbì zhèngcè, monetary policy)</strong> — the central bank managing money &amp; interest rates — and <strong>财政政策 (cáizhèng zhèngcè, fiscal policy)</strong> — the government managing taxes &amp; spending.</p>
<pre><code>宏观经济学 hóngguān jīngjìxué  — nhìn NỀN KINH TẾ như một khối:
  产出 (chǎnchū, output/GDP) ↑?  失业率 (shīyèlǜ) ↓?
  通货膨胀 (tōnghuò péngzhàng) ổn định?  对外平衡 (duìwài pínghéng) ổn định?
两大工具 liǎng dà gōngjù — hai công cụ:
  货币政策 huòbì zhèngcè (Ngân hàng Trung ương: tiền, lãi suất)
  财政政策 cáizhèng zhèngcè (Chính phủ: thuế, chi tiêu)
</code></pre>
<div class="callout"><span class="badge">Why "macro"</span> Every chapter in this course is really answering one of the four goals above with more precision — GDP measures growth, unemployment/inflation get their own chapter, monetary and fiscal policy are the levers, and the open economy chapter covers external balance.</div>`,
    `<span class="eyebrow">CEM501 · Chương 1</span>
<h2>Kinh tế vĩ mô là gì? (什么是宏观经济学)</h2>
<p class="lead"><strong>Kinh tế vĩ mô (宏观经济学, hóngguān jīngjìxué)</strong> nghiên cứu nền kinh tế <em>như một tổng thể</em> — tổng sản lượng, mức giá chung, việc làm toàn xã hội — khác với <strong>kinh tế vi mô (微观经济学, wēiguān jīngjìxué)</strong> nghiên cứu từng hộ gia đình, doanh nghiệp và từng thị trường riêng lẻ. Nếu vi mô hỏi "vì sao giá sản phẩm X là bao nhiêu", vĩ mô hỏi "vì sao CẢ nền kinh tế tăng trưởng/suy giảm, vì sao giá cả tăng đồng loạt khắp nơi."</p>
<h3>Từ khoá (关键词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>宏观经济学</td><td>hóngguān jīngjìxué</td><td>kinh tế học vĩ mô</td></tr>
<tr><td>微观经济学</td><td>wēiguān jīngjìxué</td><td>kinh tế học vi mô</td></tr>
<tr><td>经济增长</td><td>jīngjì zēngzhǎng</td><td>tăng trưởng kinh tế</td></tr>
<tr><td>通货膨胀</td><td>tōnghuò péngzhàng</td><td>lạm phát</td></tr>
<tr><td>失业率</td><td>shīyèlǜ</td><td>tỷ lệ thất nghiệp</td></tr>
<tr><td>国内生产总值</td><td>guónèi shēngchǎn zǒngzhí</td><td>GDP (tổng sản phẩm quốc nội)</td></tr>
<tr><td>经济周期</td><td>jīngjì zhōuqī</td><td>chu kỳ kinh tế</td></tr>
<tr><td>宏观经济政策</td><td>hóngguān jīngjì zhèngcè</td><td>chính sách kinh tế vĩ mô</td></tr>
</table>
<h3>Bốn mục tiêu vĩ mô kinh điển (宏观经济政策的四大目标)</h3>
<ul>
<li><strong>Tăng trưởng nhanh, ổn định (经济增长)</strong> — nền kinh tế phải sản xuất ra nhiều hàng hoá/dịch vụ hơn theo thời gian.</li>
<li><strong>Thất nghiệp thấp (低失业率)</strong> — phần lớn người muốn có việc thì có việc.</li>
<li><strong>Ổn định giá cả (物价稳定)</strong> — lạm phát thấp và dự đoán được, không phi mã.</li>
<li><strong>Cân bằng đối ngoại (对外经济平衡)</strong> — thương mại và tỷ giá không lệch quá xa so với phần còn lại của thế giới.</li>
</ul>
<h3>Hai đòn bẩy chính sách (两大政策工具)</h3>
<p>Chính phủ theo đuổi bốn mục tiêu trên chủ yếu bằng hai đòn bẩy, mỗi cái sẽ có một chương riêng: <strong>货币政策 (huòbì zhèngcè, chính sách tiền tệ)</strong> — ngân hàng trung ương quản lý tiền &amp; lãi suất — và <strong>财政政策 (cáizhèng zhèngcè, chính sách tài khoá)</strong> — chính phủ quản lý thuế &amp; chi tiêu.</p>
<pre><code>宏观经济学 hóngguān jīngjìxué — nhìn NỀN KINH TẾ như một khối:
  产出 (chǎnchū, sản lượng/GDP) ↑?  失业率 (shīyèlǜ) ↓?
  通货膨胀 (tōnghuò péngzhàng) ổn định?  对外平衡 (duìwài pínghéng) ổn định?
两大工具 liǎng dà gōngjù — hai công cụ:
  货币政策 huòbì zhèngcè (Ngân hàng Trung ương: tiền, lãi suất)
  财政政策 cáizhèng zhèngcè (Chính phủ: thuế, chi tiêu)
</code></pre>
<div class="callout"><span class="badge">Vì sao gọi là "vĩ mô"</span> Mỗi chương của môn này thực chất trả lời chi tiết hơn cho một trong bốn mục tiêu trên — GDP đo tăng trưởng, thất nghiệp/lạm phát có chương riêng, chính sách tiền tệ &amp; tài khoá là đòn bẩy, và chương kinh tế mở trả lời cho cân bằng đối ngoại.</div>`,
  ]]);

const c1q = quiz('cem501-quiz-1', 'Quiz 1 — Introduction & key variables|||Quiz 1 — Nhập môn & biến số cơ bản', [
  { id: 'q1', question: '"宏观经济学" (hóngguān jīngjìxué) nghiên cứu điều gì?', options: ['Giá của một sản phẩm cụ thể tại một cửa hàng', 'Nền kinh tế như một tổng thể: tổng sản lượng, mức giá chung, việc làm toàn xã hội', 'Chiến lược kinh doanh của một doanh nghiệp đơn lẻ', 'Hành vi tiêu dùng của một hộ gia đình'], correctIndex: 1, explanation: '宏观经济学 (kinh tế vĩ mô) nhìn nền kinh tế như một khối — khác với 微观经济学 (vi mô) nhìn từng thị trường/chủ thể riêng lẻ.' },
  { id: 'q2', question: 'Đâu KHÔNG phải là một trong bốn mục tiêu vĩ mô kinh điển?', options: ['经济增长 (tăng trưởng kinh tế)', '低失业率 (thất nghiệp thấp)', '物价稳定 (ổn định giá cả)', '提高单一企业利润 (tối đa hoá lợi nhuận một doanh nghiệp)'], correctIndex: 3, explanation: 'Bốn mục tiêu vĩ mô là tăng trưởng, thất nghiệp thấp, ổn định giá cả, cân bằng đối ngoại — tối đa hoá lợi nhuận một doanh nghiệp là vấn đề vi mô.' },
  { id: 'q3', question: '"货币政策" (huòbì zhèngcè) và "财政政策" (cáizhèng zhèngcè) khác nhau ở chỗ nào?', options: ['Cả hai đều do doanh nghiệp tư nhân quyết định', '货币政策 do ngân hàng trung ương quản lý tiền/lãi suất; 财政政策 do chính phủ quản lý thuế/chi tiêu', '货币政策 là thuế, 财政政策 là lãi suất', 'Không có sự khác biệt, chỉ là hai tên gọi khác nhau của cùng một chính sách'], correctIndex: 1, explanation: '货币政策 (chính sách tiền tệ) do ngân hàng trung ương điều hành qua tiền tệ/lãi suất; 财政政策 (chính sách tài khoá) do chính phủ điều hành qua thuế và chi tiêu công.' },
]);

const c2 = doc('cem501-2-1-gdp-growth', 'Chapter 2 — GDP, growth & measuring output (国内生产总值)|||Chương 2 — GDP, tăng trưởng & đo lường sản lượng (国内生产总值)',
  'GDP danh nghĩa/thực tế, GDP bình quân đầu người, phương pháp chi tiêu GDP=C+I+G+NX, phương pháp thu nhập, chỉ số giảm phát GDP.',
  [[
    `<span class="eyebrow">CEM501 · Chapter 2</span>
<h2>GDP — the master scoreboard (国内生产总值)</h2>
<p class="lead"><strong>GDP (国内生产总值, guónèi shēngchǎn zǒngzhí)</strong> is the total market value of all FINAL goods and services produced within a country's borders in a given period. It is the single most-watched number in macroeconomics — a rising GDP usually means a growing economy.</p>
<h3>Key terms (关键词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>国内生产总值</td><td>guónèi shēngchǎn zǒngzhí</td><td>GDP (gross domestic product)</td></tr>
<tr><td>国民生产总值</td><td>guómín shēngchǎn zǒngzhí</td><td>GNP (gross national product)</td></tr>
<tr><td>名义GDP</td><td>míngyì GDP</td><td>nominal GDP (at current prices)</td></tr>
<tr><td>实际GDP</td><td>shíjì GDP</td><td>real GDP (at constant prices)</td></tr>
<tr><td>GDP平减指数</td><td>GDP píngjiǎn zhǐshù</td><td>GDP deflator</td></tr>
<tr><td>人均GDP</td><td>rénjūn GDP</td><td>GDP per capita</td></tr>
<tr><td>支出法</td><td>zhīchū fǎ</td><td>expenditure approach</td></tr>
<tr><td>收入法</td><td>shōurù fǎ</td><td>income approach</td></tr>
</table>
<h3>The expenditure approach (支出法)</h3>
<p>The most common way to compute GDP adds up four types of spending:</p>
<pre><code>支出法 GDP (zhīchū fǎ) — Expenditure approach:

  GDP = C + I + G + NX

  C  消费 (xiāofèi)      — household consumption
  I  投资 (tóuzī)        — private investment (factories, housing, inventories)
  G  政府支出 (zhèngfǔ zhīchū) — government purchases
  NX 净出口 (jìng chūkǒu)     — net exports = 出口(exports) − 进口(imports)

Ví dụ: C=6000, I=2000, G=1500, NX=−200 (tỷ đồng)
  GDP = 6000+2000+1500+(−200) = 9300 (tỷ đồng)
</code></pre>
<h3>Nominal vs. real GDP — the deflator (名义GDP vs. 实际GDP)</h3>
<p><strong>名义GDP (nominal GDP)</strong> is measured at CURRENT prices, so it rises even if only prices rose and no more was actually produced. <strong>实际GDP (real GDP)</strong> is measured at CONSTANT (base-year) prices, isolating the true change in the quantity produced. The ratio of the two gives the <strong>GDP平减指数 (GDP deflator)</strong>, a broad measure of the price level:</p>
<pre><code>GDP平减指数 = (名义GDP ÷ 实际GDP) × 100
GDP deflator = (Nominal GDP ÷ Real GDP) × 100
</code></pre>
<div class="callout"><span class="badge">Watch this trap</span> A country whose 名义GDP rose 10% but whose price level (通货膨胀) also rose 10% had ZERO real growth — only 实际GDP tells you whether people actually have more goods and services, which is why growth targets in macro are always stated in REAL terms.</div>`,
    `<span class="eyebrow">CEM501 · Chương 2</span>
<h2>GDP — bảng điểm tổng của nền kinh tế (国内生产总值)</h2>
<p class="lead"><strong>GDP (国内生产总值, guónèi shēngchǎn zǒngzhí)</strong> là tổng giá trị thị trường của mọi hàng hoá và dịch vụ CUỐI CÙNG được sản xuất trong biên giới một quốc gia trong một giai đoạn nhất định. Đây là con số được theo dõi nhiều nhất trong kinh tế vĩ mô — GDP tăng thường đồng nghĩa nền kinh tế đang lớn lên.</p>
<h3>Từ khoá (关键词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>国内生产总值</td><td>guónèi shēngchǎn zǒngzhí</td><td>GDP (tổng sản phẩm quốc nội)</td></tr>
<tr><td>国民生产总值</td><td>guómín shēngchǎn zǒngzhí</td><td>GNP (tổng sản phẩm quốc dân)</td></tr>
<tr><td>名义GDP</td><td>míngyì GDP</td><td>GDP danh nghĩa (theo giá hiện hành)</td></tr>
<tr><td>实际GDP</td><td>shíjì GDP</td><td>GDP thực tế (theo giá cố định)</td></tr>
<tr><td>GDP平减指数</td><td>GDP píngjiǎn zhǐshù</td><td>chỉ số giảm phát GDP</td></tr>
<tr><td>人均GDP</td><td>rénjūn GDP</td><td>GDP bình quân đầu người</td></tr>
<tr><td>支出法</td><td>zhīchū fǎ</td><td>phương pháp chi tiêu</td></tr>
<tr><td>收入法</td><td>shōurù fǎ</td><td>phương pháp thu nhập</td></tr>
</table>
<h3>Phương pháp chi tiêu (支出法)</h3>
<p>Cách phổ biến nhất để tính GDP là cộng bốn khoản chi tiêu:</p>
<pre><code>支出法 GDP (zhīchū fǎ) — Phương pháp chi tiêu:

  GDP = C + I + G + NX

  C  消费 (xiāofèi)      — tiêu dùng hộ gia đình
  I  投资 (tóuzī)        — đầu tư tư nhân (nhà máy, nhà ở, hàng tồn kho)
  G  政府支出 (zhèngfǔ zhīchū) — chi tiêu chính phủ
  NX 净出口 (jìng chūkǒu)     — xuất khẩu ròng = 出口(xuất khẩu) − 进口(nhập khẩu)

Ví dụ: C=6000, I=2000, G=1500, NX=−200 (tỷ đồng)
  GDP = 6000+2000+1500+(−200) = 9300 (tỷ đồng)
</code></pre>
<h3>GDP danh nghĩa vs. thực tế — chỉ số giảm phát (名义GDP vs. 实际GDP)</h3>
<p><strong>名义GDP (GDP danh nghĩa)</strong> đo theo giá HIỆN HÀNH, nên tăng ngay cả khi chỉ giá tăng mà lượng sản xuất thực không đổi. <strong>实际GDP (GDP thực tế)</strong> đo theo giá CỐ ĐỊNH (năm gốc), tách riêng phần thay đổi thực sự về lượng sản xuất. Tỷ lệ giữa hai con số cho ra <strong>GDP平减指数 (chỉ số giảm phát GDP)</strong>, một thước đo rộng cho mức giá chung:</p>
<pre><code>GDP平减指数 = (名义GDP ÷ 实际GDP) × 100
Chỉ số giảm phát GDP = (GDP danh nghĩa ÷ GDP thực tế) × 100
</code></pre>
<div class="callout"><span class="badge">Bẫy cần nhớ</span> Một nước có 名义GDP tăng 10% nhưng mức giá (通货膨胀) cũng tăng 10% thì tăng trưởng THỰC bằng 0 — chỉ 实际GDP mới cho biết người dân có thật sự nhiều hàng hoá/dịch vụ hơn hay không, nên mục tiêu tăng trưởng trong kinh tế vĩ mô luôn được nói theo giá trị THỰC.</div>`,
  ]]);

const c2q = quiz('cem501-quiz-2', 'Quiz 2 — GDP & growth measurement|||Quiz 2 — GDP & đo lường tăng trưởng', [
  { id: 'q1', question: 'Theo phương pháp chi tiêu, công thức tính GDP là gì?', options: ['GDP = C − I − G − NX', 'GDP = C + I + G + NX', 'GDP = C × I × G × NX', 'GDP = C + I − G + NX'], correctIndex: 1, explanation: 'GDP = C (消费) + I (投资) + G (政府支出) + NX (净出口).' },
  { id: 'q2', question: 'Vì sao mục tiêu tăng trưởng kinh tế luôn được nêu theo 实际GDP (GDP thực tế) thay vì 名义GDP (GDP danh nghĩa)?', options: ['Vì 名义GDP không thể tính được', 'Vì 名义GDP có thể tăng chỉ do giá cả tăng (lạm phát), không phản ánh sản lượng thực', 'Vì 实际GDP luôn lớn hơn 名义GDP', 'Vì hai chỉ số này hoàn toàn giống nhau'], correctIndex: 1, explanation: '名义GDP đo theo giá hiện hành nên có thể tăng chỉ vì lạm phát; 实际GDP đo theo giá cố định mới phản ánh đúng lượng sản xuất tăng thêm.' },
  { id: 'q3', question: '"GDP平减指数" (GDP deflator) được tính như thế nào?', options: ['(实际GDP ÷ 名义GDP) × 100', '(名义GDP ÷ 实际GDP) × 100', '名义GDP − 实际GDP', '名义GDP + 实际GDP'], correctIndex: 1, explanation: 'GDP平减指数 = (名义GDP ÷ 实际GDP) × 100 — thước đo mức giá chung của toàn nền kinh tế.' },
]);

const c3 = doc('cem501-3-1-ad-as', 'Chapter 3 — Aggregate demand & aggregate supply (总需求-总供给)|||Chương 3 — Tổng cầu & tổng cung (总需求-总供给)',
  'Mô hình AD-AS: đường tổng cầu 总需求, đường tổng cung ngắn hạn/dài hạn 总供给, sản lượng cân bằng, các cú sốc dịch chuyển đường.',
  [[
    `<span class="eyebrow">CEM501 · Chapter 3</span>
<h2>The AD-AS model (总需求-总供给模型)</h2>
<p class="lead">The <strong>AD-AS model</strong> explains how the economy's overall <strong>price level (价格水平, jiàgé shuǐpíng)</strong> and <strong>equilibrium output (均衡产出, jūnhéng chǎnchū)</strong> are determined — the macro version of supply &amp; demand for the WHOLE economy at once, instead of one product.</p>
<h3>Key terms (关键词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>总需求</td><td>zǒng xūqiú</td><td>aggregate demand (AD)</td></tr>
<tr><td>总供给</td><td>zǒng gōngjǐ</td><td>aggregate supply (AS)</td></tr>
<tr><td>均衡产出</td><td>jūnhéng chǎnchū</td><td>equilibrium output</td></tr>
<tr><td>价格水平</td><td>jiàgé shuǐpíng</td><td>(general) price level</td></tr>
<tr><td>短期总供给曲线</td><td>duǎnqī zǒng gōngjǐ qūxiàn</td><td>short-run AS curve</td></tr>
<tr><td>长期总供给曲线</td><td>chángqī zǒng gōngjǐ qūxiàn</td><td>long-run AS curve</td></tr>
<tr><td>消费</td><td>xiāofèi</td><td>consumption (C)</td></tr>
<tr><td>净出口</td><td>jìng chūkǒu</td><td>net exports (NX)</td></tr>
</table>
<h3>总需求 AD — why it slopes downward</h3>
<p>The <strong>AD curve</strong> is just the sum you already know from Chapter 2 — C+I+G+NX — plotted against the price level: as prices FALL, real spending power rises (real balances, cheaper exports), so total demand for output RISES. AD shifts right when C, I, G or NX rise for any reason (a tax cut, a rate cut, a foreign boom).</p>
<h3>总供给 AS — short run vs. long run</h3>
<p>In the <strong>short run (短期)</strong>, the AS curve slopes UPWARD — firms produce more when prices (and profits) rise, because wages/costs are sticky. In the <strong>long run (长期)</strong>, output is capped by the economy's real capacity (labor, capital, technology) — the AS curve is VERTICAL at potential output, regardless of price level.</p>
<pre><code>总需求-总供给 zǒng xūqiú - zǒng gōngjǐ (AD-AS):

  价格水平 (P)
    |        长期总供给 (vertical, at potential output Y*)
    |       /
    |      / 短期总供给 (upward sloping)
    |     /
    |----均衡点 (E) --- 总需求 AD (downward sloping)
    |___________________________ 产出/GDP (Y)
                Y*

Cân bằng ngắn hạn tại giao điểm AD với 短期AS;
Cân bằng dài hạn tại giao điểm AD với 长期AS (Y = Y*, sản lượng tiềm năng).
</code></pre>
<div class="callout"><span class="badge">Reading a shock</span> A demand shock (AD shifts) moves price level AND output in the SAME direction; a supply shock (AS shifts, e.g. an oil price spike) moves them in OPPOSITE directions — prices up, output down. Telling these two apart is the first step in diagnosing any real-world downturn.</div>`,
    `<span class="eyebrow">CEM501 · Chương 3</span>
<h2>Mô hình tổng cầu - tổng cung (总需求-总供给模型)</h2>
<p class="lead"><strong>Mô hình AD-AS</strong> giải thích <strong>mức giá chung (价格水平, jiàgé shuǐpíng)</strong> và <strong>sản lượng cân bằng (均衡产出, jūnhéng chǎnchū)</strong> của cả nền kinh tế được xác định như thế nào — phiên bản vĩ mô của cung-cầu, nhưng cho CẢ nền kinh tế cùng lúc thay vì một sản phẩm.</p>
<h3>Từ khoá (关键词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>总需求</td><td>zǒng xūqiú</td><td>tổng cầu (AD)</td></tr>
<tr><td>总供给</td><td>zǒng gōngjǐ</td><td>tổng cung (AS)</td></tr>
<tr><td>均衡产出</td><td>jūnhéng chǎnchū</td><td>sản lượng cân bằng</td></tr>
<tr><td>价格水平</td><td>jiàgé shuǐpíng</td><td>mức giá chung</td></tr>
<tr><td>短期总供给曲线</td><td>duǎnqī zǒng gōngjǐ qūxiàn</td><td>đường tổng cung ngắn hạn</td></tr>
<tr><td>长期总供给曲线</td><td>chángqī zǒng gōngjǐ qūxiàn</td><td>đường tổng cung dài hạn</td></tr>
<tr><td>消费</td><td>xiāofèi</td><td>tiêu dùng (C)</td></tr>
<tr><td>净出口</td><td>jìng chūkǒu</td><td>xuất khẩu ròng (NX)</td></tr>
</table>
<h3>总需求 AD — vì sao dốc xuống</h3>
<p>Đường <strong>AD</strong> chính là tổng bạn đã học ở Chương 2 — C+I+G+NX — vẽ theo mức giá: khi giá GIẢM, sức mua thực tăng lên (giá trị thực của tiền, hàng xuất khẩu rẻ hơn), nên tổng cầu về sản lượng TĂNG. AD dịch sang phải khi C, I, G hoặc NX tăng vì bất kỳ lý do nào (giảm thuế, giảm lãi suất, kinh tế nước ngoài bùng nổ).</p>
<h3>总供给 AS — ngắn hạn vs. dài hạn</h3>
<p>Trong <strong>ngắn hạn (短期)</strong>, đường AS dốc LÊN — doanh nghiệp sản xuất nhiều hơn khi giá (và lợi nhuận) tăng, vì lương/chi phí còn cứng nhắc. Trong <strong>dài hạn (长期)</strong>, sản lượng bị giới hạn bởi năng lực thực của nền kinh tế (lao động, vốn, công nghệ) — đường AS THẲNG ĐỨNG tại sản lượng tiềm năng, bất kể mức giá.</p>
<pre><code>总需求-总供给 zǒng xūqiú - zǒng gōngjǐ (AD-AS):

  Mức giá (P)
    |        长期总供给 (thẳng đứng, tại sản lượng tiềm năng Y*)
    |       /
    |      / 短期总供给 (dốc lên)
    |     /
    |----均衡点 (E) --- 总需求 AD (dốc xuống)
    |___________________________ Sản lượng/GDP (Y)
                Y*

Cân bằng ngắn hạn tại giao điểm AD với 短期AS;
Cân bằng dài hạn tại giao điểm AD với 长期AS (Y = Y*, sản lượng tiềm năng).
</code></pre>
<div class="callout"><span class="badge">Đọc một cú sốc</span> Cú sốc cầu (AD dịch chuyển) làm mức giá VÀ sản lượng cùng chiều; cú sốc cung (AS dịch chuyển, vd giá dầu tăng vọt) làm chúng NGƯỢC chiều — giá tăng, sản lượng giảm. Phân biệt được hai loại này là bước đầu để chẩn đoán bất kỳ đợt suy thoái thực tế nào.</div>`,
  ]]);

const c3q = quiz('cem501-quiz-3', 'Quiz 3 — Aggregate demand & supply|||Quiz 3 — Tổng cầu & tổng cung', [
  { id: 'q1', question: 'Vì sao đường 总需求 (AD) dốc xuống theo mức giá?', options: ['Vì doanh nghiệp luôn muốn sản xuất ít hơn khi giá giảm', 'Vì khi giá giảm, sức mua thực tăng nên tổng cầu về sản lượng tăng', '总需求 luôn là một đường thẳng đứng', 'Vì lãi suất luôn giảm theo giá'], correctIndex: 1, explanation: 'Giá giảm làm giá trị thực của tiền/thu nhập tăng, kích thích chi tiêu C, I, NX → tổng cầu tăng khi giá giảm, nên AD dốc xuống.' },
  { id: 'q2', question: 'Đường 长期总供给 (AS dài hạn) có đặc điểm gì?', options: ['Dốc lên theo giá', 'Dốc xuống theo giá', 'Thẳng đứng tại sản lượng tiềm năng, không phụ thuộc mức giá', 'Trùng với đường 总需求'], correctIndex: 2, explanation: 'Trong dài hạn, sản lượng bị giới hạn bởi năng lực thực (lao động, vốn, công nghệ) nên đường AS dài hạn thẳng đứng tại Y* (sản lượng tiềm năng).' },
  { id: 'q3', question: 'Một cú sốc CUNG (vd giá dầu tăng vọt) tác động thế nào đến giá và sản lượng?', options: ['Giá và sản lượng cùng tăng', 'Giá và sản lượng cùng giảm', 'Giá tăng, sản lượng giảm (ngược chiều nhau)', 'Không ảnh hưởng gì đến giá hay sản lượng'], correctIndex: 2, explanation: 'Cú sốc cung dịch AS sang trái: chi phí sản xuất tăng đẩy giá lên trong khi sản lượng giảm — giá và sản lượng đi ngược chiều, khác cú sốc cầu (cùng chiều).' },
]);

const c4 = doc('cem501-4-1-unemployment-inflation', 'Chapter 4 — Unemployment & inflation (失业, 通货膨胀)|||Chương 4 — Thất nghiệp & lạm phát (失业, 通货膨胀)',
  'Ba loại thất nghiệp (摩擦性/结构性/周期性), tỷ lệ thất nghiệp tự nhiên; lạm phát, CPI, đường cong Phillips 菲利普斯曲线 (đánh đổi ngắn hạn).',
  [[
    `<span class="eyebrow">CEM501 · Chapter 4</span>
<h2>Unemployment &amp; inflation (失业与通货膨胀)</h2>
<h3>Key terms (关键词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>失业</td><td>shīyè</td><td>unemployment</td></tr>
<tr><td>失业率</td><td>shīyèlǜ</td><td>unemployment rate</td></tr>
<tr><td>自然失业率</td><td>zìrán shīyèlǜ</td><td>natural rate of unemployment</td></tr>
<tr><td>摩擦性失业</td><td>mócāxìng shīyè</td><td>frictional unemployment</td></tr>
<tr><td>结构性失业</td><td>jiégòuxìng shīyè</td><td>structural unemployment</td></tr>
<tr><td>周期性失业</td><td>zhōuqīxìng shīyè</td><td>cyclical unemployment</td></tr>
<tr><td>消费者价格指数</td><td>xiāofèizhě jiàgé zhǐshù</td><td>CPI (consumer price index)</td></tr>
<tr><td>菲利普斯曲线</td><td>Fēilìpǔsī qūxiàn</td><td>Phillips curve</td></tr>
</table>
<h3>Three kinds of unemployment (三种失业)</h3>
<ul>
<li><strong>摩擦性失业 (frictional)</strong> — short spells between jobs while people search/switch; normal and even healthy.</li>
<li><strong>结构性失业 (structural)</strong> — a mismatch between workers' skills/location and available jobs (e.g. automation replacing a skill).</li>
<li><strong>周期性失业 (cyclical)</strong> — caused by a recession (AD falls, firms lay off workers); this is the part that monetary/fiscal policy can actually fight.</li>
</ul>
<p>摩擦性失业 + 结构性失业 together make up the <strong>自然失业率 (natural rate)</strong> — the unemployment rate even a "healthy" economy never goes below.</p>
<pre><code>失业率 shīyèlǜ (unemployment rate) =
    失业人数 (unemployed) ÷ 劳动力人数 (labor force) × 100%

通货膨胀率 tōnghuò péngzhàng lǜ (inflation rate) =
    (本期CPI − 上期CPI) ÷ 上期CPI × 100%
    (CPI this period − CPI last period) ÷ CPI last period × 100%
</code></pre>
<h3>The Phillips curve — a short-run trade-off (菲利普斯曲线)</h3>
<p>The <strong>Phillips curve (菲利普斯曲线)</strong> plots an observed short-run trade-off: when unemployment is LOW, inflation tends to be HIGH (a tight labor market pushes wages/prices up), and vice-versa. This trade-off is only reliable in the SHORT run — in the long run, most economists agree unemployment returns to its natural rate regardless of inflation.</p>
<div class="callout"><span class="badge">CPI vs. GDP deflator</span> CPI (消费者价格指数) tracks a FIXED basket of consumer goods, while the GDP deflator (Chapter 2) covers ALL goods produced domestically — they usually move together but can diverge (e.g. an import-price spike moves CPI more than the deflator).</div>`,
    `<span class="eyebrow">CEM501 · Chương 4</span>
<h2>Thất nghiệp &amp; lạm phát (失业与通货膨胀)</h2>
<h3>Từ khoá (关键词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>失业</td><td>shīyè</td><td>thất nghiệp</td></tr>
<tr><td>失业率</td><td>shīyèlǜ</td><td>tỷ lệ thất nghiệp</td></tr>
<tr><td>自然失业率</td><td>zìrán shīyèlǜ</td><td>tỷ lệ thất nghiệp tự nhiên</td></tr>
<tr><td>摩擦性失业</td><td>mócāxìng shīyè</td><td>thất nghiệp tạm thời/cọ xát</td></tr>
<tr><td>结构性失业</td><td>jiégòuxìng shīyè</td><td>thất nghiệp cơ cấu</td></tr>
<tr><td>周期性失业</td><td>zhōuqīxìng shīyè</td><td>thất nghiệp chu kỳ</td></tr>
<tr><td>消费者价格指数</td><td>xiāofèizhě jiàgé zhǐshù</td><td>CPI (chỉ số giá tiêu dùng)</td></tr>
<tr><td>菲利普斯曲线</td><td>Fēilìpǔsī qūxiàn</td><td>đường cong Phillips</td></tr>
</table>
<h3>Ba loại thất nghiệp (三种失业)</h3>
<ul>
<li><strong>摩擦性失业 (tạm thời/cọ xát)</strong> — khoảng thời gian ngắn giữa hai công việc khi người lao động tìm/đổi việc; là bình thường và thậm chí lành mạnh.</li>
<li><strong>结构性失业 (cơ cấu)</strong> — lệch pha giữa kỹ năng/vị trí của người lao động và việc làm sẵn có (vd tự động hoá thay thế một kỹ năng).</li>
<li><strong>周期性失业 (chu kỳ)</strong> — do suy thoái gây ra (AD giảm, doanh nghiệp sa thải); đây là phần mà chính sách tiền tệ/tài khoá thực sự có thể chống lại.</li>
</ul>
<p>摩擦性失业 + 结构性失业 cộng lại tạo thành <strong>自然失业率 (tỷ lệ tự nhiên)</strong> — mức thất nghiệp mà ngay cả một nền kinh tế "khoẻ mạnh" cũng không xuống thấp hơn.</p>
<pre><code>失业率 shīyèlǜ (tỷ lệ thất nghiệp) =
    失业人数 (số người thất nghiệp) ÷ 劳动力人数 (lực lượng lao động) × 100%

通货膨胀率 tōnghuò péngzhàng lǜ (tỷ lệ lạm phát) =
    (本期CPI − 上期CPI) ÷ 上期CPI × 100%
    (CPI kỳ này − CPI kỳ trước) ÷ CPI kỳ trước × 100%
</code></pre>
<h3>Đường cong Phillips — đánh đổi ngắn hạn (菲利普斯曲线)</h3>
<p>Đường <strong>Phillips (菲利普斯曲线)</strong> vẽ một sự đánh đổi quan sát được trong ngắn hạn: khi thất nghiệp THẤP, lạm phát có xu hướng CAO (thị trường lao động căng đẩy lương/giá lên), và ngược lại. Sự đánh đổi này chỉ đáng tin trong NGẮN hạn — trong dài hạn, đa số nhà kinh tế đồng ý thất nghiệp quay về mức tự nhiên bất kể lạm phát.</p>
<div class="callout"><span class="badge">CPI vs. chỉ số giảm phát GDP</span> CPI (消费者价格指数) theo dõi một GIỎ HÀNG cố định của người tiêu dùng, còn chỉ số giảm phát GDP (Chương 2) bao trùm TẤT CẢ hàng hoá sản xuất trong nước — chúng thường đi cùng chiều nhưng có thể lệch nhau (vd giá hàng nhập khẩu tăng vọt ảnh hưởng CPI nhiều hơn chỉ số giảm phát).</div>`,
  ]]);

const c4q = quiz('cem501-quiz-4', 'Quiz 4 — Unemployment & inflation|||Quiz 4 — Thất nghiệp & lạm phát', [
  { id: 'q1', question: 'Loại thất nghiệp nào do SUY THOÁI kinh tế gây ra và là mục tiêu chính của chính sách chống thất nghiệp?', options: ['摩擦性失业 (tạm thời)', '结构性失业 (cơ cấu)', '周期性失业 (chu kỳ)', '自然失业率 (tỷ lệ tự nhiên) luôn bằng 0'], correctIndex: 2, explanation: '周期性失业 (thất nghiệp chu kỳ) sinh ra khi tổng cầu giảm trong suy thoái — đây là phần chính sách tiền tệ/tài khoá có thể tác động, khác với 摩擦性 và 结构性 vốn tồn tại ngay cả khi kinh tế khoẻ mạnh.' },
  { id: 'q2', question: 'Đường cong Phillips (菲利普斯曲线) mô tả điều gì?', options: ['Mối quan hệ giữa GDP và dân số', 'Sự đánh đổi ngắn hạn: thất nghiệp thấp thường đi kèm lạm phát cao, và ngược lại', 'Công thức tính GDP theo phương pháp chi tiêu', 'Tỷ giá hối đoái giữa hai đồng tiền'], correctIndex: 1, explanation: 'Phillips curve cho thấy trong ngắn hạn, thất nghiệp thấp thường đi kèm lạm phát cao do thị trường lao động căng thẳng đẩy lương/giá lên.' },
  { id: 'q3', question: 'Chỉ số CPI (消费者价格指数) khác chỉ số giảm phát GDP (GDP平减指数) ở điểm nào?', options: ['CPI đo giỏ hàng cố định của người tiêu dùng, còn chỉ số giảm phát GDP bao trùm mọi hàng hoá sản xuất trong nước', 'Hai chỉ số hoàn toàn giống nhau, chỉ khác tên gọi', 'CPI chỉ áp dụng cho hàng xuất khẩu', 'Chỉ số giảm phát GDP chỉ tính giá hàng nhập khẩu'], correctIndex: 0, explanation: 'CPI theo dõi giỏ hàng tiêu dùng cố định; chỉ số giảm phát GDP bao trùm toàn bộ sản lượng trong nước — hai chỉ số có thể lệch nhau, ví dụ khi giá hàng nhập khẩu biến động mạnh.' },
]);

const c5 = doc('cem501-5-1-money-banking-monetary-policy', 'Chapter 5 — Money, banking & monetary policy (货币政策)|||Chương 5 — Tiền tệ, ngân hàng & chính sách tiền tệ (货币政策)',
  'Ngân hàng trung ương 中央银行, ba công cụ chính sách tiền tệ (存款准备金率, 再贴现率, 公开市场业务), số nhân tiền, thuyết số lượng tiền tệ MV=PY.',
  [[
    `<span class="eyebrow">CEM501 · Chapter 5</span>
<h2>Money, banking &amp; monetary policy (货币、银行与货币政策)</h2>
<h3>Key terms (关键词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>货币</td><td>huòbì</td><td>money</td></tr>
<tr><td>货币供给</td><td>huòbì gōngjǐ</td><td>money supply</td></tr>
<tr><td>中央银行</td><td>zhōngyāng yínháng</td><td>central bank</td></tr>
<tr><td>货币政策</td><td>huòbì zhèngcè</td><td>monetary policy</td></tr>
<tr><td>利率</td><td>lìlǜ</td><td>interest rate</td></tr>
<tr><td>存款准备金率</td><td>cúnkuǎn zhǔnbèijīnlǜ</td><td>reserve requirement ratio</td></tr>
<tr><td>公开市场业务</td><td>gōngkāi shìchǎng yèwù</td><td>open market operations</td></tr>
<tr><td>再贴现率</td><td>zàitiēxiànlǜ</td><td>(re)discount rate</td></tr>
</table>
<h3>The central bank's three tools (中央银行的三大工具)</h3>
<ul>
<li><strong>存款准备金率 (reserve requirement ratio)</strong> — the % of deposits banks must hold, not lend out. Lower it → banks can lend more → money supply expands.</li>
<li><strong>再贴现率 (discount rate)</strong> — the rate the central bank charges banks that borrow from it directly. Lower it → cheaper for banks to borrow → more lending.</li>
<li><strong>公开市场业务 (open market operations)</strong> — the central bank buying/selling government bonds. Buying bonds injects money into the banking system (expansionary); selling withdraws it (contractionary). This is the tool used day-to-day.</li>
</ul>
<h3>The money multiplier &amp; the quantity equation</h3>
<pre><code>货币乘数 huòbì chéngshù (money multiplier) = 1 ÷ 存款准备金率
  (vd 存款准备金率 = 10% → 货币乘数 = 1 ÷ 0.10 = 10)
  → mỗi 1 đồng dự trữ ban đầu có thể tạo ra 10 đồng cung tiền qua hệ thống ngân hàng

数量方程式 shùliàng fāngchéngshì (quantity equation): M × V = P × Y
  M 货币供给 (money supply)   V 货币流通速度 (velocity of money)
  P 价格水平 (price level)    Y 实际产出 (real output)
</code></pre>
<p>An <strong>expansionary monetary policy</strong> (lower rates / more money) aims to push AD to the right — boosting output and jobs, at the risk of higher inflation. A <strong>contractionary</strong> one does the opposite — cooling an overheating, high-inflation economy.</p>
<div class="callout"><span class="badge">Tool vs. target</span> Interest rate (利率) is usually the TARGET the central bank announces; open market operations (公开市场业务) is the day-to-day TOOL used to hit that target — don't confuse the lever with the dial it moves.</div>`,
    `<span class="eyebrow">CEM501 · Chương 5</span>
<h2>Tiền tệ, ngân hàng &amp; chính sách tiền tệ (货币、银行与货币政策)</h2>
<h3>Từ khoá (关键词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>货币</td><td>huòbì</td><td>tiền tệ</td></tr>
<tr><td>货币供给</td><td>huòbì gōngjǐ</td><td>cung tiền</td></tr>
<tr><td>中央银行</td><td>zhōngyāng yínháng</td><td>ngân hàng trung ương</td></tr>
<tr><td>货币政策</td><td>huòbì zhèngcè</td><td>chính sách tiền tệ</td></tr>
<tr><td>利率</td><td>lìlǜ</td><td>lãi suất</td></tr>
<tr><td>存款准备金率</td><td>cúnkuǎn zhǔnbèijīnlǜ</td><td>tỷ lệ dự trữ bắt buộc</td></tr>
<tr><td>公开市场业务</td><td>gōngkāi shìchǎng yèwù</td><td>nghiệp vụ thị trường mở</td></tr>
<tr><td>再贴现率</td><td>zàitiēxiànlǜ</td><td>lãi suất tái chiết khấu</td></tr>
</table>
<h3>Ba công cụ của ngân hàng trung ương (中央银行的三大工具)</h3>
<ul>
<li><strong>存款准备金率 (tỷ lệ dự trữ bắt buộc)</strong> — % tiền gửi ngân hàng phải giữ lại, không được cho vay. Giảm tỷ lệ này → ngân hàng cho vay nhiều hơn → cung tiền tăng.</li>
<li><strong>再贴现率 (lãi suất tái chiết khấu)</strong> — lãi suất ngân hàng trung ương tính khi ngân hàng thương mại vay trực tiếp từ nó. Giảm lãi suất này → ngân hàng vay rẻ hơn → cho vay nhiều hơn.</li>
<li><strong>公开市场业务 (nghiệp vụ thị trường mở)</strong> — ngân hàng trung ương mua/bán trái phiếu chính phủ. Mua trái phiếu bơm tiền vào hệ thống ngân hàng (mở rộng); bán trái phiếu rút tiền ra (thắt chặt). Đây là công cụ dùng hàng ngày.</li>
</ul>
<h3>Số nhân tiền &amp; phương trình số lượng</h3>
<pre><code>货币乘数 huòbì chéngshù (số nhân tiền) = 1 ÷ 存款准备金率
  (vd 存款准备金率 = 10% → 货币乘数 = 1 ÷ 0.10 = 10)
  → mỗi 1 đồng dự trữ ban đầu có thể tạo ra 10 đồng cung tiền qua hệ thống ngân hàng

数量方程式 shùliàng fāngchéngshì (phương trình số lượng): M × V = P × Y
  M 货币供给 (cung tiền)      V 货币流通速度 (tốc độ lưu thông tiền)
  P 价格水平 (mức giá chung)  Y 实际产出 (sản lượng thực)
</code></pre>
<p>Một <strong>chính sách tiền tệ mở rộng</strong> (giảm lãi suất / tăng cung tiền) nhằm đẩy AD sang phải — tăng sản lượng và việc làm, đổi lại rủi ro lạm phát cao hơn. Một chính sách <strong>thắt chặt</strong> làm ngược lại — hạ nhiệt một nền kinh tế quá nóng, lạm phát cao.</p>
<div class="callout"><span class="badge">Công cụ vs. mục tiêu</span> Lãi suất (利率) thường là MỤC TIÊU mà ngân hàng trung ương công bố; nghiệp vụ thị trường mở (公开市场业务) là CÔNG CỤ dùng hàng ngày để đạt mục tiêu đó — đừng nhầm đòn bẩy với cái đồng hồ nó điều chỉnh.</div>`,
  ]]);

const c5q = quiz('cem501-quiz-5', 'Quiz 5 — Money & monetary policy|||Quiz 5 — Tiền tệ & chính sách tiền tệ', [
  { id: 'q1', question: 'Nếu 存款准备金率 (tỷ lệ dự trữ bắt buộc) là 20%, 货币乘数 (số nhân tiền) bằng bao nhiêu?', options: ['2', '5', '10', '20'], correctIndex: 1, explanation: '货币乘数 = 1 ÷ 存款准备金率 = 1 ÷ 0.20 = 5.' },
  { id: 'q2', question: 'Công cụ nào của ngân hàng trung ương được dùng HÀNG NGÀY để điều tiết cung tiền?', options: ['存款准备金率', '再贴现率', '公开市场业务 (mua/bán trái phiếu chính phủ)', '财政政策'], correctIndex: 2, explanation: '公开市场业务 (nghiệp vụ thị trường mở) là công cụ linh hoạt, dùng thường xuyên hàng ngày; hai công cụ kia ít thay đổi hơn, còn 财政政策 thuộc về chính phủ chứ không phải ngân hàng trung ương.' },
  { id: 'q3', question: 'Chính sách tiền tệ MỞ RỘNG (giảm lãi suất, tăng cung tiền) nhằm mục đích gì?', options: ['Giảm tổng cầu để hạ lạm phát', 'Tăng tổng cầu (AD) để kích thích sản lượng và việc làm', 'Tăng tỷ lệ dự trữ bắt buộc', 'Giảm 货币供给 (cung tiền)'], correctIndex: 1, explanation: 'Chính sách tiền tệ mở rộng đẩy AD sang phải qua giảm lãi suất/tăng cung tiền, kích thích chi tiêu, sản lượng và việc làm — đánh đổi là rủi ro lạm phát cao hơn.' },
]);

const c6 = doc('cem501-6-1-fiscal-policy-budget', 'Chapter 6 — Fiscal policy & the government budget (财政政策)|||Chương 6 — Chính sách tài khoá & ngân sách nhà nước (财政政策)',
  'Thu ngân sách 财政收入, chi ngân sách 财政支出, thâm hụt 财政赤字, nợ công 公共债务; chính sách tài khoá mở rộng/thắt chặt.',
  [[
    `<span class="eyebrow">CEM501 · Chapter 6</span>
<h2>Fiscal policy &amp; the budget (财政政策与国家预算)</h2>
<h3>Key terms (关键词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>财政政策</td><td>cáizhèng zhèngcè</td><td>fiscal policy</td></tr>
<tr><td>财政收入</td><td>cáizhèng shōurù</td><td>government revenue</td></tr>
<tr><td>财政支出</td><td>cáizhèng zhīchū</td><td>government expenditure</td></tr>
<tr><td>财政赤字</td><td>cáizhèng chìzì</td><td>budget deficit</td></tr>
<tr><td>公共债务</td><td>gōnggòng zhàiwù</td><td>public debt</td></tr>
<tr><td>税收</td><td>shuìshōu</td><td>tax revenue</td></tr>
<tr><td>扩张性财政政策</td><td>kuòzhāngxìng cáizhèng zhèngcè</td><td>expansionary fiscal policy</td></tr>
<tr><td>紧缩性财政政策</td><td>jǐnsuōxìng cáizhèng zhèngcè</td><td>contractionary fiscal policy</td></tr>
</table>
<h3>The budget balance (预算平衡)</h3>
<pre><code>财政收支差额 (budget balance) = 财政收入 (T, chủ yếu 税收) − 财政支出 (G)

  差额 > 0  → 财政盈余 (cáizhèng yíngyú, budget surplus)
  差额 = 0  → 预算平衡 (yùsuàn pínghéng, balanced budget)
  差额 < 0  → 财政赤字 (cáizhèng chìzì, budget deficit)
             → repeated deficits accumulate into 公共债务 (public debt)
</code></pre>
<h3>Expansionary vs. contractionary (扩张性 vs. 紧缩性)</h3>
<ul>
<li><strong>扩张性财政政策 (expansionary)</strong> — increase 财政支出 (G) and/or cut 税收 (T) to push AD to the right, fighting a recession/high unemployment; the trade-off is a larger 财政赤字.</li>
<li><strong>紧缩性财政政策 (contractionary)</strong> — cut G and/or raise T to pull AD left, cooling an overheating, high-inflation economy or reducing debt.</li>
</ul>
<p>Some spending/tax rules act automatically without new legislation — 自动稳定器 (zìdòng wěndìngqì, "automatic stabilizers") like unemployment benefits (rise automatically in a recession) and progressive taxes (fall automatically when incomes fall) smooth the cycle without any deliberate policy decision.</p>
<div class="callout"><span class="badge">Fiscal vs. monetary, same goal different lever</span> Both fiscal (Ch.6) and monetary (Ch.5) policy can push AD the same direction — the choice between them is about speed, side-effects (debt vs. inflation) and who controls the lever (elected government vs. independent central bank).</div>`,
    `<span class="eyebrow">CEM501 · Chương 6</span>
<h2>Chính sách tài khoá &amp; ngân sách nhà nước (财政政策与国家预算)</h2>
<h3>Từ khoá (关键词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>财政政策</td><td>cáizhèng zhèngcè</td><td>chính sách tài khoá</td></tr>
<tr><td>财政收入</td><td>cáizhèng shōurù</td><td>thu ngân sách nhà nước</td></tr>
<tr><td>财政支出</td><td>cáizhèng zhīchū</td><td>chi ngân sách nhà nước</td></tr>
<tr><td>财政赤字</td><td>cáizhèng chìzì</td><td>thâm hụt ngân sách</td></tr>
<tr><td>公共债务</td><td>gōnggòng zhàiwù</td><td>nợ công</td></tr>
<tr><td>税收</td><td>shuìshōu</td><td>thu từ thuế</td></tr>
<tr><td>扩张性财政政策</td><td>kuòzhāngxìng cáizhèng zhèngcè</td><td>chính sách tài khoá mở rộng</td></tr>
<tr><td>紧缩性财政政策</td><td>jǐnsuōxìng cáizhèng zhèngcè</td><td>chính sách tài khoá thắt chặt</td></tr>
</table>
<h3>Cân đối ngân sách (预算平衡)</h3>
<pre><code>财政收支差额 (cân đối ngân sách) = 财政收入 (T, chủ yếu 税收) − 财政支出 (G)

  差额 > 0  → 财政盈余 (cáizhèng yíngyú, thặng dư ngân sách)
  差额 = 0  → 预算平衡 (yùsuàn pínghéng, cân bằng ngân sách)
  差额 < 0  → 财政赤字 (cáizhèng chìzì, thâm hụt ngân sách)
             → thâm hụt lặp lại nhiều năm cộng dồn thành 公共债务 (nợ công)
</code></pre>
<h3>Mở rộng vs. thắt chặt (扩张性 vs. 紧缩性)</h3>
<ul>
<li><strong>扩张性财政政策 (mở rộng)</strong> — tăng 财政支出 (G) và/hoặc giảm 税收 (T) để đẩy AD sang phải, chống suy thoái/thất nghiệp cao; đánh đổi là 财政赤字 lớn hơn.</li>
<li><strong>紧缩性财政政策 (thắt chặt)</strong> — giảm G và/hoặc tăng T để kéo AD sang trái, hạ nhiệt kinh tế quá nóng, lạm phát cao, hoặc giảm nợ.</li>
</ul>
<p>Một số quy định thu/chi tự động vận hành mà không cần luật mới — <strong>自动稳定器 (zìdòng wěndìngqì, "bộ ổn định tự động")</strong> như trợ cấp thất nghiệp (tự động tăng khi suy thoái) và thuế luỹ tiến (tự động giảm khi thu nhập giảm) làm dịu chu kỳ kinh tế mà không cần một quyết định chính sách chủ động nào.</p>
<div class="callout"><span class="badge">Tài khoá vs. tiền tệ, cùng mục tiêu khác đòn bẩy</span> Cả chính sách tài khoá (Chương 6) và tiền tệ (Chương 5) đều có thể đẩy AD cùng một hướng — lựa chọn giữa chúng phụ thuộc tốc độ, tác dụng phụ (nợ vs. lạm phát) và ai kiểm soát đòn bẩy (chính phủ dân cử vs. ngân hàng trung ương độc lập).</div>`,
  ]]);

const c6q = quiz('cem501-quiz-6', 'Quiz 6 — Fiscal policy & budget|||Quiz 6 — Chính sách tài khoá & ngân sách', [
  { id: 'q1', question: 'Khi 财政支出 (G) lớn hơn 财政收入 (T), ngân sách ở trạng thái nào?', options: ['财政盈余 (thặng dư)', '预算平衡 (cân bằng)', '财政赤字 (thâm hụt)', '公共债务 bằng 0'], correctIndex: 2, explanation: 'Khi chi (G) vượt thu (T), ngân sách thâm hụt (财政赤字); thâm hụt tích luỹ nhiều năm tạo thành 公共债务 (nợ công).' },
  { id: 'q2', question: '扩张性财政政策 (chính sách tài khoá mở rộng) thường dùng công cụ nào?', options: ['Tăng thuế và giảm chi tiêu chính phủ', 'Giảm thuế và/hoặc tăng chi tiêu chính phủ để đẩy AD sang phải', 'Chỉ điều chỉnh tỷ lệ dự trữ bắt buộc của ngân hàng', 'Chỉ can thiệp vào tỷ giá hối đoái'], correctIndex: 1, explanation: 'Chính sách tài khoá mở rộng tăng G và/hoặc giảm T để kích thích tổng cầu, chống suy thoái — đổi lại thâm hụt ngân sách có thể tăng.' },
  { id: 'q3', question: '"自动稳定器" (bộ ổn định tự động) như trợ cấp thất nghiệp hoạt động như thế nào?', options: ['Cần Quốc hội thông qua luật mới mỗi lần kinh tế suy thoái', 'Tự động tăng chi/giảm thu khi kinh tế suy yếu mà không cần quyết định chính sách mới', 'Chỉ hoạt động khi lạm phát cao', 'Là công cụ của chính sách tiền tệ, không phải tài khoá'], correctIndex: 1, explanation: '自动稳定器 vận hành tự động theo tình hình kinh tế (vd trợ cấp thất nghiệp tăng khi suy thoái, thuế luỹ tiến giảm khi thu nhập giảm) mà không cần một đạo luật mới mỗi lần.' },
]);

const c7 = doc('cem501-7-1-open-economy-exchange-bop', 'Chapter 7 — Open economy: exchange rates & balance of payments (汇率, 国际收支)|||Chương 7 — Kinh tế mở: tỷ giá & cán cân thanh toán (汇率, 国际收支)',
  'Tỷ giá cố định/thả nổi 固定汇率/浮动汇率, cán cân thanh toán 国际收支 (tài khoản vãng lai + tài khoản vốn), thặng dư/thâm hụt thương mại.',
  [[
    `<span class="eyebrow">CEM501 · Chapter 7</span>
<h2>Open economy: exchange rates &amp; balance of payments (开放经济：汇率与国际收支)</h2>
<h3>Key terms (关键词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>汇率</td><td>huìlǜ</td><td>exchange rate</td></tr>
<tr><td>国际收支</td><td>guójì shōuzhī</td><td>balance of payments (BOP)</td></tr>
<tr><td>经常账户</td><td>jīngcháng zhànghù</td><td>current account</td></tr>
<tr><td>资本账户</td><td>zīběn zhànghù</td><td>capital account</td></tr>
<tr><td>贸易顺差</td><td>màoyì shùnchā</td><td>trade surplus</td></tr>
<tr><td>贸易逆差</td><td>màoyì nìchā</td><td>trade deficit</td></tr>
<tr><td>固定汇率</td><td>gùdìng huìlǜ</td><td>fixed exchange rate</td></tr>
<tr><td>浮动汇率</td><td>fúdòng huìlǜ</td><td>floating exchange rate</td></tr>
</table>
<h3>The balance of payments (国际收支)</h3>
<p>The <strong>国际收支 (BOP)</strong> records ALL of a country's transactions with the rest of the world, split into two main accounts:</p>
<pre><code>国际收支 guójì shōuzhī (Balance of Payments):

  经常账户 jīngcháng zhànghù (Current account)
    ≈ 贸易差额 (trade balance = exports − imports) + income + transfers
    结果 > 0 → 贸易顺差 (surplus, xuất siêu)
    结果 < 0 → 贸易逆差 (deficit, nhập siêu)

  资本账户 zīběn zhànghù (Capital/financial account)
    = net flows of investment, loans, reserves crossing borders

  Về nguyên tắc: 经常账户 + 资本账户 ≈ 0 (BOP luôn cân bằng về tổng thể)
</code></pre>
<h3>Fixed vs. floating exchange rates (固定汇率 vs. 浮动汇率)</h3>
<ul>
<li><strong>固定汇率 (fixed)</strong> — the central bank pegs the currency to another (e.g. USD) and intervenes (buying/selling reserves) to hold it there — stable for trade, but ties the hands of monetary policy.</li>
<li><strong>浮动汇率 (floating)</strong> — the market sets the rate via supply/demand for the currency; it absorbs shocks automatically but can be volatile.</li>
</ul>
<div class="callout"><span class="badge">Currency &amp; trade balance link</span> A currency that APPRECIATES (strengthens, 升值 shēngzhí) makes exports more expensive abroad and imports cheaper at home, pushing the trade balance toward a 贸易逆差; a currency that DEPRECIATES (weakens, 贬值 biǎnzhí) does the opposite — this is why exchange rates and NX (Chapter 2/3) are tightly linked.</div>`,
    `<span class="eyebrow">CEM501 · Chương 7</span>
<h2>Kinh tế mở: tỷ giá &amp; cán cân thanh toán (开放经济：汇率与国际收支)</h2>
<h3>Từ khoá (关键词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>汇率</td><td>huìlǜ</td><td>tỷ giá hối đoái</td></tr>
<tr><td>国际收支</td><td>guójì shōuzhī</td><td>cán cân thanh toán (BOP)</td></tr>
<tr><td>经常账户</td><td>jīngcháng zhànghù</td><td>tài khoản vãng lai</td></tr>
<tr><td>资本账户</td><td>zīběn zhànghù</td><td>tài khoản vốn</td></tr>
<tr><td>贸易顺差</td><td>màoyì shùnchā</td><td>xuất siêu (thặng dư thương mại)</td></tr>
<tr><td>贸易逆差</td><td>màoyì nìchā</td><td>nhập siêu (thâm hụt thương mại)</td></tr>
<tr><td>固定汇率</td><td>gùdìng huìlǜ</td><td>tỷ giá cố định</td></tr>
<tr><td>浮动汇率</td><td>fúdòng huìlǜ</td><td>tỷ giá thả nổi</td></tr>
</table>
<h3>Cán cân thanh toán (国际收支)</h3>
<p><strong>国际收支 (BOP)</strong> ghi nhận TOÀN BỘ giao dịch của một nước với phần còn lại thế giới, chia làm hai tài khoản chính:</p>
<pre><code>国际收支 guójì shōuzhī (Cán cân thanh toán):

  经常账户 jīngcháng zhànghù (Tài khoản vãng lai)
    ≈ 贸易差额 (cán cân thương mại = xuất khẩu − nhập khẩu) + thu nhập + chuyển giao
    kết quả > 0 → 贸易顺差 (thặng dư, xuất siêu)
    kết quả < 0 → 贸易逆差 (thâm hụt, nhập siêu)

  资本账户 zīběn zhànghù (Tài khoản vốn/tài chính)
    = dòng vốn đầu tư, cho vay, dự trữ ròng qua biên giới

  Về nguyên tắc: 经常账户 + 资本账户 ≈ 0 (BOP luôn cân bằng về tổng thể)
</code></pre>
<h3>Tỷ giá cố định vs. thả nổi (固定汇率 vs. 浮动汇率)</h3>
<ul>
<li><strong>固定汇率 (cố định)</strong> — ngân hàng trung ương neo đồng tiền vào một đồng khác (vd USD) và can thiệp (mua/bán dự trữ) để giữ tỷ giá — ổn định cho thương mại, nhưng trói tay chính sách tiền tệ.</li>
<li><strong>浮动汇率 (thả nổi)</strong> — thị trường quyết định tỷ giá qua cung/cầu đồng tiền; tự hấp thụ cú sốc nhưng có thể biến động mạnh.</li>
</ul>
<div class="callout"><span class="badge">Liên hệ tỷ giá &amp; cán cân thương mại</span> Một đồng tiền LÊN GIÁ (mạnh lên, 升值 shēngzhí) làm hàng xuất khẩu đắt hơn ở nước ngoài và hàng nhập khẩu rẻ hơn trong nước, đẩy cán cân thương mại về phía 贸易逆差; một đồng tiền MẤT GIÁ (yếu đi, 贬值 biǎnzhí) làm ngược lại — đây là lý do tỷ giá và NX (Chương 2/3) gắn chặt với nhau.</div>`,
  ]]);

const c7q = quiz('cem501-quiz-7', 'Quiz 7 — Open economy & exchange rates|||Quiz 7 — Kinh tế mở & tỷ giá', [
  { id: 'q1', question: 'Khi xuất khẩu lớn hơn nhập khẩu, cán cân thương mại ở trạng thái nào?', options: ['贸易逆差 (nhập siêu)', '贸易顺差 (xuất siêu)', '固定汇率', '资本账户 âm vô hạn'], correctIndex: 1, explanation: 'Xuất khẩu > nhập khẩu → 贸易顺差 (thặng dư thương mại, xuất siêu).' },
  { id: 'q2', question: 'Khác biệt chính giữa 固定汇率 (tỷ giá cố định) và 浮动汇率 (tỷ giá thả nổi) là gì?', options: ['Không có khác biệt, chỉ là hai tên gọi', '固定汇率 do thị trường tự quyết định hoàn toàn', '固定汇率 được neo và ngân hàng trung ương can thiệp giữ ổn định; 浮动汇率 do cung/cầu thị trường quyết định', 'Chỉ nước nghèo mới dùng 浮动汇率'], correctIndex: 2, explanation: '固定汇率 (cố định) cần ngân hàng trung ương can thiệp (mua/bán dự trữ) để giữ tỷ giá; 浮动汇率 (thả nổi) để thị trường tự điều chỉnh qua cung/cầu.' },
  { id: 'q3', question: 'Khi đồng nội tệ LÊN GIÁ (升值), điều gì xảy ra với xuất khẩu và nhập khẩu?', options: ['Xuất khẩu rẻ hơn, nhập khẩu đắt hơn — đẩy về xuất siêu', 'Xuất khẩu đắt hơn ở nước ngoài, nhập khẩu rẻ hơn trong nước — đẩy về nhập siêu', 'Không ảnh hưởng đến xuất nhập khẩu', 'Chỉ ảnh hưởng đến 资本账户, không ảnh hưởng thương mại'], correctIndex: 1, explanation: 'Đồng tiền lên giá làm hàng xuất khẩu đắt hơn với người mua nước ngoài và hàng nhập khẩu rẻ hơn trong nước, có xu hướng đẩy cán cân thương mại về phía nhập siêu (贸易逆差).' },
]);

const c8 = doc('cem501-8-1-business-cycles-review', 'Chapter 8 — Business cycles, long-run growth & terminology review (经济周期)|||Chương 8 — Chu kỳ kinh tế, tăng trưởng dài hạn & ôn tập thuật ngữ (经济周期)',
  '4 pha chu kỳ kinh tế (繁荣/衰退/萧条/复苏), tăng trưởng dài hạn &amp; mô hình Solow 索洛增长模型; bảng ôn tập thuật ngữ toàn môn.',
  [[
    `<span class="eyebrow">CEM501 · Chapter 8</span>
<h2>Business cycles &amp; long-run growth (经济周期与长期增长)</h2>
<h3>Key terms (关键词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>经济周期</td><td>jīngjì zhōuqī</td><td>business cycle</td></tr>
<tr><td>繁荣</td><td>fánróng</td><td>boom / prosperity</td></tr>
<tr><td>衰退</td><td>shuāituì</td><td>recession</td></tr>
<tr><td>萧条</td><td>xiāotiáo</td><td>depression</td></tr>
<tr><td>复苏</td><td>fùsū</td><td>recovery</td></tr>
<tr><td>经济增长率</td><td>jīngjì zēngzhǎng lǜ</td><td>economic growth rate</td></tr>
<tr><td>可持续增长</td><td>kě chíxù zēngzhǎng</td><td>sustainable growth</td></tr>
<tr><td>索洛增长模型</td><td>Suǒluò zēngzhǎng móxíng</td><td>Solow growth model</td></tr>
</table>
<h3>The four phases (经济周期的四个阶段)</h3>
<pre><code>经济周期 jīngjì zhōuqī (Business cycle) — bốn pha nối tiếp nhau:

  繁荣 fánróng (Boom) — output above potential, low unemployment, inflation risk
       ↓
  衰退 shuāituì (Recession) — output falling, unemployment rising (周期性失业, Ch.4)
       ↓
  萧条 xiāotiáo (Depression) — a deep, prolonged recession (rare, severe)
       ↓
  复苏 fùsū (Recovery) — output rising back toward potential
       ↓ (quay lại 繁荣, chu kỳ lặp lại)
</code></pre>
<h3>Long-run growth: the Solow model (索洛增长模型)</h3>
<p>While Chapters 3-7 explain SHORT-run fluctuations around potential output, the <strong>索洛增长模型 (Solow growth model)</strong> explains what makes potential output ITSELF grow over decades: accumulating capital (资本), a growing labor force (劳动力), and — most importantly in the long run — <strong>technological progress (技术进步)</strong>. Capital accumulation alone runs into diminishing returns; sustained <strong>可持续增长 (sustainable growth)</strong> in living standards ultimately comes from technology and productivity, not just piling up more machines.</p>
<h3>Full-course terminology review (全课程术语复习)</h3>
<table>
<tr><th>Chương</th><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>1</td><td>宏观经济学</td><td>hóngguān jīngjìxué</td><td>kinh tế học vĩ mô</td></tr>
<tr><td>2</td><td>国内生产总值</td><td>guónèi shēngchǎn zǒngzhí</td><td>GDP</td></tr>
<tr><td>3</td><td>总需求 / 总供给</td><td>zǒng xūqiú / zǒng gōngjǐ</td><td>tổng cầu / tổng cung</td></tr>
<tr><td>4</td><td>失业率 / 通货膨胀</td><td>shīyèlǜ / tōnghuò péngzhàng</td><td>tỷ lệ thất nghiệp / lạm phát</td></tr>
<tr><td>5</td><td>货币政策</td><td>huòbì zhèngcè</td><td>chính sách tiền tệ</td></tr>
<tr><td>6</td><td>财政政策</td><td>cáizhèng zhèngcè</td><td>chính sách tài khoá</td></tr>
<tr><td>7</td><td>汇率 / 国际收支</td><td>huìlǜ / guójì shōuzhī</td><td>tỷ giá / cán cân thanh toán</td></tr>
<tr><td>8</td><td>经济周期</td><td>jīngjì zhōuqī</td><td>chu kỳ kinh tế</td></tr>
</table>
<div class="callout"><span class="badge">Putting it together</span> A full macro "story" for any country connects all eight chapters: measure the state with GDP/unemployment/inflation (Ch.2/4), explain it with AD-AS (Ch.3), and diagnose which lever (货币政策 Ch.5, 财政政策 Ch.6) or external factor (汇率 Ch.7) is driving the current phase of the 经济周期 (Ch.8).</div>`,
    `<span class="eyebrow">CEM501 · Chương 8</span>
<h2>Chu kỳ kinh tế &amp; tăng trưởng dài hạn (经济周期与长期增长)</h2>
<h3>Từ khoá (关键词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>经济周期</td><td>jīngjì zhōuqī</td><td>chu kỳ kinh tế</td></tr>
<tr><td>繁荣</td><td>fánróng</td><td>phồn vinh, hưng thịnh</td></tr>
<tr><td>衰退</td><td>shuāituì</td><td>suy thoái</td></tr>
<tr><td>萧条</td><td>xiāotiáo</td><td>khủng hoảng, tiêu điều</td></tr>
<tr><td>复苏</td><td>fùsū</td><td>phục hồi</td></tr>
<tr><td>经济增长率</td><td>jīngjì zēngzhǎng lǜ</td><td>tỷ lệ tăng trưởng kinh tế</td></tr>
<tr><td>可持续增长</td><td>kě chíxù zēngzhǎng</td><td>tăng trưởng bền vững</td></tr>
<tr><td>索洛增长模型</td><td>Suǒluò zēngzhǎng móxíng</td><td>mô hình tăng trưởng Solow</td></tr>
</table>
<h3>Bốn pha của chu kỳ kinh tế (经济周期的四个阶段)</h3>
<pre><code>经济周期 jīngjì zhōuqī (Chu kỳ kinh tế) — bốn pha nối tiếp nhau:

  繁荣 fánróng (Hưng thịnh) — sản lượng vượt tiềm năng, thất nghiệp thấp, rủi ro lạm phát
       ↓
  衰退 shuāituì (Suy thoái) — sản lượng giảm, thất nghiệp tăng (周期性失业, Chương 4)
       ↓
  萧条 xiāotiáo (Khủng hoảng) — suy thoái sâu, kéo dài (hiếm gặp, nghiêm trọng)
       ↓
  复苏 fùsū (Phục hồi) — sản lượng tăng trở lại về mức tiềm năng
       ↓ (quay lại 繁荣, chu kỳ lặp lại)
</code></pre>
<h3>Tăng trưởng dài hạn: mô hình Solow (索洛增长模型)</h3>
<p>Trong khi Chương 3-7 giải thích biến động NGẮN hạn quanh sản lượng tiềm năng, <strong>索洛增长模型 (mô hình tăng trưởng Solow)</strong> giải thích điều gì làm bản thân sản lượng tiềm năng TĂNG theo hàng chục năm: tích luỹ vốn (资本), lực lượng lao động tăng (劳动力), và — quan trọng nhất trong dài hạn — <strong>tiến bộ công nghệ (技术进步)</strong>. Chỉ tích luỹ vốn thôi sẽ gặp quy luật lợi suất giảm dần; <strong>可持续增长 (tăng trưởng bền vững)</strong> mức sống lâu dài đến từ công nghệ và năng suất, chứ không chỉ chất thêm máy móc.</p>
<h3>Ôn tập thuật ngữ toàn môn (全课程术语复习)</h3>
<table>
<tr><th>Chương</th><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>1</td><td>宏观经济学</td><td>hóngguān jīngjìxué</td><td>kinh tế học vĩ mô</td></tr>
<tr><td>2</td><td>国内生产总值</td><td>guónèi shēngchǎn zǒngzhí</td><td>GDP</td></tr>
<tr><td>3</td><td>总需求 / 总供给</td><td>zǒng xūqiú / zǒng gōngjǐ</td><td>tổng cầu / tổng cung</td></tr>
<tr><td>4</td><td>失业率 / 通货膨胀</td><td>shīyèlǜ / tōnghuò péngzhàng</td><td>tỷ lệ thất nghiệp / lạm phát</td></tr>
<tr><td>5</td><td>货币政策</td><td>huòbì zhèngcè</td><td>chính sách tiền tệ</td></tr>
<tr><td>6</td><td>财政政策</td><td>cáizhèng zhèngcè</td><td>chính sách tài khoá</td></tr>
<tr><td>7</td><td>汇率 / 国际收支</td><td>huìlǜ / guójì shōuzhī</td><td>tỷ giá / cán cân thanh toán</td></tr>
<tr><td>8</td><td>经济周期</td><td>jīngjì zhōuqī</td><td>chu kỳ kinh tế</td></tr>
</table>
<div class="callout"><span class="badge">Ghép lại thành một bức tranh</span> Một "câu chuyện" vĩ mô đầy đủ về bất kỳ quốc gia nào nối liền cả tám chương: đo trạng thái bằng GDP/thất nghiệp/lạm phát (Ch.2/4), giải thích bằng AD-AS (Ch.3), và chẩn đoán đòn bẩy nào (货币政策 Ch.5, 财政政策 Ch.6) hay yếu tố bên ngoài (汇率 Ch.7) đang chi phối pha hiện tại của 经济周期 (Ch.8).</div>`,
  ]]);

const c8q = quiz('cem501-quiz-8', 'Quiz 8 — Business cycles & review|||Quiz 8 — Chu kỳ kinh tế & ôn tập', [
  { id: 'q1', question: 'Thứ tự đúng của bốn pha trong 经济周期 (chu kỳ kinh tế) là?', options: ['繁荣 → 复苏 → 衰退 → 萧条', '衰退 → 萧条 → 复苏 → 繁荣', '萧条 → 繁荣 → 衰退 → 复苏', '复苏 → 萧条 → 繁荣 → 衰退'], correctIndex: 1, explanation: 'Chu kỳ chuẩn: 衰退 (suy thoái) → 萧条 (khủng hoảng, nếu suy thoái sâu) → 复苏 (phục hồi) → 繁荣 (hưng thịnh) → rồi lặp lại.' },
  { id: 'q2', question: 'Theo mô hình 索洛增长模型 (Solow), yếu tố nào quan trọng NHẤT cho tăng trưởng bền vững trong DÀI hạn?', options: ['Chỉ cần tích luỹ thêm vốn (máy móc, nhà xưởng)', 'Tiến bộ công nghệ (技术进步) và năng suất, vì tích luỹ vốn đơn thuần gặp lợi suất giảm dần', 'Chỉ cần tăng dân số/lực lượng lao động', 'Chính sách tiền tệ mở rộng liên tục'], correctIndex: 1, explanation: 'Mô hình Solow chỉ ra tích luỹ vốn đơn thuần gặp quy luật lợi suất giảm dần; tăng trưởng bền vững mức sống dài hạn đến từ tiến bộ công nghệ (技术进步) và năng suất.' },
  { id: 'q3', question: 'Trong chuỗi phân tích vĩ mô "đo → giải thích → chẩn đoán" của môn này, công cụ nào dùng để GIẢI THÍCH vì sao mức giá và sản lượng thay đổi?', options: ['GDP (国内生产总值) — chỉ đo lường, không giải thích', 'Mô hình 总需求-总供给 (AD-AS, Chương 3)', '汇率 (tỷ giá) — chỉ áp dụng cho kinh tế mở', '经济周期 — chỉ là tên gọi các pha, không giải thích cơ chế'], correctIndex: 1, explanation: 'GDP/thất nghiệp/lạm phát (Ch.2/4) ĐO trạng thái; mô hình AD-AS (Ch.3) GIẢI THÍCH cơ chế; chính sách tiền tệ/tài khoá/tỷ giá (Ch.5/6/7) là đòn bẩy để CHẨN ĐOÁN và tác động vào pha hiện tại của chu kỳ (Ch.8).' },
]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'CEM501',
    slug: 'cem501-macroeconomics-taught-in-chinese',
    title: 'Macroeconomics (taught in Chinese)',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CEM501.webp',
    shortDescription: 'Macroeconomics with Chinese terminology (汉字+pinyin): GDP, AD-AS, unemployment &amp; inflation, monetary &amp; fiscal policy, exchange rates, business cycles. Vietnamese explanations, vocabulary tables &amp; quizzes.|||Kinh tế vĩ mô kèm thuật ngữ tiếng Trung (汉字+pinyin): GDP, AD-AS, thất nghiệp &amp; lạm phát, chính sách tiền tệ &amp; tài khoá, tỷ giá, chu kỳ kinh tế. Giảng tiếng Việt, bảng từ vựng tiếng Trung &amp; quiz.',
    description: 'Môn <strong>CEM501 — Macroeconomics (taught in Chinese) / Kinh tế Vĩ mô giảng bằng tiếng Trung</strong> (ngành Ngôn ngữ Trung, kỳ 7) dạy <strong>kinh tế học vĩ mô</strong> bằng tiếng Việt, nhấn <strong>thuật ngữ chuyên ngành tiếng Trung</strong> (汉字 + pinyin) để sinh viên đọc hiểu tài liệu &amp; giáo trình tiếng Trung. Từ <strong>nhập môn &amp; các biến số</strong> (宏观经济学) → <strong>GDP &amp; đo lường sản lượng</strong> (国内生产总值) → <strong>tổng cầu-tổng cung</strong> (总需求-总供给) → <strong>thất nghiệp &amp; lạm phát</strong> (失业, 通货膨胀) → <strong>chính sách tiền tệ</strong> (货币政策) → <strong>chính sách tài khoá</strong> (财政政策) → <strong>kinh tế mở, tỷ giá &amp; cán cân thanh toán</strong> (汇率, 国际收支) → <strong>chu kỳ kinh tế, tăng trưởng dài hạn &amp; ôn tập thuật ngữ</strong> (经济周期). Bám giáo trình 宏观经济学 (高鸿业) và Mankiw, mỗi chương có bảng thuật ngữ 汉字/pīnyīn/nghĩa, công thức, ví dụ tính toán và quiz.',
    whatYouLearn: 'Phân biệt kinh tế vĩ mô/vi mô, bốn mục tiêu chính sách vĩ mô; tính GDP theo phương pháp chi tiêu (GDP=C+I+G+NX), GDP danh nghĩa/thực tế, chỉ số giảm phát GDP; mô hình tổng cầu-tổng cung (AD-AS), cân bằng ngắn hạn/dài hạn; ba loại thất nghiệp, tỷ lệ thất nghiệp tự nhiên, CPI, tỷ lệ lạm phát, đường cong Phillips; ba công cụ chính sách tiền tệ, số nhân tiền, phương trình số lượng MV=PY; cân đối ngân sách, chính sách tài khoá mở rộng/thắt chặt, bộ ổn định tự động; cán cân thanh toán, tỷ giá cố định/thả nổi, quan hệ tỷ giá-cán cân thương mại; bốn pha chu kỳ kinh tế và mô hình tăng trưởng Solow; hơn 60 thuật ngữ kinh tế tiếng Trung (汉字+pīnyīn) qua 8 chương.',
    requirements: 'Đã có nền tiếng Trung tương đương các môn CHI trước đó trong khung ngành Ngôn ngữ Trung (đọc hiểu chữ Hán cơ bản, pinyin). Không cần nền kinh tế trước đó — mọi khái niệm vĩ mô được giải thích từ đầu bằng tiếng Việt. Nên cài Pleco hoặc dùng hanzii.net để tra thêm chữ Hán.',
  },
  sections: [
    { title: 'Chương 1 — Nhập môn & biến số cơ bản|||Chapter 1 — Introduction & key variables', description: '宏观经济学, bốn mục tiêu vĩ mô, 财政政策/货币政策.', lessons: [c1, c1q] },
    { title: 'Chương 2 — GDP & đo lường sản lượng|||Chapter 2 — GDP & measuring output', description: '国内生产总值, 名义/实际GDP, GDP平减指数.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Tổng cầu & tổng cung|||Chapter 3 — Aggregate demand & supply', description: '总需求-总供给, 均衡产出, cú sốc cầu/cung.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Thất nghiệp & lạm phát|||Chapter 4 — Unemployment & inflation', description: '失业率, CPI, 通货膨胀, 菲利普斯曲线.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Tiền tệ & chính sách tiền tệ|||Chapter 5 — Money & monetary policy', description: '中央银行, 货币政策 ba công cụ, số nhân tiền.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Chính sách tài khoá & ngân sách|||Chapter 6 — Fiscal policy & budget', description: '财政政策, 财政赤字, 公共债务.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Kinh tế mở, tỷ giá & cán cân thanh toán|||Chapter 7 — Open economy & exchange rates', description: '汇率, 国际收支, 贸易顺差/逆差.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Chu kỳ kinh tế & ôn tập thuật ngữ|||Chapter 8 — Business cycles & terminology review', description: '经济周期, 索洛增长模型, ôn tập toàn môn.', lessons: [c8, c8q] },
  ],
};
