/**
 * Content Creator — Chương 3: Kịch bản & kể chuyện. Song ngữ EN/VI (.ml-en / .ml-vi).
 * Hook 3 giây · cấu trúc câu chuyện · viết cho tai nghe · kịch bản 2 cột · lên hình tự nhiên.
 * ⚠️ KHÔNG backtick trần trong content (dùng &#96;); `${` trong mã mẫu viết \${ ; gạch chéo ngược viết \\
 */
import { gallery, slide } from './_slides.mjs';

const SLIDES = [
  [1, 'Bìa'],
  [2, 'Bản đồ chương'],
  [3, 'Người xem quyết định rất sớm'],
  [4, 'Một hook có ba lớp — cùng lúc'],
  [5, '8 kiểu hook — ví dụ cho kênh của bạn'],
  [6, 'Mở đầu dở và mở đầu tốt'],
  [7, 'Cấu trúc 3 hồi cho video 8 phút'],
  [8, 'Luật "nhưng / vì vậy" thay cho "và rồi"'],
  [9, 'Khung cho từng loại video'],
  [10, 'Viết cho tai, không phải cho mắt'],
  [11, 'Kịch bản 2 cột: HÌNH | LỜI'],
  [12, 'Số chữ ↔ thời lượng'],
  [13, 'Teleprompter trên iPad — phím tắt của /creator'],
  [14, 'Lên hình tự nhiên — 4 thói quen'],
  [15, 'Checklist kịch bản trước khi quay'],
  [16, 'Thực hành chương 3'],
];

