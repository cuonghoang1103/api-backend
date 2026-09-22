/**
 * Content Creator — Chương 27: Dự án cuối khoá — 30 ngày ra mắt kênh. Song ngữ EN/VI (.ml-en / .ml-vi).
 * ⚠️ KHÔNG backtick trần trong content (dùng &#96;); `${` trong mã mẫu viết \${ ; gạch chéo ngược viết \\
 */
import { gallery, slide } from './_slides.mjs';

const SLIDES = [
  [1, 'Bìa'],
  [2, 'Bản đồ chương'],
  [3, 'Vòng lặp 10 bước — lần này chạy hết'],
  [4, 'Mục tiêu 30 ngày — mức trần & mức nhẹ'],
  [5, 'Lịch 30 ngày'],
  [6, '/creator đi cùng suốt 30 ngày'],
  [7, 'Dự án 1 — các chặng'],
  [8, 'Checklist Dự án 1'],
  [9, 'Dự án 2 — các chặng'],
  [10, 'Một buổi quay dồn'],
  [11, 'Đăng chéo đúng luật'],
  [12, 'Trước / sau — clip 60 giây'],
  [13, 'Rubric tự chấm 8 tiêu chí'],
  [14, 'Học tiếp gì'],
  [15, 'Con số khép lại 28 phần'],
  [16, '🎬 Thực hành chương 27'],
];

