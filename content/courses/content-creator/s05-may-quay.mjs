/**
 * Content Creator — Chương 5: Máy quay hoạt động thế nào. Song ngữ EN/VI (.ml-en / .ml-vi).
 * ⚠️ KHÔNG backtick trần trong content (dùng &#96;); `${` trong mã mẫu viết \${ ; gạch chéo ngược viết \\
 *
 * Chương này dạy NGUYÊN LÝ (vì sao) — Chương 6 dạy CÀI ĐẶT cụ thể trên Pocket 3
 * và iPhone 16 Pro Max (vì thế nào). Mọi lần nhắc tới một menu cụ thể, bài này
 * trỏ sang Chương 6 thay vì lặp lại.
 *
 * Nguồn số liệu chính (đầy đủ trong báo cáo bàn giao):
 *  - DJI Osmo Pocket 3: dji.com/osmo-pocket-3/specs, dji.com/osmo-pocket-3
 *    (khẩu f/2.0 cố định, bitrate tối đa 130 Mbps, D-Log M 10-bit, HLG 10-bit).
 *  - iPhone 16 Pro Max: support.apple.com/en-us/121032 (ống kính, fps, Dolby
 *    Vision, ProRes, Log), support.apple.com/en-us/109041 (ProRes nặng tới 30
 *    lần HEVC, tốc độ ổ ngoài 220/440 MB/s).
 *  - Quy tắc 180° màn trập: studiobinder.com/blog/what-is-the-180-degree-shutter-rule.
 *  - HEVC vs H.264 cùng chất lượng: trac.ffmpeg.org/wiki/Encode/H.265 (CRF 28 ≈
 *    H.264 CRF 23 — dùng đúng cặp này khi đo thật).
 *  - YouTube HDR: support.google.com/youtube/answer/7126552.
 *  - Điện lưới Việt Nam 220V/50Hz: worldstandards.eu/electricity/plug-voltage-by-country/vietnam.
 *  - Mọi số "đo thật" (bảng codec, bitrate, 8/10-bit) lấy từ ffmpeg/ffprobe chạy
 *    THẬT trên clip lavfi testsrc2 tự sinh trong thư mục scratch của phiên này —
 *    KHÔNG phải số liệu chính thức của DJI/Apple, luôn ghi rõ "đo thật" trong bài.
 */
import { gallery, slide } from './_slides.mjs';

const SLIDES = [
  [1, 'Bìa chương'],
  [2, 'Bản đồ chương'],
  [3, 'Độ phân giải & tỉ lệ khung hình'],
  [4, 'Frame rate — chọn theo việc'],
  [5, 'Điện Việt Nam 50Hz → 25/50fps'],
  [6, 'Tam giác phơi sáng'],
  [7, 'Khẩu độ & độ sâu trường ảnh'],
  [8, 'Màn trập & quy tắc 180°'],
  [9, 'ISO, nhiễu, và kính lọc ND'],
  [10, 'Đọc sáng: zebra · histogram · false color'],
  [11, 'Cân bằng trắng — thang Kelvin'],
  [12, 'Lấy nét: tự động, khoá, và tay'],
  [13, 'Codec: H.264 · HEVC · ProRes — đo thật'],
  [14, 'Bitrate & bit depth — đo thật bằng ffmpeg'],
  [15, 'Normal · HLG · Log — và HDR khi đăng lên mạng'],
  [16, 'Bảng tra nhanh cả chương'],
  [17, 'Thực hành'],
];

