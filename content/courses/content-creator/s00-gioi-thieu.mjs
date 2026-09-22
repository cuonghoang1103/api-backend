/**
 * Content Creator — Mục 0: Bắt đầu hành trình creator. Song ngữ EN/VI (.ml-en / .ml-vi).
 * BÀI MẪU của cả khoá — các chương khác bám giọng văn và độ sâu của file này
 * (luật đầy đủ: ./_HOP-DONG.md).
 * ⚠️ KHÔNG backtick trần trong content (dùng &#96;); `${` trong mã mẫu viết \${ ; gạch chéo ngược viết \\
 */
import { gallery, slide } from './_slides.mjs';

const SLIDES = [
  [1, 'Bìa'],
  [2, 'Bản đồ Mục 0'],
  [3, '20 năm video trực tuyến'],
  [4, 'Vì sao video xây được thương hiệu cá nhân'],
  [5, 'Người Việt đang xem ở đâu'],
  [6, 'Đồ nghề bạn đang có'],
  [7, 'Mua gì trước — thứ tự của người làm nghề'],
  [8, 'Quy trình sản xuất: 10 bước'],
  [9, 'Bạn đang ở đâu trong quy trình'],
  [10, 'Lộ trình 28 phần — 5 giai đoạn'],
  [11, 'Mỗi chương học thế nào'],
  [12, 'Công cụ đi cùng khoá: /creator'],
  [13, 'Ba luồng video trong mỗi bài học'],
  [14, 'Thực hành Mục 0 — video "trước khi học"'],
];

