/**
 * Content Creator — Chương 2: Ý tưởng & chiến lược nội dung. Song ngữ EN/VI (.ml-en / .ml-vi).
 * Nguồn ý tưởng không cạn · thẩm định trước khi quay · trụ cột/series/lịch đăng · tái sử dụng nội dung.
 * ⚠️ KHÔNG backtick trần trong content (dùng &#96;); `${` trong mã mẫu viết \${ ; gạch chéo ngược viết \\
 */
import { gallery, slide } from './_slides.mjs';

const SLIDES = [
  [1, 'Bìa'],
  [2, 'Bản đồ chương'],
  [3, 'Ý tưởng không thiếu — thiếu là hệ thống'],
  [4, '8 nguồn ý tưởng không bao giờ cạn'],
  [5, 'Video "vượt trội" — tín hiệu mạnh nhất về nhu cầu'],
  [6, 'Chấm điểm trước khi quay'],
  [7, 'Đóng gói TRƯỚC khi quay'],
  [8, 'Thử rẻ trước, làm lớn sau'],
  [9, 'Trụ cột → series có tên'],
  [10, 'Nhịp đăng thực tế cho sinh viên (ví dụ)'],
  [11, 'Nhịp 4 tuần — kế hoạch của bạn'],
  [12, '/creator/calendar thật: chỉ hai mốc mỗi dự án'],
  [13, 'Quay dồn một buổi — nhiều video'],
  [14, 'Kim tự tháp tái sử dụng'],
  [15, 'Đăng chéo đúng cách'],
  [16, 'Thực hành chương 2'],
];