export default {
  title: 'Chapter 27 — Final project: launch your channel in 30 days|||Chương 27 — Dự án cuối khoá: 30 ngày ra mắt kênh',
  description: 'Chương cuối không dạy kỹ thuật mới: lắp cả khoá vào hai dự án thật — một video dài và một bộ video ngắn + vlog — rồi tự chấm bằng rubric 8 tiêu chí và quay lại đúng clip 60 giây của Mục 0 để đo tiến bộ.',
  lessons: [
    /* ─────────────────── 27.0 slide bài giảng ─────────────────── */
    {
      title: '27.0 — Chapter 27 in 16 slides|||27.0 — Chương 27 trong 16 slide',
      slug: 'cr-27-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ slide khép khoá: lịch 30 ngày, checklist hai dự án, rubric tự chấm 8 tiêu chí, và bước học tiếp — trong 16 slide.',
      content: `
<div class="ml-en"><h2>📑 Chapter 27 in 16 slides</h2>
<p>This closing deck does not teach a new skill — it is the map for two real projects and the self-check that follows them. Slide 5 is the 30-day calendar; slide 13 is the 8-criterion rubric you will use on both your projects and your two 60-second clips.</p>
<p>Skim it now, then come back after each lesson to check off what you have actually shipped — not planned, shipped.</p></div>
<div class="ml-vi"><h2>📑 Chương 27 trong 16 slide</h2>
<p>Bộ slide khép lại khoá này không dạy kỹ năng mới — nó là bản đồ cho hai dự án thật và bước tự kiểm theo sau. Slide 5 là lịch 30 ngày; slide 13 là rubric 8 tiêu chí bạn sẽ dùng cho cả hai dự án lẫn hai clip 60 giây.</p>
<p>Lướt qua ngay bây giờ, rồi quay lại sau mỗi bài để đánh dấu thứ bạn đã thật sự LÀM XONG — không phải đã lên kế hoạch, mà đã đăng.</p></div>
${gallery('cr-27', SLIDES)}
`,
    },

    /* ─────────────────── 27.1 kế hoạch 30 ngày ─────────────────── */
    {
      title: '27.1 — The 30-day plan: pick a target you can actually keep|||27.1 — Kế hoạch 30 ngày: chọn mục tiêu bạn giữ được',
      slug: 'cr-27-1-ke-hoach-30-ngay',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Capstone là gì, mục tiêu 30 ngày ở mức trần và mức nhẹ kèm ước lượng giờ/tuần, khung 4 tuần, và cách dùng /creator cho cả hai dự án.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 27 · Lesson 27.1</span>
<h2>27 chapters of technique. Now two real projects, thirty days, one rubric.</h2>
<p class="lead">Nothing in this chapter is new. Every skill it uses — an idea worth a score, a two-column script, a shot list, a clean take, a locked edit, a title that keeps its promise — you already have. This lesson sets the target and the calendar; Lessons 27.2 and 27.3 are the two projects themselves; Lesson 27.4 is where you measure what changed.</p>

<h3>What a capstone actually is</h3>
<p>Lesson 0.4 already named it: a <strong>capstone</strong> is the project that uses everything you learned, not a new topic on top of it. If you have been following the shortcuts from Lesson 0.4 and skipping around, this is the chapter that asks you to go back and actually finish two full loops of the 10-step workflow from Lesson 0.3 — idea through measure — start to finish, published, not just edited.</p>
${slide('cr-27', 3, 'Vòng lặp 10 bước — lần này chạy hết')}
<p>"Published" is the operative word. A video sitting in <code>/creator/pipeline</code> at "Editing" is not a finished loop — it has not been through packaging, publishing, or measuring, and none of those steps get easier by skipping them again.</p>

<h3>The 30-day target: a ceiling and a lighter path</h3>
<p>A realistic ceiling for a student with this course’s gear, run at the "1 long video + 2–3 shorts per week" cadence you set in Lesson 2.3, looks like this over 30 days:</p>
<table>
<tr><th>Format</th><th>Ceiling — count</th><th>Hours per piece (estimate)</th><th>Lighter plan — count</th></tr>
<tr><td>Long video (8–12 min)</td><td>4</td><td>~7 h</td><td>2</td></tr>
<tr><td>Short vertical video (≤60 s)</td><td>12</td><td>~1.5 h</td><td>6</td></tr>
<tr><td>Vlog</td><td>2</td><td>~4 h</td><td>1</td></tr>
<tr><td>Teaching video / screen recording</td><td>2</td><td>~7 h</td><td>1</td></tr>
</table>
<p>Add it up and the ceiling is roughly <strong>68 hours across 30 days — about 16 hours a week</strong>; the lighter plan is roughly <strong>34 hours — about 8 hours a week</strong>. Those hour figures are a planning estimate, not a measurement — the same caveat Lesson 0.3 gave you for your very first video: treat it as a starting guess, then correct it after you time yourself once.</p>
<div class="callout warn"><p><strong>Choose the ceiling only if this is genuinely a light week.</strong> Sixteen hours a week on top of an FPTU course load is not sustainable during exams. This chapter’s two required projects (Lessons 27.2 and 27.3) fit inside the <em>lighter</em> plan’s numbers — the ceiling is extra, not the passing bar.</p></div>

<h3>Four weeks, plus two days to look back</h3>
${slide('cr-27', 5, 'Lịch 30 ngày')}
<p>The calendar above is a template, not a prediction of your exact dates — fill your own into <code>/creator/calendar</code>. The shape that makes it work:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Week 1 — build the channel</span><span class="lz-d">Profile and banner on every platform (Lesson 1.4), 10+ ideas scored in /creator/ideas, script and shot list for the long video.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Week 2 — ship Project 1</span><span class="lz-d">Batch-shoot, ingest, edit to picture lock, colour and sound, package, publish the long video. Lesson 27.2.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Week 3 — ship Project 2</span><span class="lz-d">One batching session for 3 shorts + 1 vlog, edit, cross-post. Lesson 27.3.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Week 4 — ceiling only</span><span class="lz-d">A second long video and a teaching video, if this week genuinely has the hours. Otherwise: catch up, or rest.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Days 29–30 — look back</span><span class="lz-d">Reshoot the Section 0 clip, score both projects and both clips on the rubric, write the log. Lesson 27.4.</span></div>
</div>

<h3>Running both projects through /creator</h3>
<p>Nothing here is a new tool — it is the same four surfaces from Lesson 0.4, now carrying two live projects instead of one practice card:</p>
${slide('cr-27', 6, '/creator đi cùng suốt 30 ngày')}
<div class="kv-grid">
  <div class="kv"><span class="k">/creator/ideas</span><span class="v">Capture ideas for both projects here first — Captured → Refined → Promoted, exactly as Lesson 2.1–2.2 taught.</span></div>
  <div class="kv"><span class="k">/creator/calendar</span><span class="v">One filming date and one publish date per project — amber and emerald dots, nothing else.</span></div>
  <div class="kv"><span class="k">/creator/pipeline</span><span class="v">Two cards moving left to right. A card stuck on "Editing" for a week is your earliest warning sign.</span></div>
  <div class="kv"><span class="k">/creator/projects</span><span class="v">Script tab + Teleprompter for each of the two projects — reuse the templates from Lesson 3.3.</span></div>
</div>

<div class="pitfall co-tieu-de"><p><strong>Trap — starting with the channel, not with a finished video.</strong> Spending week 1 perfecting a banner and a bio while no script exists yet. The profile matters, but a channel with one published video and a rough banner beats a beautiful channel with nothing on it. Give the profile a single sitting, then move to the script.</p></div>

<p class="note-ct"><strong>Next:</strong> Lesson 27.2 is Project 1, start to finish — the long video that proves the full 10-step loop works end to end.</p>

<h3>🎬 Practice (30 minutes)</h3>
<div class="callout ok"><ol>
<li>Pick your target: ceiling or lighter plan. Write the one-line reason for your choice (exam schedule, a job, or nothing else going on).</li>
<li>Fill your own dates into the 4-week template above, inside <code>/creator/calendar</code> — one filming date and one publish date for each of the two projects.</li>
<li>Create both projects in <code>/creator/projects</code> now, even empty. Move both cards to "Idea" on <code>/creator/pipeline</code>.</li>
</ol><p><strong>Done when:</strong> a target is chosen and written down, both projects exist with a filming and publish date, and both pipeline cards exist.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Capstone</span><span class="v">A final project that applies everything already taught, rather than teaching something new.</span></div>
  <div class="kv"><span class="k">Ceiling / lighter plan</span><span class="v">Two target sizes for the same 30 days — pick by how much the week actually allows, not by ambition.</span></div>
  <div class="kv"><span class="k">Batching</span><span class="v">Setting up once, filming several pieces of content in one session (Lesson 2.3).</span></div>
  <div class="kv"><span class="k">Buffer</span><span class="v">A video already edited and ready, held in reserve for a week that goes wrong.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>A capstone tests execution, not new knowledge — two full loops of the 10-step workflow, published.</li>
  <li>Ceiling ≈ 16 h/week, lighter plan ≈ 8 h/week — planning estimates, correct them after your own first video.</li>
  <li>Four weeks: build the channel, ship Project 1, ship Project 2, ceiling extras — then two days to look back.</li>
  <li>/creator/ideas, /creator/calendar, /creator/pipeline and /creator/projects now carry two live projects at once.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 27 · Bài 27.1</span>
<h2>27 chương kỹ thuật. Giờ là hai dự án thật, ba mươi ngày, một rubric.</h2>
<p class="lead">Chương này không dạy gì mới. Mọi kỹ năng nó dùng — một ý tưởng đáng điểm cao, một kịch bản hai cột, một shot list, một cú quay sạch, một bản dựng đã khoá, một tiêu đề giữ đúng lời hứa — bạn đã có cả rồi. Bài này đặt mục tiêu và lịch; Bài 27.2 và 27.3 là hai dự án thật; Bài 27.4 là lúc đo xem điều gì đã thay đổi.</p>

<h3>Capstone thật ra là gì</h3>
<p>Bài 0.4 đã gọi tên nó: <strong>capstone</strong> là dự án dùng lại mọi thứ đã học, không phải một chủ đề mới chồng lên. Nếu bạn từng đi theo các đường tắt ở Bài 0.4 và nhảy cóc qua vài chương, đây là chương yêu cầu bạn quay lại và thật sự chạy trọn hai vòng quy trình 10 bước ở Bài 0.3 — từ ý tưởng tới đo lường — từ đầu tới cuối, ĐÃ ĐĂNG, không chỉ dựng xong.</p>
${slide('cr-27', 3, 'Vòng lặp 10 bước — lần này chạy hết')}
<p>"Đã đăng" là từ khoá. Một video nằm ở cột "Đang dựng" trên <code>/creator/pipeline</code> chưa phải một vòng lặp hoàn chỉnh — nó chưa qua đóng gói, chưa đăng, chưa đo, và không bước nào trong ba bước đó tự dưng dễ đi nếu bạn lại bỏ qua.</p>

<h3>Mục tiêu 30 ngày: một mức trần và một đường nhẹ hơn</h3>
<p>Một mức trần thực tế cho một sinh viên có đồ nghề của khoá này, chạy đúng nhịp "1 video dài + 2–3 video ngắn/tuần" bạn đã chọn ở Bài 2.3, trông như sau trong 30 ngày:</p>
<table>
<tr><th>Định dạng</th><th>Mức trần — số lượng</th><th>Giờ/sản phẩm (ước lượng)</th><th>Mức nhẹ — số lượng</th></tr>
<tr><td>Video dài (8–12 phút)</td><td>4</td><td>~7 giờ</td><td>2</td></tr>
<tr><td>Video ngắn (≤60 giây)</td><td>12</td><td>~1,5 giờ</td><td>6</td></tr>
<tr><td>Vlog</td><td>2</td><td>~4 giờ</td><td>1</td></tr>
<tr><td>Video bài giảng / quay màn hình</td><td>2</td><td>~7 giờ</td><td>1</td></tr>
</table>
<p>Cộng lại, mức trần khoảng <strong>68 giờ trong 30 ngày — chừng 16 giờ/tuần</strong>; mức nhẹ khoảng <strong>34 giờ — chừng 8 giờ/tuần</strong>. Những con số giờ này là ước lượng để lên kế hoạch, không phải số đo — đúng lời nhắc Bài 0.3 đã đưa cho video đầu tiên của bạn: coi đây là phỏng đoán khởi điểm, rồi tự sửa lại sau khi bấm giờ chính mình một lần.</p>
<div class="callout warn"><p><strong>Chỉ chọn mức trần nếu tuần này thật sự rảnh.</strong> Mười sáu giờ một tuần cộng thêm lịch học ở FPTU không giữ nổi lâu, nhất là mùa thi. Hai dự án bắt buộc của chương này (Bài 27.2 và 27.3) đã nằm gọn trong số của mức <em>nhẹ</em> — mức trần là phần thêm, không phải điều kiện để qua chương.</p></div>

<h3>Bốn tuần, cộng hai ngày để nhìn lại</h3>
${slide('cr-27', 5, 'Lịch 30 ngày')}
<p>Lịch trên là một khung mẫu, không phải ngày tháng cố định — điền ngày thật của bạn vào <code>/creator/calendar</code>. Hình dạng khiến nó chạy được:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Tuần 1 — dựng kênh</span><span class="lz-d">Hồ sơ + banner trên mọi nền tảng (Bài 1.4), 10+ ý tưởng đã chấm điểm trong /creator/ideas, kịch bản và shot list cho video dài.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Tuần 2 — ra mắt Dự án 1</span><span class="lz-d">Quay dồn, đổ thẻ, dựng tới picture lock, màu và âm, đóng gói, đăng video dài. Bài 27.2.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Tuần 3 — ra mắt Dự án 2</span><span class="lz-d">Một buổi quay dồn cho 3 video ngắn + 1 vlog, dựng, đăng chéo. Bài 27.3.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Tuần 4 — chỉ khi chọn mức trần</span><span class="lz-d">Thêm một video dài và một video bài giảng, nếu tuần này thật sự có đủ giờ. Không thì dùng để bù tiến độ, hoặc nghỉ.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Ngày 29–30 — nhìn lại</span><span class="lz-d">Quay lại clip Mục 0, chấm rubric cho cả 2 dự án và cả 2 clip, viết nhật ký. Bài 27.4.</span></div>
</div>

<h3>Chạy cả hai dự án qua /creator</h3>
<p>Không có công cụ nào mới ở đây — vẫn bốn mặt quen thuộc từ Bài 0.4, giờ mang theo hai dự án đang sống thay vì một thẻ luyện tập:</p>
${slide('cr-27', 6, '/creator đi cùng suốt 30 ngày')}
<div class="kv-grid">
  <div class="kv"><span class="k">/creator/ideas</span><span class="v">Ghi ý tưởng cho cả 2 dự án vào đây trước — Đã ghi → Đã gọt → Đã nâng, đúng như Bài 2.1–2.2 đã dạy.</span></div>
  <div class="kv"><span class="k">/creator/calendar</span><span class="v">Một ngày quay và một ngày đăng cho mỗi dự án — chấm hổ phách và ngọc lục bảo, không hơn.</span></div>
  <div class="kv"><span class="k">/creator/pipeline</span><span class="v">Hai thẻ đi từ trái sang phải. Một thẻ kẹt ở "Đang dựng" cả tuần là dấu hiệu cảnh báo sớm nhất.</span></div>
  <div class="kv"><span class="k">/creator/projects</span><span class="v">Tab Kịch bản + Teleprompter cho từng dự án trong hai dự án — dùng lại mẫu từ Bài 3.3.</span></div>
</div>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — bắt đầu bằng dựng kênh thay vì bằng một video xong việc.</strong> Dành cả tuần 1 để chăm chút banner và tiểu sử trong khi chưa có kịch bản nào. Hồ sơ quan trọng, nhưng một kênh có một video đã đăng và banner còn thô thắng một kênh đẹp mà trống trơn. Dành đúng một buổi cho hồ sơ, rồi chuyển sang kịch bản ngay.</p></div>

<p class="note-ct"><strong>Bài tiếp theo:</strong> Bài 27.2 là Dự án 1, từ đầu tới cuối — video dài chứng minh cả vòng 10 bước chạy trọn vẹn.</p>

<h3>🎬 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Chọn mục tiêu: mức trần hay mức nhẹ. Viết một dòng lý do (lịch thi, việc làm thêm, hay không có gì bận khác).</li>
<li>Điền ngày thật của bạn vào khung 4 tuần trên, trong <code>/creator/calendar</code> — một ngày quay và một ngày đăng cho mỗi dự án trong hai dự án.</li>
<li>Tạo cả hai dự án trong <code>/creator/projects</code> ngay bây giờ, dù còn trống. Kéo cả hai thẻ về cột "Ý tưởng" trên <code>/creator/pipeline</code>.</li>
</ol><p><strong>Đạt khi:</strong> đã chọn và ghi ra mục tiêu, cả hai dự án đã có ngày quay và ngày đăng, và cả hai thẻ pipeline đã tồn tại.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Capstone</span><span class="v">Dự án cuối dùng lại mọi thứ đã học, không dạy điều gì mới.</span></div>
  <div class="kv"><span class="k">Mức trần / mức nhẹ</span><span class="v">Hai cỡ mục tiêu cho cùng 30 ngày — chọn theo tuần này thật sự cho phép bao nhiêu, không theo tham vọng.</span></div>
  <div class="kv"><span class="k">Quay dồn (batching)</span><span class="v">Dựng máy một lần, quay nhiều sản phẩm trong một buổi (Bài 2.3).</span></div>
  <div class="kv"><span class="k">Hàng dự trữ (buffer)</span><span class="v">Một video đã dựng xong, giữ sẵn cho tuần nào đó trục trặc.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Capstone kiểm tra khả năng thực thi, không phải kiến thức mới — hai vòng trọn vẹn của quy trình 10 bước, đã đăng.</li>
  <li>Mức trần ≈ 16 giờ/tuần, mức nhẹ ≈ 8 giờ/tuần — ước lượng lên kế hoạch, tự sửa lại sau video đầu tiên của chính bạn.</li>
  <li>Bốn tuần: dựng kênh, ra mắt Dự án 1, ra mắt Dự án 2, phần thêm nếu chọn mức trần — rồi hai ngày để nhìn lại.</li>
  <li>/creator/ideas, /creator/calendar, /creator/pipeline và /creator/projects giờ mang theo hai dự án cùng lúc.</li>
</ul>
</div>
`,
    },

    /* ─────────────────── 27.2 dự án 1 — video dài ─────────────────── */
    {
      title: '27.2 — Project 1: your first long YouTube video, start to finish|||27.2 — Dự án 1: video YouTube dài đầu tiên, từ đầu tới cuối',
      slug: 'cr-27-2-du-an-video-dai',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Checklist đầy đủ của Dự án 1 bắt buộc — ý tưởng, kịch bản, shot list, quay, dựng, tới đóng gói và đăng — mỗi chặng trỏ đúng bài đã dạy nó.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 27 · Lesson 27.2</span>
<h2>Project 1: one long video, every stage, nothing skipped</h2>
<p class="lead">This is not a video that has to be perfect. It is a video that has to go through <em>all ten steps</em> — the proof that the workflow from Lesson 0.3 is now something you run, not something you read about. Work through this checklist over Week 2 of your plan; each row links back to the lesson that already taught it.</p>

<h3>The six stages, in order</h3>
${slide('cr-27', 7, 'Dự án 1 — các chặng')}
<p>Compress the ten steps from Lesson 0.3 into working sessions and the project stops feeling abstract:</p>
${slide('cr-27', 8, 'Checklist Dự án 1')}
<table>
<tr><th>Stage</th><th>Lesson(s)</th><th>What you walk away with</th></tr>
<tr><td>Idea + score</td><td>2.1–2.2</td><td>One idea scoring 4–5 stars, a draft title you would click</td></tr>
<tr><td>Two-column script</td><td>3.1, 3.3</td><td>A saved script version in /creator, hook written first</td></tr>
<tr><td>Shot list</td><td>4.3</td><td>A shot table with an estimated-seconds column</td></tr>
<tr><td>Set up gear + shoot</td><td>5–10</td><td>Short, labelled clips at the right fps and exposure</td></tr>
<tr><td>Ingest + backup</td><td>11.1–11.2</td><td>A named folder, two copies, following the 3-2-1 rule</td></tr>
<tr><td>Edit to picture lock</td><td>12–14</td><td>An edit with a final, ordered story</td></tr>
<tr><td>Colour + sound + captions</td><td>15–16</td><td>Matched shots, mixed loudness, an SRT file</td></tr>
<tr><td>Package + export + publish</td><td>24–25</td><td>A video that is actually live</td></tr>
</table>

<h3>Packaging is not an afterthought</h3>
<p>Lesson 2.2 already made you write a title and sketch a thumbnail before filming anything. Hold onto that draft. By the time you reach export, Chapter 25 covers title formulas and thumbnail craft in depth — but even without it, the rule from Lesson 2.2 still applies: if you cannot write a title that would make <em>you</em> click, the idea was not ready, and neither is the export.</p>
<div class="callout ok"><p><strong>Tip:</strong> shoot your thumbnail photo on the iPhone 16 Pro Max’s 48MP camera during the same session — a deliberate, well-lit frame beats a random paused screenshot from the video every time.</p></div>

<h3>Which editor, and which settings to reuse</h3>
<p>Lesson 11.3 already had you weigh CapCut against DaVinci Resolve; for one long, talking-head-driven video with several B-roll inserts, DaVinci Resolve’s node-based colour and Fairlight audio tools are worth the extra time. Carry over the numbers you already settled on rather than reinventing them mid-project:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Frame rate</span><span class="v">25 or 50 fps — Vietnam’s 50 Hz mains, Lesson 5.1.</span></div>
  <div class="kv"><span class="k">Shutter</span><span class="v">1/50 s at 25 fps, the 180° rule — Lesson 5.2.</span></div>
  <div class="kv"><span class="k">Audio level</span><span class="v">Peaks around −12…−6 dBFS while recording — Lesson 9.3.</span></div>
  <div class="kv"><span class="k">Loudness on export</span><span class="v">Mixed to −14 LUFS before export — Lesson 16.1.</span></div>
</div>
<p>None of these are new decisions. Writing them down here matters because a real shoot day has enough happening that it is easy to default back to auto settings out of habit — checking this list before pressing record costs ten seconds and saves an entire reshoot.</p>

<h3>If the shoot goes sideways</h3>
<p>Something will not go perfectly — a take gets ruined by a phone ringing, the light changes halfway through, the audio has one dropout. None of that means starting over. Lesson 4.2’s vocabulary applies directly here: you do not need a perfect take, you need enough usable takes to cover every beat in the script. Reshoot only the beat that failed, not the whole session, and keep the buffer idea from Lesson 27.1 in mind — if this project runs long, publish it a day or two late rather than skipping the colour and sound passes to save time.</p>

<h3>Where beginners actually lose the video</h3>
<p>Two traps from earlier chapters cost the most time here, and they are worth repeating with your own footage on the line:</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — "fix it in post" (Lesson 0.3).</strong> Believing the edit can rescue a shot you did not actually film, remove echo baked into the voice, or sharpen a blurry clip. It cannot. If the shoot went wrong, the cheapest fix is a reshoot, not three extra hours in DaVinci Resolve.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Trap — perfecting colour while the story is still broken.</strong> Grading three scenes beautifully before checking whether the video makes sense start to finish. Lesson 14.1 is explicit about the order: story first, then pacing, then colour and sound — in that order, every time.</p></div>

<p class="note-ct"><strong>Next:</strong> Lesson 27.3 is Project 2 — three short videos and one vlog from a single batching session, a different rhythm from this one long project.</p>

<h3>🎬 Practice (spread across Week 2)</h3>
<div class="callout ok"><ol>
<li>Complete every row of the table above, in order. Do not start editing before the shot list exists; do not export before a title and thumbnail exist.</li>
<li>Move the project’s card across every column of <code>/creator/pipeline</code> as you go — Idea → Scripting → Filming → Editing → Scheduled → Published.</li>
<li>Once it is live, paste the published URL into the project’s Tổng quan (Overview) tab.</li>
</ol><p><strong>Done when:</strong> the video is published on your channel — not edited, not scheduled, <em>published</em> — and the pipeline card sits in the "Published" column with a URL attached.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Picture lock</span><span class="v">The point where the order and length of every shot is final (Lesson 14.1) — nothing structural changes after this.</span></div>
  <div class="kv"><span class="k">Packaging</span><span class="v">The title, thumbnail and description that "sell" a finished video (Lesson 2.2).</span></div>
  <div class="kv"><span class="k">3-2-1 backup</span><span class="v">3 copies, on 2 kinds of storage, 1 off-site — Lesson 11.2.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Project 1 is eight working sessions, each mapped to a lesson you already completed.</li>
  <li>Packaging (title + thumbnail) is decided early, at the idea stage, and confirmed again before export — never invented at the last minute.</li>
  <li>"Fix it in post" and grading before the story is locked are the two traps that eat the most hours here.</li>
  <li>Done means published, with a URL, and a pipeline card in the last column.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 27 · Bài 27.2</span>
<h2>Dự án 1: một video dài, đủ mọi chặng, không bỏ chặng nào</h2>
<p class="lead">Đây không phải một video bắt buộc phải hoàn hảo. Đây là video phải đi qua <em>đủ mười bước</em> — bằng chứng rằng quy trình ở Bài 0.3 giờ là thứ bạn CHẠY, không chỉ là thứ bạn đọc. Làm theo checklist này trong suốt Tuần 2 của kế hoạch; mỗi hàng trỏ thẳng về bài đã dạy đúng bước đó.</p>

<h3>Sáu chặng, theo đúng thứ tự</h3>
${slide('cr-27', 7, 'Dự án 1 — các chặng')}
<p>Gộp mười bước ở Bài 0.3 thành từng buổi làm việc, dự án hết trừu tượng ngay:</p>
${slide('cr-27', 8, 'Checklist Dự án 1')}
<table>
<tr><th>Chặng</th><th>Bài học</th><th>Bạn có được gì</th></tr>
<tr><td>Ý tưởng + chấm điểm</td><td>2.1–2.2</td><td>1 ý tưởng đạt 4–5 sao, một tiêu đề nháp khiến bạn muốn bấm</td></tr>
<tr><td>Kịch bản 2 cột</td><td>3.1, 3.3</td><td>Một phiên bản kịch bản đã lưu trong /creator, hook viết trước</td></tr>
<tr><td>Shot list</td><td>4.3</td><td>Một bảng shot có cột ước lượng số giây</td></tr>
<tr><td>Cài máy + quay</td><td>5–10</td><td>Các clip ngắn, có nhãn, đúng fps và phơi sáng</td></tr>
<tr><td>Đổ thẻ + sao lưu</td><td>11.1–11.2</td><td>Một thư mục đặt tên, 2 bản sao, theo luật 3-2-1</td></tr>
<tr><td>Dựng tới picture lock</td><td>12–14</td><td>Một bản dựng có câu chuyện đã khoá, theo đúng thứ tự cuối</td></tr>
<tr><td>Màu + âm + phụ đề</td><td>15–16</td><td>Cảnh đã khớp màu, âm đã mix loudness, một file SRT</td></tr>
<tr><td>Đóng gói + xuất + đăng</td><td>24–25</td><td>Một video thật sự đã lên sóng</td></tr>
</table>

<h3>Đóng gói không phải việc làm sau cùng</h3>
<p>Bài 2.2 đã bắt bạn viết tiêu đề và phác thumbnail trước khi quay bất cứ gì. Giữ lấy bản nháp đó. Tới lúc xuất file, Chương 25 sẽ bàn sâu công thức tiêu đề và kỹ thuật thiết kế thumbnail — nhưng dù chưa tới đó, luật của Bài 2.2 vẫn áp dụng: nếu bạn không viết nổi một tiêu đề khiến CHÍNH BẠN muốn bấm, ý tưởng chưa sẵn sàng, và bản xuất cũng vậy.</p>
<div class="callout ok"><p><strong>Mẹo:</strong> chụp ảnh thumbnail bằng camera 48MP của iPhone 16 Pro Max ngay trong buổi quay — một khung hình được sắp đặt và ánh sáng tử tế luôn thắng một ảnh chụp màn hình ngẫu nhiên từ video.</p></div>

<h3>Chọn phần mềm nào, và dùng lại thông số nào</h3>
<p>Bài 11.3 đã bắt bạn cân CapCut với DaVinci Resolve; với một video dài, chủ yếu talking-head kèm nhiều đoạn B-roll, công cụ chỉnh màu theo node và Fairlight của DaVinci Resolve đáng bỏ thêm thời gian. Mang theo những con số bạn đã chốt từ trước thay vì nghĩ lại giữa chừng dự án:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Frame rate</span><span class="v">25 hoặc 50 fps — điện lưới Việt Nam 50Hz, Bài 5.1.</span></div>
  <div class="kv"><span class="k">Màn trập</span><span class="v">1/50s ở 25fps, quy tắc 180° — Bài 5.2.</span></div>
  <div class="kv"><span class="k">Mức thu âm</span><span class="v">Đỉnh khoảng −12…−6 dBFS lúc quay — Bài 9.3.</span></div>
  <div class="kv"><span class="k">Loudness lúc xuất</span><span class="v">Mix về −14 LUFS trước khi xuất — Bài 16.1.</span></div>
</div>
<p>Không con số nào ở đây là quyết định mới. Viết chúng ra đây vì một ngày quay thật có đủ thứ đang diễn ra khiến người ta dễ quay về cài đặt tự động theo quán tính — kiểm lại danh sách này trước khi bấm quay tốn mười giây và cứu cả một buổi khỏi phải quay lại.</p>

<h3>Nếu buổi quay trục trặc giữa chừng</h3>
<p>Sẽ có gì đó không suôn sẻ — một take hỏng vì điện thoại đổ chuông, ánh sáng đổi giữa chừng, âm thanh rớt một đoạn. Không cái nào trong số đó có nghĩa phải quay lại từ đầu. Từ vựng ở Bài 4.2 áp dụng thẳng vào đây: bạn không cần một take hoàn hảo, bạn cần đủ take dùng được để phủ hết từng nhịp trong kịch bản. Chỉ quay lại đúng nhịp bị hỏng, không phải cả buổi, và nhớ tới ý tưởng hàng dự trữ ở Bài 27.1 — nếu dự án này kéo dài hơn dự tính, đăng trễ một hai ngày còn hơn bỏ qua bước màu và âm để kịp giờ.</p>

<h3>Người mới thường mất video ở đâu</h3>
<p>Hai cái bẫy từ các chương trước tốn nhiều thời gian nhất ở đây, và đáng nhắc lại khi chính cảnh quay của bạn đang bị đe doạ:</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — "để hậu kỳ lo" (Bài 0.3).</strong> Tin rằng dựng phim cứu được một cảnh bạn chưa từng quay, xoá được tiếng vọng đã ăn sâu vào giọng nói, hay làm nét lại một clip bị mờ. Không cứu được đâu. Nếu buổi quay hỏng, cách rẻ nhất là quay lại, không phải ngồi thêm ba giờ trong DaVinci Resolve.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — chăm chút màu trong khi câu chuyện còn hỏng.</strong> Chỉnh màu thật đẹp cho ba cảnh trước khi kiểm xem video có xuôi từ đầu tới cuối không. Bài 14.1 đã nói rõ thứ tự: câu chuyện trước, nhịp dựng sau, rồi mới tới màu và âm — đúng thứ tự đó, mỗi lần.</p></div>

<p class="note-ct"><strong>Bài tiếp theo:</strong> Bài 27.3 là Dự án 2 — ba video ngắn và một vlog từ một buổi quay dồn duy nhất, một nhịp khác hẳn dự án dài này.</p>

<h3>🎬 Thực hành (trải trong Tuần 2)</h3>
<div class="callout ok"><ol>
<li>Hoàn thành từng hàng trong bảng trên, đúng thứ tự. Đừng dựng trước khi có shot list; đừng xuất file trước khi có tiêu đề và thumbnail.</li>
<li>Kéo thẻ dự án qua từng cột của <code>/creator/pipeline</code> khi bạn tiến tới — Ý tưởng → Viết kịch bản → Đang quay → Đang dựng → Đã lên lịch → Đã đăng.</li>
<li>Khi video đã lên sóng, dán đường dẫn đã đăng vào tab Tổng quan của dự án.</li>
</ol><p><strong>Đạt khi:</strong> video đã lên sóng trên kênh của bạn — không phải đã dựng xong, không phải đã lên lịch, mà ĐÃ ĐĂNG — và thẻ pipeline nằm ở cột "Đã đăng" kèm đường dẫn.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Picture lock</span><span class="v">Thời điểm thứ tự và độ dài mọi cảnh đã chốt (Bài 14.1) — sau mốc này không đổi cấu trúc nữa.</span></div>
  <div class="kv"><span class="k">Đóng gói (packaging)</span><span class="v">Tiêu đề, thumbnail và mô tả "bán" một video đã xong (Bài 2.2).</span></div>
  <div class="kv"><span class="k">Sao lưu 3-2-1</span><span class="v">3 bản sao, trên 2 loại lưu trữ, 1 bản để nơi khác — Bài 11.2.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Dự án 1 là tám buổi làm việc, mỗi buổi khớp với một bài bạn đã học xong.</li>
  <li>Đóng gói (tiêu đề + thumbnail) được quyết định sớm, ngay từ lúc chấm ý tưởng, và xác nhận lại trước khi xuất file — không bao giờ nghĩ ra vào phút chót.</li>
  <li>"Để hậu kỳ lo" và chỉnh màu trước khi câu chuyện đã khoá là hai cái bẫy tốn thời gian nhất ở đây.</li>
  <li>Xong nghĩa là đã đăng, có đường dẫn, và thẻ pipeline nằm ở cột cuối cùng.</li>
</ul>
</div>
`,
    },

    /* ─────────────────── 27.3 dự án 2 — ngắn & vlog ─────────────────── */
    {
      title: '27.3 — Project 2: three shorts and a vlog from one shoot day|||27.3 — Dự án 2: 3 video ngắn và 1 vlog từ một ngày quay',
      slug: 'cr-27-3-du-an-video-ngan-vlog',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Checklist Dự án 2 bắt buộc — bốn kịch bản, một buổi quay dồn, dựng nhanh trong CapCut, và đăng chéo đúng cách trên nhiều nền tảng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 27 · Lesson 27.3</span>
<h2>Project 2: four scripts, one shoot day, four published pieces</h2>
<p class="lead">Project 1 tested the long-form loop. Project 2 tests the opposite muscle: batching — planning tight enough that one setup produces four finished, published pieces in a single session. This is the rhythm you will actually use most weeks after this course ends.</p>

<h3>The chain, compressed</h3>
${slide('cr-27', 9, 'Dự án 2 — các chặng')}
<p>Four scripts before you touch a camera, one shoot day, one fast edit pass, four posts. No stage here takes as long as it did for the long video — that is the point.</p>

<h3>Writing four scripts in one sitting</h3>
<p>Use the templates already built into the Script tab of <code>/creator/projects</code> — "Short video — one idea" for each short, "Vlog storytelling" for the vlog (Lesson 3.3, Lesson 21.1). The short template budgets roughly 150 words per 60 seconds; measure your own speaking speed once and adjust. Pick three short ideas that share one location or one activity so the shoot day does not need three separate setups.</p>

<h3>What the four scripts should actually be about</h3>
<p>A workable set for one afternoon: three shorts pulled from the same well as Lesson 2.1’s idea list — a coding mistake you just fixed, a tool you use daily, a one-sentence answer to a question you keep hearing — plus one vlog covering the same day from the outside: getting ready, the shoot itself, a short reflection at the end. The shorts and the vlog can literally reuse footage: a shot of you setting up lights for the shorts becomes a vlog beat for free.</p>

<h3>One shoot day, four outputs</h3>
${slide('cr-27', 10, 'Một buổi quay dồn')}
<p>Set up once. Let the vlog run in the background of the whole session — it is footage of you actually working, not a separate performance (Lesson 21.2). Slot the three shorts and any B-roll into natural pauses. This is exactly the batching principle from Lesson 2.3 and the "shoot for the edit" discipline from Lesson 4.1, now applied to a single afternoon instead of a single clip.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Camera</span><span class="v">Pocket 3 on the gimbal for the vlog and any walking shots; iPhone locked on a tripod for the shorts’ talking-head takes.</span></div>
  <div class="kv"><span class="k">Discipline</span><span class="v">Every short is still one clean take per beat — Lesson 4.1’s "shoot for the edit" habit, not a return to recording everything.</span></div>
  <div class="kv"><span class="k">Aspect ratio</span><span class="v">9:16 vertical for all three shorts and, if you choose, the vlog too — Lesson 7.3.</span></div>
  <div class="kv"><span class="k">Length target</span><span class="v">Shorts around 150 words / 60 seconds; vlog 3–6 minutes — Lesson 3.3, Lesson 21.1.</span></div>
</div>

<h3>Editing fast, publishing cross-platform</h3>
<p>The vlog itself edits differently from the three shorts — Lesson 21.3 already covered structuring a vlog’s footage into a story with music underneath, rather than the beat-by-beat retention cuts a short needs. Edit the vlog first while the day is still fresh in your memory, then batch the three shorts afterward using the same source footage.</p>
<p>CapCut (Chapter 12) is the right tool here — this is exactly the fast-turnaround workflow it is built for, not DaVinci Resolve’s deeper toolset. Cut each short for retention (Lesson 20.3), keep captions inside the vertical safe zone (Lesson 7.3), use CapCut’s auto captions and correct them by hand (Lesson 12.3), then publish following Lesson 24.3’s rules for cross-posting. Each platform from Lesson 1.1 has its own texture — a caption that works on TikTok can read strangely on Instagram, and YouTube Shorts favours a title-like first line over a caption at all. Write three short variants, not one copy-pasted three times.</p>
${slide('cr-27', 11, 'Đăng chéo đúng luật')}
<div class="pitfall co-tieu-de"><p><strong>Trap — re-uploading a watermarked export.</strong> Downloading a video you already posted to one app and re-uploading it to another. Lesson 2.4 already established why that backfires: platforms tend to recommend watermarked, cross-posted video less. Export one clean master and cut the vertical version yourself in CapCut.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Trap — skipping the shot list because "it is just a short".</strong> A 60-second video still needs 5–8 shots to cut well — treating it as casual and improvising on the spot is how a batching session runs long and still comes home with repetitive, unusable footage. Lesson 4.3’s mini shot list applies here too, just shorter.</p></div>

<p class="note-ct"><strong>Next:</strong> Lesson 27.4 closes the loop — reshoot the Section 0 clip, score everything on one rubric, and decide what comes after day 30.</p>

<h3>🎬 Practice (spread across Week 3)</h3>
<div class="callout ok"><ol>
<li>Write all four scripts in one sitting, using the templates in /creator/projects.</li>
<li>Run one batching session: vlog running throughout, three shorts and B-roll filmed in the gaps.</li>
<li>Edit all four in CapCut, then publish across at least two platforms with rewritten captions per platform.</li>
</ol><p><strong>Done when:</strong> all four pieces are published (not just edited), and you can name which platform each one is watermark-free and native to.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Batching</span><span class="v">One setup, several pieces of content filmed in a single session (Lesson 2.3).</span></div>
  <div class="kv"><span class="k">Cross-posting</span><span class="v">Publishing the same idea, natively re-cut, across several platforms (Lesson 24.3).</span></div>
  <div class="kv"><span class="k">Vertical safe zone</span><span class="v">The screen area not covered by a platform’s UI, where text must stay readable (Lesson 7.3).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Project 2 tests batching, not endurance — four scripts, one setup, one afternoon.</li>
  <li>The vlog runs in the background of the whole session; the shorts and B-roll fill the gaps.</li>
  <li>CapCut, not DaVinci Resolve, matches this project’s speed.</li>
  <li>Cross-post from one clean master export, never a re-downloaded, watermarked file.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 27 · Bài 27.3</span>
<h2>Dự án 2: bốn kịch bản, một ngày quay, bốn sản phẩm lên sóng</h2>
<p class="lead">Dự án 1 kiểm tra guồng làm video dài. Dự án 2 kiểm tra cơ bắp ngược lại: quay dồn — lên kế hoạch đủ gọn để một lần dựng máy ra được bốn sản phẩm hoàn chỉnh, đã đăng, trong đúng một buổi. Đây mới là nhịp bạn sẽ dùng nhiều nhất sau khi khoá này kết thúc.</p>

<h3>Chuỗi việc, đã gộp gọn</h3>
${slide('cr-27', 9, 'Dự án 2 — các chặng')}
<p>Bốn kịch bản trước khi chạm vào máy quay, một ngày quay, một lượt dựng nhanh, bốn bài đăng. Không chặng nào ở đây tốn thời gian như ở video dài — đó chính là mục đích.</p>

<h3>Viết bốn kịch bản trong một buổi</h3>
<p>Dùng mẫu có sẵn trong tab Kịch bản của <code>/creator/projects</code> — "Video ngắn — một ý duy nhất" cho mỗi video ngắn, "Vlog kể chuyện" cho vlog (Bài 3.3, Bài 21.1). Mẫu video ngắn dùng ngân sách khoảng 150 từ cho 60 giây; tự đo tốc độ nói của mình một lần rồi điều chỉnh. Chọn ba ý video ngắn dùng chung một bối cảnh hoặc một hoạt động để ngày quay không cần dựng máy ba lần.</p>

<h3>Bốn kịch bản nên nói về điều gì</h3>
<p>Một bộ khả thi cho một buổi chiều: ba video ngắn lấy từ đúng nguồn ý tưởng ở Bài 2.1 — một lỗi lập trình bạn vừa sửa, một công cụ bạn dùng hằng ngày, một câu trả lời cho câu hỏi bạn nghe lặp đi lặp lại — cộng một vlog kể lại chính ngày hôm đó từ góc nhìn ngoài: chuẩn bị, buổi quay, một chút suy nghĩ ở cuối. Video ngắn và vlog có thể dùng chung cảnh quay thật sự: một cảnh bạn dựng đèn cho video ngắn tự nhiên trở thành một nhịp trong vlog, không tốn thêm công.</p>

<h3>Một ngày quay, bốn sản phẩm</h3>
${slide('cr-27', 10, 'Một buổi quay dồn')}
<p>Dựng máy đúng một lần. Để vlog chạy nền suốt cả buổi — đó là cảnh quay bạn đang thật sự làm việc, không phải một màn trình diễn riêng (Bài 21.2). Chen ba video ngắn và B-roll vào những lúc tự nhiên dừng tay. Đây chính xác là nguyên tắc quay dồn ở Bài 2.3 và kỷ luật "quay để dựng" ở Bài 4.1, giờ áp dụng cho cả một buổi chiều thay vì một clip đơn lẻ.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Máy quay</span><span class="v">Pocket 3 trên gimbal cho vlog và các cảnh đi lại; iPhone khoá trên chân máy cho các cú talking-head của video ngắn.</span></div>
  <div class="kv"><span class="k">Kỷ luật</span><span class="v">Mỗi video ngắn vẫn là một take sạch cho từng nhịp — thói quen "quay để dựng" của Bài 4.1, không phải quay lại kiểu ghi hết mọi thứ.</span></div>
  <div class="kv"><span class="k">Tỉ lệ khung</span><span class="v">Dọc 9:16 cho cả ba video ngắn, và nếu muốn, cả vlog — Bài 7.3.</span></div>
  <div class="kv"><span class="k">Độ dài mục tiêu</span><span class="v">Video ngắn khoảng 150 từ / 60 giây; vlog 3–6 phút — Bài 3.3, Bài 21.1.</span></div>
</div>

<h3>Dựng nhanh, đăng đa nền tảng</h3>
<p>Bản thân vlog dựng khác hẳn ba video ngắn — Bài 21.3 đã dạy cách sắp cảnh quay của vlog thành một câu chuyện có nhạc nền, không phải kiểu cắt theo nhịp giữ chân như video ngắn cần. Dựng vlog trước trong khi ký ức về buổi hôm đó còn tươi, rồi mới dựng dồn ba video ngắn từ cùng nguồn cảnh quay.</p>
<p>CapCut (Chương 12) đúng là công cụ hợp ở đây — đây chính xác là quy trình quay vòng nhanh nó được dựng ra để làm, không phải bộ công cụ sâu của DaVinci Resolve. Cắt mỗi video ngắn để giữ chân người xem (Bài 20.3), giữ phụ đề trong vùng an toàn dọc (Bài 7.3), dùng phụ đề tự động của CapCut rồi sửa lại bằng tay (Bài 12.3), rồi đăng theo đúng luật đăng chéo của Bài 24.3. Mỗi nền tảng ở Bài 1.1 có một chất giọng riêng — một caption hợp trên TikTok có thể đọc kỳ trên Instagram, còn YouTube Shorts lại hợp một dòng đầu kiểu tiêu đề hơn là một caption thông thường. Viết ba bản caption khác nhau, đừng copy-paste một bản cho cả ba nơi.</p>
${slide('cr-27', 11, 'Đăng chéo đúng luật')}
<div class="pitfall co-tieu-de"><p><strong>Bẫy — tải lại bản xuất có watermark.</strong> Tải về một video đã đăng ở app này rồi đăng lại lên app khác. Bài 2.4 đã nói rõ vì sao cách này phản tác dụng: các nền tảng thường đề xuất kém hơn cho video có watermark từ chỗ khác. Xuất một bản GỐC sạch, rồi tự dựng riêng bản dọc trong CapCut.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — bỏ qua shot list vì nghĩ "chỉ là video ngắn".</strong> Một video 60 giây vẫn cần 5–8 shot để cắt cho mượt — coi nó là chuyện nhỏ rồi ứng biến tại chỗ là cách một buổi quay dồn kéo dài quá giờ mà vẫn mang về cảnh quay lặp và không dùng được. Shot list thu nhỏ ở Bài 4.3 vẫn áp dụng ở đây, chỉ ngắn hơn.</p></div>

<p class="note-ct"><strong>Bài tiếp theo:</strong> Bài 27.4 khép vòng lặp lại — quay lại clip Mục 0, chấm mọi thứ trên cùng một rubric, và quyết định điều gì tới sau ngày 30.</p>

<h3>🎬 Thực hành (trải trong Tuần 3)</h3>
<div class="callout ok"><ol>
<li>Viết đủ bốn kịch bản trong một buổi, dùng mẫu có sẵn trong /creator/projects.</li>
<li>Chạy một buổi quay dồn: vlog chạy suốt, ba video ngắn và B-roll quay chen vào những khoảng dừng.</li>
<li>Dựng cả bốn trong CapCut, rồi đăng lên ít nhất hai nền tảng, mỗi nơi viết lại caption riêng.</li>
</ol><p><strong>Đạt khi:</strong> cả bốn sản phẩm đã đăng (không chỉ dựng xong), và bạn nói được từng nền tảng đang chạy bản gốc, không watermark của nơi khác.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Quay dồn (batching)</span><span class="v">Dựng máy một lần, quay nhiều sản phẩm trong một buổi (Bài 2.3).</span></div>
  <div class="kv"><span class="k">Đăng chéo (cross-posting)</span><span class="v">Đăng cùng một ý tưởng, dựng lại đúng bản gốc cho từng nơi, trên nhiều nền tảng (Bài 24.3).</span></div>
  <div class="kv"><span class="k">Vùng an toàn dọc</span><span class="v">Phần màn hình không bị giao diện nền tảng che, nơi chữ phải giữ đọc được (Bài 7.3).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Dự án 2 kiểm tra khả năng quay dồn, không phải sức bền — bốn kịch bản, một lần dựng máy, một buổi chiều.</li>
  <li>Vlog chạy nền suốt buổi; video ngắn và B-roll lấp vào những khoảng trống.</li>
  <li>CapCut, không phải DaVinci Resolve, mới hợp tốc độ của dự án này.</li>
  <li>Đăng chéo từ một bản xuất gốc sạch, không bao giờ từ một file đã tải lại có watermark.</li>
</ul>
</div>
`,
    },

    /* ─────────────────── 27.4 tự đánh giá & bước tiếp ─────────────────── */
    {
      title: '27.4 — Self-assessment and what comes next|||27.4 — Tự đánh giá & bước tiếp theo',
      slug: 'cr-27-4-tu-danh-gia-buoc-tiep',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Quay lại đúng clip 60 giây của Mục 0 để so sánh, chấm rubric 8 tiêu chí cho cả hai dự án, viết nhật ký creator, và chọn hướng học tiếp.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 27 · Lesson 27.4</span>
<h2>The same 60 seconds, thirty days apart</h2>
<p class="lead">Lesson 0.3 had you film one unscripted, uncut, unedited 60-second clip and write down three things to fix. That clip is still sitting in your camera roll or on your card. This lesson has you film it again, under the exact same rule, and put a number on what changed.</p>

<h3>Reshoot it — same constraint, on purpose</h3>
${slide('cr-27', 12, 'Trước / sau — cùng một bài tập 60 giây')}
<p>Talk to camera for 60 seconds introducing yourself. One take. No cuts, no retakes, no edit. That constraint is not a formality — filming under the exact same rule as Lesson 0.3 isolates what actually improved: your in-camera skills (framing, light, sound, delivery), not your editing skills. An edited comparison would only prove you can use DaVinci Resolve, which you already know. This proves something else.</p>

<h3>Score both clips, and both projects, on one rubric</h3>
${slide('cr-27', 13, 'Rubric tự chấm 8 tiêu chí')}
<table>
<tr><th>Criterion</th><th>1–2 looks like</th><th>4–5 looks like</th></tr>
<tr><td>Hook</td><td>"Hi everyone, today I will…"</td><td>Straight into the point within 3 seconds</td></tr>
<tr><td>Sound</td><td>Echo, hiss, obvious background noise</td><td>Clear voice, roughly −12…−6 dBFS</td></tr>
<tr><td>Light</td><td>Backlit, face in shadow</td><td>Key/fill present, eyes clearly lit</td></tr>
<tr><td>Framing</td><td>Head touching the edge, tilted horizon</td><td>Rule of thirds, enough lead room</td></tr>
<tr><td>Pacing</td><td>Dragging, dead silences</td><td>Cuts land on beat, holds attention</td></tr>
<tr><td>Colour</td><td>Yellow/blue cast, every shot a different tone</td><td>Consistent across shots</td></tr>
<tr><td>Captions</td><td>Missing, or misspelled</td><td>Accurate, inside the safe zone</td></tr>
<tr><td>Packaging</td><td>Generic title</td><td>A clear promise, readable at thumbnail size</td></tr>
</table>
<p>Score every criterion 1–5 on both 60-second clips, then on both capstone projects. Score them <em>independently</em> — a project with beautiful colour and muddy audio is not a 5; it is a 5 on colour and a 2 on sound. That is the useful information a single overall impression would hide.</p>

<h3>The creator log, thirty days in</h3>
<p>Lesson 0.4 asked you to start a <strong>creator log</strong>: what worked, what did not, what you will change next time — one entry per video. If you kept it, this is where it pays off: read back ten entries and the pattern of your own recurring mistake is usually obvious in a way no single video ever shows you. If you did not keep it, start today — write one entry now, covering all six pieces you made this month at once.</p>
<div class="callout ok"><p><strong>Write your next 30-day goal in one sentence</strong> — the same habit Lesson 0.4 opened with. Put it in a new idea or project inside <code>/creator</code> so it is not just a thought that evaporates.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Trap — treating day 30 as the finish line.</strong> Two published projects is proof the workflow runs, not a reason to stop. Step 10 of the loop from Lesson 0.3 feeds back into step 1 — a channel is dozens of laps of this loop, not one capstone.</p></div>

<h3>Where to go next</h3>
${slide('cr-27', 14, 'Học tiếp gì')}
<p>Four directions worth naming, each building on a skill you already have some of:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Multi-guest podcast</span><span class="v">Dual-system audio recording and syncing (Lesson 9.4) plus multi-camera sync (Lesson 13.3) are already the technical foundation — a podcast just adds a second person’s mic and camera.</span></div>
  <div class="kv"><span class="k">Livestreaming</span><span class="v">Real-time audience interaction, a different skill entirely from editing. Start with YouTube’s own live-streaming basics.</span></div>
  <div class="kv"><span class="k">Deeper motion design</span><span class="v">Chapter 19 covered Fusion’s fundamentals — 2D and 3D compositing rewards far more practice than a single chapter can give.</span></div>
  <div class="kv"><span class="k">Colour grading as a craft</span><span class="v">Chapter 15 covered scopes, Log and nodes — Blackmagic’s own free training goes considerably deeper.</span></div>
</div>
<div class="link-card"><a href="https://www.youtube.com/creators/" target="_blank" rel="noopener">YouTube Creators — the official hub for making and growing a channel</a></div>
<div class="link-card"><a href="https://support.google.com/youtube/answer/2853700" target="_blank" rel="noopener">YouTube Help — Get started with live streaming</a></div>
<div class="link-card"><a href="https://www.blackmagicdesign.com/products/davinciresolve/training" target="_blank" rel="noopener">Blackmagic Design — free training books, including the Colorist Guide</a></div>

<h3>🎬 Practice (60 minutes)</h3>
<div class="callout ok"><ol>
<li>Film the 60-second clip again — same rule as Lesson 0.3: one take, no cuts, no retakes.</li>
<li>Score both 60-second clips and both capstone projects on all 8 rubric criteria. Write the numbers down.</li>
<li>Write one creator-log entry covering the whole month, and one sentence naming your next 30-day goal, saved inside <code>/creator</code>.</li>
</ol><p><strong>Done when:</strong> both clips and both projects have a full set of 8 scores, and a new 30-day goal exists in writing.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Rubric</span><span class="v">A scoring sheet that grades several criteria independently, instead of one overall impression.</span></div>
  <div class="kv"><span class="k">Creator log</span><span class="v">A running note, one entry per video: what worked, what did not, what changes next time (Lesson 0.4).</span></div>
  <div class="kv"><span class="k">Feedback loop</span><span class="v">Make → publish → measure → adjust → make again — step 10 of Lesson 0.3’s workflow feeding back into step 1.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Reshoot the Section 0 clip under the identical constraint — same rule, so the comparison isolates in-camera skill, not editing skill.</li>
  <li>One 8-criterion rubric scores both clips and both capstone projects, criterion by criterion, never as one overall number.</li>
  <li>The creator log started in Lesson 0.4 turns ten scattered videos into one visible pattern.</li>
  <li>Day 30 is a lap of the loop, not a finish line — leave with a written goal for the next thirty days.</li>
</ul>
<p class="note-ct"><strong>Course complete.</strong> Twenty-eight parts, two published projects, one rubric, one clip reshot to prove it. What happens after this page is the same as what happened on day 1 of Section 0: pick an idea, write one sentence, press record.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 27 · Bài 27.4</span>
<h2>Vẫn 60 giây đó, cách nhau ba mươi ngày</h2>
<p class="lead">Bài 0.3 từng bắt bạn quay một clip 60 giây không kịch bản, không cắt, không dựng, rồi ghi ra ba điều cần sửa. Clip đó vẫn còn nằm trong thư viện ảnh hoặc trên thẻ nhớ của bạn. Bài này bắt bạn quay lại đúng clip đó, đúng luật cũ, rồi gắn một con số vào điều đã thay đổi.</p>

<h3>Quay lại — cùng điều kiện, có chủ đích</h3>
${slide('cr-27', 12, 'Trước / sau — cùng một bài tập 60 giây')}
<p>Nói với máy quay 60 giây tự giới thiệu. Một take. Không cắt, không quay lại, không dựng. Điều kiện đó không phải thủ tục cho có — quay đúng luật y hệt Bài 0.3 mới cô lập được đúng thứ đã tiến bộ: kỹ năng LÚC QUAY (khung hình, ánh sáng, âm thanh, cách nói), không phải kỹ năng dựng phim. Một bản so sánh đã qua dựng chỉ chứng minh bạn biết dùng DaVinci Resolve — điều bạn đã biết rồi. Bài tập này chứng minh một điều khác.</p>

<h3>Chấm cả hai clip, và cả hai dự án, trên một rubric</h3>
${slide('cr-27', 13, 'Rubric tự chấm 8 tiêu chí')}
<table>
<tr><th>Tiêu chí</th><th>1–2 điểm trông như</th><th>4–5 điểm trông như</th></tr>
<tr><td>Hook</td><td>"Xin chào các bạn, hôm nay mình sẽ…"</td><td>Vào thẳng vấn đề trong 3 giây</td></tr>
<tr><td>Âm thanh</td><td>Vọng, rè, tiếng ồn nền rõ</td><td>Giọng rõ, khoảng −12…−6 dBFS</td></tr>
<tr><td>Ánh sáng</td><td>Ngược sáng, mặt tối</td><td>Có key/fill, mắt sáng rõ</td></tr>
<tr><td>Khung hình</td><td>Đầu chạm mép, đường chân trời nghiêng</td><td>Theo quy tắc 1/3, đủ khoảng nhìn</td></tr>
<tr><td>Nhịp dựng</td><td>Lê thê, khoảng lặng chết</td><td>Cắt đúng lúc, giữ được sự chú ý</td></tr>
<tr><td>Màu</td><td>Ám vàng/xanh, mỗi cảnh một tông khác nhau</td><td>Nhất quán giữa các cảnh</td></tr>
<tr><td>Phụ đề</td><td>Không có, hoặc sai chính tả</td><td>Đúng chữ, nằm trong vùng an toàn</td></tr>
<tr><td>Đóng gói</td><td>Tiêu đề chung chung</td><td>Lời hứa rõ ràng, đọc được ở cỡ thumbnail</td></tr>
</table>
<p>Chấm từng tiêu chí 1–5 cho cả hai clip 60 giây, rồi cho cả hai dự án capstone. Chấm ĐỘC LẬP từng tiêu chí — một dự án có màu đẹp nhưng âm thanh mờ đục không phải 5 điểm; đó là 5 điểm cho màu và 2 điểm cho âm thanh. Đó mới là thông tin hữu ích mà một ấn tượng tổng quát duy nhất sẽ che mất.</p>

<h3>Nhật ký creator, sau ba mươi ngày</h3>
<p>Bài 0.4 từng bảo bạn bắt đầu một <strong>nhật ký creator</strong>: điều gì ổn, điều gì chưa, lần sau đổi gì — một mục cho mỗi video. Nếu bạn đã giữ nó, đây là lúc nó trả công: đọc lại mười mục và kiểu lỗi lặp lại của chính bạn thường lộ rõ theo cách không video đơn lẻ nào cho bạn thấy được. Nếu chưa giữ, bắt đầu từ hôm nay — viết một mục ngay bây giờ, gộp cả sáu sản phẩm bạn làm trong tháng này.</p>
<div class="callout ok"><p><strong>Viết mục tiêu 30 ngày tiếp theo trong một câu</strong> — đúng thói quen Bài 0.4 đã mở ra. Đặt nó vào một ý tưởng hay dự án mới trong <code>/creator</code> để nó không chỉ là một ý nghĩ rồi bay mất.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — coi ngày 30 là vạch đích.</strong> Hai dự án đã đăng là bằng chứng quy trình chạy được, không phải lý do để dừng lại. Bước 10 của vòng lặp ở Bài 0.3 nối thẳng vào bước 1 — một kênh là hàng chục vòng lặp như thế này, không phải một dự án cuối khoá duy nhất.</p></div>

<h3>Học tiếp gì</h3>
${slide('cr-27', 14, 'Học tiếp gì')}
<p>Bốn hướng đáng nêu tên, mỗi hướng dựng trên một kỹ năng bạn đã có sẵn một phần:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Podcast nhiều khách mời</span><span class="v">Thu âm hai hệ thống rồi đồng bộ (Bài 9.4) cộng đa máy đồng bộ (Bài 13.3) đã là nền kỹ thuật — podcast chỉ thêm một mic và một máy quay cho người thứ hai.</span></div>
  <div class="kv"><span class="k">Livestream</span><span class="v">Tương tác khán giả thời gian thực, một kỹ năng khác hẳn dựng phim. Bắt đầu từ hướng dẫn livestream chính thức của YouTube.</span></div>
  <div class="kv"><span class="k">Motion design sâu hơn</span><span class="v">Chương 19 đã dạy nền tảng Fusion — dựng ảnh 2D và 3D xứng đáng luyện tập nhiều hơn hẳn một chương có thể đưa.</span></div>
  <div class="kv"><span class="k">Chỉnh màu như một nghề</span><span class="v">Chương 15 đã dạy scopes, Log và node — tài liệu đào tạo miễn phí của chính Blackmagic đi sâu hơn nhiều.</span></div>
</div>
<div class="link-card"><a href="https://www.youtube.com/creators/" target="_blank" rel="noopener">YouTube Creators — trang chính thức về làm và phát triển một kênh</a></div>
<div class="link-card"><a href="https://support.google.com/youtube/answer/2853700" target="_blank" rel="noopener">YouTube Help — Bắt đầu với livestream</a></div>
<div class="link-card"><a href="https://www.blackmagicdesign.com/products/davinciresolve/training" target="_blank" rel="noopener">Blackmagic Design — sách đào tạo miễn phí, gồm cả Colorist Guide</a></div>

<h3>🎬 Thực hành (60 phút)</h3>
<div class="callout ok"><ol>
<li>Quay lại clip 60 giây — đúng luật của Bài 0.3: một take, không cắt, không quay lại.</li>
<li>Chấm cả hai clip 60 giây và cả hai dự án capstone trên đủ 8 tiêu chí rubric. Viết điểm ra giấy.</li>
<li>Viết một mục nhật ký creator gộp cả tháng, và một câu nêu mục tiêu 30 ngày tiếp theo, lưu trong <code>/creator</code>.</li>
</ol><p><strong>Đạt khi:</strong> cả hai clip và cả hai dự án đều có đủ 8 điểm rubric, và một mục tiêu 30 ngày mới đã được viết ra.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Rubric</span><span class="v">Một bảng chấm điểm nhiều tiêu chí độc lập, thay vì một ấn tượng tổng quát duy nhất.</span></div>
  <div class="kv"><span class="k">Nhật ký creator</span><span class="v">Một ghi chú chạy dài, mỗi video một mục: điều gì ổn, điều gì chưa, lần sau đổi gì (Bài 0.4).</span></div>
  <div class="kv"><span class="k">Vòng phản hồi (feedback loop)</span><span class="v">Làm → đăng → đo → chỉnh → làm lại — bước 10 của quy trình ở Bài 0.3 nối lại vào bước 1.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Quay lại clip Mục 0 dưới cùng điều kiện — cùng luật, để phép so sánh cô lập đúng kỹ năng lúc quay, không phải kỹ năng dựng.</li>
  <li>Một rubric 8 tiêu chí chấm cả hai clip và cả hai dự án capstone, từng tiêu chí một, không bao giờ gộp thành một con số duy nhất.</li>
  <li>Nhật ký creator bắt đầu từ Bài 0.4 biến mười video rời rạc thành một khuôn mẫu nhìn thấy được.</li>
  <li>Ngày 30 là một vòng của vòng lặp, không phải vạch đích — rời đi với một mục tiêu đã viết ra cho ba mươi ngày tiếp theo.</li>
</ul>
<p class="note-ct"><strong>Khoá học hoàn tất.</strong> Hai mươi tám phần, hai dự án đã lên sóng, một rubric, một clip quay lại để chứng minh. Điều xảy ra sau trang này giống hệt điều đã xảy ra ở ngày 1 của Mục 0: chọn một ý tưởng, viết một câu, bấm quay.</p>
</div>
`,
    },

    /* ─────────────────── 27.5 kiểm tra ─────────────────── */
    {
      title: '27.5 — Chapter 27 check|||27.5 — Kiểm tra chương 27',
      slug: 'cr-27-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu tình huống tổng hợp cả chương: chọn mức kế hoạch, dùng đúng công cụ /creator, thứ tự quy trình, quay dồn, đăng chéo, rubric tự chấm, và vòng lặp sau ngày 30.',
      content: `
<div class="ml-en">
<h2>📝 Chapter 27 — summary and self-check</h2>
<ul>
  <li><strong>Plan:</strong> a capstone applies existing skills; pick a ceiling (~16 h/week) or a lighter plan (~8 h/week) to fit the week you actually have, and run both projects through /creator/ideas, /creator/calendar and /creator/pipeline.</li>
  <li><strong>Project 1:</strong> one long video through all ten steps from Lesson 0.3 — idea, script, shot list, shoot, ingest, edit to picture lock, colour/sound, package, publish.</li>
  <li><strong>Project 2:</strong> four scripts, one batching session, a fast CapCut edit, and clean cross-posting with no re-uploaded watermarks.</li>
  <li><strong>Self-check:</strong> reshoot the Section 0 clip under the same one-take rule, score both clips and both projects on the 8-criterion rubric, and write a creator-log entry plus a new 30-day goal.</li>
</ul>
<p><strong>Before the quiz:</strong> are both projects actually published, and have you filmed the comparison clip?</p>
</div>
<div class="ml-vi">
<h2>📝 Chương 27 — tóm tắt và tự kiểm</h2>
<ul>
  <li><strong>Kế hoạch:</strong> capstone dùng lại kỹ năng đã có; chọn mức trần (~16 giờ/tuần) hay mức nhẹ (~8 giờ/tuần) theo đúng tuần bạn đang có, rồi chạy cả hai dự án qua /creator/ideas, /creator/calendar và /creator/pipeline.</li>
  <li><strong>Dự án 1:</strong> một video dài đi đủ mười bước ở Bài 0.3 — ý tưởng, kịch bản, shot list, quay, đổ thẻ, dựng tới picture lock, màu/âm, đóng gói, đăng.</li>
  <li><strong>Dự án 2:</strong> bốn kịch bản, một buổi quay dồn, dựng nhanh bằng CapCut, đăng chéo sạch không tải lại bản có watermark.</li>
  <li><strong>Tự kiểm:</strong> quay lại clip Mục 0 đúng luật một take, chấm cả hai clip và cả hai dự án trên rubric 8 tiêu chí, rồi viết một mục nhật ký creator cùng một mục tiêu 30 ngày mới.</li>
</ul>
<p><strong>Trước khi làm bài:</strong> cả hai dự án đã thật sự lên sóng chưa, và bạn đã quay clip để so sánh chưa?</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'Week 3 of your 30-day plan lands right on top of midterm exams. What is the right move?|||Tuần 3 của kế hoạch 30 ngày trùng đúng lịch thi giữa kỳ. Bạn nên làm gì?',
            options: [
              'Still force the full "ceiling" numbers that week, and sleep less|||Vẫn cố quay đủ số lượng mức trần trong tuần đó, ngủ ít lại',
              'Skip the whole batching session that week and cram everything into Week 4|||Bỏ hẳn buổi quay dồn tuần đó, dồn hết sang Tuần 4 cho kịp',
              'Switch to the lighter plan for just that week, and keep a steady posting rhythm|||Chuyển sang mức nhẹ cho riêng tuần đó, giữ nhịp đăng đều',
              'Pause the whole channel until exams are over, then pick it back up|||Dừng cả kênh tới khi thi xong rồi tính tiếp',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'The lighter plan exists for exactly this situation — keeping a rhythm, even a smaller one, matters more than hitting a count, and cramming everything into the next week breaks the hours-per-week math the whole plan was built on.|||Mức nhẹ sinh ra chính là để dùng cho đúng tình huống này — giữ được nhịp (dù ít hơn) quan trọng hơn đạt đủ số lượng, và dồn hết một lượt sang tuần sau phá vỡ cả toán giờ/tuần đã tính từ đầu.',
          },
          {
            question: 'You want to know whether Project 1’s long video is currently at "Editing" or already "Scheduled". Where do you look?|||Bạn muốn biết video dài của Dự án 1 đang ở "Đang dựng" hay đã "Đã lên lịch". Bạn xem ở đâu?',
            options: [
              '/creator/pipeline — the 6-column board that tracks production stages|||/creator/pipeline — bảng 6 cột theo dõi giai đoạn sản xuất',
              '/creator/calendar — it only stores a filming date and a publish date|||/creator/calendar — chỉ có 2 mốc Quay và Đăng',
              '/creator/ideas — the idea bank does not track production stages|||/creator/ideas — kho ý tưởng, không theo dõi giai đoạn',
              'The Script tab of /creator/projects — it only stores script versions|||Tab Kịch bản trong /creator/projects — chỉ lưu phiên bản kịch bản',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'That distinction was set up back in Lesson 2.3: the calendar answers "when" with exactly two dates, and the pipeline board answers "how far along" with six columns you drag a card through.|||Sự phân biệt này đã được đặt ra từ Bài 2.3: lịch trả lời "khi nào" với đúng hai mốc, còn bảng pipeline trả lời "tới đâu rồi" với sáu cột bạn kéo thẻ qua.',
          },
          {
            question: 'You just finished editing Project 1’s long video, it looks good, and you are about to hit publish tonight. Per Lesson 0.3’s step 9, what have you not done yet?|||Bạn vừa dựng xong video dài Dự án 1, xem lại thấy ổn, và định bấm đăng luôn tối nay. Theo bước 9 ở Bài 0.3, việc bạn CHƯA làm là gì?',
            options: [
              'Film a bit more B-roll, just to be safe|||Quay thêm B-roll cho chắc',
              'Switch to a different editing program|||Đổi sang phần mềm dựng khác',
              'Add some background music for atmosphere|||Thêm nhạc nền cho sinh động',
              'Decide the title and thumbnail — the "packaging" step 9 requires|||Nghĩ tiêu đề + thumbnail — bước "đóng gói" mà bước 9 đòi hỏi',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'Step 9 of the workflow is Publish, and Lesson 27.2 is explicit that packaging is part of it — you already drafted a title in Lesson 2.2, but it has to be confirmed, not skipped, before the video actually goes live.|||Bước 9 của quy trình là Đăng, và Bài 27.2 nói rõ đóng gói nằm trong đó — bạn đã có tiêu đề nháp từ Bài 2.2, nhưng nó phải được xác nhận lại, không được bỏ qua, trước khi video thật sự lên sóng.',
          },
          {
            question: 'You just copied the memory card’s footage from the long-video shoot onto your Mac. In the correct 10-step order, what comes next — before you open any editing software?|||Bạn vừa đổ thẻ nhớ của buổi quay video dài về máy Mac. Theo đúng thứ tự 10 bước, việc tiếp theo là gì — TRƯỚC khi mở phần mềm dựng?',
            options: [
              'Name the folder and back it up following the 3-2-1 rule (Lessons 11.1–11.2)|||Đặt tên thư mục và sao lưu theo luật 3-2-1 (Bài 11.1–11.2)',
              'Open DaVinci Resolve and start cutting right away|||Mở ngay DaVinci Resolve và bắt đầu cắt',
              'Do a rough colour pass first, to save time later|||Chỉnh màu sơ bộ trước cho đỡ mất công sau',
              'Write the video description to get ready for YouTube|||Viết mô tả video để chuẩn bị đăng YouTube',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'Ingest comes before Edit for a reason: skipping the named folder and the second backup copy means a single card failure or an accidental delete can cost you the entire shoot, with nothing to fall back on.|||Đổ thẻ + sao lưu đứng trước Dựng là có lý do: bỏ qua thư mục đặt tên và bản sao lưu thứ hai nghĩa là chỉ một lần hỏng thẻ hay lỡ tay xoá là mất trắng cả buổi quay, không còn gì để cứu lại.',
          },
          {
            question: 'For Project 2’s batching session (3 shorts + 1 vlog), what is the most sensible order of work?|||Trong buổi quay dồn cho Dự án 2 (3 video ngắn + 1 vlog), thứ tự hợp lý nhất là gì?',
            options: [
              'Film four completely separate sessions, one product per session|||Quay riêng bốn buổi khác nhau, mỗi buổi một sản phẩm',
              'Film all three shorts first, then shoot the vlog some weeks later|||Quay hết ba video ngắn trước, vài tuần sau mới quay vlog',
              'Set up once, let the vlog run through the whole session, and slot the shorts and B-roll into the gaps|||Dựng máy một lần, để vlog chạy nền cả buổi, chen 3 video ngắn và B-roll vào lúc dừng tay',
              'Shoot the vlog first, tear down the setup, then rebuild it for the shorts|||Quay vlog trước, dọn hết thiết bị rồi dựng lại từ đầu để quay video ngắn',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'This is the batching principle from Lesson 2.3 applied directly: the biggest cost of a shoot day is setting up and breaking down gear, not the filming itself — so you set up exactly once and let it produce four pieces.|||Đây chính là nguyên tắc quay dồn của Bài 2.3 áp dụng trực tiếp: chi phí lớn nhất của một ngày quay là dựng và dọn thiết bị, không phải bản thân việc quay — nên bạn dựng máy đúng một lần rồi để nó tạo ra bốn sản phẩm.',
          },
          {
            question: 'You downloaded a short video you already posted to TikTok (it still has the TikTok watermark) and want to post the same file straight to Reels and Shorts to save time. What is wrong with that plan?|||Bạn tải về một video ngắn đã đăng trên TikTok (vẫn còn watermark TikTok) và định đăng thẳng file đó lên Reels và Shorts cho nhanh. Vấn đề của cách làm này là gì?',
            options: [
              'Nothing — this is a normal way to save time when cross-posting|||Không vấn đề gì — đây là cách bình thường để tiết kiệm thời gian khi đăng chéo',
              'You only need to rename the file first and it will be fine|||Chỉ cần đổi tên file trước khi đăng là được',
              'The only real issue is that the picture quality drops slightly|||Vấn đề duy nhất là chất lượng hình giảm nhẹ',
              'Other platforms tend to recommend video carrying another app’s watermark less — you need a clean master export instead|||Nền tảng khác thường đề xuất kém hơn cho video mang watermark của app khác — cần một bản xuất gốc sạch riêng',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'Lesson 2.4 already covered exactly this: cross-posting cleanly means exporting one watermark-free master and cutting each platform’s version from it, not re-uploading a file that already has another app’s logo baked in.|||Bài 2.4 đã nói đúng chuyện này: đăng chéo sạch nghĩa là xuất một bản gốc không watermark rồi dựng riêng bản cho từng nền tảng từ đó, không phải đăng lại một file đã có sẵn logo của app khác.',
          },
          {
            question: 'Scoring the long video on the rubric: the light is beautiful and the framing is textbook 1/3, but the room was untreated and there is a clear echo. How should it be scored?|||Chấm rubric cho video dài: ánh sáng đẹp, khung hình chuẩn 1/3, nhưng phòng quay không xử lý nên vọng tiếng rõ. Cách chấm đúng là gì?',
            options: [
              'Score Sound low on its own, even though the other criteria are high — the rubric grades each criterion independently|||Chấm THẤP riêng tiêu chí Âm thanh dù các tiêu chí khác cao — rubric chấm từng tiêu chí độc lập',
              'Give it an overall 5/5 since most criteria are strong|||Cho điểm chung 5/5 vì đa số tiêu chí đều tốt',
              'Skip the Sound criterion since the light is already good|||Bỏ qua tiêu chí Âm thanh vì ánh sáng đã tốt rồi',
              'It cannot be scored — the rubric only applies to the Section 0 clip|||Không chấm được vì rubric chỉ áp dụng cho clip Mục 0',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'The whole point of an 8-criterion rubric is to surface a weakness that a strong overall impression would otherwise hide — and Lesson 27.4 uses the same rubric on both the two clips and the two capstone projects.|||Cả điểm của rubric 8 tiêu chí là để lộ ra một điểm yếu mà một ấn tượng tổng quát tốt sẽ che mất — và Bài 27.4 dùng đúng rubric này cho cả hai clip lẫn hai dự án capstone.',
          },
          {
            question: 'In Chapter 27 you reshoot the exact 60-second self-intro clip from Section 0. Why must the reshoot keep the same "one take, no cuts, no edit" rule as the original?|||Ở Chương 27 bạn quay lại đúng clip 60 giây tự giới thiệu của Mục 0. Vì sao bản quay lại phải giữ đúng luật "một take, không cắt, không dựng" như bản gốc?',
            options: [
              'Editing takes too much time, so it is simplest to skip it|||Vì dựng phim tốn thời gian nên bỏ qua cho nhanh',
              'Phone editing apps are not powerful enough for a fair comparison|||Vì phần mềm dựng trên điện thoại không đủ mạnh',
              'It isolates what actually improved — in-camera skill (framing, light, sound, delivery) — instead of mixing in editing skill|||Để cô lập đúng thứ đã tiến bộ — kỹ năng lúc quay (khung, sáng, âm, nói) — không lẫn với kỹ năng dựng',
              'Copyright rules do not allow the 60-second clip to be edited|||Vì clip 60 giây không được phép chỉnh sửa theo luật bản quyền',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'An edited comparison would only prove you can use DaVinci Resolve, which the rubric already scores separately on the two capstone projects — the reshoot’s job is to measure something the edit cannot touch.|||Một bản so sánh đã qua dựng chỉ chứng minh bạn biết dùng DaVinci Resolve, thứ rubric đã chấm riêng ở hai dự án capstone rồi — việc của bản quay lại là đo một thứ mà khâu dựng không chạm tới được.',
          },
          {
            question: 'Day 30 arrives: both projects are published, the rubric is scored. What is the correct next step?|||Ngày 30 tới: cả 2 dự án đã đăng, rubric đã chấm xong. Bước đúng tiếp theo là gì?',
            options: [
              'Consider it finished and close /creator, since the goal has been met|||Coi như xong, đóng /creator lại vì mục tiêu đã đạt',
              'Write a creator-log entry (worked / did not / next time) and set a new 30-day goal — the loop does not stop here|||Viết nhật ký creator (ổn/chưa ổn/lần sau) và đặt mục tiêu 30 ngày TIẾP THEO — vòng lặp không dừng ở đây',
              'Delete both projects and start completely fresh|||Xoá cả hai dự án cũ để bắt đầu lại từ đầu',
              'Wait at least three months before publishing anything else|||Chờ ít nhất 3 tháng mới đăng video kế tiếp',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'The capstone proves the workflow runs — it is not the finish line. Step 10 of Lesson 0.3’s loop (measure) feeds directly back into step 1 (idea); a channel is dozens of laps of this same loop.|||Capstone chứng minh quy trình chạy được — nó không phải vạch đích. Bước 10 (đo lường) của vòng lặp ở Bài 0.3 nối thẳng lại vào bước 1 (ý tưởng); một kênh là hàng chục vòng lặp giống hệt thế này.',
          },
          {
            question: 'You want to try a 2–3 guest podcast (multiple cameras, multiple microphones). Which lessons already taught the technical foundation you need, even though they never used the word "podcast"?|||Bạn muốn thử làm một podcast 2-3 khách mời (nhiều máy quay, nhiều micro). Bài học nào đã dạy đúng nền tảng kỹ thuật bạn cần, dù chưa từng gọi tên "podcast"?',
            options: [
              'Chapter 19 — Motion graphics and Fusion|||Chương 19 — Motion graphics và Fusion',
              'Lesson 9.4 (recording two systems and syncing) plus Lesson 13.3 (multi-camera, Auto Sync Audio)|||Bài 9.4 (thu hai hệ thống, đồng bộ) cộng Bài 13.3 (đa máy, Auto Sync Audio)',
              'Chapter 20 — Short vertical video|||Chương 20 — Video ngắn dọc',
              'Lesson 16.4 — Whisper on the Linux GPU box|||Bài 16.4 — Whisper trên máy Linux có GPU',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'A podcast with guests is dual-system audio and multi-camera sync applied to more than one person at once — exactly the two skills Lesson 9.4 and Lesson 13.3 already built, just with an extra mic and camera added.|||Podcast có khách mời chính là thu âm hai hệ thống và đồng bộ đa máy áp dụng cho nhiều hơn một người cùng lúc — đúng hai kỹ năng Bài 9.4 và Bài 13.3 đã dựng sẵn, chỉ thêm một mic và một máy quay nữa.',
          },
        ],
      },
    },
  ],
};
