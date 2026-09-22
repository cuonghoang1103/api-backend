/**
 * Content Creator — Chương 20: Video ngắn dọc. Song ngữ EN/VI (.ml-en / .ml-vi).
 * ⚠️ KHÔNG backtick trần trong content (dùng &#96;); `${` trong mã mẫu viết \${ ; gạch chéo ngược viết \\
 */
import { gallery, slide } from './_slides.mjs';

const SLIDES = [
  [1, 'Bìa'],
  [2, 'Bản đồ chương'],
  [3, 'Giải phẫu một video ngắn — ba đoạn, không hơn'],
  [4, 'Độ dài & tỉ lệ — số liệu đã kiểm ở Chương 1'],
  [5, 'Vùng an toàn 9:16 — ba nền tảng, cùng một ước lượng'],
  [6, 'Quay dọc: Pocket 3 xoay màn hình, iPhone chỉ xoay máy'],
  [7, 'Sáu khung cho một video ngắn — "1 dòng CSS đổi cả giao diện"'],
  [8, 'Ba kiểu video ngắn bạn sẽ quay nhiều nhất'],
  [9, 'Quay dồn 10 video ngắn — một buổi, không phải mười buổi'],
  [10, 'Dựng giữ chân — bảng tra: đã học ở đâu, thêm gì cho video ngắn'],
  [11, 'Nhạc thịnh hành — có giới hạn cho tài khoản doanh nghiệp'],
  [12, 'Đăng chéo — một bản gốc, nhiều bản riêng'],
  [13, 'Đọc đúng số liệu của video ngắn'],
  [14, 'Checklist trước khi đăng'],
  [15, 'Thực hành chương 20'],
];

