/**
 * Content Creator — Chương 26: Số liệu, tăng trưởng & kiếm tiền. Song ngữ EN/VI (.ml-en / .ml-vi).
 * Đọc analytics đúng nghĩa nền tảng đặt ra · vòng lặp cải tiến hằng tuần · cộng đồng · kiếm tiền & phễu về website.
 * ⚠️ KHÔNG backtick trần trong content (dùng &#96;); `${` trong mã mẫu viết \${ ; gạch chéo ngược viết \\
 */
import { gallery, slide } from './_slides.mjs';

const SLIDES = [
  [1, 'Bìa'],
  [2, 'Bản đồ chương'],
  [3, 'Đã học ở đâu — Chương 26 thêm gì'],
  [4, 'Năm chỉ số cốt lõi của YouTube Studio'],
  [5, 'Đọc đồ thị giữ chân: bốn tín hiệu'],
  [6, 'Audience retention theo phân khúc'],
  [7, 'YouTube, TikTok, Meta — cùng việc khác tên'],
  [8, 'Buổi xem số liệu hằng tuần'],
  [9, 'Vòng lặp giả thuyết → thử nghiệm'],
  [10, 'Nhân đôi video vượt trội trên chính kênh bạn'],
  [11, 'Giữ người đã tới — tương tác trực tiếp'],
  [12, 'Mở rộng ra ngoài kênh — và tự bảo vệ mình'],
  [13, 'YouTube Partner Program — hai mức'],
  [14, 'TikTok & Facebook kiếm tiền ở Việt Nam — kiểm 09/2026'],
  [15, 'Phễu: từ video ngắn tới gói Pro'],
  [16, 'Thực hành chương 26'],
];