export default {
  title: 'Section 0 — Starting your creator journey|||Mục 0 — Bắt đầu hành trình creator',
  description: 'Creator là gì, video trực tuyến đã đi từ đâu tới đâu, đồ nghề bạn đang có nên làm việc gì, quy trình sản xuất 10 bước — và vì sao thói quen quay một lèo 30 phút đang làm khó bạn.',
  lessons: [
    /* ─────────────────── 0.0 slide bài giảng ─────────────────── */
    {
      title: '0.0 — Section 0 in 14 slides|||0.0 — Mục 0 trong 14 slide',
      slug: 'cr-00-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bức tranh toàn cảnh của khoá: lịch sử video trực tuyến, đồ nghề của bạn, quy trình 10 bước và lộ trình 28 phần — trong 14 slide.',
      content: `
<div class="ml-en"><h2>📑 Section 0 in 14 slides</h2>
<p>Every chapter of this course opens with a slide deck like this one. Each slide is built around a picture — a timeline, a diagram, a comparison — so you can see the shape of the chapter before you read a single paragraph.</p>
<p>Two slides matter most here: <strong>slide 9</strong> (the habit that fills your memory card) and <strong>slide 10</strong> (the whole course on one page). Skim now, come back after the four lessons to revise.</p></div>
<div class="ml-vi"><h2>📑 Mục 0 trong 14 slide</h2>
<p>Mọi chương của khoá đều mở đầu bằng một bộ slide như thế này. Mỗi slide xoay quanh một HÌNH — dòng thời gian, sơ đồ, bảng so sánh — để bạn thấy được hình dạng của cả chương trước khi đọc một đoạn văn nào.</p>
<p>Hai slide quan trọng nhất ở đây: <strong>slide 9</strong> (thói quen đang làm đầy thẻ nhớ của bạn) và <strong>slide 10</strong> (cả khoá học trên một trang). Lướt bây giờ, học xong bốn bài thì quay lại ôn.</p></div>
${gallery('cr-00', SLIDES)}
`,
    },

    /* ─────────────────── 0.1 creator là gì + lịch sử ─────────────────── */
    {
      title: '0.1 — What a creator is, and 20 years of online video|||0.1 — Creator là gì, và 20 năm video trực tuyến',
      slug: 'cr-00-1-hanh-trinh-creator',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Creator là ai, nghề này ra đời thế nào từ YouTube 2005 tới video dọc hôm nay, người Việt xem video ở đâu, và video làm được gì cho một lập trình viên.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>A creator is not a celebrity — it is someone who shows up regularly for a specific group of people</h2>
<p class="lead">You do not need to become famous. You need to become <em>useful to someone, on a schedule</em>. This lesson gives you the big picture: where this job came from, which platforms matter in Vietnam, and what video can do for a developer who is building his own website.</p>

<h3>What "content creator" actually means</h3>
<p>A <strong>content creator</strong> is a person who regularly makes content — videos, posts, podcasts — for a <strong>specific audience</strong>, and builds a relationship with that audience over time. The two words that matter are <em>regularly</em> and <em>specific</em>. One viral video does not make you a creator; forty useful videos for the same group of people does.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Creator</span><span class="v">Makes things for an audience and keeps making them. Value comes from the content itself. <small>What this course trains you to be.</small></span></div>
  <div class="kv"><span class="k">Influencer</span><span class="v">Value comes from reach — how many people follow and act on recommendations. Often paid to promote. <small>A possible side effect of being a good creator, not the goal.</small></span></div>
  <div class="kv"><span class="k">Educator creator</span><span class="v">A creator whose content teaches. Tutorials, explanations, walkthroughs. <small>Your natural lane: you build real web software and already run a course site.</small></span></div>
</div>
<p>For you the goal is clear: <strong>a personal brand</strong> as a developer and teacher, and <strong>traffic back to cuongthai.com</strong>. That is a creator goal, not an influencer goal — which is good news, because it rewards being useful more than being loud.</p>

<h3>Twenty years of online video in one timeline</h3>
${slide('cr-00', 3, '20 năm video trực tuyến')}
<ul>
  <li><strong>2005 — YouTube.</strong> Founded by three former PayPal employees: Chad Hurley, Steve Chen and Jawed Karim. The first video, <em>"Me at the zoo"</em>, was uploaded by Karim on 23 April 2005: <strong>19 seconds</strong> of him standing in front of the elephants at San Diego Zoo. No lights, no script, no edit.</li>
  <li><strong>2006 — Google buys YouTube</strong> for 1.65 billion US dollars in stock. Online video becomes a serious business.</li>
  <li><strong>2007 — the YouTube Partner Program.</strong> Uploaders can share advertising revenue. This is the moment "making videos" becomes a job people can live on.</li>
  <li><strong>2013 — Vine.</strong> Six-second looping videos. The app closed four years later, but it proved something important: a complete idea can fit in a few seconds.</li>
  <li><strong>2016 — Douyin</strong>, launched in China by ByteDance. Its international version, TikTok, merged with musical.ly in 2018 and made full-screen <strong>vertical video</strong> the default way hundreds of millions of people watch.</li>
  <li><strong>2020 — Instagram Reels and YouTube Shorts</strong> (Shorts started as a test that year). Every big platform now has a vertical short-video feed.</li>
  <li><strong>2024 — Shorts up to 3 minutes</strong> (from 15 October 2024). The line between "short" and "long" keeps moving.</li>
</ul>
<p>The lesson hidden in that timeline: the tools got better every year, but <em>the first video on the biggest video site in the world was 19 unedited seconds</em>. What made YouTube grow was not production quality — it was people showing up with something to say. Everyone now has a 4K camera in their pocket. What is scarce is <strong>skill</strong>: planning, shooting on purpose, editing so that people stay. That is what this course teaches.</p>

<h3>Where Vietnamese audiences are</h3>
${slide('cr-00', 5, 'Người Việt đang xem ở đâu')}
<table>
  <tr><th>Platform</th><th>Advertising reach in Vietnam (Oct 2025)</th><th>What it is best at</th></tr>
  <tr><td>Facebook</td><td>79.0 million</td><td>Still the largest in Vietnam. Pages, groups, Reels. Where your classmates and their parents already are.</td></tr>
  <tr><td>TikTok</td><td>76.1 million (aged 18+)</td><td>Discovery: strangers see you without following you. Fast feedback on hooks.</td></tr>
  <tr><td>YouTube</td><td>62.1 million</td><td>Search and long-form. Tutorials keep getting views for years. Shorts for discovery.</td></tr>
  <tr><td>Instagram</td><td>11.7 million</td><td>Smaller in Vietnam, much stronger internationally — useful for your English-language content.</td></tr>
</table>
<p class="note-ct"><strong>How to read these numbers:</strong> the source is DataReportal, <em>Digital 2026: Vietnam</em> (data from October 2025). They are <em>advertising reach</em> — how many accounts an advertiser could target — not unique people. That is why TikTok's figure equals 102.9% of Vietnamese adults: one person can have several accounts. Use them to compare platforms, not as exact head-counts.</p>

<h3>What video can do for a developer</h3>
${slide('cr-00', 4, 'Vì sao video xây được thương hiệu cá nhân')}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Trust</span><span class="lz-t">People see you work</span><span class="lz-d">A CV says "knows Next.js". A video of you building a feature and fixing a real bug <em>shows</em> it. Employers, clients and students trust what they can watch.</span></div>
<div class="lz-layer"><span class="lz-k">Compounding</span><span class="lz-t">One video, years of views</span><span class="lz-d">A good tutorial is found through search long after you publish it. The work you do today keeps working while you sleep.</span></div>
<div class="lz-layer"><span class="lz-k">Leverage</span><span class="lz-t">Explain once, help thousands</span><span class="lz-d">Instead of answering the same question in fifty messages, you answer it once, well, and send the link.</span></div>
<div class="lz-layer"><span class="lz-k">Learning</span><span class="lz-t">Teaching forces understanding</span><span class="lz-d">To explain something on camera you have to understand it end to end. Every tutorial you make sharpens your own skills.</span></div>
<div class="lz-layer"><span class="lz-k">Traffic</span><span class="lz-t">A door back to your website</span><span class="lz-d">Each video can point to a course, an article or the Pro plan on cuongthai.com. Chapter 26 builds that funnel properly.</span></div>
</div>

<div class="callout warn"><p><strong>Honest expectations:</strong> growth is slow at the start, and the first ten videos are mostly practice. Channels that last are built on <em>consistency</em> — one decent video every week for a year beats one great video followed by silence. The course is designed so that each chapter ends with something you can publish, so the practice happens in public from the start.</p></div>

<div class="pitfall co-tieu-de"><p><strong>Trap — waiting until you are "ready".</strong> Waiting for better gear, better English, a better room. You already own more equipment than most creators started with (next lesson). The only way to get good at video is to make bad videos first, look at them honestly and fix one thing each time. "Me at the zoo" is 19 seconds long and has been watched hundreds of millions of times.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Trap — chasing views before you have a direction.</strong> Copying whatever is trending gets you random viewers who never come back. Decide first <em>who</em> you make videos for (Chapter 1). Views from the right 500 people are worth more than views from the wrong 50,000.</p></div>

<h3>🎬 Practice (15 minutes)</h3>
<div class="callout ok"><ol>
<li>Write your <strong>creator statement</strong> in one sentence: <em>"I make videos about ___ for ___ so that they can ___."</em> Example: <em>"I make videos about building real web apps for Vietnamese IT students so that they can ship their own projects."</em></li>
<li>List <strong>three creators</strong> you actually watch. Next to each, write one thing they do well (their hook, their editing, their honesty, their diagrams…).</li>
<li>Save both in <code>/creator/ideas</code> as your first entry.</li>
</ol><p><strong>Done when:</strong> the statement is one sentence of at most 25 words, and each of the three creators has one specific strength written next to it — not "good content", but something you could copy.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Content creator</span><span class="v">A person who regularly makes content for a specific audience.</span></div>
  <div class="kv"><span class="k">Personal brand</span><span class="v">What people think of when they hear your name — built by what you repeatedly show them.</span></div>
  <div class="kv"><span class="k">Short-form / long-form</span><span class="v">Short vertical videos (Reels, Shorts, TikTok) vs longer horizontal videos (mostly YouTube).</span></div>
  <div class="kv"><span class="k">Advertising reach</span><span class="v">How many accounts an advertiser can target on a platform. Not the same as unique users.</span></div>
  <div class="kv"><span class="k">Niche</span><span class="v">The specific topic and audience you focus on. Chapter 1.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>A creator shows up <strong>regularly</strong> for a <strong>specific</strong> audience. Fame is optional.</li>
  <li>Online video went from 19 unedited seconds (2005) to vertical feeds on every platform (2016–2024). Cameras are everywhere; skill is scarce.</li>
  <li>In Vietnam, Facebook and TikTok have the widest reach, YouTube wins at search and long-form, Instagram matters more for English content.</li>
  <li>For a developer, video builds trust, compounds over time, gives leverage, deepens learning and sends people to your website.</li>
</ul>
<div class="link-card"><a href="https://www.youtube.com/watch?v=jNQXAC9IVRw" target="_blank" rel="noopener">"Me at the zoo" — the first video ever uploaded to YouTube (19 seconds)</a></div>
<div class="link-card"><a href="https://datareportal.com/reports/digital-2026-vietnam" target="_blank" rel="noopener">DataReportal — Digital 2026: Vietnam (the source of the platform numbers)</a></div>
<div class="link-card"><a href="https://blog.youtube/news-and-events/tall-updates-coming-to-shorts/" target="_blank" rel="noopener">YouTube Blog — Shorts up to three minutes (October 2024)</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Creator không phải người nổi tiếng — mà là người xuất hiện đều đặn cho một nhóm người cụ thể</h2>
<p class="lead">Bạn không cần trở nên nổi tiếng. Bạn cần trở nên <em>có ích cho một nhóm người, theo một nhịp đều</em>. Bài này cho bạn bức tranh lớn: nghề này ra đời thế nào, nền tảng nào quan trọng ở Việt Nam, và video làm được gì cho một lập trình viên đang tự xây website của mình.</p>

<h3>"Content creator" thật ra nghĩa là gì</h3>
<p><strong>Content creator</strong> (người sáng tạo nội dung) là người <strong>đều đặn</strong> làm ra nội dung — video, bài viết, podcast — cho một <strong>nhóm khán giả cụ thể</strong>, và xây mối quan hệ với nhóm đó theo thời gian. Hai chữ quan trọng là <em>đều đặn</em> và <em>cụ thể</em>. Một video viral không biến bạn thành creator; bốn mươi video có ích cho cùng một nhóm người thì có.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Creator</span><span class="v">Làm nội dung cho khán giả và tiếp tục làm. Giá trị nằm ở chính nội dung. <small>Thứ khoá này rèn cho bạn.</small></span></div>
  <div class="kv"><span class="k">Influencer (người có ảnh hưởng)</span><span class="v">Giá trị nằm ở độ phủ — bao nhiêu người theo dõi và làm theo lời giới thiệu. Thường được trả tiền để quảng bá. <small>Có thể là hệ quả của việc làm creator tốt, không phải mục tiêu.</small></span></div>
  <div class="kv"><span class="k">Creator giáo dục</span><span class="v">Creator mà nội dung là để dạy: hướng dẫn, giải thích, làm mẫu từng bước. <small>Làn đường tự nhiên của bạn: bạn làm phần mềm web thật và đã có sẵn một trang khoá học.</small></span></div>
</div>
<p>Với bạn, mục tiêu đã rõ: <strong>thương hiệu cá nhân</strong> (personal brand) của một lập trình viên kiêm người dạy, và <strong>kéo người xem về cuongthai.com</strong>. Đó là mục tiêu của creator chứ không phải của influencer — một tin tốt, vì nó thưởng cho việc <em>có ích</em> nhiều hơn là <em>ồn ào</em>.</p>

<h3>20 năm video trực tuyến trong một dòng thời gian</h3>
${slide('cr-00', 3, '20 năm video trực tuyến')}
<ul>
  <li><strong>2005 — YouTube ra đời.</strong> Ba người sáng lập đều từng làm ở PayPal: Chad Hurley, Steve Chen và Jawed Karim. Video đầu tiên, <em>"Me at the zoo"</em>, do Karim đăng ngày 23/04/2005: <strong>19 giây</strong> anh đứng trước chuồng voi ở sở thú San Diego. Không đèn, không kịch bản, không dựng.</li>
  <li><strong>2006 — Google mua YouTube</strong> với giá 1,65 tỷ USD (trả bằng cổ phiếu). Video trực tuyến thành một ngành kinh doanh nghiêm túc.</li>
  <li><strong>2007 — YouTube Partner Program</strong> (chương trình đối tác). Người đăng video được chia doanh thu quảng cáo. Đây là lúc "làm video" trở thành một nghề sống được.</li>
  <li><strong>2013 — Vine.</strong> Video 6 giây lặp lại. Ứng dụng đóng cửa bốn năm sau, nhưng nó chứng minh một điều quan trọng: một ý trọn vẹn có thể gói trong vài giây.</li>
  <li><strong>2016 — Douyin</strong>, ra mắt ở Trung Quốc bởi ByteDance. Bản quốc tế là TikTok, sáp nhập với musical.ly năm 2018, biến <strong>video dọc</strong> toàn màn hình thành cách xem mặc định của hàng trăm triệu người.</li>
  <li><strong>2020 — Instagram Reels và YouTube Shorts</strong> (Shorts bắt đầu thử nghiệm năm đó). Nền tảng lớn nào giờ cũng có một luồng video dọc ngắn.</li>
  <li><strong>2024 — Shorts dài tới 3 phút</strong> (từ 15/10/2024). Ranh giới giữa "ngắn" và "dài" vẫn đang dịch chuyển.</li>
</ul>
<p>Bài học giấu trong dòng thời gian đó: công cụ năm nào cũng tốt hơn, nhưng <em>video đầu tiên trên trang video lớn nhất thế giới là 19 giây không dựng</em>. Thứ làm YouTube lớn lên không phải chất lượng sản xuất — mà là những người xuất hiện với một điều đáng nói. Giờ ai cũng có máy quay 4K trong túi. Thứ khan hiếm là <strong>kỹ năng</strong>: lên kế hoạch, quay có chủ đích, dựng sao cho người ta ở lại. Đó là thứ khoá này dạy.</p>

<h3>Người Việt đang xem ở đâu</h3>
${slide('cr-00', 5, 'Người Việt đang xem ở đâu')}
<table>
  <tr><th>Nền tảng</th><th>Tệp quảng cáo tiếp cận ở Việt Nam (10/2025)</th><th>Mạnh nhất ở việc gì</th></tr>
  <tr><td>Facebook</td><td>79,0 triệu</td><td>Vẫn lớn nhất Việt Nam. Trang, nhóm, Reels. Nơi bạn bè cùng lớp và cả bố mẹ họ đang có mặt.</td></tr>
  <tr><td>TikTok</td><td>76,1 triệu (từ 18 tuổi)</td><td>Khám phá: người lạ thấy bạn dù chưa theo dõi. Phản hồi rất nhanh cho câu mở đầu.</td></tr>
  <tr><td>YouTube</td><td>62,1 triệu</td><td>Tìm kiếm và video dài. Video hướng dẫn tiếp tục có lượt xem nhiều năm. Shorts để được khám phá.</td></tr>
  <tr><td>Instagram</td><td>11,7 triệu</td><td>Nhỏ ở Việt Nam, mạnh hơn nhiều ở quốc tế — hữu ích cho nội dung tiếng Anh của bạn.</td></tr>
</table>
<p class="note-ct"><strong>Đọc các con số này thế nào:</strong> nguồn là DataReportal, <em>Digital 2026: Vietnam</em> (số liệu tháng 10/2025). Đây là <em>advertising reach</em> (tệp quảng cáo tiếp cận được) — số tài khoản nhà quảng cáo nhắm tới được — chứ không phải số người thật. Vì thế con số của TikTok bằng 102,9% số người trưởng thành ở Việt Nam: một người có thể có nhiều tài khoản. Dùng để so sánh các nền tảng với nhau, đừng coi là số người chính xác.</p>

<h3>Video làm được gì cho một lập trình viên</h3>
${slide('cr-00', 4, 'Vì sao video xây được thương hiệu cá nhân')}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Tin tưởng</span><span class="lz-t">Người ta thấy bạn làm thật</span><span class="lz-d">CV ghi "biết Next.js". Một video bạn dựng một tính năng và sửa một lỗi thật thì <em>cho thấy</em> điều đó. Nhà tuyển dụng, khách hàng, học viên tin thứ họ tận mắt xem.</span></div>
<div class="lz-layer"><span class="lz-k">Tích luỹ</span><span class="lz-t">Một video, nhiều năm lượt xem</span><span class="lz-d">Một video hướng dẫn tốt vẫn được tìm thấy qua tìm kiếm rất lâu sau khi đăng. Công sức hôm nay tiếp tục làm việc cả khi bạn ngủ.</span></div>
<div class="lz-layer"><span class="lz-k">Đòn bẩy</span><span class="lz-t">Giải thích một lần, giúp hàng nghìn người</span><span class="lz-d">Thay vì trả lời cùng một câu hỏi trong năm mươi tin nhắn, bạn trả lời một lần, thật kỹ, rồi gửi đường link.</span></div>
<div class="lz-layer"><span class="lz-k">Học sâu hơn</span><span class="lz-t">Dạy lại buộc bạn phải hiểu</span><span class="lz-d">Muốn giải thích trước ống kính, bạn phải hiểu từ đầu tới cuối. Mỗi video hướng dẫn bạn làm lại mài sắc thêm kỹ năng của chính bạn.</span></div>
<div class="lz-layer"><span class="lz-k">Lượt truy cập</span><span class="lz-t">Một cánh cửa về website</span><span class="lz-d">Mỗi video có thể dẫn tới một khoá học, một bài viết hay gói Pro trên cuongthai.com. Chương 26 dựng cái phễu đó cho bài bản.</span></div>
</div>

<div class="callout warn"><p><strong>Kỳ vọng thật lòng:</strong> lúc đầu kênh lớn chậm, và mười video đầu chủ yếu là để luyện tay. Những kênh sống lâu được xây bằng <em>sự đều đặn</em> — mỗi tuần một video tạm ổn trong suốt một năm thắng một video xuất sắc rồi im lặng. Khoá được thiết kế để chương nào cũng kết thúc bằng một thứ đăng được, nên bạn luyện tập công khai ngay từ đầu.</p></div>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — đợi tới khi "sẵn sàng".</strong> Đợi có máy tốt hơn, tiếng Anh tốt hơn, phòng đẹp hơn. Bạn đang có nhiều đồ nghề hơn phần lớn creator lúc mới bắt đầu (bài sau). Cách duy nhất để giỏi làm video là làm những video dở trước, nhìn thẳng vào chúng và mỗi lần sửa một thứ. "Me at the zoo" dài 19 giây và đã được xem hàng trăm triệu lần.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — đuổi theo lượt xem khi chưa có hướng đi.</strong> Chép theo trào lưu mang về những người xem ngẫu nhiên và không bao giờ quay lại. Hãy quyết định trước bạn làm video <em>cho ai</em> (Chương 1). Lượt xem từ đúng 500 người giá trị hơn lượt xem từ sai 50.000 người.</p></div>

<h3>🎬 Thực hành (15 phút)</h3>
<div class="callout ok"><ol>
<li>Viết <strong>câu tuyên bố creator</strong> của bạn trong một câu: <em>"Tôi làm video về ___ cho ___ để họ ___."</em> Ví dụ: <em>"Tôi làm video về xây ứng dụng web thật cho sinh viên IT Việt Nam để họ tự làm ra sản phẩm của mình."</em></li>
<li>Liệt kê <strong>ba creator</strong> bạn thật sự hay xem. Bên cạnh mỗi người, ghi một điều họ làm tốt (câu mở đầu, cách dựng, sự thẳng thắn, sơ đồ…).</li>
<li>Lưu cả hai vào <code>/creator/ideas</code> làm mục đầu tiên.</li>
</ol><p><strong>Đạt khi:</strong> câu tuyên bố là một câu không quá 25 chữ, và mỗi creator có một điểm mạnh CỤ THỂ bên cạnh — không phải "nội dung hay", mà là thứ bạn có thể bắt chước được.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Content creator</span><span class="v">Người sáng tạo nội dung — làm nội dung đều đặn cho một nhóm khán giả cụ thể.</span></div>
  <div class="kv"><span class="k">Personal brand</span><span class="v">Thương hiệu cá nhân — điều người ta nghĩ tới khi nghe tên bạn, được xây bằng những gì bạn cho họ thấy lặp đi lặp lại.</span></div>
  <div class="kv"><span class="k">Short-form / long-form</span><span class="v">Video ngắn dọc (Reels, Shorts, TikTok) / video dài ngang (chủ yếu trên YouTube).</span></div>
  <div class="kv"><span class="k">Advertising reach</span><span class="v">Tệp quảng cáo tiếp cận được — số tài khoản nhà quảng cáo nhắm tới được. Không phải số người thật.</span></div>
  <div class="kv"><span class="k">Niche</span><span class="v">Ngách — chủ đề và nhóm khán giả cụ thể bạn tập trung vào. Chương 1.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Creator là người xuất hiện <strong>đều đặn</strong> cho một nhóm khán giả <strong>cụ thể</strong>. Nổi tiếng là tuỳ chọn.</li>
  <li>Video trực tuyến đi từ 19 giây không dựng (2005) tới luồng video dọc trên mọi nền tảng (2016–2024). Máy quay ở khắp nơi; kỹ năng mới khan hiếm.</li>
  <li>Ở Việt Nam, Facebook và TikTok có độ phủ rộng nhất, YouTube thắng ở tìm kiếm và video dài, Instagram quan trọng hơn cho nội dung tiếng Anh.</li>
  <li>Với lập trình viên, video xây niềm tin, tích luỹ theo thời gian, tạo đòn bẩy, giúp học sâu hơn và đưa người xem về website của bạn.</li>
</ul>
<div class="link-card"><a href="https://www.youtube.com/watch?v=jNQXAC9IVRw" target="_blank" rel="noopener">"Me at the zoo" — video đầu tiên được đăng lên YouTube (19 giây)</a></div>
<div class="link-card"><a href="https://datareportal.com/reports/digital-2026-vietnam" target="_blank" rel="noopener">DataReportal — Digital 2026: Vietnam (nguồn số liệu các nền tảng)</a></div>
<div class="link-card"><a href="https://blog.youtube/news-and-events/tall-updates-coming-to-shorts/" target="_blank" rel="noopener">YouTube Blog — Shorts dài tới 3 phút (tháng 10/2024)</a></div>
</div>
`,
    },
    /* ─────────────────── 0.2 đồ nghề của bạn ─────────────────── */
    {
      title: '0.2 — Your gear, and what each device is for|||0.2 — Đồ nghề của bạn, và mỗi máy nên làm việc gì',
      slug: 'cr-00-2-do-nghe-cua-ban',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Pocket 3, iPhone 16 Pro Max, iPad Pro M5, Mac M1 Max và máy Linux ở nhà: mỗi máy mạnh ở việc gì, máy nào làm A-cam, còn thiếu gì và mua theo thứ tự nào.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>You already own a small studio — the problem is not gear, it is not knowing which device does which job</h2>
<p class="lead">Many creators started with a single phone. You have a gimbal camera, a flagship phone, a tablet with a pencil, a laptop built for video and a Linux box with a graphics card. This lesson gives each device a job, tells you the one or two things still missing, and — most important — the order in which gear actually matters.</p>

<h3>The rule professionals follow: the camera matters least</h3>
${slide('cr-00', 7, 'Mua gì trước — thứ tự của người làm nghề')}
<p>Ask people who make videos for a living what to buy first and you get the same order almost every time:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Sound</span><span class="lz-d">Viewers put up with an image that is a bit soft. They leave within seconds when the voice is echoey, too quiet or full of wind. A small wireless microphone changes a video more than a new camera does.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Light</span><span class="lz-d">Small camera sensors look noisy and muddy in a dim room and surprisingly good in soft, bright light. One soft light — or a window at the right angle — is the cheapest upgrade in video.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Storage</span><span class="lz-d">Fast memory cards and an external SSD. Without them you are deleting footage to keep shooting, and editing from a full laptop drive.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Camera</span><span class="lz-d">You already have two good ones. Changing cameras is the <em>last</em> step, and only when you can name exactly what your current camera cannot do.</span></div>
</div>

<h3>Your five devices and their jobs</h3>
${slide('cr-00', 6, 'Đồ nghề bạn đang có')}
<p><strong>DJI Osmo Pocket 3 — the vlog and B-roll camera.</strong> A 1-inch sensor behind a 20 mm-equivalent f/2.0 lens, on a three-axis <em>gimbal</em> (a motorised stabiliser that keeps the camera level while your hand moves). According to DJI's spec sheet it records 4K up to 120 fps, vertical 3K (1728×3072) when you rotate the screen, H.264 or HEVC at up to 130 Mbps, and runs about 166 minutes on a charge (measured at 1080p/24 fps). Best at: walking vlogs, selfie shots, smooth moving <em>B-roll</em> (the extra shots that illustrate what you are saying), quick talking-head clips anywhere. Weak at: long 4K high-frame-rate shoots in heat, and wind noise on the built-in microphones.</p>
<p><strong>iPhone 16 Pro Max — the main camera ("A-cam").</strong> Apple's tech-spec page lists three rear cameras: a 48 MP Fusion camera (24 mm, ƒ/1.78), a 48 MP Ultra Wide (13 mm) and a 12 MP 5× Telephoto (120 mm); 4K Dolby Vision recording at 24, 25, 30, 60, 100 and 120 fps; ProRes and Log recording; four studio-quality microphones with Audio Mix and wind-noise reduction. Best at: the main talking-head angle on a tripod, 48 MP thumbnail photos, telephoto B-roll that makes backgrounds look compressed and clean, and working as a high-quality webcam for your Mac. Weak at: its best formats are huge (ProRes at high frame rates needs external recording), and its default HDR video can look too bright or washed out once posted — Chapters 5 and 6 fix that.</p>
<p><strong>iPad Pro M5 — the planning desk.</strong> Draw storyboards with the Pencil (Chapter 4), run a teleprompter while you record (the Teleprompter on <code>/creator</code> works in the browser), review footage on a big screen, and edit on the move in CapCut or DaVinci Resolve for iPad. It is also the best way to check how a thumbnail looks at real phone size.</p>
<p><strong>Mac M1 Max — the editing station.</strong> The M1 Max chip has a <em>media engine</em>: dedicated hardware that encodes and decodes H.264, HEVC and ProRes, so 4K timelines play smoothly in DaVinci Resolve and CapCut. Keep projects and footage on an external SSD, not the internal drive.</p>
<p><strong>The Linux machine at home — the patient worker.</strong> Its RTX 3060 (12 GB) and big drives make it good at jobs that just need time: receiving backups, converting footage overnight with <code>ffmpeg</code>, and running Whisper to generate subtitles (Chapter 16). One real-world detail: that GPU already runs your language-model and text-to-speech services, so check free video memory with <code>nvidia-smi</code> before starting a big Whisper job.</p>

<table>
  <tr><th>Situation</th><th>Main camera</th><th>Second camera / helper</th></tr>
  <tr><td>Talking head at your desk</td><td>iPhone on a tripod (A-cam)</td><td>Pocket 3 from the side (B-cam), iPad as teleprompter</td></tr>
  <tr><td>Walking vlog, outdoors</td><td>Pocket 3</td><td>iPhone for 5× detail shots</td></tr>
  <tr><td>B-roll of hands on the keyboard</td><td>iPhone 5× or Pocket 3</td><td>—</td></tr>
  <tr><td>Screen-recorded coding tutorial</td><td>Mac screen recording</td><td>iPhone as webcam via Continuity Camera (Chapter 22)</td></tr>
  <tr><td>Thumbnail photo</td><td>iPhone 48 MP</td><td>iPad to preview at phone size</td></tr>
  <tr><td>Planning, storyboard, script</td><td>iPad + Pencil</td><td><code>/creator</code> on any device</td></tr>
</table>

<h3>What is still missing</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">A wireless lav mic</span><span class="v">The single biggest upgrade. If your Pocket 3 is the <strong>Creator Combo</strong>, the box already contains a DJI Mic 2 transmitter that connects straight to the Pocket 3 — check before buying anything. <small>Chapter 9.</small></span></div>
  <div class="kv"><span class="k">One soft light</span><span class="v">An LED with a softbox or a large diffuser — or a window used on purpose. <small>Chapter 8.</small></span></div>
  <div class="kv"><span class="k">Fast storage</span><span class="v">A second microSD card rated for 4K video and an external SSD for projects. <small>Chapters 6 and 11.</small></span></div>
  <div class="kv"><span class="k">Something to hold the camera still</span><span class="v">A tripod with a phone clamp for the iPhone, a small tripod for the Pocket 3.</span></div>
</div>

<div class="pitfall co-tieu-de"><p><strong>Trap — buying a new camera to make better videos.</strong> A new camera fixes nothing that planning, sound and light did not fix first. Every chapter in Phase 2 shows how far your current devices go when you set them up properly.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Trap — mixing devices with different settings.</strong> Pocket 3 at 30 fps, iPhone at 25 fps, one in HDR and one not: in the edit the clips stutter and the colours never match. Before you use two cameras together, set them to the <strong>same frame rate and colour mode</strong>. Vietnam's mains electricity runs at 50 Hz, which is why this course defaults to 25 fps (Chapter 5 explains why).</p></div>

<h3>🎬 Practice (20 minutes)</h3>
<div class="callout ok"><ol>
<li>On the iPhone, open <strong>Settings → Camera → Record Video</strong> and choose <strong>4K (PAL)</strong> at <strong>25 fps</strong>. PAL is the 25/50 fps family used in Vietnam. (On older iOS versions you first had to turn on a "Show PAL Formats" switch in the same screen.)</li>
<li>On the Pocket 3, set video to <strong>4K, 25 fps</strong>.</li>
<li>Record a 10-second clip on each device and copy both to the Mac.</li>
<li>Check what the files really contain. In Terminal, for each file:</li>
</ol>
<pre><code class="language-bash">ffprobe -v error -select_streams v:0 \\
  -show_entries stream=codec_name,width,height,r_frame_rate,pix_fmt \\
  -of default=nw=1 DJI_20260922_0001_D.MP4</code></pre>
<div class="out">codec_name=hevc
width=3840
height=2160
pix_fmt=yuv420p10le
r_frame_rate=25/1</div>
<p>(That output is from a test file; yours will show your own codec and bit depth. <code>yuv420p10le</code> means 10-bit, <code>yuv420p</code> means 8-bit.)</p>
<p><strong>Done when:</strong> both files report <code>r_frame_rate=25/1</code> and a width of 3840. If not, the device is not set the way you think — find the menu that is wrong.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">A-cam / B-cam</span><span class="v">The main camera angle / the second angle used to cut to.</span></div>
  <div class="kv"><span class="k">Gimbal</span><span class="v">A motorised stabiliser that keeps the camera level while you move.</span></div>
  <div class="kv"><span class="k">B-roll</span><span class="v">Extra shots that illustrate what is being said.</span></div>
  <div class="kv"><span class="k">Sensor</span><span class="v">The chip that captures light. Bigger usually means cleaner images in low light.</span></div>
  <div class="kv"><span class="k">Frame rate (fps)</span><span class="v">Pictures per second. Chapter 5.</span></div>
  <div class="kv"><span class="k">Media engine</span><span class="v">Hardware in Apple chips dedicated to encoding and decoding video.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Invest in this order: <strong>sound → light → storage → camera</strong>.</li>
  <li>Pocket 3 = vlog and moving B-roll. iPhone = main camera, thumbnails, webcam. iPad = planning and teleprompter. Mac = editing. Linux = backups, conversion, subtitles.</li>
  <li>The two things most likely missing: a wireless lav mic and one soft light.</li>
  <li>Cameras used together must share the same frame rate and colour mode — 25 fps in this course.</li>
</ul>
<div class="link-card"><a href="https://www.dji.com/osmo-pocket-3/specs" target="_blank" rel="noopener">DJI — Osmo Pocket 3 specifications</a></div>
<div class="link-card"><a href="https://support.apple.com/en-us/121032" target="_blank" rel="noopener">Apple — iPhone 16 Pro Max technical specifications</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Bạn đã có một studio nhỏ — vấn đề không phải đồ nghề, mà là chưa biết máy nào làm việc gì</h2>
<p class="lead">Nhiều creator bắt đầu chỉ với một chiếc điện thoại. Bạn có một máy quay gimbal, một điện thoại đầu bảng, một máy tính bảng có bút, một laptop sinh ra để làm video và một máy Linux có card đồ hoạ. Bài này giao cho mỗi máy một việc, chỉ ra một hai thứ còn thiếu, và — quan trọng nhất — thứ tự mà đồ nghề thật sự tạo ra khác biệt.</p>

<h3>Luật của người làm nghề: máy quay là thứ ít quan trọng nhất</h3>
${slide('cr-00', 7, 'Mua gì trước — thứ tự của người làm nghề')}
<p>Hỏi những người làm video kiếm sống nên mua gì trước, bạn gần như lần nào cũng nhận cùng một thứ tự:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Âm thanh</span><span class="lz-d">Người xem chịu được hình hơi mềm. Họ bỏ đi sau vài giây khi giọng bị vang, quá nhỏ hay đầy tiếng gió. Một micro không dây nhỏ thay đổi video nhiều hơn một máy quay mới.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Ánh sáng</span><span class="lz-d">Cảm biến nhỏ trong phòng tối cho hình nhiễu, bệt màu; dưới ánh sáng mềm và đủ sáng thì đẹp bất ngờ. Một đèn mềm — hoặc một ô cửa sổ đặt đúng góc — là nâng cấp rẻ nhất trong làm video.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Lưu trữ</span><span class="lz-d">Thẻ nhớ đủ nhanh và một SSD ngoài. Thiếu chúng, bạn phải xoá cảnh để quay tiếp và dựng trên ổ laptop đã đầy.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Máy quay</span><span class="lz-d">Bạn đã có hai máy tốt. Đổi máy là bước <em>cuối cùng</em>, và chỉ khi bạn nói được chính xác máy hiện tại không làm được điều gì.</span></div>
</div>

<h3>Năm thiết bị của bạn và việc của từng máy</h3>
${slide('cr-00', 6, 'Đồ nghề bạn đang có')}
<p><strong>DJI Osmo Pocket 3 — máy vlog và B-roll.</strong> Cảm biến 1 inch sau ống kính tương đương 20 mm khẩu f/2.0, đặt trên <em>gimbal</em> ba trục (bộ ổn định có động cơ, giữ máy thăng bằng khi tay bạn di chuyển). Theo bảng thông số của DJI, máy quay 4K tới 120 fps, quay dọc 3K (1728×3072) khi xoay màn hình, ghi H.264 hoặc HEVC với bitrate tối đa 130 Mbps, và chạy khoảng 166 phút một lần sạc (đo ở 1080p/24 fps). Mạnh ở: vlog vừa đi vừa quay, cảnh tự quay mặt mình, <em>B-roll</em> (cảnh phụ minh hoạ cho lời bạn nói) chuyển động mượt, quay nhanh một đoạn nói chuyện ở bất cứ đâu. Yếu ở: quay 4K tốc độ khung hình cao liên tục khi trời nóng, và tiếng gió vào micro tích hợp.</p>
<p><strong>iPhone 16 Pro Max — máy chính ("A-cam").</strong> Trang thông số kỹ thuật của Apple liệt kê ba camera sau: Fusion 48 MP (24 mm, ƒ/1.78), Ultra Wide 48 MP (13 mm) và Telephoto 5× 12 MP (120 mm); quay 4K Dolby Vision ở 24, 25, 30, 60, 100 và 120 fps; quay ProRes và Log; bốn micro chất lượng phòng thu với Audio Mix và giảm tiếng gió. Mạnh ở: góc máy chính khi nói chuyện trên chân máy, ảnh thumbnail 48 MP, B-roll bằng ống 5× làm hậu cảnh gọn và "nén" lại, và làm webcam chất lượng cao cho máy Mac. Yếu ở: các định dạng tốt nhất rất nặng (ProRes tốc độ khung hình cao cần ghi ra ổ ngoài), và video HDR mặc định có thể quá sáng hoặc bạc màu khi đăng lên — Chương 5 và 6 sẽ sửa việc này.</p>
<p><strong>iPad Pro M5 — bàn làm việc để lên kế hoạch.</strong> Vẽ storyboard bằng Pencil (Chương 4), chạy teleprompter khi quay (Teleprompter trên <code>/creator</code> chạy ngay trong trình duyệt), xem lại cảnh quay trên màn hình lớn, và dựng khi đang di chuyển bằng CapCut hoặc DaVinci Resolve cho iPad. Đây cũng là cách tốt nhất để xem thumbnail ở đúng kích thước màn hình điện thoại.</p>
<p><strong>Mac M1 Max — trạm dựng.</strong> Chip M1 Max có <em>media engine</em> (khối phần cứng chuyên mã hoá/giải mã video) cho H.264, HEVC và ProRes, nên timeline 4K trong DaVinci Resolve và CapCut chạy mượt. Để dự án và cảnh quay trên một SSD ngoài, đừng để trong ổ trong.</p>
<p><strong>Máy Linux ở nhà — người làm thuê chăm chỉ.</strong> Card RTX 3060 (12 GB) và các ổ lớn làm nó hợp với những việc chỉ cần thời gian: nhận bản sao lưu, chuyển đổi cảnh quay qua đêm bằng <code>ffmpeg</code>, và chạy Whisper để tạo phụ đề (Chương 16). Một chi tiết thực tế: card đó đang chạy sẵn các dịch vụ mô hình ngôn ngữ và chuyển văn bản thành giọng nói của bạn, nên kiểm bộ nhớ đồ hoạ còn trống bằng <code>nvidia-smi</code> trước khi chạy một việc Whisper lớn.</p>

<table>
  <tr><th>Tình huống</th><th>Máy chính</th><th>Máy phụ / trợ giúp</th></tr>
  <tr><td>Nói chuyện trước máy tại bàn</td><td>iPhone trên chân máy (A-cam)</td><td>Pocket 3 đặt bên cạnh (B-cam), iPad làm teleprompter</td></tr>
  <tr><td>Vlog vừa đi vừa quay, ngoài trời</td><td>Pocket 3</td><td>iPhone quay cận chi tiết bằng ống 5×</td></tr>
  <tr><td>B-roll tay gõ phím</td><td>iPhone 5× hoặc Pocket 3</td><td>—</td></tr>
  <tr><td>Bài hướng dẫn code quay màn hình</td><td>Quay màn hình trên Mac</td><td>iPhone làm webcam qua Continuity Camera (Chương 22)</td></tr>
  <tr><td>Ảnh thumbnail</td><td>iPhone 48 MP</td><td>iPad để xem thử ở cỡ điện thoại</td></tr>
  <tr><td>Lên kế hoạch, storyboard, kịch bản</td><td>iPad + Pencil</td><td><code>/creator</code> trên máy nào cũng được</td></tr>
</table>

<h3>Còn thiếu gì</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Micro cài áo không dây</span><span class="v">Nâng cấp lớn nhất. Nếu Pocket 3 của bạn là bản <strong>Creator Combo</strong>, trong hộp đã có bộ phát DJI Mic 2 kết nối thẳng với Pocket 3 — kiểm tra trước khi mua gì. <small>Chương 9.</small></span></div>
  <div class="kv"><span class="k">Một đèn mềm</span><span class="v">Một đèn LED có softbox hoặc tấm tản sáng lớn — hoặc một ô cửa sổ dùng có chủ đích. <small>Chương 8.</small></span></div>
  <div class="kv"><span class="k">Lưu trữ nhanh</span><span class="v">Thẻ microSD thứ hai đủ chuẩn quay 4K và một SSD ngoài cho dự án. <small>Chương 6 và 11.</small></span></div>
  <div class="kv"><span class="k">Thứ giữ máy đứng yên</span><span class="v">Chân máy có kẹp điện thoại cho iPhone, chân máy mini cho Pocket 3.</span></div>
</div>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — mua máy mới để video đẹp hơn.</strong> Máy mới không sửa được thứ gì mà kế hoạch, âm thanh và ánh sáng chưa sửa trước. Mọi chương ở Giai đoạn 2 cho bạn thấy máy hiện tại đi xa tới đâu khi được cài đúng.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — trộn các máy có cài đặt khác nhau.</strong> Pocket 3 ở 30 fps, iPhone ở 25 fps, một máy HDR một máy không: lúc dựng các clip bị giật và màu không bao giờ khớp. Trước khi dùng hai máy cùng nhau, đặt chúng <strong>cùng tốc độ khung hình và cùng chế độ màu</strong>. Điện lưới Việt Nam chạy ở 50 Hz, đó là lý do khoá này mặc định dùng 25 fps (Chương 5 giải thích vì sao).</p></div>

<h3>🎬 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
<li>Trên iPhone, mở <strong>Cài đặt → Camera → Quay video</strong> (Settings → Camera → Record Video) và chọn <strong>4K (PAL)</strong> ở <strong>25 fps</strong>. PAL là họ định dạng 25/50 fps mà Việt Nam dùng. (Trên các bản iOS cũ, phải bật công tắc "Hiện định dạng PAL" ở cùng màn hình trước.)</li>
<li>Trên Pocket 3, đặt video <strong>4K, 25 fps</strong>.</li>
<li>Quay một clip 10 giây trên mỗi máy và chép cả hai vào Mac.</li>
<li>Kiểm xem file thật sự chứa gì. Trong Terminal, với từng file:</li>
</ol>
<pre><code class="language-bash">ffprobe -v error -select_streams v:0 \\
  -show_entries stream=codec_name,width,height,r_frame_rate,pix_fmt \\
  -of default=nw=1 DJI_20260922_0001_D.MP4</code></pre>
<div class="out">codec_name=hevc
width=3840
height=2160
pix_fmt=yuv420p10le
r_frame_rate=25/1</div>
<p>(Kết quả trên lấy từ một file thử; file của bạn sẽ hiện codec và độ sâu màu của chính nó. <code>yuv420p10le</code> nghĩa là 10-bit, <code>yuv420p</code> là 8-bit.)</p>
<p><strong>Đạt khi:</strong> cả hai file đều báo <code>r_frame_rate=25/1</code> và chiều rộng 3840. Nếu không, máy không được cài như bạn nghĩ — tìm ra menu đang sai.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">A-cam / B-cam</span><span class="v">Góc máy chính / góc máy thứ hai để cắt sang.</span></div>
  <div class="kv"><span class="k">Gimbal</span><span class="v">Bộ ổn định có động cơ, giữ máy thăng bằng khi bạn di chuyển.</span></div>
  <div class="kv"><span class="k">B-roll</span><span class="v">Cảnh phụ minh hoạ cho lời đang nói.</span></div>
  <div class="kv"><span class="k">Sensor</span><span class="v">Cảm biến — con chip thu ánh sáng. To hơn thường cho hình sạch hơn trong thiếu sáng.</span></div>
  <div class="kv"><span class="k">Frame rate (fps)</span><span class="v">Tốc độ khung hình — số hình mỗi giây. Chương 5.</span></div>
  <div class="kv"><span class="k">Media engine</span><span class="v">Khối phần cứng trong chip Apple chuyên mã hoá/giải mã video.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Đầu tư theo thứ tự: <strong>âm thanh → ánh sáng → lưu trữ → máy quay</strong>.</li>
  <li>Pocket 3 = vlog và B-roll chuyển động. iPhone = máy chính, thumbnail, webcam. iPad = lên kế hoạch và teleprompter. Mac = dựng. Linux = sao lưu, chuyển mã, phụ đề.</li>
  <li>Hai thứ nhiều khả năng còn thiếu: micro cài áo không dây và một đèn mềm.</li>
  <li>Các máy dùng chung phải cùng tốc độ khung hình và chế độ màu — khoá này dùng 25 fps.</li>
</ul>
<div class="link-card"><a href="https://www.dji.com/osmo-pocket-3/specs" target="_blank" rel="noopener">DJI — thông số Osmo Pocket 3</a></div>
<div class="link-card"><a href="https://support.apple.com/en-us/121032" target="_blank" rel="noopener">Apple — thông số kỹ thuật iPhone 16 Pro Max</a></div>
</div>
`,
    },

    /* ─────────────────── 0.3 quy trình sản xuất ─────────────────── */
    {
      title: '0.3 — The production workflow: 10 steps, and the one you are skipping|||0.3 — Quy trình sản xuất: 10 bước, và bước bạn đang bỏ qua',
      slug: 'cr-00-3-quy-trinh-san-xuat',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Tiền kỳ, quay, hậu kỳ, phát hành: mỗi bước làm ra sản phẩm gì, vì sao quay một lèo 30 phút làm mọi bước sau khó gấp đôi, và kế hoạch thời gian cho video đầu tiên.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>Every video goes through the same 10 steps — skipping the first three is why editing feels impossible</h2>
<p class="lead">Right now your workflow is: press record on the Pocket 3, talk for 20–30 minutes, go home, and try to find a video inside the footage. That is not laziness; it is what anyone does before they learn the workflow professionals use. This lesson lays out that workflow step by step, shows what each step produces, and proves with numbers why the missing steps cost you hours and gigabytes.</p>

<h3>Three stages, like cooking a meal</h3>
${slide('cr-00', 8, 'Quy trình sản xuất: 10 bước')}
<div class="kv-grid">
  <div class="kv"><span class="k">Pre-production</span><span class="v">Deciding the menu and buying the ingredients. Idea, script, shot list. Nothing is filmed yet — and it is where most of the quality is decided.</span></div>
  <div class="kv"><span class="k">Production</span><span class="v">Cooking. You film exactly what the plan says, plus a little extra. Short, labelled clips.</span></div>
  <div class="kv"><span class="k">Post-production</span><span class="v">Plating. Copy and back up the footage, edit, fix colour and sound, add captions, export.</span></div>
  <div class="kv"><span class="k">Distribution</span><span class="v">Serving the meal and watching faces. Title, thumbnail, publishing, and reading the numbers to improve the next one.</span></div>
</div>

<h3>The 10 steps and what each one produces</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Idea</span><span class="lz-d">One sentence: what the viewer gets. Plus a draft title. <em>Chapters 1–2.</em></span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Script</span><span class="lz-d">An outline or full script, with the hook written first. <em>Chapter 3.</em></span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Shot list</span><span class="lz-d">Every shot you need: size, angle, what happens, which camera. <em>Chapter 4.</em></span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Shoot</span><span class="lz-d">Short clips that each have a job, recorded with the right settings. <em>Chapters 5–10.</em></span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Ingest</span><span class="lz-d">Footage copied into a standard folder, renamed, backed up twice. <em>Chapter 11.</em></span></div>
<div class="lz-step"><span class="lz-k">6</span><span class="lz-t">Edit</span><span class="lz-d">From rough cut to a locked story ("picture lock"). <em>Chapters 12–14.</em></span></div>
<div class="lz-step"><span class="lz-k">7</span><span class="lz-t">Colour &amp; sound</span><span class="lz-d">Matching shots, clean voice at the right loudness, captions. <em>Chapters 15–16.</em></span></div>
<div class="lz-step"><span class="lz-k">8</span><span class="lz-t">Export</span><span class="lz-d">A file in the right size, frame rate and codec for each platform. <em>Chapter 24.</em></span></div>
<div class="lz-step"><span class="lz-k">9</span><span class="lz-t">Publish</span><span class="lz-d">Title, thumbnail, description, chapters, captions, schedule. <em>Chapters 24–25.</em></span></div>
<div class="lz-step"><span class="lz-k">10</span><span class="lz-t">Measure &amp; learn</span><span class="lz-d">Three numbers and one lesson for the next video. <em>Chapter 26.</em></span></div>
</div>
<pre><code class="language-mermaid">flowchart TB
  A["1 · Idea"] --> B["2 · Script"] --> C["3 · Shot list"]
  C --> D["4 · Shoot short clips"] --> E["5 · Ingest + backup"]
  E --> F["6 · Edit"] --> G["7 · Colour, sound, captions"]
  G --> H["8 · Export"] --> I["9 · Publish"] --> J["10 · Measure"]
  J -->|"one lesson for the next video"| A</code></pre>
<p>Notice the arrow at the end. Step 10 feeds step 1. A creator does not make one video; they run this loop dozens of times, and every lap makes the next one easier.</p>

<h3>The numbers behind "record 30 minutes and cut later"</h3>
${slide('cr-00', 9, 'Bạn đang ở đâu trong quy trình')}
<p>The Pocket 3 records at up to 130 megabits per second. One minute is 130 × 60 = 7,800 megabits, divided by 8 bits per byte = <strong>975 MB per minute</strong>. So:</p>
<table>
  <tr><th></th><th>Record-everything habit</th><th>With a shot list</th></tr>
  <tr><td>Footage recorded</td><td>30 min in one clip</td><td>25 clips × ~20 s ≈ 8 min</td></tr>
  <tr><td>Size at 130 Mbps</td><td>≈ 29 GB</td><td>≈ 8 GB</td></tr>
  <tr><td>How many fit on a 128 GB card</td><td>about 4 sessions</td><td>about 15 sessions</td></tr>
  <tr><td>Time just to watch it back</td><td>30 min, and you still need notes</td><td>8 min — each clip has a known purpose</td></tr>
  <tr><td>Where the good moments are</td><td>Somewhere in 30 minutes</td><td>In the file names and the shot list</td></tr>
</table>
<p>The real cost is not the gigabytes, it is your time. Watching 30 minutes of footage to find the 90 seconds worth keeping is the slowest part of editing, and it happens every single time. With a shot list you do the thinking once, before shooting, when it is cheap.</p>
<p class="note-ct"><strong>When long takes are right:</strong> screen recordings of a coding lesson, interviews, livestreams. Even then professionals mark the moments (a clap, a spoken note, a marker) so the edit can find them. Chapter 4 shows how.</p>

<h3>A realistic time plan for your first videos</h3>
<p>For a 5–8 minute YouTube video, a beginner's first attempts often look roughly like this. Treat it as a starting guess — measure your own times and correct it after three videos:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Pre-production</span><span class="v">1–2 hours: idea, outline, hook, shot list.</span></div>
  <div class="kv"><span class="k">Shoot</span><span class="v">1–2 hours including setup, lights, sound check and a few takes.</span></div>
  <div class="kv"><span class="k">Post-production</span><span class="v">3–5 hours: ingest, edit, colour, sound, captions, export.</span></div>
  <div class="kv"><span class="k">Publish &amp; measure</span><span class="v">1 hour: title, thumbnail, description, then checking results after a few days.</span></div>
</div>
<p>Post-production takes the most time — and that is exactly the stage that planning speeds up. On <code>/creator/pipeline</code> each project moves through the same columns you just learned: <em>Idea → Scripting → Filming → Editing → Scheduled → Published</em>. Put every video there so you can see where your work gets stuck.</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — "fix it in post".</strong> The belief that the edit can rescue anything. It can cut, reorder and polish, but it cannot create a shot you did not film, remove echo baked into the voice, or make a blurry clip sharp. Every problem is cheapest to fix at the earliest step: in the script, before the camera rolls.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Trap — perfecting one step while the story is broken.</strong> Spending three hours on colour before checking that the video makes sense from start to finish. Edit in passes: story first, then pacing, then colour and sound. Chapter 14 teaches the passes.</p></div>

<h3>🎬 Practice (30 minutes)</h3>
<div class="callout ok"><ol>
<li>Take the 60-second "before" clip from slide 14 (or your last Pocket 3 recording). Next to each of the 10 steps, write "done", "skipped" or "done badly".</li>
<li>Plan your <em>next</em> 60-second video on one page: one sentence (step 1), five bullet points of what you will say (step 2), and five shots you will need (step 3) — for example: talking to camera, hands on keyboard, screen close-up, you walking into the room, the finished result.</li>
<li>Create it as a project in <code>/creator/projects</code> and move it to the <em>Scripting</em> column.</li>
</ol><p><strong>Done when:</strong> the one-page plan exists with exactly one sentence, five points and five shots — before any camera is switched on.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Pre-production</span><span class="v">Everything before filming: idea, script, planning.</span></div>
  <div class="kv"><span class="k">Production</span><span class="v">The filming itself.</span></div>
  <div class="kv"><span class="k">Post-production</span><span class="v">Everything after filming: ingest, edit, colour, sound, export.</span></div>
  <div class="kv"><span class="k">Ingest</span><span class="v">Copying footage from cards into an organised, backed-up folder.</span></div>
  <div class="kv"><span class="k">Picture lock</span><span class="v">The point where the order and length of every shot is final.</span></div>
  <div class="kv"><span class="k">Fix it in post</span><span class="v">The (usually wrong) hope that editing will solve problems created while filming.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Four stages: pre-production, production, post-production, distribution — ten steps in total, looping back to the next idea.</li>
  <li>Each step produces something concrete; if you cannot name the output, the step was skipped.</li>
  <li>At 130 Mbps, 30 minutes of Pocket 3 footage is about 29 GB. A shot list cuts that to a few gigabytes and removes the hours of searching.</li>
  <li>Problems are cheapest to fix early. Plan on paper; edit in passes.</li>
</ul>
<div class="link-card"><a href="https://www.youtube.com/creators/" target="_blank" rel="noopener">YouTube Creators — YouTube's official hub for making and growing a channel</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>Video nào cũng đi qua cùng 10 bước — bỏ qua ba bước đầu là lý do dựng thấy "không thể"</h2>
<p class="lead">Hiện giờ quy trình của bạn là: bấm quay trên Pocket 3, nói 20–30 phút, về nhà rồi cố tìm ra một video nằm đâu đó trong đống cảnh quay. Đó không phải lười — đó là điều ai cũng làm trước khi học quy trình của người làm nghề. Bài này trải quy trình ấy ra từng bước, cho thấy mỗi bước làm ra thứ gì, và chứng minh bằng con số vì sao những bước còn thiếu đang lấy của bạn hàng giờ và hàng chục GB.</p>

<h3>Ba giai đoạn, giống như nấu một bữa ăn</h3>
${slide('cr-00', 8, 'Quy trình sản xuất: 10 bước')}
<div class="kv-grid">
  <div class="kv"><span class="k">Pre-production (tiền kỳ)</span><span class="v">Chọn thực đơn và đi chợ. Ý tưởng, kịch bản, danh sách cảnh quay. Chưa quay gì — và đây là nơi quyết định phần lớn chất lượng.</span></div>
  <div class="kv"><span class="k">Production (quay)</span><span class="v">Nấu. Bạn quay đúng những gì kế hoạch ghi, cộng thêm một chút dự phòng. Clip ngắn, có tên.</span></div>
  <div class="kv"><span class="k">Post-production (hậu kỳ)</span><span class="v">Bày món. Chép và sao lưu cảnh quay, dựng, sửa màu và âm thanh, thêm phụ đề, xuất file.</span></div>
  <div class="kv"><span class="k">Distribution (phát hành)</span><span class="v">Dọn món và nhìn nét mặt người ăn. Tiêu đề, thumbnail, đăng, rồi đọc số liệu để làm video sau tốt hơn.</span></div>
</div>

<h3>10 bước và thứ mỗi bước làm ra</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Ý tưởng</span><span class="lz-d">Một câu: người xem nhận được gì. Kèm một tiêu đề nháp. <em>Chương 1–2.</em></span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Kịch bản</span><span class="lz-d">Dàn ý hoặc kịch bản đầy đủ, viết câu mở đầu (hook) trước tiên. <em>Chương 3.</em></span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Phân cảnh</span><span class="lz-d">Shot list — mọi cảnh cần quay: cỡ cảnh, góc máy, chuyện gì diễn ra, máy nào quay. <em>Chương 4.</em></span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Quay</span><span class="lz-d">Những clip ngắn, clip nào cũng có việc, quay đúng cài đặt. <em>Chương 5–10.</em></span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Nhập liệu</span><span class="lz-d">Cảnh quay được chép vào thư mục chuẩn, đặt lại tên, sao lưu hai nơi. <em>Chương 11.</em></span></div>
<div class="lz-step"><span class="lz-k">6</span><span class="lz-t">Dựng</span><span class="lz-d">Từ bản dựng thô tới câu chuyện đã chốt ("picture lock"). <em>Chương 12–14.</em></span></div>
<div class="lz-step"><span class="lz-k">7</span><span class="lz-t">Màu &amp; âm</span><span class="lz-d">Khớp màu giữa các cảnh, giọng sạch và đúng độ lớn, phụ đề. <em>Chương 15–16.</em></span></div>
<div class="lz-step"><span class="lz-k">8</span><span class="lz-t">Xuất file</span><span class="lz-d">File đúng kích thước, tốc độ khung hình và codec cho từng nền tảng. <em>Chương 24.</em></span></div>
<div class="lz-step"><span class="lz-k">9</span><span class="lz-t">Đăng</span><span class="lz-d">Tiêu đề, thumbnail, mô tả, chương (chapters), phụ đề, hẹn giờ. <em>Chương 24–25.</em></span></div>
<div class="lz-step"><span class="lz-k">10</span><span class="lz-t">Đo &amp; học</span><span class="lz-d">Ba con số và một bài học cho video sau. <em>Chương 26.</em></span></div>
</div>
<pre><code class="language-mermaid">flowchart TB
  A["1 · Ý tưởng"] --> B["2 · Kịch bản"] --> C["3 · Phân cảnh"]
  C --> D["4 · Quay clip ngắn"] --> E["5 · Nhập liệu + sao lưu"]
  E --> F["6 · Dựng"] --> G["7 · Màu, âm, phụ đề"]
  G --> H["8 · Xuất file"] --> I["9 · Đăng"] --> J["10 · Đo & học"]
  J -->|"một bài học cho video sau"| A</code></pre>
<p>Để ý mũi tên cuối cùng. Bước 10 nuôi bước 1. Creator không làm một video; họ chạy vòng lặp này hàng chục lần, và mỗi vòng làm vòng sau dễ hơn.</p>

<h3>Những con số đằng sau "quay 30 phút rồi về cắt"</h3>
${slide('cr-00', 9, 'Bạn đang ở đâu trong quy trình')}
<p>Pocket 3 ghi tối đa 130 megabit mỗi giây. Một phút là 130 × 60 = 7.800 megabit, chia 8 bit mỗi byte = <strong>975 MB mỗi phút</strong>. Vậy:</p>
<table>
  <tr><th></th><th>Thói quen quay hết</th><th>Có shot list</th></tr>
  <tr><td>Lượng cảnh quay</td><td>30 phút trong một clip</td><td>25 clip × ~20 giây ≈ 8 phút</td></tr>
  <tr><td>Dung lượng ở 130 Mbps</td><td>≈ 29 GB</td><td>≈ 8 GB</td></tr>
  <tr><td>Thẻ 128 GB chứa được</td><td>khoảng 4 buổi quay</td><td>khoảng 15 buổi quay</td></tr>
  <tr><td>Thời gian chỉ để xem lại</td><td>30 phút, mà vẫn phải ghi chú</td><td>8 phút — clip nào cũng biết để làm gì</td></tr>
  <tr><td>Đoạn hay nằm ở đâu</td><td>Đâu đó trong 30 phút</td><td>Trong tên file và shot list</td></tr>
</table>
<p>Cái giá thật không phải là GB, mà là thời gian của bạn. Xem 30 phút cảnh quay để tìm 90 giây đáng giữ là phần chậm nhất của việc dựng, và nó lặp lại mỗi lần. Có shot list, bạn nghĩ một lần — trước khi quay, lúc việc nghĩ còn rẻ.</p>
<p class="note-ct"><strong>Khi nào quay dài là ĐÚNG:</strong> quay màn hình một bài giảng code, phỏng vấn, livestream. Kể cả khi đó, người làm nghề vẫn đánh dấu khoảnh khắc (vỗ tay, nói một câu ghi chú, bấm marker) để lúc dựng tìm lại được. Chương 4 dạy cách làm.</p>

<h3>Kế hoạch thời gian thực tế cho những video đầu tiên</h3>
<p>Với một video YouTube dài 5–8 phút, những lần làm đầu tiên của người mới thường rơi vào khoảng như dưới đây. Coi đây là con số phỏng đoán ban đầu — hãy tự đo thời gian của mình và sửa lại sau ba video:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Tiền kỳ</span><span class="v">1–2 giờ: ý tưởng, dàn ý, hook, shot list.</span></div>
  <div class="kv"><span class="k">Quay</span><span class="v">1–2 giờ, tính cả dựng máy, đèn, thử tiếng và vài lần quay lại.</span></div>
  <div class="kv"><span class="k">Hậu kỳ</span><span class="v">3–5 giờ: nhập liệu, dựng, màu, âm thanh, phụ đề, xuất file.</span></div>
  <div class="kv"><span class="k">Đăng &amp; đo</span><span class="v">1 giờ: tiêu đề, thumbnail, mô tả, rồi xem kết quả sau vài ngày.</span></div>
</div>
<p>Hậu kỳ tốn thời gian nhất — và đó chính là giai đoạn mà việc lên kế hoạch giúp nhanh lên. Trên <code>/creator/pipeline</code>, mỗi dự án đi qua đúng các cột bạn vừa học: <em>Ý tưởng → Viết kịch bản → Đang quay → Đang dựng → Đã lên lịch → Đã đăng</em>. Đưa mọi video vào đó để thấy công việc của mình hay tắc ở đâu.</p>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — "để hậu kỳ lo" (fix it in post).</strong> Niềm tin rằng khâu dựng cứu được mọi thứ. Dựng cắt được, sắp lại được, làm bóng được, nhưng không tạo ra được cảnh bạn chưa quay, không xoá được tiếng vang đã dính vào giọng, không làm nét được một clip bị mờ. Mọi vấn đề đều rẻ nhất khi sửa ở bước sớm nhất: trong kịch bản, trước khi máy chạy.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — chăm chút một bước trong khi câu chuyện còn gãy.</strong> Bỏ ba tiếng chỉnh màu trước khi kiểm xem video có hiểu được từ đầu tới cuối không. Hãy dựng theo lượt: câu chuyện trước, nhịp sau, màu và âm cuối cùng. Chương 14 dạy các lượt dựng.</p></div>

<h3>🎬 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Lấy clip 60 giây "trước khi học" ở slide 14 (hoặc lần quay Pocket 3 gần nhất). Cạnh mỗi bước trong 10 bước, ghi "đã làm", "bỏ qua" hay "làm chưa tốt".</li>
<li>Lên kế hoạch cho video 60 giây <em>tiếp theo</em> trên một trang: một câu (bước 1), năm gạch đầu dòng điều bạn sẽ nói (bước 2), và năm cảnh bạn cần quay (bước 3) — ví dụ: nói với máy, tay trên bàn phím, cận màn hình, bạn bước vào phòng, kết quả cuối cùng.</li>
<li>Tạo nó thành một dự án trong <code>/creator/projects</code> và chuyển sang cột <em>Viết kịch bản</em>.</li>
</ol><p><strong>Đạt khi:</strong> trang kế hoạch có đúng một câu, năm ý và năm cảnh — trước khi bật bất kỳ máy quay nào.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Pre-production</span><span class="v">Tiền kỳ — mọi việc trước khi quay: ý tưởng, kịch bản, lên kế hoạch.</span></div>
  <div class="kv"><span class="k">Production</span><span class="v">Giai đoạn quay.</span></div>
  <div class="kv"><span class="k">Post-production</span><span class="v">Hậu kỳ — mọi việc sau khi quay: nhập liệu, dựng, màu, âm, xuất file.</span></div>
  <div class="kv"><span class="k">Ingest</span><span class="v">Nhập liệu — chép cảnh quay từ thẻ vào thư mục có tổ chức và có sao lưu.</span></div>
  <div class="kv"><span class="k">Picture lock</span><span class="v">Chốt hình — lúc thứ tự và độ dài mọi cảnh đã cố định.</span></div>
  <div class="kv"><span class="k">Fix it in post</span><span class="v">"Để hậu kỳ lo" — hy vọng (thường là sai) rằng khâu dựng sẽ giải quyết lỗi gây ra lúc quay.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Bốn giai đoạn: tiền kỳ, quay, hậu kỳ, phát hành — tổng cộng mười bước, quay vòng về ý tưởng tiếp theo.</li>
  <li>Bước nào cũng làm ra một thứ cụ thể; không gọi tên được thứ đó nghĩa là bước đó đã bị bỏ qua.</li>
  <li>Ở 130 Mbps, 30 phút cảnh quay Pocket 3 là khoảng 29 GB. Shot list rút xuống vài GB và bỏ luôn hàng giờ tìm kiếm.</li>
  <li>Lỗi sửa sớm là rẻ nhất. Lên kế hoạch trên giấy; dựng theo lượt.</li>
</ul>
<div class="link-card"><a href="https://www.youtube.com/creators/" target="_blank" rel="noopener">YouTube Creators — trang chính thức của YouTube về làm và phát triển kênh</a></div>
</div>
`,
    },

    /* ─────────────────── 0.4 lộ trình & cách học ─────────────────── */
    {
      title: '0.4 — The 28-part roadmap, and how to learn by making|||0.4 — Lộ trình 28 phần, và cách học bằng cách làm',
      slug: 'cr-00-4-lo-trinh-cach-hoc',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Năm giai đoạn của khoá, đường tắt khi bạn cần đăng video ngay tuần này, cách học để ra sản phẩm thật, và tài liệu học sâu đi kèm.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>Twenty-five parts, five phases — and a way of learning that ends with videos, not notes</h2>
<p class="lead">This course is long on purpose: it follows the real workflow from the first idea to reading your analytics. But you do not have to finish it before publishing anything. This lesson shows the map, three shortcuts depending on what you want to post first, and the learning habits that turn chapters into actual videos.</p>

<h3>The map</h3>
${slide('cr-00', 10, 'Lộ trình 28 phần — 5 giai đoạn')}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Phase 1</span><span class="lz-t">Pre-production · Ch 1–4</span><span class="lz-d">Platforms and audience, ideas and strategy, scripts and storytelling, <strong>shot lists and storyboards</strong> (the chapter that ends the 30-minute-take habit).</span></div>
<div class="lz-layer"><span class="lz-k">Phase 2</span><span class="lz-t">Shooting · Ch 5–10</span><span class="lz-d">How cameras work, setting up your Pocket 3 / iPhone / iPad / Mac, composition, light, sound, and shooting alone like a pro.</span></div>
<div class="lz-layer"><span class="lz-k">Phase 3</span><span class="lz-t">Post-production · Ch 11–19</span><span class="lz-d">Managing footage and backups, <strong>CapCut</strong>, <strong>DaVinci Resolve</strong>, the craft of editing, colour grading, sound mixing, graphics and subtitles — then professional effects: transitions, keyframes and speed, masks, tracking and VFX, motion graphics and 3D.</span></div>
<div class="lz-layer"><span class="lz-k">Phase 4</span><span class="lz-t">Formats · Ch 20–23</span><span class="lz-d">Short vertical video, vlogs, teaching videos and screen recordings, and bilingual Vietnamese–English videos.</span></div>
<div class="lz-layer"><span class="lz-k">Phase 5</span><span class="lz-t">Growth · Ch 24–27</span><span class="lz-d">Exporting and publishing, titles and thumbnails, analytics and monetisation, and a 30-day channel-launch project.</span></div>
</div>

<h3>Three shortcuts — if you want to publish this week</h3>
<table>
  <tr><th>Your first goal</th><th>Read in this order</th><th>Then go back to</th></tr>
  <tr><td>A short vertical video (TikTok / Reels / Shorts)</td><td>Ch 4 → Ch 6 → Ch 12 → Ch 20</td><td>Ch 3 (hooks), Ch 9 (sound)</td></tr>
  <tr><td>A YouTube coding tutorial</td><td>Ch 3 → Ch 4 → Ch 9 → Ch 13 → Ch 22</td><td>Ch 8 (light), Ch 25 (thumbnail)</td></tr>
  <tr><td>A vlog</td><td>Ch 4 → Ch 6 → Ch 7 → Ch 21</td><td>Ch 14 (editing craft), Ch 15 (colour)</td></tr>
</table>
<p>Shortcuts are for momentum, not for skipping forever. The chapters you jump over are exactly where your next improvement will come from.</p>

<h3>How to learn so that you actually make videos</h3>
${slide('cr-00', 11, 'Mỗi chương học thế nào')}
<ol>
  <li><strong>Picture first.</strong> Skim the chapter's slides (lesson N.0) before reading. Your brain files the details better when it already has the outline.</li>
  <li><strong>Read, then watch.</strong> Each lesson has a video at the top. Read the lesson, then watch the video to see the same idea done by someone else.</li>
  <li><strong>Do the practice with your own gear.</strong> Every lesson ends with a practice task and a measurable "Done when". If you did not meet it, do it again — that repetition is the actual learning.</li>
  <li><strong>Take the chapter check.</strong> Ten situation questions with explanations. A wrong answer tells you which lesson to reread.</li>
  <li><strong>Publish something small.</strong> Without publishing there are no numbers, and without numbers you do not know what to fix.</li>
</ol>
<p>Keep a <strong>creator log</strong> — one note per video with three lines: what worked, what did not, what you will change next time. After ten videos this log is worth more than any tutorial, because it is about <em>your</em> mistakes.</p>

<h3>Your tools inside the course</h3>
${slide('cr-00', 12, 'Công cụ đi cùng khoá: /creator')}
<div class="kv-grid">
  <div class="kv"><span class="k">/creator/ideas</span><span class="v">Your idea bank. Chapter 2 teaches how to score ideas before filming.</span></div>
  <div class="kv"><span class="k">/creator/calendar</span><span class="v">The publishing calendar. A realistic rhythm beats an ambitious one you abandon.</span></div>
  <div class="kv"><span class="k">/creator/pipeline</span><span class="v">Every video as a card moving from Idea to Published.</span></div>
  <div class="kv"><span class="k">/creator/projects</span><span class="v">Scripts with nine ready-made templates (lecture, tutorial, story vlog, one-idea short…), saved versions, and a built-in teleprompter.</span></div>
</div>
${slide('cr-00', 13, 'Ba luồng video trong mỗi bài học')}
<p>Each lesson on cuongthai.com has three video tracks: <strong>VI</strong> and <strong>EN</strong> (recorded by you) and <strong>YT</strong> (a hand-picked video from an experienced creator, shown until your own recordings exist). By the end of this course you will be able to fill the VI and EN tracks of your other courses yourself — Chapter 22 shows exactly how.</p>
<div class="callout ok"><p><strong>Most of the best video tutorials are in English.</strong> On YouTube (web) click the ⚙️ <em>Settings</em> gear → <em>Subtitles/CC</em> → <em>Auto-translate</em> → <em>Vietnamese</em>; in the app, open the ⋯ menu → <em>Captions</em>. Add <em>Playback speed 0.75</em> when a presenter talks fast. Auto-translated captions are imperfect, but combined with the Vietnamese lesson above the video they are more than enough — and you pick up the English terms along the way.</p></div>

<h3>Going deeper: reading that will not go out of date</h3>
<div class="khoi-sach">
  <a class="the-sach chinh" href="https://www.blackmagicdesign.com/products/davinciresolve/training" target="_blank" rel="noopener">
    <span class="sach-ico">📗</span>
    <span class="sach-than"><span class="sach-ten">DaVinci Resolve training books (Beginner's Guide, Editor's Guide, Colorist Guide, Fairlight Audio Guide)</span>
      <span class="sach-phu">Blackmagic Design · official training, with project files</span>
      <span class="sach-nhan-nhom"><span class="sach-nhan chinh">Main material</span><span class="sach-nhan mien-phi">Free</span></span></span>
    <span class="sach-nut">Open →</span></a>
  <div class="the-sach khong-link"><span class="sach-ico">📘</span><span class="sach-than">
    <span class="sach-ten">In the Blink of an Eye: A Perspective on Film Editing</span>
    <span class="sach-phu">Walter Murch · 2nd edition, 2001</span>
    <span class="sach-nhan-nhom"><span class="sach-nhan tham-khao">Reference</span><span class="sach-nhan giay">Print</span></span></span></div>
  <a class="the-sach" href="https://www.youtube.com/creators/" target="_blank" rel="noopener">
    <span class="sach-ico">▶️</span>
    <span class="sach-than"><span class="sach-ten">YouTube Creators</span>
      <span class="sach-phu">YouTube · official guidance on making, publishing and growing</span>
      <span class="sach-nhan-nhom"><span class="sach-nhan mien-phi">Free</span></span></span>
    <span class="sach-nut">Open →</span></a>
</div>

<div class="pitfall co-tieu-de"><p><strong>Trap — finishing the course before making anything.</strong> Reading 25 chapters without filming gives you vocabulary, not skill. The course is built so that every chapter produces something; if a week passes without a new clip, go back to the practice tasks.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Trap — learning software before learning story.</strong> Knowing every CapCut effect does not make a video worth watching. The order of this course — idea, script, shot list, then tools — is deliberate.</p></div>

<h3>🎬 Practice (15 minutes)</h3>
<div class="callout ok"><ol>
<li>Pick <strong>one</strong> shortcut from the table above as your first goal.</li>
<li>Block <strong>three study sessions per week</strong> in your calendar (45–60 minutes each). Consistency beats long weekend marathons.</li>
<li>Create a note called <strong>Creator log</strong> with three headings: What worked · What did not · Next time.</li>
<li>Write your day-30 goal in one line, for example: "One 6-minute YouTube tutorial, three shorts and one vlog published."</li>
</ol><p><strong>Done when:</strong> one shortcut is chosen, three sessions are in the calendar, the Creator log exists, and the day-30 goal is written down.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Workflow</span><span class="v">The fixed sequence of steps you repeat for every video.</span></div>
  <div class="kv"><span class="k">Capstone</span><span class="v">A final project that uses everything from the course (Chapter 27).</span></div>
  <div class="kv"><span class="k">Feedback loop</span><span class="v">Make → publish → measure → adjust → make again.</span></div>
  <div class="kv"><span class="k">Consistency</span><span class="v">Publishing on a steady rhythm. The strongest predictor of a channel lasting.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Five phases: pre-production, shooting, post-production, formats, growth — 27 chapters after this section.</li>
  <li>Use a shortcut to publish early, then return to the chapters you skipped.</li>
  <li>Learn in a loop: slides → lesson → video → practice → check → publish → log.</li>
  <li>Your <code>/creator</code> studio holds ideas, calendar, pipeline, scripts and the teleprompter.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>28 phần, 5 giai đoạn — và một cách học kết thúc bằng video, không phải bằng ghi chép</h2>
<p class="lead">Khoá này dài có chủ đích: nó đi theo đúng quy trình thật, từ ý tưởng đầu tiên tới lúc đọc số liệu kênh. Nhưng bạn không phải học xong mới được đăng video. Bài này cho bạn tấm bản đồ, ba đường tắt tuỳ bạn muốn đăng gì trước, và những thói quen học biến từng chương thành video thật.</p>

<h3>Tấm bản đồ</h3>
${slide('cr-00', 10, 'Lộ trình 28 phần — 5 giai đoạn')}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Giai đoạn 1</span><span class="lz-t">Tiền kỳ · Ch 1–4</span><span class="lz-d">Nền tảng và khán giả, ý tưởng và chiến lược, kịch bản và kể chuyện, <strong>shot list và storyboard</strong> (chương chấm dứt thói quen quay một lèo 30 phút).</span></div>
<div class="lz-layer"><span class="lz-k">Giai đoạn 2</span><span class="lz-t">Quay · Ch 5–10</span><span class="lz-d">Máy quay hoạt động thế nào, cài đặt Pocket 3 / iPhone / iPad / Mac, bố cục, ánh sáng, âm thanh, và tự quay một mình như dân chuyên.</span></div>
<div class="lz-layer"><span class="lz-k">Giai đoạn 3</span><span class="lz-t">Hậu kỳ · Ch 11–19</span><span class="lz-d">Quản lý cảnh quay và sao lưu, <strong>CapCut</strong>, <strong>DaVinci Resolve</strong>, nghệ thuật cắt dựng, chỉnh màu, mix âm thanh, chữ đồ hoạ và phụ đề — rồi hiệu ứng chuyên nghiệp: chuyển cảnh, keyframe và tốc độ, mask, tracking và VFX, motion graphics và 3D.</span></div>
<div class="lz-layer"><span class="lz-k">Giai đoạn 4</span><span class="lz-t">Theo định dạng · Ch 20–23</span><span class="lz-d">Video ngắn dọc, vlog, video bài giảng và quay màn hình, video song ngữ Việt–Anh.</span></div>
<div class="lz-layer"><span class="lz-k">Giai đoạn 5</span><span class="lz-t">Phát triển · Ch 24–27</span><span class="lz-d">Xuất file và đăng, tiêu đề và thumbnail, số liệu và kiếm tiền, và dự án 30 ngày ra mắt kênh.</span></div>
</div>

<h3>Ba đường tắt — nếu bạn muốn đăng ngay tuần này</h3>
<table>
  <tr><th>Mục tiêu đầu tiên</th><th>Đọc theo thứ tự</th><th>Rồi quay lại</th></tr>
  <tr><td>Một video ngắn dọc (TikTok / Reels / Shorts)</td><td>Ch 4 → Ch 6 → Ch 12 → Ch 20</td><td>Ch 3 (hook), Ch 9 (âm thanh)</td></tr>
  <tr><td>Một video hướng dẫn code trên YouTube</td><td>Ch 3 → Ch 4 → Ch 9 → Ch 13 → Ch 22</td><td>Ch 8 (ánh sáng), Ch 25 (thumbnail)</td></tr>
  <tr><td>Một vlog</td><td>Ch 4 → Ch 6 → Ch 7 → Ch 21</td><td>Ch 14 (nghệ thuật dựng), Ch 15 (màu)</td></tr>
</table>
<p>Đường tắt là để có đà, không phải để bỏ qua mãi mãi. Những chương bạn nhảy qua chính là nơi lần tiến bộ tiếp theo của bạn nằm đó.</p>

<h3>Học thế nào để thật sự làm ra video</h3>
${slide('cr-00', 11, 'Mỗi chương học thế nào')}
<ol>
  <li><strong>Hình trước.</strong> Lướt bộ slide của chương (bài N.0) trước khi đọc. Não xếp chi tiết vào chỗ tốt hơn khi nó đã có sẵn khung.</li>
  <li><strong>Đọc, rồi xem.</strong> Mỗi bài có video ở đầu trang. Đọc bài, rồi xem video để thấy cùng một ý được người khác làm ra sao.</li>
  <li><strong>Làm phần thực hành bằng máy của mình.</strong> Bài nào cũng kết thúc bằng một nhiệm vụ và tiêu chí "Đạt khi" đo được. Chưa đạt thì làm lại — chính sự lặp lại đó mới là việc học.</li>
  <li><strong>Làm bài kiểm tra chương.</strong> Mười câu tình huống có giải thích. Câu sai cho bạn biết cần đọc lại bài nào.</li>
  <li><strong>Đăng một thứ nhỏ.</strong> Không đăng thì không có số liệu, không có số liệu thì không biết phải sửa gì.</li>
</ol>
<p>Giữ một <strong>nhật ký creator</strong> — mỗi video một ghi chú ba dòng: điều gì ổn, điều gì chưa, lần sau đổi gì. Sau mười video, cuốn nhật ký này giá trị hơn bất kỳ video hướng dẫn nào, vì nó viết về lỗi của <em>chính bạn</em>.</p>

<h3>Công cụ của bạn đi cùng khoá</h3>
${slide('cr-00', 12, 'Công cụ đi cùng khoá: /creator')}
<div class="kv-grid">
  <div class="kv"><span class="k">/creator/ideas</span><span class="v">Kho ý tưởng. Chương 2 dạy chấm điểm ý tưởng trước khi quay.</span></div>
  <div class="kv"><span class="k">/creator/calendar</span><span class="v">Lịch đăng. Một nhịp thực tế thắng một nhịp tham vọng rồi bỏ dở.</span></div>
  <div class="kv"><span class="k">/creator/pipeline</span><span class="v">Mỗi video là một thẻ đi từ Ý tưởng tới Đã đăng.</span></div>
  <div class="kv"><span class="k">/creator/projects</span><span class="v">Kịch bản với chín mẫu dựng sẵn (bài giảng, hướng dẫn công cụ, vlog kể chuyện, video ngắn một ý…), lưu phiên bản, và teleprompter có sẵn.</span></div>
</div>
${slide('cr-00', 13, 'Ba luồng video trong mỗi bài học')}
<p>Mỗi bài học trên cuongthai.com có ba luồng video: <strong>VI</strong> và <strong>EN</strong> (do bạn tự quay) và <strong>YT</strong> (một video chọn lọc từ người làm nghề, hiện ra cho tới khi bạn có bản quay của mình). Học xong khoá này, bạn sẽ tự lấp được luồng VI và EN cho các khoá khác của mình — Chương 22 chỉ đúng cách làm.</p>
<div class="callout ok"><p><strong>Phần lớn video hướng dẫn hay nhất là tiếng Anh.</strong> Trên YouTube bản web, bấm bánh răng ⚙️ <em>Cài đặt</em> → <em>Phụ đề</em> → <em>Tự động dịch</em> → <em>Tiếng Việt</em>; trong ứng dụng, mở menu ⋯ → <em>Phụ đề</em>. Thêm <em>Tốc độ phát 0.75</em> khi người nói nhanh. Phụ đề tự dịch chưa hoàn hảo, nhưng đi cùng bài học tiếng Việt ngay trên video thì thừa đủ — và bạn học được luôn thuật ngữ tiếng Anh.</p></div>

<h3>Học sâu hơn: những tài liệu không lỗi thời</h3>
<div class="khoi-sach">
  <a class="the-sach chinh" href="https://www.blackmagicdesign.com/products/davinciresolve/training" target="_blank" rel="noopener">
    <span class="sach-ico">📗</span>
    <span class="sach-than"><span class="sach-ten">Bộ sách đào tạo DaVinci Resolve (Beginner's Guide, Editor's Guide, Colorist Guide, Fairlight Audio Guide)</span>
      <span class="sach-phu">Blackmagic Design · tài liệu đào tạo chính hãng, kèm file dự án để tập</span>
      <span class="sach-nhan-nhom"><span class="sach-nhan chinh">Giáo trình chính</span><span class="sach-nhan mien-phi">Miễn phí</span></span></span>
    <span class="sach-nut">Mở →</span></a>
  <div class="the-sach khong-link"><span class="sach-ico">📘</span><span class="sach-than">
    <span class="sach-ten">In the Blink of an Eye: A Perspective on Film Editing</span>
    <span class="sach-phu">Walter Murch · tái bản lần 2, 2001</span>
    <span class="sach-nhan-nhom"><span class="sach-nhan tham-khao">Tham khảo</span><span class="sach-nhan giay">Sách giấy</span></span></span></div>
  <a class="the-sach" href="https://www.youtube.com/creators/" target="_blank" rel="noopener">
    <span class="sach-ico">▶️</span>
    <span class="sach-than"><span class="sach-ten">YouTube Creators</span>
      <span class="sach-phu">YouTube · hướng dẫn chính thức về làm, đăng và phát triển kênh</span>
      <span class="sach-nhan-nhom"><span class="sach-nhan mien-phi">Miễn phí</span></span></span>
    <span class="sach-nut">Mở →</span></a>
</div>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — học hết khoá rồi mới làm.</strong> Đọc 25 chương mà không quay gì cho bạn vốn từ, không cho bạn kỹ năng. Khoá được thiết kế để chương nào cũng làm ra một sản phẩm; nếu một tuần trôi qua mà không có clip mới, hãy quay lại các bài thực hành.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — học phần mềm trước khi học kể chuyện.</strong> Biết hết hiệu ứng CapCut không làm video đáng xem hơn. Thứ tự của khoá — ý tưởng, kịch bản, shot list, rồi mới tới công cụ — là có chủ đích.</p></div>

<h3>🎬 Thực hành (15 phút)</h3>
<div class="callout ok"><ol>
<li>Chọn <strong>một</strong> đường tắt ở bảng trên làm mục tiêu đầu tiên.</li>
<li>Xếp <strong>ba buổi học mỗi tuần</strong> vào lịch (mỗi buổi 45–60 phút). Đều đặn thắng những buổi học dồn cuối tuần.</li>
<li>Tạo một ghi chú tên <strong>Nhật ký creator</strong> với ba đề mục: Điều gì ổn · Điều gì chưa · Lần sau.</li>
<li>Viết mục tiêu ngày thứ 30 trong một dòng, ví dụ: "Đăng một video hướng dẫn 6 phút trên YouTube, ba video ngắn và một vlog."</li>
</ol><p><strong>Đạt khi:</strong> đã chọn một đường tắt, ba buổi học đã nằm trong lịch, có Nhật ký creator, và mục tiêu ngày 30 đã được viết ra.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Workflow</span><span class="v">Quy trình làm việc — chuỗi bước cố định lặp lại cho mọi video.</span></div>
  <div class="kv"><span class="k">Capstone</span><span class="v">Dự án cuối khoá dùng mọi thứ đã học (Chương 27).</span></div>
  <div class="kv"><span class="k">Feedback loop</span><span class="v">Vòng phản hồi: làm → đăng → đo → chỉnh → làm lại.</span></div>
  <div class="kv"><span class="k">Consistency</span><span class="v">Sự đều đặn — đăng theo một nhịp ổn định. Yếu tố mạnh nhất quyết định kênh có sống lâu không.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Năm giai đoạn: tiền kỳ, quay, hậu kỳ, định dạng, phát triển — 27 chương sau phần mở đầu này.</li>
  <li>Dùng đường tắt để đăng sớm, rồi quay lại những chương đã bỏ qua.</li>
  <li>Học theo vòng: slide → bài đọc → video → thực hành → kiểm tra → đăng → ghi nhật ký.</li>
  <li>Xưởng <code>/creator</code> của bạn giữ ý tưởng, lịch, tiến độ, kịch bản và teleprompter.</li>
</ul>
</div>
`,
    },

    /* ─────────────────── 0.5 kiểm tra ─────────────────── */
    {
      title: '0.5 — Section 0 check|||0.5 — Kiểm tra Mục 0',
      slug: 'cr-00-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu tình huống về creator, đồ nghề, quy trình sản xuất và cách học.',
      content: `
<div class="ml-en">
<h2>📝 Section 0 — summary and self-check</h2>
<ul>
  <li>A creator shows up <strong>regularly</strong> for a <strong>specific</strong> audience. Your lane: developer and teacher, sending people to cuongthai.com.</li>
  <li>Online video went from 19 unedited seconds (2005) to vertical feeds everywhere. Cameras are common; skill is rare.</li>
  <li>Buy in this order: <strong>sound → light → storage → camera</strong>. Pocket 3 = vlog/B-roll, iPhone = A-cam, iPad = planning, Mac = editing, Linux = backups/conversion/subtitles.</li>
  <li>Ten steps: idea → script → shot list → shoot → ingest → edit → colour &amp; sound → export → publish → measure, then loop.</li>
  <li>30 minutes of Pocket 3 at 130 Mbps ≈ 29 GB. Planning cuts the footage, the storage and — above all — the hours of searching.</li>
</ul>
<p><strong>Check yourself before the quiz:</strong> can you say your creator statement in one sentence? Did both cameras report 25 fps with <code>ffprobe</code>? Is your next 60-second video planned on one page?</p>
</div>
<div class="ml-vi">
<h2>📝 Mục 0 — tóm tắt và tự kiểm</h2>
<ul>
  <li>Creator là người xuất hiện <strong>đều đặn</strong> cho một nhóm khán giả <strong>cụ thể</strong>. Làn đường của bạn: lập trình viên kiêm người dạy, dẫn người xem về cuongthai.com.</li>
  <li>Video trực tuyến đi từ 19 giây không dựng (2005) tới luồng video dọc ở khắp nơi. Máy quay phổ biến; kỹ năng mới hiếm.</li>
  <li>Mua theo thứ tự: <strong>âm thanh → ánh sáng → lưu trữ → máy quay</strong>. Pocket 3 = vlog/B-roll, iPhone = A-cam, iPad = lên kế hoạch, Mac = dựng, Linux = sao lưu/chuyển mã/phụ đề.</li>
  <li>Mười bước: ý tưởng → kịch bản → phân cảnh → quay → nhập liệu → dựng → màu &amp; âm → xuất → đăng → đo, rồi quay vòng.</li>
  <li>30 phút Pocket 3 ở 130 Mbps ≈ 29 GB. Lên kế hoạch giảm cảnh quay, giảm dung lượng — và trên hết, giảm hàng giờ tìm kiếm.</li>
</ul>
<p><strong>Tự kiểm trước khi làm bài:</strong> bạn nói được câu tuyên bố creator trong một câu chưa? Cả hai máy đã báo 25 fps bằng <code>ffprobe</code> chưa? Video 60 giây tiếp theo đã được lên kế hoạch trên một trang chưa?</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'You have a small budget and your videos look fine but many viewers leave in the first minute. Comments mention "hard to hear". What should you buy first?|||Bạn có ít tiền, video nhìn ổn nhưng nhiều người rời đi ngay phút đầu. Bình luận nói "khó nghe". Nên mua gì trước?',
            options: ['A new camera with a bigger sensor|||Một máy quay mới cảm biến to hơn', 'A ring light|||Một đèn vòng', 'A second memory card|||Thêm một thẻ nhớ', 'A wireless lav microphone|||Một micro cài áo không dây'],
            correctIndex: 3,
            points: 1,
            explanation: 'The complaint is about sound, and sound is first in the professional order (sound → light → storage → camera). A new camera would not change what people hear.|||Lời phàn nàn là về âm thanh, và âm thanh đứng đầu thứ tự của người làm nghề (âm thanh → ánh sáng → lưu trữ → máy quay). Máy quay mới không thay đổi thứ người xem nghe thấy.',
          },
          {
            question: 'The Pocket 3 records at up to 130 Mbps. Roughly how much space does one continuous 30-minute take use?|||Pocket 3 ghi tối đa 130 Mbps. Một lần quay liền 30 phút tốn khoảng bao nhiêu dung lượng?',
            options: ['About 3 GB|||Khoảng 3 GB', 'About 13 GB|||Khoảng 13 GB', 'About 29 GB|||Khoảng 29 GB', 'About 130 GB|||Khoảng 130 GB'],
            correctIndex: 2,
            points: 1,
            explanation: '130 megabits/s × 60 = 7,800 megabits per minute ÷ 8 = 975 MB per minute; × 30 minutes ≈ 29 GB. The trap is forgetting to divide by 8 (bits → bytes).|||130 megabit/giây × 60 = 7.800 megabit mỗi phút ÷ 8 = 975 MB mỗi phút; × 30 phút ≈ 29 GB. Bẫy là quên chia 8 (bit → byte).',
          },
          {
            question: 'Which three steps make up pre-production?|||Ba bước nào thuộc tiền kỳ (pre-production)?',
            options: ['Idea, script, shot list|||Ý tưởng, kịch bản, phân cảnh', 'Shoot, ingest, edit|||Quay, nhập liệu, dựng', 'Edit, colour, export|||Dựng, màu, xuất file', 'Publish, measure, idea|||Đăng, đo, ý tưởng'],
            correctIndex: 0,
            points: 1,
            explanation: 'Pre-production is everything before the camera rolls: the idea, the script and the shot list. It is where most of the quality is decided — and exactly the part the "record 30 minutes" habit skips.|||Tiền kỳ là mọi việc trước khi máy chạy: ý tưởng, kịch bản và phân cảnh. Đây là nơi quyết định phần lớn chất lượng — và chính là phần mà thói quen "quay 30 phút" bỏ qua.',
          },
          {
            question: 'You plan a talking-head video at your desk and want a second angle to cut to. Which setup fits your gear best?|||Bạn định quay video nói chuyện tại bàn và muốn có thêm một góc để cắt sang. Cách bố trí nào hợp đồ nghề của bạn nhất?',
            options: ['Pocket 3 hand-held as the only camera|||Chỉ cầm tay Pocket 3', 'Mac webcam only|||Chỉ dùng webcam của Mac', 'iPad front camera as A-cam|||Camera trước của iPad làm A-cam', 'iPhone on a tripod as A-cam, Pocket 3 from the side as B-cam|||iPhone trên chân máy làm A-cam, Pocket 3 đặt bên cạnh làm B-cam'],
            correctIndex: 3,
            points: 1,
            explanation: 'The iPhone is your strongest camera and belongs on a tripod as the main angle; the Pocket 3 makes a good second angle. The iPad is more useful as a teleprompter than as a camera.|||iPhone là máy mạnh nhất, nên đặt trên chân máy làm góc chính; Pocket 3 làm góc phụ rất tốt. iPad có ích hơn khi làm teleprompter so với làm máy quay.',
          },
          {
            question: 'Before cutting two cameras together, what must match?|||Trước khi dựng chung hai máy quay, điều gì bắt buộc phải khớp?',
            options: ['Frame rate and colour mode|||Tốc độ khung hình và chế độ màu', 'The brand of the cameras|||Hãng máy', 'The memory card size|||Dung lượng thẻ nhớ', 'The battery level|||Mức pin'],
            correctIndex: 0,
            points: 1,
            explanation: 'Mixing 25 and 30 fps makes motion stutter, and mixing HDR with SDR or Log with normal makes colours impossible to match. In this course both cameras run at 25 fps.|||Trộn 25 và 30 fps làm chuyển động bị giật, còn trộn HDR với SDR hay Log với thường thì màu không bao giờ khớp. Trong khoá này cả hai máy chạy 25 fps.',
          },
          {
            question: 'What does "fix it in post" usually lead to?|||"Để hậu kỳ lo" (fix it in post) thường dẫn tới điều gì?',
            options: ['Faster videos, because editing is cheap|||Làm video nhanh hơn vì dựng rẻ', 'Better colour|||Màu đẹp hơn', 'Problems that editing cannot solve, like missing shots or echo in the voice|||Những lỗi dựng không sửa được, như thiếu cảnh hoặc giọng bị vang', 'Smaller files|||File nhỏ hơn'],
            correctIndex: 2,
            points: 1,
            explanation: 'Editing can cut and reorder, but it cannot create a shot you never filmed or remove echo baked into the recording. Problems are cheapest to fix at the earliest step.|||Dựng cắt và sắp lại được, nhưng không tạo ra được cảnh chưa quay hay xoá được tiếng vang đã dính vào bản ghi. Lỗi rẻ nhất khi sửa ở bước sớm nhất.',
          },
          {
            question: 'DataReportal lists TikTok’s advertising reach in Vietnam as 102.9% of adults. What is the best explanation?|||DataReportal ghi tệp quảng cáo của TikTok ở Việt Nam bằng 102,9% số người trưởng thành. Giải thích nào đúng nhất?',
            options: ['The data is wrong|||Số liệu bị sai', 'Advertising reach counts accounts, and one person can have several|||Tệp quảng cáo đếm tài khoản, và một người có thể có nhiều tài khoản', 'Tourists are included|||Có tính cả khách du lịch', 'Children lie about their age|||Trẻ em khai gian tuổi'],
            correctIndex: 1,
            points: 1,
            explanation: 'Advertising reach is the number of accounts an advertiser can target, not unique people — so it can exceed the population. Use these figures to compare platforms, not as exact head-counts.|||Tệp quảng cáo là số tài khoản nhà quảng cáo nhắm tới được, không phải số người thật — nên nó có thể vượt dân số. Dùng số này để so sánh các nền tảng, đừng coi là số người chính xác.',
          },
          {
            question: 'You want to publish your first short vertical video this week. Which reading order does the course suggest?|||Bạn muốn đăng video ngắn dọc đầu tiên ngay tuần này. Khoá gợi ý đọc theo thứ tự nào?',
            options: ['Ch 4 → Ch 6 → Ch 12 → Ch 20|||Ch 4 → Ch 6 → Ch 12 → Ch 20', 'Ch 1 → Ch 2 → Ch 3 → Ch 4|||Ch 1 → Ch 2 → Ch 3 → Ch 4', 'Ch 13 → Ch 15 → Ch 16|||Ch 13 → Ch 15 → Ch 16', 'Ch 25 → Ch 26|||Ch 25 → Ch 26'],
            correctIndex: 0,
            points: 1,
            explanation: 'Shot list (Ch 4), set up the gear (Ch 6), edit in CapCut (Ch 12), then the short-form chapter (Ch 20). Afterwards go back to hooks (Ch 3) and sound (Ch 9).|||Phân cảnh (Ch 4), cài đặt máy (Ch 6), dựng bằng CapCut (Ch 12), rồi chương video ngắn (Ch 20). Sau đó quay lại hook (Ch 3) và âm thanh (Ch 9).',
          },
          {
            question: 'Which job suits your Linux machine with the RTX 3060 best?|||Việc nào hợp nhất với máy Linux có RTX 3060 của bạn?',
            options: ['Recording the main talking-head angle|||Quay góc nói chuyện chính', 'Overnight conversion with ffmpeg and generating subtitles with Whisper|||Chuyển mã qua đêm bằng ffmpeg và tạo phụ đề bằng Whisper', 'Drawing storyboards|||Vẽ storyboard', 'Running the teleprompter while filming|||Chạy teleprompter khi quay'],
            correctIndex: 1,
            points: 1,
            explanation: 'The Linux box is best at patient background work: receiving backups, converting footage, running Whisper on the GPU. Filming, storyboards and the teleprompter belong to the iPhone, Pocket 3 and iPad.|||Máy Linux mạnh ở việc chạy nền cần thời gian: nhận bản sao lưu, chuyển mã cảnh quay, chạy Whisper trên GPU. Quay, vẽ storyboard và teleprompter là việc của iPhone, Pocket 3 và iPad.',
          },
          {
            question: 'What does the tenth step, "measure & learn", feed into?|||Bước thứ mười, "đo & học", nuôi bước nào?',
            options: ['Nothing — the video is finished|||Không bước nào — video đã xong', 'The idea for the next video|||Ý tưởng cho video tiếp theo', 'The export settings|||Thông số xuất file', 'The memory card|||Thẻ nhớ'],
            correctIndex: 1,
            points: 1,
            explanation: 'The workflow is a loop: three numbers and one lesson from each video shape the next idea. Running that loop many times is what turns a beginner into a creator.|||Quy trình là một vòng lặp: ba con số và một bài học từ mỗi video định hình ý tưởng tiếp theo. Chạy vòng lặp đó nhiều lần là thứ biến người mới thành creator.',
          },
        ],
      },
    },
  ],
};
