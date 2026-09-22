/**
 * Content Creator — Chương 10: Quay một mình như dân chuyên. Song ngữ EN/VI (.ml-en / .ml-vi).
 * ⚠️ KHÔNG backtick trần trong content (dùng &#96;); `${` trong mã mẫu viết \${ ; gạch chéo ngược viết \\
 */
import { gallery, slide } from './_slides.mjs';

export default {
  title: 'Chapter 10 — Shooting Solo Like a Pro|||Chương 10 — Quay một mình như dân chuyên',
  description: 'Không có ai cầm máy giúp bạn: dựng A-cam/B-cam quay đồng thời, quay đủ B-roll, để Pocket 3 tự bám bạn, khoá máy trước khi nói, và biết quyền của mình khi quay nơi công cộng ở Việt Nam.',
  lessons: [
    /* ─────────────────────── 10.0 slide bài giảng ─────────────────────── */
    {
      title: '10.0 — Chapter 10 in 15 slides|||10.0 — Chương 10 trong 15 slide',
      slug: 'cr-10-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Sơ đồ 2 máy A-cam/B-cam, sáu loại B-roll, tự quay một mình với ActiveTrack, và checklist ngày quay — gói cả chương vào 15 slide.',
      content: `
<div class="ml-en"><h2>📑 Chapter 10 in 15 slides</h2>
<p>Slide 3 (the two-camera top-down layout) is the one idea this whole chapter is built around: when nobody is there to run a second camera for you, you get coverage by rolling both cameras AT ONCE instead of performing the same line twice. Slides 9–10 (ActiveTrack and the "which app actually works as a monitor" table) are the two you will come back to most once you are actually alone in a room with two cameras.</p>
<p>Skim before the chapter to see the shape of it, then come back after each lesson to revise. If a slide still does not click, the lesson that teaches it sits right below.</p></div>
<div class="ml-vi"><h2>📑 Chương 10 trong 15 slide</h2>
<p>Slide 3 (sơ đồ 2 máy nhìn từ trên xuống) là ý tưởng cả chương này xoay quanh: khi không có ai cầm máy thứ hai giúp bạn, bạn có coverage bằng cách quay CẢ HAI máy CÙNG LÚC thay vì diễn lại đúng câu đó hai lần. Slide 9–10 (ActiveTrack và bảng "app nào thật sự dùng được làm màn hình xem mình") là hai slide bạn sẽ quay lại nhiều nhất khi thật sự ở một mình trong phòng với hai cái máy.</p>
<p>Lướt trước khi vào chương để thấy hình dạng cả chương, rồi quay lại sau mỗi bài để ôn. Slide nào chưa hiểu thì bài dạy nó nằm ngay bên dưới.</p></div>
${gallery('cr-10', [
  [1, 'Bìa'],
  [2, 'Bản đồ chương'],
  [3, 'Sơ đồ 2 máy A-cam/B-cam nhìn từ trên — lệch trục 30–45°'],
  [4, 'Khung hình A-cam đối chiếu B-cam'],
  [5, 'Khoá trước khi quay — AE/AF Lock, cân bằng trắng'],
  [6, 'Sáu loại B-roll'],
  [7, 'Chuỗi 5 shot B-roll cho một hành động'],
  [8, 'B-roll cho nội dung lập trình'],
  [9, 'ActiveTrack 6.0 · Face Auto-Detect · Dynamic Framing'],
  [10, 'Ba cách dùng iPad làm màn hình xem mình'],
  [11, 'Đánh dấu vị trí · chân máy mini · gậy nối'],
  [12, 'Checklist 3 cột: Trước · Trong · Sau'],
  [13, 'Quay nơi công cộng ở Việt Nam — quyền hình ảnh'],
  [14, 'Bảng tra nhanh chương 10'],
  [15, 'Thực hành'],
])}
`,
    },

    /* ─────────────────────── 10.1 ─────────────────────── */
    {
      title: '10.1 — Two cameras, one performance|||10.1 — Hai máy, một lần diễn',
      slug: 'cr-10-1-talking-head',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Dựng A-cam (iPhone) và B-cam (Pocket 3) lệch 30–45° để quay đồng thời, có coverage mà không cần diễn lại — cộng nền, ánh sáng, âm thanh và teleprompter khi không có ai giúp.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.1</span>
<h2>Nobody is holding a second camera for you — so let two cameras roll at once</h2>
<p class="lead">Lesson 4.2 taught you coverage: shoot one action from more than one size or angle so the edit always has an option. On a real crew, that means someone repositions a camera and you say the same line again. Alone, "say it again from a different angle" almost never sounds the same the second time — the energy shifts, a word changes, your hands move differently. The fix is not better acting. It is rolling two cameras at the same time, so one performance gives you two angles for free.</p>

<h3>Why two cameras, not one better one</h3>
<p>Think back to the five-shot sequence from Lesson 4.2: hands, face, wide, over-the-shoulder, an unusual angle — five sizes of the <em>same</em> action, so every cut is a big enough size change to read as deliberate instead of a jump cut. A talking-head delivery is exactly that kind of single, continuous action. You cannot pause mid-sentence, walk over, reposition a tripod, walk back, and pick up the same sentence with the same energy — so instead of chasing coverage across multiple takes, you get it across two cameras inside <strong>one</strong> take.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Alone</span><span class="lz-d">No one to run a second camera or redo a setup mid-take</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Can't safely re-take</span><span class="lz-d">A second delivery rarely matches the first in energy or wording</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Roll both at once</span><span class="lz-d">A-cam and B-cam start together, run the whole segment</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Coverage from one take</span><span class="lz-d">Two angles of the exact same words, ready to cut between</span></div>
</div>

<h3>Where each camera goes</h3>
${slide('cr-10', 3, 'Sơ đồ 2 máy A-cam/B-cam nhìn từ trên — lệch trục 30–45°')}
<p>Your gear maps onto two roles cleanly. The <strong>iPhone is A-cam</strong>: it sits dead center, lens at eye height (composition itself — where "eye height" and headroom come from — is Chapter 7's job, not repeated here), with the iPad propped directly beneath it running the Teleprompter tab from Lesson 3.4. This is the camera you actually look at; it carries the main, straight-on performance. The <strong>Pocket 3 is B-cam</strong>, placed off to one side at roughly a <strong>30–45° angle</strong> from A-cam's axis. That range is not arbitrary: much less than 30° and the two shots look almost identical, so cutting between them still risks a jump cut; much more than 45° and B-cam starts seeing your ear instead of your face. Somewhere in between gives you a genuinely different angle without losing you as the subject.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">A-cam</span><span class="v">iPhone, 0° (dead center), teleprompter iPad directly under the lens</span></div>
  <div class="kv"><span class="k">B-cam</span><span class="v">Pocket 3, 30–45° off-axis, no teleprompter — it only needs to see you, not read your script</span></div>
  <div class="kv"><span class="k">Distance / framing</span><span class="v">Set A-cam a bit tighter (MCU) and B-cam a bit wider (MWS) — different sizes, not just different angles</span></div>
</div>

<h3>Two different framings, on purpose</h3>
${slide('cr-10', 4, 'Khung hình A-cam đối chiếu B-cam')}
<p>It is not enough for the two cameras to point at different angles — Lesson 4.2's jump-cut logic still applies. If both cameras frame you at the exact same size, cutting between them at the same moment can still read as a small, distracting jump. Give them different jobs: A-cam a closer medium close-up (MCU) for the main delivery, B-cam a slightly wider medium-wide shot (MWS) that also shows your hands, your desk, the room. Now a cut between them is a real size change — clean by Lesson 4.2's own rule, not just a different angle of the same tight frame.</p>

<h3>Background, light and sound — reused, not retaught</h3>
<p>Everything behind and around you in this setup was already covered: <strong>background and composition</strong> in Chapter 7, <strong>lighting the face</strong> (key, fill, the desk-setup pattern) in Chapter 8, and <strong>getting clean audio while you are also the only person watching levels</strong> in Chapter 9. Nothing new here — just remember that a two-camera setup doubles your exposure to a bad background, because now two angles show it instead of one.</p>

<h3>Teleprompter and shooting in segments — extended for two cameras</h3>
<p>Lesson 3.4 already set you up with the iPad-under-the-lens teleprompter and the "record in segments, restart the whole sentence after a two-second pause" habit. The only change here: because both cameras start and stop together, a "segment" now means both A-cam and B-cam roll for that whole chunk, then both stop together before you set up the next one. Do not let one camera run continuously while you restart the other mid-scene — that is how the two files stop being the same performance, and Chapter 13's multicam sync depends on both cameras covering the identical span of time.</p>
<div class="callout ok"><p><strong>Tip:</strong> your eyes belong on A-cam almost the whole time — it has your teleprompter under it, and it is the camera your energy is actually aimed at. Treat B-cam the way you would treat a second person in the room you are aware of but not staring at: a natural half-turn toward it now and then is enough, you do not need to alternate eye contact between two lenses.</p></div>

<h3>Energy with no one else in the room</h3>
<p>Lesson 3.4 already covered eye line and energy for a single camera; the only thing that changes with two rolling cameras is the stakes of getting it right, since now a flat delivery gets recorded twice. If anything, having two cameras rolling should raise your energy a notch — you are no longer treating this as a "test take," because both angles are live and usable the moment you stop.</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — pressing record on A-cam, then walking over to press record on B-cam three seconds later.</strong> Those three seconds are not free. When you bring both files into DaVinci Resolve for multicam sync (Chapter 13.3), that offset has to be found and corrected — by ear, by a clap, or by timecode — before the two angles line up. If you forget to correct it, cutting to B-cam mid-sentence will visibly jump you backward or forward in time. The fix is simple and belongs in this lesson, not the edit: start BOTH cameras before you say a word, then clap once with both hands clearly in both frames — that single sound gives you an exact, unmistakable sync point in both files.</p></div>

<p class="note-ct"><strong>Next:</strong> Lesson 10.2 covers the other half of a solo shoot day — B-roll: the six kinds worth knowing by name, and a five-shot sequence you can shoot for any single action.</p>

<h3>🎬 Practice (20–30 minutes)</h3>
<div class="callout ok"><ol>
<li>Set up A-cam (iPhone, teleprompter iPad underneath) dead center and B-cam (Pocket 3) at roughly 30–45° to one side.</li>
<li>Frame A-cam as an MCU and B-cam as a wider MWS that also shows your desk.</li>
<li>Start both cameras, clap once with both hands in frame, then deliver a 45–60 second segment from your Lesson 3.4 teleprompter script.</li>
</ol><p><strong>Done when:</strong> you have two clips of the same performance, visibly different in framing size, both starting from the same clap.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">A-cam / B-cam</span><span class="v">The camera you look at and perform to (A-cam) versus the secondary angle rolling at the same time (B-cam).</span></div>
  <div class="kv"><span class="k">Simultaneous coverage</span><span class="v">Getting multiple usable angles from ONE take by rolling several cameras together, instead of repeating the take.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Alone, you cannot safely repeat a delivery for coverage — roll A-cam and B-cam at the same time instead, so one performance gives you two angles.</li>
<li>A-cam (iPhone) sits dead center with the teleprompter iPad under it; B-cam (Pocket 3) sits 30–45° off-axis.</li>
<li>Give the two cameras different framing sizes (MCU vs MWS), not just different angles, so cuts between them are clean by Lesson 4.2's own jump-cut rule.</li>
<li>Background, lighting and audio are Chapters 7–9's job, reused here — the only new risk is that two angles now show a bad background instead of one.</li>
<li>Start both cameras before you speak and clap once with both hands in frame — an unsynced start costs you real time in Chapter 13's multicam edit.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.1</span>
<h2>Không có ai cầm máy thứ hai giúp bạn — thì để hai máy cùng quay một lúc</h2>
<p class="lead">Bài 4.2 đã dạy bạn coverage: quay một hành động từ nhiều hơn một cỡ hoặc góc để lúc dựng luôn có lựa chọn. Với một ê-kíp thật, điều đó nghĩa là có người dời máy quay và bạn nói lại đúng câu đó. Một mình, "nói lại từ một góc khác" gần như không bao giờ nghe giống lần đầu — năng lượng đổi, một từ đổi, tay bạn cử động khác đi. Cách chữa không phải là diễn giỏi hơn. Đó là quay hai máy CÙNG LÚC, để một lần diễn cho bạn hai góc miễn phí.</p>

<h3>Vì sao hai máy, không phải một máy tốt hơn</h3>
<p>Nhớ lại chuỗi 5 shot ở Bài 4.2: cận tay, cận mặt, toàn cảnh, qua vai, một góc lạ — năm cỡ cảnh của CÙNG một hành động, để mọi cú cắt đổi cỡ đủ lớn để trông có chủ đích thay vì thành jump cut. Một đoạn talking head chính là đúng kiểu hành động liên tục, đơn nhất đó. Bạn không thể dừng giữa câu, đi qua, dời chân máy, đi lại, rồi nói tiếp đúng câu đó với đúng năng lượng đó — nên thay vì đuổi theo coverage qua nhiều take, bạn lấy nó qua hai máy trong đúng MỘT take.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Một mình</span><span class="lz-d">Không ai cầm máy thứ hai hay dời vị trí máy giữa take</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Không quay lại an toàn được</span><span class="lz-d">Lần diễn thứ hai hiếm khi khớp năng lượng và câu chữ với lần đầu</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Quay cả hai cùng lúc</span><span class="lz-d">A-cam và B-cam bấm quay cùng nhau, chạy hết đoạn</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Coverage từ một lần diễn</span><span class="lz-d">Hai góc của đúng cùng một câu nói, sẵn sàng để cắt qua lại</span></div>
</div>

<h3>Đặt mỗi máy ở đâu</h3>
${slide('cr-10', 3, 'Sơ đồ 2 máy A-cam/B-cam nhìn từ trên — lệch trục 30–45°')}
<p>Đồ nghề của bạn khớp gọn vào hai vai trò. <strong>iPhone là A-cam</strong>: đặt chính giữa, ống kính ngang tầm mắt (bố cục — chỗ "ngang tầm mắt" và khoảng đầu tới từ đâu — là việc của Chương 7, không nhắc lại ở đây), với iPad dựng ngay bên dưới chạy tab Nhắc lời từ Bài 3.4. Đây là máy bạn thật sự nhìn vào; nó mang lần diễn chính, chính diện. <strong>Pocket 3 là B-cam</strong>, đặt lệch sang một bên khoảng <strong>góc 30–45°</strong> so với trục của A-cam. Khoảng đó không phải chọn bừa: lệch ít hơn 30° thì hai cảnh trông gần như giống nhau, cắt giữa chúng vẫn dễ thành jump cut; lệch hơn 45° thì B-cam bắt đầu thấy tai bạn thay vì mặt bạn. Nằm giữa khoảng đó cho bạn một góc thật sự khác mà không mất bạn khỏi vai trò chủ thể.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">A-cam</span><span class="v">iPhone, 0° (chính giữa), iPad teleprompter ngay dưới ống kính</span></div>
  <div class="kv"><span class="k">B-cam</span><span class="v">Pocket 3, lệch trục 30–45°, không cần teleprompter — nó chỉ cần thấy bạn, không cần đọc kịch bản</span></div>
  <div class="kv"><span class="k">Khoảng cách / khung hình</span><span class="v">Đặt A-cam hơi gần hơn (MCU) và B-cam hơi rộng hơn (MWS) — khác cỡ, không chỉ khác góc</span></div>
</div>

<h3>Hai khung hình khác nhau, có chủ đích</h3>
${slide('cr-10', 4, 'Khung hình A-cam đối chiếu B-cam')}
<p>Hai máy chĩa hai góc khác nhau thôi chưa đủ — luật jump cut của Bài 4.2 vẫn áp dụng. Nếu cả hai máy quay bạn cùng một cỡ cảnh, cắt giữa chúng cùng một thời điểm vẫn có thể trông như một cú giật nhỏ, gây khó chịu. Giao cho chúng hai việc khác nhau: A-cam một cỡ cận trung gần hơn (MCU) cho lần diễn chính, B-cam một cỡ trung toàn rộng hơn một chút (MWS) cũng thấy được tay bạn, bàn làm việc, căn phòng. Giờ một cú cắt giữa chúng là một cú đổi cỡ thật — sạch đúng theo luật của chính Bài 4.2, không chỉ là góc khác của cùng một khung hình chật.</p>

<h3>Nền, ánh sáng và âm thanh — dùng lại, không dạy lại</h3>
<p>Mọi thứ phía sau và xung quanh bạn trong bố trí này đã được dạy rồi: <strong>nền và bố cục</strong> ở Chương 7, <strong>chiếu sáng khuôn mặt</strong> (key, fill, kiểu setup bàn làm việc) ở Chương 8, và <strong>lấy âm thanh sạch khi bạn cũng là người duy nhất canh mức thu</strong> ở Chương 9. Không có gì mới ở đây — chỉ cần nhớ rằng bố trí 2 máy nhân đôi rủi ro của một cái nền xấu, vì giờ hai góc cùng cho thấy nó thay vì một.</p>

<h3>Teleprompter và quay theo đoạn — mở rộng cho 2 máy</h3>
<p>Bài 3.4 đã dựng sẵn cho bạn teleprompter iPad dưới ống kính và thói quen "quay theo đoạn, vấp thì dừng 2 giây rồi nói lại cả câu." Thay đổi duy nhất ở đây: vì cả hai máy bấm quay và dừng cùng nhau, một "đoạn" giờ nghĩa là cả A-cam lẫn B-cam cùng chạy hết đoạn đó, rồi cùng dừng trước khi bạn dựng đoạn tiếp theo. Đừng để một máy chạy liên tục trong khi bạn dừng-quay-lại máy kia giữa cảnh — đó là cách hai file thôi còn là cùng một lần diễn, và việc đồng bộ đa máy ở Chương 13 cần cả hai máy phủ đúng cùng một khoảng thời gian.</p>
<div class="callout ok"><p><strong>Mẹo:</strong> mắt bạn nên ở A-cam gần như suốt thời gian — nó có teleprompter ngay dưới, và nó là máy năng lượng của bạn thật sự nhắm tới. Đối xử với B-cam như một người thứ hai trong phòng mà bạn biết có mặt nhưng không nhìn chằm chằm: thỉnh thoảng nghiêng người tự nhiên về phía nó là đủ, không cần đảo mắt qua lại giữa hai ống kính.</p></div>

<h3>Năng lượng khi không có ai khác trong phòng</h3>
<p>Bài 3.4 đã dạy ánh mắt và năng lượng cho một máy; thứ duy nhất đổi khi có hai máy cùng quay là mức độ quan trọng của việc làm đúng, vì giờ một lần diễn phẳng lặng bị ghi lại hai lần cùng lúc. Nếu có gì thay đổi, việc hai máy cùng chạy nên đẩy năng lượng của bạn lên một chút — bạn không còn coi đây là một "take thử," vì cả hai góc đều sống và dùng được ngay khi bạn dừng.</p>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — bấm quay A-cam, rồi đi qua bấm quay B-cam ba giây sau.</strong> Ba giây đó không miễn phí. Khi bạn mang cả hai file vào DaVinci Resolve để đồng bộ đa máy (Bài 13.3), độ lệch đó phải được tìm ra và sửa — bằng tai, bằng tiếng vỗ tay, hoặc bằng timecode — trước khi hai góc khớp nhau. Quên sửa thì cắt sang B-cam giữa câu sẽ khiến bạn nhảy ngược hoặc nhảy tới rõ rệt theo thời gian. Cách chữa đơn giản và thuộc về bài này, không phải khâu dựng: bấm quay CẢ HAI máy trước khi nói bất cứ điều gì, rồi vỗ tay một cái thật rõ với cả hai tay trong khung hình của cả hai máy — đúng một tiếng động đó cho bạn một điểm đồng bộ chính xác, không thể nhầm lẫn trong cả hai file.</p></div>

<p class="note-ct"><strong>Bài tiếp theo:</strong> Bài 10.2 nói về nửa còn lại của một ngày quay một mình — B-roll: sáu loại đáng nhớ tên, và một chuỗi 5 shot bạn có thể quay cho bất kỳ hành động đơn lẻ nào.</p>

<h3>🎬 Thực hành (20–30 phút)</h3>
<div class="callout ok"><ol>
<li>Dựng A-cam (iPhone, iPad teleprompter ngay dưới) chính giữa và B-cam (Pocket 3) lệch khoảng 30–45° sang một bên.</li>
<li>Khung A-cam thành MCU và B-cam thành MWS rộng hơn, cũng thấy được bàn làm việc.</li>
<li>Bấm quay cả hai máy, vỗ tay một cái với cả hai tay trong khung hình, rồi nói một đoạn 45–60 giây từ kịch bản teleprompter của Bài 3.4.</li>
</ol><p><strong>Đạt khi:</strong> bạn có hai clip của cùng một lần diễn, rõ ràng khác cỡ khung hình, cả hai đều bắt đầu từ cùng một tiếng vỗ tay.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">A-cam / B-cam</span><span class="v">Máy bạn nhìn vào và diễn với (A-cam) so với góc phụ đang quay cùng lúc (B-cam).</span></div>
  <div class="kv"><span class="k">Coverage đồng thời</span><span class="v">Lấy nhiều góc dùng được từ MỘT take bằng cách quay nhiều máy cùng lúc, thay vì diễn lại take đó.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một mình, bạn không thể diễn lại an toàn để lấy coverage — quay A-cam và B-cam cùng lúc thay vào đó, để một lần diễn cho hai góc.</li>
<li>A-cam (iPhone) đặt chính giữa với iPad teleprompter ngay dưới; B-cam (Pocket 3) đặt lệch trục 30–45°.</li>
<li>Cho hai máy hai cỡ khung hình khác nhau (MCU và MWS), không chỉ khác góc, để cắt giữa chúng sạch theo đúng luật jump cut của Bài 4.2.</li>
<li>Nền, ánh sáng và âm thanh là việc của Chương 7–9, dùng lại ở đây — rủi ro mới duy nhất là hai góc giờ cùng lộ một cái nền xấu thay vì một.</li>
<li>Bấm quay cả hai máy trước khi nói và vỗ tay một cái với cả hai tay trong khung — bắt đầu lệch nhịp tốn thời gian thật ở bước dựng đa máy Chương 13.</li>
</ul>
</div>
`,
    },

    /* ─────────────────────── 10.2 ─────────────────────── */
    {
      title: '10.2 — B-roll: the footage that saves your edit|||10.2 — B-roll: thước phim cứu bản dựng',
      slug: 'cr-10-2-b-roll',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Sáu loại B-roll, chuỗi 5 shot cho một hành động, và B-roll riêng cho nội dung lập trình — quay đủ để không phải quay lại.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.2</span>
<h2>B-roll is not the "extra" footage — it is what makes your edit possible</h2>
<p class="lead">Lesson 4.2 already gave you the core idea: A-roll carries the story, B-roll covers cuts and adds variety, and shooting only A-roll is the most common beginner mistake. This lesson turns that idea into a working vocabulary and a habit — six named kinds of B-roll, a five-shot sequence you can run for almost any action, and the two mistakes that quietly waste a whole shoot day.</p>

<h3>Six kinds of B-roll worth knowing by name</h3>
${slide('cr-10', 6, 'Sáu loại B-roll')}
<p>You already know two of these words from Lesson 4.2: <strong>cutaway</strong> (a shot AWAY from the main action, chemmed in between two A-roll moments) still means exactly that, and what this chapter calls "detail" is the same idea as Lesson 4.2's <strong>insert</strong> (a close-up of something that IS part of the main action). The other four give you the rest of the palette: <strong>process</strong> shots follow a step-by-step action as it happens (typing, opening an app), <strong>establishing</strong> shots set the scene with a wide view of the whole space, <strong>reaction</strong> shots show emotion on your face rather than an action, and <strong>environment</strong> shots capture the atmosphere around you — light through a window, steam off a cup, the FPTU campus outside. Six words, but really four new ones layered onto two you already had.</p>

<h3>A five-shot sequence for one action</h3>
${slide('cr-10', 7, 'Chuỗi 5 shot B-roll cho một hành động')}
<p>This is the same five-shot-sequence idea from Lesson 4.2, applied specifically to B-roll: for one action — say, debugging some code — you can walk through the same five slots and land on a genuinely different B-roll type each time. Hands on the keyboard is a <em>process</em> shot. A close insert of the actual error message on screen is a <em>detail</em> shot. Pulling back to the whole desk is <em>establishing</em>. Your face when the fix finally works is a <em>reaction</em> shot. And the sunlight moving across the room while you worked is <em>environment</em>. Five shots, five different jobs, all from one real fifteen-minute debugging session.</p>

<h3>"Shoot three times as much B-roll as you think you need"</h3>
<p>This is not a measured statistic — it is a piece of working advice you will hear from almost anyone who edits for a living, and it holds up for a simple reason: B-roll is cheap to shoot and expensive to be missing. In the edit, you will always find more places that need a cutaway than you expected — an awkward pause, a stumble you want to trim, a sentence that needs a visual instead of just your face. You can always cut B-roll OUT of a timeline that has too much of it. You cannot shoot it after the fact if the moment — the exact bug, the exact light — is already gone.</p>

<h3>A little movement beats a dead-still frame</h3>
<p>Chapter 6 already covered the Pocket 3's three gimbal modes; for B-roll specifically, lean toward a small amount of motion rather than locking the gimbal completely still. A slow push toward a detail, or Follow mode picking up the tiny natural sway of your hand as you type, reads as alive on screen. A perfectly static tripod shot is not wrong, but stack five of them in a row and the video starts to feel like a slideshow rather than footage. You do not need dramatic movement — the point is that something in the frame is quietly still happening.</p>

<h3>B-roll for programming content, specifically</h3>
${slide('cr-10', 8, 'B-roll cho nội dung lập trình')}
<p>Four shots come up constantly for coding videos. <strong>Hands on the keyboard</strong> is your most reliable process shot — real action, no need to show your face. <strong>A close-up of the screen</strong> needs one specific caution: your monitor has its own refresh rate, a completely different number from the 50Hz mains flicker Lesson 5.1 taught you to fix with fps. Matching your shutter to Vietnam's electricity does nothing for a screen refreshing at a different rate — so before you commit to a take, shoot a few test seconds of the screen and look for rolling bands; if you see them, try a different shutter speed or check your monitor's refresh-rate setting and shoot again. <strong>A diagram sketched on the iPad</strong> with the Pencil turns an abstract concept into something visual, often clearer than explaining it out loud. And <strong>real-life footage tied to the content</strong> — walking to class, sitting in the library, a cup of coffee going cold next to the keyboard — grounds a coding video in an actual person instead of just a screen.</p>
<div class="callout tip"><p><strong>Tip:</strong> shoot some B-roll deliberately generic — typing with no readable code on screen, walking with no landmark that dates the shot, a coffee cup with no text visible. That footage goes into a reusable B-roll folder you can pull from for months, instead of a one-video-only clip you will never use again (Chapter 11 covers folder structure in full — one sentence here is enough).</p></div>

<div class="pitfall co-tieu-de"><p><strong>Trap — leaving all your B-roll for the very end of the shoot.</strong> By the time you finish the talking-head segments, the bug you were debugging is already fixed, the light through the window has changed, and you are tired — so the "typing while debugging" shot you grab last is a reenactment, not the real moment, and it usually looks like one. Shoot B-roll interleaved with the moments it belongs to, while the light, the mess on your desk and your own energy still match what you filmed minutes earlier.</p></div>

<p class="note-ct"><strong>Next:</strong> Lesson 10.3 covers the harder half of shooting alone — getting the camera to track you, keep focus and let you check your own framing without anyone standing behind it.</p>

<h3>🎬 Practice (15–20 minutes)</h3>
<div class="callout ok"><ol>
<li>Pick one real action you can repeat (typing, opening a laptop, writing on paper).</li>
<li>Shoot the five-shot sequence for it: process, detail, establishing, reaction, environment.</li>
<li>Watch the five clips back to back and name each one's B-roll type out loud, without looking at your notes.</li>
</ol><p><strong>Done when:</strong> you have 5 distinct clips, each one clearly a different B-roll type, and you can name all six types from memory.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Process / establishing / reaction / environment shots</span><span class="v">Four B-roll types alongside the cutaway and insert you already know from Lesson 4.2.</span></div>
  <div class="kv"><span class="k">Reusable B-roll</span><span class="v">Generic footage — no dated text, no specific bug — saved to be used across many future videos.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Six B-roll types: process, detail (insert), establishing, cutaway, reaction, environment — four new names layered onto two you already had.</li>
<li>The five-shot sequence from Lesson 4.2 works for B-roll too — run it against one real action to land five different types.</li>
<li>"Shoot three times as much as you think you need" is working advice, not a measured number — B-roll is cheap to shoot, expensive to be missing.</li>
<li>A little movement (a slow push, natural gimbal sway) reads as more alive than a row of dead-still tripod shots.</li>
<li>For programming content: hands, a screen close-up (test for rolling bands from the monitor's own refresh rate first), iPad diagrams, and real-life shots that connect the code to an actual person.</li>
<li>Shoot B-roll interleaved with the real moment, not saved for the end of the day when the moment is already gone.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.2</span>
<h2>B-roll không phải cảnh "thêm cho có" — nó là thứ khiến bản dựng của bạn làm được</h2>
<p class="lead">Bài 4.2 đã cho bạn ý chính: A-roll dẫn chuyện, B-roll che chỗ cắt và thêm đa dạng, và chỉ quay A-roll là lỗi phổ biến nhất của người mới. Bài này biến ý đó thành một bộ từ vựng dùng được và một thói quen — sáu loại B-roll có tên, một chuỗi 5 shot bạn chạy được cho gần như mọi hành động, và hai lỗi âm thầm làm phí cả một buổi quay.</p>

<h3>Sáu loại B-roll đáng nhớ tên</h3>
${slide('cr-10', 6, 'Sáu loại B-roll')}
<p>Bạn đã biết hai trong số các từ này từ Bài 4.2: <strong>cutaway</strong> (một cú máy RA KHỎI hành động chính, chêm vào giữa hai khoảnh khắc A-roll) vẫn giữ đúng nghĩa đó, và thứ chương này gọi là "chi tiết" chính là ý của <strong>insert</strong> ở Bài 4.2 (cận cảnh một thứ VẪN nằm trong hành động chính). Bốn từ còn lại cho bạn phần còn thiếu của bảng màu: cú máy <strong>quy trình</strong> theo từng bước một hành động khi nó diễn ra (gõ phím, mở ứng dụng), cú máy <strong>bối cảnh</strong> dựng bối cảnh bằng một toàn cảnh của cả không gian, cú máy <strong>phản ứng</strong> cho thấy cảm xúc trên mặt bạn thay vì một hành động, và cú máy <strong>môi trường</strong> bắt lấy không khí xung quanh bạn — nắng qua cửa sổ, hơi nước bốc lên từ cốc, sân trường FPTU bên ngoài. Sáu từ, nhưng thật ra chỉ bốn từ mới chồng lên hai từ bạn đã có.</p>

<h3>Chuỗi 5 shot cho một hành động</h3>
${slide('cr-10', 7, 'Chuỗi 5 shot B-roll cho một hành động')}
<p>Đây chính là ý chuỗi 5 shot từ Bài 4.2, áp dụng riêng cho B-roll: với một hành động — ví dụ đang gỡ lỗi một đoạn code — bạn có thể đi qua đúng năm ô đó và mỗi lần lại rơi vào một loại B-roll thật sự khác nhau. Tay trên bàn phím là một cú <em>quy trình</em>. Cận cảnh đúng dòng thông báo lỗi trên màn hình là một cú <em>chi tiết</em>. Kéo ra toàn cảnh cả bàn làm việc là <em>bối cảnh</em>. Mặt bạn khi cuối cùng chạy đúng là một cú <em>phản ứng</em>. Và nắng di chuyển qua phòng trong lúc bạn làm việc là <em>môi trường</em>. Năm shot, năm việc khác nhau, tất cả từ đúng một buổi gỡ lỗi mười lăm phút có thật.</p>

<h3>"Quay B-roll gấp ba lần bạn nghĩ mình cần"</h3>
<p>Đây không phải một số liệu đo được — đó là một kinh nghiệm làm nghề bạn sẽ nghe từ gần như bất kỳ ai sống bằng nghề dựng phim, và nó đúng vì một lý do đơn giản: B-roll rẻ lúc quay và đắt lúc thiếu. Lúc dựng, bạn sẽ luôn thấy nhiều chỗ cần một cutaway hơn bạn tưởng — một khoảng dừng vụng về, một câu vấp muốn cắt, một câu cần hình minh hoạ thay vì chỉ mặt bạn. Bạn luôn CẮT BỚT được B-roll khỏi một timeline có quá nhiều. Bạn không quay lại được nếu khoảnh khắc đó — đúng con bug đó, đúng ánh sáng đó — đã qua rồi.</p>

<h3>Một chút chuyển động thắng một khung hình đứng chết</h3>
<p>Chương 6 đã nói về ba chế độ gimbal của Pocket 3; riêng với B-roll, hãy nghiêng về một chút chuyển động thay vì khoá gimbal đứng yên hoàn toàn. Một cú đẩy chậm vào một chi tiết, hay chế độ Follow bắt lấy độ đung đưa tự nhiên rất nhỏ của tay bạn khi gõ phím, trông sống động hơn trên màn hình. Một cảnh chân máy tĩnh hoàn toàn không sai, nhưng xếp năm cảnh như vậy liền nhau thì video bắt đầu giống một bản trình chiếu ảnh hơn là thước phim. Bạn không cần chuyển động kịch tính — điểm mấu chốt là có gì đó đang lặng lẽ diễn ra trong khung hình.</p>

<h3>B-roll riêng cho nội dung lập trình</h3>
${slide('cr-10', 8, 'B-roll cho nội dung lập trình')}
<p>Bốn cú máy xuất hiện liên tục trong video lập trình. <strong>Tay trên bàn phím</strong> là cú quy trình đáng tin nhất của bạn — hành động thật, không cần lộ mặt. <strong>Cận cảnh màn hình</strong> cần đúng một lưu ý riêng: màn hình máy tính có tần số quét RIÊNG của nó, hoàn toàn khác con số 100Hz điện lưới mà Bài 5.1 dạy bạn sửa bằng fps. Khớp màn trập theo điện Việt Nam không có tác dụng gì với một màn hình quét ở tần số khác — nên trước khi chốt một take, hãy quay thử vài giây màn hình và nhìn xem có sọc cuộn hay không; thấy sọc thì đổi tốc độ màn trập hoặc kiểm tần số quét trên màn hình rồi quay lại. <strong>Sơ đồ vẽ trên iPad</strong> bằng Pencil biến một khái niệm trừu tượng thành thứ nhìn thấy được, nhiều khi rõ hơn là chỉ nói suông. Và <strong>cảnh đời thật gắn với nội dung</strong> — đi bộ tới lớp, ngồi trong thư viện, một tách cà phê nguội dần cạnh bàn phím — gắn một video lập trình với một con người thật, thay vì chỉ là một cái màn hình.</p>
<div class="callout tip"><p><strong>Mẹo:</strong> quay có chủ đích một số B-roll thật CHUNG CHUNG — gõ phím không có dòng code nào đọc được trên màn hình, đi bộ không có mốc nào làm lộ ngày quay, một cốc cà phê không chữ. Thước phim đó vào một thư mục B-roll dùng lại được trong nhiều tháng, thay vì một clip chỉ dùng cho đúng một video rồi bỏ xó (Chương 11 nói đủ về cấu trúc thư mục — một câu ở đây là đủ).</p></div>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — để hết B-roll tới cuối buổi quay mới làm.</strong> Tới lúc xong phần talking head, con bug bạn đang gỡ đã sửa xong, ánh sáng qua cửa sổ đã đổi, và bạn đã mệt — nên cảnh "đang gõ phím gỡ lỗi" bạn quay vét cuối cùng chỉ là một cảnh tái diễn, không phải khoảnh khắc thật, và thường thì trông đúng như vậy. Quay B-roll xen kẽ ngay lúc nó thuộc về, khi ánh sáng, sự bừa bộn trên bàn và năng lượng của chính bạn còn khớp với những gì bạn đã quay vài phút trước.</p></div>

<p class="note-ct"><strong>Bài tiếp theo:</strong> Bài 10.3 nói về nửa khó hơn của việc tự quay — làm sao để máy tự bám theo bạn, tự giữ nét, và để bạn xem lại được khung hình của chính mình mà không cần ai đứng sau máy.</p>

<h3>🎬 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Chọn một hành động thật, lặp lại được (gõ phím, mở laptop, viết ra giấy).</li>
<li>Quay chuỗi 5 shot cho nó: quy trình, chi tiết, bối cảnh, phản ứng, môi trường.</li>
<li>Xem lại 5 clip liền nhau và gọi tên loại B-roll của từng clip thành tiếng, không nhìn ghi chú.</li>
</ol><p><strong>Đạt khi:</strong> bạn có 5 clip riêng biệt, mỗi clip rõ ràng thuộc một loại B-roll khác nhau, và bạn thuộc lòng được cả sáu loại.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Cú máy quy trình / bối cảnh / phản ứng / môi trường</span><span class="v">Bốn loại B-roll thêm vào cutaway và insert bạn đã biết từ Bài 4.2.</span></div>
  <div class="kv"><span class="k">B-roll dùng lại được</span><span class="v">Thước phim chung chung — không chữ có ngày tháng, không con bug cụ thể — lưu lại để dùng cho nhiều video sau này.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Sáu loại B-roll: quy trình, chi tiết (insert), bối cảnh, cutaway, phản ứng, môi trường — bốn tên mới chồng lên hai tên bạn đã có.</li>
<li>Chuỗi 5 shot từ Bài 4.2 cũng dùng được cho B-roll — chạy nó với một hành động thật để có năm loại khác nhau.</li>
<li>"Quay gấp ba lần bạn nghĩ mình cần" là kinh nghiệm nghề, không phải số liệu đo được — B-roll rẻ lúc quay, đắt lúc thiếu.</li>
<li>Một chút chuyển động (cú đẩy chậm, độ đung đưa tự nhiên của gimbal) trông sống động hơn một dãy cảnh chân máy đứng chết.</li>
<li>Với nội dung lập trình: tay, màn hình cận (thử sọc do tần số quét riêng của màn hình trước), sơ đồ trên iPad, và cảnh đời thật gắn code với một con người thật.</li>
<li>Quay B-roll xen kẽ ngay lúc thật, đừng để dồn tới cuối ngày khi khoảnh khắc đã qua.</li>
</ul>
</div>
`,
    },

    /* ─────────────────────── 10.3 ─────────────────────── */
    {
      title: '10.3 — Shooting solo: let the camera do the crew’s job|||10.3 — Tự quay một mình: để máy làm việc của cả ê-kíp',
      slug: 'cr-10-3-tu-quay-mot-minh',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'ActiveTrack 6.0 và Face Auto-Detect của Pocket 3, khoá AE/AF trên iPhone, đánh dấu vị trí đứng, và ba cách dùng iPad làm màn hình xem mình — cách nào thật, cách nào không.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.3</span>
<h2>No one is framing you, focusing you, or watching the monitor — so the gear has to</h2>
<p class="lead">On a crewed shoot, someone reframes when you drift, someone catches focus hunting to the wrong thing, someone tells you when your collar is crooked. Alone, none of that happens unless you deliberately hand each job to a piece of gear or a habit. This lesson covers four of them: the Pocket 3 tracking you automatically, locking the iPhone's exposure and focus before you start talking, marking exactly where to stand, and — the one that trips people up — which app actually turns an iPad into a monitor you can see yourself on.</p>

<h3>ActiveTrack 6.0 and Face Auto-Detect</h3>
${slide('cr-10', 9, 'ActiveTrack 6.0 · Face Auto-Detect · Dynamic Framing')}
<p>The Pocket 3's <strong>ActiveTrack 6.0</strong> (DJI's subject-tracking system, upgraded to its sixth version for this camera) combines the mechanical gimbal with a tracking algorithm: double-tap yourself on the touchscreen to start tracking, and the gimbal keeps you centered and in focus as you move — tap outside the tracking box, or press the <strong>5D Joystick</strong> (the small control stick under the screen) once, to stop. <strong>Face Auto-Detect</strong> skips the double-tap entirely: turn it on, press record, and the camera recognizes and tracks a face the moment it enters frame — DJI's own description calls this out specifically for single-person vlogging, which is exactly your use case shooting alone. A third mode, <strong>Dynamic Framing</strong>, holds you in the center (or another position you set) without the gimbal needing to physically follow your movement at all — useful when you are mostly staying in place but tend to lean or shift.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">ActiveTrack 6.0</span><span class="v">Double-tap to start, tap outside the box or press the 5D Joystick once to stop</span></div>
  <div class="kv"><span class="k">Face Auto-Detect</span><span class="v">No tap needed — tracking starts automatically when a face enters frame at the start of recording</span></div>
  <div class="kv"><span class="k">Dynamic Framing</span><span class="v">Keeps you centered/positioned without the gimbal needing to move to follow you</span></div>
</div>
<div class="callout warn"><p><strong>DJI states ActiveTrack is not available in every mode:</strong> Panorama, Low-Light Video, Slow Motion (1080P@8x / 4K@4x), Timelapse, Motionlapse and SpinShot are all excluded. If you have stacked one of those modes on top of ActiveTrack expecting it to keep tracking, it will not — switch back to a normal recording mode first.</p></div>

<h3>Locking exposure and focus before you say a word</h3>
${slide('cr-10', 5, 'Khoá trước khi quay — AE/AF Lock, cân bằng trắng')}
<p>Lesson 5.3 already introduced focus lock and warned that auto white balance or autofocus drifting mid-shot is especially dangerous when shooting alone, because no one is watching the screen to catch it. Here is the exact iPhone mechanic Apple documents for it: touch and hold the focus area on screen until you see <strong>"AE/AF Lock"</strong> (Auto Exposure / Auto Focus Lock — khoá phơi sáng và lấy nét tự động) appear above the frame, and it stays locked until you tap the screen again to release it. Combine that with <strong>Lock White Balance</strong> from Chapter 6's Settings › Camera table, and your iPhone will not silently re-expose, re-focus or shift color the moment you lean forward or a shadow crosses the frame.</p>

<h3>Marking exactly where to stand</h3>
${slide('cr-10', 11, 'Đánh dấu vị trí · chân máy mini · gậy nối')}
<p>Once you have framed a shot, a strip of tape on the floor in an X marks the exact spot your feet were standing on. Glance down for one second to reset your position instead of eyeballing it and re-shooting because you drifted six inches to the left. It costs nothing and it is the single fastest fix for "the framing looked right in take one and wrong in take four."</p>

<h3>Mini tripod and extension pole</h3>
<p>Both the Pocket 3's handle and its battery grip have a standard <strong>1/4-inch screw hole</strong> at the bottom (DJI's own guide confirms this), which is what lets you attach the official Mini Tripod accessory to set the camera down on a flat surface instead of holding it. An extension pole does the opposite job — pushing the camera farther than your own arm reaches, useful for a wider establishing shot or a higher angle you cannot get standing still.</p>

<h3>iPad as a monitor — which method is actually real</h3>
${slide('cr-10', 10, 'Ba cách dùng iPad làm màn hình xem mình')}
<p>This is where it is easy to waste twenty minutes trying something that was never going to work, so here is what is confirmed and what is not. If Pocket 3 is your camera, run <strong>DJI Mimo</strong> on the iPad (it is built for iPad, requires iPadOS 15.0 or later) and connect over Bluetooth and Wi-Fi — you get genuine HD live view, no cable. If the iPhone is your camera, <strong>Blackmagic Camera</strong>'s own remote-control feature does the job: set the iPad to be the "controller" on the same Wi-Fi network as an iPhone running the same app, and you get a live multiview plus the ability to adjust exposure and focus from the iPad. What does NOT work is Continuity Camera — that feature only turns an iPhone into a webcam FOR A MAC, it has nothing to do with watching yourself back while you shoot, and reaching for it here is a dead end.</p>
<div class="callout ok"><p><strong>Tip:</strong> pick the monitoring method that matches whichever camera is your A-cam that day — DJI Mimo when Pocket 3 leads, Blackmagic Camera's remote view when iPhone leads. You do not need both running at once.</p></div>

<h3>Shooting while walking</h3>
<p>Chapter 6 already covered the Pocket 3's Follow mode for smooth handheld movement; combined with ActiveTrack or Face Auto-Detect, walking shots become genuinely practical solo — the gimbal keeps you level and the tracking keeps you framed, so you can focus on the walk itself instead of constantly checking the screen.</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — trusting ActiveTrack for the first time in the middle of an important take.</strong> If you turn it on in Slow Motion or Low-Light mode without knowing DJI excludes those, or you simply have not tested it in the actual room you are shooting in, you will only discover the problem by watching the footage back later — too late to fix that take. Test it for ten seconds in your real recording mode, in your real room, before you commit a full segment to it.</p></div>

<p class="note-ct"><strong>Next:</strong> Lesson 10.4 turns everything from this chapter into an actual shoot day — a three-column checklist, and what your rights actually are when you point a camera at people in public in Vietnam.</p>

<h3>🎬 Practice (15–25 minutes)</h3>
<div class="callout ok"><ol>
<li>Turn on Face Auto-Detect on the Pocket 3, press record, and walk into frame from outside it — confirm tracking starts without any tap.</li>
<li>On the iPhone, touch and hold the focus area until "AE/AF Lock" appears, then move around the frame and confirm exposure and focus stay put.</li>
<li>Set up whichever monitor method matches your A-cam (DJI Mimo for Pocket 3, or Blackmagic Camera's remote view for iPhone) and confirm you can actually see your own framing on the iPad.</li>
</ol><p><strong>Done when:</strong> you have watched yourself tracked automatically, watched a lock hold through movement, and seen a live self-view on the iPad — all three, once each.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">ActiveTrack 6.0</span><span class="v">DJI's tracking system on Pocket 3 — double-tap to start, joystick or tap-outside to stop.</span></div>
  <div class="kv"><span class="k">AE/AF Lock</span><span class="v">Touch-and-hold gesture on iPhone that locks exposure and focus until you tap the screen again.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>ActiveTrack 6.0 (double-tap to start) and Face Auto-Detect (no tap, starts on record) both track you on Pocket 3 — neither works in Panorama, Low-Light Video, Slow Motion, Timelapse, Motionlapse or SpinShot.</li>
<li>Touch and hold the iPhone's focus area until "AE/AF Lock" appears, and pair it with Chapter 6's Lock White Balance, before you start talking.</li>
<li>A strip of tape marking your standing spot fixes drift between takes for free.</li>
<li>Pocket 3's handle and battery grip both carry a 1/4-inch screw hole for the official Mini Tripod.</li>
<li>DJI Mimo on iPad genuinely monitors Pocket 3; Blackmagic Camera's remote-control mode genuinely monitors an iPhone running the same app. Continuity Camera does neither — it is a Mac webcam feature only.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.3</span>
<h2>Không có ai canh khung, canh nét, hay xem màn hình giúp bạn — thì đồ nghề phải làm việc đó</h2>
<p class="lead">Trong một buổi quay có ê-kíp, có người canh lại khung khi bạn trôi vị trí, có người bắt được lúc máy lấy nét sai chỗ, có người nói cho bạn biết cổ áo đang lệch. Một mình, không có việc nào trong số đó xảy ra trừ khi bạn chủ động giao từng việc cho một món đồ nghề hoặc một thói quen. Bài này nói về bốn việc: Pocket 3 tự bám bạn, khoá phơi sáng và nét trên iPhone trước khi bắt đầu nói, đánh dấu đúng chỗ đứng, và — thứ hay làm người mới lúng túng nhất — app nào thật sự biến iPad thành màn hình bạn xem được chính mình.</p>

<h3>ActiveTrack 6.0 và Face Auto-Detect</h3>
${slide('cr-10', 9, 'ActiveTrack 6.0 · Face Auto-Detect · Dynamic Framing')}
<p><strong>ActiveTrack 6.0</strong> (hệ thống bám chủ thể của DJI, nâng lên phiên bản thứ sáu cho máy này) kết hợp gimbal cơ học với thuật toán bám theo: chạm đúp vào chính bạn trên màn hình cảm ứng để bắt đầu bám, gimbal sẽ giữ bạn ở giữa khung và trong nét khi bạn di chuyển — chạm ra ngoài khung bám, hoặc bấm <strong>5D Joystick</strong> (cần điều khiển nhỏ dưới màn hình) một lần, để dừng. <strong>Face Auto-Detect</strong> (tự nhận diện khuôn mặt) bỏ luôn bước chạm đúp: bật lên, bấm quay, máy sẽ nhận diện và bám khuôn mặt ngay khi nó vào khung — chính DJI mô tả tính năng này dành riêng cho vlog một người, đúng tình huống bạn tự quay một mình. Một chế độ thứ ba, <strong>Dynamic Framing</strong> (tự giữ khung hình), giữ bạn ở giữa (hoặc một vị trí khác bạn đặt) mà gimbal không cần vật lý dịch chuyển theo bạn chút nào — hữu ích khi bạn chủ yếu đứng yên nhưng hay nghiêng người hoặc dịch chuyển.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">ActiveTrack 6.0</span><span class="v">Chạm đúp để bắt đầu, chạm ra ngoài khung hoặc bấm 5D Joystick một lần để dừng</span></div>
  <div class="kv"><span class="k">Face Auto-Detect</span><span class="v">Không cần chạm — tự bắt đầu bám ngay khi một khuôn mặt vào khung lúc bắt đầu quay</span></div>
  <div class="kv"><span class="k">Dynamic Framing</span><span class="v">Giữ bạn ở giữa/đúng vị trí mà gimbal không cần di chuyển theo bạn</span></div>
</div>
<div class="callout warn"><p><strong>DJI công bố ActiveTrack không hoạt động trong mọi chế độ:</strong> Panorama, Low-Light Video, Slow Motion (1080P@8x / 4K@4x), Timelapse, Motionlapse và SpinShot đều bị loại trừ. Nếu bạn đã bật một trong các chế độ đó chồng lên ActiveTrack và mong nó vẫn bám, nó sẽ không bám — chuyển về chế độ quay bình thường trước.</p></div>

<h3>Khoá phơi sáng và nét trước khi nói bất cứ điều gì</h3>
${slide('cr-10', 5, 'Khoá trước khi quay — AE/AF Lock, cân bằng trắng')}
<p>Bài 5.3 đã giới thiệu khoá nét và cảnh báo rằng AWB (cân bằng trắng tự động) hoặc AF (lấy nét tự động) trôi giữa cảnh đặc biệt nguy hiểm khi tự quay một mình, vì không có ai xem màn hình để bắt lỗi giúp bạn. Đây là chính xác cơ chế Apple công bố cho iPhone: giữ chạm vùng lấy nét trên màn hình tới khi thấy chữ <strong>"AE/AF Lock"</strong> (khoá phơi sáng và lấy nét tự động) hiện phía trên khung hình, và nó giữ khoá cho tới khi bạn chạm lại màn hình để mở khoá. Kết hợp với <strong>Lock White Balance</strong> trong bảng Settings › Camera của Chương 6, iPhone của bạn sẽ không âm thầm đo sáng lại, lấy nét lại, hay đổi màu ngay lúc bạn nghiêng người tới hay một cái bóng lướt qua khung.</p>

<h3>Đánh dấu đúng chỗ đứng</h3>
${slide('cr-10', 11, 'Đánh dấu vị trí · chân máy mini · gậy nối')}
<p>Một khi đã canh xong khung hình, một dải băng dính dán chữ X dưới sàn đánh dấu đúng chỗ chân bạn vừa đứng. Liếc xuống một giây để đặt lại đúng vị trí, thay vì đoán bằng mắt rồi phải quay lại vì trôi mất mười centimet sang trái. Không tốn gì cả, và đó là cách sửa nhanh nhất cho tình huống "khung hình đúng ở take một mà sai ở take bốn."</p>

<h3>Chân máy mini và gậy nối</h3>
<p>Cả tay cầm lẫn battery grip của Pocket 3 đều có <strong>ren 1/4 inch</strong> chuẩn ở đáy (hướng dẫn chính thức của DJI xác nhận điều này), đó là thứ cho phép bạn gắn phụ kiện Mini Tripod chính hãng để đặt máy đứng yên trên một mặt phẳng thay vì cầm tay. Gậy nối làm việc ngược lại — đẩy máy ra xa hơn sải tay của bạn, hữu ích cho một toàn cảnh rộng hơn hoặc một góc cao mà đứng yên không tự cầm tới được.</p>

<h3>iPad làm màn hình xem mình — cách nào thật sự dùng được</h3>
${slide('cr-10', 10, 'Ba cách dùng iPad làm màn hình xem mình')}
<p>Đây là chỗ dễ phí hai mươi phút thử một thứ chưa bao giờ hoạt động được, nên đây là điều đã kiểm và điều chưa. Nếu Pocket 3 là máy quay của bạn, chạy <strong>DJI Mimo</strong> trên iPad (app này dựng riêng cho iPad, cần iPadOS 15.0 trở lên) và kết nối qua Bluetooth và Wi-Fi — bạn có xem trực tiếp HD thật, không cần dây. Nếu iPhone là máy quay của bạn, tính năng điều khiển từ xa của chính <strong>Blackmagic Camera</strong> làm được việc này: đặt iPad làm "controller" trên cùng mạng Wi-Fi với một iPhone chạy cùng app, bạn có một màn hình multiview trực tiếp cộng khả năng chỉnh phơi sáng và nét từ iPad. Thứ KHÔNG hoạt động là Continuity Camera — tính năng đó chỉ biến iPhone thành webcam CHO MỘT CÁI MAC, nó không liên quan gì tới việc xem lại chính mình trong lúc quay, và tìm tới nó ở đây là một ngõ cụt.</p>
<div class="callout ok"><p><strong>Mẹo:</strong> chọn cách xem màn hình khớp với máy nào đang là A-cam hôm đó — DJI Mimo khi Pocket 3 dẫn chính, chế độ xem từ xa của Blackmagic Camera khi iPhone dẫn chính. Không cần chạy cả hai cùng lúc.</p></div>

<h3>Quay khi đang đi bộ</h3>
<p>Chương 6 đã nói về chế độ Follow của Pocket 3 cho chuyển động cầm tay mượt mà; kết hợp với ActiveTrack hoặc Face Auto-Detect, cảnh quay khi đi bộ trở nên thật sự khả thi khi tự quay một mình — gimbal giữ khung ngang bằng và việc bám theo giữ bạn trong khung, nên bạn có thể tập trung vào việc đi thay vì liên tục nhìn màn hình.</p>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — tin tưởng ActiveTrack lần đầu tiên ngay giữa một take quan trọng.</strong> Nếu bạn bật nó ở chế độ Slow Motion hay Low-Light mà không biết DJI loại trừ hai chế độ đó, hoặc đơn giản là chưa thử nó trong đúng căn phòng bạn đang quay, bạn chỉ phát hiện ra vấn đề khi xem lại thước phim — quá muộn để sửa take đó. Thử nó mười giây trong đúng chế độ quay thật, đúng căn phòng thật, trước khi giao cả một đoạn cho nó.</p></div>

<p class="note-ct"><strong>Bài tiếp theo:</strong> Bài 10.4 biến mọi thứ trong chương này thành một ngày quay thật — một checklist 3 cột, và quyền của bạn thật sự là gì khi chĩa máy quay vào người khác nơi công cộng ở Việt Nam.</p>

<h3>🎬 Thực hành (15–25 phút)</h3>
<div class="callout ok"><ol>
<li>Bật Face Auto-Detect trên Pocket 3, bấm quay, rồi bước vào khung từ bên ngoài — xác nhận việc bám bắt đầu mà không cần chạm gì.</li>
<li>Trên iPhone, giữ chạm vùng lấy nét tới khi thấy chữ "AE/AF Lock", rồi di chuyển trong khung và xác nhận phơi sáng lẫn nét đều đứng yên.</li>
<li>Dựng cách xem màn hình khớp với A-cam của bạn (DJI Mimo cho Pocket 3, hoặc chế độ xem từ xa của Blackmagic Camera cho iPhone) và xác nhận bạn thật sự thấy được khung hình của chính mình trên iPad.</li>
</ol><p><strong>Đạt khi:</strong> bạn đã tự xem mình được bám tự động, thấy khoá đứng yên qua chuyển động, và thấy được màn hình xem mình trực tiếp trên iPad — cả ba, mỗi thứ một lần.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">ActiveTrack 6.0</span><span class="v">Hệ thống bám chủ thể của DJI trên Pocket 3 — chạm đúp để bắt đầu, joystick hoặc chạm ra ngoài để dừng.</span></div>
  <div class="kv"><span class="k">AE/AF Lock</span><span class="v">Cử chỉ giữ chạm trên iPhone khoá phơi sáng và nét tới khi bạn chạm lại màn hình.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>ActiveTrack 6.0 (chạm đúp để bắt đầu) và Face Auto-Detect (không cần chạm, tự bắt đầu khi bấm quay) đều bám bạn trên Pocket 3 — cả hai đều không hoạt động trong Panorama, Low-Light Video, Slow Motion, Timelapse, Motionlapse hay SpinShot.</li>
<li>Giữ chạm vùng lấy nét trên iPhone tới khi thấy "AE/AF Lock", kết hợp với Lock White Balance của Chương 6, trước khi bắt đầu nói.</li>
<li>Một dải băng dính đánh dấu chỗ đứng sửa được lỗi trôi vị trí giữa các take, miễn phí.</li>
<li>Tay cầm và battery grip của Pocket 3 đều có ren 1/4 inch cho Mini Tripod chính hãng.</li>
<li>DJI Mimo trên iPad thật sự xem được Pocket 3; chế độ điều khiển từ xa của Blackmagic Camera thật sự xem được một iPhone chạy cùng app. Continuity Camera không làm được cả hai — nó chỉ là tính năng webcam cho Mac.</li>
</ul>
</div>
`,
    },

    /* ─────────────────────── 10.4 ─────────────────────── */
    {
      title: '10.4 — Shoot day and the law of public spaces|||10.4 — Ngày quay và luật nơi công cộng',
      slug: 'cr-10-4-ngay-quay-checklist',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Checklist ngày quay 3 cột Trước/Trong/Sau, và quyền đối với hình ảnh khi quay nơi công cộng ở Việt Nam.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.4</span>
<h2>A good shoot day starts before you press record for the first time</h2>
<p class="lead">Every habit in this chapter — two cameras rolling together, locked exposure, automatic tracking — only pays off if the basics are already handled: charged batteries, a formatted card, settings you do not have to think about. This lesson closes the chapter with a three-column checklist that ties the whole book together, and something just as practical: what your actual rights are when you point a camera at strangers in a public place in Vietnam.</p>

<h3>Before · During · After</h3>
${slide('cr-10', 12, 'Checklist 3 cột: Trước · Trong · Sau')}
<p>Nothing on this checklist is new — every item points back to a lesson you already had — but writing it as one list is what makes it usable on an actual morning when you are rushing. <strong>Before</strong> you leave the house: batteries charged plus a spare battery/grip, a card formatted INSIDE the camera rather than on a computer (Chapter 6), lenses and sensors wiped clean, fps/resolution/white balance/profile set from your saved preset (Chapters 5–6), and audio levels checked with a 30-second room tone recorded (Chapter 9). <strong>During</strong> the shoot: clap once the instant both cameras are rolling (this chapter's own lesson 10.1, feeding into Chapter 9.4 and 13.3's sync workflow), say the clip name or number out loud before each shot as a verbal slate, review a take immediately if you suspect it failed rather than waiting until the edit to find out, and swap batteries or cards at a natural pause, never mid-action. <strong>After</strong> the shoot: offload both cameras' cards the same day — Chapter 11 covers the full backup process, one sentence is enough here — recharge everything for next time, and only delete a card once you have confirmed the backup exists.</p>

<h3>Shooting in public in Vietnam — the right to your own image</h3>
${slide('cr-10', 13, 'Quay nơi công cộng ở Việt Nam — quyền hình ảnh')}
<p><strong>Article 32 of Vietnam's 2015 Civil Code</strong> (Bộ luật Dân sự 2015) states that an individual has the right to their own image, and that using another person's image requires that person's consent. The law also spells out an exception: images used from PUBLIC activities — conferences, seminars, sports competitions, artistic performances and similar public events — do not require asking each individual, as long as the use does not harm the dignity, honor or reputation of the person shown. Practically: a vlog shot at a crowded tech fair, where people pass through the background without being singled out, sits comfortably inside that exception. Deliberately filming one identifiable stranger up close, for a video about them specifically, is a different situation — that is exactly the consent the law is describing.</p>
<div class="callout warn"><p><strong>Children — Article 21 of the 2016 Law on Children (Luật Trẻ em 2016)</strong> states that children have the right to inviolable privacy and personal secrecy, protected by law. This course is not a legal advisor, so the practical takeaway stays simple and conservative: do not film a child close-up, and do not post identifiable footage of someone else's child, without asking a parent or guardian first.</p></div>
<p>Two more things worth saying plainly. First, none of this is legal advice — it is reference information to make you a more careful shooter, not a substitute for asking a lawyer about a specific situation. Second, on restricted locations (military zones, security-sensitive sites and similar): the honest, useful guidance is the PRINCIPLE, not a list — such places exist, rules vary by site, and the only reliable move is to ask on the spot or look for posted signage, rather than trusting any list a video course could hand you.</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — assuming "it's a public place" means anyone's face is fair game.</strong> Being legally allowed to record IN a public space is a different question from whether an identifiable person in your footage has rights over their own image — Article 32 says they generally do, public place or not, unless your footage falls inside the specific public-activity exception above. The safest working habit: if one person is recognizable and central to the shot rather than passing through the background, that is the moment to ask.</p></div>

<p class="note-ct"><strong>Next:</strong> Chapter 11 covers what happens to your footage the moment you get home — file structure, naming, and the 3-2-1 backup routine that keeps a single bad card from costing you a whole shoot day.</p>

<h3>🎬 Practice (20–30 minutes)</h3>
<div class="callout ok"><ol>
<li>Run the full Before checklist once for real, with a stopwatch — batteries, card format, lens wipe, settings preset, audio test and room tone.</li>
<li>Shoot one short segment following the During checklist: clap to sync, verbal slate, immediate review.</li>
<li>Before you post anything filmed in public, look through the frame once for any single identifiable stranger or child, and decide honestly whether you would need to ask them.</li>
</ol><p><strong>Done when:</strong> you have timed your own Before checklist once, and you can explain out loud why Article 32's public-activity exception does or does not cover a specific clip you shot.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Right to one's image</span><span class="v">Quyền đối với hình ảnh — Article 32, Civil Code 2015: using someone's image needs their consent, with a public-activity exception.</span></div>
  <div class="kv"><span class="k">Room tone</span><span class="v">A silent 30-second recording of a location's background noise, taken during setup (Chapter 9).</span></div>
</div>

<h3>📌 Chapter summary</h3>
<ul>
<li>Roll two cameras at once (10.1) to get coverage from one performance instead of repeating a take.</li>
<li>Six B-roll types and a five-shot sequence (10.2) — shoot more than feels necessary, and shoot it while the moment is still real.</li>
<li>ActiveTrack 6.0, Face Auto-Detect, AE/AF Lock and a genuine iPad monitor via DJI Mimo or Blackmagic Camera (10.3) replace the crew you do not have.</li>
<li>A three-column Before/During/After checklist ties every earlier chapter together into one shoot day.</li>
<li>Article 32 of the 2015 Civil Code: image use needs consent, except from public activities that do not harm someone's dignity — check yourself against it before you point a lens at a stranger.</li>
</ul>

<div class="link-card"><a href="https://vbpl.vn/TW/Pages/vbpq-toanvan.aspx?ItemID=95942" target="_blank" rel="noopener">Cơ sở dữ liệu quốc gia về văn bản pháp luật — Bộ luật Dân sự số 91/2015/QH13 (Điều 32)</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.4</span>
<h2>Một buổi quay tốt bắt đầu trước khi bạn bấm quay lần đầu tiên</h2>
<p class="lead">Mọi thói quen trong chương này — hai máy cùng quay, phơi sáng đã khoá, bám tự động — chỉ đáng giá khi những thứ cơ bản đã lo xong: pin đã sạc, thẻ đã format, cài đặt không cần phải nghĩ tới nữa. Bài này khép chương lại bằng một checklist 3 cột nối cả cuốn sách lại với nhau, và một thứ thực tế không kém: quyền thật sự của bạn là gì khi chĩa máy quay vào người lạ nơi công cộng ở Việt Nam.</p>

<h3>Trước · Trong · Sau</h3>
${slide('cr-10', 12, 'Checklist 3 cột: Trước · Trong · Sau')}
<p>Không có gì trong checklist này là mới — mỗi mục đều trỏ về một bài bạn đã học — nhưng viết nó thành một danh sách duy nhất mới là thứ khiến nó dùng được vào một buổi sáng thật sự đang vội. <strong>Trước</strong> khi ra khỏi nhà: pin đã sạc đầy cộng một pin/battery grip dự phòng, thẻ đã format NGAY TRONG máy chứ không phải trên máy tính (Chương 6), ống kính và cảm biến đã lau sạch, fps/độ phân giải/cân bằng trắng/profile đã đặt theo preset đã lưu (Chương 5–6), và mức thu âm đã kiểm cùng một đoạn room tone 30 giây đã ghi (Chương 9). <strong>Trong</strong> lúc quay: vỗ tay một cái ngay khi cả hai máy đã bấm quay (đúng ý của Bài 10.1 chương này, nuôi vào quy trình đồng bộ của Bài 9.4 và 13.3), nói tên hoặc số clip thành tiếng trước mỗi shot như một slate miệng, xem lại take ngay nếu nghi ngờ hỏng thay vì đợi tới lúc dựng mới biết, và đổi pin hoặc thẻ ở một điểm dừng tự nhiên, không bao giờ giữa một hành động. <strong>Sau</strong> buổi quay: đổ thẻ của cả hai máy ngay trong ngày — Chương 11 nói đủ về quy trình sao lưu, một câu ở đây là đủ — sạc lại mọi thứ cho lần sau, và chỉ xoá thẻ khi đã xác nhận bản sao lưu tồn tại.</p>

<h3>Quay nơi công cộng ở Việt Nam — quyền đối với hình ảnh của chính bạn (và người khác)</h3>
${slide('cr-10', 13, 'Quay nơi công cộng ở Việt Nam — quyền hình ảnh')}
<p><strong>Điều 32 Bộ luật Dân sự 2015</strong> quy định cá nhân có quyền đối với hình ảnh của mình, và việc sử dụng hình ảnh của người khác phải được người đó đồng ý. Luật cũng nêu rõ một ngoại lệ: hình ảnh sử dụng từ hoạt động CÔNG CỘNG — hội nghị, hội thảo, thi đấu thể thao, biểu diễn nghệ thuật và các hoạt động công cộng tương tự — không cần xin phép từng cá nhân, miễn việc sử dụng đó không làm tổn hại danh dự, nhân phẩm, uy tín của người có hình ảnh. Thực tế: một vlog quay tại một hội chợ công nghệ đông người, nơi người qua lại xuất hiện trong hậu cảnh mà không bị tách riêng ra, nằm thoải mái trong ngoại lệ đó. Cố tình quay cận một người lạ có thể nhận diện được, cho một video nói riêng về họ, là một tình huống khác — đó chính xác là điều luật đang nói cần có sự đồng ý.</p>
<div class="callout warn"><p><strong>Trẻ em — Điều 21 Luật Trẻ em 2016</strong> quy định trẻ em có quyền bất khả xâm phạm về đời sống riêng tư, bí mật cá nhân, được pháp luật bảo vệ. Khoá học này không phải luật sư, nên lời khuyên thực tế giữ ở mức đơn giản và thận trọng: không quay cận một đứa trẻ, và không đăng thước phim nhận diện được con của người khác, mà chưa hỏi cha mẹ hoặc người giám hộ trước.</p></div>
<p>Hai điều nữa cần nói thẳng. Một, không điều nào ở đây là tư vấn pháp lý — đây là thông tin tham khảo để bạn quay cẩn trọng hơn, không thay thế được việc hỏi luật sư cho một tình huống cụ thể. Hai, về địa điểm bị hạn chế (khu quân sự, nơi nhạy cảm an ninh và tương tự): lời khuyên trung thực và hữu ích là NGUYÊN TẮC, không phải một danh sách — những nơi như vậy có tồn tại, quy định khác nhau theo từng địa điểm, và cách đáng tin duy nhất là hỏi tại chỗ hoặc tìm biển báo, thay vì tin vào bất kỳ danh sách nào một khoá học video có thể đưa cho bạn.</p>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — nghĩ "đây là chỗ công cộng" nghĩa là mặt ai cũng quay được thoải mái.</strong> Được phép hợp pháp quay TẠI một nơi công cộng là một câu hỏi khác với việc một người có thể nhận diện được trong thước phim của bạn có quyền đối với hình ảnh của họ hay không — Điều 32 nói rằng nhìn chung họ CÓ, dù ở chỗ công cộng hay không, trừ khi thước phim của bạn nằm trong đúng ngoại lệ hoạt động công cộng nói trên. Thói quen an toàn nhất: nếu một người có thể nhận diện được và là trung tâm của cảnh quay chứ không chỉ đi ngang qua hậu cảnh, đó là lúc cần hỏi.</p></div>

<p class="note-ct"><strong>Bài tiếp theo:</strong> Chương 11 nói về việc gì xảy ra với thước phim của bạn ngay khi về tới nhà — cấu trúc file, đặt tên, và quy trình sao lưu 3-2-1 giữ cho một thẻ hỏng không làm mất cả một buổi quay.</p>

<h3>🎬 Thực hành (20–30 phút)</h3>
<div class="callout ok"><ol>
<li>Chạy hết checklist Trước một lần thật, bấm giờ — pin, format thẻ, lau ống kính, preset cài đặt, thử âm và room tone.</li>
<li>Quay một đoạn ngắn theo checklist Trong: vỗ tay đồng bộ, slate miệng, xem lại ngay.</li>
<li>Trước khi đăng bất cứ gì quay nơi công cộng, nhìn lại khung hình một lần tìm bất kỳ người lạ hay trẻ em nào có thể nhận diện được, và tự hỏi thành thật xem có cần xin phép họ không.</li>
</ol><p><strong>Đạt khi:</strong> bạn đã bấm giờ checklist Trước của chính mình một lần, và giải thích được thành tiếng vì sao ngoại lệ hoạt động công cộng của Điều 32 áp dụng hay không áp dụng cho một clip cụ thể bạn đã quay.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Quyền đối với hình ảnh</span><span class="v">Right to one's image — Điều 32 Bộ luật Dân sự 2015: dùng hình ảnh người khác cần sự đồng ý, có ngoại lệ hoạt động công cộng.</span></div>
  <div class="kv"><span class="k">Room tone</span><span class="v">Một đoạn ghi âm im lặng 30 giây tiếng nền của địa điểm, thu ngay lúc chuẩn bị (Chương 9).</span></div>
</div>

<h3>📌 Tóm tắt chương</h3>
<ul>
<li>Quay hai máy cùng lúc (10.1) để có coverage từ một lần diễn thay vì diễn lại một take.</li>
<li>Sáu loại B-roll và một chuỗi 5 shot (10.2) — quay nhiều hơn mức thấy cần thiết, và quay ngay lúc khoảnh khắc còn thật.</li>
<li>ActiveTrack 6.0, Face Auto-Detect, AE/AF Lock và một màn hình iPad thật sự dùng được qua DJI Mimo hoặc Blackmagic Camera (10.3) thay thế cho ê-kíp bạn không có.</li>
<li>Một checklist 3 cột Trước/Trong/Sau nối mọi chương trước đó lại thành một ngày quay.</li>
<li>Điều 32 Bộ luật Dân sự 2015: dùng hình ảnh cần sự đồng ý, trừ hoạt động công cộng không làm tổn hại danh dự ai — tự kiểm lại trước khi chĩa ống kính vào một người lạ.</li>
</ul>

<div class="link-card"><a href="https://vbpl.vn/TW/Pages/vbpq-toanvan.aspx?ItemID=95942" target="_blank" rel="noopener">Cơ sở dữ liệu quốc gia về văn bản pháp luật — Bộ luật Dân sự số 91/2015/QH13 (Điều 32)</a></div>
</div>
`,
    },

    /* ─────────────────────── 10.5 quiz ─────────────────────── */
    {
      title: '10.5 — Chapter 10 check|||10.5 — Kiểm tra chương 10',
      slug: 'cr-10-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Tóm tắt chương 10 và bài kiểm tra 10 câu tình huống: quay 2 máy đồng thời, B-roll, ActiveTrack, khoá AE/AF, màn hình xem mình và quyền hình ảnh nơi công cộng.',
      content: `
<div class="ml-en">
<h2>📌 Chapter 10 recap</h2>
<p>You shoot alone, so the chapter replaced every job a crew would normally do with a habit or a piece of gear: two cameras rolling together for coverage from one take (10.1), enough B-roll shot while the moment is still real (10.2), the camera tracking and locking itself instead of a crew doing it (10.3), and a checklist plus a real understanding of your legal footing that turns all of it into a repeatable shoot day (10.4).</p>
<h3>Self-check</h3>
<ul>
<li>I can explain why simultaneous two-camera recording replaces re-taking a line for coverage when shooting alone.</li>
<li>I can name all six B-roll types and run a five-shot sequence for one action.</li>
<li>I know the difference between ActiveTrack 6.0 (double-tap) and Face Auto-Detect (automatic), and which recording modes exclude ActiveTrack.</li>
<li>I can lock AE/AF on my iPhone before a take and explain why that matters more when shooting solo.</li>
<li>I know which app genuinely monitors which camera on an iPad — and that Continuity Camera is not one of them.</li>
<li>I can run the Before/During/After checklist without missing a step.</li>
<li>I understand Article 32's consent requirement and its public-activity exception well enough to judge a real clip.</li>
</ul>
</div>
<div class="ml-vi">
<h2>📌 Tóm tắt Chương 10</h2>
<p>Bạn quay một mình, nên chương này thay mọi việc một ê-kíp thường làm bằng một thói quen hoặc một món đồ nghề: hai máy cùng quay để có coverage từ một take (10.1), đủ B-roll quay ngay lúc khoảnh khắc còn thật (10.2), máy tự bám và tự khoá thay vì một ê-kíp làm việc đó (10.3), và một checklist cộng một hiểu biết thật về chỗ đứng pháp lý của bạn, biến tất cả thành một ngày quay lặp lại được (10.4).</p>
<h3>Tự kiểm</h3>
<ul>
<li>Tôi giải thích được vì sao quay 2 máy đồng thời thay thế được việc diễn lại một câu để lấy coverage khi quay một mình.</li>
<li>Tôi gọi tên được cả sáu loại B-roll và chạy được một chuỗi 5 shot cho một hành động.</li>
<li>Tôi biết sự khác nhau giữa ActiveTrack 6.0 (chạm đúp) và Face Auto-Detect (tự động), và những chế độ quay nào loại trừ ActiveTrack.</li>
<li>Tôi khoá được AE/AF trên iPhone trước một take và giải thích được vì sao điều đó quan trọng hơn khi tự quay một mình.</li>
<li>Tôi biết app nào thật sự xem được máy nào trên iPad — và Continuity Camera không phải một trong số đó.</li>
<li>Tôi chạy được checklist Trước/Trong/Sau mà không bỏ sót bước nào.</li>
<li>Tôi hiểu đủ về điều kiện đồng ý của Điều 32 và ngoại lệ hoạt động công cộng để tự đánh giá được một clip thật.</li>
</ul>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'You are shooting alone and want coverage of your talking-head delivery without performing the same line twice. What is the best approach this chapter teaches?|||Bạn tự quay một mình và muốn có coverage cho đoạn talking head mà không phải diễn lại đúng câu hai lần. Cách nào bài này dạy là hợp lý nhất?',
            options: [
              'Record with A-cam, then re-perform the exact same line for B-cam afterward|||Quay bằng A-cam, rồi diễn lại đúng câu đó cho B-cam sau đó',
              'Start both A-cam and B-cam together and roll them at the same time through the whole segment|||Bấm quay cả A-cam lẫn B-cam cùng lúc và để chúng chạy suốt cả đoạn',
              'One wide shot from Pocket 3 alone already counts as full coverage|||Một cảnh rộng duy nhất từ Pocket 3 đã đủ tính là coverage đầy đủ',
              'Coverage is not possible when shooting alone, so skip it|||Không thể có coverage khi quay một mình, nên bỏ qua luôn',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'A second delivery rarely matches the first in energy or exact wording, so re-performing the line does not give you clean coverage — rolling both cameras on the SAME performance does. A single wide shot is one angle, not coverage, and coverage is exactly what this chapter makes possible alone.|||Lần diễn thứ hai hiếm khi khớp năng lượng hay câu chữ với lần đầu, nên diễn lại câu không cho bạn coverage sạch — quay cả hai máy trên CÙNG một lần diễn mới cho. Một cảnh rộng duy nhất chỉ là một góc, không phải coverage, và coverage chính là thứ chương này giúp bạn có được khi quay một mình.',
          },
          {
            question: 'In the two-camera layout from Lesson 10.1, roughly what angle should B-cam sit off A-cam\'s axis, and why not much less?|||Trong sơ đồ 2 máy ở Bài 10.1, B-cam nên lệch trục A-cam khoảng bao nhiêu độ, và vì sao không nên ít hơn nhiều?',
            options: [
              'Around 90–120°, so B-cam sees your side profile only|||Khoảng 90–120°, để B-cam chỉ thấy mặt nghiêng của bạn',
              'It does not matter, any small angle works the same|||Không quan trọng, góc nhỏ nào cũng như nhau',
              'Roughly 30–45° — much less and the two shots look too similar, risking a jump cut when you cut between them|||Khoảng 30–45° — ít hơn nhiều thì hai cảnh trông quá giống nhau, dễ thành jump cut khi cắt giữa chúng',
              'Exactly 180°, directly behind A-cam|||Đúng 180°, ngay phía sau A-cam',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'Under roughly 30° the two frames are close enough in angle that a cut between them risks reading as a jump cut, the same problem Lesson 4.2 warned about; past 45° B-cam starts losing your face. 90°+ or 180° are not the recommended range, and the angle is deliberately chosen, not arbitrary.|||Dưới khoảng 30°, hai khung hình đủ gần về góc để cắt giữa chúng dễ thành jump cut, đúng vấn đề Bài 4.2 đã cảnh báo; quá 45° thì B-cam bắt đầu mất mặt bạn. 90° trở lên hay 180° không phải khoảng khuyến nghị, và góc này được chọn có chủ đích, không phải ngẫu nhiên.',
          },
          {
            question: 'You press record on A-cam, then walk over and press record on B-cam three seconds later. What is the real consequence?|||Bạn bấm quay A-cam, rồi đi qua bấm quay B-cam ba giây sau. Hậu quả thật sự là gì?',
            options: [
              'That 3-second offset has to be found and corrected before the two angles line up in Chapter 13\'s multicam sync|||Độ lệch 3 giây đó phải được tìm ra và sửa trước khi hai góc khớp nhau ở bước đồng bộ đa máy Chương 13',
              'DaVinci Resolve automatically trims the offset with no input needed|||DaVinci Resolve tự động cắt bỏ độ lệch mà không cần làm gì',
              'It has no effect since only one camera\'s audio is ever used|||Không ảnh hưởng gì vì chỉ có âm thanh của một máy được dùng',
              'Both clips become unusable and must be reshot|||Cả hai clip sẽ không dùng được và phải quay lại',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'An unsynced start is not automatically fixed — you (or the software, guided by a clear sync point like a clap) have to find and correct that offset. It does not destroy the footage and it is not automatic; the fix taught in this lesson is clapping once with both cameras already rolling.|||Bắt đầu lệch nhịp không tự sửa được — bạn (hoặc phần mềm, dựa vào một điểm mốc rõ ràng như tiếng vỗ tay) phải tìm và sửa độ lệch đó. Nó không phá hỏng thước phim và không tự động; cách chữa bài này dạy là vỗ tay một cái khi cả hai máy đã bấm quay.',
          },
          {
            question: 'During the edit, you need a shot to insert between two A-roll moments to cover an awkward cut — it deliberately leaves the main action. Which B-roll type is this?|||Lúc dựng, bạn cần một cú máy chêm giữa hai khoảnh khắc A-roll để che một chỗ cắt vụng — nó chủ động rời khỏi hành động chính. Đây là loại B-roll nào?',
            options: [
              'Establishing|||Bối cảnh',
              'Reaction|||Phản ứng',
              'Detail (insert)|||Chi tiết (insert)',
              'Cutaway|||Cutaway',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'A cutaway is defined exactly this way, carried over from Lesson 4.2: a shot AWAY from the main action, used to cover a cut. Detail/insert stays INSIDE the action instead of leaving it, and establishing/reaction describe the subject of the shot, not its editing job here.|||Cutaway được định nghĩa đúng như vậy, mang từ Bài 4.2 sang: một cú máy RA KHỎI hành động chính, dùng để che một chỗ cắt. Chi tiết/insert vẫn ở TRONG hành động thay vì rời khỏi nó, còn bối cảnh/phản ứng mô tả chủ thể của cảnh, không phải vai trò dựng phim ở đây.',
          },
          {
            question: 'You finish all your talking-head segments, then remember you still need a "debugging" B-roll shot — but the bug is already fixed. What is the real lesson here?|||Bạn quay xong hết các đoạn talking head, rồi mới nhớ ra còn cần một cảnh B-roll "đang gỡ lỗi" — nhưng con bug đã sửa xong rồi. Bài học thật sự ở đây là gì?',
            options: [
              'B-roll can always be reshot identically at any later time|||B-roll lúc nào cũng quay lại y hệt được, bất kỳ lúc nào sau đó',
              'Shoot B-roll interleaved with the real moment, not saved for the end of the day|||Quay B-roll xen kẽ ngay lúc thật, đừng để dồn tới cuối ngày',
              'B-roll matters less than A-roll, so skipping it is fine|||B-roll không quan trọng bằng A-roll nên bỏ qua cũng được',
              'Reuse B-roll from an old video instead of shooting new footage|||Dùng lại B-roll từ video cũ thay vì quay mới',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'The lesson\'s own pitfall covers exactly this: by the end of a shoot the moment, the light and your energy have already moved on, so a "grabbed last" B-roll shot is a reenactment, not the real thing. B-roll is not optional filler, and reusing old footage is a workaround, not the fix this lesson teaches.|||Đúng cái bẫy bài này nói: tới cuối buổi quay, khoảnh khắc, ánh sáng và năng lượng của bạn đã trôi qua, nên một cảnh B-roll "quay vét cuối" chỉ là tái diễn, không phải thứ thật. B-roll không phải phần phụ có cũng được, và dùng lại footage cũ chỉ là cách chữa cháy, không phải cách bài này dạy.',
          },
          {
            question: 'You turn on Slow Motion mode on the Pocket 3 and then try to enable ActiveTrack, but it will not track you. What is the most likely cause?|||Bạn bật chế độ Slow Motion trên Pocket 3 rồi thử bật ActiveTrack nhưng nó không bám theo bạn. Nguyên nhân nhiều khả năng nhất là gì?',
            options: [
              'The camera has a hardware fault and needs repair|||Máy bị lỗi phần cứng, cần mang đi bảo hành',
              'ActiveTrack only works with a DJI Mic attached|||ActiveTrack chỉ hoạt động khi có DJI Mic gắn kèm',
              'ActiveTrack is not supported in Slow Motion mode, along with several other specific modes DJI lists|||ActiveTrack không hoạt động trong chế độ Slow Motion, cùng vài chế độ khác DJI liệt kê',
              'You need to update the DJI Mimo app before ActiveTrack works at all|||Bạn cần cập nhật app DJI Mimo mới dùng được ActiveTrack',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'DJI officially documents that ActiveTrack does not work in Panorama, Low-Light Video, Slow Motion, Timelapse, Motionlapse and SpinShot modes — this is expected behavior, not a fault. A microphone and an app update are unrelated to ActiveTrack\'s mode restrictions.|||DJI công bố chính thức rằng ActiveTrack không hoạt động trong các chế độ Panorama, Low-Light Video, Slow Motion, Timelapse, Motionlapse và SpinShot — đây là hành vi đã biết trước, không phải lỗi. Micro và việc cập nhật app không liên quan tới giới hạn chế độ của ActiveTrack.',
          },
          {
            question: 'Shooting solo with an iPhone, you are worried the camera will re-focus onto the background the moment you lean forward. What does Apple\'s own method lock focus and exposure?|||Tự quay bằng iPhone, bạn lo máy sẽ lấy nét lại vào hậu cảnh ngay khi bạn nghiêng người tới. Cách Apple công bố để khoá phơi sáng và nét là gì?',
            options: [
              'Touch and hold the focus area on screen until "AE/AF Lock" appears, then tap the screen again to release it|||Giữ chạm vùng lấy nét trên màn hình tới khi thấy chữ "AE/AF Lock", chạm lại màn hình để mở khoá',
              'Switch to Portrait mode, which locks focus automatically|||Chuyển sang chế độ Portrait, chế độ này tự khoá nét',
              'Turn off Face ID for the duration of the recording|||Tắt Face ID trong suốt thời gian quay',
              'There is no lock — you must reshoot if focus drifts|||Không có cách khoá nào — phải quay lại nếu nét bị trôi',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'Apple\'s support guide documents exactly this touch-and-hold gesture for AE/AF Lock. Portrait mode changes background blur, not focus locking; Face ID is unrelated to the Camera app\'s exposure/focus system; and a real lock does exist, which is the whole point of this lesson.|||Hướng dẫn của Apple công bố đúng cử chỉ giữ chạm này cho AE/AF Lock. Chế độ Portrait đổi độ mờ hậu cảnh, không phải khoá nét; Face ID không liên quan tới hệ thống phơi sáng/nét của app Camera; và có một cách khoá thật sự, đúng trọng tâm của bài này.',
          },
          {
            question: 'You are recording with Pocket 3 and want to use your iPad Pro M5 as a live self-view monitor without touching the camera. Which officially confirmed method actually does this?|||Bạn đang quay bằng Pocket 3 và muốn dùng iPad Pro M5 làm màn hình xem mình trực tiếp mà không cần chạm vào máy. Cách nào đã kiểm chính thức thật sự làm được việc này?',
            options: [
              'Continuity Camera, connecting the iPad directly to Pocket 3|||Continuity Camera, nối thẳng iPad tới Pocket 3',
              'Blackmagic Camera\'s remote-control mode, since it works with any DJI device|||Chế độ điều khiển từ xa của Blackmagic Camera, vì nó hoạt động với mọi thiết bị DJI',
              'AirPlay screen mirroring directly from Pocket 3 to the iPad|||AirPlay chiếu màn hình thẳng từ Pocket 3 sang iPad',
              'DJI Mimo on the iPad, connected to Pocket 3 over Bluetooth and Wi-Fi|||DJI Mimo trên iPad, kết nối tới Pocket 3 qua Bluetooth và Wi-Fi',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'DJI Mimo is built for iPad and connects to Pocket 3 over Bluetooth/Wi-Fi for genuine HD live view. Continuity Camera only turns an iPhone into a Mac webcam — it has nothing to do with Pocket 3. Blackmagic Camera\'s remote mode monitors other devices running Blackmagic Camera (i.e. an iPhone as the camera), not a DJI gimbal. Pocket 3 has no AirPlay screen-mirroring feature to an iPad.|||DJI Mimo dựng riêng cho iPad và kết nối tới Pocket 3 qua Bluetooth/Wi-Fi để xem trực tiếp HD thật. Continuity Camera chỉ biến iPhone thành webcam cho Mac — không liên quan gì tới Pocket 3. Chế độ từ xa của Blackmagic Camera xem các thiết bị khác đang chạy Blackmagic Camera (tức một iPhone làm máy quay), không phải một gimbal của DJI. Pocket 3 không có tính năng AirPlay chiếu màn hình sang iPad.',
          },
          {
            question: 'Right after you press record on both A-cam and B-cam, what should you do first to make Chapter 13\'s sync step easier?|||Ngay sau khi bấm quay cả A-cam lẫn B-cam, bạn nên làm gì đầu tiên để bước đồng bộ ở Chương 13 dễ hơn?',
            options: [
              'Wait exactly 10 seconds in silence before speaking|||Đợi đúng 10 giây trong im lặng trước khi nói',
              'Clap once with both hands clearly visible to both cameras|||Vỗ tay một cái với cả hai tay rõ ràng trong khung của cả hai máy',
              'Say "action" loudly several times in a row|||Nói "action" thật to nhiều lần liên tiếp',
              'Turn off Wi-Fi on both devices before recording|||Tắt Wi-Fi trên cả hai máy trước khi quay',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'A single clear clap creates one unmistakable audio and visual spike in both files — an exact sync point. Silence gives no marker to sync against, repeating a word is not as precise a spike as a clap, and Wi-Fi has nothing to do with syncing two separately recorded clips.|||Một tiếng vỗ tay rõ ràng tạo ra đúng một điểm nhô âm thanh và hình ảnh không thể nhầm trong cả hai file — một điểm đồng bộ chính xác. Im lặng không cho mốc nào để đồng bộ theo, lặp lại một từ không nhọn bằng một tiếng vỗ tay, và Wi-Fi không liên quan gì tới việc đồng bộ hai clip quay riêng.',
          },
          {
            question: 'You are vlogging at a crowded tech fair; many unrelated people pass through the background without being singled out. Under Article 32 of the 2015 Civil Code, do you need each person\'s consent?|||Bạn quay vlog tại một hội chợ công nghệ đông người; nhiều người không liên quan đi ngang qua hậu cảnh mà không bị tách riêng ra. Theo Điều 32 Bộ luật Dân sự 2015, bạn có cần sự đồng ý của từng người không?',
            options: [
              'Yes, written consent is required from every person who appears in frame|||Có, cần sự đồng ý bằng văn bản từ mọi người xuất hiện trong khung hình',
              'No, consent is never required anywhere, including close-ups of children|||Không, không bao giờ cần xin phép ở bất cứ đâu, kể cả cận cảnh trẻ em',
              'Not required here — this is a public activity, as long as it does not harm anyone\'s dignity or reputation|||Không bắt buộc ở đây — đây là hoạt động công cộng, miễn không làm tổn hại danh dự hay uy tín của ai',
              'Only blurring every face makes this legal|||Chỉ cần làm mờ mọi khuôn mặt là hợp pháp',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'Article 32 excepts images from public activities — a crowded public event where people are not singled out fits this — as long as dignity, honor and reputation are not harmed. "Consent never required anywhere" is false and contradicted by the general rule; blurring is a practical workaround, not what the article specifies; and written consent from every passerby is not what the public-activity exception requires.|||Điều 32 miễn trừ hình ảnh từ hoạt động công cộng — một sự kiện công cộng đông người mà không ai bị tách riêng ra khớp với điều này — miễn không làm tổn hại danh dự, nhân phẩm, uy tín. "Không bao giờ cần xin phép" là sai và trái với quy tắc chung; làm mờ mặt là cách chữa cháy thực tế, không phải điều luật quy định; và xin phép bằng văn bản từng người đi ngang không phải điều ngoại lệ hoạt động công cộng yêu cầu.',
          },
        ],
      },
    },
  ],
};