export default {
  title: 'Chapter 26 — Analytics, growth & monetization|||Chương 26 — Số liệu, tăng trưởng & kiếm tiền',
  description: 'Đọc đúng bảng số liệu đã có sẵn trên YouTube Studio, TikTok Studio và Meta Insights; biến nó thành một vòng lặp cải tiến hằng tuần; giữ cộng đồng đã tới; và hiểu đúng — có kiểm chứng — kiếm tiền và phễu dẫn về cuongthai.com.',
  lessons: [
    /* ─────────────────── 26.0 slide bài giảng ─────────────────── */
    {
      title: '26.0 — Chapter 26 in 16 slides|||26.0 — Chương 26 trong 16 slide',
      slug: 'cr-26-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bức tranh toàn cảnh: năm chỉ số cốt lõi, bốn tín hiệu trên đồ thị giữ chân, vòng lặp cải tiến hằng tuần, cộng đồng, và bảng kiếm tiền ba nền tảng đã kiểm tới 09/2026 — trong 16 slide.',
      content: `
<div class="ml-en"><h2>📑 Chapter 26 in 16 slides</h2>
<p>You already have every dashboard this chapter needs — YouTube Studio, maybe TikTok Studio, maybe Meta Insights. Nobody handed you the map of what is actually on them. These slides draw that map: the five core numbers and where impressions are and are not counted, the four shapes a retention graph can show you, the weekly ritual that turns numbers into decisions, and a monetization table checked against each platform's own page rather than a blog post.</p>
<p>Three slides to remember: <strong>slide 5</strong> (the four retention signals — flat, decline, spike, dip), <strong>slide 9</strong> (change exactly one thing per test, never two), and <strong>slide 14</strong> (what is and is not actually true for creators in Vietnam, as of September 2026).</p></div>
<div class="ml-vi"><h2>📑 Chương 26 trong 16 slide</h2>
<p>Bạn đã có sẵn mọi bảng điều khiển chương này cần — YouTube Studio, có thể cả TikTok Studio, có thể cả Meta Insights. Chưa ai đưa bạn bản đồ thật sự có gì trên đó. Các slide dưới đây vẽ bản đồ đó: năm con số cốt lõi và impression được/không được tính ở đâu, bốn hình dạng một đồ thị giữ chân có thể cho bạn thấy, nghi thức hằng tuần biến số liệu thành quyết định, và một bảng kiếm tiền được đối chiếu với đúng trang của từng nền tảng thay vì một bài blog.</p>
<p>Ba slide cần nhớ: <strong>slide 5</strong> (bốn tín hiệu giữ chân — phẳng, dốc dần, đỉnh, rơi), <strong>slide 9</strong> (mỗi lần thử chỉ đổi đúng một thứ, không bao giờ hai), và <strong>slide 14</strong> (điều gì đúng và điều gì không đúng cho creator ở Việt Nam, tính đến tháng 9/2026).</p></div>
${gallery('cr-26', SLIDES)}
`,
    },

    /* ─────────────────── 26.1 đọc analytics ─────────────────── */
    {
      title: '26.1 — Reading analytics the way platforms define it|||26.1 — Đọc analytics đúng như nền tảng định nghĩa',
      slug: 'cr-26-1-doc-analytics',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Năm chỉ số cốt lõi của YouTube Studio đúng định nghĩa chính thức, bốn tín hiệu trên đồ thị giữ chân, ba phân khúc khán giả, và cách TikTok Studio/Meta Insights nói cùng một điều bằng tên khác.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 26 · Lesson 26.1</span>
<h2>You already learned half this vocabulary — this lesson is where it finally lives in one place</h2>
<p class="lead">Impressions and CTR showed up in Lesson 1.2. The retention graph and "intro drop" showed up in Lesson 3.2. Reading the shape of that curve to fix your edit showed up in Lesson 14.3. Engaged views and Viewed vs. Swiped Away showed up in Lesson 20.4. Nobody made you open the actual report and see where each of those lives, or told you the two pieces nobody mentioned yet: retention segments, and what your other platforms call the same things. That is this lesson.</p>

<h3>What you already know, finally in one place</h3>
${slide('cr-26', 3, 'Đã học ở đâu — Chương 26 thêm gì')}
<p>Every number in this lesson is something a platform has published, not something reverse-engineered from a blog post. Keep that distinction — it matters again in Lesson 26.4, where a wrong number costs you a planning decision, not just a wrong slide.</p>

<h3>Five numbers, defined exactly the way YouTube defines them</h3>
${slide('cr-26', 4, 'Năm chỉ số cốt lõi của YouTube Studio')}
<div class="kv-grid">
  <div class="kv"><span class="k">Impressions</span><span class="v">How many times your thumbnail was shown to viewers on YouTube. Counted only if the thumbnail was visible for more than 1 second and at least 50% of it was on screen.</span></div>
  <div class="kv"><span class="k">CTR (click-through rate)</span><span class="v">How often viewers watched a video after seeing a thumbnail — the number that isolates packaging (title + thumbnail) from everything else.</span></div>
  <div class="kv"><span class="k">Views</span><span class="v">Counted the moment a video starts to play, across every format — long-form, Shorts, live. No minimum watch time (Lesson 20.4 already covered the 24 August 2026 change behind this).</span></div>
  <div class="kv"><span class="k">Watch time</span><span class="v">The total amount of time viewers have spent watching a video — every view added together.</span></div>
  <div class="kv"><span class="k">Average view duration</span><span class="v">Average minutes watched, among people who stayed to watch — calculated from engaged views, not from everyone who merely started the video.</span></div>
</div>
<p>Where an impression counts is oddly specific and worth knowing exactly: YouTube counts it on the homepage (including autoplay), YouTube search, your feeds (subscriptions, trending, history, watch later) and the "Up Next" panel — across computers, TVs, consoles, Android, iPhone and iPad. It does <strong>not</strong> count an impression from an external embed, the mobile website, YouTube Kids, an in-player card or end screen, an email, or a thumbnail visible for under a second or under 50%. That is why an embedded video on a blog post can rack up views without ever moving your impressions number.</p>

<h3>Four signals live inside one retention graph</h3>
${slide('cr-26', 5, 'Đọc đồ thị giữ chân: bốn tín hiệu')}
<p>Lesson 3.2 named the graph and the intro drop. Lesson 14.3 taught you to read a sudden dip versus the normal opening slope. YouTube's own help article groups everything your eye is doing into exactly four named moments: a <strong>flat</strong> stretch means viewers are watching that part start to finish; a <strong>gradual decline</strong> is videos normally "tapering off" over their length — expected, not alarming; a <strong>spike</strong> means people are rewatching, rewinding or sharing that instant; a <strong>dip</strong> means people are abandoning or skipping right there. The report only highlights these automatically on videos at least 60 seconds long with at least 100 views — shorter or newer videos will not show them yet.</p>

<h3>Same graph, split by who is actually watching: Segments</h3>
${slide('cr-26', 6, 'Audience retention theo phân khúc')}
<p>Underneath the graph sits a "Segments" tab (you may need Advanced Mode turned on) that splits the exact same curve three ways: <strong>new viewers vs. returning viewers</strong> tells you whether a video is pulling in strangers or only your existing fans are clicking it; <strong>subscriber vs. non-subscriber</strong> tells you whether the content is escaping the circle of people who already know you; <strong>organic vs. paid traffic</strong> separates anything an ad campaign pulled in from what happened on its own. One counter-intuitive detail worth knowing before it confuses you: the absolute view count for a single segment of a video can exceed the video's total view count, because one viewer can rewatch that exact segment more than once inside a single view.</p>

<h3>YouTube, TikTok, Meta — same question, different name</h3>
${slide('cr-26', 7, 'YouTube, TikTok, Meta — cùng việc khác tên')}
<p>If you are also posting to TikTok or Instagram/Facebook, the good news is you are not learning a second system — you are learning a translation. TikTok Studio (Lesson 20.4 already walked you to <strong>Profile → menu → TikTok Studio → Analytics → Content</strong>) reports <strong>Average Watch Time</strong> and <strong>Completion Rate</strong> where YouTube reports average view duration and the retention graph. Meta's equivalent — <strong>Professional dashboard → Insights</strong>, which requires a Business or Creator account — reports <strong>Reach</strong> (accounts a post was shown to), <strong>accounts engaged</strong> and follower growth, per post rather than as one running graph. There is no Meta metric that maps directly onto "percent of the video watched" the way YouTube's retention graph or TikTok's Completion Rate do.</p>
<p>Where you were found also has a name on YouTube, even though this course has not needed it until now: the <strong>traffic source</strong> report. Beyond the Shorts feed already covered in Lesson 20.4, the main ones for long-form video are <strong>YouTube search</strong> (someone typed the exact words), <strong>Suggested videos</strong> (placed next to something they just watched), <strong>Browse features</strong> (the homepage and subscription feed — YouTube actively pushing your channel outward), <strong>External sources</strong> (a link from outside YouTube), and <strong>Direct or unknown</strong> (typed the URL directly — usually someone who already knows you). There is no "normal" split between them to chase; the point is noticing when one source's share moves.</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — reading a raw view count as if it still means what it meant a year ago.</strong> Lesson 20.4 already covered this in full, but it is worth repeating here because this lesson hands you the replacement habit: since 24 August 2026 a view counts from the first frame with no threshold, so a rising view count no longer proves rising retention on its own. <strong>Engaged views</strong>, average view duration and the retention graph are the numbers that still answer "did people actually watch."</p></div>

<p class="note-ct"><strong>Connects to next:</strong> Lesson 26.2 does not add a single new metric — it takes everything in this lesson and turns it into a ritual you actually run every week, so the numbers change your next video instead of sitting in a tab you forget to open.</p>

<h3>🎬 Practice (20 minutes)</h3>
<div class="callout ok"><ol>
<li>Open YouTube Studio → Analytics → Content tab, on your most recent video. Write down its Impressions, CTR and Average view duration.</li>
<li>Open that video's Audience retention report. Find one stretch that looks flat and one that looks like a dip (not the opening seconds). Write one sentence guessing why for each.</li>
<li>If you have a TikTok or Instagram account, open its equivalent report and write down Average Watch Time/Completion Rate or Reach.</li>
</ol><p><strong>Done when:</strong> three real numbers from your own channel, and two one-sentence guesses about a flat stretch and a dip on the same video.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Impressions</span><span class="v">Times a thumbnail was shown and visible for over 1 second at ≥50% on screen.</span></div>
  <div class="kv"><span class="k">Segments (Audience retention)</span><span class="v">New/returning, subscriber/non-subscriber, organic/paid — the same graph split by viewer group.</span></div>
  <div class="kv"><span class="k">Traffic source</span><span class="v">Where a view came from: search, suggested, browse features, external, direct.</span></div>
  <div class="kv"><span class="k">Reach (Meta)</span><span class="v">Instagram/Facebook's equivalent of impressions — accounts a post was shown to.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Five core numbers, exact definitions: impressions, CTR, views (counts from frame one, no threshold), watch time, average view duration (only counts people who stayed).</li>
  <li>Four retention signals: flat = watched through, gradual decline = normal taper, spike = rewatch/share, dip = abandon — shown only on videos ≥60s with ≥100 views.</li>
  <li>Segments split the same graph by new/returning, subscriber/non, organic/paid viewers.</li>
  <li>TikTok Studio and Meta Insights measure almost the same things under different names — Average Watch Time/Completion Rate, and Reach/accounts engaged.</li>
</ul>
<div class="link-card"><a href="https://support.google.com/youtube/answer/9314486?hl=en" target="_blank" rel="noopener">YouTube Help — Check your thumbnail impressions and watch time</a></div>
<div class="link-card"><a href="https://support.google.com/youtube/answer/9314415?hl=en" target="_blank" rel="noopener">YouTube Help — Measure key moments for audience retention</a></div>
<div class="link-card"><a href="https://support.google.com/youtube/answer/9314355?hl=en" target="_blank" rel="noopener">YouTube Help — Understand your YouTube video reach (traffic sources)</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 26 · Bài 26.1</span>
<h2>Bạn đã học nửa số từ vựng này rồi — bài này là chỗ nó cuối cùng cũng có một mái nhà</h2>
<p class="lead">Impression và CTR xuất hiện ở Bài 1.2. Đồ thị giữ chân và "intro drop" xuất hiện ở Bài 3.2. Đọc hình dạng đường cong đó để sửa cách dựng xuất hiện ở Bài 14.3. Engaged views và Viewed vs. Swiped Away xuất hiện ở Bài 20.4. Chưa ai bắt bạn mở đúng báo cáo và nhìn xem mỗi thứ đó nằm ở đâu, hay nói cho bạn hai mảnh chưa ai nhắc: phân khúc trong Audience retention, và các nền tảng khác gọi đúng những thứ này bằng tên gì. Đó là bài này.</p>

<h3>Đã học ở đâu — giờ gộp lại một chỗ</h3>
${slide('cr-26', 3, 'Đã học ở đâu — Chương 26 thêm gì')}
<p>Mọi con số trong bài này là thứ một nền tảng đã công bố, không phải thứ suy ngược từ một bài blog. Giữ đúng ranh giới này — nó quan trọng trở lại ở Bài 26.4, nơi một con số sai làm hỏng một quyết định lập kế hoạch, chứ không chỉ làm sai một slide.</p>

<h3>Năm con số, đúng định nghĩa của chính YouTube</h3>
${slide('cr-26', 4, 'Năm chỉ số cốt lõi của YouTube Studio')}
<div class="kv-grid">
  <div class="kv"><span class="k">Impressions (lượt hiển thị)</span><span class="v">Số lần thumbnail được cho hiện ra trước người xem trên YouTube. Chỉ tính khi thumbnail hiện quá 1 giây và ít nhất 50% khung hình lọt màn hình.</span></div>
  <div class="kv"><span class="k">CTR (tỉ lệ nhấp)</span><span class="v">Bao nhiêu lần người xem đã bấm vào video sau khi thấy thumbnail — con số tách riêng phần đóng gói (tiêu đề + thumbnail) khỏi mọi thứ khác.</span></div>
  <div class="kv"><span class="k">Views (lượt xem)</span><span class="v">Tính ngay khi video bắt đầu phát, ở mọi định dạng — video dài, Shorts, livestream. Không còn ngưỡng thời gian tối thiểu (Bài 20.4 đã nói kỹ về thay đổi 24/08/2026 đứng sau con số này).</span></div>
  <div class="kv"><span class="k">Watch time (thời lượng xem)</span><span class="v">Tổng thời gian người xem đã bỏ ra cho video — cộng dồn mọi lượt xem lại với nhau.</span></div>
  <div class="kv"><span class="k">Average view duration</span><span class="v">Số phút xem trung bình, TÍNH TRÊN những người đã Ở LẠI xem — tính từ engaged views, không tính người vừa bấm vào đã thoát.</span></div>
</div>
<p>Chỗ một impression được tính lại cụ thể tới mức đáng nhớ chính xác: YouTube tính nó trên trang chủ (kể cả tự phát), tìm kiếm YouTube, các luồng của bạn (đăng ký, thịnh hành, lịch sử, xem sau) và bảng "Up Next" — trên máy tính, TV, console, Android, iPhone, iPad. Nó <strong>KHÔNG</strong> tính impression từ một embed bên ngoài, trang web di động, YouTube Kids, một thẻ/end screen trong trình phát, email, hay một thumbnail hiện dưới một giây hoặc dưới 50%. Đó là lý do một video nhúng trong bài blog có thể tích luỹ lượt xem mà không hề động tới con số impression của bạn.</p>

<h3>Bốn tín hiệu nằm trong đúng MỘT đồ thị giữ chân</h3>
${slide('cr-26', 5, 'Đọc đồ thị giữ chân: bốn tín hiệu')}
<p>Bài 3.2 đã gọi tên đồ thị và cú "intro drop". Bài 14.3 đã dạy bạn phân biệt một cú rơi đột ngột với độ dốc mở đầu bình thường. Bài trợ giúp chính thức của YouTube gộp mọi thứ mắt bạn đang làm thành đúng bốn khoảnh khắc có tên: một đoạn <strong>phẳng</strong> nghĩa là người xem đang xem trọn đoạn đó từ đầu tới cuối; một <strong>dốc dần</strong> là chuyện video "taper off" (giảm dần) theo thời lượng — bình thường, không đáng báo động; một <strong>đỉnh</strong> nghĩa là người ta đang xem lại, tua lại, hoặc chia sẻ đúng khoảnh khắc đó; một <strong>rơi</strong> nghĩa là người ta bỏ ngang hoặc tua qua đúng chỗ đó. Báo cáo chỉ tự động tô các mốc này trên video dài ít nhất 60 giây và có ít nhất 100 lượt xem — video ngắn hơn hoặc quá mới sẽ chưa hiện.</p>

<h3>Cùng một đồ thị, tách theo đúng NGƯỜI đang xem: Segments</h3>
${slide('cr-26', 6, 'Audience retention theo phân khúc')}
<p>Bên dưới đồ thị có một tab "Segments" (có thể cần bật Advanced Mode) tách đúng cùng một đường cong theo ba cách: <strong>người xem mới ↔ quay lại</strong> cho biết video đang kéo được người lạ hay chỉ fan cũ đang bấm vào; <strong>đã đăng ký ↔ chưa đăng ký</strong> cho biết nội dung có đang thoát ra khỏi vòng người đã biết bạn không; <strong>tự nhiên ↔ có trả tiền</strong> tách phần do một chiến dịch quảng cáo kéo tới khỏi phần tự đến. Một chi tiết ngược trực giác đáng biết trước khi nó làm bạn bối rối: số lượt xem tuyệt đối của MỘT đoạn có thể VƯỢT tổng lượt xem cả video — vì một người xem có thể xem lại đúng đoạn đó nhiều lần trong một lượt xem duy nhất.</p>

<h3>YouTube, TikTok, Meta — cùng một câu hỏi, khác tên gọi</h3>
${slide('cr-26', 7, 'YouTube, TikTok, Meta — cùng việc khác tên')}
<p>Nếu bạn cũng đăng lên TikTok hoặc Instagram/Facebook, tin tốt là bạn không phải học một hệ thống thứ hai — bạn chỉ đang học một bản dịch. TikTok Studio (Bài 20.4 đã dẫn bạn tới đúng <strong>Profile → menu → TikTok Studio → Analytics → Content</strong>) báo cáo <strong>Average Watch Time</strong> và <strong>Completion Rate</strong> ở chỗ YouTube báo cáo average view duration và đồ thị giữ chân. Phía tương đương của Meta — <strong>Professional dashboard → Insights</strong>, cần tài khoản Business hoặc Creator — báo cáo <strong>Reach</strong> (số tài khoản một bài đăng đã hiện tới), <strong>accounts engaged</strong> và mức tăng follower, theo TỪNG bài đăng chứ không phải một đồ thị chạy liên tục. Không có chỉ số nào của Meta ánh xạ thẳng sang "xem hết bao nhiêu phần trăm video" như đồ thị giữ chân của YouTube hay Completion Rate của TikTok.</p>
<p>Nơi bạn được tìm thấy cũng có tên trên YouTube, dù khoá học chưa cần dùng tới cho đến giờ: báo cáo <strong>traffic source</strong> (nguồn lưu lượng). Ngoài luồng Shorts đã nói ở Bài 20.4, những nguồn chính cho video dài là <strong>YouTube search</strong> (người ta tự gõ đúng từ), <strong>Suggested videos</strong> (được đặt cạnh thứ họ vừa xem xong), <strong>Browse features</strong> (trang chủ và luồng đăng ký — YouTube đang chủ động đẩy kênh bạn ra ngoài), <strong>External sources</strong> (link từ ngoài YouTube), và <strong>Direct or unknown</strong> (tự gõ thẳng URL — thường là người đã biết bạn). Không có một tỉ lệ "chuẩn" nào giữa các nguồn để mà đuổi theo; điều đáng để ý là khi tỉ trọng của MỘT nguồn nào đó thay đổi.</p>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — đọc lượt view thô như thể nó vẫn có nghĩa như một năm trước.</strong> Bài 20.4 đã nói kỹ điều này, nhưng đáng nhắc lại ở đây vì bài này trao cho bạn thói quen thay thế: từ 24/08/2026 một view tính ngay từ khung hình đầu, không ngưỡng, nên view thô tăng không còn tự nó chứng minh giữ chân tăng. <strong>Engaged views</strong>, average view duration và đồ thị giữ chân mới là những con số còn trả lời được "người ta có thật sự xem không."</p></div>

<p class="note-ct"><strong>Nối với bài sau:</strong> Bài 26.2 không thêm một chỉ số mới nào — nó lấy mọi thứ trong bài này và biến thành một nghi thức bạn THẬT SỰ chạy mỗi tuần, để số liệu thay đổi video kế tiếp của bạn thay vì nằm im trong một tab bạn quên mở.</p>

<h3>🎬 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
<li>Mở YouTube Studio → Analytics → tab Nội dung, ở video gần nhất của bạn. Ghi lại Impressions, CTR và Average view duration.</li>
<li>Mở báo cáo Audience retention của video đó. Tìm một đoạn trông "phẳng" và một đoạn trông như "rơi" (không phải mấy giây đầu). Viết một câu đoán vì sao cho mỗi đoạn.</li>
<li>Nếu có tài khoản TikTok hoặc Instagram, mở báo cáo tương đương và ghi lại Average Watch Time/Completion Rate hoặc Reach.</li>
</ol><p><strong>Đạt khi:</strong> có ba con số thật từ kênh của bạn, và hai câu đoán về một đoạn phẳng và một đoạn rơi trên cùng một video.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Impressions</span><span class="v">Số lần thumbnail hiện ra và được thấy quá 1 giây, ≥50% lọt màn hình.</span></div>
  <div class="kv"><span class="k">Segments (Audience retention)</span><span class="v">Mới/quay lại, đã đăng ký/chưa, tự nhiên/trả tiền — cùng một đồ thị tách theo nhóm người xem.</span></div>
  <div class="kv"><span class="k">Traffic source (nguồn lưu lượng)</span><span class="v">Nơi một lượt xem tới từ: tìm kiếm, đề xuất, trang chủ, bên ngoài, trực tiếp.</span></div>
  <div class="kv"><span class="k">Reach (Meta)</span><span class="v">Chỉ số tương đương impression của Instagram/Facebook — số tài khoản một bài đăng đã hiện tới.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Năm con số cốt lõi, đúng định nghĩa: impressions, CTR, views (tính từ khung hình đầu, không ngưỡng), watch time, average view duration (chỉ tính người ở lại).</li>
  <li>Bốn tín hiệu giữ chân: phẳng = xem trọn, dốc dần = giảm bình thường, đỉnh = xem lại/chia sẻ, rơi = bỏ ngang — chỉ hiện trên video ≥60s và ≥100 view.</li>
  <li>Segments tách cùng một đồ thị theo người xem mới/quay lại, đã đăng ký/chưa, tự nhiên/trả tiền.</li>
  <li>TikTok Studio và Meta Insights đo gần như cùng một thứ dưới tên khác — Average Watch Time/Completion Rate, và Reach/accounts engaged.</li>
</ul>
<div class="link-card"><a href="https://support.google.com/youtube/answer/9314486?hl=en" target="_blank" rel="noopener">YouTube Help — Kiểm impression và watch time của thumbnail</a></div>
<div class="link-card"><a href="https://support.google.com/youtube/answer/9314415?hl=en" target="_blank" rel="noopener">YouTube Help — Đo các khoảnh khắc chính của audience retention</a></div>
<div class="link-card"><a href="https://support.google.com/youtube/answer/9314355?hl=en" target="_blank" rel="noopener">YouTube Help — Hiểu độ tiếp cận video YouTube (nguồn lưu lượng)</a></div>
</div>
`,
    },

    /* ─────────────────── 26.2 vòng lặp cải tiến ─────────────────── */
    {
      title: '26.2 — The weekly improvement loop|||26.2 — Vòng lặp cải tiến hằng tuần',
      slug: 'cr-26-2-vong-lap-cai-tien',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Một buổi xem số liệu cố định mỗi tuần, vòng lặp giả thuyết — thay đổi một thứ — thử nghiệm, và nhân đôi video vượt trội trên chính kênh bạn thay vì kênh người khác.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 26 · Lesson 26.2</span>
<h2>Numbers you never revisit do not improve anything — turn Lesson 26.1 into a ritual</h2>
<p class="lead">Every metric from the last lesson is useless sitting in a browser tab you open once and forget. This lesson gives that vocabulary a fixed appointment, a repeatable loop for turning an observation into a real test, and the one move — reapplying Lesson 2.1's outlier method to your own channel — most beginners never think to try.</p>

<h3>Put it on the calendar, not on "whenever I remember"</h3>
${slide('cr-26', 8, 'Buổi xem số liệu hằng tuần')}
<p>Lesson 2.3 already gave you a realistic weekly rhythm for a student: batch-shoot once, post one long video, post two to three shorts. Add exactly one fixed slot to that rhythm — 30 to 45 minutes, on the same day every week, <strong>after</strong> that week's posting is done, not squeezed in beforehand. The point is not to admire the view counter. It is to walk in with three specific questions and walk out with an answer to each: is CTR holding up, where exactly is the graph dropping, and did any traffic source's share move?</p>

<h3>The loop: observation → hypothesis → one change → new video → compare</h3>
${slide('cr-26', 9, 'Vòng lặp giả thuyết → thử nghiệm')}
<p>This is the actual mechanism behind "reading analytics." You <strong>observe</strong> using exactly the numbers from Lesson 26.1 — a CTR that dropped, a dip at a specific point, a traffic source that shrank. You write <strong>one</strong> sentence of hypothesis for why, not a list of five possible causes. You change <strong>exactly one variable</strong> in the next video — the hook, the thumbnail, the length, nothing else. You make that video keeping everything else the same as your normal upload. Then you compare: did the number move in the direction your hypothesis predicted?</p>
<p>A worked example, illustrative rather than a real recorded case: Cường's weekly review shows CTR sitting at 3% this week against a usual 6%, while average view duration is unchanged. <strong>Observation:</strong> the click problem is new, the watch problem is not — so the cause is almost certainly packaging, not content. <strong>Hypothesis (one sentence):</strong> "the thumbnail looks too similar to the last three uploads, so it no longer stands out in a subscriber's feed." <strong>The one variable changed:</strong> a new thumbnail style for the next video — same title format, same upload day, same length as always. <strong>Compare next week:</strong> if CTR climbs back toward 6%, the hypothesis held; if it does not move, the real cause is still out there, and the next hypothesis has to be a different one sentence, not a second simultaneous change layered on top of the first.</p>
<div class="callout warn"><p><strong>Change two things at once — a new thumbnail and a shorter runtime, say — and the experiment is dead on arrival.</strong> A view increase tells you nothing about which change caused it, or whether both did, or neither. This is not a minor shortcut; it is the difference between an experiment and a guess wearing a lab coat. Slow and certain beats fast and blind — and growing slowly but consistently is the <strong>normal</strong> outcome of running this loop, not a sign it is failing.</p></div>

<h3>Nhân đôi video vượt trội — the same method as Lesson 2.1, aimed at yourself</h3>
${slide('cr-26', 10, 'Nhân đôi video vượt trội trên chính kênh bạn')}
<p>Lesson 2.1 taught the outlier method for finding ideas on someone else's channel: sort their Videos tab by most popular, notice the one that sits far above the channel's normal range, then ask <em>why</em> before copying anything. Run the exact same method on your own channel during the weekly review. Sort your own Videos tab by most popular. When one video sits well above your usual 3,000-ish views, do not assume you know why — ask whether it was the topic, the title, a specific angle, or timing, the same four questions Lesson 2.1 taught. Only then plan the next video in that direction. An outlier on your own channel is proof of demand you have already earned once; wasting it by copying the surface (just the thumbnail style, say) instead of the reason is the same mistake Lesson 2.1 already warned about, just turned inward.</p>

<p class="note-ct"><strong>Connects to next:</strong> Lesson 26.3 covers the side of growth this loop does not measure directly — comments, community posts, collaborations — the relationships that decide whether a one-time viewer becomes the "returning viewer" segment from Lesson 26.1.</p>

<h3>🎬 Practice (15 minutes)</h3>
<div class="callout ok"><ol>
<li>Pick a fixed day and time for your weekly review and add it to /creator/calendar or your own calendar, starting next week.</li>
<li>Using the three numbers from Lesson 26.1's practice, write exactly one hypothesis sentence and name the single variable you will change for your next video.</li>
<li>Sort your channel's Videos tab by most popular. If one video clearly outperforms your normal range, write one sentence guessing why.</li>
</ol><p><strong>Done when:</strong> a recurring calendar slot exists, one hypothesis names exactly one variable to change, and — if you have an outlier — one written guess about why it worked.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Weekly review</span><span class="v">A fixed, recurring slot for reading analytics with specific questions, not idle scrolling.</span></div>
  <div class="kv"><span class="k">Hypothesis</span><span class="v">One sentence naming a likely cause, tested by changing exactly one variable.</span></div>
  <div class="kv"><span class="k">Outlier (on your own channel)</span><span class="v">A video far above your channel's normal view range — Lesson 2.1's method, applied to yourself.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>One fixed weekly slot, after posting is done, answering three questions: CTR, where retention drops, which traffic source moved.</li>
<li>The loop is observe → one-sentence hypothesis → change exactly one variable → new video → compare — changing two things at once destroys the experiment.</li>
<li>Slow, steady growth from this loop is normal, not a failure signal.</li>
<li>Apply Lesson 2.1's outlier method to your own Videos tab, sorted by most popular, and ask why before copying anything.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 26 · Bài 26.2</span>
<h2>Số liệu không bao giờ xem lại thì chẳng cải thiện được gì — biến Bài 26.1 thành một nghi thức</h2>
<p class="lead">Mọi chỉ số ở bài trước đều vô dụng nếu chỉ nằm trong một tab trình duyệt bạn mở một lần rồi quên. Bài này cho vốn từ đó một cuộc hẹn cố định, một vòng lặp lặp lại được để biến một quan sát thành một phép thử thật sự, và đúng một nước đi — áp lại phương pháp video vượt trội của Bài 2.1 lên chính kênh mình — mà hầu hết người mới không bao giờ nghĩ tới.</p>

<h3>Đặt vào lịch, đừng để "lúc nào rảnh thì xem"</h3>
${slide('cr-26', 8, 'Buổi xem số liệu hằng tuần')}
<p>Bài 2.3 đã cho bạn một nhịp tuần thực tế cho sinh viên: quay dồn một lần, đăng một video dài, đăng hai tới ba video ngắn. Thêm đúng một khung giờ cố định vào nhịp đó — 30 tới 45 phút, cùng một ngày mỗi tuần, SAU khi tuần đó đã đăng xong, không phải chen vào trước. Mục đích không phải để ngắm bộ đếm lượt xem. Mà là bước vào với ba câu hỏi cụ thể và bước ra với câu trả lời cho từng câu: CTR có ổn không, đồ thị rớt đúng ở đâu, và có nguồn lưu lượng nào đổi tỉ trọng không?</p>

<h3>Vòng lặp: quan sát → giả thuyết → đổi một thứ → video mới → so sánh</h3>
${slide('cr-26', 9, 'Vòng lặp giả thuyết → thử nghiệm')}
<p>Đây là cơ chế thật sự đứng sau "đọc analytics." Bạn <strong>quan sát</strong> bằng đúng các con số ở Bài 26.1 — một CTR vừa giảm, một chỗ rơi cụ thể trên đồ thị, một nguồn lưu lượng vừa co lại. Bạn viết <strong>đúng một câu</strong> giả thuyết vì sao, không phải một danh sách năm nguyên nhân có thể. Bạn đổi <strong>đúng một biến</strong> trong video kế tiếp — hook, thumbnail, độ dài, không gì khác. Bạn làm video đó, giữ mọi thứ còn lại giống hệt video bình thường của mình. Rồi so sánh: con số có đổi đúng hướng giả thuyết đã đoán không?</p>
<p>Một ví dụ minh hoạ, không phải một trường hợp ghi nhận thật: buổi xem số liệu tuần này của Cường cho thấy CTR chỉ còn 3%, so với mức thường 6%, trong khi average view duration không đổi. <strong>Quan sát:</strong> vấn đề bấm là MỚI, vấn đề xem thì không — nên nguyên nhân gần như chắc chắn nằm ở đóng gói, không phải nội dung. <strong>Giả thuyết (một câu):</strong> "thumbnail trông quá giống ba video gần nhất, nên không còn nổi bật trong luồng của người đăng ký." <strong>Đúng một biến được đổi:</strong> một kiểu thumbnail mới cho video kế tiếp — vẫn giữ nguyên khuôn tiêu đề, ngày đăng, độ dài như mọi khi. <strong>So sánh tuần sau:</strong> nếu CTR leo lại gần 6%, giả thuyết đúng; nếu không nhúc nhích, nguyên nhân thật vẫn còn ở đó, và giả thuyết kế tiếp phải là một câu KHÁC, không phải chồng thêm một thay đổi thứ hai lên trên thay đổi đầu.</p>
<div class="callout warn"><p><strong>Đổi hai thứ cùng lúc — chẳng hạn vừa đổi thumbnail mới vừa rút ngắn thời lượng — là phép thử chết ngay từ đầu.</strong> Lượt xem tăng lên không nói cho bạn biết thay đổi nào gây ra nó, hay cả hai, hay chẳng cái nào. Đây không phải một đường tắt nhỏ; nó là ranh giới giữa một phép thử thật và một cú đoán mặc áo khoác phòng thí nghiệm. Chậm mà chắc thắng nhanh mà mù — và tăng trưởng chậm nhưng đều đặn từ vòng lặp này là kết quả BÌNH THƯỜNG, không phải dấu hiệu nó đang thất bại.</p></div>

<h3>Nhân đôi video vượt trội — đúng phương pháp Bài 2.1, chĩa vào chính mình</h3>
${slide('cr-26', 10, 'Nhân đôi video vượt trội trên chính kênh bạn')}
<p>Bài 2.1 đã dạy phương pháp video vượt trội để tìm ý tưởng trên kênh NGƯỜI KHÁC: sắp tab Videos của họ theo phổ biến nhất, để ý video nào nằm xa hẳn mức thường của kênh đó, rồi hỏi <em>vì sao</em> trước khi bắt chước bất cứ điều gì. Hãy chạy đúng phương pháp đó lên chính kênh mình trong buổi xem số liệu hằng tuần. Sắp tab Videos của CHÍNH bạn theo phổ biến nhất. Khi một video nằm hẳn trên mức thường khoảng 3.000 view của bạn, đừng vội cho rằng mình đã biết vì sao — hỏi xem đó là do chủ đề, tiêu đề, một góc nhìn cụ thể, hay đúng thời điểm, đúng bốn câu hỏi Bài 2.1 đã dạy. Chỉ sau đó mới lên kế hoạch cho video kế tiếp theo hướng đó. Một video vượt trội trên chính kênh bạn là bằng chứng nhu cầu bạn đã giành được một lần; lãng phí nó bằng cách bắt chước bề mặt (chỉ kiểu thumbnail, chẳng hạn) thay vì lý do thật sự là đúng sai lầm Bài 2.1 đã cảnh báo, chỉ khác là quay vào trong.</p>

<p class="note-ct"><strong>Nối với bài sau:</strong> Bài 26.3 nói về mặt tăng trưởng mà vòng lặp này không đo trực tiếp — bình luận, bài đăng cộng đồng, hợp tác — những mối quan hệ quyết định một người xem một lần có trở thành phân khúc "quay lại" ở Bài 26.1 hay không.</p>

<h3>🎬 Thực hành (15 phút)</h3>
<div class="callout ok"><ol>
<li>Chọn một ngày giờ cố định cho buổi xem số liệu hằng tuần, thêm vào /creator/calendar hoặc lịch cá nhân, bắt đầu từ tuần sau.</li>
<li>Dùng ba con số từ phần thực hành Bài 26.1, viết đúng một câu giả thuyết và gọi tên đúng một biến bạn sẽ đổi cho video kế tiếp.</li>
<li>Sắp tab Videos của kênh bạn theo phổ biến nhất. Nếu có một video vượt hẳn mức thường, viết một câu đoán vì sao.</li>
</ol><p><strong>Đạt khi:</strong> có một khung giờ lặp lại trong lịch, một giả thuyết gọi tên đúng một biến sẽ đổi, và — nếu có video vượt trội — một câu đoán đã viết ra về vì sao nó hiệu quả.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Buổi xem số liệu hằng tuần</span><span class="v">Khung giờ cố định, lặp lại, để đọc analytics với câu hỏi cụ thể — không phải lướt xem vu vơ.</span></div>
  <div class="kv"><span class="k">Giả thuyết</span><span class="v">Một câu gọi tên nguyên nhân có khả năng nhất, được thử bằng cách đổi đúng một biến.</span></div>
  <div class="kv"><span class="k">Video vượt trội (trên chính kênh mình)</span><span class="v">Video nằm xa hẳn mức thường của kênh bạn — phương pháp Bài 2.1, áp lên chính mình.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một khung giờ cố định mỗi tuần, sau khi đã đăng xong, trả lời ba câu hỏi: CTR, đồ thị rớt ở đâu, nguồn lưu lượng nào đổi.</li>
<li>Vòng lặp là quan sát → giả thuyết một câu → đổi đúng một biến → video mới → so sánh — đổi hai thứ cùng lúc là phá hỏng phép thử.</li>
<li>Tăng trưởng chậm, đều đặn từ vòng lặp này là bình thường, không phải dấu hiệu thất bại.</li>
<li>Áp phương pháp video vượt trội của Bài 2.1 lên chính tab Videos của bạn, sắp theo phổ biến nhất, và hỏi vì sao trước khi bắt chước bất cứ điều gì.</li>
</ul>
</div>
`,
    },

    /* ─────────────────── 26.3 cộng đồng ─────────────────── */
    {
      title: '26.3 — Community: keeping the people who showed up|||26.3 — Cộng đồng: giữ người đã tới',
      slug: 'cr-26-3-cong-dong',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Trả lời và ghim bình luận, bài đăng cộng đồng, livestream hỏi đáp, hợp tác creator, danh sách email/nhóm không phụ thuộc thuật toán, và cách xử lý bình luận tiêu cực.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 26 · Lesson 26.3</span>
<h2>None of this shows up on the dashboard — and all of it decides who comes back</h2>
<p class="lead">Lesson 26.1's "returning viewers" segment and Lesson 26.2's weekly loop both measure what already happened. This lesson is about the six ordinary actions that quietly decide whether a stranger who watched once becomes that returning-viewer number next month, or never sees your name again.</p>

<h3>Keeping people who just arrived — right now, not eventually</h3>
${slide('cr-26', 11, 'Giữ người đã tới — tương tác trực tiếp')}
<div class="kv-grid">
  <div class="kv"><span class="k">Reply and pin comments</span><span class="v">Answer real questions in the first hour, not whenever you get around to it. Lesson 1.2 already established that likes, shares and — by the same logic — replies are satisfaction signals platforms read.</span></div>
  <div class="kv"><span class="k">Community posts</span><span class="v">A poll, a behind-the-scenes photo, a teaser for the next video — keeps a channel feeling alive in the gap between uploads instead of going silent for a week.</span></div>
  <div class="kv"><span class="k">Live Q&amp;A</span><span class="v">Meeting an audience in real time. The exact questions people ask out loud are one of Lesson 2.1's eight idea sources — this is where you hear them first-hand.</span></div>
</div>
<p>None of these three shows up as a number in Lesson 26.1's dashboards. That is precisely why a weekly review that only checks CTR and retention will systematically ignore them — put a reminder for these three next to the calendar slot from Lesson 26.2, not inside it.</p>

<h3>Growing outside the channel — and protecting yourself while you do</h3>
${slide('cr-26', 12, 'Mở rộng ra ngoài kênh — và tự bảo vệ mình')}
<div class="kv-grid">
  <div class="kv"><span class="k">Creator collaborations</span><span class="v">A joint video with a channel in your niche — a fair, two-way borrowing of each other's audience, not a one-sided favor.</span></div>
  <div class="kv"><span class="k">Email list or group</span><span class="v">The one channel that does not depend on any algorithm at all. Link it from every video description, the same "hub" logic Lesson 1.4 already built around cuongthai.com.</span></div>
  <div class="kv"><span class="k">Negative comments</span><span class="v">Real criticism deserves a calm, genuine reply — it usually means someone cared enough to watch closely. Harassment or spam gets hidden or blocked. Neither deserves a place in your head afterward.</span></div>
</div>
<p>The email list deserves one extra sentence: it is the only one of these six that a platform cannot suspend, shadow-limit or algorithmically bury overnight. Every other channel in this lesson — comments, Community posts, live Q&amp;A, a collab partner's audience — still runs through someone else's system. An email address does not.</p>
<p>A quick test for which bucket a comment falls into: does it point at something specific in the video — a claim, a step, a choice you made — or does it just attack you? "Your CORS explanation at 4:30 is wrong, it also happens on same-origin requests with credentials" is criticism, even phrased bluntly, and deserves a real reply, ideally with a correction pinned if the person is right. "You clearly do not know anything" with nothing pointing at the video itself is not feedback to weigh — hide it and move on. The test is not tone; it is whether there is something concrete to respond to.</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — treating community work as optional because it is not in the analytics.</strong> Lesson 26.1 gave you exact definitions for impressions, CTR and retention precisely because they are measurable. That does not make the unmeasured half of growth optional — it makes it easy to neglect. A channel with excellent retention and zero replies to comments is still leaking the exact viewers Lesson 26.1's "returning viewers" segment is trying to grow.</p></div>

<p class="note-ct"><strong>Connects to next:</strong> Lesson 26.4 is where growth finally turns into money — and into traffic you can actually count arriving at cuongthai.com, closing the loop this whole chapter has been building toward.</p>

<h3>🎬 Practice (20 minutes)</h3>
<div class="callout ok"><ol>
<li>Open your most recent video's comments. Reply to three real questions or comments, and pin the one most useful to a new viewer.</li>
<li>Write one draft Community post (a poll or a teaser) you could publish this week.</li>
<li>Decide where your email list or group link will live — video description, pinned comment, or both — and write the one sentence that goes with it.</li>
</ol><p><strong>Done when:</strong> three real replies posted, one pinned comment, one drafted Community post, and one written sentence for your email/group link.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Community post</span><span class="v">A non-video update — poll, photo, teaser — posted between uploads.</span></div>
  <div class="kv"><span class="k">Creator collaboration</span><span class="v">A joint video that fairly shares two channels' audiences with each other.</span></div>
  <div class="kv"><span class="k">Owned channel</span><span class="v">A way to reach your audience — like an email list — that no platform algorithm controls.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Reply and pin comments within the first hour, post Community updates between uploads, and use live Q&amp;A as a direct source of video ideas.</li>
<li>Collaborate fairly with creators in your niche, and build an email/group list — the one channel no platform can take away.</li>
<li>Answer real criticism calmly; hide or block harassment and spam, and let it go.</li>
<li>None of this appears in Lesson 26.1's dashboards, which is exactly why a metrics-only weekly review will neglect it.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 26 · Bài 26.3</span>
<h2>Không thứ nào trong đây hiện trên bảng số liệu — và tất cả đều quyết định ai sẽ quay lại</h2>
<p class="lead">Phân khúc "người xem quay lại" ở Bài 26.1 và vòng lặp hằng tuần ở Bài 26.2 đều đo những gì ĐÃ xảy ra. Bài này nói về sáu việc bình thường âm thầm quyết định một người lạ vừa xem một lần có trở thành đúng con số "quay lại" đó vào tháng sau, hay không bao giờ thấy tên bạn lần nữa.</p>

<h3>Giữ người vừa tới — ngay bây giờ, không phải "để rồi tính"</h3>
${slide('cr-26', 11, 'Giữ người đã tới — tương tác trực tiếp')}
<div class="kv-grid">
  <div class="kv"><span class="k">Trả lời & ghim bình luận</span><span class="v">Trả lời câu hỏi thật trong giờ đầu, không phải "lúc nào rảnh." Bài 1.2 đã xác lập like, chia sẻ, và theo đúng logic đó, cả câu trả lời của bạn — đều là tín hiệu hài lòng mà nền tảng đọc được.</span></div>
  <div class="kv"><span class="k">Bài đăng cộng đồng</span><span class="v">Một cuộc thăm dò, một ảnh hậu trường, một hé lộ video sắp ra — giữ kênh cảm giác "còn sống" giữa hai lần đăng thay vì im lặng cả tuần.</span></div>
  <div class="kv"><span class="k">Livestream hỏi đáp</span><span class="v">Gặp khán giả trong thời gian thực. Đúng những câu hỏi người ta nói ra thành tiếng là một trong tám nguồn ý tưởng của Bài 2.1 — đây là chỗ bạn nghe được chúng đầu tiên.</span></div>
</div>
<p>Không cái nào trong ba việc này hiện thành một con số trên các bảng điều khiển ở Bài 26.1. Chính vì thế mà một buổi xem số liệu chỉ kiểm CTR và retention sẽ bỏ quên chúng một cách có hệ thống — đặt một lời nhắc cho ba việc này BÊN CẠNH khung giờ ở Bài 26.2, không phải nhét vào trong đó.</p>

<h3>Mở rộng ra ngoài kênh — và tự bảo vệ mình khi làm điều đó</h3>
${slide('cr-26', 12, 'Mở rộng ra ngoài kênh — và tự bảo vệ mình')}
<div class="kv-grid">
  <div class="kv"><span class="k">Hợp tác creator</span><span class="v">Một video chung với kênh cùng ngách — mượn khán giả của nhau một cách sòng phẳng, hai chiều, không phải một ơn huệ một chiều.</span></div>
  <div class="kv"><span class="k">Danh sách email / nhóm</span><span class="v">Kênh DUY NHẤT không phụ thuộc bất kỳ thuật toán nào. Gắn nó ở mọi mô tả video — đúng logic "hub" Bài 1.4 đã dựng quanh cuongthai.com.</span></div>
  <div class="kv"><span class="k">Bình luận tiêu cực</span><span class="v">Góp ý thật đáng được một câu trả lời bình tĩnh, chân thành — thường nghĩa là ai đó đã đủ quan tâm để xem kỹ. Công kích hoặc spam thì ẩn hoặc chặn. Không cái nào đáng để bạn giữ trong đầu sau đó.</span></div>
</div>
<p>Danh sách email đáng có thêm một câu riêng: đó là kênh DUY NHẤT trong sáu việc này mà một nền tảng không thể tạm khoá, giảm hiển thị âm thầm, hay vùi lấp bằng thuật toán qua một đêm. Mọi kênh khác trong bài này — bình luận, bài đăng cộng đồng, livestream, khán giả của một đối tác hợp tác — vẫn chạy qua hệ thống của người khác. Một địa chỉ email thì không.</p>
<p>Một phép thử nhanh để biết một bình luận thuộc nhóm nào: nó có chỉ ra thứ cụ thể trong video — một khẳng định, một bước làm, một lựa chọn bạn đã đưa ra — hay chỉ công kích bạn? "Đoạn giải thích CORS ở phút 4:30 sai rồi, nó vẫn xảy ra với same-origin request có kèm credentials" là góp ý, dù nói thẳng thừng, và đáng một câu trả lời thật, tốt nhất kèm một bình luận đính chính được ghim nếu người đó nói đúng. "Ông/bà chẳng biết gì cả" mà không chỉ ra được điều gì cụ thể trong video thì không phải góp ý đáng cân nhắc — ẩn đi và tiếp tục. Phép thử không nằm ở giọng điệu; nó nằm ở việc có thứ cụ thể để trả lời hay không.</p>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — coi việc cộng đồng là tuỳ chọn vì nó không nằm trong analytics.</strong> Bài 26.1 cho bạn định nghĩa chính xác cho impressions, CTR và retention chính vì chúng ĐO ĐƯỢC. Điều đó không biến nửa còn lại của tăng trưởng — phần không đo được — thành tuỳ chọn; nó chỉ khiến phần đó dễ bị lãng quên. Một kênh có retention xuất sắc mà không trả lời bình luận nào vẫn đang để rò rỉ đúng những người xem mà phân khúc "quay lại" ở Bài 26.1 muốn nuôi lớn.</p></div>

<p class="note-ct"><strong>Nối với bài sau:</strong> Bài 26.4 là chỗ tăng trưởng cuối cùng biến thành tiền — và thành lượng truy cập bạn thật sự đếm được đang tới cuongthai.com, khép lại vòng lặp cả chương này đã xây dựng.</p>

<h3>🎬 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
<li>Mở phần bình luận của video gần nhất. Trả lời ba bình luận/câu hỏi thật, và ghim lại bình luận hữu ích nhất cho một người xem mới.</li>
<li>Viết một bản nháp bài đăng cộng đồng (thăm dò ý kiến hoặc hé lộ) bạn có thể đăng trong tuần này.</li>
<li>Quyết định link danh sách email/nhóm của bạn sẽ nằm ở đâu — mô tả video, bình luận ghim, hay cả hai — và viết đúng một câu đi kèm nó.</li>
</ol><p><strong>Đạt khi:</strong> có ba câu trả lời thật đã đăng, một bình luận đã ghim, một bản nháp bài đăng cộng đồng, và một câu đã viết cho link email/nhóm.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Bài đăng cộng đồng</span><span class="v">Một cập nhật không phải video — thăm dò, ảnh, hé lộ — đăng giữa hai lần đăng video.</span></div>
  <div class="kv"><span class="k">Hợp tác creator</span><span class="v">Một video chung chia sẻ sòng phẳng khán giả của hai kênh cho nhau.</span></div>
  <div class="kv"><span class="k">Kênh thuộc về mình</span><span class="v">Một cách tiếp cận khán giả — như danh sách email — mà không thuật toán nền tảng nào kiểm soát được.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Trả lời và ghim bình luận trong giờ đầu, đăng cập nhật cộng đồng giữa hai lần đăng video, và dùng livestream hỏi đáp như một nguồn ý tưởng trực tiếp.</li>
<li>Hợp tác sòng phẳng với creator cùng ngách, và xây danh sách email/nhóm — kênh duy nhất không nền tảng nào lấy đi được.</li>
<li>Trả lời góp ý thật một cách bình tĩnh; ẩn hoặc chặn công kích và spam, rồi bỏ qua.</li>
<li>Không việc nào trong đây hiện trên bảng số liệu ở Bài 26.1 — chính vì thế một buổi xem số liệu chỉ nhìn con số sẽ bỏ quên chúng.</li>
</ul>
</div>
`,
    },

    /* ─────────────────── 26.4 kiếm tiền & phễu ─────────────────── */
    {
      title: '26.4 — Monetization and the funnel back to your website|||26.4 — Kiếm tiền và phễu về website',
      slug: 'cr-26-4-kiem-tien-pheu-website',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'YouTube Partner Program hai mức (Việt Nam đủ điều kiện), TikTok và Facebook kiểm tới 09/2026, thu nhập ngoài quảng cáo, và phễu short → long → website → gói Pro đo được bằng UTM.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 26 · Lesson 26.4</span>
<h2>Every number in this lesson was checked against the platform's own page — not a blog guessing on your behalf</h2>
<p class="lead">Monetization is where wrong information costs the most, because it changes what you plan your next six months around. This lesson checked YouTube, TikTok and Facebook directly against their own official pages as of September 2026, states plainly where a program is not yet available in Vietnam instead of staying silent about it, and closes with the funnel this entire chapter has been building toward — and the one thing you must set up before you can measure it at all.</p>

<h3>YouTube Partner Program: two tiers, not one gate</h3>
${slide('cr-26', 13, 'YouTube Partner Program — hai mức')}
<p>YouTube's expanded Partner Program splits into two tiers. <strong>Tier 1</strong> unlocks fan funding (channel memberships, Super Chat/Stickers, Super Thanks, gifts) and Shopping, at <strong>500 subscribers</strong>, 3 valid public uploads in the last 90 days, and either 3,000 qualified watch hours in the last 12 months or 3 million qualified Shorts views in the last 90 days. <strong>Tier 2</strong> adds ad revenue sharing and YouTube Premium revenue, at <strong>1,000 subscribers</strong> with either 4,000 qualified watch hours in 12 months or 10 million qualified Shorts views in 90 days. Both tiers additionally require following YouTube's monetization policies, a channel based in an eligible country/region, 2-Step Verification turned on, and one active AdSense for YouTube account linked to the channel. Checked directly on 23 September 2026: <strong>Vietnam is on the list of eligible countries/regions.</strong></p>

<h3>TikTok and Facebook: checked against 09/2026, not against a blog post</h3>
${slide('cr-26', 14, 'TikTok & Facebook kiếm tiền ở Việt Nam')}
<p>TikTok's own Creator Academy page — updated 11 September 2026 — states plainly: "the program is currently open to creators in the United States, United Kingdom, Germany, Japan, South Korea, France, Mexico, and Brazil." <strong>Vietnam is not on that list.</strong> Meeting the follower and view thresholds (10,000 followers, 100,000 views in 30 days) does not matter if your account is not registered in one of those eight countries — the geography is a hard gate, independent of every other number.</p>
<p>Facebook's own Business Help Center is, if anything, more direct: in-stream ads, ads on Reels and the Performance bonus program all ended on 31 August 2025. The program that replaced them, <strong>Facebook content monetisation</strong>, is stated as <strong>invitation-only</strong> — no published follower count, no published watch-time threshold, no published country list. Creators without an invitation can submit an interest form, which the page explicitly says "does not guarantee" anything.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — trusting a blog's specific numbers over the platform's own page.</strong> Plenty of articles online will confidently state a follower count for Facebook's new program or claim Vietnam already has TikTok's Creator Rewards Program. Both official sources checked for this lesson directly contradict those claims. When a program is genuinely invite-only with nothing published, the honest thing to say is exactly that — not a number that sounds precise but is not sourced.</p></div>

<h3>Income that is not gated by any of the above</h3>
<p>None of the country or threshold rules above apply to two other income sources: <strong>sponsorships/affiliate links</strong>, negotiated directly with a brand or program rather than through a platform's monetization gate, and <strong>selling your own product</strong> — your courses and the Pro plan on cuongthai.com, where you set the terms entirely. For a channel built around driving people to your own website, this second source is not a fallback for when platform monetization is unavailable — it is usually the bigger, steadier target from day one.</p>

<h3>The funnel this whole chapter has been building toward</h3>
${slide('cr-26', 15, 'Phễu: từ video ngắn tới gói Pro')}
<p>Lesson 1.4 already put cuongthai.com at the centre of your channels, and Lesson 24.3 already taught you to tag every outbound link with UTM parameters. Put them together and you get an actual funnel: a <strong>short video</strong> earns a stranger's attention with a hook (Lesson 20.1), a <strong>long video</strong> turns that attention into trust by solving a real problem in full, a link in the description — tagged with UTM — sends the interested ones to <strong>cuongthai.com</strong>, and from there some become <strong>Pro</strong> subscribers, the actual destination of everything in this chapter.</p>
<p>The one piece that makes this funnel measurable instead of a hopeful diagram: without a separate UTM-tagged link per platform, every visit to cuongthai.com looks identical in Google Analytics — direct traffic, no source attached. With them, Lesson 24.3's tagged links feed directly into GA4's <strong>Traffic acquisition</strong> report (Reports → Acquisition → Traffic acquisition), filterable by <strong>Session source/medium</strong> or <strong>Session campaign</strong> — the exact place that finally answers, in numbers, whether TikTok or YouTube sends more people who go on to look at a course.</p>

<h3>Foreign-platform income and Vietnamese tax — one honest sentence, no invented numbers</h3>
<p>Income from AdSense, TikTok, sponsorships or any foreign platform may need to be declared and taxed under Vietnamese law, and the rules that apply depend on your specific situation. This course does not give tax advice and will not print a rate or threshold here — talk to an accountant or your local tax office before your first real payout arrives, not at year-end when you are reconciling it after the fact.</p>

<p class="note-ct"><strong>Connects to next:</strong> Chapter 27 is the 30-day launch project — the place every number, ritual and funnel from this chapter finally gets applied to a real channel instead of staying theoretical.</p>

<h3>🎬 Practice (20 minutes)</h3>
<div class="callout ok"><ol>
<li>Check the official YouTube Partner Program page and count exactly how far your channel is from the 500-subscriber, Tier 1 threshold.</li>
<li>If you post to TikTok, check whether your account is registered in one of the eight Creator Rewards Program countries — write down the honest answer either way.</li>
<li>Confirm you have three UTM-tagged links ready (Lesson 24.3), one per platform, all pointing at the same cuongthai.com page.</li>
</ol><p><strong>Done when:</strong> one real number for your distance to Tier 1, one honest yes/no on TikTok eligibility, and three working UTM links pointing at the same page.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">YPP Tier 1 / Tier 2</span><span class="v">500 subs (fan funding + Shopping) vs. 1,000 subs (adds ad revenue + Premium).</span></div>
  <div class="kv"><span class="k">Invitation-only</span><span class="v">Facebook content monetisation's current model — no public application with published thresholds.</span></div>
  <div class="kv"><span class="k">Traffic acquisition report</span><span class="v">The GA4 report (Reports → Acquisition) that reads UTM-tagged link data by source/medium/campaign.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>YouTube Partner Program: Tier 1 at 500 subs unlocks fan funding + Shopping; Tier 2 at 1,000 subs adds ad revenue. Vietnam is on the eligible-country list (checked 23/09/2026).</li>
<li>TikTok's Creator Rewards Program is open to only 8 countries as of its 11/09/2026 update — Vietnam is not one of them, regardless of follower/view counts.</li>
<li>Facebook's old ad programs ended 31/08/2025; the replacement is invitation-only with no published thresholds or country list.</li>
<li>Sponsorships and selling your own courses/Pro plan bypass all platform gates — and the funnel to cuongthai.com is only measurable with UTM-tagged links read in GA4's Traffic acquisition report.</li>
<li>Foreign-platform income and Vietnamese tax: talk to an accountant or the tax office before the first payout, not after.</li>
</ul>
<div class="link-card"><a href="https://support.google.com/youtube/answer/13429240?hl=en" target="_blank" rel="noopener">YouTube Help — Overview of the expanded YouTube Partner Program</a></div>
<div class="link-card"><a href="https://www.tiktok.com/creator-academy/article/creator-rewards-program/?lang=en" target="_blank" rel="noopener">TikTok Creator Academy — Creator Rewards Program</a></div>
<div class="link-card"><a href="https://www.facebook.com/business/help/1049081556813520" target="_blank" rel="noopener">Meta Business Help Center — About Facebook content monetisation for creators</a></div>
<div class="link-card"><a href="https://support.google.com/analytics/answer/12923437?hl=en" target="_blank" rel="noopener">Analytics Help — [GA4] Traffic acquisition report</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 26 · Bài 26.4</span>
<h2>Mọi con số trong bài này đã được đối chiếu với đúng trang của nền tảng — không phải một bài blog đoán hộ bạn</h2>
<p class="lead">Kiếm tiền là chỗ thông tin sai gây tốn kém nhất, vì nó đổi luôn cả kế hoạch sáu tháng tới của bạn. Bài này kiểm trực tiếp YouTube, TikTok và Facebook trên đúng trang chính thức của họ tính tới tháng 9/2026, nói thẳng chỗ nào một chương trình CHƯA có ở Việt Nam thay vì im lặng bỏ qua, và khép lại bằng đúng cái phễu cả chương này đã xây — cùng thứ bắt buộc phải có trước khi đo được nó.</p>

<h3>YouTube Partner Program: hai mức, không phải một cửa duy nhất</h3>
${slide('cr-26', 13, 'YouTube Partner Program — hai mức')}
<p>YouTube Partner Program mở rộng chia thành hai mức. <strong>Mức 1</strong> mở khoá fan funding (channel membership, Super Chat/Sticker, Super Thanks, quà tặng) và Shopping, ở <strong>500 subscriber</strong>, 3 video công khai hợp lệ trong 90 ngày gần nhất, và một trong hai: 3.000 giờ xem hợp lệ trong 12 tháng qua HOẶC 3 triệu lượt xem Shorts hợp lệ trong 90 ngày qua. <strong>Mức 2</strong> thêm chia sẻ doanh thu quảng cáo và doanh thu YouTube Premium, ở <strong>1.000 subscriber</strong> với 4.000 giờ xem hợp lệ trong 12 tháng HOẶC 10 triệu lượt xem Shorts hợp lệ trong 90 ngày. Cả hai mức đều cần thêm: theo đúng chính sách kiếm tiền của YouTube, kênh đặt tại một quốc gia/khu vực đủ điều kiện, bật Xác minh 2 bước, và có một tài khoản AdSense for YouTube đang hoạt động liên kết với kênh. Kiểm trực tiếp ngày 23/09/2026: <strong>Việt Nam nằm trong danh sách quốc gia/khu vực đủ điều kiện.</strong></p>

<h3>TikTok và Facebook: kiểm tới 09/2026, không phải theo một bài blog</h3>
${slide('cr-26', 14, 'TikTok & Facebook kiếm tiền ở Việt Nam')}
<p>Trang Creator Academy CHÍNH THỨC của TikTok — cập nhật 11/09/2026 — nói thẳng: chương trình hiện chỉ mở cho creator ở Mỹ, Anh, Đức, Nhật, Hàn, Pháp, Mexico và Brazil. <strong>Việt Nam không nằm trong danh sách đó.</strong> Vượt được ngưỡng follower và view (10.000 follower, 100.000 view trong 30 ngày) không có ý nghĩa gì nếu tài khoản của bạn không đăng ký ở một trong tám nước đó — điều kiện địa lý là một cửa cứng, độc lập với mọi con số khác.</p>
<p>Trung tâm Trợ giúp Doanh nghiệp chính thức của Facebook thậm chí còn thẳng thắn hơn: in-stream ads, quảng cáo trên Reels và chương trình Performance bonus đều đã kết thúc vào ngày 31/08/2025. Chương trình thay thế, <strong>Facebook content monetisation</strong>, được nêu rõ là <strong>CHỈ theo lời mời</strong> — không có ngưỡng follower công bố, không có ngưỡng thời lượng xem công bố, không có danh sách quốc gia công bố. Creator chưa được mời có thể gửi một mẫu bày tỏ quan tâm, mà chính trang đó nói rõ "không đảm bảo" bất cứ điều gì.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — tin con số cụ thể của một blog hơn đúng trang của nền tảng.</strong> Rất nhiều bài viết trên mạng khẳng định chắc nịch một ngưỡng follower cho chương trình mới của Facebook, hoặc nói Việt Nam đã có Creator Rewards Program của TikTok. Cả hai nguồn chính thức đã kiểm cho bài này đều nói NGƯỢC LẠI. Khi một chương trình thật sự chỉ theo lời mời và không công bố gì, điều trung thực cần nói ra đúng là như vậy — không phải một con số nghe có vẻ chính xác nhưng không có nguồn.</p></div>

<h3>Nguồn thu không bị chặn bởi bất cứ điều gì ở trên</h3>
<p>Không luật quốc gia hay ngưỡng nào ở trên áp dụng cho hai nguồn thu khác: <strong>tài trợ/affiliate</strong>, đàm phán trực tiếp với một nhãn hàng hoặc chương trình chứ không qua cửa kiếm tiền của nền tảng, và <strong>bán sản phẩm của chính mình</strong> — khoá học và gói Pro trên cuongthai.com, nơi bạn tự đặt luật chơi hoàn toàn. Với một kênh được xây để dẫn người về chính website của mình, nguồn thu thứ hai này không phải phương án dự phòng khi kiếm tiền trên nền tảng chưa khả dụng — nó thường là mục tiêu lớn hơn, ổn định hơn, ngay từ ngày đầu.</p>

<h3>Cái phễu cả chương này đã xây tới đây</h3>
${slide('cr-26', 15, 'Phễu: từ video ngắn tới gói Pro')}
<p>Bài 1.4 đã đặt cuongthai.com ở trung tâm mọi kênh của bạn, và Bài 24.3 đã dạy gắn UTM vào mọi link dẫn ra ngoài. Ghép hai thứ lại, bạn có một cái phễu thật sự: một <strong>video ngắn</strong> giành được sự chú ý của người lạ bằng một hook (Bài 20.1), một <strong>video dài</strong> biến sự chú ý đó thành niềm tin bằng cách giải quyết trọn vẹn một vấn đề thật, một link trong mô tả — gắn UTM — đưa những người quan tâm tới <strong>cuongthai.com</strong>, và từ đó một số trở thành người đăng ký <strong>Pro</strong> — đích đến thật sự của mọi thứ trong chương này.</p>
<p>Mảnh ghép biến cái phễu này thành đo được thay vì chỉ là một sơ đồ đầy hy vọng: không có link gắn UTM riêng cho từng nền tảng, mọi lượt ghé cuongthai.com đều trông giống hệt nhau trong Google Analytics — lượt truy cập trực tiếp, không gắn nguồn. Có chúng rồi, các link đã gắn nhãn ở Bài 24.3 đổ thẳng vào báo cáo <strong>Traffic acquisition</strong> của GA4 (Báo cáo → Thu hút lưu lượng truy cập → Traffic acquisition), lọc được theo <strong>Session source/medium</strong> hoặc <strong>Session campaign</strong> — đúng chỗ cuối cùng trả lời được, bằng con số, TikTok hay YouTube đang gửi nhiều người thật sự đi xem một khoá học hơn.</p>

<h3>Thu nhập từ nền tảng nước ngoài và thuế Việt Nam — một câu trung thực, không con số bịa</h3>
<p>Thu nhập từ AdSense, TikTok, tài trợ, hay bất kỳ nền tảng nước ngoài nào có thể cần khai báo và nộp thuế theo pháp luật Việt Nam, và luật áp dụng tuỳ vào từng trường hợp cụ thể. Khoá học này không tư vấn thuế và sẽ không in ra một mức thuế hay ngưỡng nào ở đây — hãy hỏi kế toán hoặc Chi cục Thuế nơi bạn ở TRƯỚC khi khoản thu đầu tiên thật sự về tới, đừng để tới cuối năm mới đối chiếu ngược lại.</p>

<p class="note-ct"><strong>Nối với chương sau:</strong> Chương 27 là dự án ra mắt kênh 30 ngày — nơi mọi con số, nghi thức và cái phễu của chương này cuối cùng được áp vào một kênh thật, thay vì chỉ nằm trên lý thuyết.</p>

<h3>🎬 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
<li>Mở trang YouTube Partner Program chính thức và đếm chính xác kênh bạn còn cách ngưỡng Mức 1 (500 subscriber) bao xa.</li>
<li>Nếu có đăng TikTok, kiểm xem tài khoản của bạn có đăng ký ở một trong tám nước của Creator Rewards Program không — ghi lại câu trả lời trung thực dù là gì.</li>
<li>Xác nhận bạn đã có sẵn ba link gắn UTM (Bài 24.3), mỗi nền tảng một link, cùng trỏ về một trang trên cuongthai.com.</li>
</ol><p><strong>Đạt khi:</strong> có một con số thật cho khoảng cách tới Mức 1, một câu trả lời trung thực có/không về điều kiện TikTok, và ba link UTM hoạt động cùng trỏ về một trang.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">YPP Mức 1 / Mức 2</span><span class="v">500 subscriber (fan funding + Shopping) so với 1.000 subscriber (thêm doanh thu quảng cáo + Premium).</span></div>
  <div class="kv"><span class="k">Chỉ theo lời mời</span><span class="v">Mô hình hiện tại của Facebook content monetisation — không có đơn đăng ký công khai với ngưỡng công bố.</span></div>
  <div class="kv"><span class="k">Traffic acquisition report</span><span class="v">Báo cáo trong GA4 (Báo cáo → Thu hút lưu lượng truy cập) đọc dữ liệu link gắn UTM theo source/medium/campaign.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>YouTube Partner Program: Mức 1 ở 500 subscriber mở fan funding + Shopping; Mức 2 ở 1.000 subscriber thêm doanh thu quảng cáo. Việt Nam nằm trong danh sách quốc gia đủ điều kiện (kiểm 23/09/2026).</li>
<li>Creator Rewards Program của TikTok chỉ mở cho 8 quốc gia tính tới bản cập nhật 11/09/2026 — Việt Nam không có trong đó, bất kể follower/view đã đạt bao nhiêu.</li>
<li>Các chương trình quảng cáo cũ của Facebook đã kết thúc 31/08/2025; chương trình thay thế chỉ theo lời mời, không công bố ngưỡng hay danh sách quốc gia.</li>
<li>Tài trợ và bán khoá học/gói Pro của chính mình vượt qua mọi cửa của nền tảng — và cái phễu về cuongthai.com chỉ đo được khi có link gắn UTM, đọc trong báo cáo Traffic acquisition của GA4.</li>
<li>Thu nhập từ nền tảng nước ngoài và thuế Việt Nam: hỏi kế toán hoặc cơ quan thuế trước khoản thu đầu tiên, đừng để sau.</li>
</ul>
<div class="link-card"><a href="https://support.google.com/youtube/answer/13429240?hl=en" target="_blank" rel="noopener">YouTube Help — Tổng quan YouTube Partner Program mở rộng</a></div>
<div class="link-card"><a href="https://www.tiktok.com/creator-academy/article/creator-rewards-program/?lang=en" target="_blank" rel="noopener">TikTok Creator Academy — Creator Rewards Program</a></div>
<div class="link-card"><a href="https://www.facebook.com/business/help/1049081556813520" target="_blank" rel="noopener">Meta Business Help Center — Về Facebook content monetisation cho creator</a></div>
<div class="link-card"><a href="https://support.google.com/analytics/answer/12923437?hl=en" target="_blank" rel="noopener">Analytics Help — Báo cáo [GA4] Traffic acquisition</a></div>
</div>
`,
    },

    /* ─────────────────── 26.5 quiz ─────────────────── */
    {
      title: '26.5 — Chapter 26 check|||26.5 — Kiểm tra chương 26',
      slug: 'cr-26-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Kiểm tra 10 câu tình huống: năm chỉ số cốt lõi, đọc đồ thị giữ chân, vòng lặp cải tiến, video vượt trội, và kiếm tiền có kiểm chứng trên ba nền tảng.',
      content: `
<div class="ml-en">
<p>Four lessons, one straight line from a dashboard you already had access to, to a channel that actually improves and — eventually — earns. <strong>26.1</strong> gave exact, official definitions to five numbers and four retention signals you had only half-learned across earlier chapters, plus the translation table between YouTube Studio, TikTok Studio and Meta Insights. <strong>26.2</strong> turned that vocabulary into a fixed weekly ritual: observe, one-sentence hypothesis, change exactly one variable, compare — plus Lesson 2.1's outlier method aimed at your own channel. <strong>26.3</strong> covered the half of growth the dashboard never shows: comments, community posts, collaborations, an email list no algorithm controls. <strong>26.4</strong> checked YouTube, TikTok and Facebook monetization directly against their own official pages as of September 2026 — including where a program plainly is not yet available in Vietnam — and closed the loop with a UTM-measured funnel to cuongthai.com.</p>
<p><strong>Self-check before the quiz:</strong></p>
<ul>
<li>Can you name where impressions are and are not counted, and what "views" changed to mean after 24 August 2026?</li>
<li>Can you name all four retention signals and what each one means?</li>
<li>Do you have a fixed weekly review slot on your calendar, with a one-variable hypothesis for your next video?</li>
<li>Can you state, correctly, whether TikTok's Creator Rewards Program is open in Vietnam right now — and cite why?</li>
<li>Do you have three UTM-tagged links ready, one per platform, pointing at the same cuongthai.com page?</li>
</ul>
</div>
<div class="ml-vi">
<p>Bốn bài học, một đường thẳng từ một bảng điều khiển bạn đã có sẵn quyền truy cập, tới một kênh thật sự cải thiện và — cuối cùng — kiếm ra tiền. <strong>26.1</strong> cho định nghĩa chính xác, chính thức cho năm con số và bốn tín hiệu giữ chân mà bạn mới học nửa vời rải rác ở các chương trước, cộng thêm bảng dịch giữa YouTube Studio, TikTok Studio và Meta Insights. <strong>26.2</strong> biến vốn từ đó thành một nghi thức hằng tuần cố định: quan sát, giả thuyết một câu, đổi đúng một biến, so sánh — cộng thêm phương pháp video vượt trội của Bài 2.1 chĩa vào chính kênh bạn. <strong>26.3</strong> nói về nửa tăng trưởng mà bảng điều khiển không bao giờ hiện: bình luận, bài đăng cộng đồng, hợp tác, một danh sách email không thuật toán nào kiểm soát được. <strong>26.4</strong> kiểm trực tiếp kiếm tiền trên YouTube, TikTok và Facebook với đúng trang chính thức của họ tính tới tháng 9/2026 — kể cả chỗ một chương trình rõ ràng CHƯA có ở Việt Nam — và khép vòng lặp bằng một cái phễu về cuongthai.com đo được bằng UTM.</p>
<p><strong>Tự kiểm trước khi làm quiz:</strong></p>
<ul>
<li>Bạn gọi tên được impression được/không được tính ở đâu, và "views" đổi nghĩa thành gì sau 24/08/2026 chưa?</li>
<li>Bạn gọi tên được cả bốn tín hiệu giữ chân và ý nghĩa của từng cái chưa?</li>
<li>Bạn đã có một khung giờ xem số liệu cố định trong lịch, kèm một giả thuyết một-biến cho video kế tiếp chưa?</li>
<li>Bạn nói ĐÚNG được Creator Rewards Program của TikTok có đang mở ở Việt Nam không — và trích được vì sao chưa?</li>
<li>Bạn đã có sẵn ba link gắn UTM, mỗi nền tảng một link, cùng trỏ về một trang trên cuongthai.com chưa?</li>
</ul>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: "Cường's video has high Impressions (many people saw the thumbnail) but low CTR (few clicked). Where does the problem most likely lie?|||Video của Cường có Impressions cao (nhiều người thấy thumbnail) nhưng CTR thấp (ít người bấm vào). Vấn đề nhiều khả năng nằm ở đâu?",
            options: [
              'The title or thumbnail is not compelling enough — high impressions means YouTube is already trying to show it; the problem is the click itself|||Tiêu đề hoặc thumbnail chưa đủ hấp dẫn — impression cao nghĩa là YouTube đã thử hiện nó, vấn đề là ở "cú bấm"',
              'The video is too long for its topic|||Video quá dài so với chủ đề',
              'The pacing in the middle of the video is too slow|||Nhịp dựng ở giữa video quá chậm',
              'The channel posted at the wrong time of day|||Kênh đăng sai giờ trong ngày',
            ],
            correctIndex: 0,
            points: 1,
            explanation: "CTR specifically measures how often viewers watched a video after seeing a thumbnail. High impressions with low CTR isolates the problem to packaging (title/thumbnail) — pacing would show up in retention instead, and posting time does not affect whether people who already SEE the thumbnail choose to click.|||CTR đo chính xác việc người xem có bấm vào video sau khi thấy thumbnail hay không. Impression cao mà CTR thấp tách đúng vấn đề vào phần đóng gói (tiêu đề/thumbnail) — nhịp dựng sẽ hiện ra ở retention chứ không phải CTR, và giờ đăng không ảnh hưởng tới việc người ĐÃ THẤY thumbnail có bấm hay không.",
          },
          {
            question: "Cường's audience retention graph declines gradually and normally from 0 to 40 seconds, then drops sharply right at 0:45, immediately after a long explanation. What does this specifically indicate?|||Đồ thị Audience retention của Cường tụt dần đều một cách bình thường từ giây 0 tới giây 40, nhưng RƠI THẲNG ĐỨNG đúng ở giây 45, ngay sau một đoạn giải thích dài. Điều này nói lên điều gì?",
            options: [
              'This is just the normal intro drop — nothing needs fixing|||Đây là intro drop bình thường, không cần sửa gì',
              'That specific explanation around 0:45 is losing viewers — the pacing or content right there needs a second look|||Đúng đoạn giải thích ở giây 45 đang làm mất khán giả — cần xem lại nhịp/nội dung đúng chỗ đó',
              "YouTube has reduced the video's recommendations|||Video đã bị YouTube giảm đề xuất",
              "Viewers dislike the video's topic in general|||Người xem không thích chủ đề video nói chung",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "The gradual 0–40s decline IS the normal opening slope (Lessons 3.2/14.3). But a sudden EXTRA drop at one specific non-opening stretch is exactly what YouTube Help calls a \"dip\" — a clear signal that specific stretch is losing viewers. The fix is local (that stretch's pacing or content), not a sign of a platform-wide penalty.|||Cú tụt dần 0–40s CHÍNH LÀ độ dốc mở đầu bình thường (Bài 3.2/14.3). Nhưng một cú rơi THÊM đột ngột ở một đoạn cụ thể không phải đầu video đúng là thứ YouTube Help gọi là \"rơi\" (dip) — tín hiệu rõ ràng rằng đúng đoạn đó đang mất khán giả. Cách sửa là cục bộ (nhịp/nội dung đúng đoạn đó), không phải dấu hiệu bị nền tảng phạt.",
          },
          {
            question: "Cường's channel usually gets 5,000–8,000 views, but one video just hit 40,000. Following exactly the method from Lesson 2.1, applied to his own channel in Lesson 26.2, what is the FIRST step?|||Video thường của kênh Cường đạt 5.000–8.000 view, nhưng một video vừa đạt 40.000. Theo đúng phương pháp Bài 2.1 áp dụng lên chính kênh mình (Bài 26.2), bước ĐẦU TIÊN nên làm là gì?",
            options: [
              'Immediately make 5 videos just like it to ride the momentum|||Lập tức làm 5 video giống hệt để tận dụng đà',
              "Rename the channel to match that video's topic|||Đổi tên kênh cho hợp với video đó",
              'Ask WHY it outperformed — topic, title, angle, or timing — before planning the next video|||Hỏi VÌ SAO nó vượt trội — chủ đề, tiêu đề, góc nhìn hay đúng thời điểm — trước khi lên kịch bản video tiếp theo',
              'Delete older videos with low view counts|||Xoá các video cũ có lượt xem thấp',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'Lesson 2.1 explicitly warns that an outlier is "a lead, not a script to copy" — copying the surface without knowing WHY it worked gives a worse version of the video instead of a real answer to the same demand.|||Bài 2.1 nói rõ một video vượt trội là "một manh mối, không phải một kịch bản để chép lại" — bắt chước bề mặt mà không biết VÌ SAO nó hiệu quả chỉ cho ra một bản kém hơn, thay vì một câu trả lời thật cho cùng nhu cầu đó.',
          },
          {
            question: "Cường is in Vietnam. His TikTok has 12,000 followers and 150,000 views in the last 30 days — past both Creator Rewards Program thresholds. Can he join the program right now?|||Cường ở Việt Nam, kênh TikTok có 12.000 follower và 150.000 view trong 30 ngày qua — vượt cả hai ngưỡng của Creator Rewards Program. Cường có tham gia được chương trình này ngay bây giờ không?",
            options: [
              'Yes, since he has passed both the follower and view thresholds|||Có, vì đã vượt cả hai ngưỡng follower và view',
              'Yes, but he must wait 3 days for TikTok to review the application|||Có, nhưng phải chờ TikTok duyệt trong 3 ngày',
              'No, because the account must be a Business account, not Personal|||Không, vì tài khoản phải là Business, không phải Personal',
              "No — the program is currently open only to accounts registered in the US, UK, Germany, Japan, South Korea, France, Mexico and Brazil; Vietnam is not on that list, regardless of the other numbers|||Không — chương trình hiện chỉ mở cho tài khoản đăng ký tại Mỹ, Anh, Đức, Nhật, Hàn, Pháp, Mexico, Brazil; Việt Nam chưa có trong danh sách dù đủ mọi ngưỡng khác",
            ],
            correctIndex: 3,
            points: 1,
            explanation: "Meeting the follower/view thresholds is necessary but not sufficient. TikTok's own Creator Academy page (updated 11/09/2026) restricts the program to 8 countries — account registration country is a hard geographic gate, independent of every other number.|||Vượt ngưỡng follower/view là điều kiện cần nhưng chưa đủ. Trang Creator Academy chính thức của TikTok (cập nhật 11/09/2026) giới hạn chương trình trong 8 quốc gia — quốc gia đăng ký tài khoản là một cửa địa lý cứng, độc lập với mọi con số khác.",
          },
          {
            question: "Cường's channel has 600 subscribers and 3,500 qualified watch hours in the last 12 months, plus 4 public uploads in the last 90 days. Per YouTube Partner Program's own thresholds, where does this channel stand?|||Kênh của Cường có 600 subscriber và 3.500 giờ xem hợp lệ trong 12 tháng qua, cùng 4 video công khai trong 90 ngày gần nhất. Đúng ngưỡng của YouTube Partner Program, kênh này đang ở đâu?",
            options: [
              'Eligible for Tier 1 (fan funding + Shopping) — 500 subscribers and 3,000 hours are both cleared — but NOT yet Tier 2, which needs 1,000 subscribers|||Đủ điều kiện Mức 1 (fan funding + Shopping) — 500 subscriber và 3.000 giờ đều đã vượt ngưỡng — nhưng CHƯA đủ Mức 2, cần 1.000 subscriber',
              'Eligible for both tiers, including ad revenue|||Đủ cả hai mức, kể cả doanh thu quảng cáo',
              'Not eligible for either tier, since 3,500 hours has not reached 4,000|||Chưa đủ mức nào, vì 3.500 giờ chưa tới 4.000 giờ',
              'Only 1,000 subscribers matters for every tier — watch hours are irrelevant|||Chỉ cần đúng 1.000 subscriber là đủ mọi mức, giờ xem không quan trọng',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'Tier 1 needs 500 subs + 3 uploads/90 days + 3,000 hrs/12mo (all met here: 600>500, 3,500>3,000) OR 3M Shorts views. Tier 2 needs 1,000 subs (not met at 600) + 4,000 hrs. So this channel clears Tier 1 only.|||Mức 1 cần 500 sub + 3 video/90 ngày + 3.000 giờ/12 tháng (đều đạt: 600>500, 3.500>3.000) HOẶC 3 triệu view Shorts. Mức 2 cần 1.000 sub (chưa đạt ở 600) + 4.000 giờ. Vậy kênh này chỉ vượt được Mức 1.',
          },
          {
            question: "Since 24 August 2026, YouTube counts a 'view' from the very first frame, with no time threshold. If a video's raw view count spikes after that date with no change in content, which number is still trustworthy for judging retention?|||Từ 24/08/2026, lượt 'view' trên YouTube tính ngay từ khung hình đầu tiên, không ngưỡng thời gian. Nếu lượt view thô của một video tăng vọt sau ngày đó mà nội dung không đổi, con số nào mới thật sự đáng tin để đánh giá giữ chân?",
            options: [
              'Raw views — it always reflects the true number of viewers|||Views thô — vì nó luôn phản ánh đúng số người xem',
              'Engaged views — the old, stricter metric, kept in Analytics under a new name|||Engaged views — chỉ số cũ, chặt hơn, vẫn còn trong Analytics dưới tên mới',
              'The number of new subscribers that day|||Số subscriber mới trong ngày',
              'The number of likes|||Số lượt thích (like)',
            ],
            correctIndex: 1,
            points: 1,
            explanation: "Already established in Lesson 20.4 and reused in Lesson 26.1: the raw view count changed meaning on 24/08/2026. Engaged views is the renamed continuation of the old, stricter metric — the one still worth trusting for retention-style conclusions.|||Đã xác lập ở Bài 20.4 và dùng lại ở Bài 26.1: view thô đổi nghĩa từ 24/08/2026. Engaged views là tên mới của chỉ số cũ, chặt hơn — con số vẫn đáng tin để kết luận về giữ chân.",
          },
          {
            question: 'A blog claims: "Facebook Vietnam requires exactly 5,000 followers and 60,000 watch minutes to enable content monetization." Should Cường plan around this number?|||Một blog nói: "Facebook Việt Nam yêu cầu đúng 5.000 follower và 60.000 phút xem để bật kiếm tiền nội dung." Cường có nên lên kế hoạch theo con số này không?',
            options: [
              'Yes, since this figure appears on many blogs, it is probably correct|||Có, vì con số này xuất hiện trên nhiều blog nên chắc đúng',
              'Yes, but only for Pages, not personal profiles|||Có, nhưng chỉ áp dụng cho Trang (Page), không áp dụng cho hồ sơ cá nhân',
              "No — Meta's own Business Help Center states the new program is currently invitation-only, with no published follower/view threshold|||Không — trang Meta Business Help Center chính thức nói chương trình hiện CHỈ MỜI, không công bố ngưỡng follower/view công khai nào",
              'No, because Facebook has stopped all forms of monetization entirely|||Không, vì Facebook đã ngừng hẳn mọi hình thức kiếm tiền',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'Verified directly on facebook.com/business/help: in-stream ads and similar programs ended 31/08/2025. The new "Content monetisation" is invitation-only with no published numeric threshold. Numbers on blogs describe the OLD, now-ended programs or are simply unverified.|||Kiểm trực tiếp trên facebook.com/business/help: in-stream ads và các chương trình tương tự đã kết thúc 31/08/2025. "Content monetisation" mới chỉ theo lời mời, không công bố ngưỡng số nào. Con số trên các blog mô tả chương trình CŨ đã hết hạn, hoặc đơn giản là không có nguồn.',
          },
          {
            question: "Cường changed BOTH the thumbnail AND shortened the video length for his next upload, and views went up. Is the conclusion 'shorter videos perform better' solid?|||Cường vừa đổi CẢ thumbnail LẪN rút ngắn độ dài video trong cùng một lần đăng, và lượt xem tăng. Kết luận 'video ngắn hơn thì tốt hơn' có vững không?",
            options: [
              'Solid — views are the most objective evidence|||Vững, vì lượt xem là bằng chứng khách quan nhất',
              'Solid, as long as CTR also increased|||Vững, miễn là CTR cũng tăng theo',
              'Not solid — he needs to wait 2 more weeks for enough data|||Không vững, vì phải đợi thêm 2 tuần mới đủ dữ liệu',
              'Not solid — changing two variables at once means there is no way to know if the new thumbnail, the shorter length, or both caused the change|||Không vững — đổi hai biến cùng lúc thì không thể biết thumbnail mới hay độ dài mới (hoặc cả hai) là nguyên nhân thật sự',
            ],
            correctIndex: 3,
            points: 1,
            explanation: "This is exactly the trap Lesson 26.2's hypothesis loop warns against — change exactly one variable per test, or the result cannot be interpreted at all, no matter how much data or time is added.|||Đây đúng là cái bẫy vòng lặp giả thuyết ở Bài 26.2 cảnh báo — mỗi lần thử chỉ đổi đúng một biến, nếu không thì kết quả không thể diễn giải được, dù có thêm bao nhiêu dữ liệu hay thời gian.",
          },
          {
            question: "Which traffic source tells Cường that YouTube is ACTIVELY pushing his channel to both existing subscribers and strangers with similar taste, as opposed to viewers typing a search or returning on their own?|||Nguồn lưu lượng nào cho biết YouTube đang CHỦ ĐỘNG đẩy kênh Cường tới cả người đã theo dõi lẫn người lạ có gu giống họ, khác với việc người xem tự gõ tìm hay tự quay lại?",
            options: [
              'Browse features (homepage and subscription feed)|||Browse features (trang chủ và luồng đăng ký)',
              'Direct or unknown sources|||Direct or unknown sources',
              'External sources|||External sources',
              'YouTube search|||YouTube search',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'Per YouTube Help, Browse features covers the homepage and subscription feed — a high share there signals YouTube actively surfacing the channel. Direct/unknown and External both mean people already knew where to find the video, while Search means the viewer typed the query themselves.|||Theo YouTube Help, Browse features gồm trang chủ và luồng đăng ký — tỉ trọng cao ở đó là tín hiệu YouTube đang chủ động đẩy kênh ra. Direct/unknown và External đều nghĩa là người ta đã biết sẵn chỗ tìm video, còn Search nghĩa là người xem tự gõ từ khoá.',
          },
          {
            question: 'Cường wants to know, with numbers, whether TikTok or YouTube sends more people who actually browse the course page on cuongthai.com. What MUST already be in place before this question can be answered — not just guessed at?|||Cường muốn biết, bằng con số, TikTok hay YouTube đang gửi nhiều người thật sự bấm vào trang khoá học trên cuongthai.com hơn. Thứ gì BẮT BUỘC phải có sẵn TỪ TRƯỚC để trả lời được câu hỏi này, không phải chỉ đoán?',
            options: [
              "Each platform's follower count|||Số follower của từng nền tảng",
              'A separate UTM-tagged link per platform (different utm_source/utm_medium), read back in GA4\'s Traffic acquisition report|||Mỗi nền tảng một link riêng có gắn UTM (utm_source/utm_medium khác nhau), đọc lại trong báo cáo Traffic acquisition của Google Analytics',
              'The number of likes on each video|||Số lượt thích trên mỗi video',
              'The time of day each video was posted|||Thời gian đăng video mỗi ngày',
            ],
            correctIndex: 1,
            points: 1,
            explanation: "Without separate UTM-tagged links (Lesson 24.3) feeding GA4's Traffic acquisition report (Session source/medium), every visit to cuongthai.com looks identical after the fact — there is no way to attribute it to a specific platform.|||Không có link gắn UTM riêng (Bài 24.3) đổ vào báo cáo Traffic acquisition của GA4 (Session source/medium), mọi lượt ghé cuongthai.com đều trông giống hệt nhau sau đó — không có cách nào gán nó cho đúng một nền tảng cụ thể.",
          },
        ],
      },
    },
  ],
};
