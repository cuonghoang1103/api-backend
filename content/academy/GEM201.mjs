/**
 * GEM201 — Managing Guest Experience. Giáo trình FLM (khối Quản trị Kinh
 * doanh, Kỳ 7, nâng cao): quản trị/vận hành trải nghiệm khách trong ngành
 * hospitality — kỳ vọng & SERVQUAL, hành trình khách, văn hoá dịch vụ &
 * trao quyền, cá nhân hoá & loyalty, phục hồi dịch vụ, công nghệ/dữ liệu,
 * đo lường & lãnh đạo trải nghiệm. Trích: Ford/Sturman "Managing Quality
 * Service in Hospitality"; Kandampully "Service Management"; Pine & Gilmore
 * "The Experience Economy". ⚠️ Có GAD201 (thiết kế trải nghiệm) — môn NÀY
 * thiên QUẢN TRỊ/vận hành, không phải thiết kế. Song ngữ + quiz.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('gem201-0-1-overview', 'Course overview: Managing Guest Experience|||Tổng quan: Quản trị Trải nghiệm Khách hàng',
  'GEM201 quản trị trải nghiệm khách ĐANG VẬN HÀNH trong hospitality — phân biệt với GAD201 (thiết kế trải nghiệm trên giấy). Lộ trình 8 chương.',
  [[
    `<span class="eyebrow">GEM201 · Lesson 0.1 · Overview</span>
<h2>Managing Guest Experience</h2>
<p class="lead">This course teaches you to <strong>manage</strong> the guest experience inside a hospitality operation — not to design it from scratch. A sister course, <strong>GAD201 (Guest Experience Design)</strong>, storyboards touchpoints and blueprints an experience before it exists; <strong>GEM201</strong> picks up from there and asks: once guests are checking in, how do you consistently <em>deliver</em> that experience, staff it, measure it, fix it when it breaks, and keep improving it — day after day, shift after shift?</p>
<h3>Two angles, one guest</h3>
<ul>
<li><strong>GAD201 — Design</strong> — experience economy, touchpoint mapping, service blueprinting, prototyping a NEW experience.</li>
<li><strong>GEM201 — Management (this course)</strong> — running an EXISTING service operation: expectations vs. delivered quality, the guest journey in a live property, service culture and staff empowerment, loyalty, complaint recovery, technology/data, and continuous improvement.</li>
</ul>
<h3>Roadmap</h3>
<p>Expectations &amp; service quality (SERVQUAL, gap model) → the guest lifecycle &amp; journey → service culture &amp; empowerment → personalization &amp; loyalty → complaint handling &amp; service recovery → technology &amp; data → measurement, continuous improvement &amp; experience leadership.</p>`,
    `<span class="eyebrow">GEM201 · Bài 0.1 · Tổng quan</span>
<h2>Quản trị Trải nghiệm Khách hàng</h2>
<p class="lead">Môn này dạy bạn <strong>quản trị</strong> trải nghiệm khách bên trong một cơ sở lưu trú/du lịch đang vận hành — không phải thiết kế nó từ đầu. Môn song sinh <strong>GAD201 (Thiết kế Trải nghiệm Khách hàng)</strong> vẽ hành trình chạm điểm và dựng bản thiết kế dịch vụ trước khi trải nghiệm tồn tại; <strong>GEM201</strong> tiếp nối từ đó và hỏi: khi khách đã check-in, làm sao <em>vận hành</em> đúng trải nghiệm đó một cách nhất quán, bố trí nhân sự, đo lường, sửa khi nó gãy, và liên tục cải tiến — ngày này qua ngày khác, ca này qua ca khác?</p>
<h3>Hai góc nhìn, một khách hàng</h3>
<ul>
<li><strong>GAD201 — Thiết kế</strong> — kinh tế trải nghiệm, lập bản đồ điểm chạm, thiết kế bản đồ dịch vụ (service blueprint), dựng thử một trải nghiệm MỚI.</li>
<li><strong>GEM201 — Quản trị (môn này)</strong> — vận hành một hệ thống dịch vụ ĐANG CHẠY: kỳ vọng so với chất lượng thực giao (SERVQUAL, mô hình khoảng cách), hành trình khách tại một cơ sở thật, văn hoá dịch vụ &amp; trao quyền nhân viên, khách thân thiết, xử lý phàn nàn &amp; phục hồi dịch vụ, công nghệ &amp; dữ liệu, và cải tiến liên tục.</li>
</ul>
<h3>Lộ trình</h3>
<p>Kỳ vọng &amp; chất lượng dịch vụ (SERVQUAL, mô hình khoảng cách) → vòng đời &amp; hành trình khách lưu trú → văn hoá dịch vụ &amp; trao quyền → cá nhân hoá &amp; khách thân thiết → xử lý phàn nàn &amp; phục hồi dịch vụ → công nghệ &amp; dữ liệu → đo lường, cải tiến liên tục &amp; lãnh đạo trải nghiệm.</p>`,
  ]]);

const c1 = doc('gem201-1-1-managing-guest-experience-hospitality', '1.1 — Managing guest experience in hospitality|||1.1 — Quản trị trải nghiệm khách trong hospitality',
  'Định nghĩa GEM, khoảnh khắc sự thật (moments of truth), chuỗi lợi nhuận dịch vụ (service-profit chain), phối hợp liên phòng ban.',
  [[
    `<span class="eyebrow">GEM201 · Chapter 1 · Lesson 1.1</span>
<h2>Managing guest experience in hospitality</h2>
<p class="lead">Guest Experience Management (GEM) is the discipline of <strong>planning, coordinating and controlling every interaction</strong> a guest has with a hospitality or tourism business — from the first search online to the review left after checkout — so that what actually gets delivered matches (or beats) what was promised.</p>
<h3>Moments of truth</h3>
<p>A <strong>moment of truth</strong> is any point where a guest forms an impression of the brand: the booking confirmation email, the doorman's greeting, the smell of the lobby, the wait at the front desk, room cleanliness, the speed of room service, the check-out line. GEM's job is to identify the moments that matter most and manage them deliberately, not leave them to chance.</p>
<h3>The service-profit chain</h3>
<pre><code>Internal service quality (training, tools, culture)
      -&gt; Employee satisfaction &amp; retention
      -&gt; Employee productivity &amp; service value
      -&gt; Guest satisfaction
      -&gt; Guest loyalty &amp; word-of-mouth
      -&gt; Revenue growth &amp; profitability
</code></pre>
<p>This chain (Heskett, Sasser &amp; Schlesinger) is the reason GEM starts INSIDE the organization — happy, well-trained, empowered staff is what produces a consistently good guest experience, which is what produces repeat bookings and referrals.</p>
<h3>Who owns the experience</h3>
<p>No single department owns the guest experience — front office, housekeeping, F&amp;B, spa, sales &amp; marketing, IT and revenue management all touch it. A guest experience manager's real job is <strong>orchestration</strong>: aligning standards, information and incentives across departments so the guest feels one seamless brand, not five disconnected teams.</p>
<div class="callout"><span class="badge">Not the same as GAD201</span> GAD201 designs the experience on paper (blueprints, touchpoints, prototypes). GEM201 keeps that design running correctly, every day, under real operational pressure — staffing shortages, overbooking, a broken air conditioner, an angry guest at 11pm.</div>`,
    `<span class="eyebrow">GEM201 · Chương 1 · Bài 1.1</span>
<h2>Quản trị trải nghiệm khách trong hospitality</h2>
<p class="lead">Quản trị Trải nghiệm Khách hàng (GEM) là ngành <strong>lập kế hoạch, phối hợp và kiểm soát mọi tương tác</strong> mà khách có với một doanh nghiệp lưu trú/du lịch — từ lần tìm kiếm online đầu tiên đến đánh giá để lại sau khi trả phòng — để thứ thực sự được giao khớp (hoặc vượt) thứ đã hứa.</p>
<h3>Khoảnh khắc sự thật (moments of truth)</h3>
<p>Một <strong>khoảnh khắc sự thật</strong> là bất kỳ điểm nào khách hình thành ấn tượng về thương hiệu: email xác nhận đặt phòng, lời chào của người gác cửa, mùi hương sảnh, thời gian chờ ở quầy lễ tân, độ sạch phòng, tốc độ phục vụ tại phòng, hàng chờ trả phòng. Việc của GEM là xác định những khoảnh khắc quan trọng nhất và quản trị chúng có chủ đích, không để mặc may rủi.</p>
<h3>Chuỗi lợi nhuận dịch vụ (service-profit chain)</h3>
<pre><code>Chất lượng dịch vụ nội bộ (đào tạo, công cụ, văn hoá)
      -&gt; Sự hài lòng &amp; giữ chân nhân viên
      -&gt; Năng suất nhân viên &amp; giá trị dịch vụ
      -&gt; Sự hài lòng của khách
      -&gt; Lòng trung thành &amp; truyền miệng của khách
      -&gt; Tăng trưởng doanh thu &amp; lợi nhuận
</code></pre>
<p>Chuỗi này (Heskett, Sasser &amp; Schlesinger) là lý do GEM bắt đầu từ BÊN TRONG tổ chức — nhân viên vui vẻ, được đào tạo tốt, được trao quyền là thứ tạo ra trải nghiệm khách nhất quán tốt, và đó là thứ tạo ra đặt phòng lặp lại và giới thiệu.</p>
<h3>Ai sở hữu trải nghiệm</h3>
<p>Không phòng ban nào một mình sở hữu trải nghiệm khách — lễ tân, buồng phòng, F&amp;B, spa, kinh doanh &amp; marketing, IT và quản trị doanh thu đều chạm vào nó. Việc thật sự của người quản trị trải nghiệm khách là <strong>dàn nhạc</strong>: gắn kết chuẩn mực, thông tin và động lực xuyên phòng ban để khách cảm nhận một thương hiệu liền mạch, không phải năm đội rời rạc.</p>
<div class="callout"><span class="badge">Không giống GAD201</span> GAD201 thiết kế trải nghiệm trên giấy (bản đồ dịch vụ, điểm chạm, bản mẫu thử). GEM201 giữ cho thiết kế đó chạy đúng, mỗi ngày, dưới áp lực vận hành thật — thiếu nhân sự, overbook, máy lạnh hỏng, khách giận lúc 11 giờ đêm.</div>`,
  ]]);

const c1q = quiz('gem201-quiz-1', 'Quiz 1 — Managing guest experience|||Quiz 1 — Quản trị trải nghiệm khách', [
  { id: 'q1', question: 'GEM201 khác GAD201 ở điểm nào?', options: ['GEM thiết kế trải nghiệm mới, GAD vận hành nó', 'GEM vận hành trải nghiệm đang chạy, GAD thiết kế trải nghiệm trên giấy', 'Hai môn học hoàn toàn giống nhau', 'GEM chỉ dành cho bộ phận IT'], correctIndex: 1, explanation: 'GAD201 thiết kế (blueprint, touchpoint); GEM201 vận hành, quản trị hằng ngày.' },
  { id: 'q2', question: 'Khoảnh khắc sự thật (moment of truth) là gì?', options: ['Thời điểm khách thanh toán hoá đơn', 'Bất kỳ điểm nào khách hình thành ấn tượng về thương hiệu', 'Cuộc họp giao ca của nhân viên', 'Báo cáo tài chính cuối kỳ'], correctIndex: 1, explanation: 'Là mọi điểm chạm khách hình thành ấn tượng, từ email xác nhận đến check-out.' },
  { id: 'q3', question: 'Chuỗi lợi nhuận dịch vụ (service-profit chain) bắt đầu từ đâu?', options: ['Lợi nhuận và tăng trưởng doanh thu', 'Chất lượng dịch vụ nội bộ (đào tạo, văn hoá)', 'Lòng trung thành của khách', 'Quảng cáo marketing'], correctIndex: 1, explanation: 'Chuỗi bắt đầu từ bên trong: dịch vụ nội bộ tốt → nhân viên hài lòng → khách hài lòng → lợi nhuận.' },
]);

const c2 = doc('gem201-2-1-expectations-service-quality', '2.1 — Guest expectations & service quality|||2.1 — Kỳ vọng khách hàng & chất lượng dịch vụ',
  'Vùng khoan dung, SERVQUAL (RATER 5 chiều), mô hình 5 khoảng cách (gap model) — nơi chất lượng dịch vụ gãy.',
  [[
    `<span class="eyebrow">GEM201 · Chapter 2 · Lesson 2.1</span>
<h2>Guest expectations &amp; service quality</h2>
<h3>What guests expect</h3>
<p>Guests hold two expectation levels: <strong>desired service</strong> (what they hope for) and <strong>adequate service</strong> (the minimum they'll accept). The gap between them is the <strong>zone of tolerance</strong> — inside it, small slips go unnoticed; outside it (above or below), the guest reacts strongly, good or bad.</p>
<h3>SERVQUAL — five dimensions (RATER)</h3>
<ul>
<li><strong>Reliability</strong> — delivering the promised service dependably and accurately (the room is ready when promised).</li>
<li><strong>Assurance</strong> — staff knowledge and courtesy that inspire trust and confidence.</li>
<li><strong>Tangibles</strong> — physical facilities, equipment, staff appearance, cleanliness.</li>
<li><strong>Empathy</strong> — caring, individualized attention to each guest.</li>
<li><strong>Responsiveness</strong> — willingness to help promptly.</li>
</ul>
<p>Guests measure quality as the <strong>gap between what they expected and what they perceived</strong> on each dimension — this is the SERVQUAL instrument, still the most-cited service-quality survey in hospitality research.</p>
<h3>The gap model — where quality breaks down</h3>
<pre><code>Gap 1 - Knowledge gap:     management doesn't know what guests really expect
Gap 2 - Standards gap:     expectations aren't translated into service standards
Gap 3 - Delivery gap:      standards exist but staff don't/can't deliver them
Gap 4 - Communication gap: marketing promises more than operations delivers
Gap 5 - Customer gap:      expected service vs. perceived service (the guest's own verdict)
</code></pre>
<p>Gap 5 is the one guests feel; gaps 1-4 are the internal causes a manager must close to shrink it.</p>
<div class="callout"><span class="badge">Practical use</span> When a property gets consistently 4-star (not 5-star) reviews on "cleanliness" but staff insist rooms ARE clean, that's a Gap 1/2 problem — management's definition of "clean" doesn't match what guests expect, not a training failure.</div>`,
    `<span class="eyebrow">GEM201 · Chương 2 · Bài 2.1</span>
<h2>Kỳ vọng khách hàng &amp; chất lượng dịch vụ</h2>
<h3>Khách kỳ vọng gì</h3>
<p>Khách giữ hai mức kỳ vọng: <strong>dịch vụ mong muốn</strong> (điều họ hy vọng) và <strong>dịch vụ đủ dùng</strong> (mức tối thiểu họ chấp nhận). Khoảng cách giữa hai mức là <strong>vùng khoan dung (zone of tolerance)</strong> — bên trong vùng này, sai sót nhỏ không bị để ý; ngoài vùng (cao hơn hoặc thấp hơn), khách phản ứng mạnh, tốt hoặc xấu.</p>
<h3>SERVQUAL — năm chiều (RATER)</h3>
<ul>
<li><strong>Reliability (Tin cậy)</strong> — giao đúng dịch vụ đã hứa, đáng tin cậy và chính xác (phòng sẵn sàng đúng giờ đã hứa).</li>
<li><strong>Assurance (Đảm bảo)</strong> — kiến thức và sự lịch thiệp của nhân viên tạo niềm tin.</li>
<li><strong>Tangibles (Hữu hình)</strong> — cơ sở vật chất, thiết bị, ngoại hình nhân viên, độ sạch.</li>
<li><strong>Empathy (Đồng cảm)</strong> — quan tâm cá nhân hoá tới từng khách.</li>
<li><strong>Responsiveness (Đáp ứng)</strong> — sẵn lòng giúp đỡ nhanh chóng.</li>
</ul>
<p>Khách đo chất lượng bằng <strong>khoảng cách giữa điều họ kỳ vọng và điều họ cảm nhận</strong> trên mỗi chiều — đây là công cụ SERVQUAL, khảo sát chất lượng dịch vụ được trích dẫn nhiều nhất trong nghiên cứu hospitality.</p>
<h3>Mô hình khoảng cách — chất lượng gãy ở đâu</h3>
<pre><code>Gap 1 - Khoảng cách hiểu biết:    quản lý không biết khách thực sự kỳ vọng gì
Gap 2 - Khoảng cách chuẩn mực:    kỳ vọng không được dịch thành chuẩn dịch vụ
Gap 3 - Khoảng cách giao dịch vụ: có chuẩn nhưng nhân viên không/không thể làm đúng
Gap 4 - Khoảng cách truyền thông: marketing hứa nhiều hơn vận hành giao được
Gap 5 - Khoảng cách khách hàng:   dịch vụ kỳ vọng so với dịch vụ cảm nhận (phán quyết của khách)
</code></pre>
<p>Gap 5 là thứ khách cảm nhận được; gap 1-4 là nguyên nhân nội bộ mà quản lý phải thu hẹp để giảm Gap 5.</p>
<div class="callout"><span class="badge">Dùng thực tế</span> Khi một cơ sở luôn nhận đánh giá 4 sao (không phải 5) cho mục "độ sạch" nhưng nhân viên khẳng định phòng ĐÃ sạch, đó là vấn đề Gap 1/2 — định nghĩa "sạch" của quản lý không khớp kỳ vọng của khách, không phải lỗi đào tạo.</div>`,
  ]]);

const c2q = quiz('gem201-quiz-2', 'Quiz 2 — Expectations & SERVQUAL|||Quiz 2 — Kỳ vọng & SERVQUAL', [
  { id: 'q1', question: 'SERVQUAL đo chất lượng dịch vụ bằng cách nào?', options: ['Đếm số lượng nhân viên', 'Khoảng cách giữa điều khách kỳ vọng và điều khách cảm nhận', 'So sánh giá phòng với đối thủ', 'Đo diện tích sảnh'], correctIndex: 1, explanation: 'SERVQUAL đo gap giữa kỳ vọng và cảm nhận trên 5 chiều RATER.' },
  { id: 'q2', question: 'Chữ R trong RATER (SERVQUAL) là viết tắt của?', options: ['Revenue', 'Reliability (Tin cậy)', 'Recovery', 'Recognition'], correctIndex: 1, explanation: 'Reliability — giao đúng dịch vụ đã hứa, đáng tin cậy.' },
  { id: 'q3', question: 'Gap 5 trong mô hình khoảng cách là gì?', options: ['Khoảng cách giữa quản lý và nhân viên', 'Khoảng cách giữa dịch vụ kỳ vọng và dịch vụ cảm nhận của khách', 'Khoảng cách giữa marketing và vận hành', 'Khoảng cách giữa hai ca làm việc'], correctIndex: 1, explanation: 'Gap 5 là khoảng cách khách hàng cảm nhận được, hệ quả của Gap 1-4.' },
]);

const c3 = doc('gem201-3-1-guest-lifecycle-journey', '3.1 — Guest lifecycle & journey|||3.1 — Vòng đời & hành trình khách lưu trú',
  'Năm giai đoạn kỳ lưu trú, quy tắc đỉnh-kết (peak-end rule), đường nối giữa phòng ban, thiết kế đoạn kết.',
  [[
    `<span class="eyebrow">GEM201 · Chapter 3 · Lesson 3.1</span>
<h2>Guest lifecycle &amp; journey</h2>
<h3>Five stages of a stay</h3>
<pre><code>1. Pre-arrival -&gt; booking, confirmation, pre-arrival messages, upsell
2. Arrival     -&gt; check-in, first impression, room orientation
3. In-stay     -&gt; housekeeping, F&amp;B, requests, activities, problem resolution
4. Departure   -&gt; check-out, billing, luggage, farewell
5. Post-stay   -&gt; review requests, loyalty follow-up, re-engagement offers
</code></pre>
<p>Each stage has its own touchpoints, owning department, and failure modes — mapping them (as a <strong>guest journey map</strong>) lets a manager see the whole stay the way a guest lives it, not the way the org chart is drawn.</p>
<h3>The peak-end rule</h3>
<p>Behavioral research (Kahneman) shows people judge an experience mostly by its <strong>most intense moment</strong> (peak — good or bad) and its <strong>ending</strong>, largely ignoring duration and the average of everything in between. A stay with one excellent surprise and a smooth check-out is remembered far better than a stay that was "fine" throughout but ended in a slow, confusing check-out line.</p>
<h3>Managing the journey, not just the touchpoints</h3>
<ul>
<li><strong>Consistency across stages</strong> — a warm arrival followed by a cold, transactional departure damages the overall memory disproportionately (recency effect).</li>
<li><strong>Handoffs between departments</strong> — most journey failures happen at the SEAM between two departments (front office → housekeeping, F&amp;B → billing), not inside a single one.</li>
<li><strong>Design the ending deliberately</strong> — a fast, warm check-out with a genuine send-off is one of the highest-leverage investments in guest experience management.</li>
</ul>
<div class="callout"><span class="badge">Journey map vs. blueprint</span> A guest journey map (this chapter) traces the guest's lived experience across stages. A service blueprint (GAD201) additionally exposes the backstage processes and systems behind each front-stage step — the two are complementary lenses on the same stay.</div>`,
    `<span class="eyebrow">GEM201 · Chương 3 · Bài 3.1</span>
<h2>Vòng đời &amp; hành trình khách lưu trú</h2>
<h3>Năm giai đoạn của một kỳ lưu trú</h3>
<pre><code>1. Trước khi đến -&gt; đặt phòng, xác nhận, nhắn tin trước khi đến, upsell
2. Đến nơi        -&gt; check-in, ấn tượng đầu, hướng dẫn phòng
3. Trong kỳ ở     -&gt; buồng phòng, F&amp;B, yêu cầu, hoạt động, xử lý sự cố
4. Rời đi         -&gt; check-out, thanh toán, hành lý, tiễn khách
5. Sau kỳ ở       -&gt; xin đánh giá, chăm sóc khách thân thiết, ưu đãi mời quay lại
</code></pre>
<p>Mỗi giai đoạn có điểm chạm, phòng ban sở hữu và kiểu lỗi riêng — vẽ chúng thành <strong>bản đồ hành trình khách (guest journey map)</strong> giúp quản lý nhìn toàn bộ kỳ lưu trú theo cách khách trải nghiệm, không theo cách sơ đồ tổ chức được vẽ.</p>
<h3>Quy tắc đỉnh-kết (peak-end rule)</h3>
<p>Nghiên cứu hành vi (Kahneman) cho thấy con người đánh giá một trải nghiệm chủ yếu qua <strong>khoảnh khắc mãnh liệt nhất</strong> (đỉnh — tốt hoặc xấu) và <strong>đoạn kết</strong>, gần như bỏ qua thời lượng và trung bình mọi thứ ở giữa. Một kỳ ở có một bất ngờ xuất sắc và check-out trơn tru được nhớ tốt hơn nhiều so với một kỳ ở "ổn" xuyên suốt nhưng kết thúc bằng hàng chờ check-out chậm, rối.</p>
<h3>Quản trị hành trình, không chỉ từng điểm chạm</h3>
<ul>
<li><strong>Nhất quán xuyên giai đoạn</strong> — đón khách nồng nhiệt rồi tiễn khách lạnh lùng, giao dịch thuần tuý sẽ làm hỏng ký ức tổng thể không tương xứng (hiệu ứng gần đây nhất).</li>
<li><strong>Bàn giao giữa các phòng ban</strong> — hầu hết lỗi hành trình xảy ra ở ĐƯỜNG NỐI giữa hai phòng ban (lễ tân → buồng phòng, F&amp;B → thu ngân), không phải bên trong một phòng ban.</li>
<li><strong>Thiết kế đoạn kết có chủ đích</strong> — check-out nhanh, ấm áp kèm lời tiễn chân thật là một trong những khoản đầu tư đòn bẩy cao nhất của quản trị trải nghiệm khách.</li>
</ul>
<div class="callout"><span class="badge">Bản đồ hành trình so với bản đồ dịch vụ</span> Bản đồ hành trình khách (chương này) vẽ trải nghiệm sống của khách qua các giai đoạn. Bản đồ dịch vụ (GAD201) còn phơi bày quy trình và hệ thống hậu trường phía sau mỗi bước tiền trường — hai góc nhìn bổ sung cho cùng một kỳ lưu trú.</div>`,
  ]]);

const c3q = quiz('gem201-quiz-3', 'Quiz 3 — Guest lifecycle & journey|||Quiz 3 — Vòng đời & hành trình khách', [
  { id: 'q1', question: 'Quy tắc đỉnh-kết (peak-end rule) nói gì?', options: ['Khách chỉ nhớ giá phòng', 'Khách đánh giá trải nghiệm chủ yếu qua khoảnh khắc mãnh liệt nhất và đoạn kết', 'Khách chỉ nhớ ấn tượng đầu tiên', 'Khách quên hết sau khi rời khách sạn'], correctIndex: 1, explanation: 'Con người đánh giá trải nghiệm qua đỉnh và đoạn kết, không phải trung bình toàn bộ.' },
  { id: 'q2', question: 'Hầu hết lỗi trong hành trình khách xảy ra ở đâu?', options: ['Bên trong một phòng ban duy nhất', 'Ở đường nối (bàn giao) giữa hai phòng ban', 'Chỉ ở khâu thanh toán', 'Chỉ ở khâu đặt phòng online'], correctIndex: 1, explanation: 'Lỗi thường xảy ra ở điểm bàn giao giữa các phòng ban, vd lễ tân sang buồng phòng.' },
  { id: 'q3', question: 'Bản đồ hành trình khách khác bản đồ dịch vụ (service blueprint) ở điểm nào?', options: ['Hai loại bản đồ hoàn toàn giống nhau', 'Bản đồ hành trình vẽ trải nghiệm khách; bản đồ dịch vụ còn phơi bày quy trình hậu trường', 'Bản đồ hành trình chỉ dùng cho marketing', 'Bản đồ dịch vụ chỉ áp dụng cho spa'], correctIndex: 1, explanation: 'Journey map theo góc nhìn khách; service blueprint (GAD201) thêm góc nhìn hậu trường.' },
]);

const c4 = doc('gem201-4-1-service-culture-empowerment', '4.1 — Service culture & employee empowerment|||4.1 — Văn hoá dịch vụ & trao quyền nhân viên',
  'Tuyển theo thái độ, ba yếu tố trao quyền (thẩm quyền/thông tin/hậu thuẫn), marketing nội bộ.',
  [[
    `<span class="eyebrow">GEM201 · Chapter 4 · Lesson 4.1</span>
<h2>Service culture &amp; employee empowerment</h2>
<h3>What a service culture is</h3>
<p>A <strong>service culture</strong> is the shared set of values and everyday behaviors ("how we treat guests around here") that a hospitality organization lives, not just writes in a manual. It's built through <strong>hiring for attitude, training for skill</strong> — technical skills (POS systems, check-in procedures) can be taught quickly; warmth, attentiveness and problem-solving instinct are much harder to instill after the fact.</p>
<h3>Empowerment — letting staff act</h3>
<p>Empowerment means giving front-line staff the <strong>authority, information and resources</strong> to resolve a guest issue on the spot, without escalating up a chain of approvals. A widely cited example: the Ritz-Carlton famously authorizes any employee to spend up to a set amount per guest, per incident, to fix a problem immediately — no manager sign-off required.</p>
<pre><code>Empowerment needs three things together:
 1. Authority    - permission to decide and spend, within a limit
 2. Information  - guest history, standards, what "good" looks like
 3. Support      - management backs the employee's judgment call
</code></pre>
<p>Give authority without information or support and staff either freeze (afraid to use it) or misuse it — empowerment fails when only one of the three is present.</p>
<h3>Internal marketing &amp; the engagement link</h3>
<p>Treat employees as your "first customers": communicate standards clearly, recognize good service publicly, and involve staff in shaping procedures. This is <strong>internal marketing</strong>, and it closes the loop back to the service-profit chain from Chapter 1 — engaged employees are the mechanism, not a side benefit.</p>
<div class="callout"><span class="badge">Culture beats scripts</span> A memorized greeting script produces consistency but not warmth. A strong service culture lets staff improvise the RIGHT response to a situation no script anticipated — which is most of what actually goes wrong on a shift.</div>`,
    `<span class="eyebrow">GEM201 · Chương 4 · Bài 4.1</span>
<h2>Văn hoá dịch vụ &amp; trao quyền nhân viên</h2>
<h3>Văn hoá dịch vụ là gì</h3>
<p>Một <strong>văn hoá dịch vụ</strong> là tập giá trị chung và hành vi hằng ngày ("ở đây chúng tôi đối xử với khách thế nào") mà một tổ chức hospitality thực sự sống cùng, không chỉ viết trong sổ tay. Nó được xây bằng cách <strong>tuyển theo thái độ, đào tạo theo kỹ năng</strong> — kỹ năng kỹ thuật (hệ thống POS, quy trình check-in) dạy nhanh được; sự ấm áp, chu đáo và bản năng giải quyết vấn đề khó cấy vào sau hơn nhiều.</p>
<h3>Trao quyền — để nhân viên hành động</h3>
<p>Trao quyền nghĩa là cho nhân viên tuyến đầu <strong>thẩm quyền, thông tin và nguồn lực</strong> để xử lý sự cố của khách ngay tại chỗ, không phải đẩy lên qua chuỗi phê duyệt. Ví dụ được trích dẫn rộng rãi: Ritz-Carlton cho phép bất kỳ nhân viên nào chi một mức tiền nhất định cho mỗi khách, mỗi sự cố, để khắc phục ngay lập tức — không cần quản lý ký duyệt.</p>
<pre><code>Trao quyền cần cả ba thứ cùng lúc:
 1. Thẩm quyền   - được phép quyết định và chi, trong giới hạn
 2. Thông tin    - lịch sử khách, chuẩn mực, "tốt" trông như thế nào
 3. Hậu thuẫn    - quản lý đứng sau quyết định của nhân viên
</code></pre>
<p>Cho thẩm quyền mà thiếu thông tin hoặc hậu thuẫn thì nhân viên hoặc đóng băng (sợ dùng) hoặc dùng sai — trao quyền thất bại khi chỉ có một trong ba thứ.</p>
<h3>Marketing nội bộ &amp; mối liên hệ gắn kết</h3>
<p>Đối xử với nhân viên như "khách hàng đầu tiên": truyền đạt chuẩn mực rõ ràng, công khai ghi nhận dịch vụ tốt, và để nhân viên tham gia định hình quy trình. Đây là <strong>marketing nội bộ</strong>, và nó khép vòng lặp về lại chuỗi lợi nhuận dịch vụ ở Chương 1 — nhân viên gắn kết là cơ chế, không phải lợi ích phụ.</p>
<div class="callout"><span class="badge">Văn hoá thắng kịch bản</span> Một câu chào học thuộc tạo ra sự nhất quán nhưng không tạo ra sự ấm áp. Một văn hoá dịch vụ mạnh cho phép nhân viên ứng biến phản hồi ĐÚNG cho một tình huống không kịch bản nào lường trước — mà đó lại là phần lớn thứ thực sự trục trặc trong một ca làm.</div>`,
  ]]);

const c4q = quiz('gem201-quiz-4', 'Quiz 4 — Service culture & empowerment|||Quiz 4 — Văn hoá dịch vụ & trao quyền', [
  { id: 'q1', question: 'Trao quyền (empowerment) hiệu quả cần đủ ba yếu tố nào?', options: ['Lương, thưởng, phúc lợi', 'Thẩm quyền, thông tin, hậu thuẫn', 'Camera giám sát, KPI, kỷ luật', 'Đồng phục, bảng tên, huy hiệu'], correctIndex: 1, explanation: 'Thiếu một trong ba (thẩm quyền/thông tin/hậu thuẫn) thì trao quyền thất bại.' },
  { id: 'q2', question: 'Nguyên tắc tuyển dụng phổ biến để xây văn hoá dịch vụ là gì?', options: ['Tuyển theo bằng cấp cao nhất', 'Tuyển theo thái độ, đào tạo theo kỹ năng', 'Tuyển người có kinh nghiệm lâu nhất', 'Tuyển người trả lương thấp nhất'], correctIndex: 1, explanation: 'Kỹ năng kỹ thuật dạy nhanh được; thái độ và sự ấm áp khó cấy vào sau.' },
  { id: 'q3', question: 'Marketing nội bộ (internal marketing) trong GEM là gì?', options: ['Quảng cáo khách sạn trên mạng xã hội', 'Đối xử với nhân viên như khách hàng đầu tiên của tổ chức', 'Bán quà lưu niệm cho nhân viên', 'Marketing chỉ nhắm tới khách VIP'], correctIndex: 1, explanation: 'Marketing nội bộ truyền đạt chuẩn mực, ghi nhận nhân viên, khép vòng service-profit chain.' },
]);

const c5 = doc('gem201-5-1-personalization-loyalty', '5.1 — Personalization & loyalty management|||5.1 — Cá nhân hoá & quản lý khách hàng thân thiết',
  'Ba cấp độ cá nhân hoá, điểm thưởng/hạng, phân khúc RFM, ranh giới cá nhân hoá và riêng tư.',
  [[
    `<span class="eyebrow">GEM201 · Chapter 5 · Lesson 5.1</span>
<h2>Personalization &amp; loyalty management</h2>
<h3>Three levels of personalization</h3>
<pre><code>Recognize   -&gt; know who the guest is (name, past stays) at every touchpoint
Remember    -&gt; use guest history (preferences, past complaints, special dates)
Anticipate  -&gt; act on a need before the guest states it
</code></pre>
<p>Most properties stop at "recognize" (a name on a welcome card). The leverage is in <strong>remember</strong> and <strong>anticipate</strong> — both require a shared guest profile that every department can see and update, not a notebook at the front desk.</p>
<h3>Loyalty programs</h3>
<ul>
<li><strong>Points</strong> — earned per stay/spend, redeemable for free nights or upgrades; drives repeat bookings.</li>
<li><strong>Tiers/status</strong> — silver/gold/platinum unlock recognizable perks (late check-out, lounge access, room upgrades) that create both loyalty AND public status signaling.</li>
<li><strong>RFM segmentation</strong> — Recency, Frequency, Monetary value: segment guests by how recently, how often, and how much they spend, so recognition and offers match each guest's real value, not a one-size-fits-all blast.</li>
</ul>
<h3>Personalization vs. privacy</h3>
<p>Guest data is powerful precisely because it's sensitive — dietary restrictions, health-related requests, relationship status observed during a stay. Good GEM practice: collect only what improves the stay, secure it, and never let personalization feel like surveillance (e.g. mentioning something a guest never told THIS staff member is a common way "impressive" personalization turns creepy).</p>
<div class="callout"><span class="badge">Loyalty is a lagging indicator</span> A guest doesn't become loyal because of the points program — they join the points program because the stays were already consistently good. Loyalty mechanics amplify a strong experience; they can't manufacture one.</div>`,
    `<span class="eyebrow">GEM201 · Chương 5 · Bài 5.1</span>
<h2>Cá nhân hoá &amp; quản lý khách hàng thân thiết</h2>
<h3>Ba cấp độ cá nhân hoá</h3>
<pre><code>Nhận diện   -&gt; biết khách là ai (tên, lịch sử lưu trú) ở mọi điểm chạm
Ghi nhớ     -&gt; dùng lịch sử khách (sở thích, phàn nàn cũ, ngày đặc biệt)
Đoán trước  -&gt; hành động cho một nhu cầu trước khi khách nói ra
</code></pre>
<p>Hầu hết cơ sở dừng ở "nhận diện" (một cái tên trên thẻ chào mừng). Đòn bẩy nằm ở <strong>ghi nhớ</strong> và <strong>đoán trước</strong> — cả hai đều cần một hồ sơ khách dùng chung mà mọi phòng ban đều xem và cập nhật được, không phải một cuốn sổ ở quầy lễ tân.</p>
<h3>Chương trình khách thân thiết</h3>
<ul>
<li><strong>Điểm thưởng</strong> — tích theo kỳ ở/chi tiêu, đổi được đêm miễn phí hoặc nâng hạng; thúc đẩy đặt phòng lặp lại.</li>
<li><strong>Hạng/status</strong> — bạc/vàng/bạch kim mở khoá đặc quyền dễ nhận biết (trả phòng trễ, vào lounge, nâng hạng phòng) tạo ra cả lòng trung thành LẪN tín hiệu địa vị công khai.</li>
<li><strong>Phân khúc RFM</strong> — Recency (gần đây), Frequency (tần suất), Monetary (giá trị chi tiêu): phân khúc khách theo mức độ gần đây, thường xuyên và chi tiêu, để nhận diện và ưu đãi khớp giá trị thật của từng khách, không phải một thông điệp bắn hàng loạt.</li>
</ul>
<h3>Cá nhân hoá so với riêng tư</h3>
<p>Dữ liệu khách mạnh chính vì nó nhạy cảm — hạn chế ăn uống, yêu cầu liên quan sức khoẻ, tình trạng quan hệ quan sát được trong kỳ ở. Thực hành GEM tốt: chỉ thu thập thứ cải thiện kỳ ở, bảo mật nó, và không bao giờ để cá nhân hoá cảm giác như giám sát (vd nhắc tới điều khách chưa từng nói với ĐÚNG nhân viên này là cách phổ biến khiến cá nhân hoá "ấn tượng" biến thành rợn người).</p>
<div class="callout"><span class="badge">Trung thành là chỉ số trễ</span> Khách không trung thành VÌ chương trình điểm thưởng — họ tham gia chương trình điểm thưởng VÌ các kỳ ở đã nhất quán tốt sẵn. Cơ chế loyalty khuếch đại một trải nghiệm mạnh; nó không thể tạo ra trải nghiệm đó từ đầu.</div>`,
  ]]);

const c5q = quiz('gem201-quiz-5', 'Quiz 5 — Personalization & loyalty|||Quiz 5 — Cá nhân hoá & khách thân thiết', [
  { id: 'q1', question: 'Ba cấp độ cá nhân hoá theo thứ tự tăng dần là gì?', options: ['Ghi nhớ → Nhận diện → Đoán trước', 'Nhận diện → Ghi nhớ → Đoán trước', 'Đoán trước → Ghi nhớ → Nhận diện', 'Nhận diện → Đoán trước → Ghi nhớ'], correctIndex: 1, explanation: 'Từ nhận diện tên, đến ghi nhớ lịch sử, đến đoán trước nhu cầu.' },
  { id: 'q2', question: 'RFM trong phân khúc khách thân thiết là viết tắt của?', options: ['Recency, Frequency, Monetary', 'Reward, Frequency, Membership', 'Recency, Feedback, Marketing', 'Retention, Frequency, Membership'], correctIndex: 0, explanation: 'Recency (gần đây), Frequency (tần suất), Monetary (giá trị chi tiêu).' },
  { id: 'q3', question: 'Vì sao lòng trung thành được gọi là chỉ số trễ (lagging indicator)?', options: ['Vì chương trình điểm thưởng tạo ra lòng trung thành trước', 'Vì lòng trung thành là kết quả của trải nghiệm đã nhất quán tốt từ trước', 'Vì hệ thống CRM luôn báo cáo trễ', 'Vì khách luôn quên đăng ký chương trình'], correctIndex: 1, explanation: 'Cơ chế loyalty khuếch đại trải nghiệm tốt sẵn có, không tự tạo ra nó.' },
]);

const c6 = doc('gem201-6-1-complaint-service-recovery', '6.1 — Complaint handling & service recovery|||6.1 — Xử lý phàn nàn & phục hồi dịch vụ',
  'Nghịch lý phục hồi dịch vụ, khung phục hồi 4 bước, phàn nàn như dữ liệu, cam kết dịch vụ.',
  [[
    `<span class="eyebrow">GEM201 · Chapter 6 · Lesson 6.1</span>
<h2>Complaint handling &amp; service recovery</h2>
<h3>The service recovery paradox</h3>
<p>Research on service failures found something counterintuitive: a guest whose problem is <strong>fixed quickly and well</strong> can end up MORE satisfied than a guest who never had a problem at all — this is the <strong>service recovery paradox</strong>. It doesn't mean managers should welcome failures, but it does mean a failure is not automatically a lost guest; how it's handled matters more than the fact it happened.</p>
<h3>A four-step recovery framework</h3>
<pre><code>1. Acknowledge -&gt; listen fully, without interrupting or getting defensive
2. Apologize   -&gt; a genuine, specific apology (not "sorry you feel that way")
3. Act         -&gt; fix it now, within the empowerment limits from Chapter 4
4. Follow up   -&gt; check back after the fact; log the incident in the guest profile
</code></pre>
<p>Speed matters as much as the fix itself — a guest who complains and is ignored for hours has already formed a verdict about the brand before any solution arrives.</p>
<h3>Complaints are data, not just incidents</h3>
<p>Every logged complaint is a free signal about where the operation's standards, training or design are failing. A property that tracks complaint categories over time (e.g. slow room service, AC issues, noise) can fix root causes instead of repeatedly apologizing for the same failure to different guests.</p>
<h3>Service guarantees</h3>
<p>Some hospitality brands publish an explicit <strong>service guarantee</strong> ("if X isn't right, we'll do Y") — this forces the organization to actually meet the standard (a public promise is harder to quietly ignore) and gives front-line staff a pre-authorized recovery action, removing hesitation.</p>
<div class="callout"><span class="badge">Never argue the guest's feelings</span> A guest's factual claim can be wrong; their feeling of being wronged is never wrong to THEM. Recovery starts by validating the feeling first, and solving the fact second.</div>`,
    `<span class="eyebrow">GEM201 · Chương 6 · Bài 6.1</span>
<h2>Xử lý phàn nàn &amp; phục hồi dịch vụ</h2>
<h3>Nghịch lý phục hồi dịch vụ</h3>
<p>Nghiên cứu về sự cố dịch vụ phát hiện điều ngược trực giác: một khách có vấn đề được <strong>khắc phục nhanh và tốt</strong> có thể hài lòng HƠN cả một khách chưa từng gặp vấn đề gì — đây là <strong>nghịch lý phục hồi dịch vụ (service recovery paradox)</strong>. Điều này không có nghĩa quản lý nên hoan nghênh sự cố, nhưng nó có nghĩa một sự cố không tự động là mất khách — cách xử lý quan trọng hơn việc nó xảy ra.</p>
<h3>Khung phục hồi bốn bước</h3>
<pre><code>1. Ghi nhận  -&gt; lắng nghe trọn vẹn, không ngắt lời hay phòng thủ
2. Xin lỗi   -&gt; lời xin lỗi chân thành, cụ thể (không phải "tiếc là bạn thấy vậy")
3. Hành động -&gt; khắc phục ngay, trong giới hạn trao quyền ở Chương 4
4. Theo sát  -&gt; hỏi lại sau đó; ghi sự cố vào hồ sơ khách
</code></pre>
<p>Tốc độ quan trọng ngang với bản thân cách khắc phục — một khách phàn nàn rồi bị lơ hàng giờ đã hình thành phán quyết về thương hiệu trước khi giải pháp nào tới.</p>
<h3>Phàn nàn là dữ liệu, không chỉ là sự cố</h3>
<p>Mỗi phàn nàn được ghi lại là một tín hiệu miễn phí về nơi chuẩn mực, đào tạo hay thiết kế vận hành đang gãy. Một cơ sở theo dõi loại phàn nàn theo thời gian (vd phục vụ phòng chậm, trục trặc máy lạnh, ồn) có thể sửa tận gốc thay vì lặp lại xin lỗi cùng một lỗi cho các khách khác nhau.</p>
<h3>Cam kết dịch vụ (service guarantee)</h3>
<p>Một số thương hiệu hospitality công bố <strong>cam kết dịch vụ</strong> rõ ràng ("nếu X không đúng, chúng tôi sẽ làm Y") — điều này buộc tổ chức thực sự đạt chuẩn (một lời hứa công khai khó lờ đi âm thầm) và cho nhân viên tuyến đầu một hành động phục hồi được phê duyệt sẵn, xoá bỏ do dự.</p>
<div class="callout"><span class="badge">Đừng bao giờ tranh cãi cảm xúc của khách</span> Nhận định thực tế của khách có thể sai; cảm giác bị đối xử tệ của họ không bao giờ sai ĐỐI VỚI HỌ. Phục hồi bắt đầu bằng công nhận cảm xúc trước, giải quyết sự việc sau.</div>`,
  ]]);

const c6q = quiz('gem201-quiz-6', 'Quiz 6 — Complaint & recovery|||Quiz 6 — Phàn nàn & phục hồi dịch vụ', [
  { id: 'q1', question: 'Nghịch lý phục hồi dịch vụ (service recovery paradox) nói gì?', options: ['Khách luôn ghét khách sạn từng có sự cố', 'Một sự cố được khắc phục tốt có thể khiến khách hài lòng hơn cả khi không có sự cố', 'Sự cố không bao giờ có thể khắc phục được', 'Chỉ quản lý mới được xử lý phàn nàn'], correctIndex: 1, explanation: 'Phục hồi nhanh, tốt đôi khi tạo hài lòng cao hơn cả trường hợp không có lỗi.' },
  { id: 'q2', question: 'Bước đầu tiên trong khung phục hồi bốn bước là gì?', options: ['Xin lỗi ngay lập tức', 'Ghi nhận / lắng nghe trọn vẹn', 'Hành động khắc phục', 'Ghi vào hồ sơ khách'], correctIndex: 1, explanation: 'Ghi nhận và lắng nghe là bước đầu, trước khi xin lỗi và hành động.' },
  { id: 'q3', question: 'Cam kết dịch vụ (service guarantee) mang lại lợi ích gì?', options: ['Giảm chi phí marketing', 'Buộc tổ chức đạt chuẩn công khai và trao quyền phục hồi sẵn cho nhân viên', 'Thay thế hoàn toàn đào tạo nhân viên', 'Chỉ áp dụng cho khách VIP'], correctIndex: 1, explanation: 'Lời hứa công khai khó lờ đi, và cho nhân viên hành động phục hồi được duyệt sẵn.' },
]);

const c7 = doc('gem201-7-1-technology-data', '7.1 — Technology & data in experience management|||7.1 — Công nghệ & dữ liệu trong quản trị trải nghiệm',
  'PMS/CRM, mobile check-in & keyless entry, theo dõi đánh giá, dữ liệu cho phân khúc/dự đoán, ma sát vs. đồng cảm.',
  [[
    `<span class="eyebrow">GEM201 · Chapter 7 · Lesson 7.1</span>
<h2>Technology &amp; data in experience management</h2>
<h3>The core systems</h3>
<ul>
<li><strong>PMS (Property Management System)</strong> — the operational backbone: reservations, room status, billing, housekeeping tasks; the single source of truth every department reads from.</li>
<li><strong>CRM / guest profile</strong> — stores preferences, history and complaint logs, shared across departments (Chapter 5's "remember" level depends entirely on this existing and being used).</li>
<li><strong>Guest messaging &amp; mobile check-in/keyless entry</strong> — lets guests skip the front-desk queue and reach staff via chat; reduces friction at the arrival touchpoint.</li>
<li><strong>Review &amp; reputation monitoring</strong> — aggregates OTA/Google/TripAdvisor reviews in near real time so recurring complaint themes surface fast (Chapter 6).</li>
</ul>
<h3>What data makes possible</h3>
<pre><code>Guest data enables:
 - Segmentation (RFM, Chapter 5) for targeted offers
 - Predictive maintenance flags before a guest reports a broken AC
 - Staffing forecasts matched to occupancy &amp; check-in patterns
 - Personalization at scale (pre-set room temperature, remembered allergies)
</code></pre>
<h3>Where technology helps — and where it doesn't</h3>
<p>Technology is best at removing FRICTION (queueing, paperwork, repeating yourself to five different staff) and at surfacing patterns humans would miss across thousands of stays. It is worst at genuine EMPATHY during a service failure — a chatbot apology for a ruined anniversary dinner reads as worse than no apology at all. The winning combination pairs automation for the transactional parts of a stay with human judgment reserved for the emotional ones.</p>
<div class="callout"><span class="badge">Data governance matters</span> Every system in this chapter touches personal data (Chapter 5's privacy point). A guest experience manager doesn't need to be a security engineer, but does need to know what data is collected, where it's stored, and who can see it.</div>`,
    `<span class="eyebrow">GEM201 · Chương 7 · Bài 7.1</span>
<h2>Công nghệ &amp; dữ liệu trong quản trị trải nghiệm</h2>
<h3>Các hệ thống lõi</h3>
<ul>
<li><strong>PMS (Hệ thống quản trị khách sạn)</strong> — xương sống vận hành: đặt phòng, trạng thái phòng, thanh toán, công việc buồng phòng; nguồn dữ liệu duy nhất mọi phòng ban đọc theo.</li>
<li><strong>CRM / hồ sơ khách</strong> — lưu sở thích, lịch sử và nhật ký phàn nàn, dùng chung xuyên phòng ban (cấp độ "ghi nhớ" ở Chương 5 phụ thuộc hoàn toàn vào việc này tồn tại và được dùng).</li>
<li><strong>Nhắn tin cho khách &amp; check-in di động/mở cửa không chìa</strong> — cho khách bỏ qua hàng chờ lễ tân và liên hệ nhân viên qua chat; giảm ma sát ở điểm chạm đến nơi.</li>
<li><strong>Theo dõi đánh giá &amp; danh tiếng</strong> — gom đánh giá OTA/Google/TripAdvisor gần thời gian thực để chủ đề phàn nàn lặp lại lộ ra nhanh (Chương 6).</li>
</ul>
<h3>Dữ liệu mở ra điều gì</h3>
<pre><code>Dữ liệu khách cho phép:
 - Phân khúc (RFM, Chương 5) để ưu đãi đúng đối tượng
 - Cảnh báo bảo trì dự đoán trước khi khách báo máy lạnh hỏng
 - Dự báo nhân sự khớp với công suất phòng &amp; mẫu hình check-in
 - Cá nhân hoá ở quy mô lớn (đặt sẵn nhiệt độ phòng, nhớ dị ứng)
</code></pre>
<h3>Công nghệ giúp được gì — và không giúp được gì</h3>
<p>Công nghệ giỏi nhất ở việc loại bỏ MA SÁT (xếp hàng, giấy tờ, lặp lại yêu cầu với năm nhân viên khác nhau) và làm lộ ra các mẫu hình con người sẽ bỏ sót qua hàng ngàn kỳ lưu trú. Nó tệ nhất ở sự ĐỒNG CẢM thật sự khi có sự cố dịch vụ — một lời xin lỗi từ chatbot cho một bữa tối kỷ niệm bị hỏng còn tệ hơn không xin lỗi. Tổ hợp thắng là ghép tự động hoá cho phần giao dịch của kỳ ở với phán đoán con người dành riêng cho phần cảm xúc.</p>
<div class="callout"><span class="badge">Quản trị dữ liệu quan trọng</span> Mọi hệ thống trong chương này đều chạm dữ liệu cá nhân (điểm riêng tư ở Chương 5). Người quản trị trải nghiệm khách không cần là kỹ sư bảo mật, nhưng cần biết dữ liệu gì được thu thập, lưu ở đâu, và ai xem được.</div>`,
  ]]);

const c7q = quiz('gem201-quiz-7', 'Quiz 7 — Technology & data|||Quiz 7 — Công nghệ & dữ liệu', [
  { id: 'q1', question: 'PMS (Property Management System) đóng vai trò gì?', options: ['Chỉ dùng để tính lương nhân viên', 'Xương sống vận hành: đặt phòng, trạng thái phòng, thanh toán, buồng phòng', 'Chỉ là công cụ marketing mạng xã hội', 'Thay thế hoàn toàn nhân viên lễ tân'], correctIndex: 1, explanation: 'PMS là nguồn dữ liệu vận hành trung tâm mọi phòng ban đọc theo.' },
  { id: 'q2', question: 'Công nghệ giỏi nhất ở việc gì trong quản trị trải nghiệm?', options: ['Thay thế hoàn toàn sự đồng cảm của con người', 'Loại bỏ ma sát và làm lộ ra mẫu hình dữ liệu lớn', 'Xin lỗi khách thay nhân viên', 'Quyết định mức phạt cho khách'], correctIndex: 1, explanation: 'Công nghệ mạnh ở loại ma sát và phát hiện mẫu hình; đồng cảm vẫn cần con người.' },
  { id: 'q3', question: 'Vì sao quản trị dữ liệu (data governance) quan trọng trong GEM?', options: ['Vì dữ liệu khách không bao giờ được dùng', 'Vì các hệ thống GEM đều chạm dữ liệu cá nhân nhạy cảm của khách', 'Vì luật chỉ áp dụng cho ngành ngân hàng', 'Vì PMS không lưu thông tin gì'], correctIndex: 1, explanation: 'Hồ sơ khách, CRM chứa dữ liệu cá nhân — cần biết thu thập/lưu/ai xem được.' },
]);

const c8 = doc('gem201-8-1-measurement-improvement-leadership', '8.1 — Measurement, continuous improvement & experience leadership|||8.1 — Đo lường, cải tiến liên tục & lãnh đạo trải nghiệm',
  'NPS/CSAT/KPI vận hành, vòng lặp PDCA, thói quen của người lãnh đạo trải nghiệm.',
  [[
    `<span class="eyebrow">GEM201 · Chapter 8 · Lesson 8.1</span>
<h2>Measurement, continuous improvement &amp; experience leadership</h2>
<h3>Measuring the experience</h3>
<ul>
<li><strong>NPS (Net Promoter Score)</strong> — "how likely are you to recommend us?" (0-10); promoters minus detractors, a loyalty proxy.</li>
<li><strong>CSAT (Customer Satisfaction)</strong> — direct satisfaction rating, usually per touchpoint or per stay.</li>
<li><strong>Online review scores</strong> — OTA/Google ratings, public and highly visible; often the first thing a prospective guest sees.</li>
<li><strong>Operational KPIs</strong> — complaint resolution time, repeat-guest rate, average response time to guest requests.</li>
</ul>
<p>No single metric tells the whole story — NPS is a loyalty signal, CSAT is a satisfaction signal, and operational KPIs explain WHY the other two move. A manager reads them together.</p>
<h3>Continuous improvement — PDCA</h3>
<pre><code>Plan  -&gt; pick a target metric &amp; a hypothesis for improving it
Do    -&gt; run the change with one team/shift/property
Check -&gt; measure against the same KPI, compare to baseline
Act   -&gt; roll out if it worked; revise the hypothesis if it didn't
</code></pre>
<p>Guest experience management is never "done" — expectations rise every time a competitor improves, so the PDCA loop repeats continuously, not as a one-off project.</p>
<h3>Leading the experience</h3>
<p>An experience leader's job spans everything in this course: setting the standard (Ch.1-2), owning the journey end-to-end (Ch.3), building and protecting the service culture (Ch.4), championing the guest across departments (Ch.5-7), and keeping the organization honest with data (this chapter). The single highest-leverage habit: <strong>walk the guest journey yourself, regularly</strong>, as a guest would experience it — not just review the dashboard.</p>
<div class="callout"><span class="badge">Culture beats a metric on a slide</span> A team chasing the NPS number alone can game it (over-soliciting happy guests, suppressing unhappy ones from responding). A team genuinely trying to make every stay better moves the number as a side effect — never manage to the metric instead of the guest.</div>`,
    `<span class="eyebrow">GEM201 · Chương 8 · Bài 8.1</span>
<h2>Đo lường, cải tiến liên tục &amp; lãnh đạo trải nghiệm</h2>
<h3>Đo trải nghiệm</h3>
<ul>
<li><strong>NPS (Điểm giới thiệu ròng)</strong> — "bạn sẽ giới thiệu chúng tôi khả năng bao nhiêu?" (0-10); người ủng hộ trừ người phản đối, một chỉ báo trung thành.</li>
<li><strong>CSAT (Hài lòng khách hàng)</strong> — đánh giá hài lòng trực tiếp, thường theo điểm chạm hoặc theo kỳ ở.</li>
<li><strong>Điểm đánh giá online</strong> — xếp hạng OTA/Google, công khai và rất dễ thấy; thường là điều đầu tiên khách tiềm năng nhìn thấy.</li>
<li><strong>KPI vận hành</strong> — thời gian xử lý phàn nàn, tỉ lệ khách quay lại, thời gian phản hồi trung bình cho yêu cầu của khách.</li>
</ul>
<p>Không chỉ số đơn lẻ nào kể hết câu chuyện — NPS là tín hiệu trung thành, CSAT là tín hiệu hài lòng, và KPI vận hành giải thích TẠI SAO hai chỉ số kia biến động. Người quản lý đọc chúng cùng nhau.</p>
<h3>Cải tiến liên tục — PDCA</h3>
<pre><code>Plan (Lập kế hoạch) -&gt; chọn chỉ số mục tiêu &amp; giả thuyết để cải thiện nó
Do (Thực hiện)       -&gt; chạy thay đổi với một đội/ca/cơ sở
Check (Kiểm tra)     -&gt; đo theo cùng KPI, so với mốc gốc
Act (Hành động)      -&gt; triển khai rộng nếu hiệu quả; sửa giả thuyết nếu không
</code></pre>
<p>Quản trị trải nghiệm khách không bao giờ "xong" — kỳ vọng tăng mỗi khi đối thủ cải thiện, nên vòng lặp PDCA lặp lại liên tục, không phải một dự án một lần.</p>
<h3>Lãnh đạo trải nghiệm</h3>
<p>Việc của người lãnh đạo trải nghiệm trải khắp môn học này: đặt chuẩn mực (Ch.1-2), sở hữu hành trình từ đầu đến cuối (Ch.3), xây dựng và bảo vệ văn hoá dịch vụ (Ch.4), làm người đại diện cho khách xuyên phòng ban (Ch.5-7), và giữ tổ chức trung thực bằng dữ liệu (chương này). Thói quen đòn bẩy cao nhất: <strong>tự mình đi qua hành trình khách thường xuyên</strong>, như một khách thật trải nghiệm — không chỉ xem bảng số liệu.</p>
<div class="callout"><span class="badge">Văn hoá thắng con số trên slide</span> Một đội chỉ đuổi theo con số NPS có thể lách nó (chỉ mời khách vui đánh giá, chặn khách không vui phản hồi). Một đội thực sự cố làm mỗi kỳ ở tốt hơn khiến con số tăng như một hệ quả phụ — đừng bao giờ quản trị theo chỉ số thay vì theo khách.</div>`,
  ]]);

const c8q = quiz('gem201-quiz-8', 'Quiz 8 — Measurement & leadership|||Quiz 8 — Đo lường & lãnh đạo trải nghiệm', [
  { id: 'q1', question: 'NPS và CSAT khác nhau ở điểm nào?', options: ['Hoàn toàn giống nhau', 'NPS là tín hiệu trung thành, CSAT là tín hiệu hài lòng trực tiếp', 'NPS chỉ đo giá phòng', 'CSAT chỉ dùng cho nhân viên'], correctIndex: 1, explanation: 'NPS đo khả năng giới thiệu (trung thành); CSAT đo hài lòng theo điểm chạm/kỳ ở.' },
  { id: 'q2', question: 'Vòng lặp PDCA gồm bốn bước theo thứ tự nào?', options: ['Do → Plan → Act → Check', 'Plan → Do → Check → Act', 'Check → Act → Plan → Do', 'Act → Check → Do → Plan'], correctIndex: 1, explanation: 'Plan (lập kế hoạch) → Do (thực hiện) → Check (kiểm tra) → Act (hành động).' },
  { id: 'q3', question: 'Thói quen đòn bẩy cao nhất của người lãnh đạo trải nghiệm là gì?', options: ['Chỉ xem báo cáo tài chính hằng tháng', 'Tự mình đi qua hành trình khách thường xuyên như một khách thật', 'Chỉ đuổi theo con số NPS', 'Giao toàn bộ việc cho bộ phận IT'], correctIndex: 1, explanation: 'Trải nghiệm hành trình trực tiếp giúp phát hiện vấn đề bảng số liệu không cho thấy.' },
]);

const taiLieu = doc('gem201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách tham khảo trích trong đề cương, khung lý thuyết, YouTube, mẫu/công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">GEM201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Managing Guest Experience — expectations &amp; SERVQUAL, the guest journey, service culture, loyalty, service recovery, technology and continuous improvement — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources plus the reference books cited in the syllabus.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for GEM201 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books (cited in the syllabus)</h3>
<ul>
<li><em>Managing Quality Service in Hospitality</em> — Robert C. Ford &amp; Michael J. Sturman</li>
<li><em>Service Management</em> — Jay Kandampully</li>
<li><a href="https://en.wikipedia.org/wiki/The_Experience_Economy" target="_blank" rel="noopener"><em>The Experience Economy</em> — B. Joseph Pine II &amp; James H. Gilmore</a></li>
</ul>
<h3>🌐 Frameworks &amp; official documentation</h3>
<ul>
<li><a href="https://en.wikipedia.org/wiki/SERVQUAL" target="_blank" rel="noopener">SERVQUAL — overview of the model</a></li>
<li><a href="https://en.wikipedia.org/wiki/Service_profit_chain" target="_blank" rel="noopener">Service-profit chain</a></li>
<li><a href="https://www.hospitalitynet.org/" target="_blank" rel="noopener">HospitalityNet — industry news &amp; research</a></li>
<li><a href="https://sha.cornell.edu/" target="_blank" rel="noopener">Cornell Peter and Stephanie Nolan School of Hotel Administration</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@HarvardBusinessReview" target="_blank" rel="noopener">Harvard Business Review</a> — service strategy &amp; customer experience talks</li>
<li><a href="https://www.youtube.com/@Cornell" target="_blank" rel="noopener">Cornell University</a> — hospitality management lectures &amp; research</li>
</ul>
<h3>🛠️ Templates &amp; tools</h3>
<ul>
<li><a href="https://miro.com/templates/customer-journey-map/" target="_blank" rel="noopener">Miro — guest/customer journey map template</a></li>
<li><a href="https://www.qualtrics.com/experience-management/customer/net-promoter-score/" target="_blank" rel="noopener">Qualtrics — NPS explained</a></li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — GEM vs. GAD201, moments of truth, service-profit chain, SERVQUAL, the gap model.</li>
<li><strong>Practice</strong> — map a real hotel/resort guest journey stage by stage; identify the peak and the ending.</li>
<li><strong>Go deeper</strong> — service culture, empowerment, loyalty/RFM, complaint recovery scripts, PMS/CRM data flows.</li>
<li><strong>Job-ready</strong> — read NPS/CSAT dashboards, run one PDCA improvement cycle, present it like an experience leader.</li>
</ol></div>`,
    `<span class="eyebrow">GEM201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Quản trị Trải nghiệm Khách hàng — kỳ vọng &amp; SERVQUAL, hành trình khách, văn hoá dịch vụ, khách thân thiết, phục hồi dịch vụ, công nghệ và cải tiến liên tục — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp cùng các sách tham khảo được trích dẫn trong đề cương.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của GEM201 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo (trích trong đề cương)</h3>
<ul>
<li><em>Managing Quality Service in Hospitality</em> — Robert C. Ford &amp; Michael J. Sturman</li>
<li><em>Service Management</em> — Jay Kandampully</li>
<li><a href="https://en.wikipedia.org/wiki/The_Experience_Economy" target="_blank" rel="noopener"><em>The Experience Economy</em> — B. Joseph Pine II &amp; James H. Gilmore</a></li>
</ul>
<h3>🌐 Khung lý thuyết &amp; tài liệu chính thức</h3>
<ul>
<li><a href="https://en.wikipedia.org/wiki/SERVQUAL" target="_blank" rel="noopener">SERVQUAL — tổng quan mô hình</a></li>
<li><a href="https://en.wikipedia.org/wiki/Service_profit_chain" target="_blank" rel="noopener">Chuỗi lợi nhuận dịch vụ (service-profit chain)</a></li>
<li><a href="https://www.hospitalitynet.org/" target="_blank" rel="noopener">HospitalityNet — tin tức &amp; nghiên cứu ngành</a></li>
<li><a href="https://sha.cornell.edu/" target="_blank" rel="noopener">Trường Quản trị Khách sạn Cornell (Nolan School)</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@HarvardBusinessReview" target="_blank" rel="noopener">Harvard Business Review</a> — bài giảng chiến lược dịch vụ &amp; trải nghiệm khách</li>
<li><a href="https://www.youtube.com/@Cornell" target="_blank" rel="noopener">Cornell University</a> — bài giảng &amp; nghiên cứu quản trị khách sạn</li>
</ul>
<h3>🛠️ Mẫu &amp; công cụ</h3>
<ul>
<li><a href="https://miro.com/templates/customer-journey-map/" target="_blank" rel="noopener">Miro — mẫu bản đồ hành trình khách</a></li>
<li><a href="https://www.qualtrics.com/experience-management/customer/net-promoter-score/" target="_blank" rel="noopener">Qualtrics — giải thích NPS</a></li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — GEM khác GAD201 thế nào, khoảnh khắc sự thật, chuỗi lợi nhuận dịch vụ, SERVQUAL, mô hình khoảng cách.</li>
<li><strong>Luyện tập</strong> — vẽ hành trình khách thật của một khách sạn/resort theo từng giai đoạn; xác định đỉnh và đoạn kết.</li>
<li><strong>Đào sâu</strong> — văn hoá dịch vụ, trao quyền, loyalty/RFM, kịch bản phục hồi phàn nàn, luồng dữ liệu PMS/CRM.</li>
<li><strong>Sẵn sàng đi làm</strong> — đọc bảng số liệu NPS/CSAT, chạy một vòng cải tiến PDCA, trình bày như một người lãnh đạo trải nghiệm.</li>
</ol></div>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'GEM201',
    slug: 'gem201-managing-guest-experience',
    title: 'Managing Guest Experience',
    level: 'ADVANCED',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/GEM201.webp',
    shortDescription: 'Managing (not designing) guest experience in hotels/resorts: SERVQUAL, guest journey & peak-end rule, service culture & empowerment, loyalty/RFM, complaint recovery, tech/data, PDCA improvement. Bilingual, quizzes.|||Quản trị (không thiết kế) trải nghiệm khách tại khách sạn/resort: SERVQUAL, hành trình khách & quy tắc đỉnh-kết, văn hoá dịch vụ & trao quyền, khách thân thiết/RFM, phục hồi dịch vụ, công nghệ/dữ liệu, cải tiến PDCA. Song ngữ, có quiz.',
    description: 'Môn <strong>GEM201 — Managing Guest Experience</strong> (kỳ 7, nâng cao) dạy <strong>quản trị</strong> trải nghiệm khách trong ngành hospitality — khác GAD201 (thiết kế trải nghiệm). Từ <strong>khoảnh khắc sự thật &amp; chuỗi lợi nhuận dịch vụ</strong> → <strong>kỳ vọng &amp; SERVQUAL</strong> (mô hình khoảng cách) → <strong>hành trình khách lưu trú</strong> (quy tắc đỉnh-kết) → <strong>văn hoá dịch vụ &amp; trao quyền nhân viên</strong> → <strong>cá nhân hoá &amp; khách thân thiết</strong> (RFM) → <strong>xử lý phàn nàn &amp; phục hồi dịch vụ</strong> → <strong>công nghệ &amp; dữ liệu</strong> → <strong>đo lường, cải tiến liên tục &amp; lãnh đạo trải nghiệm</strong> (PDCA). Bám giáo trình (Ford/Sturman, Kandampully, Pine &amp; Gilmore), song ngữ, quiz mỗi chương.',
    whatYouLearn: 'Phân biệt GEM201 (quản trị vận hành) với GAD201 (thiết kế); khoảnh khắc sự thật &amp; chuỗi lợi nhuận dịch vụ; SERVQUAL (RATER) &amp; mô hình 5 khoảng cách; vòng đời &amp; hành trình khách, quy tắc đỉnh-kết; văn hoá dịch vụ, tuyển theo thái độ, trao quyền nhân viên; cá nhân hoá 3 cấp độ, chương trình khách thân thiết &amp; phân khúc RFM; khung phục hồi dịch vụ 4 bước, nghịch lý phục hồi, cam kết dịch vụ; PMS/CRM, công nghệ &amp; dữ liệu; NPS/CSAT, vòng lặp PDCA, lãnh đạo trải nghiệm.',
    requirements: 'Kiến thức nền về Marketing/Quản trị dịch vụ (khuyến nghị đã học các môn đại cương QTKD). Nên tham khảo giáo trình chính thức trên FLM song song với môn này.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách tham khảo, khung lý thuyết, YouTube, mẫu/công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'GEM201 vs GAD201, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Quản trị trải nghiệm khách trong hospitality|||Chapter 1 — Managing guest experience in hospitality', description: 'Khoảnh khắc sự thật, chuỗi lợi nhuận dịch vụ, ai sở hữu trải nghiệm.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Kỳ vọng khách hàng & chất lượng dịch vụ|||Chapter 2 — Guest expectations & service quality', description: 'SERVQUAL (RATER), mô hình 5 khoảng cách.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Vòng đời & hành trình khách lưu trú|||Chapter 3 — Guest lifecycle & journey', description: 'Năm giai đoạn kỳ ở, quy tắc đỉnh-kết, bàn giao liên phòng ban.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Văn hoá dịch vụ & trao quyền nhân viên|||Chapter 4 — Service culture & employee empowerment', description: 'Tuyển theo thái độ, ba yếu tố trao quyền, marketing nội bộ.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Cá nhân hoá & quản lý khách hàng thân thiết|||Chapter 5 — Personalization & loyalty management', description: 'Ba cấp độ cá nhân hoá, loyalty, phân khúc RFM, riêng tư.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Xử lý phàn nàn & phục hồi dịch vụ|||Chapter 6 — Complaint handling & service recovery', description: 'Nghịch lý phục hồi, khung 4 bước, cam kết dịch vụ.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Công nghệ & dữ liệu trong quản trị trải nghiệm|||Chapter 7 — Technology & data in experience management', description: 'PMS/CRM, mobile check-in, dữ liệu cho phân khúc & dự đoán.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Đo lường, cải tiến liên tục & lãnh đạo trải nghiệm|||Chapter 8 — Measurement, continuous improvement & experience leadership', description: 'NPS/CSAT/KPI, vòng lặp PDCA, lãnh đạo trải nghiệm.', lessons: [c8, c8q] },
  ],
};
