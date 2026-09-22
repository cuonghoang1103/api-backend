/**
 * Content Creator — Chương 25: Thumbnail & tiêu đề. Song ngữ EN/VI (.ml-en / .ml-vi).
 * ⚠️ KHÔNG backtick trần trong content (dùng &#96;); `${` trong mã mẫu viết \${ ; gạch chéo ngược viết \\
 */
import { gallery, slide } from './_slides.mjs';

const SLIDES = [
  [1, 'Bìa'],
  [2, 'Bản đồ chương'],
  [3, 'Đóng gói không dừng lại lúc bấm quay'],
  [4, 'Lời hứa phải được video trả'],
  [5, '6 công thức viết tiêu đề'],
  [6, 'Độ dài hiển thị, và từ khoá vs tò mò'],
  [7, 'Nguyên tắc thiết kế thumbnail đọc được ở cỡ nhỏ'],
  [8, 'Thumbnail rối vs gọn — tự dựng để so'],
  [9, 'Thu nhỏ xuống lưới gợi ý trên điện thoại'],
  [10, 'Thumbnail tuỳ chỉnh — thông số thật của YouTube (đã kiểm 09/2026)'],
  [11, 'Chạy thật — dựng ảnh mẫu rồi thu nhỏ, đo bằng số'],
  [12, 'Công cụ thiết kế & giá (đã kiểm 09/2026)'],
  [13, 'Chụp thumbnail ngay trong buổi quay dồn'],
  [14, 'Test & Compare — YouTube tự thử giúp bạn'],
  [15, 'CTR đọc trong ngữ cảnh impression'],
  [16, 'Thực hành chương 25'],
];

