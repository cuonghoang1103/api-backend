/**
 * Content Creator — Chương 1: Nền tảng & khán giả. Song ngữ EN/VI (.ml-en / .ml-vi).
 * Bốn nền tảng · thuật toán đề xuất (theo lời chính nền tảng) · chọn ngách · chân dung khán giả · thương hiệu.
 * ⚠️ KHÔNG backtick trần trong content (dùng &#96;); `${` trong mã mẫu viết \${ ; gạch chéo ngược viết \\
 */
import { gallery, slide } from './_slides.mjs';

const SLIDES = [
  [1, 'Bìa'],
  [2, 'Bản đồ chương'],
  [3, 'Bốn nền tảng, bốn luật chơi'],
  [4, 'Định dạng & độ dài (tính đến 09/2026)'],
  [5, 'Người Việt đang ở đâu'],
  [6, 'YouTube đề xuất video dựa vào gì'],
  [7, 'TikTok "Dành cho bạn" dựa vào gì'],
  [8, 'Lời đồn và điều nền tảng thật sự nói'],
  [9, 'Chọn ngách: giao của ba vòng tròn'],
  [10, 'Viết cho MỘT người cụ thể'],
  [11, 'Trụ cột nội dung — 3 đến 4 cột'],
  [12, 'Nhận diện đồng nhất trên mọi nền tảng'],
  [13, 'Website là trung tâm — mọi kênh dẫn về'],
  [14, 'Thực hành chương 1'],
];

