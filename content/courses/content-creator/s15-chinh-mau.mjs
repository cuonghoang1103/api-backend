/**
 * Content Creator — Chương 15: Chỉnh màu. Song ngữ EN/VI (.ml-en / .ml-vi).
 * ⚠️ KHÔNG backtick trần trong content (dùng &#96;); `${` trong mã mẫu viết \${ ; gạch chéo ngược viết \\
 *
 * Nối mạch: Bài 5.2 đã dạy waveform/zebra/false color, Bài 5.3 dạy Kelvin/cân
 * bằng trắng, Bài 5.4 định nghĩa D-Log M/Apple Log là hồ sơ phẳng 10-bit chờ
 * chỉnh màu "ở Chương 15" — chương này giữ đúng lời hứa đó. Bài 6.1/6.2 đã nói
 * D-Log M và Apple Log là gì trên từng máy. Bài 13.1 đã đặt tên trang Color
 * ("chỉnh màu bằng scopes và cây node — Chương 15 dành trọn cho trang này").
 * Bài 12.4 đã nói Adjust của CapCut là thanh trượt một lớp, còn node có scope
 * là việc của Resolve — chương này không dạy lại các khái niệm đó.
 *
 * Nguồn đã kiểm (đầy đủ trong báo cáo bàn giao):
 *  - DJI D-Log M → Rec.709 LUT (Osmo Pocket 3): dji.com/downloads/softwares/osmo-pocket-3-dlog-to-rec709
 *  - Apple Log → Rec.709: LUT dựng sẵn trong Final Cut Pro (support.apple.com/guide/final-cut-pro,
 *    "LUT (lookup table)" và "Apply LUTs in Final Cut Pro for Mac") — Apple không phát hành
 *    một file .cube rời như DJI.
 *  - DaVinci Resolve Color Space Transform hỗ trợ Apple Log (Input Color Space) từ bản 18.6;
 *    KHÔNG có preset CST chính thức riêng cho D-Log M — preset "DJI D-Gamut/D-Log" có sẵn
 *    là cho D-Log đời cũ (forum.blackmagicdesign.com, mục Color Space Transform).
 *  - Reference Mode: support.apple.com/en-us/108321 (Mac/Apple display),
 *    support.apple.com/en-us/119963 (Ultra Retina XDR iPad Pro M4/M5),
 *    support.apple.com/en-us/111792 (bật Reference Mode trên iPad Pro).
 *  - Đường màu da trên vectorscope ≈123°, giữa mốc R và Yl — mô tả chung trong tài liệu
 *    Resolve và các nguồn học màu; SỐ ĐO là ước lượng phổ biến, không phải hằng số tuyệt đối.
 *  - CapCut Adjustment (desktop/web): Basic · Color wheels · Curves · HSL, cộng nhập LUT
 *    (.cube/.3dl) — capcut.com/resource/capcut-color-grading.
 *  - Mọi số "đo thật" trong Bài 15.3 lấy từ ffmpeg chạy THẬT trên ảnh test tự sinh trong
 *    thư mục scratch của phiên này (mô phỏng, không phải LUT chính hãng của DJI/Apple).
 */
import { gallery, slide } from './_slides.mjs';

const SLIDES = [
  [1, 'Bìa chương'],
  [2, 'Bản đồ chương'],
  [3, 'Correction và Grading — hai việc khác nhau'],
  [4, 'Màn hình tham chiếu: MacBook Pro XDR · Mac Studio · iPad Pro M5'],
  [5, 'Đọc waveform: thiếu sáng · đủ · cháy · Log chưa chỉnh'],
  [6, 'Vectorscope: cân bằng trắng đúng và lệch'],
  [7, 'RGB Parade (minh hoạ): lệch cân bằng trắng theo kênh màu'],
  [8, 'Từ Log tới Rec.709: LUT hoặc Color Space Transform'],
  [9, 'LUT chính hãng: D-Log M và Apple Log'],
  [10, 'Cây node chỉnh màu kiểu DaVinci Resolve'],
  [11, 'Bánh xe màu: Lift · Gamma · Gain'],
  [12, 'Đường cong tương phản (Curves)'],
  [13, 'Trước/sau: D-Log M phẳng → đã chỉnh'],
  [14, 'Khớp màu: Pocket 3 và iPhone trong cùng một cảnh'],
  [15, 'Bảng tra nhanh cả chương'],
  [16, 'Thực hành'],
];

