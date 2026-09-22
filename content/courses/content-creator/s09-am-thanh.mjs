/**
 * Content Creator — Chương 9: Thu âm khi quay. Song ngữ EN/VI (.ml-en / .ml-vi).
 * ⚠️ KHÔNG backtick trần trong content (dùng &#96;); `${` trong mã mẫu viết \${ ; gạch chéo ngược viết \\
 *
 * Nguồn số liệu chính (xem đầy đủ trong báo cáo bàn giao):
 *  - DJI Mic 2: dji.com/mic-2/specs · dji.com/mic-2/faq · dji.com/media-center/announcements/dji-mic-2-en
 *  - DJI Mic 3: dji.com/mic-3/specs
 *  - iPhone 16 Pro Max Audio Mix: support.apple.com/en-us/121032 ·
 *    support.apple.com/guide/iphone/change-sound-recording-options-iph31c1ca6c7/ios
 *  - DaVinci Resolve Auto Sync Audio: blackmagicdesign.com/products/davinciresolve
 *  - CapCut sync (thủ công, không có nút auto-waveform xác nhận được): capcut.com/resource/sync-audio-and-video
 *  - ffmpeg volumedetect/ebur128: chạy thật trong scratch của phiên soạn bài — xem báo cáo bàn giao
 */
import { gallery, slide } from './_slides.mjs';

