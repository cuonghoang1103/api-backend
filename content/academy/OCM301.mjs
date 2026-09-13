/**
 * OCM301 — Omnichannel Communications Management (Quản trị truyền thông đa kênh
 * hợp nhất, ngành Truyền thông FPTU). Môn KHÔNG có FLM → khung theo giáo trình
 * chuẩn quốc tế: Kotler "Marketing 4.0 & 5.0", Rigby "Omnichannel Retailing",
 * HBR/Google Think về omnichannel, Salesforce/Adobe CX. 8 chương, song ngữ,
 * ví dụ thương hiệu thật. Giữ NGUYÊN slug/semester/courseCode/thumb.
 * ⚠️ KHÔNG backtick/${ lồng trong HTML; "&"→"&amp;" chỉ trong content HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('ocm301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: sách chuẩn (Kotler, Rigby), HBR & Google Think, Salesforce/McKinsey, công cụ, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">OCM301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to master <strong>omnichannel communications</strong> — from customer journeys to CDPs, personalization and multi-touch attribution — in one place. This course has no FLM syllabus, so it follows <strong>international standard references</strong>.</p>
<h3>📘 Core books</h3>
<ul>
<li><a href="https://www.marketing4-0.com/" target="_blank" rel="noopener">Kotler, Kartajaya &amp; Setiawan — <em>Marketing 4.0</em> &amp; <em>Marketing 5.0</em></a> (digital &amp; the customer path)</li>
<li><a href="https://hbr.org/2011/12/the-future-of-shopping" target="_blank" rel="noopener">Darrell Rigby (HBR) — <em>The Future of Shopping</em> / Omnichannel Retailing</a></li>
</ul>
<h3>🌐 Free reports &amp; guides</h3>
<ul>
<li><a href="https://www.thinkwithgoogle.com/" target="_blank" rel="noopener">Think with Google — micro-moments &amp; ZMOT research</a></li>
<li><a href="https://www.salesforce.com/resources/research-reports/state-of-marketing/" target="_blank" rel="noopener">Salesforce — State of Marketing</a></li>
<li><a href="https://www.mckinsey.com/capabilities/growth-marketing-and-sales/our-insights" target="_blank" rel="noopener">McKinsey — Customer Experience insights</a></li>
</ul>
<h3>🛠️ Tools &amp; platforms</h3>
<ul>
<li><a href="https://segment.com/" target="_blank" rel="noopener">Twilio Segment</a> — customer data platform (CDP)</li>
<li><a href="https://business.adobe.com/products/real-time-customer-data-platform.html" target="_blank" rel="noopener">Adobe Real-Time CDP</a> — unified profiles &amp; journeys</li>
<li><a href="https://analytics.google.com/" target="_blank" rel="noopener">Google Analytics 4</a> — cross-device measurement</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundations</strong> — multichannel vs cross-channel vs omnichannel; map one real customer journey end-to-end.</li>
<li><strong>Data &amp; personalization</strong> — first-party data, single customer view, CDP, automation &amp; triggers.</li>
<li><strong>Consistency &amp; tech</strong> — brand consistency, seamless handoff, and the MarTech stack (CRM/CDP/DMP).</li>
<li><strong>Measure</strong> — multi-touch attribution, CLV, unified analytics; pick KPIs per channel.</li>
</ol></div>`,
    `<span class="eyebrow">OCM301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để làm chủ <strong>truyền thông đa kênh hợp nhất</strong> — từ hành trình khách hàng đến CDP, cá nhân hoá và mô hình quy kết đa điểm chạm — gom về một chỗ. Môn này không có giáo trình FLM nên bám theo <strong>tài liệu chuẩn quốc tế</strong>.</p>
<h3>📘 Sách nền tảng</h3>
<ul>
<li><a href="https://www.marketing4-0.com/" target="_blank" rel="noopener">Kotler, Kartajaya &amp; Setiawan — <em>Marketing 4.0</em> &amp; <em>Marketing 5.0</em></a> (số hoá &amp; hành trình khách hàng)</li>
<li><a href="https://hbr.org/2011/12/the-future-of-shopping" target="_blank" rel="noopener">Darrell Rigby (HBR) — <em>The Future of Shopping</em> / Bán lẻ đa kênh</a></li>
</ul>
<h3>🌐 Báo cáo &amp; hướng dẫn miễn phí</h3>
<ul>
<li><a href="https://www.thinkwithgoogle.com/" target="_blank" rel="noopener">Think with Google — nghiên cứu micro-moments &amp; ZMOT</a></li>
<li><a href="https://www.salesforce.com/resources/research-reports/state-of-marketing/" target="_blank" rel="noopener">Salesforce — State of Marketing</a></li>
<li><a href="https://www.mckinsey.com/capabilities/growth-marketing-and-sales/our-insights" target="_blank" rel="noopener">McKinsey — góc nhìn về Trải nghiệm khách hàng</a></li>
</ul>
<h3>🛠️ Công cụ &amp; nền tảng</h3>
<ul>
<li><a href="https://segment.com/" target="_blank" rel="noopener">Twilio Segment</a> — nền tảng dữ liệu khách hàng (CDP)</li>
<li><a href="https://business.adobe.com/products/real-time-customer-data-platform.html" target="_blank" rel="noopener">Adobe Real-Time CDP</a> — hồ sơ &amp; hành trình hợp nhất</li>
<li><a href="https://analytics.google.com/" target="_blank" rel="noopener">Google Analytics 4</a> — đo lường đa thiết bị</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — phân biệt multichannel / cross-channel / omnichannel; vẽ trọn một hành trình khách hàng thật.</li>
<li><strong>Dữ liệu &amp; cá nhân hoá</strong> — dữ liệu bên thứ nhất, khách hàng 360, CDP, tự động hoá &amp; trigger.</li>
<li><strong>Nhất quán &amp; công nghệ</strong> — nhất quán thương hiệu, chuyển giao liền mạch, và MarTech stack (CRM/CDP/DMP).</li>
<li><strong>Đo lường</strong> — quy kết đa điểm chạm, CLV, phân tích hợp nhất; chọn KPI cho từng kênh.</li>
</ol></div>`,
  ]]);

const intro = doc('ocm301-0-1-overview', 'Course overview: Omnichannel communications|||Tổng quan: Truyền thông đa kênh hợp nhất',
  'Truyền thông đa kênh làm gì; vì sao "hợp nhất" quan trọng; lộ trình: khái niệm → hành trình & dữ liệu → cá nhân hoá & nhất quán → công nghệ & đo lường.',
  [[
    `<span class="eyebrow">OCM301 · Lesson 0.1 · Overview</span>
<h2>Omnichannel Communications Management</h2>
<p class="lead">This course teaches you to plan and run <strong>unified communications across every channel</strong> — web, mobile app, store, social, email, chat, call center — so a customer feels they're dealing with <strong>one brand, one conversation</strong>, not a dozen disconnected touchpoints.</p>
<h3>Why "omnichannel", not just "many channels"</h3>
<ul>
<li><strong>Multichannel</strong> — you're present on many channels, but each runs in its own silo.</li>
<li><strong>Cross-channel</strong> — channels share some data and hand off between each other.</li>
<li><strong>Omnichannel</strong> — every channel draws from <em>one</em> customer view; context and history follow the person seamlessly.</li>
</ul>
<h3>Roadmap</h3>
<p>Foundations (channel types) &amp; the multichannel customer journey → owned/paid/earned (PESO) &amp; the customer-360 data layer → personalization, automation &amp; consistent experience → the MarTech stack &amp; omnichannel measurement (attribution, CLV, KPIs). Bilingual, with real-brand cases (Starbucks, Disney, Sephora, Nike).</p>`,
    `<span class="eyebrow">OCM301 · Bài 0.1 · Tổng quan</span>
<h2>Quản trị truyền thông đa kênh hợp nhất</h2>
<p class="lead">Môn này dạy bạn hoạch định và vận hành <strong>truyền thông hợp nhất trên mọi kênh</strong> — web, ứng dụng, cửa hàng, mạng xã hội, email, chat, tổng đài — để khách hàng cảm thấy đang trò chuyện với <strong>một thương hiệu, một mạch chuyện</strong>, chứ không phải hàng chục điểm chạm rời rạc.</p>
<h3>Vì sao là "omnichannel", không chỉ "nhiều kênh"</h3>
<ul>
<li><strong>Multichannel (đa kênh)</strong> — có mặt trên nhiều kênh, nhưng mỗi kênh chạy trong ốc đảo riêng.</li>
<li><strong>Cross-channel (liên kênh)</strong> — các kênh chia sẻ một phần dữ liệu và chuyển giao qua lại.</li>
<li><strong>Omnichannel (hợp nhất)</strong> — mọi kênh dùng chung <em>một</em> hồ sơ khách hàng; bối cảnh &amp; lịch sử đi theo người dùng liền mạch.</li>
</ul>
<h3>Lộ trình</h3>
<p>Nền tảng (các loại kênh) &amp; hành trình khách hàng đa kênh → kênh sở hữu/trả phí/lan truyền (PESO) &amp; tầng dữ liệu khách hàng 360 → cá nhân hoá, tự động hoá &amp; trải nghiệm nhất quán → MarTech stack &amp; đo lường đa kênh (quy kết, CLV, KPI). Song ngữ, có ví dụ thương hiệu thật (Starbucks, Disney, Sephora, Nike).</p>`,
  ]]);

const c1 = doc('ocm301-1-1-what-is-omnichannel', '1.1 — What is omnichannel|||1.1 — Đa kênh là gì',
  'Multichannel vs cross-channel vs omnichannel; vì sao phải hợp nhất; ví dụ Disney MagicBand, Starbucks.',
  [[
    `<span class="eyebrow">OCM301 · Chapter 1 · Lesson 1.1</span>
<h2>What is omnichannel?</h2>
<h3>Three levels of channel maturity</h3>
<ul>
<li><strong>Multichannel</strong> — many touchpoints (store, site, app, social), each managed separately. A promo email might not know what you bought in-store yesterday.</li>
<li><strong>Cross-channel</strong> — channels connect: buy online, return in store; the cart follows you from phone to laptop.</li>
<li><strong>Omnichannel</strong> — <em>every</em> interaction reads and writes to one shared customer profile, so the experience is continuous and context-aware across all channels at once.</li>
</ul>
<h3>Why unify?</h3>
<p>Customers don't think in "channels" — they think in <strong>goals</strong>. Fragmented messaging feels like repeating yourself to a company that doesn't remember you. Unified communications lift conversion, loyalty and lifetime value because the brand is <em>consistent and remembers context</em>.</p>
<div class="callout"><span class="badge">Real brand · Disney</span> Disney's <strong>MagicBand</strong> is a textbook omnichannel play: one wristband ties the website, the My Disney Experience app, park entry, FastPass, hotel room key and payments into a single seamless profile — the physical park and the digital app are the same journey.</div>
<p>Starbucks does the same digitally: the app, rewards, in-store purchase and mobile order all update <strong>one balance and one history</strong> in real time.</p>`,
    `<span class="eyebrow">OCM301 · Chương 1 · Bài 1.1</span>
<h2>Đa kênh hợp nhất là gì?</h2>
<h3>Ba mức trưởng thành của kênh</h3>
<ul>
<li><strong>Multichannel (đa kênh)</strong> — nhiều điểm chạm (cửa hàng, web, app, mạng xã hội), quản lý riêng rẽ. Email khuyến mãi có thể không biết hôm qua bạn mua gì tại cửa hàng.</li>
<li><strong>Cross-channel (liên kênh)</strong> — các kênh nối với nhau: mua online, đổi trả tại cửa hàng; giỏ hàng theo bạn từ điện thoại sang laptop.</li>
<li><strong>Omnichannel (hợp nhất)</strong> — <em>mọi</em> tương tác đọc và ghi vào một hồ sơ khách hàng chung, nên trải nghiệm liên tục và hiểu bối cảnh trên tất cả các kênh cùng lúc.</li>
</ul>
<h3>Vì sao phải hợp nhất?</h3>
<p>Khách hàng không nghĩ theo "kênh" — họ nghĩ theo <strong>mục tiêu</strong>. Thông điệp rời rạc khiến họ như phải lặp lại với một công ty không nhớ mình. Truyền thông hợp nhất nâng tỉ lệ chuyển đổi, lòng trung thành &amp; giá trị vòng đời vì thương hiệu <em>nhất quán và nhớ bối cảnh</em>.</p>
<div class="callout"><span class="badge">Thương hiệu thật · Disney</span> <strong>MagicBand</strong> của Disney là ví dụ mẫu mực: một chiếc vòng tay nối website, app My Disney Experience, cổng vào công viên, FastPass, chìa khoá phòng khách sạn và thanh toán vào một hồ sơ liền mạch — công viên vật lý và app số là cùng một hành trình.</div>
<p>Starbucks làm điều tương tự trên nền số: app, điểm thưởng, mua tại quầy và đặt online đều cập nhật <strong>một số dư và một lịch sử</strong> theo thời gian thực.</p>`,
  ]]);

const c1q = quiz('ocm301-quiz-1', 'Quiz 1 — What is omnichannel|||Quiz 1 — Đa kênh là gì', [
  { id: 'q1', question: 'Khác biệt cốt lõi của "omnichannel" so với "multichannel" là?', options: ['Có nhiều kênh hơn', 'Mọi kênh dùng chung MỘT hồ sơ khách hàng, liền mạch', 'Chỉ chạy trên mobile', 'Không dùng cửa hàng vật lý'], correctIndex: 1, explanation: 'Omnichannel hợp nhất mọi kênh quanh một customer view duy nhất.' },
  { id: 'q2', question: 'Disney MagicBand là ví dụ điển hình cho điều gì?', options: ['Multichannel silo', 'Trải nghiệm omnichannel hợp nhất số + vật lý', 'Chỉ là thẻ thanh toán', 'Quảng cáo trả phí'], correctIndex: 1, explanation: 'MagicBand nối web, app, công viên, khách sạn, thanh toán vào một hồ sơ.' },
  { id: 'q3', question: '"Cross-channel" khác "multichannel" ở chỗ?', options: ['Các kênh nối và chuyển giao dữ liệu cho nhau', 'Có ít kênh hơn', 'Không có online', 'Giống hệt nhau'], correctIndex: 0, explanation: 'Cross-channel: mua online đổi tại cửa hàng, giỏ theo thiết bị — kênh đã kết nối.' },
]);

const c2 = doc('ocm301-2-1-customer-journey', '2.1 — The multichannel customer journey|||2.1 — Hành trình khách hàng đa kênh',
  'Customer journey mapping, touchpoints, moments of truth, ZMOT, micro-moments; ví dụ Sephora.',
  [[
    `<span class="eyebrow">OCM301 · Chapter 2 · Lesson 2.1</span>
<h2>The multichannel customer journey</h2>
<h3>Journey mapping &amp; touchpoints</h3>
<p>A <strong>customer journey map</strong> charts every step a person takes toward a goal, across channels, plus what they think and feel. Each interaction is a <strong>touchpoint</strong> (an ad, a search, a store visit, a support chat). Kotler's <strong>5A path</strong> — Aware → Appeal → Ask → Act → Advocate — is a useful spine.</p>
<h3>Moments of truth &amp; ZMOT</h3>
<ul>
<li><strong>ZMOT (Zero Moment of Truth, Google):</strong> before buying, people research online — reviews, search, video. The decision is often made <em>before</em> reaching the shelf.</li>
<li><strong>First moment of truth:</strong> the shelf / product page encounter.</li>
<li><strong>Second moment of truth:</strong> the actual experience of using the product.</li>
<li><strong>Micro-moments (Google):</strong> intent-rich "I-want-to-know / go / do / buy" instants on mobile.</li>
</ul>
<div class="callout"><span class="badge">Real brand · Sephora</span> Sephora maps beauty journeys across app, site and store: a shopper scans a product in-store, the app shows reviews and their purchase history, and a Beauty Advisor sees the same profile — the online research (ZMOT) and the in-store moment are one continuous map.</div>`,
    `<span class="eyebrow">OCM301 · Chương 2 · Bài 2.1</span>
<h2>Hành trình khách hàng đa kênh</h2>
<h3>Vẽ hành trình &amp; điểm chạm</h3>
<p>Một <strong>bản đồ hành trình khách hàng</strong> phác mọi bước một người đi tới mục tiêu, xuyên các kênh, cùng điều họ nghĩ và cảm nhận. Mỗi tương tác là một <strong>điểm chạm (touchpoint)</strong> (quảng cáo, tìm kiếm, ghé cửa hàng, chat hỗ trợ). <strong>Đường 5A</strong> của Kotler — Aware → Appeal → Ask → Act → Advocate (Biết → Thích → Hỏi → Mua → Ủng hộ) — là bộ xương hữu ích.</p>
<h3>Khoảnh khắc sự thật &amp; ZMOT</h3>
<ul>
<li><strong>ZMOT (Khoảnh khắc sự thật thứ 0, Google):</strong> trước khi mua, người ta tra cứu online — đánh giá, tìm kiếm, video. Quyết định thường chốt <em>trước khi</em> tới kệ hàng.</li>
<li><strong>Khoảnh khắc sự thật thứ nhất:</strong> gặp sản phẩm trên kệ / trang sản phẩm.</li>
<li><strong>Khoảnh khắc sự thật thứ hai:</strong> trải nghiệm thực khi dùng sản phẩm.</li>
<li><strong>Micro-moments (Google):</strong> những khoảnh khắc giàu ý định "muốn biết / muốn đến / muốn làm / muốn mua" trên di động.</li>
</ul>
<div class="callout"><span class="badge">Thương hiệu thật · Sephora</span> Sephora vẽ hành trình làm đẹp xuyên app, web và cửa hàng: khách quét sản phẩm tại quầy, app hiện đánh giá và lịch sử mua, và Beauty Advisor thấy đúng hồ sơ đó — nghiên cứu online (ZMOT) và khoảnh khắc tại cửa hàng là một bản đồ liên tục.</div>`,
  ]]);

const c2q = quiz('ocm301-quiz-2', 'Quiz 2 — Customer journey|||Quiz 2 — Hành trình khách hàng', [
  { id: 'q1', question: 'ZMOT (Zero Moment of Truth) của Google mô tả điều gì?', options: ['Khoảnh khắc dùng sản phẩm', 'Giai đoạn tra cứu online TRƯỚC khi mua', 'Lúc thanh toán tại quầy', 'Sau bảo hành'], correctIndex: 1, explanation: 'ZMOT: người ta nghiên cứu, đọc review online trước khi ra quyết định.' },
  { id: 'q2', question: 'Đường "5A" của Kotler gồm các bước?', options: ['Aware, Appeal, Ask, Act, Advocate', 'Attract, Ad, Api, App, Auto', 'Awareness, Activation, Analytics', 'A/B, ARPU, ROAS'], correctIndex: 0, explanation: 'Biết → Thích → Hỏi → Mua → Ủng hộ.' },
  { id: 'q3', question: 'Một "touchpoint" trong hành trình khách hàng là?', options: ['Một chỉ số tài chính', 'Bất kỳ tương tác nào với thương hiệu (quảng cáo, chat, ghé cửa hàng)', 'Một loại tụ điện', 'Tên một CDP'], correctIndex: 1, explanation: 'Touchpoint = mỗi điểm khách chạm vào thương hiệu, xuyên kênh.' },
]);

const c3 = doc('ocm301-3-1-peso-o2o', '3.1 — Owned, paid & earned unified|||3.1 — Kênh sở hữu, trả phí & lan truyền hợp nhất',
  'Mô hình PESO (paid/earned/shared/owned) đa kênh; kênh online-offline O2O; ví dụ Nike.',
  [[
    `<span class="eyebrow">OCM301 · Chapter 3 · Lesson 3.1</span>
<h2>Owned, paid &amp; earned — unified (PESO)</h2>
<h3>The PESO model</h3>
<ul>
<li><strong>Paid</strong> — you pay to reach people: search &amp; social ads, display, sponsorships.</li>
<li><strong>Earned</strong> — coverage &amp; word-of-mouth you don't pay for: press, reviews, mentions.</li>
<li><strong>Shared</strong> — social &amp; community: your posts and the conversation around them.</li>
<li><strong>Owned</strong> — channels you control: website, app, email list, store, blog.</li>
</ul>
<p>In an omnichannel plan these four <em>reinforce</em> one another rather than run separately — a paid ad drives to owned content, which earns shares, which builds the owned audience.</p>
<h3>O2O — online to offline (and back)</h3>
<p><strong>O2O</strong> bridges the digital and physical: buy-online-pickup-in-store (BOPIS), reserve online / try in store, QR codes on shelves, and store staff armed with the customer's online profile. The goal is that <strong>a channel switch never resets the journey</strong>.</p>
<div class="callout"><span class="badge">Real brand · Nike</span> Nike ties paid social, its owned Nike App and SNKRS app, earned community hype and physical flagship stores together: members reserve drops in the app and collect in store, and in-store scans pull up their online profile — paid, earned, shared and owned feed one membership.</div>`,
    `<span class="eyebrow">OCM301 · Chương 3 · Bài 3.1</span>
<h2>Kênh sở hữu, trả phí &amp; lan truyền — hợp nhất (PESO)</h2>
<h3>Mô hình PESO</h3>
<ul>
<li><strong>Paid (trả phí)</strong> — trả tiền để tiếp cận: quảng cáo tìm kiếm &amp; mạng xã hội, display, tài trợ.</li>
<li><strong>Earned (lan truyền)</strong> — độ phủ &amp; truyền miệng không mất phí: báo chí, đánh giá, nhắc tên.</li>
<li><strong>Shared (chia sẻ)</strong> — mạng xã hội &amp; cộng đồng: bài đăng và cuộc trò chuyện quanh nó.</li>
<li><strong>Owned (sở hữu)</strong> — kênh bạn kiểm soát: website, app, danh sách email, cửa hàng, blog.</li>
</ul>
<p>Trong kế hoạch đa kênh, bốn nhóm này <em>bổ trợ</em> nhau chứ không chạy tách rời — quảng cáo trả phí kéo về nội dung sở hữu, nội dung đó tạo chia sẻ, chia sẻ nuôi lớn tập khán giả sở hữu.</p>
<h3>O2O — online tới offline (và ngược lại)</h3>
<p><strong>O2O</strong> bắc cầu số và vật lý: mua online nhận tại cửa hàng (BOPIS), đặt online / thử tại cửa hàng, mã QR trên kệ, và nhân viên cửa hàng nắm hồ sơ online của khách. Mục tiêu là <strong>đổi kênh không bao giờ khởi động lại hành trình</strong>.</p>
<div class="callout"><span class="badge">Thương hiệu thật · Nike</span> Nike nối quảng cáo trả phí, app Nike &amp; SNKRS sở hữu, sức nóng cộng đồng lan truyền và cửa hàng flagship vật lý: thành viên giữ chỗ đợt hàng trong app rồi nhận tại cửa hàng, và quét tại quầy sẽ mở hồ sơ online của họ — paid, earned, shared, owned cùng nuôi một membership.</div>`,
  ]]);

const c3q = quiz('ocm301-quiz-3', 'Quiz 3 — PESO & O2O|||Quiz 3 — PESO & O2O', [
  { id: 'q1', question: 'Trong mô hình PESO, kênh "Owned" (sở hữu) gồm?', options: ['Quảng cáo trả tiền', 'Website, app, email list, cửa hàng — kênh mình kiểm soát', 'Báo chí viết về mình', 'Bình luận của người lạ'], correctIndex: 1, explanation: 'Owned = kênh do thương hiệu kiểm soát trực tiếp.' },
  { id: 'q2', question: '"Earned media" nghĩa là?', options: ['Kênh trả phí', 'Độ phủ/truyền miệng KHÔNG mất phí (báo chí, review)', 'Website riêng', 'Email marketing'], correctIndex: 1, explanation: 'Earned: người khác nói về bạn mà bạn không trả tiền.' },
  { id: 'q3', question: 'O2O (online-to-offline) hướng tới điều gì?', options: ['Bỏ hẳn cửa hàng vật lý', 'Đổi kênh (online↔offline) không làm reset hành trình', 'Chỉ bán qua app', 'Tăng giá'], correctIndex: 1, explanation: 'O2O bắc cầu số-vật lý: BOPIS, giữ chỗ online nhận tại cửa hàng...' },
]);

const c4 = doc('ocm301-4-1-customer-360', '4.1 — Data & the 360° customer|||4.1 — Dữ liệu & khách hàng 360',
  'CDP, single customer view, first-party data, identity resolution; ví dụ Starbucks Rewards.',
  [[
    `<span class="eyebrow">OCM301 · Chapter 4 · Lesson 4.1</span>
<h2>Data &amp; the 360° customer</h2>
<h3>Single customer view</h3>
<p>Omnichannel is impossible without one unified record per person — the <strong>single customer view (SCV)</strong>, or customer-360. It stitches web behavior, app usage, purchases, support tickets and email engagement into <em>one</em> profile the whole company reads from.</p>
<h3>The building blocks</h3>
<ul>
<li><strong>First-party data</strong> — data you collect directly (with consent) from your own channels. It's the most reliable and privacy-durable, especially as third-party cookies fade.</li>
<li><strong>CDP (Customer Data Platform)</strong> — software that ingests data from all channels and builds persistent, unified profiles for activation.</li>
<li><strong>Identity resolution</strong> — matching signals (email, device ID, loyalty ID, cookie) so "the app user", "the emailer" and "the in-store buyer" are recognized as the <em>same person</em>.</li>
</ul>
<div class="callout"><span class="badge">Real brand · Starbucks</span> Starbucks Rewards is a data engine: every mobile order, card top-up and store scan feeds one profile, powering personalized offers. That first-party data — tied to a single loyalty identity — is why its recommendations feel individual.</div>
<p><strong>Privacy note:</strong> a 360° view must be built on consent and clear data governance (GDPR-style) — trust is the foundation, not an afterthought.</p>`,
    `<span class="eyebrow">OCM301 · Chương 4 · Bài 4.1</span>
<h2>Dữ liệu &amp; khách hàng 360°</h2>
<h3>Hồ sơ khách hàng hợp nhất</h3>
<p>Omnichannel bất khả thi nếu không có một bản ghi hợp nhất cho mỗi người — <strong>single customer view (SCV)</strong>, hay khách hàng 360. Nó khâu hành vi web, dùng app, đơn mua, ticket hỗ trợ và tương tác email vào <em>một</em> hồ sơ mà cả công ty cùng đọc.</p>
<h3>Các khối cấu thành</h3>
<ul>
<li><strong>First-party data (dữ liệu bên thứ nhất)</strong> — dữ liệu thu trực tiếp (có sự đồng ý) từ kênh của chính bạn. Đáng tin và bền về quyền riêng tư nhất, nhất là khi cookie bên thứ ba mất dần.</li>
<li><strong>CDP (Nền tảng dữ liệu khách hàng)</strong> — phần mềm nạp dữ liệu từ mọi kênh và dựng hồ sơ hợp nhất, bền vững để kích hoạt.</li>
<li><strong>Identity resolution (hợp nhất định danh)</strong> — khớp các tín hiệu (email, device ID, mã thành viên, cookie) để "người dùng app", "người nhận email" và "người mua tại cửa hàng" được nhận ra là <em>cùng một người</em>.</li>
</ul>
<div class="callout"><span class="badge">Thương hiệu thật · Starbucks</span> Starbucks Rewards là một cỗ máy dữ liệu: mỗi đơn đặt qua app, nạp thẻ và quét tại quầy đều đổ vào một hồ sơ, cấp năng lượng cho ưu đãi cá nhân hoá. Chính dữ liệu bên thứ nhất — gắn với một định danh thành viên duy nhất — làm gợi ý của họ có cảm giác riêng cho từng người.</div>
<p><strong>Lưu ý quyền riêng tư:</strong> góc nhìn 360 phải dựng trên sự đồng ý và quản trị dữ liệu rõ ràng (kiểu GDPR) — niềm tin là nền móng, không phải điều nghĩ sau.</p>`,
  ]]);

const c4q = quiz('ocm301-quiz-4', 'Quiz 4 — Customer 360|||Quiz 4 — Khách hàng 360', [
  { id: 'q1', question: 'CDP (Customer Data Platform) làm nhiệm vụ gì?', options: ['Chạy quảng cáo trả phí', 'Nạp dữ liệu mọi kênh và dựng hồ sơ khách hàng hợp nhất, bền vững', 'Thiết kế logo', 'Gửi hoá đơn'], correctIndex: 1, explanation: 'CDP hợp nhất dữ liệu đa kênh thành profile để kích hoạt.' },
  { id: 'q2', question: '"First-party data" là?', options: ['Dữ liệu mua từ bên thứ ba', 'Dữ liệu thu trực tiếp từ kênh của chính bạn (có đồng ý)', 'Cookie của website khác', 'Dữ liệu công khai của đối thủ'], correctIndex: 1, explanation: 'First-party = thu trực tiếp, đáng tin, bền khi cookie bên thứ ba mất dần.' },
  { id: 'q3', question: '"Identity resolution" giải quyết vấn đề gì?', options: ['Nhận ra các tín hiệu rời (email, device, loyalty ID) là CÙNG một người', 'Đặt tên miền', 'Nén ảnh', 'Tính thuế'], correctIndex: 0, explanation: 'Khớp định danh để hợp nhất một người xuyên các kênh/thiết bị.' },
]);

const c5 = doc('ocm301-5-1-personalization', '5.1 — Personalization & automation|||5.1 — Cá nhân hoá & tự động hoá',
  'Personalization, marketing automation, trigger, journey orchestration; ví dụ Netflix/Amazon & email trigger.',
  [[
    `<span class="eyebrow">OCM301 · Chapter 5 · Lesson 5.1</span>
<h2>Personalization &amp; automation</h2>
<h3>Personalization</h3>
<p><strong>Personalization</strong> uses the customer-360 to tailor content, offers and timing to the individual — right message, right person, right moment. It ranges from simple <em>segmentation</em> (groups by behavior) to <strong>1:1</strong> recommendations driven by data and, increasingly, AI (Kotler's "Marketing 5.0").</p>
<h3>Automation, triggers &amp; orchestration</h3>
<ul>
<li><strong>Marketing automation</strong> — software runs communications at scale without manual sending.</li>
<li><strong>Triggers</strong> — an action fires a message: cart abandoned → reminder; first purchase → welcome series; birthday → offer.</li>
<li><strong>Journey orchestration</strong> — coordinating the <em>sequence</em> across channels so the next best message adapts to what the customer just did, on whichever channel — not blasting the same thing everywhere.</li>
</ul>
<div class="callout"><span class="badge">Real brand · Amazon / Netflix</span> Amazon's "customers also bought" and Netflix's homepage are recommendation engines: each surface is assembled per user from their behavior. The same logic drives triggered email flows — a browsed-but-not-bought item returns as a timely nudge.</div>
<p><strong>Watch-out:</strong> relevance vs. creepiness. Personalize on value and consent; over-tracking erodes the trust the whole system depends on.</p>`,
    `<span class="eyebrow">OCM301 · Chương 5 · Bài 5.1</span>
<h2>Cá nhân hoá &amp; tự động hoá</h2>
<h3>Cá nhân hoá</h3>
<p><strong>Cá nhân hoá</strong> dùng khách hàng 360 để may đo nội dung, ưu đãi và thời điểm cho từng người — đúng thông điệp, đúng người, đúng lúc. Trải từ <em>phân khúc</em> đơn giản (nhóm theo hành vi) đến gợi ý <strong>1:1</strong> dựa trên dữ liệu và ngày càng dùng AI ("Marketing 5.0" của Kotler).</p>
<h3>Tự động hoá, trigger &amp; điều phối hành trình</h3>
<ul>
<li><strong>Marketing automation</strong> — phần mềm chạy truyền thông ở quy mô lớn mà không cần gửi tay.</li>
<li><strong>Trigger</strong> — một hành động châm ngòi một thông điệp: bỏ giỏ → nhắc; mua lần đầu → chuỗi chào mừng; sinh nhật → ưu đãi.</li>
<li><strong>Journey orchestration (điều phối hành trình)</strong> — phối hợp <em>trình tự</em> xuyên kênh để thông điệp tốt kế tiếp thích ứng với điều khách vừa làm, trên bất kỳ kênh nào — thay vì bắn cùng một thứ khắp nơi.</li>
</ul>
<div class="callout"><span class="badge">Thương hiệu thật · Amazon / Netflix</span> "Khách cũng mua" của Amazon và trang chủ Netflix là cỗ máy gợi ý: mỗi bề mặt được lắp riêng cho từng người từ hành vi của họ. Cùng logic đó chạy luồng email trigger — món đã xem mà chưa mua quay lại như một cú nhắc đúng lúc.</div>
<p><strong>Cảnh báo:</strong> liên quan vs. rợn người. Cá nhân hoá trên giá trị và sự đồng ý; theo dõi quá đà bào mòn chính niềm tin mà cả hệ thống dựa vào.</p>`,
  ]]);

const c5q = quiz('ocm301-quiz-5', 'Quiz 5 — Personalization|||Quiz 5 — Cá nhân hoá', [
  { id: 'q1', question: 'Một "trigger" trong marketing automation là?', options: ['Một loại quảng cáo TV', 'Hành động của khách châm ngòi một thông điệp tự động (vd bỏ giỏ → nhắc)', 'Một chỉ số doanh thu', 'Tên một mạng xã hội'], correctIndex: 1, explanation: 'Trigger: sự kiện/hành động kích hoạt luồng gửi tự động.' },
  { id: 'q2', question: '"Journey orchestration" nhấn mạnh điều gì?', options: ['Bắn cùng một thông điệp khắp mọi kênh', 'Phối hợp TRÌNH TỰ xuyên kênh, thích ứng theo hành vi vừa xảy ra', 'Chỉ gửi email', 'Ngừng thu dữ liệu'], correctIndex: 1, explanation: 'Điều phối chọn "next best message" theo bối cảnh, xuyên kênh.' },
  { id: 'q3', question: 'Rủi ro chính khi cá nhân hoá quá đà là?', options: ['Tốc độ web chậm', 'Cảm giác "rợn người" và mất niềm tin của khách', 'Hết dung lượng đĩa', 'Sai chính tả'], correctIndex: 1, explanation: 'Relevance vs creepiness — cá nhân hoá phải dựa trên giá trị & đồng ý.' },
]);

const c6 = doc('ocm301-6-1-consistent-experience', '6.1 — Consistent experience|||6.1 — Trải nghiệm nhất quán',
  'Brand consistency, messaging, seamless handoff giữa các kênh, bán lẻ + e-commerce; ví dụ Disney/Apple.',
  [[
    `<span class="eyebrow">OCM301 · Chapter 6 · Lesson 6.1</span>
<h2>A consistent, seamless experience</h2>
<h3>Brand &amp; message consistency</h3>
<p>Across every channel the brand should feel like <em>the same voice</em> — consistent visual identity, tone and promise. Consistency isn't identical copy everywhere; it's a coherent <strong>message architecture</strong> adapted to each channel's format (a tweet, an email, a store display) while telling one story.</p>
<h3>Seamless handoff</h3>
<p>The hardest, most valued omnichannel skill is <strong>the handoff</strong>: a customer starts a chat on the website, continues in the app, then calls support — and never has to repeat themselves because context travels with them. In retail + e-commerce this means the cart, wishlist, order status and support history are shared state, not per-channel copies.</p>
<div class="callout"><span class="badge">Real brand · Apple</span> Apple's retail store, apple.com, the Apple Store app and support all present one identity: reserve online and pick up in-store, start a repair online and finish at the Genius Bar. The physical and digital feel like one continuous surface.</div>
<p>Consistency also protects trust: contradictory prices, promos or answers across channels are the fastest way to look disorganized and lose the sale.</p>`,
    `<span class="eyebrow">OCM301 · Chương 6 · Bài 6.1</span>
<h2>Trải nghiệm nhất quán, liền mạch</h2>
<h3>Nhất quán thương hiệu &amp; thông điệp</h3>
<p>Trên mọi kênh, thương hiệu phải cho cảm giác <em>cùng một giọng nói</em> — nhận diện, tông giọng và lời hứa nhất quán. Nhất quán không phải là copy y hệt khắp nơi; đó là một <strong>kiến trúc thông điệp</strong> mạch lạc, thích ứng theo định dạng từng kênh (một tweet, một email, một biển trong cửa hàng) mà vẫn kể một câu chuyện.</p>
<h3>Chuyển giao liền mạch (seamless handoff)</h3>
<p>Kỹ năng omnichannel khó và quý nhất là <strong>chuyển giao</strong>: khách bắt đầu chat trên web, tiếp tục trên app, rồi gọi tổng đài — mà không phải kể lại từ đầu vì bối cảnh đi theo họ. Trong bán lẻ + thương mại điện tử, điều này nghĩa là giỏ hàng, wishlist, trạng thái đơn và lịch sử hỗ trợ là trạng thái chung, không phải bản sao riêng từng kênh.</p>
<div class="callout"><span class="badge">Thương hiệu thật · Apple</span> Cửa hàng Apple, apple.com, app Apple Store và bộ phận hỗ trợ đều thể hiện một định danh: đặt online nhận tại cửa hàng, mở yêu cầu sửa online rồi hoàn tất tại Genius Bar. Vật lý và số như một bề mặt liên tục.</div>
<p>Nhất quán còn bảo vệ niềm tin: giá, khuyến mãi hay câu trả lời mâu thuẫn giữa các kênh là cách nhanh nhất để trông thiếu tổ chức và mất đơn hàng.</p>`,
  ]]);

const c6q = quiz('ocm301-quiz-6', 'Quiz 6 — Consistency|||Quiz 6 — Nhất quán', [
  { id: 'q1', question: 'Nhất quán thương hiệu đa kênh nghĩa là?', options: ['Copy y hệt trên mọi kênh', 'Một kiến trúc thông điệp mạch lạc, thích ứng theo định dạng từng kênh nhưng kể một câu chuyện', 'Chỉ dùng một kênh', 'Đổi logo mỗi kênh'], correctIndex: 1, explanation: 'Nhất quán = một giọng/câu chuyện, thích ứng định dạng, không phải copy giống hệt.' },
  { id: 'q2', question: '"Seamless handoff" (chuyển giao liền mạch) là?', options: ['Chuyển kênh mà khách phải kể lại từ đầu', 'Bối cảnh & lịch sử đi theo khách khi họ đổi kênh, không phải lặp lại', 'Tắt kênh cũ đi', 'Đổi nhân viên'], correctIndex: 1, explanation: 'Handoff: context travels — web→app→tổng đài không mất mạch.' },
  { id: 'q3', question: 'Vì sao giá/khuyến mãi mâu thuẫn giữa các kênh nguy hiểm?', options: ['Tốn điện', 'Làm thương hiệu trông thiếu tổ chức và mất niềm tin/đơn hàng', 'Chậm web', 'Không sao cả'], correctIndex: 1, explanation: 'Mâu thuẫn đa kênh phá nhất quán, bào mòn niềm tin.' },
]);

const c7 = doc('ocm301-7-1-martech-stack', '7.1 — Technology & the MarTech stack|||7.1 — Công nghệ & MarTech stack',
  'CRM, CDP, DMP, tích hợp API, martech landscape; cách các mảnh ghép nối nhau.',
  [[
    `<span class="eyebrow">OCM301 · Chapter 7 · Lesson 7.1</span>
<h2>Technology &amp; the MarTech stack</h2>
<h3>The core systems</h3>
<ul>
<li><strong>CRM (Customer Relationship Management)</strong> — the system of record for known customers &amp; leads: contacts, deals, service history (e.g. Salesforce, HubSpot).</li>
<li><strong>CDP (Customer Data Platform)</strong> — unifies behavioral + transactional data from all channels into persistent profiles for activation.</li>
<li><strong>DMP (Data Management Platform)</strong> — handles mostly <em>anonymous</em>, often third-party audience data for ad targeting; short-lived and cookie-based (fading in importance).</li>
</ul>
<p><strong>CRM vs CDP vs DMP:</strong> CRM = known relationships you manage; CDP = unified first-party profiles for orchestration; DMP = anonymous audiences for paid reach.</p>
<h3>Integration is the whole game</h3>
<p>An omnichannel stack is only as good as its <strong>integrations</strong>. Systems talk via <strong>APIs</strong> and event streams so a signal in one tool (a purchase in the CRM) can trigger action in another (a journey in the automation platform). The "MarTech landscape" has thousands of tools — the skill is choosing a coherent, connected few, not owning the most logos.</p>
<div class="callout"><span class="badge">Design principle</span> Put the CDP / customer-360 at the center as the <strong>single source of truth</strong>; let CRM, email, ads, web and support read and write to it through APIs. Data flows in, unified profiles flow out, every channel acts on the same truth.</div>`,
    `<span class="eyebrow">OCM301 · Chương 7 · Bài 7.1</span>
<h2>Công nghệ &amp; MarTech stack</h2>
<h3>Các hệ thống lõi</h3>
<ul>
<li><strong>CRM (Quản trị quan hệ khách hàng)</strong> — sổ ghi khách hàng &amp; lead đã biết: liên hệ, cơ hội, lịch sử chăm sóc (vd Salesforce, HubSpot).</li>
<li><strong>CDP (Nền tảng dữ liệu khách hàng)</strong> — hợp nhất dữ liệu hành vi + giao dịch từ mọi kênh thành hồ sơ bền vững để kích hoạt.</li>
<li><strong>DMP (Nền tảng quản trị dữ liệu)</strong> — xử lý dữ liệu khán giả phần lớn <em>ẩn danh</em>, thường là bên thứ ba, để nhắm quảng cáo; ngắn hạn, dựa cookie (đang giảm vai trò).</li>
</ul>
<p><strong>CRM vs CDP vs DMP:</strong> CRM = quan hệ đã biết bạn quản lý; CDP = hồ sơ bên thứ nhất hợp nhất để điều phối; DMP = khán giả ẩn danh cho độ phủ trả phí.</p>
<h3>Tích hợp mới là tất cả</h3>
<p>Một stack đa kênh chỉ tốt bằng khả năng <strong>tích hợp</strong> của nó. Các hệ thống nói chuyện qua <strong>API</strong> và luồng sự kiện để một tín hiệu ở công cụ này (một đơn mua trong CRM) châm ngòi hành động ở công cụ khác (một hành trình trong nền tảng automation). "MarTech landscape" có hàng nghìn công cụ — kỹ năng là chọn một vài cái mạch lạc, kết nối được, chứ không phải sở hữu nhiều logo nhất.</p>
<div class="callout"><span class="badge">Nguyên tắc thiết kế</span> Đặt CDP / khách hàng 360 ở trung tâm làm <strong>nguồn sự thật duy nhất</strong>; để CRM, email, quảng cáo, web và hỗ trợ đọc/ghi vào nó qua API. Dữ liệu chảy vào, hồ sơ hợp nhất chảy ra, mọi kênh hành động trên cùng một sự thật.</div>`,
  ]]);

const c7q = quiz('ocm301-quiz-7', 'Quiz 7 — MarTech stack|||Quiz 7 — MarTech stack', [
  { id: 'q1', question: 'Khác biệt chính giữa CRM và CDP là?', options: ['Giống hệt nhau', 'CRM = quan hệ khách ĐÃ BIẾT bạn quản lý; CDP = hợp nhất hồ sơ first-party đa kênh để điều phối', 'CDP chỉ để gửi email', 'CRM chỉ dùng cho quảng cáo ẩn danh'], correctIndex: 1, explanation: 'CRM system-of-record cho khách đã biết; CDP unify dữ liệu đa kênh.' },
  { id: 'q2', question: 'DMP (Data Management Platform) chủ yếu xử lý?', options: ['Dữ liệu khán giả ẩn danh/bên thứ ba để nhắm quảng cáo', 'Hoá đơn kế toán', 'Mã nguồn web', 'Hợp đồng lao động'], correctIndex: 0, explanation: 'DMP: audience ẩn danh, cookie-based cho ad targeting (đang giảm vai trò).' },
  { id: 'q3', question: 'Điều gì khiến một MarTech stack hoạt động như một khối?', options: ['Sở hữu nhiều công cụ nhất', 'Tích hợp qua API/luồng sự kiện quanh một nguồn sự thật duy nhất', 'Không chia sẻ dữ liệu', 'Mỗi kênh một hồ sơ riêng'], correctIndex: 1, explanation: 'Tích hợp API + CDP làm nguồn sự thật trung tâm là chìa khoá.' },
]);

const c8 = doc('ocm301-8-1-measurement', '8.1 — Omnichannel measurement|||8.1 — Đo lường đa kênh',
  'Attribution multi-touch, CLV, unified analytics, KPI đa kênh; vì sao last-click gây hiểu lầm.',
  [[
    `<span class="eyebrow">OCM301 · Chapter 8 · Lesson 8.1</span>
<h2>Omnichannel measurement</h2>
<h3>Attribution — who gets the credit?</h3>
<p>A conversion usually follows many touchpoints. <strong>Attribution</strong> assigns credit across them.</p>
<ul>
<li><strong>Last-click</strong> — all credit to the final touch. Simple, but it hides the channels that started and nurtured the journey.</li>
<li><strong>First-click</strong> — all credit to the first touch.</li>
<li><strong>Multi-touch (linear, time-decay, position-based)</strong> — distributes credit across the path, giving a fairer, omnichannel-honest picture of what actually drove the sale.</li>
</ul>
<h3>Value &amp; unified analytics</h3>
<ul>
<li><strong>CLV (Customer Lifetime Value)</strong> — the total value of a customer over the whole relationship. Omnichannel optimizes for CLV, not a single campaign's ROI.</li>
<li><strong>Unified analytics</strong> — one measurement layer that stitches channels together (cross-device, e.g. GA4) instead of counting each channel in isolation and double-counting people.</li>
<li><strong>KPIs per channel &amp; overall</strong> — reach, engagement, conversion, retention, NPS — chosen to match each channel's role in the journey.</li>
</ul>
<div class="callout"><span class="badge">Key idea</span> The trap is <strong>last-click bias</strong>: it over-credits the closing channel (often search/retargeting) and starves the awareness channels that made the sale possible. Multi-touch attribution + CLV keep the whole omnichannel journey visible.</div>`,
    `<span class="eyebrow">OCM301 · Chương 8 · Bài 8.1</span>
<h2>Đo lường đa kênh</h2>
<h3>Quy kết (attribution) — ai được ghi công?</h3>
<p>Một chuyển đổi thường theo sau nhiều điểm chạm. <strong>Quy kết</strong> phân bổ công cho chúng.</p>
<ul>
<li><strong>Last-click</strong> — dồn hết công cho điểm chạm cuối. Đơn giản, nhưng che mất các kênh đã khởi động và nuôi dưỡng hành trình.</li>
<li><strong>First-click</strong> — dồn hết công cho điểm chạm đầu.</li>
<li><strong>Multi-touch (tuyến tính, time-decay, theo vị trí)</strong> — phân bổ công dọc hành trình, cho bức tranh công bằng và trung thực với đa kênh về thứ thực sự tạo ra đơn hàng.</li>
</ul>
<h3>Giá trị &amp; phân tích hợp nhất</h3>
<ul>
<li><strong>CLV (Giá trị vòng đời khách hàng)</strong> — tổng giá trị của một khách suốt cả mối quan hệ. Omnichannel tối ưu cho CLV, không phải ROI của một chiến dịch đơn lẻ.</li>
<li><strong>Unified analytics</strong> — một tầng đo lường khâu các kênh lại (xuyên thiết bị, vd GA4) thay vì đếm từng kênh riêng lẻ và đếm trùng người.</li>
<li><strong>KPI theo kênh &amp; tổng thể</strong> — độ phủ, tương tác, chuyển đổi, giữ chân, NPS — chọn khớp vai trò của từng kênh trong hành trình.</li>
</ul>
<div class="callout"><span class="badge">Ý chính</span> Cái bẫy là <strong>thiên lệch last-click</strong>: nó ghi công quá mức cho kênh chốt đơn (thường là search/retargeting) và bỏ đói các kênh nhận biết đã làm nên đơn hàng. Quy kết đa điểm chạm + CLV giữ cho cả hành trình đa kênh hiện rõ.</div>`,
  ]]);

const c8q = quiz('ocm301-quiz-8', 'Quiz 8 — Measurement|||Quiz 8 — Đo lường', [
  { id: 'q1', question: 'Vì sao mô hình quy kết "last-click" gây hiểu lầm trong omnichannel?', options: ['Nó quá phức tạp', 'Nó dồn hết công cho điểm chạm cuối, che mất các kênh nhận biết/nuôi dưỡng', 'Nó không đo được gì', 'Nó chỉ dùng cho email'], correctIndex: 1, explanation: 'Last-click bias bỏ đói kênh awareness; multi-touch công bằng hơn.' },
  { id: 'q2', question: 'CLV (Customer Lifetime Value) là?', options: ['Chi phí một quảng cáo', 'Tổng giá trị của một khách suốt cả mối quan hệ', 'Số kênh đang dùng', 'Tỉ lệ mở email'], correctIndex: 1, explanation: 'CLV: giá trị vòng đời — omnichannel tối ưu cho CLV, không phải một chiến dịch.' },
  { id: 'q3', question: '"Unified analytics" giải quyết vấn đề gì?', options: ['Khâu các kênh xuyên thiết bị để tránh đếm trùng người và đo cả hành trình', 'Chỉ đếm lượt xem trang', 'Xoá dữ liệu cũ', 'Tăng ngân sách quảng cáo'], correctIndex: 0, explanation: 'Đo hợp nhất thay vì đếm từng kênh riêng lẻ và double-count.' },
]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'OCM301',
    slug: 'ocm301-omnichannel-communications-management',
    title: 'Omnichannel Communications Management',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/OCM301.webp',
    shortDescription: 'Plan & run unified communications across every channel — journey mapping, ZMOT, PESO, customer-360 & CDP, personalization, seamless experience, MarTech stack & multi-touch attribution. Bilingual, real-brand cases.|||Hoạch định & vận hành truyền thông hợp nhất trên mọi kênh — hành trình khách hàng, ZMOT, PESO, khách hàng 360 & CDP, cá nhân hoá, trải nghiệm liền mạch, MarTech stack & quy kết đa điểm chạm. Song ngữ, ví dụ thương hiệu thật.',
    description: 'Môn <strong>OCM301 — Omnichannel Communications Management</strong> (Quản trị truyền thông đa kênh hợp nhất) dạy cách hoạch định và vận hành <strong>truyền thông hợp nhất trên mọi kênh</strong>. Từ <strong>khái niệm</strong> (multichannel vs cross-channel vs omnichannel) → <strong>hành trình khách hàng</strong> (touchpoints, ZMOT, 5A) → <strong>kênh PESO &amp; O2O</strong> → <strong>khách hàng 360 &amp; CDP</strong> → <strong>cá nhân hoá &amp; tự động hoá</strong> → <strong>nhất quán &amp; MarTech stack</strong> → <strong>đo lường (quy kết đa điểm chạm, CLV)</strong>. Khung theo tài liệu chuẩn quốc tế (Kotler Marketing 4.0/5.0, Rigby, HBR, Google, Salesforce), song ngữ, ví dụ thương hiệu thật (Starbucks, Disney, Sephora, Nike), quiz mỗi chương.',
    whatYouLearn: 'Phân biệt multichannel/cross-channel/omnichannel; vẽ hành trình khách hàng (touchpoint, moments of truth, ZMOT, 5A của Kotler); mô hình PESO &amp; O2O; single customer view, first-party data, CDP &amp; identity resolution; cá nhân hoá, marketing automation, trigger &amp; journey orchestration; nhất quán thương hiệu &amp; seamless handoff (retail + e-commerce); MarTech stack (CRM/CDP/DMP, tích hợp API); quy kết đa điểm chạm, CLV, unified analytics &amp; KPI đa kênh.',
    requirements: 'Kiến thức marketing/truyền thông căn bản. Không cần lập trình. Nên có tài khoản Google Analytics và một công cụ CDP/automation miễn phí để thực hành.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách chuẩn (Kotler, Rigby), HBR & Google, Salesforce/McKinsey, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Truyền thông đa kênh hợp nhất, vì sao hợp nhất, lộ trình.', lessons: [intro] },
    { title: 'Chương 1 — Đa kênh là gì|||Chapter 1 — What is omnichannel', description: 'Multichannel vs cross-channel vs omnichannel; Disney, Starbucks.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Hành trình khách hàng|||Chapter 2 — Customer journey', description: 'Journey mapping, touchpoints, moments of truth, ZMOT, 5A.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Kênh PESO & O2O|||Chapter 3 — PESO & O2O', description: 'Paid/earned/shared/owned, online-offline; Nike.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Khách hàng 360 & dữ liệu|||Chapter 4 — Customer 360 & data', description: 'CDP, single customer view, first-party data, identity resolution.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Cá nhân hoá & tự động hoá|||Chapter 5 — Personalization & automation', description: 'Personalization, automation, trigger, journey orchestration.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Trải nghiệm nhất quán|||Chapter 6 — Consistent experience', description: 'Brand consistency, seamless handoff, retail + e-commerce.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Công nghệ & MarTech|||Chapter 7 — Technology & MarTech', description: 'CRM, CDP, DMP, tích hợp API, martech landscape.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Đo lường đa kênh|||Chapter 8 — Measurement', description: 'Attribution multi-touch, CLV, unified analytics, KPI.', lessons: [c8, c8q] },
  ],
};
