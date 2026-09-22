/**
 * Content Creator — Chương 6: Cài đặt đồ nghề của bạn. Song ngữ EN/VI (.ml-en / .ml-vi).
 * ⚠️ KHÔNG backtick trần trong content (dùng &#96;); `${` trong mã mẫu viết \${ ; gạch chéo ngược viết \\
 *
 * Nguồn số liệu chính (xem đầy đủ trong báo cáo bàn giao):
 *  - DJI Osmo Pocket 3: dji.com/osmo-pocket-3/specs · User Manual v1.0 (dl.djicdn.com)
 *  - iPhone 16 Pro Max: support.apple.com/en-us/121032 (tech specs) · /en-us/109041 (ProRes)
 *    · /guide/iphone/iphc1827d32f (cài đặt quay video) · /guide/iphone/iph2cafe2ebc (HDR)
 *  - Blackmagic Camera app: blackmagicdesign.com/products/blackmagiccamera
 *  - DaVinci Resolve trên Linux: wiki.archlinux.org/title/DaVinci_Resolve
 *  - DJI Mic 3 / OsmoAudio: dji.com/mic-3/faq · Apple Creator Studio, FCP, iPad Pro M5,
 *    Continuity Camera, M1 Max Media Engine: apple.com (newsroom + support)
 */
import { gallery, slide } from './_slides.mjs';

