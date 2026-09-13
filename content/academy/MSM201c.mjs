/**
 * MSM201c — Meta Social Media Marketing Management. Khối Công nghệ Truyền thông
 * FPTU: quản trị marketing mạng xã hội trên nền tảng Meta — hệ sinh thái Meta,
 * chiến lược nội dung, Trang & cộng đồng, Business Suite, quảng cáo Meta (Ads
 * Manager, nhắm mục tiêu, Pixel/CAPI), tối ưu & đo lường. Song ngữ + thao tác
 * thật trên nền tảng + ví dụ chiến dịch. Nguồn: Meta Blueprint, Tuten & Solomon
 * "Social Media Marketing", Meta Business Help Center, Hootsuite/Sprout academy.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('msm201c-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), chứng chỉ Meta Blueprint, tài liệu chính thức Meta, sách, academy miễn phí, lộ trình tự học 4 bước.',
  [[
    `<span class="eyebrow">MSM201c · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>social media marketing on Meta platforms</strong> — the ecosystem, content strategy, community, Business Suite, ads and measurement — in one place. The official FPTU slides &amp; syllabus live on <strong>FLM</strong>; below are free, official resources.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for MSM201c are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>🏅 Certification (free to study)</h3>
<ul>
<li><a href="https://www.facebook.com/business/learn" target="_blank" rel="noopener">Meta Blueprint</a> — official learning paths &amp; the Meta Certified Digital Marketing Associate track.</li>
<li><a href="https://www.facebook.com/business/help" target="_blank" rel="noopener">Meta Business Help Center</a> — how-to docs for Pages, Business Suite &amp; Ads Manager.</li>
</ul>
<h3>📗 Reference book</h3>
<ul>
<li><em>Social Media Marketing</em> — Tracy L. Tuten &amp; Michael R. Solomon (SAGE) — the standard academic text.</li>
</ul>
<h3>🌐 Free academies &amp; tools</h3>
<ul>
<li><a href="https://education.hootsuite.com/" target="_blank" rel="noopener">Hootsuite Academy</a> — social strategy &amp; platform courses.</li>
<li><a href="https://sproutsocial.com/insights/" target="_blank" rel="noopener">Sprout Social Insights</a> — data, benchmarks &amp; best practice.</li>
<li><a href="https://business.facebook.com/" target="_blank" rel="noopener">Meta Business Suite</a> — the real console you'll manage Pages &amp; ads in.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — the Meta ecosystem, organic content &amp; how the algorithm ranks reach.</li>
<li><strong>Manage</strong> — set up a Business Suite, run a Page &amp; community, schedule and read insights.</li>
<li><strong>Advertise</strong> — build a campaign in Ads Manager, target audiences, install the Pixel &amp; Conversions API.</li>
<li><strong>Optimize &amp; prove</strong> — A/B test creative, cut CPA, read ROAS and report results ethically.</li>
</ol></div>`,
    `<span class="eyebrow">MSM201c · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>marketing mạng xã hội trên nền tảng Meta</strong> — hệ sinh thái, chiến lược nội dung, cộng đồng, Business Suite, quảng cáo và đo lường — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, chính thống.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của MSM201c có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>🏅 Chứng chỉ (học miễn phí)</h3>
<ul>
<li><a href="https://www.facebook.com/business/learn" target="_blank" rel="noopener">Meta Blueprint</a> — lộ trình học chính thức &amp; chứng chỉ Meta Certified Digital Marketing Associate.</li>
<li><a href="https://www.facebook.com/business/help" target="_blank" rel="noopener">Meta Business Help Center</a> — tài liệu hướng dẫn Trang, Business Suite &amp; Ads Manager.</li>
</ul>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><em>Social Media Marketing</em> — Tracy L. Tuten &amp; Michael R. Solomon (SAGE) — giáo trình học thuật chuẩn.</li>
</ul>
<h3>🌐 Academy miễn phí &amp; công cụ</h3>
<ul>
<li><a href="https://education.hootsuite.com/" target="_blank" rel="noopener">Hootsuite Academy</a> — khoá chiến lược &amp; nền tảng mạng xã hội.</li>
<li><a href="https://sproutsocial.com/insights/" target="_blank" rel="noopener">Sprout Social Insights</a> — dữ liệu, chuẩn ngành &amp; thực hành tốt.</li>
<li><a href="https://business.facebook.com/" target="_blank" rel="noopener">Meta Business Suite</a> — bảng điều khiển thật để quản Trang &amp; quảng cáo.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — hệ sinh thái Meta, nội dung organic &amp; cách thuật toán xếp hạng tiếp cận.</li>
<li><strong>Quản lý</strong> — dựng Business Suite, vận hành Trang &amp; cộng đồng, lên lịch và đọc insights.</li>
<li><strong>Quảng cáo</strong> — dựng chiến dịch trong Ads Manager, nhắm đối tượng, cài Pixel &amp; Conversions API.</li>
<li><strong>Tối ưu &amp; chứng minh</strong> — A/B test sáng tạo, hạ CPA, đọc ROAS và báo cáo kết quả có đạo đức.</li>
</ol></div>`,
  ]]);

const intro = doc('msm201c-0-1-overview', 'Course overview: Meta social media marketing|||Tổng quan: Marketing mạng xã hội Meta',
  'Meta là gì trong marketing; owned/earned/paid; lộ trình: hệ sinh thái → nội dung → cộng đồng → Business Suite → quảng cáo → nhắm mục tiêu/Pixel → tối ưu → đo lường.',
  [[
    `<span class="eyebrow">MSM201c · Lesson 0.1 · Overview</span>
<h2>Meta social media marketing</h2>
<p class="lead">This course teaches you to <strong>plan, run and measure marketing across Meta's platforms</strong> — Facebook, Instagram, Messenger, WhatsApp and Threads — combining <strong>organic</strong> content and community with <strong>paid</strong> advertising, the way a real social media manager works.</p>
<h3>The three kinds of media</h3>
<ul>
<li><strong>Owned</strong> — your Page, profile and content you publish for free.</li>
<li><strong>Earned</strong> — shares, comments, mentions and word-of-mouth you don't pay for.</li>
<li><strong>Paid</strong> — ads you buy in Ads Manager to reach beyond your followers.</li>
</ul>
<p>Great social marketing weaves all three: organic builds trust, ads scale reach, community keeps people coming back.</p>
<h3>Roadmap</h3>
<p>Meta ecosystem → content strategy (reels/story/feed/live) → Pages &amp; community → Meta Business Suite → ad structure (Ads Manager) → targeting &amp; the Pixel → creative &amp; optimization → measurement &amp; reporting. Bilingual, aligned to <strong>Meta Blueprint</strong>, with real campaign examples and a quiz each chapter.</p>
<div class="callout"><span class="badge">Why Meta</span> Meta's apps reach billions of daily users and share one ad and audience system — learn it once and you can run campaigns across every surface from a single console.</div>`,
    `<span class="eyebrow">MSM201c · Bài 0.1 · Tổng quan</span>
<h2>Marketing mạng xã hội trên Meta</h2>
<p class="lead">Môn này dạy bạn <strong>lập kế hoạch, triển khai và đo lường marketing trên các nền tảng của Meta</strong> — Facebook, Instagram, Messenger, WhatsApp và Threads — kết hợp nội dung <strong>organic</strong> &amp; cộng đồng với quảng cáo <strong>trả phí</strong>, đúng cách một người quản lý mạng xã hội thật làm việc.</p>
<h3>Ba loại kênh truyền thông</h3>
<ul>
<li><strong>Owned (sở hữu)</strong> — Trang, hồ sơ và nội dung bạn tự đăng miễn phí.</li>
<li><strong>Earned (lan truyền)</strong> — lượt chia sẻ, bình luận, nhắc tên và truyền miệng không mất tiền.</li>
<li><strong>Paid (trả phí)</strong> — quảng cáo mua trong Ads Manager để tiếp cận ngoài người theo dõi.</li>
</ul>
<p>Marketing giỏi đan cả ba: organic xây niềm tin, quảng cáo mở rộng tiếp cận, cộng đồng giữ người quay lại.</p>
<h3>Lộ trình</h3>
<p>Hệ sinh thái Meta → chiến lược nội dung (reels/story/feed/live) → Trang &amp; cộng đồng → Meta Business Suite → cấu trúc quảng cáo (Ads Manager) → nhắm mục tiêu &amp; Pixel → sáng tạo &amp; tối ưu → đo lường &amp; báo cáo. Song ngữ, bám <strong>Meta Blueprint</strong>, có ví dụ chiến dịch thật và quiz mỗi chương.</p>
<div class="callout"><span class="badge">Vì sao Meta</span> Các ứng dụng của Meta tiếp cận hàng tỷ người mỗi ngày và dùng chung một hệ quảng cáo &amp; đối tượng — học một lần là chạy được chiến dịch trên mọi bề mặt từ một bảng điều khiển.</div>`,
  ]]);

const c1 = doc('msm201c-1-1-ecosystem', '1.1 — The Meta ecosystem|||1.1 — Hệ sinh thái Meta',
  'Facebook, Instagram, Messenger, WhatsApp, Threads — mỗi nền tảng đối tượng/format/vai trò marketing khác nhau; chọn kênh theo mục tiêu.',
  [[
    `<span class="eyebrow">MSM201c · Chapter 1 · Lesson 1.1</span>
<h2>The Meta ecosystem</h2>
<p>Meta runs a family of apps that share one identity, ad and audience layer. Each has its own audience and content style.</p>
<ul>
<li><strong>Facebook</strong> — the broadest audience; Pages, Groups, Marketplace, events. Strong for community, local business and older demographics.</li>
<li><strong>Instagram</strong> — visual-first; Reels, Stories, feed, shopping. Strong for brand, lifestyle, creators and Gen Z/millennials.</li>
<li><strong>Messenger</strong> — 1:1 and automated conversations; click-to-message ads, customer care, chatbots.</li>
<li><strong>WhatsApp</strong> — messaging &amp; the Business API; order updates, support, broadcast in markets where it dominates.</li>
<li><strong>Threads</strong> — text conversation, real-time and topical; useful for voice, commentary and reach experiments.</li>
</ul>
<h3>On the platform</h3>
<p>You manage all of them from <strong>Meta Business Suite</strong>, and a single Meta ad campaign can be delivered across their placements automatically (Advantage+ placements).</p>
<div class="callout"><span class="badge">Real example</span> A café brand posts Reels on Instagram for reach, runs a Facebook Group for regulars, and uses click-to-Messenger ads so people can book a table in chat — one brand, three Meta surfaces, one goal.</div>`,
    `<span class="eyebrow">MSM201c · Chương 1 · Bài 1.1</span>
<h2>Hệ sinh thái Meta</h2>
<p>Meta vận hành một họ ứng dụng dùng chung một lớp danh tính, quảng cáo và đối tượng. Mỗi nền tảng có đối tượng và phong cách nội dung riêng.</p>
<ul>
<li><strong>Facebook</strong> — đối tượng rộng nhất; Trang, Nhóm, Marketplace, sự kiện. Mạnh cho cộng đồng, doanh nghiệp địa phương và nhóm tuổi lớn hơn.</li>
<li><strong>Instagram</strong> — ưu tiên hình ảnh; Reels, Stories, feed, mua sắm. Mạnh cho thương hiệu, lifestyle, nhà sáng tạo và Gen Z/millennials.</li>
<li><strong>Messenger</strong> — trò chuyện 1:1 và tự động; quảng cáo click-to-message, chăm sóc khách, chatbot.</li>
<li><strong>WhatsApp</strong> — nhắn tin &amp; Business API; cập nhật đơn, hỗ trợ, gửi hàng loạt ở thị trường nó thống lĩnh.</li>
<li><strong>Threads</strong> — hội thoại dạng chữ, thời gian thực và theo chủ đề; hợp để tạo giọng nói thương hiệu, bình luận và thử tiếp cận.</li>
</ul>
<h3>Thao tác thực tế</h3>
<p>Bạn quản mọi nền tảng từ <strong>Meta Business Suite</strong>, và một chiến dịch quảng cáo Meta có thể phân phối tự động trên mọi vị trí của chúng (vị trí Advantage+).</p>
<div class="callout"><span class="badge">Ví dụ thật</span> Một thương hiệu quán cà phê đăng Reels trên Instagram để tiếp cận, chạy Nhóm Facebook cho khách quen, và dùng quảng cáo click-to-Messenger để khách đặt bàn ngay trong chat — một thương hiệu, ba bề mặt Meta, một mục tiêu.</div>`,
  ]]);

const c1q = quiz('msm201c-quiz-1', 'Quiz 1 — Meta ecosystem|||Quiz 1 — Hệ sinh thái Meta', [
  { id: 'q1', question: 'Nền tảng nào của Meta ưu tiên hình ảnh, mạnh cho thương hiệu/lifestyle và nhà sáng tạo?|||Which Meta platform is visual-first, strong for brand/lifestyle and creators?', options: ['WhatsApp', 'Instagram', 'Messenger', 'Threads'], correctIndex: 1, explanation: 'Instagram ưu tiên hình ảnh (Reels/Stories/feed), mạnh cho thương hiệu và creator.' },
  { id: 'q2', question: 'Công cụ nào quản mọi nền tảng Meta từ một chỗ?|||Which tool manages all Meta platforms in one place?', options: ['Meta Business Suite', 'Google Analytics', 'Canva', 'Notion'], correctIndex: 0, explanation: 'Business Suite là bảng điều khiển hợp nhất cho Trang, nội dung và quảng cáo.' },
  { id: 'q3', question: 'Nền tảng nào hợp nhất cho quảng cáo click-to-message và chatbot chăm sóc khách?|||Which platform best fits click-to-message ads and support chatbots?', options: ['Marketplace|||Marketplace', 'Threads', 'Messenger', 'Reels'], correctIndex: 2, explanation: 'Messenger dành cho hội thoại 1:1, click-to-Messenger và chatbot.' },
]);

const c2 = doc('msm201c-2-1-content-strategy', '2.1 — Content strategy on Meta|||2.1 — Chiến lược nội dung Meta',
  'Content pillar; format reels/story/feed/live; thuật toán xếp hạng tiếp cận organic; lịch nội dung & giọng thương hiệu.',
  [[
    `<span class="eyebrow">MSM201c · Chapter 2 · Lesson 2.1</span>
<h2>Content strategy on Meta</h2>
<h3>Content pillars</h3>
<p><strong>Content pillars</strong> are 3–5 recurring themes your brand posts about (e.g. educate, entertain, inspire, promote). They keep output consistent and on-brand instead of random.</p>
<h3>Formats &amp; when to use them</h3>
<ul>
<li><strong>Reels</strong> — short vertical video; the top format for <em>organic reach</em> and finding new audiences.</li>
<li><strong>Stories</strong> — 24-hour, casual; polls, questions, behind-the-scenes, link stickers.</li>
<li><strong>Feed</strong> — durable posts/carousels; depth, product detail, saveable value.</li>
<li><strong>Live</strong> — real-time Q&amp;A, launches, events; strong for engagement and trust.</li>
</ul>
<h3>How the algorithm ranks</h3>
<p>Meta's feed &amp; Reels ranking rewards <strong>meaningful engagement</strong> — watch time, saves, shares, comments — and content the viewer is predicted to enjoy. It is not chronological; <strong>hook the first 3 seconds</strong> and earn interaction to grow organic reach.</p>
<div class="callout"><span class="badge">Real example</span> A skincare brand uses pillars — "how-to", "myth-busting", "customer results" — posts 3 Reels/week for reach, saves the deep routine as a feed carousel, and goes Live monthly for Q&amp;A. Organic reach climbs because saves and shares signal value.</div>`,
    `<span class="eyebrow">MSM201c · Chương 2 · Bài 2.1</span>
<h2>Chiến lược nội dung trên Meta</h2>
<h3>Trụ nội dung (content pillar)</h3>
<p><strong>Trụ nội dung</strong> là 3–5 chủ đề lặp lại thương hiệu đăng (vd giáo dục, giải trí, truyền cảm hứng, quảng bá). Chúng giữ nội dung nhất quán, đúng thương hiệu thay vì đăng ngẫu nhiên.</p>
<h3>Các format &amp; khi nào dùng</h3>
<ul>
<li><strong>Reels</strong> — video dọc ngắn; format số một cho <em>tiếp cận organic</em> và tìm đối tượng mới.</li>
<li><strong>Stories</strong> — 24 giờ, thân mật; poll, câu hỏi, hậu trường, sticker link.</li>
<li><strong>Feed</strong> — bài/carousel lâu dài; chiều sâu, chi tiết sản phẩm, giá trị để lưu.</li>
<li><strong>Live</strong> — hỏi đáp thời gian thực, ra mắt, sự kiện; mạnh cho tương tác và niềm tin.</li>
</ul>
<h3>Thuật toán xếp hạng thế nào</h3>
<p>Xếp hạng feed &amp; Reels của Meta thưởng cho <strong>tương tác có ý nghĩa</strong> — thời gian xem, lượt lưu, chia sẻ, bình luận — và nội dung được dự đoán người xem thích. Nó không theo thứ tự thời gian; <strong>hút 3 giây đầu</strong> và tạo tương tác để tăng tiếp cận organic.</p>
<div class="callout"><span class="badge">Ví dụ thật</span> Một thương hiệu chăm sóc da dùng trụ nội dung — "hướng dẫn", "phá lầm tưởng", "kết quả khách hàng" — đăng 3 Reels/tuần để tiếp cận, lưu quy trình chi tiết vào carousel feed, và Live hàng tháng để hỏi đáp. Tiếp cận organic tăng vì lượt lưu và chia sẻ báo hiệu giá trị.</div>`,
  ]]);

const c2q = quiz('msm201c-quiz-2', 'Quiz 2 — Content strategy|||Quiz 2 — Chiến lược nội dung', [
  { id: 'q1', question: 'Content pillar là gì?|||What is a content pillar?', options: ['Một quảng cáo trả phí|||A paid ad', '3–5 chủ đề lặp lại giữ nội dung nhất quán|||3–5 recurring themes keeping content consistent', 'Một chỉ số đo lường|||A measurement metric', 'Một loại đối tượng|||An audience type'], correctIndex: 1, explanation: 'Trụ nội dung là các chủ đề lặp lại giữ output nhất quán, đúng thương hiệu.' },
  { id: 'q2', question: 'Format nào tốt nhất cho tiếp cận organic và tìm đối tượng mới?|||Which format is best for organic reach and new audiences?', options: ['Reels', 'Stories', 'Ảnh feed tĩnh|||Static feed photo', 'Ghim (pin)|||Pinned post'], correctIndex: 0, explanation: 'Reels là format tiếp cận organic mạnh nhất hiện nay của Meta.' },
  { id: 'q3', question: 'Thuật toán feed/Reels của Meta chủ yếu thưởng cho điều gì?|||What does the Meta feed/Reels algorithm mainly reward?', options: ['Thứ tự thời gian đăng|||Chronological order', 'Số ký tự trong caption|||Caption length', 'Tương tác có ý nghĩa: xem/lưu/chia sẻ/bình luận|||Meaningful engagement: watch/save/share/comment', 'Số hashtag|||Number of hashtags'], correctIndex: 2, explanation: 'Xếp hạng dựa trên tương tác có ý nghĩa và mức độ dự đoán người xem thích.' },
]);

const c3 = doc('msm201c-3-1-pages-community', '3.1 — Pages & community management|||3.1 — Trang & quản trị cộng đồng',
  'Facebook Page/Group, Instagram business/creator; quản trị cộng đồng, phản hồi, kiểm duyệt; nuôi engagement.',
  [[
    `<span class="eyebrow">MSM201c · Chapter 3 · Lesson 3.1</span>
<h2>Pages &amp; community management</h2>
<h3>Your brand home</h3>
<ul>
<li><strong>Facebook Page</strong> — the public brand profile: about, CTA button, reviews, shop, events. Required to run Meta ads.</li>
<li><strong>Facebook Group</strong> — a members' space for discussion and loyalty; higher engagement, community-owned.</li>
<li><strong>Instagram business/creator account</strong> — unlocks Insights, contact buttons, shopping and ad promotion.</li>
</ul>
<h3>Community management</h3>
<p><strong>Community management</strong> is the daily work of replying, moderating and nurturing an audience: answer comments &amp; DMs quickly, welcome and set rules in Groups, remove spam, and turn questions into content. It converts followers into fans.</p>
<h3>Engagement tactics</h3>
<p>Ask questions, run polls in Stories, reply with value (not just emojis), feature user-generated content, and be consistent. Engagement feeds the algorithm and builds trust at the same time.</p>
<div class="callout"><span class="badge">Real example</span> A fitness brand runs a members-only Facebook Group where a coach answers form questions daily and pins a weekly challenge. Members post progress (earned content), retention rises, and the Group becomes the brand's most engaged channel.</div>`,
    `<span class="eyebrow">MSM201c · Chương 3 · Bài 3.1</span>
<h2>Trang &amp; quản trị cộng đồng</h2>
<h3>Ngôi nhà thương hiệu</h3>
<ul>
<li><strong>Facebook Page (Trang)</strong> — hồ sơ thương hiệu công khai: giới thiệu, nút CTA, đánh giá, cửa hàng, sự kiện. Bắt buộc để chạy quảng cáo Meta.</li>
<li><strong>Facebook Group (Nhóm)</strong> — không gian thành viên để thảo luận và gắn kết; tương tác cao, cộng đồng làm chủ.</li>
<li><strong>Tài khoản Instagram business/creator</strong> — mở khoá Insights, nút liên hệ, mua sắm và quảng bá quảng cáo.</li>
</ul>
<h3>Quản trị cộng đồng</h3>
<p><strong>Quản trị cộng đồng</strong> là việc hằng ngày trả lời, kiểm duyệt và nuôi dưỡng đối tượng: trả lời bình luận &amp; tin nhắn nhanh, chào và đặt luật trong Nhóm, xoá spam, và biến câu hỏi thành nội dung. Nó biến người theo dõi thành fan.</p>
<h3>Chiến thuật tăng tương tác</h3>
<p>Đặt câu hỏi, chạy poll trong Stories, trả lời có giá trị (không chỉ emoji), tôn vinh nội dung do người dùng tạo, và giữ đều đặn. Tương tác nuôi thuật toán và xây niềm tin cùng lúc.</p>
<div class="callout"><span class="badge">Ví dụ thật</span> Một thương hiệu thể hình chạy Nhóm Facebook riêng cho thành viên, nơi huấn luyện viên trả lời câu hỏi tư thế mỗi ngày và ghim thử thách hàng tuần. Thành viên đăng tiến độ (nội dung lan truyền), tỷ lệ giữ chân tăng, và Nhóm thành kênh tương tác cao nhất của thương hiệu.</div>`,
  ]]);

const c3q = quiz('msm201c-quiz-3', 'Quiz 3 — Pages & community|||Quiz 3 — Trang & cộng đồng', [
  { id: 'q1', question: 'Điều kiện bắt buộc để chạy quảng cáo Meta là gì?|||What is required to run Meta ads?', options: ['Một Facebook Page|||A Facebook Page', 'Một website riêng|||A separate website', '10.000 người theo dõi|||10,000 followers', 'Tài khoản Threads|||A Threads account'], correctIndex: 0, explanation: 'Phải có một Facebook Page mới chạy được quảng cáo Meta.' },
  { id: 'q2', question: 'Loại tài khoản Instagram nào mở khoá Insights và quảng bá quảng cáo?|||Which Instagram account type unlocks Insights and ad promotion?', options: ['Tài khoản cá nhân|||Personal account', 'Tài khoản business/creator|||Business/creator account', 'Tài khoản riêng tư|||Private account', 'Tài khoản khách|||Guest account'], correctIndex: 1, explanation: 'Chuyển sang business/creator mới có Insights, nút liên hệ, shopping và quảng cáo.' },
  { id: 'q3', question: 'Quản trị cộng đồng chủ yếu làm gì?|||What does community management mainly involve?', options: ['Mua quảng cáo|||Buying ads', 'Trả lời, kiểm duyệt & nuôi dưỡng đối tượng|||Replying, moderating & nurturing the audience', 'Thiết kế logo|||Designing logos', 'Viết mã website|||Coding a website'], correctIndex: 1, explanation: 'Đó là việc hằng ngày trả lời, kiểm duyệt, nuôi cộng đồng để biến follower thành fan.' },
]);

const c4 = doc('msm201c-4-1-business-suite', '4.1 — Meta Business Suite & management|||4.1 — Meta Business Suite & quản lý',
  'Business Manager/Suite; tài sản (Page, ad account, Pixel, catalog); phân quyền người & đối tác; lịch đăng; Insights.',
  [[
    `<span class="eyebrow">MSM201c · Chapter 4 · Lesson 4.1</span>
<h2>Meta Business Suite &amp; management</h2>
<h3>Business Manager vs Business Suite</h3>
<p><strong>Business Manager</strong> is the ownership &amp; permissions layer — it holds your <strong>business assets</strong> (Pages, ad accounts, Pixels, product catalogs) and controls who can access them. <strong>Business Suite</strong> is the day-to-day console for posting, inbox, insights and boosting.</p>
<h3>Assets &amp; permissions</h3>
<ul>
<li>Add assets (Page, Instagram, ad account, Pixel) under one business.</li>
<li>Assign <strong>people</strong> roles (admin, employee) and give <strong>task-level</strong> access per asset — least privilege.</li>
<li>Invite <strong>partners/agencies</strong> by Business ID without sharing personal logins.</li>
</ul>
<h3>Scheduling &amp; insights</h3>
<p>Use the <strong>Planner</strong> to schedule Reels, posts and Stories across Facebook &amp; Instagram at once, and read <strong>Insights</strong> — reach, engagement, follows, best times — to decide what to make next.</p>
<div class="callout"><span class="badge">Real example</span> An agency manages five client brands from one Business Manager: each client is a partner, staff get employee access only to the assets they work on, and one editor schedules a week of content for all brands in the Planner every Monday.</div>`,
    `<span class="eyebrow">MSM201c · Chương 4 · Bài 4.1</span>
<h2>Meta Business Suite &amp; quản lý</h2>
<h3>Business Manager vs Business Suite</h3>
<p><strong>Business Manager</strong> là lớp sở hữu &amp; phân quyền — nó giữ <strong>tài sản doanh nghiệp</strong> (Trang, tài khoản quảng cáo, Pixel, catalog sản phẩm) và kiểm soát ai được truy cập. <strong>Business Suite</strong> là bảng điều khiển hằng ngày để đăng bài, hộp thư, insights và boost.</p>
<h3>Tài sản &amp; phân quyền</h3>
<ul>
<li>Thêm tài sản (Trang, Instagram, tài khoản quảng cáo, Pixel) dưới một doanh nghiệp.</li>
<li>Gán <strong>người dùng</strong> vai trò (admin, nhân viên) và cấp quyền theo <strong>tác vụ</strong> cho từng tài sản — nguyên tắc tối thiểu.</li>
<li>Mời <strong>đối tác/agency</strong> bằng Business ID mà không chia sẻ tài khoản cá nhân.</li>
</ul>
<h3>Lịch đăng &amp; insights</h3>
<p>Dùng <strong>Planner (Trình lập lịch)</strong> để hẹn giờ Reels, bài và Stories trên cả Facebook &amp; Instagram cùng lúc, và đọc <strong>Insights</strong> — tiếp cận, tương tác, lượt theo dõi, khung giờ tốt — để quyết định làm gì tiếp theo.</p>
<div class="callout"><span class="badge">Ví dụ thật</span> Một agency quản năm thương hiệu khách từ một Business Manager: mỗi khách là một đối tác, nhân viên chỉ được quyền nhân viên trên đúng tài sản họ làm, và một biên tập viên lên lịch cả tuần nội dung cho mọi thương hiệu trong Planner mỗi thứ Hai.</div>`,
  ]]);

const c4q = quiz('msm201c-quiz-4', 'Quiz 4 — Business Suite|||Quiz 4 — Business Suite', [
  { id: 'q1', question: 'Lớp nào giữ tài sản doanh nghiệp và kiểm soát quyền truy cập?|||Which layer holds business assets and controls access?', options: ['Business Manager', 'Ads Library', 'Reels', 'Marketplace'], correctIndex: 0, explanation: 'Business Manager là lớp sở hữu & phân quyền cho mọi tài sản.' },
  { id: 'q2', question: 'Nguyên tắc phân quyền đúng khi giao việc là gì?|||What is the right principle when assigning access?', options: ['Cấp admin cho mọi người|||Give everyone admin', 'Chia sẻ mật khẩu cá nhân|||Share personal passwords', 'Quyền tối thiểu theo tác vụ/tài sản|||Least privilege by task/asset', 'Không cấp quyền cho ai|||Grant no one access'], correctIndex: 2, explanation: 'Cấp quyền tối thiểu theo tác vụ và tài sản; mời đối tác bằng Business ID.' },
  { id: 'q3', question: 'Công cụ nào để hẹn giờ đăng Reels/bài trên cả Facebook & Instagram?|||Which tool schedules Reels/posts across Facebook & Instagram?', options: ['Planner trong Business Suite|||The Planner in Business Suite', 'Ads Manager billing', 'Pixel Helper', 'Threads'], correctIndex: 0, explanation: 'Planner của Business Suite lên lịch nội dung đa nền tảng cùng lúc.' },
]);

const c5 = doc('msm201c-5-1-ads-structure', '5.1 — Meta ads: structure|||5.1 — Quảng cáo Meta: cấu trúc',
  'Ads Manager; ba tầng campaign → ad set → ad; mục tiêu (objective); ngân sách; đấu giá (auction) & giá trị tổng.',
  [[
    `<span class="eyebrow">MSM201c · Chapter 5 · Lesson 5.1</span>
<h2>Meta ads: campaign structure</h2>
<h3>Three levels in Ads Manager</h3>
<pre><code>Campaign  -> WHAT you want (the objective) &amp; budget strategy
  Ad set  -> WHO (audience), WHERE (placements), WHEN, how much (budget/schedule)
    Ad    -> the creative people actually see (image/video, copy, CTA)
</code></pre>
<h3>Objectives</h3>
<p>You pick a <strong>campaign objective</strong> and Meta optimizes delivery toward it: <strong>Awareness</strong>, <strong>Traffic</strong>, <strong>Engagement</strong>, <strong>Leads</strong>, <strong>App promotion</strong>, <strong>Sales</strong>. The objective decides who Meta shows the ad to — choose the one that matches your real goal, not just cheap clicks.</p>
<h3>The auction</h3>
<p>Meta ads are sold by <strong>auction</strong>. The winner isn't the highest bid but the highest <strong>total value</strong> = bid × estimated action rate + ad quality/relevance. Good, relevant creative literally lowers your cost — quality is a bidding advantage, not just polish.</p>
<div class="callout"><span class="badge">Real example</span> An online store runs a <strong>Sales</strong> campaign, one ad set targeting past visitors, another targeting a lookalike, and three ad creatives in each. Meta's auction &amp; delivery spend more on the ad set and creative producing the cheapest purchases.</div>`,
    `<span class="eyebrow">MSM201c · Chương 5 · Bài 5.1</span>
<h2>Quảng cáo Meta: cấu trúc chiến dịch</h2>
<h3>Ba tầng trong Ads Manager</h3>
<pre><code>Campaign (Chiến dịch) -> BẠN MUỐN GÌ (mục tiêu) &amp; chiến lược ngân sách
  Ad set (Nhóm QC)    -> AI (đối tượng), Ở ĐÂU (vị trí), KHI NÀO, bao nhiêu (ngân sách/lịch)
    Ad (Quảng cáo)    -> sáng tạo người dùng thật sự thấy (ảnh/video, nội dung, CTA)
</code></pre>
<h3>Mục tiêu (objective)</h3>
<p>Bạn chọn một <strong>mục tiêu chiến dịch</strong> và Meta tối ưu phân phối theo đó: <strong>Nhận biết</strong>, <strong>Lưu lượng</strong>, <strong>Tương tác</strong>, <strong>Khách tiềm năng</strong>, <strong>Quảng bá ứng dụng</strong>, <strong>Doanh số</strong>. Mục tiêu quyết định Meta hiển thị quảng cáo cho ai — chọn đúng mục tiêu thật, đừng chọn click rẻ.</p>
<h3>Đấu giá (auction)</h3>
<p>Quảng cáo Meta bán qua <strong>đấu giá</strong>. Người thắng không phải giá thầu cao nhất mà là <strong>tổng giá trị</strong> cao nhất = giá thầu × tỷ lệ hành động ước tính + chất lượng/liên quan. Sáng tạo tốt, liên quan làm giảm chi phí thật — chất lượng là lợi thế đấu giá, không chỉ để đẹp.</p>
<div class="callout"><span class="badge">Ví dụ thật</span> Một cửa hàng online chạy chiến dịch <strong>Doanh số</strong>, một ad set nhắm khách từng ghé, một ad set nhắm lookalike, mỗi cái ba mẫu quảng cáo. Đấu giá &amp; phân phối của Meta chi nhiều hơn cho ad set và mẫu tạo ra đơn hàng rẻ nhất.</div>`,
  ]]);

const c5q = quiz('msm201c-quiz-5', 'Quiz 5 — Ads structure|||Quiz 5 — Cấu trúc quảng cáo', [
  { id: 'q1', question: 'Thứ tự đúng ba tầng trong Ads Manager?|||Correct order of the three Ads Manager levels?', options: ['Ad → Ad set → Campaign', 'Campaign → Ad set → Ad', 'Ad set → Campaign → Ad', 'Campaign → Ad → Ad set'], correctIndex: 1, explanation: 'Campaign (mục tiêu) → Ad set (đối tượng/vị trí/ngân sách) → Ad (sáng tạo).' },
  { id: 'q2', question: 'Cấp nào đặt đối tượng, vị trí và ngân sách/lịch?|||Which level sets audience, placements and budget/schedule?', options: ['Campaign', 'Ad set', 'Ad', 'Pixel'], correctIndex: 1, explanation: 'Ad set quyết định AI, Ở ĐÂU, KHI NÀO và bao nhiêu.' },
  { id: 'q3', question: 'Trong đấu giá Meta, ai thắng?|||In the Meta auction, who wins?', options: ['Giá thầu cao nhất|||The highest bid', 'Tổng giá trị cao nhất (thầu × tỷ lệ hành động + chất lượng)|||Highest total value (bid × action rate + quality)', 'Ngân sách lớn nhất|||The biggest budget', 'Quảng cáo nhiều chữ nhất|||The wordiest ad'], correctIndex: 1, explanation: 'Người thắng là tổng giá trị cao nhất; sáng tạo liên quan làm giảm chi phí.' },
]);

const c6 = doc('msm201c-6-1-targeting-pixel', '6.1 — Targeting & the Meta Pixel|||6.1 — Nhắm mục tiêu & Meta Pixel',
  'Đối tượng core/custom/lookalike; Meta Pixel & Conversions API; sự kiện; retargeting; Advantage+ audience.',
  [[
    `<span class="eyebrow">MSM201c · Chapter 6 · Lesson 6.1</span>
<h2>Targeting &amp; the Meta Pixel</h2>
<h3>Three kinds of audience</h3>
<ul>
<li><strong>Core audience</strong> — you define it by location, age, interests, behaviors (cold, new people).</li>
<li><strong>Custom audience</strong> — people who already know you: website visitors, customer list, video viewers, IG/Page engagers (warm).</li>
<li><strong>Lookalike audience</strong> — Meta finds new people who resemble a source custom audience (e.g. 1% lookalike of your buyers).</li>
</ul>
<h3>Pixel &amp; Conversions API</h3>
<p>The <strong>Meta Pixel</strong> is a snippet on your website that reports actions (ViewContent, AddToCart, Purchase) back to Meta. Because browsers block cookies, pair it with the server-side <strong>Conversions API (CAPI)</strong> so events are measured reliably. These events power optimization, custom audiences and reporting.</p>
<h3>Retargeting</h3>
<p><strong>Retargeting</strong> shows ads to warm custom audiences — e.g. people who added to cart but didn't buy — usually the cheapest, highest-ROAS spend you can run.</p>
<div class="callout"><span class="badge">Real example</span> A shop installs the Pixel + CAPI, builds a custom audience of 30-day cart abandoners, retargets them with the exact product and free shipping, and a 1% lookalike of purchasers to find new buyers. Warm retargeting returns the best ROAS.</div>`,
    `<span class="eyebrow">MSM201c · Chương 6 · Bài 6.1</span>
<h2>Nhắm mục tiêu &amp; Meta Pixel</h2>
<h3>Ba loại đối tượng</h3>
<ul>
<li><strong>Đối tượng core</strong> — bạn tự khai theo vị trí, tuổi, sở thích, hành vi (người mới, "lạnh").</li>
<li><strong>Đối tượng custom</strong> — người đã biết bạn: khách ghé web, danh sách khách, người xem video, người tương tác IG/Trang ("ấm").</li>
<li><strong>Đối tượng lookalike</strong> — Meta tìm người mới giống một nguồn custom (vd lookalike 1% từ người đã mua).</li>
</ul>
<h3>Pixel &amp; Conversions API</h3>
<p><strong>Meta Pixel</strong> là đoạn mã trên website báo hành động (ViewContent, AddToCart, Purchase) về Meta. Vì trình duyệt chặn cookie, hãy ghép với <strong>Conversions API (CAPI)</strong> phía máy chủ để đo sự kiện đáng tin. Các sự kiện này nuôi tối ưu, đối tượng custom và báo cáo.</p>
<h3>Retargeting (tiếp thị lại)</h3>
<p><strong>Retargeting</strong> hiển thị quảng cáo cho đối tượng custom "ấm" — vd người đã thêm giỏ nhưng chưa mua — thường là khoản chi rẻ nhất, ROAS cao nhất bạn có thể chạy.</p>
<div class="callout"><span class="badge">Ví dụ thật</span> Một shop cài Pixel + CAPI, dựng đối tượng custom gồm người bỏ giỏ trong 30 ngày, retarget đúng sản phẩm đó kèm freeship, và một lookalike 1% từ người đã mua để tìm khách mới. Retargeting "ấm" trả ROAS tốt nhất.</div>`,
  ]]);

const c6q = quiz('msm201c-quiz-6', 'Quiz 6 — Targeting & Pixel|||Quiz 6 — Nhắm mục tiêu & Pixel', [
  { id: 'q1', question: 'Đối tượng nào gồm người đã biết bạn (khách web, danh sách khách)?|||Which audience is people who already know you (site visitors, customer list)?', options: ['Core audience', 'Custom audience', 'Lookalike audience', 'Broad audience'], correctIndex: 1, explanation: 'Custom audience là đối tượng "ấm" từ dữ liệu bạn đã có.' },
  { id: 'q2', question: 'Vì sao ghép Meta Pixel với Conversions API (CAPI)?|||Why pair the Meta Pixel with the Conversions API (CAPI)?', options: ['Để đăng bài nhanh hơn|||To post faster', 'Đo sự kiện đáng tin khi trình duyệt chặn cookie|||Reliable events when browsers block cookies', 'Để tạo Reels|||To make Reels', 'Để giảm ngân sách|||To lower budget automatically'], correctIndex: 1, explanation: 'CAPI phía máy chủ bổ sung khi trình duyệt chặn cookie, giúp đo đáng tin.' },
  { id: 'q3', question: 'Lookalike audience là gì?|||What is a lookalike audience?', options: ['Người bỏ giỏ hàng|||Cart abandoners', 'Người mới Meta tìm vì giống nguồn custom|||New people Meta finds resembling a source audience', 'Người theo dõi hiện tại|||Current followers', 'Nhân viên của bạn|||Your staff'], correctIndex: 1, explanation: 'Lookalike mở rộng tới người mới giống một đối tượng custom nguồn.' },
]);

const c7 = doc('msm201c-7-1-creative-optimization', '7.1 — Ad creative & optimization|||7.1 — Sáng tạo & tối ưu quảng cáo',
  'Creative (hook/hình/video), copy & CTA; A/B testing; ngân sách CBO/ABO; tối ưu chuyển đổi & giai đoạn học.',
  [[
    `<span class="eyebrow">MSM201c · Chapter 7 · Lesson 7.1</span>
<h2>Ad creative &amp; optimization</h2>
<h3>Creative that converts</h3>
<p>Creative is now the biggest lever. Strong ads <strong>hook in 3 seconds</strong>, are made mobile-first and vertical, show the product/benefit fast, and end with a clear <strong>CTA</strong>. Copy leads with the benefit and speaks to one audience, not everyone.</p>
<h3>A/B testing</h3>
<p>Use Ads Manager <strong>A/B tests</strong> (experiments) to change <em>one</em> variable at a time — creative, audience, or placement — and let Meta declare a statistically confident winner. Test to learn, then scale the winner.</p>
<h3>Budget &amp; delivery</h3>
<ul>
<li><strong>ABO</strong> — budget set at the ad-set level (control per audience).</li>
<li><strong>CBO / Advantage campaign budget</strong> — one budget at campaign level, Meta shifts it to the best ad set.</li>
<li>Give delivery a stable <strong>learning phase</strong> (~50 optimization events/week); don't edit constantly or you reset it.</li>
</ul>
<div class="callout"><span class="badge">Real example</span> A DTC brand A/B tests three Reels hooks against the same audience. The winner cuts cost-per-purchase 28%; they move budget to CBO, keep the winning hook, and refresh creative weekly to fight fatigue.</div>`,
    `<span class="eyebrow">MSM201c · Chương 7 · Bài 7.1</span>
<h2>Sáng tạo &amp; tối ưu quảng cáo</h2>
<h3>Sáng tạo tạo chuyển đổi</h3>
<p>Sáng tạo giờ là đòn bẩy lớn nhất. Quảng cáo mạnh <strong>hút trong 3 giây</strong>, làm ưu tiên di động và dọc, khoe sản phẩm/lợi ích nhanh, và kết bằng <strong>CTA</strong> rõ ràng. Nội dung mở đầu bằng lợi ích và nói với một đối tượng, không phải tất cả.</p>
<h3>A/B testing</h3>
<p>Dùng <strong>A/B test</strong> (thử nghiệm) trong Ads Manager để đổi <em>một</em> biến mỗi lần — sáng tạo, đối tượng, hoặc vị trí — và để Meta tuyên bố người thắng có độ tin cậy thống kê. Test để học, rồi mở rộng cái thắng.</p>
<h3>Ngân sách &amp; phân phối</h3>
<ul>
<li><strong>ABO</strong> — ngân sách đặt ở cấp ad set (kiểm soát theo từng đối tượng).</li>
<li><strong>CBO / Advantage campaign budget</strong> — một ngân sách ở cấp chiến dịch, Meta dồn cho ad set tốt nhất.</li>
<li>Cho phân phối một <strong>giai đoạn học</strong> ổn định (~50 sự kiện tối ưu/tuần); đừng sửa liên tục kẻo reset nó.</li>
</ul>
<div class="callout"><span class="badge">Ví dụ thật</span> Một thương hiệu DTC A/B test ba hook Reels trên cùng đối tượng. Cái thắng hạ chi phí mỗi đơn 28%; họ chuyển ngân sách sang CBO, giữ hook thắng, và làm mới sáng tạo hằng tuần để chống "mỏi" quảng cáo.</div>`,
  ]]);

const c7q = quiz('msm201c-quiz-7', 'Quiz 7 — Creative & optimization|||Quiz 7 — Sáng tạo & tối ưu', [
  { id: 'q1', question: 'Nguyên tắc cốt lõi khi A/B test quảng cáo là gì?|||What is the core rule of A/B testing ads?', options: ['Đổi mọi thứ cùng lúc|||Change everything at once', 'Đổi một biến mỗi lần|||Change one variable at a time', 'Không bao giờ đo|||Never measure', 'Chỉ đổi ngân sách|||Only change budget'], correctIndex: 1, explanation: 'Đổi một biến mỗi lần mới cô lập được nguyên nhân và tìm người thắng đáng tin.' },
  { id: 'q2', question: 'CBO (Advantage campaign budget) khác ABO ở điểm nào?|||How does CBO differ from ABO?', options: ['Ngân sách ở cấp chiến dịch, Meta dồn cho ad set tốt nhất|||Budget at campaign level, Meta shifts it to the best ad set', 'Tắt hết quảng cáo|||Turns off all ads', 'Chỉ dùng cho Reels|||Only for Reels', 'Không cần Pixel|||Removes the Pixel'], correctIndex: 0, explanation: 'CBO đặt một ngân sách cấp chiến dịch và để Meta tự phân bổ; ABO đặt theo ad set.' },
  { id: 'q3', question: 'Vì sao không nên sửa quảng cáo liên tục?|||Why avoid constantly editing an ad?', options: ['Vì tốn tiền quảng cáo|||It costs ad money', 'Vì reset giai đoạn học của phân phối|||It resets the delivery learning phase', 'Vì đổi mục tiêu|||It changes the objective', 'Vì xoá Pixel|||It deletes the Pixel'], correctIndex: 1, explanation: 'Chỉnh sửa lớn đưa ad set về lại giai đoạn học, làm phân phối kém ổn định.' },
]);

const c8 = doc('msm201c-8-1-measurement', '8.1 — Measurement, reporting & ethics|||8.1 — Đo lường, báo cáo & đạo đức',
  'Metrics reach/CPM/CTR/CPA/ROAS; attribution; Ads reporting; báo cáo cho sếp; đạo đức & quyền riêng tư.',
  [[
    `<span class="eyebrow">MSM201c · Chapter 8 · Lesson 8.1</span>
<h2>Measurement, reporting &amp; ethics</h2>
<h3>The metrics that matter</h3>
<ul>
<li><strong>Reach</strong> — unique people who saw it; <strong>Impressions</strong> — total views.</li>
<li><strong>CPM</strong> — cost per 1,000 impressions (how expensive attention is).</li>
<li><strong>CTR</strong> — clicks ÷ impressions (how compelling the creative is).</li>
<li><strong>CPA / cost per result</strong> — spend ÷ conversions (efficiency of the goal).</li>
<li><strong>ROAS</strong> — revenue ÷ ad spend (the money verdict; 4.0 = 4đ back per 1đ spent).</li>
</ul>
<h3>Attribution &amp; reporting</h3>
<p><strong>Attribution</strong> credits which ad/click drove a conversion within a window (e.g. 7-day click, 1-day view). Build a saved view in <strong>Ads reporting</strong> with your key metrics and read the funnel: reach → CTR → CPA → ROAS to find where money leaks.</p>
<h3>Ethics &amp; privacy</h3>
<p>Follow Meta's <strong>advertising policies</strong>, don't mislead, respect consent and data-privacy law (GDPR, and consent tools for the Pixel/CAPI). Ethical, transparent marketing is both required and better for long-term trust.</p>
<div class="callout"><span class="badge">Real example</span> A weekly report shows CPM up but CTR down and ROAS at 2.1 — the team diagnoses creative fatigue (not audience), refreshes the ads, CTR recovers and ROAS climbs to 3.4. Metrics pointed to the real cause.</div>`,
    `<span class="eyebrow">MSM201c · Chương 8 · Bài 8.1</span>
<h2>Đo lường, báo cáo &amp; đạo đức</h2>
<h3>Những chỉ số quan trọng</h3>
<ul>
<li><strong>Reach (tiếp cận)</strong> — số người khác nhau thấy; <strong>Impressions</strong> — tổng lượt hiển thị.</li>
<li><strong>CPM</strong> — chi phí mỗi 1.000 hiển thị (sự chú ý đắt cỡ nào).</li>
<li><strong>CTR</strong> — click ÷ hiển thị (sáng tạo hấp dẫn cỡ nào).</li>
<li><strong>CPA / chi phí mỗi kết quả</strong> — chi ÷ chuyển đổi (hiệu quả của mục tiêu).</li>
<li><strong>ROAS</strong> — doanh thu ÷ chi quảng cáo (phán quyết tiền bạc; 4.0 = thu 4đ mỗi 1đ chi).</li>
</ul>
<h3>Attribution &amp; báo cáo</h3>
<p><strong>Attribution (ghi nhận)</strong> quy công cho quảng cáo/click nào tạo ra chuyển đổi trong một cửa sổ (vd 7 ngày click, 1 ngày xem). Dựng một chế độ xem đã lưu trong <strong>Ads reporting</strong> với các chỉ số then chốt và đọc phễu: reach → CTR → CPA → ROAS để tìm chỗ rò tiền.</p>
<h3>Đạo đức &amp; quyền riêng tư</h3>
<p>Tuân thủ <strong>chính sách quảng cáo</strong> của Meta, không gây hiểu lầm, tôn trọng sự đồng ý và luật riêng tư dữ liệu (GDPR, công cụ consent cho Pixel/CAPI). Marketing có đạo đức, minh bạch vừa bắt buộc vừa tốt cho niềm tin dài hạn.</p>
<div class="callout"><span class="badge">Ví dụ thật</span> Một báo cáo tuần cho thấy CPM tăng nhưng CTR giảm và ROAS còn 2.1 — nhóm chẩn đoán "mỏi" sáng tạo (không phải đối tượng), làm mới quảng cáo, CTR hồi phục và ROAS leo lên 3.4. Chỉ số chỉ ra đúng nguyên nhân.</div>`,
  ]]);

const c8q = quiz('msm201c-quiz-8', 'Quiz 8 — Measurement|||Quiz 8 — Đo lường', [
  { id: 'q1', question: 'Chỉ số nào cho biết mỗi 1đ chi quảng cáo thu về bao nhiêu doanh thu?|||Which metric shows revenue returned per 1 unit of ad spend?', options: ['CPM', 'CTR', 'ROAS', 'Reach'], correctIndex: 2, explanation: 'ROAS = doanh thu ÷ chi quảng cáo; ROAS 4.0 nghĩa là thu 4đ mỗi 1đ chi.' },
  { id: 'q2', question: 'CTR đo điều gì?|||What does CTR measure?', options: ['Chi phí mỗi 1.000 hiển thị|||Cost per 1,000 impressions', 'Click ÷ hiển thị (độ hấp dẫn của sáng tạo)|||Clicks ÷ impressions (creative appeal)', 'Số người khác nhau thấy|||Unique people reached', 'Doanh thu ÷ chi|||Revenue ÷ spend'], correctIndex: 1, explanation: 'CTR = click chia hiển thị, phản ánh sáng tạo hấp dẫn cỡ nào.' },
  { id: 'q3', question: 'Điều nào KHÔNG được phép trong marketing Meta?|||Which is NOT acceptable in Meta marketing?', options: ['Tuân thủ chính sách quảng cáo|||Following advertising policies', 'Gây hiểu lầm & phớt lờ đồng ý dữ liệu|||Misleading & ignoring data consent', 'Dùng công cụ consent cho Pixel/CAPI|||Using consent tools for Pixel/CAPI', 'Tôn trọng GDPR|||Respecting GDPR'], correctIndex: 1, explanation: 'Gây hiểu lầm và phớt lờ quyền riêng tư/đồng ý vi phạm cả chính sách lẫn luật.' },
]);

export default {
  semester: { code: 'FPTU_Hola6', name: 'Kỳ 6 — Thực tập', ordinal: 8 },
  course: {
    courseCode: 'MSM201c',
    slug: 'msm201c-meta-social-media-marketing-management',
    title: 'Meta Social Media Marketing Management',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/MSM201c.webp',
    shortDescription: 'Social media marketing on Meta — the FB/IG/Messenger/WhatsApp/Threads ecosystem, content strategy, Pages & community, Business Suite, Meta ads (Ads Manager, targeting, Pixel/CAPI) & measurement (CTR/CPA/ROAS). Bilingual, Meta Blueprint aligned.|||Marketing mạng xã hội trên Meta — hệ sinh thái FB/IG/Messenger/WhatsApp/Threads, chiến lược nội dung, Trang & cộng đồng, Business Suite, quảng cáo Meta (Ads Manager, nhắm mục tiêu, Pixel/CAPI) & đo lường. Song ngữ, bám Meta Blueprint.',
    description: 'Môn <strong>MSM201c — Meta Social Media Marketing Management</strong> (khối Công nghệ Truyền thông, kỳ 6) dạy <strong>lập kế hoạch, triển khai và đo lường marketing trên các nền tảng Meta</strong>. Từ <strong>hệ sinh thái Meta</strong> (Facebook, Instagram, Messenger, WhatsApp, Threads) → <strong>chiến lược nội dung</strong> (reels/story/feed/live, thuật toán) → <strong>Trang &amp; cộng đồng</strong> → <strong>Meta Business Suite</strong> → <strong>quảng cáo Meta</strong> (Ads Manager, cấu trúc &amp; đấu giá) → <strong>nhắm mục tiêu &amp; Pixel/CAPI</strong> → <strong>sáng tạo, A/B testing &amp; tối ưu</strong> → <strong>đo lường, báo cáo &amp; đạo đức</strong>. Song ngữ, bám Meta Blueprint &amp; Tuten/Solomon, có thao tác thật trên nền tảng, ví dụ chiến dịch và quiz mỗi chương.',
    whatYouLearn: 'Hệ sinh thái Meta (FB/IG/Messenger/WhatsApp/Threads); owned/earned/paid; content pillar & format (reels/story/feed/live); thuật toán organic; Facebook Page/Group, IG business, quản trị cộng đồng; Meta Business Suite (tài sản, phân quyền, Planner, Insights); Ads Manager (campaign/ad set/ad, mục tiêu, đấu giá); đối tượng core/custom/lookalike; Meta Pixel & Conversions API, retargeting; ad creative, copy, A/B testing, CBO/ABO, tối ưu chuyển đổi; metrics reach/CPM/CTR/CPA/ROAS, attribution, Ads reporting; đạo đức & quyền riêng tư.',
    requirements: 'Không cần kinh nghiệm quảng cáo trước. Nên có một tài khoản Facebook/Instagram để thực hành trên Business Suite &amp; Ads Manager. Xem điều kiện tiên quyết trong khung chương trình khối Công nghệ Truyền thông trên FLM.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, Meta Blueprint, tài liệu Meta, sách, academy, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Marketing Meta, owned/earned/paid, lộ trình.', lessons: [intro] },
    { title: 'Chương 1 — Hệ sinh thái Meta|||Chapter 1 — Meta ecosystem', description: 'Facebook, Instagram, Messenger, WhatsApp, Threads.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Chiến lược nội dung|||Chapter 2 — Content strategy', description: 'Content pillar, format, thuật toán organic.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Trang & cộng đồng|||Chapter 3 — Pages & community', description: 'FB Page/Group, IG business, community management.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Meta Business Suite|||Chapter 4 — Business Suite', description: 'Business Manager, tài sản, phân quyền, lịch, insights.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Quảng cáo Meta: cấu trúc|||Chapter 5 — Ads structure', description: 'Ads Manager, campaign/ad set/ad, mục tiêu, đấu giá.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Nhắm mục tiêu & Pixel|||Chapter 6 — Targeting & Pixel', description: 'Core/custom/lookalike, Pixel/CAPI, retargeting.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Sáng tạo & tối ưu|||Chapter 7 — Creative & optimization', description: 'Creative, copy, A/B testing, ngân sách, tối ưu.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Đo lường & báo cáo|||Chapter 8 — Measurement & reporting', description: 'Reach/CPM/CTR/CPA/ROAS, attribution, đạo đức.', lessons: [c8, c8q] },
  ],
};
