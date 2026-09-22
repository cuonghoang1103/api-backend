/**
 * Content Creator — Chương 4: Phân cảnh — shot list & storyboard. Song ngữ EN/VI (.ml-en / .ml-vi).
 * ⚠️ KHÔNG backtick trần trong content (dùng &#96;); `${` trong mã mẫu viết \${ ; gạch chéo ngược viết \\
 */
import { gallery, slide } from './_slides.mjs';

export default {
  title: 'Chapter 4 — Shot Lists & Storyboards|||Chương 4 — Phân cảnh: shot list & storyboard',
  description: 'Chữa dứt điểm thói quen bật máy quay một lèo 20–30 phút rồi về mới cắt: toán dung lượng thật, từ vựng cảnh quay, cách viết shot list, và kỷ luật một take.',
  lessons: [
    /* ─────────────────────── 4.0 slide bài giảng ─────────────────────── */
    {
      title: '4.0 — Chapter 4 in 14 slides|||4.0 — Chương 4 trong 14 slide',
      slug: 'cr-04-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Toán dung lượng Pocket 3, từ vựng cảnh/shot/take, shot list, storyboard và kỷ luật một take — gói cả chương vào 14 slide.',
      content: `
<div class="ml-en"><h2>📑 Chapter 4 in 14 slides</h2>
<p>Slide 3–4 (the storage math) and slide 12 (one-take discipline) are the two that will actually change how you shoot. Everything else builds the vocabulary and the paperwork around them.</p>
<p>Skim before the chapter to see the shape of it, then come back after each lesson to revise. If a slide still does not click, the lesson that teaches it sits right below.</p></div>
<div class="ml-vi"><h2>📑 Chương 4 trong 14 slide</h2>
<p>Slide 3–4 (toán dung lượng) và slide 12 (kỷ luật một take) là hai slide thật sự đổi cách bạn quay. Phần còn lại dựng từ vựng và giấy tờ xung quanh hai cái đó.</p>
<p>Lướt trước khi vào chương để thấy hình dạng cả chương, rồi quay lại sau mỗi bài để ôn. Slide nào chưa hiểu thì bài dạy nó nằm ngay bên dưới.</p></div>
${gallery('cr-04', [
  [1, 'Bìa'],
  [2, 'Bản đồ chương'],
  [3, '"Một lèo 30 phút" đấu với "25 clip ngắn"'],
  [4, 'Toán dung lượng thẻ nhớ — Pocket 3'],
  [5, 'Từ vựng: Scene · Sequence · Shot · Take · Setup'],
  [6, 'A-roll và B-roll'],
  [7, 'Coverage — một hành động, 5 cỡ cảnh'],
  [8, 'Các cột của một shot list'],
  [9, 'Shot list thật — Vlog "Một ngày code ở FPTU"'],
  [10, 'Từ kịch bản ra shot list'],
  [11, 'Quay theo bối cảnh, không theo kịch bản'],
  [12, 'Kỷ luật MỘT take'],
  [13, 'Checklist ngày quay'],
  [14, 'Thực hành 15–30 phút'],
])}
`,
    },

    /* ─────────────────────── 4.1 ─────────────────────── */
    {
      title: '4.1 — Stop shooting one long take|||4.1 — Bỏ thói quen quay một lèo',
      slug: 'cr-04-1-bay-quay-mot-leo',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Toán dung lượng thật của Pocket 3, vì sao "quay một lèo rồi tính sau" luôn thua, và tư duy quay để dựng thay vì quay để tìm.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>Every minute you shoot without a plan is a minute you pay for twice</h2>
<p class="lead">You turn on the Pocket 3, hit record, and let it run for 20–30 minutes because you are not sure yet what the video needs — you will "figure it out in the edit." That single habit is the most expensive mistake in this course: it fills your memory card, and it buries the one good minute inside thirty minutes you now have to scrub through by hand.</p>

<h3>The real numbers behind the REC button</h3>
<p>The Osmo Pocket 3 records 4K at up to <strong>130 Mbps</strong> (H.264/HEVC, confirmed on DJI's own specs page). Turn that into gigabytes with one formula:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Formula</span><span class="v">GB/minute = Mbps × 60 ÷ 8 ÷ 1000</span></div>
  <div class="kv"><span class="k">At 130 Mbps</span><span class="v">130 × 60 ÷ 8 ÷ 1000 = <strong>0.975 GB per minute</strong> — call it 1 GB/minute</span></div>
  <div class="kv"><span class="k">One 30-minute take</span><span class="v">≈ 29.25 GB — almost a third of a 128 GB card, gone before you have decided if any of it is usable</span></div>
  <div class="kv"><span class="k">A 128 GB card</span><span class="v">fills in ≈ 131 minutes (≈ 2h11) at max bitrate</span></div>
  <div class="kv"><span class="k">A 256 GB card</span><span class="v">fills in ≈ 262 minutes (≈ 4h23) at max bitrate</span></div>
</div>
${slide('cr-04', 4, 'Toán dung lượng thẻ nhớ — Pocket 3')}
<p>That 130 Mbps is a <em>maximum</em> — DJI's bitrate is variable, so a static shot of a wall costs less than a busy street. Treat 0.975 GB/minute as your safe planning number, not a promise.</p>

<h3>"I will figure it out in the edit" is a fantasy — do the arithmetic</h3>
<p>Reviewing footage takes roughly as long as the footage itself, often longer the first time, because you are watching for something you have not defined yet. Thirty minutes of undirected footage means thirty-plus minutes just to find out what you have, before you have cut a single frame. Do that after every shoot and editing stops being the fun part — it becomes the punishment for not planning.</p>
${slide('cr-04', 3, '"Một lèo 30 phút" đấu với "25 clip ngắn"')}
<p>Compare the two bars above. The one long take is a single file with no internal markers — "the good part" is somewhere between minute 4 and minute 22, and the only way to find it is to scrub. Twenty-five short clips is twenty-five decision points: each time you hit stop, you already know roughly what that clip is for. You are not editing faster because you have magic software — you are editing faster because you already did half the editing decisions <em>while shooting</em>.</p>

<div class="callout warn"><p><strong>Heat and battery are real limits, not excuses.</strong> The Pocket 3's battery is rated by DJI at about 166 minutes of continuous recording — but that number is measured at 1080p/24fps, room temperature, with Wi-Fi and the screen both off. Real shooting keeps the screen on so you can frame the shot, often in direct sun, at 4K — expect noticeably less. A gimbal camera that has been recording non-stop for 20 minutes is also a gimbal camera that is warmer than when you started, and DJI's stated operating range tops out at 40°C (104°F). None of this is a reason to panic; it is a reason to stop treating "just keep it rolling" as free.</p></div>

<h3>The shooting ratio — a number every production already tracks, whether you know it or not</h3>
<p>Film and TV production has a name for "how much did we shoot versus how much did we actually use": the <strong>shooting ratio</strong>. A controlled narrative shoot working from a tight script typically runs 6:1 to 10:1. A documentary, chasing moments that cannot be scripted, is commonly reported at over 100:1 in the digital era — because storage is cheap and the material is unpredictable by nature (Wikipedia, "Shooting ratio").</p>
<p>Here is the part that matters for you: a documentary crew accepts a high ratio <em>on purpose</em>, because they cannot know in advance which moment will matter. You are not making a documentary about your own workday — you already know the beats before you press record. Shooting one undirected 30-minute take to extract a 3-minute vlog gives you a ratio near 10:1, but with none of the planning that makes a documentary's 100:1 worthwhile — you paid the storage and review cost of "unpredictable" footage that was actually entirely predictable.</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — "I'll just leave it running so I don't miss anything."</strong> This feels safe and is almost never true. You do not review footage in real time while shooting, so "leaving it running" does not actually catch more good moments — it just adds more footage you have to review later to find the moments you would have caught anyway by being deliberate. The fix is not "record less bravely" — it is knowing what you are shooting FOR before you shoot it, which is exactly what the rest of this chapter teaches.</p></div>

<h3>Shoot for the edit</h3>
<p>Professionals call this mindset <strong>"shoot for the edit"</strong>: before you press record, you can already say which few seconds of this clip will survive into the final cut, and roughly where. If you cannot answer "what is this clip for," you are not filming a plan — you are gambling storage and time on the hope that something usable happens on camera. Chapters 4.2–4.4 give you the vocabulary and the paperwork (shot lists, storyboards) to answer that question every single time, in seconds, before you press REC.</p>

<h3>When one long take is actually the right call</h3>
<p>None of this means "never record long." Some formats are supposed to run long, and this chapter's advice still applies inside them — you just place your markers differently:</p>
<ul>
<li><strong>Livestreams</strong> — there is no "edit" to shoot for in real time, but note timestamps of strong moments as you go (on a second device or with a co-host) so you can clip highlights afterward without re-watching the whole stream.</li>
<li><strong>Long interviews</strong> — you cannot storyboard someone else's answers, but you can still write a question list (your shot list, just made of questions instead of shots) and jot the timestamp next to any answer that lands.</li>
<li><strong>Screen-recorded lectures</strong> — Chapter 22 covers this in depth, but the short version: split by topic into separate files or chaptered sections instead of one continuous 40-minute recording, so a mistake in minute 30 does not force you to re-record minutes 1–29.</li>
</ul>
<p>The common thread: long recording is fine when you plant markers as you go. What breaks you is long recording with <em>no</em> markers and no plan — which is exactly the one-long-take habit this lesson is here to end.</p>

<p class="note-ct"><strong>Next:</strong> Lesson 4.2 gives you the five words (scene, shot, take, A-roll, B-roll) that let you actually describe what you are about to shoot — the vocabulary a shot list is written in.</p>

<h3>🎬 Practice (15–20 minutes)</h3>
<div class="callout ok"><ol>
<li>Open the Files app or Finder and check how much free space is on your Pocket 3's card (or your iPhone's storage).</li>
<li>Using 0.975 GB/minute, calculate how many minutes of 4K footage you have room for right now.</li>
<li>Pick any 5-minute task you actually need to film this week. Write down, in one sentence each, what the first, middle, and last clip of that video will show — <em>before</em> you shoot anything.</li>
</ol><p><strong>Done when:</strong> you can state your card's remaining shooting time in minutes, and you have three one-sentence clip descriptions written down.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Bitrate (Mbps)</span><span class="v">How many megabits of video data are recorded per second — the single number that drives file size.</span></div>
  <div class="kv"><span class="k">Shooting ratio</span><span class="v">Total footage shot ÷ footage actually used in the final cut.</span></div>
  <div class="kv"><span class="k">Shoot for the edit</span><span class="v">Only record a clip once you already know its role in the final video.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Pocket 3 at max bitrate (130 Mbps) eats ≈ 0.975 GB per minute — a 30-minute take is ≈ 29 GB, gone before you've decided if it's usable.</li>
<li>A 128 GB card holds ≈ 131 minutes, a 256 GB card ≈ 262 minutes, at maximum bitrate.</li>
<li>Reviewing undirected footage costs roughly as much time as shooting it — the "I'll sort it out later" plan has a real, large time cost.</li>
<li>A high shooting ratio is fine when it is unavoidable (documentary); it is just waste when the content was predictable and you simply did not plan.</li>
<li>Long recording is fine WITH markers (livestreams, interviews, lectures); it is only a trap WITHOUT them.</li>
</ul>

<div class="link-card"><a href="https://www.dji.com/osmo-pocket-3/specs" target="_blank" rel="noopener">DJI — Osmo Pocket 3 official specs (bitrate, battery, storage)</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Mỗi phút quay không có kế hoạch là một phút bạn phải trả giá HAI LẦN</h2>
<p class="lead">Bạn bật Pocket 3, bấm quay, để máy chạy 20–30 phút vì chưa biết chắc video cần gì — "để lúc dựng tính sau." Đúng một thói quen đó là lỗi tốn kém nhất trong cả khoá học này: nó làm đầy thẻ nhớ, và chôn đúng một phút hay ho vào giữa ba mươi phút bạn phải tua bằng tay để tìm.</p>

<h3>Con số thật đằng sau nút REC</h3>
<p>Osmo Pocket 3 quay 4K với bitrate tối đa <strong>130 Mbps</strong> (H.264/HEVC — số này lấy từ đúng trang thông số kỹ thuật của DJI). Đổi ra dung lượng bằng một công thức:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Công thức</span><span class="v">GB/phút = Mbps × 60 ÷ 8 ÷ 1000</span></div>
  <div class="kv"><span class="k">Ở 130 Mbps</span><span class="v">130 × 60 ÷ 8 ÷ 1000 = <strong>0,975 GB mỗi phút</strong> — làm tròn thành 1 GB/phút cho dễ nhớ</span></div>
  <div class="kv"><span class="k">Một lèo 30 phút</span><span class="v">≈ 29,25 GB — gần một phần ba thẻ 128GB, mất trước khi bạn kịp biết đoạn nào dùng được</span></div>
  <div class="kv"><span class="k">Thẻ 128GB</span><span class="v">đầy sau ≈ 131 phút (≈ 2 giờ 11) ở bitrate tối đa</span></div>
  <div class="kv"><span class="k">Thẻ 256GB</span><span class="v">đầy sau ≈ 262 phút (≈ 4 giờ 23) ở bitrate tối đa</span></div>
</div>
${slide('cr-04', 4, 'Toán dung lượng thẻ nhớ — Pocket 3')}
<p>130 Mbps là mức <em>tối đa</em> — bitrate của Pocket 3 thay đổi theo cảnh (VBR), nên quay một bức tường đứng yên sẽ nhẹ hơn quay một con phố đông người. Cứ dùng 0,975 GB/phút làm số AN TOÀN để lên kế hoạch, đừng coi nó là con số cố định tuyệt đối.</p>

<h3>"Để hậu kỳ lo" là một ảo tưởng — làm phép tính là thấy ngay</h3>
<p>Xem lại một đoạn phim tốn thời gian gần bằng chính thời lượng đoạn đó, nhiều khi còn lâu hơn ở lần đầu, vì bạn đang tìm một thứ mình chưa định nghĩa rõ là gì. Ba mươi phút quay không định hướng nghĩa là ba mươi-mấy phút chỉ để BIẾT mình có gì, trước khi cắt được một khung hình nào. Làm vậy sau mỗi buổi quay thì dựng phim không còn là phần vui — nó thành hình phạt cho việc không lên kế hoạch.</p>
${slide('cr-04', 3, '"Một lèo 30 phút" đấu với "25 clip ngắn"')}
<p>Nhìn hai dải màu ở slide trên. Một lèo là MỘT file dài không có mốc nào bên trong — "đoạn hay" nằm đâu đó giữa phút 4 và phút 22, và cách duy nhất để tìm là tua tay. Hai mươi lăm clip ngắn là hai mươi lăm điểm quyết định: mỗi lần bạn bấm dừng, bạn đã biết đại khái clip đó dùng để làm gì. Dựng nhanh hơn không phải vì phần mềm có phép màu — mà vì bạn đã làm sẵn một nửa việc "chọn cảnh" ngay TRONG LÚC quay rồi.</p>

<div class="callout warn"><p><strong>Nhiệt và pin là giới hạn thật, không phải cái cớ.</strong> DJI công bố pin Pocket 3 quay liên tục được khoảng 166 phút — nhưng con số đó đo ở 1080p/24fps, nhiệt độ phòng, tắt cả Wi-Fi lẫn màn hình. Quay thật thì màn hình phải sáng để bạn canh khung hình, thường dưới nắng, ở 4K — thời gian thực tế chắc chắn ngắn hơn rõ rệt. Một máy gimbal đã quay liên tục 20 phút cũng là một máy đã nóng hơn lúc mới bật, và dải nhiệt độ hoạt động DJI công bố chỉ tới 40°C. Không phải để bạn hoảng, mà để bạn thôi nghĩ "cứ để máy chạy" là miễn phí.</p></div>

<h3>Tỉ lệ quay/dùng — con số mọi đoàn phim đều đang theo dõi, dù bạn có biết hay không</h3>
<p>Ngành phim có hẳn một tên cho "quay bao nhiêu so với dùng được bao nhiêu": <strong>shooting ratio</strong> (tỉ lệ quay/dùng). Một phim truyện bám sát kịch bản chặt thường rơi vào khoảng 6:1 tới 10:1. Một phim tài liệu, đuổi theo những khoảnh khắc không viết kịch bản trước được, thường được ghi nhận vượt quá 100:1 trong thời đại số — vì lưu trữ rẻ và bản chất tư liệu là không đoán trước được (Wikipedia, mục "Shooting ratio").</p>
<p>Đây là phần quan trọng với bạn: đoàn làm phim tài liệu CHỦ ĐỘNG chấp nhận tỉ lệ cao, vì họ không thể biết trước khoảnh khắc nào sẽ đắt giá. Bạn không đang làm phim tài liệu về chính ngày làm việc của mình — bạn đã biết trước các nhịp chính rồi. Quay một lèo 30 phút không định hướng để rút ra 3 phút vlog cho bạn tỉ lệ gần 10:1, nhưng KHÔNG có phần lên kế hoạch khiến tỉ lệ 100:1 của phim tài liệu trở nên đáng giá — bạn trả giá lưu trữ và thời gian xem lại của thứ "không đoán trước được", trong khi nó vốn hoàn toàn đoán trước được.</p>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — "cứ để máy chạy cho chắc, kẻo bỏ lỡ."</strong> Nghe có vẻ an toàn nhưng gần như luôn sai. Bạn không xem lại footage theo thời gian thực trong lúc quay, nên "cứ để chạy" không thật sự bắt được nhiều khoảnh khắc hay hơn — nó chỉ cộng thêm việc phải xem lại SAU để tìm đúng những khoảnh khắc mà nếu chủ động, bạn đã bắt được rồi. Cách chữa không phải là "quay dè dặt hơn" — mà là biết mình quay ĐỂ LÀM GÌ trước khi bấm quay, đúng thứ phần còn lại của chương này dạy.</p></div>

<h3>Quay để dựng (shoot for the edit)</h3>
<p>Dân làm nghề gọi tư duy này là <strong>"quay để dựng"</strong>: trước khi bấm quay, bạn đã có thể nói được vài giây nào của clip này sẽ sống sót vào bản dựng cuối, và nằm ở đâu trong video. Nếu không trả lời được "clip này để làm gì", bạn không đang quay theo kế hoạch — bạn đang đánh cược dung lượng và thời gian, hy vọng có gì đó dùng được xuất hiện trên máy. Bài 4.2–4.4 cho bạn từ vựng và giấy tờ (shot list, storyboard) để trả lời câu đó mỗi lần, trong vài giây, trước khi bấm REC.</p>

<h3>Khi nào quay dài lại là ĐÚNG</h3>
<p>Không phải "không bao giờ được quay dài." Có những định dạng vốn phải quay dài, và lời khuyên của bài này vẫn áp dụng bên trong chúng — chỉ là bạn đặt mốc khác đi:</p>
<ul>
<li><strong>Livestream</strong> — không có "bản dựng" nào để quay hướng tới trong thời gian thực, nhưng vẫn nên ghi lại mốc thời gian của khoảnh khắc hay khi nó xảy ra (bằng máy thứ hai hoặc nhờ người đồng hành) để sau này cắt highlight mà không phải xem lại cả buổi.</li>
<li><strong>Phỏng vấn dài</strong> — bạn không viết kịch bản được câu trả lời của người khác, nhưng vẫn viết được danh sách câu hỏi (chính là shot list của bạn, chỉ gồm câu hỏi thay vì cú máy), và ghi mốc thời gian ngay khi có câu trả lời đắt giá.</li>
<li><strong>Quay màn hình bài giảng</strong> — Chương 22 nói kỹ hơn, nhưng gọn lại: chia theo chủ đề thành nhiều file hoặc nhiều đoạn có mốc rõ ràng, thay vì một bản ghi liền 40 phút — để lỗi ở phút 30 không bắt bạn quay lại từ phút 1.</li>
</ul>
<p>Điểm chung: quay dài không sao cả khi bạn cắm mốc dọc đường. Thứ làm hỏng bạn là quay dài KHÔNG mốc và không kế hoạch — đúng thói quen bài này đang chữa.</p>

<p class="note-ct"><strong>Bài tiếp theo:</strong> Bài 4.2 cho bạn năm từ (cảnh, shot, take, A-roll, B-roll) để thật sự mô tả được mình sắp quay gì — thứ ngôn ngữ mà một shot list được viết bằng nó.</p>

<h3>🎬 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Mở app Files (hoặc Finder) kiểm dung lượng còn trống trên thẻ Pocket 3 (hoặc bộ nhớ iPhone).</li>
<li>Dùng 0,975 GB/phút, tính xem bạn còn quay được bao nhiêu phút 4K nữa.</li>
<li>Chọn một việc cần quay trong tuần này, dài khoảng 5 phút. Viết một câu cho MỖI clip: clip đầu, clip giữa, clip cuối sẽ cho thấy gì — viết TRƯỚC khi quay bất cứ thứ gì.</li>
</ol><p><strong>Đạt khi:</strong> nói được số phút còn quay được của thẻ, và có ba câu mô tả clip viết sẵn trên giấy hoặc ghi chú.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Bitrate (Mbps)</span><span class="v">Số megabit dữ liệu video ghi mỗi giây — con số quyết định dung lượng file.</span></div>
  <div class="kv"><span class="k">Shooting ratio</span><span class="v">Tổng thời lượng đã quay chia cho thời lượng thật sự dùng trong bản dựng cuối.</span></div>
  <div class="kv"><span class="k">Quay để dựng</span><span class="v">Chỉ bấm quay một clip khi đã biết vai trò của nó trong video cuối cùng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Pocket 3 ở bitrate tối đa (130 Mbps) ngốn ≈ 0,975 GB mỗi phút — một lèo 30 phút ≈ 29GB, mất trước khi bạn kịp biết đoạn nào dùng được.</li>
<li>Thẻ 128GB chứa ≈ 131 phút, thẻ 256GB ≈ 262 phút, ở bitrate tối đa.</li>
<li>Xem lại footage không định hướng tốn thời gian gần bằng lúc quay nó — kế hoạch "tính sau" có giá thật, và giá không nhỏ.</li>
<li>Tỉ lệ quay/dùng cao là hợp lý khi không tránh được (phim tài liệu); nó chỉ là lãng phí khi nội dung đoán trước được mà bạn đơn giản là chưa lên kế hoạch.</li>
<li>Quay dài không sao nếu CÓ mốc (livestream, phỏng vấn, bài giảng); nó chỉ là bẫy khi KHÔNG có mốc nào.</li>
</ul>

<div class="link-card"><a href="https://www.dji.com/osmo-pocket-3/specs" target="_blank" rel="noopener">DJI — Trang thông số kỹ thuật chính thức Osmo Pocket 3 (bitrate, pin, lưu trữ)</a></div>
</div>
`,
    },

    /* ─────────────────────── 4.2 ─────────────────────── */
    {
      title: '4.2 — Scene, shot, take: the vocabulary you shoot with|||4.2 — Cảnh, shot, take: từ vựng để quay',
      slug: 'cr-04-2-canh-shot-take',
      type: 'VIDEO',
      description: 'Năm từ nền tảng của nghề quay — scene, sequence, shot, take, setup — cộng A-roll/B-roll và vì sao chuỗi 5 cỡ cảnh giúp bạn dựng mượt.',
      isFreePreview: true,
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>Five words that let you actually plan a shot, instead of just "filming"</h2>
<p class="lead">"Film the coding scene" is not a plan — it is a wish. A shot list needs a vocabulary precise enough to write down, and precise enough that future-you (or an editor) reads it the same way. These five words are that vocabulary, and every one of them maps to a real decision you make with the Pocket 3 or iPhone in your hand.</p>

<h3>Scene → Sequence → Shot → Take → Setup</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Scene (cảnh)</span><span class="v">One location, one point in time. "Coding at the desk" is a scene.</span></div>
  <div class="kv"><span class="k">Sequence (trường đoạn)</span><span class="v">A chain of scenes that tells one complete beat of the story — e.g. "arriving at FPTU → sitting down → opening the laptop" as one sequence.</span></div>
  <div class="kv"><span class="k">Shot (cú máy)</span><span class="v">One continuous recording, from the moment you press record to the moment you stop. The basic unit of a shot list.</span></div>
  <div class="kv"><span class="k">Take (lần quay)</span><span class="v">One attempt AT the same shot. "Shot 7, take 3" means you have tried this exact shot three times.</span></div>
  <div class="kv"><span class="k">Setup (vị trí máy)</span><span class="v">One physical camera position that can capture several different shots without moving the tripod/gimbal.</span></div>
</div>
${slide('cr-04', 5, 'Từ vựng: Scene · Sequence · Shot · Take · Setup')}
<p>A concrete example ties them together: the scene "Vào lớp" (walking into class) might be covered by 3 shots — a wide shot of the door, a medium shot of you walking in, a close-up of you sitting down. Shot 2 (the walk-in) might take 2 takes before your bag strap stops sliding off your shoulder on camera. All three shots might be filmed from the same setup near the doorway before you move the gimbal anywhere else — that is the efficient way to shoot, and Lesson 4.4 builds your shooting order around exactly this idea.</p>

<h3>Coverage: shooting so you always have an option in the edit</h3>
<p><strong>Coverage</strong> means: for one action, you have shot it from more than one angle or distance, so that in the edit you are never stuck with only one option. Documentary and run-and-gun shooters lean on a simple pattern for this — often called the <strong>five-shot sequence</strong> — five different shot sizes of the same action:</p>
${slide('cr-04', 7, 'Coverage — một hành động, 5 cỡ cảnh')}
<ol>
<li><strong>Close-up on hands</strong> — typing, holding a cup, the physical action itself.</li>
<li><strong>Close-up on the face</strong> — the reaction, the "aha" moment.</li>
<li><strong>Wide shot</strong> — the whole desk, the whole person, the space they are in.</li>
<li><strong>Over-the-shoulder / a different side</strong> — what they are looking at, from behind them.</li>
<li><strong>An unusual angle</strong> — low, high, or off-centre; the shot that adds visual interest.</li>
</ol>
<p>The reason this works is almost entirely about editing, not about looking fancy. When two shots of the same subject are too similar in size, cutting between them produces a <strong>jump cut</strong> — a small, distracting pop where the subject seems to jump in place. Five clearly different shot sizes means every cut you make is a big enough size change that it reads as a deliberate edit, not a mistake. Coverage is what makes a scene <em>editable</em> — without it, you are locked into playing the one shot you have, in the one order you shot it.</p>

<h3>A-roll and B-roll</h3>
${slide('cr-04', 6, 'A-roll và B-roll')}
<p><strong>A-roll</strong> is your main track — usually you, talking, driving the story forward. <strong>B-roll</strong> is everything else: hands on a keyboard, a wide shot of the room, a phone screen, a street outside. Two more words describe how B-roll gets used:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Cutaway</span><span class="v">A shot away from the main action — a reaction shot, a detail in the room — inserted between two A-roll moments.</span></div>
  <div class="kv"><span class="k">Insert</span><span class="v">A close-up of a detail that IS part of the main action — the exact keys being typed, the exact line of code — cut in without leaving the scene.</span></div>
</div>
<p>Why bother? Two reasons that matter every single time you edit: B-roll covers awkward cuts (you can trim a stumble out of your A-roll audio and hide the visual jump behind two seconds of B-roll), and B-roll adds visual variety so a 5-minute talking-head video does not look like 5 minutes of the same static frame.</p>

<div class="callout tip"><p><strong>Tip:</strong> shoot a little more B-roll than you think you need, and shoot it a few seconds longer than the moment itself — an extra 2 seconds of "dead" footage at the start and end of a B-roll clip gives your future self room to trim without running out of material.</p></div>

<div class="pitfall co-tieu-de"><p><strong>Trap — shooting only A-roll.</strong> A common beginner pattern: record yourself talking for the entire video, cut nothing but your own face, and end up with jump cuts every time you trim a pause or a stumble — because there is nothing to cut TO. If you have zero B-roll, every edit decision is visible. Even 30–60 seconds of B-roll per 5 minutes of A-roll gives you enough cover for a clean edit.</p></div>

<p class="note-ct"><strong>Next:</strong> Lesson 4.3 turns this vocabulary into paperwork — the actual shot list table you carry with you on shoot day.</p>

<h3>🎬 Practice (15–20 minutes)</h3>
<div class="callout ok"><ol>
<li>Pick one simple action you can repeat on camera (making coffee, opening a laptop, writing on paper).</li>
<li>Shoot the five-shot sequence: hands close-up, face close-up, wide, over-the-shoulder/side, and one unusual angle.</li>
<li>Watch the five clips back to back. Can you already imagine an order that would cut together without a jump cut?</li>
</ol><p><strong>Done when:</strong> you have 5 distinct clips of the same action, each a visibly different shot size, saved with the action's name in the filename.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Coverage</span><span class="v">Shooting one action from enough angles/sizes to have real options in the edit.</span></div>
  <div class="kv"><span class="k">Jump cut</span><span class="v">A distracting pop between two shots of similar size/angle of the same subject.</span></div>
  <div class="kv"><span class="k">Cutaway / insert</span><span class="v">B-roll away from the action / B-roll that is part of the action, both used to cover cuts.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Scene, sequence, shot, take, setup — five precise words that turn "film the coding scene" into something you can actually plan and write down.</li>
<li>Coverage means shooting one action from several sizes/angles (the five-shot sequence is a reliable default) so the edit always has an option.</li>
<li>A-roll carries the story; B-roll covers cuts and adds variety — cutaway leaves the action, insert stays inside it.</li>
<li>Shooting only A-roll is the single most common beginner mistake — it turns every trim into a visible jump cut.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>Năm từ giúp bạn thật sự LÊN KẾ HOẠCH một cú máy, thay vì chỉ "quay đại"</h2>
<p class="lead">"Quay cảnh code" không phải một kế hoạch — đó là một điều ước. Một shot list cần từ vựng đủ chính xác để viết ra giấy, và đủ chính xác để chính bạn (hay một người dựng khác) đọc lại vẫn hiểu đúng như lúc viết. Năm từ dưới đây chính là từ vựng đó, và mỗi từ đều ứng với một quyết định thật bạn đưa ra khi cầm Pocket 3 hay iPhone.</p>

<h3>Scene → Sequence → Shot → Take → Setup</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Scene (cảnh)</span><span class="v">Một bối cảnh, một thời điểm. "Ngồi code ở bàn" là một cảnh.</span></div>
  <div class="kv"><span class="k">Sequence (trường đoạn)</span><span class="v">Một chuỗi cảnh kể trọn một nhịp của câu chuyện — vd "tới trường → ngồi vào bàn → mở laptop" là một trường đoạn.</span></div>
  <div class="kv"><span class="k">Shot (cú máy)</span><span class="v">Một lần ghi hình liên tục, từ lúc bấm quay tới lúc dừng. Đơn vị cơ bản của một shot list.</span></div>
  <div class="kv"><span class="k">Take (lần quay)</span><span class="v">Một lần THỬ của CÙNG một shot. "Shot 7, take 3" nghĩa là bạn đã thử đúng shot này ba lần.</span></div>
  <div class="kv"><span class="k">Setup (vị trí máy)</span><span class="v">Một vị trí đặt máy vật lý có thể quay được nhiều shot khác nhau mà không cần dời chân máy/gimbal.</span></div>
</div>
${slide('cr-04', 5, 'Từ vựng: Scene · Sequence · Shot · Take · Setup')}
<p>Một ví dụ cụ thể sẽ nối cả năm từ lại: cảnh "Vào lớp" có thể được quay bằng 3 shot — toàn cảnh cửa lớp, trung cảnh bạn bước vào, cận cảnh bạn ngồi xuống. Shot 2 (bước vào) có thể mất 2 take trước khi dây quai balo hết bị tuột khỏi vai trên khung hình. Cả ba shot đó có thể quay từ CÙNG một setup gần cửa lớp trước khi bạn dời gimbal đi chỗ khác — đó là cách quay hiệu quả, và Bài 4.4 sẽ dựng thứ tự quay của bạn đúng theo ý này.</p>

<h3>Coverage: quay sao cho lúc dựng luôn có lựa chọn</h3>
<p><strong>Coverage</strong> nghĩa là: với một hành động, bạn đã quay nó từ nhiều hơn một góc hoặc cỡ cảnh, để lúc dựng không bao giờ bị kẹt chỉ có đúng một lựa chọn. Dân quay tài liệu/chạy-và-quay (run-and-gun) hay dùng một khuôn mẫu đơn giản cho việc này — thường gọi là <strong>chuỗi 5 shot (five-shot sequence)</strong> — năm cỡ cảnh khác nhau cho CÙNG một hành động:</p>
${slide('cr-04', 7, 'Coverage — một hành động, 5 cỡ cảnh')}
<ol>
<li><strong>Cận cảnh tay</strong> — gõ phím, cầm cốc, chính hành động vật lý.</li>
<li><strong>Cận cảnh mặt</strong> — biểu cảm, khoảnh khắc "à ra vậy".</li>
<li><strong>Toàn cảnh</strong> — cả bàn làm việc, cả người, cả không gian.</li>
<li><strong>Qua vai / từ một phía khác</strong> — thứ họ đang nhìn, chụp từ phía sau lưng.</li>
<li><strong>Một góc lạ</strong> — thấp, cao, hoặc lệch tâm; cú máy thêm thú vị thị giác.</li>
</ol>
<p>Lý do cách này hiệu quả gần như hoàn toàn nằm ở khâu DỰNG, không phải ở chuyện trông đẹp. Khi hai shot của cùng một chủ thể có cỡ cảnh quá giống nhau, cắt giữa chúng tạo ra <strong>jump cut</strong> — một cú giật nhỏ gây khó chịu, như thể chủ thể "nhảy" tại chỗ. Năm cỡ cảnh khác biệt rõ rệt nghĩa là mọi cú cắt bạn làm đều đổi cỡ đủ lớn để trông như một quyết định dựng phim có chủ đích, không phải một lỗi. Coverage là thứ khiến một cảnh QUAY XONG DỰNG ĐƯỢC — thiếu nó, bạn bị khoá cứng vào đúng một shot, đúng một thứ tự đã quay.</p>

<h3>A-roll và B-roll</h3>
${slide('cr-04', 6, 'A-roll và B-roll')}
<p><strong>A-roll</strong> là mạch chính — thường là bạn, đang nói, dẫn dắt câu chuyện đi tới. <strong>B-roll</strong> là mọi thứ còn lại: tay gõ phím, toàn cảnh căn phòng, màn hình điện thoại, con đường bên ngoài. Hai từ nữa mô tả cách B-roll được dùng:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Cutaway</span><span class="v">Một cú máy RA KHỎI hành động chính — cảnh phản ứng, một chi tiết trong phòng — chêm vào giữa hai khoảnh khắc A-roll.</span></div>
  <div class="kv"><span class="k">Insert</span><span class="v">Cận cảnh một chi tiết VẪN nằm trong hành động chính — đúng những phím đang gõ, đúng dòng code — chêm vào mà không rời khỏi cảnh.</span></div>
</div>
<p>Vì sao phải bận tâm? Hai lý do quan trọng mỗi lần bạn dựng: B-roll che được những chỗ cắt vụng (bạn có thể cắt một đoạn vấp trong lời nói A-roll và giấu cú giật hình đằng sau 2 giây B-roll), và B-roll thêm sự đa dạng thị giác để một video 5 phút nói chuyện không trông như 5 phút của đúng một khung hình đứng yên.</p>

<div class="callout tip"><p><strong>Mẹo:</strong> quay B-roll nhiều hơn bạn nghĩ mình cần, và quay dài hơn khoảnh khắc đó vài giây — thêm 2 giây "chết" ở đầu và cuối một clip B-roll cho bạn của tương lai chỗ để cắt gọn mà không sợ thiếu tư liệu.</p></div>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — chỉ quay A-roll.</strong> Một kiểu lỗi rất quen của người mới: quay chính mình nói suốt cả video, không cắt gì ngoài mặt mình, rồi jump cut xuất hiện mỗi lần cắt một khoảng dừng hay một câu vấp — vì không có gì để CẮT SANG. Không có B-roll nào, mọi quyết định dựng đều lộ ra. Chỉ cần 30–60 giây B-roll cho mỗi 5 phút A-roll là đủ để che cho một bản dựng sạch.</p></div>

<p class="note-ct"><strong>Bài tiếp theo:</strong> Bài 4.3 biến từ vựng này thành giấy tờ — chính bảng shot list bạn mang theo trong ngày quay.</p>

<h3>🎬 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Chọn một hành động đơn giản, lặp lại được trước máy quay (pha cà phê, mở laptop, viết ra giấy).</li>
<li>Quay chuỗi 5 shot: cận tay, cận mặt, toàn cảnh, qua vai/từ một phía, và một góc lạ.</li>
<li>Xem lại 5 clip liền nhau. Bạn đã hình dung được một thứ tự ráp lại mà không bị jump cut chưa?</li>
</ol><p><strong>Đạt khi:</strong> có 5 clip riêng biệt của cùng một hành động, mỗi clip rõ ràng khác cỡ cảnh, lưu tên file kèm tên hành động.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Coverage</span><span class="v">Quay một hành động từ đủ góc/cỡ cảnh để lúc dựng có lựa chọn thật.</span></div>
  <div class="kv"><span class="k">Jump cut</span><span class="v">Cú giật khó chịu giữa hai shot cùng cỡ/góc của cùng một chủ thể.</span></div>
  <div class="kv"><span class="k">Cutaway / insert</span><span class="v">B-roll ra khỏi hành động / B-roll vẫn nằm trong hành động, cả hai đều dùng để che chỗ cắt.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Scene, sequence, shot, take, setup — năm từ chính xác biến "quay cảnh code" thành thứ bạn thật sự lên kế hoạch và viết ra được.</li>
<li>Coverage nghĩa là quay một hành động từ nhiều cỡ/góc (chuỗi 5 shot là mặc định đáng tin) để bản dựng luôn có lựa chọn.</li>
<li>A-roll dẫn chuyện; B-roll che chỗ cắt và thêm đa dạng — cutaway rời khỏi hành động, insert vẫn ở trong đó.</li>
<li>Chỉ quay A-roll là lỗi phổ biến nhất của người mới — nó biến mọi lần cắt gọn thành một jump cut lộ liễu.</li>
</ul>
</div>
`,
    },

    /* ─────────────────────── 4.3 ─────────────────────── */
    {
      title: '4.3 — Writing a shot list|||4.3 — Viết một shot list',
      slug: 'cr-04-3-shot-list',
      type: 'VIDEO',
      description: 'Các cột của một shot list, cách đi từ kịch bản 2 cột ra bảng shot, và hai ví dụ đầy đủ: vlog 90 giây và video ngắn 60 giây.',
      isFreePreview: true,
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.3</span>
<h2>A shot list is just your script, translated into things a camera can do</h2>
<p class="lead">You already know how to write a two-column script (Lesson 3.3): a Video column and an Audio column. A shot list is the next translation step — turning each beat of that script into a row you can literally check off during the shoot. This lesson gives you the columns, the process, and two complete examples you can copy.</p>

<h3>The columns of a shot list</h3>
${slide('cr-04', 8, 'Các cột của một shot list')}
<p>Not every column is needed every time, but these eight cover almost everything you will shoot in this course: a running number, which scene it belongs to, the shot size (ECU/CU/MCU/MS/MWS/WS from Lesson 4.2's vocabulary), a one-line description of the action, which camera and rough position, what audio is happening, an estimated duration in seconds, and a status you check off on the day.</p>

<h3>From script to shot list</h3>
${slide('cr-04', 10, 'Từ kịch bản ra shot list')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Two-column script</span><span class="lz-d">Video column / Audio column, from Lesson 3.3</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Beat</span><span class="lz-d">Split the script into small ideas — one sentence, one moment each</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Shot</span><span class="lz-d">Decide 1 or more shots for each beat (coverage from 4.2)</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Shot list</span><span class="lz-d">Every shot becomes one row in the table above</span></div>
</div>
<p>In practice: read your script beat by beat. For each beat, ask "what does the viewer SEE while this is said or happens" — that answer is your shot. A single beat like "I opened my laptop and started debugging" might become two shots (an insert of the laptop opening, a medium shot of you starting to type) rather than one, because that gives you coverage to cut with later.</p>

<h3>Full example 1 — 90-second vlog: "A day of coding at FPTU"</h3>
${slide('cr-04', 9, 'Shot list thật — Vlog "Một ngày code ở FPTU"')}
<p>Twenty shots, mixing Pocket 3 (wide/B-roll/gimbal moves) and iPhone (handheld inserts, screen recording) — realistic for a short 90-second vlog built almost entirely from short, planned clips instead of one long recording.</p>
<table>
<tr><th>#</th><th>Scene</th><th>Size</th><th>Description</th><th>Camera</th><th>Sec</th></tr>
<tr><td>1</td><td>Opening</td><td>WS</td><td>Wide shot of the FPTU gate, early morning light</td><td>Pocket 3</td><td>4</td></tr>
<tr><td>2</td><td>Walking in</td><td>MS</td><td>Walking from the gate to the building</td><td>Pocket 3 (handheld, ActiveTrack)</td><td>5</td></tr>
<tr><td>3</td><td>Signage</td><td>CU</td><td>Close-up of the faculty/room sign</td><td>iPhone</td><td>2</td></tr>
<tr><td>4</td><td>Getting to class</td><td>MS</td><td>Sitting down, putting the backpack down</td><td>iPhone</td><td>4</td></tr>
<tr><td>5</td><td>Opening the laptop</td><td>CU (insert)</td><td>Hand opens the lid, screen lights up</td><td>iPhone</td><td>3</td></tr>
<tr><td>6</td><td>Opening VO</td><td>MCU</td><td>"So how does a day of coding actually start?" — looking at camera</td><td>Pocket 3</td><td>6</td></tr>
<tr><td>7</td><td>The room</td><td>WS</td><td>Wide shot of the room/library, a few other students</td><td>Pocket 3</td><td>4</td></tr>
<tr><td>8</td><td>Typing</td><td>CU (insert)</td><td>Close-up on hands typing, face not in frame</td><td>Pocket 3</td><td>5</td></tr>
<tr><td>9</td><td>Coding</td><td>MCU</td><td>Hands typing with the code editor visible</td><td>Pocket 3</td><td>5</td></tr>
<tr><td>10</td><td>Screen check</td><td>OTS</td><td>Looking at the code from behind the shoulder</td><td>iPhone</td><td>4</td></tr>
<tr><td>11</td><td>Stuck</td><td>CU</td><td>Close-up on the face, frowning, scratching head</td><td>iPhone</td><td>3</td></tr>
<tr><td>12</td><td>Cutaway</td><td>CU</td><td>Clock on the wall / an empty coffee cup</td><td>iPhone</td><td>2</td></tr>
<tr><td>13</td><td>Asking a friend</td><td>MS</td><td>Turning to ask the classmate next to you</td><td>Pocket 3</td><td>5</td></tr>
<tr><td>14</td><td>Cutaway</td><td>CU</td><td>Friend's reaction, pointing at the screen</td><td>Pocket 3</td><td>3</td></tr>
<tr><td>15</td><td>Trying again</td><td>CU</td><td>Hand types, hits enter, waits</td><td>iPhone</td><td>4</td></tr>
<tr><td>16</td><td>It works</td><td>ECU</td><td>Extreme close-up on the eyes lighting up</td><td>Pocket 3</td><td>2</td></tr>
<tr><td>17</td><td>Reaction</td><td>MCU</td><td>Smiling, a small clap</td><td>iPhone</td><td>3</td></tr>
<tr><td>18</td><td>Break</td><td>WS</td><td>Standing up, walking to get water</td><td>Pocket 3</td><td>4</td></tr>
<tr><td>19</td><td>Closing VO</td><td>MS</td><td>Sitting back down, delivering the closing line</td><td>Pocket 3</td><td>6</td></tr>
<tr><td>20</td><td>Ending</td><td>MWS</td><td>Standing up, looking out the window, smiling</td><td>Pocket 3</td><td>4</td></tr>
</table>
<p>Add the durations up: about 78 seconds of planned footage — with pauses and the voice-over it becomes a vlog of roughly 90 seconds. A 5-minute vlog built the same way needs roughly 70–80 shots (300 seconds ÷ about 4 seconds per shot). Either way it is a fraction of a 30-minute undirected take, and every clip already knows its job.</p>

<h3>Full example 2 — 60-second short: "3 mistakes new Git users make" (vertical 9:16)</h3>
<p>Eight shots for a vertical short (Chapter 20 covers shooting and posting shorts in depth) — notice how much tighter the pacing is: almost every shot is under 8 seconds, because short-form video has no time to spare.</p>
<table>
<tr><th>#</th><th>Beat</th><th>Size</th><th>Description</th><th>Camera</th><th>Sec</th></tr>
<tr><td>1</td><td>Hook (0–3s)</td><td>MCU</td><td>Straight to camera: "3 Git mistakes that cost you a whole coding session"</td><td>Pocket 3, vertical</td><td>3</td></tr>
<tr><td>2</td><td>Insert</td><td>CU</td><td>Terminal screen full of red error text</td><td>iPhone (screen record)</td><td>3</td></tr>
<tr><td>3</td><td>Mistake 1</td><td>MCU</td><td>"Committing straight to main" — explain</td><td>Pocket 3</td><td>8</td></tr>
<tr><td>4</td><td>Insert</td><td>CU</td><td>Demo: typing &#96;git checkout -b&#96;</td><td>iPhone (screen record)</td><td>5</td></tr>
<tr><td>5</td><td>Mistake 2</td><td>MCU</td><td>"Forgetting .gitignore" — explain</td><td>Pocket 3</td><td>8</td></tr>
<tr><td>6</td><td>Insert</td><td>CU</td><td>Demo: node_modules accidentally committed</td><td>iPhone (screen record)</td><td>5</td></tr>
<tr><td>7</td><td>Mistake 3</td><td>MCU</td><td>"A commit message that just says 'fix'" — explain</td><td>Pocket 3</td><td>8</td></tr>
<tr><td>8</td><td>CTA close</td><td>MCU</td><td>"Follow for part 2" — direct to camera</td><td>Pocket 3</td><td>5</td></tr>
</table>
<p>That totals ≈ 45 seconds of planned content, leaving room for cuts and breathing space inside a 60-second cap — plan a little under your limit, never right up against it.</p>

<h3>A template you can actually copy, and where to save it</h3>
<p>Copy the column headers from either table above into Google Sheets, Apple Numbers, or a Notion table — one row per shot, and you have a working shot list in under two minutes. For anything you are planning through this course's own tools, <strong>/creator/projects</strong> already has a Script tab with 9 ready-made templates (including "Vlog storytelling" and "Short video — one idea") where you save script versions — keep your shot list in the same project so the script and the shot list that was built from it stay together.</p>

<div class="callout tip"><p><strong>Tip:</strong> number your shots once and never renumber them, even if you shoot out of order (Lesson 4.4 will tell you to). If shot 9 gets cut on the day, leave a gap rather than renumbering 10 through 20 — renumbering mid-shoot is how filenames and shot numbers quietly stop matching.</p></div>

<div class="pitfall co-tieu-de"><p><strong>Trap — a shot list with no estimated duration.</strong> Without a seconds column, it is very easy to "plan" 20 shots that actually add up to 4 minutes of raw footage for a video that needs to be 60 seconds. Add up your Sec column before you shoot — if the total is wildly more than your target runtime, you are either planning too many shots or expecting to cut brutally hard later. Better to know that now than on the shoot day.</p></div>

<p class="note-ct"><strong>Next:</strong> Lesson 4.4 turns this shot list into an actual shooting day — what order to shoot in, when you need a storyboard on top of the list, and the discipline that keeps every take usable.</p>

<h3>🎬 Practice (20–30 minutes)</h3>
<div class="callout ok"><ol>
<li>Pick a 60–90 second video you actually want to make this week.</li>
<li>Write a two-column script for it (Video / Audio), then break it into beats.</li>
<li>Turn the beats into a shot list of 6–10 rows, with number, size, description, camera, and estimated seconds — in Sheets, Numbers, Notion, or plain paper.</li>
</ol><p><strong>Done when:</strong> your shot list's Sec column adds up to no more than your target runtime, and every row has a shot size filled in.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Beat</span><span class="v">One small idea or moment inside a script — the unit you translate into shots.</span></div>
  <div class="kv"><span class="k">Shot list</span><span class="v">A table of every shot you plan to record, with size, description, camera and duration.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A shot list has (at minimum) a number, scene, size, description, camera, audio note, duration, and status.</li>
<li>Build it by breaking your two-column script into beats, then deciding one or more shots per beat.</li>
<li>A 90-second vlog runs on roughly 20 short, planned shots (a 5-minute one on 70–80); a 60-second short with longer talking shots runs on roughly 8.</li>
<li>Save your shot list next to the script it came from — /creator/projects already gives you a place to do that.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.3</span>
<h2>Shot list chỉ là kịch bản của bạn, dịch sang thứ máy quay làm được</h2>
<p class="lead">Bạn đã biết viết kịch bản 2 cột (Bài 3.3): cột Hình và cột Lời. Shot list là bước dịch tiếp theo — biến mỗi nhịp của kịch bản đó thành một dòng bạn có thể tích vào đúng nghĩa đen trong lúc quay. Bài này cho bạn các cột, quy trình, và hai ví dụ đầy đủ chép được ngay.</p>

<h3>Các cột của một shot list</h3>
${slide('cr-04', 8, 'Các cột của một shot list')}
<p>Không phải lúc nào cũng cần đủ mọi cột, nhưng tám cột này gần như phủ hết mọi thứ bạn sẽ quay trong khoá này: số thứ tự, thuộc cảnh nào, cỡ cảnh (ECU/CU/MCU/MS/MWS/WS — từ vựng ở Bài 4.2), một câu mô tả hành động, máy và vị trí đặt máy, âm thanh đang diễn ra, thời lượng ước tính theo giây, và một trạng thái để tích vào ngày quay.</p>

<h3>Từ kịch bản ra shot list</h3>
${slide('cr-04', 10, 'Từ kịch bản ra shot list')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Kịch bản 2 cột</span><span class="lz-d">Cột Hình / cột Lời, từ Bài 3.3</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Nhịp (beat)</span><span class="lz-d">Chia kịch bản thành từng ý nhỏ — mỗi câu, mỗi khoảnh khắc</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Shot</span><span class="lz-d">Quyết định 1 hoặc nhiều shot cho mỗi nhịp (coverage từ bài 4.2)</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Shot list</span><span class="lz-d">Mỗi shot thành một dòng trong bảng ở trên</span></div>
</div>
<p>Làm thật: đọc kịch bản theo từng nhịp. Với mỗi nhịp, tự hỏi "người xem THẤY gì trong lúc câu này được nói/xảy ra" — câu trả lời chính là shot của bạn. Một nhịp như "mình mở laptop ra và bắt đầu tìm lỗi" có thể thành HAI shot (một insert cảnh mở laptop, một trung cảnh bạn bắt đầu gõ) thay vì một, vì vậy bạn có coverage để cắt sau này.</p>

<h3>Ví dụ đầy đủ 1 — Vlog 90 giây: "Một ngày code ở FPTU"</h3>
${slide('cr-04', 9, 'Shot list thật — Vlog "Một ngày code ở FPTU"')}
<p>Hai mươi shot, trộn Pocket 3 (toàn cảnh/B-roll/di chuyển gimbal) và iPhone (cầm tay quay cận, quay màn hình) — thực tế cho một vlog ngắn 90 giây dựng gần như hoàn toàn từ những clip ngắn có kế hoạch, thay vì một lèo dài.</p>
<table>
<tr><th>#</th><th>Cảnh</th><th>Cỡ</th><th>Mô tả</th><th>Máy</th><th>Giây</th></tr>
<tr><td>1</td><td>Mở đầu</td><td>WS</td><td>Toàn cảnh cổng trường FPTU, nắng sớm</td><td>Pocket 3</td><td>4</td></tr>
<tr><td>2</td><td>Di chuyển</td><td>MS</td><td>Đi bộ từ cổng vào toà nhà</td><td>Pocket 3 (cầm tay, ActiveTrack)</td><td>5</td></tr>
<tr><td>3</td><td>Bảng tên</td><td>CU</td><td>Cận cảnh bảng tên khoa/phòng học</td><td>iPhone</td><td>2</td></tr>
<tr><td>4</td><td>Lên lớp</td><td>MS</td><td>Ngồi vào bàn, đặt balo xuống</td><td>iPhone</td><td>4</td></tr>
<tr><td>5</td><td>Mở laptop</td><td>CU (insert)</td><td>Tay mở nắp laptop, màn hình sáng lên</td><td>iPhone</td><td>3</td></tr>
<tr><td>6</td><td>VO mở đầu</td><td>MCU</td><td>"Một ngày code bắt đầu như thế nào nhỉ?" — nhìn máy</td><td>Pocket 3</td><td>6</td></tr>
<tr><td>7</td><td>Toàn cảnh phòng</td><td>WS</td><td>Cả phòng học/thư viện, vài bạn khác</td><td>Pocket 3</td><td>4</td></tr>
<tr><td>8</td><td>Gõ phím</td><td>CU (insert)</td><td>Cận tay gõ phím, không thấy mặt</td><td>Pocket 3</td><td>5</td></tr>
<tr><td>9</td><td>Code</td><td>MCU</td><td>Tay gõ phím kèm màn hình code trong khung</td><td>Pocket 3</td><td>5</td></tr>
<tr><td>10</td><td>Kiểm màn hình</td><td>OTS</td><td>Nhìn màn hình code từ sau lưng</td><td>iPhone</td><td>4</td></tr>
<tr><td>11</td><td>Bí ý tưởng</td><td>CU</td><td>Cận mặt cau mày, gãi đầu</td><td>iPhone</td><td>3</td></tr>
<tr><td>12</td><td>Cutaway</td><td>CU</td><td>Đồng hồ trên tường / cốc cà phê cạn</td><td>iPhone</td><td>2</td></tr>
<tr><td>13</td><td>Hỏi bạn</td><td>MS</td><td>Quay sang hỏi bạn ngồi cạnh</td><td>Pocket 3</td><td>5</td></tr>
<tr><td>14</td><td>Cutaway</td><td>CU</td><td>Phản ứng của bạn, chỉ tay vào màn hình</td><td>Pocket 3</td><td>3</td></tr>
<tr><td>15</td><td>Thử lại</td><td>CU</td><td>Tay gõ, bấm Enter, chờ kết quả</td><td>iPhone</td><td>4</td></tr>
<tr><td>16</td><td>Chạy đúng</td><td>ECU</td><td>Đặc tả đôi mắt sáng lên lúc hết lỗi</td><td>Pocket 3</td><td>2</td></tr>
<tr><td>17</td><td>Phản ứng</td><td>MCU</td><td>Cười, vỗ tay nhẹ</td><td>iPhone</td><td>3</td></tr>
<tr><td>18</td><td>Giải lao</td><td>WS</td><td>Đứng dậy, đi lấy nước</td><td>Pocket 3</td><td>4</td></tr>
<tr><td>19</td><td>VO kết</td><td>MS</td><td>Ngồi lại, nói câu kết</td><td>Pocket 3</td><td>6</td></tr>
<tr><td>20</td><td>Kết</td><td>MWS</td><td>Đứng dậy, nhìn ra cửa sổ, cười</td><td>Pocket 3</td><td>4</td></tr>
</table>
<p>Cộng hết thời lượng lại: khoảng 78 giây hình đã lên kế hoạch — thêm nhịp nghỉ và lời dẫn thì thành một vlog chừng 90 giây. Một vlog 5 phút làm theo đúng cách này cần khoảng 70–80 shot (300 giây ÷ khoảng 4 giây mỗi shot). Dù dài hay ngắn, nó vẫn chỉ là một phần nhỏ so với một lèo 30 phút không định hướng, và clip nào cũng đã biết việc của mình.</p>

<h3>Ví dụ đầy đủ 2 — Video ngắn 60 giây: "3 lỗi khi mới học Git" (dọc 9:16)</h3>
<p>Tám shot cho một video ngắn dọc (Chương 20 nói kỹ việc quay và đăng video ngắn) — để ý nhịp độ dồn hơn hẳn: gần như mọi shot đều dưới 8 giây, vì video ngắn không có thời gian để lãng phí.</p>
<table>
<tr><th>#</th><th>Nhịp</th><th>Cỡ</th><th>Mô tả</th><th>Máy</th><th>Giây</th></tr>
<tr><td>1</td><td>Hook (0–3s)</td><td>MCU</td><td>Nhìn thẳng máy: "3 lỗi Git khiến bạn mất cả buổi code"</td><td>Pocket 3, dọc</td><td>3</td></tr>
<tr><td>2</td><td>Insert</td><td>CU</td><td>Màn hình terminal đỏ lỗi</td><td>iPhone (quay màn hình)</td><td>3</td></tr>
<tr><td>3</td><td>Lỗi 1</td><td>MCU</td><td>"Commit thẳng lên main" — giải thích</td><td>Pocket 3</td><td>8</td></tr>
<tr><td>4</td><td>Insert</td><td>CU</td><td>Demo gõ lệnh &#96;git checkout -b&#96;</td><td>iPhone (quay màn hình)</td><td>5</td></tr>
<tr><td>5</td><td>Lỗi 2</td><td>MCU</td><td>"Quên .gitignore" — giải thích</td><td>Pocket 3</td><td>8</td></tr>
<tr><td>6</td><td>Insert</td><td>CU</td><td>Demo node_modules bị commit nhầm</td><td>iPhone (quay màn hình)</td><td>5</td></tr>
<tr><td>7</td><td>Lỗi 3</td><td>MCU</td><td>"Message commit chỉ ghi 'fix'" — giải thích</td><td>Pocket 3</td><td>8</td></tr>
<tr><td>8</td><td>CTA kết</td><td>MCU</td><td>"Theo dõi để xem phần 2" — nhìn thẳng máy</td><td>Pocket 3</td><td>5</td></tr>
</table>
<p>Cộng lại ≈ 45 giây nội dung đã lên kế hoạch, còn dư chỗ cho các cú cắt và khoảng thở bên trong trần 60 giây — luôn lên kế hoạch NGẮN HƠN giới hạn một chút, đừng sát nút.</p>

<h3>Một mẫu chép được thật, và nơi lưu kế hoạch</h3>
<p>Chép tiêu đề cột từ một trong hai bảng trên vào Google Sheets, Apple Numbers, hoặc một bảng Notion — mỗi dòng một shot, và bạn có ngay một shot list dùng được trong chưa đầy hai phút. Với mọi thứ lên kế hoạch qua công cụ riêng của khoá học, <strong>/creator/projects</strong> đã có sẵn tab Kịch bản với 9 mẫu dựng sẵn (gồm cả "Vlog kể chuyện" và "Video ngắn — một ý duy nhất") để lưu phiên bản kịch bản — giữ shot list trong cùng dự án với kịch bản đã sinh ra nó để hai thứ không bị tách rời nhau.</p>

<div class="callout tip"><p><strong>Mẹo:</strong> đánh số shot một lần và đừng đánh lại số, kể cả khi bạn quay không theo đúng thứ tự (Bài 4.4 sẽ bảo bạn nên làm vậy). Nếu shot 9 bị huỷ trong ngày quay, để trống số đó thay vì đánh lại số 10 tới 20 — đánh lại số giữa chừng là cách tên file và số shot âm thầm lệch nhau.</p></div>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — shot list không có cột thời lượng ước tính.</strong> Thiếu cột giây, rất dễ "lên kế hoạch" 20 shot mà cộng lại thành 4 phút footage gốc cho một video cần dài 60 giây. Cộng cột Giây lại trước khi quay — nếu tổng vượt xa thời lượng mục tiêu, hoặc bạn đang lên kế hoạch quá nhiều shot, hoặc đang kỳ vọng cắt cực gắt về sau. Biết điều đó TRƯỚC còn hơn biết vào đúng ngày quay.</p></div>

<p class="note-ct"><strong>Bài tiếp theo:</strong> Bài 4.4 biến shot list này thành một ngày quay thật — quay theo thứ tự nào, khi nào cần thêm storyboard, và kỷ luật giữ cho mọi take đều dùng được.</p>

<h3>🎬 Thực hành (20–30 phút)</h3>
<div class="callout ok"><ol>
<li>Chọn một video dài 60–90 giây bạn thật sự muốn làm trong tuần này.</li>
<li>Viết kịch bản 2 cột (Hình / Lời) cho nó, rồi chia thành từng nhịp.</li>
<li>Biến các nhịp thành shot list 6–10 dòng, có số, cỡ cảnh, mô tả, máy, và giây ước tính — trong Sheets, Numbers, Notion, hay cả giấy thường.</li>
</ol><p><strong>Đạt khi:</strong> cột Giây trong shot list cộng lại không vượt quá thời lượng mục tiêu, và dòng nào cũng điền cỡ cảnh.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Nhịp (beat)</span><span class="v">Một ý hoặc khoảnh khắc nhỏ trong kịch bản — đơn vị bạn dịch thành shot.</span></div>
  <div class="kv"><span class="k">Shot list</span><span class="v">Bảng liệt kê mọi shot dự định quay, kèm cỡ cảnh, mô tả, máy và thời lượng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một shot list có (tối thiểu) số thứ tự, cảnh, cỡ cảnh, mô tả, máy, ghi chú âm thanh, thời lượng, trạng thái.</li>
<li>Dựng nó bằng cách chia kịch bản 2 cột thành từng nhịp, rồi quyết định một hoặc nhiều shot cho mỗi nhịp.</li>
<li>Một vlog 90 giây chạy trên khoảng 20 shot ngắn có kế hoạch (vlog 5 phút cần 70–80 shot); một video ngắn 60 giây với các đoạn nói dài hơn chạy trên khoảng 8 shot.</li>
<li>Lưu shot list cạnh đúng kịch bản đã sinh ra nó — /creator/projects đã có sẵn chỗ để làm vậy.</li>
</ul>
</div>
`,
    },

    /* ─────────────────────── 4.4 ─────────────────────── */
    {
      title: '4.4 — Storyboard and shoot-day discipline|||4.4 — Storyboard và kỷ luật ngày quay',
      slug: 'cr-04-4-storyboard-ngay-quay',
      type: 'VIDEO',
      description: 'Khi nào cần vẽ storyboard trên iPad, thứ tự quay theo bối cảnh, kỷ luật một take, slate/vỗ tay, và một kế hoạch buổi quay mẫu theo giờ.',
      isFreePreview: true,
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.4</span>
<h2>The shot list tells you WHAT to shoot. This lesson is HOW you actually run the day.</h2>
<p class="lead">You have the vocabulary and the shot list. This last lesson covers everything between "I have a plan on paper" and "I have usable footage on the card": when to add a storyboard, what order to shoot in, the take discipline that keeps every clip editable, and how to close out the day without losing anything.</p>

<h3>Storyboard: when a drawing earns its place, and when the shot list is already enough</h3>
<p>A <strong>storyboard</strong> is a stick-figure sketch of each shot — composition, camera angle, roughly where people stand. On the iPad Pro, Procreate, Freeform, or GoodNotes with the Apple Pencil are all good enough; you are drawing stick figures and boxes, not art.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Draw a storyboard when</span><span class="v">Camera movement is complex (a push that ends on a specific detail), several people need specific blocking, or you need to communicate the shot to someone else before shoot day.</span></div>
  <div class="kv"><span class="k">Skip it — the shot list is enough — when</span><span class="v">You are shooting alone, the action is simple (talking head, typing, walking), and the shot list's one-line description already tells you everything you need to remember.</span></div>
</div>
<p>For almost everything in this course — solo vlogs, tutorials, shorts — your shot list from Lesson 4.3 is enough on its own. Reach for a storyboard when a shot is too complex to hold in your head from a one-line description alone.</p>

<h3>Order your shooting by location and light, not by script order</h3>
${slide('cr-04', 11, 'Quay theo bối cảnh, không theo kịch bản')}
<p>Your script might jump: scene 1 indoors, scene 2 outdoors, scene 3 back indoors. Shooting in THAT order means setting up indoor lighting, tearing it down to go outside, then setting it back up again — twice the work for no reason. Instead, group every shot by <strong>setup</strong> (Lesson 4.2): shoot every indoor shot first (1, 3, 5), regardless of where they land in the final video, then move outside and shoot 2 and 4. You will reorder the clips into script order later, in the edit — that costs nothing. Re-lighting a room twice costs real time.</p>

<h3>One-take discipline</h3>
${slide('cr-04', 12, 'Kỷ luật MỘT take')}
<p>Every take follows the same five-part rhythm: <strong>press record → 2 seconds of silence, holding still → the actual action or line → 2 more seconds holding still → stop.</strong> The padding on both ends is not wasted time — it gives you a clean handle to fade in/out or cut cleanly, and it survives the small shake that happens right when you press the button.</p>
<p>When a take goes wrong mid-way, say <strong>"cut, again"</strong> out loud and record a brand-new take from the top — do not try to keep talking and "fix it" inside the same recording. A take that is half good and half re-explained is genuinely harder to use than two clean, separate takes, because the good half now has your mistake's audio bleeding right next to it.</p>

<h3>Slate and clap — because neither of your cameras marks a good take for you</h3>
<p>Higher-end action cameras like the DJI Osmo Action series let you press a button mid-recording to tag a "Highlight" moment (DJI's own support documentation describes this as the Quick Switch Button on Osmo Action 6/5 Pro/4). <strong>The Osmo Pocket 3's own beginner's guide describes exactly two physical controls — the Shutter/Record button and the 5D joystick — with no mention of any in-recording marking feature</strong>, and the iPhone Camera app has no equivalent either (Apple's own guide covers snapping a still mid-recording and pinching to zoom, nothing about tagging a moment). So you mark takes the way film sets have for a century:</p>
<ul>
<li><strong>Verbal slate</strong> — say "Scene 3, shot 2, take 1" out loud right before you start the actual take. It costs one second and it is unmistakable when you scrub through footage later.</li>
<li><strong>One clap</strong> — a single sharp clap near the microphone, useful whenever you are recording with two devices at once (say, Pocket 3 for video and a phone for a wide safety angle): the clap gives you one sharp spike in both audio waveforms, which is exactly what you line up on in the edit to sync them.</li>
</ul>
<p>After a take you are happy with, say it out loud too — "got it" or "good one" — right into the mic. You will not remember which of four takes was the best one three hours later, but your own recorded voice will.</p>

<h3>Review on the spot, dump the card the same day</h3>
<p>Before you move the camera to the next setup, play the last take back on the Pocket 3's screen (or your phone). Checking focus and framing costs 10 seconds; discovering a shot was out of focus after you have already left the location costs an entire re-shoot. At the end of the shooting day, copy the card to your computer the same day — Chapter 11 covers the full 3-2-1 backup routine, but the short version for now: never let "I'll copy it tomorrow" become the reason a card gets reformatted with today's footage still on it.</p>

<h3>A sample shooting morning, by the clock</h3>
<table>
<tr><th>Time</th><th>What</th></tr>
<tr><td>08:00–08:15</td><td>Prep: charge check, card space check (Lesson 4.1's math), shot list printed/open</td></tr>
<tr><td>08:15–08:45</td><td>All indoor shots, one setup at a time (grouped by location, not script order)</td></tr>
<tr><td>08:45–09:00</td><td>Move outside, review the last few indoor takes on the way</td></tr>
<tr><td>09:00–09:30</td><td>All outdoor shots</td></tr>
<tr><td>09:30–09:45</td><td>Final on-site review + copy the card / back up footage</td></tr>
</table>
${slide('cr-04', 13, 'Checklist ngày quay')}

<div class="callout tip"><p><strong>Tip:</strong> keep a running note (Notes app, or a line in your shot list's Status column) of which take number was the good one per shot — "shot 9: take 2 ✅" — while it is fresh. This alone saves more editing time than almost anything else in this lesson.</p></div>

<div class="pitfall co-tieu-de"><p><strong>Trap — talking through a ruined take instead of restarting it.</strong> Fumbling a line and continuing ("...wait, let me say that again, so anyway...") feels efficient in the moment. It is not: you now have to find and trim the fumble out of a longer clip instead of just discarding one short bad take and using the next clean one. Cut. Reset. Say the slate again. Go.</p></div>

<p class="note-ct"><strong>Next chapter:</strong> Chapter 5 goes inside the camera itself — resolution, frame rate, exposure, and why Vietnam's 50Hz power grid changes which frame rates you should actually use.</p>

<h3>🎬 Practice (20–30 minutes)</h3>
<div class="callout ok"><ol>
<li>Take the 5–10 row shot list you wrote in Lesson 4.3's practice.</li>
<li>Group the shots by location/setup and write a shooting order next to each row (not the shot-list number — the ORDER you'll actually film them in).</li>
<li>Shoot at least 3 of the shots for real, using full one-take discipline: verbal slate, 2s pad, action, 2s pad, stop. Say "got it" out loud after the one you're keeping.</li>
</ol><p><strong>Done when:</strong> you have 3 clips, each starting with a spoken slate, each with visible padding at both ends, and you can say — without re-watching — which take was the good one.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Storyboard</span><span class="v">A stick-figure sketch of a shot's composition and camera angle, used for complex or crew shots.</span></div>
  <div class="kv"><span class="k">Slate</span><span class="v">Saying the scene/shot/take number out loud before recording, so it is identifiable later.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Storyboard when a shot is too complex for a one-line description; otherwise the shot list alone is enough.</li>
<li>Shoot in the order of location/light, not script order — reorder in the edit, not on location.</li>
<li>Every take: press record → 2s pad → action → 2s pad → stop. A ruined take gets restarted, never talked through.</li>
<li>Neither the Pocket 3 nor the iPhone Camera app can tag a good take while recording (confirmed against DJI's own docs) — a verbal slate and a spoken "got it" are your real substitute.</li>
<li>Review footage on the spot, and copy the card to your computer the same day.</li>
</ul>

<div class="link-card"><a href="https://support.dji.com/help/content?customId=en-us03400009024&spaceId=34&re=US&lang=en&documentType=artical&paperDocType=paper" target="_blank" rel="noopener">DJI — Osmo Pocket 3 beginner's guide (physical controls)</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.4</span>
<h2>Shot list nói bạn quay CÁI GÌ. Bài này nói bạn chạy cả ngày quay NHƯ THẾ NÀO.</h2>
<p class="lead">Bạn đã có từ vựng và shot list. Bài cuối chương này lấp khoảng giữa "có kế hoạch trên giấy" và "có footage dùng được trên thẻ": khi nào cần thêm storyboard, quay theo thứ tự nào, kỷ luật take giữ cho mọi clip dựng được, và cách kết thúc ngày quay mà không mất gì.</p>

<h3>Storyboard: khi nào một bản vẽ đáng công, khi nào shot list là đủ</h3>
<p><strong>Storyboard</strong> là bản vẽ người que cho từng shot — bố cục, góc máy, vị trí người đứng đại khái ở đâu. Trên iPad Pro, Procreate, Freeform, hay GoodNotes cùng Apple Pencil đều đủ tốt — bạn đang vẽ người que và hình hộp, không phải vẽ tranh nghệ thuật.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Vẽ storyboard khi</span><span class="v">Chuyển động máy phức tạp (một cú đẩy máy kết thúc đúng vào một chi tiết), nhiều người cần vị trí đứng cụ thể, hoặc cần truyền đạt hình dung shot cho người khác trước ngày quay.</span></div>
  <div class="kv"><span class="k">Bỏ qua — shot list là đủ — khi</span><span class="v">Bạn quay một mình, hành động đơn giản (nói chuyện, gõ phím, đi bộ), và câu mô tả một dòng trong shot list đã đủ để bạn nhớ hết.</span></div>
</div>
<p>Với gần như mọi thứ trong khoá này — vlog một mình, video hướng dẫn, video ngắn — shot list ở Bài 4.3 là đủ, tự nó đã hoàn chỉnh. Chỉ lấy storyboard ra khi một shot quá phức tạp để giữ trong đầu chỉ bằng một câu mô tả.</p>

<h3>Sắp thứ tự quay theo bối cảnh và ánh sáng, không theo thứ tự kịch bản</h3>
${slide('cr-04', 11, 'Quay theo bối cảnh, không theo kịch bản')}
<p>Kịch bản của bạn có thể nhảy: cảnh 1 trong nhà, cảnh 2 ngoài trời, cảnh 3 lại trong nhà. Quay ĐÚNG thứ tự đó nghĩa là dựng ánh sáng trong nhà, dỡ ra để đi ra ngoài, rồi dựng lại lần nữa — gấp đôi công sức mà không vì lý do gì cả. Thay vào đó, gom mọi shot theo <strong>setup</strong> (Bài 4.2): quay hết mọi shot trong nhà trước (1, 3, 5), bất kể chúng nằm ở đâu trong video cuối, rồi mới ra ngoài quay 2 và 4. Bạn sẽ sắp lại clip đúng thứ tự kịch bản sau, lúc dựng — việc đó không tốn gì cả. Dựng lại ánh sáng một căn phòng hai lần mới tốn thời gian thật.</p>

<h3>Kỷ luật MỘT take</h3>
${slide('cr-04', 12, 'Kỷ luật MỘT take')}
<p>Mọi take đều theo đúng một nhịp năm phần: <strong>bấm quay → 2 giây im lặng, đứng yên → hành động hoặc lời thoại thật → thêm 2 giây đứng yên → dừng.</strong> Phần đệm ở hai đầu không phải thời gian lãng phí — nó cho bạn một khoảng để fade in/out gọn gàng, và nó "hứng" luôn cú rung nhỏ xảy ra đúng lúc bạn bấm nút.</p>
<p>Khi một take hỏng giữa chừng, hãy nói to <strong>"cắt, làm lại"</strong> và quay một take HOÀN TOÀN MỚI từ đầu — đừng cố nói tiếp rồi "sửa" ngay trong cùng một lần ghi. Một take nửa tốt nửa giải thích lại thật ra khó dùng hơn hai take sạch, riêng biệt — vì nửa tốt đó giờ có âm thanh lỗi của bạn dính ngay sát bên.</p>

<h3>Slate và vỗ tay — vì không máy nào của bạn tự đánh dấu take tốt giúp bạn</h3>
<p>Dòng máy hành trình cao cấp hơn như DJI Osmo Action cho phép bấm một nút ngay giữa lúc quay để đánh dấu khoảnh khắc "Highlight" (tài liệu hỗ trợ chính thức của DJI mô tả đây là nút Quick Switch trên Osmo Action 6/5 Pro/4). <strong>Hướng dẫn cho người mới chính thức của Osmo Pocket 3 chỉ mô tả đúng hai nút vật lý — nút Shutter/Record và joystick 5D — không nhắc tới bất kỳ tính năng đánh dấu nào trong lúc quay</strong>, và app Camera của iPhone cũng không có tính năng tương đương (hướng dẫn chính thức của Apple chỉ nói về chụp ảnh tĩnh giữa lúc quay video và chụm ngón tay để zoom, không có chuyện đánh dấu khoảnh khắc). Vậy nên bạn đánh dấu take theo đúng cách phim trường đã làm cả trăm năm nay:</p>
<ul>
<li><strong>Slate miệng</strong> — nói to "Cảnh 3, shot 2, lần 1" ngay trước khi bắt đầu take thật. Tốn đúng một giây và không thể nhầm lẫn khi bạn tua lại footage sau này.</li>
<li><strong>Vỗ tay một cái</strong> — một tiếng vỗ tay dứt khoát gần micro, hữu ích bất cứ khi nào bạn quay bằng hai máy cùng lúc (vd Pocket 3 cho hình chính, điện thoại cho góc an toàn rộng hơn): tiếng vỗ tạo một đỉnh nhọn rõ rệt trên CẢ HAI dạng sóng âm, đúng thứ bạn căn theo để đồng bộ hai máy lúc dựng.</li>
</ul>
<p>Sau một take bạn ưng ý, cũng nói to ra luôn — "được rồi đó" hay "cái này ngon" — thẳng vào micro. Ba tiếng sau bạn sẽ không nhớ nổi trong bốn take, cái nào là cái tốt nhất — nhưng chính giọng nói đã ghi lại của bạn thì nhớ.</p>

<h3>Xem lại tại chỗ, đổ thẻ ngay trong ngày</h3>
<p>Trước khi dời máy sang setup tiếp theo, phát lại take vừa quay trên màn hình Pocket 3 (hoặc điện thoại). Kiểm nét và khung hình tốn 10 giây; phát hiện một shot bị mất nét SAU KHI đã rời khỏi địa điểm tốn nguyên một buổi quay lại. Cuối ngày quay, chép thẻ sang máy tính ngay trong ngày — Chương 11 sẽ nói kỹ quy trình sao lưu 3-2-1, nhưng bản gọn cho bây giờ: đừng để "mai chép cũng được" trở thành lý do một thẻ nhớ bị định dạng lại trong khi footage hôm nay vẫn còn nằm trên đó.</p>

<h3>Một buổi sáng quay mẫu, theo giờ</h3>
<table>
<tr><th>Giờ</th><th>Việc</th></tr>
<tr><td>08:00–08:15</td><td>Chuẩn bị: kiểm pin, kiểm dung lượng thẻ (toán ở Bài 4.1), shot list đã in/mở sẵn</td></tr>
<tr><td>08:15–08:45</td><td>Quay hết mọi shot trong nhà, từng setup một (gom theo bối cảnh, không theo thứ tự kịch bản)</td></tr>
<tr><td>08:45–09:00</td><td>Di chuyển ra ngoài, xem lại vài take trong nhà trên đường đi</td></tr>
<tr><td>09:00–09:30</td><td>Quay hết mọi shot ngoài trời</td></tr>
<tr><td>09:30–09:45</td><td>Xem lại tại chỗ lần cuối + chép thẻ / sao lưu footage</td></tr>
</table>
${slide('cr-04', 13, 'Checklist ngày quay')}

<div class="callout tip"><p><strong>Mẹo:</strong> ghi một ghi chú chạy (app Notes, hoặc một dòng trong cột Trạng thái của shot list) về take nào là take tốt của mỗi shot — "shot 9: take 2 ✅" — ngay lúc còn nhớ rõ. Chỉ riêng việc này tiết kiệm nhiều thời gian dựng hơn gần như mọi thứ khác trong bài này.</p></div>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — nói tiếp qua một take đã hỏng thay vì quay lại từ đầu.</strong> Vấp một câu rồi nói tiếp ("...ơ khoan, để nói lại, à mà...") nghe có vẻ hiệu quả ngay lúc đó. Không hề: giờ bạn phải tìm và cắt chỗ vấp ra khỏi một clip dài hơn, thay vì đơn giản là bỏ một take ngắn hỏng và dùng take sạch tiếp theo. Cắt. Reset. Nói slate lại. Quay tiếp.</p></div>

<p class="note-ct"><strong>Chương tiếp theo:</strong> Chương 5 đi vào bên trong máy quay — độ phân giải, khung hình/giây, phơi sáng, và vì sao lưới điện 50Hz của Việt Nam đổi hẳn tốc độ khung hình bạn nên dùng.</p>

<h3>🎬 Thực hành (20–30 phút)</h3>
<div class="callout ok"><ol>
<li>Lấy shot list 5–10 dòng bạn đã viết ở phần thực hành Bài 4.3.</li>
<li>Gom các shot theo bối cảnh/setup và viết thứ tự quay bên cạnh mỗi dòng (không phải số thứ tự shot — mà là THỨ TỰ bạn sẽ quay thật).</li>
<li>Quay thật ít nhất 3 shot, áp dụng đủ kỷ luật một take: slate miệng, đệm 2s, hành động, đệm 2s, dừng. Nói to "được rồi" sau take bạn giữ lại.</li>
</ol><p><strong>Đạt khi:</strong> có 3 clip, clip nào cũng bắt đầu bằng slate nói ra miệng, có đệm rõ ở cả hai đầu, và bạn nói được — không cần xem lại — take nào là take tốt.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Storyboard</span><span class="v">Bản vẽ người que thể hiện bố cục và góc máy của một shot, dùng cho shot phức tạp hoặc có êkíp.</span></div>
  <div class="kv"><span class="k">Slate</span><span class="v">Nói to số cảnh/shot/lần quay trước khi bấm quay, để nhận ra được về sau.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Vẽ storyboard khi một shot quá phức tạp để gói trong một câu mô tả; còn lại shot list là đủ.</li>
<li>Quay theo thứ tự bối cảnh/ánh sáng, không theo thứ tự kịch bản — sắp lại lúc dựng, không sắp lại ngay tại hiện trường.</li>
<li>Mọi take: bấm quay → đệm 2s → hành động → đệm 2s → dừng. Take hỏng thì quay lại từ đầu, không bao giờ nói tiếp qua nó.</li>
<li>Cả Pocket 3 lẫn app Camera của iPhone đều không đánh dấu được take tốt trong lúc quay (đã đối chiếu với tài liệu chính thức của DJI) — slate miệng và một câu "được rồi" nói ra là cách thay thế thật của bạn.</li>
<li>Xem lại tại chỗ, và chép thẻ sang máy tính ngay trong ngày.</li>
</ul>

<div class="link-card"><a href="https://support.dji.com/help/content?customId=en-us03400009024&spaceId=34&re=US&lang=en&documentType=artical&paperDocType=paper" target="_blank" rel="noopener">DJI — Hướng dẫn người mới Osmo Pocket 3 (các nút vật lý)</a></div>
</div>
`,
    },

    /* ─────────────────────── 4.5 quiz ─────────────────────── */
    {
      title: '4.5 — Chapter 4 check|||4.5 — Kiểm tra chương 4',
      slug: 'cr-04-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu tình huống về toán dung lượng, từ vựng cảnh/shot/take, shot list và kỷ luật ngày quay.',
      content: `
<div class="ml-en">
<p class="lead">Ten scenario questions covering the storage math, the scene/shot/take vocabulary, shot lists, and shoot-day discipline from this chapter.</p>
<h3>Chapter 4 in five checkable habits</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Before shooting</span><span class="v">Did you check the card has enough space for what you're about to shoot (Lesson 4.1's math)?</span></div>
  <div class="kv"><span class="k">Before shooting</span><span class="v">Do you have a shot list with a seconds column, adding up to no more than your target runtime (4.3)?</span></div>
  <div class="kv"><span class="k">While shooting</span><span class="v">Are you grouping shots by location/setup, not by script order (4.4)?</span></div>
  <div class="kv"><span class="k">Every take</span><span class="v">2s pad, spoken slate, action, 2s pad, stop — and a fresh take (not a patched one) when it goes wrong (4.4)?</span></div>
  <div class="kv"><span class="k">End of day</span><span class="v">Reviewed on the spot, card copied to your computer the same day (4.4)?</span></div>
</div>
<p class="note-ct">If you get a question wrong, the mistake it describes is exactly the mistake this chapter exists to prevent — go back to that lesson's Pitfall box and re-read it.</p>
</div>
<div class="ml-vi">
<p class="lead">Mười câu tình huống về toán dung lượng, từ vựng cảnh/shot/take, shot list, và kỷ luật ngày quay của chương này.</p>
<h3>Chương 4 trong năm thói quen tự kiểm được</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Trước khi quay</span><span class="v">Đã kiểm thẻ còn đủ dung lượng cho thứ sắp quay chưa (toán ở Bài 4.1)?</span></div>
  <div class="kv"><span class="k">Trước khi quay</span><span class="v">Đã có shot list với cột giây, cộng lại không vượt thời lượng mục tiêu chưa (Bài 4.3)?</span></div>
  <div class="kv"><span class="k">Trong lúc quay</span><span class="v">Đang gom shot theo bối cảnh/setup, không theo thứ tự kịch bản (Bài 4.4)?</span></div>
  <div class="kv"><span class="k">Mỗi take</span><span class="v">Đệm 2s, slate miệng, hành động, đệm 2s, dừng — và quay take MỚI (không vá lại) khi hỏng (Bài 4.4)?</span></div>
  <div class="kv"><span class="k">Cuối buổi</span><span class="v">Đã xem lại tại chỗ, chép thẻ sang máy tính ngay trong ngày (Bài 4.4)?</span></div>
</div>
<p class="note-ct">Sai câu nào thì lỗi câu đó mô tả đúng lỗi mà cả chương này sinh ra để chữa — quay lại khối Bẫy của đúng bài đó và đọc lại.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'Cường hits record on the Pocket 3 and shoots one continuous 20-minute take at max bitrate for a vlog, without checking card space. Roughly how much storage did that take use?|||Cường bấm quay trên Pocket 3 và quay liên tục một lèo 20 phút ở bitrate tối đa cho một vlog, không để ý dung lượng thẻ. Đoạn đó đã ngốn khoảng bao nhiêu dung lượng?',
            options: ['≈2 GB|||≈2 GB', '≈50 GB|||≈50 GB', '≈19.5 GB|||≈19,5 GB', '≈100 GB|||≈100 GB'],
            correctIndex: 2,
            points: 1,
            explanation: 'At 130 Mbps max bitrate: 130 × 60 ÷ 8 ÷ 1000 ≈ 0.975 GB/minute × 20 minutes ≈ 19.5 GB. 2 GB is far too low for 20 minutes at this bitrate; 50 GB and 100 GB would need well over an hour.|||Ở bitrate tối đa 130 Mbps: 130 × 60 ÷ 8 ÷ 1000 ≈ 0,975 GB/phút × 20 phút ≈ 19,5 GB. 2GB quá thấp cho 20 phút ở bitrate này; 50GB và 100GB cần hơn một giờ quay liên tục.',
          },
          {
            question: 'Cường shoots one undirected 30-minute take to make a 3-minute vlog. Storage and battery are both fine. Why is this still a problem?|||Cường quay một lèo 30 phút không kịch bản để làm một vlog 3 phút. Thẻ nhớ và pin đều còn thoải mái. Vì sao đây vẫn là một vấn đề?',
            options: [
              '30 minutes exceeds the Pocket 3\'s MP4 file size limit|||30 phút vượt quá giới hạn dung lượng file MP4 của Pocket 3',
              'Reviewing 30 minutes to find 3 good ones costs almost as much time as shooting it, and he never decided in advance which parts he\'d use|||Xem lại 30 phút để tìm ra 3 phút hay tốn gần bằng thời gian đã quay, và anh chưa hề quyết định trước đoạn nào dùng được',
              'The camera will automatically delete older footage to save space|||Máy sẽ tự động xoá bớt footage cũ để tiết kiệm dung lượng',
              'Bitrate automatically drops to zero after 20 minutes of continuous recording|||Bitrate sẽ tự động tụt xuống 0 sau 20 phút quay liên tục',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'The real cost of an undirected long take is review time plus a hidden, uncontrolled shooting ratio — not a hardware limit. Options A, C and D describe things the Pocket 3 does not actually do.|||Cái giá thật của một lèo dài không định hướng là thời gian xem lại cộng một tỉ lệ quay/dùng cao mà không kiểm soát được — không phải giới hạn phần cứng. Phương án A, C, D mô tả những thứ Pocket 3 không hề làm.',
          },
          {
            question: 'Which of these is a case where a long, unbroken take is genuinely fine, as long as you mark moments as you go?|||Trường hợp nào dưới đây là quay một lèo dài mà KHÔNG có vấn đề gì, miễn là bạn cắm mốc dọc đường?',
            options: [
              'A 40-minute interview with a guest, noting timestamps whenever an answer lands well|||Phỏng vấn một khách mời dài 40 phút, ghi lại mốc thời gian mỗi khi có câu trả lời hay',
              'A "day in my life at university" vlog shot non-stop with no breaks|||Vlog "một ngày ở trường" quay liên tục không dừng nghỉ',
              'A 60-second short filmed as one long take, planning to cut it down later|||Video ngắn 60 giây quay một lèo rồi tính cắt sau',
              'Aimless B-roll of a coffee shop recorded continuously for 15 minutes|||B-roll quán cà phê quay liên tục 15 phút không mục đích',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'Interviews are the textbook case: you cannot script someone else\'s answers, so a long take is appropriate — but a question list and timestamped notes keep it from becoming an unmanaged one-long-take habit. The other three are exactly the predictable, plannable content this chapter says to break into short clips.|||Phỏng vấn là ví dụ kinh điển: bạn không viết kịch bản được câu trả lời của người khác nên quay dài là hợp lý — nhưng danh sách câu hỏi và mốc thời gian giữ nó khỏi biến thành thói quen một lèo mất kiểm soát. Ba phương án còn lại đúng là loại nội dung đoán trước được, lên kế hoạch được mà chương này nói phải chia thành clip ngắn.',
          },
          {
            question: 'Cường films "walking through the classroom door" three times in a row — once he trips, once the light is wrong. What are those three recordings called in shot vocabulary?|||Cường quay cảnh "mở cửa bước vào lớp" ba lần liên tiếp — lần đầu vấp chân, lần hai bị ngược sáng. Ba lần quay đó gọi là gì trong từ vựng phân cảnh?',
            options: [
              'Three different shots of the same scene|||3 shot khác nhau của cùng một scene',
              'Three different scenes in the same sequence|||3 scene khác nhau trong cùng một sequence',
              'Three different setups for the same camera|||3 setup khác nhau cho cùng một máy quay',
              'Three takes of the same shot|||3 take của cùng một shot',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'Same action, same framing, repeated attempts — that is the definition of a take. It only becomes a new "shot" if the framing or angle changes.|||Cùng hành động, cùng khung hình, lặp lại nhiều lần thử — đúng định nghĩa của take. Nó chỉ thành một "shot" mới nếu khung hình hoặc góc máy đổi.',
          },
          {
            question: 'Cường\'s video is 4 straight minutes of him talking to camera. Every time he trims a stumble in the edit, viewers see him "pop" slightly in place. Why?|||Video của Cường là 4 phút liền anh ngồi nói chuyện với máy quay. Mỗi lần anh cắt một câu vấp lúc dựng, người xem thấy anh "giật" nhẹ tại chỗ. Vì sao?',
            options: [
              'The microphone recorded in the wrong audio format|||Micro thu sai định dạng âm thanh',
              'No B-roll to cover the cut — two shots of the same size cut back-to-back create a jump cut|||Thiếu B-roll để che chỗ cắt — hai shot cùng cỡ cảnh cắt liền nhau tạo ra jump cut',
              'He recorded at too low a bitrate, causing visual stutter|||Anh quay ở bitrate quá thấp nên hình bị giật',
              'The Pocket 3 automatically inserted an unwanted transition effect|||Pocket 3 tự động chèn một hiệu ứng chuyển cảnh không mong muốn',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'This is the textbook jump cut: all A-roll, no B-roll to cut away to, so every trim is visible as a small pop. Bitrate and audio format do not cause this; the Pocket 3 does not auto-insert transitions.|||Đây đúng là jump cut kinh điển: toàn A-roll, không có B-roll để cắt sang, nên mọi lần cắt gọn đều lộ ra thành một cú giật nhỏ. Bitrate và định dạng âm thanh không gây ra chuyện này; Pocket 3 cũng không tự chèn hiệu ứng chuyển cảnh.',
          },
          {
            question: 'To cut a "typing and debugging" scene smoothly, how many different shot sizes does this chapter\'s five-shot sequence suggest shooting, at minimum?|||Để dựng mượt cảnh "gõ phím tìm lỗi", chuỗi 5 shot gợi ý trong chương này khuyên quay tối thiểu bao nhiêu cỡ cảnh khác nhau?',
            options: [
              'Five — close hands, close face, wide, over-the-shoulder, and an unusual angle|||5 — cận tay, cận mặt, toàn cảnh, qua vai, và một góc lạ',
              'One — a single wide shot is enough|||Chỉ 1 — một toàn cảnh là đủ dùng cho mọi cú cắt',
              'Two — one close-up and one wide shot|||Chỉ 2 — một cận cảnh và một toàn cảnh',
              'As many as possible, with no reference number at all|||Càng nhiều góc càng tốt, không có con số tham khảo nào',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'The five-shot sequence — hands, face, wide, over-the-shoulder/side, unusual angle — is the reliable default from Lesson 4.2 because each size is different enough to cut between without a jump cut.|||Chuỗi 5 shot — tay, mặt, toàn cảnh, qua vai/một phía, góc lạ — là mặc định đáng tin từ Bài 4.2 vì mỗi cỡ cảnh đủ khác nhau để cắt qua lại mà không bị jump cut.',
          },
          {
            question: 'Cường\'s 20-row shot list for a 60-second short had no duration column. He only discovered the total footage ran 4 minutes after shooting it all. What step would have caught this earlier?|||Shot list 20 dòng của Cường cho một video ngắn 60 giây không có cột thời lượng ước tính. Anh chỉ phát hiện tổng footage dài 4 phút sau khi đã quay xong hết. Bước nào lẽ ra đã bắt được lỗi này SỚM HƠN?',
            options: [
              'Shooting at a lower bitrate to keep files smaller|||Quay ở bitrate thấp hơn để file nhẹ hơn',
              'Drawing a storyboard instead of writing a shot list|||Vẽ storyboard thay vì viết shot list',
              'Adding up the estimated-seconds column for every shot BEFORE shooting|||Cộng cột thời lượng ước tính của từng shot lại TRƯỚC khi quay',
              'There was no way to know in advance — it can only be measured after shooting|||Không có cách nào biết trước, phải quay xong mới đo được',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'This is exactly the seconds-column pitfall from Lesson 4.3: sum the estimated durations before you shoot, and a plan that is 4x too long shows up on paper, not on the shoot day.|||Đây đúng là bẫy cột-giây ở Bài 4.3: cộng thời lượng ước tính trước khi quay, và một kế hoạch dài gấp 4 lần cần thiết sẽ lộ ra trên giấy, không phải vào đúng ngày quay.',
          },
          {
            question: 'You plan a 5-minute vlog where each shot stays on screen for about 4 seconds. Roughly how many shots does the shot list need?|||Bạn lên kế hoạch một vlog 5 phút, mỗi shot ở trên màn hình khoảng 4 giây. Shot list cần khoảng bao nhiêu shot?',
            options: [
              '≈ 8',
              '≈ 20',
              '≈ 300',
              '≈ 75',
            ],
            correctIndex: 3,
            points: 1,
            explanation: '300 seconds ÷ 4 seconds per shot = 75 shots. The 20-shot example in Lesson 4.3 fills only about 90 seconds — a 5-minute vlog planned the same way is more than three times longer.|||300 giây ÷ 4 giây mỗi shot = 75 shot. Ví dụ 20 shot ở Bài 4.3 chỉ lấp khoảng 90 giây — một vlog 5 phút lên kế hoạch cùng cách sẽ dài hơn gấp ba.',
          },
          {
            question: 'Cường\'s script has scene 1 indoors, scene 2 outdoors, scene 3 indoors again. What is the smartest shooting order?|||Kịch bản của Cường có cảnh 1 trong nhà, cảnh 2 ngoài trời, cảnh 3 trong nhà. Thứ tự quay hợp lý nhất là gì?',
            options: [
              'Shoot in exact script order: 1, then 2, then 3|||Quay đúng thứ tự 1, 2, 3 y như trong kịch bản',
              'Shoot scenes 1 and 3 (both indoors) back-to-back first, then go outside for scene 2 — reorder to script order in the edit|||Quay cảnh 1 và 3 (cùng trong nhà) liền nhau trước, rồi mới ra ngoài quay cảnh 2 — sắp lại đúng thứ tự lúc dựng',
              'Shoot scene 2 first no matter what, in case the sunlight disappears|||Quay cảnh 2 trước tiên vì ngoài trời sợ mất nắng, bất kể kịch bản',
              'Order does not matter — the edited result will be identical either way|||Thứ tự quay không quan trọng, kết quả dựng sẽ như nhau',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'Group by setup, not script order — reordering clips in the edit is free, but tearing down and rebuilding a location setup twice is not. This is Lesson 4.4\'s core scheduling rule.|||Gom theo setup, không theo thứ tự kịch bản — sắp lại clip lúc dựng thì miễn phí, nhưng dỡ rồi dựng lại một bối cảnh hai lần thì không. Đây là luật sắp lịch cốt lõi của Bài 4.4.',
          },
          {
            question: 'Mid-take, Cường stumbles over a line. What does this chapter\'s take discipline say he should do?|||Đang quay giữa take, Cường đọc vấp một câu. Kỷ luật take của chương này nói anh nên làm gì?',
            options: [
              'Try to re-say the line immediately and keep going, in the SAME recording|||Cố nói lại câu vừa vấp ngay rồi tiếp tục trong CÙNG một lần quay',
              'Turn the camera off and reshoot the whole scene another day|||Tắt máy, dời toàn bộ cảnh này sang một hôm khác',
              'Say "cut, again" out loud, stop, and record a completely fresh take from the top|||Nói to "cắt, làm lại", dừng, và quay một take HOÀN TOÀN MỚI từ đầu',
              'Leave the stumble in and plan to fix it with AI in post|||Giữ nguyên đoạn vấp, tính sửa bằng AI ở khâu hậu kỳ',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'A clean restart gives you one short bad take to discard and one clean take to use. Talking through the mistake glues the error\'s audio right next to the usable part, which is harder to cut than just starting over.|||Quay lại sạch sẽ cho bạn một take hỏng ngắn để bỏ và một take sạch để dùng. Nói tiếp qua lỗi thì dán âm thanh lỗi ngay sát phần dùng được, khó cắt hơn nhiều so với việc quay lại từ đầu.',
          },
        ],
      },
    },
  ],
};
