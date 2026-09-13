/**
 * ECO201 — International Economics (Kinh tế quốc tế). Khối Quản trị Kinh doanh, kỳ 3.
 * Bám cấu trúc giáo trình kinh tế quốc tế chuẩn: Krugman, Obstfeld & Melitz — International
 * Economics: Theory and Policy (Pearson); Salvatore — International Economics (Wiley):
 * toàn cầu hoá & mô hình trọng lực, Ricardo, yếu tố đặc thù, Heckscher–Ohlin, mô hình chuẩn,
 * lợi thế kinh tế nhờ quy mô, công cụ chính sách thương mại, kinh tế chính trị–WTO–FTA,
 * cán cân thanh toán, tỷ giá–UIP, PPP & chế độ tỷ giá. Song ngữ + ví dụ số (đã kiểm bằng máy;
 * số liệu là GIẢ ĐỊNH) + bài tập + quiz.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('eco201-0-1-overview', 'Course overview: why nations trade and how money crosses borders|||Tổng quan: vì sao các nước thương mại và tiền đi qua biên giới thế nào',
  'Hai nửa của kinh tế quốc tế (thương mại và tài chính quốc tế), các câu hỏi lớn của môn, xu hướng toàn cầu hoá, độ mở của nền kinh tế, mô hình trọng lực, liên hệ với IBI101, ECO121, FIN301 và lộ trình môn.',
  [[
    `<span class="eyebrow">ECO201 · Lesson 0.1 · Overview</span>
<h2>International Economics</h2>
<p class="lead">International economics studies what happens when goods, services, capital and money cross national borders. It has two halves: <strong>international trade</strong> — why countries trade, who gains and who loses, and what trade policy does — and <strong>international finance</strong> — the balance of payments, exchange rates and monetary regimes.</p>
<h3>The big questions of the course</h3>
<table>
<tr><th>Question</th><th>Key idea</th><th>Part</th></tr>
<tr><td>Why do countries trade, and can both sides gain?</td><td>Comparative advantage, gains from trade</td><td>1</td></tr>
<tr><td>What determines who exports what?</td><td>Technology (Ricardo), resources (Heckscher–Ohlin), economies of scale</td><td>1–3</td></tr>
<tr><td>Who wins and who loses inside a country?</td><td>Specific factors, Stolper–Samuelson</td><td>2</td></tr>
<tr><td>What do tariffs, quotas and subsidies do?</td><td>Welfare analysis, political economy, WTO and trade agreements</td><td>4</td></tr>
<tr><td>How are a country’s international transactions recorded?</td><td>Balance of payments, CA = S − I</td><td>5</td></tr>
<tr><td>What determines exchange rates?</td><td>Interest parity, purchasing power parity, exchange-rate regimes</td><td>5</td></tr>
</table>
<h3>Globalization: the broad trends</h3>
<ul>
<li><strong>Two waves.</strong> World trade grew strongly in the decades before 1914, collapsed between the two world wars (depression and protectionism), and expanded again after 1945, accelerating from the 1990s as more economies opened up.</li>
<li><strong>Why it grew.</strong> Falling transport and communication costs (container shipping, the internet) and falling policy barriers (successive GATT rounds, the WTO, regional trade agreements).</li>
<li><strong>What is traded changed.</strong> Manufactured goods dominate merchandise trade; trade in services and in parts and components inside <strong>global value chains</strong> has become more important; developing economies — Vietnam among them — have become major exporters of manufactures.</li>
<li><strong>Recent slowdown.</strong> Since the 2008 global financial crisis, trade has grown more slowly relative to world output, and trade tensions and supply-chain disruptions have revived the debate about openness.</li>
</ul>
<p><strong>Openness</strong> is usually measured by the ratio of (exports + imports) to GDP. Vietnam is a very open economy by this measure — its trade is larger than its GDP. That is possible because trade flows are recorded at gross value, while GDP counts only value added. Look up current figures on World Bank Open Data instead of memorising numbers.</p>
<h3>Who trades with whom: the gravity model</h3>
<p>One of the most reliable empirical regularities in economics: trade between two countries rises with their economic size and falls with the distance between them.</p>
<pre><code>T(ij) = A x Y(i) x Y(j) / D(ij)
T = value of trade between i and j, Y = GDP, D = distance, A = a constant
Illustration: if both economies double in size, predicted trade between them
quadruples (2 x 2 = 4), other things equal</code></pre>
<p>Borders, language, tariffs and trade agreements matter too: regions inside one country typically trade much more with each other than with equally distant regions across a border. The gravity model tells us <em>how much</em> countries trade; the models in Parts 1–3 explain <em>what</em> they trade and <em>why</em>.</p>
<h3>How this course connects</h3>
<p>IBI101 introduced trade theories and trade policy from a business perspective; ECO121 introduced the open-economy identity; FIN301 (taken in the same term) also covers covered interest parity. Here we build the models and use them with numbers. Every example uses illustrative (assumed) data that has been checked. For each problem, draw the diagram first — the production possibility frontier, the supply and demand diagram, or the interest-parity relationship — then calculate.</p>
<div class="callout"><span class="badge">One idea to keep</span> Trade is not a zero-sum contest. Countries gain by specialising in what they do <em>relatively</em> well — but the gains are not shared equally inside each country, which is why trade policy is always political.</div>`,
    `<span class="eyebrow">ECO201 · Bài 0.1 · Tổng quan</span>
<h2>Kinh tế quốc tế</h2>
<p class="lead">Kinh tế quốc tế nghiên cứu điều gì xảy ra khi hàng hoá, dịch vụ, vốn và tiền tệ đi qua biên giới quốc gia. Môn học có hai nửa: <strong>thương mại quốc tế</strong> — vì sao các nước buôn bán với nhau, ai được ai mất, chính sách thương mại tác động ra sao — và <strong>tài chính quốc tế</strong> — cán cân thanh toán, tỷ giá hối đoái và chế độ tiền tệ.</p>
<h3>Những câu hỏi lớn của môn học</h3>
<table>
<tr><th>Câu hỏi</th><th>Ý tưởng then chốt</th><th>Phần</th></tr>
<tr><td>Vì sao các nước thương mại, và có thể cả hai bên cùng có lợi không?</td><td>Lợi thế so sánh, lợi ích từ thương mại</td><td>1</td></tr>
<tr><td>Điều gì quyết định nước nào xuất khẩu hàng gì?</td><td>Công nghệ (Ricardo), nguồn lực (Heckscher–Ohlin), lợi thế kinh tế nhờ quy mô</td><td>1–3</td></tr>
<tr><td>Trong một nước, ai được và ai mất?</td><td>Yếu tố đặc thù, Stolper–Samuelson</td><td>2</td></tr>
<tr><td>Thuế quan, hạn ngạch và trợ cấp tác động thế nào?</td><td>Phân tích phúc lợi, kinh tế chính trị, WTO và các hiệp định thương mại</td><td>4</td></tr>
<tr><td>Giao dịch quốc tế của một nước được ghi chép ra sao?</td><td>Cán cân thanh toán, CA = S − I</td><td>5</td></tr>
<tr><td>Điều gì quyết định tỷ giá hối đoái?</td><td>Ngang giá lãi suất, ngang giá sức mua, chế độ tỷ giá</td><td>5</td></tr>
</table>
<h3>Toàn cầu hoá: các xu hướng lớn</h3>
<ul>
<li><strong>Hai làn sóng.</strong> Thương mại thế giới tăng mạnh trong nhiều thập kỷ trước năm 1914, sụp đổ giữa hai cuộc chiến tranh thế giới (khủng hoảng và bảo hộ), rồi mở rộng trở lại sau năm 1945 và tăng tốc từ thập niên 1990 khi thêm nhiều nền kinh tế mở cửa.</li>
<li><strong>Vì sao tăng.</strong> Chi phí vận tải và thông tin liên lạc giảm (vận tải container, internet) và rào cản chính sách giảm (các vòng đàm phán GATT, WTO, các hiệp định thương mại khu vực).</li>
<li><strong>Cơ cấu hàng hoá thay đổi.</strong> Hàng chế tạo chiếm phần lớn thương mại hàng hoá; thương mại dịch vụ và linh kiện, bộ phận trong <strong>chuỗi giá trị toàn cầu</strong> ngày càng quan trọng; các nền kinh tế đang phát triển — trong đó có Việt Nam — trở thành những nhà xuất khẩu hàng chế tạo lớn.</li>
<li><strong>Chững lại gần đây.</strong> Từ khủng hoảng tài chính toàn cầu 2008, thương mại tăng chậm hơn so với sản lượng thế giới, và căng thẳng thương mại cùng các đứt gãy chuỗi cung ứng làm sống lại cuộc tranh luận về độ mở.</li>
</ul>
<p><strong>Độ mở</strong> của nền kinh tế thường được đo bằng tỷ lệ (xuất khẩu + nhập khẩu) / GDP. Theo thước đo này Việt Nam là nền kinh tế rất mở — tổng kim ngạch thương mại lớn hơn GDP. Điều đó có thể xảy ra vì thương mại được ghi theo giá trị gộp, còn GDP chỉ tính giá trị gia tăng. Hãy tra số liệu hiện hành trên World Bank Open Data thay vì học thuộc con số.</p>
<h3>Ai buôn bán với ai: mô hình trọng lực</h3>
<p>Một trong những quy luật thực nghiệm vững chắc nhất của kinh tế học: thương mại giữa hai nước tăng theo quy mô kinh tế của chúng và giảm theo khoảng cách giữa chúng.</p>
<pre><code>T(ij) = A x Y(i) x Y(j) / D(ij)
T = giá trị thương mại giữa i và j, Y = GDP, D = khoảng cách, A = hằng số
Minh hoạ: nếu cả hai nền kinh tế tăng gấp đôi quy mô, thương mại dự báo giữa chúng
tăng gấp bốn (2 x 2 = 4), các yếu tố khác không đổi</code></pre>
<p>Biên giới, ngôn ngữ, thuế quan và hiệp định thương mại cũng quan trọng: các vùng trong cùng một nước thường buôn bán với nhau nhiều hơn hẳn so với các vùng ở cách xa tương đương nhưng nằm bên kia biên giới. Mô hình trọng lực cho biết các nước buôn bán <em>bao nhiêu</em>; các mô hình ở Phần 1–3 giải thích họ buôn bán <em>cái gì</em> và <em>vì sao</em>.</p>
<h3>Môn học này nối với các môn khác thế nào</h3>
<p>IBI101 đã giới thiệu các lý thuyết và chính sách thương mại dưới góc nhìn kinh doanh; ECO121 giới thiệu đồng nhất thức của nền kinh tế mở; FIN301 (học cùng kỳ) cũng trình bày ngang giá lãi suất có bảo hiểm. Ở đây chúng ta dựng các mô hình và dùng chúng với con số. Mọi ví dụ dùng số liệu minh hoạ (giả định) và đã được kiểm tra. Với mỗi bài, hãy vẽ đồ thị trước — đường giới hạn khả năng sản xuất, đồ thị cung cầu hoặc quan hệ ngang giá lãi suất — rồi mới tính.</p>
<div class="callout"><span class="badge">Một ý cần giữ</span> Thương mại không phải là trò chơi tổng bằng không. Các nước có lợi khi chuyên môn hoá vào việc mình làm <em>tương đối</em> tốt — nhưng lợi ích không chia đều trong mỗi nước, vì thế chính sách thương mại luôn mang tính chính trị.</div>`,
  ]]);

const c11 = doc('eco201-1-1-ricardian-model', '1.1 — The Ricardian model: opportunity cost and comparative advantage|||1.1 — Mô hình Ricardo: chi phí cơ hội và lợi thế so sánh',
  'Mô hình một yếu tố sản xuất (lao động) của Ricardo: nhu cầu lao động trên một đơn vị sản phẩm, đường giới hạn khả năng sản xuất, chi phí cơ hội, lợi thế tuyệt đối và lợi thế so sánh, giá tương đối khi tự cung tự cấp và quy tắc chuyên môn hoá; ví dụ số giả định Home–Foreign với gạo và vải.',
  [[
    `<span class="eyebrow">ECO201 · Part 1 · Lesson 1.1</span>
<h2>The Ricardian model: opportunity cost and comparative advantage</h2>
<p class="lead">David Ricardo (1817) showed that a country can gain from trade even if it is more productive than its partner in <em>every</em> good. His model has a single factor of production — labour — and explains trade by differences in <strong>technology</strong> (labour productivity) between countries.</p>
<h3>Set-up</h3>
<p>Two countries (Home and Foreign), two goods (rice and cloth), one factor (labour), perfect competition, and labour that moves freely between sectors inside a country but not between countries. Technology is summarised by <strong>unit labour requirements</strong>: the hours needed to produce one unit of each good. Illustrative (assumed) data:</p>
<table>
<tr><th></th><th>Rice (hours per unit)</th><th>Cloth (hours per unit)</th><th>Labour force (hours)</th></tr>
<tr><td>Home</td><td>a(LR) = 1</td><td>a(LC) = 2</td><td>L = 1,000</td></tr>
<tr><td>Foreign</td><td>a*(LR) = 6</td><td>a*(LC) = 3</td><td>L* = 1,200</td></tr>
</table>
<h3>The production possibility frontier (PPF)</h3>
<pre><code>Home:     a(LR) x Q(R) + a(LC) x Q(C) &lt;= L
          1 x Q(R) + 2 x Q(C) &lt;= 1,000   -&gt;  at most 1,000 rice OR 500 cloth
Foreign:  6 x Q*(R) + 3 x Q*(C) &lt;= 1,200 -&gt;  at most 200 rice OR 400 cloth</code></pre>
<p>With one factor and constant labour requirements, each PPF is a straight line. Its slope measures the <strong>opportunity cost</strong>: how much of one good must be given up to produce one more unit of the other.</p>
<h3>Absolute versus comparative advantage</h3>
<table>
<tr><th></th><th>Home</th><th>Foreign</th><th>Lower opportunity cost</th></tr>
<tr><td>Opportunity cost of 1 cloth = a(LC) / a(LR)</td><td>2 / 1 = 2 rice</td><td>3 / 6 = 0.5 rice</td><td>Foreign</td></tr>
<tr><td>Opportunity cost of 1 rice = a(LR) / a(LC)</td><td>1 / 2 = 0.5 cloth</td><td>6 / 3 = 2 cloth</td><td>Home</td></tr>
</table>
<ul>
<li><strong>Absolute advantage</strong> means needing fewer hours per unit. Home has an absolute advantage in <em>both</em> goods (1 &lt; 6 hours for rice, 2 &lt; 3 hours for cloth).</li>
<li><strong>Comparative advantage</strong> means a lower <em>opportunity cost</em>. Home has a comparative advantage in rice; Foreign has a comparative advantage in cloth. A country cannot have a comparative advantage in both goods — if its opportunity cost of cloth is higher, its opportunity cost of rice is automatically lower.</li>
</ul>
<h3>Relative prices without trade (autarky)</h3>
<p>Competition drives the price of each good to its labour cost. An hour of Home labour earns P(R) / a(LR) in rice and P(C) / a(LC) in cloth. If both goods are produced, workers must earn the same in both sectors, so</p>
<pre><code>Autarky relative price of cloth:  P(C) / P(R) = a(LC) / a(LR)
Home:    2 / 1 = 2          Foreign:  3 / 6 = 0.5
Specialisation rule for Home:
  if P(C) / P(R) &gt; 2  -&gt; workers earn more in cloth -&gt; Home produces only cloth
  if P(C) / P(R) &lt; 2  -&gt; workers earn more in rice  -&gt; Home produces only rice</code></pre>
<p>Without trade, relative prices simply reflect relative labour requirements. The different autarky prices — cloth is cheap in Foreign and expensive at Home — are what makes trade profitable: buy cloth where it is cheap, sell it where it is dear.</p>
<div class="callout"><span class="badge">Comparative, not absolute</span> A lawyer who types faster than her assistant still hires the assistant: an hour of her time spent typing costs her an hour of legal work. What matters is the opportunity cost, not who is fastest at everything.</div>`,
    `<span class="eyebrow">ECO201 · Phần 1 · Bài 1.1</span>
<h2>Mô hình Ricardo: chi phí cơ hội và lợi thế so sánh</h2>
<p class="lead">David Ricardo (1817) chỉ ra rằng một nước vẫn có thể được lợi từ thương mại ngay cả khi nước đó năng suất hơn đối tác ở <em>mọi</em> mặt hàng. Mô hình của ông chỉ có một yếu tố sản xuất — lao động — và giải thích thương mại bằng khác biệt về <strong>công nghệ</strong> (năng suất lao động) giữa các nước.</p>
<h3>Giả thiết</h3>
<p>Hai nước (Home và Foreign), hai hàng hoá (gạo và vải), một yếu tố sản xuất (lao động), cạnh tranh hoàn hảo; lao động di chuyển tự do giữa các ngành trong một nước nhưng không di chuyển giữa các nước. Công nghệ được tóm tắt bằng <strong>nhu cầu lao động trên một đơn vị sản phẩm</strong>: số giờ cần để sản xuất một đơn vị mỗi hàng. Số liệu minh hoạ (giả định):</p>
<table>
<tr><th></th><th>Gạo (giờ/đơn vị)</th><th>Vải (giờ/đơn vị)</th><th>Lực lượng lao động (giờ)</th></tr>
<tr><td>Home</td><td>a(LR) = 1</td><td>a(LC) = 2</td><td>L = 1.000</td></tr>
<tr><td>Foreign</td><td>a*(LR) = 6</td><td>a*(LC) = 3</td><td>L* = 1.200</td></tr>
</table>
<h3>Đường giới hạn khả năng sản xuất (PPF)</h3>
<pre><code>Home:     a(LR) x Q(R) + a(LC) x Q(C) &lt;= L
          1 x Q(R) + 2 x Q(C) &lt;= 1.000   -&gt;  tối đa 1.000 gạo HOẶC 500 vải
Foreign:  6 x Q*(R) + 3 x Q*(C) &lt;= 1.200 -&gt;  tối đa 200 gạo HOẶC 400 vải</code></pre>
<p>Với một yếu tố sản xuất và nhu cầu lao động không đổi, mỗi đường PPF là một đường thẳng. Độ dốc của nó đo <strong>chi phí cơ hội</strong>: phải từ bỏ bao nhiêu hàng này để sản xuất thêm một đơn vị hàng kia.</p>
<h3>Lợi thế tuyệt đối và lợi thế so sánh</h3>
<table>
<tr><th></th><th>Home</th><th>Foreign</th><th>Chi phí cơ hội thấp hơn</th></tr>
<tr><td>Chi phí cơ hội của 1 vải = a(LC) / a(LR)</td><td>2 / 1 = 2 gạo</td><td>3 / 6 = 0,5 gạo</td><td>Foreign</td></tr>
<tr><td>Chi phí cơ hội của 1 gạo = a(LR) / a(LC)</td><td>1 / 2 = 0,5 vải</td><td>6 / 3 = 2 vải</td><td>Home</td></tr>
</table>
<ul>
<li><strong>Lợi thế tuyệt đối</strong> là cần ít giờ lao động hơn cho một đơn vị sản phẩm. Home có lợi thế tuyệt đối ở <em>cả hai</em> hàng (gạo 1 &lt; 6 giờ, vải 2 &lt; 3 giờ).</li>
<li><strong>Lợi thế so sánh</strong> là có <em>chi phí cơ hội</em> thấp hơn. Home có lợi thế so sánh về gạo; Foreign có lợi thế so sánh về vải. Một nước không thể có lợi thế so sánh ở cả hai hàng — nếu chi phí cơ hội của vải cao hơn thì chi phí cơ hội của gạo tự động thấp hơn.</li>
</ul>
<h3>Giá tương đối khi không có thương mại (tự cung tự cấp)</h3>
<p>Cạnh tranh đẩy giá mỗi hàng về đúng chi phí lao động của nó. Một giờ lao động ở Home kiếm được P(R) / a(LR) nếu làm gạo và P(C) / a(LC) nếu làm vải. Nếu cả hai hàng đều được sản xuất, người lao động phải kiếm như nhau ở cả hai ngành, nên</p>
<pre><code>Giá tương đối của vải khi tự cung tự cấp:  P(C) / P(R) = a(LC) / a(LR)
Home:    2 / 1 = 2          Foreign:  3 / 6 = 0,5
Quy tắc chuyên môn hoá của Home:
  nếu P(C) / P(R) &gt; 2  -&gt; làm vải được trả nhiều hơn -&gt; Home chỉ sản xuất vải
  nếu P(C) / P(R) &lt; 2  -&gt; làm gạo được trả nhiều hơn -&gt; Home chỉ sản xuất gạo</code></pre>
<p>Khi không có thương mại, giá tương đối chỉ phản ánh nhu cầu lao động tương đối. Chính sự khác biệt về giá tự cung tự cấp — vải rẻ ở Foreign và đắt ở Home — làm cho thương mại có lãi: mua vải ở nơi rẻ, bán ở nơi đắt.</p>
<div class="callout"><span class="badge">So sánh, không phải tuyệt đối</span> Một luật sư gõ máy nhanh hơn trợ lý vẫn thuê trợ lý: mỗi giờ cô tự gõ máy là mất một giờ làm việc pháp lý. Điều quyết định là chi phí cơ hội, không phải ai nhanh nhất ở mọi việc.</div>`,
  ]]);

const c12 = doc('eco201-1-2-gains-from-trade', '1.2 — Trade in the Ricardian model: world prices, gains and relative wages|||1.2 — Thương mại trong mô hình Ricardo: giá thế giới, lợi ích và tiền lương tương đối',
  'Giá tương đối thế giới nằm giữa hai mức giá tự cung tự cấp, chuyên môn hoá hoàn toàn, hai cách nhìn lợi ích từ thương mại (sản xuất gián tiếp và tiêu dùng vượt đường PPF), tiền lương tương đối, ba ngộ nhận phổ biến, mở rộng nhiều hàng hoá và chi phí vận tải, bằng chứng thực nghiệm.',
  [[
    `<span class="eyebrow">ECO201 · Part 1 · Lesson 1.2</span>
<h2>Trade in the Ricardian model: world prices, gains and relative wages</h2>
<p class="lead">Continue with Home and Foreign from lesson 1.1. Autarky relative prices of cloth are 2 (Home) and 0.5 (Foreign). When trade opens, one world relative price must emerge.</p>
<h3>The world relative price</h3>
<p>The world relative price of cloth is set by <strong>world relative supply (RS)</strong> and <strong>world relative demand (RD)</strong>. In the Ricardian model RS is a step: no cloth is supplied below 0.5, only Foreign supplies cloth between 0.5 and 2, and Home also switches to cloth above 2. Whatever RD looks like, the world price ends up <strong>between the two autarky prices</strong>, 0.5 ≤ P(C)/P(R) ≤ 2.</p>
<ul>
<li>If the world price is strictly inside the range (say 1), each country <strong>specialises completely</strong> in its comparative-advantage good: Home in rice, Foreign in cloth.</li>
<li>If one country is very large, the world price may equal <em>its</em> autarky price; that country then produces both goods and gains nothing, while the small country captures all the gains.</li>
</ul>
<h3>Gains from trade, view 1: trade as indirect production</h3>
<pre><code>World price: P(C) / P(R) = 1 (one cloth trades for one rice)
Home:    1 hour -&gt; 1 rice -&gt; traded for 1 cloth      (making cloth directly: 0.5 cloth)
Foreign: 1 hour -&gt; 1/3 cloth -&gt; traded for 1/3 rice  (making rice directly: 1/6 rice)</code></pre>
<p>Each country obtains its imported good with half the labour it would need to make it at home. Trade works like a more efficient technology.</p>
<h3>Gains from trade, view 2: consuming outside the PPF</h3>
<table>
<tr><th>Illustrative allocation</th><th>Home rice</th><th>Home cloth</th><th>Foreign rice</th><th>Foreign cloth</th></tr>
<tr><td>Autarky (Home: 600 hours in rice, 400 hours in cloth; Foreign: 600 hours in each)</td><td>600</td><td>200</td><td>100</td><td>200</td></tr>
<tr><td>Production with trade (complete specialisation)</td><td>1,000</td><td>0</td><td>0</td><td>400</td></tr>
<tr><td>Consumption after Home trades 200 rice for 200 cloth</td><td>800</td><td>200</td><td>200</td><td>200</td></tr>
</table>
<p>World output of rice rises from 700 to 1,000 with the same 400 cloth. Both countries consume more rice and the same cloth — combinations that lie outside their own PPFs.</p>
<h3>Relative wages</h3>
<pre><code>Set P(R) = P(C) = 1. Home makes rice, Foreign makes cloth.
Home wage     w  = P(R) / a(LR)  = 1 / 1 = 1 per hour
Foreign wage  w* = P(C) / a*(LC) = 1 / 3 per hour      -&gt;  w / w* = 3
Home's productivity lead: 6 / 1 = 6 times in rice, 3 / 2 = 1.5 times in cloth
The relative wage (3) lies between 1.5 and 6.</code></pre>
<p>Because the relative wage lies between the two productivity ratios, each country has a <strong>cost advantage</strong> in one good: rice costs 1 hour x 1 = 1 at Home versus 6 x 1/3 = 2 in Foreign; cloth costs 2 x 1 = 2 at Home versus 3 x 1/3 = 1 in Foreign. Low Foreign wages compensate for low Foreign productivity.</p>
<h3>Three common misconceptions</h3>
<ol>
<li><strong>“Trade only helps if you are competitive.”</strong> Foreign is less productive in both goods and still gains.</li>
<li><strong>The pauper-labour argument.</strong> “Competing with low-wage countries hurts us.” Home gains even though Foreign wages are one-third of Home’s.</li>
<li><strong>Exploitation.</strong> “Trade exploits low-wage workers.” Foreign workers are better off than in autarky: an hour of Foreign labour now buys 1/3 rice instead of 1/6.</li>
</ol>
<h3>Extensions and evidence</h3>
<p>With <strong>many goods</strong>, rank goods by Home’s relative productivity; the relative wage splits the list — Home exports the goods where its productivity lead exceeds its wage lead. <strong>Transport costs</strong> can make some goods non-traded. Empirically, countries tend to export goods in which their relative productivity is high, but the model predicts extreme specialisation, ignores income distribution and ignores economies of scale — gaps filled in Parts 2 and 3.</p>
<div class="callout"><span class="badge">Remember</span> The world price must lie between the autarky prices. The farther it is from a country’s own autarky price, the larger that country’s gains.</div>`,
    `<span class="eyebrow">ECO201 · Phần 1 · Bài 1.2</span>
<h2>Thương mại trong mô hình Ricardo: giá thế giới, lợi ích và tiền lương tương đối</h2>
<p class="lead">Tiếp tục với Home và Foreign ở bài 1.1. Giá tương đối của vải khi tự cung tự cấp là 2 (Home) và 0,5 (Foreign). Khi mở cửa thương mại, phải hình thành một mức giá tương đối thế giới duy nhất.</p>
<h3>Giá tương đối thế giới</h3>
<p>Giá tương đối thế giới của vải do <strong>cung tương đối thế giới (RS)</strong> và <strong>cầu tương đối thế giới (RD)</strong> quyết định. Trong mô hình Ricardo, RS có dạng bậc thang: dưới 0,5 không ai cung vải, từ 0,5 đến 2 chỉ Foreign cung vải, trên 2 thì Home cũng chuyển sang làm vải. Dù RD có hình dạng nào, giá thế giới cũng nằm <strong>giữa hai mức giá tự cung tự cấp</strong>, 0,5 ≤ P(C)/P(R) ≤ 2.</p>
<ul>
<li>Nếu giá thế giới nằm hẳn bên trong khoảng này (ví dụ 1), mỗi nước <strong>chuyên môn hoá hoàn toàn</strong> vào hàng có lợi thế so sánh: Home làm gạo, Foreign làm vải.</li>
<li>Nếu một nước rất lớn, giá thế giới có thể bằng đúng giá tự cung tự cấp của <em>nước đó</em>; khi ấy nước lớn vẫn sản xuất cả hai hàng và không được lợi gì, còn nước nhỏ hưởng toàn bộ lợi ích.</li>
</ul>
<h3>Lợi ích từ thương mại, cách nhìn 1: thương mại là sản xuất gián tiếp</h3>
<pre><code>Giá thế giới: P(C) / P(R) = 1 (một vải đổi được một gạo)
Home:    1 giờ -&gt; 1 gạo -&gt; đổi được 1 vải         (tự làm vải: 0,5 vải)
Foreign: 1 giờ -&gt; 1/3 vải -&gt; đổi được 1/3 gạo    (tự làm gạo: 1/6 gạo)</code></pre>
<p>Mỗi nước có được hàng nhập khẩu với một nửa lượng lao động cần có nếu tự làm. Thương mại hoạt động như một công nghệ hiệu quả hơn.</p>
<h3>Lợi ích từ thương mại, cách nhìn 2: tiêu dùng vượt ra ngoài đường PPF</h3>
<table>
<tr><th>Phân bổ minh hoạ</th><th>Gạo Home</th><th>Vải Home</th><th>Gạo Foreign</th><th>Vải Foreign</th></tr>
<tr><td>Tự cung tự cấp (Home: 600 giờ làm gạo, 400 giờ làm vải; Foreign: 600 và 600)</td><td>600</td><td>200</td><td>100</td><td>200</td></tr>
<tr><td>Sản xuất khi có thương mại (chuyên môn hoá hoàn toàn)</td><td>1.000</td><td>0</td><td>0</td><td>400</td></tr>
<tr><td>Tiêu dùng sau khi Home đổi 200 gạo lấy 200 vải</td><td>800</td><td>200</td><td>200</td><td>200</td></tr>
</table>
<p>Sản lượng gạo thế giới tăng từ 700 lên 1.000 trong khi vẫn có 400 vải. Cả hai nước tiêu dùng nhiều gạo hơn và lượng vải như cũ — những tổ hợp nằm ngoài đường PPF của chính họ.</p>
<h3>Tiền lương tương đối</h3>
<pre><code>Đặt P(R) = P(C) = 1. Home làm gạo, Foreign làm vải.
Lương Home     w  = P(R) / a(LR)  = 1 / 1 = 1 mỗi giờ
Lương Foreign  w* = P(C) / a*(LC) = 1 / 3 mỗi giờ      -&gt;  w / w* = 3
Mức năng suất vượt trội của Home: gạo 6 / 1 = 6 lần, vải 3 / 2 = 1,5 lần
Tiền lương tương đối (3) nằm giữa 1,5 và 6.</code></pre>
<p>Vì tiền lương tương đối nằm giữa hai tỷ số năng suất, mỗi nước có <strong>lợi thế chi phí</strong> ở một hàng: gạo tốn 1 giờ x 1 = 1 ở Home so với 6 x 1/3 = 2 ở Foreign; vải tốn 2 x 1 = 2 ở Home so với 3 x 1/3 = 1 ở Foreign. Lương thấp ở Foreign bù cho năng suất thấp ở Foreign.</p>
<h3>Ba ngộ nhận phổ biến</h3>
<ol>
<li><strong>“Thương mại chỉ có lợi nếu mình đủ sức cạnh tranh.”</strong> Foreign kém năng suất ở cả hai hàng mà vẫn được lợi.</li>
<li><strong>Lập luận lao động giá rẻ.</strong> “Cạnh tranh với các nước lương thấp gây hại cho ta.” Home vẫn được lợi dù lương ở Foreign chỉ bằng một phần ba lương ở Home.</li>
<li><strong>Bóc lột.</strong> “Thương mại bóc lột người lao động lương thấp.” Người lao động Foreign khá hơn so với khi tự cung tự cấp: một giờ lao động ở Foreign nay mua được 1/3 gạo thay vì 1/6.</li>
</ol>
<h3>Mở rộng và bằng chứng</h3>
<p>Với <strong>nhiều hàng hoá</strong>, xếp các hàng theo năng suất tương đối của Home; tiền lương tương đối chia danh sách làm hai — Home xuất khẩu những hàng mà mức vượt trội về năng suất lớn hơn mức vượt trội về lương. <strong>Chi phí vận tải</strong> có thể khiến một số hàng trở thành hàng không giao dịch. Về thực nghiệm, các nước có xu hướng xuất khẩu hàng mà năng suất tương đối của họ cao, nhưng mô hình dự báo chuyên môn hoá cực đoan, bỏ qua phân phối thu nhập và bỏ qua lợi thế kinh tế nhờ quy mô — những khoảng trống được lấp ở Phần 2 và 3.</p>
<div class="callout"><span class="badge">Ghi nhớ</span> Giá thế giới phải nằm giữa hai mức giá tự cung tự cấp. Giá thế giới càng xa giá tự cung tự cấp của một nước thì lợi ích của nước đó càng lớn.</div>`,
  ]]);

const c13e = doc('eco201-1-3-exercise', 'Exercise 1 — comparative advantage and the gains from trade|||Bài tập 1 — lợi thế so sánh và lợi ích từ thương mại',
  'Bài tập Ricardo 2 nước × 2 hàng (tình huống giả định): tính chi phí cơ hội, xác định lợi thế tuyệt đối và so sánh, đường PPF, khoảng giá thương mại có lợi cho cả hai bên, lợi ích tiêu dùng sau chuyên môn hoá và tiền lương tương đối; kèm lời giải.',
  [[
    `<span class="eyebrow">ECO201 · Part 1 · Exercise</span>
<h2>Exercise 1 — coffee, phones and who should make what</h2>
<div class="callout"><span class="badge">Problem</span> A fictional case with illustrative numbers. Country A needs 2 hours to produce one unit of coffee and 4 hours for one phone; it has 1,000 labour hours. Country B needs 5 hours for coffee and 5 hours for a phone; it has 2,000 labour hours. (a) Compute each country’s opportunity cost of coffee and of phones. (b) Who has the absolute advantage in each good, and who has the comparative advantage? (c) Find the end points of each PPF. (d) Within what range must the world relative price of phones (in coffee) lie for both countries to gain? (e) In autarky each country splits its labour equally between the two goods. Trade opens at 1.5 coffee per phone, both countries specialise completely and A exports 225 coffee. Compute consumption in each country and the gains. (f) With the price of coffee set to 1, compute each country’s hourly wage and the relative wage.</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) Country A: 1 phone  = 4 / 2 = 2 coffee      1 coffee = 2 / 4 = 0.5 phone
    Country B: 1 phone  = 5 / 5 = 1 coffee      1 coffee = 5 / 5 = 1 phone

(b) Absolute advantage: A in both goods (coffee 2 &lt; 5 hours, phones 4 &lt; 5 hours)
    Comparative advantage: A in coffee (0.5 &lt; 1 phone), B in phones (1 &lt; 2 coffee)

(c) A: 1,000 / 2 = 500 coffee   or  1,000 / 4 = 250 phones
    B: 2,000 / 5 = 400 coffee   or  2,000 / 5 = 400 phones

(d) Between the autarky prices:  1 &lt; P(phone) / P(coffee) &lt; 2

(e) Autarky:  A = 250 coffee, 125 phones      B = 200 coffee, 200 phones
              World = 450 coffee, 325 phones
    Trade:    A makes 500 coffee, B makes 400 phones (world: 500 and 400)
              A exports 225 coffee, imports 225 / 1.5 = 150 phones
    Consumption:  A = 500 − 225 = 275 coffee, 150 phones   (+25 coffee, +25 phones)
                  B = 225 coffee, 400 − 150 = 250 phones   (+25 coffee, +50 phones)

(f) P(coffee) = 1, P(phone) = 1.5
    w(A) = 1 / 2   = 0.5 per hour   (A makes coffee)
    w(B) = 1.5 / 5 = 0.3 per hour   (B makes phones)
    w(A) / w(B) = 0.5 / 0.3 = 1.67
    A's productivity lead: 5 / 4 = 1.25 in phones, 5 / 2 = 2.5 in coffee -&gt; 1.25 &lt; 1.67 &lt; 2.5</code></pre>
<p><strong>Why:</strong> A is better at everything, yet it gains by leaving phones to B, because each phone it makes costs 2 coffee while B gives it a phone for only 1.5 coffee. B gains because it gets coffee at 1/1.5 ≈ 0.67 phone instead of 1 phone. Specialisation raises world output of both goods (coffee 450 → 500, phones 325 → 400), so both countries can consume more of both. The relative wage lands between the two productivity ratios — the condition that gives each country a cost advantage in one good.</p>`,
    `<span class="eyebrow">ECO201 · Phần 1 · Bài tập</span>
<h2>Bài tập 1 — cà phê, điện thoại và ai nên làm gì</h2>
<div class="callout"><span class="badge">Đề</span> Tình huống giả định, số liệu minh hoạ. Nước A cần 2 giờ để sản xuất một đơn vị cà phê và 4 giờ cho một chiếc điện thoại; A có 1.000 giờ lao động. Nước B cần 5 giờ cho cà phê và 5 giờ cho một điện thoại; B có 2.000 giờ lao động. (a) Tính chi phí cơ hội của cà phê và của điện thoại ở mỗi nước. (b) Nước nào có lợi thế tuyệt đối ở mỗi hàng, nước nào có lợi thế so sánh? (c) Tìm các điểm đầu mút của mỗi đường PPF. (d) Giá tương đối thế giới của điện thoại (tính bằng cà phê) phải nằm trong khoảng nào để cả hai nước cùng có lợi? (e) Khi tự cung tự cấp, mỗi nước chia đôi lao động cho hai hàng. Thương mại mở ra ở mức 1,5 cà phê đổi một điện thoại, hai nước chuyên môn hoá hoàn toàn và A xuất khẩu 225 cà phê. Tính tiêu dùng của mỗi nước và phần được lợi. (f) Đặt giá cà phê bằng 1, tính tiền lương mỗi giờ của từng nước và tiền lương tương đối.</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) Nước A: 1 điện thoại = 4 / 2 = 2 cà phê      1 cà phê = 2 / 4 = 0,5 điện thoại
    Nước B: 1 điện thoại = 5 / 5 = 1 cà phê      1 cà phê = 5 / 5 = 1 điện thoại

(b) Lợi thế tuyệt đối: A ở cả hai hàng (cà phê 2 &lt; 5 giờ, điện thoại 4 &lt; 5 giờ)
    Lợi thế so sánh: A về cà phê (0,5 &lt; 1 điện thoại), B về điện thoại (1 &lt; 2 cà phê)

(c) A: 1.000 / 2 = 500 cà phê   hoặc  1.000 / 4 = 250 điện thoại
    B: 2.000 / 5 = 400 cà phê   hoặc  2.000 / 5 = 400 điện thoại

(d) Nằm giữa hai mức giá tự cung tự cấp:  1 &lt; P(điện thoại) / P(cà phê) &lt; 2

(e) Tự cung tự cấp:  A = 250 cà phê, 125 điện thoại     B = 200 cà phê, 200 điện thoại
                     Thế giới = 450 cà phê, 325 điện thoại
    Thương mại:      A làm 500 cà phê, B làm 400 điện thoại (thế giới: 500 và 400)
                     A xuất 225 cà phê, nhập 225 / 1,5 = 150 điện thoại
    Tiêu dùng:  A = 500 − 225 = 275 cà phê, 150 điện thoại   (+25 cà phê, +25 điện thoại)
                B = 225 cà phê, 400 − 150 = 250 điện thoại   (+25 cà phê, +50 điện thoại)

(f) P(cà phê) = 1, P(điện thoại) = 1,5
    w(A) = 1 / 2   = 0,5 mỗi giờ   (A làm cà phê)
    w(B) = 1,5 / 5 = 0,3 mỗi giờ   (B làm điện thoại)
    w(A) / w(B) = 0,5 / 0,3 = 1,67
    Năng suất vượt trội của A: điện thoại 5 / 4 = 1,25, cà phê 5 / 2 = 2,5 -&gt; 1,25 &lt; 1,67 &lt; 2,5</code></pre>
<p><strong>Vì sao:</strong> A giỏi hơn ở mọi thứ nhưng vẫn được lợi khi nhường điện thoại cho B, vì mỗi điện thoại A tự làm tốn 2 cà phê trong khi B đổi cho A một điện thoại chỉ với 1,5 cà phê. B được lợi vì có cà phê với giá 1/1,5 ≈ 0,67 điện thoại thay vì 1 điện thoại. Chuyên môn hoá làm tăng sản lượng thế giới của cả hai hàng (cà phê 450 → 500, điện thoại 325 → 400), nên cả hai nước có thể tiêu dùng nhiều hơn cả hai thứ. Tiền lương tương đối rơi vào giữa hai tỷ số năng suất — đúng điều kiện giúp mỗi nước có lợi thế chi phí ở một hàng.</p>`,
  ]]);

const q1 = quiz('eco201-quiz-1', 'Quiz 1 — The Ricardian model|||Quiz 1 — Mô hình Ricardo', [
  { id: 'q1', question: 'Home needs 4 hours to produce one unit of wine and 2 hours to produce one unit of cheese. The opportunity cost of one unit of cheese in Home is…|||Home cần 4 giờ để sản xuất một đơn vị rượu vang và 2 giờ để sản xuất một đơn vị pho mát. Chi phí cơ hội của một đơn vị pho mát ở Home là…', options: ['2 units of wine|||2 đơn vị rượu vang', '0.5 unit of wine|||0,5 đơn vị rượu vang', '4 hours of labour|||4 giờ lao động', '8 units of wine|||8 đơn vị rượu vang'], correctIndex: 1, explanation: 'The 2 hours used for one cheese could have produced 2 / 4 = 0.5 unit of wine.|||2 giờ dùng để làm một pho mát lẽ ra sản xuất được 2 / 4 = 0,5 đơn vị rượu vang.' },
  { id: 'q2', question: 'In the Ricardian model, a country has a comparative advantage in a good when…|||Trong mô hình Ricardo, một nước có lợi thế so sánh về một hàng hoá khi…', options: ['it needs fewer labour hours per unit than the other country|||nước đó cần ít giờ lao động trên một đơn vị hơn nước kia', 'its wage is lower than the other country’s wage|||tiền lương của nước đó thấp hơn nước kia', 'its opportunity cost of producing that good is lower than the other country’s|||chi phí cơ hội sản xuất hàng đó của nước này thấp hơn của nước kia', 'it already exports more of that good|||nước đó đang xuất khẩu hàng đó nhiều hơn'], correctIndex: 2, explanation: 'Fewer hours per unit is absolute advantage; comparative advantage is about opportunity cost.|||Ít giờ lao động hơn trên một đơn vị là lợi thế tuyệt đối; lợi thế so sánh là chuyện chi phí cơ hội.' },
  { id: 'q3', question: 'The autarky price of cloth relative to rice is 2 at Home and 0.5 in Foreign. At which world relative price of cloth can both countries gain from trade?|||Giá tương đối của vải so với gạo khi tự cung tự cấp là 2 ở Home và 0,5 ở Foreign. Ở mức giá tương đối thế giới nào của vải thì cả hai nước cùng có lợi từ thương mại?', options: ['0.4|||0,4', '2.5|||2,5', 'At any price|||Ở bất kỳ mức giá nào', '1.2|||1,2'], correctIndex: 3, explanation: 'Both gain only if the world price lies strictly between the autarky prices 0.5 and 2; 1.2 does.|||Cả hai chỉ cùng có lợi khi giá thế giới nằm hẳn giữa hai giá tự cung tự cấp 0,5 và 2; 1,2 thoả mãn.' },
]);

const c21 = doc('eco201-2-1-specific-factors', '2.1 — The specific factors model: trade and income distribution|||2.1 — Mô hình yếu tố đặc thù: thương mại và phân phối thu nhập',
  'Mô hình yếu tố đặc thù (lao động di chuyển, vốn và đất đặc thù cho từng ngành), phân bổ lao động theo điều kiện cân bằng tiền lương, tác động của giá tương đối lên tiền lương và thu nhập của từng yếu tố (ví dụ số giả định), ai được ai mất khi mở cửa, kinh tế chính trị và di cư lao động quốc tế.',
  [[
    `<span class="eyebrow">ECO201 · Part 2 · Lesson 2.1</span>
<h2>The specific factors model: trade and income distribution</h2>
<p class="lead">If trade benefits countries as a whole, why is it so often opposed? Because trade changes the <em>distribution</em> of income. The specific factors model, developed by Paul Samuelson and Ronald Jones, shows who gains and who loses in the short run.</p>
<h3>Set-up</h3>
<ul>
<li>Two goods: manufactures (M) and food (F).</li>
<li>Three factors: <strong>labour</strong> (mobile between sectors), <strong>capital</strong> (specific to manufactures) and <strong>land</strong> (specific to food).</li>
<li><strong>Diminishing returns</strong>: adding workers to a fixed amount of capital (or land) raises output by less and less, so the marginal product of labour (MPL) falls as a sector hires more.</li>
</ul>
<h3>How labour is allocated</h3>
<p>Firms hire until the value of the marginal product equals the wage. Because labour moves freely, the wage is the same in both sectors:</p>
<pre><code>w = P(M) x MPL(M) = P(F) x MPL(F)</code></pre>
<p>If P(M) rises by 10% while P(F) is unchanged, manufacturers want more workers; labour moves from food to manufactures until the wage is equal again. The wage rises, but by <strong>less than 10%</strong>, because MPL falls in the expanding sector.</p>
<h3>A numerical illustration (assumed model)</h3>
<pre><code>Q(M) = K^0.5 x L(M)^0.5      Q(F) = T^0.5 x L(F)^0.5
K = 100 (capital), T = 100 (land), total labour L = 200
Returns per unit: w = P x MPL;  capital = P(M) x MPK;  land = P(F) x MPT</code></pre>
<table>
<tr><th></th><th>Before: P(M) = P(F) = 1</th><th>After: P(M) = 1.1</th><th>Change</th></tr>
<tr><td>Labour in M / in F</td><td>100 / 100</td><td>109.5 / 90.5</td><td>workers move to M</td></tr>
<tr><td>Wage w</td><td>0.5000</td><td>0.5256</td><td>+5.1%</td></tr>
<tr><td>Return to capital</td><td>0.5000</td><td>0.5755</td><td>+15.1%</td></tr>
<tr><td>Rent on land</td><td>0.5000</td><td>0.4757</td><td>−4.9%</td></tr>
</table>
<p>Ranking the changes: capital +15.1% &gt; P(M) +10% &gt; wage +5.1% &gt; P(F) 0% &gt; land −4.9%.</p>
<ul>
<li><strong>Capital owners</strong> (specific to the sector whose price rose) gain in real terms — their income rises faster than any price.</li>
<li><strong>Landowners</strong> (specific to the other sector) lose in real terms.</li>
<li><strong>Workers</strong> are ambiguous: their real wage falls 4.4% in terms of manufactures but rises 5.1% in terms of food. Whether they gain depends on what they consume.</li>
</ul>
<h3>Trade, winners and losers</h3>
<p>Opening to trade raises the relative price of a country’s export good. So factors specific to <strong>export sectors gain</strong>, factors specific to <strong>import-competing sectors lose</strong>, and mobile factors may gain or lose. Yet the country as a whole gains: trade expands consumption possibilities, so the winners gain more than the losers lose and could in principle compensate them.</p>
<h3>Why this matters for policy</h3>
<p>Losers from trade are often concentrated in particular industries and regions, and they organise; the gains are spread thinly across consumers. That is the root of the political economy of protection (Part 4). Economists usually recommend helping those who lose — retraining, social insurance, adjustment assistance — rather than blocking trade.</p>
<p><strong>International labour mobility</strong> can be analysed the same way: when workers move from a low-wage to a high-wage country, wages converge and world output rises, but workers in the destination and owners of other factors in the origin may lose.</p>
<div class="callout"><span class="badge">Short run vs long run</span> The specific factors model is a short-run view: capital and land are stuck in their sectors. Over time factors move between industries — the long-run view of lesson 2.2.</div>`,
    `<span class="eyebrow">ECO201 · Phần 2 · Bài 2.1</span>
<h2>Mô hình yếu tố đặc thù: thương mại và phân phối thu nhập</h2>
<p class="lead">Nếu thương mại có lợi cho cả quốc gia, vì sao nó thường bị phản đối? Vì thương mại làm thay đổi <em>phân phối</em> thu nhập. Mô hình yếu tố đặc thù, do Paul Samuelson và Ronald Jones phát triển, chỉ ra ai được và ai mất trong ngắn hạn.</p>
<h3>Giả thiết</h3>
<ul>
<li>Hai hàng hoá: hàng chế tạo (M) và lương thực (F).</li>
<li>Ba yếu tố: <strong>lao động</strong> (di chuyển được giữa hai ngành), <strong>vốn</strong> (đặc thù cho ngành chế tạo) và <strong>đất đai</strong> (đặc thù cho ngành lương thực).</li>
<li><strong>Năng suất cận biên giảm dần</strong>: thêm lao động vào một lượng vốn (hay đất) cố định làm sản lượng tăng ngày càng ít, nên sản phẩm cận biên của lao động (MPL) giảm khi một ngành thuê thêm người.</li>
</ul>
<h3>Lao động được phân bổ thế nào</h3>
<p>Doanh nghiệp thuê lao động cho tới khi giá trị sản phẩm cận biên bằng tiền lương. Vì lao động di chuyển tự do, tiền lương ở hai ngành bằng nhau:</p>
<pre><code>w = P(M) x MPL(M) = P(F) x MPL(F)</code></pre>
<p>Nếu P(M) tăng 10% còn P(F) không đổi, ngành chế tạo muốn thuê thêm; lao động chuyển từ lương thực sang chế tạo cho tới khi tiền lương lại bằng nhau. Tiền lương tăng, nhưng tăng <strong>ít hơn 10%</strong>, vì MPL giảm ở ngành đang mở rộng.</p>
<h3>Minh hoạ bằng số (mô hình giả định)</h3>
<pre><code>Q(M) = K^0,5 x L(M)^0,5      Q(F) = T^0,5 x L(F)^0,5
K = 100 (vốn), T = 100 (đất), tổng lao động L = 200
Thu nhập trên một đơn vị: w = P x MPL;  vốn = P(M) x MPK;  đất = P(F) x MPT</code></pre>
<table>
<tr><th></th><th>Trước: P(M) = P(F) = 1</th><th>Sau: P(M) = 1,1</th><th>Thay đổi</th></tr>
<tr><td>Lao động ở M / ở F</td><td>100 / 100</td><td>109,5 / 90,5</td><td>lao động chuyển sang M</td></tr>
<tr><td>Tiền lương w</td><td>0,5000</td><td>0,5256</td><td>+5,1%</td></tr>
<tr><td>Thu nhập của vốn</td><td>0,5000</td><td>0,5755</td><td>+15,1%</td></tr>
<tr><td>Địa tô</td><td>0,5000</td><td>0,4757</td><td>−4,9%</td></tr>
</table>
<p>Xếp hạng các thay đổi: vốn +15,1% &gt; P(M) +10% &gt; tiền lương +5,1% &gt; P(F) 0% &gt; đất −4,9%.</p>
<ul>
<li><strong>Chủ vốn</strong> (yếu tố đặc thù của ngành có giá tăng) được lợi theo giá trị thực — thu nhập của họ tăng nhanh hơn mọi mức giá.</li>
<li><strong>Chủ đất</strong> (yếu tố đặc thù của ngành kia) bị thiệt theo giá trị thực.</li>
<li><strong>Người lao động</strong> không rõ ràng: tiền lương thực giảm 4,4% tính theo hàng chế tạo nhưng tăng 5,1% tính theo lương thực. Họ được hay mất tuỳ vào họ tiêu dùng gì.</li>
</ul>
<h3>Thương mại, người được và người mất</h3>
<p>Mở cửa thương mại làm tăng giá tương đối của hàng xuất khẩu. Vì vậy các yếu tố đặc thù của <strong>ngành xuất khẩu được lợi</strong>, các yếu tố đặc thù của <strong>ngành cạnh tranh với hàng nhập khẩu bị thiệt</strong>, còn yếu tố di chuyển được có thể được hoặc mất. Dù vậy quốc gia nói chung vẫn được lợi: thương mại mở rộng khả năng tiêu dùng, nên phần được của người thắng lớn hơn phần mất của người thua và về nguyên tắc có thể bù đắp cho họ.</p>
<h3>Vì sao điều này quan trọng với chính sách</h3>
<p>Người bị thiệt từ thương mại thường tập trung ở một số ngành và địa phương, và họ tổ chức lại để lên tiếng; còn lợi ích thì trải mỏng trên người tiêu dùng. Đó là gốc rễ của kinh tế chính trị về bảo hộ (Phần 4). Các nhà kinh tế thường khuyến nghị hỗ trợ người bị thiệt — đào tạo lại, bảo hiểm xã hội, trợ giúp điều chỉnh — thay vì ngăn cản thương mại.</p>
<p><strong>Di chuyển lao động quốc tế</strong> cũng phân tích được theo cách này: khi lao động chuyển từ nước lương thấp sang nước lương cao, tiền lương hội tụ và sản lượng thế giới tăng, nhưng người lao động ở nước đến và chủ các yếu tố khác ở nước đi có thể bị thiệt.</p>
<div class="callout"><span class="badge">Ngắn hạn và dài hạn</span> Mô hình yếu tố đặc thù là góc nhìn ngắn hạn: vốn và đất bị “kẹt” trong ngành của chúng. Theo thời gian các yếu tố dịch chuyển giữa các ngành — đó là góc nhìn dài hạn của bài 2.2.</div>`,
  ]]);

const c22 = doc('eco201-2-2-heckscher-ohlin', '2.2 — The Heckscher–Ohlin model: resources, Stolper–Samuelson and the Leontief paradox|||2.2 — Mô hình Heckscher–Ohlin: nguồn lực, định lý Stolper–Samuelson và nghịch lý Leontief',
  'Mức dồi dào yếu tố (tương đối) và mức độ sử dụng yếu tố, định lý Heckscher–Ohlin, định lý Stolper–Samuelson và hiệu ứng phóng đại (ví dụ số giả định), định lý Rybczynski, cân bằng giá yếu tố, nghịch lý Leontief và các bằng chứng thực nghiệm sau này.',
  [[
    `<span class="eyebrow">ECO201 · Part 2 · Lesson 2.2</span>
<h2>The Heckscher–Ohlin model: resources, Stolper–Samuelson and the Leontief paradox</h2>
<p class="lead">Eli Heckscher and Bertil Ohlin explained trade by differences in <strong>resources</strong>: countries differ in their endowments of factors, and goods differ in the factors they use. All factors are mobile between sectors in the long run.</p>
<h3>Two key definitions</h3>
<ul>
<li><strong>Factor abundance is relative.</strong> Home has 300 workers and 100 units of capital (L/K = 3); Foreign has 600 workers and 400 units of capital (L/K = 1.5). Home is <em>labour-abundant</em> even though it has fewer workers in total, because it has more labour per unit of capital.</li>
<li><strong>Factor intensity</strong> compares goods: garments are <em>labour-intensive</em> if, at any given factor prices, they use more labour per unit of capital than machinery does.</li>
</ul>
<h3>The Heckscher–Ohlin theorem</h3>
<p>A country exports the good that uses its <strong>abundant factor intensively</strong> and imports the good that uses its scarce factor intensively. Labour-abundant Home has a lower autarky relative price of garments, so it exports garments; capital-abundant Foreign exports machinery. Trade makes relative goods prices converge.</p>
<h3>The Stolper–Samuelson theorem and the magnification effect</h3>
<p>A rise in the relative price of a good raises the real return of the factor used intensively in that good and lowers the real return of the other factor. Illustration with fixed input requirements (assumed): one garment needs 3 hours of labour and 1 unit of capital; one machine needs 1 hour of labour and 3 units of capital. With competition, price equals unit cost:</p>
<pre><code>P(G) = 3w + r        P(M) = w + 3r
Before: P(G) = 8, P(M) = 8   -&gt;  w = 2.00, r = 2.00
After:  P(G) = 10 (+25%), P(M) = 8 (unchanged)
        3w + r = 10 and w + 3r = 8  -&gt;  w = 2.75 (+37.5%), r = 1.75 (−12.5%)
Magnification: +37.5% (wage) &gt; +25% (P garments) &gt; 0% (P machinery) &gt; −12.5% (capital)</code></pre>
<p>Workers gain in terms of both goods; capital owners lose in terms of both. Unlike the specific factors model, the effect depends on <em>which factor</em> you own, not which sector you work in. Implication: in a labour-abundant country, trade raises the real income of labour and lowers that of capital; in a capital-abundant country, the reverse.</p>
<h3>Two more results</h3>
<ul>
<li><strong>Rybczynski theorem:</strong> at constant goods prices, an increase in one factor raises the output of the good that uses it intensively more than proportionally and reduces the output of the other good — a <em>biased</em> expansion of the PPF (used in lesson 3.1).</li>
<li><strong>Factor price equalisation:</strong> with free trade, identical technology and both goods produced in both countries, trade equalises wages and capital returns across countries. In reality it does not, because technologies differ, trade barriers and transport costs exist, and countries do not all produce the same goods.</li>
</ul>
<h3>Evidence</h3>
<ul>
<li><strong>The Leontief paradox:</strong> Wassily Leontief (1953), using U.S. data for 1947, found that U.S. exports were <em>less</em> capital-intensive than U.S. imports — the opposite of what a capital-abundant country should show. Proposed explanations: U.S. exports are intensive in skilled labour and innovation, natural resources matter, and technologies differ across countries.</li>
<li><strong>Factor-content tests:</strong> later studies (for example Trefler, 1995) found far less trade in factor services than the model predicts — “the case of the missing trade”; allowing for technology differences between countries improves the fit considerably.</li>
<li><strong>North–South trade</strong> fits the model better: high-income economies export skill-intensive goods, developing economies export labour-intensive goods. Research on rising wage inequality in rich countries generally finds trade to be one factor among several, with technological change at least as important.</li>
</ul>
<div class="callout"><span class="badge">Remember</span> Heckscher–Ohlin predicts <em>what</em> a country exports from its relative factor endowments; Stolper–Samuelson predicts <em>who</em> gains inside the country — owners of the abundant factor.</div>`,
    `<span class="eyebrow">ECO201 · Phần 2 · Bài 2.2</span>
<h2>Mô hình Heckscher–Ohlin: nguồn lực, định lý Stolper–Samuelson và nghịch lý Leontief</h2>
<p class="lead">Eli Heckscher và Bertil Ohlin giải thích thương mại bằng khác biệt về <strong>nguồn lực</strong>: các nước khác nhau về mức sẵn có các yếu tố sản xuất, còn các hàng hoá khác nhau về yếu tố mà chúng sử dụng. Trong dài hạn mọi yếu tố đều di chuyển được giữa các ngành.</p>
<h3>Hai định nghĩa then chốt</h3>
<ul>
<li><strong>Mức dồi dào yếu tố là khái niệm tương đối.</strong> Home có 300 lao động và 100 đơn vị vốn (L/K = 3); Foreign có 600 lao động và 400 đơn vị vốn (L/K = 1,5). Home là nước <em>dồi dào lao động</em> dù có ít lao động hơn về tuyệt đối, vì Home có nhiều lao động hơn trên mỗi đơn vị vốn.</li>
<li><strong>Mức độ sử dụng yếu tố</strong> so sánh giữa các hàng hoá: may mặc là hàng <em>sử dụng nhiều lao động</em> nếu, ở bất kỳ mức giá yếu tố nào, nó dùng nhiều lao động trên mỗi đơn vị vốn hơn so với máy móc.</li>
</ul>
<h3>Định lý Heckscher–Ohlin</h3>
<p>Một nước xuất khẩu hàng hoá sử dụng nhiều <strong>yếu tố mà nước đó dồi dào</strong> và nhập khẩu hàng hoá sử dụng nhiều yếu tố mà nước đó khan hiếm. Home dồi dào lao động có giá tương đối của hàng may mặc thấp hơn khi tự cung tự cấp, nên Home xuất khẩu may mặc; Foreign dồi dào vốn xuất khẩu máy móc. Thương mại làm giá tương đối của hàng hoá hội tụ.</p>
<h3>Định lý Stolper–Samuelson và hiệu ứng phóng đại</h3>
<p>Khi giá tương đối của một hàng hoá tăng, thu nhập thực của yếu tố được sử dụng nhiều trong hàng đó tăng, còn thu nhập thực của yếu tố kia giảm. Minh hoạ với hệ số đầu vào cố định (giả định): một sản phẩm may mặc cần 3 giờ lao động và 1 đơn vị vốn; một máy cần 1 giờ lao động và 3 đơn vị vốn. Khi cạnh tranh, giá bằng chi phí đơn vị:</p>
<pre><code>P(G) = 3w + r        P(M) = w + 3r
Trước: P(G) = 8, P(M) = 8   -&gt;  w = 2,00, r = 2,00
Sau:   P(G) = 10 (+25%), P(M) = 8 (không đổi)
       3w + r = 10 và w + 3r = 8  -&gt;  w = 2,75 (+37,5%), r = 1,75 (−12,5%)
Phóng đại: +37,5% (lương) &gt; +25% (giá may mặc) &gt; 0% (giá máy móc) &gt; −12,5% (vốn)</code></pre>
<p>Người lao động được lợi tính theo cả hai hàng; chủ vốn bị thiệt tính theo cả hai hàng. Khác với mô hình yếu tố đặc thù, tác động phụ thuộc vào việc bạn sở hữu <em>yếu tố nào</em>, không phụ thuộc bạn làm việc ở ngành nào. Hàm ý: ở nước dồi dào lao động, thương mại làm tăng thu nhập thực của lao động và giảm thu nhập thực của vốn; ở nước dồi dào vốn thì ngược lại.</p>
<h3>Hai kết quả nữa</h3>
<ul>
<li><strong>Định lý Rybczynski:</strong> với giá hàng hoá không đổi, khi một yếu tố tăng thì sản lượng của hàng sử dụng nhiều yếu tố đó tăng nhiều hơn tỷ lệ, còn sản lượng hàng kia giảm — một sự mở rộng <em>thiên lệch</em> của đường PPF (dùng ở bài 3.1).</li>
<li><strong>Cân bằng giá yếu tố:</strong> với thương mại tự do, công nghệ giống nhau và cả hai nước đều sản xuất cả hai hàng, thương mại làm tiền lương và thu nhập của vốn bằng nhau giữa các nước. Thực tế không như vậy, vì công nghệ khác nhau, có rào cản thương mại và chi phí vận tải, và các nước không sản xuất cùng những hàng hoá.</li>
</ul>
<h3>Bằng chứng thực nghiệm</h3>
<ul>
<li><strong>Nghịch lý Leontief:</strong> Wassily Leontief (1953), dùng số liệu của Mỹ năm 1947, thấy hàng xuất khẩu của Mỹ sử dụng vốn <em>ít</em> hơn hàng nhập khẩu — ngược với điều một nước dồi dào vốn lẽ ra phải thể hiện. Các cách giải thích được đưa ra: hàng xuất khẩu của Mỹ dùng nhiều lao động kỹ năng và đổi mới sáng tạo, tài nguyên thiên nhiên có vai trò, và công nghệ khác nhau giữa các nước.</li>
<li><strong>Kiểm định hàm lượng yếu tố:</strong> các nghiên cứu sau này (ví dụ Trefler, 1995) thấy lượng “dịch vụ yếu tố” được trao đổi ít hơn nhiều so với dự báo của mô hình — “trường hợp thương mại bị thiếu”; khi cho phép công nghệ khác nhau giữa các nước, mức khớp cải thiện đáng kể.</li>
<li><strong>Thương mại Bắc–Nam</strong> khớp với mô hình hơn: các nền kinh tế thu nhập cao xuất khẩu hàng dùng nhiều lao động kỹ năng, các nền kinh tế đang phát triển xuất khẩu hàng dùng nhiều lao động. Các nghiên cứu về bất bình đẳng tiền lương gia tăng ở nước giàu thường thấy thương mại là một nhân tố trong nhiều nhân tố, còn thay đổi công nghệ ít nhất cũng quan trọng ngang như vậy.</li>
</ul>
<div class="callout"><span class="badge">Ghi nhớ</span> Heckscher–Ohlin dự báo một nước xuất khẩu <em>cái gì</em> từ mức dồi dào tương đối của các yếu tố; Stolper–Samuelson dự báo <em>ai</em> được lợi trong nước — chủ sở hữu yếu tố dồi dào.</div>`,
  ]]);

const q2 = quiz('eco201-quiz-2', 'Quiz 2 — Resources and income distribution|||Quiz 2 — Nguồn lực và phân phối thu nhập', [
  { id: 'q1', question: 'In a two-good, two-factor (labour and capital) model, the relative price of the labour-intensive good rises. According to the Stolper–Samuelson theorem…|||Trong mô hình hai hàng hoá, hai yếu tố (lao động và vốn), giá tương đối của hàng sử dụng nhiều lao động tăng. Theo định lý Stolper–Samuelson…', options: ['both the real wage and the real return to capital rise|||cả tiền lương thực và thu nhập thực của vốn đều tăng', 'the real wage rises and the real return to capital falls|||tiền lương thực tăng và thu nhập thực của vốn giảm', 'the real wage falls and the real return to capital rises|||tiền lương thực giảm và thu nhập thực của vốn tăng', 'factor prices do not change because goods are traded|||giá yếu tố không đổi vì hàng hoá được trao đổi'], correctIndex: 1, explanation: 'The factor used intensively in the good whose price rises gains in real terms (magnification effect); the other factor loses.|||Yếu tố được dùng nhiều trong hàng có giá tăng được lợi theo giá trị thực (hiệu ứng phóng đại); yếu tố kia bị thiệt.' },
  { id: 'q2', question: 'In the specific factors model, the price of manufactures rises by 10% and the price of food is unchanged. Labour is mobile. The nominal wage…|||Trong mô hình yếu tố đặc thù, giá hàng chế tạo tăng 10%, giá lương thực không đổi. Lao động di chuyển tự do. Tiền lương danh nghĩa…', options: ['rises by exactly 10%|||tăng đúng 10%', 'rises by more than 10%|||tăng hơn 10%', 'falls|||giảm', 'rises by less than 10%|||tăng ít hơn 10%'], correctIndex: 3, explanation: 'Labour moves into manufactures, where its marginal product falls, so the wage rises by less than the price: real wages fall in terms of manufactures and rise in terms of food.|||Lao động chuyển sang ngành chế tạo, nơi sản phẩm cận biên giảm dần, nên tiền lương tăng ít hơn giá: lương thực tế giảm tính theo hàng chế tạo và tăng tính theo lương thực.' },
  { id: 'q3', question: 'What did Leontief find in his 1953 study of U.S. trade?|||Leontief đã phát hiện điều gì trong nghiên cứu năm 1953 về thương mại của Mỹ?', options: ['U.S. exports were less capital-intensive than U.S. imports|||Hàng xuất khẩu của Mỹ sử dụng ít vốn hơn hàng nhập khẩu', 'U.S. exports were more capital-intensive than imports, as predicted|||Hàng xuất khẩu của Mỹ sử dụng nhiều vốn hơn hàng nhập khẩu, đúng như dự báo', 'the United States did not trade with labour-abundant countries|||Mỹ không buôn bán với các nước dồi dào lao động', 'factor prices had fully equalised across countries|||giá yếu tố đã hoàn toàn cân bằng giữa các nước'], correctIndex: 0, explanation: 'This result contradicted the Heckscher–Ohlin prediction for a capital-abundant country — hence the Leontief paradox.|||Kết quả này trái với dự báo Heckscher–Ohlin cho một nước dồi dào vốn — vì thế gọi là nghịch lý Leontief.' },
]);

const c31 = doc('eco201-3-1-standard-trade-model', '3.1 — The standard trade model: relative supply, relative demand and the terms of trade|||3.1 — Mô hình thương mại chuẩn: cung tương đối, cầu tương đối và tỷ lệ trao đổi',
  'Mô hình thương mại chuẩn: đường PPF cong, đường đồng giá trị, đường bàng quan, cung tương đối RS và cầu tương đối RD thế giới, tỷ lệ trao đổi (ToT) và phúc lợi, tăng trưởng thiên lệch về xuất khẩu hay nhập khẩu, tăng trưởng bần cùng hoá; ví dụ số giả định.',
  [[
    `<span class="eyebrow">ECO201 · Part 3 · Lesson 3.1</span>
<h2>The standard trade model: relative supply, relative demand and the terms of trade</h2>
<p class="lead">Ricardo, specific factors and Heckscher–Ohlin are special cases of one general framework. The <strong>standard trade model</strong> keeps only what they share: each country has a production possibility frontier, and trade is driven by differences in relative supply.</p>
<h3>Building blocks</h3>
<ul>
<li><strong>A bowed-out PPF.</strong> Opportunity costs rise as a country produces more of one good (factors are not equally suited to both).</li>
<li><strong>Production.</strong> At relative price P(C)/P(F), the economy produces where the value of output P(C) x Q(C) + P(F) x Q(F) is highest — where an <strong>isovalue line</strong> is tangent to the PPF. A higher relative price of cloth moves production toward cloth.</li>
<li><strong>Consumption.</strong> The economy can consume anywhere on the isovalue line through its production point; it chooses the point on the highest <strong>indifference curve</strong>. With trade, production and consumption points differ: the gap is exports and imports.</li>
<li><strong>Welfare.</strong> A rise in the relative price of the good a country exports makes it better off; a rise in the relative price of what it imports makes it worse off.</li>
</ul>
<h3>World equilibrium: RS and RD</h3>
<p>World <strong>relative supply</strong> of cloth (RS) slopes upward in P(C)/P(F); world <strong>relative demand</strong> (RD) slopes downward. Their intersection gives the world relative price. An illustration with assumed functions:</p>
<pre><code>RD:  Q(C) / Q(F) = 6 / P          RS:  Q(C) / Q(F) = 1.5 x P      (P = P(C)/P(F))
Equilibrium:  6 / P = 1.5 P  -&gt;  P^2 = 4  -&gt;  P = 2, relative quantity = 3
Growth biased toward cloth shifts RS to 2.4 x P:
              6 / P = 2.4 P  -&gt;  P = √2.5 = 1.5811 (−20.9%), relative quantity = 3.79</code></pre>
<h3>The terms of trade</h3>
<p>A country’s <strong>terms of trade (ToT)</strong> are the price of its exports relative to the price of its imports, usually measured with price indices:</p>
<pre><code>ToT = export price index / import price index x 100
Export prices rise 100 -&gt; 105, import prices rise 100 -&gt; 110
ToT = 105 / 110 x 100 = 95.5   -&gt;  a 4.5% deterioration
First-order approximation of the welfare effect:
  % change in ToT x share of imports in income
  Assume imports are 30% of income (and trade is initially balanced):
  −4.5% x 30% ≈ −1.4% of income</code></pre>
<p>A deterioration means each unit of exports buys fewer imports. In the RS/RD example above, the country exporting cloth suffers a ToT loss of about 21% after cloth-biased growth.</p>
<h3>Economic growth and the terms of trade</h3>
<ul>
<li><strong>Export-biased growth</strong> (the PPF expands mainly toward the export good) raises relative supply of that good, lowers its world price and <em>worsens</em> the growing country’s terms of trade — while improving its partners’.</li>
<li><strong>Import-biased growth</strong> (the PPF expands toward the import-competing good) <em>improves</em> the grower’s terms of trade and worsens its partners’.</li>
<li>In theory, export-biased growth could worsen the terms of trade so much that the country ends up worse off — <strong>immiserizing growth</strong> (Bhagwati). It requires special conditions and is considered rare. For most countries, growth abroad mostly changes <em>how much</em> they gain from trade, not <em>whether</em> they gain.</li>
</ul>
<h3>A preview of trade policy</h3>
<p>The same framework shows why a <strong>large</strong> country’s import tariff can improve its terms of trade (it reduces world demand for the imported good and lowers its world price), while an export subsidy worsens them (it pushes more of the export good onto world markets). Part 4 works through these effects in partial equilibrium.</p>
<div class="callout"><span class="badge">Key lesson</span> For a trading country, what matters is not only how much it produces but at what price it can exchange exports for imports. The terms of trade link growth in one country to welfare in others.</div>`,
    `<span class="eyebrow">ECO201 · Phần 3 · Bài 3.1</span>
<h2>Mô hình thương mại chuẩn: cung tương đối, cầu tương đối và tỷ lệ trao đổi</h2>
<p class="lead">Ricardo, yếu tố đặc thù và Heckscher–Ohlin đều là những trường hợp riêng của một khung tổng quát. <strong>Mô hình thương mại chuẩn</strong> chỉ giữ phần chung của chúng: mỗi nước có một đường giới hạn khả năng sản xuất, và thương mại phát sinh từ khác biệt về cung tương đối.</p>
<h3>Các khối xây dựng</h3>
<ul>
<li><strong>Đường PPF cong ra ngoài.</strong> Chi phí cơ hội tăng dần khi một nước sản xuất nhiều hơn một hàng (các yếu tố không phù hợp như nhau cho cả hai hàng).</li>
<li><strong>Sản xuất.</strong> Ở giá tương đối P(C)/P(F), nền kinh tế sản xuất tại điểm có giá trị sản lượng P(C) x Q(C) + P(F) x Q(F) lớn nhất — nơi một <strong>đường đồng giá trị</strong> tiếp xúc với PPF. Giá tương đối của vải cao hơn đẩy sản xuất về phía vải.</li>
<li><strong>Tiêu dùng.</strong> Nền kinh tế có thể tiêu dùng ở bất kỳ điểm nào trên đường đồng giá trị đi qua điểm sản xuất; nó chọn điểm nằm trên <strong>đường bàng quan</strong> cao nhất. Khi có thương mại, điểm sản xuất và điểm tiêu dùng khác nhau: phần chênh lệch chính là xuất khẩu và nhập khẩu.</li>
<li><strong>Phúc lợi.</strong> Giá tương đối của hàng một nước xuất khẩu tăng thì nước đó khá lên; giá tương đối của hàng nước đó nhập khẩu tăng thì nước đó thiệt đi.</li>
</ul>
<h3>Cân bằng thế giới: RS và RD</h3>
<p><strong>Cung tương đối</strong> thế giới của vải (RS) dốc lên theo P(C)/P(F); <strong>cầu tương đối</strong> thế giới (RD) dốc xuống. Giao điểm của chúng cho giá tương đối thế giới. Minh hoạ với các hàm giả định:</p>
<pre><code>RD:  Q(C) / Q(F) = 6 / P          RS:  Q(C) / Q(F) = 1,5 x P      (P = P(C)/P(F))
Cân bằng:  6 / P = 1,5 P  -&gt;  P^2 = 4  -&gt;  P = 2, lượng tương đối = 3
Tăng trưởng thiên lệch về vải làm RS dịch thành 2,4 x P:
           6 / P = 2,4 P  -&gt;  P = √2,5 = 1,5811 (−20,9%), lượng tương đối = 3,79</code></pre>
<h3>Tỷ lệ trao đổi</h3>
<p><strong>Tỷ lệ trao đổi (ToT)</strong> của một nước là giá hàng xuất khẩu so với giá hàng nhập khẩu của nước đó, thường đo bằng chỉ số giá:</p>
<pre><code>ToT = chỉ số giá xuất khẩu / chỉ số giá nhập khẩu x 100
Giá xuất khẩu tăng 100 -&gt; 105, giá nhập khẩu tăng 100 -&gt; 110
ToT = 105 / 110 x 100 = 95,5   -&gt;  xấu đi 4,5%
Xấp xỉ bậc một của tác động phúc lợi:
  % thay đổi ToT x tỷ trọng nhập khẩu trong thu nhập
  Giả định nhập khẩu bằng 30% thu nhập (thương mại cân bằng ban đầu):
  −4,5% x 30% ≈ −1,4% thu nhập</code></pre>
<p>ToT xấu đi nghĩa là mỗi đơn vị hàng xuất khẩu mua được ít hàng nhập khẩu hơn. Trong ví dụ RS/RD ở trên, nước xuất khẩu vải chịu mức giảm ToT khoảng 21% sau đợt tăng trưởng thiên lệch về vải.</p>
<h3>Tăng trưởng kinh tế và tỷ lệ trao đổi</h3>
<ul>
<li><strong>Tăng trưởng thiên lệch về xuất khẩu</strong> (PPF mở rộng chủ yếu về phía hàng xuất khẩu) làm tăng cung tương đối của hàng đó, hạ giá thế giới của nó và làm <em>xấu đi</em> tỷ lệ trao đổi của nước đang tăng trưởng — đồng thời cải thiện tỷ lệ trao đổi của các đối tác.</li>
<li><strong>Tăng trưởng thiên lệch về nhập khẩu</strong> (PPF mở rộng về phía hàng cạnh tranh với nhập khẩu) <em>cải thiện</em> tỷ lệ trao đổi của nước tăng trưởng và làm xấu đi tỷ lệ trao đổi của đối tác.</li>
<li>Về lý thuyết, tăng trưởng thiên lệch về xuất khẩu có thể làm tỷ lệ trao đổi xấu đi tới mức nước đó rốt cuộc thiệt hơn — <strong>tăng trưởng bần cùng hoá</strong> (Bhagwati). Điều này đòi hỏi những điều kiện đặc biệt và được coi là hiếm. Với phần lớn các nước, tăng trưởng ở nước ngoài chủ yếu làm thay đổi họ được lợi <em>bao nhiêu</em> từ thương mại, chứ không phải <em>có</em> được lợi hay không.</li>
</ul>
<h3>Nhìn trước chính sách thương mại</h3>
<p>Cùng khung phân tích này cho thấy vì sao thuế nhập khẩu của một nước <strong>lớn</strong> có thể cải thiện tỷ lệ trao đổi của nước đó (nó làm giảm cầu thế giới về hàng nhập khẩu và hạ giá thế giới của hàng ấy), còn trợ cấp xuất khẩu làm tỷ lệ trao đổi xấu đi (nó đẩy thêm hàng xuất khẩu ra thị trường thế giới). Phần 4 phân tích chi tiết các tác động này bằng mô hình cân bằng bộ phận.</p>
<div class="callout"><span class="badge">Bài học chính</span> Với một nước tham gia thương mại, điều quan trọng không chỉ là sản xuất được bao nhiêu mà còn là đổi hàng xuất khẩu lấy hàng nhập khẩu ở mức giá nào. Tỷ lệ trao đổi nối tăng trưởng ở nước này với phúc lợi ở nước khác.</div>`,
  ]]);

const c32 = doc('eco201-3-2-scale-economies', '3.2 — Economies of scale, imperfect competition and intra-industry trade|||3.2 — Lợi thế kinh tế nhờ quy mô, cạnh tranh không hoàn hảo và thương mại nội ngành',
  'Lợi thế kinh tế nhờ quy mô bên ngoài và bên trong, cụm ngành và vai trò của lịch sử, cạnh tranh độc quyền và quy mô thị trường (mô hình Krugman, ví dụ chi phí bình quân), thương mại nội ngành và chỉ số Grubel–Lloyd, mô hình doanh nghiệp không đồng nhất Melitz, bán phá giá và doanh nghiệp đa quốc gia.',
  [[
    `<span class="eyebrow">ECO201 · Part 3 · Lesson 3.2</span>
<h2>Economies of scale, imperfect competition and intra-industry trade</h2>
<p class="lead">A large share of world trade takes place between similar high-income economies, often in similar products — cars exchanged for cars, machinery for machinery. Comparative advantage cannot explain this. <strong>Economies of scale</strong> can: even identical countries gain by concentrating production and trading.</p>
<h3>External versus internal economies of scale</h3>
<table>
<tr><th></th><th>External economies</th><th>Internal economies</th></tr>
<tr><td>Cost per unit falls with…</td><td>the size of the <em>industry</em> in a location</td><td>the size of the <em>firm</em></td></tr>
<tr><td>Sources</td><td>specialised suppliers, a pooled skilled labour market, knowledge spillovers</td><td>large fixed costs (R&amp;D, plants, brands)</td></tr>
<tr><td>Market structure</td><td>many small firms, can stay competitive</td><td>few large firms, imperfect competition</td></tr>
<tr><td>Trade implication</td><td>industries cluster (e.g. Silicon Valley); the pattern can depend on history and first-mover advantage</td><td>intra-industry trade in differentiated products</td></tr>
</table>
<p>With external economies, a country may keep an industry simply because it started first, even if a newcomer could eventually produce more cheaply — so the location of clusters is partly an accident of history, and trade gains are not guaranteed for every country.</p>
<h3>Monopolistic competition and market size</h3>
<p>With internal economies, each firm sells a <strong>differentiated</strong> product and faces a fixed cost F plus a constant marginal cost c:</p>
<pre><code>Average cost  AC = F / Q + c        Illustration (assumed): F = 100, c = 2
Q =  50  -&gt;  AC = 100 / 50  + 2 = 4.00
Q = 100  -&gt;  AC = 100 / 100 + 2 = 3.00
Q = 200  -&gt;  AC = 100 / 200 + 2 = 2.50
Q = 400  -&gt;  AC = 100 / 400 + 2 = 2.25</code></pre>
<p>A small national market supports only a few firms, each producing at high average cost. Integrating markets through trade (Krugman, 1979; the textbook monopolistic competition model) creates a larger market that supports <strong>more varieties</strong> while each firm produces <strong>more output at lower average cost</strong>. Consumers gain from lower prices and greater variety; competition also becomes tougher. In Krugman’s 1980 version with CES demand, firm size stays the same and the gain comes entirely from more varieties.</p>
<h3>Intra-industry trade and the Grubel–Lloyd index</h3>
<pre><code>GL = 1 − |X − M| / (X + M)          X = exports, M = imports of one industry
Exports 60, imports 40  -&gt;  GL = 1 − 20 / 100 = 0.8   (mostly two-way trade)
Exports 90, imports 10  -&gt;  GL = 1 − 80 / 100 = 0.2   (mostly one-way trade)</code></pre>
<p>Intra-industry trade is high between economies with similar income and factor endowments, and in sophisticated differentiated manufactures; it is low in industries shaped by comparative advantage, such as many primary products.</p>
<h3>Firms are not all alike: the Melitz model</h3>
<p>Marc Melitz (2003) added <strong>productivity differences between firms</strong> in the same industry. Because exporting involves extra fixed and variable costs, only the <strong>most productive firms export</strong>. When trade costs fall, the least productive firms shrink or exit, the most productive expand and start exporting, and <strong>average industry productivity rises</strong> — a gain from trade that the older models missed. Firm-level data confirm that exporters tend to be larger and more productive than non-exporters.</p>
<h3>Two related topics</h3>
<ul>
<li><strong>Dumping</strong> is a form of price discrimination: selling a product abroad for less than at home (or below cost). It is possible when firms have market power and markets are segmented. Anti-dumping duties are discussed in Part 4.</li>
<li><strong>Multinationals and outsourcing:</strong> firms invest abroad horizontally (to serve a foreign market locally) or vertically (to split the production chain across countries) — the basis of global value chains.</li>
</ul>
<div class="callout"><span class="badge">Big picture</span> Three sources of gains from trade: comparative advantage (inter-industry trade), economies of scale with product variety (intra-industry trade), and the reallocation of output toward more productive firms.</div>`,
    `<span class="eyebrow">ECO201 · Phần 3 · Bài 3.2</span>
<h2>Lợi thế kinh tế nhờ quy mô, cạnh tranh không hoàn hảo và thương mại nội ngành</h2>
<p class="lead">Một phần lớn thương mại thế giới diễn ra giữa các nền kinh tế thu nhập cao giống nhau, thường ở các sản phẩm giống nhau — ô tô đổi lấy ô tô, máy móc đổi lấy máy móc. Lợi thế so sánh không giải thích được điều này. <strong>Lợi thế kinh tế nhờ quy mô</strong> thì giải thích được: ngay cả các nước giống hệt nhau cũng được lợi khi tập trung sản xuất và trao đổi.</p>
<h3>Lợi thế kinh tế nhờ quy mô bên ngoài và bên trong</h3>
<table>
<tr><th></th><th>Bên ngoài</th><th>Bên trong</th></tr>
<tr><td>Chi phí đơn vị giảm theo…</td><td>quy mô của <em>ngành</em> tại một địa điểm</td><td>quy mô của <em>doanh nghiệp</em></td></tr>
<tr><td>Nguồn gốc</td><td>nhà cung ứng chuyên môn hoá, thị trường lao động kỹ năng tập trung, lan toả tri thức</td><td>chi phí cố định lớn (R&amp;D, nhà máy, thương hiệu)</td></tr>
<tr><td>Cấu trúc thị trường</td><td>nhiều doanh nghiệp nhỏ, có thể vẫn cạnh tranh</td><td>ít doanh nghiệp lớn, cạnh tranh không hoàn hảo</td></tr>
<tr><td>Hàm ý thương mại</td><td>các ngành tụ lại thành cụm (ví dụ Thung lũng Silicon); mô hình thương mại có thể phụ thuộc lịch sử và lợi thế người đi trước</td><td>thương mại nội ngành các sản phẩm khác biệt hoá</td></tr>
</table>
<p>Với lợi thế quy mô bên ngoài, một nước có thể giữ được một ngành chỉ vì đã bắt đầu trước, dù một nước đến sau rốt cuộc có thể sản xuất rẻ hơn — nên vị trí của các cụm ngành một phần là ngẫu nhiên của lịch sử, và lợi ích thương mại không được bảo đảm cho mọi nước.</p>
<h3>Cạnh tranh độc quyền và quy mô thị trường</h3>
<p>Với lợi thế quy mô bên trong, mỗi doanh nghiệp bán một sản phẩm <strong>khác biệt hoá</strong> và chịu chi phí cố định F cộng chi phí cận biên không đổi c:</p>
<pre><code>Chi phí bình quân  AC = F / Q + c        Minh hoạ (giả định): F = 100, c = 2
Q =  50  -&gt;  AC = 100 / 50  + 2 = 4,00
Q = 100  -&gt;  AC = 100 / 100 + 2 = 3,00
Q = 200  -&gt;  AC = 100 / 200 + 2 = 2,50
Q = 400  -&gt;  AC = 100 / 400 + 2 = 2,25</code></pre>
<p>Một thị trường quốc gia nhỏ chỉ nuôi được vài doanh nghiệp, mỗi doanh nghiệp sản xuất với chi phí bình quân cao. Hội nhập thị trường nhờ thương mại (Krugman, 1979; mô hình cạnh tranh độc quyền trong giáo trình) tạo ra thị trường lớn hơn, nuôi được <strong>nhiều chủng loại hơn</strong> trong khi mỗi doanh nghiệp sản xuất <strong>nhiều hơn với chi phí bình quân thấp hơn</strong>. Người tiêu dùng được lợi nhờ giá thấp hơn và đa dạng hơn; cạnh tranh cũng gay gắt hơn. Trong phiên bản năm 1980 của Krugman với cầu CES, quy mô mỗi doanh nghiệp không đổi và lợi ích đến hoàn toàn từ số chủng loại tăng lên.</p>
<h3>Thương mại nội ngành và chỉ số Grubel–Lloyd</h3>
<pre><code>GL = 1 − |X − M| / (X + M)          X = xuất khẩu, M = nhập khẩu của một ngành
Xuất 60, nhập 40  -&gt;  GL = 1 − 20 / 100 = 0,8   (chủ yếu là trao đổi hai chiều)
Xuất 90, nhập 10  -&gt;  GL = 1 − 80 / 100 = 0,2   (chủ yếu là trao đổi một chiều)</code></pre>
<p>Thương mại nội ngành cao giữa các nền kinh tế có thu nhập và mức sẵn có yếu tố tương tự nhau, và ở các mặt hàng chế tạo tinh vi, khác biệt hoá; nó thấp ở những ngành do lợi thế so sánh chi phối, như nhiều sản phẩm sơ cấp.</p>
<h3>Doanh nghiệp không giống nhau: mô hình Melitz</h3>
<p>Marc Melitz (2003) đưa thêm <strong>khác biệt năng suất giữa các doanh nghiệp</strong> trong cùng một ngành. Vì xuất khẩu kéo theo thêm chi phí cố định và chi phí biến đổi, chỉ <strong>những doanh nghiệp năng suất cao nhất mới xuất khẩu</strong>. Khi chi phí thương mại giảm, các doanh nghiệp kém năng suất nhất thu hẹp hoặc rút lui, các doanh nghiệp năng suất cao mở rộng và bắt đầu xuất khẩu, và <strong>năng suất bình quân của ngành tăng</strong> — một nguồn lợi từ thương mại mà các mô hình cũ bỏ sót. Số liệu cấp doanh nghiệp xác nhận doanh nghiệp xuất khẩu thường lớn hơn và năng suất cao hơn doanh nghiệp không xuất khẩu.</p>
<h3>Hai chủ đề liên quan</h3>
<ul>
<li><strong>Bán phá giá</strong> là một dạng phân biệt giá: bán sản phẩm ở nước ngoài rẻ hơn ở trong nước (hoặc dưới giá thành). Điều này xảy ra được khi doanh nghiệp có sức mạnh thị trường và các thị trường bị chia cắt. Thuế chống bán phá giá được bàn ở Phần 4.</li>
<li><strong>Doanh nghiệp đa quốc gia và thuê ngoài:</strong> doanh nghiệp đầu tư ra nước ngoài theo chiều ngang (để phục vụ thị trường nước ngoài tại chỗ) hoặc theo chiều dọc (để chia chuỗi sản xuất qua nhiều nước) — nền tảng của chuỗi giá trị toàn cầu.</li>
</ul>
<div class="callout"><span class="badge">Bức tranh lớn</span> Ba nguồn lợi ích từ thương mại: lợi thế so sánh (thương mại liên ngành), lợi thế kinh tế nhờ quy mô cùng sự đa dạng sản phẩm (thương mại nội ngành), và việc phân bổ lại sản lượng về các doanh nghiệp năng suất cao hơn.</div>`,
  ]]);

const q3 = quiz('eco201-quiz-3', 'Quiz 3 — The standard model and economies of scale|||Quiz 3 — Mô hình chuẩn và lợi thế kinh tế nhờ quy mô', [
  { id: 'q1', question: 'A country’s export price index rises from 100 to 104 while its import price index rises from 100 to 110. Its terms of trade…|||Chỉ số giá xuất khẩu của một nước tăng từ 100 lên 104 trong khi chỉ số giá nhập khẩu tăng từ 100 lên 110. Tỷ lệ trao đổi của nước đó…', options: ['improve by about 6%|||cải thiện khoảng 6%', 'are unchanged because both prices rose|||không đổi vì cả hai giá đều tăng', 'worsen by about 5.5%|||xấu đi khoảng 5,5%', 'worsen by about 14%|||xấu đi khoảng 14%'], correctIndex: 2, explanation: 'ToT = 104 / 110 x 100 = 94.5, a deterioration of about 5.5%: each unit of exports buys fewer imports.|||ToT = 104 / 110 x 100 = 94,5, tức xấu đi khoảng 5,5%: mỗi đơn vị xuất khẩu mua được ít hàng nhập khẩu hơn.' },
  { id: 'q2', question: 'In one industry a country exports 30 and imports 70. The Grubel–Lloyd index of intra-industry trade is…|||Trong một ngành, một nước xuất khẩu 30 và nhập khẩu 70. Chỉ số thương mại nội ngành Grubel–Lloyd là…', options: ['0.6|||0,6', '0.3|||0,3', '0.4|||0,4', '0.7|||0,7'], correctIndex: 0, explanation: 'GL = 1 − |30 − 70| / (30 + 70) = 1 − 0.4 = 0.6.|||GL = 1 − |30 − 70| / (30 + 70) = 1 − 0,4 = 0,6.' },
  { id: 'q3', question: 'In the Melitz model with heterogeneous firms, what happens when trade costs fall?|||Trong mô hình Melitz với doanh nghiệp không đồng nhất, điều gì xảy ra khi chi phí thương mại giảm?', options: ['all firms in the industry start exporting|||mọi doanh nghiệp trong ngành đều bắt đầu xuất khẩu', 'average productivity falls because many small firms enter|||năng suất bình quân giảm vì nhiều doanh nghiệp nhỏ gia nhập', 'only firms in the comparative-advantage industry are affected|||chỉ doanh nghiệp trong ngành có lợi thế so sánh bị ảnh hưởng', 'the least productive firms exit and the most productive expand, raising average productivity|||doanh nghiệp kém năng suất nhất rút lui, doanh nghiệp năng suất cao mở rộng, làm năng suất bình quân tăng'], correctIndex: 3, explanation: 'Output is reallocated toward more productive firms; this reallocation is itself a gain from trade.|||Sản lượng được phân bổ lại về các doanh nghiệp năng suất cao hơn; chính sự phân bổ lại này là một nguồn lợi từ thương mại.' },
]);

const c41 = doc('eco201-4-1-tariffs', '4.1 — The tariff: prices, surplus, deadweight loss and effective protection|||4.1 — Thuế quan: giá, thặng dư, mất trắng và tỷ lệ bảo hộ hữu hiệu',
  'Thuế quan theo lượng và theo giá trị; phân tích thuế quan nước nhỏ bằng cung cầu tuyến tính (thặng dư tiêu dùng, thặng dư sản xuất, thu ngân sách, mất trắng do bóp méo sản xuất và tiêu dùng); nước lớn và lợi ích tỷ lệ trao đổi; tỷ lệ bảo hộ hữu hiệu ERP và thuế quan leo thang; số liệu giả định.',
  [[
    `<span class="eyebrow">ECO201 · Part 4 · Lesson 4.1</span>
<h2>The tariff: prices, surplus, deadweight loss and effective protection</h2>
<p class="lead">A <strong>tariff</strong> is a tax on imports. A <strong>specific</strong> tariff is a fixed amount per unit (e.g. $2 per unit); an <strong>ad valorem</strong> tariff is a percentage of the value (e.g. 25%). We analyse one market in partial equilibrium, using consumer and producer surplus.</p>
<h3>A small country</h3>
<p>A small country cannot affect the world price P(W); a tariff t raises the domestic price to P(W) + t. Illustrative market (assumed): demand Q(D) = 400 − 20P, supply Q(S) = −50 + 25P. Autarky price: 400 − 20P = −50 + 25P → P = 10. World price: 6.</p>
<pre><code>Free trade  P = 6:   Q(D) = 280, Q(S) = 100, imports = 180
Tariff t = 2, P = 8: Q(D) = 240, Q(S) = 150, imports =  90</code></pre>
<table>
<tr><th>Effect (areas in the usual diagram)</th><th>Calculation</th><th>Value</th></tr>
<tr><td>Consumer surplus: −(a + b + c + d)</td><td>−(280 + 240) / 2 x 2</td><td>−520</td></tr>
<tr><td>Producer surplus: +a</td><td>+(100 + 150) / 2 x 2</td><td>+250</td></tr>
<tr><td>Government revenue: +c</td><td>2 x 90</td><td>+180</td></tr>
<tr><td>Net national welfare: −(b + d)</td><td>−520 + 250 + 180</td><td><strong>−90</strong></td></tr>
</table>
<p>The net loss is the <strong>deadweight loss</strong>, made of two triangles: the <strong>production distortion</strong> b = ½ x 2 x (150 − 100) = 50 — domestic firms produce units that cost more than the world price — and the <strong>consumption distortion</strong> d = ½ x 2 x (280 − 240) = 40 — consumers give up units they value above the world price.</p>
<h3>A large country: the terms-of-trade gain</h3>
<p>A large importer’s tariff reduces world demand and pushes the world price down, so foreign exporters bear part of the tariff. Assume the tariff of 2 lowers the world price from 6 to 5.2, so the domestic price rises only to 7.2:</p>
<pre><code>P = 7.2:  Q(D) = 256, Q(S) = 130, imports = 126
Consumer surplus  −(280 + 256) / 2 x 1.2 = −321.6
Producer surplus  +(100 + 130) / 2 x 1.2 = +138.0
Tariff revenue     2 x 126               = +252.0
   of which paid through higher domestic prices 1.2 x 126 = 151.2
   of which borne by foreign exporters  e = 0.8 x 126     = 100.8
Net welfare = −321.6 + 138.0 + 252.0 = +68.4
Check: e − (b + d) = 100.8 − (18.0 + 14.4) = +68.4</code></pre>
<p>For a large country a small tariff can raise national welfare — there is an <strong>optimum tariff</strong> above zero — but the gain comes at the expense of trading partners and invites retaliation. For a small country the optimum tariff is zero.</p>
<h3>The effective rate of protection (ERP)</h3>
<p>Nominal tariffs can mislead because producers also buy imported inputs. The ERP measures protection of <strong>value added</strong>:</p>
<pre><code>ERP = (V(d) − V(w)) / V(w) = (t(f) − a x t(i)) / (1 − a)
V(w), V(d) = value added at world and at domestic prices
t(f) = tariff on the final good, t(i) = tariff on inputs,
a = share of imported inputs in the final good’s value at world prices

Car assembly: world price 20,000; imported parts 15,000 (a = 0.75)
Tariff on cars 20%, on parts 10%
V(w) = 20,000 − 15,000 = 5,000
V(d) = 24,000 − 16,500 = 7,500   -&gt;  ERP = 2,500 / 5,000 = 50%
Formula: (0.20 − 0.75 x 0.10) / (1 − 0.75) = 0.125 / 0.25 = 50%
If parts face 30% instead: V(d) = 24,000 − 19,500 = 4,500 -&gt; ERP = −10%</code></pre>
<p>A 20% nominal tariff here protects domestic assembly by 50%. When input tariffs exceed output tariffs, protection can even be negative. <strong>Tariff escalation</strong> — low tariffs on raw materials, higher ones on processed goods — gives high effective protection to processing industries in importing countries and makes it harder for exporters of raw materials to move up the value chain.</p>
<div class="callout"><span class="badge">Remember</span> Who pays a tariff is not decided by law but by market power: in a small country, domestic consumers pay it all; in a large country, foreign exporters pay part.</div>`,
    `<span class="eyebrow">ECO201 · Phần 4 · Bài 4.1</span>
<h2>Thuế quan: giá, thặng dư, mất trắng và tỷ lệ bảo hộ hữu hiệu</h2>
<p class="lead"><strong>Thuế quan</strong> là thuế đánh vào hàng nhập khẩu. Thuế <strong>theo lượng</strong> là một khoản cố định trên mỗi đơn vị (ví dụ 2 $ mỗi đơn vị); thuế <strong>theo giá trị</strong> là một tỷ lệ phần trăm trên trị giá (ví dụ 25%). Ta phân tích một thị trường theo cân bằng bộ phận, dùng thặng dư tiêu dùng và thặng dư sản xuất.</p>
<h3>Nước nhỏ</h3>
<p>Nước nhỏ không ảnh hưởng được tới giá thế giới P(W); thuế quan t nâng giá trong nước lên P(W) + t. Thị trường minh hoạ (giả định): cầu Q(D) = 400 − 20P, cung Q(S) = −50 + 25P. Giá tự cung tự cấp: 400 − 20P = −50 + 25P → P = 10. Giá thế giới: 6.</p>
<pre><code>Thương mại tự do  P = 6:   Q(D) = 280, Q(S) = 100, nhập khẩu = 180
Thuế t = 2,  P = 8:        Q(D) = 240, Q(S) = 150, nhập khẩu =  90</code></pre>
<table>
<tr><th>Tác động (các diện tích trên đồ thị quen thuộc)</th><th>Cách tính</th><th>Giá trị</th></tr>
<tr><td>Thặng dư tiêu dùng: −(a + b + c + d)</td><td>−(280 + 240) / 2 x 2</td><td>−520</td></tr>
<tr><td>Thặng dư sản xuất: +a</td><td>+(100 + 150) / 2 x 2</td><td>+250</td></tr>
<tr><td>Thu ngân sách: +c</td><td>2 x 90</td><td>+180</td></tr>
<tr><td>Phúc lợi ròng quốc gia: −(b + d)</td><td>−520 + 250 + 180</td><td><strong>−90</strong></td></tr>
</table>
<p>Phần mất ròng là <strong>mất trắng</strong> (tổn thất vô ích), gồm hai tam giác: <strong>bóp méo sản xuất</strong> b = ½ x 2 x (150 − 100) = 50 — doanh nghiệp trong nước sản xuất những đơn vị tốn kém hơn giá thế giới — và <strong>bóp méo tiêu dùng</strong> d = ½ x 2 x (280 − 240) = 40 — người tiêu dùng bỏ những đơn vị mà họ đánh giá cao hơn giá thế giới.</p>
<h3>Nước lớn: lợi ích từ tỷ lệ trao đổi</h3>
<p>Thuế quan của một nước nhập khẩu lớn làm giảm cầu thế giới và đẩy giá thế giới xuống, nên nhà xuất khẩu nước ngoài gánh một phần thuế. Giả định thuế 2 làm giá thế giới giảm từ 6 xuống 5,2, nên giá trong nước chỉ tăng lên 7,2:</p>
<pre><code>P = 7,2:  Q(D) = 256, Q(S) = 130, nhập khẩu = 126
Thặng dư tiêu dùng  −(280 + 256) / 2 x 1,2 = −321,6
Thặng dư sản xuất   +(100 + 130) / 2 x 1,2 = +138,0
Thu thuế quan        2 x 126               = +252,0
   trong đó trả qua giá trong nước cao hơn   1,2 x 126 = 151,2
   trong đó do nhà xuất khẩu nước ngoài gánh  e = 0,8 x 126 = 100,8
Phúc lợi ròng = −321,6 + 138,0 + 252,0 = +68,4
Kiểm tra: e − (b + d) = 100,8 − (18,0 + 14,4) = +68,4</code></pre>
<p>Với nước lớn, một mức thuế nhỏ có thể làm tăng phúc lợi quốc gia — tồn tại một <strong>mức thuế quan tối ưu</strong> lớn hơn 0 — nhưng phần lợi đó lấy từ đối tác thương mại và dễ dẫn tới trả đũa. Với nước nhỏ, thuế quan tối ưu bằng 0.</p>
<h3>Tỷ lệ bảo hộ hữu hiệu (ERP)</h3>
<p>Thuế suất danh nghĩa có thể gây hiểu lầm vì nhà sản xuất cũng mua đầu vào nhập khẩu. ERP đo mức bảo hộ đối với <strong>giá trị gia tăng</strong>:</p>
<pre><code>ERP = (V(d) − V(w)) / V(w) = (t(f) − a x t(i)) / (1 − a)
V(w), V(d) = giá trị gia tăng theo giá thế giới và theo giá trong nước
t(f) = thuế suất hàng thành phẩm, t(i) = thuế suất đầu vào,
a = tỷ trọng đầu vào nhập khẩu trong giá trị thành phẩm theo giá thế giới

Lắp ráp ô tô: giá thế giới 20.000; linh kiện nhập khẩu 15.000 (a = 0,75)
Thuế ô tô 20%, thuế linh kiện 10%
V(w) = 20.000 − 15.000 = 5.000
V(d) = 24.000 − 16.500 = 7.500   -&gt;  ERP = 2.500 / 5.000 = 50%
Công thức: (0,20 − 0,75 x 0,10) / (1 − 0,75) = 0,125 / 0,25 = 50%
Nếu linh kiện chịu thuế 30%: V(d) = 24.000 − 19.500 = 4.500 -&gt; ERP = −10%</code></pre>
<p>Thuế danh nghĩa 20% ở đây bảo hộ khâu lắp ráp trong nước tới 50%. Khi thuế đầu vào cao hơn thuế thành phẩm, mức bảo hộ thậm chí có thể âm. <strong>Thuế quan leo thang</strong> — thuế thấp với nguyên liệu thô, cao hơn với hàng đã chế biến — tạo mức bảo hộ hữu hiệu cao cho ngành chế biến ở nước nhập khẩu và khiến nước xuất khẩu nguyên liệu khó leo lên chuỗi giá trị.</p>
<div class="callout"><span class="badge">Ghi nhớ</span> Ai trả thuế quan không do luật quyết định mà do sức mạnh thị trường: ở nước nhỏ, người tiêu dùng trong nước trả toàn bộ; ở nước lớn, nhà xuất khẩu nước ngoài trả một phần.</div>`,
  ]]);

const c42 = doc('eco201-4-2-other-instruments', '4.2 — Export subsidies, import quotas, VERs and other instruments|||4.2 — Trợ cấp xuất khẩu, hạn ngạch nhập khẩu, VER và các công cụ khác',
  'Trợ cấp xuất khẩu (ví dụ số giả định, nước nhỏ và nước lớn), hạn ngạch nhập khẩu và tiền thuê hạn ngạch, hạn chế xuất khẩu tự nguyện VER, yêu cầu tỷ lệ nội địa hoá, trợ cấp tín dụng xuất khẩu, mua sắm công, hàng rào kỹ thuật; bảng so sánh tác động của các công cụ.',
  [[
    `<span class="eyebrow">ECO201 · Part 4 · Lesson 4.2</span>
<h2>Export subsidies, import quotas, VERs and other instruments</h2>
<p class="lead">Tariffs are only one tool. Governments also subsidise exports, limit import quantities and use a variety of less visible barriers. The same surplus analysis shows who pays for each.</p>
<h3>Export subsidies</h3>
<p>An export subsidy is a payment to firms for each unit sold abroad. Illustrative market in a small exporting country (assumed): Q(D) = 150 − 5P, Q(S) = 10P − 30, world price 15.</p>
<pre><code>Free trade  P = 15:            Q(D) = 75, Q(S) = 120, exports = 45
Subsidy s = 3, domestic P = 18: Q(D) = 60, Q(S) = 150, exports = 90
Consumer surplus  −(75 + 60) / 2 x 3   = −202.5
Producer surplus  +(120 + 150) / 2 x 3 = +405.0
Subsidy cost      −3 x 90              = −270.0
Net welfare       = −67.5  = consumption distortion 22.5 + production distortion 45.0</code></pre>
<p>Firms will not sell at home for less than they earn by exporting, so the domestic price rises by the subsidy. In a <strong>large</strong> country the subsidy also pushes the world price down, so the terms of trade worsen and the national loss is even larger. Agricultural export subsidies, once widely used (for example under the European Union’s Common Agricultural Policy), have been largely phased out under WTO commitments.</p>
<h3>Import quotas</h3>
<p>A quota limits the quantity imported. Return to the market of lesson 4.1: a quota of 90 units raises the domestic price from 6 to 8 — exactly like the tariff of 2. Consumers and producers are affected identically; the difference is area c = (8 − 6) x 90 = <strong>180, the quota rent</strong>, which goes to whoever holds the import licences rather than to the government (unless the licences are auctioned). Quotas are also less transparent, and if demand grows, a quota lets the domestic price rise further while a tariff keeps it fixed.</p>
<h3>Voluntary export restraints (VERs)</h3>
<p>A VER is a quota administered by the <em>exporting</em> country at the importer’s request. The rent goes to foreign exporters, so the importing country loses b + d + c. In the lesson 4.1 market: 90 + 180 = <strong>270</strong>, three times the loss from the equivalent tariff. The best-known example is Japan’s restraint on car exports to the United States in the 1980s. The WTO Agreement on Safeguards prohibits members from seeking or maintaining VERs.</p>
<h3>Other instruments</h3>
<ul>
<li><strong>Local content requirements:</strong> a minimum share of a final good must be produced domestically; they protect input producers and raise costs for assemblers.</li>
<li><strong>Export credit subsidies:</strong> loans to foreign buyers at below-market rates.</li>
<li><strong>Government procurement:</strong> rules requiring public agencies to buy domestic products.</li>
<li><strong>Technical and sanitary standards and red tape:</strong> legitimate regulations can also act as barriers when applied in a discriminatory way.</li>
</ul>
<h3>Summary of effects (partial equilibrium)</h3>
<table>
<tr><th>Instrument</th><th>Consumer surplus</th><th>Producer surplus</th><th>Government</th><th>National welfare</th></tr>
<tr><td>Tariff</td><td>falls</td><td>rises</td><td>revenue rises</td><td>falls (small country); ambiguous (large)</td></tr>
<tr><td>Export subsidy</td><td>falls</td><td>rises</td><td>spending rises</td><td>falls</td></tr>
<tr><td>Import quota</td><td>falls</td><td>rises</td><td>no change (rent to licence holders)</td><td>falls (small country); ambiguous (large)</td></tr>
<tr><td>VER</td><td>falls</td><td>rises</td><td>no change (rent to foreigners)</td><td>falls</td></tr>
</table>
<div class="callout"><span class="badge">Key question</span> For any trade instrument, ask: how much does the domestic price change, and who receives the rectangle (government, licence holders or foreigners)? The two triangles are always lost.</div>`,
    `<span class="eyebrow">ECO201 · Phần 4 · Bài 4.2</span>
<h2>Trợ cấp xuất khẩu, hạn ngạch nhập khẩu, VER và các công cụ khác</h2>
<p class="lead">Thuế quan chỉ là một công cụ. Chính phủ còn trợ cấp xuất khẩu, giới hạn khối lượng nhập khẩu và dùng nhiều loại rào cản khó thấy hơn. Cùng phương pháp phân tích thặng dư cho biết ai trả giá cho từng công cụ.</p>
<h3>Trợ cấp xuất khẩu</h3>
<p>Trợ cấp xuất khẩu là khoản chi cho doanh nghiệp trên mỗi đơn vị bán ra nước ngoài. Thị trường minh hoạ ở một nước xuất khẩu nhỏ (giả định): Q(D) = 150 − 5P, Q(S) = 10P − 30, giá thế giới 15.</p>
<pre><code>Thương mại tự do  P = 15:           Q(D) = 75, Q(S) = 120, xuất khẩu = 45
Trợ cấp s = 3, giá trong nước 18:   Q(D) = 60, Q(S) = 150, xuất khẩu = 90
Thặng dư tiêu dùng  −(75 + 60) / 2 x 3   = −202,5
Thặng dư sản xuất   +(120 + 150) / 2 x 3 = +405,0
Chi trợ cấp         −3 x 90              = −270,0
Phúc lợi ròng       = −67,5  = bóp méo tiêu dùng 22,5 + bóp méo sản xuất 45,0</code></pre>
<p>Doanh nghiệp sẽ không bán trong nước với giá thấp hơn số tiền thu được khi xuất khẩu, nên giá trong nước tăng đúng bằng mức trợ cấp. Ở một nước <strong>lớn</strong>, trợ cấp còn đẩy giá thế giới xuống, nên tỷ lệ trao đổi xấu đi và thiệt hại quốc gia còn lớn hơn. Trợ cấp xuất khẩu nông sản, từng được dùng rộng rãi (ví dụ trong Chính sách Nông nghiệp Chung của Liên minh châu Âu), phần lớn đã được xoá bỏ theo các cam kết WTO.</p>
<h3>Hạn ngạch nhập khẩu</h3>
<p>Hạn ngạch giới hạn khối lượng nhập khẩu. Quay lại thị trường ở bài 4.1: hạn ngạch 90 đơn vị nâng giá trong nước từ 6 lên 8 — y như thuế 2. Người tiêu dùng và nhà sản xuất chịu tác động giống hệt; khác biệt là diện tích c = (8 − 6) x 90 = <strong>180, tiền thuê hạn ngạch</strong>, thuộc về người nắm giấy phép nhập khẩu chứ không vào ngân sách (trừ khi giấy phép được đấu giá). Hạn ngạch cũng kém minh bạch hơn, và khi cầu tăng, hạn ngạch để giá trong nước tăng thêm trong khi thuế quan giữ giá cố định.</p>
<h3>Hạn chế xuất khẩu tự nguyện (VER)</h3>
<p>VER là hạn ngạch do <em>nước xuất khẩu</em> quản lý theo yêu cầu của nước nhập khẩu. Tiền thuê hạn ngạch thuộc về nhà xuất khẩu nước ngoài, nên nước nhập khẩu mất b + d + c. Ở thị trường của bài 4.1: 90 + 180 = <strong>270</strong>, gấp ba lần thiệt hại của mức thuế tương đương. Ví dụ nổi tiếng nhất là việc Nhật Bản hạn chế xuất khẩu ô tô sang Mỹ trong thập niên 1980. Hiệp định về Tự vệ của WTO cấm các thành viên tìm kiếm hoặc duy trì VER.</p>
<h3>Các công cụ khác</h3>
<ul>
<li><strong>Yêu cầu tỷ lệ nội địa hoá:</strong> một tỷ lệ tối thiểu của thành phẩm phải được sản xuất trong nước; bảo hộ nhà sản xuất đầu vào và làm tăng chi phí của nhà lắp ráp.</li>
<li><strong>Trợ cấp tín dụng xuất khẩu:</strong> cho người mua nước ngoài vay với lãi suất thấp hơn thị trường.</li>
<li><strong>Mua sắm công:</strong> quy định buộc cơ quan nhà nước mua hàng sản xuất trong nước.</li>
<li><strong>Tiêu chuẩn kỹ thuật, vệ sinh dịch tễ và thủ tục hành chính:</strong> những quy định chính đáng cũng có thể trở thành rào cản khi được áp dụng phân biệt đối xử.</li>
</ul>
<h3>Tóm tắt tác động (cân bằng bộ phận)</h3>
<table>
<tr><th>Công cụ</th><th>Thặng dư tiêu dùng</th><th>Thặng dư sản xuất</th><th>Chính phủ</th><th>Phúc lợi quốc gia</th></tr>
<tr><td>Thuế quan</td><td>giảm</td><td>tăng</td><td>thu ngân sách tăng</td><td>giảm (nước nhỏ); không rõ (nước lớn)</td></tr>
<tr><td>Trợ cấp xuất khẩu</td><td>giảm</td><td>tăng</td><td>chi ngân sách tăng</td><td>giảm</td></tr>
<tr><td>Hạn ngạch nhập khẩu</td><td>giảm</td><td>tăng</td><td>không đổi (tiền thuê về người giữ giấy phép)</td><td>giảm (nước nhỏ); không rõ (nước lớn)</td></tr>
<tr><td>VER</td><td>giảm</td><td>tăng</td><td>không đổi (tiền thuê về nước ngoài)</td><td>giảm</td></tr>
</table>
<div class="callout"><span class="badge">Câu hỏi then chốt</span> Với mọi công cụ thương mại, hãy hỏi: giá trong nước thay đổi bao nhiêu, và ai nhận hình chữ nhật (chính phủ, người giữ giấy phép hay người nước ngoài)? Hai tam giác thì luôn mất.</div>`,
  ]]);

const c43e = doc('eco201-4-3-exercise', 'Exercise 2 — a tariff on bicycles in a small open economy|||Bài tập 2 — thuế nhập khẩu xe đạp ở một nền kinh tế mở nhỏ',
  'Bài tập (tình huống giả định): thuế quan nước nhỏ với cung cầu tuyến tính — giá, sản xuất, tiêu dùng, nhập khẩu, thay đổi thặng dư, thu thuế, mất trắng, thuế cấm đoán, hạn ngạch tương đương và tỷ lệ bảo hộ hữu hiệu; kèm lời giải.',
  [[
    `<span class="eyebrow">ECO201 · Part 4 · Exercise</span>
<h2>Exercise 2 — who gains and who loses from a bicycle tariff?</h2>
<div class="callout"><span class="badge">Problem</span> A fictional small open economy, Country H, with illustrative numbers. Domestic demand for bicycles is Q(D) = 1,000 − 20P and domestic supply is Q(S) = 20P − 200 (Q in thousand bicycles, P in $). The world price is $20 and H cannot affect it. (a) Find the autarky price and the free-trade levels of production, consumption and imports. (b) H imposes a 25% ad valorem tariff. Find the new domestic price, production, consumption and imports. (c) Compute the change in consumer surplus, producer surplus, tariff revenue and the deadweight loss (split into production and consumption distortions). (d) What is the smallest specific tariff that would stop all imports? (e) What import quota would have the same effect on price, and who receives the quota rent? (f) Domestic assemblers use imported parts worth $12 per bicycle at world prices, and parts face a 5% tariff. Compute the effective rate of protection for bicycle assembly.</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) Autarky: 1,000 − 20P = 20P − 200  -&gt;  P = 30
    Free trade at P = 20: Q(D) = 600, Q(S) = 200, imports = 400 (thousand)

(b) Tariff 25% x 20 = 5 per bicycle  -&gt;  domestic price P = 25
    Q(D) = 1,000 − 500 = 500, Q(S) = 500 − 200 = 300, imports = 200

(c) Consumer surplus  −(600 + 500) / 2 x 5 = −2,750   ($ thousand)
    Producer surplus  +(200 + 300) / 2 x 5 = +1,250
    Tariff revenue     5 x 200             = +1,000
    Net welfare        −2,750 + 1,250 + 1,000 = −500
    Production distortion  ½ x 5 x (300 − 200) = 250
    Consumption distortion ½ x 5 x (600 − 500) = 250   (250 + 250 = 500 ✓)

(d) Imports stop when the domestic price reaches the autarky price 30:
    prohibitive tariff = 30 − 20 = $10 per bicycle (50% ad valorem) or more

(e) A quota of 200 thousand bicycles gives the same price of 25.
    Quota rent = (25 − 20) x 200 = 1,000 -&gt; to licence holders, not the budget
    (to foreign exporters if it is run as a VER; the national loss is then 1,500)

(f) a = 12 / 20 = 0.6
    V(w) = 20 − 12 = 8;  V(d) = 25 − 12 x 1.05 = 25 − 12.6 = 12.4
    ERP = (12.4 − 8) / 8 = 55%
    Check: (0.25 − 0.6 x 0.05) / (1 − 0.6) = 0.22 / 0.4 = 55%</code></pre>
<p><strong>Why:</strong> the tariff transfers 1,250 from consumers to producers and 1,000 to the government, but consumers lose 2,750 — the extra 500 is lost to nobody’s benefit, half because inefficient domestic firms expand and half because consumers give up bicycles worth more to them than the world price. The ERP shows that a 25% nominal tariff protects the assemblers’ value added by 55%, because they pay only a 5% tariff on parts that make up 60% of the bicycle’s value.</p>`,
    `<span class="eyebrow">ECO201 · Phần 4 · Bài tập</span>
<h2>Bài tập 2 — ai được và ai mất từ thuế nhập khẩu xe đạp?</h2>
<div class="callout"><span class="badge">Đề</span> Nước H là một nền kinh tế mở nhỏ (tình huống giả định, số liệu minh hoạ). Cầu trong nước về xe đạp là Q(D) = 1.000 − 20P và cung trong nước là Q(S) = 20P − 200 (Q tính bằng nghìn chiếc, P tính bằng $). Giá thế giới là 20 $ và H không ảnh hưởng được tới giá này. (a) Tìm giá tự cung tự cấp và mức sản xuất, tiêu dùng, nhập khẩu khi thương mại tự do. (b) H áp thuế nhập khẩu 25% theo giá trị. Tìm giá trong nước, sản xuất, tiêu dùng và nhập khẩu mới. (c) Tính thay đổi thặng dư tiêu dùng, thặng dư sản xuất, thu thuế quan và mất trắng (tách thành bóp méo sản xuất và bóp méo tiêu dùng). (d) Mức thuế theo lượng nhỏ nhất để chặn hoàn toàn nhập khẩu là bao nhiêu? (e) Hạn ngạch nhập khẩu nào có cùng tác động lên giá, và ai nhận tiền thuê hạn ngạch? (f) Nhà lắp ráp trong nước dùng linh kiện nhập khẩu trị giá 12 $ mỗi chiếc theo giá thế giới, linh kiện chịu thuế 5%. Tính tỷ lệ bảo hộ hữu hiệu cho khâu lắp ráp xe đạp.</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) Tự cung tự cấp: 1.000 − 20P = 20P − 200  -&gt;  P = 30
    Thương mại tự do với P = 20: Q(D) = 600, Q(S) = 200, nhập khẩu = 400 (nghìn chiếc)

(b) Thuế 25% x 20 = 5 mỗi chiếc  -&gt;  giá trong nước P = 25
    Q(D) = 1.000 − 500 = 500, Q(S) = 500 − 200 = 300, nhập khẩu = 200

(c) Thặng dư tiêu dùng  −(600 + 500) / 2 x 5 = −2.750   (nghìn $)
    Thặng dư sản xuất   +(200 + 300) / 2 x 5 = +1.250
    Thu thuế quan        5 x 200             = +1.000
    Phúc lợi ròng        −2.750 + 1.250 + 1.000 = −500
    Bóp méo sản xuất   ½ x 5 x (300 − 200) = 250
    Bóp méo tiêu dùng  ½ x 5 x (600 − 500) = 250   (250 + 250 = 500 ✓)

(d) Nhập khẩu dừng khi giá trong nước chạm giá tự cung tự cấp 30:
    thuế cấm đoán = 30 − 20 = 10 $ mỗi chiếc (50% theo giá trị) trở lên

(e) Hạn ngạch 200 nghìn chiếc cho cùng mức giá 25.
    Tiền thuê hạn ngạch = (25 − 20) x 200 = 1.000 -&gt; về người giữ giấy phép, không vào ngân sách
    (về nhà xuất khẩu nước ngoài nếu vận hành như VER; khi đó thiệt hại quốc gia là 1.500)

(f) a = 12 / 20 = 0,6
    V(w) = 20 − 12 = 8;  V(d) = 25 − 12 x 1,05 = 25 − 12,6 = 12,4
    ERP = (12,4 − 8) / 8 = 55%
    Kiểm tra: (0,25 − 0,6 x 0,05) / (1 − 0,6) = 0,22 / 0,4 = 55%</code></pre>
<p><strong>Vì sao:</strong> thuế quan chuyển 1.250 từ người tiêu dùng sang nhà sản xuất và 1.000 vào ngân sách, nhưng người tiêu dùng mất 2.750 — phần 500 còn lại mất đi mà không ai được hưởng, một nửa vì doanh nghiệp trong nước kém hiệu quả mở rộng sản xuất, một nửa vì người tiêu dùng bỏ những chiếc xe mà họ đánh giá cao hơn giá thế giới. ERP cho thấy thuế danh nghĩa 25% bảo hộ giá trị gia tăng của nhà lắp ráp tới 55%, vì họ chỉ chịu thuế 5% đối với linh kiện chiếm 60% giá trị chiếc xe.</p>`,
  ]]);

const c44 = doc('eco201-4-4-political-economy-wto', '4.4 — The political economy of trade policy, the WTO and trade agreements|||4.4 — Kinh tế chính trị của chính sách thương mại, WTO và các hiệp định thương mại',
  'Lập luận ủng hộ thương mại tự do và lập luận can thiệp (tỷ lệ trao đổi, thất bại thị trường, ngành công nghiệp non trẻ, chính sách thương mại chiến lược), lý thuyết phương án tốt thứ nhì, vì sao bảo hộ vẫn tồn tại, GATT/WTO và các nguyên tắc, biện pháp phòng vệ thương mại, FTA và liên minh thuế quan, tạo lập và chuyển hướng thương mại (ví dụ số), Việt Nam trong hệ thống thương mại.',
  [[
    `<span class="eyebrow">ECO201 · Part 4 · Lesson 4.4</span>
<h2>The political economy of trade policy, the WTO and trade agreements</h2>
<h3>The case for free trade</h3>
<ul>
<li><strong>Efficiency:</strong> free trade avoids the production and consumption distortions (the two triangles).</li>
<li><strong>Additional gains:</strong> larger markets allow economies of scale, more variety, stronger competition and learning.</li>
<li><strong>A political argument:</strong> a simple rule of free trade is harder for special interests to capture than case-by-case intervention.</li>
</ul>
<h3>Arguments for intervention — and their limits</h3>
<table>
<tr><th>Argument</th><th>Logic</th><th>Main caveat</th></tr>
<tr><td>Terms of trade</td><td>A large country’s optimum tariff is positive (lesson 4.1)</td><td>Gains come at partners’ expense; retaliation can leave everyone worse off</td></tr>
<tr><td>Domestic market failures</td><td>Unemployment, externalities or knowledge spillovers may make extra production socially valuable</td><td>Targeting principle: fix the failure at its source (e.g. subsidise training or R&amp;D) rather than with trade policy</td></tr>
<tr><td>Infant industry</td><td>A new industry needs temporary protection until it learns to compete</td><td>Hard to pick winners; protection tends to become permanent; the real problem may be a capital-market failure</td></tr>
<tr><td>Strategic trade policy</td><td>Subsidies can shift oligopoly profits to domestic firms (Brander–Spencer)</td><td>Requires information governments rarely have; invites subsidy wars</td></tr>
</table>
<p>The <strong>theory of the second best</strong> says that when a market already has a distortion, a trade intervention <em>can</em> raise welfare — but a policy aimed directly at the distortion usually does so at lower cost.</p>
<h3>Why protection persists</h3>
<p>The benefits of protection are <strong>concentrated</strong> on a few producers, while the costs are <strong>spread thinly</strong> over millions of consumers. Following Mancur Olson’s logic of <strong>collective action</strong> (1965), small groups with large stakes organise and lobby effectively; large groups with small individual stakes do not. Concerns about income distribution — who loses jobs and where — also shape policy.</p>
<h3>International negotiations: GATT and the WTO</h3>
<p>Negotiations help because each government can trade access to its market for access to others, mobilising exporters against import-competing interests. The <strong>GATT</strong> (1947) cut tariffs in successive rounds; the <strong>WTO</strong> (1995) extended the rules to services and intellectual property and created a stronger dispute settlement system. Since December 2019, however, its Appellate Body has been unable to hear appeals because the appointment of its members has been blocked; some members use an interim arrangement (the MPIA) instead. The Doha Round, launched in 2001, has not produced a comprehensive agreement.</p>
<table>
<tr><th>Principle</th><th>Meaning</th></tr>
<tr><td>Most-favoured-nation (MFN)</td><td>A concession given to one member must be given to all members</td></tr>
<tr><td>National treatment</td><td>Imported goods, once inside, are treated like domestic goods</td></tr>
<tr><td>Bindings</td><td>Members commit to maximum (“bound”) tariff rates</td></tr>
<tr><td>Trade remedies</td><td>Anti-dumping duties, countervailing duties (against subsidies) and safeguards are allowed under strict conditions</td></tr>
<tr><td>Exceptions</td><td>Free trade areas and customs unions are allowed if they eliminate tariffs on substantially all trade among members (GATT Article XXIV)</td></tr>
</table>
<h3>Preferential trade agreements: creation or diversion?</h3>
<p>In a <strong>free trade area</strong> members remove tariffs among themselves but keep their own external tariffs (so <strong>rules of origin</strong> are needed); a <strong>customs union</strong> adds a common external tariff. Jacob Viner (1950) showed that such agreements can reduce welfare:</p>
<pre><code>Illustrative: Home levies a 50% tariff on wheat.
Cost of wheat: partner country 10, rest of the world (ROW) 8.
Before the FTA:  ROW 8 + 50% = 12,  partner 10 + 50% = 15  -&gt; buy from ROW,
                 government collects 4 per unit
After the FTA:   partner 10 (no tariff) &lt; ROW 12 -&gt; switch to the partner
Per unit: consumers save 12 − 10 = 2, government loses 4 -&gt; national loss 2
(the real resource cost of wheat rose from 8 to 10): TRADE DIVERSION</code></pre>
<p><strong>Trade creation</strong> — replacing high-cost domestic production with cheaper imports from a partner — raises welfare. An agreement is beneficial when creation outweighs diversion.</p>
<h3>Vietnam in the trading system</h3>
<p>Vietnam joined ASEAN in 1995 and the WTO in 2007, and participates in many free trade agreements, including the ASEAN Free Trade Area, the CPTPP, the EU–Vietnam FTA (EVFTA) and RCEP. Tariff schedules, rules of origin and other commitments differ by agreement: always look up the text in force (for example in the WTO regional trade agreements database or official government portals) rather than relying on summaries.</p>
<div class="callout"><span class="badge">Remember</span> Most economists see trade policy mainly as a political problem: the economics of free trade is strong, but the losers are visible and organised, while the gains are diffuse.</div>`,
    `<span class="eyebrow">ECO201 · Phần 4 · Bài 4.4</span>
<h2>Kinh tế chính trị của chính sách thương mại, WTO và các hiệp định thương mại</h2>
<h3>Lập luận ủng hộ thương mại tự do</h3>
<ul>
<li><strong>Hiệu quả:</strong> thương mại tự do tránh được bóp méo sản xuất và bóp méo tiêu dùng (hai tam giác).</li>
<li><strong>Lợi ích bổ sung:</strong> thị trường lớn hơn cho phép lợi thế kinh tế nhờ quy mô, đa dạng hơn, cạnh tranh mạnh hơn và học hỏi.</li>
<li><strong>Lập luận chính trị:</strong> một quy tắc đơn giản là thương mại tự do khó bị các nhóm lợi ích thao túng hơn so với can thiệp theo từng trường hợp.</li>
</ul>
<h3>Các lập luận can thiệp — và giới hạn của chúng</h3>
<table>
<tr><th>Lập luận</th><th>Logic</th><th>Lưu ý chính</th></tr>
<tr><td>Tỷ lệ trao đổi</td><td>Thuế quan tối ưu của nước lớn là dương (bài 4.1)</td><td>Lợi ích lấy từ đối tác; trả đũa có thể làm tất cả cùng thiệt</td></tr>
<tr><td>Thất bại thị trường trong nước</td><td>Thất nghiệp, ngoại ứng hay lan toả tri thức có thể làm cho sản xuất thêm có giá trị xã hội</td><td>Nguyên tắc nhắm đích: xử lý thất bại tại gốc (ví dụ trợ cấp đào tạo hay R&amp;D) thay vì dùng chính sách thương mại</td></tr>
<tr><td>Ngành công nghiệp non trẻ</td><td>Ngành mới cần bảo hộ tạm thời cho tới khi học được cách cạnh tranh</td><td>Khó chọn đúng “người thắng”; bảo hộ dễ thành vĩnh viễn; vấn đề thật có thể là thất bại của thị trường vốn</td></tr>
<tr><td>Chính sách thương mại chiến lược</td><td>Trợ cấp có thể chuyển lợi nhuận độc quyền nhóm về doanh nghiệp trong nước (Brander–Spencer)</td><td>Đòi hỏi thông tin mà chính phủ hiếm khi có; dễ dẫn tới chiến tranh trợ cấp</td></tr>
</table>
<p><strong>Lý thuyết phương án tốt thứ nhì</strong> cho rằng khi một thị trường đã có sẵn bóp méo, can thiệp thương mại <em>có thể</em> làm tăng phúc lợi — nhưng một chính sách nhắm thẳng vào bóp méo đó thường làm được với chi phí thấp hơn.</p>
<h3>Vì sao bảo hộ vẫn tồn tại</h3>
<p>Lợi ích của bảo hộ <strong>tập trung</strong> vào một số ít nhà sản xuất, còn chi phí <strong>trải mỏng</strong> trên hàng triệu người tiêu dùng. Theo logic <strong>hành động tập thể</strong> của Mancur Olson (1965), nhóm nhỏ có quyền lợi lớn tổ chức và vận động hiệu quả; nhóm lớn mà mỗi cá nhân chỉ có quyền lợi nhỏ thì không. Mối lo về phân phối thu nhập — ai mất việc và ở đâu — cũng định hình chính sách.</p>
<h3>Đàm phán quốc tế: GATT và WTO</h3>
<p>Đàm phán có ích vì mỗi chính phủ có thể đổi việc mở cửa thị trường của mình lấy việc được vào thị trường nước khác, qua đó huy động các nhà xuất khẩu làm đối trọng với nhóm cạnh tranh với hàng nhập khẩu. <strong>GATT</strong> (1947) cắt giảm thuế quan qua nhiều vòng đàm phán; <strong>WTO</strong> (1995) mở rộng luật lệ sang dịch vụ và sở hữu trí tuệ và lập ra cơ chế giải quyết tranh chấp mạnh hơn. Tuy vậy, từ 12/2019 Cơ quan Phúc thẩm (Appellate Body) không thể xét kháng cáo vì việc bổ nhiệm thành viên bị chặn; một số nước dùng cơ chế tạm thời MPIA thay thế. Vòng Doha, khởi động năm 2001, chưa đi tới một hiệp định toàn diện.</p>
<table>
<tr><th>Nguyên tắc</th><th>Ý nghĩa</th></tr>
<tr><td>Đối xử tối huệ quốc (MFN)</td><td>Ưu đãi dành cho một thành viên phải dành cho mọi thành viên</td></tr>
<tr><td>Đối xử quốc gia</td><td>Hàng nhập khẩu, khi đã vào thị trường, được đối xử như hàng trong nước</td></tr>
<tr><td>Ràng buộc thuế quan</td><td>Thành viên cam kết mức thuế suất trần (“thuế suất ràng buộc”)</td></tr>
<tr><td>Phòng vệ thương mại</td><td>Thuế chống bán phá giá, thuế chống trợ cấp và biện pháp tự vệ được phép với điều kiện chặt chẽ</td></tr>
<tr><td>Ngoại lệ</td><td>Khu vực thương mại tự do và liên minh thuế quan được phép nếu xoá bỏ thuế quan đối với về cơ bản toàn bộ (substantially all) thương mại giữa các thành viên (Điều XXIV GATT)</td></tr>
</table>
<h3>Hiệp định thương mại ưu đãi: tạo lập hay chuyển hướng?</h3>
<p>Trong <strong>khu vực thương mại tự do</strong>, các thành viên xoá thuế quan với nhau nhưng giữ biểu thuế riêng với bên ngoài (nên cần <strong>quy tắc xuất xứ</strong>); <strong>liên minh thuế quan</strong> có thêm biểu thuế chung với bên ngoài. Jacob Viner (1950) chỉ ra các hiệp định như vậy có thể làm giảm phúc lợi:</p>
<pre><code>Minh hoạ: Home đánh thuế 50% lên lúa mì nhập khẩu.
Chi phí lúa mì: nước đối tác 10, phần còn lại của thế giới (ROW) 8.
Trước FTA:  ROW 8 + 50% = 12,  đối tác 10 + 50% = 15  -&gt; mua từ ROW,
            ngân sách thu 4 mỗi đơn vị
Sau FTA:    đối tác 10 (không thuế) &lt; ROW 12 -&gt; chuyển sang mua của đối tác
Mỗi đơn vị: người tiêu dùng tiết kiệm 12 − 10 = 2, ngân sách mất 4 -&gt; quốc gia mất 2
(chi phí nguồn lực thực của lúa mì tăng từ 8 lên 10): CHUYỂN HƯỚNG THƯƠNG MẠI</code></pre>
<p><strong>Tạo lập thương mại</strong> — thay sản xuất trong nước chi phí cao bằng hàng nhập khẩu rẻ hơn từ đối tác — làm tăng phúc lợi. Một hiệp định có lợi khi tạo lập lớn hơn chuyển hướng.</p>
<h3>Việt Nam trong hệ thống thương mại</h3>
<p>Việt Nam gia nhập ASEAN năm 1995 và WTO năm 2007, và tham gia nhiều hiệp định thương mại tự do, trong đó có Khu vực Thương mại Tự do ASEAN, CPTPP, Hiệp định Thương mại Tự do Việt Nam – EU (EVFTA) và RCEP. Biểu thuế, quy tắc xuất xứ và các cam kết khác khác nhau theo từng hiệp định: hãy luôn tra văn bản đang có hiệu lực (ví dụ trong cơ sở dữ liệu hiệp định thương mại khu vực của WTO hoặc cổng thông tin chính thức của cơ quan nhà nước) thay vì dựa vào bản tóm tắt.</p>
<div class="callout"><span class="badge">Ghi nhớ</span> Phần lớn các nhà kinh tế coi chính sách thương mại chủ yếu là bài toán chính trị: lý lẽ kinh tế cho thương mại tự do rất mạnh, nhưng người thua thì lộ rõ và có tổ chức, còn lợi ích thì phân tán.</div>`,
  ]]);

const q4 = quiz('eco201-quiz-4', 'Quiz 4 — Trade policy|||Quiz 4 — Chính sách thương mại', [
  { id: 'q1', question: 'A tariff of 4 per unit raises the domestic price in a small importing country by 4. Domestic output rises by 20 units and consumption falls by 20 units. The deadweight loss is…|||Thuế quan 4 mỗi đơn vị làm giá trong nước của một nước nhập khẩu nhỏ tăng 4. Sản lượng trong nước tăng 20 đơn vị và tiêu dùng giảm 20 đơn vị. Mất trắng là…', options: ['40|||40', '80|||80', '160|||160', 'impossible to compute without the world price|||không tính được nếu không biết giá thế giới'], correctIndex: 1, explanation: 'Two triangles: ½ x 4 x 20 = 40 (production) + ½ x 4 x 20 = 40 (consumption) = 80.|||Hai tam giác: ½ x 4 x 20 = 40 (sản xuất) + ½ x 4 x 20 = 40 (tiêu dùng) = 80.' },
  { id: 'q2', question: 'Why is a voluntary export restraint (VER) usually more costly to the importing country than a tariff that restricts imports by the same amount?|||Vì sao hạn chế xuất khẩu tự nguyện (VER) thường gây thiệt hại cho nước nhập khẩu nhiều hơn một mức thuế quan hạn chế nhập khẩu với cùng khối lượng?', options: ['the domestic price rises more under a VER|||giá trong nước tăng nhiều hơn khi có VER', 'domestic producers lose under a VER|||nhà sản xuất trong nước bị thiệt khi có VER', 'the rent that a tariff would give the government goes to foreign exporters|||phần tiền mà thuế quan lẽ ra nộp vào ngân sách lại thuộc về nhà xuất khẩu nước ngoài', 'a VER does not reduce imports|||VER không làm giảm nhập khẩu'], correctIndex: 2, explanation: 'Prices and quantities are the same; the rectangle (area c) is captured by foreigners, so the importer loses b + d + c.|||Giá và lượng như nhau; hình chữ nhật (diện tích c) rơi vào tay người nước ngoài, nên nước nhập khẩu mất b + d + c.' },
  { id: 'q3', question: 'The final good has a 10% tariff, imported inputs make up 50% of its value at world prices, and inputs enter duty-free. The effective rate of protection is…|||Thành phẩm chịu thuế 10%, đầu vào nhập khẩu chiếm 50% giá trị thành phẩm theo giá thế giới và được miễn thuế. Tỷ lệ bảo hộ hữu hiệu là…', options: ['20%|||20%', '5%|||5%', '10%|||10%', '50%|||50%'], correctIndex: 0, explanation: 'ERP = (0.10 − 0.5 x 0) / (1 − 0.5) = 20%: the tariff protects a value added that is only half of the price.|||ERP = (0,10 − 0,5 x 0) / (1 − 0,5) = 20%: thuế quan bảo hộ phần giá trị gia tăng chỉ bằng một nửa giá bán.' },
]);

const c51 = doc('eco201-5-1-balance-of-payments', '5.1 — National income accounting and the balance of payments|||5.1 — Hạch toán thu nhập quốc dân và cán cân thanh toán',
  'Đồng nhất thức nền kinh tế mở Y = C + I + G + CA, tài khoản vãng lai, GDP và GNI, CA = S − I và tiết kiệm tư nhân – chính phủ (ví dụ số giả định), cấu trúc cán cân thanh toán theo BPM6 (tài khoản vãng lai, tài khoản vốn, tài khoản tài chính, lỗi và sai sót), bút toán kép, dự trữ chính thức và vị thế đầu tư quốc tế ròng.',
  [[
    `<span class="eyebrow">ECO201 · Part 5 · Lesson 5.1</span>
<h2>National income accounting and the balance of payments</h2>
<p class="lead">The second half of the course turns from goods to money. We begin with the accounts: how an open economy’s spending, saving and borrowing from the rest of the world fit together.</p>
<h3>The open-economy identity</h3>
<pre><code>Y = C + I + G + CA          CA = current account
CA = (exports − imports) + net primary income + net secondary income
GDP counts output produced at home; GNI = GDP + net primary income from abroad
Here Y is national income (GNI; strictly gross national disposable income,
since CA here includes secondary income). With Y = GDP the identity is
GDP = C + I + G + (X − M)</code></pre>
<p>Define <strong>national saving</strong> as income not spent on consumption by households or government: S = Y − C − G. Substituting gives the central identity:</p>
<pre><code>CA = S − I
Split saving into private S(p) = Y − T − C and government S(g) = T − G:
CA = S(p) − I − (G − T)

Illustration (assumed): Y = 1,000, C = 600, I = 220, G = 150, T = 200
S(p) = 1,000 − 200 − 600 = 200    S(g) = 200 − 150 = 50    S = 250
CA = 250 − 220 = 30               check: 600 + 220 + 150 + 30 = 1,000 ✓</code></pre>
<p>A current account <strong>surplus</strong> means the country saves more than it invests at home and lends the difference to the rest of the world — its net foreign wealth rises. A <strong>deficit</strong> means it borrows from abroad or sells assets. A deficit is not automatically bad: borrowing to finance productive investment can be sensible; borrowing to finance consumption or an unsustainable budget deficit is riskier. Other things equal, a larger government deficit (G − T) reduces the current account — the “twin deficits” idea — but private saving and investment often move too, so the link is not one-for-one.</p>
<h3>The structure of the balance of payments (IMF BPM6)</h3>
<table>
<tr><th>Account</th><th>Main components</th></tr>
<tr><td><strong>Current account</strong></td><td>Goods; services (tourism, transport, insurance, IT); primary income (compensation of employees, interest, dividends, reinvested earnings); secondary income (remittances and other current transfers)</td></tr>
<tr><td><strong>Capital account</strong></td><td>Capital transfers (debt forgiveness, investment grants); acquisition or disposal of non-produced non-financial assets</td></tr>
<tr><td><strong>Financial account</strong></td><td>Direct investment; portfolio investment; financial derivatives; other investment (loans, deposits, trade credit); reserve assets of the central bank</td></tr>
<tr><td>Net errors and omissions</td><td>The statistical balancing item</td></tr>
</table>
<h3>Double entry and the BoP identity</h3>
<pre><code>Current account + capital account + net errors and omissions = financial account
Financial account = net acquisition of financial assets − net incurrence of liabilities
                  = net lending (+) / net borrowing (−) to the rest of the world</code></pre>
<p>Every transaction is recorded twice. A Vietnamese firm exports shoes worth USD 1 million and keeps the payment in a U.S. bank: the current account records an export (credit), and the financial account records the acquisition of a foreign asset (the deposit). A foreign company invests in a factory in Vietnam: direct investment liabilities rise, matched either by imports of equipment (current account) or by the foreign currency acquired by local banks (financial account). Note on conventions: some older textbooks record financial inflows as credits so that CA + KA + FA = 0 — the economics is the same, only the sign of the financial account differs.</p>
<h3>Official reserves and the investment position</h3>
<ul>
<li>When the central bank buys foreign currency to hold down its own currency, its <strong>reserve assets</strong> rise — recorded in the financial account. The change in reserves is often called the official settlements balance.</li>
<li>The <strong>net international investment position (NIIP)</strong> is the stock of foreign assets minus foreign liabilities. It changes with financial-account flows and with valuation changes (exchange rates and asset prices).</li>
</ul>
<div class="callout"><span class="badge">One identity to keep</span> CA = S − I. A country that invests more than it saves must import the difference — as a current account deficit financed by capital from abroad.</div>`,
    `<span class="eyebrow">ECO201 · Phần 5 · Bài 5.1</span>
<h2>Hạch toán thu nhập quốc dân và cán cân thanh toán</h2>
<p class="lead">Nửa sau của môn học chuyển từ hàng hoá sang tiền tệ. Ta bắt đầu từ hệ thống tài khoản: chi tiêu, tiết kiệm và vay mượn với phần còn lại của thế giới của một nền kinh tế mở khớp với nhau thế nào.</p>
<h3>Đồng nhất thức của nền kinh tế mở</h3>
<pre><code>Y = C + I + G + CA          CA = cán cân vãng lai
CA = (xuất khẩu − nhập khẩu) + thu nhập sơ cấp ròng + thu nhập thứ cấp ròng
GDP tính sản lượng làm ra trong nước; GNI = GDP + thu nhập sơ cấp ròng từ nước ngoài
Ở đây Y là thu nhập quốc dân (GNI; chính xác hơn là thu nhập quốc dân khả dụng,
vì CA ở đây gồm cả thu nhập thứ cấp). Nếu Y = GDP thì đồng nhất thức là
GDP = C + I + G + (X − M)</code></pre>
<p>Định nghĩa <strong>tiết kiệm quốc gia</strong> là phần thu nhập không được hộ gia đình và chính phủ tiêu dùng: S = Y − C − G. Thay vào ta được đồng nhất thức trung tâm:</p>
<pre><code>CA = S − I
Tách tiết kiệm thành tư nhân S(p) = Y − T − C và chính phủ S(g) = T − G:
CA = S(p) − I − (G − T)

Minh hoạ (giả định): Y = 1.000, C = 600, I = 220, G = 150, T = 200
S(p) = 1.000 − 200 − 600 = 200    S(g) = 200 − 150 = 50    S = 250
CA = 250 − 220 = 30               kiểm tra: 600 + 220 + 150 + 30 = 1.000 ✓</code></pre>
<p><strong>Thặng dư</strong> vãng lai nghĩa là quốc gia tiết kiệm nhiều hơn đầu tư trong nước và cho phần còn lại của thế giới vay khoản chênh lệch — tài sản ròng ở nước ngoài tăng. <strong>Thâm hụt</strong> nghĩa là quốc gia vay nước ngoài hoặc bán tài sản. Thâm hụt không mặc nhiên là xấu: vay để tài trợ đầu tư có hiệu quả có thể hợp lý; vay để tài trợ tiêu dùng hoặc một mức thâm hụt ngân sách không bền vững thì rủi ro hơn. Các yếu tố khác không đổi, thâm hụt ngân sách (G − T) lớn hơn làm giảm cán cân vãng lai — ý tưởng “thâm hụt kép” — nhưng tiết kiệm và đầu tư tư nhân thường cũng thay đổi, nên mối liên hệ không phải một đổi một.</p>
<h3>Cấu trúc cán cân thanh toán (IMF BPM6)</h3>
<table>
<tr><th>Tài khoản</th><th>Thành phần chính</th></tr>
<tr><td><strong>Tài khoản vãng lai</strong></td><td>Hàng hoá; dịch vụ (du lịch, vận tải, bảo hiểm, CNTT); thu nhập sơ cấp (thù lao người lao động, lãi, cổ tức, lợi nhuận tái đầu tư); thu nhập thứ cấp (kiều hối và các khoản chuyển giao vãng lai khác)</td></tr>
<tr><td><strong>Tài khoản vốn</strong></td><td>Chuyển giao vốn (xoá nợ, viện trợ cho đầu tư); mua bán tài sản phi tài chính không do sản xuất tạo ra</td></tr>
<tr><td><strong>Tài khoản tài chính</strong></td><td>Đầu tư trực tiếp; đầu tư gián tiếp (danh mục); công cụ phái sinh tài chính; đầu tư khác (khoản vay, tiền gửi, tín dụng thương mại); tài sản dự trữ của ngân hàng trung ương</td></tr>
<tr><td>Lỗi và sai sót thuần</td><td>Khoản mục cân đối thống kê</td></tr>
</table>
<h3>Bút toán kép và đồng nhất thức cán cân thanh toán</h3>
<pre><code>Tài khoản vãng lai + tài khoản vốn + lỗi và sai sót thuần = tài khoản tài chính
Tài khoản tài chính = tài sản tài chính ròng tăng thêm − nợ phải trả ròng tăng thêm
                    = cho vay ròng (+) / đi vay ròng (−) với phần còn lại của thế giới</code></pre>
<p>Mỗi giao dịch được ghi hai lần. Một doanh nghiệp Việt Nam xuất khẩu giày trị giá 1 triệu USD và giữ tiền thanh toán ở một ngân hàng Mỹ: tài khoản vãng lai ghi một khoản xuất khẩu (ghi có), tài khoản tài chính ghi việc nắm giữ thêm một tài sản nước ngoài (khoản tiền gửi). Một công ty nước ngoài đầu tư xây nhà máy ở Việt Nam: nợ phải trả dưới dạng đầu tư trực tiếp tăng, đối ứng hoặc với máy móc nhập khẩu (tài khoản vãng lai) hoặc với lượng ngoại tệ mà ngân hàng trong nước nắm giữ thêm (tài khoản tài chính). Lưu ý về quy ước: một số giáo trình cũ ghi dòng vốn vào là ghi có để CA + KA + FA = 0 — bản chất kinh tế như nhau, chỉ khác dấu của tài khoản tài chính.</p>
<h3>Dự trữ chính thức và vị thế đầu tư</h3>
<ul>
<li>Khi ngân hàng trung ương mua ngoại tệ để giữ đồng nội tệ không tăng giá, <strong>tài sản dự trữ</strong> tăng — ghi trong tài khoản tài chính. Thay đổi dự trữ thường được gọi là cán cân thanh toán chính thức.</li>
<li><strong>Vị thế đầu tư quốc tế ròng (NIIP)</strong> là tổng tài sản nước ngoài trừ tổng nợ phải trả nước ngoài. Nó thay đổi theo các dòng trong tài khoản tài chính và theo biến động định giá (tỷ giá, giá tài sản).</li>
</ul>
<div class="callout"><span class="badge">Một đồng nhất thức cần giữ</span> CA = S − I. Một nước đầu tư nhiều hơn tiết kiệm phải nhập khẩu phần chênh lệch — dưới dạng thâm hụt vãng lai được tài trợ bằng vốn từ nước ngoài.</div>`,
  ]]);

const c52 = doc('eco201-5-2-fx-uip', '5.2 — Exchange rates, the foreign exchange market and uncovered interest parity|||5.2 — Tỷ giá, thị trường ngoại hối và ngang giá lãi suất không bảo hiểm',
  'Định nghĩa và cách yết tỷ giá, tăng giá – giảm giá, tỷ giá chéo và kinh doanh chênh lệch ba bên, người tham gia và các loại giao dịch trên thị trường ngoại hối, cách tiếp cận tài sản, ngang giá lãi suất không bảo hiểm UIP (ví dụ số giả định), so sánh với CIP (cũng trình bày ở FIN301, học cùng kỳ), phần bù rủi ro, tiền tệ và tỷ giá ngắn hạn – dài hạn, hiện tượng vượt quá mức.',
  [[
    `<span class="eyebrow">ECO201 · Part 5 · Lesson 5.2</span>
<h2>Exchange rates, the foreign exchange market and uncovered interest parity</h2>
<h3>Definitions and quotes</h3>
<p>An <strong>exchange rate</strong> is the price of one currency in terms of another. In this course E is quoted as units of home currency per unit of foreign currency — for Vietnam, VND per USD. A <strong>rise in E</strong> is a <strong>depreciation</strong> of the home currency (more dong per dollar); a fall is an <strong>appreciation</strong>. A depreciation makes home goods cheaper for foreigners and foreign goods dearer at home, other things equal.</p>
<pre><code>Cross rate (illustrative): 25,000 VND per USD and 1.10 USD per EUR
-&gt; VND per EUR = 25,000 x 1.10 = 27,500
If a bank quoted a different VND/EUR rate, traders could buy cheap and sell dear
around the triangle (triangular arbitrage) until the cross rate is restored.</code></pre>
<h3>The foreign exchange market</h3>
<ul>
<li><strong>Participants:</strong> commercial banks (the interbank market is the core), corporations, non-bank financial institutions (funds, insurers) and central banks.</li>
<li><strong>Instruments:</strong> spot transactions; forwards; FX swaps; futures and options.</li>
<li>The U.S. dollar is the main <strong>vehicle currency</strong>: it is on one side of the large majority of FX trades, and trades between two less-traded currencies often pass through it. The market is global and trades around the clock, so arbitrage keeps rates in different centres almost identical.</li>
</ul>
<h3>The asset approach</h3>
<p>Currencies are held as assets: bank deposits in different currencies. Investors compare <strong>expected returns measured in the same currency</strong>. The expected home-currency return on a foreign deposit is approximately the foreign interest rate plus the expected depreciation of the home currency:</p>
<pre><code>Expected return on a foreign deposit (in home currency) ≈ i* + (E(e) − E) / E</code></pre>
<h3>Uncovered interest parity (UIP)</h3>
<p>The foreign exchange market is in equilibrium when deposits in all currencies offer the same expected return:</p>
<pre><code>UIP (approximation):  i = i* + (E(e) − E) / E
UIP (exact):          (1 + i) = (1 + i*) x E(e) / E

Dollar–euro example (illustrative): E = 1.10 USD per EUR today,
expected E(e) = 1.12 in one year, i(USD) = 5%, i(EUR) = 3%
Euro deposit return in dollars ≈ 3% + (1.12 − 1.10) / 1.10 = 3% + 1.82% = 4.82%
(exact: 1.03 x 1.12 / 1.10 − 1 = 4.87%)
Either way &lt; 5%  -&gt; investors sell euros and buy dollars
Equilibrium today: 3% + (1.12 − E) / E = 5%  -&gt;  E = 1.12 / 1.02 = 1.0980
(the exact form gives 1.12 x 1.03 / 1.05 = 1.0987)</code></pre>
<p>Two rules follow, holding expectations constant: (1) a <strong>rise in the home interest rate appreciates</strong> the home currency today; (2) a <strong>rise in the expected future exchange rate depreciates</strong> it today. UIP also says the currency with the higher interest rate is expected to depreciate by roughly the interest differential.</p>
<h3>UIP versus CIP</h3>
<p><strong>Covered interest parity</strong> (CIP, also covered in FIN301): F / E = (1 + i) / (1 + i*), where F is the forward rate. CIP is a riskless arbitrage condition — the investor locks in the future rate with a forward contract — and it holds closely for major currencies, although small but persistent deviations (the cross-currency basis) have appeared since 2008 because arbitrage uses costly bank balance sheets. UIP replaces F with the <em>expected</em> future spot rate, so the investor is exposed to exchange-rate risk. UIP holds only if investors are indifferent to that risk; otherwise a <strong>risk premium</strong> separates the two. Empirically UIP often fails over short horizons — high-interest currencies have frequently not depreciated as much as UIP predicts, which is why the “carry trade” can be profitable, and risky.</p>
<h3>Money, interest rates and the exchange rate</h3>
<ul>
<li><strong>Short run</strong> (prices sticky): an increase in the home money supply lowers the home interest rate and depreciates the home currency.</li>
<li><strong>Long run</strong> (prices flexible): a permanent increase in the money supply raises the price level proportionally and depreciates the currency proportionally.</li>
<li><strong>Overshooting</strong> (Dornbusch, 1976): because prices adjust slowly, the currency depreciates more in the short run than in the long run — one reason exchange rates are so volatile.</li>
</ul>
<div class="callout"><span class="badge">Key lesson</span> Exchange rates move like asset prices: today’s rate depends on interest rates and on what the market expects the rate to be tomorrow. News that changes expectations moves the rate immediately.</div>`,
    `<span class="eyebrow">ECO201 · Phần 5 · Bài 5.2</span>
<h2>Tỷ giá, thị trường ngoại hối và ngang giá lãi suất không bảo hiểm</h2>
<h3>Định nghĩa và cách yết giá</h3>
<p><strong>Tỷ giá hối đoái</strong> là giá của một đồng tiền tính bằng đồng tiền khác. Trong môn này E được yết là số đơn vị nội tệ trên một đơn vị ngoại tệ — với Việt Nam là số VND trên một USD. <strong>E tăng</strong> là nội tệ <strong>giảm giá</strong> (nhiều đồng hơn cho một đô la); E giảm là nội tệ <strong>tăng giá</strong>. Các yếu tố khác không đổi, nội tệ giảm giá làm hàng trong nước rẻ hơn với người nước ngoài và hàng nước ngoài đắt hơn ở trong nước.</p>
<pre><code>Tỷ giá chéo (minh hoạ): 25.000 VND/USD và 1,10 USD/EUR
-&gt; VND/EUR = 25.000 x 1,10 = 27.500
Nếu một ngân hàng yết tỷ giá VND/EUR khác, nhà giao dịch có thể mua rẻ bán đắt
theo vòng tam giác (kinh doanh chênh lệch ba bên) cho tới khi tỷ giá chéo được khôi phục.</code></pre>
<h3>Thị trường ngoại hối</h3>
<ul>
<li><strong>Người tham gia:</strong> ngân hàng thương mại (thị trường liên ngân hàng là cốt lõi), doanh nghiệp, tổ chức tài chính phi ngân hàng (quỹ, công ty bảo hiểm) và ngân hàng trung ương.</li>
<li><strong>Công cụ:</strong> giao dịch giao ngay; kỳ hạn; hoán đổi ngoại tệ; tương lai và quyền chọn.</li>
<li>Đô la Mỹ là <strong>đồng tiền trung gian</strong> chính: USD có mặt ở một vế của đại đa số giao dịch ngoại hối, và giao dịch giữa hai đồng tiền ít thanh khoản thường đi qua USD. Thị trường mang tính toàn cầu và giao dịch suốt ngày đêm, nên kinh doanh chênh lệch giữ tỷ giá ở các trung tâm gần như giống hệt nhau.</li>
</ul>
<h3>Cách tiếp cận tài sản</h3>
<p>Tiền tệ được nắm giữ như tài sản: tiền gửi ngân hàng bằng các đồng tiền khác nhau. Nhà đầu tư so sánh <strong>lợi suất kỳ vọng tính bằng cùng một đồng tiền</strong>. Lợi suất kỳ vọng tính bằng nội tệ của một khoản tiền gửi ngoại tệ xấp xỉ bằng lãi suất ngoại tệ cộng mức giảm giá kỳ vọng của nội tệ:</p>
<pre><code>Lợi suất kỳ vọng của tiền gửi ngoại tệ (tính bằng nội tệ) ≈ i* + (E(e) − E) / E</code></pre>
<h3>Ngang giá lãi suất không bảo hiểm (UIP)</h3>
<p>Thị trường ngoại hối cân bằng khi tiền gửi bằng mọi đồng tiền mang lại cùng một lợi suất kỳ vọng:</p>
<pre><code>UIP (xấp xỉ):   i = i* + (E(e) − E) / E
UIP (chính xác): (1 + i) = (1 + i*) x E(e) / E

Ví dụ đô la – euro (minh hoạ): hôm nay E = 1,10 USD/EUR,
kỳ vọng E(e) = 1,12 sau một năm, i(USD) = 5%, i(EUR) = 3%
Lợi suất tiền gửi euro tính bằng đô la ≈ 3% + (1,12 − 1,10) / 1,10 = 3% + 1,82% = 4,82%
(chính xác: 1,03 x 1,12 / 1,10 − 1 = 4,87%)
Cách nào cũng &lt; 5%  -&gt; nhà đầu tư bán euro, mua đô la
Cân bằng hôm nay: 3% + (1,12 − E) / E = 5%  -&gt;  E = 1,12 / 1,02 = 1,0980
(dạng chính xác cho 1,12 x 1,03 / 1,05 = 1,0987)</code></pre>
<p>Từ đó có hai quy tắc, khi kỳ vọng giữ nguyên: (1) <strong>lãi suất trong nước tăng làm nội tệ tăng giá</strong> ngay hôm nay; (2) <strong>tỷ giá kỳ vọng tương lai tăng làm nội tệ giảm giá</strong> ngay hôm nay. UIP cũng cho biết đồng tiền có lãi suất cao hơn được kỳ vọng sẽ giảm giá xấp xỉ bằng chênh lệch lãi suất.</p>
<h3>UIP và CIP</h3>
<p><strong>Ngang giá lãi suất có bảo hiểm</strong> (CIP, cũng được trình bày ở FIN301): F / E = (1 + i) / (1 + i*), trong đó F là tỷ giá kỳ hạn. CIP là điều kiện kinh doanh chênh lệch không rủi ro — nhà đầu tư chốt tỷ giá tương lai bằng hợp đồng kỳ hạn — và nó đúng khá sát với các đồng tiền chủ chốt, dù từ sau 2008 đã xuất hiện những độ lệch nhỏ nhưng kéo dài (chênh lệch cơ sở tiền tệ chéo, cross-currency basis) vì kinh doanh chênh lệch phải dùng bảng cân đối ngân hàng, vốn tốn kém. UIP thay F bằng tỷ giá giao ngay tương lai <em>kỳ vọng</em>, nên nhà đầu tư chịu rủi ro tỷ giá. UIP chỉ đúng khi nhà đầu tư không quan tâm tới rủi ro đó; nếu không, một <strong>phần bù rủi ro</strong> tách hai điều kiện ra. Về thực nghiệm, UIP thường sai trong ngắn hạn — các đồng tiền lãi suất cao nhiều khi không giảm giá nhiều như UIP dự báo, vì thế giao dịch “carry trade” có thể có lãi, và cũng đầy rủi ro.</p>
<h3>Tiền tệ, lãi suất và tỷ giá</h3>
<ul>
<li><strong>Ngắn hạn</strong> (giá cứng nhắc): cung tiền trong nước tăng làm lãi suất trong nước giảm và nội tệ giảm giá.</li>
<li><strong>Dài hạn</strong> (giá linh hoạt): cung tiền tăng vĩnh viễn làm mức giá tăng theo cùng tỷ lệ và nội tệ giảm giá theo cùng tỷ lệ.</li>
<li><strong>Vượt quá mức</strong> (Dornbusch, 1976): vì giá điều chỉnh chậm, nội tệ giảm giá trong ngắn hạn nhiều hơn trong dài hạn — một lý do khiến tỷ giá biến động mạnh.</li>
</ul>
<div class="callout"><span class="badge">Bài học chính</span> Tỷ giá biến động như giá tài sản: tỷ giá hôm nay phụ thuộc vào lãi suất và vào việc thị trường kỳ vọng tỷ giá ngày mai ra sao. Tin tức làm thay đổi kỳ vọng sẽ làm tỷ giá dịch chuyển ngay lập tức.</div>`,
  ]]);

const c53 = doc('eco201-5-3-ppp-regimes', '5.3 — Purchasing power parity, the real exchange rate and exchange-rate regimes|||5.3 — Ngang giá sức mua, tỷ giá thực và chế độ tỷ giá',
  'Luật một giá, PPP tuyệt đối và PPP tương đối (ví dụ số giả định), tỷ giá thực, vì sao PPP không đúng trong ngắn hạn (chi phí vận tải, hàng không giao dịch, định giá theo thị trường, hiệu ứng Balassa–Samuelson), kết hợp PPP và UIP, các chế độ tỷ giá, bộ ba bất khả thi, Việt Nam và lịch sử hệ thống tiền tệ quốc tế.',
  [[
    `<span class="eyebrow">ECO201 · Part 5 · Lesson 5.3</span>
<h2>Purchasing power parity, the real exchange rate and exchange-rate regimes</h2>
<p class="lead">Interest parity explains exchange rates in the short run. In the long run, prices matter: currencies tend to move so that money buys roughly similar baskets in different countries.</p>
<h3>The law of one price</h3>
<p>In competitive markets with no transport costs or trade barriers, an identical good sells for the same price everywhere when prices are expressed in the same currency. Illustration: a phone sells for USD 500 in the United States; at E = 25,000 VND/USD that is 12,500,000 VND. If it sold for 13,000,000 VND in Vietnam, traders would have an incentive to ship phones in — ignoring transport, taxes and warranty differences, which in practice explain much of such gaps.</p>
<h3>Absolute and relative PPP</h3>
<pre><code>Absolute PPP:  E = P / P*        (P, P* = prices of the same basket at home and abroad)
Relative PPP:  % change in E ≈ π − π*   (π = inflation)
Illustration: home inflation 8%, foreign inflation 3%
  approximation: the home currency depreciates by about 5% a year
  exact:         1.08 / 1.03 − 1 = 4.85%</code></pre>
<h3>The real exchange rate</h3>
<pre><code>q = E x P* / P     (the price of the foreign basket in terms of the home basket)
A rise in q is a real depreciation: home goods become cheaper relative to foreign goods.
Illustration: E rises 10%, P rises 6%, P* rises 2%
  approximation: 10% + 2% − 6% = 6% real depreciation
  exact:         1.10 x 1.02 / 1.06 − 1 = 5.85%</code></pre>
<p>Under PPP the real exchange rate would be constant. In reality it moves a lot, and it is the real rate — not the nominal one — that drives competitiveness and the trade balance.</p>
<h3>Why PPP fails, especially in the short run</h3>
<ul>
<li><strong>Transport costs and trade barriers</strong> create a band within which prices can differ.</li>
<li><strong>Non-traded goods and services</strong> (haircuts, rent) are a large part of price indices.</li>
<li><strong>Imperfect competition</strong>: firms practise “pricing to market”, charging different prices in different countries.</li>
<li><strong>Different baskets</strong> in national price indices.</li>
<li><strong>The Balassa–Samuelson effect</strong>: richer countries tend to have higher price levels because higher productivity in traded goods raises wages, and thus prices of non-traded services. Informal comparisons such as The Economist’s Big Mac index illustrate these gaps.</li>
</ul>
<p>Evidence: relative PPP performs poorly over months but better over long horizons, and best in high-inflation economies, where inflation differences dominate exchange-rate movements.</p>
<h3>Putting PPP and UIP together</h3>
<p>If relative PPP holds in expectation, expected depreciation equals the expected inflation difference; combined with UIP this gives i − i* = π(e) − π*(e): in the long run, interest-rate differences reflect expected inflation differences (the international Fisher effect), and real interest rates tend to be equal across countries.</p>
<h3>Exchange-rate regimes and the trilemma</h3>
<table>
<tr><th>Regime</th><th>How it works</th></tr>
<tr><td>Free float</td><td>The market sets the rate; the central bank rarely intervenes</td></tr>
<tr><td>Managed float</td><td>The market sets the rate, but the central bank intervenes to smooth movements</td></tr>
<tr><td>Peg / band / crawling peg</td><td>The rate is kept at, or within a band around, a central parity that may be adjusted gradually</td></tr>
<tr><td>Currency board</td><td>The monetary base (currency issued) is fully backed by reserves of an anchor currency at a fixed rate, by law (e.g. Hong Kong’s link to the U.S. dollar)</td></tr>
<tr><td>No separate currency / monetary union</td><td>A foreign currency is used (dollarisation) or a common currency is shared (euro area)</td></tr>
</table>
<p>The <strong>monetary trilemma</strong> (often linked to the Mundell–Fleming model): a country cannot have all three of <strong>a fixed exchange rate, free capital mobility and an independent monetary policy</strong>. With a peg and open capital markets, UIP with E(e) = E forces i = i*: the interest rate must follow the anchor country. Euro-area members chose fixed rates and capital mobility; the United States chose a float, capital mobility and monetary autonomy; China for many years combined a managed exchange rate with capital controls.</p>
<p><strong>History in one line:</strong> the gold standard (before 1914) → the Bretton Woods system of fixed but adjustable dollar pegs (1944 to the early 1970s) → floating among major currencies since then. <strong>Vietnam:</strong> the State Bank of Vietnam announces a daily central exchange rate for the dong against the dollar, and banks trade within a band around it; check the current rules on the State Bank’s website.</p>
<div class="callout"><span class="badge">Remember</span> PPP is a long-run anchor, not a short-run forecast. For a pegged currency, the trilemma is the budget constraint of monetary policy.</div>`,
    `<span class="eyebrow">ECO201 · Phần 5 · Bài 5.3</span>
<h2>Ngang giá sức mua, tỷ giá thực và chế độ tỷ giá</h2>
<p class="lead">Ngang giá lãi suất giải thích tỷ giá trong ngắn hạn. Trong dài hạn, giá cả mới quan trọng: các đồng tiền có xu hướng biến động sao cho tiền mua được những giỏ hàng tương tự nhau ở các nước khác nhau.</p>
<h3>Luật một giá</h3>
<p>Trong thị trường cạnh tranh không có chi phí vận tải hay rào cản thương mại, một hàng hoá giống hệt nhau được bán cùng một giá ở mọi nơi khi quy về cùng một đồng tiền. Minh hoạ: một chiếc điện thoại bán 500 USD ở Mỹ; với E = 25.000 VND/USD, giá đó là 12.500.000 VND. Nếu ở Việt Nam nó bán 13.000.000 VND, nhà buôn có động cơ đưa điện thoại vào — chưa tính vận chuyển, thuế và khác biệt bảo hành, những thứ trên thực tế giải thích phần lớn các chênh lệch như vậy.</p>
<h3>PPP tuyệt đối và PPP tương đối</h3>
<pre><code>PPP tuyệt đối:  E = P / P*        (P, P* = giá của cùng một giỏ hàng trong nước và nước ngoài)
PPP tương đối:  % thay đổi của E ≈ π − π*   (π = lạm phát)
Minh hoạ: lạm phát trong nước 8%, lạm phát nước ngoài 3%
  xấp xỉ:     nội tệ giảm giá khoảng 5% mỗi năm
  chính xác:  1,08 / 1,03 − 1 = 4,85%</code></pre>
<h3>Tỷ giá thực</h3>
<pre><code>q = E x P* / P     (giá giỏ hàng nước ngoài tính theo giỏ hàng trong nước)
q tăng là giảm giá thực: hàng trong nước trở nên rẻ hơn tương đối so với hàng nước ngoài.
Minh hoạ: E tăng 10%, P tăng 6%, P* tăng 2%
  xấp xỉ:     10% + 2% − 6% = giảm giá thực 6%
  chính xác:  1,10 x 1,02 / 1,06 − 1 = 5,85%</code></pre>
<p>Nếu PPP đúng, tỷ giá thực sẽ không đổi. Thực tế tỷ giá thực biến động nhiều, và chính tỷ giá thực — không phải tỷ giá danh nghĩa — mới quyết định sức cạnh tranh và cán cân thương mại.</p>
<h3>Vì sao PPP không đúng, nhất là trong ngắn hạn</h3>
<ul>
<li><strong>Chi phí vận tải và rào cản thương mại</strong> tạo ra một khoảng trong đó giá có thể chênh nhau.</li>
<li><strong>Hàng hoá và dịch vụ không giao dịch</strong> (cắt tóc, tiền thuê nhà) chiếm một tỷ trọng lớn trong chỉ số giá.</li>
<li><strong>Cạnh tranh không hoàn hảo</strong>: doanh nghiệp “định giá theo thị trường”, bán giá khác nhau ở các nước khác nhau.</li>
<li><strong>Giỏ hàng khác nhau</strong> trong chỉ số giá của từng nước.</li>
<li><strong>Hiệu ứng Balassa–Samuelson</strong>: nước giàu hơn thường có mặt bằng giá cao hơn vì năng suất cao hơn ở khu vực hàng giao dịch đẩy tiền lương lên, kéo theo giá dịch vụ không giao dịch. Các so sánh không chính thức như chỉ số Big Mac của tạp chí The Economist minh hoạ những chênh lệch này.</li>
</ul>
<p>Bằng chứng: PPP tương đối đúng kém trong vài tháng nhưng tốt hơn trong dài hạn, và đúng nhất ở các nền kinh tế lạm phát cao, nơi chênh lệch lạm phát chi phối biến động tỷ giá.</p>
<h3>Ghép PPP với UIP</h3>
<p>Nếu PPP tương đối đúng theo kỳ vọng, mức giảm giá kỳ vọng bằng chênh lệch lạm phát kỳ vọng; kết hợp với UIP ta có i − i* = π(e) − π*(e): trong dài hạn, chênh lệch lãi suất phản ánh chênh lệch lạm phát kỳ vọng (hiệu ứng Fisher quốc tế), và lãi suất thực có xu hướng bằng nhau giữa các nước.</p>
<h3>Chế độ tỷ giá và bộ ba bất khả thi</h3>
<table>
<tr><th>Chế độ</th><th>Cách vận hành</th></tr>
<tr><td>Thả nổi tự do</td><td>Thị trường quyết định tỷ giá; ngân hàng trung ương hiếm khi can thiệp</td></tr>
<tr><td>Thả nổi có quản lý</td><td>Thị trường quyết định tỷ giá nhưng ngân hàng trung ương can thiệp để làm dịu biến động</td></tr>
<tr><td>Neo cố định / biên độ / neo có điều chỉnh dần</td><td>Tỷ giá được giữ ở, hoặc trong một biên độ quanh, một mức trung tâm có thể được điều chỉnh dần</td></tr>
<tr><td>Hội đồng tiền tệ</td><td>Tiền cơ sở (tiền phát hành) được bảo đảm hoàn toàn bằng dự trữ đồng tiền neo theo tỷ giá cố định, do luật quy định (ví dụ đô la Hồng Kông neo vào đô la Mỹ)</td></tr>
<tr><td>Không có đồng tiền riêng / liên minh tiền tệ</td><td>Dùng ngoại tệ (đô la hoá) hoặc dùng chung một đồng tiền (khu vực đồng euro)</td></tr>
</table>
<p><strong>Bộ ba bất khả thi</strong> của chính sách tiền tệ (thường gắn với mô hình Mundell–Fleming): một nước không thể cùng lúc có cả ba điều <strong>tỷ giá cố định, vốn tự do di chuyển và chính sách tiền tệ độc lập</strong>. Với tỷ giá neo và thị trường vốn mở, UIP với E(e) = E buộc i = i*: lãi suất phải theo nước neo. Các thành viên khu vực đồng euro chọn tỷ giá cố định và vốn tự do; Mỹ chọn thả nổi, vốn tự do và tự chủ tiền tệ; Trung Quốc trong nhiều năm kết hợp tỷ giá có quản lý với kiểm soát vốn.</p>
<p><strong>Lịch sử trong một dòng:</strong> chế độ bản vị vàng (trước 1914) → hệ thống Bretton Woods với tỷ giá neo vào đô la cố định nhưng có thể điều chỉnh (1944 tới đầu thập niên 1970) → các đồng tiền chủ chốt thả nổi từ đó tới nay. <strong>Việt Nam:</strong> Ngân hàng Nhà nước Việt Nam công bố tỷ giá trung tâm của đồng Việt Nam với đô la Mỹ hằng ngày, và các ngân hàng giao dịch trong một biên độ quanh mức đó; hãy kiểm tra quy định hiện hành trên trang của Ngân hàng Nhà nước.</p>
<div class="callout"><span class="badge">Ghi nhớ</span> PPP là mỏ neo dài hạn, không phải dự báo ngắn hạn. Với một đồng tiền được neo, bộ ba bất khả thi chính là ràng buộc ngân sách của chính sách tiền tệ.</div>`,
  ]]);

const c54e = doc('eco201-5-4-exercise', 'Exercise 3 — balance of payments, PPP and UIP for Country V|||Bài tập 3 — cán cân thanh toán, PPP và UIP của nước V',
  'Bài tập (tình huống giả định): lập cán cân vãng lai từ bảng giao dịch, tài khoản vốn, tài khoản tài chính và thay đổi dự trữ, kiểm CA = S − I; tính tỷ giá theo PPP tuyệt đối, tỷ giá thực, tỷ giá kỳ vọng theo PPP tương đối và theo UIP, so sánh lợi suất tiền gửi; kèm lời giải.',
  [[
    `<span class="eyebrow">ECO201 · Part 5 · Exercise</span>
<h2>Exercise 3 — Country V’s external accounts and its exchange rate</h2>
<div class="callout"><span class="badge">Problem</span> A fictional Country V, with illustrative figures in USD billion for one year: exports of goods 300; imports of goods 280; exports of services (tourism) 30; imports of services (freight and insurance) 40; investment income received 5 and paid to foreign investors 25; remittances received 15 and personal transfers paid abroad 2; an investment grant received from a foreign donor 1; direct investment by foreign firms in V 20; foreign purchases of V’s government bonds 5; purchases of foreign shares by V’s residents 8. Net errors and omissions are zero. (a) Compute the goods, services, primary income and secondary income balances and the current account. (b) Compute the capital account and net lending. (c) Find the financial account balance and the change in official reserves. (d) Domestic investment is 100: what is national saving? (e) A standard basket costs 2,600,000 VND in V and USD 100 in the United States; the market rate is 25,000 VND/USD. Find the absolute-PPP rate and the real exchange rate. (f) Expected inflation is 4% in V and 2% in the United States: what rate does relative PPP predict in one year? (g) One-year interest rates are 6% on VND and 4% on USD (illustrative, not market data). What expected rate is consistent with UIP? If investors in fact expect 25,300 VND/USD, which deposit do they prefer, and what happens to today’s rate?</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) Goods             300 − 280 =  20
    Services           30 −  40 = −10
    Primary income      5 −  25 = −20
    Secondary income   15 −   2 =  13
    Current account  20 − 10 − 20 + 13 = 3   (surplus)

(b) Capital account = 1  -&gt;  net lending = CA + KA = 3 + 1 = 4

(c) Financial account = net acquisition of assets − net incurrence of liabilities
    Assets: foreign shares 8 + change in reserves R;  liabilities: FDI 20 + bonds 5 = 25
    FA = (8 + R) − 25 = 4  -&gt;  R = 21  (official reserves rise by USD 21 billion)

(d) CA = S − I  -&gt;  S = I + CA = 100 + 3 = 103

(e) Absolute PPP rate = 2,600,000 / 100 = 26,000 VND/USD
    Real exchange rate q = E x P* / P = 25,000 x 100 / 2,600,000 = 0.96
    At the market rate V’s basket costs 2,600,000 / 25,000 = USD 104 &gt; USD 100:
    the VND is stronger than PPP implies; reaching PPP needs a 4% depreciation
    (26,000 / 25,000 − 1 = 4%)

(f) Relative PPP: E(1) = 25,000 x 1.04 / 1.02 = 25,490 VND/USD
    (approximation: +2% -&gt; 25,500)

(g) UIP: E(e) = 25,000 x 1.06 / 1.04 = 25,481 VND/USD  (approximation: +2% -&gt; 25,500)
    If E(e) = 25,300: USD deposit return in VND = 1.04 x 25,300 / 25,000 − 1 = 5.25%
    5.25% &lt; 6% on VND -&gt; investors prefer VND deposits
    They sell USD for VND: the VND appreciates today (E falls) until parity holds:
    E = 25,300 x 1.04 / 1.06 = 24,823 VND/USD</code></pre>
<p><strong>Why:</strong> V earns more from goods than it spends, but pays out services and investment income, so its current account is only slightly positive. Together with the grant, V lends 4 to the world on net; because foreigners invested 25 in V while residents bought only 8 of foreign assets, the central bank must have accumulated 21 of reserves to keep the accounts balanced. On the exchange rate, relative PPP and UIP give similar answers here because the 2-point interest differential matches the 2-point inflation differential — the international Fisher effect. When market expectations differ from the parity rate, it is today’s exchange rate that adjusts.</p>`,
    `<span class="eyebrow">ECO201 · Phần 5 · Bài tập</span>
<h2>Bài tập 3 — tài khoản đối ngoại và tỷ giá của nước V</h2>
<div class="callout"><span class="badge">Đề</span> Nước V giả định, số liệu minh hoạ tính bằng tỷ USD trong một năm: xuất khẩu hàng hoá 300; nhập khẩu hàng hoá 280; xuất khẩu dịch vụ (du lịch) 30; nhập khẩu dịch vụ (vận tải và bảo hiểm) 40; thu nhập đầu tư nhận về 5 và trả cho nhà đầu tư nước ngoài 25; kiều hối nhận về 15 và chuyển giao cá nhân ra nước ngoài 2; một khoản viện trợ cho đầu tư từ nhà tài trợ nước ngoài 1; doanh nghiệp nước ngoài đầu tư trực tiếp vào V 20; người nước ngoài mua trái phiếu chính phủ của V 5; cư dân V mua cổ phiếu nước ngoài 8. Lỗi và sai sót thuần bằng 0. (a) Tính cán cân hàng hoá, dịch vụ, thu nhập sơ cấp, thu nhập thứ cấp và cán cân vãng lai. (b) Tính tài khoản vốn và mức cho vay ròng. (c) Tìm cán cân tài khoản tài chính và thay đổi dự trữ chính thức. (d) Đầu tư trong nước là 100: tiết kiệm quốc gia bằng bao nhiêu? (e) Một giỏ hàng chuẩn có giá 2.600.000 VND ở V và 100 USD ở Mỹ; tỷ giá thị trường là 25.000 VND/USD. Tìm tỷ giá theo PPP tuyệt đối và tỷ giá thực. (f) Lạm phát kỳ vọng là 4% ở V và 2% ở Mỹ: PPP tương đối dự báo tỷ giá sau một năm là bao nhiêu? (g) Lãi suất kỳ hạn một năm là 6% với VND và 4% với USD (minh hoạ, không phải số liệu thị trường). Tỷ giá kỳ vọng nào phù hợp với UIP? Nếu thực tế nhà đầu tư kỳ vọng 25.300 VND/USD, họ thích tiền gửi nào hơn, và tỷ giá hôm nay sẽ ra sao?</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) Hàng hoá            300 − 280 =  20
    Dịch vụ              30 −  40 = −10
    Thu nhập sơ cấp       5 −  25 = −20
    Thu nhập thứ cấp     15 −   2 =  13
    Cán cân vãng lai  20 − 10 − 20 + 13 = 3   (thặng dư)

(b) Tài khoản vốn = 1  -&gt;  cho vay ròng = CA + KA = 3 + 1 = 4

(c) Tài khoản tài chính = tài sản ròng tăng thêm − nợ phải trả ròng tăng thêm
    Tài sản: cổ phiếu nước ngoài 8 + thay đổi dự trữ R;  nợ: FDI 20 + trái phiếu 5 = 25
    FA = (8 + R) − 25 = 4  -&gt;  R = 21  (dự trữ chính thức tăng 21 tỷ USD)

(d) CA = S − I  -&gt;  S = I + CA = 100 + 3 = 103

(e) Tỷ giá theo PPP tuyệt đối = 2.600.000 / 100 = 26.000 VND/USD
    Tỷ giá thực q = E x P* / P = 25.000 x 100 / 2.600.000 = 0,96
    Theo tỷ giá thị trường, giỏ hàng ở V có giá 2.600.000 / 25.000 = 104 USD &gt; 100 USD:
    VND mạnh hơn mức PPP hàm ý; để về mức PPP cần VND giảm giá 4%
    (26.000 / 25.000 − 1 = 4%)

(f) PPP tương đối: E(1) = 25.000 x 1,04 / 1,02 = 25.490 VND/USD
    (xấp xỉ: +2% -&gt; 25.500)

(g) UIP: E(e) = 25.000 x 1,06 / 1,04 = 25.481 VND/USD  (xấp xỉ: +2% -&gt; 25.500)
    Nếu E(e) = 25.300: lợi suất tiền gửi USD tính bằng VND = 1,04 x 25.300 / 25.000 − 1 = 5,25%
    5,25% &lt; 6% của VND -&gt; nhà đầu tư thích tiền gửi VND hơn
    Họ bán USD mua VND: VND tăng giá ngay hôm nay (E giảm) cho tới khi ngang giá được thiết lập:
    E = 25.300 x 1,04 / 1,06 = 24.823 VND/USD</code></pre>
<p><strong>Vì sao:</strong> V thu từ hàng hoá nhiều hơn chi, nhưng phải trả ra về dịch vụ và thu nhập đầu tư, nên cán cân vãng lai chỉ dương nhẹ. Cộng với khoản viện trợ, V cho thế giới vay ròng 4; vì người nước ngoài đầu tư vào V 25 trong khi cư dân V chỉ mua 8 tài sản nước ngoài, ngân hàng trung ương phải tích luỹ 21 dự trữ để các tài khoản cân đối. Về tỷ giá, PPP tương đối và UIP cho đáp số gần nhau vì chênh lệch lãi suất 2 điểm khớp với chênh lệch lạm phát 2 điểm — hiệu ứng Fisher quốc tế. Khi kỳ vọng của thị trường khác mức ngang giá, chính tỷ giá hôm nay sẽ điều chỉnh.</p>`,
  ]]);

const q5 = quiz('eco201-quiz-5', 'Quiz 5 — Balance of payments and exchange rates|||Quiz 5 — Cán cân thanh toán và tỷ giá', [
  { id: 'q1', question: 'National saving is 25% of GDP and domestic investment is 30% of GDP. The current account is…|||Tiết kiệm quốc gia bằng 25% GDP và đầu tư trong nước bằng 30% GDP. Cán cân vãng lai là…', options: ['a surplus of 5% of GDP|||thặng dư 5% GDP', 'a deficit of 55% of GDP|||thâm hụt 55% GDP', 'balanced, because saving and investment are both positive|||cân bằng, vì cả tiết kiệm và đầu tư đều dương', 'a deficit of 5% of GDP|||thâm hụt 5% GDP'], correctIndex: 3, explanation: 'CA = S − I = 25% − 30% = −5% of GDP: the gap is financed by borrowing from abroad.|||CA = S − I = 25% − 30% = −5% GDP: phần chênh lệch được tài trợ bằng vay nước ngoài.' },
  { id: 'q2', question: 'The one-year interest rate is 7% on VND deposits and 3% on USD deposits. If uncovered interest parity holds, the market expects…|||Lãi suất kỳ hạn một năm là 7% với tiền gửi VND và 3% với tiền gửi USD. Nếu ngang giá lãi suất không bảo hiểm đúng, thị trường kỳ vọng…', options: ['the VND to appreciate by about 4% against the USD|||VND tăng giá khoảng 4% so với USD', 'the VND to depreciate by about 4% against the USD|||VND giảm giá khoảng 4% so với USD', 'no change in the exchange rate|||tỷ giá không đổi', 'the VND to depreciate by about 10%|||VND giảm giá khoảng 10%'], correctIndex: 1, explanation: 'Under UIP the higher-interest currency is expected to depreciate by about the differential: 7% − 3% = 4% (exact 1.07 / 1.03 − 1 = 3.9%).|||Theo UIP, đồng tiền lãi suất cao hơn được kỳ vọng giảm giá xấp xỉ bằng chênh lệch: 7% − 3% = 4% (chính xác 1,07 / 1,03 − 1 = 3,9%).' },
  { id: 'q3', question: 'Today E = 25,000 VND/USD. Expected inflation is 5% in Vietnam and 2% in the United States. What rate does relative PPP predict in one year?|||Hôm nay E = 25.000 VND/USD. Lạm phát kỳ vọng là 5% ở Việt Nam và 2% ở Mỹ. PPP tương đối dự báo tỷ giá sau một năm là bao nhiêu?', options: ['about 25,750 VND/USD — the VND depreciates by about 3%|||khoảng 25.750 VND/USD — VND giảm giá khoảng 3%', 'about 24,250 VND/USD|||khoảng 24.250 VND/USD', 'unchanged at 25,000 VND/USD|||không đổi ở 25.000 VND/USD', 'about 26,750 VND/USD|||khoảng 26.750 VND/USD'], correctIndex: 0, explanation: 'The currency with higher inflation depreciates by about the inflation difference: 5% − 2% = 3%, so about 25,750 (exact 25,000 x 1.05 / 1.02 = 25,735).|||Đồng tiền lạm phát cao hơn giảm giá xấp xỉ bằng chênh lệch lạm phát: 5% − 2% = 3%, nên khoảng 25.750 (chính xác 25.000 x 1,05 / 1,02 = 25.735).' },
]);

const taiLieu = doc('eco201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (kèm link), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">ECO201 · 📚 Resource hub</span>
<h2>Course materials &amp; references</h2>
<p class="lead">One hub for learning international economics: the official syllabus and slides, textbooks, free official data and documents, video channels, tools and a self-study roadmap.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>Sign in to <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) with your FPTU account to read the official ECO201 syllabus, learning outcomes and lecture slides. The syllabus on FLM is the reference for assessment.</p>
<h3>📗 Books</h3>
<ul>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/international-economics-theory-and-policy/P200000005956/9780137465699" target="_blank" rel="noopener">International Economics: Theory and Policy</a> — Paul Krugman, Maurice Obstfeld &amp; Marc Melitz (Pearson): the standard textbook whose structure this course follows — trade theory, trade policy, then international finance.</li>
<li><a href="https://www.wiley.com/en-us/International+Economics,+13th+Edition-p-9781119554929" target="_blank" rel="noopener">International Economics</a> — Dominick Salvatore (Wiley): a comprehensive text with many worked examples and case studies; newer editions are listed on the Wiley site.</li>
</ul>
<h3>🌐 Free official resources</h3>
<ul>
<li><a href="https://www.wto.org/english/thewto_e/whatis_e/whatis_e.htm" target="_blank" rel="noopener">WTO — What is the WTO?</a> — the principles of the trading system, explained by the WTO itself.</li>
<li><a href="https://www.wto.org/english/tratop_e/region_e/region_e.htm" target="_blank" rel="noopener">WTO — Regional trade agreements</a> — where to look up the free trade agreements a country belongs to.</li>
<li><a href="https://data.worldbank.org/" target="_blank" rel="noopener">World Bank Open Data</a> — trade-to-GDP ratios, current account balances, inflation and exchange rates by country.</li>
<li><a href="https://ourworldindata.org/trade-and-globalization" target="_blank" rel="noopener">Our World in Data — Trade and Globalization</a> — long-run charts of the waves of globalization.</li>
<li><a href="https://unctad.org/" target="_blank" rel="noopener">UNCTAD</a> — reports on trade, investment and development.</li>
<li><a href="https://openstax.org/details/books/principles-macroeconomics-3e" target="_blank" rel="noopener">OpenStax — Principles of Macroeconomics 3e</a> — a free open textbook; its chapters on international trade, protectionism and exchange rates are a gentle review.</li>
<li><a href="https://www.sbv.gov.vn/" target="_blank" rel="noopener">State Bank of Vietnam</a> — the official central exchange rate and monetary policy announcements.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@MarginalRevolutionUniversity" target="_blank" rel="noopener">Marginal Revolution University</a> — short videos on comparative advantage, tariffs and trade (see also its <a href="https://mru.org/international-trade" target="_blank" rel="noopener">International Trade</a> course page).</li>
<li><a href="https://www.youtube.com/@khanacademy" target="_blank" rel="noopener">Khan Academy</a> — step-by-step lessons on comparative advantage, balance of payments and exchange rates.</li>
<li><a href="https://www.youtube.com/@IMF" target="_blank" rel="noopener">IMF</a> — explainers on exchange rates, capital flows and the global economy.</li>
<li><a href="https://www.youtube.com/@EconomicsExplained" target="_blank" rel="noopener">Economics Explained</a> — accessible case studies of national economies and currencies.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://wits.worldbank.org/" target="_blank" rel="noopener">WITS — World Integrated Trade Solution</a> (World Bank) — tariff and trade-flow data by product and partner.</li>
<li><a href="https://comtradeplus.un.org/" target="_blank" rel="noopener">UN Comtrade</a> — detailed international merchandise trade statistics; useful for computing Grubel–Lloyd indices.</li>
<li><a href="https://www.google.com/sheets/about/" target="_blank" rel="noopener">Google Sheets</a> — free online spreadsheets (any spreadsheet program works) for tariff welfare tables, balance-of-payments tables and parity calculations.</li>
</ul>
<h3>🎯 Self-study roadmap</h3>
<ol>
<li><strong>Foundations (exam core)</strong> — Ricardo, Heckscher–Ohlin and the tariff diagram, following Parts 1, 2 and 4; redo Exercises 1 and 2 without looking at the solutions.</li>
<li><strong>Practise</strong> — each week, solve one comparative-advantage problem and one tariff problem with new numbers, and draw every diagram by hand.</li>
<li><strong>Go deeper</strong> — download Vietnam’s exports and imports for one industry from UN Comtrade or WITS and compute the Grubel–Lloyd index; read the WTO pages on trade principles.</li>
<li><strong>Apply</strong> — build a spreadsheet that takes interest rates and inflation for VND and USD and returns the UIP and relative-PPP expected exchange rates; compare them with the actual rate a year later.</li>
</ol>
<div class="callout"><span class="badge">Note</span> An original hub of real links — no copyrighted slides or books are embedded. If a link moves, start from the official homepage.</div>`,
    `<span class="eyebrow">ECO201 · 📚 Trung tâm tài liệu</span>
<h2>Tài liệu tham khảo môn học</h2>
<p class="lead">Một nơi gom để học kinh tế quốc tế: giáo trình &amp; slide chính thức, sách giáo khoa, số liệu và tài liệu chính thức miễn phí, kênh video, công cụ, và lộ trình tự học.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Đăng nhập <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) bằng tài khoản FPTU để đọc đề cương chính thức, chuẩn đầu ra và slide bài giảng của ECO201. Đề cương trên FLM là căn cứ cho việc đánh giá.</p>
<h3>📗 Sách</h3>
<ul>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/international-economics-theory-and-policy/P200000005956/9780137465699" target="_blank" rel="noopener">International Economics: Theory and Policy</a> — Paul Krugman, Maurice Obstfeld &amp; Marc Melitz (Pearson): giáo trình chuẩn mà cấu trúc môn học này bám theo — lý thuyết thương mại, chính sách thương mại, rồi tài chính quốc tế.</li>
<li><a href="https://www.wiley.com/en-us/International+Economics,+13th+Edition-p-9781119554929" target="_blank" rel="noopener">International Economics</a> — Dominick Salvatore (Wiley): giáo trình toàn diện với nhiều ví dụ có lời giải và tình huống; các lần tái bản mới hơn có trên trang Wiley.</li>
</ul>
<h3>🌐 Tài liệu chính thức miễn phí</h3>
<ul>
<li><a href="https://www.wto.org/english/thewto_e/whatis_e/whatis_e.htm" target="_blank" rel="noopener">WTO — What is the WTO?</a> — các nguyên tắc của hệ thống thương mại, do chính WTO giải thích.</li>
<li><a href="https://www.wto.org/english/tratop_e/region_e/region_e.htm" target="_blank" rel="noopener">WTO — Regional trade agreements</a> — nơi tra cứu các hiệp định thương mại tự do mà một nước tham gia.</li>
<li><a href="https://data.worldbank.org/" target="_blank" rel="noopener">World Bank Open Data</a> — tỷ lệ thương mại/GDP, cán cân vãng lai, lạm phát và tỷ giá theo từng nước.</li>
<li><a href="https://ourworldindata.org/trade-and-globalization" target="_blank" rel="noopener">Our World in Data — Trade and Globalization</a> — biểu đồ dài hạn về các làn sóng toàn cầu hoá.</li>
<li><a href="https://unctad.org/" target="_blank" rel="noopener">UNCTAD</a> — báo cáo về thương mại, đầu tư và phát triển.</li>
<li><a href="https://openstax.org/details/books/principles-macroeconomics-3e" target="_blank" rel="noopener">OpenStax — Principles of Macroeconomics 3e</a> — giáo trình mở miễn phí; các chương về thương mại quốc tế, bảo hộ và tỷ giá là phần ôn tập nhẹ nhàng.</li>
<li><a href="https://www.sbv.gov.vn/" target="_blank" rel="noopener">Ngân hàng Nhà nước Việt Nam</a> — tỷ giá trung tâm chính thức và các thông báo chính sách tiền tệ.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@MarginalRevolutionUniversity" target="_blank" rel="noopener">Marginal Revolution University</a> — video ngắn về lợi thế so sánh, thuế quan và thương mại (xem thêm trang khoá học <a href="https://mru.org/international-trade" target="_blank" rel="noopener">International Trade</a>).</li>
<li><a href="https://www.youtube.com/@khanacademy" target="_blank" rel="noopener">Khan Academy</a> — bài giảng từng bước về lợi thế so sánh, cán cân thanh toán và tỷ giá.</li>
<li><a href="https://www.youtube.com/@IMF" target="_blank" rel="noopener">IMF</a> — video giải thích về tỷ giá, dòng vốn và kinh tế toàn cầu.</li>
<li><a href="https://www.youtube.com/@EconomicsExplained" target="_blank" rel="noopener">Economics Explained</a> — phân tích dễ hiểu về các nền kinh tế và đồng tiền cụ thể.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://wits.worldbank.org/" target="_blank" rel="noopener">WITS — World Integrated Trade Solution</a> (Ngân hàng Thế giới) — số liệu thuế quan và dòng thương mại theo sản phẩm và đối tác.</li>
<li><a href="https://comtradeplus.un.org/" target="_blank" rel="noopener">UN Comtrade</a> — thống kê thương mại hàng hoá quốc tế chi tiết; hữu ích để tính chỉ số Grubel–Lloyd.</li>
<li><a href="https://www.google.com/sheets/about/" target="_blank" rel="noopener">Google Sheets</a> — bảng tính trực tuyến miễn phí (dùng phần mềm bảng tính nào cũng được) để lập bảng phúc lợi thuế quan, bảng cán cân thanh toán và tính các điều kiện ngang giá.</li>
</ul>
<h3>🎯 Lộ trình tự học</h3>
<ol>
<li><strong>Nền tảng (lõi thi)</strong> — Ricardo, Heckscher–Ohlin và đồ thị thuế quan, theo Phần 1, 2 và 4; làm lại Bài tập 1 và 2 mà không nhìn lời giải.</li>
<li><strong>Luyện tập</strong> — mỗi tuần giải một bài lợi thế so sánh và một bài thuế quan với số mới, và tự vẽ tay mọi đồ thị.</li>
<li><strong>Đào sâu</strong> — tải số liệu xuất nhập khẩu của Việt Nam cho một ngành từ UN Comtrade hoặc WITS và tính chỉ số Grubel–Lloyd; đọc các trang của WTO về nguyên tắc thương mại.</li>
<li><strong>Vận dụng</strong> — dựng bảng tính nhận lãi suất và lạm phát của VND, USD rồi trả về tỷ giá kỳ vọng theo UIP và PPP tương đối; so với tỷ giá thực tế một năm sau.</li>
</ol>
<div class="callout"><span class="badge">Lưu ý</span> Đây là trung tâm liên kết nguyên gốc — không nhúng slide/sách có bản quyền. Link đổi thì vào trang chủ chính thức để tìm.</div>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'ECO201',
    slug: 'eco201-international-economics',
    title: 'International Economics',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/ECO201.webp',
    shortDescription: 'Why nations trade and how exchange rates work: Ricardo, Heckscher–Ohlin, scale economies, tariffs, quotas and ERP, WTO and FTAs, balance of payments, UIP, PPP and exchange-rate regimes. Bilingual, with worked exercises and quizzes.|||Vì sao các nước thương mại và tỷ giá vận hành ra sao: Ricardo, Heckscher–Ohlin, quy mô, thuế quan, hạn ngạch, ERP, WTO, FTA, cán cân thanh toán, UIP, PPP, chế độ tỷ giá. Song ngữ, có bài tập và quiz.',
    description: 'Môn <strong>ECO201 — International Economics (Kinh tế quốc tế)</strong> (khối Quản trị Kinh doanh, kỳ 3) trả lời hai nhóm câu hỏi: <strong>vì sao các nước thương mại và ai được ai mất</strong>, và <strong>tiền tệ đi qua biên giới thế nào</strong>. Từ <strong>toàn cầu hoá và mô hình trọng lực</strong> → <strong>mô hình Ricardo</strong> (chi phí cơ hội, lợi thế so sánh, giá tương đối thế giới, lợi ích thương mại) → <strong>mô hình yếu tố đặc thù, Heckscher–Ohlin, Stolper–Samuelson, nghịch lý Leontief</strong> → <strong>mô hình chuẩn, tỷ lệ trao đổi, lợi thế kinh tế nhờ quy mô, Krugman và Melitz</strong> → <strong>thuế quan, tỷ lệ bảo hộ hữu hiệu, hạn ngạch, VER, trợ cấp xuất khẩu, kinh tế chính trị, WTO và FTA</strong> → <strong>cán cân thanh toán, CA = S − I, thị trường ngoại hối, UIP, PPP và bộ ba bất khả thi</strong>. Bám cấu trúc giáo trình Krugman, Obstfeld &amp; Melitz và Salvatore, song ngữ Anh–Việt, mọi ví dụ số đã kiểm bằng máy (số liệu giả định), có bài tập kèm lời giải và quiz cuối mỗi phần.',
    whatYouLearn: 'Tính chi phí cơ hội, xác định lợi thế so sánh và khoảng giá thương mại trong mô hình Ricardo\nĐo lợi ích từ thương mại và giải thích tiền lương tương đối giữa hai nước\nPhân tích ai được ai mất khi mở cửa bằng mô hình yếu tố đặc thù và định lý Stolper–Samuelson\nGiải thích Heckscher–Ohlin, nghịch lý Leontief, tỷ lệ trao đổi và thương mại nội ngành (Krugman, Melitz)\nPhân tích thuế quan bằng thặng dư: thu thuế, mất trắng, nước lớn và tỷ lệ trao đổi, tỷ lệ bảo hộ hữu hiệu\nSo sánh hạn ngạch, VER, trợ cấp xuất khẩu; giải thích WTO, FTA, tạo lập và chuyển hướng thương mại\nLập cán cân thanh toán từ các giao dịch và vận dụng đồng nhất thức CA = S − I\nTính tỷ giá kỳ vọng theo UIP và PPP, tỷ giá thực, và giải thích các chế độ tỷ giá, bộ ba bất khả thi',
    requirements: 'Nên học trước ECO111 — Microeconomics (cung cầu, thặng dư) và ECO121 — Macroeconomics (GDP, tiết kiệm, lãi suất)\nĐại số phổ thông, tỷ lệ phần trăm và đọc đồ thị\nBảng tính (Excel, Google Sheets) để luyện bài tập',
  },
  sections: [
    { title: '📚 Course materials|||📚 Tài liệu tham khảo', description: 'Giáo trình & slide trên FLM, sách, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Course introduction|||Giới thiệu môn học', description: 'Hai nửa của kinh tế quốc tế, toàn cầu hoá, mô hình trọng lực, lộ trình.', lessons: [intro] },
    { title: 'Part 1 — Comparative advantage: the Ricardian model|||Phần 1 — Lợi thế so sánh: mô hình Ricardo', description: 'Chi phí cơ hội, lợi thế so sánh, giá thế giới, lợi ích thương mại, tiền lương tương đối.', lessons: [c11, c12, c13e, q1] },
    { title: 'Part 2 — Resources and income distribution|||Phần 2 — Nguồn lực và phân phối thu nhập', description: 'Yếu tố đặc thù, Heckscher–Ohlin, Stolper–Samuelson, nghịch lý Leontief.', lessons: [c21, c22, q2] },
    { title: 'Part 3 — The standard trade model and economies of scale|||Phần 3 — Mô hình thương mại chuẩn và lợi thế kinh tế nhờ quy mô', description: 'RS–RD, tỷ lệ trao đổi, tăng trưởng, quy mô, thương mại nội ngành, Krugman, Melitz.', lessons: [c31, c32, q3] },
    { title: 'Part 4 — Trade policy: instruments and political economy|||Phần 4 — Chính sách thương mại: công cụ và kinh tế chính trị', description: 'Thuế quan, ERP, trợ cấp xuất khẩu, hạn ngạch, VER, WTO, FTA.', lessons: [c41, c42, c43e, c44, q4] },
    { title: 'Part 5 — International finance: balance of payments and exchange rates|||Phần 5 — Tài chính quốc tế: cán cân thanh toán và tỷ giá', description: 'CA = S − I, cán cân thanh toán, thị trường ngoại hối, UIP, PPP, chế độ tỷ giá.', lessons: [c51, c52, c53, c54e, q5] },
  ],
};
