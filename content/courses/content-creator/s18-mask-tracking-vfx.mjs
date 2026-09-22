/**
 * Content Creator — Chương 18: Mask, tracking & VFX thực tế. Song ngữ EN/VI (.ml-en / .ml-vi).
 * ⚠️ KHÔNG backtick trần trong content (dùng &#96;); `${` trong mã mẫu viết \${ ; gạch chéo ngược viết \\
 */
import { gallery, slide } from './_slides.mjs';

const SLIDES = [
  [1, 'Bìa'],
  [2, 'Bản đồ chương'],
  [3, 'Mask: cứng, mềm (feather), và đảo'],
  [4, 'Roto thủ công: animate mask theo keyframe'],
  [5, 'Công cụ mask & tách chủ thể — CapCut vs Resolve'],
  [6, '3 loại tracker — point / planar / camera'],
  [7, 'Làm mờ mặt người lạ / biển số — quy trình 4 bước'],
  [8, 'Ổn định hình (Stabilizer) — chế độ & mức'],
  [9, 'Khi nào Stabilizer KHÔNG cứu được'],
  [10, 'Phông xanh nhìn từ trên: khoảng cách người–phông'],
  [11, 'Quay phông xanh — sai vs đúng'],
  [12, 'Key & dọn viền (spill suppression)'],
  [13, 'VFX thực tế khác creator hay cần'],
  [14, 'Ví dụ từng bước: nhân bản chính mình'],
  [15, 'Bảng tra nhanh cả chương'],
  [16, 'Thực hành'],
];

