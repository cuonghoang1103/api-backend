/**
 * Content Creator — Chương 21: Vlog. Song ngữ EN/VI (.ml-en / .ml-vi).
 * Vlog là kể chuyện (kiểu vlog, Casey Neistat) · quay vlog bằng Pocket 3 (selfie,
 * gimbal, quay đêm, âm thanh môi trường) · dựng vlog (cấu trúc, montage theo
 * nhạc, kỹ thuật nối mạch) · vlog học tập & thương hiệu (build in public).
 * ⚠️ KHÔNG backtick trần trong content (dùng &#96;); `${` trong mã mẫu viết \${ ; gạch chéo ngược viết \\
 *
 * Nguồn số liệu chính (đầy đủ trong báo cáo bàn giao):
 *  - DJI Osmo Pocket 3 specs: dji.com/osmo-pocket-3/specs (bảng "Video
 *    Resolution" — Low-Light Video CHỈ 4K/1080p, CHỈ 24/25/30fps).
 *  - DJI Osmo Pocket 3 User Manual v1.0 (cập nhật 2025-08-26, dl.djicdn.com) —
 *    ba chế độ gimbal (Follow nêu đúng tên "vlogs and selfie videos"; Tilt
 *    Locked cho cảnh đổi độ cao; FPV cho xoay liên tục), FT (Selfie), Gimbal
 *    Startup Direction Forward/Backward, Selfie Flip, Screen Rotate & Capture,
 *    Directional Audio Front/Front and Back/All (chỉ mic tích hợp).
 *  - Casey Neistat: Tubefilter, "20 years of YouTube: In 2015, Casey Neistat
 *    revolutionized the vlog" (tubefilter.com, đọc 09/2026).
 *  - Điều 32 BLDS 2015: đã kiểm & dẫn nguồn ở Chương 10.4 — dùng lại.
 *  - Timelapse/Hyperlapse/Motionlapse, speed ramp: Ch17.3. J-cut/L-cut: Ch14.2.
 *    Khớp màu Pocket 3 ↔ iPhone: Ch15.4. Hook/cấu trúc "nhưng/vì vậy": Ch3.
 */
import { gallery, slide } from './_slides.mjs';

const SLIDES = [
  [1, 'Bìa chương'],
  [2, 'Bản đồ chương'],
  [3, 'Một ngày vlog — sáu khung hình'],
  [4, 'Bốn kiểu vlog cho kênh của bạn'],
  [5, 'Cài đặt Pocket 3 cho một buổi vlog'],
  [6, 'Ba chế độ gimbal — chọn đúng cho vlog'],
  [7, 'Quay đêm — Low-Light Video'],
  [8, 'Kiểu shot & chuyển cảnh trong vlog'],
  [9, 'Cấu trúc dựng: cold open → tiêu đề → nhịp → kết'],
  [10, 'Montage theo nhạc'],
  [11, 'Dựng vlog tự nhiên — dùng lại kỹ thuật đã học'],
  [12, 'Build in public — quay tiến độ cuongthai.com'],
  [13, 'Vòng lặp thương hiệu đều đặn'],
  [14, 'Bảng tra nhanh — Chương 21'],
  [15, 'Thực hành'],
];