export default {
  title: 'Chapter 3 — Scripts & storytelling|||Chương 3 — Kịch bản & kể chuyện',
  description: 'Viết câu mở đầu giữ được người xem trong 3 giây, xếp nội dung thành một câu chuyện có lực kéo, viết kịch bản để NÓI chứ không để đọc, và đứng trước máy mà không trông như đang đọc bài.',
  lessons: [
    /* ─────────────────── 3.0 slide ─────────────────── */
    {
      title: '3.0 — Chapter 3 in 16 slides|||3.0 — Chương 3 trong 16 slide',
      slug: 'cr-03-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Hook, cấu trúc câu chuyện, viết cho tai nghe, kịch bản 2 cột và teleprompter — cả chương trong 16 slide.',
      content: `
<div class="ml-en"><h2>📑 Chapter 3 in 16 slides</h2>
<p>This chapter is about the words: what you say first, in what order, and how you say it on camera. The slides show the shape of each idea — a retention curve, the three layers of a hook, a three-act timeline, a two-column script.</p>
<p>If you only remember two slides, make them <strong>slide 4</strong> (a hook has a picture, a line of text and a spoken sentence — at the same time) and <strong>slide 11</strong> (the two-column script that becomes your shot list in Chapter 4).</p></div>
<div class="ml-vi"><h2>📑 Chương 3 trong 16 slide</h2>
<p>Chương này nói về chữ: bạn nói gì đầu tiên, theo thứ tự nào, và nói thế nào trước máy quay. Các slide cho thấy hình dạng của từng ý — một đường giữ chân người xem, ba lớp của một câu hook, dòng thời gian ba hồi, một kịch bản hai cột.</p>
<p>Nếu chỉ nhớ hai slide, hãy nhớ <strong>slide 4</strong> (một hook có hình, có một dòng chữ và một câu nói — cùng một lúc) và <strong>slide 11</strong> (kịch bản hai cột, thứ sẽ trở thành shot list ở Chương 4).</p></div>
${gallery('cr-03', SLIDES)}
`,
    },

    /* ─────────────────── 3.1 hook ─────────────────── */
    {
      title: '3.1 — The hook: the first 3 seconds and the first 30|||3.1 — Hook: 3 giây đầu và 30 giây đầu',
      slug: 'cr-03-1-hook',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Vì sao phần mở đầu quyết định tất cả, ba lớp của một hook (hình, chữ, lời), 8 kiểu hook có ví dụ cho kênh lập trình và vlog, và cách viết 30 giây đầu.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>The first three seconds decide whether anyone sees the rest</h2>
<p class="lead">You can spend ten hours on a video and lose most of its viewers before the fourth second. Not because the video is bad, but because its opening gave a stranger no reason to stay. This lesson teaches you to build that reason on purpose — with a picture, a line of text and a sentence working together.</p>

<h3>Why the opening carries so much weight</h3>
<p>On TikTok, Reels and Shorts, your video starts playing in a feed where the next video is one swipe away. On YouTube the viewer already clicked, but they are checking whether the video will give them what the title promised — and the back button is just as close. Either way, the first seconds are a test you pass or fail before you have said anything important.</p>
${slide('cr-03', 3, 'Người xem quyết định rất sớm')}
<p>YouTube Studio shows this directly as the <strong>audience retention</strong> graph (tỉ lệ giữ chân khán giả): the percentage of viewers still watching at each moment. Almost every video loses people fastest at the very beginning — that early slope is called the <strong>intro drop</strong>. A good hook does not remove the drop; it makes it shallower. The curve on the slide is an illustration of the typical shape, not measured data; Chapter 23 teaches you to read your own graphs.</p>
<p class="note-ct"><strong>What "hook" means:</strong> the opening moment designed to make a viewer want to see what happens next. In fishing, the hook is what keeps the fish from swimming away. Same job here.</p>

<h3>A hook has three layers, and they fire together</h3>
${slide('cr-03', 4, 'Một hook có ba lớp — cùng lúc')}
<div class="kv-grid">
  <div class="kv"><span class="k">Visual layer</span><span class="v">What the viewer <em>sees</em> in the first frame: the finished result, an unusual shot, movement. Never a logo or a black screen. <small>For a coding video: the working app, or the red error you are about to fix.</small></span></div>
  <div class="kv"><span class="k">Text layer</span><span class="v">One large line on screen stating the promise. Many people scroll with the sound off, so the text has to work alone. <small>Example: "3 Git mistakes that cost me a whole night".</small></span></div>
  <div class="kv"><span class="k">Verbal layer</span><span class="v">Your first sentence. Straight into the problem or the result — no greeting, no name, no "today I will". <small>Introduce yourself after they have decided to stay.</small></span></div>
</div>
<p>When all three say the same thing at the same moment, the viewer understands the video's promise in about two seconds, even if they only catch one of the layers.</p>

<h3>Eight hook types, with examples for your channel</h3>
${slide('cr-03', 5, '8 kiểu hook — ví dụ cho kênh của bạn')}
<table>
  <tr><th>Type</th><th>Example</th><th>Why it works</th></tr>
  <tr><td>Result first</td><td>"This is the site I built in two hours. Now I will build it again from zero."</td><td>Shows the destination, so the journey feels worth it.</td></tr>
  <tr><td>Question that hits a real pain</td><td>"Your code runs on your laptop but breaks on the server?"</td><td>The viewer who has that pain says "yes, that's me".</td></tr>
  <tr><td>Against the crowd</td><td>"Do not learn React before you understand this."</td><td>Contradicts an assumption, so the viewer wants the reason.</td></tr>
  <tr><td>A specific number</td><td>"Three Git mistakes that cost me a whole evening."</td><td>Numbers promise a clear, finite payoff.</td></tr>
  <tr><td>Open loop</td><td>"The third mistake is the one I made for a year."</td><td>Opens a question that only the end of the video closes.</td></tr>
  <tr><td>Stakes</td><td>"24 hours before the project deadline — and the server just went down."</td><td>Something can be lost, so the viewer wants to know if it is.</td></tr>
  <tr><td>In the middle of the action</td><td>Open while you are already fixing the bug, then rewind.</td><td>Drops the viewer into motion instead of a setup.</td></tr>
  <tr><td>Before / after</td><td>"My videos in January, and now."</td><td>Transformation is the oldest story there is.</td></tr>
</table>
<p>Rules that make any of these stronger:</p>
<ul>
  <li><strong>Be specific.</strong> "3 mistakes" beats "some mistakes"; "two hours" beats "quickly".</li>
  <li><strong>Talk to one person.</strong> "You" and "your code", not "everyone" or "people".</li>
  <li><strong>Only promise what the video delivers.</strong> A hook is a promise; the rest of the video is paying it back.</li>
  <li><strong>Write five, keep one.</strong> The first hook you write is rarely the best. Many creators write the hook <em>last</em>, after the video is planned, because by then they know what the real payoff is.</li>
</ul>

<h3>The first 30 seconds: the bridge after the hook</h3>
<p>The hook buys you a few seconds. The next 20–30 seconds decide whether the viewer settles in. In that window, answer three questions quickly:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Why does this matter?</span><span class="lz-d">One sentence of consequence: what it costs to get this wrong.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">What will I get?</span><span class="lz-d">A short map: "three mistakes, each with the fix you can copy".</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Why you?</span><span class="lz-d">One line of credibility: "I made all three while building cuongthai.com." Then start.</span></div>
</div>
<p>An example for a long video about Git, first 30 seconds, spoken:</p>
<div class="out">"Committing straight to main cost me three hours the night before a deadline.
If you are new to Git, these are the three mistakes I wish someone had warned me about —
each one with the exact commands to avoid it.
I made all three while building my own website, so you don't have to.
Mistake number one…"</div>

${slide('cr-03', 6, 'Mở đầu dở và mở đầu tốt')}
<div class="pitfall co-tieu-de"><p><strong>Trap — the polite opening.</strong> "Hello everyone, my name is…, welcome back to my channel, today I am going to…". It feels friendly to you and empty to a stranger. Every word before the promise is a reason to swipe. Say who you are after the viewer has decided to stay — or let the end screen do it.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Trap — a hook the video does not pay back.</strong> Promising "fix it in 5 minutes" and taking 15, or teasing a result you never show. Viewers leave, and they leave unhappy. On YouTube, satisfaction signals such as surveys and "Not interested" feed into recommendations — a misleading hook wins the click and loses the viewer.</p></div>
<div class="callout ok"><p><strong>Tip:</strong> test the hook with the sound off. Watch your first three seconds muted on your phone. If the picture and the on-screen text do not say what the video is about, fix them before you worry about the words.</p></div>

<h3>🎬 Practice (20 minutes)</h3>
<div class="callout ok"><ol>
<li>Pick one video idea from <code>/creator/ideas</code>.</li>
<li>Write <strong>five hooks</strong> for it, each a different type from the table.</li>
<li>Read each one aloud. Film the best three with the iPhone — about 3 seconds each, looking into the lens.</li>
<li>Watch the three clips muted, then with sound. Keep the one that makes <em>you</em> want to see what comes next, and write one sentence on why.</li>
</ol><p><strong>Done when:</strong> five written hooks, three filmed clips of 3 seconds or less, and one chosen hook with a written reason.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Hook</span><span class="v">The opening moment designed to make viewers stay.</span></div>
  <div class="kv"><span class="k">Audience retention</span><span class="v">The share of viewers still watching at each moment of a video.</span></div>
  <div class="kv"><span class="k">Intro drop</span><span class="v">The steep fall in retention during the first seconds.</span></div>
  <div class="kv"><span class="k">Open loop</span><span class="v">A question raised early and answered later, which keeps people watching.</span></div>
  <div class="kv"><span class="k">Payoff</span><span class="v">The moment the video delivers what the hook promised.</span></div>
  <div class="kv"><span class="k">CTA (call to action)</span><span class="v">What you ask the viewer to do next. Lesson 3.3.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>The first seconds are a test: viewers decide before you have said anything important.</li>
  <li>A hook has three layers — picture, on-screen text, first sentence — firing together.</li>
  <li>Eight dependable hook types; be specific, talk to one person, only promise what you deliver.</li>
  <li>The next 30 seconds answer: why it matters, what they get, why you. Then start.</li>
</ul>
<div class="link-card"><a href="https://support.google.com/youtube/answer/9314415?hl=en" target="_blank" rel="noopener">YouTube Help — Measure key moments for audience retention</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Ba giây đầu quyết định có ai xem phần còn lại hay không</h2>
<p class="lead">Bạn có thể bỏ mười giờ cho một video rồi mất phần lớn người xem trước giây thứ tư. Không phải vì video dở, mà vì phần mở đầu không cho người lạ một lý do để ở lại. Bài này dạy bạn dựng lý do đó một cách có chủ đích — bằng một hình ảnh, một dòng chữ và một câu nói cùng làm việc với nhau.</p>

<h3>Vì sao phần mở đầu nặng ký đến vậy</h3>
<p>Trên TikTok, Reels và Shorts, video của bạn bắt đầu phát giữa một luồng mà video kế tiếp chỉ cách một cú vuốt. Trên YouTube người xem đã bấm vào, nhưng họ đang kiểm xem video có đưa đúng thứ tiêu đề hứa không — và nút quay lại cũng gần y như vậy. Dù ở đâu, vài giây đầu là một bài kiểm tra bạn đỗ hay trượt trước khi kịp nói điều gì quan trọng.</p>
${slide('cr-03', 3, 'Người xem quyết định rất sớm')}
<p>YouTube Studio cho thấy điều này rất rõ qua biểu đồ <strong>audience retention</strong> (tỉ lệ giữ chân khán giả): phần trăm người xem còn ở lại tại từng thời điểm. Gần như video nào cũng mất người nhanh nhất ở đoạn mở đầu — đoạn dốc đó gọi là <strong>intro drop</strong> (cú rơi đầu video). Hook tốt không xoá được cú rơi, nó làm cú rơi thoải hơn. Đường cong trên slide là hình MINH HOẠ dạng thường gặp, không phải số đo; Chương 23 dạy bạn đọc biểu đồ thật của chính mình.</p>
<p class="note-ct"><strong>"Hook" nghĩa là gì:</strong> khoảnh khắc mở đầu được thiết kế để người xem muốn biết chuyện gì xảy ra tiếp. Trong câu cá, lưỡi câu (hook) là thứ giữ con cá không bơi đi. Ở đây cũng đúng việc đó.</p>

<h3>Một hook có ba lớp, và chúng nổ cùng lúc</h3>
${slide('cr-03', 4, 'Một hook có ba lớp — cùng lúc')}
<div class="kv-grid">
  <div class="kv"><span class="k">Lớp HÌNH</span><span class="v">Thứ người xem <em>thấy</em> ở khung đầu tiên: kết quả cuối, một cảnh lạ, chuyển động. Không bao giờ là logo hay màn hình đen. <small>Với video code: ứng dụng đã chạy, hoặc dòng lỗi đỏ bạn sắp sửa.</small></span></div>
  <div class="kv"><span class="k">Lớp CHỮ</span><span class="v">Một dòng chữ to trên màn hình nói ra lời hứa. Rất nhiều người lướt khi tắt tiếng, nên dòng chữ phải tự đứng được một mình. <small>Ví dụ: "3 lỗi Git làm mình mất trắng một đêm".</small></span></div>
  <div class="kv"><span class="k">Lớp LỜI</span><span class="v">Câu nói đầu tiên của bạn. Vào thẳng vấn đề hoặc kết quả — không chào, không xưng tên, không "hôm nay mình sẽ". <small>Giới thiệu bản thân SAU khi họ đã quyết định ở lại.</small></span></div>
</div>
<p>Khi cả ba lớp cùng nói một điều ở cùng một lúc, người xem hiểu lời hứa của video trong khoảng hai giây, kể cả khi họ chỉ bắt được một lớp.</p>

<h3>Tám kiểu hook, có ví dụ cho kênh của bạn</h3>
${slide('cr-03', 5, '8 kiểu hook — ví dụ cho kênh của bạn')}
<table>
  <tr><th>Kiểu</th><th>Ví dụ</th><th>Vì sao hiệu quả</th></tr>
  <tr><td>Kết quả trước</td><td>"Đây là trang web mình dựng trong hai giờ. Giờ mình làm lại từ con số 0."</td><td>Cho thấy điểm đến, nên hành trình trở nên đáng xem.</td></tr>
  <tr><td>Câu hỏi chạm đúng nỗi đau</td><td>"Code chạy trên laptop của bạn nhưng lên server là lỗi?"</td><td>Người có nỗi đau đó sẽ thầm nói "đúng, là mình".</td></tr>
  <tr><td>Nói ngược số đông</td><td>"Đừng học React trước khi hiểu cái này."</td><td>Phủ định một điều người ta đang tin, nên họ muốn biết lý do.</td></tr>
  <tr><td>Con số cụ thể</td><td>"Ba lỗi Git làm mình mất cả buổi tối."</td><td>Con số hứa một phần thưởng rõ ràng, có điểm kết thúc.</td></tr>
  <tr><td>Vòng mở</td><td>"Lỗi thứ ba là lỗi mình mắc suốt một năm."</td><td>Mở ra một câu hỏi mà chỉ cuối video mới đóng lại.</td></tr>
  <tr><td>Đặt cược</td><td>"Còn 24 giờ là hạn nộp đồ án — và server vừa sập."</td><td>Có thứ có thể mất, nên người xem muốn biết có mất thật không.</td></tr>
  <tr><td>Giữa hành động</td><td>Mở thẳng vào lúc bạn đang sửa lỗi, rồi mới quay lại kể.</td><td>Thả người xem vào chuyển động thay vì một đoạn dẫn dắt.</td></tr>
  <tr><td>Trước / sau</td><td>"Video của mình hồi tháng 1, và bây giờ."</td><td>Sự thay đổi là câu chuyện lâu đời nhất.</td></tr>
</table>
<p>Vài luật làm kiểu nào cũng mạnh hơn:</p>
<ul>
  <li><strong>Cụ thể.</strong> "3 lỗi" hơn "vài lỗi"; "hai giờ" hơn "nhanh thôi".</li>
  <li><strong>Nói với một người.</strong> "Bạn", "code của bạn" — không phải "mọi người", "các bạn".</li>
  <li><strong>Chỉ hứa điều video trả được.</strong> Hook là lời hứa; phần còn lại của video là trả nợ.</li>
  <li><strong>Viết năm câu, giữ một.</strong> Câu hook đầu tiên hiếm khi là câu hay nhất. Nhiều creator viết hook <em>cuối cùng</em>, sau khi đã lên xong kế hoạch video, vì lúc đó họ mới biết phần thưởng thật sự là gì.</li>
</ul>

<h3>30 giây đầu: cây cầu sau câu hook</h3>
<p>Hook mua cho bạn vài giây. 20–30 giây tiếp theo quyết định người xem có "ngồi xuống" không. Trong khoảng đó, trả lời thật nhanh ba câu hỏi:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Vì sao việc này quan trọng?</span><span class="lz-d">Một câu về hậu quả: làm sai thì mất gì.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Tôi sẽ nhận được gì?</span><span class="lz-d">Một bản đồ ngắn: "ba lỗi, mỗi lỗi kèm cách sửa bạn chép được ngay".</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Sao lại nghe bạn?</span><span class="lz-d">Một câu tạo uy tín: "Mình mắc cả ba khi xây cuongthai.com." Rồi bắt đầu.</span></div>
</div>
<p>Ví dụ 30 giây đầu của một video dài về Git, viết để nói:</p>
<div class="out">"Commit thẳng lên main đã làm mình mất ba tiếng vào đêm trước hạn nộp.
Nếu bạn mới học Git, đây là ba lỗi mình ước có người cảnh báo sớm hơn —
mỗi lỗi kèm đúng lệnh để tránh nó.
Mình đã mắc cả ba khi xây website của chính mình, để bạn không phải mắc nữa.
Lỗi thứ nhất…"</div>

${slide('cr-03', 6, 'Mở đầu dở và mở đầu tốt')}
<div class="pitfall co-tieu-de"><p><strong>Bẫy — màn chào hỏi lịch sự.</strong> "Xin chào các bạn, mình là…, chào mừng quay lại kênh, hôm nay mình sẽ…". Với bạn nó thân thiện, với người lạ nó trống rỗng. Mỗi chữ đứng trước lời hứa là một lý do để lướt đi. Hãy nói bạn là ai sau khi người xem đã quyết định ở lại — hoặc để màn hình kết thúc làm việc đó.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — hook mà video không trả được.</strong> Hứa "sửa trong 5 phút" rồi mất 15 phút, hoặc nhử một kết quả không bao giờ cho xem. Người xem bỏ đi, và bỏ đi trong bực bội. Trên YouTube, các tín hiệu hài lòng như khảo sát hay nút "Không quan tâm" được đưa vào hệ thống đề xuất — một hook lừa thắng được cú bấm nhưng mất người xem.</p></div>
<div class="callout ok"><p><strong>Mẹo:</strong> thử hook khi TẮT TIẾNG. Xem ba giây đầu trên điện thoại ở chế độ im lặng. Nếu hình và dòng chữ trên màn hình chưa nói được video về cái gì, sửa chúng trước rồi hãy lo đến câu chữ.</p></div>

<h3>🎬 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
<li>Chọn một ý tưởng video trong <code>/creator/ideas</code>.</li>
<li>Viết <strong>năm câu hook</strong> cho nó, mỗi câu một kiểu khác nhau trong bảng.</li>
<li>Đọc to từng câu. Quay ba câu hay nhất bằng iPhone — mỗi câu khoảng 3 giây, nhìn thẳng ống kính.</li>
<li>Xem ba clip khi tắt tiếng, rồi bật tiếng. Giữ câu làm chính <em>bạn</em> muốn xem tiếp, và viết một câu giải thích vì sao.</li>
</ol><p><strong>Đạt khi:</strong> có năm câu hook đã viết, ba clip đã quay mỗi clip không quá 3 giây, và một hook được chọn kèm lý do viết ra giấy.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Hook</span><span class="v">Câu/khoảnh khắc mở đầu thiết kế để người xem ở lại.</span></div>
  <div class="kv"><span class="k">Audience retention</span><span class="v">Tỉ lệ giữ chân — phần người xem còn ở lại tại từng thời điểm của video.</span></div>
  <div class="kv"><span class="k">Intro drop</span><span class="v">Cú rơi mạnh của đường giữ chân trong vài giây đầu.</span></div>
  <div class="kv"><span class="k">Open loop</span><span class="v">Vòng mở — câu hỏi được nêu sớm và trả lời sau, giữ người ta xem tiếp.</span></div>
  <div class="kv"><span class="k">Payoff</span><span class="v">Trả thưởng — lúc video đưa ra đúng thứ hook đã hứa.</span></div>
  <div class="kv"><span class="k">CTA (call to action)</span><span class="v">Lời kêu gọi — điều bạn mời người xem làm tiếp. Bài 3.3.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Vài giây đầu là bài kiểm tra: người xem quyết định trước khi bạn kịp nói điều quan trọng.</li>
  <li>Hook có ba lớp — hình, chữ trên màn hình, câu nói đầu — nổ cùng lúc.</li>
  <li>Tám kiểu hook dùng được; hãy cụ thể, nói với một người, chỉ hứa điều video trả được.</li>
  <li>30 giây tiếp theo trả lời: vì sao quan trọng, nhận được gì, vì sao nghe bạn. Rồi vào bài.</li>
</ul>
<div class="link-card"><a href="https://support.google.com/youtube/answer/9314415?hl=en" target="_blank" rel="noopener">YouTube Help — Đo các khoảnh khắc chính của tỉ lệ giữ chân khán giả</a></div>
</div>
`,
    },
    /* ─────────────────── 3.2 cấu trúc câu chuyện ─────────────────── */
    {
      title: '3.2 — Story structure: three acts, "but / therefore", open loops|||3.2 — Cấu trúc câu chuyện: 3 hồi, "nhưng / vì vậy", vòng mở',
      slug: 'cr-03-2-cau-truc-cau-chuyen',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Biến một mớ thông tin thành câu chuyện có lực kéo: ba hồi cho video YouTube, luật "nhưng / vì vậy", vòng mở, cái giá phải trả, và khung sẵn cho từng loại video.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>Information tells, a story pulls — and structure is what turns one into the other</h2>
<p class="lead">You can explain Git branching perfectly and still lose people halfway. The problem is rarely the facts; it is their order. A story has a question at the start, trouble in the middle and an answer at the end, and that shape keeps people watching even when the topic is technical. This lesson gives you that shape and a ready-made frame for each kind of video you will make.</p>

<h3>Three acts, adapted for a YouTube video</h3>
${slide('cr-03', 7, 'Cấu trúc 3 hồi cho video 8 phút')}
<p>The <strong>three-act structure</strong> (cấu trúc ba hồi) comes from theatre and film, and it maps neatly onto an 8-minute video:</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Hook</span><span class="lz-t">0:00–0:15</span><span class="lz-d">The promise, in picture, text and words (Lesson 3.1).</span></div>
<div class="lz-layer"><span class="lz-k">Act 1</span><span class="lz-t">Context · to about 1:30</span><span class="lz-d">What the problem is and why it matters to <em>this</em> viewer. Short. Answers "why should I watch".</span></div>
<div class="lz-layer"><span class="lz-k">Act 2</span><span class="lz-t">Conflict → solution · most of the video</span><span class="lz-d">Trying, getting stuck, finding the way. This is where real difficulty lives — the failed attempt is often the most useful part.</span></div>
<div class="lz-layer"><span class="lz-k">Act 3</span><span class="lz-t">Payoff · the last minute</span><span class="lz-d">The result the hook promised, plus the one lesson to keep.</span></div>
<div class="lz-layer"><span class="lz-k">CTA</span><span class="lz-t">A few seconds</span><span class="lz-d">One next step. Lesson 3.3.</span></div>
</div>
<p>The proportions are a guide, not a law. What matters is that the middle is the biggest part and that the end pays what the beginning promised.</p>

<h3>The "but / therefore" rule</h3>
${slide('cr-03', 8, 'Luật "nhưng / vì vậy" thay cho "và rồi"')}
<p>Trey Parker and Matt Stone, the creators of <em>South Park</em>, described a simple test to a class of NYU students: write your story as a list of beats (<strong>beat</strong> — nhịp, one small event or idea). If the word between two beats is "and then", the story is flat. It should be "<strong>but</strong>" (something goes wrong) or "<strong>therefore</strong>" (because of that, this happens). Each beat then causes the next one, and the viewer feels pulled forward.</p>
<table>
  <tr><th>"And then" — a diary</th><th>"But / therefore" — a story</th></tr>
  <tr><td>I built a login form, and then I tested it, and then I checked the cookie, and then I changed a setting.</td><td>I built a login form, <strong>but</strong> the cookie was never saved, <strong>therefore</strong> I opened the Network tab, <strong>but</strong> it showed a SameSite warning, <strong>therefore</strong> I changed one line of configuration — and it worked.</td></tr>
</table>
<p>Same events, very different pull. Before filming, read your outline and circle every "and then". Most of them can be rewritten; the ones that cannot are usually beats you can cut.</p>

<h3>Open loops and stakes</h3>
<p>An <strong>open loop</strong> is a question you raise early and answer later: "I will show you the fix at the end — first, let's see why it breaks." The brain dislikes unfinished business, so viewers stay to see the loop close. Two rules: close every loop you open, and do not open more than two or three in a video, or it starts to feel like a trick.</p>
<p><strong>Stakes</strong> (cái giá phải trả) answer "what is lost if this goes wrong?" — a deadline, a broken website, a wasted evening. Personal stakes are the easiest to feel: "this is the mistake that almost made me miss my project deadline". Without stakes, even a correct explanation feels like a manual.</p>

<h3>Show, do not tell</h3>
<p>Video is a visual medium. "This command is fast" is telling. Running it, and letting the timer on screen show 0.3 seconds, is showing. When you write a beat, ask what the viewer <em>sees</em> at that moment. If the answer is "my face explaining", look for a demo, a result, a before-and-after or a diagram instead — that is also what makes the shot list in Chapter 4 easy.</p>

<h3>A frame for each kind of video</h3>
${slide('cr-03', 9, 'Khung cho từng loại video')}
<p>You do not need to invent the structure every time. These frames match the templates already built into the <strong>Script</strong> tab of <code>/creator/projects</code>:</p>
<table>
  <tr><th>Video type</th><th>Frame</th></tr>
  <tr><td>Tool tutorial</td><td>Problem → Result → Install → Basic use → Tips → When NOT to use it → Summary</td></tr>
  <tr><td>Lecture</td><td>Objective → Concept → Working example → Common mistakes → Exercise</td></tr>
  <tr><td>Story vlog</td><td>Hook → Context → Four story beats → The lesson → Exactly one call to action</td></tr>
  <tr><td>Short video</td><td>Hook 0–3 s → Problem → ONE solution → One-sentence wrap-up → Call to action</td></tr>
  <tr><td>Review / comparison</td><td>Verdict first → Criteria → Comparison → Who should choose what</td></tr>
</table>
<p>Notice that every frame opens with a problem or a result, and that the tutorial frame includes "when NOT to use it". Admitting limits is one of the fastest ways to earn trust.</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — telling it in the order it happened.</strong> Your real day went: wake up, open laptop, check mail, start coding, hit the bug, fix it. The story starts at the bug. Chronological order is the natural way to remember events and almost never the best way to tell them.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Trap — burying the payoff.</strong> Spending six minutes on setup and thirty seconds on the result the title promised. If the payoff is the reason people clicked, show a glimpse early (in the hook) and give it proper time at the end.</p></div>

<h3>🎬 Practice (25 minutes)</h3>
<div class="callout ok"><ol>
<li>Take the video idea from Lesson 3.1. Write its outline as a list of <strong>at least five beats</strong>.</li>
<li>Join the beats only with "but" or "therefore". Rewrite or delete any beat that needs "and then".</li>
<li>Mark which beats belong to the hook, Act 1, Act 2, Act 3 and the CTA. Check that Act 2 is the largest.</li>
<li>Write the stakes in one sentence, and list any open loop together with the beat that closes it.</li>
</ol><p><strong>Done when:</strong> five or more beats, zero "and then", a one-sentence stakes line, and every open loop has a matching closing beat.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Three-act structure</span><span class="v">Setup → confrontation → resolution; here: context → conflict and solution → payoff.</span></div>
  <div class="kv"><span class="k">Beat</span><span class="v">One small event or idea in the story.</span></div>
  <div class="kv"><span class="k">Stakes</span><span class="v">What is lost if things go wrong; the reason to care.</span></div>
  <div class="kv"><span class="k">Open loop</span><span class="v">A question raised now and answered later.</span></div>
  <div class="kv"><span class="k">Show, don't tell</span><span class="v">Let the picture prove the point instead of describing it.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Hook → context → conflict and solution (the biggest part) → payoff → one CTA.</li>
  <li>Connect beats with "but" and "therefore", never "and then".</li>
  <li>Use a few open loops and always close them; give the viewer stakes to care about.</li>
  <li>Start from a ready frame for each video type — they are already in /creator.</li>
</ul>
<div class="khoi-sach">
  <div class="the-sach khong-link"><span class="sach-ico">📘</span><span class="sach-than">
    <span class="sach-ten">Made to Stick: Why Some Ideas Survive and Others Die</span>
    <span class="sach-phu">Chip Heath, Dan Heath · 2007</span>
    <span class="sach-nhan-nhom"><span class="sach-nhan tham-khao">Reference</span><span class="sach-nhan giay">Print</span></span></span></div>
</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Thông tin thì kể, câu chuyện thì kéo — và cấu trúc là thứ biến cái này thành cái kia</h2>
<p class="lead">Bạn có thể giải thích Git branching hoàn hảo mà vẫn mất người xem ở giữa chừng. Vấn đề hiếm khi nằm ở kiến thức; nó nằm ở thứ tự. Một câu chuyện có câu hỏi ở đầu, rắc rối ở giữa và câu trả lời ở cuối, và chính hình dạng đó giữ người ta xem kể cả khi chủ đề rất kỹ thuật. Bài này cho bạn hình dạng ấy, cùng một khung dựng sẵn cho từng loại video bạn sẽ làm.</p>

<h3>Ba hồi, chỉnh cho vừa một video YouTube</h3>
${slide('cr-03', 7, 'Cấu trúc 3 hồi cho video 8 phút')}
<p><strong>Three-act structure</strong> (cấu trúc ba hồi) đến từ sân khấu và điện ảnh, và nó khớp gọn với một video 8 phút:</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Hook</span><span class="lz-t">0:00–0:15</span><span class="lz-d">Lời hứa, bằng hình, chữ và lời (Bài 3.1).</span></div>
<div class="lz-layer"><span class="lz-k">Hồi 1</span><span class="lz-t">Bối cảnh · tới khoảng 1:30</span><span class="lz-d">Vấn đề là gì và vì sao nó quan trọng với <em>chính người xem này</em>. Ngắn. Trả lời câu "tại sao phải xem".</span></div>
<div class="lz-layer"><span class="lz-k">Hồi 2</span><span class="lz-t">Xung đột → lời giải · phần lớn video</span><span class="lz-d">Thử, vướng, tìm ra cách. Đây là nơi có khó khăn thật — lần thử thất bại thường là phần có ích nhất.</span></div>
<div class="lz-layer"><span class="lz-k">Hồi 3</span><span class="lz-t">Trả thưởng · phút cuối</span><span class="lz-d">Kết quả mà hook đã hứa, cộng một bài học để mang về.</span></div>
<div class="lz-layer"><span class="lz-k">CTA</span><span class="lz-t">Vài giây</span><span class="lz-d">Một bước tiếp theo. Bài 3.3.</span></div>
</div>
<p>Tỉ lệ chỉ để tham khảo, không phải luật. Điều quan trọng là phần giữa lớn nhất, và phần cuối trả đúng thứ phần đầu đã hứa.</p>

<h3>Luật "nhưng / vì vậy"</h3>
${slide('cr-03', 8, 'Luật "nhưng / vì vậy" thay cho "và rồi"')}
<p>Trey Parker và Matt Stone, hai tác giả của <em>South Park</em>, từng chia sẻ với một lớp sinh viên NYU một phép thử đơn giản: viết câu chuyện thành danh sách các nhịp (<strong>beat</strong> — một sự kiện hoặc một ý nhỏ). Nếu chữ nối giữa hai nhịp là "và rồi", câu chuyện bị phẳng. Nó phải là "<strong>nhưng</strong>" (có gì đó trục trặc) hoặc "<strong>vì vậy</strong>" (do điều đó, điều này xảy ra). Khi ấy nhịp trước sinh ra nhịp sau, và người xem thấy mình bị kéo về phía trước.</p>
<table>
  <tr><th>"Và rồi" — nhật ký</th><th>"Nhưng / vì vậy" — câu chuyện</th></tr>
  <tr><td>Mình dựng form đăng nhập, và rồi mình thử, và rồi mình kiểm cookie, và rồi mình đổi một thiết lập.</td><td>Mình dựng form đăng nhập, <strong>nhưng</strong> cookie không bao giờ được lưu, <strong>vì vậy</strong> mình mở tab Network, <strong>nhưng</strong> nó báo cảnh báo SameSite, <strong>vì vậy</strong> mình sửa một dòng cấu hình — và nó chạy.</td></tr>
</table>
<p>Cùng những sự kiện ấy, lực kéo khác hẳn. Trước khi quay, đọc lại dàn ý và khoanh mọi chữ "và rồi". Phần lớn viết lại được; chỗ nào không viết lại được thì thường là nhịp bạn có thể cắt bỏ.</p>

<h3>Vòng mở và cái giá phải trả</h3>
<p><strong>Open loop</strong> (vòng mở) là câu hỏi bạn nêu ra sớm và trả lời sau: "Cuối video mình sẽ cho bạn xem cách sửa — trước hết xem vì sao nó hỏng đã." Não người không thích việc dang dở, nên người xem ở lại để thấy vòng được đóng. Hai luật: vòng nào mở ra thì phải đóng lại, và đừng mở quá hai ba vòng trong một video, kẻo nó bắt đầu giống một mánh.</p>
<p><strong>Stakes</strong> (cái giá phải trả) trả lời câu "nếu hỏng thì mất gì?" — một hạn nộp, một website sập, một buổi tối phí hoài. Cái giá mang tính cá nhân là dễ cảm nhất: "đây là lỗi suýt làm mình trễ hạn nộp đồ án". Không có cái giá, kể cả một lời giải thích đúng cũng nghe như sách hướng dẫn sử dụng.</p>

<h3>Cho xem, đừng kể</h3>
<p>Video là phương tiện của hình ảnh. "Lệnh này chạy nhanh" là kể. Chạy nó, để đồng hồ trên màn hình hiện 0,3 giây, là cho xem. Khi viết một nhịp, hãy hỏi người xem <em>thấy</em> gì ở khoảnh khắc đó. Nếu câu trả lời là "mặt mình đang giải thích", hãy tìm một bản chạy thử, một kết quả, một cảnh trước-sau hoặc một sơ đồ thay vào — đó cũng là thứ làm shot list ở Chương 4 trở nên dễ.</p>

<h3>Khung cho từng loại video</h3>
${slide('cr-03', 9, 'Khung cho từng loại video')}
<p>Bạn không cần tự nghĩ ra cấu trúc mỗi lần. Các khung dưới đây khớp với những mẫu đã có sẵn trong tab <strong>Kịch bản</strong> của <code>/creator/projects</code>:</p>
<table>
  <tr><th>Loại video</th><th>Khung</th></tr>
  <tr><td>Hướng dẫn công cụ</td><td>Vấn đề → Kết quả → Cài đặt → Dùng cơ bản → Mẹo → Khi nào KHÔNG nên dùng → Tóm tắt</td></tr>
  <tr><td>Bài giảng</td><td>Mục tiêu → Khái niệm → Ví dụ chạy được → Lỗi thường gặp → Bài tập</td></tr>
  <tr><td>Vlog kể chuyện</td><td>Hook → Bối cảnh → Bốn nhịp diễn biến → Bài học → Đúng một lời kêu gọi</td></tr>
  <tr><td>Video ngắn</td><td>Hook 0–3 giây → Vấn đề → MỘT lời giải → Chốt một câu → Kêu gọi</td></tr>
  <tr><td>Review / so sánh</td><td>Kết luận trước → Tiêu chí → So sánh → Ai nên chọn gì</td></tr>
</table>
<p>Để ý rằng khung nào cũng mở đầu bằng một vấn đề hoặc một kết quả, và khung hướng dẫn có hẳn mục "khi nào KHÔNG nên dùng". Thừa nhận giới hạn là một trong những cách nhanh nhất để được tin.</p>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — kể theo đúng thứ tự đã xảy ra.</strong> Một ngày thật của bạn là: dậy, mở laptop, đọc mail, bắt đầu code, gặp lỗi, sửa lỗi. Câu chuyện bắt đầu ở chỗ gặp lỗi. Thứ tự thời gian là cách tự nhiên để NHỚ sự kiện, và gần như không bao giờ là cách hay nhất để KỂ chúng.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — chôn mất phần thưởng.</strong> Dành sáu phút dẫn dắt và ba mươi giây cho kết quả mà tiêu đề đã hứa. Nếu phần thưởng là lý do người ta bấm vào, hãy cho thấy một chút ngay từ đầu (trong hook) và dành cho nó đủ thời gian ở cuối.</p></div>

<h3>🎬 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
<li>Lấy ý tưởng video ở Bài 3.1. Viết dàn ý thành danh sách <strong>ít nhất năm nhịp</strong>.</li>
<li>Chỉ nối các nhịp bằng "nhưng" hoặc "vì vậy". Nhịp nào buộc phải dùng "và rồi" thì viết lại hoặc xoá.</li>
<li>Đánh dấu nhịp nào thuộc hook, Hồi 1, Hồi 2, Hồi 3 và CTA. Kiểm tra Hồi 2 là phần lớn nhất.</li>
<li>Viết cái giá phải trả trong một câu, và liệt kê mỗi vòng mở kèm nhịp sẽ đóng nó.</li>
</ol><p><strong>Đạt khi:</strong> có từ năm nhịp trở lên, không còn chữ "và rồi" nào, có một câu nêu cái giá phải trả, và vòng mở nào cũng có nhịp đóng tương ứng.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Three-act structure</span><span class="v">Cấu trúc ba hồi: mở đầu → xung đột → giải quyết; ở đây là bối cảnh → xung đột và lời giải → trả thưởng.</span></div>
  <div class="kv"><span class="k">Beat</span><span class="v">Nhịp — một sự kiện hoặc một ý nhỏ trong câu chuyện.</span></div>
  <div class="kv"><span class="k">Stakes</span><span class="v">Cái giá phải trả — thứ mất đi nếu mọi chuyện hỏng; lý do để quan tâm.</span></div>
  <div class="kv"><span class="k">Open loop</span><span class="v">Vòng mở — câu hỏi nêu bây giờ, trả lời sau.</span></div>
  <div class="kv"><span class="k">Show, don't tell</span><span class="v">Cho xem, đừng kể — để hình ảnh chứng minh thay vì mô tả.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Hook → bối cảnh → xung đột và lời giải (phần lớn nhất) → trả thưởng → một CTA.</li>
  <li>Nối các nhịp bằng "nhưng" và "vì vậy", đừng bao giờ bằng "và rồi".</li>
  <li>Dùng vài vòng mở và luôn đóng lại; cho người xem một cái giá để quan tâm.</li>
  <li>Bắt đầu từ khung sẵn cho từng loại video — chúng đã nằm trong /creator.</li>
</ul>
<div class="khoi-sach">
  <div class="the-sach khong-link"><span class="sach-ico">📘</span><span class="sach-than">
    <span class="sach-ten">Made to Stick: Why Some Ideas Survive and Others Die</span>
    <span class="sach-phu">Chip Heath, Dan Heath · 2007</span>
    <span class="sach-nhan-nhom"><span class="sach-nhan tham-khao">Tham khảo</span><span class="sach-nhan giay">Sách giấy</span></span></span></div>
</div>
</div>
`,
    },

    /* ─────────────────── 3.3 viết kịch bản ─────────────────── */
    {
      title: '3.3 — Writing the script: for the ear, in two columns|||3.3 — Viết kịch bản: viết cho tai nghe, theo hai cột',
      slug: 'cr-03-3-viet-kich-ban',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Kịch bản đầy đủ, dàn ý hay lai — khi nào dùng cái nào; luật viết để nói; kịch bản hai cột HÌNH | LỜI; tính số chữ theo thời lượng; một lời kêu gọi duy nhất; và làm tất cả trong /creator.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.3</span>
<h2>A video script is written to be heard once, at speaking speed — so it is written differently</h2>
<p class="lead">A reader can slow down, reread a sentence or look back at a paragraph. A listener cannot. That one difference changes everything about how a script is written. This lesson shows you how much to script, how to write sentences that sound natural out loud, how to lay the script out in two columns so it turns straight into a shot list, and how long it will actually run.</p>

<h3>Full script, outline or hybrid?</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Full script</span><span class="v">Every word written. Best for short videos, hooks and any explanation that must be precise. <small>Risk: sounding like you are reading.</small></span></div>
  <div class="kv"><span class="k">Outline</span><span class="v">Bullet points only; you talk freely around them. Best for vlogs and relaxed commentary. <small>Risk: rambling and "um".</small></span></div>
  <div class="kv"><span class="k">Hybrid</span><span class="v">Script the hook, the key explanations and the ending word for word; bullet the demo parts. <small>The best default for coding tutorials: precise where it matters, natural while you type.</small></span></div>
</div>

<h3>Rules for writing for the ear</h3>
${slide('cr-03', 10, 'Viết cho tai, không phải cho mắt')}
<ul>
  <li><strong>One idea per sentence.</strong> If a sentence needs a comma and a "which", split it.</li>
  <li><strong>Short sentences.</strong> Aim for sentences you can say in one breath.</li>
  <li><strong>Spoken words.</strong> "I", "you", "let's", contractions. Write the way you would explain it to a classmate sitting next to you.</li>
  <li><strong>Signpost.</strong> Tell the listener where they are: "There are three mistakes. Mistake one…". On paper this feels repetitive; in audio it is a map.</li>
  <li><strong>Repeat the key point.</strong> Say the main idea at the start and again at the end. Listeners cannot scroll back.</li>
  <li><strong>Do not read code aloud symbol by symbol.</strong> Show the code on screen; use your voice to explain what it <em>means</em>.</li>
  <li><strong>Read it aloud before you film.</strong> Wherever your tongue trips, the sentence needs rewriting.</li>
</ul>

<h3>The two-column script: PICTURE | SOUND</h3>
${slide('cr-03', 11, 'Kịch bản 2 cột: HÌNH | LỜI')}
<p>An <strong>A/V script</strong> (kịch bản hai cột — Audio/Video) puts what the viewer <em>sees</em> on the left and what they <em>hear</em> on the right, line by line. It forces you to decide a picture for every sentence — and the left column becomes your shot list in Chapter 4 almost unchanged. Here is a complete 60-second short:</p>
<table>
  <tr><th>Time</th><th>PICTURE</th><th>SOUND (spoken)</th></tr>
  <tr><td>0:00</td><td>Medium close-up, eyes on the lens. Text: <strong>3 GIT MISTAKES</strong></td><td>"These three Git mistakes cost me an entire evening."</td></tr>
  <tr><td>0:03</td><td>Screen: red <code>rejected</code> error in the terminal</td><td>"If you are new to Git, avoid them from today."</td></tr>
  <tr><td>0:08</td><td>Text: <strong>1 · COMMITTING TO MAIN</strong> → screen: <code>git checkout -b</code></td><td>"One: committing straight to main. Do each task on its own branch, then merge."</td></tr>
  <tr><td>0:22</td><td>Text: <strong>2 · NO .GITIGNORE</strong> → screen: <code>node_modules</code> in the commit</td><td>"Two: forgetting .gitignore — and pushing thousands of library files to GitHub."</td></tr>
  <tr><td>0:36</td><td>Text: <strong>3 · MESSAGE "fix"</strong> → screen: <code>git log</code></td><td>"Three: a commit message that just says 'fix'. In three months even you won't know what you fixed."</td></tr>
  <tr><td>0:50</td><td>Medium close-up. Text: <strong>PART 2</strong></td><td>"Save this. In part two: the mistake that actually loses code."</td></tr>
</table>
<p>The spoken words add up to roughly 75 — well under the budget, because a third of this short is screen demo with no talking. That is normal for tutorials: the budget is for your voice, not for the whole runtime.</p>

<h3>How long will it run? Count, then measure</h3>
${slide('cr-03', 12, 'Số chữ ↔ thời lượng')}
<p>The "Short video — one idea" template in <code>/creator</code> uses a budget of about <strong>150 words for 60 seconds</strong>. Treat that as a starting point, then measure your own speed once:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Take a 150-word paragraph</span><span class="lz-d">Any paragraph of your own script.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Read it aloud at recording pace</span><span class="lz-d">The energy you use on camera, not the mumble you use when checking.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Time it</span><span class="lz-d">Words ÷ minutes = your words per minute.</span></div>
</div>
<p>Example: 150 words took 70 seconds → 150 ÷ (70/60) ≈ 129 words per minute. A 60-second short then needs about 129 spoken words, not 150 — cut the difference in the script, not in the edit. Vietnamese and English differ a lot here, so measure each language separately if you record both (Chapter 20).</p>

<h3>One call to action</h3>
<p>A <strong>CTA</strong> (call to action — lời kêu gọi hành động) is the one thing you ask the viewer to do next: subscribe, watch the next video, visit cuongthai.com, answer a question in the comments. Ask for <em>one</em>. Three requests in a row become noise and people follow none of them.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Short video</span><span class="v">At the end, a few words: "Part two tomorrow" or "Save this". Or none — a strong ending can be the CTA.</span></div>
  <div class="kv"><span class="k">Long video</span><span class="v">Never before the value. One light mention after you have helped ("if this saved you time…"), and the real CTA at the end, pointing to one next video or to the link in the description.</span></div>
  <div class="kv"><span class="k">To your website</span><span class="v">Say it once, clearly, with a reason: "the full commands are on cuongthai.com, link in the description".</span></div>
</div>

<h3>Doing it in /creator</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Create the project</span><span class="lz-d"><code>/creator/projects</code> → new project, pick the content type (for example Shorts).</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Script tab → pick a template</span><span class="lz-d">Choose a frame and press <strong>Use this template</strong>. Any existing script is saved as a version first.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Write, then Save version</span><span class="lz-d">Before every big rewrite press <strong>Save version</strong>. Versions never get overwritten, and restoring one first saves the current text.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Teleprompter tab</span><span class="lz-d">Read it on the iPad while you film. Lesson 3.4.</span></div>
</div>

<div class="pitfall co-tieu-de"><p><strong>Trap — writing an essay.</strong> Long, correct, beautifully punctuated sentences that sound stiff out loud. If you would not say it that way to a friend, rewrite it until you would.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Trap — three calls to action.</strong> "Like, subscribe, turn on the bell, check my website and comment below" — people do none of it. Choose the one that matters most for this video.</p></div>

<h3>🎬 Practice (30 minutes)</h3>
<div class="callout ok"><ol>
<li>Write a two-column script for a 60-second short from your idea, with no more than 150 spoken words.</li>
<li>In <code>/creator/projects</code>, create the project, open <strong>Script</strong>, use the template "Short video — one idea", paste your script and press <strong>Save version</strong>.</li>
<li>Measure your speaking speed with a 150-word paragraph and write it down.</li>
<li>Read the whole script aloud with a stopwatch and cut until it fits.</li>
</ol><p><strong>Done when:</strong> the script reads aloud in 55–60 seconds, every SOUND line has a PICTURE next to it, it ends with exactly one call to action, and your words-per-minute number is written in your Creator log.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">A/V script</span><span class="v">Two-column script: picture on the left, sound on the right.</span></div>
  <div class="kv"><span class="k">Outline</span><span class="v">A bullet-point plan you speak around.</span></div>
  <div class="kv"><span class="k">Voice-over (VO)</span><span class="v">Narration heard over pictures, without your face on screen.</span></div>
  <div class="kv"><span class="k">Signposting</span><span class="v">Phrases that tell listeners where they are ("mistake two…").</span></div>
  <div class="kv"><span class="k">Words per minute (wpm)</span><span class="v">Your speaking speed; the basis for estimating runtime.</span></div>
  <div class="kv"><span class="k">CTA</span><span class="v">The single next action you ask for.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Full script for shorts and hooks, outline for vlogs, hybrid for coding tutorials.</li>
  <li>Write for the ear: one idea per sentence, spoken words, signposts, repeat the key point, read aloud.</li>
  <li>Two columns — PICTURE | SOUND — so every sentence has a shot.</li>
  <li>Budget words from your measured speed; end with one CTA; keep versions in /creator.</li>
</ul>
<div class="link-card"><a href="https://www.youtube.com/creators/" target="_blank" rel="noopener">YouTube Creators — official guidance on planning and making videos</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.3</span>
<h2>Kịch bản video được viết để NGHE một lần, ở tốc độ nói — nên phải viết khác đi</h2>
<p class="lead">Người đọc có thể đọc chậm lại, đọc lại một câu, nhìn lại đoạn trước. Người nghe thì không. Chỉ một khác biệt đó đổi hoàn toàn cách viết kịch bản. Bài này chỉ cho bạn viết kịch bản đến mức nào, viết câu sao cho đọc to nghe tự nhiên, trình bày kịch bản thành hai cột để nó biến thẳng thành shot list, và video thật sự dài bao lâu.</p>

<h3>Kịch bản đầy đủ, dàn ý hay kiểu lai?</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Kịch bản đầy đủ</span><span class="v">Viết ra từng chữ. Hợp với video ngắn, câu hook và mọi phần giải thích cần chính xác. <small>Rủi ro: nghe như đang đọc bài.</small></span></div>
  <div class="kv"><span class="k">Dàn ý (outline)</span><span class="v">Chỉ gạch đầu dòng; bạn nói tự do quanh chúng. Hợp với vlog và bình luận thoải mái. <small>Rủi ro: lan man và "ờ", "à".</small></span></div>
  <div class="kv"><span class="k">Kiểu lai</span><span class="v">Viết đủ từng chữ cho hook, các đoạn giải thích quan trọng và phần kết; gạch đầu dòng cho phần làm mẫu. <small>Mặc định tốt nhất cho video dạy code: chính xác ở chỗ cần, tự nhiên lúc đang gõ.</small></span></div>
</div>

<h3>Luật viết cho tai nghe</h3>
${slide('cr-03', 10, 'Viết cho tai, không phải cho mắt')}
<ul>
  <li><strong>Một ý một câu.</strong> Câu nào cần dấu phẩy và chữ "mà", hãy tách đôi.</li>
  <li><strong>Câu ngắn.</strong> Nhắm tới những câu nói được trong một hơi.</li>
  <li><strong>Từ của văn nói.</strong> "Mình", "bạn", "mình cùng thử". Viết như đang giải thích cho bạn cùng lớp ngồi ngay cạnh.</li>
  <li><strong>Cắm biển chỉ đường.</strong> Cho người nghe biết họ đang ở đâu: "Có ba lỗi. Lỗi thứ nhất…". Trên giấy thì thấy lặp; trong âm thanh thì đó là bản đồ.</li>
  <li><strong>Nhắc lại ý chính.</strong> Nói ý chính ở đầu và nói lại ở cuối. Người nghe không cuộn ngược lên được.</li>
  <li><strong>Đừng đọc code thành tiếng từng ký hiệu.</strong> Cho code hiện trên màn hình; dùng giọng để giải thích nó <em>có nghĩa</em> gì.</li>
  <li><strong>Đọc to trước khi quay.</strong> Chỗ nào vấp lưỡi là chỗ câu cần viết lại.</li>
</ul>

<h3>Kịch bản hai cột: HÌNH | LỜI</h3>
${slide('cr-03', 11, 'Kịch bản 2 cột: HÌNH | LỜI')}
<p><strong>A/V script</strong> (kịch bản hai cột — Audio/Video) đặt thứ người xem <em>thấy</em> ở bên trái và thứ họ <em>nghe</em> ở bên phải, từng dòng một. Nó buộc bạn chọn một hình cho mỗi câu — và cột bên trái trở thành shot list ở Chương 4 gần như nguyên vẹn. Đây là một video ngắn 60 giây đầy đủ:</p>
<table>
  <tr><th>Giây</th><th>HÌNH</th><th>LỜI (nói)</th></tr>
  <tr><td>0:00</td><td>Cận trung, mắt nhìn ống kính. Chữ: <strong>3 LỖI GIT</strong></td><td>"Ba lỗi Git này làm mình mất trắng một buổi tối."</td></tr>
  <tr><td>0:03</td><td>Màn hình: lỗi đỏ <code>rejected</code> trong terminal</td><td>"Nếu bạn mới học Git, tránh chúng ngay từ hôm nay."</td></tr>
  <tr><td>0:08</td><td>Chữ: <strong>1 · COMMIT LÊN MAIN</strong> → màn hình: <code>git checkout -b</code></td><td>"Một: commit thẳng lên main. Mỗi việc làm trên một nhánh riêng, xong mới gộp vào."</td></tr>
  <tr><td>0:22</td><td>Chữ: <strong>2 · QUÊN .GITIGNORE</strong> → màn hình: <code>node_modules</code> nằm trong commit</td><td>"Hai: quên file .gitignore — rồi đẩy cả nghìn file thư viện lên GitHub."</td></tr>
  <tr><td>0:36</td><td>Chữ: <strong>3 · MESSAGE "fix"</strong> → màn hình: <code>git log</code></td><td>"Ba: message commit chỉ ghi 'fix'. Ba tháng sau, chính bạn cũng không biết mình đã sửa gì."</td></tr>
  <tr><td>0:50</td><td>Cận trung. Chữ: <strong>PHẦN 2</strong></td><td>"Lưu video này lại. Phần hai: lỗi làm mất code thật sự."</td></tr>
</table>
<p>Phần lời cộng lại chỉ khoảng 85 chữ — thấp hơn hẳn ngân sách, vì một phần ba video ngắn này là màn hình làm mẫu không có lời. Với video hướng dẫn, đó là chuyện bình thường: ngân sách chữ là cho giọng nói của bạn, không phải cho toàn bộ thời lượng.</p>

<h3>Video sẽ dài bao lâu? Đếm, rồi đo</h3>
${slide('cr-03', 12, 'Số chữ ↔ thời lượng')}
<p>Mẫu "Video ngắn — một ý duy nhất" trong <code>/creator</code> dùng ngân sách khoảng <strong>150 từ cho 60 giây</strong>. Coi đó là điểm xuất phát, rồi tự đo tốc độ của mình một lần:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Lấy một đoạn 150 từ</span><span class="lz-d">Một đoạn bất kỳ trong kịch bản của chính bạn.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Đọc to ở nhịp quay thật</span><span class="lz-d">Bằng năng lượng lúc đứng trước máy, không phải kiểu lẩm bẩm khi soát bài.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Bấm giờ</span><span class="lz-d">Số từ ÷ số phút = tốc độ của bạn (từ/phút).</span></div>
</div>
<p>Ví dụ: 150 từ đọc hết 70 giây → 150 ÷ (70/60) ≈ 129 từ/phút. Vậy video ngắn 60 giây cần khoảng 129 từ lời nói chứ không phải 150 — hãy cắt phần chênh ngay trong kịch bản, đừng để tới lúc dựng. Tiếng Việt và tiếng Anh chênh nhau khá nhiều ở chỗ này, nên nếu quay cả hai thì đo riêng từng ngôn ngữ (Chương 20).</p>

<h3>Một lời kêu gọi duy nhất</h3>
<p><strong>CTA</strong> (call to action — lời kêu gọi hành động) là MỘT việc bạn mời người xem làm tiếp: đăng ký, xem video tiếp theo, vào cuongthai.com, trả lời một câu hỏi trong bình luận. Hãy xin <em>một</em> thứ. Ba lời xin liên tiếp thành tiếng ồn, và người ta chẳng làm theo cái nào.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Video ngắn</span><span class="v">Ở cuối, vài chữ: "Phần hai có ngày mai" hay "Lưu lại nhé". Hoặc không cần — một cái kết mạnh tự nó đã là lời kêu gọi.</span></div>
  <div class="kv"><span class="k">Video dài</span><span class="v">Không bao giờ trước khi trao giá trị. Nhắc nhẹ một lần sau khi đã giúp được người xem ("nếu video này tiết kiệm cho bạn chút thời gian…"), và lời kêu gọi chính ở cuối, trỏ tới một video tiếp theo hoặc link trong phần mô tả.</span></div>
  <div class="kv"><span class="k">Về website của bạn</span><span class="v">Nói một lần, rõ ràng, kèm lý do: "toàn bộ lệnh có trên cuongthai.com, link ở phần mô tả".</span></div>
</div>

<h3>Làm tất cả trong /creator</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Tạo dự án</span><span class="lz-d"><code>/creator/projects</code> → dự án mới, chọn loại nội dung (ví dụ Shorts).</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Tab Kịch bản → chọn mẫu</span><span class="lz-d">Chọn một khung rồi bấm <strong>Dùng mẫu này</strong>. Kịch bản đang có sẽ được lưu thành một phiên bản trước.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Viết, rồi Lưu phiên bản</span><span class="lz-d">Trước mỗi lần viết lại lớn, bấm <strong>Lưu phiên bản</strong>. Phiên bản không bao giờ bị ghi đè, và khôi phục một bản cũ sẽ lưu bản hiện tại trước.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Tab Nhắc lời</span><span class="lz-d">Đọc kịch bản trên iPad trong lúc quay. Bài 3.4.</span></div>
</div>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — viết thành bài văn.</strong> Những câu dài, đúng, chấm phẩy đẹp đẽ mà đọc to lên thì cứng đơ. Nếu bạn sẽ không nói với bạn bè như thế, hãy viết lại tới khi nói được như thế.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — ba lời kêu gọi.</strong> "Like, đăng ký, bấm chuông, vào website và bình luận bên dưới nhé" — người ta chẳng làm gì cả. Chọn đúng một điều quan trọng nhất với video này.</p></div>

<h3>🎬 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Viết kịch bản hai cột cho một video ngắn 60 giây từ ý tưởng của bạn, lời nói không quá 150 từ.</li>
<li>Trong <code>/creator/projects</code>, tạo dự án, mở tab <strong>Kịch bản</strong>, dùng mẫu "Video ngắn — một ý duy nhất", dán kịch bản vào và bấm <strong>Lưu phiên bản</strong>.</li>
<li>Đo tốc độ nói bằng một đoạn 150 từ và ghi lại.</li>
<li>Đọc to cả kịch bản với đồng hồ bấm giờ, cắt bớt cho tới khi vừa.</li>
</ol><p><strong>Đạt khi:</strong> kịch bản đọc to hết 55–60 giây, dòng LỜI nào cũng có HÌNH đi kèm, kết thúc bằng đúng một lời kêu gọi, và con số từ/phút của bạn đã được ghi vào Nhật ký creator.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">A/V script</span><span class="v">Kịch bản hai cột: hình bên trái, âm thanh bên phải.</span></div>
  <div class="kv"><span class="k">Outline</span><span class="v">Dàn ý gạch đầu dòng để nói quanh.</span></div>
  <div class="kv"><span class="k">Voice-over (VO)</span><span class="v">Lời dẫn — giọng nói chạy trên hình, không thấy mặt người nói.</span></div>
  <div class="kv"><span class="k">Signposting</span><span class="v">Cắm biển chỉ đường — cụm từ cho người nghe biết họ đang ở đâu ("lỗi thứ hai…").</span></div>
  <div class="kv"><span class="k">Words per minute (wpm)</span><span class="v">Tốc độ nói (từ/phút) — cơ sở để ước lượng thời lượng.</span></div>
  <div class="kv"><span class="k">CTA</span><span class="v">Lời kêu gọi — một hành động tiếp theo bạn mời người xem làm.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Kịch bản đầy đủ cho video ngắn và hook, dàn ý cho vlog, kiểu lai cho video dạy code.</li>
  <li>Viết cho tai: một ý một câu, từ văn nói, cắm biển chỉ đường, nhắc lại ý chính, đọc to.</li>
  <li>Hai cột — HÌNH | LỜI — để câu nào cũng có một cảnh quay.</li>
  <li>Tính số chữ theo tốc độ đã đo; kết thúc bằng một CTA; giữ các phiên bản trong /creator.</li>
</ul>
<div class="link-card"><a href="https://www.youtube.com/creators/" target="_blank" rel="noopener">YouTube Creators — hướng dẫn chính thức về lên kế hoạch và làm video</a></div>
</div>
`,
    },

    /* ─────────────────── 3.4 lên hình tự nhiên ─────────────────── */
    {
      title: '3.4 — Looking natural on camera: teleprompter, eye line, energy|||3.4 — Lên hình tự nhiên: teleprompter, ánh mắt, năng lượng',
      slug: 'cr-03-4-len-hinh-tu-nhien',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Dựng teleprompter bằng iPad và tab Nhắc lời của /creator, giữ ánh mắt vào ống kính, nói với năng lượng hợp máy quay, và xử lý câu nói vấp để lúc dựng cắt gọn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.4</span>
<h2>Looking natural on camera is a skill you practise, not a personality you are born with</h2>
<p class="lead">Almost everyone looks stiff the first time: eyes sliding across a script, a flat voice, rushing to get it over with. None of that is fixed. This lesson sets up a teleprompter with your iPad and the Teleprompter tab of <code>/creator</code>, shows where to look, how much energy the camera needs, and how to handle mistakes so that the edit is quick.</p>

<h3>Why people look stiff on camera</h3>
<ul>
  <li><strong>Reading eyes.</strong> Eyes moving left to right across a long line of text are easy to spot, even when the words are perfect.</li>
  <li><strong>A flat voice.</strong> The camera and a small speaker take energy away. A normal conversational tone often plays back as bored.</li>
  <li><strong>Fear of mistakes.</strong> Trying to get eight minutes perfect in one go makes people rush, and rushing sounds nervous.</li>
</ul>
<p>Each problem has a mechanical fix. You do not need to become more confident first; the fixes make you look confident.</p>

<h3>A teleprompter with your iPad and /creator</h3>
${slide('cr-03', 13, 'Teleprompter trên iPad — phím tắt của /creator')}
<p>A <strong>teleprompter</strong> (máy nhắc lời) scrolls your script near the lens so you can read without looking away. You already own one: open <code>cuongthai.com/creator</code> on the iPad, open the project and switch to the <strong>Teleprompter</strong> tab. It reads from the Script tab by default. With a keyboard (or the on-screen buttons):</p>
<table>
  <tr><th>Key</th><th>What it does</th></tr>
  <tr><td><code>Space</code></td><td>Start / pause scrolling</td></tr>
  <tr><td><code>R</code></td><td>Back to the start of the script</td></tr>
  <tr><td><code>F</code></td><td>Full screen</td></tr>
  <tr><td><code>↑</code> / <code>↓</code></td><td>Speed up / slow down by 0.25× (from 0.25× to 4×)</td></tr>
  <tr><td>Font slider</td><td>Text size (default 48 px)</td></tr>
  <tr><td>Mirror</td><td>Flips the text for glass "beam-splitter" prompters</td></tr>
</table>
<p>How to place it:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">iPad directly below the lens</span><span class="lz-d">iPhone on the tripod, iPad just underneath. Your eyes read a few centimetres from the lens, so viewers feel you are looking at them.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Big text, narrow column</span><span class="lz-d">Fewer words per line means your eyes barely move sideways.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Step back a little</span><span class="lz-d">The farther you stand, the smaller any eye movement looks on camera. Frame with the telephoto or zoom to compensate.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Start slow</span><span class="lz-d">Set the speed so you are slightly <em>ahead</em> of the text, never chasing it. Adjust with ↑/↓ during a rehearsal, not during the real take.</span></div>
</div>
<p class="note-ct"><strong>Beam-splitter prompter:</strong> a hood with angled glass that sits in front of the lens and reflects a screen placed below it. You then read <em>through</em> the lens itself — perfect eye contact. The text appears reversed in the glass, which is what the Mirror button is for. Not required to start; the iPad-below-the-lens setup is good enough for most talking-head videos.</p>

<h3>No teleprompter? Bullet cards and short sections</h3>
<p>For vlogs and relaxed videos, reading can feel wrong. Instead: memorise the hook and the ending word for word, keep three or four bullet points for the middle on a card beside the camera, and record one section at a time. Glance at the card <em>between</em> sections, never during a sentence.</p>

<h3>Where to look</h3>
<p>Look into the <strong>lens</strong>, not at the screen. The lens is the viewer's eye; the screen shows your own face, and looking at it makes you appear to look slightly down or to the side. Two tricks: put a small sticker or arrow right next to the lens, and imagine one specific friend sitting behind it — you are explaining to that one person, not to "an audience". On the Pocket 3, the rotating screen makes it tempting to watch yourself; check the framing once, then look at the lens.</p>

<h3>Energy and voice</h3>
${slide('cr-03', 14, 'Lên hình tự nhiên — 4 thói quen')}
<div class="kv-grid">
  <div class="kv"><span class="k">A little more than normal</span><span class="v">Speak a bit louder and brighter than in conversation. What feels "too much" in the room usually plays back as normal.</span></div>
  <div class="kv"><span class="k">Slower, with pauses</span><span class="v">Pause between ideas. Pauses sound confident and give the editor clean places to cut.</span></div>
  <div class="kv"><span class="k">Move a little</span><span class="v">Natural hand gestures inside the frame, a real smile at the start. Standing up often adds energy compared with slumping in a chair.</span></div>
  <div class="kv"><span class="k">Warm up</span><span class="v">Read the script aloud once before recording. The first take is almost always the flattest.</span></div>
</div>

<h3>Mistakes: pause, then say the whole sentence again</h3>
<p>You will stumble. The professional habit: stop, stay silent for about <strong>two seconds</strong>, then say the <em>entire sentence</em> again from its start. Do not stop the recording and do not patch the sentence from the middle. In the edit you then see a clear gap in the waveform and cut once — the new sentence joins cleanly. Record section by section (one paragraph of the script per take) and film the hook <em>last</em>, when you are warmed up.</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — the teleprompter running your speed.</strong> If the text scrolls faster than you naturally speak, you start chasing it and your voice turns into a reading voice. The prompter follows you, not the other way round: slow it down until you are comfortably ahead.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Trap — one eight-minute take.</strong> One mistake at minute seven and you start again, more nervous each time. Short sections reset the pressure every minute and make each take easy to judge.</p></div>

<h3>🎬 Practice (30 minutes)</h3>
<div class="callout ok"><ol>
<li>Mount the iPhone on the tripod and put the iPad directly beneath the lens. Open your 60-second script from Lesson 3.3 in the <strong>Teleprompter</strong> tab, full screen with <code>F</code>.</li>
<li>Rehearse once aloud and adjust the speed with ↑/↓ until you are slightly ahead of the text.</li>
<li>Record three takes. Handle every stumble with a two-second pause and a full restart of the sentence.</li>
<li>Watch take 1 and take 3 back to back. Note where your eyes go and how your energy changes.</li>
</ol><p><strong>Done when:</strong> in take 3 you are looking at the lens for almost the whole clip, every stumble has a clean two-second gap before the repeat, and you can name one thing that improved between take 1 and take 3.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Teleprompter</span><span class="v">A screen that scrolls the script near the lens.</span></div>
  <div class="kv"><span class="k">Beam splitter</span><span class="v">Angled glass in front of the lens that reflects the script, so you read through the lens.</span></div>
  <div class="kv"><span class="k">Eye line</span><span class="v">Where your eyes point relative to the lens.</span></div>
  <div class="kv"><span class="k">Take</span><span class="v">One recording attempt of a shot or section.</span></div>
  <div class="kv"><span class="k">Pickup</span><span class="v">Re-recording just a line or section instead of the whole video.</span></div>
  <div class="kv"><span class="k">Delivery</span><span class="v">How you say the words: pace, energy, pauses, expression.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>The iPad under the lens + the Teleprompter tab of /creator (Space, R, F, ↑/↓) is a real teleprompter.</li>
  <li>Big text, narrow column, stand back a little, speed set so you lead the text.</li>
  <li>Look into the lens; talk to one person; a little more energy and more pauses than feels normal.</li>
  <li>Stumble → two seconds of silence → whole sentence again. Record in sections, hook last.</li>
</ul>
<div class="khoi-sach">
  <div class="the-sach khong-link"><span class="sach-ico">📘</span><span class="sach-than">
    <span class="sach-ten">Talk Like TED: The 9 Public-Speaking Secrets of the World's Top Minds</span>
    <span class="sach-phu">Carmine Gallo · 2014</span>
    <span class="sach-nhan-nhom"><span class="sach-nhan tham-khao">Reference</span><span class="sach-nhan giay">Print</span></span></span></div>
</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.4</span>
<h2>Lên hình tự nhiên là một kỹ năng luyện được, không phải tính cách bẩm sinh</h2>
<p class="lead">Gần như ai lần đầu cũng cứng đơ: mắt trượt ngang qua kịch bản, giọng đều đều, nói vội cho xong. Không cái nào là cố định cả. Bài này dựng một teleprompter bằng iPad và tab Nhắc lời của <code>/creator</code>, chỉ bạn nhìn vào đâu, máy quay cần bao nhiêu năng lượng, và xử lý câu nói vấp thế nào để lúc dựng thật nhanh.</p>

<h3>Vì sao người ta trông cứng trước máy quay</h3>
<ul>
  <li><strong>Mắt đang đọc.</strong> Đôi mắt chạy từ trái sang phải trên một dòng chữ dài rất dễ bị nhận ra, kể cả khi câu chữ hoàn hảo.</li>
  <li><strong>Giọng phẳng.</strong> Máy quay và cái loa nhỏ lấy bớt năng lượng. Giọng nói chuyện bình thường khi phát lại thường nghe như đang chán.</li>
  <li><strong>Sợ sai.</strong> Cố quay tám phút hoàn hảo trong một lần làm người ta nói vội, và nói vội nghe như đang run.</li>
</ul>
<p>Vấn đề nào cũng có cách sửa mang tính kỹ thuật. Bạn không cần tự tin hơn trước; chính các cách sửa làm bạn trông tự tin.</p>

<h3>Teleprompter bằng iPad và /creator</h3>
${slide('cr-03', 13, 'Teleprompter trên iPad — phím tắt của /creator')}
<p><strong>Teleprompter</strong> (máy nhắc lời) cuộn kịch bản ở gần ống kính để bạn đọc mà không phải nhìn đi chỗ khác. Bạn đã có sẵn một cái: mở <code>cuongthai.com/creator</code> trên iPad, mở dự án và chuyển sang tab <strong>Nhắc lời</strong>. Mặc định nó đọc từ tab Kịch bản. Với bàn phím (hoặc các nút trên màn hình):</p>
<table>
  <tr><th>Phím</th><th>Tác dụng</th></tr>
  <tr><td><code>Space</code></td><td>Chạy / dừng cuộn chữ</td></tr>
  <tr><td><code>R</code></td><td>Về đầu kịch bản</td></tr>
  <tr><td><code>F</code></td><td>Toàn màn hình</td></tr>
  <tr><td><code>↑</code> / <code>↓</code></td><td>Tăng / giảm tốc độ 0,25× (từ 0,25× tới 4×)</td></tr>
  <tr><td>Thanh cỡ chữ</td><td>Cỡ chữ (mặc định 48 px)</td></tr>
  <tr><td>Lật gương</td><td>Lật ngược chữ cho loại prompter có tấm kính phản chiếu</td></tr>
</table>
<p>Cách đặt:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">iPad ngay dưới ống kính</span><span class="lz-d">iPhone trên chân máy, iPad đặt sát bên dưới. Mắt bạn đọc cách ống kính vài centimet, nên người xem cảm thấy bạn đang nhìn họ.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Chữ to, cột hẹp</span><span class="lz-d">Mỗi dòng ít chữ hơn thì mắt gần như không phải đảo ngang.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Lùi ra xa một chút</span><span class="lz-d">Đứng càng xa, cử động mắt trông càng nhỏ trên hình. Dùng ống tele hoặc zoom để bù khung hình.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Bắt đầu chậm</span><span class="lz-d">Đặt tốc độ sao cho bạn luôn <em>đi trước</em> dòng chữ một chút, không bao giờ phải đuổi theo nó. Chỉnh bằng ↑/↓ lúc tập thử, đừng chỉnh lúc đang quay thật.</span></div>
</div>
<p class="note-ct"><strong>Prompter có kính (beam splitter):</strong> một chiếc mũ che có tấm kính đặt nghiêng trước ống kính, phản chiếu màn hình đặt bên dưới. Khi đó bạn đọc <em>xuyên qua</em> chính ống kính — ánh mắt chuẩn tuyệt đối. Chữ hiện ngược trong kính, đó là việc của nút Lật gương. Không bắt buộc để bắt đầu; cách đặt iPad dưới ống kính là đủ cho phần lớn video nói chuyện.</p>

<h3>Không có teleprompter? Thẻ gạch đầu dòng và quay theo đoạn</h3>
<p>Với vlog hay video thoải mái, đọc từng chữ có thể thấy sai sai. Thay vào đó: thuộc nguyên văn câu hook và phần kết, giữ ba bốn gạch đầu dòng cho phần giữa trên một tấm thẻ cạnh máy, và quay từng đoạn một. Liếc thẻ <em>giữa</em> các đoạn, không bao giờ liếc giữa một câu.</p>

<h3>Nhìn vào đâu</h3>
<p>Nhìn vào <strong>ống kính</strong>, không nhìn màn hình. Ống kính là mắt người xem; màn hình chỉ hiện mặt bạn, và nhìn vào nó làm bạn trông như đang nhìn hơi xuống hoặc lệch sang bên. Hai mẹo: dán một nhãn nhỏ hoặc mũi tên ngay cạnh ống kính, và tưởng tượng một người bạn cụ thể đang ngồi sau nó — bạn đang giải thích cho đúng một người đó, không phải cho "khán giả". Với Pocket 3, màn hình xoay rất dễ khiến bạn ngắm mình; kiểm khung hình một lần, rồi nhìn vào ống kính.</p>

<h3>Năng lượng và giọng nói</h3>
${slide('cr-03', 14, 'Lên hình tự nhiên — 4 thói quen')}
<div class="kv-grid">
  <div class="kv"><span class="k">Hơn bình thường một chút</span><span class="v">Nói to và tươi hơn lúc nói chuyện một chút. Thứ trong phòng thấy "hơi quá" thì lúc phát lại thường nghe vừa.</span></div>
  <div class="kv"><span class="k">Chậm hơn, có nghỉ</span><span class="v">Ngừng giữa các ý. Những khoảng ngừng nghe tự tin, và cho người dựng những chỗ cắt sạch.</span></div>
  <div class="kv"><span class="k">Cử động một chút</span><span class="v">Cử chỉ tay tự nhiên trong khung hình, một nụ cười thật ở đầu video. Đứng thường có năng lượng hơn so với ngồi sụp trên ghế.</span></div>
  <div class="kv"><span class="k">Khởi động</span><span class="v">Đọc to kịch bản một lượt trước khi quay. Take đầu tiên gần như luôn là take phẳng nhất.</span></div>
</div>

<h3>Nói vấp: dừng lại, rồi nói lại cả câu</h3>
<p>Bạn sẽ vấp. Thói quen của người làm nghề: dừng, im lặng khoảng <strong>hai giây</strong>, rồi nói lại <em>cả câu</em> từ đầu câu. Đừng tắt máy, và đừng vá câu từ giữa chừng. Lúc dựng, bạn sẽ thấy một khoảng trống rõ trên sóng âm và cắt đúng một lần — câu mới nối vào gọn gàng. Quay theo từng đoạn (mỗi take một đoạn kịch bản), và quay câu hook <em>cuối cùng</em>, khi bạn đã "nóng máy".</p>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — để teleprompter quyết định tốc độ của bạn.</strong> Chữ cuộn nhanh hơn tốc độ nói tự nhiên là bạn bắt đầu đuổi theo nó, và giọng biến thành giọng đọc bài. Máy nhắc chữ đi theo bạn, không phải ngược lại: giảm tốc cho tới khi bạn thoải mái đi trước.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — một take dài tám phút.</strong> Vấp ở phút thứ bảy là quay lại từ đầu, mỗi lần một run hơn. Quay theo đoạn ngắn thì áp lực được làm mới mỗi phút, và take nào cũng dễ đánh giá.</p></div>

<h3>🎬 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Gắn iPhone lên chân máy và đặt iPad ngay dưới ống kính. Mở kịch bản 60 giây ở Bài 3.3 trong tab <strong>Nhắc lời</strong>, bấm <code>F</code> để toàn màn hình.</li>
<li>Tập đọc to một lượt và chỉnh tốc độ bằng ↑/↓ tới khi bạn đi trước dòng chữ một chút.</li>
<li>Quay ba take. Mỗi lần vấp, xử lý bằng hai giây im lặng rồi nói lại cả câu.</li>
<li>Xem take 1 và take 3 nối tiếp nhau. Ghi lại mắt bạn nhìn đi đâu và năng lượng thay đổi thế nào.</li>
</ol><p><strong>Đạt khi:</strong> ở take 3 bạn nhìn vào ống kính gần như suốt clip, mỗi chỗ vấp có một khoảng trống hai giây sạch sẽ trước câu nói lại, và bạn gọi tên được một điều đã tiến bộ giữa take 1 và take 3.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Teleprompter</span><span class="v">Máy nhắc lời — màn hình cuộn kịch bản ở gần ống kính.</span></div>
  <div class="kv"><span class="k">Beam splitter</span><span class="v">Tấm kính nghiêng trước ống kính phản chiếu kịch bản, để bạn đọc xuyên qua ống kính.</span></div>
  <div class="kv"><span class="k">Eye line</span><span class="v">Hướng mắt — mắt bạn nhìn về đâu so với ống kính.</span></div>
  <div class="kv"><span class="k">Take</span><span class="v">Một lần quay một cảnh hoặc một đoạn.</span></div>
  <div class="kv"><span class="k">Pickup</span><span class="v">Quay bù — quay lại riêng một câu hoặc một đoạn thay vì cả video.</span></div>
  <div class="kv"><span class="k">Delivery</span><span class="v">Cách nói — nhịp, năng lượng, khoảng ngừng, biểu cảm.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>iPad dưới ống kính + tab Nhắc lời của /creator (Space, R, F, ↑/↓) là một teleprompter thật sự.</li>
  <li>Chữ to, cột hẹp, lùi ra xa một chút, tốc độ đặt sao cho bạn đi trước dòng chữ.</li>
  <li>Nhìn vào ống kính; nói với một người; năng lượng và khoảng ngừng nhiều hơn cảm giác bình thường một chút.</li>
  <li>Vấp → hai giây im lặng → nói lại cả câu. Quay theo đoạn, quay hook cuối cùng.</li>
</ul>
<div class="khoi-sach">
  <div class="the-sach khong-link"><span class="sach-ico">📘</span><span class="sach-than">
    <span class="sach-ten">Talk Like TED: The 9 Public-Speaking Secrets of the World's Top Minds</span>
    <span class="sach-phu">Carmine Gallo · 2014</span>
    <span class="sach-nhan-nhom"><span class="sach-nhan tham-khao">Tham khảo</span><span class="sach-nhan giay">Sách giấy</span></span></span></div>
</div>
</div>
`,
    },

    /* ─────────────────── 3.5 kiểm tra ─────────────────── */
    {
      title: '3.5 — Chapter 3 check|||3.5 — Kiểm tra chương 3',
      slug: 'cr-03-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu tình huống về hook, cấu trúc câu chuyện, viết kịch bản và lên hình.',
      content: `
<div class="ml-en">
<h2>📝 Chapter 3 — summary and self-check</h2>
<ul>
  <li><strong>Hook:</strong> picture + on-screen text + first sentence, together, in the first 3 seconds. Then 30 seconds answering why it matters, what they get, why you.</li>
  <li><strong>Structure:</strong> hook → context → conflict and solution (the biggest part) → payoff → one CTA. Beats joined by "but" and "therefore".</li>
  <li><strong>Script:</strong> written for the ear, in two columns (PICTURE | SOUND); word budget from your measured words per minute.</li>
  <li><strong>On camera:</strong> iPad teleprompter under the lens, eyes on the lens, a little more energy, stumbles handled with a pause and a full restart.</li>
</ul>
<p><strong>Before the quiz:</strong> do you have a 60-second two-column script saved as a version in /creator, and a take where you look into the lens?</p>
</div>
<div class="ml-vi">
<h2>📝 Chương 3 — tóm tắt và tự kiểm</h2>
<ul>
  <li><strong>Hook:</strong> hình + chữ trên màn hình + câu nói đầu, cùng lúc, trong 3 giây đầu. Rồi 30 giây trả lời vì sao quan trọng, nhận được gì, vì sao nghe bạn.</li>
  <li><strong>Cấu trúc:</strong> hook → bối cảnh → xung đột và lời giải (phần lớn nhất) → trả thưởng → một CTA. Các nhịp nối bằng "nhưng" và "vì vậy".</li>
  <li><strong>Kịch bản:</strong> viết cho tai nghe, theo hai cột (HÌNH | LỜI); ngân sách chữ tính từ tốc độ nói bạn đã đo.</li>
  <li><strong>Trước máy:</strong> teleprompter iPad dưới ống kính, mắt nhìn ống kính, năng lượng hơn một chút, vấp thì ngừng rồi nói lại cả câu.</li>
</ul>
<p><strong>Trước khi làm bài:</strong> bạn đã có kịch bản hai cột 60 giây được lưu phiên bản trong /creator, và một take nhìn thẳng vào ống kính chưa?</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'You are opening a coding tutorial about fixing a login bug. Which first three seconds are strongest?|||Bạn mở đầu một video hướng dẫn sửa lỗi đăng nhập. Ba giây đầu nào mạnh nhất?',
            options: ['"Hi everyone, welcome back to my channel!"|||"Xin chào mọi người, chào mừng quay lại kênh!"', 'A 5-second animated logo with music|||Logo động 5 giây kèm nhạc', 'The red error on screen, the text "Login broken? 1-line fix", and "Your login works locally but fails online?"|||Lỗi đỏ trên màn hình, chữ "Đăng nhập hỏng? Sửa 1 dòng", và câu "Đăng nhập chạy ở máy bạn mà lên mạng thì hỏng?"', '"Before we start, please subscribe"|||"Trước khi vào bài, nhớ đăng ký kênh nhé"'],
            correctIndex: 2,
            points: 1,
            explanation: 'It fires all three layers at once — picture (the real error), text (the promise) and a first sentence that names the viewer’s pain. Greetings, logos and subscribe requests spend the first seconds on things a stranger does not care about.|||Nó kích hoạt cả ba lớp cùng lúc — hình (lỗi thật), chữ (lời hứa) và câu đầu gọi đúng nỗi đau của người xem. Lời chào, logo và lời xin đăng ký tiêu mất những giây đầu vào thứ người lạ không quan tâm.',
          },
          {
            question: 'Why should you watch your first three seconds with the sound OFF?|||Vì sao nên xem ba giây đầu của mình khi TẮT tiếng?',
            options: ['Many viewers scroll muted, so picture and on-screen text must explain the video alone|||Nhiều người lướt khi tắt tiếng, nên hình và chữ trên màn hình phải tự giải thích được video', 'To check the music volume|||Để kiểm âm lượng nhạc', 'Because platforms mute every video by default forever|||Vì nền tảng tắt tiếng mọi video mãi mãi', 'To count the words in the script|||Để đếm số chữ trong kịch bản'],
            correctIndex: 0,
            points: 1,
            explanation: 'The muted test checks the visual and text layers of the hook. If they do not communicate the promise without sound, a large part of the audience never gets it.|||Phép thử tắt tiếng kiểm lớp hình và lớp chữ của hook. Nếu không có tiếng mà chúng không truyền được lời hứa, một phần lớn khán giả sẽ không bao giờ hiểu.',
          },
          {
            question: 'Your title and hook promise "fixed in 5 minutes", but the fix appears at minute 15. What is the most likely result?|||Tiêu đề và hook hứa "sửa xong trong 5 phút", nhưng cách sửa xuất hiện ở phút 15. Kết quả có khả năng nhất?',
            options: ['More watch time, so better results|||Thời lượng xem tăng nên kết quả tốt hơn', 'Viewers leave frustrated, and satisfaction signals such as "Not interested" can count against the video|||Người xem bỏ đi trong bực bội, và các tín hiệu hài lòng như "Không quan tâm" có thể bất lợi cho video', 'Nothing — viewers never notice timing|||Không sao — người xem không để ý thời gian', 'The video is automatically shortened|||Video tự động được cắt ngắn'],
            correctIndex: 1,
            points: 1,
            explanation: 'A hook is a promise. Breaking it wins the click and loses the viewer; YouTube has said it uses satisfaction signals, not only watch time, when recommending videos.|||Hook là một lời hứa. Phá lời hứa thì thắng cú bấm nhưng mất người xem; YouTube cho biết họ dùng cả các tín hiệu hài lòng chứ không chỉ thời lượng xem khi đề xuất video.',
          },
          {
            question: 'Your outline reads "I set up the project, and then I wrote the API, and then I tested it, and then it worked." What is the best fix?|||Dàn ý của bạn: "Mình dựng project, và rồi viết API, và rồi chạy thử, và rồi nó chạy." Cách sửa tốt nhất?',
            options: ['Add more "and then" beats for detail|||Thêm nhiều nhịp "và rồi" cho chi tiết', 'Read it faster so it sounds exciting|||Đọc nhanh hơn cho nghe hấp dẫn', 'Add background music|||Thêm nhạc nền', 'Rebuild it with "but / therefore": what went wrong, and what you did because of it|||Viết lại bằng "nhưng / vì vậy": điều gì trục trặc, và vì thế bạn đã làm gì'],
            correctIndex: 3,
            points: 1,
            explanation: '"And then" makes a diary. "But" adds conflict and "therefore" adds consequence, so each beat causes the next and pulls the viewer forward.|||"Và rồi" tạo ra một cuốn nhật ký. "Nhưng" thêm xung đột và "vì vậy" thêm hệ quả, nên nhịp trước sinh ra nhịp sau và kéo người xem đi tiếp.',
          },
          {
            question: 'In a three-act structure for an 8-minute video, which part should take the most time?|||Trong cấu trúc ba hồi cho video 8 phút, phần nào nên chiếm nhiều thời gian nhất?',
            options: ['Act 2 — the conflict and the path to the solution|||Hồi 2 — xung đột và con đường tới lời giải', 'The hook|||Hook', 'The call to action|||Lời kêu gọi', 'The self-introduction|||Phần giới thiệu bản thân'],
            correctIndex: 0,
            points: 1,
            explanation: 'Act 2 is where the real difficulty and the learning live. The hook is seconds, Act 1 is short, and the payoff and CTA close the video.|||Hồi 2 là nơi có khó khăn thật và bài học thật. Hook chỉ vài giây, Hồi 1 ngắn, còn trả thưởng và CTA khép video lại.',
          },
          {
            question: 'Reading a 150-word paragraph at recording pace takes you 75 seconds. About how many spoken words fit a 60-second short?|||Đọc một đoạn 150 từ ở nhịp quay thật mất 75 giây. Một video ngắn 60 giây chứa được khoảng bao nhiêu từ lời nói?',
            options: ['150|||150', '180|||180', '120|||120', '75|||75'],
            correctIndex: 2,
            points: 1,
            explanation: '150 words ÷ 1.25 minutes = 120 words per minute, so 60 seconds holds about 120 words. The template’s 150 is only a starting point — your own speed decides.|||150 từ ÷ 1,25 phút = 120 từ/phút, vậy 60 giây chứa khoảng 120 từ. Con số 150 của mẫu chỉ là điểm xuất phát — tốc độ của chính bạn mới quyết định.',
          },
          {
            question: 'Which scripting approach suits a coding tutorial best?|||Cách viết kịch bản nào hợp nhất với video dạy code?',
            options: ['No script at all|||Không viết gì cả', 'Hybrid: hook, key explanations and ending written out; demo parts as bullet points|||Kiểu lai: viết đủ hook, các đoạn giải thích chính và phần kết; phần làm mẫu để gạch đầu dòng', 'Read every symbol of the code aloud|||Đọc to từng ký hiệu của code', 'A full script including every keystroke|||Kịch bản đầy đủ ghi cả từng phím bấm'],
            correctIndex: 1,
            points: 1,
            explanation: 'Precise where precision matters, natural while you type. Code belongs on screen; your voice explains what it means.|||Chính xác ở chỗ cần chính xác, tự nhiên trong lúc gõ. Code nằm trên màn hình; giọng nói giải thích nó có nghĩa gì.',
          },
          {
            question: 'Where should the iPad running the teleprompter go when the iPhone is your camera?|||Khi iPhone là máy quay, nên đặt iPad chạy teleprompter ở đâu?',
            options: ['On your lap|||Trên đùi bạn', 'To the side of the tripod at arm’s length|||Bên cạnh chân máy, cách một sải tay', 'Behind the camera, above it|||Phía sau máy quay, cao hơn máy', 'Directly below the iPhone lens|||Ngay bên dưới ống kính iPhone'],
            correctIndex: 3,
            points: 1,
            explanation: 'Right under the lens keeps your eyes a few centimetres from it, so viewers feel you are looking at them. Anywhere to the side makes your eyes visibly drift.|||Ngay dưới ống kính giữ mắt bạn cách nó vài centimet, nên người xem thấy bạn đang nhìn họ. Đặt lệch sang bên là mắt bị trôi thấy rõ.',
          },
          {
            question: 'Mid-sentence you stumble on a word. What is the best move for a fast edit?|||Đang nói giữa câu thì bạn vấp một chữ. Cách xử lý giúp dựng nhanh nhất?',
            options: ['Pause about two seconds, then say the whole sentence again from its start|||Ngừng khoảng hai giây, rồi nói lại cả câu từ đầu câu', 'Stop recording and restart the whole video|||Tắt máy và quay lại cả video', 'Keep going and hope no one notices|||Nói tiếp và mong không ai để ý', 'Repeat only the word you stumbled on|||Chỉ nói lại đúng chữ bị vấp'],
            correctIndex: 0,
            points: 1,
            explanation: 'The silence shows up as a clear gap in the waveform, so the editor cuts once and the fresh sentence joins cleanly. Patching a single word almost never matches the rhythm.|||Khoảng lặng hiện thành một chỗ trống rõ trên sóng âm, nên người dựng cắt đúng một lần và câu mới nối vào gọn. Vá một chữ lẻ gần như không bao giờ khớp nhịp.',
          },
          {
            question: 'How many calls to action should a 60-second short have?|||Một video ngắn 60 giây nên có bao nhiêu lời kêu gọi?',
            options: ['Three, to cover every option|||Ba, để phủ mọi lựa chọn', 'One, at the end — or none if the ending is strong|||Một, ở cuối — hoặc không cần nếu cái kết đủ mạnh', 'One at the start and one at the end|||Một ở đầu và một ở cuối', 'As many as fit in the last five seconds|||Càng nhiều càng tốt trong 5 giây cuối'],
            correctIndex: 1,
            points: 1,
            explanation: 'Several requests become noise and people follow none. A CTA at the start spends the hook on something the viewer does not care about yet.|||Nhiều lời xin thành tiếng ồn và người ta chẳng làm theo cái nào. CTA ở đầu video tiêu mất câu hook vào thứ người xem chưa quan tâm.',
          },
        ],
      },
    },
  ],
};