export default {
  title: 'Chapter 2 — Ideas & content strategy|||Chương 2 — Ý tưởng & chiến lược nội dung',
  description: 'Không bao giờ thiếu ý tưởng nhờ 8 nguồn có hệ thống, chấm điểm và đóng gói trước khi bấm quay, biến trụ cột thành series có nhịp đăng giữ được, và nặn một buổi quay dồn thành năm mảnh nội dung khác nhau.',
  lessons: [
    /* ─────────────────── 2.0 slide ─────────────────── */
    {
      title: '2.0 — Chapter 2 in 16 slides|||2.0 — Chương 2 trong 16 slide',
      slug: 'cr-02-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Nguồn ý tưởng, chấm điểm trước khi quay, trụ cột thành series có lịch, và kim tự tháp tái sử dụng — cả chương trong 16 slide.',
      content: `
<div class="ml-en"><h2>📑 Chapter 2 in 16 slides</h2>
<p>Chapter 1 gave you a platform, a niche and one real viewer to write for. This chapter answers the question that shows up every single week after that: what do you actually film next? The slides walk through eight places ideas come from, a scoring table to sort them, a real four-week schedule, and the pyramid that turns one shoot into five pieces of content.</p>
<p>The two slides worth remembering: <strong>slide 6</strong> (four questions that turn a vague idea into a single 1–5 score) and <strong>slide 14</strong> (one long video becomes 3–5 shorts, a blog post, a community post and a question for the next video).</p></div>
<div class="ml-vi"><h2>📑 Chương 2 trong 16 slide</h2>
<p>Chương 1 cho bạn một nền tảng, một ngách và một người xem thật để viết cho họ. Chương này trả lời câu hỏi lặp lại mỗi tuần sau đó: thật ra bạn sẽ quay gì tiếp theo? Các slide đi qua tám nơi ý tưởng đến từ, một bảng chấm điểm để lọc chúng, một lịch bốn tuần thật, và kim tự tháp biến một buổi quay thành năm mảnh nội dung.</p>
<p>Hai slide đáng nhớ nhất: <strong>slide 6</strong> (bốn câu hỏi biến một ý tưởng mơ hồ thành một con số 1–5 duy nhất) và <strong>slide 14</strong> (một video dài thành 3–5 video ngắn, một bài viết, một bài đăng cộng đồng và một câu hỏi cho video kế tiếp).</p></div>
${gallery('cr-02', SLIDES)}
`,
    },

    /* ─────────────────── 2.1 nguồn ý tưởng ─────────────────── */
    {
      title: '2.1 — Where ideas actually come from|||2.1 — Ý tưởng thật sự đến từ đâu',
      slug: 'cr-02-1-nguon-y-tuong',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Tám nguồn ý tưởng không bao giờ cạn, cách đọc tab Trends của YouTube Studio và Google Trends, cách tự tìm "video vượt trội" của đối thủ, và thói quen ghi mọi ý vào Kho ý tưởng trước khi quên.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>"I don't know what to film" is almost never a lack of ideas — it is a lack of a place to put them</h2>
<p class="lead">You already know who you are filming for: Minh, the second-year student from Lesson 1.3, who finishes tutorials but still cannot build anything alone. The question that shows up every week from here on is smaller and more annoying: what, specifically, do you film next Monday? This lesson gives you eight places that question answers itself, and one habit that stops the answers from evaporating.</p>

<h3>The real problem is capture, not inspiration</h3>
${slide('cr-02', 3, 'Ý tưởng không thiếu — thiếu là hệ thống')}
<p>A good idea occurs to you in the shower, on the bus, mid-debugging session — never at a desk with a blank "new video" form open. If the only place that idea can go is your memory, it is gone by dinner. The fix is not becoming more creative; it is having a landing spot fast enough that the idea survives contact with the rest of your day. That landing spot is <code>/creator/ideas</code> — the Idea Bank.</p>
<p>The capture box at the top takes a title (up to 140 characters) and an optional hook (up to 280 characters) — nothing else, on purpose. Press Enter, it is saved. From there, every idea sits in exactly one of four states, shown as filter tabs with live counts: <strong>Đã ghi</strong> (Captured — what every new idea starts as), <strong>Đã gọt</strong> (Refined — once you have come back and sharpened it with a real hook and notes), <strong>Đã nâng</strong> (Promoted — you pressed "Nâng thành dự án" and it became a real project), and <strong>Đã cất</strong> (Archived — not now, but not deleted; "Cất đi" keeps it, it never disappears). Each card also takes a private 1–5 star rating, which Lesson 2.2 turns into a real filter.</p>
<p class="note-ct"><strong>The rule that makes this work:</strong> capture first, judge later. A half-formed idea typed in ten seconds is worth infinitely more than a brilliant one you meant to write down.</p>

<h3>Eight places that never run dry</h3>
${slide('cr-02', 4, '8 nguồn ý tưởng không bao giờ cạn')}
<div class="kv-grid">
  <div class="kv"><span class="k">Viewer questions</span><span class="v">Comments, DMs, questions asked in class or in a group chat. If one person asked, ten more had the same question and said nothing.</span></div>
  <div class="kv"><span class="k">Your own learning log</span><span class="v">Every bug you personally fixed this week is a video someone else will hit next month. This is the fastest-refilling source you have, because it needs no research — you already lived it.</span></div>
  <div class="kv"><span class="k">Search autocomplete</span><span class="v">Lesson 1.3 used this once to test a niche. Here, make it a weekly habit: type half a question about your pillars into YouTube search and read what autocompletes — those are real searches, refreshed constantly.</span></div>
  <div class="kv"><span class="k">YouTube Studio's Trends tab</span><span class="v">Covered in detail below — official, and free.</span></div>
  <div class="kv"><span class="k">Google Trends</span><span class="v">Compare how interest in two topics moves over time, or which regions search a term most — useful for picking which of two ideas to film first.</span></div>
  <div class="kv"><span class="k">Outlier videos from similar channels</span><span class="v">Covered in detail below — the strongest demand signal that costs nothing to check.</span></div>
  <div class="kv"><span class="k">Community groups</span><span class="v">Facebook groups for IT students, Reddit — the same three or four questions resurface for years because nobody wrote the definitive answer yet.</span></div>
  <div class="kv"><span class="k">What you are already doing</span><span class="v">Your FPTU coursework and whatever feature you are building on cuongthai.com this week. Building in public means the raw material is free — you were going to do the work anyway.</span></div>
</div>

<h3>YouTube Studio's Trends tab, read correctly</h3>
<p>Many creators still call this the "Research tab" — that was its old nickname, but YouTube's own help centre now names it the <strong>Trends tab</strong>, and as of September 2026 it is being rolled out in an updated Studio layout, so the exact look can differ from older screenshots. What it shows, per YouTube Help, has not changed in substance: <strong>Top searches</strong> (based on your audience and saves, last 28 days), <strong>Breakout videos</strong> (from creators near your size, for inspiration), <strong>Recent videos</strong> (related to what your audience has been watching), and <strong>Content gaps for Shorts</strong> — search terms people are looking for where YouTube has not found a strong Shorts answer yet. That last one is close to a gift: a labelled list of demand with no good supply.</p>
<p>Google Trends is a different, complementary tool — not YouTube-specific, and not tied to your channel. Its Explore view lets you compare how interest in two or three topics has moved over months or years, and break it down by country or city. Use it to decide which of two similarly-scored ideas to film first, not to invent ideas from nothing.</p>

<h3>Outlier videos: demand, already proven by someone else's numbers</h3>
${slide('cr-02', 5, 'Video "vượt trội" — tín hiệu mạnh nhất về nhu cầu')}
<p>An <strong>outlier</strong> (video vượt trội) is not a named feature on any platform — it is a method you run yourself, in under two minutes. Open a channel that shares your niche, go to its Videos tab, sort by <strong>most popular</strong>, and look at the top few against the channel's normal range. A channel that usually sits at 7,000–10,000 views but has one video at 48,000 is telling you something specific: that topic pulled in far more people than the channel's own subscriber base explains, which means the topic itself has pull beyond that one creator's audience.</p>
<p>An outlier is a lead, not a script to copy. Before touching the topic, ask why it worked: was it the topic, the title, a specific angle, or timing? Copying the thumbnail style while missing the reason it worked gives you a worse version of someone else's video instead of your own answer to the same demand.</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — chasing every trending topic.</strong> A topic outside your three circles from Lesson 1.3 (what you know, what people need, what you can keep doing) might spike once and then leave you with nothing to say for the follow-up. Filter every source through your niche before it goes further than the capture box.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Trap — trusting memory over the Idea Bank.</strong> "I'll remember the good ones" is exactly how a creator ends up with three ideas after a month of noticing forty. Capture the mediocre ones too — refining is Lesson 2.2's job, not this one's.</p></div>

<h3>🎬 Practice (30 minutes)</h3>
<div class="callout ok"><ol>
<li>Set a 30-minute timer. Capture <strong>20 ideas</strong> into <code>/creator/ideas</code>, from at least <strong>5 different sources</strong> in the list above.</li>
<li>For at least 5 of them, write a one-line hook in the second field — do not stop to polish, just fill it if one comes to mind.</li>
<li>Open one channel in your niche, sort its Videos tab by most popular, and write down one outlier and one guess at why it worked.</li>
<li>Check YouTube Studio's Trends tab (or Google Trends if you do not have a channel with data yet) and capture one more idea from what you see there.</li>
</ol><p><strong>Done when:</strong> 20 ideas sit in the Idea Bank tagged with at least 5 distinct sources in your notes, and you have one written outlier observation.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Idea Bank</span><span class="v">/creator/ideas — the capture-first list of every idea, sorted into Captured / Refined / Promoted / Archived.</span></div>
  <div class="kv"><span class="k">Outlier</span><span class="v">A video that performs far above a channel's normal range — a manual read of a channel's own Videos tab, not a named platform feature.</span></div>
  <div class="kv"><span class="k">Content gap</span><span class="v">YouTube's own term (Trends tab) for a search people want answered where no strong video exists yet.</span></div>
  <div class="kv"><span class="k">Autocomplete</span><span class="v">Search suggestions that reveal real, current searches.</span></div>
  <div class="kv"><span class="k">Build in public</span><span class="v">Turning your own ongoing project into content, as you go.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>The problem is almost always capture, not creativity — write every idea into /creator/ideas the moment it occurs, unpolished.</li>
  <li>Eight sources refill on their own: viewer questions, your learning log, autocomplete, YouTube's Trends tab, Google Trends, outlier videos, community groups, your own projects.</li>
  <li>YouTube's Trends tab (often still called "Research") shows Top searches, Breakout videos, Recent videos and Content gaps for Shorts.</li>
  <li>An outlier video is a method, not a feature — sort a channel's Videos tab by most popular and ask why the spike happened before copying anything.</li>
</ul>
<div class="link-card"><a href="https://support.google.com/youtube/answer/11962757?hl=en" target="_blank" rel="noopener">YouTube Help — Explore trends on YouTube (the Trends tab)</a></div>
<div class="link-card"><a href="https://trends.google.com/trends/" target="_blank" rel="noopener">Google Trends — compare interest over time and by region</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>"Không biết quay gì" gần như không bao giờ là thiếu ý tưởng — mà là thiếu chỗ để cất nó</h2>
<p class="lead">Bạn đã biết mình đang quay cho ai: Minh, sinh viên năm hai ở Bài 1.3, người xem hết tutorial nhưng vẫn không tự dựng được gì. Câu hỏi lặp lại mỗi tuần từ đây trở đi nhỏ hơn nhưng phiền hơn: cụ thể thứ Hai tuần sau bạn quay gì? Bài này cho bạn tám nơi câu hỏi đó tự trả lời, và một thói quen để câu trả lời không bốc hơi mất.</p>

<h3>Vấn đề thật là cất giữ, không phải cảm hứng</h3>
${slide('cr-02', 3, 'Ý tưởng không thiếu — thiếu là hệ thống')}
<p>Một ý tưởng hay thường nảy ra lúc đang tắm, trên xe buýt, giữa lúc debug — không bao giờ lúc bạn ngồi vào bàn mở sẵn form "video mới". Nếu chỗ duy nhất ý tưởng đó có thể đi là trí nhớ của bạn, nó biến mất trước giờ cơm tối. Cách sửa không phải là sáng tạo hơn; mà là có một chỗ đáp đủ nhanh để ý tưởng sống sót qua phần còn lại trong ngày của bạn. Chỗ đó là <code>/creator/ideas</code> — Kho ý tưởng.</p>
<p>Ô ghi nhanh ở đầu trang chỉ nhận một tiêu đề (tối đa 140 ký tự) và một hook tuỳ chọn (tối đa 280 ký tự) — không gì khác, có chủ đích. Bấm Enter là lưu. Từ đó, mỗi ý tưởng nằm ở đúng một trong bốn trạng thái, hiện thành các tab lọc kèm số đếm sống: <strong>Đã ghi</strong> (mọi ý mới đều bắt đầu ở đây), <strong>Đã gọt</strong> (khi bạn quay lại bổ sung hook và ghi chú cho rõ hơn), <strong>Đã nâng</strong> (bạn bấm "Nâng thành dự án" và nó trở thành một dự án thật), và <strong>Đã cất</strong> (chưa tới lúc, nhưng không xoá — "Cất đi" giữ nó lại, không bao giờ biến mất). Mỗi thẻ còn chấm được điểm riêng tư 1–5 sao, thứ Bài 2.2 sẽ biến thành một bộ lọc thật.</p>
<p class="note-ct"><strong>Luật làm cho việc này chạy được:</strong> ghi trước, đánh giá sau. Một ý tưởng nửa vời gõ trong mười giây có giá trị hơn vô hạn so với một ý hay bạn định ghi lại nhưng chưa kịp.</p>

<h3>Tám nơi không bao giờ cạn</h3>
${slide('cr-02', 4, '8 nguồn ý tưởng không bao giờ cạn')}
<div class="kv-grid">
  <div class="kv"><span class="k">Câu hỏi của người xem</span><span class="v">Bình luận, tin nhắn riêng, câu hỏi trên lớp hay trong nhóm chat. Một người hỏi thì mười người khác cùng thắc mắc mà không nói ra.</span></div>
  <div class="kv"><span class="k">Nhật ký tự học của chính bạn</span><span class="v">Mỗi lỗi bạn vừa tự sửa tuần này là một video người khác sẽ gặp tháng sau. Đây là nguồn tự đầy nhanh nhất, vì không cần nghiên cứu gì — bạn vừa sống qua nó.</span></div>
  <div class="kv"><span class="k">Gợi ý tìm kiếm tự động</span><span class="v">Bài 1.3 đã dùng cách này một lần để kiểm ngách. Ở đây, biến nó thành thói quen hằng tuần: gõ nửa câu hỏi quanh trụ cột của bạn vào ô tìm YouTube và đọc gợi ý tự điền — đó là những lượt tìm có thật, liên tục làm mới.</span></div>
  <div class="kv"><span class="k">Tab Trends của YouTube Studio</span><span class="v">Nói kỹ ở dưới — miễn phí và chính chủ.</span></div>
  <div class="kv"><span class="k">Google Trends</span><span class="v">So sánh mức quan tâm hai chủ đề thay đổi thế nào theo thời gian, hoặc vùng nào tìm một từ khoá nhiều nhất — hữu ích để chọn quay ý nào trước trong hai ý cùng điểm.</span></div>
  <div class="kv"><span class="k">Video "vượt trội" của kênh cùng ngách</span><span class="v">Nói kỹ ở dưới — tín hiệu nhu cầu mạnh nhất mà không tốn gì để kiểm.</span></div>
  <div class="kv"><span class="k">Nhóm cộng đồng</span><span class="v">Nhóm Facebook sinh viên IT, Reddit — đúng ba bốn câu hỏi cứ lặp lại nhiều năm vì chưa ai viết câu trả lời dứt điểm.</span></div>
  <div class="kv"><span class="k">Thứ bạn đang làm sẵn</span><span class="v">Bài học ở FPTU và bất kỳ tính năng nào bạn đang dựng cho cuongthai.com tuần này. Build in public nghĩa là nguyên liệu miễn phí — đằng nào bạn cũng đã định làm việc đó.</span></div>
</div>

<h3>Tab Trends của YouTube Studio, đọc cho đúng</h3>
<p>Nhiều creator vẫn quen gọi đây là "tab Research" — đó là tên gọi cũ, nhưng trung tâm trợ giúp chính thức của YouTube giờ gọi nó là <strong>tab Trends</strong>, và tính đến 09/2026, YouTube đang dần đổi sang giao diện Studio mới nên hình dạng cụ thể có thể khác ảnh chụp cũ. Nội dung nó hiển thị, theo YouTube Help, không đổi về bản chất: <strong>Top searches</strong> (những tìm kiếm hàng đầu dựa trên khán giả và lượt lưu của bạn, 28 ngày gần nhất), <strong>Breakout videos</strong> (video của các kênh cỡ gần bạn, để gợi ý), <strong>Recent videos</strong> (video liên quan tới thứ khán giả bạn đang xem), và <strong>Content gaps for Shorts</strong> — khoảng trống nội dung cho Shorts: từ khoá người ta đang tìm mà YouTube chưa thấy một Shorts nào trả lời tốt. Mục cuối gần như một món quà: một danh sách nhu cầu đã được gắn nhãn sẵn mà chưa có nguồn cung tốt.</p>
<p>Google Trends là một công cụ khác, bổ sung — không thuộc riêng YouTube, không gắn với kênh của bạn. Chế độ Explore cho so sánh mức quan tâm của hai ba chủ đề thay đổi ra sao qua nhiều tháng hay nhiều năm, và bóc tách theo quốc gia hay thành phố. Dùng nó để quyết định quay ý nào trước trong hai ý cùng điểm số, không phải để bịa ý tưởng từ hư không.</p>

<h3>Video "vượt trội": nhu cầu đã được số của người khác chứng minh sẵn</h3>
${slide('cr-02', 5, 'Video "vượt trội" — tín hiệu mạnh nhất về nhu cầu')}
<p><strong>Video vượt trội</strong> (outlier) không phải một tính năng có tên trên bất kỳ nền tảng nào — đó là một cách làm bạn tự chạy, mất chưa tới hai phút. Mở một kênh cùng ngách với bạn, vào tab Videos của kênh đó, sắp theo <strong>phổ biến nhất</strong>, rồi nhìn vài video đầu so với mức thường của chính kênh. Một kênh thường chỉ 7.000–10.000 view mà có một video đạt 48.000 đang nói với bạn một điều cụ thể: chủ đề đó kéo về nhiều người hơn hẳn mức lượng subscriber của kênh giải thích được — nghĩa là bản thân chủ đề có sức hút vượt ra ngoài khán giả riêng của người đó.</p>
<p>Một video vượt trội là một manh mối, không phải một kịch bản để chép lại. Trước khi động vào chủ đề đó, hãy hỏi vì sao nó hiệu quả: do chủ đề, do tiêu đề, do một góc nhìn cụ thể, hay do đúng thời điểm? Bắt chước kiểu thumbnail mà bỏ lỡ lý do thật sự chỉ cho bạn một bản kém hơn của video người khác, thay vì câu trả lời của riêng bạn cho cùng nhu cầu đó.</p>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — đuổi theo mọi chủ đề đang hot.</strong> Một chủ đề nằm ngoài ba vòng tròn ở Bài 1.3 (thứ bạn giỏi, thứ người ta cần, thứ bạn làm được lâu dài) có thể nổ một lần rồi để bạn không còn gì để nói cho video tiếp theo. Lọc mọi nguồn qua ngách của bạn trước khi nó đi xa hơn ô ghi nhanh.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — tin trí nhớ hơn Kho ý tưởng.</strong> "Ý nào hay mình sẽ nhớ" chính là cách một creator kết thúc với ba ý tưởng sau một tháng đã từng để ý tới bốn mươi. Ghi cả những ý tầm tầm — gọt giũa là việc của Bài 2.2, không phải của bài này.</p></div>

<h3>🎬 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Đặt đồng hồ 30 phút. Ghi <strong>20 ý tưởng</strong> vào <code>/creator/ideas</code>, từ ít nhất <strong>5 nguồn khác nhau</strong> trong danh sách trên.</li>
<li>Với ít nhất 5 ý, viết một câu hook vào ô thứ hai — đừng dừng lại để chỉn chu, có ý là điền.</li>
<li>Mở một kênh cùng ngách, sắp tab Videos theo phổ biến nhất, ghi lại một video vượt trội và một phỏng đoán vì sao nó hiệu quả.</li>
<li>Xem tab Trends của YouTube Studio (hoặc Google Trends nếu kênh bạn chưa có đủ dữ liệu) và ghi thêm một ý từ đó.</li>
</ol><p><strong>Đạt khi:</strong> 20 ý tưởng nằm trong Kho ý tưởng, gắn nhãn đủ 5 nguồn khác nhau trong ghi chú của bạn, và có một quan sát về video vượt trội đã viết ra.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Kho ý tưởng</span><span class="v">/creator/ideas — danh sách ghi trước, lọc theo Đã ghi / Đã gọt / Đã nâng / Đã cất.</span></div>
  <div class="kv"><span class="k">Video vượt trội (outlier)</span><span class="v">Video đạt lượt xem vượt xa mức thường của một kênh — một cách đọc thủ công tab Videos của chính kênh đó, không phải tên một tính năng nền tảng.</span></div>
  <div class="kv"><span class="k">Content gap</span><span class="v">Thuật ngữ của chính YouTube (tab Trends) cho một tìm kiếm người ta muốn được trả lời mà chưa có video nào tốt.</span></div>
  <div class="kv"><span class="k">Autocomplete</span><span class="v">Gợi ý tìm kiếm tự động — hé lộ những lượt tìm thật, đang diễn ra.</span></div>
  <div class="kv"><span class="k">Build in public</span><span class="v">Biến chính dự án đang làm của bạn thành nội dung, theo từng bước đi.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Vấn đề gần như luôn là cất giữ, không phải sáng tạo — ghi mọi ý vào /creator/ideas ngay lúc nó nảy ra, chưa cần chỉn chu.</li>
  <li>Tám nguồn tự đầy lại: câu hỏi người xem, nhật ký tự học, gợi ý tìm kiếm, tab Trends của YouTube, Google Trends, video vượt trội, nhóm cộng đồng, dự án của chính bạn.</li>
  <li>Tab Trends của YouTube (nhiều người vẫn quen gọi "Research") hiện Top searches, Breakout videos, Recent videos và Content gaps for Shorts.</li>
  <li>Video vượt trội là một cách làm, không phải một tính năng — sắp tab Videos của một kênh theo phổ biến nhất và hỏi vì sao nó nổi trước khi bắt chước bất cứ điều gì.</li>
</ul>
<div class="link-card"><a href="https://support.google.com/youtube/answer/11962757?hl=en" target="_blank" rel="noopener">YouTube Help — Explore trends on YouTube (tab Trends)</a></div>
<div class="link-card"><a href="https://trends.google.com/trends/" target="_blank" rel="noopener">Google Trends — so sánh mức quan tâm theo thời gian và khu vực</a></div>
</div>
`,
    },

    /* ─────────────────── 2.2 thẩm định ý tưởng ─────────────────── */
    {
      title: '2.2 — Judging an idea before you film it|||2.2 — Thẩm định ý tưởng trước khi quay',
      slug: 'cr-02-2-tham-dinh-y-tuong',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Một bảng chấm bốn tiêu chí để chốt điểm 1–5 sao, luật "đóng gói trước khi quay" — viết tiêu đề và phác thumbnail trước, và cách thử rẻ bằng video ngắn trước khi đầu tư video dài.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>Not every idea in the bank deserves your Saturday — a two-minute filter tells you which ones do</h2>
<p class="lead">Twenty ideas from last lesson is a good problem to have, and also a new one: you cannot film all twenty this week. This lesson gives you a fast way to sort them, a rule that catches weak ideas before you ever pick up a camera, and the cheapest possible way to test one you are still unsure about.</p>

<h3>Four questions, one number</h3>
${slide('cr-02', 6, 'Chấm điểm trước khi quay')}
<p>The single 1–5 star field on an idea card in <code>/creator/ideas</code> is deliberately just one number — but arriving at it honestly means weighing four things first, on paper or in your head, before you touch the star widget:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Demand</span><span class="v">Does anyone actually search for or ask this? An idea with no evidence of demand from Lesson 2.1's sources starts weak, however interesting it is to you.</span></div>
  <div class="kv"><span class="k">Your edge</span><span class="v">Can you do this better, more specifically, or from more lived experience than what already exists? "I can also explain this" is not an edge; "I hit this exact error building cuongthai.com" is.</span></div>
  <div class="kv"><span class="k">Effort</span><span class="v">Does it fit in the time you actually have this week? A brilliant idea that needs three days you do not have is not ready — not dead, just not now.</span></div>
  <div class="kv"><span class="k">Packageable</span><span class="v">Can you picture a title and a thumbnail right now? If nothing comes, the idea is still too vague to film.</span></div>
</div>
<p>A worked example from the slide: "Deploy Next.js to a VPS, start to finish" scores 5/5/2/5 — high demand, a real edge (you have done this on your own site), low effort this week (it is a long shoot), strong packaging — total 17. "A history of JavaScript" scores 2/2/3/3 for a total of 10: nobody is asking, you have no special angle, and it is not obviously packageable either. The number is not a law — it is a fast way to notice when an idea you like on instinct is actually thin on the things that make a video work.</p>

<h3>Packaging comes before filming, not after</h3>
${slide('cr-02', 7, 'Đóng gói TRƯỚC khi quay')}
<p><strong>Packaging</strong> (đóng gói) means writing the title and sketching the thumbnail before you shoot a single frame — the opposite of the common order, where the title gets bolted on afterward because something has to go in the box. Filming first and packaging later produces exactly what you would expect: a vague title like "Learning Next.js, part 3" that promises nothing, because nothing was promised when the plan was made.</p>
<p>The test is simple and a little uncomfortable: if you cannot write a title that would make <em>you</em> click, on a normal day, scrolling past it — do not film yet. That is not a failure, it is useful information: the idea needs one more pass of refining (back to Đã gọt in the Idea Bank) before it earns a shoot day. Chapter 25 goes deep on writing titles and designing thumbnails; this lesson only asks you to attempt the title early enough that it can steer the shoot, not just describe it afterward.</p>

<h3>Test cheap before you build big</h3>
${slide('cr-02', 8, 'Thử rẻ trước, làm lớn sau')}
<p>Some ideas score well on paper and you are still not sure. For those, there is a cheaper move than committing to a full long video: film a 45-second short the same evening, post it, and read what comes back — did people watch to the end, share it, or comment asking for more? A weak short costs you one evening. A weak long video, scripted and shot properly, costs you the better part of a week. When the short performs, the long version already has proof of demand behind it; when it does not, you have lost almost nothing. "Performs" does not require Studio-level analytics here — a short people watch to the end, share, or comment on asking "when's the full video?" is a clear enough signal to commit; one that gets scrolled past in silence is a clear enough signal to let the idea sit in Đã cất a little longer.</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — scoring by how excited you feel.</strong> Excitement is real but it is not one of the four criteria. An idea that thrills you and scores low on demand and packaging is a diary entry, not necessarily a video — at least not yet.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Trap — treating a low score as a death sentence.</strong> A 10 this week during exam season might be a 15 next month when you have a free weekend. Đã cất exists precisely so a low-scoring idea has somewhere to wait instead of getting deleted.</p></div>

<h3>🎬 Practice (25 minutes)</h3>
<div class="callout ok"><ol>
<li>Open the 20 ideas from Lesson 2.1. For each, weigh the four criteria and set a single 1–5 star score on the card.</li>
<li>Sort by score. Pick the top 5.</li>
<li>For the top 3, write an actual title — one you would click. If you cannot, move that idea back toward "Đã gọt" instead of forcing a score.</li>
<li>Pick one idea you are genuinely unsure about and plan a 45-second cheap test for it this week.</li>
</ol><p><strong>Done when:</strong> all 20 ideas are scored, the top 5 are identified, 3 have real titles, and one has a cheap-test plan written down.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Packaging</span><span class="v">The title and thumbnail — the promise a viewer sees before pressing play.</span></div>
  <div class="kv"><span class="k">Edge</span><span class="v">What makes you specifically able to do this idea better than what already exists.</span></div>
  <div class="kv"><span class="k">Cheap test</span><span class="v">A short, low-cost version of an idea made to read real demand before investing in the full version.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Weigh demand, edge, effort and packageability before settling on the single 1–5 score the Idea Bank stores.</li>
  <li>Write the title and sketch the thumbnail before filming — if no title makes you want to click, refine the idea further first.</li>
  <li>When unsure, test cheap with a 45-second short before committing a full week to a long video.</li>
  <li>A low score is a "not now", not a "never" — that is exactly what Đã cất is for.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Không phải ý tưởng nào trong kho cũng xứng đáng với ngày thứ Bảy của bạn — một phép lọc hai phút cho biết ý nào xứng</h2>
<p class="lead">Hai mươi ý tưởng từ bài trước là một vấn đề tốt để có, và cũng là một vấn đề mới: bạn không thể quay cả hai mươi trong tuần này. Bài này cho bạn một cách lọc nhanh, một luật bắt được ý tưởng yếu trước khi bạn kịp cầm máy quay, và cách thử rẻ nhất có thể cho ý tưởng bạn vẫn còn phân vân.</p>

<h3>Bốn câu hỏi, một con số</h3>
${slide('cr-02', 6, 'Chấm điểm trước khi quay')}
<p>Ô điểm 1–5 sao duy nhất trên mỗi thẻ ý tưởng trong <code>/creator/ideas</code> được thiết kế có chủ đích là chỉ MỘT con số — nhưng để chốt nó một cách thành thật thì phải cân bốn điều trước, trên giấy hoặc trong đầu, trước khi bạn chạm vào ô sao:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Nhu cầu</span><span class="v">Có ai thật sự tìm kiếm hay hỏi về điều này không? Một ý tưởng không có bằng chứng nhu cầu từ các nguồn ở Bài 2.1 bắt đầu yếu, dù nó thú vị với riêng bạn tới đâu.</span></div>
  <div class="kv"><span class="k">Lợi thế của bạn</span><span class="v">Bạn làm được điều này tốt hơn, cụ thể hơn, hay từ trải nghiệm sống thật nhiều hơn những gì đã có không? "Mình cũng giải thích được" không phải lợi thế; "mình từng dính đúng lỗi này khi xây cuongthai.com" mới là.</span></div>
  <div class="kv"><span class="k">Công sức</span><span class="v">Nó có vừa với thời gian bạn thật sự có tuần này không? Một ý tưởng hay tới đâu mà cần ba ngày bạn không có thì chưa sẵn sàng — không phải chết hẳn, chỉ là chưa phải lúc.</span></div>
  <div class="kv"><span class="k">Đóng gói được</span><span class="v">Ngay bây giờ bạn hình dung ra được một tiêu đề và một thumbnail chưa? Nếu không nghĩ ra gì cả, ý tưởng vẫn còn quá mơ hồ để quay.</span></div>
</div>
<p>Ví dụ đã chấm sẵn trên slide: "Deploy Next.js lên VPS từ A tới Z" được 5/5/2/5 — nhu cầu cao, lợi thế thật (bạn đã làm việc này trên chính web của mình), công sức thấp tuần này (đây là một buổi quay dài), đóng gói tốt — tổng 17. "Lịch sử của JavaScript" chỉ 2/2/3/3, tổng 10: chẳng ai đang hỏi, bạn không có góc nhìn riêng, và cũng không dễ đóng gói. Con số không phải luật cứng — nó là cách nhanh để nhận ra khi một ý tưởng bạn thích theo bản năng thật ra mỏng ở những thứ làm nên một video hiệu quả.</p>

<h3>Đóng gói đến TRƯỚC khi quay, không phải sau</h3>
${slide('cr-02', 7, 'Đóng gói TRƯỚC khi quay')}
<p><strong>Đóng gói</strong> (packaging) nghĩa là viết tiêu đề và phác thumbnail trước khi bạn quay dù chỉ một khung hình — ngược với thứ tự thường gặp, nơi tiêu đề bị gắn vào sau cùng vì phải có gì đó điền vào ô đó. Quay trước rồi mới đóng gói sau cho ra đúng thứ bạn đoán được: một tiêu đề mơ hồ kiểu "Học Next.js phần 3" không hứa hẹn gì cả, vì chẳng có lời hứa nào được đặt ra lúc lên kế hoạch.</p>
<p>Phép thử rất đơn giản và hơi khó chịu một chút: nếu bạn không viết nổi một tiêu đề khiến <em>chính bạn</em> muốn bấm vào, vào một ngày bình thường, đang lướt ngang qua nó — thì đừng quay vội. Đó không phải thất bại, mà là thông tin hữu ích: ý tưởng cần thêm một lượt gọt giũa (quay lại trạng thái Đã gọt trong Kho ý tưởng) trước khi nó xứng đáng một ngày quay. Chương 25 sẽ đi sâu vào viết tiêu đề và thiết kế thumbnail; bài này chỉ yêu cầu bạn thử viết tiêu đề đủ sớm để nó dẫn dắt buổi quay, chứ không chỉ mô tả lại nó sau khi đã quay xong.</p>

<h3>Thử rẻ trước khi làm lớn</h3>
${slide('cr-02', 8, 'Thử rẻ trước, làm lớn sau')}
<p>Vài ý tưởng chấm điểm tốt trên giấy mà bạn vẫn chưa chắc. Với những ý đó, có một nước đi rẻ hơn việc đầu tư hẳn một video dài: quay một video ngắn 45 giây ngay tối đó, đăng lên, rồi đọc phản hồi — người ta có xem hết không, có chia sẻ không, có bình luận hỏi thêm không? Một video ngắn yếu tốn của bạn một buổi tối. Một video dài yếu, đã viết kịch bản và quay tử tế, tốn gần cả một tuần. Khi video ngắn hiệu quả, bản dài đã có sẵn bằng chứng nhu cầu phía sau; khi nó không hiệu quả, bạn gần như chẳng mất gì. "Hiệu quả" ở đây không cần số liệu kiểu Studio gì cao siêu — một video ngắn được xem hết, được chia sẻ, hay có người bình luận hỏi "bao giờ ra bản đầy đủ?" là tín hiệu đủ rõ để đầu tư bản dài; một video bị lướt qua trong im lặng là tín hiệu đủ rõ để ý tưởng đó nằm ở Đã cất thêm một thời gian nữa.</p>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — chấm điểm theo mức hào hứng của bạn.</strong> Hào hứng là có thật nhưng nó không phải một trong bốn tiêu chí. Một ý khiến bạn phấn khích mà chấm thấp ở nhu cầu và đóng gói là một trang nhật ký, chưa chắc là một video — ít nhất là chưa phải bây giờ.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — coi điểm thấp là án tử.</strong> Một điểm 10 vào tuần thi có thể thành 15 vào tháng sau khi bạn có một cuối tuần rảnh. Đã cất tồn tại chính là để một ý điểm thấp có chỗ chờ, thay vì bị xoá.</p></div>

<h3>🎬 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
<li>Mở 20 ý tưởng từ Bài 2.1. Với mỗi ý, cân bốn tiêu chí rồi chốt một điểm 1–5 sao duy nhất trên thẻ.</li>
<li>Sắp theo điểm. Chọn 5 ý cao nhất.</li>
<li>Với 3 ý cao nhất, viết một tiêu đề thật — tiêu đề bạn sẽ bấm vào. Nếu không viết nổi, đưa ý đó về gần "Đã gọt" thay vì ép chấm điểm.</li>
<li>Chọn một ý bạn thật sự còn phân vân và lên kế hoạch thử rẻ 45 giây cho nó trong tuần này.</li>
</ol><p><strong>Đạt khi:</strong> cả 20 ý đã được chấm điểm, 5 ý cao nhất đã xác định, 3 ý có tiêu đề thật, và một ý có kế hoạch thử rẻ đã viết ra.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Đóng gói (packaging)</span><span class="v">Tiêu đề và thumbnail — lời hứa người xem thấy trước khi bấm play.</span></div>
  <div class="kv"><span class="k">Lợi thế (edge)</span><span class="v">Điều khiến riêng bạn làm được ý tưởng này tốt hơn những gì đã có.</span></div>
  <div class="kv"><span class="k">Thử rẻ (cheap test)</span><span class="v">Một bản ngắn, chi phí thấp của một ý tưởng, làm để đọc nhu cầu thật trước khi đầu tư bản đầy đủ.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Cân nhu cầu, lợi thế, công sức và khả năng đóng gói trước khi chốt con số 1–5 duy nhất mà Kho ý tưởng lưu lại.</li>
  <li>Viết tiêu đề và phác thumbnail trước khi quay — không tiêu đề nào khiến bạn muốn bấm thì gọt ý tưởng thêm trước đã.</li>
  <li>Chưa chắc thì thử rẻ bằng video ngắn 45 giây trước khi bỏ cả tuần cho video dài.</li>
  <li>Điểm thấp là "chưa phải lúc", không phải "không bao giờ" — đó chính xác là việc của Đã cất.</li>
</ul>
</div>
`,
    },

    /* ─────────────────── 2.3 trụ cột, series & lịch đăng ─────────────────── */
    {
      title: '2.3 — Pillars, series and a cadence you can keep|||2.3 — Trụ cột, series và một nhịp đăng giữ được',
      slug: 'cr-02-3-tru-cot-lich-dang',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Biến trụ cột thương hiệu thành series có tên, chọn một nhịp đăng giữ được cả tuần thi, và cách /creator/calendar thật sự hoạt động — chỉ hai mốc mỗi dự án, khác với bảng tiến độ /creator/pipeline.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.3</span>
<h2>A pillar tells you what to film about — a series and a calendar tell you when</h2>
<p class="lead">Lesson 1.4 gave your channel 3–4 content pillars. On their own, pillars are still abstract — "teaching" is not a plan for next Tuesday. This lesson turns each pillar into a named series with its own rhythm, picks a cadence a student can actually sustain, and shows you exactly what <code>/creator/calendar</code> does and does not track.</p>

<h3>Turn a pillar into a series people come back for</h3>
${slide('cr-02', 9, 'Trụ cột → series có tên')}
<p>A <strong>series</strong> is a pillar with a name and a rhythm: not "I make teaching videos" but <em>"Real web from zero"</em>, one feature per episode, every week. A name gives a viewer a reason to come back for the next one specifically, instead of hoping you post something good eventually. It also gives you a smaller decision each week — not "what do I film", but "what's the next episode of this".</p>
<table>
  <tr><th>Pillar</th><th>Series</th><th>Cadence</th></tr>
  <tr><td>Teaching</td><td>"Real web from zero" — one feature per episode</td><td>1 long video / week</td></tr>
  <tr><td>Journey</td><td>"Build in public — week #n"</td><td>1 short / week</td></tr>
  <tr><td>Behind the scenes</td><td>"A day in the life of an FPTU student"</td><td>every 2 weeks</td></tr>
  <tr><td>Tools</td><td>"What I actually use"</td><td>when there is something worth saying</td></tr>
</table>
<p>This is not just a naming trick — it is a real field. Open a project's <strong>Tổng quan</strong> (Overview) tab in <code>/creator/projects/[id]</code> and you will find <code>seriesName</code> and an episode number. Fill them in and the series name and episode show up on the project's card in the pipeline board, so a glance at the board tells you which series is falling behind.</p>

<h3>A cadence you can keep beats one that looks impressive for two weeks</h3>
${slide('cr-02', 10, 'Nhịp đăng thực tế cho sinh viên (ví dụ)')}
<p>A workable starting cadence for a student with classes: <strong>1 long video a week, 2–3 shorts a week, 1 batching session a week</strong> to shoot all of it, and <strong>2 finished videos always sitting in reserve</strong> — a buffer so a bad week (exams, a sick day, a broken hard drive) does not mean an empty channel. Consistency beats volume: pick a rhythm you can hold <em>through exam week</em>, not just during a calm one, then raise it once that rhythm feels automatic rather than effortful.</p>

<h3>Planning four weeks — and what the real calendar actually stores</h3>
${slide('cr-02', 11, 'Nhịp 4 tuần — kế hoạch của bạn')}
<p>A four-week plan you sketch yourself — on paper, in notes, or in a table like this one — is not a screenshot of any page on the site; it is your own working rhythm. A realistic one is not perfectly even: in the example above, the long video lands exactly once a week all four weeks, while shorts land unevenly — one in week 1, two in week 2, one plus a vlog in week 3, none in week 4 (a deliberate Sunday off, replaced by a data-review session). That unevenness is normal. The cadence numbers above are a ceiling to aim for, not a quota you must hit every single week without exception.</p>
${slide('cr-02', 12, '/creator/calendar thật: chỉ hai mốc mỗi dự án')}
<p>The real <code>/creator/calendar</code> is narrower than a weekly planning table, on purpose. It has two view modes — <strong>Tháng</strong> (Month, a grid with a coloured dot per event) and <strong>Lịch trình</strong> (Agenda, a list grouped by week) — and every project can carry exactly <strong>two</strong> dates: a filming date (amber dot, "Quay") and a publish date (emerald dot, "Đăng"). Click an empty day and two buttons appear, <strong>"Lên lịch quay"</strong> and <strong>"Lên lịch đăng"</strong>, which open the new-project form with that date already filled in; for an existing project, the same two dates live in its Tổng quan tab, right next to the series name. A "Sắp tới" (Up next) panel lists your next three dates, and a footer link opens the full project list.</p>
<p class="note-ct"><strong>What the calendar does not do:</strong> it has no idea of "scripting" or "editing" as calendar events — those are production <em>stages</em>, not dates. To see a project move through Ý tưởng → Viết kịch bản → Đang quay → Đang dựng → Đã lên lịch → Đã đăng, that is <code>/creator/pipeline</code>, a Kanban board where you drag a card across columns to change its stage. The calendar answers "when"; the pipeline answers "how far along".</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — booking every single day.</strong> A cadence with zero rest days breaks the first time something goes wrong, because there is no slack to absorb it. The buffer videos and the occasional day off in the plan above are not optional extras — they are what keeps a cadence alive through a bad week.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Trap — naming a series and dropping it after episode one.</strong> A series with no episode 2 reads worse than no series at all — it tells a returning viewer this channel does not follow through. If you start a series, plan at least three episodes before you announce it as one.</p></div>

<h3>🎬 Practice (25 minutes)</h3>
<div class="callout ok"><ol>
<li>Name 2–3 series from your pillars (Lesson 1.4), one line each: pillar → series name → cadence.</li>
<li>Open one promoted idea's project, go to its Tổng quan tab, and fill in <code>seriesName</code> and episode number 1.</li>
<li>Set that project's filming date and publish date, either in Tổng quan or by clicking a day in <code>/creator/calendar</code>.</li>
<li>Sketch your own 4-week plan on paper or in notes, following the example above — it is fine if it is not perfectly even.</li>
</ol><p><strong>Done when:</strong> 2–3 named series exist on paper, one real project has a series name, episode 1, a film date and a publish date, and a 4-week sketch is written down.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Series</span><span class="v">A pillar with a name and a rhythm — stored as seriesName + episode number on a project.</span></div>
  <div class="kv"><span class="k">Cadence</span><span class="v">How often you publish, chosen for sustainability over impressiveness.</span></div>
  <div class="kv"><span class="k">Batching</span><span class="v">Shooting several videos in one session to amortise the cost of setting up lights, audio and framing.</span></div>
  <div class="kv"><span class="k">Buffer</span><span class="v">Finished videos kept in reserve so a bad week does not mean a missed upload.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>A pillar becomes a series once it has a name and a cadence — stored as seriesName + episode number on a project.</li>
  <li>A workable student cadence: 1 long/week, 2–3 shorts/week, 1 batching session, 2 videos always in reserve.</li>
  <li>/creator/calendar only stores two dates per project — filming (amber) and publish (emerald); production stages live on /creator/pipeline instead.</li>
  <li>A real four-week plan is uneven by nature — the cadence is a ceiling to aim for, not a weekly quota.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.3</span>
<h2>Trụ cột nói bạn quay VỀ CÁI GÌ — series và lịch nói bạn quay KHI NÀO</h2>
<p class="lead">Bài 1.4 đã cho kênh của bạn 3–4 trụ cột nội dung. Tự thân, trụ cột vẫn còn trừu tượng — "dạy học" không phải một kế hoạch cho thứ Ba tuần sau. Bài này biến mỗi trụ cột thành một series có tên với nhịp riêng, chọn một nhịp đăng mà một sinh viên thật sự giữ được, và cho bạn thấy chính xác <code>/creator/calendar</code> theo dõi được gì và KHÔNG theo dõi được gì.</p>

<h3>Biến trụ cột thành series khiến người ta quay lại tìm</h3>
${slide('cr-02', 9, 'Trụ cột → series có tên')}
<p><strong>Series</strong> là một trụ cột có tên và có nhịp: không phải "mình làm video dạy học" mà là <em>"Web thật từ số 0"</em>, mỗi tập một tính năng, đều đặn mỗi tuần. Một cái tên cho người xem một lý do cụ thể để quay lại tìm tập tiếp theo, thay vì mong bạn đăng được thứ gì đó hay ho một lúc nào đó. Nó cũng cho bạn một quyết định nhỏ hơn mỗi tuần — không phải "tuần này quay gì", mà là "tập tiếp theo của cái này là gì".</p>
<table>
  <tr><th>Trụ cột</th><th>Series</th><th>Nhịp</th></tr>
  <tr><td>Dạy</td><td>"Web thật từ số 0" — mỗi tập một tính năng</td><td>1 video dài / tuần</td></tr>
  <tr><td>Hành trình</td><td>"Build in public — tuần #n"</td><td>mỗi tuần 1 short</td></tr>
  <tr><td>Hậu trường</td><td>"Một ngày của SV FPTU"</td><td>2 tuần / lần</td></tr>
  <tr><td>Công cụ</td><td>"Công cụ mình dùng thật"</td><td>khi có thứ đáng nói</td></tr>
</table>
<p>Đây không chỉ là một mẹo đặt tên — nó là một trường dữ liệu thật. Mở tab <strong>Tổng quan</strong> của một dự án trong <code>/creator/projects/[id]</code> và bạn sẽ thấy ô <code>seriesName</code> (tên series) cùng số tập. Điền vào và tên series cùng số tập hiện ngay trên thẻ dự án ở bảng tiến độ, nên chỉ cần liếc bảng là biết series nào đang bị chậm.</p>

<h3>Một nhịp giữ được hơn một nhịp trông ấn tượng trong hai tuần</h3>
${slide('cr-02', 10, 'Nhịp đăng thực tế cho sinh viên (ví dụ)')}
<p>Một nhịp khởi đầu khả thi cho sinh viên còn phải học: <strong>1 video dài/tuần, 2–3 video ngắn/tuần, 1 buổi quay dồn/tuần</strong> để quay hết chỗ đó, và <strong>luôn có sẵn 2 video đã dựng xong làm dự trữ</strong> — một khoản đệm để một tuần tồi tệ (thi cử, ốm, hỏng ổ cứng) không có nghĩa là kênh trống trơn. Đều đặn thắng số lượng: chọn một nhịp bạn giữ được <em>ngay cả trong tuần thi</em>, không chỉ trong một tuần rảnh rang, rồi mới tăng lên khi nhịp đó thấy tự nhiên chứ không còn gắng sức.</p>

<h3>Lên kế hoạch bốn tuần — và lịch thật sự lưu những gì</h3>
${slide('cr-02', 11, 'Nhịp 4 tuần — kế hoạch của bạn')}
<p>Một kế hoạch bốn tuần bạn tự phác — trên giấy, trong ghi chú, hay trong một bảng như trên — không phải ảnh chụp một trang nào trên web; đó là nhịp làm việc của riêng bạn. Một kế hoạch thực tế thì không đều tăm tắp: trong ví dụ trên, video dài đúng một lần mỗi tuần suốt cả bốn tuần, còn video ngắn thì dồn không đều — một cái ở tuần 1, hai cái ở tuần 2, một cái cộng một vlog ở tuần 3, không cái nào ở tuần 4 (chủ nhật nghỉ có chủ đích, thay bằng một buổi đọc số liệu). Sự không đều đó là bình thường. Các con số nhịp ở trên là một MỨC TRẦN để nhắm tới, không phải một chỉ tiêu phải đạt tuyệt đối từng tuần.</p>
${slide('cr-02', 12, '/creator/calendar thật: chỉ hai mốc mỗi dự án')}
<p><code>/creator/calendar</code> thật hẹp hơn một bảng kế hoạch hằng tuần, có chủ đích. Nó có hai chế độ xem — <strong>Tháng</strong> (một lưới với một chấm màu cho mỗi mốc) và <strong>Lịch trình</strong> (một danh sách theo từng tuần) — và mỗi dự án chỉ mang được đúng <strong>hai</strong> ngày: ngày quay (chấm hổ phách, "Quay") và ngày đăng (chấm ngọc lục bảo, "Đăng"). Bấm vào một ngày trống, hai nút hiện ra, <strong>"Lên lịch quay"</strong> và <strong>"Lên lịch đăng"</strong>, mở sẵn form dự án mới với ngày đó đã điền trước; với một dự án đã có sẵn, đúng hai ngày này nằm trong tab Tổng quan của nó, ngay cạnh tên series. Một khung "Tiếp theo" liệt kê ba mốc gần nhất, và một liên kết ở chân trang mở danh sách dự án đầy đủ.</p>
<p class="note-ct"><strong>Điều lịch KHÔNG làm:</strong> nó không biết gì về "viết kịch bản" hay "đang dựng" như những mốc trên lịch — đó là các GIAI ĐOẠN sản xuất, không phải ngày tháng. Muốn thấy một dự án đi qua Ý tưởng → Viết kịch bản → Đang quay → Đang dựng → Đã lên lịch → Đã đăng, đó là việc của <code>/creator/pipeline</code>, một bảng Kanban nơi bạn kéo thẻ qua các cột để đổi giai đoạn. Lịch trả lời "khi nào"; bảng tiến độ trả lời "tới đâu rồi".</p>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — kín lịch mọi ngày.</strong> Một nhịp không có ngày nghỉ nào vỡ ngay lần đầu có chuyện bất ngờ, vì không còn khoảng trống để hấp thụ nó. Video dự trữ và ngày nghỉ thỉnh thoảng trong kế hoạch trên không phải phần thêm cho vui — đó là thứ giữ cho một nhịp sống sót qua một tuần tồi tệ.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — đặt tên series rồi bỏ ngang sau tập một.</strong> Một series không có tập 2 còn tệ hơn không có series nào — nó nói với người xem quay lại rằng kênh này không làm tới nơi tới chốn. Nếu bắt đầu một series, hãy lên kế hoạch ít nhất ba tập trước khi công bố nó là một series.</p></div>

<h3>🎬 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
<li>Đặt tên 2–3 series từ trụ cột của bạn (Bài 1.4), mỗi cái một dòng: trụ cột → tên series → nhịp.</li>
<li>Mở dự án của một ý tưởng đã nâng, vào tab Tổng quan, điền <code>seriesName</code> và số tập 1.</li>
<li>Đặt ngày quay và ngày đăng cho dự án đó, hoặc trong tab Tổng quan, hoặc bằng cách bấm vào một ngày trên <code>/creator/calendar</code>.</li>
<li>Phác kế hoạch 4 tuần của riêng bạn trên giấy hoặc ghi chú, theo ví dụ trên — không sao nếu nó không đều tăm tắp.</li>
</ol><p><strong>Đạt khi:</strong> có 2–3 series đã đặt tên trên giấy, một dự án thật có tên series, tập 1, ngày quay và ngày đăng, và một bản phác kế hoạch 4 tuần đã viết ra.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Series</span><span class="v">Một trụ cột có tên và có nhịp — lưu thành seriesName + số tập trên dự án.</span></div>
  <div class="kv"><span class="k">Nhịp đăng (cadence)</span><span class="v">Tần suất bạn đăng, chọn vì giữ được lâu dài chứ không phải vì trông ấn tượng.</span></div>
  <div class="kv"><span class="k">Quay dồn (batching)</span><span class="v">Quay nhiều video trong một buổi để chia đều chi phí dựng đèn, âm thanh, khung hình.</span></div>
  <div class="kv"><span class="k">Video dự trữ (buffer)</span><span class="v">Video đã dựng xong giữ lại để một tuần tồi tệ không thành một lần lỡ đăng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Một trụ cột thành series khi nó có tên và có nhịp — lưu thành seriesName + số tập trên dự án.</li>
  <li>Một nhịp khả thi cho sinh viên: 1 dài/tuần, 2–3 ngắn/tuần, 1 buổi quay dồn, luôn có 2 video dự trữ.</li>
  <li>/creator/calendar chỉ lưu đúng hai ngày mỗi dự án — ngày quay (hổ phách) và ngày đăng (ngọc lục bảo); các giai đoạn sản xuất nằm ở /creator/pipeline.</li>
  <li>Một kế hoạch 4 tuần thật sự không đều tăm tắp — nhịp đăng là mức trần để nhắm tới, không phải chỉ tiêu từng tuần.</li>
</ul>
</div>
`,
    },

    /* ─────────────────── 2.4 tái sử dụng nội dung ─────────────────── */
    {
      title: '2.4 — One video, five pieces of content|||2.4 — Một video, năm mảnh nội dung',
      slug: 'cr-02-4-tai-su-dung-noi-dung',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Một buổi quay dồn cho ra nguyên liệu cho cả kim tự tháp tái sử dụng: video dài → video ngắn → bài viết → bài đăng cộng đồng → câu hỏi cho video sau, và cách đăng chéo sạch giữa các nền tảng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.4</span>
<h2>One afternoon of filming should not produce one piece of content</h2>
<p class="lead">Lesson 2.3 ended with a batching session — several videos shot in one sitting because setting up lights and audio is the expensive part, not the recording itself. This lesson finishes the thought: that same footage, and the thinking behind it, can become far more than the videos you planned to cut from it, if you deliberately reuse it instead of moving straight to the next idea.</p>

<h3>What one batching session actually buys you</h3>
${slide('cr-02', 13, 'Quay dồn một buổi — nhiều video')}
<p>A concrete six-hour session: <strong>9:00–9:30</strong> setting up lights, audio and framing, <strong>9:30–12:00</strong> filming the A-roll of the long video from your two-column script (Chapter 3), <strong>12:00–13:30</strong> filming three short videos in the same setup, changing only your shirt so they do not look identical to the long video's audience, <strong>13:30–14:30</strong> B-roll (hands typing, screen close-ups, cutaways), <strong>14:30–15:00</strong> a thumbnail photo shoot with the iPhone's 48MP camera. Setup happens once; everything after it is close to free. That is the actual argument for batching — not that it saves time on any single video, but that it turns fixed setup cost into output for four or five pieces at once.</p>

<h3>The repurposing pyramid</h3>
${slide('cr-02', 14, 'Kim tự tháp tái sử dụng')}
<p>One long YouTube video is the base of research, scripting and careful filming — the most expensive thing you make. Everything below it in the pyramid is cheaper to produce precisely because the thinking is already done:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">3–5 shorts</span><span class="v">The single best moment, insight or punchline from the long video, each recut as its own Short / Reel / TikTok with its own hook.</span></div>
  <div class="kv"><span class="k">1 article on cuongthai.com</span><span class="v">The commands, code and diagrams that are awkward to pause-and-copy from a video — written out properly, once.</span></div>
  <div class="kv"><span class="k">A community post</span><span class="v">One image plus one lesson, for Facebook or LinkedIn — a fraction of the effort of a video, reaching people who scroll rather than watch.</span></div>
  <div class="kv"><span class="k">A question for the next video</span><span class="v">Comments on this video are Lesson 2.1's first source, already primed with people who care about this exact topic.</span></div>
</div>
<p>The order matters less than the habit: before starting the next idea from your list, spend twenty minutes asking what this one shoot can still become. A long video that only ever becomes one YouTube upload wasted most of what the batching session paid for.</p>

<h3>Cross-posting without wrecking either platform</h3>
${slide('cr-02', 15, 'Đăng chéo đúng cách')}
<p>Reusing content across platforms only works if each version looks like it belongs there. Export one clean master with <strong>no watermark</strong>, cut a proper vertical version for short-form instead of dropping the 16:9 file into a 9:16 feed, and rewrite the caption for each destination rather than pasting the same hashtags everywhere.</p>
<p>This is not just a taste preference — Instagram said so directly. In a February 2021 post from its official Creators account, Instagram stated that low-quality or <em>visibly recycled</em> Reels — specifically content carrying logos or watermarks from other apps — would become less discoverable in places like the Reels tab. Re-uploading a watermarked TikTok clip straight to Reels still reaches your existing followers normally; it is the broader discovery placement that gets throttled. Re-exporting your own clean file instead costs a few extra minutes and avoids the penalty entirely.</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — treating repurposing as an afterthought.</strong> If you only remember to cut shorts "if there's time," there rarely is. Block the twenty minutes for repurposing into the same batching session, right after B-roll, while the material is still fresh in your head.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Trap — posting everything at once with identical captions.</strong> Same file, same caption, same moment, on four platforms reads as automation, not a person talking to that platform's audience specifically. Stagger it and write one caption per destination.</p></div>

<h3>🎬 Practice (20 minutes)</h3>
<div class="callout ok"><ol>
<li>Take one video idea already scored highly in Lesson 2.2 (filmed or still planned) and write out its full repurposing pyramid: 3–5 short hooks, one article outline, one community-post angle, one likely follow-up question.</li>
<li>Check any footage or export you already have for third-party watermarks. Re-export clean if you find one.</li>
<li>Write two different captions — not just a shorter/longer version of one sentence — for two different platforms you would post the same clip to.</li>
</ol><p><strong>Done when:</strong> a written pyramid exists for one idea, one watermark check is done, and two genuinely different captions are written.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Batching</span><span class="v">Filming several pieces in one session to spend the setup cost once.</span></div>
  <div class="kv"><span class="k">Repurposing</span><span class="v">Turning one piece of content into several formats without redoing the underlying work.</span></div>
  <div class="kv"><span class="k">A-roll / B-roll</span><span class="v">The main talking footage / supporting cutaway footage (hands, screen, environment).</span></div>
  <div class="kv"><span class="k">Cross-posting</span><span class="v">Publishing adapted versions of the same content across platforms.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Batching pays off because setup (lights, audio, framing) happens once for several pieces of output.</li>
  <li>The repurposing pyramid: 1 long video → 3–5 shorts → 1 article → 1 community post → questions for the next video.</li>
  <li>Cross-post a clean, watermark-free export with a platform-specific caption and aspect ratio — not the same file everywhere.</li>
  <li>Instagram (February 2021) said Reels carrying another app's logo or watermark become less discoverable — a real, stated reach cost, not just a look.</li>
</ul>
<div class="link-card"><a href="https://www.instagram.com/p/CLFMSunBRX1/" target="_blank" rel="noopener">Instagram Creators (02/2021) — less discoverable when content is visibly recycled from other apps</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.4</span>
<h2>Một buổi chiều quay không nên chỉ ra đúng một mảnh nội dung</h2>
<p class="lead">Bài 2.3 kết thúc bằng một buổi quay dồn — nhiều video quay trong một lần ngồi, vì dựng đèn và âm thanh mới là phần tốn kém, không phải bản thân việc bấm quay. Bài này đi nốt suy nghĩ đó: đúng những thước phim ấy, và cách nghĩ đằng sau chúng, có thể trở thành nhiều hơn hẳn số video bạn định cắt ra, nếu bạn chủ động tái sử dụng thay vì lao thẳng sang ý tưởng tiếp theo.</p>

<h3>Một buổi quay dồn thật sự mua cho bạn được gì</h3>
${slide('cr-02', 13, 'Quay dồn một buổi — nhiều video')}
<p>Một buổi sáu tiếng cụ thể: <strong>9:00–9:30</strong> dựng đèn, âm thanh, khung hình, <strong>9:30–12:00</strong> quay A-roll cho video dài theo kịch bản hai cột (Chương 3), <strong>12:00–13:30</strong> quay ba video ngắn ngay trong cùng bối cảnh đó, chỉ đổi áo để chúng không trông giống hệt trước khán giả của video dài, <strong>13:30–14:30</strong> quay B-roll (tay gõ phím, cận cảnh màn hình, cảnh chêm), <strong>14:30–15:00</strong> chụp ảnh thumbnail bằng camera 48MP của iPhone. Dựng máy chỉ một lần; mọi thứ sau đó gần như miễn phí. Đó mới là lý lẽ thật của quay dồn — không phải nó tiết kiệm thời gian cho một video đơn lẻ nào, mà nó biến chi phí dựng máy cố định thành sản lượng cho bốn năm mảnh cùng lúc.</p>

<h3>Kim tự tháp tái sử dụng</h3>
${slide('cr-02', 14, 'Kim tự tháp tái sử dụng')}
<p>Một video dài trên YouTube là phần đáy của nghiên cứu, viết kịch bản và quay cẩn thận — thứ tốn kém nhất bạn làm ra. Mọi thứ nằm dưới nó trong kim tự tháp rẻ hơn để sản xuất, chính vì phần suy nghĩ đã xong rồi:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">3–5 video ngắn</span><span class="v">Khoảnh khắc, ý hay hoặc câu chốt hay nhất của video dài, mỗi cái cắt lại thành một Short / Reel / TikTok riêng với hook riêng.</span></div>
  <div class="kv"><span class="k">1 bài viết trên cuongthai.com</span><span class="v">Các lệnh, đoạn code và sơ đồ khó mà tạm dừng-rồi-chép từ video — viết lại cho tử tế, một lần.</span></div>
  <div class="kv"><span class="k">Bài đăng cộng đồng</span><span class="v">Một hình cộng một bài học, cho Facebook hay LinkedIn — công sức chỉ bằng một phần nhỏ của video, chạm tới những người lướt chứ không xem.</span></div>
  <div class="kv"><span class="k">Câu hỏi cho video sau</span><span class="v">Bình luận dưới video này chính là nguồn đầu tiên ở Bài 2.1, đã sẵn những người quan tâm đúng chủ đề này.</span></div>
</div>
<p>Thứ tự không quan trọng bằng thói quen: trước khi bắt tay vào ý tưởng tiếp theo trong danh sách, dành hai mươi phút hỏi xem buổi quay này còn có thể trở thành gì nữa. Một video dài mà chỉ mãi mãi là một lần tải lên YouTube đã lãng phí phần lớn thứ buổi quay dồn vừa trả tiền cho.</p>

<h3>Đăng chéo mà không phá hỏng nền tảng nào</h3>
${slide('cr-02', 15, 'Đăng chéo đúng cách')}
<p>Tái sử dụng nội dung qua nhiều nền tảng chỉ hiệu quả khi mỗi bản trông như thuộc về đúng nơi đó. Xuất một bản gốc sạch <strong>không watermark</strong>, dựng riêng một bản dọc cho video ngắn thay vì thả nguyên file 16:9 vào luồng 9:16, và viết lại chú thích cho từng nơi đến thay vì copy y nguyên hashtag khắp nơi.</p>
<p>Đây không chỉ là sở thích thẩm mỹ — chính Instagram đã nói thẳng điều này. Trong một bài đăng tháng 2/2021 từ tài khoản Creators chính thức, Instagram cho biết Reels chất lượng thấp hoặc <em>bị tái chế lộ liễu</em> — cụ thể là nội dung mang logo hay watermark của ứng dụng khác — sẽ ít được khám phá hơn ở những nơi như tab Reels. Đăng lại một clip TikTok còn watermark thẳng lên Reels vẫn tới được người theo dõi sẵn có của bạn như bình thường; thứ bị hãm lại là phạm vi được đề xuất rộng hơn. Xuất lại một bản sạch của chính mình chỉ tốn thêm vài phút và tránh được hoàn toàn cái giá đó.</p>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — coi tái sử dụng là việc làm thêm nếu rảnh.</strong> Nếu bạn chỉ nhớ cắt video ngắn "khi nào có thời gian", thì hiếm khi có. Chặn hẳn hai mươi phút cho việc tái sử dụng ngay trong buổi quay dồn, ngay sau khi quay B-roll, lúc nguyên liệu còn tươi trong đầu bạn.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — đăng tất cả cùng lúc với chú thích giống hệt nhau.</strong> Cùng một file, cùng một chú thích, cùng một thời điểm, trên bốn nền tảng trông như tự động hoá, không phải một người đang nói chuyện riêng với khán giả của từng nơi. Rải thời gian đăng ra và viết một chú thích cho mỗi nơi đến.</p></div>

<h3>🎬 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
<li>Lấy một ý tưởng video đã chấm điểm cao ở Bài 2.2 (đã quay hoặc còn đang định quay) và viết ra toàn bộ kim tự tháp tái sử dụng của nó: 3–5 hook video ngắn, một dàn ý bài viết, một góc bài đăng cộng đồng, một câu hỏi khả năng cao sẽ xuất hiện sau đó.</li>
<li>Kiểm bất kỳ thước phim hoặc file xuất nào bạn đã có xem có watermark của bên thứ ba không. Xuất lại bản sạch nếu thấy có.</li>
<li>Viết hai chú thích khác nhau thật sự — không chỉ một câu rút gọn/kéo dài — cho hai nền tảng khác nhau bạn sẽ đăng cùng một clip.</li>
</ol><p><strong>Đạt khi:</strong> có một kim tự tháp đã viết ra cho một ý tưởng, đã kiểm watermark một lần, và có hai chú thích thật sự khác nhau đã viết.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Quay dồn (batching)</span><span class="v">Quay nhiều mảnh trong một buổi để chỉ trả chi phí dựng máy một lần.</span></div>
  <div class="kv"><span class="k">Tái sử dụng (repurposing)</span><span class="v">Biến một nội dung thành nhiều định dạng mà không phải làm lại phần việc gốc.</span></div>
  <div class="kv"><span class="k">A-roll / B-roll</span><span class="v">Thước phim chính có người nói / thước phim phụ minh hoạ (tay, màn hình, môi trường).</span></div>
  <div class="kv"><span class="k">Đăng chéo (cross-posting)</span><span class="v">Đăng các bản đã chỉnh phù hợp của cùng một nội dung lên nhiều nền tảng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Quay dồn đáng giá vì phần dựng máy (đèn, âm thanh, khung hình) chỉ trả một lần cho nhiều sản phẩm.</li>
  <li>Kim tự tháp tái sử dụng: 1 video dài → 3–5 video ngắn → 1 bài viết → 1 bài đăng cộng đồng → câu hỏi cho video sau.</li>
  <li>Đăng chéo bằng bản xuất sạch, không watermark, kèm chú thích và tỉ lệ khung riêng cho từng nền tảng — không phải cùng một file ở khắp nơi.</li>
  <li>Instagram (2/2021) tuyên bố Reels mang logo hay watermark của app khác sẽ ít được khám phá hơn — một cái giá thật về phạm vi tiếp cận, không chỉ là chuyện thẩm mỹ.</li>
</ul>
<div class="link-card"><a href="https://www.instagram.com/p/CLFMSunBRX1/" target="_blank" rel="noopener">Instagram Creators (02/2021) — ít được khám phá hơn khi nội dung bị tái chế lộ liễu từ app khác</a></div>
</div>
`,
    },

    /* ─────────────────── 2.5 kiểm tra ─────────────────── */
    {
      title: '2.5 — Chapter 2 check|||2.5 — Kiểm tra chương 2',
      slug: 'cr-02-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu tình huống về nguồn ý tưởng, thẩm định trước khi quay, trụ cột/series/lịch đăng, và tái sử dụng nội dung.',
      content: `
<div class="ml-en">
<h2>📝 Chapter 2 — summary and self-check</h2>
<ul>
  <li><strong>Ideas:</strong> capture first, judge later — into /creator/ideas from 8 recurring sources, including YouTube's Trends tab and manually-checked outlier videos.</li>
  <li><strong>Judging:</strong> weigh demand, edge, effort and packageability before settling on one 1–5 score; write the title before filming; test cheap with a short when unsure.</li>
  <li><strong>Planning:</strong> pillars become series (seriesName + episode number); pick a cadence you keep through exam week; /creator/calendar only stores a film date and a publish date — stages live on /creator/pipeline.</li>
  <li><strong>Reuse:</strong> one batching session feeds the repurposing pyramid — long video → shorts → article → community post → next question; cross-post clean, watermark-free exports.</li>
</ul>
<p><strong>Before the quiz:</strong> do you have 20 scored ideas in /creator/ideas, and one project with a series name, film date and publish date filled in?</p>
</div>
<div class="ml-vi">
<h2>📝 Chương 2 — tóm tắt và tự kiểm</h2>
<ul>
  <li><strong>Ý tưởng:</strong> ghi trước, đánh giá sau — vào /creator/ideas từ 8 nguồn lặp lại, kể cả tab Trends của YouTube và video vượt trội kiểm bằng tay.</li>
  <li><strong>Thẩm định:</strong> cân nhu cầu, lợi thế, công sức và khả năng đóng gói trước khi chốt một điểm 1–5; viết tiêu đề trước khi quay; chưa chắc thì thử rẻ bằng video ngắn.</li>
  <li><strong>Lên kế hoạch:</strong> trụ cột thành series (seriesName + số tập); chọn nhịp giữ được kể cả tuần thi; /creator/calendar chỉ lưu ngày quay và ngày đăng — giai đoạn sản xuất nằm ở /creator/pipeline.</li>
  <li><strong>Tái sử dụng:</strong> một buổi quay dồn nuôi cả kim tự tháp — video dài → video ngắn → bài viết → bài đăng cộng đồng → câu hỏi kế tiếp; đăng chéo bằng bản xuất sạch, không watermark.</li>
</ul>
<p><strong>Trước khi làm bài:</strong> bạn đã có 20 ý tưởng đã chấm điểm trong /creator/ideas, và một dự án đã điền tên series, ngày quay, ngày đăng chưa?</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'A decent-but-unpolished video idea occurs to you on the bus. What should you do right now?|||Một ý tưởng video tạm ổn nhưng chưa chỉn chu nảy ra lúc bạn đang trên xe buýt. Bạn nên làm gì ngay lúc này?',
            options: [
              'Wait until you are at your computer so you remember it correctly|||Chờ tới lúc ngồi vào máy tính để nhớ cho chính xác',
              'Capture it into /creator/ideas immediately, even as just one rough line|||Ghi ngay vào /creator/ideas, dù chỉ là một câu chưa chỉn chu',
              'Skip it — if it were good, you would remember it later|||Bỏ qua — nếu nó hay thì bạn sẽ tự nhớ ra sau',
              'Only capture it once you have a full title and hook ready|||Chỉ ghi khi đã có sẵn tiêu đề và hook đầy đủ',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'The capture box takes a rough title and an optional hook, nothing more — and the Idea Bank explicitly does not need it polished. Waiting is how good ideas quietly disappear before dinner.|||Ô ghi nhanh chỉ cần một tiêu đề còn thô và hook tuỳ chọn, không hơn — và Kho ý tưởng nói rõ không cần chỉn chu. Chờ đợi chính là cách những ý tưởng hay lặng lẽ biến mất trước giờ cơm tối.',
          },
          {
            question: 'You want to know which search terms in your niche have real demand but no strong YouTube video answering them yet. Which official YouTube Studio feature is built exactly for this?|||Bạn muốn biết từ khoá nào trong ngách của mình có nhu cầu thật mà chưa có video YouTube nào trả lời tốt. Tính năng chính thức nào của YouTube Studio được dựng đúng cho việc này?',
            options: [
              'Comments moderation queue|||Hàng đợi duyệt bình luận',
              'Revenue analytics tab|||Tab phân tích doanh thu',
              'The Trends tab’s "Content gaps for Shorts"|||Mục "Content gaps for Shorts" trong tab Trends',
              'The end screen editor|||Trình chỉnh màn hình kết thúc',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'YouTube Help describes Content gaps for Shorts as exactly this: search terms viewers want answered where a strong Shorts result does not yet exist. The other tabs answer different questions entirely.|||YouTube Help mô tả Content gaps for Shorts đúng là việc này: từ khoá người xem muốn được trả lời mà chưa có một Shorts nào đủ tốt. Các tab kia trả lời những câu hỏi hoàn toàn khác.',
          },
          {
            question: 'Sorting a similar channel’s Videos tab by most popular, you find one video at 48,000 views while the channel usually sits at 7,000–10,000. What is the correct next move?|||Sắp tab Videos của một kênh cùng ngách theo phổ biến nhất, bạn thấy một video đạt 48.000 view trong khi kênh thường chỉ 7.000–10.000. Bước tiếp theo đúng là gì?',
            options: [
              'Ask why that specific topic pulled in so many more people before touching it yourself|||Hỏi vì sao đúng chủ đề đó kéo về nhiều người hơn hẳn trước khi tự mình động vào nó',
              'Copy its thumbnail and title exactly, word for word|||Chép y nguyên thumbnail và tiêu đề của nó, từng chữ một',
              'Ignore it — one video says nothing about demand|||Bỏ qua — một video không nói lên được gì về nhu cầu',
              'Report it as an outlier to YouTube for review|||Báo cáo nó lên YouTube để xem xét vì là video bất thường',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'An outlier is a lead about demand, not a script — the lesson is to understand why it worked (topic, title, angle, timing) and answer the same demand in your own way, not to copy the surface.|||Video vượt trội là một manh mối về nhu cầu, không phải một kịch bản để chép — bài học là hiểu vì sao nó hiệu quả (chủ đề, tiêu đề, góc nhìn, thời điểm) rồi trả lời đúng nhu cầu đó theo cách của riêng bạn, không phải chép phần bề mặt.',
          },
          {
            question: 'An idea scores high on demand and your edge, but effort is low (score 2) because it needs three days you do not have during exam week. What should you do?|||Một ý tưởng chấm cao ở nhu cầu và lợi thế, nhưng công sức thấp (điểm 2) vì cần ba ngày bạn không có trong tuần thi. Bạn nên làm gì?',
            options: [
              'Delete it — a low total score means it was never a good idea|||Xoá nó — tổng điểm thấp nghĩa là nó chưa từng là ý tưởng tốt',
              'Force the shoot this week regardless of the time it takes|||Ép quay ngay tuần này bất kể tốn bao nhiêu thời gian',
              'Ignore the effort criterion since demand and edge are already strong|||Bỏ qua tiêu chí công sức vì nhu cầu và lợi thế đã đủ mạnh',
              'Leave it captured or archived for now and revisit it when you actually have the time|||Cứ để nó ở trạng thái đã ghi hoặc đã cất, quay lại khi bạn thật sự có thời gian',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'A low score from one criterion during a busy week is "not now," not "never" — that is exactly what Đã cất is for, and the idea can be revisited once effort actually fits.|||Điểm thấp ở một tiêu chí trong tuần bận là "chưa phải lúc", không phải "không bao giờ" — đó chính xác là việc của Đã cất, và ý tưởng quay lại được khi công sức thật sự vừa sức.',
          },
          {
            question: 'You cannot think of a single title for an idea that would make you personally want to click. Per the packaging rule, what should you do?|||Bạn không nghĩ ra nổi một tiêu đề nào cho một ý tưởng khiến chính bạn muốn bấm vào. Theo luật đóng gói, bạn nên làm gì?',
            options: [
              'Film it anyway — the title can be written after editing|||Cứ quay đi — tiêu đề viết sau khi dựng cũng được',
              'Refine the idea further before filming, since it is still too vague|||Gọt ý tưởng thêm trước khi quay, vì nó vẫn còn quá mơ hồ',
              'Use a generic placeholder title like "Part 3" and move on|||Dùng một tiêu đề tạm chung chung kiểu "Phần 3" rồi làm tiếp',
              'Skip packaging entirely for this one video|||Bỏ hẳn bước đóng gói cho riêng video này',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'Packaging happens before filming on purpose — an idea with no clickable title yet is not ready to shoot; it needs another pass of refining first.|||Đóng gói diễn ra trước khi quay có chủ đích — một ý tưởng chưa có tiêu đề nào đáng bấm là chưa sẵn sàng để quay; nó cần thêm một lượt gọt giũa trước.',
          },
          {
            question: 'You are unsure whether a long-video idea has real demand. What is the cheapest way to find out before committing a full week?|||Bạn chưa chắc một ý tưởng video dài có nhu cầu thật không. Cách rẻ nhất để biết trước khi bỏ cả tuần cho nó là gì?',
            options: [
              'Ask friends in person whether they would watch it|||Hỏi trực tiếp bạn bè xem họ có xem không',
              'Commit to the full long video immediately since hesitation wastes time|||Cứ bắt tay làm hẳn video dài ngay vì do dự cũng phí thời gian',
              'Search for the topic on Google Trends and trust the graph alone|||Tìm chủ đề đó trên Google Trends và tin hẳn vào biểu đồ',
              'Film and publish a 45-second short version first, then read the response|||Quay và đăng một bản video ngắn 45 giây trước, rồi đọc phản hồi',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'A weak short costs one evening; a weak long video costs most of a week. Real audience behaviour on a cheap test beats guessing from a trends graph or asking friends who are not your actual audience.|||Một video ngắn yếu tốn một buổi tối; một video dài yếu tốn gần cả tuần. Hành vi thật của khán giả trên một phép thử rẻ đáng tin hơn đoán mò từ biểu đồ trends hay hỏi bạn bè vốn không phải khán giả thật của bạn.',
          },
          {
            question: 'What is the correct column order, left to right, on the /creator/pipeline board?|||Thứ tự cột đúng, từ trái sang phải, trên bảng /creator/pipeline là gì?',
            options: [
              'Idea → Scripting → Filming → Editing → Scheduled → Published|||Ý tưởng → Viết kịch bản → Đang quay → Đang dựng → Đã lên lịch → Đã đăng',
              'Idea → Filming → Scripting → Editing → Published → Scheduled|||Ý tưởng → Đang quay → Viết kịch bản → Đang dựng → Đã đăng → Đã lên lịch',
              'Scripting → Idea → Editing → Filming → Scheduled → Published|||Viết kịch bản → Ý tưởng → Đang dựng → Đang quay → Đã lên lịch → Đã đăng',
              'Idea → Editing → Scripting → Filming → Scheduled → Published|||Ý tưởng → Đang dựng → Viết kịch bản → Đang quay → Đã lên lịch → Đã đăng',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'That is the exact production order the pipeline board follows — each project moves left to right as you drag its card through the stages.|||Đó đúng là thứ tự sản xuất mà bảng tiến độ tuân theo — mỗi dự án đi từ trái sang phải khi bạn kéo thẻ qua từng giai đoạn.',
          },
          {
            question: 'You have set a filming date and a publish date for a project on /creator/calendar. You also want the pipeline board to show it as "Editing." What do you need to do?|||Bạn đã đặt ngày quay và ngày đăng cho một dự án trên /creator/calendar. Bạn cũng muốn bảng tiến độ hiện nó là "Đang dựng". Bạn cần làm gì?',
            options: [
              'Nothing — setting both calendar dates automatically marks it Editing|||Không cần gì cả — đặt đủ hai ngày trên lịch sẽ tự động đánh dấu Đang dựng',
              'Rename the project to include the word "Editing"|||Đổi tên dự án để có chữ "Đang dựng" trong đó',
              'Go to /creator/pipeline and drag the project’s card into the Editing column|||Sang /creator/pipeline và kéo thẻ dự án đó vào cột Đang dựng',
              'Delete and recreate the project with a later publish date|||Xoá rồi tạo lại dự án với ngày đăng muộn hơn',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'The calendar only stores two dates — it has no concept of production stage. Stage lives on the pipeline board and changes only when you drag the card across columns.|||Lịch chỉ lưu đúng hai ngày — nó không có khái niệm giai đoạn sản xuất. Giai đoạn nằm ở bảng tiến độ và chỉ đổi khi bạn kéo thẻ qua cột.',
          },
          {
            question: 'You just finished a 6-hour batching session that produced one long video, three shorts and B-roll. Following the repurposing pyramid, what is the most efficient next step before moving to the next idea?|||Bạn vừa xong một buổi quay dồn 6 tiếng, ra được một video dài, ba video ngắn và B-roll. Theo kim tự tháp tái sử dụng, bước tiếp theo hiệu quả nhất trước khi chuyển sang ý tưởng khác là gì?',
            options: [
              'Immediately start scripting a completely new, unrelated video idea|||Bắt tay viết kịch bản ngay cho một ý tưởng video hoàn toàn khác, không liên quan',
              'Publish only the long video and consider the session finished|||Chỉ đăng video dài rồi coi như buổi quay đã xong',
              'Re-shoot the same content a second time for backup|||Quay lại đúng nội dung đó một lần nữa để dự phòng',
              'Spend a short block turning the same footage into an article, a community post and short hooks before moving on|||Dành một khoảng thời gian ngắn biến đúng nguyên liệu này thành bài viết, bài đăng cộng đồng và các hook video ngắn trước khi chuyển tiếp',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'The pyramid exists because the expensive thinking is already done — spending a short block turning it into an article, a community post and short hooks captures value that a single upload leaves on the table.|||Kim tự tháp tồn tại vì phần suy nghĩ tốn kém đã xong — dành một khoảng ngắn biến nó thành bài viết, bài đăng cộng đồng và hook video ngắn thu về giá trị mà một lần tải lên duy nhất bỏ lỡ.',
          },
          {
            question: 'According to Instagram’s official February 2021 statement, what actually happens to a Reel that still carries a TikTok watermark?|||Theo tuyên bố chính thức của Instagram tháng 2/2021, điều gì thật sự xảy ra với một Reel còn mang watermark TikTok?',
            options: [
              'Instagram deletes it automatically|||Instagram tự động xoá nó',
              'It becomes less discoverable in places like the Reels tab, though existing followers still see it normally|||Nó ít được khám phá hơn ở những nơi như tab Reels, dù người theo dõi sẵn có vẫn thấy nó bình thường',
              'The poster’s account gets suspended|||Tài khoản người đăng bị khoá',
              'Nothing — Instagram has no policy about watermarks|||Không có gì cả — Instagram không có chính sách nào về watermark',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'Instagram’s Creators account said visibly recycled content — logos or watermarks from other apps — becomes less discoverable in places like the Reels tab; it did not claim deletion or account suspension.|||Tài khoản Creators của Instagram nói nội dung bị tái chế lộ liễu — có logo hay watermark của app khác — sẽ ít được khám phá hơn ở những nơi như tab Reels; họ không nói tới việc xoá bài hay khoá tài khoản.',
          },
        ],
      },
    },
  ],
};
