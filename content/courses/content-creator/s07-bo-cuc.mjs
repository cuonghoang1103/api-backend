/**
 * Content Creator — Chương 7: Bố cục & ngôn ngữ hình ảnh. Song ngữ EN/VI (.ml-en / .ml-vi).
 * ⚠️ KHÔNG backtick trần trong content (dùng &#96;); `${` trong mã mẫu viết \${ ; gạch chéo ngược viết \\
 *
 * Nối mạch Chương 4 (đã dạy Scene/Shot/Take, cowboy MWS, coverage 5-shot) và
 * Chương 5 (đã dạy khẩu độ/độ sâu trường ảnh, và gài sẵn câu "ĐỪNG nhầm với
 * quy tắc 180° ở Chương 7" ở Bài 5.2) — chương này KHÔNG dạy lại cỡ cảnh hay
 * độ sâu trường ảnh từ đầu, mà đi sâu vào NGÔN NGỮ HÌNH ẢNH: góc máy, tiêu cự
 * thật của đồ nghề, bố cục trong khung, và luật liên tục khi dựng.
 *
 * Nguồn số liệu chính (đầy đủ trong báo cáo bàn giao):
 *  - Tiêu cự tương đương Pocket 3 (20mm, f/2.0) và iPhone 16 Pro Max (Ultra
 *    Wide 13mm f/2.2 · chính 24mm f/1.78 · Tele 5× 120mm f/2.8): đã kiểm ở
 *    Chương 5 (dji.com/osmo-pocket-3/specs) và Chương 6.1–6.2
 *    (support.apple.com/en-us/121032) — dùng lại đúng số, không kiểm lại.
 *  - Ba chế độ gimbal Pocket 3 (Follow / Tilt Locked / FPV): đã kiểm ở Bài
 *    6.1 (dji.com/osmo-pocket-3/specs + User Manual v1.0 dl.djicdn.com).
 *  - Méo phối cảnh là hàm số của KHOẢNG CÁCH, không phải bản chất tiêu cự:
 *    fstoppers.com/architecture/how-lens-compression-and-perspective-distortion-work-251737.
 *  - Quy tắc 180° (trục hành động, khác quy tắc 180° màn trập ở Bài 5.2):
 *    studiobinder.com/blog/what-is-the-180-degree-rule-film.
 *  - Quy tắc 30°: en.wikipedia.org/wiki/30-degree_rule.
 *  - Vùng an toàn 9:16: KHÔNG có nguồn chính thức công bố số pixel/tỉ lệ cụ
 *    thể (TikTok/Reels/Shorts đổi giao diện liên tục) — ghi rõ "ước lượng"
 *    trong bài, kèm cách tự kiểm bằng khung lưới + xem trên app thật.
 */
import { gallery, slide } from './_slides.mjs';

const SLIDES = [
  [1, 'Bìa chương'],
  [2, 'Bản đồ chương'],
  [3, 'Bảy cỡ cảnh — từ đặc tả tới đại cảnh'],
  [4, 'Góc máy — cùng một người, năm cách nhìn'],
  [5, 'Tiêu cự tương đương — đồ nghề của bạn'],
  [6, 'Méo mặt là do khoảng cách, không phải ống rộng'],
  [7, 'Quy tắc 1/3 & khoảng trống đầu'],
  [8, 'Khoảng nhìn & đặt giữa'],
  [9, 'Thêm chiều sâu cho khung hình phẳng'],
  [10, 'Vùng an toàn cho video dọc 9:16'],
  [11, 'Chuyển động máy — phải có động cơ'],
  [12, 'Quy tắc 180° — trục hành động khi dựng phim'],
  [13, 'Quy tắc 30° & liên tục giữa các cú cắt'],
  [14, 'Bảng tra nhanh cả chương'],
  [15, 'Thực hành'],
];

