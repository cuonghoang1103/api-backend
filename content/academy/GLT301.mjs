/**
 * GLT301 — International Transport Management (Quản trị vận tải quốc tế). Khối Quản trị Kinh doanh, kỳ 3.
 * Bám cấu trúc giáo trình vận tải & logistics quốc tế chuẩn (vd Alan Branch — Elements of Shipping,
 * Export Practice and Management; Pierre David — International Logistics) + tài liệu chính thức
 * (ICC Incoterms 2020 — CHỈ tóm tắt, không chép văn bản ICC; IMO; IATA; UNCITRAL): vai trò vận tải &
 * so sánh phương thức, vận tải biển (tàu chợ/tàu chạy rông, loại tàu, thuê tàu, laytime), container
 * & cước (FCL/LCL, W/M, phụ phí), vận đơn & khung pháp lý, hàng không & đa phương thức, Incoterms,
 * bảo hiểm hàng hoá, vận tải bền vững & cảng Việt Nam. Song ngữ + ví dụ số (đã kiểm bằng máy; mọi
 * mức cước/phụ phí là GIẢ ĐỊNH minh hoạ; giới hạn trách nhiệm SDR luôn kèm rào "kiểm văn bản công ước").
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('glt301-0-1-overview', 'Course overview: moving goods across borders|||Tổng quan: đưa hàng hoá qua biên giới',
  'Vận tải là mắt xích vật chất của thương mại quốc tế: nhà quản trị vận tải quyết định gì, các bên tham gia một lô hàng xuất nhập khẩu, các công cụ sẽ học và lộ trình năm phần của môn.',
  [[
    `<span class="eyebrow">GLT301 · Lesson 0.1 · Overview</span>
<h2>International Transport Management</h2>
<p class="lead">A sales contract between a buyer in Rotterdam and a seller in Ho Chi Minh City is only a promise until the goods physically arrive. International transport is the part of trade that turns the promise into delivery — and it decides a large share of the cost, the lead time and the risk of every export or import.</p>
<h3>What an international transport manager decides</h3>
<table>
<tr><th>Decision</th><th>Typical question</th><th>Tool you will learn</th></tr>
<tr><td>Mode and route</td><td>Sea, air, road, rail or a combination? Through which ports and hubs?</td><td>Cost–time–risk comparison, total landed cost</td></tr>
<tr><td>Carrier and contract</td><td>Book space with a liner, charter a whole ship, or use a forwarder?</td><td>Liner booking, charter parties, laytime and demurrage</td></tr>
<tr><td>Freight calculation</td><td>How is the price built, and when is a full container cheaper?</td><td>FCL vs LCL, W/M, surcharges, air chargeable weight</td></tr>
<tr><td>Documents and liability</td><td>Which document controls the goods, and what can we claim if cargo is lost?</td><td>Bill of lading, sea waybill, air waybill, liability conventions</td></tr>
<tr><td>Terms of delivery and insurance</td><td>Where does risk pass from seller to buyer, and who insures what?</td><td>Incoterms 2020 (published by ICC, the International Chamber of Commerce), Institute Cargo Clauses (issued by the London insurance market, not by ICC)</td></tr>
<tr><td>Performance and sustainability</td><td>Is the service reliable, compliant and low-carbon enough?</td><td>IMO 2020, emissions accounting, port choice</td></tr>
</table>
<h3>Who takes part in one shipment</h3>
<ul>
<li><strong>Shipper (consignor)</strong> — sends the goods; often the exporter. <strong>Consignee</strong> — receives them; often the importer. A <strong>notify party</strong> is told when the goods arrive.</li>
<li><strong>Carrier</strong> — performs or undertakes the carriage: a shipping line, an airline, a trucking or rail company.</li>
<li><strong>Freight forwarder</strong> — organises transport for the shipper, books space, prepares documents, often consolidates small shipments; an <strong>NVOCC</strong> goes further and issues its own bill of lading as carrier.</li>
<li><strong>Customs broker</strong> — handles export and import clearance. <strong>Port and terminal operators</strong> — load, unload and store cargo.</li>
<li><strong>Insurer</strong> — covers loss of or damage to the goods. <strong>Banks</strong> — pay against transport documents under documentary credits.</li>
</ul>
<h3>Roadmap</h3>
<p>Part 1: the role of transport and the modes compared · Part 2: ocean shipping markets, ship types and chartering · Part 3: containers, freight, the bill of lading and liability rules · Part 4: air, road, rail and multimodal transport · Part 5: Incoterms 2020, cargo insurance, sustainable transport and Vietnam’s ports. All cases and rates in this course are illustrative assumptions, and every calculation has been checked.</p>
<div class="callout"><span class="badge">One idea to keep</span> The cheapest freight rate is not always the cheapest transport. What matters is the total landed cost — freight plus handling, insurance, duties, time in transit and the risk of delay or damage.</div>`,
    `<span class="eyebrow">GLT301 · Bài 0.1 · Tổng quan</span>
<h2>Quản trị vận tải quốc tế</h2>
<p class="lead">Một hợp đồng mua bán giữa người mua ở Rotterdam và người bán ở TP. Hồ Chí Minh chỉ là lời hứa cho tới khi hàng thực sự tới nơi. Vận tải quốc tế là phần của thương mại biến lời hứa thành việc giao hàng — và nó quyết định một phần lớn chi phí, thời gian và rủi ro của mọi lô hàng xuất khẩu hay nhập khẩu.</p>
<h3>Nhà quản trị vận tải quốc tế quyết định gì</h3>
<table>
<tr><th>Quyết định</th><th>Câu hỏi điển hình</th><th>Công cụ sẽ học</th></tr>
<tr><td>Phương thức và tuyến đường</td><td>Đường biển, hàng không, đường bộ, đường sắt hay kết hợp? Qua cảng và đầu mối nào?</td><td>So sánh chi phí – thời gian – rủi ro, tổng chi phí đến tay</td></tr>
<tr><td>Người chuyên chở và hợp đồng</td><td>Lưu khoang với tàu chợ, thuê nguyên tàu, hay dùng người giao nhận?</td><td>Lưu khoang tàu chợ, hợp đồng thuê tàu, laytime và demurrage</td></tr>
<tr><td>Tính cước</td><td>Giá cước được cấu thành thế nào, khi nào đi nguyên container rẻ hơn?</td><td>FCL và LCL, W/M, phụ phí, trọng lượng tính cước hàng không</td></tr>
<tr><td>Chứng từ và trách nhiệm</td><td>Chứng từ nào kiểm soát hàng hoá, mất hàng thì đòi được gì?</td><td>Vận đơn đường biển, giấy gửi hàng đường biển, vận đơn hàng không, các công ước về trách nhiệm</td></tr>
<tr><td>Điều kiện giao hàng và bảo hiểm</td><td>Rủi ro chuyển từ người bán sang người mua ở đâu, ai mua bảo hiểm cho gì?</td><td>Incoterms 2020 (do ICC — Phòng Thương mại Quốc tế ban hành), Điều kiện bảo hiểm hàng hoá của Viện (Institute Cargo Clauses, do thị trường bảo hiểm London ban hành, không phải ICC)</td></tr>
<tr><td>Hiệu quả và bền vững</td><td>Dịch vụ có đủ tin cậy, tuân thủ và ít phát thải không?</td><td>IMO 2020, đo lường phát thải, chọn cảng</td></tr>
</table>
<h3>Ai tham gia vào một lô hàng</h3>
<ul>
<li><strong>Người gửi hàng (shipper)</strong> — gửi hàng đi, thường là nhà xuất khẩu. <strong>Người nhận hàng (consignee)</strong> — nhận hàng, thường là nhà nhập khẩu. <strong>Bên được thông báo (notify party)</strong> — được báo khi hàng đến.</li>
<li><strong>Người chuyên chở (carrier)</strong> — thực hiện hoặc cam kết thực hiện việc chuyên chở: hãng tàu, hãng hàng không, công ty vận tải đường bộ hay đường sắt.</li>
<li><strong>Người giao nhận (freight forwarder)</strong> — tổ chức vận chuyển cho người gửi hàng, lưu khoang, lập chứng từ, thường gom các lô hàng nhỏ; <strong>NVOCC</strong> (người chuyên chở không tàu) đi xa hơn và phát hành vận đơn của chính mình với tư cách người chuyên chở.</li>
<li><strong>Đại lý hải quan</strong> — làm thủ tục thông quan xuất khẩu và nhập khẩu. <strong>Cảng và nhà khai thác cảng</strong> — xếp, dỡ và lưu giữ hàng.</li>
<li><strong>Người bảo hiểm</strong> — bồi thường khi hàng hoá mất mát, hư hỏng. <strong>Ngân hàng</strong> — thanh toán dựa trên chứng từ vận tải theo phương thức tín dụng chứng từ.</li>
</ul>
<h3>Lộ trình</h3>
<p>Phần 1: vai trò của vận tải và so sánh các phương thức · Phần 2: thị trường vận tải biển, các loại tàu và thuê tàu · Phần 3: container, cước phí, vận đơn đường biển và các quy tắc trách nhiệm · Phần 4: vận tải hàng không, đường bộ, đường sắt và đa phương thức · Phần 5: Incoterms 2020, bảo hiểm hàng hoá, vận tải bền vững và cảng biển Việt Nam. Mọi tình huống và mức cước trong môn là giả định minh hoạ, và mọi phép tính đã được kiểm tra.</p>
<div class="callout"><span class="badge">Một ý cần giữ</span> Cước rẻ nhất chưa chắc là vận tải rẻ nhất. Điều quan trọng là tổng chi phí đến tay — cước cộng phí làm hàng, bảo hiểm, thuế, thời gian hàng nằm trên đường và rủi ro chậm trễ hay hư hỏng.</div>`,
  ]]);

const c1 = doc('glt301-1-1-transport-in-trade', '1.1 — The role of transport in international trade & logistics|||1.1 — Vai trò của vận tải trong thương mại & logistics quốc tế',
  'Vận tải kết nối sản xuất và tiêu dùng, vị trí của vận tải trong logistics, tổng chi phí đến tay (landed cost), chi phí hàng tồn kho trên đường có ví dụ số, cấu trúc chi phí vận tải (lợi thế quy mô và cự ly) và các tiêu chí dịch vụ.',
  [[
    `<span class="eyebrow">GLT301 · Part 1 · Lesson 1.1</span>
<h2>The role of transport in international trade &amp; logistics</h2>
<p class="lead">Without affordable, reliable transport, countries could not specialise in what they produce best. Falling transport costs — above all since the container was adopted — are one of the main reasons global supply chains exist.</p>
<h3>Transport inside logistics</h3>
<p>Logistics is the management of the flow of goods, information and money from origin to consumption. Transport is its <strong>physical movement</strong> function, working alongside warehousing, inventory, packaging, order processing and customs. Decisions in one function change the others: a slower mode needs more inventory; a better package allows cheaper handling; a closer port may need a longer truck haul.</p>
<h3>Total landed cost, not freight alone</h3>
<pre><code>Total landed cost = price of goods + packing and export handling
                  + main freight and surcharges + cargo insurance
                  + import duties and taxes + destination handling and delivery
                  + inventory carrying cost while goods are in transit
                  + cost of risk (delay, damage, lost sales)</code></pre>
<p>Illustrative (assumed) case: a shipment worth USD 200,000; the company’s inventory carrying cost is 20% a year. Sea freight costs USD 1,500 with 30 days door to door; air freight costs USD 9,000 with 5 days.</p>
<pre><code>In-transit carrying cost = value x annual rate x days / 365
Sea: 200,000 x 20% x 30 / 365 = 3,287.67      total 1,500 + 3,287.67 = 4,787.67
Air: 200,000 x 20% x  5 / 365 =   547.95      total 9,000 +   547.95 = 9,547.95
On in-transit carrying cost alone, the air premium 7,500 is recovered only if the goods are worth more than
   7,500 x 365 / (20% x 25 days) = USD 547,500 per shipment</code></pre>
<p>Add the cost of risk — a stopped production line, a lost sale, spoiled goods — and air can pay off even below that value. So high-value, urgent or perishable goods can justify expensive fast modes, while low-value bulk goods travel slowly and cheaply. The same logic explains why safety stock falls when transit times become shorter and more reliable.</p>
<h3>How transport costs behave</h3>
<ul>
<li><strong>Fixed vs variable costs.</strong> Terminals, ships and aircraft are capital-intensive; fuel, crew and tolls vary with distance and volume.</li>
<li><strong>Economies of scale.</strong> The cost per tonne falls as vehicle size and shipment size grow — the reason ships keep getting larger.</li>
<li><strong>Economies of distance.</strong> Terminal and handling costs are paid once per trip, so the cost per tonne-kilometre falls as distance grows (the "tapering" principle).</li>
<li><strong>Imbalance.</strong> When trade is unbalanced, carriers must reposition empty containers or ships, and rates in the busy direction are higher.</li>
</ul>
<h3>Service criteria shippers compare</h3>
<p>Transit time · reliability (on-time performance) · frequency of departures · capacity and equipment availability · risk of loss or damage · flexibility (door-to-door or not) · visibility and tracking · documentation and compliance · emissions. Different cargoes weigh these differently: fresh fruit cares about time and temperature, iron ore about cost per tonne.</p>
<div class="callout"><span class="badge">Watch out</span> A cheap but unreliable service forces buyers to hold extra safety stock. Unreliability is a hidden cost that never appears on the freight invoice.</div>`,
    `<span class="eyebrow">GLT301 · Phần 1 · Bài 1.1</span>
<h2>Vai trò của vận tải trong thương mại &amp; logistics quốc tế</h2>
<p class="lead">Không có vận tải rẻ và tin cậy, các quốc gia không thể chuyên môn hoá vào những gì mình sản xuất tốt nhất. Chi phí vận tải giảm — đặc biệt từ khi container được áp dụng — là một trong những lý do chính khiến chuỗi cung ứng toàn cầu tồn tại.</p>
<h3>Vận tải trong logistics</h3>
<p>Logistics là quản trị dòng hàng hoá, thông tin và tiền từ nơi xuất phát tới nơi tiêu dùng. Vận tải là chức năng <strong>di chuyển vật chất</strong> của nó, vận hành cùng kho bãi, tồn kho, bao bì, xử lý đơn hàng và hải quan. Quyết định ở chức năng này làm thay đổi chức năng khác: phương thức chậm hơn cần nhiều tồn kho hơn; bao bì tốt hơn cho phép làm hàng rẻ hơn; một cảng gần hơn có thể đòi hỏi chặng xe tải dài hơn.</p>
<h3>Tổng chi phí đến tay, không chỉ tiền cước</h3>
<pre><code>Tổng chi phí đến tay = giá hàng + đóng gói và làm hàng xuất khẩu
                     + cước vận tải chính và phụ phí + bảo hiểm hàng hoá
                     + thuế nhập khẩu và các loại thuế + làm hàng và giao hàng tại đích
                     + chi phí tồn kho trong thời gian hàng đi trên đường
                     + chi phí rủi ro (chậm trễ, hư hỏng, mất doanh số)</code></pre>
<p>Tình huống minh hoạ (giả định): một lô hàng trị giá 200.000 USD; chi phí duy trì tồn kho của công ty là 20%/năm. Cước đường biển 1.500 USD, mất 30 ngày từ cửa tới cửa; cước hàng không 9.000 USD, mất 5 ngày.</p>
<pre><code>Chi phí tồn kho trên đường = giá trị hàng x tỷ lệ năm x số ngày / 365
Biển:     200.000 x 20% x 30 / 365 = 3.287,67     tổng 1.500 + 3.287,67 = 4.787,67
Hàng không: 200.000 x 20% x 5 / 365 =   547,95     tổng 9.000 +   547,95 = 9.547,95
Chỉ xét riêng chi phí tồn kho trên đường, khoản cước chênh 7.500 của hàng không chỉ bù được nếu lô hàng trị giá trên
   7.500 x 365 / (20% x 25 ngày) = 547.500 USD</code></pre>
<p>Cộng thêm chi phí rủi ro — dây chuyền phải dừng, mất doanh số, hàng hư hỏng — thì hàng không có thể có lợi ngay cả khi lô hàng trị giá thấp hơn mức đó. Vì vậy hàng giá trị cao, gấp hoặc dễ hỏng có thể biện minh cho phương thức nhanh và đắt, còn hàng rời giá trị thấp đi chậm và rẻ. Cùng lập luận đó giải thích vì sao tồn kho an toàn giảm khi thời gian vận chuyển ngắn hơn và ổn định hơn.</p>
<h3>Chi phí vận tải vận động thế nào</h3>
<ul>
<li><strong>Chi phí cố định và biến đổi.</strong> Cảng, tàu và máy bay cần nhiều vốn; nhiên liệu, thuyền bộ và phí cầu đường thay đổi theo cự ly và khối lượng.</li>
<li><strong>Lợi thế quy mô.</strong> Chi phí mỗi tấn giảm khi phương tiện và lô hàng lớn hơn — lý do tàu biển ngày càng to.</li>
<li><strong>Lợi thế cự ly.</strong> Chi phí đầu mối và làm hàng chỉ trả một lần mỗi chuyến, nên chi phí trên mỗi tấn-km giảm khi cự ly tăng (nguyên tắc "giảm dần").</li>
<li><strong>Mất cân bằng.</strong> Khi thương mại hai chiều lệch nhau, người chuyên chở phải điều container rỗng hoặc tàu chạy không hàng, và cước chiều đông hàng cao hơn.</li>
</ul>
<h3>Các tiêu chí dịch vụ người gửi hàng so sánh</h3>
<p>Thời gian vận chuyển · độ tin cậy (đúng giờ) · tần suất chuyến · năng lực và sẵn có thiết bị · rủi ro mất mát, hư hỏng · tính linh hoạt (có từ cửa tới cửa hay không) · khả năng theo dõi hành trình · chứng từ và tuân thủ · phát thải. Mỗi loại hàng coi trọng các tiêu chí khác nhau: trái cây tươi quan tâm thời gian và nhiệt độ, quặng sắt quan tâm chi phí mỗi tấn.</p>
<div class="callout"><span class="badge">Cẩn thận</span> Một dịch vụ rẻ nhưng thất thường buộc người mua giữ thêm tồn kho an toàn. Sự thiếu tin cậy là chi phí ẩn không bao giờ hiện trên hoá đơn cước.</div>`,
  ]]);

const c2 = doc('glt301-1-2-modes-compared', '1.2 — The transport modes compared: cost, time & risk|||1.2 — So sánh các phương thức vận tải: chi phí, thời gian & rủi ro',
  'Đặc điểm của vận tải đường biển, hàng không, đường bộ, đường sắt, đường thuỷ nội địa và đường ống; bảng so sánh chi phí – thời gian – rủi ro; các yếu tố chọn phương thức; vận tải đa phương thức và ví dụ luồng hàng của Việt Nam.',
  [[
    `<span class="eyebrow">GLT301 · Part 1 · Lesson 1.2</span>
<h2>The transport modes compared: cost, time &amp; risk</h2>
<p>Each mode has a typical cargo, a cost level and a risk profile. The comparison below is qualitative and relative — actual rates change constantly with fuel prices, capacity and demand.</p>
<table>
<tr><th>Mode</th><th>Typical cargo</th><th>Cost per tonne-km</th><th>Speed</th><th>Main strengths</th><th>Main weaknesses and risks</th></tr>
<tr><td>Sea</td><td>Containers, dry and liquid bulk, vehicles</td><td>Lowest</td><td>Slow</td><td>Huge capacity, economies of scale, carries the large majority of world trade by volume</td><td>Long transit, port congestion, weather, port-to-port only, heavy handling</td></tr>
<tr><td>Air</td><td>High-value, urgent, perishable goods; e-commerce; samples</td><td>Highest</td><td>Fastest</td><td>Speed, security, low damage rate, reach to inland cities</td><td>Cost, weight and size limits, dangerous-goods restrictions</td></tr>
<tr><td>Road</td><td>Almost anything, in truckloads or part loads</td><td>Medium to high</td><td>Medium</td><td>Door-to-door flexibility, first and last mile of every chain</td><td>Limited load, congestion, accidents, border waiting time</td></tr>
<tr><td>Rail</td><td>Bulk, containers on long land routes</td><td>Low to medium</td><td>Medium</td><td>Large loads over land, fewer emissions than road</td><td>Fixed network, transhipment at gauge breaks and borders</td></tr>
<tr><td>Inland waterway</td><td>Bulk, containers on rivers and canals</td><td>Low</td><td>Slow</td><td>Cheap feeder to seaports (e.g. Mekong Delta barges)</td><td>Depends on water depth, bridges, seasons</td></tr>
<tr><td>Pipeline</td><td>Crude oil, products, gas</td><td>Very low once built</td><td>Continuous</td><td>Constant flow, minimal labour</td><td>Very high fixed cost, limited to one or a few liquid or gas products (often sent in batches), fixed route</td></tr>
</table>
<h3>Factors in choosing a mode</h3>
<ol>
<li><strong>Value density</strong> — value per kilogram. Phones and medicines fly; coal and cement sail.</li>
<li><strong>Urgency and perishability</strong> — a production line stopped for a spare part, fresh flowers, seasonal fashion.</li>
<li><strong>Distance and geography</strong> — islands and oceans rule out road; landlocked countries depend on road and rail corridors.</li>
<li><strong>Shipment size</strong> — a few cartons, a container, or a full ship.</li>
<li><strong>Infrastructure and service availability</strong> — ports, airports, rail links, frequency of sailings.</li>
<li><strong>Reliability and risk</strong> — theft, damage, delays, political and security risk on the route.</li>
<li><strong>Regulation and documents</strong> — dangerous goods, cabotage rules, customs regimes, sanctions.</li>
<li><strong>Carbon footprint</strong> — increasingly required by buyers and regulators (Part 5).</li>
</ol>
<h3>Combining modes</h3>
<p>Most international shipments use more than one mode: a truck to the port, a ship, then a truck or train at destination. When one operator takes responsibility for the whole chain under one contract, the carriage is <strong>multimodal</strong> (Part 4). Other combinations include <strong>sea–air</strong> (sea to a hub, then air, to trade off cost and speed) and <strong>land bridges</strong> (rail across a continent instead of a long sea route).</p>
<h3>Vietnam examples (qualitative)</h3>
<ul>
<li>Garments and furniture from the south to Europe and North America: containers by sea, trucked or barged to the port.</li>
<li>Electronics components and samples: by air from the Hanoi and Ho Chi Minh City airports.</li>
<li>Fresh fruit to China: often by road through the northern border gates, with rail and sea as alternatives.</li>
</ul>
<div class="callout"><span class="badge">Rule of thumb</span> Pick the slowest mode your customer and your cash flow can accept. Speed is valuable, but you should pay for it only where it earns its cost.</div>`,
    `<span class="eyebrow">GLT301 · Phần 1 · Bài 1.2</span>
<h2>So sánh các phương thức vận tải: chi phí, thời gian &amp; rủi ro</h2>
<p>Mỗi phương thức có loại hàng điển hình, mức chi phí và đặc điểm rủi ro riêng. Bảng so sánh dưới đây mang tính định tính, tương đối — mức cước thực tế thay đổi liên tục theo giá nhiên liệu, năng lực và nhu cầu.</p>
<table>
<tr><th>Phương thức</th><th>Hàng điển hình</th><th>Chi phí mỗi tấn-km</th><th>Tốc độ</th><th>Ưu điểm chính</th><th>Nhược điểm và rủi ro chính</th></tr>
<tr><td>Đường biển</td><td>Container, hàng rời khô và lỏng, xe</td><td>Thấp nhất</td><td>Chậm</td><td>Năng lực rất lớn, lợi thế quy mô, chuyên chở phần lớn khối lượng thương mại thế giới</td><td>Thời gian dài, ùn tắc cảng, thời tiết, chỉ từ cảng tới cảng, làm hàng nhiều lần</td></tr>
<tr><td>Hàng không</td><td>Hàng giá trị cao, gấp, dễ hỏng; thương mại điện tử; hàng mẫu</td><td>Cao nhất</td><td>Nhanh nhất</td><td>Tốc độ, an ninh, tỷ lệ hư hỏng thấp, tới được các thành phố nội địa</td><td>Chi phí, giới hạn trọng lượng và kích thước, hạn chế hàng nguy hiểm</td></tr>
<tr><td>Đường bộ</td><td>Gần như mọi loại hàng, nguyên xe hoặc ghép xe</td><td>Trung bình tới cao</td><td>Trung bình</td><td>Linh hoạt từ cửa tới cửa, là chặng đầu và chặng cuối của mọi chuỗi</td><td>Tải trọng hạn chế, ùn tắc, tai nạn, chờ đợi ở cửa khẩu</td></tr>
<tr><td>Đường sắt</td><td>Hàng rời, container trên tuyến đất liền dài</td><td>Thấp tới trung bình</td><td>Trung bình</td><td>Chở khối lượng lớn trên đất liền, phát thải ít hơn đường bộ</td><td>Mạng lưới cố định, chuyển tải khi đổi khổ đường ray và qua biên giới</td></tr>
<tr><td>Đường thuỷ nội địa</td><td>Hàng rời, container trên sông và kênh</td><td>Thấp</td><td>Chậm</td><td>Gom hàng rẻ về cảng biển (ví dụ sà lan ở Đồng bằng sông Cửu Long)</td><td>Phụ thuộc mực nước, tĩnh không cầu, mùa</td></tr>
<tr><td>Đường ống</td><td>Dầu thô, sản phẩm dầu, khí</td><td>Rất thấp khi đã xây xong</td><td>Liên tục</td><td>Dòng chảy ổn định, ít lao động</td><td>Chi phí cố định rất cao, chỉ chở một hoặc vài loại chất lỏng, khí (thường theo từng mẻ), tuyến cố định</td></tr>
</table>
<h3>Các yếu tố khi chọn phương thức</h3>
<ol>
<li><strong>Mật độ giá trị</strong> — giá trị trên mỗi kilôgam. Điện thoại và thuốc đi máy bay; than và xi măng đi tàu biển.</li>
<li><strong>Tính khẩn cấp và dễ hỏng</strong> — dây chuyền sản xuất dừng vì thiếu phụ tùng, hoa tươi, thời trang theo mùa.</li>
<li><strong>Cự ly và địa lý</strong> — đảo và đại dương loại bỏ đường bộ; nước không có biển phụ thuộc hành lang đường bộ và đường sắt.</li>
<li><strong>Quy mô lô hàng</strong> — vài thùng, một container hay nguyên một tàu.</li>
<li><strong>Hạ tầng và sự sẵn có của dịch vụ</strong> — cảng biển, sân bay, kết nối đường sắt, tần suất chuyến tàu.</li>
<li><strong>Độ tin cậy và rủi ro</strong> — trộm cắp, hư hỏng, chậm trễ, rủi ro chính trị và an ninh trên tuyến.</li>
<li><strong>Quy định và chứng từ</strong> — hàng nguy hiểm, quy định vận tải nội địa (cabotage), chế độ hải quan, lệnh trừng phạt.</li>
<li><strong>Dấu chân carbon</strong> — ngày càng bị người mua và cơ quan quản lý yêu cầu (Phần 5).</li>
</ol>
<h3>Kết hợp các phương thức</h3>
<p>Phần lớn lô hàng quốc tế dùng nhiều hơn một phương thức: xe tải ra cảng, tàu biển, rồi xe tải hoặc tàu hoả ở đầu nhận. Khi một nhà khai thác chịu trách nhiệm toàn bộ chuỗi theo một hợp đồng duy nhất, đó là vận tải <strong>đa phương thức</strong> (Phần 4). Các cách kết hợp khác gồm <strong>biển – hàng không</strong> (đi biển tới một đầu mối rồi bay tiếp, để cân bằng chi phí và tốc độ) và <strong>cầu lục địa</strong> (đi đường sắt xuyên lục địa thay cho tuyến biển dài).</p>
<h3>Ví dụ Việt Nam (định tính)</h3>
<ul>
<li>Hàng may mặc và đồ gỗ từ phía Nam sang châu Âu và Bắc Mỹ: container đường biển, đưa ra cảng bằng xe tải hoặc sà lan.</li>
<li>Linh kiện điện tử và hàng mẫu: đi máy bay từ các sân bay ở Hà Nội và TP. Hồ Chí Minh.</li>
<li>Trái cây tươi sang Trung Quốc: thường đi đường bộ qua các cửa khẩu phía Bắc, đường sắt và đường biển là phương án thay thế.</li>
</ul>
<div class="callout"><span class="badge">Kinh nghiệm</span> Chọn phương thức chậm nhất mà khách hàng và dòng tiền của bạn chấp nhận được. Tốc độ có giá trị, nhưng chỉ nên trả tiền cho nó ở nơi nó xứng đáng với chi phí.</div>`,
  ]]);

const c2q = quiz('glt301-quiz-1', 'Quiz 1 — Transport in trade & the modes|||Quiz 1 — Vận tải trong thương mại & các phương thức', [
  { id: 'q1', question: 'Which mode normally has the lowest cost per tonne-kilometre for large volumes over long distances between continents?|||Phương thức nào thường có chi phí mỗi tấn-km thấp nhất cho khối lượng lớn trên quãng đường dài giữa các châu lục?', options: ['Air|||Hàng không', 'Road|||Đường bộ', 'Sea|||Đường biển', 'Express courier|||Chuyển phát nhanh'], correctIndex: 2, explanation: 'Very large ships spread fixed costs over huge volumes, so sea transport has the lowest cost per tonne-km, at the price of long transit times.|||Tàu rất lớn chia chi phí cố định cho khối lượng khổng lồ, nên đường biển có chi phí mỗi tấn-km thấp nhất, đổi lại thời gian vận chuyển dài.' },
  { id: 'q2', question: 'Goods worth USD 365,000 spend 10 days in transit and the carrying cost is 20% a year. What is the in-transit carrying cost?|||Lô hàng trị giá 365.000 USD nằm trên đường 10 ngày, chi phí duy trì tồn kho 20%/năm. Chi phí tồn kho trên đường là bao nhiêu?', options: ['USD 200|||200 USD', 'USD 7,300|||7.300 USD', 'USD 73,000|||73.000 USD', 'USD 2,000|||2.000 USD'], correctIndex: 3, explanation: '365,000 x 20% x 10 / 365 = 2,000. 73,000 is the cost for a whole year.|||365.000 x 20% x 10 / 365 = 2.000. Con số 73.000 là chi phí cho cả năm.' },
  { id: 'q3', question: 'Why does the cost per tonne-km usually fall as the distance of a trip increases?|||Vì sao chi phí mỗi tấn-km thường giảm khi cự ly chuyến đi tăng?', options: ['Terminal and handling costs are paid once per trip and spread over more kilometres|||Chi phí đầu mối và làm hàng chỉ trả một lần mỗi chuyến và được chia cho nhiều km hơn', 'Fuel becomes cheaper on long trips|||Nhiên liệu rẻ hơn trên chuyến dài', 'Carriers are not allowed to charge surcharges on long routes|||Người chuyên chở không được thu phụ phí trên tuyến dài', 'Insurance is not needed on long trips|||Chuyến dài không cần bảo hiểm'], correctIndex: 0, explanation: 'This is the tapering principle, or economies of distance.|||Đây là nguyên tắc giảm dần, hay lợi thế cự ly.' },
]);

const c3 = doc('glt301-2-1-shipping-markets-ships', '2.1 — Ocean shipping markets: liner vs tramp, ship types & sizes|||2.1 — Thị trường vận tải biển: tàu chợ và tàu chạy rông, loại tàu & cỡ tàu',
  'Phân biệt tàu chợ (liner) và tàu chạy rông (tramp), liên minh hãng tàu, môi giới và thị trường thuê tàu; các loại tàu (container, hàng rời, tàu dầu, chở khí, Ro-Ro, hàng bách hoá, tàu lạnh) và cách gọi tên cỡ tàu; các đơn vị đo tàu (GT, NT, DWT); vai trò của IMO và quốc gia treo cờ.',
  [[
    `<span class="eyebrow">GLT301 · Part 2 · Lesson 2.1</span>
<h2>Ocean shipping markets: liner vs tramp, ship types &amp; sizes</h2>
<p class="lead">Ocean shipping is not one market but two very different ways of selling ship capacity: a scheduled service open to any shipper, and a whole ship hired for a particular cargo.</p>
<h3>Liner vs tramp</h3>
<table>
<tr><th>Feature</th><th>Liner shipping</th><th>Tramp shipping</th></tr>
<tr><td>Schedule and route</td><td>Fixed, published schedule on a fixed route, calling at fixed ports</td><td>No fixed schedule; the ship goes wherever the cargo is</td></tr>
<tr><td>Cargo</td><td>Many small consignments from many shippers — today mostly containers</td><td>Usually one large homogeneous cargo filling the ship: ore, coal, grain, oil</td></tr>
<tr><td>Contract</td><td>Booking plus a bill of lading or sea waybill (Part 3)</td><td>A charter party negotiated for the voyage or period (lesson 2.2)</td></tr>
<tr><td>Price</td><td>Tariff rates, negotiated contract rates and spot rates, plus surcharges</td><td>Freight or hire set by supply and demand in the charter market</td></tr>
<tr><td>Intermediaries</td><td>Freight forwarders, NVOCCs, the line’s own sales offices</td><td>Shipbrokers bringing owners and charterers together</td></tr>
<tr><td>Typical ships</td><td>Container ships, Ro-Ro, some general cargo ships</td><td>Bulk carriers, tankers, multipurpose ships</td></tr>
</table>
<p>Liner companies often share ships through <strong>alliances</strong>, <strong>consortia</strong> and <strong>slot charters</strong> (buying a number of container slots on another line’s ship) to offer weekly services with fewer ships each. In the tramp market, brokers publish market reports and the Baltic Exchange publishes freight indices (such as the Baltic Dry Index) used as benchmarks — values move sharply with world trade.</p>
<h3>Main ship types</h3>
<table>
<tr><th>Type</th><th>What it carries</th><th>Note</th></tr>
<tr><td>Container ship</td><td>Standard containers, including reefers</td><td>Sizes named from small feeders serving hub ports to ultra-large container vessels (ULCV) on Asia–Europe routes</td></tr>
<tr><td>Dry bulk carrier</td><td>Iron ore, coal, grain, bauxite, fertiliser</td><td>Holds loaded by grab or conveyor; often "geared" (own cranes) in the smaller sizes</td></tr>
<tr><td>Tanker</td><td>Crude oil, refined products, chemicals</td><td>Crude tankers are the largest; chemical tankers carry many small parcels in coated tanks</td></tr>
<tr><td>Gas carrier</td><td>LNG (liquefied natural gas), LPG</td><td>Pressurised or refrigerated tanks, highly specialised</td></tr>
<tr><td>Ro-Ro and car carrier (PCTC)</td><td>Cars, trucks, heavy machinery driven on and off</td><td>Ramps instead of cranes; fast port turnaround</td></tr>
<tr><td>General cargo, multipurpose, heavy-lift</td><td>Breakbulk: steel, project cargo, bagged goods</td><td>Serves ports and cargoes that containers do not suit</td></tr>
<tr><td>Reefer ship</td><td>Fruit, meat, fish under temperature control</td><td>Largely replaced by reefer containers on container ships</td></tr>
</table>
<h3>How size classes are named (qualitative)</h3>
<ul>
<li><strong>Dry bulk:</strong> Handysize → Supramax / Ultramax → Panamax / Kamsarmax → Capesize, from smallest to largest.</li>
<li><strong>Tankers:</strong> Handysize / MR → Panamax (LR1) → Aframax (LR2) → Suezmax → VLCC → ULCC (very and ultra large crude carriers). "Product tanker" names a type, not a size: product tankers carrying refined oil range from MR to LR2.</li>
<li><strong>Container ships:</strong> feeder → Panamax → Neo-Panamax → ULCV.</li>
<li>The names come from <strong>canal and route limits</strong>: Panamax fitted the original Panama Canal locks, Neo-Panamax fits the larger locks opened in 2016, Suezmax is the largest tanker able to transit the Suez Canal laden, and Capesize ships were traditionally too large for both the Panama Canal and (when laden) the Suez Canal, so they trade around the Cape of Good Hope or Cape Horn.</li>
</ul>
<h3>Measuring a ship</h3>
<p><strong>Gross tonnage (GT)</strong> measures the enclosed volume of the ship and is used for registration and many port dues; <strong>net tonnage (NT)</strong> measures the cargo-carrying volume. <strong>Deadweight (DWT)</strong> is the weight a ship can carry — cargo plus fuel, water and stores — and is the usual size measure for bulk carriers and tankers; container ships are described by their capacity in <strong>TEU</strong>. <strong>Draught</strong> (how deep the ship sits) decides which ports and channels it can enter.</p>
<h3>Who regulates ships</h3>
<p>Every ship is registered under a <strong>flag state</strong>, which enforces international rules on it; port states inspect foreign ships in their ports. The <strong>International Maritime Organization (IMO)</strong>, a UN agency, adopts the main conventions — such as SOLAS (safety of life at sea), MARPOL (pollution prevention) and STCW (training of seafarers). Many owners register under open registries, so the flag may differ from the owner’s nationality.</p>
<div class="callout"><span class="badge">Key idea</span> Container cargo buys a slot on a scheduled service; bulk cargo buys the ship. That single difference explains why the documents, contracts and prices of the two markets look so different.</div>`,
    `<span class="eyebrow">GLT301 · Phần 2 · Bài 2.1</span>
<h2>Thị trường vận tải biển: tàu chợ và tàu chạy rông, loại tàu &amp; cỡ tàu</h2>
<p class="lead">Vận tải biển không phải một thị trường mà là hai cách bán năng lực chở rất khác nhau: một dịch vụ theo lịch trình mở cho mọi người gửi hàng, và thuê nguyên một con tàu cho một lô hàng cụ thể.</p>
<h3>Tàu chợ và tàu chạy rông</h3>
<table>
<tr><th>Đặc điểm</th><th>Tàu chợ (liner)</th><th>Tàu chạy rông (tramp)</th></tr>
<tr><td>Lịch trình và tuyến</td><td>Lịch trình cố định, công bố trước, trên tuyến cố định, ghé các cảng cố định</td><td>Không có lịch cố định; tàu đi tới nơi có hàng</td></tr>
<tr><td>Hàng hoá</td><td>Nhiều lô nhỏ của nhiều người gửi — ngày nay chủ yếu là container</td><td>Thường là một lô hàng lớn đồng nhất chiếm cả tàu: quặng, than, ngũ cốc, dầu</td></tr>
<tr><td>Hợp đồng</td><td>Lưu khoang (booking) kèm vận đơn hoặc giấy gửi hàng đường biển (Phần 3)</td><td>Hợp đồng thuê tàu đàm phán cho chuyến hoặc cho thời hạn (bài 2.2)</td></tr>
<tr><td>Giá</td><td>Biểu cước, cước hợp đồng đàm phán và cước giao ngay, cộng phụ phí</td><td>Cước hoặc tiền thuê do cung cầu trên thị trường thuê tàu quyết định</td></tr>
<tr><td>Trung gian</td><td>Người giao nhận, NVOCC, văn phòng bán hàng của hãng tàu</td><td>Môi giới thuê tàu kết nối chủ tàu và người thuê tàu</td></tr>
<tr><td>Tàu điển hình</td><td>Tàu container, tàu Ro-Ro, một số tàu hàng bách hoá</td><td>Tàu hàng rời, tàu dầu, tàu đa năng</td></tr>
</table>
<p>Các hãng tàu chợ thường dùng chung tàu qua <strong>liên minh</strong>, <strong>liên doanh khai thác (consortium)</strong> và <strong>thuê chỗ (slot charter)</strong> — mua một số chỗ container trên tàu của hãng khác — để duy trì dịch vụ hằng tuần với ít tàu hơn cho mỗi hãng. Trên thị trường tàu chạy rông, các nhà môi giới phát hành báo cáo thị trường và Baltic Exchange công bố các chỉ số cước (như chỉ số Baltic Dry Index) dùng làm mốc tham chiếu — giá trị biến động mạnh theo thương mại thế giới.</p>
<h3>Các loại tàu chính</h3>
<table>
<tr><th>Loại tàu</th><th>Chở gì</th><th>Ghi chú</th></tr>
<tr><td>Tàu container</td><td>Container tiêu chuẩn, kể cả container lạnh</td><td>Cỡ tàu gọi tên từ tàu gom (feeder) nhỏ phục vụ cảng trung chuyển tới tàu container siêu lớn (ULCV) trên tuyến châu Á – châu Âu</td></tr>
<tr><td>Tàu hàng rời khô</td><td>Quặng sắt, than, ngũ cốc, bô-xít, phân bón</td><td>Xếp dỡ bằng gầu ngoạm hoặc băng chuyền; cỡ nhỏ thường có cần cẩu riêng</td></tr>
<tr><td>Tàu dầu</td><td>Dầu thô, sản phẩm lọc dầu, hoá chất</td><td>Tàu dầu thô lớn nhất; tàu hoá chất chở nhiều lô nhỏ trong các két có lớp phủ</td></tr>
<tr><td>Tàu chở khí</td><td>LNG (khí thiên nhiên hoá lỏng), LPG</td><td>Két chịu áp hoặc làm lạnh, chuyên dụng cao</td></tr>
<tr><td>Tàu Ro-Ro và tàu chở ô tô (PCTC)</td><td>Ô tô, xe tải, máy móc nặng lái lên, lái xuống</td><td>Dùng cầu dẫn thay cần cẩu; quay vòng tại cảng nhanh</td></tr>
<tr><td>Tàu hàng bách hoá, đa năng, hàng siêu trọng</td><td>Hàng bách hoá (breakbulk): thép, hàng dự án, hàng bao</td><td>Phục vụ cảng và loại hàng không phù hợp với container</td></tr>
<tr><td>Tàu lạnh</td><td>Trái cây, thịt, cá cần kiểm soát nhiệt độ</td><td>Phần lớn đã bị container lạnh trên tàu container thay thế</td></tr>
</table>
<h3>Cách gọi tên cỡ tàu (định tính)</h3>
<ul>
<li><strong>Tàu hàng rời khô:</strong> Handysize → Supramax / Ultramax → Panamax / Kamsarmax → Capesize, từ nhỏ đến lớn.</li>
<li><strong>Tàu dầu:</strong> Handysize / MR → Panamax (LR1) → Aframax (LR2) → Suezmax → VLCC → ULCC (tàu chở dầu thô rất lớn và cực lớn). "Tàu sản phẩm" là tên một loại tàu, không phải một cỡ: tàu chở sản phẩm lọc dầu có nhiều cỡ, từ MR tới LR2.</li>
<li><strong>Tàu container:</strong> feeder → Panamax → Neo-Panamax → ULCV.</li>
<li>Các tên gọi bắt nguồn từ <strong>giới hạn của kênh đào và tuyến đường</strong>: Panamax vừa âu tàu cũ của kênh Panama, Neo-Panamax vừa âu tàu mới lớn hơn khánh thành năm 2016, Suezmax là tàu dầu lớn nhất đi qua kênh Suez khi chở đầy hàng, còn tàu Capesize theo truyền thống quá lớn cho cả kênh Panama lẫn kênh Suez (khi chở đầy) nên phải chạy vòng qua mũi Hảo Vọng hoặc mũi Horn.</li>
</ul>
<h3>Đo kích cỡ tàu</h3>
<p><strong>Tổng dung tích (GT)</strong> đo thể tích các không gian kín của tàu, dùng khi đăng ký và tính nhiều loại phí cảng; <strong>dung tích có ích (NT)</strong> đo thể tích dùng để chở hàng. <strong>Trọng tải toàn phần (DWT)</strong> là khối lượng tàu chở được — hàng cộng nhiên liệu, nước và vật phẩm dự trữ — và là thước đo cỡ tàu thông dụng với tàu hàng rời và tàu dầu; tàu container được mô tả bằng sức chở tính theo <strong>TEU</strong>. <strong>Mớn nước</strong> (độ sâu phần tàu chìm dưới nước) quyết định tàu vào được cảng và luồng nào.</p>
<h3>Ai quản lý tàu biển</h3>
<p>Mỗi tàu đăng ký dưới một <strong>quốc gia treo cờ</strong>, nước này thực thi các quy định quốc tế đối với tàu; quốc gia có cảng kiểm tra tàu nước ngoài ghé cảng mình. <strong>Tổ chức Hàng hải Quốc tế (IMO)</strong>, một cơ quan của Liên Hợp Quốc, thông qua các công ước chính — như SOLAS (an toàn sinh mạng trên biển), MARPOL (ngăn ngừa ô nhiễm) và STCW (huấn luyện thuyền viên). Nhiều chủ tàu đăng ký ở các cơ quan đăng ký mở, nên cờ tàu có thể khác quốc tịch của chủ tàu.</p>
<div class="callout"><span class="badge">Ý chính</span> Hàng container mua một chỗ trên dịch vụ theo lịch trình; hàng rời mua cả con tàu. Chỉ một khác biệt đó giải thích vì sao chứng từ, hợp đồng và giá cả của hai thị trường khác nhau đến vậy.</div>`,
  ]]);

const c4 = doc('glt301-2-2-chartering-laytime', '2.2 — Chartering: voyage, time & bareboat charters; laytime & demurrage|||2.2 — Thuê tàu: thuê chuyến, thuê định hạn & thuê tàu trần; laytime & demurrage',
  'Ba loại hợp đồng thuê tàu và cách phân chia chi phí giữa chủ tàu và người thuê, các mẫu hợp đồng chuẩn, cước chuyến và tiền thuê, chỉ số TCE, thời gian làm hàng (laytime), tiền phạt làm hàng chậm (demurrage) và tiền thưởng làm hàng nhanh (despatch) có ví dụ số.',
  [[
    `<span class="eyebrow">GLT301 · Part 2 · Lesson 2.2</span>
<h2>Chartering: voyage, time &amp; bareboat charters; laytime &amp; demurrage</h2>
<p>A <strong>charter party</strong> is the contract by which a charterer hires a whole ship (or a large part of it) from a shipowner. The three basic forms differ in who operates the ship and who pays which costs.</p>
<table>
<tr><th>Cost or task</th><th>Voyage charter</th><th>Time charter</th><th>Bareboat (demise) charter</th></tr>
<tr><td>What is hired</td><td>Ship and crew for one voyage (or consecutive voyages) between named ports</td><td>Ship and crew for a period of time</td><td>The ship only, without crew, usually for years</td></tr>
<tr><td>Payment</td><td>Freight per tonne or lump sum</td><td>Hire per day, paid in advance</td><td>Hire per day or month</td></tr>
<tr><td>Capital cost of the ship</td><td>Owner</td><td>Owner</td><td>Owner</td></tr>
<tr><td>Operating costs: crew, maintenance, hull insurance, stores</td><td>Owner</td><td>Owner</td><td>Charterer</td></tr>
<tr><td>Voyage costs: bunkers (fuel), port charges, canal dues</td><td>Owner (built into the freight)</td><td>Charterer</td><td>Charterer</td></tr>
<tr><td>Commercial direction of the ship</td><td>Owner</td><td>Charterer, within the charter limits</td><td>Charterer</td></tr>
<tr><td>Risk of time lost in port</td><td>Shared: the owner bears the time up to the laytime allowed; beyond it the charterer pays demurrage</td><td>Charterer (hire keeps running unless the ship is off-hire)</td><td>Charterer</td></tr>
<tr><td>Example standard forms</td><td>GENCON</td><td>NYPE</td><td>BARECON</td></tr>
</table>
<p>Who pays for loading and discharging depends on the freight terms: under <strong>FIO</strong> (free in and out) the charterer pays cargo handling; under <strong>liner (gross) terms</strong> the owner does. A <strong>contract of affreightment (COA)</strong> is a related arrangement: the owner promises to carry a stated quantity over a period, with ships of its choice. A time charter includes an <strong>off-hire</strong> clause: hire stops when the ship cannot work because of a breakdown or a deficiency on the owner’s side.</p>
<h3>Comparing voyage and time charters: TCE</h3>
<p>Owners compare a voyage offer with a time-charter offer using the <strong>time-charter equivalent (TCE)</strong>:</p>
<pre><code>TCE = (voyage freight − voyage costs) / voyage days
Illustrative: freight 50,000 t x USD 20 = 1,000,000
voyage costs: bunkers 380,000 + port and canal 120,000 = 500,000
voyage of 25 days  ->  TCE = (1,000,000 − 500,000) / 25 = 500,000 / 25 = USD 20,000 per day</code></pre>
<p>If a charterer offers a time charter at more than USD 20,000 a day for a similar period, the time charter pays better (other things equal).</p>
<h3>Laytime, demurrage and despatch</h3>
<ul>
<li><strong>Laytime</strong> is the time the charter party allows the charterer for loading and discharging without extra payment. It is stated as a number of days or as a rate (e.g. 5,000 tonnes per day).</li>
<li>Laytime usually starts counting after the master tenders a <strong>notice of readiness (NOR)</strong> once the ship has arrived and is ready, subject to the exact charter wording (a "berth" or a "port" charter, notice periods, and so on).</li>
<li>Exceptions: <strong>SHEX</strong> (Sundays and holidays excepted), <strong>SHINC</strong> (Sundays and holidays included), <strong>WWD</strong> (weather working days — time lost to bad weather does not count).</li>
<li><strong>Demurrage</strong> is the agreed daily sum the charterer pays the owner when laytime is exceeded — liquidated damages for keeping the ship. Under the principle "<strong>once on demurrage, always on demurrage</strong>", exceptions such as Sundays or bad weather normally stop protecting the charterer once laytime has expired.</li>
<li><strong>Despatch</strong> is money the owner pays the charterer for finishing early, often at half the demurrage rate, on "all time saved" or "working time saved" as agreed.</li>
<li>Laytime may be counted <strong>separately</strong> for loading and discharging, or be <strong>reversible</strong> (one pool for both ports) — the choice changes the result (Exercise 1).</li>
</ul>
<pre><code>Illustrative: 25,000 t at 5,000 t per day SHINC  ->  laytime 5 days
Used 6.5 days  ->  demurrage 1.5 x USD 10,000 = USD 15,000 payable to the owner
Used 4 days    ->  saved 1 day, despatch at half rate 1 x 5,000 = USD 5,000 to the charterer</code></pre>
<div class="callout"><span class="badge">Remember</span> Demurrage exists because an idle ship still costs its owner capital and running costs every day. The charter party wording decides everything — always read the laytime clauses before signing.</div>`,
    `<span class="eyebrow">GLT301 · Phần 2 · Bài 2.2</span>
<h2>Thuê tàu: thuê chuyến, thuê định hạn &amp; thuê tàu trần; laytime &amp; demurrage</h2>
<p><strong>Hợp đồng thuê tàu (charter party)</strong> là hợp đồng qua đó người thuê tàu thuê nguyên một con tàu (hoặc một phần lớn của tàu) từ chủ tàu. Ba hình thức cơ bản khác nhau ở chỗ ai khai thác tàu và ai trả những chi phí nào.</p>
<table>
<tr><th>Chi phí hoặc công việc</th><th>Thuê chuyến</th><th>Thuê định hạn</th><th>Thuê tàu trần</th></tr>
<tr><td>Thuê cái gì</td><td>Tàu và thuyền bộ cho một chuyến (hoặc các chuyến liên tiếp) giữa các cảng đã nêu</td><td>Tàu và thuyền bộ trong một khoảng thời gian</td><td>Chỉ con tàu, không có thuyền bộ, thường nhiều năm</td></tr>
<tr><td>Thanh toán</td><td>Cước theo tấn hoặc cước khoán</td><td>Tiền thuê theo ngày, trả trước</td><td>Tiền thuê theo ngày hoặc tháng</td></tr>
<tr><td>Chi phí vốn của tàu</td><td>Chủ tàu</td><td>Chủ tàu</td><td>Chủ tàu</td></tr>
<tr><td>Chi phí vận hành: thuyền bộ, bảo dưỡng, bảo hiểm thân tàu, vật phẩm</td><td>Chủ tàu</td><td>Chủ tàu</td><td>Người thuê tàu</td></tr>
<tr><td>Chi phí chuyến đi: nhiên liệu, phí cảng, phí qua kênh</td><td>Chủ tàu (đã tính trong cước)</td><td>Người thuê tàu</td><td>Người thuê tàu</td></tr>
<tr><td>Điều hành khai thác thương mại</td><td>Chủ tàu</td><td>Người thuê tàu, trong giới hạn hợp đồng</td><td>Người thuê tàu</td></tr>
<tr><td>Rủi ro mất thời gian ở cảng</td><td>Chia sẻ: chủ tàu chịu thời gian trong phạm vi laytime cho phép; vượt quá thì người thuê tàu trả demurrage</td><td>Người thuê tàu (tiền thuê vẫn chạy trừ khi tàu ngừng thuê)</td><td>Người thuê tàu</td></tr>
<tr><td>Ví dụ mẫu hợp đồng chuẩn</td><td>GENCON</td><td>NYPE</td><td>BARECON</td></tr>
</table>
<p>Ai trả chi phí xếp và dỡ hàng phụ thuộc điều kiện cước: theo <strong>FIO</strong> (miễn phí xếp dỡ cho chủ tàu) người thuê tàu trả chi phí làm hàng; theo <strong>điều kiện tàu chợ (gross terms)</strong> thì chủ tàu trả. <strong>Hợp đồng chuyên chở khối lượng (COA)</strong> là một hình thức liên quan: chủ tàu cam kết chở một khối lượng xác định trong một thời kỳ, bằng những con tàu do chủ tàu chọn. Hợp đồng thuê định hạn có điều khoản <strong>ngừng thuê (off-hire)</strong>: tiền thuê dừng khi tàu không làm việc được do hỏng hóc hay khiếm khuyết thuộc về phía chủ tàu.</p>
<h3>So sánh thuê chuyến và thuê định hạn: TCE</h3>
<p>Chủ tàu so sánh một chào giá thuê chuyến với một chào giá thuê định hạn bằng <strong>thu nhập quy đổi theo ngày thuê định hạn (TCE)</strong>:</p>
<pre><code>TCE = (cước chuyến − chi phí chuyến đi) / số ngày chuyến đi
Minh hoạ: cước 50.000 t x 20 USD = 1.000.000
chi phí chuyến đi: nhiên liệu 380.000 + phí cảng và kênh 120.000 = 500.000
chuyến đi 25 ngày  ->  TCE = (1.000.000 − 500.000) / 25 = 500.000 / 25 = 20.000 USD mỗi ngày</code></pre>
<p>Nếu có người thuê chào thuê định hạn trên 20.000 USD/ngày cho khoảng thời gian tương tự, thuê định hạn có lợi hơn (khi các yếu tố khác như nhau).</p>
<h3>Laytime, demurrage và despatch</h3>
<ul>
<li><strong>Thời gian làm hàng (laytime)</strong> là khoảng thời gian hợp đồng cho phép người thuê tàu xếp và dỡ hàng mà không phải trả thêm tiền. Nó được ghi bằng số ngày hoặc bằng mức xếp dỡ (ví dụ 5.000 tấn mỗi ngày).</li>
<li>Laytime thường bắt đầu tính sau khi thuyền trưởng trao <strong>thông báo sẵn sàng (NOR)</strong> khi tàu đã tới và sẵn sàng làm hàng, tuỳ theo đúng câu chữ của hợp đồng (hợp đồng "cầu cảng" hay "cảng", thời hạn thông báo, v.v.).</li>
<li>Các loại trừ: <strong>SHEX</strong> (trừ Chủ nhật và ngày lễ), <strong>SHINC</strong> (kể cả Chủ nhật và ngày lễ), <strong>WWD</strong> (ngày làm việc thời tiết tốt — thời gian mất do thời tiết xấu không tính).</li>
<li><strong>Tiền phạt làm hàng chậm (demurrage)</strong> là khoản tiền theo ngày đã thoả thuận mà người thuê tàu trả chủ tàu khi vượt laytime — một khoản bồi thường ấn định trước vì giữ tàu. Theo nguyên tắc "<strong>đã phạt thì phạt luôn</strong>" (once on demurrage, always on demurrage), các loại trừ như Chủ nhật hay thời tiết xấu thường không còn bảo vệ người thuê tàu sau khi laytime đã hết.</li>
<li><strong>Tiền thưởng làm hàng nhanh (despatch)</strong> là khoản chủ tàu trả người thuê tàu khi làm hàng xong sớm, thường bằng một nửa mức demurrage, tính trên "toàn bộ thời gian tiết kiệm" hay "thời gian làm việc tiết kiệm" tuỳ thoả thuận.</li>
<li>Laytime có thể tính <strong>riêng</strong> cho cảng xếp và cảng dỡ, hoặc <strong>bù trừ (reversible)</strong> — gộp chung cho cả hai cảng — lựa chọn này làm thay đổi kết quả (Bài tập 1).</li>
</ul>
<pre><code>Minh hoạ: 25.000 t, mức xếp 5.000 t/ngày SHINC  ->  laytime 5 ngày
Dùng hết 6,5 ngày  ->  demurrage 1,5 x 10.000 USD = 15.000 USD trả cho chủ tàu
Dùng 4 ngày        ->  tiết kiệm 1 ngày, despatch nửa mức 1 x 5.000 = 5.000 USD trả cho người thuê</code></pre>
<div class="callout"><span class="badge">Ghi nhớ</span> Demurrage tồn tại vì một con tàu nằm chờ vẫn tốn của chủ tàu chi phí vốn và chi phí vận hành mỗi ngày. Câu chữ của hợp đồng thuê tàu quyết định tất cả — luôn đọc kỹ các điều khoản laytime trước khi ký.</div>`,
  ]]);

const c4e = doc('glt301-2-3-exercise', 'Exercise 1 — laytime, demurrage & despatch on a grain voyage|||Bài tập 1 — laytime, demurrage & despatch cho một chuyến chở ngũ cốc',
  'Bài tập: tính laytime cho phép ở cảng xếp và cảng dỡ, tiền phạt làm hàng chậm và tiền thưởng làm hàng nhanh cho một chuyến thuê tàu giả định, so sánh cách tính riêng từng cảng với laytime bù trừ; kèm lời giải.',
  [[
    `<span class="eyebrow">GLT301 · Part 2 · Exercise 1</span>
<h2>Exercise 1 — who pays whom at the end of the voyage?</h2>
<div class="callout"><span class="badge">Problem</span> A voyage charter (a fictional case, illustrative numbers) carries 36,000 tonnes of grain. Loading rate 6,000 tonnes per day SHINC; discharging rate 9,000 tonnes per day SHINC. Demurrage USD 12,000 per day pro rata; despatch at half the demurrage rate on laytime saved. Time counted after the notices of readiness: loading 7 days 18 hours; discharging 3 days 6 hours. (a) Compute laytime at each port. (b) Compute demurrage and despatch if laytime is counted separately for each port, and the net amount due. (c) Recompute if laytime is reversible (one pool for both ports).</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) Loading laytime     = 36,000 / 6,000 = 6.00 days
    Discharging laytime = 36,000 / 9,000 = 4.00 days

(b) Separate counting
    Loading:     used 7 days 18 h = 7.75 days  ->  exceeded 7.75 − 6.00 = 1.75 days
                 demurrage = 1.75 x 12,000 = USD 21,000   (charterer pays owner)
    Discharging: used 3 days 6 h  = 3.25 days  ->  saved 4.00 − 3.25 = 0.75 day
                 despatch  = 0.75 x 6,000  = USD 4,500    (owner pays charterer)
    Net: charterer pays owner 21,000 − 4,500 = USD 16,500

(c) Reversible laytime
    Laytime allowed = 6.00 + 4.00 = 10.00 days
    Time used       = 7.75 + 3.25 = 11.00 days
    Demurrage       = 1.00 x 12,000 = USD 12,000   (no separate despatch)
    Difference versus (b): 16,500 − 12,000 = USD 4,500 in the charterer’s favour</code></pre>
<p><strong>Why:</strong> under reversible laytime, the 0.75 day saved at discharge cancels 0.75 day of demurrage at the full rate (worth 9,000), instead of earning despatch at only half the rate (4,500). That is why charterers prefer reversible laytime and owners prefer separate counting. Real calculations also apply the exceptions (SHEX, weather), the NOR notice period and "once on demurrage, always on demurrage" — which is why a laytime statement is built line by line from the ship’s statement of facts.</p>`,
    `<span class="eyebrow">GLT301 · Phần 2 · Bài tập 1</span>
<h2>Bài tập 1 — cuối chuyến ai trả tiền cho ai?</h2>
<div class="callout"><span class="badge">Đề</span> Một hợp đồng thuê chuyến (tình huống giả định, số liệu minh hoạ giả định) chở 36.000 tấn ngũ cốc. Mức xếp 6.000 tấn/ngày SHINC; mức dỡ 9.000 tấn/ngày SHINC. Demurrage 12.000 USD/ngày, tính theo tỷ lệ thời gian; despatch bằng nửa mức demurrage, tính trên laytime tiết kiệm. Thời gian được tính sau các thông báo sẵn sàng: xếp hàng 7 ngày 18 giờ; dỡ hàng 3 ngày 6 giờ. (a) Tính laytime ở mỗi cảng. (b) Tính demurrage và despatch nếu laytime tính riêng từng cảng, và số tiền ròng phải trả. (c) Tính lại nếu laytime bù trừ (gộp chung cho hai cảng).</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) Laytime cảng xếp = 36.000 / 6.000 = 6,00 ngày
    Laytime cảng dỡ  = 36.000 / 9.000 = 4,00 ngày

(b) Tính riêng từng cảng
    Cảng xếp: dùng 7 ngày 18 giờ = 7,75 ngày  ->  vượt 7,75 − 6,00 = 1,75 ngày
              demurrage = 1,75 x 12.000 = 21.000 USD   (người thuê trả chủ tàu)
    Cảng dỡ:  dùng 3 ngày 6 giờ  = 3,25 ngày  ->  tiết kiệm 4,00 − 3,25 = 0,75 ngày
              despatch  = 0,75 x 6.000  = 4.500 USD    (chủ tàu trả người thuê)
    Ròng: người thuê trả chủ tàu 21.000 − 4.500 = 16.500 USD

(c) Laytime bù trừ
    Laytime cho phép = 6,00 + 4,00 = 10,00 ngày
    Thời gian đã dùng = 7,75 + 3,25 = 11,00 ngày
    Demurrage        = 1,00 x 12.000 = 12.000 USD   (không có despatch riêng)
    Chênh lệch so với (b): 16.500 − 12.000 = 4.500 USD có lợi cho người thuê tàu</code></pre>
<p><strong>Vì sao:</strong> với laytime bù trừ, 0,75 ngày tiết kiệm ở cảng dỡ triệt tiêu 0,75 ngày demurrage theo mức đầy đủ (trị giá 9.000), thay vì chỉ được despatch theo nửa mức (4.500). Vì vậy người thuê tàu thích laytime bù trừ còn chủ tàu thích tính riêng. Tính toán thực tế còn phải áp dụng các loại trừ (SHEX, thời tiết), thời hạn thông báo NOR và nguyên tắc "đã phạt thì phạt luôn" — đó là lý do bảng tính thời gian làm hàng (laytime statement) được lập từng dòng dựa trên biên bản sự việc (statement of facts) của tàu.</p>`,
  ]]);

const c4q = quiz('glt301-quiz-2', 'Quiz 2 — Shipping markets & chartering|||Quiz 2 — Thị trường vận tải biển & thuê tàu', [
  { id: 'q1', question: 'Under a time charter, who normally pays for bunkers (fuel) and port charges?|||Theo hợp đồng thuê định hạn, ai thường trả tiền nhiên liệu và phí cảng?', options: ['The shipowner|||Chủ tàu', 'The charterer|||Người thuê tàu', 'The shipbroker|||Người môi giới thuê tàu', 'The cargo insurer|||Người bảo hiểm hàng hoá'], correctIndex: 1, explanation: 'In a time charter the owner keeps operating costs (crew, maintenance), while the charterer directs the ship and pays voyage costs such as bunkers and port charges.|||Trong thuê định hạn chủ tàu giữ chi phí vận hành (thuyền bộ, bảo dưỡng), còn người thuê điều hành tàu và trả chi phí chuyến đi như nhiên liệu và phí cảng.' },
  { id: 'q2', question: 'Which statement describes tramp shipping?|||Nhận định nào mô tả tàu chạy rông (tramp)?', options: ['A published weekly schedule open to any shipper|||Lịch trình hằng tuần công bố trước, mở cho mọi người gửi hàng', 'Freight is always fixed by a public tariff|||Cước luôn do một biểu cước công khai quy định', 'No fixed route; the ship is chartered to carry a large cargo where it is needed|||Không có tuyến cố định; tàu được thuê để chở một lô hàng lớn tới nơi cần', 'It only carries containers|||Chỉ chở container'], correctIndex: 2, explanation: 'Tramp ships follow the cargo under charter parties; scheduled container services are liner shipping.|||Tàu chạy rông đi theo hàng hoá theo hợp đồng thuê tàu; dịch vụ container theo lịch trình là tàu chợ.' },
  { id: 'q3', question: 'A ship loads 30,000 t at a laytime rate of 6,000 t per day SHINC. Loading takes 6 days and demurrage is USD 8,000 per day. What does the charterer owe?|||Tàu xếp 30.000 t với mức xếp tính laytime 6.000 t/ngày SHINC. Xếp hàng mất 6 ngày, demurrage 8.000 USD/ngày. Người thuê tàu nợ bao nhiêu?', options: ['USD 8,000 demurrage|||8.000 USD demurrage', 'USD 48,000 demurrage|||48.000 USD demurrage', 'USD 4,000 despatch is earned|||Được 4.000 USD despatch', 'Nothing, laytime was not exceeded|||Không gì cả, chưa vượt laytime'], correctIndex: 0, explanation: 'Laytime = 30,000 / 6,000 = 5 days; 6 days used, so 1 day of demurrage x 8,000 = 8,000.|||Laytime = 30.000 / 6.000 = 5 ngày; dùng 6 ngày nên vượt 1 ngày x 8.000 = 8.000.' },
]);

const c5 = doc('glt301-3-1-containers-freight', '3.1 — Containers & liner freight: TEU, FCL/LCL, W/M & surcharges|||3.1 — Container & cước tàu chợ: TEU, FCL/LCL, W/M & phụ phí',
  'Lợi ích của container hoá, TEU và FEU, các loại container và kích thước gần đúng, hàng nguyên container (FCL) và hàng lẻ (LCL), CY và CFS, cách tính cước hàng lẻ theo W/M (1 CBM = 1 tấn cước), các phụ phí BAF, CAF, THC, PSS và phí lưu container, lưu bãi; khai báo VGM.',
  [[
    `<span class="eyebrow">GLT301 · Part 3 · Lesson 3.1</span>
<h2>Containers &amp; liner freight: TEU, FCL/LCL, W/M &amp; surcharges</h2>
<p class="lead">The standard container turned slow, labour-heavy break-bulk handling into a fast, sealed, door-to-door system. Goods are packed once, moved between ship, truck and train without being touched, and tracked as one unit.</p>
<h3>TEU, FEU and container types</h3>
<p>Capacity is measured in <strong>TEU</strong> (twenty-foot equivalent unit): a 20-foot container is 1 TEU, a 40-foot container (<strong>FEU</strong>) is 2 TEU. A shipment of 30 × 20’ and 25 × 40’ is 30 + 50 = 80 TEU. Container sizes follow ISO standards; internal volumes below are approximate and vary by manufacturer — always check the carrier’s specification, including the maximum payload and local road weight limits.</p>
<table>
<tr><th>Type</th><th>Use</th><th>Approximate internal volume</th></tr>
<tr><td>20’ dry (general purpose)</td><td>Heavy, dense cargo</td><td>about 33 CBM</td></tr>
<tr><td>40’ dry</td><td>General cargo</td><td>about 67 CBM</td></tr>
<tr><td>40’ high cube</td><td>Light, bulky cargo (about 30 cm taller)</td><td>about 76 CBM</td></tr>
<tr><td>Reefer</td><td>Chilled and frozen goods, with its own refrigeration unit</td><td>Less than the dry equivalent</td></tr>
<tr><td>Open top, flat rack</td><td>Over-height or over-width machinery, loaded from above or the side</td><td>—</td></tr>
<tr><td>Tank container</td><td>Liquids, chemicals, food-grade oils</td><td>—</td></tr>
</table>
<h3>FCL vs LCL</h3>
<table>
<tr><th></th><th>FCL (full container load)</th><th>LCL (less than container load)</th></tr>
<tr><td>Who fills the box</td><td>One shipper uses the whole container</td><td>A consolidator groups cargo of several shippers in one container</td></tr>
<tr><td>Where it is handed over</td><td>Container yard (CY) at the terminal, or packed at the shipper’s premises</td><td>Container freight station (CFS), where cargo is packed and unpacked</td></tr>
<tr><td>How freight is charged</td><td>Per container (box rate) plus surcharges</td><td>Per revenue ton (W/M) plus CFS charges, with a minimum charge</td></tr>
<tr><td>Pros and cons</td><td>Cheaper per unit for large lots, less handling, sealed door to door</td><td>Pays only for the space used; slower, more handling and risk of damage</td></tr>
</table>
<h3>LCL freight: weight or measurement (W/M)</h3>
<pre><code>Revenue ton = the greater of gross weight in tonnes and volume in CBM
(1 CBM is treated as 1 freight tonne; minimum charge usually 1 W/M)
Lot A: 2.4 CBM, 1,100 kg  ->  max(2.4, 1.1) = 2.4 W/M  x USD 50 = USD 120
Lot B: 1.5 CBM, 2,300 kg  ->  max(1.5, 2.3) = 2.3 W/M  x USD 50 = USD 115
(illustrative rate)</code></pre>
<p>Light, bulky goods pay by volume; dense goods pay by weight. The ship carries both kinds, so it charges whichever uses more of its capacity.</p>
<h3>Common surcharges (definitions only — levels change and differ by carrier)</h3>
<table>
<tr><th>Code</th><th>Name</th><th>What it covers</th></tr>
<tr><td>BAF</td><td>Bunker adjustment factor</td><td>Changes in fuel prices</td></tr>
<tr><td>CAF</td><td>Currency adjustment factor</td><td>Changes in exchange rates between the freight currency and the carrier’s costs</td></tr>
<tr><td>THC</td><td>Terminal handling charge</td><td>Handling the container at the origin (OTHC) or destination (DTHC) terminal</td></tr>
<tr><td>PSS</td><td>Peak season surcharge</td><td>Periods of high demand and scarce space</td></tr>
<tr><td>LSS</td><td>Low sulphur surcharge</td><td>Extra cost of compliant low-sulphur fuel (Part 5)</td></tr>
<tr><td>CIC</td><td>Container imbalance charge</td><td>Repositioning empty containers when trade is unbalanced</td></tr>
</table>
<p>Two more charges cause many disputes: <strong>container demurrage</strong> (for keeping a full container in the terminal beyond the free time) and <strong>detention</strong> (for keeping the carrier’s container outside the terminal beyond the free time). These are not the same as the ship demurrage of lesson 2.2. Since 2016, SOLAS also requires the shipper to declare the <strong>verified gross mass (VGM)</strong> of each packed container before loading.</p>
<div class="callout"><span class="badge">Watch out</span> Compare "all-in" costs, not base rates. A low ocean rate with high surcharges, CFS fees and short free time can end up more expensive than a higher all-in quote.</div>`,
    `<span class="eyebrow">GLT301 · Phần 3 · Bài 3.1</span>
<h2>Container &amp; cước tàu chợ: TEU, FCL/LCL, W/M &amp; phụ phí</h2>
<p class="lead">Container tiêu chuẩn đã biến việc làm hàng bách hoá chậm chạp, tốn nhân công thành một hệ thống nhanh, niêm phong, từ cửa tới cửa. Hàng được đóng một lần, chuyển giữa tàu, xe tải và tàu hoả mà không phải động tới, và được theo dõi như một đơn vị.</p>
<h3>TEU, FEU và các loại container</h3>
<p>Sức chở được đo bằng <strong>TEU</strong> (đơn vị tương đương container 20 feet): container 20 feet là 1 TEU, container 40 feet (<strong>FEU</strong>) là 2 TEU. Một lô gồm 30 container 20’ và 25 container 40’ là 30 + 50 = 80 TEU. Kích thước container theo tiêu chuẩn ISO; thể tích bên trong dưới đây là gần đúng và khác nhau giữa các nhà sản xuất — luôn kiểm thông số của hãng tàu, gồm cả trọng lượng hàng tối đa và giới hạn tải trọng đường bộ tại địa phương.</p>
<table>
<tr><th>Loại</th><th>Công dụng</th><th>Thể tích trong gần đúng</th></tr>
<tr><td>20’ khô (thông dụng)</td><td>Hàng nặng, mật độ cao</td><td>khoảng 33 CBM</td></tr>
<tr><td>40’ khô</td><td>Hàng bách hoá</td><td>khoảng 67 CBM</td></tr>
<tr><td>40’ cao (high cube)</td><td>Hàng nhẹ, cồng kềnh (cao hơn khoảng 30 cm)</td><td>khoảng 76 CBM</td></tr>
<tr><td>Container lạnh (reefer)</td><td>Hàng mát và đông lạnh, có máy lạnh riêng</td><td>Nhỏ hơn loại khô cùng cỡ</td></tr>
<tr><td>Container mở nóc, container mặt bằng (flat rack)</td><td>Máy móc quá cao hoặc quá rộng, xếp từ trên xuống hoặc từ bên hông</td><td>—</td></tr>
<tr><td>Container bồn (tank)</td><td>Chất lỏng, hoá chất, dầu thực phẩm</td><td>—</td></tr>
</table>
<h3>FCL và LCL</h3>
<table>
<tr><th></th><th>FCL (hàng nguyên container)</th><th>LCL (hàng lẻ)</th></tr>
<tr><td>Ai đóng hàng vào container</td><td>Một người gửi hàng dùng cả container</td><td>Người gom hàng ghép hàng của nhiều người gửi vào một container</td></tr>
<tr><td>Giao nhận ở đâu</td><td>Bãi container (CY) tại cảng, hoặc đóng hàng tại kho người gửi</td><td>Trạm khai thác hàng lẻ (CFS), nơi đóng và rút hàng</td></tr>
<tr><td>Tính cước thế nào</td><td>Theo container (cước trọn container) cộng phụ phí</td><td>Theo tấn cước (W/M) cộng phí CFS, có mức cước tối thiểu</td></tr>
<tr><td>Ưu và nhược điểm</td><td>Rẻ hơn trên mỗi đơn vị với lô lớn, ít làm hàng, niêm phong từ cửa tới cửa</td><td>Chỉ trả cho chỗ đã dùng; chậm hơn, làm hàng nhiều hơn, rủi ro hư hỏng cao hơn</td></tr>
</table>
<h3>Cước hàng lẻ: theo trọng lượng hoặc thể tích (W/M)</h3>
<pre><code>Tấn cước = số lớn hơn giữa trọng lượng cả bì tính bằng tấn và thể tích tính bằng CBM
(1 CBM được coi là 1 tấn cước; mức tối thiểu thường là 1 W/M)
Lô A: 2,4 CBM, 1.100 kg  ->  max(2,4; 1,1) = 2,4 W/M  x 50 USD = 120 USD
Lô B: 1,5 CBM, 2.300 kg  ->  max(1,5; 2,3) = 2,3 W/M  x 50 USD = 115 USD
(mức cước minh hoạ)</code></pre>
<p>Hàng nhẹ, cồng kềnh trả theo thể tích; hàng nặng trả theo trọng lượng. Con tàu chở cả hai loại, nên nó tính theo đại lượng nào chiếm nhiều năng lực của tàu hơn.</p>
<h3>Các phụ phí thường gặp (chỉ định nghĩa — mức phí thay đổi và khác nhau giữa các hãng)</h3>
<table>
<tr><th>Mã</th><th>Tên</th><th>Bù đắp cho</th></tr>
<tr><td>BAF</td><td>Phụ phí biến động giá nhiên liệu</td><td>Thay đổi giá nhiên liệu</td></tr>
<tr><td>CAF</td><td>Phụ phí biến động tỷ giá</td><td>Thay đổi tỷ giá giữa đồng tiền tính cước và chi phí của hãng tàu</td></tr>
<tr><td>THC</td><td>Phụ phí xếp dỡ tại cảng</td><td>Làm hàng container tại cảng đi (OTHC) hoặc cảng đến (DTHC)</td></tr>
<tr><td>PSS</td><td>Phụ phí mùa cao điểm</td><td>Thời kỳ nhu cầu cao, chỗ khan hiếm</td></tr>
<tr><td>LSS</td><td>Phụ phí nhiên liệu ít lưu huỳnh</td><td>Chi phí tăng thêm của nhiên liệu ít lưu huỳnh đáp ứng quy định (Phần 5)</td></tr>
<tr><td>CIC</td><td>Phụ phí mất cân bằng container</td><td>Điều container rỗng khi thương mại hai chiều lệch nhau</td></tr>
</table>
<p>Hai khoản nữa gây nhiều tranh chấp: <strong>phí lưu container tại bãi (container demurrage)</strong> — giữ container hàng trong cảng quá thời gian miễn phí, và <strong>phí lưu container ngoài cảng (detention)</strong> — giữ container của hãng tàu bên ngoài cảng quá thời gian miễn phí. Chúng không giống demurrage của tàu ở bài 2.2. Từ năm 2016, SOLAS còn yêu cầu người gửi hàng khai báo <strong>khối lượng toàn bộ đã xác minh (VGM)</strong> của mỗi container đã đóng hàng trước khi xếp lên tàu.</p>
<div class="callout"><span class="badge">Cẩn thận</span> So sánh chi phí "trọn gói", đừng so cước gốc. Cước biển thấp nhưng phụ phí cao, phí CFS cao và thời gian miễn phí ngắn có thể đắt hơn một báo giá trọn gói cao hơn.</div>`,
  ]]);

const c5e = doc('glt301-3-2-exercise', 'Exercise 2 — FCL or LCL? W/M charges and the break-even point|||Bài tập 2 — FCL hay LCL? Cước W/M và điểm hoà vốn',
  'Bài tập: tính tấn cước W/M và cước hàng lẻ cho hai lô hàng giả định (hàng nhẹ và hàng nặng), tìm điểm hoà vốn khi nên chuyển sang thuê nguyên container 20 feet, và quyết định cho một lô 22 CBM; kèm lời giải.',
  [[
    `<span class="eyebrow">GLT301 · Part 3 · Exercise 2</span>
<h2>Exercise 2 — when does a full 20’ container pay off?</h2>
<div class="callout"><span class="badge">Problem</span> A Vietnamese exporter (a fictional case, illustrative rates) ships to a European port. LCL quote per W/M: ocean freight USD 36 + BAF USD 4 + origin CFS USD 10 + destination CFS USD 12. FCL 20’ quote per container: ocean freight USD 850 + BAF USD 100 + origin THC USD 120 + destination THC USD 130. Either way there is a bill-of-lading fee of USD 35 per shipment. (a) Compute the LCL cost of Lot A (8 CBM, 3,200 kg) and Lot B (5.5 CBM, 7,400 kg). (b) Above how many revenue tons is one 20’ FCL cheaper than LCL? (c) Lot C is 22 CBM and 6,000 kg. LCL or FCL?</div>
<h3>Worked solution</h3>
<pre><code class="language-text">LCL all-in rate = 36 + 4 + 10 + 12       = USD 62 per W/M
FCL 20’ all-in  = 850 + 100 + 120 + 130  = USD 1,200 per container

(a) Lot A: max(8 CBM, 3.2 t)   = 8.0 W/M  ->  8.0 x 62 + 35 = USD 531.00
    Lot B: max(5.5 CBM, 7.4 t) = 7.4 W/M  ->  7.4 x 62 + 35 = USD 493.80
    (Lot B is charged on weight because it is dense cargo)

(b) Break-even: 62 x W + 35 = 1,200 + 35
                W = 1,200 / 62 = 19.35 W/M
    Above about 19.4 revenue tons, one 20’ FCL is cheaper.

(c) Lot C: max(22 CBM, 6 t) = 22 W/M
    LCL = 22 x 62 + 35 = USD 1,399      FCL = 1,200 + 35 = USD 1,235
    FCL saves 1,399 − 1,235 = USD 164, and 22 CBM fits in a 20’ (about 33 CBM)</code></pre>
<p><strong>Why:</strong> LCL costs rise in proportion to the space used, while an FCL costs the same whether the box is half or completely full. Once a lot passes the break-even point, the full container wins on cost — and also on transit time, handling and damage risk, because it goes CY to CY sealed. Before switching, check the practical capacity (cargo rarely fills 100% of the internal volume), the payload and road weight limits, and whether the consignee can unload a full container at its premises.</p>`,
    `<span class="eyebrow">GLT301 · Phần 3 · Bài tập 2</span>
<h2>Bài tập 2 — khi nào thuê nguyên container 20’ có lợi?</h2>
<div class="callout"><span class="badge">Đề</span> Một doanh nghiệp xuất khẩu Việt Nam (tình huống giả định, mức cước minh hoạ giả định) gửi hàng tới một cảng châu Âu. Báo giá LCL mỗi W/M: cước biển 36 USD + BAF 4 USD + phí CFS đầu xuất 10 USD + phí CFS đầu nhập 12 USD. Báo giá FCL 20’ mỗi container: cước biển 850 USD + BAF 100 USD + THC đầu xuất 120 USD + THC đầu nhập 130 USD. Cách nào cũng có phí vận đơn 35 USD mỗi lô. (a) Tính cước LCL của Lô A (8 CBM, 3.200 kg) và Lô B (5,5 CBM, 7.400 kg). (b) Trên bao nhiêu tấn cước thì một container 20’ FCL rẻ hơn LCL? (c) Lô C gồm 22 CBM và 6.000 kg. Chọn LCL hay FCL?</div>
<h3>Lời giải</h3>
<pre><code class="language-text">Đơn giá LCL trọn gói = 36 + 4 + 10 + 12       = 62 USD mỗi W/M
FCL 20’ trọn gói     = 850 + 100 + 120 + 130  = 1.200 USD mỗi container

(a) Lô A: max(8 CBM; 3,2 t)   = 8,0 W/M  ->  8,0 x 62 + 35 = 531,00 USD
    Lô B: max(5,5 CBM; 7,4 t) = 7,4 W/M  ->  7,4 x 62 + 35 = 493,80 USD
    (Lô B tính theo trọng lượng vì là hàng nặng)

(b) Hoà vốn: 62 x W + 35 = 1.200 + 35
             W = 1.200 / 62 = 19,35 W/M
    Trên khoảng 19,4 tấn cước, một container 20’ FCL rẻ hơn.

(c) Lô C: max(22 CBM; 6 t) = 22 W/M
    LCL = 22 x 62 + 35 = 1.399 USD      FCL = 1.200 + 35 = 1.235 USD
    FCL tiết kiệm 1.399 − 1.235 = 164 USD, và 22 CBM vừa một container 20’ (khoảng 33 CBM)</code></pre>
<p><strong>Vì sao:</strong> chi phí LCL tăng tỷ lệ thuận với chỗ đã dùng, còn một FCL tốn như nhau dù container đầy một nửa hay đầy hẳn. Khi lô hàng vượt điểm hoà vốn, nguyên container thắng về chi phí — và cả về thời gian, số lần làm hàng, rủi ro hư hỏng, vì nó đi từ bãi tới bãi (CY/CY) còn nguyên niêm phong. Trước khi chuyển, hãy kiểm sức chứa thực tế (hàng hiếm khi lấp đầy 100% thể tích trong), trọng lượng hàng tối đa và giới hạn tải trọng đường bộ, và người nhận có rút được hàng nguyên container tại kho của mình hay không.</p>`,
  ]]);

const c6 = doc('glt301-3-3-bill-of-lading', '3.3 — The bill of lading & the sea waybill|||3.3 — Vận đơn đường biển & giấy gửi hàng đường biển',
  'Ba chức năng của vận đơn đường biển, các loại vận đơn (đã xếp hàng và nhận hàng để xếp, sạch và không sạch, đích danh, theo lệnh và vô danh, vận đơn chủ và vận đơn nhà, vận đơn chở suốt), bộ vận đơn gốc, ký hậu, giao hàng không cần vận đơn gốc, vận đơn điện giao hàng và giấy gửi hàng đường biển.',
  [[
    `<span class="eyebrow">GLT301 · Part 3 · Lesson 3.3</span>
<h2>The bill of lading &amp; the sea waybill</h2>
<p class="lead">The bill of lading (B/L) is the most important document in sea transport. Whoever controls the original B/L usually controls the goods — which is why banks, buyers and sellers care so much about it.</p>
<h3>The three functions of a bill of lading</h3>
<ol>
<li><strong>Receipt for the goods.</strong> The carrier acknowledges having received the goods, stating their description, quantity or weight and apparent order and condition.</li>
<li><strong>Evidence of the contract of carriage.</strong> The contract is usually made earlier, at booking; the B/L and its terms on the reverse are the best evidence of it.</li>
<li><strong>Document of title.</strong> A negotiable B/L represents the goods: transferring it (by endorsement and delivery) transfers the right to take delivery. The carrier must deliver only against presentation of an original.</li>
</ol>
<h3>Types of bills of lading</h3>
<table>
<tr><th>Criterion</th><th>Types</th><th>What it means</th></tr>
<tr><td>Loading status</td><td>Shipped on board vs received for shipment</td><td>"Shipped" confirms the goods are on the named ship; a "received" B/L only confirms the carrier holds them, and becomes shipped when an on-board notation is added</td></tr>
<tr><td>Condition remarks</td><td>Clean vs claused (foul)</td><td>A clean B/L has no remarks about defective goods or packing; a claused B/L notes damage, such as "3 cartons torn"</td></tr>
<tr><td>Consignee</td><td>Straight (named), order, bearer</td><td>Straight: delivery to the named consignee only, not negotiable. Order: "to order" or "to order of" a bank or shipper, transferable by endorsement. Bearer: whoever holds it — rarely used because of the risk of loss or theft</td></tr>
<tr><td>Issuer</td><td>Master B/L vs house B/L</td><td>The shipping line issues the master B/L (often to a forwarder); the forwarder or NVOCC issues its own house B/L to the actual shipper</td></tr>
<tr><td>Route</td><td>Direct, through, combined transport</td><td>A through or combined-transport B/L covers transhipment or several modes under one document</td></tr>
</table>
<p>B/Ls are usually issued in a <strong>full set</strong> of originals (often three); presenting one original accomplishes delivery and voids the others. Banks paying under a <strong>documentary credit</strong> generally require a clean, on-board B/L — the rules banks follow are published by ICC in UCP 600.</p>
<h3>Delivery problems and their solutions</h3>
<ul>
<li>When the ship arrives before the original B/L, the consignee may ask for delivery against a <strong>letter of indemnity (LOI)</strong>, often countersigned by a bank. This is risky for the carrier: if the wrong party received the goods, it can be liable to the true holder.</li>
<li>A <strong>surrendered B/L</strong> (telex release): the shipper hands the originals back at origin, and the carrier instructs its destination office to release the goods without originals.</li>
<li><strong>Electronic B/Ls</strong> on approved platforms reproduce the functions of paper, but their legal recognition depends on the platform rules and the applicable law.</li>
</ul>
<h3>The sea waybill</h3>
<p>A <strong>sea waybill</strong> is a receipt and evidence of the contract, but <strong>not a document of title</strong> and not negotiable. The carrier delivers to the named consignee on proof of identity, without any original. It suits shipments between related companies, sales on open account and trades where the goods are not sold in transit — it is faster and avoids delays from late originals. It does not suit documentary credits that rely on control of the goods.</p>
<div class="callout"><span class="badge">Remember</span> Negotiable B/L = control of the goods; sea waybill = speed without control. Choose according to whether someone — a bank or the seller — needs to keep control until payment.</div>`,
    `<span class="eyebrow">GLT301 · Phần 3 · Bài 3.3</span>
<h2>Vận đơn đường biển &amp; giấy gửi hàng đường biển</h2>
<p class="lead">Vận đơn đường biển (B/L) là chứng từ quan trọng nhất trong vận tải biển. Ai kiểm soát vận đơn gốc thường kiểm soát hàng hoá — vì vậy ngân hàng, người mua và người bán rất quan tâm tới nó.</p>
<h3>Ba chức năng của vận đơn đường biển</h3>
<ol>
<li><strong>Biên lai nhận hàng.</strong> Người chuyên chở xác nhận đã nhận hàng, ghi mô tả, số lượng hoặc trọng lượng và tình trạng bên ngoài của hàng.</li>
<li><strong>Bằng chứng của hợp đồng vận chuyển.</strong> Hợp đồng thường được giao kết trước đó, khi lưu khoang; vận đơn và các điều khoản ở mặt sau là bằng chứng tốt nhất của hợp đồng.</li>
<li><strong>Chứng từ sở hữu hàng hoá.</strong> Vận đơn chuyển nhượng được đại diện cho hàng hoá: chuyển giao vận đơn (bằng ký hậu và trao tay) là chuyển giao quyền nhận hàng. Người chuyên chở chỉ được giao hàng khi được xuất trình một bản gốc.</li>
</ol>
<h3>Các loại vận đơn</h3>
<table>
<tr><th>Tiêu chí</th><th>Các loại</th><th>Ý nghĩa</th></tr>
<tr><td>Tình trạng xếp hàng</td><td>Vận đơn đã xếp hàng và vận đơn nhận hàng để xếp</td><td>"Đã xếp hàng" xác nhận hàng đã ở trên con tàu có tên; vận đơn "nhận để xếp" chỉ xác nhận người chuyên chở đang giữ hàng, và trở thành vận đơn đã xếp khi có ghi chú xếp hàng lên tàu</td></tr>
<tr><td>Ghi chú về tình trạng</td><td>Vận đơn sạch và vận đơn không sạch</td><td>Vận đơn sạch không có ghi chú về khuyết tật của hàng hay bao bì; vận đơn không sạch ghi nhận hư hỏng, ví dụ "3 thùng bị rách"</td></tr>
<tr><td>Người nhận hàng</td><td>Đích danh, theo lệnh, vô danh</td><td>Đích danh: chỉ giao cho người nhận có tên, không chuyển nhượng được. Theo lệnh: "theo lệnh" hoặc "theo lệnh của" một ngân hàng hay người gửi hàng, chuyển nhượng bằng ký hậu. Vô danh: ai cầm vận đơn là người nhận — hiếm dùng vì rủi ro mất hoặc bị đánh cắp</td></tr>
<tr><td>Người phát hành</td><td>Vận đơn chủ (master B/L) và vận đơn nhà (house B/L)</td><td>Hãng tàu phát hành vận đơn chủ (thường cho người giao nhận); người giao nhận hoặc NVOCC phát hành vận đơn nhà của mình cho người gửi hàng thực tế</td></tr>
<tr><td>Hành trình</td><td>Đi thẳng, chở suốt, vận tải kết hợp</td><td>Vận đơn chở suốt hoặc vận đơn vận tải kết hợp bao trọn việc chuyển tải hoặc nhiều phương thức trong một chứng từ</td></tr>
</table>
<p>Vận đơn thường được phát hành thành <strong>trọn bộ</strong> bản gốc (thường là ba bản); xuất trình một bản gốc là hoàn tất việc giao hàng và các bản kia hết giá trị. Ngân hàng thanh toán theo <strong>tín dụng chứng từ</strong> thường yêu cầu vận đơn sạch, đã xếp hàng — quy tắc mà các ngân hàng áp dụng do ICC ban hành trong UCP 600.</p>
<h3>Vướng mắc khi giao hàng và cách xử lý</h3>
<ul>
<li>Khi tàu tới trước vận đơn gốc, người nhận có thể xin nhận hàng bằng <strong>thư bảo đảm bồi thường (LOI)</strong>, thường có ngân hàng cùng ký. Việc này rủi ro cho người chuyên chở: nếu giao nhầm người, họ có thể phải chịu trách nhiệm trước người cầm vận đơn hợp pháp.</li>
<li><strong>Vận đơn đã xuất trình tại đầu gửi</strong> (điện giao hàng, telex release): người gửi hàng nộp lại bản gốc ở đầu xuất, và người chuyên chở chỉ thị văn phòng ở đầu nhận giao hàng mà không cần bản gốc.</li>
<li><strong>Vận đơn điện tử</strong> trên các nền tảng được chấp nhận tái hiện các chức năng của vận đơn giấy, nhưng giá trị pháp lý của nó phụ thuộc vào quy tắc của nền tảng và luật áp dụng.</li>
</ul>
<h3>Giấy gửi hàng đường biển (sea waybill)</h3>
<p><strong>Giấy gửi hàng đường biển</strong> là biên lai nhận hàng và bằng chứng của hợp đồng, nhưng <strong>không phải chứng từ sở hữu hàng hoá</strong> và không chuyển nhượng được. Người chuyên chở giao hàng cho người nhận có tên khi họ chứng minh được danh tính, không cần bản gốc nào. Nó phù hợp với lô hàng giữa các công ty liên kết, mua bán theo phương thức ghi sổ và các giao dịch mà hàng không bị bán lại trên đường — nhanh hơn và tránh chậm trễ do bản gốc tới muộn. Nó không phù hợp với tín dụng chứng từ vốn dựa vào việc kiểm soát hàng hoá.</p>
<div class="callout"><span class="badge">Ghi nhớ</span> Vận đơn chuyển nhượng được = kiểm soát hàng hoá; giấy gửi hàng đường biển = nhanh nhưng không kiểm soát. Hãy chọn tuỳ theo có ai — ngân hàng hay người bán — cần giữ quyền kiểm soát cho tới khi được thanh toán hay không.</div>`,
  ]]);

const c7 = doc('glt301-3-4-liability-regimes', '3.4 — Carrier liability at sea: Hague, Hague-Visby, Hamburg & Rotterdam Rules|||3.4 — Trách nhiệm của người chuyên chở đường biển: Quy tắc Hague, Hague-Visby, Hamburg & Rotterdam',
  'Vì sao cần công ước về vận đơn, nghĩa vụ cơ bản của người chuyên chở, bảng so sánh bốn chế độ trách nhiệm (cơ sở trách nhiệm, thời hạn trách nhiệm, miễn trách lỗi hàng vận, giới hạn trách nhiệm theo SDR có rào, thời hiệu), ví dụ tính giới hạn và lưu ý luật Việt Nam.',
  [[
    `<span class="eyebrow">GLT301 · Part 3 · Lesson 3.4</span>
<h2>Carrier liability at sea: Hague, Hague-Visby, Hamburg &amp; Rotterdam Rules</h2>
<p class="lead">If cargo is lost or damaged at sea, how much can the cargo owner recover from the carrier? International conventions answer this by setting minimum duties for carriers, lists of defences and financial limits — so that B/L terms cannot simply exclude all liability.</p>
<h3>The carrier’s basic duties (Hague-Visby model)</h3>
<ul>
<li>Exercise <strong>due diligence to make the ship seaworthy</strong> before and at the beginning of the voyage — properly crewed, equipped and supplied, with holds fit to carry the cargo.</li>
<li><strong>Properly and carefully</strong> load, handle, stow, carry, keep, care for and discharge the goods.</li>
<li>Issue a bill of lading on demand, showing marks, quantity or weight and apparent condition.</li>
</ul>
<h3>The four regimes compared</h3>
<table>
<tr><th>Point</th><th>Hague Rules (1924)</th><th>Hague-Visby Rules (1968 / 1979 protocols)</th><th>Hamburg Rules (1978)</th><th>Rotterdam Rules (2008)</th></tr>
<tr><td>Basis of liability</td><td>Fault-based with a long list of exceptions</td><td>Same as Hague</td><td>Presumed fault: the carrier must prove it took all reasonable measures</td><td>Fault-based with a structured burden of proof; duty of seaworthiness lasts for the whole voyage</td></tr>
<tr><td>Nautical fault defence (error in navigation or management of the ship)</td><td>Yes</td><td>Yes</td><td>No</td><td>No</td></tr>
<tr><td>Period covered</td><td>"Tackle to tackle" (loading to discharge)</td><td>Same</td><td>Port to port, while in the carrier’s charge</td><td>Door to door when the contract includes other modes ("maritime plus")</td></tr>
<tr><td>Limit of liability (check the text)</td><td>GBP 100 per package or unit in the original text</td><td>666.67 SDR per package or unit, or 2 SDR per kg gross weight, whichever is higher</td><td>835 SDR per package, or 2.5 SDR per kg, whichever is higher</td><td>875 SDR per package, or 3 SDR per kg, whichever is higher</td></tr>
<tr><td>Time bar for claims</td><td>1 year</td><td>1 year (extendable by agreement)</td><td>2 years</td><td>2 years</td></tr>
<tr><td>Status</td><td>Still applies in some states</td><td>The most widely applied regime in practice</td><td>In force for a smaller group of states</td><td>Signed by many states but not yet in force at the time of writing — check the UNCITRAL status page</td></tr>
</table>
<p><em>The SDR (special drawing right) is a unit of account of the IMF whose value is based on a basket of currencies. The figures above are the commonly cited headline limits; exact limits, exceptions and which regime applies depend on the convention text, the national law and the contract — always check the text of the convention before relying on a figure.</em></p>
<h3>Worked illustration of the limits</h3>
<pre><code>Limit = the higher of (per-package limit) and (per-kg limit x gross weight)
                          one 50 kg carton lost     one 1,000 kg pallet lost
Hague-Visby  666.67 / 2      666.67 SDR               2,000 SDR
Hamburg      835 / 2.5       835 SDR                  2,500 SDR
Rotterdam    875 / 3         875 SDR                  3,000 SDR</code></pre>
<p>The count of "packages" matters: under Hague-Visby, if the B/L lists the number of cartons packed in a container, each carton is a package; if it only says "1 container said to contain goods", the whole container may count as one package. Shippers can escape the limit by declaring a higher value in the B/L (usually for extra freight).</p>
<h3>Vietnam</h3>
<p>Vietnam’s Maritime Code 2015 governs carriage of goods by sea under Vietnamese law. It is a hybrid: it adopts the Hague-Visby limits (666.67 SDR per package or unit, or 2 SDR per kg) and keeps the nautical fault defence, but the carrier’s period of responsibility runs from receipt of the goods at the port of loading to completion of delivery at the port of discharge — port to port, closer to the Hamburg Rules than to "tackle to tackle". Check the text currently in force before applying any figure to a real claim.</p>
<div class="callout"><span class="badge">Practical point</span> Cargo claims are lost more often by missing deadlines than by weak arguments. Note damage at delivery, give written notice promptly and protect the time bar (one year under Hague-Visby) — or insure the goods, so that your insurer handles the recovery (Part 5).</div>`,
    `<span class="eyebrow">GLT301 · Phần 3 · Bài 3.4</span>
<h2>Trách nhiệm của người chuyên chở đường biển: Quy tắc Hague, Hague-Visby, Hamburg &amp; Rotterdam</h2>
<p class="lead">Nếu hàng bị mất hoặc hư hỏng trên biển, chủ hàng đòi được người chuyên chở bao nhiêu? Các công ước quốc tế trả lời bằng cách đặt ra nghĩa vụ tối thiểu của người chuyên chở, danh sách miễn trách và giới hạn tài chính — để điều khoản vận đơn không thể đơn giản loại bỏ mọi trách nhiệm.</p>
<h3>Nghĩa vụ cơ bản của người chuyên chở (theo mô hình Hague-Visby)</h3>
<ul>
<li>Thực hiện <strong>sự cần mẫn hợp lý để tàu có đủ khả năng đi biển</strong> trước và vào lúc bắt đầu chuyến đi — đủ thuyền bộ, trang thiết bị và vật phẩm, hầm hàng thích hợp để chở hàng.</li>
<li>Xếp, làm hàng, sắp đặt, chuyên chở, bảo quản, chăm sóc và dỡ hàng <strong>một cách thích hợp và cẩn thận</strong>.</li>
<li>Phát hành vận đơn khi được yêu cầu, ghi ký mã hiệu, số lượng hoặc trọng lượng và tình trạng bên ngoài của hàng.</li>
</ul>
<h3>So sánh bốn chế độ trách nhiệm</h3>
<table>
<tr><th>Nội dung</th><th>Quy tắc Hague (1924)</th><th>Quy tắc Hague-Visby (các nghị định thư 1968 / 1979)</th><th>Quy tắc Hamburg (1978)</th><th>Quy tắc Rotterdam (2008)</th></tr>
<tr><td>Cơ sở trách nhiệm</td><td>Dựa trên lỗi, kèm danh sách dài các miễn trách</td><td>Như Hague</td><td>Lỗi suy đoán: người chuyên chở phải chứng minh đã áp dụng mọi biện pháp hợp lý</td><td>Dựa trên lỗi với cơ chế phân chia nghĩa vụ chứng minh; nghĩa vụ đảm bảo khả năng đi biển kéo dài suốt chuyến</td></tr>
<tr><td>Miễn trách lỗi hàng vận (sai sót trong điều khiển hoặc quản trị tàu)</td><td>Có</td><td>Có</td><td>Không</td><td>Không</td></tr>
<tr><td>Thời hạn trách nhiệm</td><td>"Từ móc cẩu tới móc cẩu" (từ khi xếp tới khi dỡ)</td><td>Như Hague</td><td>Từ cảng tới cảng, trong thời gian hàng thuộc sự quản lý của người chuyên chở</td><td>Từ cửa tới cửa khi hợp đồng bao gồm cả phương thức khác ("hàng hải cộng")</td></tr>
<tr><td>Giới hạn trách nhiệm (kiểm văn bản)</td><td>100 bảng Anh mỗi kiện hoặc đơn vị trong văn bản gốc</td><td>666,67 SDR mỗi kiện hoặc đơn vị, hoặc 2 SDR mỗi kg trọng lượng cả bì, lấy số cao hơn</td><td>835 SDR mỗi kiện, hoặc 2,5 SDR mỗi kg, lấy số cao hơn</td><td>875 SDR mỗi kiện, hoặc 3 SDR mỗi kg, lấy số cao hơn</td></tr>
<tr><td>Thời hiệu khiếu kiện</td><td>1 năm</td><td>1 năm (có thể gia hạn theo thoả thuận)</td><td>2 năm</td><td>2 năm</td></tr>
<tr><td>Hiện trạng</td><td>Vẫn áp dụng ở một số quốc gia</td><td>Chế độ được áp dụng rộng rãi nhất trên thực tế</td><td>Có hiệu lực với một nhóm quốc gia nhỏ hơn</td><td>Nhiều quốc gia đã ký nhưng chưa có hiệu lực tại thời điểm biên soạn — kiểm trang tình trạng của UNCITRAL</td></tr>
</table>
<p><em>SDR (quyền rút vốn đặc biệt) là đơn vị tính toán của IMF, giá trị dựa trên một rổ tiền tệ. Các con số trên là mức giới hạn chính thường được trích dẫn; giới hạn chính xác, các ngoại lệ và việc chế độ nào được áp dụng phụ thuộc vào văn bản công ước, luật quốc gia và hợp đồng — luôn kiểm văn bản công ước trước khi dựa vào một con số.</em></p>
<h3>Minh hoạ cách tính giới hạn</h3>
<pre><code>Giới hạn = số cao hơn giữa (giới hạn mỗi kiện) và (giới hạn mỗi kg x trọng lượng cả bì)
                           mất một thùng 50 kg      mất một pallet 1.000 kg
Hague-Visby  666,67 / 2      666,67 SDR               2.000 SDR
Hamburg      835 / 2,5       835 SDR                  2.500 SDR
Rotterdam    875 / 3         875 SDR                  3.000 SDR</code></pre>
<p>Cách đếm "kiện" rất quan trọng: theo Hague-Visby, nếu vận đơn ghi số thùng đóng trong container thì mỗi thùng là một kiện; nếu chỉ ghi "1 container được cho là chứa hàng" thì cả container có thể bị coi là một kiện. Người gửi hàng có thể thoát khỏi giới hạn bằng cách kê khai giá trị cao hơn trên vận đơn (thường phải trả thêm cước).</p>
<h3>Việt Nam</h3>
<p>Bộ luật Hàng hải Việt Nam 2015 điều chỉnh vận chuyển hàng hoá bằng đường biển theo pháp luật Việt Nam. Đây là một chế độ lai: nó dùng mức giới hạn của Hague-Visby (666,67 SDR mỗi kiện hoặc đơn vị, hoặc 2 SDR mỗi kg) và giữ miễn trách lỗi hàng vận, nhưng thời hạn trách nhiệm của người chuyên chở tính từ khi nhận hàng tại cảng nhận hàng tới khi trả xong hàng tại cảng trả hàng — từ cảng tới cảng, gần với Quy tắc Hamburg hơn là "từ móc cẩu tới móc cẩu". Hãy kiểm văn bản đang có hiệu lực trước khi áp dụng bất kỳ con số nào cho một khiếu nại thực tế.</p>
<div class="callout"><span class="badge">Lưu ý thực tế</span> Khiếu nại hàng hoá thường thua vì trễ hạn nhiều hơn vì lý lẽ yếu. Ghi nhận hư hỏng khi nhận hàng, gửi thông báo bằng văn bản kịp thời và giữ thời hiệu (một năm theo Hague-Visby) — hoặc mua bảo hiểm cho hàng, để người bảo hiểm lo việc đòi bồi hoàn (Phần 5).</div>`,
  ]]);

const c7q = quiz('glt301-quiz-3', 'Quiz 3 — Containers, bills of lading & liability|||Quiz 3 — Container, vận đơn & trách nhiệm', [
  { id: 'q1', question: 'Which bill of lading can be transferred to a new holder by endorsement?|||Loại vận đơn nào có thể chuyển cho người cầm mới bằng ký hậu?', options: ['A straight (named consignee) bill of lading|||Vận đơn đích danh', 'A sea waybill|||Giấy gửi hàng đường biển', 'An order bill of lading|||Vận đơn theo lệnh', 'A mate’s receipt|||Biên lai thuyền phó'], correctIndex: 2, explanation: 'An order B/L ("to order of...") is negotiable by endorsement and delivery; straight B/Ls and sea waybills are not negotiable.|||Vận đơn theo lệnh ("theo lệnh của...") chuyển nhượng được bằng ký hậu và trao tay; vận đơn đích danh và giấy gửi hàng đường biển không chuyển nhượng được.' },
  { id: 'q2', question: 'An LCL lot measures 3 CBM and weighs 1,800 kg. At USD 50 per W/M, what is the freight?|||Một lô hàng lẻ có thể tích 3 CBM và nặng 1.800 kg. Với mức 50 USD mỗi W/M, cước là bao nhiêu?', options: ['USD 150|||150 USD', 'USD 90|||90 USD', 'USD 240|||240 USD', 'USD 1,800|||1.800 USD'], correctIndex: 0, explanation: 'Revenue tons = max(3 CBM, 1.8 t) = 3; 3 x 50 = 150. 90 would wrongly use the weight.|||Tấn cước = max(3 CBM; 1,8 t) = 3; 3 x 50 = 150. Con số 90 là dùng nhầm trọng lượng.' },
  { id: 'q3', question: 'Which statement about the Hague-Visby Rules is correct?|||Nhận định nào về Quy tắc Hague-Visby là đúng?', options: ['They remove the nautical fault defence|||Chúng bỏ miễn trách lỗi hàng vận', 'The carrier must exercise due diligence to make the ship seaworthy before and at the beginning of the voyage|||Người chuyên chở phải thực hiện sự cần mẫn hợp lý để tàu đủ khả năng đi biển trước và vào lúc bắt đầu chuyến đi', 'They always cover door-to-door carriage|||Chúng luôn bao trọn vận chuyển từ cửa tới cửa', 'They have no limit of liability|||Chúng không có giới hạn trách nhiệm'], correctIndex: 1, explanation: 'Seaworthiness with due diligence is the core duty; the nautical fault defence remains, the period is tackle to tackle, and liability is limited per package or per kg.|||Đảm bảo khả năng đi biển với sự cần mẫn hợp lý là nghĩa vụ cốt lõi; miễn trách lỗi hàng vận vẫn còn, thời hạn là từ móc cẩu tới móc cẩu, và trách nhiệm bị giới hạn theo kiện hoặc theo kg.' },
]);

const c8 = doc('glt301-4-1-air-cargo', '4.1 — Air cargo: the air waybill, chargeable weight, ULDs & the Montreal Convention|||4.1 — Hàng không: vận đơn hàng không, trọng lượng tính cước, ULD & Công ước Montreal',
  'Đặc điểm và các bên trong vận tải hàng không (hãng bay, tàu bay chở hàng, khoang bụng, hãng chuyển phát, đại lý IATA), vận đơn hàng không (AWB, MAWB, HAWB, e-AWB), trọng lượng thể tích (6.000 cm³/kg) và trọng lượng tính cước, các bậc cước, ULD, hàng nguy hiểm và an ninh, Công ước Montreal 1999 (giới hạn có rào).',
  [[
    `<span class="eyebrow">GLT301 · Part 4 · Lesson 4.1</span>
<h2>Air cargo: the air waybill, chargeable weight, ULDs &amp; the Montreal Convention</h2>
<p class="lead">Air freight carries a small share of world trade by weight but a much larger share by value: it is the mode for goods that are urgent, perishable, fragile or simply too valuable to sit on a ship for a month.</p>
<h3>Who moves air cargo</h3>
<ul>
<li><strong>Belly cargo</strong> in the lower deck of passenger aircraft, and <strong>freighters</strong> (all-cargo aircraft) that can take larger and heavier pieces.</li>
<li><strong>Express integrators</strong> that own aircraft, hubs and trucks and sell door-to-door parcel services.</li>
<li><strong>Air freight forwarders</strong> (often IATA cargo agents) that book space, consolidate shipments and prepare documents; <strong>ground handling agents</strong> at airports.</li>
</ul>
<h3>The air waybill (AWB)</h3>
<p>The AWB is a <strong>receipt</strong> for the goods and <strong>evidence of the contract</strong> of carriage, but it is <strong>not negotiable and not a document of title</strong>: the goods are delivered to the consignee named on it. Under the Montreal Convention it is made out in three originals — for the carrier, the consignee and the shipper. A forwarder that consolidates cargo receives a <strong>master AWB (MAWB)</strong> from the airline and issues <strong>house AWBs (HAWB)</strong> to each shipper. Most airlines now use the electronic <strong>e-AWB</strong> promoted by IATA.</p>
<h3>Chargeable weight</h3>
<p>Aircraft run out of space before they run out of lift for light, bulky goods, so airlines charge on whichever is greater: the actual gross weight or the <strong>volumetric (dimensional) weight</strong>.</p>
<pre><code>Volumetric weight (kg) = length x width x height (cm) / 6,000
   (IATA standard ratio: 6,000 cm³ per kg, i.e. 1 CBM = 166.67 kg)
Chargeable weight = the greater of actual gross weight and volumetric weight
Example: box 50 x 40 x 30 cm = 60,000 cm³  ->  60,000 / 6,000 = 10 kg
         actual weight 7 kg  ->  chargeable weight 10 kg</code></pre>
<p>Weights are normally rounded up to the next half kilogram. Some express carriers use a different divisor (such as 5,000), which makes the volumetric weight higher — always check the carrier’s rule.</p>
<h3>How air rates are structured</h3>
<table>
<tr><th>Rate</th><th>Meaning</th></tr>
<tr><td>Minimum charge (M)</td><td>The lowest amount charged for any shipment, however small</td></tr>
<tr><td>Normal rate (N)</td><td>For general cargo under 45 kg</td></tr>
<tr><td>Quantity rates (Q)</td><td>Lower rates per kg at weight breaks such as 45, 100, 300, 500 and 1,000 kg</td></tr>
<tr><td>Specific commodity rates (SCR)</td><td>Special lower rates for named goods on named routes</td></tr>
<tr><td>Class rates</td><td>A percentage added to or taken from the normal rate for goods such as live animals, valuables or newspapers</td></tr>
</table>
<p>Because the rate per kg falls at each weight break, it can be cheaper to charge a shipment at the next break than at its real chargeable weight — see Exercise 3. Market quotes today are often all-in or split into rate plus fuel and security surcharges.</p>
<h3>ULDs, dangerous goods and security</h3>
<p><strong>Unit load devices (ULDs)</strong> are the pallets and containers shaped to fit the aircraft’s contour — for example the LD3 container used in the lower deck of wide-body aircraft. Forwarders often build their own consolidated ULDs. <strong>Dangerous goods</strong> (lithium batteries, flammable liquids, some chemicals) must be classified, packed, marked and declared under the IATA Dangerous Goods Regulations, based on ICAO rules. Cargo must also pass <strong>security controls</strong> — screening or a secure supply chain through regulated agents and known consignors.</p>
<h3>Liability: the Montreal Convention 1999</h3>
<ul>
<li>The carrier is liable for destruction, loss of or damage to cargo during the carriage by air, with limited defences (such as inherent defect of the cargo, defective packing by someone other than the carrier, acts of war or of public authority), and for delay.</li>
<li>Liability is limited to a fixed number of SDR per kilogram. ICAO reviews the limit periodically: at the time of writing it is about <strong>26 SDR per kg</strong> (e.g. 100 kg damaged → about 2,600 SDR) — check the current figure before relying on it. For cargo the limit can only be exceeded by a special declaration of value at the time of shipment.</li>
<li>Written complaints: within 14 days of receipt for damage, 21 days for delay; the right to sue lapses after 2 years. Some routes still fall under the older Warsaw system, which has different rules and limits.</li>
</ul>
<div class="callout"><span class="badge">Watch out</span> Pack densely for air. Every empty centimetre is paid for as volumetric weight — a good carton size can cut the air freight bill more than negotiating the rate.</div>`,
    `<span class="eyebrow">GLT301 · Phần 4 · Bài 4.1</span>
<h2>Hàng không: vận đơn hàng không, trọng lượng tính cước, ULD &amp; Công ước Montreal</h2>
<p class="lead">Vận tải hàng không chiếm tỷ trọng nhỏ trong thương mại thế giới tính theo khối lượng nhưng lớn hơn nhiều tính theo giá trị: đây là phương thức cho hàng gấp, dễ hỏng, dễ vỡ hoặc đơn giản là quá giá trị để nằm trên tàu biển cả tháng.</p>
<h3>Ai vận chuyển hàng không</h3>
<ul>
<li><strong>Hàng khoang bụng</strong> ở tầng dưới của tàu bay chở khách, và <strong>tàu bay chở hàng chuyên dụng</strong> nhận được kiện lớn hơn, nặng hơn.</li>
<li><strong>Hãng chuyển phát nhanh tích hợp</strong> sở hữu tàu bay, trung tâm khai thác và xe tải, bán dịch vụ bưu kiện từ cửa tới cửa.</li>
<li><strong>Người giao nhận hàng không</strong> (thường là đại lý hàng hoá IATA) lưu khoang, gom hàng và lập chứng từ; <strong>đại lý phục vụ mặt đất</strong> tại sân bay.</li>
</ul>
<h3>Vận đơn hàng không (AWB)</h3>
<p>AWB là <strong>biên lai nhận hàng</strong> và <strong>bằng chứng của hợp đồng</strong> vận chuyển, nhưng <strong>không chuyển nhượng được và không phải chứng từ sở hữu hàng hoá</strong>: hàng được giao cho người nhận có tên trên đó. Theo Công ước Montreal, AWB lập thành ba bản gốc — cho người chuyên chở, người nhận hàng và người gửi hàng. Người giao nhận gom hàng nhận <strong>vận đơn chủ (MAWB)</strong> của hãng hàng không và phát hành <strong>vận đơn nhà (HAWB)</strong> cho từng người gửi hàng. Phần lớn hãng hàng không nay dùng vận đơn điện tử <strong>e-AWB</strong> do IATA thúc đẩy.</p>
<h3>Trọng lượng tính cước</h3>
<p>Với hàng nhẹ, cồng kềnh, tàu bay hết chỗ trước khi hết sức nâng, nên hãng hàng không tính cước theo số lớn hơn giữa trọng lượng thực tế cả bì và <strong>trọng lượng thể tích</strong>.</p>
<pre><code>Trọng lượng thể tích (kg) = dài x rộng x cao (cm) / 6.000
   (tỷ lệ chuẩn IATA: 6.000 cm³ mỗi kg, tức 1 CBM = 166,67 kg)
Trọng lượng tính cước = số lớn hơn giữa trọng lượng thực tế cả bì và trọng lượng thể tích
Ví dụ: thùng 50 x 40 x 30 cm = 60.000 cm³  ->  60.000 / 6.000 = 10 kg
       trọng lượng thực 7 kg  ->  trọng lượng tính cước 10 kg</code></pre>
<p>Trọng lượng thường được làm tròn lên nửa kilôgam kế tiếp. Một số hãng chuyển phát nhanh dùng hệ số chia khác (như 5.000), làm trọng lượng thể tích cao hơn — luôn kiểm quy định của người chuyên chở.</p>
<h3>Cấu trúc cước hàng không</h3>
<table>
<tr><th>Loại cước</th><th>Ý nghĩa</th></tr>
<tr><td>Cước tối thiểu (M)</td><td>Số tiền thấp nhất thu cho mọi lô hàng, dù nhỏ đến đâu</td></tr>
<tr><td>Cước thông thường (N)</td><td>Cho hàng bách hoá dưới 45 kg</td></tr>
<tr><td>Cước theo số lượng (Q)</td><td>Đơn giá mỗi kg thấp hơn tại các mốc trọng lượng như 45, 100, 300, 500 và 1.000 kg</td></tr>
<tr><td>Cước hàng đặc biệt (SCR)</td><td>Mức cước thấp riêng cho mặt hàng xác định trên tuyến xác định</td></tr>
<tr><td>Cước theo nhóm hàng (class rate)</td><td>Tỷ lệ phần trăm cộng thêm hoặc giảm trừ trên cước thông thường cho hàng như động vật sống, hàng giá trị cao hay báo chí</td></tr>
</table>
<p>Vì đơn giá mỗi kg giảm ở mỗi mốc, tính cước lô hàng theo mốc kế tiếp có thể rẻ hơn tính theo trọng lượng tính cước thực — xem Bài tập 3. Báo giá thị trường ngày nay thường là trọn gói hoặc tách thành cước cộng phụ phí nhiên liệu và phụ phí an ninh.</p>
<h3>ULD, hàng nguy hiểm và an ninh</h3>
<p><strong>Thiết bị chất xếp (ULD)</strong> là các mâm (pallet) và container có hình dạng khớp với thân tàu bay — ví dụ container LD3 dùng ở tầng dưới của tàu bay thân rộng. Người giao nhận thường tự đóng ULD hàng gom. <strong>Hàng nguy hiểm</strong> (pin lithium, chất lỏng dễ cháy, một số hoá chất) phải được phân loại, đóng gói, ghi nhãn và khai báo theo Quy định Hàng nguy hiểm của IATA, dựa trên quy định của ICAO. Hàng còn phải qua <strong>kiểm soát an ninh</strong> — soi chiếu hoặc chuỗi cung ứng an toàn thông qua đại lý được chấp thuận và người gửi hàng được biết.</p>
<h3>Trách nhiệm: Công ước Montreal 1999</h3>
<ul>
<li>Người chuyên chở chịu trách nhiệm khi hàng bị huỷ hoại, mất mát hoặc hư hỏng trong quá trình vận chuyển bằng đường hàng không, với ít căn cứ miễn trách (như khuyết tật vốn có của hàng, bao bì khiếm khuyết do người khác ngoài người chuyên chở đóng, hành động chiến tranh hoặc hành vi của cơ quan công quyền), và chịu trách nhiệm về chậm trễ.</li>
<li>Trách nhiệm bị giới hạn ở một số SDR cố định mỗi kilôgam. ICAO rà soát mức này định kỳ: tại thời điểm biên soạn là khoảng <strong>26 SDR mỗi kg</strong> (ví dụ 100 kg hư hỏng → khoảng 2.600 SDR) — kiểm con số hiện hành trước khi dựa vào nó. Với hàng hoá, chỉ vượt được giới hạn khi đã kê khai giá trị đặc biệt lúc gửi hàng.</li>
<li>Khiếu nại bằng văn bản: trong 14 ngày kể từ khi nhận hàng với hư hỏng, 21 ngày với chậm trễ; quyền khởi kiện hết sau 2 năm. Một số tuyến vẫn thuộc hệ thống Vác-sa-va cũ, với quy tắc và giới hạn khác.</li>
</ul>
<div class="callout"><span class="badge">Cẩn thận</span> Đóng hàng thật gọn khi đi máy bay. Mỗi centimet trống đều bị tính tiền dưới dạng trọng lượng thể tích — chọn cỡ thùng tốt có thể giảm tiền cước hàng không nhiều hơn cả việc đàm phán giá.</div>`,
  ]]);

const c8e = doc('glt301-4-2-exercise', 'Exercise 3 — air freight: volumetric weight, chargeable weight & weight breaks|||Bài tập 3 — cước hàng không: trọng lượng thể tích, trọng lượng tính cước & mốc cước',
  'Bài tập: tính trọng lượng thể tích (6.000 cm³/kg) và trọng lượng tính cước của một lô ba thùng, tính cước theo bảng bậc cước giả định, áp dụng quy tắc mốc cước kế tiếp cho lô 88 kg, và so sánh với hệ số chia 5.000 của hãng chuyển phát; kèm lời giải.',
  [[
    `<span class="eyebrow">GLT301 · Part 4 · Exercise 3</span>
<h2>Exercise 3 — what will the airline actually charge?</h2>
<div class="callout"><span class="badge">Problem</span> A forwarder in Hanoi (a fictional case, illustrative rates) quotes this general cargo tariff to Frankfurt, in USD: minimum charge M = 75; N (under 45 kg) = 6.20 per kg; Q45 = 4.80; Q100 = 4.10; Q300 = 3.60 per kg. (a) Shipment 1 is 3 cartons, each 80 x 60 x 50 cm and 28 kg. Find the volumetric weight (divisor 6,000) and the chargeable weight. (b) Compute the freight for Shipment 1. (c) Shipment 2 is one crate, 70 x 50 x 60 cm, 88 kg. Find its chargeable weight and the cheapest correct charge, and the weight from which charging at 100 kg becomes cheaper. (d) An express carrier uses a divisor of 5,000. What would Shipment 1’s chargeable weight be?</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) Volume per carton = 80 x 60 x 50 = 240,000 cm³
    Volumetric weight  = 240,000 / 6,000 = 40 kg per carton  ->  3 x 40 = 120 kg
    Actual weight      = 3 x 28 = 84 kg
    Chargeable weight  = max(84, 120) = 120 kg     (total volume 0.72 CBM)

(b) 120 kg falls in the Q100 band: 120 x 4.10 = USD 492.00   (above the minimum of 75)

(c) Volume = 70 x 50 x 60 = 210,000 cm³  ->  210,000 / 6,000 = 35 kg
    Chargeable weight = max(88, 35) = 88 kg  (Q45 band)
    At Q45:                  88 x 4.80 = USD 422.40
    At the next break Q100: 100 x 4.10 = USD 410.00   ->  charge USD 410.00
    Break point: 100 x 4.10 / 4.80 = 85.42 kg
    From about 85.5 kg upward, charging as 100 kg at Q100 is cheaper.

(d) Divisor 5,000: 240,000 / 5,000 = 48 kg per carton  ->  3 x 48 = 144 kg</code></pre>
<p><strong>Why:</strong> Shipment 1 is light for its size (84 kg in 0.72 CBM ≈ 116.67 kg per CBM, below the 166.67 kg per CBM that the 6,000 divisor implies), so the airline charges for the space it takes. Shipment 2 shows the weight-break rule: carriers apply the rate that gives the lowest charge for the shipper, even if that means charging a higher weight at the next break. Part (d) shows why the divisor must be agreed before comparing quotes — the same cartons become 20% heavier (144 instead of 120 kg) under a 5,000 divisor.</p>`,
    `<span class="eyebrow">GLT301 · Phần 4 · Bài tập 3</span>
<h2>Bài tập 3 — hãng hàng không thực sự thu bao nhiêu?</h2>
<div class="callout"><span class="badge">Đề</span> Một người giao nhận ở Hà Nội (tình huống giả định, mức cước minh hoạ giả định) báo biểu cước hàng bách hoá đi Frankfurt, đơn vị USD: cước tối thiểu M = 75; N (dưới 45 kg) = 6,20/kg; Q45 = 4,80; Q100 = 4,10; Q300 = 3,60/kg. (a) Lô 1 gồm 3 thùng, mỗi thùng 80 x 60 x 50 cm và nặng 28 kg. Tính trọng lượng thể tích (hệ số chia 6.000) và trọng lượng tính cước. (b) Tính cước cho Lô 1. (c) Lô 2 là một kiện gỗ 70 x 50 x 60 cm, nặng 88 kg. Tính trọng lượng tính cước, mức cước đúng và rẻ nhất, và mức trọng lượng từ đó tính theo 100 kg trở nên rẻ hơn. (d) Một hãng chuyển phát dùng hệ số chia 5.000. Trọng lượng tính cước của Lô 1 khi đó là bao nhiêu?</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) Thể tích mỗi thùng = 80 x 60 x 50 = 240.000 cm³
    Trọng lượng thể tích = 240.000 / 6.000 = 40 kg mỗi thùng  ->  3 x 40 = 120 kg
    Trọng lượng thực tế  = 3 x 28 = 84 kg
    Trọng lượng tính cước = max(84; 120) = 120 kg     (tổng thể tích 0,72 CBM)

(b) 120 kg thuộc bậc Q100: 120 x 4,10 = 492,00 USD   (cao hơn mức tối thiểu 75)

(c) Thể tích = 70 x 50 x 60 = 210.000 cm³  ->  210.000 / 6.000 = 35 kg
    Trọng lượng tính cước = max(88; 35) = 88 kg  (bậc Q45)
    Theo Q45:              88 x 4,80 = 422,40 USD
    Theo mốc kế tiếp Q100: 100 x 4,10 = 410,00 USD   ->  thu 410,00 USD
    Điểm chuyển mốc: 100 x 4,10 / 4,80 = 85,42 kg
    Từ khoảng 85,5 kg trở lên, tính như 100 kg theo Q100 rẻ hơn.

(d) Hệ số chia 5.000: 240.000 / 5.000 = 48 kg mỗi thùng  ->  3 x 48 = 144 kg</code></pre>
<p><strong>Vì sao:</strong> Lô 1 nhẹ so với kích thước (84 kg trong 0,72 CBM ≈ 116,67 kg mỗi CBM, dưới ngưỡng 166,67 kg mỗi CBM mà hệ số chia 6.000 ngầm định), nên hãng hàng không thu tiền theo chỗ nó chiếm. Lô 2 minh hoạ quy tắc mốc cước: người chuyên chở áp mức cước cho ra số tiền thấp nhất cho người gửi, kể cả khi phải tính theo trọng lượng cao hơn ở mốc kế tiếp. Câu (d) cho thấy vì sao phải thống nhất hệ số chia trước khi so sánh báo giá — cùng các thùng đó nặng thêm 20% (144 thay vì 120 kg) với hệ số chia 5.000.</p>`,
  ]]);

const c9 = doc('glt301-4-3-road-rail-multimodal', '4.3 — Road, rail & multimodal transport; forwarders and NVOCCs|||4.3 — Vận tải đường bộ, đường sắt & đa phương thức; người giao nhận và NVOCC',
  'Vận tải đường bộ quốc tế (FTL, LTL, Công ước CMR), đường sắt quốc tế (CIM, SMGS, tàu hàng Trung Quốc – châu Âu, kết nối Việt Nam – Trung Quốc), vận tải đa phương thức và người kinh doanh vận tải đa phương thức (MTO), chế độ trách nhiệm mạng lưới và thống nhất, chứng từ FBL; phân biệt người giao nhận với NVOCC.',
  [[
    `<span class="eyebrow">GLT301 · Part 4 · Lesson 4.3</span>
<h2>Road, rail &amp; multimodal transport; forwarders and NVOCCs</h2>
<h3>International road transport</h3>
<p>Road carries the first and last mile of almost every international chain and whole international journeys within a continent. Shipments move as <strong>FTL</strong> (full truckload) or <strong>LTL</strong> (less than truckload, grouped with other cargo). Key issues are border waiting times, transit permits, driver hours and cargo security. In Europe and many other countries, international road carriage is governed by the <strong>CMR Convention</strong>, with a CMR consignment note and a carrier liability limit expressed per kilogram (commonly cited as 8.33 SDR per kg gross weight — check the convention text). For Vietnam, cross-border trucking to China and to neighbouring ASEAN countries matters most, especially for fresh produce and components.</p>
<h3>International rail transport</h3>
<p>Rail moves heavy and containerised cargo over long land distances at lower cost and emissions than road. Rules differ by region: the <strong>CIM</strong> rules (under COTIF) in Europe and neighbouring countries, and the <strong>SMGS</strong> agreement used on many Eurasian routes; a change of rail gauge or legal regime at a border means extra handling or paperwork. Container block trains between China and Europe offer a middle option between sea (cheaper, slower) and air (faster, dearer). Vietnam has rail links to China through northern border crossings such as Lào Cai and Đồng Đăng.</p>
<h3>Multimodal transport and the MTO</h3>
<p><strong>Multimodal transport</strong> is carriage by at least two different modes under <strong>one contract</strong>, with <strong>one operator</strong> — the <strong>multimodal transport operator (MTO)</strong> — responsible for the whole journey, from taking charge of the goods to delivering them. The MTO may own no vehicles at all and subcontract every leg, but the shipper deals with one party and one document.</p>
<ul>
<li><strong>Documents:</strong> a multimodal or combined-transport bill of lading, such as the FIATA Multimodal Transport Bill of Lading (FBL); many are negotiable like an ocean B/L.</li>
<li><strong>Legal framework:</strong> the 1980 UN Convention on International Multimodal Transport of Goods has not entered into force, so most contracts incorporate contractual rules such as the UNCTAD/ICC Rules for Multimodal Transport Documents (1992). National laws may also apply — in Vietnam, businesses offering international multimodal transport must meet licensing conditions; check the regulation currently in force.</li>
<li><strong>Liability systems:</strong> under a <strong>network system</strong>, the MTO’s liability follows the rules of the mode on which the loss occurred (sea rules at sea, road rules on the road); under a <strong>uniform system</strong>, one set of rules applies whatever the mode. Most practice uses a modified network system, with a fallback limit when the stage of loss is unknown — as with concealed damage found only when the container is opened.</li>
</ul>
<h3>Freight forwarder vs NVOCC</h3>
<table>
<tr><th></th><th>Freight forwarder (as agent)</th><th>NVOCC / forwarder acting as principal</th></tr>
<tr><td>Role</td><td>Arranges transport on the shipper’s behalf: booking, documents, customs, insurance, warehousing</td><td>Contracts with the shipper as a carrier, then buys space from shipping lines</td></tr>
<tr><td>Document</td><td>Books on the carrier’s B/L or passes on the carrier’s document; may issue a forwarder’s certificate of receipt</td><td>Issues its own house B/L; receives the master B/L from the line</td></tr>
<tr><td>Liability</td><td>Liable mainly for its own negligence in arranging</td><td>Liable as carrier for the whole carriage covered by its B/L</td></tr>
<tr><td>Income</td><td>Service fees and commissions</td><td>Margin between its freight rate and what it pays the line</td></tr>
</table>
<p>In practice many firms act in both capacities, so the documents and trading conditions — for example those based on the FIATA model rules — decide the role in each shipment. Beyond forwarding, <strong>third-party logistics (3PL)</strong> providers take over wider functions such as warehousing and distribution.</p>
<div class="callout"><span class="badge">Key question</span> When something goes wrong, ask "Who issued the transport document, and in what capacity?" The answer tells you who is liable, under which rules, and within what time limit.</div>`,
    `<span class="eyebrow">GLT301 · Phần 4 · Bài 4.3</span>
<h2>Vận tải đường bộ, đường sắt &amp; đa phương thức; người giao nhận và NVOCC</h2>
<h3>Vận tải đường bộ quốc tế</h3>
<p>Đường bộ đảm nhận chặng đầu và chặng cuối của hầu hết chuỗi vận tải quốc tế, và cả những hành trình quốc tế trọn vẹn trong một châu lục. Hàng đi theo <strong>FTL</strong> (nguyên xe) hoặc <strong>LTL</strong> (hàng ghép xe, chung với hàng khác). Vấn đề chính là thời gian chờ ở cửa khẩu, giấy phép quá cảnh, giờ lái xe và an ninh hàng hoá. Ở châu Âu và nhiều nước khác, vận tải đường bộ quốc tế chịu sự điều chỉnh của <strong>Công ước CMR</strong>, với giấy gửi hàng CMR và giới hạn trách nhiệm của người chuyên chở tính theo kilôgam (thường được trích dẫn là 8,33 SDR mỗi kg trọng lượng cả bì — kiểm văn bản công ước). Với Việt Nam, vận tải xe tải qua biên giới sang Trung Quốc và các nước ASEAN láng giềng là quan trọng nhất, đặc biệt với nông sản tươi và linh kiện.</p>
<h3>Vận tải đường sắt quốc tế</h3>
<p>Đường sắt chở hàng nặng và hàng container trên quãng đường đất liền dài với chi phí và phát thải thấp hơn đường bộ. Quy tắc khác nhau theo khu vực: quy tắc <strong>CIM</strong> (thuộc COTIF) ở châu Âu và các nước lân cận, và hiệp định <strong>SMGS</strong> được dùng trên nhiều tuyến Á – Âu; thay đổi khổ đường ray hay chế độ pháp lý ở biên giới đồng nghĩa với thêm công đoạn làm hàng hoặc giấy tờ. Tàu container chạy suốt giữa Trung Quốc và châu Âu là phương án ở giữa đường biển (rẻ hơn, chậm hơn) và hàng không (nhanh hơn, đắt hơn). Việt Nam có kết nối đường sắt với Trung Quốc qua các cửa khẩu phía Bắc như Lào Cai và Đồng Đăng.</p>
<h3>Vận tải đa phương thức và MTO</h3>
<p><strong>Vận tải đa phương thức</strong> là việc chuyên chở bằng ít nhất hai phương thức khác nhau theo <strong>một hợp đồng</strong>, với <strong>một người</strong> — <strong>người kinh doanh vận tải đa phương thức (MTO)</strong> — chịu trách nhiệm toàn bộ hành trình, từ khi nhận hàng tới khi giao hàng. MTO có thể không sở hữu phương tiện nào và thuê lại mọi chặng, nhưng người gửi hàng chỉ làm việc với một bên và một chứng từ.</p>
<ul>
<li><strong>Chứng từ:</strong> vận đơn đa phương thức hoặc vận đơn vận tải kết hợp, như Vận đơn vận tải đa phương thức của FIATA (FBL); nhiều loại chuyển nhượng được như vận đơn đường biển.</li>
<li><strong>Khung pháp lý:</strong> Công ước Liên Hợp Quốc về vận tải đa phương thức quốc tế năm 1980 chưa có hiệu lực, nên phần lớn hợp đồng dẫn chiếu các quy tắc mang tính hợp đồng như Quy tắc UNCTAD/ICC về chứng từ vận tải đa phương thức (1992). Luật quốc gia cũng có thể áp dụng — ở Việt Nam, doanh nghiệp kinh doanh vận tải đa phương thức quốc tế phải đáp ứng điều kiện cấp phép; hãy kiểm văn bản đang có hiệu lực.</li>
<li><strong>Chế độ trách nhiệm:</strong> theo <strong>chế độ mạng lưới</strong>, trách nhiệm của MTO theo quy tắc của phương thức nơi xảy ra tổn thất (quy tắc đường biển trên biển, quy tắc đường bộ trên đường bộ); theo <strong>chế độ thống nhất</strong>, một bộ quy tắc áp dụng cho mọi phương thức. Thực tế phần lớn dùng chế độ mạng lưới có điều chỉnh, với một mức giới hạn dự phòng khi không xác định được chặng xảy ra tổn thất — như hư hỏng ẩn chỉ phát hiện khi mở container.</li>
</ul>
<h3>Người giao nhận và NVOCC</h3>
<table>
<tr><th></th><th>Người giao nhận (với tư cách đại lý)</th><th>NVOCC / người giao nhận với tư cách người chuyên chở (principal)</th></tr>
<tr><td>Vai trò</td><td>Thay mặt người gửi hàng thu xếp vận chuyển: lưu khoang, chứng từ, hải quan, bảo hiểm, kho bãi</td><td>Ký hợp đồng với người gửi hàng với tư cách người chuyên chở, rồi mua chỗ của hãng tàu</td></tr>
<tr><td>Chứng từ</td><td>Lưu khoang theo vận đơn của hãng tàu hoặc chuyển chứng từ của người chuyên chở; có thể cấp giấy chứng nhận nhận hàng của người giao nhận</td><td>Phát hành vận đơn nhà của mình; nhận vận đơn chủ từ hãng tàu</td></tr>
<tr><td>Trách nhiệm</td><td>Chủ yếu chịu trách nhiệm về sơ suất của chính mình khi thu xếp</td><td>Chịu trách nhiệm như người chuyên chở cho toàn bộ hành trình ghi trên vận đơn của mình</td></tr>
<tr><td>Thu nhập</td><td>Phí dịch vụ và hoa hồng</td><td>Chênh lệch giữa cước mình thu và cước trả hãng tàu</td></tr>
</table>
<p>Trên thực tế nhiều công ty hoạt động với cả hai tư cách, nên chứng từ và điều kiện kinh doanh — ví dụ dựa trên quy tắc mẫu của FIATA — quyết định vai trò trong từng lô hàng. Rộng hơn giao nhận, các nhà cung cấp <strong>logistics bên thứ ba (3PL)</strong> đảm nhận thêm các chức năng như kho bãi và phân phối.</p>
<div class="callout"><span class="badge">Câu hỏi then chốt</span> Khi có sự cố, hãy hỏi "Ai phát hành chứng từ vận tải, và với tư cách gì?" Câu trả lời cho biết ai chịu trách nhiệm, theo quy tắc nào, và trong thời hạn bao lâu.</div>`,
  ]]);

const c9q = quiz('glt301-quiz-4', 'Quiz 4 — Air, road, rail & multimodal|||Quiz 4 — Hàng không, đường bộ, đường sắt & đa phương thức', [
  { id: 'q1', question: 'A box measures 60 x 50 x 40 cm and weighs 15 kg. Using the IATA divisor of 6,000, what is its chargeable weight?|||Một thùng kích thước 60 x 50 x 40 cm, nặng 15 kg. Dùng hệ số chia 6.000 của IATA, trọng lượng tính cước là bao nhiêu?', options: ['15 kg|||15 kg', '24 kg|||24 kg', '120 kg|||120 kg', '20 kg|||20 kg'], correctIndex: 3, explanation: '60 x 50 x 40 = 120,000 cm³; 120,000 / 6,000 = 20 kg, which is greater than 15 kg. 24 kg would use a 5,000 divisor.|||60 x 50 x 40 = 120.000 cm³; 120.000 / 6.000 = 20 kg, lớn hơn 15 kg. Con số 24 kg là dùng hệ số chia 5.000.' },
  { id: 'q2', question: 'Which statement best describes an NVOCC?|||Nhận định nào mô tả đúng nhất một NVOCC?', options: ['A forwarder that acts only as agent and never accepts carrier liability|||Người giao nhận chỉ làm đại lý và không bao giờ nhận trách nhiệm người chuyên chở', 'A company that issues its own bill of lading as carrier without operating the ships|||Công ty phát hành vận đơn của chính mình với tư cách người chuyên chở mà không khai thác tàu', 'A port authority that allocates berths|||Cơ quan cảng vụ phân bổ cầu bến', 'A shipowner operating its own liner vessels|||Chủ tàu khai thác tàu chợ của chính mình'], correctIndex: 1, explanation: 'An NVOCC contracts as carrier (house B/L) and buys space from shipping lines (master B/L).|||NVOCC ký hợp đồng với tư cách người chuyên chở (vận đơn nhà) và mua chỗ của hãng tàu (vận đơn chủ).' },
  { id: 'q3', question: 'Under the network liability system in multimodal transport, the MTO’s liability is determined by…|||Theo chế độ trách nhiệm mạng lưới trong vận tải đa phương thức, trách nhiệm của MTO được xác định bởi…', options: ['the rules of the mode on which the loss occurred|||quy tắc của phương thức nơi xảy ra tổn thất', 'one uniform set of rules for every mode|||một bộ quy tắc thống nhất cho mọi phương thức', 'the law of the MTO’s home country only|||chỉ luật của nước nơi MTO đặt trụ sở', 'the Incoterms rule in the sales contract|||điều kiện Incoterms trong hợp đồng mua bán'], correctIndex: 0, explanation: 'A network system applies the regime of the stage where the loss happened; a uniform system applies one regime throughout. Incoterms do not govern carrier liability.|||Chế độ mạng lưới áp dụng quy tắc của chặng xảy ra tổn thất; chế độ thống nhất áp dụng một quy tắc suốt hành trình. Incoterms không điều chỉnh trách nhiệm của người chuyên chở.' },
]);

const c10 = doc('glt301-5-1-incoterms-transport', '5.1 — Incoterms 2020 and the transport chain|||5.1 — Incoterms 2020 và chuỗi vận tải',
  'Incoterms là gì và không là gì, 11 điều kiện chia hai nhóm, điểm chuyển giao rủi ro và chi phí của từng điều kiện (tóm tắt, không chép văn bản ICC), điều kiện nhóm C có hai điểm tới hạn, vì sao hàng container nên dùng FCA/CPT/CIP thay cho FOB/CFR/CIF, các thay đổi chính của bản 2020 và ví dụ cấu thành giá EXW – FOB – CFR – CIF.',
  [[
    `<span class="eyebrow">GLT301 · Part 5 · Lesson 5.1</span>
<h2>Incoterms 2020 and the transport chain</h2>
<p class="lead">Incoterms® rules, published by the International Chamber of Commerce (ICC), are three-letter trade terms that tell buyer and seller who arranges and pays for transport, where the goods are delivered and where risk passes. This lesson summarises them from a transport manager’s point of view; for the full wording, use the official ICC publication.</p>
<h3>What Incoterms do — and do not — cover</h3>
<ul>
<li><strong>They cover:</strong> the delivery point, the transfer of risk, the allocation of costs, who arranges carriage and insurance, export and import clearance, and the documents each side provides.</li>
<li><strong>They do not cover:</strong> transfer of ownership (title), the price or how it is paid, remedies for breach, or the contract of carriage itself — a carrier is not bound by the sales contract’s Incoterms rule.</li>
<li>They apply only if the contract incorporates them, ideally as "rule + named place + Incoterms® 2020", e.g. "FCA Binh Duong ICD, Incoterms® 2020".</li>
</ul>
<h3>The 11 rules and where risk passes (summary)</h3>
<table>
<tr><th>Rule</th><th>Delivery and risk transfer (in short)</th><th>Main carriage paid by</th><th>Insurance</th></tr>
<tr><td colspan="4"><strong>Any mode of transport</strong></td></tr>
<tr><td>EXW Ex Works</td><td>Goods placed at the buyer’s disposal at the seller’s premises, not loaded, not cleared for export</td><td>Buyer</td><td>No obligation</td></tr>
<tr><td>FCA Free Carrier</td><td>Handed to the carrier nominated by the buyer at the named place (loaded if at the seller’s premises)</td><td>Buyer</td><td>No obligation</td></tr>
<tr><td>CPT Carriage Paid To</td><td>Handed to the first carrier; seller pays carriage to the named destination</td><td>Seller</td><td>No obligation</td></tr>
<tr><td>CIP Carriage and Insurance Paid To</td><td>As CPT; seller also insures the goods</td><td>Seller</td><td>Seller, high cover (Institute Cargo Clauses (A) or similar) unless agreed otherwise</td></tr>
<tr><td>DAP Delivered at Place</td><td>At the named destination, on the arriving vehicle, ready for unloading</td><td>Seller</td><td>No obligation (seller carries the risk)</td></tr>
<tr><td>DPU Delivered at Place Unloaded</td><td>Unloaded at the named destination</td><td>Seller</td><td>No obligation (seller carries the risk)</td></tr>
<tr><td>DDP Delivered Duty Paid</td><td>At the destination, cleared for import with duties paid, ready for unloading</td><td>Seller</td><td>No obligation (seller carries the risk)</td></tr>
<tr><td colspan="4"><strong>Sea and inland waterway only</strong></td></tr>
<tr><td>FAS Free Alongside Ship</td><td>Alongside the vessel at the named port of shipment</td><td>Buyer</td><td>No obligation</td></tr>
<tr><td>FOB Free On Board</td><td>On board the vessel at the named port of shipment</td><td>Buyer</td><td>No obligation</td></tr>
<tr><td>CFR Cost and Freight</td><td>On board at the port of shipment; seller pays freight to the named port of destination</td><td>Seller</td><td>No obligation</td></tr>
<tr><td>CIF Cost, Insurance and Freight</td><td>As CFR; seller also insures</td><td>Seller</td><td>Seller, minimum cover (Institute Cargo Clauses (C) or similar) unless agreed otherwise</td></tr>
</table>
<p>The seller clears the goods for export under every rule except EXW; the buyer clears them for import under every rule except DDP.</p>
<h3>Three transport lessons hidden in the table</h3>
<ol>
<li><strong>C rules have two critical points.</strong> Under CPT, CIP, CFR and CIF, risk passes at shipment but the seller pays freight to destination. A CIF seller has completed delivery — and risk has passed to the buyer — once the goods are on board, although it must still tender the transport and insurance documents. Even if the ship sinks the next day, the buyer bears that loss (and claims on the insurance).</li>
<li><strong>Containers belong with FCA, CPT and CIP.</strong> Container cargo is handed to the carrier at an inland depot or terminal days before loading. Under FOB, CFR or CIF, the seller would still carry the risk while the box sits in a yard it no longer controls. ICC therefore recommends FCA, CPT and CIP for containerised goods and keeps FAS, FOB, CFR and CIF for goods actually loaded on board — typically bulk.</li>
<li><strong>The Incoterms rule must match the transport contract.</strong> Under FOB the buyer books the ship; under CIF the seller does. Freight terms on the B/L ("freight prepaid" or "freight collect") should be consistent with the rule.</li>
</ol>
<h3>Main changes in the 2020 edition</h3>
<p>DAT was renamed <strong>DPU</strong> and can be any place, not only a terminal · <strong>CIP</strong> now requires higher insurance cover, while CIF stays at minimum cover · under <strong>FCA</strong> the parties may agree that the buyer’s carrier issues an on-board B/L to the seller (useful for documentary credits) · the parties may use their <strong>own means of transport</strong> under FCA, DAP, DPU and DDP · clearer allocation of <strong>security-related</strong> costs.</p>
<h3>Worked illustration: building an export price</h3>
<pre><code>Illustrative figures, USD
EXW price                                           100,000.00
+ inland haulage and export clearance to the port     1,200.00
+ origin terminal handling and loading                  300.00
= FOB                                               101,500.00
+ ocean freight to destination port                   2,500.00
= CFR                                               104,000.00
Insurance: 0.2% premium on 110% of the CIF value
CIF = CFR / (1 − 1.1 x 0.002) = 104,000 / 0.9978  = 104,229.30
premium = 104,229.30 − 104,000 = 229.30   (insured sum 114,652.23)</code></pre>
<p>Which origin costs sit in the FOB price can vary with port practice — spell them out in the contract rather than assume.</p>
<div class="callout"><span class="badge">Remember</span> Incoterms® is a trademark of ICC. Quote the rule, the named place and the edition every time, and read the official ICC text before drafting a real contract — this summary does not replace it.</div>`,
    `<span class="eyebrow">GLT301 · Phần 5 · Bài 5.1</span>
<h2>Incoterms 2020 và chuỗi vận tải</h2>
<p class="lead">Quy tắc Incoterms® do Phòng Thương mại Quốc tế (ICC) ban hành là các điều kiện thương mại ba chữ cái cho người mua và người bán biết ai thu xếp và trả tiền vận tải, hàng được giao ở đâu và rủi ro chuyển giao ở đâu. Bài này tóm tắt chúng dưới góc nhìn của nhà quản trị vận tải; muốn đọc đầy đủ câu chữ, hãy dùng ấn phẩm chính thức của ICC.</p>
<h3>Incoterms điều chỉnh gì — và không điều chỉnh gì</h3>
<ul>
<li><strong>Điều chỉnh:</strong> địa điểm giao hàng, chuyển giao rủi ro, phân chia chi phí, ai thu xếp vận tải và bảo hiểm, thông quan xuất khẩu và nhập khẩu, và chứng từ mỗi bên cung cấp.</li>
<li><strong>Không điều chỉnh:</strong> chuyển giao quyền sở hữu, giá cả và cách thanh toán, chế tài khi vi phạm, hay bản thân hợp đồng vận chuyển — người chuyên chở không bị ràng buộc bởi điều kiện Incoterms trong hợp đồng mua bán.</li>
<li>Incoterms chỉ áp dụng khi hợp đồng dẫn chiếu, tốt nhất theo dạng "điều kiện + địa điểm cụ thể + Incoterms® 2020", ví dụ "FCA Binh Duong ICD, Incoterms® 2020".</li>
</ul>
<h3>11 điều kiện và nơi chuyển giao rủi ro (tóm tắt)</h3>
<table>
<tr><th>Điều kiện</th><th>Giao hàng và chuyển giao rủi ro (tóm tắt)</th><th>Ai trả cước chặng chính</th><th>Bảo hiểm</th></tr>
<tr><td colspan="4"><strong>Mọi phương thức vận tải</strong></td></tr>
<tr><td>EXW Giao tại xưởng</td><td>Hàng được đặt dưới quyền định đoạt của người mua tại cơ sở người bán, chưa bốc lên phương tiện, chưa thông quan xuất khẩu</td><td>Người mua</td><td>Không bắt buộc</td></tr>
<tr><td>FCA Giao cho người chuyên chở</td><td>Giao cho người chuyên chở do người mua chỉ định tại địa điểm quy định (đã bốc lên phương tiện nếu giao tại cơ sở người bán)</td><td>Người mua</td><td>Không bắt buộc</td></tr>
<tr><td>CPT Cước phí trả tới</td><td>Giao cho người chuyên chở đầu tiên; người bán trả cước tới nơi đến quy định</td><td>Người bán</td><td>Không bắt buộc</td></tr>
<tr><td>CIP Cước phí và bảo hiểm trả tới</td><td>Như CPT; người bán còn mua bảo hiểm cho hàng</td><td>Người bán</td><td>Người bán, mức cao (Điều kiện bảo hiểm hàng hoá (A) của Viện hoặc tương đương) trừ khi có thoả thuận khác</td></tr>
<tr><td>DAP Giao tại nơi đến</td><td>Tại nơi đến quy định, trên phương tiện chở đến, sẵn sàng để dỡ</td><td>Người bán</td><td>Không bắt buộc (người bán chịu rủi ro)</td></tr>
<tr><td>DPU Giao tại nơi đến đã dỡ xuống</td><td>Đã dỡ khỏi phương tiện tại nơi đến quy định</td><td>Người bán</td><td>Không bắt buộc (người bán chịu rủi ro)</td></tr>
<tr><td>DDP Giao hàng đã nộp thuế</td><td>Tại nơi đến, đã thông quan nhập khẩu và nộp thuế, sẵn sàng để dỡ</td><td>Người bán</td><td>Không bắt buộc (người bán chịu rủi ro)</td></tr>
<tr><td colspan="4"><strong>Chỉ đường biển và đường thuỷ nội địa</strong></td></tr>
<tr><td>FAS Giao dọc mạn tàu</td><td>Dọc mạn tàu tại cảng bốc hàng quy định</td><td>Người mua</td><td>Không bắt buộc</td></tr>
<tr><td>FOB Giao lên tàu</td><td>Hàng đã được xếp lên tàu tại cảng bốc hàng quy định</td><td>Người mua</td><td>Không bắt buộc</td></tr>
<tr><td>CFR Tiền hàng và cước phí</td><td>Trên tàu tại cảng bốc hàng; người bán trả cước tới cảng đến quy định</td><td>Người bán</td><td>Không bắt buộc</td></tr>
<tr><td>CIF Tiền hàng, bảo hiểm và cước phí</td><td>Như CFR; người bán còn mua bảo hiểm</td><td>Người bán</td><td>Người bán, mức tối thiểu (Điều kiện bảo hiểm hàng hoá (C) của Viện hoặc tương đương) trừ khi có thoả thuận khác</td></tr>
</table>
<p>Người bán làm thủ tục thông quan xuất khẩu trong mọi điều kiện trừ EXW; người mua làm thủ tục thông quan nhập khẩu trong mọi điều kiện trừ DDP.</p>
<h3>Ba bài học vận tải ẩn trong bảng</h3>
<ol>
<li><strong>Nhóm C có hai điểm tới hạn.</strong> Với CPT, CIP, CFR và CIF, rủi ro chuyển giao tại nơi gửi hàng nhưng người bán trả cước tới nơi đến. Người bán CIF đã hoàn thành nghĩa vụ giao hàng — và rủi ro đã chuyển sang người mua — khi hàng đã lên tàu, dù vẫn phải chuyển giao chứng từ vận tải và chứng từ bảo hiểm. Kể cả nếu tàu chìm ngày hôm sau, người mua chịu tổn thất đó (và đòi bồi thường từ bảo hiểm).</li>
<li><strong>Hàng container nên dùng FCA, CPT và CIP.</strong> Hàng container được giao cho người chuyên chở tại cảng cạn hoặc bãi cảng vài ngày trước khi xếp lên tàu. Với FOB, CFR hay CIF, người bán vẫn chịu rủi ro trong khi container nằm ở bãi mà mình không còn kiểm soát. Vì vậy ICC khuyến nghị dùng FCA, CPT và CIP cho hàng container và giữ FAS, FOB, CFR và CIF cho hàng thực sự được xếp lên tàu — thường là hàng rời.</li>
<li><strong>Điều kiện Incoterms phải khớp với hợp đồng vận tải.</strong> Với FOB người mua thuê tàu; với CIF người bán thuê tàu. Ghi chú cước trên vận đơn ("cước trả trước" hay "cước trả sau") phải nhất quán với điều kiện đã chọn.</li>
</ol>
<h3>Những thay đổi chính của bản 2020</h3>
<p>DAT được đổi thành <strong>DPU</strong> và có thể là bất kỳ địa điểm nào, không chỉ là bến bãi · <strong>CIP</strong> nay đòi hỏi mức bảo hiểm cao hơn, còn CIF giữ mức tối thiểu · với <strong>FCA</strong> các bên có thể thoả thuận để người chuyên chở của người mua cấp vận đơn đã xếp hàng cho người bán (hữu ích cho tín dụng chứng từ) · các bên được dùng <strong>phương tiện vận tải của chính mình</strong> trong FCA, DAP, DPU và DDP · phân chia rõ hơn các chi phí liên quan tới <strong>an ninh</strong>.</p>
<h3>Minh hoạ: cấu thành giá xuất khẩu</h3>
<pre><code>Số liệu minh hoạ, USD
Giá EXW                                             100.000,00
+ vận chuyển nội địa và thông quan xuất khẩu ra cảng   1.200,00
+ phí làm hàng tại cảng đi và xếp hàng                   300,00
= FOB                                               101.500,00
+ cước biển tới cảng đến                               2.500,00
= CFR                                               104.000,00
Bảo hiểm: phí 0,2% trên 110% giá trị CIF
CIF = CFR / (1 − 1,1 x 0,002) = 104.000 / 0,9978  = 104.229,30
phí bảo hiểm = 104.229,30 − 104.000 = 229,30   (số tiền bảo hiểm 114.652,23)</code></pre>
<p>Những chi phí nào ở đầu xuất nằm trong giá FOB có thể khác nhau theo tập quán từng cảng — hãy ghi rõ trong hợp đồng thay vì mặc định.</p>
<div class="callout"><span class="badge">Ghi nhớ</span> Incoterms® là nhãn hiệu của ICC. Mỗi lần dùng hãy ghi đủ điều kiện, địa điểm cụ thể và phiên bản, và đọc văn bản chính thức của ICC trước khi soạn một hợp đồng thật — bản tóm tắt này không thay thế được văn bản đó.</div>`,
  ]]);

const c11 = doc('glt301-5-2-cargo-insurance', '5.2 — Cargo insurance: Institute Cargo Clauses A, B & C|||5.2 — Bảo hiểm hàng hoá: Điều kiện bảo hiểm A, B & C của Viện',
  'Vì sao phải bảo hiểm hàng hoá khi người chuyên chở đã có trách nhiệm, đơn bảo hiểm chuyến và hợp đồng bảo hiểm bao, so sánh định tính ba điều kiện (A), (B), (C) của Viện, các loại trừ chung, bảo hiểm chiến tranh và đình công, giá trị bảo hiểm 110% và phí bảo hiểm, tổn thất toàn bộ, tổn thất riêng và tổn thất chung có ví dụ số, quy trình khiếu nại.',
  [[
    `<span class="eyebrow">GLT301 · Part 5 · Lesson 5.2</span>
<h2>Cargo insurance: Institute Cargo Clauses A, B &amp; C</h2>
<p class="lead">Carriers are liable only within limits, with defences and short time bars (Parts 3 and 4). Cargo insurance fills the gap: the cargo owner is paid by its own insurer, and the insurer then pursues the carrier.</p>
<h3>How cargo is insured</h3>
<ul>
<li>A <strong>single (voyage) policy</strong> covers one shipment; an <strong>open cover</strong> automatically covers all shipments of a trader over a period, declared one by one, often evidenced by an <strong>insurance certificate</strong> that can be transferred with the goods.</li>
<li>The insured must have an <strong>insurable interest</strong> — it stands to lose if the goods are lost. Under the Incoterms rule, this is the party bearing the risk at the time of loss.</li>
<li>The usual <strong>insured value</strong> is the CIF value plus 10% (to cover expected profit and extra costs) — the minimum under CIF and CIP.</li>
</ul>
<h3>The Institute Cargo Clauses (qualitative comparison)</h3>
<p>The Institute Cargo Clauses, used in the London market and widely around the world (current standard wording dated 2009), come in three levels:</p>
<table>
<tr><th>Clauses</th><th>Type of cover</th><th>Main risks covered (summary)</th></tr>
<tr><td>(C)</td><td>Named perils, narrowest</td><td>Fire or explosion; vessel stranded, grounded, sunk or capsized; overturning or derailment of a land conveyance; collision; discharge at a port of distress; general average sacrifice; jettison; plus general average and salvage charges</td></tr>
<tr><td>(B)</td><td>Named perils, wider</td><td>Everything in (C), plus earthquake, volcanic eruption, lightning; washing overboard; entry of sea, lake or river water into the vessel, container or place of storage; total loss of a package lost overboard or dropped while loading or unloading</td></tr>
<tr><td>(A)</td><td>"All risks" subject to exclusions</td><td>Any loss or damage not specifically excluded — including theft, pilferage and malicious damage, which (B) and (C) do not cover</td></tr>
</table>
<p><strong>Excluded under all three</strong> (in summary): wilful misconduct of the insured; ordinary leakage, loss of weight or wear and tear; insufficient or unsuitable packing; inherent vice (the nature of the goods, such as fruit ripening); delay; insolvency of the carrier in certain cases; and war and strikes risks, which are covered separately by the <strong>Institute War Clauses (Cargo)</strong> and <strong>Institute Strikes Clauses (Cargo)</strong>. Always read the actual policy wording — local insurers, including in Vietnam, often use conditions modelled on the Institute clauses with their own variations.</p>
<h3>Premium example (illustrative rates)</h3>
<pre><code>CIF value USD 50,000   ->  insured value 50,000 x 110% = 55,000
Premium under (A) at 0.15% = 55,000 x 0.0015 = USD 82.50
Premium under (C) at 0.08% = 55,000 x 0.0008 = USD 44.00</code></pre>
<p>The cheaper (C) cover saves USD 38.50 but leaves theft, water damage from rain and handling damage uninsured — often the most frequent losses for containerised consumer goods.</p>
<h3>Types of loss</h3>
<ul>
<li><strong>Total loss</strong>: actual (the goods are destroyed or irretrievably lost) or constructive (saving and forwarding them would cost more than their value on arrival).</li>
<li><strong>Particular average</strong>: a partial loss that falls on one interest only, such as wet cartons.</li>
<li><strong>General average (GA)</strong>: an extraordinary sacrifice or expense made intentionally for the common safety of ship and cargo (for example jettisoning cargo or paying for salvage). All interests share it in proportion to their saved values, under the York-Antwerp Rules. Cargo owners must give GA security before their goods are released — insurance normally covers the contribution.</li>
</ul>
<pre><code>Simplified GA example (illustrative)
GA sacrifice and expenses: 300,000
Contributory values: ship 8,000,000 + cargo 12,000,000 = 20,000,000
Contribution rate = 300,000 / 20,000,000 = 1.5%
A cargo owner with goods worth 400,000 contributes 400,000 x 1.5% = 6,000</code></pre>
<h3>Making a claim</h3>
<ol>
<li>Notify the insurer or its agent immediately and arrange a survey.</li>
<li>Note the damage on the delivery receipt and send a written notice of claim to the carrier within the time limit — this protects the insurer’s right of recovery (subrogation).</li>
<li>Submit the documents: policy or certificate, commercial invoice, packing list, B/L or AWB, survey report, correspondence with the carrier.</li>
</ol>
<div class="callout"><span class="badge">Key idea</span> Choose the cover by asking "what usually goes wrong with this cargo on this route?" For most manufactured goods in containers, the answer points to (A).</div>`,
    `<span class="eyebrow">GLT301 · Phần 5 · Bài 5.2</span>
<h2>Bảo hiểm hàng hoá: Điều kiện bảo hiểm A, B &amp; C của Viện</h2>
<p class="lead">Người chuyên chở chỉ chịu trách nhiệm trong giới hạn, có các căn cứ miễn trách và thời hiệu ngắn (Phần 3 và 4). Bảo hiểm hàng hoá lấp khoảng trống đó: chủ hàng được chính người bảo hiểm của mình bồi thường, rồi người bảo hiểm đòi lại người chuyên chở.</p>
<h3>Hàng hoá được bảo hiểm thế nào</h3>
<ul>
<li><strong>Đơn bảo hiểm chuyến</strong> bảo hiểm cho một lô hàng; <strong>hợp đồng bảo hiểm bao (open cover)</strong> tự động bảo hiểm mọi lô hàng của một nhà buôn trong một thời kỳ, khai báo từng lô, thường được thể hiện bằng <strong>giấy chứng nhận bảo hiểm</strong> có thể chuyển nhượng cùng hàng hoá.</li>
<li>Người được bảo hiểm phải có <strong>quyền lợi có thể được bảo hiểm</strong> — họ bị thiệt nếu hàng mất. Theo điều kiện Incoterms, đó là bên đang chịu rủi ro tại thời điểm xảy ra tổn thất.</li>
<li><strong>Giá trị bảo hiểm</strong> thông thường là giá CIF cộng 10% (để bù lãi dự tính và chi phí phát sinh) — mức tối thiểu theo CIF và CIP.</li>
</ul>
<h3>Điều kiện bảo hiểm hàng hoá của Viện (so sánh định tính)</h3>
<p>Điều kiện bảo hiểm hàng hoá của Viện (Institute Cargo Clauses), dùng trên thị trường London và phổ biến khắp thế giới (bản câu chữ chuẩn hiện hành đề năm 2009), có ba mức:</p>
<table>
<tr><th>Điều kiện</th><th>Kiểu bảo hiểm</th><th>Rủi ro chính được bảo hiểm (tóm tắt)</th></tr>
<tr><td>(C)</td><td>Rủi ro được liệt kê, hẹp nhất</td><td>Cháy hoặc nổ; tàu mắc cạn, chạm đáy, chìm hoặc lật; phương tiện vận tải trên bộ bị lật hoặc trật bánh; đâm va; dỡ hàng tại cảng lánh nạn; hy sinh tổn thất chung; ném hàng xuống biển; cùng chi phí tổn thất chung và cứu hộ</td></tr>
<tr><td>(B)</td><td>Rủi ro được liệt kê, rộng hơn</td><td>Mọi rủi ro của (C), thêm động đất, núi lửa phun, sét đánh; nước cuốn khỏi tàu; nước biển, nước hồ hoặc nước sông tràn vào tàu, container hoặc nơi chứa hàng; tổn thất toàn bộ của kiện hàng rơi khỏi tàu hoặc rơi khi đang xếp, dỡ</td></tr>
<tr><td>(A)</td><td>"Mọi rủi ro" trừ các loại trừ</td><td>Mọi mất mát, hư hỏng không bị loại trừ cụ thể — kể cả trộm cắp, mất cắp vặt và phá hoại có chủ ý, những thứ (B) và (C) không bảo hiểm</td></tr>
</table>
<p><strong>Bị loại trừ ở cả ba điều kiện</strong> (tóm tắt): hành vi cố ý của người được bảo hiểm; rò chảy, hao hụt trọng lượng thông thường hay hao mòn tự nhiên; bao bì không đủ hoặc không phù hợp; nội tỳ (bản chất của hàng, như trái cây tự chín); chậm trễ; người chuyên chở mất khả năng thanh toán trong một số trường hợp; và rủi ro chiến tranh, đình công — được bảo hiểm riêng bằng <strong>Điều kiện bảo hiểm chiến tranh (hàng hoá) của Viện</strong> và <strong>Điều kiện bảo hiểm đình công (hàng hoá) của Viện</strong>. Luôn đọc câu chữ thực tế của đơn bảo hiểm — các nhà bảo hiểm trong nước, kể cả ở Việt Nam, thường dùng điều kiện xây dựng theo mô hình của Viện với những khác biệt riêng.</p>
<h3>Ví dụ phí bảo hiểm (tỷ lệ minh hoạ)</h3>
<pre><code>Giá trị CIF 50.000 USD   ->  giá trị bảo hiểm 50.000 x 110% = 55.000
Phí theo (A), tỷ lệ 0,15% = 55.000 x 0,0015 = 82,50 USD
Phí theo (C), tỷ lệ 0,08% = 55.000 x 0,0008 = 44,00 USD</code></pre>
<p>Điều kiện (C) rẻ hơn tiết kiệm 38,50 USD nhưng để trống trộm cắp, hư hỏng do nước mưa và hư hỏng khi làm hàng — thường là những tổn thất hay gặp nhất với hàng tiêu dùng đóng container.</p>
<h3>Các loại tổn thất</h3>
<ul>
<li><strong>Tổn thất toàn bộ</strong>: thực tế (hàng bị huỷ hoại hoặc mất hẳn) hoặc ước tính (chi phí cứu và đưa hàng tới nơi lớn hơn giá trị của hàng khi tới nơi).</li>
<li><strong>Tổn thất riêng</strong>: tổn thất bộ phận chỉ rơi vào một quyền lợi, như các thùng hàng bị ướt.</li>
<li><strong>Tổn thất chung (GA)</strong>: một sự hy sinh hoặc chi phí bất thường được thực hiện có chủ ý vì an toàn chung của tàu và hàng (ví dụ ném hàng xuống biển hoặc trả tiền cứu hộ). Mọi quyền lợi cùng gánh chịu theo tỷ lệ giá trị được cứu, theo Quy tắc York-Antwerp. Chủ hàng phải ký quỹ hoặc bảo lãnh tổn thất chung trước khi được nhận hàng — bảo hiểm thường chi trả phần đóng góp này.</li>
</ul>
<pre><code>Ví dụ tổn thất chung đơn giản hoá (minh hoạ)
Hy sinh và chi phí tổn thất chung: 300.000
Giá trị chịu phân bổ: tàu 8.000.000 + hàng 12.000.000 = 20.000.000
Tỷ lệ đóng góp = 300.000 / 20.000.000 = 1,5%
Chủ hàng có lô hàng trị giá 400.000 đóng góp 400.000 x 1,5% = 6.000</code></pre>
<h3>Làm hồ sơ khiếu nại</h3>
<ol>
<li>Thông báo ngay cho người bảo hiểm hoặc đại lý của họ và yêu cầu giám định.</li>
<li>Ghi nhận hư hỏng trên biên bản giao nhận và gửi thông báo khiếu nại bằng văn bản cho người chuyên chở trong thời hạn — việc này bảo vệ quyền đòi bồi hoàn (thế quyền) của người bảo hiểm.</li>
<li>Nộp chứng từ: đơn hoặc giấy chứng nhận bảo hiểm, hoá đơn thương mại, phiếu đóng gói, vận đơn đường biển hoặc hàng không, biên bản giám định, thư từ với người chuyên chở.</li>
</ol>
<div class="callout"><span class="badge">Ý chính</span> Chọn điều kiện bảo hiểm bằng câu hỏi "loại hàng này trên tuyến này thường gặp sự cố gì?" Với phần lớn hàng chế tạo đóng container, câu trả lời dẫn tới điều kiện (A).</div>`,
  ]]);

const c12 = doc('glt301-5-3-sustainability-vietnam', '5.3 — Sustainable transport & Vietnam’s ports and logistics|||5.3 — Vận tải bền vững & cảng biển, logistics Việt Nam',
  'IMO 2020 và giới hạn lưu huỳnh 0,50%, vùng kiểm soát phát thải, các cách tuân thủ; xu hướng giảm phát thải khí nhà kính của IMO, EU và hàng không (có rào); chạy tàu chậm và quy tắc lập phương; đo phát thải theo tấn-km (GLEC, ISO 14083) với hệ số minh hoạ; hệ thống cảng và logistics Việt Nam (Cái Mép – Thị Vải, Hải Phòng, Cát Lái) mô tả định tính.',
  [[
    `<span class="eyebrow">GLT301 · Part 5 · Lesson 5.3</span>
<h2>Sustainable transport &amp; Vietnam’s ports and logistics</h2>
<h3>IMO 2020: the global sulphur cap</h3>
<p>Since <strong>1 January 2020</strong>, under MARPOL Annex VI, the sulphur content of fuel oil used on board ships worldwide must not exceed <strong>0.50% m/m</strong> (mass by mass), down from 3.50%. In designated <strong>Emission Control Areas (ECAs)</strong> the limit is stricter, at 0.10%. The aim is cleaner air and fewer health problems in port cities and coastal areas. Ships comply in three main ways:</p>
<ul>
<li><strong>Burning compliant fuel</strong> — very low sulphur fuel oil or marine gasoil (the most common route; it costs more, which is why carriers introduced a low sulphur surcharge).</li>
<li><strong>Exhaust gas cleaning systems (scrubbers)</strong> that allow high-sulphur fuel to be burned — some ports restrict the discharge of washwater from open-loop scrubbers.</li>
<li><strong>Alternative fuels</strong> such as LNG, which contains almost no sulphur.</li>
</ul>
<h3>Decarbonisation: the direction of travel (check the latest texts)</h3>
<ul>
<li>IMO’s 2023 greenhouse gas strategy aims at <strong>net-zero emissions from international shipping by or around 2050</strong>, with indicative checkpoints for 2030 and 2040. Technical and operational measures already apply to ships (energy-efficiency design standards for new ships — EEDI, since 2013 — and, since 2023, EEXI for existing ships and annual carbon-intensity (CII) ratings), and further measures such as a fuel standard and emissions pricing are being negotiated — check the latest IMO decisions.</li>
<li>The EU has extended its emissions trading system to shipping, phased in from 2024 — check the current EU rules for coverage and timing.</li>
<li>In aviation, ICAO’s CORSIA scheme requires participating airlines to offset the growth in international aviation CO2 above a baseline (85% of 2019 emissions from 2024), with voluntary phases before it becomes mandatory from 2027 — check the current ICAO rules. Sustainable aviation fuels are growing from a small base.</li>
</ul>
<h3>Slow steaming: a rule-of-thumb calculation</h3>
<pre><code>Rule of thumb: fuel burned per day rises roughly with the cube of speed
Cut speed by 20% (speed factor 0.8):
  fuel per day      ≈ 0.8³ = 0.512   (about 49% less per day)
  voyage takes      1 / 0.8 = 1.25 times as long
  fuel per voyage   ≈ 0.8² = 0.64    (about 36% less for the same trip)</code></pre>
<p>Slower ships burn much less fuel and emit less CO2, but transit time grows and more ships are needed to keep a weekly service — a cost–time–carbon trade-off shippers feel as longer lead times.</p>
<h3>Measuring transport emissions</h3>
<p>Shippers increasingly report emissions from their transport chains, using methods such as the <strong>GLEC Framework</strong> (Smart Freight Centre) and the standard <strong>ISO 14083</strong>. The basic logic is activity x emission factor:</p>
<pre><code>Emissions = tonnes x kilometres x emission factor (g CO2e per tonne-km)
20 tonnes over 10,000 km = 200,000 tonne-km
Illustrative factors (for the method only, not official values):
  deep-sea container 15 g/tkm  ->  200,000 x 15  = 3,000,000 g = 3.0 t CO2e
  air freight       600 g/tkm  ->  200,000 x 600 = 120,000,000 g = 120 t CO2e
With these assumed factors and the same 10,000 km for both, air emits 40 times more than sea.</code></pre>
<p>The equal distance is a simplification: sea routes are usually longer than the flight path (around canals and capes), so real comparisons must use each mode’s actual distance, as GLEC and ISO 14083 require — which narrows the gap.</p>
<p>Real factors vary widely with vehicle type, load factor, fuel and route — use published GLEC or ISO-based factors, or the carrier’s own verified data, for real reports.</p>
<h3>Vietnam’s ports and logistics (qualitative overview)</h3>
<ul>
<li><strong>South:</strong> the Ho Chi Minh City port cluster, including <strong>Cát Lái</strong>, a major container terminal on the river close to the city, and the deep-water <strong>Cái Mép – Thị Vải</strong> area near Vũng Tàu, which can receive very large container ships on direct mainline services to Europe and North America instead of transhipping via regional hubs.</li>
<li><strong>North:</strong> the <strong>Hải Phòng</strong> port cluster, the main gateway for the northern industrial zones, including the deep-water <strong>Lạch Huyện</strong> area; plus rail and road links to China.</li>
<li><strong>Centre:</strong> ports such as Đà Nẵng serve the central provinces and routes towards Laos.</li>
<li><strong>Inland links:</strong> barges on the Mekong Delta and Red River systems, and <strong>inland container depots (ICDs)</strong> that act as dry ports for customs clearance and container storage.</li>
<li><strong>Challenges often discussed:</strong> congestion around urban terminals, heavy reliance on road for hinterland transport, weak rail and waterway connections to some deep-water ports, and many small logistics firms. <strong>Opportunities:</strong> direct deep-sea services, electronic customs (VNACCS/VCIS) and the National Single Window.</li>
</ul>
<p>No statistics are given here on purpose: for current capacities, throughput and rankings, use the latest official figures from port authorities and government sources.</p>
<div class="callout"><span class="badge">Outlook</span> Environmental rules are moving fast and change the cost of each mode. Treat every figure in this lesson as a snapshot, and check the current IMO, EU and Vietnamese texts in force before making a decision.</div>`,
    `<span class="eyebrow">GLT301 · Phần 5 · Bài 5.3</span>
<h2>Vận tải bền vững &amp; cảng biển, logistics Việt Nam</h2>
<h3>IMO 2020: giới hạn lưu huỳnh toàn cầu</h3>
<p>Từ <strong>ngày 1/1/2020</strong>, theo Phụ lục VI của MARPOL, hàm lượng lưu huỳnh trong nhiên liệu dùng trên tàu biển trên toàn thế giới không được vượt quá <strong>0,50% m/m</strong> (theo khối lượng), giảm từ 3,50%. Trong các <strong>vùng kiểm soát phát thải (ECA)</strong> được chỉ định, giới hạn chặt hơn, ở mức 0,10%. Mục tiêu là không khí sạch hơn và ít vấn đề sức khoẻ hơn ở các thành phố cảng và vùng ven biển. Tàu tuân thủ theo ba cách chính:</p>
<ul>
<li><strong>Dùng nhiên liệu đạt chuẩn</strong> — dầu nhiên liệu có hàm lượng lưu huỳnh rất thấp hoặc dầu diesel hàng hải (cách phổ biến nhất; đắt hơn, nên các hãng tàu đưa ra phụ phí nhiên liệu ít lưu huỳnh).</li>
<li><strong>Hệ thống làm sạch khí thải (scrubber)</strong> cho phép đốt nhiên liệu nhiều lưu huỳnh — một số cảng hạn chế xả nước rửa từ scrubber hệ hở.</li>
<li><strong>Nhiên liệu thay thế</strong> như LNG, gần như không chứa lưu huỳnh.</li>
</ul>
<h3>Giảm phát thải carbon: xu hướng chung (kiểm văn bản mới nhất)</h3>
<ul>
<li>Chiến lược khí nhà kính năm 2023 của IMO đặt mục tiêu <strong>phát thải ròng bằng 0 đối với vận tải biển quốc tế vào khoảng năm 2050</strong>, với các mốc kiểm tra định hướng cho năm 2030 và 2040. Các biện pháp kỹ thuật và vận hành đã áp dụng cho tàu (tiêu chuẩn thiết kế hiệu quả năng lượng cho tàu đóng mới — EEDI, từ năm 2013 — và từ năm 2023 là EEXI cho tàu đang khai thác cùng xếp hạng cường độ carbon hằng năm CII), còn các biện pháp tiếp theo như tiêu chuẩn nhiên liệu và định giá phát thải đang được đàm phán — kiểm các quyết định mới nhất của IMO.</li>
<li>EU đã mở rộng hệ thống mua bán phát thải sang vận tải biển, áp dụng dần từ năm 2024 — kiểm quy định hiện hành của EU về phạm vi và lộ trình.</li>
<li>Trong hàng không, cơ chế CORSIA của ICAO yêu cầu các hãng hàng không tham gia bù trừ phần phát thải CO2 của hàng không quốc tế tăng vượt một đường cơ sở (85% mức năm 2019, từ năm 2024), qua các giai đoạn tự nguyện trước khi bắt buộc từ năm 2027 — kiểm quy định hiện hành của ICAO. Nhiên liệu hàng không bền vững đang tăng lên từ một nền rất nhỏ.</li>
</ul>
<h3>Chạy tàu chậm: một phép tính theo kinh nghiệm</h3>
<pre><code>Quy tắc kinh nghiệm: nhiên liệu tiêu thụ mỗi ngày tăng xấp xỉ theo lập phương của tốc độ
Giảm tốc độ 20% (hệ số tốc độ 0,8):
  nhiên liệu mỗi ngày    ≈ 0,8³ = 0,512   (giảm khoảng 49% mỗi ngày)
  chuyến đi kéo dài      1 / 0,8 = 1,25 lần
  nhiên liệu mỗi chuyến  ≈ 0,8² = 0,64    (giảm khoảng 36% cho cùng một chuyến)</code></pre>
<p>Tàu chạy chậm hơn đốt ít nhiên liệu hơn nhiều và phát thải ít CO2 hơn, nhưng thời gian vận chuyển tăng và cần nhiều tàu hơn để duy trì dịch vụ hằng tuần — một sự đánh đổi chi phí – thời gian – carbon mà người gửi hàng cảm nhận qua thời gian giao hàng dài hơn.</p>
<h3>Đo lường phát thải vận tải</h3>
<p>Người gửi hàng ngày càng phải báo cáo phát thải từ chuỗi vận tải của mình, dùng các phương pháp như <strong>Khung GLEC</strong> (Smart Freight Centre) và tiêu chuẩn <strong>ISO 14083</strong>. Logic cơ bản là mức hoạt động x hệ số phát thải:</p>
<pre><code>Phát thải = số tấn x số km x hệ số phát thải (g CO2e mỗi tấn-km)
20 tấn trên quãng đường 10.000 km = 200.000 tấn-km
Hệ số minh hoạ (chỉ để minh hoạ phương pháp, không phải số chính thức):
  container viễn dương 15 g/tkm  ->  200.000 x 15  = 3.000.000 g = 3,0 t CO2e
  hàng không          600 g/tkm  ->  200.000 x 600 = 120.000.000 g = 120 t CO2e
Với các hệ số giả định này và cùng quãng đường 10.000 km cho cả hai, hàng không phát thải gấp 40 lần đường biển.</code></pre>
<p>Cùng quãng đường là một giả định đơn giản hoá: tuyến biển thường dài hơn đường bay (phải vòng qua kênh đào, mũi đất), nên so sánh thực tế phải dùng quãng đường thật của từng phương thức, như GLEC và ISO 14083 yêu cầu — khi đó khoảng cách giữa hai phương thức hẹp lại.</p>
<p>Hệ số thực tế biến động lớn theo loại phương tiện, hệ số chất tải, nhiên liệu và tuyến đường — với báo cáo thật, hãy dùng hệ số đã công bố theo GLEC hoặc ISO, hoặc dữ liệu đã kiểm chứng của chính người chuyên chở.</p>
<h3>Cảng biển và logistics Việt Nam (tổng quan định tính)</h3>
<ul>
<li><strong>Phía Nam:</strong> cụm cảng TP. Hồ Chí Minh, gồm <strong>Cát Lái</strong> — một cảng container lớn trên sông, gần thành phố — và khu vực cảng nước sâu <strong>Cái Mép – Thị Vải</strong> gần Vũng Tàu, có thể đón tàu container rất lớn trên các tuyến chính đi thẳng tới châu Âu và Bắc Mỹ thay vì chuyển tải qua các cảng trung chuyển trong khu vực.</li>
<li><strong>Phía Bắc:</strong> cụm cảng <strong>Hải Phòng</strong>, cửa ngõ chính của các khu công nghiệp phía Bắc, gồm khu vực cảng nước sâu <strong>Lạch Huyện</strong>; cùng các kết nối đường sắt và đường bộ sang Trung Quốc.</li>
<li><strong>Miền Trung:</strong> các cảng như Đà Nẵng phục vụ các tỉnh miền Trung và các tuyến hướng sang Lào.</li>
<li><strong>Kết nối nội địa:</strong> sà lan trên hệ thống sông Cửu Long và sông Hồng, và các <strong>cảng cạn (ICD)</strong> đóng vai trò cảng khô để thông quan và lưu container.</li>
<li><strong>Thách thức thường được nêu:</strong> ùn tắc quanh các cảng trong đô thị, phụ thuộc nhiều vào đường bộ cho vận tải nội địa, kết nối đường sắt và đường thuỷ tới một số cảng nước sâu còn yếu, và nhiều doanh nghiệp logistics quy mô nhỏ. <strong>Cơ hội:</strong> các tuyến viễn dương đi thẳng, hải quan điện tử (VNACCS/VCIS) và Cơ chế một cửa quốc gia.</li>
</ul>
<p>Bài này cố ý không đưa số liệu thống kê: với năng lực, sản lượng và xếp hạng hiện hành, hãy dùng số liệu chính thức mới nhất của cơ quan quản lý cảng và các nguồn nhà nước.</p>
<div class="callout"><span class="badge">Triển vọng</span> Quy định môi trường thay đổi rất nhanh và làm thay đổi chi phí của từng phương thức. Hãy coi mọi con số trong bài là ảnh chụp tại một thời điểm, và kiểm văn bản đang có hiệu lực của IMO, EU và Việt Nam trước khi ra quyết định.</div>`,
  ]]);

const c12q = quiz('glt301-quiz-5', 'Quiz 5 — Incoterms, insurance & sustainability|||Quiz 5 — Incoterms, bảo hiểm & vận tải bền vững', [
  { id: 'q1', question: 'Under IMO 2020, what is the global limit on sulphur in fuel oil used on board ships outside Emission Control Areas?|||Theo IMO 2020, giới hạn toàn cầu về hàm lượng lưu huỳnh trong nhiên liệu dùng trên tàu bên ngoài các vùng kiểm soát phát thải là bao nhiêu?', options: ['3.50% m/m|||3,50% m/m', '0.10% m/m|||0,10% m/m', '0.50% m/m|||0,50% m/m', '1.00% m/m|||1,00% m/m'], correctIndex: 2, explanation: 'The global cap fell from 3.50% to 0.50% on 1 January 2020; 0.10% applies inside ECAs.|||Giới hạn toàn cầu giảm từ 3,50% xuống 0,50% từ ngày 1/1/2020; mức 0,10% áp dụng trong các vùng ECA.' },
  { id: 'q2', question: 'A seller hands a full container to the carrier at an inland container depot. Which Incoterms 2020 rule does ICC guidance recommend instead of FOB?|||Người bán giao nguyên container cho người chuyên chở tại một cảng cạn. Theo hướng dẫn của ICC, nên dùng điều kiện Incoterms 2020 nào thay cho FOB?', options: ['FAS|||FAS', 'FCA|||FCA', 'CFR|||CFR', 'EXW|||EXW'], correctIndex: 1, explanation: 'Under FCA the risk passes when the container is handed to the carrier; under FOB the seller would keep the risk until the box is on board, while it no longer controls it.|||Với FCA rủi ro chuyển giao khi container được giao cho người chuyên chở; với FOB người bán vẫn chịu rủi ro tới khi container lên tàu, trong khi không còn kiểm soát nó.' },
  { id: 'q3', question: 'A carton is stolen during transit and no other peril is involved. Which Institute Cargo Clauses cover the loss?|||Một thùng hàng bị trộm trong quá trình vận chuyển, không có rủi ro nào khác. Điều kiện bảo hiểm nào của Viện bồi thường tổn thất này?', options: ['(C) only|||Chỉ (C)', '(B) and (C) only|||Chỉ (B) và (C)', 'None of the Institute Cargo Clauses|||Không điều kiện nào của Viện', 'Only (A)|||Chỉ (A)'], correctIndex: 3, explanation: 'Theft is not a named peril in (B) or (C); the all-risks cover of (A) includes it unless it is excluded.|||Trộm cắp không nằm trong các rủi ro được liệt kê của (B) hay (C); điều kiện mọi rủi ro (A) bao gồm nó trừ khi bị loại trừ.' },
]);

const taiLieu = doc('glt301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (kèm link), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">GLT301 · 📚 Resource hub</span>
<h2>Course materials &amp; references</h2>
<p class="lead">One hub for learning international transport management: the official syllabus and slides, books, free official resources, video channels, tools and a self-study roadmap.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>Sign in to <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) with your FPTU account to read the official GLT301 syllabus and lecture slides.</p>
<h3>📗 Books</h3>
<ul>
<li><a href="https://www.routledge.com/Elements-of-Shipping/Branch-Robarts/p/book/9781138786684" target="_blank" rel="noopener">Branch’s Elements of Shipping</a> — Alan Edward Branch &amp; Michael Robarts (Routledge): the classic guide to ships, liner and tramp markets, chartering and shipping documents.</li>
<li><a href="https://www.cicerobooks.com/product/international-logistics-6e-print-version-pierre-david/" target="_blank" rel="noopener">International Logistics</a> — Pierre David (Cicero Books): modes, documents, Incoterms, insurance and customs from the trader’s point of view.</li>
</ul>
<h3>🌐 Free official resources</h3>
<ul>
<li><a href="https://www.imo.org/" target="_blank" rel="noopener">International Maritime Organization (IMO)</a> — the UN agency for shipping; see also its page on <a href="https://www.imo.org/en/MediaCentre/PressBriefings/pages/02-IMO-2020.aspx" target="_blank" rel="noopener">the IMO 2020 sulphur limit</a>.</li>
<li><a href="https://iccwbo.org/business-solutions/incoterms-rules/incoterms-2020/" target="_blank" rel="noopener">ICC — Incoterms® 2020</a> — the official source for the rules (the full text is an ICC publication).</li>
<li><a href="https://www.iata.org/en/programs/cargo/" target="_blank" rel="noopener">IATA Cargo</a> — air cargo programmes: e-AWB, dangerous goods, ULDs, security.</li>
<li><a href="https://uncitral.un.org/en/texts/transportgoods/conventions/rotterdam_rules" target="_blank" rel="noopener">UNCITRAL — the Rotterdam Rules</a> — the convention text and its ratification status.</li>
<li><a href="https://www.bimco.org/" target="_blank" rel="noopener">BIMCO</a> — shipowners’ association that publishes standard charter parties such as GENCON and BARECON.</li>
<li><a href="https://fiata.org/" target="_blank" rel="noopener">FIATA</a> — the international federation of freight forwarders, home of the FBL and model trading rules.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@IMOHQ" target="_blank" rel="noopener">IMO</a> — official videos on maritime safety, pollution and decarbonisation.</li>
<li><a href="https://www.youtube.com/@IATAtv" target="_blank" rel="noopener">IATA</a> — air transport and air cargo briefings.</li>
<li><a href="https://www.youtube.com/@MITCTL" target="_blank" rel="noopener">MIT Center for Transportation &amp; Logistics</a> — lectures on freight transport and supply chains.</li>
<li><a href="https://www.youtube.com/@Maersk" target="_blank" rel="noopener">Maersk</a> — a container carrier’s view of ships, terminals and logistics.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.freightos.com/" target="_blank" rel="noopener">Freightos</a> — an online freight marketplace: compare indicative sea and air quotes and see how rates are built up.</li>
<li><a href="https://www.microsoft.com/en-us/microsoft-365/excel" target="_blank" rel="noopener">Microsoft Excel</a> — build laytime statements, W/M and chargeable-weight calculators.</li>
<li><a href="https://www.google.com/sheets/about/" target="_blank" rel="noopener">Google Sheets</a> — the same models, free and online.</li>
</ul>
<h3>🎯 Self-study roadmap</h3>
<ol>
<li><strong>Foundations (exam core)</strong> — modes, liner vs tramp, charter parties, the bill of lading and Incoterms 2020, following Parts 1–3 and lesson 5.1 here.</li>
<li><strong>Practise</strong> — redo the three exercises with your own numbers in a spreadsheet: W/M break-even, air chargeable weight, a laytime statement.</li>
<li><strong>Go deeper</strong> — read the IMO 2020 page and the Rotterdam Rules status page, then compare the liability regimes with the table in lesson 3.4.</li>
<li><strong>Apply</strong> — plan one real export from Vietnam: choose the mode, route and port, the Incoterms rule, the transport document and the insurance cover, and justify each choice by total landed cost.</li>
</ol>
<div class="callout"><span class="badge">Note</span> An original hub of real links — no copyrighted slides or books are embedded. If a link moves, start from the official homepage.</div>`,
    `<span class="eyebrow">GLT301 · 📚 Trung tâm tài liệu</span>
<h2>Tài liệu tham khảo môn học</h2>
<p class="lead">Một nơi gom để học quản trị vận tải quốc tế: giáo trình &amp; slide chính thức, sách, tài liệu miễn phí chính thống, kênh video, công cụ, và lộ trình tự học.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Đăng nhập <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) bằng tài khoản FPTU để đọc giáo trình và slide bài giảng chính thức của GLT301.</p>
<h3>📗 Sách</h3>
<ul>
<li><a href="https://www.routledge.com/Elements-of-Shipping/Branch-Robarts/p/book/9781138786684" target="_blank" rel="noopener">Branch’s Elements of Shipping</a> — Alan Edward Branch &amp; Michael Robarts (Routledge): cuốn cẩm nang kinh điển về tàu biển, thị trường tàu chợ và tàu chạy rông, thuê tàu và chứng từ vận tải biển.</li>
<li><a href="https://www.cicerobooks.com/product/international-logistics-6e-print-version-pierre-david/" target="_blank" rel="noopener">International Logistics</a> — Pierre David (Cicero Books): phương thức vận tải, chứng từ, Incoterms, bảo hiểm và hải quan dưới góc nhìn của nhà buôn.</li>
</ul>
<h3>🌐 Tài liệu chính thức miễn phí</h3>
<ul>
<li><a href="https://www.imo.org/" target="_blank" rel="noopener">Tổ chức Hàng hải Quốc tế (IMO)</a> — cơ quan Liên Hợp Quốc về vận tải biển; xem thêm trang về <a href="https://www.imo.org/en/MediaCentre/PressBriefings/pages/02-IMO-2020.aspx" target="_blank" rel="noopener">giới hạn lưu huỳnh IMO 2020</a>.</li>
<li><a href="https://iccwbo.org/business-solutions/incoterms-rules/incoterms-2020/" target="_blank" rel="noopener">ICC — Incoterms® 2020</a> — nguồn chính thức của các quy tắc (toàn văn là ấn phẩm của ICC).</li>
<li><a href="https://www.iata.org/en/programs/cargo/" target="_blank" rel="noopener">IATA Cargo</a> — các chương trình hàng hoá hàng không: e-AWB, hàng nguy hiểm, ULD, an ninh.</li>
<li><a href="https://uncitral.un.org/en/texts/transportgoods/conventions/rotterdam_rules" target="_blank" rel="noopener">UNCITRAL — Quy tắc Rotterdam</a> — văn bản công ước và tình trạng phê chuẩn.</li>
<li><a href="https://www.bimco.org/" target="_blank" rel="noopener">BIMCO</a> — hiệp hội chủ tàu phát hành các mẫu hợp đồng thuê tàu chuẩn như GENCON và BARECON.</li>
<li><a href="https://fiata.org/" target="_blank" rel="noopener">FIATA</a> — liên đoàn quốc tế các hiệp hội giao nhận, nơi ban hành vận đơn FBL và các quy tắc kinh doanh mẫu.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@IMOHQ" target="_blank" rel="noopener">IMO</a> — video chính thức về an toàn hàng hải, ô nhiễm và giảm phát thải carbon.</li>
<li><a href="https://www.youtube.com/@IATAtv" target="_blank" rel="noopener">IATA</a> — thông tin về vận tải hàng không và hàng hoá hàng không.</li>
<li><a href="https://www.youtube.com/@MITCTL" target="_blank" rel="noopener">MIT Center for Transportation &amp; Logistics</a> — bài giảng về vận tải hàng hoá và chuỗi cung ứng.</li>
<li><a href="https://www.youtube.com/@Maersk" target="_blank" rel="noopener">Maersk</a> — góc nhìn của một hãng tàu container về tàu, cảng và logistics.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.freightos.com/" target="_blank" rel="noopener">Freightos</a> — sàn cước vận tải trực tuyến: so sánh báo giá tham khảo đường biển và hàng không, xem cước được cấu thành thế nào.</li>
<li><a href="https://www.microsoft.com/en-us/microsoft-365/excel" target="_blank" rel="noopener">Microsoft Excel</a> — lập bảng tính laytime, công cụ tính W/M và trọng lượng tính cước.</li>
<li><a href="https://www.google.com/sheets/about/" target="_blank" rel="noopener">Google Sheets</a> — cùng các mô hình đó, miễn phí và trực tuyến.</li>
</ul>
<h3>🎯 Lộ trình tự học</h3>
<ol>
<li><strong>Nền tảng (lõi thi)</strong> — phương thức vận tải, tàu chợ và tàu chạy rông, hợp đồng thuê tàu, vận đơn và Incoterms 2020, theo đúng Phần 1–3 và bài 5.1 ở đây.</li>
<li><strong>Luyện tập</strong> — làm lại ba bài tập với số liệu của riêng bạn trên bảng tính: hoà vốn W/M, trọng lượng tính cước hàng không, bảng tính laytime.</li>
<li><strong>Đào sâu</strong> — đọc trang IMO 2020 và trang tình trạng Quy tắc Rotterdam, rồi đối chiếu các chế độ trách nhiệm với bảng ở bài 3.4.</li>
<li><strong>Vận dụng</strong> — lập kế hoạch cho một lô hàng xuất khẩu thật từ Việt Nam: chọn phương thức, tuyến và cảng, điều kiện Incoterms, chứng từ vận tải và điều kiện bảo hiểm, và lý giải từng lựa chọn bằng tổng chi phí đến tay.</li>
</ol>
<div class="callout"><span class="badge">Lưu ý</span> Đây là trung tâm liên kết nguyên gốc — không nhúng slide/sách có bản quyền. Link đổi thì vào trang chủ chính thức để tìm.</div>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'GLT301',
    slug: 'glt301-international-transport-management',
    title: 'International Transport Management',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/GLT301.webp',
    shortDescription: 'How goods cross borders: transport modes, liner and tramp shipping, chartering and laytime, containers and freight, bills of lading, air cargo, multimodal transport, Incoterms 2020 and cargo insurance. Bilingual, with exercises and quizzes.|||Đưa hàng qua biên giới: phương thức vận tải, tàu chợ và tàu chạy rông, thuê tàu và laytime, container và cước, vận đơn, hàng không, đa phương thức, Incoterms 2020, bảo hiểm hàng hoá. Song ngữ, có bài tập và quiz.',
    description: 'Môn <strong>GLT301 — International Transport Management (Quản trị vận tải quốc tế)</strong> (khối Quản trị Kinh doanh, kỳ 3) trả lời câu hỏi của nhà quản trị vận tải: <strong>đưa hàng qua biên giới bằng phương thức nào, theo hợp đồng và chứng từ nào, với chi phí và rủi ro ra sao</strong>. Từ <strong>vai trò của vận tải và so sánh các phương thức</strong> (tổng chi phí đến tay) → <strong>vận tải biển</strong> (tàu chợ và tàu chạy rông, loại tàu, thuê chuyến, thuê định hạn, thuê tàu trần, laytime và demurrage) → <strong>container và cước</strong> (TEU, FCL/LCL, W/M, phụ phí), <strong>vận đơn đường biển</strong> và các quy tắc Hague, Hague-Visby, Hamburg, Rotterdam → <strong>hàng không, đường bộ, đường sắt và đa phương thức</strong> (AWB, trọng lượng tính cước, MTO, NVOCC) → <strong>Incoterms 2020, bảo hiểm hàng hoá (Institute Cargo Clauses A/B/C), vận tải bền vững (IMO 2020) và cảng biển Việt Nam</strong>. Bám cấu trúc giáo trình vận tải và logistics quốc tế chuẩn, song ngữ Anh–Việt, mọi ví dụ số đã kiểm bằng máy (mức cước là giả định minh hoạ), có bài tập kèm lời giải và quiz cuối mỗi phần.',
    whatYouLearn: 'So sánh các phương thức vận tải theo chi phí, thời gian, rủi ro và tính tổng chi phí đến tay\nPhân biệt tàu chợ và tàu chạy rông, các loại tàu và cách gọi tên cỡ tàu\nSo sánh thuê chuyến, thuê định hạn, thuê tàu trần; tính laytime, demurrage, despatch và TCE\nTính cước hàng lẻ theo W/M, nhận diện phụ phí và tìm điểm hoà vốn chuyển sang FCL\nGiải thích ba chức năng và các loại vận đơn, giấy gửi hàng đường biển; so sánh các chế độ trách nhiệm\nTính trọng lượng thể tích, trọng lượng tính cước và cước hàng không theo mốc cước\nPhân biệt người giao nhận, NVOCC, MTO; chọn điều kiện Incoterms 2020 phù hợp với phương thức\nChọn điều kiện bảo hiểm ICC A/B/C, xử lý tổn thất chung; hiểu IMO 2020 và hệ thống cảng Việt Nam',
    requirements: 'Nên có kiến thức nhập môn về kinh doanh quốc tế hoặc logistics và chuỗi cung ứng\nTính toán cơ bản với phần trăm và đơn vị đo (cm, m³, kg, tấn)\nĐọc hiểu tiếng Anh chuyên ngành ở mức cơ bản — thuật ngữ vận tải chủ yếu dùng tiếng Anh',
  },
  sections: [
    { title: '📚 Course materials|||📚 Tài liệu tham khảo', description: 'Giáo trình & slide trên FLM, sách, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Course introduction|||Giới thiệu môn học', description: 'Nhà quản trị vận tải quyết định gì, các bên tham gia, lộ trình môn.', lessons: [intro] },
    { title: 'Part 1 — Transport in trade & the modes|||Phần 1 — Vận tải trong thương mại & các phương thức', description: 'Vai trò của vận tải, tổng chi phí đến tay, so sánh chi phí – thời gian – rủi ro của các phương thức.', lessons: [c1, c2, c2q] },
    { title: 'Part 2 — Ocean shipping & chartering|||Phần 2 — Vận tải biển & thuê tàu', description: 'Tàu chợ và tàu chạy rông, loại tàu, hợp đồng thuê tàu, laytime, demurrage, despatch.', lessons: [c3, c4, c4e, c4q] },
    { title: 'Part 3 — Containers, bills of lading & liability|||Phần 3 — Container, vận đơn & trách nhiệm', description: 'TEU, FCL/LCL, W/M, phụ phí, vận đơn đường biển, giấy gửi hàng, Hague-Visby, Hamburg, Rotterdam.', lessons: [c5, c5e, c6, c7, c7q] },
    { title: 'Part 4 — Air, road, rail & multimodal transport|||Phần 4 — Hàng không, đường bộ, đường sắt & đa phương thức', description: 'AWB, trọng lượng tính cước, ULD, Montreal, CMR, đường sắt, MTO, người giao nhận và NVOCC.', lessons: [c8, c8e, c9, c9q] },
    { title: 'Part 5 — Incoterms, insurance & sustainable transport|||Phần 5 — Incoterms, bảo hiểm & vận tải bền vững', description: 'Incoterms 2020, bảo hiểm theo Institute Cargo Clauses A/B/C, tổn thất chung, IMO 2020, phát thải, cảng biển Việt Nam.', lessons: [c10, c11, c12, c12q] },
  ],
};
