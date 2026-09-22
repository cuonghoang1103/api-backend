/**
 * Content Creator — Chương 17: Chuyển cảnh, keyframe & tốc độ. Song ngữ EN/VI (.ml-en / .ml-vi).
 * ⚠️ KHÔNG backtick trần trong content (dùng &#96;); `${` trong mã mẫu viết \${ ; gạch chéo ngược viết \\
 */
import { gallery, slide } from './_slides.mjs';

const SLIDES = [
  [1, 'Bìa'],
  [2, 'Bản đồ chương'],
  [3, 'Quay ĐỂ dựng chuyển cảnh — mini shot list whip pan / vật cản'],
  [4, 'Đặt chuyển cảnh: độ dài & vị trí so với điểm cắt'],
  [5, 'Sáu kiểu chuyển cảnh THẬT SỰ dùng được'],
  [6, 'Chuyển cảnh có lý do, hay chỉ vì "nhìn cho vui"?'],
  [7, 'Keyframe: nội suy tuyến tính vs easing'],
  [8, 'Bảng tra: điều khiển keyframe ở đâu'],
  [9, 'Keyframe dùng vào việc gì — 5 ứng dụng thật'],
  [10, 'Speed ramp — đường cong tốc độ theo thời gian'],
  [11, 'fps lúc quay → hệ số chậm trên timeline 25fps'],
  [12, 'Slow motion ĐÚNG vs làm chậm clip quay thường'],
  [13, 'Nén thời gian: timelapse, hyperlapse, motionlapse'],
  [14, 'Hệ thống hiệu ứng — một lớp phủ, không sửa từng clip'],
  [15, 'Bảng tra nhanh — muốn làm gì thì mở công cụ nào'],
  [16, 'Thực hành chương 17'],
];