export default {
  title: 'Chapter 6 — Setting up your gear|||Chương 6 — Cài đặt đồ nghề của bạn',
  description: 'Cài đúng DJI Osmo Pocket 3, iPhone 16 Pro Max, iPad Pro M5, Mac M1 Max và máy Linux ở nhà trước khi bấm quay — kèm cách quản lý thẻ nhớ, pin và dung lượng để không tràn thẻ giữa buổi.',
  lessons: [
    /* ─────────────────── 6.0 slide bài giảng ─────────────────── */
    {
      title: '6.0 — Chapter 6 in 15 slides|||6.0 — Chương 6 trong 15 slide',
      slug: 'cr-06-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Toàn bộ chương 6 gói trong 15 slide: cài đặt Pocket 3 theo tình huống, Settings của iPhone, Blackmagic Camera, vai trò iPad/Mac/Linux, và bảng dung lượng để không tràn thẻ.',
      content: `
<div class="ml-en"><h2>📑 Chapter 6 in 15 slides</h2>
<p>You already own every device in this chapter — a Pocket 3, an iPhone 16 Pro Max, an iPad Pro M5, a Mac M1 Max, and a Linux machine at home. This chapter does not tell you what to buy; it tells you exactly which menu to open and which value to set.</p>
<p>Skim these 15 slides before reading the lessons below, then come back to slide 5 (Pocket 3 presets), slide 8 (iPhone settings) and slide 13 (storage) whenever you forget a number mid-shoot.</p></div>
<div class="ml-vi"><h2>📑 Chương 6 trong 15 slide</h2>
<p>Bạn đã có sẵn mọi máy trong chương này — Pocket 3, iPhone 16 Pro Max, iPad Pro M5, Mac M1 Max, và một máy Linux ở nhà. Chương này không khuyên bạn mua gì thêm; nó chỉ đúng menu cần mở và đúng giá trị cần đặt.</p>
<p>Lướt qua 15 slide này trước khi đọc các bài dưới, rồi quay lại slide 5 (preset Pocket 3), slide 8 (cài đặt iPhone) và slide 13 (dung lượng) mỗi khi quên số giữa buổi quay.</p></div>
${gallery('cr-06', [
  [1, 'Bìa chương'],
  [2, 'Bản đồ chương — 5 máy + thẻ nhớ'],
  [3, 'Vai trò từng máy'],
  [4, 'Pocket 3 — đọc màn hình cài đặt'],
  [5, 'Pocket 3 — preset theo tình huống'],
  [6, 'Pocket 3 — ba chế độ gimbal'],
  [7, 'Pocket 3 — mic tích hợp và mic rời'],
  [8, 'iPhone 16 Pro Max — Settings › Camera'],
  [9, 'Góc nhìn: Pocket 3 và ba ống kính iPhone'],
  [10, 'Blackmagic Camera — app quay tay trên iPhone'],
  [11, 'Từ máy quay tới bản dựng cuối'],
  [12, 'Phần mềm dựng — máy nào dùng app nào'],
  [13, 'Một giờ quay nặng bao nhiêu GB?'],
  [14, 'Thẻ nhớ · pin · nhiệt — checklist'],
  [15, 'Thực hành'],
])}
`,
    },

    /* ─────────────────── 6.1 Pocket 3 ─────────────────── */
    {
      title: '6.1 — Osmo Pocket 3: four numbers before every shot|||6.1 — Osmo Pocket 3: bốn con số trước mọi cảnh',
      slug: 'cr-06-1-pocket-3',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Đọc đúng màn hình cài đặt Pocket 3, bộ preset theo 5 tình huống hay gặp, ba chế độ gimbal, và khi nào dùng mic tích hợp hay mic rời.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>Osmo Pocket 3: the four numbers you set before every shot</h2>
<p class="lead">Leaving Pocket 3 on Auto and hitting record is how you end up with footage that looks fine on the little screen and wrong on every other screen — banding under office lights, a blown-out sky at noon, footage that will not cut with your iPhone clips. Four settings decide almost all of that: resolution+fps, shutter speed, color mode, and gimbal mode. This lesson gives you a preset for each situation you will actually run into, not a theory lecture.</p>

<h3>Resolution, fps, and the one fact that changes everything in Vietnam</h3>
<p>Pocket 3's 1-inch sensor shoots Normal video at 4K, 2.7K and 1080p, each at 24/25/30/48/50/60 fps, plus Slow Motion at 4K120, 2.7K120, and 1080p up to 240fps. Rotate the touchscreen 90° and it reframes to 9:16 for TikTok/Reels without cropping later.</p>
<div class="callout warn"><p><strong>The one number that matters more than any other in Vietnam:</strong> mains power here runs at <strong>50 Hz</strong>. Fluorescent and LED lights flicker at twice that, 100 times a second. If your shutter speed (tốc độ màn trập — how long the sensor collects light per frame) does not line up with that rhythm, you get rolling dark bands across indoor footage. The fix is boring but absolute: shoot <strong>25 or 50 fps</strong>, not 24/30/60, and set shutter to <strong>1/50</strong> (or 1/100 if 1/50 still shows a faint band).</p></div>
${slide('cr-06', 4, 'Đọc màn hình cài đặt Pocket 3')}
<p>Swipe left on the touchscreen to open image settings, tap <strong>PRO</strong>, and you get manual control over Exposure (Auto/M), White Balance (AWB/M), Focus Mode, and — in Video mode only — Image Adjustment and Glamour Effects. Everything on the HUD above reads left to right: resolution+fps, color mode, shutter, ISO, white balance.</p>

<h3>Five presets — pick one, stop re-deciding every time</h3>
<p>You do not need to reason through the exposure triangle before every clip. Save these as your five presets (Pocket 3 keeps up to five in Custom Mode) and just pick the situation:</p>
${slide('cr-06', 5, 'Bảng preset Pocket 3 theo tình huống')}
<div class="callout ok"><p><strong>When to use D-Log M (and when not to):</strong> D-Log M is Pocket 3's 10-bit flat color profile — wider dynamic range, designed for color grading afterward. Only shoot it if you are actually going to grade in Chapter 15. Straight out of the camera, D-Log M footage looks washed out and grey; if you post it without grading, Normal color mode looks better to every viewer who is not you. (Pocket 3 also offers a third mode, <strong>HLG</strong> — wider dynamic range than Normal but, unlike D-Log M, meant to look acceptable straight out of camera on an HLG-compatible screen. Treat it as a middle ground you will rarely need in this course; default to Normal or D-Log M.)</p></div>

<h3>Three gimbal modes — the camera moves differently in each</h3>
<p>Pocket 3's three-axis mechanical gimbal is the whole reason it beats a phone on a stick for walking shots. Swipe down → tap the gimbal icon to switch modes:</p>
${slide('cr-06', 6, 'Ba chế độ gimbal của Pocket 3')}
<p>Follow is the right default for nearly everything, including this course's talking-head lessons. Save FPV for a specific creative reason — it is the mode with the least stabilization, not the "advanced" mode.</p>

<h3>Sound: the built-in mics, and when to plug in more</h3>
${slide('cr-06', 7, 'Mic tích hợp và mic rời của Pocket 3')}
<p>The three-mic array on the body is enough for casual vlogging in a quiet room. Two things worth knowing: <strong>Wind Noise Reduction</strong> only touches the built-in mics — it does nothing once an external mic is connected. And Pocket 3 links to a <strong>DJI Mic 2 or Mic 3</strong> transmitter directly over Bluetooth with no receiver needed (DJI calls this OsmoAudio) — Control Center → Wireless Microphone → TX1/TX2. The original DJI Mic (no number) instead plugs into the USB-C port through the bundled adapter as a wired receiver, not Bluetooth.</p>

<h3>Two apps, two jobs</h3>
<p><strong>DJI Mimo</strong> is for the camera itself: firmware updates, transferring and reviewing footage, live view, and its Academy tutorials. <strong>LightCut</strong> is DJI's separate, official AI-assisted quick-edit app — one-tap templates and music for turning raw clips into a short video fast. Neither replaces the editing you will do in DaVinci Resolve or CapCut later in this course; they are for the same-day social post, not the finished piece.</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — recording one 20–30 minute take instead of separate shots:</strong> if you have been hitting record and letting Pocket 3 run continuously "to not miss anything," that habit is what fills a card mid-shoot and turns editing into scrubbing through half an hour to find 90 usable seconds. A saved Custom Mode preset removes the excuse of "I didn't want to stop and change settings" — tap once, shoot the shot, stop, move to the next shot. Chapter 4 covers shot lists in depth; this chapter just removes the technical friction that makes shooting-in-pieces feel slower than it is.</p></div>

<p class="note-ct"><strong>Connects to next:</strong> Chapter 7 builds framing and composition on top of these gimbal modes, and Chapter 15 is exactly where D-Log M footage gets graded back to normal-looking color.</p>

<h3>🎬 Practice (15–20 minutes)</h3>
<div class="callout ok"><ol>
<li>Open Pocket 3's Control Center and find Anti-Flicker, Video Compression, and Gimbal Mode without looking at this lesson again.</li>
<li>Set the "talking head indoors" preset from the table above and record a 20-second test clip of yourself.</li>
<li>Play it back and look for flicker bands. If you still see them, try 1/100 instead of 1/50.</li>
<li>Save the working preset into one of the five Custom Mode slots.</li>
</ol><p><strong>Done when:</strong> you can recall a saved preset in one tap, with no visible flicker in the footage.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Shutter speed</span><span class="v">Tốc độ màn trập — how long each frame collects light. Shorter = darker, sharper motion; longer = brighter, more motion blur.</span></div>
<div class="kv"><span class="k">D-Log M</span><span class="v">Pocket 3's flat, 10-bit color profile for grading later. Looks grey unloaded; do not publish it un-graded.</span></div>
<div class="kv"><span class="k">Gimbal</span><span class="v">Bộ ổn định cơ 3 trục — the motorized rig that keeps the camera level while you walk.</span></div>
<div class="kv"><span class="k">Anti-flicker</span><span class="v">Chống nhấp nháy — a setting that times the shutter to your local mains frequency (50 Hz in Vietnam) to kill banding under artificial light.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>In Vietnam, default to 25 or 50 fps with a 1/50 (or 1/100) shutter under any artificial light.</li>
<li>Five real-world presets beat re-deciding exposure every time you press record.</li>
<li>Follow is the default gimbal mode; Tilt Locked and FPV are for specific shots, not everyday use.</li>
<li>DJI Mic 2/3 link over Bluetooth with no receiver; the original DJI Mic needs the USB-C adapter.</li>
<li>D-Log M is a promise to grade later — keep that promise or shoot Normal instead.</li>
</ul>

<div class="link-card"><a href="https://www.dji.com/osmo-pocket-3/specs" target="_blank" rel="noopener">DJI Osmo Pocket 3 — official specs page</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Osmo Pocket 3: bốn con số bạn chỉnh trước mọi cảnh</h2>
<p class="lead">Để Pocket 3 ở Auto rồi bấm quay là cách chắc chắn nhất để có cảnh nhìn ổn trên màn hình bé xíu của máy nhưng sai trên mọi màn hình khác — sọc nhấp nháy dưới đèn văn phòng, trời trưa cháy trắng, cảnh không khớp màu với clip quay bằng iPhone. Bốn cài đặt quyết định gần hết chuyện đó: độ phân giải+fps, tốc độ màn trập, chế độ màu, và chế độ gimbal. Bài này cho bạn một preset cho từng tình huống thật sẽ gặp, không phải một bài giảng lý thuyết.</p>

<h3>Độ phân giải, fps, và một sự thật đổi hết mọi thứ ở Việt Nam</h3>
<p>Cảm biến 1 inch của Pocket 3 quay Normal Video ở 4K, 2.7K và 1080p, mỗi độ phân giải có 24/25/30/48/50/60fps, cộng thêm Slow Motion ở 4K120, 2.7K120, và 1080p tới 240fps. Xoay màn hình cảm ứng 90° là máy tự đổi khung sang dọc 9:16 cho TikTok/Reels, không cần cắt lại sau.</p>
<div class="callout warn"><p><strong>Con số quan trọng hơn mọi con số khác ở Việt Nam:</strong> điện lưới ở đây chạy ở <strong>50Hz</strong>. Đèn huỳnh quang và đèn LED nhấp nháy ở gấp đôi tần số đó — 100 lần mỗi giây. Nếu tốc độ màn trập (khoảng thời gian cảm biến thu sáng cho mỗi khung hình) không khớp nhịp đó, bạn sẽ thấy các dải tối chạy ngang qua cảnh quay trong nhà. Cách sửa nhàm chán nhưng luôn đúng: quay <strong>25 hoặc 50fps</strong>, không phải 24/30/60, và đặt màn trập <strong>1/50</strong> (hoặc 1/100 nếu 1/50 vẫn còn sọc mờ).</p></div>
${slide('cr-06', 4, 'Đọc màn hình cài đặt Pocket 3')}
<p>Vuốt trái trên màn hình cảm ứng để vào cài đặt hình ảnh, chạm <strong>PRO</strong>, bạn có toàn quyền chỉnh tay Exposure (Auto/M), White Balance (AWB/M), Focus Mode, và — chỉ ở Video mode — Image Adjustment và Glamour Effects. HUD ở trên đọc từ trái sang phải: độ phân giải+fps, chế độ màu, màn trập, ISO, cân bằng trắng.</p>

<h3>Năm preset — chọn một cái, đừng nghĩ lại từ đầu mỗi lần</h3>
<p>Bạn không cần tính lại tam giác phơi sáng trước mỗi cảnh. Lưu năm preset này (Pocket 3 giữ được tối đa 5 chế độ trong Custom Mode) rồi chỉ việc chọn đúng tình huống:</p>
${slide('cr-06', 5, 'Bảng preset Pocket 3 theo tình huống')}
<div class="callout ok"><p><strong>Khi nào dùng D-Log M (và khi nào không):</strong> D-Log M là chế độ màu phẳng 10-bit của Pocket 3 — dải sáng tối rộng hơn, sinh ra để chỉnh màu sau. Chỉ quay nó khi bạn THẬT SỰ sẽ chỉnh màu ở Chương 15. Ra khỏi máy, cảnh D-Log M nhìn xám xịt; nếu đăng thẳng không chỉnh, chế độ Normal nhìn đẹp hơn với mọi người xem trừ chính bạn. (Pocket 3 còn có chế độ thứ ba, <strong>HLG</strong> — dải sáng rộng hơn Normal nhưng, khác D-Log M, sinh ra để nhìn tạm ổn ngay khi ra khỏi máy trên màn hình hỗ trợ HLG. Coi nó như một mức trung gian bạn hiếm khi cần trong khoá này; mặc định dùng Normal hoặc D-Log M.)</p></div>

<h3>Ba chế độ gimbal — máy di chuyển khác nhau ở mỗi chế độ</h3>
<p>Gimbal cơ 3 trục của Pocket 3 là lý do nó hơn hẳn điện thoại gắn gậy khi quay vừa đi vừa quay. Vuốt xuống từ đỉnh màn hình → chạm biểu tượng gimbal để đổi chế độ:</p>
${slide('cr-06', 6, 'Ba chế độ gimbal của Pocket 3')}
<p>Follow là mặc định đúng cho gần như mọi cảnh, kể cả các bài talking-head của khoá này. Để dành FPV cho một lý do sáng tạo cụ thể — đây là chế độ ổn định KÉM nhất, không phải chế độ "nâng cao".</p>

<h3>Âm thanh: mic tích hợp, và khi nào cắm thêm mic</h3>
${slide('cr-06', 7, 'Mic tích hợp và mic rời của Pocket 3')}
<p>Dàn 3 mic trên thân máy đủ dùng cho vlog thường trong phòng yên tĩnh. Hai điều đáng nhớ: <strong>Wind Noise Reduction</strong> chỉ tác động lên mic tích hợp — nó không làm gì một khi đã cắm mic ngoài. Và Pocket 3 link thẳng với transmitter <strong>DJI Mic 2 hoặc Mic 3</strong> qua Bluetooth, KHÔNG cần receiver (DJI gọi đây là OsmoAudio) — vào Control Center → Wireless Microphone → TX1/TX2. Riêng DJI Mic bản gốc (không đánh số) lại cắm vào cổng USB-C qua adapter đi kèm, làm receiver có dây, không link Bluetooth thẳng.</p>

<h3>Hai app, hai việc khác nhau</h3>
<p><strong>DJI Mimo</strong> lo phần máy: cập nhật firmware, chuyển và xem lại cảnh quay, xem trực tiếp, và có cả video hướng dẫn trong mục Academy. <strong>LightCut</strong> là app dựng nhanh bằng AI, do chính DJI làm và khuyến nghị riêng — mẫu dựng một chạm, nhạc có sẵn, biến clip thô thành video ngắn thật nhanh. Cả hai không thay thế được việc dựng bằng DaVinci Resolve hay CapCut mà khoá này sẽ dạy sau; chúng dành cho bài đăng trong ngày, không phải sản phẩm hoàn chỉnh.</p>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — quay một lèo 20–30 phút thay vì từng cảnh riêng:</strong> nếu bạn vẫn đang bấm quay rồi để Pocket 3 chạy liên tục "cho chắc không bỏ sót gì", đúng thói quen đó là thứ làm tràn thẻ giữa buổi và biến việc dựng thành tua tìm suốt nửa tiếng chỉ để lấy 90 giây dùng được. Một preset đã lưu trong Custom Mode xoá bỏ cái cớ "không muốn dừng lại đổi cài đặt" — chạm một cái, quay đúng cảnh đó, dừng, sang cảnh tiếp theo. Chương 4 nói sâu về shot list; chương này chỉ dọn sẵn phần kỹ thuật khiến quay-từng-cảnh cảm giác chậm hơn thực tế.</p></div>

<p class="note-ct"><strong>Nối với chương sau:</strong> Chương 7 dựng bố cục và cách quay trên nền các chế độ gimbal này, và Chương 15 chính là nơi cảnh D-Log M được chỉnh lại về màu bình thường.</p>

<h3>🎬 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Mở Control Center của Pocket 3 và tự tìm Anti-Flicker, Video Compression, Gimbal Mode mà không xem lại bài này.</li>
<li>Đặt preset "talking head trong nhà" ở bảng trên và quay thử 20 giây tự quay chính mình.</li>
<li>Phát lại và tìm sọc nhấp nháy. Nếu vẫn thấy, đổi sang 1/100 thay vì 1/50.</li>
<li>Lưu preset vừa chỉnh vào một trong 5 ô Custom Mode.</li>
</ol><p><strong>Đạt khi:</strong> gọi lại được preset đã lưu bằng một chạm, và cảnh quay không còn sọc nhấp nháy nhìn thấy được.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Shutter speed</span><span class="v">Tốc độ màn trập — khoảng thời gian mỗi khung hình thu sáng. Ngắn hơn = tối hơn, chuyển động sắc nét hơn; dài hơn = sáng hơn, nhoè chuyển động nhiều hơn.</span></div>
<div class="kv"><span class="k">D-Log M</span><span class="v">Chế độ màu phẳng 10-bit của Pocket 3, dùng để chỉnh màu sau. Nhìn xám khi chưa chỉnh — đừng đăng thẳng.</span></div>
<div class="kv"><span class="k">Gimbal</span><span class="v">Bộ ổn định cơ 3 trục — cơ cấu có động cơ giữ máy quay luôn ngang khi bạn vừa đi vừa quay.</span></div>
<div class="kv"><span class="k">Anti-flicker</span><span class="v">Chống nhấp nháy — cài đặt canh nhịp màn trập theo tần số điện lưới nơi bạn đang quay (50Hz ở Việt Nam) để hết sọc dưới đèn điện.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Ở Việt Nam, mặc định 25 hoặc 50fps với màn trập 1/50 (hoặc 1/100) dưới mọi ánh đèn điện.</li>
<li>Năm preset thực tế tốt hơn việc tính lại phơi sáng mỗi lần bấm quay.</li>
<li>Follow là chế độ gimbal mặc định; Tilt Locked và FPV dành cho cảnh cụ thể, không phải dùng hàng ngày.</li>
<li>DJI Mic 2/3 link Bluetooth không cần receiver; DJI Mic bản gốc cần adapter USB-C.</li>
<li>D-Log M là một lời hứa sẽ chỉnh màu sau — giữ lời hứa đó hoặc quay Normal.</li>
</ul>

<div class="link-card"><a href="https://www.dji.com/osmo-pocket-3/specs" target="_blank" rel="noopener">DJI Osmo Pocket 3 — trang thông số kỹ thuật chính thức</a></div>
</div>
`,
    },

    /* ─────────────────── 6.2 iPhone 16 Pro Max ─────────────────── */
    {
      title: '6.2 — iPhone 16 Pro Max: the settings that matter|||6.2 — iPhone 16 Pro Max: những cài đặt quan trọng',
      slug: 'cr-06-2-iphone-16-pro-max',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Bật/tắt đúng trong Settings > Camera, khi nào dùng Blackmagic Camera thay vì app Camera gốc, và vì sao HDR Video nên tắt khi dựng chung với Pocket 3.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.2</span>
<h2>iPhone 16 Pro Max: six toggles in Settings before you film</h2>
<p class="lead">Your iPhone is Camera B in this course — the one that grabs a close-up while Pocket 3 holds the wide shot, or the one you hand to a friend to interview you. Out of the box its camera makes decisions for you: it switches lenses mid-recording, it re-locks white balance every few seconds, it shoots HDR by default. Every one of those is fine for a family video and wrong for footage you plan to cut together with something else.</p>

<h3>The three lenses, and why the number "24mm" matters more than "48MP"</h3>
<p>iPhone 16 Pro Max has three rear cameras: the 48MP Fusion main camera (24mm equivalent, ƒ/1.78), a 48MP Ultra Wide (13mm, ƒ/2.2), and a 12MP 5x Telephoto (120mm, ƒ/2.8). The megapixel count only matters for stills — for video, what changes your shot is the equivalent focal length, because that decides how much of the room is in frame.</p>
${slide('cr-06', 9, 'So sánh góc nhìn Pocket 3 và ba ống kính iPhone')}
<p>Compare that to Pocket 3's fixed 20mm — the Ultra Wide (13mm) is the closest match for a wide establishing shot, the main 1x (24mm) is close to Pocket 3's own field of view, and the 5x tele (120mm) is what you reach for from across a room without walking closer.</p>

<h3>Settings › Camera › Record Video — six things to change today</h3>
${slide('cr-06', 8, 'Bảng cài đặt Settings > Camera của iPhone')}
<p>Turn on <strong>PAL formats</strong> first — without it, 25 fps is hidden from the picker and you are stuck with 24/30/60, none of which line up cleanly with 50 Hz mains. <strong>Lock Camera</strong> stops the phone from silently swapping lenses mid-shot when you drift closer or farther from your subject — exactly the kind of jump cut you do not want in the middle of a take. <strong>Lock White Balance</strong> keeps skin tone from drifting between takes of the same scene.</p>
<div class="callout warn"><p><strong>Should you turn off HDR Video (Dolby Vision)?</strong> Apple's own documentation says supported iPhones "record video in Dolby Vision HDR," and non-HDR devices automatically receive "an SDR version of the same video" when you share it — so the raw file itself is not broken either way. The reason to turn it <strong>off by default in this course</strong> is the edit, not the export: you will be cutting iPhone clips against Pocket 3 clips, which only ever shoot standard SDR/Rec.709. Starting both cameras in SDR means one less color-space conversion to get wrong in DaVinci Resolve or CapCut later. Turn HDR Video back on only for a single-camera, phone-only piece where you understand the HDR pipeline end to end — that is not this course's default workflow.</p></div>

<h3>ProRes and Apple Log — powerful, and gated by storage you may not have</h3>
<p>Apple's official storage table is blunt about this: on a 128 GB iPhone, ProRes is limited to 1080p only. You need 256 GB or more just to unlock 4K ProRes at 24/25/30 fps, and 4K at 60 fps or 120 fps additionally requires an external USB-C storage device — at least 220 MB/s for 60 fps, at least 440 MB/s for 120 fps. Apple states ProRes files run "up to 30 times larger" than the same shot in HEVC. Turn ProRes on (Settings › Camera › Formats) only when you are actually grading afterward in Chapter 15 — otherwise HEVC (High Efficiency) is smaller, plays back everywhere, and looks identical to anyone not pixel-peeping.</p>

<h3>Blackmagic Camera — when the built-in Camera app is not enough</h3>
${slide('cr-06', 10, 'Wireframe app Blackmagic Camera')}
<p>Blackmagic Camera is a free app from Blackmagic Design (the DaVinci Resolve company) that replaces the iPhone's Camera app with manual film-camera controls: shutter angle, ISO and white balance in one tap, plus zebra, focus peaking and false color overlays for checking exposure and focus without guessing. On compatible iPhones it can shoot in Apple Log colorspace and record straight to an external SSD over USB-C — genuinely useful once you own a monitor or SSD rig, overkill for your first few shoots. Reach for it specifically when you want Apple Log with a real histogram on screen, not as your everyday camera app.</p>

<h3>The Camera Control button and your iPhone as a Mac webcam</h3>
<p>The physical Camera Control button (right edge of the phone) is a shortcut into exposure, "depth" (background blur), zoom, lens switching and photographic styles — light-press to open a control, slide to adjust it. Separately, your iPhone can act as your Mac's webcam through Continuity Camera: any iPhone XR or later works, signed into the same Apple Account with Bluetooth and Wi-Fi on nearby, or wired over USB-C if you trust the Mac — handy for a higher-quality webcam feed than your Mac's built-in camera during a screen-recorded lesson (Chapter 19 covers that workflow in full).</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — HDR Video left on because it is the default:</strong> Apple ships HDR Video turned on for supported models. If you never open Settings › Camera, half your A/B footage is Dolby Vision and half (Pocket 3's) is plain SDR, and you will not notice the mismatch until you drop both into the same timeline and the iPhone clips look subtly "different" in a way that is hard to name. Check this setting once, before your first real shoot, not after you are already editing.</p></div>

<p class="note-ct"><strong>Connects to next:</strong> Lesson 6.3 covers where these clips actually go to get edited — iPad, Mac, or the Linux machine — and Chapter 15 is where Apple Log and D-Log M both get graded properly.</p>

<h3>🎬 Practice (15 minutes)</h3>
<div class="callout ok"><ol>
<li>Open Settings › Camera › Record Video and turn on PAL formats, Lock White Balance; decide Lock Camera and HDR Video based on whether you are shooting solo or A/B with Pocket 3.</li>
<li>Shoot a 15-second clip at 4K·25fps with the Camera app, then the same shot with Blackmagic Camera if you have it installed.</li>
<li>Compare: which one gave you a visible histogram or zebra pattern while framing?</li>
</ol><p><strong>Done when:</strong> you can state, without checking, whether HDR Video and Lock Camera are currently on or off on your own phone.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Equivalent focal length</span><span class="v">Tiêu cự tương đương — the 35mm-camera number (24mm, 13mm, 120mm…) used to compare field of view across different sensors and lenses.</span></div>
<div class="kv"><span class="k">Dolby Vision HDR</span><span class="v">A high-dynamic-range video format; devices that do not support it automatically see a standard-range (SDR) copy instead.</span></div>
<div class="kv"><span class="k">Apple Log</span><span class="v">Apple's flat color profile for grading, the iPhone equivalent of Pocket 3's D-Log M.</span></div>
<div class="kv"><span class="k">Zebra / focus peaking / false color</span><span class="v">On-screen overlays that flag overexposed areas, in-focus edges, and exposure levels by color — so you check exposure with your eyes on real data, not a guess.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Turn on PAL formats to unlock 25 fps — 24/30/60 alone cannot hit a clean 50 Hz shutter match.</li>
<li>Lock Camera and Lock White Balance remove two common sources of mid-scene inconsistency.</li>
<li>Default HDR Video off when cutting against Pocket 3's SDR footage; ProRes only when you will grade.</li>
<li>Blackmagic Camera adds manual exposure tools and Apple Log — reach for it on purpose, not by default.</li>
<li>A 128 GB iPhone cannot shoot 4K ProRes at all; 4K60/120 ProRes need an external SSD.</li>
</ul>

<div class="link-card"><a href="https://support.apple.com/en-us/121032" target="_blank" rel="noopener">iPhone 16 Pro Max — Apple official tech specs</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.2</span>
<h2>iPhone 16 Pro Max: sáu công tắc trong Settings trước khi quay</h2>
<p class="lead">iPhone là Máy B trong khoá này — máy bắt cận cảnh trong khi Pocket 3 giữ cảnh rộng, hoặc máy bạn đưa cho bạn mình cầm để phỏng vấn bạn. Ngay khi mở hộp, camera của nó tự quyết định thay bạn: tự đổi ống kính giữa lúc quay, tự khoá lại cân bằng trắng mỗi vài giây, mặc định quay HDR. Mọi thứ đó đều ổn cho video gia đình và sai cho cảnh bạn định dựng ghép với máy khác.</p>

<h3>Ba ống kính, và vì sao con số "24mm" quan trọng hơn "48MP"</h3>
<p>iPhone 16 Pro Max có ba camera sau: camera chính Fusion 48MP (tương đương 24mm, ƒ/1.78), Ultra Wide 48MP (13mm, ƒ/2.2), và Telephoto 5x 12MP (120mm, ƒ/2.8). Số chấm (megapixel) chỉ quan trọng với ảnh tĩnh — với video, thứ đổi khung hình của bạn là tiêu cự tương đương, vì nó quyết định lấy được bao nhiêu khung cảnh trong phòng.</p>
${slide('cr-06', 9, 'So sánh góc nhìn Pocket 3 và ba ống kính iPhone')}
<p>So với ống kính cố định 20mm của Pocket 3 — Ultra Wide (13mm) gần nhất với một cảnh rộng thiết lập bối cảnh, ống chính 1x (24mm) gần với góc nhìn của chính Pocket 3, còn tele 5x (120mm) là ống bạn dùng để "kéo lại gần" từ bên kia phòng mà không cần bước tới.</p>

<h3>Settings › Camera › Record Video — sáu thứ nên đổi ngay hôm nay</h3>
${slide('cr-06', 8, 'Bảng cài đặt Settings > Camera của iPhone')}
<p>Bật <strong>hiện định dạng PAL</strong> trước tiên — không bật, 25fps bị giấu khỏi danh sách chọn và bạn chỉ còn 24/30/60, không cái nào khớp sạch với điện 50Hz. <strong>Lock Camera</strong> chặn máy âm thầm đổi ống kính giữa cảnh khi bạn lỡ nhích gần hoặc xa chủ thể — đúng kiểu jump cut bạn không muốn có giữa một lần quay. <strong>Lock White Balance</strong> giữ tông da không trôi giữa các lần quay của cùng một cảnh.</p>
<div class="callout warn"><p><strong>Có nên tắt HDR Video (Dolby Vision)?</strong> Tài liệu chính thức của Apple nói các iPhone hỗ trợ "ghi video ở HDR Dolby Vision", và thiết bị không hỗ trợ HDR sẽ tự động nhận "phiên bản SDR của cùng video đó" khi bạn chia sẻ — nên bản thân file gốc không hỏng dù bật hay tắt. Lý do nên <strong>mặc định TẮT trong khoá này</strong> nằm ở khâu DỰNG, không phải khâu xuất: bạn sẽ cắt ghép clip iPhone với clip Pocket 3, mà Pocket 3 chỉ quay SDR/Rec.709 chuẩn. Cho cả hai máy cùng xuất phát từ SDR nghĩa là bớt đi một bước đổi không gian màu có thể sai khi dựng trong DaVinci Resolve hay CapCut sau này. Chỉ bật lại HDR Video cho một sản phẩm một-máy-duy-nhất mà bạn hiểu rõ toàn bộ quy trình HDR từ đầu tới cuối — đó không phải quy trình mặc định của khoá này.</p></div>

<h3>ProRes và Apple Log — mạnh, nhưng bị khoá bởi dung lượng bạn có thể chưa có</h3>
<p>Bảng dung lượng chính thức của Apple nói thẳng: iPhone 128GB chỉ quay được ProRes ở 1080p. Bạn cần 256GB trở lên mới mở được ProRes 4K ở 24/25/30fps, còn 4K ở 60fps hay 120fps còn cần thêm thiết bị lưu trữ ngoài qua USB-C — tối thiểu 220MB/s cho 60fps, tối thiểu 440MB/s cho 120fps. Apple ghi rõ file ProRes nặng "gấp tới 30 lần" cùng cảnh quay bằng HEVC. Chỉ bật ProRes (Settings › Camera › Formats) khi bạn THẬT SỰ sẽ chỉnh màu ở Chương 15 sau này — còn lại HEVC (High Efficiency) nhẹ hơn, phát được ở mọi nơi, và nhìn giống hệt với bất kỳ ai không soi từng điểm ảnh.</p>

<h3>Blackmagic Camera — khi app Camera gốc chưa đủ</h3>
${slide('cr-06', 10, 'Wireframe app Blackmagic Camera')}
<p>Blackmagic Camera là app miễn phí của Blackmagic Design (hãng làm DaVinci Resolve), thay app Camera gốc bằng bộ điều khiển kiểu máy quay phim chỉnh tay: shutter angle, ISO và cân bằng trắng chỉ một chạm, cộng thêm lớp phủ zebra, focus peaking và false color để kiểm phơi sáng và lấy nét bằng dữ liệu thật, không phải đoán. Trên các iPhone tương thích, nó quay được ở không gian màu Apple Log và ghi thẳng ra SSD ngoài qua USB-C — thật sự hữu ích một khi bạn có màn hình rời hay dàn SSD, hơi thừa cho vài buổi quay đầu tiên. Dùng nó đúng lúc bạn cần Apple Log với histogram thật trên màn hình, không phải dùng như app quay hàng ngày.</p>

<h3>Nút Camera Control và iPhone làm webcam cho Mac</h3>
<p>Nút Camera Control vật lý (cạnh phải máy) là lối tắt vào phơi sáng, "depth" (làm mờ nền), zoom, đổi ống kính và style ảnh — nhấn nhẹ để mở một điều khiển, trượt để chỉnh nó. Riêng biệt, iPhone của bạn làm webcam cho Mac được qua Continuity Camera: mọi iPhone từ XR trở lên đều dùng được, cùng đăng nhập một Apple Account, bật Bluetooth và Wi-Fi ở gần nhau, hoặc nối dây qua USB-C nếu máy đã tin cậy Mac — tiện khi bạn cần chất lượng webcam tốt hơn camera tích hợp của Mac trong một bài quay màn hình (Chương 19 dạy đầy đủ quy trình này).</p>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — để nguyên HDR Video vì đó là mặc định:</strong> Apple xuất xưởng máy với HDR Video đã bật sẵn trên các model hỗ trợ. Nếu bạn không bao giờ mở Settings › Camera, một nửa cảnh A/B của bạn là Dolby Vision còn nửa kia (của Pocket 3) là SDR thường, và bạn sẽ không nhận ra sự lệch đó cho tới khi thả cả hai vào cùng một timeline rồi thấy clip iPhone nhìn "khang khác" theo kiểu khó gọi tên. Kiểm cài đặt này một lần, TRƯỚC buổi quay thật đầu tiên, không phải sau khi đã dựng xong.</p></div>

<p class="note-ct"><strong>Nối với chương sau:</strong> Bài 6.3 nói về việc các clip này thật sự đi đâu để dựng — iPad, Mac, hay máy Linux — và Chương 15 là nơi cả Apple Log lẫn D-Log M được chỉnh màu đúng cách.</p>

<h3>🎬 Thực hành (15 phút)</h3>
<div class="callout ok"><ol>
<li>Mở Settings › Camera › Record Video, bật hiện định dạng PAL, Lock White Balance; quyết định Lock Camera và HDR Video tuỳ bạn quay một mình hay A/B với Pocket 3.</li>
<li>Quay thử 15 giây ở 4K·25fps bằng app Camera, rồi quay lại đúng cảnh đó bằng Blackmagic Camera nếu đã cài.</li>
<li>So sánh: app nào cho bạn thấy histogram hay zebra thật khi đang canh khung hình?</li>
</ol><p><strong>Đạt khi:</strong> bạn nói được ngay, không cần mở lại máy kiểm tra, rằng HDR Video và Lock Camera trên điện thoại của mình đang bật hay tắt.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Tiêu cự tương đương</span><span class="v">Equivalent focal length — con số quy về máy phim 35mm (24mm, 13mm, 120mm…) dùng để so góc nhìn giữa các cảm biến và ống kính khác nhau.</span></div>
<div class="kv"><span class="k">Dolby Vision HDR</span><span class="v">Định dạng video dải sáng động cao; máy không hỗ trợ sẽ tự động thấy bản sao dải sáng chuẩn (SDR) thay thế.</span></div>
<div class="kv"><span class="k">Apple Log</span><span class="v">Chế độ màu phẳng của Apple để chỉnh màu sau, tương đương D-Log M của Pocket 3 bên phía iPhone.</span></div>
<div class="kv"><span class="k">Zebra / focus peaking / false color</span><span class="v">Các lớp phủ trên màn hình báo vùng cháy sáng, viền đang nét, và mức phơi sáng theo màu — để kiểm phơi sáng bằng dữ liệu thật, không phải đoán bằng mắt.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Bật hiện định dạng PAL để mở khoá 25fps — riêng 24/30/60 không khớp sạch màn trập với điện 50Hz.</li>
<li>Lock Camera và Lock White Balance xoá hai nguồn lệch phổ biến nhất giữa một cảnh.</li>
<li>Mặc định tắt HDR Video khi dựng chung với cảnh SDR của Pocket 3; chỉ bật ProRes khi sẽ chỉnh màu.</li>
<li>Blackmagic Camera thêm công cụ phơi sáng chỉnh tay và Apple Log — dùng có chủ đích, không phải mặc định.</li>
<li>iPhone 128GB không quay được ProRes 4K; ProRes 4K60/120 cần thêm ổ SSD ngoài.</li>
</ul>

<div class="link-card"><a href="https://support.apple.com/en-us/121032" target="_blank" rel="noopener">iPhone 16 Pro Max — thông số kỹ thuật chính thức của Apple</a></div>
</div>
`,
    },

    /* ─────────────────── 6.3 iPad · Mac · Linux ─────────────────── */
    {
      title: '6.3 — iPad, Mac and the Linux machine: who does what|||6.3 — iPad, Mac và máy Linux: ai làm việc gì',
      slug: 'cr-06-3-ipad-mac-linux',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Vai trò thật của iPad Pro M5, Mac M1 Max và máy Linux ở nhà sau khi quay xong — và một lệnh ffmpeg đã chạy thật để hiểu vì sao Linux cần nó.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.3</span>
<h2>iPad, Mac, and the Linux machine: three roles, not three copies of the same job</h2>
<p class="lead">You do not need to decide which of your three non-camera devices is "the edit machine" — they each already do a different job well, and fighting that (trying to color-grade on the iPad, or trusting the Linux machine to just open an iPhone clip) is where people lose time. This lesson is short on purpose: it tells you what each machine is for now, and points to exactly where the deep version of that job is taught later.</p>

${slide('cr-06', 11, 'Luồng dữ liệu từ máy quay tới bản dựng cuối')}

<h3>iPad Pro M5 — the device you hold, not the device you edit color on</h3>
<p>Before a shoot, the iPad is where you sketch the storyboard with Apple Pencil Pro (Chapter 4) and where you run the Teleprompter in this site's own <strong>/creator</strong> tool — Space to start/stop, R and F to change speed, the arrow keys to nudge position, so you can read a script while looking near the lens instead of down at a phone. During a shoot it doubles as a second screen for framing or a monitor a friend can watch. Apple's own ProRes support page lists the 11-inch and 13-inch iPad Pro (M5) among the devices that can play back and edit ProRes footage — so light edits, reviewing footage, and quick CapCut or DaVinci Resolve for iPad cuts are all realistic on it. What it is not: your primary color-grading machine. Save that for the Mac.</p>

<h3>Mac M1 Max — the edit station, and why it does not choke on ProRes</h3>
<p>The M1 Max chip has a dedicated media engine with hardware decode and encode for H.264, HEVC, ProRes, and ProRes RAW, including two ProRes encode/decode engines (M1 Pro has one) — Apple's own announcement states this lets a MacBook Pro with M1 Max transcode ProRes in Compressor up to 10 times faster than the previous-generation 16-inch MacBook Pro. In practice that means the heavy Pocket 3 D-Log M and iPhone ProRes footage this course shoots plays back smoothly while you scrub the timeline, instead of stuttering. This is your main edit station — DaVinci Resolve, CapCut, or Final Cut Pro, covered fully in Chapters 11–16.</p>

<h3>The Linux machine — backup, transcoding, and one codec gap you need to know about now</h3>
<p>At home, the Linux machine's job is a second copy of your footage (Chapter 11 covers the full 3-2-1 backup routine), transcoding with ffmpeg, and eventually running Whisper to auto-generate subtitles (Chapter 16). One thing is worth knowing before you get there, because it changes how you think about "just editing on Linux": the <strong>free</strong> edition of DaVinci Resolve on Linux cannot decode or encode H.264 or H.265 video, or AAC audio, in any container — Studio adds H.264/H.265 support, but neither edition decodes AAC. Since Pocket 3 records HEVC/H.264 with AAC audio by default, and iPhone records HEVC with AAC too, an ordinary clip from either camera will not open in free Resolve on Linux at all.</p>
<p>The fix is to transcode first — turn the footage into a codec Resolve reads natively (DNxHR or ProRes) with the audio as uncompressed PCM. Here is the actual command, tested on a real clip for this lesson:</p>
<pre><code class="language-bash">ffmpeg -i canh-quay.mp4 -c:v dnxhd -profile:v dnxhr_hq -pix_fmt yuv422p -c:a pcm_s16le canh-quay_dnxhr.mov</code></pre>
<div class="out">Đo thật: clip nguồn H.264 20Mbps + AAC, 1080p, 5 giây = 11,4MB
→ sau lệnh trên: DNxHR HQ + PCM, cùng 5 giây = 115MB (nặng gấp ~10 lần)</div>
<p>That size jump is the real reason a Linux edit machine needs generous free disk space — a proxy file is not a convenience, it is the only way free Resolve can open the clip at all.</p>

${slide('cr-06', 12, 'Bảng phần mềm dựng theo từng máy')}

<div class="pitfall co-tieu-de"><p><strong>Trap — dragging an iPhone or Pocket 3 clip straight into DaVinci Resolve on the Linux machine:</strong> free Resolve will not show a helpful "please transcode this" message — the clip often just fails to import, or imports with no video track, which looks like a broken install rather than a missing codec. If a clip refuses to load only on the Linux machine and opens fine on the Mac, this codec gap is almost always why — transcode it first with the command above.</p></div>

<p class="note-ct"><strong>Connects to next:</strong> Chapter 11 turns this into a full pipeline — folder structure, checksummed copies, the 3-2-1 backup rule, and proxies for every clip, not just the ones that fail to open.</p>

<h3>🎬 Practice (10 minutes)</h3>
<div class="callout ok"><ol>
<li>On the Linux machine, confirm ffmpeg is installed (&#96;ffmpeg -version&#96;).</li>
<li>Copy one short clip from Pocket 3 or iPhone onto it and run the transcode command above.</li>
<li>Open the resulting .mov in DaVinci Resolve (free) and confirm it plays — then try the original .mp4 and see it fail or refuse to import.</li>
</ol><p><strong>Done when:</strong> you can explain in one sentence why the .mov works and the .mp4 does not, on that machine specifically.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Media Engine</span><span class="v">Apple silicon's dedicated hardware block for video decode/encode — why an M1 Max plays heavy ProRes footage without the CPU fans spinning up.</span></div>
<div class="kv"><span class="k">Proxy</span><span class="v">Bản thay thế nhẹ/tương thích hơn của một clip nặng, dùng để dựng mượt hoặc để mở được trên máy không đọc nổi codec gốc.</span></div>
<div class="kv"><span class="k">DNxHR</span><span class="v">Avid's editing codec family — one of the formats DaVinci Resolve on Linux reads natively, used here as the transcode target.</span></div>
<div class="kv"><span class="k">Decode / encode</span><span class="v">Giải mã / mã hoá — reading a compressed file back into video, versus compressing video into a file. A codec gap means the software cannot do one or both.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>iPad Pro M5: storyboard, teleprompter, second screen, light edits — not your color-grading machine.</li>
<li>Mac M1 Max: main edit station, with hardware acceleration that makes ProRes and HEVC playback smooth.</li>
<li>Free DaVinci Resolve on Linux cannot decode H.264, H.265, or AAC in any container — transcode first.</li>
<li>A 5-second, 11.4 MB H.264+AAC test clip became a 115 MB DNxHR+PCM file — budget disk space accordingly.</li>
</ul>

<div class="link-card"><a href="https://www.apple.com/newsroom/2021/10/introducing-m1-pro-and-m1-max-the-most-powerful-chips-apple-has-ever-built/" target="_blank" rel="noopener">Apple Newsroom — giới thiệu M1 Pro và M1 Max, chi tiết media engine</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.3</span>
<h2>iPad, Mac và máy Linux: ba vai trò, không phải ba bản sao của cùng một việc</h2>
<p class="lead">Bạn không cần quyết định máy nào trong ba máy "không phải máy quay" của mình là "máy dựng chính" — mỗi máy đã làm tốt một việc khác nhau rồi, và cố chống lại điều đó (chỉnh màu trên iPad, hay tin máy Linux mở thẳng được clip iPhone) là chỗ người ta mất thời gian. Bài này ngắn có chủ đích: nó nói máy nào làm việc gì NGAY BÂY GIỜ, và chỉ đúng chỗ phần sâu của việc đó được dạy sau.</p>

${slide('cr-06', 11, 'Luồng dữ liệu từ máy quay tới bản dựng cuối')}

<h3>iPad Pro M5 — máy bạn cầm, không phải máy bạn chỉnh màu</h3>
<p>Trước buổi quay, iPad là nơi bạn vẽ storyboard bằng Apple Pencil Pro (Chương 4) và chạy Teleprompter ngay trong công cụ <strong>/creator</strong> của chính trang này — Space để chạy/dừng, R và F để đổi tốc độ, phím mũi tên để nhích vị trí, để bạn đọc kịch bản mà mắt vẫn gần ống kính thay vì cúi xuống nhìn điện thoại. Trong buổi quay, nó kiêm màn hình phụ để canh khung hoặc màn hình cho bạn diễn xem lại. Trang hỗ trợ ProRes chính thức của Apple liệt kê iPad Pro 11 inch và 13 inch (M5) trong danh sách máy phát lại và dựng được ProRes — nên các bản dựng nhẹ, xem lại cảnh quay, và cắt nhanh bằng CapCut hay DaVinci Resolve for iPad đều làm được thật sự trên nó. Cái nó KHÔNG phải: máy chỉnh màu chính của bạn. Để dành việc đó cho Mac.</p>

<h3>Mac M1 Max — trạm dựng, và vì sao nó không hụt hơi với ProRes</h3>
<p>Chip M1 Max có một media engine riêng với phần cứng giải mã và mã hoá cho H.264, HEVC, ProRes, và ProRes RAW, gồm cả hai bộ mã hoá/giải mã ProRes (M1 Pro chỉ có một) — chính Apple công bố điều này giúp MacBook Pro dùng M1 Max chuyển mã ProRes trong Compressor nhanh hơn tới 10 lần so với thế hệ MacBook Pro 16 inch trước đó. Trong thực tế, điều đó nghĩa là cảnh D-Log M nặng của Pocket 3 và ProRes của iPhone mà khoá này quay được phát mượt khi bạn tua timeline, thay vì giật cục. Đây là trạm dựng chính của bạn — DaVinci Resolve, CapCut, hay Final Cut Pro, được dạy đầy đủ ở Chương 11–16.</p>

<h3>Máy Linux — sao lưu, chuyển mã, và một lỗ hổng codec cần biết ngay từ bây giờ</h3>
<p>Ở nhà, việc của máy Linux là giữ một bản sao thứ hai của cảnh quay (Chương 11 dạy đầy đủ quy trình sao lưu 3-2-1), chuyển mã bằng ffmpeg, và sau này chạy Whisper để tự sinh phụ đề (Chương 16). Có một điều nên biết trước khi tới đó, vì nó đổi hẳn cách bạn nghĩ về việc "cứ dựng thẳng trên Linux": bản <strong>miễn phí</strong> của DaVinci Resolve trên Linux KHÔNG giải mã lẫn mã hoá được H.264 hay H.265, cũng không đọc được audio AAC, trong bất kỳ định dạng chứa (container) nào — bản Studio thêm được H.264/H.265, nhưng cả hai bản đều không đọc AAC. Vì Pocket 3 mặc định ghi HEVC/H.264 kèm audio AAC, và iPhone cũng ghi HEVC kèm AAC, một clip bình thường từ một trong hai máy quay sẽ KHÔNG mở được trong Resolve free trên Linux.</p>
<p>Cách sửa là chuyển mã trước — đổi cảnh quay sang codec Resolve đọc được thẳng (DNxHR hoặc ProRes) với audio là PCM không nén. Đây là lệnh thật, đã chạy thử cho đúng bài này:</p>
<pre><code class="language-bash">ffmpeg -i canh-quay.mp4 -c:v dnxhd -profile:v dnxhr_hq -pix_fmt yuv422p -c:a pcm_s16le canh-quay_dnxhr.mov</code></pre>
<div class="out">Đo thật: clip nguồn H.264 20Mbps + AAC, 1080p, 5 giây = 11,4MB
→ sau lệnh trên: DNxHR HQ + PCM, cùng 5 giây = 115MB (nặng gấp ~10 lần)</div>
<p>Mức tăng dung lượng đó chính là lý do máy dựng Linux cần nhiều chỗ trống — proxy không phải cho tiện, mà là cách DUY NHẤT để Resolve free mở được clip.</p>

${slide('cr-06', 12, 'Bảng phần mềm dựng theo từng máy')}

<div class="pitfall co-tieu-de"><p><strong>Bẫy — kéo thẳng clip iPhone hoặc Pocket 3 vào DaVinci Resolve trên máy Linux:</strong> Resolve free không báo dòng chữ hữu ích kiểu "hãy chuyển mã trước" — clip thường chỉ import lỗi, hoặc import mà không có track hình, nhìn giống cài đặt hỏng hơn là thiếu codec. Nếu một clip chỉ từ chối mở trên máy Linux mà mở tốt trên Mac, gần như chắc chắn đây là lỗ hổng codec này — chuyển mã trước bằng lệnh ở trên.</p></div>

<p class="note-ct"><strong>Nối với chương sau:</strong> Chương 11 biến việc này thành một quy trình đầy đủ — cấu trúc thư mục, sao chép có checksum, luật sao lưu 3-2-1, và proxy cho MỌI clip chứ không chỉ clip bị lỗi mở.</p>

<h3>🎬 Thực hành (10 phút)</h3>
<div class="callout ok"><ol>
<li>Trên máy Linux, kiểm ffmpeg đã cài chưa (&#96;ffmpeg -version&#96;).</li>
<li>Chép một clip ngắn từ Pocket 3 hoặc iPhone sang máy đó rồi chạy lệnh chuyển mã ở trên.</li>
<li>Mở file .mov vừa ra trong DaVinci Resolve (free) và xác nhận phát được — rồi thử mở file .mp4 gốc và xem nó lỗi hoặc từ chối import.</li>
</ol><p><strong>Đạt khi:</strong> bạn giải thích được trong một câu vì sao .mov chạy còn .mp4 không, trên đúng máy đó.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Media Engine</span><span class="v">Khối phần cứng riêng của chip Apple Silicon để giải mã/mã hoá video — vì sao M1 Max phát được cảnh ProRes nặng mà quạt máy không cần gào lên.</span></div>
<div class="kv"><span class="k">Proxy</span><span class="v">Bản thay thế nhẹ hoặc tương thích hơn của một clip nặng, dùng để dựng mượt hoặc để mở được trên máy không đọc nổi codec gốc.</span></div>
<div class="kv"><span class="k">DNxHR</span><span class="v">Họ codec dựng phim của Avid — một trong các định dạng DaVinci Resolve trên Linux đọc được thẳng, dùng làm đích chuyển mã ở bài này.</span></div>
<div class="kv"><span class="k">Decode / encode</span><span class="v">Giải mã / mã hoá — đọc ngược một file nén thành video, và ngược lại nén video thành file. Lỗ hổng codec nghĩa là phần mềm không làm được một hoặc cả hai việc đó.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>iPad Pro M5: storyboard, teleprompter, màn hình phụ, dựng nhẹ — không phải máy chỉnh màu.</li>
<li>Mac M1 Max: trạm dựng chính, có tăng tốc phần cứng giúp ProRes và HEVC phát mượt.</li>
<li>DaVinci Resolve free trên Linux không giải mã được H.264, H.265, hay AAC trong bất kỳ container nào — phải chuyển mã trước.</li>
<li>Một clip thử 5 giây, 11,4MB (H.264+AAC) trở thành file 115MB (DNxHR+PCM) — trù tính chỗ trống ổ đĩa theo đúng tỉ lệ đó.</li>
</ul>

<div class="link-card"><a href="https://www.apple.com/newsroom/2021/10/introducing-m1-pro-and-m1-max-the-most-powerful-chips-apple-has-ever-built/" target="_blank" rel="noopener">Apple Newsroom — giới thiệu M1 Pro và M1 Max, chi tiết media engine</a></div>
</div>
`,
    },

    /* ─────────────────── 6.4 Thẻ nhớ, pin, dung lượng ─────────────────── */
    {
      title: '6.4 — Cards, battery, and how much storage you need|||6.4 — Thẻ nhớ, pin, và bạn cần bao nhiêu dung lượng',
      slug: 'cr-06-4-the-nho-pin-dung-luong',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Cách tự tính GB/phút từ bitrate, bảng dung lượng cho các chế độ hay dùng, chọn đúng thẻ nhớ, và giữ pin/nhiệt độ an toàn qua mùa hè Việt Nam.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.4</span>
<h2>Cards, battery, and the math that stops a card from filling mid-shoot</h2>
<p class="lead">"256 GB should be enough" is the sentence right before a card fills up on the one take you cannot re-shoot. This lesson gives you the actual formula behind file size, real numbers for Pocket 3 and iPhone, and the card/battery/heat habits that turn "should be enough" into "I checked, and it is."</p>

<h3>The formula behind every number in this lesson</h3>
<p>Video file size comes from one relationship: <strong>bitrate</strong> (how many megabits the camera writes per second) times time. The formula is GB/minute = Mbps × 60 ÷ 8 ÷ 1000. DJI publishes Pocket 3's maximum video bitrate as 130 Mbps across all modes. Run the math — and then actually run it, because a claimed bitrate and a measured one are not always the same thing:</p>
<pre><code class="language-bash">ffmpeg -f lavfi -i testsrc2=size=3840x2160:rate=25 -t 10 -c:v libx264 -b:v 130M -maxrate 130M -bufsize 32M -x264-params nal-hrd=cbr:force-cfr=1 -pix_fmt yuv420p tran_130mbps.mp4</code></pre>
<div class="out">10 giây thật · 3840×2160 · 130 Mbps CBR → file 162.106.010 bytes
ffprobe đo được: bit_rate=129.684.808 (~129,7 Mbps, khớp mục tiêu 130 Mbps)
Quy đổi ra 1 phút: 162.106.010 × 6 ÷ 1.000.000.000 ≈ 0,973 GB/phút ≈ 58,4 GB/giờ</div>
<p>That confirms the formula against a real encode. You can point <code>ffprobe -show_entries format=bit_rate,size,duration yourfile.mp4</code> at any clip you actually shoot to get its real bitrate instead of trusting a spec sheet.</p>

${slide('cr-06', 13, 'Bảng dung lượng GB/giờ')}

<h3>What that means for modes you will actually use</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Pocket 3, any mode (ceiling)</span><span class="v">≈0,97 GB/phút · ≈58,5 GB/giờ — DJI's published maximum bitrate. Real footage is usually well below this; it is a safe worst-case for planning card space, not a typical number.</span></div>
<div class="kv"><span class="k">iPhone HEVC 4K·30 (estimate)</span><span class="v">≈0,17 GB/phút · ≈10 GB/giờ — Apple does not publish a fixed bitrate for HEVC recording (it is scene-adaptive); this is a widely cross-checked community estimate, not an Apple number. Measure your own footage with ffprobe to confirm.</span></div>
<div class="kv"><span class="k">iPhone HEVC 4K·60 (estimate)</span><span class="v">≈0,40 GB/phút · ≈24 GB/giờ — same caveat as above.</span></div>
<div class="kv"><span class="k">iPhone ProRes</span><span class="v">Apple states ProRes files run "up to 30 times larger" than the same shot in HEVC — at 4K·30 that could mean several GB per minute. Only shoot it when you will actually grade (see Lesson 6.2).</span></div>
</div>

<h3>Choosing a card: the rating matters more than the price</h3>
<p>Pocket 3 requires a microSD rated <strong>UHS-I Speed Grade 3</strong> (also written U3 — guaranteed minimum 30 MB/s sustained write) and supports cards up to 1 TB. DJI's own recommended list includes Kingston Canvas Go! Plus and Canvas React Plus, Lexar Pro (1066x) and Lexar Silver Plus, and SanDisk Extreme Pro — a card without that U3/V30 rating can drop frames or corrupt a 4K recording mid-shot even if it has plenty of free space, because the rating is about sustained write speed, not capacity.</p>
<div class="callout ok"><p><strong>Run two cards, not one:</strong> keep a second card so one is always recording while the other has already been offloaded from yesterday. If a card is lost, damaged, or corrupts, you lose one day, not your whole backlog.</p></div>

${slide('cr-06', 14, 'Checklist thẻ nhớ, pin, nhiệt')}

<h3>Battery and heat in a Vietnamese summer</h3>
<p>Pocket 3's built-in battery is 1300 mAh, rated for about 166 minutes of 1080p/24fps recording with Wi-Fi off — real-world runtime with the gimbal actively moving and 4K recording is noticeably shorter. The optional Battery Handle adds 950 mAh when you need a full day out. DJI's own usage notice is explicit: do not cover the ventilation area, and if the camera overheats, <strong>it stops recording</strong> to protect itself — in Vietnam's summer heat, that is a real risk with 4K120 or ProRes-heavy sessions specifically, not a hypothetical one. Build in a break between demanding clips rather than discovering the shutdown mid-take.</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — "256 GB should be enough for the whole shoot":</strong> at Pocket 3's bitrate ceiling, a 256 GB card holds roughly 262 minutes — about 4.4 hours — in the absolute best case. Add multiple takes, B-roll, and any 4K120 slow motion (which eats card space faster than Normal 4K), and a "full day" of shooting can realistically fill that card by early afternoon. Check remaining minutes on the touchscreen before a shoot, not after it stops recording mid-scene.</p></div>

<p class="note-ct"><strong>Connects to next:</strong> Chapter 10's shoot-day checklist covers offloading cards the same day, and Chapter 11 turns "offload" into a full 3-2-1 backup routine with checksums.</p>

<h3>🎬 Practice (10 minutes)</h3>
${slide('cr-06', 15, 'Checklist thực hành cuối chương')}
<div class="callout ok"><ol>
<li>Format one microSD card inside Pocket 3 itself (not on a computer), and rename it with today's date.</li>
<li>Record exactly 1 minute at your "indoors" preset, then check the actual file size on the card.</li>
<li>Compare that real number to the estimate table above — how far off was it, and in which direction?</li>
</ol><p><strong>Done when:</strong> you have one real, measured GB/minute number from your own gear, not just this lesson's estimate.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Bitrate</span><span class="v">Tốc độ bit — how much data the camera writes per second of video, usually in Mbps. Directly determines file size.</span></div>
<div class="kv"><span class="k">U3 / V30</span><span class="v">Speed ratings printed on a memory card guaranteeing a minimum sustained write speed of 30 MB/s — the number that actually matters for 4K recording, not the card's total capacity.</span></div>
<div class="kv"><span class="k">UHS-I</span><span class="v">Ultra High Speed bus interface — the physical/electrical standard a card and camera slot both need to support to hit these write speeds.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>GB/minute = Mbps × 60 ÷ 8 ÷ 1000 — use ffprobe on your own footage instead of trusting a spec sheet alone.</li>
<li>Pocket 3's published bitrate ceiling is ≈0,97 GB/phút; iPhone HEVC 4K modes run roughly 0,17–0,40 GB/phút (estimates).</li>
<li>Cards need a U3/V30 rating, not just capacity — DJI's recommended list is the safe default.</li>
<li>Run two cards in rotation; format inside the camera; never fill to 100%.</li>
<li>Pocket 3 stops recording if it overheats — plan breaks during demanding 4K120/ProRes sessions in hot weather.</li>
</ul>

<div class="link-card"><a href="https://dl.djicdn.com/downloads/DJI_Osmo_Pocket_3/UM/20250826/DJI_Osmo_Pocket_3_User_Manual_v1.0_en.pdf" target="_blank" rel="noopener">DJI Osmo Pocket 3 — User Manual chính thức (PDF)</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.4</span>
<h2>Thẻ nhớ, pin, và phép tính chặn thẻ đầy giữa buổi</h2>
<p class="lead">"256GB chắc đủ" là câu nói ngay trước khi thẻ đầy đúng vào cảnh bạn không quay lại được. Bài này cho bạn công thức thật đứng sau dung lượng file, số liệu thật cho Pocket 3 và iPhone, và thói quen thẻ/pin/nhiệt biến "chắc đủ" thành "tôi đã kiểm, và đủ thật".</p>

<h3>Công thức đứng sau mọi con số trong bài này</h3>
<p>Dung lượng file video đến từ một quan hệ duy nhất: <strong>bitrate</strong> (máy ghi bao nhiêu megabit mỗi giây) nhân với thời gian. Công thức là GB/phút = Mbps × 60 ÷ 8 ÷ 1000. DJI công bố bitrate video tối đa của Pocket 3 là 130Mbps cho mọi chế độ. Tính thử — rồi CHẠY THẬT phép tính đó, vì bitrate công bố và bitrate đo được không phải lúc nào cũng khớp nhau:</p>
<pre><code class="language-bash">ffmpeg -f lavfi -i testsrc2=size=3840x2160:rate=25 -t 10 -c:v libx264 -b:v 130M -maxrate 130M -bufsize 32M -x264-params nal-hrd=cbr:force-cfr=1 -pix_fmt yuv420p tran_130mbps.mp4</code></pre>
<div class="out">10 giây thật · 3840×2160 · 130 Mbps CBR → file 162.106.010 bytes
ffprobe đo được: bit_rate=129.684.808 (~129,7 Mbps, khớp mục tiêu 130 Mbps)
Quy đổi ra 1 phút: 162.106.010 × 6 ÷ 1.000.000.000 ≈ 0,973 GB/phút ≈ 58,4 GB/giờ</div>
<p>Con số đó xác nhận công thức trên một lần mã hoá thật. Bạn dùng được đúng <code>ffprobe -show_entries format=bit_rate,size,duration file-cua-ban.mp4</code> trên bất kỳ clip nào mình vừa quay để lấy bitrate THẬT thay vì tin vào tờ thông số.</p>

${slide('cr-06', 13, 'Bảng dung lượng GB/giờ')}

<h3>Áp vào các chế độ bạn thật sự hay dùng</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Pocket 3, mọi chế độ (trần)</span><span class="v">≈0,97 GB/phút · ≈58,5 GB/giờ — bitrate tối đa DJI công bố. Cảnh quay thật thường thấp hơn hẳn; đây là mức AN TOÀN XẤU NHẤT để trù tính dung lượng thẻ, không phải con số điển hình.</span></div>
<div class="kv"><span class="k">iPhone HEVC 4K·30 (ước tính)</span><span class="v">≈0,17 GB/phút · ≈10 GB/giờ — Apple không công bố bitrate cố định cho HEVC (nó tự thích ứng theo cảnh); đây là số cộng đồng đo được, nhiều nguồn khớp nhau, KHÔNG phải số của Apple. Đo lại trên clip của chính bạn bằng ffprobe để chắc chắn.</span></div>
<div class="kv"><span class="k">iPhone HEVC 4K·60 (ước tính)</span><span class="v">≈0,40 GB/phút · ≈24 GB/giờ — cùng lưu ý như trên.</span></div>
<div class="kv"><span class="k">iPhone ProRes</span><span class="v">Apple ghi rõ file ProRes nặng "gấp tới 30 lần" cùng cảnh quay bằng HEVC — ở 4K·30 điều đó có thể là vài GB mỗi phút. Chỉ quay khi bạn thật sự sẽ chỉnh màu (xem Bài 6.2).</span></div>
</div>

<h3>Chọn thẻ: cấp tốc độ quan trọng hơn giá tiền</h3>
<p>Pocket 3 yêu cầu thẻ microSD đạt chuẩn <strong>UHS-I Speed Grade 3</strong> (cũng ghi là U3 — bảo đảm tốc độ ghi liên tục tối thiểu 30MB/s) và hỗ trợ thẻ tới 1TB. Danh sách DJI khuyến nghị gồm Kingston Canvas Go! Plus và Canvas React Plus, Lexar Pro (1066x) và Lexar Silver Plus, cùng SanDisk Extreme Pro — một thẻ không đạt chuẩn U3/V30 có thể rớt khung hình hay hỏng file 4K giữa lúc quay dù vẫn còn thừa dung lượng trống, vì cấp tốc độ nói về tốc độ ghi LIÊN TỤC, không phải dung lượng.</p>
<div class="callout ok"><p><strong>Dùng hai thẻ, không phải một:</strong> giữ thẻ thứ hai để luôn có một thẻ đang quay trong khi thẻ kia đã đổ xong dữ liệu hôm qua. Nếu một thẻ mất, hỏng, hay lỗi, bạn chỉ mất đúng một ngày, không mất cả kho cảnh quay dồn lại.</p></div>

${slide('cr-06', 14, 'Checklist thẻ nhớ, pin, nhiệt')}

<h3>Pin và nhiệt độ trong mùa hè Việt Nam</h3>
<p>Pin tích hợp của Pocket 3 là 1300mAh, DJI công bố khoảng 166 phút quay ở 1080p/24fps khi tắt Wi-Fi — thời lượng thật khi gimbal hoạt động liên tục và quay 4K sẽ ngắn hơn rõ rệt. Battery Handle (phụ kiện tuỳ chọn) cộng thêm 950mAh khi bạn cần đi cả ngày. Thông báo sử dụng của chính DJI nói rõ: không che vùng thông gió, và nếu máy quá nóng, nó <strong>tự dừng quay</strong> để bảo vệ chính nó — trong cái nóng mùa hè Việt Nam, đây là rủi ro THẬT với các buổi quay nặng 4K120 hoặc nhiều ProRes, không phải chuyện giả định. Chủ động nghỉ giữa các đoạn quay nặng thay vì để máy tự tắt giữa cảnh.</p>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — "256GB chắc đủ cho cả buổi quay":</strong> ở mức trần bitrate của Pocket 3, một thẻ 256GB chứa được khoảng 262 phút — chừng 4,4 giờ — trong trường hợp tốt nhất tuyệt đối. Cộng thêm nhiều lần quay lại, B-roll, và bất kỳ đoạn slow motion 4K120 nào (ăn thẻ nhanh hơn 4K Normal), một "ngày quay trọn vẹn" hoàn toàn có thể làm đầy thẻ đó ngay từ đầu giờ chiều. Kiểm số phút còn lại trên màn hình TRƯỚC buổi quay, không phải sau khi máy dừng quay giữa cảnh.</p></div>

<p class="note-ct"><strong>Nối với chương sau:</strong> Checklist ngày quay ở Chương 10 nói về việc đổ thẻ ngay trong ngày, và Chương 11 biến "đổ thẻ" thành một quy trình sao lưu 3-2-1 đầy đủ có kiểm checksum.</p>

<h3>🎬 Thực hành (10 phút)</h3>
${slide('cr-06', 15, 'Checklist thực hành cuối chương')}
<div class="callout ok"><ol>
<li>Format một thẻ microSD NGAY TRONG Pocket 3 (không phải trên máy tính), và đặt tên lại theo ngày hôm nay.</li>
<li>Quay đúng 1 phút ở preset "trong nhà", rồi xem dung lượng file thật trên thẻ.</li>
<li>So con số thật đó với bảng ước tính ở trên — lệch bao nhiêu, và lệch theo chiều nào?</li>
</ol><p><strong>Đạt khi:</strong> bạn có một con số GB/phút THẬT, đo từ chính máy của mình, không chỉ là ước tính trong bài.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Bitrate</span><span class="v">Tốc độ bit — lượng dữ liệu máy ghi mỗi giây video, thường tính bằng Mbps. Quyết định trực tiếp dung lượng file.</span></div>
<div class="kv"><span class="k">U3 / V30</span><span class="v">Nhãn tốc độ in trên thẻ nhớ, bảo đảm tốc độ ghi liên tục tối thiểu 30MB/s — con số thật sự quan trọng cho quay 4K, không phải tổng dung lượng thẻ.</span></div>
<div class="kv"><span class="k">UHS-I</span><span class="v">Chuẩn giao tiếp bus tốc độ cao — cả thẻ lẫn khe cắm trên máy đều cần hỗ trợ chuẩn này để đạt được tốc độ ghi nói trên.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>GB/phút = Mbps × 60 ÷ 8 ÷ 1000 — dùng ffprobe trên chính cảnh quay của bạn thay vì chỉ tin tờ thông số.</li>
<li>Trần bitrate DJI công bố cho Pocket 3 ≈0,97 GB/phút; các chế độ HEVC 4K của iPhone khoảng 0,17–0,40 GB/phút (ước tính).</li>
<li>Thẻ cần đạt chuẩn U3/V30, không chỉ đủ dung lượng — danh sách DJI khuyến nghị là lựa chọn an toàn mặc định.</li>
<li>Luân phiên hai thẻ; format ngay trong máy; không bao giờ quay đầy 100%.</li>
<li>Pocket 3 tự dừng quay khi quá nóng — chủ động nghỉ giữa các buổi 4K120/ProRes nặng trong thời tiết nóng.</li>
</ul>

<div class="link-card"><a href="https://dl.djicdn.com/downloads/DJI_Osmo_Pocket_3/UM/20250826/DJI_Osmo_Pocket_3_User_Manual_v1.0_en.pdf" target="_blank" rel="noopener">DJI Osmo Pocket 3 — User Manual chính thức (PDF)</a></div>
</div>
`,
    },

    /* ─────────────────── 6.5 Kiểm tra chương ─────────────────── */
    {
      title: '6.5 — Chapter 6 check|||6.5 — Kiểm tra chương 6',
      slug: 'cr-06-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: '10 câu tình huống thực tế ôn lại cài đặt Pocket 3, iPhone, vai trò iPad/Mac/Linux, và quản lý thẻ nhớ/pin/dung lượng.',
      content: `
<div class="ml-en">
<h2>📌 Chapter 6 checklist</h2>
<p>Before moving to Chapter 7, you should be able to check every line below without opening a manual:</p>
<ul>
<li>Pocket 3 set to 25 or 50 fps with a matching shutter (1/50 or 1/100) under any artificial light in Vietnam.</li>
<li>You know which of your five saved Pocket 3 presets to use for indoors, outdoors, slow-motion B-roll, and night.</li>
<li>iPhone's PAL formats are on, Lock White Balance is on for fixed scenes, and you have made a deliberate choice about HDR Video.</li>
<li>You know why a plain .mp4 from either camera will not open in free DaVinci Resolve on the Linux machine — and the one ffmpeg command that fixes it.</li>
<li>You can estimate GB/minute for a mode from its bitrate, and you know your card's real speed rating, not just its capacity.</li>
</ul>
</div>
<div class="ml-vi">
<h2>📌 Checklist chương 6</h2>
<p>Trước khi sang Chương 7, bạn nên tự kiểm được từng dòng dưới đây mà không cần mở lại sổ tay:</p>
<ul>
<li>Pocket 3 đặt 25 hoặc 50fps với màn trập khớp (1/50 hoặc 1/100) dưới mọi ánh đèn điện ở Việt Nam.</li>
<li>Bạn biết dùng preset nào trong 5 preset đã lưu của Pocket 3 cho trong nhà, ngoài trời, B-roll quay chậm, và ban đêm.</li>
<li>Định dạng PAL trên iPhone đã bật, Lock White Balance đã bật cho cảnh cố định, và bạn đã CHỦ ĐỘNG quyết định về HDR Video.</li>
<li>Bạn biết vì sao một file .mp4 thường từ hai máy quay sẽ không mở được trong DaVinci Resolve free trên máy Linux — và đúng lệnh ffmpeg để sửa.</li>
<li>Bạn ước lượng được GB/phút của một chế độ từ bitrate của nó, và biết tốc độ THẬT của thẻ nhớ mình đang dùng, không chỉ dung lượng.</li>
</ul>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'You are recording a talking-head clip indoors under fluorescent lights and see rolling dark bands moving through the footage. What is the most direct fix?|||Bạn quay cảnh talking-head trong nhà dưới đèn huỳnh quang và thấy các dải tối chạy ngang qua cảnh quay. Cách sửa trực tiếp nhất là gì?',
            options: [
              'Increase the ISO until the image looks brighter|||Tăng ISO cho tới khi ảnh sáng hơn',
              'Switch to 25 fps and set the shutter to 1/50 (or 1/100)|||Đổi sang 25fps và đặt màn trập 1/50 (hoặc 1/100)',
              'Switch the color mode to D-Log M for a wider dynamic range|||Đổi chế độ màu sang D-Log M để có dải sáng rộng hơn',
              'Turn on HDR Video for more highlight detail|||Bật HDR Video để có thêm chi tiết vùng sáng',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: The bands are 50 Hz flicker from mains-powered lights. Only matching fps (25/50) and shutter speed (1/50 or 1/100) to that rhythm removes it — ISO, color mode, and HDR Video do not touch timing at all, so they leave the banding untouched.|||VI: Dải tối đó là hiện tượng nhấp nháy 50Hz của đèn chạy điện lưới. Chỉ có việc khớp fps (25/50) và tốc độ màn trập (1/50 hoặc 1/100) với đúng nhịp đó mới hết được — ISO, chế độ màu, hay HDR Video đều không đụng tới yếu tố thời gian nên không giải quyết được sọc nhấp nháy.',
          },
          {
            question: 'You will post a Pocket 3 clip straight to TikTok today with no color grading. Which color mode should you shoot in?|||Bạn sẽ đăng thẳng một clip Pocket 3 lên TikTok ngay hôm nay, không chỉnh màu gì thêm. Nên quay ở chế độ màu nào?',
            options: [
              'D-Log M, because 10-bit always looks better|||D-Log M, vì 10-bit lúc nào cũng đẹp hơn',
              'HLG, because it has the widest color gamut|||HLG, vì nó có dải màu rộng nhất',
              'Normal, because D-Log M looks grey and washed out until it is graded|||Normal, vì D-Log M nhìn xám và nhạt cho tới khi được chỉnh màu',
              'It does not matter, Pocket 3 auto-corrects flat footage on export|||Không quan trọng, Pocket 3 tự chỉnh cảnh phẳng khi xuất',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: D-Log M is a flat profile that only looks right after grading — publishing it straight out of camera looks worse than Normal to anyone who is not going to grade it, and Pocket 3 does no automatic correction on export.|||VI: D-Log M là chế độ màu phẳng, chỉ nhìn đúng SAU khi chỉnh màu — đăng thẳng nó ra khỏi máy sẽ nhìn tệ hơn Normal với bất kỳ ai không định chỉnh màu, và Pocket 3 không tự động chỉnh gì khi xuất file cả.',
          },
          {
            question: 'You are filming A/B with Pocket 3 and iPhone at the same time, and the iPhone keeps switching lenses mid-take as you shift position. Which iPhone setting stops that?|||Bạn quay A/B cùng lúc với Pocket 3 và iPhone, và iPhone cứ tự đổi ống kính giữa lúc quay khi bạn hơi xê dịch vị trí. Cài đặt nào trên iPhone chặn việc đó?',
            options: [
              'Lock Camera|||Lock Camera',
              'Lock White Balance|||Lock White Balance',
              'Enhanced Stabilization|||Enhanced Stabilization',
              'Show PAL formats|||Hiện định dạng PAL',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Lock Camera specifically prevents the automatic lens switching that happens as distance to the subject changes. Lock White Balance only fixes color, Enhanced Stabilization only affects framing/crop, and PAL formats only controls available frame rates.|||VI: Lock Camera là cài đặt chặn đúng việc tự đổi ống kính khi khoảng cách tới chủ thể thay đổi. Lock White Balance chỉ cố định màu, Enhanced Stabilization chỉ ảnh hưởng khung hình/crop, còn định dạng PAL chỉ quyết định các fps có sẵn để chọn.',
          },
          {
            question: 'You plan to edit iPhone clips and Pocket 3 clips in the same timeline in Chapter 13. What is the main reason to shoot the iPhone footage with HDR Video turned off by default?|||Bạn định dựng chung clip iPhone và clip Pocket 3 trong cùng một timeline ở Chương 13. Lý do chính để mặc định TẮT HDR Video trên iPhone là gì?',
            options: [
              'HDR Video files cannot be opened by any editing software|||File HDR Video không phần mềm dựng nào mở được',
              'HDR Video permanently reduces the resolution of the recording|||HDR Video làm giảm vĩnh viễn độ phân giải bản ghi',
              'Apple disabled HDR Video for all iPhone 16 models|||Apple đã vô hiệu hoá HDR Video trên mọi model iPhone 16',
              'Pocket 3 only shoots SDR, so starting both cameras in SDR avoids an extra color-space conversion when cutting them together|||Pocket 3 chỉ quay SDR, nên cho cả hai máy cùng xuất phát SDR tránh được một bước đổi không gian màu khi cắt ghép',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: The file itself is not broken in HDR — non-HDR devices simply receive an SDR copy automatically when shared. The real reason is workflow: Pocket 3 never shoots HDR, so matching both cameras to SDR removes one tone-mapping step that is easy to get wrong when editing.|||VI: Bản thân file HDR không hề hỏng — máy không hỗ trợ HDR chỉ tự nhận một bản SDR khi được chia sẻ. Lý do thật nằm ở quy trình dựng: Pocket 3 không bao giờ quay HDR, nên cho cả hai máy cùng ở SDR bớt đi một bước tone-map dễ sai khi dựng.',
          },
          {
            question: 'You want to use a DJI Mic 2 or Mic 3 with Pocket 3 without carrying the separate receiver. How do you connect it?|||Bạn muốn dùng DJI Mic 2 hay Mic 3 với Pocket 3 mà không mang theo receiver rời. Kết nối bằng cách nào?',
            options: [
              'Link it directly over Bluetooth via Control Center → Wireless Microphone|||Link thẳng qua Bluetooth ở Control Center → Wireless Microphone',
              'Plug the transmitter into the USB-C port with the bundled adapter|||Cắm transmitter vào cổng USB-C bằng adapter đi kèm',
              'It is not possible — Mic 2 and Mic 3 always require the physical receiver|||Không thể — Mic 2 và Mic 3 luôn cần receiver vật lý',
              'Connect it to the DJI Mimo app on a phone first, then relay audio over Wi-Fi|||Kết nối qua app DJI Mimo trên điện thoại trước, rồi truyền âm qua Wi-Fi',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: DJI Mic 2 and Mic 3 transmitters link straight to Pocket 3 over Bluetooth with no receiver (DJI calls this OsmoAudio) via Control Center → Wireless Microphone → TX1/TX2. The USB-C adapter path is for the original, un-numbered DJI Mic instead.|||VI: Transmitter của DJI Mic 2 và Mic 3 link thẳng tới Pocket 3 qua Bluetooth, không cần receiver (DJI gọi là OsmoAudio), qua Control Center → Wireless Microphone → TX1/TX2. Đường adapter USB-C là dành cho DJI Mic bản gốc không đánh số.',
          },
          {
            question: 'You drag a Pocket 3 .mp4 clip (H.264 video + AAC audio) into free DaVinci Resolve on the Linux machine and it fails to import. Why?|||Bạn kéo một clip .mp4 từ Pocket 3 (video H.264 + audio AAC) vào DaVinci Resolve free trên máy Linux và nó import lỗi. Vì sao?',
            options: [
              'The Linux machine does not have enough RAM for 4K footage|||Máy Linux không đủ RAM cho cảnh 4K',
              'The .mp4 file extension is not supported on Linux at all|||Đuôi file .mp4 hoàn toàn không được Linux hỗ trợ',
              'DaVinci Resolve free on Linux cannot decode H.264, H.265, or AAC in any container|||DaVinci Resolve free trên Linux không giải mã được H.264, H.265, hay AAC trong bất kỳ container nào',
              'Pocket 3 footage is DRM-protected and can only open on the device that recorded it|||Cảnh quay Pocket 3 bị khoá DRM, chỉ mở được trên đúng máy đã quay nó',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: The free Linux build of Resolve simply cannot decode H.264/H.265 video or AAC audio in any container — MP4 itself is fine as a container. Transcoding the video to DNxHR (or ProRes) and the audio to PCM, as shown in Lesson 6.3, fixes it.|||VI: Bản Resolve free trên Linux đơn giản là không giải mã được video H.264/H.265 hay audio AAC trong bất kỳ container nào — bản thân định dạng MP4 không có vấn đề gì. Chuyển mã video sang DNxHR (hoặc ProRes) và audio sang PCM như ở Bài 6.3 sẽ sửa được.',
          },
          {
            question: 'Your iPhone 16 Pro Max has 128 GB of storage. You try to turn on Apple ProRes at 4K in Settings › Camera › Formats. What happens?|||iPhone 16 Pro Max của bạn có 128GB dung lượng. Bạn thử bật Apple ProRes ở 4K trong Settings › Camera › Formats. Chuyện gì xảy ra?',
            options: [
              'It works exactly the same as on a 256 GB+ model|||Vẫn hoạt động y hệt như trên máy 256GB trở lên',
              '4K ProRes is not available — 128 GB models are limited to 1080p ProRes|||4K ProRes không dùng được — máy 128GB chỉ quay được ProRes ở 1080p',
              'It works, but only in black and white to save space|||Vẫn quay được, nhưng chỉ ra ảnh đen trắng để tiết kiệm dung lượng',
              'ProRes is disabled entirely on every iPhone 16 model|||ProRes bị tắt hoàn toàn trên mọi model iPhone 16',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Apple\'s own storage-tier table restricts 128 GB models to 1080p ProRes only; 256 GB and above are required just to unlock 4K ProRes at 24/25/30 fps, with an external SSD needed on top of that for 4K60/4K120.|||VI: Bảng dung lượng chính thức của Apple giới hạn máy 128GB chỉ quay ProRes ở 1080p; phải từ 256GB trở lên mới mở được ProRes 4K ở 24/25/30fps, và còn cần thêm ổ SSD ngoài cho 4K60/4K120.',
          },
          {
            question: 'You buy a cheap 256 GB microSD card for Pocket 3 with no visible speed rating. Capacity is not the issue — what is the real risk?|||Bạn mua một thẻ microSD 256GB giá rẻ cho Pocket 3, không ghi rõ cấp tốc độ. Dung lượng không phải vấn đề — rủi ro thật sự là gì?',
            options: [
              'The card will not be recognized by Pocket 3 at all|||Pocket 3 sẽ hoàn toàn không nhận ra thẻ',
              'Nothing — any card with enough free space works for 4K|||Không sao cả — bất kỳ thẻ nào còn đủ chỗ trống đều quay 4K được',
              'The battery will drain faster when using an unrated card|||Pin sẽ hết nhanh hơn khi dùng thẻ không rõ nhãn',
              'Without a U3/V30-class sustained write speed, 4K recording can drop frames or corrupt mid-shot|||Không đạt tốc độ ghi liên tục chuẩn U3/V30, cảnh 4K có thể rớt khung hình hoặc hỏng file giữa lúc quay',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Pocket 3 requires a UHS-I Speed Grade 3 (U3) card specifically because 4K writes need a guaranteed minimum sustained speed, not just free space — an unrated card can have plenty of room and still fail mid-recording under sustained 4K write load.|||VI: Pocket 3 yêu cầu thẻ đạt UHS-I Speed Grade 3 (U3) chính vì việc ghi 4K cần tốc độ ghi liên tục tối thiểu được bảo đảm, không chỉ cần chỗ trống — một thẻ không rõ nhãn có thể vẫn còn nhiều dung lượng mà vẫn lỗi giữa lúc ghi 4K liên tục.',
          },
          {
            question: 'You are shooting 4K120 slow motion outdoors at noon in a Vietnamese summer and Pocket 3 suddenly stops recording by itself. Most likely cause?|||Bạn đang quay slow motion 4K120 ngoài trời buổi trưa mùa hè Việt Nam và Pocket 3 tự nhiên dừng quay. Nguyên nhân có khả năng nhất?',
            options: [
              'The camera overheated and stopped recording to protect itself|||Máy quá nhiệt và tự dừng quay để bảo vệ chính nó',
              'The microSD card silently reached its 1 TB maximum|||Thẻ microSD âm thầm đạt tới trần 1TB',
              'D-Log M automatically disables after 10 minutes|||D-Log M tự tắt sau 10 phút',
              'ActiveTrack lost the subject and paused the recording|||ActiveTrack mất chủ thể nên tạm dừng quay',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: DJI\'s own usage notice states the camera stops shooting when it overheats, and demanding modes like 4K120 in direct summer heat are exactly when that happens — not a card limit, a Log timeout, or ActiveTrack behavior.|||VI: Thông báo sử dụng chính thức của DJI nói máy tự dừng quay khi quá nhiệt, và các chế độ nặng như 4K120 dưới nắng hè trực tiếp chính là lúc dễ gặp nhất — không phải do giới hạn thẻ, D-Log M hết giờ, hay hành vi của ActiveTrack.',
          },
          {
            question: 'You have an important client project and will spend real time color grading in Chapter 15. Which setup makes the most sense for this shoot?|||Bạn có một dự án quan trọng cho khách hàng và sẽ dành thời gian thật để chỉnh màu ở Chương 15. Cách cài đặt nào hợp lý nhất cho buổi quay này?',
            options: [
              'Normal color mode on Pocket 3, HDR Video on for the iPhone, to capture the most "everything" possible|||Chế độ màu Normal trên Pocket 3, bật HDR Video trên iPhone, để thu được "mọi thứ" nhiều nhất có thể',
              'Whatever color mode is fastest to shoot, since grading fixes anything in post|||Chế độ màu nào quay nhanh nhất, vì chỉnh màu sau sửa được mọi thứ',
              'D-Log M on Pocket 3 and Apple Log on the iPhone (via Blackmagic Camera or ProRes Log), both graded afterward|||D-Log M trên Pocket 3 và Apple Log trên iPhone (qua Blackmagic Camera hoặc ProRes Log), cả hai đều chỉnh màu sau',
              'Black and white, to avoid color-matching issues between the two cameras entirely|||Đen trắng, để tránh hoàn toàn vấn đề khớp màu giữa hai máy',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Flat log profiles (D-Log M, Apple Log) are exactly for this situation — real grading time planned afterward, and they give the wider dynamic range that makes grading worthwhile. "Whatever is fastest" ignores that un-graded log footage looks worse than Normal, and mixing Normal with HDR creates the same color-space mismatch covered in Lesson 6.2.|||VI: Chế độ màu phẳng (D-Log M, Apple Log) sinh ra đúng cho tình huống này — có thời gian chỉnh màu thật sau đó, và chúng cho dải sáng rộng hơn khiến việc chỉnh màu đáng công. "Chọn cái nhanh nhất" bỏ qua việc cảnh log chưa chỉnh nhìn tệ hơn Normal, còn trộn Normal với HDR lại tạo đúng kiểu lệch không gian màu đã nói ở Bài 6.2.',
          },
        ],
      },
    },
  ],
};