export default {
  title: 'Chapter 7 — Composition & visual language|||Chương 7 — Bố cục & ngôn ngữ hình ảnh',
  description: 'Cỡ cảnh, góc máy, tiêu cự thật của Pocket 3 và iPhone, bố cục trong khung (1/3, khoảng đầu, khoảng nhìn, vùng an toàn 9:16), chuyển động máy và luật liên tục khi dựng — biến cảnh quay rời rạc thành một ngôn ngữ có chủ đích.',
  lessons: [
    /* ─────────────────── 7.0 slide bài giảng ─────────────────── */
    {
      title: '7.0 — Chapter 7 in 15 slides|||7.0 — Chương 7 trong 15 slide',
      slug: 'cr-07-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Toàn bộ ngôn ngữ hình ảnh của chương gói trong 15 slide: cỡ cảnh, góc máy, tiêu cự thật, bố cục 1/3, vùng an toàn 9:16, chuyển động máy và luật liên tục.',
      content: `
<div class="ml-en"><h2>📑 Chapter 7 in 15 slides</h2>
<p>Chapter 4 gave you the paperwork (shot lists, storyboards) and Chapter 5 gave you the machine's physics (exposure, depth of field). This chapter gives you the actual visual grammar: which shot size to reach for, where to stand, where to put your subject inside the rectangle, and how to move the camera and cut between shots without confusing your viewer. Slide 6 (why faces distort up close) and slide 12 (the 180° axis rule) are the two that fix the most common beginner mistakes.</p>
<p>Skim these 15 slides before the lessons below, then come back to slide 3 and slide 14 whenever you forget a term mid-edit.</p></div>
<div class="ml-vi"><h2>📑 Chương 7 trong 15 slide</h2>
<p>Chương 4 cho bạn giấy tờ (shot list, storyboard), Chương 5 cho bạn vật lý của cái máy (phơi sáng, độ sâu trường ảnh). Chương này cho bạn đúng thứ ngữ pháp hình ảnh: chọn cỡ cảnh nào, đứng ở đâu, đặt chủ thể ở chỗ nào trong khung, và di chuyển/cắt máy sao cho người xem không bị lạc. Slide 6 (vì sao mặt méo khi quay gần) và slide 12 (quy tắc trục 180°) là hai slide sửa được nhiều lỗi người mới nhất.</p>
<p>Lướt qua 15 slide này trước các bài dưới, rồi quay lại slide 3 và slide 14 mỗi khi quên thuật ngữ giữa lúc dựng.</p></div>
${gallery('cr-07', SLIDES)}
`,
    },

    /* ─────────────────── 7.1 cỡ cảnh ─────────────────── */
    {
      title: '7.1 — Shot sizes: choosing how close the camera gets|||7.1 — Cỡ cảnh: chọn máy đứng gần hay xa',
      slug: 'cr-07-1-co-canh',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Bảy cỡ cảnh từ đặc tả tới đại cảnh — mỗi cỡ dùng khi nào, cảm xúc gì, và vì sao talking head chuẩn là MS/MCU còn B-roll đặc tả là ECU/CU.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>How close the camera stands is not a technical detail — it is the first sentence of your shot</h2>
<p class="lead">Before a viewer processes a single word you say, they already read something from HOW MUCH of you is in frame. A wide shot says "here is the place." A close-up says "look at this feeling." Chapter 4 gave you the words scene/shot/take/setup; this lesson gives you the seven sizes those shots actually come in, and which one to reach for without having to think about it mid-shoot.</p>

<h3>Seven sizes, one ladder</h3>
${slide('cr-07', 3, 'Bảy cỡ cảnh — từ đặc tả tới đại cảnh')}
<div class="kv-grid">
  <div class="kv"><span class="k">ECU — Extreme close-up</span><span class="v">Đặc tả. One detail fills the frame: an eye, a fingertip on a key, a single line of code. No room for anything else.</span></div>
  <div class="kv"><span class="k">CU — Close-up</span><span class="v">Cận cảnh. The whole face, or a whole hand on an object. Reads emotion clearly; still too tight for a full talking-head lesson.</span></div>
  <div class="kv"><span class="k">MCU — Medium close-up</span><span class="v">Cận trung. Head to mid-chest. The most common "talking to camera" size — you read the face AND a little body language.</span></div>
  <div class="kv"><span class="k">MS — Medium shot</span><span class="v">Trung cảnh. Roughly waist-up. Room for hand gestures; still close enough to read expression.</span></div>
  <div class="kv"><span class="k">MWS — Medium wide (cowboy)</span><span class="v">Trung toàn. Roughly mid-thigh up — named because it is where old Westerns framed a gunslinger's holster. Good for two people at a table.</span></div>
  <div class="kv"><span class="k">WS — Wide shot</span><span class="v">Toàn cảnh. The whole person, head to feet, with some room around them. Shows the space they are in.</span></div>
  <div class="kv"><span class="k">EWS — Extreme wide</span><span class="v">Đại cảnh. The person is small in a large space — a campus, a street, a skyline. Establishes WHERE before anything else happens.</span></div>
</div>

<h3>The three jobs almost every shot in this course does</h3>
<p>You do not need to memorize when to use all seven sizes from a chart — three simple defaults cover nearly everything you will shoot:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Talking head (you, explaining something)</span><span class="v">MS or MCU. Tight enough to read your face clearly, loose enough that a hand gesture or a laptop on the desk doesn't get cut off. This is the default for coding tutorials, vlogging intros, and lesson delivery.</span></div>
  <div class="kv"><span class="k">B-roll detail (Chapter 4's inserts and cutaways)</span><span class="v">ECU or CU. Close shots do not need headroom or lead room rules — a close-up of hands typing or a terminal full of red errors reads instantly at any size, which is exactly why it is fast, forgiving B-roll.</span></div>
  <div class="kv"><span class="k">Establishing a place (the first shot of a scene, or a vlog opener)</span><span class="v">WS or EWS. Before the viewer cares about you, they need to know WHERE you are — the FPTU gate, a lecture hall, a bedroom desk setup.</span></div>
</div>

<h3>Worked example: filming a mock interview in a lecture hall</h3>
<p>Say you are filming a classmate for a short "what do you wish you knew before FPTU" clip in an empty lecture hall. A shot list built entirely from MS would be flat and repetitive — five sizes, chosen on purpose, tell a much better story:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">WS</span><span class="lz-d">The empty hall, rows of seats — establishes where you are</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">MWS (cowboy)</span><span class="lz-d">Both of you sitting, notebooks visible — sets up the conversation</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">MCU</span><span class="lz-d">Your classmate answering — the main interview size, close enough to read every reaction</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">CU</span><span class="lz-d">Hands writing a note, or scrolling a phone — B-roll to cut away to</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">ECU</span><span class="lz-d">Eyes narrowing while thinking of an answer — the one shot that sells "this is a real, thoughtful moment"</span></div>
</div>
<p>Notice the MWS/cowboy size doing exactly the job Chapter 4 named it for: two people, waist-up, both fit without either one feeling cramped. That is the size interviews and two-person conversations reach for by default.</p>

<div class="callout ok"><p><strong>A trick that costs nothing:</strong> before you shoot a scene, say its planned sizes out loud in order — "wide, cowboy, medium-close, close, extreme close-up." If you cannot name at least three different sizes for a scene longer than 30 seconds, you are about to shoot something flat, and now is the moment to fix that, not in the edit.</p></div>

<div class="pitfall co-tieu-de"><p><strong>Trap — shooting everything at MS/MCU because it is the "safe" size.</strong> It is safe, which is exactly the problem: a 5-minute video shot entirely in one size, at one distance, looks like a single unbroken take even after you have cut it into twelve pieces — because nothing about the FRAMING changes, only the words do. Coverage (Chapter 4) means different ANGLES on the same action; varying shot SIZE is the other half of the same idea. Plan at least one size change per scene on purpose.</p></div>

<p class="note-ct"><strong>Next:</strong> Lesson 7.2 adds the two variables that change everything about a chosen size — camera angle (where you point it from) and focal length (how "far" the lens itself reaches) — including the real millimeter numbers for your own gear.</p>

<h3>🎬 Practice (20 minutes)</h3>
<div class="callout ok"><ol>
<li>Pick one subject (yourself, a friend, or your desk setup) and shoot it at all seven sizes: ECU, CU, MCU, MS, MWS, WS, EWS.</li>
<li>Name each file with its size in the filename (e.g. &#96;desk-MCU.mp4&#96;) so you can find them again for Chapter 4's shot-list practice.</li>
<li>Play the seven clips back to back. Write one sentence: which size would you use for a talking-head lesson, and which for B-roll?</li>
</ol><p><strong>Done when:</strong> you have 7 clearly different files, each one visibly a different framing distance, and you can point at two of them and say what job each one does.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Shot size</span><span class="v">Cỡ cảnh — how much of the subject and surroundings fits in the frame, from extreme close-up to extreme wide.</span></div>
  <div class="kv"><span class="k">Cowboy shot (MWS)</span><span class="v">Trung toàn — roughly mid-thigh up; the standard size for two people talking at a table.</span></div>
  <div class="kv"><span class="k">Establishing shot</span><span class="v">A wide or extreme-wide shot at the start of a scene that tells the viewer where they are before anything else happens.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Seven sizes: ECU, CU, MCU, MS, MWS (cowboy), WS, EWS — each one is a different amount of "how much of the world is in this frame."</li>
<li>Three defaults cover most of this course: talking head → MS/MCU, B-roll detail → ECU/CU, establishing a place → WS/EWS.</li>
<li>MWS/cowboy is the standard size for two people in conversation — waist-up, both fit comfortably.</li>
<li>A scene shot entirely at one size looks flat even after editing — plan at least one size change per scene on purpose.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>Máy đứng gần hay xa không phải chi tiết kỹ thuật — đó là câu đầu tiên của cú máy</h2>
<p class="lead">Trước khi người xem nghe được một chữ bạn nói, họ đã "đọc" được điều gì đó từ việc CÓ BAO NHIÊU của bạn nằm trong khung. Toàn cảnh nói "đây là nơi chốn." Cận cảnh nói "nhìn cảm xúc này đi." Chương 4 cho bạn các từ scene/shot/take/setup; bài này cho bạn bảy cỡ cảnh thật sự mà các shot đó mang, và cỡ nào nên dùng mà không cần nghĩ ngợi giữa lúc quay.</p>

<h3>Bảy cỡ cảnh, một chiếc thang</h3>
${slide('cr-07', 3, 'Bảy cỡ cảnh — từ đặc tả tới đại cảnh')}
<div class="kv-grid">
  <div class="kv"><span class="k">ECU — Đặc tả</span><span class="v">Một chi tiết lấp đầy khung: một con mắt, đầu ngón tay trên phím, đúng một dòng code. Không còn chỗ cho gì khác.</span></div>
  <div class="kv"><span class="k">CU — Cận cảnh</span><span class="v">Cả khuôn mặt, hoặc cả bàn tay trên một vật. Đọc cảm xúc rất rõ; vẫn quá chật cho một bài giảng talking-head trọn vẹn.</span></div>
  <div class="kv"><span class="k">MCU — Cận trung</span><span class="v">Từ đầu tới giữa ngực. Cỡ "nói với máy" phổ biến nhất — vừa đọc được mặt VỪA thấy chút ngôn ngữ cơ thể.</span></div>
  <div class="kv"><span class="k">MS — Trung cảnh</span><span class="v">Đại khái từ thắt lưng trở lên. Đủ chỗ cho cử chỉ tay; vẫn đủ gần để đọc biểu cảm.</span></div>
  <div class="kv"><span class="k">MWS — Trung toàn (cowboy)</span><span class="v">Đại khái từ giữa đùi trở lên — gọi "cowboy" vì phim cao bồi xưa hay đóng khung ngang bao súng ở cỡ này. Hợp cho hai người ngồi cùng bàn.</span></div>
  <div class="kv"><span class="k">WS — Toàn cảnh</span><span class="v">Cả người, từ đầu tới chân, còn chút khoảng trống quanh. Cho thấy không gian họ đang ở.</span></div>
  <div class="kv"><span class="k">EWS — Đại cảnh</span><span class="v">Người nhỏ xíu trong một không gian lớn — cả khuôn viên trường, một con phố, một đường chân trời. Thiết lập Ở ĐÂU trước khi có gì khác xảy ra.</span></div>
</div>

<h3>Ba việc mà gần như mọi shot trong khoá này làm</h3>
<p>Bạn không cần thuộc lòng lúc nào dùng cả bảy cỡ từ một bảng — ba mặc định đơn giản này phủ gần hết mọi thứ bạn sẽ quay:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Talking head (bạn, đang giải thích gì đó)</span><span class="v">MS hoặc MCU. Đủ gần để đọc rõ mặt bạn, đủ rộng để một cử chỉ tay hay cái laptop trên bàn không bị cắt mất khung. Đây là mặc định cho video dạy code, mở đầu vlog, và giảng bài.</span></div>
  <div class="kv"><span class="k">B-roll đặc tả (insert và cutaway của Chương 4)</span><span class="v">ECU hoặc CU. Cận cảnh không cần theo luật khoảng đầu hay khoảng nhìn — một cận cảnh tay gõ phím hay một terminal đỏ lỗi đọc được ngay lập tức ở bất kỳ vị trí nào trong khung, đúng lý do vì sao nó là B-roll nhanh, dễ dùng.</span></div>
  <div class="kv"><span class="k">Thiết lập một nơi chốn (shot đầu của một cảnh, hoặc mở đầu vlog)</span><span class="v">WS hoặc EWS. Trước khi người xem quan tâm tới bạn, họ cần biết bạn đang Ở ĐÂU — cổng trường FPTU, một giảng đường, một góc bàn học trong phòng.</span></div>
</div>

<h3>Ví dụ thật: quay một buổi "phỏng vấn giả lập" trong giảng đường</h3>
<p>Giả sử bạn quay một người bạn học cho một clip ngắn "điều gì bạn ước biết trước khi vào FPTU" trong một giảng đường trống. Một shot list toàn MS sẽ phẳng lì và lặp lại — năm cỡ cảnh, chọn có chủ đích, kể một câu chuyện hay hơn nhiều:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">WS</span><span class="lz-d">Giảng đường trống, hàng ghế dài — thiết lập bạn đang ở đâu</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">MWS (cowboy)</span><span class="lz-d">Cả hai người ngồi, thấy cả vở ghi chép — dựng bối cảnh cuộc trò chuyện</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">MCU</span><span class="lz-d">Bạn học đang trả lời — cỡ chính của phỏng vấn, đủ gần để đọc mọi phản ứng</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">CU</span><span class="lz-d">Tay đang viết ghi chú, hoặc lướt điện thoại — B-roll để cắt sang</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">ECU</span><span class="lz-d">Mắt nheo lại lúc đang nghĩ câu trả lời — đúng cú máy "bán" được cảm giác đây là một khoảnh khắc thật, có suy nghĩ</span></div>
</div>
<p>Để ý cỡ MWS/cowboy đang làm đúng việc Chương 4 đã đặt tên cho nó: hai người, từ thắt lưng trở lên, cả hai đều vừa khung mà không ai bị chật. Đó là cỡ mặc định cho phỏng vấn và hội thoại hai người.</p>

<div class="callout ok"><p><strong>Một mẹo không tốn gì cả:</strong> trước khi quay một cảnh, nói to thứ tự cỡ cảnh đã lên kế hoạch — "toàn cảnh, cowboy, cận trung, cận cảnh, đặc tả." Nếu không kể được ít nhất ba cỡ khác nhau cho một cảnh dài hơn 30 giây, bạn sắp quay ra thứ phẳng lì — sửa ngay bây giờ, đừng để tới lúc dựng.</p></div>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — quay mọi thứ ở MS/MCU vì đó là cỡ "an toàn".</strong> Nó an toàn, và chính đó là vấn đề: một video 5 phút quay toàn bộ ở một cỡ, một khoảng cách, trông như một lèo liền mạch dù bạn đã cắt thành mười hai đoạn — vì không gì về KHUNG HÌNH đổi cả, chỉ có lời nói đổi. Coverage (Chương 4) nghĩa là nhiều GÓC khác nhau cho cùng hành động; đổi CỠ CẢNH là nửa còn lại của cùng một ý đó. Lên kế hoạch ít nhất một lần đổi cỡ mỗi cảnh, có chủ đích.</p></div>

<p class="note-ct"><strong>Bài tiếp theo:</strong> Bài 7.2 thêm hai biến số đổi hẳn ý nghĩa của một cỡ cảnh đã chọn — góc máy (chĩa máy từ đâu) và tiêu cự (ống kính "vươn" xa tới đâu) — kèm đúng số milimet của đồ nghề bạn đang có.</p>

<h3>🎬 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
<li>Chọn một chủ thể (chính bạn, một người bạn, hoặc góc bàn học của bạn) và quay đủ bảy cỡ: ECU, CU, MCU, MS, MWS, WS, EWS.</li>
<li>Đặt tên file kèm cỡ cảnh (vd &#96;ban-hoc-MCU.mp4&#96;) để tìm lại được cho phần thực hành shot list ở Chương 4.</li>
<li>Xem lại bảy clip liền nhau. Viết một câu: cỡ nào bạn sẽ dùng cho bài giảng talking-head, cỡ nào cho B-roll.</li>
</ol><p><strong>Đạt khi:</strong> có 7 file rõ ràng khác nhau, mỗi file là một khoảng cách đóng khung khác biệt thấy rõ, và bạn chỉ được hai file trong đó, nói đúng việc mỗi cỡ đảm nhận.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Cỡ cảnh</span><span class="v">Shot size — bao nhiêu phần của chủ thể và không gian xung quanh vừa trong khung, từ đặc tả tới đại cảnh.</span></div>
  <div class="kv"><span class="k">Cowboy shot (MWS)</span><span class="v">Trung toàn — đại khái từ giữa đùi trở lên; cỡ chuẩn cho hai người trò chuyện cùng bàn.</span></div>
  <div class="kv"><span class="k">Establishing shot</span><span class="v">Cảnh thiết lập — một toàn cảnh hoặc đại cảnh ở đầu một cảnh, cho người xem biết họ đang ở đâu trước khi có gì khác xảy ra.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Bảy cỡ cảnh: ECU, CU, MCU, MS, MWS (cowboy), WS, EWS — mỗi cỡ là một lượng khác nhau của "bao nhiêu phần thế giới nằm trong khung này."</li>
<li>Ba mặc định phủ hầu hết khoá này: talking head → MS/MCU, B-roll đặc tả → ECU/CU, thiết lập nơi chốn → WS/EWS.</li>
<li>MWS/cowboy là cỡ chuẩn cho hai người trò chuyện — từ thắt lưng trở lên, cả hai đều vừa khung thoải mái.</li>
<li>Một cảnh quay toàn bộ ở một cỡ trông phẳng lì kể cả sau khi dựng — lên kế hoạch ít nhất một lần đổi cỡ mỗi cảnh, có chủ đích.</li>
</ul>
</div>
`,
    },

    /* ─────────────────── 7.2 góc máy & tiêu cự ─────────────────── */
    {
      title: '7.2 — Camera angle & focal length: your real gear, in millimeters|||7.2 — Góc máy & tiêu cự: đồ nghề thật của bạn, tính bằng milimet',
      slug: 'cr-07-2-goc-may-tieu-cu',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Năm góc máy và cảm xúc chúng tạo ra, tiêu cự tương đương thật của Pocket 3 và ba ống iPhone 16 Pro Max, và vì sao mặt méo là do khoảng cách chứ không phải ống kính rộng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2</span>
<h2>Same size, same subject, same light — a different angle changes what the shot MEANS</h2>
<p class="lead">Lesson 7.1 picked how much of the subject is in frame. This lesson picks two things that change everything else about that shot: where you point the camera FROM (angle), and how "far" the lens itself reaches (focal length) — including a beginner mistake that makes almost every close-up selfie-style talking head look slightly wrong, and why it has nothing to do with the lens being "bad."</p>

<h3>Five angles, five different relationships with your subject</h3>
${slide('cr-07', 4, 'Góc máy — cùng một người, năm cách nhìn')}
<div class="kv-grid">
  <div class="kv"><span class="k">Eye level (ngang tầm mắt)</span><span class="v">Camera at the subject's own eye height. Neutral, relatable — the default for almost everything in this course, including every talking-head lesson.</span></div>
  <div class="kv"><span class="k">High angle (góc cao)</span><span class="v">Camera above, looking down. Makes the subject read as smaller, more vulnerable, less in control — use it on purpose, not by accident because your tripod happened to be tall.</span></div>
  <div class="kv"><span class="k">Low angle (góc thấp)</span><span class="v">Camera below, looking up. Makes the subject read as larger, more powerful, sometimes threatening.</span></div>
  <div class="kv"><span class="k">Top-down (từ trên xuống)</span><span class="v">Straight down from above — not about power at all, it is the practical angle for keyboard close-ups, a desk setup, or a notebook being written on.</span></div>
  <div class="kv"><span class="k">Dutch tilt / nghiêng</span><span class="v">Same position, camera ROLLED around the lens axis so the horizon sits at an angle. Signals unease or disorientation. Use rarely — it reads as a mistake in a normal talking-head shot.</span></div>
</div>
<p>Tie this back to the interview example from Lesson 7.1: the main MCU of your classmate answering questions should be eye level — you are equals in a conversation, not interrogating them from above. A single top-down cutaway of their notes being written is a practical B-roll choice, not a power statement. A low-angle shot of the same person would feel strange and out of place in a friendly campus interview — save low angle for when you actually want someone to look imposing.</p>

<h3>Focal length: the real millimeter numbers on your gear</h3>
${slide('cr-07', 5, 'Tiêu cự tương đương — đồ nghề của bạn')}
<p><strong>Focal length</strong> (tiêu cự) — given here as its 35mm-equivalent number, the standard way to compare lenses of different physical sizes — controls how wide or narrow the camera's field of view is. A smaller mm number sees a wider slice of the world; a bigger number "reaches" further into a narrower slice. Your own kit spans a huge range:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">iPhone 16 Pro Max — Ultra Wide</span><span class="v">13mm, f/2.2. Widest angle you own — a full room, a whole desk setup, a establishing shot in a small space.</span></div>
  <div class="kv"><span class="k">Osmo Pocket 3 — fixed lens</span><span class="v">20mm, f/2.0. Close to a natural, slightly-wide view — the default lens for most of this course's vlogging and talking-head shots.</span></div>
  <div class="kv"><span class="k">iPhone 16 Pro Max — main (1×)</span><span class="v">24mm, f/1.78. The closest to how a human eye reads a scene — the safest default for a talking head shot on iPhone.</span></div>
  <div class="kv"><span class="k">iPhone 16 Pro Max — 5× telephoto</span><span class="v">120mm, f/2.8. "Reaches" across a room to frame a tight shot without walking closer — and compresses the background, making it look closer to the subject than it really is.</span></div>
</div>

<h3>The distortion myth: it is the DISTANCE, not the lens</h3>
${slide('cr-07', 6, 'Méo mặt là do KHOẢNG CÁCH, không phải ống rộng')}
<p>Here is the beginner mistake this lesson exists to fix: you mount your phone on the Ultra Wide 13mm lens close to your face — maybe 25 to 30cm away — because it "fits everything in." The result: your nose looks noticeably larger than the rest of your face, your face itself looks subtly warped near the edges. The common explanation — "wide lenses distort faces" — is not quite right, and getting it right matters because the fix is completely different depending on which explanation you believe.</p>
<p>What is actually happening: your nose is much closer to the lens than your ears are. At 30cm to the nose and roughly 42cm to the ears (a head is roughly 12cm deep), the ratio between those two distances is large — the nose ends up rendered about 40% bigger than the ears, because closer things always appear bigger, for ANY lens, at ANY focal length. Step back to 2 metres and use the 120mm telephoto to reframe the same close shot, and the nose-to-ear distance ratio shrinks to about 200cm vs 212cm — only a 6% difference, which reads as completely normal. The wide lens did not cause the distortion; standing close enough that a wide lens was NEEDED to fit the shot is what caused it. A telephoto lens used from close range would distort a face exactly the same way — you simply cannot get a telephoto lens close enough to a face to prove it, which is why this misconception persists.</p>
<div class="callout warn"><p><strong>The same physics explains telephoto "compression":</strong> a 120mm shot from far away does not literally squeeze the background — it is showing you a narrow slice of a scene where foreground and background objects are, proportionally, closer in distance to each other than they were to a wide lens standing right next to the subject. The visual effect ("compression") is real; the cause is still distance, not a lens doing something magical.</p></div>

<h3>What this means for your actual shots</h3>
<p>For a talking-head shot, default to the iPhone's main 24mm lens or the Pocket 3's 20mm — both close enough to a natural eye view that you can sit at a normal, comfortable arm's-length-plus distance (60–90cm) without distortion. Reach for the 13mm Ultra Wide only for establishing shots or tight spaces where nothing important sits close to the frame edge — a wide desk setup, a small dorm room. If you must vlog selfie-style holding the phone at arm's length with the Ultra Wide because that is the only way to fit the shot, know that some nose enlargement is the tradeoff you are making, not a defect in your camera.</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — blaming the lens and buying a "better" one.</strong> A more expensive wide lens will distort a close face exactly the same amount, because the distortion is arithmetic, not glass quality. The fix that actually works is distance: back up and zoom (digitally or with the telephoto), or switch to the main/Pocket 3 lens and sit a bit further away.</p></div>

<p class="note-ct"><strong>Next:</strong> Lesson 7.3 takes these sizes, angles and focal lengths and puts them to work inside the frame itself — the rule of thirds, headroom, lead room, and the safe zone every vertical video needs.</p>

<h3>🎬 Practice (20 minutes)</h3>
<div class="callout ok"><ol>
<li>Shoot your own face with the Ultra Wide (13mm) lens from about 30cm away. Look at the result on a real screen, not the phone's own preview.</li>
<li>Step back to about 2 metres, switch to the 5× telephoto (120mm), and reframe the same close shot.</li>
<li>Compare the two side by side. Write one sentence describing what changed about your nose and the background.</li>
</ol><p><strong>Done when:</strong> you can explain, without looking back at this lesson, why the close shot distorted and the far shot did not — using the word "distance," not "lens."</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Camera angle</span><span class="v">Góc máy — the vertical position the camera shoots from relative to the subject: eye level, high, low, top-down, or tilted.</span></div>
  <div class="kv"><span class="k">Focal length</span><span class="v">Tiêu cự — given as a 35mm-equivalent number; controls how wide or narrow the field of view is.</span></div>
  <div class="kv"><span class="k">Perspective distortion</span><span class="v">Méo phối cảnh — objects closer to the lens appearing disproportionately larger; caused by distance to subject, not the lens itself.</span></div>
  <div class="kv"><span class="k">Compression (telephoto)</span><span class="v">Nén hậu cảnh — background appearing closer to the subject in a telephoto shot from far away; also a distance effect, not lens magic.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Five camera angles — eye level, high, low, top-down, Dutch tilt — each change what a shot means, not just what it shows.</li>
<li>Your real gear: iPhone Ultra Wide 13mm f/2.2, Pocket 3 fixed 20mm f/2.0, iPhone main 24mm f/1.78, iPhone 5× telephoto 120mm f/2.8.</li>
<li>Face distortion up close is caused by DISTANCE (nose much closer to the lens than ears), not by "wide lenses distorting" — any lens distorts a face at the same close distance.</li>
<li>Default to 20–24mm for talking heads; reserve the 13mm Ultra Wide for establishing shots and tight rooms, not close selfie-style faces.</li>
</ul>
<div class="link-card"><a href="https://www.dji.com/osmo-pocket-3/specs" target="_blank" rel="noopener">DJI — Osmo Pocket 3 official specs (fixed 20mm-equivalent lens)</a></div>
<div class="link-card"><a href="https://support.apple.com/en-us/121032" target="_blank" rel="noopener">Apple — iPhone 16 Pro Max tech specs (three rear lenses)</a></div>
<div class="link-card"><a href="https://fstoppers.com/architecture/how-lens-compression-and-perspective-distortion-work-251737" target="_blank" rel="noopener">Fstoppers — how lens compression and perspective distortion actually work</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2</span>
<h2>Cùng cỡ cảnh, cùng chủ thể, cùng ánh sáng — đổi góc máy là đổi hẳn Ý NGHĨA của cú máy</h2>
<p class="lead">Bài 7.1 chọn bao nhiêu phần chủ thể nằm trong khung. Bài này chọn hai thứ đổi hẳn mọi điều còn lại của cú máy đó: chĩa máy TỪ ĐÂU (góc máy), và ống kính "vươn" xa tới đâu (tiêu cự) — kèm một lỗi người mới hay mắc khiến gần như mọi talking head kiểu tự quay cận mặt trông hơi sai, và vì sao điều đó chẳng liên quan gì tới việc ống kính "tệ".</p>

<h3>Năm góc máy, năm mối quan hệ khác nhau với chủ thể</h3>
${slide('cr-07', 4, 'Góc máy — cùng một người, năm cách nhìn')}
<div class="kv-grid">
  <div class="kv"><span class="k">Ngang tầm mắt</span><span class="v">Máy đặt đúng chiều cao mắt chủ thể. Trung lập, gần gũi — mặc định cho gần như mọi thứ trong khoá này, kể cả mọi bài giảng talking-head.</span></div>
  <div class="kv"><span class="k">Góc cao</span><span class="v">Máy ở trên, nhìn xuống. Khiến chủ thể trông nhỏ hơn, dễ tổn thương hơn, kém kiểm soát hơn — dùng có chủ đích, đừng dùng do vô tình vì chân máy của bạn cao sẵn.</span></div>
  <div class="kv"><span class="k">Góc thấp</span><span class="v">Máy ở dưới, nhìn lên. Khiến chủ thể trông to lớn hơn, quyền lực hơn, đôi khi đe doạ.</span></div>
  <div class="kv"><span class="k">Top-down (từ trên xuống)</span><span class="v">Thẳng từ trên xuống — không liên quan gì tới quyền lực, đây là góc thực dụng cho cận cảnh bàn phím, một góc bàn làm việc, hay một cuốn vở đang được viết.</span></div>
  <div class="kv"><span class="k">Nghiêng (Dutch tilt)</span><span class="v">Cùng vị trí, máy XOAY quanh trục ống kính để chân trời nằm nghiêng. Báo hiệu bất an hoặc mất phương hướng. Dùng hiếm khi — trong một talking-head bình thường nó đọc như một lỗi.</span></div>
</div>
<p>Nối lại với ví dụ phỏng vấn ở Bài 7.1: cỡ MCU chính của bạn học đang trả lời câu hỏi nên là ngang tầm mắt — hai bạn là ngang hàng trong một cuộc trò chuyện, không phải bạn đang "thẩm vấn" họ từ trên xuống. Một cutaway top-down của vở ghi chép đang được viết là lựa chọn B-roll thực dụng, không phải một tuyên bố về quyền lực. Một cú máy góc thấp cho cùng người đó sẽ lạ lùng và lạc quẻ trong một buổi phỏng vấn bạn học thân thiện — để dành góc thấp cho lúc bạn thật sự muốn ai đó trông áp đảo.</p>

<h3>Tiêu cự: đúng con số milimet trên đồ nghề của bạn</h3>
${slide('cr-07', 5, 'Tiêu cự tương đương — đồ nghề của bạn')}
<p><strong>Tiêu cự (focal length)</strong> — ghi ở đây theo số tương đương máy phim 35mm, cách chuẩn để so ống kính khác kích thước vật lý — quyết định góc nhìn của máy rộng hay hẹp. Số mm càng nhỏ, thấy càng nhiều thế giới; số càng lớn "vươn" càng xa vào một lát cắt càng hẹp. Đồ nghề của chính bạn trải dài một khoảng rất rộng:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">iPhone 16 Pro Max — Ultra Wide</span><span class="v">13mm, f/2.2. Góc rộng nhất bạn có — cả một căn phòng, cả một góc bàn học, một cảnh thiết lập trong không gian nhỏ.</span></div>
  <div class="kv"><span class="k">Osmo Pocket 3 — ống cố định</span><span class="v">20mm, f/2.0. Gần với góc nhìn tự nhiên, hơi rộng — ống mặc định cho hầu hết cảnh vlog và talking-head của khoá này.</span></div>
  <div class="kv"><span class="k">iPhone 16 Pro Max — chính (1×)</span><span class="v">24mm, f/1.78. Gần nhất với cách mắt người đọc một cảnh — mặc định an toàn nhất cho một cú talking-head trên iPhone.</span></div>
  <div class="kv"><span class="k">iPhone 16 Pro Max — tele 5×</span><span class="v">120mm, f/2.8. "Vươn" ngang một căn phòng để lấy một khung hẹp mà không cần bước lại gần — và nén hậu cảnh, khiến nó trông gần chủ thể hơn thực tế.</span></div>
</div>

<h3>Lời đồn về méo hình: là do KHOẢNG CÁCH, không phải ống kính</h3>
${slide('cr-07', 6, 'Méo mặt là do KHOẢNG CÁCH, không phải ống rộng')}
<p>Đây là lỗi người mới hay mắc mà bài này sinh ra để sửa: bạn gắn điện thoại ở ống Ultra Wide 13mm gần sát mặt mình — có khi chỉ 25 tới 30cm — vì nó "lấy được hết mọi thứ vào khung." Kết quả: mũi bạn trông to hơn hẳn phần còn lại của khuôn mặt, chính khuôn mặt cũng hơi méo ở gần mép. Lời giải thích thường gặp — "ống kính rộng làm méo mặt" — không hẳn đúng, và hiểu đúng chỗ này quan trọng vì cách sửa hoàn toàn khác nhau tuỳ bạn tin lời giải thích nào.</p>
<p>Điều thật sự xảy ra: mũi bạn gần ống kính hơn tai bạn rất nhiều. Ở khoảng cách 30cm tới mũi và khoảng 42cm tới tai (một cái đầu dày khoảng 12cm), tỉ lệ giữa hai khoảng cách đó lớn — mũi bị hiện ra to hơn tai khoảng 40%, vì vật gần luôn trông to hơn, với BẤT KỲ ống kính nào, ở BẤT KỲ tiêu cự nào. Lùi ra 2 mét và dùng ống tele 120mm để lấy lại đúng khung cận đó, tỉ lệ khoảng cách mũi-so-tai co lại còn khoảng 200cm so với 212cm — chỉ chênh 6%, trông hoàn toàn bình thường. Ống rộng không gây ra méo hình; việc đứng đủ gần tới mức CẦN một ống rộng để lấy đủ khung mới là nguyên nhân. Một ống tele nếu đặt ở khoảng cách gần tương tự cũng sẽ làm méo mặt y hệt — chỉ là bạn không thể đưa ống tele lại gần mặt tới mức đó để chứng minh, đó là lý do lời đồn này vẫn tồn tại.</p>
<div class="callout warn"><p><strong>Cùng vật lý đó giải thích "nén hậu cảnh" của ống tele:</strong> một cú máy 120mm từ xa không thật sự "ép" hậu cảnh lại — nó chỉ cho bạn thấy một lát cắt hẹp của cảnh, nơi vật thể tiền cảnh và hậu cảnh, XÉT VỀ TỈ LỆ, gần nhau hơn so với khi một ống rộng đứng sát ngay cạnh chủ thể. Hiệu ứng thị giác ("nén") là có thật; nguyên nhân vẫn là khoảng cách, không phải ống kính làm phép màu gì cả.</p></div>

<h3>Điều này nghĩa là gì cho cảnh quay thật của bạn</h3>
<p>Với một cú talking-head, mặc định dùng ống chính 24mm của iPhone hoặc ống 20mm của Pocket 3 — cả hai đủ gần với góc nhìn tự nhiên để bạn ngồi ở khoảng cách bình thường, thoải mái (60–90cm) mà không méo hình. Chỉ lấy ống Ultra Wide 13mm cho cảnh thiết lập hoặc phòng chật, nơi không có gì quan trọng nằm sát mép khung. Nếu bắt buộc phải vlog kiểu tự cầm máy giơ tay bằng ống Ultra Wide vì đó là cách duy nhất lấy đủ khung, hãy biết rằng mũi hơi to hơn là cái giá bạn đang trả, không phải lỗi của máy quay.</p>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — đổ lỗi cho ống kính rồi mua một cái "xịn hơn".</strong> Một ống rộng đắt tiền hơn vẫn sẽ làm méo một khuôn mặt ở cự ly gần y hệt, vì méo hình là phép tính số học, không phải chất lượng kính. Cách sửa thật sự là khoảng cách: lùi ra rồi zoom (số hoặc bằng ống tele), hoặc chuyển sang ống chính/Pocket 3 và ngồi xa thêm một chút.</p></div>

<p class="note-ct"><strong>Bài tiếp theo:</strong> Bài 7.3 đem cỡ cảnh, góc máy và tiêu cự này vào làm việc thật bên trong khung hình — quy tắc 1/3, khoảng trống đầu, khoảng nhìn, và vùng an toàn mà mọi video dọc đều cần.</p>

<h3>🎬 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
<li>Quay chính mặt bạn bằng ống Ultra Wide (13mm) từ khoảng 30cm. Xem kết quả trên một màn hình thật, không phải khung xem trước bé xíu của điện thoại.</li>
<li>Lùi ra khoảng 2 mét, chuyển sang ống tele 5× (120mm), và lấy lại đúng khung cận đó.</li>
<li>So sánh hai cảnh cạnh nhau. Viết một câu mô tả điều gì đổi ở mũi bạn và ở hậu cảnh.</li>
</ol><p><strong>Đạt khi:</strong> bạn giải thích được, không cần xem lại bài này, vì sao cảnh cận bị méo còn cảnh xa thì không — dùng đúng từ "khoảng cách", không phải "ống kính".</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Góc máy</span><span class="v">Camera angle — vị trí theo chiều dọc mà máy quay từ đó, so với chủ thể: ngang tầm mắt, cao, thấp, top-down, hoặc nghiêng.</span></div>
  <div class="kv"><span class="k">Tiêu cự</span><span class="v">Focal length — ghi theo số tương đương máy phim 35mm; quyết định góc nhìn rộng hay hẹp.</span></div>
  <div class="kv"><span class="k">Méo phối cảnh</span><span class="v">Perspective distortion — vật gần ống kính hơn hiện ra to không cân xứng; do khoảng cách tới chủ thể, không phải do bản thân ống kính.</span></div>
  <div class="kv"><span class="k">Nén hậu cảnh (tele)</span><span class="v">Compression — hậu cảnh trông gần chủ thể hơn trong một cú tele từ xa; cũng là hiệu ứng khoảng cách, không phải phép màu của ống kính.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Năm góc máy — ngang tầm mắt, cao, thấp, top-down, Dutch tilt — mỗi góc đổi Ý NGHĨA của cú máy, không chỉ đổi những gì hiện ra.</li>
<li>Đồ nghề thật của bạn: iPhone Ultra Wide 13mm f/2.2, Pocket 3 cố định 20mm f/2.0, iPhone chính 24mm f/1.78, iPhone tele 5× 120mm f/2.8.</li>
<li>Méo mặt khi quay gần là do KHOẢNG CÁCH (mũi gần ống kính hơn tai rất nhiều), không phải do "ống rộng làm méo" — bất kỳ ống nào cũng méo mặt ở cùng khoảng cách gần đó.</li>
<li>Mặc định 20–24mm cho talking head; để dành Ultra Wide 13mm cho cảnh thiết lập và phòng chật, không phải cho mặt cận kiểu selfie.</li>
</ul>
<div class="link-card"><a href="https://www.dji.com/osmo-pocket-3/specs" target="_blank" rel="noopener">DJI — thông số chính thức Osmo Pocket 3 (ống cố định tương đương 20mm)</a></div>
<div class="link-card"><a href="https://support.apple.com/en-us/121032" target="_blank" rel="noopener">Apple — thông số kỹ thuật iPhone 16 Pro Max (ba ống kính sau)</a></div>
<div class="link-card"><a href="https://fstoppers.com/architecture/how-lens-compression-and-perspective-distortion-work-251737" target="_blank" rel="noopener">Fstoppers — nén hình và méo phối cảnh thật sự hoạt động thế nào</a></div>
</div>
`,
    },

    /* ─────────────────── 7.3 bố cục ─────────────────── */
    {
      title: '7.3 — Composition: thirds, depth and the vertical safe zone|||7.3 — Bố cục: quy tắc 1/3, chiều sâu và vùng an toàn video dọc',
      slug: 'cr-07-3-bo-cuc',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Quy tắc 1/3, khoảng trống đầu, khoảng nhìn, đặt giữa, thêm chiều sâu cho khung phẳng, và vùng an toàn 9:16 cho TikTok/Reels/Shorts — kèm cách tự kiểm vì con số không có nguồn chính thức.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.3</span>
<h2>A perfectly exposed, perfectly focused shot can still look "wrong" — and composition is almost always why</h2>
<p class="lead">Composition is simply deciding WHERE inside the rectangle things go. Get exposure and focus right and a badly composed shot still feels off to a viewer who could not tell you why. This lesson gives you the four placement rules that fix almost every "something feels off" shot, plus the one number in this whole chapter you should NOT trust blindly: the vertical safe zone.</p>

<h3>The rule of thirds and headroom</h3>
${slide('cr-07', 7, 'Quy tắc 1/3 & khoảng trống đầu')}
<p>Imagine the frame divided into a 3×3 grid. The <strong>rule of thirds</strong> says: put your subject's eyes near one of the four points where the lines cross, not dead center and not randomly placed. For a talking head, that usually means the eyes sit close to the UPPER third line. <strong>Headroom</strong> (khoảng trống đầu) is the space between the top of the subject's head and the top edge of the frame — too much and the person looks like they are sinking; too little and the top of their head feels cramped or even clipped. Getting the eyes on the upper-third line and getting headroom right are, in practice, the same adjustment — which is why the illustration above shows both problems side by side with the same fix.</p>

<h3>Lead room (looking room)</h3>
${slide('cr-07', 8, 'Khoảng nhìn & đặt giữa')}
<p><strong>Lead room</strong> (khoảng nhìn), sometimes called looking room, is the empty space left in the direction a subject is looking or facing. If someone is angled slightly toward the right side of the frame, leave more room on their right than their left — cramming them against the edge they are facing feels claustrophobic, like the frame itself is pushing them out.</p>

<h3>When centering is actually correct</h3>
<p>Every rule above has an exception, and this is the big one: a huge share of YouTube tutorials and talking-head channels place the subject dead center, symmetrically, with a plain background. That is not a mistake — for a SOLO subject with nothing else competing for attention in the frame, centering reads as confident and clean, and it means the subject stays framed correctly even if a platform crops the edges slightly differently on different devices. Centering becomes wrong only when it happens BY ACCIDENT — when there was no reason for it, and it leaves the frame lopsided or wastes space that should have gone to a second subject or an on-screen graphic.</p>

<h3>Depth: making a flat rectangle feel like a real space</h3>
${slide('cr-07', 9, 'Thêm chiều sâu cho khung hình phẳng')}
<p>A camera captures a flat image, but you can still suggest depth inside it. Put something soft and out-of-focus in the FOREGROUND (a plant, a keyboard edge, a cup), keep your subject sharp in the MIDGROUND, and let something small move gently in the BACKGROUND — that alone turns a flat frame into a layered one. <strong>Frame-in-frame</strong> means shooting through a natural edge — a doorway, a bookshelf gap, an open laptop screen — which draws the eye straight to your subject. Chapter 8 covers lighting setups in depth, but the short version here: a clean background with two or three meaningful objects and one small decorative light behind you does more for depth than any filter.</p>

<h3>The vertical 9:16 safe zone — the one number in this chapter you should NOT trust blindly</h3>
${slide('cr-07', 10, 'Vùng an toàn cho video dọc 9:16')}
<p>TikTok, Reels and YouTube Shorts all stack their own interface on top of your video: a caption/account block in the bottom-left, an engagement rail (like, comment, share) on the right, and sometimes a bar at the top. Text or a call-to-action placed where that interface sits gets covered.</p>
<div class="callout warn"><p><strong>Be honest about what is verified here:</strong> unlike the focal-length numbers earlier in this chapter, none of these three platforms publishes an official pixel spec for their safe zone, and their interfaces change over time. Treat any specific percentage — including the illustration above — as an ESTIMATE, not a guaranteed number.</p></div>
<p>The only way to actually know is to check yourself: export a short test clip with a grid overlay marking your intended safe area (CapCut and DaVinci Resolve can both add a simple guide grid), post it unlisted or as a draft, and open it in the real app on an actual phone to see exactly what gets covered on the device your audience will actually use.</p>

<h3>Composing for a coding desk setup</h3>
<p>Tie this together with the setup you will actually film in most: a desk with your laptop screen. Frame the laptop screen slightly off-center using the rule of thirds rather than dead center if you are also in frame; let the edge of your keyboard sit softly out of focus in the foreground; keep a decorative light in the background rather than a bare wall. If the video is going out as a vertical short, keep your face and any text well clear of the bottom third and the right edge — that is where TikTok and Reels stack their own interface.</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — composing only for 16:9, then cropping to 9:16 afterward.</strong> A shot framed perfectly for a horizontal export can lose the subject's head entirely, or end up with a caption sitting right over their mouth, once it is cropped to a vertical short. If the same footage is going to both a long video AND a short, frame it PROTECTIVELY from the start — keep the subject centered enough, and keep text far enough from the edges, that both crops still work.</p></div>

<p class="note-ct"><strong>Next:</strong> Lesson 7.4 takes these single-frame rules and extends them across TIME — how to move the camera with a reason, and the continuity rules that keep multiple shots of the same scene from confusing your viewer when you cut between them.</p>

<h3>🎬 Practice (20–30 minutes)</h3>
<div class="callout ok"><ol>
<li>Shoot your normal talking-head setup three ways: eyes dead-center with excess headroom, eyes cramped near the top edge, and eyes on the upper-third line with correct headroom.</li>
<li>If you plan to post short-form video, export one test clip with a grid overlay marking an estimated safe zone, and view it in the actual TikTok, Reels or Shorts app on a phone.</li>
<li>Note down, in one sentence, what (if anything) got covered by the app's own interface.</li>
</ol><p><strong>Done when:</strong> you can point to your own "correct" clip and explain, without looking back at this lesson, why it is the one that should stay in your shot list template — and you have actually checked one real app's interface on a real phone, not just guessed.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Rule of thirds</span><span class="v">Quy tắc 1/3 — placing key points of interest near the intersections of a 3×3 grid instead of dead center.</span></div>
  <div class="kv"><span class="k">Headroom</span><span class="v">Khoảng trống đầu — the space between the top of the subject's head and the top edge of the frame.</span></div>
  <div class="kv"><span class="k">Lead room / looking room</span><span class="v">Khoảng nhìn — empty space left in the direction a subject is facing or looking.</span></div>
  <div class="kv"><span class="k">Frame-in-frame</span><span class="v">Khung trong khung — shooting through a natural edge (doorway, shelf, screen) to draw the eye to the subject.</span></div>
  <div class="kv"><span class="k">Safe zone</span><span class="v">Vùng an toàn — the part of a vertical frame not covered by a platform's own on-screen interface; unofficial and platform-dependent, always verify yourself.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Rule of thirds + headroom: eyes near the upper-third line, not dead center, not cramped against the top edge.</li>
<li>Lead room: leave space in the direction a subject is looking or facing, unless they are looking straight at the camera.</li>
<li>Centering is correct for a solo subject with a plain background — it is wrong only when it happens by accident.</li>
<li>Add depth with foreground/midground/background layering and frame-in-frame; keep the background clean with 2–3 meaningful objects.</li>
<li>The 9:16 safe zone has no official numbers — treat any figure as an estimate and verify with a real test clip on a real phone before you shoot a whole video around it.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.3</span>
<h2>Một cú máy phơi sáng chuẩn, lấy nét chuẩn vẫn có thể trông "sai" — và bố cục gần như luôn là lý do</h2>
<p class="lead">Bố cục đơn giản là quyết định MỌI THỨ nằm ở ĐÂU bên trong hình chữ nhật. Phơi sáng và lấy nét đúng hết mà bố cục tệ thì người xem vẫn thấy có gì đó không ổn, dù họ không nói được vì sao. Bài này cho bạn bốn quy tắc đặt vị trí sửa được gần như mọi cú máy "cảm giác sai sai", cộng đúng một con số trong cả chương này bạn KHÔNG nên tin mù quáng: vùng an toàn video dọc.</p>

<h3>Quy tắc 1/3 và khoảng trống đầu</h3>
${slide('cr-07', 7, 'Quy tắc 1/3 & khoảng trống đầu')}
<p>Tưởng tượng khung hình chia thành lưới 3×3. <strong>Quy tắc 1/3</strong> nói: đặt mắt chủ thể gần một trong bốn điểm giao của các đường lưới, không phải chính giữa và không phải đặt tuỳ tiện. Với một talking head, thường nghĩa là mắt nằm gần đường 1/3 TRÊN. <strong>Khoảng trống đầu (headroom)</strong> là khoảng cách giữa đỉnh đầu chủ thể và mép trên khung hình — dư quá nhiều thì người trông như đang "chìm" xuống; thiếu quá thì đỉnh đầu trông chật chội, thậm chí bị cắt. Đặt mắt lên đường 1/3 trên và đặt đúng khoảng trống đầu, trên thực tế, là CÙNG một điều chỉnh — đó là lý do hình minh hoạ trên đặt cả hai lỗi cạnh nhau với cùng một cách sửa.</p>

<h3>Khoảng nhìn (lead room)</h3>
${slide('cr-07', 8, 'Khoảng nhìn & đặt giữa')}
<p><strong>Khoảng nhìn (lead room)</strong>, đôi khi gọi looking room, là khoảng trống chừa lại ở hướng chủ thể đang nhìn hoặc quay mặt tới. Nếu ai đó hơi nghiêng về phía bên phải khung, hãy chừa nhiều khoảng trống bên phải hơn bên trái — nhét họ sát mép bên họ đang hướng tới tạo cảm giác bức bối, như thể chính khung hình đang đẩy họ ra ngoài.</p>

<h3>Khi nào đặt giữa mới thật sự đúng</h3>
<p>Mọi quy tắc trên đều có ngoại lệ, và đây là ngoại lệ lớn nhất: rất nhiều kênh dạy học và talking-head trên YouTube đặt chủ thể chính giữa, đối xứng, với nền trơn. Đó không phải lỗi — với một chủ thể ĐƠN LẺ, không có gì khác tranh sự chú ý trong khung, đặt giữa đọc lên như tự tin và gọn gàng, và nó giữ chủ thể luôn đúng khung ngay cả khi nền tảng crop mép hình hơi khác nhau trên từng thiết bị. Đặt giữa chỉ SAI khi nó xảy ra DO VÔ TÌNH — khi không có lý do gì cho nó, và nó để khung hình lệch lạc hoặc lãng phí khoảng trống lẽ ra nên dành cho một chủ thể thứ hai hay một đồ hoạ trên màn hình.</p>

<h3>Chiều sâu: biến hình chữ nhật phẳng thành một không gian thật</h3>
${slide('cr-07', 9, 'Thêm chiều sâu cho khung hình phẳng')}
<p>Máy quay ghi lại một hình ảnh phẳng, nhưng bạn vẫn gợi được chiều sâu bên trong nó. Đặt gì đó mềm mại, mờ nét ở TIỀN CẢNH (một chậu cây, mép bàn phím, một cái cốc), giữ chủ thể nét ở TRUNG CẢNH, và để gì đó nhỏ chuyển động nhẹ ở HẬU CẢNH — chỉ vậy thôi cũng biến một khung phẳng thành khung nhiều lớp. <strong>Khung trong khung</strong> nghĩa là quay qua một viền tự nhiên — khung cửa, khe kệ sách, một màn hình laptop đang mở — dẫn mắt người xem thẳng vào chủ thể. Chương 8 sẽ nói kỹ cách bố trí ánh sáng, nhưng gọn lại ở đây: một nền gọn với hai ba vật có ý nghĩa và một đèn trang trí nhỏ phía sau làm được nhiều cho chiều sâu hơn bất kỳ bộ lọc nào.</p>

<h3>Vùng an toàn video dọc 9:16 — con số DUY NHẤT trong chương này bạn không nên tin mù quáng</h3>
${slide('cr-07', 10, 'Vùng an toàn cho video dọc 9:16')}
<p>TikTok, Reels và YouTube Shorts đều xếp chồng giao diện riêng của họ lên video bạn: khối chú thích/tên tài khoản ở góc dưới-trái, một dải nút tương tác (thích, bình luận, chia sẻ) ở bên phải, và đôi khi một thanh ở trên cùng. Chữ hoặc lời kêu gọi hành động (CTA) đặt đúng chỗ giao diện đó nằm sẽ bị che mất.</p>
<div class="callout warn"><p><strong>Thành thật về điều gì đã kiểm được ở đây:</strong> khác với các con số tiêu cự ở phần trước của chương này, không nền tảng nào trong ba nền tảng trên công bố thông số pixel chính thức cho vùng an toàn, và giao diện của họ đổi theo thời gian. Coi mọi con số phần trăm cụ thể — kể cả hình minh hoạ ở trên — là ƯỚC LƯỢNG, không phải con số đảm bảo.</p></div>
<p>Cách duy nhất để biết thật sự là tự kiểm: xuất một clip thử ngắn có lưới đánh dấu vùng an toàn dự kiến (CapCut và DaVinci Resolve đều thêm được lưới hướng dẫn đơn giản), đăng ở chế độ riêng tư hoặc bản nháp, rồi mở đúng app thật trên một điện thoại thật để xem chính xác chỗ nào bị che trên thiết bị khán giả của bạn thật sự dùng.</p>

<h3>Bố cục cho góc bàn học lập trình</h3>
<p>Gộp mọi thứ lại với bối cảnh bạn sẽ quay nhiều nhất: một cái bàn với màn hình laptop. Đặt màn hình laptop hơi lệch tâm theo quy tắc 1/3 thay vì chính giữa nếu bạn cũng có mặt trong khung; để mép bàn phím mờ nhẹ ở tiền cảnh; giữ một đèn trang trí ở hậu cảnh thay vì một bức tường trơn. Nếu video sẽ ra dưới dạng short dọc, giữ mặt bạn và mọi dòng chữ tránh xa phần ba dưới và mép phải — đúng chỗ TikTok và Reels xếp giao diện của họ.</p>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — chỉ bố cục cho 16:9 rồi crop sang 9:16 sau.</strong> Một cú máy đóng khung hoàn hảo cho xuất bản ngang có thể mất trọn đỉnh đầu chủ thể, hoặc chữ chú thích đè ngay lên miệng họ, một khi bị crop sang short dọc. Nếu cùng một cảnh quay sẽ ra CẢ video dài LẪN video ngắn, hãy đóng khung PHÒNG THỦ ngay từ đầu — giữ chủ thể đủ ở giữa, và chữ đủ xa mép, để cả hai kiểu crop đều dùng được.</p></div>

<p class="note-ct"><strong>Bài tiếp theo:</strong> Bài 7.4 đem các quy tắc trong MỘT khung hình này mở rộng ra theo THỜI GIAN — cách di chuyển máy có lý do, và các luật liên tục giữ cho nhiều shot của cùng một cảnh không làm người xem lạc lối khi bạn cắt giữa chúng.</p>

<h3>🎬 Thực hành (20–30 phút)</h3>
<div class="callout ok"><ol>
<li>Quay góc talking-head bình thường của bạn theo ba cách: mắt chính giữa dư khoảng đầu, mắt chật sát mép trên, và mắt ở đường 1/3 trên với khoảng đầu đúng.</li>
<li>Nếu định đăng video ngắn, xuất một clip thử có lưới đánh dấu vùng an toàn ước lượng, và xem nó trong đúng app TikTok, Reels hoặc Shorts trên một điện thoại thật.</li>
<li>Ghi lại, trong một câu, có gì (nếu có) bị giao diện của app che mất.</li>
</ol><p><strong>Đạt khi:</strong> bạn chỉ được clip "đúng" của chính mình và giải thích được, không cần xem lại bài này, vì sao đó là clip nên giữ lại làm mẫu cho shot list — và bạn đã thật sự kiểm một app thật trên điện thoại thật, không chỉ đoán.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Quy tắc 1/3</span><span class="v">Rule of thirds — đặt điểm quan trọng gần các giao điểm của lưới 3×3 thay vì chính giữa.</span></div>
  <div class="kv"><span class="k">Khoảng trống đầu</span><span class="v">Headroom — khoảng cách giữa đỉnh đầu chủ thể và mép trên khung hình.</span></div>
  <div class="kv"><span class="k">Khoảng nhìn</span><span class="v">Lead room / looking room — khoảng trống chừa lại ở hướng chủ thể đang quay mặt hoặc nhìn tới.</span></div>
  <div class="kv"><span class="k">Khung trong khung</span><span class="v">Frame-in-frame — quay qua một viền tự nhiên (khung cửa, kệ sách, màn hình) để dẫn mắt vào chủ thể.</span></div>
  <div class="kv"><span class="k">Vùng an toàn</span><span class="v">Safe zone — phần của khung dọc không bị giao diện riêng của nền tảng che; không chính thức và tuỳ nền tảng, luôn tự kiểm lại.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Quy tắc 1/3 + khoảng trống đầu: mắt gần đường 1/3 trên, không chính giữa, không chật sát mép trên.</li>
<li>Khoảng nhìn: chừa khoảng trống ở hướng chủ thể đang nhìn hoặc quay mặt tới, trừ khi họ nhìn thẳng vào máy.</li>
<li>Đặt giữa là đúng cho một chủ thể đơn lẻ với nền trơn — nó chỉ sai khi xảy ra do vô tình.</li>
<li>Thêm chiều sâu bằng lớp tiền-trung-hậu cảnh và khung trong khung; giữ nền gọn với 2–3 vật có ý nghĩa.</li>
<li>Vùng an toàn 9:16 không có con số chính thức — coi mọi con số là ước lượng và tự kiểm bằng một clip thử thật trên điện thoại thật trước khi quay cả video theo nó.</li>
</ul>
</div>
`,
    },

    /* ─────────────────── 7.4 chuyển động máy & liên tục ─────────────────── */
    {
      title: '7.4 — Camera movement & continuity between cuts|||7.4 — Chuyển động máy & liên tục giữa các cú cắt',
      slug: 'cr-07-4-chuyen-dong-may-lien-tuc',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Pan/tilt/push/pull/track/orbit có động cơ, ba chế độ gimbal Pocket 3, quy tắc 180° trục hành động, quy tắc 30°, khớp hướng nhìn, cắt theo hành động và liên tục đồ vật/quần áo/ánh sáng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.4</span>
<h2>A still shot teaches a moment. Movement teaches the RELATIONSHIP between moments — if it has a reason to exist</h2>
<p class="lead">Everything so far in this chapter composed one frame. This lesson does two things: moves the camera on purpose, and makes sure that when you CUT between shots of the same scene, the viewer's mental map of who is where never breaks. Both matter for the exact same reason — Chapter 4's coverage only pays off in the edit if the shots you cut between actually cut together cleanly.</p>

<h3>Six moves, one question before each: what is this FOR?</h3>
${slide('cr-07', 11, 'Chuyển động máy — phải có động cơ')}
<div class="kv-grid">
  <div class="kv"><span class="k">Pan</span><span class="v">Camera stays in place, rotates left-right. Follows a subject moving sideways, or reveals something outside the original frame.</span></div>
  <div class="kv"><span class="k">Tilt</span><span class="v">Camera stays in place, rotates up-down. Follows a subject standing up or sitting down, or reveals height (a tall building, a tall shelf).</span></div>
  <div class="kv"><span class="k">Push-in</span><span class="v">Camera physically moves closer, widening to tighter framing. Pulls the viewer into an emotional beat — used sparingly, it lands hard.</span></div>
  <div class="kv"><span class="k">Pull-out</span><span class="v">Camera physically moves away, tight framing widening. Reveals context the viewer did not have — often used to end a scene.</span></div>
  <div class="kv"><span class="k">Track</span><span class="v">Camera moves sideways, parallel to a moving subject, staying the same distance from them the whole time. "Walking alongside" a subject.</span></div>
  <div class="kv"><span class="k">Orbit</span><span class="v">Camera moves in an arc around a subject, distance staying constant. Reveals a space or object from multiple sides in one continuous move.</span></div>
</div>
<p><strong>Motivated movement</strong> means every one of these has a reason tied to the story, not just "because the gimbal can do it." Push in when the story is reaching its point, not on a random sentence. Track alongside someone walking to campus, not while they are sitting still at a desk. Movement with no reason reads as restless, not cinematic — a still shot, held with confidence, often communicates more.</p>

<h3>Pocket 3's gimbal modes, matched to these six moves</h3>
<p>Chapter 6.1 already verified Pocket 3's three gimbal modes against DJI's own documentation — reusing those names here rather than re-checking them:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Follow (default)</span><span class="v">The gimbal follows your hand movement smoothly. Right for pans while walking, and for track shots alongside a subject — it is the mode this course defaults to for nearly everything.</span></div>
  <div class="kv"><span class="k">Tilt Locked</span><span class="v">Keeps the horizon level even as your hand bobs up and down. Useful for a steady push-in or pull-out while you are walking, where you do not want the vertical framing drifting.</span></div>
  <div class="kv"><span class="k">FPV</span><span class="v">The least stabilized mode, moves more freely with the camera body. Save it for a specific energetic reveal, not everyday shooting — it is the mode most likely to look shaky if you did not mean it to.</span></div>
</div>

<h3>The 180° rule — not the same "180°" from Lesson 5.2</h3>
${slide('cr-07', 12, 'Quy tắc 180° — trục hành động khi DỰNG PHIM')}
<div class="callout danger"><p><strong>Do not confuse this with the shutter rule from Lesson 5.2.</strong> That 180° is about shutter speed (double your frame rate). This 180° is about camera placement during editing — same two words, completely unrelated ideas.</p></div>
<p>Draw an imaginary line — the <strong>axis of action</strong> — through the scene: between two people talking, or between you and whatever you are filming. The rule: keep every camera on the SAME side of that line for the whole scene. Cross it mid-scene without meaning to, and two people who were facing each other suddenly both seem to face the same direction, or appear to have swapped sides of the frame — genuinely disorienting to a viewer, even if they cannot say exactly why the cut feels wrong.</p>
<p>Tie this to the lecture-hall interview from Lesson 7.1: if you are filming with two cameras at once (an A-cam on your classmate, a B-cam wider on both of you — Chapter 10 covers this setup), both cameras need to sit on the same side of the imaginary line between the two of you before you press record. Decide the axis once, out loud if it helps ("the line runs along the row of seats"), and do not move a camera to the other side mid-conversation.</p>

<h3>The 30° rule — the fix for a same-subject jump cut</h3>
${slide('cr-07', 13, 'Quy tắc 30° & liên tục giữa các cú cắt')}
<p>The <strong>30° rule</strong> says: when you cut between two shots of the same subject, change the camera angle by at least 30 degrees. Cut between two shots that are too similar in angle and size, and the subject appears to visibly "pop" or jump in place — the same jump cut problem Chapter 4 warned about, caused this time by camera position instead of missing B-roll.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Eyeline match</span><span class="v">If a subject looks screen-left in one shot, they must keep looking screen-left in every following shot of the same moment — flip it and the viewer loses track of who is looking at what.</span></div>
  <div class="kv"><span class="k">Cut on action</span><span class="v">Cut exactly while a hand is mid-motion reaching for a keyboard, not while everything is still — the cut "hides" inside the movement, and the eye barely registers it.</span></div>
  <div class="kv"><span class="k">Continuity</span><span class="v">Props, clothing, the water level in a cup, the light outside a window — all need to match between takes of the same scene, even if you filmed them minutes apart.</span></div>
</div>
<p>Back to the interview: if your classmate's coffee cup is half full in the wide shot and completely full in the close-up filmed five minutes later, viewers will not consciously clock "continuity error" — but something will feel subtly wrong. The fix costs nothing: glance at the frame before every new take and match what was there in the previous one.</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — moving the B-cam mid-scene "for a better angle" without checking the axis.</strong> Halfway through the lecture-hall interview, you move the second camera to the other side of the row for a more interesting angle — and forget it just crossed the line. In the edit, cutting between the two cameras makes your classmate appear to switch which side of the frame they are on, and their eyeline flips. The angle genuinely was more interesting; it is unusable anyway, because it broke the axis.</p></div>

<p class="note-ct"><strong>Chapter complete.</strong> Chapter 8 moves from where things sit and move in the frame to how light shapes them — natural light, three-point lighting, and a real budget desk setup for the room you already have.</p>

<h3>🎬 Practice (20–30 minutes)</h3>
<div class="callout ok"><ol>
<li>Film a two-person mock interview at a desk with two phones or cameras, both positioned on the same side of the line between the two people.</li>
<li>During the same take, do one motivated push-in (at a real point of emphasis, not randomly) and one pan following a hand gesture.</li>
<li>Cut a short sequence in any editor using both cameras' footage. Check: does anyone appear to flip sides or reverse their eyeline?</li>
</ol><p><strong>Done when:</strong> your cut sequence has at least one deliberate camera move and no axis-crossing errors — and you can point to the exact moment you decided where the line was, before you started filming.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Motivated movement</span><span class="v">Camera movement tied to a reason in the story, not movement for its own sake.</span></div>
  <div class="kv"><span class="k">Axis of action (180° rule)</span><span class="v">Trục hành động — the imaginary line through a scene that every camera should stay on the same side of.</span></div>
  <div class="kv"><span class="k">30° rule</span><span class="v">Change the camera angle at least 30° between two shots of the same subject to avoid a jump cut.</span></div>
  <div class="kv"><span class="k">Continuity</span><span class="v">Liên tục — props, clothing and lighting matching between takes of the same scene.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Six moves — pan, tilt, push-in, pull-out, track, orbit — each should answer "what is this for," not just "the gimbal can do it."</li>
<li>Pocket 3: Follow for most pans/tracks, Tilt Locked for a steady push while walking, FPV only for a specific energetic reveal.</li>
<li>The 180° axis-of-action rule (editing) is unrelated to the 180° shutter rule (Lesson 5.2) — keep every camera on one side of the line through a scene.</li>
<li>The 30° rule, eyeline match, cut on action and continuity of props/clothes/light are what make Chapter 4's coverage actually cut together cleanly.</li>
</ul>
<div class="link-card"><a href="https://www.studiobinder.com/blog/what-is-the-180-degree-rule-film/" target="_blank" rel="noopener">StudioBinder — what the 180-degree rule (axis of action) is, and when to break it</a></div>
<div class="link-card"><a href="https://en.wikipedia.org/wiki/30-degree_rule" target="_blank" rel="noopener">Wikipedia — the 30-degree rule in continuity editing</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.4</span>
<h2>Một cú máy tĩnh dạy về một khoảnh khắc. Chuyển động dạy về MỐI QUAN HỆ giữa các khoảnh khắc — nếu nó có lý do để tồn tại</h2>
<p class="lead">Mọi thứ trong chương này từ đầu tới giờ đã đóng khung MỘT khung hình. Bài này làm hai việc: di chuyển máy có chủ đích, và đảm bảo khi bạn CẮT giữa các shot của cùng một cảnh, bản đồ trong đầu người xem về ai đang ở đâu không bao giờ vỡ. Cả hai quan trọng vì đúng một lý do — coverage của Chương 4 chỉ đáng giá lúc dựng nếu các shot bạn cắt qua lại thật sự ăn khớp với nhau.</p>

<h3>Sáu kiểu chuyển động, một câu hỏi trước mỗi lần: nó ĐỂ LÀM GÌ?</h3>
${slide('cr-07', 11, 'Chuyển động máy — phải có động cơ')}
<div class="kv-grid">
  <div class="kv"><span class="k">Pan</span><span class="v">Máy đứng yên, xoay trái-phải. Theo một chủ thể di chuyển ngang, hoặc hé lộ thứ gì đó ngoài khung ban đầu.</span></div>
  <div class="kv"><span class="k">Tilt</span><span class="v">Máy đứng yên, xoay lên-xuống. Theo một chủ thể đứng dậy hoặc ngồi xuống, hoặc hé lộ chiều cao (một toà nhà cao, một kệ cao).</span></div>
  <div class="kv"><span class="k">Push-in</span><span class="v">Máy di chuyển vật lý lại gần, từ khung rộng thành khung chặt. Kéo người xem vào một nhịp cảm xúc — dùng tiết chế thì rất "đắt".</span></div>
  <div class="kv"><span class="k">Pull-out</span><span class="v">Máy di chuyển vật lý ra xa, khung chặt nới rộng ra. Hé lộ bối cảnh người xem chưa có — hay dùng để kết một cảnh.</span></div>
  <div class="kv"><span class="k">Track</span><span class="v">Máy trượt ngang, song song một chủ thể đang di chuyển, giữ nguyên khoảng cách suốt lúc đó. "Đi bộ cùng" chủ thể.</span></div>
  <div class="kv"><span class="k">Orbit</span><span class="v">Máy di chuyển theo vòng cung quanh chủ thể, khoảng cách không đổi. Hé lộ một không gian hoặc vật thể từ nhiều phía trong một chuyển động liên tục.</span></div>
</div>
<p><strong>Chuyển động có động cơ (motivated)</strong> nghĩa là mỗi kiểu trên đều có lý do gắn với câu chuyện, không chỉ vì "gimbal làm được." Push-in đúng lúc câu chuyện lên tới điểm nhấn, không phải ở một câu ngẫu nhiên. Track song song ai đó đang đi bộ tới trường, không phải lúc họ đang ngồi yên ở bàn. Chuyển động không lý do đọc lên như bồn chồn, không phải "điện ảnh" — một cú máy tĩnh, giữ vững tự tin, nhiều khi truyền tải nhiều hơn.</p>

<h3>Các chế độ gimbal của Pocket 3, khớp với sáu kiểu chuyển động này</h3>
<p>Bài 6.1 đã kiểm ba chế độ gimbal của Pocket 3 đối chiếu với tài liệu chính thức của DJI — dùng lại đúng tên ở đây thay vì kiểm lại:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Follow (mặc định)</span><span class="v">Gimbal theo chuyển động tay bạn mượt mà. Đúng cho pan lúc đi bộ, và cho track song song một chủ thể — đây là chế độ khoá học này mặc định cho gần như mọi thứ.</span></div>
  <div class="kv"><span class="k">Tilt Locked</span><span class="v">Giữ chân trời luôn ngang dù tay bạn nhấp nhô lên xuống. Hữu ích cho một cú push-in/pull-out vững vàng trong lúc đi bộ, nơi bạn không muốn khung dọc bị trôi.</span></div>
  <div class="kv"><span class="k">FPV</span><span class="v">Chế độ ổn định KÉM nhất, di chuyển tự do hơn theo thân máy. Để dành cho một lý do hé lộ đầy năng lượng cụ thể, không phải quay hàng ngày — đây là chế độ dễ trông rung lắc nhất nếu bạn không cố ý muốn vậy.</span></div>
</div>

<h3>Quy tắc 180° — không phải "180°" giống ở Bài 5.2</h3>
${slide('cr-07', 12, 'Quy tắc 180° — trục hành động khi DỰNG PHIM')}
<div class="callout danger"><p><strong>Đừng nhầm với quy tắc màn trập ở Bài 5.2.</strong> 180° đó nói về tốc độ màn trập (gấp đôi frame rate). 180° này nói về vị trí máy quay lúc dựng — cùng hai chữ, hai ý hoàn toàn không liên quan.</p></div>
<p>Vẽ một đường tưởng tượng — <strong>trục hành động (axis of action)</strong> — xuyên qua cảnh: giữa hai người đang nói chuyện, hoặc giữa bạn và bất cứ thứ gì bạn đang quay. Quy tắc: giữ mọi máy quay ở CÙNG một phía của đường đó suốt cả cảnh. Vượt trục giữa cảnh mà không cố ý, hai người vốn đang quay mặt vào nhau bỗng như cùng quay về một hướng, hoặc như đã đổi chỗ trong khung — thật sự gây rối cho người xem, dù họ không nói được chính xác vì sao cú cắt lại thấy sai.</p>
<p>Nối lại với buổi phỏng vấn ở giảng đường tại Bài 7.1: nếu bạn quay bằng hai máy cùng lúc (A-cam nhắm bạn học, B-cam rộng hơn lấy cả hai — Chương 10 nói kỹ cách bố trí này), cả hai máy cần nằm cùng một phía của đường tưởng tượng giữa hai bạn TRƯỚC khi bấm quay. Quyết định trục một lần, nói to ra nếu cần ("trục chạy dọc theo hàng ghế"), và đừng dời một máy sang phía đối diện giữa lúc trò chuyện.</p>

<h3>Quy tắc 30° — cách sửa jump cut của cùng một chủ thể</h3>
${slide('cr-07', 13, 'Quy tắc 30° & liên tục giữa các cú cắt')}
<p><strong>Quy tắc 30°</strong> nói: khi cắt giữa hai shot của cùng một chủ thể, đổi góc máy ít nhất 30 độ. Cắt giữa hai shot quá giống nhau về góc và cỡ, chủ thể sẽ trông như "giật" hoặc nhảy tại chỗ — đúng vấn đề jump cut Chương 4 đã cảnh báo, lần này do vị trí máy quay thay vì thiếu B-roll.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Khớp hướng nhìn (eyeline match)</span><span class="v">Nếu chủ thể nhìn sang trái khung ở một shot, họ phải tiếp tục nhìn sang trái khung ở mọi shot tiếp theo của cùng khoảnh khắc — đảo ngược là người xem mất dấu ai đang nhìn cái gì.</span></div>
  <div class="kv"><span class="k">Cắt theo hành động</span><span class="v">Cắt đúng lúc một bàn tay đang giữa chừng vươn tới bàn phím, không phải lúc mọi thứ đứng yên — cú cắt "trốn" trong chuyển động, mắt hầu như không nhận ra.</span></div>
  <div class="kv"><span class="k">Liên tục (continuity)</span><span class="v">Đồ vật, quần áo, mức nước trong cốc, ánh sáng ngoài cửa sổ — tất cả phải khớp giữa các take của cùng một cảnh, kể cả khi bạn quay chúng cách nhau vài phút.</span></div>
</div>
<p>Quay lại buổi phỏng vấn: nếu cốc cà phê của bạn học còn nửa cốc ở toàn cảnh mà đầy ắp ở cận cảnh quay năm phút sau, người xem sẽ không ý thức được "lỗi liên tục" — nhưng sẽ cảm thấy có gì đó không ổn. Cách sửa không tốn gì: liếc qua khung hình trước mỗi take mới và khớp lại với những gì đã có ở take trước.</p>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — dời B-cam giữa cảnh "để lấy góc đẹp hơn" mà không kiểm trục.</strong> Giữa buổi phỏng vấn ở giảng đường, bạn dời máy thứ hai sang phía đối diện hàng ghế để có góc thú vị hơn — và quên rằng nó vừa vượt trục. Lúc dựng, cắt giữa hai máy khiến bạn học như đổi hẳn phía trong khung, và hướng nhìn của họ đảo ngược. Góc đó thật sự thú vị hơn; nhưng vẫn không dùng được, vì nó đã phá vỡ trục.</p></div>

<p class="note-ct"><strong>Hết chương.</strong> Chương 8 chuyển từ chuyện mọi thứ nằm ở đâu và di chuyển thế nào trong khung sang chuyện ánh sáng định hình chúng ra sao — ánh sáng tự nhiên, kiểu sáng ba điểm, và một góc quay bàn học ngân sách thấp cho đúng căn phòng bạn đang có.</p>

<h3>🎬 Thực hành (20–30 phút)</h3>
<div class="callout ok"><ol>
<li>Quay một buổi "phỏng vấn giả lập" hai người ở bàn bằng hai điện thoại hoặc máy quay, cả hai đặt cùng một phía của đường tưởng tượng giữa hai người.</li>
<li>Trong cùng một take, làm một cú push-in có động cơ (đúng lúc thật sự nhấn mạnh, không ngẫu nhiên) và một cú pan theo một cử chỉ tay.</li>
<li>Dựng một đoạn ngắn bằng phần mềm bất kỳ dùng cả hai máy. Kiểm: có ai trông như đổi phía trong khung hoặc đảo hướng nhìn không?</li>
</ol><p><strong>Đạt khi:</strong> đoạn dựng của bạn có ít nhất một lần di chuyển máy có chủ đích và không lỗi vượt trục — và bạn chỉ được chính xác lúc nào bạn đã quyết định trục nằm ở đâu, trước khi bắt đầu quay.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Chuyển động có động cơ</span><span class="v">Motivated movement — chuyển động máy gắn với một lý do trong câu chuyện, không phải chuyển động vì chính nó.</span></div>
  <div class="kv"><span class="k">Trục hành động (quy tắc 180°)</span><span class="v">Axis of action — đường tưởng tượng xuyên qua một cảnh mà mọi máy quay nên đứng cùng một phía.</span></div>
  <div class="kv"><span class="k">Quy tắc 30°</span><span class="v">Đổi góc máy ít nhất 30° giữa hai shot của cùng một chủ thể để tránh jump cut.</span></div>
  <div class="kv"><span class="k">Liên tục</span><span class="v">Continuity — đồ vật, quần áo và ánh sáng khớp nhau giữa các take của cùng một cảnh.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Sáu kiểu chuyển động — pan, tilt, push-in, pull-out, track, orbit — mỗi kiểu nên trả lời được "để làm gì", không chỉ "vì gimbal làm được".</li>
<li>Pocket 3: Follow cho hầu hết pan/track, Tilt Locked cho một cú push vững vàng lúc đi bộ, FPV chỉ dùng cho một lý do hé lộ đầy năng lượng cụ thể.</li>
<li>Quy tắc 180° trục hành động (dựng phim) không liên quan tới quy tắc 180° màn trập (Bài 5.2) — giữ mọi máy quay cùng một phía của trục xuyên qua một cảnh.</li>
<li>Quy tắc 30°, khớp hướng nhìn, cắt theo hành động và liên tục đồ vật/quần áo/ánh sáng là thứ khiến coverage của Chương 4 thật sự ăn khớp khi cắt.</li>
</ul>
<div class="link-card"><a href="https://www.studiobinder.com/blog/what-is-the-180-degree-rule-film/" target="_blank" rel="noopener">StudioBinder — quy tắc 180° (trục hành động) là gì, và khi nào nên phá lệ</a></div>
<div class="link-card"><a href="https://en.wikipedia.org/wiki/30-degree_rule" target="_blank" rel="noopener">Wikipedia — quy tắc 30° trong dựng phim liên tục</a></div>
</div>
`,
    },

    /* ─────────────────── 7.5 quiz ─────────────────── */
    {
      title: '7.5 — Chapter 7 check|||7.5 — Kiểm tra chương 7',
      slug: 'cr-07-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu tình huống về cỡ cảnh, góc máy, tiêu cự, bố cục trong khung, vùng an toàn 9:16, chuyển động máy và luật liên tục khi dựng.',
      content: `
<div class="ml-en">
<p class="lead">Ten scenario questions covering shot sizes, camera angle and focal length, in-frame composition, the vertical safe zone, camera movement and continuity from this chapter.</p>
<h3>Chapter 7 in five checkable habits</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Choosing a shot</span><span class="v">Did you pick a size on purpose — MS/MCU for talking, ECU/CU for detail, WS/EWS to establish a place (7.1)?</span></div>
  <div class="kv"><span class="k">Before a close talking-head shot</span><span class="v">Are you on the main/Pocket 3 lens at a normal distance, not the Ultra Wide pressed close to your face (7.2)?</span></div>
  <div class="kv"><span class="k">Framing</span><span class="v">Eyes near the upper-third line, correct headroom, lead room toward where the subject looks (7.3)?</span></div>
  <div class="kv"><span class="k">Before a multi-camera scene</span><span class="v">Have you decided the axis of action, and kept every camera on one side of it (7.4)?</span></div>
  <div class="kv"><span class="k">Between takes</span><span class="v">Do props, clothing and lighting still match what was in frame the take before (7.4)?</span></div>
</div>
<p class="note-ct">If you get a question wrong, the mistake it describes is exactly the mistake this chapter exists to prevent — go back to that lesson's Pitfall box and re-read it.</p>
</div>
<div class="ml-vi">
<p class="lead">Mười câu tình huống về cỡ cảnh, góc máy và tiêu cự, bố cục trong khung, vùng an toàn 9:16, chuyển động máy và luật liên tục của chương này.</p>
<h3>Chương 7 trong năm thói quen tự kiểm được</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Chọn một shot</span><span class="v">Đã chọn cỡ cảnh có chủ đích chưa — MS/MCU khi nói, ECU/CU cho chi tiết, WS/EWS để thiết lập nơi chốn (7.1)?</span></div>
  <div class="kv"><span class="k">Trước một cú talking-head cận</span><span class="v">Đang dùng ống chính/Pocket 3 ở khoảng cách bình thường, không phải Ultra Wide ép sát mặt (7.2)?</span></div>
  <div class="kv"><span class="k">Đóng khung</span><span class="v">Mắt gần đường 1/3 trên, khoảng đầu đúng, khoảng nhìn chừa về hướng chủ thể nhìn tới (7.3)?</span></div>
  <div class="kv"><span class="k">Trước một cảnh nhiều máy</span><span class="v">Đã quyết định trục hành động chưa, và giữ mọi máy cùng một phía (7.4)?</span></div>
  <div class="kv"><span class="k">Giữa các take</span><span class="v">Đồ vật, quần áo và ánh sáng còn khớp với take trước không (7.4)?</span></div>
</div>
<p class="note-ct">Sai câu nào thì lỗi câu đó mô tả đúng lỗi mà cả chương này sinh ra để chữa — quay lại khối Bẫy của đúng bài đó và đọc lại.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'Cường is filming himself explaining a coding concept, talking straight to camera for the whole clip with no cutaways. Which shot size should he default to?|||Cường quay chính mình giải thích một khái niệm lập trình, nói thẳng vào máy suốt cả clip, không có cutaway nào. Anh nên mặc định cỡ cảnh nào?',
            options: ['ECU|||ECU', 'MS or MCU|||MS hoặc MCU', 'EWS|||EWS', 'Top-down only|||Chỉ top-down'],
            correctIndex: 1,
            points: 1,
            explanation: 'MS/MCU is the standard talking-head default — close enough to read the face clearly, loose enough that hand gestures or a laptop on the desk are not cut off. ECU is too tight for a full explanation, EWS is for establishing a place, and "top-down only" is not a talking angle at all.|||MS/MCU là mặc định chuẩn cho talking head — đủ gần để đọc rõ mặt, đủ rộng để cử chỉ tay hay laptop trên bàn không bị cắt mất. ECU quá chật cho một lời giải thích trọn vẹn, EWS dùng để thiết lập nơi chốn, còn "chỉ top-down" thì không phải góc để nói chuyện.',
          },
          {
            question: 'Cường wants a quick insert shot of a terminal full of red error text for B-roll. Which size fits best?|||Cường muốn một cú insert nhanh về terminal đầy lỗi đỏ để làm B-roll. Cỡ nào hợp nhất?',
            options: ['ECU or CU|||ECU hoặc CU', 'WS|||WS', 'MWS (cowboy)|||MWS (cowboy)', 'EWS|||EWS'],
            correctIndex: 0,
            points: 1,
            explanation: 'Close detail shots (ECU/CU) read instantly at any point in a cut and need no headroom/lead-room planning — exactly why they make fast, forgiving B-roll. The wider sizes are for establishing a place or fitting two people, not a screen detail.|||Cận cảnh đặc tả (ECU/CU) đọc được ngay lập tức ở bất kỳ chỗ nào trong bản dựng và không cần tính khoảng đầu/khoảng nhìn — đúng lý do chúng làm B-roll nhanh, dễ dùng. Các cỡ rộng hơn dùng để thiết lập nơi chốn hoặc lấy đủ hai người, không phải chi tiết màn hình.',
          },
          {
            question: 'Cường holds his phone on the 13mm Ultra Wide lens about 25cm from his own face to "fit everything in" for a selfie-style vlog. His nose looks noticeably larger than the rest of his face. What actually caused this?|||Cường giơ điện thoại ở ống Ultra Wide 13mm cách mặt mình khoảng 25cm để "lấy hết mọi thứ vào khung" cho một vlog kiểu selfie. Mũi anh trông to hơn hẳn phần còn lại khuôn mặt. Điều gì thật sự gây ra chuyện này?',
            options: [
              'The Ultra Wide lens is defective|||Ống Ultra Wide bị lỗi',
              'iOS applies an automatic beauty filter that exaggerates noses|||iOS tự áp bộ lọc làm đẹp làm phóng đại mũi',
              'The distance — the nose is much closer to the lens than the ears, and any lens distorts a face this close|||Do khoảng cách — mũi gần ống kính hơn tai rất nhiều, và bất kỳ ống nào cũng méo mặt ở cự ly gần này',
              'f/2.2 aperture is too wide for portraits|||Khẩu độ f/2.2 quá rộng cho ảnh chân dung',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'Perspective distortion is caused by distance to the subject, not the lens itself — the nose is much closer to the lens than the ears at 25cm, so it renders disproportionately larger. Any lens at that same close distance would distort the same way.|||Méo phối cảnh là do khoảng cách tới chủ thể, không phải do bản thân ống kính — ở 25cm, mũi gần ống kính hơn tai rất nhiều nên hiện ra to không cân xứng. Bất kỳ ống nào ở cùng khoảng cách gần đó cũng méo y hệt.',
          },
          {
            question: 'For a short dramatic story clip, Cường wants one character to feel powerful and imposing over another. Which camera angle helps create that?|||Cho một clip kể chuyện ngắn có kịch tính, Cường muốn một nhân vật trông quyền lực, áp đảo nhân vật kia. Góc máy nào giúp tạo cảm giác đó?',
            options: ['Low angle, looking up at them|||Góc thấp, nhìn lên họ', 'Top-down|||Top-down', 'Eye level|||Ngang tầm mắt', 'Dutch tilt only|||Chỉ nghiêng (Dutch tilt)'],
            correctIndex: 0,
            points: 1,
            explanation: 'A low angle, camera looking up, makes a subject read as larger and more powerful. Top-down and eye level are neutral/practical angles, and a Dutch tilt alone signals unease, not power specifically.|||Góc thấp, máy nhìn lên, khiến chủ thể trông to lớn và quyền lực hơn. Top-down và ngang tầm mắt là góc trung lập/thực dụng, còn nghiêng (Dutch tilt) một mình báo hiệu bất an, không riêng gì quyền lực.',
          },
          {
            question: 'Cường is in a crowded classroom and wants a tight shot of a classmate across the room without walking closer or disturbing anyone. Which lens on his iPhone 16 Pro Max fits best?|||Cường đang trong một lớp học đông người, muốn một cú máy cận một bạn học ở xa mà không cần bước lại gần hay làm phiền ai. Ống nào trên iPhone 16 Pro Max hợp nhất?',
            options: ['13mm Ultra Wide|||13mm Ultra Wide', '24mm main|||24mm ống chính', 'Digital zoom on the Ultra Wide|||Zoom số trên Ultra Wide', '120mm 5× telephoto|||Tele 5× 120mm'],
            correctIndex: 3,
            points: 1,
            explanation: 'The 120mm 5× telephoto "reaches" across a room to frame a tight shot without physically moving closer. The Ultra Wide (13mm) does the opposite — it needs you close — and digital zoom on it loses quality fast.|||Ống tele 5× 120mm "vươn" ngang một căn phòng để lấy khung cận mà không cần di chuyển lại gần. Ultra Wide (13mm) làm ngược lại — cần bạn đứng gần — và zoom số trên nó mất chất lượng rất nhanh.',
          },
          {
            question: 'In an MS talking-head shot, the subject\'s eyes sit exactly at the vertical center of the frame, leaving a large empty gap above their head. What composition problem is this?|||Trong một khung MS talking-head, mắt chủ thể nằm đúng chính giữa khung theo chiều dọc, để lại một khoảng trống lớn phía trên đầu. Đây là lỗi bố cục gì?',
            options: ['Too little lead room|||Thiếu khoảng nhìn', 'A Dutch tilt|||Một cú Dutch tilt', 'Correct centering|||Đặt giữa đúng chuẩn', 'Excess headroom — eyes too low, not on the upper-third line|||Dư khoảng trống đầu — mắt quá thấp, không nằm trên đường 1/3 trên'],
            correctIndex: 3,
            points: 1,
            explanation: 'Eyes at the vertical center push too much empty space above the head — excess headroom, the classic sign that the eyes should be moved up toward the upper-third line instead.|||Mắt ở chính giữa theo chiều dọc đẩy quá nhiều khoảng trống lên phía trên đầu — dư khoảng trống đầu, dấu hiệu kinh điển cho thấy mắt nên đưa lên gần đường 1/3 trên.',
          },
          {
            question: 'Cường shoots a lesson only in 16:9 and plans to crop it to 9:16 for TikTok afterward. When he tests the crop, the auto-generated caption bar covers the speaker\'s mouth. What is the real lesson here?|||Cường chỉ quay một bài giảng ở 16:9 và định crop sang 9:16 cho TikTok sau. Lúc thử crop, thanh phụ đề tự động che mất miệng người nói. Bài học thật sự ở đây là gì?',
            options: [
              'TikTok always covers the bottom third, no exceptions, guaranteed by their public spec|||TikTok luôn che phần ba dưới, không ngoại lệ, có công bố chính thức đảm bảo',
              'He should have used a different aspect ratio entirely, like 1:1|||Lẽ ra nên dùng hẳn tỉ lệ khác, như 1:1',
              'The safe zone has no official numbers, so footage meant for both long and short form should be framed protectively from the start|||Vùng an toàn không có số chính thức, nên cảnh quay cho cả video dài lẫn ngắn nên được đóng khung phòng thủ ngay từ đầu',
              'Captions never cause this problem — the issue must be something else|||Phụ đề không bao giờ gây ra chuyện này — vấn đề chắc chắn là do khác',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'No platform publishes an official safe-zone spec, and interfaces change — so footage that will be cropped for both long and short form needs to be framed with margin from the start, verified with a real test clip on a real phone, not assumed from an unverified rule.|||Không nền tảng nào công bố thông số vùng an toàn chính thức, và giao diện thì đổi liên tục — nên cảnh quay sẽ bị crop cho cả video dài lẫn ngắn cần được đóng khung có biên độ ngay từ đầu, kiểm bằng một clip thử thật trên điện thoại thật, không giả định từ một quy tắc chưa kiểm.',
          },
          {
            question: 'Mid-sentence, with nothing dramatic happening in the story, Cường pushes the gimbal slowly toward his own face just because the movement "looks smooth." According to this chapter, what is wrong with this?|||Giữa câu nói, không có gì kịch tính xảy ra trong câu chuyện, Cường từ từ đẩy gimbal lại gần mặt mình chỉ vì chuyển động đó "trông mượt". Theo chương này, vấn đề ở đây là gì?',
            options: [
              'Push-ins are never allowed on a Pocket 3|||Push-in không bao giờ được phép trên Pocket 3',
              'The movement has no motivation — it should be tied to a story reason, like reaching a point of emphasis|||Chuyển động không có động cơ — nó nên gắn với một lý do trong câu chuyện, như đúng lúc nhấn mạnh điểm nào đó',
              'He should have used FPV mode instead of Follow|||Lẽ ra nên dùng chế độ FPV thay vì Follow',
              'Push-ins are only valid when pulling out afterward in the same shot|||Push-in chỉ hợp lệ khi có pull-out ngay sau đó trong cùng shot',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'Motivated movement means every move should be tied to a reason in the story — a push-in lands hardest at an actual point of emphasis, not on a random sentence just because the gimbal makes it smooth.|||Chuyển động có động cơ nghĩa là mỗi lần di chuyển nên gắn với một lý do trong câu chuyện — một cú push-in "đắt" nhất khi đúng lúc nhấn mạnh thật sự, không phải ở một câu ngẫu nhiên chỉ vì gimbal làm nó mượt.',
          },
          {
            question: 'Cường films a two-person conversation with two cameras rolling at once. Midway through, he moves camera B to the opposite side of the row "for a more interesting angle," without checking anything else. In the edit, cutting between the two cameras makes the two people appear to swap sides of the frame. What happened?|||Cường quay một cuộc trò chuyện hai người bằng hai máy cùng lúc. Giữa buổi, anh dời máy B sang phía đối diện hàng ghế "để có góc thú vị hơn", không kiểm gì thêm. Lúc dựng, cắt giữa hai máy khiến hai người như đổi hẳn phía trong khung. Chuyện gì đã xảy ra?',
            options: [
              'The cameras had different frame rates|||Hai máy quay có fps khác nhau',
              'Camera B crossed the 180° axis of action, breaking the shared line both cameras should have stayed on|||Máy B đã vượt trục hành động 180°, phá vỡ đường mà cả hai máy lẽ ra phải giữ cùng một phía',
              'The 30° rule was followed too strictly|||Quy tắc 30° đã được tuân theo quá chặt',
              'This is normal and does not affect the edit|||Đây là chuyện bình thường, không ảnh hưởng gì tới bản dựng',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'This is a textbook axis-of-action violation: moving one camera to the other side of the line mid-scene makes cuts between the two cameras flip which side each person appears on and reverse their eyelines — confusing even though nothing else about the footage is wrong.|||Đây đúng là lỗi vượt trục hành động kinh điển: dời một máy sang phía đối diện của đường giữa cảnh khiến các cú cắt giữa hai máy đảo ngược phía mỗi người xuất hiện trong khung và đảo hướng nhìn của họ — gây rối dù không có gì khác trong cảnh quay bị sai.',
          },
          {
            question: 'Cutting between two shots of the same person, at almost the same angle and size, makes them appear to "pop" slightly in place even though the audio is continuous. What rule was most likely broken?|||Cắt giữa hai shot của cùng một người, gần như cùng góc và cùng cỡ cảnh, khiến họ trông như "giật" nhẹ tại chỗ dù âm thanh liền mạch. Quy tắc nào gần như chắc chắn đã bị phá vỡ?',
            options: [
              'The 30° rule — the angle change between the two shots was too small|||Quy tắc 30° — mức đổi góc giữa hai shot quá nhỏ',
              'The 180° axis-of-action rule|||Quy tắc trục hành động 180°',
              'The rule of thirds|||Quy tắc 1/3',
              'The headroom rule|||Quy tắc khoảng trống đầu',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'This is the classic 30° rule violation: cutting between two shots of the same subject that are too similar in angle produces a visible jump cut. The axis rule is about which side of a line cameras stay on, not angle change between same-subject shots.|||Đây đúng là lỗi kinh điển của quy tắc 30°: cắt giữa hai shot của cùng chủ thể quá giống nhau về góc tạo ra một jump cut thấy rõ. Quy tắc trục nói về việc máy quay đứng phía nào của một đường, không phải mức đổi góc giữa các shot cùng chủ thể.',
          },
        ],
      },
    },
  ],
};