export default {
  title: 'Chapter 1 — Platforms & audience|||Chương 1 — Nền tảng & khán giả',
  description: 'Mỗi nền tảng chơi theo luật nào, hệ thống đề xuất thật sự đo gì (theo lời chính YouTube và TikTok), chọn một ngách đủ hẹp, viết cho một người cụ thể, và dựng thương hiệu cá nhân có website làm trung tâm.',
  lessons: [
    /* ─────────────────── 1.0 slide ─────────────────── */
    {
      title: '1.0 — Chapter 1 in 14 slides|||1.0 — Chương 1 trong 14 slide',
      slug: 'cr-01-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bốn nền tảng, thuật toán đề xuất, lời đồn và sự thật, chọn ngách, chân dung khán giả, thương hiệu và website làm trung tâm — trong 14 slide.',
      content: `
<div class="ml-en"><h2>📑 Chapter 1 in 14 slides</h2>
<p>Before you film anything, decide <em>where</em> it will live and <em>who</em> it is for. These slides compare the four platforms, show what their recommendation systems measure according to the platforms themselves, and end with the one diagram that ties everything together: your website at the centre.</p>
<p>The two slides to remember: <strong>slide 6</strong> (what YouTube's system actually uses) and <strong>slide 9</strong> (choosing a niche where three circles overlap).</p></div>
<div class="ml-vi"><h2>📑 Chương 1 trong 14 slide</h2>
<p>Trước khi quay bất cứ thứ gì, hãy quyết định nó sẽ sống <em>ở đâu</em> và dành cho <em>ai</em>. Các slide so sánh bốn nền tảng, cho thấy hệ thống đề xuất của chúng đo những gì theo lời chính các nền tảng, và kết thúc bằng một sơ đồ gắn mọi thứ lại: website của bạn ở trung tâm.</p>
<p>Hai slide cần nhớ: <strong>slide 6</strong> (YouTube thật sự dựa vào gì) và <strong>slide 9</strong> (chọn ngách ở chỗ ba vòng tròn giao nhau).</p></div>
${gallery('cr-01', SLIDES)}
`,
    },

    /* ─────────────────── 1.1 bốn nền tảng ─────────────────── */
    {
      title: '1.1 — Four platforms, four sets of rules|||1.1 — Bốn nền tảng, bốn luật chơi',
      slug: 'cr-01-1-bon-nen-tang',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'YouTube, TikTok, Facebook và Instagram khác nhau thế nào về người xem, định dạng, độ dài; người Việt đang ở đâu; và giao cho mỗi nền tảng đúng một việc.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>The same video behaves differently on each platform — so give each platform one job</h2>
<p class="lead">A tutorial that gets steady views on YouTube for two years can vanish on TikTok in a day, and a 20-second clip that explodes on TikTok means little on YouTube search. That is not luck; each platform is built for a different kind of viewing. This lesson maps the four platforms you plan to use, with numbers for Vietnam, and ends with a job for each one.</p>

<h3>The four platforms at a glance</h3>
${slide('cr-01', 3, 'Bốn nền tảng, bốn luật chơi')}
<div class="kv-grid">
  <div class="kv"><span class="k">YouTube</span><span class="v">Two doors in: <strong>search</strong> (people type a problem) and <strong>recommendations</strong> (home page, "up next"). Long videos keep getting found for years; Shorts bring in strangers. <small>Best home for your coding tutorials.</small></span></div>
  <div class="kv"><span class="k">TikTok</span><span class="v">The <strong>For You</strong> feed shows videos to people who do not follow you, based on their interests. Very fast feedback: within hours you know whether a hook works. <small>Best for discovery and testing ideas.</small></span></div>
  <div class="kv"><span class="k">Facebook</span><span class="v">Still the largest platform in Vietnam. Pages, <strong>Groups</strong> (IT student groups, FPTU groups) and Reels. Since June 2025 every video uploaded is shared as a Reel. <small>Best for community and reaching people who already know you.</small></span></div>
  <div class="kv"><span class="k">Instagram</span><span class="v">Reels plus a visual profile that works like a portfolio. Much smaller in Vietnam, much larger internationally. <small>Best for your English-language content.</small></span></div>
</div>

<h3>Formats and lengths (as of 09/2026)</h3>
${slide('cr-01', 4, 'Định dạng & độ dài')}
<table>
  <tr><th>Platform</th><th>Aspect ratio</th><th>Length</th><th>Source &amp; note</th></tr>
  <tr><td>YouTube video</td><td>16:9</td><td>Up to 15 minutes by default; verified accounts up to 12 hours or 256 GB</td><td>YouTube Help</td></tr>
  <tr><td>YouTube Shorts</td><td>9:16 or square</td><td>Up to 3 minutes</td><td>Since 15 October 2024 (YouTube Blog)</td></tr>
  <tr><td>TikTok</td><td>9:16</td><td>Uploads up to 10 minutes are widely available</td><td>TikTok tested 60-minute uploads with a limited group in May 2024 (TechCrunch)</td></tr>
  <tr><td>Facebook Reels</td><td>9:16</td><td>No length or format restrictions</td><td>All videos shared as Reels from June 2025 (Meta Newsroom)</td></tr>
  <tr><td>Instagram Reels</td><td>9:16</td><td>Up to 3 minutes</td><td>Announced January 2025 by Adam Mosseri, head of Instagram</td></tr>
</table>
<p class="note-ct"><strong>These numbers move.</strong> Limits and features change every year. Treat the table as the state in September 2026 and check the platform's own help page before planning a series around a limit.</p>
<p>Two practical consequences: <strong>vertical 9:16 is the language of three of the four platforms</strong>, so learn to shoot vertically (Chapter 17), and <strong>verify your YouTube account early</strong> — a coding tutorial longer than 15 minutes cannot be uploaded without it.</p>

<h3>Where Vietnamese viewers are</h3>
${slide('cr-01', 5, 'Người Việt đang ở đâu')}
<p>DataReportal's <em>Digital 2026: Vietnam</em> (data from October 2025) gives the advertising reach of each platform: Facebook 79.0 million, TikTok 76.1 million (aged 18+), YouTube 62.1 million, Instagram 11.7 million. As Section 0 explained, these count accounts, not unique people — use them to compare, not as head-counts. The message is clear anyway: your Vietnamese audience is overwhelmingly on Facebook, TikTok and YouTube; Instagram matters mainly for the English side.</p>

<h3>One job for each platform</h3>
<p>Trying to "be big everywhere" at once is the fastest way to burn out. Give each platform a single job in one system:</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Discovery</span><span class="lz-t">TikTok · Reels · Shorts</span><span class="lz-d">Short videos that let strangers find you. One idea each, strong hook.</span></div>
<div class="lz-layer"><span class="lz-k">Trust</span><span class="lz-t">YouTube long videos</span><span class="lz-d">Tutorials and stories where people see you solve real problems. This is where viewers decide to follow you.</span></div>
<div class="lz-layer"><span class="lz-k">Community</span><span class="lz-t">Facebook page &amp; groups</span><span class="lz-d">Conversations, questions, announcements to people who already know you.</span></div>
<div class="lz-layer"><span class="lz-k">Home</span><span class="lz-t">cuongthai.com</span><span class="lz-d">The only place you own. Courses, articles, Pro. Every other platform points here (Lesson 1.4).</span></div>
</div>

<div class="pitfall co-tieu-de"><p><strong>Trap — the same file everywhere.</strong> Posting a 16:9 YouTube video unchanged into a 9:16 feed gives a tiny strip in the middle of a phone screen, and re-uploading a TikTok with its watermark to other platforms looks careless. Adapt the format for each destination — Chapter 17 and Chapter 21 show how.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Trap — starting on four platforms at once.</strong> Four accounts to feed means four half-finished efforts. Start with two: YouTube (long videos and Shorts) plus either TikTok or Facebook. Add the others when publishing feels routine.</p></div>

<h3>🎬 Practice (20 minutes)</h3>
<div class="callout ok"><ol>
<li>Open YouTube, TikTok, Facebook and Instagram. For each, write down whether you have an account and what name it uses.</li>
<li>On YouTube, check whether your account is <strong>verified</strong> (needed for uploads over 15 minutes) and verify it if not.</li>
<li>Pick your <strong>two starting platforms</strong> and write one sentence for each: what job it does for you.</li>
<li>Search your topic in Vietnamese on YouTube and on TikTok. Note which one shows more useful results for "how to" questions.</li>
</ol><p><strong>Done when:</strong> a list of your four accounts, a verified YouTube account, two chosen starting platforms with one-sentence jobs, and one written observation from the search comparison.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Long-form / short-form</span><span class="v">Longer horizontal videos (mostly YouTube) / short vertical videos.</span></div>
  <div class="kv"><span class="k">For You feed</span><span class="v">TikTok's main feed of recommended videos, mostly from accounts you do not follow.</span></div>
  <div class="kv"><span class="k">Reels</span><span class="v">Short vertical videos on Instagram and Facebook.</span></div>
  <div class="kv"><span class="k">Aspect ratio</span><span class="v">Width to height of the frame: 16:9 horizontal, 9:16 vertical.</span></div>
  <div class="kv"><span class="k">Verified account</span><span class="v">A YouTube account confirmed by phone, unlocking uploads longer than 15 minutes.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>YouTube = search + recommendations and years of views; TikTok = discovery; Facebook = the biggest Vietnamese audience and community; Instagram = visual portfolio, strong internationally.</li>
  <li>Three of the four speak 9:16; YouTube long videos need a verified account beyond 15 minutes.</li>
  <li>Give each platform one job — discovery, trust, community — with your website as home.</li>
  <li>Start with two platforms, add more when publishing is routine.</li>
</ul>
<div class="link-card"><a href="https://support.google.com/youtube/answer/71673?hl=en" target="_blank" rel="noopener">YouTube Help — Upload videos longer than 15 minutes</a></div>
<div class="link-card"><a href="https://about.fb.com/news/2025/06/making-it-easier-create-videos-facebook/" target="_blank" rel="noopener">Meta Newsroom — All Facebook videos shared as Reels (June 2025)</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Cùng một video chạy rất khác trên mỗi nền tảng — nên hãy giao cho mỗi nền tảng một việc</h2>
<p class="lead">Một video hướng dẫn có lượt xem đều đặn trên YouTube suốt hai năm có thể biến mất trên TikTok sau một ngày, và một clip 20 giây nổ trên TikTok lại chẳng mấy ý nghĩa với tìm kiếm YouTube. Đó không phải may rủi; mỗi nền tảng được xây cho một kiểu xem khác nhau. Bài này vẽ bản đồ bốn nền tảng bạn định dùng, kèm số liệu Việt Nam, và kết thúc bằng một việc cho mỗi nơi.</p>

<h3>Bốn nền tảng trong một cái nhìn</h3>
${slide('cr-01', 3, 'Bốn nền tảng, bốn luật chơi')}
<div class="kv-grid">
  <div class="kv"><span class="k">YouTube</span><span class="v">Hai cửa vào: <strong>tìm kiếm</strong> (người ta gõ đúng vấn đề) và <strong>đề xuất</strong> (trang chủ, "video tiếp theo"). Video dài tiếp tục được tìm thấy nhiều năm; Shorts kéo người lạ vào. <small>Nhà tốt nhất cho video dạy code của bạn.</small></span></div>
  <div class="kv"><span class="k">TikTok</span><span class="v">Luồng <strong>Dành cho bạn</strong> (For You) đưa video tới người CHƯA theo dõi bạn, dựa trên sở thích của họ. Phản hồi rất nhanh: vài giờ là biết câu hook có ăn không. <small>Tốt nhất để được khám phá và thử ý tưởng.</small></span></div>
  <div class="kv"><span class="k">Facebook</span><span class="v">Vẫn là nền tảng lớn nhất Việt Nam. Trang, <strong>Nhóm</strong> (nhóm sinh viên IT, nhóm FPTU) và Reels. Từ tháng 6/2025, mọi video đăng lên đều được chia sẻ dưới dạng Reels. <small>Tốt nhất cho cộng đồng và tiếp cận người đã biết bạn.</small></span></div>
  <div class="kv"><span class="k">Instagram</span><span class="v">Reels cộng với một trang cá nhân nhiều hình ảnh, giống một bộ hồ sơ năng lực. Nhỏ hơn nhiều ở Việt Nam, lớn hơn nhiều ở quốc tế. <small>Tốt nhất cho nội dung tiếng Anh của bạn.</small></span></div>
</div>

<h3>Định dạng và độ dài (tính đến 09/2026)</h3>
${slide('cr-01', 4, 'Định dạng & độ dài')}
<table>
  <tr><th>Nền tảng</th><th>Tỉ lệ khung</th><th>Độ dài</th><th>Nguồn &amp; ghi chú</th></tr>
  <tr><td>Video YouTube</td><td>16:9</td><td>Mặc định tới 15 phút; tài khoản đã xác minh tới 12 giờ hoặc 256 GB</td><td>YouTube Help</td></tr>
  <tr><td>YouTube Shorts</td><td>9:16 hoặc vuông</td><td>Tới 3 phút</td><td>Từ 15/10/2024 (YouTube Blog)</td></tr>
  <tr><td>TikTok</td><td>9:16</td><td>Tải lên tới 10 phút là mức phổ biến</td><td>TikTok từng thử nghiệm video 60 phút với một nhóm nhỏ, 5/2024 (TechCrunch)</td></tr>
  <tr><td>Facebook Reels</td><td>9:16</td><td>Không giới hạn độ dài hay định dạng</td><td>Mọi video thành Reels từ 6/2025 (Meta Newsroom)</td></tr>
  <tr><td>Instagram Reels</td><td>9:16</td><td>Tới 3 phút</td><td>Adam Mosseri, người đứng đầu Instagram, công bố 1/2025</td></tr>
</table>
<p class="note-ct"><strong>Những con số này hay đổi.</strong> Giới hạn và tính năng thay đổi hằng năm. Coi bảng là tình trạng tháng 9/2026, và kiểm trang trợ giúp của chính nền tảng trước khi xây cả một series quanh một giới hạn nào đó.</p>
<p>Hai hệ quả thực tế: <strong>khung dọc 9:16 là ngôn ngữ của ba trên bốn nền tảng</strong>, nên hãy học quay dọc (Chương 17); và <strong>xác minh tài khoản YouTube sớm</strong> — video dạy code dài hơn 15 phút sẽ không tải lên được nếu chưa xác minh.</p>

<h3>Người xem Việt Nam đang ở đâu</h3>
${slide('cr-01', 5, 'Người Việt đang ở đâu')}
<p>Báo cáo <em>Digital 2026: Vietnam</em> của DataReportal (số liệu 10/2025) cho tệp quảng cáo tiếp cận được của từng nền tảng: Facebook 79,0 triệu, TikTok 76,1 triệu (từ 18 tuổi), YouTube 62,1 triệu, Instagram 11,7 triệu. Như Mục 0 đã giải thích, đây là số tài khoản chứ không phải số người — dùng để so sánh, đừng coi là số đầu người. Thông điệp vẫn rất rõ: khán giả Việt của bạn nằm phần lớn ở Facebook, TikTok và YouTube; Instagram chủ yếu quan trọng cho phía tiếng Anh.</p>

<h3>Mỗi nền tảng một việc</h3>
<p>Cố "phủ sóng khắp nơi" ngay từ đầu là cách nhanh nhất để kiệt sức. Hãy giao cho mỗi nền tảng một việc duy nhất trong một hệ thống:</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Được khám phá</span><span class="lz-t">TikTok · Reels · Shorts</span><span class="lz-d">Video ngắn để người lạ tìm thấy bạn. Mỗi video một ý, hook mạnh.</span></div>
<div class="lz-layer"><span class="lz-k">Được tin</span><span class="lz-t">Video dài trên YouTube</span><span class="lz-d">Bài hướng dẫn và câu chuyện nơi người ta thấy bạn giải quyết vấn đề thật. Đây là chỗ người xem quyết định theo dõi bạn.</span></div>
<div class="lz-layer"><span class="lz-k">Cộng đồng</span><span class="lz-t">Trang &amp; nhóm Facebook</span><span class="lz-d">Trò chuyện, hỏi đáp, thông báo cho những người đã biết bạn.</span></div>
<div class="lz-layer"><span class="lz-k">Nhà</span><span class="lz-t">cuongthai.com</span><span class="lz-d">Nơi duy nhất thuộc về bạn. Khoá học, bài viết, gói Pro. Mọi nền tảng khác trỏ về đây (Bài 1.4).</span></div>
</div>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — cùng một file cho mọi nơi.</strong> Đăng nguyên video YouTube 16:9 vào luồng 9:16 thì thành một dải nhỏ giữa màn hình điện thoại, còn đăng lại clip TikTok kèm watermark sang nền tảng khác trông cẩu thả. Hãy chỉnh định dạng theo từng nơi đến — Chương 17 và Chương 21 chỉ cách.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — bắt đầu cùng lúc bốn nền tảng.</strong> Bốn tài khoản phải nuôi là bốn nỗ lực dang dở. Hãy bắt đầu với hai: YouTube (video dài và Shorts) cộng TikTok hoặc Facebook. Thêm các nơi khác khi việc đăng đã thành nếp.</p></div>

<h3>🎬 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
<li>Mở YouTube, TikTok, Facebook và Instagram. Với mỗi nơi, ghi lại bạn đã có tài khoản chưa và đang dùng tên gì.</li>
<li>Trên YouTube, kiểm xem tài khoản đã <strong>xác minh</strong> chưa (cần cho video dài hơn 15 phút), chưa thì xác minh ngay.</li>
<li>Chọn <strong>hai nền tảng khởi đầu</strong> và viết một câu cho mỗi nơi: nó làm việc gì cho bạn.</li>
<li>Tìm chủ đề của bạn bằng tiếng Việt trên YouTube và trên TikTok. Ghi lại nơi nào cho kết quả hữu ích hơn với câu hỏi dạng "làm thế nào".</li>
</ol><p><strong>Đạt khi:</strong> có danh sách bốn tài khoản, tài khoản YouTube đã xác minh, hai nền tảng khởi đầu kèm một câu mô tả việc, và một nhận xét viết ra từ phép so sánh tìm kiếm.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Long-form / short-form</span><span class="v">Video dài ngang (chủ yếu YouTube) / video ngắn dọc.</span></div>
  <div class="kv"><span class="k">For You feed</span><span class="v">Luồng "Dành cho bạn" của TikTok — phần lớn là video từ tài khoản bạn chưa theo dõi.</span></div>
  <div class="kv"><span class="k">Reels</span><span class="v">Video ngắn dọc trên Instagram và Facebook.</span></div>
  <div class="kv"><span class="k">Aspect ratio</span><span class="v">Tỉ lệ khung — chiều rộng so với chiều cao: 16:9 ngang, 9:16 dọc.</span></div>
  <div class="kv"><span class="k">Verified account</span><span class="v">Tài khoản YouTube đã xác minh bằng điện thoại, mở khoá video dài hơn 15 phút.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>YouTube = tìm kiếm + đề xuất, lượt xem kéo dài nhiều năm; TikTok = được khám phá; Facebook = khán giả Việt lớn nhất và cộng đồng; Instagram = hồ sơ hình ảnh, mạnh ở quốc tế.</li>
  <li>Ba trên bốn nền tảng nói ngôn ngữ 9:16; video YouTube dài hơn 15 phút cần tài khoản đã xác minh.</li>
  <li>Giao mỗi nền tảng một việc — khám phá, niềm tin, cộng đồng — với website làm nhà.</li>
  <li>Bắt đầu với hai nền tảng, thêm nơi khác khi việc đăng đã thành nếp.</li>
</ul>
<div class="link-card"><a href="https://support.google.com/youtube/answer/71673?hl=en" target="_blank" rel="noopener">YouTube Help — Tải lên video dài hơn 15 phút</a></div>
<div class="link-card"><a href="https://about.fb.com/news/2025/06/making-it-easier-create-videos-facebook/" target="_blank" rel="noopener">Meta Newsroom — Mọi video Facebook được chia sẻ dưới dạng Reels (6/2025)</a></div>
</div>
`,
    },
    /* ─────────────────── 1.2 thuật toán đề xuất ─────────────────── */
    {
      title: '1.2 — What recommendation systems actually measure|||1.2 — Hệ thống đề xuất thật sự đo gì',
      slug: 'cr-01-2-thuat-toan-de-xuat',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Theo lời chính YouTube và TikTok: hệ thống đề xuất dựa vào cú bấm, thời lượng xem, mức hài lòng và tương tác; số follower không phải yếu tố trực tiếp; và những lời đồn nên bỏ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>"The algorithm" is not a person who likes or hates you — it is a prediction of what each viewer will be glad they watched</h2>
<p class="lead">Beginners talk about the algorithm like weather: mysterious, moody, out of their control. The platforms themselves have described what their systems look at, and it is less mysterious than it sounds. This lesson uses only what YouTube and TikTok have published, separates it from the myths, and turns it into the few things you actually control.</p>

<h3>What YouTube says its system uses</h3>
${slide('cr-01', 6, 'YouTube đề xuất video dựa vào gì')}
<p>In a post on YouTube's official blog (15 September 2021), Cristos Goodrow, YouTube's VP of Engineering, listed the signals the recommendation system relies on:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Clicks</span><span class="v">Choosing to watch is a signal of interest — but a click alone is not trusted, because misleading titles also get clicks.</span></div>
  <div class="kv"><span class="k">Watch time</span><span class="v">Which videos someone watched and for how long.</span></div>
  <div class="kv"><span class="k">Survey responses</span><span class="v">YouTube asks viewers to rate videos and uses the answers to measure "valued watchtime" — time that people were actually glad to spend.</span></div>
  <div class="kv"><span class="k">Sharing</span><span class="v">People tend to be satisfied by videos they share.</span></div>
  <div class="kv"><span class="k">Likes and dislikes</span><span class="v">Direct signals of whether the viewer enjoyed it.</span></div>
</div>
<p>Put together, the logic is a loop. Your video is shown (an <strong>impression</strong> — lượt hiển thị), some people click (<strong>click-through rate, CTR</strong> — tỉ lệ nhấp), they watch for a while (<strong>watch time</strong> and <strong>retention</strong>), and they signal whether they were satisfied. Good answers at each step lead to the video being shown to more people who look like them. The system follows viewers' behaviour; it does not have opinions about you.</p>
<p class="note-ct"><strong>Why this matters for the rest of the course:</strong> the title and thumbnail win the click (Chapter 22), the hook and editing earn the watch time (Chapters 3 and 14), and keeping the promise earns satisfaction. Every chapter of this course pushes one of these levers.</p>

<h3>What TikTok says about its For You feed</h3>
${slide('cr-01', 7, 'TikTok "Dành cho bạn" dựa vào gì')}
<p>TikTok's newsroom post "How TikTok recommends videos #ForYou" (18 June 2020) groups its factors into three families:</p>
<ul>
  <li><strong>User interactions</strong> — likes, shares, follows, comments, and what someone watches. Finishing a longer video from beginning to end is described as a strong signal.</li>
  <li><strong>Video information</strong> — captions, sounds and hashtags, which help the system understand what the video is about.</li>
  <li><strong>Device and account settings</strong> — language preference, country, device type; weaker signals.</li>
</ul>
<p>One sentence in that post is worth remembering: <strong>follower count and a history of high-performing videos are not direct factors</strong> in the recommendation system. A new account with a good video is not locked out. That is exactly why short-form platforms are the fastest way for a new creator to be discovered.</p>

<h3>Myths and what the platforms actually say</h3>
${slide('cr-01', 8, 'Lời đồn và điều nền tảng thật sự nói')}
<table>
  <tr><th>Myth</th><th>What the sources say</th></tr>
  <tr><td>"Small channels never get recommended."</td><td>TikTok states follower count is not a direct factor. On YouTube, recommendations follow viewer satisfaction, which a small channel can earn.</td></tr>
  <tr><td>"The more hashtags, the better."</td><td>YouTube's hashtag policy: if a video has more than 60 hashtags, YouTube ignores <em>all</em> hashtags on that video. A few relevant ones are enough.</td></tr>
  <tr><td>"The algorithm hates my channel."</td><td>The system predicts what each viewer will value. When views drop, look at your own numbers — click-through, retention, satisfaction — before blaming the system (Chapter 23).</td></tr>
  <tr><td>"Just post more and you will grow."</td><td>Volume helps only when viewers value the videos. Weak videos generate weak signals; consistency of <em>good</em> videos is what compounds.</td></tr>
</table>

<h3>What you actually control</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Packaging</span><span class="lz-d">An honest, specific title and a clear thumbnail win the right clicks.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">The opening</span><span class="lz-d">A hook that states the promise keeps the right viewers past the first seconds.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">The pace</span><span class="lz-d">Tight editing without dead air keeps watch time up.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">The payoff</span><span class="lz-d">Delivering what the title promised earns likes, shares and good survey answers.</span></div>
</div>

<div class="pitfall co-tieu-de"><p><strong>Trap — chasing hacks.</strong> Posting at a "magic hour", copying a trending sound that has nothing to do with your video, stuffing hashtags. None of these fix a video that viewers do not value, and some (like 60+ hashtags) work against you.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Trap — winning the click, losing the viewer.</strong> A clickbait title raises clicks once and then drops satisfaction, because people leave disappointed. YouTube explicitly measures satisfaction for this reason.</p></div>

<h3>🎬 Practice (25 minutes)</h3>
<div class="callout ok"><ol>
<li>Pick five videos in your niche that you personally finished and liked (YouTube or TikTok).</li>
<li>For each, write four short lines: <em>the promise</em> (title/hook), <em>the first 5 seconds</em>, <em>did it deliver?</em>, <em>would I share it and with whom?</em></li>
<li>Circle the pattern that appears in at least three of the five.</li>
</ol><p><strong>Done when:</strong> a five-row table with four answers per video, and one pattern written as a rule you will apply to your own next video.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Impression</span><span class="v">One time your thumbnail or video is shown to someone.</span></div>
  <div class="kv"><span class="k">Click-through rate (CTR)</span><span class="v">The share of impressions that became views.</span></div>
  <div class="kv"><span class="k">Watch time</span><span class="v">Total time viewers spent watching.</span></div>
  <div class="kv"><span class="k">Valued watchtime</span><span class="v">YouTube's term for watch time viewers say (in surveys) was worth it.</span></div>
  <div class="kv"><span class="k">Signal</span><span class="v">A piece of behaviour the system uses to predict what a viewer will like.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>YouTube (2021): clicks, watch time, survey-based valued watchtime, shares, likes, dislikes.</li>
  <li>TikTok (2020): interactions (finishing a video is strong), video information, device and account settings; follower count is not a direct factor.</li>
  <li>More than 60 hashtags on YouTube and all of them are ignored.</li>
  <li>You control packaging, opening, pace and payoff — the rest of the course trains exactly these.</li>
</ul>
<div class="link-card"><a href="https://blog.youtube/inside-youtube/on-youtubes-recommendation-system/" target="_blank" rel="noopener">YouTube Blog — On YouTube's recommendation system (2021)</a></div>
<div class="link-card"><a href="https://newsroom.tiktok.com/en-us/how-tiktok-recommends-videos-for-you" target="_blank" rel="noopener">TikTok Newsroom — How TikTok recommends videos #ForYou (2020)</a></div>
<div class="link-card"><a href="https://support.google.com/youtube/answer/6390658?hl=en" target="_blank" rel="noopener">YouTube Help — Hashtag policy</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>"Thuật toán" không phải một người thích hay ghét bạn — nó là phép dự đoán điều mỗi người xem sẽ thấy đáng xem</h2>
<p class="lead">Người mới hay nói về thuật toán như nói về thời tiết: bí ẩn, thất thường, ngoài tầm tay. Chính các nền tảng đã mô tả hệ thống của họ nhìn vào những gì, và nó bớt bí ẩn hơn bạn tưởng. Bài này chỉ dùng những gì YouTube và TikTok đã công bố, tách nó khỏi lời đồn, và biến nó thành vài thứ bạn thật sự điều khiển được.</p>

<h3>YouTube nói hệ thống của họ dùng gì</h3>
${slide('cr-01', 6, 'YouTube đề xuất video dựa vào gì')}
<p>Trong một bài trên blog chính thức của YouTube (15/09/2021), Cristos Goodrow — Phó chủ tịch Kỹ thuật của YouTube — liệt kê các tín hiệu hệ thống đề xuất dựa vào:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Cú bấm</span><span class="v">Chọn xem là một tín hiệu quan tâm — nhưng chỉ cú bấm thôi thì không được tin, vì tiêu đề gây hiểu lầm cũng có cú bấm.</span></div>
  <div class="kv"><span class="k">Thời lượng xem</span><span class="v">Người ta đã xem những video nào và xem trong bao lâu.</span></div>
  <div class="kv"><span class="k">Câu trả lời khảo sát</span><span class="v">YouTube hỏi người xem chấm điểm video, và dùng câu trả lời để đo "valued watchtime" — thời gian người ta thật sự thấy đáng bỏ ra.</span></div>
  <div class="kv"><span class="k">Chia sẻ</span><span class="v">Người ta thường hài lòng với những video họ chia sẻ.</span></div>
  <div class="kv"><span class="k">Like và dislike</span><span class="v">Tín hiệu trực tiếp cho biết người xem có thích hay không.</span></div>
</div>
<p>Ghép lại, logic là một vòng lặp. Video của bạn được hiển thị (<strong>impression</strong> — lượt hiển thị), một số người bấm vào (<strong>click-through rate, CTR</strong> — tỉ lệ nhấp), họ xem một lúc (<strong>thời lượng xem</strong> và <strong>tỉ lệ giữ chân</strong>), và họ phát tín hiệu có hài lòng hay không. Trả lời tốt ở mỗi bước thì video được hiển thị cho nhiều người giống họ hơn. Hệ thống chạy theo hành vi người xem; nó không có ý kiến gì về bạn.</p>
<p class="note-ct"><strong>Vì sao điều này quan trọng với phần còn lại của khoá:</strong> tiêu đề và thumbnail thắng cú bấm (Chương 22), hook và cách dựng giành thời lượng xem (Chương 3 và 14), còn giữ đúng lời hứa giành sự hài lòng. Chương nào của khoá cũng đẩy một trong các cần gạt này.</p>

<h3>TikTok nói gì về luồng Dành cho bạn</h3>
${slide('cr-01', 7, 'TikTok "Dành cho bạn" dựa vào gì')}
<p>Bài "How TikTok recommends videos #ForYou" trên trang tin chính thức của TikTok (18/06/2020) chia các yếu tố thành ba nhóm:</p>
<ul>
  <li><strong>Tương tác của người dùng</strong> — like, chia sẻ, theo dõi, bình luận, và việc họ xem gì. Xem hết một video dài từ đầu tới cuối được mô tả là một tín hiệu mạnh.</li>
  <li><strong>Thông tin video</strong> — chú thích, âm thanh và hashtag, giúp hệ thống hiểu video nói về cái gì.</li>
  <li><strong>Cài đặt thiết bị và tài khoản</strong> — ngôn ngữ ưu tiên, quốc gia, loại thiết bị; là các tín hiệu yếu hơn.</li>
</ul>
<p>Có một câu trong bài đó đáng nhớ: <strong>số người theo dõi và lịch sử có video nổi KHÔNG phải yếu tố trực tiếp</strong> của hệ thống đề xuất. Một tài khoản mới có video tốt không bị khoá cửa. Đó chính là lý do nền tảng video ngắn là đường nhanh nhất để một creator mới được khám phá.</p>

<h3>Lời đồn và điều các nền tảng thật sự nói</h3>
${slide('cr-01', 8, 'Lời đồn và điều nền tảng thật sự nói')}
<table>
  <tr><th>Lời đồn</th><th>Nguồn nói gì</th></tr>
  <tr><td>"Kênh nhỏ không bao giờ lên đề xuất."</td><td>TikTok khẳng định số follower không phải yếu tố trực tiếp. Trên YouTube, đề xuất bám theo sự hài lòng của người xem — thứ mà kênh nhỏ vẫn giành được.</td></tr>
  <tr><td>"Càng nhiều hashtag càng tốt."</td><td>Chính sách hashtag của YouTube: video có hơn 60 hashtag thì YouTube bỏ qua <em>tất cả</em> hashtag của video đó. Vài hashtag đúng chủ đề là đủ.</td></tr>
  <tr><td>"Thuật toán ghét kênh mình."</td><td>Hệ thống dự đoán điều mỗi người xem sẽ thấy đáng. Khi lượt xem giảm, hãy nhìn số liệu của chính bạn — tỉ lệ nhấp, tỉ lệ giữ chân, mức hài lòng — trước khi đổ lỗi cho hệ thống (Chương 23).</td></tr>
  <tr><td>"Cứ đăng thật nhiều là lên."</td><td>Số lượng chỉ giúp khi người xem thấy video có giá trị. Video yếu tạo tín hiệu yếu; chính sự đều đặn của những video <em>tốt</em> mới tích luỹ.</td></tr>
</table>

<h3>Những gì bạn thật sự điều khiển được</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Đóng gói</span><span class="lz-d">Tiêu đề trung thực, cụ thể và thumbnail rõ ràng giành đúng những cú bấm cần có.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Phần mở đầu</span><span class="lz-d">Hook nói rõ lời hứa giữ đúng người xem qua được mấy giây đầu.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Nhịp độ</span><span class="lz-d">Dựng gọn, không khoảng chết, giữ thời lượng xem.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Phần trả thưởng</span><span class="lz-d">Trao đúng thứ tiêu đề đã hứa để giành like, lượt chia sẻ và câu trả lời khảo sát tốt.</span></div>
</div>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — đi săn mẹo.</strong> Đăng vào "giờ vàng", dùng âm thanh thịnh hành chẳng liên quan gì tới video, nhồi hashtag. Không mẹo nào cứu được một video người xem thấy vô giá trị, và vài mẹo (như hơn 60 hashtag) còn phản tác dụng.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — thắng cú bấm, mất người xem.</strong> Tiêu đề câu kéo đẩy cú bấm lên một lần rồi kéo mức hài lòng xuống, vì người ta bỏ đi trong thất vọng. YouTube đo sự hài lòng chính là vì lý do đó.</p></div>

<h3>🎬 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
<li>Chọn năm video trong ngách của bạn mà chính bạn đã xem hết và thích (YouTube hoặc TikTok).</li>
<li>Với mỗi video, viết bốn dòng ngắn: <em>lời hứa</em> (tiêu đề/hook), <em>5 giây đầu</em>, <em>có trả được lời hứa không?</em>, <em>mình có chia sẻ không, cho ai?</em></li>
<li>Khoanh lại điểm chung xuất hiện ở ít nhất ba trong năm video.</li>
</ol><p><strong>Đạt khi:</strong> có một bảng năm dòng, mỗi video đủ bốn câu trả lời, và một điểm chung được viết thành luật bạn sẽ áp dụng cho video kế tiếp của mình.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Impression</span><span class="v">Lượt hiển thị — một lần thumbnail hoặc video của bạn hiện ra trước mắt ai đó.</span></div>
  <div class="kv"><span class="k">Click-through rate (CTR)</span><span class="v">Tỉ lệ nhấp — phần lượt hiển thị trở thành lượt xem.</span></div>
  <div class="kv"><span class="k">Watch time</span><span class="v">Thời lượng xem — tổng thời gian người xem đã bỏ ra.</span></div>
  <div class="kv"><span class="k">Valued watchtime</span><span class="v">Cách YouTube gọi thời lượng xem mà người xem nói (qua khảo sát) là đáng.</span></div>
  <div class="kv"><span class="k">Signal</span><span class="v">Tín hiệu — một hành vi hệ thống dùng để dự đoán người xem sẽ thích gì.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>YouTube (2021): cú bấm, thời lượng xem, "valued watchtime" đo qua khảo sát, chia sẻ, like, dislike.</li>
  <li>TikTok (2020): tương tác (xem hết video là tín hiệu mạnh), thông tin video, cài đặt thiết bị và tài khoản; số follower không phải yếu tố trực tiếp.</li>
  <li>Hơn 60 hashtag trên YouTube là toàn bộ hashtag bị bỏ qua.</li>
  <li>Bạn điều khiển đóng gói, mở đầu, nhịp độ và trả thưởng — phần còn lại của khoá rèn đúng những thứ này.</li>
</ul>
<div class="link-card"><a href="https://blog.youtube/inside-youtube/on-youtubes-recommendation-system/" target="_blank" rel="noopener">YouTube Blog — Về hệ thống đề xuất của YouTube (2021)</a></div>
<div class="link-card"><a href="https://newsroom.tiktok.com/en-us/how-tiktok-recommends-videos-for-you" target="_blank" rel="noopener">TikTok Newsroom — TikTok đề xuất video #ForYou thế nào (2020)</a></div>
<div class="link-card"><a href="https://support.google.com/youtube/answer/6390658?hl=en" target="_blank" rel="noopener">YouTube Help — Chính sách hashtag</a></div>
</div>
`,
    },

    /* ─────────────────── 1.3 chọn ngách & khán giả ─────────────────── */
    {
      title: '1.3 — Choosing a niche and a real viewer|||1.3 — Chọn ngách và một người xem có thật',
      slug: 'cr-01-3-chon-ngach-khan-gia',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Tìm ngách ở chỗ ba vòng tròn giao nhau, kiểm xem ngách có người cần không, và viết chân dung một người xem cụ thể để mọi video nói đúng với họ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.3</span>
<h2>A niche is not a limit — it is the reason a stranger knows why to follow you</h2>
<p class="lead">"I make videos about technology" gives nobody a reason to subscribe. "I build real web apps step by step for Vietnamese IT students" does. A niche (ngách) is the specific topic and the specific people you serve. This lesson finds yours where three circles overlap, checks that people actually want it, and turns "the audience" into one real person you write every video for.</p>

<h3>Three circles</h3>
${slide('cr-01', 9, 'Chọn ngách: giao của ba vòng tròn')}
<div class="kv-grid">
  <div class="kv"><span class="k">What you are good at — or learning in public</span><span class="v">Things you can explain without looking up every sentence. You do not need to be an expert; being two steps ahead of your viewer is enough, as long as you are honest about it.</span></div>
  <div class="kv"><span class="k">What other people need</span><span class="v">Problems people search for, ask about in groups and struggle with in class.</span></div>
  <div class="kv"><span class="k">What you can keep doing</span><span class="v">A topic you will still want to talk about after 50 videos, with material that keeps coming (your projects, your studies, your website).</span></div>
</div>
<p>A topic that sits in only one or two circles fails in a predictable way: expertise without demand gets no viewers; demand without interest burns you out; interest without skill loses trust. Aim for the middle.</p>

<h3>Examples that fit you</h3>
<ul>
  <li><strong>"Building real web apps from zero with Next.js and Node — for Vietnamese IT students."</strong> You already built cuongthai.com and wrote courses on these tools. Material is endless.</li>
  <li><strong>"A student building in public."</strong> The journey of adding features to your own site, including failures and fixes.</li>
  <li><strong>"Hard IT subjects explained with pictures."</strong> Databases, networking, Git — the subjects your courses already cover.</li>
</ul>
<p>Notice how narrow each one is. <strong>Narrow first, widen later</strong>: when a stranger can tell in one sentence what your channel does, both people and recommendation systems know who to show it to. Once you are known for one thing, you earn the right to add a second.</p>

<h3>Check that people actually want it</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Search suggestions</span><span class="lz-d">Type your topic into YouTube search in Vietnamese and read the autocomplete. Those are real searches.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Existing videos</span><span class="lz-d">Are there videos on it? Are they good, outdated, or all in English? Gaps are opportunities.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Questions in communities</span><span class="lz-d">Facebook groups for IT students, class chats: which questions come up again and again?</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Your own material</span><span class="lz-d">List what you can teach from your courses and projects. If the list is long, the niche can last.</span></div>
</div>

<h3>Write for ONE person</h3>
${slide('cr-01', 10, 'Viết cho MỘT người cụ thể')}
<p>An <strong>audience persona</strong> (chân dung khán giả) is a short description of one imaginary but realistic viewer. It keeps every decision concrete: which words to explain, how fast to go, what to show first. For example:</p>
<div class="callout ok"><p><strong>Minh, 20, second-year IT student.</strong> Passed the web programming course but has never built a product alone. Watches YouTube on his phone in the evening, searches things like "how to deploy a website" and "CORS error". Afraid of English documentation. Wants a real project for his internship CV. <em>Pain: finishes tutorials but still cannot build anything alone.</em></p></div>
<ul>
  <li><strong>Who they are and what they know</strong> — so you do not explain what they already know, or skip what they do not.</li>
  <li><strong>Where it hurts</strong> — the source of your video ideas.</li>
  <li><strong>What they type</strong> — the words for your titles.</li>
  <li><strong>Where and when they watch</strong> — the platforms and the posting times.</li>
</ul>
<p>When you record, you are talking to Minh — not to "everyone". That single choice makes your delivery warmer and your explanations clearer.</p>

<h3>Vietnamese, English — or both?</h3>
<p>Your Vietnamese audience is large and underserved for in-depth, project-based programming content. Your English audience is global and more competitive. A practical path is to build in Vietnamese first, where your advantage is biggest, and add English versions of your strongest videos later. Chapter 20 covers the strategy and workflow in detail.</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — a niche so wide it says nothing.</strong> "Technology", "lifestyle", "education". Nobody can tell what they will get, so nobody has a reason to follow.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Trap — choosing a niche only because it is trending.</strong> Trends give you a burst of views and a channel you do not want to keep making. The third circle — "can I keep doing this?" — is the one beginners skip, and the one that decides whether you are still posting in a year.</p></div>

<h3>🎬 Practice (30 minutes)</h3>
<div class="callout ok"><ol>
<li>Draw the three circles on paper or on the iPad. Write at least five items in each.</li>
<li>Write your niche in <strong>one sentence</strong>: topic + who it is for + what they get.</li>
<li>Run the four demand checks and write one line of evidence for each.</li>
<li>Write your audience persona: name, age, level, pain, what they type, where they watch. Pin it at the top of <code>/creator/ideas</code>.</li>
</ol><p><strong>Done when:</strong> one-sentence niche, four lines of demand evidence, and a persona you could read aloud before every recording.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Niche</span><span class="v">The specific topic and audience you focus on.</span></div>
  <div class="kv"><span class="k">Audience persona</span><span class="v">A realistic description of one typical viewer.</span></div>
  <div class="kv"><span class="k">Pain point</span><span class="v">A problem your viewer wants solved.</span></div>
  <div class="kv"><span class="k">Autocomplete</span><span class="v">Search suggestions that reveal what people actually type.</span></div>
  <div class="kv"><span class="k">Learning in public</span><span class="v">Teaching what you are learning as you learn it, honestly.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Your niche sits where three circles overlap: what you know, what people need, what you can keep doing.</li>
  <li>Narrow first; a stranger should understand your channel in one sentence.</li>
  <li>Check demand with search suggestions, existing videos, community questions and your own material.</li>
  <li>Write every video for one person — your persona.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.3</span>
<h2>Ngách không phải là giới hạn — nó là lý do để một người lạ biết vì sao nên theo dõi bạn</h2>
<p class="lead">"Mình làm video về công nghệ" không cho ai lý do để đăng ký. "Mình dựng ứng dụng web thật từng bước cho sinh viên IT Việt Nam" thì có. Ngách (niche) là chủ đề cụ thể và nhóm người cụ thể bạn phục vụ. Bài này tìm ngách của bạn ở chỗ ba vòng tròn giao nhau, kiểm xem người ta có thật sự cần nó không, và biến "khán giả" thành một người thật mà bạn viết mọi video cho họ.</p>

<h3>Ba vòng tròn</h3>
${slide('cr-01', 9, 'Chọn ngách: giao của ba vòng tròn')}
<div class="kv-grid">
  <div class="kv"><span class="k">Thứ bạn giỏi — hoặc đang học công khai</span><span class="v">Những thứ bạn giải thích được mà không phải tra từng câu. Bạn không cần là chuyên gia; đi trước người xem hai bước là đủ, miễn là bạn thành thật về điều đó.</span></div>
  <div class="kv"><span class="k">Thứ người khác cần</span><span class="v">Những vấn đề người ta tìm kiếm, hỏi trong nhóm, và vật lộn trên lớp.</span></div>
  <div class="kv"><span class="k">Thứ bạn làm được lâu</span><span class="v">Chủ đề mà sau 50 video bạn vẫn muốn nói, với chất liệu không ngừng đến (dự án, việc học, website của bạn).</span></div>
</div>
<p>Chủ đề chỉ nằm trong một hai vòng sẽ hỏng theo kiểu đoán trước được: giỏi mà không ai cần thì không có người xem; có người cần mà mình không thích thì kiệt sức; thích mà không giỏi thì mất lòng tin. Hãy nhắm vào chính giữa.</p>

<h3>Những ví dụ hợp với bạn</h3>
<ul>
  <li><strong>"Dựng ứng dụng web thật từ số 0 bằng Next.js và Node — cho sinh viên IT Việt Nam."</strong> Bạn đã tự dựng cuongthai.com và viết khoá học về đúng những công cụ này. Chất liệu không bao giờ hết.</li>
  <li><strong>"Một sinh viên build in public."</strong> Hành trình thêm tính năng cho chính website của mình, kể cả thất bại và cách sửa.</li>
  <li><strong>"Môn IT khó giải thích bằng hình."</strong> Cơ sở dữ liệu, mạng máy tính, Git — những môn các khoá của bạn đã có sẵn.</li>
</ul>
<p>Để ý mỗi ngách hẹp tới mức nào. <strong>Hẹp trước, mở rộng sau</strong>: khi một người lạ hiểu được kênh của bạn làm gì chỉ trong một câu, cả con người lẫn hệ thống đề xuất đều biết nên cho ai xem. Khi đã được biết tới vì một điều, bạn mới có quyền thêm điều thứ hai.</p>

<h3>Kiểm xem người ta có thật sự cần không</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Gợi ý tìm kiếm</span><span class="lz-d">Gõ chủ đề vào ô tìm kiếm YouTube bằng tiếng Việt và đọc các gợi ý tự động. Đó là những lượt tìm có thật.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Video đang có</span><span class="lz-d">Đã có video nào chưa? Chúng tốt, lỗi thời, hay toàn tiếng Anh? Khoảng trống là cơ hội.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Câu hỏi trong cộng đồng</span><span class="lz-d">Nhóm Facebook sinh viên IT, nhóm chat của lớp: câu hỏi nào lặp đi lặp lại?</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Chất liệu của chính bạn</span><span class="lz-d">Liệt kê những gì bạn dạy được từ các khoá học và dự án. Danh sách càng dài, ngách càng sống lâu.</span></div>
</div>

<h3>Viết cho MỘT người</h3>
${slide('cr-01', 10, 'Viết cho MỘT người cụ thể')}
<p><strong>Audience persona</strong> (chân dung khán giả) là một đoạn mô tả ngắn về một người xem tưởng tượng nhưng rất thật. Nó giữ mọi quyết định cụ thể: từ nào cần giải thích, đi nhanh tới đâu, cho xem gì trước. Ví dụ:</p>
<div class="callout ok"><p><strong>Minh, 20 tuổi, sinh viên IT năm hai.</strong> Qua môn lập trình web nhưng chưa từng tự dựng một sản phẩm nào. Buổi tối xem YouTube trên điện thoại, hay tìm "cách deploy website" và "lỗi CORS". Ngại tài liệu tiếng Anh. Muốn có một dự án thật cho CV xin thực tập. <em>Nỗi đau: làm theo tutorial xong vẫn không tự làm được gì.</em></p></div>
<ul>
  <li><strong>Họ là ai, biết tới đâu</strong> — để bạn không giải thích thứ họ đã biết, hay bỏ qua thứ họ chưa biết.</li>
  <li><strong>Họ đau ở đâu</strong> — nguồn ý tưởng video của bạn.</li>
  <li><strong>Họ gõ chữ gì</strong> — chữ cho tiêu đề của bạn.</li>
  <li><strong>Họ xem ở đâu, lúc nào</strong> — nền tảng và giờ đăng.</li>
</ul>
<p>Khi quay, bạn đang nói với Minh — không phải với "mọi người". Chỉ một lựa chọn đó làm giọng bạn ấm hơn và lời giải thích rõ hơn.</p>

<h3>Tiếng Việt, tiếng Anh — hay cả hai?</h3>
<p>Khán giả Việt của bạn rất lớn và còn thiếu nội dung lập trình sâu, dựa trên dự án thật. Khán giả tiếng Anh thì toàn cầu và cạnh tranh hơn. Một con đường thực tế là xây bằng tiếng Việt trước, nơi lợi thế của bạn lớn nhất, rồi thêm bản tiếng Anh cho những video mạnh nhất sau. Chương 20 nói chi tiết chiến lược và quy trình.</p>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — ngách rộng tới mức chẳng nói gì.</strong> "Công nghệ", "phong cách sống", "giáo dục". Không ai đoán được mình sẽ nhận gì, nên không ai có lý do để theo dõi.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — chọn ngách chỉ vì đang thịnh hành.</strong> Trào lưu cho bạn một đợt lượt xem và một kênh bạn không muốn làm tiếp. Vòng tròn thứ ba — "mình có làm được lâu không?" — là vòng người mới hay bỏ qua, và cũng là vòng quyết định một năm nữa bạn còn đăng hay không.</p></div>

<h3>🎬 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Vẽ ba vòng tròn trên giấy hoặc iPad. Viết ít nhất năm mục vào mỗi vòng.</li>
<li>Viết ngách của bạn trong <strong>một câu</strong>: chủ đề + dành cho ai + họ nhận được gì.</li>
<li>Làm bốn bước kiểm nhu cầu, mỗi bước ghi một dòng bằng chứng.</li>
<li>Viết chân dung khán giả: tên, tuổi, trình độ, nỗi đau, họ gõ gì, xem ở đâu. Ghim nó lên đầu <code>/creator/ideas</code>.</li>
</ol><p><strong>Đạt khi:</strong> có câu ngách một câu, bốn dòng bằng chứng về nhu cầu, và một chân dung khán giả bạn có thể đọc to trước mỗi lần quay.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Niche</span><span class="v">Ngách — chủ đề và nhóm khán giả cụ thể bạn tập trung.</span></div>
  <div class="kv"><span class="k">Audience persona</span><span class="v">Chân dung khán giả — mô tả thực tế về một người xem điển hình.</span></div>
  <div class="kv"><span class="k">Pain point</span><span class="v">Nỗi đau — vấn đề người xem muốn được giải quyết.</span></div>
  <div class="kv"><span class="k">Autocomplete</span><span class="v">Gợi ý tìm kiếm tự động — cho thấy người ta thật sự gõ gì.</span></div>
  <div class="kv"><span class="k">Learning in public</span><span class="v">Học công khai — dạy lại thứ mình đang học, trong lúc học, một cách thành thật.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Ngách của bạn nằm ở chỗ ba vòng tròn giao nhau: thứ bạn biết, thứ người ta cần, thứ bạn làm được lâu.</li>
  <li>Hẹp trước; một người lạ phải hiểu kênh của bạn trong một câu.</li>
  <li>Kiểm nhu cầu bằng gợi ý tìm kiếm, video đang có, câu hỏi cộng đồng và chất liệu của chính bạn.</li>
  <li>Viết mọi video cho một người — chân dung khán giả của bạn.</li>
</ul>
</div>
`,
    },

    /* ─────────────────── 1.4 thương hiệu cá nhân ─────────────────── */
    {
      title: '1.4 — Personal brand: pillars, identity, and a website at the centre|||1.4 — Thương hiệu cá nhân: trụ cột, nhận diện, và website làm trung tâm',
      slug: 'cr-01-4-thuong-hieu-ca-nhan',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Ba bốn trụ cột nội dung, nhận diện đồng nhất trên mọi nền tảng (tên, ảnh, bio, màu, font có dấu), và sơ đồ trung tâm – nan hoa đưa người xem về cuongthai.com.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.4</span>
<h2>A personal brand is a promise repeated until people expect it</h2>
<p class="lead">You do not need a logo to have a brand. Your brand is what viewers expect when they see your name: the topics, the tone, the quality. This lesson turns your niche into three or four content pillars, makes your identity consistent across platforms, and connects everything to the one place you own — cuongthai.com.</p>

<h3>Content pillars</h3>
${slide('cr-01', 11, 'Trụ cột nội dung — 3 đến 4 cột')}
<p><strong>Content pillars</strong> (trụ cột nội dung) are the three or four recurring kinds of video your channel makes. They give viewers a clear expectation and give you an endless source of ideas. For your niche:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Teach</span><span class="v">Step-by-step tutorials, real bug fixes, concepts explained with diagrams.</span></div>
  <div class="kv"><span class="k">Journey</span><span class="v">Building cuongthai.com in public — features, failures, what you learned.</span></div>
  <div class="kv"><span class="k">Behind the scenes</span><span class="v">Study vlogs, how you plan a week, a day at FPTU.</span></div>
  <div class="kv"><span class="k">Tools</span><span class="v">Honest reviews of tools you actually use for code and for video.</span></div>
</div>
<p>Every video belongs to exactly one pillar. If an idea fits none of them, it is either a new pillar you are deliberately adding — or a distraction.</p>

<h3>One identity everywhere</h3>
${slide('cr-01', 12, 'Nhận diện đồng nhất trên mọi nền tảng')}
<table>
  <tr><th>Element</th><th>What to do</th></tr>
  <tr><td>Name / handle</td><td>The same @handle everywhere if it is free; if not, the same suffix on every platform. People search for you by name.</td></tr>
  <tr><td>Profile picture</td><td>The same clear photo of your face on a plain background, readable at thumbnail size.</td></tr>
  <tr><td>Bio</td><td>One sentence: who you help do what — plus the link to your website.</td></tr>
  <tr><td>Colours and font</td><td>Two main colours and one font with full Vietnamese diacritics (for example <strong>Be Vietnam Pro</strong>, free on Google Fonts), reused in thumbnails and on-screen text.</td></tr>
  <tr><td>Link</td><td>Every profile points to the same page on cuongthai.com.</td></tr>
</table>
<p>A bio example in Vietnamese and English: <em>"Mình dựng web thật và dạy lại từng bước cho sinh viên IT — khoá học miễn phí tại cuongthai.com"</em> / <em>"I build real web apps and teach them step by step — free courses at cuongthai.com"</em>.</p>

<h3>Your website at the centre</h3>
${slide('cr-01', 13, 'Website là trung tâm — mọi kênh dẫn về')}
<p>Platforms are rented land. They change features, rules and reach every year, and none of them lets you take your audience with you. Your website is the only place you own. The <strong>hub-and-spoke</strong> model (mô hình trung tâm – nan hoa) makes every platform a road that leads home:</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Spokes</span><span class="lz-t">TikTok · Reels · Shorts</span><span class="lz-d">Strangers discover you. Link in bio.</span></div>
<div class="lz-layer"><span class="lz-k">Spokes</span><span class="lz-t">YouTube long videos</span><span class="lz-d">Viewers come to trust you. Links in the description and pinned comment to the matching course or article.</span></div>
<div class="lz-layer"><span class="lz-k">Spokes</span><span class="lz-t">Facebook · LinkedIn</span><span class="lz-d">Community and professional contacts. Share each new lesson or article.</span></div>
<div class="lz-layer"><span class="lz-k">Hub</span><span class="lz-t">cuongthai.com</span><span class="lz-d">Courses, articles, the Pro plan — where a viewer becomes a learner. Chapter 23 builds the full funnel, and Chapter 21 shows how to track which platform sends visitors.</span></div>
</div>

<div class="pitfall co-tieu-de"><p><strong>Trap — a different name on every platform.</strong> "cuong.dev" here, "CuongHoang_03" there, a nickname somewhere else. A viewer who likes you on TikTok cannot find you on YouTube, and the connection is lost.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Trap — building only on rented land.</strong> Thousands of followers on one platform and no way to reach them if that platform changes. Always give people a reason and a link to come to your own website.</p></div>

<h3>🎬 Practice (30 minutes)</h3>
<div class="callout ok"><ol>
<li>Write your 3–4 pillars, each with three video ideas, into <code>/creator/ideas</code>.</li>
<li>Choose your handle and check it on YouTube, TikTok, Facebook and Instagram.</li>
<li>Pick one profile photo and write one bio in Vietnamese and one in English, both with the link.</li>
<li>Update your two starting platforms (from Lesson 1.1) with the same name, photo, bio and link.</li>
</ol><p><strong>Done when:</strong> at least nine ideas sorted into pillars, and two live profiles with the same name, photo, bio and a working link to cuongthai.com.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Personal brand</span><span class="v">What people expect when they see your name.</span></div>
  <div class="kv"><span class="k">Content pillar</span><span class="v">One of the few recurring kinds of video your channel makes.</span></div>
  <div class="kv"><span class="k">Handle</span><span class="v">Your @username on a platform.</span></div>
  <div class="kv"><span class="k">Hub and spoke</span><span class="v">A model where every platform (spoke) leads to one owned home (hub).</span></div>
  <div class="kv"><span class="k">Link in bio</span><span class="v">The single link on a short-video profile — make it point home.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Three or four pillars; every video belongs to exactly one.</li>
  <li>Same handle, photo, bio, colours, font and link everywhere.</li>
  <li>Platforms are rented; your website is owned — every spoke leads to the hub.</li>
</ul>
<div class="link-card"><a href="https://fonts.google.com/specimen/Be+Vietnam+Pro" target="_blank" rel="noopener">Google Fonts — Be Vietnam Pro (a free font designed for Vietnamese)</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.4</span>
<h2>Thương hiệu cá nhân là một lời hứa được lặp lại tới khi người ta chờ đợi nó</h2>
<p class="lead">Bạn không cần logo mới có thương hiệu. Thương hiệu của bạn là thứ người xem chờ đợi khi thấy tên bạn: chủ đề, giọng điệu, chất lượng. Bài này biến ngách của bạn thành ba bốn trụ cột nội dung, làm nhận diện đồng nhất trên mọi nền tảng, và nối mọi thứ về nơi duy nhất thuộc về bạn — cuongthai.com.</p>

<h3>Trụ cột nội dung</h3>
${slide('cr-01', 11, 'Trụ cột nội dung — 3 đến 4 cột')}
<p><strong>Content pillars</strong> (trụ cột nội dung) là ba bốn kiểu video lặp lại mà kênh của bạn làm. Chúng cho người xem một kỳ vọng rõ ràng, và cho bạn một nguồn ý tưởng không cạn. Với ngách của bạn:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Dạy</span><span class="v">Hướng dẫn từng bước, sửa lỗi thật, giải thích khái niệm bằng sơ đồ.</span></div>
  <div class="kv"><span class="k">Hành trình</span><span class="v">Build in public cuongthai.com — tính năng, thất bại, điều học được.</span></div>
  <div class="kv"><span class="k">Hậu trường</span><span class="v">Vlog học tập, cách bạn lên kế hoạch một tuần, một ngày ở FPTU.</span></div>
  <div class="kv"><span class="k">Công cụ</span><span class="v">Review thật lòng những công cụ bạn thật sự dùng cho code và cho video.</span></div>
</div>
<p>Mỗi video thuộc về đúng một trụ cột. Ý tưởng nào không khớp cột nào thì hoặc là một cột mới bạn chủ động thêm — hoặc là thứ làm bạn phân tán.</p>

<h3>Một nhận diện ở mọi nơi</h3>
${slide('cr-01', 12, 'Nhận diện đồng nhất trên mọi nền tảng')}
<table>
  <tr><th>Thành phần</th><th>Làm thế nào</th></tr>
  <tr><td>Tên / handle</td><td>Cùng một @handle ở mọi nơi nếu còn trống; nếu không, thêm cùng một hậu tố trên mọi nền tảng. Người ta tìm bạn bằng tên.</td></tr>
  <tr><td>Ảnh đại diện</td><td>Cùng một ảnh mặt rõ ràng trên nền gọn, nhìn được ở cỡ thumbnail.</td></tr>
  <tr><td>Bio</td><td>Một câu: bạn giúp ai làm gì — cộng đường link về website.</td></tr>
  <tr><td>Màu và font</td><td>Hai màu chính và một font có đủ dấu tiếng Việt (ví dụ <strong>Be Vietnam Pro</strong>, miễn phí trên Google Fonts), dùng lại ở thumbnail và chữ trên video.</td></tr>
  <tr><td>Đường link</td><td>Mọi hồ sơ trỏ về cùng một trang trên cuongthai.com.</td></tr>
</table>
<p>Ví dụ bio tiếng Việt và tiếng Anh: <em>"Mình dựng web thật và dạy lại từng bước cho sinh viên IT — khoá học miễn phí tại cuongthai.com"</em> / <em>"I build real web apps and teach them step by step — free courses at cuongthai.com"</em>.</p>

<h3>Website của bạn ở trung tâm</h3>
${slide('cr-01', 13, 'Website là trung tâm — mọi kênh dẫn về')}
<p>Các nền tảng là đất thuê. Họ đổi tính năng, luật và độ phủ mỗi năm, và không nơi nào cho bạn mang khán giả đi theo. Website là nơi duy nhất bạn sở hữu. Mô hình <strong>hub-and-spoke</strong> (trung tâm – nan hoa) biến mỗi nền tảng thành một con đường dẫn về nhà:</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Nan hoa</span><span class="lz-t">TikTok · Reels · Shorts</span><span class="lz-d">Người lạ khám phá ra bạn. Link trong bio.</span></div>
<div class="lz-layer"><span class="lz-k">Nan hoa</span><span class="lz-t">Video dài YouTube</span><span class="lz-d">Người xem bắt đầu tin bạn. Link ở phần mô tả và bình luận ghim, trỏ tới khoá học hoặc bài viết tương ứng.</span></div>
<div class="lz-layer"><span class="lz-k">Nan hoa</span><span class="lz-t">Facebook · LinkedIn</span><span class="lz-d">Cộng đồng và quan hệ nghề nghiệp. Chia sẻ mỗi bài học, bài viết mới.</span></div>
<div class="lz-layer"><span class="lz-k">Trung tâm</span><span class="lz-t">cuongthai.com</span><span class="lz-d">Khoá học, bài viết, gói Pro — nơi người xem trở thành người học. Chương 23 dựng trọn phễu, và Chương 21 chỉ cách đo nền tảng nào gửi người tới.</span></div>
</div>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — mỗi nền tảng một cái tên.</strong> Chỗ này "cuong.dev", chỗ kia "CuongHoang_03", nơi khác một biệt danh. Người xem thích bạn trên TikTok không tìm được bạn trên YouTube, và mối nối bị đứt.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — chỉ xây trên đất thuê.</strong> Hàng nghìn người theo dõi trên một nền tảng mà không có cách nào liên lạc lại nếu nền tảng đó thay đổi. Luôn cho người ta một lý do và một đường link để về website của chính bạn.</p></div>

<h3>🎬 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Viết 3–4 trụ cột, mỗi cột ba ý tưởng video, vào <code>/creator/ideas</code>.</li>
<li>Chọn handle và kiểm nó trên YouTube, TikTok, Facebook và Instagram.</li>
<li>Chọn một ảnh đại diện và viết một bio tiếng Việt, một bio tiếng Anh, cả hai có đường link.</li>
<li>Cập nhật hai nền tảng khởi đầu (từ Bài 1.1) với cùng tên, ảnh, bio và link.</li>
</ol><p><strong>Đạt khi:</strong> có ít nhất chín ý tưởng đã xếp vào trụ cột, và hai hồ sơ đang chạy có cùng tên, ảnh, bio và đường link hoạt động về cuongthai.com.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Personal brand</span><span class="v">Thương hiệu cá nhân — điều người ta chờ đợi khi thấy tên bạn.</span></div>
  <div class="kv"><span class="k">Content pillar</span><span class="v">Trụ cột nội dung — một trong vài kiểu video lặp lại của kênh.</span></div>
  <div class="kv"><span class="k">Handle</span><span class="v">Tên @ của bạn trên một nền tảng.</span></div>
  <div class="kv"><span class="k">Hub and spoke</span><span class="v">Trung tâm – nan hoa: mỗi nền tảng (nan hoa) dẫn về một ngôi nhà bạn sở hữu (trung tâm).</span></div>
  <div class="kv"><span class="k">Link in bio</span><span class="v">Đường link duy nhất trên hồ sơ video ngắn — hãy trỏ nó về nhà.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Ba bốn trụ cột; mỗi video thuộc đúng một cột.</li>
  <li>Cùng handle, ảnh, bio, màu, font và đường link ở mọi nơi.</li>
  <li>Nền tảng là đất thuê; website là đất của bạn — nan hoa nào cũng dẫn về trung tâm.</li>
</ul>
<div class="link-card"><a href="https://fonts.google.com/specimen/Be+Vietnam+Pro" target="_blank" rel="noopener">Google Fonts — Be Vietnam Pro (font miễn phí thiết kế cho tiếng Việt)</a></div>
</div>
`,
    },

    /* ─────────────────── 1.5 kiểm tra ─────────────────── */
    {
      title: '1.5 — Chapter 1 check|||1.5 — Kiểm tra chương 1',
      slug: 'cr-01-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu tình huống về nền tảng, hệ thống đề xuất, ngách, khán giả và thương hiệu.',
      content: `
<div class="ml-en">
<h2>📝 Chapter 1 — summary and self-check</h2>
<ul>
  <li><strong>Platforms:</strong> YouTube = search + recommendations and long life; TikTok = discovery; Facebook = the largest Vietnamese audience and community; Instagram = visual portfolio, stronger internationally. One job each; start with two.</li>
  <li><strong>Recommendations:</strong> YouTube uses clicks, watch time, survey-based valued watchtime, shares, likes and dislikes; TikTok uses interactions, video information and settings — follower count is not a direct factor.</li>
  <li><strong>Niche:</strong> where what you know, what people need and what you can keep doing overlap; write for one persona.</li>
  <li><strong>Brand:</strong> 3–4 pillars, one identity everywhere, every platform leading to cuongthai.com.</li>
</ul>
<p><strong>Before the quiz:</strong> is your YouTube account verified, is your niche one sentence long, and do your two starting profiles share the same name, photo, bio and link?</p>
</div>
<div class="ml-vi">
<h2>📝 Chương 1 — tóm tắt và tự kiểm</h2>
<ul>
  <li><strong>Nền tảng:</strong> YouTube = tìm kiếm + đề xuất và sống lâu; TikTok = được khám phá; Facebook = khán giả Việt lớn nhất và cộng đồng; Instagram = hồ sơ hình ảnh, mạnh hơn ở quốc tế. Mỗi nơi một việc; bắt đầu với hai nơi.</li>
  <li><strong>Đề xuất:</strong> YouTube dùng cú bấm, thời lượng xem, "valued watchtime" qua khảo sát, chia sẻ, like và dislike; TikTok dùng tương tác, thông tin video và cài đặt — số follower không phải yếu tố trực tiếp.</li>
  <li><strong>Ngách:</strong> chỗ giao của thứ bạn biết, thứ người ta cần và thứ bạn làm được lâu; viết cho một chân dung khán giả.</li>
  <li><strong>Thương hiệu:</strong> 3–4 trụ cột, một nhận diện ở mọi nơi, mọi nền tảng dẫn về cuongthai.com.</li>
</ul>
<p><strong>Trước khi làm bài:</strong> tài khoản YouTube đã xác minh chưa, ngách đã gói trong một câu chưa, và hai hồ sơ khởi đầu có cùng tên, ảnh, bio, link chưa?</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'You want to upload a 25-minute coding tutorial to a brand-new YouTube account. What must you do first?|||Bạn muốn tải một video dạy code 25 phút lên một tài khoản YouTube mới toanh. Phải làm gì trước?',
            options: ['Nothing — any length is allowed|||Không cần gì — độ dài nào cũng được', 'Split it into two Shorts|||Cắt thành hai Shorts', 'Verify the account, because unverified accounts are limited to 15 minutes|||Xác minh tài khoản, vì tài khoản chưa xác minh bị giới hạn 15 phút', 'Upload it to Facebook instead|||Đăng lên Facebook thay thế'],
            correctIndex: 2,
            points: 1,
            explanation: 'YouTube Help: by default uploads can be up to 15 minutes; verified accounts can upload up to 12 hours or 256 GB. Shorts are capped at 3 minutes, so splitting would not work either.|||YouTube Help: mặc định video tải lên tối đa 15 phút; tài khoản đã xác minh được tới 12 giờ hoặc 256 GB. Shorts giới hạn 3 phút, nên cắt đôi cũng không được.',
          },
          {
            question: 'Which platform should do the job of "letting strangers discover you quickly"?|||Nền tảng nào nên đảm nhận việc "để người lạ khám phá ra bạn thật nhanh"?',
            options: ['TikTok / Reels / Shorts|||TikTok / Reels / Shorts', 'Your website|||Website của bạn', 'LinkedIn|||LinkedIn', 'Email newsletters|||Bản tin email'],
            correctIndex: 0,
            points: 1,
            explanation: 'Short-form feeds show videos to people who do not follow you yet. Long YouTube videos build trust, and the website is the home everything points to.|||Các luồng video ngắn đưa video tới người chưa theo dõi bạn. Video dài YouTube xây niềm tin, còn website là ngôi nhà mọi thứ trỏ về.',
          },
          {
            question: 'According to YouTube’s own blog (2021), which signal is NOT one it listed for recommendations?|||Theo blog chính thức của YouTube (2021), tín hiệu nào KHÔNG nằm trong danh sách họ nêu cho hệ thống đề xuất?',
            options: ['Survey responses about whether a video was worth it|||Câu trả lời khảo sát video có đáng xem không', 'Watch time|||Thời lượng xem', 'Shares|||Lượt chia sẻ', 'How many hashtags the video has|||Số lượng hashtag của video'],
            correctIndex: 3,
            points: 1,
            explanation: 'The post lists clicks, watch time, survey-based valued watchtime, shares, likes and dislikes. Hashtags are not a ranking lever — and more than 60 of them makes YouTube ignore all hashtags on the video.|||Bài viết liệt kê cú bấm, thời lượng xem, "valued watchtime" qua khảo sát, chia sẻ, like và dislike. Hashtag không phải cần gạt xếp hạng — và hơn 60 hashtag thì YouTube bỏ qua toàn bộ hashtag của video.',
          },
          {
            question: 'A friend says: "TikTok only pushes accounts that already have many followers." What does TikTok’s own explanation say?|||Bạn của bạn nói: "TikTok chỉ đẩy tài khoản đã có nhiều follower." Giải thích chính thức của TikTok nói gì?',
            options: ['It is true — followers are the main factor|||Đúng — follower là yếu tố chính', 'Follower count and previous hits are not direct factors in recommendations|||Số follower và video từng nổi không phải yếu tố trực tiếp của hệ thống đề xuất', 'Only verified accounts are recommended|||Chỉ tài khoản xác minh mới được đề xuất', 'TikTok recommends randomly|||TikTok đề xuất ngẫu nhiên'],
            correctIndex: 1,
            points: 1,
            explanation: 'TikTok’s 2020 newsroom post states that neither follower count nor a history of high-performing videos is a direct factor. Interactions — including watching a video to the end — matter most.|||Bài viết năm 2020 trên trang tin của TikTok khẳng định số follower và lịch sử video nổi đều không phải yếu tố trực tiếp. Tương tác — kể cả việc xem hết video — mới quan trọng nhất.',
          },
          {
            question: 'You add 75 hashtags to a YouTube video "to reach more people". What happens according to YouTube’s policy?|||Bạn gắn 75 hashtag vào một video YouTube "để tiếp cận nhiều người hơn". Theo chính sách YouTube, chuyện gì xảy ra?',
            options: ['The video reaches 75 audiences|||Video tới được 75 nhóm khán giả', 'Only the first 3 hashtags count|||Chỉ 3 hashtag đầu được tính', 'YouTube ignores all the hashtags on that video|||YouTube bỏ qua tất cả hashtag của video đó', 'The video is deleted|||Video bị xoá'],
            correctIndex: 2,
            points: 1,
            explanation: 'YouTube’s hashtag policy: more than 60 hashtags and each hashtag on that content is ignored. A few relevant hashtags are enough.|||Chính sách hashtag của YouTube: hơn 60 hashtag thì mọi hashtag của nội dung đó bị bỏ qua. Vài hashtag đúng chủ đề là đủ.',
          },
          {
            question: 'Which niche statement is strongest?|||Câu ngách nào mạnh nhất?',
            options: ['"Technology videos."|||"Video về công nghệ."', '"Whatever is trending this week."|||"Thứ gì đang hot tuần này."', '"Tips for everyone."|||"Mẹo cho tất cả mọi người."', '"Building real web apps step by step for Vietnamese IT students."|||"Dựng web thật từng bước cho sinh viên IT Việt Nam."'],
            correctIndex: 3,
            points: 1,
            explanation: 'It names the topic, the audience and the benefit, so a stranger understands the channel in one sentence. The others are too wide or depend on trends you may not want to keep making.|||Nó nêu chủ đề, khán giả và lợi ích, nên người lạ hiểu kênh trong một câu. Các câu còn lại quá rộng hoặc phụ thuộc trào lưu mà bạn có thể không muốn làm lâu.',
          },
          {
            question: 'Why write an audience persona like "Minh, 20, second-year IT student…"?|||Vì sao nên viết một chân dung khán giả như "Minh, 20 tuổi, sinh viên IT năm hai…"?',
            options: ['It keeps decisions concrete: what to explain, what they search, where they watch|||Nó giữ mọi quyết định cụ thể: giải thích gì, họ tìm gì, họ xem ở đâu', 'Platforms require it before you can post|||Nền tảng yêu cầu trước khi đăng', 'It replaces the need for a niche|||Nó thay cho việc chọn ngách', 'It is only useful for paid ads|||Nó chỉ dùng cho quảng cáo trả phí'],
            correctIndex: 0,
            points: 1,
            explanation: 'Writing for one realistic person makes explanations pitched at the right level and titles written in the words that person types.|||Viết cho một người thật cụ thể giúp lời giải thích đúng trình độ và tiêu đề dùng đúng chữ người đó hay gõ.',
          },
          {
            question: 'You have an idea that fits none of your content pillars. What is the best reaction?|||Bạn có một ý tưởng không thuộc trụ cột nào. Phản ứng tốt nhất là gì?',
            options: ['Post it anyway — more videos are always better|||Cứ đăng — càng nhiều video càng tốt', 'Either add it as a deliberate new pillar or set it aside as a distraction|||Hoặc chủ động thêm thành một trụ cột mới, hoặc gác lại như một thứ làm phân tán', 'Delete all your pillars|||Xoá hết các trụ cột', 'Post it only on Instagram|||Chỉ đăng lên Instagram'],
            correctIndex: 1,
            points: 1,
            explanation: 'Pillars tell viewers what to expect. Adding one should be a decision, not an accident — otherwise the channel stops meaning anything.|||Trụ cột cho người xem biết sẽ nhận được gì. Thêm một cột phải là quyết định có chủ đích, không phải tình cờ — nếu không kênh sẽ không còn mang ý nghĩa gì.',
          },
          {
            question: 'Why should every platform link back to cuongthai.com?|||Vì sao mọi nền tảng nên trỏ về cuongthai.com?',
            options: ['Because platforms pay you for links|||Vì nền tảng trả tiền cho mỗi link', 'Because it makes videos load faster|||Vì nó làm video tải nhanh hơn', 'Because it is required by law|||Vì luật bắt buộc', 'Because platforms are rented land, and the website is the only place you own|||Vì nền tảng là đất thuê, còn website là nơi duy nhất bạn sở hữu'],
            correctIndex: 3,
            points: 1,
            explanation: 'Platforms change rules and reach, and you cannot take followers with you. The website holds your courses and lets viewers become learners on your terms.|||Nền tảng đổi luật và độ phủ, và bạn không mang follower theo được. Website giữ khoá học của bạn và cho người xem trở thành người học theo cách của bạn.',
          },
          {
            question: 'You are starting today with limited time. Which plan is most realistic?|||Bạn bắt đầu hôm nay với quỹ thời gian có hạn. Kế hoạch nào thực tế nhất?',
            options: ['Post daily on all four platforms from day one|||Đăng mỗi ngày trên cả bốn nền tảng từ ngày đầu', 'Wait until you can afford a professional camera|||Đợi tới khi mua được máy quay chuyên nghiệp', 'Start with two platforms (YouTube + TikTok or Facebook), add others when publishing is routine|||Bắt đầu với hai nền tảng (YouTube + TikTok hoặc Facebook), thêm nơi khác khi việc đăng đã thành nếp', 'Only post when a video goes viral|||Chỉ đăng khi có video viral'],
            correctIndex: 2,
            points: 1,
            explanation: 'Two platforms with a steady rhythm beat four half-fed accounts. Consistency of good videos is what compounds.|||Hai nền tảng với nhịp đều thắng bốn tài khoản nuôi dở dang. Sự đều đặn của những video tốt mới là thứ tích luỹ.',
          },
        ],
      },
    },
  ],
};