export default {
  title: 'Chapter 17 — Transitions, keyframes & speed|||Chương 17 — Chuyển cảnh, keyframe & tốc độ',
  description: 'Từ cắt cứng cơ bản (Ch.14) lên chuyển cảnh có lý do, keyframe mượt bằng easing, và tốc độ/thời gian ĐÚNG kỹ thuật — slow motion thật, speed ramp, timelapse — cho video trông như dân chuyên nghiệp dựng.',
  lessons: [

    /* ─────────────────── 17.0 slide bài giảng ─────────────────── */
    {
      title: '17.0 — Chapter 17 in 16 slides|||17.0 — Chương 17 trong 16 slide',
      slug: 'cr-17-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Toàn bộ chương gói trong 16 slide có hình: quay để dựng chuyển cảnh, easing keyframe, speed ramp, bảng fps → hệ số chậm đo thật, timelapse/hyperlapse, và hệ thống hiệu ứng.',
      content: `
<div class="ml-en"><h2>📑 Chapter 17 in 16 slides</h2>
<p>Chapters 12–14 got you to "I can cut a watchable video." This deck is the bridge to "I can make it look like a professional cut it": slide 3 (shooting for a transition instead of hoping one fixes it in post), slide 7 (the exact difference between linear and eased motion, drawn as a graph), and slide 12 (real ffmpeg numbers proving why stretching a normal clip looks juddery) are the three you will come back to the most.</p>
<p>Skim the whole deck before the chapter so you know what is coming, then keep it open in a second tab while you edit — every fact on it was checked against capcut.com, dji.com, support.apple.com and DaVinci Resolve's own keyframe/retime behavior, or measured directly with ffmpeg on this machine, not guessed from memory.</p></div>
<div class="ml-vi"><h2>📑 Chương 17 trong 16 slide</h2>
<p>Chương 12–14 đưa bạn tới mức "tôi cắt được một video xem được". Bộ slide này là cầu nối tới "tôi làm cho nó trông như dân chuyên nghiệp dựng": slide 3 (quay ĐỂ chuyển cảnh thay vì hy vọng hậu kỳ cứu), slide 7 (khác biệt CHÍNH XÁC giữa chuyển động tuyến tính và easing, vẽ thành đồ thị), và slide 12 (số đo ffmpeg thật chứng minh vì sao kéo dài một clip quay thường lại giật) là ba slide bạn sẽ quay lại nhiều nhất.</p>
<p>Lướt cả bộ trước khi học chương để biết sắp học gì, rồi mở sẵn ở tab thứ hai trong lúc dựng — mọi con số trên đó đã kiểm qua capcut.com, dji.com, support.apple.com và hành vi keyframe/retime thật của DaVinci Resolve, hoặc đo trực tiếp bằng ffmpeg trên máy này, không phải nhớ đại.</p></div>
${gallery('cr-17', SLIDES)}
`,
    },

    /* ─────────────────── 17.1 Chuyển cảnh chuyên nghiệp & quay để chuyển cảnh ─────────────────── */
    {
      title: '17.1 — Professional transitions & shooting to cut|||17.1 — Chuyển cảnh chuyên nghiệp & quay để dựng',
      slug: 'cr-17-1-chuyen-canh-chuyen-nghiep',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Sáu kiểu chuyển cảnh thật sự dùng được, cách đặt độ dài/vị trí trong CapCut và Resolve, và kỹ thuật QUAY để hai shot ghép được — không phải "để hậu kỳ lo".',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 17 · Lesson 17.1</span>
<h2>A transition is a decision you make with the camera, not just in the timeline</h2>
<p class="lead">Lesson 14.2 already told you the default is a hard cut, full stop — that has not changed. What changes here is what to do on the handful of moments a hard cut genuinely is not enough: a real jump in time, a change of location, a beat that needs energy. This lesson gives you six transitions that actually hold up, how to set them correctly in CapCut and Resolve, and the one habit almost nobody teaches — shooting the two shots so the transition is nearly free to cut, instead of praying an effect will paper over a mismatch.</p>

<h3>Hard cut is still the default — a transition has to earn its place</h3>
<p>Everything Lesson 14.2 said about hard cuts still applies: it is the cut behind the vast majority of any good video's runtime. A transition is not decoration you add because the software has a library of them — it exists to communicate something specific. A <strong>dissolve / dip to black</strong> (already named in Lesson 12.3 and 14.2) says "time or place just made a real jump" — a day ending, a chapter of the video closing. Use one where nothing actually changed and the audience reads a gap that was not there.</p>

<h3>Six transitions worth actually knowing</h3>
${slide('cr-17', 5, 'Sáu kiểu chuyển cảnh THẬT SỰ dùng được')}
<p>Beyond dissolve, five more show up constantly in real edits — and each one has a specific job, not a generic "looks cool" reason:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Whip pan</span><span class="v">A fast pan blurs the frame at the end of shot A and the start of shot B — cut on the blur and the eye reads one continuous, fast move.</span></div>
  <div class="kv"><span class="k">Match / shape transition</span><span class="v">The shape or motion at the end of A lines up with the shape/motion at the start of B — close cousin of the match cut from Lesson 14.2, just executed as a transition rather than a straight cut.</span></div>
  <div class="kv"><span class="k">Transition through an obstruction</span><span class="v">Something passes in front of the lens and fills the frame — a hand, a wall, a passing object — masked to the actual shape of whatever is blocking it, not a generic wipe shape.</span></div>
  <div class="kv"><span class="k">Push / zoom</span><span class="v">A continuous push-in or zoom bridges two different shot sizes of the same subject.</span></div>
  <div class="kv"><span class="k">Light leak / film burn</span><span class="v">A streak of light or warm flare sweeps across the frame — a nostalgic, stylized feel. Use it once per video at most; it reads as a gimmick fast.</span></div>
</div>
<p>CapCut's own guide to camera transitions puts the whip pan and match cut test in one sentence worth memorizing: <em>"Believability comes from matched direction, matched speed expectation, and a clear reason the viewer accepts the motion as one continuous move."</em> That single sentence is really the whole chapter distilled — the software's transition library only ever finishes what the camera already started.</p>

<h3>Shoot FOR the transition — the habit that makes all six easy</h3>
${slide('cr-17', 3, 'Quay ĐỂ dựng chuyển cảnh — mini shot list whip pan / vật cản')}
<p>This is the part most beginners skip, and it is why their whip pans and obstruction transitions look stiff no matter which effect they drop on the cut. The fix happens on set, not in the timeline. A minimal shot list for a whip-pan or obstruction transition looks like this:</p>
<ol>
<li><strong>Shot A</strong> — start normally, then pan (or push) in one direction, accelerating, until the frame is a blur or fully blocked. Keep the camera rolling a beat after the blur/block, do not cut early.</li>
<li><strong>Shot B</strong> — start ALREADY blurred/blocked (same obstruction, same blur direction), then resolve out of it continuing the SAME direction and a matching speed.</li>
</ol>
<p>Two things make or break this: <strong>matched direction</strong> (both pans go the same way across the cut) and <strong>matched speed</strong> — cut a slow pan into a fast one and the eye catches the seam instantly, no matter how good the transition effect is. For an obstruction transition specifically, mask the effect to the real shape of whatever passed the lens — a hand-shaped mask for a hand, not a generic circle wipe — which is exactly what a real hand or object covering the lens gives you for free.</p>
<div class="callout ok"><p><strong>Motion blur is doing real work here.</strong> Chapter 5's 180° shutter rule (shutter ≈ double your fps) gives natural-looking blur for normal motion — for a whip pan you often want <em>more</em> blur than that on purpose, which Chapter 5 already flagged as a legitimate rule-break. Whatever shutter speed you choose, keep it identical across both shots in the pair, or the blur character will not match at the cut.</p></div>

<h3>Setting the transition in CapCut and Resolve</h3>
${slide('cr-17', 4, 'Đặt chuyển cảnh: độ dài & vị trí so với điểm cắt')}
<p>Once the footage is shot to match, placing the effect is mechanical. In <strong>DaVinci Resolve</strong>, drag a transition from <strong>Effects Library → Video Transitions</strong> straight onto the cut point on the Edit page (Lesson 13.2 already showed you this library for titles and Text+); it lands centered on the cut by default, and you can drag either edge on the timeline — or open the Inspector for an exact duration — to bias it toward clip A or clip B instead. In <strong>CapCut</strong>, per capcut.com's own help center, the two clips must sit with <strong>no gap</strong> between them; on desktop, open the <strong>Transitions</strong> tab at the top, drag an effect onto the cut point, then adjust the duration directly on the timeline (mobile uses a duration slider instead).</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — using a loud transition to cover a cut that simply is not shot to match.</strong> If a whip pan still looks like two unrelated clips no matter how long you stretch the blur, the fix is not a bigger blur or a fancier effect — it is going back and shooting the pair correctly (or picking a different transition, like a plain dissolve, that does not depend on matched motion). An effect papering over a mismatch always looks like an effect papering over a mismatch.</p></div>

<h3>One signature transition per video, not a different one every cut</h3>
${slide('cr-17', 6, 'Chuyển cảnh có lý do, hay chỉ vì "nhìn cho vui"?')}
<p>The fastest way to make an edit look amateur — Lesson 12.3 already said this about effects and filters in general — is stacking a different flashy transition preset on every cut. Pick at most one "signature" transition style for a given video (say, one whip-pan technique for a fast-paced vlog) and use it consistently, on top of hard cuts everywhere else. A video that dissolves, wipes, zooms, and light-leaks its way through ten different cuts reads as someone who just discovered the effects library, not someone making a deliberate choice.</p>
<p class="note-ct"><strong>Next:</strong> Lesson 17.2 zooms into a single keyframe — the difference between linear motion and easing, and why "slow in, slow out" is the one animation principle worth knowing even if you never touch a full animation program.</p>

<h3>🎬 Practice (20–30 minutes)</h3>
<div class="callout ok"><ol>
<li>Shoot one whip-pan pair following the mini shot list above: shot A pans to a blur/block, shot B starts blocked and resolves out, same direction, same speed.</li>
<li>Cut them together with a real transition (not a hard cut) in CapCut or Resolve, and adjust its duration so it feels intentional, not stretched.</li>
<li>Pick one other transition from the six on slide 5 and use it exactly once elsewhere in the same footage, for a moment that actually needs it (a real jump in time or place).</li>
<li>Watch the result end to end and count how many DIFFERENT transition styles you used — it should be exactly one "signature" style plus hard cuts.</li>
</ol><p><strong>Done when:</strong> you can point at the whip-pan cut and name specifically what you shot to make it work (matched direction, matched speed, held blur), and the rest of the edit is still hard cuts.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Whip pan</span><span class="v">A fast camera pan that blurs the frame, used to bridge two shots as if it were one continuous move.</span></div>
  <div class="kv"><span class="k">Match / shape transition</span><span class="v">A transition where the shape or motion at the end of one shot lines up with the start of the next.</span></div>
  <div class="kv"><span class="k">Transition through an obstruction</span><span class="v">An object passing the lens fills the frame, masked to its real shape, bridging two shots.</span></div>
  <div class="kv"><span class="k">Light leak / film burn</span><span class="v">A streak of light or warm flare sweeping across the frame — a stylized, nostalgic transition, used sparingly.</span></div>
  <div class="kv"><span class="k">Signature transition</span><span class="v">The one transition style a video uses consistently, instead of a different preset on every cut.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Hard cut is still the default (Lesson 14.2) — a transition exists to signal a real jump in time or place, not to decorate an ordinary cut.</li>
<li>Six transitions actually hold up: dissolve/dip to black, whip pan, match/shape, through an obstruction, push/zoom, light leak — each with one specific job.</li>
<li>Shoot FOR the transition: matched direction and matched speed across the pair of shots is what makes a whip pan or obstruction cut nearly free to edit.</li>
<li>CapCut needs the two clips touching with no gap (Transitions tab, drag onto the cut); Resolve drags a transition from Effects Library → Video Transitions onto the cut point, centered by default.</li>
<li>One signature transition style per video, used consistently — not a different preset on every single cut.</li>
</ul>
<div class="link-card"><a href="https://www.capcut.com/resource/ai-camera-transitions-whip-pan-match-cut" target="_blank" rel="noopener">CapCut — what makes a whip pan or match cut believable</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 17 · Bài 17.1</span>
<h2>Chuyển cảnh là một quyết định bạn đưa ra BẰNG máy quay, không chỉ trong timeline</h2>
<p class="lead">Bài 14.2 đã nói mặc định là hard cut, chấm hết — điều đó không đổi. Cái thay đổi ở đây là làm gì với số ít khoảnh khắc mà hard cut thật sự không đủ: một cú nhảy thời gian thật, đổi địa điểm, một nhịp cần thêm năng lượng. Bài này cho bạn sáu kiểu chuyển cảnh thật sự đứng vững, cách đặt đúng trong CapCut và Resolve, và một thói quen gần như không ai dạy — quay hai shot sao cho chuyển cảnh gần như MIỄN PHÍ để ghép, thay vì cầu mong một hiệu ứng che được chỗ lệch.</p>

<h3>Hard cut vẫn là mặc định — chuyển cảnh phải CÓ LÝ DO mới được dùng</h3>
<p>Mọi điều Bài 14.2 nói về hard cut vẫn đúng: nó đứng sau phần lớn thời lượng của bất kỳ video hay nào. Chuyển cảnh không phải trang trí thêm vào vì phần mềm có sẵn thư viện — nó tồn tại để truyền đạt một điều cụ thể. <strong>Dissolve / dip to black</strong> (đã gọi tên ở Bài 12.3 và 14.2) báo hiệu "thời gian hoặc địa điểm vừa nhảy thật sự" — một ngày kết thúc, một chương của video khép lại. Dùng nó ở chỗ chẳng có gì thật sự thay đổi thì khán giả sẽ hiểu nhầm có một khoảng trống không tồn tại.</p>

<h3>Sáu kiểu chuyển cảnh đáng biết thật sự</h3>
${slide('cr-17', 5, 'Sáu kiểu chuyển cảnh THẬT SỰ dùng được')}
<p>Ngoài dissolve, năm kiểu khác xuất hiện liên tục trong các bản dựng thật — mỗi kiểu có đúng một việc, không phải lý do chung chung "nhìn ngầu":</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Whip pan</span><span class="v">Lia máy nhanh làm nhoè khung hình ở cuối shot A và đầu shot B — cắt đúng chỗ nhoè, mắt đọc thành một chuyển động liên tục, nhanh.</span></div>
  <div class="kv"><span class="k">Match / shape transition</span><span class="v">Hình dạng hoặc chuyển động ở cuối A khớp với hình dạng/chuyển động ở đầu B — họ hàng gần của match cut ở Bài 14.2, chỉ khác là thực hiện dưới dạng chuyển cảnh thay vì cắt thẳng.</span></div>
  <div class="kv"><span class="k">Chuyển cảnh qua vật cản</span><span class="v">Một vật đi ngang ống kính che kín khung hình — tay, tường, vật đang đi qua — mask theo ĐÚNG hình dạng thật của vật đang che, không phải hình wipe có sẵn.</span></div>
  <div class="kv"><span class="k">Push / zoom</span><span class="v">Đẩy máy hoặc zoom liên tục nối hai cỡ cảnh khác nhau của CÙNG một chủ thể.</span></div>
  <div class="kv"><span class="k">Light leak / film burn</span><span class="v">Vệt sáng hoặc flare ấm quét qua khung hình — cảm giác hoài cổ, có phong cách riêng. Dùng tối đa một lần mỗi video; dùng nhiều lộ ngay là chiêu trò.</span></div>
</div>
<p>Hướng dẫn chính thức của CapCut về chuyển cảnh máy quay gói gọn phép thử cho whip pan và match cut trong đúng một câu đáng nhớ: <em>"Độ tin cậy đến từ hướng khớp nhau, tốc độ khớp kỳ vọng, và một lý do rõ ràng để người xem tin đó là MỘT chuyển động liên tục."</em> Một câu đó thật ra tóm gọn cả bài học — thư viện chuyển cảnh của phần mềm chỉ bao giờ HOÀN THIỆN thứ máy quay đã bắt đầu.</p>

<h3>Quay ĐỂ chuyển cảnh — thói quen làm cả sáu kiểu trên dễ dàng</h3>
${slide('cr-17', 3, 'Quay ĐỂ dựng chuyển cảnh — mini shot list whip pan / vật cản')}
<p>Đây là phần phần lớn người mới bỏ qua, và là lý do whip pan hay chuyển cảnh qua vật cản của họ luôn trông cứng đờ dù dùng hiệu ứng nào. Cách sửa nằm ở hiện trường, không phải trong timeline. Một shot list tối giản cho whip pan hoặc chuyển cảnh qua vật cản trông như sau:</p>
<ol>
<li><strong>Shot A</strong> — bắt đầu bình thường, rồi lia (hoặc đẩy máy) về một hướng, tăng tốc dần, tới khi khung hình nhoè hết hoặc bị che kín. Giữ máy quay thêm một nhịp sau khi đã nhoè/che, đừng cắt sớm.</li>
<li><strong>Shot B</strong> — bắt đầu đã SẴN nhoè/che (cùng vật cản, cùng hướng nhoè), rồi "thoát ra" khỏi đó, tiếp tục CÙNG hướng và tốc độ khớp.</li>
</ol>
<p>Hai thứ quyết định thành bại: <strong>khớp hướng</strong> (cả hai cú lia cùng đi một hướng qua điểm cắt) và <strong>khớp tốc độ</strong> — cắt một cú lia chậm vào một cú lia nhanh, mắt bắt được chỗ nối ngay lập tức, dù hiệu ứng chuyển cảnh có tốt tới đâu. Riêng chuyển cảnh qua vật cản, mask hiệu ứng theo ĐÚNG hình dạng thật của vật vừa đi qua ống kính — mask hình bàn tay cho một bàn tay, không phải một hình tròn wipe chung chung — và đó chính xác là thứ một bàn tay hay vật thật che ống kính cho bạn miễn phí.</p>
<div class="callout ok"><p><strong>Nhoè chuyển động đang làm việc thật ở đây.</strong> Quy tắc 180° của Chương 5 (màn trập ≈ gấp đôi fps) cho độ nhoè trông tự nhiên với chuyển động bình thường — với whip pan, bạn thường CỐ TÌNH muốn nhoè NHIỀU hơn thế, điều Chương 5 đã nói là một cách phá lệ hợp lệ. Dù chọn tốc độ màn trập nào, giữ NGUYÊN nó ở cả hai shot trong cặp, không thì tính chất nhoè sẽ không khớp tại điểm cắt.</p></div>

<h3>Đặt chuyển cảnh trong CapCut và Resolve</h3>
${slide('cr-17', 4, 'Đặt chuyển cảnh: độ dài & vị trí so với điểm cắt')}
<p>Một khi cảnh quay đã khớp nhau, đặt hiệu ứng chỉ còn là thao tác cơ học. Trong <strong>DaVinci Resolve</strong>, kéo một chuyển cảnh từ <strong>Effects Library → Video Transitions</strong> thẳng vào điểm cắt trên trang Edit (Bài 13.2 đã cho bạn thấy thư viện này khi làm tiêu đề, Text+); nó nằm CĂN GIỮA điểm cắt theo mặc định, và bạn kéo được mép nào đó trên timeline — hoặc mở Inspector để nhập đúng thời lượng — để lệch về phía clip A hoặc B. Trong <strong>CapCut</strong>, theo đúng trung tâm trợ giúp capcut.com, hai clip phải NẰM SÁT NHAU, không khoảng trống; trên máy tính, mở tab <strong>Transitions</strong> ở trên, kéo một hiệu ứng vào điểm cắt, rồi chỉnh thời lượng ngay trên timeline (bản di động dùng thanh trượt thời lượng thay vì kéo).</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — dùng chuyển cảnh loè loẹt để che một cú cắt vốn không được quay để khớp.</strong> Nếu một whip pan vẫn trông như hai clip chẳng liên quan dù bạn kéo dài độ nhoè tới đâu, cách sửa không phải là nhoè to hơn hay hiệu ứng cầu kỳ hơn — mà là quay lại đúng cặp shot đó (hoặc chọn một chuyển cảnh khác, như dissolve trơn, không phụ thuộc vào chuyển động khớp nhau). Một hiệu ứng che một chỗ lệch luôn trông như một hiệu ứng đang che một chỗ lệch.</p></div>

<h3>Một kiểu chuyển cảnh "chữ ký" mỗi video, không phải mỗi cắt một kiểu</h3>
${slide('cr-17', 6, 'Chuyển cảnh có lý do, hay chỉ vì "nhìn cho vui"?')}
<p>Cách nhanh nhất khiến một bản dựng trông nghiệp dư — Bài 12.3 đã nói điều này về hiệu ứng/filter nói chung — là chồng một preset chuyển cảnh loè loẹt khác nhau ở mỗi lần cắt. Chọn tối đa MỘT kiểu chuyển cảnh "chữ ký" cho một video (ví dụ: một kỹ thuật whip pan riêng cho một vlog nhịp nhanh) và dùng nhất quán, phủ lên trên nền hard cut ở mọi chỗ khác. Một video dissolve, wipe, zoom, rồi light leak qua mười lần cắt khác nhau đọc ra như người vừa mới khám phá thư viện hiệu ứng, không phải người đang đưa ra lựa chọn có chủ đích.</p>
<p class="note-ct"><strong>Nối với bài sau:</strong> Bài 17.2 phóng to vào đúng MỘT keyframe — khác biệt giữa chuyển động tuyến tính và easing, và vì sao "slow in, slow out" là nguyên lý hoạt hình đáng biết nhất dù bạn không bao giờ đụng tới một phần mềm hoạt hình đầy đủ.</p>

<h3>🎬 Thực hành (20–30 phút)</h3>
<div class="callout ok"><ol>
<li>Quay một cặp whip pan theo mini shot list ở trên: shot A lia tới nhoè/che, shot B bắt đầu đã che và thoát ra, cùng hướng, cùng tốc độ.</li>
<li>Ghép chúng bằng một chuyển cảnh thật (không phải hard cut) trong CapCut hoặc Resolve, chỉnh thời lượng cho tới khi thấy có chủ đích, không phải kéo dài gượng ép.</li>
<li>Chọn thêm một kiểu chuyển cảnh khác trong sáu kiểu ở slide 5, dùng đúng một lần ở chỗ khác trong cùng cảnh quay, cho một khoảnh khắc thật sự cần nó (nhảy thời gian/địa điểm thật).</li>
<li>Xem lại kết quả từ đầu tới cuối và đếm xem đã dùng bao nhiêu kiểu chuyển cảnh KHÁC NHAU — phải đúng một kiểu "chữ ký" cộng với hard cut.</li>
</ol><p><strong>Đạt khi:</strong> bạn chỉ ra được chính xác đã quay gì để cú whip pan hoạt động (khớp hướng, khớp tốc độ, giữ nhoè đủ lâu), và phần còn lại của bản dựng vẫn là hard cut.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Whip pan</span><span class="v">Lia máy nhanh làm nhoè khung hình, dùng để nối hai shot như thể một chuyển động liên tục.</span></div>
  <div class="kv"><span class="k">Match / shape transition</span><span class="v">Chuyển cảnh mà hình dạng hoặc chuyển động ở cuối shot này khớp với đầu shot kế tiếp.</span></div>
  <div class="kv"><span class="k">Chuyển cảnh qua vật cản</span><span class="v">Một vật đi ngang ống kính che kín khung hình, mask theo đúng hình dạng thật của nó, nối hai shot.</span></div>
  <div class="kv"><span class="k">Light leak / film burn</span><span class="v">Vệt sáng hoặc flare ấm quét qua khung hình — chuyển cảnh có phong cách, hoài cổ, dùng tiết chế.</span></div>
  <div class="kv"><span class="k">Chuyển cảnh chữ ký</span><span class="v">Kiểu chuyển cảnh duy nhất một video dùng nhất quán, thay vì mỗi cắt một preset khác nhau.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Hard cut vẫn là mặc định (Bài 14.2) — chuyển cảnh tồn tại để báo hiệu một cú nhảy thời gian/địa điểm thật sự, không phải để trang trí một cú cắt bình thường.</li>
<li>Sáu chuyển cảnh thật sự đứng vững: dissolve/dip to black, whip pan, match/shape, qua vật cản, push/zoom, light leak — mỗi kiểu đúng một việc.</li>
<li>Quay ĐỂ chuyển cảnh: khớp hướng và khớp tốc độ giữa cặp shot là thứ làm một whip pan hay chuyển cảnh qua vật cản gần như miễn phí để ghép.</li>
<li>CapCut cần hai clip sát nhau không khoảng trống (tab Transitions, kéo vào điểm cắt); Resolve kéo chuyển cảnh từ Effects Library → Video Transitions vào điểm cắt, mặc định căn giữa.</li>
<li>Một kiểu chuyển cảnh "chữ ký" mỗi video, dùng nhất quán — không phải mỗi lần cắt một preset khác nhau.</li>
</ul>
<div class="link-card"><a href="https://www.capcut.com/resource/ai-camera-transitions-whip-pan-match-cut" target="_blank" rel="noopener">CapCut — điều gì làm một whip pan hoặc match cut đáng tin</a></div>
</div>
`,
    },

    /* ─────────────────── 17.2 Keyframe & easing ─────────────────── */
    {
      title: '17.2 — Keyframes & easing|||17.2 — Keyframe & easing',
      slug: 'cr-17-2-keyframe-easing',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Keyframe là gì, nội suy tuyến tính vs easing, đồ thị tốc độ, nơi bấm trong CapCut/Resolve, và 5 ứng dụng thật: punch-in mượt, Ken Burns, lower third, mũi tên khoanh code, zoom theo con trỏ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 17 · Lesson 17.2</span>
<h2>A keyframe is one number at one moment — everything else is what happens BETWEEN two of them</h2>
<p class="lead">Lesson 12.2 already had you set two keyframes for a punch-in and trust CapCut to "ease between them automatically." This lesson opens that black box: what a keyframe actually stores, the real difference between linear motion and easing, and where to change it on purpose in both CapCut and Resolve — plus five places this shows up in your actual editing, beyond the punch-in you already know.</p>

<h3>What a keyframe actually is</h3>
<p>A <strong>keyframe</strong> is a stored value of one property — position, scale, rotation, opacity, crop — at one specific point in time. Two keyframes on the same property define a change: value A at time 1, value B at time 2. Everything the software shows you moving between those two points is <strong>interpolation</strong> — the software calculating in-between values so the change looks continuous instead of a single jump cut in the property itself.</p>

<h3>Linear interpolation vs easing — the same two keyframes, a different feel</h3>
${slide('cr-17', 7, 'Keyframe: nội suy tuyến tính vs easing')}
<p>With <strong>linear</strong> interpolation, the value changes at a perfectly constant rate — equal steps in equal time. Both CapCut and Resolve default to linear the moment you set a second keyframe, which is exactly why an un-tweaked punch-in can feel slightly mechanical. <strong>Easing</strong> changes the RATE, not the endpoints: an "ease in/out" curve starts slow, speeds up through the middle, and slows again before it lands — read the graph above closely and notice the nine dots, placed at perfectly equal time steps in both panels. On the linear curve they sit evenly spaced. On the eased curve they bunch up near the start and end and spread out in the middle — which is exactly what "slow in, slow out" means in the language of frame-by-frame animation: <strong>more of the actual drawings (or frames) cluster where the motion is slow</strong>. This is one of the twelve classic principles of animation (Thomas &amp; Johnston, <em>The Illusion of Life</em>, 1981) — and it is the single one worth internalizing even if you never touch a full animation tool: eased motion reads as physical, weighted, intentional; linear motion reads as a slide moving on a projector.</p>
<div class="callout warn"><p><strong>Two more animation principles, used lightly on text/graphics:</strong> <strong>anticipation</strong> (a tiny pull-back before the main move — a title that nudges slightly left before sliding right) and <strong>overshoot</strong> (going slightly past the final position, then settling back) both read as "alive" — but apply them with a light hand on a lower third or callout, or the motion starts calling attention to itself instead of the content it is introducing.</p></div>

<h3>Where to change it — CapCut and Resolve, checked as of 09/2026</h3>
${slide('cr-17', 8, 'Bảng tra: điều khiển keyframe ở đâu')}
<p>In <strong>DaVinci Resolve</strong>, right-click the orange keyframe diamond in the Inspector and you get <strong>Linear / Ease In / Ease Out / Ease In and Out</strong> (plus step/hold variants for motion that should jump rather than glide) — pull up the <strong>Keyframe / Curve Editor</strong> from the bottom edge of the timeline to see and drag the actual curve, the same graph shape as the two panels above. In <strong>CapCut</strong>, per CapCut's own official keyframe guide, the diamond-icon keyframes support <strong>Ease In and Ease Out</strong> options directly — exact menu wording can shift between app versions, so confirm the label in the version you are running before you teach someone else where to click. Multi-point speed changes across a whole clip (rather than one property's easing) are a related but separate tool — Resolve's Retime Curve and CapCut's Speed → Curve — covered in full in Lesson 17.3.</p>
<div class="callout ok"><p><strong>Motion blur belongs here too.</strong> A keyframed move — especially a fast one — looks more natural with a touch of motion blur matched to it, the same physical logic as Chapter 5's 180° shutter rule. Check whether your version has a per-clip motion blur toggle; it is not universal across every app version.</p></div>

<h3>Five real uses, beyond the punch-in you already know</h3>
${slide('cr-17', 9, 'Keyframe dùng vào việc gì — 5 ứng dụng thật')}
<p>Lesson 12.2 covered the punch-in with two flat keyframes. Add easing and five more everyday uses open up:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Smoother punch-in</span><span class="v">The same two keyframes from Lesson 12.2, now with Ease In/Out — the zoom starts and lands without the slight "snap" a linear punch-in has.</span></div>
  <div class="kv"><span class="k">Ken Burns on a screenshot</span><span class="v">A slow, eased pan-and-zoom across a static image (an error message, a diagram) keeps it visually alive on the timeline instead of sitting frozen.</span></div>
  <div class="kv"><span class="k">A lower third that slides in</span><span class="v">Keyframe Position from off-frame to its resting spot, ease out as it arrives — it settles instead of slamming into place.</span></div>
  <div class="kv"><span class="k">An arrow or box highlighting code</span><span class="v">Keyframe Opacity + Scale so the callout appears exactly as you start talking about that line, not a beat before or after.</span></div>
  <div class="kv"><span class="k">Cursor-following zoom in screen recordings</span><span class="v">Connects to Chapter 22 — keyframe Scale/Position to track where the cursor is actually doing something on screen.</span></div>
</div>
<div class="callout warn"><p><strong>Still the advice from Lesson 12.2:</strong> two keyframes is enough for one emphasis. Animating every single element on screen turns a technique meant to add focus into visual noise that tires the eye.</p></div>
<p class="note-ct"><strong>Next:</strong> Lesson 17.3 takes speed itself as the thing being keyframed — real slow motion vs. a stretched clip that judders, multi-point speed ramps, and when to reach for frame interpolation.</p>

<h3>🎬 Practice (15–20 minutes)</h3>
<div class="callout ok"><ol>
<li>Take the punch-in you built in Chapter 12's practice and add Ease In and Ease Out to its two keyframes.</li>
<li>Build one new keyframed move from the five above — a Ken Burns pan on a screenshot, or a lower third that slides and eases to a stop.</li>
<li>Open the Keyframe/Curve Editor (Resolve) or the keyframe graph (CapCut) and actually look at the curve shape you just created — confirm it looks like the eased graph on slide 7, not the linear one.</li>
</ol><p><strong>Done when:</strong> you can point at a moving element on your timeline and say, out loud, whether it is linear or eased, and why you chose that for THIS specific move.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Keyframe</span><span class="v">A stored value of one property at one point in time.</span></div>
  <div class="kv"><span class="k">Interpolation</span><span class="v">How the software fills in values between two keyframes — linear (constant rate) or eased (variable rate).</span></div>
  <div class="kv"><span class="k">Ease in / ease out</span><span class="v">A curve that starts or ends a move slowly instead of at a constant speed — "slow in, slow out" from classic animation.</span></div>
  <div class="kv"><span class="k">Anticipation, overshoot</span><span class="v">Animation principles: a small pull-back before a move, and slightly overshooting the landing point before settling.</span></div>
  <div class="kv"><span class="k">Motion blur</span><span class="v">Blur matched to a keyframed move's speed, making it read as more physically real.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A keyframe stores one property's value at one moment; interpolation is what the software computes between two of them.</li>
<li>Linear = constant rate, equally spaced frames. Easing = variable rate, frames bunch near the start/end — "slow in, slow out," one of animation's twelve classic principles.</li>
<li>Resolve: right-click the keyframe diamond in Inspector → Linear/Ease In/Ease Out/Ease In and Out. CapCut: Ease In/Ease Out on a keyframe (per capcut.com — confirm the exact label in your version).</li>
<li>Five everyday uses beyond the basic punch-in: smoother punch-in, Ken Burns on screenshots, sliding lower thirds, code callouts, cursor-following zoom in screen recordings.</li>
<li>Still two keyframes per emphasis — animating everything on screen turns focus into noise.</li>
</ul>
<div class="link-card"><a href="https://www.capcut.com/resource/how-to-add-keyframes-in-capcut" target="_blank" rel="noopener">CapCut — official guide to adding keyframes on desktop</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 17 · Bài 17.2</span>
<h2>Keyframe là MỘT con số tại MỘT thời điểm — mọi thứ còn lại là chuyện xảy ra GIỮA hai điểm đó</h2>
<p class="lead">Bài 12.2 đã cho bạn đặt hai keyframe cho một cú punch-in và tin CapCut "tự làm mượt giữa chúng". Bài này mở chiếc hộp đen đó ra: keyframe thật sự lưu gì, khác biệt thật giữa chuyển động tuyến tính và easing, và bấm ở đâu để đổi nó có chủ đích ở cả CapCut lẫn Resolve — cộng thêm năm chỗ kỹ thuật này xuất hiện trong việc dựng thật của bạn, ngoài cú punch-in bạn đã biết.</p>

<h3>Keyframe thật sự là gì</h3>
<p><strong>Keyframe</strong> là một giá trị được LƯU LẠI của một thuộc tính — vị trí, tỉ lệ, xoay, độ mờ, crop — tại đúng một thời điểm. Hai keyframe trên cùng thuộc tính định nghĩa một thay đổi: giá trị A tại thời điểm 1, giá trị B tại thời điểm 2. Mọi thứ phần mềm cho bạn thấy đang di chuyển giữa hai điểm đó là <strong>nội suy (interpolation)</strong> — phần mềm tự tính các giá trị ở giữa để thay đổi trông liên tục thay vì một cú nhảy đơn của chính thuộc tính đó.</p>

<h3>Nội suy tuyến tính vs easing — cùng hai keyframe, cảm giác khác hẳn</h3>
${slide('cr-17', 7, 'Keyframe: nội suy tuyến tính vs easing')}
<p>Với nội suy <strong>tuyến tính (linear)</strong>, giá trị đổi với TỐC ĐỘ ĐỀU tuyệt đối — bước bằng nhau trong thời gian bằng nhau. Cả CapCut lẫn Resolve đều mặc định tuyến tính ngay khi bạn đặt keyframe thứ hai, đó chính xác là lý do một punch-in chưa chỉnh có thể cảm giác hơi máy móc. <strong>Easing</strong> đổi TỐC ĐỘ, không đổi hai điểm đầu/cuối: một đường cong "ease in/out" bắt đầu chậm, tăng tốc ở giữa, rồi chậm lại trước khi dừng — nhìn kỹ đồ thị ở trên và để ý chín chấm, đặt CÁCH ĐỀU NHAU về thời gian ở cả hai bên. Trên đường tuyến tính chúng nằm đều nhau. Trên đường easing chúng DỒN lại gần đầu/cuối và GIÃN ra ở giữa — đó chính xác là ý nghĩa của "slow in, slow out" trong ngôn ngữ hoạt hình từng-khung-một: <strong>càng nhiều khung hình (hay tranh vẽ) thật dồn lại ở chỗ chuyển động chậm</strong>. Đây là một trong mười hai nguyên lý hoạt hình kinh điển (Thomas &amp; Johnston, <em>The Illusion of Life</em>, 1981) — và là nguyên lý đáng nhớ nhất dù bạn không bao giờ đụng một phần mềm hoạt hình đầy đủ: chuyển động easing đọc ra là có vật lý, có trọng lượng, có chủ đích; chuyển động tuyến tính đọc ra như một tấm ảnh trượt trên máy chiếu.</p>
<div class="callout warn"><p><strong>Hai nguyên lý hoạt hình khác, dùng NHẸ cho chữ/đồ hoạ:</strong> <strong>anticipation</strong> (một cú lùi nhỏ trước khi vào chuyển động chính — tiêu đề nhích nhẹ sang trái trước khi trượt sang phải) và <strong>overshoot</strong> (vượt nhẹ qua vị trí cuối rồi mới ổn định lại) đều đọc ra là "sống động" — nhưng áp dụng nhẹ tay lên một lower third hay một callout, không thì chuyển động bắt đầu tự thu hút sự chú ý thay vì làm nổi nội dung nó đang giới thiệu.</p></div>

<h3>Bấm ở đâu — CapCut và Resolve, kiểm 09/2026</h3>
${slide('cr-17', 8, 'Bảng tra: điều khiển keyframe ở đâu')}
<p>Trong <strong>DaVinci Resolve</strong>, chuột phải vào ô kim cương keyframe màu cam trong Inspector, bạn có <strong>Linear / Ease In / Ease Out / Ease In and Out</strong> (cộng thêm các biến thể step/hold cho chuyển động cần nhảy thay vì trượt) — kéo lên <strong>Keyframe / Curve Editor</strong> từ mép dưới timeline để thấy và kéo chính đường cong đó, đúng hình dạng đồ thị của hai panel ở trên. Trong <strong>CapCut</strong>, theo hướng dẫn keyframe chính thức của CapCut, các keyframe dạng kim cương hỗ trợ trực tiếp tuỳ chọn <strong>Ease In và Ease Out</strong> — chữ chính xác trên nút có thể đổi theo bản, luôn xác nhận nhãn trong bản bạn đang chạy trước khi dạy người khác bấm đâu. Đổi tốc độ nhiều điểm trên CẢ MỘT clip (khác với easing một thuộc tính) là công cụ họ hàng nhưng riêng biệt — Retime Curve của Resolve và Speed → Curve của CapCut — nói trọn vẹn ở Bài 17.3.</p>
<div class="callout ok"><p><strong>Motion blur cũng thuộc về đây.</strong> Một chuyển động bằng keyframe — nhất là chuyển động nhanh — trông tự nhiên hơn khi có chút nhoè khớp với nó, cùng logic vật lý với quy tắc màn trập 180° của Chương 5. Kiểm xem bản bạn đang dùng có nút bật motion blur riêng cho từng clip không; không phải bản nào cũng có.</p></div>

<h3>Năm ứng dụng thật, ngoài cú punch-in bạn đã biết</h3>
${slide('cr-17', 9, 'Keyframe dùng vào việc gì — 5 ứng dụng thật')}
<p>Bài 12.2 đã dạy punch-in với hai keyframe phẳng (linear). Thêm easing vào, năm ứng dụng hằng ngày khác mở ra:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Punch-in mượt hơn</span><span class="v">Vẫn hai keyframe của Bài 12.2, giờ thêm Ease In/Out — cú zoom bắt đầu và kết thúc không còn cái "khựng" nhẹ của punch-in tuyến tính.</span></div>
  <div class="kv"><span class="k">Ken Burns trên ảnh chụp màn hình</span><span class="v">Pan-và-zoom chậm rãi, có easing, trên một ảnh tĩnh (thông báo lỗi, sơ đồ) giữ nó "sống" trên timeline thay vì nằm im.</span></div>
  <div class="kv"><span class="k">Lower third trượt vào</span><span class="v">Keyframe Position từ ngoài khung tới vị trí dừng, ease out khi tới nơi — nó "lắng" xuống thay vì đập vào chỗ.</span></div>
  <div class="kv"><span class="k">Mũi tên hoặc khung khoanh code</span><span class="v">Keyframe Opacity + Scale để callout xuất hiện đúng lúc bạn bắt đầu nói về dòng đó, không sớm không muộn một nhịp.</span></div>
  <div class="kv"><span class="k">Zoom theo con trỏ khi quay màn hình</span><span class="v">Nối Chương 22 — keyframe Scale/Position bám theo đúng chỗ con trỏ đang thao tác trên màn hình.</span></div>
</div>
<div class="callout warn"><p><strong>Vẫn là lời khuyên của Bài 12.2:</strong> hai keyframe là đủ cho một cú nhấn. Animate mọi thứ trên màn hình biến một kỹ thuật vốn để tạo tiêu điểm thành nhiễu thị giác gây mỏi mắt.</p></div>
<p class="note-ct"><strong>Nối với bài sau:</strong> Bài 17.3 lấy chính TỐC ĐỘ làm thứ bị keyframe — slow motion thật vs clip kéo dài bị giật, speed ramp nhiều điểm, và khi nào cần tới nội suy khung.</p>

<h3>🎬 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Lấy cú punch-in bạn đã dựng ở phần thực hành Chương 12, thêm Ease In và Ease Out cho hai keyframe của nó.</li>
<li>Dựng một chuyển động keyframe mới trong năm ứng dụng ở trên — Ken Burns trên một ảnh chụp màn hình, hoặc lower third trượt và ease dừng lại.</li>
<li>Mở Keyframe/Curve Editor (Resolve) hoặc đồ thị keyframe (CapCut) và nhìn thật kỹ hình dạng đường cong bạn vừa tạo — xác nhận nó giống đồ thị easing ở slide 7, không phải đường tuyến tính.</li>
</ol><p><strong>Đạt khi:</strong> bạn chỉ được vào một phần tử đang chuyển động trên timeline và nói thành lời nó là tuyến tính hay easing, và VÌ SAO bạn chọn vậy cho ĐÚNG chuyển động này.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Keyframe</span><span class="v">Giá trị được lưu của một thuộc tính tại một thời điểm.</span></div>
  <div class="kv"><span class="k">Nội suy (interpolation)</span><span class="v">Cách phần mềm lấp giá trị giữa hai keyframe — tuyến tính (tốc độ đều) hoặc easing (tốc độ đổi).</span></div>
  <div class="kv"><span class="k">Ease in / ease out</span><span class="v">Đường cong bắt đầu hoặc kết thúc một chuyển động chậm thay vì tốc độ đều — "slow in, slow out" trong hoạt hình kinh điển.</span></div>
  <div class="kv"><span class="k">Anticipation, overshoot</span><span class="v">Nguyên lý hoạt hình: một cú lùi nhỏ trước chuyển động chính, và vượt nhẹ qua điểm dừng rồi mới ổn định.</span></div>
  <div class="kv"><span class="k">Motion blur</span><span class="v">Độ nhoè khớp với tốc độ một chuyển động keyframe, khiến nó đọc ra thật hơn về mặt vật lý.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Keyframe lưu giá trị một thuộc tính tại một thời điểm; nội suy là thứ phần mềm tính giữa hai điểm đó.</li>
<li>Tuyến tính = tốc độ đều, khung cách đều nhau. Easing = tốc độ đổi, khung dồn gần đầu/cuối — "slow in, slow out", một trong mười hai nguyên lý hoạt hình kinh điển.</li>
<li>Resolve: chuột phải ô kim cương trong Inspector → Linear/Ease In/Ease Out/Ease In and Out. CapCut: Ease In/Ease Out trên một keyframe (theo capcut.com — xác nhận đúng nhãn trong bản bạn dùng).</li>
<li>Năm ứng dụng hằng ngày ngoài punch-in cơ bản: punch-in mượt hơn, Ken Burns trên ảnh chụp màn hình, lower third trượt vào, callout khoanh code, zoom theo con trỏ khi quay màn hình.</li>
<li>Vẫn hai keyframe mỗi cú nhấn — animate mọi thứ trên màn hình biến tiêu điểm thành nhiễu.</li>
</ul>
<div class="link-card"><a href="https://www.capcut.com/resource/how-to-add-keyframes-in-capcut" target="_blank" rel="noopener">CapCut — hướng dẫn chính thức thêm keyframe trên máy tính</a></div>
</div>
`,
    },

    /* ─────────────────── 17.3 Tốc độ & thời gian ─────────────────── */
    {
      title: '17.3 — Speed & time: real slow motion, ramps, timelapse|||17.3 — Tốc độ & thời gian: slow motion đúng, speed ramp, timelapse',
      slug: 'cr-17-3-toc-do-thoi-gian',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Slow motion ĐÚNG (conform từ fps cao) vs làm chậm clip 25fps (giật) đo bằng ffmpeg thật, bảng fps quay → hệ số chậm, speed ramp, nội suy khung, freeze/reverse, và timelapse/hyperlapse/motionlapse.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 17 · Lesson 17.3</span>
<h2>Slow motion is arithmetic you already know — Chapter 5 just never told you where it breaks</h2>
<p class="lead">Chapter 5 already gave you the formula: slow-down factor = fps recorded ÷ fps of your timeline, and the 120fps → 25fps → 4.8× example. Lessons 12.2 and 13.2 already gave you the buttons: Speed, Curve, Reverse, Freeze, Retime Controls. This lesson closes the gap between "I know the formula" and "I know why stretching a normal clip looks awful" — with real numbers measured on this machine — then adds multi-point speed ramps, frame interpolation, and the three ways your Pocket 3 compresses time.</p>

<h3>Real slow motion vs. stretching a normal clip — proven with real numbers</h3>
${slide('cr-17', 12, 'Slow motion ĐÚNG vs làm chậm clip quay thường')}
<p>Here is the trap almost every beginner falls into: you have a clip shot at a normal 25fps, you slow it down 4× in the timeline, and it judders instead of gliding. The reason is exactly what the slide shows, measured directly with <code>ffmpeg</code>/<code>ffprobe</code> on generated test footage, not estimated: stretching a 25fps clip (75 frames across 3 seconds) by 4× with <code>setpts=4*PTS</code> produces 299 output frames over 11.96 seconds — but there were only ever 75 REAL frames to begin with. The software has no choice but to repeat each original frame roughly four times to fill the extra time, and repeated frames are exactly what judder looks like.</p>
<p>Compare that to footage actually <strong>shot</strong> at a high frame rate and <strong>conformed</strong> into a lower-fps timeline — no frames invented, none repeated, just a change in how fast the existing frames are told to play back. The same test, this time on a 100fps source (300 real frames across 3 seconds) read back at 25fps: exactly 300 real frames, now playing over 12.0 seconds — a clean 4× slowdown (100÷25, the identical formula from Chapter 5) with real motion in every single frame.</p>
<div class="callout ok"><p>These numbers come from running <code>ffmpeg -f lavfi -i testsrc2=...</code> test clips through both paths on this machine and reading the result with <code>ffprobe</code> — not an estimate. If you want to verify it yourself: generate a short high-fps clip, then compare <code>-r &lt;low fps&gt; -i clip.mp4</code> (reinterpreting existing frames — the "conform" path) against <code>setpts=N*PTS</code> on a normal-fps clip (the "stretch" path), and check <code>nb_frames</code> on each output.</p></div>

<h3>fps you record at → slow-down factor on this course's 25fps timeline</h3>
${slide('cr-17', 11, 'fps lúc quay → hệ số chậm trên timeline 25fps')}
<p>The formula from Chapter 5 does not change — it just gets a full table now, tied to what your actual gear can record. Both Pocket 3 and iPhone 16 Pro Max top out at 120fps for 4K-class footage and only reach their maximum 240fps at 1080p (dji.com/osmo-pocket-3/specs and support.apple.com/en-us/121032, checked 09/2026) — which is why the 4.8× row (120fps ÷ 25fps) matches the exact example Chapter 5 already used.</p>

<h3>Speed ramps — multiple speed changes inside one clip</h3>
${slide('cr-17', 10, 'Speed ramp — đường cong tốc độ theo thời gian')}
<p>Lesson 13.2 already showed Retime Controls for a single, flat speed change. A <strong>speed ramp</strong> is the same idea with several points on one clip: normal speed, dip into slow motion for the moment that matters, back to normal — the curve on the slide is exactly that shape. In <strong>Resolve</strong>, open Retime Controls, then pull up the <strong>Retime Curve</strong> on the timeline and Ctrl/Cmd-click to add points, dragging each one's percentage. In <strong>CapCut</strong>, open <strong>Speed → Curve</strong> on a clip: per capcut.com/tools/speed-ramp, presets named <strong>Montage, Bullet, Jump Cut, and Hero</strong> are available out of the box, or drag points by hand — use <strong>Add Point</strong> for a fully custom curve like the one on the slide.</p>

<h3>Frame interpolation — when you actually need new frames, not repeated ones</h3>
<p>Sometimes 25fps footage is all you have and you still need it slower. The honest options generate NEW estimated frames instead of repeating old ones. In <strong>Resolve</strong>, Retime Controls' <strong>Retime Process</strong> includes <strong>Optical Flow</strong>, with Motion Estimation quality levels (Standard and Enhanced, each with Faster/Better) — and <strong>Speed Warp</strong>, which uses the DaVinci Neural Engine for higher-quality results and is <strong>Studio-only</strong>, not available in the free version. The same <code>ffmpeg</code> test from earlier makes the difference concrete: running <code>minterpolate</code> (motion-compensated frame interpolation) on the same stretched 25fps source produced 293 frames over 11.72 seconds — genuinely NEW, estimated frames rather than 299 duplicated ones, though motion estimation can still misread fast or complex motion and introduce its own artifacts. In CapCut, no dedicated frame-interpolation control has been confirmed for this course — check your installed version directly rather than assuming a button exists.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — trusting Speed Warp is available because a tutorial says so.</strong> A huge share of online tutorials assume Studio. If you are on the free version and your slow motion still looks like duplicated frames after selecting Optical Flow, check the Motion Estimation dropdown for which level is actually active — Speed Warp itself will be grayed out or watermark the render on Free.</p></div>

<h3>Freeze frame and reverse — used with intent</h3>
<p>Lessons 12.2 and 13.2 already gave you the buttons (CapCut: Speed → Freeze / Reverse; Resolve: right-click a clip → Freeze Frame / Reverse Clip). The judgment call here: a <strong>freeze frame</strong> works to land a comedic beat or hold on something the viewer needs an extra second to read; <strong>reverse</strong> works when the backward motion itself is the point (undoing an action, a stylized effect) — neither should be a fix for footage that is simply too short, which just reads as a stretched, obviously-looped clip.</p>

<h3>Compressing time on purpose: timelapse, hyperlapse, motionlapse</h3>
${slide('cr-17', 13, 'Nén thời gian: timelapse, hyperlapse, motionlapse')}
<p>Your Pocket 3 has three distinct modes for this, confirmed on dji.com/osmo-pocket-3/faq (checked 09/2026): <strong>Timelapse</strong> — camera stays still, shoots at a set interval, letting you configure resolution, frame rate, interval, and duration. <strong>Hyperlapse</strong> — you move while shooting and the gimbal stabilizes it, with resolution, frame rate, and speed configurable. <strong>Motionlapse</strong> — like Timelapse, but the camera itself moves through waypoints you set in advance, adding interval and duration on top. Your iPhone's built-in Camera app has its own <strong>Time-lapse</strong> mode, which auto-adjusts its capture interval based on how long you record. For montage cutting to music, Lesson 12.3's beat-marking (⌘J on a music clip in CapCut) is the same tool for placing cuts exactly on the beat as for ducking — marker placement first, cutting second.</p>
<p class="note-ct"><strong>Next:</strong> Lesson 17.4 zooms back out to the system around all of this — one effects layer covering many clips, saved presets, and keeping a heavy timeline playable while you work.</p>

<h3>🎬 Practice (20–30 minutes)</h3>
<div class="callout ok"><ol>
<li>Shoot 3 seconds of the same motion at your camera's highest available fps, then conform it into your 25fps timeline — no setpts stretching, no duplicated frames.</li>
<li>Build one speed ramp on a normal clip: full speed → a dip into slow motion at one specific moment → back to full speed.</li>
<li>Shoot one timelapse or hyperlapse clip using your Pocket 3 (or iPhone Time-lapse) and note which parameters you configured.</li>
</ol><p><strong>Done when:</strong> you can state, from memory, the slow-down factor for the fps you shot at (fps recorded ÷ your timeline's fps), and your slow-motion clip plays smoothly at full screen — no visible judder.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Conform</span><span class="v">Playing high-fps footage back at a lower timeline fps with no frames added or repeated — real slow motion.</span></div>
  <div class="kv"><span class="k">Speed ramp</span><span class="v">Multiple speed changes within one clip, plotted as a curve over time.</span></div>
  <div class="kv"><span class="k">Frame interpolation</span><span class="v">Generating new, estimated in-between frames (Optical Flow, Speed Warp) instead of repeating existing ones.</span></div>
  <div class="kv"><span class="k">Hyperlapse</span><span class="v">A moving, gimbal-stabilized timelapse.</span></div>
  <div class="kv"><span class="k">Motionlapse</span><span class="v">A timelapse where the camera itself moves through pre-set waypoints.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Real slow motion = footage shot at high fps, conformed into a lower-fps timeline — no new or repeated frames. Stretching a normal-fps clip only repeats existing frames and judders (proven with real ffmpeg frame counts on this page).</li>
<li>Slow-down factor = fps recorded ÷ timeline fps, same formula as Chapter 5 — now tied to your Pocket 3 and iPhone's real fps ceilings (120fps at 4K, 240fps only at 1080p, both devices).</li>
<li>Speed ramps (Resolve: Retime Curve; CapCut: Speed → Curve, presets Montage/Bullet/Jump Cut/Hero) put multiple speed changes on one clip.</li>
<li>Frame interpolation (Optical Flow, or Studio-only Speed Warp in Resolve) generates real new frames when you must slow down normal-fps footage — verified with a real 293-frame interpolated test vs. 299 duplicated frames.</li>
<li>Pocket 3's three lapse modes are distinct: Timelapse (still camera), Hyperlapse (moving, stabilized), Motionlapse (camera moves through waypoints) — confirmed on dji.com.</li>
</ul>
<div class="link-card"><a href="https://www.dji.com/osmo-pocket-3/specs" target="_blank" rel="noopener">DJI — Osmo Pocket 3 full video resolution/fps specs</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 17 · Bài 17.3</span>
<h2>Slow motion là phép toán bạn đã biết — Chương 5 chỉ chưa nói nó VỠ ở đâu</h2>
<p class="lead">Chương 5 đã cho bạn công thức: hệ số chậm = fps lúc quay ÷ fps timeline, và ví dụ 120fps → 25fps → 4,8×. Bài 12.2 và 13.2 đã cho bạn các nút bấm: Speed, Curve, Reverse, Freeze, Retime Controls. Bài này lấp khoảng trống giữa "tôi biết công thức" và "tôi biết vì sao kéo dài một clip quay thường lại trông tệ" — bằng số đo thật trên máy này — rồi thêm speed ramp nhiều điểm, nội suy khung, và ba cách Pocket 3 nén thời gian.</p>

<h3>Slow motion thật vs kéo dài clip quay thường — chứng minh bằng số thật</h3>
${slide('cr-17', 12, 'Slow motion ĐÚNG vs làm chậm clip quay thường')}
<p>Đây là cái bẫy gần như người mới nào cũng dính: bạn có một clip quay bình thường ở 25fps, kéo chậm 4 lần trong timeline, và nó giật thay vì trôi mượt. Lý do chính xác như slide cho thấy, đo trực tiếp bằng <code>ffmpeg</code>/<code>ffprobe</code> trên cảnh quay thử tự sinh, không phải ước lượng: kéo dài một clip 25fps (75 khung trong 3 giây) 4 lần bằng <code>setpts=4*PTS</code> ra 299 khung trong 11,96 giây — nhưng từ đầu chỉ có 75 khung THẬT. Phần mềm không có lựa chọn nào khác ngoài lặp lại mỗi khung gốc khoảng bốn lần để lấp thời gian thừa, và khung bị lặp chính là hình dạng của sự giật.</p>
<p>So sánh với cảnh quay thật sự được QUAY ở fps cao rồi CONFORM vào timeline fps thấp hơn — không có khung nào bị sinh ra, không có khung nào bị lặp, chỉ đổi tốc độ phát của những khung đã có. Cùng phép thử đó, lần này trên nguồn 100fps (300 khung thật trong 3 giây) đọc lại ở 25fps: đúng 300 khung thật, giờ phát trong 12,0 giây — một cú chậm sạch 4 lần (100÷25, y hệt công thức Chương 5) với chuyển động thật trong TỪNG khung.</p>
<div class="callout ok"><p>Những con số này đến từ việc chạy thật clip thử <code>ffmpeg -f lavfi -i testsrc2=...</code> qua cả hai đường trên máy này rồi đọc kết quả bằng <code>ffprobe</code> — không phải ước lượng. Muốn tự kiểm: sinh một clip fps cao ngắn, rồi so sánh <code>-r &lt;fps thấp&gt; -i clip.mp4</code> (đọc lại khung đã có — đường "conform") với <code>setpts=N*PTS</code> trên một clip fps thường (đường "kéo dài"), rồi kiểm <code>nb_frames</code> của từng output.</p></div>

<h3>fps lúc quay → hệ số chậm trên timeline 25fps của khoá này</h3>
${slide('cr-17', 11, 'fps lúc quay → hệ số chậm trên timeline 25fps')}
<p>Công thức của Chương 5 không đổi — giờ nó có một bảng đầy đủ, gắn với đúng đồ nghề bạn đang có. Cả Pocket 3 lẫn iPhone 16 Pro Max đều kịch trần 120fps cho cảnh quay cỡ 4K và chỉ chạm mức tối đa 240fps ở 1080p (dji.com/osmo-pocket-3/specs và support.apple.com/en-us/121032, kiểm 09/2026) — đó là lý do dòng 4,8× (120fps ÷ 25fps) khớp y hệt ví dụ Chương 5 đã dùng.</p>

<h3>Speed ramp — nhiều lần đổi tốc độ trong một clip</h3>
${slide('cr-17', 10, 'Speed ramp — đường cong tốc độ theo thời gian')}
<p>Bài 13.2 đã cho thấy Retime Controls cho MỘT lần đổi tốc độ cố định. <strong>Speed ramp</strong> là cùng ý tưởng đó với nhiều điểm trên một clip: tốc độ thường, hụp xuống slow motion đúng khoảnh khắc quan trọng, rồi trở lại thường — đường cong trên slide chính xác là hình dạng đó. Trong <strong>Resolve</strong>, mở Retime Controls, rồi kéo lên <strong>Retime Curve</strong> trên timeline, Ctrl/Cmd-click để thêm điểm, kéo % của từng điểm. Trong <strong>CapCut</strong>, mở <strong>Speed → Curve</strong> trên một clip: theo capcut.com/tools/speed-ramp, các preset tên <strong>Montage, Bullet, Jump Cut, và Hero</strong> có sẵn, hoặc kéo điểm bằng tay — dùng <strong>Add Point</strong> để tự vẽ đường cong tuỳ ý như trên slide.</p>

<h3>Nội suy khung — khi bạn thật sự cần khung MỚI, không phải khung lặp</h3>
<p>Đôi khi tất cả bạn có chỉ là cảnh quay 25fps mà vẫn cần làm chậm. Lựa chọn trung thực là sinh khung MỚI được ước lượng thay vì lặp khung cũ. Trong <strong>Resolve</strong>, <strong>Retime Process</strong> của Retime Controls có <strong>Optical Flow</strong>, với các mức chất lượng Motion Estimation (Standard và Enhanced, mỗi mức có Faster/Better) — và <strong>Speed Warp</strong>, dùng DaVinci Neural Engine cho kết quả chất lượng cao hơn và <strong>chỉ có ở bản Studio</strong>, không có ở bản miễn phí. Cùng phép thử <code>ffmpeg</code> ở trên làm rõ khác biệt: chạy <code>minterpolate</code> (nội suy khung theo ước lượng chuyển động) trên cùng nguồn 25fps đã kéo dài, ra 293 khung trong 11,72 giây — khung MỚI thật sự, được ước lượng, thay vì 299 khung lặp lại, dù ước lượng chuyển động vẫn có thể đọc sai chuyển động nhanh/phức tạp và tự sinh lỗi hình riêng. Trong CapCut, chưa xác nhận được nút nội suy khung riêng cho khoá này — kiểm trực tiếp trong bản bạn cài, đừng giả định nút đó tồn tại.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — tin Speed Warp có sẵn vì một video hướng dẫn nói vậy.</strong> Rất nhiều video hướng dẫn trên mạng mặc định bạn dùng Studio. Nếu bạn đang ở bản miễn phí và slow motion vẫn trông như khung lặp sau khi đã chọn Optical Flow, kiểm ô thả xuống Motion Estimation xem mức nào đang thật sự hoạt động — bản thân Speed Warp sẽ bị làm mờ hoặc gắn watermark lên bản render ở bản miễn phí.</p></div>

<h3>Freeze frame và reverse — dùng có chủ đích</h3>
<p>Bài 12.2 và 13.2 đã cho bạn nút bấm (CapCut: Speed → Freeze / Reverse; Resolve: chuột phải clip → Freeze Frame / Reverse Clip). Phán đoán ở đây: <strong>freeze frame</strong> hợp khi cần chốt một nhịp hài hước hoặc giữ lại thứ khán giả cần thêm một giây để đọc; <strong>reverse</strong> hợp khi bản thân chuyển động ngược chính là ý đồ (đảo ngược một hành động, một hiệu ứng có phong cách) — cả hai không nên dùng để "vá" một cảnh quay đơn giản là quá ngắn, vì lúc đó nó chỉ đọc ra như một clip bị kéo dài, lặp lại lộ liễu.</p>

<h3>Nén thời gian có chủ đích: timelapse, hyperlapse, motionlapse</h3>
${slide('cr-17', 13, 'Nén thời gian: timelapse, hyperlapse, motionlapse')}
<p>Pocket 3 của bạn có ba chế độ riêng biệt cho việc này, xác nhận từ dji.com/osmo-pocket-3/faq (kiểm 09/2026): <strong>Timelapse</strong> — máy ĐỨNG YÊN, chụp theo khoảng cách (interval) đã đặt, chỉnh được độ phân giải, fps, interval, và thời lượng. <strong>Hyperlapse</strong> — bạn vừa di chuyển vừa quay, gimbal tự ổn định, chỉnh được độ phân giải, fps, và tốc độ phát. <strong>Motionlapse</strong> — như Timelapse nhưng chính máy quay tự di chuyển qua các waypoint bạn đặt trước, thêm chỉnh interval và thời lượng. App Camera có sẵn trên iPhone của bạn có chế độ <strong>Time-lapse</strong> riêng, tự giãn khoảng chụp theo tổng thời gian bạn quay. Với montage cắt theo nhạc, đánh dấu beat của Bài 12.3 (⌘J trên clip nhạc trong CapCut) là cùng một công cụ dùng để đặt marker cắt đúng phách như dùng cho ducking — đặt marker trước, cắt sau.</p>
<p class="note-ct"><strong>Nối với bài sau:</strong> Bài 17.4 phóng to ngược ra hệ thống xung quanh tất cả những điều này — một lớp hiệu ứng phủ nhiều clip, preset lưu lại, và giữ một timeline nặng vẫn chạy mượt trong lúc bạn làm việc.</p>

<h3>🎬 Thực hành (20–30 phút)</h3>
<div class="callout ok"><ol>
<li>Quay 3 giây cùng một chuyển động ở fps cao nhất máy bạn có, rồi conform nó vào timeline 25fps — không kéo dài bằng setpts, không khung lặp.</li>
<li>Dựng một speed ramp trên một clip thường: tốc độ đủ → hụp xuống slow motion đúng một khoảnh khắc cụ thể → về lại tốc độ đủ.</li>
<li>Quay một clip timelapse hoặc hyperlapse bằng Pocket 3 (hoặc Time-lapse của iPhone) và ghi lại bạn đã chỉnh thông số nào.</li>
</ol><p><strong>Đạt khi:</strong> bạn nói được, không cần nhìn lại, hệ số chậm cho đúng fps bạn vừa quay (fps quay ÷ fps timeline của bạn), và clip slow-motion phát mượt khi xem toàn màn hình — không giật thấy rõ.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Conform</span><span class="v">Phát cảnh quay fps cao ở fps timeline thấp hơn, không sinh hay lặp khung nào — slow motion thật.</span></div>
  <div class="kv"><span class="k">Speed ramp</span><span class="v">Nhiều lần đổi tốc độ trong một clip, vẽ thành đường cong theo thời gian.</span></div>
  <div class="kv"><span class="k">Nội suy khung (frame interpolation)</span><span class="v">Sinh khung MỚI được ước lượng (Optical Flow, Speed Warp) thay vì lặp khung đã có.</span></div>
  <div class="kv"><span class="k">Hyperlapse</span><span class="v">Một timelapse có di chuyển, gimbal tự ổn định.</span></div>
  <div class="kv"><span class="k">Motionlapse</span><span class="v">Timelapse mà chính máy quay tự di chuyển qua các waypoint đặt trước.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Slow motion thật = quay ở fps cao, conform vào timeline fps thấp hơn — không khung mới, không khung lặp. Kéo dài clip fps thường chỉ lặp khung có sẵn và giật (chứng minh bằng số khung ffmpeg thật trên trang này).</li>
<li>Hệ số chậm = fps quay ÷ fps timeline, y hệt công thức Chương 5 — giờ gắn với trần fps thật của Pocket 3 và iPhone (120fps ở 4K, 240fps chỉ ở 1080p, cả hai máy).</li>
<li>Speed ramp (Resolve: Retime Curve; CapCut: Speed → Curve, preset Montage/Bullet/Jump Cut/Hero) đặt nhiều lần đổi tốc độ trên một clip.</li>
<li>Nội suy khung (Optical Flow, hoặc Speed Warp chỉ ở Studio trong Resolve) sinh khung mới thật khi bắt buộc phải làm chậm cảnh quay fps thường — kiểm chứng bằng phép thử thật 293 khung nội suy so với 299 khung lặp.</li>
<li>Ba chế độ lapse của Pocket 3 khác nhau rõ: Timelapse (máy đứng yên), Hyperlapse (di chuyển, ổn định), Motionlapse (máy tự di chuyển qua waypoint) — xác nhận từ dji.com.</li>
</ul>
<div class="link-card"><a href="https://www.dji.com/osmo-pocket-3/specs" target="_blank" rel="noopener">DJI — thông số độ phân giải/fps video đầy đủ của Osmo Pocket 3</a></div>
</div>
`,
    },

    /* ─────────────────── 17.4 Hệ thống hiệu ứng khi dựng ─────────────────── */
    {
      title: '17.4 — The effects system: adjustment layers & render cache|||17.4 — Hệ thống hiệu ứng: adjustment clip & render cache',
      slug: 'cr-17-4-he-thong-hieu-ung',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Một lớp hiệu ứng phủ nhiều clip (Adjustment Clip/layer), thư viện effects, lưu preset dùng lại, thứ tự hiệu ứng, render cache để timeline mượt — và vì sao tất cả việc này làm SAU picture lock.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 17 · Lesson 17.4</span>
<h2>One effects layer over many clips, not the same tweak repeated on every single one</h2>
<p class="lead">Everything so far in this chapter has been about ONE clip or ONE cut at a time. This lesson zooms out to the system that keeps a whole project's effects manageable: one layer that covers many clips at once, a library to pull from, a way to save your own combinations for the next project, and keeping a timeline full of effects actually playable while you edit. All of it, per Lesson 14.1, happens AFTER picture lock — this lesson explains exactly why.</p>

<h3>One layer, many clips: the Adjustment Clip</h3>
${slide('cr-17', 14, 'Hệ thống hiệu ứng — một lớp phủ, không sửa từng clip')}
<p>An <strong>Adjustment Clip</strong> is an empty clip that carries no footage of its own — any effect, color grade, or filter you put on it applies to every clip underneath it on the timeline. In <strong>DaVinci Resolve</strong>, find it in <strong>Effects Library → Toolbox</strong>, drag it onto a video track above the clips you want it to affect, then trim its length to cover exactly the range you need — a subtle color mood across ten clips in one place, instead of opening ten clips one at a time. In <strong>CapCut</strong>, the equivalent lives in the <strong>Adjustment</strong> tab you already saw named in Chapter 12's toolbar tour — confirm the exact clip/track mechanics in the version you have installed before teaching it to someone else.</p>

<h3>Where effects actually live</h3>
<p>Resolve's <strong>Effects Library</strong> holds its built-in tools plus <strong>OpenFX</strong> — Resolve officially supports third-party OpenFX and audio plugins, so the library grows if you install more. CapCut splits this into two separate tabs from the Chapter 12 toolbar: <strong>Effects</strong> (motion and stylized looks) and <strong>Filters</strong> (color/tone looks) — two different libraries for two different jobs, not one catch-all.</p>

<h3>Saving your own combination for next time</h3>
<p>Once you build an Adjustment Clip look you like, saving it beats rebuilding it from scratch on the next project. In Resolve, <strong>Power Bins</strong> store reusable items — including a configured Adjustment Clip — across every project you open, not just the current one. CapCut's rough equivalent is its <strong>Templates</strong> feature; confirm its exact scope (per-project vs. account-wide) in your installed version, since this is one more place terminology and behavior can shift between releases.</p>
<div class="callout ok"><p><strong>Order matters.</strong> Stack more than one effect or Adjustment Clip and the order they sit in — which one processes the image first — changes the result, the same logic as Resolve's node tree in Chapter 15's color grading. If a combined look does not match what you expected, check the stacking order before assuming an individual effect is wrong.</p></div>

<h3>Keeping a heavy timeline playable: render cache</h3>
<p>Adjustment Clips and stacked effects are exactly the kind of processing that makes a timeline stutter during editing. Resolve's fix is under <strong>Playback → Render Cache</strong>: <strong>None</strong> (off), <strong>User</strong> (you manually flag which clips to cache), or <strong>Smart</strong> (Resolve analyzes the timeline and automatically caches whatever is too processor-heavy to play live — including after you have been idle a few seconds). CapCut's closest equivalent for keeping playback smooth is proxy media on import (Chapter 11) — a different mechanism, aimed at raw footage rather than effects specifically, not a dedicated effects cache.</p>

<h3>Why all of this happens AFTER picture lock</h3>
${slide('cr-17', 15, 'Bảng tra nhanh — muốn làm gì thì mở công cụ nào')}
<p>Lesson 14.1 already set the rule: color and finishing sound/captions happen after picture lock, because re-cutting after they exist means redoing that work. An Adjustment Clip is exactly as fragile — it lives at a specific position and length on the timeline. Cut something earlier in the edit and every Adjustment Clip after that point drifts out of alignment with the clips it was supposed to cover, and you are re-trimming effects layers instead of just re-cutting picture.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — reaching for an Adjustment Clip while the cut is still changing.</strong> It feels productive to add "just a little mood" while you are still assembling. The moment you trim or reorder a clip underneath it, the Adjustment Clip's position on the timeline no longer covers what it was meant to — and now you are fixing two things instead of one.</p></div>
<p class="note-ct"><strong>Next:</strong> Chapter 18 covers masking, tracking, and practical VFX — using the same Effects Library and layering logic from this lesson, aimed at hiding, revealing, and following specific parts of the frame.</p>

<h3>🎬 Practice (15–20 minutes)</h3>
<div class="callout ok"><ol>
<li>On a picture-locked (or practice) timeline, add one Adjustment Clip / Adjustment track covering a run of 3–5 clips, with one subtle color effect.</li>
<li>Trim the Adjustment Clip's edges so it exactly matches the range of clips it should affect — no gaps, no overlap onto neighboring clips it should not touch.</li>
<li>If you are on Resolve, turn on Smart render cache, then compare playback smoothness before and after.</li>
</ol><p><strong>Done when:</strong> you can point at your Adjustment Clip on the timeline and confirm its start/end lines up exactly with the clips it is meant to cover.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Adjustment Clip / layer</span><span class="v">An empty clip or layer whose effects apply to every clip underneath it on the timeline.</span></div>
  <div class="kv"><span class="k">OpenFX</span><span class="v">Resolve's supported plugin standard for third-party effects, extending the Effects Library.</span></div>
  <div class="kv"><span class="k">Power Bins</span><span class="v">Resolve's storage for reusable items (including Adjustment Clips) shared across every project.</span></div>
  <div class="kv"><span class="k">Render Cache</span><span class="v">Resolve's system (None/User/Smart) for pre-rendering processor-heavy sections so playback stays smooth.</span></div>
  <div class="kv"><span class="k">Stacking order</span><span class="v">The sequence multiple effects/layers process in — changes the final result.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>An Adjustment Clip (Resolve: Effects Library → Toolbox) or Adjustment track (CapCut) applies effects to every clip beneath it — one place to manage a look instead of editing clips one by one.</li>
<li>Resolve splits its library into built-in tools plus installable OpenFX plugins; CapCut splits Effects (motion/style) from Filters (color/tone).</li>
<li>Save reusable combinations: Power Bins in Resolve (works across every project); CapCut's Templates (confirm exact scope in your version).</li>
<li>Stacking order changes the result — check it before assuming one effect is broken.</li>
<li>Render Cache (Resolve: None/User/Smart) keeps a heavy timeline playable; CapCut's closest tool is proxy media on import (Chapter 11), not a dedicated effects cache.</li>
<li>All of this happens after picture lock (Lesson 14.1) — an Adjustment Clip's position drifts the moment you re-cut anything underneath it.</li>
</ul>
<div class="link-card"><a href="https://www.blackmagicdesign.com/products/davinciresolve/training" target="_blank" rel="noopener">Blackmagic Design — free training guides (Effects Library, Power Bins reference)</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 17 · Bài 17.4</span>
<h2>Một lớp hiệu ứng phủ nhiều clip, không phải chỉnh lặp lại từng clip một</h2>
<p class="lead">Mọi thứ trong chương này từ đầu tới giờ đều nói về MỘT clip hoặc MỘT cú cắt tại một thời điểm. Bài này phóng to ra hệ thống giữ cho hiệu ứng của cả dự án quản lý được: một lớp phủ nhiều clip cùng lúc, một thư viện để lấy từ đó, cách lưu tổ hợp của riêng bạn cho dự án sau, và giữ một timeline đầy hiệu ứng vẫn chạy được trong lúc bạn dựng. Tất cả điều này, theo Bài 14.1, xảy ra SAU picture lock — bài này giải thích chính xác vì sao.</p>

<h3>Một lớp, nhiều clip: Adjustment Clip</h3>
${slide('cr-17', 14, 'Hệ thống hiệu ứng — một lớp phủ, không sửa từng clip')}
<p><strong>Adjustment Clip</strong> là một clip rỗng, không mang cảnh quay riêng — bất kỳ hiệu ứng, chỉnh màu, hay filter nào bạn đặt lên nó sẽ áp dụng cho MỌI clip nằm bên dưới nó trên timeline. Trong <strong>DaVinci Resolve</strong>, tìm nó ở <strong>Effects Library → Toolbox</strong>, kéo lên một track video phía trên các clip bạn muốn ảnh hưởng, rồi tỉa độ dài của nó để phủ đúng đoạn cần — một tông màu nhẹ cho mười clip chỉ ở MỘT chỗ, thay vì mở từng clip trong mười clip đó. Trong <strong>CapCut</strong>, thứ tương đương nằm ở tab <strong>Adjustment</strong> bạn đã thấy tên khi tour giao diện ở Chương 12 — xác nhận đúng cơ chế clip/track trong bản bạn cài trước khi dạy lại cho ai khác.</p>

<h3>Hiệu ứng thật sự sống ở đâu</h3>
<p><strong>Effects Library</strong> của Resolve chứa công cụ có sẵn cộng thêm <strong>OpenFX</strong> — Resolve chính thức hỗ trợ plugin OpenFX và audio bên thứ ba, nên thư viện lớn thêm nếu bạn cài thêm. CapCut chia việc này thành hai tab riêng đã thấy trong tour giao diện Chương 12: <strong>Effects</strong> (chuyển động, phong cách) và <strong>Filters</strong> (tông màu) — hai thư viện khác nhau cho hai việc khác nhau, không phải một chỗ gộp chung.</p>

<h3>Lưu tổ hợp của riêng bạn cho lần sau</h3>
<p>Một khi đã dựng được một "look" Adjustment Clip ưng ý, lưu lại tốt hơn dựng lại từ đầu ở dự án sau. Trong Resolve, <strong>Power Bins</strong> lưu những thứ dùng lại được — kể cả một Adjustment Clip đã cấu hình — dùng chung cho MỌI dự án bạn mở, không chỉ dự án hiện tại. Thứ tương đương gần đúng trong CapCut là tính năng <strong>Templates</strong>; xác nhận đúng phạm vi của nó (theo từng dự án hay theo cả tài khoản) trong bản bạn cài, vì đây là một chỗ nữa mà tên gọi và hành vi có thể đổi giữa các bản.</p>
<div class="callout ok"><p><strong>Thứ tự quan trọng.</strong> Chồng nhiều hơn một hiệu ứng hoặc Adjustment Clip, thứ tự chúng nằm — cái nào xử lý ảnh trước — đổi kết quả cuối, cùng logic với cây node của Resolve ở phần chỉnh màu Chương 15. Nếu một look kết hợp không ra như bạn mong đợi, kiểm thứ tự chồng lớp trước khi cho rằng một hiệu ứng riêng lẻ bị sai.</p></div>

<h3>Giữ một timeline nặng vẫn chạy được: render cache</h3>
<p>Adjustment Clip và hiệu ứng chồng lớp chính xác là kiểu xử lý khiến timeline khựng lúc dựng. Cách sửa của Resolve nằm ở <strong>Playback → Render Cache</strong>: <strong>None</strong> (tắt), <strong>User</strong> (bạn tự đánh dấu clip nào cần cache), hoặc <strong>Smart</strong> (Resolve tự phân tích timeline và tự cache bất cứ chỗ nào quá nặng để phát trực tiếp — kể cả sau khi bạn ngồi im vài giây). Thứ gần nhất trong CapCut để giữ phát mượt là proxy media lúc nhập liệu (Chương 11) — một cơ chế khác, nhắm vào cảnh quay gốc chứ không phải riêng cho hiệu ứng, không phải một cache riêng cho hiệu ứng.</p>

<h3>Vì sao tất cả điều này làm SAU picture lock</h3>
${slide('cr-17', 15, 'Bảng tra nhanh — muốn làm gì thì mở công cụ nào')}
<p>Bài 14.1 đã đặt luật: màu và âm thanh/phụ đề chính thức làm sau picture lock, vì cắt lại sau khi đã có hai việc đó nghĩa là làm lại từ đầu. Adjustment Clip cũng mong manh y hệt — nó sống ở đúng một vị trí và độ dài trên timeline. Cắt bớt một chỗ nào đó sớm hơn trong bản dựng, mọi Adjustment Clip sau điểm đó trôi lệch khỏi đúng những clip nó vốn phải phủ, và bạn đang tỉa lại lớp hiệu ứng thay vì chỉ cắt lại hình.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — với tay lấy Adjustment Clip trong lúc cú cắt vẫn còn đang đổi.</strong> Cảm giác như đang làm được việc khi thêm "một chút tông màu" lúc vẫn còn đang ráp bản dựng. Ngay khoảnh khắc bạn tỉa hoặc đổi thứ tự một clip bên dưới nó, vị trí của Adjustment Clip trên timeline không còn phủ đúng chỗ nó vốn phải phủ nữa — và giờ bạn đang sửa hai thứ thay vì một.</p></div>
<p class="note-ct"><strong>Nối với chương sau:</strong> Chương 18 nói về mask, tracking, và VFX thực tế — dùng chung Effects Library và logic chồng lớp của bài này, nhắm vào việc che, hiện, và bám theo đúng một phần cụ thể của khung hình.</p>

<h3>🎬 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Trên một timeline đã khoá hình (hoặc timeline thực hành), thêm một Adjustment Clip / track Adjustment phủ 3–5 clip liên tiếp, với một hiệu ứng màu nhẹ.</li>
<li>Tỉa hai mép của Adjustment Clip cho khớp CHÍNH XÁC phạm vi clip nó cần ảnh hưởng — không khoảng trống, không lấn sang clip bên cạnh không cần chạm.</li>
<li>Nếu đang dùng Resolve, bật render cache Smart, rồi so sánh độ mượt lúc phát trước và sau khi bật.</li>
</ol><p><strong>Đạt khi:</strong> bạn chỉ được vào Adjustment Clip trên timeline và xác nhận điểm đầu/cuối của nó khớp chính xác với các clip nó cần phủ.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Adjustment Clip / layer</span><span class="v">Một clip hoặc lớp rỗng mà hiệu ứng của nó áp dụng cho mọi clip nằm bên dưới trên timeline.</span></div>
  <div class="kv"><span class="k">OpenFX</span><span class="v">Chuẩn plugin Resolve hỗ trợ cho hiệu ứng bên thứ ba, mở rộng Effects Library.</span></div>
  <div class="kv"><span class="k">Power Bins</span><span class="v">Kho lưu của Resolve cho những thứ dùng lại được (kể cả Adjustment Clip), dùng chung cho mọi dự án.</span></div>
  <div class="kv"><span class="k">Render Cache</span><span class="v">Hệ thống của Resolve (None/User/Smart) để dựng sẵn các đoạn nặng, giữ phát mượt.</span></div>
  <div class="kv"><span class="k">Thứ tự chồng lớp</span><span class="v">Trình tự nhiều hiệu ứng/lớp xử lý — đổi kết quả cuối cùng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Adjustment Clip (Resolve: Effects Library → Toolbox) hoặc track Adjustment (CapCut) áp hiệu ứng cho mọi clip bên dưới nó — một chỗ để quản lý một "look" thay vì chỉnh từng clip riêng lẻ.</li>
<li>Resolve chia thư viện thành công cụ có sẵn cộng plugin OpenFX cài thêm; CapCut chia Effects (chuyển động/phong cách) khỏi Filters (tông màu).</li>
<li>Lưu tổ hợp dùng lại: Power Bins trong Resolve (dùng chung mọi dự án); Templates của CapCut (xác nhận đúng phạm vi trong bản bạn dùng).</li>
<li>Thứ tự chồng lớp đổi kết quả — kiểm thứ tự trước khi cho rằng một hiệu ứng bị hỏng.</li>
<li>Render Cache (Resolve: None/User/Smart) giữ một timeline nặng vẫn chạy được; công cụ gần nhất của CapCut là proxy media lúc nhập liệu (Chương 11), không phải cache riêng cho hiệu ứng.</li>
<li>Tất cả điều này làm sau picture lock (Bài 14.1) — vị trí một Adjustment Clip trôi lệch ngay khi bạn cắt lại bất cứ gì bên dưới nó.</li>
</ul>
<div class="link-card"><a href="https://www.blackmagicdesign.com/products/davinciresolve/training" target="_blank" rel="noopener">Blackmagic Design — sách đào tạo miễn phí (tra cứu Effects Library, Power Bins)</a></div>
</div>
`,
    },

    /* ─────────────────── 17.5 Quiz ─────────────────── */
    {
      title: '17.5 — Chapter 17 check|||17.5 — Kiểm tra chương 17',
      slug: 'cr-17-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu tình huống về cả chương: quay để chuyển cảnh, easing keyframe, slow motion đúng vs giật, speed ramp, Speed Warp, timelapse/hyperlapse/motionlapse, và Adjustment Clip.',
      content: `
<div class="ml-en"><p class="lead">Ten scenario questions covering all of Chapter 17: shooting for a transition, keyframe easing, real vs. fake slow motion, the fps-to-slowdown formula, Speed Warp's availability, lapse modes, Adjustment Clips, and why effects come after picture lock.</p></div>
<div class="ml-vi"><p class="lead">Mười câu tình huống về trọn Chương 17: quay để chuyển cảnh, easing keyframe, slow motion thật vs giả, công thức fps → hệ số chậm, Speed Warp có ở đâu, các chế độ lapse, Adjustment Clip, và vì sao hiệu ứng làm sau picture lock.</p></div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'You shoot a whip-pan transition, but when you cut the two clips together in CapCut the motion still looks broken at the join, even though both shots pan fast. What is the most likely cause?|||Bạn quay một chuyển cảnh whip pan, nhưng khi ghép hai clip trong CapCut, chuyển động ở chỗ nối vẫn trông gãy dù cả hai shot đều lia nhanh. Nguyên nhân nhiều khả năng nhất là gì?',
            options: [
              'The two pans go in different directions or at different speeds|||Hai cú lia đi khác hướng hoặc khác tốc độ nhau',
              'You recorded at too high a frame rate|||Bạn quay ở fps quá cao',
              'You forgot to turn on the shutter|||Bạn quên bật màn trập',
              'CapCut does not support whip pans|||CapCut không hỗ trợ whip pan',
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: Lesson 17.1 is explicit: believability comes from matched direction and matched speed across the pair of shots — CapCut's own guide states this directly. A mismatch there is what makes the eye catch the seam, no matter how good the transition effect layered on top is.|||VI: Bài 17.1 nói rõ: độ tin cậy đến từ khớp hướng và khớp tốc độ giữa cặp shot — chính hướng dẫn của CapCut nói thẳng điều này. Lệch ở đó là thứ khiến mắt bắt được chỗ nối, dù hiệu ứng chuyển cảnh phủ lên trên có tốt tới đâu.",
          },
          {
            question: 'Per Lesson 14.2 and this chapter, what should the default cut be for the vast majority of a good video\'s runtime?|||Theo Bài 14.2 và chương này, kiểu cắt mặc định cho phần lớn thời lượng của một video hay nên là gì?',
            options: [
              'Dissolve|||Dissolve',
              'Whip pan|||Whip pan',
              'Light leak|||Light leak',
              'Hard cut|||Hard cut',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Lesson 17.1 reaffirms Lesson 14.2: a hard cut is the cut behind the vast majority of any good video\'s runtime. A transition has to earn its place by signaling a real jump in time or place — it is not a decoration to apply by default.|||VI: Bài 17.1 khẳng định lại Bài 14.2: hard cut đứng sau phần lớn thời lượng của bất kỳ video hay nào. Chuyển cảnh phải có lý do mới được dùng — báo hiệu một cú nhảy thời gian/địa điểm thật, không phải trang trí mặc định.',
          },
          {
            question: 'Your last shot ends on a bicycle wheel spinning, and the next shot opens on a ceiling fan spinning at the same rate. Which transition type fits this pair best?|||Cảnh cuối của bạn kết thúc bằng một bánh xe đạp đang quay, cảnh sau mở đầu bằng một quạt trần đang quay cùng tốc độ. Kiểu chuyển cảnh nào hợp nhất cho cặp này?',
            options: [
              'Match / shape transition|||Match / shape transition',
              'Light leak / film burn|||Light leak / film burn',
              'Transition through an obstruction|||Chuyển cảnh qua vật cản',
              'Push / zoom|||Push / zoom',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Lesson 17.1 defines a match/shape transition as two shots joined because their shape or motion lines up — two spinning circular shapes at matching speed is exactly that case, the transition-based cousin of the match cut from Lesson 14.2.|||VI: Bài 17.1 định nghĩa match/shape transition là hai shot nối nhau vì hình dạng hoặc chuyển động khớp nhau — hai hình tròn đang xoay cùng tốc độ chính xác là trường hợp đó, họ hàng dạng chuyển cảnh của match cut ở Bài 14.2.',
          },
          {
            question: 'In DaVinci Resolve, how do you change ONE keyframe from linear interpolation to easing?|||Trong DaVinci Resolve, làm sao để đổi MỘT keyframe từ nội suy tuyến tính sang easing?',
            options: [
              'Drag an Ease filter from the Effects Library onto the clip|||Kéo một bộ lọc Ease từ Effects Library vào clip',
              'Change the project\'s frame rate|||Đổi frame rate của dự án',
              'Turn on Optical Flow in Retime Controls|||Bật Optical Flow trong Retime Controls',
              'Right-click the keyframe diamond in the Inspector and choose Ease In / Ease Out|||Chuột phải vào ô kim cương (keyframe) trong Inspector rồi chọn Ease In / Ease Out',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Lesson 17.2 states this directly: right-click the orange keyframe diamond in the Inspector to get Linear / Ease In / Ease Out / Ease In and Out. Optical Flow (option C) is a Retime Controls tool for changing clip speed, unrelated to a single keyframe\'s interpolation.|||VI: Bài 17.2 nói rõ: chuột phải vào ô kim cương màu cam trong Inspector để có Linear / Ease In / Ease Out / Ease In and Out. Optical Flow (phương án C) là công cụ của Retime Controls để đổi tốc độ clip, không liên quan tới nội suy của một keyframe đơn lẻ.',
          },
          {
            question: 'You take a clip shot normally at 25fps and stretch it 4× in your timeline to make slow motion. It plays back juddering instead of gliding smoothly. Why?|||Bạn lấy một clip quay THƯỜNG ở 25fps, kéo dài nó ra 4 lần trong timeline để làm slow motion. Nó phát ra giật cục thay vì trôi mượt. Vì sao?',
            options: [
              'Your editing software is broken|||Phần mềm dựng của bạn bị lỗi',
              'No new frames were generated — each original frame is simply repeated to fill the extra time|||Không có khung hình MỚI nào được sinh ra — mỗi khung gốc chỉ bị lặp lại để lấp thời gian',
              '25fps is too low to edit any video with|||25fps quá thấp để dựng bất kỳ video nào',
              'You forgot to enable Optical Flow before you started filming|||Bạn quên bật Optical Flow trước khi quay',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Lesson 17.3 measured this directly with ffmpeg: stretching a 25fps clip (75 real frames) 4× produces 299 output frames — meaning each real frame is repeated roughly four times, which is what judder looks like. Optical Flow (option D) is applied during editing to fix this after the fact, not something set before filming.|||VI: Bài 17.3 đo trực tiếp bằng ffmpeg: kéo dài một clip 25fps (75 khung thật) 4 lần ra 299 khung output — nghĩa là mỗi khung thật bị lặp lại khoảng bốn lần, và đó chính là hình dạng của sự giật. Optical Flow (phương án D) được áp dụng lúc dựng để sửa việc này SAU đó, không phải thứ bật trước khi quay.',
          },
          {
            question: 'You shoot B-roll at 60fps and edit it on this course\'s 25fps timeline. Roughly how many times slower does that footage play compared to how it happened?|||Bạn quay B-roll ở 60fps, dựng trên timeline 25fps của khoá này. Đoạn đó phát chậm khoảng bao nhiêu lần so với lúc quay?',
            options: [
              '2×|||2×',
              '6×|||6×',
              '2.4×|||2,4×',
              '4×|||4×',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Slow-down factor = fps recorded ÷ timeline fps (Chapter 5\'s formula, reused in Lesson 17.3): 60 ÷ 25 = 2.4×. This is the same math behind the chapter\'s already-familiar 120fps ÷ 25fps = 4.8× example.|||VI: Hệ số chậm = fps quay ÷ fps timeline (công thức Chương 5, dùng lại ở Bài 17.3): 60 ÷ 25 = 2,4×. Đây là cùng phép tính đứng sau ví dụ đã quen thuộc của chương: 120fps ÷ 25fps = 4,8×.',
          },
          {
            question: 'Speed Warp — DaVinci Resolve\'s Neural Engine-based frame interpolation for high-quality slow motion — is available in which version?|||Speed Warp — công cụ nội suy khung chất lượng cao dùng DaVinci Neural Engine của Resolve — có ở bản nào?',
            options: [
              'Both the free version and Studio|||Cả bản miễn phí lẫn Studio',
              'DaVinci Resolve Studio only|||Chỉ DaVinci Resolve Studio',
              'The free version only|||Chỉ bản miễn phí',
              'Only on iPad, not on Mac|||Chỉ trên iPad, không có trên Mac',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Lesson 17.3 states this directly: Speed Warp uses the DaVinci Neural Engine and is Studio-only — on the free version it will be grayed out or the render will carry a watermark. Optical Flow (also covered in the lesson) is the interpolation option available on both Free and Studio.|||VI: Bài 17.3 nói rõ: Speed Warp dùng DaVinci Neural Engine và chỉ có ở bản Studio — trên bản miễn phí nó sẽ bị làm mờ hoặc bản render bị gắn watermark. Optical Flow (cũng được nói trong bài) mới là tuỳ chọn nội suy có ở cả bản miễn phí lẫn Studio.',
          },
          {
            question: 'You want your Pocket 3 to automatically move the camera itself through several pre-set waypoints while compressing time — for example, slowly panning from angle A to angle B over two hours. Which mode is correct?|||Bạn muốn Pocket 3 tự di chuyển góc máy qua nhiều waypoint đã đặt trước trong lúc nén thời gian — ví dụ tự xoay dần từ góc A sang góc B suốt hai tiếng. Chế độ nào đúng?',
            options: [
              'Timelapse|||Timelapse',
              'Hyperlapse|||Hyperlapse',
              'iPhone Time-lapse|||Time-lapse của iPhone',
              'Motionlapse|||Motionlapse',
            ],
            correctIndex: 3,
            points: 1,
            explanation: "EN: Lesson 17.3, confirmed on dji.com/osmo-pocket-3/faq: Timelapse keeps the camera still; Hyperlapse is YOU moving while it stabilizes; Motionlapse is the camera itself moving through pre-set waypoints, with interval and duration configurable on top — exactly this scenario.|||VI: Bài 17.3, xác nhận từ dji.com/osmo-pocket-3/faq: Timelapse giữ máy đứng yên; Hyperlapse là BẠN di chuyển còn máy tự ổn định; Motionlapse là chính máy quay tự di chuyển qua các waypoint đặt trước, chỉnh thêm được interval và thời lượng — đúng tình huống này.",
          },
          {
            question: 'You want exactly one subtle color effect applied across 8 consecutive clips on your timeline, without opening each clip individually. Which tool fits best?|||Bạn muốn đúng MỘT hiệu ứng màu nhẹ áp cho 8 clip liên tiếp trên timeline, mà không mở từng clip riêng để chỉnh. Công cụ nào hợp nhất?',
            options: [
              'An Adjustment Clip / Adjustment track placed above them|||Adjustment Clip / track Adjustment đặt phía trên chúng',
              'A keyframe on each individual clip|||Keyframe trên từng clip riêng lẻ',
              'Retime Controls|||Retime Controls',
              'Reverse Clip|||Reverse Clip',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Lesson 17.4 defines exactly this use case: an Adjustment Clip (Resolve) or Adjustment track (CapCut) is an empty layer whose effects apply to every clip beneath it — one place to manage a look instead of editing clips one by one.|||VI: Bài 17.4 định nghĩa chính xác trường hợp này: Adjustment Clip (Resolve) hoặc track Adjustment (CapCut) là một lớp rỗng mà hiệu ứng của nó áp cho mọi clip bên dưới — một chỗ để quản lý một "look" thay vì chỉnh từng clip riêng lẻ.',
          },
          {
            question: 'You added an Adjustment Clip and several keyframed effects, then realized you need to trim a section out of the middle of the video — now everything downstream is misaligned. Which lesson from this chapter would have prevented having to redo this work?|||Bạn đã thêm Adjustment Clip và vài hiệu ứng keyframe, rồi phát hiện cần cắt bớt một đoạn giữa video — giờ mọi thứ phía sau bị lệch. Bài học nào của chương này lẽ ra đã tránh được việc phải làm lại?',
            options: [
              'You should have used CapCut instead of Resolve|||Lẽ ra nên dùng CapCut thay vì Resolve',
              'You should have turned off Render Cache before cutting|||Lẽ ra nên tắt Render Cache trước khi cắt',
              'Effects and Adjustment Clips should be added AFTER picture lock, not before|||Hiệu ứng và Adjustment Clip nên thêm SAU khi đã picture lock, không phải trước',
              'You should have shot at a lower frame rate|||Lẽ ra nên quay ở fps thấp hơn',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Lesson 17.4 ties this directly back to Lesson 14.1\'s picture-lock rule: an Adjustment Clip lives at a specific position and length on the timeline, so cutting something earlier in the edit drifts every Adjustment Clip after that point out of alignment — exactly why effects work happens after picture, not before.|||VI: Bài 17.4 nối thẳng về luật picture lock của Bài 14.1: một Adjustment Clip sống ở đúng một vị trí và độ dài trên timeline, nên cắt bớt một chỗ sớm hơn trong bản dựng làm mọi Adjustment Clip sau điểm đó trôi lệch — đúng lý do vì sao việc làm hiệu ứng xảy ra sau khi khoá hình, không phải trước.',
          },
        ],
      },
    },
  ],
};