export default {
  title: 'Chapter 9 — Recording sound while filming|||Chương 9 — Thu âm khi quay',
  description: 'Dạy quay video mà âm thanh sạch ngay từ lúc quay — mức thu đo được bằng ffmpeg, chọn đúng micro trong 5 loại, trị tiếng vang và tiếng ồn nền, và đồng bộ hai hệ thống ghi âm mà không lệch khung hình.',
  lessons: [
    /* ─────────────────── 9.0 slide bài giảng ─────────────────── */
    {
      title: '9.0 — Chapter 9 in 16 slides|||9.0 — Chương 9 trong 16 slide',
      slug: 'cr-09-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Toàn bộ chương 9 gói trong 16 slide: thang dBFS, 5 loại micro, DJI Mic 2/3 với Pocket 3, iPhone Audio Mix, chống ồn phòng, và đồng bộ hai hệ thống.',
      content: `
<div class="ml-en"><h2>📑 Chapter 9 in 16 slides</h2>
<p>Picture quality forgives a lot — a soft shot, a slightly wrong white balance, nobody leaves over that. Sound does not. A voice that crackles, echoes off bare walls, or fights a running air conditioner sends viewers away in seconds, and no amount of color grading in Chapter 15 fixes it after the fact. This is the chapter Module 0 already told you to prioritize first: sound before light, light before storage, storage before camera.</p>
<p>Skim these 16 slides before the lessons below, then come back to slide 5 (the 48kHz/24-bit/32-bit float table) and slide 15 (the pre-shoot checklist) whenever you forget a number mid-shoot.</p></div>
<div class="ml-vi"><h2>📑 Chương 9 trong 16 slide</h2>
<p>Hình ảnh dễ tha thứ — hơi mất nét, sai cân bằng trắng một chút, chẳng ai bỏ đi vì thế. Âm thanh thì không. Một giọng nói rè, vang trong phòng trống, hay đấu tranh với tiếng điều hoà đang chạy sẽ khiến người xem thoát trong vài giây, và không có bao nhiêu công chỉnh màu ở Chương 15 cứu lại được. Đây chính là chương mà Mục 0 đã dặn bạn ưu tiên đầu tiên: âm thanh trước ánh sáng, ánh sáng trước lưu trữ, lưu trữ trước máy quay.</p>
<p>Lướt qua 16 slide này trước khi đọc các bài dưới, rồi quay lại slide 5 (bảng 48kHz/24-bit/32-bit float) và slide 15 (bảng tra nhanh trước khi quay) mỗi khi quên số giữa buổi quay.</p></div>
${gallery('cr-09', [
  [1, 'Bìa chương'],
  [2, 'Bản đồ chương'],
  [3, 'Vì sao tai khó tha thứ hơn mắt'],
  [4, 'Thang dBFS — trần cứng và ba vùng'],
  [5, '48kHz · 24-bit · 32-bit float'],
  [6, 'Đo thật bằng ffmpeg — ba mức'],
  [7, 'Năm loại micro bạn sẽ gặp'],
  [8, 'Đặt lav mic trên người'],
  [9, 'DJI Mic 2/3 khi dùng với Pocket 3'],
  [10, 'iPhone 16 Pro Max — Audio Mix'],
  [11, 'Tiếng vang phòng: cứng vs mềm'],
  [12, 'Sàn ồn nền — vì sao phải tắt trước khi quay'],
  [13, 'Chống gió & room tone 30 giây'],
  [14, 'Thu hai hệ thống & đồng bộ'],
  [15, 'Bảng tra nhanh trước khi quay'],
  [16, 'Thực hành'],
])}
`,
    },

    /* ─────────────────── 9.1 Vì sao âm thanh quan trọng hơn hình ─────────────────── */
    {
      title: '9.1 — Why sound matters more than picture|||9.1 — Vì sao âm thanh quan trọng hơn hình',
      slug: 'cr-09-1-am-thanh-quan-trong',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'dB, dBFS và dải động là gì; vì sao 48kHz/24-bit là mặc định — và 32-bit float thật sự cứu được gì, không cứu được gì.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.1</span>
<h2>Why your viewer's ear forgives less than their eye</h2>
<p class="lead">You can publish a slightly soft shot and nobody comments. Publish three minutes of crackling, room-echoing, air-conditioner-fighting audio and people leave before your hook even lands. This lesson gives you the four numbers that decide almost everything about how clean your sound is: dB, dBFS, sample rate, and bit depth — including the one about 32-bit float that most beginners get half right.</p>

${slide('cr-09', 3, 'Vì sao tai khó tha thứ hơn mắt')}

<h3>Decibels: not a fixed unit, always a ratio</h3>
<p>A decibel (dB) never measures an absolute amount of anything — it measures a ratio between two levels, on a logarithmic scale. That is true whether people mean how loud a room is (dB SPL, sound pressure level, measured with a physical meter against a reference pressure in air) or how "full" a digital recording is (dBFS, decibels relative to Full Scale — the subject of this whole chapter). The two scales look similar and share three letters, but they measure completely different things: dB SPL is about the physical loudness of a source in a room; dBFS is about how close your digital recording sits to the hardest ceiling a digital system has.</p>

<h3>dBFS: a ceiling you can never cross, and a floor you want distance from</h3>
${slide('cr-09', 4, 'Thang dBFS — trần cứng và ba vùng')}
<p>Digital audio has a hard mathematical ceiling: <strong>0 dBFS</strong>. There is no headroom above it the way a physical microphone has a little more room before it truly saturates — cross 0 dBFS in a normal recording and the waveform gets chopped flat, which your ear hears as a harsh, gritty distortion called <strong>clipping</strong>. Everything you record lives somewhere below that ceiling, expressed as a negative number: −6 dBFS is closer to the ceiling (louder) than −40 dBFS (quieter, closer to the noise floor).</p>
<p>The practical target this whole chapter builds toward: keep your voice's <strong>peaks</strong> (the loudest instantaneous moments, not the average level) between <strong>−12 and −6 dBFS</strong>. That leaves headroom above you for an unexpected loud word, and distance below you from your recorder's own self-noise and the room's background hum. Lesson 9.3 is where you actually measure this with ffmpeg instead of guessing from a meter you glance at once.</p>

<h3>48 kHz, not 44.1 kHz — and why the difference matters here</h3>
${slide('cr-09', 5, '48kHz · 24-bit · 32-bit float')}
<p>Sample rate is how many times per second the analog sound wave gets measured and turned into numbers. Music production settled on <strong>44.1 kHz</strong> decades ago (the CD standard); video production settled on <strong>48 kHz</strong> instead, and every camera and recorder in your kit — Pocket 3, iPhone, DJI Mic 2/3 — defaults to 48 kHz for exactly that reason. Mixing the two inside one project does not sound wrong by itself, modern software resamples automatically, but starting everything at 48 kHz removes one conversion step, and one more thing that can silently go wrong when you sync multiple recorders in Lesson 9.4.</p>

<h3>24-bit: headroom for mistakes you fix in the edit, not on set</h3>
<p>Bit depth sets how many discrete "steps" of amplitude a recording can represent — more steps means finer resolution between the quietest and loudest representable sound, its <strong>dynamic range</strong> (dải động). 16-bit was the CD standard; camera and recorder audio defaults to <strong>24-bit</strong> today, which matters less for how clean a well-recorded clip sounds and more for how much you can push its gain around later in DaVinci Resolve or CapCut without the noise floor becoming audible. DJI Mic 2 and Mic 3 both record 24-bit internally by default.</p>

<h3>32-bit float: what it actually rescues, and what it cannot touch</h3>
<div class="callout warn"><p><strong>The beginner misconception worth killing now:</strong> "32-bit float means I can never clip, so I do not need to watch my levels." That is half true in a way that can hurt you. 32-bit float is a floating-point number format with enormous mathematical headroom — DJI Mic 2 and Mic 3 both support it (the original DJI Mic, no number, does not). Record "too hot" in 32-bit float and you can pull the gain down afterward in your editor and recover a clean, undistorted waveform, something 16- or 24-bit integer recording genuinely cannot do once it clips. <strong>But that protection only covers the digital side of the chain, after the analog-to-digital converter.</strong> If the sound is already overloading the microphone capsule or its preamp — someone screaming directly into the mic, for instance — that distortion happens in the analog domain, before any bits exist to be "floating." No file format, 32-bit float included, can un-distort a signal that was already clipped before it became numbers. Keep gain-staging sensibly even on a 32-bit float recorder; treat the format as a safety net under normal mistakes, not a reason to stop paying attention.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
<div class="kv"><span class="k">dB / decibel</span><span class="v">Không đo một lượng cố định — đo TỈ LỆ giữa hai mức, theo thang logarit.</span></div>
<div class="kv"><span class="k">dBFS</span><span class="v">Decibel Full Scale — mức so với "đầy" của hệ số digital; 0dBFS là trần cứng, mọi giá trị khác là số âm.</span></div>
<div class="kv"><span class="k">Clipping</span><span class="v">Vỡ tiếng — sóng âm bị "cắt phẳng" khi vượt 0dBFS, nghe rè/gắt, không phục hồi được bằng phần mềm.</span></div>
<div class="kv"><span class="k">Dynamic range</span><span class="v">Dải động — khoảng cách giữa âm nhỏ nhất và lớn nhất một hệ thống ghi lại được.</span></div>
<div class="kv"><span class="k">32-bit float</span><span class="v">Định dạng dấu phẩy động — cứu được lỗi chỉnh gain SAU khi quay, không cứu được quá tải analog TRƯỚC khi số hoá.</span></div>
</div>

<div class="pitfall co-tieu-de"><p><strong>Trap — trusting 32-bit float to replace gain-staging:</strong> a beginner who owns a DJI Mic 2 often stops watching input levels entirely because "32-bit float can't clip." True for the file — but the microphone capsule and its analog preamp can still overload before the signal ever reaches that 32-bit number. You will not notice until you play back a scene where someone got excited and leaned in close, and the audio is distorted in a way no editor can fix. Keep an eye on the meter even on a 32-bit float device; treat it as insurance, not a license to ignore levels.</p></div>

<p class="note-ct"><strong>Connects to next:</strong> Lesson 9.2 turns these numbers into a decision — which of five microphone types to reach for, and exactly where to place it, so you spend less time fighting for headroom in the first place.</p>

<h3>🎬 Practice (10–15 minutes)</h3>
<div class="callout ok"><ol>
<li>Generate a 5-second test tone with ffmpeg and measure it: &#96;ffmpeg -f lavfi -i "sine=frequency=440:duration=5" -af volumedetect -f null -&#96;</li>
<li>Read the &#96;max_volume&#96; line it prints — that is a real dBFS peak reading, not a guess.</li>
<li>If you own a DJI Mic 2/3, open the transmitter's recording mode and find where 24-bit vs 32-bit float is set (Chapter 6 covers this screen in full).</li>
</ol><p><strong>Done when:</strong> you can explain, in one sentence and without notes, why 32-bit float would not save a scream recorded directly against the mic capsule.</p></div>

<h3>📌 Summary</h3>
<ul>
<li>dBFS and dB SPL share a name but measure different things — this chapter is entirely about dBFS.</li>
<li>0 dBFS is a hard ceiling with no headroom above it; target peaks of −12…−6 dBFS below it.</li>
<li>48 kHz is video's standard sample rate (not music's 44.1 kHz) — everything in your kit defaults to it.</li>
<li>24-bit buys headroom for gain changes later; 32-bit float buys even more, but only on the digital side.</li>
<li>32-bit float cannot undo distortion that already happened in the analog microphone/preamp stage.</li>
</ul>

<div class="link-card"><a href="https://www.dji.com/media-center/announcements/dji-mic-2-en" target="_blank" rel="noopener">DJI Mic 2 announcement — official explanation of 32-bit float recording</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.1</span>
<h2>Vì sao tai người xem khó tha thứ hơn mắt</h2>
<p class="lead">Bạn đăng một cảnh hơi mất nét, chẳng ai bình luận gì. Đăng ba phút âm thanh rè, vang trong phòng trống, đấu tranh với tiếng điều hoà đang chạy — người xem thoát trước khi hook của bạn kịp phát huy tác dụng. Bài này cho bạn bốn con số quyết định gần hết độ sạch của âm thanh: dB, dBFS, tần số lấy mẫu, và độ sâu bit — kể cả phần về 32-bit float mà hầu hết người mới chỉ hiểu đúng một nửa.</p>

${slide('cr-09', 3, 'Vì sao tai khó tha thứ hơn mắt')}

<h3>Decibel: không phải một lượng cố định, luôn là một tỉ lệ</h3>
<p>Decibel (dB) không bao giờ đo một lượng tuyệt đối — nó đo TỈ LỆ giữa hai mức, theo thang logarit. Điều này đúng dù người ta đang nói về một căn phòng ồn cỡ nào (dB SPL — sound pressure level, đo bằng máy đo âm thanh thật so với một mức áp suất không khí tham chiếu) hay một bản ghi digital "đầy" cỡ nào (dBFS — decibel so với Full Scale, chủ đề của cả chương này). Hai thang đo trông giống nhau, dùng chung ba chữ cái, nhưng đo hai thứ hoàn toàn khác nhau: dB SPL nói về độ to VẬT LÝ của nguồn âm trong phòng; dBFS nói về bản ghi digital của bạn đang gần cái trần cứng nhất của một hệ thống số tới đâu.</p>

<h3>dBFS: một cái trần không bao giờ được vượt qua, và một cái sàn cần đứng xa</h3>
${slide('cr-09', 4, 'Thang dBFS — trần cứng và ba vùng')}
<p>Âm thanh digital có một trần cứng về mặt toán học: <strong>0 dBFS</strong>. Không có khoảng lùi nào phía trên nó theo kiểu một micro vật lý còn chút "dư" trước khi thật sự bão hoà — vượt 0dBFS trong một bản ghi bình thường là sóng âm bị "cắt phẳng" đầu, tai bạn nghe thành tiếng rè, gắt gọi là <strong>vỡ tiếng (clipping)</strong>. Mọi thứ bạn ghi được nằm ở đâu đó DƯỚI cái trần đó, biểu diễn bằng một số âm: −6dBFS gần trần hơn (to hơn) so với −40dBFS (nhỏ hơn, gần sàn ồn hơn).</p>
<p>Mục tiêu thực hành mà cả chương này xây dựng tới: giữ cho <strong>đỉnh</strong> giọng nói của bạn (khoảnh khắc to nhất tức thời, không phải mức trung bình) nằm trong khoảng <strong>−12 đến −6dBFS</strong>. Khoảng đó chừa khoảng lùi phía trên cho một từ bất ngờ nói to, và khoảng cách phía dưới tới tiếng tự nhiễu của máy ghi và tiếng ồn nền của phòng. Bài 9.3 là nơi bạn thật sự ĐO cái này bằng ffmpeg thay vì đoán qua một lần liếc nhìn đồng hồ mức.</p>

<h3>48kHz, không phải 44,1kHz — và vì sao khác biệt này quan trọng ở đây</h3>
${slide('cr-09', 5, '48kHz · 24-bit · 32-bit float')}
<p>Tần số lấy mẫu là số lần mỗi giây sóng âm analog được đo và biến thành con số. Ngành sản xuất nhạc chốt <strong>44,1kHz</strong> từ nhiều thập kỷ trước (chuẩn đĩa CD); ngành sản xuất video lại chốt <strong>48kHz</strong>, và mọi máy quay/máy ghi trong đồ nghề của bạn — Pocket 3, iPhone, DJI Mic 2/3 — đều mặc định 48kHz chính vì lý do đó. Trộn hai chuẩn này trong cùng một dự án không tự nó nghe sai, phần mềm hiện đại tự resample, nhưng bắt đầu mọi thứ ở 48kHz bớt đi một bước chuyển đổi, và bớt đi một chỗ có thể âm thầm sai khi bạn đồng bộ nhiều máy ghi ở Bài 9.4.</p>

<h3>24-bit: khoảng lùi cho lỗi bạn sửa lúc dựng, không phải lúc quay</h3>
<p>Độ sâu bit quyết định số "nấc" biên độ rời rạc một bản ghi biểu diễn được — nhiều nấc hơn nghĩa là độ phân giải mịn hơn giữa âm nhỏ nhất và lớn nhất biểu diễn được, đây chính là <strong>dải động</strong> (dynamic range). 16-bit từng là chuẩn CD; âm thanh của máy quay/máy ghi hôm nay mặc định <strong>24-bit</strong>, điều này ít quan trọng cho độ sạch của một clip đã ghi tốt, mà quan trọng hơn cho việc bạn kéo/đẩy gain của nó lên xuống được bao nhiêu ở DaVinci Resolve hay CapCut sau này mà sàn ồn không lộ ra. DJI Mic 2 và Mic 3 đều mặc định ghi nội bộ 24-bit.</p>

<h3>32-bit float: nó thật sự cứu được gì, và không đụng được vào đâu</h3>
<div class="callout warn"><p><strong>Hiểu lầm của người mới cần dẹp ngay:</strong> "32-bit float nghĩa là không bao giờ vỡ tiếng, nên khỏi cần canh mức." Điều này đúng một nửa theo kiểu có thể hại bạn. 32-bit float là một định dạng số dấu phẩy động với khoảng lùi toán học khổng lồ — DJI Mic 2 và Mic 3 đều hỗ trợ (riêng DJI Mic bản gốc, không đánh số, thì không). Ghi "quá to" ở 32-bit float, bạn vẫn kéo gain xuống được sau đó trong phần mềm dựng và lấy lại một sóng âm sạch, không méo — điều mà ghi số nguyên 16- hay 24-bit thật sự KHÔNG làm được một khi đã vỡ. <strong>Nhưng sự bảo vệ đó chỉ phủ khâu SỐ, sau bộ chuyển đổi tương tự-sang-số (ADC).</strong> Nếu âm thanh đã làm quá tải viên nang micro hoặc mạch khuếch đại (preamp) của nó — ví dụ ai đó hét thẳng sát micro — méo tiếng đó xảy ra ở khâu ANALOG, trước khi có bit nào tồn tại để mà "trôi nổi". Không định dạng file nào, kể cả 32-bit float, gỡ méo được một tín hiệu đã vỡ trước khi nó trở thành con số. Vẫn phải canh gain hợp lý ngay cả trên máy ghi 32-bit float; coi định dạng này là lưới an toàn cho lỗi thông thường, không phải lý do để ngừng chú ý.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">dB / decibel</span><span class="v">Không đo một lượng cố định — đo TỈ LỆ giữa hai mức, theo thang logarit.</span></div>
<div class="kv"><span class="k">dBFS</span><span class="v">Decibel Full Scale — mức so với "đầy" của hệ số digital; 0dBFS là trần cứng, mọi giá trị khác là số âm.</span></div>
<div class="kv"><span class="k">Vỡ tiếng (Clipping)</span><span class="v">Sóng âm bị "cắt phẳng" khi vượt 0dBFS, nghe rè/gắt, không phục hồi được bằng phần mềm.</span></div>
<div class="kv"><span class="k">Dải động (Dynamic range)</span><span class="v">Khoảng cách giữa âm nhỏ nhất và lớn nhất một hệ thống ghi lại được.</span></div>
<div class="kv"><span class="k">32-bit float</span><span class="v">Định dạng dấu phẩy động — cứu được lỗi chỉnh gain SAU khi quay, không cứu được quá tải analog TRƯỚC khi số hoá.</span></div>
</div>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — tin tưởng 32-bit float thay thế hẳn việc canh gain:</strong> một người mới sở hữu DJI Mic 2 thường ngừng hẳn việc nhìn mức thu vì "32-bit float không vỡ được". Điều đó đúng với FILE — nhưng viên nang micro và mạch khuếch đại analog của nó vẫn có thể quá tải trước khi tín hiệu kịp trở thành con số 32-bit đó. Bạn sẽ không nhận ra cho tới khi phát lại một cảnh ai đó phấn khích cúi sát vào mic, và âm thanh méo theo kiểu không phần mềm dựng nào sửa được. Vẫn phải để mắt tới đồng hồ mức kể cả trên thiết bị 32-bit float; coi nó là bảo hiểm, không phải giấy phép bỏ qua việc canh mức.</p></div>

<p class="note-ct"><strong>Nối với chương sau:</strong> Bài 9.2 biến những con số này thành một quyết định — chọn loại nào trong năm loại micro, và đặt nó ở đâu cho đúng, để bạn bớt phải vật lộn giành khoảng lùi ngay từ đầu.</p>

<h3>🎬 Thực hành (10–15 phút)</h3>
<div class="callout ok"><ol>
<li>Tạo một tín hiệu thử 5 giây bằng ffmpeg rồi đo nó: &#96;ffmpeg -f lavfi -i "sine=frequency=440:duration=5" -af volumedetect -f null -&#96;</li>
<li>Đọc dòng &#96;max_volume&#96; nó in ra — đó là một số dBFS đỉnh THẬT, không phải đoán.</li>
<li>Nếu bạn có DJI Mic 2/3, mở chế độ ghi trên đầu phát và tìm chỗ chọn 24-bit hay 32-bit float (Chương 6 đã nói kỹ màn hình này).</li>
</ol><p><strong>Đạt khi:</strong> bạn giải thích được, trong một câu và không cần xem lại bài, vì sao 32-bit float không cứu được một tiếng hét ghi thẳng sát viên nang micro.</p></div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>dBFS và dB SPL trùng tên nhưng đo hai thứ khác nhau — cả chương này nói về dBFS.</li>
<li>0dBFS là trần cứng, không có khoảng lùi phía trên; nhắm đỉnh vào khoảng −12…−6dBFS bên dưới nó.</li>
<li>48kHz là tần số lấy mẫu chuẩn của video (không phải 44,1kHz của nhạc) — mọi máy trong đồ nghề của bạn mặc định vậy.</li>
<li>24-bit mua thêm khoảng lùi để chỉnh gain sau này; 32-bit float mua thêm nhiều hơn nữa, nhưng chỉ ở khâu số.</li>
<li>32-bit float không gỡ được méo tiếng đã xảy ra ở khâu micro/preamp analog.</li>
</ul>

<div class="link-card"><a href="https://www.dji.com/media-center/announcements/dji-mic-2-en" target="_blank" rel="noopener">Thông báo DJI Mic 2 — giải thích chính thức về ghi âm 32-bit float</a></div>
</div>
`,
    },

    /* ─────────────────── 9.2 Micro & cách đặt ─────────────────── */
    {
      title: '9.2 — Five microphones and where each one goes|||9.2 — Năm loại micro và đặt ở đâu',
      slug: 'cr-09-2-micro-cach-dat',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Năm loại micro và khi nào dùng loại nào, cách đặt lav mic đúng, DJI Mic 2/3 với Pocket 3 qua OsmoAudio, và Audio Mix của iPhone 16 Pro Max.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.2</span>
<h2>Five microphones you will actually reach for, and exactly where each one goes</h2>
<p class="lead">"Which mic should I buy" is the wrong first question — you likely already own three of the five types this lesson covers, built into gear you already have. The right question is which one fits the shot you are about to record, and where exactly to place it so the four numbers from Lesson 9.1 land where they should.</p>

<h3>The five types, and when each one wins</h3>
${slide('cr-09', 7, 'Năm loại micro bạn sẽ gặp')}
<p>Built-in mics (three on Pocket 3's body, four — a quad array — on iPhone 16 Pro Max) are genuinely good enough for casual vlogging in a quiet room; they are also the first thing to fail you the moment there is distance, wind, or background noise between you and the camera. A clip-on lavalier (lav) mic solves the "sitting still, talking to camera" case — interviews, talking-head lessons. A wireless system like DJI Mic 2/3 solves the same case when you need to walk around or stay several meters from camera. A shotgun mic, mounted on a hotshoe or held on a boom just out of frame, is what you reach for when you do not want a visible clip-on mic — group shots, narrated B-roll. A USB mic on your desk is for a fixed recording position: voiceover, screen recordings, podcasting.</p>

<h3>Placing a lav mic: distance and fabric both matter</h3>
${slide('cr-09', 8, 'Đặt lav mic trên người')}
<p>The standard placement is roughly <strong>one hand-span from the mouth (15–20cm)</strong>, clipped to a single layer of <strong>thick</strong> fabric — a shirt or jacket — with the capsule pointed up, not covered from above. Thin or doubled-over fabric muffles the sound and steals high frequencies (the consonant detail that makes speech intelligible), and rubbing against a loose scarf or tie shows up as sharp clicks on the recording. Get the capsule out from under a wind jacket, too — that hollow rustling sound is nearly impossible to remove afterward.</p>

<h3>DJI Mic 2/3 with Pocket 3 — the setup you will use most</h3>
${slide('cr-09', 9, 'DJI Mic 2/3 khi dùng với Pocket 3')}
<p>Pocket 3 links directly to a DJI Mic 2 or Mic 3 transmitter over Bluetooth through DJI's <strong>OsmoAudio</strong> ecosystem — no receiver required (Control Center → Wireless Microphone → TX1/TX2, exactly as Chapter 6 walked you through). Both mics record 32-bit float internally in addition to 24-bit; storage and recording time differ by generation — Mic 2 carries 8GB per transmitter (about 14 hours at 24-bit, roughly 11 at 32-bit float, per DJI's own FAQ), Mic 3 carries 32GB (about 57.3 hours at 24-bit, 43 at 32-bit float, in its default single-file mode). Mic 2 alone adds <strong>Safety Track</strong>: a second recording, 6dB quieter than the main one, saved alongside it — if the main track clips on a sudden shout, the quiet backup usually did not. One easy mistake: the 3.5mm headphone jack for live-monitoring the mic lives on the <strong>receiver</strong> only. Link a transmitter straight to Pocket 3 with no receiver in the chain, and there is nowhere to plug headphones in for that mic — monitor through Pocket 3's own screen and Wind Noise Reduction settings instead.</p>

<h3>iPhone 16 Pro Max: Audio Mix, and the one setting it depends on</h3>
${slide('cr-09', 10, 'iPhone 16 Pro Max — Audio Mix')}
<p>Apple's Audio Mix is an after-the-fact adjustment, edited later in the Photos app, with four modes: <strong>Standard</strong> (plays back exactly what was recorded), <strong>In-Frame</strong> (reduces sound from sources not visible in the shot), <strong>Studio</strong> (reduces background noise and room reverb, aiming for a studio-like sound), and <strong>Cinematic</strong> (pushes all voices to a front-facing track, keeping ambient sound in the surrounding field). It only works on video recorded with <strong>Spatial Audio</strong> — the default sound-recording mode on iPhone 16 and later (Settings › Camera › Record Sound also offers Stereo and Mono). Recording in Spatial Audio or Stereo also automatically turns on Wind Noise Reduction, which you can disable in that same settings screen if you need to.</p>

<div class="callout ok"><p><strong>A quiet built-in mic wins over a badly-placed external one.</strong> If your only option is a lav mic rubbing against a scarf, or Pocket 3's own three-mic array in a quiet room, the built-in mic usually sounds cleaner. Reach for an external mic to solve a specific problem — distance, wind, or wanting the camera further from your face — not as a default because "external is always better."</p></div>

<div class="pitfall co-tieu-de"><p><strong>Trap — filming a whole scene, then discovering the lav mic was clipped under two layers of fabric:</strong> the built-in monitoring on Pocket 3's tiny screen will not reveal a muffled, bass-heavy lav recording the way real headphones will. Always do a 10–20 second test clip after clipping on a lav, and actually listen back with headphones (Lesson 9.3) before you commit to a full take.</p></div>

<p class="note-ct"><strong>Connects to next:</strong> Lesson 9.3 is where you point real numbers at what you just set up — measuring peak level with ffmpeg, listening for room echo, and clearing out the background noise a quiet-looking room usually still has.</p>

<h3>🎬 Practice (15–20 minutes)</h3>
<div class="callout ok"><ol>
<li>Pick the microphone type that matches a video you are actually planning to shoot this week, and say out loud why (not just "it's better").</li>
<li>If you have a lav mic, clip it under a thick single layer, then under a thin/doubled layer, and record 10 seconds of each — compare with headphones.</li>
<li>If you have DJI Mic 2/3, link it to Pocket 3 through OsmoAudio (no receiver) and confirm you can see the input level moving on Pocket 3's screen.</li>
</ol><p><strong>Done when:</strong> you can state which of the five mic types you will default to for talking-head lessons versus walking vlogs, and why.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Lavalier (lav)</span><span class="v">Mic cài áo — micro nhỏ kẹp lên quần áo, gần miệng người nói.</span></div>
<div class="kv"><span class="k">Shotgun mic</span><span class="v">Mic thu hướng — thu mạnh phía trước, yếu hai bên, dùng khi không muốn thấy mic trong khung hình.</span></div>
<div class="kv"><span class="k">OsmoAudio</span><span class="v">Hệ sinh thái kết nối không dây của DJI — cho phép Mic 2/3 link thẳng Bluetooth vào Pocket 3, không cần receiver.</span></div>
<div class="kv"><span class="k">Safety Track</span><span class="v">Track dự phòng của DJI Mic 2, ghi thấp hơn track chính 6dB để không vỡ cùng lúc.</span></div>
<div class="kv"><span class="k">Spatial Audio</span><span class="v">Chế độ thu âm không gian của iPhone 16+ — điều kiện bắt buộc để dùng Audio Mix sau khi quay.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Five mic types, one decision each time: built-in, lav, wireless (DJI Mic), shotgun, or USB — pick by situation, not by "better."</li>
<li>Lav mics: ~15–20cm from the mouth, clipped on one layer of thick fabric, capsule up.</li>
<li>DJI Mic 2/3 link straight to Pocket 3 over Bluetooth (OsmoAudio) — but the headphone jack only exists on the receiver.</li>
<li>iPhone's Audio Mix needs Spatial Audio recording to work at all; it is an edit made later in Photos, not a recording setting.</li>
<li>A clean built-in mic beats a badly-placed external one — external mics solve specific problems, not a default upgrade.</li>
</ul>

<div class="link-card"><a href="https://www.dji.com/mic-2/specs" target="_blank" rel="noopener">DJI Mic 2 — official specs page</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.2</span>
<h2>Năm loại micro bạn sẽ thật sự dùng, và đặt mỗi loại ở đâu</h2>
<p class="lead">"Nên mua mic nào" là câu hỏi sai ngay từ đầu — rất có thể bạn đã có sẵn ba trong năm loại mà bài này nói tới, nằm ngay trong đồ nghề hiện có. Câu hỏi đúng là loại nào hợp với cảnh bạn sắp quay, và đặt nó chính xác ở đâu để bốn con số ở Bài 9.1 rơi đúng chỗ.</p>

<h3>Năm loại, và mỗi loại thắng khi nào</h3>
${slide('cr-09', 7, 'Năm loại micro bạn sẽ gặp')}
<p>Mic tích hợp (ba mic trên thân Pocket 3, bốn mic — dàn quad — trên iPhone 16 Pro Max) thật sự đủ tốt cho vlog thường trong phòng yên tĩnh; đó cũng là thứ đầu tiên "phản" bạn ngay khi có khoảng cách, gió, hoặc tiếng ồn nền giữa bạn và máy quay. Mic cài áo (lav) có dây giải quyết trường hợp "ngồi yên, nói với máy quay" — phỏng vấn, bài giảng talking-head. Hệ thống không dây như DJI Mic 2/3 giải quyết đúng trường hợp đó khi bạn cần đi lại hoặc đứng cách máy vài mét. Mic shotgun (thu hướng), gắn trên hotshoe của máy hoặc cầm bằng boom ngay ngoài khung hình, là lựa chọn khi bạn không muốn thấy mic cài áo lộ ra — quay nhóm, B-roll có lời thuyết minh. Mic USB đặt trên bàn dành cho vị trí thu cố định: lồng tiếng, quay màn hình, podcast.</p>

<h3>Đặt lav mic: khoảng cách VÀ chất vải đều quan trọng</h3>
${slide('cr-09', 8, 'Đặt lav mic trên người')}
<p>Vị trí chuẩn là khoảng <strong>một gang tay cách miệng (15–20cm)</strong>, kẹp trên MỘT lớp vải DÀY — áo sơ mi hoặc áo khoác — đầu mic hướng lên, không bị che từ phía trên. Vải mỏng hoặc hai lớp làm bí tiếng và mất các âm cao (chi tiết phụ âm khiến lời nói rõ ràng), còn cọ xát với khăn quàng hay cà vạt lỏng lẻo thì thành tiếng "cạch cạch" sắc trên bản ghi. Cũng nhớ đưa viên mic ra khỏi áo khoác gió — tiếng "phần phật" rỗng đó gần như không sửa được sau khi đã ghi.</p>

<h3>DJI Mic 2/3 với Pocket 3 — bộ đôi bạn sẽ dùng nhiều nhất</h3>
${slide('cr-09', 9, 'DJI Mic 2/3 khi dùng với Pocket 3')}
<p>Pocket 3 link thẳng với transmitter DJI Mic 2 hoặc Mic 3 qua Bluetooth nhờ hệ sinh thái <strong>OsmoAudio</strong> của DJI — không cần receiver (Control Center → Wireless Microphone → TX1/TX2, đúng như Chương 6 đã hướng dẫn). Cả hai mic đều ghi nội bộ 32-bit float bên cạnh 24-bit; dung lượng và thời lượng ghi khác nhau theo thế hệ — Mic 2 có 8GB/đầu phát (khoảng 14 giờ ở 24-bit, khoảng 11 giờ ở 32-bit float, theo đúng FAQ của DJI), Mic 3 có 32GB (khoảng 57,3 giờ ở 24-bit, 43 giờ ở 32-bit float, ở chế độ một file mặc định). Riêng Mic 2 có thêm <strong>Safety Track</strong>: một bản ghi thứ hai, thấp hơn track chính 6dB, lưu song song — track chính vỡ vì một tiếng hét bất chợt thì bản dự phòng nhỏ hơn thường vẫn sạch. Một lỗi dễ mắc: cổng tai nghe 3.5mm để nghe trực tiếp chỉ nằm trên <strong>receiver</strong>. Link thẳng transmitter vào Pocket 3 mà không qua receiver, bạn sẽ không có chỗ nào cắm tai nghe cho mic đó — giám sát qua màn hình Pocket 3 và cài đặt Wind Noise Reduction thay vào đó.</p>

<h3>iPhone 16 Pro Max: Audio Mix, và cài đặt nó phụ thuộc vào</h3>
${slide('cr-09', 10, 'iPhone 16 Pro Max — Audio Mix')}
<p>Audio Mix của Apple là một điều chỉnh SAU khi quay, thực hiện trong app Ảnh, có bốn chế độ: <strong>Standard</strong> (phát đúng bản gốc đã thu), <strong>In-Frame</strong> (giảm âm thanh từ nguồn không xuất hiện trong khung hình), <strong>Studio</strong> (giảm tiếng nền và tiếng vang phòng, hướng tới âm thanh kiểu phòng thu), và <strong>Cinematic</strong> (dồn mọi giọng nói vào một track phía trước, giữ âm thanh môi trường ở vòm xung quanh). Nó chỉ hoạt động với video quay ở <strong>Spatial Audio</strong> — chế độ thu âm mặc định trên iPhone 16 trở lên (Settings › Camera › Record Sound cũng cho chọn Stereo và Mono). Quay ở Spatial Audio hoặc Stereo cũng tự động bật Wind Noise Reduction, bạn tắt được nó ngay trong màn hình cài đặt đó nếu cần.</p>

<div class="callout ok"><p><strong>Một mic tích hợp sạch thắng một mic ngoài đặt sai.</strong> Nếu lựa chọn duy nhất là một lav mic đang cọ xát vào khăn quàng, hay dàn ba mic của chính Pocket 3 trong phòng yên tĩnh, mic tích hợp thường nghe sạch hơn. Chỉ dùng mic ngoài để giải quyết một vấn đề cụ thể — khoảng cách, gió, hoặc muốn máy quay xa mặt hơn — không phải mặc định vì "mic ngoài luôn tốt hơn".</p></div>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — quay xong cả cảnh mới phát hiện lav mic bị kẹp dưới hai lớp vải:</strong> phần giám sát trên màn hình bé xíu của Pocket 3 không lộ ra một bản ghi lav bị bí tiếng, nặng trầm theo cách tai nghe thật sẽ cho bạn thấy. Luôn quay thử 10–20 giây ngay sau khi kẹp lav, và THẬT SỰ nghe lại bằng tai nghe (Bài 9.3) trước khi quay chính thức cả cảnh.</p></div>

<p class="note-ct"><strong>Nối với chương sau:</strong> Bài 9.3 là nơi bạn chĩa những con số thật vào thứ vừa lắp đặt xong — đo mức đỉnh bằng ffmpeg, nghe tiếng vang phòng, và dọn sạch tiếng ồn nền mà một căn phòng nhìn có vẻ yên tĩnh thường vẫn còn.</p>

<h3>🎬 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Chọn loại micro hợp với một video bạn thật sự định quay tuần này, và nói to lý do (không chỉ "nó tốt hơn").</li>
<li>Nếu có lav mic, kẹp dưới một lớp vải dày, rồi dưới một lớp vải mỏng/hai lớp, quay 10 giây mỗi kiểu — so sánh bằng tai nghe.</li>
<li>Nếu có DJI Mic 2/3, link vào Pocket 3 qua OsmoAudio (không receiver) và xác nhận thấy mức thu di chuyển trên màn hình Pocket 3.</li>
</ol><p><strong>Đạt khi:</strong> bạn nói được sẽ mặc định dùng loại nào trong năm loại cho bài giảng talking-head so với vlog vừa đi vừa quay, và vì sao.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Lavalier (lav)</span><span class="v">Mic cài áo — micro nhỏ kẹp lên quần áo, gần miệng người nói.</span></div>
<div class="kv"><span class="k">Shotgun mic</span><span class="v">Mic thu hướng — thu mạnh phía trước, yếu hai bên, dùng khi không muốn thấy mic trong khung hình.</span></div>
<div class="kv"><span class="k">OsmoAudio</span><span class="v">Hệ sinh thái kết nối không dây của DJI — cho phép Mic 2/3 link thẳng Bluetooth vào Pocket 3, không cần receiver.</span></div>
<div class="kv"><span class="k">Safety Track</span><span class="v">Track dự phòng của DJI Mic 2, ghi thấp hơn track chính 6dB để không vỡ cùng lúc.</span></div>
<div class="kv"><span class="k">Spatial Audio</span><span class="v">Chế độ thu âm không gian của iPhone 16+ — điều kiện bắt buộc để dùng Audio Mix sau khi quay.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Năm loại micro, mỗi lần một quyết định: tích hợp, lav, không dây (DJI Mic), shotgun, hay USB — chọn theo tình huống, không theo "cái nào tốt hơn".</li>
<li>Lav mic: cách miệng ~15–20cm, kẹp trên một lớp vải dày, đầu mic hướng lên.</li>
<li>DJI Mic 2/3 link thẳng Pocket 3 qua Bluetooth (OsmoAudio) — nhưng cổng tai nghe chỉ có trên receiver.</li>
<li>Audio Mix của iPhone cần quay ở Spatial Audio mới dùng được; đây là một bước chỉnh SAU trong app Ảnh, không phải cài đặt lúc quay.</li>
<li>Một mic tích hợp sạch thắng một mic ngoài đặt sai — mic ngoài giải quyết vấn đề cụ thể, không phải nâng cấp mặc định.</li>
</ul>

<div class="link-card"><a href="https://www.dji.com/mic-2/specs" target="_blank" rel="noopener">DJI Mic 2 — trang thông số kỹ thuật chính thức</a></div>
</div>
`,
    },

    /* ─────────────────── 9.3 Mức thu, giám sát & phòng thu ─────────────────── */
    {
      title: '9.3 — Levels, monitoring, and taming the room|||9.3 — Mức thu, giám sát và trị phòng quay',
      slug: 'cr-09-3-muc-thu-phong-thu',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Đo mức thu thật bằng ffmpeg (volumedetect, ebur128), giám sát bằng tai nghe, trị tiếng vang phòng, tắt tiếng ồn nền trước khi quay, và chống gió.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.3</span>
<h2>Stop guessing your levels — read them with ffmpeg</h2>
<p class="lead">A meter you glance at once while recording tells you almost nothing reliable — you are watching a screen in bright sunlight, distracted by framing, or the meter itself is a tiny bar on a 2-inch touchscreen. This lesson replaces guessing with three things: an actual measured number from a real command, headphones instead of your eyes, and a room that has been made to cooperate before you press record.</p>

<h3>Three real levels, measured, not estimated</h3>
${slide('cr-09', 6, 'Đo thật bằng ffmpeg — ba mức')}
<p>Every number on this slide came from actually running ffmpeg on a real test file, not from a spec sheet. Here is the exact command and its real output, so you can run the same thing on your own recordings:</p>
<pre><code class="language-bash">ffmpeg -f lavfi -i "sine=frequency=440:duration=5:sample_rate=48000" -af "volume=-14dB" -ac 1 qua-nho.wav
ffmpeg -i qua-nho.wav -af volumedetect -f null -</code></pre>
<div class="out">[Parsed_volumedetect_0] mean_volume: -35.1 dB
[Parsed_volumedetect_0] max_volume: -32.1 dB</div>
<p>That &#96;max_volume&#96; line is your real peak — this test clip landed at <strong>-32.1 dBFS</strong>, well below the -12…-6 dBFS target, i.e. recorded too quiet. Running the identical command on a louder version of the same tone gave a clip in-target, and pushing the gain hard past 0 dBFS produced an unmistakably clipped one:</p>
<div class="out">Trong mục tiêu — max_volume: -8.1 dB (mean: -11.1 dB)
Vỡ tiếng      — max_volume:  0.0 dB (mean: -0.5 dB, sóng bị "cắt phẳng")</div>
<p>Notice the clipped clip's mean volume sits barely half a dB below its peak — that flatness (instead of the roughly 3dB gap a clean sine wave should show) is what clipping looks like numerically, not just audibly.</p>

<h3>EBU R128: the loudness-standard measurement behind "-14 LUFS"</h3>
<p>&#96;volumedetect&#96; reads peak and average dBFS; a second ffmpeg filter, &#96;ebur128&#96;, measures perceived loudness on the broadcast-standard LUFS scale (Chapter 16 covers mixing to YouTube's approximate -14 LUFS target in full — this is just the measurement tool). Run on the in-target clip above:</p>
<pre><code class="language-bash">ffmpeg -i trong-muc-tieu.wav -af ebur128=peak=true -f null -</code></pre>
<div class="out">Integrated loudness:
  I: -11.8 LUFS
Loudness range:
  LRA: 0.0 LU
True peak:
  Peak: -8.1 dBFS</div>

<h3>Monitor with headphones, not your eyes</h3>
<p>A level meter cannot tell you that a lav mic is muffled under thick fabric, that there is a faint electrical hum, or that the room has an echo — only your ears catch those. Put on real headphones (not the camera's tiny speaker) for every test clip before a real take, every time you change a mic or a room.</p>

<h3>Room acoustics: why a big room can sound worse than a small one</h3>
${slide('cr-09', 11, 'Tiếng vang phòng: cứng vs mềm')}
<p>A room full of hard, flat, parallel surfaces — bare walls, windows, tile floors — bounces sound back and forth many times before it reaches the mic, which your ear hears as "echo" or a hollow, distant quality even when the speaker is close. Soft, irregular surfaces (curtains, a stacked closet of clothes, a rug, a couch) absorb those reflections instead of bouncing them. You do not need a treated studio — recording dialogue in front of an open closet or with curtains drawn noticeably tightens up the sound, and it is one of the fastest fixes available to you at home.</p>

<h3>Why the AC has to go off (with real numbers, honestly labeled)</h3>
${slide('cr-09', 12, 'Sàn ồn nền — vì sao phải tắt trước khi quay')}
<div class="callout warn"><p><strong>Honesty about what was actually measured:</strong> the numbers on this slide come from a synthetic signal generated with ffmpeg to illustrate the concept — not a field recording of a specific Vietnamese apartment. Real room noise varies by AC unit, building, and street. Treat these as an example of the gap between "noise running" and "quiet," not a number to expect in every room.</p></div>
<pre><code class="language-bash">ffmpeg -f lavfi -i "anoisesrc=color=brown:amplitude=0.09:duration=10:sample_rate=48000" -ac 1 on-nen.wav
ffmpeg -i on-nen.wav -af volumedetect -f null -</code></pre>
<div class="out">Tín hiệu ồn nền (minh hoạ)  — max_volume: -22.4 dB (mean: -34.9 dB)
Phòng gần như yên tĩnh      — max_volume: -64.3 dB (mean: -69.2 dB)</div>
<p>The real lesson is not the exact numbers — it is the gap. A running air conditioner or fan sits close enough to your voice's -12…-6 dBFS target zone that it eats into the headroom meant to separate you from background noise. Before you record: turn off the AC and any fan, close windows facing the street, and if a neighbor is running karaoke, shoot at a different hour instead of fighting it in post.</p>

<h3>Windscreens and room tone</h3>
${slide('cr-09', 13, 'Chống gió & room tone 30 giây')}
<p>Wind hitting a mic capsule directly creates a low-frequency "whoomph" that is nearly impossible to remove afterward — DJI Mic 2 ships with two foam-style windscreens in the box (one per transmitter), enough for light indoor wind; riding a motorbike or shooting outdoors in real wind calls for a thicker "deadcat" (furry) windscreen instead. Separately, record <strong>30 seconds of room tone</strong> right after every scene: everyone stays silent and still, and you capture 30 seconds of that exact room's "silence." Chapters 14 and 16 use this to fill the dead gap a mid-scene cut otherwise leaves — cutting to true digital silence sounds noticeably more wrong than cutting to the room's own quiet hum.</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — trusting a level that reads "in target" while the AC is still running:</strong> your voice's peak can sit correctly at -8 dBFS while a continuous background hum sits at -22 dBFS underneath it the entire time, not just at the peak. That hum is present in literally every second of the recording, and heavy noise reduction in post to remove it usually costs you some clarity in the voice too. Fixing it before you record — turning the source off — costs nothing at all.</p></div>

<p class="note-ct"><strong>Connects to next:</strong> Lesson 9.4 is what happens once your room and mic are both clean — recording a backup track and syncing it to your picture without losing a frame of alignment.</p>

<h3>🎬 Practice (20–30 minutes)</h3>
<div class="callout ok"><ol>
<li>Run the exact &#96;volumedetect&#96; command above on any short audio file you have, and read the real &#96;max_volume&#96; line.</li>
<li>Record 10 seconds with your AC/fan on, then 10 seconds with it off, and compare by ear with headphones.</li>
<li>Record 30 seconds of room tone in the room you use most for talking-head videos, and save it somewhere you will find it again.</li>
</ol><p><strong>Done when:</strong> you can read a real &#96;max_volume&#96; number from ffmpeg output and say whether it is too quiet, in target, or clipped — without looking at this lesson again.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
<div class="kv"><span class="k">volumedetect</span><span class="v">Bộ lọc ffmpeg đọc mức đỉnh (max_volume) và mức trung bình (mean_volume) của một file âm thanh, tính bằng dBFS.</span></div>
<div class="kv"><span class="k">LUFS</span><span class="v">Thang đo độ lớn CẢM NHẬN theo chuẩn phát sóng (EBU R128) — khác dBFS, sẽ dùng kỹ ở Chương 16.</span></div>
<div class="kv"><span class="k">Room tone</span><span class="v">30 giây "im lặng" đặc trưng của đúng căn phòng, thu ngay sau cảnh, dùng lấp chỗ cắt.</span></div>
<div class="kv"><span class="k">Deadcat</span><span class="v">Lồng chống gió bằng lông dày, chắn gió mạnh tốt hơn lồng mút đi kèm máy.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Read levels from a real command (&#96;ffmpeg -af volumedetect&#96;), not a glance at a tiny on-camera meter.</li>
<li>Always confirm with headphones — meters miss muffled mics, hum, and room echo entirely.</li>
<li>Soft, irregular surfaces (curtains, closets, rugs) cut room echo fast, without a treated studio.</li>
<li>Turn off AC/fans before recording — a continuous noise floor eats headroom even when your voice peaks read "in target."</li>
<li>Windscreens (included) handle light indoor wind; a deadcat handles real outdoor/motorbike wind. Record 30s of room tone after every scene.</li>
</ul>

<div class="link-card"><a href="https://ffmpeg.org/ffmpeg-filters.html#volumedetect" target="_blank" rel="noopener">FFmpeg Filters Documentation — volumedetect and ebur128</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.3</span>
<h2>Ngừng đoán mức thu — đọc nó bằng ffmpeg</h2>
<p class="lead">Một đồng hồ mức bạn liếc qua một lần lúc đang quay gần như không đáng tin — bạn đang nhìn màn hình dưới nắng gắt, mải canh khung hình, hoặc bản thân đồng hồ chỉ là một vạch bé xíu trên màn cảm ứng 2 inch. Bài này thay việc đoán bằng ba thứ: một con số đo được thật từ một lệnh thật, tai nghe thay vì mắt, và một căn phòng đã được "trị" trước khi bạn bấm quay.</p>

<h3>Ba mức thật, đo được, không phải ước lượng</h3>
${slide('cr-09', 6, 'Đo thật bằng ffmpeg — ba mức')}
<p>Mọi con số trên slide này đến từ việc THẬT SỰ chạy ffmpeg trên một file thử thật, không phải từ một bảng thông số. Đây là lệnh chính xác và output thật của nó, để bạn chạy đúng lệnh này trên bản ghi của chính mình:</p>
<pre><code class="language-bash">ffmpeg -f lavfi -i "sine=frequency=440:duration=5:sample_rate=48000" -af "volume=-14dB" -ac 1 qua-nho.wav
ffmpeg -i qua-nho.wav -af volumedetect -f null -</code></pre>
<div class="out">[Parsed_volumedetect_0] mean_volume: -35.1 dB
[Parsed_volumedetect_0] max_volume: -32.1 dB</div>
<p>Dòng &#96;max_volume&#96; đó là đỉnh THẬT — clip thử này rơi vào <strong>-32,1dBFS</strong>, thấp hơn nhiều so với mục tiêu -12…-6dBFS, nghĩa là ghi quá nhỏ. Chạy đúng lệnh đó trên một bản to hơn của cùng tín hiệu cho ra một clip nằm trong mục tiêu, và đẩy gain mạnh vượt hẳn 0dBFS cho ra một clip vỡ tiếng rõ rệt:</p>
<div class="out">Trong mục tiêu — max_volume: -8.1 dB (mean: -11.1 dB)
Vỡ tiếng      — max_volume:  0.0 dB (mean: -0.5 dB, sóng bị "cắt phẳng")</div>
<p>Để ý mức trung bình của clip vỡ tiếng chỉ thấp hơn đỉnh chưa tới nửa dB — độ "phẳng" đó (thay vì khoảng cách ~3dB một sóng sine sạch phải có) chính là hình dạng SỐ của vỡ tiếng, không chỉ nghe thấy mà còn đo thấy.</p>

<h3>EBU R128: phép đo độ lớn cảm nhận đứng sau con số "-14 LUFS"</h3>
<p>&#96;volumedetect&#96; đọc dBFS đỉnh và trung bình; một bộ lọc ffmpeg khác, &#96;ebur128&#96;, đo độ lớn CẢM NHẬN theo thang LUFS chuẩn phát sóng (Chương 16 sẽ nói kỹ việc mix về mục tiêu khoảng -14 LUFS của YouTube — đây chỉ là công cụ đo). Chạy trên clip trong mục tiêu ở trên:</p>
<pre><code class="language-bash">ffmpeg -i trong-muc-tieu.wav -af ebur128=peak=true -f null -</code></pre>
<div class="out">Integrated loudness:
  I: -11.8 LUFS
Loudness range:
  LRA: 0.0 LU
True peak:
  Peak: -8.1 dBFS</div>

<h3>Giám sát bằng tai nghe, không phải bằng mắt</h3>
<p>Một đồng hồ mức không nói được cho bạn biết lav mic đang bí tiếng dưới lớp vải dày, có một tiếng ù điện mờ, hay phòng đang vang — chỉ có tai bạn bắt được những thứ đó. Đeo tai nghe thật (không phải loa bé xíu của máy quay) cho MỌI clip thử trước một lần quay chính thức, mỗi khi đổi mic hoặc đổi phòng.</p>

<h3>Âm học phòng: vì sao một phòng to có thể nghe tệ hơn phòng nhỏ</h3>
${slide('cr-09', 11, 'Tiếng vang phòng: cứng vs mềm')}
<p>Một phòng đầy bề mặt cứng, phẳng, song song — tường trơn, cửa kính, sàn gạch — dội âm qua lại nhiều lần trước khi tới mic, tai bạn nghe thành "tiếng vang" hoặc cảm giác rỗng, xa dù người nói đang đứng gần. Bề mặt mềm, không đều (rèm, tủ quần áo treo đầy, thảm, ghế sofa) hút bớt những phản xạ đó thay vì dội lại. Bạn không cần một phòng thu cách âm chuyên nghiệp — thu lời thoại trước một tủ quần áo mở hoặc kéo rèm lại làm tiếng gọn hẳn lên rõ rệt, và đây là một trong những cách sửa nhanh nhất bạn có sẵn ngay tại nhà.</p>

<h3>Vì sao điều hoà phải tắt (kèm số thật, ghi rõ ràng minh bạch)</h3>
${slide('cr-09', 12, 'Sàn ồn nền — vì sao phải tắt trước khi quay')}
<div class="callout warn"><p><strong>Minh bạch về thứ thật sự đã đo:</strong> số trên slide này đến từ một tín hiệu TỔNG HỢP dựng bằng ffmpeg để minh hoạ khái niệm — không phải ghi âm thực địa tại một căn hộ Việt Nam cụ thể. Tiếng ồn phòng thật khác nhau tuỳ máy lạnh, toà nhà, và con phố. Xem đây là ví dụ về khoảng cách giữa "đang ồn" và "yên tĩnh", không phải con số nên kỳ vọng ở mọi phòng.</p></div>
<pre><code class="language-bash">ffmpeg -f lavfi -i "anoisesrc=color=brown:amplitude=0.09:duration=10:sample_rate=48000" -ac 1 on-nen.wav
ffmpeg -i on-nen.wav -af volumedetect -f null -</code></pre>
<div class="out">Tín hiệu ồn nền (minh hoạ)  — max_volume: -22.4 dB (mean: -34.9 dB)
Phòng gần như yên tĩnh      — max_volume: -64.3 dB (mean: -69.2 dB)</div>
<p>Bài học thật không nằm ở con số chính xác — mà ở KHOẢNG CÁCH. Một chiếc điều hoà hay quạt đang chạy nằm đủ gần vùng mục tiêu -12…-6dBFS của giọng nói để ăn bớt khoảng lùi vốn dùng để tách bạn khỏi tiếng ồn nền. Trước khi quay: tắt điều hoà và mọi quạt, đóng cửa sổ hướng ra đường, và nếu hàng xóm đang karaoke thì đổi giờ quay thay vì cố "chiến đấu" với nó ở khâu hậu kỳ.</p>

<h3>Lồng chống gió và room tone</h3>
${slide('cr-09', 13, 'Chống gió & room tone 30 giây')}
<p>Gió thổi thẳng vào viên nang mic tạo tiếng "phù phù" tần số thấp gần như không sửa được sau khi ghi — DJI Mic 2 đi kèm 2 lồng chống gió trong hộp (một cho mỗi đầu phát), đủ cho gió nhẹ trong nhà; đi xe máy hay quay ngoài trời có gió thật thì cần thêm lồng lông dày (deadcat). Riêng biệt, hãy thu <strong>30 giây room tone</strong> ngay sau mỗi cảnh: mọi người đứng yên, không nói, và bạn có 30 giây "sự im lặng" đặc trưng của đúng căn phòng đó. Chương 14 và 16 dùng đoạn này để lấp khoảng trống một chỗ cắt giữa cảnh để lại — cắt sang im lặng số tuyệt đối nghe sai hẳn so với cắt sang đúng tiếng ồn nền quen thuộc của căn phòng.</p>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — tin một mức đọc "trong mục tiêu" trong khi điều hoà vẫn đang chạy:</strong> đỉnh giọng nói của bạn có thể vẫn đúng ở -8dBFS trong khi một tiếng ù nền liên tục nằm ở -22dBFS ngay bên dưới nó SUỐT thời gian, không chỉ lúc đỉnh. Tiếng ù đó có mặt trong từng giây của bản ghi, và khử ồn mạnh tay ở hậu kỳ để gỡ nó thường lấy đi luôn một phần độ rõ của giọng nói. Sửa nó TRƯỚC khi quay — tắt nguồn gây ồn — không tốn gì cả.</p></div>

<p class="note-ct"><strong>Nối với chương sau:</strong> Bài 9.4 là chuyện xảy ra khi phòng và mic của bạn đã sạch — ghi một track dự phòng và đồng bộ nó với hình mà không lệch mất một khung hình nào.</p>

<h3>🎬 Thực hành (20–30 phút)</h3>
<div class="callout ok"><ol>
<li>Chạy đúng lệnh &#96;volumedetect&#96; ở trên trên bất kỳ file âm thanh ngắn nào bạn có, và đọc dòng &#96;max_volume&#96; thật.</li>
<li>Thu 10 giây khi điều hoà/quạt đang bật, rồi 10 giây khi đã tắt, so sánh bằng tai nghe.</li>
<li>Thu 30 giây room tone trong căn phòng bạn hay quay talking-head nhất, lưu ở chỗ dễ tìm lại.</li>
</ol><p><strong>Đạt khi:</strong> bạn đọc được một số &#96;max_volume&#96; thật từ output ffmpeg và nói được nó quá nhỏ, trong mục tiêu, hay đã vỡ — mà không cần xem lại bài này.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">volumedetect</span><span class="v">Bộ lọc ffmpeg đọc mức đỉnh (max_volume) và mức trung bình (mean_volume) của một file âm thanh, tính bằng dBFS.</span></div>
<div class="kv"><span class="k">LUFS</span><span class="v">Thang đo độ lớn CẢM NHẬN theo chuẩn phát sóng (EBU R128) — khác dBFS, sẽ dùng kỹ ở Chương 16.</span></div>
<div class="kv"><span class="k">Room tone</span><span class="v">30 giây "im lặng" đặc trưng của đúng căn phòng, thu ngay sau cảnh, dùng lấp chỗ cắt.</span></div>
<div class="kv"><span class="k">Deadcat</span><span class="v">Lồng chống gió bằng lông dày, chắn gió mạnh tốt hơn lồng mút đi kèm máy.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đọc mức thu từ một lệnh thật (&#96;ffmpeg -af volumedetect&#96;), không phải liếc qua đồng hồ bé xíu trên máy.</li>
<li>Luôn xác nhận lại bằng tai nghe — đồng hồ mức không bắt được mic bí tiếng, tiếng ù, hay tiếng vang phòng.</li>
<li>Bề mặt mềm, không đều (rèm, tủ đồ, thảm) cắt tiếng vang phòng nhanh, không cần phòng thu chuyên nghiệp.</li>
<li>Tắt điều hoà/quạt trước khi quay — sàn ồn liên tục ăn khoảng lùi dù đỉnh giọng nói vẫn đọc "trong mục tiêu".</li>
<li>Lồng chống gió đi kèm đủ cho gió nhẹ trong nhà; deadcat cho gió ngoài trời/xe máy. Thu 30 giây room tone sau mỗi cảnh.</li>
</ul>

<div class="link-card"><a href="https://ffmpeg.org/ffmpeg-filters.html#volumedetect" target="_blank" rel="noopener">Tài liệu FFmpeg Filters — volumedetect và ebur128</a></div>
</div>
`,
    },

    /* ─────────────────── 9.4 Thu hai hệ thống & đồng bộ ─────────────────── */
    {
      title: '9.4 — Recording two systems and syncing them|||9.4 — Thu hai hệ thống và đồng bộ chúng',
      slug: 'cr-09-4-thu-hai-he-thong-dong-bo',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Vì sao ghi âm dự phòng trên thiết bị thứ hai, vỗ tay để đồng bộ, và cách DaVinci Resolve ghép khớp theo sóng âm — CapCut thì khác, đã kiểm rõ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.4</span>
<h2>Recording sound twice on purpose, and lining it back up in one move</h2>
<p class="lead">Once your mic and room are both clean, one more habit protects everything you just set up: record audio on two independent devices, not one. A dropped wireless connection, a full SD card, or an unnoticed clipped peak on one device does not have to cost you the whole take — as long as you can find the second recording and line it back up with picture in seconds, not minutes of manually dragging a waveform by eye.</p>

<h3>Two systems, one moment they both share</h3>
${slide('cr-09', 14, 'Thu hai hệ thống & đồng bộ')}
<p>The setup: Pocket 3 records its own built-in audio alongside picture, while a DJI Mic 2/3 transmitter simultaneously records a 32-bit float backup onto its own internal storage. Two completely independent files — if Pocket 3's built-in mic gets muffled by wind, or the DJI Mic's Bluetooth link drops for half a second, you likely still have one clean copy. The trade-off is that the two files start at slightly different moments (you press record on each device separately) — which is exactly what a one-clap slate solves.</p>

<h3>One clap, at the start of every take</h3>
<p>Before anyone speaks, clap your hands once in view of the camera. That clap creates a single sharp spike on both audio waveforms — the camera's built-in track and the backup recorder's track — at the same real-world instant. Editing software can then compare the two waveforms, find that matching spike, and line up the whole clip automatically, frame-accurate, without you counting frames by hand.</p>

<h3>DaVinci Resolve: a real, one-click feature for this</h3>
<p>DaVinci Resolve has a dedicated tool for exactly this: select the video and audio clips together in the Media Pool, right-click, choose <strong>Auto Sync Audio</strong>, then <strong>Based on Waveform</strong> (the other option, <strong>Based on Timecode</strong>, only helps if both devices were jam-synced to matching timecode, which your Pocket 3 + DJI Mic setup is not). Resolve compares the two waveforms — including that clap spike — and aligns them automatically. Chapter 13 covers this screen in full.</p>
<p>Even after an automatic sync, spend five seconds confirming it: zoom into the clap on the timeline and check that the two spikes land on the exact same frame. Auto-sync tools are reliable but not infallible — a corrupted section of one file, or two claps close together, can occasionally trick the algorithm, and catching that now is far cheaper than noticing it three edits later.</p>

<h3>CapCut: no equivalent one-click button — verified, not assumed</h3>
<div class="callout warn"><p><strong>Checked directly against CapCut's own guidance, not guessed:</strong> unlike Resolve, CapCut's official instructions for syncing separately-recorded audio describe a <strong>manual</strong> process — detach or mute the camera's built-in audio, drag your external audio file into the audio lane below the video track, then align it using a visible/audible reference point in both waveforms. There is no confirmed, distinctly-named one-click "sync by waveform" feature in CapCut's desktop editor to point you to. This is exactly why the clap matters even more in CapCut: it gives you an unmistakable spike to zoom in on and align by eye, since the software will not find it for you automatically.</p></div>

<h3>Name your files so they find each other</h3>
<p>A backup recording is only useful if you can find the matching pair later. Keep the audio filename tied to the same scene code as the video clip — Chapter 11 covers the full folder and naming convention, but at minimum, note the scene name and date on both files the same day you shoot, while you still remember which take is which.</p>

${slide('cr-09', 15, 'Bảng tra nhanh trước khi quay')}
<p>That table is your whole chapter in one screen — worth screenshotting for the first several shoots until the numbers stop needing a lookup.</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — forgetting the clap because "the software will figure it out":</strong> waveform-based sync works far better with an unmistakable spike to anchor on. Two clips of continuous talking with no sharp reference point can sync close but not frame-accurate, or fail to sync at all in CapCut's manual workflow. The clap costs one second per take; a failed sync costs you re-editing the whole scene by ear.</p></div>

<p class="note-ct"><strong>Connects to next:</strong> Chapter 11 turns "record twice, name consistently" into a full ingest pipeline — folder structure, checksummed copies, and the 3-2-1 backup rule for everything you shoot from here on.</p>

<h3>🎬 Practice (15 minutes)</h3>
<div class="callout ok"><ol>
<li>Record a 20-second test clip on two devices at once (phone + Pocket 3, or phone + a voice memo app as a stand-in), clapping once at the start.</li>
<li>If you have DaVinci Resolve, import both clips into one bin and try Auto Sync Audio → Based on Waveform.</li>
<li>If you only have CapCut, practice the manual method: mute one track, drag the other into the audio lane, and align by eye on the clap spike.</li>
</ol><p><strong>Done when:</strong> you can sync two independently-recorded clips using whichever editor you actually have, without needing to re-watch this lesson.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Backup recording</span><span class="v">Ghi dự phòng — một bản ghi âm độc lập thứ hai, phòng khi bản ghi chính hỏng hoặc mất kết nối.</span></div>
<div class="kv"><span class="k">Slate / clap</span><span class="v">Mốc vỗ tay đầu mỗi take — tạo một đỉnh nhọn chung trên mọi track âm thanh để đồng bộ theo.</span></div>
<div class="kv"><span class="k">Auto Sync Audio</span><span class="v">Công cụ của DaVinci Resolve tự khớp clip hình và clip âm theo sóng âm hoặc theo timecode.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Record on two independent devices — one dropped connection or clipped peak does not cost you the whole take.</li>
<li>One clap at the start of every take creates a shared spike both waveforms carry, for accurate sync later.</li>
<li>DaVinci Resolve: right-click clips in the Media Pool → Auto Sync Audio → Based on Waveform.</li>
<li>CapCut has no confirmed one-click equivalent — its official workflow is manual alignment on a visible cue.</li>
<li>Name backup audio files with the same scene code as their video clip, the same day you shoot.</li>
</ul>

<div class="link-card"><a href="https://www.blackmagicdesign.com/products/davinciresolve" target="_blank" rel="noopener">DaVinci Resolve — official product page (Blackmagic Design)</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.4</span>
<h2>Cố tình ghi âm hai lần, và ghép lại đúng khớp chỉ trong một thao tác</h2>
<p class="lead">Một khi mic và phòng đã sạch, còn một thói quen nữa bảo vệ toàn bộ công sức bạn vừa bỏ ra: ghi âm trên HAI thiết bị độc lập, không phải một. Một lần rớt kết nối không dây, một thẻ nhớ đầy, hay một đỉnh vỡ tiếng không ai để ý trên một thiết bị không nhất thiết làm hỏng cả lần quay đó — miễn là bạn tìm được bản ghi thứ hai và ghép nó khớp lại với hình trong vài giây, không phải vài phút kéo sóng âm bằng mắt.</p>

<h3>Hai hệ thống, một khoảnh khắc chung</h3>
${slide('cr-09', 14, 'Thu hai hệ thống & đồng bộ')}
<p>Cách bố trí: Pocket 3 ghi âm tích hợp của chính nó song song với hình, trong khi transmitter DJI Mic 2/3 đồng thời ghi một bản dự phòng 32-bit float vào bộ nhớ trong của chính nó. Hai file hoàn toàn độc lập — nếu mic tích hợp của Pocket 3 bị gió làm bí tiếng, hay kết nối Bluetooth của DJI Mic rớt nửa giây, bạn nhiều khả năng vẫn còn một bản sạch. Đánh đổi là hai file bắt đầu ở hai thời điểm hơi khác nhau (bạn bấm quay trên từng máy riêng) — và đây chính xác là thứ một mốc vỗ tay giải quyết.</p>

<h3>Một cái vỗ tay, đầu mỗi lần quay</h3>
<p>Trước khi ai nói gì, vỗ tay một cái trong khung hình. Cái vỗ tay đó tạo ra một đỉnh nhọn duy nhất trên cả hai sóng âm — track tích hợp của máy quay và track của máy ghi dự phòng — đúng tại cùng một khoảnh khắc thật. Phần mềm dựng sau đó so hai sóng âm, tìm đúng đỉnh nhọn khớp nhau đó, và ghép khớp cả clip tự động, chính xác tới từng khung hình, không cần bạn đếm khung bằng tay.</p>

<h3>DaVinci Resolve: một công cụ thật, một chạm, cho đúng việc này</h3>
<p>DaVinci Resolve có sẵn công cụ dành riêng cho việc này: chọn cả clip hình và clip âm trong Media Pool, nhấp chuột phải, chọn <strong>Auto Sync Audio</strong>, rồi <strong>Based on Waveform</strong> (lựa chọn còn lại, <strong>Based on Timecode</strong>, chỉ hữu ích nếu cả hai máy đã được đồng bộ timecode từ đầu, mà bộ Pocket 3 + DJI Mic của bạn thì không). Resolve so hai sóng âm — bao gồm cả đỉnh nhọn vỗ tay đó — và tự canh khớp. Chương 13 nói kỹ màn hình này.</p>
<p>Ngay cả sau khi đồng bộ tự động, hãy dành thêm năm giây để xác nhận lại: zoom vào đúng chỗ vỗ tay trên timeline và kiểm hai đỉnh nhọn có rơi đúng cùng một khung hình không. Công cụ tự động đồng bộ đáng tin nhưng không phải lúc nào cũng đúng tuyệt đối — một đoạn file bị lỗi, hay hai lần vỗ tay quá gần nhau, thỉnh thoảng vẫn đánh lừa được thuật toán, và bắt lỗi này ngay bây giờ rẻ hơn nhiều so với phát hiện ra sau ba lượt dựng nữa.</p>

<h3>CapCut: không có nút một-chạm tương đương — đã kiểm, không đoán</h3>
<div class="callout warn"><p><strong>Đã kiểm thẳng theo hướng dẫn chính thức của CapCut, không đoán:</strong> khác với Resolve, hướng dẫn chính thức của CapCut về đồng bộ âm thanh ghi riêng mô tả một quy trình THỦ CÔNG — tách hoặc tắt tiếng track âm tích hợp của máy quay, kéo file âm ngoài vào track âm bên dưới track hình, rồi tự canh khớp bằng một điểm mốc nhìn/nghe thấy được trên cả hai sóng âm. Không có một tính năng "đồng bộ theo sóng âm" một-chạm, tên gọi rõ ràng, được xác nhận trong bản dựng máy tính của CapCut để chỉ cho bạn. Đây chính xác là lý do cái vỗ tay càng quan trọng hơn khi dùng CapCut: nó cho bạn một đỉnh nhọn không lẫn vào đâu được để zoom vào và canh bằng mắt, vì phần mềm sẽ không tự tìm ra nó giúp bạn.</p></div>

<h3>Đặt tên file để chúng "tìm" được nhau</h3>
<p>Một bản ghi dự phòng chỉ có ích nếu sau này bạn tìm lại được đúng cặp của nó. Giữ tên file âm gắn với cùng mã cảnh (scene code) như clip hình — Chương 11 nói đầy đủ về cấu trúc thư mục và quy ước đặt tên, nhưng tối thiểu, ghi lại tên cảnh và ngày quay trên cả hai file ngay trong ngày quay, lúc bạn còn nhớ rõ take nào là take nào.</p>

${slide('cr-09', 15, 'Bảng tra nhanh trước khi quay')}
<p>Bảng đó là cả chương này gói trong một màn hình — đáng chụp màn hình lại cho vài buổi quay đầu tiên, tới khi những con số này không còn cần tra lại nữa.</p>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — quên vỗ tay vì nghĩ "phần mềm tự lo được":</strong> đồng bộ theo sóng âm hoạt động tốt hơn hẳn khi có một đỉnh nhọn không lẫn vào đâu để bám vào. Hai clip toàn tiếng nói liên tục, không có điểm mốc sắc nét nào, có thể khớp gần đúng nhưng không chính xác từng khung hình, hoặc không khớp được gì trong quy trình thủ công của CapCut. Vỗ tay tốn đúng một giây mỗi lần quay; đồng bộ hỏng khiến bạn phải dựng lại cả cảnh bằng tai.</p></div>

<p class="note-ct"><strong>Nối với chương sau:</strong> Chương 11 biến "ghi hai lần, đặt tên nhất quán" thành một quy trình nhập liệu đầy đủ — cấu trúc thư mục, sao chép có checksum, và luật sao lưu 3-2-1 cho mọi thứ bạn quay từ đây trở đi.</p>

<h3>🎬 Thực hành (15 phút)</h3>
<div class="callout ok"><ol>
<li>Quay thử 20 giây trên hai thiết bị cùng lúc (điện thoại + Pocket 3, hoặc điện thoại + một app ghi âm thay thế), vỗ tay một cái ngay đầu.</li>
<li>Nếu có DaVinci Resolve, đưa cả hai clip vào một bin và thử Auto Sync Audio → Based on Waveform.</li>
<li>Nếu chỉ có CapCut, luyện cách thủ công: tắt tiếng một track, kéo track kia vào audio lane, canh bằng mắt theo đỉnh nhọn vỗ tay.</li>
</ol><p><strong>Đạt khi:</strong> bạn đồng bộ được hai clip ghi độc lập bằng đúng phần mềm bạn đang có, không cần xem lại bài này.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Backup recording</span><span class="v">Ghi dự phòng — một bản ghi âm độc lập thứ hai, phòng khi bản ghi chính hỏng hoặc mất kết nối.</span></div>
<div class="kv"><span class="k">Slate / clap</span><span class="v">Mốc vỗ tay đầu mỗi take — tạo một đỉnh nhọn chung trên mọi track âm thanh để đồng bộ theo.</span></div>
<div class="kv"><span class="k">Auto Sync Audio</span><span class="v">Công cụ của DaVinci Resolve tự khớp clip hình và clip âm theo sóng âm hoặc theo timecode.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Ghi trên hai thiết bị độc lập — một lần rớt kết nối hay vỡ đỉnh không làm hỏng cả lần quay.</li>
<li>Một cái vỗ tay đầu mỗi take tạo một đỉnh nhọn chung trên cả hai sóng âm, để đồng bộ chính xác sau này.</li>
<li>DaVinci Resolve: nhấp phải clip trong Media Pool → Auto Sync Audio → Based on Waveform.</li>
<li>CapCut không có nút một-chạm tương đương đã xác nhận — quy trình chính thức là canh thủ công theo một mốc nhìn thấy được.</li>
<li>Đặt tên file âm dự phòng theo cùng mã cảnh với clip hình, ngay trong ngày quay.</li>
</ul>

<div class="link-card"><a href="https://www.blackmagicdesign.com/products/davinciresolve" target="_blank" rel="noopener">DaVinci Resolve — trang sản phẩm chính thức (Blackmagic Design)</a></div>
</div>
`,
    },

    /* ─────────────────── 9.5 Kiểm tra chương ─────────────────── */
    {
      title: '9.5 — Chapter 9 check|||9.5 — Kiểm tra chương 9',
      slug: 'cr-09-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Tóm tắt chương 9 + checklist tự kiểm, và 10 câu hỏi tình huống về mức thu, micro, phòng và đồng bộ hai hệ thống.',
      content: `<div class="ml-en">
<h2>📌 Chapter 9 summary</h2>
<p>Sound is the one thing viewers forgive least. Four numbers run through this whole chapter: 48kHz sample rate, 24-bit (or 32-bit float when your device supports it), and a peak target of -12…-6 dBFS that you measure with ffmpeg instead of guessing. 32-bit float is real insurance against gain mistakes made later — not a reason to stop watching levels, since it cannot undo distortion that already happened in the analog microphone/preamp stage. Five mic types cover almost everything you will shoot: built-in, lav (~15-20cm, thick single-layer fabric), wireless DJI Mic 2/3 (linked to Pocket 3 via OsmoAudio, no receiver needed), shotgun, and USB. A quiet room with soft surfaces beats an expensive mic in a hard-walled one; turning off the AC before you record does more than any plugin after the fact. Record a backup on a second device, clap once at the start of every take, and DaVinci Resolve Auto Sync Audio → Based on Waveform lines it all up automatically — CapCut official workflow for the same job is manual.</p>
<h3>Self-check before your next shoot</h3>
<div class="callout ok"><ul>
<li>☐ I can state the peak target range (-12…-6 dBFS) without checking this lesson.</li>
<li>☐ I know which of the five mic types I am using for my next shoot, and why.</li>
<li>☐ My lav mic (if I have one) is clipped to a single thick layer of fabric, ~15-20cm from my mouth.</li>
<li>☐ I turned off the AC/fan and tested 10 seconds before recording, listening back with headphones.</li>
<li>☐ I recorded 30 seconds of room tone after my last scene.</li>
<li>☐ If recording on two devices, I clapped once at the start of every take.</li>
</ul></div>
</div>
<div class="ml-vi">
<h2>📌 Tóm tắt Chương 9</h2>
<p>Âm thanh là thứ người xem tha thứ ít nhất. Bốn con số chạy xuyên suốt chương này: tần số mẫu 48kHz, 24-bit (hoặc 32-bit float nếu máy hỗ trợ), và mục tiêu đỉnh -12…-6dBFS mà bạn ĐO bằng ffmpeg thay vì đoán. 32-bit float là bảo hiểm thật cho lỗi chỉnh gain SAU này — không phải lý do để ngừng canh mức, vì nó không gỡ được méo tiếng đã xảy ra ở khâu micro/preamp analog. Năm loại micro phủ gần hết mọi thứ bạn sẽ quay: tích hợp, lav (~15-20cm, một lớp vải dày), không dây DJI Mic 2/3 (link Pocket 3 qua OsmoAudio, không cần receiver), shotgun, và USB. Một phòng yên tĩnh với bề mặt mềm thắng một mic đắt tiền trong phòng tường cứng; tắt điều hoà trước khi quay có tác dụng hơn bất kỳ plugin hậu kỳ nào. Ghi dự phòng trên thiết bị thứ hai, vỗ tay một cái đầu mỗi take, và Auto Sync Audio → Based on Waveform của DaVinci Resolve tự ghép khớp hết — quy trình chính thức của CapCut cho cùng việc đó là thủ công.</p>
<h3>Tự kiểm trước buổi quay tiếp theo</h3>
<div class="callout ok"><ul>
<li>☐ Tôi nói được khoảng đỉnh mục tiêu (-12…-6dBFS) mà không cần xem lại bài.</li>
<li>☐ Tôi biết mình dùng loại nào trong năm loại micro cho buổi quay tiếp theo, và vì sao.</li>
<li>☐ Lav mic (nếu có) đang kẹp trên một lớp vải dày, cách miệng ~15-20cm.</li>
<li>☐ Tôi đã tắt điều hoà/quạt và thử 10 giây trước khi quay, nghe lại bằng tai nghe.</li>
<li>☐ Tôi đã thu 30 giây room tone sau cảnh vừa quay xong.</li>
<li>☐ Nếu quay hai thiết bị, tôi đã vỗ tay một cái đầu mỗi take.</li>
</ul></div>
</div>`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'You check playback and your voice peaks hover around -3dBFS, occasionally touching 0. What should you do?|||Bạn xem lại và thấy đỉnh giọng nói dao động quanh -3dBFS, thỉnh thoảng chạm 0. Bạn nên làm gì?',
            options: [
              'It is fine — closer to 0dBFS sounds clearer|||Không sao, càng gần 0dBFS nghe càng to rõ',
              'Lower the input gain so peaks sit around -12…-6dBFS|||Hạ gain đầu vào để đỉnh nằm trong khoảng -12…-6dBFS',
              'Switch to 32-bit float and stop worrying about gain|||Bật 32-bit float rồi khỏi cần canh gain nữa',
              'Raise the gain further to make sure it is audible|||Tăng thêm gain để chắc chắn nghe rõ',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: -3dBFS leaves almost no headroom before the hard 0dBFS ceiling, and touching 0 means it is already clipping sometimes. Lowering input gain to land peaks in the -12…-6dBFS target restores headroom. 32-bit float only protects you from clipping the FILE after you turn gain down in post — it does nothing to prevent the analog overload that may already be happening at these hot levels, so it is not a substitute for correct gain staging.|||VI: -3dBFS gần như không còn khoảng lùi trước trần cứng 0dBFS, và chạm 0 nghĩa là đã vỡ tiếng vài lần. Hạ gain đầu vào để đỉnh rơi vào mục tiêu -12…-6dBFS mới lấy lại được khoảng lùi. 32-bit float chỉ bảo vệ FILE khỏi vỡ khi bạn hạ gain ở hậu kỳ — nó không ngăn được quá tải analog có thể đã xảy ra ngay ở mức nóng này, nên không thay thế được việc canh gain đúng.',
          },
          {
            question: 'You scream right into a phone built-in mic while testing it, even though it is recording 32-bit float — the file still sounds crackly and distorted. Why?|||Bạn hét thẳng vào mic built-in của điện thoại lúc thử, dù máy đang ghi 32-bit float — file vẫn nghe rè, méo tiếng. Vì sao?',
            options: [
              'The overload happened in the analog mic/preamp stage, before digitizing — 32-bit float only protects the digital side|||Quá tải xảy ra ở khâu micro/preamp analog, trước khi số hoá — 32-bit float chỉ bảo vệ khâu số',
              '32-bit float files are inherently more distorted than 24-bit ones|||File 32-bit float vốn dĩ luôn méo hơn 24-bit',
              'The sample rate was set wrong|||Do sai tần số lấy mẫu',
              'Safety Track was not enabled|||Do chưa bật Safety Track',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: 32-bit float only protects the digital side of the recording, after the analog-to-digital converter. If the microphone capsule or its preamp is already overloaded by the sound pressure hitting it — as a scream at point-blank range can do — that distortion is baked in before any bits exist, and no file format can undo it afterward.|||VI: 32-bit float chỉ bảo vệ khâu số của bản ghi, sau bộ chuyển đổi tương tự-sang-số. Nếu viên nang micro hoặc preamp của nó đã quá tải vì áp suất âm thanh đập vào — như một tiếng hét ở cự ly sát mic — méo tiếng đó đã "đóng khung" trước khi có bit nào tồn tại, và không định dạng file nào gỡ lại được sau đó.',
          },
          {
            question: 'Your music-recording software defaults to 44.1kHz, but this course tells you to shoot video at 48kHz. Why the difference?|||Phần mềm thu nhạc của bạn mặc định 44,1kHz, nhưng khoá học lại bảo quay video ở 48kHz. Vì sao khác nhau?',
            options: [
              '48kHz is video production standard (44.1kHz is music production standard); your gear defaults to it for clean audio-video sync|||48kHz là chuẩn của sản xuất video (44,1kHz là chuẩn của sản xuất nhạc); đồ nghề của bạn mặc định vậy để đồng bộ hình-tiếng sạch',
              '44.1kHz always sounds better, the camera should be changed to match it|||44,1kHz luôn nghe hay hơn, nên đổi máy quay theo nó',
              'There is no real difference, it is just a habit|||Không có khác biệt thật, chỉ là thói quen',
              '48kHz only matters for 4K, 1080p can use 44.1kHz|||48kHz chỉ cần khi quay 4K, quay 1080p thì 44,1kHz cũng được',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: 44.1kHz is the decades-old CD/music-production standard; 48kHz is video production own standard, and every device in your kit (Pocket 3, iPhone, DJI Mic 2/3) defaults to it. Starting everything at 48kHz avoids an extra sample-rate conversion when you sync multiple recordings together in Lesson 9.4.|||VI: 44,1kHz là chuẩn CD/sản xuất nhạc có từ nhiều thập kỷ; 48kHz là chuẩn riêng của sản xuất video, và mọi thiết bị trong đồ nghề của bạn (Pocket 3, iPhone, DJI Mic 2/3) đều mặc định vậy. Bắt đầu mọi thứ ở 48kHz tránh được một bước chuyển đổi tần số mẫu thừa khi bạn đồng bộ nhiều bản ghi lại với nhau ở Bài 9.4.',
          },
          {
            question: 'You own a DJI Mic 2 and want to use it with Pocket 3 without carrying a separate receiver. What is the correct way?|||Bạn có DJI Mic 2, muốn dùng với Pocket 3 mà không mang thêm receiver. Cách nào đúng?',
            options: [
              'Not possible — Mic 2 always needs a wired receiver|||Không thể — Mic 2 luôn cần receiver có dây',
              'Plug a receiver into Pocket 3 USB-C port first|||Phải cắm receiver vào cổng USB-C của Pocket 3 trước',
              'Control Center → Wireless Microphone → TX1/TX2 — the transmitter links straight over Bluetooth via OsmoAudio, no receiver needed|||Control Center → Wireless Microphone → chọn TX1/TX2 — transmitter link thẳng Bluetooth qua OsmoAudio, không cần receiver',
              'Only Mic 3 can do this, not Mic 2|||Chỉ Mic 3 làm được việc này, Mic 2 thì không',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: DJI OsmoAudio ecosystem lets a Mic 2 or Mic 3 transmitter link directly to Pocket 3 over Bluetooth — open Control Center → Wireless Microphone and select TX1/TX2, exactly as Chapter 6 walked through. No receiver is required for this connection.|||VI: Hệ sinh thái OsmoAudio của DJI cho phép transmitter Mic 2 hoặc Mic 3 link thẳng vào Pocket 3 qua Bluetooth — mở Control Center → Wireless Microphone rồi chọn TX1/TX2, đúng như Chương 6 đã hướng dẫn. Kết nối này không cần receiver.',
          },
          {
            question: 'You have linked a DJI Mic 2 transmitter straight to Pocket 3 over OsmoAudio, with no receiver, and want to plug in headphones to monitor live. Can you?|||Bạn link thẳng transmitter DJI Mic 2 vào Pocket 3 qua OsmoAudio, không dùng receiver, và muốn cắm tai nghe để nghe trực tiếp. Được không?',
            options: [
              'Yes — plug headphones straight into the transmitter|||Được, cắm thẳng vào transmitter',
              'No — the 3.5mm headphone jack only exists on the receiver; a direct transmitter link has no such port|||Không được — cổng tai nghe 3.5mm chỉ có trên receiver; link thẳng transmitter thì không có cổng này',
              'Yes, but headphones must be paired over Bluetooth first|||Được, nhưng phải ghép tai nghe qua Bluetooth trước',
              'Yes, through Pocket 3 USB-C port|||Được, qua cổng USB-C của Pocket 3',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: DJI 3.5mm headphone monitoring port lives on the receiver unit, not the transmitter. A direct transmitter-to-Pocket-3 link skips the receiver entirely, so there is nowhere to plug headphones in for that specific mic; you monitor through Pocket 3 own screen instead.|||VI: Cổng tai nghe theo dõi 3.5mm của DJI nằm trên chính RECEIVER, không phải transmitter. Link thẳng transmitter vào Pocket 3 bỏ qua hoàn toàn receiver, nên không có chỗ nào cắm tai nghe cho riêng mic đó; bạn giám sát qua màn hình của chính Pocket 3 thay vào đó.',
          },
          {
            question: 'You recorded video in Mono on your iPhone 16 Pro Max, then open Photos wanting to use the Cinematic Audio Mix mode, but do not see the option. Why?|||Bạn quay video ở chế độ Mono trên iPhone 16 Pro Max, mở app Ảnh muốn dùng Audio Mix Cinematic nhưng không thấy tuỳ chọn. Vì sao?',
            options: [
              'An iOS update is needed to unlock the option|||Phải cập nhật iOS mới thấy được tuỳ chọn này',
              'Audio Mix only applies to photos, not video|||Audio Mix chỉ áp dụng cho ảnh, không áp dụng cho video',
              'ProRes must be turned on first for Audio Mix to appear|||Phải bật ProRes thì Audio Mix mới hiện ra',
              'Audio Mix only works on video recorded in Spatial Audio — Mono recordings do not have it|||Audio Mix chỉ dùng được với video quay ở Spatial Audio — quay Mono thì không có Audio Mix',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Audio Mix (Standard/In-Frame/Studio/Cinematic) only becomes available on video recorded with Spatial Audio — the default sound-recording mode on iPhone 16 and later. A Mono recording never unlocks it, regardless of iOS version or other settings.|||VI: Audio Mix (Standard/In-Frame/Studio/Cinematic) chỉ xuất hiện với video quay ở Spatial Audio — chế độ thu âm mặc định trên iPhone 16 trở lên. Video quay ở Mono không bao giờ mở khoá được tính năng này, bất kể phiên bản iOS hay cài đặt khác.',
          },
          {
            question: 'Your lav mic is clipped under a windbreaker jacket over a thin t-shirt — playback sounds muffled, with the high frequencies missing. What is the fix?|||Lav mic đang kẹp dưới áo khoác gió, bên ngoài áo thun mỏng — nghe lại thấy bí tiếng, mất các âm cao. Cách sửa?',
            options: [
              'Re-clip it onto a single thick layer of fabric, capsule pointed up, with nothing covering it from above|||Kẹp lại trên một lớp vải DÀY, đầu mic hướng lên, không để gì che phía trên',
              'That is normal — lav mics naturally sound bassier than other mics|||Bình thường, lav mic vốn nghe trầm hơn mic thường',
              'Raise the recording gain to compensate for the lost highs|||Tăng gain thu để bù lại phần âm cao bị mất',
              'Switch to a USB mic, which solves the fabric problem|||Đổi sang mic USB sẽ giải quyết được vấn đề vải che',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Thin or double-layered fabric muffles sound and steals the high-frequency detail that makes speech intelligible. Re-clip the mic onto a single layer of thick fabric (a shirt or jacket, not both), capsule pointed up and not covered from above.|||VI: Vải mỏng hoặc hai lớp làm bí tiếng và mất chi tiết âm cao vốn giúp lời nói rõ ràng. Kẹp lại mic trên MỘT lớp vải dày (áo sơ mi hoặc áo khoác, không phải cả hai), đầu mic hướng lên và không bị che từ phía trên.',
          },
          {
            question: 'After editing, you cut out a stumbled word in the middle of a scene, and the resulting silent gap sounds noticeably "off" compared to the rest of the same scene. What is missing?|||Sau khi dựng, bạn cắt một từ nói vấp giữa cảnh, và khoảng trống im lặng để lại nghe khác hẳn phần còn lại của cùng cảnh đó. Bạn đang thiếu gì?',
            options: [
              'Add background music to mask the gap|||Nên thêm nhạc nền để che khoảng trống',
              'It does not matter — viewers will not notice such a short gap|||Không sao, người xem không để ý những đoạn ngắn như vậy',
              'Fill the gap with room tone — 30 seconds of that exact room own quiet, recorded right after the scene|||Chèn room tone vào chỗ cắt — 30 giây "im lặng" đặc trưng của đúng căn phòng đó, thu ngay sau cảnh',
              'The whole scene needs to be re-shot|||Cần thu lại toàn bộ cảnh đó',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: True digital silence sounds noticeably different from a room own natural quiet (its faint hum, hiss, or ambience). Filling the gap with 30 seconds of room tone recorded in that same room right after the scene keeps the cut inaudible.|||VI: Im lặng số tuyệt đối nghe khác hẳn sự yên tĩnh tự nhiên của một căn phòng (tiếng ù, hiss, hay tiếng nền mờ của nó). Lấp khoảng trống bằng 30 giây room tone thu trong chính căn phòng đó, ngay sau cảnh, giữ cho chỗ cắt không bị lộ ra.',
          },
          {
            question: 'You shot on two devices (Pocket 3 plus a DJI Mic backup) and are editing in CapCut on a computer. You look for a one-click "sync by waveform" button like DaVinci Resolve has, but cannot find one. What is going on?|||Bạn quay hai thiết bị (Pocket 3 + ghi dự phòng DJI Mic) và đang dựng bằng CapCut trên máy tính. Bạn tìm một nút "đồng bộ theo sóng âm" một-chạm giống DaVinci Resolve nhưng không thấy. Chuyện gì đang xảy ra?',
            options: [
              'CapCut just hides the feature inside the "AI Tools" menu — look harder|||CapCut chỉ ẩn tính năng này trong menu "AI Tools", chỉ cần tìm kỹ hơn',
              'Convert the files to .mov first and the button will appear|||Phải chuyển file sang định dạng .mov trước thì nút mới hiện ra',
              'Only the paid version of CapCut has this feature|||Chỉ bản CapCut trả phí mới có tính năng này',
              'CapCut has no confirmed one-click equivalent — its official method is manual: detach the audio, drag it into its own lane, and align on a clear reference point, which is exactly why a clap at the start of every take still matters|||CapCut không có một nút tự động tương đương đã xác nhận — cách chính thức là tách/kéo audio vào track riêng rồi tự canh theo một mốc rõ ràng, đó chính là lý do luôn phải vỗ tay đầu mỗi take',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Checked directly against CapCut own instructions: there is no confirmed, distinctly-named one-click waveform-sync feature in its desktop editor. The official method is manual — detach the camera audio, drag the external track into its own lane, and align by eye on a clear shared reference point. This is exactly why clapping once at the start of every take matters, regardless of which editor ends up being used.|||VI: Đã kiểm thẳng theo hướng dẫn của chính CapCut: không có một tính năng đồng bộ theo sóng âm một-chạm, tên gọi rõ ràng, được xác nhận trong bản dựng máy tính của họ. Cách chính thức là thủ công — tách audio máy quay ra, kéo track ngoài vào lane riêng, rồi canh bằng mắt theo một mốc chung rõ ràng. Đây chính xác là lý do vỗ tay một cái đầu mỗi take luôn quan trọng, bất kể cuối cùng dùng phần mềm dựng nào.',
          },
          {
            question: 'You film a vlog while riding a motorbike, using the exact windscreen that came in the DJI Mic 2 box, and still hear a loud "whoomph" sound. Why, and what should you do?|||Bạn quay vlog trong lúc chạy xe máy, dùng đúng lồng chống gió đi kèm trong hộp DJI Mic 2, mà vẫn nghe tiếng "phù phù" to. Vì sao, và nên làm gì?',
            options: [
              'The windscreen must be broken — time for a new mic|||Lồng chống gió bị hỏng, cần đổi mic mới',
              'Motorbike wind is far stronger than the light indoor wind the included windscreen is designed for — add a thicker furry deadcat for strong wind|||Gió khi đi xe máy mạnh hơn nhiều so với gió nhẹ trong nhà mà lồng đi kèm được làm để chắn — cần dùng thêm lồng lông dày (deadcat) cho gió mạnh',
              'Turn off wind protection on the device entirely|||Nên tắt hẳn tính năng chống gió trên máy',
              'This is simply an unfixable limitation of wireless mics|||Đây là giới hạn không sửa được của mic không dây',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Wind from riding a motorbike is far stronger than the light indoor wind the included windscreen is designed to handle. A thicker, furry "deadcat" windscreen (bought separately) is built for exactly this kind of strong outdoor wind.|||VI: Gió khi chạy xe máy mạnh hơn nhiều so với gió nhẹ trong nhà mà lồng chống gió đi kèm được thiết kế để chắn. Một lồng lông dày hơn, "deadcat" (mua thêm), mới được làm ra cho đúng kiểu gió mạnh ngoài trời này.',
          },
        ],
      },
    },
  ],
};
