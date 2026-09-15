/**
 * TTD202 — Tourism Destinations and Routes of Vietnam. Giáo trình FLM (khối
 * Quản trị Kinh doanh — Du lịch): "Tourism Geography" (Hall & Page), giáo
 * trình Địa lý Du lịch Việt Nam (Nguyễn Minh Tuệ), tài liệu Tổng cục Du lịch
 * (VNAT). 8 chương chia theo 7 vùng du lịch Việt Nam + thiết kế tuyến liên
 * vùng. Song ngữ + ví dụ + bài tập. Giữ NGUYÊN slug/semester/thumb(v3).
 * ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('ttd202-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình Địa lý Du lịch VN, sách Tourism Geography, tài liệu VNAT, bản đồ vùng, công cụ thiết kế tuyến, lộ trình tự học.',
  [[
    `<span class="eyebrow">TTD202 · Materials</span>
<h2>Tourism Destinations &amp; Routes of Vietnam — resource hub</h2>
<p class="lead">Everything to study Vietnam's tourism geography and route design — the 7 tourism regions, key destinations, and how to build a multi-day itinerary — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal references.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for TTD202 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://www.routledge.com/Tourism-Geography-A-Critical-Introduction-to-Space-Place-and-Environment/Hall-Page/p/book/9781138043631" target="_blank" rel="noopener"><em>Tourism Geography: A Critical Introduction to Space, Place and Environment</em> — C. Michael Hall &amp; Stephen J. Page</a></li>
<li><em>Địa lý Du lịch Việt Nam</em> — Nguyễn Minh Tuệ (chủ biên) — giáo trình phân vùng du lịch chuẩn theo Quy hoạch tổng thể phát triển du lịch Việt Nam.</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://vietnamtourism.gov.vn/" target="_blank" rel="noopener">Vietnam National Authority of Tourism (VNAT — Tổng cục Du lịch)</a> — statistics, regional planning, official destination data</li>
<li><a href="https://vietnam.travel/" target="_blank" rel="noopener">Vietnam.travel</a> — the official national tourism promotion site, organized by destination</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li>Search <strong>"Vietnam Tourism Board"</strong> and each destination name (e.g. "Ha Giang loop", "Phong Nha Son Doong") for on-the-ground footage of the regions in this course.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.google.com/mymaps" target="_blank" rel="noopener">Google My Maps</a> — plot a multi-destination route and layer it by region</li>
<li><a href="https://www.google.com/maps" target="_blank" rel="noopener">Google Maps</a> — check real driving/flight distances between destinations when designing an itinerary</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — the 7 tourism regions, their defining resource type, and 2-3 flagship destinations per region.</li>
<li><strong>Practice</strong> — for every destination, know its region, its main resource (natural vs. cultural), and one realistic access route from Hanoi or Ho Chi Minh City.</li>
<li><strong>Go deeper</strong> — compare regions by tourism type (beach, heritage, eco/adventure, MICE, river) and note the UNESCO sites in each.</li>
<li><strong>Job-ready</strong> — design a multi-region itinerary (e.g. a north loop or the Central heritage road) with realistic day-by-day routing and a sensible hub city.</li>
</ol></div>`,
    `<span class="eyebrow">TTD202 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học địa lý du lịch Việt Nam và thiết kế tuyến — 7 vùng du lịch, các điểm đến trọng điểm, và cách ghép chúng thành một hành trình nhiều ngày — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của TTD202 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://www.routledge.com/Tourism-Geography-A-Critical-Introduction-to-Space-Place-and-Environment/Hall-Page/p/book/9781138043631" target="_blank" rel="noopener"><em>Tourism Geography: A Critical Introduction to Space, Place and Environment</em> — C. Michael Hall &amp; Stephen J. Page</a></li>
<li><em>Địa lý Du lịch Việt Nam</em> — Nguyễn Minh Tuệ (chủ biên) — giáo trình phân vùng du lịch chuẩn theo Quy hoạch tổng thể phát triển du lịch Việt Nam.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://vietnamtourism.gov.vn/" target="_blank" rel="noopener">Tổng cục Du lịch Việt Nam (VNAT)</a> — số liệu, quy hoạch vùng, dữ liệu điểm đến chính thức</li>
<li><a href="https://vietnam.travel/" target="_blank" rel="noopener">Vietnam.travel</a> — trang xúc tiến du lịch quốc gia chính thức, tổ chức theo điểm đến</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li>Tìm <strong>"Vietnam Tourism Board"</strong> và tên từng điểm đến (vd "vòng cung Hà Giang", "Phong Nha Sơn Đoòng") để xem hình ảnh thực tế các vùng trong môn.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.google.com/mymaps" target="_blank" rel="noopener">Google My Maps</a> — vẽ tuyến nhiều điểm đến và phân theo vùng</li>
<li><a href="https://www.google.com/maps" target="_blank" rel="noopener">Google Maps</a> — kiểm khoảng cách lái xe/bay thật giữa các điểm đến khi thiết kế tuyến</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — 7 vùng du lịch, loại tài nguyên đặc trưng, và 2-3 điểm đến chủ lực mỗi vùng.</li>
<li><strong>Luyện tập</strong> — với mỗi điểm đến, nắm vùng, tài nguyên chính (tự nhiên hay nhân văn), và một tuyến tiếp cận thực tế từ Hà Nội hoặc TP.HCM.</li>
<li><strong>Đào sâu</strong> — so sánh các vùng theo loại hình du lịch (biển, di sản, sinh thái/mạo hiểm, MICE, sông nước) và ghi nhớ di sản UNESCO của từng vùng.</li>
<li><strong>Sẵn sàng đi làm</strong> — thiết kế một tuyến liên vùng (vd vòng cung phía Bắc hoặc con đường di sản miền Trung) với lịch trình từng ngày hợp lý và thành phố trung tâm phù hợp.</li>
</ol></div>`,
  ]]);

const intro = doc('ttd202-0-1-overview', 'Course overview: Tourism destinations & routes of Vietnam|||Tổng quan môn: Điểm đến & Tuyến du lịch Việt Nam',
  'Tài nguyên du lịch tự nhiên/nhân văn; 7 vùng du lịch Việt Nam theo quy hoạch; lộ trình môn học đi từ Bắc vào Nam, kết ở thiết kế tuyến liên vùng.',
  [[
    `<span class="eyebrow">TTD202 · Lesson 0.1 · Overview</span>
<h2>Tourism Destinations &amp; Routes of Vietnam</h2>
<p class="lead">This course maps Vietnam's tourism geography: what makes a place a "destination", how natural and cultural resources combine into a tourism product, and how tour routes are designed to connect destinations efficiently across a region.</p>
<h3>Two kinds of tourism resource</h3>
<ul>
<li><strong>Natural resources</strong> — coastline &amp; beaches, karst caves, mountains, rivers, national parks and biodiversity (e.g. Ha Long Bay, Phong Nha caves, Sapa's terraced fields).</li>
<li><strong>Cultural &amp; historical resources</strong> — heritage sites, festivals, cuisine, ethnic minority culture, revolutionary history (e.g. Hue's imperial city, Hoi An's ancient town).</li>
</ul>
<h3>Vietnam's 7 tourism regions</h3>
<p>Vietnam's official tourism planning divides the country into 7 tourism regions, running roughly north to south along its S-shape — the structure this course follows chapter by chapter.</p>
<pre><code>1. Trung du &amp; miền núi phía Bắc      (Northern midlands &amp; mountains)
2. ĐB sông Hồng &amp; duyên hải Đông Bắc (Red River Delta &amp; NE coast)
3. Bắc Trung Bộ                       (North Central Coast)
4. Duyên hải Nam Trung Bộ              (South Central Coast)
5. Tây Nguyên                         (Central Highlands)
6. Đông Nam Bộ                        (Southeast)
7. ĐB sông Cửu Long                    (Mekong Delta)
</code></pre>
<div class="callout"><span class="badge">Why regions, not provinces</span> A tour route rarely stays inside one province. Thinking in regions — shared geography, shared airports/highways — is how real itineraries actually get designed, and it's the frame this whole course uses.</div>`,
    `<span class="eyebrow">TTD202 · Bài 0.1 · Tổng quan</span>
<h2>Điểm đến &amp; Tuyến du lịch Việt Nam</h2>
<p class="lead">Môn này lập bản đồ địa lý du lịch Việt Nam: điều gì làm một nơi trở thành "điểm đến", tài nguyên tự nhiên và nhân văn kết hợp thành sản phẩm du lịch thế nào, và tuyến du lịch được thiết kế ra sao để nối các điểm đến hiệu quả trong một vùng.</p>
<h3>Hai loại tài nguyên du lịch</h3>
<ul>
<li><strong>Tài nguyên tự nhiên</strong> — bờ biển &amp; bãi biển, hang động karst, núi, sông, vườn quốc gia và đa dạng sinh học (vd Vịnh Hạ Long, hang Phong Nha, ruộng bậc thang Sapa).</li>
<li><strong>Tài nguyên nhân văn &amp; lịch sử</strong> — di tích, lễ hội, ẩm thực, văn hoá dân tộc thiểu số, lịch sử cách mạng (vd cố đô Huế, phố cổ Hội An).</li>
</ul>
<h3>7 vùng du lịch Việt Nam</h3>
<p>Quy hoạch du lịch chính thức chia Việt Nam thành 7 vùng du lịch, chạy gần như từ Bắc vào Nam theo hình chữ S — đây là cấu trúc mà môn học đi theo từng chương.</p>
<pre><code>1. Trung du &amp; miền núi phía Bắc      (Trung du &amp; núi phía Bắc)
2. ĐB sông Hồng &amp; duyên hải Đông Bắc (ĐB sông Hồng &amp; ĐB Bắc)
3. Bắc Trung Bộ                       (Bắc Trung Bộ)
4. Duyên hải Nam Trung Bộ              (Nam Trung Bộ)
5. Tây Nguyên                         (Tây Nguyên)
6. Đông Nam Bộ                        (Đông Nam Bộ)
7. ĐB sông Cửu Long                    (ĐB sông Cửu Long)
</code></pre>
<div class="callout"><span class="badge">Vì sao theo vùng, không theo tỉnh</span> Một tuyến du lịch hiếm khi chỉ nằm trong một tỉnh. Nghĩ theo vùng — địa lý chung, sân bay/quốc lộ chung — là cách các tuyến thật được thiết kế, và cũng là khung mà cả môn học này dùng.</div>`,
  ]]);

const c1 = doc('ttd202-1-1-tong-quan-tai-nguyen', '1.1 — Tourism resources & Vietnam\'s 7 tourism regions|||1.1 — Tổng quan tài nguyên & 7 vùng du lịch Việt Nam',
  'Phân loại tài nguyên du lịch tự nhiên/nhân văn; tiêu chí phân vùng du lịch; sản phẩm du lịch đặc trưng của mỗi vùng trong 7 vùng du lịch Việt Nam.',
  [[
    `<span class="eyebrow">TTD202 · Chapter 1 · Lesson 1.1</span>
<h2>Tourism resources and the 7-region map</h2>
<h3>What makes a tourism resource</h3>
<p>A resource becomes "touristic" when it can <strong>pull visitors</strong> and be <strong>received</strong>: it needs (1) a natural resource (climate, terrain, water, biodiversity) or a cultural resource (heritage, festival, craft, cuisine), plus (2) the infrastructure to receive visitors (access road/airport, accommodation, guiding services). Neither alone is enough — a beautiful but inaccessible site is not yet a destination.</p>
<h3>How the 7 regions are drawn</h3>
<p>Vietnam's tourism regions are grouped by <strong>shared geography</strong>, a <strong>shared transport corridor</strong> (a common airport/highway/rail line), and a <strong>common dominant tourism type</strong> — not by administrative province lines.</p>
<pre><code>Region                              Dominant tourism type
1. Miền núi phía Bắc                 Eco/adventure, ethnic culture
2. ĐB sông Hồng &amp; duyên hải Đông Bắc Heritage capital + sea (Ha Long)
3. Bắc Trung Bộ                      Heritage (imperial) + caves
4. Duyên hải Nam Trung Bộ             Beach resort + ancient town
5. Tây Nguyên                        Highland eco/culture
6. Đông Nam Bộ                       Urban/MICE + island
7. ĐB sông Cửu Long                   River/eco tourism
</code></pre>
<div class="callout"><span class="badge">Same resource shape, different product</span> Ha Long Bay's karst looks geologically like Phong Nha's caves 300 km south, yet the tourism products built on them differ completely — cruising vs. spelunking — because access and surrounding infrastructure differ. Resource type alone never predicts the product.</div>`,
    `<span class="eyebrow">TTD202 · Chương 1 · Bài 1.1</span>
<h2>Tài nguyên du lịch và bản đồ 7 vùng</h2>
<h3>Điều gì làm nên một tài nguyên du lịch</h3>
<p>Một tài nguyên trở thành "có tính du lịch" khi nó vừa <strong>hút được khách</strong> vừa <strong>tiếp nhận được khách</strong>: cần (1) tài nguyên tự nhiên (khí hậu, địa hình, nguồn nước, đa dạng sinh học) hoặc tài nguyên nhân văn (di tích, lễ hội, nghề thủ công, ẩm thực), cộng (2) hạ tầng tiếp nhận khách (đường/sân bay, lưu trú, dịch vụ hướng dẫn). Thiếu một trong hai đều chưa thành điểm đến — cảnh đẹp mà không tiếp cận được thì chưa phải điểm đến.</p>
<h3>7 vùng được vạch ra thế nào</h3>
<p>Các vùng du lịch Việt Nam được nhóm theo <strong>địa lý chung</strong>, <strong>trục giao thông chung</strong> (sân bay/quốc lộ/đường sắt chung), và <strong>loại hình du lịch chủ đạo chung</strong> — không theo ranh giới hành chính tỉnh.</p>
<pre><code>Vùng                                 Loại hình du lịch chủ đạo
1. Miền núi phía Bắc                 Sinh thái/mạo hiểm, văn hoá dân tộc
2. ĐB sông Hồng &amp; duyên hải Đông Bắc Di sản thủ đô + biển (Hạ Long)
3. Bắc Trung Bộ                      Di sản (cố đô) + hang động
4. Duyên hải Nam Trung Bộ             Nghỉ dưỡng biển + phố cổ
5. Tây Nguyên                        Sinh thái/văn hoá cao nguyên
6. Đông Nam Bộ                       Đô thị/MICE + đảo
7. ĐB sông Cửu Long                   Du lịch sông nước/sinh thái
</code></pre>
<div class="callout"><span class="badge">Cùng dạng tài nguyên, sản phẩm khác nhau</span> Karst Vịnh Hạ Long về địa chất giống hang Phong Nha 300km về phía Nam, nhưng sản phẩm du lịch dựng trên đó hoàn toàn khác — du thuyền vs. thám hiểm hang — vì hạ tầng và khả năng tiếp cận khác nhau. Loại tài nguyên không bao giờ tự dự đoán được sản phẩm.</div>`,
  ]]);

const c1q = quiz('ttd202-quiz-1', 'Quiz 1 — Tài nguyên & 7 vùng|||Quiz 1 — Resources & 7 regions', [
  { id: 'q1', question: 'Một tài nguyên chỉ trở thành điểm đến du lịch thật khi có thêm điều gì?', options: ['Chỉ cần đẹp là đủ', 'Hạ tầng tiếp nhận khách (đường/sân bay, lưu trú, dịch vụ)', 'Chỉ cần nằm gần thủ đô', 'Chỉ cần được UNESCO công nhận'], correctIndex: 1, explanation: 'Tài nguyên đẹp nhưng không tiếp cận/tiếp nhận được khách thì chưa phải điểm đến.' },
  { id: 'q2', question: 'Việt Nam được chia thành bao nhiêu vùng du lịch theo quy hoạch?', options: ['5 vùng', '6 vùng', '7 vùng', '9 vùng'], correctIndex: 2, explanation: '7 vùng, chạy gần như từ Bắc vào Nam theo hình chữ S đất nước.' },
  { id: 'q3', question: 'Các vùng du lịch Việt Nam được vạch ra chủ yếu dựa trên tiêu chí nào?', options: ['Ranh giới hành chính tỉnh', 'Địa lý chung, trục giao thông chung, loại hình du lịch chủ đạo chung', 'Dân số đông nhất', 'Giá phòng lưu trú trung bình'], correctIndex: 1, explanation: 'Phân vùng theo địa lý + hạ tầng giao thông + sản phẩm du lịch chủ đạo, không theo tỉnh.' },
]);

const c2 = doc('ttd202-2-1-mien-nui-phia-bac', '2.1 — Northern midlands & mountains: Sapa, Ha Giang, Dien Bien|||2.1 — Trung du & miền núi phía Bắc: Sapa, Hà Giang, Điện Biên',
  'Sapa (Fansipan, ruộng bậc thang, Cát Cát), cao nguyên đá Hà Giang (đèo Mã Pí Lèng), Điện Biên (di tích lịch sử); tuyến vòng cung Tây Bắc.',
  [[
    `<span class="eyebrow">TTD202 · Chapter 2 · Lesson 2.1</span>
<h2>Northern midlands &amp; mountains</h2>
<h3>Sapa (Lao Cai)</h3>
<p>Terraced rice fields, <strong>Fansipan</strong> (Vietnam's highest peak, reached by cable car), and ethnic minority markets such as Cat Cat village (H'mong, Dao). Its cool climate year-round is itself a resource — a rare mountain retreat close to Hanoi.</p>
<h3>Ha Giang</h3>
<p>The <strong>Dong Van karst plateau</strong> (a UNESCO Global Geopark) and the <strong>Ma Pi Leng pass</strong> — one of Vietnam's "four great passes" — drive a road-trip / motorbike-loop style of tourism unlike anywhere else in the country.</p>
<h3>Dien Bien</h3>
<p>The <strong>Dien Bien Phu</strong> historical battlefield (1954) is a flagship of "red tourism" (du lịch về nguồn) — tourism built entirely on revolutionary history rather than scenery.</p>
<pre><code>Sample loop — "Vòng Tây Bắc":
 Hanoi -> Sapa (Lao Cai)      ~ 320 km, overnight train or road
       -> Ha Giang loop        ~ 300 km, multi-day motorbike loop
       -> (optional) Dien Bien ~ further west, historical add-on
       -> back to Hanoi
</code></pre>
<div class="callout"><span class="badge">Access defines the season</span> Northern mountain routes run on mountain roads with real landslide risk in the rainy season (Jun-Sep) — most operators shift these routes to a Sep-Apr window, making season a route-design variable, not an afterthought.</div>`,
    `<span class="eyebrow">TTD202 · Chương 2 · Bài 2.1</span>
<h2>Trung du &amp; miền núi phía Bắc</h2>
<h3>Sapa (Lào Cai)</h3>
<p>Ruộng bậc thang, <strong>Fansipan</strong> (nóc nhà Đông Dương, lên bằng cáp treo), và chợ vùng cao dân tộc thiểu số như bản Cát Cát (H'Mông, Dao). Khí hậu mát mẻ quanh năm chính là một tài nguyên — điểm nghỉ vùng núi hiếm có gần Hà Nội.</p>
<h3>Hà Giang</h3>
<p><strong>Cao nguyên đá Đồng Văn</strong> (Công viên địa chất toàn cầu UNESCO) và <strong>đèo Mã Pí Lèng</strong> — một trong "tứ đại đỉnh đèo" Việt Nam — tạo nên loại hình du lịch road-trip/vòng cung xe máy đặc trưng không nơi nào khác có.</p>
<h3>Điện Biên</h3>
<p>Di tích lịch sử <strong>Điện Biên Phủ</strong> (1954) là ngọn cờ đầu của "du lịch về nguồn" — du lịch dựng hoàn toàn trên lịch sử cách mạng, không phải cảnh quan.</p>
<pre><code>Tuyến mẫu — "Vòng Tây Bắc":
 Hà Nội -> Sapa (Lào Cai)     ~ 320 km, tàu đêm hoặc đường bộ
        -> Vòng cung Hà Giang  ~ 300 km, chạy xe máy nhiều ngày
        -> (tuỳ chọn) Điện Biên  xa hơn về phía Tây, điểm bổ sung lịch sử
        -> về Hà Nội
</code></pre>
<div class="callout"><span class="badge">Khả năng tiếp cận quyết định mùa vụ</span> Tuyến miền núi phía Bắc phụ thuộc đường núi có rủi ro sạt lở thật vào mùa mưa (tháng 6-9) — hầu hết tour đẩy tuyến này sang khung tháng 9-4, biến "mùa" thành biến số thiết kế tuyến, không phải chi tiết phụ.</div>`,
  ]]);

const c2q = quiz('ttd202-quiz-2', 'Quiz 2 — Miền núi phía Bắc|||Quiz 2 — Northern mountains', [
  { id: 'q1', question: 'Đỉnh núi cao nhất Việt Nam, lên bằng cáp treo từ Sapa, tên là?', options: ['Bà Nà', 'Fansipan', 'Mã Pí Lèng', 'Lang Biang'], correctIndex: 1, explanation: 'Fansipan (Lào Cai) — nóc nhà Đông Dương, có cáp treo từ Sapa.' },
  { id: 'q2', question: 'Cao nguyên đá Đồng Văn (Hà Giang) được UNESCO công nhận là gì?', options: ['Di sản thiên nhiên thế giới', 'Công viên địa chất toàn cầu', 'Di sản văn hoá phi vật thể', 'Khu dự trữ sinh quyển'], correctIndex: 1, explanation: 'Đồng Văn là Công viên địa chất toàn cầu UNESCO.' },
  { id: 'q3', question: 'Vì sao tuyến du lịch miền núi phía Bắc thường tránh mùa mưa (tháng 6-9)?', options: ['Vì giá phòng tăng', 'Vì rủi ro sạt lở đường núi', 'Vì lễ hội chỉ có mùa khô', 'Vì sân bay đóng cửa'], correctIndex: 1, explanation: 'Đường núi có rủi ro sạt lở thật trong mùa mưa, ảnh hưởng trực tiếp tới an toàn tuyến.' },
]);

const c3 = doc('ttd202-3-1-dong-bang-song-hong', '3.1 — Red River Delta & NE coast: Hanoi, Ha Long, Ninh Binh|||3.1 — ĐB sông Hồng & duyên hải Đông Bắc: Hà Nội, Hạ Long, Ninh Bình',
  'Hà Nội (phố cổ, di sản nghìn năm, cửa ngõ hàng không); Vịnh Hạ Long (di sản thiên nhiên thế giới); Ninh Bình (Tam Cốc, Tràng An).',
  [[
    `<span class="eyebrow">TTD202 · Chapter 3 · Lesson 3.1</span>
<h2>Red River Delta &amp; the Northeast coast</h2>
<h3>Hanoi — the gateway</h3>
<p>The Old Quarter, thousand-year-old temples, and French colonial architecture make Hanoi a heritage capital in its own right — and <strong>Noi Bai International Airport</strong> makes it the region's main gateway for both this region and the whole north.</p>
<h3>Ha Long Bay (Quang Ninh)</h3>
<p>A <strong>UNESCO World Heritage natural site</strong> — thousands of limestone karst islands rising from the sea. Cruise tourism dominates, split between day cruises and overnight boats.</p>
<h3>Ninh Binh</h3>
<p><strong>Trang An</strong> (a UNESCO mixed cultural-natural heritage site) and <strong>Tam Coc</strong> ("Ha Long Bay on land") — small-boat tours weaving through karst and rice paddy, often called Ha Long's inland twin.</p>
<pre><code>Destination     From Hanoi      Typical visit
Hanoi           —               Multi-day city stay
Ha Long Bay     ~ 165 km        1-2 day cruise
Ninh Binh       ~ 95 km         Day trip
</code></pre>
<div class="callout"><span class="badge">One region, three trip lengths</span> Hanoi (multi-day city stay), Ha Long (1-2 day cruise), Ninh Binh (day trip) — a textbook example of how one region, anchored by one hub, serves guests with completely different amounts of time.</div>`,
    `<span class="eyebrow">TTD202 · Chương 3 · Bài 3.1</span>
<h2>ĐB sông Hồng &amp; duyên hải Đông Bắc</h2>
<h3>Hà Nội — cửa ngõ</h3>
<p>Phố cổ, đền chùa nghìn năm tuổi, và kiến trúc Pháp cổ khiến Hà Nội tự thân là một cố đô di sản — và <strong>sân bay quốc tế Nội Bài</strong> khiến nơi này là cửa ngõ chính của cả vùng và cả miền Bắc.</p>
<h3>Vịnh Hạ Long (Quảng Ninh)</h3>
<p>Một <strong>di sản thiên nhiên thế giới UNESCO</strong> — hàng nghìn đảo đá vôi karst nhô lên từ biển. Du lịch du thuyền chiếm ưu thế, chia giữa tour ngày và tàu nghỉ đêm.</p>
<h3>Ninh Bình</h3>
<p><strong>Tràng An</strong> (di sản hỗn hợp văn hoá-thiên nhiên UNESCO) và <strong>Tam Cốc</strong> ("Vịnh Hạ Long trên cạn") — tour thuyền nhỏ len qua núi đá vôi và ruộng lúa, thường được gọi là "em song sinh nội địa" của Hạ Long.</p>
<pre><code>Điểm đến        Từ Hà Nội       Thời gian thăm điển hình
Hà Nội          —               Nghỉ nhiều ngày trong đô thị
Vịnh Hạ Long    ~ 165 km        Du thuyền 1-2 ngày
Ninh Bình       ~ 95 km         Đi trong ngày
</code></pre>
<div class="callout"><span class="badge">Một vùng, ba độ dài chuyến</span> Hà Nội (nghỉ nhiều ngày), Hạ Long (du thuyền 1-2 ngày), Ninh Bình (đi trong ngày) — ví dụ kinh điển cho việc một vùng, quanh một trung tâm, phục vụ được khách với lượng thời gian hoàn toàn khác nhau.</div>`,
  ]]);

const c3q = quiz('ttd202-quiz-3', 'Quiz 3 — ĐB sông Hồng & Đông Bắc|||Quiz 3 — Red River Delta & NE coast', [
  { id: 'q1', question: 'Sân bay nào là cửa ngõ chính của vùng ĐB sông Hồng & Đông Bắc?', options: ['Tân Sơn Nhất', 'Nội Bài', 'Đà Nẵng', 'Cam Ranh'], correctIndex: 1, explanation: 'Sân bay quốc tế Nội Bài (Hà Nội) là cửa ngõ chính của vùng và cả miền Bắc.' },
  { id: 'q2', question: 'Ninh Bình thường được gọi là gì so với Vịnh Hạ Long?', options: ['Vịnh Hạ Long trên cạn', 'Sa Pa thu nhỏ', 'Cố đô thứ hai', 'Đảo ngọc phương Bắc'], correctIndex: 0, explanation: 'Tam Cốc-Tràng An có cảnh núi đá vôi và thuyền tương tự Hạ Long nhưng trên cạn.' },
  { id: 'q3', question: 'Vì sao Hà Long thường được thăm theo hình thức du thuyền 1-2 ngày còn Ninh Bình là đi trong ngày?', options: ['Vì Ninh Bình xa Hà Nội hơn', 'Vì Hạ Long không có đường bộ', 'Vì Ninh Bình gần Hà Nội hơn và không cần ngủ trên đảo', 'Vì Hạ Long không cho khách nước ngoài'], correctIndex: 2, explanation: 'Ninh Bình gần Hà Nội (~95km) và tham quan bằng thuyền nhỏ trong ngày; Hạ Long xa hơn và trải nghiệm chính là ngủ đêm trên vịnh.' },
]);

const c4 = doc('ttd202-4-1-bac-trung-bo', '4.1 — North Central Coast: Phong Nha & Hue|||4.1 — Bắc Trung Bộ: Phong Nha & Huế',
  'Phong Nha-Kẻ Bàng (hang động lớn nhất thế giới); Huế (cố đô, lăng tẩm, nhã nhạc); con đường di sản miền Trung nối Phong Nha-Huế-Đà Nẵng.',
  [[
    `<span class="eyebrow">TTD202 · Chapter 4 · Lesson 4.1</span>
<h2>North Central Coast</h2>
<h3>Phong Nha-Ke Bang National Park (Quang Binh)</h3>
<p>A <strong>UNESCO natural heritage site</strong> built on cave tourism — home to <strong>Son Doong</strong>, the world's largest cave passage, and the more accessible Paradise Cave. This region is where adventure/cave tourism defines the whole product.</p>
<h3>Hue — the imperial capital</h3>
<p>The <strong>Complex of Hue Monuments</strong> (UNESCO World Heritage) — the Citadel, royal tombs along the Perfume River — plus <strong>Nha Nhac</strong> (royal court music, a UNESCO Intangible Cultural Heritage) and royal cuisine (ẩm thực cung đình).</p>
<h3>The Central Heritage Road</h3>
<p>"Con đường di sản miền Trung" deliberately strings <strong>Phong Nha → Hue → Da Nang/Hoi An → My Son</strong> into one multi-day corridor — one of Vietnam's most-marketed heritage routes.</p>
<pre><code>Sample route — Central Heritage Road (northern half):
 Phong Nha (caves) -> Hue (imperial capital) -> onward to Da Nang/Hoi An
</code></pre>
<div class="callout"><span class="badge">Nature + culture, same road</span> Bac Trung Bo is where marketing deliberately pairs a natural UNESCO site (caves) with a cultural one (an imperial capital) on the same corridor — a pairing that extends the average length of stay by giving two different reasons to travel the same road.</div>`,
    `<span class="eyebrow">TTD202 · Chương 4 · Bài 4.1</span>
<h2>Bắc Trung Bộ</h2>
<h3>Vườn quốc gia Phong Nha-Kẻ Bàng (Quảng Bình)</h3>
<p>Một <strong>di sản thiên nhiên thế giới UNESCO</strong> dựng trên du lịch hang động — nơi có <strong>Sơn Đoòng</strong>, hang động lớn nhất thế giới, và hang Thiên Đường dễ tiếp cận hơn. Đây là vùng mà du lịch mạo hiểm/hang động định hình toàn bộ sản phẩm.</p>
<h3>Huế — cố đô</h3>
<p><strong>Quần thể di tích Cố đô Huế</strong> (di sản thế giới UNESCO) — Đại Nội, các lăng tẩm dọc sông Hương — cùng <strong>Nhã nhạc</strong> (âm nhạc cung đình, di sản văn hoá phi vật thể UNESCO) và ẩm thực cung đình.</p>
<h3>Con đường di sản miền Trung</h3>
<p>"Con đường di sản miền Trung" chủ ý nối <strong>Phong Nha → Huế → Đà Nẵng/Hội An → Mỹ Sơn</strong> thành một hành lang nhiều ngày — một trong những tuyến di sản được quảng bá nhiều nhất Việt Nam.</p>
<pre><code>Tuyến mẫu — Con đường di sản miền Trung (nửa phía Bắc):
 Phong Nha (hang động) -> Huế (cố đô) -> tiếp nối Đà Nẵng/Hội An
</code></pre>
<div class="callout"><span class="badge">Tự nhiên + văn hoá, cùng một con đường</span> Bắc Trung Bộ là nơi việc quảng bá chủ ý ghép một di sản tự nhiên (hang động) với một di sản văn hoá (cố đô) trên cùng một hành lang — cách ghép này kéo dài thời gian lưu trú trung bình bằng cách cho khách hai lý do khác nhau để đi trên cùng con đường.</div>`,
  ]]);

const c4q = quiz('ttd202-quiz-4', 'Quiz 4 — Bắc Trung Bộ|||Quiz 4 — North Central Coast', [
  { id: 'q1', question: 'Hang động lớn nhất thế giới, nằm trong Phong Nha-Kẻ Bàng, tên là?', options: ['Hang Thiên Đường', 'Sơn Đoòng', 'Hang Sửng Sốt', 'Động Phong Nha'], correctIndex: 1, explanation: 'Sơn Đoòng (Quảng Bình) là hang động tự nhiên lớn nhất thế giới.' },
  { id: 'q2', question: 'Nhã nhạc cung đình Huế được UNESCO công nhận là loại di sản gì?', options: ['Di sản thiên nhiên', 'Di sản văn hoá phi vật thể', 'Công viên địa chất', 'Khu dự trữ sinh quyển'], correctIndex: 1, explanation: 'Nhã nhạc là di sản văn hoá phi vật thể đại diện của nhân loại (UNESCO).' },
  { id: 'q3', question: '"Con đường di sản miền Trung" chủ ý ghép loại tài nguyên nào với nhau?', options: ['Hai điểm biển liền kề', 'Tài nguyên tự nhiên (hang động) với tài nguyên văn hoá (cố đô)', 'Hai chợ nổi', 'Hai sân golf'], correctIndex: 1, explanation: 'Phong Nha (tự nhiên) nối với Huế (văn hoá) trên cùng hành lang, kéo dài lý do lưu trú.' },
]);

const c5 = doc('ttd202-5-1-duyen-hai-nam-trung-bo', '5.1 — South Central Coast: Da Nang, Hoi An, Nha Trang|||5.1 — Duyên hải Nam Trung Bộ: Đà Nẵng, Hội An, Nha Trang',
  'Đà Nẵng (biển, Bà Nà Hills, cầu Rồng, sân bay quốc tế); Hội An (phố cổ di sản); Nha Trang (vịnh biển, đảo, MICE/resort).',
  [[
    `<span class="eyebrow">TTD202 · Chapter 5 · Lesson 5.1</span>
<h2>South Central Coast</h2>
<h3>Da Nang</h3>
<p>A beach-resort city with My Khe beach, Ba Na Hills (the Golden Bridge), and Marble Mountains — plus a major international airport that feeds the whole corridor.</p>
<h3>Hoi An</h3>
<p>A <strong>UNESCO-listed ancient trading port</strong>, preserved almost intact — famous for its lantern festival, tailoring trade, and street food; only about 30 minutes from Da Nang.</p>
<h3>Nha Trang</h3>
<p>A separate hub further south, built on <strong>bay tourism</strong>: island-hopping, diving, and resort/MICE tourism around one of Vietnam's most sheltered coastal bays.</p>
<pre><code>Destination   Main product              Typical stay
Da Nang       Beach resort + theme park  3-4 days (hub)
Hoi An        Heritage old town          1-2 days (day trip or overnight)
Nha Trang     Bay/island + resort/MICE   3-5 days (separate hub)
</code></pre>
<div class="callout"><span class="badge">The Da Nang-Hoi An pairing</span> A near-perfect example of hub-and-satellite tourism: one international airport (Da Nang) feeding a cultural satellite (Hoi An) 30 minutes away, letting a single 3-day trip cover both beach and heritage.</div>`,
    `<span class="eyebrow">TTD202 · Chương 5 · Bài 5.1</span>
<h2>Duyên hải Nam Trung Bộ</h2>
<h3>Đà Nẵng</h3>
<p>Thành phố nghỉ dưỡng biển với bãi Mỹ Khê, Bà Nà Hills (Cầu Vàng), và Ngũ Hành Sơn — cộng thêm sân bay quốc tế lớn nuôi cả trục du lịch quanh đó.</p>
<h3>Hội An</h3>
<p>Một <strong>thương cảng cổ được UNESCO công nhận</strong>, gần như còn nguyên vẹn — nổi tiếng với lễ hội đèn lồng, nghề may đo, và ẩm thực đường phố; chỉ cách Đà Nẵng khoảng 30 phút.</p>
<h3>Nha Trang</h3>
<p>Một trung tâm riêng ở phía Nam hơn, dựng trên <strong>du lịch vịnh biển</strong>: khám phá đảo, lặn biển, và du lịch resort/MICE quanh một trong những vịnh biển kín gió nhất Việt Nam.</p>
<pre><code>Điểm đến      Sản phẩm chính            Thời gian ở điển hình
Đà Nẵng       Biển + công viên chủ đề    3-4 ngày (trung tâm)
Hội An        Phố cổ di sản             1-2 ngày (đi ngày hoặc nghỉ đêm)
Nha Trang     Vịnh/đảo + resort/MICE     3-5 ngày (trung tâm riêng)
</code></pre>
<div class="callout"><span class="badge">Cặp Đà Nẵng-Hội An</span> Một ví dụ gần như hoàn hảo cho mô hình trung tâm-vệ tinh: một sân bay quốc tế (Đà Nẵng) nuôi một vệ tinh văn hoá (Hội An) cách 30 phút, giúp một chuyến 3 ngày vừa có biển vừa có di sản.</div>`,
  ]]);

const c5q = quiz('ttd202-quiz-5', 'Quiz 5 — Duyên hải Nam Trung Bộ|||Quiz 5 — South Central Coast', [
  { id: 'q1', question: 'Hội An cách Đà Nẵng khoảng bao xa, và vì sao đây là cặp trung tâm-vệ tinh điển hình?', options: ['200 km, phải bay riêng', '~30 phút, dùng chung sân bay quốc tế Đà Nẵng', '5 phút đi bộ', 'Không kết nối được với nhau'], correctIndex: 1, explanation: 'Hội An chỉ cách Đà Nẵng ~30 phút và dùng chung sân bay quốc tế, nên một chuyến ngắn có thể ghép cả hai.' },
  { id: 'q2', question: 'Sản phẩm du lịch chính của Nha Trang là gì?', options: ['Di sản cố đô', 'Vịnh biển, đảo, resort/MICE', 'Hang động mạo hiểm', 'Cao nguyên khí hậu mát'], correctIndex: 1, explanation: 'Nha Trang dựng trên vịnh biển kín gió: đảo, lặn biển, resort và MICE.' },
  { id: 'q3', question: 'Hội An được UNESCO công nhận vì lý do gì?', options: ['Bãi biển đẹp nhất', 'Thương cảng cổ được bảo tồn gần nguyên vẹn', 'Có sân bay lớn', 'Là thủ phủ cà phê'], correctIndex: 1, explanation: 'Hội An là di sản văn hoá thế giới nhờ phố cổ - thương cảng được bảo tồn tốt.' },
]);

const c6 = doc('ttd202-6-1-tay-nguyen', '6.1 — Central Highlands: Da Lat & Buon Ma Thuot|||6.1 — Tây Nguyên: Đà Lạt & Buôn Ma Thuột',
  'Đà Lạt (khí hậu ôn đới, hoa, đồi chè); Buôn Ma Thuột (thủ phủ cà phê, không gian văn hoá cồng chiêng Tây Nguyên); du lịch cao nguyên.',
  [[
    `<span class="eyebrow">TTD202 · Chapter 6 · Lesson 6.1</span>
<h2>Central Highlands</h2>
<h3>Da Lat (Lam Dong)</h3>
<p>A hill-station climate — cool and temperate at low latitude, a legacy of French colonial planning — built around flower farms, pine forests, and now honeymoon and MICE tourism.</p>
<h3>Buon Ma Thuot (Dak Lak)</h3>
<p>Vietnam's <strong>coffee capital</strong>: coffee-farm tours anchor the local economy, alongside the <strong>Space of Gong Culture</strong> of the E De and M'nong ethnic groups — a UNESCO Intangible Cultural Heritage.</p>
<h3>Highland eco/culture tourism</h3>
<p>Cool climate is the core resource here — but ethnic minority cultural tourism must be managed for genuine community benefit-sharing, not staged spectacle.</p>
<div class="callout"><span class="badge">Climate as the resource</span> Da Lat's entire tourism identity rests on ONE resource that doesn't exist anywhere near it — cool weather at low latitude. That single fact explains why highland tourism concentrates so heavily on a handful of towns rather than spreading evenly.</div>`,
    `<span class="eyebrow">TTD202 · Chương 6 · Bài 6.1</span>
<h2>Tây Nguyên</h2>
<h3>Đà Lạt (Lâm Đồng)</h3>
<p>Khí hậu tiểu vùng ôn đới — mát mẻ ở vĩ độ thấp, di sản quy hoạch từ thời Pháp — được xây quanh làng hoa, rừng thông, và ngày nay là du lịch honeymoon &amp; MICE.</p>
<h3>Buôn Ma Thuột (Đắk Lắk)</h3>
<p><strong>Thủ phủ cà phê</strong> Việt Nam: tour nông trại cà phê là trục kinh tế địa phương, cùng <strong>Không gian văn hoá cồng chiêng Tây Nguyên</strong> của người Ê Đê, M'Nông — di sản văn hoá phi vật thể UNESCO.</p>
<h3>Du lịch sinh thái/văn hoá cao nguyên</h3>
<p>Khí hậu mát là tài nguyên cốt lõi ở đây — nhưng du lịch văn hoá dân tộc thiểu số phải được quản lý để chia sẻ lợi ích thật cho cộng đồng, không chỉ là trình diễn dàn dựng.</p>
<div class="callout"><span class="badge">Khí hậu chính là tài nguyên</span> Toàn bộ bản sắc du lịch Đà Lạt dựa trên MỘT tài nguyên không nơi nào gần đó có — thời tiết mát ở vĩ độ thấp. Chỉ một sự thật này giải thích vì sao du lịch cao nguyên tập trung đậm vào một số ít thị trấn thay vì lan đều.</div>`,
  ]]);

const c6q = quiz('ttd202-quiz-6', 'Quiz 6 — Tây Nguyên|||Quiz 6 — Central Highlands', [
  { id: 'q1', question: 'Tài nguyên cốt lõi làm nên bản sắc du lịch Đà Lạt là gì?', options: ['Bãi biển', 'Khí hậu mát mẻ ở vĩ độ thấp', 'Hang động', 'Cảng biển'], correctIndex: 1, explanation: 'Đà Lạt là điểm nghỉ mát hiếm có vì khí hậu ôn đới dù ở vĩ độ thấp.' },
  { id: 'q2', question: 'Buôn Ma Thuột được biết đến là thủ phủ của ngành gì?', options: ['Chè', 'Cà phê', 'Cao su', 'Muối'], correctIndex: 1, explanation: 'Buôn Ma Thuột (Đắk Lắk) là thủ phủ cà phê Việt Nam.' },
  { id: 'q3', question: 'Không gian văn hoá cồng chiêng Tây Nguyên gắn với dân tộc nào và được công nhận là gì?', options: ['Ê Đê, M\'Nông — di sản văn hoá phi vật thể UNESCO', 'H\'Mông — di sản thiên nhiên', 'Kinh — di sản hỗn hợp', 'Chăm — công viên địa chất'], correctIndex: 0, explanation: 'Cồng chiêng của người Ê Đê, M\'Nông là di sản văn hoá phi vật thể UNESCO.' },
]);

const c7 = doc('ttd202-7-1-dong-nam-bo', '7.1 — Southeast: Ho Chi Minh City, Vung Tau, Con Dao|||7.1 — Đông Nam Bộ: TP.HCM, Vũng Tàu, Côn Đảo',
  'TP.HCM (đô thị, MICE, di tích chiến tranh); Vũng Tàu (biển gần Sài Gòn); Côn Đảo (di tích lịch sử + biển đảo bảo tồn); cửa ngõ phía Nam.',
  [[
    `<span class="eyebrow">TTD202 · Chapter 7 · Lesson 7.1</span>
<h2>Southeast Vietnam</h2>
<h3>Ho Chi Minh City</h3>
<p>Vietnam's largest urban tourism hub — MICE, shopping, war-history sites (the Cu Chi Tunnels, the War Remnants Museum), and Southern cuisine. <strong>Tan Son Nhat Airport</strong> is the southern gateway for the whole region and beyond.</p>
<h3>Vung Tau</h3>
<p>A weekend beach getaway roughly 2 hours from HCMC by road — <strong>proximity</strong>, not resource quality, is what drives its visitor volume.</p>
<h3>Con Dao</h3>
<p>A historical prison complex (war and political history) paired with one of Vietnam's <strong>best-preserved marine ecosystems</strong> — a rare combination of "dark tourism" and conservation-based ecotourism on the same island.</p>
<pre><code>Destination     Distance / access        Core logic
Ho Chi Minh City Tan Son Nhat airport      Urban hub, MICE, history
Vung Tau         ~ 2h road from HCMC       Weekend proximity
Con Dao          Short flight, isolated    Protected isolation
</code></pre>
<div class="callout"><span class="badge">Distance changes the product</span> Vung Tau's tourism is a function of 2-hour proximity to ~9 million HCMC residents; Con Dao's is a function of protected isolation. Same region, opposite logics.</div>`,
    `<span class="eyebrow">TTD202 · Chương 7 · Bài 7.1</span>
<h2>Đông Nam Bộ</h2>
<h3>TP.HCM</h3>
<p>Trung tâm du lịch đô thị lớn nhất Việt Nam — MICE, mua sắm, di tích chiến tranh (Địa đạo Củ Chi, Bảo tàng Chứng tích Chiến tranh), và ẩm thực miền Nam. <strong>Sân bay Tân Sơn Nhất</strong> là cửa ngõ phía Nam cho cả vùng và xa hơn.</p>
<h3>Vũng Tàu</h3>
<p>Điểm nghỉ biển cuối tuần cách TP.HCM khoảng 2 giờ đi đường bộ — <strong>khoảng cách gần</strong>, không phải chất lượng tài nguyên, là thứ tạo ra lượng khách lớn của nơi này.</p>
<h3>Côn Đảo</h3>
<p>Quần thể di tích lịch sử (nhà tù, lịch sử cách mạng) kết hợp với một trong những <strong>hệ sinh thái biển được bảo tồn tốt nhất</strong> Việt Nam — sự kết hợp hiếm có giữa "du lịch tưởng niệm" và du lịch sinh thái bảo tồn trên cùng một đảo.</p>
<pre><code>Điểm đến        Khoảng cách/tiếp cận      Logic cốt lõi
TP.HCM          Sân bay Tân Sơn Nhất       Trung tâm đô thị, MICE, lịch sử
Vũng Tàu        ~2 giờ đường bộ từ TP.HCM  Gần để đi cuối tuần
Côn Đảo         Bay ngắn, biệt lập         Biệt lập được bảo tồn
</code></pre>
<div class="callout"><span class="badge">Khoảng cách làm thay đổi sản phẩm</span> Du lịch Vũng Tàu là hàm số của khoảng cách 2 giờ tới ~9 triệu dân TP.HCM; Côn Đảo là hàm số của sự biệt lập được bảo tồn. Cùng một vùng, hai logic đối lập.</div>`,
  ]]);

const c7q = quiz('ttd202-quiz-7', 'Quiz 7 — Đông Nam Bộ|||Quiz 7 — Southeast', [
  { id: 'q1', question: 'Sân bay nào là cửa ngõ phía Nam của Việt Nam?', options: ['Nội Bài', 'Tân Sơn Nhất', 'Đà Nẵng', 'Phú Quốc'], correctIndex: 1, explanation: 'Sân bay Tân Sơn Nhất (TP.HCM) là cửa ngõ hàng không chính của miền Nam.' },
  { id: 'q2', question: 'Yếu tố chính tạo ra lượng khách lớn cho Vũng Tàu là gì?', options: ['Di sản UNESCO', 'Khoảng cách gần TP.HCM (~2 giờ đường bộ)', 'Khí hậu ôn đới', 'Cà phê đặc sản'], correctIndex: 1, explanation: 'Vũng Tàu hút khách cuối tuần chủ yếu nhờ gần TP.HCM, không phải vì tài nguyên đặc biệt.' },
  { id: 'q3', question: 'Côn Đảo kết hợp hai loại du lịch nào trên cùng một đảo?', options: ['Biển nghỉ dưỡng + MICE', 'Di tích lịch sử (dark tourism) + sinh thái biển bảo tồn', 'Cao nguyên + hang động', 'Phố cổ + chợ nổi'], correctIndex: 1, explanation: 'Côn Đảo có cả di tích nhà tù lịch sử và hệ sinh thái biển được bảo tồn tốt.' },
]);

const c8 = doc('ttd202-8-1-dbscl-va-thiet-ke-tuyen', '8.1 — Mekong Delta & designing multi-region routes|||8.1 — Đồng bằng sông Cửu Long & thiết kế tuyến du lịch liên vùng',
  'Cần Thơ (chợ nổi Cái Răng), Mỹ Tho/Bến Tre (miệt vườn); nguyên tắc ghép nhiều vùng thành một tuyến hoàn chỉnh — hub, thứ tự, khoảng cách.',
  [[
    `<span class="eyebrow">TTD202 · Chapter 8 · Lesson 8.1</span>
<h2>Mekong Delta &amp; designing multi-region routes</h2>
<h3>Mekong Delta river tourism</h3>
<p><strong>Cai Rang floating market</strong> (Can Tho), and homestay/orchard tourism ("miệt vườn") around My Tho and Ben Tre — boat-based experiences where the river is both the resource and the transport.</p>
<h3>Designing a multi-region route</h3>
<p>Three design principles carry across every region in this course:</p>
<ul>
<li><strong>Pick a hub</strong> with an airport or rail connection (Hanoi, Da Nang, Ho Chi Minh City).</li>
<li><strong>Sequence destinations</strong> to minimize backtracking — follow the geography, don't zig-zag.</li>
<li><strong>Match trip length to region count</strong> — most "Vietnam in 10 days" itineraries only cover 3 of the 7 regions well; trying to cover all 7 in 10 days produces a shallow, exhausting route.</li>
</ul>
<pre><code>Sample national backbone route (the classic "north-to-south"):
 Hanoi (R2) -> Ha Long (R2) -> Hue/Da Nang/Hoi An (R3/R4)
            -> Ho Chi Minh City (R6) -> Mekong Delta (R7)
</code></pre>
<div class="callout"><span class="badge">The final skill of the course</span> Every earlier chapter gave you one region's resources. This chapter is the one skill that turns 7 separate regions into a single sellable itinerary — the actual job of a tour designer.</div>`,
    `<span class="eyebrow">TTD202 · Chương 8 · Bài 8.1</span>
<h2>ĐB sông Cửu Long &amp; thiết kế tuyến liên vùng</h2>
<h3>Du lịch sông nước ĐBSCL</h3>
<p><strong>Chợ nổi Cái Răng</strong> (Cần Thơ), và du lịch miệt vườn/homestay quanh Mỹ Tho, Bến Tre — trải nghiệm trên thuyền, nơi con sông vừa là tài nguyên vừa là phương tiện di chuyển.</p>
<h3>Thiết kế một tuyến liên vùng</h3>
<p>Ba nguyên tắc thiết kế xuyên suốt mọi vùng trong môn học này:</p>
<ul>
<li><strong>Chọn một trung tâm (hub)</strong> có sân bay hoặc đường sắt (Hà Nội, Đà Nẵng, TP.HCM).</li>
<li><strong>Sắp thứ tự điểm đến</strong> để tránh đi ngược lại — bám theo địa lý, không zic-zac.</li>
<li><strong>Khớp thời gian chuyến đi với số vùng</strong> — hầu hết tuyến "Việt Nam 10 ngày" chỉ đi tốt được 3/7 vùng; cố nhồi cả 7 vùng vào 10 ngày cho ra một tuyến hời hợt, kiệt sức.</li>
</ul>
<pre><code>Tuyến xương sống quốc gia mẫu (kiểu "Bắc vào Nam" kinh điển):
 Hà Nội (V2) -> Hạ Long (V2) -> Huế/Đà Nẵng/Hội An (V3/V4)
             -> TP.HCM (V6) -> ĐB sông Cửu Long (V7)
</code></pre>
<div class="callout"><span class="badge">Kỹ năng chốt của môn học</span> Mọi chương trước cho bạn tài nguyên của một vùng. Chương này là kỹ năng duy nhất biến 7 vùng riêng lẻ thành một tuyến bán được — công việc thật của người thiết kế tour.</div>`,
  ]]);

const c8q = quiz('ttd202-quiz-8', 'Quiz 8 — ĐBSCL & thiết kế tuyến|||Quiz 8 — Mekong Delta & route design', [
  { id: 'q1', question: 'Chợ nổi Cái Răng nằm ở tỉnh/thành nào?', options: ['Cần Thơ', 'Bến Tre', 'Mỹ Tho', 'Cà Mau'], correctIndex: 0, explanation: 'Chợ nổi Cái Răng là điểm đến du lịch sông nước nổi tiếng của Cần Thơ.' },
  { id: 'q2', question: 'Nguyên tắc nào KHÔNG thuộc ba nguyên tắc thiết kế tuyến liên vùng trong bài?', options: ['Chọn một trung tâm có sân bay/đường sắt', 'Sắp thứ tự điểm đến tránh đi ngược lại', 'Khớp thời gian chuyến đi với số vùng', 'Luôn đi máy bay giữa mọi điểm đến'], correctIndex: 3, explanation: 'Bài chỉ nêu 3 nguyên tắc: chọn hub, sắp thứ tự theo địa lý, khớp thời gian với số vùng — không có nguyên tắc "luôn đi máy bay".' },
  { id: 'q3', question: 'Vì sao nhồi cả 7 vùng du lịch vào một chuyến 10 ngày thường không hiệu quả?', options: ['Vì luật cấm', 'Vì tạo ra tuyến hời hợt, kiệt sức thay vì trải nghiệm sâu', 'Vì 7 vùng không có đường nối nhau', 'Vì chỉ có 3 vùng có sân bay'], correctIndex: 1, explanation: 'Thời gian chuyến đi phải khớp với số vùng có thể đi tốt — cố nhồi hết dẫn tới tuyến hời hợt.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'TTD202',
    slug: 'ttd202-tourism-destinations-and-routes-of-vietnam',
    title: 'Tourism destinations and routes of Vietnam',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/TTD202.webp',
    shortDescription: 'Vietnam\'s tourism resources & 7 tourism regions — Northern mountains, Red River Delta & Ha Long, Central heritage & beach coast, Central Highlands, Southeast, Mekong Delta — plus multi-region route design. Bilingual, with route tables & quizzes.|||Tài nguyên & 7 vùng du lịch Việt Nam — miền núi phía Bắc, ĐB sông Hồng & Hạ Long, duyên hải di sản & biển miền Trung, Tây Nguyên, Đông Nam Bộ, ĐB sông Cửu Long — và thiết kế tuyến liên vùng. Song ngữ, có bảng tuyến & quiz.',
    description: 'Môn <strong>TTD202 — Tourism Destinations and Routes of Vietnam</strong> (khối Quản trị Kinh doanh — Du lịch, kỳ 4) học địa lý du lịch Việt Nam theo <strong>7 vùng du lịch</strong>: tài nguyên &amp; phân vùng → miền núi phía Bắc (Sapa, Hà Giang, Điện Biên) → ĐB sông Hồng &amp; duyên hải Đông Bắc (Hà Nội, Hạ Long, Ninh Bình) → Bắc Trung Bộ (Phong Nha, Huế) → duyên hải Nam Trung Bộ (Đà Nẵng, Hội An, Nha Trang) → Tây Nguyên (Đà Lạt, Buôn Ma Thuột) → Đông Nam Bộ (TP.HCM, Vũng Tàu, Côn Đảo) → ĐB sông Cửu Long &amp; thiết kế tuyến liên vùng. Bám giáo trình FLM (Tourism Geography — Hall &amp; Page; Địa lý Du lịch Việt Nam — Nguyễn Minh Tuệ; tài liệu VNAT), song ngữ, có bảng tuyến/lịch trình và quiz mỗi chương.',
    whatYouLearn: 'Tài nguyên du lịch tự nhiên/nhân văn & tiêu chí phân vùng; 7 vùng du lịch Việt Nam và sản phẩm du lịch đặc trưng mỗi vùng; các điểm đến trọng điểm và di sản UNESCO theo vùng (Sapa, Hà Giang, Hạ Long, Tràng An, Phong Nha, Huế, Hội An, Nha Trang, Đà Lạt, Côn Đảo, ĐBSCL); nguyên tắc thiết kế tuyến du lịch liên vùng — chọn hub, sắp thứ tự điểm đến, khớp thời gian với số vùng.',
    requirements: 'Không yêu cầu kiến thức trước. Nên có bản đồ Việt Nam (giấy hoặc Google Maps) để đối chiếu vị trí các vùng và điểm đến khi học.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình Địa lý Du lịch VN, sách Tourism Geography, tài liệu VNAT, công cụ thiết kế tuyến, lộ trình tự học.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Tài nguyên du lịch tự nhiên/nhân văn; 7 vùng du lịch Việt Nam.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan tài nguyên & 7 vùng|||Chapter 1 — Resources & the 7 regions', description: 'Phân loại tài nguyên; tiêu chí & bản đồ 7 vùng du lịch.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Trung du & miền núi phía Bắc|||Chapter 2 — Northern midlands & mountains', description: 'Sapa, Hà Giang, Điện Biên; vòng cung Tây Bắc.', lessons: [c2, c2q] },
    { title: 'Chương 3 — ĐB sông Hồng & duyên hải Đông Bắc|||Chapter 3 — Red River Delta & NE coast', description: 'Hà Nội, Hạ Long, Ninh Bình.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Bắc Trung Bộ|||Chapter 4 — North Central Coast', description: 'Phong Nha, Huế; con đường di sản miền Trung.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Duyên hải Nam Trung Bộ|||Chapter 5 — South Central Coast', description: 'Đà Nẵng, Hội An, Nha Trang.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Tây Nguyên|||Chapter 6 — Central Highlands', description: 'Đà Lạt, Buôn Ma Thuột; du lịch cao nguyên.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Đông Nam Bộ|||Chapter 7 — Southeast', description: 'TP.HCM, Vũng Tàu, Côn Đảo.', lessons: [c7, c7q] },
    { title: 'Chương 8 — ĐB sông Cửu Long & tuyến liên vùng|||Chapter 8 — Mekong Delta & route design', description: 'Cần Thơ, miệt vườn; nguyên tắc thiết kế tuyến liên vùng.', lessons: [c8, c8q] },
  ],
};