export default {
  title: 'Chapter 21 — Vlogs|||Chương 21 — Vlog',
  description: 'Biến một ngày bình thường thành một câu chuyện xem được: kiểu vlog nào hợp kênh của bạn, quay bằng Pocket 3 (selfie, gimbal, quay đêm), dựng theo cấu trúc cold open → nhịp → kết, và dùng vlog học tập/build in public để kéo người về cuongthai.com.',
  lessons: [
    /* ─────────────────── 21.0 slide ─────────────────── */
    {
      title: '21.0 — Chapter 21 in 15 slides|||21.0 — Chương 21 trong 15 slide',
      slug: 'cr-21-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Một ngày vlog, kiểu vlog, cài đặt Pocket 3 cho selfie/quay đêm, cấu trúc dựng, montage theo nhạc và vòng lặp thương hiệu — cả chương trong 15 slide.',
      content: `
<div class="ml-en"><h2>📑 Chapter 21 in 15 slides</h2>
<p>A vlog looks like the easiest video to make — just press record and talk — and that is exactly why most first attempts are boring: no shape, no selfie technique beyond guessing, no edit structure. These 15 slides carry the shape end to end: a day as six shots (slide 3), the three gimbal modes DJI itself built for handheld shooting (slide 6), and the cold-open-to-ending structure that turns raw clips into something worth finishing (slide 9).</p>
<p>Skim them before the lessons below, then come back to slide 6 and slide 7 specifically before your first solo, low-light, or walking shoot — those two carry settings you will not want to guess at mid-take.</p></div>
<div class="ml-vi"><h2>📑 Chương 21 trong 15 slide</h2>
<p>Vlog trông như loại video dễ làm nhất — cứ bấm quay rồi nói — và chính vì vậy phần lớn lần thử đầu tiên nhạt: không có hình dạng, kỹ thuật selfie chỉ đoán mò, không có cấu trúc dựng. 15 slide này mang trọn hình dạng đó từ đầu tới cuối: một ngày gói trong sáu cú máy (slide 3), ba chế độ gimbal chính DJI dựng riêng cho quay cầm tay (slide 6), và cấu trúc từ cold open tới kết thúc biến clip thô thành thứ đáng xem hết (slide 9).</p>
<p>Lướt qua trước khi vào các bài dưới, rồi quay lại đúng slide 6 và slide 7 trước buổi quay một mình, quay đêm, hoặc quay vừa đi vừa nói đầu tiên — hai slide đó giữ những cài đặt bạn không muốn phải đoán giữa lúc đang quay.</p></div>
${gallery('cr-21', SLIDES)}
`,
    },

    /* ─────────────────── 21.1 vlog là kể chuyện ─────────────────── */
    {
      title: '21.1 — A vlog is a story, not a diary|||21.1 — Vlog là kể chuyện, không phải nhật ký',
      slug: 'cr-21-1-vlog-la-ke-chuyen',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Vì sao "một ngày quay được" khác với "một ngày kể được", bốn kiểu vlog hợp kênh của bạn, ảnh hưởng đã kiểm chứng của Casey Neistat, và kế hoạch lỏng thay cho kịch bản cứng hoặc không kế hoạch gì cả.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 21 · Lesson 21.1</span>
<h2>A day of footage is not a vlog until it has a shape</h2>
<p class="lead">Point a camera at your own life for a whole day and you get hours of clips: breakfast, the ride to class, a lecture, lunch, a bug you fixed at 11pm. None of that is a vlog yet — it is raw material. A vlog is what happens when you apply the same story bones from Chapter 3 to something that already happened instead of something you planned from a blank page. This lesson gives you that shape, four proven formats to pick from, and a planning habit that will not turn into the "shoot one long take" trap this course has been warning you about since Chapter 6.</p>

<h3>Every day already has a want, an obstacle, and a change — you just have to notice them</h3>
<p>Lesson 3.2 taught the "but / therefore" rule: a real story connects events with consequence, not with "and then." A day you actually lived already has this shape if you look for it, because days rarely go exactly as planned. You wanted to finish a feature before your 9am class, <strong>but</strong> a migration broke on the CI server, <strong>therefore</strong> you debugged it standing in line for coffee, and by evening the thing that changed is either "it shipped" or "it's still broken and here's the plan for tomorrow." That is a complete three-act structure — context, conflict, payoff — sitting inside an ordinary Tuesday.</p>
${slide('cr-21', 3, 'Một ngày vlog — sáu khung hình')}
<div class="kv-grid">
  <div class="kv"><span class="k">Muốn gì (want)</span><span class="v">What you set out to do that day — finish a bug, get to class on time, hit a deadline for cuongthai.com. State it in one sentence before you leave the house.</span></div>
  <div class="kv"><span class="k">Vướng gì (obstacle)</span><span class="v">What actually got in the way — this is the part beginners cut because it feels embarrassing. It is also the only part that makes the video worth watching.</span></div>
  <div class="kv"><span class="k">Thay đổi gì (change)</span><span class="v">What is different by the end — fixed, learned, decided, or honestly still unresolved. A vlog that ends exactly where it started has no payoff.</span></div>
</div>
<p>You do not need to invent any of this. You need to notice it happening in real time and point the camera at it — which is a completely different skill from scripting a video from zero, and it is the one this lesson is actually teaching.</p>

<h3>Four vlog shapes worth knowing by name</h3>
${slide('cr-21', 4, 'Bốn kiểu vlog cho kênh của bạn')}
<p>You do not need to invent a format either. Four shapes cover almost everything creators post, and each one gives you a different kind of natural three-act structure for free:</p>
<table>
  <tr><th>Kiểu</th><th>Cấu trúc có sẵn</th><th>Hợp khi nào</th></tr>
  <tr><td>Hằng ngày (daily)</td><td>Một ngày bất kỳ — want/obstacle/change tự nhiên xuất hiện</td><td>Muốn đăng đều, xây thói quen theo dõi</td></tr>
  <tr><td>Du lịch / sự kiện</td><td>Điểm đầu và điểm cuối đã có sẵn — chuyến đi, hội thảo, cuộc thi</td><td>Có một dịp cụ thể, không cần bịa cấu trúc</td></tr>
  <tr><td>Học tập</td><td>Mục tiêu học rõ ràng (ôn thi, làm đồ án) làm trục "muốn gì"</td><td>Đúng khán giả SV IT khoá này đang nhắm tới</td></tr>
  <tr><td>Build in public</td><td>Một mốc kỹ thuật cụ thể — trục "vướng gì" gần như tự viết sẵn</td><td>Muốn gắn thương hiệu cá nhân với cuongthai.com (Bài 21.4)</td></tr>
</table>
<p>The daily-vlog format was not invented recently, and one name comes up whenever people trace where it got popular on YouTube: <strong>Casey Neistat</strong>. According to Tubefilter's account of YouTube's history, Neistat started posting a daily vlog on March 25, 2015 — his 34th birthday — and kept the daily run going into 2016, pausing that specific format on November 19, 2016. His videos were known for a distinct style: cheeky establishing shots, handwritten on-screen notes, bold jump-cut editing, and music chosen for mood rather than just as background — and Tubefilter credits him with opening the door for the next generation of daily vloggers who mixed personal footage with a sharp visual style. None of this means you should copy his exact look; it means the "ordinary day, told with intention" format has a real track record, not just a hunch that it might work.</p>

<h3>A loose plan beats both no plan and a locked script</h3>
<p>Lesson 3.3 gave you three script depths: full script, outline, and hybrid. A vlog almost always wants the <strong>outline</strong> end of that spectrum, and here is why the other two fail it specifically. A fully scripted vlog sounds performed — the entire appeal of the format is that it looks like real life, and read-aloud lines break that illusion faster than almost any other mistake. But <em>zero</em> plan is worse, because it slides straight back into the habit this course keeps warning about since Chapter 6: hitting record and letting the camera run for twenty or thirty minutes "so you don't miss anything," which fills a card, wastes a battery, and turns editing into scrubbing through footage to find the three good minutes.</p>
<p>The fix is a <strong>loose plan</strong> (kế hoạch lỏng): before you leave the house, write four to six possible beats you expect the day to contain — not lines to say, just moments you intend to point the camera at. "Leaving for class," "the debugging session if the bug is still open," "lunch with whoever's around," "the evening work session on the website." You will not hit all of them, and things you did not plan for will happen too — that is fine. The list exists so you shoot in short, separate clips aimed at real moments, the same discipline Chapter 6 taught for talking-head shoots, just applied to a day instead of a script.</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — manufacturing drama that was not there.</strong> Faking a bigger reaction than you felt, or narrating a minor inconvenience as if it were a crisis, is the fastest way to make a daily vlog feel fake — and viewers of this format specifically are tuned to notice it, because authenticity is the entire premise. If nothing much happened today, a smaller, honest vlog beats an exaggerated one every time.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Trap — recording one continuous take "just in case."</strong> This is the exact habit Chapter 6 named as this course's habit to fix, and vlogging is where it comes back hardest, because a whole day feels like it needs continuous coverage. It does not. Shoot five to eight separate clips of ten to forty seconds each, aimed at the beats on your loose plan plus whatever surprises you — Lesson 21.2 covers exactly how to grab each one fast.</p></div>
<div class="callout ok"><p><strong>Tip:</strong> write your loose plan as a numbered list on your phone's notes app before you leave, and check off a beat the moment you have shot it. A day with five checked boxes edits together in twenty minutes; a day with two hours of undifferentiated footage does not.</p></div>

<p class="note-ct"><strong>Connects to next:</strong> Lesson 21.2 turns "point the camera at a real moment" into a physical technique — how Pocket 3's selfie tools, gimbal modes, and low-light mode let you grab each beat in a few seconds without breaking your day to fiddle with settings.</p>

<h3>🎬 Practice (20–25 minutes)</h3>
<div class="callout ok"><ol>
<li>Before your next normal day, write a loose plan of 4–6 beats using the want/obstacle/change lens — one line each, no full sentences to say on camera.</li>
<li>Pick which of the four vlog shapes (daily, travel/event, study, build in public) this particular day naturally fits.</li>
<li>At the end of the day, write one sentence each for "muốn gì," "vướng gì," and "thay đổi gì" based on what actually happened — not what you planned.</li>
</ol><p><strong>Done when:</strong> a written loose plan exists before the day starts, and you can state the day's real want/obstacle/change in three short sentences afterward.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Loose plan (kế hoạch lỏng)</span><span class="v">A short list of expected beats for the day, not a script — direction without being locked to exact words.</span></div>
  <div class="kv"><span class="k">Beat</span><span class="v">One small event or moment — same meaning as Lesson 3.2, applied here to real life instead of a written outline.</span></div>
  <div class="kv"><span class="k">Cold open</span><span class="v">Opening on a moment from later in the story before any title or context — covered fully in Lesson 21.3.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>A vlog needs the same want/obstacle/change shape as any story (Ch3.2) — an ordinary day already contains it if you watch for it.</li>
  <li>Four proven shapes: daily, travel/event, study, build in public — each gives you a natural structure for free.</li>
  <li>Daily vlogging on YouTube has a real, documented history (Casey Neistat, 2015–2016) — this is a proven format, not a guess.</li>
  <li>Use a loose plan (4–6 beats), not a full script and not zero plan — zero plan repeats the "one long take" trap this course has warned about since Chapter 6.</li>
</ul>
<div class="link-card"><a href="https://www.tubefilter.com/2025/07/09/20-years-of-youtube-2015-casey-neistat-first-vlog/" target="_blank" rel="noopener">Tubefilter — 20 years of YouTube: how Casey Neistat's 2015 daily vlog shaped the format</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 21 · Bài 21.1</span>
<h2>Một ngày quay được chưa phải là một vlog — nó cần có hình dạng</h2>
<p class="lead">Chĩa máy vào chính cuộc sống của bạn suốt một ngày, bạn có hàng giờ clip: bữa sáng, đường tới lớp, một buổi học, bữa trưa, một con bug sửa lúc 11 giờ đêm. Tất cả đó CHƯA phải vlog — nó là nguyên liệu thô. Vlog là thứ xuất hiện khi bạn áp đúng bộ khung câu chuyện của Chương 3 vào một thứ ĐÃ XẢY RA, thay vì một thứ bạn lên kế hoạch từ trang giấy trắng. Bài này cho bạn hình dạng đó, bốn khuôn mẫu đã có sẵn để chọn, và một thói quen lên kế hoạch để không rơi lại vào bẫy "quay một lèo" mà khoá này đã cảnh báo từ Chương 6.</p>

<h3>Mọi ngày đều đã có sẵn muốn gì, vướng gì, thay đổi gì — bạn chỉ cần nhận ra</h3>
<p>Bài 3.2 dạy luật "nhưng / vì vậy": một câu chuyện thật nối các sự kiện bằng hệ quả, không phải bằng "và rồi." Một ngày bạn đã thật sự sống qua đã có sẵn hình dạng đó nếu bạn chịu nhìn ra, vì ngày nào cũng hiếm khi diễn ra đúng như kế hoạch. Bạn muốn xong một tính năng trước giờ học 9 giờ sáng, <strong>nhưng</strong> một migration vỡ trên server CI, <strong>vì vậy</strong> bạn gỡ lỗi ngay khi đang xếp hàng mua cà phê, và tới tối thứ thay đổi là "đã lên được" hoặc "vẫn hỏng và đây là kế hoạch cho ngày mai." Đó là một cấu trúc ba hồi trọn vẹn — bối cảnh, xung đột, trả thưởng — nằm sẵn trong một ngày thứ Ba bình thường.</p>
${slide('cr-21', 3, 'Một ngày vlog — sáu khung hình')}
<div class="kv-grid">
  <div class="kv"><span class="k">Muốn gì</span><span class="v">Điều bạn định làm trong ngày đó — xong một con bug, tới lớp đúng giờ, kịp hạn cho cuongthai.com. Nói ra trong một câu trước khi ra khỏi nhà.</span></div>
  <div class="kv"><span class="k">Vướng gì</span><span class="v">Điều thật sự cản trở — đây là phần người mới hay cắt bỏ vì thấy ngại. Đây cũng là phần DUY NHẤT khiến video đáng xem.</span></div>
  <div class="kv"><span class="k">Thay đổi gì</span><span class="v">Điều khác đi lúc kết thúc — đã sửa, đã học được, đã quyết định, hoặc thành thật là vẫn chưa xong. Một vlog kết thúc y hệt lúc bắt đầu thì không có phần trả thưởng.</span></div>
</div>
<p>Bạn không cần bịa ra bất kỳ điều gì trong số này. Bạn cần nhận ra nó đang xảy ra ngay lúc đó và chĩa máy vào — đây là một kỹ năng hoàn toàn khác với viết kịch bản từ số 0, và chính là thứ bài này thật sự đang dạy.</p>

<h3>Bốn kiểu vlog đáng nhớ tên</h3>
${slide('cr-21', 4, 'Bốn kiểu vlog cho kênh của bạn')}
<p>Bạn cũng không cần tự nghĩ ra một khuôn mẫu. Bốn kiểu dưới đây phủ gần hết những gì creator hay đăng, và mỗi kiểu cho bạn một cấu trúc ba hồi tự nhiên miễn phí:</p>
<table>
  <tr><th>Kiểu</th><th>Cấu trúc có sẵn</th><th>Hợp khi nào</th></tr>
  <tr><td>Hằng ngày (daily)</td><td>Một ngày bất kỳ — muốn/vướng/thay đổi tự nhiên xuất hiện</td><td>Muốn đăng đều, xây thói quen người xem quay lại</td></tr>
  <tr><td>Du lịch / sự kiện</td><td>Điểm đầu và điểm cuối đã có sẵn — chuyến đi, hội thảo, cuộc thi</td><td>Có một dịp cụ thể, không cần bịa cấu trúc</td></tr>
  <tr><td>Học tập</td><td>Mục tiêu học rõ ràng (ôn thi, làm đồ án) làm trục "muốn gì"</td><td>Đúng khán giả SV IT khoá này đang nhắm tới</td></tr>
  <tr><td>Build in public</td><td>Một mốc kỹ thuật cụ thể — trục "vướng gì" gần như tự viết sẵn</td><td>Muốn gắn thương hiệu cá nhân với cuongthai.com (Bài 21.4)</td></tr>
</table>
<p>Kiểu vlog hằng ngày không phải mới xuất hiện gần đây, và có một cái tên hay được nhắc tới khi người ta lần lại xem nó phổ biến trên YouTube từ đâu: <strong>Casey Neistat</strong>. Theo bài viết của Tubefilter kể lại lịch sử YouTube, Neistat bắt đầu đăng vlog hằng ngày từ 25/3/2015 — đúng sinh nhật 34 tuổi — và duy trì chuỗi hằng ngày đó tới năm 2016, tạm dừng đúng định dạng này vào 19/11/2016. Video của anh nổi tiếng với một phong cách riêng: cảnh thiết lập dí dỏm, chữ viết tay chèn trên màn hình, cắt dựng táo bạo, và nhạc chọn theo không khí chứ không chỉ làm nền — và Tubefilter ghi nhận anh đã mở đường cho thế hệ vlogger hằng ngày tiếp theo, những người kết hợp cảnh quay cá nhân với một phong cách hình ảnh sắc nét. Điều này không có nghĩa bạn phải sao chép đúng phong cách của anh; nó có nghĩa định dạng "một ngày bình thường, kể có chủ đích" đã có một bề dày thật, không chỉ là một linh cảm chưa kiểm chứng.</p>

<h3>Kế hoạch lỏng thắng cả "không kế hoạch" lẫn "kịch bản khoá cứng"</h3>
<p>Bài 3.3 cho bạn ba độ sâu kịch bản: kịch bản đầy đủ, dàn ý, và lai. Một vlog gần như luôn cần đầu <strong>dàn ý (outline)</strong> của dải đó, và đây là lý do hai đầu còn lại đều hỏng riêng với vlog. Một vlog viết kịch bản đầy đủ nghe như đang diễn — toàn bộ sức hút của định dạng này là nó trông như đời thật, và câu thoại đọc sẵn phá vỡ ảo giác đó nhanh hơn gần như mọi lỗi khác. Nhưng KHÔNG có kế hoạch gì còn tệ hơn, vì nó trượt thẳng về đúng thói quen khoá này đã cảnh báo liên tục từ Chương 6: bấm quay rồi để máy chạy hai ba mươi phút "cho chắc không bỏ sót gì," làm tràn thẻ, tốn pin, và biến việc dựng thành tua tìm ba phút hay giữa cả đống footage.</p>
<p>Cách sửa là một <strong>kế hoạch lỏng</strong>: trước khi ra khỏi nhà, viết bốn tới sáu nhịp có thể xảy ra trong ngày — không phải câu thoại để đọc, chỉ là những khoảnh khắc bạn định chĩa máy vào. "Ra khỏi nhà đi học," "buổi gỡ lỗi nếu con bug vẫn còn mở," "bữa trưa với ai đang có mặt," "buổi làm việc tối cho website." Bạn sẽ không quay đủ hết mọi nhịp, và những thứ ngoài kế hoạch cũng sẽ xảy ra — vậy là ổn. Danh sách đó tồn tại để bạn quay từng clip ngắn, riêng biệt, nhắm vào khoảnh khắc thật, đúng kỷ luật Chương 6 đã dạy cho buổi quay talking-head, chỉ áp dụng cho một ngày thay vì một kịch bản.</p>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — bịa ra kịch tính không có thật.</strong> Giả vờ phản ứng to hơn cảm xúc thật, hoặc kể lại một bất tiện nhỏ như thể một cuộc khủng hoảng, là cách nhanh nhất làm một vlog hằng ngày trông giả — và người xem của đúng định dạng này lại đặc biệt nhạy với điều đó, vì tính chân thật chính là toàn bộ tiền đề. Nếu hôm nay không có gì nhiều để kể, một vlog nhỏ nhưng thật luôn thắng một vlog thổi phồng.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — quay một lèo liên tục "cho chắc".</strong> Đây đúng là thói quen Chương 6 đã gọi tên là thứ cần sửa của khoá này, và vlog là chỗ nó quay lại mạnh nhất, vì cảm giác một ngày trọn vẹn cần được phủ sóng liên tục. Không cần vậy. Quay năm tới tám clip riêng biệt, mỗi clip mười tới bốn mươi giây, nhắm vào các nhịp trong kế hoạch lỏng cộng bất ngờ dọc đường — Bài 21.2 nói đúng cách bắt từng khoảnh khắc đó thật nhanh.</p></div>
<div class="callout ok"><p><strong>Mẹo:</strong> viết kế hoạch lỏng thành danh sách đánh số trong app Ghi chú của điện thoại trước khi ra khỏi nhà, và tích vào ngay khi đã quay xong một nhịp. Một ngày có năm ô đã tích dựng xong trong hai mươi phút; một ngày có hai giờ footage không phân biệt được thì không.</p></div>

<p class="note-ct"><strong>Nối với bài sau:</strong> Bài 21.2 biến "chĩa máy vào một khoảnh khắc thật" thành một kỹ thuật cầm tay cụ thể — cách các công cụ selfie, chế độ gimbal, và chế độ quay đêm của Pocket 3 giúp bạn bắt từng nhịp trong vài giây mà không phải dừng cả ngày để loay hoay chỉnh cài đặt.</p>

<h3>🎬 Thực hành (20–25 phút)</h3>
<div class="callout ok"><ol>
<li>Trước một ngày bình thường sắp tới, viết kế hoạch lỏng 4–6 nhịp theo lăng kính muốn/vướng/thay đổi — mỗi nhịp một dòng, không viết câu thoại để đọc trước máy.</li>
<li>Chọn xem ngày đó hợp với kiểu nào trong bốn kiểu vlog (hằng ngày, du lịch/sự kiện, học tập, build in public).</li>
<li>Cuối ngày, viết một câu cho mỗi mục "muốn gì," "vướng gì," "thay đổi gì" dựa trên điều THẬT SỰ đã xảy ra — không phải điều đã lên kế hoạch.</li>
</ol><p><strong>Đạt khi:</strong> có một kế hoạch lỏng viết ra trước khi ngày bắt đầu, và bạn nói được muốn/vướng/thay đổi thật của ngày đó trong ba câu ngắn sau khi kết thúc.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Kế hoạch lỏng (loose plan)</span><span class="v">Danh sách ngắn các nhịp dự kiến trong ngày, không phải kịch bản — có hướng đi mà không bị khoá vào từng câu chữ.</span></div>
  <div class="kv"><span class="k">Beat (nhịp)</span><span class="v">Một sự kiện hoặc khoảnh khắc nhỏ — cùng nghĩa với Bài 3.2, áp dụng ở đây cho đời thật thay vì một dàn ý viết sẵn.</span></div>
  <div class="kv"><span class="k">Cold open</span><span class="v">Mở đầu bằng một khoảnh khắc thuộc phần sau của câu chuyện, trước khi có tiêu đề hay bối cảnh — nói đủ ở Bài 21.3.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Vlog cần đúng hình dạng muốn/vướng/thay đổi như mọi câu chuyện (Ch3.2) — một ngày bình thường đã có sẵn nếu bạn chịu nhìn ra.</li>
  <li>Bốn kiểu đã được kiểm chứng: hằng ngày, du lịch/sự kiện, học tập, build in public — mỗi kiểu cho một cấu trúc tự nhiên miễn phí.</li>
  <li>Vlog hằng ngày trên YouTube có lịch sử thật, có ghi chép (Casey Neistat, 2015–2016) — đây là định dạng đã được kiểm chứng, không phải một phỏng đoán.</li>
  <li>Dùng kế hoạch lỏng (4–6 nhịp), không phải kịch bản đầy đủ và cũng không phải không có gì — không có kế hoạch lặp lại đúng bẫy "quay một lèo" khoá này đã cảnh báo từ Chương 6.</li>
</ul>
<div class="link-card"><a href="https://www.tubefilter.com/2025/07/09/20-years-of-youtube-2015-casey-neistat-first-vlog/" target="_blank" rel="noopener">Tubefilter — 20 năm YouTube: vlog hằng ngày 2015 của Casey Neistat định hình thể loại thế nào</a></div>
</div>
`,
    },

    /* ─────────────────── 21.2 quay vlog bằng Pocket 3 ─────────────────── */
    {
      title: '21.2 — Shooting a vlog on the Pocket 3|||21.2 — Quay vlog bằng Pocket 3',
      slug: 'cr-21-2-quay-vlog-pocket-3',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Selfie framing bằng FT (Selfie), gimbal Follow cho vừa đi vừa nói, Low-Light Video khi trời tối, âm thanh môi trường bằng Directional Audio, và quyền quay nơi công cộng ở Việt Nam.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 21 · Lesson 21.2</span>
<h2>Every technique here exists to grab a real moment in under ten seconds</h2>
<p class="lead">Lesson 21.1 told you to shoot short, separate clips aimed at real moments instead of one long take. This lesson is the "how" — the exact Pocket 3 settings and buttons that let you pull the camera out, frame yourself, and start recording before the moment passes. Everything below is confirmed straight from DJI's own specs page and the Osmo Pocket 3 User Manual v1.0, checked 09/2026.</p>

<h3>Selfie framing: FT (Selfie), and the gimbal turning to face you</h3>
${slide('cr-21', 5, 'Cài đặt Pocket 3 cho một buổi vlog')}
<p>Pocket 3's touchscreen control menu has a dedicated <strong>FT (Selfie)</strong> icon. DJI's own manual describes it plainly: "When enabled, the camera will automatically recognize and follow your face to ensure the best selfie angle." Turn it on once before you head out and you no longer have to eyeball your own framing every time you pull the camera out mid-walk.</p>
<p>Two settings make this even faster to reach for. <strong>Gimbal Startup Direction</strong>, set to <strong>Backward</strong>, means the camera physically rotates to face you the instant you power it on — no manual flip needed before your first shot of the day. And <strong>Selfie Flip</strong> mirrors the preview image automatically, the same way a phone's front camera does, so on-screen text and your own movements read naturally while you are looking at yourself instead of the lens.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">FT (Selfie)</span><span class="v">Tự nhận diện + bám khuôn mặt để giữ đúng góc selfie — DJI User Manual v1.0.</span></div>
  <div class="kv"><span class="k">Gimbal Startup Direction = Backward</span><span class="v">Máy xoay về phía bạn ngay lúc bật nguồn — không cần tự xoay tay.</span></div>
  <div class="kv"><span class="k">Selfie Flip</span><span class="v">Lật ảnh xem trước như gương, cho cử chỉ/chữ trên màn hình nhìn tự nhiên.</span></div>
</div>
<p>One more manual-confirmed feature is built for exactly the "moment already passing" problem: <strong>Screen Rotate & Capture</strong>. DJI describes it as "the quickest way to start shooting and never miss a moment of the action" — enable it, and rotating the touchscreen clockwise both powers the camera on <em>and</em> starts recording in one motion, with the shooting mode you preset (Video, Hyperlapse, Low-Light, or a Custom Mode). For a daily vlog specifically, this is the single most useful setting in this lesson: it collapses "pull out camera → power on → find the record button" into one physical gesture.</p>

<h3>Which gimbal mode for walking and talking?</h3>
${slide('cr-21', 6, 'Ba chế độ gimbal — chọn đúng cho vlog')}
<p>Chapter 6 already introduced Pocket 3's three gimbal modes and named Follow as the right default. For vlogging specifically, DJI's own manual settles the question directly — its exact description of Follow mode is: it "is suitable for most scenarios, <strong>including vlogs and selfie videos</strong>." That is not a guess this course is making on your behalf; it is the manufacturer naming your exact use case.</p>
<p>The other two modes still have a place. <strong>Tilt Locked</strong> — pan follows your hand, tilt stays fixed, roll stays level — is DJI's own recommendation for "scenarios such as where the camera position switches between high and low," which covers a vlog-specific case Follow does not handle as cleanly: sitting down at a desk mid-walk-and-talk, or filming yourself going up and down stairs, where you do not want every hand-height change tilting the shot. <strong>FPV</strong> — rotating freely with your hand — is explicitly the least stable of the three and exists for continuously spinning, dynamic shots, not for a talking segment.</p>

<h3>Shooting at night: what Low-Light Video actually gives you</h3>
${slide('cr-21', 7, 'Quay đêm — Low-Light Video')}
<p>Pocket 3's 1-inch sensor (confirmed in Chapters 5–6) is what makes low-light footage usable at all, but the dedicated <strong>Low-Light Video</strong> mode is not just "the same recording with more brightness." DJI's manual describes the mode as automatically adjusting exposure parameters intelligently for low-light environments — and it trades away options to do it. Confirmed on DJI's own specs page: Low-Light Video is capped at <strong>4K or 1080p, at 24/25/30fps only</strong> — no 2.7K, no square or vertical formats, and none of the 48/50/60fps options Normal Video offers. The PRO parameter table in the manual confirms the same trade-off: Low-Light mode drops Focus Mode and Colors (D-Log M/HLG) entirely, leaving only Exposure, White Balance, Image Adjustment, Glamour Effects and Audio.</p>
<div class="callout warn"><p><strong>The one thing you cannot lean on at night:</strong> ActiveTrack and the Smart Gimbal Mode (Face Auto-Detect) are both on DJI's own exclusion list for Low-Light Video — confirmed the same way Chapter 10 already established for other excluded modes. At night, you frame yourself manually and hold still, or use FT (Selfie) from earlier in this lesson, which sits on a different system than ActiveTrack and is not affected by this exclusion.</p></div>

<h3>Capturing ambient sound instead of just your voice</h3>
<p>Chapter 9 covered microphone placement in general. One Pocket 3-specific setting matters for vlogging in particular: <strong>Directional Audio</strong>, set from Video mode's PRO audio parameters. DJI's manual lists three options for the built-in microphone array: <strong>Front</strong> enhances sound from in front of the camera (your voice, when you are talking to the lens), <strong>Front and Back</strong> enhances both directions, and <strong>All</strong> records sound from every direction around the camera evenly. For B-roll of the environment around you — street noise, a café, a lecture hall — <strong>All</strong> is the setting that actually captures that atmosphere instead of suppressing it in favor of your voice. One limit worth knowing before you rely on it: DJI's manual states plainly that Directional Audio is <strong>not supported when an external microphone is used</strong> — it only affects the built-in mics, so switching to a DJI Mic 2/3 for a talking segment removes this control entirely.</p>

<h3>Shot types that make up a vlog day</h3>
${slide('cr-21', 8, 'Kiểu shot & chuyển cảnh trong vlog')}
<p>Beyond selfie talking segments, four shot types round out a vlog day — three of them already fully taught elsewhere, so this lesson only points you to the right place. <strong>POV</strong> (camera at eye or hand height, your face out of frame) puts the viewer "in your shoes," and pairs naturally with Follow mode. <strong>Establishing shots</strong> (WS/EWS, Lesson 7.1) open each new beat. <strong>Environment B-roll</strong> (Lesson 10.2) is where Directional Audio's "All" setting above earns its keep. <strong>Time-compressed transitions</strong> — Timelapse, Hyperlapse, Motionlapse — were taught in full in Lesson 17.3; the only new part is WHEN to reach for them in a vlog: Hyperlapse for a walk you want condensed to a few seconds, Timelapse for a static shot of light or a room changing while you work.</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — trusting ActiveTrack or Face Auto-Detect for a night shoot because they worked fine an hour earlier in daylight.</strong> Lesson 10.3 already warned that these tracking systems are excluded from several specific modes — Low-Light Video is one of them, confirmed directly above. If your last test was in Normal mode before the sun went down, that test tells you nothing about how the camera behaves once you switch to Low-Light. Test the actual mode you will shoot in, in the actual light you will shoot in.</p></div>

<h3>Shooting in public, briefly revisited</h3>
<p>Lesson 10.4 already covered Article 32 of the 2015 Civil Code in full — the public-activity exception and the child-privacy caveat both still apply unchanged here. A daily vlog filmed walking through a crowded gate or a café, where people pass through the background without being singled out, sits inside that same exception. One addition for this format: a vlog is built around <em>you</em> as the identifiable subject on purpose — which is exactly why anyone else who becomes identifiable and central in your frame, not just passing through, is the moment to ask.</p>

<p class="note-ct"><strong>Connects to next:</strong> Lesson 21.3 takes the short separate clips this lesson taught you to grab and turns them into an edited vlog — the cold-open structure, cutting a montage to music, and which already-taught editing techniques (J-cuts, speed ramps, color matching) actually belong in a vlog.</p>

<h3>🎬 Practice (20–30 minutes)</h3>
<div class="callout ok"><ol>
<li>Turn on FT (Selfie), set Gimbal Startup Direction to Backward, and enable Screen Rotate & Capture with Video as the preset mode. Time how long it takes from "camera in pocket" to "recording, framed on your face."</li>
<li>Shoot one 20–30 second walking segment in Follow mode, talking to the lens.</li>
<li>If it is evening or indoors with the lights off, switch to Low-Light Video and shoot the same kind of segment — compare the resolution/fps options you are offered against Normal mode.</li>
<li>Set Directional Audio to All and shoot 15 seconds of pure environment B-roll — a street, a hallway, a café — with no talking.</li>
</ol><p><strong>Done when:</strong> you can start a framed selfie recording in one motion, and you can explain out loud why Low-Light Video offers fewer resolution/fps choices than Normal Video.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">FT (Selfie)</span><span class="v">Nút trên Pocket 3 tự nhận diện và bám khuôn mặt bạn để giữ đúng góc selfie.</span></div>
  <div class="kv"><span class="k">Gimbal Startup Direction</span><span class="v">Hướng máy xoay tới khi bật nguồn — Backward là quay về phía người dùng.</span></div>
  <div class="kv"><span class="k">Directional Audio</span><span class="v">Cài đặt hướng thu của mic TÍCH HỢP — Front/Front and Back/All; mất tác dụng khi cắm mic ngoài.</span></div>
  <div class="kv"><span class="k">POV (point of view)</span><span class="v">Cú máy đặt ở góc nhìn của chính bạn, mặt không lộ trong khung.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>FT (Selfie) + Gimbal Startup Direction (Backward) + Screen Rotate & Capture together turn "grab the camera" into one motion that starts a framed, recording shot.</li>
  <li>DJI's own manual names Follow mode for "vlogs and selfie videos" specifically; Tilt Locked is for changing camera height, FPV for continuous rotation.</li>
  <li>Low-Light Video trades options for exposure help: only 4K/1080p, only 24/25/30fps, no ActiveTrack or Face Auto-Detect.</li>
  <li>Directional Audio "All" (built-in mic only) captures ambient environment sound instead of suppressing it for your voice.</li>
  <li>POV, establishing shots, environment B-roll, and time-compressed transitions round out a vlog day — three of these are already fully taught in Chapters 7, 10 and 17.</li>
</ul>
<div class="link-card"><a href="https://www.dji.com/osmo-pocket-3/specs" target="_blank" rel="noopener">DJI Osmo Pocket 3 — trang thông số kỹ thuật chính thức (bảng Video Resolution)</a></div>
<div class="link-card"><a href="https://dl.djicdn.com/downloads/DJI_Osmo_Pocket_3/UM/20250826/DJI_Osmo_Pocket_3_User_Manual_v1.0_en.pdf" target="_blank" rel="noopener">DJI Osmo Pocket 3 — User Manual v1.0 (gimbal modes, FT Selfie, Directional Audio)</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 21 · Bài 21.2</span>
<h2>Mọi kỹ thuật trong bài này tồn tại để bắt một khoảnh khắc thật trong chưa tới mười giây</h2>
<p class="lead">Bài 21.1 bảo bạn quay từng clip ngắn, riêng biệt, nhắm vào khoảnh khắc thật thay vì một lèo dài. Bài này là phần "làm thế nào" — đúng những cài đặt và nút bấm của Pocket 3 giúp bạn rút máy ra, canh khung chính mình, và bấm quay trước khi khoảnh khắc trôi qua. Mọi điều dưới đây lấy thẳng từ trang thông số chính thức của DJI và User Manual v1.0 của Osmo Pocket 3, đã kiểm 09/2026.</p>

<h3>Khung selfie: FT (Selfie), và gimbal tự xoay về phía bạn</h3>
${slide('cr-21', 5, 'Cài đặt Pocket 3 cho một buổi vlog')}
<p>Menu điều khiển trên màn hình cảm ứng của Pocket 3 có riêng một biểu tượng <strong>FT (Selfie)</strong>. Chính hướng dẫn của DJI mô tả rất rõ: "Khi bật, máy sẽ tự động nhận diện và bám theo khuôn mặt bạn để đảm bảo góc selfie tốt nhất." Bật nó một lần trước khi ra khỏi nhà, và bạn không còn phải tự canh khung bằng mắt mỗi lần rút máy ra giữa chừng đang đi.</p>
<p>Hai cài đặt khác khiến việc này nhanh hơn nữa. <strong>Gimbal Startup Direction</strong> (hướng máy xoay khi khởi động), đặt thành <strong>Backward</strong>, nghĩa là máy tự xoay về phía bạn ngay khi bật nguồn — không cần tự lật tay trước cú quay đầu tiên trong ngày. Và <strong>Selfie Flip</strong> tự động lật ảnh xem trước như gương, giống cách camera trước của điện thoại vẫn làm, để chữ trên màn hình và cử động của chính bạn nhìn tự nhiên trong lúc bạn đang nhìn vào chính mình thay vì nhìn ống kính.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">FT (Selfie)</span><span class="v">Tự nhận diện + bám khuôn mặt để giữ đúng góc selfie — DJI User Manual v1.0.</span></div>
  <div class="kv"><span class="k">Gimbal Startup Direction = Backward</span><span class="v">Máy xoay về phía bạn ngay lúc bật nguồn — không cần tự xoay tay.</span></div>
  <div class="kv"><span class="k">Selfie Flip</span><span class="v">Lật ảnh xem trước như gương, cho cử chỉ/chữ trên màn hình nhìn tự nhiên.</span></div>
</div>
<p>Một tính năng nữa đã kiểm từ chính user manual, dựng ra đúng để giải quyết vấn đề "khoảnh khắc đang trôi qua": <strong>Screen Rotate & Capture</strong>. DJI mô tả đây là "cách nhanh nhất để bắt đầu quay và không bao giờ bỏ lỡ một khoảnh khắc hành động nào" — bật nó lên, xoay màn hình cảm ứng theo chiều kim đồng hồ sẽ VỪA bật nguồn máy VỪA bắt đầu quay trong đúng một động tác, theo chế độ quay bạn đã đặt trước (Video, Hyperlapse, Low-Light, hoặc một Custom Mode). Riêng với vlog hằng ngày, đây là cài đặt hữu ích nhất trong cả bài này: nó gộp "rút máy ra → bật nguồn → tìm nút quay" thành đúng một động tác vật lý.</p>

<h3>Chế độ gimbal nào cho vừa đi vừa nói?</h3>
${slide('cr-21', 6, 'Ba chế độ gimbal — chọn đúng cho vlog')}
<p>Chương 6 đã giới thiệu ba chế độ gimbal của Pocket 3 và gọi tên Follow là mặc định đúng. Riêng với vlog, chính hướng dẫn của DJI trả lời thẳng câu hỏi này — mô tả nguyên văn của họ cho chế độ Follow là: nó "hợp với hầu hết mọi tình huống, <strong>gồm cả vlog và video selfie</strong>." Đây không phải một phỏng đoán khoá học này tự đưa ra thay bạn; đó là chính hãng sản xuất gọi tên đúng tình huống bạn đang dùng.</p>
<p>Hai chế độ còn lại vẫn có chỗ đứng riêng. <strong>Tilt Locked</strong> — pan theo tay, tilt đứng yên, roll giữ ngang — là khuyến nghị của chính DJI cho "tình huống camera đổi vị trí giữa cao và thấp," đúng một trường hợp riêng của vlog mà Follow không xử lý gọn bằng: ngồi xuống bàn giữa lúc đang vừa đi vừa nói, hoặc tự quay mình lên xuống cầu thang, nơi bạn không muốn mỗi lần đổi độ cao tay lại làm nghiêng cả khung hình. <strong>FPV</strong> — xoay tự do theo tay — được nói rõ là chế độ ổn định KÉM nhất trong ba chế độ, sinh ra cho cảnh xoay liên tục, năng động, không phải cho một đoạn đang nói chuyện.</p>

<h3>Quay đêm: Low-Light Video thật sự cho bạn cái gì</h3>
${slide('cr-21', 7, 'Quay đêm — Low-Light Video')}
<p>Cảm biến 1 inch của Pocket 3 (đã kiểm ở Chương 5–6) là thứ khiến cảnh quay thiếu sáng còn dùng được, nhưng chế độ <strong>Low-Light Video</strong> riêng không chỉ đơn giản là "quay như thường nhưng sáng hơn." Hướng dẫn của DJI mô tả chế độ này tự động chỉnh thông số phơi sáng một cách thông minh cho môi trường thiếu sáng — và nó đánh đổi vài lựa chọn để làm được việc đó. Đã kiểm trên chính trang thông số của DJI: Low-Light Video bị giới hạn CHỈ ở <strong>4K hoặc 1080p, CHỈ 24/25/30fps</strong> — không có 2.7K, không có khung vuông hay dọc, và không có bất kỳ tuỳ chọn 48/50/60fps nào mà Normal Video có. Bảng tham số PRO trong hướng dẫn xác nhận đúng sự đánh đổi đó: chế độ Low-Light bỏ hẳn Focus Mode và Colors (D-Log M/HLG), chỉ còn Exposure, White Balance, Image Adjustment, Glamour Effects và Audio.</p>
<div class="callout warn"><p><strong>Một thứ bạn KHÔNG dựa vào được ban đêm:</strong> ActiveTrack và Smart Gimbal Mode (Face Auto-Detect) đều nằm trong danh sách loại trừ chính thức của DJI cho Low-Light Video — xác nhận theo đúng cách Chương 10 đã kiểm cho các chế độ bị loại trừ khác. Ban đêm, bạn tự canh khung bằng tay và giữ yên, hoặc dùng FT (Selfie) đã nói ở trên — nó nằm trên một hệ thống khác ActiveTrack, không bị ảnh hưởng bởi lệnh loại trừ này.</p></div>

<h3>Thu tiếng môi trường thay vì chỉ giọng nói</h3>
<p>Chương 9 đã dạy cách đặt micro nói chung. Có một cài đặt riêng của Pocket 3 đáng chú ý cho vlog: <strong>Directional Audio</strong>, đặt trong tham số audio PRO của chế độ Video. Hướng dẫn của DJI liệt kê ba tuỳ chọn cho dàn mic tích hợp: <strong>Front</strong> tăng cường tiếng phía trước máy (giọng bạn, khi đang nói vào ống kính), <strong>Front and Back</strong> tăng cường cả hai hướng, và <strong>All</strong> thu tiếng từ mọi hướng quanh máy đều nhau. Với B-roll môi trường xung quanh bạn — tiếng phố, một quán cà phê, một giảng đường — <strong>All</strong> mới là cài đặt thật sự bắt được không khí đó, thay vì lấn át nó để ưu tiên giọng bạn. Có một giới hạn nên biết trước khi dựa vào nó: hướng dẫn của DJI nói thẳng Directional Audio <strong>không hỗ trợ khi đã cắm mic ngoài</strong> — nó chỉ tác động lên mic tích hợp, nên chuyển sang DJI Mic 2/3 cho một đoạn nói chuyện sẽ xoá bỏ hoàn toàn cài đặt này.</p>

<h3>Các kiểu shot làm nên một ngày vlog</h3>
${slide('cr-21', 8, 'Kiểu shot & chuyển cảnh trong vlog')}
<p>Ngoài đoạn selfie nói chuyện, bốn kiểu shot làm tròn một ngày vlog — ba trong số đó đã dạy đủ ở nơi khác, bài này chỉ trỏ đúng chỗ. <strong>POV</strong> (máy ngang tầm mắt hoặc tầm tay, mặt không lộ khung) đặt người xem "vào giày" bạn, đi tự nhiên với chế độ Follow. <strong>Cảnh thiết lập</strong> (WS/EWS, Bài 7.1) mở đầu mỗi nhịp mới. <strong>B-roll môi trường</strong> (Bài 10.2) chính là chỗ Directional Audio "All" ở trên phát huy tác dụng. <strong>Chuyển cảnh nén thời gian</strong> — Timelapse, Hyperlapse, Motionlapse — đã dạy đủ ở Bài 17.3; điều mới duy nhất là KHI NÀO dùng riêng cho vlog: Hyperlapse cho một đoạn đi bộ muốn nén còn vài giây, Timelapse cho cảnh tĩnh — ánh sáng hay một căn phòng đổi dần trong lúc bạn làm việc.</p>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — tin ActiveTrack hoặc Face Auto-Detect cho một buổi quay đêm chỉ vì nó chạy tốt một giờ trước đó dưới ánh sáng ban ngày.</strong> Bài 10.3 đã cảnh báo các hệ thống bám theo này bị loại trừ khỏi vài chế độ cụ thể — Low-Light Video là một trong số đó, đã xác nhận ngay trên. Nếu lần thử cuối của bạn là ở chế độ Normal trước khi trời tối, lần thử đó không nói lên được gì về cách máy hoạt động một khi bạn chuyển sang Low-Light. Hãy thử đúng chế độ bạn sẽ quay, trong đúng ánh sáng bạn sẽ quay.</p></div>

<h3>Quay nơi công cộng, nhắc lại ngắn gọn</h3>
<p>Bài 10.4 đã dạy đủ Điều 32 Bộ luật Dân sự 2015 — ngoại lệ hoạt động công cộng và lưu ý về trẻ em vẫn áp dụng nguyên vẹn ở đây, không đổi gì riêng cho vlog. Một vlog hằng ngày quay khi đi qua cổng trường đông người hay một quán cà phê, nơi người khác xuất hiện trong hậu cảnh mà không bị tách riêng ra, nằm trong đúng ngoại lệ đó. Thêm một điều riêng cho định dạng này: một vlog dựng quanh CHÍNH BẠN làm chủ thể nhận diện được, có chủ đích — chính vì vậy, ai khác trở nên nhận diện được và là trung tâm khung hình, chứ không chỉ đi ngang qua, mới là lúc cần hỏi.</p>

<p class="note-ct"><strong>Nối với bài sau:</strong> Bài 21.3 lấy những clip ngắn, riêng biệt bài này dạy bạn cách bắt, và biến chúng thành một vlog đã dựng — cấu trúc cold open, cắt một đoạn montage theo nhạc, và những kỹ thuật dựng đã học (J-cut, speed ramp, khớp màu) thật sự thuộc về đâu trong một vlog.</p>

<h3>🎬 Thực hành (20–30 phút)</h3>
<div class="callout ok"><ol>
<li>Bật FT (Selfie), đặt Gimbal Startup Direction thành Backward, và bật Screen Rotate & Capture với chế độ đặt trước là Video. Bấm giờ xem mất bao lâu từ "máy trong túi" tới "đang quay, khung hình đúng mặt bạn."</li>
<li>Quay một đoạn đi bộ 20–30 giây ở chế độ Follow, nói chuyện với ống kính.</li>
<li>Nếu đang tối hoặc trong nhà tắt đèn, chuyển sang Low-Light Video và quay cùng kiểu đoạn đó — so sánh các tuỳ chọn độ phân giải/fps được cho với chế độ Normal.</li>
<li>Đặt Directional Audio thành All và quay 15 giây B-roll môi trường thuần — một con phố, một hành lang, một quán cà phê — không nói gì.</li>
</ol><p><strong>Đạt khi:</strong> bạn bấm quay được một cảnh selfie đã canh khung trong đúng một động tác, và giải thích được thành tiếng vì sao Low-Light Video cho ít lựa chọn độ phân giải/fps hơn Normal Video.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">FT (Selfie)</span><span class="v">Nút trên Pocket 3 tự nhận diện và bám khuôn mặt bạn để giữ đúng góc selfie.</span></div>
  <div class="kv"><span class="k">Gimbal Startup Direction</span><span class="v">Hướng máy xoay tới khi bật nguồn — Backward là quay về phía người dùng.</span></div>
  <div class="kv"><span class="k">Directional Audio</span><span class="v">Cài đặt hướng thu của mic TÍCH HỢP — Front/Front and Back/All; mất tác dụng khi cắm mic ngoài.</span></div>
  <div class="kv"><span class="k">POV (point of view)</span><span class="v">Cú máy đặt ở góc nhìn của chính bạn, mặt không lộ trong khung.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>FT (Selfie) + Gimbal Startup Direction (Backward) + Screen Rotate & Capture cộng lại biến "rút máy ra" thành một động tác vừa bật máy vừa bắt đầu quay đã canh khung.</li>
  <li>Chính hướng dẫn của DJI gọi tên chế độ Follow cho "vlog và video selfie"; Tilt Locked cho đổi độ cao máy, FPV cho xoay liên tục.</li>
  <li>Low-Light Video đánh đổi lựa chọn để hỗ trợ phơi sáng: chỉ 4K/1080p, chỉ 24/25/30fps, không ActiveTrack hay Face Auto-Detect.</li>
  <li>Directional Audio "All" (chỉ mic tích hợp) bắt tiếng môi trường thay vì lấn át nó để ưu tiên giọng bạn.</li>
  <li>POV, cảnh thiết lập, B-roll môi trường, và chuyển cảnh nén thời gian làm tròn một ngày vlog — ba trong số này đã dạy đủ ở Chương 7, 10 và 17.</li>
</ul>
<div class="link-card"><a href="https://www.dji.com/osmo-pocket-3/specs" target="_blank" rel="noopener">DJI Osmo Pocket 3 — trang thông số kỹ thuật chính thức (bảng Video Resolution)</a></div>
<div class="link-card"><a href="https://dl.djicdn.com/downloads/DJI_Osmo_Pocket_3/UM/20250826/DJI_Osmo_Pocket_3_User_Manual_v1.0_en.pdf" target="_blank" rel="noopener">DJI Osmo Pocket 3 — User Manual v1.0 (chế độ gimbal, FT Selfie, Directional Audio)</a></div>
</div>
`,
    },

    /* ─────────────────── 21.3 dựng vlog ─────────────────── */
    {
      title: '21.3 — Editing a vlog: structure, music, and reused technique|||21.3 — Dựng vlog: cấu trúc, nhạc và kỹ thuật đã học',
      slug: 'cr-21-3-dung-vlog',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Cấu trúc cold open → tiêu đề → nhịp → kết, cắt montage đúng theo nhạc, và ba kỹ thuật đã học (J/L-cut, speed ramp, khớp màu) áp dụng đúng chỗ vào vlog.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 21 · Lesson 21.3</span>
<h2>Editing a vlog is mostly deciding what order to tell the truth in</h2>
<p class="lead">You now have five to eight short clips from a real day. This lesson turns them into a finished vlog — one structure that works for almost any day, one technique for cutting a montage to music, and a short map of which editing tools you already own (Chapters 14, 15 and 17) actually belong in this specific format. Nothing here is a new tool; it is where the tools you already learned go.</p>

<h3>The structure: cold open → title → beats → ending</h3>
${slide('cr-21', 9, 'Cấu trúc dựng: cold open → tiêu đề → nhịp → kết')}
<p>Lesson 3.1 already taught you why the first seconds decide everything — a <strong>cold open</strong> is that lesson applied to a vlog specifically: open on the single best moment from later in the day, with no context and no explanation yet, purely to earn the next ten seconds. Only after that does a short title card mark "this is officially the vlog now" — a second or two, just your channel or the day's theme. From there, the middle of the video moves through the beats from your loose plan (Lesson 21.1) in whatever order tells the story best, not necessarily the order they happened in — the same "but/therefore over and-then" logic from Lesson 3.2 applies to reordering a real day exactly as it applies to a scripted video. The video closes by paying back the cold open: if you opened on a bug finally getting fixed, close on the fix, or on your honest reflection about it, then one call to action — not more than one, exactly as Lesson 3.3 taught.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Cold open</span><span class="v">Best moment from later, no context yet — the hook (Ch3.1) applied to a real day.</span></div>
  <div class="kv"><span class="k">Title card</span><span class="v">1–2 seconds, marks the vlog's official start.</span></div>
  <div class="kv"><span class="k">Beats</span><span class="v">Your loose-plan moments, reordered for story if needed — not necessarily chronological.</span></div>
  <div class="kv"><span class="k">Ending + CTA</span><span class="v">Pays back the cold open, then exactly one call to action.</span></div>
</div>

<h3>Cutting a montage to the beat</h3>
${slide('cr-21', 10, 'Montage theo nhạc')}
<p>Several beats in a vlog usually do not need dialogue at all — a few seconds each of walking, working, or an environment shot, cut together under music. Lesson 12.3 already taught you the exact mechanic for this: mark beats on a music clip in CapCut with <strong>⌘J</strong>, then cut your video clips so the cut points land on those markers instead of wherever the raw footage happens to end. The slide shows the shape of it: four clips of different lengths, all landing their cuts exactly where the music markers sit. This is not new technique — it is the one specific place in a vlog where Lesson 12.3's beat-marking earns its keep, because a montage without dialogue is the one segment where the music's rhythm, not the words, carries the pacing.</p>

<h3>Three tools you already own, applied to vlog editing</h3>
${slide('cr-21', 11, 'Dựng vlog tự nhiên — dùng lại kỹ thuật đã học')}
<table>
  <tr><th>Kỹ thuật</th><th>Áp dụng vào vlog</th><th>Đã dạy ở đâu</th></tr>
  <tr><td>J-cut / L-cut</td><td>Let your voiceover from one beat start over the tail of the previous shot, or let a shot's audio continue a beat after the picture has cut — a vlog stitched entirely with hard cuts feels choppy in a way viewers notice even without naming it.</td><td>Lesson 14.2</td></tr>
  <tr><td>Speed ramp</td><td>A brief dip into slow motion at the one genuinely memorable second in a montage — not the whole clip, just the moment that deserves the extra beat of attention.</td><td>Lesson 17.3</td></tr>
  <tr><td>Color matching</td><td>If you shot both Pocket 3 and iPhone the same day (Lesson 10.1's A-cam/B-cam setup works for vlogging too), match them once so cuts between cameras do not read as a color shift.</td><td>Lesson 15.4</td></tr>
</table>
<p>None of these are vlog-specific tools — they are general editing technique applied with a specific eye toward what makes a vlog feel like a coherent day instead of a pile of unrelated clips. If you find yourself reaching for a fourth or fifth effect on top of these three, that is usually a sign the story structure needs work, not the effects.</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — cutting strictly in the order you filmed.</strong> Real days rarely peak at the right moment for a story. If the best moment happened at 2pm and the video is structured 9am → 10pm in order, the payoff lands in the middle and the ending goes flat. Reorder beats around the story shape from Lesson 21.1, the same way Lesson 3.2 already warned against telling any story in strict chronological order.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Trap — a hard cut on every single edit because it is the default.</strong> Lesson 14.2 taught hard cuts as the correct default for the majority of any video's runtime — that still holds here. The trap is using ONLY hard cuts everywhere a J-cut would smooth a voiceover transition, which is a common vlog-specific miss because there is no dialogue-heavy interview forcing you to notice it.</p></div>

<p class="note-ct"><strong>Connects to next:</strong> Lesson 21.4 takes this exact structure and technique and points it at a specific goal — study vlogs and build-in-public videos that pull viewers back to cuongthai.com, not just views for their own sake.</p>

<h3>🎬 Practice (25–35 minutes)</h3>
<div class="callout ok"><ol>
<li>From the clips you shot in Lesson 21.2's practice, pick the single best moment and use it as your cold open — no context yet.</li>
<li>Add a 1–2 second title card, then order the remaining beats for story rather than strict chronology.</li>
<li>Mark beats on a music track with ⌘J and cut at least three clips to land on those markers.</li>
<li>Add one J-cut or L-cut where a voiceover crosses a cut, and one brief speed ramp on your single most memorable second.</li>
</ol><p><strong>Done when:</strong> the edit opens on your best moment, closes by paying it back with one CTA, and has at least one music-synced cut and one J/L-cut.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Cold open</span><span class="v">Opening on a later moment before any title or context — Lesson 3.1's hook, applied to real footage.</span></div>
  <div class="kv"><span class="k">Title card</span><span class="v">A short 1–2 second on-screen title marking the vlog's official start after the cold open.</span></div>
  <div class="kv"><span class="k">Beat-marking</span><span class="v">Marking a music clip's rhythm points (⌘J in CapCut, Lesson 12.3) so video cuts can land exactly on them.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Structure: cold open (best moment, no context) → title card → beats reordered for story → ending that pays back the cold open → one CTA.</li>
  <li>Montage segments cut to music use Lesson 12.3's beat-marking (⌘J) — cuts land on the marks, not wherever raw footage ends.</li>
  <li>Three already-taught tools do real work in a vlog: J/L-cuts for voiceover transitions (14.2), speed ramps for one memorable second (17.3), color matching across two cameras in one day (15.4).</li>
  <li>Reorder beats for story, not strict chronology — and do not let hard cuts be the only tool just because there is no dialogue-heavy interview forcing a J-cut into view.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 21 · Bài 21.3</span>
<h2>Dựng một vlog phần lớn là quyết định kể sự thật theo thứ tự nào</h2>
<p class="lead">Giờ bạn có năm tới tám clip ngắn từ một ngày thật. Bài này biến chúng thành một vlog hoàn chỉnh — một cấu trúc dùng được cho gần như mọi ngày, một kỹ thuật cắt montage đúng theo nhạc, và một bản đồ ngắn cho biết công cụ dựng nào bạn đã học (Chương 14, 15 và 17) thật sự thuộc về đâu trong đúng định dạng này. Không có công cụ mới nào ở đây cả — chỉ là chỗ đứng của những công cụ bạn đã học.</p>

<h3>Cấu trúc: cold open → tiêu đề → nhịp → kết</h3>
${slide('cr-21', 9, 'Cấu trúc dựng: cold open → tiêu đề → nhịp → kết')}
<p>Bài 3.1 đã dạy vì sao vài giây đầu quyết định tất cả — <strong>cold open</strong> chính là bài học đó áp dụng riêng cho vlog: mở bằng đúng một khoảnh khắc hay nhất thuộc phần sau của ngày, chưa có bối cảnh, chưa giải thích gì, chỉ để kiếm được mười giây tiếp theo. Chỉ SAU đó một card tiêu đề ngắn mới đánh dấu "vlog chính thức bắt đầu từ đây" — một hai giây, chỉ tên kênh hoặc chủ đề của ngày hôm đó. Từ đó, phần giữa video đi qua các nhịp trong kế hoạch lỏng (Bài 21.1) theo bất kỳ thứ tự nào kể chuyện hay nhất, không nhất thiết đúng thứ tự đã xảy ra — đúng luật "nhưng/vì vậy hơn và rồi" của Bài 3.2 áp dụng cho việc sắp lại thứ tự một ngày thật y hệt như áp dụng cho một video có kịch bản. Video kết thúc bằng cách trả lại đúng thứ cold open đã hứa: nếu mở bằng một con bug cuối cùng cũng sửa xong, hãy kết bằng đúng lúc sửa xong đó, hoặc một suy ngẫm thành thật về nó, rồi một lời kêu gọi — không nhiều hơn một, đúng như Bài 3.3 đã dạy.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Cold open</span><span class="v">Khoảnh khắc hay nhất thuộc phần sau, chưa có bối cảnh — hook (Ch3.1) áp dụng cho một ngày thật.</span></div>
  <div class="kv"><span class="k">Card tiêu đề</span><span class="v">1–2 giây, đánh dấu vlog chính thức bắt đầu.</span></div>
  <div class="kv"><span class="k">Nhịp</span><span class="v">Các khoảnh khắc trong kế hoạch lỏng, sắp lại nếu cần — không nhất thiết theo thời gian thật.</span></div>
  <div class="kv"><span class="k">Kết + CTA</span><span class="v">Trả lại đúng thứ cold open đã hứa, rồi đúng một lời kêu gọi.</span></div>
</div>

<h3>Cắt montage đúng theo phách nhạc</h3>
${slide('cr-21', 10, 'Montage theo nhạc')}
<p>Nhiều nhịp trong một vlog thường không cần lời thoại gì cả — vài giây mỗi cảnh đi bộ, làm việc, hoặc một cú máy môi trường, cắt liền nhau dưới nền nhạc. Bài 12.3 đã dạy đúng cơ chế cho việc này: đánh dấu phách trên clip nhạc trong CapCut bằng <strong>⌘J</strong>, rồi cắt clip hình sao cho điểm cắt rơi đúng vào những marker đó thay vì rơi bất kỳ đâu clip thô tình cờ kết thúc. Slide cho thấy đúng hình dạng đó: bốn clip độ dài khác nhau, tất cả điểm cắt đều rơi đúng chỗ marker nhạc. Đây không phải kỹ thuật mới — đây là đúng MỘT chỗ cụ thể trong vlog nơi việc đánh dấu phách của Bài 12.3 phát huy tác dụng, vì một đoạn montage không lời là đúng đoạn duy nhất mà nhịp điệu của nhạc, chứ không phải lời nói, giữ nhịp cho cả đoạn.</p>

<h3>Ba công cụ bạn đã có, áp dụng vào dựng vlog</h3>
${slide('cr-21', 11, 'Dựng vlog tự nhiên — dùng lại kỹ thuật đã học')}
<table>
  <tr><th>Kỹ thuật</th><th>Áp dụng vào vlog</th><th>Đã dạy ở đâu</th></tr>
  <tr><td>J-cut / L-cut</td><td>Để lời bạn kể của một nhịp bắt đầu trước khi cảnh trước kết thúc, hoặc để tiếng của một cảnh còn tiếp tục thêm một nhịp sau khi hình đã cắt — một vlog toàn hard cut cảm giác giật cục theo kiểu người xem nhận ra dù không gọi tên được lý do.</td><td>Bài 14.2</td></tr>
  <tr><td>Speed ramp</td><td>Hụp nhẹ vào slow motion đúng một giây thật sự đáng nhớ trong montage — không phải cả clip, chỉ đúng khoảnh khắc xứng đáng thêm một nhịp chú ý.</td><td>Bài 17.3</td></tr>
  <tr><td>Khớp màu</td><td>Nếu quay cả Pocket 3 lẫn iPhone trong cùng một ngày (bố trí A-cam/B-cam của Bài 10.1 cũng dùng được cho vlog), khớp màu một lần để chỗ cắt giữa hai máy không đọc ra như một cú lệch màu.</td><td>Bài 15.4</td></tr>
</table>
<p>Không kỹ thuật nào trong ba cái này là công cụ riêng của vlog — đó là kỹ thuật dựng chung, áp dụng với đúng con mắt nhắm vào thứ khiến một vlog cảm giác như một ngày trọn vẹn, thay vì một đống clip rời rạc. Nếu bạn thấy mình đang tìm tới hiệu ứng thứ tư, thứ năm chồng lên ba cái này, thường đó là dấu hiệu cấu trúc câu chuyện cần sửa, không phải hiệu ứng.</p>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — cắt đúng theo thứ tự đã quay.</strong> Ngày thật hiếm khi đạt đỉnh đúng lúc cho một câu chuyện. Nếu khoảnh khắc hay nhất xảy ra lúc 2 giờ chiều mà video dựng theo thứ tự 9 giờ sáng → 10 giờ tối, phần trả thưởng rơi vào giữa và cái kết trở nên nhạt. Sắp lại các nhịp theo hình dạng câu chuyện của Bài 21.1, đúng cách Bài 3.2 đã cảnh báo về việc kể bất kỳ câu chuyện nào theo đúng thứ tự thời gian.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — hard cut ở mọi chỗ cắt chỉ vì đó là mặc định.</strong> Bài 14.2 đã dạy hard cut là mặc định đúng cho phần lớn thời lượng bất kỳ video nào — điều đó vẫn đúng ở đây. Cái bẫy là dùng CHỈ hard cut ở mọi nơi lẽ ra một J-cut sẽ làm mượt một chỗ chuyển lời kể — một lỗi rất riêng của vlog vì không có một buổi phỏng vấn nhiều lời thoại nào ép bạn phải để ý tới nó.</p></div>

<p class="note-ct"><strong>Nối với bài sau:</strong> Bài 21.4 lấy đúng cấu trúc và kỹ thuật này rồi nhắm vào một mục tiêu cụ thể — vlog học tập và video build in public kéo người xem quay lại cuongthai.com, không chỉ lượt xem vì lượt xem.</p>

<h3>🎬 Thực hành (25–35 phút)</h3>
<div class="callout ok"><ol>
<li>Từ các clip đã quay ở phần thực hành Bài 21.2, chọn đúng một khoảnh khắc hay nhất và dùng làm cold open — chưa có bối cảnh gì.</li>
<li>Thêm card tiêu đề 1–2 giây, rồi sắp các nhịp còn lại theo câu chuyện thay vì đúng thứ tự thời gian.</li>
<li>Đánh dấu phách trên một track nhạc bằng ⌘J và cắt ít nhất ba clip sao cho rơi đúng vào các marker đó.</li>
<li>Thêm một J-cut hoặc L-cut ở chỗ lời kể bắc qua một điểm cắt, và một speed ramp ngắn ở đúng giây đáng nhớ nhất.</li>
</ol><p><strong>Đạt khi:</strong> bản dựng mở bằng khoảnh khắc hay nhất, kết bằng cách trả lại đúng thứ đó kèm một CTA, và có ít nhất một điểm cắt khớp nhạc cùng một J/L-cut.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Cold open</span><span class="v">Mở bằng một khoảnh khắc thuộc phần sau, trước khi có tiêu đề hay bối cảnh — hook của Bài 3.1, áp dụng cho cảnh quay thật.</span></div>
  <div class="kv"><span class="k">Card tiêu đề</span><span class="v">Một tiêu đề ngắn 1–2 giây trên màn hình, đánh dấu vlog chính thức bắt đầu sau cold open.</span></div>
  <div class="kv"><span class="k">Đánh dấu phách</span><span class="v">Đánh dấu các điểm nhịp của một clip nhạc (⌘J trong CapCut, Bài 12.3) để chỗ cắt hình rơi đúng vào đó.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Cấu trúc: cold open (khoảnh khắc hay nhất, chưa bối cảnh) → card tiêu đề → nhịp sắp lại theo câu chuyện → kết trả lại đúng thứ cold open đã hứa → một CTA.</li>
  <li>Đoạn montage cắt theo nhạc dùng đánh dấu phách của Bài 12.3 (⌘J) — điểm cắt rơi đúng vào marker, không phải bất kỳ đâu clip thô tình cờ kết thúc.</li>
  <li>Ba công cụ đã học làm việc thật trong vlog: J/L-cut cho chỗ chuyển lời kể (14.2), speed ramp cho đúng một giây đáng nhớ (17.3), khớp màu giữa hai máy trong một ngày (15.4).</li>
  <li>Sắp lại nhịp theo câu chuyện, không theo đúng thứ tự thời gian — và đừng để hard cut là công cụ duy nhất chỉ vì không có buổi phỏng vấn nhiều lời thoại nào ép bạn nhận ra cần J-cut.</li>
</ul>
</div>
`,
    },

    /* ─────────────────── 21.4 vlog học tập & thương hiệu ─────────────────── */
    {
      title: '21.4 — Study vlogs and building your brand|||21.4 — Vlog học tập & xây thương hiệu',
      slug: 'cr-21-4-vlog-hoc-tap-thuong-hieu',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Study with me, "một ngày của SV FPTU", build in public khi làm cuongthai.com, hậu trường, và vòng lặp đều đặn dẫn người xem quay lại website/khoá học.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 21 · Lesson 21.4</span>
<h2>The vlog format you were already taught how to make is also your best recruiting tool</h2>
<p class="lead">Every technique in this chapter works for any daily vlog. This lesson narrows it to two formats that do something extra for you specifically: study vlogs, which reach the exact audience Lesson 1.3 told you to target, and build-in-public vlogs, which turn the unglamorous parts of making cuongthai.com into content that pulls viewers back to the site itself. Neither needs new technique — they need a consistent angle on the same day-in-the-life structure.</p>

<h3>Study vlogs: the format that already matches your audience</h3>
<p>Lesson 1.3 asked you to write an audience persona at the intersection of what you are good at, what people need, and what you can sustain long-term — and named "a Vietnamese IT student's real self-study journey" as a strong fit for exactly this channel. A study vlog is that persona turned into a format: "study with me" sessions (long, mostly silent footage of focused work, sometimes with a productivity timer visible), or "a day in the life of an FPTU student" using the full day-shape from Lesson 21.1 — want (finish reviewing before an exam), obstacle (a concept that will not click, a scheduling conflict), change (understood it, or an honest plan for tomorrow). Both formats work because the viewer watching them is picturing their own version of that same day — which is a stronger connection than almost any other vlog subject could build with this specific audience.</p>

<h3>Build in public: filming the parts most creators cut</h3>
${slide('cr-21', 12, 'Build in public — quay tiến độ cuongthai.com')}
<p>"Build in public" means filming the process of making something — here, cuongthai.com itself — including the parts that do not look polished: a bug you have not solved yet, a design you are unsure about, a deploy that went wrong. The instinct to cut all of that out and post only the finished result is exactly backwards for this format; the unfinished, honest middle is what makes a build-in-public video different from a generic feature announcement.</p>
<div class="callout ok"><p><strong>Four steps, not a whole day's worth of footage:</strong> pick ONE real milestone (shipping a specific feature, fixing one significant bug) rather than "working on the site" in general. Shoot before, during and after using the same three-column checklist Lesson 10.4 already gave you. Record a voiceover that explains the real decisions and where you got something wrong — not just a tour of the finished result. End with a call to action pointing at the exact page or feature you just built, not the homepage.</p></div>
<p>This is also where a study vlog and a build-in-public vlog naturally merge for this specific channel: "a day of building cuongthai.com while also studying for an exam" is simultaneously both formats, and it is the single most honest representation of what this audience's actual life looks like.</p>

<h3>The loop that makes any of this a brand instead of a one-off video</h3>
${slide('cr-21', 13, 'Vòng lặp thương hiệu đều đặn')}
<p>Lesson 1.4 already established that your website is the hub every channel should point back to, and Lesson 2.3 already taught that consistency beats volume for a student's realistic posting rhythm. Vlogging fits into that same loop, not a separate one: shoot (build-in-public and everyday moments woven together) → edit (the cold-open structure from Lesson 21.3) → post with a link — in the description and pinned comment, pointing at cuongthai.com specifically, not generically → measure how much of that traffic actually reached the site (Chapter 26 covers reading this data in full) → repeat next week, consistently rather than in occasional bursts.</p>
<p>The habit worth building here is small but specific: every single vlog gets exactly one link, and that link points at the most relevant page for that specific video — the feature you just built, the course chapter you just studied from, not always the homepage. A generic homepage link measures nothing about which content actually pulled people in; a specific link tells you which day-in-the-life beats are worth repeating.</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — only filming build-in-public moments when something impressive just happened.</strong> This quietly turns a build-in-public vlog back into a polished feature announcement, the exact thing this format exists to be different from. The bug you have not fixed yet is footage too — often more watchable footage than the fix itself, because the obstacle is what Lesson 21.1 already told you makes a story worth finishing.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Trap — treating "vlog" and "the rest of this course's content" as two separate channels.</strong> A study vlog and a build-in-public vlog are not a detour from the tutorial and code-review content this course otherwise teaches — they are the same personal brand from Lesson 1.4, shot in a different format. The audience persona, the pillars, and the hub-and-spoke pointer back to cuongthai.com are identical; only the shooting and editing shape changes.</p></div>

<p class="note-ct"><strong>Connects to next:</strong> Chapter 22 shifts to the other major format this course covers — lecture and screen-recorded videos — and Chapter 26 is where you learn to read whether any of this vlogging is actually converting into traffic on cuongthai.com.</p>

<h3>🎬 Practice (25–30 minutes)</h3>
<div class="callout ok"><ol>
<li>Pick one real, specific milestone on cuongthai.com you built recently — not "the website" in general.</li>
<li>Plan a build-in-public vlog for it using Lesson 21.1's loose-plan approach: before/during/after beats, plus one honest moment where something did not go right.</li>
<li>Write the single link and CTA you will use — it must point at the specific page or feature, not the homepage.</li>
<li>If you also have a study session planned this week, decide honestly whether it is one video (a day combining both) or two separate ones, based on which beats you actually expect to shoot.</li>
</ol><p><strong>Done when:</strong> you have one specific milestone chosen, a loose plan with at least one honest "it didn't work yet" beat, and a written CTA pointing at a specific URL.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Build in public</span><span class="v">Filming the real process of building something, including the unfinished and honest parts, not just the polished result.</span></div>
  <div class="kv"><span class="k">Study with me</span><span class="v">A vlog format of extended, mostly quiet footage of focused study or work, often with a visible timer.</span></div>
  <div class="kv"><span class="k">Hub-and-spoke</span><span class="v">Every channel (YouTube, TikTok, etc.) links back to one central website — established in Lesson 1.4, reused here for vlog CTAs.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Study vlogs (study with me, a day of an FPTU student) reach the exact audience Lesson 1.3 already defined for this channel.</li>
  <li>Build in public means filming the unfinished, honest middle of making cuongthai.com — one real milestone, before/during/after, with a voiceover explaining real decisions.</li>
  <li>A study day that also includes building the site is often the single most honest video this channel can make — both formats at once.</li>
  <li>The loop is shoot → edit → post with one specific link → measure → repeat — reusing Lesson 1.4's hub-and-spoke idea and Lesson 2.3's consistency-over-volume rule, not a separate system for vlogs.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 21 · Bài 21.4</span>
<h2>Đúng định dạng vlog bạn vừa học làm cũng là công cụ chiêu mộ người xem tốt nhất</h2>
<p class="lead">Mọi kỹ thuật trong chương này dùng được cho bất kỳ vlog hằng ngày nào. Bài này thu hẹp lại thành hai định dạng làm được thêm một việc riêng cho bạn: vlog học tập, chạm đúng khán giả Bài 1.3 đã bảo bạn nhắm tới, và vlog build in public, biến những phần không hào nhoáng của việc làm cuongthai.com thành nội dung kéo người xem quay lại chính website đó. Cả hai không cần kỹ thuật mới — chúng cần một góc nhìn nhất quán trên cùng cấu trúc "một ngày" đã học.</p>

<h3>Vlog học tập: định dạng đã khớp sẵn với khán giả của bạn</h3>
<p>Bài 1.3 từng yêu cầu bạn viết chân dung khán giả ở giao điểm giữa thứ bạn giỏi, thứ người ta cần, và thứ bạn làm được lâu dài — và gọi tên "hành trình tự học thật của một sinh viên IT Việt Nam" là một lựa chọn hợp với đúng kênh này. Vlog học tập chính là chân dung đó biến thành một định dạng: buổi "study with me" (footage dài, phần lớn im lặng, tập trung làm việc, đôi khi có đồng hồ đếm giờ hiện trên màn hình), hoặc "một ngày của sinh viên FPTU" dùng đúng hình dạng một-ngày của Bài 21.1 — muốn (ôn xong trước kỳ thi), vướng (một khái niệm mãi không hiểu, một lịch trùng nhau), thay đổi (đã hiểu, hoặc một kế hoạch thành thật cho ngày mai). Cả hai định dạng hiệu quả vì người xem đang hình dung phiên bản của chính họ trong đúng ngày đó — một kết nối mạnh hơn gần như mọi chủ đề vlog khác có thể xây với đúng nhóm khán giả này.</p>

<h3>Build in public: quay đúng những phần phần lớn creator cắt bỏ</h3>
${slide('cr-21', 12, 'Build in public — quay tiến độ cuongthai.com')}
<p>"Build in public" nghĩa là quay lại quá trình làm ra một thứ — ở đây là chính cuongthai.com — kể cả những phần không đẹp: một con bug chưa sửa được, một thiết kế còn phân vân, một lần deploy hỏng. Bản năng cắt bỏ hết những thứ đó rồi chỉ đăng kết quả hoàn thiện đi ngược hoàn toàn với định dạng này; đúng phần giữa chưa xong, thành thật đó mới là thứ khiến một video build in public khác với một thông báo tính năng thông thường.</p>
<div class="callout ok"><p><strong>Bốn bước, không phải cả ngày footage:</strong> chọn ĐÚNG MỘT mốc thật (đưa ra một tính năng cụ thể, sửa một lỗi lớn) thay vì "đang làm web" chung chung. Quay trước, trong, sau theo đúng checklist 3 cột Bài 10.4 đã đưa. Ghi lại lời kể giải thích những quyết định thật và chỗ nào từng sai — không chỉ dạo qua kết quả hoàn thiện. Kết bằng một lời kêu gọi trỏ đúng vào trang hoặc tính năng vừa làm, không phải trang chủ.</p></div>
<p>Đây cũng là chỗ vlog học tập và vlog build in public tự nhiên hoà làm một cho đúng kênh này: "một ngày vừa làm cuongthai.com vừa ôn thi" đồng thời là cả hai định dạng, và đó là hình ảnh chân thật nhất về cuộc sống thật của đúng nhóm khán giả này.</p>

<h3>Vòng lặp biến tất cả điều này thành một thương hiệu, không phải một video đơn lẻ</h3>
${slide('cr-21', 13, 'Vòng lặp thương hiệu đều đặn')}
<p>Bài 1.4 đã xác lập website là trung tâm mọi kênh phải dẫn về, và Bài 2.3 đã dạy đều đặn thắng số lượng với nhịp đăng thực tế của một sinh viên. Vlog nằm trong đúng vòng lặp đó, không phải một hệ thống riêng: quay (đan xen build in public và khoảnh khắc đời thường) → dựng (cấu trúc cold open của Bài 21.3) → đăng kèm một link — trong mô tả và bình luận ghim, trỏ đúng vào cuongthai.com, không phải trỏ chung chung → đo xem bao nhiêu lượng truy cập đó thật sự tới được website (Chương 26 dạy đủ cách đọc số liệu này) → lặp lại tuần sau, đều đặn thay vì thành từng đợt thất thường.</p>
<p>Thói quen đáng xây ở đây nhỏ nhưng cụ thể: mỗi vlog chỉ có đúng một link, và link đó trỏ vào trang liên quan nhất với đúng video đó — tính năng vừa làm, chương khoá học vừa ôn — không phải lúc nào cũng là trang chủ. Một link trang chủ chung chung không đo được gì về việc nội dung nào thật sự kéo được người vào; một link cụ thể cho bạn biết nhịp nào của "một ngày" đáng lặp lại.</p>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — chỉ quay khoảnh khắc build in public khi vừa có gì đó ấn tượng xảy ra.</strong> Điều này âm thầm biến một vlog build in public trở lại thành một thông báo tính năng bóng bẩy — đúng thứ định dạng này sinh ra để khác đi. Con bug chưa sửa được cũng là thước phim — thường còn dễ xem hơn cả lúc sửa xong, vì chính trở ngại là thứ Bài 21.1 đã nói khiến một câu chuyện đáng xem tới cùng.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — coi "vlog" và "phần còn lại của nội dung khoá này" là hai kênh riêng biệt.</strong> Một vlog học tập hay build in public không phải một lối rẽ khỏi nội dung hướng dẫn/code review khoá này vẫn dạy — đó là đúng một thương hiệu cá nhân từ Bài 1.4, chỉ quay theo một định dạng khác. Chân dung khán giả, các trụ cột, và điểm trỏ hub-and-spoke về cuongthai.com giống hệt nhau; chỉ hình dạng quay và dựng đổi khác.</p></div>

<p class="note-ct"><strong>Nối với chương sau:</strong> Chương 22 chuyển sang định dạng lớn khác khoá này dạy — video bài giảng và quay màn hình — và Chương 26 là nơi bạn học đọc xem toàn bộ việc vlog này có thật sự chuyển thành lượt truy cập vào cuongthai.com hay không.</p>

<h3>🎬 Thực hành (25–30 phút)</h3>
<div class="callout ok"><ol>
<li>Chọn đúng một mốc thật, cụ thể trên cuongthai.com bạn vừa làm gần đây — không phải "cái web" nói chung.</li>
<li>Lên kế hoạch lỏng cho một vlog build in public về mốc đó theo cách Bài 21.1 đã dạy: nhịp trước/trong/sau, cộng một khoảnh khắc thành thật khi có gì đó chưa suôn sẻ.</li>
<li>Viết ra đúng một link và CTA sẽ dùng — phải trỏ vào đúng trang hoặc tính năng cụ thể, không phải trang chủ.</li>
<li>Nếu tuần này cũng có một buổi học đã lên lịch, quyết định thành thật xem nên gộp thành một video (một ngày kết hợp cả hai) hay tách thành hai video riêng, dựa trên các nhịp bạn thật sự dự kiến quay được.</li>
</ol><p><strong>Đạt khi:</strong> bạn đã chọn được một mốc cụ thể, có một kế hoạch lỏng với ít nhất một nhịp "chưa suôn sẻ" thành thật, và một CTA viết sẵn trỏ vào đúng một URL cụ thể.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Build in public</span><span class="v">Quay lại quá trình thật của việc làm ra một thứ, kể cả phần chưa xong và thành thật, không chỉ kết quả bóng bẩy.</span></div>
  <div class="kv"><span class="k">Study with me</span><span class="v">Định dạng vlog footage dài, phần lớn im lặng, tập trung học/làm việc, thường có đồng hồ đếm giờ hiện trên màn hình.</span></div>
  <div class="kv"><span class="k">Hub-and-spoke</span><span class="v">Mọi kênh (YouTube, TikTok…) đều dẫn về một website trung tâm — xác lập ở Bài 1.4, dùng lại ở đây cho CTA của vlog.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Vlog học tập (study with me, một ngày của SV FPTU) chạm đúng khán giả Bài 1.3 đã định nghĩa sẵn cho kênh này.</li>
  <li>Build in public nghĩa là quay đúng phần giữa chưa xong, thành thật của việc làm cuongthai.com — một mốc thật, trước/trong/sau, kèm lời kể giải thích quyết định thật.</li>
  <li>Một ngày vừa học vừa làm web thường là video thành thật nhất kênh này làm được — cả hai định dạng trong cùng một lúc.</li>
  <li>Vòng lặp là quay → dựng → đăng kèm một link cụ thể → đo → lặp lại — dùng lại đúng ý hub-and-spoke của Bài 1.4 và luật đều đặn thắng số lượng của Bài 2.3, không phải một hệ thống riêng cho vlog.</li>
</ul>
</div>
`,
    },

    /* ─────────────────── 21.5 quiz ─────────────────── */
    {
      title: '21.5 — Chapter 21 check|||21.5 — Kiểm tra chương 21',
      slug: 'cr-21-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Tóm tắt chương 21 và bài kiểm tra 10 câu tình huống: kể chuyện một ngày, selfie/gimbal/quay đêm bằng Pocket 3, cấu trúc dựng, và vlog học tập/thương hiệu.',
      content: `
<div class="ml-en">
<h2>📌 Chapter 21 recap</h2>
<p>A vlog is a story applied to something that already happened: notice the want/obstacle/change already inside a real day (21.1), grab short separate clips using Pocket 3's selfie and gimbal tools instead of one long take (21.2), edit with a cold-open structure and the technique you already own (21.3), and point the whole habit at study vlogs and build-in-public content that feeds your personal brand and cuongthai.com (21.4).</p>
<h3>Self-check</h3>
<ul>
<li>I can explain a real day using want/obstacle/change instead of a plain chronological list.</li>
<li>I can name all four vlog shapes and pick the right one for a given day.</li>
<li>I know which Pocket 3 gimbal mode DJI itself names for vlogs and selfies, and when to reach for the other two instead.</li>
<li>I know what Low-Light Video trades away compared to Normal Video, and that ActiveTrack/Face Auto-Detect do not work in it.</li>
<li>I can build a cold-open structure and mark beats on music for a montage cut.</li>
<li>I know which of J/L-cuts, speed ramps and color matching belongs where in a vlog edit.</li>
<li>I can plan a build-in-public vlog around one real milestone with an honest, unfinished moment included.</li>
</ul>
</div>
<div class="ml-vi">
<h2>📌 Tóm tắt Chương 21</h2>
<p>Vlog là một câu chuyện áp dụng cho thứ đã xảy ra rồi: nhận ra muốn/vướng/thay đổi đã có sẵn trong một ngày thật (21.1), bắt từng clip ngắn riêng biệt bằng công cụ selfie và gimbal của Pocket 3 thay vì quay một lèo (21.2), dựng theo cấu trúc cold open và kỹ thuật đã có sẵn (21.3), và hướng cả thói quen đó vào vlog học tập và nội dung build in public nuôi thương hiệu cá nhân cùng cuongthai.com (21.4).</p>
<h3>Tự kiểm</h3>
<ul>
<li>Tôi kể được một ngày thật bằng muốn/vướng/thay đổi thay vì một danh sách theo đúng thứ tự thời gian.</li>
<li>Tôi gọi tên được cả bốn kiểu vlog và chọn đúng kiểu cho một ngày cụ thể.</li>
<li>Tôi biết chế độ gimbal nào chính DJI gọi tên cho vlog và selfie, và khi nào nên dùng hai chế độ còn lại thay vào đó.</li>
<li>Tôi biết Low-Light Video đánh đổi gì so với Normal Video, và ActiveTrack/Face Auto-Detect không hoạt động trong đó.</li>
<li>Tôi dựng được cấu trúc cold open và đánh dấu phách trên nhạc cho một đoạn montage.</li>
<li>Tôi biết J/L-cut, speed ramp và khớp màu thuộc về đâu trong một bản dựng vlog.</li>
<li>Tôi lên kế hoạch được một vlog build in public quanh một mốc thật, có cả một khoảnh khắc thành thật chưa suôn sẻ.</li>
</ul>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'You filmed a normal Tuesday chronologically: woke up, went to class, ate lunch, fixed a bug at night, went to sleep. Following Lesson 21.1, what is the most likely reason this cut feels flat?|||Bạn quay một ngày thứ Ba bình thường theo đúng thứ tự thời gian: thức dậy, đi học, ăn trưa, sửa bug buổi tối, đi ngủ. Theo Bài 21.1, lý do nhiều khả năng nhất khiến bản dựng này nhạt là gì?',
            options: [
              'It lists events "and then" instead of showing a want, an obstacle, and a change|||Nó liệt kê sự kiện theo kiểu "và rồi" thay vì cho thấy muốn gì, vướng gì, và thay đổi gì',
              'The footage resolution was too low|||Độ phân giải cảnh quay quá thấp',
              'Daily vlogs never work on YouTube|||Vlog hằng ngày không bao giờ hiệu quả trên YouTube',
              'The video was not shot with Pocket 3|||Video không được quay bằng Pocket 3',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'Lesson 21.1 applies Lesson 3.2\'s "but/therefore over and-then" rule to a real day: a flat retelling lists events in order without a want, an obstacle that got in the way, and a change by the end. Resolution and camera choice are unrelated, and daily vlogs have a real documented track record (Casey Neistat).|||Bài 21.1 áp dụng luật "nhưng/vì vậy hơn và rồi" của Bài 3.2 vào một ngày thật: kể phẳng là liệt kê sự kiện theo thứ tự mà không có muốn gì, vướng gì cản trở, và thay đổi gì lúc kết thúc. Độ phân giải và lựa chọn máy quay không liên quan, và vlog hằng ngày có bề dày thật đã ghi chép (Casey Neistat).',
          },
          {
            question: 'According to DJI\'s own Osmo Pocket 3 User Manual, which gimbal mode is explicitly described as suitable for "vlogs and selfie videos"?|||Theo chính User Manual của DJI cho Osmo Pocket 3, chế độ gimbal nào được mô tả rõ là hợp cho "vlog và video selfie"?',
            options: [
              'FPV|||FPV',
              'Tilt Locked|||Tilt Locked',
              'Follow|||Follow',
              'SpinShot|||SpinShot',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'Lesson 21.2 quotes the manual directly: Follow "is suitable for most scenarios, including vlogs and selfie videos." Tilt Locked is for changing camera height, FPV is the least stable mode for continuous rotation, and SpinShot is a separate 90°/180° rotation effect, not a gimbal mode.|||Bài 21.2 trích thẳng hướng dẫn: Follow "hợp với hầu hết tình huống, gồm cả vlog và video selfie." Tilt Locked dành cho đổi độ cao máy, FPV là chế độ ổn định kém nhất cho xoay liên tục, còn SpinShot là một hiệu ứng xoay 90°/180° riêng, không phải một chế độ gimbal.',
          },
          {
            question: 'You want to vlog yourself sitting down at a desk mid-walk, without the shot tilting sharply as your hand height changes. Which gimbal mode fits, per DJI\'s own description?|||Bạn muốn tự quay mình ngồi xuống bàn giữa lúc đang đi, mà không muốn khung hình nghiêng gắt khi độ cao tay đổi. Chế độ gimbal nào hợp, theo đúng mô tả của DJI?',
            options: [
              'Tilt Locked|||Tilt Locked',
              'FPV|||FPV',
              'Follow|||Follow',
              'Low-Light Video|||Low-Light Video',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'DJI describes Tilt Locked as suitable for "scenarios such as where the camera position switches between high and low" — exactly this case, since tilt stays fixed while only pan follows your hand. Follow would tilt with your hand height change, FPV is even less stable, and Low-Light Video is a shooting mode, not a gimbal mode.|||DJI mô tả Tilt Locked hợp cho "tình huống camera đổi vị trí giữa cao và thấp" — đúng tình huống này, vì tilt đứng yên trong khi chỉ pan theo tay. Follow sẽ nghiêng theo độ cao tay đổi, FPV còn kém ổn định hơn, còn Low-Light Video là một chế độ quay, không phải chế độ gimbal.',
          },
          {
            question: 'You want to shoot a vlog segment after dark using Low-Light Video. Which of these can you still choose, confirmed on DJI\'s own specs page?|||Bạn muốn quay một đoạn vlog sau khi trời tối bằng Low-Light Video. Điều nào dưới đây bạn vẫn chọn được, đã xác nhận trên chính trang thông số của DJI?',
            options: [
              '4K at 60fps|||4K ở 60fps',
              '2.7K at 25fps|||2.7K ở 25fps',
              '4K at 25fps|||4K ở 25fps',
              '1080p in the 9:16 vertical format|||1080p ở định dạng dọc 9:16',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'Lesson 21.2 confirms from DJI\'s specs page that Low-Light Video is capped at 4K or 1080p, at 24/25/30fps only — 4K at 25fps is within that range. 60fps, 2.7K, and vertical/square formats are all Normal Video options not offered in Low-Light Video.|||Bài 21.2 xác nhận từ trang thông số của DJI rằng Low-Light Video chỉ giới hạn ở 4K hoặc 1080p, chỉ 24/25/30fps — 4K ở 25fps nằm trong khoảng đó. 60fps, 2.7K, và định dạng dọc/vuông đều là tuỳ chọn của Normal Video, không có trong Low-Light Video.',
          },
          {
            question: 'You switch to Low-Light Video at night and try to enable Face Auto-Detect to keep yourself framed automatically. What happens?|||Bạn chuyển sang Low-Light Video ban đêm và thử bật Face Auto-Detect để tự canh khung mình. Điều gì xảy ra?',
            options: [
              'It is not available — Low-Light Video is on DJI\'s exclusion list for ActiveTrack/Smart Gimbal Mode|||Nó không hoạt động — Low-Light Video nằm trong danh sách loại trừ ActiveTrack/Smart Gimbal Mode của DJI',
              'It works exactly the same as in Normal mode|||Nó hoạt động y hệt như ở chế độ Normal',
              'It works, but only at 1080p|||Nó vẫn hoạt động, nhưng chỉ ở 1080p',
              'It automatically switches the camera back to Normal mode|||Nó tự động chuyển máy về lại chế độ Normal',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'Lesson 21.2 confirms Low-Light Video is on the same DJI exclusion list Chapter 10 already established for ActiveTrack and the Smart Gimbal Mode (which includes Face Auto-Detect) — it simply is not available in this mode, regardless of resolution, and the camera does not silently switch modes for you.|||Bài 21.2 xác nhận Low-Light Video nằm trong đúng danh sách loại trừ của DJI mà Chương 10 đã xác lập cho ActiveTrack và Smart Gimbal Mode (gồm cả Face Auto-Detect) — nó đơn giản là không hoạt động ở chế độ này, bất kể độ phân giải, và máy không tự âm thầm đổi chế độ giúp bạn.',
          },
          {
            question: 'You want a vlog B-roll clip of café ambience — the street outside, cups clinking, conversation in the background — not your own voice. Which built-in-mic setting from DJI\'s manual fits, and what is its one limit?|||Bạn muốn một clip B-roll không khí quán cà phê — tiếng phố ngoài kia, tiếng cốc va, tiếng trò chuyện nền — không phải giọng bạn. Cài đặt mic tích hợp nào trong hướng dẫn của DJI hợp, và giới hạn duy nhất của nó là gì?',
            options: [
              'Directional Audio → Front; works the same with any external mic connected|||Directional Audio → Front; hoạt động như nhau dù có cắm mic ngoài hay không',
              'Directional Audio → All; not supported once an external microphone is connected|||Directional Audio → All; không hỗ trợ một khi đã cắm mic ngoài',
              'Wind Noise Reduction → On; works even with an external mic connected|||Wind Noise Reduction → On; vẫn hoạt động dù đã cắm mic ngoài',
              'Glamour Effects → On; has no limits|||Glamour Effects → On; không có giới hạn nào',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'Lesson 21.2 states DJI\'s manual sets Directional Audio to "All" for even pickup from every direction, and explicitly notes it is not supported when an external microphone is used — it only affects the built-in mic array. Front would enhance your voice instead of the ambience, and Wind Noise Reduction has the identical external-mic limitation (established in Chapter 6), not an exception to it.|||Bài 21.2 nói rõ hướng dẫn của DJI đặt Directional Audio thành "All" để thu đều từ mọi hướng, và nói thẳng nó không hỗ trợ khi đã cắm mic ngoài — chỉ tác động lên dàn mic tích hợp. Front sẽ tăng cường giọng bạn thay vì không khí xung quanh, còn Wind Noise Reduction có đúng giới hạn mic ngoài giống vậy (đã xác lập ở Chương 6), không phải một ngoại lệ.',
          },
          {
            question: 'A vlog opens by showing you finally fixing a stubborn bug at 11pm, with no explanation yet, before any title card appears. What editing structure is this?|||Một vlog mở đầu bằng cảnh bạn cuối cùng sửa xong một con bug khó lúc 11 giờ đêm, chưa giải thích gì, trước khi có card tiêu đề nào xuất hiện. Đây là cấu trúc dựng nào?',
            options: [
              'A jump cut|||Một jump cut',
              'A cold open|||Một cold open',
              'An L-cut|||Một L-cut',
              'A speed ramp|||Một speed ramp',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'Lesson 21.3 defines a cold open exactly this way: opening on a later, best moment with no context yet, before the title card — Lesson 3.1\'s hook applied to a real day. A jump cut and L-cut are trimming/audio techniques, and a speed ramp changes playback speed, none of which describe this structural choice.|||Bài 21.3 định nghĩa cold open đúng như vậy: mở bằng một khoảnh khắc hay nhất thuộc phần sau, chưa có bối cảnh, trước card tiêu đề — hook của Bài 3.1 áp dụng cho một ngày thật. Jump cut và L-cut là kỹ thuật cắt/âm thanh, còn speed ramp đổi tốc độ phát, không cái nào mô tả đúng lựa chọn cấu trúc này.',
          },
          {
            question: 'You are cutting a montage of walking shots under background music with no dialogue. Per Lesson 21.3, what should decide exactly where each cut lands?|||Bạn đang cắt một đoạn montage các cảnh đi bộ dưới nhạc nền, không lời thoại. Theo Bài 21.3, điều gì nên quyết định điểm cắt rơi đúng ở đâu?',
            options: [
              'Wherever each raw clip happens to end|||Bất kỳ đâu mỗi clip thô tình cờ kết thúc',
              'Exactly every 3 seconds regardless of the music|||Đúng mỗi 3 giây một lần, bất kể nhạc',
              'Beat markers placed on the music clip with ⌘J, from Lesson 12.3|||Marker phách đặt trên clip nhạc bằng ⌘J, từ Bài 12.3',
              'The order the clips were filmed in|||Đúng thứ tự các clip đã được quay',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'Lesson 21.3 points directly back to Lesson 12.3\'s beat-marking technique (⌘J on a music clip in CapCut) as the one place it earns its keep in a vlog — a dialogue-free montage is paced by the music, not the words. Cutting at raw clip ends, a fixed interval, or strict filming order ignores the music entirely.|||Bài 21.3 trỏ thẳng về kỹ thuật đánh dấu phách của Bài 12.3 (⌘J trên clip nhạc trong CapCut) là đúng chỗ nó phát huy tác dụng trong vlog — một montage không lời được giữ nhịp bởi nhạc, không phải lời nói. Cắt ở chỗ clip thô kết thúc, một khoảng cố định, hay đúng thứ tự đã quay đều bỏ qua hoàn toàn âm nhạc.',
          },
          {
            question: 'You quote-vlog a busy tech fair at FPTU where many unrelated attendees pass through your background without being singled out. Per Article 32 of the 2015 Civil Code (already covered in Lesson 10.4), what applies here?|||Bạn quay vlog tại một hội chợ công nghệ đông người ở FPTU, nơi nhiều người không liên quan đi ngang qua hậu cảnh mà không bị tách riêng ra. Theo Điều 32 Bộ luật Dân sự 2015 (đã dạy ở Bài 10.4), điều gì áp dụng ở đây?',
            options: [
              'Every visible attendee must give individual written consent first|||Mọi người có mặt phải cho phép bằng văn bản trước',
              'Vlogging in public is always illegal in Vietnam regardless of context|||Vlog nơi công cộng luôn trái luật ở Việt Nam bất kể bối cảnh',
              'The rule only applies to professional film crews, not personal vlogs|||Luật này chỉ áp dụng cho ê-kíp phim chuyên nghiệp, không áp dụng cho vlog cá nhân',
              'This falls inside the public-activity exception, as long as no one\'s dignity or reputation is harmed|||Việc này nằm trong ngoại lệ hoạt động công cộng, miễn không làm tổn hại danh dự hay uy tín của ai',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'Lesson 21.2 reapplies Lesson 10.4\'s Article 32 exception directly: images from public activities where individuals are not singled out do not require individual consent, as long as dignity and reputation are not harmed. Consent-from-everyone and "always illegal" both contradict the stated exception, and the law does not carve out an exemption for personal vlogs versus professional crews.|||Bài 21.2 áp dụng lại đúng ngoại lệ Điều 32 của Bài 10.4: hình ảnh từ hoạt động công cộng mà cá nhân không bị tách riêng ra thì không cần xin phép từng người, miễn không làm tổn hại danh dự, uy tín. "Xin phép mọi người" và "luôn trái luật" đều trái với ngoại lệ đã nêu, và luật không tách riêng một ngoại lệ cho vlog cá nhân so với ê-kíp chuyên nghiệp.',
          },
          {
            question: 'You are planning a build-in-public vlog about a feature you shipped on cuongthai.com. Per Lesson 21.4, what makes this format work rather than becoming a generic feature announcement?|||Bạn định làm một vlog build in public về một tính năng vừa lên cuongthai.com. Theo Bài 21.4, điều gì khiến định dạng này hiệu quả thay vì trở thành một thông báo tính năng thông thường?',
            options: [
              'Showing only the finished, polished result with upbeat music|||Chỉ cho xem kết quả hoàn thiện, bóng bẩy kèm nhạc sôi động',
              'Avoiding any link back to cuongthai.com so the video feels less promotional|||Tránh mọi link về cuongthai.com để video bớt cảm giác quảng cáo',
              'Filming the entire week continuously so nothing is missed|||Quay liên tục cả tuần để không bỏ sót gì',
              'Including the unfinished, honest parts — a bug not yet fixed, a decision you were unsure about — not just the polished result|||Bao gồm cả phần chưa xong, thành thật — một bug chưa sửa, một quyết định còn phân vân — không chỉ kết quả bóng bẩy',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'Lesson 21.4 states this directly: cutting out the unfinished, honest middle and posting only the polished result is "exactly backwards" for build in public — the honest struggle is what differentiates it. It also explicitly wants exactly one specific link/CTA (not zero), and recommends one real milestone with before/during/after shots, not continuous filming.|||Bài 21.4 nói thẳng: cắt bỏ phần chưa xong, thành thật rồi chỉ đăng kết quả bóng bẩy là "đi ngược hoàn toàn" với build in public — đúng cuộc vật lộn thành thật mới làm nó khác biệt. Bài cũng muốn đúng một link/CTA cụ thể (không phải không có link nào), và khuyên chọn một mốc thật với cảnh trước/trong/sau, không phải quay liên tục.',
          },
        ],
      },
    },
  ],
};