export default {
  title: 'Chapter 20 — Short vertical video|||Chương 20 — Video ngắn dọc',
  description: 'Từ hook 3 giây tới đọc đúng số liệu sau khi đăng: giải phẫu, quay, dựng và phân phối một video ngắn dọc giữ được chân người xem trên TikTok, Reels, Shorts và Facebook Reels.',
  lessons: [
    /* ─────────────────── 20.0 slide bài giảng ─────────────────── */
    {
      title: '20.0 — Chapter 20 in 15 slides|||20.0 — Chương 20 trong 15 slide',
      slug: 'cr-20-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bức tranh toàn cảnh của chương: giải phẫu ba phần, quay dọc nhanh, dựng giữ chân và đọc đúng số liệu sau khi đăng — trong 15 slide.',
      content: `
<div class="ml-en"><h2>📑 Chapter 20 in 15 slides</h2>
<p>This chapter has a shape you have not used yet in this course. Instead of one long piece built from B-roll, coverage and an interview, a short vertical video is a tight three-part machine — hook, one idea, loop — squeezed into 20 to 60 seconds. The slides below draw that shape before you read a single paragraph: the three-part anatomy, the length limit on each platform (all far looser than you probably assume), the safe zone every 9:16 video has to respect, and the shot-by-shot examples you will actually shoot and edit.</p>
<p>Two slides matter most: <strong>slide 3</strong> (the three-part anatomy every short in this chapter is built from) and <strong>slide 7</strong> (a full six-shot example that reuses the "loop" idea from slide 3, sitting right next to the eight-shot short you already saw in Chapter 4). Skim now, come back after the four lessons to check your own script against them.</p></div>
<div class="ml-vi"><h2>📑 Chương 20 trong 15 slide</h2>
<p>Chương này có một hình dạng bạn chưa dùng trong khoá. Thay vì một video dài dựng từ B-roll, coverage và phỏng vấn, một video ngắn dọc là một cỗ máy ba phần chặt chẽ — hook, một ý, vòng lặp — nén vào 20 tới 60 giây. Các slide dưới đây vẽ hình dạng đó trước khi bạn đọc một đoạn văn nào: giải phẫu ba phần, giới hạn độ dài từng nền tảng (đều rộng rãi hơn bạn tưởng nhiều), vùng an toàn mà mọi video 9:16 phải tôn trọng, và các ví dụ shot-theo-shot bạn sẽ thật sự quay và dựng.</p>
<p>Hai slide quan trọng nhất: <strong>slide 3</strong> (giải phẫu ba phần mà mọi video ngắn trong chương này dựng từ đó) và <strong>slide 7</strong> (một ví dụ đầy đủ sáu shot, dùng lại đúng ý "vòng lặp" của slide 3, đặt cạnh video ngắn tám shot bạn đã thấy ở Chương 4). Lướt bây giờ, học xong bốn bài thì quay lại đối chiếu với kịch bản của chính bạn.</p></div>
${gallery('cr-20', SLIDES)}
`,
    },

    /* ─────────────────── 20.1 giải phẫu ─────────────────── */
    {
      title: '20.1 — Anatomy of a short vertical video|||20.1 — Giải phẫu một video ngắn dọc',
      slug: 'cr-20-1-giai-phau-video-ngan',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Ba đoạn hook — một ý — kết vòng lặp, giới hạn độ dài hiện hành của bốn nền tảng, và vùng an toàn 9:16 — khung xương của mọi video ngắn bạn sẽ quay trong chương này.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 20 · Lesson 20.1</span>
<h2>A short video is not a long video cut down — it has its own three-part shape</h2>
<p class="lead">The instinct when you first try a short is to take a piece of a longer video, trim it, and post it. That almost never works, because a short is not a smaller long video — it is a different machine with exactly three moving parts, built to survive the first three seconds and the swipe reflex that follows. This lesson gives you that shape, the length limits you almost never have to worry about, and the one number in this chapter you should not trust blindly.</p>

<h3>Three parts, no more</h3>
${slide('cr-20', 3, 'Giải phẫu một video ngắn — ba đoạn, không hơn')}
<div class="kv-grid">
  <div class="kv"><span class="k">Hook (0–3s)</span><span class="v">Picture, on-screen text and the first spoken sentence firing together — the same three layers Lesson 3.1 already taught you, now compressed into the opening beat of every single short.</span></div>
  <div class="kv"><span class="k">One idea only</span><span class="v">No "by the way" digressions, no second topic squeezed in because it fit. A short earns the right to wander nowhere — that space belongs to the long-form videos in later chapters.</span></div>
  <div class="kv"><span class="k">Close — loop</span><span class="v">The last line or action leads naturally back to the opening, so the video plays again without the viewer quite noticing it looped. Both viewings count toward watch time.</span></div>
</div>
<p>The middle section is where beginners lose the format without realizing it. A long-form video can afford a tangent — a related story, a caveat, a joke — because the viewer has already committed to minutes of your time. A short has committed a viewer for seconds, and every sentence that is not the promised idea is a place for them to swipe away. Audience retention (Lesson 3.1) drops fastest right at the point a video stops delivering what its hook promised; in a 30-second video that point arrives almost immediately.</p>

<h3>How long is "short," on each platform</h3>
${slide('cr-20', 4, 'Độ dài & tỉ lệ — số liệu đã kiểm ở Chương 1')}
<p>This table is the same data Lesson 1.1 already verified, reused here because it answers a question every beginner asks first: "how long can my short be?" YouTube Shorts allows up to 3 minutes since 15 October 2024, Instagram Reels the same since Adam Mosseri announced it in January 2025, TikTok's ordinary uploads run well past 10 minutes, and Facebook Reels carries no length limit at all since every video there became a Reel in June 2025. The videos in this chapter target <strong>20 to 60 seconds</strong> — a fraction of any of those caps. Length is essentially never your real constraint; holding attention for the seconds you actually use is.</p>

<h3>The vertical 9:16 safe zone — the one number here you should not trust blindly</h3>
${slide('cr-20', 5, 'Vùng an toàn 9:16 — ba nền tảng, cùng một ước lượng')}
<p>Lesson 7.3 already warned you about this, and it is worth repeating with three platforms side by side: none of TikTok, Reels or Shorts publishes an official pixel or percentage spec for where their own UI (username, caption, action buttons) will sit on top of your video, and every one of those interfaces changes over time. The green zone on the slide is one shared estimate drawn for all three, not three separately measured numbers. Treat any specific figure — including this one — as a starting guess, then verify it the only reliable way: export a test clip with a grid overlay and open it in the real app on a real phone.</p>
<div class="callout ok"><p><strong>Tip:</strong> since so many people scroll shorts with the sound off, test your hook muted before anything else — the same trick Lesson 3.1 taught you for long-form openings, just more urgent here because the swipe happens faster than the audio has time to matter.</p></div>

<h3>A full example: the loop from slide 3, in six shots</h3>
${slide('cr-20', 7, 'Sáu khung cho một video ngắn — "1 dòng CSS đổi cả giao diện"')}
<p>Lesson 4.3's full worked example — "3 Git mistakes new developers make," an 8-shot, 60-second vertical short — already promised you this chapter would cover shooting and posting shorts in depth. Add the durations in that table (3+3+8+5+8+5+8+5) and you get 45 seconds of planned footage, squarely inside the 20–60-second target above. This chapter's own six-shot example works the same way, but makes the loop mechanic visible: <strong>shot 1</strong> is a hook delivered straight to camera, MCU, and <strong>shot 6</strong> closes on the exact same shot size and body position, delivering the CTA. Nothing about the footage announces "this is where it loops" — the loop lives entirely in matching the frame and the line, which is precisely the pitfall below.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — treating the loop as an editing trick.</strong> Crossfading the last frame into the first, or adding a whoosh transition at the very end, does not create a loop; it creates a visible seam a viewer notices as "oh, it restarted." A real loop is a writing and directing decision made before you press record: the closing line finishes the sentence the opening line started, or the closing gesture mirrors the opening one, so the cut from frame 999 back to frame 1 reads as continuous rather than repeated.</p></div>
<p class="note-ct"><strong>Next:</strong> Lesson 20.2 puts a camera in your hand and turns this three-part shape into something you can actually shoot — vertical setup on the Pocket 3 and iPhone, the three kinds of short you will make most often, and a batching routine for shooting ten of them in one sitting.</p>

<h3>🎬 Practice (15–20 minutes)</h3>
<div class="callout ok"><ol>
<li>Pick one small, specific idea — a coding tip, a tool trick, one lesson learned. Write the hook line (under 3 seconds read aloud), the one-idea line, and a closing line that deliberately reuses a word, image or gesture from the hook.</li>
<li>Sketch a 5–8 shot mini storyboard for it, using the same vocabulary from Lesson 4.2 (shot, size, description) — shot 1 and your last shot should match in size and framing, the way slide 7's example does.</li>
<li>Read the hook out loud with a stopwatch running.</li>
</ol><p><strong>Done when:</strong> the hook times under 3 seconds read aloud, the storyboard has no shot that is not in service of the one idea, and the first and last shots visibly match.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Hook</span><span class="v">The 0–3-second opening designed to earn the next few seconds of attention.</span></div>
  <div class="kv"><span class="k">Loop</span><span class="v">A closing beat written to lead naturally back into the opening beat, so the video replays without feeling repeated.</span></div>
  <div class="kv"><span class="k">Safe zone</span><span class="v">The area of a 9:16 frame likely to be covered by a platform's own UI (caption, username, buttons) — an estimate, not a published spec.</span></div>
  <div class="kv"><span class="k">Audience retention</span><span class="v">The percentage of viewers still watching at each moment of a video (Lesson 3.1).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A short has exactly three parts: hook (0–3s), one idea, and a close that loops back to the opening — not a trimmed-down long video.</li>
<li>Length limits (up to 3 minutes on Shorts and Reels, further still on TikTok and Facebook Reels) are almost never the real constraint for a 20–60-second short.</li>
<li>The 9:16 safe zone has no official numbers on any platform — treat any figure as an estimate and verify with a real test clip on a real phone.</li>
<li>A loop is written into the script and shot list, not manufactured with a transition after the footage already exists.</li>
</ul>
<div class="link-card"><a href="https://blog.youtube/news-and-events/tall-updates-coming-to-shorts/" target="_blank" rel="noopener">YouTube Blog — Shorts up to three minutes (October 2024)</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 20 · Bài 20.1</span>
<h2>Video ngắn không phải video dài bị cắt bớt — nó có hình dạng riêng</h2>
<p class="lead">Bản năng khi mới thử làm video ngắn là lấy một đoạn từ video dài, cắt gọn rồi đăng. Cách đó gần như luôn thất bại, vì video ngắn không phải một video dài thu nhỏ — nó là một cỗ máy khác, đúng ba bộ phận, dựng ra để sống sót qua ba giây đầu và phản xạ lướt ngay sau đó. Bài này cho bạn hình dạng đó, các giới hạn độ dài bạn gần như không bao giờ phải lo, và đúng một con số trong chương này bạn không nên tin mù quáng.</p>

<h3>Ba phần, không hơn</h3>
${slide('cr-20', 3, 'Giải phẫu một video ngắn — ba đoạn, không hơn')}
<div class="kv-grid">
  <div class="kv"><span class="k">Hook (0–3s)</span><span class="v">Hình, chữ trên màn hình và câu nói đầu tiên nổ ra CÙNG LÚC — đúng ba lớp Bài 3.1 đã dạy, giờ nén vào nhịp mở đầu của mọi video ngắn.</span></div>
  <div class="kv"><span class="k">Một ý duy nhất</span><span class="v">Không "tiện thể nói thêm", không nhét thêm ý thứ hai chỉ vì nó vừa vặn. Video ngắn không có quyền lạc đề — chỗ đó thuộc về các video dài ở chương sau.</span></div>
  <div class="kv"><span class="k">Kết — vòng lặp</span><span class="v">Câu hoặc hành động cuối dẫn tự nhiên về phần mở đầu, để video phát lại mà người xem không hẳn nhận ra nó vừa lặp. Cả hai lượt xem đều được tính vào thời gian xem.</span></div>
</div>
<p>Đoạn giữa là chỗ người mới đánh mất định dạng mà không nhận ra. Một video dài có thể lạc đề một chút — một câu chuyện liên quan, một lưu ý, một câu đùa — vì người xem đã bỏ ra vài phút cho bạn rồi. Video ngắn chỉ mới có được vài giây của người xem, và mỗi câu không phải ý đã hứa là một chỗ để họ lướt đi. Tỉ lệ giữ chân khán giả (Bài 3.1) rớt nhanh nhất đúng lúc video ngừng giao đúng thứ hook đã hứa; ở một video 30 giây, thời điểm đó tới gần như ngay lập tức.</p>

<h3>"Ngắn" là bao lâu, ở từng nền tảng</h3>
${slide('cr-20', 4, 'Độ dài & tỉ lệ — số liệu đã kiểm ở Chương 1')}
<p>Bảng này chính là số liệu Bài 1.1 đã kiểm, dùng lại ở đây vì nó trả lời câu hỏi mọi người mới hay hỏi trước tiên: "video ngắn của mình được dài bao nhiêu?" YouTube Shorts cho tới 3 phút từ 15/10/2024, Instagram Reels cũng vậy từ khi Adam Mosseri công bố tháng 1/2025, video tải lên thường của TikTok chạy dài hơn 10 phút là chuyện phổ biến, còn Facebook Reels không giới hạn độ dài chút nào từ khi mọi video ở đó thành Reels vào tháng 6/2025. Video trong chương này nhắm <strong>20 tới 60 giây</strong> — chỉ là một phần nhỏ của bất kỳ giới hạn nào ở trên. Độ dài gần như không bao giờ là giới hạn thật của bạn; giữ được sự chú ý trong đúng số giây bạn dùng mới là chuyện thật.</p>

<h3>Vùng an toàn 9:16 — con số DUY NHẤT ở đây bạn không nên tin mù quáng</h3>
${slide('cr-20', 5, 'Vùng an toàn 9:16 — ba nền tảng, cùng một ước lượng')}
<p>Bài 7.3 đã cảnh báo điều này, và đáng nhắc lại khi đặt cạnh nhau ba nền tảng: không TikTok, Reels hay Shorts nào công bố thông số pixel hay phần trăm chính thức cho chỗ giao diện của chính họ (tên tài khoản, chú thích, nút bấm) sẽ nằm đè lên video của bạn, và giao diện của cả ba vẫn đổi theo thời gian. Vùng xanh trên slide là MỘT ước lượng dùng chung cho cả ba, không phải ba con số đo riêng. Coi mọi con số cụ thể — kể cả con số này — là một phỏng đoán khởi điểm, rồi kiểm nó theo đúng cách đáng tin duy nhất: xuất một clip thử có lưới đánh dấu và mở nó trong đúng app thật trên một điện thoại thật.</p>
<div class="callout ok"><p><strong>Mẹo:</strong> vì rất nhiều người lướt video ngắn với tiếng tắt, hãy thử hook của bạn ở chế độ câm trước tiên — đúng mẹo Bài 3.1 đã dạy cho phần mở đầu video dài, chỉ khẩn cấp hơn ở đây vì cú lướt tới nhanh hơn cả lúc âm thanh kịp có nghĩa.</p></div>

<h3>Một ví dụ đầy đủ: vòng lặp của slide 3, gói trong sáu shot</h3>
${slide('cr-20', 7, 'Sáu khung cho một video ngắn — "1 dòng CSS đổi cả giao diện"')}
<p>Ví dụ đầy đủ của Bài 4.3 — "3 lỗi khi mới học Git", một video ngắn dọc 60 giây, tám shot — đã hứa trước rằng chương này sẽ nói kỹ việc quay và đăng video ngắn. Cộng thời lượng trong bảng đó lại (3+3+8+5+8+5+8+5) ra đúng 45 giây hình đã lên kế hoạch, nằm gọn trong khoảng mục tiêu 20–60 giây ở trên. Ví dụ sáu shot của chính chương này đi theo cùng logic, nhưng cho bạn thấy rõ cơ chế vòng lặp: <strong>shot 1</strong> là một hook nhìn thẳng ống kính, cỡ MCU, và <strong>shot 6</strong> kết thúc ở ĐÚNG cỡ cảnh và tư thế đó, giao luôn câu CTA. Không có gì trong cảnh quay báo trước "đây là chỗ lặp lại" — vòng lặp nằm trọn trong việc khớp khung hình và khớp câu, đúng chỗ cái bẫy dưới đây nói tới.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — coi vòng lặp là một mẹo dựng phim.</strong> Crossfade khung hình cuối chồng lên khung đầu, hay thêm một tiếng whoosh ngay lúc kết thúc, không tạo ra vòng lặp — nó tạo ra một đường nối lộ liễu khiến người xem nhận ra "à, nó vừa lặp lại". Một vòng lặp thật là quyết định viết kịch bản và đạo diễn, đưa ra TRƯỚC khi bấm quay: câu kết hoàn thành đúng câu mà câu mở đầu đã bỏ dở, hoặc cử chỉ kết soi gương cử chỉ mở, để cú cắt từ khung 999 về khung 1 đọc ra là liên tục chứ không phải lặp lại.</p></div>
<p class="note-ct"><strong>Bài tiếp theo:</strong> Bài 20.2 đưa máy quay vào tay bạn và biến hình dạng ba phần này thành thứ quay được thật — cài đặt quay dọc trên Pocket 3 và iPhone, ba kiểu video ngắn bạn sẽ làm nhiều nhất, và một quy trình quay dồn mười video trong một buổi.</p>

<h3>🎬 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Chọn một ý nhỏ, cụ thể — một mẹo code, một mẹo dùng công cụ, một bài học rút ra. Viết câu hook (đọc to dưới 3 giây), câu một-ý, và câu kết CHỦ ĐÍCH dùng lại một từ, hình ảnh hoặc cử chỉ từ câu hook.</li>
<li>Phác thảo storyboard mini 5–8 shot cho video đó, dùng đúng từ vựng Bài 4.2 (shot, cỡ cảnh, mô tả) — shot 1 và shot cuối nên khớp nhau về cỡ cảnh và bố cục, giống ví dụ ở slide 7.</li>
<li>Đọc to câu hook, bấm đồng hồ theo dõi.</li>
</ol><p><strong>Đạt khi:</strong> hook đọc to dưới 3 giây, storyboard không có shot nào lạc khỏi đúng một ý, và shot đầu với shot cuối khớp nhau rõ rệt.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Hook</span><span class="v">Đoạn mở đầu 0–3 giây, dựng ra để kiếm được vài giây chú ý tiếp theo.</span></div>
  <div class="kv"><span class="k">Loop (vòng lặp)</span><span class="v">Nhịp kết được viết để dẫn tự nhiên về nhịp mở đầu, để video phát lại mà không cảm giác bị lặp.</span></div>
  <div class="kv"><span class="k">Safe zone (vùng an toàn)</span><span class="v">Vùng trong khung 9:16 dễ bị giao diện riêng của nền tảng (chú thích, tên tài khoản, nút bấm) che mất — một ước lượng, không phải thông số công bố.</span></div>
  <div class="kv"><span class="k">Audience retention</span><span class="v">Tỉ lệ giữ chân khán giả — phần trăm người xem còn xem tại mỗi thời điểm của video (Bài 3.1).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Video ngắn có đúng ba phần: hook (0–3s), một ý duy nhất, và một cái kết lặp về đúng phần mở đầu — không phải một video dài bị cắt bớt.</li>
<li>Giới hạn độ dài (tới 3 phút trên Shorts và Reels, còn rộng hơn nữa trên TikTok và Facebook Reels) gần như không bao giờ là giới hạn thật với một video ngắn 20–60 giây.</li>
<li>Vùng an toàn 9:16 không có con số chính thức ở nền tảng nào — coi mọi con số là ước lượng và tự kiểm bằng một clip thử thật trên điện thoại thật.</li>
<li>Vòng lặp được viết vào kịch bản và shot list, không phải tạo ra bằng một hiệu ứng dựng sau khi cảnh đã quay xong.</li>
</ul>
<div class="link-card"><a href="https://blog.youtube/news-and-events/tall-updates-coming-to-shorts/" target="_blank" rel="noopener">YouTube Blog — Shorts dài tới 3 phút (tháng 10/2024)</a></div>
</div>
`,
    },

    /* ─────────────────── 20.2 quay nhanh ─────────────────── */
    {
      title: '20.2 — Shooting short vertical video fast|||20.2 — Quay video ngắn dọc nhanh',
      slug: 'cr-20-2-quay-video-ngan',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Pocket 3 xoay màn hình quay dọc, ba kiểu video ngắn bạn sẽ quay nhiều nhất, và cách quay dồn 10 video trong một buổi mà không tái phạm lỗi "quay một lèo" của Chương 4.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 20 · Lesson 20.2</span>
<h2>Two cameras that already shoot vertical, and a batching habit that saves your evening</h2>
<p class="lead">Both of your main cameras handle 9:16 natively — no third-party app, no cropping guesswork. This lesson sets up the Pocket 3 and iPhone for vertical shooting, names the three kinds of short you will make over and over, and gives you a batching routine so ten scripts turn into ten finished clips in one sitting instead of ten separate outings.</p>

<h3>Pocket 3 rotates its screen, iPhone rotates the whole body</h3>
${slide('cr-20', 6, 'Quay dọc: Pocket 3 xoay màn hình, iPhone chỉ xoay máy')}
<p>Per DJI's own spec page, rotating the Pocket 3's 2-inch touchscreen 90° reframes the gimbal into 9:16 without cropping anything later, and it is not limited to one resolution: <strong>3K vertical is 1728×3072</strong>, <strong>2.7K vertical is 1512×2688</strong>, and <strong>1080p vertical is 1080×1920</strong> — all available at 24, 25, 30, 48, 50 and 60 fps, the same frame-rate range as shooting horizontal. The iPhone 16 Pro Max has no equivalent screen-rotation trick; you physically turn the phone 90° and it records vertical 4K or 1080p directly.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Shoot 1080p vertical when…</span><span class="v">You plan to post the clip close to straight, with no further crop or zoom — lighter files, faster export, less to manage across a batch of ten.</span></div>
  <div class="kv"><span class="k">Shoot 3K vertical when…</span><span class="v">You plan to punch in during the edit (Lesson 12.2/17.2) — the extra pixels are headroom for zooming without the image going soft.</span></div>
</div>
<p>Footage you might reuse for both a long video and a short is the one case where Lesson 7.3's protective framing rule matters most: keep the subject centred and text away from the edges from the moment you press record, so a later 9:16 crop does not accidentally clip a head or bury a caption.</p>
<p>Resolution is also a storage decision, not just a punch-in decision — the GB-per-minute table from Lesson 6.4 applies here exactly as it does to any other footage: 3K vertical eats through a memory card noticeably faster than 1080p vertical at the same frame rate. For a batch of ten shorts in one sitting (the next section), that difference is the gap between finishing the day on one card and stopping halfway through to swap cards — worth deciding before you start, not after card 1 fills up.</p>

<h3>Three shapes of short you will shoot most</h3>
${slide('cr-20', 8, 'Ba kiểu video ngắn bạn sẽ quay nhiều nhất')}
<p>Almost every short you make will be one of three shapes, and each one leans on a skill from an earlier chapter. <strong>Talking head</strong> — straight to camera, one idea, 20–40 seconds — is the Pocket 3 on a mini tripod or handheld with ActiveTrack doing the framing work for you (Lesson 10.3). <strong>Screen-plus-face tutorials</strong> cut between a face frame for the opening and closing lines and a screen recording for the demo in between (Lesson 22.2 covers screen recording itself) — one code trick, one keyboard shortcut, nothing more. <strong>B-roll montage with voiceover</strong> has no shot of you talking to camera at all; it is cut to audio recorded separately (Lesson 9.4), which suits a journey or behind-the-scenes short better than a talking head does.</p>

<h3>Batch ten shorts in one sitting, not ten sittings</h3>
${slide('cr-20', 9, 'Quay dồn 10 video ngắn — một buổi, không phải mười buổi')}
<p>The six steps on the slide are not a shortcut invented for this chapter — they are Chapters 2, 3, 4 and 11 applied at short-form speed. Write the ten hooks and scripts before you touch a camera (Lessons 3.1/3.3): improvising on the spot burns memory-card space and energy in equal amounts. Group scripts that share a topic or setting so you are not re-lighting and re-mic'ing between every clip, since gear setup is the biggest real cost of a shoot (Lesson 2.3). Shoot in order, 1–3 takes per hook, and rename and back up the footage the same day using the naming convention from Lesson 11.1 — six months from now, a filename with the hook's first few words in it is the only thing that will still make sense.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — "batching" as an excuse to shoot one continuous roll.</strong> Batching ten shorts means one setup session, not one unbroken take. Recording all ten scripts back to back without stopping the camera recreates exactly the "shoot a 20–30-minute roll, sort it out later" problem Chapter 4 spent a whole lesson fixing — it just wears a more efficient-sounding name. Stop the camera between videos, even when the setup does not change.</p></div>
<p class="note-ct"><strong>Next:</strong> Lesson 20.3 turns this pile of short, labelled clips into an edit that actually holds attention — tighter pacing, word-by-word captions, and the trending-music limits that show up the moment you switch to a Business account.</p>

<h3>🎬 Practice (30–45 minutes)</h3>
<div class="callout ok"><ol>
<li>Take the three hooks you wrote in Lesson 20.1's practice (or write two more to reach three) and group them by shared setting.</li>
<li>Set up light, mic and camera once. Shoot each short vertical — 1080p if you will post it close to straight, 3K if you plan to punch in — with 1–3 takes per hook, stopping the camera between videos.</li>
<li>Copy the footage the same day and rename each clip using Lesson 11.1's convention, with the hook's first few words in the filename.</li>
</ol><p><strong>Done when:</strong> you have three separate, correctly named vertical clips shot in one sitting, each with a clean stop between takes — not one continuous unedited roll.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Vertical / portrait</span><span class="v">9:16 orientation — the Pocket 3 reaches it by rotating its screen, the iPhone by physically rotating the phone.</span></div>
  <div class="kv"><span class="k">ActiveTrack</span><span class="v">The Pocket 3's subject-tracking mode, used solo without an operator (Lesson 10.3).</span></div>
  <div class="kv"><span class="k">Batch shoot</span><span class="v">One setup session producing several separate, discrete clips — not one continuous take.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Pocket 3 reaches 9:16 by rotating its screen (3K 1728×3072, 2.7K 1512×2688, 1080p 1080×1920, all 24–60 fps); the iPhone reaches it by rotating the whole device.</li>
<li>Shoot 1080p vertical for straight posting, 3K vertical when you plan to punch in later.</li>
<li>Three recurring shapes: talking head, screen-plus-face tutorial, B-roll montage with separate voiceover.</li>
<li>Batching means one gear setup and several discrete, stopped clips — never one unbroken take disguised as efficiency.</li>
</ul>
<div class="link-card"><a href="https://www.dji.com/osmo-pocket-3/specs" target="_blank" rel="noopener">DJI — Osmo Pocket 3 official specs (vertical resolutions and frame rates)</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 20 · Bài 20.2</span>
<h2>Hai máy quay đã quay dọc sẵn, và một thói quen quay dồn cứu cả buổi tối của bạn</h2>
<p class="lead">Cả hai máy chính của bạn đều xử lý 9:16 ngay từ gốc — không cần app bên thứ ba, không phải đoán mò lúc crop. Bài này cài đặt Pocket 3 và iPhone để quay dọc, gọi tên ba kiểu video ngắn bạn sẽ làm đi làm lại, và cho bạn một quy trình quay dồn để mười kịch bản thành mười clip hoàn chỉnh trong một buổi, thay vì mười lần ra ngoài riêng lẻ.</p>

<h3>Pocket 3 xoay màn hình, iPhone xoay cả máy</h3>
${slide('cr-20', 6, 'Quay dọc: Pocket 3 xoay màn hình, iPhone chỉ xoay máy')}
<p>Theo đúng trang thông số của DJI, xoay màn hình cảm ứng 2 inch của Pocket 3 90° là gimbal tự đổi khung sang 9:16, không cần crop lại gì sau đó, và không chỉ có một độ phân giải: <strong>3K dọc là 1728×3072</strong>, <strong>2.7K dọc là 1512×2688</strong>, và <strong>1080p dọc là 1080×1920</strong> — tất cả có ở 24, 25, 30, 48, 50 và 60 fps, cùng dải tốc độ khung hình như quay ngang. iPhone 16 Pro Max không có mẹo xoay màn hình tương tự; bạn phải xoay cả điện thoại 90° và nó ghi thẳng 4K hoặc 1080p dọc.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Quay 1080p dọc khi…</span><span class="v">Bạn định đăng gần như nguyên bản, không crop hay zoom thêm — file nhẹ hơn, xuất nhanh hơn, ít thứ phải quản lý hơn trong một đợt mười video.</span></div>
  <div class="kv"><span class="k">Quay 3K dọc khi…</span><span class="v">Bạn định punch-in lúc dựng (Bài 12.2/17.2) — số pixel dư ra là khoảng đệm để zoom mà hình không bị mờ.</span></div>
</div>
<p>Cảnh quay có thể dùng lại cho cả video dài lẫn video ngắn là đúng trường hợp luật đóng khung phòng thủ của Bài 7.3 quan trọng nhất: giữ chủ thể ở giữa và chữ tránh xa mép ngay từ lúc bấm quay, để một cú crop 9:16 sau này không lỡ cắt mất đầu hay đè chữ lên chú thích.</p>
<p>Độ phân giải cũng là một quyết định về lưu trữ, không chỉ về punch-in — bảng GB/phút ở Bài 6.4 áp dụng đúng y hệt như với mọi cảnh quay khác: 3K dọc ngốn thẻ nhớ rõ rệt nhanh hơn 1080p dọc ở cùng tốc độ khung hình. Với một đợt quay dồn mười video trong một buổi (phần tiếp theo), khác biệt đó là khoảng cách giữa việc xong cả buổi trên một thẻ và việc phải dừng giữa chừng để đổi thẻ — nên quyết định trước khi bắt đầu, đừng để tới lúc thẻ đầu tiên đầy mới tính.</p>

<h3>Ba kiểu video ngắn bạn sẽ quay nhiều nhất</h3>
${slide('cr-20', 8, 'Ba kiểu video ngắn bạn sẽ quay nhiều nhất')}
<p>Gần như mọi video ngắn bạn làm sẽ rơi vào một trong ba kiểu, và mỗi kiểu dựa vào một kỹ năng từ chương trước. <strong>Talking head</strong> — nhìn thẳng ống kính, một ý, 20–40 giây — là Pocket 3 trên chân mini hoặc cầm tay với ActiveTrack lo phần đóng khung giúp bạn (Bài 10.3). <strong>Hướng dẫn màn hình + mặt</strong> cắt giữa khung mặt cho câu mở/kết và một đoạn quay màn hình cho phần demo ở giữa (Bài 22.2 nói kỹ việc quay màn hình) — một mẹo code, một phím tắt, không hơn. <strong>B-roll montage lồng tiếng</strong> không có cảnh nào bạn nói trước máy cả; nó được dựng theo giọng thu riêng (Bài 9.4), hợp với video kiểu hành trình hay hậu trường hơn hẳn một talking head.</p>

<h3>Quay dồn mười video ngắn — một buổi, không phải mười buổi</h3>
${slide('cr-20', 9, 'Quay dồn 10 video ngắn — một buổi, không phải mười buổi')}
<p>Sáu bước trên slide không phải mẹo mới sáng tác riêng cho chương này — đó là Chương 2, 3, 4 và 11 áp dụng ở tốc độ video ngắn. Viết cả mười hook và kịch bản TRƯỚC khi chạm vào máy quay (Bài 3.1/3.3): ứng khẩu tại chỗ tốn cả thẻ nhớ lẫn năng lượng như nhau. Gộp các kịch bản có chung chủ đề hoặc bối cảnh để khỏi phải dựng đèn và mic lại giữa mỗi clip, vì dựng đồ nghề là chi phí thật lớn nhất của một buổi quay (Bài 2.3). Quay lần lượt, 1–3 take mỗi hook, rồi đổi tên và sao lưu cảnh quay ngay trong ngày theo đúng quy ước đặt tên Bài 11.1 — sáu tháng sau, một tên file có sẵn vài chữ đầu của hook là thứ duy nhất còn có nghĩa.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — lấy "quay dồn" làm cớ để quay một cuộn liên tục.</strong> Quay dồn mười video nghĩa là dựng máy MỘT LẦN, không phải quay MỘT LÈO không dừng. Đọc liền cả mười kịch bản mà không dừng máy giữa chừng tái tạo lại chính xác vấn đề "quay một lèo 20–30 phút rồi về mới tính" mà cả một bài của Chương 4 đã sửa — chỉ khoác cái tên nghe có vẻ hiệu quả hơn. Dừng máy giữa mỗi video, kể cả khi bối cảnh không đổi.</p></div>
<p class="note-ct"><strong>Bài tiếp theo:</strong> Bài 20.3 biến đống clip ngắn, đã đặt tên này thành một bản dựng thật sự giữ được chân người xem — nhịp cắt sát hơn, phụ đề từng chữ, và giới hạn nhạc thịnh hành xuất hiện ngay khi bạn chuyển sang tài khoản doanh nghiệp.</p>

<h3>🎬 Thực hành (30–45 phút)</h3>
<div class="callout ok"><ol>
<li>Lấy ba hook đã viết ở phần thực hành Bài 20.1 (hoặc viết thêm cho đủ ba) và gộp theo bối cảnh chung.</li>
<li>Dựng đèn, mic, máy quay một lần. Quay từng video ở chế độ dọc — 1080p nếu định đăng gần như nguyên bản, 3K nếu định punch-in — với 1–3 take mỗi hook, dừng máy giữa mỗi video.</li>
<li>Chép cảnh quay ngay trong ngày và đổi tên từng clip theo quy ước Bài 11.1, có sẵn vài chữ đầu của hook trong tên file.</li>
</ol><p><strong>Đạt khi:</strong> bạn có ba clip dọc riêng biệt, đặt tên đúng, quay trong một buổi, mỗi clip có điểm dừng rõ ràng giữa các take — không phải một cuộn quay liên tục chưa cắt.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Dọc / portrait</span><span class="v">Hướng 9:16 — Pocket 3 vào chế độ này bằng cách xoay màn hình, iPhone bằng cách xoay cả máy.</span></div>
  <div class="kv"><span class="k">ActiveTrack</span><span class="v">Chế độ bám theo chủ thể của Pocket 3, dùng khi tự quay một mình không có người điều khiển (Bài 10.3).</span></div>
  <div class="kv"><span class="k">Quay dồn (batch shoot)</span><span class="v">Một buổi dựng đồ nghề, sinh ra nhiều clip riêng biệt, tách rời — không phải một lần quay liên tục.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Pocket 3 vào 9:16 bằng cách xoay màn hình (3K 1728×3072, 2.7K 1512×2688, 1080p 1080×1920, đều 24–60 fps); iPhone vào 9:16 bằng cách xoay cả máy.</li>
<li>Quay 1080p dọc nếu đăng thẳng, quay 3K dọc nếu định punch-in sau.</li>
<li>Ba kiểu lặp lại nhiều nhất: talking head, hướng dẫn màn hình + mặt, B-roll montage lồng tiếng riêng.</li>
<li>Quay dồn nghĩa là dựng đồ nghề một lần và quay nhiều clip riêng biệt, có dừng máy — không bao giờ là một cuộn liên tục đội lốt hiệu quả.</li>
</ul>
<div class="link-card"><a href="https://www.dji.com/osmo-pocket-3/specs" target="_blank" rel="noopener">DJI — Thông số kỹ thuật chính thức Osmo Pocket 3 (độ phân giải dọc và tốc độ khung hình)</a></div>
</div>
`,
    },

    /* ─────────────────── 20.3 dựng giữ chân ─────────────────── */
    {
      title: '20.3 — Editing shorts for retention|||20.3 — Dựng video ngắn giữ chân người xem',
      slug: 'cr-20-3-dung-video-ngan',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Nhịp cắt sát hơn, phụ đề từng chữ, punch-in có chủ đích và giới hạn nhạc thịnh hành khi chuyển sang tài khoản doanh nghiệp — dựng một video ngắn giữ được chân người xem.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 20 · Lesson 20.3</span>
<h2>Nothing new to learn here — everything you already know, turned up</h2>
<p class="lead">This lesson does not introduce a new editing tool. It takes techniques you already have from Chapters 12, 14, 16 and 17 and tells you exactly how much harder to lean on each one when the whole video is 20 to 60 seconds long — plus one trap that only appears once you switch a social account to Business.</p>

<h3>Everything you already know, turned up</h3>
${slide('cr-20', 10, 'Dựng giữ chân — bảng tra: đã học ở đâu, thêm gì cho video ngắn')}
<p>Pacing and dead air (Lesson 14.3) get cut even tighter here — a short has no room for a single wasted second the way a longer video occasionally can. Captions (Lesson 16.3) move from "helpful for sound-off viewers" to "the main event": a word-by-word, karaoke-style caption that highlights in sync with the voice reads faster than a static subtitle block and matches how people actually scroll shorts muted. Punch-in and easing (Lessons 12.2/17.2) work best used sparingly here — one or two deliberate zooms, right at the hook and right at the main point, not scattered across every cut the way a longer explainer might use them. A whoosh or click (Lesson 14.4) earns its place marking the one transition that matters: hook into the main idea. On-screen text (Lesson 16.2) is most valuable in the opening beat specifically, since that is the moment a muted scroller decides whether to stop.</p>
<p>Put that into a concrete habit: hold the frame steady through the hook — zooming right when you are trying to earn attention competes with the words doing that job — then place your one punch-in as the main idea lands, a modest push rather than a dramatic one, so the frame still reads as the same shot instead of a new angle. Pull sound effects from CapCut's own built-in library (Lesson 14.4) rather than hunting for something more elaborate; a single clean whoosh or click does the job, and layering several effects onto one 30-second video tires a viewer who is still deciding whether to keep watching — the opposite of what a short needs.</p>

<h3>Trending music has limits once you flip to a Business account</h3>
${slide('cr-20', 11, 'Nhạc thịnh hành — có giới hạn cho tài khoản doanh nghiệp')}
<p>TikTok's own help documentation confirms this directly: a Business account's <strong>Add Sound</strong> picker shows only the <strong>Commercial Music Library (CML)</strong> — roughly a million tracks TikTok calls free for businesses — and the ordinary trending-sound catalog simply is not there anymore. Instagram runs the same pattern on the other side: a Business account is limited to its own separate, commercially-cleared music library (Sound Collection), distinct from the fuller catalog a personal or creator account sees. This is a genuinely different library from CapCut's own "Commercial Music" collection covered in Lesson 12.3, but it carries the identical caveat: cleared specifically for use on TikTok itself, with no stated guarantee for anywhere else.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — assuming CML-cleared music travels with the file.</strong> A track from TikTok's Commercial Music Library is confirmed safe on TikTok. Export that same file and post it to YouTube, and it can still trigger a Content ID claim there — the same lesson Lesson 12.3 already taught about CapCut's bundled library, just for a second, separate music source. If a short is going to more than one platform, pick music you have separately confirmed is cleared for each one.</p></div>
<p>The trade-off is real and worth knowing before you build a whole posting habit around trending sounds: Business and Creator accounts unlock the detailed analytics Lesson 20.4 reads (watch time, completion rate), but they narrow which music you can tap "Add Sound" and use. Neither choice is wrong — just decide with the trade-off in view, not after you have already committed a month of content to a trending track. For a course channel built around cuongthai.com, the analytics side of that trade-off usually wins: reading real watch-time and completion numbers (Lesson 20.4) tells you which hooks and topics actually work, which matters more over a semester than access to whatever sound is trending this particular week.</p>
<p class="note-ct"><strong>Next:</strong> Lesson 20.4 takes this finished edit and gets it in front of people — cross-posting without the tells that give away a lazy repost, and reading the numbers it produces correctly.</p>

<h3>🎬 Practice (30–40 minutes)</h3>
<div class="callout ok"><ol>
<li>Edit one of the clips from Lesson 20.2's practice in CapCut, following the 10-step process from Lesson 12.4.</li>
<li>Add word-by-word Auto captions and read them back for mistakes.</li>
<li>Add exactly one punch-in, placed right at the start of the main idea — not the hook, not the close.</li>
<li>Check which account type (personal, Creator or Business) your TikTok is set to, and note what music source that gives you access to.</li>
</ol><p><strong>Done when:</strong> the edit plays clean full-screen with no dead air, captions are proofread, there is exactly one deliberate punch-in, and you know which music library your account can actually use.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Commercial Music Library (CML)</span><span class="v">TikTok's own music library for Business accounts, roughly a million tracks, cleared for use on TikTok.</span></div>
  <div class="kv"><span class="k">Sound Collection</span><span class="v">Instagram's separate, commercially-cleared music library for Business accounts on Reels.</span></div>
  <div class="kv"><span class="k">Word-by-word captions</span><span class="v">Captions that highlight one word at a time in sync with the spoken audio, faster to read than a static block.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Every editing technique from Chapters 12–17 still applies — pacing, captions, punch-in, SFX, on-screen text — just used more tightly and more deliberately in a 20–60-second video.</li>
<li>Switching a TikTok or Instagram account to Business unlocks detailed analytics but locks the "Add Sound" picker to a commercially-cleared library (CML on TikTok, Sound Collection on Instagram).</li>
<li>Music cleared for one platform's Business tools is not automatically cleared elsewhere — the same caveat CapCut's own Commercial Music library carries, from a separate source.</li>
</ul>
<div class="link-card"><a href="https://ads.tiktok.com/help/article/how-to-use-the-commercial-music-library" target="_blank" rel="noopener">TikTok — How to use the Commercial Music Library</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 20 · Bài 20.3</span>
<h2>Không có gì mới để học ở đây — mọi thứ bạn đã biết, chỉ vặn to lên</h2>
<p class="lead">Bài này không giới thiệu công cụ dựng mới nào. Nó lấy các kỹ thuật bạn đã có từ Chương 12, 14, 16 và 17, rồi chỉ đúng bạn cần dựa vào từng cái mạnh tới đâu khi cả video chỉ dài 20 tới 60 giây — cộng thêm một cái bẫy chỉ xuất hiện khi bạn chuyển tài khoản mạng xã hội sang Business.</p>

<h3>Mọi thứ bạn đã biết, chỉ vặn to lên</h3>
${slide('cr-20', 10, 'Dựng giữ chân — bảng tra: đã học ở đâu, thêm gì cho video ngắn')}
<p>Nhịp cắt và khoảng chết (Bài 14.3) bị cắt sát hơn nữa ở đây — video ngắn không có chỗ cho dù chỉ một giây lãng phí như video dài thỉnh thoảng vẫn có thể chịu được. Phụ đề (Bài 16.3) chuyển từ "hữu ích cho người xem tắt tiếng" thành "phần chính": phụ đề kiểu "từng chữ" nổi bật đồng bộ theo giọng nói đọc nhanh hơn một khối phụ đề tĩnh, và khớp đúng cách người ta thật sự lướt video ngắn khi tắt tiếng. Punch-in và easing (Bài 12.2/17.2) hiệu quả nhất khi dùng tiết chế ở đây — một hoặc hai lần zoom có chủ đích, đúng lúc vào hook và đúng lúc vào ý chính, không rải khắp mọi cú cắt như một video giải thích dài hơn có thể dùng. Một tiếng whoosh hay click (Bài 14.4) xứng đáng có mặt để đánh dấu đúng cú chuyển duy nhất thật sự quan trọng: từ hook sang ý chính. Chữ trên màn hình (Bài 16.2) có giá trị nhất đúng ở nhịp mở đầu, vì đó là lúc một người đang lướt tắt tiếng quyết định có dừng lại hay không.</p>
<p>Biến điều đó thành một thói quen cụ thể: giữ khung ổn định suốt đoạn hook — zoom đúng lúc đang cố giành sự chú ý là cạnh tranh ngược với chính câu chữ đang làm việc đó — rồi đặt đúng một punch-in khi ý chính vừa vào, một cú đẩy vừa phải chứ không kịch tính, để khung hình vẫn đọc ra là cùng một shot chứ không phải một góc máy mới. Lấy hiệu ứng âm thanh từ thư viện có sẵn của CapCut (Bài 14.4) thay vì đi tìm thứ cầu kỳ hơn; một tiếng whoosh hay click sạch sẽ là đủ việc, và chồng nhiều hiệu ứng lên một video 30 giây làm mệt một người xem còn đang phân vân có xem tiếp hay không — ngược hẳn với thứ một video ngắn cần.</p>

<h3>Nhạc thịnh hành có giới hạn ngay khi bạn chuyển sang tài khoản doanh nghiệp</h3>
${slide('cr-20', 11, 'Nhạc thịnh hành — có giới hạn cho tài khoản doanh nghiệp')}
<p>Trang trợ giúp chính thức của TikTok xác nhận thẳng điều này: bộ chọn <strong>Add Sound</strong> của một tài khoản Business chỉ hiện <strong>Commercial Music Library (CML)</strong> — khoảng một triệu bài mà TikTok gọi là miễn phí cho doanh nghiệp — còn kho nhạc thịnh hành thông thường thì đơn giản là không còn ở đó nữa. Instagram đi theo đúng khuôn mẫu này ở phía bên kia: tài khoản Business chỉ dùng được một thư viện nhạc riêng, có phép thương mại (Sound Collection), khác với danh sách đầy đủ hơn mà tài khoản cá nhân hay creator nhìn thấy. Đây là một thư viện thật sự khác với "Commercial Music" của chính CapCut đã nói ở Bài 12.3, nhưng mang cùng một lưu ý: chỉ được xác nhận dùng được TRÊN chính TikTok, không có gì đảm bảo cho nơi khác.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — tưởng nhạc đã được CML xác nhận thì đi theo file tới mọi nơi.</strong> Một bài trong Commercial Music Library của TikTok được xác nhận an toàn TRÊN TikTok. Xuất đúng file đó rồi đăng lên YouTube, nó vẫn có thể dính đánh dấu Content ID ở đó — đúng bài học Bài 12.3 đã dạy về thư viện có sẵn của CapCut, chỉ khác nguồn nhạc thứ hai. Nếu một video ngắn sẽ đăng lên nhiều hơn một nền tảng, hãy chọn nhạc bạn tự xác nhận riêng được phép dùng ở từng nơi.</p></div>
<p>Sự đánh đổi này là thật và đáng biết trước khi bạn xây cả một thói quen đăng bài xoay quanh nhạc thịnh hành: tài khoản Business và Creator mở ra bảng phân tích chi tiết Bài 20.4 sẽ đọc (thời gian xem, tỉ lệ xem hết), nhưng thu hẹp lại loại nhạc bạn bấm được ở "Add Sound". Không lựa chọn nào sai — chỉ cần quyết định khi đã nhìn thấy sự đánh đổi, không phải sau khi đã lỡ dồn cả tháng nội dung vào một bài nhạc thịnh hành. Với một kênh khoá học xoay quanh cuongthai.com, phía phân tích của sự đánh đổi này thường đáng chọn hơn: đọc được số liệu thời gian xem và tỉ lệ xem hết thật (Bài 20.4) cho bạn biết đúng hook và chủ đề nào thật sự hiệu quả — quan trọng hơn nhiều, tính trên cả một học kỳ, so với việc có dùng được bản nhạc đang thịnh hành đúng tuần này hay không.</p>
<p class="note-ct"><strong>Bài tiếp theo:</strong> Bài 20.4 đem bản dựng đã xong này ra trước mặt người xem thật — đăng chéo không để lộ dấu vết một bài đăng lại cẩu thả, và đọc đúng số liệu nó sinh ra.</p>

<h3>🎬 Thực hành (30–40 phút)</h3>
<div class="callout ok"><ol>
<li>Dựng một trong các clip từ phần thực hành Bài 20.2 bằng CapCut, theo đúng quy trình 10 bước ở Bài 12.4.</li>
<li>Thêm Auto captions kiểu từng chữ và đọc lại để bắt lỗi.</li>
<li>Thêm đúng một punch-in, đặt ngay lúc bắt đầu ý chính — không phải hook, không phải đoạn kết.</li>
<li>Kiểm tài khoản TikTok của bạn đang là loại nào (cá nhân, Creator hay Business), và ghi lại nguồn nhạc loại đó cho bạn dùng.</li>
</ol><p><strong>Đạt khi:</strong> bản dựng phát mượt full-screen không có khoảng chết, phụ đề đã đọc soát, có đúng một punch-in có chủ đích, và bạn biết chính xác thư viện nhạc nào tài khoản của mình thật sự dùng được.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Commercial Music Library (CML)</span><span class="v">Thư viện nhạc riêng của TikTok cho tài khoản Business, khoảng một triệu bài, được xác nhận dùng được trên TikTok.</span></div>
  <div class="kv"><span class="k">Sound Collection</span><span class="v">Thư viện nhạc riêng, có phép thương mại của Instagram cho tài khoản Business trên Reels.</span></div>
  <div class="kv"><span class="k">Phụ đề từng chữ</span><span class="v">Phụ đề nổi bật từng chữ một, đồng bộ theo giọng nói — đọc nhanh hơn một khối phụ đề tĩnh.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mọi kỹ thuật dựng từ Chương 12–17 vẫn áp dụng — nhịp cắt, phụ đề, punch-in, SFX, chữ trên màn hình — chỉ dùng sát hơn và có chủ đích hơn trong một video 20–60 giây.</li>
<li>Chuyển tài khoản TikTok hay Instagram sang Business mở bảng phân tích chi tiết nhưng khoá bộ chọn "Add Sound" vào một thư viện có phép thương mại riêng (CML trên TikTok, Sound Collection trên Instagram).</li>
<li>Nhạc được xác nhận cho công cụ Business của một nền tảng không tự động được xác nhận ở nơi khác — cùng lưu ý như thư viện Commercial Music riêng của CapCut, từ một nguồn khác.</li>
</ul>
<div class="link-card"><a href="https://ads.tiktok.com/help/article/how-to-use-the-commercial-music-library" target="_blank" rel="noopener">TikTok — Cách dùng Commercial Music Library</a></div>
</div>
`,
    },

    /* ─────────────────── 20.4 đăng & phân phối ─────────────────── */
    {
      title: '20.4 — Publishing and distributing shorts|||20.4 — Đăng & phân phối video ngắn',
      slug: 'cr-20-4-dang-phan-phoi-video-ngan',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Đăng chéo một bản gốc sạch thành nhiều bản riêng, và đọc đúng số liệu giữ chân thật thay vì tin vào lượt view thô sau khi YouTube đổi cách đếm.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 20 · Lesson 20.4</span>
<h2>One clean master, four different exports, and numbers that lie if you read them the old way</h2>
<p class="lead">The edit is done. What is left decides whether it gets seen at all: exporting once cleanly instead of re-uploading a watermarked file everywhere, and reading analytics that changed meaning partway through this year without you necessarily noticing.</p>

<h3>Cross-posting without the tells</h3>
${slide('cr-20', 12, 'Đăng chéo — một bản gốc, nhiều bản riêng')}
<p>Start from one clean master export with Watermark set to Remove (Lesson 12.4's per-export setting, not a saved preference) and write a separate description for each destination — copying one caption into all four apps is the single fastest way to look like an automated repost. Re-uploading a TikTok export straight to Reels, watermark and all, still reaches your existing followers there just fine; what actually gets throttled is the wider <strong>algorithmic distribution</strong> to people who do not already follow you, a policy Instagram confirmed back in February 2021 and Lesson 2.4 already covered. Re-exporting a clean version from CapCut for each platform costs a few extra minutes and avoids that ceiling entirely.</p>
<p>"Separate description" means more than swapping a sentence — it means writing for how each platform actually gets found, the same split Lesson 1.1 drew between the four platforms. TikTok and Reels are discovery feeds shown to strangers who do not follow you yet, so relevant hashtags earn their place in the caption. YouTube is closer to a search engine (Lesson 1.1 again), so the title and description carry more weight when they contain the words someone would actually type looking for this exact tip. The same ten words copy-pasted everywhere serves neither goal well.</p>

<h3>Reading the right numbers</h3>
${slide('cr-20', 13, 'Đọc đúng số liệu của video ngắn')}
<p>Each platform names its short-form retention signal differently, and knowing the right name is most of the battle. On <strong>TikTok Studio</strong> (<strong>Profile → menu → TikTok Studio → Analytics → Content → tap a video</strong>), the two figures that matter are <strong>Average Watch Time</strong> and <strong>Completion Rate</strong> — how long people watch and what share finish the whole clip. On <strong>YouTube</strong>, Studio's Shorts tab reports <strong>"Viewed vs. Swiped Away"</strong>, the percentage of people who chose to watch instead of scrolling past in the feed — the single strongest signal for whether a hook is working, since it measures a decision made before your one idea even starts.</p>
<p>YouTube also gives Shorts a direct, creator-controlled bridge to a longer video: the <strong>"Related video"</strong> link, set up in <strong>YouTube Studio → Content → open the Short → Related video → Save</strong>. It needs <strong>advanced feature access</strong>, and the target video must be public or unlisted — miss either condition and the option will not show up. Done right, viewers see a clickable link sitting just below your channel handle inside the Short player itself, pointing straight at the long-form video, live stream or second Short you chose.</p>
<div class="callout warn"><p><strong>"View" changed meaning on 24 August 2026:</strong> every format — long-form, Shorts, live — now counts a view the instant playback starts, with no minimum watch-time threshold, extending what already applied to Shorts alone since March 2025. YouTube states this does not affect creator earnings or Partner Program eligibility, and the old, stricter number survives in Analytics under a new name: <strong>"Engaged views."</strong> A raw view count going up after that date does not by itself mean retention improved — Engaged views, Completion Rate and Viewed vs. Swiped Away are the numbers that still mean what you think they mean.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Trap — reading a post-24/08/2026 view spike as a retention win.</strong> Since a view now counts from the very first frame, a jump in raw views can simply mean more people started the video — not that they watched more of it. Compare Engaged views, Completion Rate or Viewed vs. Swiped Away side by side with the old numbers before concluding anything actually improved.</p></div>
<p class="note-ct"><strong>Connects to the next chapter:</strong> Chapter 21 moves to vlogging — longer-form storytelling with the same cameras, a different rhythm, and a format where the "one idea only" rule of this chapter deliberately loosens.</p>

<h3>🎬 Practice (20–30 minutes)</h3>
<div class="callout ok"><ol>
<li>Export the short you edited in Lesson 20.3's practice with the correct platform settings, Watermark set to Remove, and a clear filename.</li>
<li>Write a separate description for each destination — do not reuse one caption everywhere.</li>
<li>Post it to at least two platforms from this chapter.</li>
<li>Set a reminder for 48 hours out, then check the platform-specific retention metric this lesson named for each one.</li>
</ol><p><strong>Done when:</strong> the video is live on at least two platforms with no visible watermark from another app, each with its own description, and you have read the correct retention number — not just the raw view count — on at least one of them.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Engaged views</span><span class="v">YouTube's renamed continuation of the old, stricter view metric, kept in Analytics after the 24/08/2026 counting change.</span></div>
  <div class="kv"><span class="k">Related video</span><span class="v">A creator-set link in the Shorts player pointing to a longer video, live stream or second Short on the same channel.</span></div>
  <div class="kv"><span class="k">Completion rate</span><span class="v">The share of viewers who watch a short all the way through (TikTok Studio).</span></div>
  <div class="kv"><span class="k">Cross-posting</span><span class="v">Publishing the same video, adapted, across multiple platforms.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Export one clean, watermark-free master and write a separate description per platform rather than copying one caption everywhere.</li>
<li>A watermarked repost still reaches existing followers; what gets throttled is discovery beyond them.</li>
<li>Know each platform's real retention metric by name: TikTok's Average Watch Time / Completion Rate, YouTube's Viewed vs. Swiped Away, and the creator-set Related video link back to long-form.</li>
<li>Since 24 August 2026, YouTube counts a view from the first frame with no threshold — raw views are not a retention signal any more; Engaged views is.</li>
</ul>
<div class="link-card"><a href="https://support.google.com/youtube/answer/14075157?hl=en" target="_blank" rel="noopener">YouTube Help — Add a related video to your Shorts</a></div>
<div class="link-card"><a href="https://techcrunch.com/2026/08/17/youtube-will-now-count-a-view-as-soon-as-a-video-starts-playing/" target="_blank" rel="noopener">TechCrunch — YouTube will now count a view as soon as a video starts playing</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 20 · Bài 20.4</span>
<h2>Một bản gốc sạch, bốn bản xuất khác nhau, và những con số nói dối nếu bạn đọc theo cách cũ</h2>
<p class="lead">Bản dựng đã xong. Phần còn lại quyết định nó có được ai xem hay không: xuất một lần sạch sẽ thay vì đăng lại nguyên file dính watermark ở khắp nơi, và đọc đúng số liệu vừa đổi nghĩa giữa năm nay mà không phải ai cũng để ý.</p>

<h3>Đăng chéo không để lộ dấu vết</h3>
${slide('cr-20', 12, 'Đăng chéo — một bản gốc, nhiều bản riêng')}
<p>Bắt đầu từ một bản gốc sạch, đặt Watermark thành Remove (thiết lập theo TỪNG lần xuất của Bài 12.4, không phải một tuỳ chọn lưu sẵn), rồi viết mô tả riêng cho từng nơi đến — copy một caption dán vào cả bốn app là cách nhanh nhất để trông như một bài đăng lại tự động. Đăng lại thẳng một file xuất từ TikTok lên Reels, còn nguyên watermark, vẫn tới được người theo dõi sẵn có ở đó bình thường; thứ thật sự bị hãm lại là <strong>phạm vi đề xuất</strong> rộng hơn tới những người chưa theo dõi bạn — chính sách Instagram đã xác nhận từ tháng 2/2021 mà Bài 2.4 đã nói. Xuất lại một bản sạch riêng cho từng nền tảng từ CapCut chỉ tốn thêm vài phút và tránh hẳn được cái trần đó.</p>
<p>"Mô tả riêng" không chỉ là đổi một câu — mà là viết theo đúng cách từng nền tảng thật sự giúp người ta tìm ra video, đúng ranh giới Bài 1.1 đã vẽ giữa bốn nền tảng. TikTok và Reels là luồng khám phá, hiện cho cả người lạ chưa theo dõi bạn, nên hashtag liên quan xứng đáng có mặt trong caption. YouTube gần với một cỗ máy tìm kiếm hơn (vẫn Bài 1.1), nên tiêu đề và mô tả có trọng lượng lớn hơn khi chứa đúng những từ một người thật sự sẽ gõ khi tìm đúng mẹo này. Cùng mười chữ copy-paste ở mọi nơi không phục vụ tốt cho mục tiêu nào cả.</p>

<h3>Đọc đúng số liệu</h3>
${slide('cr-20', 13, 'Đọc đúng số liệu của video ngắn')}
<p>Mỗi nền tảng gọi tên chỉ báo giữ chân video ngắn của mình một kiểu khác nhau, và biết đúng tên đã là quá nửa trận chiến. Trên <strong>TikTok Studio</strong> (<strong>Profile → menu → TikTok Studio → Analytics → Content → bấm vào một video</strong>), hai con số quan trọng là <strong>Average Watch Time</strong> (thời gian xem trung bình) và <strong>Completion Rate</strong> (tỉ lệ xem hết) — người ta xem bao lâu và bao nhiêu phần trăm xem trọn clip. Trên <strong>YouTube</strong>, tab Shorts trong Studio báo cáo <strong>"Viewed vs. Swiped Away"</strong> (xem hay lướt qua) — phần trăm người chọn xem thay vì lướt qua ngay trong luồng — chỉ báo mạnh nhất cho việc hook có ăn hay không, vì nó đo một quyết định được đưa ra trước cả khi ý chính của bạn kịp bắt đầu.</p>
<p>YouTube còn cho Shorts một cầu nối trực tiếp, do chính creator gắn, tới một video dài: link <strong>"Related video"</strong>, gắn ở <strong>YouTube Studio → Content → mở đúng Short → Related video → Save</strong>. Nó cần <strong>advanced feature access</strong>, và video được chọn phải ở chế độ công khai hoặc không công khai (unlisted) — thiếu một trong hai điều kiện thì tuỳ chọn này sẽ không hiện ra. Làm đúng, người xem sẽ thấy một link bấm được nằm ngay dưới TÊN KÊNH bên trong khung Short, dẫn thẳng tới video dài, livestream hoặc Short thứ hai bạn đã chọn.</p>
<div class="callout warn"><p><strong>"View" đổi nghĩa từ 24/08/2026:</strong> mọi định dạng — video dài, Shorts, livestream — giờ tính view ngay khi video BẮT ĐẦU phát, không còn ngưỡng thời gian xem tối thiểu, mở rộng thứ vốn đã áp dụng riêng cho Shorts từ tháng 3/2025. YouTube nói rõ điều này không ảnh hưởng doanh thu hay điều kiện Đối tác của creator, và con số cũ, chặt hơn vẫn còn trong Analytics dưới một cái tên mới: <strong>"Engaged views."</strong> Lượt view thô tăng sau ngày đó không tự nó có nghĩa là giữ chân tốt hơn — Engaged views, Completion Rate và Viewed vs. Swiped Away mới là những con số còn giữ đúng ý nghĩa bạn tưởng.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — đọc một cú tăng view sau 24/08/2026 như một chiến thắng về giữ chân.</strong> Vì view giờ tính ngay từ khung hình đầu tiên, một cú tăng view thô có thể đơn giản chỉ có nghĩa là nhiều người BẮT ĐẦU xem hơn — không phải họ xem NHIỀU hơn. So sánh Engaged views, Completion Rate hay Viewed vs. Swiped Away với số cũ trước khi kết luận có gì thật sự tốt lên.</p></div>
<p class="note-ct"><strong>Nối với chương sau:</strong> Chương 21 chuyển sang vlog — kể chuyện dài hơi hơn với cùng những chiếc máy quay, một nhịp điệu khác, và một định dạng mà luật "một ý duy nhất" của chương này chủ đích được nới lỏng ra.</p>

<h3>🎬 Thực hành (20–30 phút)</h3>
<div class="callout ok"><ol>
<li>Xuất video ngắn đã dựng ở phần thực hành Bài 20.3 đúng thông số nền tảng, Watermark đặt Remove, tên file rõ ràng.</li>
<li>Viết mô tả riêng cho từng nơi đến — đừng dùng lại một caption cho mọi nền tảng.</li>
<li>Đăng lên ít nhất hai nền tảng trong chương này.</li>
<li>Đặt lời nhắc sau 48 giờ, rồi kiểm đúng chỉ báo giữ chân riêng của từng nền tảng mà bài này đã gọi tên.</li>
</ol><p><strong>Đạt khi:</strong> video đã lên ít nhất hai nền tảng, không dính watermark của app khác, mỗi nơi có mô tả riêng, và bạn đã đọc đúng con số giữ chân — không chỉ lượt view thô — ở ít nhất một nơi.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Engaged views</span><span class="v">Tên mới của chỉ số view cũ, chặt hơn, được YouTube giữ lại trong Analytics sau khi đổi cách đếm từ 24/08/2026.</span></div>
  <div class="kv"><span class="k">Related video</span><span class="v">Link do creator tự gắn trong khung Short, trỏ tới một video dài, livestream hoặc Short thứ hai trên cùng kênh.</span></div>
  <div class="kv"><span class="k">Completion rate</span><span class="v">Tỉ lệ xem hết — phần trăm người xem trọn một video ngắn (TikTok Studio).</span></div>
  <div class="kv"><span class="k">Đăng chéo</span><span class="v">Đăng cùng một video, đã điều chỉnh, lên nhiều nền tảng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Xuất một bản gốc sạch, không watermark, và viết mô tả riêng cho từng nền tảng thay vì copy một caption đi khắp nơi.</li>
<li>Đăng lại bản dính watermark vẫn tới được người theo dõi sẵn có; thứ bị hãm lại là phạm vi được khám phá ngoài số đó.</li>
<li>Biết đúng tên chỉ báo giữ chân thật của từng nền tảng: Average Watch Time / Completion Rate của TikTok, Viewed vs. Swiped Away của YouTube, và link Related video do creator tự gắn về video dài.</li>
<li>Từ 24/08/2026, YouTube tính view ngay từ khung hình đầu, không ngưỡng — view thô không còn là chỉ báo giữ chân; Engaged views mới là.</li>
</ul>
<div class="link-card"><a href="https://support.google.com/youtube/answer/14075157?hl=en" target="_blank" rel="noopener">YouTube Help — Thêm related video cho Shorts của bạn</a></div>
<div class="link-card"><a href="https://techcrunch.com/2026/08/17/youtube-will-now-count-a-view-as-soon-as-a-video-starts-playing/" target="_blank" rel="noopener">TechCrunch — YouTube sẽ tính view ngay khi video bắt đầu phát</a></div>
</div>
`,
    },

    /* ─────────────────── 20.5 quiz ─────────────────── */
    {
      title: '20.5 — Chapter 20 check|||20.5 — Kiểm tra chương 20',
      slug: 'cr-20-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Tóm tắt chương và 10 câu hỏi tình huống về giải phẫu video ngắn, quay dồn, dựng giữ chân, và đọc số liệu sau khi đăng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 20 · Check</span>
<h2>Chapter 20 summary</h2>
<p class="lead">Ten situational questions covering the three-part anatomy of a short, shooting vertical on the Pocket 3 and iPhone, batch-shooting discipline, editing for retention, trending-music limits on Business accounts, and reading the right numbers after posting.</p>
<h3>Self-check before you move on</h3>
<div class="callout ok"><ul>
<li>Can you name the three parts of a short's anatomy, and explain why the loop is written into the script, not created with an edit transition?</li>
<li>Do you know why length limits (up to 3 minutes on Shorts/Reels, further still on TikTok/Facebook Reels) are almost never the real constraint for a 20–60-second short?</li>
<li>Can you set the Pocket 3 and iPhone to vertical, and pick 1080p vs. 3K based on whether you plan to punch in later?</li>
<li>Do you stop the camera between clips when batch-shooting, instead of recording one continuous roll?</li>
<li>Do you know which music library a Business account restricts you to on TikTok and Instagram, and why that music is not automatically cleared on other platforms?</li>
<li>Can you name TikTok's and YouTube's real retention metrics, and explain why a raw YouTube view count means less than it used to after 24 August 2026?</li>
</ul></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 20 · Kiểm tra</span>
<h2>Tóm tắt chương 20</h2>
<p class="lead">Mười câu hỏi tình huống về giải phẫu ba phần của video ngắn, quay dọc trên Pocket 3 và iPhone, kỷ luật quay dồn, dựng giữ chân, giới hạn nhạc thịnh hành trên tài khoản doanh nghiệp, và đọc đúng số liệu sau khi đăng.</p>
<h3>Tự kiểm trước khi qua chương sau</h3>
<div class="callout ok"><ul>
<li>Bạn có gọi tên được ba phần trong giải phẫu video ngắn, và giải thích được vì sao vòng lặp được viết vào kịch bản chứ không phải tạo ra bằng một hiệu ứng dựng?</li>
<li>Bạn có biết vì sao giới hạn độ dài (tới 3 phút trên Shorts/Reels, còn rộng hơn trên TikTok/Facebook Reels) gần như không bao giờ là giới hạn thật với một video ngắn 20–60 giây?</li>
<li>Bạn có cài được Pocket 3 và iPhone quay dọc, và chọn được 1080p hay 3K tuỳ theo có định punch-in sau hay không?</li>
<li>Bạn có dừng máy giữa mỗi clip khi quay dồn, thay vì quay một cuộn liên tục không?</li>
<li>Bạn có biết tài khoản Business giới hạn bạn vào thư viện nhạc nào trên TikTok và Instagram, và vì sao nhạc đó không tự động được phép dùng ở nền tảng khác?</li>
<li>Bạn có gọi tên được chỉ báo giữ chân thật của TikTok và YouTube, và giải thích được vì sao lượt view thô của YouTube bớt ý nghĩa hơn trước sau ngày 24/08/2026?</li>
</ul></div>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: "Cường's 45-second short has a strong hook, but around the 15-second mark he drifts into an unrelated story before circling back to the main point. Viewership drops mid-video even though the hook worked. Which part of Lesson 20.1's three-part anatomy did he break?|||Video ngắn 45 giây của Cường có hook rất mạnh, nhưng tới giây 15 anh lạc sang kể một chuyện không liên quan trước khi quay lại ý chính. Lượt xem rớt giữa chừng dù hook đã ăn. Anh đã phá vỡ phần nào trong ba phần giải phẫu ở Bài 20.1?",
            options: [
              'One idea only — the tangent breaks the single throughline the format needs|||Một ý duy nhất — đoạn lạc đề phá vỡ mạch ý xuyên suốt mà định dạng này cần',
              'The hook (0–3 seconds)|||Hook (0–3 giây)',
              'The loop / close|||Kết — vòng lặp',
              "The platform's length limit|||Giới hạn độ dài của nền tảng",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "The hook already earned the click — that part worked. The failure is the 'one idea' rule: a mid-video tangent breaks the single throughline short-form has no room for. 45 seconds is nowhere near any platform's length cap, so that is not the issue either.|||Hook đã ăn — phần đó không có lỗi. Lỗi nằm ở luật 'một ý duy nhất': đoạn lạc đề giữa video phá vỡ mạch ý xuyên suốt mà video ngắn không có chỗ chứa. 45 giây cũng còn rất xa giới hạn độ dài của bất kỳ nền tảng nào, nên đó không phải vấn đề.",
          },
          {
            question: "A creator ends a short by crossfading the last frame over the first frame in CapCut, hoping to fake a 'loop' feeling. Viewers still clearly notice the video ended and do not watch a second pass. What is the real problem?|||Một creator kết video ngắn bằng cách crossfade khung hình cuối chồng lên khung hình đầu trong CapCut, mong tạo cảm giác 'vòng lặp'. Người xem vẫn nhận ra rõ video đã hết và không xem tiếp lượt hai. Vấn đề thật sự nằm ở đâu?",
            options: [
              'The crossfade duration is too short|||Thời lượng crossfade quá ngắn',
              'CapCut cannot blend a first and last frame correctly|||CapCut không thể trộn đúng khung đầu và khung cuối',
              'A loop has to be written into the SCRIPT — a closing line or action that leads naturally back to the opening — not manufactured with an edit transition|||Vòng lặp phải được viết vào KỊCH BẢN — một câu hoặc hành động dẫn tự nhiên về mở đầu — không phải tạo ra bằng một hiệu ứng dựng',
              'The video needs background music to mask the seam|||Video cần nhạc nền để che điểm nối',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'Exactly the pitfall in Lesson 20.1: a loop is a writing and directing decision — matching the last line, gesture or framing to the first — not something a crossfade can manufacture after the footage already exists.|||Đúng cái bẫy Bài 20.1 đã nói: vòng lặp là quyết định viết kịch bản và đạo diễn — khớp câu, cử chỉ hay khung hình cuối với phần mở đầu — không phải thứ một crossfade tạo ra được sau khi cảnh đã quay xong.',
          },
          {
            question: 'Cường wants to post a 2-minute-30-second vertical short. Which of the four platforms from Chapter 1 would definitely reject it for being too long?|||Cường định đăng một video ngắn dọc dài 2 phút 30 giây. Nền tảng nào trong bốn nền tảng ở Chương 1 chắc chắn từ chối video vì quá dài?',
            options: [
              'YouTube Shorts — its limit is 3 minutes|||YouTube Shorts — giới hạn của nó là 3 phút',
              'Instagram Reels — its limit is also 3 minutes|||Instagram Reels — giới hạn của nó cũng là 3 phút',
              'TikTok — uploads well past this length are common|||TikTok — tải lên dài hơn thế này rất phổ biến',
              "None of them — all four accept a video this length, since each platform's short-form limit is at or above 2:30|||Không nền tảng nào — cả bốn đều nhận video dài cỡ này, vì giới hạn của mỗi nơi đều bằng hoặc dài hơn 2:30",
            ],
            correctIndex: 3,
            points: 1,
            explanation: "2:30 sits comfortably under YouTube Shorts' and Instagram Reels' 3-minute caps, well under TikTok's common 10-minute uploads, and Facebook Reels has no length cap at all. None of the four would reject it on length — which is the point of Lesson 20.1: for a 20–60-second short, length is essentially never the real constraint.|||2:30 vẫn nằm gọn dưới trần 3 phút của YouTube Shorts và Instagram Reels, còn xa mức 10 phút phổ biến của TikTok, và Facebook Reels thì không giới hạn độ dài. Không nền tảng nào từ chối vì lý do độ dài — đúng ý Bài 20.1: với video ngắn 20–60 giây, độ dài gần như không bao giờ là giới hạn thật.",
          },
          {
            question: 'Cường edits one short for both YouTube Shorts and TikTok, placing captions exactly 22% up from the bottom edge and keeping the channel name well away from the right edge. Can he be confident captions will never be covered, on every phone and every app version?|||Cường dựng một video ngắn dùng chung cho cả YouTube Shorts lẫn TikTok, đặt phụ đề cách đúng 22% từ đáy khung hình lên và giữ tên kênh cách khá xa mép phải. Anh có nên tin chắc phụ đề sẽ không bao giờ bị che, trên mọi điện thoại và mọi phiên bản app?',
            options: [
              'Yes — 22% is the official threshold TikTok publishes|||Có — 22% là ngưỡng chính thức TikTok công bố',
              'No — no platform publishes an official pixel/percentage spec for the safe zone, and interfaces change over time, so a real test clip on a real phone is still needed|||Không — không nền tảng nào công bố thông số pixel/phần trăm chính thức cho vùng an toàn, và giao diện đổi theo thời gian, nên vẫn cần tự kiểm bằng một clip thử trên điện thoại thật',
              'Yes — Instagram publishes a fixed pixel spec for the safe zone|||Có — Instagram công bố thông số pixel cố định cho vùng an toàn',
              'No — the safe zone only applies to horizontal 16:9 video|||Không — vùng an toàn chỉ áp dụng cho video ngang 16:9',
            ],
            correctIndex: 1,
            points: 1,
            explanation: "As Lesson 7.3 already established and Lesson 20.1's slide repeats: none of the three platforms publishes an official safe-zone spec, and their interfaces change. Treat any specific percentage — including the illustration on the slide — as an estimate, and verify with a real test clip on a real phone.|||Như Bài 7.3 đã lập và slide Bài 20.1 nhắc lại: không nền tảng nào trong ba nền tảng công bố thông số vùng an toàn chính thức, và giao diện của họ vẫn đổi theo thời gian. Coi mọi con số phần trăm cụ thể — kể cả hình minh hoạ trên slide — là ước lượng, và tự kiểm bằng một clip thử trên điện thoại thật.",
          },
          {
            question: 'Cường shoots a vertical 9:16 short on the Pocket 3 and plans to punch in quite a bit while editing in Lesson 20.3. Which vertical resolution should he shoot in to keep enough detail after cropping?|||Cường quay một video ngắn dọc 9:16 trên Pocket 3 và định punch-in khá nhiều lúc dựng ở Bài 20.3. Anh nên quay ở độ phân giải dọc nào để còn đủ chi tiết sau khi crop lại?',
            options: [
              'Vertical 1080p (1080×1920)|||1080p dọc (1080×1920)',
              'Vertical 2.7K (1512×2688)|||2.7K dọc (1512×2688)',
              'Shoot horizontal 16:9, then crop to vertical in the edit|||Quay ngang 16:9 rồi crop sang dọc lúc dựng',
              'Vertical 3K (1728×3072)|||3K dọc (1728×3072)',
            ],
            correctIndex: 3,
            points: 1,
            explanation: "3K vertical (1728×3072, per DJI's own spec) gives the most pixels to punch into before the image gets soft. 1080p is fine only when posting straight with no further crop or zoom, and shooting horizontal-then-cropping to vertical throws away resolution and framing on purpose from the start — the opposite of the protective-framing habit this chapter builds on.|||3K dọc (1728×3072, theo đúng spec của DJI) cho nhiều pixel nhất để punch-in mà không bị mờ. 1080p chỉ ổn khi đăng thẳng không crop/zoom thêm, còn quay ngang rồi crop sang dọc là chủ động vứt bớt độ phân giải và bố cục ngay từ đầu — ngược với đúng thói quen đóng khung phòng thủ chương này dựa vào.",
          },
          {
            question: "Cường has 10 short scripts ready for one shooting session. Which approach matches Lesson 20.2's batch-shooting discipline?|||Cường có 10 kịch bản video ngắn sẵn sàng cho một buổi quay. Cách nào khớp đúng kỷ luật quay dồn của Bài 20.2?",
            options: [
              'Stop the camera between each video, shoot 1–3 takes per hook separately, and group videos that share a topic or setting|||Dừng máy giữa mỗi video, quay riêng 1–3 take cho từng hook, và gộp các video có chung chủ đề hoặc bối cảnh',
              'Press record once and deliver all 10 scripts back to back without stopping, then cut them apart later|||Bấm quay một lần rồi đọc liền cả 10 kịch bản không dừng, cắt rời sau ở khâu dựng',
              'Shoot each video on a separate day to keep the energy fresh|||Quay mỗi video vào một ngày riêng để giữ năng lượng tươi mới',
              'Shoot every video in exactly one take, with no retakes allowed|||Quay mỗi video đúng một take duy nhất, không được quay lại',
            ],
            correctIndex: 0,
            points: 1,
            explanation: "Batching means one setup session (camera, light, mic built once) but still discrete, stopped clips per video. Recording all 10 as one unbroken roll recreates exactly the 'shoot one long take, sort it out later' problem Chapter 4 spent a whole lesson fixing — just disguised as efficiency.|||Quay dồn nghĩa là dựng máy/đèn/mic một lần, nhưng vẫn quay từng video thành clip riêng, có dừng máy giữa các video. Quay liền cả 10 kịch bản thành một cuộn không dừng chính là tái tạo lại đúng vấn đề 'quay một lèo rồi tính sau' mà cả một bài của Chương 4 đã sửa — chỉ đội lốt hiệu quả.",
          },
          {
            question: "Cường exported a short from CapCut's free tier last month with Watermark set to Remove. This month he exports again and 'Made with CapCut Desktop' appears again. Why?|||Cường xuất một video ngắn từ CapCut bằng tài khoản miễn phí tháng trước, đã đặt Watermark thành Remove. Tháng này xuất lại thì chữ 'Made with CapCut Desktop' lại xuất hiện. Vì sao?",
            options: [
              'CapCut Pro expired automatically|||CapCut Pro đã tự hết hạn',
              'He accidentally exported from a different project|||Anh vô tình xuất nhầm từ một project khác',
              'Watermark is a per-export setting, not a saved global preference — and free accounts also have a limited monthly quota of watermark-free exports before it defaults back on|||Watermark là thiết lập theo TỪNG lần xuất, không phải một tuỳ chọn lưu chung — và tài khoản miễn phí còn có hạn mức xuất-không-watermark hàng tháng, hết hạn mức là nó tự bật lại',
              'Watermark-free export only works for horizontal video, not vertical|||Xuất không-watermark chỉ áp dụng cho video ngang, không áp dụng cho video dọc',
            ],
            correctIndex: 2,
            points: 1,
            explanation: "Lesson 12.4's pitfall covers this exactly: the Watermark toggle does not 'stay off,' and free accounts have a monthly cap on watermark-free exports before it resets. Either cause has the same fix — check Watermark → Remove on every single export, which matters even more in this chapter since you are exporting shorts constantly.|||Đúng cái bẫy Bài 12.4 đã nói: nút Watermark không phải thứ 'tắt là giữ mãi', và tài khoản miễn phí có hạn mức xuất-không-watermark hàng tháng, hết là tự bật lại. Dù nguyên nhân nào, cách sửa như nhau — kiểm Watermark → Remove ở MỌI lần xuất, càng quan trọng hơn trong chương này vì bạn xuất video ngắn liên tục.",
          },
          {
            question: 'Cường switches his TikTok account to Business to see detailed Analytics. Making a new video, he taps Add Sound and can no longer find the trending track he used to use. Why?|||Cường chuyển tài khoản TikTok sang Business để xem được Analytics chi tiết. Lúc dựng video mới, anh bấm Add Sound và không còn thấy bản nhạc thịnh hành anh hay dùng trước đó. Vì sao?',
            options: [
              "A Business account's Add Sound only shows tracks from the Commercial Music Library (CML) — access to regular trending sounds is gone, per TikTok's own help page|||Add Sound của tài khoản Business chỉ hiện nhạc trong Commercial Music Library (CML) — mất quyền dùng nhạc thịnh hành thường, đúng theo trang trợ giúp chính thức của TikTok",
              'It is a temporary app glitch — restarting the app fixes it|||Đây chỉ là lỗi tạm thời của app — khởi động lại là hết',
              'The trending track was removed from TikTok entirely|||Bản nhạc thịnh hành đó đã bị gỡ khỏi TikTok hoàn toàn',
              'He needs to buy TikTok Ads to regain access to trending sounds|||Anh cần mua TikTok Ads mới lấy lại được quyền dùng nhạc thịnh hành',
            ],
            correctIndex: 0,
            points: 1,
            explanation: "Lesson 20.3 covers exactly this: TikTok locks a Business account's Add Sound picker to the CML, a library of roughly a million tracks TikTok itself calls free for businesses — but scoped to TikTok, the same kind of platform-specific clearance as CapCut's own Commercial Music library from Lesson 12.3. It is the trade-off for unlocking Analytics, not a bug.|||Đúng nội dung Bài 20.3: TikTok khoá bộ chọn Add Sound của tài khoản Business vào đúng CML — thư viện khoảng một triệu bài mà chính TikTok gọi là miễn phí cho doanh nghiệp — nhưng chỉ có phạm vi trên TikTok, cùng kiểu cấp phép riêng-nền-tảng như thư viện Commercial Music của CapCut ở Bài 12.3. Đây là cái giá đánh đổi để mở Analytics, không phải lỗi.",
          },
          {
            question: "After 24 August 2026, Cường notices the 'view' count on one of his long-form videos jumped sharply with no change in content. What should he conclude?|||Sau ngày 24/08/2026, Cường thấy lượt 'view' trên một video dài của mình tăng vọt dù nội dung không đổi. Anh nên kết luận gì?",
            options: [
              'The video genuinely went viral and retention improved a lot|||Video thật sự viral và giữ chân tăng mạnh',
              "YouTube's algorithm just started recommending his channel much more|||Thuật toán YouTube vừa bắt đầu đề xuất kênh anh nhiều hơn hẳn",
              'It is a display bug in YouTube Studio that will correct itself|||Đây là lỗi hiển thị của YouTube Studio, số liệu sẽ tự sửa lại',
              "YouTube changed how it COUNTS a view from that date — counted the moment playback starts, with no minimum watch-time threshold — so a higher raw view count does not by itself mean better retention; 'Engaged views' is the metric to compare instead|||Từ ngày đó YouTube đổi cách ĐẾM view — tính ngay khi video bắt đầu phát, không còn ngưỡng thời gian xem tối thiểu — nên view thô tăng không tự nó có nghĩa là giữ chân tốt hơn; phải so sánh bằng 'Engaged views' thay vào đó",
            ],
            correctIndex: 3,
            points: 1,
            explanation: "Confirmed by YouTube itself: from 24 August 2026 every format counts a view from the first frame, no threshold, extending what already applied to Shorts since March 2025. Monetization and Partner Program eligibility are unaffected, and the old, stricter metric survives under the name 'Engaged views' in Analytics — that is the number worth trusting for retention.|||Chính YouTube xác nhận: từ 24/08/2026 mọi định dạng tính view ngay từ khung hình đầu, không ngưỡng, mở rộng thứ vốn đã áp dụng riêng cho Shorts từ 3/2025. Doanh thu và điều kiện Đối tác không đổi, và số liệu cũ chặt hơn vẫn còn, đổi tên thành 'Engaged views' trong Analytics — đó mới là con số đáng tin để đo giữ chân.",
          },
          {
            question: "Cường wants to attach a link to his channel's 15-minute long-form video inside a Short he just posted, to route viewers onward. In YouTube Studio he opens the Short but cannot find a 'Related video' option. What is the most likely reason?|||Cường muốn gắn một link tới video dài 15 phút của kênh ngay trong một Short vừa đăng, để dẫn người xem sang xem tiếp. Vào YouTube Studio, mở đúng Short đó, anh không tìm thấy tuỳ chọn 'Related video'. Lý do hợp lý nhất là gì?",
            options: [
              'Related video only works for long-form videos under 10 minutes|||Related video chỉ hoạt động với video dài dưới 10 phút',
              'The feature requires advanced feature access, and the target video must be public or unlisted — missing either condition hides the option|||Tính năng này cần "advanced feature access", và video được chọn phải ở chế độ công khai hoặc không công khai (unlisted) — thiếu một trong hai điều kiện là không thấy tuỳ chọn',
              'Related video is mobile-app only and does not exist on the web version of Studio|||Related video chỉ có trên app di động, không có trên bản web của Studio',
              'The channel needs at least 1,000 subscribers to unlock this feature|||Kênh cần tối thiểu 1.000 người đăng ký mới mở khoá tính năng này',
            ],
            correctIndex: 1,
            points: 1,
            explanation: "Per YouTube's own Help page for this feature: it requires advanced feature access, and the video being linked to must be public or unlisted and follow Community Guidelines. Neither a duration cap nor a subscriber threshold is part of the stated requirements.|||Theo đúng trang Trợ giúp chính thức của YouTube về tính năng này: cần 'advanced feature access', và video được chọn phải ở chế độ công khai hoặc không công khai (unlisted), tuân thủ Nguyên tắc cộng đồng. Không có giới hạn thời lượng hay ngưỡng số người đăng ký nào trong yêu cầu được nêu.",
          },
        ],
      },
    },
  ],
};