export default {
  title: 'Chapter 5 — How cameras work|||Chương 5 — Máy quay hoạt động thế nào',
  description: 'Độ phân giải, tỉ lệ khung hình, frame rate, phơi sáng (khẩu độ · màn trập · ISO · quy tắc 180° · kính ND), cân bằng trắng, lấy nét, codec, bitrate, bit depth, Log/HLG/HDR — quy về đúng hai máy bạn đang có: Pocket 3 và iPhone 16 Pro Max.',
  lessons: [
    /* ─────────────────── 5.0 slide bài giảng ─────────────────── */
    {
      title: '5.0 — Chapter 5 in 17 slides|||5.0 — Chương 5 trong 17 slide',
      slug: 'cr-05-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Toàn bộ nguyên lý máy quay trong 17 slide: độ phân giải, phơi sáng, cân bằng trắng & lấy nét, codec/bitrate/Log — kèm bảng số đo thật bằng ffmpeg.',
      content: `
<div class="ml-en"><h2>📑 Chapter 5 in 17 slides</h2>
<p>This chapter is dense with numbers on purpose: a camera is a machine that turns light into a file, and every one of its settings is a trade-off you can actually calculate. Skim these 17 slides first — slide 5 (Vietnam's 50 Hz mains) and slide 13–14 (real ffmpeg measurements) are the two you will come back to most.</p>
<p>Chapter 6 opens the exact same menus on your own Pocket 3 and iPhone 16 Pro Max. This chapter is the "why" underneath those menus — read it once, and Chapter 6's button-pressing will make sense instead of feeling like memorization.</p></div>
<div class="ml-vi"><h2>📑 Chương 5 trong 17 slide</h2>
<p>Chương này đặc chữ số có chủ đích: máy quay là một cái máy biến ánh sáng thành file, và mọi cài đặt của nó đều là một sự đánh đổi bạn TÍNH ĐƯỢC thật sự. Lướt qua 17 slide này trước — slide 5 (điện 50Hz ở Việt Nam) và slide 13–14 (số đo thật bằng ffmpeg) là hai slide bạn sẽ quay lại nhiều nhất.</p>
<p>Chương 6 mở đúng những menu này trên chính Pocket 3 và iPhone 16 Pro Max của bạn. Chương này là phần "vì sao" nằm dưới các menu đó — đọc một lần, việc bấm nút ở Chương 6 sẽ có LÝ DO thay vì học vẹt.</p></div>
${gallery('cr-05', SLIDES)}
`,
    },

    /* ─────────────────── 5.1 độ phân giải, tỉ lệ khung, fps ─────────────────── */
    {
      title: '5.1 — Resolution, aspect ratio and frame rate|||5.1 — Độ phân giải, tỉ lệ khung hình và frame rate',
      slug: 'cr-05-1-do-phan-giai-fps',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Điểm ảnh, 1080p/4K, tỉ lệ khung hình, frame rate 24–120fps, và vì sao điện 50Hz ở Việt Nam quyết định bạn nên quay 25 hay 50fps chứ không phải 24/30/60.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>Four numbers you set before you press record — not the ones you scroll past on Auto</h2>
<p class="lead">Resolution, aspect ratio and frame rate look like specs you can safely leave on Auto. They are not: get frame rate wrong in a room lit by ordinary bulbs, and every clip you shoot that day has a flicker you cannot fix in the edit. This lesson gives you the concept behind each number, and the one fact about Vietnam's electricity that makes a "correct" tutorial from an American channel wrong for your bedroom.</p>

<h3>A pixel, and what "resolution" actually counts</h3>
<p>A <strong>pixel</strong> (điểm ảnh) is the smallest single-colour square a screen or sensor can show — like one tile in a mosaic. <strong>Resolution</strong> is just the count of those tiles: width × height. <strong>1080p</strong> means 1920×1080 = 2,073,600 pixels, about 2.1 million. <strong>4K</strong> (more precisely UHD, 3840×2160) means 8,294,400 pixels, about 8.3 million.</p>
${slide('cr-05', 3, 'Độ phân giải & tỉ lệ khung hình')}
<div class="callout warn"><p><strong>The doubling trap:</strong> 4K doubles EACH dimension compared to 1080p (3840 is 2× 1920, 2160 is 2× 1080) — so the total pixel count is 2×2 = <strong>4 times</strong> bigger, not 2 times. This is why a 4K file is roughly four times heavier than the same clip in 1080p, not twice.</p></div>
<p>Why shoot 4K if you are going to publish at 1080p anyway? Two real reasons: you can <strong>crop and reframe</strong> in the edit (zoom into a face, fix a slightly wrong composition) without losing sharpness, and you can apply <strong>digital stabilisation</strong> — which works by cropping in slightly and tracking motion — while still delivering a clean 1080p. The cost is size: Lesson 5.4 turns that into an exact number of gigabytes per minute.</p>

<h3>Aspect ratio — the shape of the frame</h3>
<p><strong>Aspect ratio</strong> (tỉ lệ khung hình) is width : height. <strong>16:9</strong> is the traditional horizontal shape (1920×1080) that YouTube and most screens default to. <strong>9:16</strong> is the same rectangle turned on its side (1080×1920) — TikTok, Reels and Shorts. <strong>1:1</strong> is square (1080×1080), and <strong>4:5</strong> (1080×1350) is the tall-ish shape Instagram and Facebook favour in-feed. Chapter 1 covers which platform wants which ratio and why; here you only need to recognise the shapes.</p>
<p>Pocket 3 rotates its own touchscreen 90° and reframes live to 9:16 for vertical shooting — no cropping needed afterward. iPhone has no such switch: you physically turn the phone, and the Camera app records the rotation into the file's metadata.</p>

<h3>Frame rate — how many pictures per second</h3>
${slide('cr-05', 4, 'Frame rate — chọn theo việc')}
<p><strong>Frame rate</strong> (fps, tốc độ khung hình) is how many still pictures the camera captures every second. <strong>24 fps</strong> is cinema's historic standard — just fast enough that the eye reads continuous motion, and cheap on physical film stock. <strong>25 fps</strong> and its double, <strong>50 fps</strong>, are the broadcast standard everywhere mains power runs at 50 Hz — including Vietnam. <strong>30/60 fps</strong> are the equivalent pair for 60 Hz countries (the US, Japan, South Korea). Higher rates — <strong>100/120 fps and beyond</strong> — exist for one purpose: recording material you intend to slow down.</p>
<p><strong>Slow motion</strong> is simple arithmetic once you see it this way: you record at a high fps, then play that footage back at your timeline's normal fps. The slow-down factor is (fps recorded) ÷ (fps of your project). Record at 120 fps, edit on a 25 fps timeline, and that clip plays <strong>4.8× slower</strong> than it happened.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — mixing frame rates between two cameras.</strong> Shoot Pocket 3 at 30 fps and iPhone at 25 fps for the same scene, and the edit will not just look "slightly off" — clips will stutter or judder when cut together, and any attempt to sync two angles breaks. Before an A/B shoot, set every camera to the exact same fps. This is also why Chapter 0 told you to standardise on 25 fps across your whole kit.</p></div>

<h3>Vietnam's mains power runs at 50 Hz — the single most useful number in this chapter</h3>
${slide('cr-05', 5, 'Điện Việt Nam 50Hz → 25/50fps')}
<p>Vietnam's electrical grid runs at 220V/50Hz (worldstandards.eu's country reference confirms this, and it is the same figure used throughout Southeast Asia and Europe — the US and much of the Americas, South Korea, Taiwan and the Philippines are the notable 60Hz exceptions, and Japan is split: 50Hz in the east around Tokyo, 60Hz in the west around Osaka). Ordinary LED and fluorescent lights do not glow at a constant brightness; they flicker at <strong>twice the mains frequency</strong> — 100 times a second here — fast enough that your eyes never notice, but slow enough that a camera's shutter can catch it mid-flicker.</p>
<p>When your shutter speed is not a clean multiple of that 100 Hz rhythm, the mismatch shows up as dark rolling bands scrolling through the footage — worse on some frames than others, maddening to reproduce on demand. The fix has nothing to do with buying better gear: shoot at <strong>25 or 50 fps</strong>, not 24/30/60, so the shutter speed you will set in Lesson 5.2 (1/50 or 1/100) lines up exactly.</p>
<div class="callout warn"><p><strong>Why so many YouTube tutorials get this wrong for you:</strong> most camera tutorials are filmed in the US or target a 60 Hz-default audience, so they default to 24/30/60 fps without a second thought. That default is correct there and a quiet source of flicker here. Vietnam's 50 Hz is the reason this whole course defaults to 25/50 fps.</p></div>

<p class="note-ct"><strong>Connects to next:</strong> Lesson 5.2 turns that 50 Hz fact into an exact shutter speed number (the "180° rule"), and Chapter 6 shows you precisely where to set fps and anti-flicker on both your Pocket 3 and your iPhone.</p>

<h3>🎬 Practice (15–20 minutes)</h3>
<div class="callout ok"><ol>
<li>Record the same 10-second static scene twice: once at 1080p, once at 4K, same camera, same framing.</li>
<li>Under an ordinary indoor LED or fluorescent light, record 10 seconds at 30 fps, then 10 seconds at 25 fps.</li>
<li>Play both pairs back on a real screen (not the camera's own tiny display) and look for horizontal banding in the 30 fps clip.</li>
<li>Run <code>ffprobe</code> on all four files and confirm what each one actually recorded:</li>
</ol>
<pre><code class="language-bash">ffprobe -v error -select_streams v:0 \\
  -show_entries stream=width,height,r_frame_rate,codec_name \\
  -of default=nw=1 canh-quay.mp4</code></pre>
<div class="out">codec_name=h264
width=3840
height=2160
r_frame_rate=25/1</div>
<p>(That output is from a real 4K/25fps test file encoded on this machine; yours will show your own codec and numbers.)</p>
<p><strong>Done when:</strong> you can point at the 30 fps clip and name, out loud, which part of the frame is flickering — and confirm via <code>ffprobe</code> that the 25 fps clip really recorded <code>r_frame_rate=25/1</code>, not just what the on-screen menu claimed.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Pixel</span><span class="v">Điểm ảnh — the smallest single-colour square that makes up an image.</span></div>
<div class="kv"><span class="k">Resolution</span><span class="v">Độ phân giải — the pixel count of an image, given as width × height.</span></div>
<div class="kv"><span class="k">Aspect ratio</span><span class="v">Tỉ lệ khung hình — the width : height shape of the frame (16:9, 9:16, 1:1, 4:5…).</span></div>
<div class="kv"><span class="k">Frame rate (fps)</span><span class="v">Tốc độ khung hình — how many still pictures are captured per second.</span></div>
<div class="kv"><span class="k">Slow motion</span><span class="v">Recording at a high fps and playing it back at a lower one, so time appears to stretch.</span></div>
<div class="kv"><span class="k">Mains frequency</span><span class="v">Tần số điện lưới — how many times per second a country's AC power alternates; 50 Hz in Vietnam.</span></div>
<div class="kv"><span class="k">Flicker banding</span><span class="v">Sọc nhấp nháy — dark rolling bands caused by a shutter speed that does not match a light's flicker rhythm.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>4K has 4× the pixels of 1080p (2× in each dimension) — shoot 4K to crop and stabilise, export 1080p to keep files light.</li>
<li>16:9 (horizontal), 9:16 (vertical), 1:1 and 4:5 are the four shapes you will use across platforms.</li>
<li>Frame rate is pictures per second; slow motion is just recording high and playing back low.</li>
<li>Vietnam runs on 50 Hz mains — default to 25 or 50 fps, never 24/30/60, to avoid flicker under artificial light.</li>
<li>Never mix frame rates between two cameras shooting the same scene.</li>
</ul>
<div class="link-card"><a href="https://www.worldstandards.eu/electricity/plug-voltage-by-country/vietnam/" target="_blank" rel="noopener">World Standards — mains voltage and frequency by country: Vietnam</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Bốn con số bạn đặt TRƯỚC khi bấm quay — không phải thứ để mặc Auto rồi lướt qua</h2>
<p class="lead">Độ phân giải, tỉ lệ khung hình và frame rate trông như thông số cứ để Auto cho lành. Không phải vậy: đặt sai frame rate trong một căn phòng thắp đèn thường, mọi cảnh bạn quay hôm đó đều dính sọc nhấp nháy mà dựng phim không sửa được. Bài này cho bạn NGUYÊN LÝ đằng sau từng con số, và một sự thật về điện Việt Nam khiến video hướng dẫn "chuẩn" của một kênh Mỹ lại SAI cho phòng ngủ của bạn.</p>

<h3>Điểm ảnh là gì, và "độ phân giải" đang đếm cái gì</h3>
<p><strong>Điểm ảnh (pixel)</strong> là ô vuông một màu nhỏ nhất mà màn hình hay cảm biến hiển thị được — giống một viên gạch trong bức tranh ghép mosaic. <strong>Độ phân giải (resolution)</strong> chỉ đơn giản là ĐẾM số viên gạch đó: chiều rộng × chiều cao. <strong>1080p</strong> nghĩa là 1920×1080 = 2.073.600 điểm ảnh, khoảng 2,1 triệu. <strong>4K</strong> (chính xác hơn là UHD, 3840×2160) nghĩa là 8.294.400 điểm ảnh, khoảng 8,3 triệu.</p>
${slide('cr-05', 3, 'Độ phân giải & tỉ lệ khung hình')}
<div class="callout warn"><p><strong>Bẫy phép nhân đôi:</strong> 4K gấp đôi MỖI CHIỀU so với 1080p (3840 = 2× 1920, 2160 = 2× 1080) — nên tổng số điểm ảnh gấp 2×2 = <strong>4 lần</strong>, không phải 2 lần. Đây là lý do file 4K nặng gần gấp bốn lần cùng một cảnh quay ở 1080p, chứ không phải gấp đôi.</p></div>
<p>Vì sao quay 4K nếu cuối cùng vẫn xuất bản ở 1080p? Hai lý do thật: bạn có thể <strong>cắt/phóng lại khung hình (crop, reframe)</strong> trong lúc dựng (zoom vào mặt, sửa một bố cục hơi lệch) mà không mất nét, và có thể áp <strong>ổn định hình điện tử</strong> — vốn hoạt động bằng cách cắt bớt viền và bám theo chuyển động — mà vẫn xuất ra 1080p sạch. Cái giá là dung lượng: Bài 5.4 sẽ biến điều đó thành con số GB/phút chính xác.</p>

<h3>Tỉ lệ khung hình — hình dạng của khung</h3>
<p><strong>Tỉ lệ khung hình (aspect ratio)</strong> là chiều rộng : chiều cao. <strong>16:9</strong> là hình chữ nhật ngang truyền thống (1920×1080) mà YouTube và phần lớn màn hình mặc định. <strong>9:16</strong> là đúng hình chữ nhật đó xoay đứng (1080×1920) — TikTok, Reels, Shorts. <strong>1:1</strong> là hình vuông (1080×1080), và <strong>4:5</strong> (1080×1350) là hình hơi cao mà Instagram và Facebook ưa dùng trong feed. Chương 1 nói nền tảng nào cần tỉ lệ nào và vì sao; ở đây bạn chỉ cần nhận ra được các hình dạng.</p>
<p>Pocket 3 tự xoay màn hình cảm ứng 90° và đổi khung SỐNG sang 9:16 khi quay dọc — không cần cắt lại sau. iPhone không có công tắc kiểu đó: bạn phải xoay VẬT LÝ cả cái điện thoại, và app Camera ghi lại hướng xoay đó vào metadata của file.</p>

<h3>Frame rate — bao nhiêu tấm ảnh mỗi giây</h3>
${slide('cr-05', 4, 'Frame rate — chọn theo việc')}
<p><strong>Frame rate</strong> (fps, tốc độ khung hình) là số tấm ảnh tĩnh máy chụp mỗi giây. <strong>24fps</strong> là chuẩn lịch sử của điện ảnh — vừa đủ nhanh để mắt đọc thành chuyển động liên tục, và tiết kiệm phim nhựa vật lý. <strong>25fps</strong> và số gấp đôi của nó, <strong>50fps</strong>, là chuẩn truyền hình ở mọi nơi dùng điện 50Hz — kể cả Việt Nam. <strong>30/60fps</strong> là cặp tương đương cho các nước dùng điện 60Hz (Mỹ, Nhật, Hàn Quốc). Các mức cao hơn — <strong>100/120fps trở lên</strong> — tồn tại vì đúng MỘT lý do: quay tư liệu để sau đó phát chậm lại.</p>
<p><strong>Slow motion (quay chậm)</strong> là phép tính số học đơn giản một khi bạn nhìn đúng cách: bạn quay ở fps CAO, rồi phát lại đoạn đó ở fps BÌNH THƯỜNG của timeline dự án. Hệ số chậm = (fps lúc quay) ÷ (fps của dự án). Quay ở 120fps, dựng trên timeline 25fps, đoạn đó phát <strong>chậm 4,8 lần</strong> so với lúc diễn ra thật.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — trộn frame rate giữa hai máy.</strong> Quay Pocket 3 ở 30fps và iPhone ở 25fps cho cùng một cảnh, bản dựng không chỉ "hơi khác" — clip sẽ giật/khựng khi ghép cạnh nhau, và mọi nỗ lực đồng bộ hai góc máy đều gãy. Trước một buổi quay A/B, đặt MỌI máy về đúng cùng một fps. Đây cũng là lý do Mục 0 đã dặn chuẩn hoá cả bộ đồ nghề về 25fps.</p></div>

<h3>Điện Việt Nam chạy 50Hz — con số hữu dụng nhất chương này</h3>
${slide('cr-05', 5, 'Điện Việt Nam 50Hz → 25/50fps')}
<p>Lưới điện Việt Nam chạy ở 220V/50Hz (trang tra cứu quốc gia của worldstandards.eu xác nhận điều này, và đây cũng là con số dùng chung ở hầu hết Đông Nam Á và châu Âu — Mỹ và phần lớn châu Mỹ, Hàn Quốc, Đài Loan, Philippines là những ngoại lệ đáng kể dùng 60Hz; riêng Nhật chia đôi: miền đông quanh Tokyo 50Hz, miền tây quanh Osaka 60Hz). Đèn LED và đèn huỳnh quang thường KHÔNG sáng đều liên tục; chúng nhấp nháy ở <strong>gấp đôi tần số điện lưới</strong> — 100 lần mỗi giây ở đây — đủ nhanh để mắt bạn không bao giờ nhận ra, nhưng đủ chậm để màn trập máy quay bắt trúng đúng lúc đang nhấp nháy.</p>
<p>Khi tốc độ màn trập bạn đặt không phải bội số sạch của nhịp 100Hz đó, sự lệch nhịp hiện ra thành các dải tối chạy cuộn qua cảnh quay — khung này nặng hơn khung kia, khó tái hiện lại theo ý muốn. Cách sửa không liên quan gì tới việc mua đồ xịn hơn: quay ở <strong>25 hoặc 50fps</strong>, không phải 24/30/60, để tốc độ màn trập bạn sẽ đặt ở Bài 5.2 (1/50 hoặc 1/100) khớp CHÍNH XÁC.</p>
<div class="callout warn"><p><strong>Vì sao nhiều video hướng dẫn trên YouTube dạy sai cho bạn:</strong> phần lớn video hướng dẫn quay phim được quay ở Mỹ hoặc nhắm tới khán giả mặc định dùng điện 60Hz, nên họ mặc định 24/30/60fps mà không nghĩ thêm. Mặc định đó ĐÚNG ở nơi họ quay và là nguồn gây nhấp nháy âm thầm ở đây. Điện 50Hz của Việt Nam là lý do cả khoá học này mặc định 25/50fps.</p></div>

<p class="note-ct"><strong>Nối với bài sau:</strong> Bài 5.2 biến sự thật 50Hz đó thành một con số màn trập chính xác (quy tắc "180°"), và Chương 6 chỉ đúng chỗ đặt fps và chống nhấp nháy trên cả Pocket 3 lẫn iPhone của bạn.</p>

<h3>🎬 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Quay cùng một cảnh tĩnh 10 giây hai lần: một lần 1080p, một lần 4K, cùng máy, cùng khung hình.</li>
<li>Dưới một đèn LED hoặc huỳnh quang trong nhà bình thường, quay 10 giây ở 30fps, rồi 10 giây ở 25fps.</li>
<li>Phát lại cả hai cặp clip trên một màn hình thật (không phải màn hình bé xíu của máy quay) và tìm sọc ngang trong clip 30fps.</li>
<li>Chạy <code>ffprobe</code> trên cả bốn file để xác nhận máy THẬT SỰ đã ghi gì:</li>
</ol>
<pre><code class="language-bash">ffprobe -v error -select_streams v:0 \\
  -show_entries stream=width,height,r_frame_rate,codec_name \\
  -of default=nw=1 canh-quay.mp4</code></pre>
<div class="out">codec_name=h264
width=3840
height=2160
r_frame_rate=25/1</div>
<p>(Kết quả trên lấy từ một file thử 4K/25fps thật được mã hoá trên máy này; file của bạn sẽ hiện đúng codec và con số của chính nó.)</p>
<p><strong>Đạt khi:</strong> bạn chỉ được, thành lời, đúng phần nào của khung hình đang nhấp nháy trong clip 30fps — và xác nhận bằng <code>ffprobe</code> rằng clip 25fps thật sự ghi <code>r_frame_rate=25/1</code>, không chỉ tin vào những gì menu trên màn hình nói.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Pixel</span><span class="v">Điểm ảnh — ô vuông một màu nhỏ nhất tạo nên một tấm hình.</span></div>
<div class="kv"><span class="k">Resolution</span><span class="v">Độ phân giải — số điểm ảnh của một hình, ghi dưới dạng chiều rộng × chiều cao.</span></div>
<div class="kv"><span class="k">Aspect ratio</span><span class="v">Tỉ lệ khung hình — hình dạng rộng : cao của khung (16:9, 9:16, 1:1, 4:5…).</span></div>
<div class="kv"><span class="k">Frame rate (fps)</span><span class="v">Tốc độ khung hình — số tấm ảnh tĩnh được ghi mỗi giây.</span></div>
<div class="kv"><span class="k">Slow motion</span><span class="v">Quay chậm — quay ở fps cao rồi phát lại ở fps thấp hơn, khiến thời gian như giãn ra.</span></div>
<div class="kv"><span class="k">Mains frequency</span><span class="v">Tần số điện lưới — số lần dòng điện xoay chiều đảo chiều mỗi giây; 50Hz ở Việt Nam.</span></div>
<div class="kv"><span class="k">Flicker banding</span><span class="v">Sọc nhấp nháy — các dải tối chạy qua khung hình do màn trập không khớp nhịp nhấp nháy của đèn.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>4K có gấp 4 lần điểm ảnh của 1080p (gấp đôi mỗi chiều) — quay 4K để crop/ổn định, xuất 1080p để file nhẹ.</li>
<li>16:9 (ngang), 9:16 (dọc), 1:1 và 4:5 là bốn hình dạng bạn sẽ dùng trên các nền tảng.</li>
<li>Frame rate là số ảnh mỗi giây; slow motion chỉ là quay nhanh rồi phát chậm.</li>
<li>Việt Nam dùng điện 50Hz — mặc định 25 hoặc 50fps, không bao giờ 24/30/60, để tránh nhấp nháy dưới đèn điện.</li>
<li>Đừng bao giờ trộn frame rate giữa hai máy quay cùng một cảnh.</li>
</ul>
<div class="link-card"><a href="https://www.worldstandards.eu/electricity/plug-voltage-by-country/vietnam/" target="_blank" rel="noopener">World Standards — điện áp và tần số điện theo quốc gia: Việt Nam</a></div>
</div>
`,
    },

    /* ─────────────────── 5.2 phơi sáng ─────────────────── */
    {
      title: '5.2 — Exposure: aperture, shutter, ISO and ND filters|||5.2 — Phơi sáng: khẩu độ, màn trập, ISO và kính lọc ND',
      slug: 'cr-05-2-phoi-sang',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Tam giác phơi sáng, khẩu độ & độ sâu trường ảnh, màn trập & quy tắc 180°, ISO & nhiễu, vì sao máy khẩu cố định cần kính lọc ND, và cách đọc sáng bằng zebra/histogram/false color thay vì bằng mắt.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>Exposure is not "brightness" — it's three dials fighting over the same job</h2>
<p class="lead">Point a camera at a scene and it has to decide how much light reaches the sensor for every single frame. Get that decision wrong and no amount of software fixes it cleanly afterward — a blown-out sky stays blown out, a black silhouette stays black. This lesson gives you the three dials that control exposure, the one shutter-speed rule worth memorising, and the one piece of gear (an ND filter) that Pocket 3 and iPhone owners specifically need and generic camera tutorials rarely mention.</p>

<h3>The exposure triangle — three dials, one goal</h3>
<p><strong>Exposure</strong> is simply how much light the sensor collects for one frame. Three settings control it, and they trade off against each other like three taps filling the same bucket: open one wider and you can close another. Think of it as filling a glass with water through a funnel: <strong>aperture</strong> is how wide the funnel opens, <strong>shutter speed</strong> is how long you hold it open, and <strong>ISO</strong> is how sensitive the glass itself is to registering what lands in it.</p>
${slide('cr-05', 6, 'Tam giác phơi sáng')}
<p>Move any one dial and the image gets brighter or darker — but each dial ALSO changes something besides brightness: aperture changes how much of the scene is in focus, shutter speed changes how motion blurs, and ISO changes how much grain appears. That side effect is the real reason you cannot just leave everything on Auto and call it done.</p>

<h3>Aperture & depth of field</h3>
<p><strong>Aperture</strong> is the size of the opening light passes through, written as an <strong>f-number</strong> (f/1.8, f/2.8, f/11…). The number is confusing on purpose the first time you see it: it is a ratio, so a SMALLER f-number means a WIDER opening and MORE light — f/1.8 lets in far more light than f/11.</p>
${slide('cr-05', 7, 'Khẩu độ & độ sâu trường ảnh')}
<p>The side effect is <strong>depth of field</strong> (độ sâu trường ảnh) — how much of the scene, front to back, looks sharp. A wide aperture (small f-number) keeps your subject sharp and blurs the background into soft shapes (often called "bokeh"); a narrow aperture (large f-number) keeps almost everything sharp, front to back.</p>
<p>Here is the part generic tutorials skip: Pocket 3 and iPhone's main lens both have a <strong>fixed aperture</strong> — f/2.0 on Pocket 3, f/1.78 on the iPhone's main lens (per DJI's and Apple's own spec pages). There is no ring or menu to change it; you cannot stop it down to f/11 to get everything sharp. Your depth of field on these two cameras is set by physics the moment you bought them — the only levers left are distance to subject and focal length, both covered in Chapter 7.</p>

<h3>Shutter speed & the 180° rule</h3>
${slide('cr-05', 8, 'Màn trập & quy tắc 180°')}
<p><strong>Shutter speed</strong> is how long the sensor collects light for each single frame — written as a fraction of a second (1/50, 1/1000…). Longer exposure per frame means more light AND more motion blur; shorter means less light and crisper, more "stuttery" motion.</p>
<p>Cinematographers converged on a rule of thumb generations ago, now called the <strong>180° rule</strong>: set your shutter speed to roughly double your frame rate. At 25 fps, that is <strong>1/50</strong>; at 50 fps, <strong>1/100</strong>; at 24 fps, the nearest common value is also 1/50 (StudioBinder's breakdown of the rule walks through why — it traces back to mechanical rotating shutters that physically opened for exactly half of each frame interval). That ratio happens to produce motion blur that reads as natural to the human eye — not the harsh stutter of a too-fast shutter, not the smeared blur of a too-slow one.</p>
<div class="callout ok"><p><strong>Breaking the rule on purpose:</strong> a much faster shutter (1/1000+) gives the crisp, staccato look used in some action and war films — <em>Saving Private Ryan</em>'s battle scenes are the textbook example. A much slower shutter adds heavier blur, sometimes used for a dreamy or extra-smooth look, or simply to let in more light in dim rooms. Both are legitimate choices — just make them on purpose, not by accident.</p></div>
<div class="callout warn"><p><strong>Do not confuse this with Chapter 7's "180° rule."</strong> Same two words, completely different idea: this one is about shutter timing (this lesson). Chapter 7's 180° rule is about camera placement relative to your subjects during an edit, so cuts do not flip your sense of who is facing which way. The name collision is a real trap for beginners searching this term online.</p></div>

<h3>ISO & noise</h3>
<p><strong>ISO</strong> is how strongly the camera electronically amplifies the signal it received — it does not capture more real light, it turns up the volume on what is already there. Low ISO (100–400) stays clean but needs genuinely bright conditions. High ISO (1600 and up) brightens a dim scene but adds visible <strong>noise</strong> — a grainy, speckled texture, worst in shadows.</p>

<h3>Fixed aperture, sunny days, and why you need an ND filter</h3>
${slide('cr-05', 9, 'ISO, nhiễu, và kính lọc ND')}
<p>Here is where the fixed-aperture fact from earlier bites: outdoors on a bright day, the 180° rule says keep your shutter at 1/50. On a camera with an adjustable aperture, you would simply close the aperture down (a bigger f-number) to cut the light. Pocket 3 and iPhone cannot do that — their aperture never changes. Push ISO down to its minimum and the image can still be badly overexposed in direct sunlight.</p>
<p>The fix is a piece of glass, not a menu setting: an <strong>ND filter</strong> (Neutral Density — kính lọc trung tính) mounts in front of the lens and blocks a fixed portion of incoming light evenly across all colours — like sunglasses for your camera. It lets you keep the "correct" shutter speed and ISO for natural motion and a clean image, even in harsh sun. ND filters are labelled by how much light they block (ND8, ND16, ND32…) or come as a single variable filter (VND) you twist to adjust.</p>

<h3>Reading exposure by numbers, not by eye</h3>
${slide('cr-05', 10, 'Đọc sáng: zebra · histogram · false color')}
<p>A camera's own screen is a bad judge of exposure — it auto-brightens itself so you can see it outdoors, which quietly lies to you about how the actual file looks. Professionals read exposure with tools that show real numbers instead: a <strong>waveform</strong> (the three graphs above) plots brightness from 0 to 100 across the width of the frame — a well-exposed shot spreads out in the middle without slamming into either edge. <strong>Zebra</strong> stripes animate over any area crossing a brightness threshold you set. <strong>False colour</strong> paints the whole image in flat colour bands, each colour meaning a specific exposure level. All three do the same job by different means: replace guessing with a number. Blackmagic Camera (Chapter 6) exposes all of these on an iPhone.</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — trusting the camera's own display outdoors.</strong> A small screen at full brightness in direct sun looks acceptable for almost any exposure — you genuinely cannot tell "slightly overexposed" from "badly overexposed" by eye alone in that condition. This is exactly why the waveform/zebra/false colour tools exist: bring the file back to a real screen and it can be a very different, unpleasant surprise.</p></div>

<p class="note-ct"><strong>Connects to next:</strong> Lesson 5.3 covers the two settings exposure does not touch — colour temperature and focus — and Chapter 6 shows exactly where PRO/Manual exposure lives in Pocket 3 and iPhone's Settings.</p>

<h3>🎬 Practice (20–30 minutes)</h3>
<div class="callout ok"><ol>
<li>Indoors, keep shutter and ISO fixed and change only aperture if your camera allows it (or brightness/exposure compensation if it does not) — watch depth of field shift.</li>
<li>Set shutter to the 180°-rule value for your fps (1/50 at 25fps) and shoot a 10-second clip of someone waving a hand — then shoot 10 seconds at 1/1000 of the same motion and compare the blur.</li>
<li>Outdoors at midday, try to hold 1/50 shutter without an ND filter and note how overexposed it looks; if you own sunglasses or any ND filter, hold it in front of the lens and compare.</li>
<li>If your app exposes a waveform or histogram (Blackmagic Camera, or your camera's own overlay), frame the same scene and read the graph before and after adjusting exposure.</li>
</ol><p><strong>Done when:</strong> you can explain, in one sentence each, what happens to the image if you ONLY change aperture, ONLY change shutter speed, or ONLY change ISO — without looking back at this lesson.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Exposure</span><span class="v">Phơi sáng — the total amount of light the sensor collects for one frame.</span></div>
<div class="kv"><span class="k">Aperture / f-number</span><span class="v">Khẩu độ — the size of the lens opening; a SMALLER f-number means a WIDER opening.</span></div>
<div class="kv"><span class="k">Depth of field</span><span class="v">Độ sâu trường ảnh — how much of the scene, front to back, appears in focus.</span></div>
<div class="kv"><span class="k">Shutter speed</span><span class="v">Tốc độ màn trập — how long the sensor collects light for each frame.</span></div>
<div class="kv"><span class="k">180° rule</span><span class="v">Set shutter speed to roughly double your frame rate for natural-looking motion blur.</span></div>
<div class="kv"><span class="k">ISO</span><span class="v">How strongly the camera electronically amplifies the signal it received.</span></div>
<div class="kv"><span class="k">Noise / grain</span><span class="v">Nhiễu hạt — a speckled texture that appears at high ISO, worst in shadows.</span></div>
<div class="kv"><span class="k">ND filter</span><span class="v">Kính lọc trung tính (Neutral Density) — glass that blocks light evenly without changing colour.</span></div>
<div class="kv"><span class="k">Waveform / zebra / false colour</span><span class="v">On-screen tools that show exposure as data instead of a guess.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Aperture, shutter speed and ISO all control brightness — and each one also changes something else (focus, blur, noise).</li>
<li>The 180° rule: shutter speed ≈ double your frame rate (1/50 at 25fps, 1/100 at 50fps) for natural motion blur — a different "180°" from Chapter 7's editing rule.</li>
<li>Pocket 3 (f/2.0) and iPhone's main lens (f/1.78) have fixed apertures — depth of field is set by physics, not a menu.</li>
<li>A fixed aperture plus bright sun means you need an ND filter to keep the correct shutter speed without overexposing.</li>
<li>Trust waveform/zebra/false colour over the camera's own screen, especially outdoors.</li>
</ul>
<div class="link-card"><a href="https://www.studiobinder.com/blog/what-is-the-180-degree-shutter-rule/" target="_blank" rel="noopener">StudioBinder — what the 180-degree shutter rule is, and when to break it</a></div>
<div class="link-card"><a href="https://www.dji.com/osmo-pocket-3/specs" target="_blank" rel="noopener">DJI — Osmo Pocket 3 specifications (fixed f/2.0 aperture)</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>Phơi sáng không phải "độ sáng" — đó là ba núm vặn tranh nhau làm cùng một việc</h2>
<p class="lead">Chĩa máy quay vào một cảnh, nó phải quyết định bao nhiêu ánh sáng chạm tới cảm biến cho MỖI khung hình. Quyết định sai thì không phần mềm nào sửa sạch được sau đó — trời cháy trắng vẫn cháy trắng, bóng đen vẫn đen. Bài này cho bạn ba núm vặn điều khiển phơi sáng, một quy tắc màn trập đáng nhớ nhất, và một món đồ (kính lọc ND) mà người dùng Pocket 3 và iPhone CẦN riêng mà video hướng dẫn chung chung hiếm khi nhắc tới.</p>

<h3>Tam giác phơi sáng — ba núm vặn, một mục tiêu</h3>
<p><strong>Phơi sáng (exposure)</strong> đơn giản là lượng ánh sáng cảm biến thu được cho MỘT khung hình. Ba cài đặt điều khiển nó, và chúng đánh đổi lẫn nhau như ba vòi nước cùng đổ vào một cái xô: mở rộng vòi này thì có thể khép bớt vòi kia. Hãy hình dung như rót nước vào ly qua một cái phễu: <strong>khẩu độ</strong> là phễu mở rộng bao nhiêu, <strong>màn trập</strong> là bạn giữ phễu mở bao lâu, và <strong>ISO</strong> là cái ly nhạy tới đâu với lượng nước rơi vào.</p>
${slide('cr-05', 6, 'Tam giác phơi sáng')}
<p>Vặn bất kỳ núm nào, hình sẽ sáng hơn hoặc tối hơn — nhưng mỗi núm CÒN đổi thêm một thứ khác ngoài độ sáng: khẩu độ đổi phần cảnh nào đang nét, màn trập đổi chuyển động nhoè ra sao, ISO đổi lượng nhiễu hạt xuất hiện. Hiệu ứng phụ đó mới là lý do thật sự khiến bạn không thể cứ để Auto rồi coi như xong.</p>

<h3>Khẩu độ & độ sâu trường ảnh</h3>
<p><strong>Khẩu độ (aperture)</strong> là kích thước lỗ mở cho ánh sáng đi qua, viết dưới dạng <strong>f-number</strong> (f/1.8, f/2.8, f/11…). Con số này gây rối cho người mới lần đầu thấy có chủ đích: nó là một TỈ SỐ, nên số CÀNG NHỎ nghĩa là lỗ mở CÀNG RỘNG và CÀNG NHIỀU sáng — f/1.8 lọt sáng nhiều hơn f/11 rất nhiều.</p>
${slide('cr-05', 7, 'Khẩu độ & độ sâu trường ảnh')}
<p>Hiệu ứng phụ là <strong>độ sâu trường ảnh (depth of field)</strong> — bao nhiêu phần của cảnh, từ trước ra sau, trông nét. Khẩu mở rộng (số f nhỏ) giữ chủ thể nét và làm hậu cảnh mờ thành các khối mềm (hay gọi "bokeh"); khẩu khép hẹp (số f lớn) giữ gần như mọi thứ đều nét, từ trước ra sau.</p>
<p>Đây là phần video hướng dẫn chung chung hay bỏ qua: ống kính chính của cả Pocket 3 lẫn iPhone đều có <strong>khẩu độ CỐ ĐỊNH</strong> — f/2.0 trên Pocket 3, f/1.78 trên ống chính của iPhone (theo đúng trang thông số của DJI và Apple). Không có vòng xoay hay menu nào để đổi nó; bạn không thể khép xuống f/11 để mọi thứ đều nét. Độ sâu trường ảnh trên hai máy này bị VẬT LÝ quyết định sẵn ngay từ lúc bạn mua máy — đòn bẩy còn lại chỉ là khoảng cách tới chủ thể và tiêu cự, cả hai nằm ở Chương 7.</p>

<h3>Màn trập & quy tắc 180°</h3>
${slide('cr-05', 8, 'Màn trập & quy tắc 180°')}
<p><strong>Màn trập (shutter speed)</strong> là khoảng thời gian cảm biến thu sáng cho MỖI khung hình đơn — viết dưới dạng phân số giây (1/50, 1/1000…). Phơi sáng lâu hơn mỗi khung nghĩa là nhiều sáng hơn VÀ nhiều nhoè chuyển động hơn; ngắn hơn nghĩa là ít sáng hơn và chuyển động sắc nét, "giật" hơn.</p>
<p>Dân làm phim đúc kết một quy tắc từ nhiều thế hệ trước, giờ gọi là <strong>quy tắc 180°</strong>: đặt màn trập bằng khoảng GẤP ĐÔI frame rate. Ở 25fps, đó là <strong>1/50</strong>; ở 50fps, <strong>1/100</strong>; ở 24fps, giá trị gần nhất thường dùng cũng là 1/50 (bài phân tích của StudioBinder giải thích vì sao — nó bắt nguồn từ đĩa chớp cơ học xoay, vốn mở đúng một nửa mỗi khoảng khung hình). Tỉ lệ đó tình cờ tạo ra độ nhoè chuyển động mà mắt người đọc là "tự nhiên" — không giật cứng như màn trập quá nhanh, không nhoè bệt như màn trập quá chậm.</p>
<div class="callout ok"><p><strong>Phá lệ có chủ đích:</strong> màn trập nhanh hơn nhiều (1/1000+) tạo cảm giác sắc, giật từng khung — dùng trong một số phim hành động/chiến tranh, cảnh chiến trận của <em>Saving Private Ryan</em> là ví dụ kinh điển. Màn trập chậm hơn nhiều thêm nhoè nặng, đôi khi dùng cho cảm giác mơ màng hoặc cực mượt, hoặc đơn giản để lọt thêm sáng trong phòng tối. Cả hai đều là lựa chọn hợp lệ — miễn là làm CÓ CHỦ ĐÍCH, không phải do nhầm lẫn.</p></div>
<div class="callout warn"><p><strong>Đừng nhầm với "quy tắc 180°" ở Chương 7.</strong> Cùng hai chữ, hai ý hoàn toàn khác nhau: cái này nói về nhịp màn trập (bài này). Quy tắc 180° ở Chương 7 nói về vị trí máy quay so với các nhân vật trong lúc dựng, để cảnh cắt không làm đảo lộn cảm giác ai đang quay mặt về hướng nào. Trùng tên là một cái bẫy thật cho người mới khi tự tìm thuật ngữ này trên mạng.</p></div>

<h3>ISO & nhiễu</h3>
<p><strong>ISO</strong> là mức máy KHUẾCH ĐẠI ĐIỆN TỬ tín hiệu đã thu được — nó không thu thêm ánh sáng thật, nó chỉ "vặn to" thứ đã có sẵn. ISO thấp (100–400) giữ hình sạch nhưng cần điều kiện thật sự đủ sáng. ISO cao (1600 trở lên) làm sáng một cảnh tối nhưng thêm <strong>nhiễu</strong> nhìn thấy được — một lớp hạt lấm tấm, rõ nhất ở vùng bóng tối.</p>

<h3>Khẩu cố định, trời nắng, và vì sao cần kính lọc ND</h3>
${slide('cr-05', 9, 'ISO, nhiễu, và kính lọc ND')}
<p>Đây là chỗ sự thật "khẩu cố định" ở trên cắn ngược lại: ngoài trời giữa ban ngày, quy tắc 180° nói giữ màn trập ở 1/50. Trên một máy có khẩu chỉnh được, bạn chỉ cần khép khẩu lại (số f lớn hơn) để bớt sáng. Pocket 3 và iPhone không làm được điều đó — khẩu độ của chúng KHÔNG BAO GIỜ đổi. Kéo ISO xuống mức thấp nhất, hình vẫn có thể bị cháy sáng nặng dưới nắng trực tiếp.</p>
<p>Cách sửa là một miếng kính, không phải một mục trong menu: <strong>kính lọc ND</strong> (Neutral Density — trung tính về mật độ) gắn trước ống kính, chặn một PHẦN sáng cố định đều trên mọi màu — giống kính râm cho máy quay. Nó cho phép bạn giữ đúng màn trập và ISO "chuẩn" cho chuyển động tự nhiên và hình sạch, ngay cả dưới nắng gắt. Kính ND được ghi nhãn theo lượng sáng chặn được (ND8, ND16, ND32…) hoặc có loại xoay chỉnh được một kính duy nhất (VND).</p>

<h3>Đọc sáng bằng số, không đoán bằng mắt</h3>
${slide('cr-05', 10, 'Đọc sáng: zebra · histogram · false color')}
<p>Màn hình của chính máy quay là "trọng tài" tồi cho phơi sáng — nó tự tăng sáng để bạn nhìn được ngoài trời, và âm thầm nói dối bạn về việc file thật trông ra sao. Dân chuyên nghiệp đọc phơi sáng bằng công cụ hiện SỐ THẬT thay vì đoán: <strong>waveform</strong> (dạng sóng, ba biểu đồ ở trên) vẽ độ sáng từ 0 tới 100 trải theo chiều ngang khung hình — một cảnh đủ sáng trải đều ở giữa, không dồn sát hai mép. <strong>Zebra</strong> kẻ sọc động chạy trên bất kỳ vùng nào vượt ngưỡng sáng bạn đặt. <strong>False color</strong> tô cả hình bằng các dải màu phẳng, mỗi màu ứng với một mức phơi sáng cụ thể. Cả ba làm cùng một việc bằng cách khác nhau: thay việc đoán bằng một con số. Blackmagic Camera (Chương 6) có đủ cả ba lớp phủ này trên iPhone.</p>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — tin vào màn hình của chính máy quay khi ở ngoài trời.</strong> Một màn hình bé ở độ sáng tối đa dưới nắng gắt trông "tạm ổn" với gần như MỌI mức phơi sáng — bạn thật sự không phân biệt được "hơi cháy sáng" với "cháy sáng nặng" chỉ bằng mắt trong điều kiện đó. Đây chính xác là lý do các công cụ waveform/zebra/false color tồn tại: đem file về một màn hình thật có thể là một bất ngờ rất khó chịu, rất khác.</p></div>

<p class="note-ct"><strong>Nối với bài sau:</strong> Bài 5.3 nói về hai cài đặt mà phơi sáng KHÔNG đụng tới — nhiệt độ màu và lấy nét — và Chương 6 chỉ đúng chỗ Manual/PRO exposure nằm trong Settings của Pocket 3 và iPhone.</p>

<h3>🎬 Thực hành (20–30 phút)</h3>
<div class="callout ok"><ol>
<li>Trong nhà, giữ nguyên màn trập và ISO, chỉ đổi khẩu độ nếu máy cho phép (hoặc bù trừ phơi sáng nếu không) — quan sát độ sâu trường ảnh đổi thế nào.</li>
<li>Đặt màn trập theo quy tắc 180° cho fps đang dùng (1/50 ở 25fps) và quay 10 giây một người vẫy tay — rồi quay 10 giây cùng động tác đó ở 1/1000, so sánh độ nhoè.</li>
<li>Ngoài trời giữa trưa, thử giữ màn trập 1/50 mà không có kính ND, xem hình cháy sáng ra sao; nếu có kính râm hoặc bất kỳ kính lọc ND nào, áp trước ống kính và so sánh.</li>
<li>Nếu app của bạn có waveform hay histogram (Blackmagic Camera, hoặc lớp phủ có sẵn trên máy), canh cùng một cảnh và đọc biểu đồ trước và sau khi chỉnh phơi sáng.</li>
</ol><p><strong>Đạt khi:</strong> bạn giải thích được, mỗi ý một câu, điều gì xảy ra với hình nếu CHỈ đổi khẩu độ, CHỈ đổi màn trập, hoặc CHỈ đổi ISO — mà không cần xem lại bài này.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Exposure</span><span class="v">Phơi sáng — tổng lượng ánh sáng cảm biến thu được cho một khung hình.</span></div>
<div class="kv"><span class="k">Aperture / f-number</span><span class="v">Khẩu độ — kích thước lỗ mở ống kính; số CÀNG NHỎ nghĩa là lỗ mở CÀNG RỘNG.</span></div>
<div class="kv"><span class="k">Depth of field</span><span class="v">Độ sâu trường ảnh — bao nhiêu phần của cảnh, từ trước ra sau, trông nét.</span></div>
<div class="kv"><span class="k">Shutter speed</span><span class="v">Tốc độ màn trập — khoảng thời gian cảm biến thu sáng cho mỗi khung hình.</span></div>
<div class="kv"><span class="k">Quy tắc 180°</span><span class="v">Đặt màn trập bằng khoảng gấp đôi frame rate để nhoè chuyển động trông tự nhiên.</span></div>
<div class="kv"><span class="k">ISO</span><span class="v">Mức máy khuếch đại điện tử tín hiệu đã thu được.</span></div>
<div class="kv"><span class="k">Noise / grain</span><span class="v">Nhiễu hạt — lớp hạt lấm tấm xuất hiện ở ISO cao, rõ nhất trong vùng tối.</span></div>
<div class="kv"><span class="k">Kính lọc ND</span><span class="v">Neutral Density — kính chặn sáng đều mà không đổi màu.</span></div>
<div class="kv"><span class="k">Waveform / zebra / false color</span><span class="v">Công cụ trên màn hình hiện phơi sáng bằng dữ liệu thay vì đoán.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Khẩu độ, màn trập và ISO đều điều khiển độ sáng — và mỗi thứ còn đổi thêm một điều khác (nét, nhoè, nhiễu).</li>
<li>Quy tắc 180°: màn trập ≈ gấp đôi frame rate (1/50 ở 25fps, 1/100 ở 50fps) để nhoè chuyển động tự nhiên — khác với "180°" trong dựng cảnh ở Chương 7.</li>
<li>Pocket 3 (f/2.0) và ống chính iPhone (f/1.78) có khẩu độ cố định — độ sâu trường ảnh do vật lý quyết định, không phải một menu.</li>
<li>Khẩu cố định cộng trời nắng nghĩa là bạn cần kính lọc ND để giữ đúng màn trập mà không cháy sáng.</li>
<li>Tin vào waveform/zebra/false color hơn là màn hình của chính máy quay, nhất là ngoài trời.</li>
</ul>
<div class="link-card"><a href="https://www.studiobinder.com/blog/what-is-the-180-degree-shutter-rule/" target="_blank" rel="noopener">StudioBinder — quy tắc màn trập 180° là gì, và khi nào nên phá nó</a></div>
<div class="link-card"><a href="https://www.dji.com/osmo-pocket-3/specs" target="_blank" rel="noopener">DJI — thông số Osmo Pocket 3 (khẩu độ cố định f/2.0)</a></div>
</div>
`,
    },

    /* ─────────────────── 5.3 cân bằng trắng & lấy nét ─────────────────── */
    {
      title: '5.3 — White balance and focus|||5.3 — Cân bằng trắng và lấy nét',
      slug: 'cr-05-3-can-bang-trang-lay-net',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Nhiệt độ màu Kelvin, vì sao phải khoá cân bằng trắng khi quay video, ánh sáng hỗn hợp, lấy nét tự động theo chủ thể, khoá nét, và lấy nét tay.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.3</span>
<h2>White balance and focus: the two dials exposure never touches</h2>
<p class="lead">You can nail aperture, shutter and ISO perfectly and still ruin a shot two different ways: skin tones that shift colour mid-sentence, or a face that slides out of focus the moment someone walks past the lens. Neither problem is about light QUANTITY — the thing Lesson 5.2 covered — they are about light's COLOUR and about where the lens is actually pointed. This lesson covers both, and the one habit (locking white balance) that separates footage that cuts together cleanly from footage that does not.</p>

<h3>Colour temperature — why light has a colour at all</h3>
<p>Light is not colourless. A candle flame, an incandescent bulb, daylight and open shade in blue sky all cast noticeably different colours onto whatever they light — this is <strong>colour temperature</strong>, measured in <strong>Kelvin (K)</strong>. Your eyes and brain correct for this automatically and continuously: a white page looks white to you whether you are reading it under a warm lamp or cool daylight, because your brain silently recalibrates. A camera has no brain to do that for you — it records the actual colour of the light, which is why it needs to be told (or guess) what "white" should look like.</p>
${slide('cr-05', 11, 'Cân bằng trắng — thang Kelvin')}
<p>The lower the Kelvin number, the more orange/yellow the light (candlelight ~1900K, incandescent bulbs/sunset ~3200K); the higher the number, the more blue (open shade ~9000K, overcast sky higher still). Ordinary daylight sits around 5600K, and most LED panels aimed at "neutral" sit near 5000K.</p>

<h3>Why you must LOCK white balance for video</h3>
<p><strong>Auto White Balance (AWB)</strong> constantly re-guesses the correct colour every few seconds based on whatever is currently in frame — genuinely useful for photos, where each shot is independent, and quietly harmful for video: partway through one continuous take, if someone in a red shirt walks through frame, or the camera pans slightly to reveal a bright window, AWB can silently "jump" colour mid-shot. Viewers will not consciously name what is wrong — they will just feel that skin tone looks slightly off partway through the clip.</p>
<p>The fix is to pick a Kelvin value manually, or lock whatever AWB has already settled on, before you start rolling — and hold it for the whole scene. Chapter 6 shows exactly where that toggle lives on Pocket 3 and iPhone.</p>

<h3>Mixed lighting — when no single Kelvin value is "right"</h3>
<p>Real rooms often have more than one light source with different colour temperatures at once — daylight through a window (around 5600K) alongside a warm desk lamp (around 3200K) in the same shot. No single white balance setting makes both sources look correct simultaneously; you either pick the value that matches your <strong>key light</strong> (the main light on your face, Chapter 8 names this properly) and let the other source render with a colour cast, or add a coloured gel to one light so both sources match before you ever press record. Chapter 8 goes deep on that fix — for now, just recognise the symptom: one part of the frame looks orange, another looks blue, and no single white balance number in the menu fixes both at once.</p>

<h3>Focus: subject-tracking AF, focus lock, and manual focus</h3>
${slide('cr-05', 12, 'Lấy nét: tự động, khoá, và tay')}
<p>Modern <strong>autofocus (AF)</strong> on both Pocket 3 and iPhone detects faces and subjects and tracks them as they move — a reasonable default for most of what this course shoots. <strong>Focus lock</strong> (sometimes AF/AE Lock) freezes whatever point the camera already focused on, so it does not suddenly re-focus onto something else — a hand passing in front of the lens, or the background, the moment your subject briefly steps out of frame. <strong>Manual focus (MF)</strong> hands you full control and removes any risk of AF "hunting" mid-take, at the cost of needing practice judging distance — often paired with a focus-assist tool like focus peaking (mentioned in Lesson 5.2).</p>
<p>This connects straight back to depth of field from Lesson 5.2: the wider the aperture (the smaller the f-number), the THINNER the zone that is actually in focus — miss it by a small margin and the shot is visibly soft. Pocket 3 and iPhone's fairly wide fixed apertures (f/1.78–f/2.0) mean this thin zone is a real, everyday concern, not a rare edge case.</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — AWB or AF quietly changing mid-take when you are filming yourself alone.</strong> With no one watching the monitor, you will not catch a colour jump or a focus hunt live — you only discover it in the edit, once it is too late to reshoot the exact same moment. Lock white balance and focus before you start talking, every single time, especially when there is no one else on set to catch the mistake for you (Chapter 10 covers solo shooting in depth).</p></div>

<p class="note-ct"><strong>Connects to next:</strong> Lesson 5.4 is where all of this — resolution, exposure, colour — actually gets written to a file: codec, bitrate, bit depth and the Log profiles that decide how much of what your sensor saw survives into the final export.</p>

<h3>🎬 Practice (15–20 minutes)</h3>
<div class="callout ok"><ol>
<li>Manually set white balance to match the main light in your room (use the Kelvin values on the slide above as a starting guess) and record 10 seconds.</li>
<li>Switch to Auto White Balance, record the same 10 seconds, and deliberately let something colourful pass through frame partway through.</li>
<li>Play both back side by side and describe, out loud, exactly where the AWB clip's colour shifts.</li>
<li>Frame a subject with AF enabled, then have someone walk between you and the lens — watch whether focus jumps to them and how quickly it returns.</li>
</ol><p><strong>Done when:</strong> you can point to the exact second AWB's colour shifted, and you have felt the difference between AF re-focusing on an obstruction versus focus lock ignoring it.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Colour temperature</span><span class="v">Nhiệt độ màu — how orange or blue a light source's colour is, measured in Kelvin (K).</span></div>
<div class="kv"><span class="k">White balance</span><span class="v">Cân bằng trắng — telling the camera what "true white" looks like under the current light.</span></div>
<div class="kv"><span class="k">AWB</span><span class="v">Auto White Balance — the camera re-guessing white balance continuously; risky mid-shot for video.</span></div>
<div class="kv"><span class="k">Mixed lighting</span><span class="v">Ánh sáng hỗn hợp — a scene lit by two or more sources with different colour temperatures at once.</span></div>
<div class="kv"><span class="k">Autofocus (AF)</span><span class="v">Lấy nét tự động — the camera detecting and tracking a subject's focus automatically.</span></div>
<div class="kv"><span class="k">Focus lock</span><span class="v">Khoá nét — freezing the current focus point so the camera cannot re-focus elsewhere.</span></div>
<div class="kv"><span class="k">Manual focus (MF)</span><span class="v">Lấy nét tay — controlling focus entirely by hand, with no automatic assistance.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Light has a colour, measured in Kelvin — low numbers are orange/warm, high numbers are blue/cool.</li>
<li>Auto White Balance can silently shift colour mid-shot; lock white balance manually before rolling, every time.</li>
<li>Mixed lighting (two colour temperatures in one shot) has no single "correct" white balance — pick your key light or gel the rest (Chapter 8).</li>
<li>Subject-tracking AF is a solid default; focus lock protects a static shot; manual focus gives full control at the cost of practice.</li>
<li>A wide fixed aperture means a thin focus zone — small focus mistakes are visible on both Pocket 3 and iPhone.</li>
</ul>
<div class="link-card"><a href="https://support.apple.com/en-us/121032" target="_blank" rel="noopener">Apple — iPhone 16 Pro Max official technical specifications</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.3</span>
<h2>Cân bằng trắng và lấy nét: hai núm mà phơi sáng không bao giờ đụng tới</h2>
<p class="lead">Bạn có thể canh khẩu độ, màn trập và ISO hoàn hảo mà vẫn hỏng cảnh quay theo hai cách khác: tông da đổi màu giữa chừng một câu nói, hoặc một khuôn mặt trượt khỏi vùng nét ngay khi có người đi ngang qua ống kính. Cả hai vấn đề không nằm ở LƯỢNG sáng — thứ Bài 5.2 đã nói — mà nằm ở MÀU của ánh sáng và ở việc ống kính đang thật sự nhắm vào đâu. Bài này nói về cả hai, và một thói quen (khoá cân bằng trắng) ngăn cách giữa cảnh quay ghép mượt và cảnh quay không ghép được.</p>

<h3>Nhiệt độ màu — vì sao ánh sáng cũng có "màu"</h3>
<p>Ánh sáng không hề vô sắc. Ngọn nến, bóng đèn sợi đốt, ánh nắng ban ngày, và bóng râm dưới trời xanh đều hắt lên vật thể những màu rõ rệt khác nhau — đó là <strong>nhiệt độ màu (color temperature)</strong>, đo bằng <strong>Kelvin (K)</strong>. Mắt và não bạn tự động bù trừ điều này liên tục: một tờ giấy trắng vẫn trông trắng dù bạn đọc dưới đèn bàn ấm hay ánh sáng ngày mát, vì não âm thầm hiệu chỉnh lại. Máy quay không có bộ não làm việc đó thay bạn — nó ghi lại đúng màu THẬT của ánh sáng, nên nó cần được khai báo (hoặc tự đoán) "trắng" phải trông như thế nào.</p>
${slide('cr-05', 11, 'Cân bằng trắng — thang Kelvin')}
<p>Số Kelvin càng THẤP, ánh sáng càng ngả cam/vàng (ánh nến ~1900K, đèn sợi đốt/hoàng hôn ~3200K); số càng CAO, càng ngả xanh (bóng râm ~9000K, trời nhiều mây còn cao hơn). Ánh sáng ban ngày bình thường ở khoảng 5600K, và phần lớn đèn LED chỉnh "trung tính" nằm gần 5000K.</p>

<h3>Vì sao PHẢI khoá cân bằng trắng khi quay video</h3>
<p><strong>Auto White Balance (AWB)</strong> liên tục đoán lại màu đúng mỗi vài giây dựa trên bất cứ thứ gì đang trong khung — thật sự hữu ích cho ảnh chụp, nơi mỗi tấm độc lập với nhau, và âm thầm có hại cho video: giữa một lần quay liên tục, nếu có người mặc áo đỏ đi ngang khung hình, hoặc máy hơi lia lộ ra một khung cửa sổ sáng, AWB có thể âm thầm "nhảy" màu ngay giữa cảnh. Người xem sẽ không gọi tên được chính xác điều gì sai — họ chỉ cảm thấy tông da hơi khang khác ở đâu đó giữa clip.</p>
<p>Cách sửa là chọn tay một giá trị Kelvin, hoặc khoá lại đúng giá trị mà AWB vừa chốt, TRƯỚC khi bắt đầu quay — và giữ nguyên suốt cả cảnh. Chương 6 chỉ đúng chỗ công tắc đó nằm trên Pocket 3 và iPhone.</p>

<h3>Ánh sáng hỗn hợp — khi không có giá trị Kelvin nào là "đúng"</h3>
<p>Phòng thật thường có nhiều hơn một nguồn sáng với nhiệt độ màu khác nhau cùng lúc — ánh nắng qua cửa sổ (khoảng 5600K) cùng với một đèn bàn ấm (khoảng 3200K) trong cùng một cảnh. Không có MỘT cài đặt cân bằng trắng nào làm cả hai nguồn cùng đúng màu một lúc; bạn hoặc chọn giá trị khớp với <strong>đèn chủ (key light)</strong> (nguồn sáng chính chiếu lên mặt, Chương 8 gọi tên đầy đủ) và để nguồn còn lại nhuốm màu lệch, hoặc gắn một tấm gel màu lên một đèn để cả hai nguồn khớp nhau TRƯỚC khi bấm quay. Chương 8 nói sâu về cách sửa đó — bây giờ chỉ cần nhận ra triệu chứng: một phần khung hình ngả cam, phần khác ngả xanh, và không con số cân bằng trắng nào trong menu sửa được cả hai cùng lúc.</p>

<h3>Lấy nét: AF theo chủ thể, khoá nét, và lấy nét tay</h3>
${slide('cr-05', 12, 'Lấy nét: tự động, khoá, và tay')}
<p><strong>Lấy nét tự động (AF)</strong> hiện đại trên cả Pocket 3 và iPhone nhận diện khuôn mặt/chủ thể và bám nét khi chúng di chuyển — mặc định hợp lý cho phần lớn nội dung khoá này quay. <strong>Khoá nét (focus lock, đôi khi gọi AF/AE Lock)</strong> đóng băng đúng điểm nét máy vừa chọn, để nó không đột ngột lấy nét sang thứ khác — một bàn tay đi ngang qua ống kính, hay hậu cảnh, ngay lúc chủ thể tạm bước ra khỏi khung. <strong>Lấy nét tay (MF)</strong> trao toàn quyền kiểm soát và xoá bỏ rủi ro AF "đi lạc" giữa lúc quay, đổi lại cần luyện ước lượng khoảng cách — thường đi kèm công cụ hỗ trợ như focus peaking (đã nhắc ở Bài 5.2).</p>
<p>Điều này nối thẳng về độ sâu trường ảnh ở Bài 5.2: khẩu càng mở rộng (số f càng nhỏ), vùng THẬT SỰ đang nét càng MỎNG — trật một chút là cảnh mờ thấy rõ ngay. Khẩu độ cố định khá mở của Pocket 3 và iPhone (f/1.78–f/2.0) nghĩa là vùng nét mỏng này là một mối lo THẬT, hằng ngày, không phải trường hợp hiếm gặp.</p>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — AWB hoặc AF âm thầm đổi giữa lúc bạn đang tự quay một mình.</strong> Không có ai xem màn hình giúp bạn, bạn sẽ không bắt được một cú nhảy màu hay một lần AF đi lạc ngay lúc nó xảy ra — chỉ phát hiện ra lúc dựng, khi đã quá muộn để quay lại đúng khoảnh khắc đó. Khoá cân bằng trắng và khoá nét TRƯỚC khi bắt đầu nói, mọi lần, nhất là khi không có ai khác trên trường quay để bắt lỗi giúp bạn (Chương 10 nói sâu về quay một mình).</p></div>

<p class="note-ct"><strong>Nối với bài sau:</strong> Bài 5.4 là nơi mọi thứ ở trên — độ phân giải, phơi sáng, màu sắc — thật sự được GHI vào một file: codec, bitrate, bit depth và các profile Log quyết định bao nhiêu phần cảm biến "thấy" được sống sót tới bản xuất cuối.</p>

<h3>🎬 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Chỉnh tay cân bằng trắng khớp với nguồn sáng chính trong phòng (dùng các giá trị Kelvin trên slide làm điểm khởi đầu) và quay 10 giây.</li>
<li>Chuyển sang Auto White Balance, quay đúng 10 giây đó, và cố tình để một vật có màu sặc sỡ đi ngang khung hình giữa chừng.</li>
<li>Phát lại cả hai cạnh nhau và mô tả, thành lời, đúng chỗ nào màu của clip AWB bị lệch.</li>
<li>Canh khung một chủ thể với AF bật, rồi nhờ ai đó đi ngang qua giữa bạn và ống kính — xem nét có nhảy sang họ không và mất bao lâu để quay lại.</li>
</ol><p><strong>Đạt khi:</strong> bạn chỉ đúng được giây mà màu của clip AWB bị lệch, và cảm nhận được sự khác nhau giữa AF lấy nét lại vào vật cản với khoá nét lờ nó đi.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Colour temperature</span><span class="v">Nhiệt độ màu — một nguồn sáng ngả cam hay ngả xanh tới đâu, đo bằng Kelvin (K).</span></div>
<div class="kv"><span class="k">White balance</span><span class="v">Cân bằng trắng — khai báo cho máy biết "trắng thật" trông ra sao dưới ánh sáng hiện tại.</span></div>
<div class="kv"><span class="k">AWB</span><span class="v">Auto White Balance — máy tự đoán lại cân bằng trắng liên tục; rủi ro giữa cảnh quay video.</span></div>
<div class="kv"><span class="k">Mixed lighting</span><span class="v">Ánh sáng hỗn hợp — một cảnh có từ hai nguồn sáng khác nhiệt độ màu trở lên cùng lúc.</span></div>
<div class="kv"><span class="k">Autofocus (AF)</span><span class="v">Lấy nét tự động — máy tự nhận diện và bám nét theo chủ thể.</span></div>
<div class="kv"><span class="k">Focus lock</span><span class="v">Khoá nét — đóng băng điểm nét hiện tại để máy không lấy nét sang chỗ khác.</span></div>
<div class="kv"><span class="k">Manual focus (MF)</span><span class="v">Lấy nét tay — kiểm soát nét hoàn toàn bằng tay, không có hỗ trợ tự động.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Ánh sáng có màu, đo bằng Kelvin — số thấp ngả cam/ấm, số cao ngả xanh/mát.</li>
<li>Auto White Balance có thể âm thầm lệch màu giữa cảnh; khoá cân bằng trắng bằng tay trước khi quay, mọi lần.</li>
<li>Ánh sáng hỗn hợp (hai nhiệt độ màu trong một cảnh) không có cân bằng trắng nào "đúng" tuyệt đối — chọn theo đèn chủ hoặc gắn gel màu (Chương 8).</li>
<li>AF bám theo chủ thể là mặc định tốt; khoá nét bảo vệ một cảnh tĩnh; lấy nét tay cho toàn quyền kiểm soát, đổi lại cần luyện tập.</li>
<li>Khẩu độ cố định khá mở nghĩa là vùng nét mỏng — sai sót nhỏ về nét lộ rõ trên cả Pocket 3 lẫn iPhone.</li>
</ul>
<div class="link-card"><a href="https://support.apple.com/en-us/121032" target="_blank" rel="noopener">Apple — thông số kỹ thuật chính thức iPhone 16 Pro Max</a></div>
</div>
`,
    },

    /* ─────────────────── 5.4 codec, bitrate, bit depth, Log ─────────────────── */
    {
      title: '5.4 — Codec, bitrate, bit depth and Log|||5.4 — Codec, bitrate, bit depth và Log',
      slug: 'cr-05-4-codec-bitrate-log',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Container vs codec, H.264/HEVC/ProRes đo thật bằng ffmpeg, công thức bitrate → dung lượng, 8-bit vs 10-bit, Normal/HLG/Log, và vì sao HDR cần cẩn thận khi ghép Pocket 3 với iPhone.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.4</span>
<h2>Codec, bitrate, bit depth and Log: what decides how heavy your file is, and how far you can push it in color</h2>
<p class="lead">Everything in this chapter so far — resolution, exposure, white balance — describes what your sensor SEES. This lesson is about what actually gets WRITTEN to the memory card: how it's compressed, how big the resulting file is, and how much of that original light survives a serious color grade. Every number below was measured for real on this machine with ffmpeg — not copied from a spec sheet — because the two codecs' quality settings do not mean what you would assume, and I want you to see exactly where that assumption breaks.</p>

<h3>Container vs. codec — the box, and what's packed inside it</h3>
<p>A <strong>container</strong> (định dạng chứa — .mp4, .mov) is just the box: a structure that bundles video, audio, subtitles and metadata together so software knows how to read it back. A <strong>codec</strong> (COder/DECoder) is the actual compression method used for the video INSIDE that box. Two .mp4 files can hold completely different codecs — the file extension alone never tells you the whole story. Think of it like a gift box: the box (container) says nothing about what's inside (codec) until you open it — or, more reliably, ask <code>ffprobe</code>.</p>

<h3>H.264, HEVC, ProRes — measured for real, not read off a spec sheet</h3>
${slide('cr-05', 13, 'Codec: H.264 · HEVC · ProRes — đo thật')}
<p><strong>H.264</strong> (also called AVC) is a <strong>long-GOP</strong> codec: only some frames are complete images (<em>keyframes</em>), and the rest only record what CHANGED since the last one. That makes it efficient and, crucially, playable on almost anything — the safe default. <strong>HEVC/H.265</strong> is H.264's successor, using the same long-GOP idea with better compression math — usually a noticeably smaller file for the same visual quality, at the cost of needing newer hardware to decode smoothly (both Pocket 3 and iPhone record it — Chapter 6). <strong>ProRes</strong> is Apple's editing-focused codec, and it works completely differently: it is <strong>intra-frame</strong> — every single frame is a complete image, none of them depend on their neighbours. That is exactly why it scrubs and plays back so smoothly in an editor (nothing to reconstruct from surrounding frames), and exactly why the files are dramatically larger.</p>
<p>Here is where I ran into a real trap worth showing you directly. My first instinct was to encode the same 6-second, 1080p/25fps test clip with both codecs at "CRF 20" — a quality setting where a lower number means higher quality/bigger file — assuming the number would mean the same thing for both:</p>
<pre><code class="language-bash">ffmpeg -f lavfi -i "testsrc2=size=1920x1080:rate=25:duration=6" \\
  -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p h264_crf20.mp4

ffmpeg -f lavfi -i "testsrc2=size=1920x1080:rate=25:duration=6" \\
  -c:v libx265 -preset medium -crf 20 -pix_fmt yuv420p hevc_crf20.mp4</code></pre>
<div class="out">h264_crf20.mp4  5,57 MB  (bitrate đo được ≈ 7,43 Mbps)
hevc_crf20.mp4  7,20 MB  (bitrate đo được ≈ 9,60 Mbps)  — TO HƠN H.264 29%, dù "CRF" cùng ghi là 20</div>
<p>HEVC came out <strong>29% bigger</strong> at the identical CRF number — the opposite of what HEVC is supposed to deliver. The reason: CRF scales are NOT shared between encoders. FFmpeg's own official encoding guide for H.265 states that <strong>x265 CRF 28 is roughly equivalent in visual quality to x264 CRF 23</strong> — a very different pair of numbers. Re-running with that correct pairing gives the comparison that actually means something:</p>
<table>
<tr><th>Codec (1080p25, same 6-second clip)</th><th>File size</th><th>Measured bitrate</th></tr>
<tr><td>H.264 (CRF 23)</td><td>4.27 MB</td><td>≈5.7 Mbps</td></tr>
<tr><td>HEVC (CRF 28 — matched quality per FFmpeg's guide)</td><td>3.37 MB</td><td>≈4.5 Mbps</td></tr>
<tr><td>ProRes 422 HQ (10-bit, intra-frame)</td><td>48.58 MB</td><td>≈64.8 Mbps</td></tr>
</table>
<p>At genuinely matched quality, HEVC is about <strong>21% smaller</strong> than H.264 in this test. ProRes 422 HQ is roughly <strong>11–14× larger</strong> than either — for reference, Apple's own storage guide states ProRes files run "up to 30 times larger than HEVC files"; that bigger number likely reflects a different comparison baseline (their own camera-recorded HEVC bitrate versus mine), not a contradiction — both measurements point the same direction: ProRes trades an order of magnitude more disk space for editing smoothness.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — assuming CRF numbers are comparable across encoders.</strong> That first "CRF 20 vs CRF 20" test above is exactly the mistake to avoid: always match encoders using their DOCUMENTED equivalent quality settings, never the same raw number.</p></div>

<h3>Bitrate → file size: a formula you can run yourself</h3>
<p><strong>Bitrate</strong> is how much data gets written per second, in Mbps (megabits per second). The formula: <strong>file size (MB) = bitrate (Mbps) × duration (seconds) ÷ 8</strong> — dividing by 8 converts bits to bytes.</p>
${slide('cr-05', 14, 'Bitrate & bit depth — đo thật bằng ffmpeg')}
<p>Worked example with a real, documented number — Pocket 3's declared maximum bitrate of 130 Mbps: 130 × 60 ÷ 8 = <strong>975 MB per minute</strong>, or 58.5 GB per hour. That is a THEORETICAL CEILING. I tested it directly by forcing a 4K/25fps test clip to that exact 130 Mbps cap:</p>
<pre><code class="language-bash">ffmpeg -f lavfi -i "testsrc2=size=3840x2160:rate=25:duration=6" \\
  -c:v libx264 -preset fast -b:v 130M -minrate 130M -maxrate 130M -bufsize 32M \\
  -pix_fmt yuv420p pocket3-4k-130mbps.mp4

ffprobe -v error -select_streams v:0 -show_entries stream=bit_rate -of default=nw=1 pocket3-4k-130mbps.mp4</code></pre>
<div class="out">bit_rate=88280662</div>
<p>The actual measured bitrate came out at ≈88.3 Mbps — well under the 130 Mbps cap I forced. Scaled to a full minute, that clip used about <strong>662 MB/minute</strong>, roughly 68% of the theoretical 975 MB/minute ceiling. This is not a bug: Pocket 3 (like almost every camera) uses <strong>variable bitrate (VBR)</strong> — it only spends bits where the scene actually needs them. A detailed, fast-moving scene (leaves in wind, moving water, a crowd) pushes closer to the ceiling; a simple static talking-head shot against a plain wall stays well under it. When you estimate how many minutes fit on a memory card, use the published maximum — real footage is very likely to use less, giving you a safety margin rather than a shortfall.</p>

<h3>8-bit vs 10-bit — colour depth, not sharpness</h3>
<p><strong>Bit depth</strong> has nothing to do with resolution or sharpness — it is how many distinct brightness LEVELS each colour channel (red/green/blue) can register. <strong>8-bit</strong>: 2⁸ = 256 levels per channel → 256×256×256 = 16,777,216 (~16.7 million) total colours. <strong>10-bit</strong>: 2¹⁰ = 1024 levels per channel → 1024×1024×1024 = 1,073,741,824 (~1.07 billion) total colours — in the same ballpark as DJI's own marketing claim that D-Log M "can record up to one billion colors."</p>
<p>Why this matters: when you push colour grading hard (dragging highlights and shadows around), 8-bit footage tends to show <strong>banding</strong> — smooth gradients breaking into visible steps instead of a smooth ramp (imagine colouring a sunset gradient with 256 crayons versus 1,024 — more crayons, smoother transitions). 10-bit tolerates much more aggressive grading before banding appears.</p>
<p>Using the same HEVC encoder and the same CRF 28 setting from above, switching only the pixel format from 8-bit to 10-bit:</p>
<div class="out">HEVC 8-bit  (yuv420p)     3,37 MB
HEVC 10-bit (yuv420p10le) 3,53 MB   (+4,7%)</div>
<p>The storage cost of 10-bit is much smaller than most beginners assume — under 5% here. The real trade-off is not disk space; it's that both D-Log M and Apple Log require 10-bit AND a genuine colour-grading pass afterward (next section, and Chapter 15) — shooting 10-bit without grading buys you nothing you can see.</p>

<h3>Normal, HLG, Log — three ways the sensor "sees" light</h3>
${slide('cr-05', 15, 'Normal · HLG · Log — và HDR khi đăng lên mạng')}
<p><strong>Normal/SDR</strong> (Rec.709): the sensor's wide range of real-world brightness gets compressed into a narrower range, with contrast and colour already applied for you — it looks good straight away, ready to publish, no grading needed. <strong>Log</strong> (D-Log M on Pocket 3, Apple Log on iPhone): captures the WIDEST dynamic range the sensor can see, but deliberately applies NO contrast or saturation — the result looks flat and grey (this is intentional, called "flat" footage), and is <strong>raw material for grading</strong>, not a finished look. Only shoot Log when you are genuinely going to grade it in Chapter 15; otherwise Normal looks better to literally everyone who is not you. <strong>HLG</strong> (Hybrid Log-Gamma) sits between the two: a wider range than Normal, but built to look acceptable straight out of camera on an HDR-capable screen, unlike Log's deliberately flat image. Pocket 3 supports 10-bit HLG (dji.com/osmo-pocket-3).</p>

<h3>HDR and the wrinkle when you publish</h3>
<p><strong>HDR (High Dynamic Range)</strong> is a PLAYBACK format, not just a capture setting — it carries metadata describing how to correctly display a wide brightness range on a screen that supports it. <strong>Dolby Vision</strong> is one specific HDR standard, and it is what iPhone records by default. Pocket 3 has no Dolby Vision mode at all — it shoots Normal, HLG or Log, none of which speak that exact "language."</p>
<p>YouTube's own help documentation confirms it accepts HDR uploads (describing support for the PQ and HLG HDR standards) and automatically generates an SDR version for viewers without an HDR screen — but the same page states YouTube is still "improving" that automatic conversion, meaning the result is not guaranteed to look exactly as intended. Shoot Dolby Vision HDR on the iPhone and cut it next to Pocket 3's SDR footage without checking, and you have introduced a colour mismatch neither camera warned you about.</p>
<div class="callout warn"><p><strong>The course default (already set in Chapter 6): turn HDR Video off on iPhone</strong> whenever cutting against Pocket 3, which never shoots HDR. Starting both cameras from the same SDR baseline removes one entire category of colour-matching mistakes before you ever open an editor. Chapter 24 covers exporting HDR correctly for the rare project that actually calls for it.</p></div>

<div class="pitfall co-tieu-de"><p><strong>Trap — shooting Log "because professionals do" and never grading it.</strong> This is the single most common beginner mistake with Log: the flat, grey image is not a bug to tolerate, it is unfinished raw material — publishing it straight is strictly worse than shooting Normal in the first place.</p></div>

<p class="note-ct"><strong>Connects to next:</strong> Chapter 6 sets every switch this chapter described — fps, shutter, white balance, codec, colour profile — on your actual Pocket 3 and iPhone. Chapter 15 is where Log footage finally gets graded into something worth publishing.</p>

<h3>🎬 Practice (20–30 minutes)</h3>
<div class="callout ok"><ol>
<li>Record 10 seconds and immediately read back exactly what got written, using ffprobe:</li>
</ol>
<pre><code class="language-bash">ffprobe -v error -select_streams v:0 \\
  -show_entries stream=codec_name,pix_fmt,r_frame_rate,bit_rate \\
  -of default=nw=1 canh-quay.mp4</code></pre>
<div class="out">codec_name=hevc
pix_fmt=yuv420p10le
r_frame_rate=25/1
bit_rate=4693276</div>
<ol start="2">
<li>Using that real measured bitrate and the formula above, calculate how many minutes of footage would fit on your smallest memory card.</li>
<li>If your camera supports it, record 5 seconds in Normal and 5 seconds in Log (D-Log M / Apple Log) of the exact same scene — look at the Log clip and confirm out loud that it looks worse, unfinished, on purpose.</li>
</ol>
<p><strong>Done when:</strong> your calculated card capacity is based on a bitrate you actually measured, not the number printed on the spec sheet — and you can explain in one sentence why the Log clip looks grey.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Container</span><span class="v">Định dạng chứa — the file structure (.mp4, .mov) bundling video, audio and metadata.</span></div>
<div class="kv"><span class="k">Codec</span><span class="v">The compression method used for the video data inside a container.</span></div>
<div class="kv"><span class="k">Long-GOP / intra-frame</span><span class="v">Long-GOP only stores full frames occasionally; intra-frame (ProRes) makes every frame complete.</span></div>
<div class="kv"><span class="k">Bitrate</span><span class="v">Data written per second, in Mbps — directly determines file size via a simple formula.</span></div>
<div class="kv"><span class="k">Bit depth</span><span class="v">Độ sâu màu — how many brightness levels each colour channel can register (8-bit vs 10-bit).</span></div>
<div class="kv"><span class="k">Banding</span><span class="v">Visible steps in what should be a smooth colour gradient, worse in 8-bit under heavy grading.</span></div>
<div class="kv"><span class="k">Log</span><span class="v">A flat, low-contrast capture profile that maximises dynamic range for later colour grading.</span></div>
<div class="kv"><span class="k">HLG</span><span class="v">Hybrid Log-Gamma — wider range than Normal, but watchable straight out of camera on HDR screens.</span></div>
<div class="kv"><span class="k">HDR / Dolby Vision</span><span class="v">A playback format carrying extra brightness-range metadata; Dolby Vision is one specific HDR standard.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Container is the box (.mp4/.mov); codec is the compression inside it — check with ffprobe, never guess from the extension.</li>
<li>CRF numbers are NOT comparable across encoders — match documented equivalent settings (HEVC CRF 28 ≈ H.264 CRF 23) before comparing file sizes.</li>
<li>Measured for real: HEVC ~21% smaller than H.264 at matched quality; ProRes ~11–14× larger than either, in exchange for smooth editing.</li>
<li>Bitrate → size formula: MB = Mbps × seconds ÷ 8. Published bitrates are a ceiling — real VBR footage usually uses less.</li>
<li>10-bit costs surprisingly little storage (~5% more here) but only pays off if you actually grade the footage.</li>
<li>Log looks flat and grey on purpose — it is raw material, not a finished look. Never publish it ungraded.</li>
</ul>
<div class="link-card"><a href="https://trac.ffmpeg.org/wiki/Encode/H.265" target="_blank" rel="noopener">FFmpeg — official H.265/HEVC encoding guide (CRF equivalence to H.264)</a></div>
<div class="link-card"><a href="https://support.apple.com/en-us/109041" target="_blank" rel="noopener">Apple — ProRes storage and encoding requirements</a></div>
<div class="link-card"><a href="https://support.google.com/youtube/answer/7126552" target="_blank" rel="noopener">YouTube Help — uploading HDR video</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.4</span>
<h2>Codec, bitrate, bit depth và Log: cái quyết định file nặng bao nhiêu, và chịu chỉnh màu được tới đâu</h2>
<p class="lead">Mọi thứ trong chương này từ đầu tới giờ — độ phân giải, phơi sáng, cân bằng trắng — mô tả cảm biến THẤY gì. Bài này nói về thứ THẬT SỰ được GHI vào thẻ nhớ: nén ra sao, file nặng bao nhiêu, và bao nhiêu phần ánh sáng gốc đó sống sót qua một lần chỉnh màu nghiêm túc. Mọi con số dưới đây được đo THẬT trên máy này bằng ffmpeg — không chép từ bảng thông số — vì cài đặt chất lượng của hai codec không có nghĩa như bạn tưởng, và tôi muốn bạn thấy đúng chỗ giả định đó vỡ ra.</p>

<h3>Container và codec — cái hộp, và cách gói bên trong</h3>
<p><strong>Container (định dạng chứa — .mp4, .mov)</strong> chỉ là cái hộp: một cấu trúc gói video, âm thanh, phụ đề và metadata lại để phần mềm biết đọc ra sao. <strong>Codec (COder/DECoder)</strong> là cách nén THẬT SỰ dùng cho video BÊN TRONG cái hộp đó. Hai file .mp4 có thể chứa hai codec hoàn toàn khác nhau — đuôi file một mình không bao giờ nói hết câu chuyện. Hình dung như một hộp quà: cái hộp (container) không nói gì về thứ bên trong (codec) cho tới khi bạn mở ra — hoặc, đáng tin hơn, hỏi <code>ffprobe</code>.</p>

<h3>H.264, HEVC, ProRes — đo thật, không đọc từ bảng thông số</h3>
${slide('cr-05', 13, 'Codec: H.264 · HEVC · ProRes — đo thật')}
<p><strong>H.264</strong> (còn gọi AVC) là codec <strong>long-GOP</strong>: chỉ một số khung là ảnh trọn vẹn (<em>keyframe</em>), phần còn lại chỉ ghi lại PHẦN THAY ĐỔI so với khung trước. Điều đó làm nó hiệu quả và, quan trọng hơn, phát được ở gần như mọi nơi — lựa chọn mặc định an toàn. <strong>HEVC/H.265</strong> là hậu bối của H.264, dùng cùng ý tưởng long-GOP với thuật toán nén tốt hơn — thường cho file NHẸ HƠN rõ rệt ở cùng chất lượng nhìn, đổi lại cần phần cứng mới hơn để giải mã mượt (cả Pocket 3 lẫn iPhone đều ghi được — Chương 6). <strong>ProRes</strong> là codec chuyên dựng của Apple, và nó hoạt động hoàn toàn khác: nó <strong>intra-frame</strong> — MỌI khung hình đều là một ảnh trọn vẹn, không khung nào phụ thuộc khung bên cạnh. Đó chính xác là lý do nó tua/kéo mượt như vậy trong phần mềm dựng (không phải dựng lại từ khung xung quanh), và cũng chính xác là lý do file nặng hơn rất nhiều.</p>
<p>Đây là chỗ tôi dính một cái bẫy thật, đáng cho bạn xem trực tiếp. Bản năng đầu tiên của tôi là mã hoá cùng một clip thử 6 giây, 1080p/25fps bằng cả hai codec ở "CRF 20" — một thang chất lượng mà số càng thấp nghĩa là chất lượng càng cao/file càng nặng — và giả định con số đó có nghĩa GIỐNG NHAU cho cả hai:</p>
<pre><code class="language-bash">ffmpeg -f lavfi -i "testsrc2=size=1920x1080:rate=25:duration=6" \\
  -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p h264_crf20.mp4

ffmpeg -f lavfi -i "testsrc2=size=1920x1080:rate=25:duration=6" \\
  -c:v libx265 -preset medium -crf 20 -pix_fmt yuv420p hevc_crf20.mp4</code></pre>
<div class="out">h264_crf20.mp4  5,57 MB  (bitrate đo được ≈ 7,43 Mbps)
hevc_crf20.mp4  7,20 MB  (bitrate đo được ≈ 9,60 Mbps)  — TO HƠN H.264 29%, dù "CRF" cùng ghi là 20</div>
<p>HEVC ra <strong>TO HƠN 29%</strong> ở đúng cùng số CRF — ngược hẳn với thứ HEVC được kỳ vọng mang lại. Lý do: thang CRF KHÔNG dùng chung giữa hai bộ mã hoá. Hướng dẫn mã hoá H.265 chính thức của FFmpeg ghi rõ <strong>x265 CRF 28 tương đương chất lượng nhìn với x264 CRF 23</strong> — một cặp số rất khác. Chạy lại đúng cặp đó mới cho phép so sánh có ý nghĩa thật sự:</p>
<table>
<tr><th>Codec (1080p25, cùng clip thử 6 giây)</th><th>Dung lượng</th><th>Bitrate đo được</th></tr>
<tr><td>H.264 (CRF 23)</td><td>4,27 MB</td><td>≈5,7 Mbps</td></tr>
<tr><td>HEVC (CRF 28 — khớp chất lượng theo hướng dẫn FFmpeg)</td><td>3,37 MB</td><td>≈4,5 Mbps</td></tr>
<tr><td>ProRes 422 HQ (10-bit, intra-frame)</td><td>48,58 MB</td><td>≈64,8 Mbps</td></tr>
</table>
<p>Ở chất lượng khớp thật sự, HEVC nhẹ hơn H.264 khoảng <strong>21%</strong> trong phép đo này. ProRes 422 HQ nặng gấp khoảng <strong>11–14 lần</strong> so với cả hai — để so sánh, chính trang hướng dẫn lưu trữ của Apple ghi file ProRes nặng "tới 30 lần" so với HEVC; con số lớn hơn đó nhiều khả năng phản ánh một mốc so sánh khác (bitrate HEVC do chính máy quay ghi so với của tôi), không phải mâu thuẫn — cả hai phép đo đều chỉ cùng một hướng: ProRes đánh đổi thêm cả một bậc độ lớn dung lượng đĩa để lấy sự mượt mà khi dựng.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — tưởng số CRF so sánh được giữa các bộ mã hoá.</strong> Phép thử "CRF 20 so với CRF 20" ở trên chính là lỗi cần tránh: luôn khớp các bộ mã hoá bằng cặp cài đặt chất lượng đã được TÀI LIỆU HOÁ tương đương, không bao giờ dùng chung một con số thô.</p></div>

<h3>Bitrate → dung lượng: một công thức bạn tự chạy được</h3>
<p><strong>Bitrate</strong> là lượng dữ liệu ghi mỗi giây, tính bằng Mbps (megabit/giây). Công thức: <strong>dung lượng (MB) = bitrate (Mbps) × thời lượng (giây) ÷ 8</strong> — chia cho 8 để đổi bit sang byte.</p>
${slide('cr-05', 14, 'Bitrate & bit depth — đo thật bằng ffmpeg')}
<p>Ví dụ tính bằng một con số thật, đã công bố — bitrate tối đa Pocket 3 công bố là 130 Mbps: 130 × 60 ÷ 8 = <strong>975 MB mỗi phút</strong>, tức 58,5 GB mỗi giờ. Đó là MỨC TRẦN LÝ THUYẾT. Tôi kiểm trực tiếp bằng cách ép một clip thử 4K/25fps đúng vào trần 130 Mbps đó:</p>
<pre><code class="language-bash">ffmpeg -f lavfi -i "testsrc2=size=3840x2160:rate=25:duration=6" \\
  -c:v libx264 -preset fast -b:v 130M -minrate 130M -maxrate 130M -bufsize 32M \\
  -pix_fmt yuv420p pocket3-4k-130mbps.mp4

ffprobe -v error -select_streams v:0 -show_entries stream=bit_rate -of default=nw=1 pocket3-4k-130mbps.mp4</code></pre>
<div class="out">bit_rate=88280662</div>
<p>Bitrate đo được thật ra khoảng ≈88,3 Mbps — thấp hơn hẳn trần 130 Mbps tôi đã ép. Quy ra trọn một phút, clip đó dùng khoảng <strong>662 MB/phút</strong>, tức khoảng 68% mức trần lý thuyết 975 MB/phút. Đây không phải lỗi: Pocket 3 (như gần như mọi máy quay) dùng <strong>bitrate biến đổi (VBR — variable bitrate)</strong> — nó chỉ tiêu bit ở nơi cảnh THẬT SỰ cần. Một cảnh chi tiết, chuyển động nhanh (lá cây trong gió, nước chảy, đám đông) đẩy gần sát trần hơn; một cảnh tĩnh đơn giản nói chuyện trước tường trơn thì thấp hơn trần nhiều. Khi ước tính bao nhiêu phút vừa một thẻ nhớ, dùng mức TRẦN đã công bố — cảnh quay thật nhiều khả năng dùng ÍT hơn, cho bạn một khoảng dư an toàn thay vì bị thiếu.</p>

<h3>8-bit vs 10-bit — độ sâu màu, không phải độ nét</h3>
<p><strong>Bit depth (độ sâu màu)</strong> không liên quan gì tới độ phân giải hay độ nét — nó là số MỨC SÁNG mà mỗi kênh màu (đỏ/lục/lam) phân biệt được. <strong>8-bit</strong>: 2⁸ = 256 mức mỗi kênh → 256×256×256 = 16.777.216 (~16,7 triệu) màu tổng cộng. <strong>10-bit</strong>: 2¹⁰ = 1024 mức mỗi kênh → 1024×1024×1024 = 1.073.741.824 (~1,07 tỷ) màu — cùng tầm với lời DJI quảng cáo rằng D-Log M "ghi được tới một tỷ màu" (can record up to one billion colors).</p>
<p>Vì sao điều này quan trọng: khi bạn chỉnh màu mạnh tay (kéo mạnh highlight và shadow), cảnh 8-bit dễ lộ <strong>banding</strong> — dải màu chuyển mượt biến thành các bậc thang nhìn thấy được thay vì một dốc trơn (hình dung tô một dải hoàng hôn bằng 256 cây bút màu so với 1.024 cây — càng nhiều bút, chuyển màu càng mượt). 10-bit chịu được chỉnh màu mạnh tay hơn nhiều trước khi banding lộ ra.</p>
<p>Dùng đúng cùng bộ mã hoá HEVC và cùng CRF 28 ở trên, chỉ đổi định dạng điểm ảnh từ 8-bit sang 10-bit:</p>
<div class="out">HEVC 8-bit  (yuv420p)     3,37 MB
HEVC 10-bit (yuv420p10le) 3,53 MB   (+4,7%)</div>
<p>Cái giá dung lượng cho 10-bit nhỏ hơn nhiều so với phần lớn người mới tưởng — dưới 5% ở đây. Sự đánh đổi thật không nằm ở dung lượng đĩa; nó nằm ở chỗ cả D-Log M lẫn Apple Log đều ĐÒI HỎI 10-bit VÀ một lượt chỉnh màu thật sự sau đó (phần dưới, và Chương 15) — quay 10-bit mà không chỉnh màu thì không mua được gì bạn nhìn thấy được.</p>

<h3>Normal, HLG, Log — ba cách cảm biến "nhìn" ánh sáng</h3>
${slide('cr-05', 15, 'Normal · HLG · Log — và HDR khi đăng lên mạng')}
<p><strong>Normal/SDR</strong> (Rec.709): dải sáng thật rất rộng của cảnh được cảm biến "nén" vào một dải hẹp hơn, với độ tương phản và màu sắc ĐÃ áp sẵn cho bạn — nhìn đẹp ngay lập tức, sẵn sàng đăng, không cần chỉnh. <strong>Log</strong> (D-Log M trên Pocket 3, Apple Log trên iPhone): ghi lại dải sáng RỘNG NHẤT cảm biến thấy được, nhưng CỐ Ý không áp tương phản hay độ bão hoà — kết quả trông xám xịt, bệt màu (gọi là hình "flat" — có chủ đích), và là <strong>nguyên liệu thô để chỉnh màu</strong>, không phải một sản phẩm hoàn chỉnh. Chỉ quay Log khi bạn THẬT SỰ sẽ chỉnh màu ở Chương 15; nếu không, Normal luôn đẹp hơn với đúng nghĩa đen mọi người xem trừ chính bạn. <strong>HLG</strong> (Hybrid Log-Gamma) nằm giữa hai cái: dải sáng rộng hơn Normal, nhưng được thiết kế để nhìn tạm ổn ngay khi ra khỏi máy trên màn hình hỗ trợ HDR, khác với hình phẳng có chủ đích của Log. Pocket 3 hỗ trợ HLG 10-bit (dji.com/osmo-pocket-3).</p>

<h3>HDR và điểm gập ghềnh khi đăng lên</h3>
<p><strong>HDR (High Dynamic Range)</strong> là một ĐỊNH DẠNG PHÁT, không chỉ là một cài đặt lúc quay — nó mang thêm metadata mô tả cách hiển thị ĐÚNG dải sáng rộng trên một màn hình hỗ trợ nó. <strong>Dolby Vision</strong> là MỘT chuẩn HDR cụ thể, và đó là thứ iPhone quay mặc định. Pocket 3 hoàn toàn không có chế độ Dolby Vision — nó quay Normal, HLG hoặc Log, không cái nào nói đúng "ngôn ngữ" đó.</p>
<p>Trang trợ giúp chính thức của YouTube xác nhận họ nhận video HDR tải lên (mô tả hỗ trợ hai chuẩn HDR là PQ và HLG) và tự động tạo một bản SDR cho người xem không có màn hình HDR — nhưng đúng trang đó cũng ghi YouTube vẫn đang "cải thiện" bước tự chuyển đổi này, nghĩa là kết quả không được đảm bảo trông đúng như ý định. Quay Dolby Vision HDR trên iPhone rồi cắt cạnh cảnh SDR của Pocket 3 mà không kiểm lại, bạn đã đưa vào một sự lệch màu mà không máy nào cảnh báo trước cho bạn.</p>
<div class="callout warn"><p><strong>Mặc định của khoá học (đã đặt sẵn ở Chương 6): tắt HDR Video trên iPhone</strong> mỗi khi dựng chung với Pocket 3, vốn không bao giờ quay HDR. Cho cả hai máy cùng xuất phát từ nền SDR xoá bỏ cả một loại lỗi khớp màu trước khi bạn mở phần mềm dựng. Chương 24 dạy xuất HDR đúng cách cho dự án hiếm hoi thật sự cần tới nó.</p></div>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — quay Log "vì dân chuyên nghiệp hay quay" rồi không bao giờ chỉnh màu.</strong> Đây là lỗi phổ biến nhất của người mới với Log: hình xám, bệt màu không phải một lỗi cần chịu đựng, nó là nguyên liệu thô CHƯA XONG — đăng thẳng nó còn tệ hơn hẳn so với việc quay Normal ngay từ đầu.</p></div>

<p class="note-ct"><strong>Nối với bài sau:</strong> Chương 6 đặt đúng mọi công tắc chương này vừa mô tả — fps, màn trập, cân bằng trắng, codec, chế độ màu — trên chính Pocket 3 và iPhone của bạn. Chương 15 là nơi cảnh Log cuối cùng được chỉnh màu thành thứ đáng đăng.</p>

<h3>🎬 Thực hành (20–30 phút)</h3>
<div class="callout ok"><ol>
<li>Quay 10 giây rồi đọc lại NGAY chính xác những gì đã được ghi, bằng ffprobe:</li>
</ol>
<pre><code class="language-bash">ffprobe -v error -select_streams v:0 \\
  -show_entries stream=codec_name,pix_fmt,r_frame_rate,bit_rate \\
  -of default=nw=1 canh-quay.mp4</code></pre>
<div class="out">codec_name=hevc
pix_fmt=yuv420p10le
r_frame_rate=25/1
bit_rate=4693276</div>
<ol start="2">
<li>Dùng đúng bitrate đo được đó và công thức ở trên, tính xem thẻ nhớ nhỏ nhất của bạn chứa được bao nhiêu phút cảnh quay.</li>
<li>Nếu máy hỗ trợ, quay 5 giây ở Normal và 5 giây ở Log (D-Log M / Apple Log) đúng cùng một cảnh — nhìn clip Log và tự xác nhận thành lời rằng nó trông xấu hơn, chưa hoàn thiện, một cách có chủ đích.</li>
</ol>
<p><strong>Đạt khi:</strong> con số dung lượng thẻ bạn tính dựa trên bitrate bạn ĐÃ ĐO ĐƯỢC THẬT, không phải con số in trên bảng thông số — và bạn giải thích được trong một câu vì sao clip Log trông xám.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Container</span><span class="v">Định dạng chứa — cấu trúc file (.mp4, .mov) gói video, âm thanh và metadata.</span></div>
<div class="kv"><span class="k">Codec</span><span class="v">Cách nén dùng cho dữ liệu video bên trong một container.</span></div>
<div class="kv"><span class="k">Long-GOP / intra-frame</span><span class="v">Long-GOP chỉ lưu khung trọn vẹn thỉnh thoảng; intra-frame (ProRes) làm mọi khung đều trọn vẹn.</span></div>
<div class="kv"><span class="k">Bitrate</span><span class="v">Dữ liệu ghi mỗi giây, tính bằng Mbps — quyết định trực tiếp dung lượng file qua một công thức đơn giản.</span></div>
<div class="kv"><span class="k">Bit depth</span><span class="v">Độ sâu màu — số mức sáng mỗi kênh màu phân biệt được (8-bit so với 10-bit).</span></div>
<div class="kv"><span class="k">Banding</span><span class="v">Các bậc thang nhìn thấy được trong thứ đáng lẽ là dải màu mượt, nặng hơn ở 8-bit khi chỉnh màu mạnh tay.</span></div>
<div class="kv"><span class="k">Log</span><span class="v">Profile quay phẳng, tương phản thấp, tối đa hoá dải sáng để chỉnh màu sau.</span></div>
<div class="kv"><span class="k">HLG</span><span class="v">Hybrid Log-Gamma — dải sáng rộng hơn Normal, nhưng xem được ngay khi ra khỏi máy trên màn hình HDR.</span></div>
<div class="kv"><span class="k">HDR / Dolby Vision</span><span class="v">Định dạng phát mang thêm metadata dải sáng; Dolby Vision là một chuẩn HDR cụ thể.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Container là cái hộp (.mp4/.mov); codec là cách nén bên trong — kiểm bằng ffprobe, đừng đoán qua đuôi file.</li>
<li>Số CRF KHÔNG so sánh được giữa các bộ mã hoá — khớp đúng cặp cài đặt đã tài liệu hoá (HEVC CRF 28 ≈ H.264 CRF 23) trước khi so dung lượng.</li>
<li>Đo thật: HEVC nhẹ hơn H.264 khoảng 21% ở chất lượng khớp nhau; ProRes nặng gấp 11–14 lần cả hai, đổi lại dựng mượt.</li>
<li>Công thức bitrate → dung lượng: MB = Mbps × giây ÷ 8. Bitrate công bố là mức TRẦN — cảnh quay thật thường dùng ít hơn.</li>
<li>10-bit tốn dung lượng ít hơn nhiều người tưởng (~5% ở đây) nhưng chỉ đáng nếu bạn thật sự chỉnh màu cảnh quay.</li>
<li>Log trông phẳng và xám một cách có chủ đích — đó là nguyên liệu thô, không phải sản phẩm hoàn chỉnh. Đừng bao giờ đăng nó khi chưa chỉnh màu.</li>
</ul>
<div class="link-card"><a href="https://trac.ffmpeg.org/wiki/Encode/H.265" target="_blank" rel="noopener">FFmpeg — hướng dẫn mã hoá H.265/HEVC chính thức (độ tương đương CRF với H.264)</a></div>
<div class="link-card"><a href="https://support.apple.com/en-us/109041" target="_blank" rel="noopener">Apple — yêu cầu lưu trữ và mã hoá ProRes</a></div>
<div class="link-card"><a href="https://support.google.com/youtube/answer/7126552" target="_blank" rel="noopener">YouTube Help — tải video HDR lên</a></div>
</div>
`,
    },

    /* ─────────────────── 5.5 quiz ─────────────────── */
    {
      title: '5.5 — Chapter 5 check|||5.5 — Kiểm tra chương 5',
      slug: 'cr-05-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Tóm tắt chương 5 và bài kiểm tra 10 câu tình huống: độ phân giải & fps, phơi sáng, cân bằng trắng & lấy nét, codec/bitrate/Log — áp dụng vào Pocket 3 và iPhone 16 Pro Max.',
      content: `
<div class="ml-en">
<h2>📌 Chapter 5 summary</h2>
<p>Every setting in this chapter is a trade-off you can now name: resolution trades file size for crop/stabilise room, aperture trades depth of field for light, shutter speed trades motion blur for light (and must line up with the 50Hz mains in Vietnam), ISO trades noise for light, white balance must be locked or colour drifts mid-shot, and codec/bit depth/Log all trade file size and editing flexibility against how much colour grading the footage can survive.</p>
<h3>Self-check before Chapter 6</h3>
<div class="callout ok"><ul>
<li>I can explain why 4K is 4× the pixels of 1080p, not 2×.</li>
<li>I know why this course defaults to 25/50fps instead of 24/30/60.</li>
<li>I can state the 180° shutter rule from memory (and know it is NOT the same "180°" as Chapter 7).</li>
<li>I understand why Pocket 3 and iPhone need an ND filter outdoors, because their aperture is fixed.</li>
<li>I always lock white balance before a continuous take.</li>
<li>I can explain, without looking it up, why HEVC CRF 28 and H.264 CRF 23 are the pair to compare, not CRF 20 vs CRF 20.</li>
<li>I know Log footage is supposed to look flat and grey, and I will not publish it ungraded.</li>
</ul></div>
<p>If any box is unchecked, revisit that lesson before Chapter 6 — it assumes you already have this vocabulary and starts pressing real buttons on your own Pocket 3 and iPhone.</p>
</div>
<div class="ml-vi">
<h2>📌 Tóm tắt Chương 5</h2>
<p>Mọi cài đặt trong chương này giờ bạn đã gọi tên được sự đánh đổi: độ phân giải đánh đổi dung lượng lấy khoảng crop/ổn định, khẩu độ đánh đổi độ sâu trường ảnh lấy ánh sáng, màn trập đánh đổi nhoè chuyển động lấy ánh sáng (và phải khớp điện 50Hz của Việt Nam), ISO đánh đổi nhiễu lấy ánh sáng, cân bằng trắng phải khoá lại nếu không màu sẽ trôi giữa cảnh, và codec/bit depth/Log đều đánh đổi dung lượng và độ linh hoạt khi dựng lấy khả năng chịu chỉnh màu của cảnh quay.</p>
<h3>Tự kiểm trước khi sang Chương 6</h3>
<div class="callout ok"><ul>
<li>Tôi giải thích được vì sao 4K gấp 4 lần điểm ảnh của 1080p, không phải gấp 2.</li>
<li>Tôi biết vì sao khoá này mặc định 25/50fps thay vì 24/30/60.</li>
<li>Tôi đọc thuộc được quy tắc màn trập 180° (và biết nó KHÔNG phải "180°" ở Chương 7).</li>
<li>Tôi hiểu vì sao Pocket 3 và iPhone cần kính lọc ND khi quay ngoài trời, vì khẩu độ của chúng cố định.</li>
<li>Tôi luôn khoá cân bằng trắng trước một lần quay liên tục.</li>
<li>Tôi giải thích được, không cần tra lại, vì sao HEVC CRF 28 và H.264 CRF 23 mới là cặp nên so sánh, không phải CRF 20 với CRF 20.</li>
<li>Tôi biết cảnh Log vốn phải trông phẳng và xám, và sẽ không đăng nó khi chưa chỉnh màu.</li>
</ul></div>
<p>Nếu còn ô nào chưa tích được, quay lại đúng bài đó trước khi sang Chương 6 — chương đó giả định bạn đã có sẵn vốn từ này và bắt đầu bấm nút thật trên chính Pocket 3 và iPhone của bạn.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'You are filming indoors under LED lights at 30fps with a 1/60 shutter, and playback shows dark bands rolling across the frame. What is the correct fix?|||Bạn quay trong nhà dưới đèn LED, máy đặt 30fps với màn trập 1/60, và khi xem lại thấy các dải tối chạy ngang khung hình. Cách sửa đúng là gì?',
            options: [
              'Raise the ISO until the image looks brighter|||Tăng ISO lên cho hình sáng hơn',
              'Switch to 25fps with a 1/50 shutter, or 50fps with 1/100|||Đổi sang 25fps với màn trập 1/50, hoặc 50fps với 1/100',
              'Open the aperture wider|||Mở khẩu độ rộng hơn',
              'Turn on HDR Video|||Bật HDR Video',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'The bands are flicker banding caused by a shutter speed that does not line up with the 100Hz flicker rhythm of lights in Vietnam (twice the 50Hz mains frequency). ISO and aperture only control brightness, and HDR is a playback setting — none of them touch the shutter-to-flicker mismatch that actually causes banding.|||Các dải tối là sọc nhấp nháy do màn trập không khớp nhịp nhấp nháy 100 lần/giây của đèn ở Việt Nam (gấp đôi tần số điện 50Hz). ISO và khẩu độ chỉ điều khiển độ sáng, còn HDR là cài đặt phát lại — cả ba đều không đụng tới sự lệch nhịp màn trập/nhấp nháy, vốn là nguyên nhân thật của sọc.',
          },
          {
            question: 'A friend says a 4K clip is "only twice as heavy" as the same clip in 1080p, since "K" only refers to the horizontal count. What is the accurate correction?|||Một người bạn nói clip 4K "chỉ nặng gấp đôi" clip 1080p cùng nội dung, vì "K" chỉ tính theo chiều ngang. Sửa lại cho đúng thì phải nói thế nào?',
            options: [
              'They are correct — 4K really is only twice as heavy as 1080p|||Đúng — 4K thật sự chỉ nặng gấp đôi 1080p',
              '4K and 1080p end up the same size because the codec compresses away the difference|||4K và 1080p cuối cùng nặng như nhau vì codec nén hết phần chênh lệch',
              '4K is 8 times heavier because pixel count is multiplied across three colour channels|||4K nặng gấp 8 lần vì số điểm ảnh nhân theo cả ba kênh màu',
              '4K doubles both width and height versus 1080p, so the pixel count is 4 times larger, not 2|||4K gấp đôi cả chiều rộng lẫn chiều cao so với 1080p, nên số điểm ảnh gấp 4 lần, không phải 2',
            ],
            correctIndex: 3,
            points: 1,
            explanation: '3840 is 2x 1920 and 2160 is 2x 1080 — doubling BOTH dimensions multiplies the total pixel count by 2x2=4, not 2. Colour channels do not multiply the pixel count, and codecs change file size, not the actual pixel count being processed.|||3840 = 2 lần 1920 và 2160 = 2 lần 1080 — gấp đôi CẢ HAI chiều nhân tổng số điểm ảnh lên 2×2=4 lần, không phải 2. Kênh màu không nhân thêm số điểm ảnh, và codec chỉ đổi dung lượng file chứ không đổi số điểm ảnh thật sự được xử lý.',
          },
          {
            question: 'Which of these apertures lets in the MOST light?|||Trong các khẩu độ sau, khẩu nào cho lọt NHIỀU ánh sáng nhất?',
            options: ['f/1.8|||f/1.8', 'f/4|||f/4', 'f/8|||f/8', 'f/11|||f/11'],
            correctIndex: 0,
            points: 1,
            explanation: 'The f-number is a ratio, so a SMALLER number means a WIDER opening and more light — f/1.8 lets in far more light than f/11. This is the exact reverse of what the raw number "feels like" at first glance, and a common source of confusion for beginners.|||Số f là một tỉ số, nên số CÀNG NHỎ nghĩa là lỗ mở CÀNG RỘNG và càng nhiều sáng — f/1.8 lọt sáng nhiều hơn f/11 rất nhiều. Đây là điều ngược hẳn với cảm giác "nhìn con số" ban đầu, và là nguồn gây nhầm lẫn phổ biến cho người mới.',
          },
          {
            question: 'You switch your frame rate from 25fps to 50fps for smoother motion. Following the 180-degree shutter rule, what shutter speed should you set?|||Bạn đổi frame rate từ 25fps sang 50fps để chuyển động mượt hơn. Theo quy tắc màn trập 180°, bạn nên đặt màn trập bao nhiêu?',
            options: ['1/25|||1/25', '1/50|||1/50', '1/100|||1/100', '1/1000|||1/1000'],
            correctIndex: 2,
            points: 1,
            explanation: 'The 180-degree rule sets shutter speed to roughly double the frame rate: at 50fps, that is 1/100. 1/50 was correct for 25fps, not 50fps; 1/1000 is a deliberately fast, staccato shutter used for a different creative effect, not the natural-motion default.|||Quy tắc 180° đặt màn trập bằng khoảng gấp đôi frame rate: ở 50fps, đó là 1/100. 1/50 đúng cho 25fps, không phải 50fps; 1/1000 là màn trập cố tình rất nhanh, tạo hiệu ứng giật hình, không phải mặc định cho chuyển động tự nhiên.',
          },
          {
            question: 'Shooting outdoors at noon on Pocket 3 (fixed f/2.0 aperture), you want to keep the correct 1/50 shutter for natural motion blur, but the image is badly overexposed even at the lowest ISO. What should you add?|||Quay ngoài trời giữa trưa bằng Pocket 3 (khẩu độ cố định f/2.0), bạn muốn giữ đúng màn trập 1/50 cho chuyển động tự nhiên, nhưng hình bị cháy sáng nặng dù đã để ISO thấp nhất. Bạn nên thêm gì?',
            options: [
              'A wider-angle lens attachment|||Một ống kính góc rộng gắn thêm',
              'An ND (Neutral Density) filter in front of the lens|||Kính lọc ND (Neutral Density) trước ống kính',
              'A warmer white balance setting|||Một cài đặt cân bằng trắng ấm hơn',
              'A higher video bitrate|||Bitrate video cao hơn',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'With a fixed aperture, ISO already at minimum, and shutter speed locked by the 180-degree rule, an ND filter is the only remaining lever — it blocks light evenly without changing colour, letting you keep the correct exposure settings. A lens attachment, white balance, or bitrate do not control how much light reaches the sensor.|||Với khẩu độ cố định, ISO đã ở mức thấp nhất, và màn trập đã bị khoá bởi quy tắc 180°, kính lọc ND là đòn bẩy DUY NHẤT còn lại — nó chặn sáng đều mà không đổi màu, cho phép giữ đúng các cài đặt phơi sáng. Ống kính gắn thêm, cân bằng trắng, hay bitrate đều không điều khiển lượng sáng chạm tới cảm biến.',
          },
          {
            question: 'Filming outdoors in bright sun, the shot looks fine on the small camera screen at full brightness. What is the safest way to actually confirm the exposure is correct?|||Quay ngoài trời nắng gắt, cảnh nhìn ổn trên màn hình bé của máy quay ở độ sáng tối đa. Cách an toàn nhất để xác nhận phơi sáng thật sự đúng là gì?',
            options: [
              'Read a waveform, zebra pattern or false colour overlay instead of trusting the screen|||Đọc waveform, zebra hoặc lớp phủ false color thay vì tin vào màn hình',
              'Trust the screen — full brightness outdoors is always accurate|||Tin vào màn hình — độ sáng tối đa ngoài trời luôn chính xác',
              'Increase the screen brightness even further|||Tăng độ sáng màn hình lên cao hơn nữa',
              'Compare it by eye against a second phone screen|||So sánh bằng mắt với màn hình một điện thoại khác',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'A small screen at full outdoor brightness makes almost any exposure look acceptable — you cannot reliably tell "slightly overexposed" from "badly overexposed" by eye in that condition. Waveform, zebra and false colour all replace guessing with an actual number, which is exactly why they exist.|||Một màn hình bé ở độ sáng tối đa ngoài trời khiến gần như mọi mức phơi sáng đều trông "tạm ổn" — bạn không phân biệt được chắc chắn "hơi cháy" với "cháy nặng" chỉ bằng mắt trong điều kiện đó. Waveform, zebra và false color đều thay việc đoán bằng một con số thật, đúng là lý do chúng tồn tại.',
          },
          {
            question: 'Midway through one continuous take, someone in a bright red shirt walks through the background, and the skin tone on your main subject visibly shifts colour for a few seconds. What almost certainly caused this?|||Giữa một lần quay liên tục, có người mặc áo đỏ rực đi ngang qua hậu cảnh, và tông da của chủ thể chính đổi màu rõ rệt trong vài giây. Nguyên nhân gần như chắc chắn là gì?',
            options: [
              'The shutter speed was too fast|||Màn trập quá nhanh',
              'The ISO was set too low|||ISO đặt quá thấp',
              'The aperture changed automatically|||Khẩu độ tự động đổi',
              'Auto White Balance re-guessed the colour based on the new object in frame|||Auto White Balance đoán lại màu dựa trên vật thể mới xuất hiện trong khung',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'Auto White Balance continuously re-guesses the correct colour based on whatever is currently in frame, and a large, brightly coloured object entering the shot is a classic trigger for a visible colour jump. Shutter speed, ISO and aperture (fixed on this course kit anyway) do not control colour temperature.|||Auto White Balance liên tục đoán lại màu đúng dựa trên bất cứ thứ gì đang trong khung, và một vật lớn, màu sặc sỡ bước vào cảnh là nguyên nhân kinh điển gây nhảy màu thấy rõ. Màn trập, ISO và khẩu độ (vốn cố định trên bộ máy của khoá này) đều không điều khiển nhiệt độ màu.',
          },
          {
            question: 'You are filming yourself alone with subject-tracking AF enabled, and a family member briefly walks between you and the camera. What is most likely to happen, and what setting prevents it?|||Bạn tự quay một mình với AF bám chủ thể đang bật, và một người trong nhà đi ngang qua giữa bạn và máy quay trong chốc lát. Điều gì nhiều khả năng xảy ra, và cài đặt nào ngăn được nó?',
            options: [
              'Nothing happens; AF never refocuses on a temporary obstruction|||Không có gì xảy ra; AF không bao giờ lấy nét lại vào vật cản tạm thời',
              'The exposure changes automatically; lower the ISO to prevent it|||Phơi sáng tự đổi; hạ ISO để ngăn điều đó',
              'AF may briefly refocus on the person crossing the frame; focus lock prevents this|||AF có thể lấy nét lại tạm thời vào người đi ngang; khoá nét ngăn được điều này',
              'The frame rate drops automatically; increase the shutter speed to prevent it|||Frame rate tự giảm; tăng màn trập để ngăn điều đó',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'AF is designed to focus on whatever subject is most prominent, and a person walking close to the lens can briefly pull focus away from you. Focus lock freezes the current focus point so a temporary obstruction cannot steal it — exposure and frame rate are unrelated systems.|||AF được thiết kế để lấy nét vào chủ thể nổi bật nhất, và một người đi gần ống kính có thể tạm kéo nét ra khỏi bạn. Khoá nét đóng băng điểm nét hiện tại để vật cản tạm thời không "cướp" được nó — phơi sáng và frame rate là hai hệ thống không liên quan.',
          },
          {
            question: 'You encode the same clip with libx264 at CRF 20 and libx265 (HEVC) at CRF 20, expecting HEVC to be smaller. The HEVC file comes out LARGER instead. What is the most likely explanation?|||Bạn mã hoá cùng một clip bằng libx264 ở CRF 20 và libx265 (HEVC) ở CRF 20, kỳ vọng HEVC nhẹ hơn. File HEVC lại ra TO HƠN. Lời giải thích hợp lý nhất là gì?',
            options: [
              'HEVC is simply a worse codec than H.264|||HEVC đơn giản là một codec kém hơn H.264',
              'CRF scales are not shared between encoders — the same numeric CRF does not mean the same quality target|||Thang CRF không dùng chung giữa các bộ mã hoá — cùng một số CRF không có nghĩa là cùng một mục tiêu chất lượng',
              'The test clip must have been corrupted|||Clip thử hẳn đã bị hỏng',
              'HEVC always produces larger files than H.264, regardless of settings|||HEVC luôn cho file to hơn H.264, bất kể cài đặt',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'FFmpeg documents that x265 CRF 28 is roughly equivalent in quality to x264 CRF 23 — the numeric scales are simply different. Comparing both encoders at the identical raw number is not a fair test; HEVC genuinely is smaller than H.264 once you match the documented equivalent quality settings.|||FFmpeg ghi rõ x265 CRF 28 tương đương chất lượng với x264 CRF 23 — hai thang số đơn giản là khác nhau. So sánh hai bộ mã hoá ở cùng một con số thô không phải phép thử công bằng; HEVC thật sự nhẹ hơn H.264 một khi khớp đúng cặp cài đặt chất lượng đã được tài liệu hoá.',
          },
          {
            question: 'You switch to D-Log M to "get a more professional look" but never colour grade your footage before publishing. What is the actual result?|||Bạn chuyển sang D-Log M để "trông chuyên nghiệp hơn" nhưng chưa bao giờ chỉnh màu cảnh quay trước khi đăng. Kết quả thật sự là gì?',
            options: [
              'Flat, grey, washed-out footage that looks worse than shooting in Normal color mode|||Cảnh quay phẳng, xám, bạc màu, trông tệ hơn quay ở chế độ màu Normal',
              'Footage that looks identical to Normal color mode|||Cảnh quay trông giống hệt chế độ màu Normal',
              'A smaller file size than Normal color mode|||Dung lượng file nhỏ hơn chế độ màu Normal',
              'Automatically graded, publish-ready footage|||Cảnh quay tự động được chỉnh màu, sẵn sàng đăng',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'Log profiles deliberately skip applying contrast and saturation so the file preserves the widest possible dynamic range for grading afterward — the flat, grey look is intentional raw material, not a finished product. Skipping the grading step means publishing unfinished-looking footage; Log also requires 10-bit, which is very slightly larger, not smaller, than Normal.|||Profile Log cố ý không áp tương phản và độ bão hoà để file giữ được dải sáng rộng nhất có thể cho việc chỉnh màu sau — hình phẳng, xám là nguyên liệu thô có chủ đích, không phải sản phẩm hoàn chỉnh. Bỏ qua bước chỉnh màu nghĩa là đăng một cảnh quay trông chưa hoàn thiện; Log còn đòi hỏi 10-bit, vốn nặng hơn Normal một chút chứ không nhẹ hơn.',
          },
        ],
      },
    },
  ],
};
