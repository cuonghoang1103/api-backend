/**
 * VDP301 — Video Production. Khung 8 chương song ngữ (BBA — Truyền thông, Kỳ 4).
 * Trích dẫn giáo trình: The Filmmaker's Handbook (Ascher & Pincus), In the
 * Blink of an Eye (Murch), Grammar of the Shot (Bowen), tài liệu Adobe
 * Premiere / DaVinci Resolve. KHÔNG upload PDF. Giữ NGUYÊN slug/semester/thumb.
 * ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('vdp301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình FLM, sách nền (Filmmaker\'s Handbook, In the Blink of an Eye, Grammar of the Shot), tài liệu Adobe Premiere/DaVinci Resolve, kênh học, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">VDP301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn video production — from pre-production planning to shooting, editing, color and delivery — in one place. The official FPTU slides &amp; syllabus live on <strong>FLM</strong>; below are the reference texts and free, legal resources this course draws on.</p>
<h3>📘 Core reference books (cited, not uploaded)</h3>
<ul>
<li><em>The Filmmaker's Handbook</em> — Steven Ascher &amp; Edward Pincus. The field's standard production reference: camera, sound, lighting and the producing workflow.</li>
<li><em>In the Blink of an Eye</em> — Walter Murch. A working film editor's essay on why cuts feel right, and the famous "Rule of Six" for prioritizing a cut.</li>
<li><em>Grammar of the Shot</em> — Roy Thompson (with Christopher J. Bowen). The visual vocabulary of shots, angles and movement.</li>
</ul>
<h3>🌐 Official software documentation</h3>
<ul>
<li><a href="https://helpx.adobe.com/premiere-pro/user-guide.html" target="_blank" rel="noopener">Adobe Premiere Pro — official user guide</a></li>
<li><a href="https://www.blackmagicdesign.com/products/davinciresolve/training/" target="_blank" rel="noopener">DaVinci Resolve — free official training</a></li>
</ul>
<h3>▶️ Creator education channels</h3>
<ul>
<li><a href="https://www.youtube.com/@filmriot" target="_blank" rel="noopener">Film Riot</a> — filmmaking technique, gear and effects</li>
<li><a href="https://www.youtube.com/@PeterMcKinnon" target="_blank" rel="noopener">Peter McKinnon</a> — cinematography &amp; editing for creators</li>
<li><a href="https://nofilmschool.com/" target="_blank" rel="noopener">No Film School</a> — production &amp; industry articles</li>
<li><a href="https://www.studiobinder.com/blog/" target="_blank" rel="noopener">StudioBinder Blog</a> — shot types, blocking, screenwriting references</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.blackmagicdesign.com/products/davinciresolve/" target="_blank" rel="noopener">DaVinci Resolve</a> — free professional editor, colorist &amp; audio mixer</li>
<li><a href="https://www.blender.org/" target="_blank" rel="noopener">Blender</a> — free tool usable for motion graphics &amp; titles</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — 3-phase workflow, script &amp; storyboard, exposure triangle, framing &amp; shot types.</li>
<li><strong>Practice</strong> — shoot a 1-minute short with a shot list; edit it in DaVinci Resolve (free).</li>
<li><strong>Go deeper</strong> — continuity editing, Murch's Rule of Six, color grading, post sound mixing.</li>
<li><strong>Job-ready</strong> — deliver to real platform specs (loudness, aspect ratio, captions) for streaming.</li>
</ol></div>`,
    `<span class="eyebrow">VDP301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học sản xuất video — từ lập kế hoạch tiền kỳ đến quay, dựng, chỉnh màu và xuất bản — gom về một chỗ. Slide &amp; giáo trình chính thức của FPTU nằm trên <strong>FLM</strong>; bên dưới là các sách nền và nguồn miễn phí, hợp pháp môn học bám theo.</p>
<h3>📘 Sách nền (trích dẫn, không upload PDF)</h3>
<ul>
<li><em>The Filmmaker's Handbook</em> — Steven Ascher &amp; Edward Pincus. Cẩm nang sản xuất chuẩn của ngành: máy quay, âm thanh, ánh sáng và quy trình sản xuất.</li>
<li><em>In the Blink of an Eye</em> — Walter Murch. Bài luận của một nhà dựng phim kỳ cựu về lý do một cú cắt "đúng", và "Rule of Six" nổi tiếng để xếp hạng ưu tiên khi dựng.</li>
<li><em>Grammar of the Shot</em> — Roy Thompson (cùng Christopher J. Bowen). Từ vựng hình ảnh của cỡ cảnh, góc máy và chuyển động máy.</li>
</ul>
<h3>🌐 Tài liệu chính thức của phần mềm</h3>
<ul>
<li><a href="https://helpx.adobe.com/premiere-pro/user-guide.html" target="_blank" rel="noopener">Adobe Premiere Pro — hướng dẫn sử dụng chính thức</a></li>
<li><a href="https://www.blackmagicdesign.com/products/davinciresolve/training/" target="_blank" rel="noopener">DaVinci Resolve — đào tạo chính thức, miễn phí</a></li>
</ul>
<h3>▶️ Kênh học sáng tạo</h3>
<ul>
<li><a href="https://www.youtube.com/@filmriot" target="_blank" rel="noopener">Film Riot</a> — kỹ thuật làm phim, thiết bị và hiệu ứng</li>
<li><a href="https://www.youtube.com/@PeterMcKinnon" target="_blank" rel="noopener">Peter McKinnon</a> — quay hình &amp; dựng phim cho người sáng tạo nội dung</li>
<li><a href="https://nofilmschool.com/" target="_blank" rel="noopener">No Film School</a> — bài viết sản xuất &amp; ngành phim</li>
<li><a href="https://www.studiobinder.com/blog/" target="_blank" rel="noopener">StudioBinder Blog</a> — cỡ cảnh, blocking, tài liệu biên kịch</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.blackmagicdesign.com/products/davinciresolve/" target="_blank" rel="noopener">DaVinci Resolve</a> — phần mềm dựng/chỉnh màu/mix âm thanh chuyên nghiệp, miễn phí</li>
<li><a href="https://www.blender.org/" target="_blank" rel="noopener">Blender</a> — công cụ miễn phí có thể dùng làm đồ hoạ động &amp; tiêu đề</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — quy trình 3 giai đoạn, kịch bản &amp; storyboard, tam giác phơi sáng, bố cục &amp; cỡ cảnh.</li>
<li><strong>Luyện tập</strong> — quay một đoạn ngắn 1 phút có shot list; dựng bằng DaVinci Resolve (miễn phí).</li>
<li><strong>Đào sâu</strong> — dựng liên tục (continuity), Rule of Six của Murch, chỉnh màu, mix âm thanh hậu kỳ.</li>
<li><strong>Sẵn sàng đi làm</strong> — xuất đúng chuẩn nền tảng thật (độ ồn, tỉ lệ khung hình, phụ đề) cho streaming.</li>
</ol></div>`,
  ]]);

const intro = doc('vdp301-0-1-overview', 'Course overview: Video Production|||Tổng quan: Sản xuất video',
  'Sản xuất video làm gì; quy trình 3 giai đoạn; lộ trình 8 chương từ ý tưởng đến xuất bản.',
  [[
    `<span class="eyebrow">VDP301 · Lesson 0.1 · Overview</span>
<h2>Video Production</h2>
<p class="lead">This course teaches you <strong>how a video actually gets made</strong> — from a raw idea to a finished file ready for an audience. You'll follow the real industry workflow: plan it, shoot it, cut it, finish it — and understand the visual and audio grammar that makes an edit feel intentional rather than accidental.</p>
<h3>The 3-phase workflow</h3>
<ul>
<li><strong>Pre-production</strong> — idea, script, storyboard, shot list, planning.</li>
<li><strong>Production</strong> — camera, lens, exposure, framing, lighting, sound — the shoot itself.</li>
<li><strong>Post-production</strong> — editing, continuity &amp; pacing, color grading, motion graphics, sound mix, export &amp; distribution.</li>
</ul>
<h3>Roadmap (8 chapters)</h3>
<p>Overview &amp; workflow → script &amp; storyboard → camera/lens &amp; exposure triangle → framing &amp; shot language → lighting &amp; sound on set → editing &amp; continuity grammar → color grading &amp; motion graphics → post sound &amp; delivery. Bilingual, with worked examples, diagrams and quizzes each chapter.</p>`,
    `<span class="eyebrow">VDP301 · Bài 0.1 · Tổng quan</span>
<h2>Sản xuất video</h2>
<p class="lead">Môn này dạy bạn <strong>video được làm ra thế nào trong thực tế</strong> — từ một ý tưởng thô đến một file hoàn chỉnh sẵn sàng đến với người xem. Bạn sẽ theo đúng quy trình của ngành: lên kế hoạch, quay, dựng, hoàn thiện — và hiểu ngữ pháp hình ảnh &amp; âm thanh khiến một bản dựng cảm thấy có chủ đích, không phải ngẫu nhiên.</p>
<h3>Quy trình 3 giai đoạn</h3>
<ul>
<li><strong>Tiền kỳ (pre-production)</strong> — ý tưởng, kịch bản, storyboard, shot list, lập kế hoạch.</li>
<li><strong>Sản xuất (production)</strong> — máy quay, ống kính, phơi sáng, bố cục khung hình, ánh sáng, âm thanh — chính buổi quay.</li>
<li><strong>Hậu kỳ (post-production)</strong> — dựng phim, ngữ pháp dựng liên tục &amp; nhịp điệu, chỉnh màu, đồ hoạ động, mix âm thanh, xuất bản &amp; phân phối.</li>
</ul>
<h3>Lộ trình (8 chương)</h3>
<p>Tổng quan &amp; quy trình → kịch bản &amp; storyboard → máy quay/ống kính &amp; tam giác phơi sáng → bố cục &amp; ngôn ngữ khung hình → ánh sáng &amp; âm thanh khi quay → dựng phim &amp; ngữ pháp dựng liên tục → chỉnh màu &amp; đồ hoạ động → âm thanh hậu kỳ &amp; xuất bản. Song ngữ, có ví dụ, sơ đồ và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('vdp301-1-1-workflow', '1.1 — Video production overview & the 3-phase workflow|||1.1 — Tổng quan sản xuất video & quy trình 3 giai đoạn',
  'Ba giai đoạn pre-production/production/post-production; vai trò kíp làm phim cốt lõi; chi phí sửa lỗi tăng theo giai đoạn.',
  [[
    `<span class="eyebrow">VDP301 · Chapter 1 · Lesson 1.1</span>
<h2>Video production overview &amp; the 3-phase workflow</h2>
<p class="lead">Every video — a 30-second ad or a feature film — moves through the same three phases: <strong>pre-production</strong> (plan), <strong>production</strong> (shoot), <strong>post-production</strong> (edit &amp; finish). Skipping or rushing any phase shows up on screen.</p>
<h3>The 3 phases</h3>
<ul>
<li><strong>Pre-production</strong> — concept, script, storyboard, shot list, casting, locations, budget, schedule. The cheapest phase in which to fix a mistake.</li>
<li><strong>Production</strong> — the actual shoot: camera, lighting, sound, directing performances. The most expensive phase per hour — every wasted minute costs crew time, gear rental and daylight.</li>
<li><strong>Post-production</strong> — editing (assembly → rough cut → fine cut), color grading, sound mix, graphics/VFX, export &amp; delivery.</li>
</ul>
<h3>Core crew roles</h3>
<ul>
<li><strong>Director</strong> — owns the creative vision and performances.</li>
<li><strong>Cinematographer / DP</strong> — owns the camera, lighting and look.</li>
<li><strong>Editor</strong> — owns pacing and story structure in post.</li>
<li><strong>Sound recordist / designer</strong> — owns everything the audience hears.</li>
</ul>
<pre><code>Idea -&gt; Script -&gt; Storyboard -&gt; Shoot -&gt; Assembly cut -&gt; Fine cut -&gt; Color -&gt; Sound mix -&gt; Export
 |------------- pre-production -------------||-- production --||------------- post-production -------------|
</code></pre>
<div class="callout"><span class="badge">Ratio of pain</span> A core lesson of <em>The Filmmaker's Handbook</em>: problems not solved in pre-production do not disappear — they only get more expensive to fix, phase by phase.</div>`,
    `<span class="eyebrow">VDP301 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan sản xuất video &amp; quy trình 3 giai đoạn</h2>
<p class="lead">Mọi video — một mẩu quảng cáo 30 giây hay một phim dài — đều đi qua đúng ba giai đoạn: <strong>tiền kỳ</strong> (lập kế hoạch), <strong>sản xuất</strong> (quay), <strong>hậu kỳ</strong> (dựng &amp; hoàn thiện). Bỏ qua hoặc làm vội bất kỳ giai đoạn nào cũng hiện rõ trên màn hình.</p>
<h3>Ba giai đoạn</h3>
<ul>
<li><strong>Tiền kỳ</strong> — ý tưởng, kịch bản, storyboard, shot list, casting, địa điểm, ngân sách, lịch quay. Giai đoạn rẻ nhất để sửa một sai sót.</li>
<li><strong>Sản xuất</strong> — buổi quay thật: máy quay, ánh sáng, âm thanh, chỉ đạo diễn xuất. Giai đoạn đắt nhất tính theo giờ — mỗi phút lãng phí đều tốn tiền kíp, tiền thuê thiết bị và ánh sáng ngày.</li>
<li><strong>Hậu kỳ</strong> — dựng phim (ghép thô → bản cắt thô → bản cắt tinh), chỉnh màu, mix âm thanh, đồ hoạ/hiệu ứng, xuất &amp; giao file.</li>
</ul>
<h3>Vai trò kíp làm phim cốt lõi</h3>
<ul>
<li><strong>Đạo diễn (Director)</strong> — giữ tầm nhìn sáng tạo và diễn xuất.</li>
<li><strong>Quay phim / DP</strong> — giữ máy quay, ánh sáng và phong cách hình ảnh.</li>
<li><strong>Dựng phim (Editor)</strong> — giữ nhịp điệu và cấu trúc kể chuyện ở hậu kỳ.</li>
<li><strong>Thu/thiết kế âm thanh</strong> — giữ mọi thứ khán giả nghe được.</li>
</ul>
<pre><code>Ý tưởng -&gt; Kịch bản -&gt; Storyboard -&gt; Quay -&gt; Bản ghép thô -&gt; Bản cắt tinh -&gt; Chỉnh màu -&gt; Mix âm thanh -&gt; Xuất
 |------------- tiền kỳ -------------||-- sản xuất --||------------- hậu kỳ -------------|
</code></pre>
<div class="callout"><span class="badge">Tỉ lệ đau đầu</span> Một bài học cốt lõi của <em>The Filmmaker's Handbook</em>: vấn đề không được giải quyết ở tiền kỳ không tự biến mất — nó chỉ ngày càng đắt hơn để sửa, qua từng giai đoạn.</div>`,
  ]]);

const c1q = quiz('vdp301-quiz-1', 'Quiz 1 — Workflow|||Quiz 1 — Quy trình', [
  { id: 'q1', question: 'Quy trình sản xuất video gồm mấy giai đoạn chính?', options: ['2', '3', '4', '5'], correctIndex: 1, explanation: 'Ba giai đoạn: tiền kỳ, sản xuất, hậu kỳ.' },
  { id: 'q2', question: 'Giai đoạn nào tốn tiền nhất tính theo GIỜ (nhân sự, thiết bị, ánh sáng ngày)?', options: ['Tiền kỳ', 'Sản xuất (quay)', 'Hậu kỳ', 'Không giai đoạn nào'], correctIndex: 1, explanation: 'Sản xuất là giai đoạn đắt nhất theo giờ — mọi phút lãng phí đều tốn kíp và thiết bị thuê.' },
  { id: 'q3', question: 'Ai chịu trách nhiệm chính về ánh sáng và phong cách hình ảnh trên set?', options: ['Đạo diễn', 'Dựng phim (Editor)', 'Quay phim / DP', 'Thu âm'], correctIndex: 2, explanation: 'Cinematographer/DP giữ máy quay, ánh sáng và look hình ảnh.' },
]);

const c2 = doc('vdp301-2-1-script-storyboard', '2.1 — Pre-production: idea, script & storyboard|||2.1 — Tiền kỳ: ý tưởng, kịch bản & storyboard',
  'Logline, treatment, format kịch bản chuẩn; storyboard & shot list — công cụ giao tiếp trước buổi quay.',
  [[
    `<span class="eyebrow">VDP301 · Chapter 2 · Lesson 2.1</span>
<h2>Pre-production: idea, script &amp; storyboard</h2>
<h3>From idea to script</h3>
<ul>
<li><strong>Logline</strong> — a one- or two-sentence summary: protagonist + goal + obstacle. Forces clarity before writing a single scene.</li>
<li><strong>Treatment</strong> — a prose summary of the story beats, written before the full script.</li>
<li><strong>Script</strong> — standard format: <strong>scene heading</strong> (INT./EXT. LOCATION — DAY/NIGHT), <strong>action</strong> lines (present tense, visual), <strong>character cue</strong>, then <strong>dialogue</strong>.</li>
</ul>
<h3>Storyboard &amp; shot list</h3>
<p>A <strong>storyboard</strong> is a sequence of simple frames showing composition, camera angle and movement for each shot — it puts the whole crew's mental image on the same page <em>before</em> the expensive shoot day. A <strong>shot list</strong> turns that into an executable checklist.</p>
<pre><code>Scene | Shot | Description                | Type | Lens  | Notes
  3   |  3A  | Hero enters the room       | WS   | 24mm  | dolly in
  3   |  3B  | Reaction close-up          | CU   | 50mm  | handheld
</code></pre>
<div class="callout"><span class="badge">Cheap insurance</span> An hour spent storyboarding is far cheaper than a reshoot day — this is why <em>The Filmmaker's Handbook</em> treats pre-production planning as the highest-leverage phase.</div>`,
    `<span class="eyebrow">VDP301 · Chương 2 · Bài 2.1</span>
<h2>Tiền kỳ: ý tưởng, kịch bản &amp; storyboard</h2>
<h3>Từ ý tưởng đến kịch bản</h3>
<ul>
<li><strong>Logline</strong> — tóm tắt trong một hoặc hai câu: nhân vật chính + mục tiêu + trở ngại. Bắt buộc phải rõ ràng trước khi viết bất kỳ cảnh nào.</li>
<li><strong>Treatment</strong> — bản tóm tắt văn xuôi các nhịp truyện, viết trước khi vào kịch bản đầy đủ.</li>
<li><strong>Kịch bản</strong> — format chuẩn: <strong>tiêu đề cảnh</strong> (INT./EXT. ĐỊA ĐIỂM — NGÀY/ĐÊM), <strong>dòng hành động</strong> (thì hiện tại, mang tính hình ảnh), <strong>tên nhân vật</strong>, rồi <strong>lời thoại</strong>.</li>
</ul>
<h3>Storyboard &amp; shot list</h3>
<p>Một <strong>storyboard</strong> là chuỗi khung hình đơn giản thể hiện bố cục, góc máy và chuyển động cho từng cảnh — nó đưa hình ảnh trong đầu cả kíp về cùng một trang <em>trước</em> ngày quay đắt đỏ. Một <strong>shot list</strong> biến điều đó thành danh sách thực thi được.</p>
<pre><code>Cảnh | Cảnh con | Mô tả                     | Loại | Ống kính | Ghi chú
  3  |    3A    | Nhân vật chính vào phòng | WS   | 24mm     | dolly vào
  3  |    3B    | Cận cảnh phản ứng        | CU   | 50mm     | cầm tay
</code></pre>
<div class="callout"><span class="badge">Bảo hiểm rẻ</span> Một giờ vẽ storyboard rẻ hơn rất nhiều so với một ngày quay lại — đây là lý do <em>The Filmmaker's Handbook</em> coi việc lập kế hoạch tiền kỳ là giai đoạn có đòn bẩy cao nhất.</div>`,
  ]]);

const c2q = quiz('vdp301-quiz-2', 'Quiz 2 — Script & storyboard|||Quiz 2 — Kịch bản & storyboard', [
  { id: 'q1', question: 'Logline là gì?', options: ['Bản kịch bản đầy đủ', 'Tóm tắt 1-2 câu: nhân vật + mục tiêu + trở ngại', 'Danh sách thiết bị quay', 'Bản dựng thô'], correctIndex: 1, explanation: 'Logline buộc câu chuyện phải rõ ràng ngay từ đầu.' },
  { id: 'q2', question: 'Tiêu đề cảnh chuẩn trong kịch bản có dạng?', options: ['Tên nhân vật — lời thoại', 'INT./EXT. ĐỊA ĐIỂM — NGÀY/ĐÊM', 'Cỡ cảnh — ống kính', 'Số cảnh — thời gian quay'], correctIndex: 1, explanation: 'Scene heading nêu trong/ngoài, địa điểm, thời điểm.' },
  { id: 'q3', question: 'Vì sao vẽ storyboard trước khi quay lại tiết kiệm hơn?', options: ['Vì storyboard thay luôn cả kịch bản', 'Vì sửa sai ở tiền kỳ rẻ hơn sửa ở buổi quay/hậu kỳ', 'Vì storyboard bắt buộc theo luật', 'Vì không cần shot list nữa'], correctIndex: 1, explanation: 'Chi phí sửa lỗi tăng dần qua các giai đoạn — tiền kỳ là rẻ nhất.' },
]);

const c3 = doc('vdp301-3-1-camera-exposure', '3.1 — Camera, lens & exposure (the exposure triangle)|||3.1 — Máy quay, ống kính & phơi sáng (tam giác phơi sáng)',
  'Ba yếu tố phơi sáng: khẩu độ (f-stop, DOF), tốc độ màn trập (quy tắc 180 độ), ISO/gain; tiêu cự ống kính.',
  [[
    `<span class="eyebrow">VDP301 · Chapter 3 · Lesson 3.1</span>
<h2>Camera, lens &amp; exposure — the exposure triangle</h2>
<p class="lead">Every shot's brightness is controlled by three settings that trade off against each other: <strong>aperture</strong>, <strong>shutter speed</strong>, <strong>ISO/gain</strong> — the exposure triangle.</p>
<ul>
<li><strong>Aperture (f-stop)</strong> — how wide the lens iris opens. A lower f-number (e.g. f/1.8) lets in more light AND produces shallower <strong>depth of field</strong> (DOF) — a blurred background.</li>
<li><strong>Shutter speed</strong> — how long the sensor is exposed per frame. Controls motion blur. The <strong>180-degree rule</strong>: shutter speed ≈ 2 × frame rate (e.g. 1/50s at 24fps) gives natural-looking motion.</li>
<li><strong>ISO / gain</strong> — the sensor's sensitivity to light. Higher ISO brightens a dark image but adds visible noise/grain.</li>
</ul>
<h3>Lens: focal length</h3>
<p>A <strong>wide-angle</strong> lens (e.g. 24mm) shows more of the scene and exaggerates depth; a <strong>telephoto</strong> lens (e.g. 85mm+) compresses distance and isolates a subject with a narrower field of view.</p>
<pre><code>180-degree rule:  shutter speed = 1 / (2 x fps)
 at 24 fps  -&gt; ~1/50s
 at 30 fps  -&gt; ~1/60s
 at 60 fps  -&gt; ~1/120s
</code></pre>
<div class="callout"><span class="badge">The trade-off</span> Change one leg of the triangle and you must compensate with another — that trade-off, not any single setting, is what "correct exposure" means.</div>`,
    `<span class="eyebrow">VDP301 · Chương 3 · Bài 3.1</span>
<h2>Máy quay, ống kính &amp; phơi sáng — tam giác phơi sáng</h2>
<p class="lead">Độ sáng của một cảnh được kiểm soát bởi ba thiết lập đánh đổi lẫn nhau: <strong>khẩu độ</strong>, <strong>tốc độ màn trập</strong>, <strong>ISO/gain</strong> — tam giác phơi sáng.</p>
<ul>
<li><strong>Khẩu độ (f-stop)</strong> — độ mở của lá khẩu ống kính. Số f nhỏ hơn (vd f/1.8) cho nhiều ánh sáng vào HƠN và tạo <strong>độ sâu trường ảnh (DOF)</strong> nông hơn — hậu cảnh mờ.</li>
<li><strong>Tốc độ màn trập</strong> — thời gian cảm biến phơi sáng mỗi khung hình. Kiểm soát độ nhoè chuyển động. <strong>Quy tắc 180 độ</strong>: tốc độ màn trập ≈ 2 × tốc độ khung hình (vd 1/50s ở 24fps) cho chuyển động trông tự nhiên.</li>
<li><strong>ISO / gain</strong> — độ nhạy sáng của cảm biến. ISO cao làm sáng ảnh tối hơn nhưng thêm nhiễu/hạt (noise/grain) rõ rệt.</li>
</ul>
<h3>Ống kính: tiêu cự</h3>
<p>Ống kính <strong>góc rộng</strong> (vd 24mm) thu được nhiều cảnh hơn và làm nổi bật độ sâu; ống kính <strong>tele</strong> (vd 85mm+) nén khoảng cách và tách chủ thể với góc nhìn hẹp hơn.</p>
<pre><code>Quy tắc 180 độ:  tốc độ màn trập = 1 / (2 x fps)
 ở 24 fps  -&gt; ~1/50s
 ở 30 fps  -&gt; ~1/60s
 ở 60 fps  -&gt; ~1/120s
</code></pre>
<div class="callout"><span class="badge">Sự đánh đổi</span> Đổi một cạnh của tam giác thì phải bù bằng cạnh khác — chính sự đánh đổi đó, không phải một thiết lập đơn lẻ, là ý nghĩa của "phơi sáng đúng".</div>`,
  ]]);

const c3q = quiz('vdp301-quiz-3', 'Quiz 3 — Exposure triangle|||Quiz 3 — Tam giác phơi sáng', [
  { id: 'q1', question: 'Ba yếu tố của tam giác phơi sáng là?', options: ['Khẩu độ, ISO, tiêu cự', 'Khẩu độ, tốc độ màn trập, ISO/gain', 'Tốc độ màn trập, tiêu cự, cảm biến', 'ISO, cảm biến, ống kính'], correctIndex: 1, explanation: 'Aperture, shutter speed, ISO/gain là ba yếu tố đánh đổi lẫn nhau.' },
  { id: 'q2', question: 'Số f-stop nhỏ hơn (vd f/1.8) tạo ra điều gì?', options: ['Ít ánh sáng hơn, DOF sâu hơn', 'Nhiều ánh sáng hơn, DOF nông hơn (hậu cảnh mờ)', 'Không ảnh hưởng DOF', 'Tăng ISO tự động'], correctIndex: 1, explanation: 'Khẩu độ mở lớn (f nhỏ) cho nhiều sáng và DOF nông.' },
  { id: 'q3', question: 'Theo quy tắc 180 độ, quay ở 24fps thì tốc độ màn trập nên khoảng?', options: ['1/24s', '1/50s', '1/200s', '1/1000s'], correctIndex: 1, explanation: 'Shutter ≈ 2 × fps → 1/(2×24) ≈ 1/50s.' },
]);

const c4 = doc('vdp301-4-1-framing-shot-language', '4.1 — Framing & the visual language of shots|||4.1 — Bố cục khung hình & ngôn ngữ hình ảnh',
  'Rule of thirds, headroom/leadroom; cỡ cảnh (WS/MS/CU/ECU); chuyển động máy (pan/tilt/dolly/zoom) và góc máy.',
  [[
    `<span class="eyebrow">VDP301 · Chapter 4 · Lesson 4.1</span>
<h2>Framing &amp; the visual language of shots</h2>
<h3>Composition basics</h3>
<ul>
<li><strong>Rule of thirds</strong> — divide the frame into a 3×3 grid; place subjects/eyes near the intersections rather than dead-center for a more dynamic image.</li>
<li><strong>Headroom &amp; leadroom</strong> — leave a little space above the head, and in front of a moving/looking subject, not behind — cramped framing reads as a mistake.</li>
</ul>
<h3>Shot types (per <em>Grammar of the Shot</em>)</h3>
<ul>
<li><strong>WS (wide/establishing shot)</strong> — shows the whole location and geography.</li>
<li><strong>MS (medium shot)</strong> — waist-up; the default for dialogue.</li>
<li><strong>CU (close-up)</strong> — face fills the frame; reads emotion.</li>
<li><strong>ECU (extreme close-up)</strong> — an eye, a detail; maximum intensity.</li>
</ul>
<h3>Camera movement &amp; angle</h3>
<p><strong>Pan/tilt</strong> — the camera rotates on a fixed tripod. <strong>Dolly/track</strong> — the whole camera physically moves through space. <strong>Zoom</strong> — the lens's focal length changes; the camera stays put. Dolly and zoom look similar in a still frame but feel completely different in motion — a dolly-in draws the viewer <em>into</em> the space, a zoom-in only magnifies it. Angle (eye-level, low, high, or tilted/Dutch) sets the emotional relationship between viewer and subject.</p>
<div class="callout"><span class="badge">Every choice reads</span> A shot type, angle and movement is never neutral — the audience feels the choice even when they can't name it.</div>`,
    `<span class="eyebrow">VDP301 · Chương 4 · Bài 4.1</span>
<h2>Bố cục khung hình &amp; ngôn ngữ hình ảnh</h2>
<h3>Bố cục cơ bản</h3>
<ul>
<li><strong>Rule of thirds (quy tắc một phần ba)</strong> — chia khung hình theo lưới 3×3; đặt chủ thể/mắt gần các điểm giao nhau thay vì chính giữa để hình ảnh động hơn.</li>
<li><strong>Headroom &amp; leadroom</strong> — chừa chút khoảng trống phía trên đầu, và phía trước chủ thể đang di chuyển/nhìn, không phải phía sau — bố cục chật chội đọc như một lỗi.</li>
</ul>
<h3>Cỡ cảnh (theo <em>Grammar of the Shot</em>)</h3>
<ul>
<li><strong>WS (toàn cảnh/thiết lập)</strong> — cho thấy toàn bộ địa điểm và không gian.</li>
<li><strong>MS (trung cảnh)</strong> — từ eo lên; cỡ mặc định cho đối thoại.</li>
<li><strong>CU (cận cảnh)</strong> — mặt lấp đầy khung hình; thể hiện cảm xúc.</li>
<li><strong>ECU (đặc tả)</strong> — một con mắt, một chi tiết; cường độ tối đa.</li>
</ul>
<h3>Chuyển động &amp; góc máy</h3>
<p><strong>Pan/tilt</strong> — máy quay xoay trên chân đế cố định. <strong>Dolly/track</strong> — toàn bộ máy quay thực sự di chuyển trong không gian. <strong>Zoom</strong> — tiêu cự ống kính thay đổi; máy quay đứng yên. Dolly và zoom trông giống nhau ở một khung tĩnh nhưng cảm giác hoàn toàn khác khi chuyển động — dolly-in kéo người xem <em>vào</em> không gian, zoom-in chỉ phóng to nó. Góc máy (ngang mắt, thấp, cao, hoặc nghiêng/Dutch) đặt ra quan hệ cảm xúc giữa người xem và chủ thể.</p>
<div class="callout"><span class="badge">Mọi lựa chọn đều "đọc" được</span> Cỡ cảnh, góc máy và chuyển động không bao giờ trung tính — khán giả cảm nhận được lựa chọn đó dù không gọi được tên nó.</div>`,
  ]]);

const c4q = quiz('vdp301-quiz-4', 'Quiz 4 — Framing & shot language|||Quiz 4 — Bố cục & ngôn ngữ hình ảnh', [
  { id: 'q1', question: 'Rule of thirds khuyên đặt chủ thể ở đâu trong khung hình?', options: ['Chính giữa khung', 'Gần các điểm giao của lưới 3x3', 'Sát mép khung', 'Ngoài khung hình'], correctIndex: 1, explanation: 'Đặt gần giao điểm lưới 3x3 cho bố cục động hơn giữa khung.' },
  { id: 'q2', question: 'Cỡ cảnh nào thể hiện toàn bộ địa điểm/không gian?', options: ['CU', 'ECU', 'MS', 'WS'], correctIndex: 3, explanation: 'WS (wide/establishing shot) thiết lập không gian tổng thể.' },
  { id: 'q3', question: 'Khác biệt giữa dolly-in và zoom-in là gì?', options: ['Không khác gì cả', 'Dolly di chuyển máy vào không gian; zoom chỉ đổi tiêu cự, máy đứng yên', 'Zoom cần chân máy, dolly không cần', 'Dolly chỉ dùng cho cận cảnh'], correctIndex: 1, explanation: 'Dolly kéo người xem vào không gian thật; zoom chỉ phóng to hình ảnh tại chỗ.' },
]);

const c5 = doc('vdp301-5-1-lighting-sound', '5.1 — Lighting & sound on set|||5.1 — Ánh sáng & âm thanh khi quay',
  'Chiếu sáng ba điểm (key/fill/back), ánh sáng cứng/mềm, nhiệt độ màu; micro shotgun/lavalier, boom, room tone.',
  [[
    `<span class="eyebrow">VDP301 · Chapter 5 · Lesson 5.1</span>
<h2>Lighting &amp; sound on set</h2>
<h3>Three-point lighting</h3>
<ul>
<li><strong>Key light</strong> — the main, brightest light, defining the subject's shape.</li>
<li><strong>Fill light</strong> — softer, opposite the key, reducing harsh shadows.</li>
<li><strong>Back/rim light</strong> — behind the subject, separating them from the background.</li>
</ul>
<pre><code>        [Back light]
             |
  [Key] --- Subject --- [Fill]
             |
          (Camera)
</code></pre>
<p><strong>Hard light</strong> (small/direct source, e.g. bare sun) creates sharp shadows; <strong>soft light</strong> (large/diffused source, e.g. through a softbox) wraps gently. <strong>Color temperature</strong> (Kelvin) must be matched with white balance — mixing daylight (~5600K) and tungsten (~3200K) unbalanced produces an orange/blue color clash.</p>
<h3>Sound on set</h3>
<p>A <strong>shotgun mic</strong> on a boom, kept just out of frame and aimed at the speaker's mouth, is the standard for dialogue; a <strong>lavalier</strong> (clip-on) mic is the fallback when a boom can't get close enough. Always record a few seconds of <strong>room tone</strong> (silence on location) for editing. Monitor audio live with headphones — a bad recording usually cannot be "fixed in post".</p>
<div class="callout"><span class="badge">Sound is half the picture</span> Audiences forgive imperfect images far more than they forgive bad audio — protect the sound take as carefully as the shot.</div>`,
    `<span class="eyebrow">VDP301 · Chương 5 · Bài 5.1</span>
<h2>Ánh sáng &amp; âm thanh khi quay</h2>
<h3>Chiếu sáng ba điểm</h3>
<ul>
<li><strong>Key light</strong> — nguồn sáng chính, sáng nhất, định hình khối chủ thể.</li>
<li><strong>Fill light</strong> — mềm hơn, đối diện key, giảm bóng gắt.</li>
<li><strong>Back/rim light</strong> — phía sau chủ thể, tách chủ thể khỏi hậu cảnh.</li>
</ul>
<pre><code>        [Đèn nền]
             |
  [Key] --- Chủ thể --- [Fill]
             |
         (Máy quay)
</code></pre>
<p><strong>Ánh sáng cứng</strong> (nguồn nhỏ/trực tiếp, vd nắng trần) tạo bóng gắt; <strong>ánh sáng mềm</strong> (nguồn lớn/khuếch tán, vd qua softbox) toả dịu. <strong>Nhiệt độ màu</strong> (Kelvin) phải khớp với white balance — trộn ánh sáng ngày (~5600K) và đèn tungsten (~3200K) không cân bằng sẽ tạo xung đột màu cam/xanh.</p>
<h3>Âm thanh khi quay</h3>
<p>Một <strong>micro shotgun</strong> gắn trên boom, giữ ngay ngoài khung hình và chĩa vào miệng người nói, là chuẩn cho lời thoại; <strong>micro lavalier</strong> (kẹp áo) là lựa chọn dự phòng khi boom không thể đến gần đủ. Luôn ghi vài giây <strong>room tone</strong> (tiếng im lặng tại hiện trường) để phục vụ dựng phim. Theo dõi âm thanh trực tiếp bằng tai nghe — một bản ghi hỏng thường KHÔNG thể "sửa ở hậu kỳ".</p>
<div class="callout"><span class="badge">Âm thanh là một nửa hình ảnh</span> Khán giả tha thứ cho hình ảnh chưa hoàn hảo nhiều hơn là tha thứ cho âm thanh tệ — bảo vệ take âm thanh cẩn thận như bảo vệ cảnh quay.</div>`,
  ]]);

const c5q = quiz('vdp301-quiz-5', 'Quiz 5 — Lighting & sound|||Quiz 5 — Ánh sáng & âm thanh', [
  { id: 'q1', question: 'Trong chiếu sáng ba điểm, đèn nào giảm bóng gắt do key light tạo ra?', options: ['Back light', 'Fill light', 'Key light thứ hai', 'Không cần đèn nào'], correctIndex: 1, explanation: 'Fill light đặt đối diện key, làm dịu bóng gắt.' },
  { id: 'q2', question: 'Vì sao cần ghi lại "room tone" tại hiện trường?', options: ['Để test micro có hoạt động không', 'Để có nền âm im lặng dùng khi dựng phim', 'Để đo nhiệt độ màu', 'Không cần thiết'], correctIndex: 1, explanation: 'Room tone giúp lấp khoảng lặng/chỉnh âm khi hậu kỳ mà không bị lệch nền âm.' },
  { id: 'q3', question: 'Vì sao thường KHÔNG thể "sửa âm thanh hỏng ở hậu kỳ"?', options: ['Vì phần mềm dựng không hỗ trợ âm thanh', 'Vì âm thanh bị nhiễu/méo mất chi tiết không thể khôi phục hoàn toàn', 'Vì luật cấm chỉnh âm thanh', 'Vì âm thanh luôn hoàn hảo khi quay'], correctIndex: 1, explanation: 'Dữ liệu âm thanh đã mất (nhiễu, méo, quá tải) không thể tái tạo hoàn hảo bằng xử lý hậu kỳ.' },
]);

const c6 = doc('vdp301-6-1-editing-continuity', '6.1 — Editing & the grammar of the cut|||6.1 — Dựng phim & ngữ pháp dựng',
  'Quy trình dựng (ghép thô→cắt tinh); continuity (match cut, eyeline, hướng màn hình); Rule of Six của Murch.',
  [[
    `<span class="eyebrow">VDP301 · Chapter 6 · Lesson 6.1</span>
<h2>Editing &amp; the grammar of the cut</h2>
<h3>The editing workflow</h3>
<p>Ingest &amp; organize footage → log/select the best takes → <strong>assembly cut</strong> (all selected footage, roughly in order) → <strong>rough cut</strong> (trimmed to story shape) → <strong>fine cut</strong> (polished timing, ready for color and sound).</p>
<h3>Continuity editing</h3>
<ul>
<li><strong>Match cut</strong> — cutting between two shots with similar action/composition so the cut feels seamless.</li>
<li><strong>Eyeline match</strong> — a character's look must land in the direction their eyeline suggests, or the geography confuses the audience.</li>
<li><strong>Screen direction / the line</strong> — keep a consistent left-right relationship between subjects across cuts unless you deliberately cross it.</li>
<li><strong>Jump cut</strong> — an abrupt cut breaking continuity; usually an error, sometimes a deliberate stylistic device.</li>
</ul>
<h3>Murch's Rule of Six (from <em>In the Blink of an Eye</em>)</h3>
<p>Walter Murch ranks six criteria for deciding where to cut, weighted by how much each should matter:</p>
<pre><code>Emotion         ~51%   (does it feel right?)
Story           ~23%   (does it advance the story?)
Rhythm          ~10%   (does it cut at an interesting moment?)
Eye-trace        ~7%   (does it follow the viewer's focus of interest?)
2-D plane        ~5%   (respecting screen composition)
3-D space        ~4%   (respecting the geography of action)
</code></pre>
<div class="callout"><span class="badge">Emotion first</span> Murch's key insight: a technically "wrong" cut that feels emotionally right almost always beats a technically perfect cut that feels dead.</div>`,
    `<span class="eyebrow">VDP301 · Chương 6 · Bài 6.1</span>
<h2>Dựng phim &amp; ngữ pháp của cú cắt</h2>
<h3>Quy trình dựng phim</h3>
<p>Nhập &amp; sắp xếp footage → xem/chọn take tốt nhất → <strong>bản ghép thô</strong> (assembly cut — toàn bộ footage đã chọn, xếp gần đúng thứ tự) → <strong>bản cắt thô</strong> (rough cut — cắt gọt theo hình dạng câu chuyện) → <strong>bản cắt tinh</strong> (fine cut — nhịp điệu hoàn thiện, sẵn sàng chỉnh màu và âm thanh).</p>
<h3>Dựng liên tục (continuity)</h3>
<ul>
<li><strong>Match cut</strong> — cắt giữa hai cảnh có hành động/bố cục tương đồng để cú cắt cảm thấy liền mạch.</li>
<li><strong>Eyeline match</strong> — hướng nhìn của nhân vật phải khớp với hướng mà eyeline gợi ý, nếu không khán giả sẽ mất định hướng không gian.</li>
<li><strong>Hướng màn hình / "the line"</strong> — giữ quan hệ trái-phải nhất quán giữa các chủ thể qua các cú cắt, trừ khi chủ đích vượt qua nó.</li>
<li><strong>Jump cut</strong> — cú cắt đột ngột phá vỡ tính liên tục; thường là lỗi, đôi khi là thủ pháp phong cách có chủ đích.</li>
</ul>
<h3>Rule of Six của Murch (từ <em>In the Blink of an Eye</em>)</h3>
<p>Walter Murch xếp hạng sáu tiêu chí để quyết định cắt ở đâu, theo mức độ quan trọng nên có:</p>
<pre><code>Cảm xúc          ~51%   (có cảm thấy đúng không?)
Câu chuyện       ~23%   (có đẩy câu chuyện tiến lên không?)
Nhịp điệu        ~10%   (có cắt vào thời điểm thú vị không?)
Hướng nhìn        ~7%   (có theo đúng điểm khán giả đang chú ý không?)
Mặt phẳng 2D      ~5%   (tôn trọng bố cục màn hình)
Không gian 3D     ~4%   (tôn trọng địa lý của hành động)
</code></pre>
<div class="callout"><span class="badge">Cảm xúc đứng đầu</span> Nhận định chốt của Murch: một cú cắt "sai" về kỹ thuật nhưng đúng về cảm xúc gần như luôn thắng một cú cắt hoàn hảo kỹ thuật nhưng vô cảm.</div>`,
  ]]);

const c6q = quiz('vdp301-quiz-6', 'Quiz 6 — Editing & continuity|||Quiz 6 — Dựng phim & liên tục', [
  { id: 'q1', question: 'Thứ tự đúng của quy trình dựng phim là?', options: ['Cắt tinh → cắt thô → ghép thô', 'Ghép thô → cắt thô → cắt tinh', 'Cắt thô → ghép thô → cắt tinh', 'Không có thứ tự cố định'], correctIndex: 1, explanation: 'Assembly cut → rough cut → fine cut.' },
  { id: 'q2', question: 'Trong Rule of Six của Murch, tiêu chí được xếp trọng số cao NHẤT là gì?', options: ['Không gian 3D', 'Nhịp điệu', 'Cảm xúc', 'Mặt phẳng 2D'], correctIndex: 2, explanation: 'Emotion (~51%) là tiêu chí quan trọng nhất theo Murch.' },
  { id: 'q3', question: 'Jump cut là gì?', options: ['Cú cắt liền mạch theo match cut', 'Cú cắt đột ngột phá vỡ tính liên tục', 'Kỹ thuật chỉnh màu', 'Một loại micro thu âm'], correctIndex: 1, explanation: 'Jump cut phá continuity — thường là lỗi, đôi khi cố ý làm phong cách.' },
]);

const c7 = doc('vdp301-7-1-color-motion-graphics', '7.1 — Color grading, effects & motion graphics|||7.1 — Chỉnh màu, hiệu ứng & đồ hoạ động',
  'Color correction vs color grading; hiệu chỉnh sơ cấp/thứ cấp, LUT, scope; nguyên tắc keyframe/easing cho đồ hoạ động.',
  [[
    `<span class="eyebrow">VDP301 · Chapter 7 · Lesson 7.1</span>
<h2>Color grading, effects &amp; motion graphics</h2>
<h3>Correction vs. grading</h3>
<p><strong>Color correction</strong> fixes technical problems — matching exposure and white balance across shots so a scene looks consistent. <strong>Color grading</strong> is the creative step after that — building a deliberate look/mood using color.</p>
<h3>Primary &amp; secondary correction</h3>
<ul>
<li><strong>Primary</strong> — global adjustments to the whole frame: lift/gamma/gain (or shadows/midtones/highlights), exposure, contrast, saturation.</li>
<li><strong>Secondary</strong> — targeted adjustments to one color or one region only, using a qualifier (isolate a color) or a power window (isolate an area).</li>
</ul>
<p><strong>LUTs</strong> (Look-Up Tables) apply a preset color transform as a fast starting point. <strong>Scopes</strong> — the waveform (brightness/exposure) and vectorscope (hue/saturation) — let you grade by measurement, not just by eye on an uncalibrated monitor. DaVinci Resolve's Color page is the industry-standard tool for this workflow.</p>
<h3>Motion graphics</h3>
<p>Titles, lower thirds and kinetic typography are built with <strong>keyframes</strong> — you set a value at two points in time and the software interpolates between them. <strong>Easing</strong> (ease-in/ease-out) makes that motion feel natural instead of mechanical linear movement.</p>
<div class="callout"><span class="badge">Grade last, always</span> Grade after picture lock (the edit is finalized) — grading a sequence that still gets re-cut wastes the work on shots that may be trimmed or removed.</div>`,
    `<span class="eyebrow">VDP301 · Chương 7 · Bài 7.1</span>
<h2>Chỉnh màu, hiệu ứng &amp; đồ hoạ động</h2>
<h3>Hiệu chỉnh màu vs. chỉnh màu sáng tạo</h3>
<p><strong>Color correction (hiệu chỉnh màu)</strong> sửa các vấn đề kỹ thuật — khớp phơi sáng và white balance giữa các cảnh để một trường đoạn trông nhất quán. <strong>Color grading (chỉnh màu sáng tạo)</strong> là bước sáng tạo sau đó — xây dựng một look/tâm trạng có chủ đích bằng màu sắc.</p>
<h3>Hiệu chỉnh sơ cấp &amp; thứ cấp</h3>
<ul>
<li><strong>Sơ cấp (primary)</strong> — điều chỉnh toàn cục cho cả khung hình: lift/gamma/gain (hoặc shadows/midtones/highlights), phơi sáng, độ tương phản, độ bão hoà.</li>
<li><strong>Thứ cấp (secondary)</strong> — điều chỉnh có mục tiêu chỉ một màu hoặc một vùng, dùng qualifier (chọn theo màu) hoặc power window (chọn theo vùng).</li>
</ul>
<p><strong>LUT</strong> (Look-Up Table) áp một biến đổi màu định sẵn làm điểm khởi đầu nhanh. <strong>Scope</strong> — waveform (độ sáng/phơi sáng) và vectorscope (tông màu/độ bão hoà) — cho phép chỉnh màu dựa trên đo lường, không chỉ nhìn bằng mắt trên màn hình chưa được cân chỉnh. Trang Color của DaVinci Resolve là công cụ chuẩn ngành cho quy trình này.</p>
<h3>Đồ hoạ động</h3>
<p>Tiêu đề, lower third và chữ động (kinetic typography) được dựng bằng <strong>keyframe</strong> — đặt một giá trị tại hai điểm thời gian và phần mềm nội suy giữa chúng. <strong>Easing</strong> (ease-in/ease-out) khiến chuyển động đó cảm thấy tự nhiên thay vì chuyển động tuyến tính cơ khí.</p>
<div class="callout"><span class="badge">Luôn chỉnh màu sau cùng</span> Chỉnh màu sau khi "picture lock" (bản dựng đã chốt) — chỉnh màu một chuỗi cảnh còn có thể bị dựng lại sẽ lãng phí công cho những cảnh có thể bị cắt hoặc gỡ bỏ.</div>`,
  ]]);

const c7q = quiz('vdp301-quiz-7', 'Quiz 7 — Color & motion graphics|||Quiz 7 — Chỉnh màu & đồ hoạ động', [
  { id: 'q1', question: 'Khác biệt chính giữa color correction và color grading là?', options: ['Không khác gì cả', 'Correction sửa lỗi kỹ thuật/khớp cảnh; grading là chỉnh sáng tạo cho look/tâm trạng', 'Correction chỉ dùng cho phim đen trắng', 'Grading luôn làm trước correction'], correctIndex: 1, explanation: 'Correction: kỹ thuật, khớp cảnh. Grading: sáng tạo, xây look.' },
  { id: 'q2', question: 'Power window trong chỉnh màu dùng để làm gì?', options: ['Áp LUT cho toàn bộ dự án', 'Cách ly một VÙNG cụ thể trong khung hình để chỉnh riêng', 'Đo độ ồn âm thanh', 'Xuất file video'], correctIndex: 1, explanation: 'Power window là công cụ hiệu chỉnh thứ cấp, cách ly theo vùng.' },
  { id: 'q3', question: 'Vì sao nên chỉnh màu SAU khi bản dựng đã "picture lock"?', options: ['Vì luật yêu cầu vậy', 'Vì chỉnh màu trước khi chốt dựng dễ lãng phí công cho cảnh có thể bị cắt/đổi', 'Vì phần mềm chỉnh màu chỉ mở được sau khi xuất file', 'Không có lý do, thứ tự tuỳ ý'], correctIndex: 1, explanation: 'Dựng lại sau khi đã chỉnh màu làm mất công chỉnh những cảnh bị thay đổi.' },
]);

const c8 = doc('vdp301-8-1-post-sound-delivery', '8.1 — Post sound, publishing & video distribution|||8.1 — Âm thanh hậu kỳ, xuất bản & phân phối video',
  'Dựng lời thoại/ADR/Foley/âm nhạc, mix theo chuẩn LUFS; codec, tỉ lệ khung hình, tối ưu theo nền tảng số.',
  [[
    `<span class="eyebrow">VDP301 · Chapter 8 · Lesson 8.1</span>
<h2>Post sound, publishing &amp; video distribution</h2>
<h3>Post sound</h3>
<p>The sound mix layers four elements: <strong>dialogue</strong> (cleaned, leveled), <strong>ADR</strong> (Automated Dialogue Replacement — re-recorded lines when the on-set take is unusable), <strong>sound effects/Foley</strong> (footsteps, props, ambience performed and recorded to match picture), and <strong>music</strong>. The final mix targets a loudness standard measured in <strong>LUFS</strong> (Loudness Units Full Scale) — streaming platforms commonly target around <strong>-14 LUFS</strong>; broadcast standards differ and are typically stricter.</p>
<h3>Export &amp; delivery</h3>
<p>A finished video is defined by <strong>codec/container</strong> (e.g. H.264 or H.265 inside an MP4), <strong>resolution</strong> and <strong>aspect ratio</strong> — 16:9 landscape for YouTube/TV, 9:16 vertical for Reels/TikTok/Shorts, 1:1 square for some feed placements — and <strong>bitrate</strong>, which trades file size against visual quality.</p>
<pre><code>Platform        Aspect ratio   Typical loudness target
YouTube         16:9 or 9:16   ~-14 LUFS
Instagram Reels 9:16           ~-14 to -16 LUFS
Broadcast TV    16:9           stricter, regulated per market
</code></pre>
<h3>Distribution optimization</h3>
<p>Add <strong>captions/subtitles</strong> — required for accessibility and essential for silent autoplay on social feeds. Always keep a high-quality <strong>master file</strong> separate from the compressed delivery files, since platform re-encoding degrades quality further.</p>
<div class="callout"><span class="badge">Deliver for the platform, not just the project</span> The same edit needs different exports for different destinations — treat delivery specs as part of the creative brief, not an afterthought.</div>`,
    `<span class="eyebrow">VDP301 · Chương 8 · Bài 8.1</span>
<h2>Âm thanh hậu kỳ, xuất bản &amp; phân phối video</h2>
<h3>Âm thanh hậu kỳ</h3>
<p>Bản mix âm thanh xếp lớp bốn thành phần: <strong>lời thoại</strong> (đã làm sạch, cân bằng mức), <strong>ADR</strong> (Automated Dialogue Replacement — thu lại lời thoại khi take tại hiện trường không dùng được), <strong>hiệu ứng âm thanh/Foley</strong> (tiếng bước chân, đồ vật, không khí xung quanh được diễn và thu khớp với hình ảnh), và <strong>âm nhạc</strong>. Bản mix cuối nhắm tới một chuẩn độ ồn đo bằng <strong>LUFS</strong> (Loudness Units Full Scale) — các nền tảng streaming thường nhắm khoảng <strong>-14 LUFS</strong>; chuẩn phát sóng truyền hình khác và thường khắt khe hơn.</p>
<h3>Xuất &amp; giao file</h3>
<p>Một video hoàn chỉnh được xác định bởi <strong>codec/container</strong> (vd H.264 hoặc H.265 trong MP4), <strong>độ phân giải</strong> và <strong>tỉ lệ khung hình</strong> — 16:9 ngang cho YouTube/TV, 9:16 dọc cho Reels/TikTok/Shorts, 1:1 vuông cho một số vị trí feed — và <strong>bitrate</strong>, đánh đổi giữa kích thước file và chất lượng hình ảnh.</p>
<pre><code>Nền tảng         Tỉ lệ khung hình   Mức độ ồn thường nhắm tới
YouTube          16:9 hoặc 9:16     ~-14 LUFS
Instagram Reels  9:16               ~-14 đến -16 LUFS
Truyền hình      16:9               khắt khe hơn, theo quy định thị trường
</code></pre>
<h3>Tối ưu phân phối</h3>
<p>Thêm <strong>phụ đề</strong> — cần cho khả năng tiếp cận và thiết yếu cho tự động phát không tiếng trên feed mạng xã hội. Luôn giữ một <strong>file master</strong> chất lượng cao riêng biệt với các file giao đã nén, vì nén lại trên nền tảng làm giảm chất lượng thêm nữa.</p>
<div class="callout"><span class="badge">Giao đúng cho từng nền tảng, không chỉ cho dự án</span> Cùng một bản dựng cần các bản xuất khác nhau cho các đích khác nhau — xem chuẩn giao file là một phần của brief sáng tạo, không phải việc làm thêm sau cùng.</div>`,
  ]]);

const c8q = quiz('vdp301-quiz-8', 'Quiz 8 — Post sound & delivery|||Quiz 8 — Âm thanh hậu kỳ & xuất bản', [
  { id: 'q1', question: 'ADR trong âm thanh hậu kỳ là gì?', options: ['Một loại hiệu ứng hình ảnh', 'Thu lại lời thoại khi take tại hiện trường không dùng được', 'Chuẩn nén video', 'Loại micro thu âm'], correctIndex: 1, explanation: 'ADR = Automated Dialogue Replacement, tái thu lời thoại.' },
  { id: 'q2', question: 'LUFS dùng để đo điều gì trong mix âm thanh?', options: ['Độ phân giải hình ảnh', 'Mức độ ồn (loudness) tổng thể', 'Tốc độ khung hình', 'Tỉ lệ khung hình'], correctIndex: 1, explanation: 'LUFS đo loudness — nền tảng streaming thường nhắm khoảng -14 LUFS.' },
  { id: 'q3', question: 'Vì sao nên giữ một file master riêng, chất lượng cao, tách biệt với file giao cho nền tảng?', options: ['Vì luật bắt buộc', 'Vì nền tảng thường nén lại, làm giảm chất lượng thêm mỗi lần', 'Vì file master không cần âm thanh', 'Vì không thể xuất nhiều bản từ một file'], correctIndex: 1, explanation: 'Nén lại trên nền tảng làm giảm chất lượng — cần giữ bản gốc chất lượng cao để tái sử dụng.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'VDP301',
    slug: 'vdp301-video-production',
    title: 'Video Production',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/VDP301.webp',
    shortDescription: 'How video gets made — the 3-phase workflow, from script & storyboard through camera/exposure, framing, lighting/sound, editing grammar, color grading & motion graphics, to post sound & delivery. Bilingual, with examples & quizzes.|||Video được làm ra thế nào — quy trình 3 giai đoạn, từ kịch bản & storyboard qua máy quay/phơi sáng, bố cục, ánh sáng/âm thanh, ngữ pháp dựng, chỉnh màu & đồ hoạ động, đến âm thanh hậu kỳ & xuất bản. Song ngữ, có ví dụ & quiz.',
    description: 'Môn <strong>VDP301 — Video Production</strong> (kỳ 4, khối Quản trị Kinh doanh — Truyền thông) dạy <strong>video được làm ra thế nào</strong> qua quy trình thật của ngành. Từ <strong>tiền kỳ</strong> (ý tưởng, kịch bản, storyboard) → <strong>sản xuất</strong> (máy quay/ống kính, tam giác phơi sáng, bố cục &amp; ngôn ngữ hình ảnh, ánh sáng &amp; âm thanh) → <strong>hậu kỳ</strong> (dựng phim &amp; ngữ pháp dựng liên tục, chỉnh màu &amp; đồ hoạ động, âm thanh hậu kỳ &amp; xuất bản cho nền tảng số). Bám các tài liệu nền của ngành: <em>The Filmmaker\'s Handbook</em>, <em>In the Blink of an Eye</em>, <em>Grammar of the Shot</em>, tài liệu Adobe Premiere/DaVinci Resolve — song ngữ, có ví dụ và quiz mỗi chương.',
    whatYouLearn: 'Quy trình 3 giai đoạn (tiền kỳ/sản xuất/hậu kỳ); logline, treatment, format kịch bản chuẩn, storyboard & shot list; tam giác phơi sáng (khẩu độ, tốc độ màn trập, ISO), quy tắc 180 độ, tiêu cự ống kính; rule of thirds, cỡ cảnh (WS/MS/CU/ECU), chuyển động & góc máy; chiếu sáng ba điểm, nhiệt độ màu, thu âm hiện trường; quy trình dựng (ghép thô→cắt tinh), continuity, Rule of Six của Murch; color correction/grading, LUT, scope, keyframe/easing; mix âm thanh hậu kỳ (LUFS), codec, tỉ lệ khung hình, tối ưu theo nền tảng.',
    requirements: 'Không yêu cầu kinh nghiệm quay/dựng trước đó. Nên có điện thoại/máy quay bất kỳ và cài sẵn DaVinci Resolve (miễn phí) để thực hành.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình FLM, sách nền, tài liệu Adobe Premiere/DaVinci Resolve, kênh học, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Sản xuất video, quy trình 3 giai đoạn, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan & quy trình 3 giai đoạn|||Chapter 1 — Overview & the 3-phase workflow', description: 'Pre/production/post, vai trò kíp làm phim.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Tiền kỳ: ý tưởng, kịch bản & storyboard|||Chapter 2 — Pre-production: idea, script & storyboard', description: 'Logline, format kịch bản, storyboard, shot list.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Máy quay, ống kính & phơi sáng|||Chapter 3 — Camera, lens & exposure', description: 'Tam giác phơi sáng, quy tắc 180 độ, tiêu cự.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Bố cục khung hình & ngôn ngữ hình ảnh|||Chapter 4 — Framing & the visual language', description: 'Rule of thirds, cỡ cảnh, chuyển động & góc máy.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Ánh sáng & âm thanh khi quay|||Chapter 5 — Lighting & sound on set', description: 'Chiếu sáng ba điểm, nhiệt độ màu, thu âm hiện trường.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Dựng phim & ngữ pháp dựng|||Chapter 6 — Editing & the grammar of the cut', description: 'Continuity, Rule of Six của Murch, nhịp điệu.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Chỉnh màu, hiệu ứng & đồ hoạ động|||Chapter 7 — Color grading, effects & motion graphics', description: 'Correction vs grading, LUT, scope, keyframe.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Âm thanh hậu kỳ, xuất bản & phân phối|||Chapter 8 — Post sound, publishing & distribution', description: 'Mix theo LUFS, codec, tỉ lệ khung hình, tối ưu nền tảng.', lessons: [c8, c8q] },
  ],
};