export default {
  title: 'Chapter 18 — Masks, tracking & practical VFX|||Chương 18 — Mask, tracking & VFX thực tế',
  description: 'Từ vẽ mask bằng tay tới tracking, phông xanh và những kỹ xảo VFX creator thật sự dùng được — kèm luật chơi: khi nào một hiệu ứng KHÔNG nên dùng.',
  lessons: [

    /* ─────────────────── 18.0 slide bài giảng ─────────────────── */
    {
      title: '18.0 — Chapter 18 in 16 slides|||18.0 — Chương 18 trong 16 slide',
      slug: 'cr-18-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Toàn bộ chương 18 gói trong 16 slide có hình: mask cứng/mềm/đảo, 3 loại tracker, phông xanh nhìn từ trên, và bảng tra nhanh CapCut vs Resolve (miễn phí/Studio) cho cả chương.',
      content: `
<div class="ml-en"><h2>📑 Chapter 18 in 16 slides</h2>
<p>Chapter 12 taught CapCut's basic Mask in one paragraph. Chapter 15 used Power Windows for color correction. This chapter reuses both tools for a different job — hiding, revealing, tracking and compositing — and adds the tracking and green-screen pieces neither chapter covered. Slide 6 (the three tracker types) and slide 15 (the CapCut-vs-Resolve cheat table) are the two you will come back to most.</p>
<p>Every tool name and free/Studio split on these slides was checked against blackmagicdesign.com and capcut.com in 09/2026, not remembered from an older version. Two real ffmpeg runs — a synthetic green-screen key and a motion-following blur — are in Lesson 18.3 and 18.2 with their actual measured output, not a description of what should happen.</p></div>
<div class="ml-vi"><h2>📑 Chương 18 trong 16 slide</h2>
<p>Chương 12 đã dạy Mask cơ bản của CapCut trong một đoạn. Chương 15 đã dùng Power Window để chỉnh màu. Chương này dùng lại cả hai công cụ đó cho một việc khác — che, lộ, bám theo và ghép hình — và thêm phần tracking, phông xanh mà cả hai chương kia chưa nói tới. Slide 6 (3 loại tracker) và slide 15 (bảng tra nhanh CapCut vs Resolve) là hai slide bạn sẽ quay lại nhiều nhất.</p>
<p>Mọi tên nút và ranh giới miễn phí/Studio trên các slide này đã kiểm trên blackmagicdesign.com và capcut.com vào 09/2026, không nhớ theo bản cũ. Hai lượt chạy ffmpeg thật — key phông xanh tự tạo và làm mờ bám theo chuyển động — nằm ở Bài 18.3 và 18.2 với output đo được thật, không phải mô tả lý thuyết.</p></div>
${gallery('cr-18', SLIDES)}
`,
    },

    /* ─────────────────── 18.1 Mask & rotoscope thủ công ─────────────────── */
    {
      title: '18.1 — Masks and manual rotoscope|||18.1 — Mask & rotoscope thủ công',
      slug: 'cr-18-1-mask-rotoscope',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Mask hình học, feather, đảo mask; animate mask theo keyframe (roto thủ công); che thông tin nhạy cảm và làm chữ xuất hiện sau vật; Power Window của Resolve và Mask của CapCut; tách chủ thể bằng AI.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 18 · Lesson 18.1</span>
<h2>A mask is just "which pixels count" — everything else in this chapter builds on that one idea</h2>
<p class="lead">Chapter 12 mentioned CapCut's Mask in one paragraph, as a tool you "would not need often." This chapter is exactly where you need it: hiding a phone number on screen, making a title appear only once an object has passed by, or carving out the person before a green-screen key even enters the picture. Once you can draw, soften and animate a mask on purpose, tracking (18.2) and green screen (18.3) are just masks that move by themselves.</p>

<h3>What a mask actually is</h3>
<p>A <strong>mask</strong> defines a shape on top of a layer — everything inside the shape is affected (shown, hidden, color-graded, blurred), everything outside is not. That is the whole idea. Every "advanced" masking feature in this lesson is one of three knobs on that same idea: how hard the edge is, whether inside or outside is the part that counts, and whether the shape itself moves over time.</p>

<h3>Hard edge, feather, and invert</h3>
${slide('cr-18', 3, 'Mask: cứng, mềm (feather), và đảo')}
<p>A mask with a perfectly crisp boundary is a <strong>hard edge</strong> — useful when you genuinely want a geometric shape to read as a shape (a circle frame, a comparison wipe), but on a real face or object it almost always looks like exactly what it is: a cutout pasted on top. <strong>Feather</strong> blurs that boundary into a gradient instead of a hard line, so the transition dissolves into the footage rather than sitting on top of it. Default to some feather; reach for zero only when the hard geometry is the point.</p>
<p><strong>Invert</strong> swaps which side counts — instead of the shape itself being the visible/affected area, everything <em>outside</em> the shape becomes the one that is. CapCut's own control for this is literally named <strong>Invert Mask</strong>. It is the difference between "spotlight this one thing" and "hide this one thing, show everything else" using the exact same drawn shape.</p>
<div class="callout ok"><p><strong>Default:</strong> turn feather on a little before you judge whether a mask "looks fake." A hard edge on skin or hair is one of the fastest tells that a video was edited by someone who has not done it much.</p></div>

<h3>CapCut's Mask, one level deeper than Chapter 12</h3>
<p>Select a clip or text layer → Properties panel → <strong>Video</strong> tab → <strong>Mask</strong> → add a mask and pick a shape. <strong>Circle</strong> is confirmed across every CapCut source that documents this panel; several guides also list Star, Rectangle and a horizontal/linear split — the exact shape list has moved between CapCut updates, so treat "several shapes including Circle" as the reliable part and check your own app's panel for the rest. What is solidly confirmed, by name, in CapCut's own material: <strong>Feather</strong> (softens the edge), <strong>Invert Mask</strong> (swaps inside/outside), and numeric Position/Rotation/Size fields — plus you can stack more than one mask on the same clip. The desktop app's numeric fields and keyframe curve editing are explicitly better here than on mobile, which matters for the next section.</p>

<h3>Roto by hand: animating a mask with keyframes</h3>
${slide('cr-18', 4, 'Roto thủ công: animate mask theo keyframe')}
<p><strong>Rotoscoping</strong> — matching a mask's shape and position to a moving subject, frame by frame or keyframe by keyframe — sounds like a Hollywood word, but you already do a lightweight version of it any time you keyframe a mask to follow a hand or a face. The workflow is the same shape in every editor:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Draw at frame one</span><span class="lz-d">Match the mask to the subject where the effect starts.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Adjust at the next key moment</span><span class="lz-d">Move forward to where the subject has moved or changed shape enough to matter, and re-fit the mask — most editors record a keyframe automatically the moment you touch it.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Let it interpolate</span><span class="lz-d">The software fills in every frame between two keyframes on its own.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Scrub at real speed</span><span class="lz-d">Fix any frame where the mask visibly drifts off the subject — this only shows up at playback speed, not on a still frame.</span></div>
</div>
<p>Use this for two very different jobs. <strong>Reveal:</strong> put text or a graphic behind an object, then animate a mask shaped like that object so the text only shows once the object has moved past it — the mask is doing the same job a real object physically blocking the camera would do, except you control exactly when. <strong>Conceal:</strong> a screen, a name tag, a piece of paper with something private on it — mask it, animate the mask to follow it if it moves, and only then apply a blur or a solid fill on top (more on this exact combination in Lesson 18.2, for faces and license plates specifically).</p>
<div class="callout warn"><p>This four-step loop is precisely what DaVinci Resolve Studio's <strong>Magic Mask</strong> automates with AI — it tracks a selected person or object across frames without you hand-adjusting each keyframe. It is a Neural Engine feature and is <strong>not included in the free version</strong> (confirmed on Blackmagic's own DaVinci Resolve Studio product page). On free Resolve, the four steps above — done by hand with a Power Window and keyframes — are the real path.</p></div>

<h3>Resolve: Power Window, and Fusion's mask (a preview)</h3>
<p>Chapter 15 used Resolve's <strong>Power Window</strong> to isolate skin tone for color correction. It is the same tool here, just pointed at a different job: any shape (circle, square, polygon, curve) you can draw on the Color page, feather with its own Softness control, invert, and animate — corrections happen inside a Power Window, but so can any node-based effect you route through it. Fusion, the node-based compositing page, has its own — more powerful — mask and paint tools for hand-drawn rotoscoping; Chapter 13 told you to skip Fusion for now, and this chapter keeps that promise. What you are learning here (feather, invert, keyframe-driven shape) is the same concept Fusion's masks use, just accessed from the Color page instead of a node graph. Chapter 19 opens Fusion up properly.</p>

<h3>Tools that draw the mask for you</h3>
${slide('cr-18', 5, 'Công cụ mask & tách chủ thể — CapCut vs Resolve')}
<p>Everything above assumes you draw the shape. Both apps also offer AI that finds the subject's outline on its own: CapCut's <strong>Remove BG → Auto removal</strong> (free, on both desktop and web, works without any green screen) and Resolve's <strong>Magic Mask</strong> (Studio only, tracks the selection across frames automatically). Both are genuinely useful and genuinely imperfect — thin details (flyaway hair, glasses frames, fast-moving fingers) are where AI segmentation still gets it wrong most often, which is exactly when you drop back to a hand-drawn, feathered, keyframed Power Window or CapCut mask instead of fighting the AI tool into submission.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — trusting a still frame.</strong> A mask that looks perfectly fitted when you pause on one frame can be visibly off two frames later, especially anywhere the subject turns, blinks, or moves a hand across the edge. Chapter 4 already taught you to distrust a single frame when shot-listing; the same discipline applies here — always confirm a mask at real playback speed before moving on.</p></div>
<p class="note-ct"><strong>Continuing into Lesson 18.2:</strong> a mask that follows a subject by itself, instead of you re-keyframing it by hand, is what a tracker does — three different kinds, depending on whether you are following a point, a flat surface, or the whole camera's motion through space.</p>

<h3>🎬 Practice (20–25 minutes)</h3>
<div class="callout ok"><ol>
<li>Draw a circular mask around your own face in CapCut (or a Power Window in Resolve) on a short clip.</li>
<li>Turn feather up from 0 to a visible amount and compare — screenshot both.</li>
<li>Toggle Invert on the same mask and note what changes.</li>
<li>Place a short line of text behind a moving object in the frame (hand, cup, phone) and keyframe a mask shaped like that object so the text is revealed only once the object passes it.</li>
<li>Scrub the result at real speed, not frame-by-frame, and fix any frame where the mask visibly drifts.</li>
</ol><p><strong>Done when:</strong> you can point at a masked edge in your own clip and say, out loud, whether it is hard or feathered, inverted or not, and why you chose that.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Mask</span><span class="v">A shape that decides which pixels of a layer are affected and which are not</span></div>
  <div class="kv"><span class="k">Feather</span><span class="v">Blurs a mask's edge into a gradient instead of a hard line</span></div>
  <div class="kv"><span class="k">Invert Mask</span><span class="v">Swaps which side of the shape counts — CapCut's exact button name</span></div>
  <div class="kv"><span class="k">Rotoscope (roto)</span><span class="v">Matching a mask to a moving subject over time, by hand or with AI assistance</span></div>
  <div class="kv"><span class="k">Power Window</span><span class="v">Resolve's Color-page shape tool — the same tool Chapter 15 used for skin-tone correction</span></div>
  <div class="kv"><span class="k">Magic Mask</span><span class="v">Resolve's AI auto-tracking mask — Studio only, not in the free version</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A mask is just "which pixels count" — hard vs. feathered edge, and inside vs. inverted, are the only two real knobs.</li>
<li>Animating a mask over keyframes is rotoscoping — draw, re-fit at the next key moment, let the software interpolate, then verify at real playback speed.</li>
<li>CapCut's Mask and Resolve's Power Window do the same underlying job; Fusion's masks (Chapter 19) are the same idea again, more powerful.</li>
<li>AI tools (CapCut Auto removal, free; Resolve Magic Mask, Studio only) draw the outline for you but still fail on thin detail — know how to fall back to manual masking.</li>
</ul>

<div class="link-card"><a href="https://www.blackmagicdesign.com/products/davinciresolve/studio" target="_blank" rel="noopener">Blackmagic Design — DaVinci Resolve Studio (Magic Mask under DaVinci Neural Engine)</a></div>
<div class="link-card"><a href="https://www.capcut.com/tools/mask-video-online" target="_blank" rel="noopener">CapCut — Mask tool (Feather, Invert Mask)</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 18 · Bài 18.1</span>
<h2>Mask chỉ đơn giản là "điểm ảnh nào được tính" — mọi thứ còn lại trong chương này dựng trên đúng một ý đó</h2>
<p class="lead">Chương 12 nhắc Mask của CapCut trong đúng một đoạn, coi nó là công cụ "sẽ không cần thường xuyên." Chương này chính là lúc bạn cần nó: che số điện thoại hiện trên màn hình, cho một dòng tiêu đề chỉ xuất hiện sau khi một vật đã đi qua, hoặc tách người ra trước cả khi bước key phông xanh bắt đầu. Một khi vẽ, làm mềm và animate được một mask có chủ đích, tracking (18.2) và phông xanh (18.3) chỉ là những mask tự di chuyển.</p>

<h3>Mask thật ra là gì</h3>
<p>Một <strong>mask</strong> định nghĩa một hình dạng trên một lớp — mọi thứ BÊN TRONG hình đó bị ảnh hưởng (hiện, ẩn, chỉnh màu, làm mờ), mọi thứ BÊN NGOÀI thì không. Chỉ vậy thôi. Mọi tính năng mask "nâng cao" trong bài này đều là một trong ba núm vặn trên cùng một ý tưởng đó: biên cứng tới đâu, bên trong hay bên ngoài là phần được tính, và hình dạng đó có tự di chuyển theo thời gian hay không.</p>

<h3>Biên cứng, feather, và đảo</h3>
${slide('cr-18', 3, 'Mask: cứng, mềm (feather), và đảo')}
<p>Một mask có biên hoàn toàn sắc nét là <strong>biên cứng</strong> (hard edge) — hữu ích khi bạn THẬT SỰ muốn một hình học đọc rõ là một hình (khung tròn, wipe so sánh), nhưng trên một khuôn mặt hay vật thể thật, nó gần như luôn trông đúng như bản chất của nó: một miếng cắt dán đè lên. <strong>Feather</strong> làm mờ biên đó thành một dải chuyển màu thay vì một đường thẳng, để phần chuyển tiếp tan vào cảnh quay thay vì nằm đè lên trên. Mặc định nên bật một chút feather; chỉ để 0 khi chính hình học cứng đó là điểm nhấn bạn muốn.</p>
<p><strong>Đảo</strong> (invert) hoán đổi bên nào được tính — thay vì chính hình vẽ là vùng hiện/bị ảnh hưởng, mọi thứ BÊN NGOÀI hình đó trở thành vùng được tính. Nút của CapCut cho việc này có tên đúng là <strong>Invert Mask</strong>. Đó là khác biệt giữa "làm nổi bật đúng một thứ" và "che đúng một thứ, hiện mọi thứ còn lại" — dùng cùng một hình đã vẽ.</p>
<div class="callout ok"><p><strong>Mặc định:</strong> bật một chút feather trước khi đánh giá một mask có "trông giả" hay không. Biên cứng trên da hoặc tóc là một trong những dấu hiệu nhanh nhất cho thấy video được dựng bởi người chưa làm việc này nhiều.</p></div>

<h3>Mask của CapCut, sâu hơn một mức so với Chương 12</h3>
<p>Chọn một clip hoặc lớp chữ → bảng thuộc tính → tab <strong>Video</strong> → <strong>Mask</strong> → thêm một mask và chọn hình dạng. <strong>Circle (hình tròn)</strong> được xác nhận ở mọi nguồn CapCut có ghi lại bảng này; vài hướng dẫn khác còn liệt kê thêm Star, Rectangle và một dạng chia ngang/tuyến tính — danh sách hình dạng chính xác đã đổi qua các bản cập nhật CapCut, nên coi "vài hình trong đó có Circle" là phần chắc chắn, phần còn lại kiểm lại ngay trong bảng của app bạn đang dùng. Điều xác nhận chắc chắn, đúng tên, trong tài liệu của chính CapCut: <strong>Feather</strong> (làm mềm biên), <strong>Invert Mask</strong> (đảo trong/ngoài), và các ô số Position/Rotation/Size — cộng với việc bạn xếp CHỒNG được nhiều mask trên cùng một clip. Các ô số và chỉnh đường cong keyframe trên bản desktop được xác nhận tốt hơn hẳn bản di động, điều này quan trọng cho phần tiếp theo.</p>

<h3>Roto thủ công: animate mask bằng keyframe</h3>
${slide('cr-18', 4, 'Roto thủ công: animate mask theo keyframe')}
<p><strong>Rotoscope</strong> (roto) — khớp hình dạng và vị trí của một mask với một chủ thể đang chuyển động, từng khung hoặc từng keyframe — nghe như một từ của Hollywood, nhưng bạn đã làm một phiên bản nhẹ của nó bất cứ khi nào keyframe một mask để bám theo một bàn tay hay khuôn mặt. Quy trình có cùng hình dạng ở mọi trình dựng:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Vẽ ở khung đầu tiên</span><span class="lz-d">Khớp mask với chủ thể ở chỗ hiệu ứng bắt đầu.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Chỉnh lại ở khoảnh khắc quan trọng tiếp theo</span><span class="lz-d">Tiến tới chỗ chủ thể đã di chuyển/đổi hình đủ nhiều để đáng chỉnh, khớp lại mask — hầu hết trình dựng tự ghi một keyframe ngay khi bạn chạm vào.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Để phần mềm tự nội suy</span><span class="lz-d">Phần mềm tự lấp đầy mọi khung giữa hai keyframe.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Tua ở tốc độ thực</span><span class="lz-d">Sửa khung nào mask lộ rõ bị trôi khỏi chủ thể — điều này chỉ lộ ra ở tốc độ phát thật, không phải trên một khung tĩnh.</span></div>
</div>
<p>Dùng cách này cho hai việc rất khác nhau. <strong>Lộ ra (reveal):</strong> đặt chữ hoặc đồ hoạ phía sau một vật, rồi animate một mask có hình dạng khớp vật đó để chữ chỉ hiện ra sau khi vật đã đi qua — mask đang làm đúng việc một vật thể thật sự che ống kính sẽ làm, chỉ khác là bạn kiểm soát chính xác lúc nào. <strong>Che đi (conceal):</strong> một màn hình, một thẻ tên, một tờ giấy có thông tin riêng tư — mask nó, animate mask bám theo nếu nó di chuyển, rồi MỚI áp blur hoặc một lớp phủ đặc lên trên (chi tiết đúng tổ hợp này ở Bài 18.2, riêng cho mặt người và biển số).</p>
<div class="callout warn"><p>Vòng lặp 4 bước này chính xác là điều <strong>Magic Mask</strong> của DaVinci Resolve Studio tự động hoá bằng AI — nó bám theo một người/vật đã chọn qua nhiều khung hình mà bạn không phải tự chỉnh từng keyframe. Đây là tính năng Neural Engine và <strong>không có trong bản miễn phí</strong> (đã xác nhận trên đúng trang sản phẩm DaVinci Resolve Studio của Blackmagic). Trên Resolve miễn phí, 4 bước trên — làm tay bằng Power Window và keyframe — là đường thật.</p></div>

<h3>Resolve: Power Window, và mask của Fusion (nhìn trước)</h3>
<p>Chương 15 đã dùng <strong>Power Window</strong> của Resolve để tách tông da cho việc chỉnh màu. Ở đây vẫn là công cụ đó, chỉ chĩa vào một việc khác: bất kỳ hình dạng nào (tròn, vuông, đa giác, đường cong) bạn vẽ được trên trang Color, làm mềm bằng núm Softness riêng, đảo, và animate — correction diễn ra bên trong một Power Window, nhưng bất kỳ hiệu ứng node nào bạn dẫn qua nó cũng vậy. Fusion, trang hợp thành theo node, có bộ công cụ mask và vẽ tay (paint) riêng — mạnh hơn — cho rotoscope thủ công; Chương 13 đã bảo bạn bỏ qua Fusion trước, và chương này giữ đúng lời hứa đó. Điều bạn đang học ở đây (feather, đảo, hình dạng điều khiển bằng keyframe) chính là ý tưởng mask của Fusion, chỉ truy cập từ trang Color thay vì một cây node. Chương 19 sẽ mở Fusion ra đàng hoàng.</p>

<h3>Công cụ tự vẽ mask thay bạn</h3>
${slide('cr-18', 5, 'Công cụ mask & tách chủ thể — CapCut vs Resolve')}
<p>Mọi thứ ở trên giả định bạn tự vẽ hình. Cả hai app còn có AI tự tìm đường viền chủ thể: <strong>Remove BG → Auto removal</strong> của CapCut (miễn phí, cả bản desktop lẫn web, không cần phông xanh) và <strong>Magic Mask</strong> của Resolve (chỉ Studio, tự bám theo vùng đã chọn qua nhiều khung hình). Cả hai đều thật sự hữu ích và thật sự không hoàn hảo — chi tiết mảnh (tóc bay, gọng kính, ngón tay di chuyển nhanh) là chỗ AI tách nền vẫn sai nhiều nhất, và đúng lúc đó là lúc quay lại vẽ tay, feather, keyframe một Power Window hay mask CapCut thay vì cố ép AI làm đúng bằng được.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — tin vào một khung tĩnh.</strong> Một mask trông khớp hoàn hảo khi bạn dừng ở một khung có thể lệch rõ rệt hai khung sau đó, nhất là chỗ chủ thể quay đầu, chớp mắt, hoặc đưa tay qua biên. Chương 4 đã dạy bạn đừng tin một khung hình đơn lẻ khi lập shot list; kỷ luật đó áp dụng y hệt ở đây — luôn xác nhận một mask ở tốc độ phát thật trước khi đi tiếp.</p></div>
<p class="note-ct"><strong>Nối với Bài 18.2:</strong> một mask tự bám theo chủ thể, thay vì bạn tự keyframe lại bằng tay, chính là việc một tracker làm — ba kiểu khác nhau, tuỳ bạn đang bám một điểm, một mặt phẳng, hay cả chuyển động của máy quay trong không gian.</p>

<h3>🎬 Thực hành (20–25 phút)</h3>
<div class="callout ok"><ol>
<li>Vẽ một mask hình tròn quanh mặt bạn trong CapCut (hoặc một Power Window trong Resolve) trên một clip ngắn.</li>
<li>Tăng feather từ 0 lên một mức thấy rõ và so sánh — chụp lại cả hai.</li>
<li>Bật Invert trên cùng mask đó và ghi lại điều gì thay đổi.</li>
<li>Đặt một dòng chữ ngắn phía sau một vật đang di chuyển trong khung (tay, cốc, điện thoại), rồi keyframe một mask có hình khớp vật đó để chữ chỉ lộ ra sau khi vật đã đi qua.</li>
<li>Tua kết quả ở tốc độ thực, không phải từng khung, và sửa khung nào mask lộ rõ bị trôi.</li>
</ol><p><strong>Đạt khi:</strong> bạn chỉ được vào một biên đã mask trong chính clip của mình và nói thành lời nó cứng hay mềm, đảo hay không, và vì sao bạn chọn vậy.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Mask</span><span class="v">Một hình dạng quyết định điểm ảnh nào của một lớp bị ảnh hưởng, điểm ảnh nào không</span></div>
  <div class="kv"><span class="k">Feather</span><span class="v">Làm mờ biên một mask thành dải chuyển màu thay vì một đường cứng</span></div>
  <div class="kv"><span class="k">Invert Mask</span><span class="v">Hoán đổi bên nào được tính — đúng tên nút của CapCut</span></div>
  <div class="kv"><span class="k">Rotoscope (roto)</span><span class="v">Khớp một mask với chủ thể đang chuyển động theo thời gian, bằng tay hoặc có AI hỗ trợ</span></div>
  <div class="kv"><span class="k">Power Window</span><span class="v">Công cụ hình dạng trên trang Color của Resolve — đúng công cụ Chương 15 đã dùng để chỉnh tông da</span></div>
  <div class="kv"><span class="k">Magic Mask</span><span class="v">Mask tự bám theo bằng AI của Resolve — chỉ Studio, không có trong bản miễn phí</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mask chỉ đơn giản là "điểm ảnh nào được tính" — biên cứng vs feather, và trong vs đảo, là hai núm vặn thật sự duy nhất.</li>
<li>Animate mask qua keyframe chính là rotoscope — vẽ, khớp lại ở khoảnh khắc quan trọng tiếp theo, để phần mềm tự nội suy, rồi xác nhận ở tốc độ phát thật.</li>
<li>Mask của CapCut và Power Window của Resolve làm cùng một việc nền tảng; mask của Fusion (Chương 19) là cùng ý tưởng đó, mạnh hơn.</li>
<li>Công cụ AI (CapCut Auto removal, miễn phí; Resolve Magic Mask, chỉ Studio) tự vẽ đường viền thay bạn nhưng vẫn sai ở chi tiết mảnh — biết cách quay lại mask thủ công.</li>
</ul>

<div class="link-card"><a href="https://www.blackmagicdesign.com/products/davinciresolve/studio" target="_blank" rel="noopener">Blackmagic Design — DaVinci Resolve Studio (Magic Mask thuộc DaVinci Neural Engine)</a></div>
<div class="link-card"><a href="https://www.capcut.com/tools/mask-video-online" target="_blank" rel="noopener">CapCut — công cụ Mask (Feather, Invert Mask)</a></div>
</div>
`,
    },

    /* ─────────────────── 18.2 Tracking & ổn định hình ─────────────────── */
    {
      title: '18.2 — Tracking and stabilization|||18.2 — Tracking & ổn định hình',
      slug: 'cr-18-2-tracking-on-dinh',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Point tracker vs planar tracker vs camera tracker; gắn chữ/mũi tên theo vật; làm mờ mặt người lạ và biển số; ổn định hình và các chế độ Stabilizer; khi nào hậu kỳ không cứu được — kèm 1 lượt ffmpeg thật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 18 · Lesson 18.2</span>
<h2>A tracker is a mask that follows something by itself — pick the tracker by the shape of what you're following</h2>
<p class="lead">Lesson 18.1 ended on the four-step loop of re-keyframing a mask by hand. A tracker automates exactly that loop, but the three kinds of tracker are not interchangeable — each one assumes a different kind of motion, and picking the wrong one wastes the time it was supposed to save. This lesson also covers the single most legally relevant technique in the whole chapter: blurring a stranger's face or a license plate correctly.</p>

<h3>Three trackers, chosen by geometry, not by name</h3>
${slide('cr-18', 6, '3 loại tracker — point / planar / camera')}
<p>All three live on Resolve's Fusion page (Chapter 19 goes deeper into Fusion itself; this lesson only needs the tracking concept). <strong>Point tracker</strong> follows one high-contrast point — a mole, the corner of a sign, a screw head — useful when you need a label or arrow to stick to one moving spot and you don't care about the surface around it. <strong>Planar tracker</strong> follows a flat surface's four corners — a phone screen, a book cover, a laptop lid — and keeps working as that surface tilts or rotates in perspective, which a point tracker cannot do on its own. <strong>Camera tracker</strong> reconstructs the camera's own 3D motion through a scene, so you can place a 3D object that appears locked into real space as the camera moves around it — the heaviest of the three, and the one Chapter 19 will actually use.</p>
<p>Point tracking and planar tracking work in the free version of Resolve; camera tracking is a Fusion Studio feature (confirmed on Blackmagic's Fusion product page) — meaning it needs DaVinci Resolve Studio to use inside Resolve. A concrete example for planar tracking: track a book's cover on a desk and stick a label reading "read this one" onto it for the whole shot, even as the book shifts slightly or the shot has a small camera move — the label rides the tracked plane instead of sitting at one fixed screen position.</p>

<h3>Blurring a stranger's face or a license plate, correctly</h3>
${slide('cr-18', 7, 'Làm mờ mặt người lạ / biển số — quy trình 4 bước')}
<p>This combines Lesson 18.1's masking with this lesson's tracking into one specific, common job:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Mask it</span><span class="lz-d">Circle around a face, rectangle around a plate, at the first frame that needs it.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Track it</span><span class="lz-d">Point tracker for a face that turns and moves freely; planar tracker if the plate stays close to flat and only tilts with the car's angle.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Blur inside it, only</span><span class="lz-d">Apply Gaussian blur or a mosaic/pixelate effect constrained to the tracked mask — never the whole frame.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Play it back at real speed</span><span class="lz-d">A mask that "slips" off a face during a fast head turn only becomes visible at playback speed, never on a paused frame.</span></div>
</div>
<p>This is where Chapter 10's <strong>right to one's image</strong> (Article 32, Vietnam's 2015 Civil Code) becomes a hands-on decision rather than a legal footnote: a stranger who is identifiable and is the actual subject or center of the shot — not just someone walking past in a crowd at a public event — does not fall under the public-activity exception, and needs either their consent or their face blurred before you publish. This is exactly the workflow above.</p>

<h3>Real ffmpeg: a blur region that follows motion</h3>
<p>Chapter 12's B-roll lesson already used a moving shape's position formula; the same idea makes a tracked blur without any GUI at all. A synthetic 3-second clip stands in for footage of a moving subject — a blue block sliding across a green background, its x-position following <code>250+30*sin(2*PI*t)</code>:</p>
<pre><code class="language-bash">ffmpeg -y -f lavfi -i "color=c=0x2AAA2A:s=640x360:d=3:r=25" \\
  -f lavfi -i "color=c=0x3B82F6:s=140x220:d=3:r=25" \\
  -filter_complex "[0:v][1:v]overlay=x='250+30*sin(2*PI*t)':y=90:shortest=1[out]" \\
  -map "[out]" nen-xanh-goc.mp4</code></pre>
<p>The blur uses the <strong>same</strong> position formula for its crop region, so the blurred box moves with the subject instead of sitting still — a poor man's tracker, since the motion is a known formula here rather than something ffmpeg detects on its own:</p>
<pre><code class="language-bash">ffmpeg -y -i nen-xanh-goc.mp4 -filter_complex \\
"[0:v]crop=140:220:'250+30*sin(2*PI*t)':90,boxblur=12:3[bl];[0:v][bl]overlay=x='250+30*sin(2*PI*t)':y=90[out]" \\
-map "[out]" lam-mo-bam-theo.mp4</code></pre>
<p>Sampling actual pixel values across the subject's edge at frame 37 proves the difference. In the original, unblurred clip, color jumps in a single pixel — green, then immediately the subject's blue:</p>
<div class="out">GỐC   x=250…251 → (41,169,41) (42,171,42)   x=252 → (56,127,243)</div>
<p>In the blurred output, the same edge spreads across roughly six pixels instead of one — exactly what a boxblur does, softening a hard boundary into a gradient:</p>
<div class="out">MỜ    x=250…258 → (47,167,51) (47,131,236) (51,129,244) (52,130,245) (54,130,245) (58,129,244)</div>
<p>That six-pixel gradient, moving frame by frame with the crop's own position formula, is the measurable proof that a "tracked blur" is really just a mask (the crop region) whose position is a function of time — a real tracker in Resolve or CapCut just computes that function from the footage instead of you typing it.</p>

<h3>Stabilizing shaky footage</h3>
${slide('cr-18', 8, 'Ổn định hình (Stabilizer) — chế độ & mức')}
<p>Resolve's Stabilizer (Edit or Color page, Inspector) offers three analysis modes plus one strict mode. <strong>Translation</strong> analyzes pan and tilt only — the simplest, for mild shake. <strong>Similarity</strong> adds zoom and rotation — a reasonable default for most handheld footage. <strong>Perspective</strong> also analyzes perspective distortion, closer to what a heavier camera move needs. <strong>Camera Lock</strong> tries to remove all motion entirely, simulating a locked-off tripod shot — it looks unnatural on anything handheld and is rarely the right choice. CapCut's Stabilize (free on every platform, confirmed on capcut.com) is simpler on the surface: three levels — <strong>Recommended</strong>, <strong>Minimum cut</strong>, and <strong>Most stable</strong> — trading off how much of the frame gets cropped for how smooth the result looks.</p>
<div class="callout warn"><p>Stabilization ALWAYS costs some crop — the software needs room to shift the frame around to cancel shake, and the shakier the source, the more it has to crop. A real gimbal (your Pocket 3) delivering stable footage at the moment of capture always beats fixing it afterward, because post-production stabilization is a crop-and-shift trick, not a way to add information that was never recorded.</p></div>

<h3>When stabilization cannot save a shot</h3>
${slide('cr-18', 9, 'Khi nào Stabilizer KHÔNG cứu được')}
<p>Two failure cases are worth recognizing before you reach for the Stabilizer out of habit. <strong>Motion blur</strong> from too slow a shutter speed (Chapter 5's 180° rule) is baked into each individual frame — a blurred hand is blurred forever in that frame; stabilization repositions frames relative to each other, it does not sharpen the content inside one. <strong>Rolling shutter skew</strong> — vertical lines bending into a slant during a fast whip pan, because the sensor scans line by line instead of capturing the whole frame at once — is also baked into each frame's own geometry; overall shake goes down, but that internal skew stays exactly as recorded. Recognizing these two in advance is more useful than discovering them after a stabilization pass "didn't work."</p>
<p class="note-ct"><strong>Connects to next:</strong> Lesson 18.3 puts tracking and masking to work on the technique creators ask about most — green screen — starting with the shooting setup that decides whether the key is even possible.</p>

<h3>🎬 Practice (25–30 minutes)</h3>
<div class="callout ok"><ol>
<li>Pick a moving object in any of your own footage and track it — point tracker if it's a single distinct feature, planar tracker if it's a flat surface (book, phone screen, sign).</li>
<li>Attach a text label or arrow to the tracked point/plane and confirm it holds position through the whole shot.</li>
<li>On a clip with a face or plate that should not be public, mask it, track it, and blur only inside the mask — check the result at full playback speed.</li>
<li>Run the two ffmpeg commands above yourself on a fresh synthetic clip and confirm your own sampled pixels show the same sharp-vs-gradual pattern.</li>
<li>Stabilize one shaky clip at two different settings (e.g., Similarity vs. Perspective, or Minimum cut vs. Most stable) and compare how much gets cropped.</li>
</ol><p><strong>Done when:</strong> given any clip, you can say in one sentence which of the three trackers you'd reach for and why — and recognize on sight whether a shaky clip is a stabilization problem or a motion-blur/rolling-shutter problem stabilization can't fix.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Point tracker</span><span class="v">Follows one high-contrast point through a shot</span></div>
  <div class="kv"><span class="k">Planar tracker</span><span class="v">Follows a flat surface's corners, including tilt/rotation in perspective</span></div>
  <div class="kv"><span class="k">Camera tracker</span><span class="v">Reconstructs the camera's 3D motion — Fusion Studio only</span></div>
  <div class="kv"><span class="k">Rolling shutter</span><span class="v">Sensor scanned line by line — fast pans skew straight lines; not fixable by stabilizing</span></div>
  <div class="kv"><span class="k">Camera Lock</span><span class="v">Resolve's strictest stabilization mode — tries to remove all motion</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Choose a tracker by the shape of what moves: one point → point tracker, a flat surface → planar tracker, the whole 3D scene → camera tracker (Studio only).</li>
<li>Blurring a face/plate correctly is mask → track → blur-inside-the-mask-only → verify at real speed — never blur the whole frame.</li>
<li>A tracked blur is mathematically just a mask whose position is a function of time — proven here with a real ffmpeg crop expression and measured pixel values.</li>
<li>Stabilization always costs crop, and cannot fix motion blur or rolling-shutter skew baked into individual frames — a real gimbal at capture time still wins.</li>
</ul>

<div class="link-card"><a href="https://www.blackmagicdesign.com/products/fusion" target="_blank" rel="noopener">Blackmagic Design — Fusion (Camera Tracker under Fusion Studio)</a></div>
<div class="link-card"><a href="https://www.capcut.com/resource/capcut-stabilizer" target="_blank" rel="noopener">CapCut — Stabilizer (Recommended / Minimum cut / Most stable, free)</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 18 · Bài 18.2</span>
<h2>Tracker là một mask tự bám theo — chọn tracker theo HÌNH DẠNG của thứ đang chuyển động</h2>
<p class="lead">Bài 18.1 kết thúc ở vòng lặp 4 bước tự chỉnh lại mask bằng tay. Một tracker tự động hoá đúng vòng lặp đó, nhưng ba kiểu tracker không thay thế nhau được — mỗi kiểu giả định một dạng chuyển động khác nhau, chọn sai kiểu là tốn đúng thời gian nó đáng lẽ tiết kiệm. Bài này còn nói tới kỹ thuật liên quan luật pháp nhất cả chương: làm mờ mặt người lạ hoặc biển số ĐÚNG cách.</p>

<h3>Ba loại tracker, chọn theo hình học, không theo tên</h3>
${slide('cr-18', 6, '3 loại tracker — point / planar / camera')}
<p>Cả ba sống trên trang Fusion của Resolve (Chương 19 sẽ đi sâu vào chính Fusion; bài này chỉ cần khái niệm tracking). <strong>Point tracker</strong> bám theo MỘT điểm tương phản cao — nốt ruồi, góc một tấm biển, đầu ốc vít — hữu ích khi bạn cần một nhãn/mũi tên dính vào đúng một điểm di chuyển và không quan tâm bề mặt xung quanh. <strong>Planar tracker</strong> bám theo 4 góc của MỘT mặt phẳng — màn hình điện thoại, bìa sách, nắp laptop — và vẫn hoạt động khi mặt phẳng đó nghiêng hay xoay theo phối cảnh, điều một point tracker không tự làm được. <strong>Camera tracker</strong> dựng lại chính chuyển động 3D của máy quay trong không gian, để bạn đặt một vật thể 3D trông như "dính" vào không gian thật khi máy quay di chuyển quanh nó — nặng nhất trong ba loại, và là loại Chương 19 sẽ thật sự dùng.</p>
<p>Point tracker và planar tracker dùng được ở bản Resolve miễn phí; camera tracker là tính năng của Fusion Studio (đã xác nhận trên trang sản phẩm Fusion của Blackmagic) — nghĩa là cần DaVinci Resolve Studio để dùng bên trong Resolve. Một ví dụ cụ thể cho planar tracker: track bìa một cuốn sách trên bàn rồi dán nhãn "đọc cuốn này" lên nó suốt cả cảnh, kể cả khi cuốn sách hơi xê dịch hay cảnh có một cú lia máy nhỏ — nhãn bám theo mặt phẳng đã track thay vì đứng yên ở một vị trí cố định trên màn hình.</p>

<h3>Làm mờ mặt người lạ hoặc biển số, ĐÚNG cách</h3>
${slide('cr-18', 7, 'Làm mờ mặt người lạ / biển số — quy trình 4 bước')}
<p>Phần này ghép mask của Bài 18.1 với tracking của bài này thành một việc cụ thể, thường gặp:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Mask nó</span><span class="lz-d">Hình tròn quanh mặt, hình chữ nhật quanh biển số, ở khung đầu tiên cần che.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Track nó</span><span class="lz-d">Point tracker cho một khuôn mặt xoay và di chuyển tự do; planar tracker nếu biển số gần như phẳng và chỉ nghiêng theo góc xe.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Chỉ làm mờ BÊN TRONG mask</span><span class="lz-d">Áp Gaussian blur hoặc mosaic/pixelate giới hạn trong mask đã track — không bao giờ cả khung hình.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Phát lại ở tốc độ thực</span><span class="lz-d">Một mask "trượt" khỏi mặt khi quay đầu nhanh chỉ lộ ra ở tốc độ phát thật, không bao giờ trên một khung dừng lại.</span></div>
</div>
<p>Đây chính là chỗ <strong>quyền đối với hình ảnh</strong> ở Chương 10 (Điều 32, Bộ luật Dân sự 2015) trở thành một quyết định thực tế thay vì một chú thích luật khô khan: một người lạ nhận diện được và thật sự là chủ thể hay trung tâm cảnh quay — không chỉ đi ngang qua trong đám đông ở một sự kiện công cộng — không thuộc ngoại lệ hoạt động công cộng, và cần được xin phép hoặc làm mờ mặt trước khi đăng. Đúng bằng quy trình 4 bước ở trên.</p>

<h3>ffmpeg thật: vùng làm mờ bám theo chuyển động</h3>
<p>Bài B-roll ở Chương 12 đã dùng công thức vị trí của một hình di chuyển; cùng ý tưởng đó tạo ra một vùng làm mờ "bám theo" mà không cần giao diện nào cả. Một clip thử 3 giây đứng thay cho cảnh quay có chủ thể di chuyển — một khối xanh dương trượt qua nền xanh lá, toạ độ x của nó theo công thức <code>250+30*sin(2*PI*t)</code>:</p>
<pre><code class="language-bash">ffmpeg -y -f lavfi -i "color=c=0x2AAA2A:s=640x360:d=3:r=25" \\
  -f lavfi -i "color=c=0x3B82F6:s=140x220:d=3:r=25" \\
  -filter_complex "[0:v][1:v]overlay=x='250+30*sin(2*PI*t)':y=90:shortest=1[out]" \\
  -map "[out]" nen-xanh-goc.mp4</code></pre>
<p>Vùng làm mờ dùng ĐÚNG cùng công thức vị trí cho vùng crop của nó, nên khối mờ di chuyển theo chủ thể thay vì đứng yên — một kiểu tracker "nghèo", vì chuyển động ở đây là một công thức đã biết chứ không phải điều ffmpeg tự phát hiện:</p>
<pre><code class="language-bash">ffmpeg -y -i nen-xanh-goc.mp4 -filter_complex \\
"[0:v]crop=140:220:'250+30*sin(2*PI*t)':90,boxblur=12:3[bl];[0:v][bl]overlay=x='250+30*sin(2*PI*t)':y=90[out]" \\
-map "[out]" lam-mo-bam-theo.mp4</code></pre>
<p>Đo thật giá trị điểm ảnh ngang qua mép chủ thể ở khung 37 chứng minh sự khác biệt. Ở clip GỐC chưa làm mờ, màu nhảy đúng một điểm ảnh — xanh lá, rồi ngay lập tức là xanh dương của chủ thể:</p>
<div class="out">GỐC   x=250…251 → (41,169,41) (42,171,42)   x=252 → (56,127,243)</div>
<p>Ở output đã làm mờ, cùng mép đó trải rộng ra khoảng sáu điểm ảnh thay vì một — đúng điều một boxblur làm, biến một biên cứng thành một dải chuyển màu:</p>
<div class="out">MỜ    x=250…258 → (47,167,51) (47,131,236) (51,129,244) (52,130,245) (54,130,245) (58,129,244)</div>
<p>Dải chuyển màu sáu điểm ảnh đó, di chuyển từng khung theo đúng công thức vị trí của vùng crop, là bằng chứng đo được rằng một "vùng mờ bám theo" thật ra chỉ là một mask (vùng crop) có vị trí là một hàm theo thời gian — một tracker thật trong Resolve hay CapCut chỉ tính hàm đó từ chính cảnh quay thay vì bạn tự gõ ra.</p>

<h3>Ổn định cảnh quay bị rung</h3>
${slide('cr-18', 8, 'Ổn định hình (Stabilizer) — chế độ & mức')}
<p>Stabilizer của Resolve (trang Edit hoặc Color, trong Inspector) có ba chế độ phân tích cộng một chế độ nghiêm ngặt. <strong>Translation</strong> chỉ phân tích pan và tilt — đơn giản nhất, cho rung nhẹ. <strong>Similarity</strong> thêm zoom và xoay — mặc định hợp lý cho phần lớn cảnh quay cầm tay. <strong>Perspective</strong> còn phân tích cả méo phối cảnh, gần với thứ một chuyển động máy quay nặng hơn cần. <strong>Camera Lock</strong> cố xoá sạch mọi chuyển động, mô phỏng một cảnh quay tripod cố định hoàn toàn — trông không tự nhiên trên bất cứ cảnh cầm tay nào và hiếm khi là lựa chọn đúng. Stabilize của CapCut (miễn phí trên mọi nền tảng, đã xác nhận trên capcut.com) đơn giản hơn trên bề mặt: ba mức — <strong>Recommended</strong>, <strong>Minimum cut</strong>, và <strong>Most stable</strong> — đánh đổi giữa crop bao nhiêu khung hình và kết quả mượt tới đâu.</p>
<div class="callout warn"><p>Ổn định hình LUÔN tốn một phần crop — phần mềm cần chỗ để dịch khung hình quanh nhằm triệt tiêu rung, và nguồn càng rung, càng phải crop nhiều. Một gimbal thật (Pocket 3 của bạn) cho ra cảnh quay ổn định NGAY lúc quay luôn thắng việc sửa sau, vì ổn định hậu kỳ là một mẹo crop-và-dịch, không phải cách thêm thông tin chưa từng được ghi lại.</p></div>

<h3>Khi nào ổn định hình không cứu được</h3>
${slide('cr-18', 9, 'Khi nào Stabilizer KHÔNG cứu được')}
<p>Hai trường hợp thất bại đáng nhận ra trước khi bạn theo thói quen bấm Stabilizer. <strong>Nhoè chuyển động</strong> do màn trập quá chậm (quy tắc 180° ở Chương 5) đã "in" sẵn vào từng khung hình riêng lẻ — một bàn tay nhoè thì nhoè mãi mãi trong đúng khung đó; ổn định hình dịch chuyển các khung SO VỚI NHAU, nó không làm nét lại nội dung bên trong một khung. <strong>Méo hình rolling shutter</strong> — đường thẳng đứng bị bẻ xiên khi lia máy nhanh, vì cảm biến quét từng dòng thay vì chụp trọn khung cùng lúc — cũng đã "in" sẵn vào chính hình học của từng khung; rung tổng thể giảm xuống, nhưng độ méo nội tại đó vẫn nguyên như đã ghi. Nhận ra trước hai điều này hữu ích hơn nhiều so với phát hiện ra SAU KHI một lượt ổn định hình "không có tác dụng."</p>
<p class="note-ct"><strong>Nối với Bài 18.3:</strong> Bài 18.3 đưa tracking và mask vào đúng kỹ thuật creator hay hỏi nhất — phông xanh — bắt đầu từ khâu quay quyết định việc key có khả thi hay không.</p>

<h3>🎬 Thực hành (25–30 phút)</h3>
<div class="callout ok"><ol>
<li>Chọn một vật đang chuyển động trong cảnh quay của chính bạn và track nó — point tracker nếu là một chi tiết riêng biệt, planar tracker nếu là một mặt phẳng (sách, màn hình điện thoại, biển hiệu).</li>
<li>Gắn một nhãn chữ hoặc mũi tên vào điểm/mặt phẳng đã track và xác nhận nó giữ đúng vị trí suốt cả cảnh.</li>
<li>Trên một clip có mặt người hoặc biển số không nên công khai, mask nó, track nó, và chỉ làm mờ bên trong mask — kiểm kết quả ở tốc độ phát đầy đủ.</li>
<li>Tự chạy hai lệnh ffmpeg ở trên trên một clip thử mới và xác nhận điểm ảnh bạn tự đo cho ra đúng dạng sắc-vs-dần như trên.</li>
<li>Ổn định một clip bị rung ở hai thiết lập khác nhau (vd Similarity vs Perspective, hoặc Minimum cut vs Most stable) và so sánh crop mất bao nhiêu.</li>
</ol><p><strong>Đạt khi:</strong> với bất kỳ clip nào, bạn nói được trong một câu sẽ chọn tracker nào trong ba loại và vì sao — và nhận ra ngay một clip rung là vấn đề của ổn định hình hay vấn đề nhoè chuyển động/rolling shutter mà ổn định hình không sửa được.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Point tracker</span><span class="v">Bám theo một điểm tương phản cao suốt cảnh</span></div>
  <div class="kv"><span class="k">Planar tracker</span><span class="v">Bám theo các góc một mặt phẳng, kể cả khi nghiêng/xoay theo phối cảnh</span></div>
  <div class="kv"><span class="k">Camera tracker</span><span class="v">Dựng lại chuyển động 3D của máy quay — chỉ Fusion Studio</span></div>
  <div class="kv"><span class="k">Rolling shutter</span><span class="v">Cảm biến quét từng dòng — lia máy nhanh làm đường thẳng bị xiên; không sửa được bằng ổn định hình</span></div>
  <div class="kv"><span class="k">Camera Lock</span><span class="v">Chế độ ổn định nghiêm ngặt nhất của Resolve — cố xoá sạch mọi chuyển động</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Chọn tracker theo hình dạng của thứ đang chuyển động: một điểm → point tracker, một mặt phẳng → planar tracker, cả cảnh 3D → camera tracker (chỉ Studio).</li>
<li>Làm mờ mặt/biển số đúng cách là mask → track → chỉ làm mờ bên trong mask → xác nhận ở tốc độ thực — không bao giờ làm mờ cả khung hình.</li>
<li>Một vùng mờ "bám theo" về mặt toán học chỉ là một mask có vị trí là hàm theo thời gian — chứng minh ở đây bằng một biểu thức crop ffmpeg thật và giá trị điểm ảnh đo được.</li>
<li>Ổn định hình luôn tốn crop, và không sửa được nhoè chuyển động hay méo rolling shutter đã in sẵn trong từng khung — một gimbal thật lúc quay vẫn thắng.</li>
</ul>

<div class="link-card"><a href="https://www.blackmagicdesign.com/products/fusion" target="_blank" rel="noopener">Blackmagic Design — Fusion (Camera Tracker thuộc Fusion Studio)</a></div>
<div class="link-card"><a href="https://www.capcut.com/resource/capcut-stabilizer" target="_blank" rel="noopener">CapCut — Stabilizer (Recommended / Minimum cut / Most stable, miễn phí)</a></div>
</div>
`,
    },

    /* ─────────────────── 18.3 Phông xanh & tách nền ─────────────────── */
    {
      title: '18.3 — Green screen and background removal|||18.3 — Phông xanh & tách nền',
      slug: 'cr-18-3-phong-xanh-tach-nen',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Quay phông xanh đúng cách; CapCut Chroma Key và Resolve 3D/Delta Keyer; dọn viền (spill suppression); ghép nền khớp ánh sáng; tách nền AI không cần phông — kèm 1 lượt ffmpeg chromakey thật đo bằng điểm ảnh.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 18 · Lesson 18.3</span>
<h2>A clean green-screen key is decided before you ever open the software</h2>
<p class="lead">Most "chroma key doesn't work" complaints are not software problems — they are shooting problems the keyer was never going to be able to fix. This lesson puts the shooting checklist first, on purpose, then shows the actual key and cleanup tools in CapCut and Resolve, backed by a real ffmpeg key you can inspect pixel by pixel.</p>

<h3>Shoot it right, and the key becomes easy</h3>
${slide('cr-18', 10, 'Phông xanh nhìn từ trên: khoảng cách người–phông')}
<p>Five things decide whether a key will be clean, and every one of them happens before you press record, not in the software afterward:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Flat screen</span><span class="v">No wrinkles or folds — a crease catches light unevenly and shows up as a patchy, half-keyed edge no keyer settings can fully fix</span></div>
  <div class="kv"><span class="k">Even light on the screen</span><span class="v">The screen needs its OWN light, separate from the light on you — an uneven screen keys unevenly, full stop</span></div>
  <div class="kv"><span class="k">1–2 m distance from the screen</span><span class="v">Standing close bounces green light back onto skin and hair (spill) and casts your own shadow onto the screen</span></div>
  <div class="kv"><span class="k">Clothing that doesn't match the screen</span><span class="v">Wear a green shirt in front of a green screen and the shirt gets keyed out along with the background</span></div>
  <div class="kv"><span class="k">Fast enough shutter</span><span class="v">Chapter 5's 180° rule (1/50 at 25fps) is the baseline — hair and hands blurred by too slow a shutter produce a mushy, hard-to-key edge even before color is involved</span></div>
</div>
<p>Shoot in 10-bit if your camera supports it (Chapter 5 covered 8-bit vs. 10-bit banding) — a key that gets pushed hard in grading benefits from the extra color precision the same way any aggressive grade does.</p>
${slide('cr-18', 11, 'Quay phông xanh — sai vs đúng')}
<p>Every item on the right side of that comparison is one of the five habits above, restated as a checklist you can run through in the thirty seconds before you hit record.</p>

<h3>Real ffmpeg: keying a synthetic green screen and proving the swap</h3>
<p>A 3-second synthetic clip stands in for real green-screen footage — solid green background, a solid blue block as the "subject":</p>
<pre><code class="language-bash">ffmpeg -y -f lavfi -i "color=c=0x2AAA2A:s=640x360:d=3:r=25" \\
  -f lavfi -i "color=c=0x3B82F6:s=140x220:d=3:r=25" \\
  -filter_complex "[0:v][1:v]overlay=x='250+30*sin(2*PI*t)':y=90:shortest=1[out]" \\
  -map "[out]" nen-xanh-goc.mp4</code></pre>
<p>ffmpeg's <code>chromakey</code> filter removes the green (designed specifically for green/blue-screen work, thresholding in YUV space), then <code>overlay</code> composites the result onto a brand-new dark-blue background:</p>
<pre><code class="language-bash">ffmpeg -y -i nen-xanh-goc.mp4 -f lavfi -i "color=c=0x0B3D91:s=640x360:d=3:r=25" \\
  -filter_complex "[0:v]chromakey=0x2AAA2A:0.12:0.06[keyed];[1:v][keyed]overlay=shortest=1[out]" \\
  -map "[out]" ghep-nen-moi.mp4</code></pre>
<p>Sampling a background-only pixel proves the swap actually happened, not just that the command exited without an error:</p>
<div class="out">Nền TRƯỚC key   → RGB(41,169,41)   — xanh lá gốc
Nền SAU key     → RGB(10,61,143)   — khớp nền mới 0x0B3D91 = RGB(11,61,145)</div>
<p>And sampling a pixel on the subject itself proves the key did NOT eat the subject along with the background:</p>
<div class="out">Chủ thể SAU key → RGB(58,129,244)  — khớp màu gốc 0x3B82F6 = RGB(59,130,246)</div>
<p>ffmpeg's other keying filter, <code>colorkey</code>, works in plain RGB distance instead of YUV — run with similar thresholds on the same clip it produced essentially the same result here <code>RGB(10,61,143)</code>. In a real editor, <strong>chromakey-style tools generally handle skin tones and fine edges (hair) better</strong> precisely because they separate luma from chroma before thresholding, which is why Resolve's actual keyers (below) work in that space too.</p>

<h3>Keying and cleanup in CapCut and Resolve</h3>
${slide('cr-18', 12, 'Key & dọn viền (spill suppression)')}
<p>CapCut: select the clip → <strong>Video → Remove BG → Chroma Key</strong>, enable it, use the color picker to sample the actual green from your footage, then raise <strong>Strength</strong> until the green disappears without eating into the subject, and <strong>Shadow</strong> to neutralize the leftover tint at the edges — both names confirmed directly on CapCut's own chroma-key guide. Resolve: the <strong>3D Keyer</strong> and <strong>Delta Keyer</strong> both live on the Color page and both work in the free version (confirmed on Blackmagic's product pages) — Delta Keyer generally produces a cleaner key with more parameters to tune; 3D Keyer is faster to reach for a quick preview. The <strong>Ultra Keyer</strong> lives on the Fusion page — Chapter 19 territory.</p>
<p><strong>Spill suppression</strong> is the separate step that removes the leftover green tint clinging to hair and skin edges after the main key is otherwise clean — CapCut folds this into the <strong>Shadow</strong> slider in the same panel; Resolve gives each keyer its own dedicated spill-suppression control. The common beginner mistake is trying to fix spill by cranking the main key's strength higher instead — that erodes fine detail (hair strands especially) rather than fixing the actual problem.</p>

<h3>Matching the new background's light</h3>
<p>A perfectly clean key still looks obviously fake if the light direction on the new background doesn't match the light direction on your subject — Chapter 8's 45° key-light habit applies here too: if your subject is lit from camera-left, a new background lit from the opposite side reads as "pasted on" even with zero visible key edge artifacts. Matching light direction, and roughly matching contrast/color temperature between subject and background, does more for believability than any amount of extra key-cleanup time.</p>

<h3>AI background removal without a green screen at all</h3>
<p>CapCut's <strong>Remove BG → Auto removal</strong> and Resolve's <strong>Magic Mask</strong> (Studio only — see Lesson 18.1) both segment a subject from an ordinary background using AI, with no physical screen required. The upside is obvious: no need to build a green-screen corner in a small rented room. The downside, honestly stated: fine detail — flyaway hair, glasses, fast hand motion — keys less precisely than a real green screen under even light, and a visually busy or poorly lit background trips up the segmentation more than a clean green screen ever would. Use AI removal for quick, forgiving shots; build the actual screen when a clean edge matters (a product demo, a thumbnail-worthy composite).</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — fixing bad lighting in the keyer instead of the room.</strong> No amount of Strength/Shadow tuning turns an unevenly lit, wrinkled screen into a clean key — those settings compensate for small imperfections, not for skipping the shooting checklist at the top of this lesson entirely. If the key still looks patchy after reasonable tuning, go back and re-light the screen rather than pushing the keyer's settings further.</p></div>
<p class="note-ct"><strong>Connects to next:</strong> Lesson 18.4 uses everything from this chapter — masks, trackers, and keys — on the actual VFX tricks creators reach for most: cloning yourself, swapping a screen, and knowing exactly when a technique like this legally needs a disclosure and when it doesn't.</p>

<h3>🎬 Practice (30–40 minutes)</h3>
<div class="callout ok"><ol>
<li>Build a small green-screen corner (fabric, paper, or even a solid-color wall) using the five-point checklist above — even/separate light on the screen, 1–2 m distance, non-matching clothing.</li>
<li>Shoot 10 seconds and key it with CapCut's Chroma Key or Resolve's 3D/Delta Keyer.</li>
<li>Deliberately break one rule (stand closer than 1 m, or wear a green shirt) on a second take and compare the key quality side by side.</li>
<li>Run the two ffmpeg commands above yourself and confirm your own sampled pixels match the pattern shown.</li>
<li>If you have access to Resolve Studio or CapCut's Auto removal, key the same clip without a physical screen and compare edge quality on hair specifically.</li>
</ol><p><strong>Done when:</strong> you can look at any green-screen shot online and name, from the edges alone, at least one shooting mistake from the checklist above.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Spill</span><span class="v">Green light bouncing off the screen onto skin/hair, visible as a tint after keying</span></div>
  <div class="kv"><span class="k">Spill suppression</span><span class="v">The cleanup step that removes leftover green tint, separate from the main key</span></div>
  <div class="kv"><span class="k">3D Keyer / Delta Keyer</span><span class="v">Resolve's Color-page keyers — both free; Delta generally keys cleaner</span></div>
  <div class="kv"><span class="k">Chroma key vs. color key</span><span class="v">Chroma keying thresholds in YUV (luma/chroma separated); color keying thresholds in plain RGB distance</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A clean key is decided at shoot time: flat screen, even dedicated light on it, 1–2 m subject distance, non-matching clothing, fast enough shutter.</li>
<li>CapCut's Chroma Key (Strength/Shadow/Feather) and Resolve's free 3D/Delta Keyer do the same core job — Ultra Keyer lives in Fusion (Chapter 19).</li>
<li>Spill suppression is a separate step from the main key — don't fix hair tint by cranking key strength.</li>
<li>AI removal (CapCut Auto removal, free; Resolve Magic Mask, Studio) skips the physical screen but loses precision on fine detail.</li>
</ul>

<div class="link-card"><a href="https://www.capcut.com/resource/how-to-remove-green-screen-in-capcut" target="_blank" rel="noopener">CapCut — Chroma Key steps (Strength, Shadow, Feather)</a></div>
<div class="link-card"><a href="https://www.blackmagicdesign.com/products/davinciresolve/color" target="_blank" rel="noopener">Blackmagic Design — DaVinci Resolve Color page (keyers, Power Windows, tracking)</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 18 · Bài 18.3</span>
<h2>Một lượt key phông xanh sạch được quyết định TRƯỚC KHI bạn mở phần mềm</h2>
<p class="lead">Phần lớn than phiền "chroma key không hoạt động" không phải lỗi phần mềm — mà là lỗi khâu quay mà bộ key chưa bao giờ có cơ hội sửa được. Bài này đặt checklist quay lên trước, có chủ đích, rồi mới tới công cụ key và dọn viền thật trong CapCut và Resolve, có một lượt key ffmpeg thật để soi từng điểm ảnh.</p>

<h3>Quay đúng, key sẽ dễ</h3>
${slide('cr-18', 10, 'Phông xanh nhìn từ trên: khoảng cách người–phông')}
<p>Năm điều quyết định một lượt key có sạch hay không, và tất cả xảy ra TRƯỚC khi bạn bấm quay, không phải trong phần mềm sau đó:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Phông phẳng</span><span class="v">Không nếp nhăn hay gấp khúc — một nếp gấp bắt sáng không đều và hiện ra thành một biên key loang lổ, không thiết lập nào của bộ key sửa hết được</span></div>
  <div class="kv"><span class="k">Ánh sáng ĐỀU trên phông</span><span class="v">Phông cần ĐÈN RIÊNG của nó, tách biệt khỏi đèn chiếu người — phông sáng không đều thì key không đều, chấm hết</span></div>
  <div class="kv"><span class="k">Cách phông 1–2 m</span><span class="v">Đứng gần hắt ánh xanh ngược lên da/tóc (spill) và đổ bóng của chính bạn lên phông</span></div>
  <div class="kv"><span class="k">Quần áo khác màu phông</span><span class="v">Mặc áo xanh trước phông xanh, áo bị key mất theo luôn nền</span></div>
  <div class="kv"><span class="k">Màn trập đủ nhanh</span><span class="v">Quy tắc 180° của Chương 5 (1/50 ở 25fps) là mức nền — tóc và tay nhoè vì màn trập quá chậm cho ra một biên key nhão, khó key ngay cả trước khi bàn tới màu sắc</span></div>
</div>
<p>Quay 10-bit nếu máy hỗ trợ (Chương 5 đã nói về banding 8-bit vs 10-bit) — một key bị đẩy mạnh khi grading hưởng lợi từ độ chính xác màu thêm đó, giống hệt bất kỳ lượt grading mạnh tay nào khác.</p>
${slide('cr-18', 11, 'Quay phông xanh — sai vs đúng')}
<p>Mọi điều ở cột bên phải trong bảng so sánh đó chính là một trong năm thói quen ở trên, viết lại thành một checklist bạn chạy qua trong ba mươi giây trước khi bấm quay.</p>

<h3>ffmpeg thật: key một phông xanh tự tạo và chứng minh việc đổi nền</h3>
<p>Một clip thử 3 giây đứng thay cho cảnh quay phông xanh thật — nền xanh lá đặc, một khối xanh dương đặc làm "chủ thể":</p>
<pre><code class="language-bash">ffmpeg -y -f lavfi -i "color=c=0x2AAA2A:s=640x360:d=3:r=25" \\
  -f lavfi -i "color=c=0x3B82F6:s=140x220:d=3:r=25" \\
  -filter_complex "[0:v][1:v]overlay=x='250+30*sin(2*PI*t)':y=90:shortest=1[out]" \\
  -map "[out]" nen-xanh-goc.mp4</code></pre>
<p>Filter <code>chromakey</code> của ffmpeg bóc màu xanh lá (thiết kế riêng cho phông xanh/xanh dương, ngưỡng hoá trong không gian YUV), rồi <code>overlay</code> ghép kết quả lên một nền xanh dương đậm hoàn toàn mới:</p>
<pre><code class="language-bash">ffmpeg -y -i nen-xanh-goc.mp4 -f lavfi -i "color=c=0x0B3D91:s=640x360:d=3:r=25" \\
  -filter_complex "[0:v]chromakey=0x2AAA2A:0.12:0.06[keyed];[1:v][keyed]overlay=shortest=1[out]" \\
  -map "[out]" ghep-nen-moi.mp4</code></pre>
<p>Lấy mẫu một điểm ảnh chỉ-có-nền chứng minh việc đổi nền THẬT SỰ diễn ra, không chỉ là lệnh chạy xong không báo lỗi:</p>
<div class="out">Nền TRƯỚC key   → RGB(41,169,41)   — xanh lá gốc
Nền SAU key     → RGB(10,61,143)   — khớp nền mới 0x0B3D91 = RGB(11,61,145)</div>
<p>Và lấy mẫu một điểm ảnh ngay trên chủ thể chứng minh key KHÔNG ăn nhầm chủ thể theo luôn nền:</p>
<div class="out">Chủ thể SAU key → RGB(58,129,244)  — khớp màu gốc 0x3B82F6 = RGB(59,130,246)</div>
<p>Filter key còn lại của ffmpeg, <code>colorkey</code>, hoạt động bằng khoảng cách RGB thuần thay vì YUV — chạy với ngưỡng tương tự trên cùng clip, nó cho ra gần như cùng kết quả ở đây, <code>RGB(10,61,143)</code>. Trong một trình dựng thật, <strong>các công cụ kiểu chromakey nhìn chung xử lý tông da và biên mảnh (tóc) tốt hơn</strong> chính vì chúng tách luma khỏi chroma trước khi ngưỡng hoá — lý do các keyer thật của Resolve (bên dưới) cũng hoạt động trong không gian đó.</p>

<h3>Key và dọn viền trong CapCut và Resolve</h3>
${slide('cr-18', 12, 'Key & dọn viền (spill suppression)')}
<p>CapCut: chọn clip → <strong>Video → Remove BG → Chroma Key</strong>, bật nó, dùng công cụ hút màu (color picker) lấy đúng màu xanh thật từ cảnh quay, rồi tăng <strong>Strength</strong> tới khi màu xanh biến mất mà không ăn vào chủ thể, và <strong>Shadow</strong> để trung hoà vệt màu còn sót ở viền — cả hai tên đã xác nhận trực tiếp trên đúng trang hướng dẫn chroma key của CapCut. Resolve: <strong>3D Keyer</strong> và <strong>Delta Keyer</strong> đều nằm trên trang Color và đều dùng được ở bản miễn phí (đã xác nhận trên trang sản phẩm của Blackmagic) — Delta Keyer thường cho key sạch hơn với nhiều tham số chỉnh hơn; 3D Keyer nhanh hơn cho một bản xem trước gấp. <strong>Ultra Keyer</strong> nằm ở trang Fusion — địa hạt Chương 19.</p>
<p><strong>Dọn viền (spill suppression)</strong> là bước RIÊNG xử lý vệt xanh còn sót bám vào tóc và viền da sau khi key chính đã sạch — CapCut gộp việc này vào thanh <strong>Shadow</strong> trong cùng panel; Resolve cho mỗi keyer một công cụ dọn viền riêng. Lỗi phổ biến của người mới là cố sửa spill bằng cách vặn tiếp Strength của key chính lên cao — điều đó ăn mòn chi tiết mảnh (đặc biệt sợi tóc) thay vì sửa đúng vấn đề.</p>

<h3>Khớp ánh sáng của nền mới</h3>
<p>Một key sạch hoàn hảo vẫn trông giả rõ ràng nếu hướng sáng trên nền mới không khớp hướng sáng trên chủ thể — thói quen key light 45° ở Chương 8 áp dụng đúng ở đây: nếu chủ thể được chiếu sáng từ bên trái máy quay, một nền mới được chiếu sáng từ phía ngược lại đọc thành "dán đè" ngay cả khi biên key không có lỗi nào thấy được. Khớp hướng sáng, và khớp tương đối độ tương phản/nhiệt độ màu giữa chủ thể và nền, giúp cho độ tin cậy nhiều hơn bất kỳ khoảng thời gian dọn key thêm nào.</p>

<h3>Tách nền bằng AI, hoàn toàn không cần phông xanh</h3>
<p><strong>Remove BG → Auto removal</strong> của CapCut và <strong>Magic Mask</strong> của Resolve (chỉ Studio — xem Bài 18.1) đều tách chủ thể khỏi một nền bình thường bằng AI, không cần phông vật lý nào. Điểm lợi rõ ràng: không cần dựng một góc phông xanh trong một phòng trọ nhỏ. Điểm bất lợi, nói thẳng: chi tiết mảnh — tóc bay, gọng kính, tay di chuyển nhanh — key kém chính xác hơn một phông xanh thật dưới ánh sáng đều, và một nền phức tạp hoặc thiếu sáng làm việc tách nền vấp nhiều hơn hẳn một phông xanh sạch. Dùng tách nền AI cho cảnh nhanh, dễ tính; dựng phông thật khi biên sạch thật sự quan trọng (demo sản phẩm, một cảnh ghép đủ đẹp để làm thumbnail).</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — sửa ánh sáng tồi bằng bộ key thay vì sửa căn phòng.</strong> Không mức chỉnh Strength/Shadow nào biến một phông có nếp nhăn, ánh sáng không đều thành một key sạch — những thiết lập đó bù cho khiếm khuyết NHỎ, không phải để bỏ qua hoàn toàn checklist quay ở đầu bài này. Nếu key vẫn loang lổ sau khi đã chỉnh hợp lý, quay lại chiếu sáng lại phông thay vì vặn tiếp thiết lập của bộ key.</p></div>
<p class="note-ct"><strong>Nối với Bài 18.4:</strong> Bài 18.4 dùng mọi thứ của chương này — mask, tracker, và key — vào đúng những trò VFX creator hay dùng nhất: nhân bản chính mình, thay màn hình, và biết chính xác khi nào một kỹ thuật kiểu này cần công bố theo luật, khi nào thì không.</p>

<h3>🎬 Thực hành (30–40 phút)</h3>
<div class="callout ok"><ol>
<li>Dựng một góc phông xanh nhỏ (vải, giấy, hoặc thậm chí một bức tường màu đơn sắc) theo đúng checklist 5 điểm ở trên — đèn riêng chiếu đều lên phông, cách 1–2 m, mặc đồ khác màu phông.</li>
<li>Quay 10 giây và key thử bằng Chroma Key của CapCut hoặc 3D/Delta Keyer của Resolve.</li>
<li>Cố tình phá một quy tắc (đứng gần hơn 1 m, hoặc mặc áo xanh) ở một lượt quay thứ hai và so sánh chất lượng key cạnh nhau.</li>
<li>Tự chạy hai lệnh ffmpeg ở trên và xác nhận điểm ảnh bạn tự đo khớp với mẫu đã nêu.</li>
<li>Nếu có Resolve Studio hoặc CapCut Auto removal, key cùng clip đó không cần phông vật lý và so sánh chất lượng biên riêng ở phần tóc.</li>
</ol><p><strong>Đạt khi:</strong> nhìn bất kỳ cảnh phông xanh nào trên mạng, bạn chỉ ra được, chỉ từ đường viền, ít nhất một lỗi quay theo đúng checklist ở trên.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Spill</span><span class="v">Ánh xanh hắt từ phông ngược lên da/tóc, hiện thành vệt màu sau khi key</span></div>
  <div class="kv"><span class="k">Spill suppression</span><span class="v">Bước dọn vệt xanh còn sót, tách biệt khỏi việc key chính</span></div>
  <div class="kv"><span class="k">3D Keyer / Delta Keyer</span><span class="v">Keyer trang Color của Resolve — cả hai miễn phí; Delta thường key sạch hơn</span></div>
  <div class="kv"><span class="k">Chroma key vs. color key</span><span class="v">Chroma key ngưỡng hoá trong YUV (tách luma/chroma); color key ngưỡng hoá bằng khoảng cách RGB thuần</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một key sạch được quyết định lúc quay: phông phẳng, đèn riêng chiếu đều lên nó, chủ thể cách 1–2 m, quần áo khác màu phông, màn trập đủ nhanh.</li>
<li>Chroma Key của CapCut (Strength/Shadow/Feather) và 3D/Delta Keyer miễn phí của Resolve làm cùng việc nền tảng — Ultra Keyer nằm trong Fusion (Chương 19).</li>
<li>Dọn viền là bước riêng biệt khỏi key chính — đừng sửa vệt tóc bằng cách vặn thêm Strength.</li>
<li>Tách nền AI (CapCut Auto removal, miễn phí; Resolve Magic Mask, Studio) bỏ qua được phông vật lý nhưng mất độ chính xác ở chi tiết mảnh.</li>
</ul>

<div class="link-card"><a href="https://www.capcut.com/resource/how-to-remove-green-screen-in-capcut" target="_blank" rel="noopener">CapCut — các bước Chroma Key (Strength, Shadow, Feather)</a></div>
<div class="link-card"><a href="https://www.blackmagicdesign.com/products/davinciresolve/color" target="_blank" rel="noopener">Blackmagic Design — trang Color của DaVinci Resolve (keyer, Power Window, tracking)</a></div>
</div>
`,
    },

    /* ─────────────────── 18.4 VFX thực tế cho creator ─────────────────── */
    {
      title: '18.4 — Practical VFX for creators|||18.4 — VFX thực tế cho creator',
      slug: 'cr-18-4-vfx-thuc-te',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Quay đúng để VFX dễ; ví dụ từng bước nhân bản chính mình và thay màn hình; thay trời, xoá vật, hạt bụi, glitch; biết khi nào dừng; luật chơi — chính sách công khai nội dung bị thay đổi/tổng hợp của YouTube.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 18 · Lesson 18.4</span>
<h2>Every trick in this lesson is the same three tools from 18.1–18.3, combined — the hard part is shooting so the compositing has a chance</h2>
<p class="lead">Nothing in this lesson is a new tool. Cloning yourself, swapping a screen, removing an object — every one of them is masking, tracking and keying from the last three lessons, applied to a specific real-world goal. What actually separates a convincing result from an obviously fake one is almost always decided at the shoot, before any of that software gets touched.</p>

<h3>Shoot for compositing, not just for the shot</h3>
<p>Three habits make every VFX technique below dramatically easier in post, and skipping them is what turns a 20-minute edit into a 3-hour one:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Locked-off tripod for clones</span><span class="v">Any camera movement — even handheld micro-shake — makes two composited layers visibly "swim" relative to each other</span></div>
  <div class="kv"><span class="k">Tracking markers for screen swaps</span><span class="v">A plain, featureless screen (phone off, laptop black) gives a planar tracker almost nothing to lock onto — a small piece of contrasting tape or paper at a corner gives it something real to grab</span></div>
  <div class="kv"><span class="k">Matching light across composited layers</span><span class="v">The same rule from Lesson 18.3's green-screen work applies to every composite in this lesson — mismatched light direction is the single fastest way to make two layers look obviously glued together</span></div>
</div>

<h3>Step by step: cloning yourself</h3>
${slide('cr-18', 14, 'Ví dụ từng bước: nhân bản chính mình')}
<p>This is the classic "talking to yourself" trick, and it is entirely masking plus a locked camera — no tracking or keying required:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Lock the camera</span><span class="lz-d">Tripod, no movement, for both takes — this is the step everything else depends on.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Shoot take one</span><span class="lz-d">Perform your full part standing on one side of the frame.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Shoot take two</span><span class="lz-d">Perform the other part standing on the other side — never crossing into take one's half.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Stack and mask</span><span class="lz-d">Put both clips on separate tracks, and mask a vertical split at empty space neither performer crosses — a little feather on the seam hides it.</span></div>
</div>
<p>Because the camera never moved, both layers already line up pixel-for-pixel — the mask is the only thing doing the work.</p>

<h3>Step by step: swapping a phone or laptop screen</h3>
<p>Where cloning uses a locked camera and no tracking, a screen swap uses a planar tracker (Lesson 18.2) precisely because the camera or the device usually does move a little:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Shoot with a real screen showing something, with clear contrast at the corners</span><span class="lz-d">A tracking marker at one corner if the screen itself is too plain and featureless.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Planar track the screen</span><span class="lz-d">Follow all four corners through the whole shot, including any tilt.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Paste the new content onto the tracked plane</span><span class="lz-d">A screenshot or a screen-recording, corner-pinned to follow the tracked data.</span></div>
</div>
<p>The node-level detail of corner-pinning inside Fusion is Chapter 19 material — this lesson's job is understanding the workflow shape: shoot for tracking, track the plane, paste onto the tracked data.</p>

<h3>The rest of the toolkit</h3>
${slide('cr-18', 13, 'VFX thực tế khác creator hay cần')}
<p><strong>Sky replacement:</strong> mask the sky (often easy with a color/luma qualifier since sky reads as a distinct tone), track it to the camera's motion if there is any, swap in a new sky, and match its brightness/color to the rest of the shot. <strong>Removing an object or a stranger who wandered into frame:</strong> Resolve's <strong>Object Removal</strong> plug-in (Studio only, confirmed on Blackmagic's Color-page documentation) tracks a region and reconstructs it from data in nearby frames — it works best when the background behind the object shows up elsewhere in the shot (camera or subject moving) or is simple/repetitive. The free version has no equivalent tool; the manual fallback is a hand-painted clone-stamp approach, considerably slower. <strong>Dust, particles, light leaks:</strong> overlay a pre-made effects clip on Screen or Add blend mode — usually no tracking needed if the camera barely moves. <strong>Glitch and hologram looks</strong> for tech content: RGB channel-split presets and scan-line displacement, often combined with a mask so the effect only hits one region (a "virtual screen" inside the frame) instead of the whole image.</p>
${slide('cr-18', 15, 'Bảng tra nhanh cả chương')}
<p>That table is the whole chapter in one place — every tool from Lessons 18.1–18.3, lined up against which app has it and whether it costs a Studio license.</p>

<h3>Knowing when to stop</h3>
<p>If a single effect is eating more than 30–45 minutes of fiddling for a short video whose perceived quality barely changes either way, that is the signal to simplify the shot instead of fighting the software — the same "shoot it right so post is light" principle this whole course keeps returning to. VFX earns its place when it makes a specific moment land; it is not a substitute for a clean shoot.</p>

<h3>The rule: VFX can entertain, it cannot deceive about something real</h3>
<p>YouTube requires disclosure specifically for content that uses AI to <strong>meaningfully alter or generate photorealistic content</strong> that could mislead viewers about something real — not for video editing or VFX in general (confirmed directly on YouTube's own policy page). The platform's own listed example of something that does <strong>NOT</strong> need disclosure is telling: <strong>"green screen used to depict someone floating in space."</strong> That is exactly the category the techniques in this lesson fall into — cloning yourself for a comedy bit, swapping a screen for a demo, removing a stray object — obviously staged, entertainment-purpose editing, not an attempt to convince anyone a real event happened that didn't.</p>
<div class="callout danger"><p>The line is deception about something REAL, not "did you use an effect." Using these exact same techniques to fabricate a real event that didn't happen — faking a real news clip, making it look like a real person said or did something they didn't — crosses into content YouTube's policy explicitly requires disclosing, with real consequences for not doing so (manual labeling, or Partner Program penalties for repeat non-disclosure). If you are ever unsure which side of that line a specific video sits on, check support.google.com directly before publishing rather than guessing.</p></div>

<h3>🎬 Practice (40–60 minutes)</h3>
<div class="callout ok"><ol>
<li>Shoot a simple "clone yourself" bit: locked tripod, two takes on opposite sides of the frame, composited with a masked vertical split.</li>
<li>If you have a second device, shoot a screen with a tracking marker at one corner and practice a planar track on it, even without a real swap yet.</li>
<li>Pick one technique from the "rest of the toolkit" table and try it on 10 seconds of your own footage.</li>
<li>Write one sentence for a video idea you have that WOULD require YouTube's altered-content disclosure, and one that clearly would not — and say why for each.</li>
</ol><p><strong>Done when:</strong> you can explain, using your own clone-yourself clip as the example, exactly which chapter tool (mask, tracker, keyer) did which job — and you can state the disclosure rule correctly without rereading this lesson.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Tracking marker</span><span class="v">A temporary, contrasting mark added to a plain surface so a planar tracker has something to lock onto</span></div>
  <div class="kv"><span class="k">Object Removal</span><span class="v">Resolve's Studio-only plug-in that reconstructs a masked, tracked region from nearby-frame data</span></div>
  <div class="kv"><span class="k">Corner pin</span><span class="v">Pasting new content onto a tracked plane's four corners so it follows the surface's perspective</span></div>
  <div class="kv"><span class="k">Altered or synthetic content disclosure</span><span class="v">YouTube's requirement to label AI-generated/altered content realistic enough to mislead about something real</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Every technique here is 18.1–18.3's mask/track/key combined — lock the camera for clones, add tracking markers for screen swaps, match light across every composite.</li>
<li>Cloning yourself needs a locked camera and a mask, no tracking; swapping a screen needs a planar tracker and corner-pinning (Fusion detail in Chapter 19).</li>
<li>Object Removal is Resolve Studio only; the free version's fallback is manual clone-stamp work.</li>
<li>YouTube's disclosure policy targets AI content realistic enough to deceive about something real — its own example says ordinary green-screen VFX for entertainment does NOT need disclosure.</li>
</ul>

<div class="link-card"><a href="https://support.google.com/youtube/answer/14328491" target="_blank" rel="noopener">YouTube Help — Disclosing use of altered or synthetic content</a></div>
<div class="link-card"><a href="https://www.blackmagicdesign.com/products/davinciresolve/color" target="_blank" rel="noopener">Blackmagic Design — DaVinci Resolve Color page (Object Removal under Studio)</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 18 · Bài 18.4</span>
<h2>Mọi trò trong bài này là ĐÚNG BA công cụ của 18.1–18.3, ghép lại — phần khó là quay sao cho việc ghép hình còn cơ hội thành công</h2>
<p class="lead">Không có công cụ mới nào trong bài này. Nhân bản chính mình, thay màn hình, xoá vật thể — mỗi trò đều là mask, tracking và key của ba bài trước, áp vào một mục tiêu thật cụ thể. Điều thật sự phân biệt một kết quả thuyết phục với một kết quả trông giả rõ ràng gần như luôn được quyết định LÚC QUAY, trước khi chạm vào bất kỳ phần mềm nào ở dưới.</p>

<h3>Quay để ghép hình, không chỉ quay để có cảnh</h3>
<p>Ba thói quen làm mọi kỹ thuật VFX dưới đây dễ hơn hẳn ở hậu kỳ, và bỏ qua chúng chính là điều biến một lượt dựng 20 phút thành 3 tiếng:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Chân máy cố định cho nhân bản</span><span class="v">Bất kỳ chuyển động máy quay nào — kể cả rung tay nhẹ — làm hai lớp ghép "trôi" rõ rệt so với nhau</span></div>
  <div class="kv"><span class="k">Điểm bám cho thay màn hình</span><span class="v">Một màn hình trơn, không chi tiết (điện thoại tắt, laptop đen) cho planar tracker gần như không có gì để bám — một miếng băng dán hay giấy tương phản màu ở một góc cho nó thứ thật sự để bám</span></div>
  <div class="kv"><span class="k">Ánh sáng khớp giữa các lớp ghép</span><span class="v">Đúng quy tắc từ việc quay phông xanh ở Bài 18.3 áp dụng cho mọi cảnh ghép trong bài này — hướng sáng lệch nhau là cách nhanh nhất khiến hai lớp trông "dán đè" rõ ràng</span></div>
</div>

<h3>Từng bước: nhân bản chính mình</h3>
${slide('cr-18', 14, 'Ví dụ từng bước: nhân bản chính mình')}
<p>Đây là trò kinh điển "tự nói chuyện với chính mình," và hoàn toàn chỉ là mask cộng máy quay cố định — không cần tracking hay key:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Khoá máy</span><span class="lz-d">Chân máy, không xê dịch, cho CẢ hai lượt quay — đây là bước mọi thứ còn lại phụ thuộc vào.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Quay take một</span><span class="lz-d">Diễn trọn phần của mình, đứng ở một bên khung hình.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Quay take hai</span><span class="lz-d">Diễn phần còn lại, đứng ở bên kia — không bao giờ đi lấn sang nửa của take một.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Xếp chồng và mask</span><span class="lz-d">Đặt cả hai clip lên hai track riêng, mask một đường chia dọc ở vùng trống không ai đi qua cả hai bên — một chút feather trên đường nối để giấu nó đi.</span></div>
</div>
<p>Vì máy quay không hề di chuyển, cả hai lớp đã khớp nhau từng điểm ảnh sẵn — mask là thứ duy nhất làm việc còn lại.</p>

<h3>Từng bước: thay màn hình điện thoại hay laptop</h3>
<p>Trong khi nhân bản dùng máy cố định và không cần tracking, thay màn hình dùng planar tracker (Bài 18.2) chính vì máy quay hoặc thiết bị thường xê dịch một chút:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Quay với màn hình thật đang hiện gì đó, có độ tương phản rõ ở các góc</span><span class="lz-d">Dán một điểm bám ở một góc nếu chính màn hình quá trơn, không chi tiết.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Planar track màn hình</span><span class="lz-d">Bám theo cả 4 góc suốt cả cảnh, kể cả khi nghiêng.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Dán nội dung mới lên mặt phẳng đã track</span><span class="lz-d">Một ảnh chụp màn hình hoặc bản ghi màn hình, "ghim góc" (corner pin) để bám theo dữ liệu đã track.</span></div>
</div>
<p>Chi tiết ở mức node của corner-pin bên trong Fusion là nội dung Chương 19 — việc của bài này là hiểu hình dạng của quy trình: quay để track được, track mặt phẳng, dán lên đúng dữ liệu đã track.</p>

<h3>Phần còn lại của bộ công cụ</h3>
${slide('cr-18', 13, 'VFX thực tế khác creator hay cần')}
<p><strong>Thay trời:</strong> mask vùng trời (thường dễ bằng qualifier theo màu/độ sáng vì trời có tông màu khác biệt rõ), track theo chuyển động máy quay nếu có, ghép trời mới vào, khớp độ sáng/màu với phần còn lại của cảnh. <strong>Xoá một vật hoặc một người lạ đi lạc vào khung:</strong> plugin <strong>Object Removal</strong> của Resolve (chỉ Studio, đã xác nhận trong tài liệu trang Color của Blackmagic) track một vùng rồi dựng lại nó từ dữ liệu ở các khung lân cận — hoạt động tốt nhất khi nền phía sau vật đó xuất hiện ở chỗ khác trong cảnh (máy quay hoặc chủ thể di chuyển) hoặc nền đơn giản/lặp lại. Bản miễn phí không có công cụ tương đương; cách chữa thủ công là vẽ tay kiểu clone-stamp, chậm hơn nhiều. <strong>Hạt bụi, hiệu ứng ánh sáng:</strong> overlay một clip hiệu ứng dựng sẵn ở chế độ hoà trộn Screen hoặc Add — thường không cần track nếu máy quay gần như đứng yên. <strong>Kiểu glitch và hologram</strong> cho nội dung công nghệ: preset dịch kênh màu RGB và nhiễu ngang theo dòng, thường kết hợp với một mask để hiệu ứng chỉ chạm đúng một vùng (một "màn hình ảo" trong khung) thay vì cả hình.</p>
${slide('cr-18', 15, 'Bảng tra nhanh cả chương')}
<p>Bảng đó gói cả chương vào một chỗ — mọi công cụ từ Bài 18.1–18.3, xếp cạnh nhau xem app nào có nó và có tốn giấy phép Studio hay không.</p>

<h3>Biết khi nào dừng</h3>
<p>Nếu một hiệu ứng đang ngốn hơn 30–45 phút mày mò cho một video ngắn mà chất lượng cảm nhận gần như không đổi dù có hay không, đó là tín hiệu để đơn giản hoá cảnh quay thay vì vật lộn với phần mềm — đúng nguyên tắc "quay đúng để hậu kỳ nhẹ" mà cả khoá học này liên tục quay lại. VFX đáng giá khi nó khiến một khoảnh khắc cụ thể "chạm"; nó không phải thứ thay thế cho một cảnh quay sạch.</p>

<h3>Luật chơi: VFX được phép giải trí, không được phép đánh lừa về điều có thật</h3>
<p>YouTube yêu cầu công bố CỤ THỂ cho nội dung dùng AI để <strong>thay đổi có ý nghĩa hoặc tạo ra nội dung chân thực</strong> có thể đánh lừa người xem về điều gì đó có thật — không phải cho việc dựng video hay VFX nói chung (đã xác nhận trực tiếp trên đúng trang chính sách của YouTube). Ví dụ chính thức nền tảng này liệt kê là điều KHÔNG cần công bố nói lên rất nhiều: <strong>"dùng phông xanh để cho ai đó trông như đang lơ lửng ngoài vũ trụ."</strong> Đó chính xác là loại kỹ thuật trong bài này rơi vào — nhân bản chính mình cho một đoạn hài, thay màn hình cho một demo, xoá một vật đi lạc — rõ ràng là dàn dựng, dựng phim mục đích giải trí, không phải cố thuyết phục ai rằng một sự kiện có thật đã xảy ra mà thật ra không.</p>
<div class="callout danger"><p>Ranh giới nằm ở việc ĐÁNH LỪA về điều CÓ THẬT, không phải "có dùng hiệu ứng hay không." Dùng đúng những kỹ thuật này để dựng giả một sự kiện có thật chưa từng xảy ra — làm giả một đoạn tin tức thật, khiến trông như một người thật đã nói/làm điều họ chưa từng làm — thì rơi vào đúng loại nội dung chính sách YouTube yêu cầu công bố rõ, và có hậu quả thật nếu không làm (gắn nhãn thủ công, hoặc phạt với chương trình đối tác nếu lặp lại việc không công bố). Nếu chưa chắc một video cụ thể nằm bên nào của ranh giới đó, kiểm trực tiếp trên support.google.com trước khi đăng thay vì đoán.</p></div>

<h3>🎬 Thực hành (40–60 phút)</h3>
<div class="callout ok"><ol>
<li>Quay một đoạn "nhân bản chính mình" đơn giản: chân máy cố định, hai lượt quay ở hai bên khung hình đối diện nhau, ghép bằng mask chia dọc.</li>
<li>Nếu có thiết bị thứ hai, quay một màn hình có điểm bám ở một góc và luyện planar track trên nó, kể cả khi chưa thay nội dung thật.</li>
<li>Chọn một kỹ thuật từ "phần còn lại của bộ công cụ" và thử trên 10 giây cảnh quay của chính bạn.</li>
<li>Viết một câu cho một ý tưởng video SẼ cần công bố nội dung bị thay đổi của YouTube, và một ý tưởng rõ ràng KHÔNG cần — nêu vì sao cho từng cái.</li>
</ol><p><strong>Đạt khi:</strong> bạn giải thích được, dùng chính clip nhân bản của mình làm ví dụ, chính xác công cụ nào của chương (mask, tracker, keyer) làm việc nào — và nói đúng quy tắc công bố mà không cần đọc lại bài này.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Điểm bám (tracking marker)</span><span class="v">Một dấu tạm, tương phản màu, dán lên bề mặt trơn để planar tracker có thứ để bám</span></div>
  <div class="kv"><span class="k">Object Removal</span><span class="v">Plugin chỉ có ở Resolve Studio, dựng lại một vùng đã mask/track từ dữ liệu khung lân cận</span></div>
  <div class="kv"><span class="k">Corner pin (ghim góc)</span><span class="v">Dán nội dung mới lên 4 góc một mặt phẳng đã track để nó bám theo phối cảnh của bề mặt</span></div>
  <div class="kv"><span class="k">Công bố nội dung bị thay đổi/tổng hợp</span><span class="v">Yêu cầu của YouTube gắn nhãn nội dung do AI tạo/thay đổi đủ chân thực để đánh lừa về điều có thật</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mọi kỹ thuật ở đây là mask/track/key của 18.1–18.3 ghép lại — khoá máy cho nhân bản, thêm điểm bám cho thay màn hình, khớp ánh sáng ở mọi cảnh ghép.</li>
<li>Nhân bản chính mình cần máy cố định và một mask, không cần tracking; thay màn hình cần planar tracker và corner-pin (chi tiết Fusion ở Chương 19).</li>
<li>Object Removal chỉ có ở Resolve Studio; cách chữa của bản miễn phí là vẽ tay clone-stamp.</li>
<li>Chính sách công bố của YouTube nhắm vào nội dung AI đủ chân thực để đánh lừa về điều có thật — chính ví dụ của họ nói VFX phông xanh thông thường cho mục đích giải trí KHÔNG cần công bố.</li>
</ul>

<div class="link-card"><a href="https://support.google.com/youtube/answer/14328491" target="_blank" rel="noopener">YouTube Help — Công bố việc sử dụng nội dung bị thay đổi hoặc tổng hợp</a></div>
<div class="link-card"><a href="https://www.blackmagicdesign.com/products/davinciresolve/color" target="_blank" rel="noopener">Blackmagic Design — trang Color của DaVinci Resolve (Object Removal thuộc Studio)</a></div>
</div>
`,
    },

    /* ─────────────────── 18.5 Quiz ─────────────────── */
    {
      title: '18.5 — Chapter 18 check|||18.5 — Kiểm tra chương 18',
      slug: 'cr-18-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: '10 câu tình huống thực tế: mask & feather, chọn tracker, làm mờ mặt người lạ, ổn định hình, quay phông xanh, dọn viền, và luật VFX của YouTube.',
      content: `
<div class="ml-en">
<h2>📌 Chapter 18 summary</h2>
<p>A mask is "which pixels count," with two real knobs: hard vs. feathered edge, and inside vs. inverted. Animating a mask over keyframes is manual rotoscoping; Resolve's Magic Mask (Studio only) automates that same loop with AI. A tracker is a mask that moves by itself — choose by geometry: one point → point tracker, a flat surface → planar tracker, full 3D camera motion → camera tracker (Fusion Studio only). Blurring a stranger's face or a plate correctly is mask → track → blur-inside-only → verify at real speed, tying back to Chapter 10's Article 32. Stabilization always costs crop and cannot fix motion blur or rolling-shutter skew baked into individual frames. A clean green-screen key is decided at shoot time — flat screen, even dedicated light, 1–2 m distance, non-matching clothing — before CapCut's Chroma Key or Resolve's free 3D/Delta Keyer ever get involved; spill suppression is a separate step from the main key. Every VFX trick in 18.4 (cloning yourself, screen swaps, object removal) is the same mask/track/key toolkit aimed at a shoot planned for compositing. YouTube's altered-content disclosure targets AI content realistic enough to deceive about something real — its own example says ordinary green-screen VFX for entertainment does not need disclosure.</p>
<h3>Self-check</h3>
<ul>
<li>I can explain feather and invert without opening the app.</li>
<li>I can name the right tracker for a given shot just from its geometry.</li>
<li>I know the 4-step process for legally blurring a stranger's face.</li>
<li>I can list the 5 shooting habits that decide whether a green-screen key will be clean.</li>
<li>I can state, correctly, when a VFX video does and does not need YouTube's disclosure.</li>
</ul></div>
<div class="ml-vi">
<h2>📌 Tóm tắt chương 18</h2>
<p>Mask là "điểm ảnh nào được tính," với hai núm vặn thật sự: biên cứng vs feather, và trong vs đảo. Animate mask qua keyframe là rotoscope thủ công; Magic Mask của Resolve (chỉ Studio) tự động hoá đúng vòng lặp đó bằng AI. Tracker là một mask tự di chuyển — chọn theo hình học: một điểm → point tracker, một mặt phẳng → planar tracker, cả chuyển động máy quay 3D → camera tracker (chỉ Fusion Studio). Làm mờ mặt người lạ hoặc biển số đúng cách là mask → track → chỉ làm mờ bên trong → xác nhận ở tốc độ thực, nối lại Điều 32 ở Chương 10. Ổn định hình luôn tốn crop và không sửa được nhoè chuyển động hay méo rolling shutter đã in sẵn trong từng khung. Một key phông xanh sạch được quyết định lúc quay — phông phẳng, đèn riêng chiếu đều, cách 1–2 m, quần áo khác màu phông — trước khi Chroma Key của CapCut hay 3D/Delta Keyer miễn phí của Resolve vào cuộc; dọn viền là bước riêng khỏi key chính. Mọi trò VFX ở 18.4 (nhân bản chính mình, thay màn hình, xoá vật) là cùng bộ công cụ mask/track/key chĩa vào một cảnh quay đã tính trước cho việc ghép hình. Chính sách công bố nội dung bị thay đổi của YouTube nhắm vào nội dung AI đủ chân thực để đánh lừa về điều có thật — chính ví dụ của họ nói VFX phông xanh thông thường cho giải trí không cần công bố.</p>
<h3>Tự kiểm</h3>
<ul>
<li>Tôi giải thích được feather và đảo mask mà không cần mở app.</li>
<li>Tôi gọi đúng tên tracker cần dùng cho một cảnh chỉ từ hình học của nó.</li>
<li>Tôi biết quy trình 4 bước để làm mờ mặt người lạ đúng luật.</li>
<li>Tôi liệt kê được 5 thói quen quay quyết định một key phông xanh có sạch hay không.</li>
<li>Tôi nói đúng khi nào một video VFX cần và không cần công bố theo YouTube.</li>
</ul></div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'You draw a circular mask around a face in CapCut, but the edge looks like an obvious cutout pasted on top. Which single setting fixes this fastest?|||Bạn vẽ một mask hình tròn quanh một khuôn mặt trong CapCut, nhưng biên trông như một miếng cắt dán đè lên rõ ràng. Thiết lập nào sửa nhanh nhất?',
            options: [
              'Feather|||Feather',
              'Invert Mask|||Invert Mask',
              'Position|||Position',
              'Rotation|||Rotation',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Feather blurs a mask\'s hard boundary into a gradient so it blends into the footage instead of sitting on top of it — exactly the "obvious cutout" symptom described. Invert swaps which side is visible, Position/Rotation move the shape, neither touches edge hardness.|||VI: Feather làm mờ biên cứng của một mask thành một dải chuyển màu để nó hoà vào cảnh quay thay vì nằm đè lên trên — đúng triệu chứng "miếng cắt dán đè" được mô tả. Invert đổi bên nào hiện, Position/Rotation di chuyển hình dạng, không cái nào chạm tới độ cứng của biên.',
          },
          {
            question: 'You want a car to be revealed only after it drives past a piece of text already placed on the timeline, instead of the text being visible the whole time. What is the right technique?|||Bạn muốn một chiếc xe chỉ được "lộ ra" sau khi nó chạy qua một dòng chữ đã đặt sẵn trên timeline, thay vì chữ hiện suốt cả đoạn. Kỹ thuật nào đúng?',
            options: [
              'A single static mask placed once, for the whole clip|||Một mask tĩnh, đặt một lần, cho cả clip',
              'Animate a mask shaped like the car with keyframes, so it only reveals the text once the car has passed|||Animate một mask có hình khớp chiếc xe bằng keyframe, để nó chỉ lộ chữ ra sau khi xe đã đi qua',
              'Invert the mask and leave it static|||Đảo mask và để nó đứng yên',
              'Apply a Chroma Key to the car|||Áp Chroma Key lên chiếc xe',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: This is exactly the reveal example from Lesson 18.1 — a static mask can\'t follow a moving object, and Chroma Key is for removing a solid-color background, not for a reveal timed to an object\'s motion.|||VI: Đây đúng là ví dụ reveal ở Bài 18.1 — một mask tĩnh không bám theo được vật đang di chuyển, và Chroma Key dùng để bóc nền màu đơn sắc, không phải để canh thời điểm lộ ra theo chuyển động một vật.',
          },
          {
            question: 'You are on the free version of DaVinci Resolve and want the software to automatically track a person across frames without you re-adjusting a mask by hand. Can you do this?|||Bạn đang dùng bản miễn phí của DaVinci Resolve và muốn phần mềm tự động bám theo một người qua nhiều khung hình mà không cần bạn tự chỉnh lại mask bằng tay. Bạn làm được không?',
            options: [
              'Yes, with Magic Mask — it works the same in Free and Studio|||Có, bằng Magic Mask — hoạt động y hệt ở bản Miễn phí và Studio',
              'Yes, but only for objects, never for people|||Có, nhưng chỉ cho vật thể, không bao giờ cho người',
              'No — Magic Mask is a DaVinci Neural Engine feature exclusive to Resolve Studio; on Free you re-adjust a Power Window by hand with keyframes|||Không — Magic Mask là tính năng DaVinci Neural Engine chỉ có ở Resolve Studio; ở bản Miễn phí bạn phải tự chỉnh lại Power Window bằng tay qua keyframe',
              'No — no version of Resolve can track a person automatically|||Không — không bản Resolve nào tự bám theo người được',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Confirmed on Blackmagic\'s own DaVinci Resolve Studio product page — Magic Mask is listed under DaVinci Neural Engine features not included in the free version. Studio DOES support this automatically for people/objects; Free requires the manual keyframe loop from Lesson 18.1.|||VI: Đã xác nhận trên đúng trang sản phẩm DaVinci Resolve Studio của Blackmagic — Magic Mask nằm trong danh sách tính năng DaVinci Neural Engine không có ở bản miễn phí. Bản Studio THẬT SỰ hỗ trợ việc này tự động cho người/vật; bản Miễn phí cần vòng lặp keyframe thủ công ở Bài 18.1.',
          },
          {
            question: 'You need to stick a demo video onto a phone screen that tilts slightly as the hand holding it moves. Which tracker fits?|||Bạn cần dán một video demo lên màn hình điện thoại, màn hình đó hơi nghiêng khi bàn tay cầm nó di chuyển. Tracker nào phù hợp?',
            options: [
              'Point tracker|||Point tracker',
              'Camera tracker|||Camera tracker',
              'Any of the three — they are interchangeable|||Cả ba đều được — chúng thay thế nhau được',
              'Planar tracker|||Planar tracker',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: A planar tracker follows a flat surface\'s four corners, including tilt in perspective — exactly a phone screen. A point tracker only follows one spot, and camera tracker reconstructs the camera\'s own 3D motion, a different job entirely; the three are chosen by geometry, not interchangeable.|||VI: Planar tracker bám theo 4 góc một mặt phẳng, kể cả khi nghiêng theo phối cảnh — đúng là màn hình điện thoại. Point tracker chỉ bám một điểm, camera tracker dựng lại chuyển động 3D của chính máy quay, một việc hoàn toàn khác; ba loại chọn theo hình học, không thay thế nhau được.',
          },
          {
            question: 'You vlog at a crowded night market; a stranger sits down at your table, faces the camera, and becomes the actual subject of a 30-second story you tell about them. Based on Article 32 (Chapter 10) applied here, what should you do before publishing?|||Bạn quay vlog ở một chợ đêm đông người; một người lạ ngồi xuống bàn bạn, quay mặt về máy, và trở thành chủ thể thật sự của một câu chuyện 30 giây bạn kể về họ. Dựa trên Điều 32 (Chương 10) áp dụng ở đây, bạn nên làm gì trước khi đăng?',
            options: [
              'Nothing — any public place means no consent is ever needed|||Không cần gì — cứ ở nơi công cộng là không bao giờ cần xin phép',
              'Get their consent, or mask + track + blur their face — they are the identifiable center of the shot, not an incidental passerby|||Xin phép họ, hoặc mask + track + làm mờ mặt họ — họ là trung tâm nhận diện được của cảnh, không phải người đi ngang qua tình cờ',
              'Only blur the background, not the person|||Chỉ cần làm mờ hậu cảnh, không cần làm mờ người',
              'Add a disclosure label about synthetic content instead|||Thay vào đó gắn nhãn công bố nội dung tổng hợp',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Chapter 10 established that the public-activity exception covers incidental passersby, not someone who is the identifiable, singled-out subject of the content — exactly this case. A synthetic-content label (Lesson 18.4) is a different, unrelated policy about AI-altered realism.|||VI: Chương 10 đã xác lập ngoại lệ hoạt động công cộng chỉ che người đi ngang qua tình cờ, không che người là chủ thể nhận diện được, bị tách riêng ra của nội dung — đúng tình huống này. Nhãn nội dung tổng hợp (Bài 18.4) là một chính sách khác, không liên quan, nói về mức chân thực do AI thay đổi.',
          },
          {
            question: 'After applying Resolve\'s Stabilizer to a very shaky handheld clip, the frame is noticeably more zoomed in / cropped than the original. Is this a bug?|||Sau khi áp Stabilizer của Resolve lên một clip cầm tay rất rung, khung hình rõ ràng bị zoom vào / crop nhiều hơn so với gốc. Đây có phải lỗi không?',
            options: [
              'No — stabilization always needs room to shift the frame around to cancel shake, and shakier footage needs more crop|||Không — ổn định hình luôn cần chỗ để dịch khung hình quanh nhằm triệt tiêu rung, và cảnh càng rung càng cần crop nhiều',
              'Yes — a correctly configured Stabilizer should never crop the frame|||Có — một Stabilizer cấu hình đúng thì không bao giờ được crop khung hình',
              'Yes, but only in the free version of Resolve|||Có, nhưng chỉ ở bản miễn phí của Resolve',
              'No, but only if Camera Lock mode is used|||Không, nhưng chỉ khi dùng chế độ Camera Lock',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Cropping is a normal, expected cost of stabilization at any setting or tier — not a malfunction, and not unique to Camera Lock. A real gimbal at capture time avoids paying this cost at all.|||VI: Crop là cái giá bình thường, đáng lường trước của việc ổn định hình ở bất kỳ mức hay bản nào — không phải lỗi, và không chỉ riêng chế độ Camera Lock. Một gimbal thật lúc quay tránh được cái giá này hoàn toàn.',
          },
          {
            question: 'A fast whip pan with an iPhone (no gimbal) makes a straight lamp post appear to bend/skew in the footage, even though the post itself never moved. Will Stabilizer fix this?|||Một cú lia máy nhanh bằng iPhone (không gimbal) làm một cột đèn thẳng trông như bị bẻ cong/xiên trong cảnh quay, dù cột đèn thật sự không hề di chuyển. Stabilizer có sửa được không?',
            options: [
              'Yes, Perspective mode fully corrects this|||Có, chế độ Perspective sửa hết được',
              'Yes, but only Translation mode fixes it|||Có, nhưng chỉ chế độ Translation sửa được',
              'No — nothing about this is related to the camera or sensor|||Không — điều này không liên quan gì tới máy quay hay cảm biến',
              'No — this is rolling shutter skew baked into each frame\'s own geometry; stabilization reduces overall shake but does not fix that internal distortion|||Không — đây là méo rolling shutter đã in sẵn vào hình học của từng khung; ổn định hình giảm rung tổng thể nhưng không sửa được độ méo nội tại đó',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Rolling shutter skew happens because the sensor scans line by line during a fast pan — it is recorded into that frame\'s own geometry, which stabilization (any mode) cannot undo, since stabilization repositions frames relative to each other rather than reconstructing content within one.|||VI: Méo rolling shutter xảy ra vì cảm biến quét từng dòng trong lúc lia máy nhanh — nó đã được ghi vào chính hình học của khung đó, điều ổn định hình (bất kỳ chế độ nào) không tháo gỡ được, vì ổn định hình dịch chuyển các khung SO VỚI NHAU chứ không dựng lại nội dung bên trong một khung.',
          },
          {
            question: 'Before pressing record on a green-screen shot, which single preparation step matters most for a clean key — more than the exact shade of green or the camera\'s resolution?|||Trước khi bấm quay một cảnh phông xanh, bước chuẩn bị nào quan trọng nhất cho một key sạch — hơn cả sắc độ xanh chính xác hay độ phân giải máy quay?',
            options: [
              'Choosing the most expensive green screen fabric available|||Chọn loại vải phông xanh đắt tiền nhất có được',
              'Shooting in the highest resolution the camera supports|||Quay ở độ phân giải cao nhất máy hỗ trợ',
              'Flat, wrinkle-free screen lit evenly by its own dedicated light, separate from the light on the subject|||Phông phẳng, không nếp nhăn, được chiếu sáng đều bằng đèn riêng của nó, tách biệt khỏi đèn chiếu chủ thể',
              'Using the newest version of the editing software|||Dùng bản phần mềm dựng mới nhất',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Lesson 18.3\'s checklist is explicit that wrinkles and uneven light on the screen produce a patchy key no keyer setting can fully fix — resolution and software version are not the deciding factors.|||VI: Checklist ở Bài 18.3 nói rõ nếp nhăn và ánh sáng không đều trên phông cho ra một key loang lổ mà không thiết lập bộ key nào sửa hết được — độ phân giải và phiên bản phần mềm không phải yếu tố quyết định.',
          },
          {
            question: 'After a chroma key that otherwise looks clean, the subject\'s hair still shows a faint green tint at the edges. What is the correct fix?|||Sau một lượt chroma key nhìn chung đã sạch, tóc của chủ thể vẫn còn một vệt xanh nhạt ở viền. Cách sửa đúng là gì?',
            options: [
              'Use Spill Suppression (CapCut\'s Shadow slider, or Resolve\'s dedicated spill control) — a separate step from the main key|||Dùng Spill Suppression (thanh Shadow của CapCut, hoặc công cụ dọn viền riêng của Resolve) — một bước tách biệt khỏi key chính',
              'Increase the main key\'s Strength further|||Tăng tiếp Strength của key chính',
              'Re-shoot at a lower frame rate|||Quay lại ở fps thấp hơn',
              'Switch from Delta Keyer to 3D Keyer, which has no spill|||Chuyển từ Delta Keyer sang 3D Keyer, vì loại đó không có spill',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Lesson 18.3 names this exact mistake — cranking key Strength higher to fix spill erodes fine hair detail instead of solving the actual problem; spill suppression is a dedicated, separate control in both CapCut and Resolve. Frame rate is unrelated, and both Resolve keyers can show spill.|||VI: Bài 18.3 nêu đúng lỗi này — vặn Strength của key lên cao để sửa spill ăn mòn chi tiết tóc mảnh thay vì sửa đúng vấn đề; dọn viền là một công cụ riêng, tách biệt ở cả CapCut lẫn Resolve. fps không liên quan, và cả hai keyer của Resolve đều có thể bị spill.',
          },
          {
            question: 'You composite a "clone yourself" comedy sketch — locked camera, two takes, masked split — for a laugh, with no claim that it really happened. Does YouTube\'s altered-or-synthetic-content policy require you to disclose this?|||Bạn ghép một tiểu phẩm hài "nhân bản chính mình" — máy cố định, hai lượt quay, mask chia đôi — chỉ để gây cười, không hề khẳng định nó có thật. Chính sách nội dung bị thay đổi/tổng hợp của YouTube có bắt bạn công bố việc này không?',
            options: [
              'Yes, any use of masking or compositing always requires disclosure|||Có, bất kỳ việc dùng mask hay ghép hình nào cũng luôn cần công bố',
              'Yes, but only if the video gets more than a certain number of views|||Có, nhưng chỉ khi video đạt một số lượt xem nhất định',
              'No — the policy was removed from YouTube entirely|||Không — chính sách này đã bị YouTube gỡ bỏ hoàn toàn',
              'No — the policy targets AI-generated/altered content realistic enough to mislead about something real; YouTube\'s own listed example of green screen making someone "float in space" needs no disclosure, and this is the same category|||Không — chính sách nhắm vào nội dung do AI tạo/thay đổi đủ chân thực để đánh lừa về điều có thật; ví dụ chính thức của YouTube về phông xanh cho ai đó "lơ lửng ngoài vũ trụ" không cần công bố, và đây cùng loại đó',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Lesson 18.4 quotes this directly from YouTube\'s policy page — the scope is AI content realistic enough to deceive about a real event, not editing/VFX in general, and the platform\'s own example matches this exact scenario.|||VI: Bài 18.4 trích trực tiếp từ trang chính sách của YouTube — phạm vi là nội dung AI đủ chân thực để đánh lừa về một sự kiện có thật, không phải việc dựng phim/VFX nói chung, và chính ví dụ của nền tảng này khớp đúng tình huống trên.',
          },
        ],
      },
    },
  ],
};
