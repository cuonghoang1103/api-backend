/**
 * ECO111 — Microeconomics (Kinh tế vi mô). Khối Quản trị Kinh doanh, kỳ 1.
 * Bám cấu trúc giáo trình kinh tế vi mô nhập môn chuẩn (vd Mankiw — Principles of
 * Microeconomics): cung–cầu, co giãn, thặng dư & can thiệp của chính phủ, thất bại thị
 * trường, chi phí sản xuất, cấu trúc thị trường. Song ngữ + ví dụ số (đã kiểm) + bài tập + quiz.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('eco111-0-1-overview', 'Course overview: thinking like an economist|||Tổng quan: tư duy như nhà kinh tế',
  'Khan hiếm và chi phí cơ hội, các nguyên lý ra quyết định, đường giới hạn khả năng sản xuất (PPF), lợi thế so sánh có ví dụ số, thực chứng và chuẩn tắc, lộ trình môn.',
  [[
    `<span class="eyebrow">ECO111 · Lesson 0.1 · Overview</span>
<h2>Microeconomics</h2>
<p class="lead">Economics studies how a society manages its <strong>scarce resources</strong>. <strong>Microeconomics</strong> looks at individual decision makers — households and firms — and at how they interact in markets to determine prices and quantities. (Macroeconomics, ECO121, studies the economy as a whole.)</p>
<h3>How people make decisions</h3>
<ul>
<li><strong>People face trade-offs.</strong> Getting more of one thing means giving up something else.</li>
<li><strong>Cost is what you give up.</strong> The <em>opportunity cost</em> of an item is the value of the best alternative forgone — for a year at university, that includes the wages you could have earned.</li>
<li><strong>Rational people think at the margin.</strong> They take an action only if its <em>marginal benefit</em> exceeds its <em>marginal cost</em>.</li>
<li><strong>People respond to incentives.</strong> Change prices, taxes or rewards and behaviour changes.</li>
</ul>
<p>And how people interact: voluntary <strong>trade</strong> can make both sides better off; <strong>markets</strong> are usually a good way to organize economic activity; and <strong>governments</strong> can sometimes improve outcomes when markets fail (externalities, market power).</p>
<h3>The production possibilities frontier (PPF)</h3>
<p>The PPF shows the combinations of two goods an economy can produce with its resources and technology. Points <em>on</em> the curve are efficient, points <em>inside</em> waste resources, points <em>outside</em> are unattainable today. Moving along the curve shows the opportunity cost of one good in terms of the other. The curve is usually bowed outward: resources are not equally suited to every task, so the opportunity cost rises as we produce more of one good. Economic growth (more resources, better technology) shifts the whole PPF outward.</p>
<h3>Comparative advantage and the gains from trade</h3>
<table>
<tr><th>Output per hour</th><th>Shirts</th><th>Bags</th><th>Opportunity cost of 1 bag</th></tr>
<tr><td>Minh</td><td>4</td><td>2</td><td>2 shirts</td></tr>
<tr><td>Lan</td><td>1</td><td>1</td><td>1 shirt</td></tr>
</table>
<p>Minh has an <strong>absolute advantage</strong> in both goods, yet Lan has the <strong>comparative advantage</strong> in bags because her opportunity cost (1 shirt) is lower than Minh's (2 shirts). Minh has the comparative advantage in shirts (a shirt costs him ½ bag, but costs Lan 1 bag). If each specializes and they trade at any price between 1 and 2 shirts per bag, <em>both</em> end up with more than they could make alone. Trade is driven by comparative, not absolute, advantage.</p>
<h3>How economists work</h3>
<p>Economists build simplified <strong>models</strong> and change one variable at a time, holding others constant (<em>ceteris paribus</em>). <strong>Positive</strong> statements describe how the world is and can be tested ("a higher minimum wage reduces teen employment"); <strong>normative</strong> statements say how it should be ("the minimum wage should rise").</p>
<h3>Roadmap</h3>
<table>
<tr><th>Part</th><th>Topics</th></tr>
<tr><td>1</td><td>Supply, demand and elasticity</td></tr>
<tr><td>2</td><td>Consumer and producer surplus; price controls and taxes</td></tr>
<tr><td>3</td><td>Market failures (externalities, public goods) and the costs of production</td></tr>
<tr><td>4</td><td>Market structures: perfect competition, monopoly, monopolistic competition, oligopoly</td></tr>
</table>
<div class="callout"><span class="badge">How to study</span> Draw the graph every time. Almost every question in this course can be answered by asking: which curve shifts, in which direction — and what happens to price and quantity?</div>`,
    `<span class="eyebrow">ECO111 · Bài 0.1 · Tổng quan</span>
<h2>Kinh tế vi mô</h2>
<p class="lead">Kinh tế học nghiên cứu cách xã hội quản lý các <strong>nguồn lực khan hiếm</strong>. <strong>Kinh tế vi mô</strong> xem xét từng chủ thể ra quyết định — hộ gia đình và doanh nghiệp — và cách họ tương tác trên thị trường để hình thành giá và sản lượng. (Kinh tế vĩ mô, môn ECO121, nghiên cứu nền kinh tế như một tổng thể.)</p>
<h3>Con người ra quyết định thế nào</h3>
<ul>
<li><strong>Con người đối mặt với sự đánh đổi.</strong> Muốn có thêm thứ này thì phải bỏ bớt thứ khác.</li>
<li><strong>Chi phí là thứ bạn phải từ bỏ.</strong> <em>Chi phí cơ hội</em> của một lựa chọn là giá trị của phương án tốt nhất bị bỏ qua — với một năm đại học, trong đó có cả tiền lương lẽ ra bạn kiếm được.</li>
<li><strong>Người duy lý suy nghĩ ở mức cận biên.</strong> Họ chỉ hành động khi <em>lợi ích cận biên</em> lớn hơn <em>chi phí cận biên</em>.</li>
<li><strong>Con người phản ứng với động cơ khuyến khích.</strong> Thay đổi giá, thuế hay phần thưởng thì hành vi thay đổi.</li>
</ul>
<p>Còn về cách con người tương tác: <strong>trao đổi</strong> tự nguyện có thể làm cả hai bên có lợi; <strong>thị trường</strong> thường là cách tốt để tổ chức hoạt động kinh tế; và <strong>chính phủ</strong> đôi khi cải thiện được kết cục khi thị trường thất bại (ngoại ứng, sức mạnh thị trường).</p>
<h3>Đường giới hạn khả năng sản xuất (PPF)</h3>
<p>PPF cho biết các tổ hợp hai hàng hoá mà nền kinh tế sản xuất được với nguồn lực và công nghệ hiện có. Điểm <em>trên</em> đường là hiệu quả, điểm <em>bên trong</em> là lãng phí nguồn lực, điểm <em>bên ngoài</em> là chưa thể đạt tới. Di chuyển dọc đường cho thấy chi phí cơ hội của hàng này tính bằng hàng kia. Đường thường cong lồi ra ngoài: nguồn lực không phù hợp như nhau cho mọi việc, nên chi phí cơ hội tăng dần khi sản xuất thêm một hàng. Tăng trưởng kinh tế (thêm nguồn lực, công nghệ tốt hơn) đẩy cả đường PPF ra ngoài.</p>
<h3>Lợi thế so sánh và lợi ích từ trao đổi</h3>
<table>
<tr><th>Sản lượng mỗi giờ</th><th>Áo</th><th>Túi</th><th>Chi phí cơ hội của 1 túi</th></tr>
<tr><td>Minh</td><td>4</td><td>2</td><td>2 áo</td></tr>
<tr><td>Lan</td><td>1</td><td>1</td><td>1 áo</td></tr>
</table>
<p>Minh có <strong>lợi thế tuyệt đối</strong> ở cả hai hàng, nhưng Lan có <strong>lợi thế so sánh</strong> về túi vì chi phí cơ hội của cô (1 áo) thấp hơn của Minh (2 áo). Minh có lợi thế so sánh về áo (một chiếc áo chỉ tốn của anh ½ túi, nhưng tốn của Lan 1 túi). Nếu mỗi người chuyên môn hoá và trao đổi ở mức giá bất kỳ trong khoảng 1 đến 2 áo cho một túi, <em>cả hai</em> đều có nhiều hơn so với tự làm tất cả. Trao đổi được thúc đẩy bởi lợi thế so sánh, không phải lợi thế tuyệt đối.</p>
<h3>Nhà kinh tế làm việc thế nào</h3>
<p>Nhà kinh tế xây dựng các <strong>mô hình</strong> giản lược và chỉ thay đổi một biến mỗi lần, giữ các yếu tố khác không đổi (<em>ceteris paribus</em>). Phát biểu <strong>thực chứng</strong> mô tả thế giới đang như thế nào và kiểm chứng được ("tăng lương tối thiểu làm giảm việc làm của thanh thiếu niên"); phát biểu <strong>chuẩn tắc</strong> nói thế giới nên như thế nào ("nên tăng lương tối thiểu").</p>
<h3>Lộ trình</h3>
<table>
<tr><th>Phần</th><th>Nội dung</th></tr>
<tr><td>1</td><td>Cung, cầu và độ co giãn</td></tr>
<tr><td>2</td><td>Thặng dư tiêu dùng và sản xuất; kiểm soát giá và thuế</td></tr>
<tr><td>3</td><td>Thất bại thị trường (ngoại ứng, hàng hoá công) và chi phí sản xuất</td></tr>
<tr><td>4</td><td>Cấu trúc thị trường: cạnh tranh hoàn hảo, độc quyền, cạnh tranh độc quyền, độc quyền nhóm</td></tr>
</table>
<div class="callout"><span class="badge">Cách học</span> Lần nào cũng vẽ đồ thị. Gần như mọi câu hỏi của môn này đều trả lời được bằng cách hỏi: đường nào dịch chuyển, theo hướng nào — và giá, lượng thay đổi ra sao?</div>`,
  ]]);

const c1 = doc('eco111-1-1-supply-demand', '1.1 — Supply, demand & market equilibrium|||1.1 — Cung, cầu & cân bằng thị trường',
  'Luật cầu và các yếu tố làm dịch chuyển cầu, luật cung và các yếu tố làm dịch chuyển cung, cân bằng, dư thừa và thiếu hụt, phân biệt dịch chuyển đường với di chuyển dọc đường, giải cân bằng bằng phương trình.',
  [[
    `<span class="eyebrow">ECO111 · Chapter 4 · Lesson 1.1</span>
<h2>Supply, demand &amp; market equilibrium</h2>
<h3>Demand</h3>
<p>The <strong>law of demand</strong>: other things equal, when the price of a good rises, the quantity demanded falls. The demand curve slopes downward. A change in the good's <em>own price</em> causes a <strong>movement along</strong> the curve; a change in anything else <strong>shifts</strong> the whole curve:</p>
<table>
<tr><th>Demand shifter</th><th>Effect</th></tr>
<tr><td>Income</td><td>Rises → demand for a <em>normal</em> good increases; for an <em>inferior</em> good (e.g. instant noodles for some buyers) it decreases</td></tr>
<tr><td>Prices of related goods</td><td>Price of a <em>substitute</em> rises → demand increases (coffee dearer → more tea); price of a <em>complement</em> rises → demand decreases (petrol dearer → fewer cars)</td></tr>
<tr><td>Tastes, expectations, number of buyers</td><td>A trend, an expected future price rise, or a larger population all increase demand</td></tr>
</table>
<h3>Supply</h3>
<p>The <strong>law of supply</strong>: other things equal, a higher price raises the quantity supplied, so the supply curve slopes upward. Supply <em>shifts</em> with input prices (cheaper inputs → supply increases), technology (better technology → supply increases), expectations and the number of sellers.</p>
<h3>Equilibrium</h3>
<p>At the <strong>equilibrium price</strong>, quantity demanded equals quantity supplied. Above it there is a <strong>surplus</strong> (sellers cut prices); below it a <strong>shortage</strong> (buyers bid prices up). Markets move toward equilibrium on their own.</p>
<pre><code>Demand:  Qd = 100 − 2P        Supply:  Qs = −20 + 4P
Set Qd = Qs:  100 − 2P = −20 + 4P  ->  120 = 6P  ->  P* = 20
Q* = 100 − 2(20) = 60          (check: −20 + 4(20) = 60 ✓)

Demand increases to Qd = 130 − 2P (e.g. incomes rise, a normal good)
130 − 2P = −20 + 4P  ->  P* = 25,  Q* = 80</code></pre>
<h3>Analysing a change in three steps</h3>
<ol>
<li>Does the event shift supply, demand, or both?</li>
<li>In which direction?</li>
<li>Use the graph to see the new equilibrium price and quantity.</li>
</ol>
<p>Demand up → P and Q both rise. Supply up → P falls, Q rises. If both shift at once, one of the two results is ambiguous — it depends on which shift is larger.</p>
<div class="callout"><span class="badge">Common mistake</span> "The price rose, so demand fell" confuses a movement with a shift. A higher price lowers the <em>quantity demanded</em>; <em>demand</em> itself changes only when a non-price factor changes.</div>`,
    `<span class="eyebrow">ECO111 · Chương 4 · Bài 1.1</span>
<h2>Cung, cầu &amp; cân bằng thị trường</h2>
<h3>Cầu</h3>
<p><strong>Luật cầu</strong>: khi các yếu tố khác không đổi, giá một hàng hoá tăng thì lượng cầu giảm. Đường cầu dốc xuống. Thay đổi <em>giá của chính hàng hoá đó</em> tạo ra <strong>di chuyển dọc</strong> đường cầu; thay đổi bất kỳ yếu tố nào khác làm <strong>dịch chuyển</strong> cả đường:</p>
<table>
<tr><th>Yếu tố làm dịch chuyển cầu</th><th>Tác động</th></tr>
<tr><td>Thu nhập</td><td>Tăng → cầu hàng <em>thông thường</em> tăng; cầu hàng <em>thứ cấp</em> (vd mì ăn liền với một số người mua) giảm</td></tr>
<tr><td>Giá hàng hoá liên quan</td><td>Giá hàng <em>thay thế</em> tăng → cầu tăng (cà phê đắt hơn → uống trà nhiều hơn); giá hàng <em>bổ sung</em> tăng → cầu giảm (xăng đắt hơn → mua ít ô tô hơn)</td></tr>
<tr><td>Thị hiếu, kỳ vọng, số người mua</td><td>Một trào lưu, kỳ vọng giá sắp tăng, hay dân số đông hơn đều làm cầu tăng</td></tr>
</table>
<h3>Cung</h3>
<p><strong>Luật cung</strong>: khi các yếu tố khác không đổi, giá cao hơn làm lượng cung tăng, nên đường cung dốc lên. Cung <em>dịch chuyển</em> theo giá đầu vào (đầu vào rẻ hơn → cung tăng), công nghệ (công nghệ tốt hơn → cung tăng), kỳ vọng và số người bán.</p>
<h3>Cân bằng</h3>
<p>Tại <strong>giá cân bằng</strong>, lượng cầu bằng lượng cung. Trên mức đó có <strong>dư thừa</strong> (người bán hạ giá); dưới mức đó có <strong>thiếu hụt</strong> (người mua trả giá cao hơn). Thị trường tự vận động về trạng thái cân bằng.</p>
<pre><code>Cầu:  Qd = 100 − 2P        Cung:  Qs = −20 + 4P
Cho Qd = Qs:  100 − 2P = −20 + 4P  ->  120 = 6P  ->  P* = 20
Q* = 100 − 2(20) = 60       (kiểm tra: −20 + 4(20) = 60 ✓)

Cầu tăng thành Qd = 130 − 2P (vd thu nhập tăng, hàng thông thường)
130 − 2P = −20 + 4P  ->  P* = 25,  Q* = 80</code></pre>
<h3>Phân tích một thay đổi qua ba bước</h3>
<ol>
<li>Sự kiện làm dịch chuyển cung, cầu hay cả hai?</li>
<li>Theo hướng nào?</li>
<li>Dùng đồ thị để thấy giá và lượng cân bằng mới.</li>
</ol>
<p>Cầu tăng → P và Q cùng tăng. Cung tăng → P giảm, Q tăng. Nếu cả hai cùng dịch chuyển, một trong hai kết quả sẽ không xác định — tuỳ vào dịch chuyển nào lớn hơn.</p>
<div class="callout"><span class="badge">Lỗi hay gặp</span> "Giá tăng nên cầu giảm" là nhầm di chuyển với dịch chuyển. Giá cao hơn làm giảm <em>lượng cầu</em>; bản thân <em>cầu</em> chỉ thay đổi khi một yếu tố ngoài giá thay đổi.</div>`,
  ]]);

const c2 = doc('eco111-1-2-elasticity', '1.2 — Elasticity & its applications|||1.2 — Độ co giãn & ứng dụng',
  'Độ co giãn của cầu theo giá (phương pháp trung điểm), co giãn nhiều/ít/đơn vị, các yếu tố quyết định, quan hệ với tổng doanh thu, co giãn theo thu nhập, co giãn chéo và co giãn của cung.',
  [[
    `<span class="eyebrow">ECO111 · Chapter 5 · Lesson 1.2</span>
<h2>Elasticity &amp; its applications</h2>
<h3>Price elasticity of demand</h3>
<p><strong>Price elasticity of demand</strong> measures how strongly quantity demanded responds to a price change: E = %ΔQd ÷ %ΔP (reported as an absolute value). Using the <strong>midpoint method</strong> gives the same answer whichever direction the price moves:</p>
<pre><code>%ΔQ = (Q2 − Q1) / [(Q1 + Q2) / 2]      %ΔP = (P2 − P1) / [(P1 + P2) / 2]

Price rises from 4 to 6; quantity falls from 120 to 60
%ΔQ = −60 / 90 = −66.7%     %ΔP = 2 / 5 = 40%
|E| = 66.7 / 40 = 1.67  -> elastic (> 1)
Total revenue: 4 x 120 = 480  ->  6 x 60 = 360  (falls)</code></pre>
<table>
<tr><th>|E|</th><th>Name</th><th>Price rise → total revenue</th></tr>
<tr><td>&gt; 1</td><td>Elastic</td><td>Falls</td></tr>
<tr><td>= 1</td><td>Unit elastic</td><td>Unchanged</td></tr>
<tr><td>&lt; 1</td><td>Inelastic</td><td>Rises</td></tr>
</table>
<h3>What makes demand elastic?</h3>
<ul>
<li><strong>Close substitutes</strong> — one brand of bottled water is very elastic; water in general is not.</li>
<li><strong>Necessities vs luxuries</strong> — medicine is inelastic, holidays are elastic.</li>
<li><strong>Definition of the market</strong> — the narrower the market, the more elastic.</li>
<li><strong>Time horizon</strong> — demand is more elastic in the long run, when buyers have time to adjust.</li>
</ul>
<h3>Other elasticities</h3>
<ul>
<li><strong>Income elasticity</strong> = %ΔQd ÷ %ΔIncome: positive for normal goods (above 1 for luxuries), negative for inferior goods. Incomes up 10%, restaurant meals up 15% → 1.5, a luxury.</li>
<li><strong>Cross-price elasticity</strong> = %ΔQd of good A ÷ %ΔP of good B: positive for substitutes, negative for complements. Coffee price up 20%, tea quantity up 10% → +0.5, substitutes.</li>
<li><strong>Price elasticity of supply</strong> = %ΔQs ÷ %ΔP: larger when firms can easily expand output and in the long run.</li>
</ul>
<div class="callout"><span class="badge">Application</span> Why can a bumper harvest make farmers poorer? Food demand is inelastic, so the extra supply pushes the price down by proportionally more than quantity rises — total revenue falls.</div>`,
    `<span class="eyebrow">ECO111 · Chương 5 · Bài 1.2</span>
<h2>Độ co giãn &amp; ứng dụng</h2>
<h3>Độ co giãn của cầu theo giá</h3>
<p><strong>Độ co giãn của cầu theo giá</strong> đo mức phản ứng của lượng cầu trước thay đổi của giá: E = %ΔQd ÷ %ΔP (lấy giá trị tuyệt đối). <strong>Phương pháp trung điểm</strong> cho cùng một kết quả dù giá tăng hay giảm:</p>
<pre><code>%ΔQ = (Q2 − Q1) / [(Q1 + Q2) / 2]      %ΔP = (P2 − P1) / [(P1 + P2) / 2]

Giá tăng từ 4 lên 6; lượng giảm từ 120 xuống 60
%ΔQ = −60 / 90 = −66,7%     %ΔP = 2 / 5 = 40%
|E| = 66,7 / 40 = 1,67  -> co giãn nhiều (> 1)
Tổng doanh thu: 4 x 120 = 480  ->  6 x 60 = 360  (giảm)</code></pre>
<table>
<tr><th>|E|</th><th>Tên gọi</th><th>Tăng giá → tổng doanh thu</th></tr>
<tr><td>&gt; 1</td><td>Co giãn nhiều</td><td>Giảm</td></tr>
<tr><td>= 1</td><td>Co giãn đơn vị</td><td>Không đổi</td></tr>
<tr><td>&lt; 1</td><td>Co giãn ít</td><td>Tăng</td></tr>
</table>
<h3>Điều gì làm cầu co giãn?</h3>
<ul>
<li><strong>Có hàng thay thế gần</strong> — một nhãn nước đóng chai rất co giãn; nước uống nói chung thì không.</li>
<li><strong>Thiết yếu hay xa xỉ</strong> — thuốc men co giãn ít, du lịch co giãn nhiều.</li>
<li><strong>Cách xác định thị trường</strong> — thị trường càng hẹp, cầu càng co giãn.</li>
<li><strong>Khoảng thời gian</strong> — trong dài hạn cầu co giãn hơn, vì người mua có thời gian điều chỉnh.</li>
</ul>
<h3>Các độ co giãn khác</h3>
<ul>
<li><strong>Co giãn theo thu nhập</strong> = %ΔQd ÷ %ΔThu nhập: dương với hàng thông thường (trên 1 với hàng xa xỉ), âm với hàng thứ cấp. Thu nhập tăng 10%, số bữa ăn nhà hàng tăng 15% → 1,5, hàng xa xỉ.</li>
<li><strong>Co giãn chéo</strong> = %ΔQd của hàng A ÷ %ΔP của hàng B: dương với hàng thay thế, âm với hàng bổ sung. Giá cà phê tăng 20%, lượng trà tăng 10% → +0,5, là hàng thay thế.</li>
<li><strong>Co giãn của cung theo giá</strong> = %ΔQs ÷ %ΔP: lớn hơn khi doanh nghiệp dễ mở rộng sản lượng và trong dài hạn.</li>
</ul>
<div class="callout"><span class="badge">Ứng dụng</span> Vì sao được mùa lại có thể làm nông dân nghèo đi? Cầu lương thực co giãn ít, nên cung tăng thêm đẩy giá giảm theo tỉ lệ lớn hơn mức tăng của lượng — tổng doanh thu giảm.</div>`,
  ]]);

const c1e = doc('eco111-1-3-exercise', 'Exercise 1 — equilibrium, price ceiling & elasticity|||Bài tập 1 — cân bằng, giá trần & độ co giãn',
  'Bài tập: tìm cân bằng từ phương trình cung cầu, tính thiếu hụt khi có giá trần, độ co giãn điểm tại cân bằng và cân bằng mới khi cầu tăng; kèm lời giải.',
  [[
    `<span class="eyebrow">ECO111 · Chapters 4–5 · Exercise</span>
<h2>Exercise 1 — a market in equations</h2>
<div class="callout"><span class="badge">Problem</span> Demand: Qd = 120 − 4P. Supply: Qs = 2P. (a) Find the equilibrium price and quantity. (b) The government sets a price ceiling of 15. What happens? (c) Compute the price elasticity of demand at the equilibrium. Is demand elastic? (d) Incomes rise and demand becomes Qd = 150 − 4P. Find the new equilibrium.</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) 120 − 4P = 2P  ->  6P = 120  ->  P* = 20,  Q* = 2(20) = 40

(b) Ceiling 15 is below 20, so it binds:
    Qd = 120 − 4(15) = 60     Qs = 2(15) = 30
    Shortage = 60 − 30 = 30 units

(c) Point elasticity for a straight line: E = (ΔQ/ΔP) x (P/Q)
    E = −4 x (20 / 40) = −2   ->  |E| = 2 > 1, demand is elastic here

(d) 150 − 4P = 2P  ->  6P = 150  ->  P* = 25,  Q* = 50   (check: 150 − 100 = 50 ✓)</code></pre>
<p><strong>Why:</strong> a price ceiling only matters when it is set <em>below</em> equilibrium; then buyers want more than sellers offer, and the good is rationed by queues or connections instead of price. In (d) demand shifts right, so both price and quantity rise — exactly what the three-step method predicts.</p>`,
    `<span class="eyebrow">ECO111 · Chương 4–5 · Bài tập</span>
<h2>Bài tập 1 — một thị trường viết bằng phương trình</h2>
<div class="callout"><span class="badge">Đề</span> Cầu: Qd = 120 − 4P. Cung: Qs = 2P. (a) Tìm giá và lượng cân bằng. (b) Chính phủ đặt giá trần 15. Điều gì xảy ra? (c) Tính độ co giãn của cầu theo giá tại điểm cân bằng. Cầu có co giãn nhiều không? (d) Thu nhập tăng và cầu trở thành Qd = 150 − 4P. Tìm cân bằng mới.</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) 120 − 4P = 2P  ->  6P = 120  ->  P* = 20,  Q* = 2(20) = 40

(b) Giá trần 15 thấp hơn 20 nên có hiệu lực:
    Qd = 120 − 4(15) = 60     Qs = 2(15) = 30
    Thiếu hụt = 60 − 30 = 30 đơn vị

(c) Co giãn điểm với đường thẳng: E = (ΔQ/ΔP) x (P/Q)
    E = −4 x (20 / 40) = −2   ->  |E| = 2 > 1, tại đây cầu co giãn nhiều

(d) 150 − 4P = 2P  ->  6P = 150  ->  P* = 25,  Q* = 50   (kiểm tra: 150 − 100 = 50 ✓)</code></pre>
<p><strong>Vì sao:</strong> giá trần chỉ có tác dụng khi đặt <em>thấp hơn</em> giá cân bằng; khi đó người mua muốn nhiều hơn người bán cung ứng, và hàng hoá được phân phối bằng xếp hàng hay quan hệ thay vì bằng giá. Ở (d) đường cầu dịch sang phải, nên cả giá và lượng đều tăng — đúng như phương pháp ba bước dự đoán.</p>`,
  ]]);

const c1q = quiz('eco111-quiz-1', 'Quiz 1 — Supply, demand & elasticity|||Quiz 1 — Cung, cầu & co giãn', [
  { id: 'q1', question: 'The price of coffee rises sharply. What happens to the demand for tea (a substitute)?|||Giá cà phê tăng mạnh. Cầu về trà (hàng thay thế) thay đổi thế nào?', options: ['Demand for tea decreases|||Cầu về trà giảm', 'Demand for tea increases|||Cầu về trà tăng', 'Quantity of tea demanded falls along the curve|||Lượng cầu trà giảm dọc đường cầu', 'Nothing changes|||Không có gì thay đổi'], correctIndex: 1, explanation: 'A higher price of a substitute shifts the demand curve for the other good to the right.|||Giá hàng thay thế tăng làm đường cầu của hàng kia dịch sang phải.' },
  { id: 'q2', question: 'Which event causes a movement ALONG the demand curve for smartphones (not a shift)?|||Sự kiện nào tạo ra DI CHUYỂN DỌC đường cầu điện thoại thông minh (không phải dịch chuyển)?', options: ['Consumers’ incomes rise|||Thu nhập người tiêu dùng tăng', 'The price of smartphones falls|||Giá điện thoại thông minh giảm', 'A popular new app requires a smartphone|||Một ứng dụng mới được ưa chuộng đòi hỏi điện thoại thông minh', 'The population grows|||Dân số tăng'], correctIndex: 1, explanation: 'Only a change in the good’s own price moves us along its demand curve; every other factor shifts the curve.|||Chỉ thay đổi giá của chính hàng hoá mới gây di chuyển dọc đường cầu; mọi yếu tố khác làm dịch chuyển đường.' },
  { id: 'q3', question: 'Demand for a product is inelastic. If the firm raises its price, total revenue will…|||Cầu về một sản phẩm co giãn ít. Nếu doanh nghiệp tăng giá, tổng doanh thu sẽ…', options: ['increase|||tăng', 'decrease|||giảm', 'stay the same|||không đổi', 'fall to zero|||giảm về 0'], correctIndex: 0, explanation: 'With |E| < 1, quantity falls by a smaller percentage than price rises, so price x quantity goes up.|||Khi |E| < 1, lượng giảm theo tỉ lệ nhỏ hơn mức tăng giá, nên giá x lượng tăng.' },
]);

const c3 = doc('eco111-2-1-welfare-government', '2.1 — Consumer & producer surplus, price controls and taxes|||2.1 — Thặng dư, kiểm soát giá và thuế',
  'Thặng dư tiêu dùng, thặng dư sản xuất và hiệu quả của thị trường; giá trần, giá sàn; thuế tạo khoảng chênh giữa giá người mua và người bán, gánh nặng thuế theo độ co giãn, tổn thất vô ích; tác động của thương mại quốc tế và thuế quan.',
  [[
    `<span class="eyebrow">ECO111 · Chapters 6–9 · Lesson 2.1</span>
<h2>Consumer &amp; producer surplus, price controls and taxes</h2>
<h3>Measuring well-being</h3>
<ul>
<li><strong>Consumer surplus</strong> = what buyers are willing to pay − what they actually pay (the area under demand and above the price).</li>
<li><strong>Producer surplus</strong> = what sellers receive − their cost (the area above supply and below the price).</li>
<li><strong>Total surplus</strong> = consumer + producer surplus. In a competitive market the equilibrium maximizes total surplus: goods go to the buyers who value them most and are produced by the sellers with the lowest cost. This is the sense in which free markets are <em>efficient</em> (efficiency is not the same as fairness).</li>
</ul>
<h3>Price controls</h3>
<table>
<tr><th>Control</th><th>Binding when…</th><th>Result</th><th>Example</th></tr>
<tr><td>Price ceiling (legal maximum)</td><td>set below equilibrium</td><td>Shortage; queues, black markets, lower quality</td><td>Rent control</td></tr>
<tr><td>Price floor (legal minimum)</td><td>set above equilibrium</td><td>Surplus; unsold goods or unemployment</td><td>Minimum wage, agricultural price supports</td></tr>
</table>
<h3>Taxes</h3>
<p>A per-unit tax drives a <strong>wedge</strong> between the price buyers pay and the price sellers keep, and the quantity traded falls. Who <em>legally</em> pays does not matter: the <strong>burden (incidence)</strong> falls more heavily on the side of the market that is <strong>less elastic</strong>, because that side has fewer alternatives. The tax also creates a <strong>deadweight loss</strong> — surplus lost because some mutually beneficial trades no longer happen. The more elastic supply and demand are, the larger the deadweight loss, and it grows roughly with the <em>square</em> of the tax rate.</p>
<pre><code>Before tax:  buyers pay P*, sellers receive P*, quantity Q*
After tax t: buyers pay Pb, sellers keep Ps = Pb − t, quantity Q_t &lt; Q*
Tax revenue = t x Q_t        Deadweight loss ≈ ½ x t x (Q* − Q_t)</code></pre>
<h3>International trade</h3>
<p>If the world price is <em>above</em> the domestic price, a country exports: producers gain more than consumers lose. If it is <em>below</em>, the country imports: consumers gain more than producers lose. Either way total surplus rises. A <strong>tariff</strong> (a tax on imports) raises the domestic price, protects domestic producers and raises revenue, but causes a deadweight loss.</p>
<div class="callout"><span class="badge">Key insight</span> Price controls and taxes are often introduced to help one group, but by stopping the price from doing its job they shrink the market and destroy surplus.</div>`,
    `<span class="eyebrow">ECO111 · Chương 6–9 · Bài 2.1</span>
<h2>Thặng dư tiêu dùng &amp; sản xuất, kiểm soát giá và thuế</h2>
<h3>Đo lường phúc lợi</h3>
<ul>
<li><strong>Thặng dư tiêu dùng</strong> = mức người mua sẵn lòng trả − mức họ thực trả (diện tích dưới đường cầu, trên đường giá).</li>
<li><strong>Thặng dư sản xuất</strong> = số tiền người bán nhận − chi phí của họ (diện tích trên đường cung, dưới đường giá).</li>
<li><strong>Tổng thặng dư</strong> = thặng dư tiêu dùng + thặng dư sản xuất. Ở thị trường cạnh tranh, điểm cân bằng tối đa hoá tổng thặng dư: hàng hoá đến tay người mua đánh giá nó cao nhất và được sản xuất bởi người bán có chi phí thấp nhất. Đó là nghĩa của việc thị trường tự do <em>hiệu quả</em> (hiệu quả không đồng nghĩa với công bằng).</li>
</ul>
<h3>Kiểm soát giá</h3>
<table>
<tr><th>Biện pháp</th><th>Có hiệu lực khi…</th><th>Kết quả</th><th>Ví dụ</th></tr>
<tr><td>Giá trần (mức tối đa theo luật)</td><td>đặt thấp hơn giá cân bằng</td><td>Thiếu hụt; xếp hàng, chợ đen, chất lượng giảm</td><td>Kiểm soát giá thuê nhà</td></tr>
<tr><td>Giá sàn (mức tối thiểu theo luật)</td><td>đặt cao hơn giá cân bằng</td><td>Dư thừa; hàng ế hoặc thất nghiệp</td><td>Lương tối thiểu, giá sàn nông sản</td></tr>
</table>
<h3>Thuế</h3>
<p>Thuế theo đơn vị tạo một <strong>khoảng chênh</strong> giữa giá người mua trả và giá người bán giữ lại, và lượng giao dịch giảm. Ai là người <em>nộp thuế theo luật</em> không quan trọng: <strong>gánh nặng thuế</strong> rơi nhiều hơn vào phía thị trường <strong>kém co giãn hơn</strong>, vì phía đó ít lựa chọn thay thế hơn. Thuế còn gây <strong>tổn thất vô ích (deadweight loss)</strong> — phần thặng dư mất đi vì có những giao dịch đôi bên cùng có lợi không còn diễn ra. Cung và cầu càng co giãn thì tổn thất vô ích càng lớn, và nó tăng xấp xỉ theo <em>bình phương</em> thuế suất.</p>
<pre><code>Trước thuế: người mua trả P*, người bán nhận P*, lượng Q*
Sau thuế t: người mua trả Pb, người bán giữ Ps = Pb − t, lượng Q_t &lt; Q*
Thu thuế = t x Q_t        Tổn thất vô ích ≈ ½ x t x (Q* − Q_t)</code></pre>
<h3>Thương mại quốc tế</h3>
<p>Nếu giá thế giới <em>cao hơn</em> giá trong nước, quốc gia xuất khẩu: người sản xuất được lợi nhiều hơn phần người tiêu dùng mất. Nếu <em>thấp hơn</em>, quốc gia nhập khẩu: người tiêu dùng được lợi nhiều hơn phần người sản xuất mất. Trường hợp nào tổng thặng dư cũng tăng. <strong>Thuế quan</strong> (thuế đánh vào hàng nhập khẩu) làm giá trong nước tăng, bảo hộ người sản xuất trong nước và tạo nguồn thu, nhưng gây tổn thất vô ích.</p>
<div class="callout"><span class="badge">Ý chính</span> Kiểm soát giá và thuế thường được đưa ra để giúp một nhóm, nhưng khi ngăn giá làm đúng chức năng của nó, chúng thu hẹp thị trường và phá huỷ thặng dư.</div>`,
  ]]);

const c3e = doc('eco111-2-2-exercise', 'Exercise 2 — who really pays a tax?|||Bài tập 2 — ai thực sự chịu thuế?',
  'Bài tập: thị trường Qd = 100 − 2P, Qs = −20 + 4P chịu thuế 6 mỗi đơn vị đánh vào người bán; tìm giá người mua trả, giá người bán nhận, gánh nặng mỗi bên, thu thuế, thặng dư và tổn thất vô ích; kèm lời giải.',
  [[
    `<span class="eyebrow">ECO111 · Chapter 8 · Exercise</span>
<h2>Exercise 2 — tax incidence and deadweight loss</h2>
<div class="callout"><span class="badge">Problem</span> Demand: Qd = 100 − 2P. Supply: Qs = −20 + 4P (equilibrium P = 20, Q = 60, from lesson 1.1). The government levies a tax of 6 per unit, collected from sellers. Find (a) the price buyers pay, the price sellers keep and the new quantity; (b) how the burden is shared; (c) tax revenue; (d) consumer surplus, producer surplus and the deadweight loss.</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) Sellers keep Ps = Pb − 6, so supply in terms of the buyer price:
    Qs = −20 + 4(Pb − 6) = −44 + 4Pb
    100 − 2Pb = −44 + 4Pb  ->  6Pb = 144  ->  Pb = 24,  Ps = 18
    Q = 100 − 2(24) = 52      (check: −20 + 4(18) = 52 ✓)

(b) Buyers pay 24 − 20 = 4 more per unit; sellers keep 20 − 18 = 2 less.
    Buyers bear 4/6 = two thirds of the tax.

(c) Revenue = 6 x 52 = 312

(d) Demand hits zero at P = 50; supply starts at P = 5.
    Before: CS = ½ x (50 − 20) x 60 = 900   PS = ½ x (20 − 5) x 60 = 450   total 1,350
    After:  CS = ½ x (50 − 24) x 52 = 676   PS = ½ x (18 − 5) x 52 = 338
            revenue 312                     total 1,326
    Deadweight loss = 1,350 − 1,326 = 24  = ½ x 6 x (60 − 52) ✓</code></pre>
<p><strong>Why:</strong> at the old equilibrium demand is less elastic than supply (|Ed| = 2 × 20/60 ≈ 0.67 versus Es = 4 × 20/60 ≈ 1.33), so buyers carry most of the tax even though sellers hand the money to the government. The 24 of deadweight loss is surplus that nobody receives — not buyers, not sellers, not the state.</p>`,
    `<span class="eyebrow">ECO111 · Chương 8 · Bài tập</span>
<h2>Bài tập 2 — phân chia gánh nặng thuế và tổn thất vô ích</h2>
<div class="callout"><span class="badge">Đề</span> Cầu: Qd = 100 − 2P. Cung: Qs = −20 + 4P (cân bằng P = 20, Q = 60, từ bài 1.1). Chính phủ đánh thuế 6 mỗi đơn vị, thu từ người bán. Tìm (a) giá người mua trả, giá người bán giữ lại và lượng mới; (b) gánh nặng chia cho mỗi bên; (c) số thu thuế; (d) thặng dư tiêu dùng, thặng dư sản xuất và tổn thất vô ích.</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) Người bán giữ Ps = Pb − 6, nên viết cung theo giá người mua:
    Qs = −20 + 4(Pb − 6) = −44 + 4Pb
    100 − 2Pb = −44 + 4Pb  ->  6Pb = 144  ->  Pb = 24,  Ps = 18
    Q = 100 − 2(24) = 52      (kiểm tra: −20 + 4(18) = 52 ✓)

(b) Người mua trả thêm 24 − 20 = 4 mỗi đơn vị; người bán giữ lại ít đi 20 − 18 = 2.
    Người mua chịu 4/6 = hai phần ba số thuế.

(c) Thu thuế = 6 x 52 = 312

(d) Cầu bằng 0 tại P = 50; cung bắt đầu từ P = 5.
    Trước: CS = ½ x (50 − 20) x 60 = 900   PS = ½ x (20 − 5) x 60 = 450   tổng 1.350
    Sau:   CS = ½ x (50 − 24) x 52 = 676   PS = ½ x (18 − 5) x 52 = 338
           thu thuế 312                    tổng 1.326
    Tổn thất vô ích = 1.350 − 1.326 = 24  = ½ x 6 x (60 − 52) ✓</code></pre>
<p><strong>Vì sao:</strong> tại cân bằng cũ, cầu kém co giãn hơn cung (|Ed| = 2 × 20/60 ≈ 0,67 so với Es = 4 × 20/60 ≈ 1,33), nên người mua gánh phần lớn thuế dù người bán là người nộp tiền cho nhà nước. Khoản tổn thất vô ích 24 là thặng dư không ai nhận được — không phải người mua, người bán, cũng không phải nhà nước.</p>`,
  ]]);

const c3q = quiz('eco111-quiz-2', 'Quiz 2 — Surplus, controls & taxes|||Quiz 2 — Thặng dư, kiểm soát giá & thuế', [
  { id: 'q1', question: 'A binding price ceiling (set below the equilibrium price) causes…|||Giá trần có hiệu lực (đặt thấp hơn giá cân bằng) gây ra…', options: ['a surplus|||dư thừa', 'a shortage|||thiếu hụt', 'a higher equilibrium price|||giá cân bằng cao hơn', 'no change in quantity|||lượng không đổi'], correctIndex: 1, explanation: 'At the capped price, quantity demanded exceeds quantity supplied.|||Ở mức giá bị giới hạn, lượng cầu vượt lượng cung.' },
  { id: 'q2', question: 'The burden of a tax falls more heavily on…|||Gánh nặng của thuế rơi nhiều hơn vào…', options: ['whoever legally pays the tax|||bên nộp thuế theo luật', 'the side of the market that is less elastic|||phía thị trường kém co giãn hơn', 'the side of the market that is more elastic|||phía thị trường co giãn hơn', 'sellers, always|||người bán, trong mọi trường hợp'], correctIndex: 1, explanation: 'The less elastic side has fewer alternatives and cannot escape the tax by changing quantity.|||Phía kém co giãn có ít lựa chọn thay thế nên không né được thuế bằng cách thay đổi lượng.' },
  { id: 'q3', question: 'Why does a tax create a deadweight loss?|||Vì sao thuế tạo ra tổn thất vô ích?', options: ['Because the government wastes the revenue|||Vì chính phủ chi tiêu lãng phí số thu', 'Because it stops some mutually beneficial trades from happening|||Vì nó ngăn một số giao dịch đôi bên cùng có lợi diễn ra', 'Because prices always rise by the full tax|||Vì giá luôn tăng đúng bằng số thuế', 'Because sellers pay the tax|||Vì người bán là người nộp thuế'], correctIndex: 1, explanation: 'Quantity falls below the efficient level; the surplus from those lost trades disappears.|||Lượng giảm xuống dưới mức hiệu quả; thặng dư từ các giao dịch bị mất biến mất.' },
]);

const c4 = doc('eco111-3-1-market-failure', '3.1 — Externalities, public goods & common resources|||3.1 — Ngoại ứng, hàng hoá công & tài nguyên chung',
  'Ngoại ứng tiêu cực và tích cực, chi phí xã hội so với chi phí tư nhân, thuế Pigou, trợ cấp, quy định, giấy phép phát thải, định lý Coase; phân loại hàng hoá theo tính loại trừ và tính cạnh tranh, vấn đề người ăn không, bi kịch của mảnh đất chung.',
  [[
    `<span class="eyebrow">ECO111 · Chapters 10–11 · Lesson 3.1</span>
<h2>Externalities, public goods &amp; common resources</h2>
<h3>Externalities</h3>
<p>An <strong>externality</strong> is the uncompensated effect of one person's action on a bystander. Markets ignore it, so the equilibrium quantity is wrong:</p>
<table>
<tr><th>Type</th><th>Example</th><th>Social vs private</th><th>Market produces…</th></tr>
<tr><td>Negative</td><td>Factory pollution, traffic congestion</td><td>Social cost &gt; private cost</td><td>Too much</td></tr>
<tr><td>Positive</td><td>Education, vaccination, research</td><td>Social value &gt; private value</td><td>Too little</td></tr>
</table>
<p>Remedies:</p>
<ul>
<li><strong>Corrective (Pigouvian) taxes</strong> on negative externalities and <strong>subsidies</strong> for positive ones — they make decision makers <em>internalize</em> the external effect.</li>
<li><strong>Command-and-control regulation</strong> — e.g. emission limits.</li>
<li><strong>Tradable pollution permits</strong> — fix the total quantity and let firms trade, so cuts happen where they are cheapest.</li>
<li><strong>Private solutions</strong> — the <strong>Coase theorem</strong>: if parties can bargain at low cost, they reach an efficient outcome whatever the initial allocation of rights. In practice transaction costs often block this.</li>
</ul>
<h3>Classifying goods</h3>
<table>
<tr><th></th><th>Rival</th><th>Not rival</th></tr>
<tr><td><strong>Excludable</strong></td><td>Private goods (a bowl of phở, clothes)</td><td>Club goods (streaming service, uncrowded toll road)</td></tr>
<tr><td><strong>Not excludable</strong></td><td>Common resources (fish in the sea, clean air)</td><td>Public goods (national defence, street lighting, basic research)</td></tr>
</table>
<p><strong>Public goods</strong> suffer from the <strong>free-rider problem</strong>: people can enjoy them without paying, so private markets under-supply them — which is why governments provide them, funded by taxes, when the benefits exceed the costs. <strong>Common resources</strong> face the <strong>tragedy of the commons</strong>: each user ignores the cost they impose on others, so the resource is over-used. Remedies include quotas, fees and assigning property rights.</p>
<div class="callout"><span class="badge">Why it matters</span> "Markets are efficient" rests on assumptions. Externalities and non-excludable goods are the textbook cases where a well-designed policy can raise total surplus.</div>`,
    `<span class="eyebrow">ECO111 · Chương 10–11 · Bài 3.1</span>
<h2>Ngoại ứng, hàng hoá công &amp; tài nguyên chung</h2>
<h3>Ngoại ứng</h3>
<p><strong>Ngoại ứng</strong> là tác động không được đền bù của hành động một người lên người ngoài cuộc. Thị trường bỏ qua tác động đó, nên lượng cân bằng bị sai lệch:</p>
<table>
<tr><th>Loại</th><th>Ví dụ</th><th>Xã hội so với tư nhân</th><th>Thị trường sản xuất…</th></tr>
<tr><td>Tiêu cực</td><td>Nhà máy gây ô nhiễm, ùn tắc giao thông</td><td>Chi phí xã hội &gt; chi phí tư nhân</td><td>Quá nhiều</td></tr>
<tr><td>Tích cực</td><td>Giáo dục, tiêm chủng, nghiên cứu</td><td>Lợi ích xã hội &gt; lợi ích tư nhân</td><td>Quá ít</td></tr>
</table>
<p>Cách khắc phục:</p>
<ul>
<li><strong>Thuế điều chỉnh (thuế Pigou)</strong> với ngoại ứng tiêu cực và <strong>trợ cấp</strong> với ngoại ứng tích cực — buộc người ra quyết định <em>nội hoá</em> tác động bên ngoài.</li>
<li><strong>Quy định mệnh lệnh – kiểm soát</strong> — vd giới hạn phát thải.</li>
<li><strong>Giấy phép phát thải có thể mua bán</strong> — cố định tổng lượng và cho doanh nghiệp mua bán, để việc cắt giảm diễn ra ở nơi rẻ nhất.</li>
<li><strong>Giải pháp tư nhân</strong> — <strong>định lý Coase</strong>: nếu các bên thương lượng được với chi phí thấp, họ sẽ đạt kết cục hiệu quả bất kể quyền ban đầu thuộc về ai. Thực tế, chi phí giao dịch thường cản trở điều này.</li>
</ul>
<h3>Phân loại hàng hoá</h3>
<table>
<tr><th></th><th>Có tính cạnh tranh</th><th>Không có tính cạnh tranh</th></tr>
<tr><td><strong>Có tính loại trừ</strong></td><td>Hàng hoá tư nhân (bát phở, quần áo)</td><td>Hàng hoá câu lạc bộ (dịch vụ xem phim trực tuyến, đường thu phí vắng xe)</td></tr>
<tr><td><strong>Không có tính loại trừ</strong></td><td>Tài nguyên chung (cá ngoài biển, không khí sạch)</td><td>Hàng hoá công (quốc phòng, đèn đường, nghiên cứu cơ bản)</td></tr>
</table>
<p><strong>Hàng hoá công</strong> gặp <strong>vấn đề người ăn không (free-rider)</strong>: người ta hưởng được mà không phải trả tiền, nên thị trường tư nhân cung ứng quá ít — vì vậy chính phủ cung cấp chúng bằng tiền thuế khi lợi ích lớn hơn chi phí. <strong>Tài nguyên chung</strong> gặp <strong>bi kịch của mảnh đất chung</strong>: mỗi người dùng bỏ qua chi phí mình gây ra cho người khác, nên tài nguyên bị khai thác quá mức. Cách khắc phục gồm hạn ngạch, phí và xác lập quyền sở hữu.</p>
<div class="callout"><span class="badge">Vì sao quan trọng</span> "Thị trường hiệu quả" dựa trên các giả định. Ngoại ứng và hàng hoá không loại trừ là những trường hợp kinh điển mà một chính sách được thiết kế tốt có thể làm tăng tổng thặng dư.</div>`,
  ]]);

const c5 = doc('eco111-3-2-costs', '3.2 — The costs of production|||3.2 — Chi phí sản xuất',
  'Lợi nhuận kinh tế và lợi nhuận kế toán (chi phí ẩn), hàm sản xuất và sản phẩm cận biên giảm dần, chi phí cố định, biến đổi, tổng, bình quân, cận biên, đường MC cắt ATC tại cực tiểu, ngắn hạn và dài hạn, tính kinh tế theo quy mô.',
  [[
    `<span class="eyebrow">ECO111 · Chapter 13 · Lesson 3.2</span>
<h2>The costs of production</h2>
<h3>Economic vs accounting profit</h3>
<p>Firms aim to maximize profit = total revenue − total cost. Economists count <strong>all opportunity costs</strong>: <em>explicit</em> costs (cash paid for wages, rent, materials) and <em>implicit</em> costs (the salary the owner gives up, the return her capital could earn elsewhere). So <strong>economic profit</strong> = revenue − explicit − implicit costs, which is smaller than <strong>accounting profit</strong> = revenue − explicit costs. Zero economic profit means the owner earns exactly what she could elsewhere — a normal return.</p>
<h3>Production and diminishing marginal product</h3>
<p>The <strong>production function</strong> links inputs to output. <strong>Marginal product</strong> is the extra output from one more unit of an input. With a fixed factory, adding workers eventually yields <strong>diminishing marginal product</strong> — each extra worker adds less than the one before. This is why marginal cost eventually rises.</p>
<h3>The cost family</h3>
<table>
<tr><th>Cost</th><th>Definition</th></tr>
<tr><td>Fixed cost (FC)</td><td>Does not vary with output in the short run (rent, insurance)</td></tr>
<tr><td>Variable cost (VC)</td><td>Varies with output (materials, hourly labour)</td></tr>
<tr><td>Total cost (TC)</td><td>FC + VC</td></tr>
<tr><td>Average total cost (ATC)</td><td>TC ÷ Q = AFC + AVC</td></tr>
<tr><td>Marginal cost (MC)</td><td>ΔTC ÷ ΔQ — the cost of one more unit</td></tr>
</table>
<p>Typical shapes: AFC always falls; MC first falls then rises (diminishing marginal product); ATC is <strong>U-shaped</strong>. <strong>MC cuts ATC (and AVC) at its minimum</strong>: whenever the marginal unit costs less than the average, it pulls the average down, and vice versa. The output with the lowest ATC is the <strong>efficient scale</strong>.</p>
<h3>Short run vs long run</h3>
<p>In the long run every input is variable. The long-run ATC curve shows <strong>economies of scale</strong> (ATC falls as output grows — specialization, bulk buying), then <strong>constant returns</strong>, then <strong>diseconomies of scale</strong> (coordination problems in very large organizations).</p>
<div class="callout"><span class="badge">Sunk costs</span> A cost already paid and unrecoverable should not affect decisions. Only costs that change with the choice — marginal costs — matter.</div>`,
    `<span class="eyebrow">ECO111 · Chương 13 · Bài 3.2</span>
<h2>Chi phí sản xuất</h2>
<h3>Lợi nhuận kinh tế và lợi nhuận kế toán</h3>
<p>Doanh nghiệp tìm cách tối đa hoá lợi nhuận = tổng doanh thu − tổng chi phí. Nhà kinh tế tính <strong>mọi chi phí cơ hội</strong>: chi phí <em>hiện</em> (tiền trả lương, thuê mặt bằng, nguyên liệu) và chi phí <em>ẩn</em> (khoản lương chủ doanh nghiệp bỏ lỡ, lợi tức vốn của cô ấy có thể thu được ở nơi khác). Vì vậy <strong>lợi nhuận kinh tế</strong> = doanh thu − chi phí hiện − chi phí ẩn, nhỏ hơn <strong>lợi nhuận kế toán</strong> = doanh thu − chi phí hiện. Lợi nhuận kinh tế bằng 0 nghĩa là chủ sở hữu kiếm được đúng bằng mức có thể kiếm ở nơi khác — một mức lợi tức bình thường.</p>
<h3>Sản xuất và sản phẩm cận biên giảm dần</h3>
<p><strong>Hàm sản xuất</strong> liên hệ đầu vào với đầu ra. <strong>Sản phẩm cận biên</strong> là sản lượng tăng thêm khi dùng thêm một đơn vị đầu vào. Với nhà xưởng cố định, thêm công nhân tới một lúc sẽ gặp <strong>sản phẩm cận biên giảm dần</strong> — mỗi người thêm vào làm ra ít hơn người trước. Đó là lý do chi phí cận biên cuối cùng sẽ tăng.</p>
<h3>Họ các loại chi phí</h3>
<table>
<tr><th>Chi phí</th><th>Định nghĩa</th></tr>
<tr><td>Chi phí cố định (FC)</td><td>Không đổi theo sản lượng trong ngắn hạn (thuê nhà, bảo hiểm)</td></tr>
<tr><td>Chi phí biến đổi (VC)</td><td>Thay đổi theo sản lượng (nguyên liệu, lao động theo giờ)</td></tr>
<tr><td>Tổng chi phí (TC)</td><td>FC + VC</td></tr>
<tr><td>Chi phí bình quân (ATC)</td><td>TC ÷ Q = AFC + AVC</td></tr>
<tr><td>Chi phí cận biên (MC)</td><td>ΔTC ÷ ΔQ — chi phí của thêm một đơn vị</td></tr>
</table>
<p>Hình dạng điển hình: AFC luôn giảm; MC giảm rồi tăng (do sản phẩm cận biên giảm dần); ATC có <strong>dạng chữ U</strong>. <strong>Đường MC cắt ATC (và AVC) tại điểm cực tiểu</strong>: khi đơn vị cận biên rẻ hơn mức bình quân, nó kéo bình quân xuống, và ngược lại. Sản lượng có ATC thấp nhất là <strong>quy mô hiệu quả</strong>.</p>
<h3>Ngắn hạn và dài hạn</h3>
<p>Trong dài hạn mọi đầu vào đều thay đổi được. Đường ATC dài hạn cho thấy <strong>tính kinh tế theo quy mô</strong> (ATC giảm khi sản lượng tăng — nhờ chuyên môn hoá, mua số lượng lớn), rồi <strong>lợi suất không đổi</strong>, rồi <strong>tính phi kinh tế theo quy mô</strong> (khó phối hợp trong tổ chức quá lớn).</p>
<div class="callout"><span class="badge">Chi phí chìm</span> Khoản chi đã trả và không thu hồi được không nên ảnh hưởng tới quyết định. Chỉ những chi phí thay đổi theo lựa chọn — chi phí cận biên — mới quan trọng.</div>`,
  ]]);

const c5e = doc('eco111-3-3-exercise', 'Exercise 3 — building a cost table|||Bài tập 3 — lập bảng chi phí',
  'Bài tập: từ tổng chi phí theo sản lượng, tính chi phí biến đổi, cận biên, biến đổi bình quân và tổng bình quân; xác định quy mô hiệu quả, giá đóng cửa và giá hoà vốn; kèm lời giải.',
  [[
    `<span class="eyebrow">ECO111 · Chapter 13 · Exercise</span>
<h2>Exercise 3 — a bakery's cost table</h2>
<div class="callout"><span class="badge">Problem</span> A small bakery has a fixed cost of 100 (thousand VND per hour). Its total cost at outputs 0–6 batches is: 100, 150, 180, 200, 240, 290, 380. (a) Compute VC, MC, AVC and ATC. (b) What is the efficient scale? (c) Below what price should a competitive bakery shut down in the short run, and at what price does it break even?</div>
<h3>Worked solution</h3>
<pre><code class="language-text">Q    TC    VC    MC     AVC     ATC
0    100     0    –       –       –
1    150    50    50    50.00   150.00
2    180    80    30    40.00    90.00
3    200   100    20    33.33    66.67
4    240   140    40    35.00    60.00
5    290   190    50    38.00    58.00
6    380   280    90    46.67    63.33

(b) ATC is lowest (58) at Q = 5 -> efficient scale = 5 batches.
    Check: MC(5) = 50 &lt; ATC(4) = 60 pulls the average down to 58;
           MC(6) = 90 &gt; 58 pushes it up to 63.33.
(c) Shut-down price = minimum AVC = 33.33
    Break-even price = minimum ATC = 58</code></pre>
<p><strong>Why:</strong> in the short run the fixed 100 must be paid anyway, so the bakery keeps producing as long as the price covers <em>variable</em> cost (P ≥ min AVC). It earns zero economic profit only when the price reaches minimum ATC. You will reuse this table in lesson 4.1.</p>`,
    `<span class="eyebrow">ECO111 · Chương 13 · Bài tập</span>
<h2>Bài tập 3 — bảng chi phí của một tiệm bánh</h2>
<div class="callout"><span class="badge">Đề</span> Một tiệm bánh nhỏ có chi phí cố định 100 (nghìn đồng mỗi giờ). Tổng chi phí tại các mức sản lượng 0–6 mẻ bánh lần lượt là: 100, 150, 180, 200, 240, 290, 380. (a) Tính VC, MC, AVC và ATC. (b) Quy mô hiệu quả là bao nhiêu? (c) Tiệm bánh cạnh tranh nên đóng cửa trong ngắn hạn khi giá thấp hơn mức nào, và hoà vốn ở mức giá nào?</div>
<h3>Lời giải</h3>
<pre><code class="language-text">Q    TC    VC    MC     AVC     ATC
0    100     0    –       –       –
1    150    50    50    50,00   150,00
2    180    80    30    40,00    90,00
3    200   100    20    33,33    66,67
4    240   140    40    35,00    60,00
5    290   190    50    38,00    58,00
6    380   280    90    46,67    63,33

(b) ATC thấp nhất (58) tại Q = 5 -> quy mô hiệu quả = 5 mẻ.
    Kiểm tra: MC(5) = 50 &lt; ATC(4) = 60 kéo bình quân xuống 58;
              MC(6) = 90 &gt; 58 đẩy bình quân lên 63,33.
(c) Giá đóng cửa = AVC nhỏ nhất = 33,33
    Giá hoà vốn  = ATC nhỏ nhất = 58</code></pre>
<p><strong>Vì sao:</strong> trong ngắn hạn khoản cố định 100 vẫn phải trả dù có sản xuất hay không, nên tiệm bánh tiếp tục sản xuất khi giá còn bù được chi phí <em>biến đổi</em> (P ≥ AVC nhỏ nhất). Nó chỉ đạt lợi nhuận kinh tế bằng 0 khi giá bằng ATC nhỏ nhất. Bạn sẽ dùng lại bảng này ở bài 4.1.</p>`,
  ]]);

const c5q = quiz('eco111-quiz-3', 'Quiz 3 — Market failure & costs|||Quiz 3 — Thất bại thị trường & chi phí', [
  { id: 'q1', question: 'A chemical plant pollutes a river. Which policy makes the plant internalize the externality?|||Một nhà máy hoá chất làm ô nhiễm sông. Chính sách nào buộc nhà máy nội hoá ngoại ứng?', options: ['A subsidy on its output|||Trợ cấp cho sản lượng của nhà máy', 'A corrective (Pigouvian) tax per unit of pollution|||Thuế điều chỉnh (thuế Pigou) theo mỗi đơn vị ô nhiễm', 'A price ceiling on chemicals|||Giá trần cho hoá chất', 'Doing nothing|||Không làm gì'], correctIndex: 1, explanation: 'The tax raises the private cost to the social cost, so output falls toward the efficient level.|||Thuế nâng chi phí tư nhân lên bằng chi phí xã hội, nên sản lượng giảm về mức hiệu quả.' },
  { id: 'q2', question: 'Street lighting is a public good because it is…|||Đèn đường là hàng hoá công vì nó…', options: ['excludable and rival|||có tính loại trừ và cạnh tranh', 'not excludable and not rival|||không loại trừ và không cạnh tranh', 'excludable but not rival|||có tính loại trừ nhưng không cạnh tranh', 'rival but not excludable|||có tính cạnh tranh nhưng không loại trừ'], correctIndex: 1, explanation: 'No one can be kept from the light, and one person’s use does not reduce another’s — so free riders appear.|||Không ngăn được ai dùng ánh sáng, và người này dùng không làm giảm phần của người khác — nên xuất hiện người ăn không.' },
  { id: 'q3', question: 'Marginal cost intersects average total cost at…|||Đường chi phí cận biên cắt đường chi phí bình quân tại…', options: ['the maximum of ATC|||điểm cực đại của ATC', 'the minimum of ATC|||điểm cực tiểu của ATC', 'zero output|||sản lượng bằng 0', 'the point where fixed cost is highest|||điểm chi phí cố định cao nhất'], correctIndex: 1, explanation: 'Below the average, MC pulls ATC down; above it, MC pushes ATC up — so they cross at the bottom of the U.|||Khi thấp hơn bình quân, MC kéo ATC xuống; khi cao hơn, MC đẩy ATC lên — nên hai đường cắt nhau ở đáy chữ U.' },
]);

const c6 = doc('eco111-4-1-competition-monopoly', '4.1 — Perfect competition & monopoly|||4.1 — Cạnh tranh hoàn hảo & độc quyền',
  'Doanh nghiệp chấp nhận giá, quy tắc MR = MC, quyết định sản xuất hay đóng cửa ngắn hạn (dùng lại bảng chi phí), gia nhập và rút lui dài hạn; độc quyền: rào cản gia nhập, MR nhỏ hơn giá, ví dụ số và tổn thất vô ích, phân biệt giá, chính sách công.',
  [[
    `<span class="eyebrow">ECO111 · Chapters 14–15 · Lesson 4.1</span>
<h2>Perfect competition &amp; monopoly</h2>
<h3>Perfect competition</h3>
<p>Many buyers and sellers, identical products, free entry and exit: each firm is a <strong>price taker</strong>, so price = average revenue = marginal revenue. Every firm maximizes profit where <strong>MR = MC</strong>, which for a competitive firm means <strong>P = MC</strong>.</p>
<pre><code>Using the bakery table of Exercise 3, suppose the market price is 50:
produce every batch whose MC ≤ 50  ->  batches 1–5 (MC 50, 30, 20, 40, 50);
batch 6 costs 90 &gt; 50, so stop at Q = 5.
Revenue 5 x 50 = 250;  TC 290  ->  loss of 40.
Shut down instead? Loss would be the whole fixed cost, 100.
Since P = 50 &gt; AVC = 38, producing loses less -> keep producing.</code></pre>
<ul>
<li><strong>Short run:</strong> shut down if P &lt; minimum AVC. The firm's supply curve is its MC curve above minimum AVC.</li>
<li><strong>Long run:</strong> profits attract entry and losses cause exit, until price equals minimum ATC and economic profit is zero — firms operate at the efficient scale.</li>
</ul>
<h3>Monopoly</h3>
<p>A monopoly is the sole seller of a product without close substitutes. It exists because of <strong>barriers to entry</strong>: control of a key resource, government-granted rights (patents, licences), or economies of scale so large that one firm can serve the whole market cheaply (a <strong>natural monopoly</strong>, e.g. the electricity grid). A monopoly is a <strong>price maker</strong>: to sell more it must cut the price on all units, so <strong>MR &lt; P</strong>.</p>
<pre><code>Demand: P = 100 − Q      MC = 20 (constant), no fixed cost
MR = 100 − 2Q ;  set MR = MC  ->  Q = 40,  P = 100 − 40 = 60
Profit = (60 − 20) x 40 = 1,600
A competitive market would produce where P = MC: Q = 80, P = 20
Deadweight loss = ½ x (60 − 20) x (80 − 40) = 800</code></pre>
<p>The monopolist charges a price above marginal cost and produces too little, creating a deadweight loss. <strong>Price discrimination</strong> (charging different customers different prices — student fares, airline tickets) can raise its profit and output. Policy responses: competition (antitrust) law, price regulation of natural monopolies, public ownership, or doing nothing when the cure is worse than the disease.</p>
<div class="callout"><span class="badge">One rule for all</span> Every profit-maximizing firm, competitive or not, produces where MR = MC. What differs is the relation between MR and price.</div>`,
    `<span class="eyebrow">ECO111 · Chương 14–15 · Bài 4.1</span>
<h2>Cạnh tranh hoàn hảo &amp; độc quyền</h2>
<h3>Cạnh tranh hoàn hảo</h3>
<p>Nhiều người mua và người bán, sản phẩm đồng nhất, tự do gia nhập và rút lui: mỗi doanh nghiệp là <strong>người chấp nhận giá</strong>, nên giá = doanh thu bình quân = doanh thu cận biên. Mọi doanh nghiệp tối đa hoá lợi nhuận tại <strong>MR = MC</strong>, với doanh nghiệp cạnh tranh nghĩa là <strong>P = MC</strong>.</p>
<pre><code>Dùng bảng chi phí tiệm bánh ở Bài tập 3, giả sử giá thị trường là 50:
sản xuất mọi mẻ có MC ≤ 50  ->  mẻ 1–5 (MC 50, 30, 20, 40, 50);
mẻ 6 tốn 90 &gt; 50, nên dừng ở Q = 5.
Doanh thu 5 x 50 = 250;  TC 290  ->  lỗ 40.
Đóng cửa thì sao? Sẽ lỗ toàn bộ chi phí cố định, 100.
Vì P = 50 &gt; AVC = 38, sản xuất lỗ ít hơn -> tiếp tục sản xuất.</code></pre>
<ul>
<li><strong>Ngắn hạn:</strong> đóng cửa nếu P &lt; AVC nhỏ nhất. Đường cung của doanh nghiệp là phần đường MC nằm trên AVC nhỏ nhất.</li>
<li><strong>Dài hạn:</strong> lợi nhuận thu hút doanh nghiệp mới gia nhập, thua lỗ khiến doanh nghiệp rút lui, cho tới khi giá bằng ATC nhỏ nhất và lợi nhuận kinh tế bằng 0 — doanh nghiệp hoạt động ở quy mô hiệu quả.</li>
</ul>
<h3>Độc quyền</h3>
<p>Doanh nghiệp độc quyền là người bán duy nhất một sản phẩm không có hàng thay thế gần. Độc quyền tồn tại nhờ <strong>rào cản gia nhập</strong>: kiểm soát nguồn lực then chốt, quyền do nhà nước cấp (bằng sáng chế, giấy phép), hoặc tính kinh tế theo quy mô lớn tới mức một doanh nghiệp phục vụ cả thị trường rẻ nhất (<strong>độc quyền tự nhiên</strong>, vd lưới truyền tải điện). Doanh nghiệp độc quyền là <strong>người định giá</strong>: muốn bán thêm phải giảm giá trên mọi đơn vị, nên <strong>MR &lt; P</strong>.</p>
<pre><code>Cầu: P = 100 − Q      MC = 20 (không đổi), không có chi phí cố định
MR = 100 − 2Q ;  cho MR = MC  ->  Q = 40,  P = 100 − 40 = 60
Lợi nhuận = (60 − 20) x 40 = 1.600
Thị trường cạnh tranh sẽ sản xuất tại P = MC: Q = 80, P = 20
Tổn thất vô ích = ½ x (60 − 20) x (80 − 40) = 800</code></pre>
<p>Doanh nghiệp độc quyền đặt giá cao hơn chi phí cận biên và sản xuất quá ít, gây tổn thất vô ích. <strong>Phân biệt giá</strong> (bán cùng sản phẩm với giá khác nhau cho các khách hàng khác nhau — vé sinh viên, vé máy bay) có thể làm tăng lợi nhuận và sản lượng của nó. Chính sách đáp lại: luật cạnh tranh (chống độc quyền), điều tiết giá với độc quyền tự nhiên, sở hữu nhà nước, hoặc không can thiệp khi "thuốc" tệ hơn "bệnh".</p>
<div class="callout"><span class="badge">Một quy tắc chung</span> Mọi doanh nghiệp tối đa hoá lợi nhuận, cạnh tranh hay không, đều sản xuất tại MR = MC. Điều khác nhau là quan hệ giữa MR và giá.</div>`,
  ]]);

const c7 = doc('eco111-4-2-imperfect-competition', '4.2 — Monopolistic competition, oligopoly & game theory|||4.2 — Cạnh tranh độc quyền, độc quyền nhóm & lý thuyết trò chơi',
  'Cạnh tranh độc quyền (khác biệt hoá, dư công suất, quảng cáo), độc quyền nhóm và sự phụ thuộc lẫn nhau, thế lưỡng nan của người tù với ma trận lợi ích, chiến lược trội, cân bằng Nash, cartel; bảng so sánh bốn cấu trúc thị trường.',
  [[
    `<span class="eyebrow">ECO111 · Chapters 16–17 · Lesson 4.2</span>
<h2>Monopolistic competition, oligopoly &amp; game theory</h2>
<h3>Monopolistic competition</h3>
<p>Many sellers, <strong>differentiated products</strong> (cafés, clothing brands, restaurants) and free entry. Each firm faces a downward-sloping demand curve and sets P &gt; MC. Short-run profits attract new entrants, which pull each firm's demand down until <strong>economic profit is zero</strong> in the long run — but, unlike perfect competition, firms operate with <strong>excess capacity</strong> (below efficient scale) and charge a <strong>markup</strong> over marginal cost. Advertising and brand names are central: they inform buyers and signal quality, but can also create perceived differences.</p>
<h3>Oligopoly</h3>
<p>A few sellers dominate (telecom networks, airlines, cement). Each firm's best choice depends on what the others do — <strong>strategic interdependence</strong>, analysed with <strong>game theory</strong>. Two cafés on the same street each choose a high or a low price (monthly profit, million VND; first number = café A):</p>
<table>
<tr><th></th><th>B: High price</th><th>B: Low price</th></tr>
<tr><td><strong>A: High price</strong></td><td>10 , 10</td><td>4 , 14</td></tr>
<tr><td><strong>A: Low price</strong></td><td>14 , 4</td><td>6 , 6</td></tr>
</table>
<p>Whatever B does, A earns more with a low price (14 &gt; 10 and 6 &gt; 4): Low is A's <strong>dominant strategy</strong>, and by symmetry B's too. The outcome (Low, Low) is a <strong>Nash equilibrium</strong> — no player can do better by changing strategy alone — even though (High, High) would give both more. This <strong>prisoner's dilemma</strong> explains why cartels such as OPEC find cooperation hard to sustain, and why competition law forbids price-fixing agreements. In repeated games, strategies like tit-for-tat can support cooperation.</p>
<h3>The four market structures</h3>
<table>
<tr><th></th><th>Perfect competition</th><th>Monopolistic competition</th><th>Oligopoly</th><th>Monopoly</th></tr>
<tr><td>Number of firms</td><td>Many</td><td>Many</td><td>Few</td><td>One</td></tr>
<tr><td>Product</td><td>Identical</td><td>Differentiated</td><td>Identical or differentiated</td><td>Unique</td></tr>
<tr><td>Entry</td><td>Free</td><td>Free</td><td>Barriers</td><td>Blocked</td></tr>
<tr><td>Price vs MC</td><td>P = MC</td><td>P &gt; MC</td><td>P &gt; MC</td><td>P &gt; MC</td></tr>
<tr><td>Long-run economic profit</td><td>Zero</td><td>Zero</td><td>Possible</td><td>Possible</td></tr>
</table>
<div class="callout"><span class="badge">Takeaway</span> The fewer and more protected the sellers, the further price rises above marginal cost — and the more room there is for public policy to promote competition.</div>`,
    `<span class="eyebrow">ECO111 · Chương 16–17 · Bài 4.2</span>
<h2>Cạnh tranh độc quyền, độc quyền nhóm &amp; lý thuyết trò chơi</h2>
<h3>Cạnh tranh độc quyền</h3>
<p>Nhiều người bán, <strong>sản phẩm khác biệt</strong> (quán cà phê, thương hiệu quần áo, nhà hàng) và tự do gia nhập. Mỗi doanh nghiệp đối mặt đường cầu dốc xuống và đặt P &gt; MC. Lợi nhuận ngắn hạn thu hút doanh nghiệp mới, kéo cầu của từng doanh nghiệp xuống cho tới khi <strong>lợi nhuận kinh tế bằng 0</strong> trong dài hạn — nhưng khác cạnh tranh hoàn hảo, doanh nghiệp hoạt động với <strong>dư thừa công suất</strong> (dưới quy mô hiệu quả) và đặt <strong>mức cộng thêm (markup)</strong> trên chi phí cận biên. Quảng cáo và thương hiệu giữ vai trò trung tâm: chúng cung cấp thông tin và phát tín hiệu chất lượng, nhưng cũng có thể tạo ra khác biệt do cảm nhận.</p>
<h3>Độc quyền nhóm</h3>
<p>Một vài người bán chi phối thị trường (mạng viễn thông, hàng không, xi măng). Lựa chọn tốt nhất của mỗi doanh nghiệp phụ thuộc vào việc các doanh nghiệp khác làm gì — <strong>sự phụ thuộc chiến lược</strong>, được phân tích bằng <strong>lý thuyết trò chơi</strong>. Hai quán cà phê cùng một con phố, mỗi quán chọn giá cao hoặc giá thấp (lợi nhuận tháng, triệu đồng; số đầu là quán A):</p>
<table>
<tr><th></th><th>B: Giá cao</th><th>B: Giá thấp</th></tr>
<tr><td><strong>A: Giá cao</strong></td><td>10 , 10</td><td>4 , 14</td></tr>
<tr><td><strong>A: Giá thấp</strong></td><td>14 , 4</td><td>6 , 6</td></tr>
</table>
<p>Dù B làm gì, A cũng được nhiều hơn khi đặt giá thấp (14 &gt; 10 và 6 &gt; 4): giá thấp là <strong>chiến lược trội</strong> của A, và do đối xứng cũng là của B. Kết cục (Thấp, Thấp) là <strong>cân bằng Nash</strong> — không người chơi nào tự đổi chiến lược mà được lợi hơn — dù (Cao, Cao) mang lại nhiều hơn cho cả hai. <strong>Thế lưỡng nan của người tù</strong> này giải thích vì sao các cartel như OPEC khó duy trì hợp tác, và vì sao luật cạnh tranh cấm thoả thuận ấn định giá. Trong trò chơi lặp lại, những chiến lược như "ăn miếng trả miếng" có thể duy trì được hợp tác.</p>
<h3>Bốn cấu trúc thị trường</h3>
<table>
<tr><th></th><th>Cạnh tranh hoàn hảo</th><th>Cạnh tranh độc quyền</th><th>Độc quyền nhóm</th><th>Độc quyền</th></tr>
<tr><td>Số doanh nghiệp</td><td>Nhiều</td><td>Nhiều</td><td>Ít</td><td>Một</td></tr>
<tr><td>Sản phẩm</td><td>Đồng nhất</td><td>Khác biệt</td><td>Đồng nhất hoặc khác biệt</td><td>Duy nhất</td></tr>
<tr><td>Gia nhập</td><td>Tự do</td><td>Tự do</td><td>Có rào cản</td><td>Bị chặn</td></tr>
<tr><td>Giá so với MC</td><td>P = MC</td><td>P &gt; MC</td><td>P &gt; MC</td><td>P &gt; MC</td></tr>
<tr><td>Lợi nhuận kinh tế dài hạn</td><td>Bằng 0</td><td>Bằng 0</td><td>Có thể có</td><td>Có thể có</td></tr>
</table>
<div class="callout"><span class="badge">Rút ra</span> Người bán càng ít và càng được bảo vệ, giá càng cao hơn chi phí cận biên — và càng có chỗ cho chính sách công thúc đẩy cạnh tranh.</div>`,
  ]]);

const c6q = quiz('eco111-quiz-4', 'Quiz 4 — Market structures|||Quiz 4 — Cấu trúc thị trường', [
  { id: 'q1', question: 'A perfectly competitive firm maximizes profit by producing where…|||Doanh nghiệp cạnh tranh hoàn hảo tối đa hoá lợi nhuận bằng cách sản xuất tại…', options: ['price equals average total cost|||giá bằng chi phí bình quân', 'price equals marginal cost|||giá bằng chi phí cận biên', 'total revenue is highest|||tổng doanh thu cao nhất', 'fixed cost is covered|||chi phí cố định được bù đắp'], correctIndex: 1, explanation: 'For a price taker MR = P, so the rule MR = MC becomes P = MC.|||Với người chấp nhận giá, MR = P, nên quy tắc MR = MC trở thành P = MC.' },
  { id: 'q2', question: 'Why is a monopolist’s marginal revenue below the price?|||Vì sao doanh thu cận biên của doanh nghiệp độc quyền thấp hơn giá?', options: ['Because its costs are higher|||Vì chi phí của nó cao hơn', 'Because to sell one more unit it must lower the price on all units|||Vì muốn bán thêm một đơn vị, nó phải giảm giá trên mọi đơn vị', 'Because the government taxes it|||Vì chính phủ đánh thuế nó', 'Because demand is perfectly elastic|||Vì cầu co giãn hoàn toàn'], correctIndex: 1, explanation: 'The extra unit brings in its price, minus the revenue lost on the units that were already selling at the higher price.|||Đơn vị thêm mang về giá của nó, trừ đi phần doanh thu mất trên các đơn vị trước đó vốn bán được giá cao hơn.' },
  { id: 'q3', question: 'A Nash equilibrium is a situation in which…|||Cân bằng Nash là tình huống trong đó…', options: ['all players earn the highest possible joint profit|||mọi người chơi đạt tổng lợi nhuận cao nhất có thể', 'no player can gain by changing strategy while the others keep theirs|||không người chơi nào được lợi hơn khi tự đổi chiến lược trong lúc người khác giữ nguyên', 'the government sets the price|||chính phủ ấn định giá', 'firms always cooperate|||các doanh nghiệp luôn hợp tác'], correctIndex: 1, explanation: 'In the prisoner’s dilemma the Nash equilibrium (Low, Low) is worse for both than (High, High).|||Trong thế lưỡng nan của người tù, cân bằng Nash (Thấp, Thấp) tệ hơn (Cao, Cao) với cả hai.' },
]);

export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'ECO111',
    slug: 'eco111-microeconomics',
    title: 'Microeconomics',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/ECO111.webp',
    shortDescription: 'How households and firms decide and how markets work: supply and demand, elasticity, surplus, price controls and taxes, externalities and public goods, costs of production, competition, monopoly and game theory. Bilingual, with exercises and quizzes.|||Hộ gia đình và doanh nghiệp ra quyết định thế nào, thị trường vận hành ra sao: cung cầu, co giãn, thặng dư, thuế, ngoại ứng, chi phí, cạnh tranh, độc quyền, lý thuyết trò chơi. Song ngữ, có bài tập và quiz.',
    description: 'Môn <strong>ECO111 — Microeconomics (Kinh tế vi mô)</strong> (khối Quản trị Kinh doanh, kỳ 1) giúp hiểu cách <strong>hộ gia đình và doanh nghiệp ra quyết định</strong> và cách <strong>thị trường</strong> hình thành giá. Từ <strong>tư duy kinh tế</strong> (chi phí cơ hội, cận biên, lợi thế so sánh) → <strong>cung, cầu và độ co giãn</strong> → <strong>thặng dư, kiểm soát giá, thuế</strong> và thương mại → <strong>ngoại ứng, hàng hoá công</strong> và <strong>chi phí sản xuất</strong> → <strong>cạnh tranh hoàn hảo, độc quyền, cạnh tranh độc quyền, độc quyền nhóm</strong> và lý thuyết trò chơi. Bám cấu trúc giáo trình kinh tế vi mô nhập môn chuẩn, song ngữ Anh–Việt, có ví dụ số đã kiểm, bài tập kèm lời giải và quiz cuối mỗi chương.',
    whatYouLearn: 'Giải thích chi phí cơ hội, tư duy cận biên, đường PPF và lợi thế so sánh\nPhân tích dịch chuyển cung cầu và tìm cân bằng từ phương trình\nTính độ co giãn (trung điểm, điểm, thu nhập, chéo) và liên hệ với tổng doanh thu\nĐo thặng dư tiêu dùng, sản xuất; phân tích giá trần, giá sàn\nTính gánh nặng thuế cho mỗi bên và tổn thất vô ích\nNhận diện ngoại ứng, hàng hoá công, tài nguyên chung và cách khắc phục\nLập bảng chi phí (FC, VC, MC, AVC, ATC) và xác định quy mô hiệu quả\nSo sánh bốn cấu trúc thị trường; giải thế lưỡng nan của người tù',
    requirements: 'Không cần kiến thức kinh tế trước\nĐại số phổ thông: giải phương trình bậc nhất, đọc đồ thị đường thẳng\nChuẩn bị giấy bút để vẽ đồ thị cung cầu khi học',
  },
  sections: [
    { title: 'Course introduction|||Giới thiệu môn học', description: 'Khan hiếm, chi phí cơ hội, PPF, lợi thế so sánh.', lessons: [intro] },
    { title: 'Part 1 — Supply, demand & elasticity|||Phần 1 — Cung, cầu & độ co giãn', description: 'Luật cầu, luật cung, cân bằng, co giãn và doanh thu.', lessons: [c1, c2, c1e, c1q] },
    { title: 'Part 2 — Markets & government|||Phần 2 — Thị trường & chính phủ', description: 'Thặng dư, giá trần, giá sàn, thuế, thương mại.', lessons: [c3, c3e, c3q] },
    { title: 'Part 3 — Market failure & costs of production|||Phần 3 — Thất bại thị trường & chi phí sản xuất', description: 'Ngoại ứng, hàng hoá công, bảng chi phí, quy mô hiệu quả.', lessons: [c4, c5, c5e, c5q] },
    { title: 'Part 4 — Market structures|||Phần 4 — Cấu trúc thị trường', description: 'Cạnh tranh hoàn hảo, độc quyền, độc quyền nhóm, trò chơi.', lessons: [c6, c7, c6q] },
  ],
};