export default {
  title: 'Chapter 15 — Color grading|||Chương 15 — Chỉnh màu',
  description: 'Đọc waveform/vectorscope/RGB parade thay vì tin mắt, đưa D-Log M và Apple Log về Rec.709 bằng LUT hoặc Color Space Transform, và dựng cây node để khớp màu Pocket 3 với iPhone.',
  lessons: [
    /* ─────────────────── 15.0 slide bài giảng ─────────────────── */
    {
      title: '15.0 — Chapter 15 in 16 slides|||15.0 — Chương 15 trong 16 slide',
      slug: 'cr-15-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Toàn bộ chương chỉnh màu trong 16 slide: correction vs grading, đọc scope, LUT/CST cho D-Log M và Apple Log, cây node, bánh xe màu và trước/sau thật.',
      content: `
<div class="ml-en"><h2>📑 Chapter 15 in 16 slides</h2>
<p>Chapter 5 promised your D-Log M and Apple Log footage would stop looking grey "in Chapter 15." This is that chapter, in 16 slides: what correction and grading actually are, three ways to read color as numbers instead of guesses, the exact official LUTs for your two cameras, and the node order that turns flat footage into a look you can repeat.</p>
<p>Skim these once end to end, then come back to slide 6 (vectorscope) and slide 9 (the LUT table) while you're actually grading — those two are the ones you'll reopen mid-edit.</p></div>
<div class="ml-vi"><h2>📑 Chương 15 trong 16 slide</h2>
<p>Chương 5 đã hứa cảnh D-Log M và Apple Log của bạn sẽ hết xám "ở Chương 15." Đây chính là chương đó, gói trong 16 slide: correction và grading thật sự là gì, ba cách đọc màu bằng số thay vì đoán, đúng LUT chính hãng cho hai máy bạn có, và thứ tự node biến cảnh phẳng thành một look lặp lại được.</p>
<p>Lướt hết một lượt trước, rồi quay lại slide 6 (vectorscope) và slide 9 (bảng LUT) khi đang chỉnh màu thật — hai slide đó là thứ bạn sẽ mở lại giữa chừng lúc dựng.</p></div>
${gallery('cr-15', SLIDES)}
`,
    },

    /* ─────────────────── 15.1 Màu là gì với người dựng ─────────────────── */
    {
      title: '15.1 — What color means to an editor|||15.1 — Màu là gì với người dựng',
      slug: 'cr-15-1-mau-la-gi',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Correction vs grading, không gian màu Rec.709/Rec.2020, vì sao Log trông "bạc", và màn hình tham chiếu trên MacBook Pro, Mac Studio và iPad Pro M5.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.1</span>
<h2>Color is not one job — it's two, and confusing them is why grading feels impossible</h2>
<p class="lead">Lesson 5.4 told you Log footage looks flat and grey on purpose, and promised you'd fix it "in Chapter 15." This is that chapter. Before touching a single wheel or curve, you need two things: the difference between two jobs colorists call correction and grading, and a screen you can actually trust while you do either one.</p>

<h3>Color correction vs. color grading — two different jobs, in a strict order</h3>
${slide('cr-15', 3, 'Correction và Grading — hai việc khác nhau')}
<p><strong>Color correction</strong> is not creative — it is the mandatory cleanup: exposure that is actually correct, white balance that matches reality, and every clip in a scene looking like it was shot in the same room even if it came from two different cameras. Nobody watches a finished video and thinks "nice correction" — they only notice when it is missing, as a shot that looks "off" for a reason they cannot name.</p>
<p><strong>Color grading</strong> is the creative layer on top: a deliberate warm or cool tone, higher contrast, a signature look you repeat across a whole series. Grading is optional — plenty of good videos are corrected but never graded. Correction is not optional if you want a result that looks professional.</p>
<p>The order matters and cannot be reversed: grade before correction is finished and every decision you make is calibrated against wrong data. Push a stylized teal-and-orange look onto a clip that is still 15% underexposed, and the teal shifts again the moment you fix the exposure — you were adjusting a moving target.</p>

<h3>Rec.709, Rec.2020, and why Log looks "silver"</h3>
<p>Lesson 5.4 already told you what Log <em>is</em> — the flattest, widest-dynamic-range recording your sensor can produce, saved as raw material. This lesson tells you what it is flat <em>relative to</em>. <strong>Rec.709</strong> is the standard color space and gamma curve nearly every screen expects a finished SDR video to already be in — the "final language" a delivered YouTube or TikTok video speaks. A camera shooting Normal or HLG (Lesson 5.4) does that Rec.709 conversion internally, before writing the file. Log deliberately skips the step: it records in a much wider space — Apple's own original Apple Log, for instance, is defined against the wider <strong>Rec.2020</strong> gamut, the same wide color space behind most HDR standards — and uses a logarithmic-style gamma curve instead of Rec.709's, so more of the sensor's real dynamic range survives into the file. Feed that wide, log-curved data straight to a screen expecting Rec.709, with no conversion in between, and every value gets squeezed into the middle of the visible range — which is exactly why Log footage reads as grey and low-contrast, "silver." Nothing is broken. It is unconverted data, waiting for the exact step this chapter teaches: a LUT or Color Space Transform (Lesson 15.3) that translates it back to Rec.709 correctly, followed by the correction and grading passes described above.</p>

<h3>A trustworthy screen, or none of this means anything</h3>
${slide('cr-15', 4, 'Màn hình tham chiếu: MacBook Pro XDR · Mac Studio · iPad Pro M5')}
<p>Every judgment in this chapter — "is this shot too warm," "did that curve crush the shadows" — is made with your eyes on a screen. If that screen quietly lies to you (auto-brightness kicking in, True Tone warming the whites, a panel that was never accurate to begin with), you are correcting a color that only exists on your display, not in the actual file. Apple's own support documentation describes a <strong>Reference Mode</strong> built into recent Apple displays specifically for this: a mode that locks the screen to a known, accurate standard — including Rec.709/BT.709 — instead of quietly optimizing itself for whatever room you happen to be sitting in.</p>
<div class="kv-grid">
<div class="kv"><span class="k">MacBook Pro (Liquid Retina XDR)</span><span class="v">System Settings → Displays → pick a Reference Mode/preset. This turns off True Tone and auto-brightness for the session and locks the panel to a known standard — confirmed on Apple's own page for using presets and reference modes.</span></div>
<div class="kv"><span class="k">Mac Studio</span><span class="v">Has no built-in screen at all — Reference Mode only exists if you pair it with an Apple Studio Display or Pro Display XDR. On an ordinary third-party monitor, the best you can do is set the correct color profile in Displays and treat your own grading judgment with a little more suspicion.</span></div>
<div class="kv"><span class="k">iPad Pro M5</span><span class="v">Settings → Display & Brightness → Advanced → Reference Mode. Apple's page on the Ultra Retina XDR display groups the M5 with the M4 generation for this display technology; confirm Reference Mode is present on your exact unit in that menu, since which models a given support page names by name changes over time.</span></div>
</div>
<div class="callout warn"><p><strong>A calibrated screen still is not magic.</strong> Grade in a pitch-black room and a shot will look brighter than it is; grade under a bright window and everything looks duller than it is. That is exactly why Lesson 15.2 teaches you to read scopes — numbers that do not care what your room looks like — instead of trusting your eyes alone, the same lesson Lesson 5.2 already taught you about exposure with waveform and zebra.</p></div>

<div class="pitfall co-tieu-de"><p><strong>Trap — grading the "look" before correction is finished.</strong> It is tempting to push a stylized color the moment Log footage stops looking grey. Resist it until white balance and exposure are actually correct — Lesson 15.2's scopes are how you confirm that. Lesson 15.4's node tree exists specifically to keep these two jobs in physically separate steps, so you are never tempted to solve both at once.</p></div>

<p class="note-ct"><strong>Connects to next:</strong> Lesson 15.2 replaces "does this look right" with three instruments that tell you, in numbers, whether it actually is.</p>

<h3>🎬 Practice (15–20 minutes)</h3>
<div class="callout ok"><ol>
<li>Open System Settings (or Settings, on iPad) on whichever of your machines has a screen, and find the Reference Mode/Displays menu described above — do not turn anything on yet, just locate it.</li>
<li>If a Reference Mode or preset exists, turn it on and look at a plain white webpage. Note whether the white shifts even slightly warmer or cooler compared to before.</li>
<li>Open any D-Log M or Apple Log clip you already have (or shoot 10 new seconds) and just look at it, ungraded, on this now more trustworthy screen.</li>
</ol><p><strong>Done when:</strong> you can state in one sentence why a video graded on an uncalibrated laptop screen in bright sunlight might look wrong to everyone else who watches it later.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Color correction</span><span class="v">Sửa màu — the mandatory pass: correct exposure, correct white balance, matching clips within a scene.</span></div>
<div class="kv"><span class="k">Color grading</span><span class="v">Chỉnh màu tạo look — the optional, creative pass that happens after correction, never before.</span></div>
<div class="kv"><span class="k">Rec.709</span><span class="v">The standard color space/gamma nearly every SDR screen expects a finished video to already be in.</span></div>
<div class="kv"><span class="k">Rec.2020</span><span class="v">A wider color gamut than Rec.709, used by HDR standards and as the base space for some Log formats.</span></div>
<div class="kv"><span class="k">Reference Mode</span><span class="v">A display mode on recent Apple screens that locks color to a known standard instead of auto-adjusting.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Correction (mandatory: exposure, white balance, matching) always comes before grading (optional: a deliberate look).</li>
<li>Log looks grey because it is recorded in a wide space with a log-style curve, not yet converted to Rec.709 — nothing is broken.</li>
<li>MacBook Pro's Liquid Retina XDR and iPad Pro's Ultra Retina XDR both offer a Reference Mode; a bare Mac Studio has no screen at all.</li>
<li>Even a calibrated screen is fooled by room lighting — Lesson 15.2's scopes exist so you are never grading by eye alone.</li>
</ul>
<div class="link-card"><a href="https://support.apple.com/en-us/108321" target="_blank" rel="noopener">Apple Support — use presets and reference modes with your Apple display</a></div>
<div class="link-card"><a href="https://support.apple.com/en-us/119963" target="_blank" rel="noopener">Apple Support — about the Ultra Retina XDR display on iPad Pro (M4 and M5)</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.1</span>
<h2>Màu không phải MỘT việc — là HAI việc, và nhầm lẫn giữa chúng là lý do chỉnh màu cảm giác bất khả thi</h2>
<p class="lead">Bài 5.4 đã nói cảnh Log trông phẳng và xám CÓ CHỦ ĐÍCH, và hứa sẽ sửa nó "ở Chương 15". Đây chính là chương đó. Trước khi chạm vào bất kỳ bánh xe hay đường cong nào, bạn cần hai thứ: phân biệt được hai việc dân chỉnh màu gọi là correction và grading, và một màn hình bạn thật sự TIN ĐƯỢC trong lúc làm cả hai.</p>

<h3>Color correction và color grading — hai việc khác nhau, theo đúng một thứ tự</h3>
${slide('cr-15', 3, 'Correction và Grading — hai việc khác nhau')}
<p><strong>Color correction (sửa màu)</strong> không phải sáng tạo — đó là dọn dẹp BẮT BUỘC: phơi sáng thật sự đúng, cân bằng trắng khớp với thực tế, và mọi clip trong một cảnh trông như quay cùng một phòng dù đến từ hai máy khác nhau. Không ai xem một video hoàn chỉnh mà nghĩ "correction đẹp thật" — người ta chỉ NHẬN RA khi nó thiếu, như một cảnh trông "là lạ" mà không gọi tên được lý do.</p>
<p><strong>Color grading (chỉnh màu tạo look)</strong> là lớp sáng tạo phía trên: một tông ấm hoặc lạnh có chủ đích, tương phản cao hơn, một look riêng bạn lặp lại xuyên suốt cả series. Grading là LỰA CHỌN — rất nhiều video tốt được correction nhưng chưa bao giờ grading. Correction thì không phải lựa chọn nếu bạn muốn kết quả trông chuyên nghiệp.</p>
<p>Thứ tự này quan trọng và KHÔNG được đảo ngược: grading trước khi correction xong nghĩa là mọi quyết định bạn đưa ra đều canh trên dữ liệu SAI. Đẩy một look "teal & orange" có phong cách lên một clip vẫn đang thiếu sáng 15%, tông teal đó sẽ lệch lại ngay khi bạn sửa phơi sáng — bạn đang chỉnh trên một mục tiêu cứ di chuyển.</p>

<h3>Rec.709, Rec.2020, và vì sao Log trông "bạc"</h3>
<p>Bài 5.4 đã nói Log LÀ GÌ — bản ghi phẳng nhất, dải sáng rộng nhất cảm biến làm được, lưu lại dưới dạng nguyên liệu thô. Bài này nói nó phẳng SO VỚI CÁI GÌ. <strong>Rec.709</strong> là không gian màu và đường gamma chuẩn mà gần như mọi màn hình mặc định một video SDR đã hoàn thiện đã ở sẵn trong đó — đó là "ngôn ngữ cuối cùng" một video YouTube hay TikTok đã xuất nói. Một máy quay ở chế độ Normal hay HLG (Bài 5.4) tự làm phép đổi sang Rec.709 NGAY TRONG máy, trước khi ghi file. Log cố tình BỎ QUA bước đó: nó ghi trong một không gian rộng hơn nhiều — bản Apple Log gốc của chính Apple, ví dụ, được định nghĩa dựa trên gamut <strong>Rec.2020</strong> rộng hơn, cùng không gian màu rộng đứng sau phần lớn chuẩn HDR — và dùng một đường gamma kiểu logarit thay vì đường của Rec.709, để nhiều dải sáng thật của cảm biến sống sót vào file hơn. Đưa thẳng dữ liệu rộng, đường cong-log đó vào một màn hình đang mặc định Rec.709 mà không có bước đổi nào ở giữa, mọi giá trị bị nén dồn vào giữa dải nhìn thấy được — đó chính xác là lý do cảnh Log đọc lên như xám, tương phản thấp, "bạc". Không có gì hỏng cả. Đó là dữ liệu CHƯA ĐƯỢC ĐỔI, đang chờ đúng bước chương này dạy: một LUT hoặc Color Space Transform (Bài 15.3) đổi nó về đúng Rec.709, rồi tới các lượt correction và grading vừa mô tả ở trên.</p>

<h3>Một màn hình tin được, hoặc mọi thứ ở đây vô nghĩa</h3>
${slide('cr-15', 4, 'Màn hình tham chiếu: MacBook Pro XDR · Mac Studio · iPad Pro M5')}
<p>Mọi phán đoán trong chương này — "cảnh này có ấm quá không", "đường cong đó có bóp mất chi tiết vùng tối không" — được đưa ra bằng MẮT nhìn vào một màn hình. Nếu màn hình đó âm thầm nói dối (tự tăng sáng, True Tone hâm ấm màu trắng, một tấm nền chưa bao giờ chuẩn ngay từ đầu), bạn đang chỉnh một màu chỉ tồn tại trên MÀN HÌNH của bạn, không phải trong file thật. Tài liệu hỗ trợ của chính Apple mô tả một <strong>Reference Mode</strong> được xây sẵn trong các màn hình Apple đời gần đây đúng cho việc này: một chế độ khoá màn hình vào một chuẩn đã biết, chính xác — gồm cả Rec.709/BT.709 — thay vì âm thầm tự tối ưu theo căn phòng bạn đang ngồi.</p>
<div class="kv-grid">
<div class="kv"><span class="k">MacBook Pro (Liquid Retina XDR)</span><span class="v">System Settings → Displays → chọn một Reference Mode/preset. Việc này tắt True Tone và tự chỉnh sáng trong phiên làm việc, khoá màn vào một chuẩn đã biết — đã xác nhận trên đúng trang hỗ trợ của Apple về preset và reference mode.</span></div>
<div class="kv"><span class="k">Mac Studio</span><span class="v">Không có màn hình riêng — Reference Mode chỉ tồn tại nếu bạn ghép nó với một Apple Studio Display hoặc Pro Display XDR. Trên một màn ngoài thường, tốt nhất bạn làm được là đặt đúng profile màu trong Displays, và nghi ngờ phán đoán chỉnh màu của chính mình hơn một chút.</span></div>
<div class="kv"><span class="k">iPad Pro M5</span><span class="v">Settings → Display & Brightness → Advanced → Reference Mode. Trang của Apple về màn Ultra Retina XDR xếp M5 chung với thế hệ M4 cho công nghệ màn hình này; kiểm lại Reference Mode có trên đúng máy bạn đang dùng trong đúng menu đó, vì danh sách máy được một trang hỗ trợ nêu tên có thể đổi theo thời gian.</span></div>
</div>
<div class="callout warn"><p><strong>Màn hình đã hiệu chỉnh vẫn không phải phép màu.</strong> Chỉnh màu trong phòng tối om, một cảnh sẽ trông sáng hơn thực tế; chỉnh dưới cửa sổ sáng chói, mọi thứ trông nhạt hơn thực tế. Đó chính xác là lý do Bài 15.2 dạy bạn đọc scope — những con số không quan tâm phòng bạn trông ra sao — thay vì chỉ tin vào mắt, giống hệt bài học Bài 5.2 đã dạy về phơi sáng bằng waveform và zebra.</p></div>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — grading "look" trước khi correction xong.</strong> Rất dễ bị cám dỗ đẩy một màu có phong cách ngay khi cảnh Log hết xám. Cưỡng lại điều đó cho tới khi cân bằng trắng và phơi sáng THẬT SỰ đúng — scope ở Bài 15.2 là cách bạn xác nhận điều đó. Cây node ở Bài 15.4 tồn tại đúng để giữ hai việc này ở hai bước tách biệt về mặt vật lý, để bạn không bao giờ bị cám dỗ giải quyết cả hai cùng lúc.</p></div>

<p class="note-ct"><strong>Nối với bài sau:</strong> Bài 15.2 thay "cảnh này nhìn có đúng không" bằng ba công cụ cho bạn biết, bằng số, nó có thật sự đúng hay không.</p>

<h3>🎬 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Mở System Settings (hoặc Settings, trên iPad) trên máy nào có màn hình riêng, tìm menu Reference Mode/Displays mô tả ở trên — chưa bật gì cả, chỉ cần tìm ra nó.</li>
<li>Nếu có Reference Mode hoặc preset, bật lên và nhìn một trang web nền trắng trơn. Ghi nhận xem trắng có đổi hơi ấm hay hơi lạnh hơn so với trước không.</li>
<li>Mở một clip D-Log M hoặc Apple Log bạn đã có sẵn (hoặc quay mới 10 giây) và chỉ nhìn nó, CHƯA chỉnh gì, trên màn hình giờ đã đáng tin hơn.</li>
</ol><p><strong>Đạt khi:</strong> bạn nói được, một câu, vì sao một video chỉnh màu trên màn laptop chưa hiệu chỉnh, dưới nắng gắt, có thể trông sai với mọi người xem nó sau này.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Color correction</span><span class="v">Sửa màu — lượt bắt buộc: phơi sáng đúng, cân bằng trắng đúng, khớp các clip trong cùng một cảnh.</span></div>
<div class="kv"><span class="k">Color grading</span><span class="v">Chỉnh màu tạo look — lượt sáng tạo, tự chọn, diễn ra SAU correction, không bao giờ trước.</span></div>
<div class="kv"><span class="k">Rec.709</span><span class="v">Không gian màu/gamma chuẩn mà gần như mọi màn hình SDR mặc định một video đã xuất bản ở sẵn trong đó.</span></div>
<div class="kv"><span class="k">Rec.2020</span><span class="v">Một gamut màu rộng hơn Rec.709, dùng bởi các chuẩn HDR và làm không gian gốc cho một số định dạng Log.</span></div>
<div class="kv"><span class="k">Reference Mode</span><span class="v">Một chế độ màn hình trên các máy Apple đời gần đây khoá màu vào một chuẩn đã biết thay vì tự động điều chỉnh.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Correction (bắt buộc: phơi sáng, cân bằng trắng, khớp clip) luôn đi TRƯỚC grading (tự chọn: một look có chủ đích).</li>
<li>Log trông xám vì nó được ghi trong một không gian rộng với đường cong kiểu log, CHƯA đổi sang Rec.709 — không có gì hỏng.</li>
<li>Liquid Retina XDR của MacBook Pro và Ultra Retina XDR của iPad Pro đều có Reference Mode; một Mac Studio trần không có màn hình nào cả.</li>
<li>Ngay cả màn hình đã hiệu chỉnh cũng bị ánh sáng phòng đánh lừa — scope ở Bài 15.2 tồn tại để bạn không bao giờ chỉnh chỉ bằng mắt.</li>
</ul>
<div class="link-card"><a href="https://support.apple.com/en-us/108321" target="_blank" rel="noopener">Apple Support — dùng preset và reference mode với màn hình Apple</a></div>
<div class="link-card"><a href="https://support.apple.com/en-us/119963" target="_blank" rel="noopener">Apple Support — về màn hình Ultra Retina XDR trên iPad Pro (M4 và M5)</a></div>
</div>
`,
    },

    /* ─────────────────── 15.2 Đọc scopes ─────────────────── */
    {
      title: '15.2 — Reading scopes|||15.2 — Đọc scopes',
      slug: 'cr-15-2-doc-scopes',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Waveform, RGB parade, vectorscope và đường màu da, histogram — bốn cách đọc màu bằng số, và vì sao chúng đúng hơn mắt bạn trong đúng những lúc mắt bạn sai nhất.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.2</span>
<h2>Four graphs that replace "does this look right" with an actual answer</h2>
<p class="lead">Lesson 5.2 already made the case for reading exposure with waveform, zebra and false colour instead of trusting a camera's own screen. Color grading is the same trap wearing a different hat: a screen you cannot fully trust (Lesson 15.1), a room whose lighting keeps shifting your perception, and a brain that adapts to whatever is already on screen within seconds. Scopes do not adapt. This lesson is the four graphs colorists actually watch while they work.</p>

<h3>Waveform — brightness, revisited for grading</h3>
${slide('cr-15', 5, 'Đọc waveform: thiếu sáng · đủ · cháy · Log chưa chỉnh')}
<p>You already know the shape: brightness (luma) from 0–100 plotted across the horizontal position of the frame. Lesson 5.2 used it to catch bad exposure on set. In the grading room it does one more job: it is the fastest way to confirm a LUT or Color Space Transform actually did its work. Flat Log footage produces a waveform squeezed into a narrow middle band — the fourth panel above. The moment a correct LUT is applied, that band should stretch back out to fill close to the full 0–100 range, the same shape as the "ĐỦ SÁNG" panel. If it does not stretch out after the LUT, the transform is wrong, not your eyes.</p>

<h3>Vectorscope — where waveform cannot help you</h3>
${slide('cr-15', 6, 'Vectorscope: cân bằng trắng đúng và lệch')}
<p>Waveform only tells you brightness — it is colour-blind by design. <strong>Vectorscope</strong> plots the opposite: colour, with no brightness information at all. Every pixel becomes one dot, placed by direction (its hue — red, yellow, green, cyan, blue, magenta, arranged around a circle) and by distance from the centre (its saturation — the further out, the more intense the colour). The six labelled boxes (R, Mg, B, Cy, G, Yl) mark the theoretical maximum for each of those six primary/secondary colours in the current color space.</p>
<p>The single most useful feature for you specifically: a <strong>skin tone line</strong>, a diagonal reference sitting between the R and Yl targets, commonly documented at roughly <strong>123°</strong>. Human skin, across essentially every ethnicity, clusters along approximately this same hue angle — what differs between people is mostly luminance and saturation, not this particular hue direction. Isolate a face in frame and watch where its cluster of dots lands: on the correct panel above, the "skin" cloud sits right on that line; on the incorrect one, white balance has pushed it away, toward red. That gives you an objective target for correcting skin tone that "does the shot look natural" never quite gives you.</p>

<h3>RGB Parade — which channel, and where in the frame</h3>
<p>${slide('cr-15', 7, 'RGB Parade (minh hoạ) — lệch cân bằng trắng theo từng kênh màu')}</p>
<p>Neither waveform nor vectorscope answers one specific, very common question: "is my white balance tilted toward one particular colour channel, and where in the frame is it worst?" <strong>RGB Parade</strong> splits the waveform into three side-by-side waveforms — one per channel (red, green, blue) — each still plotted against the actual horizontal position in your frame. A correctly white-balanced, neutral grey card should land all three channels at roughly the same height. Push white balance too warm and the red channel rides visibly higher than blue, exactly like the simplified illustration above: a genuine parade view in DaVinci Resolve's Color page shows this per-column, so you can also see <em>where</em> — top-left brighter than bottom-right, for instance — not just <em>which channel</em>.</p>

<h3>Histogram — the one that ignores position entirely</h3>
<p><strong>Histogram</strong> is the odd one out: it throws away spatial position completely and just counts, for each brightness level 0–255, how many pixels in the frame have it — a bar chart of the whole image's tonal distribution. That is exactly what makes it good at two things waveform and parade are clumsy at: spotting clipping (a tall spike jammed against the far left or right edge means detail was thrown away) and spotting a "double-peaked" image — two very separate clusters of tones, often a sign of a subject lit completely differently from its background.</p>

<h3>Using scopes to correct, not to guess</h3>
<p>Put together, the workflow Lesson 5.2 half-taught you with a camera now applies fully in the edit: read the waveform first (is exposure in a usable range), read the vectorscope on skin (is white balance close to the line), check the parade if something still looks off and you need to know which channel, and glance at the histogram if you suspect clipping. None of this requires trusting the room you are sitting in.</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — "it looks fine to me" as the entire correction process.</strong> The exact pitfall Lesson 5.2 warned you about outdoors — a bright screen making every exposure look acceptable — has a grading-room twin: a slightly warm-lit room making every white balance look acceptable. Scopes exist because your perception adapts continuously and silently; a number on a graph does not.</p></div>

<p class="note-ct"><strong>Connects to next:</strong> Lesson 15.3 gives you the actual first move for a Log clip — the LUT or Color Space Transform that gets the waveform to spread out and the vectorscope's skin cloud onto the line in the first place.</p>

<h3>🎬 Practice (20–25 minutes)</h3>
<div class="callout ok"><ol>
<li>In DaVinci Resolve's Color page, open the scopes panel and switch between Waveform, Vectorscope, Parade and Histogram on the same clip — just to see each one react to the same footage.</li>
<li>Load an ungraded D-Log M or Apple Log clip. Screenshot or note the waveform's shape before touching anything.</li>
<li>If the clip has a face in frame, turn on the vectorscope's skin tone indicator and see how far the skin cloud sits from the line.</li>
<li>Deliberately push white balance warm using a wheel, and watch the RGB Parade's red channel separate from blue in real time.</li>
</ol><p><strong>Done when:</strong> you can name, without looking, which scope answers "is this too dark," which answers "is skin tone correct," and which answers "which colour channel is the problem."</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Waveform</span><span class="v">Dạng sóng độ sáng — brightness (luma) 0–100 plotted across the frame's horizontal position.</span></div>
<div class="kv"><span class="k">Vectorscope</span><span class="v">A colour-only scope: hue as direction, saturation as distance from centre, no brightness information.</span></div>
<div class="kv"><span class="k">Skin tone line</span><span class="v">Đường màu da — a reference line near 123° that human skin tones of essentially all ethnicities cluster around in hue.</span></div>
<div class="kv"><span class="k">RGB Parade</span><span class="v">Three waveforms side by side, one per colour channel, each still tied to horizontal position in the frame.</span></div>
<div class="kv"><span class="k">Histogram</span><span class="v">A count of pixels per brightness level, with no spatial position — good for spotting clipping.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Waveform reads brightness; a correct LUT should stretch a flat Log waveform back out to fill the 0–100 range.</li>
<li>Vectorscope reads colour only — direction is hue, distance from centre is saturation; the skin tone line (≈123°) is your target for correct skin colour.</li>
<li>RGB Parade separates the three colour channels by position, showing exactly which channel and where a white balance error lives.</li>
<li>Histogram ignores position entirely — it is the fastest way to spot clipping or a scene lit in two very different ways.</li>
<li>Scopes exist because a room's lighting and your own adapting eyes cannot be trusted the same way a graph can.</li>
</ul>
<div class="link-card"><a href="https://www.blackmagicdesign.com/products/davinciresolve/training" target="_blank" rel="noopener">Blackmagic Design — free DaVinci Resolve training books (full scopes reference)</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.2</span>
<h2>Bốn biểu đồ thay "cảnh này nhìn có ổn không" bằng một câu trả lời thật sự</h2>
<p class="lead">Bài 5.2 đã lập luận cho việc đọc phơi sáng bằng waveform, zebra và false color thay vì tin vào màn hình của chính máy quay. Chỉnh màu là đúng cái bẫy đó, đội một chiếc mũ khác: một màn hình bạn không tin trọn vẹn được (Bài 15.1), một căn phòng có ánh sáng cứ đổi nhận thức của bạn, và một bộ não thích nghi với bất cứ gì đang hiện trên màn hình chỉ sau vài giây. Scope thì không thích nghi. Bài này là bốn biểu đồ dân chỉnh màu thật sự nhìn vào trong lúc làm việc.</p>

<h3>Waveform — độ sáng, nhìn lại lần nữa cho việc chỉnh màu</h3>
${slide('cr-15', 5, 'Đọc waveform: thiếu sáng · đủ · cháy · Log chưa chỉnh')}
<p>Bạn đã biết hình dạng của nó: độ sáng (luma) từ 0–100 vẽ theo đúng vị trí ngang của khung hình. Bài 5.2 dùng nó để bắt phơi sáng sai ngay tại hiện trường. Trong phòng chỉnh màu, nó làm thêm một việc nữa: đây là cách nhanh nhất để xác nhận một LUT hay Color Space Transform có thật sự làm đúng việc của nó hay không. Cảnh Log phẳng cho ra một waveform bị nén dồn vào một dải hẹp ở giữa — đúng bảng thứ tư ở trên. Ngay khi một LUT đúng được áp, dải đó phải trải rộng trở lại, gần lấp đầy toàn bộ dải 0–100, giống hình dạng của bảng "ĐỦ SÁNG". Nếu nó KHÔNG trải rộng ra sau khi áp LUT, phép đổi đang sai, không phải mắt bạn sai.</p>

<h3>Vectorscope — nơi waveform bó tay</h3>
${slide('cr-15', 6, 'Vectorscope: cân bằng trắng đúng và lệch')}
<p>Waveform chỉ nói cho bạn biết độ sáng — nó "mù màu" theo đúng thiết kế. <strong>Vectorscope</strong> vẽ điều ngược lại: màu sắc, không mang thông tin độ sáng nào cả. Mỗi điểm ảnh trở thành một chấm, đặt theo HƯỚNG (sắc độ của nó — đỏ, vàng, lục, lam nhạt, lam, hồng cánh sen, xếp quanh một vòng tròn) và theo KHOẢNG CÁCH tới tâm (độ bão hoà — càng xa tâm, màu càng đậm/mạnh). Sáu ô vuông có nhãn (R, Mg, B, Cy, G, Yl) đánh dấu mức tối đa lý thuyết cho từng màu chính/phụ trong số sáu màu đó, trong không gian màu hiện tại.</p>
<p>Tính năng hữu dụng nhất cho riêng bạn: một <strong>đường mốc màu da (skin tone line)</strong>, một đường chéo tham chiếu nằm giữa hai mốc R và Yl, tài liệu phổ biến ghi nhận ở khoảng <strong>123°</strong>. Da người, ở gần như MỌI sắc tộc, tập trung quanh xấp xỉ CÙNG một góc sắc độ này — thứ khác nhau giữa mọi người chủ yếu là độ sáng và độ bão hoà, không phải hướng màu cụ thể này. Chọn riêng khuôn mặt trong khung và xem đám mây chấm của nó rơi ở đâu: trên bảng ĐÚNG ở trên, đám mây "da" nằm ngay trên đường đó; trên bảng LỆCH, cân bằng trắng đã đẩy nó ra xa, về phía đỏ. Điều đó cho bạn một mục tiêu khách quan để sửa tông da mà câu "cảnh này nhìn có tự nhiên không" chưa bao giờ cho được thật sự.</p>

<h3>RGB Parade — kênh nào, và ở đâu trong khung hình</h3>
<p>${slide('cr-15', 7, 'RGB Parade (minh hoạ) — lệch cân bằng trắng theo từng kênh màu')}</p>
<p>Cả waveform lẫn vectorscope đều không trả lời được một câu hỏi cụ thể, rất hay gặp: "cân bằng trắng của tôi có đang lệch về một kênh màu cụ thể không, và chỗ nào trong khung hình đang lệch nặng nhất?" <strong>RGB Parade</strong> tách waveform thành ba dạng sóng đặt cạnh nhau — một cho mỗi kênh (đỏ, lục, lam) — mỗi cái vẫn vẽ theo đúng vị trí ngang thật trong khung hình của bạn. Một tấm thẻ xám trung tính, cân bằng trắng đúng, phải cho cả ba kênh nằm ở gần cùng một độ cao. Đẩy cân bằng trắng quá ấm, kênh đỏ sẽ nổi cao hẳn lên so với kênh lam, đúng như minh hoạ đơn giản hoá ở trên: một Parade thật trong trang Color của DaVinci Resolve cho thấy điều này theo từng cột, nên bạn còn thấy được CHỖ NÀO — ví dụ góc trên-trái sáng hơn góc dưới-phải — chứ không chỉ KÊNH NÀO.</p>

<h3>Histogram — cái duy nhất bỏ qua hoàn toàn vị trí</h3>
<p><strong>Histogram</strong> là kẻ lạc loài: nó vứt bỏ hoàn toàn vị trí không gian và chỉ ĐẾM, với mỗi mức sáng 0–255, có bao nhiêu điểm ảnh trong khung hình đang ở mức đó — một biểu đồ cột cho toàn bộ phân bố tông màu của cả ảnh. Đó chính xác là điều làm nó giỏi ở hai việc mà waveform và parade làm vụng: phát hiện CHÁY/MẤT CHI TIẾT (một cột cao dồn sát mép trái hoặc phải nghĩa là chi tiết đã bị vứt bỏ) và phát hiện một ảnh "hai đỉnh" — hai cụm tông màu tách biệt rõ rệt, thường là dấu hiệu chủ thể được chiếu sáng hoàn toàn khác với hậu cảnh.</p>

<h3>Dùng scope để SỬA, không phải để đoán</h3>
<p>Gộp lại, quy trình mà Bài 5.2 mới dạy nửa chừng bằng máy quay giờ áp dụng trọn vẹn ở khâu dựng: đọc waveform trước (phơi sáng có nằm trong dải dùng được không), đọc vectorscope trên vùng da (cân bằng trắng có gần đường mốc không), kiểm parade nếu vẫn thấy là lạ và cần biết đúng kênh nào, và liếc qua histogram nếu nghi ngờ bị cháy sáng. Không cái nào trong số này đòi bạn phải tin vào căn phòng bạn đang ngồi.</p>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — "tôi thấy ổn mà" là toàn bộ quy trình correction.</strong> Đúng cái bẫy Bài 5.2 đã cảnh báo ngoài trời — một màn hình sáng chói làm mọi mức phơi sáng trông chấp nhận được — có một phiên bản song sinh trong phòng chỉnh màu: một căn phòng ánh sáng hơi ấm làm mọi cân bằng trắng trông chấp nhận được. Scope tồn tại vì nhận thức của bạn thích nghi liên tục và âm thầm; một con số trên biểu đồ thì không.</p></div>

<p class="note-ct"><strong>Nối với bài sau:</strong> Bài 15.3 cho bạn nước đi đầu tiên thật sự cho một clip Log — LUT hoặc Color Space Transform khiến waveform trải rộng ra và đám mây da trên vectorscope chạm vào đường mốc ngay từ bước đầu.</p>

<h3>🎬 Thực hành (20–25 phút)</h3>
<div class="callout ok"><ol>
<li>Trong trang Color của DaVinci Resolve, mở panel scope và đổi qua lại Waveform, Vectorscope, Parade và Histogram trên cùng một clip — chỉ để xem mỗi cái phản ứng ra sao với cùng cảnh quay.</li>
<li>Nạp một clip D-Log M hoặc Apple Log chưa chỉnh. Chụp màn hình hoặc ghi lại hình dạng waveform trước khi chạm vào bất cứ gì.</li>
<li>Nếu clip có khuôn mặt trong khung, bật đường mốc màu da trên vectorscope và xem đám mây da cách đường đó bao xa.</li>
<li>Cố tình đẩy cân bằng trắng lên ấm bằng một bánh xe, và xem kênh đỏ trên RGB Parade tách khỏi kênh lam ngay trong lúc bạn kéo.</li>
</ol><p><strong>Đạt khi:</strong> bạn gọi tên được, không cần nhìn lại, scope nào trả lời "cảnh này có tối quá không", scope nào trả lời "tông da có đúng không", và scope nào trả lời "kênh màu nào đang là vấn đề".</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Waveform</span><span class="v">Dạng sóng độ sáng — luma từ 0–100 vẽ theo đúng vị trí ngang của khung hình.</span></div>
<div class="kv"><span class="k">Vectorscope</span><span class="v">Một scope chỉ về màu: hướng là sắc độ, khoảng cách tới tâm là độ bão hoà, không mang thông tin độ sáng.</span></div>
<div class="kv"><span class="k">Đường màu da</span><span class="v">Skin tone line — một đường mốc gần 123° mà tông da người ở gần như mọi sắc tộc tập trung quanh về mặt sắc độ.</span></div>
<div class="kv"><span class="k">RGB Parade</span><span class="v">Ba dạng sóng đặt cạnh nhau, một cho mỗi kênh màu, mỗi cái vẫn gắn với vị trí ngang trong khung hình.</span></div>
<div class="kv"><span class="k">Histogram</span><span class="v">Số lượng điểm ảnh theo mỗi mức sáng, không mang vị trí không gian — tốt để phát hiện cháy sáng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Waveform đọc độ sáng; một LUT đúng phải kéo waveform phẳng của Log trải rộng trở lại gần lấp đầy dải 0–100.</li>
<li>Vectorscope chỉ đọc màu — hướng là sắc độ, khoảng cách tới tâm là độ bão hoà; đường mốc da (≈123°) là mục tiêu của bạn cho tông da đúng.</li>
<li>RGB Parade tách ba kênh màu theo vị trí, cho thấy chính xác kênh nào và ở đâu một lỗi cân bằng trắng đang nằm.</li>
<li>Histogram bỏ qua hoàn toàn vị trí — đây là cách nhanh nhất để phát hiện cháy sáng hoặc một cảnh chiếu sáng theo hai kiểu quá khác nhau.</li>
<li>Scope tồn tại vì ánh sáng của một căn phòng và chính mắt bạn đang thích nghi không thể tin được như một biểu đồ.</li>
</ul>
<div class="link-card"><a href="https://www.blackmagicdesign.com/products/davinciresolve/training" target="_blank" rel="noopener">Blackmagic Design — sách đào tạo DaVinci Resolve miễn phí (tài liệu đầy đủ về scope)</a></div>
</div>
`,
    },

    /* ─────────────────── 15.3 Log & LUT ─────────────────── */
    {
      title: '15.3 — Log and LUTs|||15.3 — Log và LUT',
      slug: 'cr-15-3-log-lut',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'LUT chính hãng D-Log M → Rec.709 của DJI, cách Apple Log thật sự được đổi, Color Space Transform trong Resolve, và một phép đo thật bằng ffmpeg cho thấy "phẳng" và "đã chỉnh" khác nhau bao nhiêu.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.3</span>
<h2>The first node, done right: turning D-Log M and Apple Log back into Rec.709</h2>
<p class="lead">Lesson 15.1 explained why Log footage looks silver-grey. This lesson is the actual fix: the exact official conversion for each of your two cameras, the one real gap between them you need to know about before you touch DaVinci Resolve, and a live measurement showing what "flat" and "corrected" really mean in numbers.</p>

<h3>A LUT is a transform, not a "look"</h3>
<p>A <strong>LUT</strong> (Look-Up Table) is a pre-computed table of colour-in → colour-out values — apply it and every pixel gets remapped according to that table, instantly, with no manual adjustment. The confusing part is the name: some LUTs really are creative "looks" (a stylized teal-and-orange preset, for instance), but the LUT this lesson cares about is a <strong>technical</strong> one — it does exactly one job, converting a specific Log curve back to Rec.709, and nothing more. Mixing the two ideas up is the single most common beginner mistake with LUTs: a technical D-Log M→Rec.709 LUT belongs at the very first node in your chain (Lesson 15.4); a creative "look" LUT, if you use one at all, belongs near the end, after correction is already finished.</p>

<h3>DJI Osmo Pocket 3 (D-Log M) — an actual downloadable file</h3>
${slide('cr-15', 8, 'Từ Log tới Rec.709: LUT hoặc Color Space Transform')}
<p>DJI publishes an official <strong>D-Log M to Rec.709</strong> LUT for the Osmo Pocket 3 directly on its own download centre, under the Transcoders section — a real <code>.cube</code> file you download once and reuse forever. Import it into DaVinci Resolve (Color page → right-click a clip → LUT, or drop it into the first node's LUT slot) and it does the same job as the Color Space Transform below, just as a pre-baked table instead of a live calculation.</p>

<h3>iPhone (Apple Log) — no file to download, and that is by design</h3>
<p>Here is the asymmetry worth knowing before you go looking for a matching download: Apple does not publish a standalone <code>.cube</code> file the way DJI does. Apple's own Final Cut Pro documentation confirms Apple Log footage carries metadata that Final Cut Pro reads automatically, applying Apple's built-in camera LUT the moment you import the clip — the conversion happens for you, inside the app, with nothing to download or attach by hand.</p>
<p>DaVinci Resolve takes the other route: <strong>Color Space Transform (CST)</strong> is a node effect that calculates the conversion live from a formula instead of a lookup table. Set a node's Input Color Space to <strong>Apple Log</strong> (Resolve has supported this directly since roughly version 18.6) and Output Color Space to Rec.709, and CST computes the same kind of transform a LUT would give you, without needing a file at all. Because the original Apple Log is defined against the wider Rec.2020 gamut (Lesson 15.1), that is generally the input space CST expects — if your footage looks visibly wrong after applying it, that gamut mismatch is the first thing worth checking.</p>

<h3>The one real gap: D-Log M has no official Resolve preset</h3>
${slide('cr-15', 9, 'LUT chính hãng: D-Log M và Apple Log')}
<p>DaVinci Resolve's Color Space Transform ships with a built-in preset for DJI footage, labelled <strong>"DJI D-Gamut/D-Log."</strong> It is tempting to reach for it on Pocket 3 footage since the names look related — resist that. That built-in preset was tuned for DJI's <em>older</em> D-Log format (pre-dating the "M" revision), and applying it to D-Log M footage is reported to produce visibly oversaturated, off results, because D-Log M is not the same curve. There is currently no official CST preset built specifically for D-Log M. The reliable path for Pocket 3 footage is the DJI-published <code>.cube</code> LUT from the previous section, not this built-in preset — treat that as the default, and only experiment with CST for D-Log M if you have a specific reason to and are watching the vectorscope closely while you do it.</p>

<h3>Real numbers: what "flat" costs you, measured with ffmpeg</h3>
<p>Lesson 5.4 measured codecs and bitrates for real. Here is the same discipline applied to Log's flatness — not DJI's or Apple's actual LUT math (that is proprietary), but a real, runnable demonstration of the exact property Lesson 5.4 described: Log compresses the range and desaturates the image on purpose. A synthetic test frame was generated, then pushed through a deliberately flattening filter to stand in for "what Log does," then pulled back out to stand in for "what a LUT plus a contrast node does":</p>
<pre><code class="language-bash">ffmpeg -f lavfi -i testsrc2=size=960x540:rate=25 -frames:v 1 nguon.png

ffmpeg -i nguon.png -vf "eq=contrast=0.42:saturation=0.35:brightness=0.12" flat-log-mophong.png

ffmpeg -i flat-log-mophong.png -vf "eq=contrast=3.0:brightness=-0.28:saturation=2.4" da-chinh.png

ffmpeg -i flat-log-mophong.png -vf signalstats,metadata=print -f null -</code></pre>
<div class="out">nguon.png (cảnh gốc):        YMIN=30   YAVG=125.8  YMAX=209  SATAVG=113.9
flat-log-mophong.png (mô phỏng Log): YMIN=114  YAVG=154.4  YMAX=189  SATAVG=39.6
da-chinh.png (mô phỏng đã chỉnh):    YMIN=18   YAVG=129.2  YMAX=216  SATAVG=92.2</div>
<p>Read that middle row the way Lesson 15.2 taught you to read a waveform: the brightness range collapsed from a 179-level spread (30–209) down to a 75-level spread (114–189) — exactly the squeezed-into-the-middle waveform shape from the previous lesson's "LOG CHƯA CHỈNH" panel — and average saturation dropped by nearly two-thirds, from 113.9 to 39.6. The bottom row is not a real LUT and does not claim to be one; it is a contrast-and-saturation push standing in for what Lesson 15.4's node 1 (LUT/CST) plus node 2 (contrast curve) accomplish together: the range opens back up to 198 levels (18–216) and saturation recovers to 92.2. This is the actual, measurable shape of "Log looks silver" and "grading brings it back" — not a description, a number.</p>

<h3>Exposing for Log in the first place</h3>
<p>One habit worth adopting when you are shooting D-Log M or Apple Log on purpose: because Log allocates more of its limited range to protecting highlight detail than shadow detail, many colorists deliberately expose Log footage a little brighter on set than instinct suggests — watching the waveform (Lesson 5.2, now Lesson 15.2) to keep highlights just short of clipping rather than centering exposure the way you would for Normal/Rec.709 footage. Brighter Log footage generally grades with less visible noise pulled up from the shadows than footage exposed "normally" and then Log-flattened in-camera. This is a general habit, not a fixed number of stops for either camera — treat the waveform, not a rule of thumb, as the actual source of truth.</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — reaching for Resolve's built-in "DJI D-Gamut/D-Log" preset out of habit.</strong> It exists, it has DJI's name on it, and it is wrong for D-Log M. Use the DJI-published LUT file instead, and confirm the fix with the waveform and vectorscope from Lesson 15.2 rather than trusting the preset name alone.</p></div>

<p class="note-ct"><strong>Connects to next:</strong> Lesson 15.4 is where this LUT/CST node becomes node 1 of a full chain — contrast, secondary color, a look, and the exact recipe for making Pocket 3 and iPhone match once both are finally speaking Rec.709.</p>

<h3>🎬 Practice (20–30 minutes)</h3>
<div class="callout ok"><ol>
<li>Download DJI's official D-Log M to Rec.709 LUT from their download centre and import it into DaVinci Resolve.</li>
<li>Apply it to a real D-Log M clip and watch the waveform stretch out in real time (Lesson 15.2).</li>
<li>On an Apple Log clip, try both routes: open it in Final Cut Pro (if you have it) and note the automatic conversion, then try Color Space Transform in Resolve with Input = Apple Log, Output = Rec.709.</li>
<li>If you have DJI footage handy, try Resolve's built-in "DJI D-Gamut/D-Log" preset on it and compare the result to the official LUT — see the oversaturation for yourself.</li>
</ol><p><strong>Done when:</strong> you can say, without checking, which of your two cameras needs a downloaded file and which one does the conversion for you inside its native app.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
<div class="kv"><span class="k">LUT</span><span class="v">Look-Up Table — a pre-computed colour-in → colour-out table; can be technical (a Log→Rec.709 fix) or creative (a "look").</span></div>
<div class="kv"><span class="k">Color Space Transform (CST)</span><span class="v">A Resolve node that calculates a color space conversion live from a formula, instead of a lookup table.</span></div>
<div class="kv"><span class="k">Input/Output Color Space</span><span class="v">CST's two settings: what space the footage is actually in, and what space you want it converted to.</span></div>
<div class="kv"><span class="k">Expose to protect highlights</span><span class="v">A Log-shooting habit: exposing slightly brighter than instinct suggests, watched via the waveform, since Log protects highlight detail more than shadow detail.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A LUT is a lookup table; the one you need first is technical (Log→Rec.709), not creative — creative "look" LUTs come later, if at all.</li>
<li>DJI publishes a real, downloadable D-Log M to Rec.709 LUT for Pocket 3; Apple instead builds the Apple Log conversion into Final Cut Pro automatically.</li>
<li>DaVinci Resolve's Color Space Transform officially supports Apple Log as an input; it has no official preset for D-Log M specifically — use DJI's LUT file instead of the built-in "DJI D-Gamut/D-Log" preset.</li>
<li>Measured for real: a flattened test image lost about two-thirds of its saturation and over half its brightness range — grading measurably reverses both.</li>
<li>Expose Log footage a little brighter than instinct suggests, watching the waveform, to protect highlight detail.</li>
</ul>
<div class="link-card"><a href="https://www.dji.com/downloads/softwares/osmo-pocket-3-dlog-to-rec709" target="_blank" rel="noopener">DJI — Osmo Pocket 3 D-Log M to Rec.709 LUT (official download)</a></div>
<div class="link-card"><a href="https://support.apple.com/guide/final-cut-pro/apply-luts-ver24f966423/mac" target="_blank" rel="noopener">Apple Support — apply LUTs in Final Cut Pro for Mac</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.3</span>
<h2>Node đầu tiên, làm đúng: đưa D-Log M và Apple Log trở lại Rec.709</h2>
<p class="lead">Bài 15.1 đã giải thích vì sao cảnh Log trông bạc xám. Bài này là cách sửa thật sự: đúng phép đổi chính hãng cho từng máy trong hai máy bạn có, một khoảng trống thật giữa chúng bạn cần biết trước khi mở DaVinci Resolve, và một phép đo sống cho thấy "phẳng" và "đã chỉnh" khác nhau bao nhiêu bằng số.</p>

<h3>LUT là một phép biến đổi, không phải một "look"</h3>
<p>Một <strong>LUT</strong> (Look-Up Table — bảng tra màu) là một bảng tính sẵn màu-vào → màu-ra — áp nó vào, mọi điểm ảnh được ánh xạ lại theo đúng bảng đó, ngay lập tức, không cần chỉnh tay. Phần gây rối là cái tên: một số LUT đúng là "look" sáng tạo thật (một preset teal-and-orange có phong cách, chẳng hạn), nhưng LUT bài này quan tâm là loại <strong>kỹ thuật</strong> — nó làm đúng MỘT việc, đổi một đường cong Log cụ thể trở lại Rec.709, không hơn. Nhầm lẫn hai ý niệm này là lỗi phổ biến nhất của người mới với LUT: một LUT kỹ thuật D-Log M→Rec.709 thuộc về node ĐẦU TIÊN trong chuỗi của bạn (Bài 15.4); một LUT "look" sáng tạo, nếu bạn dùng, thuộc về gần CUỐI, sau khi correction đã xong.</p>

<h3>DJI Osmo Pocket 3 (D-Log M) — một file tải về thật sự</h3>
${slide('cr-15', 8, 'Từ Log tới Rec.709: LUT hoặc Color Space Transform')}
<p>DJI phát hành chính thức một LUT <strong>D-Log M to Rec.709</strong> cho Osmo Pocket 3 ngay trên trung tâm tải của chính họ, trong mục Transcoders — một file <code>.cube</code> thật, tải về một lần dùng mãi mãi. Nhập nó vào DaVinci Resolve (trang Color → chuột phải một clip → LUT, hoặc thả vào ô LUT của node đầu tiên) và nó làm đúng việc như Color Space Transform ở dưới, chỉ khác là một bảng đã nấu sẵn thay vì một phép tính sống.</p>

<h3>iPhone (Apple Log) — không có file để tải, và đó là chủ đích</h3>
<p>Đây là điểm bất đối xứng đáng biết trước khi bạn đi tìm một file tải về tương tự: Apple KHÔNG phát hành một file <code>.cube</code> rời như DJI làm. Chính tài liệu Final Cut Pro của Apple xác nhận cảnh Apple Log mang theo metadata mà Final Cut Pro tự đọc, tự áp LUT camera dựng sẵn của Apple ngay lúc bạn nhập clip vào — phép đổi diễn ra thay bạn, NGAY TRONG app, không có gì để tải hay gắn bằng tay.</p>
<p>DaVinci Resolve đi đường khác: <strong>Color Space Transform (CST)</strong> là một hiệu ứng node TÍNH phép đổi trực tiếp từ một công thức thay vì một bảng tra sẵn. Đặt Input Color Space của một node là <strong>Apple Log</strong> (Resolve hỗ trợ trực tiếp điều này từ khoảng bản 18.6) và Output Color Space là Rec.709, CST tính ra cùng kiểu phép đổi mà một LUT sẽ cho bạn, mà không cần một file nào cả. Vì bản Apple Log gốc được định nghĩa dựa trên gamut Rec.2020 rộng hơn (Bài 15.1), đó thường là không gian đầu vào CST mặc định kỳ vọng — nếu cảnh của bạn trông rõ ràng sai sau khi áp, lệch gamut đó là điều đáng kiểm đầu tiên.</p>

<h3>Khoảng trống thật duy nhất: D-Log M chưa có preset chính thức trong Resolve</h3>
${slide('cr-15', 9, 'LUT chính hãng: D-Log M và Apple Log')}
<p>Color Space Transform của DaVinci Resolve có sẵn một preset dựng cho cảnh quay DJI, gắn nhãn <strong>"DJI D-Gamut/D-Log."</strong> Rất dễ bị cám dỗ dùng nó cho cảnh Pocket 3 vì cái tên nghe liên quan — hãy cưỡng lại. Preset dựng sẵn đó được tinh chỉnh cho định dạng D-Log ĐỜI CŨ của DJI (trước bản sửa đổi "M"), và áp nó cho cảnh D-Log M được ghi nhận cho kết quả rõ rệt bị ám màu/quá bão hoà, vì D-Log M không cùng đường cong. Hiện chưa có preset CST chính thức dựng riêng cho D-Log M. Đường đáng tin cho cảnh Pocket 3 là LUT <code>.cube</code> do DJI phát hành ở phần trên, không phải preset dựng sẵn này — coi đó là mặc định, và chỉ thử CST cho D-Log M nếu bạn có lý do cụ thể và đang theo dõi sát vectorscope trong lúc làm.</p>

<h3>Số thật: "phẳng" tốn của bạn bao nhiêu, đo bằng ffmpeg</h3>
<p>Bài 5.4 đã đo codec và bitrate thật. Đây là đúng kỷ luật đó áp cho độ phẳng của Log — KHÔNG phải công thức LUT thật của DJI hay Apple (đó là độc quyền), mà một minh hoạ thật, chạy được, cho đúng tính chất Bài 5.4 đã mô tả: Log nén dải sáng và giảm bão hoà CÓ CHỦ ĐÍCH. Một khung hình test tự sinh được dựng, rồi đẩy qua một filter cố tình làm phẳng để đứng thay cho "Log làm gì", rồi kéo ngược lại để đứng thay cho "một LUT cộng một node tương phản làm gì":</p>
<pre><code class="language-bash">ffmpeg -f lavfi -i testsrc2=size=960x540:rate=25 -frames:v 1 nguon.png

ffmpeg -i nguon.png -vf "eq=contrast=0.42:saturation=0.35:brightness=0.12" flat-log-mophong.png

ffmpeg -i flat-log-mophong.png -vf "eq=contrast=3.0:brightness=-0.28:saturation=2.4" da-chinh.png

ffmpeg -i flat-log-mophong.png -vf signalstats,metadata=print -f null -</code></pre>
<div class="out">nguon.png (cảnh gốc):        YMIN=30   YAVG=125.8  YMAX=209  SATAVG=113.9
flat-log-mophong.png (mô phỏng Log): YMIN=114  YAVG=154.4  YMAX=189  SATAVG=39.6
da-chinh.png (mô phỏng đã chỉnh):    YMIN=18   YAVG=129.2  YMAX=216  SATAVG=92.2</div>
<p>Đọc hàng giữa theo đúng cách Bài 15.2 vừa dạy đọc waveform: dải sáng sụp từ khoảng trải 179 mức (30–209) xuống còn 75 mức (114–189) — đúng hình dạng waveform dồn vào giữa của bảng "LOG CHƯA CHỈNH" ở bài trước — và độ bão hoà trung bình giảm gần hai phần ba, từ 113,9 xuống 39,6. Hàng cuối KHÔNG phải một LUT thật và không tự nhận là vậy; đó là một cú đẩy tương phản+bão hoà đứng thay cho việc node 1 (LUT/CST) cộng node 2 (đường cong tương phản) ở Bài 15.4 cùng làm: dải sáng mở lại rộng 198 mức (18–216) và bão hoà phục hồi lên 92,2. Đây là hình dạng THẬT, ĐO ĐƯỢC của "Log trông bạc" và "chỉnh màu kéo nó trở lại" — không phải một mô tả, mà là một con số.</p>

<h3>Phơi sáng khi quay Log ngay từ đầu</h3>
<p>Một thói quen đáng có khi bạn cố tình quay D-Log M hay Apple Log: vì Log dành nhiều phần dải giá trị hạn chế của nó để bảo vệ chi tiết vùng SÁNG hơn là vùng TỐI, nhiều colorist cố tình phơi sáng cảnh Log hơi sáng hơn bản năng mách bảo ngay tại hiện trường — theo dõi bằng waveform (Bài 5.2, giờ là Bài 15.2) để giữ vùng sáng chỉ vừa chưa cháy, thay vì canh phơi sáng theo kiểu bạn vẫn làm với cảnh Normal/Rec.709. Cảnh Log phơi sáng hơi sáng hơn nhìn chung khi chỉnh màu ít nhiễu lộ ra từ vùng tối hơn so với cảnh phơi sáng "bình thường" rồi mới làm phẳng bằng Log trong máy. Đây là một thói quen chung, không phải một con số stop cố định cho từng máy — coi waveform, không phải một quy tắc ước lượng, là nguồn sự thật thật sự.</p>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — theo thói quen dùng preset dựng sẵn "DJI D-Gamut/D-Log" của Resolve.</strong> Nó có tồn tại, nó mang tên DJI, và nó SAI cho D-Log M. Dùng file LUT do DJI phát hành thay vào đó, và xác nhận lại bằng waveform và vectorscope ở Bài 15.2 thay vì chỉ tin vào cái tên của preset.</p></div>

<p class="note-ct"><strong>Nối với bài sau:</strong> Bài 15.4 là nơi node LUT/CST này trở thành node 1 của một chuỗi đầy đủ — tương phản, màu thứ cấp, một look, và đúng công thức để Pocket 3 và iPhone khớp nhau một khi cả hai cuối cùng đều đang "nói" Rec.709.</p>

<h3>🎬 Thực hành (20–30 phút)</h3>
<div class="callout ok"><ol>
<li>Tải LUT D-Log M to Rec.709 chính thức của DJI từ trung tâm tải của họ và nhập vào DaVinci Resolve.</li>
<li>Áp nó cho một clip D-Log M thật và xem waveform trải rộng ra trong thời gian thực (Bài 15.2).</li>
<li>Trên một clip Apple Log, thử cả hai đường: mở nó trong Final Cut Pro (nếu có) và ghi nhận phép đổi tự động, rồi thử Color Space Transform trong Resolve với Input = Apple Log, Output = Rec.709.</li>
<li>Nếu có sẵn cảnh quay DJI, thử preset dựng sẵn "DJI D-Gamut/D-Log" của Resolve trên nó và so với kết quả từ LUT chính thức — tự thấy hiện tượng ám màu bằng mắt mình.</li>
</ol><p><strong>Đạt khi:</strong> bạn nói được, không cần kiểm lại, máy nào trong hai máy của bạn cần một file tải về và máy nào tự làm phép đổi thay bạn ngay trong app gốc.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">LUT</span><span class="v">Look-Up Table — bảng tính sẵn màu-vào → màu-ra; có thể là kỹ thuật (sửa Log→Rec.709) hoặc sáng tạo (một "look").</span></div>
<div class="kv"><span class="k">Color Space Transform (CST)</span><span class="v">Một node của Resolve tính phép đổi không gian màu trực tiếp từ công thức, thay vì một bảng tra sẵn.</span></div>
<div class="kv"><span class="k">Input/Output Color Space</span><span class="v">Hai cài đặt của CST: cảnh quay đang thật sự ở không gian nào, và bạn muốn đổi nó sang không gian nào.</span></div>
<div class="kv"><span class="k">Phơi sáng bảo vệ vùng sáng</span><span class="v">Một thói quen khi quay Log: phơi sáng hơi sáng hơn bản năng mách bảo, theo dõi bằng waveform, vì Log bảo vệ chi tiết vùng sáng nhiều hơn vùng tối.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>LUT là một bảng tra; LUT bạn cần đầu tiên là loại kỹ thuật (Log→Rec.709), không phải sáng tạo — LUT "look" sáng tạo đến sau, nếu có.</li>
<li>DJI phát hành một LUT D-Log M to Rec.709 thật, tải về được cho Pocket 3; Apple thay vào đó dựng phép đổi Apple Log NGAY trong Final Cut Pro, tự động.</li>
<li>Color Space Transform của DaVinci Resolve hỗ trợ chính thức Apple Log làm input; chưa có preset chính thức riêng cho D-Log M — dùng file LUT của DJI thay vì preset dựng sẵn "DJI D-Gamut/D-Log".</li>
<li>Đo thật: một ảnh test bị làm phẳng mất khoảng hai phần ba độ bão hoà và hơn nửa dải sáng — chỉnh màu đảo ngược cả hai, đo được bằng số.</li>
<li>Phơi sáng cảnh Log hơi sáng hơn bản năng mách bảo, theo dõi bằng waveform, để bảo vệ chi tiết vùng sáng.</li>
</ul>
<div class="link-card"><a href="https://www.dji.com/downloads/softwares/osmo-pocket-3-dlog-to-rec709" target="_blank" rel="noopener">DJI — LUT D-Log M to Rec.709 cho Osmo Pocket 3 (tải chính thức)</a></div>
<div class="link-card"><a href="https://support.apple.com/guide/final-cut-pro/apply-luts-ver24f966423/mac" target="_blank" rel="noopener">Apple Support — áp LUT trong Final Cut Pro cho Mac</a></div>
</div>
`,
    },

    /* ─────────────────── 15.4 Node & tạo look ─────────────────── */
    {
      title: '15.4 — Nodes and building a look|||15.4 — Node và tạo look',
      slug: 'cr-15-4-node-tao-look',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Cây node chỉnh màu đúng thứ tự, khớp màu Pocket 3 với iPhone, lưu look để dùng lại cho cả series, và màu trong CapCut cho video ngắn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.4</span>
<h2>A node tree is just a to-do list that refuses to let you skip steps</h2>
<p class="lead">You now have the two halves this chapter promised: what correction and grading are (15.1), how to read color as numbers (15.2), and the exact LUT/CST for your two cameras (15.3). This lesson assembles them into one repeatable chain — a node tree — then uses that chain to solve the real problem this course has been building toward: two different cameras, one consistent look.</p>

<h3>The node tree: five steps, each one only doing its own job</h3>
${slide('cr-15', 10, 'Cây node chỉnh màu kiểu DaVinci Resolve')}
<p>A <strong>node</strong> is one self-contained adjustment in a chain — Resolve's Color page lets you stack them left to right, each one receiving the output of the one before it. The order below is not arbitrary; it is the order that makes every later node's adjustments meaningful instead of guesswork:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Balance</span><span class="lz-d">The LUT or CST from Lesson 15.3, plus any remaining exposure/white balance correction. Nothing downstream means anything until this node is right.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Contrast</span><span class="lz-d">A curve — an S-curve deepens shadows and lifts highlights for punch; a "lift" curve raises blacks for a faded, low-contrast look.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Secondary</span><span class="lz-d">Isolate one part of the image — skin, sky — with a qualifier (select by color/luma) or a power window (select by shape/position), and adjust only that.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Look</span><span class="lz-d">The deliberate creative choice from Lesson 15.1's "grading" — warmer, cooler, more or less saturated, on purpose.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Finish</span><span class="lz-d">Vignette, grain — small, easy-to-overdo touches that belong last, after everything else is settled.</span></div>
</div>
<p>Move node 4 before node 1 — the exact mistake Lesson 15.1 warned about — and you are grading data that has not been corrected yet; move node 3 (secondary) before node 1 and your skin qualifier is selecting the wrong pixels, because skin still has the wrong color when you select it. The chain enforces the order Lesson 15.1 only described.</p>

<h3>The contrast node in practice: curves</h3>
<p>Node 2 is usually a <strong>curve</strong> — a graph mapping input brightness (horizontal) to output brightness (vertical), with a straight diagonal line meaning "no change." Pull the upper portion up and the lower portion down and you get an S-shape: shadows deepen, highlights lift, contrast increases — exactly what Lesson 15.3's measured demonstration showed happening to saturation and range when "grading" was simulated with &#96;eq&#96;. Pull the black end of the curve upward instead and you get a deliberately faded, lower-contrast look — a legitimate creative choice, not a mistake, when used on purpose.</p>

<h3>Lift, Gamma, Gain — the three wheels, and what each actually touches</h3>
${slide('cr-15', 11, 'Bánh xe màu: Lift · Gamma · Gain')}
<p>Resolve's primary color wheels split the tonal range into three zones you can push independently: <strong>Lift</strong> controls shadows, <strong>Gamma</strong> controls midtones, <strong>Gain</strong> controls highlights. Nudge Lift slightly toward blue/teal and Gain slightly toward orange, and you get the "teal and orange" look that shows up constantly in film and streaming color grading — not because it is a secret formula, but because cool shadows next to warm skin in the highlights is a genuinely pleasant, high-contrast color relationship. A light touch (small movements, as in the slide) reads as intentional; a heavy one reads as a beginner who just discovered the wheels exist.</p>

<h3>Matching Pocket 3 and iPhone in the same scene</h3>
${slide('cr-15', 13, 'Trước/sau: D-Log M phẳng → đã chỉnh')}
<p>Once both cameras' footage has gone through node 1 (their own correct LUT/CST from Lesson 15.3), both clips are finally speaking the same language — Rec.709 — which is the precondition for matching them at all. They will still not look identical: different sensor, different lens, different in-camera processing before the Log encode even happens. Matching is node 2 and 3's job, done by eye against the scopes from Lesson 15.2, not by assuming the LUT alone finishes the work.</p>
${slide('cr-15', 14, 'Khớp màu: Pocket 3 và iPhone trong cùng một cảnh')}
<p>A practical routine: grade the A-cam clip first, reading its waveform and vectorscope until it looks right. Then apply the <em>same</em> node tree to the B-cam clip as a starting point (copy the nodes, do not rebuild from scratch), and use the scopes to check whether skin tone on both clips now clusters near the same vectorscope position and the same waveform range. Small secondary adjustments close the remaining gap — a slightly different Gain push, a touch more saturation on one camera — until a viewer genuinely cannot tell which shot came from which device.</p>

<h3>Saving a grade so you never redo this work</h3>
<p>Once a node tree looks right, DaVinci Resolve gives you two ways to keep it. A <strong>Still</strong> is a saved grade tied to the current project — grab one from the Gallery panel and reuse it on other clips in the same project. A <strong>PowerGrade</strong> is the same idea shared across every project you open on that machine — the right choice for a look you want to reuse on your next video, and the next one after that, not just the current timeline. Either way, applying a saved grade to a new clip is normally done by right-clicking it in the Gallery and choosing <strong>Apply Grade</strong>. Build your Pocket 3 ↔ iPhone match once, save it as a PowerGrade, and every future shoot with the same two cameras starts from something already close instead of from zero.</p>

<h3>Color in CapCut for short-form work</h3>
<p>Lesson 12.4 showed you CapCut's <strong>Basic</strong> adjustment sliders — brightness, contrast, saturation, temperature/tint, highlight/shadow — and called scope-monitored, node-based grading "DaVinci Resolve territory." That framing still holds for anything needing precise, multi-clip matching. What it left out: CapCut's desktop Adjustment panel actually has more depth than that Basic tab alone — separate <strong>Color Wheels</strong>, <strong>Curves</strong>, and <strong>HSL</strong> panels sit alongside it, and desktop CapCut can import your own LUT files (<code>.cube</code>/<code>.3dl</code>) the same way Resolve does — confirmed on CapCut's own color-grading guide. For a same-day TikTok cut, that is genuinely enough to apply a consistent look across clips without opening Resolve. What CapCut still does not give you is the thing this lesson centers on: node-stacked, order-enforced adjustments monitored against scopes — one flat Adjustment layer, however many panels it has, is not the same as five nodes each doing exactly one job. For a quick short video: CapCut. For matching two cameras with scopes, or for anything you will grade seriously: DaVinci Resolve.</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — assuming a matched LUT alone means matched cameras.</strong> Two clips can both be correctly converted to Rec.709 and still look different, because the LUT only undoes the Log encoding — it says nothing about the sensor and lens that shaped the image before that encoding happened. Always confirm a "match" with the vectorscope, not just with "the LUT is right so it should match."</p></div>

<p class="note-ct"><strong>Connects to next:</strong> Chapter 16 picks up right after this chain finishes — mixing audio, adding titles and captions, the two remaining pieces of a video that looks and sounds finished.</p>

<h3>🎬 Practice (30–40 minutes)</h3>
<div class="callout ok"><ol>
<li>Build the full five-node chain on one D-Log M or Apple Log clip: node 1 LUT/CST, node 2 a contrast curve, node 3 a skin qualifier, node 4 a light Lift/Gain push, node 5 a subtle vignette.</li>
<li>If you have A/B footage from both cameras, apply node 1 to each separately, then copy nodes 2–5 from one to the other and adjust only what the scopes say still differs.</li>
<li>Save the finished tree as a Still, then right-click it and confirm Apply Grade works on a different clip.</li>
</ol><p><strong>Done when:</strong> the vectorscope's skin cloud sits on the ≈123° line for both cameras' footage, and you can explain why node 1 has to be first, in your own words, without rereading this lesson.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Node</span><span class="v">Một node — one self-contained adjustment in a chain, receiving the output of the node before it.</span></div>
<div class="kv"><span class="k">Qualifier</span><span class="v">A secondary-node tool that selects pixels by color or luma value — e.g. "just the skin."</span></div>
<div class="kv"><span class="k">Power window</span><span class="v">A secondary-node tool that selects pixels by shape/position in the frame — e.g. "just the sky."</span></div>
<div class="kv"><span class="k">Still</span><span class="v">A saved grade tied to one project, reusable on other clips in that same project.</span></div>
<div class="kv"><span class="k">PowerGrade</span><span class="v">A saved grade shared across every project on the machine — the right choice for a recurring series look.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>The node order — balance, contrast, secondary, look, finish — is not arbitrary; each later step only makes sense once the ones before it are correct.</li>
<li>Lift/Gamma/Gain split the tonal range into shadows/midtones/highlights; small, deliberate pushes read as a style, heavy ones read as inexperience.</li>
<li>Matching two cameras is a scopes-checked process that starts after both clips share node 1's LUT/CST, not something the LUT does by itself.</li>
<li>Stills save a grade for one project; PowerGrades save it for every project — build your camera match once and reuse it.</li>
<li>CapCut's desktop Adjustment panel has Color Wheels, Curves, HSL and LUT import beyond the Basic sliders Chapter 12 showed — enough for consistent short-form color, still short of Resolve's scope-monitored node stacking.</li>
</ul>
<div class="link-card"><a href="https://www.blackmagicdesign.com/products/davinciresolve" target="_blank" rel="noopener">Blackmagic Design — DaVinci Resolve product page (Color page, Free vs Studio)</a></div>
<div class="link-card"><a href="https://www.capcut.com/resource/capcut-color-grading" target="_blank" rel="noopener">CapCut — color grading guide (Color Wheels, Curves, HSL, LUT import)</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.4</span>
<h2>Một cây node chỉ là một danh sách việc cần làm không cho phép bạn nhảy cóc</h2>
<p class="lead">Giờ bạn đã có hai nửa chương này đã hứa: correction và grading là gì (15.1), cách đọc màu bằng số (15.2), và đúng LUT/CST cho hai máy bạn có (15.3). Bài này gộp tất cả thành một chuỗi lặp lại được — một cây node — rồi dùng chính chuỗi đó để giải bài toán thật khoá học này đã xây dựng tới: hai máy quay khác nhau, một look nhất quán.</p>

<h3>Cây node: năm bước, mỗi bước chỉ làm đúng một việc của nó</h3>
${slide('cr-15', 10, 'Cây node chỉnh màu kiểu DaVinci Resolve')}
<p>Một <strong>node</strong> là một lượt chỉnh tự thân trong một chuỗi — trang Color của Resolve cho bạn xếp chúng từ trái sang phải, mỗi node nhận đầu ra của node trước nó. Thứ tự dưới đây không tuỳ tiện; đó là thứ tự khiến mọi chỉnh sửa ở các node sau có Ý NGHĨA thay vì đoán mò:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Cân bằng</span><span class="lz-d">LUT hoặc CST từ Bài 15.3, cộng bất kỳ phần correction phơi sáng/cân bằng trắng còn sót. Không gì ở phía sau có ý nghĩa cho tới khi node này đúng.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Tương phản</span><span class="lz-d">Một đường cong — S-curve đào sâu vùng tối và nâng vùng sáng để tạo độ "đanh"; đường cong "lift" nâng đen lên cho look phai màu, tương phản thấp.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Thứ cấp</span><span class="lz-d">Chọn riêng một phần của ảnh — da, trời — bằng qualifier (chọn theo màu/độ sáng) hoặc power window (chọn theo hình dạng/vị trí), rồi chỉnh CHỈ phần đó.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Look</span><span class="lz-d">Lựa chọn sáng tạo có chủ đích từ "grading" ở Bài 15.1 — ấm hơn, lạnh hơn, bão hoà hơn hoặc ít hơn, có chủ đích.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Hoàn thiện</span><span class="lz-d">Vignette, grain — những chạm nhẹ dễ làm quá tay, thuộc về CUỐI, sau khi mọi thứ khác đã ổn định.</span></div>
</div>
<p>Đưa node 4 lên trước node 1 — đúng lỗi Bài 15.1 đã cảnh báo — nghĩa là bạn đang grading trên dữ liệu chưa được correction; đưa node 3 (thứ cấp) lên trước node 1, qualifier chọn da của bạn sẽ chọn NHẦM điểm ảnh, vì da vẫn còn sai màu lúc bạn chọn nó. Cây node ép đúng thứ tự mà Bài 15.1 mới chỉ MÔ TẢ.</p>

<h3>Node tương phản trong thực tế: đường cong (curves)</h3>
<p>Node 2 thường là một <strong>đường cong</strong> — một biểu đồ ánh xạ độ sáng đầu vào (trục ngang) sang độ sáng đầu ra (trục dọc), một đường chéo thẳng nghĩa là "không đổi gì". Kéo phần trên lên và phần dưới xuống, bạn có hình chữ S: vùng tối đào sâu, vùng sáng nâng lên, tương phản tăng — đúng thứ phép đo ở Bài 15.3 đã cho thấy xảy ra với độ bão hoà và dải sáng khi "chỉnh màu" được mô phỏng bằng &#96;eq&#96;. Kéo đầu đen của đường cong lên thay vào đó, bạn có một look phai màu, tương phản thấp có chủ đích — một lựa chọn sáng tạo hợp lệ, không phải sai lầm, khi dùng có ý thức.</p>

<h3>Lift, Gamma, Gain — ba bánh xe, và mỗi cái thật sự chạm vào đâu</h3>
${slide('cr-15', 11, 'Bánh xe màu: Lift · Gamma · Gain')}
<p>Bánh xe màu chính (primary) của Resolve chia dải tông màu thành ba vùng bạn đẩy được độc lập: <strong>Lift</strong> điều khiển vùng tối, <strong>Gamma</strong> điều khiển vùng giữa, <strong>Gain</strong> điều khiển vùng sáng. Nhích Lift hơi ngả xanh lam/teal và Gain hơi ngả cam, bạn có look "teal and orange" xuất hiện liên tục trong màu phim và streaming — không phải vì đó là công thức bí mật, mà vì vùng tối lạnh đứng cạnh da người ấm ở vùng sáng là một mối quan hệ màu tương phản, dễ chịu thật sự. Một cú chạm nhẹ (di chuyển nhỏ, như trong slide) đọc lên là có chủ đích; một cú kéo mạnh tay đọc lên là một người mới vừa phát hiện ra bánh xe tồn tại.</p>

<h3>Khớp màu Pocket 3 và iPhone trong cùng một cảnh</h3>
${slide('cr-15', 13, 'Trước/sau: D-Log M phẳng → đã chỉnh')}
<p>Một khi cảnh quay của cả hai máy đã qua node 1 (đúng LUT/CST riêng của từng máy từ Bài 15.3), cả hai clip cuối cùng đều "nói" cùng một ngôn ngữ — Rec.709 — điều kiện tiên quyết để khớp chúng với nhau. Chúng vẫn sẽ KHÔNG giống hệt nhau: cảm biến khác, ống kính khác, xử lý trong máy khác nhau trước cả khi mã hoá Log diễn ra. Khớp màu là việc của node 2 và 3, làm bằng mắt đối chiếu với scope ở Bài 15.2, không phải giả định riêng LUT là xong việc.</p>
${slide('cr-15', 14, 'Khớp màu: Pocket 3 và iPhone trong cùng một cảnh')}
<p>Một quy trình thực tế: chỉnh clip A-cam trước, đọc waveform và vectorscope của nó tới khi trông đúng. Rồi áp CÙNG cây node đó lên clip B-cam làm điểm khởi đầu (sao chép node, đừng dựng lại từ đầu), và dùng scope để kiểm xem tông da trên cả hai clip giờ có tụ lại gần cùng một vị trí trên vectorscope và cùng một dải waveform không. Những chỉnh thứ cấp nhỏ khép lại phần chênh lệch còn lại — một cú đẩy Gain hơi khác, thêm một chút bão hoà ở một máy — cho tới khi người xem thật sự không đoán được cảnh nào quay bằng máy nào.</p>

<h3>Lưu một grade để không bao giờ phải làm lại việc này</h3>
<p>Một khi cây node trông đúng, DaVinci Resolve cho bạn hai cách giữ lại nó. Một <strong>Still</strong> là một grade đã lưu, gắn với đúng dự án hiện tại — lấy nó từ panel Gallery và dùng lại cho các clip khác trong cùng dự án đó. Một <strong>PowerGrade</strong> là cùng ý tưởng đó nhưng dùng chung cho MỌI dự án bạn mở trên máy đó — lựa chọn đúng cho một look bạn muốn dùng lại ở video tiếp theo, rồi video tiếp theo nữa, không chỉ timeline hiện tại. Dù cách nào, áp một grade đã lưu lên một clip mới thường làm bằng cách chuột phải nó trong Gallery và chọn <strong>Apply Grade</strong>. Dựng đúng một lần cây node khớp Pocket 3 ↔ iPhone, lưu thành PowerGrade, và mọi buổi quay sau này với cùng hai máy bắt đầu từ một thứ đã gần đúng thay vì từ số 0.</p>

<h3>Màu trong CapCut cho công việc video ngắn</h3>
<p>Bài 12.4 đã cho bạn thấy các thanh trượt <strong>Basic</strong> của CapCut — brightness, contrast, saturation, temperature/tint, highlight/shadow — và gọi grading theo node có theo dõi bằng scope là "chuyện của DaVinci Resolve". Cách nhìn đó vẫn đúng cho bất cứ thứ gì cần khớp chính xác nhiều clip. Điều bài đó chưa nói tới: bảng Adjustment trên bản desktop của CapCut thật ra sâu hơn riêng tab Basic đó — có riêng các panel <strong>Color Wheels</strong>, <strong>Curves</strong>, và <strong>HSL</strong> nằm cạnh nó, và CapCut bản desktop nhập được LUT của riêng bạn (<code>.cube</code>/<code>.3dl</code>) giống hệt cách Resolve làm — đã xác nhận trên đúng trang hướng dẫn chỉnh màu của CapCut. Cho một bản dựng TikTok đăng trong ngày, vậy là thật sự đủ để áp một look nhất quán lên các clip mà không cần mở Resolve. Thứ CapCut vẫn chưa cho bạn là đúng thứ bài này xoay quanh: các chỉnh sửa xếp theo node, ép đúng thứ tự, theo dõi bằng scope — một lớp Adjustment phẳng, dù có bao nhiêu panel, không giống năm node mỗi cái chỉ làm đúng một việc. Cho một video ngắn dựng nhanh: CapCut. Cho khớp màu hai máy bằng scope, hay bất cứ gì bạn sẽ chỉnh màu nghiêm túc: DaVinci Resolve.</p>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — tưởng LUT khớp nhau nghĩa là hai máy đã khớp.</strong> Hai clip có thể cùng được đổi đúng sang Rec.709 mà vẫn trông khác nhau, vì LUT chỉ gỡ bỏ phần mã hoá Log — nó không nói gì về cảm biến và ống kính đã định hình ảnh TRƯỚC cả khi mã hoá đó diễn ra. Luôn xác nhận một cú "khớp" bằng vectorscope, không chỉ bằng "LUT đúng nên chắc nó khớp".</p></div>

<p class="note-ct"><strong>Nối với chương sau:</strong> Chương 16 tiếp tục ngay sau khi chuỗi này xong — mix âm thanh, thêm chữ và phụ đề, hai mảnh còn lại của một video vừa nhìn vừa nghe đều hoàn chỉnh.</p>

<h3>🎬 Thực hành (30–40 phút)</h3>
<div class="callout ok"><ol>
<li>Dựng trọn cây năm node trên một clip D-Log M hoặc Apple Log: node 1 LUT/CST, node 2 một đường cong tương phản, node 3 một qualifier chọn da, node 4 một cú đẩy Lift/Gain nhẹ, node 5 một vignette tinh tế.</li>
<li>Nếu có cảnh quay A/B từ cả hai máy, áp node 1 riêng cho từng cái, rồi sao chép node 2–5 từ một clip sang clip kia và chỉ chỉnh thêm phần scope cho thấy vẫn còn lệch.</li>
<li>Lưu cây node hoàn chỉnh thành một Still, rồi chuột phải nó và xác nhận Apply Grade hoạt động trên một clip khác.</li>
</ol><p><strong>Đạt khi:</strong> đám mây da trên vectorscope nằm trên đường ≈123° cho cảnh quay của CẢ HAI máy, và bạn giải thích được, bằng lời của chính mình, vì sao node 1 phải đứng đầu, mà không cần đọc lại bài này.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Node</span><span class="v">Một lượt chỉnh tự thân trong một chuỗi, nhận đầu ra của node đứng trước nó.</span></div>
<div class="kv"><span class="k">Qualifier</span><span class="v">Công cụ ở node thứ cấp chọn điểm ảnh theo giá trị màu/độ sáng — vd "chỉ vùng da".</span></div>
<div class="kv"><span class="k">Power window</span><span class="v">Công cụ ở node thứ cấp chọn điểm ảnh theo hình dạng/vị trí trong khung hình — vd "chỉ bầu trời".</span></div>
<div class="kv"><span class="k">Still</span><span class="v">Một grade đã lưu, gắn với một dự án, dùng lại được cho các clip khác trong đúng dự án đó.</span></div>
<div class="kv"><span class="k">PowerGrade</span><span class="v">Một grade đã lưu, dùng chung cho mọi dự án trên máy — lựa chọn đúng cho một look lặp lại theo series.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Thứ tự node — cân bằng, tương phản, thứ cấp, look, hoàn thiện — không tuỳ tiện; mỗi bước sau chỉ có ý nghĩa khi các bước trước đã đúng.</li>
<li>Lift/Gamma/Gain chia dải tông màu thành vùng tối/giữa/sáng; đẩy nhẹ có chủ đích đọc lên là phong cách, đẩy mạnh tay đọc lên là thiếu kinh nghiệm.</li>
<li>Khớp hai máy là một quy trình kiểm bằng scope, bắt đầu SAU khi cả hai clip đã cùng qua LUT/CST của node 1 — không phải điều LUT tự làm một mình.</li>
<li>Still lưu một grade cho một dự án; PowerGrade lưu cho mọi dự án — dựng công thức khớp máy một lần rồi dùng lại mãi.</li>
<li>Bảng Adjustment desktop của CapCut có Color Wheels, Curves, HSL và nhập LUT ngoài các thanh trượt Basic mà Chương 12 đã cho xem — đủ cho màu nhất quán ở video ngắn, vẫn chưa bằng việc xếp node theo dõi bằng scope của Resolve.</li>
</ul>
<div class="link-card"><a href="https://www.blackmagicdesign.com/products/davinciresolve" target="_blank" rel="noopener">Blackmagic Design — trang sản phẩm DaVinci Resolve (trang Color, Miễn phí vs Studio)</a></div>
<div class="link-card"><a href="https://www.capcut.com/resource/capcut-color-grading" target="_blank" rel="noopener">CapCut — hướng dẫn chỉnh màu (Color Wheels, Curves, HSL, nhập LUT)</a></div>
</div>
`,
    },

    /* ─────────────────── 15.5 Kiểm tra chương ─────────────────── */
    {
      title: '15.5 — Chapter 15 check|||15.5 — Kiểm tra chương 15',
      slug: 'cr-15-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: '10 câu tình huống thực tế: correction vs grading, đọc waveform/vectorscope/parade, LUT chính hãng cho D-Log M và Apple Log, và thứ tự node.',
      content: `
<div class="ml-en">
<h2>📌 Chapter 15 summary</h2>
<p>Color is two jobs done in order: <strong>correction</strong> (mandatory — exposure, white balance, matching clips) always before <strong>grading</strong> (optional — a deliberate look). Log footage looks grey because it is unconverted wide-gamut, log-curve data, not because anything is broken. Trust scopes over your eyes and your room: waveform for brightness, vectorscope for color and skin tone (≈123°), RGB Parade for which channel and where, histogram for clipping. DJI publishes a real downloadable D-Log M→Rec.709 LUT; Apple instead bakes the Apple Log conversion into Final Cut Pro automatically, and DaVinci Resolve's Color Space Transform supports Apple Log directly but has no official preset for D-Log M — use DJI's LUT, not the built-in "DJI D-Gamut/D-Log" preset. A node tree enforces order: balance (LUT/CST) → contrast → secondary → look → finish. Matching two cameras happens after both share a correct node 1, checked with scopes, then saved as a Still or PowerGrade for reuse.</p>
<h3>Self-check</h3>
<ul>
<li>I can explain, without notes, why correction must finish before grading starts.</li>
<li>I know which scope answers "too dark," which answers "is skin tone right," and which answers "which channel is the problem."</li>
<li>I know where to get an official D-Log M LUT, and why Apple Log has no equivalent downloadable file.</li>
<li>I know D-Log M has no official Resolve CST preset, and what to use instead.</li>
<li>I can build a 5-node chain in the correct order and explain why the order matters.</li>
</ul>
</div>
<div class="ml-vi">
<h2>📌 Tóm tắt chương 15</h2>
<p>Màu là hai việc làm theo đúng thứ tự: <strong>correction</strong> (bắt buộc — phơi sáng, cân bằng trắng, khớp clip) luôn TRƯỚC <strong>grading</strong> (tự chọn — một look có chủ đích). Cảnh Log trông xám vì đó là dữ liệu gamut rộng, đường cong log, CHƯA được chuyển đổi, không phải vì có gì hỏng. Tin scope hơn mắt bạn và căn phòng bạn đang ngồi: waveform cho độ sáng, vectorscope cho màu và tông da (≈123°), RGB Parade cho biết kênh nào và ở đâu, histogram cho việc cháy sáng. DJI phát hành một LUT D-Log M→Rec.709 thật, tải về được; Apple thay vào đó nhúng phép đổi Apple Log NGAY trong Final Cut Pro tự động, và Color Space Transform của DaVinci Resolve hỗ trợ trực tiếp Apple Log nhưng chưa có preset chính thức cho D-Log M — dùng LUT của DJI, không dùng preset dựng sẵn "DJI D-Gamut/D-Log". Một cây node ép đúng thứ tự: cân bằng (LUT/CST) → tương phản → thứ cấp → look → hoàn thiện. Khớp hai máy diễn ra SAU khi cả hai cùng có đúng node 1, kiểm bằng scope, rồi lưu thành Still hoặc PowerGrade để dùng lại.</p>
<h3>Tự kiểm</h3>
<ul>
<li>Tôi giải thích được, không cần xem lại, vì sao correction phải xong trước khi grading bắt đầu.</li>
<li>Tôi biết scope nào trả lời "tối quá", scope nào trả lời "tông da có đúng không", và scope nào trả lời "kênh nào đang là vấn đề".</li>
<li>Tôi biết lấy LUT D-Log M chính hãng ở đâu, và vì sao Apple Log không có file tải về tương đương.</li>
<li>Tôi biết D-Log M chưa có preset CST chính thức trong Resolve, và nên dùng gì thay vào đó.</li>
<li>Tôi dựng được một chuỗi 5 node đúng thứ tự và giải thích được vì sao thứ tự đó quan trọng.</li>
</ul>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'You just dropped D-Log M footage into DaVinci Resolve, it looks grey, so you immediately push saturation to maximum before doing anything else. What is wrong with that approach?|||Bạn vừa đưa clip D-Log M vào DaVinci Resolve, thấy xám xịt, liền kéo saturation lên tối đa trước khi làm gì khác. Cách làm này sai ở đâu?',
            options: [
              'You are grading (adding a look) before correction is finished, so the result is calculated on top of wrong data|||Bạn đang grading (thêm look) trước khi correction xong, nên kết quả được tính trên dữ liệu còn sai',
              'Nothing is wrong — pushing saturation up is the correct first move|||Không sai gì cả — kéo saturation lên là nước đi đầu tiên đúng',
              'D-Log M does not need correction because it is already in Rec.709|||D-Log M không cần correction vì đã ở sẵn Rec.709',
              'Grading should always happen before correction to save time|||Grading nên luôn làm trước correction để tiết kiệm thời gian',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Lesson 15.1 is explicit about the order: correction (exposure, white balance, matching) is mandatory and must come first; grading is the optional creative layer added afterward. Pushing saturation on ungraded, uncorrected Log footage means every later adjustment — including the LUT/CST itself — is calibrated against a color that will shift again once correction actually happens.|||VI: Bài 15.1 nói rõ thứ tự: correction (phơi sáng, cân bằng trắng, khớp clip) là bắt buộc và phải làm trước; grading là lớp sáng tạo tự chọn thêm vào sau. Kéo saturation trên cảnh Log chưa correction nghĩa là mọi chỉnh sau đó — kể cả chính LUT/CST — đang canh trên một màu sẽ lệch lại ngay khi correction thật sự diễn ra.',
          },
          {
            question: 'Cường grades a video on his MacBook Pro M1 Max in a very bright coffee shop and it looks great; back home in a dim room, it looks noticeably blue-shifted. What is the most likely cause?|||Cường chỉnh màu một video trên MacBook Pro M1 Max ở quán cà phê rất sáng, thấy đẹp; về nhà trong phòng tối lại thấy ám xanh rõ rệt. Nguyên nhân hợp lý nhất là gì?',
            options: [
              'The file got corrupted while copying it home|||File bị hỏng khi copy về nhà',
              'The viewing environment changes color perception, and he was not using Reference Mode or checking scopes rather than trusting his eyes|||Môi trường xem thay đổi cảm nhận màu, và anh chưa bật Reference Mode hoặc chưa kiểm bằng scope thay vì chỉ tin mắt',
              'MacBook Pro screens cannot be used for color work at all|||Màn hình MacBook Pro hoàn toàn không dùng để chỉnh màu được',
              'Only a Mac Studio can grade color accurately|||Chỉ Mac Studio mới chỉnh màu chính xác được',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Lesson 15.1 warns that even a capable screen is fooled by room lighting, and Lesson 15.2 exists precisely so scopes — not a perceptually adapting eye in a changing room — are the actual source of truth. Reference Mode locks the display to a known standard, but it does not fix a dim or overly bright viewing room on its own.|||VI: Bài 15.1 cảnh báo ngay cả một màn hình tốt cũng bị ánh sáng phòng đánh lừa, và Bài 15.2 tồn tại chính xác để scope — không phải một con mắt đang thích nghi trong một căn phòng đổi ánh sáng — mới là nguồn sự thật thật sự. Reference Mode khoá màn hình vào một chuẩn đã biết, nhưng tự nó không sửa được một căn phòng xem quá tối hoặc quá sáng.',
          },
          {
            question: 'The waveform of a talking-head clip is bunched almost entirely between 0 and 20. What does that mean, and what should you do?|||Waveform của một clip talking-head dồn gần hết vào khoảng 0-20. Điều đó nghĩa là gì, và bạn nên làm gì?',
            options: [
              'The shot is overexposed — lower the ISO next time|||Cảnh bị cháy sáng — lần sau giảm ISO',
              'The camera sensor is defective|||Cảm biến máy quay bị lỗi',
              'The shot is underexposed — raise exposure in correction, and shoot with more light next time|||Cảnh bị thiếu sáng — tăng sáng khi correction, và quay với nhiều sáng hơn lần sau',
              'This is a normal sign of Log footage and needs no fix|||Đây là dấu hiệu bình thường của cảnh Log, không cần sửa',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Values bunched near 0 on a 0–100 waveform mean the image is dark — underexposed, not overexposed (which would bunch near 100) and not a sensor fault. Log’s flat signature (Lesson 15.3) is a narrow band in the middle of the range, not pinned to the bottom.|||VI: Giá trị dồn sát 0 trên waveform 0–100 nghĩa là ảnh tối — thiếu sáng, không phải cháy sáng (cái đó dồn sát 100) và không phải lỗi cảm biến. Đặc trưng phẳng của Log (Bài 15.3) là một dải hẹp ở GIỮA dải giá trị, không phải dồn sát đáy.',
          },
          {
            question: 'On the vectorscope, the cluster of dots from a person’s face sits far from the ≈123° skin tone line, shifted toward yellow-green. What is this a sign of?|||Trên vectorscope, đám mây điểm ảnh từ khuôn mặt một người nằm CÁCH XA đường mốc da ≈123°, lệch về phía vàng-lục. Đây là dấu hiệu của điều gì?',
            options: [
              'The person is wearing heavy makeup|||Người trong khung trang điểm rất đậm',
              'The camera’s 10-bit sensor is malfunctioning|||Cảm biến 10-bit của máy quay đang hỏng',
              'The vectorscope is reading incorrectly and should be ignored|||Vectorscope đang đọc sai, nên bỏ qua nó',
              'White balance/color is off and needs correcting|||Cân bằng trắng/màu đang lệch, cần correction lại',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Lesson 15.2 explains that human skin tones across ethnicities cluster near the same hue angle on the vectorscope — a cluster sitting far off that line is the objective sign of a white balance or color error, exactly the kind of thing correction (Lesson 15.1) exists to fix before any grading happens.|||VI: Bài 15.2 giải thích tông da người ở các sắc tộc khác nhau tập trung quanh gần cùng một góc sắc độ trên vectorscope — một đám mây nằm xa đường đó là dấu hiệu khách quan của lỗi cân bằng trắng/màu, đúng loại việc correction (Bài 15.1) tồn tại để sửa trước khi grading diễn ra.',
          },
          {
            question: 'You want to know which color channel (red/green/blue) is running hotter than the others, AND where in the frame it is worst (top, bottom, one side). Which single tool gives you both pieces of information at once?|||Bạn muốn biết kênh màu nào (đỏ/lục/lam) đang cao hơn hai kênh còn lại, VÀ nó lệch nặng nhất ở đâu trong khung hình (trên, dưới, một bên). Công cụ nào cho cả hai thông tin đó cùng lúc?',
            options: [
              'Histogram|||Histogram',
              'RGB Parade — it keeps each channel tied to its horizontal position in the frame, unlike a histogram|||RGB Parade — vì nó giữ mỗi kênh gắn với đúng vị trí ngang trong khung hình, khác với histogram',
              'Zebra|||Zebra',
              'False color|||False color',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Lesson 15.2 is explicit that histogram throws away spatial position entirely — it only counts pixels per brightness level. RGB Parade is the one scope that separates channels AND keeps each one tied to horizontal frame position, which is exactly what answers "which channel, and where."|||VI: Bài 15.2 nói rõ histogram vứt bỏ hoàn toàn vị trí không gian — nó chỉ đếm điểm ảnh theo mức sáng. RGB Parade là scope duy nhất tách kênh VÀ vẫn giữ mỗi kênh gắn với vị trí ngang trong khung hình, đúng thứ trả lời được "kênh nào, và ở đâu".',
          },
          {
            question: 'Shooting D-Log M on the Pocket 3, you want the fast route back to Rec.709 using an official LUT. Where should you get that file?|||Quay D-Log M trên Pocket 3, bạn muốn đường nhanh về Rec.709 bằng một LUT chính hãng. Bạn nên lấy file đó ở đâu?',
            options: [
              'DJI’s own official download center (Transcoders / D-Log M to Rec.709 LUT for Osmo Pocket 3)|||Trung tâm tải chính thức của DJI (mục Transcoders / LUT D-Log M to Rec.709 cho Osmo Pocket 3)',
              'Type in plausible-sounding numbers by hand inside Resolve|||Tự gõ những con số nghe hợp lý bằng tay trong Resolve',
              'Ask in any random Facebook group|||Xin trong một group Facebook bất kỳ',
              'No LUT is needed — D-Log M is automatically Rec.709|||Không cần LUT — D-Log M tự động đã là Rec.709',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Lesson 15.3 confirms DJI publishes a real, downloadable D-Log M to Rec.709 .cube LUT directly on its own download center. D-Log M is deliberately NOT Rec.709 out of camera (Lesson 5.4/15.1) — that is the entire reason a conversion step exists.|||VI: Bài 15.3 xác nhận DJI phát hành một LUT D-Log M to Rec.709 dạng .cube thật, tải được ngay trên trung tâm tải của chính họ. D-Log M cố tình KHÔNG phải Rec.709 ngay khi ra khỏi máy (Bài 5.4/15.1) — đó chính là lý do một bước chuyển đổi tồn tại.',
          },
          {
            question: 'In DaVinci Resolve’s Color Space Transform, you apply the built-in "DJI D-Gamut/D-Log" preset to a D-Log M clip from the Pocket 3 and the result looks visibly oversaturated and off. Why?|||Trong Color Space Transform của DaVinci Resolve, bạn áp preset dựng sẵn "DJI D-Gamut/D-Log" cho một clip D-Log M từ Pocket 3 và kết quả trông rõ ràng bị ám màu/quá bão hoà. Vì sao?',
            options: [
              'Resolve has a software bug in this version|||Resolve bị lỗi phần mềm ở bản này',
              'You must always use CST and are never allowed to use a LUT file|||Phải luôn dùng CST, không bao giờ được dùng file LUT',
              'That preset was tuned for DJI’s older, pre-"M" D-Log format — there is no official CST preset for D-Log M specifically, so DJI’s own LUT file is the reliable path|||Preset đó được tinh chỉnh cho định dạng D-Log ĐỜI CŨ, trước bản "M" của DJI — chưa có preset CST chính thức riêng cho D-Log M, nên file LUT của chính DJI là đường đáng tin',
              'D-Log M footage cannot be color graded in DaVinci Resolve at all|||Cảnh D-Log M hoàn toàn không chỉnh màu được trong DaVinci Resolve',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Lesson 15.3’s real gap: the built-in DJI preset predates the "M" revision of D-Log and is a known mismatch for it. The dependable fix is the DJI-published LUT file, not this preset — the pitfall in that lesson names this exact trap.|||VI: Khoảng trống thật ở Bài 15.3: preset dựng sẵn của DJI có từ trước bản sửa đổi "M" của D-Log và được ghi nhận là lệch khi dùng cho nó. Cách sửa đáng tin là file LUT do DJI phát hành, không phải preset này — khối bẫy trong bài đó gọi tên đúng cái bẫy này.',
          },
          {
            question: 'You search for an official standalone "Apple Log to Rec.709" .cube file to download from Apple, the way DJI provides one for Pocket 3, but cannot find one. Why?|||Bạn tìm một file .cube "Apple Log to Rec.709" chính thức, độc lập để tải từ Apple, giống cách DJI cung cấp cho Pocket 3, nhưng không tìm ra. Vì sao?',
            options: [
              'Apple has never supported converting Apple Log to Rec.709 in any app|||Apple chưa từng hỗ trợ đổi Apple Log sang Rec.709 ở bất kỳ app nào',
              'It only works on Windows computers|||Nó chỉ hoạt động trên máy Windows',
              'It requires a separate paid subscription to unlock|||Cần một gói trả phí riêng mới mở khoá được',
              'Apple embeds the conversion directly inside Final Cut Pro, applied automatically from metadata, instead of publishing a separate .cube file|||Apple nhúng phép đổi NGAY TRONG Final Cut Pro, tự áp theo metadata, thay vì phát hành một file .cube rời',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Lesson 15.3 confirms this asymmetry directly from Apple’s own Final Cut Pro documentation: the built-in camera LUT applies automatically on import, with nothing to download by hand — a genuinely different distribution model from DJI’s, not a missing feature.|||VI: Bài 15.3 xác nhận sự bất đối xứng này trực tiếp từ tài liệu Final Cut Pro của chính Apple: LUT camera dựng sẵn tự áp ngay lúc nhập, không có gì để tải bằng tay — một mô hình phân phối thật sự khác với DJI, không phải một tính năng còn thiếu.',
          },
          {
            question: 'You build a node tree with Node 1 = a warm/cool creative look and Node 2 = the D-Log M→Rec.709 LUT. The result looks seriously wrong. What is the mistake?|||Bạn dựng cây node với Node 1 = một look ấm/lạnh sáng tạo và Node 2 = LUT D-Log M→Rec.709. Kết quả trông sai nghiêm trọng. Sai ở đâu?',
            options: [
              'You must always use exactly 5 nodes, and having only 2 is the error|||Phải luôn dùng đúng 5 node, chỉ có 2 node là lỗi',
              'The look node must come AFTER the LUT/CST node — the LUT/CST always belongs first|||Node look phải đứng SAU node LUT/CST — LUT/CST luôn thuộc về vị trí đầu tiên',
              'Color wheels only work on the very last node in a chain|||Bánh xe màu chỉ hoạt động ở node cuối cùng trong chuỗi',
              'This error has nothing to do with node order|||Lỗi này không liên quan gì tới thứ tự node',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Lesson 15.4’s node tree is explicit: balance (LUT/CST) is node 1 because nothing downstream means anything until the footage is actually in Rec.709. A look pushed onto still-Log data gets recalculated wrong the moment the LUT runs afterward.|||VI: Cây node ở Bài 15.4 nói rõ: cân bằng (LUT/CST) là node 1 vì không gì ở phía sau có ý nghĩa cho tới khi cảnh quay THẬT SỰ đã ở Rec.709. Một look đẩy lên dữ liệu vẫn còn là Log bị tính lại sai ngay khi LUT chạy sau đó.',
          },
          {
            question: 'Cường shoots A-cam on Pocket 3 (D-Log M) and B-cam on iPhone (Apple Log) for the same interview, and needs the two matched before cutting a short video to post on TikTok the same day. What is the most sensible tool choice?|||Cường quay A-cam bằng Pocket 3 (D-Log M) và B-cam bằng iPhone (Apple Log) cho cùng một buổi phỏng vấn, cần khớp màu hai máy trước khi dựng một video ngắn đăng TikTok trong ngày. Lựa chọn công cụ nào hợp lý nhất?',
            options: [
              'DaVinci Resolve — correct each camera to Rec.709 first, then match with nodes while watching scopes|||DaVinci Resolve — đưa từng máy về đúng Rec.709 trước, rồi khớp bằng node trong lúc theo dõi scope',
              'CapCut’s Basic Adjustment tab — just drag saturation up on both clips|||Tab Adjustment Basic của CapCut — chỉ kéo saturation lên cho cả hai clip',
              'Skip matching entirely — TikTok viewers will not notice|||Bỏ qua khớp màu hoàn toàn — khán giả TikTok sẽ không để ý',
              'Upload the raw Log files directly to TikTok, unconverted|||Tải thẳng file Log gốc, chưa chuyển đổi, lên TikTok',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Lesson 15.4 draws this line directly: CapCut’s Basic sliders (and even its Color Wheels/Curves/HSL) are one flat adjustment layer, not the node-stacked, scope-monitored process real A/B camera matching needs — that precision is exactly what DaVinci Resolve’s Color page is for, even under a same-day deadline.|||VI: Bài 15.4 vạch thẳng ranh giới này: các thanh trượt Basic của CapCut (kể cả Color Wheels/Curves/HSL) là một lớp chỉnh phẳng, không phải quy trình xếp node, theo dõi bằng scope mà việc khớp máy A/B thật sự cần — độ chính xác đó chính là lý do trang Color của DaVinci Resolve tồn tại, ngay cả dưới deadline trong ngày.',
          },
        ],
      },
    },
  ],
};