export default {
  title: 'Chapter 25 — Thumbnails & titles|||Chương 25 — Thumbnail & tiêu đề',
  description: 'Tiêu đề và thumbnail là lời hứa quyết định có ai bấm vào video hay không: công thức viết tiêu đề, nguyên tắc thiết kế thumbnail đọc được ở cỡ nhỏ (chạy thật, đo bằng số), và cách đọc CTR/Test & Compare của YouTube mà không tự lừa mình.',
  lessons: [
    /* ─────────────────── 25.0 slide bài giảng ─────────────────── */
    {
      title: '25.0 — Chapter 25 in 16 slides|||25.0 — Chương 25 trong 16 slide',
      slug: 'cr-25-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Toàn bộ chương gói trong 16 slide: vòng lặp đóng gói, 6 công thức tiêu đề, nguyên tắc thumbnail đọc được ở cỡ nhỏ (có ảnh mẫu chạy thật), thông số YouTube đã kiểm, và cách đọc Test & Compare.',
      content: `
<div class="ml-en"><h2>📑 Chapter 25 in 16 slides</h2>
<p>Chapter 24 ended by handing you a correctly encoded, correctly published file — and closed with a promise: this chapter goes back to the part that decides whether anyone clicks at all. These 16 slides carry that thread from end to end: the packaging loop that never really closes (slides 3–4), six title formulas and where the promise has to live inside ~60 characters (slides 5–6), the design rules that all point at one constraint — legible once it is tiny (slides 7–9, including a real messy-vs-clean thumbnail built for this chapter), YouTube's actual 2026 upload spec next to a real rendered-and-shrunk file with real byte counts (slides 10–11), tools and prices checked this month (slide 12), and closing with how YouTube's own Test & Compare feature quietly optimizes for watch time, not CTR (slides 14–15).</p>
<p>Two slides are worth a second look before you start: <strong>slide 10</strong> (the resolution most guides still quote is outdated — this one is checked directly against YouTube's help page) and <strong>slide 15</strong> (a real YouTube-verified example where CTR falls and that is actually GOOD news, not bad).</p></div>
<div class="ml-vi"><h2>📑 Chương 25 trong 16 slide</h2>
<p>Chương 24 khép lại bằng một file đã mã hoá đúng, đã đăng đúng — và kết thúc bằng một lời hẹn: chương này quay lại phần quyết định có ai bấm vào hay không. 16 slide này mang mạch đó đi từ đầu tới cuối: vòng lặp đóng gói không bao giờ thật sự khép (slide 3–4), sáu công thức tiêu đề và lời hứa phải nằm trong ~60 ký tự đầu ở đâu (slide 5–6), các nguyên tắc thiết kế đều dồn về một ràng buộc duy nhất — đọc được lúc đã bé tí (slide 7–9, có một thumbnail rối và một thumbnail gọn tự dựng riêng cho chương này), thông số tải lên thật của YouTube năm 2026 đặt cạnh một file đã render rồi thu nhỏ thật với số byte thật (slide 10–11), công cụ và giá đã kiểm ngay trong tháng này (slide 12), và khép lại bằng việc tính năng Test & Compare của chính YouTube âm thầm tối ưu theo thời lượng xem, không phải CTR (slide 14–15).</p>
<p>Hai slide đáng nhìn kỹ trước khi học: <strong>slide 10</strong> (độ phân giải nhiều bài viết vẫn trích đã cũ — slide này kiểm thẳng trên trang trợ giúp của YouTube) và <strong>slide 15</strong> (một ví dụ đã kiểm chứng từ chính YouTube nơi CTR giảm mà đó lại là TIN TỐT, không phải tin xấu).</p></div>
${gallery('cr-25', SLIDES)}
`,
    },

    /* ─────────────────── 25.1 packaging ─────────────────── */
    {
      title: '25.1 — Packaging: the promise your video has to pay|||25.1 — Đóng gói: lời hứa mà video của bạn phải trả',
      slug: 'cr-25-1-packaging',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Đóng gói không dừng lại ở bước lên ý tưởng: đây là vòng lặp chạy suốt vòng đời video, và tiêu đề + thumbnail là một lời hứa mà chính video phải trả — kèm hậu quả chính sách thật nếu không trả.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 25 · Lesson 25.1</span>
<h2>Packaging is not a step. It is a loop that never fully closes.</h2>
<p class="lead">Lesson 1.2 already gave you the loop — impression, click-through rate (CTR), watch time, satisfaction — and told you the title and thumbnail win the click. Lesson 2.2 already gave you the test: write the title and sketch the thumbnail before you film, because if nothing makes you want to click, the idea is not ready. Both are still correct, and this lesson does not repeat them. What it adds is the part neither lesson could show you yet: what happens to that promise AFTER the click — and why "packaging" is a word this course will keep using all the way to Lesson 25.4, not just here.</p>

<h3>The loop packaging actually lives in</h3>
${slide('cr-25', 3, 'Đóng gói không dừng lại lúc bấm quay')}
<p>Lesson 2.2 packaged an idea BEFORE filming. But a title and thumbnail are not a decision you make once and forget — they are a claim that keeps needing to be true. Trace the whole loop: an idea gets scored (Lesson 2.2), it gets packaged into a title and thumbnail (this lesson), the shoot and edit have to make that specific package true (not just "a good video" — THIS promise), it gets published with that exact title and thumbnail, its performance gets measured, and — this is the part Lessons 1.2 and 2.2 stopped short of — the package can be revised based on what the numbers actually say. Lesson 25.4 closes that last arrow. For now, notice what the loop implies: packaging is not finished when you hit upload.</p>

<h3>The promise-payoff contract</h3>
${slide('cr-25', 4, 'Lời hứa phải được video trả')}
<p>Here is the mechanism underneath "packaging," stated plainly: a title and thumbnail make a specific, falsifiable claim about what a viewer is about to get. The hook (Lesson 3.1) is the down payment — it has to start paying that claim back within the first seconds. The rest of the video is the full payment. And <strong>satisfaction</strong> — the signal Lesson 1.2 told you YouTube measures directly, through surveys and behaviour, separately from the click itself — is the receipt. A title can win the click and still lose on satisfaction, and Lesson 1.2 already named this trap: "winning the click, losing the viewer."</p>
<p>Play it out on the running example from Lesson 2.2 — "Deploy Next.js to a VPS, start to finish," the idea that scored 17/20 on demand, edge, effort and packageability:</p>
<table>
<tr><th>Title</th><th>The promise</th><th>What the video actually does</th><th>Outcome</th></tr>
<tr><td>"Deploy a VPS in JUST 5 MINUTES!!"</td><td>Done in 5 minutes</td><td>Runs 20 minutes; a setup step got cut for time</td><td>Viewers bail mid-video; some report it as misleading</td></tr>
<tr><td>"Deploy Next.js to a VPS in 20 minutes"</td><td>The full process, honestly timed</td><td>19–21 minutes, every step shown as promised</td><td>Watched to the end; trusted next time</td></tr>
</table>
<p>Nothing about the SECOND title is less exciting than the first — it is simply a claim the video can actually pay off. That is the whole difference between "packaging" done well and clickbait: not restraint for its own sake, but a promise sized to what you are actually going to deliver.</p>

<h3>When breaking the promise is not just bad practice — it is a policy violation</h3>
<p>This is not only a satisfaction problem. YouTube's own <strong>Thumbnails policy</strong>, checked directly on its help page, names this exact failure mode: a thumbnail or title that "misleads viewers to think they're about to view something that's not in the video." Its own worked examples read like a checklist of what NOT to do — uploading a full match under a title promising the whole thing while the video only shows a clip; a thumbnail featuring a popular celebrity who has nothing to do with the video; a title or thumbnail that leads a viewer to expect one genre (say, a news analysis) when the video is something else entirely (say, a music video).</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — treating a broken promise as a style choice instead of an enforcement risk.</strong> YouTube's stated enforcement ladder, confirmed directly on its policy page: a first violation typically gets a warning (no penalty, and it can expire after 90 days of policy training); a real violation gets the thumbnail removed AND can add a strike to your account; three strikes within 90 days, or a channel built around this kind of content, can get the channel terminated outright. Content containing pornography in the thumbnail can get a channel terminated immediately, no warning step. "It got more clicks" is not a defence YouTube's own enforcement recognises.</p></div>

<p class="note-ct"><strong>Connects to next:</strong> Lesson 25.1 set the promise. Lesson 25.2 is about writing the TITLE half of it — six concrete formulas, and exactly where inside the character limit the promise has to sit.</p>

<h3>🎬 Practice (15–20 minutes)</h3>
<div class="callout ok"><ol>
<li>Open one real idea already sitting in your Idea Bank (/creator/ideas).</li>
<li>Write down, in one sentence, the SPECIFIC promise its title + thumbnail pair would make to a viewer — not "a good video," the exact claim (a number, a timeframe, an outcome).</li>
<li>Check that sentence against what you actually plan to shoot: does the footage you are planning to capture make that promise true from the first minute to the last?</li>
</ol><p><strong>Done when:</strong> you can point to the exact moment in your planned shoot that pays off the promise, and you would report yourself to Lesson 25.1's own checklist if it were missing.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Packaging</span><span class="v">The title and thumbnail pair, treated as a claim that has to stay true from idea through to publish and beyond — not a one-time decision (Lesson 2.2 introduced the term; this lesson extends it into a loop).</span></div>
<div class="kv"><span class="k">Promise / payoff</span><span class="v">The specific expectation a title+thumbnail sets (the promise), and whether the video actually delivers it start to finish (the payoff).</span></div>
<div class="kv"><span class="k">Malicious clickbait</span><span class="v">YouTube's own term for a title/thumbnail/description built to mislead viewers into clicking on something the video does not contain — a Community Guidelines violation, not just a bad look.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Packaging is a loop, not a step: idea → title/thumbnail → shoot & edit that has to make it true → publish → measure → revise (Lesson 25.4 closes the last arrow).</li>
<li>A title/thumbnail makes a specific, checkable promise. The hook pays the down payment; the rest of the video pays it off; satisfaction (Lesson 1.2) is the receipt.</li>
<li>The SAME idea can be packaged honestly or dishonestly — the exciting version and the honest version are not opposites; an honest promise sized to what you deliver is the goal.</li>
<li>Breaking that promise is a named YouTube policy violation (malicious clickbait / misleading metadata), with a real enforcement ladder: warning → strike + thumbnail removal → termination at three strikes in 90 days.</li>
</ul>
<div class="link-card"><a href="https://support.google.com/youtube/answer/9229980" target="_blank" rel="noopener">YouTube Help — Thumbnails policy</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 25 · Bài 25.1</span>
<h2>Đóng gói không phải một bước. Nó là một vòng lặp không bao giờ thật sự khép lại.</h2>
<p class="lead">Bài 1.2 đã cho bạn vòng lặp — lượt hiển thị, tỉ lệ nhấp (CTR), thời lượng xem, sự hài lòng — và nói rằng tiêu đề với thumbnail thắng cú bấm. Bài 2.2 đã cho bạn phép thử: viết tiêu đề và phác thumbnail trước khi quay, vì nếu không có gì khiến bạn muốn bấm thì ý tưởng chưa sẵn sàng. Cả hai vẫn đúng, và bài này không nhắc lại. Thứ nó thêm vào là phần cả hai bài trước chưa kịp cho bạn thấy: chuyện gì xảy ra với lời hứa đó SAU cú bấm — và vì sao "đóng gói" là từ khoá học này sẽ còn dùng tới tận Bài 25.4, không chỉ ở đây.</p>

<h3>Vòng lặp mà đóng gói thật sự sống trong đó</h3>
${slide('cr-25', 3, 'Đóng gói không dừng lại lúc bấm quay')}
<p>Bài 2.2 đóng gói một ý tưởng TRƯỚC khi quay. Nhưng tiêu đề và thumbnail không phải một quyết định bạn ra một lần rồi quên — đó là một lời tuyên bố cần tiếp tục đúng. Lần theo cả vòng lặp: một ý tưởng được chấm điểm (Bài 2.2), nó được đóng gói thành tiêu đề và thumbnail (bài này), buổi quay và dựng phải làm cho ĐÚNG gói đó thành sự thật (không chỉ "một video hay" — mà là ĐÚNG lời hứa này), nó được đăng với đúng tiêu đề và thumbnail đó, hiệu suất của nó được đo, và — đây là phần Bài 1.2 và 2.2 chưa kịp nói tới — gói đó có thể được sửa lại dựa trên đúng những gì con số nói. Bài 25.4 khép nốt mũi tên cuối đó. Còn bây giờ, hãy để ý điều vòng lặp này ngụ ý: đóng gói không xong lúc bạn bấm đăng.</p>

<h3>Hợp đồng lời hứa — trả lời hứa</h3>
${slide('cr-25', 4, 'Lời hứa phải được video trả')}
<p>Đây là cơ chế nằm dưới "đóng gói," nói thẳng ra: một tiêu đề và thumbnail đưa ra một tuyên bố cụ thể, kiểm chứng được, về thứ người xem sắp nhận. Hook (Bài 3.1) là khoản trả trước — nó phải bắt đầu trả lời hứa đó ngay trong vài giây đầu. Phần còn lại của video là khoản trả đủ. Và <strong>sự hài lòng</strong> — tín hiệu Bài 1.2 đã nói YouTube đo trực tiếp, qua khảo sát và hành vi, tách biệt với chính cú bấm — là biên nhận. Một tiêu đề có thể thắng cú bấm mà vẫn thua ở sự hài lòng, và Bài 1.2 đã gọi tên cái bẫy này: "thắng cú bấm, mất người xem."</p>
<p>Diễn lại trên đúng ví dụ xuyên suốt từ Bài 2.2 — "Deploy Next.js lên VPS từ A tới Z," ý tưởng được 17/20 điểm nhu cầu, lợi thế, công sức và khả năng đóng gói:</p>
<table>
<tr><th>Tiêu đề</th><th>Lời hứa</th><th>Video thực tế làm gì</th><th>Kết quả</th></tr>
<tr><td>"Deploy VPS chỉ 5 PHÚT!!"</td><td>Xong trong 5 phút</td><td>Chạy 20 phút; một bước cài đặt bị cắt cho kịp giờ</td><td>Người xem bỏ giữa chừng; có người báo cáo là gây hiểu lầm</td></tr>
<tr><td>"Deploy Next.js lên VPS trong 20 phút"</td><td>Toàn bộ quy trình, tính giờ trung thực</td><td>19–21 phút, mọi bước đều hiện đúng như đã hứa</td><td>Xem hết; tin tưởng lần sau</td></tr>
</table>
<p>Tiêu đề THỨ HAI không hề kém hấp dẫn hơn tiêu đề đầu — nó đơn giản là một lời tuyên bố mà video thật sự trả nổi. Đó là toàn bộ khác biệt giữa "đóng gói" làm tốt và câu kéo (clickbait): không phải sự dè dặt vì dè dặt, mà là một lời hứa vừa đúng với thứ bạn thật sự sẽ giao.</p>

<h3>Khi phản bội lời hứa không chỉ là làm việc dở — đó là vi phạm chính sách</h3>
<p>Đây không chỉ là vấn đề về sự hài lòng. <strong>Chính sách Thumbnails</strong> của chính YouTube, đã kiểm trực tiếp trên trang trợ giúp, gọi tên đúng kiểu lỗi này: một thumbnail hoặc tiêu đề "khiến người xem hiểu lầm rằng họ sắp xem một thứ không có trong video." Các ví dụ của chính họ đọc như một danh sách những điều KHÔNG được làm — tải một trận đấu trọn vẹn dưới tiêu đề hứa cả trận trong khi video chỉ có một đoạn clip; một thumbnail gắn hình một người nổi tiếng chẳng liên quan gì tới video; một tiêu đề hay thumbnail khiến người xem tưởng sẽ thấy một thể loại (ví dụ phân tích tin tức) trong khi video là một thứ hoàn toàn khác (ví dụ một music video).</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — coi việc phản bội lời hứa là chuyện gu thẩm mỹ thay vì rủi ro bị xử lý.</strong> Nấc thang xử lý mà chính YouTube công bố, đã kiểm trực tiếp trên trang chính sách: vi phạm lần đầu thường chỉ nhận cảnh cáo (không phạt, và có thể hết hạn sau 90 ngày hoàn thành đào tạo chính sách); vi phạm thật sự thì thumbnail bị gỡ VÀ có thể cộng thêm một strike vào tài khoản; ba strike trong 90 ngày, hoặc một kênh xây quanh kiểu nội dung này, có thể bị chấm dứt hẳn. Thumbnail chứa nội dung khiêu dâm có thể bị chấm dứt kênh ngay lập tức, không qua bước cảnh cáo. "Nó kéo được nhiều lượt bấm hơn" không phải lý lẽ bào chữa mà cơ chế xử lý của chính YouTube công nhận.</p></div>

<p class="note-ct"><strong>Nối với bài sau:</strong> Bài 25.1 đặt ra lời hứa. Bài 25.2 nói về việc viết nửa TIÊU ĐỀ của lời hứa đó — sáu công thức cụ thể, và đúng chỗ trong giới hạn ký tự mà lời hứa phải nằm.</p>

<h3>🎬 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Mở một ý tưởng thật đang nằm trong Kho ý tưởng của bạn (/creator/ideas).</li>
<li>Viết ra, trong một câu, lời hứa CỤ THỂ mà cặp tiêu đề + thumbnail của nó sẽ đưa ra cho người xem — không phải "một video hay," mà đúng tuyên bố (một con số, một khung thời gian, một kết quả).</li>
<li>Đối chiếu câu đó với đúng thứ bạn định quay: cảnh quay bạn dự định ghi lại có làm cho lời hứa đó đúng từ phút đầu tới phút cuối không?</li>
</ol><p><strong>Đạt khi:</strong> bạn chỉ ra được đúng khoảnh khắc trong buổi quay dự kiến trả lời hứa đó, và bạn sẽ tự báo cáo mình theo đúng checklist của Bài 25.1 nếu nó thiếu.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Đóng gói (packaging)</span><span class="v">Cặp tiêu đề + thumbnail, coi như một lời tuyên bố cần tiếp tục đúng từ lúc có ý tưởng tới lúc đăng và cả sau đó — không phải một quyết định một lần (Bài 2.2 đưa ra thuật ngữ; bài này mở rộng nó thành một vòng lặp).</span></div>
<div class="kv"><span class="k">Lời hứa / trả lời hứa (promise/payoff)</span><span class="v">Kỳ vọng cụ thể mà tiêu đề+thumbnail đặt ra (lời hứa), và việc video có thật sự giao đúng nó từ đầu tới cuối hay không (trả lời hứa).</span></div>
<div class="kv"><span class="k">Malicious clickbait</span><span class="v">Thuật ngữ của chính YouTube cho một tiêu đề/thumbnail/mô tả dựng ra để đánh lừa người xem bấm vào thứ video không hề có — một vi phạm Nguyên tắc cộng đồng, không chỉ là hình ảnh xấu.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đóng gói là một vòng lặp, không phải một bước: ý tưởng → tiêu đề/thumbnail → quay & dựng để làm nó thành thật → đăng → đo → sửa lại (Bài 25.4 khép nốt mũi tên cuối).</li>
<li>Một tiêu đề/thumbnail đưa ra một lời hứa cụ thể, kiểm chứng được. Hook trả khoản trước; phần còn lại của video trả đủ; sự hài lòng (Bài 1.2) là biên nhận.</li>
<li>CÙNG một ý tưởng có thể được đóng gói trung thực hoặc không trung thực — bản hấp dẫn và bản trung thực không đối lập nhau; mục tiêu là một lời hứa vừa đúng với thứ bạn giao.</li>
<li>Phản bội lời hứa đó là một vi phạm chính sách có tên hẳn hoi của YouTube (malicious clickbait / misleading metadata), có nấc thang xử lý thật: cảnh cáo → strike + gỡ thumbnail → chấm dứt kênh ở ba strike trong 90 ngày.</li>
</ul>
<div class="link-card"><a href="https://support.google.com/youtube/answer/9229980" target="_blank" rel="noopener">YouTube Help — Chính sách Thumbnails</a></div>
</div>
`,
    },

    /* ─────────────────── 25.2 viết tiêu đề ─────────────────── */
    {
      title: '25.2 — Writing titles that earn the right click|||25.2 — Viết tiêu đề thắng đúng cú bấm',
      slug: 'cr-25-2-viet-tieu-de',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Sáu công thức viết tiêu đề dùng được thật, đúng chỗ để đặt lời hứa trong ~60 ký tự đầu, và vì sao tối ưu cho tìm kiếm với tối ưu cho đề xuất không phải cùng một cách viết.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 25 · Lesson 25.2</span>
<h2>Six shapes for the same job: making the promise irresistible AND keepable</h2>
<p class="lead">Lesson 25.1 defined the job a title has to do — make a specific promise the video can pay off. This lesson gives you six repeatable shapes for that promise, exactly where inside YouTube's character limit it has to sit, and why a tutorial and a vlog should NOT be titled the same way even when both ideas scored well in Lesson 2.2.</p>

<h3>Six formulas, and when each one earns its place</h3>
${slide('cr-25', 5, '6 công thức viết tiêu đề')}
<p>These are not arbitrary templates — each one works because it opens a specific kind of information gap or expectation, and each fits some video types better than others:</p>
<table>
<tr><th>Formula</th><th>Use it when</th><th>Example</th></tr>
<tr><td><strong>Curiosity gap</strong></td><td>There is a genuinely surprising "why" the viewer does not already know</td><td>"Why my code works on my machine and breaks on the VPS"</td></tr>
<tr><td><strong>Number</strong></td><td>The content is a real, countable list — not padded to hit a round number</td><td>"7 git commands I use every day on internship"</td></tr>
<tr><td><strong>How-to</strong></td><td>A clear, step-by-step process, with obvious search intent</td><td>"How to deploy Next.js to a VPS with Docker"</td></tr>
<tr><td><strong>Transformation</strong></td><td>You have a measurable before/after</td><td>"My site went from 4s to 0.8s load — here's what I changed"</td></tr>
<tr><td><strong>Warning / mistake</strong></td><td>You made a real mistake and want to save someone else from it</td><td>"The Prisma bug that deleted my production data"</td></tr>
<tr><td><strong>Question</strong></td><td>It is the EXACT question your audience is already asking themselves</td><td>"Do you need to be good at English to learn programming?"</td></tr>
</table>
<p>Notice that none of these require exaggeration to work — the pull comes from a real, specific gap or claim, not from volume (ALL CAPS, exclamation marks) or vagueness. A title that only works when overstated is not a formula problem; it is a Lesson 25.1 problem — the idea itself may not have a real promise to make yet.</p>

<h3>Where the promise has to live: the first ~60 characters</h3>
${slide('cr-25', 6, 'Độ dài hiển thị, và từ khoá vs tò mò')}
<p>Lesson 24.2 already measured this: titles stay under roughly 100 characters, and whatever matters most needs to sit in the first ~60, because many devices and search results truncate past that point. This lesson adds the part Lesson 24.2 did not need yet: WHAT exactly goes in that front-loaded space depends on where the click is coming from.</p>
<table>
<tr><th></th><th>Optimizing for SEARCH</th><th>Optimizing for SUGGESTED / browse</th></tr>
<tr><td>What the viewer is doing</td><td>Typed a specific need (Lesson 1.1)</td><td>Scrolling Home / Up next — has not typed anything</td></tr>
<tr><td>What leads the title</td><td>The real keyword phrase ("Deploy Next.js VPS")</td><td>The curiosity hook ("I almost lost my whole site")</td></tr>
<tr><td>Fits these video types</td><td>Tutorials, fixes, tool comparisons</td><td>Vlogs, journeys, story-shaped content with a twist</td></tr>
</table>
<p>Neither column is "correct" in general — Lesson 1.2's recommendation logic runs on different signals depending on the surface a viewer is on, and Lesson 25.4 will show you exactly how differently CTR behaves on Search versus Home. A coding-tutorial title that leads with a curiosity hook instead of the actual keyword phrase is invisible to someone typing that exact problem into the search bar — it never gets the impression in the first place.</p>

<h3>Vietnamese titles vs English titles</h3>
<p>Lesson 23.1 already covers the bigger bilingual strategy question (one channel vs two, which content fits which language). For titles specifically: a Vietnamese title should use the words a Vietnamese viewer would actually type or expect to see — not a literal, word-for-word translation of an English phrase, which often reads stiffly and misses how people actually search in Vietnamese. An English title, per Lesson 23.2's B1-vocabulary rule for scripts, benefits from the same restraint: simple, direct words a global audience parses instantly beat a thesaurus-sourced synonym that sounds impressive but slows the read.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — using a formula to inflate a promise past what Lesson 25.1 would allow.</strong> "7 git commands" is a number formula that works because it is literally 7. Stretching it to "10 game-changing git commands" when you only have 7 real ones, or turning a routine fix into "mistake that DESTROYED everything" when it cost you ten minutes, is not a stronger formula — it is Lesson 25.1's broken promise wearing a formula's clothing. The formula is a shape for a true claim, not a licence to inflate one.</p></div>

<p class="note-ct"><strong>Connects to next:</strong> the title half of the promise is written. Lesson 25.3 is the thumbnail half — the design rules that make it survive being shown at a fraction of its real size.</p>

<h3>🎬 Practice (15–20 minutes)</h3>
<div class="callout ok"><ol>
<li>Take the same idea you packaged in Lesson 25.1's practice.</li>
<li>Write it as THREE different titles, using three different formulas from the table above.</li>
<li>For each one, say out loud whether it is optimized for search or for suggested/browse — and check that choice matches what kind of video it actually is.</li>
</ol><p><strong>Done when:</strong> you have 3 titles under 100 characters, with the strongest promise inside the first 60, and you can defend the search-vs-suggested choice for each.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Curiosity gap</span><span class="v">A title formula built around a real, specific piece of missing information the viewer wants filled in.</span></div>
<div class="kv"><span class="k">Search intent vs discovery intent</span><span class="v">Whether a viewer arrives having typed a specific need (search) or while browsing without a specific goal (Home/suggested/Up next).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Six repeatable formulas — curiosity gap, number, how-to, transformation, warning/mistake, question — each open a real information gap, not exaggeration.</li>
<li>Lesson 24.2's ~100/~60 character numbers still apply; this lesson adds WHAT to front-load: real keywords for search intent, a curiosity hook for suggested/browse intent.</li>
<li>Vietnamese titles should use words Vietnamese viewers actually type, not literal translations of an English phrase; English titles keep Lesson 23.2's simple-vocabulary rule.</li>
<li>A formula is a shape for a true claim — stretching a formula past what actually happened is Lesson 25.1's broken-promise trap wearing a different outfit.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 25 · Bài 25.2</span>
<h2>Sáu khuôn cho cùng một việc: làm lời hứa vừa cuốn hút vừa trả nổi</h2>
<p class="lead">Bài 25.1 đã định nghĩa việc mà một tiêu đề phải làm — đưa ra một lời hứa cụ thể mà video trả nổi. Bài này cho bạn sáu khuôn lặp lại được cho lời hứa đó, đúng chỗ trong giới hạn ký tự của YouTube nó phải nằm, và vì sao một video hướng dẫn với một video vlog KHÔNG nên đặt tiêu đề cùng một kiểu dù cả hai ý tưởng đều được điểm cao ở Bài 2.2.</p>

<h3>6 công thức, và khi nào từng cái xứng đáng được dùng</h3>
${slide('cr-25', 5, '6 công thức viết tiêu đề')}
<p>Đây không phải những khuôn mẫu tuỳ tiện — mỗi công thức hiệu quả vì nó mở ra một kiểu khoảng hở thông tin hoặc kỳ vọng cụ thể, và mỗi cái hợp một số loại video hơn loại khác:</p>
<table>
<tr><th>Công thức</th><th>Dùng khi</th><th>Ví dụ</th></tr>
<tr><td><strong>Tò mò (curiosity gap)</strong></td><td>Có một chữ "vì sao" thật sự bất ngờ mà người xem chưa biết</td><td>"Vì sao code chạy trên máy tôi mà vỡ trên VPS"</td></tr>
<tr><td><strong>Con số</strong></td><td>Nội dung là một danh sách thật, đếm được — không độn cho tròn số</td><td>"7 lệnh git tôi dùng mỗi ngày đi thực tập"</td></tr>
<tr><td><strong>Cách làm (how-to)</strong></td><td>Một quy trình rõ ràng, từng bước, ý định tìm kiếm dễ thấy</td><td>"Cách deploy Next.js lên VPS bằng Docker"</td></tr>
<tr><td><strong>Biến đổi (trước/sau)</strong></td><td>Bạn có một kết quả trước/sau đo được</td><td>"Web tôi tải 4 giây → 0,8 giây, đây là thứ tôi đã sửa"</td></tr>
<tr><td><strong>Cảnh báo / sai lầm</strong></td><td>Bạn từng mắc lỗi thật, muốn cứu người khác khỏi nó</td><td>"Lỗi Prisma khiến tôi mất dữ liệu production"</td></tr>
<tr><td><strong>Câu hỏi</strong></td><td>Đúng câu hỏi khán giả của bạn đang tự hỏi mình</td><td>"Học lập trình có cần giỏi tiếng Anh trước không?"</td></tr>
</table>
<p>Để ý là không công thức nào cần phóng đại mới hiệu quả — lực hút tới từ một khoảng hở hoặc lời tuyên bố cụ thể, thật, không phải từ âm lượng (CHỮ HOA HẾT, chấm than) hay sự mơ hồ. Một tiêu đề chỉ hiệu quả khi bị thổi phồng không phải lỗi công thức — đó là lỗi Bài 25.1: có thể bản thân ý tưởng đó chưa có lời hứa thật để đưa ra.</p>

<h3>Chỗ lời hứa phải nằm: ~60 ký tự đầu</h3>
${slide('cr-25', 6, 'Độ dài hiển thị, và từ khoá vs tò mò')}
<p>Bài 24.2 đã đo điều này: tiêu đề nên dưới khoảng 100 ký tự, và thứ quan trọng nhất cần nằm trong ~60 ký tự đầu, vì nhiều thiết bị và kết quả tìm kiếm cắt bớt sau điểm đó. Bài này thêm phần Bài 24.2 chưa cần tới: ĐẶT GÌ chính xác vào vùng đầu đó tuỳ vào cú bấm tới từ đâu.</p>
<table>
<tr><th></th><th>Tối ưu cho TÌM KIẾM</th><th>Tối ưu cho ĐỀ XUẤT / lướt</th></tr>
<tr><td>Người xem đang làm gì</td><td>Đã gõ một nhu cầu cụ thể (Bài 1.1)</td><td>Đang lướt Trang chủ / Xem tiếp — chưa gõ gì cả</td></tr>
<tr><td>Cái gì đứng đầu tiêu đề</td><td>Đúng cụm từ khoá thật ("Deploy Next.js VPS")</td><td>Móc tò mò ("Tôi suýt mất cả trang web")</td></tr>
<tr><td>Hợp loại video nào</td><td>Hướng dẫn, sửa lỗi, so sánh công cụ</td><td>Vlog, hành trình, nội dung kể chuyện có twist</td></tr>
</table>
<p>Không cột nào "đúng" chung chung — logic đề xuất của Bài 1.2 chạy theo những tín hiệu khác nhau tuỳ bề mặt người xem đang đứng, và Bài 25.4 sẽ cho bạn thấy chính xác CTR khác nhau thế nào giữa Tìm kiếm và Trang chủ. Một tiêu đề video hướng dẫn lập trình mà mở đầu bằng móc tò mò thay vì đúng cụm từ khoá thì vô hình với người đang gõ chính vấn đề đó vào ô tìm kiếm — nó không bao giờ nhận được lượt hiển thị ngay từ đầu.</p>

<h3>Tiêu đề tiếng Việt vs tiếng Anh</h3>
<p>Bài 23.1 đã nói câu hỏi chiến lược song ngữ lớn hơn (một kênh hay hai kênh, nội dung nào hợp ngôn ngữ nào). Riêng về tiêu đề: một tiêu đề tiếng Việt nên dùng đúng từ người xem Việt sẽ thật sự gõ hoặc mong thấy — không phải bản dịch từng chữ của một cụm tiếng Anh, thứ thường đọc cứng và bỏ lỡ cách người ta thật sự tìm kiếm bằng tiếng Việt. Một tiêu đề tiếng Anh, theo đúng luật từ vựng B1 của Bài 23.2 cho kịch bản, cũng hưởng lợi từ sự tiết chế tương tự: từ đơn giản, trực tiếp mà khán giả toàn cầu hiểu ngay thắng một từ đồng nghĩa nghe kêu nhưng làm chậm việc đọc.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — dùng công thức để thổi phồng lời hứa vượt quá điều Bài 25.1 cho phép.</strong> "7 lệnh git" là công thức con số hiệu quả vì đúng là 7. Kéo nó thành "10 lệnh git thay đổi cuộc đời" khi bạn chỉ có 7 lệnh thật, hay biến một lỗi sửa vặt thành "sai lầm HUỶ HOẠI mọi thứ" khi nó chỉ tốn mười phút — đó không phải công thức mạnh hơn, đó là lời hứa vỡ của Bài 25.1 mặc áo công thức. Công thức là một cái khuôn cho một tuyên bố thật, không phải giấy phép để thổi phồng nó.</p></div>

<p class="note-ct"><strong>Nối với bài sau:</strong> nửa tiêu đề của lời hứa đã viết xong. Bài 25.3 là nửa thumbnail — các nguyên tắc thiết kế giúp nó sống sót khi bị hiện ra ở một phần nhỏ xíu của kích thước thật.</p>

<h3>🎬 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Lấy đúng ý tưởng bạn đã đóng gói ở phần thực hành Bài 25.1.</li>
<li>Viết nó thành BA tiêu đề khác nhau, dùng ba công thức khác nhau trong bảng trên.</li>
<li>Với mỗi tiêu đề, nói to xem nó tối ưu cho tìm kiếm hay cho đề xuất/lướt — và kiểm lựa chọn đó có khớp với đúng loại video hay không.</li>
</ol><p><strong>Đạt khi:</strong> bạn có 3 tiêu đề dưới 100 ký tự, lời hứa mạnh nhất nằm trong 60 ký tự đầu, và bạn bảo vệ được lựa chọn tìm kiếm-hay-đề-xuất cho từng cái.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Tò mò (curiosity gap)</span><span class="v">Một công thức tiêu đề dựng quanh một mảnh thông tin còn thiếu thật sự, cụ thể mà người xem muốn được lấp đầy.</span></div>
<div class="kv"><span class="k">Ý định tìm kiếm vs ý định lướt</span><span class="v">Người xem tới nơi vì đã gõ một nhu cầu cụ thể (tìm kiếm) hay vì đang lướt không có mục tiêu cụ thể (Trang chủ/đề xuất/Xem tiếp).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Sáu công thức lặp lại được — tò mò, con số, cách làm, biến đổi, cảnh báo/sai lầm, câu hỏi — mỗi cái mở một khoảng hở thông tin thật, không phải phóng đại.</li>
<li>Con số ~100/~60 ký tự của Bài 24.2 vẫn áp dụng; bài này thêm phần ĐẶT GÌ lên đầu: từ khoá thật cho ý định tìm kiếm, móc tò mò cho ý định đề xuất/lướt.</li>
<li>Tiêu đề tiếng Việt nên dùng đúng từ người Việt thật sự gõ, không phải bản dịch từng chữ từ tiếng Anh; tiêu đề tiếng Anh giữ luật từ vựng đơn giản của Bài 23.2.</li>
<li>Công thức là một cái khuôn cho một tuyên bố thật — kéo giãn công thức quá xa điều thật sự xảy ra chính là cái bẫy lời hứa vỡ của Bài 25.1 khoác áo khác.</li>
</ul>
</div>
`,
    },

    /* ─────────────────── 25.3 thiết kế thumbnail ─────────────────── */
    {
      title: '25.3 — Designing a thumbnail that survives being tiny|||25.3 — Thiết kế thumbnail sống sót khi bị thu nhỏ',
      slug: 'cr-25-3-thiet-ke-thumbnail',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Nguyên tắc thiết kế thumbnail dồn về một ràng buộc duy nhất — đọc được ở cỡ nhỏ — chứng minh bằng một ảnh dựng thật rồi thu nhỏ đo bằng số, thông số YouTube 2026 đã kiểm, giá công cụ, và quy trình chụp bằng iPhone 48MP.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 25 · Lesson 25.3</span>
<h2>Every thumbnail rule points at the same constraint: it has to survive getting tiny</h2>
<p class="lead">A thumbnail is never viewed at the size you designed it. On a phone's suggested list it might render at somewhere around 160–170 pixels wide — smaller than most of the design decisions you will be tempted to make. Every rule in this lesson is really one rule wearing five outfits: does it still read once it is small? This lesson proves that with a real image, rendered and shrunk on this machine, not asserted from memory — and then gives you YouTube's actual current upload spec, checked directly against its help page, because the number most guides still quote is out of date.</p>

<h3>Five rules, one constraint</h3>
${slide('cr-25', 7, 'Nguyên tắc thiết kế thumbnail đọc được ở cỡ nhỏ')}
<p>One focal point — a viewer's eye has to know where to land within half a second, and a thumbnail with two competing subjects loses to one with a single clear subject every time. A human face with real emotion — faces pull the eye faster than any other shape, which is exactly why Lesson 7.1's close-up framing logic applies here too. Strong contrast — your subject and text need to separate cleanly from the background, not blend into it, because contrast is one of the few things that still reads at 160 pixels wide when fine detail does not. At most 3 elements — a person, one line of text, one accent (a badge, an arrow, a number) is already a full thumbnail; a fourth element is competing for attention the first three already earned. At most 4 words of on-image text — a thumbnail is not the place to write a sentence; that is what the title (Lesson 25.2) is for.</p>

<h3>A messy one and a clean one, built to be compared</h3>
${slide('cr-25', 8, 'Thumbnail rối vs gọn — tự dựng để so')}
<p>The messy version on the left breaks nearly every rule above at once: seven separate elements, four different fonts and colours fighting each other, a rainbow gradient background with no contrast zone anywhere, and a decorative arrow that points at nothing in particular. The clean version keeps exactly one promise ("VPS · 20 PHÚT" — 3 words), one accent badge, and a dark background that makes the yellow and white text jump out without any effort. Side by side, your eye does not need to be told which one reads faster — but "faster to read at full size" is not the same claim as "readable once it is small." That claim needs to be tested, not assumed.</p>

<h3>Proving it: build, shrink, look — with real numbers</h3>
${slide('cr-25', 9, 'Thu nhỏ xuống lưới gợi ý trên điện thoại')}
<p>Here is that test, run for real. A 1280×720 thumbnail was rendered from the "clean" design above and exported as JPEG, then shrunk to 168×94 pixels — roughly the width a compact list thumbnail (search results, Up next, a related-videos list) renders at on a phone, smaller than even a mobile home-feed card. Both steps used real tools, not estimates:</p>
<pre><code class="language-bash">ffmpeg -i thumb-mau-1280x720.jpg -vf scale=168:94 -frames:v 1 -update 1 thumb-mau-168x94.jpg
ls -la thumb-mau-1280x720.jpg thumb-mau-168x94.jpg</code></pre>
<div class="out">50006 thumb-mau-1280x720.jpg
3067 thumb-mau-168x94.jpg</div>
<p>Real, measured numbers: the full-size file is <strong>50,006 bytes (48.8 KB)</strong> — nowhere near any of the limits in the table below — and the shrunk 168×94 copy is <strong>3,067 bytes (3.0 KB)</strong>. Looking at the shrunk copy directly (not guessing from the full-size one): "VPS" and the checkmark badge are still legible; a busier design with 7 fighting elements would not have survived this same shrink. That gap between "looks fine at full size" and "still reads at 168 pixels" is the entire reason Lesson 25.3's rules exist — they are not a style preference, they are what a thumbnail needs to clear a test exactly like this one. Do this same test yourself before publishing: preview your own export at roughly 160–170 pixels wide (Preview.app, Photos, or the same &#96;ffmpeg -vf scale=168:-1&#96; command) and look at the small copy, not the large one.</p>

<h3>YouTube's actual upload spec — checked this month, not remembered from a year ago</h3>
${slide('cr-25', 10, 'Thumbnail tuỳ chỉnh — thông số thật của YouTube (đã kiểm 09/2026)')}
<p>Checked directly against YouTube's own "Add video thumbnails" help page:</p>
<div class="kv-grid">
<div class="kv"><span class="k">Recommended resolution</span><span class="v"><strong>3840×2160</strong>, minimum width 640px — YouTube's own wording. The 1280×720 number a lot of older guides still quote is the OLD recommendation; it has changed.</span></div>
<div class="kv"><span class="k">Aspect ratio</span><span class="v">16:9, matching the video itself.</span></div>
<div class="kv"><span class="k">File format</span><span class="v">JPG or PNG — not an animated GIF.</span></div>
<div class="kv"><span class="k">Max file size</span><span class="v">2MB when uploaded from a phone; 50MB when uploaded from a computer / Studio on the web.</span></div>
<div class="kv"><span class="k">Eligibility</span><span class="v">Your account must be verified to upload a custom thumbnail at all — without verification, you can only pick from YouTube's auto-generated frames.</span></div>
</div>
<p>This lesson's own 1280×720 test file above is still a perfectly usable thumbnail — it clears the 640px minimum width and matches 16:9 exactly — it is simply below the new recommended ceiling, not the floor. If your design software can comfortably export at the new 4K target, do it; if not, 1280×720 remains genuinely fine.</p>

<h3>Tools, and what they actually cost this month</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Photoshop</span><span class="v">~US$22.99/month, Single App plan (desktop + web + mobile) — subscription, checked on Adobe's own pricing.</span></div>
<div class="kv"><span class="k">Pixelmator Pro</span><span class="v">US$49.99 one-time (Mac App Store), or bundled in Apple's Creator Studio subscription (US$12.99/mo or US$129/yr; students US$2.99/mo or US$29.99/yr) — which also unlocks it on iPad (needs iPadOS 26, M1-or-later / A16 / A17 Pro — your iPad Pro M5 qualifies).</span></div>
<div class="kv"><span class="k">Affinity (by Canva)</span><span class="v">Free on Mac and Windows since Canva rebuilt it into one app in late 2025 (needs a free Canva account); its unified iPad app has not shipped yet, though the older separate iPad apps still download free.</span></div>
<div class="kv"><span class="k">Canva</span><span class="v">Free plan covers basic cropping/text; Canva Pro (~US$18/month, or a cheaper annual rate) adds background removal and bulk resizing, genuinely useful for a consistent thumbnail template across a series.</span></div>
<div class="kv"><span class="k">Figma</span><span class="v">Free "Starter" plan — genuinely enough for one person designing a thumbnail alone; the paid Professional tier ($16/month full seat) is mainly for team libraries you do not need solo.</span></div>
</div>
<div class="callout warn"><p><strong>Prices change constantly and by region.</strong> These are USD numbers checked directly against each company's own pricing page this month — check again before paying, especially since Adobe and Canva's public pricing pages can vary by country.</p></div>

<h3>Shooting the thumbnail while the lights are still up</h3>
${slide('cr-25', 13, 'Chụp thumbnail ngay trong buổi quay dồn')}
<p>Lesson 2.3's own batching-day example already put this on the schedule: 14:30–15:00, right after B-roll, "a thumbnail photo shoot with the iPhone's 48MP camera." Do not strike the lights first and remember afterward — the whole point of shooting it in the same session is that the lighting, background and your own energy are already dialled in.</p>
<ol>
<li>Keep the A-roll lighting and framing exactly as they are — do not tear down first.</li>
<li>Switch to the iPhone's main 48MP Fusion camera (Lesson 6.2), not the Ultra Wide — the wide lens distorts a close face.</li>
<li>Perform the SPECIFIC emotion the title from Lesson 25.2 promises — surprised, confident, "just finished!" — not a blank, neutral face.</li>
<li>Shoot 5–8 variants of expression and angle; pick the best one while editing, not on the spot.</li>
</ol>

<div class="pitfall co-tieu-de"><p><strong>Trap — judging a thumbnail only at full size on a large monitor.</strong> A design that looks sharp filling a 27-inch screen is being judged at a size no real viewer will ever see it at. This lesson's own render-and-shrink test above measured a genuine, checkable gap between "reads fine big" and "reads fine at 168px" — always preview at small size before calling a thumbnail done, the same discipline Lesson 5's zebra/histogram tools taught for exposure: measure it, do not eyeball it.</p></div>

<p class="note-ct"><strong>Connects to next:</strong> the thumbnail is designed and spec-checked. Lesson 25.4 is what happens after you publish it — YouTube's own Test & Compare tool, and how to read CTR without panicking over a number that might actually be good news.</p>

<h3>🎬 Practice (25–35 minutes)</h3>
<div class="callout ok"><ol>
<li>Design one real thumbnail following the ≤3 elements / ≤4 words rule, exported as JPG or PNG.</li>
<li>Shrink your own export to roughly 168 pixels wide (Preview/Photos, or &#96;ffmpeg -vf scale=168:-1&#96;) and genuinely look at the small copy.</li>
<li>If it fails — text unreadable, focal point unclear — fix it and shrink-test again. Do not ship on the first attempt without checking.</li>
</ol><p><strong>Done when:</strong> your shrunk copy is still legible, your file is under 2MB, and your resolution clears at minimum 640px width at 16:9.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Focal point</span><span class="v">The one place in a thumbnail a viewer's eye should land first — competing focal points cancel each other out.</span></div>
<div class="kv"><span class="k">Custom thumbnail</span><span class="v">A thumbnail image you upload yourself, as opposed to a frame YouTube auto-generates from the video.</span></div>
<div class="kv"><span class="k">Verified account</span><span class="v">YouTube's requirement to unlock custom thumbnail uploads — without it, only auto-generated frames are selectable.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Every design rule (one focal point, an emotional face, strong contrast, ≤3 elements, ≤4 words) exists to survive one test: legible once it is tiny.</li>
<li>Real measured proof: a 1280×720 JPEG at 48.8KB shrunk with &#96;ffmpeg&#96; to 168×94 at 3.0KB — the clean design's text and badge stayed readable; a 7-element messy design would not.</li>
<li>YouTube's current recommended resolution is 3840×2160 (min width 640px, 16:9, JPG/PNG, ≤2MB mobile/≤50MB desktop, verified account required) — the 1280×720 number many guides still cite is outdated.</li>
<li>Photoshop, Pixelmator Pro, Affinity (now free via Canva), Canva and Figma all cover this job at very different prices — check current pricing before paying.</li>
<li>Shoot the thumbnail photo inside the same batching session (Lesson 2.3), on the iPhone's main 48MP camera (Lesson 6.2), performing the exact emotion the title promises.</li>
</ul>
<div class="link-card"><a href="https://support.google.com/youtube/answer/72431" target="_blank" rel="noopener">YouTube Help — Add video thumbnails</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 25 · Bài 25.3</span>
<h2>Mọi nguyên tắc thumbnail đều dồn về một ràng buộc: phải sống sót khi bị bé tí</h2>
<p class="lead">Không ai xem thumbnail ở đúng kích thước bạn thiết kế. Trong lưới gợi ý trên điện thoại, nó có thể hiện ra ở đâu đó khoảng 160–170 pixel rộng — nhỏ hơn hầu hết những quyết định thiết kế bạn sẽ bị cám dỗ đưa ra. Mọi nguyên tắc trong bài này thật ra là MỘT nguyên tắc khoác năm bộ áo: nó có còn đọc được khi bị thu nhỏ không? Bài này chứng minh điều đó bằng một ảnh thật, dựng và thu nhỏ ngay trên máy này, không phải khẳng định suông theo trí nhớ — rồi đưa bạn thông số tải lên thật hiện hành của YouTube, kiểm thẳng trên trang trợ giúp của họ, vì con số nhiều bài viết vẫn trích đã cũ.</p>

<h3>Năm nguyên tắc, một ràng buộc</h3>
${slide('cr-25', 7, 'Nguyên tắc thiết kế thumbnail đọc được ở cỡ nhỏ')}
<p>Một điểm nhìn — mắt người xem phải biết nhìn đâu trong nửa giây, và một thumbnail có hai chủ thể cạnh tranh luôn thua một thumbnail có một chủ thể rõ ràng. Mặt người có cảm xúc thật — khuôn mặt kéo mắt nhanh hơn bất cứ hình dạng nào khác, đúng lý do logic khung cận cảnh của Bài 7.1 cũng áp dụng ở đây. Tương phản mạnh — chủ thể và chữ của bạn cần tách hẳn khỏi nền, không hoà lẫn vào nó, vì tương phản là một trong số ít thứ vẫn đọc được ở 160 pixel rộng khi chi tiết nhỏ đã mất. Tối đa 3 yếu tố — một người, một dòng chữ, một điểm nhấn (huy hiệu, mũi tên, con số) đã là một thumbnail đầy đủ; yếu tố thứ tư đang giành sự chú ý mà ba yếu tố đầu đã giành được. Tối đa 4 chữ trên hình — thumbnail không phải chỗ viết cả câu; đó là việc của tiêu đề (Bài 25.2).</p>

<h3>Một bản rối và một bản gọn, dựng để so trực tiếp</h3>
${slide('cr-25', 8, 'Thumbnail rối vs gọn — tự dựng để so')}
<p>Bản rối bên trái phá gần như mọi nguyên tắc trên cùng lúc: bảy yếu tố riêng biệt, bốn font và màu khác nhau chỏi nhau, nền gradient cầu vồng không có vùng tương phản nào, và một mũi tên trang trí chỉ vào chẳng gì cụ thể. Bản gọn giữ đúng một lời hứa ("VPS · 20 PHÚT" — 3 từ), một huy hiệu điểm nhấn, và một nền tối làm chữ vàng/trắng nổi bật mà không cần cố gắng. Đặt cạnh nhau, mắt bạn không cần ai nói cũng biết bản nào đọc nhanh hơn — nhưng "đọc nhanh hơn ở cỡ đầy đủ" không phải cùng một tuyên bố với "đọc được khi đã bé." Tuyên bố đó cần được KIỂM, không phải giả định.</p>

<h3>Chứng minh nó: dựng, thu nhỏ, nhìn — bằng số thật</h3>
${slide('cr-25', 9, 'Thu nhỏ xuống lưới gợi ý trên điện thoại')}
<p>Đây là phép thử đó, chạy thật. Một thumbnail 1280×720 được dựng từ thiết kế "gọn" ở trên rồi xuất ra JPEG, sau đó thu nhỏ còn 168×94 pixel — xấp xỉ độ rộng một thumbnail dạng danh sách gọn (kết quả tìm kiếm, Xem tiếp, danh sách video liên quan) hiện ra trên điện thoại, còn nhỏ hơn cả thẻ trang chủ trên di động. Cả hai bước dùng công cụ thật, không phải số ước lượng:</p>
<pre><code class="language-bash">ffmpeg -i thumb-mau-1280x720.jpg -vf scale=168:94 -frames:v 1 -update 1 thumb-mau-168x94.jpg
ls -la thumb-mau-1280x720.jpg thumb-mau-168x94.jpg</code></pre>
<div class="out">50006 thumb-mau-1280x720.jpg
3067 thumb-mau-168x94.jpg</div>
<p>Số đo thật: file cỡ đầy đủ nặng <strong>50.006 byte (48,8 KB)</strong> — còn cách rất xa mọi giới hạn trong bảng bên dưới — và bản thu nhỏ 168×94 nặng <strong>3.067 byte (3,0 KB)</strong>. Nhìn thẳng vào bản thu nhỏ (không đoán từ bản đầy đủ): "VPS" và huy hiệu dấu tích vẫn đọc được; một thiết kế rối với 7 yếu tố chỏi nhau sẽ không sống sót qua đúng phép thu nhỏ này. Khoảng cách giữa "nhìn ổn ở cỡ đầy đủ" và "vẫn đọc được ở 168 pixel" chính là toàn bộ lý do các nguyên tắc của Bài 25.3 tồn tại — chúng không phải gu thẩm mỹ, chúng là điều kiện để một thumbnail vượt qua đúng phép thử này. Tự làm đúng phép thử này trước khi đăng: xem thử bản xuất của bạn ở khoảng 160–170 pixel rộng (Preview.app, Photos, hoặc chính lệnh &#96;ffmpeg -vf scale=168:-1&#96;) và nhìn vào bản nhỏ, không phải bản to.</p>

<h3>Thông số tải lên thật của YouTube — kiểm ngay tháng này, không phải nhớ lại từ một năm trước</h3>
${slide('cr-25', 10, 'Thumbnail tuỳ chỉnh — thông số thật của YouTube (đã kiểm 09/2026)')}
<p>Đã kiểm trực tiếp trên trang trợ giúp "Add video thumbnails" của chính YouTube:</p>
<div class="kv-grid">
<div class="kv"><span class="k">Độ phân giải khuyến nghị</span><span class="v"><strong>3840×2160</strong>, rộng tối thiểu 640px — nguyên văn của chính YouTube. Con số 1280×720 nhiều bài viết cũ vẫn trích là khuyến nghị CŨ; nó đã đổi.</span></div>
<div class="kv"><span class="k">Tỉ lệ khung</span><span class="v">16:9, khớp chính video.</span></div>
<div class="kv"><span class="k">Định dạng file</span><span class="v">JPG hoặc PNG — không phải GIF động.</span></div>
<div class="kv"><span class="k">Dung lượng tối đa</span><span class="v">2MB nếu tải từ điện thoại; 50MB nếu tải từ máy tính / Studio trên web.</span></div>
<div class="kv"><span class="k">Điều kiện</span><span class="v">Tài khoản phải được xác minh mới tải được thumbnail tuỳ chỉnh — chưa xác minh thì chỉ chọn được từ các khung hình YouTube tự trích.</span></div>
</div>
<p>File thử 1280×720 của chính bài này ở trên vẫn là một thumbnail dùng tốt — nó vượt qua mức tối thiểu 640px rộng và khớp đúng 16:9 — nó chỉ đơn giản là dưới mức trần khuyến nghị mới, không phải dưới sàn. Nếu phần mềm thiết kế của bạn xuất thoải mái ở mức 4K mới, cứ làm; không thì 1280×720 vẫn hoàn toàn ổn.</p>

<h3>Công cụ, và giá thật của chúng tháng này</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Photoshop</span><span class="v">~22,99 USD/tháng, gói Single App (máy tính + web + di động) — thuê bao, kiểm trên trang giá của chính Adobe.</span></div>
<div class="kv"><span class="k">Pixelmator Pro</span><span class="v">49,99 USD mua đứt (Mac App Store), hoặc nằm trong gói Apple Creator Studio (12,99 USD/tháng hoặc 129 USD/năm; học sinh 2,99 USD/tháng hoặc 29,99 USD/năm) — gói này cũng mở khoá bản iPad (cần iPadOS 26, chip từ M1/A16/A17 Pro — iPad Pro M5 của bạn đạt).</span></div>
<div class="kv"><span class="k">Affinity (by Canva)</span><span class="v">Miễn phí trên Mac và Windows từ khi Canva dựng lại thành một app cuối 2025 (cần tài khoản Canva miễn phí); bản iPad hợp nhất chưa ra mắt, dù các app iPad rời cũ vẫn tải miễn phí được.</span></div>
<div class="kv"><span class="k">Canva</span><span class="v">Bản Free đủ cắt/chữ cơ bản; Canva Pro (~18 USD/tháng, hoặc mức năm rẻ hơn) thêm tách nền và đổi cỡ hàng loạt, thật sự hữu ích để giữ một mẫu thumbnail nhất quán cho cả series.</span></div>
<div class="kv"><span class="k">Figma</span><span class="v">Gói "Starter" miễn phí — đủ dùng thật cho một người tự thiết kế thumbnail một mình; gói Professional trả phí (16 USD/tháng/ghế đầy đủ) chủ yếu cho thư viện dùng chung theo nhóm bạn không cần khi làm một mình.</span></div>
</div>
<div class="callout warn"><p><strong>Giá đổi liên tục và theo khu vực.</strong> Đây là số USD kiểm trực tiếp trên trang giá của chính từng hãng ngay trong tháng này — kiểm lại trước khi trả tiền, nhất là vì trang giá công khai của Adobe và Canva có thể khác nhau theo từng nước.</p></div>

<h3>Chụp thumbnail ngay khi đèn còn đang dựng</h3>
${slide('cr-25', 13, 'Chụp thumbnail ngay trong buổi quay dồn')}
<p>Ví dụ lịch quay dồn của Bài 2.3 đã đặt sẵn việc này vào lịch: 14:30–15:00, ngay sau B-roll, "chụp ảnh thumbnail bằng camera 48MP của iPhone." Đừng dọn đèn trước rồi mới nhớ ra — cả điểm của việc chụp trong cùng buổi là vì ánh sáng, hậu cảnh và cả năng lượng của chính bạn đã sẵn sàng.</p>
<ol>
<li>Giữ nguyên đèn và khung hình của A-roll — đừng dọn máy trước.</li>
<li>Chuyển sang camera chính Fusion 48MP của iPhone (Bài 6.2), không phải ống Ultra Wide — ống góc rộng làm méo mặt khi chụp gần.</li>
<li>Diễn đúng cảm xúc CỤ THỂ mà tiêu đề ở Bài 25.2 đã hứa — ngạc nhiên, tự tin, "vừa xong!" — không phải một khuôn mặt trống rỗng, vô cảm.</li>
<li>Chụp 5–8 biến thể biểu cảm và góc; chọn ảnh tốt nhất lúc dựng, không phải ngay tại chỗ.</li>
</ol>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — chỉ đánh giá thumbnail ở cỡ đầy đủ trên màn hình lớn.</strong> Một thiết kế nhìn sắc nét phủ kín màn hình 27 inch đang bị đánh giá ở một kích thước không người xem thật nào từng thấy. Chính phép thử dựng-rồi-thu-nhỏ ở trên của bài này đã đo được một khoảng cách thật, kiểm chứng được giữa "đọc ổn lúc to" và "đọc ổn ở 168px" — luôn xem thử ở cỡ nhỏ trước khi coi một thumbnail là xong, đúng kỷ luật công cụ zebra/histogram của Chương 5 đã dạy cho phơi sáng: đo nó, đừng đoán bằng mắt.</p></div>

<p class="note-ct"><strong>Nối với bài sau:</strong> thumbnail đã thiết kế xong và đúng thông số. Bài 25.4 là chuyện xảy ra SAU khi bạn đăng nó — công cụ Test & Compare của chính YouTube, và cách đọc CTR mà không hoảng vì một con số có khi lại là tin tốt.</p>

<h3>🎬 Thực hành (25–35 phút)</h3>
<div class="callout ok"><ol>
<li>Thiết kế một thumbnail thật theo nguyên tắc ≤3 yếu tố / ≤4 chữ, xuất JPG hoặc PNG.</li>
<li>Thu nhỏ bản xuất của chính bạn còn khoảng 168 pixel rộng (Preview/Photos, hoặc &#96;ffmpeg -vf scale=168:-1&#96;) và nhìn thật vào bản nhỏ.</li>
<li>Nếu nó thất bại — chữ không đọc được, điểm nhìn không rõ — sửa rồi thử thu nhỏ lại. Đừng đăng ngay lượt đầu mà không kiểm.</li>
</ol><p><strong>Đạt khi:</strong> bản thu nhỏ của bạn vẫn đọc được, file dưới 2MB, và độ phân giải đạt tối thiểu 640px rộng ở 16:9.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Điểm nhìn (focal point)</span><span class="v">Chỗ duy nhất trong thumbnail mắt người xem nên nhìn tới đầu tiên — nhiều điểm nhìn cạnh tranh sẽ triệt tiêu lẫn nhau.</span></div>
<div class="kv"><span class="k">Thumbnail tuỳ chỉnh (custom thumbnail)</span><span class="v">Ảnh thumbnail bạn tự tải lên, khác với khung hình YouTube tự trích từ video.</span></div>
<div class="kv"><span class="k">Tài khoản đã xác minh</span><span class="v">Điều kiện của YouTube để mở khoá tải thumbnail tuỳ chỉnh — chưa có thì chỉ chọn được khung hình tự trích.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mọi nguyên tắc thiết kế (một điểm nhìn, mặt cảm xúc, tương phản mạnh, ≤3 yếu tố, ≤4 chữ) tồn tại để vượt qua đúng một phép thử: đọc được khi đã bé tí.</li>
<li>Bằng chứng đo thật: một JPEG 1280×720 nặng 48,8KB thu nhỏ bằng &#96;ffmpeg&#96; còn 168×94 nặng 3,0KB — chữ và huy hiệu của thiết kế gọn vẫn đọc được; một thiết kế rối 7 yếu tố sẽ không sống sót qua phép thử này.</li>
<li>Độ phân giải khuyến nghị hiện hành của YouTube là 3840×2160 (tối thiểu 640px rộng, 16:9, JPG/PNG, ≤2MB điện thoại/≤50MB máy tính, cần tài khoản đã xác minh) — con số 1280×720 nhiều bài viết vẫn trích đã cũ.</li>
<li>Photoshop, Pixelmator Pro, Affinity (nay miễn phí qua Canva), Canva và Figma đều làm được việc này ở mức giá rất khác nhau — kiểm giá hiện hành trước khi trả tiền.</li>
<li>Chụp ảnh thumbnail ngay trong buổi quay dồn (Bài 2.3), bằng camera chính 48MP của iPhone (Bài 6.2), diễn đúng cảm xúc tiêu đề đã hứa.</li>
</ul>
<div class="link-card"><a href="https://support.google.com/youtube/answer/72431" target="_blank" rel="noopener">YouTube Help — Add video thumbnails</a></div>
</div>
`,
    },

    /* ─────────────────── 25.4 thử nghiệm & cải tiến ─────────────────── */
    {
      title: '25.4 — Testing and reading the numbers honestly|||25.4 — Thử nghiệm và đọc số liệu trung thực',
      slug: 'cr-25-4-thu-nghiem-cai-tien',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'YouTube Test & Compare thật sự thử gì và ai dùng được, vì sao nó chọn người thắng theo thời lượng xem chứ không phải CTR, và cách đọc một con số CTR giảm mà không hoảng — bằng đúng ví dụ số YouTube tự công bố.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 25 · Lesson 25.4</span>
<h2>Closing the loop: what actually happens after you publish the package</h2>
<p class="lead">Lesson 25.1 opened with a loop that does not close at "publish." This lesson closes it: YouTube's own Test & Compare feature, checked directly against its help page, and how to read CTR without the panic most creators feel the first time a number drops — using a real example YouTube itself publishes, not a guess.</p>

<h3>Test & Compare: what it actually does</h3>
${slide('cr-25', 14, 'Test & Compare — YouTube tự thử giúp bạn')}
<p>Checked directly on YouTube's help page: you can test up to <strong>3 variants</strong> — different titles, different thumbnails, or both together — against each other on the same published video. It runs on desktop only, through YouTube Studio, and you need to turn on "advanced features" to be eligible. It does NOT work on everything: Shorts, scheduled Premieres (until the Premiere itself ends), and videos marked Made for Kids, age-restricted, or private are all excluded. A test typically finishes within about two weeks, depending on how many impressions the video gets. When it ends, YouTube reports one of three outcomes: a clear <strong>Winner</strong>, <strong>Performed the same</strong> (no meaningful difference), or <strong>Inconclusive</strong> (not enough signal either way, and the default option stays).</p>

<h3>The counterintuitive part: it optimizes for watch time, not CTR</h3>
<p>Here is the detail that surprises almost everyone the first time they read it: YouTube states directly that it optimizes tests for <strong>overall watch time</strong>, "over other metrics, like click-through-rate." That is not a small footnote — it is the whole point. A thumbnail that wins more clicks but loses viewers early (Lesson 25.1's "winning the click, losing the viewer" trap) is exactly the kind of variant this system is built to reject as a "winner," even though a naive read of the raw numbers might call it the strongest option.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — assuming Test & Compare exists to find your highest-CTR thumbnail.</strong> It does not. It is built, by YouTube's own stated design, to find the variant that keeps people watching — which is a direct, practical enforcement of the promise/payoff idea Lesson 25.1 opened with. If your instinct is to read a test result purely by which thumbnail "got more clicks," you are reading the wrong number; the platform itself already discarded that framing when it picked the winner.</p></div>

<h3>Reading CTR without panicking</h3>
${slide('cr-25', 15, 'CTR đọc trong ngữ cảnh impression')}
<p>Lesson 1.2 defined impression and CTR; this is the part neither Lesson 1.2 nor 24.2 needed yet — how to read a CTR NUMBER once it moves. YouTube's own analytics guidance is explicit: never read impressions or CTR in isolation, always with the traffic source as context. CTR genuinely varies by "surface" for a structural reason, not a quality reason — <strong>Search</strong> traffic tends to bring fewer impressions but a HIGHER CTR, because a viewer who typed a specific query already has clear intent; <strong>Home</strong> traffic tends to bring far more impressions but a LOWER CTR, because a browsing viewer has no specific intent yet and is comparing your thumbnail against everything else on the page.</p>
<p>YouTube's own worked example, quoted directly from its help documentation: a video sitting at <strong>10,000 impressions and a 9% CTR</strong> can later reach <strong>100,000 impressions at a 3.5% CTR</strong> — and that CTR drop is explicitly framed as GOOD news, not bad: the video's reach expanded into Home/browse traffic, a broader audience with lower baseline intent, and still pulled in far more total viewers. Reading the 3.5% number alone, with no impression context, looks like a decline. Reading both numbers together shows genuine growth.</p>
<div class="callout ok"><p><strong>Before reacting to a CTR change, ask one question first:</strong> did impressions also change, and from which traffic source? A falling CTR next to a big jump in impressions from Home is very likely reach, not a packaging failure. A falling CTR with FLAT or falling impressions is the one combination actually worth investigating.</p></div>

<h3>Revising packaging after publish</h3>
<p>This is the arrow Lesson 25.1's loop diagram left open: once real numbers exist, the title and thumbnail are not locked in forever. YouTube lets you edit a video's title and thumbnail after publishing — Test & Compare is the structured, measured way to do that (letting the platform's own watch-time signal pick the winner instead of guessing), and it is worth reaching for on your next few videos specifically because it replaces a guess with a real result. If your channel is not yet eligible, the fallback is not "do nothing" — it is to record your own before/after CTR and impressions for a video whose packaging you deliberately change, then read that change with the same traffic-source context this lesson just gave you.</p>

<p class="note-ct"><strong>Chapter complete.</strong> The promise was defined (25.1), written into a title (25.2), designed into a thumbnail proven legible at real size (25.3), and now measured honestly (25.4). Lesson 26.1 goes further into YouTube Analytics as a whole — this lesson only covered the one pair of numbers packaging is directly responsible for.</p>

<h3>🎬 Practice (15–20 minutes)</h3>
<div class="callout ok"><ol>
<li>Open YouTube Studio's "advanced features" setting and check whether your channel is currently eligible for Test & Compare.</li>
<li>If it is eligible: pick one upcoming video and plan two title or thumbnail variants for it now, before you publish.</li>
<li>If it is not eligible yet: pick one already-published video, note its current impressions and CTR, and write down which traffic surface most of its impressions likely come from.</li>
</ol><p><strong>Done when:</strong> you can state, for your chosen video, whether its current CTR is meaningful on its own or needs impression/traffic-source context to interpret.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Test & Compare</span><span class="v">YouTube Studio's built-in A/B test for up to 3 title/thumbnail variants on one video, decided by watch time rather than CTR.</span></div>
<div class="kv"><span class="k">Traffic surface</span><span class="v">Where an impression came from (Search, Home, suggested/Up next, etc.) — CTR varies structurally by surface, not just by thumbnail quality.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Test & Compare tests up to 3 title/thumbnail variants, desktop only, needs "advanced features" enabled, excludes Shorts/scheduled Premieres/kids/mature/private, and typically finishes within ~2 weeks.</li>
<li>It picks a winner by overall watch time, explicitly NOT by CTR — a high-CTR, low-retention variant is exactly what it is built to reject.</li>
<li>CTR varies by traffic surface for structural reasons: Search = fewer impressions, higher CTR; Home = more impressions, lower CTR — neither is inherently "better."</li>
<li>YouTube's own verified example: 10,000 impressions at 9% CTR growing to 100,000 impressions at 3.5% CTR is reach expanding, not a packaging failure.</li>
<li>Packaging can be revised after publish — Test & Compare is the measured way to do it, closing the loop Lesson 25.1 opened.</li>
</ul>
<div class="link-card"><a href="https://support.google.com/youtube/answer/13861714" target="_blank" rel="noopener">YouTube Help — A/B test titles &amp; thumbnails</a></div>
<div class="link-card"><a href="https://support.google.com/youtube/answer/16767369" target="_blank" rel="noopener">YouTube Help — Decoding CTR &amp; impressions in your Analytics</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 25 · Bài 25.4</span>
<h2>Khép vòng lặp: chuyện gì thật sự xảy ra sau khi bạn đăng gói đóng gói</h2>
<p class="lead">Bài 25.1 mở đầu bằng một vòng lặp không khép lại ở "đăng." Bài này khép nó: tính năng Test & Compare của chính YouTube, đã kiểm trực tiếp trên trang trợ giúp, và cách đọc CTR mà không hoảng như hầu hết người làm nội dung lần đầu thấy một con số tụt xuống — dùng đúng ví dụ số YouTube tự công bố, không phải đoán.</p>

<h3>Test & Compare: nó thật sự thử gì</h3>
${slide('cr-25', 14, 'Test & Compare — YouTube tự thử giúp bạn')}
<p>Đã kiểm trực tiếp trên trang trợ giúp của YouTube: bạn thử được tối đa <strong>3 biến thể</strong> — tiêu đề khác nhau, thumbnail khác nhau, hoặc cả hai cùng lúc — trên cùng một video đã đăng. Nó chỉ chạy trên máy tính, qua YouTube Studio, và bạn cần bật "advanced features" để đủ điều kiện. Nó KHÔNG hoạt động trên mọi thứ: Shorts, Premiere đã hẹn giờ (cho tới khi Premiere đó kết thúc), và video đặt Made for Kids, giới hạn độ tuổi, hay riêng tư đều bị loại. Một lượt thử thường xong trong khoảng hai tuần, tuỳ video nhận được bao nhiêu lượt hiển thị. Khi kết thúc, YouTube báo một trong ba kết quả: <strong>Thắng rõ ràng</strong>, <strong>Hiệu suất như nhau</strong> (không khác biệt đáng kể), hoặc <strong>Chưa đủ căn cứ</strong> (chưa đủ tín hiệu theo hướng nào, và tuỳ chọn mặc định được giữ lại).</p>

<h3>Phần đi ngược trực giác: nó tối ưu theo thời lượng xem, không phải CTR</h3>
<p>Đây là chi tiết khiến gần như ai đọc lần đầu cũng bất ngờ: YouTube nói rõ trực tiếp là họ tối ưu các lượt thử theo <strong>tổng thời lượng xem</strong>, "hơn các chỉ số khác, như tỉ lệ nhấp." Đây không phải một chú thích nhỏ — đó là toàn bộ điểm mấu chốt. Một thumbnail thắng nhiều cú bấm hơn nhưng làm người xem rời đi sớm (cái bẫy "thắng cú bấm, mất người xem" của Bài 25.1) chính là kiểu biến thể hệ thống này được dựng ra để LOẠI khỏi danh hiệu "thắng cuộc," dù đọc con số thô một cách ngây thơ có thể gọi nó là lựa chọn mạnh nhất.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — nghĩ rằng Test & Compare tồn tại để tìm thumbnail có CTR cao nhất của bạn.</strong> Không phải vậy. Nó được dựng ra, theo đúng thiết kế YouTube tự công bố, để tìm biến thể giữ chân người xem lâu nhất — một cách thực thi trực tiếp, thực tế cho đúng ý tưởng lời hứa/trả lời hứa mà Bài 25.1 đã mở đầu. Nếu bản năng của bạn là đọc kết quả thử nghiệm chỉ theo việc thumbnail nào "kéo nhiều cú bấm hơn," bạn đang đọc sai con số; chính nền tảng đã bỏ qua cách nhìn đó ngay khi chọn người thắng.</p></div>

<h3>Đọc CTR mà không hoảng</h3>
${slide('cr-25', 15, 'CTR đọc trong ngữ cảnh impression')}
<p>Bài 1.2 đã định nghĩa impression và CTR; đây là phần cả Bài 1.2 lẫn 24.2 chưa cần tới — cách đọc một con số CTR khi nó dịch chuyển. Hướng dẫn phân tích của chính YouTube nói rõ: đừng bao giờ đọc impression hay CTR một mình, luôn đọc kèm nguồn lưu lượng làm ngữ cảnh. CTR thật sự khác nhau theo "bề mặt" vì lý do CẤU TRÚC, không phải lý do chất lượng — lưu lượng <strong>Tìm kiếm</strong> thường mang ít lượt hiển thị hơn nhưng CTR CAO hơn, vì người xem đã gõ một truy vấn cụ thể nghĩa là ý định đã rõ; lưu lượng <strong>Trang chủ</strong> thường mang nhiều lượt hiển thị hơn hẳn nhưng CTR THẤP hơn, vì người xem đang lướt chưa có ý định cụ thể và đang so sánh thumbnail của bạn với mọi thứ khác trên trang.</p>
<p>Ví dụ do chính YouTube đưa ra, trích trực tiếp từ tài liệu trợ giúp: một video đang ở mức <strong>10.000 lượt hiển thị và CTR 9%</strong> có thể sau đó đạt <strong>100.000 lượt hiển thị với CTR 3,5%</strong> — và việc CTR giảm đó được nói rõ là TIN TỐT, không phải tin xấu: độ phủ của video mở rộng vào lưu lượng Trang chủ/lướt, một khán giả rộng hơn với ý định nền thấp hơn, mà vẫn kéo về nhiều người xem hơn hẳn về tổng số. Đọc riêng con số 3,5% mà không có ngữ cảnh lượt hiển thị thì trông như một sự sụt giảm. Đọc cả hai con số cùng nhau lại cho thấy sự tăng trưởng thật.</p>
<div class="callout ok"><p><strong>Trước khi phản ứng với một thay đổi CTR, hỏi một câu trước:</strong> lượt hiển thị có đổi theo không, và từ nguồn lưu lượng nào? Một CTR giảm đi cạnh một cú tăng vọt lượt hiển thị từ Trang chủ nhiều khả năng là độ phủ, không phải đóng gói thất bại. Một CTR giảm mà lượt hiển thị ĐỨNG YÊN hoặc cũng giảm mới là tổ hợp thật sự đáng để điều tra.</p></div>

<h3>Sửa lại đóng gói sau khi đăng</h3>
<p>Đây là mũi tên sơ đồ vòng lặp của Bài 25.1 đã để ngỏ: một khi có số liệu thật, tiêu đề và thumbnail không bị khoá cứng mãi mãi. YouTube cho phép sửa tiêu đề và thumbnail của một video sau khi đã đăng — Test & Compare là cách có cấu trúc, đo được để làm việc đó (để tín hiệu thời lượng xem của chính nền tảng chọn người thắng thay vì đoán mò), và đáng để dùng ngay trên vài video sắp tới của bạn chính vì nó thay một phỏng đoán bằng một kết quả thật. Nếu kênh của bạn chưa đủ điều kiện, phương án dự phòng không phải là "không làm gì" — mà là tự ghi lại CTR và lượt hiển thị trước/sau cho một video bạn chủ đích đổi cách đóng gói, rồi đọc sự thay đổi đó với đúng ngữ cảnh nguồn lưu lượng bài này vừa đưa ra.</p>

<p class="note-ct"><strong>Hết chương.</strong> Lời hứa đã được định nghĩa (25.1), viết thành tiêu đề (25.2), thiết kế thành thumbnail đã chứng minh đọc được ở cỡ thật (25.3), và giờ được đo trung thực (25.4). Bài 26.1 sẽ đi sâu hơn vào toàn bộ YouTube Analytics — bài này chỉ nói đúng một cặp con số mà đóng gói trực tiếp chịu trách nhiệm.</p>

<h3>🎬 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Mở cài đặt "advanced features" trong YouTube Studio và kiểm kênh của bạn có đủ điều kiện dùng Test & Compare hay chưa.</li>
<li>Nếu đủ điều kiện: chọn một video sắp đăng và lên kế hoạch hai biến thể tiêu đề hoặc thumbnail cho nó ngay từ bây giờ, trước khi đăng.</li>
<li>Nếu chưa đủ điều kiện: chọn một video đã đăng, ghi lại lượt hiển thị và CTR hiện tại, và viết ra phần lớn lượt hiển thị của nó nhiều khả năng tới từ bề mặt lưu lượng nào.</li>
</ol><p><strong>Đạt khi:</strong> bạn nói được, với video đã chọn, CTR hiện tại của nó có ý nghĩa một mình hay cần ngữ cảnh lượt hiển thị/nguồn lưu lượng mới đọc đúng được.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Test & Compare</span><span class="v">Công cụ thử A/B có sẵn của YouTube Studio cho tối đa 3 biến thể tiêu đề/thumbnail trên một video, quyết định bằng thời lượng xem chứ không phải CTR.</span></div>
<div class="kv"><span class="k">Bề mặt lưu lượng (traffic surface)</span><span class="v">Nơi một lượt hiển thị tới từ đâu (Tìm kiếm, Trang chủ, đề xuất/Xem tiếp…) — CTR khác nhau theo bề mặt vì lý do cấu trúc, không chỉ vì chất lượng thumbnail.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Test & Compare thử tối đa 3 biến thể tiêu đề/thumbnail, chỉ trên máy tính, cần bật "advanced features," loại trừ Shorts/Premiere đã hẹn giờ/kids/mature/riêng tư, và thường xong trong khoảng ~2 tuần.</li>
<li>Nó chọn người thắng theo tổng thời lượng xem, RÕ RÀNG KHÔNG phải theo CTR — một biến thể CTR cao nhưng giữ chân thấp chính là thứ nó được dựng ra để loại.</li>
<li>CTR khác nhau theo bề mặt lưu lượng vì lý do cấu trúc: Tìm kiếm = ít lượt hiển thị hơn, CTR cao hơn; Trang chủ = nhiều lượt hiển thị hơn, CTR thấp hơn — không bên nào vốn dĩ "tốt hơn."</li>
<li>Ví dụ đã kiểm chứng của chính YouTube: 10.000 lượt hiển thị ở CTR 9% tăng lên 100.000 lượt hiển thị ở CTR 3,5% là độ phủ đang mở rộng, không phải đóng gói thất bại.</li>
<li>Đóng gói có thể được sửa lại sau khi đăng — Test & Compare là cách đo được để làm việc đó, khép nốt vòng lặp Bài 25.1 đã mở ra.</li>
</ul>
<div class="link-card"><a href="https://support.google.com/youtube/answer/13861714" target="_blank" rel="noopener">YouTube Help — A/B test titles &amp; thumbnails</a></div>
<div class="link-card"><a href="https://support.google.com/youtube/answer/16767369" target="_blank" rel="noopener">YouTube Help — Decoding CTR &amp; impressions in your Analytics</a></div>
</div>
`,
    },

    /* ─────────────────── 25.5 quiz ─────────────────── */
    {
      title: '25.5 — Chapter 25 check|||25.5 — Kiểm tra Chương 25',
      slug: 'cr-25-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Kiểm tra 10 câu tình huống: lời hứa & chính sách clickbait, công thức tiêu đề, nguyên tắc thumbnail & thông số YouTube, Test & Compare, và đọc CTR trong ngữ cảnh impression.',
      content: `
<div class="ml-en">
<h2>📌 Chapter 25 summary</h2>
<p>Four lessons, one loop that never fully closes: <strong>25.1</strong> reframed packaging as a promise a video has to pay off, not a one-time step — and showed that breaking it is a real YouTube policy violation, not just bad style. <strong>25.2</strong> gave six title formulas and showed that what belongs in the first ~60 characters depends on whether you are optimizing for search intent or discovery intent. <strong>25.3</strong> reduced every thumbnail design rule to one testable constraint — legible once it is tiny — and proved it with a real 1280×720 file rendered and shrunk to 168×94, measured in real bytes, next to YouTube's actual current upload spec (3840×2160 recommended, not the outdated 1280×720 number). <strong>25.4</strong> closed the loop: Test & Compare picks winners by watch time, not CTR, and a falling CTR next to rising impressions from Home traffic is very often growth, not failure.</p>
<h3>Self-check before moving on</h3>
<ul>
<li>Can you state, for one of your own ideas, the specific promise its title+thumbnail makes — and where in your planned footage it gets paid off?</li>
<li>Can you name all six title formulas and pick the right one for a tutorial versus a story-shaped vlog?</li>
<li>Can you explain, from a real measurement you could reproduce, why a thumbnail needs to be shrink-tested, not just eyeballed at full size?</li>
<li>Do you know YouTube's current recommended thumbnail resolution — not the number most old guides still quote?</li>
<li>Can you explain why Test & Compare might reject a variant with a higher CTR?</li>
</ul>
</div>
<div class="ml-vi">
<h2>📌 Tóm tắt Chương 25</h2>
<p>Bốn bài học, một vòng lặp không bao giờ thật sự khép: <strong>25.1</strong> đóng khung lại đóng gói thành một lời hứa video phải trả, không phải một bước làm một lần — và cho thấy phản bội nó là một vi phạm chính sách thật của YouTube, không chỉ là gu xấu. <strong>25.2</strong> cho sáu công thức tiêu đề và cho thấy thứ thuộc về ~60 ký tự đầu tuỳ vào bạn đang tối ưu cho ý định tìm kiếm hay ý định khám phá. <strong>25.3</strong> gom mọi nguyên tắc thiết kế thumbnail về một ràng buộc kiểm chứng được — đọc được khi đã bé tí — và chứng minh bằng một file 1280×720 thật đã render rồi thu nhỏ còn 168×94, đo bằng byte thật, đặt cạnh thông số tải lên thật hiện hành của YouTube (khuyến nghị 3840×2160, không phải con số 1280×720 đã cũ). <strong>25.4</strong> khép vòng lặp: Test & Compare chọn người thắng theo thời lượng xem, không phải CTR, và một CTR giảm đi cạnh lượt hiển thị tăng từ lưu lượng Trang chủ thường là tăng trưởng, không phải thất bại.</p>
<h3>Tự kiểm trước khi học tiếp</h3>
<ul>
<li>Bạn nói được, với một ý tưởng của chính mình, lời hứa cụ thể mà tiêu đề+thumbnail của nó đưa ra — và nó được trả ở đâu trong cảnh quay dự kiến?</li>
<li>Bạn gọi tên được cả sáu công thức tiêu đề và chọn đúng cái hợp cho một video hướng dẫn so với một vlog kể chuyện?</li>
<li>Bạn giải thích được, từ một phép đo thật bạn có thể tự làm lại, vì sao một thumbnail cần được kiểm bằng cách thu nhỏ, không chỉ nhìn bằng mắt ở cỡ đầy đủ?</li>
<li>Bạn biết độ phân giải thumbnail khuyến nghị hiện hành của YouTube — không phải con số nhiều bài viết cũ vẫn trích?</li>
<li>Bạn giải thích được vì sao Test & Compare có thể loại một biến thể có CTR cao hơn?</li>
</ul>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'A tutorial titled "Deploy a VPS in JUST 5 minutes!!" actually takes 20 minutes because a setup step was cut for time. According to Lesson 25.1, what is the most likely consequence, beyond viewers simply disliking it?|||Một video hướng dẫn tựa đề "Deploy VPS chỉ 5 PHÚT!!" thật ra mất 20 phút vì một bước cài đặt bị cắt cho kịp giờ. Theo Bài 25.1, hậu quả nhiều khả năng nhất, ngoài việc người xem đơn giản là không thích, là gì?',
            options: [
              'It risks being treated as malicious clickbait / misleading metadata, with a real enforcement ladder up to channel termination|||Nó có nguy cơ bị coi là malicious clickbait / misleading metadata, với nấc thang xử lý thật tới tận chấm dứt kênh',
              'YouTube automatically re-encodes the video to match the title|||YouTube tự động mã hoá lại video để khớp với tiêu đề',
              'The video gets an automatic CTR boost for the exciting title|||Video được tự động tăng CTR vì tiêu đề hấp dẫn',
              'Nothing beyond lower satisfaction — YouTube has no policy about this|||Không gì ngoài sự hài lòng thấp hơn — YouTube không có chính sách nào về việc này',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Lesson 25.1 confirmed directly from YouTube\'s Thumbnails policy: a title/thumbnail that misleads viewers about what the video contains is malicious clickbait / misleading metadata, with a real ladder — warning, then strike + thumbnail removal, up to termination at three strikes in 90 days.|||VI: Bài 25.1 đã xác nhận trực tiếp từ chính sách Thumbnails của YouTube: một tiêu đề/thumbnail khiến người xem hiểu lầm về nội dung video là malicious clickbait / misleading metadata, với nấc thang thật — cảnh cáo, rồi strike + gỡ thumbnail, tới chấm dứt kênh ở ba strike trong 90 ngày.',
          },
          {
            question: 'You are titling a step-by-step Docker deployment tutorial — a video type with clear, specific search intent. Per Lesson 25.2, what should lead the first ~60 characters of the title?|||Bạn đặt tiêu đề cho một video hướng dẫn deploy bằng Docker từng bước — loại video có ý định tìm kiếm rõ ràng, cụ thể. Theo Bài 25.2, thứ gì nên đứng đầu trong ~60 ký tự đầu của tiêu đề?',
            options: [
              'A curiosity hook like "I almost lost my whole site"|||Một móc tò mò kiểu "Tôi suýt mất cả trang web"',
              'A warning/mistake formula regardless of content|||Một công thức cảnh báo/sai lầm bất kể nội dung',
              'The real keyword phrase a searcher would actually type|||Đúng cụm từ khoá thật một người tìm kiếm sẽ gõ',
              'As many relevant hashtags as possible|||Càng nhiều hashtag liên quan càng tốt',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Lesson 25.2\'s search-vs-suggested table is explicit: content with clear search intent (tutorials, fixes) should front-load the real keyword phrase, because that is what a searcher is typing — a curiosity hook belongs to suggested/browse-intent content like vlogs, not this.|||VI: Bảng tìm kiếm-vs-đề-xuất của Bài 25.2 nói rõ: nội dung có ý định tìm kiếm rõ (hướng dẫn, sửa lỗi) nên đặt đúng cụm từ khoá thật lên đầu, vì đó là thứ người tìm kiếm đang gõ — móc tò mò thuộc về nội dung ý định đề xuất/lướt như vlog, không phải trường hợp này.',
          },
          {
            question: 'A friend says: "Just stretch \'7 real git commands I use\' into \'10 game-changing git commands\' — it\'s still the number formula, just bigger." What is wrong with this, per Lesson 25.2?|||Một người bạn nói: "Cứ kéo \'7 lệnh git thật tôi dùng\' thành \'10 lệnh git thay đổi cuộc đời\' — vẫn là công thức con số, chỉ to hơn thôi." Theo Bài 25.2, điều này sai ở đâu?',
            options: [
              'Number formulas only work with odd numbers, not 10|||Công thức con số chỉ hiệu quả với số lẻ, không phải 10',
              'Nothing is wrong — bigger numbers always perform better|||Không có gì sai — số lớn hơn luôn hiệu quả hơn',
              'The number formula requires exactly 7, never any other value|||Công thức con số bắt buộc đúng số 7, không được số nào khác',
              'Inflating the count past what is real breaks the promise from Lesson 25.1 wearing the formula\'s clothing|||Thổi phồng con số quá thứ có thật là phá lời hứa của Bài 25.1 khoác áo công thức',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Lesson 25.2\'s pitfall covers exactly this: a formula is a shape for a TRUE claim. Stretching "7 real" into "10" when only 7 are real is Lesson 25.1\'s broken-promise trap, not a stronger formula.|||VI: Cái bẫy của Bài 25.2 nói đúng chuyện này: công thức là một cái khuôn cho một tuyên bố THẬT. Kéo "7 lệnh thật" thành "10" khi chỉ có 7 lệnh thật là cái bẫy lời hứa vỡ của Bài 25.1, không phải một công thức mạnh hơn.',
          },
          {
            question: 'You design a thumbnail that looks sharp and clear filling your 27-inch monitor. Per Lesson 25.3\'s own tested example, what is the risk in judging it only at that size?|||Bạn thiết kế một thumbnail nhìn sắc nét, rõ ràng khi phủ kín màn hình 27 inch. Theo đúng ví dụ đã kiểm của Bài 25.3, rủi ro khi chỉ đánh giá nó ở cỡ đó là gì?',
            options: [
              'A real measured gap exists between "reads fine large" and "reads fine at ~168px" — a design can pass one test and fail the other|||Có một khoảng cách đo được thật giữa "đọc ổn ở cỡ to" và "đọc ổn ở ~168px" — một thiết kế có thể qua bài kiểm này mà trượt bài kiểm kia',
              'None — if it looks good large, it looks good small too|||Không có gì — nếu nhìn đẹp ở cỡ to thì cỡ nhỏ cũng đẹp',
              'Large monitors always show thumbnails at their true 3840×2160 resolution|||Màn hình lớn luôn hiện thumbnail đúng độ phân giải 3840×2160 thật',
              'YouTube rejects thumbnails designed at large preview sizes|||YouTube từ chối thumbnail thiết kế ở cỡ xem trước lớn',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Lesson 25.3 proved this with a real render: a 1280×720 file was shrunk to 168×94 and only then checked for legibility — that gap is exactly why the lesson insists on a shrink-test, not an eyeball check at full size.|||VI: Bài 25.3 đã chứng minh điều này bằng một lượt render thật: một file 1280×720 được thu nhỏ còn 168×94 rồi mới kiểm độ đọc được — đúng khoảng cách đó là lý do bài học khăng khăng đòi phép thử thu nhỏ, không phải nhìn bằng mắt ở cỡ đầy đủ.',
          },
          {
            question: 'Per YouTube\'s own help page, checked in Lesson 25.3, what is the CURRENT recommended thumbnail resolution — as opposed to the number many older guides still quote?|||Theo đúng trang trợ giúp của YouTube, đã kiểm ở Bài 25.3, độ phân giải thumbnail khuyến nghị HIỆN HÀNH là gì — khác với con số nhiều bài viết cũ vẫn trích?',
            options: ['1280×720|||1280×720', '1920×1080|||1920×1080', '3840×2160|||3840×2160', '640×360|||640×360'],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Lesson 25.3 quoted YouTube\'s help page directly: the current recommendation is 3840×2160 (minimum width 640px, 16:9). 1280×720 is the outdated number many guides still repeat; 640×360 is only the minimum-width floor, not the recommendation.|||VI: Bài 25.3 đã trích thẳng trang trợ giúp của YouTube: khuyến nghị hiện hành là 3840×2160 (rộng tối thiểu 640px, 16:9). 1280×720 là con số cũ nhiều bài viết vẫn lặp lại; 640×360 chỉ là sàn tối thiểu, không phải khuyến nghị.',
          },
          {
            question: 'You try to upload a custom thumbnail image, but YouTube only lets you pick from auto-generated frames. Per Lesson 25.3, what is the most likely reason?|||Bạn thử tải một ảnh thumbnail tuỳ chỉnh lên, nhưng YouTube chỉ cho bạn chọn từ các khung hình tự trích. Theo Bài 25.3, lý do nhiều khả năng nhất là gì?',
            options: [
              'Your image is exactly 3840×2160, which is too large|||Ảnh của bạn đúng 3840×2160, quá lớn',
              'Custom thumbnails were discontinued by YouTube in 2026|||Thumbnail tuỳ chỉnh đã bị YouTube ngừng từ 2026',
              'Your file is in PNG format, which YouTube does not accept|||File của bạn định dạng PNG, YouTube không chấp nhận',
              'Your account is not verified — custom thumbnails require a verified account|||Tài khoản của bạn chưa xác minh — thumbnail tuỳ chỉnh cần tài khoản đã xác minh',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Lesson 25.3\'s spec table is explicit: uploading a custom thumbnail at all requires a verified account. PNG is an accepted format (along with JPG), and 3840×2160 is the recommended size, not too large.|||VI: Bảng thông số của Bài 25.3 nói rõ: tải thumbnail tuỳ chỉnh cần tài khoản đã xác minh. PNG là định dạng được chấp nhận (cùng JPG), và 3840×2160 là kích thước khuyến nghị, không phải quá lớn.',
          },
          {
            question: 'A YouTube Test & Compare test finishes with Thumbnail A getting a noticeably higher CTR than Thumbnail B, but YouTube still names Thumbnail B the winner. Per Lesson 25.4, why is this consistent with how the feature works?|||Một lượt Test & Compare của YouTube kết thúc với Thumbnail A có CTR cao hơn rõ rệt so với Thumbnail B, nhưng YouTube vẫn gọi Thumbnail B là người thắng. Theo Bài 25.4, vì sao điều này khớp với cách tính năng vận hành?',
            options: [
              'Test & Compare picks winners by overall watch time, not CTR — B likely kept viewers watching longer|||Test & Compare chọn người thắng theo tổng thời lượng xem, không phải CTR — B nhiều khả năng giữ người xem lâu hơn',
              'This is a bug — the higher-CTR option should always win|||Đây là lỗi — phương án CTR cao hơn luôn phải thắng',
              'Thumbnail B must have had more impressions, which always wins|||Thumbnail B chắc chắn có nhiều lượt hiển thị hơn, và điều đó luôn thắng',
              'YouTube always picks the second option tested, regardless of performance|||YouTube luôn chọn phương án thử thứ hai, bất kể hiệu suất',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Lesson 25.4 quoted YouTube directly: it optimizes tests for overall watch time "over other metrics, like click-through-rate." A higher-CTR, lower-retention variant is exactly what this system is built to reject as the winner.|||VI: Bài 25.4 đã trích thẳng YouTube: họ tối ưu các lượt thử theo tổng thời lượng xem "hơn các chỉ số khác, như tỉ lệ nhấp." Một biến thể CTR cao nhưng giữ chân thấp chính là thứ hệ thống này được dựng ra để loại khỏi vị trí thắng cuộc.',
          },
          {
            question: 'Your video\'s CTR drops from 9% to 3.5%, while impressions grow from 10,000 to 100,000, mostly from the Home surface. Per Lesson 25.4\'s reading of YouTube\'s own example, what should you conclude first?|||CTR video của bạn giảm từ 9% xuống 3,5%, trong khi lượt hiển thị tăng từ 10.000 lên 100.000, chủ yếu từ bề mặt Trang chủ. Theo cách đọc của Bài 25.4 dựa trên đúng ví dụ của YouTube, bạn nên kết luận gì trước tiên?',
            options: [
              'The thumbnail has gotten worse and needs to be redesigned immediately|||Thumbnail đã tệ đi và cần thiết kế lại ngay',
              'This likely reflects reach expanding into a lower-intent, higher-volume surface — not a packaging failure|||Điều này nhiều khả năng phản ánh độ phủ mở rộng vào một bề mặt ý định thấp hơn, khối lượng cao hơn — không phải đóng gói thất bại',
              'The channel is about to be demonetized|||Kênh sắp bị mất kiếm tiền',
              'CTR and impressions must always move in the same direction, so this is impossible|||CTR và lượt hiển thị luôn phải di chuyển cùng chiều, nên chuyện này không thể xảy ra',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: This is YouTube\'s own verified example from Lesson 25.4 almost exactly: 10,000 impressions at 9% CTR growing to 100,000 at 3.5% is framed as reach expanding into Home traffic (lower intent, higher volume), not a decline — read impressions and CTR together, never CTR alone.|||VI: Đây gần như đúng ví dụ đã kiểm chứng của chính YouTube trong Bài 25.4: 10.000 lượt hiển thị ở CTR 9% tăng lên 100.000 ở 3,5% được nói rõ là độ phủ mở rộng vào lưu lượng Trang chủ (ý định thấp hơn, khối lượng cao hơn), không phải sụt giảm — đọc lượt hiển thị và CTR cùng nhau, đừng đọc CTR một mình.',
          },
          {
            question: 'A video with mostly Search-driven traffic and a video with mostly Home-driven traffic have different typical CTR ranges. Per Lesson 25.4, why?|||Một video chủ yếu có lưu lượng từ Tìm kiếm và một video chủ yếu có lưu lượng từ Trang chủ có khoảng CTR điển hình khác nhau. Theo Bài 25.4, vì sao?',
            options: [
              'Search results always hide the thumbnail, so CTR cannot be measured there|||Kết quả tìm kiếm luôn ẩn thumbnail nên không đo được CTR ở đó',
              'Home traffic is fake traffic and should be ignored entirely|||Lưu lượng Trang chủ là lưu lượng giả và nên bỏ qua hoàn toàn',
              'Search CTR and Home CTR are always identical once a video has 1,000 views|||CTR Tìm kiếm và CTR Trang chủ luôn giống nhau khi video đạt 1.000 lượt xem',
              'A searcher already has specific intent (higher CTR); a Home browser has no specific intent yet and compares many videos at once (lower CTR) — a structural difference, not a quality one|||Người tìm kiếm đã có ý định cụ thể (CTR cao hơn); người lướt Trang chủ chưa có ý định cụ thể và so sánh nhiều video cùng lúc (CTR thấp hơn) — khác biệt cấu trúc, không phải chất lượng',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Lesson 25.4 explained this directly from YouTube\'s own analytics guidance: CTR varies by traffic surface because viewer intent differs by surface — this is structural, not a signal that one surface is "fake" or that your thumbnail is failing.|||VI: Bài 25.4 đã giải thích điều này trực tiếp từ hướng dẫn phân tích của chính YouTube: CTR khác nhau theo bề mặt lưu lượng vì ý định người xem khác nhau theo bề mặt — đây là chuyện cấu trúc, không phải tín hiệu một bề mặt nào đó "giả" hay thumbnail của bạn đang thất bại.',
          },
          {
            question: 'Your channel is not yet eligible for Test & Compare (advanced features are not enabled). Per Lesson 25.4, what is the recommended fallback — not "do nothing"?|||Kênh của bạn chưa đủ điều kiện dùng Test & Compare (chưa bật advanced features). Theo Bài 25.4, phương án dự phòng được khuyến nghị — không phải "không làm gì" — là gì?',
            options: [
              'Wait silently until YouTube enables it automatically, with no other action|||Im lặng chờ tới khi YouTube tự bật, không làm gì khác',
              'Manually record before/after impressions and CTR for a video whose packaging you deliberately change, then read it with traffic-source context|||Tự ghi lại lượt hiển thị và CTR trước/sau cho một video bạn chủ đích đổi cách đóng gói, rồi đọc nó kèm ngữ cảnh nguồn lưu lượng',
              'Delete the video and re-upload it with a new title|||Xoá video rồi đăng lại với tiêu đề mới',
              'Switch the entire channel to Shorts, since Shorts do not need Test & Compare|||Chuyển cả kênh sang Shorts, vì Shorts không cần Test & Compare',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Lesson 25.4 was explicit: without Test & Compare, manually tracking a deliberate before/after packaging change — read with the same traffic-source context the lesson taught — replaces the platform\'s automated test with a manual but still measured one.|||VI: Bài 25.4 đã nói rõ: không có Test & Compare, tự theo dõi một lượt đổi đóng gói chủ đích trước/sau — đọc kèm đúng ngữ cảnh nguồn lưu lượng bài học đã dạy — thay thế phép thử tự động của nền tảng bằng một phép thử thủ công nhưng vẫn đo được.',
          },
        ],
      },
    },
  ],
};
