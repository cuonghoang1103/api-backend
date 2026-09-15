/**
 * GAD201 — Guest and Audience Experience Design. Giáo trình FLM (tham khảo):
 * Pine & Gilmore "The Experience Economy"; Schmitt "Customer Experience
 * Management"; Rossman "Designing Experiences". 8 chương: kinh tế trải
 * nghiệm, persona, journey map, touchpoint/moments of truth, servicescape
 * đa giác quan, cá nhân hoá & công nghệ, đo lường (NPS/CSAT/CES), phục hồi
 * dịch vụ & xu hướng. Song ngữ + ví dụ + bài tập.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('gad201-0-1-overview', 'Course overview: Guest & audience experience design|||Tổng quan: Thiết kế trải nghiệm khách hàng & khán giả',
  'Kinh tế trải nghiệm là gì; vì sao trải nghiệm là lợi thế cạnh tranh; lộ trình 8 chương từ nền tảng lý thuyết đến đo lường và quản trị trải nghiệm.',
  [[
    `<span class="eyebrow">GAD201 · Lesson 0.1 · Overview</span>
<h2>Guest &amp; Audience Experience Design</h2>
<p class="lead">This course teaches you to <strong>design experiences on purpose</strong> — for guests (hotels, restaurants, retail), audiences (events, shows, exhibitions) and customers of any service. You will learn the theory behind why experiences create value, and the practical tools to research, map, design, and measure them.</p>
<h3>Why experience, not just service</h3>
<p>Two businesses can sell the exact same product yet leave completely different memories. A coffee shop that just serves coffee competes on price; one that stages a ritual around it can charge more and be remembered. <strong>Designed experience is a competitive advantage that is hard to copy</strong> — it lives in details, not in the product spec.</p>
<h3>Roadmap</h3>
<p>Experience economy foundations &amp; CX definitions → understanding customers &amp; personas → customer journey mapping → touchpoints &amp; moments of truth → multisensory experience &amp; servicescape → personalization &amp; technology → measuring experience (NPS/CSAT/CES) → service recovery, CX governance &amp; trends.</p>`,
    `<span class="eyebrow">GAD201 · Bài 0.1 · Tổng quan</span>
<h2>Thiết kế trải nghiệm Khách hàng &amp; Khán giả</h2>
<p class="lead">Môn này dạy bạn <strong>thiết kế trải nghiệm một cách có chủ đích</strong> — cho khách (khách sạn, nhà hàng, bán lẻ), khán giả (sự kiện, show, triển lãm) và khách hàng của bất kỳ dịch vụ nào. Bạn sẽ học lý thuyết vì sao trải nghiệm tạo ra giá trị, và các công cụ thực hành để nghiên cứu, lập bản đồ, thiết kế và đo lường chúng.</p>
<h3>Vì sao là trải nghiệm, không chỉ dịch vụ</h3>
<p>Hai doanh nghiệp có thể bán đúng một sản phẩm nhưng để lại hai ký ức hoàn toàn khác nhau. Một quán cà phê chỉ bán cà phê thì cạnh tranh bằng giá; một quán dựng lên cả một nghi thức quanh ly cà phê thì tính giá cao hơn và được nhớ lâu. <strong>Trải nghiệm được thiết kế có chủ đích là lợi thế cạnh tranh khó sao chép</strong> — nó nằm trong từng chi tiết, không nằm trong bản đặc tả sản phẩm.</p>
<h3>Lộ trình</h3>
<p>Nền tảng kinh tế trải nghiệm &amp; định nghĩa CX → thấu hiểu khách hàng &amp; persona → bản đồ hành trình khách hàng → điểm chạm &amp; khoảnh khắc quyết định → trải nghiệm đa giác quan &amp; servicescape → cá nhân hoá &amp; công nghệ → đo lường trải nghiệm (NPS/CSAT/CES) → phục hồi dịch vụ, quản trị trải nghiệm &amp; xu hướng.</p>`,
  ]]);

const c1 = doc('gad201-1-1-experience-economy', '1.1 — The experience economy & customer experience|||1.1 — Kinh tế trải nghiệm & trải nghiệm khách hàng',
  'Bốn cấp độ giá trị kinh tế (Pine & Gilmore); Bốn cõi trải nghiệm 4E; định nghĩa Customer Experience/Guest Experience/Audience Experience.',
  [[
    `<span class="eyebrow">GAD201 · Chapter 1 · Lesson 1.1</span>
<h2>The experience economy &amp; customer experience</h2>
<h3>Four levels of economic value</h3>
<p>Pine &amp; Gilmore (<em>The Experience Economy</em>, 1998) argue that as an economy develops, businesses climb a value ladder: <strong>commodities</strong> (coffee beans) → <strong>goods</strong> (packaged coffee) → <strong>services</strong> (a cup of coffee made for you) → <strong>experiences</strong> (a themed cafe visit worth queuing for). Each step charges more, because the offer becomes more personal and memorable.</p>
<pre><code>Commodities -> Goods -> Services -> Experiences -> Transformations
(cheapest, undifferentiated)          (highest value, unique, memorable)
</code></pre>
<h3>The Four Realms (4Es)</h3>
<p>A rich experience is designed along two axes: <strong>participation</strong> (passive vs active) and <strong>connection</strong> (absorption vs immersion). This gives four realms — <strong>Entertainment</strong> (passive, absorb — watching a show), <strong>Educational</strong> (active, absorb — a workshop), <strong>Escapist</strong> (active, immerse — a theme park ride), <strong>Esthetic</strong> (passive, immerse — standing inside a beautiful space). The best experiences deliberately blend more than one realm.</p>
<h3>Customer / Guest / Audience experience</h3>
<ul>
<li><strong>Customer Experience (CX)</strong> — the sum of every perception a customer forms across all interactions with a brand.</li>
<li><strong>Guest experience</strong> — CX in hospitality (hotel, restaurant) where the person is physically hosted.</li>
<li><strong>Audience experience</strong> — CX for people who gather to watch or attend (events, exhibitions, shows), often shared and social.</li>
</ul>
<div class="callout"><span class="badge">Design intent</span> An experience is not something that just happens around a service — it has to be staged on purpose, with a theme, a script, and attention to every cue the guest notices.</div>`,
    `<span class="eyebrow">GAD201 · Chương 1 · Bài 1.1</span>
<h2>Kinh tế trải nghiệm &amp; trải nghiệm khách hàng</h2>
<h3>Bốn cấp độ giá trị kinh tế</h3>
<p>Pine &amp; Gilmore (<em>The Experience Economy</em>, 1998) cho rằng khi kinh tế phát triển, doanh nghiệp leo dần một nấc thang giá trị: <strong>hàng hoá thô</strong> (hạt cà phê) → <strong>sản phẩm</strong> (cà phê đóng gói) → <strong>dịch vụ</strong> (một ly cà phê pha cho bạn) → <strong>trải nghiệm</strong> (một buổi ghé quán theo chủ đề đáng để xếp hàng chờ). Mỗi bậc tính giá cao hơn, vì lời chào bán trở nên cá nhân hoá và đáng nhớ hơn.</p>
<pre><code>Hàng hoá thô -> Sản phẩm -> Dịch vụ -> Trải nghiệm -> Chuyển hoá
(rẻ nhất, không khác biệt)              (giá trị cao nhất, độc đáo, đáng nhớ)
</code></pre>
<h3>Bốn cõi trải nghiệm (4E)</h3>
<p>Một trải nghiệm phong phú được thiết kế theo hai trục: <strong>mức tham gia</strong> (chủ động vs bị động) và <strong>mức kết nối</strong> (thẩm thấu vs hoà mình). Từ đó có bốn cõi — <strong>Giải trí</strong> (bị động, thẩm thấu — xem một show), <strong>Giáo dục</strong> (chủ động, thẩm thấu — một workshop), <strong>Thoát ly</strong> (chủ động, hoà mình — chơi tàu lượn), <strong>Thẩm mỹ</strong> (bị động, hoà mình — đứng trong một không gian đẹp). Trải nghiệm tốt nhất thường trộn nhiều hơn một cõi có chủ đích.</p>
<h3>Trải nghiệm khách hàng / khách / khán giả</h3>
<ul>
<li><strong>Customer Experience (CX)</strong> — tổng hợp mọi cảm nhận khách hàng hình thành qua tất cả tương tác với một thương hiệu.</li>
<li><strong>Trải nghiệm khách (guest experience)</strong> — CX trong ngành khách sạn/lưu trú/ẩm thực, nơi người đó được đón tiếp trực tiếp.</li>
<li><strong>Trải nghiệm khán giả (audience experience)</strong> — CX cho người tập trung xem hoặc tham dự (sự kiện, triển lãm, show), thường mang tính chia sẻ và xã hội.</li>
</ul>
<div class="callout"><span class="badge">Chủ đích thiết kế</span> Trải nghiệm không tự nhiên có quanh một dịch vụ — nó phải được dàn dựng có chủ đích, có chủ đề, có kịch bản, và chú ý tới từng dấu hiệu mà khách nhận ra.</div>`,
  ]]);

const c1q = quiz('gad201-quiz-1', 'Quiz 1 — Experience economy|||Quiz 1 — Kinh tế trải nghiệm', [
  { id: 'q1', question: 'Theo Pine & Gilmore, thứ tự đúng của bốn cấp độ giá trị kinh tế là?', options: ['Dịch vụ → hàng hoá thô → sản phẩm → trải nghiệm', 'Hàng hoá thô → sản phẩm → dịch vụ → trải nghiệm', 'Trải nghiệm → sản phẩm → dịch vụ → hàng hoá thô', 'Sản phẩm → trải nghiệm → dịch vụ → hàng hoá thô'], correctIndex: 1, explanation: 'Giá trị leo thang từ hàng hoá thô lên sản phẩm, dịch vụ, rồi trải nghiệm — càng cá nhân hoá càng đáng nhớ, càng tính giá cao.' },
  { id: 'q2', question: 'Một buổi workshop đòi người tham dự chủ động thực hành và tập trung tiếp thu kiến thức thuộc cõi trải nghiệm nào trong mô hình 4E?', options: ['Giải trí (Entertainment)', 'Giáo dục (Educational)', 'Thoát ly (Escapist)', 'Thẩm mỹ (Esthetic)'], correctIndex: 1, explanation: 'Cõi Giáo dục nằm ở trục tham gia chủ động + kết nối theo kiểu thẩm thấu kiến thức.' },
  { id: 'q3', question: '"Audience experience" khác "guest experience" chủ yếu ở điểm nào?', options: ['Audience experience không liên quan tới CX', 'Guest experience chỉ áp dụng cho sản phẩm số', 'Audience experience gắn với người tập trung xem/tham dự và thường mang tính chia sẻ, còn guest experience gắn với người được đón tiếp trực tiếp', 'Hai khái niệm hoàn toàn giống nhau, chỉ khác tên gọi'], correctIndex: 2, explanation: 'Guest experience thiên về đón tiếp (khách sạn, nhà hàng); audience experience thiên về tụ hội xem/tham dự (sự kiện, show, triển lãm).' },
]);

const c2 = doc('gad201-2-1-understanding-customers-personas', '2.1 — Understanding customers & personas|||2.1 — Thấu hiểu khách hàng & persona',
  'Nhu cầu, kỳ vọng, nhận thức của khách hàng; persona (thành phần); empathy map; phân khúc phục vụ thiết kế trải nghiệm.',
  [[
    `<span class="eyebrow">GAD201 · Chapter 2 · Lesson 2.1</span>
<h2>Understanding customers &amp; personas</h2>
<h3>Needs, expectations, perception</h3>
<p>Experience quality is judged against <strong>expectations</strong>, not against an absolute standard — the same wait time feels fine at a street food stall and unacceptable at a fine-dining restaurant. Design starts by mapping what a specific guest type <em>needs</em> (functional), <em>expects</em> (based on price/brand promises) and how they <em>perceive</em> cues (lighting, staff tone, wait time) — often unconsciously.</p>
<h3>What a persona is</h3>
<p>A <strong>persona</strong> is a fictional, research-based archetype representing one segment of real guests/customers. It turns a spreadsheet of survey data into a person the whole team can design for.</p>
<ul>
<li><strong>Profile</strong> — name, photo, demographics, role/occupation.</li>
<li><strong>Goals &amp; motivations</strong> — what this person is trying to achieve by using the service.</li>
<li><strong>Pain points &amp; frustrations</strong> — what currently breaks the experience for them.</li>
<li><strong>Behavior &amp; context</strong> — how, when, where, and with whom they use the service.</li>
</ul>
<h3>Empathy map</h3>
<p>An <strong>empathy map</strong> organizes research around four quadrants for a persona: what they <em>think &amp; feel</em>, what they <em>see</em>, what they <em>hear</em>, and what they <em>say &amp; do</em> — surfacing gaps between what people say and what they actually do.</p>
<div class="callout"><span class="badge">Design tie-in</span> Personas and segmentation are not marketing decoration — they are the input every later chapter builds on: the journey map, the touchpoints, and the metrics all get defined <em>per persona</em>.</div>`,
    `<span class="eyebrow">GAD201 · Chương 2 · Bài 2.1</span>
<h2>Thấu hiểu khách hàng &amp; persona</h2>
<h3>Nhu cầu, kỳ vọng, nhận thức</h3>
<p>Chất lượng trải nghiệm được đánh giá dựa trên <strong>kỳ vọng</strong>, không phải một chuẩn tuyệt đối — cùng một thời gian chờ có thể ổn ở quán ăn vặt nhưng không thể chấp nhận ở nhà hàng cao cấp. Thiết kế bắt đầu bằng việc lập bản đồ điều một nhóm khách cụ thể <em>cần</em> (chức năng), <em>kỳ vọng</em> (dựa trên giá/lời hứa thương hiệu) và cách họ <em>nhận thức</em> các dấu hiệu (ánh sáng, giọng nói nhân viên, thời gian chờ) — thường là vô thức.</p>
<h3>Persona là gì</h3>
<p>Một <strong>persona</strong> là một mẫu người hư cấu, dựng từ nghiên cứu thật, đại diện cho một phân khúc khách hàng/khách thật. Nó biến một bảng dữ liệu khảo sát thành một con người cụ thể mà cả nhóm có thể thiết kế cho.</p>
<ul>
<li><strong>Hồ sơ</strong> — tên, ảnh, thông tin nhân khẩu học, vai trò/nghề nghiệp.</li>
<li><strong>Mục tiêu &amp; động lực</strong> — người này muốn đạt được gì khi dùng dịch vụ.</li>
<li><strong>Điểm đau &amp; bức xúc</strong> — điều gì hiện đang làm hỏng trải nghiệm của họ.</li>
<li><strong>Hành vi &amp; bối cảnh</strong> — họ dùng dịch vụ như thế nào, khi nào, ở đâu, cùng ai.</li>
</ul>
<h3>Bản đồ đồng cảm (empathy map)</h3>
<p>Một <strong>empathy map</strong> sắp xếp dữ liệu nghiên cứu về một persona theo bốn ô: họ <em>nghĩ &amp; cảm thấy</em> gì, họ <em>thấy</em> gì, họ <em>nghe</em> gì, và họ <em>nói &amp; làm</em> gì — làm lộ ra khoảng cách giữa điều người ta nói và điều họ thực sự làm.</p>
<div class="callout"><span class="badge">Nối vào thiết kế</span> Persona và phân khúc không phải trang trí marketing — đó là đầu vào mà mọi chương sau dựa vào: bản đồ hành trình, điểm chạm, và các chỉ số đều được định nghĩa <em>theo từng persona</em>.</div>`,
  ]]);

const c2q = quiz('gad201-quiz-2', 'Quiz 2 — Customers & personas|||Quiz 2 — Khách hàng & persona', [
  { id: 'q1', question: 'Vì sao cùng một thời gian chờ có thể "ổn" ở quán ăn vặt nhưng "không ổn" ở nhà hàng cao cấp?', options: ['Vì thời gian chờ luôn được đo bằng đơn vị khác nhau', 'Vì trải nghiệm được đánh giá dựa trên kỳ vọng, không phải một chuẩn tuyệt đối', 'Vì nhà hàng cao cấp luôn phục vụ chậm hơn', 'Vì khách ăn vặt không quan tâm chất lượng'], correctIndex: 1, explanation: 'Chất lượng trải nghiệm là khoảng cách giữa cảm nhận và kỳ vọng — kỳ vọng khác nhau theo giá/thương hiệu.' },
  { id: 'q2', question: 'Thành phần nào KHÔNG thuộc một persona chuẩn?', options: ['Mục tiêu & động lực', 'Điểm đau & bức xúc', 'Hành vi & bối cảnh sử dụng', 'Báo cáo tài chính quý của doanh nghiệp'], correctIndex: 3, explanation: 'Persona mô tả một mẫu khách hàng/khách cụ thể (hồ sơ, mục tiêu, điểm đau, hành vi) — không phải số liệu tài chính nội bộ.' },
  { id: 'q3', question: 'Bốn ô của empathy map gồm những gì?', options: ['Giá, sản phẩm, kênh, đối thủ', 'Nghĩ & cảm thấy, thấy, nghe, nói & làm', 'Doanh thu, chi phí, lợi nhuận, rủi ro', 'Điểm chạm, kênh, thiết bị, thời gian'], correctIndex: 1, explanation: 'Empathy map tổ chức quan sát về một persona theo bốn ô: nghĩ/cảm, thấy, nghe, nói/làm.' },
]);

const c3 = doc('gad201-3-1-customer-journey-map', '3.1 — Customer journey mapping|||3.1 — Bản đồ hành trình khách hàng',
  'Định nghĩa & mục đích journey map; các giai đoạn (trước/trong/sau trải nghiệm); thành phần (touchpoint, cảm xúc, điểm đau, cơ hội); cách xây dựng.',
  [[
    `<span class="eyebrow">GAD201 · Chapter 3 · Lesson 3.1</span>
<h2>Customer journey mapping</h2>
<h3>What it is, and why</h3>
<p>A <strong>customer journey map (CJM)</strong> visualizes, step by step, everything a specific persona does, thinks, and feels while trying to achieve a goal through a service — from before they even know the brand exists, to long after the visit. It turns a scattered set of interactions into one connected story the whole team can see at once.</p>
<h3>The three broad stages</h3>
<ul>
<li><strong>Pre-experience</strong> — awareness, research, booking/reservation, anticipation.</li>
<li><strong>Core experience</strong> — arrival, the service delivery itself, every touchpoint along the way.</li>
<li><strong>Post-experience</strong> — departure, follow-up, reviews, loyalty, advocacy (or complaints).</li>
</ul>
<h3>What a lane-by-lane map contains</h3>
<pre><code>Stage:        Awareness   Booking   Arrival   Core service   Departure   Post
Touchpoints:  Ads/website  App/call  Lobby     Staff/product  Checkout   Email/review
Actions:      searches     books     checks in orders/uses    pays       reviews
Thoughts:     "is it good?" "easy?"  "welcomed?" "worth it?"   "smooth?"  "would I return?"
Emotion curve: ~  ~~   ^^^   ^^     v (pain point)   ^^^        ^^ or vv
Opportunity:  clearer info reduce steps  faster check-in  fix the dip  ask for review
</code></pre>
<p>The <strong>emotion curve</strong> is the heart of the map: plotting satisfaction up/down at every step reveals exactly where the experience dips — that dip is where redesign effort should go first.</p>
<div class="callout"><span class="badge">Build it from research</span> A journey map is only as good as the research behind it — interviews, shadowing real guests, support tickets, and reviews — never invented from a boardroom guess.</div>`,
    `<span class="eyebrow">GAD201 · Chương 3 · Bài 3.1</span>
<h2>Bản đồ hành trình khách hàng</h2>
<h3>Là gì, và vì sao cần</h3>
<p>Một <strong>bản đồ hành trình khách hàng (customer journey map — CJM)</strong> trực quan hoá, từng bước, mọi điều một persona cụ thể làm, nghĩ và cảm thấy khi cố đạt một mục tiêu qua một dịch vụ — từ trước khi họ biết đến thương hiệu, tới rất lâu sau chuyến trải nghiệm. Nó biến một tập tương tác rời rạc thành một câu chuyện liền mạch mà cả nhóm nhìn thấy cùng lúc.</p>
<h3>Ba giai đoạn lớn</h3>
<ul>
<li><strong>Trước trải nghiệm</strong> — nhận biết, tìm hiểu, đặt chỗ/đặt trước, kỳ vọng chờ đợi.</li>
<li><strong>Trải nghiệm cốt lõi</strong> — đến nơi, quá trình dịch vụ diễn ra, mọi điểm chạm trên đường đi.</li>
<li><strong>Sau trải nghiệm</strong> — rời đi, chăm sóc sau, đánh giá, lòng trung thành, giới thiệu (hoặc phàn nàn).</li>
</ul>
<h3>Một bản đồ theo dòng chứa gì</h3>
<pre><code>Giai đoạn:    Nhận biết   Đặt chỗ   Đến nơi   Dịch vụ chính  Ra về      Sau đó
Điểm chạm:    Ads/website App/gọi   Sảnh      Nhân viên/SP   Thanh toán Email/review
Hành động:    tìm kiếm    đặt chỗ   check-in  gọi/dùng dịch vụ trả tiền  đánh giá
Suy nghĩ:     "có tốt không?" "dễ không?" "được đón tiếp?" "có đáng?" "êm không?" "có quay lại?"
Đường cảm xúc: ~  ~~   ^^^   ^^     v (điểm đau)   ^^^         ^^ hoặc vv
Cơ hội:       thông tin rõ hơn giảm bước  check-in nhanh hơn  sửa điểm trũng  xin đánh giá
</code></pre>
<p><strong>Đường cảm xúc</strong> là trái tim của bản đồ: vẽ mức hài lòng lên/xuống ở mỗi bước cho thấy chính xác trải nghiệm trũng ở đâu — chỗ trũng đó là nơi cần thiết kế lại đầu tiên.</p>
<div class="callout"><span class="badge">Dựng từ nghiên cứu</span> Bản đồ hành trình chỉ tốt bằng nghiên cứu đứng sau nó — phỏng vấn, quan sát khách thật, ticket hỗ trợ, và đánh giá — không bao giờ bịa ra từ suy đoán trong phòng họp.</div>`,
  ]]);

const c3q = quiz('gad201-quiz-3', 'Quiz 3 — Journey map|||Quiz 3 — Bản đồ hành trình', [
  { id: 'q1', question: 'Journey map thường chia trải nghiệm thành ba giai đoạn lớn nào?', options: ['Quảng cáo, bán hàng, giao hàng', 'Trước trải nghiệm, trải nghiệm cốt lõi, sau trải nghiệm', 'Nhân sự, vận hành, tài chính', 'Sản phẩm, giá, kênh phân phối'], correctIndex: 1, explanation: 'CJM trải dài từ trước khi khách biết đến brand, qua lúc trải nghiệm chính, tới sau khi rời đi.' },
  { id: 'q2', question: '"Đường cảm xúc" (emotion curve) trong journey map dùng để làm gì?', options: ['Tính doanh thu theo từng bước', 'Chỉ ra chính xác bước nào trải nghiệm bị trũng để ưu tiên thiết kế lại', 'Thay thế hoàn toàn cho khảo sát khách hàng', 'Liệt kê giá của từng dịch vụ'], correctIndex: 1, explanation: 'Vẽ mức hài lòng lên/xuống theo từng bước giúp thấy ngay điểm đau cần sửa trước.' },
  { id: 'q3', question: 'Một journey map nên được xây dựng dựa trên nguồn nào?', options: ['Suy đoán của một người quản lý trong phòng họp', 'Nghiên cứu thật: phỏng vấn, quan sát khách, ticket hỗ trợ, đánh giá', 'Chỉ dựa vào báo cáo tài chính', 'Chỉ dựa vào mạng xã hội của đối thủ'], correctIndex: 1, explanation: 'Journey map chỉ đáng tin khi dựng từ dữ liệu nghiên cứu thật về hành vi và cảm nhận của khách.' },
]);

const c4 = doc('gad201-4-1-touchpoints-moments-of-truth', '4.1 — Touchpoints & moments of truth|||4.1 — Điểm chạm & khoảnh khắc quyết định',
  'Định nghĩa touchpoint; Moments of Truth (Carlzon, P&G, Google); quy luật Peak-End; ưu tiên điểm chạm để thiết kế.',
  [[
    `<span class="eyebrow">GAD201 · Chapter 4 · Lesson 4.1</span>
<h2>Touchpoints &amp; moments of truth</h2>
<h3>What is a touchpoint</h3>
<p>A <strong>touchpoint</strong> is any single point of contact where a customer interacts with a brand — a website, a phone call, a receptionist, a receipt, a bathroom, a signage board. A typical journey has dozens; not all deserve equal design attention.</p>
<h3>Moments of Truth</h3>
<p>The <strong>Moment of Truth (MOT)</strong> concept, popularized by SAS airline CEO Jan Carlzon in the 1980s, says every one of these brief contacts is a chance for the brand to either win or lose the customer — often decided in seconds by a front-line employee with no manager watching. Later variants extended the idea:</p>
<ul>
<li><strong>First Moment of Truth (FMOT)</strong> (Procter &amp; Gamble) — the instant a shopper faces the product on the shelf.</li>
<li><strong>Second Moment of Truth (SMOT)</strong> — the experience of actually using the product/service.</li>
<li><strong>Ultimate Moment of Truth (UMOT)</strong> — the customer's own feedback, review, or story shared afterward.</li>
<li><strong>Zero Moment of Truth (ZMOT)</strong> (Google) — the online research that happens even before the shopper reaches the shelf.</li>
</ul>
<h3>The Peak-End rule</h3>
<p>Psychologist Daniel Kahneman found that people judge an experience mainly by its <strong>most intense moment (peak)</strong> and its <strong>final moment (end)</strong> — not by the average of every minute. A rough middle section is forgivable if the peak delights and the ending is warm; a weak ending can ruin an otherwise strong experience.</p>
<div class="callout"><span class="badge">Prioritize, do not spread thin</span> Because budget and attention are limited, design effort should concentrate on the moments of truth and the peak/end of the journey — not be spread evenly across every touchpoint.</div>`,
    `<span class="eyebrow">GAD201 · Chương 4 · Bài 4.1</span>
<h2>Điểm chạm &amp; khoảnh khắc quyết định</h2>
<h3>Điểm chạm (touchpoint) là gì</h3>
<p>Một <strong>điểm chạm</strong> là bất kỳ điểm tiếp xúc nào nơi khách tương tác với thương hiệu — một website, một cuộc gọi, một lễ tân, một hoá đơn, một nhà vệ sinh, một tấm biển chỉ dẫn. Một hành trình điển hình có hàng chục điểm chạm; không phải điểm nào cũng đáng đầu tư thiết kế bằng nhau.</p>
<h3>Khoảnh khắc quyết định (Moments of Truth)</h3>
<p>Khái niệm <strong>Moment of Truth (MOT)</strong>, được CEO hãng hàng không SAS Jan Carlzon phổ biến từ thập niên 1980, cho rằng mỗi lần tiếp xúc ngắn ngủi này là một cơ hội để thương hiệu thắng hoặc mất khách — thường được quyết định trong vài giây bởi một nhân viên tuyến đầu, không có quản lý nào đứng nhìn. Các biến thể sau đó mở rộng ý tưởng:</p>
<ul>
<li><strong>Khoảnh khắc quyết định đầu tiên (FMOT)</strong> (Procter &amp; Gamble) — thời điểm khách đứng trước sản phẩm trên kệ.</li>
<li><strong>Khoảnh khắc quyết định thứ hai (SMOT)</strong> — trải nghiệm thực sự dùng sản phẩm/dịch vụ.</li>
<li><strong>Khoảnh khắc quyết định cuối cùng (UMOT)</strong> — phản hồi, đánh giá, câu chuyện khách kể lại sau đó.</li>
<li><strong>Khoảnh khắc quyết định số không (ZMOT)</strong> (Google) — việc tìm hiểu trực tuyến xảy ra trước cả khi khách đứng trước kệ hàng.</li>
</ul>
<h3>Quy luật Peak-End</h3>
<p>Nhà tâm lý học Daniel Kahneman phát hiện con người đánh giá một trải nghiệm chủ yếu qua <strong>khoảnh khắc cao điểm (peak)</strong> và <strong>khoảnh khắc cuối cùng (end)</strong> — không phải bằng trung bình của mọi phút giây. Một đoạn giữa hơi tầm thường vẫn có thể tha thứ nếu cao điểm gây thích thú và kết thúc ấm áp; ngược lại một kết thúc yếu có thể phá hỏng cả một trải nghiệm mạnh.</p>
<div class="callout"><span class="badge">Ưu tiên, đừng rải mỏng</span> Vì ngân sách và sự chú ý có hạn, công sức thiết kế nên dồn vào các khoảnh khắc quyết định và phần đỉnh/kết của hành trình — không rải đều cho mọi điểm chạm.</div>`,
  ]]);

const c4q = quiz('gad201-quiz-4', 'Quiz 4 — Touchpoints & MOT|||Quiz 4 — Điểm chạm & khoảnh khắc quyết định', [
  { id: 'q1', question: 'Khái niệm Moment of Truth do ai phổ biến, và nói về điều gì?', options: ['Kahneman — nói về trí nhớ dài hạn', 'Jan Carlzon — mỗi lần tiếp xúc ngắn là cơ hội thắng hoặc mất khách', 'Pine & Gilmore — nói về bốn cấp độ giá trị', 'Bitner — nói về không gian dịch vụ'], correctIndex: 1, explanation: 'Jan Carlzon (CEO SAS) phổ biến khái niệm MOT: mỗi tiếp xúc ngắn là cơ hội thương hiệu thắng hoặc mất khách.' },
  { id: 'q2', question: 'Việc khách tìm hiểu online về sản phẩm TRƯỚC khi đứng trước kệ hàng, theo Google, gọi là gì?', options: ['First Moment of Truth (FMOT)', 'Second Moment of Truth (SMOT)', 'Zero Moment of Truth (ZMOT)', 'Ultimate Moment of Truth (UMOT)'], correctIndex: 2, explanation: 'ZMOT là giai đoạn nghiên cứu trực tuyến xảy ra trước cả FMOT (đứng trước kệ hàng).' },
  { id: 'q3', question: 'Theo quy luật Peak-End của Kahneman, điều gì quyết định cách người ta đánh giá một trải nghiệm?', options: ['Trung bình cảm nhận của mọi khoảnh khắc', 'Khoảnh khắc đầu tiên duy nhất', 'Khoảnh khắc cao điểm và khoảnh khắc kết thúc', 'Tổng số điểm chạm đã đi qua'], correctIndex: 2, explanation: 'Con người nhớ và đánh giá trải nghiệm chủ yếu qua đỉnh cao điểm và đoạn kết, không phải trung bình toàn bộ.' },
]);

const c5 = doc('gad201-5-1-multisensory-servicescape', '5.1 — Multisensory experience & servicescape|||5.1 — Trải nghiệm đa giác quan & không gian dịch vụ',
  'Mô hình Servicescape (Bitner): điều kiện xung quanh, không gian/công năng, biển hiệu/hiện vật; thiết kế qua 5 giác quan.',
  [[
    `<span class="eyebrow">GAD201 · Chapter 5 · Lesson 5.1</span>
<h2>Multisensory experience &amp; servicescape</h2>
<h3>Bitner's servicescape model</h3>
<p>Because services are intangible, the physical environment where they happen becomes a huge part of quality perception. Mary Jo Bitner's <strong>servicescape</strong> model groups every physical cue into three dimensions:</p>
<ul>
<li><strong>Ambient conditions</strong> — temperature, lighting, noise level, scent, music.</li>
<li><strong>Space &amp; function</strong> — layout, equipment, furniture, how easily people and objects move through the space.</li>
<li><strong>Signs, symbols &amp; artifacts</strong> — signage, decor, staff uniforms, materials/finishes that signal quality and brand personality.</li>
</ul>
<h3>Designing with all five senses</h3>
<p>Multisensory design goes beyond looks: <strong>sight</strong> (color, light, visual order), <strong>sound</strong> (soundscape, background music tempo), <strong>smell</strong> (signature scent marketing — many hotel chains use one specific scent in every lobby), <strong>touch</strong> (material texture, temperature, weight of an object handed to the guest), and <strong>taste</strong> (a small tasting moment, even outside food service, e.g. welcome drinks). Consistent sensory cues across locations build brand recognition without a single word.</p>
<h3>Physical evidence</h3>
<p>In services marketing, the servicescape is one part of the broader idea of <strong>physical evidence</strong> — because a service cannot be inspected before purchase like a product, guests infer quality from tangible cues: cleanliness, staff appearance, the condition of the receipt or packaging.</p>
<div class="callout"><span class="badge">Design detail</span> A cold reception desk, a stained menu, or a single wrong scent can undo weeks of good service design — the servicescape is not decoration, it is evidence customers use to judge quality.</div>`,
    `<span class="eyebrow">GAD201 · Chương 5 · Bài 5.1</span>
<h2>Trải nghiệm đa giác quan &amp; không gian dịch vụ</h2>
<h3>Mô hình Servicescape của Bitner</h3>
<p>Vì dịch vụ vô hình, môi trường vật lý nơi dịch vụ diễn ra trở thành một phần lớn trong cảm nhận chất lượng. Mô hình <strong>servicescape</strong> của Mary Jo Bitner gom mọi dấu hiệu vật lý vào ba nhóm:</p>
<ul>
<li><strong>Điều kiện xung quanh (ambient conditions)</strong> — nhiệt độ, ánh sáng, mức ồn, mùi hương, âm nhạc.</li>
<li><strong>Không gian &amp; công năng (space &amp; function)</strong> — cách bố trí, thiết bị, nội thất, mức dễ di chuyển của người và vật trong không gian.</li>
<li><strong>Biển hiệu, biểu tượng &amp; hiện vật (signs, symbols & artifacts)</strong> — biển chỉ dẫn, trang trí, đồng phục nhân viên, vật liệu/hoàn thiện thể hiện chất lượng và cá tính thương hiệu.</li>
</ul>
<h3>Thiết kế qua cả năm giác quan</h3>
<p>Thiết kế đa giác quan vượt xa thị giác: <strong>nhìn</strong> (màu sắc, ánh sáng, trật tự thị giác), <strong>nghe</strong> (âm cảnh, tốc độ nhạc nền), <strong>mùi</strong> (mùi hương đặc trưng — nhiều chuỗi khách sạn dùng đúng một mùi cho mọi sảnh), <strong>chạm</strong> (chất liệu, nhiệt độ, trọng lượng của vật đưa cho khách), và <strong>vị</strong> (một khoảnh khắc nếm nhỏ, cả ngoài ngành ẩm thực, ví dụ đồ uống chào mừng). Dấu hiệu giác quan nhất quán xuyên các địa điểm xây nhận diện thương hiệu mà không cần một lời nào.</p>
<h3>Bằng chứng vật lý</h3>
<p>Trong marketing dịch vụ, servicescape là một phần của ý tưởng lớn hơn gọi là <strong>bằng chứng vật lý (physical evidence)</strong> — vì dịch vụ không thể kiểm tra trước khi mua như sản phẩm, khách suy ra chất lượng từ dấu hiệu hữu hình: sự sạch sẽ, ngoại hình nhân viên, tình trạng hoá đơn hoặc bao bì.</p>
<div class="callout"><span class="badge">Chi tiết là thiết kế</span> Một bàn lễ tân lạnh lẽo, một tấm menu ố bẩn, hay một mùi hương sai có thể xoá sạch nhiều tuần thiết kế dịch vụ tốt — servicescape không phải trang trí, đó là bằng chứng khách dùng để đánh giá chất lượng.</div>`,
  ]]);

const c5q = quiz('gad201-quiz-5', 'Quiz 5 — Servicescape|||Quiz 5 — Không gian dịch vụ', [
  { id: 'q1', question: 'Mô hình servicescape của Bitner gồm ba nhóm dấu hiệu vật lý nào?', options: ['Giá, khuyến mãi, kênh phân phối', 'Điều kiện xung quanh; không gian & công năng; biển hiệu/biểu tượng/hiện vật', 'Doanh thu, chi phí, lợi nhuận', 'NPS, CSAT, CES'], correctIndex: 1, explanation: 'Bitner chia môi trường dịch vụ vào ba nhóm: điều kiện xung quanh, không gian/công năng, và biển hiệu/biểu tượng/hiện vật.' },
  { id: 'q2', question: 'Việc nhiều chuỗi khách sạn dùng đúng một mùi hương đặc trưng ở mọi sảnh nhằm mục đích gì?', options: ['Che mùi thức ăn', 'Xây nhận diện thương hiệu qua giác quan mà không cần lời nói', 'Tiết kiệm chi phí vệ sinh', 'Đáp ứng quy định phòng cháy'], correctIndex: 1, explanation: 'Mùi hương đặc trưng nhất quán là một công cụ nhận diện thương hiệu đa giác quan, không cần chữ hay logo.' },
  { id: 'q3', question: 'Vì sao "bằng chứng vật lý" (physical evidence) quan trọng trong marketing dịch vụ?', options: ['Vì dịch vụ có thể cân đo như hàng hoá', 'Vì dịch vụ vô hình, khách phải suy ra chất lượng từ các dấu hiệu hữu hình', 'Vì nó thay thế hoàn toàn cho chất lượng nhân viên', 'Vì nó chỉ áp dụng cho sản phẩm số'], correctIndex: 1, explanation: 'Dịch vụ không kiểm tra trước khi mua được như sản phẩm, nên khách dựa vào dấu hiệu vật lý (sạch sẽ, ngoại hình nhân viên...) để phán đoán chất lượng.' },
]);

const c6 = doc('gad201-6-1-personalization-technology', '6.1 — Personalization & technology in experience|||6.1 — Cá nhân hoá & công nghệ trong trải nghiệm',
  'Các mức cá nhân hoá; CRM & dữ liệu khách hàng; công nghệ (chatbot, app, kiosk, AR/VR); trải nghiệm đa kênh (omnichannel).',
  [[
    `<span class="eyebrow">GAD201 · Chapter 6 · Lesson 6.1</span>
<h2>Personalization &amp; technology in experience</h2>
<h3>Levels of personalization</h3>
<p>Personalization sits on a spectrum: <strong>mass customization</strong> (a limited menu of pre-set options, e.g. choosing a room type), <strong>segment-based personalization</strong> (different treatment for different personas, e.g. business vs leisure guests), and <strong>hyper-personalization</strong> (using individual history/data to tailor a specific guest's experience in real time, e.g. remembering a returning guest's pillow preference).</p>
<h3>CRM &amp; data</h3>
<p>A <strong>Customer Relationship Management (CRM)</strong> system stores the history behind personalization — past visits, preferences, complaints, spend — so that any staff member (or a system) can recognize and respond to a specific guest without asking them to repeat themselves.</p>
<h3>Technology touchpoints</h3>
<ul>
<li><strong>Chatbots / AI assistants</strong> — instant answers and bookings without waiting for a human.</li>
<li><strong>Mobile apps</strong> — self-service check-in, room control, event schedules, digital tickets.</li>
<li><strong>Self-service kiosks</strong> — faster check-in/checkout, reduced queue anxiety.</li>
<li><strong>Immersive technology (AR/VR)</strong> — virtual previews (a hotel room, an exhibition), augmented wayfinding.</li>
</ul>
<h3>Omnichannel</h3>
<p>An <strong>omnichannel</strong> experience keeps context consistent across channels — a guest who starts a booking on the website and finishes it on the phone should not have to explain themselves again; the data and the tone of voice travel with them.</p>
<div class="callout"><span class="badge">Technology serves the experience</span> Technology should remove friction and enable personal recognition — it becomes a problem the moment it replaces genuine human warmth entirely, or when it fails and there is no human fallback.</div>`,
    `<span class="eyebrow">GAD201 · Chương 6 · Bài 6.1</span>
<h2>Cá nhân hoá &amp; công nghệ trong trải nghiệm</h2>
<h3>Các mức cá nhân hoá</h3>
<p>Cá nhân hoá trải trên một dải: <strong>tuỳ biến đại trà (mass customization)</strong> (một thực đơn tuỳ chọn có hạn, vd chọn loại phòng), <strong>cá nhân hoá theo phân khúc</strong> (đối xử khác nhau theo persona, vd khách công vụ vs khách nghỉ dưỡng), và <strong>siêu cá nhân hoá (hyper-personalization)</strong> (dùng lịch sử/dữ liệu cá nhân để tuỳ biến trải nghiệm của một khách cụ thể theo thời gian thực, vd nhớ sở thích gối nằm của khách quay lại).</p>
<h3>CRM &amp; dữ liệu</h3>
<p>Một hệ thống <strong>Customer Relationship Management (CRM)</strong> lưu lịch sử đứng sau cá nhân hoá — các lần ghé trước, sở thích, phàn nàn, mức chi tiêu — để bất kỳ nhân viên nào (hoặc một hệ thống) có thể nhận ra và phản ứng đúng với một khách cụ thể mà không cần khách lặp lại thông tin.</p>
<h3>Điểm chạm công nghệ</h3>
<ul>
<li><strong>Chatbot / trợ lý AI</strong> — trả lời và đặt chỗ ngay lập tức, không cần chờ người thật.</li>
<li><strong>App di động</strong> — tự check-in, điều khiển phòng, lịch sự kiện, vé điện tử.</li>
<li><strong>Kiosk tự phục vụ</strong> — check-in/check-out nhanh hơn, giảm lo lắng khi phải chờ hàng.</li>
<li><strong>Công nghệ nhập vai (AR/VR)</strong> — xem trước ảo (một phòng khách sạn, một triển lãm), chỉ đường tăng cường thực tế.</li>
</ul>
<h3>Đa kênh (omnichannel)</h3>
<p>Một trải nghiệm <strong>omnichannel</strong> giữ bối cảnh nhất quán xuyên các kênh — một khách bắt đầu đặt chỗ trên website và hoàn tất qua điện thoại không nên phải giải thích lại từ đầu; dữ liệu và tông giọng đi theo họ.</p>
<div class="callout"><span class="badge">Công nghệ phục vụ trải nghiệm</span> Công nghệ nên loại bỏ ma sát và cho phép nhận diện cá nhân — nó trở thành vấn đề ngay khi thay thế hoàn toàn sự ấm áp của con người, hoặc khi nó lỗi mà không có phương án con người thay thế.</div>`,
  ]]);

const c6q = quiz('gad201-quiz-6', 'Quiz 6 — Personalization & tech|||Quiz 6 — Cá nhân hoá & công nghệ', [
  { id: 'q1', question: 'Việc nhớ sở thích gối nằm của một khách quay lại và tuỳ biến ngay cho riêng người đó là ví dụ của mức cá nhân hoá nào?', options: ['Tuỳ biến đại trà (mass customization)', 'Cá nhân hoá theo phân khúc', 'Siêu cá nhân hoá (hyper-personalization)', 'Không thuộc mức cá nhân hoá nào'], correctIndex: 2, explanation: 'Dùng dữ liệu/lịch sử của MỘT khách cụ thể để tuỳ biến riêng cho họ là siêu cá nhân hoá.' },
  { id: 'q2', question: 'Vai trò chính của một hệ thống CRM trong thiết kế trải nghiệm là gì?', options: ['Thay thế hoàn toàn nhân viên phục vụ', 'Lưu lịch sử/sở thích khách hàng để bất kỳ ai (hoặc hệ thống) có thể nhận ra và phục vụ đúng người', 'Chỉ dùng để tính lương nhân viên', 'Chỉ dùng để quản lý kho hàng'], correctIndex: 1, explanation: 'CRM lưu dữ liệu lịch sử/khách hàng để hỗ trợ cá nhân hoá và nhận diện khách qua các lần tương tác.' },
  { id: 'q3', question: 'Một trải nghiệm "omnichannel" đúng nghĩa là gì?', options: ['Chỉ dùng một kênh duy nhất để tránh nhầm lẫn', 'Bối cảnh và dữ liệu khách được giữ nhất quán khi khách chuyển đổi giữa các kênh', 'Mỗi kênh có một CRM riêng, không liên kết với nhau', 'Chỉ áp dụng cho thanh toán, không áp dụng cho hỗ trợ khách hàng'], correctIndex: 1, explanation: 'Omnichannel nghĩa là dữ liệu/bối cảnh đi theo khách xuyên các kênh, khách không phải lặp lại thông tin.' },
]);

const c7 = doc('gad201-7-1-measuring-experience', '7.1 — Measuring experience: NPS, CSAT, CES|||7.1 — Đo lường trải nghiệm: NPS, CSAT, CES',
  'Net Promoter Score (công thức, promoter/passive/detractor); Customer Satisfaction Score; Customer Effort Score; khi nào dùng chỉ số nào.',
  [[
    `<span class="eyebrow">GAD201 · Chapter 7 · Lesson 7.1</span>
<h2>Measuring experience: NPS, CSAT, CES</h2>
<h3>Net Promoter Score (NPS)</h3>
<p>NPS asks one question: <em>"How likely are you to recommend us to a friend or colleague?"</em> (0-10). Respondents split into three groups:</p>
<ul>
<li><strong>Promoters (9-10)</strong> — loyal, likely to refer others.</li>
<li><strong>Passives (7-8)</strong> — satisfied but not enthusiastic, easily poached by a competitor.</li>
<li><strong>Detractors (0-6)</strong> — unhappy, can damage the brand through negative word of mouth.</li>
</ul>
<pre><code>NPS = %Promoters - %Detractors
Example: 60% promoters, 25% passives, 15% detractors
NPS = 60 - 15 = 45
</code></pre>
<h3>Customer Satisfaction Score (CSAT)</h3>
<p>CSAT asks <em>"How satisfied were you with [this specific interaction]?"</em> right after a touchpoint (e.g. checkout, a support call). It measures satisfaction with one moment, not the whole relationship — best used repeatedly at specific touchpoints identified on the journey map.</p>
<h3>Customer Effort Score (CES)</h3>
<p>CES asks <em>"How easy was it to [accomplish this task]?"</em>. It measures friction rather than delight — research shows that reducing effort (fixing a broken step) often improves loyalty more reliably than trying to delight at every point.</p>
<h3>Choosing which metric, and when</h3>
<p>Use <strong>NPS</strong> for overall brand health and long-term loyalty tracking; <strong>CSAT</strong> right after a specific touchpoint to catch local problems fast; <strong>CES</strong> anywhere a task involves several steps (booking, check-in, support) to catch friction before it becomes a bad review.</p>
<div class="callout"><span class="badge">Numbers need a "why"</span> Every score should be paired with an open comment field — the number tells you something moved, the comment tells you why, which is what design actually needs.</div>`,
    `<span class="eyebrow">GAD201 · Chương 7 · Bài 7.1</span>
<h2>Đo lường trải nghiệm: NPS, CSAT, CES</h2>
<h3>Net Promoter Score (NPS)</h3>
<p>NPS hỏi đúng một câu: <em>"Bạn có khả năng giới thiệu chúng tôi cho bạn bè hoặc đồng nghiệp đến mức nào?"</em> (0-10). Người trả lời chia thành ba nhóm:</p>
<ul>
<li><strong>Promoter (9-10)</strong> — trung thành, dễ giới thiệu người khác.</li>
<li><strong>Passive (7-8)</strong> — hài lòng nhưng không nhiệt tình, dễ bị đối thủ lôi kéo.</li>
<li><strong>Detractor (0-6)</strong> — không hài lòng, có thể làm hại thương hiệu qua lời truyền miệng tiêu cực.</li>
</ul>
<pre><code>NPS = %Promoter - %Detractor
Ví dụ: 60% promoter, 25% passive, 15% detractor
NPS = 60 - 15 = 45
</code></pre>
<h3>Customer Satisfaction Score (CSAT)</h3>
<p>CSAT hỏi <em>"Bạn hài lòng thế nào với [tương tác cụ thể này]?"</em> ngay sau một điểm chạm (vd thanh toán, một cuộc gọi hỗ trợ). Nó đo mức hài lòng với một khoảnh khắc, không phải cả mối quan hệ — nên dùng lặp lại tại các điểm chạm cụ thể đã xác định trên bản đồ hành trình.</p>
<h3>Customer Effort Score (CES)</h3>
<p>CES hỏi <em>"Việc [hoàn tất tác vụ này] dễ dàng đến mức nào?"</em>. Nó đo ma sát hơn là sự thích thú — nghiên cứu cho thấy giảm nỗ lực (sửa một bước bị hỏng) thường cải thiện lòng trung thành chắc chắn hơn là cố làm hài lòng ở mọi điểm.</p>
<h3>Chọn chỉ số nào, khi nào</h3>
<p>Dùng <strong>NPS</strong> để theo dõi sức khoẻ thương hiệu tổng thể và lòng trung thành dài hạn; <strong>CSAT</strong> ngay sau một điểm chạm cụ thể để bắt vấn đề cục bộ nhanh; <strong>CES</strong> ở bất kỳ tác vụ nhiều bước (đặt chỗ, check-in, hỗ trợ) để bắt ma sát trước khi nó thành một đánh giá xấu.</p>
<div class="callout"><span class="badge">Số cần đi kèm "vì sao"</span> Mỗi điểm số nên đi cùng một ô nhận xét mở — số cho biết có gì đó vừa thay đổi, nhận xét cho biết vì sao, và đó mới là điều thiết kế thực sự cần.</div>`,
  ]]);

const c7q = quiz('gad201-quiz-7', 'Quiz 7 — NPS/CSAT/CES|||Quiz 7 — NPS/CSAT/CES', [
  { id: 'q1', question: 'Nếu một khảo sát có 60% promoter, 25% passive, 15% detractor, NPS là bao nhiêu?', options: ['85', '45', '60', '75'], correctIndex: 1, explanation: 'NPS = %Promoter − %Detractor = 60 − 15 = 45. Nhóm passive không tính vào công thức.' },
  { id: 'q2', question: 'Chỉ số nào phù hợp nhất để đo cụ thể ngay sau một cuộc gọi hỗ trợ vừa kết thúc?', options: ['NPS', 'CSAT', 'CES đo cho toàn công ty', 'Không chỉ số nào phù hợp'], correctIndex: 1, explanation: 'CSAT đo hài lòng với một tương tác/điểm chạm cụ thể, ngay sau khi nó xảy ra.' },
  { id: 'q3', question: 'Customer Effort Score (CES) chủ yếu đo điều gì?', options: ['Mức độ sang trọng của không gian dịch vụ', 'Mức ma sát/nỗ lực khách phải bỏ ra để hoàn tất một tác vụ', 'Doanh thu trên mỗi khách hàng', 'Số lượng điểm chạm trong hành trình'], correctIndex: 1, explanation: 'CES hỏi việc hoàn tất một tác vụ dễ hay khó — đo ma sát, không đo sự thích thú.' },
]);

const c8 = doc('gad201-8-1-service-recovery-governance-trends', '8.1 — Service recovery, CX governance & trends|||8.1 — Phục hồi dịch vụ, quản trị trải nghiệm & xu hướng',
  'Nghịch lý phục hồi dịch vụ; quy trình phục hồi (LEARN); Voice of Customer & CXO; xu hướng: bán lẻ trải nghiệm, cá nhân hoá bằng AI, bền vững.',
  [[
    `<span class="eyebrow">GAD201 · Chapter 8 · Lesson 8.1</span>
<h2>Service recovery, CX governance &amp; trends</h2>
<h3>The service recovery paradox</h3>
<p>A failure handled brilliantly can sometimes leave a customer <em>more</em> loyal than if nothing had ever gone wrong — this is the <strong>service recovery paradox</strong>. It does not excuse causing failures on purpose; it means the recovery moment is itself a moment of truth worth designing carefully.</p>
<h3>A recovery process</h3>
<pre><code>L - Listen     : let the guest fully explain, without interrupting or excusing
E - Empathize  : acknowledge how they feel, not just what went wrong
A - Apologize  : a genuine apology, without blaming another department
R - Resolve    : fix it, and empower front-line staff to decide on the spot
N - Notify     : follow up afterward to confirm the fix actually worked
</code></pre>
<p><strong>Empowerment</strong> matters most: a front-line staff member who must escalate every complaint for approval loses the golden window where recovery still works.</p>
<h3>CX governance</h3>
<p>As experience becomes strategic, organizations formalize it: a <strong>Chief Experience Officer (CXO)</strong> or CX team owns cross-department consistency; a <strong>Voice of Customer (VoC)</strong> program continuously collects feedback (surveys, reviews, social listening) and routes it to the teams that can act on it.</p>
<h3>Trends</h3>
<ul>
<li><strong>Experiential retail</strong> — physical stores designed as destinations/events, not just points of sale.</li>
<li><strong>AI-driven personalization</strong> — predictive recommendations, dynamic pricing/service tailored per guest.</li>
<li><strong>Sustainability in experience design</strong> — guests increasingly judge brands on environmental and ethical cues, not only comfort.</li>
</ul>
<div class="callout"><span class="badge">Closing the loop</span> Great experience design is never "done" — it is a cycle of researching personas, mapping journeys, designing touchpoints, measuring, and recovering from failure, repeated continuously.</div>`,
    `<span class="eyebrow">GAD201 · Chương 8 · Bài 8.1</span>
<h2>Phục hồi dịch vụ, quản trị trải nghiệm &amp; xu hướng</h2>
<h3>Nghịch lý phục hồi dịch vụ</h3>
<p>Một sự cố được xử lý xuất sắc đôi khi khiến khách <em>trung thành hơn</em> so với khi chưa từng có sự cố nào — đây là <strong>nghịch lý phục hồi dịch vụ (service recovery paradox)</strong>. Điều này không cho phép tạo ra sự cố có chủ đích; nó có nghĩa khoảnh khắc phục hồi chính là một khoảnh khắc quyết định đáng được thiết kế cẩn thận.</p>
<h3>Một quy trình phục hồi</h3>
<pre><code>L - Nghe (Listen)      : để khách giải thích hết, không cắt lời hoặc bao biện
E - Đồng cảm (Empathize): thừa nhận cảm xúc của họ, không chỉ sự việc đã xảy ra
A - Xin lỗi (Apologize) : lời xin lỗi thật lòng, không đổ lỗi cho bộ phận khác
R - Giải quyết (Resolve): sửa ngay, và trao quyền cho nhân viên tuyến đầu quyết định
N - Theo dõi (Notify)   : liên hệ lại sau đó để xác nhận cách sửa có hiệu quả thật
</code></pre>
<p><strong>Trao quyền (empowerment)</strong> quan trọng nhất: một nhân viên tuyến đầu phải xin phê duyệt cho mọi phàn nàn sẽ đánh mất khoảng thời gian vàng khi việc phục hồi còn có tác dụng.</p>
<h3>Quản trị trải nghiệm</h3>
<p>Khi trải nghiệm trở thành chiến lược, tổ chức chính thức hoá nó: một <strong>Chief Experience Officer (CXO)</strong> hoặc nhóm CX chịu trách nhiệm về sự nhất quán xuyên các bộ phận; một chương trình <strong>Voice of Customer (VoC)</strong> liên tục thu thập phản hồi (khảo sát, đánh giá, lắng nghe mạng xã hội) và chuyển tới đúng nhóm có thể hành động.</p>
<h3>Xu hướng</h3>
<ul>
<li><strong>Bán lẻ trải nghiệm (experiential retail)</strong> — cửa hàng vật lý được thiết kế như một điểm đến/sự kiện, không chỉ là nơi bán hàng.</li>
<li><strong>Cá nhân hoá bằng AI</strong> — gợi ý dự đoán, giá/dịch vụ động tuỳ biến theo từng khách.</li>
<li><strong>Bền vững trong thiết kế trải nghiệm</strong> — khách ngày càng đánh giá thương hiệu qua dấu hiệu môi trường và đạo đức, không chỉ sự tiện nghi.</li>
</ul>
<div class="callout"><span class="badge">Vòng lặp không kết thúc</span> Thiết kế trải nghiệm xuất sắc không bao giờ "xong" — đó là một vòng lặp liên tục: nghiên cứu persona, lập bản đồ hành trình, thiết kế điểm chạm, đo lường, và phục hồi khi có sự cố.</div>`,
  ]]);

const c8q = quiz('gad201-quiz-8', 'Quiz 8 — Recovery, governance & trends|||Quiz 8 — Phục hồi, quản trị & xu hướng', [
  { id: 'q1', question: '"Nghịch lý phục hồi dịch vụ" (service recovery paradox) nói điều gì?', options: ['Sự cố luôn làm khách rời bỏ vĩnh viễn', 'Một sự cố được xử lý xuất sắc đôi khi khiến khách trung thành hơn cả khi không có sự cố', 'Nên tạo sự cố có chủ đích để kiểm tra nhân viên', 'Phục hồi dịch vụ không có tác dụng gì với lòng trung thành'], correctIndex: 1, explanation: 'Xử lý sự cố xuất sắc có thể làm tăng lòng trung thành so với việc chưa từng xảy ra sự cố — nhưng không phải lý do để cố ý gây lỗi.' },
  { id: 'q2', question: 'Vì sao "trao quyền" (empowerment) cho nhân viên tuyến đầu quan trọng trong phục hồi dịch vụ?', options: ['Để nhân viên không cần báo cáo cấp trên bao giờ', 'Vì phải xin phê duyệt cho mọi phàn nàn sẽ làm mất khoảng thời gian vàng để phục hồi hiệu quả', 'Vì khách hàng luôn muốn gặp quản lý cấp cao', 'Vì luật pháp yêu cầu vậy'], correctIndex: 1, explanation: 'Phục hồi hiệu quả cần xử lý nhanh — chờ phê duyệt làm mất "khoảng thời gian vàng" khi phục hồi còn tác dụng.' },
  { id: 'q3', question: 'Chương trình Voice of Customer (VoC) có vai trò gì trong quản trị trải nghiệm?', options: ['Chỉ dùng để quảng cáo trên mạng xã hội', 'Liên tục thu thập phản hồi khách hàng và chuyển tới đúng nhóm có thể hành động', 'Thay thế hoàn toàn cho journey mapping', 'Chỉ áp dụng một lần khi ra mắt sản phẩm mới'], correctIndex: 1, explanation: 'VoC là một hệ thống liên tục (khảo sát, đánh giá, social listening) đưa phản hồi khách hàng tới đúng nơi có thể xử lý.' },
]);

const taiLieu = doc('gad201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình FLM, sách nền tảng (Pine & Gilmore, Schmitt, Rossman — trích dẫn, không upload PDF), tài liệu miễn phí, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">GAD201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Guest and Audience Experience Design — experience economy, personas, journey mapping, touchpoints, servicescape, personalization and measurement — in one place. The full official slides &amp; syllabus live on <strong>FLM</strong>; below are the foundational books (cited, not distributed) plus free legal resources and tools.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU syllabus &amp; lecture slides for GAD201 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Foundational books (cited, not distributed here)</h3>
<ul>
<li>Pine &amp; Gilmore — <em>The Experience Economy</em> — original concept in the Harvard Business Review article <a href="https://hbr.org/1998/07/welcome-to-the-experience-economy" target="_blank" rel="noopener">"Welcome to the Experience Economy"</a>; overview on <a href="https://en.wikipedia.org/wiki/The_Experience_Economy" target="_blank" rel="noopener">Wikipedia</a>.</li>
<li>Bernd Schmitt — <em>Customer Experience Management</em> — background on the concept at <a href="https://en.wikipedia.org/wiki/Customer_experience" target="_blank" rel="noopener">Wikipedia: Customer experience</a>.</li>
<li>Alexander Rossman — <em>Designing Experiences</em> — publisher page at <a href="https://cup.columbia.edu/book/designing-experiences/9780231193760" target="_blank" rel="noopener">Columbia University Press</a>.</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.netpromotersystem.com/" target="_blank" rel="noopener">The Net Promoter System</a> — official NPS reference by Bain &amp; Company.</li>
<li><a href="https://www.nngroup.com/articles/customer-journey-mapping/" target="_blank" rel="noopener">Nielsen Norman Group — Customer Journey Mapping</a> — free article.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@NNgroup" target="_blank" rel="noopener">Nielsen Norman Group</a> — UX &amp; CX research explained.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.uxpressia.com/" target="_blank" rel="noopener">UXPressia</a> — customer journey mapping &amp; persona tool (free tier).</li>
<li><a href="https://miro.com/templates/customer-journey-map/" target="_blank" rel="noopener">Miro — journey map templates</a> — free collaborative whiteboard templates.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — experience economy levels, 4E realms, CX/guest/audience experience definitions.</li>
<li><strong>Practice</strong> — build one persona and one journey map for a real service you use, plotting its emotion curve.</li>
<li><strong>Go deeper</strong> — touchpoints, moments of truth, servicescape, personalization &amp; technology.</li>
<li><strong>Job-ready</strong> — design a measurement plan (NPS/CSAT/CES) and a service recovery script for that same service.</li>
</ol></div>`,
    `<span class="eyebrow">GAD201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Thiết kế trải nghiệm Khách hàng &amp; Khán giả — kinh tế trải nghiệm, persona, bản đồ hành trình, điểm chạm, servicescape, cá nhân hoá và đo lường — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là các sách nền tảng (trích dẫn, không phát hành lại) cùng nguồn miễn phí, hợp pháp và công cụ.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của GAD201 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách nền tảng (trích dẫn, không phát hành lại ở đây)</h3>
<ul>
<li>Pine &amp; Gilmore — <em>The Experience Economy</em> — ý tưởng gốc trong bài Harvard Business Review <a href="https://hbr.org/1998/07/welcome-to-the-experience-economy" target="_blank" rel="noopener">"Welcome to the Experience Economy"</a>; tổng quan trên <a href="https://en.wikipedia.org/wiki/The_Experience_Economy" target="_blank" rel="noopener">Wikipedia</a>.</li>
<li>Bernd Schmitt — <em>Customer Experience Management</em> — nền tảng khái niệm tại <a href="https://en.wikipedia.org/wiki/Customer_experience" target="_blank" rel="noopener">Wikipedia: Customer experience</a>.</li>
<li>Alexander Rossman — <em>Designing Experiences</em> — trang nhà xuất bản tại <a href="https://cup.columbia.edu/book/designing-experiences/9780231193760" target="_blank" rel="noopener">Columbia University Press</a>.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.netpromotersystem.com/" target="_blank" rel="noopener">The Net Promoter System</a> — tài liệu chính thức về NPS của Bain &amp; Company.</li>
<li><a href="https://www.nngroup.com/articles/customer-journey-mapping/" target="_blank" rel="noopener">Nielsen Norman Group — Customer Journey Mapping</a> — bài viết miễn phí.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@NNgroup" target="_blank" rel="noopener">Nielsen Norman Group</a> — giải thích nghiên cứu UX &amp; CX.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.uxpressia.com/" target="_blank" rel="noopener">UXPressia</a> — công cụ lập bản đồ hành trình &amp; persona (có bản miễn phí).</li>
<li><a href="https://miro.com/templates/customer-journey-map/" target="_blank" rel="noopener">Miro — mẫu bản đồ hành trình</a> — mẫu bảng trắng cộng tác miễn phí.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — các cấp độ kinh tế trải nghiệm, bốn cõi 4E, định nghĩa CX/guest/audience experience.</li>
<li><strong>Luyện tập</strong> — dựng một persona và một bản đồ hành trình cho một dịch vụ thật bạn đang dùng, vẽ đường cảm xúc của nó.</li>
<li><strong>Đào sâu thực tế</strong> — điểm chạm, khoảnh khắc quyết định, servicescape, cá nhân hoá &amp; công nghệ.</li>
<li><strong>Sẵn sàng đi làm</strong> — thiết kế một kế hoạch đo lường (NPS/CSAT/CES) và một kịch bản phục hồi dịch vụ cho chính dịch vụ đó.</li>
</ol></div>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'GAD201',
    slug: 'gad201-guest-and-audience-experience-design',
    title: 'Guest and Audience Experience Design',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/GAD201.webp',
    shortDescription: 'Design memorable guest & audience experiences: experience economy, personas, journey maps, touchpoints & moments of truth, servicescapes, personalization, NPS/CSAT/CES, service recovery & CX trends. Bilingual, frameworks & quizzes.|||Thiết kế trải nghiệm khách hàng, khán giả đáng nhớ: kinh tế trải nghiệm, persona, bản đồ hành trình, điểm chạm & khoảnh khắc quyết định, servicescape, cá nhân hoá, NPS/CSAT/CES, phục hồi dịch vụ & xu hướng CX. Song ngữ, khung lý thuyết & quiz.',
    description: 'Môn <strong>GAD201 — Guest and Audience Experience Design</strong> (kỳ 4, khối Quản trị Kinh doanh) dạy cách <strong>thiết kế trải nghiệm khách hàng và khán giả một cách có chủ đích</strong>. Từ <strong>kinh tế trải nghiệm</strong> (Pine &amp; Gilmore) và <strong>thấu hiểu khách hàng/persona</strong> → <strong>bản đồ hành trình khách hàng</strong> → <strong>điểm chạm &amp; khoảnh khắc quyết định</strong> → <strong>trải nghiệm đa giác quan &amp; servicescape</strong> → <strong>cá nhân hoá &amp; công nghệ</strong> → <strong>đo lường (NPS/CSAT/CES)</strong> → <strong>phục hồi dịch vụ, quản trị trải nghiệm &amp; xu hướng</strong>. Bám giáo trình FLM, song ngữ, có khung lý thuyết, ví dụ thực tế và quiz mỗi chương.',
    whatYouLearn: 'Kinh tế trải nghiệm & bốn cõi 4E; CX/guest/audience experience; persona & empathy map; customer journey map & đường cảm xúc; touchpoint & Moments of Truth (FMOT/SMOT/UMOT/ZMOT); quy luật Peak-End; servicescape (Bitner) & thiết kế đa giác quan; cá nhân hoá (mass customization → hyper-personalization) & công nghệ (CRM, chatbot, app, AR/VR, omnichannel); NPS/CSAT/CES; nghịch lý phục hồi dịch vụ & quy trình phục hồi; quản trị CX (CXO, Voice of Customer); xu hướng bán lẻ trải nghiệm & cá nhân hoá AI.',
    requirements: 'Không yêu cầu kiến thức chuyên sâu trước đó. Nên có hiểu biết cơ bản về marketing/dịch vụ khách hàng.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách nền tảng, tài liệu miễn phí, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Kinh tế trải nghiệm, vì sao trải nghiệm là lợi thế cạnh tranh, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Kinh tế trải nghiệm|||Chapter 1 — Experience economy', description: 'Bốn cấp độ giá trị, 4E, CX/guest/audience experience.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Thấu hiểu khách hàng & persona|||Chapter 2 — Understanding customers & personas', description: 'Nhu cầu/kỳ vọng, persona, empathy map.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Bản đồ hành trình khách hàng|||Chapter 3 — Customer journey map', description: 'Giai đoạn, touchpoint, đường cảm xúc, cách xây dựng.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Điểm chạm & khoảnh khắc quyết định|||Chapter 4 — Touchpoints & moments of truth', description: 'Moments of Truth, quy luật Peak-End, ưu tiên thiết kế.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Trải nghiệm đa giác quan & servicescape|||Chapter 5 — Multisensory experience & servicescape', description: 'Mô hình Bitner, thiết kế 5 giác quan, bằng chứng vật lý.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Cá nhân hoá & công nghệ|||Chapter 6 — Personalization & technology', description: 'Mức cá nhân hoá, CRM, công nghệ, omnichannel.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Đo lường trải nghiệm|||Chapter 7 — Measuring experience', description: 'NPS, CSAT, CES — khi nào dùng chỉ số nào.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Phục hồi dịch vụ, quản trị & xu hướng|||Chapter 8 — Service recovery, governance & trends', description: 'Nghịch lý phục hồi, quy trình phục hồi, VoC, xu hướng.', lessons: [c8, c8q] },
  ],
};
