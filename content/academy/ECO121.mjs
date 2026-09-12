/**
 * ECO121 — Macroeconomics (Kinh tế vĩ mô). Khối Quản trị Kinh doanh, kỳ 2.
 * Bám cấu trúc giáo trình kinh tế vĩ mô nhập môn chuẩn (vd Mankiw — Principles of
 * Macroeconomics): đo lường GDP/CPI, tăng trưởng, tiết kiệm–đầu tư, thất nghiệp, tiền tệ &
 * lạm phát, kinh tế mở, AD–AS, chính sách tài khoá/tiền tệ, đường Phillips.
 * Song ngữ + ví dụ số (đã kiểm; số liệu minh hoạ là GIẢ ĐỊNH) + bài tập + quiz.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('eco121-0-1-overview', 'Course overview: the economy as a whole|||Tổng quan: nền kinh tế như một tổng thể',
  'Kinh tế vĩ mô nghiên cứu gì, các biến số then chốt (sản lượng, lạm phát, thất nghiệp, lãi suất, tỷ giá), ba ý tưởng lớn, dài hạn và ngắn hạn, lộ trình môn.',
  [[
    `<span class="eyebrow">ECO121 · Lesson 0.1 · Overview</span>
<h2>Macroeconomics</h2>
<p class="lead"><strong>Macroeconomics</strong> studies the economy as a whole: why some countries grow rich while others stay poor, why prices rise, why people lose jobs in recessions, and what governments and central banks can do about it. Where microeconomics looks at one market, macroeconomics adds them all up.</p>
<h3>The key variables</h3>
<table>
<tr><th>Variable</th><th>Question it answers</th></tr>
<tr><td>Real GDP and its growth</td><td>How much does the economy produce, and how fast is that rising?</td></tr>
<tr><td>Inflation</td><td>How fast is the overall price level rising?</td></tr>
<tr><td>Unemployment</td><td>What share of people who want work cannot find it?</td></tr>
<tr><td>Interest rates</td><td>What is the price of borrowing — and of waiting?</td></tr>
<tr><td>Exchange rate and trade balance</td><td>How do we trade and invest with the rest of the world?</td></tr>
</table>
<h3>Three big ideas</h3>
<ul>
<li><strong>A country's standard of living depends on its ability to produce goods and services</strong> — that is, on productivity.</li>
<li><strong>Prices rise when the government creates too much money.</strong> Sustained high inflation is, in the long run, a monetary phenomenon.</li>
<li><strong>In the short run, society faces a trade-off between inflation and unemployment</strong> — policies that stimulate spending can lower unemployment for a while at the cost of higher inflation.</li>
</ul>
<h3>Long run and short run</h3>
<p>In the <strong>long run</strong>, output is determined by real factors — labour, capital, natural resources and technology — and money only affects prices. In the <strong>short run</strong>, many prices and wages are sticky, so shifts in total spending can push output and employment away from their normal levels. The course follows this order: first the long run, then short-run fluctuations and stabilization policy.</p>
<h3>Roadmap</h3>
<table>
<tr><th>Part</th><th>Topics</th></tr>
<tr><td>1</td><td>Measuring the economy: GDP, the consumer price index, inflation</td></tr>
<tr><td>2</td><td>The long run: growth, saving and investment, unemployment</td></tr>
<tr><td>3</td><td>Money, banks, the central bank and inflation</td></tr>
<tr><td>4</td><td>The open economy; aggregate demand and supply; fiscal and monetary policy</td></tr>
</table>
<div class="callout"><span class="badge">Read the news</span> Every month statistics offices publish GDP, inflation and unemployment figures, and the central bank (in Vietnam, the State Bank of Vietnam) announces its policy decisions. After this course you should be able to read those reports critically.</div>`,
    `<span class="eyebrow">ECO121 · Bài 0.1 · Tổng quan</span>
<h2>Kinh tế vĩ mô</h2>
<p class="lead"><strong>Kinh tế vĩ mô</strong> nghiên cứu nền kinh tế như một tổng thể: vì sao có nước giàu lên còn nước khác vẫn nghèo, vì sao giá cả tăng, vì sao người lao động mất việc khi suy thoái, và chính phủ cùng ngân hàng trung ương có thể làm gì. Nếu kinh tế vi mô nhìn vào một thị trường, thì kinh tế vĩ mô cộng tất cả lại.</p>
<h3>Các biến số then chốt</h3>
<table>
<tr><th>Biến số</th><th>Câu hỏi nó trả lời</th></tr>
<tr><td>GDP thực và tốc độ tăng</td><td>Nền kinh tế sản xuất được bao nhiêu, và mức đó tăng nhanh tới đâu?</td></tr>
<tr><td>Lạm phát</td><td>Mức giá chung tăng nhanh tới đâu?</td></tr>
<tr><td>Thất nghiệp</td><td>Bao nhiêu phần trăm người muốn làm việc mà không tìm được việc?</td></tr>
<tr><td>Lãi suất</td><td>Giá của việc đi vay — và của việc chờ đợi — là bao nhiêu?</td></tr>
<tr><td>Tỷ giá và cán cân thương mại</td><td>Ta trao đổi và đầu tư với phần còn lại của thế giới thế nào?</td></tr>
</table>
<h3>Ba ý tưởng lớn</h3>
<ul>
<li><strong>Mức sống của một quốc gia phụ thuộc vào khả năng sản xuất hàng hoá và dịch vụ</strong> — tức là vào năng suất.</li>
<li><strong>Giá cả tăng khi chính phủ tạo ra quá nhiều tiền.</strong> Lạm phát cao kéo dài, về dài hạn, là hiện tượng tiền tệ.</li>
<li><strong>Trong ngắn hạn, xã hội đối mặt với sự đánh đổi giữa lạm phát và thất nghiệp</strong> — chính sách kích thích chi tiêu có thể giảm thất nghiệp một thời gian với cái giá là lạm phát cao hơn.</li>
</ul>
<h3>Dài hạn và ngắn hạn</h3>
<p>Trong <strong>dài hạn</strong>, sản lượng do các yếu tố thực quyết định — lao động, vốn, tài nguyên và công nghệ — còn tiền chỉ tác động tới giá. Trong <strong>ngắn hạn</strong>, nhiều giá cả và tiền lương cứng nhắc, nên thay đổi của tổng chi tiêu có thể đẩy sản lượng và việc làm lệch khỏi mức bình thường. Môn học đi theo thứ tự này: dài hạn trước, rồi biến động ngắn hạn và chính sách ổn định hoá.</p>
<h3>Lộ trình</h3>
<table>
<tr><th>Phần</th><th>Nội dung</th></tr>
<tr><td>1</td><td>Đo lường nền kinh tế: GDP, chỉ số giá tiêu dùng, lạm phát</td></tr>
<tr><td>2</td><td>Dài hạn: tăng trưởng, tiết kiệm và đầu tư, thất nghiệp</td></tr>
<tr><td>3</td><td>Tiền, ngân hàng, ngân hàng trung ương và lạm phát</td></tr>
<tr><td>4</td><td>Kinh tế mở; tổng cầu và tổng cung; chính sách tài khoá và tiền tệ</td></tr>
</table>
<div class="callout"><span class="badge">Đọc tin tức</span> Hằng tháng, cơ quan thống kê công bố số liệu GDP, lạm phát và thất nghiệp, còn ngân hàng trung ương (ở Việt Nam là Ngân hàng Nhà nước Việt Nam) công bố các quyết định chính sách. Học xong môn này bạn sẽ đọc được các báo cáo đó một cách có phê phán.</div>`,
  ]]);

const c1 = doc('eco121-1-1-gdp', '1.1 — Measuring national income: GDP|||1.1 — Đo lường thu nhập quốc dân: GDP',
  'Định nghĩa GDP, hàng hoá cuối cùng và giá trị gia tăng, bốn thành phần C + I + G + NX, những gì không tính vào GDP, GDP và GNI, GDP danh nghĩa, GDP thực, chỉ số giảm phát và giới hạn của GDP khi đo phúc lợi.',
  [[
    `<span class="eyebrow">ECO121 · Chapter 10 · Lesson 1.1</span>
<h2>Measuring national income: GDP</h2>
<p class="lead"><strong>Gross domestic product (GDP)</strong> is the market value of all <strong>final</strong> goods and services produced <strong>within a country</strong> in a given period. Because every transaction has a buyer and a seller, total spending on output = total income earned from producing it.</p>
<h3>Final goods and value added</h3>
<p>Only final goods count; intermediate goods are already included in their price. Counting every stage would double count:</p>
<pre><code>Farmer sells wheat to a miller          100   value added 100
Miller sells flour to a baker           150   value added  50
Baker sells bread to consumers          250   value added 100
GDP contribution = final bread 250 = total value added 100 + 50 + 100</code></pre>
<h3>The four components of spending</h3>
<table>
<tr><th>Component</th><th>Includes</th></tr>
<tr><td>C — Consumption</td><td>Household spending on goods and services (except new housing)</td></tr>
<tr><td>I — Investment</td><td>Business equipment and structures, <em>new</em> housing, changes in inventories</td></tr>
<tr><td>G — Government purchases</td><td>Goods and services bought by government (not transfer payments such as pensions)</td></tr>
<tr><td>NX — Net exports</td><td>Exports − imports</td></tr>
</table>
<pre><code>Y = C + I + G + NX
Example: C = 600, I = 200, G = 150, exports 250, imports 200
Y = 600 + 200 + 150 + (250 − 200) = 1,000</code></pre>
<p><strong>Not counted:</strong> used goods (produced in an earlier period), purchases of shares and bonds (a change of ownership, not production), transfer payments, unpaid housework and most of the underground economy. <strong>GDP vs GNI:</strong> GDP counts production inside the borders whoever owns the factors; gross national income (GNI) counts income earned by a country's residents wherever they work.</p>
<h3>Nominal vs real GDP</h3>
<p><strong>Nominal GDP</strong> values output at current prices; <strong>real GDP</strong> values it at the prices of a fixed base year, so it changes only when <em>quantities</em> change. Economic growth is measured by the percentage change in real GDP. The <strong>GDP deflator</strong> = nominal GDP ÷ real GDP × 100 measures the price level of everything produced.</p>
<h3>Is GDP a good measure of well-being?</h3>
<p>GDP per person is strongly linked to life expectancy, education and health, but it leaves out leisure, the environment, unpaid work and how income is distributed. It is the best single number we have — not a complete measure of welfare.</p>
<div class="callout"><span class="badge">Check yourself</span> A Vietnamese company's factory in Thailand adds to Thailand's GDP, not Vietnam's — but its profits count in Vietnam's GNI.</div>`,
    `<span class="eyebrow">ECO121 · Chương 10 · Bài 1.1</span>
<h2>Đo lường thu nhập quốc dân: GDP</h2>
<p class="lead"><strong>Tổng sản phẩm trong nước (GDP)</strong> là giá trị thị trường của mọi hàng hoá và dịch vụ <strong>cuối cùng</strong> được sản xuất <strong>trong phạm vi một quốc gia</strong> trong một thời kỳ. Vì mỗi giao dịch đều có người mua và người bán, tổng chi tiêu cho sản lượng = tổng thu nhập tạo ra từ việc sản xuất nó.</p>
<h3>Hàng hoá cuối cùng và giá trị gia tăng</h3>
<p>Chỉ tính hàng hoá cuối cùng; hàng hoá trung gian đã nằm sẵn trong giá của nó. Tính mọi công đoạn sẽ bị tính trùng:</p>
<pre><code>Nông dân bán lúa mì cho nhà máy xay        100   giá trị gia tăng 100
Nhà máy bán bột cho tiệm bánh              150   giá trị gia tăng  50
Tiệm bánh bán bánh mì cho người tiêu dùng  250   giá trị gia tăng 100
Đóng góp vào GDP = bánh mì cuối cùng 250 = tổng giá trị gia tăng 100 + 50 + 100</code></pre>
<h3>Bốn thành phần của chi tiêu</h3>
<table>
<tr><th>Thành phần</th><th>Bao gồm</th></tr>
<tr><td>C — Tiêu dùng</td><td>Chi tiêu của hộ gia đình cho hàng hoá, dịch vụ (trừ nhà ở mới)</td></tr>
<tr><td>I — Đầu tư</td><td>Máy móc, nhà xưởng của doanh nghiệp, nhà ở <em>mới</em>, thay đổi hàng tồn kho</td></tr>
<tr><td>G — Mua sắm của chính phủ</td><td>Hàng hoá, dịch vụ chính phủ mua (không gồm chi chuyển nhượng như lương hưu)</td></tr>
<tr><td>NX — Xuất khẩu ròng</td><td>Xuất khẩu − nhập khẩu</td></tr>
</table>
<pre><code>Y = C + I + G + NX
Ví dụ: C = 600, I = 200, G = 150, xuất khẩu 250, nhập khẩu 200
Y = 600 + 200 + 150 + (250 − 200) = 1.000</code></pre>
<p><strong>Không tính vào GDP:</strong> hàng đã qua sử dụng (được sản xuất ở kỳ trước), mua cổ phiếu, trái phiếu (chỉ đổi chủ sở hữu, không phải sản xuất), chi chuyển nhượng, việc nhà không được trả công và phần lớn kinh tế ngầm. <strong>GDP và GNI:</strong> GDP tính sản xuất bên trong biên giới bất kể ai sở hữu yếu tố sản xuất; tổng thu nhập quốc dân (GNI) tính thu nhập của cư dân một nước dù họ làm việc ở đâu.</p>
<h3>GDP danh nghĩa và GDP thực</h3>
<p><strong>GDP danh nghĩa</strong> tính sản lượng theo giá hiện hành; <strong>GDP thực</strong> tính theo giá của một năm gốc cố định, nên chỉ thay đổi khi <em>lượng</em> thay đổi. Tăng trưởng kinh tế được đo bằng phần trăm thay đổi của GDP thực. <strong>Chỉ số giảm phát GDP</strong> = GDP danh nghĩa ÷ GDP thực × 100 đo mức giá của mọi thứ được sản xuất.</p>
<h3>GDP có đo tốt phúc lợi không?</h3>
<p>GDP bình quân đầu người gắn chặt với tuổi thọ, giáo dục và sức khoẻ, nhưng bỏ qua thời gian nghỉ ngơi, môi trường, lao động không được trả công và cách phân phối thu nhập. Đó là con số đơn lẻ tốt nhất ta có — không phải thước đo đầy đủ của phúc lợi.</p>
<div class="callout"><span class="badge">Tự kiểm tra</span> Nhà máy của một công ty Việt Nam đặt tại Thái Lan làm tăng GDP của Thái Lan chứ không phải của Việt Nam — nhưng lợi nhuận của nó được tính vào GNI của Việt Nam.</div>`,
  ]]);

const c2 = doc('eco121-1-2-cpi-inflation', '1.2 — The cost of living: CPI & inflation|||1.2 — Chi phí sinh hoạt: CPI & lạm phát',
  'Cách lập chỉ số giá tiêu dùng (CPI) từ giỏ hàng cố định, tỷ lệ lạm phát, ba sai lệch của CPI, so sánh CPI với chỉ số giảm phát GDP, điều chỉnh số liệu theo lạm phát, lãi suất danh nghĩa và lãi suất thực.',
  [[
    `<span class="eyebrow">ECO121 · Chapter 11 · Lesson 1.2</span>
<h2>The cost of living: CPI &amp; inflation</h2>
<h3>Building the consumer price index</h3>
<ol>
<li><strong>Fix the basket</strong> — survey what a typical household buys.</li>
<li><strong>Find the prices</strong> of every item in each period.</li>
<li><strong>Compute the basket's cost</strong> in each period.</li>
<li><strong>Choose a base year</strong> and compute CPI = cost of basket this year ÷ cost in the base year × 100.</li>
<li><strong>Compute inflation</strong> = (CPI this year − CPI last year) ÷ CPI last year × 100.</li>
</ol>
<pre><code>CPI rises from 200 to 210  ->  inflation = (210 − 200) / 200 = 5%</code></pre>
<h3>Why the CPI overstates the rise in the cost of living</h3>
<ul>
<li><strong>Substitution bias</strong> — when beef becomes dearer people switch to chicken, but a fixed basket assumes they don't.</li>
<li><strong>New goods</strong> — new products widen choice and make each dong worth more, which a fixed basket misses.</li>
<li><strong>Unmeasured quality change</strong> — a phone at the same price with a better camera is effectively cheaper.</li>
</ul>
<h3>CPI vs the GDP deflator</h3>
<table>
<tr><th></th><th>CPI</th><th>GDP deflator</th></tr>
<tr><td>Covers</td><td>Goods and services bought by consumers, including imports</td><td>Everything produced domestically, including investment goods</td></tr>
<tr><td>Basket</td><td>Fixed</td><td>Changes every year with current output</td></tr>
</table>
<h3>Correcting for inflation</h3>
<p>To compare money amounts from different years: value in today's money = old amount × (CPI today ÷ CPI then). Contracts can be <strong>indexed</strong> to the CPI. Interest rates must be corrected too:</p>
<pre><code>Real interest rate ≈ Nominal interest rate − Inflation rate
A deposit pays 7% a year while inflation is 4%  ->  real return ≈ 3%</code></pre>
<div class="callout"><span class="badge">Remember</span> The nominal rate tells you how fast the money in your account grows; the real rate tells you how fast your purchasing power grows.</div>`,
    `<span class="eyebrow">ECO121 · Chương 11 · Bài 1.2</span>
<h2>Chi phí sinh hoạt: CPI &amp; lạm phát</h2>
<h3>Lập chỉ số giá tiêu dùng</h3>
<ol>
<li><strong>Cố định giỏ hàng</strong> — khảo sát xem một hộ gia đình điển hình mua gì.</li>
<li><strong>Thu thập giá</strong> của từng mặt hàng qua các kỳ.</li>
<li><strong>Tính chi phí của giỏ hàng</strong> ở mỗi kỳ.</li>
<li><strong>Chọn năm gốc</strong> và tính CPI = chi phí giỏ hàng năm nay ÷ chi phí năm gốc × 100.</li>
<li><strong>Tính lạm phát</strong> = (CPI năm nay − CPI năm trước) ÷ CPI năm trước × 100.</li>
</ol>
<pre><code>CPI tăng từ 200 lên 210  ->  lạm phát = (210 − 200) / 200 = 5%</code></pre>
<h3>Vì sao CPI phóng đại mức tăng chi phí sinh hoạt</h3>
<ul>
<li><strong>Sai lệch do thay thế</strong> — khi thịt bò đắt lên, người ta chuyển sang thịt gà, nhưng giỏ hàng cố định giả định họ không đổi.</li>
<li><strong>Hàng hoá mới</strong> — sản phẩm mới mở rộng lựa chọn và làm mỗi đồng có giá trị hơn, điều giỏ hàng cố định không thấy.</li>
<li><strong>Thay đổi chất lượng không đo được</strong> — điện thoại cùng giá nhưng camera tốt hơn thực chất là rẻ đi.</li>
</ul>
<h3>CPI và chỉ số giảm phát GDP</h3>
<table>
<tr><th></th><th>CPI</th><th>Chỉ số giảm phát GDP</th></tr>
<tr><td>Phạm vi</td><td>Hàng hoá, dịch vụ người tiêu dùng mua, gồm cả hàng nhập khẩu</td><td>Mọi thứ sản xuất trong nước, gồm cả hàng đầu tư</td></tr>
<tr><td>Giỏ hàng</td><td>Cố định</td><td>Thay đổi hằng năm theo sản lượng hiện hành</td></tr>
</table>
<h3>Điều chỉnh theo lạm phát</h3>
<p>Để so sánh số tiền ở các năm khác nhau: giá trị theo tiền hôm nay = số tiền cũ × (CPI hôm nay ÷ CPI khi đó). Hợp đồng có thể được <strong>chỉ số hoá</strong> theo CPI. Lãi suất cũng phải điều chỉnh:</p>
<pre><code>Lãi suất thực ≈ Lãi suất danh nghĩa − Tỷ lệ lạm phát
Tiền gửi lãi 7% một năm trong khi lạm phát 4%  ->  lợi suất thực ≈ 3%</code></pre>
<div class="callout"><span class="badge">Ghi nhớ</span> Lãi suất danh nghĩa cho biết số tiền trong tài khoản tăng nhanh thế nào; lãi suất thực cho biết sức mua của bạn tăng nhanh thế nào.</div>`,
  ]]);

const c1e = doc('eco121-1-3-exercise', 'Exercise 1 — nominal GDP, real GDP, deflator & CPI|||Bài tập 1 — GDP danh nghĩa, GDP thực, chỉ số giảm phát & CPI',
  'Bài tập: nền kinh tế hai hàng hoá qua hai năm — tính GDP danh nghĩa, GDP thực, chỉ số giảm phát, tốc độ tăng trưởng, CPI và lạm phát theo hai thước đo; kèm lời giải.',
  [[
    `<span class="eyebrow">ECO121 · Chapters 10–11 · Exercise</span>
<h2>Exercise 1 — a two-good economy</h2>
<div class="callout"><span class="badge">Problem</span> An economy produces pens and books. 2024 (base year): pens 100 units at price 2, books 50 units at price 10. 2025: pens 120 units at price 3, books 50 units at price 12. Compute (a) nominal GDP in both years; (b) real GDP (2024 prices) and the growth rate; (c) the GDP deflator and the inflation it implies; (d) a CPI using the 2024 basket, and CPI inflation.</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) Nominal 2024 = 2 x 100 + 10 x 50 = 200 + 500 = 700
    Nominal 2025 = 3 x 120 + 12 x 50 = 360 + 600 = 960

(b) Real 2024 = 700
    Real 2025 = 2 x 120 + 10 x 50 = 240 + 500 = 740
    Growth = (740 − 700) / 700 = 5.71%

(c) Deflator 2024 = 700 / 700 x 100 = 100
    Deflator 2025 = 960 / 740 x 100 = 129.73  ->  inflation 29.73%

(d) Basket = 100 pens + 50 books
    Cost 2024 = 700;  cost 2025 = 3 x 100 + 12 x 50 = 900
    CPI 2025 = 900 / 700 x 100 = 128.57  ->  inflation 28.57%</code></pre>
<p><strong>Why:</strong> nominal GDP rose 37% (700 → 960), but real output grew only 5.71%; most of the rise came from higher prices (1.0571 × 1.2973 ≈ 1.371). The deflator and the CPI disagree slightly because the deflator weights prices by the <em>current</em> output (120 pens), while the CPI keeps the base-year basket (100 pens) — a small example of the substitution issue.</p>`,
    `<span class="eyebrow">ECO121 · Chương 10–11 · Bài tập</span>
<h2>Bài tập 1 — nền kinh tế hai hàng hoá</h2>
<div class="callout"><span class="badge">Đề</span> Một nền kinh tế sản xuất bút và sách. Năm 2024 (năm gốc): 100 bút giá 2, 50 sách giá 10. Năm 2025: 120 bút giá 3, 50 sách giá 12. Tính (a) GDP danh nghĩa hai năm; (b) GDP thực (theo giá 2024) và tốc độ tăng trưởng; (c) chỉ số giảm phát GDP và lạm phát tương ứng; (d) CPI dùng giỏ hàng năm 2024 và lạm phát theo CPI.</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) Danh nghĩa 2024 = 2 x 100 + 10 x 50 = 200 + 500 = 700
    Danh nghĩa 2025 = 3 x 120 + 12 x 50 = 360 + 600 = 960

(b) Thực 2024 = 700
    Thực 2025 = 2 x 120 + 10 x 50 = 240 + 500 = 740
    Tăng trưởng = (740 − 700) / 700 = 5,71%

(c) Giảm phát 2024 = 700 / 700 x 100 = 100
    Giảm phát 2025 = 960 / 740 x 100 = 129,73  ->  lạm phát 29,73%

(d) Giỏ hàng = 100 bút + 50 sách
    Chi phí 2024 = 700;  chi phí 2025 = 3 x 100 + 12 x 50 = 900
    CPI 2025 = 900 / 700 x 100 = 128,57  ->  lạm phát 28,57%</code></pre>
<p><strong>Vì sao:</strong> GDP danh nghĩa tăng 37% (700 → 960), nhưng sản lượng thực chỉ tăng 5,71%; phần lớn mức tăng đến từ giá cao hơn (1,0571 × 1,2973 ≈ 1,371). Chỉ số giảm phát và CPI chênh nhau đôi chút vì chỉ số giảm phát lấy quyền số là sản lượng <em>hiện hành</em> (120 bút), còn CPI giữ giỏ hàng năm gốc (100 bút) — một ví dụ nhỏ về sai lệch do thay thế.</p>`,
  ]]);

const c1q = quiz('eco121-quiz-1', 'Quiz 1 — Measuring the economy|||Quiz 1 — Đo lường nền kinh tế', [
  { id: 'q1', question: 'Which of these is counted in this year’s GDP?|||Khoản nào được tính vào GDP năm nay?', options: ['A family buys a used car|||Một gia đình mua ô tô cũ', 'A family buys a newly built house|||Một gia đình mua căn nhà mới xây', 'An investor buys shares of a company|||Nhà đầu tư mua cổ phiếu của một công ty', 'The government pays pensions|||Chính phủ chi trả lương hưu'], correctIndex: 1, explanation: 'New housing is investment (I). Used goods, financial assets and transfer payments are not new production.|||Nhà ở mới là đầu tư (I). Hàng đã qua sử dụng, tài sản tài chính và chi chuyển nhượng không phải sản xuất mới.' },
  { id: 'q2', question: 'Real GDP differs from nominal GDP because real GDP…|||GDP thực khác GDP danh nghĩa vì GDP thực…', options: ['excludes government spending|||không tính chi tiêu chính phủ', 'values output at constant base-year prices|||tính sản lượng theo giá cố định của năm gốc', 'includes only exports|||chỉ tính xuất khẩu', 'is always larger|||luôn lớn hơn'], correctIndex: 1, explanation: 'Holding prices fixed means real GDP changes only when quantities change.|||Giữ giá cố định nên GDP thực chỉ thay đổi khi lượng thay đổi.' },
  { id: 'q3', question: 'The CPI rises from 200 to 210. The inflation rate is…|||CPI tăng từ 200 lên 210. Tỷ lệ lạm phát là…', options: ['10%|||10%', '5%|||5%', '2.1%|||2,1%', '210%|||210%'], correctIndex: 1, explanation: '(210 − 200) / 200 = 0.05 = 5%.|||(210 − 200) / 200 = 0,05 = 5%.' },
]);

const c3 = doc('eco121-2-1-growth-saving-unemployment', '2.1 — Growth, saving & investment, unemployment|||2.1 — Tăng trưởng, tiết kiệm & đầu tư, thất nghiệp',
  'Năng suất và các yếu tố quyết định, quy tắc 70, chính sách tăng trưởng; tiết kiệm quốc dân, thị trường vốn vay, thâm hụt ngân sách và hiệu ứng lấn át; lực lượng lao động, tỷ lệ thất nghiệp, các loại thất nghiệp và tỷ lệ thất nghiệp tự nhiên.',
  [[
    `<span class="eyebrow">ECO121 · Chapters 12–15 · Lesson 2.1</span>
<h2>Growth, saving &amp; investment, unemployment</h2>
<h3>Productivity and growth</h3>
<p>Living standards depend on <strong>productivity</strong> — output per worker. Its determinants are <strong>physical capital</strong> (machines, buildings), <strong>human capital</strong> (education, skills), <strong>natural resources</strong> and <strong>technological knowledge</strong>. Because of diminishing returns to capital, poor countries can grow fast by accumulating capital (the <em>catch-up effect</em>). Policies that raise growth: encouraging saving and investment, attracting foreign investment, education, health, secure property rights and political stability, openness to trade, and research and development.</p>
<pre><code>Rule of 70: doubling time ≈ 70 / annual growth rate
Income growing 7% a year doubles in about 70 / 7 = 10 years;
at 2% it takes about 35 years.</code></pre>
<h3>Saving, investment and the loanable funds market</h3>
<p>The financial system — bond and stock markets, banks and funds — moves savers' money to borrowers who invest. In a closed economy:</p>
<pre><code>Y = C + I + G      ->   S = Y − C − G = I
National saving S = (Y − T − C)  +  (T − G)
                    private saving   public saving (budget balance)</code></pre>
<p>In the <strong>market for loanable funds</strong>, saving supplies funds, investment demands them, and the <strong>real interest rate</strong> balances the two. Tax incentives for saving shift supply right (lower rate, more investment). A larger <strong>budget deficit</strong> reduces national saving, shifts supply left, raises the interest rate and reduces private investment — <strong>crowding out</strong>.</p>
<h3>Unemployment</h3>
<pre><code>Labour force        = employed + unemployed
Unemployment rate   = unemployed / labour force x 100
Participation rate  = labour force / adult population x 100
Adults 80 m, employed 50 m, unemployed 2 m  ->  labour force 52 m
unemployment rate = 2 / 52 = 3.85%;  participation = 52 / 80 = 65%</code></pre>
<table>
<tr><th>Type</th><th>Cause</th></tr>
<tr><td>Frictional</td><td>Time spent searching for the right job</td></tr>
<tr><td>Structural</td><td>Skills do not match jobs, or wages are held above equilibrium (minimum wage, unions, efficiency wages)</td></tr>
<tr><td>Cyclical</td><td>Recessions reduce demand for labour</td></tr>
</table>
<p>The <strong>natural rate of unemployment</strong> is the frictional plus structural rate the economy has even in normal times; cyclical unemployment is the deviation from it.</p>
<div class="callout"><span class="badge">Careful</span> Discouraged workers who stop looking are not counted as unemployed, so the unemployment rate can fall even when the job market is weak.</div>`,
    `<span class="eyebrow">ECO121 · Chương 12–15 · Bài 2.1</span>
<h2>Tăng trưởng, tiết kiệm &amp; đầu tư, thất nghiệp</h2>
<h3>Năng suất và tăng trưởng</h3>
<p>Mức sống phụ thuộc vào <strong>năng suất</strong> — sản lượng trên mỗi lao động. Các yếu tố quyết định là <strong>vốn vật chất</strong> (máy móc, nhà xưởng), <strong>vốn nhân lực</strong> (giáo dục, kỹ năng), <strong>tài nguyên thiên nhiên</strong> và <strong>tri thức công nghệ</strong>. Do vốn có lợi suất giảm dần, nước nghèo có thể tăng trưởng nhanh nhờ tích luỹ vốn (<em>hiệu ứng đuổi kịp</em>). Chính sách thúc đẩy tăng trưởng: khuyến khích tiết kiệm và đầu tư, thu hút đầu tư nước ngoài, giáo dục, y tế, bảo đảm quyền sở hữu và ổn định chính trị, mở cửa thương mại, nghiên cứu và phát triển.</p>
<pre><code>Quy tắc 70: thời gian để tăng gấp đôi ≈ 70 / tốc độ tăng hằng năm
Thu nhập tăng 7% mỗi năm sẽ gấp đôi sau khoảng 70 / 7 = 10 năm;
tăng 2% thì mất khoảng 35 năm.</code></pre>
<h3>Tiết kiệm, đầu tư và thị trường vốn vay</h3>
<p>Hệ thống tài chính — thị trường trái phiếu, cổ phiếu, ngân hàng và các quỹ — chuyển tiền của người tiết kiệm tới người đi vay để đầu tư. Trong nền kinh tế đóng:</p>
<pre><code>Y = C + I + G      ->   S = Y − C − G = I
Tiết kiệm quốc dân S = (Y − T − C)  +  (T − G)
                       tiết kiệm tư nhân  tiết kiệm công (cán cân ngân sách)</code></pre>
<p>Trên <strong>thị trường vốn vay</strong>, tiết kiệm tạo cung vốn, đầu tư tạo cầu vốn, và <strong>lãi suất thực</strong> cân bằng hai bên. Ưu đãi thuế cho tiết kiệm đẩy cung sang phải (lãi suất thấp hơn, đầu tư nhiều hơn). <strong>Thâm hụt ngân sách</strong> lớn hơn làm giảm tiết kiệm quốc dân, đẩy cung sang trái, làm tăng lãi suất và giảm đầu tư tư nhân — hiệu ứng <strong>lấn át (crowding out)</strong>.</p>
<h3>Thất nghiệp</h3>
<pre><code>Lực lượng lao động  = có việc + thất nghiệp
Tỷ lệ thất nghiệp   = thất nghiệp / lực lượng lao động x 100
Tỷ lệ tham gia      = lực lượng lao động / dân số trưởng thành x 100
Người trưởng thành 80 tr, có việc 50 tr, thất nghiệp 2 tr  ->  lực lượng lao động 52 tr
tỷ lệ thất nghiệp = 2 / 52 = 3,85%;  tỷ lệ tham gia = 52 / 80 = 65%</code></pre>
<table>
<tr><th>Loại</th><th>Nguyên nhân</th></tr>
<tr><td>Cọ xát</td><td>Thời gian tìm công việc phù hợp</td></tr>
<tr><td>Cơ cấu</td><td>Kỹ năng không khớp việc làm, hoặc lương bị giữ cao hơn mức cân bằng (lương tối thiểu, công đoàn, lương hiệu quả)</td></tr>
<tr><td>Chu kỳ</td><td>Suy thoái làm giảm cầu lao động</td></tr>
</table>
<p><strong>Tỷ lệ thất nghiệp tự nhiên</strong> là tỷ lệ thất nghiệp cọ xát cộng cơ cấu mà nền kinh tế có ngay cả trong thời bình thường; thất nghiệp chu kỳ là phần lệch khỏi mức đó.</p>
<div class="callout"><span class="badge">Cẩn thận</span> Người lao động nản chí, thôi không tìm việc, không được tính là thất nghiệp — nên tỷ lệ thất nghiệp có thể giảm ngay cả khi thị trường việc làm yếu đi.</div>`,
  ]]);

const c3q = quiz('eco121-quiz-2', 'Quiz 2 — The long run|||Quiz 2 — Dài hạn', [
  { id: 'q1', question: 'Real income per person grows 5% a year. Roughly how long until it doubles?|||Thu nhập thực bình quân tăng 5% mỗi năm. Khoảng bao lâu thì tăng gấp đôi?', options: ['5 years|||5 năm', '14 years|||14 năm', '20 years|||20 năm', '35 years|||35 năm'], correctIndex: 1, explanation: 'Rule of 70: 70 / 5 = 14 years.|||Quy tắc 70: 70 / 5 = 14 năm.' },
  { id: 'q2', question: '57 million people are employed and 3 million are unemployed. The unemployment rate is…|||57 triệu người có việc và 3 triệu người thất nghiệp. Tỷ lệ thất nghiệp là…', options: ['3%|||3%', '5%|||5%', '5.3%|||5,3%', '6%|||6%'], correctIndex: 1, explanation: 'Labour force = 57 + 3 = 60 million; 3 / 60 = 5%.|||Lực lượng lao động = 57 + 3 = 60 triệu; 3 / 60 = 5%.' },
  { id: 'q3', question: 'In the loanable funds model, a larger government budget deficit…|||Trong mô hình thị trường vốn vay, thâm hụt ngân sách lớn hơn…', options: ['lowers the interest rate and raises investment|||làm giảm lãi suất và tăng đầu tư', 'raises the interest rate and crowds out private investment|||làm tăng lãi suất và lấn át đầu tư tư nhân', 'has no effect on saving|||không ảnh hưởng tới tiết kiệm', 'raises national saving|||làm tăng tiết kiệm quốc dân'], correctIndex: 1, explanation: 'Public saving falls, the supply of loanable funds shifts left, and the higher rate reduces investment.|||Tiết kiệm công giảm, cung vốn vay dịch trái, lãi suất cao hơn làm giảm đầu tư.' },
]);

const c4 = doc('eco121-3-1-money-inflation', '3.1 — Money, banks, the central bank & inflation|||3.1 — Tiền, ngân hàng, ngân hàng trung ương & lạm phát',
  'Chức năng của tiền, M1 và M2, ngân hàng dự trữ một phần và số nhân tiền, công cụ của ngân hàng trung ương (NHNN Việt Nam), thuyết số lượng tiền MV = PY, trung lập tiền tệ, hiệu ứng Fisher, các chi phí của lạm phát và siêu lạm phát.',
  [[
    `<span class="eyebrow">ECO121 · Chapters 16–17 · Lesson 3.1</span>
<h2>Money, banks, the central bank &amp; inflation</h2>
<h3>What money is</h3>
<p>Money is the set of assets people regularly use to buy things. It has three functions: <strong>medium of exchange</strong>, <strong>unit of account</strong> and <strong>store of value</strong>. Today's money is <em>fiat</em> money — it has no intrinsic value and is accepted because of government decree and trust. Common measures: <strong>M1</strong> (currency plus demand deposits) and <strong>M2</strong> (M1 plus savings and time deposits and similar close substitutes).</p>
<h3>Banks create money</h3>
<p>Under <strong>fractional-reserve banking</strong> a bank keeps only a fraction R of deposits as reserves and lends out the rest; each loan is re-deposited somewhere, so deposits multiply:</p>
<pre><code>Money multiplier = 1 / R
R = 10%  ->  multiplier = 10
A new cash deposit of 100 can support up to 100 x 10 = 1,000 of deposits
(assuming banks lend everything above required reserves and no cash leaks out)</code></pre>
<h3>The central bank's tools</h3>
<p>The central bank — in Vietnam, the <strong>State Bank of Vietnam</strong> — steers the money supply and interest rates through <strong>open market operations</strong> (buying bonds adds reserves, selling them drains reserves), the <strong>required reserve ratio</strong>, and its <strong>policy interest rates</strong> for lending to banks (such as the refinancing and rediscount rates). Lower policy rates and more reserves are an expansionary policy.</p>
<h3>Money and inflation in the long run</h3>
<pre><code>Quantity equation:   M x V = P x Y
Growth-rate form:    %ΔM + %ΔV ≈ %ΔP + %ΔY
Money grows 10%, velocity is stable, real GDP grows 6%  ->  inflation ≈ 4%</code></pre>
<p>With stable velocity and real output set by real factors, faster money growth means faster inflation: money is <strong>neutral</strong> in the long run (the classical dichotomy). By the <strong>Fisher effect</strong>, nominal interest rate = real interest rate + inflation, so higher inflation brings higher nominal rates.</p>
<h3>Why inflation is costly</h3>
<ul>
<li><strong>Shoe-leather costs</strong> of holding less cash, and <strong>menu costs</strong> of changing prices.</li>
<li><strong>Relative-price variability</strong> that misallocates resources, and <strong>tax distortions</strong> because taxes are levied on nominal gains.</li>
<li><strong>Confusion</strong> about real values, and arbitrary <strong>redistribution</strong>: unexpected inflation helps borrowers and hurts lenders.</li>
</ul>
<p><strong>Hyperinflation</strong> — as in Germany in the 1920s or Zimbabwe in the 2000s — happens when governments print money to pay their bills.</p>
<div class="callout"><span class="badge">Big idea</span> In the long run, the central bank controls the price level, not real output.</div>`,
    `<span class="eyebrow">ECO121 · Chương 16–17 · Bài 3.1</span>
<h2>Tiền, ngân hàng, ngân hàng trung ương &amp; lạm phát</h2>
<h3>Tiền là gì</h3>
<p>Tiền là tập hợp tài sản người ta thường xuyên dùng để mua hàng. Tiền có ba chức năng: <strong>phương tiện trao đổi</strong>, <strong>đơn vị hạch toán</strong> và <strong>phương tiện cất giữ giá trị</strong>. Tiền ngày nay là tiền <em>pháp định</em> — không có giá trị nội tại, được chấp nhận nhờ quy định của nhà nước và lòng tin. Các thước đo phổ biến: <strong>M1</strong> (tiền mặt cộng tiền gửi không kỳ hạn) và <strong>M2</strong> (M1 cộng tiền gửi tiết kiệm, có kỳ hạn và các khoản thay thế gần tương tự).</p>
<h3>Ngân hàng tạo ra tiền</h3>
<p>Theo cơ chế <strong>dự trữ một phần</strong>, ngân hàng chỉ giữ một tỷ lệ R của tiền gửi làm dự trữ và cho vay phần còn lại; mỗi khoản vay lại được gửi vào đâu đó, nên tiền gửi được nhân lên:</p>
<pre><code>Số nhân tiền = 1 / R
R = 10%  ->  số nhân = 10
Một khoản tiền mặt mới gửi vào 100 có thể tạo ra tới 100 x 10 = 1.000 tiền gửi
(giả định ngân hàng cho vay hết phần vượt dự trữ bắt buộc và không có tiền mặt rò rỉ)</code></pre>
<h3>Công cụ của ngân hàng trung ương</h3>
<p>Ngân hàng trung ương — ở Việt Nam là <strong>Ngân hàng Nhà nước Việt Nam</strong> — điều tiết cung tiền và lãi suất qua <strong>nghiệp vụ thị trường mở</strong> (mua giấy tờ có giá bơm thêm dự trữ, bán ra rút bớt dự trữ), <strong>tỷ lệ dự trữ bắt buộc</strong>, và các <strong>lãi suất điều hành</strong> khi cho các ngân hàng vay (như lãi suất tái cấp vốn, tái chiết khấu). Hạ lãi suất điều hành và bơm thêm dự trữ là chính sách mở rộng.</p>
<h3>Tiền và lạm phát trong dài hạn</h3>
<pre><code>Phương trình số lượng:  M x V = P x Y
Dạng tốc độ tăng:       %ΔM + %ΔV ≈ %ΔP + %ΔY
Tiền tăng 10%, tốc độ lưu thông ổn định, GDP thực tăng 6%  ->  lạm phát ≈ 4%</code></pre>
<p>Khi tốc độ lưu thông ổn định và sản lượng thực do các yếu tố thực quyết định, tiền tăng nhanh hơn nghĩa là lạm phát cao hơn: tiền <strong>trung lập</strong> trong dài hạn (lưỡng phân cổ điển). Theo <strong>hiệu ứng Fisher</strong>, lãi suất danh nghĩa = lãi suất thực + lạm phát, nên lạm phát cao hơn kéo lãi suất danh nghĩa lên.</p>
<h3>Vì sao lạm phát gây tốn kém</h3>
<ul>
<li><strong>Chi phí mòn giày</strong> khi giữ ít tiền mặt, và <strong>chi phí thực đơn</strong> khi phải đổi giá.</li>
<li><strong>Giá tương đối biến động</strong> làm phân bổ sai nguồn lực, và <strong>méo mó thuế</strong> vì thuế đánh trên lợi nhuận danh nghĩa.</li>
<li><strong>Nhầm lẫn</strong> về giá trị thực, và <strong>phân phối lại</strong> tuỳ tiện: lạm phát ngoài dự kiến có lợi cho người đi vay, thiệt cho người cho vay.</li>
</ul>
<p><strong>Siêu lạm phát</strong> — như ở Đức thập niên 1920 hay Zimbabwe những năm 2000 — xảy ra khi chính phủ in tiền để chi tiêu.</p>
<div class="callout"><span class="badge">Ý lớn</span> Trong dài hạn, ngân hàng trung ương quyết định mức giá, không quyết định sản lượng thực.</div>`,
  ]]);

const c4e = doc('eco121-3-2-exercise', 'Exercise 2 — money multiplier & the quantity equation|||Bài tập 2 — số nhân tiền & phương trình số lượng',
  'Bài tập: tính số nhân tiền và lượng tiền gửi tối đa từ một khoản tiền gửi mới; dùng MV = PY tính mức giá và lạm phát khi cung tiền và sản lượng tăng; áp dụng hiệu ứng Fisher; kèm lời giải.',
  [[
    `<span class="eyebrow">ECO121 · Chapters 16–17 · Exercise</span>
<h2>Exercise 2 — from reserves to prices</h2>
<div class="callout"><span class="badge">Problem</span> (a) The reserve ratio is 20% and a customer deposits 500 of new cash. What is the money multiplier, the maximum total deposits and the maximum new loans? (b) M = 2,000, V = 5 and real output Y = 1,000. Find the price level. Next year M rises to 2,200 and Y to 1,030 with V unchanged. Find the new price level and the inflation rate, and compare with the growth-rate approximation. (c) A loan charges 9% nominal interest and expected inflation is 6%. What real rate does the lender expect?</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) Multiplier = 1 / 0.20 = 5
    Maximum deposits = 500 x 5 = 2,500
    Maximum new loans = 2,500 − 500 = 2,000

(b) P = M x V / Y = 2,000 x 5 / 1,000 = 10
    New P = 2,200 x 5 / 1,030 = 11,000 / 1,030 = 10.68
    Inflation = (10.68 − 10) / 10 = 6.8%
    Approximation: %ΔM − %ΔY = 10% − 3% = 7%   (close to 6.8%)

(c) Real rate ≈ 9% − 6% = 3%</code></pre>
<p><strong>Why:</strong> the multiplier is a maximum — if people hold more cash or banks keep excess reserves, the money supply grows less. In (b) prices rise because money grows faster than the goods it chases; the growth-rate form is an approximation that works well for small percentages.</p>`,
    `<span class="eyebrow">ECO121 · Chương 16–17 · Bài tập</span>
<h2>Bài tập 2 — từ dự trữ tới giá cả</h2>
<div class="callout"><span class="badge">Đề</span> (a) Tỷ lệ dự trữ là 20% và một khách hàng gửi vào 500 tiền mặt mới. Số nhân tiền, tổng tiền gửi tối đa và tổng khoản cho vay mới tối đa là bao nhiêu? (b) M = 2.000, V = 5 và sản lượng thực Y = 1.000. Tìm mức giá. Năm sau M tăng lên 2.200 và Y lên 1.030, V không đổi. Tìm mức giá mới và tỷ lệ lạm phát, so sánh với cách tính xấp xỉ theo tốc độ tăng. (c) Một khoản vay lãi danh nghĩa 9%, lạm phát kỳ vọng 6%. Người cho vay kỳ vọng lãi suất thực bao nhiêu?</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) Số nhân = 1 / 0,20 = 5
    Tiền gửi tối đa = 500 x 5 = 2.500
    Cho vay mới tối đa = 2.500 − 500 = 2.000

(b) P = M x V / Y = 2.000 x 5 / 1.000 = 10
    P mới = 2.200 x 5 / 1.030 = 11.000 / 1.030 = 10,68
    Lạm phát = (10,68 − 10) / 10 = 6,8%
    Xấp xỉ: %ΔM − %ΔY = 10% − 3% = 7%   (gần với 6,8%)

(c) Lãi suất thực ≈ 9% − 6% = 3%</code></pre>
<p><strong>Vì sao:</strong> số nhân là mức tối đa — nếu người dân giữ nhiều tiền mặt hơn hoặc ngân hàng giữ dự trữ dư thừa, cung tiền tăng ít hơn. Ở (b) giá tăng vì tiền tăng nhanh hơn lượng hàng hoá mà nó "đuổi theo"; dạng tốc độ tăng chỉ là xấp xỉ, dùng tốt khi các tỷ lệ phần trăm nhỏ.</p>`,
  ]]);

const c4q = quiz('eco121-quiz-3', 'Quiz 3 — Money & inflation|||Quiz 3 — Tiền & lạm phát', [
  { id: 'q1', question: 'If the reserve ratio is 5%, the money multiplier is…|||Nếu tỷ lệ dự trữ là 5%, số nhân tiền là…', options: ['5|||5', '20|||20', '0.05|||0,05', '95|||95'], correctIndex: 1, explanation: 'Multiplier = 1 / 0.05 = 20.|||Số nhân = 1 / 0,05 = 20.' },
  { id: 'q2', question: 'Money grows 8% a year, velocity is constant and real GDP grows 3%. Inflation is approximately…|||Tiền tăng 8% mỗi năm, tốc độ lưu thông không đổi và GDP thực tăng 3%. Lạm phát xấp xỉ…', options: ['11%|||11%', '8%|||8%', '5%|||5%', '3%|||3%'], correctIndex: 2, explanation: '%ΔP ≈ %ΔM + %ΔV − %ΔY = 8 + 0 − 3 = 5%.|||%ΔP ≈ %ΔM + %ΔV − %ΔY = 8 + 0 − 3 = 5%.' },
  { id: 'q3', question: 'Unexpectedly high inflation tends to…|||Lạm phát cao ngoài dự kiến có xu hướng…', options: ['help lenders and hurt borrowers|||có lợi cho người cho vay, thiệt cho người đi vay', 'help borrowers and hurt lenders|||có lợi cho người đi vay, thiệt cho người cho vay', 'leave real debt unchanged|||giữ nguyên giá trị thực của khoản nợ', 'raise real interest rates received by lenders|||làm tăng lãi suất thực người cho vay nhận được'], correctIndex: 1, explanation: 'Borrowers repay with money that buys less than expected, so the real value of the debt falls.|||Người vay trả nợ bằng đồng tiền mua được ít hơn dự kiến, nên giá trị thực của khoản nợ giảm.' },
]);

const c5 = doc('eco121-4-1-open-economy', '4.1 — The open economy: trade, capital flows & exchange rates|||4.1 — Kinh tế mở: thương mại, dòng vốn & tỷ giá',
  'Xuất khẩu ròng và dòng vốn ra ròng, đồng nhất thức NX = NCO và S = I + NCO, tỷ giá danh nghĩa, tăng giá và giảm giá đồng tiền, tỷ giá thực, ngang giá sức mua (PPP) với ví dụ số giả định.',
  [[
    `<span class="eyebrow">ECO121 · Chapter 18 · Lesson 4.1</span>
<h2>The open economy: trade, capital flows &amp; exchange rates</h2>
<h3>Goods flows and capital flows</h3>
<ul>
<li><strong>Net exports</strong> NX = exports − imports: a trade surplus if positive, a deficit if negative.</li>
<li><strong>Net capital outflow</strong> NCO = domestic residents' purchases of foreign assets − foreigners' purchases of domestic assets (foreign direct investment and portfolio investment).</li>
</ul>
<pre><code>NX = NCO            (a country with a trade surplus lends to / invests in the rest of the world)
S = I + NCO         (national saving finances domestic investment and net foreign investment)</code></pre>
<h3>Exchange rates</h3>
<p>The <strong>nominal exchange rate</strong> is the rate at which currencies trade — quoted in Vietnam as VND per USD. If it goes from 25,000 to 26,000 VND per USD, the dollar has <strong>appreciated</strong> and the dong has <strong>depreciated</strong>: Vietnamese goods become cheaper for foreigners and imports dearer for Vietnamese. What matters for trade is the <strong>real exchange rate</strong>, the price of foreign goods relative to domestic goods:</p>
<pre><code>Real exchange rate  ε = E x P* / P
E  = nominal rate (VND per USD);  P* = foreign price level (USD);  P = domestic price level (VND)
ε rises -> foreign goods relatively dearer -> exports rise, imports fall -> NX rises</code></pre>
<h3>Purchasing-power parity</h3>
<p>By the law of one price, a unit of currency should buy the same goods everywhere, so in the long run E ≈ P / P*. Illustrative (assumed) numbers: a basket costs 100 USD in the US and 2,000,000 VND in Vietnam, so the PPP rate is 2,000,000 / 100 = 20,000 VND per USD. If the market rate were 25,000, then ε = 25,000 × 100 / 2,000,000 = 1.25: the basket is 25% dearer in the US, and by this measure the dong is undervalued against PPP. PPP holds only roughly: many goods (haircuts, housing) are not traded, and traded goods are not perfect substitutes.</p>
<div class="callout"><span class="badge">Watch the direction</span> Whether an exchange rate "rises" depends on how it is quoted. Always ask: how many units of which currency buy one unit of the other?</div>`,
    `<span class="eyebrow">ECO121 · Chương 18 · Bài 4.1</span>
<h2>Kinh tế mở: thương mại, dòng vốn &amp; tỷ giá</h2>
<h3>Dòng hàng hoá và dòng vốn</h3>
<ul>
<li><strong>Xuất khẩu ròng</strong> NX = xuất khẩu − nhập khẩu: thặng dư thương mại nếu dương, thâm hụt nếu âm.</li>
<li><strong>Dòng vốn ra ròng</strong> NCO = cư dân trong nước mua tài sản nước ngoài − người nước ngoài mua tài sản trong nước (đầu tư trực tiếp và đầu tư gián tiếp).</li>
</ul>
<pre><code>NX = NCO            (nước có thặng dư thương mại cho vay / đầu tư ra phần còn lại của thế giới)
S = I + NCO         (tiết kiệm quốc dân tài trợ cho đầu tư trong nước và đầu tư ròng ra nước ngoài)</code></pre>
<h3>Tỷ giá hối đoái</h3>
<p><strong>Tỷ giá danh nghĩa</strong> là tỷ lệ trao đổi giữa hai đồng tiền — ở Việt Nam thường yết theo số đồng trên một USD. Nếu tỷ giá đi từ 25.000 lên 26.000 đồng/USD, USD đã <strong>lên giá</strong> và đồng Việt Nam <strong>mất giá</strong>: hàng Việt Nam rẻ hơn với người nước ngoài và hàng nhập khẩu đắt hơn với người Việt. Điều quan trọng với thương mại là <strong>tỷ giá thực</strong>, tức giá hàng nước ngoài so với hàng trong nước:</p>
<pre><code>Tỷ giá thực  ε = E x P* / P
E  = tỷ giá danh nghĩa (đồng/USD);  P* = mức giá nước ngoài (USD);  P = mức giá trong nước (đồng)
ε tăng -> hàng nước ngoài tương đối đắt hơn -> xuất khẩu tăng, nhập khẩu giảm -> NX tăng</code></pre>
<h3>Ngang giá sức mua</h3>
<p>Theo quy luật một giá, một đơn vị tiền phải mua được lượng hàng như nhau ở mọi nơi, nên trong dài hạn E ≈ P / P*. Số liệu minh hoạ (giả định): một giỏ hàng giá 100 USD ở Mỹ và 2.000.000 đồng ở Việt Nam, vậy tỷ giá PPP là 2.000.000 / 100 = 20.000 đồng/USD. Nếu tỷ giá thị trường là 25.000 thì ε = 25.000 × 100 / 2.000.000 = 1,25: giỏ hàng ở Mỹ đắt hơn 25%, và theo thước đo này đồng Việt Nam đang bị định giá thấp so với PPP. PPP chỉ đúng một cách gần đúng: nhiều hàng hoá (cắt tóc, nhà ở) không trao đổi quốc tế, và hàng trao đổi được cũng không thay thế hoàn hảo cho nhau.</p>
<div class="callout"><span class="badge">Chú ý chiều</span> Tỷ giá "tăng" hay "giảm" phụ thuộc cách yết giá. Luôn hỏi: bao nhiêu đơn vị tiền nào đổi được một đơn vị tiền kia?</div>`,
  ]]);

const c6 = doc('eco121-4-2-ad-as', '4.2 — Aggregate demand & aggregate supply|||4.2 — Tổng cầu & tổng cung',
  'Đặc điểm của biến động kinh tế, vì sao đường tổng cầu dốc xuống (ba hiệu ứng), các yếu tố làm dịch chuyển AD, đường tổng cung dài hạn thẳng đứng và ngắn hạn dốc lên, hai nguyên nhân gây suy thoái và lạm phát đình trệ.',
  [[
    `<span class="eyebrow">ECO121 · Chapter 20 · Lesson 4.2</span>
<h2>Aggregate demand &amp; aggregate supply</h2>
<p>Output fluctuates irregularly around its long-run trend; when real GDP falls, unemployment rises. In the short run prices and wages are sticky, so the classical dichotomy breaks down — changes in spending affect real output. The <strong>AD–AS model</strong> explains how.</p>
<h3>Aggregate demand (AD)</h3>
<p>The AD curve shows the quantity of goods and services demanded at each price level. It slopes downward because a lower price level:</p>
<ul>
<li>raises the real value of money holdings, so households consume more (<strong>wealth effect</strong>);</li>
<li>reduces money demand and interest rates, so firms invest more (<strong>interest-rate effect</strong>);</li>
<li>makes the domestic currency depreciate as interest rates fall, so net exports rise (<strong>exchange-rate effect</strong>).</li>
</ul>
<p>AD <strong>shifts</strong> with anything that changes C, I, G or NX at a given price level: consumer confidence, taxes, business optimism, government purchases, the money supply, or a recession abroad.</p>
<h3>Aggregate supply (AS)</h3>
<ul>
<li><strong>Long-run AS is vertical</strong> at the natural level of output, set by labour, capital, natural resources and technology. It shifts only when these change.</li>
<li><strong>Short-run AS slopes upward</strong> because of sticky wages, sticky prices and misperceptions. It shifts with the expected price level and with input costs (for example oil prices), as well as with the long-run factors.</li>
</ul>
<h3>Two causes of recession</h3>
<table>
<tr><th>Shock</th><th>Short run</th><th>Long run (no policy)</th></tr>
<tr><td>AD shifts left (pessimism, falling exports)</td><td>Output ↓, price level ↓, unemployment ↑</td><td>Expected prices and wages adjust down; SRAS shifts right; output returns to natural level at a lower price level</td></tr>
<tr><td>SRAS shifts left (oil price shock)</td><td><strong>Stagflation</strong>: output ↓ and price level ↑</td><td>Wages eventually adjust and output recovers — unless policy accommodates the shock by raising AD, which keeps prices higher</td></tr>
</table>
<div class="callout"><span class="badge">Model in one line</span> Short-run equilibrium is where AD meets SRAS; the long-run anchor is where AD meets the vertical LRAS.</div>`,
    `<span class="eyebrow">ECO121 · Chương 20 · Bài 4.2</span>
<h2>Tổng cầu &amp; tổng cung</h2>
<p>Sản lượng dao động thất thường quanh xu hướng dài hạn; khi GDP thực giảm, thất nghiệp tăng. Trong ngắn hạn giá cả và tiền lương cứng nhắc, nên lưỡng phân cổ điển không còn đúng — thay đổi chi tiêu tác động tới sản lượng thực. <strong>Mô hình AD–AS</strong> giải thích cơ chế này.</p>
<h3>Tổng cầu (AD)</h3>
<p>Đường AD cho biết lượng hàng hoá, dịch vụ được yêu cầu ở mỗi mức giá. Đường dốc xuống vì khi mức giá thấp hơn:</p>
<ul>
<li>giá trị thực của lượng tiền nắm giữ tăng, hộ gia đình tiêu dùng nhiều hơn (<strong>hiệu ứng của cải</strong>);</li>
<li>cầu tiền và lãi suất giảm, doanh nghiệp đầu tư nhiều hơn (<strong>hiệu ứng lãi suất</strong>);</li>
<li>lãi suất giảm làm đồng nội tệ mất giá, xuất khẩu ròng tăng (<strong>hiệu ứng tỷ giá</strong>).</li>
</ul>
<p>AD <strong>dịch chuyển</strong> khi có bất cứ điều gì làm thay đổi C, I, G hoặc NX tại một mức giá cho trước: niềm tin người tiêu dùng, thuế, kỳ vọng của doanh nghiệp, mua sắm của chính phủ, cung tiền, hay suy thoái ở nước ngoài.</p>
<h3>Tổng cung (AS)</h3>
<ul>
<li><strong>Tổng cung dài hạn thẳng đứng</strong> tại mức sản lượng tự nhiên, do lao động, vốn, tài nguyên và công nghệ quyết định. Nó chỉ dịch chuyển khi các yếu tố này thay đổi.</li>
<li><strong>Tổng cung ngắn hạn dốc lên</strong> do tiền lương cứng nhắc, giá cả cứng nhắc và nhận thức sai. Nó dịch chuyển theo mức giá kỳ vọng và chi phí đầu vào (vd giá dầu), cũng như theo các yếu tố dài hạn.</li>
</ul>
<h3>Hai nguyên nhân gây suy thoái</h3>
<table>
<tr><th>Cú sốc</th><th>Ngắn hạn</th><th>Dài hạn (không có chính sách)</th></tr>
<tr><td>AD dịch trái (bi quan, xuất khẩu giảm)</td><td>Sản lượng ↓, mức giá ↓, thất nghiệp ↑</td><td>Giá và lương kỳ vọng điều chỉnh giảm; SRAS dịch phải; sản lượng trở về mức tự nhiên với mức giá thấp hơn</td></tr>
<tr><td>SRAS dịch trái (cú sốc giá dầu)</td><td><strong>Lạm phát đình trệ</strong>: sản lượng ↓ và mức giá ↑</td><td>Tiền lương dần điều chỉnh và sản lượng phục hồi — trừ khi chính sách "chiều theo" cú sốc bằng cách tăng AD, khiến giá ở mức cao hơn</td></tr>
</table>
<div class="callout"><span class="badge">Mô hình trong một câu</span> Cân bằng ngắn hạn là nơi AD gặp SRAS; điểm neo dài hạn là nơi AD gặp đường LRAS thẳng đứng.</div>`,
  ]]);

const c7 = doc('eco121-4-3-policy-phillips', '4.3 — Fiscal & monetary policy, the Phillips curve|||4.3 — Chính sách tài khoá, tiền tệ & đường Phillips',
  'Lý thuyết ưa thích thanh khoản và chính sách tiền tệ, chính sách tài khoá với số nhân chi tiêu và số nhân thuế, hiệu ứng lấn át, bộ ổn định tự động, đường Phillips ngắn hạn và dài hạn, kỳ vọng và cú sốc cung.',
  [[
    `<span class="eyebrow">ECO121 · Chapters 21–22 · Lesson 4.3</span>
<h2>Fiscal &amp; monetary policy, the Phillips curve</h2>
<h3>Monetary policy</h3>
<p>In the short run the interest rate adjusts to balance money supply and money demand (<strong>liquidity preference</strong>). When the central bank expands the money supply or cuts its policy rate, interest rates fall, investment and interest-sensitive spending rise, and <strong>AD shifts right</strong>. A contractionary policy does the opposite and is used to fight inflation.</p>
<h3>Fiscal policy and the multiplier</h3>
<p>Raising government purchases or cutting taxes also shifts AD right — by more than the initial change, because each round of spending becomes someone's income and is partly spent again:</p>
<pre><code>Spending multiplier = 1 / (1 − MPC)          MPC = marginal propensity to consume
Tax multiplier      = −MPC / (1 − MPC)
MPC = 0.8  ->  spending multiplier = 5,  tax multiplier = −4
G up by 20   ->  AD shifts right by up to 20 x 5 = 100
Taxes cut 20 ->  AD shifts right by up to 20 x 4 = 80</code></pre>
<p>Two forces shrink the effect: the <strong>crowding-out effect</strong> (higher income raises money demand and interest rates, which reduces investment) and, for tax cuts, whether households see them as temporary. <strong>Automatic stabilizers</strong> — tax revenues that fall and unemployment benefits that rise in a recession — support demand without new decisions. Both policies work with <strong>lags</strong>, which is one reason economists debate active policy versus stable rules.</p>
<h3>The Phillips curve</h3>
<ul>
<li><strong>Short run:</strong> higher inflation goes with lower unemployment, because rising AD raises both output and prices along the SRAS curve.</li>
<li><strong>Long run:</strong> the curve is <strong>vertical at the natural rate of unemployment</strong> (Friedman and Phelps). Once people expect higher inflation, wages adjust and unemployment returns to its natural rate — only inflation remains higher.</li>
<li><strong>Supply shocks</strong> shift the short-run curve outward (worse inflation <em>and</em> unemployment). Reducing inflation usually costs a temporary rise in unemployment (the <em>sacrifice ratio</em>), which is smaller when the central bank's commitment is credible.</li>
</ul>
<div class="callout"><span class="badge">Policy in one line</span> Stabilization policy can smooth the business cycle in the short run, but in the long run output is set by productivity and inflation by money growth.</div>`,
    `<span class="eyebrow">ECO121 · Chương 21–22 · Bài 4.3</span>
<h2>Chính sách tài khoá, tiền tệ &amp; đường Phillips</h2>
<h3>Chính sách tiền tệ</h3>
<p>Trong ngắn hạn, lãi suất điều chỉnh để cân bằng cung tiền và cầu tiền (<strong>lý thuyết ưa thích thanh khoản</strong>). Khi ngân hàng trung ương tăng cung tiền hoặc hạ lãi suất điều hành, lãi suất giảm, đầu tư và các khoản chi nhạy với lãi suất tăng, và <strong>AD dịch sang phải</strong>. Chính sách thắt chặt làm điều ngược lại và được dùng để chống lạm phát.</p>
<h3>Chính sách tài khoá và số nhân</h3>
<p>Tăng mua sắm của chính phủ hoặc giảm thuế cũng đẩy AD sang phải — nhiều hơn mức thay đổi ban đầu, vì mỗi vòng chi tiêu trở thành thu nhập của ai đó và lại được chi tiêu một phần:</p>
<pre><code>Số nhân chi tiêu = 1 / (1 − MPC)          MPC = khuynh hướng tiêu dùng cận biên
Số nhân thuế     = −MPC / (1 − MPC)
MPC = 0,8  ->  số nhân chi tiêu = 5,  số nhân thuế = −4
G tăng 20    ->  AD dịch phải tối đa 20 x 5 = 100
Giảm thuế 20 ->  AD dịch phải tối đa 20 x 4 = 80</code></pre>
<p>Hai lực làm hiệu quả nhỏ đi: <strong>hiệu ứng lấn át</strong> (thu nhập cao hơn làm tăng cầu tiền và lãi suất, khiến đầu tư giảm) và, với giảm thuế, việc hộ gia đình có coi đó là tạm thời hay không. <strong>Bộ ổn định tự động</strong> — thu thuế giảm và trợ cấp thất nghiệp tăng khi suy thoái — hỗ trợ tổng cầu mà không cần quyết định mới. Cả hai chính sách đều tác động với <strong>độ trễ</strong>, một lý do khiến các nhà kinh tế tranh luận giữa chính sách chủ động và các quy tắc ổn định.</p>
<h3>Đường Phillips</h3>
<ul>
<li><strong>Ngắn hạn:</strong> lạm phát cao hơn đi kèm thất nghiệp thấp hơn, vì AD tăng đẩy cả sản lượng và giá lên dọc đường SRAS.</li>
<li><strong>Dài hạn:</strong> đường <strong>thẳng đứng tại tỷ lệ thất nghiệp tự nhiên</strong> (Friedman và Phelps). Khi người ta đã kỳ vọng lạm phát cao hơn, tiền lương điều chỉnh và thất nghiệp trở về mức tự nhiên — chỉ còn lạm phát là cao hơn.</li>
<li><strong>Cú sốc cung</strong> đẩy đường ngắn hạn ra ngoài (lạm phát <em>và</em> thất nghiệp cùng xấu đi). Giảm lạm phát thường phải trả giá bằng thất nghiệp tăng tạm thời (<em>tỷ lệ hy sinh</em>), cái giá này nhỏ hơn khi cam kết của ngân hàng trung ương đáng tin cậy.</li>
</ul>
<div class="callout"><span class="badge">Chính sách trong một câu</span> Chính sách ổn định hoá có thể làm dịu chu kỳ kinh doanh trong ngắn hạn, nhưng về dài hạn sản lượng do năng suất quyết định và lạm phát do tốc độ tăng tiền quyết định.</div>`,
  ]]);

const c7e = doc('eco121-4-4-exercise', 'Exercise 3 — closing an output gap|||Bài tập 3 — đóng khoảng trống sản lượng',
  'Bài tập: với MPC = 0,75 tính số nhân chi tiêu và số nhân thuế, hiệu ứng khi chính phủ tăng chi tiêu, lượng chi tiêu hoặc giảm thuế cần thiết để đóng khoảng trống sản lượng 120, và giải thích vì sao tác động thực tế nhỏ hơn; kèm lời giải.',
  [[
    `<span class="eyebrow">ECO121 · Chapter 21 · Exercise</span>
<h2>Exercise 3 — how big a stimulus?</h2>
<div class="callout"><span class="badge">Problem</span> The marginal propensity to consume is 0.75. (a) Compute the spending and tax multipliers. (b) By how much can AD shift if government purchases rise by 50? (c) Actual output is 120 below its natural level. How large an increase in government purchases would close the gap? (d) How large a tax cut? (e) Why might the real effect be smaller, and what could the central bank do instead?</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) Spending multiplier = 1 / (1 − 0.75) = 4
    Tax multiplier      = −0.75 / 0.25   = −3
(b) ΔY = 50 x 4 = 200
(c) Needed ΔG = 120 / 4 = 30
(d) Needed tax cut = 120 / 3 = 40</code></pre>
<p><strong>(e)</strong> The multiplier assumes interest rates stay put. In practice higher income raises money demand and interest rates, <strong>crowding out</strong> some investment, and part of a tax cut may be saved if households think it is temporary — so policymakers often need a larger stimulus than the simple formula suggests. The alternative is <strong>monetary expansion</strong>: the central bank lowers its policy rates or adds reserves, which reduces interest rates and raises investment, shifting AD right without increasing the budget deficit.</p>
<p><strong>Why the tax multiplier is smaller:</strong> a tax cut first raises disposable income, and households spend only the MPC share of it in the first round, whereas government purchases enter spending in full.</p>`,
    `<span class="eyebrow">ECO121 · Chương 21 · Bài tập</span>
<h2>Bài tập 3 — kích thích bao nhiêu là đủ?</h2>
<div class="callout"><span class="badge">Đề</span> Khuynh hướng tiêu dùng cận biên là 0,75. (a) Tính số nhân chi tiêu và số nhân thuế. (b) Nếu mua sắm của chính phủ tăng 50, AD có thể dịch chuyển bao nhiêu? (c) Sản lượng thực tế thấp hơn mức tự nhiên 120. Cần tăng mua sắm chính phủ bao nhiêu để đóng khoảng trống? (d) Hoặc cần giảm thuế bao nhiêu? (e) Vì sao tác động thực tế có thể nhỏ hơn, và ngân hàng trung ương có thể làm gì thay thế?</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) Số nhân chi tiêu = 1 / (1 − 0,75) = 4
    Số nhân thuế     = −0,75 / 0,25   = −3
(b) ΔY = 50 x 4 = 200
(c) Cần tăng G = 120 / 4 = 30
(d) Cần giảm thuế = 120 / 3 = 40</code></pre>
<p><strong>(e)</strong> Số nhân giả định lãi suất đứng yên. Thực tế thu nhập cao hơn làm tăng cầu tiền và lãi suất, <strong>lấn át</strong> một phần đầu tư, và một phần tiền giảm thuế có thể được tiết kiệm nếu hộ gia đình cho rằng đó chỉ là tạm thời — nên nhà hoạch định thường cần gói kích thích lớn hơn công thức đơn giản. Phương án thay thế là <strong>nới lỏng tiền tệ</strong>: ngân hàng trung ương hạ lãi suất điều hành hoặc bơm thêm dự trữ, làm giảm lãi suất và tăng đầu tư, đẩy AD sang phải mà không làm tăng thâm hụt ngân sách.</p>
<p><strong>Vì sao số nhân thuế nhỏ hơn:</strong> giảm thuế trước hết làm tăng thu nhập khả dụng, và ở vòng đầu hộ gia đình chỉ chi tiêu phần MPC của nó, trong khi mua sắm của chính phủ đi thẳng vào chi tiêu toàn bộ.</p>`,
  ]]);

const c7q = quiz('eco121-quiz-4', 'Quiz 4 — Open economy & short-run policy|||Quiz 4 — Kinh tế mở & chính sách ngắn hạn', [
  { id: 'q1', question: 'The dong depreciates against the US dollar. Other things equal, Vietnam’s net exports…|||Đồng Việt Nam mất giá so với USD. Các yếu tố khác không đổi, xuất khẩu ròng của Việt Nam…', options: ['fall, because exports become dearer abroad|||giảm, vì hàng xuất khẩu đắt hơn ở nước ngoài', 'rise, because Vietnamese goods become cheaper for foreigners|||tăng, vì hàng Việt Nam rẻ hơn với người nước ngoài', 'do not change|||không thay đổi', 'rise only if imports rise too|||chỉ tăng nếu nhập khẩu cũng tăng'], correctIndex: 1, explanation: 'A weaker dong raises the real exchange rate: exports become more competitive and imports dearer.|||Đồng tiền yếu đi làm tăng tỷ giá thực: hàng xuất khẩu cạnh tranh hơn, hàng nhập khẩu đắt hơn.' },
  { id: 'q2', question: 'A sharp rise in world oil prices shifts short-run aggregate supply left. The short-run result is…|||Giá dầu thế giới tăng mạnh làm tổng cung ngắn hạn dịch trái. Kết quả ngắn hạn là…', options: ['higher output and lower prices|||sản lượng tăng, giá giảm', 'lower output and higher prices (stagflation)|||sản lượng giảm, giá tăng (lạm phát đình trệ)', 'higher output and higher prices|||sản lượng tăng, giá tăng', 'no change in output|||sản lượng không đổi'], correctIndex: 1, explanation: 'Moving up along AD, the economy gets less output at a higher price level.|||Di chuyển lên dọc đường AD, nền kinh tế có ít sản lượng hơn ở mức giá cao hơn.' },
  { id: 'q3', question: 'If MPC = 0.9, by how much can AD shift when government purchases rise by 10 (ignoring crowding out)?|||Nếu MPC = 0,9, AD có thể dịch chuyển bao nhiêu khi mua sắm chính phủ tăng 10 (bỏ qua lấn át)?', options: ['9|||9', '10|||10', '90|||90', '100|||100'], correctIndex: 3, explanation: 'Multiplier = 1 / (1 − 0.9) = 10, so 10 x 10 = 100.|||Số nhân = 1 / (1 − 0,9) = 10, nên 10 x 10 = 100.' },
]);

const taiLieu = doc('eco121-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (kèm link), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">ECO121 · 📚 Resource hub</span>
<h2>Course materials &amp; references</h2>
<p class="lead">One hub for learning macroeconomics: the official syllabus and slides, books, free official resources, video channels, tools and a self-study roadmap.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>Sign in to <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) with your FPTU account to read the official ECO121 syllabus and lecture slides.</p>
<h3>📗 Books</h3>
<ul>
<li><a href="https://openstax.org/details/books/principles-macroeconomics-3e" target="_blank" rel="noopener">Principles of Macroeconomics 3e</a> — OpenStax: a free, peer-reviewed open textbook.</li>
<li><a href="https://gregmankiw.blogspot.com/" target="_blank" rel="noopener">Principles of Macroeconomics</a> — N. Gregory Mankiw (Cengage) — the classic introductory text; the link goes to the author’s blog.</li>
</ul>
<h3>🌐 Free official resources</h3>
<ul>
<li><a href="https://data.worldbank.org/" target="_blank" rel="noopener">World Bank Open Data</a> — GDP, inflation, unemployment and trade data for every country.</li>
<li><a href="https://www.sbv.gov.vn/" target="_blank" rel="noopener">State Bank of Vietnam</a> — official policy rates, exchange rates and monetary policy announcements.</li>
<li><a href="https://ourworldindata.org/" target="_blank" rel="noopener">Our World in Data</a> — long-run charts on growth, productivity and living standards.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@MarginalRevolutionUniversity" target="_blank" rel="noopener">Marginal Revolution University</a> — macro lessons on growth, money and business cycles.</li>
<li><a href="https://www.youtube.com/@EconomicsExplained" target="_blank" rel="noopener">Economics Explained</a> — country case studies explained with macro concepts.</li>
<li><a href="https://www.youtube.com/@IMF" target="_blank" rel="noopener">International Monetary Fund</a> — official explainers on inflation, exchange rates and policy.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.google.com/sheets/about/" target="_blank" rel="noopener">Google Sheets</a> — compute real GDP, inflation and multipliers from downloaded data.</li>
<li><a href="https://www.microsoft.com/en-us/microsoft-365/excel" target="_blank" rel="noopener">Microsoft Excel</a> — chart a country’s GDP growth and inflation over twenty years.</li>
</ul>
<h3>🎯 Self-study roadmap</h3>
<ol>
<li><strong>Foundations (exam core)</strong> — GDP, CPI and inflation, following Part 1 here.</li>
<li><strong>Practise</strong> — compute real GDP, inflation, the money multiplier and fiscal multipliers every week.</li>
<li><strong>Follow the data</strong> — read one monthly CPI release and one State Bank of Vietnam policy announcement.</li>
<li><strong>Apply</strong> — write a one-page brief on Vietnam’s current growth or inflation using official data.</li>
</ol>
<div class="callout"><span class="badge">Note</span> An original hub of real links — no copyrighted slides or books are embedded. If a link moves, start from the official homepage.</div>`,
    `<span class="eyebrow">ECO121 · 📚 Trung tâm tài liệu</span>
<h2>Tài liệu tham khảo môn học</h2>
<p class="lead">Một nơi gom để học kinh tế vĩ mô: giáo trình &amp; slide chính thức, sách, tài liệu miễn phí chính thống, kênh video, công cụ, và lộ trình tự học.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Đăng nhập <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) bằng tài khoản FPTU để đọc giáo trình và slide bài giảng chính thức của ECO121.</p>
<h3>📗 Sách</h3>
<ul>
<li><a href="https://openstax.org/details/books/principles-macroeconomics-3e" target="_blank" rel="noopener">Principles of Macroeconomics 3e</a> — OpenStax: giáo trình mở miễn phí, có bình duyệt.</li>
<li><a href="https://gregmankiw.blogspot.com/" target="_blank" rel="noopener">Principles of Macroeconomics</a> — N. Gregory Mankiw (Cengage) — giáo trình nhập môn kinh điển; link dẫn tới blog của tác giả.</li>
</ul>
<h3>🌐 Tài liệu chính thức miễn phí</h3>
<ul>
<li><a href="https://data.worldbank.org/" target="_blank" rel="noopener">World Bank Open Data</a> — số liệu GDP, lạm phát, thất nghiệp và thương mại của mọi quốc gia.</li>
<li><a href="https://www.sbv.gov.vn/" target="_blank" rel="noopener">State Bank of Vietnam</a> — lãi suất điều hành, tỷ giá và thông báo chính sách tiền tệ chính thức.</li>
<li><a href="https://ourworldindata.org/" target="_blank" rel="noopener">Our World in Data</a> — biểu đồ dài hạn về tăng trưởng, năng suất và mức sống.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@MarginalRevolutionUniversity" target="_blank" rel="noopener">Marginal Revolution University</a> — bài giảng vĩ mô về tăng trưởng, tiền tệ và chu kỳ kinh doanh.</li>
<li><a href="https://www.youtube.com/@EconomicsExplained" target="_blank" rel="noopener">Economics Explained</a> — phân tích tình huống các quốc gia bằng khái niệm vĩ mô.</li>
<li><a href="https://www.youtube.com/@IMF" target="_blank" rel="noopener">International Monetary Fund</a> — video giải thích chính thức về lạm phát, tỷ giá và chính sách.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.google.com/sheets/about/" target="_blank" rel="noopener">Google Sheets</a> — tính GDP thực, lạm phát và số nhân từ số liệu tải về.</li>
<li><a href="https://www.microsoft.com/en-us/microsoft-365/excel" target="_blank" rel="noopener">Microsoft Excel</a> — vẽ tăng trưởng GDP và lạm phát của một nước qua hai mươi năm.</li>
</ul>
<h3>🎯 Lộ trình tự học</h3>
<ol>
<li><strong>Nền tảng (lõi thi)</strong> — GDP, CPI và lạm phát, theo đúng Phần 1 ở đây.</li>
<li><strong>Luyện tập</strong> — mỗi tuần tính GDP thực, lạm phát, số nhân tiền và số nhân tài khoá.</li>
<li><strong>Theo dõi số liệu</strong> — đọc một bản công bố CPI hằng tháng và một thông báo chính sách của Ngân hàng Nhà nước.</li>
<li><strong>Vận dụng</strong> — viết một bản tóm tắt một trang về tăng trưởng hoặc lạm phát hiện nay của Việt Nam từ số liệu chính thức.</li>
</ol>
<div class="callout"><span class="badge">Lưu ý</span> Đây là trung tâm liên kết nguyên gốc — không nhúng slide/sách có bản quyền. Link đổi thì vào trang chủ chính thức để tìm.</div>`,
  ]]);

export default {
  semester: { code: 'KY2', name: 'Kỳ 2', ordinal: 2 },
  course: {
    courseCode: 'ECO121',
    slug: 'eco121-macroeconomics',
    title: 'Macroeconomics',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/ECO121.webp',
    shortDescription: 'The economy as a whole: GDP and CPI, growth, saving and investment, unemployment, money and inflation, exchange rates, aggregate demand and supply, fiscal and monetary policy and the Phillips curve. Bilingual, with exercises and quizzes.|||Nền kinh tế như một tổng thể: GDP, CPI, tăng trưởng, tiết kiệm và đầu tư, thất nghiệp, tiền tệ và lạm phát, tỷ giá, tổng cầu tổng cung, chính sách tài khoá và tiền tệ. Song ngữ, có bài tập và quiz.',
    description: 'Môn <strong>ECO121 — Macroeconomics (Kinh tế vĩ mô)</strong> (khối Quản trị Kinh doanh, kỳ 2) nhìn nền kinh tế như một tổng thể. Từ <strong>đo lường</strong> (GDP, CPI, lạm phát) → <strong>dài hạn</strong> (năng suất, tăng trưởng, tiết kiệm – đầu tư, thất nghiệp) → <strong>tiền, ngân hàng, ngân hàng trung ương và lạm phát</strong> → <strong>kinh tế mở</strong> (tỷ giá, ngang giá sức mua) → <strong>tổng cầu – tổng cung</strong>, <strong>chính sách tài khoá, tiền tệ</strong> và đường Phillips. Bám cấu trúc giáo trình kinh tế vĩ mô nhập môn chuẩn, song ngữ Anh–Việt, có ví dụ số đã kiểm (số liệu minh hoạ là giả định), bài tập kèm lời giải và quiz cuối mỗi chương.',
    whatYouLearn: 'Tính GDP theo chi tiêu, phân biệt GDP danh nghĩa, GDP thực và chỉ số giảm phát\nLập CPI, tính lạm phát và lãi suất thực\nGiải thích các yếu tố quyết định năng suất và dùng quy tắc 70\nPhân tích thị trường vốn vay và hiệu ứng lấn át\nTính tỷ lệ thất nghiệp và phân biệt các loại thất nghiệp\nTính số nhân tiền, áp dụng MV = PY và hiệu ứng Fisher\nĐọc tỷ giá danh nghĩa, tỷ giá thực và ngang giá sức mua\nDùng mô hình AD–AS, số nhân tài khoá và đường Phillips để phân tích chính sách',
    requirements: 'Nên học trước ECO111 — Microeconomics (cung cầu, đồ thị)\nĐại số phổ thông và tính phần trăm\nThói quen đọc tin kinh tế sẽ giúp học nhanh hơn',
  },
  sections: [
    { title: '📚 Course materials|||📚 Tài liệu tham khảo', description: 'Giáo trình & slide trên FLM, sách, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Course introduction|||Giới thiệu môn học', description: 'Biến số vĩ mô, ba ý tưởng lớn, dài hạn và ngắn hạn.', lessons: [intro] },
    { title: 'Part 1 — Measuring the economy|||Phần 1 — Đo lường nền kinh tế', description: 'GDP, C + I + G + NX, GDP thực, CPI, lạm phát.', lessons: [c1, c2, c1e, c1q] },
    { title: 'Part 2 — The long run|||Phần 2 — Dài hạn', description: 'Tăng trưởng, tiết kiệm – đầu tư, thất nghiệp.', lessons: [c3, c3q] },
    { title: 'Part 3 — Money & inflation|||Phần 3 — Tiền tệ & lạm phát', description: 'Ngân hàng, số nhân tiền, NHNN, MV = PY.', lessons: [c4, c4e, c4q] },
    { title: 'Part 4 — Open economy & short-run fluctuations|||Phần 4 — Kinh tế mở & biến động ngắn hạn', description: 'Tỷ giá, PPP, AD–AS, tài khoá, tiền tệ, Phillips.', lessons: [c5, c6, c7, c7e, c7q] },
  ],
};
